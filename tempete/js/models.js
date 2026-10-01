// Modèles procéduraux : coques, vedette, embarcations ennemies,
// personnages et cargo. Aucun asset externe.
import * as THREE from 'three';

const std = (color, rough = 0.6, metal = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

/* Coque : sections en V le long de l'axe +Z (proue en +Z). */
export function hullGeometry(L, B, H, { deadrise = 0.45, bowRise = 0.25, flare = 1 } = {}) {
  const NS = 28;
  const prof = [];
  for (let s = 0; s <= NS; s++) {
    const t = s / NS;
    const z = -L / 2 + t * L;
    const nose = t > 0.55 ? Math.sqrt(Math.max(0, 1 - ((t - 0.55) / 0.45) ** 2)) : 1;
    const b = Math.max(0.02, (B / 2) * nose * (t < 0.08 ? 0.94 + t * 0.75 : 1));
    const top = H * (0.62 + bowRise * t * t);
    const keel = -H * 0.38 * (t > 0.7 ? 1 - (t - 0.7) / 0.3 * 0.8 : 1);
    const chine = keel + (top - keel) * 0.3;
    prof.push([
      [-b * flare, top, z],
      [-b * 0.97, chine, z],
      [-b * 0.45, keel + (chine - keel) * deadrise, z],
      [0, keel, z],
      [b * 0.45, keel + (chine - keel) * deadrise, z],
      [b * 0.97, chine, z],
      [b * flare, top, z],
    ]);
  }
  const P = 7;
  const pos = [], idx = [];
  prof.forEach((sec) => sec.forEach((p) => pos.push(...p)));
  for (let s = 0; s < NS; s++) {
    for (let k = 0; k < P - 1; k++) {
      const a = s * P + k, b = a + 1, c = a + P, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  // tableau arrière
  const base = pos.length / 3;
  prof[0].forEach((p) => pos.push(...p));
  for (let k = 1; k < P - 1; k++) idx.push(base, base + k + 1, base + k);
  // pont
  const deck = pos.length / 3;
  prof.forEach((sec) => { pos.push(...sec[0]); pos.push(...sec[P - 1]); });
  for (let s = 0; s < NS; s++) {
    const a = deck + s * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* Personnage stylisé (~1,8 m), debout, arme au poing. */
export function makeCharacter({ shirt = 0x8a7a62, pants = 0x2a3140, skin = 0xb98a6a, hair = 0x2b1d14, jacket = null } = {}) {
  const g = new THREE.Group();
  const mSkin = std(skin, 0.7), mShirt = std(shirt, 0.85), mPants = std(pants, 0.9), mHair = std(hair, 0.9);
  const mGun = std(0x1a1a1c, 0.4, 0.8);
  const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 4, 10), m);

  const legL = cap(0.085, 0.72, mPants); legL.position.set(0.11, 0.48, 0);
  const legR = cap(0.085, 0.72, mPants); legR.position.set(-0.11, 0.48, 0);
  const torso = cap(0.19, 0.42, jacket ? std(jacket, 0.8) : mShirt);
  torso.position.set(0, 1.18, 0); torso.scale.set(1, 1, 0.72);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.1, 8), mSkin); neck.position.set(0, 1.5, 0);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), mSkin);
  head.scale.set(0.9, 1.08, 1); head.position.set(0, 1.64, 0.01);
  const hairM = new THREE.Mesh(new THREE.SphereGeometry(0.122, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), mHair);
  hairM.position.set(0, 1.665, -0.005); hairM.scale.set(0.92, 1, 1.02);

  // bras gauche le long du corps, bras droit tendu avec le pistolet
  const armL = new THREE.Group(); armL.position.set(0.24, 1.38, 0);
  const aL = cap(0.055, 0.5, jacket ? std(jacket, 0.8) : mShirt); aL.position.y = -0.27; armL.add(aL);
  armL.rotation.z = 0.12;
  const armR = new THREE.Group(); armR.position.set(-0.24, 1.38, 0);
  const aR = cap(0.055, 0.5, jacket ? std(jacket, 0.8) : mShirt); aR.position.y = -0.27; armR.add(aR);
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mSkin); hand.position.y = -0.56; armR.add(hand);
  const gun = new THREE.Group();
  const slide = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.045, 0.2), mGun); slide.position.set(0, 0.02, 0.06);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.045), mGun); grip.position.set(0, -0.03, 0); grip.rotation.x = -0.25;
  gun.add(slide, grip);
  gun.position.set(0, -0.6, 0.02); gun.rotation.x = Math.PI / 2;
  armR.add(gun);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.03, 0.17); gun.add(muzzle);

  g.add(legL, legR, torso, neck, head, hairM, armL, armR);
  g.userData = { armR, armL, head, torso, muzzle };
  return g;
}

