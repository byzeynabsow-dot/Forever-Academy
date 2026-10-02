// TEMPÊTE — prologue jouable en deux chapitres : la poursuite en vedette
// dans la tempête, puis la traversée à pied du cargo. Hommage non officiel.
import * as THREE from 'three';
import { EffectComposer } from '../lib/postprocessing/EffectComposer.js';
import { RenderPass } from '../lib/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../lib/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../lib/postprocessing/OutputPass.js';
import { ShaderPass } from '../lib/postprocessing/ShaderPass.js';
import { createOcean, heightAt, sea, SPOTS } from './ocean.js';
import { createSky, createRain, Lightning, Particles, Tracers, Wake, createBeam } from './effects.js';
import { makeSpeedboat, makeMercBoat, makeCharacter, animateCharacter, setWeapon, makeCargoShip, makeFloatingContainer } from './models.js';
import { StormAudio } from './audio.js';
import { LINES } from './lines.js';
import { settings, loadSettings, bindSettingsForm } from './settings.js';
import { AimAssist, pickTarget } from './aim.js';
import { DeckAct } from './deck.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');
loadSettings();
const forceLow = params.get('q') === 'low';

/* =========================================================== rendu */
const canvas = $('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
let pixelRatio = 1;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.55;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 6000);

const env = {
  uTime: { value: 0 },
  uFlash: { value: 0 },
  uFlashDir: { value: new THREE.Vector3(0.3, 0.6, 0.7).normalize() },
  uZenith: { value: new THREE.Color(0.004, 0.0085, 0.015) },
  uHorizon: { value: new THREE.Color(0.021, 0.039, 0.052) },
  uFogDensity: { value: 0.0021 },
};
scene.fog = new THREE.FogExp2(env.uHorizon.value.clone(), env.uFogDensity.value);

const hemi = new THREE.HemisphereLight(0x6a7c96, 0x0b1216, 1.5);
const moon = new THREE.DirectionalLight(0x8a9ab6, 0.45);
moon.position.set(-200, 300, 100);
scene.add(hemi, moon);

const ocean = createOcean(env);
const sky = createSky(env);
const rain = createRain(env);
scene.add(ocean.mesh, sky, rain.mesh);

const spray = new Particles(3000, false, 0.0);
const smoke = new Particles(900, false, 0.0);
smoke.uniforms.uNear.value = 3;
const fire = new Particles(1200, true, 0.0);
fire.uniforms.uNear.value = 1;
const tracers = new Tracers();
scene.add(spray.mesh, smoke.mesh, fire.mesh, tracers.mesh);

// post-traitement
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.45, 0.55, 1.1);
composer.addPass(bloom);
composer.addPass(new OutputPass());
const finalPass = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uDamage: { value: 0 },
    uWhite: { value: 0 }, uFade: { value: 0 }, uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
    uWet: { value: 0.4 }, uFlash: env.uFlash,
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float uTime, uDamage, uWhite, uFade, uWet, uFlash; uniform vec2 uRes;
    varying vec2 vUv;
    float h21(vec2 p) { p = fract(p * vec2(233.34, 851.73)); p += dot(p, p + 23.45); return fract(p.x * p.y); }
    // gouttes sur l'objectif : chaque cellule porte au plus une goutte qui naît,
    // glisse un peu puis sèche ; renvoie la déviation de réfraction (xy) et le masque (z)
    vec3 drops(vec2 uv, float scale, float t, float seed) {
      vec2 st = uv * vec2(uRes.x / uRes.y, 1.0) * scale;
      vec2 id = floor(st);
      float n = h21(id + seed);
      float life = fract(t * (0.12 + n * 0.1) + n * 7.0);
      st.y += life * life * 0.35 * step(0.8, n);
      vec2 f = fract(st) - 0.5;
      vec2 c = (vec2(h21(id + seed + 1.7), h21(id + seed + 9.2)) - 0.5) * 0.55;
      float r = 0.1 + 0.2 * h21(id + seed + 4.4);
      vec2 d = f - c;
      d.y *= 1.0 + 0.4 * step(0.8, n);
      float l = length(d);
      float m = smoothstep(r, r * 0.65, l) * step(0.42, n) * smoothstep(1.0, 0.7, life);
      return vec3(d / r * m, m);
    }
    void main() {
      vec2 uv = vUv;
      vec3 dA = drops(vUv, 9.0, uTime, 0.0);
      vec3 dB = drops(vUv, 17.0, uTime * 1.3, 31.0);
      vec2 off = (dA.xy * 0.012 + dB.xy * 0.006) * uWet;
      float wetMask = max(dA.z, dB.z) * uWet;
      vec2 c = uv - 0.5;
      vec2 tuv = uv - off;
      float ca = 0.0012 + uDamage * 0.006;
      vec3 col;
      col.r = texture2D(tDiffuse, tuv + c * ca).r;
      col.g = texture2D(tDiffuse, tuv).g;
      col.b = texture2D(tDiffuse, tuv - c * ca).b;
      float l = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(col, vec3(l), clamp(uDamage * 1.1, 0.0, 0.92));
      float r = length(c * vec2(1.0, 0.8));
      col = mix(col, col * vec3(1.15, 0.25, 0.2), uDamage * 0.6 * smoothstep(0.25, 0.75, r));
      col *= mix(0.42, 1.0, smoothstep(0.82, 0.22, r));
      float g = fract(sin(dot(vUv * uRes + fract(uTime) * 91.7, vec2(12.9898, 78.233))) * 43758.5453);
      col += (g - 0.5) * 0.04;
      col *= 1.0 - wetMask * 0.03;
      col += wetMask * (0.015 + uFlash * 0.08) * smoothstep(0.2, -0.6, (dA.y + dB.y));
      col = mix(col, vec3(0.92, 0.95, 1.0), uWhite);
      col *= 1.0 - uFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
});
composer.addPass(finalPass);

function applyQuality() {
  pixelRatio = settings.quality === 'basse' || forceLow ? 1 : Math.min(devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);
  composer.setPixelRatio(pixelRatio);
  resize();
}
function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  finalPass.uniforms.uRes.value.set(innerWidth * pixelRatio, innerHeight * pixelRatio);
}
addEventListener('resize', resize);
applyQuality();

/* ========================================================= bateaux */
class Boat {
  constructor(obj, o) {
    Object.assign(this, {
      obj, x: 0, z: 0, heading: 0, speed: 0, y: 0, vy: 0, pitch: 0, roll: 0, air: 0,
      L: o.L, B: o.B, maxSpeed: o.maxSpeed, boostSpeed: o.boostSpeed ?? o.maxSpeed,
      turn: o.turn ?? 0.9, onSlam: null, sink: 0, steer: 0,
    });
  }
  get fx() { return Math.sin(this.heading); }
  get fz() { return Math.cos(this.heading); }
  update(dt, t, throttle, steer, boost = false) {
    this.steer += (steer - this.steer) * (1 - Math.exp(-5 * dt));
    const top = boost ? this.boostSpeed : this.maxSpeed;
    const target = throttle >= 0 ? throttle * top : throttle * top * 0.35;
    const rate = Math.abs(target) > Math.abs(this.speed) ? (boost ? 0.75 : 0.5) : 0.4;
    const grip = this.air > 0.15 ? 0.15 : 1;
    this.speed += (target - this.speed) * (1 - Math.exp(-rate * grip * dt));
    if (this.sink > 0) this.speed *= Math.exp(-1.5 * dt);
    const turnK = Math.min(1, Math.abs(this.speed) / 7 + 0.18) * (this.speed < -0.5 ? -1 : 1);
    this.heading += this.steer * this.turn * turnK * dt * (this.air > 0.15 ? 0.25 : 1);
    this.x += this.fx * this.speed * dt;
    this.z += this.fz * this.speed * dt;

    const fx = this.fx, fz = this.fz, rx = Math.cos(this.heading), rz = -Math.sin(this.heading);
    const hl = this.L * 0.42, hb = this.B * 0.45;
    const hB = heightAt(this.x + fx * hl, this.z + fz * hl, t);
    const hS = heightAt(this.x - fx * hl, this.z - fz * hl, t);
    const hL = heightAt(this.x + rx * hb, this.z + rz * hb, t);
    const hR = heightAt(this.x - rx * hb, this.z - rz * hb, t);
    const water = (hB + hS + hL + hR) / 4 + 0.12 * Math.abs(this.speed) / this.maxSpeed - this.sink;
    if (this.y <= water) {
      if (this.air > 0.3 && this.vy < -3) this.onSlam?.(Math.min(1.6, -this.vy / 7));
      this.air = 0;
      this.vy += (water - this.y) * 60 * dt;
      this.vy *= Math.exp(-7 * dt);
    } else {
      this.air += dt;
      this.vy -= 9.81 * dt;
    }
    this.y += this.vy * dt;
    if (this.y < water - 0.8) { this.y = water - 0.8; this.vy = Math.max(this.vy, 0); }

    const airborne = this.air > 0.12;
    const pT = -Math.atan2(hB - hS, 2 * hl) - 0.06 * (this.speed / this.maxSpeed) - this.sink * 0.12;
    const rT = Math.atan2(hL - hR, 2 * hb) - this.steer * this.speed * 0.011;
    const k = 1 - Math.exp(-(airborne ? 1.5 : 7) * dt);
    this.pitch += ((airborne ? this.pitch + 0.35 * dt : pT) - this.pitch) * (airborne ? 1 : k);
    this.roll += (rT - this.roll) * k;
    this.obj.position.set(this.x, this.y, this.z);
    this.obj.rotation.set(this.pitch, this.heading, this.roll, 'YXZ');
  }
}

// vedette du joueur
const playerObj = makeSpeedboat();
const player = new Boat(playerObj, { L: 8.2, B: 2.7, maxSpeed: 21, boostSpeed: 28, turn: 0.95 });
scene.add(playerObj);
const hero = makeCharacter({ shirt: 0x8d7b63, pants: 0x2f3a4c, skin: 0xc49a7c, hair: 0x2a1c12, rolledSleeves: true });
const brother = makeCharacter({ jacket: 0x2a2724, shirt: 0x5a5a58, pants: 0x1f232b, skin: 0xbb8f70, hair: 0x3a2a1c });
function seatOnBoat() {
  playerObj.add(hero, brother);
  hero.position.set(0.35, 0.95, -0.2); hero.rotation.set(0, 0, 0);
  brother.position.set(-0.6, 0.93, -2.5); brother.rotation.set(0, Math.PI, 0);
}
seatOnBoat();

