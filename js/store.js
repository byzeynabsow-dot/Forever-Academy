/* =========================================================
   Forever Academy — état, stockage local et utilitaires
   ========================================================= */
window.TS = (function(){
  'use strict';

  var CFG = window.TS_CONFIG;
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
  function scramble(txt){ try{ return btoa(unescape(encodeURIComponent('fa::' + txt))); }catch(e){ return 'fa::' + txt; } }

  var state = blankState();
  function blankState(){
    return {
      name:'', email:'', level:'', guest:true, provider:'local',
      progress:{},   // moduleId -> {score,total,done}
      devoirs:{},    // devoirId -> {score,total,date}
      compos:{},     // compoId  -> {score,total,date,text,self}
      finals:{},     // niveau   -> {best,total,date}
      lastModule:''
    };
  }

  function persist(){
    if(state.guest || !state.email) { sessionCache(); return; }
    var db = loadDB();
    var u = db[state.email] || {};
    u.name = state.name; u.email = state.email; u.level = state.level;
    u.provider = state.provider;
    u.progress = state.progress; u.devoirs = state.devoirs;
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
    persist: persist, loadUser: loadUser, loadDB: loadDB, saveDB: saveDB, scramble: scramble,
    setSession: setSession, clearSession: clearSession, readSession: readSession, readGuestCache: readGuestCache,
    toast: toast, normalize: normalize, answerMatches: answerMatches, countWords: countWords,
    levels: levels, modulesOf: modulesOf, allModules: allModules, moduleById: moduleById,
    examOf: examOf, moduleProgress: moduleProgress, levelStats: levelStats, globalStats: globalStats,
    totalExercises: totalExercises, speak: speak, waLink: waLink
  };
})();
