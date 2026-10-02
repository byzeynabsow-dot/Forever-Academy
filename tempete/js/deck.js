// Chapitre 2 — le pont du cargo, à pied. Tout est calculé dans le repère local
// du navire (proue en +Z) ; le roulis du cargo s'applique donc à tout le monde.
import * as THREE from 'three';
import { makeCharacter, animateCharacter, setWeapon, cargoHalfWidth } from './models.js';
import { heightAt } from './ocean.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const DOOR = new THREE.Vector3(0, 0, -55.4);

// Trois accrochages le long du pont. posts : positions de repli successives.
const ENCOUNTERS = [
  {
    trigger: 53, line: 'c1', checkpoint: [0, 66],
    mercs: [
      { posts: [[10.6, 36], [10.4, 47.6]] },
      { posts: [[-4, 32.4], [-10.4, 32.4], [-10.4, 37], [-10, 47.6]] },
      { posts: [[0, 45.4]], y: 5.2, elevated: true },
    ],
  },
  {
    trigger: 19, line: 'c7', checkpoint: [10.5, 21],
    mercs: [
      { posts: [[-8, 0.6], [-5.5, 0.9]] },
      { posts: [[1.5, 4.6], [-0.4, 4.6]] },
      { posts: [[5.1, -10.4], [0, -9]] },
      { posts: [[-3, -5], [-1, -6.2]] },
    ],
  },
  {
    trigger: -16, line: 'c2', checkpoint: [0, -12.5],
    mercs: [
      { posts: [[0, -47], [2.6, -47.2]] },
      { posts: [[-7.5, -50.2], [-10.6, -44.2]] },
      { posts: [[7.5, -51.1], [10.6, -44.2]] },
      { posts: [[9, -57.2]], y: 13.66 + 9.54, elevated: true, sniper: true },
    ],
  },
];

export class DeckAct {
  constructor(ctx) {
    this.ctx = ctx;
    const ship = ctx.ship;
    this.ship = ship;
    this.deckY = ship.userData.deckY;
    this.cols = ship.userData.colliders.map((c) => ({ min: c.min, max: c.max, tag: c.tag }));
    this.player = { pos: new THREE.Vector3(), vel: new THREE.Vector3(), facing: Math.PI, crouch: false, crouchK: 0, moving: 0 };
    this.cam = { yaw: Math.PI, pitch: 0.12, aimK: 0 };
    this.mercs = [];
    this.pickups = [];
    this.crumbs = [];
    this.elias = { pos: new THREE.Vector3(), facing: Math.PI, cd: 2, shots: 0, moving: 0 };
    this.encounter = 0;
    this.waveT = 8;
    this.lastStep = 0;
    this.started = false;
    this.wakeT = 0;
    this._a = new THREE.Vector3(); this._b = new THREE.Vector3(); this._c = new THREE.Vector3();
  }

  /* ----------------------------------------------------------- outils */
  toWorld(v, out = new THREE.Vector3()) { return out.copy(v).applyMatrix4(this.ship.matrixWorld); }
  toLocal(v, out = new THREE.Vector3()) { return this.ship.worldToLocal(out.copy(v)); }
  dirToLocal(d, out = new THREE.Vector3()) {
    const inv = this._inv || (this._inv = new THREE.Matrix4());
    inv.copy(this.ship.matrixWorld).invert();
    return out.copy(d).transformDirection(inv);
  }

  /* Rayon contre les boîtes (méthode des dalles) ; renvoie la distance du premier impact. */
  rayBoxes(o, d, maxT = 400) {
    let best = maxT, hitBox = null;
    for (const c of this.cols) {
      let t0 = 0, t1 = best, ok = true;
      for (let k = 0; k < 3; k++) {
        const ok_ = o.getComponent(k), dk = d.getComponent(k);
        if (Math.abs(dk) < 1e-9) { if (ok_ < c.min[k] || ok_ > c.max[k]) { ok = false; break; } continue; }
        let a = (c.min[k] - ok_) / dk, b = (c.max[k] - ok_) / dk;
        if (a > b) [a, b] = [b, a];
        t0 = Math.max(t0, a); t1 = Math.min(t1, b);
        if (t0 > t1) { ok = false; break; }
      }
      if (ok && t0 < best) { best = t0; hitBox = c; }
    }
    if (d.y < 0) {
      const td = (this.deckY - o.y) / d.y;
      if (td > 0 && td < best) {
        const x = o.x + d.x * td, z = o.z + d.z * td;
        if (Math.abs(x) < cargoHalfWidth(z) && z > -85 && z < 85) { best = td; hitBox = { tag: 'deck' }; }
      }
    }
    return { t: best, box: hitBox };
  }