const headlight = new THREE.SpotLight(0xf0f4ff, 0, 190, 0.32, 0.55, 2);
headlight.position.copy(playerObj.userData.headlightPos);
const headTarget = new THREE.Object3D(); headTarget.position.set(0, -2, 30);
playerObj.add(headlight, headTarget);
headlight.target = headTarget;
const playerWake = new Wake();
scene.add(playerWake.mesh);

// éclairs des tirs et explosions
const muzzleLight = new THREE.PointLight(0xffb060, 0, 25, 2);
const boomLight = new THREE.PointLight(0xff7a30, 0, 220, 2);
scene.add(muzzleLight, boomLight);

// cargo à la dérive
const ship = makeCargoShip();
const SHIP = { x: 70, z: 1460, yaw: Math.PI / 2 + 0.22, hx: 14, hz: 86 };
ship.position.set(SHIP.x, 0, SHIP.z);
ship.rotation.y = SHIP.yaw;
scene.add(ship);

// lampes de pont : trois lumières réelles déplacées vers les feux les plus proches
const deckLamps = [0, 1, 2].map(() => { const l = new THREE.PointLight(0xffc28a, 0, 22, 2); ship.add(l); return l; });

// conteneurs tombés à la mer, entre la vedette et le flanc du cargo
const containers = [];
{
  const ax = Math.sin(SHIP.yaw), az = Math.cos(SHIP.yaw);
  const len = Math.hypot(SHIP.x, SHIP.z), px = -SHIP.x / len, pz = -SHIP.z / len;
  for (let i = 0; i < 14; i++) {
    const m = makeFloatingContainer();
    const along = rand(-110, 110), off = rand(70, 480);
    const c = { m, x: SHIP.x + ax * along + px * off, z: SHIP.z + az * along + pz * off, yaw: rand(0, Math.PI), ph: rand(0, 6) };
    containers.push(c);
    scene.add(m);
  }
}

/* =================================================== ennemis (chapitre 1) */
const SPOT_POOL = [];
for (let i = 0; i < 3; i++) {
  const s = new THREE.SpotLight(0xe8eeff, 0, 200, 0.2, 0.45, 2);
  scene.add(s, s.target);
  const beam = createBeam(60, 8);
  beam.visible = false;
  scene.add(beam);
  SPOT_POOL.push({ light: s, beam, used: false });
}
const enemies = [];

function spawnEnemy(dist = rand(120, 170)) {
  const slot = SPOT_POOL.find((s) => !s.used);
  if (!slot) return false;
  slot.used = true;
  const obj = makeMercBoat();
  const boat = new Boat(obj, { L: 7.4, B: 2.6, maxSpeed: 23, boostSpeed: 29, turn: 1.0 });
  const side = Math.random() < 0.5 ? -1 : 1;
  const ang = player.heading + Math.PI + side * rand(0.25, 1.0);
  boat.x = player.x + Math.sin(ang) * dist;
  boat.z = player.z + Math.cos(ang) * dist;
  boat.heading = player.heading;
  boat.speed = 18;
  boat.y = heightAt(boat.x, boat.z, time);
  scene.add(obj);
  const wake = new Wake(50);
  scene.add(wake.mesh);
  const e = {
    boat, obj, slot, wake, hp: 100, alive: true, dead: 0, side,
    orbit: rand(0, Math.PI * 2), pref: rand(32, 58), burst: 0, fireCd: rand(1.5, 3),
    aim: new THREE.Vector3(boat.x, 0, boat.z), smokeT: 0,
  };
  slot.light.intensity = 4500; slot.light.angle = 0.2; slot.light.distance = 200;
  slot.beam.visible = true; slot.beam.scale.setScalar(1);
  enemies.push(e);
  return true;
}

function releaseEnemy(e, remove = true) {
  e.slot.used = false;
  e.slot.light.intensity = 0;
  e.slot.beam.visible = false;
  if (remove) {
    scene.remove(e.obj, e.wake.mesh);
    enemies.splice(enemies.indexOf(e), 1);
  }
}

/* ==================================================== état du jeu */
let time = 0;
let state = 'title';
let act = 1;
const WEAPONS = {
  pistol: { label: 'Pistolet', mag: 15, rate: 0.2, auto: false, dmg: 34, boatDmg: 20, head: 3, spread: 0.011, spreadAim: 0.0035, bloom: 0.01, recoil: 0.02, reload: 1.3 },
  rifle: { label: 'Fusil d\'assaut', mag: 30, rate: 0.095, auto: true, dmg: 22, boatDmg: 14, head: 2.5, spread: 0.022, spreadAim: 0.007, bloom: 0.006, recoil: 0.012, reload: 2.1 },
};
const G = {
  hp: 100, lastHit: -99, reloading: 0, fireCd: 0, lastShot: -99, bloom: 0, trigger: false,
  cur: 'pistol', inv: { pistol: { ammo: 15, reserve: Infinity }, rifle: null },
  wave: 0, queue: 0, kills: 0, checkpoint: null, deckCheckpoint: 0, startDist: 0, stateT: 0,
  shake: 0, damageFx: 0, white: 0, fade: 1, hitmarker: 0, hitKill: false, lowLine: -99, saidMid: false, saidBox: false,
  ending: null, outro: null, wet: 0.4, playTime: 0,
  stats: { shots: 0, hits: 0, heads: 0, deaths: 0 },
};
const WAVES = [
  { at: 0.03, count: 2, line: 'w1' },
  { at: 0.33, count: 2, line: 'w2' },
  { at: 0.6, count: 3, line: 'w3' },
];
const playing = () => state === 'play' || state === 'deck';

const input = { keys: {}, lmb: false, rmb: false, mx: 0, my: 0, lastMouse: -99, clicked: false };
// commandes tactiles : joystick à gauche, regard au doigt à droite, boutons
const touch = { on: false, jx: 0, jy: 0, fire: false, aim: false, boost: false };
const aimHeld = () => input.rmb || touch.aim;
const fireHeld = () => input.lmb || touch.fire;
const cam = { yaw: 0, pitch: 0.16, dist: 9.5, heading: 0, aim: 0, tx: 0, ty: 0, tz: 0 };
const assist = new AimAssist();

/* ======================================================= audio */
let audio = null;
// voix et illustrations générées avec Higgsfield (voir tools/fetch-assets.mjs)
let assets = { voices: [], art: {} };
fetch('assets.json').then((r) => (r.ok ? r.json() : null)).then((a) => {
  if (!a) return;
  assets = a;
  for (const [id, el] of [['title', 'title'], ['ch2', 'chapter'], ['end', 'end']]) {
    const src = a.art?.[id];
    if (!src) continue;
    $(el).style.setProperty('--art', `url("${src}")`);
    $(el).classList.add('has-art');
  }
  if (audio && a.voices?.length) audio.loadVoices(a.voices);
}).catch(() => {});

/* ===================================================== répliques */
const subs = $('subs');
const subQueue = [];
let subT = 0, lastBark = -99;
function say(id) {
  if (!LINES[id]) return;
  if (subQueue.length > 2) subQueue.shift();
  subQueue.push(id);
}
function updateSubs(dt) {
  subT -= dt;
  if (subT > 0) return;
  const id = subQueue.shift();
  if (!id) { subs.classList.remove('on'); return; }
  const [who, text] = LINES[id];
  const voiced = audio?.playVoice(id) || 0;
  subT = voiced ? voiced + 0.35 : 1.3 + text.length * 0.055;
  subs.innerHTML = `<b>${who}</b> ${text}`;
  subs.classList.toggle('on', settings.subtitles);
}
// cris des mercenaires : voix radio, sans bloquer les répliques d'Élias
function bark(id) {
  if (time - lastBark < 5) return;
  lastBark = time;
  audio?.playVoice(id, rand(-0.6, 0.6));
}
function objective(text) {
  const o = $('objective');
  o.querySelector('span').textContent = text;
  o.classList.remove('on'); void o.offsetWidth; if (text) o.classList.add('on');
}
let toastT = 0;
function toast(text) { const t = $('toast'); t.textContent = text; t.classList.add('on'); toastT = 2.6; }
function setOverlay(id) {
  document.querySelectorAll('.overlay').forEach((el) => el.classList.toggle('show', el.id === id));
  document.body.classList.toggle('playing', id === null);
}

/* ===================================================== paramètres */
let settingsReturn = 'title';
bindSettingsForm($('settingsForm'), (key) => {
  if (key === 'quality') applyQuality();
  if (key === 'volume' || key === 'voice') audio?.setVolumes(settings.volume, settings.voice);
  if (key === 'subtitles' && !settings.subtitles) subs.classList.remove('on');
  $('assistBadge').textContent = assistLabel();
});
function assistLabel() { return { libre: 'Visée libre', assiste: 'Visée assistée', fort: 'Assistance forte' }[settings.assist]; }
$('assistBadge').textContent = assistLabel();
function openSettings(from) { settingsReturn = from; setOverlay('settings'); }
$('openSettings').addEventListener('click', () => openSettings('title'));
$('pauseSettings').addEventListener('click', () => openSettings('pause'));
$('closeSettings').addEventListener('click', () => setOverlay(settingsReturn));

