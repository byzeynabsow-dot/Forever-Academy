/* =========================================================
   Talk & Shine — comptes en ligne
   ---------------------------------------------------------
   Deux modes, détectés au démarrage :

   • « serveur »  — /api/auth répond. Les comptes sont vérifiés, la
     progression suit l'élève d'un appareil à l'autre, et SHINE vocal
     est réservé aux inscrits.
   • « local »    — aucun serveur (fichier autonome, hors ligne). Tout
     continue de fonctionner sur l'appareil, comme avant.

   Aucun mot de passe ne transite ni ne séjourne dans le navigateur :
   la session est un cookie httpOnly que le JavaScript ne peut pas lire.
   ========================================================= */
window.Account = (function () {
  'use strict';

  var mode = 'unknown';       // unknown | server | local
  var me = null;              // {email, name, role, level}
  var pushTimer = null;

  function api(path, opts) {
    return fetch('/api/auth/' + path, Object.assign({
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' }
    }, opts || {}));
  }

  /* Le serveur est-il là, et suis-je déjà connecté ? */
  async function detect() {
    try {
      var res = await api('me', { method: 'GET' });
      if (res.status === 503) { mode = 'local'; return null; }   // comptes non configurés
      mode = 'server';
      if (res.ok) { me = (await res.json()).user; return me; }
      return null;                                               // serveur là, pas connecté
    } catch (e) {
      mode = 'local';                                            // pas de serveur du tout
      return null;
    }
  }

  async function signup(email, password, name) {
    var res = await api('signup', { method: 'POST', body: JSON.stringify({ email: email, password: password, name: name }) });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) return { ok: false, error: data.error, message: data.message || "Inscription impossible." };
    me = data.user;
    return { ok: true, user: me };
  }

  async function login(email, password) {
    var res = await api('login', { method: 'POST', body: JSON.stringify({ email: email, password: password }) });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) return { ok: false, error: data.error, message: data.message || "Connexion impossible." };
    me = data.user;
    return { ok: true, user: me };
  }

  async function logout() {
    try { await api('logout', { method: 'POST' }); } catch (e) {}
    me = null;
  }

  /* Récupère la progression enregistrée sur le serveur. */
  async function pull() {
    try {
      var res = await api('sync', { method: 'GET' });
      if (!res.ok) return null;
      return (await res.json()).progress;
    } catch (e) { return null; }
  }

  /* Enregistre la progression, au plus une fois toutes les 3 secondes :
     inutile d'appeler le serveur à chaque bonne réponse. */
  function schedulePush(state) {
    if (mode !== 'server' || !me) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      api('sync', {
        method: 'POST',
        body: JSON.stringify({
          level: state.level, progress: state.progress, devoirs: state.devoirs,
          compos: state.compos, finals: state.finals, granted: state.granted,
          lastModule: state.lastModule
        })
      }).catch(function () { /* réessaiera à la prochaine sauvegarde */ });
    }, 3000);
  }

  return {
    detect: detect, signup: signup, login: login, logout: logout,
    pull: pull, schedulePush: schedulePush,
    mode: function () { return mode; },
    user: function () { return me; },
    isServer: function () { return mode === 'server'; }
  };
})();