  /* Ligne de vue entre deux points locaux. */
  clear(a, b) {
    const d = this._c.copy(b).sub(a);
    const len = d.length();
    d.divideScalar(len);
    return this.rayBoxes(a, d, len - 0.2).t >= len - 0.25;
  }

  /* Déplacement d'un cercle avec glissement contre les obstacles et le pavois. */
  moveCircle(pos, dx, dz, r = 0.35) {
    pos.x += dx; pos.z += dz;
    for (let pass = 0; pass < 2; pass++) {
      for (const c of this.cols) {
        if (c.max[1] < pos.y + 0.4 || c.min[1] > pos.y + 1.6) continue;
        const cx = clamp(pos.x, c.min[0], c.max[0]), cz = clamp(pos.z, c.min[2], c.max[2]);
        const ox = pos.x - cx, oz = pos.z - cz, d2 = ox * ox + oz * oz;
        if (d2 >= r * r) continue;
        if (d2 > 1e-8) { const d = Math.sqrt(d2); pos.x = cx + (ox / d) * r; pos.z = cz + (oz / d) * r; } else {
          const pl = pos.x - c.min[0], pr = c.max[0] - pos.x, pb = pos.z - c.min[2], pf = c.max[2] - pos.z;
          const m = Math.min(pl, pr, pb, pf);
          if (m === pl) pos.x = c.min[0] - r; else if (m === pr) pos.x = c.max[0] + r;
          else if (m === pb) pos.z = c.min[2] - r; else pos.z = c.max[2] + r;
        }
      }
    }
    pos.z = clamp(pos.z, -55.6, 79);
    const hw = cargoHalfWidth(pos.z) - 0.55;
    pos.x = clamp(pos.x, -hw, hw);
  }

  /* ----------------------------------------------------------- démarrage */
  start(checkpoint = 0) {
    const { hero, brother } = this.ctx;
    this.ship.add(hero, brother);
    hero.rotation.set(0, Math.PI, 0, 'YXZ');
    brother.rotation.set(0, Math.PI, 0, 'YXZ');
    this.clearMercs();
    // checkpoint k : on reprend juste avant l'accrochage k, qui se redéclenche
    const cp = checkpoint === 0 ? [1.5, 72] : ENCOUNTERS[checkpoint].checkpoint;
    this.player.pos.set(cp[0], this.deckY, cp[1]);
    this.player.vel.set(0, 0, 0);
    this.player.crouch = false;
    this.elias.pos.set(cp[0] - 1.6, this.deckY, cp[1] + 2.2);
    this.cam.yaw = Math.PI; this.cam.pitch = 0.12;
    this.crumbs = [];
    // les mercenaires des accrochages restants sont en place dès le départ
    for (let i = checkpoint; i < ENCOUNTERS.length; i++) this.spawnEncounter(i);
    this.encounter = checkpoint;
    this.saidDoor = false;
    this.started = true;
  }

  clearMercs() {
    for (const m of this.mercs) { this.ship.remove(m.ch); if (m.slot) this.releaseLight(m); }
    this.mercs = [];
    for (const p of this.pickups) this.ship.remove(p.obj);
    this.pickups = [];
  }