/* ====================================================== contrôles */
addEventListener('keydown', (e) => {
  input.keys[e.code] = true;
  if (state === 'intro' && (e.code === 'Space' || e.code === 'Enter')) startPlay();
  if (state === 'wake' && (e.code === 'Space' || e.code === 'Enter')) G.stateT = Math.max(G.stateT, 7);
  if (e.code === 'KeyR' && playing()) reload();
  if (e.code === 'KeyP' && (playing() || state === 'pause')) togglePause();
  if (state === 'deck') {
    if (e.code === 'KeyC' || e.code === 'ControlLeft') deck.player.crouch = !deck.player.crouch;
    if (e.code === 'Digit1') switchWeapon('pistol');
    if (e.code === 'Digit2') switchWeapon('rifle');
  }
});
addEventListener('keyup', (e) => { input.keys[e.code] = false; });
addEventListener('wheel', (e) => { if (state === 'deck' && Math.abs(e.deltaY) > 4) switchWeapon(G.cur === 'pistol' ? 'rifle' : 'pistol'); }, { passive: true });
canvas.addEventListener('mousedown', (e) => {
  if (touch.on) return;
  if (playing() && document.pointerLockElement !== canvas) lock();
  if (e.button === 0) { input.lmb = true; input.clicked = true; input.clickT = time; }
  if (e.button === 2) input.rmb = true;
  if (state === 'intro') startPlay();
});
addEventListener('mouseup', (e) => { if (e.button === 0) input.lmb = false; if (e.button === 2) input.rmb = false; });
addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== canvas && !input.lmb && !input.rmb) return;
  // Chrome envoie parfois un saut énorme au moment du verrouillage du pointeur
  if (performance.now() - lockedAt < 120 || Math.abs(e.movementX) > 250 || Math.abs(e.movementY) > 250) return;
  input.mx += e.movementX; input.my += e.movementY;
  input.lastMouse = time;
});
let hadLock = false, lockedAt = 0;

function setupTouch() {
  const pad = $('pad'), knob = $('knob');
  let padId = null, lookId = null, lx = 0, ly = 0, cx = 0, cy = 0;
  const R = 56;
  const enable = () => {
    if (touch.on) return;
    touch.on = true; document.body.classList.add('touch');
    // première partie au tactile : l'assistance forte est plus confortable
    if (!localStorageHas()) { settings.assist = 'fort'; $('assistBadge').textContent = assistLabel(); }
  };
  addEventListener('touchstart', enable, { passive: true, capture: true });
  pad.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0]; padId = t.identifier;
    const r = pad.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
    movePad(t);
  }, { passive: false });
  const movePad = (t) => {
    let dx = t.clientX - cx, dy = t.clientY - cy;
    const l = Math.hypot(dx, dy); if (l > R) { dx *= R / l; dy *= R / l; }
    touch.jx = dx / R; touch.jy = dy / R;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  canvas.addEventListener('touchstart', (e) => {
    if (state === 'intro') { startPlay(); return; }
    if (state === 'wake') { G.stateT = Math.max(G.stateT, 7); return; }
    const t = e.changedTouches[0];
    if (lookId === null) { lookId = t.identifier; lx = t.clientX; ly = t.clientY; }
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === padId) movePad(t);
      else if (t.identifier === lookId) {
        input.mx += (t.clientX - lx) * 1.6; input.my += (t.clientY - ly) * 1.6;
        lx = t.clientX; ly = t.clientY; input.lastMouse = time;
      }
    }
    if (padId !== null || lookId !== null) e.preventDefault();
  }, { passive: false });
  const end = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === padId) { padId = null; touch.jx = touch.jy = 0; knob.style.transform = ''; }
      if (t.identifier === lookId) lookId = null;
    }
  };
  addEventListener('touchend', end); addEventListener('touchcancel', end);
  const hold = (id, key) => {
    const el = $(id);
    el.addEventListener('touchstart', (e) => { e.preventDefault(); touch[key] = true; el.classList.add('on'); }, { passive: false });
    const up = (e) => { e.preventDefault(); touch[key] = false; el.classList.remove('on'); };
    el.addEventListener('touchend', up); el.addEventListener('touchcancel', up);
  };
  hold('tFire', 'fire'); hold('tBoost', 'boost');
  const tap = (id, fn) => $(id).addEventListener('touchstart', (e) => { e.preventDefault(); fn(); }, { passive: false });
  tap('tAim', () => { touch.aim = !touch.aim; $('tAim').classList.toggle('on', touch.aim); });
  tap('tReload', () => { if (playing()) reload(); });
  tap('tPause', () => togglePause());
  tap('tCrouch', () => { if (state === 'deck') { deck.player.crouch = !deck.player.crouch; $('tCrouch').classList.toggle('on', deck.player.crouch); } });
  tap('tSwap', () => switchWeapon(G.cur === 'pistol' ? 'rifle' : 'pistol'));
}
function localStorageHas() { try { return !!localStorage.getItem('tempete.settings.v1'); } catch { return false; } }
function lock() { if (touch.on) return; try { const p = canvas.requestPointerLock?.(); p?.catch?.(() => {}); } catch { /* ignoré */ } }
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) { hadLock = true; lockedAt = performance.now(); }
  else if (hadLock && playing()) togglePause();
});
let pausedFrom = 'play';
function togglePause() {
  if (playing()) { pausedFrom = state; state = 'pause'; setOverlay('pause'); audio?.suspend(); }
  else if (state === 'pause') { state = pausedFrom; setOverlay(null); audio?.resume(); lock(); }
}
$('resume').addEventListener('click', togglePause);
$('play').addEventListener('click', startGame);
$('retry').addEventListener('click', respawn);
$('again').addEventListener('click', () => location.reload());

/* ======================================================= chapitre 1 */
function resetWorld() {
  player.x = 0; player.z = 0; player.heading = 0.04; player.speed = 8; player.y = 0; player.vy = 0;
  G.startDist = Math.hypot(SHIP.x - player.x, SHIP.z - player.z);
  sea.amp = 0.9; sea.rogue.h = 0;
}

function startGame() {
  if (state !== 'title') return;
  document.activeElement?.blur?.();
  if (!audio) {
    try { audio = new StormAudio(); } catch { audio = null; }
    if (audio) { audio.setVolumes(settings.volume, settings.voice); audio.loadVoices(assets.voices || []); }
  }
  audio?.resume();
  lightning.audio = audio;
  if (params.get('chapitre') === '2' && DEBUG) { startChapter2(true); return; }
  resetWorld();
  state = 'intro'; G.stateT = 0; G.fade = 1;
  setOverlay(null);
  document.body.classList.add('cinema');
  $('intro').classList.add('show');
  say('i1'); say('i2'); say('i3');
}

function startPlay() {
  if (state !== 'intro') return;
  state = 'play'; G.stateT = 0;
  subQueue.length = 0; subT = Math.min(subT, 0.6);
  document.body.classList.remove('cinema');
  $('intro').classList.remove('show');
  objective('Rejoins le cargo à la dérive');
  lock();
  G.checkpoint = { x: player.x, z: player.z, h: player.heading, wave: 0 };
}

function progress() {
  return 1 - Math.hypot(SHIP.x - player.x, SHIP.z - player.z) / G.startDist;
}

function respawn() {
  G.stats.deaths++;
  G.hp = 100; G.reloading = 0; G.damageFx = 0; G.bloom = 0;
  const p = G.inv.pistol; p.ammo = WEAPONS.pistol.mag;
  setOverlay(null);
  audio?.resume();
  lock();
  if (act === 2) {
    p.reserve = Math.max(p.reserve, 45);
    if (G.inv.rifle) { G.inv.rifle.ammo = WEAPONS.rifle.mag; G.inv.rifle.reserve = Math.max(G.inv.rifle.reserve, 60); }
    deck.start(G.deckCheckpoint);
    state = 'deck'; G.stateT = 0; G.fade = 0;
    say('r1');
    return;
  }
  const c = G.checkpoint;
  for (const e of [...enemies]) releaseEnemy(e);
  player.x = c.x; player.z = c.z; player.heading = c.h; player.speed = 10; player.vy = 0;
  player.y = heightAt(c.x, c.z, time);
  playerWake.reset();
  G.wave = c.wave; G.queue = 0;
  if (c.wave > 0) G.queue = WAVES[c.wave - 1].count;
  state = 'play'; G.stateT = 0; G.fade = 0;
  say('r1');
}

/* ======================================================== armes */
function reload() {
  const W = WEAPONS[G.cur], inv = G.inv[G.cur];
  if (G.reloading > 0 || inv.ammo === W.mag || inv.reserve <= 0) return;
  G.reloading = W.reload;
  audio?.reload();
}
function finishReload() {
  const W = WEAPONS[G.cur], inv = G.inv[G.cur];
  const take = Math.min(W.mag - inv.ammo, inv.reserve);
  inv.ammo += take;
  if (inv.reserve !== Infinity) inv.reserve -= take;
}
function switchWeapon(kind) {
  if (kind === G.cur || !G.inv[kind]) return;
  G.cur = kind; G.reloading = 0; G.fireCd = 0.35;
  setWeapon(hero, kind);
  audio?.click();
  toast(WEAPONS[kind].label);
}
function pickup(kind) {
  if (kind === 'rifle') {
    G.inv.rifle = { ammo: WEAPONS.rifle.mag, reserve: 30 };
    switchWeapon('rifle');
    toast('Fusil d\'assaut récupéré — 2 ou molette pour changer d\'arme');
  } else if (kind === 'rifleAmmo' && G.inv.rifle) { G.inv.rifle.reserve += 30; toast('+30 munitions de fusil'); }
  else { G.inv.pistol.reserve += 15; toast('+15 munitions de pistolet'); }
  audio?.reload();
}

/* ======================================================== combat */
const _v = new THREE.Vector3(), _o = new THREE.Vector3(), _d = new THREE.Vector3(), _m = new THREE.Vector3();
function waterHit(o, d, max = 500) {
  let prev = 0;
  for (let t = 1; t < max; t += t < 60 ? 1 : 4) {
    const px = o.x + d.x * t, py = o.y + d.y * t, pz = o.z + d.z * t;
    if (py < heightAt(px, pz, time)) {
      const tt = (prev + t) / 2;
      return new THREE.Vector3(o.x + d.x * tt, heightAt(o.x + d.x * tt, o.z + d.z * tt, time), o.z + d.z * tt);
    }
    prev = t;
  }
  return null;
}

function splash(p, k = 1) {
  for (let i = 0; i < 14 * k; i++) {
    spray.emit(p.x + rand(-0.2, 0.2), p.y, p.z + rand(-0.2, 0.2), rand(-1, 1) * k, rand(3, 7) * k, rand(-1, 1) * k,
      { life: rand(0.5, 0.9), size: 0.25 * k, size1: 0.9 * k, r: 0.6, g: 0.66, b: 0.7, a: 0.8, grav: 9.8, drag: 0.5 });
  }
}

