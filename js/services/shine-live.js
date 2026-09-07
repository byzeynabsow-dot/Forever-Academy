/* =========================================================
   Talk & Shine — service de conversation temps réel avec SHINE
   ---------------------------------------------------------
   Chaîne : micro → PCM 16 kHz → Gemini Live → PCM 24 kHz → haut-parleur
   Le navigateur n'obtient jamais la clé : il demande un jeton
   éphémère à /api/token, qui expire en quelques minutes.

   États exposés : idle · connecting · listening · thinking · speaking · error
   ========================================================= */
window.ShineLive = (function () {
  'use strict';

  /* Build ESM du SDK officiel : on ne réimplémente pas le protocole
     WebSocket de Gemini à la main. */
  var SDK_URL = 'https://cdn.jsdelivr.net/npm/@google/genai@1.30.0/+esm';

  var IN_RATE = 16000;    // imposé par l'API : PCM 16 bits mono 16 kHz
  var OUT_RATE = 24000;   // l'API répond en PCM 16 bits mono 24 kHz
  var IDLE_TIMEOUT_MS = 90 * 1000;   // fermeture auto si plus personne ne parle

  var listeners = { state: [], transcript: [], error: [] };
  var state = 'idle';

  var session = null, sdk = null;
  var micCtx = null, micStream = null, micNode = null, micSource = null;
  var outCtx = null, playHead = 0, sources = [];
  var analyser = null, levelBuf = null;   // amplitude réelle de la voix de SHINE
  var idleTimer = null, hardTimer = null;
  var micEnabled = true;

  /* ---------------- événements ---------------- */
  function on(evt, cb) { if (listeners[evt]) listeners[evt].push(cb); }
  function emit(evt, payload) { (listeners[evt] || []).forEach(function (cb) { try { cb(payload); } catch (e) {} }); }
  function setState(s) { if (s !== state) { state = s; emit('state', s); } }
  function fail(message, detail) {
    setState('error');
    emit('error', { message: message, detail: detail || '' });
  }

  /* ---------------- capacités du navigateur ---------------- */
  function support() {
    var secure = window.isSecureContext || location.hostname === 'localhost';
    return {
      websocket: typeof WebSocket !== 'undefined',
      audio: !!(window.AudioContext || window.webkitAudioContext),
      // Lire AudioContext.prototype.audioWorklet déclenche le getter sans instance
      // (« Illegal invocation ») : on teste la présence du constructeur à la place.
      worklet: typeof window.AudioWorkletNode !== 'undefined',
      mic: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      secure: secure,
      // La voix exige toutes ces briques ; sinon on bascule en texte.
      voice: secure && !!(window.AudioContext || window.webkitAudioContext) &&
             !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
             typeof WebSocket !== 'undefined'
    };
  }

  /* ---------------- utilitaires audio ---------------- */
  function floatToPCM16(f32) {
    var out = new Int16Array(f32.length);
    for (var i = 0; i < f32.length; i++) {
      var s = Math.max(-1, Math.min(1, f32[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return out;
  }
  function toBase64(bytes) {
    var bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }
  function fromBase64(b64) {
    var bin = atob(b64), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* Le worklet vit dans un Blob : pas de fichier séparé à déployer. */
  var WORKLET_SRC = [
    'class Cap extends AudioWorkletProcessor {',
    '  process(inputs){',
    '    const ch = inputs[0] && inputs[0][0];',
    '    if (ch && ch.length) this.port.postMessage(new Float32Array(ch));',
    '    return true;',
    '  }',
    '}',
    'registerProcessor("shine-capture", Cap);'
  ].join('\n');

  /* ---------------- lecture de la voix de SHINE ---------------- */
  function playChunk(bytes) {
    if (!outCtx) return;
    var pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    var buf = outCtx.createBuffer(1, pcm.length, OUT_RATE);
    var ch = buf.getChannelData(0);
    for (var i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 32768;

    var src = outCtx.createBufferSource();
    src.buffer = buf;
    src.connect(analyser || outCtx.destination);
    var now = outCtx.currentTime;
    if (playHead < now) playHead = now;
    src.start(playHead);
    playHead += buf.duration;
    sources.push(src);
    src.onended = function () {
      var i = sources.indexOf(src);
      if (i >= 0) sources.splice(i, 1);
      // Plus rien en file : SHINE a fini de parler, elle réécoute.
      if (!sources.length && state === 'speaking') setState(micEnabled ? 'listening' : 'idle');
    };
    setState('speaking');
  }

  /* Interruption : l'élève reprend la parole, on coupe net. */
  function stopPlayback() {
    sources.forEach(function (s) { try { s.stop(); } catch (e) {} });
    sources = [];
    playHead = outCtx ? outCtx.currentTime : 0;
  }

  /* ---------------- minuteries (contrôle des coûts) ---------------- */
  function touchIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      stop('Session fermée après 90 secondes sans échange.');
    }, IDLE_TIMEOUT_MS);
  }

  /* ---------------- démarrage ---------------- */
  async function start(profile, opts) {
    opts = opts || {};
    if (session) return;
    setState('connecting');

    /* 1. obtenir de quoi se connecter.
       MODE 1 : un serveur nous donne un jeton court (la clé reste chez lui).
       MODE 2 : la clé est écrite dans config.js — pratique, mais publique. */
    var CFG = window.TS_CONFIG || {};
    var directKey = String(CFG.geminiApiKey || '').trim();
    var info, sysPrompt = buildInstruction(profile);

    if (directKey) {
      info = {
        token: directKey,
        model: CFG.geminiLiveModel || 'gemini-3.1-flash-live-preview',
        apiVersion: 'v1beta',
        direct: true,
        expiresInMs: 10 * 60 * 1000
      };
    } else {
      var res;
      try {
        res = await fetch(CFG.tokenEndpoint || '/api/token', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            level: profile.level || 'A2',
            name: profile.name || '',
            topic: profile.topic || ''
          })
        });
        info = await res.json();
      } catch (e) {
        /* Pas de serveur joignable ET pas de clé dans la page : c'est le
           cas d'un site hébergé sans backend. On le dit franchement. */
        fail("SHINE vocal n'est pas configuré. Ouvre js/config.js et colle ta clé Gemini dans « geminiApiKey », " +
             "ou installe la fonction serveur qui fournit /api/token.", String(e));
        return;
      }
      if (!res.ok) {
        var msg = info && info.message ? info.message : 'Le service vocal a refusé la connexion.';
        if (info && info.error === 'not_configured') msg = "SHINE vocal n'est pas encore configuré sur ce site (clé Gemini absente).";
        fail(msg, info && info.error);
        return;
      }
    }

    /* 2. SDK officiel */
    try {
      if (!sdk) sdk = await import(SDK_URL);
    } catch (e) {
      fail("Impossible de charger le moteur vocal (bloqué par le réseau ?).", String(e));
      return;
    }

    /* 3. sortie audio prête avant la connexion (geste utilisateur requis sur iOS) */
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      outCtx = new AC({ sampleRate: OUT_RATE });
      if (outCtx.state === 'suspended') await outCtx.resume();
      // L'analyseur mesure l'amplitude réelle de la voix : c'est lui qui
      // pilote l'ouverture de la bouche de l'avatar (pas une animation
      // décorative jouée en aveugle).
      analyser = outCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.6;
      levelBuf = new Uint8Array(analyser.fftSize);
      analyser.connect(outCtx.destination);
      playHead = outCtx.currentTime;
    } catch (e) {
      fail("Le navigateur refuse de jouer du son.", String(e));
      return;
    }

    /* 4. session Live */
    var ai;
    try {
      ai = new sdk.GoogleGenAI({
        apiKey: info.token,
        httpOptions: { apiVersion: info.apiVersion || 'v1alpha' }
      });
      /* La consigne pédagogique est scellée dans le jeton quand l'API le
         permet (info.constraintsLocked). Sinon — version d'API qui ignore
         ce verrouillage, ou clé directe — on l'envoie avec la connexion. */
      var liveConfig = { responseModalities: ['AUDIO'] };
      if (info.direct || info.constraintsLocked === false) {
        liveConfig.systemInstruction = { parts: [{ text: info.systemInstruction || sysPrompt }] };
        liveConfig.inputAudioTranscription = {};
        liveConfig.outputAudioTranscription = {};
      }
      session = await ai.live.connect({
        model: info.model,
        config: liveConfig,
        callbacks: {
          onopen: function () { touchIdle(); setState(micEnabled ? 'listening' : 'idle'); },
          onmessage: handleMessage,
          onerror: function (e) { fail("La conversation a été interrompue.", (e && e.message) || String(e)); },
          onclose: function () { cleanup(); setState('idle'); }
        }
      });
    } catch (e) {
      cleanup();
      fail("SHINE n'a pas pu ouvrir la session.", (e && e.message) || String(e));
      return;
    }

    /* 5. plafond dur de session */
    clearTimeout(hardTimer);
    hardTimer = setTimeout(function () {
      stop('Session terminée : durée maximale atteinte.');
    }, Math.max(30000, (info.expiresInMs || 600000) - 5000));

    /* 6. micro — facultatif : le mode texte fonctionne sans */
    if (opts.voice !== false) {
      try { await openMic(); }
      catch (e) {
        emit('error', { message: "Micro indisponible : tu peux écrire à SHINE.", detail: String(e), recoverable: true });
        micEnabled = false;
        setState('idle');
      }
    } else {
      micEnabled = false;
      setState('idle');
    }
  }

  async function openMic() {
    var AC = window.AudioContext || window.webkitAudioContext;
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
    micCtx = new AC({ sampleRate: IN_RATE });
    if (micCtx.state === 'suspended') await micCtx.resume();

    var blob = new Blob([WORKLET_SRC], { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    await micCtx.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);

    micSource = micCtx.createMediaStreamSource(micStream);
    micNode = new AudioWorkletNode(micCtx, 'shine-capture');
    micNode.port.onmessage = function (ev) {
      if (!session || !micEnabled) return;
      var pcm = floatToPCM16(ev.data);
      try {
        session.sendRealtimeInput({
          audio: { data: toBase64(new Uint8Array(pcm.buffer)), mimeType: 'audio/pcm;rate=' + IN_RATE }
        });
      } catch (e) { /* session déjà fermée */ }
    };
    micSource.connect(micNode);
    // Nœud muet : on capture sans réinjecter le micro dans les haut-parleurs.
    var mute = micCtx.createGain();
    mute.gain.value = 0;
    micNode.connect(mute).connect(micCtx.destination);
    micEnabled = true;
    setState('listening');
  }

  /* Consigne pédagogique — utilisée seulement en mode clé directe.
     En mode jeton, c'est le serveur qui la construit et la verrouille. */
  function buildInstruction(profile) {
    var level = ['A1','A2','B1','B2','C1'].indexOf(profile.level) >= 0 ? profile.level : 'A2';
    var name = String(profile.name || '').slice(0, 40) || 'the learner';
    var topic = String(profile.topic || '').replace(/[\r\n]+/g, ' ').slice(0, 300);
    var pace = {
      A1: "Speak very slowly and simply. Use short present-tense sentences and the 500 most common words. Ask one short question at a time. Expect one- or two-word answers and celebrate them.",
      A2: "Speak slowly and clearly. Use everyday vocabulary and simple past and future. Ask short questions and help the learner extend answers to a full sentence.",
      B1: "Speak at a natural but unhurried pace. Encourage full sentences, opinions and reasons. Introduce useful connectors and phrasal verbs.",
      B2: "Speak at natural pace. Push for nuance, hypotheticals and argument. Correct register and collocation errors, not just grammar.",
      C1: "Speak at full natural pace, including idiom and understatement. Challenge precision, register and structure. Corrections should be about style and subtlety."
    }[level];
    return [
      "You are SHINE, the English teacher of the Talk & Shine academy.",
      "You are speaking with " + name + ", a French-speaking learner at CEFR level " + level + ".",
      pace,
      topic ? "Today's focus, taken from the lesson the learner has open: " + topic
            : "Start by asking what the learner would like to practise today.",
      "",
      "How you correct, in this exact order:",
      "1. Let the learner finish their sentence. Never interrupt to correct.",
      "2. React to the meaning first, warmly and briefly.",
      "3. Name one error only — the one that matters most.",
      "4. Give the correct form and say why in one short sentence.",
      "5. Ask the learner to say the corrected sentence back to you.",
      "",
      "Rules you never break:",
      "- Never mock, never say the learner is bad. Encourage every attempt.",
      "- Speak English by default. Switch to French only to unblock a genuine misunderstanding, then return to English.",
      "- Keep your turns short: two or three sentences, then hand the floor back.",
      "- Never claim to score or measure pronunciation numerically. Give qualitative feedback in words.",
      "- You are SHINE from Talk & Shine. Never mention Google, Gemini, or that you are a language model."
    ].join('\n');
  }

  /* Quel mode est actif ? Utilisé par l'interface pour prévenir
     honnêtement quand la clé est exposée dans la page. */
  function mode() {
    var CFG = window.TS_CONFIG || {};
    if (String(CFG.geminiApiKey || '').trim()) return 'direct';
    return 'token';
  }

  /* ---------------- messages du serveur ---------------- */
  function handleMessage(message) {
    touchIdle();
    var sc = message && message.serverContent;

    if (message && message.setupComplete) { setState(micEnabled ? 'listening' : 'idle'); return; }
    if (!sc) return;

    // L'élève a repris la parole pendant que SHINE parlait.
    if (sc.interrupted) { stopPlayback(); setState('listening'); return; }

    if (sc.inputTranscription && sc.inputTranscription.text) {
      emit('transcript', { who: 'user', text: sc.inputTranscription.text, partial: true });
      if (state === 'listening') setState('thinking');
    }
    if (sc.outputTranscription && sc.outputTranscription.text) {
      emit('transcript', { who: 'shine', text: sc.outputTranscription.text, partial: true });
    }

    var parts = sc.modelTurn && sc.modelTurn.parts;
    if (parts) {
      parts.forEach(function (p) {
        if (p.inlineData && p.inlineData.data) playChunk(fromBase64(p.inlineData.data));
        else if (p.text) emit('transcript', { who: 'shine', text: p.text, partial: true });
      });
    }

    if (sc.turnComplete) {
      emit('transcript', { who: null, text: '', turnComplete: true });
      if (!sources.length) setState(micEnabled ? 'listening' : 'idle');
    }
  }

  /* ---------------- mode texte ---------------- */
  function sendText(text) {
    if (!session || !text) return false;
    touchIdle();
    emit('transcript', { who: 'user', text: text, final: true });
    setState('thinking');
    try {
      session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: text }] }], turnComplete: true });
      return true;
    } catch (e) {
      fail("Le message n'est pas parti.", String(e));
      return false;
    }
  }

  function setMic(enabled) {
    micEnabled = !!enabled;
    if (!micEnabled) setState(state === 'speaking' ? 'speaking' : 'idle');
    else if (state === 'idle') setState('listening');
    return micEnabled;
  }

  /* ---------------- arrêt propre ---------------- */
  function cleanup() {
    clearTimeout(idleTimer); clearTimeout(hardTimer);
    stopPlayback();
    if (micNode) { try { micNode.port.onmessage = null; micNode.disconnect(); } catch (e) {} }
    if (micSource) { try { micSource.disconnect(); } catch (e) {} }
    if (micStream) { micStream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} }); }
    if (micCtx) { try { micCtx.close(); } catch (e) {} }
    if (outCtx) { try { outCtx.close(); } catch (e) {} }
    micNode = micSource = micStream = micCtx = outCtx = null;
    analyser = null; levelBuf = null;
    session = null;
  }

  function stop(reason) {
    if (session) { try { session.close(); } catch (e) {} }
    cleanup();
    setState('idle');
    if (reason) emit('error', { message: reason, recoverable: true, ended: true });
  }

  window.addEventListener('pagehide', function () { stop(); });

  return {
    support: support,
    mode: mode,
    start: start,
    stop: stop,
    sendText: sendText,
    setMic: setMic,
    on: on,
    getState: function () { return state; },
    /* Amplitude instantanée de la voix de SHINE, 0 → 1.
       Renvoie 0 si aucune session audio n'est ouverte. */
    getOutputLevel: function () {
      if (!analyser || !levelBuf) return 0;
      analyser.getByteTimeDomainData(levelBuf);
      var peak = 0;
      for (var i = 0; i < levelBuf.length; i++) {
        var v = Math.abs(levelBuf[i] - 128) / 128;
        if (v > peak) peak = v;
      }
      return Math.min(1, peak * 2.2);
    }
  };
})();
