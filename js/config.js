/* =========================================================
   Forever Academy / Talk & Shine — configuration
   ---------------------------------------------------------
   Renseigne ici tes identifiants OAuth pour activer la vraie
   connexion Google et Apple. Tant qu'ils sont vides, les
   boutons fonctionnent en « mode local » : l'utilisateur est
   connecté sur cet appareil, rien n'est bloqué.
   ========================================================= */
window.TS_CONFIG = {
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
