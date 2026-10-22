#!/usr/bin/env python3
"""
Scarica le foto delle schede micologiche AMINT (forum funghiitaliani.it) per le specie
dell'app, SOLO degli autori per cui AMINT ha autorizzato l'uso: Pietro Curti, Tomaso Lezzi e
Luigi Minciarelli.

Come vengono attribuite le foto: ogni scheda è un topic del forum (sezioni funghi
commestibili / velenosi / non commestibili o sospetti); ogni post è un ritrovamento e riporta
nel testo "Foto di <Autore>". Un post viene preso solo se TUTTI gli autori citati sono
autorizzati (niente co-autori, niente "microscopia di ..."), e da esso si scartano comunque le
immagini caricate da un utente del forum diverso dagli autori (l'id utente è nel nome dei file
vecchi, "post-<id>-..."). I post senza "Foto di" e, salvo --include-descrittivi, il post
descrittivo iniziale della scheda (un solo credito per tutte le immagini) sono esclusi.

Uso:
  python3 fetch_amint.py                 # tutto (riusa la cache delle pagine già scaricate)
  python3 fetch_amint.py --refresh       # riscarica elenco schede e pagine dal forum
  python3 fetch_amint.py --dry-run       # solo report, nessun file scritto
  python3 fetch_amint.py --registro registro_rimozioni.json
      # aggiunge a data/removed_amint.json i ritrovamenti AMINT eliminati dall'app
      # ("Elimina esemplare corrente"), che da lì in poi non vengono più inclusi

Output:
  images_amint_original_resolution/<specie>/<topic>_<post>_<n>.jpg   originali (gitignored)
  images_amint_original_resolution/_cache/                           pagine del forum (gitignored)
  images/amint/<specie>/<topic>_<post>_<n>.jpg                        compresse (900px, q72)
  data/observations_amint.json + .js                                  OBSERVATIONS_AMINT
  CREDITS_AMINT.md
"""
import argparse
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import time
import unicodedata
import urllib.request

UA = "Mozilla/5.0 (ChefungoE-study-app/1.0; uso personale, non commerciale)"
BASE = "https://www.funghiitaliani.it"
FORUMS = ["38-funghi-commestibili", "39-funghi-velenosi", "40-funghi-non-commestibili-o-sospetti"]
# autori autorizzati da AMINT (nell'autorizzazione era scritto "Minciatelli", ma è Luigi Minciarelli
# del forum: confermato, sul forum la grafia "Minciatelli" non compare mai)
ALLOWED = {"pietro curti": "Pietro Curti", "tomaso lezzi": "Tomaso Lezzi", "luigi minciarelli": "Luigi Minciarelli"}
# id utente del forum di chi ha caricato i file: gli autori stessi (Curti 4, Lezzi 2993, Minciarelli 3501)
# + l'account "Archivio Micologico" che ha ricaricato le foto quando le schede sono state riorganizzate
OK_UPLOADERS = {4, 2993, 3501, 36492}
# nomi usati da AMINT diversi da quelli di species.txt
EXTRA_SYNONYMS = {"armillaria_tabescens": ["Desarmillaria tabescens"]}
MAX_PHOTOS = 4  # come iNaturalist: un post con più foto diventa più carte
REQUEST_INTERVAL = 0.4

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ORIG_DIR = os.path.join(ROOT, "images_amint_original_resolution")
CACHE_DIR = os.path.join(ORIG_DIR, "_cache")
IMAGES_DIR = os.path.join(ROOT, "images", "amint")
DATA_DIR = os.path.join(ROOT, "data")
SPECIES_TXT = os.path.join(HERE, "species.txt")
GROUPS_TXT = os.path.join(HERE, "species_groups.txt")
OUT_JSON = os.path.join(DATA_DIR, "observations_amint.json")
OUT_JS = os.path.join(DATA_DIR, "observations_amint.js")
CREDITS_MD = os.path.join(ROOT, "CREDITS_AMINT.md")
REMOVED_JSON = os.path.join(DATA_DIR, "removed_amint.json")
# singole foto escluse dopo revisione visiva (microscopio, scritte col nome, doppioni...)
EXCLUDED_TXT = os.path.join(HERE, "amint_escluse.txt")

