// Ambiance sonore entièrement synthétisée (Web Audio) : pluie, vent,
// houle, moteur, tonnerre, tirs, explosions.
export class StormAudio {
  constructor() {
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0.8;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    this.master.connect(comp).connect(c.destination);

    this.white = this.noiseBuffer(3, 'white');
    this.brown = this.noiseBuffer(4, 'brown');

    // pluie
    this.rain = this.loop(this.white, [['highpass', 900], ['lowpass', 8000]], 0.16);
    // vent : bande passante modulée
    const wind = this.loop(this.white, [['bandpass', 420, 0.7]], 0.22);
    const lfo = c.createOscillator(); lfo.frequency.value = 0.09;
    const lfoGain = c.createGain(); lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(wind.filters[0].frequency); lfo.start();
    const lfo2 = c.createOscillator(); lfo2.frequency.value = 0.23;
    const lfo2g = c.createGain(); lfo2g.gain.value = 0.08;
    lfo2.connect(lfo2g).connect(wind.gain.gain); lfo2.start();
    // houle grave
    this.sea = this.loop(this.brown, [['lowpass', 260]], 0.55);

    // moteur : deux oscillateurs filtrés
    this.engGain = c.createGain(); this.engGain.gain.value = 0;
    this.engFilter = c.createBiquadFilter(); this.engFilter.type = 'lowpass'; this.engFilter.frequency.value = 500;
    this.engA = c.createOscillator(); this.engA.type = 'sawtooth'; this.engA.frequency.value = 40;
    this.engB = c.createOscillator(); this.engB.type = 'square'; this.engB.frequency.value = 81;
    const gB = c.createGain(); gB.gain.value = 0.35;
    this.engA.connect(this.engFilter); this.engB.connect(gB).connect(this.engFilter);
    this.engFilter.connect(this.engGain).connect(this.master);
    this.engA.start(); this.engB.start();

    // grondement de la vague finale
    this.roar = this.loop(this.brown, [['lowpass', 180]], 0);
  }

  noiseBuffer(sec, kind) {
    const c = this.ctx;
    const b = c.createBuffer(1, c.sampleRate * sec, c.sampleRate);
    const d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return b;
  }

  loop(buffer, filters, gain) {
    const c = this.ctx;
    const src = c.createBufferSource(); src.buffer = buffer; src.loop = true;
    let node = src;
    const fs = filters.map(([type, f, q]) => {
      const bf = c.createBiquadFilter(); bf.type = type; bf.frequency.value = f; if (q) bf.Q.value = q;
      node.connect(bf); node = bf; return bf;
    });
    const g = c.createGain(); g.gain.value = gain;
    node.connect(g).connect(this.master);
    src.start(0, Math.random() * buffer.duration);
    return { src, filters: fs, gain: g };
  }

  burst(buffer, { type = 'lowpass', f = 1000, f2 = null, q = 0.7, gain = 1, attack = 0.005, decay = 0.4, delay = 0, pan = 0, rate = 1 }) {
    const c = this.ctx, t = c.currentTime + delay;
    const src = c.createBufferSource(); src.buffer = buffer; src.playbackRate.value = rate;
    const bf = c.createBiquadFilter(); bf.type = type; bf.Q.value = q;
    bf.frequency.setValueAtTime(f, t);
    if (f2) bf.frequency.exponentialRampToValueAtTime(f2, t + decay);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    const p = c.createStereoPanner(); p.pan.value = pan;
    src.connect(bf).connect(g).connect(p).connect(this.master);
    src.start(t, Math.random() * 1.5);
    src.stop(t + attack + decay + 0.05);
  }

  thump(freq, gain, decay, delay = 0) {
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.4, t + decay);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + decay + 0.05);
  }

  thunder(delay, k = 1) {
    this.burst(this.white, { type: 'highpass', f: 1800, gain: 0.35 * k, attack: 0.002, decay: 0.25, delay });
    this.burst(this.brown, { f: 900, f2: 90, gain: 1.4 * k, attack: 0.05, decay: 4.5, delay: delay + 0.05 });
    this.burst(this.brown, { f: 300, f2: 60, gain: 1.0 * k, attack: 0.3, decay: 3.5, delay: delay + 0.6 });
  }
  gunshot(gain = 1, pan = 0, far = false) {
    this.burst(this.white, { type: 'bandpass', f: far ? 900 : 2200, f2: 300, q: 0.6, gain: 0.9 * gain, attack: 0.001, decay: far ? 0.35 : 0.18, pan });
    this.thump(far ? 90 : 140, 0.6 * gain, 0.12);
  }
  explosion(gain = 1) {
    this.burst(this.brown, { f: 1400, f2: 70, gain: 1.6 * gain, attack: 0.01, decay: 2.8 });
    this.burst(this.white, { f: 3000, f2: 200, gain: 0.5 * gain, attack: 0.002, decay: 0.8 });
    this.thump(60, 1.2 * gain, 0.9);
  }
  slam(k = 1) {
    this.thump(55, 0.6 * k, 0.35);
    this.burst(this.white, { f: 2500, f2: 400, gain: 0.35 * k, attack: 0.01, decay: 0.7 });
  }
  impact() {
    this.burst(this.white, { type: 'bandpass', f: 3500, q: 3, gain: 0.5, attack: 0.001, decay: 0.08 });
  }
  whiz(pan) {
    this.burst(this.white, { type: 'bandpass', f: 5000, f2: 1500, q: 6, gain: 0.25, attack: 0.02, decay: 0.15, pan });
  }
  click() { this.burst(this.white, { type: 'highpass', f: 4000, gain: 0.3, attack: 0.001, decay: 0.04 }); }
  reload() {
    this.burst(this.white, { type: 'bandpass', f: 2500, q: 4, gain: 0.3, attack: 0.001, decay: 0.05, delay: 0.1 });
    this.burst(this.white, { type: 'bandpass', f: 1800, q: 4, gain: 0.35, attack: 0.001, decay: 0.06, delay: 1.0 });
  }

  update(speed, throttle, roar = 0) {
    const t = this.ctx.currentTime;
    const s = Math.min(1, Math.abs(speed) / 26);
    this.engA.frequency.setTargetAtTime(38 + s * 70 + throttle * 10, t, 0.15);
    this.engB.frequency.setTargetAtTime(77 + s * 140 + throttle * 20, t, 0.15);
    this.engFilter.frequency.setTargetAtTime(380 + s * 1300 + throttle * 300, t, 0.2);
    this.engGain.gain.setTargetAtTime(0.06 + s * 0.12 + throttle * 0.05, t, 0.2);
    this.roar.gain.gain.setTargetAtTime(roar * 2.2, t, 0.3);
  }

  suspend() { this.ctx.suspend(); }
  resume() { this.ctx.resume(); }
}
