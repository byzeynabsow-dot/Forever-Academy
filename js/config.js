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

  /* =====================================================================
     CODES DU PROFESSEUR
     ---------------------------------------------------------------------
     Les cours s'ouvrent d'eux-mêmes au fil de la progression : un module
     se débloque quand le précédent est réussi à 70 pour cent. Ces codes
     permettent au professeur d'ouvrir un niveau entier tout de suite.

     On ne stocke que l'empreinte SHA-256 du code, jamais le code : un
     eleve qui lit le code source ne peut pas le deviner. En revanche, un
     code qui circule entre eleves fonctionne pour tous — c'est une cle de
     classe, pas un mot de passe individuel.

     Codes livres par defaut — A CHANGER :
       A1 -> SHINE-A1   A2 -> SHINE-A2   B1 -> SHINE-B1
       B2 -> SHINE-B2   C1 -> SHINE-C1

     Pour fabriquer une nouvelle empreinte :
       echo -n "MON-CODE" | sha256sum
     ===================================================================== */
  teacherCodes: {
    A1: 'd804ebe84a8766f966cf71a08670b2ec71af38372441d34e9b4e5493c58c543e',
    A2: '916d714e768fd5c8f06820e75dfa4e58e68dfd168704a172330a4837604cbf81',
    B1: '61d853a18747e3e89e90ce7951e52f97cc181da718a5b4729730faca62059cae',
    B2: '9935a469265dc87f5dd5f3107f2682c224aef1e8de5c822f8764fe7f3f4703dc',
    C1: '61bd5d2df5513892fbbaded7b571c32f7a1c242a6c2e7aec5472c0d1879f3b4d'
  },

  /* Réglages pédagogiques */
  passRate: 0.7,          // 70 % pour valider un examen
  secondsPerQuestion: 40, // temps par question en examen final
  levels: ['A1', 'A2', 'B1', 'B2', 'C1']
};
