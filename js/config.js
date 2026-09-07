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

     MODE 2 (TEST LOCAL UNIQUEMENT) : colle ta clé ci-dessous.
       Fonctionne sans serveur, mais la clé devient PUBLIQUE : toute
       personne qui ouvre le code source de la page peut la lire et s'en
       servir à tes frais. Ne jamais mettre en ligne dans cet état.
       tools/check-no-secrets.py refuse d'ailleurs une livraison si ce
       champ est renseigné.
     ===================================================================== */
  geminiApiKey: '',                                   // ← laisser VIDE en production
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
