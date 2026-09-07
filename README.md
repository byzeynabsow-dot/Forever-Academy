# Forever Academy — Talk & Shine

Application web d'apprentissage de l'anglais, du niveau A1 au niveau C1.
Tout est accessible immédiatement : aucun cours verrouillé, aucun « bientôt disponible ».

## Ce que contient l'application

| Élément | Détail |
|---|---|
| **Cours** | 40 modules (8 par niveau, A1 → C1) : leçon complète, tableaux de règles, exemples traduits avec prononciation audio, vocabulaire |
| **Exercices** | 484 exercices corrigés dans les cours, 5 formats : QCM, vrai/faux, texte à trous, traduction, remise en ordre. Chaque réponse est expliquée |
| **Devoirs** | 20 devoirs (4 par niveau), 200 questions, corrigés immédiatement, sans chronomètre, refaisables à volonté |
| **Compositions** | 10 compositions (2 par niveau) : grammaire, vocabulaire/traduction, compréhension écrite (texte + questions) et expression écrite avec compteur de mots, grille d'auto-évaluation et envoi de la copie au professeur |
| **Examens finaux** | 5 examens chronométrés de 20 questions (40 s par question), corrigé détaillé, seuil de réussite à 70 % |
| **Test de niveau** | 20 questions réparties de A1 à C1, conseille un point de départ **sans rien verrouiller** |
| **Salle d'examen** | Une salle de classe en 3D par niveau (tableau, pupitres, éclairage) avec trois stations : devoirs, compositions, examen final |

Total : **884 questions et exercices corrigés**.

## Connexion

- **Email + mot de passe** — compte créé et stocké sur l'appareil (`localStorage`), avec récupération de mot de passe.
- **Google** — vraie connexion via Google Identity Services dès que `googleClientId` est renseigné.
- **Apple** — vraie connexion via *Sign in with Apple JS* dès que `appleClientId` est renseigné.
- **Invité** — accès complet sans compte, progression conservée le temps de la session.

Tant que les identifiants OAuth ne sont pas renseignés, les boutons Google et Apple **restent fonctionnels** : ils créent un compte local sur l'appareil, avec une note explicite sous les boutons. Aucun bouton mort.

### Activer la vraie connexion Google / Apple

Ouvre `js/config.js` :

```js
window.TS_CONFIG = {
  googleClientId: 'xxxxxxxx.apps.googleusercontent.com',
  appleClientId : 'com.exemple.talkandshine.web',
  appleRedirectURI: 'https://ton-domaine.com/',
  ...
};
```

- **Google** : console.cloud.google.com → *Identifiants* → *ID client OAuth (application Web)*. Ajoute l'origine du site dans « Origines JavaScript autorisées ».
- **Apple** : developer.apple.com → *Identifiers* → *Services ID*. Le `redirectURI` doit correspondre exactement à l'URL de la page.

Les deux fournisseurs exigent que le site soit servi en **HTTPS** sur un domaine déclaré (ils ne fonctionnent pas depuis un fichier ouvert en `file://`).

## Design

Les trois vidéos fournies tournent en fond de toute l'application, enchaînées en fondu avec un lent zoom (9 s par clip), sous un voile dégradé qui garantit la lisibilité du texte. Chaque changement d'écran déclenche un balayage doré. Si le navigateur ne peut pas lire les vidéos, un dégradé de secours prend le relais automatiquement. Les animations sont désactivées pour les personnes ayant activé « réduire les animations ».

## Structure

```
index.html              vues de l'application
css/base.css            design d'origine (Talk & Shine)
css/app.css             fond vidéo, salle de classe, cours, devoirs, compositions
js/config.js            identifiants OAuth, WhatsApp, barème
js/store.js             état, stockage local, progression
js/background.js        moteur vidéo et transitions
js/auth.js              email, Google, Apple, invité
js/app.js               routeur, cours, exercices, salles d'examen
js/data/a1…c1.js        contenu des 40 modules de cours
js/data/exam-a1…c1.js   devoirs, compositions et examens par niveau
js/data/placement.js    test de niveau
assets/logo.jpg         logo
assets/video/*.mp4      fonds vidéo
```

## SHINE — la professeure IA (Gemini Live)

SHINE parle et écoute en temps réel via l'API Gemini Live. L'élève parle dans son micro, SHINE répond à voix haute, corrige une erreur à la fois et la transcription s'affiche des deux côtés.

**La clé n'est jamais dans le navigateur.** L'architecture est celle recommandée par Google :

```
navigateur → /api/token (fonction Netlify, garde GEMINI_API_KEY)
           → jeton éphémère (1 min pour ouvrir, 10 min de session max)
           → WebSocket direct navigateur ↔ Gemini Live
```

La consigne pédagogique (niveau CECRL, façon de corriger, sujet de la leçon) est construite côté serveur et **verrouillée dans le jeton** : le navigateur ne peut pas la détourner.

Garde-fous de coût : 12 sessions par heure et par IP, fermeture automatique après 90 s de silence, plafond dur de 10 minutes par session.

### Ce qu'il faut pour l'activer