AUTH_RE = re.compile(r"Fot[oi]\s+(?:di|:)\s*([^.;\n<]+)", re.I)
IMG_RE = re.compile(r'(?:src|data-src|href)="(https?://www\.funghiitaliani\.it/uploads/[^"]+\.(?:jpe?g|png))"', re.I)

_last_request = 0.0


def fetch(url, binary=False):
    global _last_request
    wait = REQUEST_INTERVAL - (time.time() - _last_request)
    if wait > 0:
        time.sleep(wait)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": BASE + "/"})
    try:
        data = urllib.request.urlopen(req, timeout=60).read()
    finally:
        _last_request = time.time()
    return data if binary else data.decode("utf-8", "replace")


def fetch_page(url, refresh):
    """Pagina del forum, con cache su disco (le schede cambiano raramente)."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, hashlib.md5(url.encode()).hexdigest() + ".html")
    if not refresh and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return f.read()
    text = fetch(url)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    return text


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z ]", " ", s)).strip()


def last_page(text):
    m = re.search(r"Pagina \d+ di (\d+)", text)
    return int(m.group(1)) if m else 1


def list_topics(refresh):
    topics = {}
    for forum in FORUMS:
        page, last = 1, 1
        while page <= last:
            text = fetch_page(f"{BASE}/{forum}/?page={page}", refresh)
            for tid, slug, title in re.findall(
                    r"<a href='https://www\.funghiitaliani\.it/topic/(\d+)-([^'/]+)/' class='' title=[^>]*>\s*<span>([^<]+)</span>", text):
                topics[tid] = {"slug": slug, "title": html.unescape(title).strip()}
            last = last_page(text)
            page += 1
    return topics


def load_names():
    """nome normalizzato -> [(species_id, nome del membro se carta gruppo, altrimenti None)]"""
    names = {}
    with open(SPECIES_TXT, encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            sid, rest = line.rstrip("\n").split("\t")
            for n in rest.split(";") + EXTRA_SYNONYMS.get(sid, []):
                names.setdefault(norm(n), []).append((sid, None))
    with open(GROUPS_TXT, encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            sid, rest = line.rstrip("\n").split("\t")
            for member in rest.split(","):
                syn = member.split(";")
                for n in syn:
                    names.setdefault(norm(n), []).append((sid, syn[0]))
    return names


def match_topics(topics, names):
    """Abbina ogni scheda alle specie dell'app tramite genere + specie del titolo."""
    matched = []
    for tid, t in topics.items():
        words = norm(t["title"]).split()
        for k in (3, 2):
            key = " ".join(words[:k])
            if key in names:
                for sid, member in names[key]:
                    matched.append((tid, t, sid, member))
                break
    return matched


def parse_posts(text):
    """Post della pagina: (comment_id, testo, crediti, immagini)."""
    for art in re.split(r"<article ", text)[1:]:
        cid = re.search(r"id='elComment_(\d+)'", art)
        # fino a </article>: altrimenti l'ultimo post si porterebbe dietro il resto della pagina
        # (inclusi i metadati JSON con crediti e immagini degli altri post)
        body = re.search(r"data-role=['\"]commentContent['\"](.*?)</article>", art, re.S)
        if not cid or not body:
            continue
        body = body.group(1)
        # a capo preservati: il credito finisce a fine riga (spesso segue una descrizione)
        lines = re.sub(r"<(?:br|/p|/div|/li|p|div)\b[^>]*>", "\n", body, flags=re.I)
        lines = html.unescape(re.sub(r"<[^>]+>", " ", lines)).replace("﻿", "")
        imgs = []
        for u in IMG_RE.findall(body):
            u = u.replace(".thumb.", ".").replace("http://", "https://")
            if u not in imgs:
                imgs.append(u)
        yield cid.group(1), re.sub(r"\s+", " ", lines).strip(), [c.strip() for c in AUTH_RE.findall(lines)], imgs