export function aimArm(ch, pitch, aiming) {
  const a = ch.userData.armR;
  const target = aiming ? -Math.PI / 2 - pitch : -0.25;
  a.rotation.x += (target - a.rotation.x) * 0.3;
}

/* Vedette des deux frères. */
export function makeSpeedboat() {
  const g = new THREE.Group();
  const L = 8.2, B = 2.7, H = 1.5;
  const hull = new THREE.Mesh(hullGeometry(L, B, H), std(0xaeb3b3, 0.4, 0.05));
  const stripe = new THREE.Mesh(hullGeometry(L * 1.002, B * 1.01, H * 0.5, { bowRise: 0.5 }), std(0x16263a, 0.4));
  stripe.position.y = 0.32;
  const floor = new THREE.Mesh(new THREE.BoxGeometry(B * 0.8, 0.04, L * 0.62), std(0x6b4a30, 0.75));
  floor.position.set(0, 0.95, -0.7);

  // poste de pilotage
  const console_ = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.8), std(0xe6e6e2, 0.4));
  console_.position.set(0.35, 0.92, 0.6);
  const wind = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.5, 0.03),
    new THREE.MeshPhysicalMaterial({ color: 0x9fb7c4, roughness: 0.05, transmission: 0.0, transparent: true, opacity: 0.35, metalness: 0.2 }));
  wind.position.set(0.35, 1.62, 0.95); wind.rotation.x = -0.45;
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 18), std(0x111111, 0.5));
  wheel.position.set(0.35, 1.35, 0.25); wheel.rotation.x = -0.7;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x2a8a9a, emissiveIntensity: 1.4 }));
  screen.position.set(0.35, 1.43, 0.6); screen.rotation.x = -0.6;
  screen.rotation.y = Math.PI;
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.6), std(0x2a2a2a, 0.9));
  seat.position.set(0, 1.15, -1.6);

  // moteurs hors-bord
  const engMat = std(0x101114, 0.35, 0.3);
  for (const x of [-0.55, 0.55]) {
    const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.8, 0.7), engMat);
    cowl.position.set(x, 1.0, -L / 2 - 0.35);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 0.25), engMat);
    leg.position.set(x, 0.15, -L / 2 - 0.45);
    g.add(cowl, leg);
  }
  // rambarde
  const railMat = std(0xb8bcc0, 0.25, 0.9);
  const rail = (a, b) => {
    const d = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, d.length(), 6), railMat);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    g.add(m);
  };
  for (const s of [-1, 1]) {
    const pts = [new THREE.Vector3(s * 1.25, 1.45, -1), new THREE.Vector3(s * 1.2, 1.6, 2.2), new THREE.Vector3(s * 0.5, 1.85, 3.9)];
    rail(pts[0], pts[1]); rail(pts[1], pts[2]);
    rail(new THREE.Vector3(s * 1.25, 1.0, -1), pts[0]);
    rail(new THREE.Vector3(s * 1.2, 1.15, 2.2), pts[1]);
  }

  // feux de navigation
  const navR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 0.2, 0.15) }));
  const navG = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 6, 0.8) }));
  navR.position.set(1.25, 1.5, 2.6); navG.position.set(-1.25, 1.5, 2.6);
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.15, 12), std(0x222222, 0.3, 0.8));
  lamp.rotation.x = Math.PI / 2; lamp.position.set(0, 1.95, 1.0);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 2.5, 2.2) }));
  lens.position.set(0, 1.95, 1.08);

  g.add(hull, stripe, floor, console_, wind, wheel, screen, seat, navR, navG, lamp, lens);
  // la source est placée devant l'étrave pour ne pas brûler la rambarde et le pare-brise
  g.userData = { L, B, headlightPos: new THREE.Vector3(0, 2.1, 4.6) };
  return g;
}