1. Une clé Gemini au format `AIza…` — **une clé `AQ.…` est refusée par l'API** (`401 ACCESS_TOKEN_TYPE_UNSUPPORTED`).
2. La poser dans Netlify : *Site configuration → Environment variables → `GEMINI_API_KEY`*, scope **Functions**.
3. Rien à changer dans le code.

Sans clé, SHINE affiche « SHINE vocal n'est pas encore configuré sur ce site » — aucun bouton ne fait semblant de fonctionner.

### L'avatar 3D

Le modèle `assets/3d/shine.glb` (3,3 Mo, Avaturn) est rendu avec three.js, **servi par le site lui-même** (`vendor/three/`) et non par un CDN : l'avatar s'affiche même quand la connexion est mauvaise ou qu'un CDN est bloqué.

Un seul contexte WebGL pour tout le site : le canvas est déplacé entre la page d'accueil et la page SHINE au lieu d'être recréé. Le rendu se met en pause quand l'avatar sort de l'écran.

**Les animations.** Les clips vivent dans des fichiers séparés, allégés du maillage et des textures :

| Fichier | Contenu | Poids |
|---|---|---|
| `assets/3d/shine.glb` | le personnage + son animation de repos | 3,3 Mo |
| `assets/3d/anim-gesture.glb` | le clip `gesture_1` seul | 144 Ko |

Un export Avaturn pèse 3,4 Mo même quand seule l'animation change. `tools/extract-animation.py` jette le maillage, les matériaux et les textures pour ne garder que les courbes d'animation — **96 % de moins**. Le squelette étant identique d'un export à l'autre, three.js rejoue ces clips sur le modèle déjà chargé.

```bash
python3 tools/extract-animation.py nouveau-modele.glb assets/3d/anim-xxx.glb
```

Puis il suffit d'ajouter le fichier à `ANIM_FILES` et son nom de clip à `ROLES`, dans `js/services/shine-avatar.js`. Les clips s'enchaînent en fondu de 0,5 s selon l'état : repos et écoute sur l'idle, **parole sur `gesture_1`** — SHINE gesticule en parlant. Les réactions à la voix (tête, nuque, buste) s'ajoutent par-dessus le clip au lieu de l'écraser.

**Ce que le modèle permet, et ce qu'il ne permet pas.** Ce fichier contient 52 os et une animation « idle », mais **aucune morph target et aucun os de mâchoire**. Donc :

- ✅ tête, nuque et buste animés au rythme de l'amplitude réelle de la voix
- ✅ postures distinctes selon l'état (écoute, réflexion, parole)
- ❌ **aucune animation de bouche possible** — ni lip-sync phonétique, ni même une ouverture simple

Pour obtenir un vrai lip-sync, il faut réexporter l'avatar **avec les blend shapes de visèmes** (Avaturn et Ready Player Me proposent tous deux l'option « ARKit blendshapes » à l'export). Le code est déjà prêt à les exploiter : `ShineAvatar.canLipSync()` renvoie `false` aujourd'hui et pourra être branché sur les morph targets le jour où le modèle en contient.

### Ce qui est réellement implémenté

| Fonction | État |
|---|---|
| Jeton éphémère côté serveur, clé jamais exposée | ✅ |
| Micro → PCM 16 kHz → Gemini → audio 24 kHz | ✅ code complet, à valider avec une clé |
| Transcription entrante et sortante | ✅ |
| Interruption naturelle (l'élève coupe la parole) | ✅ |
| Mode texte de repli si le micro est refusé | ✅ testé |
| États IDLE / LISTENING / THINKING / SPEAKING / ERROR | ✅ testé |
| Avatar animé, bouche pilotée par l'amplitude réelle de la voix | ✅ testé |
| Lip-sync phonétique (bouche formant chaque son) | ❌ non implémenté |
| Avatar 3D WebGL | ❌ non implémenté — l'avatar est en SVG animé |

## Deux façons d'utiliser le projet

### 1. Le fichier unique `talkandshine.html`
Tout est dedans : le style, le code, les 40 modules, les devoirs, les compositions, le logo et les trois vidéos de fond. Il suffit de **double-cliquer dessus** — pas de serveur, pas de dossier à côté, il fonctionne même sans connexion. C'est le fichier à envoyer par WhatsApp ou à copier sur un téléphone (≈ 7,5 Mo).

Il est regénéré depuis les sources avec :

```bash
python3 tools/build-standalone.py
```

Deux limites : SHINE vocal a besoin de la fonction serveur, donc il reste indisponible dans ce fichier unique ; et la vraie connexion Google/Apple ne fonctionne pas en `file://` (les deux fournisseurs exigent une adresse `https://`). Les boutons basculent alors automatiquement en mode local.

### 2. Le projet en dossiers
Plus pratique pour modifier le contenu : chaque niveau a son fichier de cours et son fichier d'examens.

## Lancer le projet

Un simple serveur statique suffit :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Le site est entièrement statique : il peut être publié tel quel sur GitHub Pages, Netlify, Vercel ou n'importe quel hébergeur.

## Progression

La progression (modules terminés, scores d'exercices, devoirs, compositions, examens) est enregistrée dans le navigateur, par compte. Elle est restaurée automatiquement à la reconnexion sur le même appareil. Les copies d'expression écrite sont conservées et peuvent être envoyées au professeur par WhatsApp pour une correction humaine.