def credited_author(credits):
    """Autore autorizzato se TUTTI i nomi citati nei crediti lo sono (e sono lo stesso), altrimenti None."""
    people = set()
    for c in credits:
        for p in re.split(r",| e | and |&|/", c):
            p = re.sub(r"^(?:foto )?di ", "", norm(p))
            if p:
                people.add(p)
    if len(people) == 1 and next(iter(people)) in ALLOWED:
        return ALLOWED[people.pop()]
    return None


def uploader_ok(url):
    m = re.search(r"/post-(\d+)-", url)
    return m is None or int(m.group(1)) in OK_UPLOADERS


def compress(src, dest):
    """Come scripts/compress_one_inat.sh: 900px max lato, qualità 72, libjpeg-turbo."""
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    magick = subprocess.Popen(["magick", src, "-resize", "900x900>", "-strip", "-auto-orient", "ppm:-"],
                              stdout=subprocess.PIPE)
    subprocess.run(["cjpeg", "-quality", "72", "-optimize", "-progressive", "-outfile", dest],
                   stdin=magick.stdout, check=True)
    magick.stdout.close()
    if magick.wait() != 0:
        raise RuntimeError(f"magick fallito su {src}")


def load_removed(log_path):
    """{specie: set(obs_id)} da data/removed_amint.json, aggiornato col registro dell'app se passato."""
    removed = {}
    if os.path.exists(REMOVED_JSON):
        with open(REMOVED_JSON, encoding="utf-8") as f:
            removed = {sid: set(ids) for sid, ids in json.load(f).items()}
    if log_path:
        with open(log_path, encoding="utf-8") as f:
            for e in json.load(f):
                parts = e.get("sourceKey", "").split("::")
                if len(parts) == 3 and parts[1] == "amint":
                    removed.setdefault(parts[0], set()).add(parts[2])
    return removed


