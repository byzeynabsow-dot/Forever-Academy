/* =========================================================
   Forever Academy / Talk & Shine — configuration
   ---------------------------------------------------------
   Renseigne ici tes identifiants OAuth pour activer la vraie
   connexion Google et Apple. Tant qu'ils sont vides, les
   boutons fonctionnent en « mode local » : l'utilisateur est
   connecté sur cet appareil, rien n'est bloqué.
   ========================================================= */
window.TS_CONFIG = {

  /* =====================================================================
     SHINE VOCAL — deux façons de connecter Gemini Live
     ---------------------------------------------------------------------
     MODE 1 (recommandé) : laisse geminiApiKey VIDE.
       La page demande un jeton court à /api/token, fourni par un petit
       serveur qui garde ta clé. Personne ne peut voler la clé.

     MODE 2 (simple, mais la clé est publique) : colle ta clé ci-dessous.
       Le site fonctionne sans aucun serveur — mais TOUTE personne qui
       ouvre le code source de la page peut lire cette clé et s'en servir
       à tes frais. À réserver à un site privé, à une démonstration, ou
       à une clé dont tu surveilles le quota de près.
     ===================================================================== */
  geminiApiKey: '',                                   // ← MODE 2 : ta clé AIza… ici
  geminiLiveModel: 'gemini-3.1-flash-live-preview',
  tokenEndpoint: '/api/token',                        // ← MODE 1 : adresse du serveur

  /* Google Identity Services — console.cloud.google.com > Identifiants > ID client OAuth (Web)
     Autorise l'origine de ton site (ex. https://mon-site.com) puis colle l'ID ici. */
  googleClientId: '',

  /* Sign in with Apple — developer.apple.com > Services ID
     Le redirectURI doit pointer vers l'URL exacte de cette page. */
  appleClientId: '',
  appleRedirectURI: '',

  /* Contact professeur (WhatsApp, format international sans +) */
  profWhatsApp: '221782239495',
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb82wT62ZjCkdgLhfn2Q',

  /* Réglages pédagogiques */
  passRate: 0.7,          // 70 % pour valider un examen
  secondsPerQuestion: 40, // temps par question en examen final
  levels: ['A1', 'A2', 'B1', 'B2', 'C1']
};
