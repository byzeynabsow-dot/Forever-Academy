// Océan de tempête : somme de vagues de Gerstner évaluée à l'identique
// sur le GPU (rendu) et sur le CPU (flottaison des bateaux).
import * as THREE from 'three';

const G = 9.81;
const NW = 8;
const WIND = 0.35; // direction principale de la houle (radians)

// [longueur d'onde (m), amplitude (m), écart à la direction du vent (deg)]
const DEFS = [
  [94, 2.2, 0],
  [63, 1.45, 27],
  [41, 0.95, -24],
  [27, 0.6, 46],
  [17.5, 0.36, -52],
  [11, 0.2, 14],
  [7.2, 0.11, 76],
  [4.7, 0.06, -82],
];

export const waves = DEFS.map(([len, amp, deg], i) => {
  const k = (2 * Math.PI) / len;
  const a = WIND + (deg * Math.PI) / 180;
  return {
    dx: Math.cos(a), dz: Math.sin(a), k, w: Math.sqrt(G * k), amp,
    q: 0.78 / (k * amp * NW),
    phase: i * 1.73 + 0.4,
  };
});

// État partagé : intensité de la tempête et vague scélérate finale.
export const sea = {
  amp: 1,
  rogue: { x: 0, z: 0, h: 0, w: 24, dx: 0, dz: 1 },
};

const _d = { x: 0, y: 0, z: 0 };
function displacement(x, z, t) {
  let dx = 0, dy = 0, dz = 0;
  for (let i = 0; i < NW; i++) {
    const W = waves[i];
    const a = W.amp * sea.amp;
    const th = W.k * (W.dx * x + W.dz * z) - W.w * t + W.phase;
    const c = Math.cos(th);
    dx += W.q * a * W.dx * c;
    dz += W.q * a * W.dz * c;
    dy += a * Math.sin(th);
  }
  const r = sea.rogue;
  if (r.h > 0) {
    const s = (x - r.x) * r.dx + (z - r.z) * r.dz;
    const e = Math.exp(-(s * s) / (r.w * r.w));
    dy += r.h * e;
    // la crête se penche vers l'avant
    const lean = r.h * 0.35 * e * Math.max(0, -s / r.w);
    dx += r.dx * lean; dz += r.dz * lean;
  }
  _d.x = dx; _d.y = dy; _d.z = dz;
  return _d;
}

// Hauteur de la surface au point (x, z) : on inverse le déplacement
// horizontal de Gerstner par quelques itérations de point fixe.
export function heightAt(x, z, t) {
  let px = x, pz = z;
  for (let i = 0; i < 3; i++) {
    const d = displacement(px, pz, t);
    px = x - d.x; pz = z - d.z;
  }
  return displacement(px, pz, t).y;
}

const WAVE_GLSL = /* glsl */`
  #define NW ${NW}
  uniform vec4 uWaveA[NW];   // dir.x, dir.z, k, omega
  uniform vec4 uWaveB[NW];   // amp, q, phase, -
  uniform float uAmp;
  uniform float uTime;
  uniform vec4 uRogue;       // centre x, centre z, hauteur, largeur
  uniform vec2 uRogueDir;

  vec3 gerstner(vec2 p, float fade, out vec3 nrm, out float crest) {
    vec3 d = vec3(0.0);
    float nx = 0.0, nz = 0.0, ny = 0.0;
    for (int i = 0; i < NW; i++) {
      vec4 A = uWaveA[i];
      vec4 B = uWaveB[i];
      float a = B.x * uAmp * fade;
      float th = A.z * dot(A.xy, p) - A.w * uTime + B.z;
      float c = cos(th), s = sin(th);
      d.x += B.y * a * A.x * c;
      d.z += B.y * a * A.y * c;
      d.y += a * s;
      float wa = A.z * a;
      nx += A.x * wa * c;
      nz += A.y * wa * c;
      ny += B.y * wa * s;
    }
    if (uRogue.z > 0.0) {
      float s = dot(p - uRogue.xy, uRogueDir);
      float e = exp(-(s * s) / (uRogue.w * uRogue.w));
      float h = uRogue.z * e;
      d.y += h;
      float lean = uRogue.z * 0.35 * e * max(0.0, -s / uRogue.w);
      d.xz += uRogueDir * lean;
      float dh = h * (-2.0 * s / (uRogue.w * uRogue.w));
      nx += uRogueDir.x * dh;
      nz += uRogueDir.y * dh;
      ny += smoothstep(0.4, 1.0, h / max(uRogue.z, 0.001)) * 0.6 * step(s, 0.0);
    }
    nrm = normalize(vec3(-nx, 1.0 - ny, -nz));
    crest = ny;
    return d;
  }
`;

