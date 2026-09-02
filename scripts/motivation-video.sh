#!/usr/bin/env bash
# Génération d'une vidéo de motivation photoréaliste via Higgsfield.
#
# Prérequis :
#   npm i -g @higgsfield/cli
#   higgsfield auth login
#   higgsfield workspace set <workspace_id>
#
# NOTE PLAN : en plan gratuit, seedance_2_0 / seedance_2_0_mini renvoient
# "Requires basic plan or higher". wan2_7, kling3_0 et gemini_omni passent.
# Vérifier le coût avant de lancer :  higgsfield generate cost <model> ...
#
# Usage : ./scripts/motivation-video.sh

set -euo pipefail

MODEL="wan2_7"           # accessible en plan gratuit (Seedance 2.0 exige Basic+)
RATIO="9:16"             # vertical réseaux sociaux ; passer à 16:9 pour du cinéma
DUREE=4                  # wan2_7 : 2-15s. Coût 720p ~1,5 crédit/s
OUT="out/motivation"
mkdir -p "$OUT"

# Socle de réalisme appliqué à chaque plan : c'est lui qui fait le "très réaliste".
LOOK="photoréaliste, tourné en 85mm, faible profondeur de champ, lumière naturelle,
texture de peau visible, grain argentique léger, étalonnage cinéma sobre, tack sharp"

# --- Les 5 plans -------------------------------------------------------------
# Le prompt décrit le MOUVEMENT et l'action, pas une image figée.

PLAN1="chambre sombre avant l'aube, un réveil affiche 5h00, une main écarte la couette
et se lève ; lent travelling avant. $LOOK"

PLAN2="gros plan sur des chaussures de course qu'on lace serré sur un perron,
buée de froid, la porte s'ouvre sur la rue déserte ; caméra basse, dolly. $LOOK"

PLAN3="un coureur monte une côte raide au petit matin, souffle court, sueur,
la lumière rasante le prend de dos ; plan de suivi latéral, caméra à l'épaule. $LOOK"

PLAN4="silhouette penchée sur un bureau tard le soir, seule une lampe éclaire,
la main écrit sans s'arrêter ; lent push in. $LOOK"

PLAN5="arrivée en haut d'une crête au lever du soleil, la personne se redresse
et lève lentement la tête vers l'horizon ; large panoramique ascendant. $LOOK"

i=1
for PLAN in "$PLAN1" "$PLAN2" "$PLAN3" "$PLAN4" "$PLAN5"; do
  echo "→ Plan $i / 5"
  higgsfield generate create "$MODEL" \
    --prompt "$PLAN" \
    --aspect_ratio "$RATIO" \
    --duration "$DUREE" \
    --resolution 720p \
    --wait --wait-timeout 20m
  i=$((i + 1))
done

# --- Musique -----------------------------------------------------------------
echo "→ Nappe musicale"
higgsfield generate create seed_audio \
  --prompt "nappe orchestrale montante, piano sobre puis cordes et percussions,
crescendo lent sur 45 secondes, inspirant sans emphase, sans voix" \
  --wait

# --- Assemblage --------------------------------------------------------------
# Télécharge les URLs renvoyées ci-dessus dans out/motivation/ (plan1.mp4 … plan5.mp4,
# musique.mp3), puis :
#
#   printf "file '%s'\n" out/motivation/plan?.mp4 > out/motivation/liste.txt
#   ffmpeg -f concat -safe 0 -i out/motivation/liste.txt -c copy out/motivation/muet.mp4
#   ffmpeg -i out/motivation/muet.mp4 -i out/motivation/musique.mp3 \
#          -c:v copy -shortest out/motivation/final.mp4
