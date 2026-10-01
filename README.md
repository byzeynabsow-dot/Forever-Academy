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
mer, jusqu'à un cargo à la dérive. **Hommage non officiel** : modèles, sons,
dialogues et code sont entièrement créés pour ce projet. Aucun élément du jeu
d'origine n'est utilisé.

```bash
npx http-server -p 8080 .     # puis http://localhost:8080/tempete/
```

Le dossier doit être servi en HTTP, pas ouvert en `file://`, à cause des modules ES.
Ajouter `?q=low` à l'adresse sur une machine modeste.

## Commandes

| Touche | Action |
| --- | --- |
| `Z`/`W` · `S` | gaz · marche arrière (touches physiques, AZERTY et QWERTY) |
| `Q`/`A` · `D` | barre |
| `Maj` | pleins gaz |
| Souris | caméra ; clic droit pour viser, clic gauche pour tirer |
| `R` · `Échap` | recharger · pause |

## Déroulé

1. Ouverture cinématique (passer avec `Espace`).
2. Cap sur le cargo, à 1,4 km. Trois vagues de semi-rigides de mercenaires
   attaquent, avec projecteurs et tirs en rafales. Le frère du héros, Élias,
   couvre l'arrière et tire de son côté.
3. Des conteneurs tombés à la mer barrent l'approche du cargo.
4. Finale : une vague scélérate se lève à bâbord.

La santé se régénère, et l'image passe en noir et blanc quand le héros est
blessé. Une mort renvoie au dernier point de contrôle (début de la vague en cours).

## Technique

Three.js r186 est embarqué dans `tempete/lib/` (licence MIT) : aucun CDN.

| Fichier | Contenu |
| --- | --- |
| `js/ocean.js` | 8 vagues de Gerstner évaluées **à l'identique sur le GPU et le CPU** : les bateaux flottent sur la surface affichée. Clapot procédural, écume sur les crêtes, diffusion sous la surface, reflets des projecteurs, brouillard. Vague scélérate de la finale. |
| `js/effects.js` | Ciel nuageux procédural, 9 000 gouttes de pluie, éclairs ramifiés avec flash et tonnerre retardé, particules (embruns, feu, fumée), traçantes, sillages, faisceaux volumétriques. |
| `js/models.js` | Coques générées par sections, vedette, semi-rigides, personnages, porte-conteneurs avec ses conteneurs instanciés et ses feux. |
| `js/audio.js` | Son 100 % synthétisé avec Web Audio : pluie, vent, houle, moteur, tonnerre, tirs, explosions. |
| `js/main.js` | Physique des bateaux (flottaison, sauts sur les vagues, gîte), caméra à l'épaule, combat, IA, script de la mission, post-traitement (bloom, ACES, vignette, grain, dégâts). |
