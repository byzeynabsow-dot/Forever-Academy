// Ciel d'orage, pluie, éclairs, particules (embruns, feu, fumée),
// traçantes, sillages et faisceaux de projecteurs.
import * as THREE from 'three';
import { heightAt } from './ocean.js';

/* ------------------------------------------------------------------ ciel */
export function createSky(env) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: env.uTime, uFlash: env.uFlash, uFlashDir: env.uFlashDir,
      uZenith: env.uZenith, uHorizon: env.uHorizon,
    },
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main() {
        vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
        vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + vDir * 3000.0, 1.0);
        gl_Position = p.xyww;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime, uFlash;
      uniform vec3 uFlashDir, uZenith, uHorizon;
      varying vec3 vDir;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.07 + 31.7; a *= 0.5; }
        return v;
      }
      void main() {
        vec3 d = normalize(vDir);
        float y = max(d.y, 0.0);
        vec3 col = mix(uHorizon, uZenith, pow(y, 0.45));
        // plafond nuageux projeté sur un plan
        vec2 uv = d.xz / (d.y + 0.12) * 1.6;
        vec2 drift = vec2(uTime * 0.018, uTime * 0.008);
        float warp = fbm(uv * 0.6 + drift);
        float c = fbm(uv + warp * 1.4 + drift * 2.0);
        float dense = smoothstep(0.35, 0.8, c);
        col = mix(col * 1.5, col * 0.45, dense);
        // les éclairs illuminent les nuages par l'intérieur
        float f = max(dot(d, uFlashDir), 0.0);
        vec3 flashCol = vec3(0.55, 0.6, 0.8);
        col += uFlash * flashCol * (pow(f, 5.0) * 2.5 * (0.4 + c) + 0.12 * (1.0 - dense * 0.5));
        // sous l'horizon : brume marine
        col = mix(col, uHorizon * (1.0 + uFlash * 3.0), smoothstep(0.08, -0.02, d.y));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -2;
  return mesh;
}