export const SPOTS = 4;
export const POINTS = 4;

export function createOcean(env) {
  // grille radiale dense au centre, lâche à l'horizon
  const N = 360, R = 2600;
  const pos = new Float32Array((N + 1) * (N + 1) * 3);
  const map = (u) => Math.sign(u) * Math.pow(Math.abs(u), 2.2) * R;
  let o = 0;
  for (let j = 0; j <= N; j++) {
    for (let i = 0; i <= N; i++) {
      pos[o++] = map(i / N * 2 - 1);
      pos[o++] = 0;
      pos[o++] = map(j / N * 2 - 1);
    }
  }
  const idx = new Uint32Array(N * N * 6);
  o = 0;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      idx[o++] = a; idx[o++] = c; idx[o++] = b;
      idx[o++] = b; idx[o++] = c; idx[o++] = d;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));

  const uniforms = {
    uWaveA: { value: waves.map((w) => new THREE.Vector4(w.dx, w.dz, w.k, w.w)) },
    uWaveB: { value: waves.map((w) => new THREE.Vector4(w.amp, w.q, w.phase, 0)) },
    uAmp: { value: 1 },
    uTime: env.uTime,
    uRogue: { value: new THREE.Vector4(0, 0, 0, 24) },
    uRogueDir: { value: new THREE.Vector2(0, 1) },
    uFlash: env.uFlash,
    uFlashDir: env.uFlashDir,
    uZenith: env.uZenith,
    uHorizon: env.uHorizon,
    uFogDensity: env.uFogDensity,
    uSpotPos: { value: Array.from({ length: SPOTS }, () => new THREE.Vector3()) },
    uSpotDir: { value: Array.from({ length: SPOTS }, () => new THREE.Vector3(0, -1, 0)) },
    uSpotColor: { value: Array.from({ length: SPOTS }, () => new THREE.Vector3()) },
    uSpotCos: { value: Array.from({ length: SPOTS }, () => new THREE.Vector2(0.9, 0.95)) },
    uPointPos: { value: Array.from({ length: POINTS }, () => new THREE.Vector3()) },
    uPointColor: { value: Array.from({ length: POINTS }, () => new THREE.Vector3()) },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
      ${WAVE_GLSL}
      varying vec3 vWorld;
      varying vec2 vP;
      varying float vFade;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        float fade = 1.0 - smoothstep(500.0, 2200.0, length(wp.xz - cameraPosition.xz));
        vec3 n; float cr;
        vec3 d = gerstner(wp.xz, fade, n, cr);
        wp.xyz += d;
        vWorld = wp.xyz;
        vP = wp.xz - d.xz;
        vFade = fade;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      ${WAVE_GLSL}
      #define SPOTS ${SPOTS}
      #define POINTS ${POINTS}
      uniform float uFlash;
      uniform vec3 uFlashDir;
      uniform vec3 uZenith;
      uniform vec3 uHorizon;
      uniform float uFogDensity;
      uniform vec3 uSpotPos[SPOTS];
      uniform vec3 uSpotDir[SPOTS];
      uniform vec3 uSpotColor[SPOTS];
      uniform vec2 uSpotCos[SPOTS];
      uniform vec3 uPointPos[POINTS];
      uniform vec3 uPointColor[POINTS];
      varying vec3 vWorld;
      varying vec2 vP;
      varying float vFade;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
        return v;
      }
      vec3 sky(vec3 r) {
        float y = max(r.y, 0.0);
        vec3 c = mix(uHorizon, uZenith, pow(y, 0.45));
        float f = max(dot(normalize(r), uFlashDir), 0.0);
        c += uFlash * (vec3(0.55, 0.6, 0.75) * pow(f, 6.0) * 3.0 + vec3(0.08, 0.09, 0.12));
        return c;
      }

      void main() {
        vec3 N; float crest;
        gerstner(vP, vFade, N, crest);

        float dist = length(cameraPosition - vWorld);
        float detail = exp(-dist / 140.0);

        // clapot et vaguelettes de vent, plus fins que la grille
        vec2 q = vP + 0.8 * vec2(sin(vP.y * 0.13 + uTime * 0.7), cos(vP.x * 0.11 - uTime * 0.6));
        vec2 grad = vec2(0.0);
        for (int i = 0; i < 7; i++) {
          float fi = float(i);
          float ang = 0.35 + fi * 2.39996;
          vec2 dd = vec2(cos(ang), sin(ang));
          float k = 2.2 + fi * 1.9;
          float th = k * dot(dd, q) - sqrt(9.81 * k) * uTime + fi * 1.7;
          grad += dd * cos(th) * k * (0.022 / (1.0 + fi * 0.35));
        }
        // gouttes de pluie : piqûres très fines
        float rn = noise(vP * 6.0 + uTime * 9.0) - 0.5;
        grad += vec2(rn, -rn) * 0.12;
        N = normalize(N + vec3(-grad.x, 0.0, -grad.y) * detail);

        vec3 V = normalize(cameraPosition - vWorld);
        if (dot(N, V) < 0.0) N = normalize(N + V * (-dot(N, V) + 0.02));
        float ndv = max(dot(N, V), 0.0);
        float F = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);

        vec3 R = reflect(-V, N);
        R.y = abs(R.y);
        vec3 refl = sky(R);

        // couleur des profondeurs + diffusion sous la surface sur les crêtes
        vec3 deep = vec3(0.0025, 0.012, 0.016);
        float h = clamp(vWorld.y * 0.22 + 0.35, 0.0, 1.0);
        float lightLvl = 0.35 + uFlash * 4.0;
        vec3 sss = vec3(0.01, 0.055, 0.05) * h * h * lightLvl * pow(1.0 - ndv, 1.5);
        vec3 col = mix(deep + sss, refl, F);

        // écume : sommets des crêtes, traînées dans le sens du vent
        vec2 wind = vec2(cos(0.35), sin(0.35));
        vec2 fp = vec2(dot(vP, wind) * 0.12, dot(vP, vec2(-wind.y, wind.x)) * 0.35);
        float n1 = fbm(fp * 1.3 + vec2(uTime * 0.05, 0.0));
        float n2 = fbm(vP * 0.6 - uTime * 0.12);
        float mask = smoothstep(0.32, 0.85, crest) + smoothstep(1.8, 4.5, vWorld.y) * 0.6;
        float foam = smoothstep(0.55, 0.85, n1 * 0.6 + n2 * 0.5 + mask * 0.55) * clamp(mask * 1.4 + 0.15, 0.0, 1.0);
        foam += smoothstep(0.72, 0.9, n2) * 0.18;
        foam = clamp(foam * vFade, 0.0, 1.0);

        vec3 ambient = mix(uHorizon, uZenith, 0.5) * 2.2 + vec3(0.25, 0.28, 0.35) * uFlash;
        vec3 foamCol = vec3(0.75, 0.8, 0.82) * ambient * 2.2;

        // projecteurs (bateaux) et lumières ponctuelles (cargo, explosions)
        vec3 lit = vec3(0.0);
        for (int i = 0; i < SPOTS; i++) {
          vec3 L = uSpotPos[i] - vWorld;
          float d2 = dot(L, L);
          vec3 l = L * inversesqrt(d2);
          float cone = smoothstep(uSpotCos[i].x, uSpotCos[i].y, dot(-l, uSpotDir[i]));
          vec3 E = uSpotColor[i] * cone / max(d2, 1.0);
          vec3 H = normalize(l + V);
          float spec = pow(max(dot(N, H), 0.0), 160.0) * 18.0 * F * 6.0;
          lit += E * (max(dot(N, l), 0.0) * (0.02 + foam * 0.7) + spec);
        }
        for (int i = 0; i < POINTS; i++) {
          vec3 L = uPointPos[i] - vWorld;
          float d2 = dot(L, L);
          vec3 l = L * inversesqrt(d2);
          vec3 E = uPointColor[i] / max(d2, 1.0);
          vec3 H = normalize(l + V);
          float spec = pow(max(dot(N, H), 0.0), 90.0) * 10.0 * (F * 4.0 + 0.05);
          lit += E * (max(dot(N, l), 0.0) * (0.03 + foam * 0.7) + spec);
        }
        // reflet de l'éclair
        vec3 Hf = normalize(uFlashDir + V);
        lit += vec3(0.7, 0.75, 0.9) * uFlash * pow(max(dot(N, Hf), 0.0), 60.0) * 3.0;

        col = mix(col, foamCol, foam) + lit;

        float fog = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
        vec3 fogCol = uHorizon * (1.0 + uFlash * 3.0);
        col = mix(col, fogCol, fog);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  return {
    mesh, uniforms,
    update(camera) {
      mesh.position.set(Math.round(camera.position.x / 4) * 4, 0, Math.round(camera.position.z / 4) * 4);
      uniforms.uAmp.value = sea.amp;
      const r = sea.rogue;
      uniforms.uRogue.value.set(r.x, r.z, r.h, r.w);
      uniforms.uRogueDir.value.set(r.dx, r.dz);
    },
  };
}
