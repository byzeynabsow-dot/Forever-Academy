# Forever Academy — boutique de produits Forever

Boutique de démonstration pour des produits Forever (gels d'aloe vera à boire,
compléments, soins), construite **en HTML, CSS et JavaScript purs** : aucun
framework, aucune dépendance, aucun appel réseau.

## Lancer le site

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
npx http-server -p 8080 .
```

## Les animations et transitions 3D

| Où | Effet |
| --- | --- |
| Changement de page | La vue sortante pivote sur l'axe Y et s'enfonce, l'entrante arrive de l'autre côté ; le sens suit la direction de navigation |
| **Fiche produit** | Ouverture en `rotateX` depuis la profondeur ; les flèches ‹ › **font pivoter le panneau de 180°** pour passer d'un article au suivant (deux faces alternées, `backface-visibility`) |
| Cartes du catalogue | Retournement `rotateY(180deg)` au survol / focus, plus un reflet spéculaire qui suit le pointeur |
| Galerie d'accueil | Photos disposées sur un **cercle en 3D** (`rotateY(i·θ) translateZ(r)`) ; l'anneau tourne au glissement ou aux flèches du clavier |
| Héros | Plaque photo inclinée qui suit le pointeur en `rotateX`/`rotateY`, avec reflet au sol |
| Décor | Sol en perspective, particules qui montent en 3D, halos animés, grain léger |

## Les images

Les visuels viennent des photographies produits fournies par le distributeur,
retravaillées dans `assets/img/` : redimensionnement, compression, et surtout
**recadrage des packshots pour retirer les textes d'allégations santé** présents
sur les visuels d'origine (voir la note réglementaire ci-dessous).

Visuels écartés volontairement, parce que leur texte est indissociable de
l'image : les affiches « hémorroïdes », l'affiche « PCOS », l'infographie
« constipation / ballonnements / gaz », l'infographie « détoxifier /
renforce les défenses », l'illustration corps-humain-rayons-X, et les cercles
promotionnels « Order 3 Tri-packs, recieve a 4th free » (offre invérifiable et
faute d'orthographe dans l'original).

## Fonctionnalités

- 10 références photographiées, filtrables par gamme et par recherche texte ;
- fiches détaillées (composition, format, mode d'emploi) ;
- panier persistant (`localStorage`) avec quantités et total en euros ;
- formulaire de contact avec validation côté client ;
- bouton **✦** pour réduire les animations, et respect de `prefers-reduced-motion` ;
- navigation clavier (flèches dans la galerie et la fiche, `Échap` pour fermer),
  libellés ARIA, mise en page responsive jusqu'à 390 px.

## Structure

```
index.html                 4 vues + modale fiche + panier
assets/css/style.css       mise en forme et animations 3D
assets/img/                photographies produits préparées pour le web
assets/js/products.js      catalogue (données à personnaliser)
assets/js/app.js           routeur 3D, galerie, fiches, panier, formulaire
```

## Note réglementaire — à lire avant toute mise en ligne

Les textes du site décrivent **la composition, la texture, le format et le mode
d'emploi**. Ils ne comportent aucune allégation thérapeutique.

En Europe, une allégation de santé sur un complément alimentaire n'est permise
que si elle figure au registre du règlement (CE) n° 1924/2006, et **toute
allégation laissant entendre qu'un produit prévient, traite ou guérit une
maladie est interdite** (article 7 du règlement (UE) n° 1169/2011). Écrire
« soulage la constipation », « traitement efficace des hémorroïdes » ou
« régule le cycle menstruel » sur une page de vente vous expose à une sanction,
indépendamment de la qualité du produit.

Les prix sont indicatifs et doivent être remplacés par vos tarifs officiels.
Le paiement n'est pas implémenté : le bouton « Commander » vide le panier.

---

# Tempête — prologue jouable en 3D (`tempete/`)

Recréation jouable, en 3D temps réel, de l'ambiance de la première mission
d'*Uncharted 4* : une poursuite en vedette, de nuit, dans une tempête en haute
mer, puis la traversée à pied d'un cargo à la dérive. **Hommage non officiel** :
modèles, sons, dialogues et code sont créés pour ce projet ; les voix et les
illustrations sont générées avec Higgsfield. Aucun élément du jeu d'origine
n'est utilisé.

```bash
npx http-server -p 8080 .     # puis http://localhost:8080/tempete/
```

Le dossier doit être servi en HTTP, pas ouvert en `file://`, à cause des modules ES.

## Déroulé

