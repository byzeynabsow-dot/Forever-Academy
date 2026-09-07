/* =========================================================
   Forever Academy — état, stockage local et utilitaires
   ========================================================= */
window.TS = (function(){
  'use strict';

  var CFG = window.TS_CONFIG, cfg = CFG;
  var DB_KEY = 'fa_users_v2', SESS_KEY = 'fa_session_v2';

  function $(s, c){ return (c || document).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function escapeHTML(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function safeParse(raw, fb){ try{ return raw ? JSON.parse(raw) : fb; }catch(e){ return fb; } }
  function loadDB(){ try{ return safeParse(localStorage.getItem(DB_KEY), {}); }catch(e){ return {}; } }
  function saveDB(db){ try{ localStorage.setItem(DB_KEY, JSON.stringify(db)); }catch(e){} }
  /* ---------- mots de passe ----------
     Les comptes vivent dans le navigateur : il n'y a pas de serveur pour
     les vérifier. On stocke donc une empreinte PBKDF2-SHA256 (150 000
     itérations, sel aléatoire par compte) et jamais le mot de passe.
     Quelqu'un qui lit le stockage de l'appareil ne peut pas le relire.

     Web Crypto exige une origine sûre (https ou localhost). Ouvert en
     fichier local, on retombe sur l'ancien encodage — sécurité moindre,
     signalée par le champ `weak`. */
  var PBKDF2_ITER = 150000;

  function hasSubtle(){
    return !!(window.crypto && window.crypto.subtle && window.crypto.getRandomValues);
  }
  function toHex(buf){
    return Array.prototype.map.call(new Uint8Array(buf), function(b){
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }
  function fromHex(hex){
    var out = new Uint8Array(hex.length / 2);
    for(var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }
  function legacyScramble(txt){
    try{ return btoa(unescape(encodeURIComponent('fa::' + txt))); }catch(e){ return 'fa::' + txt; }
  }

  function derive(password, salt, iter){
    return window.crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
    ).then(function(key){
      return window.crypto.subtle.deriveBits(
        { name:'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, key, 256
      );
    });
  }

  /* Fabrique l'enregistrement à stocker pour un nouveau mot de passe. */
  function makePasswordRecord(password){
    if(!hasSubtle()){
      return Promise.resolve({ weak: true, legacy: legacyScramble(password) });
    }
    var salt = window.crypto.getRandomValues(new Uint8Array(16));
    return derive(password, salt, PBKDF2_ITER).then(function(bits){
      return { alg:'PBKDF2-SHA256', iter: PBKDF2_ITER, salt: toHex(salt), hash: toHex(bits) };
    });
  }

  /* Vérifie un mot de passe contre l'enregistrement stocké.
     Accepte les anciens comptes en base64 pour ne perdre personne :
     ils sont réencodés au premier login réussi. */
  function verifyPassword(password, user){
    var rec = user && user.pw;
    if(!rec){
      // compte créé avant cette version : champ `pass` en base64
      if(user && user.pass) return Promise.resolve({ ok: user.pass === legacyScramble(password), upgrade: true });
      return Promise.resolve({ ok: false });
    }
    if(rec.weak || !rec.hash){
      return Promise.resolve({ ok: rec.legacy === legacyScramble(password), upgrade: hasSubtle() });
    }
    if(!hasSubtle()) return Promise.resolve({ ok: false, noCrypto: true });
    return derive(password, fromHex(rec.salt), rec.iter || PBKDF2_ITER).then(function(bits){
      return { ok: timingSafeEqual(toHex(bits), rec.hash) };
    });
  }

  /* Comparaison à durée constante : on ne veut pas qu'un attaquant
     déduise le préfixe correct à partir du temps de réponse. */
  function timingSafeEqual(a, b){
    if(typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    var diff = 0;
    for(var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  var state = blankState();
  function blankState(){
    return {
      name:'', email:'', level:'', guest:true, provider:'local',
      progress:{},   // moduleId -> {score,total,done}
      granted:{},    // niveau -> true : accès ouvert par le professeur
      devoirs:{},    // devoirId -> {score,total,date}
      compos:{},     // compoId  -> {score,total,date,text,self}
      finals:{},     // niveau   -> {best,total,date}
      lastModule:''
    };
  }

  function persist(){
    // Compte en ligne : la progression part aussi sur le serveur, pour
    // suivre l'élève d'un appareil à l'autre.
    if(window.Account && Account.isServer() && !state.guest) Account.schedulePush(state);
    if(state.guest || !state.email) { sessionCache(); return; }
    var db = loadDB();
    var u = db[state.email] || {};
    u.name = state.name; u.email = state.email; u.level = state.level;
    u.provider = state.provider;
    u.progress = state.progress; u.granted = state.granted; u.devoirs = state.devoirs;
    u.compos = state.compos; u.finals = state.finals; u.lastModule = state.lastModule;
    db[state.email] = u; saveDB(db);
  }
  /* un invité garde quand même sa progression le temps de l'onglet */
  function sessionCache(){
    try{ sessionStorage.setItem('fa_guest_state', JSON.stringify(state)); }catch(e){}
  }
  function readGuestCache(){
    try{ return safeParse(sessionStorage.getItem('fa_guest_state'), null); }catch(e){ return null; }
  }

  function loadUser(u){
    state.name = u.name || 'Champion';
    state.email = u.email || '';
    state.level = u.level || '';
    state.provider = u.provider || 'local';
    state.progress = u.progress || {};
    state.granted = u.granted || {};
    state.devoirs = u.devoirs || {};
    state.compos = u.compos || {};
    state.finals = u.finals || {};
    state.lastModule = u.lastModule || '';
    state.guest = false;
  }

  function setSession(email, remember){
    try{
      (remember ? localStorage : sessionStorage).setItem(SESS_KEY, email);
      (remember ? sessionStorage : localStorage).removeItem(SESS_KEY);
    }catch(e){}
  }
  function clearSession(){
    try{ localStorage.removeItem(SESS_KEY); sessionStorage.removeItem(SESS_KEY); sessionStorage.removeItem('fa_guest_state'); }catch(e){}
  }
  function readSession(){
    try{ return localStorage.getItem(SESS_KEY) || sessionStorage.getItem(SESS_KEY); }catch(e){ return null; }
  }

  /* ---------- toast ---------- */
  var toastTimer = null;
  function toast(msg, kind){
    var el = $('#toast');
    if(!el) return;
    el.textContent = msg;
    el.className = 'show' + (kind ? ' ' + kind : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.className = ''; }, 3400);
  }

  /* ---------- comparaison de réponses libres ---------- */
  function normalize(v){
    return String(v == null ? '' : v)
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[.!?;:,]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function answerMatches(given, accepted){
    var g = normalize(given);
    if(!g) return false;
    var list = Array.isArray(accepted) ? accepted : [accepted];
    for(var i = 0; i < list.length; i++){
      if(g === normalize(list[i])) return true;
    }
    return false;
  }
  function countWords(txt){
    var t = String(txt || '').trim();
    if(!t) return 0;
    return t.split(/\s+/).length;
  }

  /* ---------- catalogue ---------- */
  function levels(){ return CFG.levels.slice(); }
  function modulesOf(lvl){ return (window.COURSES[lvl] || []).map(function(m){ m.level = lvl; return m; }); }
  function allModules(){
    var out = [];
    levels().forEach(function(l){ out = out.concat(modulesOf(l)); });
    return out;
  }
  function moduleById(id){
    var all = allModules();
    for(var i = 0; i < all.length; i++){ if(all[i].id === id) return all[i]; }
    return null;
  }
  function examOf(lvl){ return window.EXAMS[lvl]; }

  function moduleProgress(id){ return state.progress[id] || null; }

  /* ---------- accès aux cours ----------
     Un module s'ouvre quand :
       • c'est le premier de son niveau, OU
       • le module précédent est terminé avec au moins 70 % de réussite, OU
       • le professeur a ouvert le niveau (code d'accès).
     Le reste du site — SHINE, examens, test de niveau, messages — ne
     dépend jamais de cette règle. */
  var PASS = 0.7;

  function moduleDone(id){
    var p = state.progress[id];
    if(!p || !p.done) return false;
    return (p.score || 0) >= Math.ceil((p.total || 1) * PASS);
  }

  function levelGranted(lvl){ return !!state.granted[lvl]; }

  function moduleUnlocked(id){
    var mods = null, lvl = null, idx = -1;
    var lv = levels();
    for(var i = 0; i < lv.length && idx < 0; i++){
      var list = modulesOf(lv[i]);
      for(var j = 0; j < list.length; j++){
        if(list[j].id === id){ mods = list; lvl = lv[i]; idx = j; break; }
      }
    }
    if(idx < 0) return true;
    if(levelGranted(lvl)) return true;
    if(idx === 0) return true;
    return moduleDone(mods[idx - 1].id);
  }

  /* Pourquoi un module est fermé, en clair pour l'apprenant. */
  function lockReason(id){
    var lv = levels();
    for(var i = 0; i < lv.length; i++){
      var list = modulesOf(lv[i]);
      for(var j = 0; j < list.length; j++){
        if(list[j].id === id){
          if(j === 0) return '';
          var prev = list[j - 1];
          var p = state.progress[prev.id];
          var need = Math.ceil((prev.exercises.length) * PASS);
          if(!p) return 'Termine « ' + prev.title +' » (au moins ' + need + '/' + prev.exercises.length + ') pour ouvrir ce module.';
          return 'Il te faut ' + need + '/' + prev.exercises.length + ' à « ' + prev.title + ' » — tu en es à ' + (p.score || 0) + '.';
        }
      }
    }
    return '';
  }

  /* Code du professeur : on ne stocke que l'empreinte du code, jamais le
     code lui-même. Un élève curieux qui lit le code source ne peut pas le
     déduire — mais s'il obtient le code d'un camarade, il entre : c'est
     une clé de classe, pas une authentification individuelle. */
  function grantWithCode(code){
    var codes = (cfg.teacherCodes || {});
    var want = String(code || '').trim().toUpperCase();
    if(!want) return Promise.resolve(null);
    if(!hasSubtle()){
      // Sans Web Crypto on compare en clair, faute de mieux.
      var lv = Object.keys(codes);
      for(var i = 0; i < lv.length; i++){
        if(codes[lv[i]] === want){ state.granted[lv[i]] = true; persist(); return Promise.resolve(lv[i]); }
      }
      return Promise.resolve(null);
    }
    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(want)).then(function(buf){
      var hex = toHex(buf);
      var lv = Object.keys(codes);
      for(var i = 0; i < lv.length; i++){
        if(codes[lv[i]] === hex){ state.granted[lv[i]] = true; persist(); return lv[i]; }
      }
      return null;
    });
  }
  function levelStats(lvl){
    var mods = modulesOf(lvl), done = 0, exos = 0, good = 0;
    mods.forEach(function(m){
      var p = state.progress[m.id];
      if(p){ if(p.done) done++; exos += p.total || 0; good += p.score || 0; }
    });
    var ex = examOf(lvl);
    var devDone = ex ? ex.devoirs.filter(function(d){ return state.devoirs[d.id]; }).length : 0;
    var comDone = ex ? ex.compositions.filter(function(c){ return state.compos[c.id]; }).length : 0;
    var fin = state.finals[lvl] || null;
    return {
      modules: mods.length, done: done, exos: exos, good: good,
      devoirs: ex ? ex.devoirs.length : 0, devoirsDone: devDone,
      compos: ex ? ex.compositions.length : 0, composDone: comDone,
      final: fin,
      percent: mods.length ? Math.round(done / mods.length * 100) : 0
    };
  }
  function globalStats(){
    var mods = allModules().length, done = 0, exos = 0, good = 0;
    Object.keys(state.progress).forEach(function(k){
      var p = state.progress[k];
      if(p.done) done++;
      exos += p.total || 0; good += p.score || 0;
    });
    var dev = Object.keys(state.devoirs).length;
    var com = Object.keys(state.compos).length;
    var fin = Object.keys(state.finals).length;
    return { modules: mods, done: done, exos: exos, good: good, devoirs: dev, compos: com, finals: fin,
             percent: mods ? Math.round(done / mods * 100) : 0 };
  }

  function totalExercises(){
    return allModules().reduce(function(s, m){ return s + m.exercises.length; }, 0);
  }

  /* ---------- synthèse vocale (prononciation) ---------- */
  function speak(text){
    try{
      if(!('speechSynthesis' in window)) { toast("La lecture audio n'est pas disponible sur ce navigateur."); return; }
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB'; u.rate = .92;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  function waLink(msg){
    return 'https://wa.me/' + CFG.profWhatsApp + '?text=' + encodeURIComponent(msg);
  }

  return {
    cfg: CFG, $: $, $$: $$, escapeHTML: escapeHTML,
    state: state, blankState: blankState, resetState: function(){
      var b = blankState();
      Object.keys(b).forEach(function(k){ state[k] = b[k]; });
    },
    persist: persist, loadUser: loadUser, loadDB: loadDB, saveDB: saveDB,
    makePasswordRecord: makePasswordRecord, verifyPassword: verifyPassword, hasSubtle: hasSubtle,
    setSession: setSession, clearSession: clearSession, readSession: readSession, readGuestCache: readGuestCache,
    toast: toast, normalize: normalize, answerMatches: answerMatches, countWords: countWords,
    levels: levels, modulesOf: modulesOf, allModules: allModules, moduleById: moduleById,
    examOf: examOf, moduleProgress: moduleProgress, levelStats: levelStats, globalStats: globalStats,
    moduleUnlocked: moduleUnlocked, moduleDone: moduleDone, lockReason: lockReason,
    levelGranted: levelGranted, grantWithCode: grantWithCode,
    totalExercises: totalExercises, speak: speak, waLink: waLink
  };
})();