def load_excluded():
    """{nome file: motivo} da scripts/amint_escluse.txt"""
    excluded = {}
    if os.path.exists(EXCLUDED_TXT):
        with open(EXCLUDED_TXT, encoding="utf-8") as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    name, _, reason = line.rstrip("\n").partition("\t")
                    excluded[name] = reason
    return excluded


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true", help="ignora la cache delle pagine del forum")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--include-descrittivi", action="store_true",
                    help="includi anche il post descrittivo iniziale delle schede")
    ap.add_argument("--registro", help="registro_rimozioni.json scaricato dall'app")
    args = ap.parse_args()
    removed = load_removed(args.registro)
    excluded = load_excluded()
    for tool in ("magick", "cjpeg"):
        if not args.dry_run and not shutil.which(tool):
            sys.exit(f"manca {tool} (brew install imagemagick jpeg-turbo)")

    topics = list_topics(args.refresh)
    names = load_names()
    matched = match_topics(topics, names)
    group_ids = {sid for v in names.values() for sid, member in v if member}
    print(f"{len(topics)} schede nel forum, {len(matched)} abbinate a specie dell'app")

    all_data = {}
    skipped = {"senza credito": 0, "altri autori": 0, "descrittivi": 0, "caricate da altri": 0,
               "escluse in revisione": 0, "errori download": 0}
    for tid, t, sid, member in sorted(matched, key=lambda m: (m[2], m[0])):
        page, last = 1, 1
        while page <= last:
            url = f"{BASE}/topic/{tid}-{t['slug']}/" + (f"?page={page}" if page > 1 else "")
            text = fetch_page(url, args.refresh)
            last = last_page(text)
            page += 1
            for cid, body, credits, imgs in parse_posts(text):
                if not imgs:
                    continue
                if not credits:
                    skipped["senza credito"] += 1
                    continue
                author = credited_author(credits)
                if not author:
                    skipped["altri autori"] += 1
                    continue
                if "Tassonomia" in body and not args.include_descrittivi:
                    skipped["descrittivi"] += 1
                    continue
                photos = []
                # n conta anche le immagini scartate: il nome del file resta stabile tra una run e l'altra
                for n, u in enumerate(imgs, 1):
                    if not uploader_ok(u):
                        skipped["caricate da altri"] += 1
                        continue
                    name = f"{tid}_{cid}_{n}.jpg"
                    if name in excluded:
                        skipped["escluse in revisione"] += 1
                        continue
                    orig = os.path.join(ORIG_DIR, sid, name)
                    dest = os.path.join(IMAGES_DIR, sid, name)
                    if not args.dry_run:
                        try:
                            if not os.path.exists(orig):
                                os.makedirs(os.path.dirname(orig), exist_ok=True)
                                data = fetch(u, binary=True)
                                with open(orig, "wb") as f:
                                    f.write(data)
                            if not os.path.exists(dest):
                                compress(orig, dest)
                        except Exception as e:
                            print(f"  [warn] {u}: {e}")
                            skipped["errori download"] += 1
                            continue
                    photos.append({"file": os.path.relpath(dest, ROOT), "author": author, "original_url": u})
                post_url = f"{BASE}/topic/{tid}-{t['slug']}/?do=findComment&comment={cid}"
                entry = all_data.setdefault(sid, {"is_group": sid in group_ids, "observations": []})
                for k in range(0, len(photos), MAX_PHOTOS):
                    chunk = photos[k:k + MAX_PHOTOS]
                    obs_id = f"{tid}_{cid}" + (f"_{k // MAX_PHOTOS + 1}" if len(photos) > MAX_PHOTOS else "")
                    if obs_id in removed.get(sid, ()):
                        continue
                    obs = {
                        "obs_id": obs_id,
                        "obs_url": post_url, "author": author, "scheda": t["title"], "photos": chunk,
                    }
                    if member:
                        obs["member_species"] = member
                    entry["observations"].append(obs)

    n_obs = sum(len(e["observations"]) for e in all_data.values())
    n_photos = sum(len(o["photos"]) for e in all_data.values() for o in e["observations"])
    print(f"{len(all_data)} specie, {n_obs} carte, {n_photos} foto")
    print("scartati:", ", ".join(f"{k} {v}" for k, v in skipped.items()))
    if args.dry_run:
        print("[DRY RUN] nessun file scritto.")
        return

    if removed:
        with open(REMOVED_JSON, "w", encoding="utf-8") as f:
            json.dump({sid: sorted(ids) for sid, ids in sorted(removed.items())}, f, ensure_ascii=False, indent=1)

    # le compresse non più referenziate (es. autore escluso in un secondo momento) vanno tolte
    keep = {os.path.join(ROOT, p["file"]) for e in all_data.values() for o in e["observations"] for p in o["photos"]}
    for d, _, files in os.walk(IMAGES_DIR):
        for f in files:
            if os.path.join(d, f) not in keep:
                os.remove(os.path.join(d, f))
                print("  rimossa", os.path.relpath(os.path.join(d, f), ROOT))

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write("// generato da scripts/fetch_amint.py — non modificare a mano\n")
        f.write("const OBSERVATIONS_AMINT = ")
        json.dump(all_data, f, ensure_ascii=False)
        f.write(";\n")
    with open(CREDITS_MD, "w", encoding="utf-8") as f:
        f.write("# Crediti foto — AMINT\n\n")
        f.write("Foto dalle schede micologiche di [AMINT](https://www.amint.it/) (forum "
                "[funghiitaliani.it](https://www.funghiitaliani.it/)), usate con autorizzazione esplicita "
                "di AMINT limitatamente agli autori Pietro Curti, Tomaso Lezzi e Luigi Minciarelli. Tutti i diritti restano "
                "agli autori: non sono foto con licenza libera e non possono essere riutilizzate.\n\n")
        f.write("| Specie | Autore | Scheda | Post |\n|---|---|---|---|\n")
        for sid, entry in all_data.items():
            for o in entry["observations"]:
                label = f"{sid} ({o['member_species']})" if o.get("member_species") else sid
                scheda = o["scheda"].replace("|", "\\|")
                for _ in o["photos"]:
                    f.write(f"| {label} | © {o['author']} | {scheda} | [{o['obs_url']}]({o['obs_url']}) |\n")
    print(f"Scritti {os.path.relpath(OUT_JSON, ROOT)}, {os.path.relpath(OUT_JS, ROOT)}, {os.path.relpath(CREDITS_MD, ROOT)}")


if __name__ == "__main__":
    main()