/* ----------------------------------------------------------------- pluie */
export function createRain(env, count = 9000) {
  const B = new THREE.Vector3(70, 34, 70);
  const pos = new Float32Array(count * 2 * 3);
  const end = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * B.x, y = Math.random() * B.y, z = Math.random() * B.z;
    for (let k = 0; k < 2; k++) {
      pos.set([x, y, z], (i * 2 + k) * 3);
      end[i * 2 + k] = k;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
  const uniforms = {
    uTime: env.uTime, uFlash: env.uFlash,
    uCam: { value: new THREE.Vector3() },
    uBox: { value: B },
    uWind: { value: new THREE.Vector3(7, -30, 4) },
    uDensity: { value: 1 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute float aEnd;
      uniform float uTime;
      uniform vec3 uCam, uBox, uWind;
      varying float vA;
      void main() {
        vec3 p = position + uWind * uTime;
        p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5 + uCam;
        float len = 0.9;
        p -= normalize(uWind) * len * aEnd;
        vec4 mv = viewMatrix * vec4(p, 1.0);
        float d = length(mv.xyz);
        vA = smoothstep(34.0, 6.0, d) * smoothstep(0.4, 2.0, d) * (1.0 - aEnd * 0.7);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uFlash, uDensity;
      varying float vA;
      void main() {
        vec3 c = vec3(0.32, 0.37, 0.42) * (0.18 + uFlash * 2.5);
        gl_FragColor = vec4(c * vA * uDensity, 1.0);
      }
    `,
  });
  const lines = new THREE.LineSegments(geo, mat);
  lines.frustumCulled = false;
  return {
    mesh: lines,
    update(camera, windX, windZ) {
      uniforms.uCam.value.copy(camera.position);
      uniforms.uWind.value.set(windX, -30, windZ);
    },
  };
}

/* ---------------------------------------------------------------- éclairs */
export class Lightning {
  constructor(scene, env, audio) {
    this.scene = scene; this.env = env; this.audio = audio;
    this.next = 3;
    this.t = 99;
    this.pulses = [];
    this.bolt = null;
    this.mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(9, 9, 13), fog: false, transparent: true });
    this.light = new THREE.DirectionalLight(0xb8c6ff, 0);
    scene.add(this.light, this.light.target);
  }

  strike(camera, near = false) {
    const az = Math.random() * Math.PI * 2;
    const dist = near ? 350 + Math.random() * 250 : 700 + Math.random() * 900;
    const base = new THREE.Vector3(camera.position.x + Math.cos(az) * dist, 0, camera.position.z + Math.sin(az) * dist);
    const top = base.clone().add(new THREE.Vector3((Math.random() - 0.5) * 200, 420 + Math.random() * 120, (Math.random() - 0.5) * 200));
    const dir = top.clone().sub(camera.position).normalize();
    this.env.uFlashDir.value.copy(dir);
    this.light.position.copy(camera.position).addScaledVector(dir, 100);
    this.light.target.position.copy(camera.position);

    const pulses = [];
    let t0 = 0;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      pulses.push({ t: t0, d: 0.04 + Math.random() * 0.07, k: 0.5 + Math.random() * (i === n - 1 ? 1.2 : 0.7) });
      t0 += 0.06 + Math.random() * 0.14;
    }
    this.pulses = pulses;
    this.t = 0;
    this.duration = t0 + 0.4;

    if (this.bolt) { this.scene.remove(this.bolt); this.bolt.geometry.dispose(); }
    if (Math.random() < 0.8) {
      this.bolt = this.makeBolt(top, base);
      this.scene.add(this.bolt);
    } else this.bolt = null;

    const delay = Math.min(4, dist / 343 * 0.6);
    this.audio?.thunder(delay, near ? 1 : 0.55 + Math.random() * 0.3);
  }

  makeBolt(top, base) {
    const geos = [];
    const branch = (a, b, width, depth) => {
      let pts = [a, b];
      let disp = a.distanceTo(b) * 0.18;
      for (let it = 0; it < 6; it++) {
        const np = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const m = pts[i].clone().lerp(pts[i + 1], 0.5);
          m.x += (Math.random() - 0.5) * disp;
          m.z += (Math.random() - 0.5) * disp;
          m.y += (Math.random() - 0.5) * disp * 0.3;
          np.push(m, pts[i + 1]);
        }
        pts = np; disp *= 0.55;
      }
      const path = new THREE.CurvePath();
      for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
      geos.push(new THREE.TubeGeometry(path, pts.length * 2, width, 3, false));
      if (depth < 2) {
        const nb = 1 + Math.floor(Math.random() * 2);
        for (let k = 0; k < nb; k++) {
          const s = pts[Math.floor(pts.length * (0.15 + Math.random() * 0.5))];
          const e = s.clone().add(new THREE.Vector3((Math.random() - 0.5) * 180, -60 - Math.random() * 140, (Math.random() - 0.5) * 180));
          branch(s, e, width * 0.5, depth + 1);
        }
      }
    };
    branch(top, base, 1.6, 0);
    const g = new THREE.Group();
    geos.forEach((geo) => g.add(new THREE.Mesh(geo, this.mat)));
    g.geometry = { dispose: () => geos.forEach((x) => x.dispose()) };
    return g;
  }

  update(dt, camera) {
    this.next -= dt;
    if (this.next <= 0) {
      this.strike(camera, Math.random() < 0.25);
      this.next = 4 + Math.random() * 9;
    }
    this.t += dt;
    let f = 0;
    for (const p of this.pulses) {
      const x = (this.t - p.t) / p.d;
      if (x > -1) f += p.k * (x < 0 ? 1 + x : Math.exp(-x * 1.4));
    }
    if (this.t > (this.duration || 0) + 1.5) f = 0;
    this.env.uFlash.value = f;
    this.light.intensity = f * 3.5;
    if (this.bolt) {
      const vis = f > 0.12 && this.t < this.duration;
      this.bolt.visible = vis;
      this.mat.opacity = Math.min(1, f);
    }
    return f;
  }

  flashNow(k = 1) { // éclair forcé pour les cinématiques
    this.pulses = [{ t: this.t, d: 0.12, k }];
    this.duration = this.t + 0.5;
  }
}

/* ------------------------------------------------------------ particules */
const PARTICLE_VS = /* glsl */`
  attribute float aSize;
  attribute vec4 aColor;
  uniform float uScale;
  uniform float uNear;
  varying vec4 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = min(aSize * uScale / max(-mv.z, 0.1), 220.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    // les particules qui frôlent l'objectif s'effacent au lieu de voiler l'image
    vColor.a *= smoothstep(uNear * 0.3, uNear, -mv.z);
  }
`;
const PARTICLE_FS = /* glsl */`
  varying vec4 vColor;
  uniform float uSoft;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, uSoft, d);
    if (a <= 0.001) discard;
    gl_FragColor = vec4(vColor.rgb, vColor.a * a);
  }
`;

export class Particles {
  constructor(max, additive, soft = 0.0) {
    this.max = max;
    this.p = new Float32Array(max * 3);
    this.v = new Float32Array(max * 3);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max).fill(1);
    this.s0 = new Float32Array(max);
    this.s1 = new Float32Array(max);
    this.col = new Float32Array(max * 3);
    this.a0 = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.cursor = 0;
    const geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.sizeAttr = new THREE.BufferAttribute(new Float32Array(max), 1).setUsage(THREE.DynamicDrawUsage);
    this.colAttr = new THREE.BufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);
    geo.setAttribute('aSize', this.sizeAttr);
    geo.setAttribute('aColor', this.colAttr);
    this.uniforms = { uScale: { value: 400 }, uSoft: { value: soft }, uNear: { value: 6 } };
    this.mesh = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: PARTICLE_VS,
      fragmentShader: PARTICLE_FS,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    this.mesh.frustumCulled = false;
  }

  emit(x, y, z, vx, vy, vz, o) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.max;
    this.p[i * 3] = x; this.p[i * 3 + 1] = y; this.p[i * 3 + 2] = z;
    this.v[i * 3] = vx; this.v[i * 3 + 1] = vy; this.v[i * 3 + 2] = vz;
    this.life[i] = this.maxLife[i] = o.life;
    this.s0[i] = o.size; this.s1[i] = o.size1 ?? o.size;
    this.col[i * 3] = o.r; this.col[i * 3 + 1] = o.g; this.col[i * 3 + 2] = o.b;
    this.a0[i] = o.a ?? 1;
    this.grav[i] = o.grav ?? 0;
    this.drag[i] = o.drag ?? 0;
  }

  update(dt, light = 1) {
    const P = this.posAttr.array, S = this.sizeAttr.array, C = this.colAttr.array;
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) { S[i] = 0; continue; }
      this.life[i] -= dt;
      const k = i * 3;
      const dr = Math.max(0, 1 - this.drag[i] * dt);
      this.v[k] *= dr; this.v[k + 1] = this.v[k + 1] * dr - this.grav[i] * dt; this.v[k + 2] *= dr;
      this.p[k] += this.v[k] * dt; this.p[k + 1] += this.v[k + 1] * dt; this.p[k + 2] += this.v[k + 2] * dt;
      const t = 1 - Math.max(0, this.life[i]) / this.maxLife[i];
      P[k] = this.p[k]; P[k + 1] = this.p[k + 1]; P[k + 2] = this.p[k + 2];
      S[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      C[i * 4] = this.col[k] * light; C[i * 4 + 1] = this.col[k + 1] * light; C[i * 4 + 2] = this.col[k + 2] * light;
      C[i * 4 + 3] = this.a0[i] * (1 - t) * Math.min(1, t * 8 + 0.2);
    }
    this.posAttr.needsUpdate = this.sizeAttr.needsUpdate = this.colAttr.needsUpdate = true;
  }
}

/* ------------------------------------------------------------ traçantes */
export class Tracers {
  constructor(max = 48) {
    this.max = max;
    this.items = [];
    const geo = new THREE.BufferGeometry();
    this.attr = new THREE.BufferAttribute(new Float32Array(max * 6), 3).setUsage(THREE.DynamicDrawUsage);
    this.colAttr = new THREE.BufferAttribute(new Float32Array(max * 6), 3).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.attr);
    geo.setAttribute('color', this.colAttr);
    this.mesh = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.mesh.frustumCulled = false;
  }
  fire(from, to, color = [6, 4.2, 1.6], speed = 420) {
    if (this.items.length >= this.max) this.items.shift();
    const dir = to.clone().sub(from);
    const len = dir.length();
    this.items.push({ from: from.clone(), dir: dir.normalize(), len, d: 0, speed, color });
  }
  update(dt) {
    const P = this.attr.array, C = this.colAttr.array;
    P.fill(0); C.fill(0);
    this.items = this.items.filter((it) => (it.d += it.speed * dt) < it.len + 6);
    this.items.forEach((it, i) => {
      const a = Math.min(it.d, it.len), b = Math.max(0, Math.min(it.d - 6, it.len));
      for (let k = 0; k < 3; k++) {
        P[i * 6 + k] = it.from.getComponent(k) + it.dir.getComponent(k) * a;
        P[i * 6 + 3 + k] = it.from.getComponent(k) + it.dir.getComponent(k) * b;
        C[i * 6 + k] = it.color[k];
        C[i * 6 + 3 + k] = it.color[k] * 0.1;
      }
    });
    this.attr.needsUpdate = this.colAttr.needsUpdate = true;
  }
}

/* ---------------------------------------------------------------- sillage */
export class Wake {
  constructor(n = 70) {
    this.n = n;
    this.pts = [];
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.data = new THREE.BufferAttribute(new Float32Array(n * 2 * 2), 2).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.pos);
    geo.setAttribute('aData', this.data);
    const idx = [];
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    geo.setIndex(idx);
    this.uniforms = { uLight: { value: 1 }, uTime: { value: 0 } };
    this.mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: /* glsl */`
        attribute vec2 aData; // u (côté), alpha
        varying vec2 vD; varying vec3 vW;
        void main() { vD = aData; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
      `,
      fragmentShader: /* glsl */`
        uniform float uLight, uTime;
        varying vec2 vD; varying vec3 vW;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
        void main() {
          float n = noise(vW.xz * 1.3 + uTime * 0.3) * 0.6 + noise(vW.xz * 4.0) * 0.4;
          float edge = 1.0 - abs(vD.x);
          float a = vD.y * smoothstep(0.0, 0.6, edge) * smoothstep(0.45, 0.85, n + edge * 0.25);
          gl_FragColor = vec4(vec3(0.62, 0.68, 0.7) * uLight, a * 0.6);
        }
      `,
    }));
    this.mesh.frustumCulled = false;
    this.last = null;
  }
  update(dt, t, x, z, heading, speed, width, light) {
    this.uniforms.uLight.value = light;
    this.uniforms.uTime.value = t;
    for (const p of this.pts) p.age += dt;
    if (!this.last || Math.hypot(x - this.last.x, z - this.last.z) > 1.2) {
      this.pts.unshift({ x, z, h: heading, age: 0, s: Math.min(1, Math.abs(speed) / 14) });
      this.last = { x, z };
      if (this.pts.length > this.n) this.pts.pop();
    }
    const P = this.pos.array, D = this.data.array;
    for (let i = 0; i < this.n; i++) {
      const p = this.pts[Math.min(i, this.pts.length - 1)];
      if (!p) break;
      const w = width * 0.5 + p.age * 1.6;
      const rx = Math.cos(p.h), rz = -Math.sin(p.h);
      const alpha = i < this.pts.length ? Math.max(0, 1 - p.age / 9) * p.s : 0;
      for (let k = 0; k < 2; k++) {
        const sx = p.x + rx * w * (k ? 1 : -1), sz = p.z + rz * w * (k ? 1 : -1);
        const j = i * 2 + k;
        P[j * 3] = sx; P[j * 3 + 1] = heightAt(sx, sz, t) + 0.08; P[j * 3 + 2] = sz;
        D[j * 2] = k ? 1 : -1; D[j * 2 + 1] = alpha;
      }
    }
    this.pos.needsUpdate = this.data.needsUpdate = true;
  }
  reset() { this.pts = []; this.last = null; }
}

/* ----------------------------------------------- faisceau volumétrique */
export function createBeam(length = 70, radius = 9) {
  const geo = new THREE.CylinderGeometry(0.25, radius, length, 24, 1, true);
  geo.translate(0, -length / 2, 0);
  geo.rotateX(-Math.PI / 2); // l'axe pointe vers +Z
  const mat = new THREE.ShaderMaterial({
    uniforms: { uInt: { value: 1 }, uLen: { value: length } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      varying float vZ; varying vec3 vN; varying vec3 vV;
      void main() {
        vZ = position.z;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uInt, uLen;
      varying float vZ; varying vec3 vN; varying vec3 vV;
      void main() {
        float along = clamp(vZ / uLen, 0.0, 1.0);
        float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
        float a = (1.0 - along) * (1.0 - along) * edge * uInt;
        gl_FragColor = vec4(vec3(0.9, 0.93, 1.0) * a * 0.05, 1.0);
      }
    `,
  });
  const m = new THREE.Mesh(geo, mat);
  m.frustumCulled = false;
  return m;
}