function sparks(p) {
  for (let i = 0; i < 10; i++) {
    fire.emit(p.x, p.y, p.z, rand(-5, 5), rand(0, 6), rand(-5, 5),
      { life: rand(0.15, 0.35), size: 0.12, size1: 0.02, r: 8, g: 5, b: 2, grav: 12 });
  }
  smoke.emit(p.x, p.y, p.z, rand(-0.3, 0.3), rand(0.3, 0.8), rand(-0.3, 0.3),
    { life: 0.9, size: 0.2, size1: 1.0, r: 0.25, g: 0.24, b: 0.22, a: 0.4, grav: -0.2, drag: 1 });
}

function blood(p) {
  for (let i = 0; i < 7; i++) {
    smoke.emit(p.x, p.y, p.z, rand(-1, 1), rand(-0.2, 1), rand(-1, 1),
      { life: rand(0.25, 0.5), size: 0.12, size1: 0.45, r: 0.16, g: 0.02, b: 0.02, a: 0.7, grav: 3, drag: 2 });
  }
}

function muzzleFlash(p, d) {
  muzzleLight.position.copy(p);
  muzzleLight.intensity = act === 2 ? 45 : 250;
  for (let i = 0; i < 5; i++) {
    fire.emit(p.x, p.y, p.z, (d?.x || 0) * 6 + rand(-1, 1), (d?.y || 0) * 6 + rand(-1, 1), (d?.z || 0) * 6 + rand(-1, 1),
      { life: 0.06, size: 0.32, size1: 0.1, r: 9, g: 6, b: 2.5 });
  }
}

// paquet de mer qui balaie le pont (chapitre 2)
function waveFx(p, inward) {
  for (let i = 0; i < 160; i++) {
    const s = rand(3, 9);
    spray.emit(p.x + rand(-4, 4), p.y + rand(-0.5, 0.5), p.z + rand(-4, 4),
      inward.x * s + rand(-1.5, 1.5), rand(4, 10), inward.z * s + rand(-1.5, 1.5),
      { life: rand(0.8, 1.6), size: 0.5, size1: rand(2, 3.5), r: 0.6, g: 0.66, b: 0.7, a: 0.45, grav: 9.8, drag: 0.4 });
  }
}

function explode(p, big = 1) {
  for (let i = 0; i < 90 * big; i++) {
    const a = rand(0, Math.PI * 2), s = rand(2, 11) * big;
    fire.emit(p.x, p.y + 0.8, p.z, Math.cos(a) * s, rand(2, 10) * big, Math.sin(a) * s,
      { life: rand(0.5, 1.1), size: rand(1.5, 3) * big, size1: rand(4, 7) * big, r: 4, g: 1.5, b: 0.35, a: 0.8, grav: -1, drag: 2.2 });
  }
  for (let i = 0; i < 40 * big; i++) {
    fire.emit(p.x, p.y + 1, p.z, rand(-14, 14), rand(6, 18), rand(-14, 14),
      { life: rand(0.8, 1.8), size: 0.25, size1: 0.05, r: 9, g: 4, b: 1.2, grav: 9.8 });
  }
  for (let i = 0; i < 50 * big; i++) {
    smoke.emit(p.x + rand(-1, 1), p.y + 1.5, p.z + rand(-1, 1), rand(-3, 3), rand(2, 6), rand(-3, 3),
      { life: rand(2.5, 5), size: rand(2, 4), size1: rand(9, 16), r: 0.05, g: 0.05, b: 0.055, a: 0.75, grav: -0.6, drag: 0.8 });
  }
  splash(p, 2.2);
  boomLight.position.set(p.x, p.y + 3, p.z);
  boomLight.intensity = 5000 * big;
  const d = Math.hypot(p.x - player.x, p.z - player.z);
  G.shake = Math.max(G.shake, clamp(1.4 - d / 120, 0.2, 1.2));
  audio?.explosion(clamp(1.3 - d / 300, 0.3, 1.2));
}

const KILL_LINES = ['k1', 'k2', 'k3', 'k4'];
function damageEnemy(e, dmg, at) {
  if (!e.alive) return false;
  e.hp -= dmg;
  sparks(at);
  if (e.hp <= 0) {
    e.alive = false; e.dead = 0;
    explode(_v.set(e.boat.x, e.boat.y, e.boat.z));
    e.slot.light.intensity = 0; e.slot.beam.visible = false;
    G.kills++;
    if (Math.random() < 0.75) say(Math.random() < 0.3 ? 'k5' : KILL_LINES[(Math.random() * 4) | 0]);
    return true;
  }
  return false;
}

// cibles de l'assistance à la visée (coordonnées monde)
function currentTargets() {
  if (act === 2) return deck.targets();
  const list = [];
  for (const e of enemies) {
    if (!e.alive) continue;
    list.push({ chest: new THREE.Vector3(e.boat.x, e.boat.y + 1.3, e.boat.z), head: null, ref: e });
  }
  return list;
}
const losFn = (p) => (act === 2 ? deck.losWorld(camera.position, p) : true);
function rotateView(dyaw, dpitch) {
  if (act === 2) deck.rotateView(dyaw, dpitch);
  else { cam.yaw += dyaw; cam.pitch = clamp(cam.pitch - dpitch, -0.35, 0.95); }
}

function boatShot(o, d) {
  let best = null, bestT = Infinity;
  for (const e of enemies) {
    if (!e.alive) continue;
    _v.set(e.boat.x, e.boat.y + 1.3, e.boat.z).sub(o);
    const tc = _v.dot(d);
    if (tc < 0) continue;
    const d2 = _v.lengthSq() - tc * tc;
    const r = 2.7;
    if (d2 < r * r) {
      const t = tc - Math.sqrt(r * r - d2);
      if (t < bestT) { bestT = t; best = e; }
    }
  }
  if (best && bestT < 260) return { point: o.clone().addScaledVector(d, bestT), enemy: best, head: false, surface: 'boat' };
  const hit = waterHit(o, d);
  return hit ? { point: hit, enemy: null, surface: 'water' } : { point: o.clone().addScaledVector(d, 400), enemy: null, surface: 'none' };
}

function playerShoot() {
  const W = WEAPONS[G.cur], inv = G.inv[G.cur];
  if (G.reloading > 0 || G.fireCd > 0) return;
  if (inv.ammo <= 0) {
    audio?.click(); G.fireCd = 0.3;
    if (inv.reserve > 0) reload(); else if (G.cur === 'rifle') switchWeapon('pistol');
    return;
  }
  inv.ammo--; G.fireCd = W.rate * (touch.on && !W.auto ? 1.5 : 1); G.lastShot = time;
  G.stats.shots++;
  hero.userData.anim.recoil = 1;
  const fwd = camera.getWorldDirection(new THREE.Vector3());
  const origin = camera.position.clone();
  const sp = (aimHeld() ? W.spreadAim : W.spread) + G.bloom;
  G.bloom = Math.min(0.045, G.bloom + W.bloom);
  const dir = fwd.clone();
  dir.x += rand(-sp, sp); dir.y += rand(-sp, sp); dir.z += rand(-sp, sp);
  dir.normalize();
  assist.bend(origin, fwd, dir, currentTargets(), losFn);
  const res = act === 2 ? deck.resolveShot(origin, dir) : boatShot(origin, dir);
  hero.userData.muzzle.getWorldPosition(_m);
  if (res.enemy) {
    G.stats.hits++;
    if (res.head) G.stats.heads++;
    let killed;
    if (act === 2) {
      blood(res.point);
      killed = deck.damage(res.enemy, W.dmg * (res.head ? W.head : 1), res.head, res.point);
      if (killed) { G.kills++; if (Math.random() < 0.55) say(KILL_LINES[(Math.random() * 4) | 0]); }
    } else killed = damageEnemy(res.enemy, W.boatDmg, res.point);
    G.hitmarker = 0.2; G.hitKill = killed; G.hitHead = res.head;
    audio?.impact();
  } else if (res.surface === 'metal') { sparks(res.point); audio?.metal(0.35, 0); } else if (res.surface === 'water') splash(res.point, 0.6);
  tracers.fire(_m, res.point, [7, 5, 2.4], 520);
  muzzleFlash(_m, dir);
  // recul : le canon remonte, un peu de dérive latérale
  rotateView(rand(-1, 1) * W.recoil * 0.35, W.recoil * (aimHeld() ? 0.7 : 1));
  G.shake = Math.max(G.shake, 0.1);
  if (G.cur === 'rifle') audio?.rifle(0.95, 0); else audio?.gunshot(1, 0);
  if (inv.ammo === 0 && inv.reserve > 0) setTimeout(reload, 250);
}

function damagePlayer(d) {
  if (!playing()) return;
  G.hp -= d; G.lastHit = time;
  G.shake = Math.max(G.shake, 0.25);
  audio?.impact();
  if (G.hp < 35 && time - G.lowLine > 14) {
    G.lowLine = time;
    say(Math.random() < 0.5 ? 'h1' : 'h2');
  }
  if (G.hp <= 0) {
    G.hp = 0;
    state = 'dead'; G.stateT = 0;
    document.exitPointerLock?.();
  }
}