  spawnEncounter(i) {
    const E = ENCOUNTERS[i];
    E.mercs.forEach((def, k) => {
      const ch = makeCharacter({
        shirt: 0x2c3328, pants: 0x23261f, jacket: [0x30362b, 0x262a24, 0x3a3328][k % 3],
        skin: [0x9a7058, 0xc29a7e, 0x7a5642][k % 3], hair: 0x111111,
      });
      setWeapon(ch, 'rifle');
      ch.rotation.order = 'YXZ';
      const [x, z] = def.posts[0];
      const m = {
        ch, def, enc: i, hp: def.sniper ? 70 : 100, alive: true,
        pos: new THREE.Vector3(x, this.deckY + (def.y || 0), z), yaw: 0,
        state: 'idle', post: 0, timer: rand(0.5, 2), alerted: false, burst: 0, fireCd: rand(1, 2),
        visible: false, visT: 0, lastSeen: -99, unseenT: 0, sweep: rand(0, 6), deadT: 0, slot: null, losT: 0,
      };
      m.yaw = Math.atan2(0, 1); // face à la proue
      ch.position.copy(m.pos);
      this.ship.add(ch);
      this.mercs.push(m);
    });
  }

  /* lampes torches : les trois mercenaires vivants les plus proches */
  assignLights() {
    const pool = this.ctx.spotPool;
    const alive = this.mercs.filter((m) => m.alive).sort((a, b) => a.pos.distanceTo(this.player.pos) - b.pos.distanceTo(this.player.pos));
    const keep = new Set(alive.slice(0, pool.length));
    for (const m of this.mercs) if (m.slot && !keep.has(m)) this.releaseLight(m);
    for (const m of keep) {
      if (m.slot) continue;
      const slot = pool.find((s) => !s.used);
      if (!slot) break;
      slot.used = true; m.slot = slot;
      slot.light.angle = 0.3; slot.light.distance = 40; slot.light.intensity = 260;
      slot.beam.visible = true; slot.beam.scale.setScalar(0.32);
    }
  }
  releaseLight(m) {
    m.slot.used = false; m.slot.light.intensity = 0; m.slot.beam.visible = false; m.slot.beam.scale.setScalar(1);
    m.slot = null;
  }

  /* ----------------------------------------------------------- cibles et tirs */
  headLocal(ch, out) { ch.userData.head.getWorldPosition(out); return this.toLocal(out, out); }

  targets() {
    const list = [];
    for (const m of this.mercs) {
      if (!m.alive) continue;
      const chest = m.ch.userData.torso.localToWorld(new THREE.Vector3(0, 0.28, 0));
      const head = m.ch.userData.head.getWorldPosition(new THREE.Vector3());
      list.push({ chest, head, ref: m });
    }
    return list;
  }

  losWorld(camPos, pointWorld) {
    const a = this.toLocal(camPos, new THREE.Vector3()), b = this.toLocal(pointWorld, new THREE.Vector3());
    return this.clear(a, b);
  }

  /* Résout un tir (origine et direction monde). */
  resolveShot(oW, dW) {
    const o = this.toLocal(oW, new THREE.Vector3());
    const d = this.dirToLocal(dW, new THREE.Vector3());
    const wall = this.rayBoxes(o, d, 300);
    let best = wall.t, enemy = null, head = false;
    const sph = (c, r, m, isHead) => {
      const v = this._a.copy(c).sub(o);
      const tc = v.dot(d);
      if (tc < 0) return;
      const d2 = v.lengthSq() - tc * tc;
      if (d2 > r * r) return;
      const t = tc - Math.sqrt(r * r - d2);
      if (t < best) { best = t; enemy = m; head = isHead; }
    };
    for (const m of this.mercs) {
      if (!m.alive) continue;
      const u = m.ch.userData;
      sph(this.toLocal(u.head.getWorldPosition(this._b), this._b).clone(), 0.15, m, true);
      sph(this.toLocal(u.torso.localToWorld(this._b.set(0, 0.28, 0)), this._b).clone(), 0.3, m, false);
      sph(this.toLocal(u.hips.getWorldPosition(this._b), this._b).clone(), 0.26, m, false);
    }
    const pL = o.clone().addScaledVector(d, Math.min(best, 300));
    const point = this.toWorld(pL);
    let surface = enemy ? 'flesh' : wall.box ? 'metal' : 'none';
    if (!enemy && !wall.box) {
      // le tir part par-dessus bord : impact dans l'eau
      const far = this.toWorld(o.clone().addScaledVector(d, 120));
      far.y = heightAt(far.x, far.z, this.ctx.time());
      return { point: far, enemy: null, head: false, surface: 'water' };
    }
    return { point, enemy, head, surface };
  }

