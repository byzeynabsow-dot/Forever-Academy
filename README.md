# Forever Academy — boutique de produits Forever

Site vitrine et boutique de démonstration pour des produits Forever (aloe vera,
compléments, soins, produits de la ruche), construit **en HTML, CSS et
JavaScript purs** : aucun framework, aucune dépendance, aucun appel réseau.

## Lancer le site

Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
npx http-server -p 8080 .
# puis http://127.0.0.1:8080
```

## Les animations et transitions 3D

| Où | Effet |
| --- | --- |
| Changement de page (Accueil / Produits / L'aloe vera / Contact) | La vue sortante pivote et s'enfonce sur l'axe Y, la vue entrante arrive de l'autre côté — le sens dépend de la direction de navigation |
| **Fiche produit** | Le panneau s'ouvre en `rotateX` depuis la profondeur ; les flèches ‹ › font **pivoter le panneau de 180°** pour passer d'un article au suivant (deux faces alternées, `backface-visibility`) |
| Cartes du catalogue | Retournement `rotateY(180deg)` au survol / focus pour révéler les bénéfices et les boutons |
| Carrousel d'accueil | Les articles sont disposés sur un **cercle en 3D** (`rotateY(i·θ) translateZ(r)`) ; l'anneau tourne, glisser ou les flèches du clavier changent d'article |
| Héros | Prisme hexagonal en rotation continue, pilotée en `requestAnimationFrame` — **cliquer-glisser pour le faire tourner à la main**, avec inertie |
| Page « L'aloe vera » | Cube à six faces, également manipulable à la souris |
| Décor | Grille en perspective, feuilles qui tombent en rotation sur trois axes, halos animés |
| Divers | Effet *tilt* sur les cartes, parallaxe au pointeur, apparitions au défilement, panier qui s'ouvre en `rotateY`, notifications qui basculent en `rotateX` |

## Fonctionnalités

- 12 produits filtrables par catégorie et par recherche texte ;
- fiches produit détaillées (description, bénéfices, conseil d'utilisation) ;
- panier persistant (`localStorage`) avec quantités et total en euros ;
- formulaire de contact avec validation côté client ;
- bouton **✦** dans l'en-tête pour réduire les animations, et respect de
  `prefers-reduced-motion` ;
- navigation clavier (flèches dans le carrousel et la fiche, `Échap` pour
  fermer), libellés ARIA, mise en page responsive jusqu'à 390 px.

## Structure

```
index.html                 pages (4 vues) + modale fiche + panier
assets/css/style.css       toute la mise en forme et les animations 3D
assets/js/products.js      catalogue (données à personnaliser)
assets/js/app.js           routeur 3D, carrousel, fiches, panier, formulaire
```

## Personnalisation

- **Produits** : éditez `assets/js/products.js`. Chaque entrée accepte
  `shape: "bottle" | "jar" | "tube"` et un couple de couleurs `colors.a/b` —
  l'illustration SVG du flacon est générée automatiquement, aucune image à
  fournir.
- **Couleurs du site** : variables CSS en haut de `assets/css/style.css`
  (`--green-*`, `--lime`, `--gold`…).

## Avertissement

Les prix, textes et visuels servent la démonstration : ils doivent être
remplacés par les informations officielles avant toute mise en ligne
commerciale. Le paiement n'est pas implémenté (le bouton « Commander » vide
simplement le panier). Les compléments alimentaires ne remplacent ni une
alimentation variée, ni un avis médical.