/* ===================================================== IA ennemie (chapitre 1) */
function updateEnemies(dt) {
  const camPan = new THREE.Vector3();
  for (const e of [...enemies]) {
    const b = e.boat;
    if (!e.alive) {
      e.dead += dt;
      b.sink = Math.min(4, e.dead * 0.5);
      b.update(dt, time, 0, 0);
      if (Math.random() < dt * 40 && e.dead < 6) {
        fire.emit(b.x + rand(-1, 1), b.y + 1, b.z + rand(-1, 1), rand(-1, 1), rand(2, 5), rand(-1, 1),
          { life: rand(0.4, 0.9), size: rand(1, 2), size1: rand(2.5, 4), r: 6, g: 2.2, b: 0.5, a: 0.8, grav: -2 });
        smoke.emit(b.x, b.y + 2, b.z, rand(-1, 1) + 3, rand(3, 5), rand(-1, 1) + 2,
          { life: rand(3, 5), size: 2, size1: rand(8, 13), r: 0.04, g: 0.04, b: 0.045, a: 0.6, grav: -0.4, drag: 0.3 });
      }
      if (e.dead > 9) releaseEnemy(e);
      continue;
    }
    // position de harcèlement autour de la vedette
    e.orbit += dt * 0.12 * e.side;
    const lead = 1.2;
    const tx = player.x + player.fx * player.speed * lead + Math.sin(e.orbit) * e.pref;
    const tz = player.z + player.fz * player.speed * lead + Math.cos(e.orbit) * e.pref;
    const dx = tx - b.x, dz = tz - b.z;
    const dTarget = Math.hypot(dx, dz);
    const want = Math.atan2(dx, dz);
    const steer = clamp(wrapAngle(want - b.heading) * 1.6, -1, 1);
    const dist = Math.hypot(player.x - b.x, player.z - b.z);
    const throttle = dTarget > 25 ? 1 : clamp(Math.abs(player.speed) / b.maxSpeed + dTarget / 60, 0.2, 1);
    b.update(dt, time, throttle, steer, dist > 90);

    // évitement entre bateaux
    for (const o of [player, ...enemies.map((x) => x.boat)]) {
      if (o === b) continue;
      const ox = b.x - o.x, oz = b.z - o.z, d = Math.hypot(ox, oz);
      if (d < 6 && d > 0.01) { b.x += (ox / d) * (6 - d) * 0.5; b.z += (oz / d) * (6 - d) * 0.5; }
    }

    // projecteur braqué sur le joueur
    const lamp = e.obj.localToWorld(_v.copy(e.obj.userData.lampPos));
    e.aim.lerp(_o.set(player.x + rand(-0.6, 0.6), player.y + 1, player.z + rand(-0.6, 0.6)), 1 - Math.exp(-3 * dt));
    e.slot.light.position.copy(lamp);
    e.slot.light.target.position.copy(e.aim);
    e.slot.beam.position.copy(lamp);
    e.slot.beam.lookAt(e.aim);
    // le faisceau s'efface quand la caméra est dedans (évite le voile blanc)
    _d.copy(e.aim).sub(lamp).normalize();
    _o.copy(camera.position).sub(lamp);
    const along = _o.dot(_d), off = Math.sqrt(Math.max(0, _o.lengthSq() - along * along));
    const camF = camera.getWorldDirection(_m);
    const align = Math.abs(camF.dot(_d));
    const near = clamp((off - Math.max(0, along) * 0.18 - 2) / 12, 0, 1);
    e.slot.beam.material.uniforms.uInt.value = near * (1 - THREE.MathUtils.smoothstep(align, 0.45, 0.85)) * (state === 'finale' ? 0 : 1);
    e.obj.userData.lens.lookAt(e.aim);

    // tireur
    const gunner = e.obj.userData.gunner;
    const local = e.obj.worldToLocal(_o.set(player.x, player.y + 1, player.z));
    gunner.rotation.y = Math.atan2(local.x - gunner.position.x, local.z - gunner.position.z);
    if (dist < 200) {
      const anim = { heave: b.vy, roll: b.roll, t: time };
      animateCharacter(gunner, dt, { ...anim, aim: true, pitch: Math.atan2(local.y - 2.2, Math.hypot(local.x, local.z)) });
      animateCharacter(e.obj.userData.pilot, dt, anim);
    }

    // traînée de fumée si endommagé
    if (e.hp < 50 && Math.random() < dt * 12) {
      const p = e.obj.localToWorld(_o.set(0, 1.4, -3.6));
      smoke.emit(p.x, p.y, p.z, rand(-0.5, 0.5), rand(1, 2), rand(-0.5, 0.5),
        { life: 3, size: 1, size1: 6, r: 0.06, g: 0.06, b: 0.065, a: 0.5, grav: -0.5, drag: 0.4 });
    }

    // tirs en rafales
    if (state === 'play') {
      e.fireCd -= dt;
      if (e.fireCd <= 0 && dist < 140) {
        if (e.burst <= 0) e.burst = 3 + ((Math.random() * 3) | 0);
        e.burst--;
        e.fireCd = e.burst > 0 ? 0.11 : rand(1.3, 2.6);
        gunner.userData.anim.recoil = 0.6;
        const chance = clamp(0.4 - dist / 330 - Math.abs(player.speed) / 110 - (player.air > 0.1 ? 0.15 : 0), 0.05, 0.38);
        gunner.userData.muzzle.getWorldPosition(_m);
        _m.add(_d.set(player.x - b.x, 0, player.z - b.z).normalize().multiplyScalar(0.6));
        let to;
        if (Math.random() < chance) {
          to = new THREE.Vector3(player.x + rand(-0.5, 0.5), player.y + 1.3, player.z + rand(-0.5, 0.5));
          damagePlayer(rand(6, 9));
        } else {
          const a = rand(0, Math.PI * 2), r = rand(2, 7);
          to = new THREE.Vector3(player.x + Math.cos(a) * r, 0, player.z + Math.sin(a) * r);
          to.y = heightAt(to.x, to.z, time);
          splash(to, 0.5);
          if (r < 4) audio?.whiz(clamp((to.x - player.x) * 0.2, -1, 1));
        }
        tracers.fire(_m, to, [8, 2.6, 1.2], 380);
        fire.emit(_m.x, _m.y, _m.z, 0, 0, 0, { life: 0.05, size: 0.6, r: 9, g: 5, b: 2 });
        camPan.set(b.x, b.y, b.z).project(camera);
        audio?.gunshot(clamp(1 - dist / 200, 0.15, 0.7), clamp(camPan.x, -1, 1), true);
      }
    }

    e.wake.update(dt, time, b.x - b.fx * 3.5, b.z - b.fz * 3.5, b.heading, b.speed, b.B, 0.3 + env.uFlash.value * 2);
    if (Math.random() < dt * Math.abs(b.speed) * 2) emitWakeSpray(b, 0.6);
  }
}

/* ================================================== embruns */
function emitWakeSpray(b, k = 1) {
  const s = Math.abs(b.speed);
  const rx = Math.cos(b.heading), rz = -Math.sin(b.heading);
  for (const side of [-1, 1]) {
    const px = b.x + b.fx * b.L * 0.2 + rx * side * b.B * 0.5;
    const pz = b.z + b.fz * b.L * 0.2 + rz * side * b.B * 0.5;
    spray.emit(px, b.y - 0.1, pz,
      rx * side * rand(2, 5) + b.fx * s * 0.4, rand(1.5, 4) * k, rz * side * rand(2, 5) + b.fz * s * 0.4,
      { life: rand(0.6, 1.1), size: 0.3 * k, size1: rand(1.2, 2) * k, r: 0.5, g: 0.55, b: 0.58, a: 0.3, grav: 9.8, drag: 0.6 });
  }
  const sx = b.x - b.fx * b.L * 0.55, sz = b.z - b.fz * b.L * 0.55;
  spray.emit(sx + rand(-0.4, 0.4), b.y + 0.1, sz + rand(-0.4, 0.4),
    -b.fx * s * 0.25 + rand(-1, 1), rand(2, 4.5) * k, -b.fz * s * 0.25 + rand(-1, 1),
    { life: rand(0.7, 1.2), size: 0.4 * k, size1: rand(1.5, 2.4) * k, r: 0.5, g: 0.55, b: 0.58, a: 0.25, grav: 9.8, drag: 0.4 });
}

player.onSlam = (k) => {
  G.wet = Math.min(1.4, G.wet + 0.5 * k);
  G.shake = Math.max(G.shake, 0.35 * k);
  audio?.slam(k);
  for (let i = 0; i < 70 * k; i++) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const rx = Math.cos(player.heading), rz = -Math.sin(player.heading);
    spray.emit(player.x + player.fx * 2 + rx * side * 1.2, player.y, player.z + player.fz * 2 + rz * side * 1.2,
      rx * side * rand(3, 8) + player.fx * player.speed * 0.5, rand(3, 8) * k, rz * side * rand(3, 8) + player.fz * player.speed * 0.5,
      { life: rand(0.7, 1.3), size: 0.4, size1: rand(1.6, 2.8), r: 0.6, g: 0.65, b: 0.68, a: 0.4, grav: 9.8, drag: 0.5 });
  }
};

/* ================================================== collisions */
function obb(b, cx, cz, yaw, hx, hz, r) {
  const dx = b.x - cx, dz = b.z - cz, c = Math.cos(yaw), s = Math.sin(yaw);
  let lx = dx * c - dz * s, lz = dx * s + dz * c;
  const px = hx + r - Math.abs(lx), pz = hz + r - Math.abs(lz);
  if (px <= 0 || pz <= 0) return false;
  if (px < pz) lx = Math.sign(lx) * (hx + r); else lz = Math.sign(lz) * (hz + r);
  b.x = cx + lx * c + lz * s;
  b.z = cz - lx * s + lz * c;
  return true;
}
function obbDist(x, z, cx, cz, yaw, hx, hz) {
  const dx = x - cx, dz = z - cz, c = Math.cos(yaw), s = Math.sin(yaw);
  const lx = Math.max(0, Math.abs(dx * c - dz * s) - hx), lz = Math.max(0, Math.abs(dx * s + dz * c) - hz);
  return Math.hypot(lx, lz);
}
function collide(b) {
  let hit = obb(b, SHIP.x, SHIP.z, SHIP.yaw, SHIP.hx, SHIP.hz, 2.5);
  for (const c of containers) hit = obb(b, c.x, c.z, c.yaw, 1.3, 6.2, 2.2) || hit;
  if (hit && Math.abs(b.speed) > 4) {
    b.speed *= 0.3;
    if (b === player) { G.shake = 0.6; audio?.slam(1.2); damagePlayer(4); }
  }
}