  damage(m, dmg, head, pointW) {
    if (!m.alive) return false;
    m.hp -= dmg;
    m.alerted = true;
    this.alertEncounter(m.enc);
    m.ch.userData.anim.recoil = 0.8;
    if (m.hp > 0) { if (m.state === 'peek' && Math.random() < 0.5) { m.state = 'cover'; m.timer = rand(0.8, 1.6); } return false; }
    m.alive = false; m.deadT = 0;
    m.fall = head ? rand(0.8, 1.2) : 1;
    if (m.slot) this.releaseLight(m);
    if (Math.random() < 0.3) this.ctx.bark('x4');
    // butin
    const rifleFirst = !this.ctx.G.inv.rifle && !this.pickups.some((p) => p.kind === 'rifle');
    const kind = rifleFirst ? 'rifle' : Math.random() < 0.6 ? 'rifleAmmo' : 'pistolAmmo';
    const obj = new THREE.Mesh(new THREE.BoxGeometry(kind === 'rifle' ? 0.8 : 0.3, 0.12, kind === 'rifle' ? 0.12 : 0.2),
      new THREE.MeshStandardMaterial({ color: kind === 'pistolAmmo' ? 0x6a5a2a : 0x1a1a1a, roughness: 0.5, metalness: 0.6, emissive: 0x332200, emissiveIntensity: 0.6 }));
    obj.position.set(m.pos.x + 0.4, this.deckY + 0.08, m.pos.z + 0.3);
    // le butin d'un tireur perché tombe au pied de son poste
    if (m.def.elevated) obj.position.set(m.pos.x * 0.6, this.deckY + 0.08, m.def.sniper ? -54.2 : 47.2);
    this.ship.add(obj);
    this.pickups.push({ obj, kind });
    if (kind === 'rifle') this.ctx.say('c6');
    return true;
  }

  alertEncounter(i) {
    for (const m of this.mercs) if (m.enc === i && m.alive && !m.alerted) { m.alerted = true; m.state = 'cover'; m.timer = rand(0.2, 1.2); }
  }

  /* ----------------------------------------------------------- caméra */
  rotateView(dyaw, dpitch) { this.cam.yaw += dyaw; this.cam.pitch = clamp(this.cam.pitch - dpitch, -0.9, 0.8); }

  updateCamera(dt, aiming, mx, my, sens) {
    const C = this.cam, P = this.player;
    C.aimK += ((aiming ? 1 : 0) - C.aimK) * (1 - Math.exp(-12 * dt));
    C.yaw -= mx * 0.0022 * sens * (1 - C.aimK * 0.4);
    C.pitch = clamp(C.pitch + my * 0.0019 * sens * (1 - C.aimK * 0.4), -0.9, 0.8);
    const cy = C.yaw, cp = C.pitch;
    const fwd = this._a.set(Math.sin(cy) * Math.cos(cp), -Math.sin(cp), Math.cos(cy) * Math.cos(cp));
    const right = this._b.set(-Math.cos(cy), 0, Math.sin(cy));
    const pivot = new THREE.Vector3(P.pos.x, P.pos.y + 1.55 - P.crouchK * 0.45, P.pos.z);
    const shoulder = THREE.MathUtils.lerp(0.55, 0.72, C.aimK);
    const dist = THREE.MathUtils.lerp(3.1, 1.55, C.aimK);
    const from = pivot.clone().addScaledVector(right, shoulder);
    // l'épaule ne doit pas traverser un conteneur
    const side = this.rayBoxes(pivot, right.clone(), shoulder + 0.3).t;
    if (side < shoulder + 0.3) from.copy(pivot).addScaledVector(right, Math.max(0, side - 0.3));
    const back = fwd.clone().negate();
    back.y += 0.08; back.normalize();
    const hit = this.rayBoxes(from, back, dist + 0.3).t;
    const camL = from.clone().addScaledVector(back, Math.min(dist, hit - 0.3));
    const lookL = camL.clone().addScaledVector(fwd, 20);
    const cam = this.ctx.camera;
    this.toWorld(camL, cam.position);
    cam.up.set(0, 1, 0);
    cam.lookAt(this.toWorld(lookL, this._c));
    cam.fov = THREE.MathUtils.lerp(60, 45, C.aimK);
    cam.updateProjectionMatrix();
  }