/* Semi-rigide des mercenaires, avec projecteur sur arceau. */
export function makeMercBoat() {
  const g = new THREE.Group();
  const L = 7.4, B = 2.6, H = 1.3;
  const hull = new THREE.Mesh(hullGeometry(L, B, H, { bowRise: 0.15 }), std(0x2b2f33, 0.6));
  // boudins latéraux
  const tubeMat = std(0x3c3f38, 0.85);
  for (const s of [-1, 1]) {
    const tube = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, L * 0.78, 6, 12), tubeMat);
    tube.rotation.x = Math.PI / 2; tube.position.set(s * 1.25, 0.95, -0.15);
    g.add(tube);
  }
  const bowTube = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.28, 8, 16, Math.PI), tubeMat);
  bowTube.rotation.x = Math.PI / 2; bowTube.rotation.z = Math.PI; bowTube.position.set(0, 0.95, 2.75); bowTube.scale.set(1.25, 1, 1);
  const console_ = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.7), std(0x1d2024, 0.6));
  console_.position.set(0, 0.95, 0.4);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 6, 20, Math.PI), std(0x8d9196, 0.3, 0.9));
  arch.position.set(0, 1.3, -1.3);
  const engine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 0.7), std(0x0d0d0f, 0.4, 0.3));
  engine.position.set(0, 1.0, -L / 2 - 0.3);
  const lampHead = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.3, 14), std(0x1a1a1a, 0.3, 0.8));
  lampHead.rotation.x = Math.PI / 2; lampHead.position.set(0, 2.45, -1.3);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.18, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 4, 3.6) }));
  lens.position.set(0, 2.45, -1.14);
  g.add(hull, bowTube, console_, arch, engine, lampHead, lens);

  const pilot = makeCharacter({ shirt: 0x2c3328, pants: 0x23261f, jacket: 0x30362b, skin: 0x9a7058 });
  pilot.position.set(0, 0.85, -0.2); pilot.rotation.y = 0;
  const gunner = makeCharacter({ shirt: 0x2c3328, pants: 0x23261f, jacket: 0x262a24, skin: 0xc29a7e, hair: 0x111111 });
  gunner.position.set(0.5, 0.85, 1.6);
  // fusil
  const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.8), std(0x111111, 0.4, 0.7));
  rifle.position.set(0, -0.62, 0.25); rifle.rotation.x = Math.PI / 2;
  gunner.userData.armR.add(rifle);
  gunner.userData.armR.rotation.x = -Math.PI / 2;
  g.add(pilot, gunner);

  g.userData = { L, B, lampPos: new THREE.Vector3(0, 2.45, -1.1), lens, gunner, pilot };
  return g;
}