/* ================================================== caméra (chapitre 1) */
function updateCamera(dt, sens) {
  const aimK = (aimHeld() && state === 'play') ? 1 : 0;
  cam.aim += (aimK - cam.aim) * (1 - Math.exp(-10 * dt));
  cam.yaw -= input.mx * 0.0023 * (1 - cam.aim * 0.45) * sens;
  cam.pitch = clamp(cam.pitch + input.my * 0.0019 * (1 - cam.aim * 0.45) * sens * (settings.invertY ? -1 : 1), -0.35, 0.95);
  input.mx = input.my = 0;

  if (time - input.lastMouse > 1.8 && cam.aim < 0.1 && player.speed > 3 && state === 'play') {
    cam.yaw += wrapAngle(0 - cam.yaw) * (1 - Math.exp(-0.9 * dt));
    cam.pitch += (0.16 - cam.pitch) * (1 - Math.exp(-0.6 * dt));
  }
  cam.heading += wrapAngle(player.heading - cam.heading) * (1 - Math.exp(-3.5 * dt));

  const a = cam.heading + cam.yaw;
  const dist = THREE.MathUtils.lerp(9.5, 5.6, cam.aim);
  const sx = Math.cos(a), sz = -Math.sin(a); // vecteur gauche de la caméra
  const shoulder = THREE.MathUtils.lerp(0, -1.3, cam.aim);
  cam.tx += (player.x - cam.tx) * (1 - Math.exp(-12 * dt));
  cam.tz += (player.z - cam.tz) * (1 - Math.exp(-12 * dt));
  cam.ty += (player.y - cam.ty) * (1 - Math.exp(-5 * dt));
  const tx = cam.tx + sx * shoulder, ty = cam.ty + 2.4, tz = cam.tz + sz * shoulder;
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const px = tx - Math.sin(a) * dist * cp, pz = tz - Math.cos(a) * dist * cp;
  const py = Math.max(ty + dist * sp, heightAt(px, pz, time) + 0.9);
  camera.position.set(px, py, pz);
  camera.lookAt(tx + Math.sin(a) * 4 * cp, ty - sp * 4 + 0.4, tz + Math.cos(a) * 4 * cp);

  camera.fov = THREE.MathUtils.lerp(62, 44, cam.aim) + Math.min(6, Math.max(0, player.speed - 18) * 0.6);
  camera.updateProjectionMatrix();
}

function applyShake(dt) {
  G.shake = Math.max(0, G.shake - dt * 1.6);
  const s = G.shake * G.shake * 0.6;
  camera.rotation.x += (Math.random() - 0.5) * s * 0.12;
  camera.rotation.y += (Math.random() - 0.5) * s * 0.12;
  camera.position.y += (Math.random() - 0.5) * s * 0.3;
}

function cinematicCamera(from, look, k) {
  camera.position.lerp(from, k);
  camera.lookAt(look);
}

/* ================================================== lumières sur l'océan */
const _lp = new THREE.Vector3(), _ld = new THREE.Vector3();
function pushLights() {
  const U = ocean.uniforms;
  const spots = [headlight, ...SPOT_POOL.map((s) => s.light)];
  spots.forEach((l, i) => {
    if (i >= SPOTS) return;
    l.getWorldPosition(_lp);
    l.target.getWorldPosition(_ld);
    U.uSpotPos.value[i].copy(_lp);
    U.uSpotDir.value[i].copy(_ld.sub(_lp).normalize());
    U.uSpotColor.value[i].set(l.color.r, l.color.g, l.color.b).multiplyScalar(l.intensity * 0.6);
    U.uSpotCos.value[i].set(Math.cos(l.angle), Math.cos(l.angle * (1 - l.penumbra)));
  });
  const pts = [...ship.userData.lights, muzzleLight, boomLight];
  pts.forEach((l, i) => {
    l.getWorldPosition(U.uPointPos.value[i]);
    U.uPointColor.value[i].set(l.color.r, l.color.g, l.color.b).multiplyScalar(l.intensity * 0.3);
  });
}

/* ================================================== chapitre 2 : le cargo */
const deck = new DeckAct({
  scene, camera, ship, hero, brother, tracers, spotPool: SPOT_POOL, G,
  get audio() { return audio; },
  time: () => time,
  say, bark, objective, damagePlayer,
  fx: { sparks, flash: (p) => muzzleFlash(p, null), wave: waveFx },
  checkpoint: (k) => { G.deckCheckpoint = k; },
  pickup,
  finish: () => startOutro(),
});

function startChapter2(direct = false) {
  act = 2;
  // à bout portant, les projecteurs réglés pour être vus de loin écrasent tout
  for (const f of ship.userData.floods) f.intensity = 5000;
  ship.userData.lights.forEach((l, i) => { l.intensity = i ? 500 : 900; });
  state = 'chapter'; G.stateT = 0;
  document.exitPointerLock?.();
  setOverlay('chapter');
  for (const e of [...enemies]) releaseEnemy(e);
  playerObj.visible = false; playerWake.mesh.visible = false;
  for (const c of containers) c.m.visible = false;
  sea.rogue.h = 0; sea.amp = 1.05;
  G.white = 0; G.fade = 1; G.hp = 100;
  G.inv.pistol.ammo = WEAPONS.pistol.mag; G.inv.pistol.reserve = 45;
  G.reloading = 0;
  subQueue.length = 0; subT = 0;
  deck.start(0);
  document.body.classList.add('act2', 'cinema');
  if (direct) G.stateT = 3.5;
}

// réveil sur le pont : plan rapproché, puis la main passe au joueur
function updateWake(dt, talk = true) {
  const T = talk ? G.stateT : 0;
  G.fade = clamp(1 - T * 0.6, 0, 1);
  const lie = 1 - THREE.MathUtils.smoothstep(T, 2.6, 4.2);
  const P = deck.player.pos;
  hero.position.copy(P);
  hero.rotation.set(-Math.PI / 2 * lie, Math.PI, 0, 'YXZ');
  animateCharacter(hero, dt, { t: time, crouch: lie * 0.6 });
  brother.position.set(P.x - 0.9, P.y, P.z - 0.6);
  brother.rotation.set(0, Math.PI * 0.6, 0, 'YXZ');
  animateCharacter(brother, dt, { t: time, crouch: 1 - THREE.MathUtils.smoothstep(T, 3.5, 5) });
  const from = deck.toWorld(new THREE.Vector3(P.x + 2.6 - T * 0.15, P.y + 0.7 + T * 0.18, P.z + 1.8));
  const look = deck.toWorld(new THREE.Vector3(P.x - 0.4, P.y + 0.6 + (1 - lie) * 0.8, P.z - 0.2));
  camera.position.copy(from); camera.up.set(0, 1, 0); camera.lookAt(look);
  camera.fov = 50; camera.updateProjectionMatrix();
  if (!talk) return;
  if (T > 0.4 && !G.saidD1) { G.saidD1 = true; say('d1'); }
  if (T > 4.4 && !G.saidD2) { G.saidD2 = true; say('d2'); }
  if (T > 9) startDeck();
}
function startDeck() {
  state = 'deck'; G.stateT = 0; G.fade = 0;
  setOverlay(null);
  document.body.classList.remove('cinema');
  objective('Atteins la passerelle du cargo');
  say('d3');
  deck.cam.yaw = Math.PI; deck.cam.pitch = 0.12;
  lock();
}

/* ------------------------------------------------ fin : le canot de sauvetage */
function startOutro() {
  if (state !== 'deck') return;
  state = 'outro'; G.stateT = 0;
  subQueue.length = 0; subT = 0;
  document.exitPointerLock?.();
  document.body.classList.add('cinema');
  objective('');
  G.outro = { said: {}, falling: [], lb: null, baseY: ship.position.y };
  for (const s of SPOT_POOL) { s.light.intensity = 0; s.beam.visible = false; }
}

function updateOutro(dt) {
  const T = G.stateT, O = G.outro;
  const once = (k, fn) => { if (!O.said[k]) { O.said[k] = true; fn(); } };
  if (T < 0.8) G.fade = T / 0.8;
  else if (T < 4.2) G.fade = 1;
  else if (T < 5.4) G.fade = 1 - (T - 4.2) / 1.2;
  else if (T > 19) G.fade = clamp((T - 19) / 1.4, 0, 1);
  else G.fade = 0;
  once('door', () => audio?.door());
  if (T > 1) once('e1', () => say('e1'));
  const side = new THREE.Vector3(Math.cos(SHIP.yaw), 0, -Math.sin(SHIP.yaw)); // tribord du cargo, côté du canot
  if (T > 4.2) once('setup', () => {
    hero.visible = brother.visible = false;
    const lb = ship.userData.lifeboat;
    scene.attach(lb);
    O.lb = lb; O.lbY = lb.position.y;
    // des conteneurs glissent par-dessus bord
    for (let i = 0; i < 7; i++) {
      const m = makeFloatingContainer();
      const z = rand(-30, 45), lv = (Math.random() * 3) | 0;
      const p = deck.toWorld(new THREE.Vector3(10.5, ship.userData.deckY + 1.3 + lv * 2.6, z));
      m.position.copy(p);
      m.rotation.set(0, SHIP.yaw, 0);
      scene.add(m);
      O.falling.push({ m, v: side.clone().multiplyScalar(rand(2, 4)).setY(rand(0, 1.5)), spin: rand(-0.8, 0.8), delay: rand(0, 4), floating: false });
    }
    lightning.next = 0.3;
  });
  if (T > 5.6) once('e2', () => say('e2'));
  if (T > 13) once('e3', () => say('e3'));
  if (T > 11) once('flash2', () => { lightning.next = 0.2; });
  if (T > 20.6) once('end', showEnd);

  if (O.lb) {
    const lb = O.lb, k = clamp((T - 4.2) / 3, 0, 1);
    const water = heightAt(lb.position.x, lb.position.z, time);
    if (k < 1) lb.position.y = THREE.MathUtils.lerp(O.lbY, water + 0.3, k * k);
    else {
      lb.position.y += (water + 0.3 - lb.position.y) * (1 - Math.exp(-4 * dt));
      lb.position.addScaledVector(side, 2.4 * dt);
      lb.rotation.set(Math.sin(time * 0.9) * 0.08, SHIP.yaw + 0.3, Math.cos(time * 0.7) * 0.12, 'YXZ');
    }
    for (const f of O.falling) {
      f.delay -= dt;
      if (f.delay > 0) continue;
      const w = heightAt(f.m.position.x, f.m.position.z, time);
      if (!f.floating) {
        f.v.y -= 9.8 * dt;
        f.m.position.addScaledVector(f.v, dt);
        f.m.rotation.z += f.spin * dt;
        if (f.m.position.y < w) { f.floating = true; splash(f.m.position, 3); audio?.slam(0.6); }
      } else {
        f.m.position.y += (w - 0.6 - f.m.position.y) * (1 - Math.exp(-2 * dt));
        f.m.position.addScaledVector(side, 0.6 * dt);
      }
    }
    // caméra : plan large depuis la mer, puis on se rapproche du canot
    const shipC = ship.position.clone();
    const wide = shipC.clone().addScaledVector(side, 95).add(new THREE.Vector3(Math.sin(SHIP.yaw) * -40, 9, Math.cos(SHIP.yaw) * -40));
    const close = lb.position.clone().addScaledVector(side, 16).add(new THREE.Vector3(Math.sin(SHIP.yaw) * 7, 3.5, Math.cos(SHIP.yaw) * 7));
    const u = THREE.MathUtils.smoothstep(T, 11, 17);
    const from = wide.lerp(close, u);
    from.y = Math.max(from.y, heightAt(from.x, from.z, time) + 1.5);
    const look = shipC.clone().setY(shipC.y + 10).lerp(lb.position.clone().setY(lb.position.y + 1), u * 0.85);
    cinematicCamera(from, look, T < 5 ? 1 : 1 - Math.exp(-2 * dt));
    camera.fov = 52; camera.updateProjectionMatrix();
  } else {
    camera.position.copy(camera.position);
  }
}

