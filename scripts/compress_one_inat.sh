#!/bin/bash
# Comprime UNA foto iNaturalist: input = path sotto images_inat_original_resolution/,
# output = stesso path relativo sotto images/inat/, a 900px max lato / qualità 72
# (libjpeg-turbo via magick + cjpeg -optimize -progressive).
# Usato in parallelo da compress_all_inat.sh, uno start per file.
set -euo pipefail
src="$1"
rel="${src#images_inat_original_resolution/}"
dest="images/inat/$rel"
mkdir -p "$(dirname "$dest")"
magick "$src" -resize '900x900>' -strip -auto-orient ppm:- \
  | cjpeg -quality 72 -optimize -progressive -outfile "$dest"