  /* ----------------------------------------------------------- frame */
  update(dt, inp) {
    const { G, audio, hero, brother } = this.ctx;
    const t = this.ctx.time();
    const P = this.player;

    // --- joueur
    const yaw = this.cam.yaw;
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    const rx = -Math.cos(yaw), rz = Math.sin(yaw);
    let mf = inp.forward, mr = inp.right;
    const ml = Math.hypot(mf, mr);
    if (ml > 1) { mf /= ml; mr /= ml; }
    if (inp.run && mf > 0.2) P.crouch = false;
    const speed = inp.aiming ? 2.3 : P.crouch ? 1.9 : inp.run ? 5.6 : 3.4;
    const tvx = (fx * mf + rx * mr) * speed, tvz = (fz * mf + rz * mr) * speed;
    const k = 1 - Math.exp(-12 * dt);
    P.vel.x += (tvx - P.vel.x) * k; P.vel.z += (tvz - P.vel.z) * k;
    this.moveCircle(P.pos, P.vel.x * dt, P.vel.z * dt);
    P.moving = Math.hypot(P.vel.x, P.vel.z);
    P.crouchK += ((P.crouch ? 1 : 0) - P.crouchK) * (1 - Math.exp(-9 * dt));
    const faceTarget = inp.aiming || inp.shotRecently ? yaw : P.moving > 0.4 ? Math.atan2(P.vel.x, P.vel.z) : P.facing;
    P.facing += wrap(faceTarget - P.facing) * (1 - Math.exp(-(inp.aiming ? 18 : 9) * dt));
    hero.position.copy(P.pos);
    hero.rotation.set(0, P.facing, 0, 'YXZ');
    animateCharacter(hero, dt, { aim: inp.aiming || inp.shotRecently, pitch: -this.cam.pitch + 0.05, move: P.moving, crouch: P.crouchK, t });
    // pas sur la tôle
    const ph = hero.userData.anim.phase || 0;
    if (P.moving > 0.5 && Math.floor(ph / Math.PI) !== this.lastStep) { this.lastStep = Math.floor(ph / Math.PI); audio?.footstep(P.moving > 4 ? 1.4 : 0.9); }

    // fil d'Ariane pour Élias
    const last = this.crumbs[this.crumbs.length - 1];
    if (!last || last.distanceTo(P.pos) > 0.6) { this.crumbs.push(P.pos.clone()); if (this.crumbs.length > 80) this.crumbs.shift(); }

    // --- accrochages
    const E = ENCOUNTERS[this.encounter];
    if (E && P.pos.z < E.trigger) {
      this.ctx.checkpoint(this.encounter);
      this.encounter++;
      this.alertEncounter(this.encounter - 1);
      this.ctx.say(E.line);
      this.ctx.bark('x1');
    }
    this.assignLights();
    const playerChest = new THREE.Vector3(P.pos.x, P.pos.y + 1.3 - P.crouchK * 0.42, P.pos.z);
    let anyAlerted = false, nearestVisible = null, nvd = 1e9;
    for (const m of this.mercs) {
      this.updateMerc(m, dt, t, playerChest, inp);
      if (m.alive && m.alerted) anyAlerted = true;
      if (m.alive && m.alerted && m.visible) {
        const d = m.pos.distanceTo(P.pos);
        if (d < nvd) { nvd = d; nearestVisible = m; }
      }
    }

    // --- Élias
    this.updateElias(dt, t, anyAlerted, nearestVisible);

    // --- ramassage
    for (const p of [...this.pickups]) {
      p.obj.rotation.y += dt * 1.5;
      if (Math.hypot(p.obj.position.x - P.pos.x, p.obj.position.z - P.pos.z) < 1.4) {
        this.ctx.pickup(p.kind);
        this.ship.remove(p.obj);
        this.pickups.splice(this.pickups.indexOf(p), 1);
      }
    }
    // --- paquets de mer sur le pont
    this.waveT -= dt;
    if (this.waveT <= 0) { this.waveT = rand(9, 16); this.greenWater(); }

    // --- porte du château
    const remaining = this.mercs.filter((m) => m.alive && m.enc === 2).length;
    const dDoor = Math.hypot(P.pos.x - DOOR.x, P.pos.z - DOOR.z);
    if (this.encounter >= 3 && remaining === 0 && !this.saidDoor) { this.saidDoor = true; this.ctx.say('c8'); this.ctx.objective('Entre dans le château'); }
    if (this.encounter >= 3 && remaining === 0 && dDoor < 1.8) this.ctx.finish();
    return { anyAlerted, dDoor, remaining };
  }