function showEnd() {
  state = 'end';
  subQueue.length = 0; subs.classList.remove('on');
  setOverlay('end');
  const s = G.stats;
  const mins = Math.floor(G.playTime / 60), secs = Math.floor(G.playTime % 60);
  const acc = s.shots ? Math.round((s.hits / s.shots) * 100) : 0;
  $('stat').innerHTML = `
    <div><dt>Durée</dt><dd>${mins} min ${String(secs).padStart(2, '0')} s</dd></div>
    <div><dt>Ennemis neutralisés</dt><dd>${G.kills}</dd></div>
    <div><dt>Précision</dt><dd>${acc} %</dd></div>
    <div><dt>Tirs à la tête</dt><dd>${s.heads}</dd></div>
    <div><dt>Morts</dt><dd>${s.deaths}</dd></div>
    <div><dt>Visée</dt><dd class="txt">${assistLabel()}</dd></div>`;
  audio?.suspend();
}

/* ================================================== boucle */
const lightning = new Lightning(scene, env, null);
const timer = new THREE.Timer();
resetWorld();
player.update(0.016, 0, 0, 0);
cam.heading = player.heading;
camera.position.set(-12, 4, -14);

function particleScale() {
  const h = innerHeight * pixelRatio;
  const s = h / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  spray.uniforms.uScale.value = smoke.uniforms.uScale.value = fire.uniforms.uScale.value = s;
}

function frame(now) {
  requestAnimationFrame(frame);
  timer.update(now);
  let dt = Math.min(timer.getDelta(), 1 / 20);
  if (state === 'pause' || state === 'settings') { composer.render(); return; }
  if (state === 'dead') dt *= 0.35;
  time += dt;
  G.stateT += dt;
  if (playing()) G.playTime += dt;
  env.uTime.value = time;
  const k = input.keys;

  // cargo : roulis (atténué à pied, puis il se couche à la fin)
  const outroRoll = state === 'outro' ? clamp((G.stateT - 4.2) * 0.03, 0, 0.3) : 0;
  const rollAmp = act === 2 ? 0.02 : 0.045;
  ship.position.y = heightAt(SHIP.x, SHIP.z, time) * (act === 2 ? 0.15 : 0.3) - 0.5 - (state === 'outro' ? Math.max(0, G.stateT - 4.2) * 0.3 : 0);
  ship.rotation.set(Math.sin(time * 0.21) * 0.01, SHIP.yaw, Math.sin(time * 0.27) * rollAmp + 0.03 + outroRoll, 'YXZ');
  ship.userData.redTop.visible = Math.sin(time * 3) > 0;
  ship.updateMatrixWorld(true);

  // assistance à la visée (avant la caméra, sur la vue de la frame précédente)
  let sens = settings.sensitivity;
  if (playing()) {
    const fwd = camera.getWorldDirection(new THREE.Vector3());
    sens *= assist.update(dt, aimHeld(), camera.position, fwd, currentTargets(), losFn, rotateView);
  }

  let throttle = 0;
  if (act === 1) {
    // pilotage
    let steer = 0, boost = false;
    if (state === 'play') {
      throttle = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
      steer = (k.KeyA || k.ArrowLeft ? 1 : 0) - (k.KeyD || k.ArrowRight ? 1 : 0);
      if (touch.on) {
        throttle = clamp(throttle - touch.jy * 1.25, -1, 1);
        steer = clamp(steer - touch.jx * 1.25, -1, 1);
      }
      boost = (!!(k.ShiftLeft || k.ShiftRight) || touch.boost) && throttle > 0;
    } else if (state === 'intro' || state === 'title') {
      throttle = 0.55; steer = Math.sin(time * 0.3) * 0.15;
    } else if (state === 'finale') {
      throttle = 0.75; steer = clamp(wrapAngle(G.ending.heading - player.heading) * 1.5, -1, 1);
    }
    player.update(dt, time, throttle, steer, boost);
    if (state !== 'title') collide(player);

    // personnages sur la vedette
    const camDir = camera.getWorldDirection(_d);
    const aimYaw = Math.atan2(camDir.x, camDir.z);
    const aiming = aimHeld() || time - G.lastShot < 1.2;
    const heroYaw = aiming && state === 'play' ? wrapAngle(aimYaw - player.heading) : 0;
    hero.rotation.y += wrapAngle(heroYaw - hero.rotation.y) * (1 - Math.exp(-12 * dt));
    animateCharacter(hero, dt, { aim: aiming && state === 'play', pitch: Math.asin(clamp(camDir.y, -1, 1)) + 0.05, heave: player.vy, roll: player.roll, t: time });

    // le frère couvre l'arrière et tire sur l'ennemi le plus proche
    let near = null, nd = 1e9;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.boat.x - player.x, e.boat.z - player.z);
      if (d < nd) { nd = d; near = e; }
    }
    const bTarget = near ? wrapAngle(Math.atan2(near.boat.x - player.x, near.boat.z - player.z) - player.heading) : Math.PI;
    brother.rotation.y += wrapAngle(bTarget - brother.rotation.y) * (1 - Math.exp(-4 * dt));
    animateCharacter(brother, dt, { aim: !!near, pitch: -0.05, heave: player.vy, roll: player.roll, t: time });
    G.brotherCd = (G.brotherCd ?? 2) - dt;
    if (near && nd < 120 && G.brotherCd <= 0 && state === 'play') {
      G.brotherCd = rand(1.1, 2.0);
      brother.userData.anim.recoil = 1;
      brother.userData.muzzle.getWorldPosition(_m);
      const hitIt = Math.random() < 0.32;
      const to = new THREE.Vector3(near.boat.x + (hitIt ? 0 : rand(-5, 5)), near.boat.y + (hitIt ? 1.2 : 0), near.boat.z + (hitIt ? 0 : rand(-5, 5)));
      if (!hitIt) { to.y = heightAt(to.x, to.z, time); splash(to, 0.5); }
      tracers.fire(_m, to, [7, 5, 2.4], 500);
      audio?.gunshot(0.6, 0);
      if (hitIt) damageEnemy(near, 12, to);
    }

    if (state === 'play') updateMission(dt);
    if (state === 'finale') updateFinale(dt);
    updateEnemies(dt);

    for (const c of containers) {
      const h = heightAt(c.x, c.z, time);
      c.m.position.set(c.x, h - 0.5, c.z);
      c.m.rotation.set(Math.sin(time * 0.8 + c.ph) * 0.12, c.yaw, Math.cos(time * 0.6 + c.ph) * 0.15, 'YXZ');
    }
  } else if (state === 'deck' || (state === 'dead' && act === 2)) {
    const inp = {
      forward: (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) - (touch.on ? touch.jy : 0),
      right: (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0) + (touch.on ? touch.jx : 0),
      run: !!(k.ShiftLeft || k.ShiftRight) || touch.boost,
      aiming: aimHeld() && state === 'deck',
      shotRecently: time - G.lastShot < 1.0,
    };
    if (state === 'dead') { inp.forward = inp.right = 0; inp.aiming = false; }
    deck.update(dt, inp);
  }

  // armes
  if (playing()) {
    G.fireCd -= dt;
    G.bloom = Math.max(0, G.bloom - dt * (aimHeld() ? 0.09 : 0.05));
    if (G.reloading > 0) { G.reloading -= dt; if (G.reloading <= 0) finishReload(); }
    // un clic bref entre deux images compte quand même
    const f = fireHeld();
    const W = WEAPONS[G.cur];
    if (input.clicked && time - input.clickT > 0.35) input.clicked = false;
    const want = (f && (W.auto || !G.trigger || touch.fire)) || input.clicked;
    if (want && G.fireCd <= 0 && G.reloading <= 0) { playerShoot(); input.clicked = false; }
    G.trigger = f;
  }

  // caméra
  if (act === 1) {
    if (state === 'play' || state === 'dead' || state === 'pause') updateCamera(dt, sens);
    else if (state === 'intro' || state === 'title') introCamera(dt);
    else if (state === 'finale') finaleCamera(dt);
  } else {
    if (state === 'deck' || state === 'dead') {
      const inv = settings.invertY ? -1 : 1;
      deck.updateCamera(dt, aimHeld() && state === 'deck', input.mx, input.my * inv, sens);
      input.mx = input.my = 0;
    } else if (state === 'chapter') {
      if (G.stateT > 4.2) { setOverlay(null); document.body.classList.add('cinema'); state = 'wake'; G.stateT = 0; }
      updateWake(0.0001, false);
    } else if (state === 'wake') updateWake(dt);
    else if (state === 'outro') updateOutro(dt);
    // trois lampes de pont réelles suivent le joueur
    const P = deck.player.pos;
    const lamps = ship.userData.lampPos.slice().sort((a, b) => a.distanceToSquared(P) - b.distanceToSquared(P));
    deckLamps.forEach((l, i) => { l.position.copy(lamps[i]); l.intensity = state === 'outro' ? 0 : 40; });
  }
  applyShake(dt);
  if (DEBUG && window.__camOverride) { camera.position.copy(window.__camOverride.pos); camera.lookAt(window.__camOverride.look); camera.fov = 55; camera.updateProjectionMatrix(); }
  particleScale();

  // effets
  const flash = lightning.update(dt, camera);
  hemi.intensity = 1.5 + flash * 5;
  const light = 0.32 + flash * 2.2;
  const windX = act === 1 ? 7 - player.fx * player.speed * 0.7 : 7, windZ = act === 1 ? 4 - player.fz * player.speed * 0.7 : 4;
  rain.update(camera, windX, windZ);
  ocean.update(camera);
  headlight.intensity = act === 1 ? 12000 : 0;
  muzzleLight.intensity *= Math.exp(-40 * dt);
  boomLight.intensity *= Math.exp(-2.2 * dt);
  pushLights();
  if (act === 1) {
    if (Math.random() < dt * Math.abs(player.speed) * 3.2) emitWakeSpray(player, 1);
    playerWake.update(dt, time, player.x - player.fx * 4.2, player.z - player.fz * 4.2, player.heading, player.speed, player.B, light);
  }
  spray.update(dt, light);
  smoke.update(dt, 0.7 + flash * 3);
  fire.update(dt, 1);
  tracers.update(dt);
  updateSubs(dt);
  updateHud(dt);
  toastT -= dt; if (toastT <= 0) $('toast').classList.remove('on');
  audio?.update(act === 1 ? player.speed : 0, Math.max(0, throttle), state === 'finale' ? clamp(G.stateT / 8, 0, 1) : state === 'outro' ? 0.25 : 0);

  // retour visuel des dégâts et régénération
  if (playing() && time - G.lastHit > 3.5) G.hp = Math.min(100, G.hp + 28 * dt);
  G.damageFx += ((1 - G.hp / 100) - G.damageFx) * (1 - Math.exp(-6 * dt));
  if (state === 'dead') {
    G.damageFx = 1; G.fade = Math.min(0.75, G.stateT * 0.6);
    if (G.stateT > 1.2 && !$('dead').classList.contains('show')) setOverlay('dead');
  } else if (state === 'play' || state === 'deck' || state === 'intro' || state === 'title') G.fade = Math.max(0, G.fade - dt * 0.6);
  finalPass.uniforms.uDamage.value = G.damageFx;
  G.wet = Math.max(0.35, G.wet - dt * 0.12);
  const aimK = act === 1 ? cam.aim : deck.cam.aimK;
  finalPass.uniforms.uWet.value = G.wet * (1 - aimK * 0.5);
  finalPass.uniforms.uWhite.value = G.white;
  finalPass.uniforms.uFade.value = G.fade;
  finalPass.uniforms.uTime.value = time;

  composer.render();
}

