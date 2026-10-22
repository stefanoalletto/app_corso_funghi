#!/usr/bin/env python3
"""
Sostituisce le osservazioni eliminate a mano dall'app (debug mode -> "Elimina esemplare
corrente" -> registro scaricabile) con nuove osservazioni iNaturalist delle stesse specie.

Accetta anche il file "decisioni_revisione.json" scaricato da review.html (dict con removed/
picked/rejected): in quel caso NON fa il top-up automatico, ma inserisce i candidati scelti
(`picked`: scarica le foto, le comprime, aggiorna i dati) e mette in blacklist anche gli
scartati (`rejected`).

Uso (dalla radice del repo o da scripts/):
  python3 scripts/replace_removed.py ~/Downloads/registro_rimozioni.json --dry-run
  python3 scripts/replace_removed.py ~/Downloads/registro_rimozioni.json

Cosa fa:
  1. legge il registro; le voci non iNaturalist (es. "specie::slide") sono ignorate;
  2. aggiunge TUTTI gli obs_id a data/removed_observations.json (blacklist cumulativa, anche
     quelli già spariti dai dati: fetch_inaturalist.py non li ripescherà mai);
  3. per quelli ancora presenti in data/observations.json: li toglie dai dati e cancella le
     foto (images/inat/ e images_inat_original_resolution/);
  4. richiama fetch_inaturalist.py solo per le specie/gruppi scesi sotto TARGET_TOTAL esemplari
     contando anche le foto AMINT (iNat rimaste + AMINT < 30), fino a tornare a 30
     (esclude blacklist e osservazioni già presenti);
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

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fetch_inaturalist as fi

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OBS_JSON = os.path.join(ROOT, "data", "observations.json")
REMOVED_JSON = os.path.join(ROOT, "data", "removed_observations.json")
AMINT_JSON = os.path.join(ROOT, "data", "observations_amint.json")
# esemplari per specie da garantire contando iNaturalist + AMINT (stesso valore in review.html)
TARGET_TOTAL = 30
ORIG_DIR = "images_inat_original_resolution"
INAT_DIR = os.path.join("images", "inat")


def amint_counts():
    """{specie: n. carte AMINT}: non si revisionano ma contano nel totale degli esemplari."""
    if not os.path.exists(AMINT_JSON):
        return {}
    with open(AMINT_JSON, encoding="utf-8") as f:
        return {sid: len(e.get("observations", [])) for sid, e in json.load(f).items()}


def load_input(path):
    """-> (entries del registro, decisioni di review.html o None)"""
    with open(os.path.expanduser(path), encoding="utf-8") as f:
        raw = json.load(f)
    if isinstance(raw, dict):
        return raw.get("removed", []), raw
    return raw, None


def parse_registry(entries):
    """-> {specie_id: set(obs_id int)} dalle sole voci iNaturalist."""
    out = defaultdict(set)
    for e in entries:
        parts = e.get("sourceKey", "").split("::")
        if len(parts) == 3 and parts[1] == "inat" and parts[2].isdigit():
            out[parts[0]].add(int(parts[2]))
        else:
            print(f"  [ignorata] {e.get('sourceKey')} (non è un'osservazione iNaturalist)")
    return out


def add_picked(data, picked):
    """Scarica (piena risoluzione -> originals), comprime e registra i candidati scelti in review.html."""
    for c in picked:
        sid = c["speciesId"]
        if any(o["obs_id"] == c["obs_id"] for o in data[sid]["observations"]):
            print(f"  = {sid}: {c['obs_id']} già presente, saltata")
            continue
        photos_out = []
        for i, ph in enumerate(c["photos"], start=1):
            fname = f"{c['obs_id']}_{i}.jpg"
            orig = os.path.join(ORIG_DIR, sid, fname)
            if not os.path.exists(orig):
                fi.download_file(ph["url"], orig, False)
            subprocess.run(["bash", os.path.join(HERE, "compress_one_inat.sh"), orig], check=True)
            lic = ph.get("license_code")
            photos_out.append({
                "file": f"images/inat/{sid}/{fname}", "author": c["author"], "license_code": lic,
                "license_url": fi.LICENSE_URL.get(lic, ""), "original_url": ph["url"], "status": "scaricata",
            })
        obs = {"obs_id": c["obs_id"], "obs_url": c["obs_url"], "author": c["author"],
               "author_login": c["author_login"]}
        if c.get("member_species"):
            obs["member_species"] = c["member_species"]
        obs["photos"] = photos_out
        data[sid]["observations"].append(obs)
        print(f"  + {sid}: {c['obs_id']} ({len(photos_out)} foto)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("registry", help="registro_rimozioni.json scaricato dall'app")
    ap.add_argument("--dry-run", action="store_true", help="mostra cosa farebbe, senza modificare nulla")
    args = ap.parse_args()
    os.chdir(ROOT)

    entries, decisions = load_input(args.registry)
    removed = parse_registry(entries)
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
    targets = {}  # specie -> n. osservazioni iNat da raggiungere (TARGET_TOTAL meno le carte AMINT)
    amint = amint_counts()
    files_to_delete = []
    for sid, ids in sorted(removed.items()):
        present = [o for o in data[sid]["observations"] if o["obs_id"] in ids]
        already_gone = len(ids) - len(present)
        print(f"{sid}: {len(ids)} nel registro, {len(present)} da rimuovere, {already_gone} già eliminate")
        blacklist[sid] = sorted(set(blacklist.get(sid, [])) | ids)
        if present:
            left = len(data[sid]["observations"]) - len(present)
            inat_target = TARGET_TOTAL - amint.get(sid, 0)
            if left < inat_target:
                targets[sid] = inat_target
            else:
                print(f"  {sid}: restano {left} iNat + {amint.get(sid, 0)} AMINT >= {TARGET_TOTAL}, nessuna integrazione")
            for o in present:
                files_to_delete += [p["file"] for p in o["photos"]]
            data[sid]["observations"] = [o for o in data[sid]["observations"] if o["obs_id"] not in ids]

    picked = (decisions or {}).get("picked", [])
    for r in (decisions or {}).get("rejected", []):
        blacklist[r["speciesId"]] = sorted(set(blacklist.get(r["speciesId"], [])) | {r["obs_id"]})
    for c in picked:
        if c["speciesId"] not in data:
            print(f"[errore] specie sconosciuta tra i candidati scelti: {c['speciesId']}")
            sys.exit(1)
    if not targets and not picked:
        print("Niente da sostituire.")
    if args.dry_run:
        print(f"\n[DRY RUN] rimuoverei {len(files_to_delete)} foto e riporterei a target: {targets}; "
              f"inserirei {len(picked)} candidati scelti, blacklist +{len((decisions or {}).get('rejected', []))} scartati")
        return

    with open(REMOVED_JSON, "w", encoding="utf-8") as f:
        json.dump(blacklist, f, indent=1, sort_keys=True)
    for rel in files_to_delete:
        for path in (rel, rel.replace(INAT_DIR, ORIG_DIR, 1)):
            if os.path.exists(path):
                os.remove(path)
    with open(OBS_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    if decisions is not None:
        add_picked(data, picked)
        fi.write_observations_outputs(data)
        fi.write_credits_md(data)
        short = {s: t - len(data[s]["observations"]) for s, t in targets.items() if len(data[s]["observations"]) < t}
        print(f"\nInseriti {len(picked)} candidati." + (f" Specie ancora sotto i {TARGET_TOTAL} esemplari (iNat mancanti): {short}" if short else ""))
        return
    if not targets:
        # nessuna specie sotto TARGET_TOTAL: basta rigenerare observations.js e CREDITS.md senza le rimosse
        fi.write_observations_outputs(data)
        fi.write_credits_md(data)
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