  updateMerc(m, dt, t, playerChest, inp) {
    const u = m.ch.userData;
    if (!m.alive) {
      m.deadT += dt;
      const f = clamp(m.deadT / 0.55, 0, 1);
      m.ch.rotation.set(-Math.PI / 2 * f * f * m.fall, m.yaw, 0, 'YXZ');
      if (m.def.elevated && m.deadT < 1.2) m.ch.position.y = m.pos.y + Math.sin(f * Math.PI) * 0.2;
      return;
    }
    const P = this.player;
    const to = this._a.copy(P.pos).sub(m.pos);
    const dist = Math.hypot(to.x, to.z);
    const head = new THREE.Vector3(m.pos.x, m.pos.y + (m.state === 'cover' && !m.def.elevated ? 1.15 : 1.6), m.pos.z);
    m.losT -= dt;
    if (m.losT <= 0) { m.losT = 0.18; m.visible = this.clear(head, playerChest) && dist < 70; }

    if (!m.alerted) {
      // ronde : la lampe balaie le pont
      m.sweep += dt * 0.6;
      m.yaw = Math.sin(m.sweep) * 0.7 + (m.def.sniper ? 0 : 0);
      if ((m.visible && dist < 30) || dist < 10) { m.alerted = true; this.alertEncounter(m.enc); this.ctx.bark('x1'); }
    } else {
      const want = Math.atan2(to.x, to.z);
      if (m.state !== 'move') m.yaw += wrap(want - m.yaw) * (1 - Math.exp(-6 * dt));
      m.timer -= dt;
      if (m.visible) { m.lastSeen = t; m.unseenT = 0; } else m.unseenT += dt;
      if (m.state === 'idle') { m.state = 'cover'; m.timer = rand(0.3, 1); }
      if (m.state === 'cover') {
        if (m.timer <= 0) { m.state = 'peek'; m.timer = rand(1.8, 3.2); }
      } else if (m.state === 'peek') {
        // sans ligne de vue, il avance vers la position suivante (sans jamais revenir en arrière)
        if (m.unseenT > 1.6 && m.post < m.def.posts.length - 1 && Math.random() < dt * 1.5) {
          m.post++; m.state = 'move';
          if (Math.random() < 0.3) this.ctx.bark('x2');
        } else if (m.timer <= 0) { m.state = 'cover'; m.timer = rand(1.0, 2.2); }
        this.mercFire(m, dt, t, dist, playerChest, inp);
      } else if (m.state === 'move') {
        const [px, pz] = m.def.posts[m.post];
        const dx = px - m.pos.x, dz = pz - m.pos.z, dl = Math.hypot(dx, dz);
        if (dl < 0.3) { m.state = 'cover'; m.timer = rand(0.4, 1); } else {
          const sp = 3.6;
          this.moveCircle(m.pos, (dx / dl) * Math.min(dl, sp * dt), (dz / dl) * Math.min(dl, sp * dt), 0.33);
          m.yaw += wrap(Math.atan2(dx, dz) - m.yaw) * (1 - Math.exp(-8 * dt));
        }
      }
    }
    m.ch.position.copy(m.pos);
    m.ch.rotation.set(0, m.yaw, 0, 'YXZ');
    const crouch = m.alerted && m.state === 'cover' && !m.def.elevated ? 1 : 0;
    animateCharacter(m.ch, dt, {
      aim: m.alerted && m.state !== 'move', pitch: Math.atan2(playerChest.y - head.y, Math.max(dist, 1)),
      move: m.state === 'move' ? 3.6 : 0, crouch, t,
    });
    // lampe torche
    if (m.slot) {
      const lp = this._b.set(m.pos.x + Math.sin(m.yaw) * 0.5, m.pos.y + 1.45 - crouch * 0.45, m.pos.z + Math.cos(m.yaw) * 0.5);
      const aimP = m.alerted ? playerChest : this._c.set(lp.x + Math.sin(m.yaw) * 10, this.deckY + 0.2, lp.z + Math.cos(m.yaw) * 10);
      const lw = this.toWorld(lp), tw = this.toWorld(aimP);
      m.slot.light.position.copy(lw);
      m.slot.light.target.position.copy(tw);
      m.slot.beam.position.copy(lw);
      m.slot.beam.lookAt(tw);
      const cam = this.ctx.camera;
      const dir = tw.clone().sub(lw).normalize();
      const align = Math.abs(cam.getWorldDirection(new THREE.Vector3()).dot(dir));
      const near = clamp((cam.position.distanceTo(lw) - 2) / 6, 0, 1);
      m.slot.beam.material.uniforms.uInt.value = near * (1 - THREE.MathUtils.smoothstep(align, 0.5, 0.9)) * 0.7;
    }
  }

