#!/usr/bin/env python3
"""
Sostituisce le osservazioni eliminate a mano dall'app (debug mode -> "Elimina esemplare
corrente" -> registro scaricabile) con nuove osservazioni iNaturalist delle stesse specie.

Uso (dalla radice del repo o da scripts/):
  python3 scripts/replace_removed.py ~/Downloads/registro_rimozioni.json --dry-run
  python3 scripts/replace_removed.py ~/Downloads/registro_rimozioni.json

Cosa fa:
  1. legge il registro; le voci non iNaturalist (es. "specie::slide") sono ignorate;
  2. aggiunge TUTTI gli obs_id a data/removed_observations.json (blacklist cumulativa, anche
     quelli già spariti dai dati: fetch_inaturalist.py non li ripescherà mai);
  3. per quelli ancora presenti in data/observations.json: li toglie dai dati e cancella le
     foto (images/inat/ e images_inat_original_resolution/);
  4. richiama fetch_inaturalist.py per riportare ogni specie/gruppo al numero di osservazioni
     che aveva prima (esclude blacklist e osservazioni già presenti);
  5. sposta le foto appena scaricate in images_inat_original_resolution/ e le comprime in
     images/inat/ con compress_one_inat.sh (richiede magick e cjpeg);
  6. rigenera observations.js/.json e CREDITS.md (lo fa il fetch).
Dopo: controlla `git status`, rimuovi dal browser il localStorage `funghi_removed_v1` se vuoi
ripartire pulito, e fai il bump di versione in changelog.js (nuove foto = patch).
Il registro scaricato dall'app può contenere duplicati: sono gestiti.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OBS_JSON = os.path.join(ROOT, "data", "observations.json")
REMOVED_JSON = os.path.join(ROOT, "data", "removed_observations.json")
ORIG_DIR = "images_inat_original_resolution"
INAT_DIR = os.path.join("images", "inat")


def parse_registry(path):
    """-> {specie_id: set(obs_id int)} dalle sole voci iNaturalist."""
    with open(os.path.expanduser(path), encoding="utf-8") as f:
        entries = json.load(f)
    out = defaultdict(set)
    for e in entries:
        parts = e.get("sourceKey", "").split("::")
        if len(parts) == 3 and parts[1] == "inat" and parts[2].isdigit():
            out[parts[0]].add(int(parts[2]))
        else:
            print(f"  [ignorata] {e.get('sourceKey')} (non è un'osservazione iNaturalist)")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("registry", help="registro_rimozioni.json scaricato dall'app")
    ap.add_argument("--dry-run", action="store_true", help="mostra cosa farebbe, senza modificare nulla")
    args = ap.parse_args()
    os.chdir(ROOT)

    removed = parse_registry(args.registry)
    with open(OBS_JSON, encoding="utf-8") as f:
        data = json.load(f)
    unknown = [s for s in removed if s not in data]
    if unknown:
        print(f"[errore] specie non presenti in observations.json: {unknown}")
        sys.exit(1)

    blacklist = {}
    if os.path.exists(REMOVED_JSON):
        with open(REMOVED_JSON, encoding="utf-8") as f:
            blacklist = json.load(f)

    # 1-3: blacklist + rimozione dai dati
    targets = {}  # specie -> n. osservazioni da riportare (conteggio prima della rimozione)
    files_to_delete = []
    for sid, ids in sorted(removed.items()):
        present = [o for o in data[sid]["observations"] if o["obs_id"] in ids]
        already_gone = len(ids) - len(present)
        print(f"{sid}: {len(ids)} nel registro, {len(present)} da rimuovere, {already_gone} già eliminate")
        blacklist[sid] = sorted(set(blacklist.get(sid, [])) | ids)
        if present:
            targets[sid] = len(data[sid]["observations"])
            for o in present:
                files_to_delete += [p["file"] for p in o["photos"]]
            data[sid]["observations"] = [o for o in data[sid]["observations"] if o["obs_id"] not in ids]

    if not targets:
        print("Niente da sostituire.")
    if args.dry_run:
        print(f"\n[DRY RUN] rimuoverei {len(files_to_delete)} foto e riporterei a target: {targets}")
        return

    with open(REMOVED_JSON, "w", encoding="utf-8") as f:
        json.dump(blacklist, f, indent=1, sort_keys=True)
    for rel in files_to_delete:
        for path in (rel, rel.replace(INAT_DIR, ORIG_DIR, 1)):
            if os.path.exists(path):
                os.remove(path)
    with open(OBS_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    if not targets:
        return

    # 4: top-up, una run di fetch per ogni valore di target distinto
    before = {rel for root, _, fs in os.walk(INAT_DIR) for fn in fs
              for rel in [os.path.join(root, fn)]}
    by_target = defaultdict(list)
    for sid, t in targets.items():
        by_target[t].append(sid)
    for t, sids in sorted(by_target.items()):
        subprocess.run([sys.executable, os.path.join(HERE, "fetch_inaturalist.py"), "--groups",
                        "--species", ",".join(sids), "--target", str(t), "--group-target", str(t)],
                       check=True)

    # 5: i file nuovi sono a piena risoluzione: backup in originals + compressione
    new_files = sorted(rel for root, _, fs in os.walk(INAT_DIR) for fn in fs
                       for rel in [os.path.join(root, fn)] if rel not in before and fn.endswith(".jpg"))
    for rel in new_files:
        orig = rel.replace(INAT_DIR, ORIG_DIR, 1)
        os.makedirs(os.path.dirname(orig), exist_ok=True)
        shutil.move(rel, orig)
        subprocess.run(["bash", os.path.join(HERE, "compress_one_inat.sh"), orig], check=True)
    print(f"\nFoto nuove: {len(new_files)} (compresse). Controlla il report del fetch per eventuali SOTTO TARGET.")


if __name__ == "__main__":
    main()
