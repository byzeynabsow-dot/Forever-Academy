/* =========================================================
   Talk & Shine — page SHINE : avatar, conversation, états
   ---------------------------------------------------------
   L'avatar est dessiné en SVG animé. Sa bouche suit l'amplitude
   réelle de la voix renvoyée par Gemini (analyse audio en direct),
   pas une boucle décorative. Ce n'est pas du lip-sync phonétique :
   la bouche s'ouvre au rythme du son, elle ne forme pas les
   phonèmes un par un.
   ========================================================= */
window.Shine = (function () {
  'use strict';
  var $ = TS.$, $$ = TS.$$, esc = TS.escapeHTML, state = TS.state;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wired = false, raf = null, topic = '';
  var lastWho = null, liveLine = null;

  var LABELS = {
    idle:       { txt: 'Prête',        cls: 'idle' },
    connecting: { txt: 'Connexion…',   cls: 'connecting' },
    listening:  { txt: "Je t'écoute",  cls: 'listening' },
    thinking:   { txt: 'Je réfléchis…',cls: 'thinking' },
    speaking:   { txt: 'Je parle',     cls: 'speaking' },
    error:      { txt: 'Interrompu',   cls: 'error' }
  };

  /* ---------------- avatar SVG ---------------- */
  function avatarSVG() {
    return '' +
    '<svg id="shineFace" viewBox="0 0 220 240" role="img" aria-label="SHINE, professeure d\'anglais">' +
      '<defs>' +
        '<linearGradient id="sgSkin" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#8D5A3B"/><stop offset="100%" stop-color="#6E4229"/></linearGradient>' +
        '<linearGradient id="sgHair" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#241B14"/><stop offset="100%" stop-color="#0F0B08"/></linearGradient>' +
        '<linearGradient id="sgTop" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#1B3160"/><stop offset="100%" stop-color="#24406F"/></linearGradient>' +
        '<radialGradient id="sgHalo" cx="50%" cy="45%" r="55%">' +
          '<stop offset="0%" stop-color="#F5A623" stop-opacity=".38"/>' +
          '<stop offset="100%" stop-color="#F5A623" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<ellipse id="shineHalo" cx="110" cy="112" rx="104" ry="108" fill="url(#sgHalo)"/>' +
      '<g id="shineBody">' +
        '<path d="M34 240c6-40 34-58 76-58s70 18 76 58z" fill="url(#sgTop)"/>' +
        '<path d="M110 182c-9 12-16 20-16 20l-9-14 12-10zM110 182c9 12 16 20 16 20l9-14-12-10z" fill="#F3F6FC" opacity=".9"/>' +
      '</g>' +
      '<g id="shineHead">' +
        '<path d="M46 96c0-42 28-70 64-70s64 28 64 70c0 10-2 18-4 24 8 2 10 12 4 18-4 4-9 4-12 2-9 26-30 44-52 44S67 166 58 140c-3 2-8 2-12-2-6-6-4-16 4-18-2-6-4-14-4-24z" fill="url(#sgSkin)"/>' +
        '<path d="M42 104C42 52 72 20 110 20s68 32 68 84c0 8-1 14-2 18-4-16-6-30-10-40-16 12-40 18-64 14-14-2-24-8-30-14-4 10-6 24-8 40-1-4-2-10-2-18z" fill="url(#sgHair)"/>' +
        '<path d="M40 92c-10 22-12 52-6 84-14-30-14-70 6-84zM180 92c10 22 12 52 6 84 14-30 14-70-6-84z" fill="url(#sgHair)"/>' +
        '<g id="shineBrows" fill="none" stroke="#2A1D14" stroke-width="4" stroke-linecap="round">' +
          '<path d="M72 94q12-7 24-1"/><path d="M124 93q12-6 24 1"/>' +
        '</g>' +
        '<g id="shineEyes">' +
          '<ellipse cx="84" cy="109" rx="11" ry="6.6" fill="#FBF7F3"/>' +
          '<ellipse cx="136" cy="109" rx="11" ry="6.6" fill="#FBF7F3"/>' +
          '<g id="shinePupils">' +
            '<circle cx="84" cy="109" r="4.6" fill="#2A1C12"/><circle cx="136" cy="109" r="4.6" fill="#2A1C12"/>' +
            '<circle cx="85.6" cy="107.2" r="1.5" fill="#fff" opacity=".9"/><circle cx="137.6" cy="107.2" r="1.5" fill="#fff" opacity=".9"/>' +
          '</g>' +
          // trait de paupière : donne de la profondeur au regard
          '<path d="M73 105q11-6 22 0" fill="none" stroke="#3A281B" stroke-width="2.2" stroke-linecap="round"/>' +
          '<path d="M125 105q11-6 22 0" fill="none" stroke="#3A281B" stroke-width="2.2" stroke-linecap="round"/>' +
          '<g id="shineLids" fill="url(#sgSkin)">' +
            '<rect x="72" y="101" width="24" height="0" rx="2"/><rect x="124" y="101" width="24" height="0" rx="2"/>' +
          '</g>' +
        '</g>' +
        '<path d="M110 118c-3 8-6 12-2 16 2 2 6 2 8 0" fill="none" stroke="#4E301D" stroke-width="3" stroke-linecap="round"/>' +
        '<g id="shineMouth">' +
          '<path id="shineLips" d="M93 151q17 9 34 0" fill="none" stroke="#43231A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<ellipse cx="66" cy="134" rx="9" ry="6" fill="#C4735A" opacity=".22"/>' +
        '<ellipse cx="154" cy="134" rx="9" ry="6" fill="#C4735A" opacity=".22"/>' +
      '</g>' +
    '</svg>';
  }

  /* ---------------- animation ---------------- */
  var t0 = performance.now(), nextBlink = 1200, blinkPhase = -1;
  function animate(now) {
    raf = requestAnimationFrame(animate);
    var head = document.getElementById('shineHead');
    if (!head) return;
    var t = (now - t0) / 1000;
    var st = ShineLive.getState();
    if (window.ShineAvatar && ShineAvatar.isReady()) ShineAvatar.setState(st);

    /* respiration + micro-mouvements de tête : discrets, jamais figés */
    var breathe = Math.sin(t * 1.1) * 1.4;
    var sway = Math.sin(t * 0.42) * (st === 'speaking' ? 2.6 : 1.4);
    var tilt = Math.sin(t * 0.31) * (st === 'thinking' ? 2.4 : 0.9);
    head.setAttribute('transform',
      'translate(' + sway.toFixed(2) + ',' + breathe.toFixed(2) + ') rotate(' + tilt.toFixed(2) + ' 110 120)');

    /* clignement : intervalle irrégulier, comme un vrai œil */
    var lids = document.getElementById('shineLids');
    if (lids) {
      var ms = now - t0;
      if (blinkPhase < 0 && ms > nextBlink) { blinkPhase = 0; }
      var h = 0;
      if (blinkPhase >= 0) {
        blinkPhase += 1 / 60;
        h = blinkPhase < 0.07 ? (blinkPhase / 0.07) * 22 : Math.max(0, (1 - (blinkPhase - 0.07) / 0.09)) * 22;
        if (blinkPhase > 0.17) { blinkPhase = -1; nextBlink = ms + 1800 + Math.random() * 3600; }
      }
      $$('rect', lids).forEach(function (r) { r.setAttribute('height', h.toFixed(1)); });
    }

    /* regard : suit doucement, se détourne pendant la réflexion */
    var pupils = document.getElementById('shinePupils');
    if (pupils) {
      var gx = st === 'thinking' ? Math.sin(t * 0.8) * 3 - 2 : Math.sin(t * 0.5) * 1.6;
      var gy = st === 'thinking' ? -2.5 : Math.cos(t * 0.4) * 1;
      pupils.setAttribute('transform', 'translate(' + gx.toFixed(2) + ',' + gy.toFixed(2) + ')');
    }

    /* bouche : pilotée par l'amplitude réelle de la voix */
    var lips = document.getElementById('shineLips');
    if (lips) {
      var lvl = st === 'speaking' ? ShineLive.getOutputLevel() : 0;
      var open = lvl * 17;                       // ouverture verticale
      var wide = 18 - lvl * 4;                   // la bouche s'arrondit
      if (st === 'listening' && open < 0.4) open = 0;
      var d = open > 0.6
        ? 'M' + (110 - wide) + ' 150 q' + wide + ' ' + (open * 1.5) + ' ' + (wide * 2) + ' 0 q-' + wide + ' ' + (open * 2.2) + ' -' + (wide * 2) + ' 0 z'
        : (st === 'idle' || st === 'listening')
          ? 'M93 151q17 9 34 0'                   // léger sourire au repos
          : 'M95 151q15 5 30 0';
      lips.setAttribute('d', d);
      lips.setAttribute('fill', open > 0.6 ? '#2A1109' : 'none');
    }

    /* halo : pulse seulement quand elle parle */
    var halo = document.getElementById('shineHalo');
    if (halo) {
      var s = st === 'speaking' ? 1 + ShineLive.getOutputLevel() * 0.06 : 1;
      halo.setAttribute('transform', 'translate(110,112) scale(' + s.toFixed(3) + ') translate(-110,-112)');
    }
  }

  /* ---------------- transcription ---------------- */
  function addLine(who, text, opts) {
    var log = $('#shineLog');
    if (!log) return;
    var empty = $('.shine-empty', log);
    if (empty) empty.remove();

    if (opts && opts.turnComplete) { lastWho = null; liveLine = null; return; }
    if (!text) return;

    if (who === lastWho && liveLine && !(opts && opts.final)) {
      liveLine.querySelector('.b').textContent += text;
    } else {
      var el = document.createElement('div');
      el.className = 'shine-line ' + (who === 'user' ? 'me' : 'her');
      el.innerHTML = '<span class="who">' + (who === 'user' ? 'Toi' : 'SHINE') + '</span><span class="b"></span>';
      el.querySelector('.b').textContent = text;
      log.appendChild(el);
      liveLine = (opts && opts.final) ? null : el;
      lastWho = (opts && opts.final) ? null : who;
    }
    log.scrollTop = log.scrollHeight;
  }

  function setStatus(st) {
    var L = LABELS[st] || LABELS.idle;
    var chip = $('#shineStatus');
    if (chip) { chip.textContent = L.txt; chip.className = 'shine-status ' + L.cls; }
    var stage = $('#shineStage');
    if (stage) stage.className = 'shine-stage ' + L.cls;

    var mic = $('#shineMic');
    if (mic) {
      var live = st !== 'idle' && st !== 'error' && st !== 'connecting';
      mic.classList.toggle('live', live);
      mic.textContent = live ? 'Terminer la conversation' : 'Parler avec SHINE';
      mic.disabled = st === 'connecting';
    }
    var muteBtn = $('#shineMute');
    if (muteBtn) muteBtn.style.display = (st === 'idle' || st === 'error' || st === 'connecting') ? 'none' : 'inline-flex';
  }

  function notice(msg, kind) {
    var box = $('#shineNotice');
    if (!box) return;
    box.textContent = msg || '';
    box.className = 'shine-notice' + (msg ? ' show' : '') + (kind ? ' ' + kind : '');
  }

  /* ---------------- rendu de la page ---------------- */
  function render(withTopic) {
    topic = withTopic || '';
    var sup = ShineLive.support();

    $('#shineShell').innerHTML =
      '<div class="shine-grid">' +
        '<div class="shine-stage idle" id="shineStage">' +
          '<div class="shine-3d" id="shine3d"></div>' +
          avatarSVG() +
          '<div class="shine-id"><b>SHINE</b><span>Professeure d\'anglais · Talk &amp; Shine</span></div>' +
          '<span class="shine-status idle" id="shineStatus">Prête</span>' +
          '<p class="shine-3d-note" id="shine3dNote" style="display:none;"></p>' +
        '</div>' +

        '<div class="shine-panel">' +
          '<div class="shine-head">' +
            '<h2>Parle anglais avec SHINE</h2>' +
            '<p>Elle t\'écoute, te répond à voix haute et corrige une erreur à la fois. Niveau : <b>' + esc(state.level || 'A2') + '</b>' +
            (topic ? ' · sujet du jour : <b>' + esc(topic) + '</b>' : '') + '</p>' +
          '</div>' +

          '<div class="shine-notice" id="shineNotice"></div>' +

          '<div class="shine-log" id="shineLog">' +
            '<p class="shine-empty">La transcription de votre conversation s\'affichera ici, ligne par ligne.</p>' +
          '</div>' +

          '<div class="shine-actions">' +
            '<button type="button" class="shine-mic" id="shineMic">Parler avec SHINE</button>' +
            '<button type="button" class="shine-mute" id="shineMute" style="display:none;">Couper le micro</button>' +
            '<button type="button" class="shine-mute" id="shineDiag" title="Vérifier la configuration">Diagnostic</button>' +
          '</div>' +

          '<form class="shine-compose" id="shineCompose">' +
            '<input type="text" id="shineInput" autocomplete="off" placeholder="…ou écris ton message à SHINE">' +
            '<button type="submit" class="shine-send" aria-label="Envoyer">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
            '</button>' +
          '</form>' +

          '<p class="shine-foot" id="shineFoot"></p>' +
        '</div>' +
      '</div>';

    /* Message d'aptitude honnête, avant toute tentative */
    var foot = $('#shineFoot');
    /* Avertissement honnête quand la clé est écrite dans la page. */
    if (ShineLive.mode() === 'direct') {
      var warn = $('#shineNotice');
      if (warn) {
        warn.className = 'shine-notice show warn';
        warn.innerHTML = "⚠️ <b>Clé Gemini exposée.</b> Elle est écrite dans le code de cette page : " +
          "toute personne qui ouvre le code source peut la lire et l'utiliser à tes frais. " +
          "Surveille ton quota, ou passe par un serveur (voir js/config.js).";
      }
    }
    if (!sup.secure) {
      foot.innerHTML = "⚠️ Le micro exige une adresse <b>https://</b>. Ouvert en fichier local, seul le mode écrit fonctionne.";
    } else if (!sup.voice) {
      foot.innerHTML = "⚠️ Ce navigateur ne permet pas la conversation vocale. Le mode écrit reste disponible.";
    } else {
      foot.innerHTML = "La session se ferme seule après 90 secondes de silence, et au bout de 10 minutes.";
    }

    if (!wired) wire();
    if (!raf) raf = requestAnimationFrame(animate);
    setStatus(ShineLive.getState());
    mount3D();
  }

  function wire() {
    wired = true;

    ShineLive.on('state', setStatus);
    ShineLive.on('transcript', function (t) { addLine(t.who, t.text, t); });
    ShineLive.on('error', function (e) {
      notice(e.message, e.recoverable ? 'warn' : 'err');
      if (!e.recoverable) TS.toast(e.message, 'err');
    });

    document.addEventListener('click', function (ev) {
      var mic = ev.target.closest && ev.target.closest('#shineMic');
      if (mic) {
        var st = ShineLive.getState();
        if (st === 'idle' || st === 'error') {
          notice('');
          ShineLive.start(
            { level: state.level || 'A2', name: state.name || '', topic: topic },
            { voice: ShineLive.support().voice }
          );
        } else {
          ShineLive.stop();
        }
        return;
      }
      if (ev.target.closest && ev.target.closest('#shineDiag')) { diagnose(); return; }
      var mute = ev.target.closest && ev.target.closest('#shineMute');
      if (mute) {
        var on = ShineLive.setMic(mute.dataset.off === '1');
        mute.dataset.off = on ? '0' : '1';
        mute.textContent = on ? 'Couper le micro' : 'Réactiver le micro';
      }
    });

    document.addEventListener('submit', function (ev) {
      if (!ev.target.matches('#shineCompose')) return;
      ev.preventDefault();
      var input = $('#shineInput');
      var txt = input.value.trim();
      if (!txt) return;
      if (ShineLive.getState() === 'idle' || ShineLive.getState() === 'error') {
        notice("Ouvre d'abord une conversation avec le bouton ci-dessus.", 'warn');
        return;
      }
      if (ShineLive.sendText(txt)) input.value = '';
    });
  }

  /* ---------------- avatar 3D ---------------- */
  var tried3D = false;
  function mount3D() {
    var box = $('#shine3d'), stage = $('#shineStage');
    if (!box || !window.ShineAvatar) return;

    if (!ShineAvatar.supported()) {
      // Pas de WebGL : on garde l'avatar SVG, et on le dit.
      stage.classList.add('svg-mode');
      note3D("Ce navigateur ne gère pas la 3D. SHINE s'affiche en version simplifiée.");
      return;
    }
    if (ShineAvatar.isReady()) {
      // Déjà chargé par la page d'accueil : on récupère le même canvas.
      stage.classList.add('has-3d');
      ShineAvatar.attachTo(box);
      return;
    }
    if (tried3D) return;
    tried3D = true;

    stage.classList.add('loading-3d');
    ShineAvatar.mount(box).then(function () {
      stage.classList.remove('loading-3d');
      stage.classList.add('has-3d');
    }).catch(function (e) {
      tried3D = false;
      stage.classList.remove('loading-3d');
      stage.classList.add('svg-mode');
      note3D("Le modèle 3D n'a pas pu être chargé. SHINE s'affiche en version simplifiée.");
    });
  }
  function note3D(msg) {
    var el = $('#shine3dNote');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  /* Rapport de diagnostic : dit exactement ce qui manque, sans jamais
     afficher la clé (le serveur ne la renvoie pas). */
  async function diagnose() {
    var sup = ShineLive.support();
    var lines = [];
    function ok(v){ return v ? '✅' : '❌'; }

    lines.push('<b>Navigateur</b>');
    lines.push(ok(sup.secure) + ' page sécurisée (https) — indispensable au micro');
    lines.push(ok(sup.mic) + ' micro accessible');
    lines.push(ok(sup.audio) + ' audio');
    lines.push(ok(sup.worklet) + ' capture audio (AudioWorklet)');
    lines.push(ok(sup.websocket) + ' WebSocket');
    lines.push(ok(window.ShineAvatar && ShineAvatar.supported()) + ' 3D (WebGL)');
    lines.push('');
    lines.push('<b>Mode</b> : ' + (ShineLive.mode() === 'direct' ? 'clé dans la page ⚠️' : 'jeton serveur ✅'));
    lines.push('');
    lines.push('<b>Serveur</b>');

    var box = $('#shineNotice');
    box.className = 'shine-notice show';
    box.innerHTML = lines.join('<br>') + '<br>⏳ test de /api/token…';

    var res, txt, info = null;
    try {
      res = await fetch((TS.cfg.tokenEndpoint || '/api/token'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ level: state.level || 'A2', name: state.name || '', topic: 'diagnostic' })
      });
      txt = await res.text();
      try { info = JSON.parse(txt); } catch (e) {}
    } catch (e) {
      lines.push('❌ /api/token injoignable — la fonction serveur n\'est pas déployée.');
      lines.push('<i>' + esc(String(e)) + '</i>');
      box.className = 'shine-notice show err';
      box.innerHTML = lines.join('<br>');
      return;
    }

    lines.push((res.ok ? '✅' : '❌') + ' /api/token répond : <b>HTTP ' + res.status + '</b>');
    if (info) {
      if (info.error) lines.push('code : <b>' + esc(info.error) + '</b>');
      if (info.message) lines.push('message : <i>' + esc(info.message) + '</i>');
      if (info.apiVersion) lines.push('version d\'API essayée : <b>' + esc(info.apiVersion) + '</b>');
      if (info.model) lines.push('modèle : <b>' + esc(info.model) + '</b>');
      if (info.token) {
        lines.push('✅ jeton reçu — la clé fonctionne.');
        lines.push(info.constraintsLocked === false
          ? '⚠️ cette version d\'API ne scelle pas la consigne dans le jeton : elle est envoyée avec la connexion.'
          : '✅ consigne pédagogique scellée dans le jeton.');
      }
    } else if (txt) {
      lines.push('<i>' + esc(txt.slice(0, 300)) + '</i>');
    }

    lines.push('');
    if (info && info.error === 'not_configured') {
      lines.push('👉 La variable <b>GEMINI_API_KEY</b> manque sur le déploiement, ou le site n\'a pas été redéployé après l\'avoir ajoutée.');
    } else if (info && info.error === 'origin_refused') {
      lines.push('👉 <b>ALLOWED_ORIGINS</b> ne correspond pas à l\'adresse de ce site : ' + esc(location.origin));
    } else if (info && info.error === 'token_refused') {
      lines.push(/API key|API_KEY|UNAUTHENT|permission/i.test(info.message || '')
        ? '👉 Google refuse la clé. Vérifie <b>GEMINI_API_KEY</b> (format AIza…) et que l\'API Generative Language est activée.'
        : '👉 Google refuse la requête. Essaie de changer <b>GEMINI_API_VERSION</b> (v1beta ou v1alpha), ou envoie-moi ce message.');
    } else if (res.status === 404) {
      lines.push('👉 La fonction n\'est pas déployée : le dossier <b>netlify/functions</b> doit être présent dans ce qui a été envoyé.');
    }

    box.className = 'shine-notice show ' + (res.ok ? 'warn' : 'err');
    box.innerHTML = lines.join('<br>');
  }

  function leave() {
    ShineLive.stop();
    if (window.ShineAvatar) ShineAvatar.stop();
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  return { render: render, leave: leave };
})();