  mercFire(m, dt, t, dist, playerChest, inp) {
    const { G, audio, tracers, fx } = this.ctx;
    m.fireCd -= dt;
    if (m.fireCd > 0 || G.hp <= 0) return;
    const blind = !m.visible;
    if (blind && (t - m.lastSeen > 4 || Math.random() > 0.35)) { m.fireCd = rand(0.6, 1.2); return; }
    if (m.burst <= 0) m.burst = m.def.sniper ? 1 : 3 + ((Math.random() * 3) | 0);
    m.burst--;
    m.fireCd = m.burst > 0 ? 0.13 : m.def.sniper ? rand(2.4, 3.6) : rand(1.1, 2.3);
    m.ch.userData.anim.recoil = 0.7;
    const muzzleW = m.ch.userData.muzzle.getWorldPosition(new THREE.Vector3());
    const muzzle = this.toLocal(muzzleW);
    const P = this.player;
    let chance = m.def.sniper ? 0.55 - dist / 120 : 0.46 - dist / 85;
    if (P.crouchK > 0.5) chance *= 0.65;
    if (P.moving > 4) chance *= 0.6; else if (P.moving > 1) chance *= 0.82;
    chance = clamp(chance, 0.06, 0.5);
    const hit = !blind && Math.random() < chance;
    let target;
    if (hit) {
      target = playerChest.clone().add(new THREE.Vector3(rand(-0.15, 0.15), rand(-0.2, 0.2), rand(-0.15, 0.15)));
      this.ctx.damagePlayer(m.def.sniper ? rand(28, 34) : rand(7, 10), this.toWorld(m.pos));
    } else {
      target = playerChest.clone().add(new THREE.Vector3(rand(-1.6, 1.6), rand(-1.1, 1.2), rand(-1.6, 1.6)));
      const d = target.clone().sub(muzzle).normalize();
      const r = this.rayBoxes(muzzle, d, 200);
      const end = muzzle.clone().addScaledVector(d, Math.min(r.t, 200));
      target = end;
      if (r.box) fx.sparks(this.toWorld(end));
      if (end.distanceTo(P.pos) < 3) audio?.whiz(rand(-0.6, 0.6));
    }
    tracers.fire(muzzleW, this.toWorld(target), [8, 2.6, 1.2], 380);
    fx.flash(muzzleW);
    const pan = clamp(new THREE.Vector3().copy(muzzleW).project(this.ctx.camera).x, -1, 1);
    if (m.def.sniper) audio?.gunshot(clamp(1.1 - dist / 80, 0.3, 1), pan, true);
    else audio?.rifle(clamp(1 - dist / 70, 0.25, 0.8), pan);
  }

