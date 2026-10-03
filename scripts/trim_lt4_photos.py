#!/usr/bin/env python3
"""
Sposta in backup (NON cancella) tutte le osservazioni iNaturalist con meno di 4 foto,
in preparazione al top-up con la logica di priorità 4->3->2->1 foto.

- Le foto delle osservazioni rimosse vengono spostate (non copiate) in
  ~/Documents/backup_old_app_work/images_inat_lt4photos/<specie>/
- observations.json / observations.js vengono riscritti con solo le osservazioni
  rimaste (>=4 foto)
- CREDITS.md viene rigenerato di conseguenza

Uso:
  cd scripts && python3 trim_lt4_photos.py [--dry-run]
"""
import argparse
import json
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))  # .../scripts
ROOT = os.path.dirname(HERE)
OBSERVATIONS_JSON = os.path.join(ROOT, "data", "observations.json")
BACKUP_DIR = os.path.expanduser("~/Documents/backup_old_app_work/images_inat_lt4photos")

sys.path.insert(0, HERE)
import fetch_inaturalist as fi  # riusa write_observations_outputs e write_credits_md


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with open(OBSERVATIONS_JSON, encoding="utf-8") as f:
        all_data = json.load(f)

    total_kept = 0
    total_removed = 0
    files_moved = 0
    files_missing = 0

    for sid, entry in all_data.items():
        obs = entry.get("observations", [])
        keep = [o for o in obs if len(o.get("photos", [])) >= 4]
        remove = [o for o in obs if len(o.get("photos", [])) < 4]
        total_kept += len(keep)
        total_removed += len(remove)

        if remove and not args.dry_run:
            dest_dir = os.path.join(BACKUP_DIR, sid)
            os.makedirs(dest_dir, exist_ok=True)
            for o in remove:
                for photo in o.get("photos", []):
                    rel = photo.get("file")
                    if not rel:
                        continue
                    src = os.path.join(ROOT, rel)
                    dest = os.path.join(dest_dir, os.path.basename(rel))
                    if os.path.exists(src):
                        shutil.move(src, dest)
                        files_moved += 1
                    else:
                        files_missing += 1

        entry["observations"] = keep

    print(f"osservazioni tenute (>=4 foto): {total_kept}")
    print(f"osservazioni spostate in backup (<4 foto): {total_removed}")
    if not args.dry_run:
        print(f"file immagine spostati: {files_moved} (mancanti/già assenti: {files_missing})")

    if args.dry_run:
        print("[DRY RUN] nessun file scritto.")
        return

    fi.write_observations_outputs(all_data)
    print(f"Scritto {fi.OBSERVATIONS_JSON} e {fi.OBSERVATIONS_JS}")
    fi.write_credits_md(all_data)
    print(f"Scritto {fi.CREDITS_MD}")


if __name__ == "__main__":
    main()
