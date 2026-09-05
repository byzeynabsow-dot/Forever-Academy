/* =========================================================
   Forever Academy — authentification
   • email + mot de passe (compte local, chiffré en base64)
   • Google Identity Services (réel si googleClientId renseigné)
   • Sign in with Apple (réel si appleClientId renseigné)
   • mode invité
   ========================================================= */
(function(){
  'use strict';
  var $ = TS.$, $$ = TS.$$, state = TS.state, CFG = TS.cfg;

  var mode = 'login';
  var tabLogin = $('#tabLogin'), tabSignup = $('#tabSignup');
  var elName = $('#fullName'), elEmail = $('#email'), elPass = $('#password'), elPass2 = $('#password2');

  /* ---------------- validation ---------------- */
  function setFieldState(id, ok, msg){
    var f = $('#' + id);
    if(!f) return;
    f.classList.toggle('invalid', ok === false);
    f.classList.toggle('valid', ok === true);
    if(msg){ var e = f.querySelector('.err'); if(e) e.textContent = msg; }
  }
  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(v).trim()); }
  function checkName(silent){
    var ok = elName.value.trim().length >= 2;
    if(!silent || elName.value) setFieldState('fName', ok);
    return ok;
  }
  function checkEmail(silent){
    var ok = validEmail(elEmail.value);
    if(!silent || elEmail.value) setFieldState('fEmail', ok, 'Entre une adresse email valide, par exemple nom@gmail.com.');
    return ok;
  }
  function checkPass(silent){
    var ok = elPass.value.length >= 6;
    if(!silent || elPass.value) setFieldState('fPass', ok, 'Le mot de passe doit contenir au moins 6 caractères.');
    return ok;
  }
  function checkPass2(silent){
    var ok = elPass2.value.length > 0 && elPass2.value === elPass.value;
    if(!silent || elPass2.value) setFieldState('fPass2', ok);
    return ok;
  }
  function scorePassword(v){
    var s = 0;
    if(v.length >= 6) s++;
    if(v.length >= 10) s++;
    if(/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if(/\d/.test(v)) s++;
    if(/[^A-Za-z0-9]/.test(v)) s++;
    return Math.min(s, 4);
  }
  function paintStrength(){
    var box = $('#strength');
    if(mode !== 'signup'){ box.classList.remove('show'); return; }
    box.classList.add('show');
    var s = scorePassword(elPass.value);
    var labels = ['Très faible','Faible','Correct','Bon','Excellent'];
    var colors = ['#E2564B','#E2564B','#F5A623','#2FAE6A','#2FAE6A'];
    box.querySelector('i').style.width = (s * 25 || 6) + '%';
    box.querySelector('i').style.background = colors[s];
    box.querySelector('.txt').textContent = labels[s];
  }

  [[elName, checkName], [elEmail, checkEmail], [elPass, checkPass], [elPass2, checkPass2]].forEach(function(pair){
    pair[0].addEventListener('blur', function(){ pair[1](true); });
    pair[0].addEventListener('input', function(){
      var f = pair[0].closest('.field');
      if(f.classList.contains('invalid')) pair[1](true);
      if(pair[0] === elPass){ paintStrength(); if(elPass2.value) checkPass2(true); }
    });
  });

  $$('.toggle-eye').forEach(function(btn){
    btn.addEventListener('click', function(){
      var input = document.getElementById(btn.dataset.target);
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      btn.innerHTML = show
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-7 0-11-7-11-7a19 19 0 0 1 5.1-5.9M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a19 19 0 0 1-2.2 3.2M1 1l22 22"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  });

  function setMode(next){
    mode = next;
    var isSignup = next === 'signup';
    tabLogin.classList.toggle('active', !isSignup);
    tabSignup.classList.toggle('active', isSignup);
    tabLogin.setAttribute('aria-selected', String(!isSignup));
    tabSignup.setAttribute('aria-selected', String(isSignup));
    $$('.signup-only').forEach(function(el){ el.style.display = isSignup ? 'block' : 'none'; });
    $('#formEyebrow').textContent = isSignup ? 'Nouveau ici ?' : 'Bienvenue 👋';
    $('#formTitle').textContent = isSignup ? 'Crée ton compte' : 'Connecte-toi à ton espace';
    $('#formSub').textContent = isSignup ? 'Deux minutes suffisent pour rejoindre le club.' : 'Continue ton parcours vers la fluidité.';
    $('#submitLabel').textContent = isSignup ? 'Créer mon compte' : 'Se connecter';
    elPass.setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');
    $('#switchLine').innerHTML = isSignup
      ? 'Déjà un compte ? <button type="button" class="link-gold" id="switchLink">Se connecter</button>'
      : 'Pas encore de compte ? <button type="button" class="link-gold" id="switchLink">Créer un compte</button>';
    $('#switchLink').addEventListener('click', function(){ setMode(isSignup ? 'login' : 'signup'); });
    ['fName','fEmail','fPass','fPass2'].forEach(function(id){
      var f = $('#' + id); if(f) f.classList.remove('invalid','valid');
    });
    paintStrength();
  }
  tabLogin.addEventListener('click', function(){ setMode('login'); });
  tabSignup.addEventListener('click', function(){ setMode('signup'); });
  $('#switchLink').addEventListener('click', function(){ setMode('signup'); });

  function enter(){ if(window.FA && FA.afterAuth) FA.afterAuth(); }

  /* ---------------- email / mot de passe ---------------- */
  $('#authForm').addEventListener('submit', function(e){
    e.preventDefault();
    var okE = checkEmail(), okP = checkPass();
    var email = elEmail.value.trim().toLowerCase();
    var db = TS.loadDB();

    if(mode === 'signup'){
      var okN = checkName(), ok2 = checkPass2();
      if(!(okN && okE && okP && ok2)){ TS.toast('Vérifie les champs en rouge.', 'err'); return; }
      if(db[email]){ setFieldState('fEmail', false, 'Un compte existe déjà avec cet email. Connecte-toi.'); return; }
      db[email] = { name: elName.value.trim(), email: email, pass: TS.scramble(elPass.value),
                    provider:'local', level:'', progress:{}, devoirs:{}, compos:{}, finals:{}, lastModule:'' };
      TS.saveDB(db);
      TS.loadUser(db[email]);
      TS.setSession(email, $('#remember').checked);
      TS.toast('Bienvenue ' + state.name + ' ! Ton compte est créé.', 'ok');
      enter();
      return;
    }

    if(!(okE && okP)){ TS.toast('Vérifie les champs en rouge.', 'err'); return; }
    var u = db[email];
    if(!u){ setFieldState('fEmail', false, "Aucun compte avec cet email. Crée un compte, c'est gratuit."); return; }
    if(u.pass && u.pass !== TS.scramble(elPass.value)){
      setFieldState('fPass', false, 'Mot de passe incorrect. Réessaie ou utilise « Mot de passe oublié ».');
      return;
    }
    TS.loadUser(u);
    TS.setSession(email, $('#remember').checked);
    TS.toast('Content de te revoir, ' + state.name + ' !', 'ok');
    enter();
  });

  $('#guestBtn').addEventListener('click', function(){
    TS.resetState();
    state.name = 'Invité'; state.guest = true; state.provider = 'guest';
    TS.toast('Mode invité : tout est accessible, la progression reste sur cet appareil.');
    enter();
  });

  $('#forgotBtn').addEventListener('click', function(){
    var email = elEmail.value.trim().toLowerCase();
    if(!validEmail(email)){ setFieldState('fEmail', false, 'Entre ton email ici, puis reclique sur « Mot de passe oublié ».'); return; }
    var db = TS.loadDB();
    if(!db[email]){ TS.toast('Aucun compte avec cet email.', 'err'); return; }
    var np = prompt('Choisis un nouveau mot de passe (6 caractères minimum) :');
    if(np === null) return;
    if(np.length < 6){ TS.toast('Mot de passe trop court.', 'err'); return; }
    db[email].pass = TS.scramble(np); TS.saveDB(db);
    TS.toast('Mot de passe mis à jour. Connecte-toi.', 'ok');
  });

  /* ---------------- connexion par fournisseur ---------------- */
  function signInProvider(provider, email, name){
    email = String(email || '').toLowerCase();
    var db = TS.loadDB();
    var u = db[email];
    if(!u){
      u = { name: name || email.split('@')[0], email: email, provider: provider,
            level:'', progress:{}, devoirs:{}, compos:{}, finals:{}, lastModule:'' };
    }else{
      if(name) u.name = name;
      u.provider = provider;
    }
    db[email] = u; TS.saveDB(db);
    TS.loadUser(u);
    TS.setSession(email, true);
    TS.toast('Connecté avec ' + (provider === 'google' ? 'Google' : 'Apple') + '. Bienvenue ' + u.name + ' !', 'ok');
    enter();
  }

  function decodeJwt(token){
    try{
      var part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      var json = decodeURIComponent(atob(part).split('').map(function(c){
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    }catch(e){ return null; }
  }

  function loadScript(src){
    return new Promise(function(res, rej){
      if(document.querySelector('script[src="' + src + '"]')) return res();
      var s = document.createElement('script');
      s.src = src; s.async = true; s.defer = true;
      s.onload = res; s.onerror = function(){ rej(new Error('script')); };
      document.head.appendChild(s);
    });
  }

  /* --- repli local : le bouton reste utilisable même sans clé OAuth --- */
  function localProvider(provider){
    var label = provider === 'google' ? 'Google' : 'Apple';
    var email = prompt('Connexion ' + label + ' (mode local, sans serveur)\n\nEntre l\'adresse email de ton compte ' + label + ' :');
    if(email === null) return;
    email = email.trim().toLowerCase();
    if(!validEmail(email)){ TS.toast('Adresse email invalide.', 'err'); return; }
    var db = TS.loadDB(), name = db[email] && db[email].name;
    if(!name){
      name = prompt('Ton nom complet :');
      if(name === null) return;
      name = name.trim() || email.split('@')[0];
    }
    signInProvider(provider, email, name);
  }

  /* ---------------- Google Identity Services ---------------- */
  var googleReady = false;
  function initGoogle(){
    if(!CFG.googleClientId) return;
    loadScript('https://accounts.google.com/gsi/client').then(function(){
      if(!window.google || !google.accounts || !google.accounts.id) return;
      google.accounts.id.initialize({
        client_id: CFG.googleClientId,
        callback: function(resp){
          var p = decodeJwt(resp.credential);
          if(!p || !p.email){ TS.toast('Connexion Google impossible : profil incomplet.', 'err'); return; }
          signInProvider('google', p.email, p.name);
        }
      });
      var host = $('#gsiHost');
      if(host){
        google.accounts.id.renderButton(host, { theme:'outline', size:'large', text:'continue_with', shape:'pill', width:280 });
      }
      googleReady = true;
    }).catch(function(){ /* réseau bloqué : le repli local prend le relais */ });
  }

  $('#googleBtn').addEventListener('click', function(){
    if(googleReady && window.google && google.accounts && google.accounts.id){
      google.accounts.id.prompt(function(notif){
        if(notif && (notif.isNotDisplayed && notif.isNotDisplayed() || notif.isSkippedMoment && notif.isSkippedMoment())){
          TS.toast('Utilise le bouton Google officiel affiché ci-dessous.');
        }
      });
      return;
    }
    localProvider('google');
  });

  /* ---------------- Sign in with Apple ---------------- */
  var appleReady = false;
  function initApple(){
    if(!CFG.appleClientId) return;
    loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js').then(function(){
      if(!window.AppleID) return;
      AppleID.auth.init({
        clientId: CFG.appleClientId,
        scope: 'name email',
        redirectURI: CFG.appleRedirectURI || window.location.href.split('#')[0],
        usePopup: true
      });
      appleReady = true;
    }).catch(function(){});
  }

  $('#appleBtn').addEventListener('click', function(){
    if(appleReady && window.AppleID){
      AppleID.auth.signIn().then(function(res){
        var p = res && res.authorization && decodeJwt(res.authorization.id_token);
        var email = (p && p.email) || (res.user && res.user.email);
        var name = res.user && res.user.name ? [res.user.name.firstName, res.user.name.lastName].filter(Boolean).join(' ') : '';
        if(!email){ TS.toast("Apple n'a pas transmis d'email. Utilise l'email ou Google.", 'err'); return; }
        signInProvider('apple', email, name);
      }).catch(function(){ TS.toast('Connexion Apple annulée.'); });
      return;
    }
    localProvider('apple');
  });

  /* note explicative sous les boutons */
  (function note(){
    var el = $('#socialNote');
    if(!el) return;
    var g = !!CFG.googleClientId, a = !!CFG.appleClientId;
    if(g && a) el.textContent = 'Connexion sécurisée via Google et Apple.';
    else if(g) el.textContent = "Google est actif. Apple fonctionne en mode local tant que l'identifiant Apple n'est pas renseigné dans js/config.js.";
    else if(a) el.textContent = "Apple est actif. Google fonctionne en mode local tant que l'identifiant Google n'est pas renseigné dans js/config.js.";
    else el.textContent = "Google et Apple fonctionnent en mode local (compte créé sur cet appareil). Renseigne tes identifiants OAuth dans js/config.js pour activer la connexion officielle.";
  })();

  initGoogle();
  initApple();
  setMode('login');

  window.FA_auth = { setMode: setMode };
})();