  updateElias(dt, t, combat, target) {
    const { brother, audio, tracers } = this.ctx;
    const A = this.elias, P = this.player;
    // suit le joueur à ~3,5 m le long de son chemin
    let goal = null, acc = 0;
    for (let i = this.crumbs.length - 1; i > 0; i--) {
      acc += this.crumbs[i].distanceTo(this.crumbs[i - 1]);
      if (acc > 3.2) { goal = this.crumbs[i - 1]; break; }
    }
    let speed = 0;
    if (goal) {
      const dx = goal.x - A.pos.x, dz = goal.z - A.pos.z, dl = Math.hypot(dx, dz);
      if (dl > 0.6) {
        speed = clamp(dl * 1.6, 0, 5.8);
        this.moveCircle(A.pos, (dx / dl) * speed * dt, (dz / dl) * speed * dt, 0.33);
        if (!target) A.facing += wrap(Math.atan2(dx, dz) - A.facing) * (1 - Math.exp(-8 * dt));
      }
      // jamais trop loin : il rattrape son retard
      if (A.pos.distanceTo(P.pos) > 14) A.pos.copy(goal);
    }
    A.moving += (speed - A.moving) * (1 - Math.exp(-8 * dt));
    if (target) A.facing += wrap(Math.atan2(target.pos.x - A.pos.x, target.pos.z - A.pos.z) - A.facing) * (1 - Math.exp(-8 * dt));
    brother.position.copy(A.pos);
    brother.rotation.set(0, A.facing, 0, 'YXZ');
    animateCharacter(brother, dt, { aim: !!target, pitch: 0, move: A.moving, crouch: combat && A.moving < 0.5 ? 1 : 0, t });

    A.cd -= dt;
    if (target && A.cd <= 0 && combat) {
      const head = new THREE.Vector3(A.pos.x, A.pos.y + 1.4, A.pos.z);
      const tChest = new THREE.Vector3(target.pos.x, target.pos.y + 1.2, target.pos.z);
      if (!this.clear(head, tChest)) { A.cd = 0.5; return; }
      A.cd = rand(1.3, 2.6);
      A.shots++;
      brother.userData.anim.recoil = 1;
      const mw = brother.userData.muzzle.getWorldPosition(new THREE.Vector3());
      const hit = Math.random() < 0.33;
      const end = hit ? tChest : tChest.clone().add(new THREE.Vector3(rand(-1.5, 1.5), rand(-0.6, 1), rand(-1.5, 1.5)));
      tracers.fire(mw, this.toWorld(end), [7, 5, 2.4], 500);
      audio?.gunshot(0.55, 0);
      if (hit) this.damage(target, 22, false, this.toWorld(end));
      if (A.shots % 7 === 0) { A.cd = 2.6; this.ctx.say('c3'); }
    }
  }

  greenWater() {
    const { fx, audio, G } = this.ctx;
    const P = this.player;
    const side = Math.random() < 0.5 ? -1 : 1;
    const z = clamp(P.pos.z + rand(-6, 14), -50, 70);
    const x = side * (cargoHalfWidth(z) - 0.3);
    const pW = this.toWorld(new THREE.Vector3(x, this.deckY + 0.5, z));
    const inward = this.toWorld(new THREE.Vector3(x - side * 4, this.deckY + 3, z)).sub(pW).normalize();
    fx.wave(pW, inward);
    const d = Math.hypot(x - P.pos.x, z - P.pos.z);
    audio?.waveCrash(clamp(1.2 - d / 40, 0.2, 1.1));
    if (d < 12) { G.wet = Math.min(1.5, (G.wet ?? 0.4) + 0.8); G.shake = Math.max(G.shake, 0.3); }
  }

  /* Position monde de la porte (pour la boussole et la cinématique). */
  doorWorld(out = new THREE.Vector3()) { return this.toWorld(this._c.set(DOOR.x, this.deckY + 1.2, DOOR.z), out); }
  distanceToDoor() { return Math.hypot(this.player.pos.x - DOOR.x, this.player.pos.z - DOOR.z); }
  doorBearing() { return Math.atan2(DOOR.x - this.player.pos.x, DOOR.z - this.player.pos.z) - this.cam.yaw; }
}