**Chapitre 1 — La poursuite.** Cap sur le cargo, à 1,4 km. Trois vagues de
semi-rigides de mercenaires attaquent, projecteurs braqués ; Élias couvre
l'arrière. Des conteneurs à la mer barrent l'approche. Une vague scélérate se
lève à bâbord et jette les deux frères sur le pont.

**Chapitre 2 — Le cargo.** À pied, de la proue jusqu'au château arrière, à
travers les allées entre les piles de conteneurs. Trois accrochages : des
tireurs postés dans les allées et sur une pile, une travée arrachée par la mer
où les mercenaires se retranchent derrière des caisses, puis la cour du château
avec un tireur sur la passerelle. Les mercenaires se mettent à couvert, se
relèvent pour tirer en rafales et avancent quand ils vous perdent de vue. Élias
suit vos pas et tire de son côté. Le premier mercenaire abattu lâche un fusil
d'assaut. La porte du château lance la fin : le journal du capitaine, le cargo
qui se couche, la fuite en canot de sauvetage, puis le bilan de la partie
(durée, précision, tirs à la tête…).

La santé se régénère, l'image passe en noir et blanc quand le héros est
blessé. Une mort renvoie au dernier point de contrôle.

## Commandes

| Touche | Chapitre 1 (vedette) | Chapitre 2 (à pied) |
| --- | --- | --- |
| `Z`/`W` `Q`/`A` `S` `D` | gaz et barre | marcher |
| `Maj` | pleins gaz | courir |
| `C` ou `Ctrl` | — | s'accroupir |
| `1` `2` ou molette | — | pistolet · fusil |
| Souris | caméra ; clic droit viser, clic gauche tirer | idem |
| `R` · `Échap` | recharger · pause | idem |
| Tactile | joystick, regard au doigt, boutons Tir, Viser, Turbo/Courir, Accroupi, Arme, R, pause | |

## Tir et paramètres

Le menu **Paramètres** (écran titre ou pause) règle :

- **l'assistance à la visée** : *Libre* (aucune aide, la balle part sous le
  réticule), *Assistée* (le réticule se cale sur la cible proche en épaulant,
  ralentit en la survolant, tolérance de 2,2°) ou *Forte* (calage plus large,
  la visée suit la cible, tolérance de 4,5°, proposée par défaut au tactile) ;
- la sensibilité, l'inversion de l'axe vertical, les volumes, les sous-titres
  et la qualité graphique. Les choix sont gardés dans le navigateur.

Le tir gère la dispersion (plus serrée en visée, qui s'ouvre en rafale), le
recul, les tirs à la tête (dégâts ×3 au pistolet), un réticule qui rougit sur
une cible et une marque de touche qui distingue la mise à mort.

## Voix et illustrations (Higgsfield)

Les 37 répliques sont doublées en français (ElevenLabs via Higgsfield) et trois
illustrations ornent l'écran titre, le carton du chapitre 2 et l'écran de fin.
Elles sont référencées dans `tools/higgsfield-assets.json` ; pour les installer :

```bash
cd tempete && node tools/fetch-assets.mjs
```

Le script télécharge les fichiers dans `audio/vo/` et `art/` et écrit
`assets.json`. Sans eux, le jeu fonctionne avec les sous-titres seuls.

## Technique

Three.js r186 est embarqué dans `tempete/lib/` (licence MIT) : aucun CDN.

| Fichier | Contenu |
| --- | --- |
| `js/ocean.js` | 8 vagues de Gerstner évaluées **à l'identique sur le GPU et le CPU** : les bateaux flottent sur la surface affichée. Écume, diffusion, reflets des projecteurs, vague scélérate. |
| `js/effects.js` | Ciel procédural, pluie, éclairs avec tonnerre retardé, particules, traçantes, sillages, faisceaux volumétriques. |
| `js/models.js` | Coques, vedette, semi-rigides, porte-conteneurs au pont jouable (collisions exportées), canot de sauvetage, personnages articulés animés (marche, accroupi, visée, recul). |
| `js/deck.js` | Chapitre 2 : déplacement à pied avec collisions, caméra à l'épaule, IA des mercenaires (couverture, rafales, progression), Élias, butin, paquets de mer. |
| `js/aim.js` | Assistance à la visée (calage, ralentissement, aimantation des balles). |
| `js/settings.js` | Paramètres et leur sauvegarde. |
| `js/lines.js` | Script des répliques. |
| `js/audio.js` | Ambiance synthétisée (Web Audio) et lecture des voix. |
| `js/main.js` | Physique des bateaux, armes, chapitres, cinématiques, post-traitement, HUD. |
