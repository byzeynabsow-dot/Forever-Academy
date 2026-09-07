/* =========================================================
   Talk & Shine — avatar 3D de SHINE (WebGL / three.js)
   ---------------------------------------------------------
   Le modèle fourni (assets/3d/shine.glb) est un avatar Avaturn
   complet : 52 os, une animation « idle », mais AUCUNE morph
   target et AUCUN os de mâchoire.

   Conséquence assumée : la bouche ne peut pas être animée.
   On anime donc ce que le squelette permet réellement — tête,
   nuque, buste — au rythme de l'amplitude réelle de la voix.
   Aucun faux lip-sync n'est simulé.
   ========================================================= */
window.ShineAvatar = (function () {
  'use strict';

  /* three.js est servi par le site lui-même : pas de CDN, donc l'avatar
     s'affiche même avec une connexion lente ou un CDN bloqué. */
  /* import() exige un chemin absolu ou commençant par « ./ » :
     on résout donc les URL par rapport au document. */
  function url(rel) { return new URL(rel, document.baseURI).href; }
  var THREE_URL = url('vendor/three/three.module.js');
  var GLTF_URL = url('vendor/three/loaders/GLTFLoader.js');
  var MODEL_URL = url('assets/3d/shine.glb');

  /* Animations livrées à part : ces fichiers ne contiennent que les clips
     (le maillage et les textures en ont été retirés par
     tools/extract-animation.py), d'où quelques dizaines de Ko au lieu de
     3,4 Mo par animation. Pour en ajouter une, il suffit d'étendre cette
     liste. */
  var ANIM_FILES = ['assets/3d/anim-gesture.glb'];

  /* Quel clip joue dans quel état. Un nom absent est ignoré sans casse. */
  var ROLES = {
    idle:       ['IdleV4.2(maya_head)'],
    connecting: ['IdleV4.2(maya_head)'],
    listening:  ['IdleV4.2(maya_head)'],
    thinking:   ['IdleV4.2(maya_head)'],
    speaking:   ['gesture_1', 'IdleV4.2(maya_head)'],
    error:      ['IdleV4.2(maya_head)']
  };

  var THREE = null, ready = false, loading = null;
  var renderer, scene, camera, mixer, clock, root;
  var actions = {}, current = null, currentName = '';
  var bones = { head: null, neck: null, spine: null, spine1: null, spine2: null };
  var host = null, raf = null, visible = true;
  var state = 'idle', level = 0, t = 0;
  var lastFail = null;

  function supported() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }

  /* ---------------- chargement ---------------- */
  function load(container) {
    if (loading) return loading;
    host = container;
    loading = (async function () {
      THREE = await import(THREE_URL);
      var mod = await import(GLTF_URL);

      var w = host.clientWidth || 380, h = host.clientHeight || 460;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';

      scene = new THREE.Scene();

      /* Cadrage buste : la caméra vise la poitrine, la tête occupe le haut. */
      camera = new THREE.PerspectiveCamera(28, w / h, 0.1, 20);
      camera.position.set(0, 1.46, 1.72);
      camera.lookAt(0, 1.42, 0);

      /* Éclairage aux couleurs de la marque : or en clé, bleu nuit en contre. */
      scene.add(new THREE.HemisphereLight(0xE8EEFB, 0x2A3550, 1.15));
      var key = new THREE.DirectionalLight(0xFFF0D8, 2.1);
      key.position.set(1.6, 2.6, 2.2);
      scene.add(key);
      var rim = new THREE.DirectionalLight(0x8FB4FF, 1.5);
      rim.position.set(-2.2, 1.9, -1.6);
      scene.add(rim);
      var fill = new THREE.DirectionalLight(0xFFFFFF, 0.55);
      fill.position.set(-1.2, 1.2, 2.4);
      scene.add(fill);

      var gltf = await new Promise(function (res, rej) {
        new mod.GLTFLoader().load(MODEL_URL, res, null, rej);
      });

      root = gltf.scene;
      root.traverse(function (o) {
        if (o.isMesh) { o.frustumCulled = false; o.castShadow = false; o.receiveShadow = false; }
        if (o.isBone || o.isObject3D) {
          var n = o.name;
          if (n === 'Head') bones.head = o;
          else if (n === 'Neck') bones.neck = o;
          else if (n === 'Spine') bones.spine = o;
          else if (n === 'Spine1') bones.spine1 = o;
          else if (n === 'Spine2') bones.spine2 = o;
        }
      });
      scene.add(root);

      mixer = new THREE.AnimationMixer(root);
      registerClips(gltf.animations);

      /* Les animations supplémentaires arrivent en tâche de fond :
         l'avatar est déjà visible et animé pendant leur chargement. */
      ANIM_FILES.forEach(function (f) {
        new mod.GLTFLoader().load(url(f), function (extra) {
          registerClips(extra.animations);
          apply(state);
        }, null, function () { /* clip absent : on garde ceux qu'on a */ });
      });

      apply('idle');

      clock = new THREE.Clock();
      ready = true;
      observe();
      window.addEventListener('resize', resize);
      resize();
      start();
      return true;
    })().catch(function (e) {
      lastFail = (e && e.message) || String(e);
      loading = null;
      throw e;
    });
    return loading;
  }

  function registerClips(list) {
    (list || []).forEach(function (clip) {
      if (actions[clip.name]) return;
      var a = mixer.clipAction(clip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.enabled = true;
      actions[clip.name] = a;
    });
  }

  /* Choisit le clip correspondant à l'état et enchaîne en fondu.
     Un fondu plutôt qu'une coupure : sinon l'avatar « saute ». */
  function apply(st) {
    if (!mixer) return;
    var wanted = ROLES[st] || ROLES.idle;
    var name = null;
    for (var i = 0; i < wanted.length; i++) {
      if (actions[wanted[i]]) { name = wanted[i]; break; }
    }
    if (!name) {
      var keys = Object.keys(actions);
      if (!keys.length) return;
      name = keys[0];
    }
    if (name === currentName) return;

    var next = actions[name];
    next.reset();
    next.setEffectiveTimeScale(1);
    next.setEffectiveWeight(1);
    next.play();
    if (current && current !== next) current.crossFadeTo(next, 0.5, false);
    current = next;
    currentName = name;
  }

  /* Ne pas faire tourner le GPU quand l'avatar n'est pas à l'écran. */
  function observe() {
    if (!('IntersectionObserver' in window) || !host) return;
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.05 }).observe(host);
  }

  function resize() {
    if (!ready || !host) return;
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* ---------------- animation pilotée par l'état et la voix ---------------- */
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!ready) return;
    var dt = clock.getDelta();
    t += dt;
    if (mixer) mixer.update(dt);

    // Amplitude réelle de la voix de SHINE (0 si elle ne parle pas).
    var target = (state === 'speaking' && window.ShineLive) ? ShineLive.getOutputLevel() : 0;
    level += (target - level) * Math.min(1, dt * 12);

    /* Les rotations ci-dessous s'AJOUTENT à ce que le clip vient de
       calculer (mixer.update est passé juste avant) : le geste animé
       reste visible, la réaction à la voix se superpose. */
    var b = bones;
    var breathe = Math.sin(t * 1.15) * 0.012;

    if (b.head) {
      var nod = state === 'speaking' ? Math.sin(t * 7.5) * level * 0.15 - level * 0.05 : 0;
      var tilt = state === 'listening' ? 0.09 : state === 'thinking' ? -0.06 : 0;
      var turn = state === 'thinking' ? -0.20 + Math.sin(t * 0.5) * 0.04
               : state === 'speaking' ? Math.sin(t * 1.3) * 0.05
               : Math.sin(t * 0.45) * 0.04;
      var up = state === 'thinking' ? -0.09 : 0;
      b.head.rotation.x += nod + up + Math.sin(t * 0.7) * 0.01;
      b.head.rotation.y += turn;
      b.head.rotation.z += tilt;
    }
    if (b.neck) {
      b.neck.rotation.x += state === 'speaking' ? Math.sin(t * 7.5 - 0.6) * level * 0.055 : 0;
      b.neck.rotation.y += Math.sin(t * 0.4) * 0.025;
      b.neck.rotation.z += state === 'listening' ? 0.04 : 0;
    }
    ['spine', 'spine1', 'spine2'].forEach(function (k, i) {
      var bone = b[k];
      if (!bone) return;
      bone.rotation.x += breathe * (1 - i * 0.25);
      bone.rotation.y += Math.sin(t * 0.33 + i) * 0.014 + (state === 'speaking' ? level * 0.025 : 0);
    });

    renderer.render(scene, camera);
  }

  function start() { if (ready && !raf && visible) { clock.getDelta(); raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  function dispose() {
    stop();
    window.removeEventListener('resize', resize);
    if (renderer) { try { renderer.dispose(); renderer.domElement.remove(); } catch (e) {} }
    renderer = scene = camera = mixer = root = null;
    bones = { head: null, neck: null, spine: null, spine1: null, spine2: null };
    ready = false; loading = null; host = null;
  }

  /* Déplace le rendu vers un autre conteneur sans recréer de contexte
     WebGL : un seul GPU context pour tout le site, ce qui compte
     beaucoup sur mobile. */
  function attachTo(container) {
    if (!ready || !container || !renderer) return false;
    if (renderer.domElement.parentNode === container) { start(); return true; }
    container.appendChild(renderer.domElement);
    host = container;
    visible = true;
    resize();
    observe();
    start();
    return true;
  }

  return {
    supported: supported,
    attachTo: attachTo,
    /* Monte l'avatar dans `container`. Rejette si WebGL, le réseau ou
       le modèle échouent — l'appelant retombe alors sur l'avatar SVG. */
    mount: function (container) { return load(container); },
    setState: function (s) { if (s === state) return; state = s; apply(s); },
    /* Noms des clips réellement chargés — utile au diagnostic. */
    clips: function () { return Object.keys(actions); },
    playing: function () { return currentName; },
    isReady: function () { return ready; },
    lastError: function () { return lastFail; },
    start: start, stop: stop, dispose: dispose,
    /* Le fichier fourni n'a ni morph target ni os de mâchoire :
       aucune animation de bouche n'est possible. */
    canLipSync: function () { return false; }
  };
})();
