// Assistance à la visée : trois profils réglables dans les paramètres.
//  libre    : aucune aide, la balle part exactement là où vise le réticule ;
//  assiste  : le réticule se cale sur une cible proche quand on épaule, ralentit
//             en passant dessus, et la balle « colle » si on vise à 2° près ;
//  fort     : idem en plus large, et la visée suit doucement la cible.
// Une cible est { chest: Vector3, head?: Vector3, ref } en coordonnées monde.
import * as THREE from 'three';
import { settings } from './settings.js';

const DEG = Math.PI / 180;
const PROFILES = {
  libre: { snap: 0, friction: 1, magnet: 0, head: 0, track: 0 },
  assiste: { snap: 10 * DEG, friction: 0.5, magnet: 2.2 * DEG, head: 0.9 * DEG, track: 0 },
  fort: { snap: 18 * DEG, friction: 0.35, magnet: 4.5 * DEG, head: 1.8 * DEG, track: 12 * DEG },
};
export const assistProfile = () => PROFILES[settings.assist] || PROFILES.assiste;

const _v = new THREE.Vector3();
export function angleTo(origin, fwd, p) {
  _v.copy(p).sub(origin);
  const l = _v.length();
  if (l < 0.01) return Math.PI;
  return Math.acos(THREE.MathUtils.clamp(_v.dot(fwd) / l, -1, 1));
}

/* Cible la plus proche du réticule sous maxAngle, visible selon los(point). */
export function pickTarget(origin, fwd, targets, maxAngle, los) {
  let best = null, bestA = maxAngle;
  for (const t of targets) {
    for (const [point, isHead] of [[t.chest, false], [t.head, true]]) {
      if (!point) continue;
      const a = angleTo(origin, fwd, point);
      if (a < bestA && (!los || los(point, t))) { bestA = a; best = { target: t, point, isHead, angle: a }; }
    }
  }
  return best;
}

/* Écart de lacet et de tangage (radians) entre la direction actuelle et un point. */
export function viewDelta(origin, fwd, p) {
  _v.copy(p).sub(origin).normalize();
  const dyaw = Math.atan2(Math.sin(Math.atan2(_v.x, _v.z) - Math.atan2(fwd.x, fwd.z)), Math.cos(Math.atan2(_v.x, _v.z) - Math.atan2(fwd.x, fwd.z)));
  const dpitch = Math.asin(THREE.MathUtils.clamp(_v.y, -1, 1)) - Math.asin(THREE.MathUtils.clamp(fwd.y, -1, 1));
  return { dyaw, dpitch };
}

/* État de l'assistance d'un frame à l'autre (calage à l'épaulement). */
export class AimAssist {
  constructor() { this.wasAiming = false; this.snap = null; this.snapT = 0; }

  /* Appelé à chaque frame. rotate(dyaw, dpitch) tourne la vue ;
     renvoie le facteur de sensibilité à appliquer à la souris. */
  update(dt, aiming, origin, fwd, targets, los, rotate) {
    const P = assistProfile();
    let sens = 1;
    if (aiming && !this.wasAiming && P.snap > 0) {
      const b = pickTarget(origin, fwd, targets, P.snap, los);
      if (b) { this.snap = b.target; this.snapT = 0.22; }
    }
    this.wasAiming = aiming;
    if (!aiming) { this.snapT = 0; return 1; }
    if (this.snapT > 0 && this.snap) {
      this.snapT -= dt;
      const { dyaw, dpitch } = viewDelta(origin, fwd, this.snap.chest);
      const k = 1 - Math.exp(-16 * dt);
      rotate(dyaw * k, dpitch * k);
    } else if (P.track > 0) {
      const b = pickTarget(origin, fwd, targets, P.track, los);
      if (b) {
        const { dyaw, dpitch } = viewDelta(origin, fwd, b.target.chest);
        const k = 1 - Math.exp(-2.5 * dt);
        rotate(dyaw * k, dpitch * k);
      }
    }
    if (P.friction < 1 && pickTarget(origin, fwd, targets, 4 * DEG, los)) sens = P.friction;
    return sens;
  }

  /* Direction du tir après « aimantation » vers la cible la plus proche. */
  bend(origin, fwd, dir, targets, los) {
    const P = assistProfile();
    if (P.magnet <= 0) return null;
    const b = pickTarget(origin, fwd, targets, P.magnet, los);
    if (!b) return null;
    const head = b.target.head && angleTo(origin, fwd, b.target.head) < P.head;
    const point = head ? b.target.head : b.target.chest;
    dir.copy(point).sub(origin).normalize();
    return { target: b.target, head };
  }
}