/* Fenêtres éclairées pour la passerelle du cargo. */
function windowTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 256, 128);
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 12; i++) {
      if (Math.random() < 0.55) continue;
      const w = 0.4 + Math.random() * 0.6;
      x.fillStyle = `rgba(255,${190 + Math.random() * 50 | 0},${120 + Math.random() * 60 | 0},${w})`;
      x.fillRect(6 + i * 21, 10 + r * 30, 12, 14);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* Porte-conteneurs à la dérive (longueur selon +Z). */
export function makeCargoShip() {
  const g = new THREE.Group();
  const L = 170, B = 26, H = 17;
  const hull = new THREE.Mesh(hullGeometry(L, B, H, { deadrise: 0.95, bowRise: 0.15, flare: 1.02 }), std(0x3a3f44, 0.7, 0.25));
  hull.position.y = -1;
  const boot = new THREE.Mesh(hullGeometry(L * 1.003, B * 1.006, H * 0.45, { deadrise: 0.95, bowRise: 0.1 }), std(0x5a1410, 0.85, 0.1));
  boot.position.y = -1.5;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(B * 0.96, 0.6, L * 0.82), std(0x3b4038, 0.9));
  deck.position.set(0, H * 0.62 - 1.3, -4);
  g.add(hull, boot, deck);

  // conteneurs empilés
  const palette = [0x7a2a1c, 0x1d3d5c, 0x2f4f2a, 0x6b6e70, 0x8a4a14, 0x5c1d2c, 0x2c5a63, 0x8c7a2c];
  const cw = 2.44, ch = 2.6, cl = 12.2;
  const geo = new THREE.BoxGeometry(cw, ch, cl);
  const mat = std(0xffffff, 0.75, 0.35);
  const slots = [];
  const deckY = H * 0.62 - 1;
  for (let bay = 0; bay < 9; bay++) {
    const z = -L / 2 + 42 + bay * (cl + 1.2);
    if (z > L / 2 - 26) break;
    for (let col = 0; col < 9; col++) {
      const x = (col - 4) * (cw + 0.12);
      const hgt = 2 + Math.floor(Math.random() * 4);
      for (let lv = 0; lv < hgt; lv++) slots.push([x, deckY + ch / 2 + lv * ch, z, lv === hgt - 1 && Math.random() < 0.15]);
    }
  }
  const inst = new THREE.InstancedMesh(geo, mat, slots.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
  slots.forEach(([x, y, z, tilt], i) => {
    e.set(0, tilt ? (Math.random() - 0.5) * 0.4 : 0, tilt ? (Math.random() - 0.5) * 0.15 : 0);
    q.setFromEuler(e);
    m4.compose(new THREE.Vector3(x + (tilt ? (Math.random() - 0.5) * 1.2 : 0), y, z), q, new THREE.Vector3(1, 1, 1));
    inst.setMatrixAt(i, m4);
    col.setHex(palette[(Math.random() * palette.length) | 0]).multiplyScalar(0.55 + Math.random() * 0.4);
    inst.setColorAt(i, col);
  });
  g.add(inst);

  // château arrière
  const supMat = std(0xc9c4b8, 0.7, 0.1);
  const sup = new THREE.Mesh(new THREE.BoxGeometry(B * 0.85, 20, 14), supMat);
  sup.position.set(0, deckY + 10, -L / 2 + 22);
  const winTex = windowTexture();
  const winMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 2.5, roughness: 0.4 });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(B * 0.83, 9), winMat);
  win.position.set(0, deckY + 12, -L / 2 + 29.05);
  const winB = win.clone(); winB.rotation.y = Math.PI; winB.position.z = -L / 2 + 14.95;
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(B * 1.05, 3.2, 7), supMat);
  bridge.position.set(0, deckY + 21.6, -L / 2 + 25);
  const funnel = new THREE.Mesh(new THREE.BoxGeometry(5, 9, 6), std(0x1f2a33, 0.6));
  funnel.position.set(0, deckY + 26, -L / 2 + 16);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 16, 8), std(0x888888, 0.4, 0.8));
  mast.position.set(0, deckY + 30, -L / 2 + 25);
  const fore = mast.clone(); fore.position.set(0, deckY + 8, L / 2 - 14);
  g.add(sup, win, winB, bridge, funnel, mast, fore);

  // feux : blancs de pont, rouges de mât
  const bulb = (x, y, z, c) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: c }));
    m.position.set(x, y, z); g.add(m); return m;
  };
  const warm = new THREE.Color(9, 6.5, 3.5), red = new THREE.Color(10, 0.4, 0.2);
  const lamps = [];
  for (let i = 0; i < 7; i++) {
    lamps.push(bulb(B / 2 - 0.5, deckY + 1.5, -L / 2 + 35 + i * 18, warm));
    lamps.push(bulb(-B / 2 + 0.5, deckY + 1.5, -L / 2 + 35 + i * 18, warm));
  }
  const redTop = bulb(0, deckY + 38.2, -L / 2 + 25, red);
  bulb(0, deckY + 16.2, L / 2 - 14, red);
  bulb(B * 0.53, deckY + 21.6, -L / 2 + 25, new THREE.Color(10, 0.3, 0.2));
  bulb(-B * 0.53, deckY + 21.6, -L / 2 + 25, new THREE.Color(0.2, 10, 1.5));

  const pl1 = new THREE.PointLight(0xffc08a, 2500, 160, 2);
  pl1.position.set(0, deckY + 24, -L / 2 + 34);
  const pl2 = new THREE.PointLight(0xffc08a, 1500, 120, 2);
  pl2.position.set(0, deckY + 14, L / 2 - 20);
  // projecteurs de pont qui éclairent les piles de conteneurs
  const flood = (x, y, z, tx, ty, tz) => {
    const s = new THREE.SpotLight(0xffd2a0, 30000, 140, 0.75, 0.6, 2);
    s.position.set(x, y, z); s.target.position.set(tx, ty, tz);
    g.add(s, s.target);
    bulb(x, y, z, new THREE.Color(14, 11, 7));
  };
  flood(0, deckY + 22, -L / 2 + 30, 0, deckY, 20);
  flood(B / 2 + 1, deckY + 14, L / 2 - 16, B / 2 + 4, deckY - 6, -20);
  g.add(pl1, pl2);

  g.userData = { L, B, H, lights: [pl1, pl2], redTop };
  return g;
}

/* Conteneur tombé à la mer. */
export function makeFloatingContainer() {
  const palette = [0x7a2a1c, 0x1d3d5c, 0x2f4f2a, 0x8a4a14];
  const m = new THREE.Mesh(new THREE.BoxGeometry(2.44, 2.6, 12.2),
    std(new THREE.Color(palette[(Math.random() * palette.length) | 0]).multiplyScalar(0.7), 0.7, 0.4));
  return m;
}
