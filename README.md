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