/* ------------------------------------------------ cinématique d'ouverture */
function introCamera(dt) {
  const t = state === 'title' ? time * 0.4 : G.stateT;
  const u = clamp(t / 11, 0, 1);
  const e = u * u * (3 - 2 * u);
  const a = player.heading + (state === 'title' ? Math.PI * 0.65 + Math.sin(time * 0.05) * 0.5 : THREE.MathUtils.lerp(Math.PI * 0.55, Math.PI * 1.0, e));
  const d = state === 'title' ? 13 : THREE.MathUtils.lerp(6.5, 9.5, e);
  const h = state === 'title' ? 2.2 : THREE.MathUtils.lerp(1.0, 3.3, e);
  const from = new THREE.Vector3(player.x + Math.sin(a) * d, 0, player.z + Math.cos(a) * d);
  from.y = Math.max(player.y + h, heightAt(from.x, from.z, time) + 0.7);
  const look = new THREE.Vector3(player.x + player.fx * (state === 'title' ? 0 : 6 * e), player.y + 1.8, player.z + player.fz * (state === 'title' ? 0 : 6 * e));
  cinematicCamera(from, look, 1 - Math.exp(-4 * dt));
  if (state === 'intro' && G.stateT > 12.5) startPlay();
  if (state === 'intro') { cam.heading = player.heading; cam.yaw = 0; cam.pitch = 0.16; cam.tx = player.x; cam.ty = player.y; cam.tz = player.z; }
  camera.fov = 55; camera.updateProjectionMatrix();
}

/* ------------------------------------------------ déroulé du chapitre 1 */
function updateMission() {
  const p = progress();
  sea.amp = 0.9 + clamp(p, 0, 1) * 0.3;
  const w = WAVES[G.wave];
  if (w && p >= w.at) {
    G.wave++;
    G.queue += w.count;
    G.checkpoint = { x: player.x, z: player.z, h: player.heading, wave: G.wave };
    say(w.line);
    if (G.wave === 1) objective('Sème les mercenaires — ou coule-les');
  }
  if (G.queue > 0 && spawnEnemy()) G.queue--;
  if (!G.saidMid && p > 0.48) { G.saidMid = true; say('m1'); }
  if (!G.saidBox && p > 0.66) { G.saidBox = true; say('m2'); }

  const d = obbDist(player.x, player.z, SHIP.x, SHIP.z, SHIP.yaw, SHIP.hx, SHIP.hz);
  if (d < 95) startFinale();
}

/* ------------------------------------------------ la vague */
function startFinale() {
  state = 'finale'; G.stateT = 0;
  document.exitPointerLock?.();
  document.body.classList.add('cinema');
  objective('');
  // la vague arrive par bâbord, perpendiculaire à la route vers le cargo
  const toShip = Math.atan2(SHIP.x - player.x, SHIP.z - player.z);
  const lx = Math.cos(toShip), lz = -Math.sin(toShip); // gauche du bateau
  G.ending = { heading: toShip, hit: false, t: 0 };
  sea.rogue.dx = -lx; sea.rogue.dz = -lz;
  sea.rogue.x = player.x + lx * 190; sea.rogue.z = player.z + lz * 190;
  sea.rogue.h = 0; sea.rogue.w = 26;
  for (const e of enemies) { e.fireCd = 99; e.slot.light.intensity = 0; }
  subQueue.length = 0; subT = 0;
  say('f1'); say('f2'); say('f3');
  lightning.next = 0.6;
}

function updateFinale(dt) {
  const r = sea.rogue;
  r.h = Math.min(24, r.h + dt * 3.4);
  r.x += r.dx * 19 * dt; r.z += r.dz * 19 * dt;
  const s = (player.x - r.x) * r.dx + (player.z - r.z) * r.dz;
  if (!G.ending.hit && s < 6) {
    G.ending.hit = true; G.ending.t = 0;
    G.shake = 1.5;
    audio?.explosion(1.2);
  }
  if (G.ending.hit) {
    G.ending.t += dt;
    G.white = clamp(G.ending.t * 2.2, 0, 1) * clamp(2.2 - G.ending.t, 0, 1);
    G.fade = clamp((G.ending.t - 1.1) * 1.2, 0, 1);
    if (G.ending.t > 2.8) startChapter2();
  }
}

function finaleCamera(dt) {
  const r = sea.rogue;
  const rx = Math.cos(player.heading), rz = -Math.sin(player.heading);
  // en retrait, à tribord : la vedette au premier plan, la vague derrière elle
  const from = new THREE.Vector3(player.x - player.fx * 12 - rx * 8, 0, player.z - player.fz * 12 - rz * 8);
  from.y = Math.max(player.y + 2.4, heightAt(from.x, from.z, time) + 1.2);
  const look = new THREE.Vector3(
    THREE.MathUtils.lerp(player.x, r.x, 0.12), player.y + 0.8 + r.h * 0.16,
    THREE.MathUtils.lerp(player.z, r.z, 0.12));
  cinematicCamera(from, look, 1 - Math.exp(-2.5 * dt));
  camera.fov += (58 - camera.fov) * (1 - Math.exp(-2 * dt));
  camera.updateProjectionMatrix();
}

/* ------------------------------------------------ HUD */
const elAmmo = $('ammo'), elDist = $('dist'), elHit = $('hitmarker'), elCross = $('crosshair'), elReload = $('reloadBar');
function updateHud(dt) {
  if (!playing()) return;
  const W = WEAPONS[G.cur], inv = G.inv[G.cur];
  elAmmo.innerHTML = `<b>${inv.ammo}</b><i>/ ${inv.reserve === Infinity ? '∞' : inv.reserve}</i><span>${W.label}</span>`;
  elAmmo.classList.toggle('low', inv.ammo <= Math.ceil(W.mag * 0.2));
  let d, ang;
  if (act === 1) {
    d = obbDist(player.x, player.z, SHIP.x, SHIP.z, SHIP.yaw, SHIP.hx, SHIP.hz);
    ang = wrapAngle(Math.atan2(SHIP.x - player.x, SHIP.z - player.z) - (cam.heading + cam.yaw));
    $('speed').textContent = `${Math.round(Math.abs(player.speed) * 1.94)} nœuds`;
  } else {
    d = deck.distanceToDoor();
    ang = wrapAngle(deck.doorBearing());
    $('speed').textContent = deck.player.crouch ? 'Accroupi' : '';
  }
  elDist.textContent = `${Math.max(0, Math.round(d)).toLocaleString('fr-FR')} m`;
  $('compass').style.transform = `rotate(${-ang}rad)`;
  G.hitmarker -= dt;
  elHit.classList.toggle('on', G.hitmarker > 0);
  elHit.classList.toggle('kill', G.hitmarker > 0 && G.hitKill);
  elHit.classList.toggle('head', G.hitmarker > 0 && !!G.hitHead);
  // réticule : s'élargit avec la dispersion, rougit sur une cible
  const fwd = camera.getWorldDirection(_d);
  const over = pickTarget(camera.position, fwd, currentTargets(), 0.03, losFn);
  const spread = (aimHeld() ? W.spreadAim : W.spread) + G.bloom;
  elCross.style.setProperty('--s', (0.55 + spread * 40).toFixed(2));
  elCross.classList.toggle('aim', aimHeld());
  elCross.classList.toggle('enemy', !!over);
  elReload.style.transform = `scaleX(${G.reloading > 0 ? 1 - G.reloading / W.reload : 0})`;
}

if (DEBUG) {
  window.__game = {
    THREE, ship, deck, layers: { spray: spray.mesh, smoke: smoke.mesh, fire: fire.mesh, rain: rain.mesh, wake: playerWake.mesh, tracers: tracers.mesh },
    bloom, headlight, G, cam, player, enemies, sea, settings, assist,
    get state() { return state; }, set state(v) { state = v; }, get act() { return act; },
    startPlay, spawnEnemy, startFinale, startChapter2, startDeck, startOutro, damagePlayer, damageEnemy, pickup, switchWeapon, SHIP,
  };
}
setupTouch();
frame();
$('loading').remove();
$('play').disabled = false;
