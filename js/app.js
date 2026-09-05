/* =========================================================
   Forever Academy — logique de l'application
   ========================================================= */
window.FA = (function(){
  'use strict';
  var $ = TS.$, $$ = TS.$$, esc = TS.escapeHTML, state = TS.state, CFG = TS.cfg;
  var LEVELS = TS.levels();
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     ROUTEUR
     ======================================================= */
  function showView(id){
    $$('.view').forEach(function(v){ v.classList.remove('active'); });
    var el = document.getElementById(id);
    if(el) el.classList.add('active');
    var isAuth = id === 'view-auth';
    $('#appHeader').style.display = isAuth ? 'none' : 'flex';
    document.body.classList.toggle('app-mode', !isAuth);
    $$('#appNav .nav-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.target === id); });
    if(window.TS_sweep) TS_sweep();
    window.scrollTo(0, 0);
  }

  $$('#appNav .nav-btn').forEach(function(b){
    b.addEventListener('click', function(){
      var t = b.dataset.target;
      stopExam();
      if(t === 'view-home') renderHome();
      if(t === 'view-courses') renderModules();
      if(t === 'view-exams') renderRooms();
      if(t === 'view-test') startPlacement();
      showView(t);
    });
  });

  function greet(){
    $('#helloChip').innerHTML = 'Bonjour, <b>' + esc(state.name || 'Champion') + '</b> 👋';
    $('#levelMini').textContent = state.level || '—';
    var a = $('#levelChipValue'), b = $('#levelChipValue2');
    if(a) a.textContent = state.level || '—';
    if(b) b.textContent = state.level || '—';
  }

  /* ---------- inclinaison 3D ---------- */
  function attachTilt(el, max){
    if(reduced) return;
    max = max || 8;
    var raf = null;
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function(){
        el.style.transform = 'rotateY(' + (px * max) + 'deg) rotateX(' + (-py * max) + 'deg) translateZ(6px)';
      });
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  }
  (function authParallax(){
    var stage = $('#authVisual'), layer = $('#floatLayer'), rig = $('#orbitRig');
    if(!stage || reduced) return;
    stage.addEventListener('mousemove', function(e){
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      layer.style.transform = 'translate3d(' + (px * 26) + 'px,' + (py * 20) + 'px,0)';
      rig.style.transform = 'rotateY(' + (px * 22) + 'deg) rotateX(' + (-py * 16) + 'deg)';
    });
    stage.addEventListener('mouseleave', function(){ layer.style.transform = ''; rig.style.transform = ''; });
  })();

  /* =======================================================
     MOTEUR D'EXERCICES (partagé cours / devoirs / compositions)
     ======================================================= */
  var LETTERS = ['A','B','C','D','E'];

  function exoHTML(item, i, tag){
    var head = '<div class="num">' + (tag || 'Exercice') + ' ' + (i + 1) + '</div>' +
               '<div class="q">' + item.q + '</div>';
    var body = '';
    if(item.t === 'qcm'){
      body = '<div class="opts">' + item.opts.map(function(o, k){
        return '<button type="button" class="opt" data-i="' + k + '"><span class="lt">' + LETTERS[k] + '</span><span>' + esc(o) + '</span></button>';
      }).join('') + '</div>';
    }else if(item.t === 'vf'){
      body = '<div class="opts">' +
        '<button type="button" class="opt" data-i="1"><span class="lt">V</span><span>Vrai</span></button>' +
        '<button type="button" class="opt" data-i="0"><span class="lt">F</span><span>Faux</span></button></div>';
    }else if(item.t === 'fill' || item.t === 'trad'){
      body = '<input class="txt" type="text" autocomplete="off" spellcheck="false" placeholder="' +
             (item.t === 'trad' ? 'Écris la phrase en anglais…' : 'Ta réponse…') + '">' +
             '<div class="row-check"><button type="button" class="btn-check">Vérifier</button></div>';
    }else if(item.t === 'order'){
      body = '<div class="answer-strip"></div><div class="words-pool">' +
             shuffle(item.words.slice()).map(function(w, k){
               return '<button type="button" class="word-chip" data-w="' + esc(w) + '" data-k="' + k + '">' + esc(w) + '</button>';
             }).join('') + '</div>' +
             '<div class="row-check"><button type="button" class="btn-check">Vérifier</button>' +
             '<button type="button" class="btn-check" style="background:var(--muted)" data-reset="1">Effacer</button></div>';
    }
    return '<div class="exo" data-i="' + i + '">' + head + body +
           '<div class="feedback"></div></div>';
  }

  function shuffle(arr){
    for(var i = arr.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function bindExo(el, item, onDone){
    var fb = el.querySelector('.feedback');
    var answered = false;

    function finish(ok){
      if(answered) return;
      answered = true;
      fb.className = 'feedback show ' + (ok ? 'ok' : 'ko');
      fb.innerHTML = (ok ? '✅ Bonne réponse. ' : '❌ Pas tout à fait. ') + (item.why || '');
      if(onDone) onDone(ok);
    }

    if(item.t === 'qcm' || item.t === 'vf'){
      var opts = $$('.opt', el);
      opts.forEach(function(b){
        b.addEventListener('click', function(){
          if(answered) return;
          var picked = parseInt(b.dataset.i, 10);
          var correctIdx;
          if(item.t === 'vf') correctIdx = item.a ? 1 : 0;
          else correctIdx = item.c;
          opts.forEach(function(x){ x.disabled = true; });
          opts.forEach(function(x){ if(parseInt(x.dataset.i, 10) === correctIdx) x.classList.add('correct'); });
          var ok = picked === correctIdx;
          if(!ok) b.classList.add('wrong');
          finish(ok);
        });
      });
    }else if(item.t === 'fill' || item.t === 'trad'){
      var input = el.querySelector('input.txt');
      var btn = el.querySelector('.btn-check');
      var check = function(){
        if(answered) return;
        var ok = TS.answerMatches(input.value, item.a);
        input.classList.add(ok ? 'correct' : 'wrong');
        input.disabled = true; btn.disabled = true;
        if(!ok){
          var first = Array.isArray(item.a) ? item.a[0] : item.a;
          fb.dataset.sol = first;
        }
        finish(ok);
        if(!ok) fb.innerHTML += ' <b>Réponse attendue :</b> ' + esc(Array.isArray(item.a) ? item.a[0] : item.a);
      };
      btn.addEventListener('click', check);
      input.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); check(); } });
    }else if(item.t === 'order'){
      var strip = el.querySelector('.answer-strip');
      var pool = el.querySelector('.words-pool');
      $$('.word-chip', pool).forEach(function(chip){
        chip.addEventListener('click', function(){
          if(answered || chip.classList.contains('used')) return;
          chip.classList.add('used');
          var clone = document.createElement('button');
          clone.type = 'button';
          clone.className = 'word-chip';
          clone.textContent = chip.textContent;
          clone.addEventListener('click', function(){
            if(answered) return;
            clone.remove(); chip.classList.remove('used');
          });
          strip.appendChild(clone);
        });
      });
      var btns = $$('.btn-check', el);
      btns[1].addEventListener('click', function(){
        if(answered) return;
        strip.innerHTML = '';
        $$('.word-chip', pool).forEach(function(c){ c.classList.remove('used'); });
      });
      btns[0].addEventListener('click', function(){
        if(answered) return;
        var given = $$('.word-chip', strip).map(function(c){ return c.textContent; }).join(' ');
        var ok = TS.answerMatches(given, item.a);
        strip.style.borderColor = ok ? 'var(--good)' : 'var(--bad)';
        btns.forEach(function(b){ b.disabled = true; });
        finish(ok);
        if(!ok) fb.innerHTML += ' <b>Phrase attendue :</b> ' + esc(item.a);
      });
    }
  }

  function renderExoList(host, items, tag, onProgress){
    host.innerHTML = items.map(function(it, i){ return exoHTML(it, i, tag); }).join('');
    var results = new Array(items.length).fill(null);
    $$('.exo', host).forEach(function(el, i){
      bindExo(el, items[i], function(ok){
        results[i] = ok;
        if(onProgress) onProgress(results.filter(function(r){ return r === true; }).length,
                                  results.filter(function(r){ return r !== null; }).length, results);
      });
    });
    return results;
  }

  /* =======================================================
     TEST DE NIVEAU
     ======================================================= */
  var pIndex = 0, pCorrect = 0;
  function startPlacement(){
    pIndex = 0; pCorrect = 0;
    $('#progressFill').style.width = '0%';
    renderPlacementQ();
  }
  function renderPlacementQ(){
    var card = $('#quizCard');
    var Q = window.PLACEMENT;
    if(pIndex >= Q.length){ renderPlacementResult(); return; }
    var item = Q[pIndex];
    card.className = 'quiz-card flip-in';
    card.innerHTML =
      '<div class="q-count">Question ' + (pIndex + 1) + ' / ' + Q.length + ' · niveau ' + item.lvl + '</div>' +
      '<div class="q-text">' + esc(item.q) + '</div>' +
      '<div class="options">' + item.opts.map(function(o, i){
        return '<button type="button" class="option-btn" data-i="' + i + '"><span class="letter">' + LETTERS[i] + '</span>' + esc(o) + '</button>';
      }).join('') + '</div>';
    $$('.option-btn', card).forEach(function(btn){
      btn.addEventListener('click', function(){
        var buttons = $$('.option-btn', card);
        buttons.forEach(function(b){ b.disabled = true; });
        buttons[item.c].classList.add('correct');
        var i = parseInt(btn.dataset.i, 10);
        if(i !== item.c) btn.classList.add('wrong'); else pCorrect++;
        $('#progressFill').style.width = ((pIndex + 1) / Q.length * 100) + '%';
        setTimeout(function(){ pIndex++; renderPlacementQ(); }, 650);
      });
    });
    $('#progressFill').style.width = (pIndex / Q.length * 100) + '%';
  }
  function levelFromScore(s){
    if(s <= 4)  return { code:'A1', desc:"Tu poses les toutes premières briques — chaque mot compte déjà comme une victoire." };
    if(s <= 8)  return { code:'A2', desc:"Les bases sont là. Continue, ça devient de plus en plus naturel." };
    if(s <= 12) return { code:'B1', desc:"Tu peux déjà tenir une vraie conversation. La suite, c'est de la finesse." };
    if(s <= 16) return { code:'B2', desc:"Ton anglais est déjà fluide — on va le rendre encore plus brillant." };
    return { code:'C1', desc:"Impressionnant. Tu es à un cheveu de la maîtrise complète." };
  }
  function renderPlacementResult(){
    var Q = window.PLACEMENT;
    var res = levelFromScore(pCorrect);
    state.level = res.code;
    TS.persist(); greet();
    var msg = "Bonjour ! Je m'appelle " + state.name + ". Je viens de faire le test de niveau Talk & Shine et j'ai obtenu le niveau " +
              res.code + " (" + pCorrect + "/" + Q.length + "). Pouvez-vous me dire par quel cours commencer ?";
    var card = $('#quizCard');
    card.className = 'quiz-card';
    card.innerHTML =
      '<div class="result-card">' +
        '<div class="level-badge"><div class="burst" id="burst"></div>' +
          '<div class="lvl-label">TON NIVEAU CONSEILLÉ</div><div class="lvl-value">' + res.code + '</div></div>' +
        '<p class="result-quote">' + res.desc + '</p>' +
        '<p class="result-sub">Score : ' + pCorrect + ' / ' + Q.length + '. Rappel : <b>tous</b> les niveaux, cours et salles d\'examen restent ouverts, celui-ci est simplement ton meilleur point de départ.</p>' +
        '<div class="result-actions">' +
          '<a class="btn-whatsapp" target="_blank" rel="noopener" href="' + TS.waLink(msg) + '">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2z"/></svg>' +
            'Envoyer mon résultat au professeur</a>' +
          '<button type="button" class="btn-outline-navy" id="toCourses">Voir mes cours ' + res.code + '</button>' +
          '<button type="button" class="btn-outline-navy" id="toRooms">Entrer en salle d\'examen</button>' +
        '</div>' +
      '</div>';
    $('#toCourses').addEventListener('click', function(){ moduleFilter = res.code; renderModules(); showView('view-courses'); });
    $('#toRooms').addEventListener('click', function(){ currentRoom = res.code; renderRooms(); showView('view-exams'); });
    spawnBurst();
  }
  function spawnBurst(){
    var burst = $('#burst');
    if(!burst || reduced) return;
    var starPath = 'M12 2l2.6 6.6L22 11l-6.4 2.9L12 22l-2.9-8.1L2 11l7.4-2.4z';
    for(var i = 0; i < 12; i++){
      var angle = (i / 12) * Math.PI * 2, dist = 60 + Math.random() * 34;
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 24 24');
      s.setAttribute('width', 14 + Math.random() * 8);
      s.classList.add('b-star');
      s.style.left = '50%'; s.style.top = '50%';
      s.style.setProperty('--tx', 'translate(' + (Math.cos(angle) * dist) + 'px,' + (Math.sin(angle) * dist) + 'px)');
      s.style.animationDelay = (Math.random() * 0.2) + 's';
      s.innerHTML = '<path d="' + starPath + '" fill="currentColor"/>';
      burst.appendChild(s);
    }
  }

  /* =======================================================
     ACCUEIL
     ======================================================= */
  function renderHome(){
    greet();
    var g = TS.globalStats();
    $('#homeTitle').textContent = 'Bonjour ' + (state.name || 'Champion') + ' 👋';
    $('#homeSub').innerHTML = state.level
      ? 'Niveau conseillé : <b>' + state.level + '</b>. Mais tous les niveaux sont ouverts — tu peux aller où tu veux, quand tu veux.'
      : "Fais le test de niveau si tu veux un point de départ. Sinon, entre directement dans n'importe quel cours : rien n'est verrouillé.";

    $('#statGrid').innerHTML =
      statCard('Modules terminés', g.done + ' / ' + g.modules, 'Chaque module = leçon + exercices corrigés', g.percent) +
      statCard('Exercices réussis', g.good + ' / ' + TS.totalExercises(), g.exos + ' exercices déjà tentés',
               Math.round(g.good / TS.totalExercises() * 100)) +
      statCard('Devoirs rendus', String(g.devoirs) + ' / 20', 'Quatre devoirs par niveau', Math.round(g.devoirs / 20 * 100)) +
      statCard('Compositions', String(g.compos) + ' / 10', 'Deux compositions par niveau', Math.round(g.compos / 10 * 100)) +
      statCard('Examens finaux', String(g.finals) + ' / 5', 'Un examen final par niveau', Math.round(g.finals / 5 * 100));

    var grid = $('#levelGrid');
    grid.innerHTML = LEVELS.map(function(lvl){
      var s = TS.levelStats(lvl);
      var ex = TS.examOf(lvl);
      return '<button type="button" class="module-card tilt' + (lvl === state.level ? ' match' : '') + '" data-level="' + lvl + '">' +
        '<div class="module-top">' +
          '<div class="icon-badge' + (lvl === state.level ? ' gold' : '') + '" style="font-family:Poppins,sans-serif;font-weight:800;">' + lvl + '</div>' +
          '<div><div class="module-title">Niveau ' + lvl + ' — ' + esc(ex ? ex.name : '') + '</div>' +
          '<div class="module-level">' + s.modules + ' modules · ' + s.devoirs + ' devoirs · ' + s.compos + ' compositions · 1 examen</div></div>' +
        '</div>' +
        '<p class="module-desc">' + esc(ex ? ex.intro : '') + '</p>' +
        '<div class="module-progress-track"><div class="module-progress-fill" style="width:' + s.percent + '%"></div></div>' +
        '<div class="module-status"><span>' + s.done + '/' + s.modules + ' modules terminés</span>' +
          '<span class="tag-live">Ouvert</span></div>' +
      '</button>';
    }).join('');
    $$('.module-card', grid).forEach(function(c){
      attachTilt(c, 7);
      c.addEventListener('click', function(){
        moduleFilter = c.dataset.level;
        renderModules(); showView('view-courses');
      });
    });
  }
  function statCard(k, v, s, pct){
    return '<div class="stat-card"><div class="k">' + k + '</div><div class="v">' + v + '</div>' +
           '<div class="s">' + s + '</div>' +
           '<div class="ring-track"><div class="ring-fill" style="width:' + Math.max(0, Math.min(100, pct || 0)) + '%"></div></div></div>';
  }

  $('#goResume').addEventListener('click', function(){
    var id = state.lastModule || (TS.modulesOf(state.level || 'A1')[0] || {}).id;
    if(id) openLesson(id); else { renderModules(); showView('view-courses'); }
  });
  $('#goRooms').addEventListener('click', function(){ renderRooms(); showView('view-exams'); });
  $('#goTest').addEventListener('click', function(){ startPlacement(); showView('view-test'); });

  /* =======================================================
     COURS
     ======================================================= */
  var ICONS = {
    ear:'<path d="M9 15c-1.5 0-3-1.5-3-4a6 6 0 0 1 12 0c0 4-2 5-2 8a3 3 0 0 1-6 0"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    puzzle:'<path d="M20 12h-2v-2a2 2 0 0 0-2-2h-2V6a2 2 0 1 0-4 0v2H8a2 2 0 0 0-2 2v2H4v4h2a2 2 0 1 1 4 0h4a2 2 0 1 1 4 0h2z"/>',
    layers:'<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
    blocks:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    shield:'<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>',
    link:'<path d="M9 17H7a5 5 0 0 1 0-10h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><path d="M8 12h8"/>',
    chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    feather:'<path d="M20 4S9 6 6 12c-2 4-2 8-2 8s4 0 8-2c6-3 8-14 8-14z"/><path d="M4 20l7-7"/>'
  };
  var moduleFilter = 'all';
  $$('#filterRow .filter-btn').forEach(function(b){
    b.addEventListener('click', function(){
      moduleFilter = b.dataset.lvl;
      renderModules();
    });
  });

  function renderModules(){
    greet();
    $$('#filterRow .filter-btn').forEach(function(x){ x.classList.toggle('active', x.dataset.lvl === moduleFilter); });
    var list = TS.allModules().filter(function(m){ return moduleFilter === 'all' || m.level === moduleFilter; });
    $('#coursesSub').textContent = list.length + ' modules affichés — leçon complète, exemples audio et exercices corrigés dans chacun.';
    var grid = $('#moduleGrid');
    grid.innerHTML = list.map(function(m, idx){
      var p = TS.moduleProgress(m.id);
      var pct = p ? Math.round((p.score || 0) / (p.total || m.exercises.length) * 100) : 0;
      var match = m.level === state.level;
      return '<button type="button" class="module-card tilt' + (match ? ' match' : '') + '" data-mod="' + m.id + '">' +
        '<div class="module-top">' +
          '<div class="icon-badge' + (idx % 3 === 0 ? ' gold' : '') + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="' + (idx % 3 === 0 ? '#0E1B33' : '#fff') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[m.icon] || ICONS.book) + '</svg>' +
          '</div>' +
          '<div><div class="module-title">' + esc(m.title) + '</div>' +
          '<div class="module-level">Niveau ' + m.level + ' · ' + esc(m.duration) + (match ? ' · conseillé pour toi' : '') + '</div></div>' +
        '</div>' +
        '<p class="module-desc">' + m.goal.replace(/<[^>]+>/g, '') + '</p>' +
        '<div class="module-progress-track"><div class="module-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="module-status"><span>' + (p ? p.score + '/' + p.total + ' exercices réussis' : m.exercises.length + ' exercices') + '</span>' +
          (p && p.done ? '<span class="tag-done">Terminé</span>' : '<span class="tag-live">Leçon disponible</span>') + '</div>' +
      '</button>';
    }).join('');
    $$('.module-card', grid).forEach(function(c){
      attachTilt(c, 7);
      c.addEventListener('click', function(){ openLesson(c.dataset.mod); });
    });
  }

  /* =======================================================
     LEÇON
     ======================================================= */
  function sectionHTML(s){
    if(s.t === 'text')  return '<div class="sec">' + (s.h ? '<h3>' + esc(s.h) + '</h3>' : '') + '<p>' + s.p + '</p></div>';
    if(s.t === 'tip')   return '<div class="sec tip"><p>' + s.p + '</p></div>';
    if(s.t === 'table') return '<div class="sec">' + (s.h ? '<h3>' + esc(s.h) + '</h3>' : '') +
      '<div class="tbl-wrap"><table><thead><tr>' + s.head.map(function(h){ return '<th>' + h + '</th>'; }).join('') +
      '</tr></thead><tbody>' + s.rows.map(function(r){
        return '<tr>' + r.map(function(c){ return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div></div>';
    if(s.t === 'ex')    return '<div class="sec"><h3>' + esc(s.h || 'Exemples') + '</h3>' + s.items.map(function(it){
        return '<div class="ex-line">' +
          '<button type="button" class="say-btn" data-say="' + esc(it[0]) + '" aria-label="Écouter">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>' +
          '</button>' +
          '<span class="en">' + esc(it[0]) + '</span><span class="fr">' + esc(it[1]) + '</span></div>';
      }).join('') + '</div>';
    if(s.t === 'vocab') return '<div class="sec"><h3>' + esc(s.h || 'Vocabulaire') + '</h3><div class="vocab-grid">' +
      s.items.map(function(it){
        return '<div class="vocab-item">' +
          '<button type="button" class="say-btn" data-say="' + esc(it[0]) + '" aria-label="Écouter">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>' +
          '</button><span><b>' + esc(it[0]) + '</b><br><i>' + esc(it[1]) + '</i></span></div>';
      }).join('') + '</div></div>';
    return '';
  }

  function openLesson(id){
    var m = TS.moduleById(id);
    if(!m){ TS.toast('Module introuvable.', 'err'); return; }
    state.lastModule = id; TS.persist();

    var host = $('#lessonShell');
    var mods = TS.modulesOf(m.level);
    var pos = mods.map(function(x){ return x.id; }).indexOf(id);
    var next = mods[pos + 1] || null;

    host.innerHTML =
      '<button type="button" class="btn-outline-navy" id="lessonBack" style="margin-bottom:16px;">← Retour aux cours</button>' +
      '<div class="lesson-head">' +
        '<div class="eyebrow" style="color:var(--gold-2)">NIVEAU ' + m.level + ' · MODULE ' + (pos + 1) + '/' + mods.length + '</div>' +
        '<h2>' + esc(m.title) + '</h2>' +
        '<p class="goal">' + m.goal + '</p>' +
        '<div class="meta"><span>⏱️ ' + esc(m.duration) + '</span><span>📝 ' + m.exercises.length + ' exercices</span><span>🔊 Prononciation intégrée</span></div>' +
      '</div>' +
      m.sections.map(sectionHTML).join('') +
      '<div class="exo-head"><h3>Exercices corrigés</h3><span class="exo-score" id="exoScore">0 / ' + m.exercises.length + '</span></div>' +
      '<div id="exoHost"></div>' +
      '<div class="lesson-footer">' +
        '<button type="button" class="btn-outline-navy" id="lessonBack2">← Cours</button>' +
        (next ? '<button type="button" class="btn-gold-sm" id="lessonNext">Module suivant : ' + esc(next.title) + ' →</button>'
              : '<button type="button" class="btn-gold-sm" id="lessonRoom">Passer à la salle d\'examen ' + m.level + ' →</button>') +
      '</div>';

    var total = m.exercises.length;
    renderExoList($('#exoHost'), m.exercises, 'Exercice', function(good, answered){
      $('#exoScore').textContent = good + ' / ' + total;
      state.progress[m.id] = { score: good, total: total, done: answered >= total };
      TS.persist();
      if(answered >= total){
        TS.toast('Module terminé : ' + good + '/' + total + ' — ' + (good >= total * 0.7 ? 'excellent travail !' : 'refais les exercices ratés pour consolider.'),
                 good >= total * 0.7 ? 'ok' : '');
      }
    });

    $$('[data-say]', host).forEach(function(b){
      b.addEventListener('click', function(){ TS.speak(b.dataset.say); });
    });
    $('#lessonBack').addEventListener('click', backToCourses);
    $('#lessonBack2').addEventListener('click', backToCourses);
    if(next) $('#lessonNext').addEventListener('click', function(){ openLesson(next.id); });
    else $('#lessonRoom').addEventListener('click', function(){ currentRoom = m.level; renderRooms(); showView('view-exams'); });

    showView('view-lesson');
  }
  function backToCourses(){ renderModules(); showView('view-courses'); }

  /* =======================================================
     SALLE D'EXAMEN
     ======================================================= */
  var currentRoom = null;

  function renderRooms(){
    greet();
    if(!currentRoom) currentRoom = state.level || 'A1';
    $('#roomTabs').innerHTML = LEVELS.map(function(l){
      return '<button type="button" class="room-tab' + (l === currentRoom ? ' active' : '') + '" data-room="' + l + '">Salle ' + l + '</button>';
    }).join('');
    $$('#roomTabs .room-tab').forEach(function(b){
      b.addEventListener('click', function(){ currentRoom = b.dataset.room; renderRooms(); });
    });
    renderRoom(currentRoom);
  }

  function renderRoom(lvl){
    var ex = TS.examOf(lvl);
    var s = TS.levelStats(lvl);
    var fin = state.finals[lvl];
    var body = $('#roomBody');

    body.innerHTML =
      '<div class="classroom">' +
        '<div class="cr-wall"></div>' +
        '<div class="cr-light"></div>' +
        '<div class="cr-board">' +
          '<div class="cb-lvl">SALLE ' + lvl + '</div>' +
          '<div class="cb-name">' + esc(ex.name) + '</div>' +
          '<div class="cb-chalk">' + esc(ex.intro) + '</div>' +
        '</div>' +
        '<div class="cr-floor"></div>' +
        '<div class="cr-desk d1"></div><div class="cr-desk d2"></div><div class="cr-desk d3"></div>' +
        '<div class="cr-badge">Professeur présent · WhatsApp</div>' +
        '<div class="cr-open">Porte ouverte</div>' +
      '</div>' +

      '<div class="station-grid">' +
        station('devoirs', 'Devoirs', ex.devoirs.length + ' devoirs à faire à ton rythme, corrigés immédiatement, sans chronomètre.',
          ex.devoirs.map(function(d){
            var r = state.devoirs[d.id];
            return taskHTML('devoir', d.id, d.title, d.questions.length + ' questions · ' + d.points + ' points', r);
          }).join('')) +
        station('compos', 'Compositions', ex.compositions.length + ' compositions complètes : grammaire, vocabulaire, compréhension écrite et expression écrite.',
          ex.compositions.map(function(c){
            var r = state.compos[c.id];
            return taskHTML('compo', c.id, c.title, c.duration + ' · noté sur ' + c.total, r);
          }).join('')) +
        station('final', 'Examen final', 'Épreuve chronométrée de ' + ex.final.questions.length + ' questions, ' + CFG.secondsPerQuestion + ' s par question. Réussite à ' + Math.round(CFG.passRate * 100) + ' %.',
          '<button type="button" class="task" data-final="' + lvl + '">' +
            '<span><span class="tt">' + esc(ex.final.title) + '</span><br><span class="ts">' + ex.final.questions.length + ' questions · ' + esc(ex.final.minutes) + '</span></span>' +
            (fin ? '<span class="badge-score ' + (fin.best >= Math.ceil(fin.total * CFG.passRate) ? 'ok' : 'ko') + '">Record ' + fin.best + '/' + fin.total + '</span>'
                 : '<span class="badge-score">Jamais tenté</span>') +
          '</button>' +
          '<p style="margin-top:14px;font-size:.84rem;color:var(--muted)">Progression du niveau ' + lvl + ' : ' +
            s.done + '/' + s.modules + ' modules, ' + s.devoirsDone + '/' + s.devoirs + ' devoirs, ' + s.composDone + '/' + s.compos + ' compositions.</p>') +
      '</div>';

    $$('[data-devoir]', body).forEach(function(b){
      b.addEventListener('click', function(){ openDevoir(lvl, b.dataset.devoir); });
    });
    $$('[data-compo]', body).forEach(function(b){
      b.addEventListener('click', function(){ openCompo(lvl, b.dataset.compo); });
    });
    $$('[data-final]', body).forEach(function(b){
      b.addEventListener('click', function(){ startExam(b.dataset.final); });
    });
  }

  function station(kind, title, sub, inner){
    var ic = kind === 'devoirs'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>'
      : kind === 'compos'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>';
    return '<div class="station">' +
      '<h3><span class="ic' + (kind === 'final' ? ' gold' : '') + '">' + ic + '</span>' + title + '</h3>' +
      '<p>' + esc(sub) + '</p>' +
      '<div class="task-list">' + inner + '</div></div>';
  }

  function taskHTML(kind, id, title, sub, r){
    var badge = r
      ? '<span class="badge-score ' + (r.score >= r.total * CFG.passRate ? 'ok' : 'ko') + '">' + r.score + '/' + r.total + '</span>'
      : '<span class="badge-score">À faire</span>';
    return '<button type="button" class="task" data-' + kind + '="' + id + '">' +
      '<span><span class="tt">' + esc(title) + '</span><br><span class="ts">' + esc(sub) + '</span></span>' + badge + '</button>';
  }

  /* =======================================================
     DEVOIR
     ======================================================= */
  function openDevoir(lvl, id){
    var ex = TS.examOf(lvl);
    var d = ex.devoirs.filter(function(x){ return x.id === id; })[0];
    if(!d) return;
    var host = $('#paperShell');
    host.innerHTML =
      '<button type="button" class="btn-outline-navy" id="paperBack" style="margin-bottom:16px;">← Retour à la salle ' + lvl + '</button>' +
      '<div class="paper-head">' +
        '<h2>' + esc(d.title) + '</h2>' +
        '<p class="sub">Salle ' + lvl + ' — ' + esc(ex.name) + '. Corrigé immédiat, avec l\'explication de chaque réponse. Tu peux le refaire autant de fois que tu veux.</p>' +
        '<div class="chips"><span>' + d.questions.length + ' questions</span><span>Sans chronomètre</span><span>Noté sur ' + d.points + '</span>' +
        (d.modules ? '<span>Cours liés : ' + d.modules.map(function(mid){
            var m = TS.moduleById(mid); return m ? esc(m.title) : mid;
          }).join(' · ') + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="exo-head"><h3>Questions</h3><span class="exo-score" id="paperScore">0 / ' + d.questions.length + '</span></div>' +
      '<div id="paperHost"></div>' +
      '<div class="paper-actions" id="paperActions"></div>';

    var total = d.questions.length;
    renderExoList($('#paperHost'), d.questions, 'Question', function(good, answered){
      $('#paperScore').textContent = good + ' / ' + total;
      if(answered >= total) finishDevoir(lvl, d, good, total);
    });
    $('#paperBack').addEventListener('click', function(){ currentRoom = lvl; renderRooms(); showView('view-exams'); });
    showView('view-paper');
  }

  function finishDevoir(lvl, d, good, total){
    state.devoirs[d.id] = { score: good, total: total, date: Date.now() };
    TS.persist();
    var pct = Math.round(good / total * 100);
    var passed = good >= total * CFG.passRate;
    var msg = "Bonjour ! Je m'appelle " + state.name + ". Je viens de rendre le « " + d.title + " » (salle " + lvl + ") sur Talk & Shine : " + good + "/" + total + " (" + pct + "%).";
    var box = $('#paperActions');
    box.innerHTML =
      '<div style="width:100%"><div class="grade-card"><div class="g">' + good + ' / ' + total + '</div>' +
      '<div class="gl">' + (passed ? 'Devoir validé — ' + pct + ' %. ' + (pct === 100 ? 'Sans faute, bravo.' : 'Relis les explications des questions ratées.')
                                   : 'Devoir non validé (' + pct + ' %). Refais-le après avoir relu la leçon.') + '</div></div>' +
      '<div class="paper-actions">' +
        '<a class="btn-whatsapp" target="_blank" rel="noopener" href="' + TS.waLink(msg) + '">Envoyer au professeur</a>' +
        '<button type="button" class="btn-outline-navy" id="redoDevoir">Refaire ce devoir</button>' +
        '<button type="button" class="btn-outline-navy" id="backRoom2">Retour à la salle</button>' +
      '</div></div>';
    $('#redoDevoir').addEventListener('click', function(){ openDevoir(lvl, d.id); });
    $('#backRoom2').addEventListener('click', function(){ currentRoom = lvl; renderRooms(); showView('view-exams'); });
    box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'center' });
    TS.toast(passed ? 'Devoir validé : ' + good + '/' + total : 'Devoir terminé : ' + good + '/' + total, passed ? 'ok' : '');
  }

  /* =======================================================
     COMPOSITION
     ======================================================= */
  function openCompo(lvl, id){
    var ex = TS.examOf(lvl);
    var c = ex.compositions.filter(function(x){ return x.id === id; })[0];
    if(!c) return;
    var saved = state.compos[c.id] || null;
    var host = $('#paperShell');

    var html =
      '<button type="button" class="btn-outline-navy" id="paperBack" style="margin-bottom:16px;">← Retour à la salle ' + lvl + '</button>' +
      '<div class="paper-head">' +
        '<h2>' + esc(c.title) + '</h2>' +
        '<p class="sub">Salle ' + lvl + ' — ' + esc(ex.name) + '. Épreuve complète : grammaire, vocabulaire, compréhension écrite et expression écrite.</p>' +
        '<div class="chips"><span>Durée conseillée : ' + esc(c.duration) + '</span><span>Noté sur ' + c.total + '</span><span>Correction automatique + auto-évaluation</span></div>' +
      '</div>';

    var autoItems = [];   // toutes les questions auto-corrigées
    c.parts.forEach(function(p, pi){
      html += '<div class="part-title">' + esc(p.title) + '</div>';
      if(p.t === 'part' || p.t === 'reading'){
        if(p.t === 'reading') html += '<div class="read-text">' + esc(p.text) + '</div>';
        html += '<div id="cpart-' + pi + '"></div>';
        p.items.forEach(function(it){ autoItems.push(it); });
      }else if(p.t === 'writing'){
        html += '<div class="write-box">' +
          '<p style="font-size:.95rem;color:#37415C;margin-bottom:12px;">' + esc(p.prompt) + '</p>' +
          '<textarea id="writeArea" placeholder="Écris ton texte en anglais ici…">' + esc(saved && saved.text ? saved.text : '') + '</textarea>' +
          '<div class="write-meta"><span class="word-count" id="wordCount">0 mot</span>' +
          '<span style="font-size:.82rem;color:var(--muted)">Minimum demandé : ' + p.minWords + ' mots</span></div>' +
          '<p style="margin-top:14px;font-weight:800;font-size:.86rem;color:var(--navy)">Grille d\'auto-évaluation — coche ce que ton texte respecte :</p>' +
          '<div class="criteria">' + p.criteria.map(function(cr, k){
            return '<label><input type="checkbox" class="crit" data-k="' + k + '"><span>' + esc(cr) + '</span></label>';
          }).join('') + '</div></div>';
      }
    });

    html += '<div class="paper-actions">' +
      '<button type="button" class="btn-gold-sm" id="submitCompo">Rendre ma composition</button>' +
      '<button type="button" class="btn-outline-navy" id="backRoom3">Retour à la salle</button>' +
      '</div><div id="compoResult"></div>';

    host.innerHTML = html;

    /* rendu des parties auto-corrigées */
    var partResults = [];
    c.parts.forEach(function(p, pi){
      if(p.t === 'part' || p.t === 'reading'){
        var h = document.getElementById('cpart-' + pi);
        var res = renderExoList(h, p.items, 'Question', null);
        partResults.push(res);
      }
    });

    /* compteur de mots */
    var area = $('#writeArea');
    if(area){
      var refresh = function(){
        var n = TS.countWords(area.value);
        var wc = $('#wordCount');
        var need = (c.parts.filter(function(p){ return p.t === 'writing'; })[0] || {}).minWords || 0;
        wc.textContent = n + (n > 1 ? ' mots' : ' mot');
        wc.classList.toggle('ok', n >= need);
      };
      area.addEventListener('input', refresh);
      refresh();
    }

    $('#paperBack').addEventListener('click', function(){ currentRoom = lvl; renderRooms(); showView('view-exams'); });
    $('#backRoom3').addEventListener('click', function(){ currentRoom = lvl; renderRooms(); showView('view-exams'); });
    $('#submitCompo').addEventListener('click', function(){
      submitCompo(lvl, c, partResults, autoItems.length);
    });
    showView('view-paper');
  }

  function submitCompo(lvl, c, partResults, autoTotal){
    var good = 0, answered = 0;
    partResults.forEach(function(res){
      res.forEach(function(r){
        if(r !== null){ answered++; if(r) good++; }
      });
    });
    var writing = c.parts.filter(function(p){ return p.t === 'writing'; })[0];
    var area = $('#writeArea');
    var text = area ? area.value.trim() : '';
    var words = TS.countWords(text);
    var crits = $$('.crit').filter(function(i){ return i.checked; }).length;
    var critTotal = writing ? writing.criteria.length : 0;

    if(answered < autoTotal){
      TS.toast('Il reste ' + (autoTotal - answered) + ' question(s) sans réponse. Tu peux quand même rendre : elles comptent comme fausses.');
    }
    if(writing && words < writing.minWords){
      TS.toast('Ton texte fait ' + words + ' mots sur ' + writing.minWords + ' demandés. Il est enregistré tel quel.');
    }

    /* barème : questions auto = 15 points, expression écrite = 5 points */
    var autoPts = autoTotal ? (good / autoTotal) * 15 : 0;
    var writePts = 0;
    if(writing){
      var lengthPart = Math.min(1, words / writing.minWords) * 2.5;
      var critPart = critTotal ? (crits / critTotal) * 2.5 : 0;
      writePts = lengthPart + critPart;
    }
    var note = Math.round((autoPts + writePts) * 10) / 10;

    state.compos[c.id] = { score: Math.round(note), total: c.total, date: Date.now(), text: text, self: crits, words: words };
    TS.persist();

    var msg = "Bonjour ! Je m'appelle " + state.name + ". Voici ma " + c.title + " (salle " + lvl + ") : " +
              good + "/" + autoTotal + " aux questions, " + words + " mots à l'expression écrite. Note automatique : " + note + "/" + c.total +
              ". Pouvez-vous corriger mon texte ?\n\n--- MON TEXTE ---\n" + (text || '(texte non rédigé)');

    $('#compoResult').innerHTML =
      '<div class="grade-card"><div class="g">' + note + ' / ' + c.total + '</div>' +
      '<div class="gl">Questions : ' + good + '/' + autoTotal + ' · Expression écrite : ' + words + ' mots, ' + crits + '/' + critTotal + ' critères cochés</div></div>' +
      '<p style="font-size:.88rem;color:var(--muted);margin-bottom:14px;">La partie « expression écrite » ne peut pas être notée par la machine : envoie ton texte au professeur pour une vraie correction. Ta copie est enregistrée sur cet appareil.</p>' +
      '<div class="paper-actions">' +
        '<a class="btn-whatsapp" target="_blank" rel="noopener" href="' + TS.waLink(msg) + '">Envoyer ma copie au professeur</a>' +
        '<button type="button" class="btn-outline-navy" id="redoCompo">Refaire la composition</button>' +
        '<button type="button" class="btn-outline-navy" id="backRoom4">Retour à la salle</button>' +
      '</div>';
    $('#redoCompo').addEventListener('click', function(){ openCompo(lvl, c.id); });
    $('#backRoom4').addEventListener('click', function(){ currentRoom = lvl; renderRooms(); showView('view-exams'); });
    $('#compoResult').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'start' });
    TS.toast('Composition rendue : ' + note + '/' + c.total, note >= c.total * CFG.passRate ? 'ok' : '');
  }

  /* =======================================================
     EXAMEN FINAL CHRONOMÉTRÉ
     ======================================================= */
  var exam = null, examTimer = null;
  var CIRC = 2 * Math.PI * 24;
  $('#timerCircle').style.strokeDasharray = CIRC;

  function startExam(lvl){
    var ex = TS.examOf(lvl);
    exam = { lvl: lvl, bank: ex.final.questions, i: 0, score: 0, answers: [], left: CFG.secondsPerQuestion };
    $('#examRoomChip').textContent = 'Salle ' + lvl + ' — ' + ex.name;
    showView('view-exam-run');
    renderExamQuestion();
  }
  function stopExam(){ clearInterval(examTimer); examTimer = null; }
  function paintTimer(){
    var pct = exam.left / CFG.secondsPerQuestion;
    $('#timerCircle').style.strokeDashoffset = CIRC * (1 - pct);
    $('#timerText').textContent = exam.left;
    $('#timerRing').classList.toggle('danger', exam.left <= 8);
  }
  function tick(){
    exam.left--;
    paintTimer();
    if(exam.left <= 0){ stopExam(); answerExam(-1); }
  }
  function renderExamQuestion(){
    stopExam();
    if(!exam) return;
    if(exam.i >= exam.bank.length){ renderExamResult(); return; }
    var item = exam.bank[exam.i];
    var card = $('#examCard');
    card.className = 'quiz-card flip-in';
    card.innerHTML =
      '<div class="q-count">Question ' + (exam.i + 1) + ' / ' + exam.bank.length + '</div>' +
      '<div class="q-text">' + item.q + '</div>' +
      '<div class="options">' + item.opts.map(function(o, i){
        return '<button type="button" class="option-btn" data-i="' + i + '"><span class="letter">' + LETTERS[i] + '</span>' + esc(o) + '</button>';
      }).join('') + '</div>';
    $$('.option-btn', card).forEach(function(b){
      b.addEventListener('click', function(){ stopExam(); answerExam(parseInt(b.dataset.i, 10)); });
    });
    $('#examProgress').style.width = (exam.i / exam.bank.length * 100) + '%';
    $('#examScoreChip').textContent = exam.score + (exam.score > 1 ? ' bonnes réponses' : ' bonne réponse');
    exam.left = CFG.secondsPerQuestion; paintTimer();
    examTimer = setInterval(tick, 1000);
  }
  function answerExam(choice){
    var item = exam.bank[exam.i];
    var buttons = $$('.option-btn', $('#examCard'));
    buttons.forEach(function(b){ b.disabled = true; });
    if(buttons[item.c]) buttons[item.c].classList.add('correct');
    if(choice === -1) TS.toast('Temps écoulé pour cette question.');
    else if(choice !== item.c) buttons[choice].classList.add('wrong');
    else exam.score++;
    exam.answers.push({ q: item.q, given: choice === -1 ? null : item.opts[choice], good: item.opts[item.c], ok: choice === item.c, why: item.why || '' });
    $('#examProgress').style.width = ((exam.i + 1) / exam.bank.length * 100) + '%';
    $('#examScoreChip').textContent = exam.score + (exam.score > 1 ? ' bonnes réponses' : ' bonne réponse');
    setTimeout(function(){ exam.i++; renderExamQuestion(); }, 850);
  }
  function renderExamResult(){
    stopExam();
    var total = exam.bank.length;
    var need = Math.ceil(total * CFG.passRate);
    var passed = exam.score >= need;
    var lvl = exam.lvl;
    var prev = state.finals[lvl];
    if(!prev || exam.score > prev.best) state.finals[lvl] = { best: exam.score, total: total, date: Date.now() };
    TS.persist();

    var pct = Math.round(exam.score / total * 100);
    var msg = "Bonjour ! Je m'appelle " + state.name + ". Je viens de passer l'examen final de la salle " + lvl +
              " sur Talk & Shine : " + exam.score + "/" + total + " (" + pct + "%).";
    var idx = LEVELS.indexOf(lvl), next = LEVELS[idx + 1];

    var card = $('#examCard');
    card.className = 'quiz-card';
    card.innerHTML =
      '<div class="certificate">' +
        '<div class="cert-seal ' + (passed ? 'ok' : 'ko') + '"><span>' + pct + '%</span><small>' + lvl + '</small></div>' +
        '<h3 class="cert-title">' + (passed ? 'Examen ' + lvl + ' réussi' : 'Presque — retente la salle ' + lvl) + '</h3>' +
        '<p class="cert-sub">' + exam.score + ' bonnes réponses sur ' + total + '. Il en faut ' + need + ' pour valider. ' +
          (passed ? (next ? 'Continue avec la salle ' + next + ' quand tu veux.' : 'Tu as terminé le parcours complet. Bravo, champion.')
                  : 'Revois les corrections ci-dessous et reviens quand tu veux : la salle reste ouverte.') + '</p>' +
        '<div class="result-actions">' +
          '<a class="btn-whatsapp" target="_blank" rel="noopener" href="' + TS.waLink(msg) + '">Envoyer mon résultat au professeur</a>' +
          '<button type="button" class="btn-outline-navy" id="retryExam">Repasser cet examen</button>' +
          '<button type="button" class="btn-outline-navy" id="backRooms">Retour aux salles</button>' +
        '</div>' +
        '<div class="review-list">' + exam.answers.map(function(a, i){
          return '<div class="review-item"><div class="rq">' + (i + 1) + '. ' + a.q + '</div>' +
            '<div class="ra">' + (a.ok ? 'Ta réponse : <b>' + esc(a.good) + '</b>'
              : 'Ta réponse : <i>' + esc(a.given || 'aucune') + '</i> · correcte : <b>' + esc(a.good) + '</b>') +
            (a.why ? '<br><span style="color:var(--muted)">' + a.why + '</span>' : '') + '</div></div>';
        }).join('') + '</div>' +
      '</div>';
    $('#examProgress').style.width = '100%';
    $('#retryExam').addEventListener('click', function(){ startExam(lvl); });
    $('#backRooms').addEventListener('click', function(){ currentRoom = lvl; renderRooms(); showView('view-exams'); });
    if(passed) TS.toast('Salle ' + lvl + ' validée : ' + exam.score + '/' + total + ' !', 'ok');
  }
  $('#examBack').addEventListener('click', function(){
    stopExam(); currentRoom = exam ? exam.lvl : currentRoom; renderRooms(); showView('view-exams');
  });

  /* =======================================================
     SESSION
     ======================================================= */
  $('#logoutBtn').addEventListener('click', function(){
    TS.persist(); TS.clearSession(); stopExam();
    TS.resetState();
    if(window.FA_auth) FA_auth.setMode('login');
    $('#password').value = ''; $('#password2').value = '';
    showView('view-auth');
    TS.toast('Tu es déconnecté. À bientôt !');
  });

  function afterAuth(){
    greet();
    currentRoom = state.level || 'A1';
    renderHome();
    showView('view-home');
  }

  (function boot(){
    var email = TS.readSession();
    if(email){
      var u = TS.loadDB()[email];
      if(u){ TS.loadUser(u); afterAuth(); return; }
      TS.clearSession();
    }
    var g = TS.readGuestCache();
    if(g && g.guest && g.name){
      Object.keys(g).forEach(function(k){ state[k] = g[k]; });
      afterAuth(); return;
    }
    showView('view-auth');
  })();

  return { afterAuth: afterAuth, showView: showView, openLesson: openLesson };
})();
