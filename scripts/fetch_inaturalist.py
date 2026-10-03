#!/usr/bin/env python3
"""
Scarica foto research-grade da iNaturalist per le specie in species.txt,
rispettando le licenze (solo CC0 / CC-BY / CC-BY-NC), e le organizza
per observation (non per singola foto) cosi' l'app puo' mostrare insieme
le foto complementari di uno stesso avvistamento (cappello, gambo, imenio...).

Uso:
  python3 fetch_inaturalist.py --dry-run --species amanita_caesarea,boletus_edulis
  python3 fetch_inaturalist.py                       # tutte le specie di species.txt
  python3 fetch_inaturalist.py --target 20           # default 20 observation/specie

Output:
  images/inat/<species_id>/<obs_id>_<n>.jpg
  data/observations.json
  CREDITS.md
  + report a schermo
"""
import argparse
import http.client
import json
import os
import socket
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
import random

NETWORK_ERRORS = (urllib.error.URLError, TimeoutError, ConnectionError,
                   http.client.HTTPException, socket.timeout, OSError)

API = "https://api.inaturalist.org/v1"
UA = "ChefungoE-study-app/1.0 (uso personale, non commerciale, studio patentino funghi)"
ALLOWED_LICENSES = {"cc0", "cc-by", "cc-by-nc"}
LICENSE_LABEL = {
    "cc0": "CC0",
    "cc-by": "CC BY",
    "cc-by-nc": "CC BY-NC",
}
LICENSE_URL = {
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "cc-by": "https://creativecommons.org/licenses/by/4.0/",
    "cc-by-nc": "https://creativecommons.org/licenses/by-nc/4.0/",
}
MAX_PER_OBSERVER = 2
MIN_PHOTOS = 1  # priorità 4->3->2->1 (vedi fetch_raw_candidates/collect_observations): 1 è l'ultima spiaggia
MAX_PHOTOS = 4
MIN_REQUEST_INTERVAL = 1.1  # secondi, ben sotto il limite di 100/min di iNaturalist

HERE = os.path.dirname(os.path.abspath(__file__))  # .../scripts
ROOT = os.path.dirname(HERE)  # radice del repo
IMAGES_DIR = os.path.join(ROOT, "images", "inat")
DATA_DIR = os.path.join(ROOT, "data")
SPECIES_TXT = os.path.join(HERE, "species.txt")
GROUPS_TXT = os.path.join(HERE, "species_groups.txt")
OBSERVATIONS_JSON = os.path.join(DATA_DIR, "observations.json")
CREDITS_MD = os.path.join(ROOT, "CREDITS.md")

_last_request_time = 0.0


def http_get(url, params=None, retries=5):
    """GET con User-Agent identificativo, rate-limit e retry/backoff su 429/5xx."""
    global _last_request_time
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    for attempt in range(1, retries + 1):
        wait = MIN_REQUEST_INTERVAL - (time.monotonic() - _last_request_time)
        if wait > 0:
            time.sleep(wait)
        _last_request_time = time.monotonic()
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 or 500 <= e.code < 600:
                backoff = 2 ** attempt
                print(f"    [warn] HTTP {e.code} su {url} — retry tra {backoff}s ({attempt}/{retries})")
                time.sleep(backoff)
                continue
            raise
        except NETWORK_ERRORS as e:
            backoff = 2 ** attempt
            print(f"    [warn] errore rete ({e}) — retry tra {backoff}s ({attempt}/{retries})")
            time.sleep(backoff)
            continue
    raise RuntimeError(f"impossibile completare la richiesta dopo {retries} tentativi: {url}")


OBSERVATIONS_JS = os.path.join(DATA_DIR, "observations.js")


def write_observations_outputs(all_data):
    """Scrive sia observations.json (dati grezzi) sia observations.js (stesso contenuto,
    avvolto in `const OBSERVATIONS = ...;` così l'app puo' caricarlo con un <script src>
    invece di fetch(), evitando i blocchi CORS quando index.html e' aperto via file://)."""
    with open(OBSERVATIONS_JSON, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    with open(OBSERVATIONS_JS, "w", encoding="utf-8") as f:
        f.write("// generato da scripts/fetch_inaturalist.py — non modificare a mano\n")
        f.write("const OBSERVATIONS = ")
        json.dump(all_data, f, ensure_ascii=False)
        f.write(";\n")


def write_credits_md(all_data):
    """Rigenera CREDITS.md da TUTTI i dati (all_data), non solo dalle specie elaborate
    nella run corrente — altrimenti una run parziale (es. --species per pochi test)
    cancellerebbe le righe delle specie già fatte in run precedenti."""
    rows = []
    for sid, entry in all_data.items():
        is_group = entry.get("is_group", False)
        for obs in entry.get("observations", []):
            obs_url = obs["obs_url"]
            member = obs.get("member_species")
            label_sid = f"{sid} ({member})" if is_group and member else sid
            for photo in obs.get("photos", []):
                rows.append((label_sid, photo["author"], photo["license_code"], obs_url))

    with open(CREDITS_MD, "w", encoding="utf-8") as f:
        f.write("# Crediti foto — iNaturalist\n\n")
        f.write("Foto pubblicate dalla community di [iNaturalist](https://www.inaturalist.org/), "
                "con licenza Creative Commons individuale per autore. Non affiliato a iNaturalist.\n\n")
        f.write("| Specie | Autore | Licenza | Osservazione |\n|---|---|---|---|\n")
        for sid, author, lic, obs_url in rows:
            label = LICENSE_LABEL.get(lic, lic or "?")
            # un "|" nel nome dell'autore romperebbe la tabella markdown
            author_safe = author.replace("|", "\\|")
            attribution = (f"{author_safe}, no rights reserved (CC0)" if lic == "cc0"
                           else f"© {author_safe}, some rights reserved ({label})")
            f.write(f"| {sid} | {attribution} | {label} | [{obs_url}]({obs_url}) |\n")


def resolve_one_name(name):
    """Risolve UN nome a un taxon preciso (preferibilmente rank species). Ritorna
    (id, matched_name) o None.
    La ricerca iNaturalist trova anche i sinonimi (es. nomi riclassificati in un altro genere):
    in quel caso l'unico risultato restituito ha già il nome CORRENTE, diverso da quello cercato.
    Se c'è un solo risultato di rank species lo accettiamo comunque (segnalando il cambio nome);
    solo con più risultati proviamo a disambiguare sul match esatto, altrimenti segnaliamo.
    Se non c'è nessun risultato a rank species, riproviamo sui ranghi infraspecifici
    (variety/subspecies/form): alcune forme citate nelle slide del corso (es. "Amanita
    phalloides var. alba") sono censite su iNaturalist solo a quel livello."""
    data = http_get(f"{API}/taxa", {"q": name, "rank": "species,variety,subspecies,form", "per_page": 30})
    results = data.get("results", [])
    species_results = [r for r in results if r.get("rank") == "species"]
    if len(species_results) == 1:
        r = species_results[0]
        return r["id"], r["name"]
    if len(species_results) > 1:
        exact = [r for r in species_results if r.get("name", "").lower() == name.lower()]
        if len(exact) == 1:
            r = exact[0]
            return r["id"], r["name"]
        candidates = ", ".join(r.get("name", "?") for r in species_results[:6])
        print(f"    [ambiguo] '{name}' risolve a {len(species_results)} taxon diversi (rank species): "
              f"{candidates} — salto, verificare a mano")
        return None

    infra_results = [r for r in results if r.get("rank") in ("variety", "subspecies", "form")]
    if len(infra_results) == 1:
        r = infra_results[0]
        return r["id"], r["name"]
    if len(infra_results) > 1:
        exact = [r for r in infra_results if r.get("name", "").lower() == name.lower()]
        if len(exact) == 1:
            r = exact[0]
            return r["id"], r["name"]
    return None


def resolve_taxon(names_to_try):
    """Prova ciascun nome nell'ordine dato come SINONIMI della stessa specie.
    Ritorna (taxon_id, matched_name, tried_name, note) o None."""
    for name in names_to_try:
        r = resolve_one_name(name)
        if r:
            taxon_id, matched_name = r
            notes = []
            if name != names_to_try[0]:
                notes.append(f"trovato tramite alias '{name}'")
            if matched_name.lower() != name.lower():
                notes.append(f"nome corrente su iNaturalist: '{matched_name}' (era '{name}')")
            return taxon_id, matched_name, name, "; ".join(notes)
    return None


def fetch_raw_candidates(taxon_id, target):
    """Scarica fino a 4 pagine di observation research-grade con foto per un taxon, mescolate
    (per non prendere solo le 'top voted', sempre le stesse ad ogni run)."""
    candidates = []
    page = 1
    per_page = 200
    max_pages = 4  # fino a 800 candidate; sufficiente anche per specie comuni
    while page <= max_pages and len(candidates) < target * 15:
        data = http_get(f"{API}/observations", {
            "taxon_id": taxon_id,
            "quality_grade": "research",
            "captive": "false",
            "photos": "true",
            "per_page": per_page,
            "page": page,
            "order_by": "votes",
            "order": "desc",
        })
        results = data.get("results", [])
        candidates.extend(results)
        if len(results) < per_page:
            break
        page += 1
    random.shuffle(candidates)
    return candidates


def _passes_filters(obs, seen_obs_ids, observer_count, rejected):
    """Controlla licenza/numero foto/cap-osservatore/duplicati. Se passa, aggiorna lo stato e ritorna True."""
    obs_id = obs.get("id")
    if obs_id in seen_obs_ids:
        rejected["duplicato"] += 1
        return False
    photos = obs.get("photos", [])
    if not (MIN_PHOTOS <= len(photos) <= MAX_PHOTOS):
        rejected['num_foto'] += 1
        return False
    licenses = [p.get("license_code") for p in photos]
    if any(lic not in ALLOWED_LICENSES for lic in licenses):
        rejected["licenza"] += 1
        return False
    observer = (obs.get("user") or {}).get("login", "sconosciuto")
    if observer_count.get(observer, 0) >= MAX_PER_OBSERVER:
        rejected["cap_osservatore"] += 1
        return False
    seen_obs_ids.add(obs_id)
    observer_count[observer] = observer_count.get(observer, 0) + 1
    return True


def collect_observations(taxon_id, target, exclude_ids=None, observer_count=None):
    """Raccoglie fino a `target` observation NUOVE valide per UN taxon (licenza + numero foto +
    cap/osservatore), escludendo quelle già presenti in `exclude_ids` (top-up incrementale:
    non ripesca/non tocca quelle già scaricate in run precedenti). Le candidate sono ordinate
    per numero di foto decrescente (priorità a 4 foto, poi 3, poi 2): molte osservazioni con
    solo 2-3 foto tagliano fuori dettagli diagnostici (es. volva non visibile nelle Amanita);
    a parità di numero di foto l'ordine resta quello mescolato da fetch_raw_candidates.
    `observer_count` può arrivare già pre-popolato (dai login degli osservatori già presenti
    da run precedenti): altrimenti il cap MAX_PER_OBSERVER varrebbe solo entro questa singola
    esecuzione, e un top-up successivo potrebbe sforarlo per lo stesso autore."""
    candidates = fetch_raw_candidates(taxon_id, target)
    candidates.sort(key=lambda o: -len(o.get("photos", [])))
    valid = []
    rejected = {"licenza": 0, "num_foto": 0, "cap_osservatore": 0, "duplicato": 0}
    seen_obs_ids = set(exclude_ids or ())
    observer_count = dict(observer_count or {})
    for obs in candidates:
        if len(valid) >= target:
            break
        if _passes_filters(obs, seen_obs_ids, observer_count, rejected):
            valid.append(obs)
    return valid, rejected, len(candidates)


def collect_observations_pooled(taxa, target, exclude_ids=None, observer_count=None):
    """Raccoglie fino a `target` observation NUOVE valide TOTALI, pescando a rotazione (round-robin)
    da più taxon (usato per le carte 'gruppo', es. le russule emeticine). `taxa` è una lista di
    (taxon_id, scientific_name). Il cap per osservatore e il dedup sono GLOBALI su tutto il gruppo.
    `exclude_ids` = observation già presenti (top-up incrementale). Come in collect_observations,
    ogni lista di candidate è ordinata per numero di foto decrescente (priorità 4 -> 3 -> 2).
    `observer_count` può arrivare pre-popolato dai login già presenti da run precedenti (vedi
    collect_observations)."""
    candidate_lists = {
        tid: sorted(fetch_raw_candidates(tid, target), key=lambda o: -len(o.get("photos", [])))
        for tid, _ in taxa
    }
    idx = {tid: 0 for tid, _ in taxa}
    name_by_taxon = {tid: name for tid, name in taxa}
    valid = []
    rejected = {"licenza": 0, "num_foto": 0, "cap_osservatore": 0, "duplicato": 0}
    seen_obs_ids = set(exclude_ids or ())
    observer_count = dict(observer_count or {})
    active = [tid for tid, _ in taxa]

    while active and len(valid) < target:
        progressed = False
        for tid in list(active):
            lst = candidate_lists[tid]
            i = idx[tid]
            while i < len(lst):
                obs = lst[i]
                i += 1
                if _passes_filters(obs, seen_obs_ids, observer_count, rejected):
                    obs["_member_species"] = name_by_taxon[tid]
                    valid.append(obs)
                    progressed = True
                    break
            idx[tid] = i
            if i >= len(lst) and tid in active:
                active.remove(tid)
            if len(valid) >= target:
                break
        if not progressed and len(valid) < target:
            break

    total_candidates = sum(len(v) for v in candidate_lists.values())
    per_species_counts = {}
    for tid, name in taxa:
        per_species_counts[name] = sum(1 for o in valid if o.get("_member_species") == name)
    return valid, rejected, total_candidates, per_species_counts


def large_url(photo):
    """Sostituisce il qualificatore di dimensione nell'URL della foto con 'large'."""
    url = photo.get("url") or ""
    for size in ("square", "small", "thumb", "medium", "original"):
        if f"/{size}." in url:
            return url.replace(f"/{size}.", "/large.")
    return url  # non riconosciuto: usa l'url cosi' com'e'


def download_file(url, dest_path, dry_run, retries=5):
    if os.path.exists(dest_path):
        return "gia-presente"
    if dry_run:
        return "da-scaricare"
    global _last_request_time
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    tmp_path = dest_path + ".part"
    for attempt in range(1, retries + 1):
        wait = MIN_REQUEST_INTERVAL - (time.monotonic() - _last_request_time)
        if wait > 0:
            time.sleep(wait)
        _last_request_time = time.monotonic()
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp, open(tmp_path, "wb") as f:
                f.write(resp.read())
            os.rename(tmp_path, dest_path)
            return "scaricata"
        except urllib.error.HTTPError as e:
            # un 404 (foto rimossa/privata lato iNaturalist) non si risolve ritentando:
            # solo 429/5xx meritano un retry con backoff (stesso criterio di http_get)
            if e.code == 429 or 500 <= e.code < 600:
                backoff = 2 ** attempt
                print(f"    [warn] HTTP {e.code} su {url} — retry tra {backoff}s ({attempt}/{retries})")
                time.sleep(backoff)
                continue
            raise
        except NETWORK_ERRORS as e:
            backoff = 2 ** attempt
            print(f"    [warn] download fallito ({e}) — retry tra {backoff}s ({attempt}/{retries})")
            time.sleep(backoff)
    raise RuntimeError(f"impossibile scaricare dopo {retries} tentativi: {url}")


def load_species_list(path, only_ids=None):
    species = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line.strip():
                continue
            sid, names = line.split("\t")
            if only_ids and sid not in only_ids:
                continue
            species.append((sid, names.split(";")))
    return species


def load_group_list(path, only_ids=None):
    """Formato: group_id<TAB>SpecieUno;alias1,SpecieDue,SpecieTre;alias1;alias2
    Le virgole separano MEMBRI DIVERSI del gruppo (es. Russula emetica, Russula mairei...);
    il punto e virgola dentro un membro separa invece alias/sinonimi dello STESSO membro,
    provati in ordine (utile perché iNaturalist ha spesso riclassificato il genere).
    Le foto vengono raccolte a rotazione da tutti i membri per formare un pool unico."""
    groups = []
    if not os.path.exists(path):
        return groups
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line.strip() or line.startswith("#"):
                continue
            gid, members = line.split("\t")
            if only_ids and gid not in only_ids:
                continue
            member_alias_lists = [[a.strip() for a in m.split(";")] for m in members.split(",")]
            groups.append((gid, member_alias_lists))
    return groups


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="mostra cosa farebbe senza scaricare nulla")
    ap.add_argument("--target", type=int, default=20, help="observation valide per specie (default 20)")
    ap.add_argument("--species", type=str, default=None, help="lista di id separati da virgola, per test su poche specie")
    ap.add_argument("--groups", action="store_true", help="elabora anche species_groups.txt (carte 'gruppo', pool condiviso)")
    ap.add_argument("--only-groups", action="store_true", help="elabora SOLO species_groups.txt, salta species.txt")
    ap.add_argument("--group-target", type=int, default=None, help="observation totali per gruppo (default: --target)")
    args = ap.parse_args()

    only_ids = set(args.species.split(",")) if args.species else None
    species_list = [] if args.only_groups else load_species_list(SPECIES_TXT, only_ids)
    group_list = load_group_list(GROUPS_TXT, only_ids) if (args.groups or args.only_groups) else []
    if not species_list and not group_list:
        print("Nessuna specie da processare (controlla --species, --groups e species.txt/species_groups.txt).")
        sys.exit(1)

    os.makedirs(DATA_DIR, exist_ok=True)
    if not args.dry_run:
        os.makedirs(IMAGES_DIR, exist_ok=True)

    # riprendibile: riusa observations.json esistente se presente
    all_data = {}
    if os.path.exists(OBSERVATIONS_JSON):
        with open(OBSERVATIONS_JSON, encoding="utf-8") as f:
            all_data = json.load(f)

    report_lines = []

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Elaborazione di {len(species_list)} specie singole "
          f"e {len(group_list)} gruppi, target {args.target} (specie singole) / "
          f"{args.group_target or args.target} (gruppi) observation\n")

    for sid, names in species_list:
      try:
        print(f"=== {sid} ({' / '.join(names)}) ===")
        resolved = resolve_taxon(names)
        if not resolved:
            msg = f"{sid}: NESSUN TAXON RISOLTO per {names} — saltata"
            print(f"    [errore] {msg}")
            report_lines.append(msg)
            continue
        taxon_id, matched_name, tried_name, note = resolved
        if note:
            print(f"    [info] {note}")
            # va anche nel report finale, non solo a schermo: altrimenti un cambio di
            # nome/taxon può passare inosservato se non si legge l'output per esteso
            report_lines.append(f"{sid}: {note}")
        print(f"    taxon iNaturalist: {matched_name} (id {taxon_id})")

        existing_entry = all_data.get(sid)
        existing_observations = existing_entry["observations"] if existing_entry else []
        exclude_ids = {o["obs_id"] for o in existing_observations}
        already = len(exclude_ids)
        remaining = max(0, args.target - already)

        if remaining == 0:
            msg = f"{sid}: già {already}/{args.target} — nessun top-up necessario"
            print(f"    [info] {msg}")
            report_lines.append(msg)
            continue

        # il cap MAX_PER_OBSERVER deve valere anche tra run diversi, non solo dentro
        # questa esecuzione: lo pre-popoliamo dai login già salvati nelle observation
        # esistenti (le voci più vecchie, senza "author_login", vengono ignorate qui:
        # il cap resta comunque più permissivo per loro, mai più severo)
        existing_observer_count = {}
        for o in existing_observations:
            login = o.get("author_login")
            if login:
                existing_observer_count[login] = existing_observer_count.get(login, 0) + 1

        valid_obs, rejected, n_candidates = collect_observations(
            taxon_id, remaining, exclude_ids, existing_observer_count)
        found_new = len(valid_obs)
        total_after = already + found_new
        shortfall = total_after < args.target
        print(f"    già presenti: {already} | nuove candidate esaminate: {n_candidates} | "
              f"nuove valide: {found_new}/{remaining} | totale dopo: {total_after}/{args.target}"
              + (" [SOTTO TARGET]" if shortfall else ""))
        print(f"    scartate — licenza non ammessa: {rejected['licenza']}, "
              f"num.foto fuori {MIN_PHOTOS}-{MAX_PHOTOS}: {rejected['num_foto']}, "
              f"cap 2/osservatore: {rejected['cap_osservatore']}, duplicati: {rejected['duplicato']}")

        report_lines.append(
            f"{sid}: {total_after}/{args.target} valide (già presenti={already}, nuove={found_new}, "
            f"candidate={n_candidates}, scartate: licenza={rejected['licenza']} "
            f"num_foto={rejected['num_foto']} cap_osservatore={rejected['cap_osservatore']})"
            + (" — SOTTO TARGET" if shortfall else "")
        )

        species_entry = {
            "scientific_name": matched_name,
            "taxon_id": taxon_id,
            "observations": list(existing_observations),
        }
        # assegnato SUBITO (non a fine ciclo): se una foto fallisce a metà specie e si
        # salta al prossimo giro, le osservazioni già scaricate con successo restano
        # comunque registrate invece di diventare file orfani senza voce in observations.json
        all_data[sid] = species_entry

        for obs in valid_obs:
          try:
            obs_id = obs["id"]
            obs_url = f"https://www.inaturalist.org/observations/{obs_id}"
            author_login = (obs.get("user") or {}).get("login") or "sconosciuto"
            author = (obs.get("user") or {}).get("name") or author_login
            photos_out = []
            for i, photo in enumerate(obs.get("photos", []), start=1):
                lic = photo.get("license_code")
                fname = f"{obs_id}_{i}.jpg"
                dest = os.path.join(IMAGES_DIR, sid, fname)
                rel_path = f"images/inat/{sid}/{fname}"
                url = large_url(photo)
                status = download_file(url, dest, args.dry_run)
                photos_out.append({
                    "file": rel_path,
                    "author": author,
                    "license_code": lic,
                    "license_url": LICENSE_URL.get(lic, ""),
                    "original_url": url,
                    "status": status,
                })
            species_entry["observations"].append({
                "obs_id": obs_id,
                "obs_url": obs_url,
                "author": author,
                "author_login": author_login,
                "photos": photos_out,
            })
          except Exception as e:
            print(f"    [warn] osservazione {obs.get('id')} saltata per errore: {e}")
            continue

        print()

        if not args.dry_run:
            # salvataggio incrementale: se il run si interrompe, il lavoro fatto finora resta
            write_observations_outputs(all_data)
      except Exception as e:
        msg = f"{sid}: ERRORE IMPREVISTO ({e}) — salto questa specie, il resto continua"
        print(f"    [errore] {msg}\n")
        report_lines.append(msg)
        continue

    group_target = args.group_target or args.target
    for gid, member_alias_lists in group_list:
      try:
        member_labels = [aliases[0] for aliases in member_alias_lists]
        print(f"=== GRUPPO {gid} ({', '.join(member_labels)}) ===")
        taxa = []
        for aliases in member_alias_lists:
            r = resolve_taxon(aliases)
            if not r:
                print(f"    [attenzione] '{aliases[0]}' non risolto (nessun alias) — escluso dal pool del gruppo")
                continue
            taxon_id, matched_name, tried_name, note = r
            print(f"    membro: {matched_name} (id {taxon_id})" + (f" — {note}" if note else ""))
            if note:
                report_lines.append(f"{gid} [gruppo, membro {matched_name}]: {note}")
            taxa.append((taxon_id, matched_name))
        if not taxa:
            msg = f"{gid}: NESSUN MEMBRO DEL GRUPPO RISOLTO — saltato"
            print(f"    [errore] {msg}")
            report_lines.append(msg)
            continue

        existing_entry = all_data.get(gid)
        existing_observations = existing_entry["observations"] if existing_entry else []
        exclude_ids = {o["obs_id"] for o in existing_observations}
        already = len(exclude_ids)
        remaining = max(0, group_target - already)

        if remaining == 0:
            msg = f"{gid} [gruppo]: già {already}/{group_target} — nessun top-up necessario"
            print(f"    [info] {msg}")
            report_lines.append(msg)
            continue

        existing_observer_count = {}
        for o in existing_observations:
            login = o.get("author_login")
            if login:
                existing_observer_count[login] = existing_observer_count.get(login, 0) + 1

        valid_obs, rejected, n_candidates, per_species_counts = collect_observations_pooled(
            taxa, remaining, exclude_ids, existing_observer_count)
        found_new = len(valid_obs)
        total_after = already + found_new
        shortfall = total_after < group_target
        print(f"    già presenti: {already} | nuove candidate esaminate: {n_candidates} | "
              f"nuove valide: {found_new}/{remaining} | totale dopo: {total_after}/{group_target}"
              + (" [SOTTO TARGET]" if shortfall else ""))
        print(f"    ripartizione tra le nuove: " + ", ".join(f"{n}={c}" for n, c in per_species_counts.items()))
        print(f"    scartate — licenza non ammessa: {rejected['licenza']}, "
              f"num.foto fuori {MIN_PHOTOS}-{MAX_PHOTOS}: {rejected['num_foto']}, "
              f"cap 2/osservatore: {rejected['cap_osservatore']}, duplicati: {rejected['duplicato']}")

        report_lines.append(
            f"{gid} [gruppo]: {total_after}/{group_target} valide (già presenti={already}, nuove={found_new}), "
            "ripartizione tra le nuove: " + ", ".join(f"{n}={c}" for n, c in per_species_counts.items())
            + (" — SOTTO TARGET" if shortfall else "")
        )

        group_entry = {
            "is_group": True,
            "group_members": [name for _, name in taxa],
            "taxon_ids": [tid for tid, _ in taxa],
            "observations": list(existing_observations),
        }
        # vedi commento nel ramo specie singole: assegnato subito per non orfanizzare
        # le foto già scaricate se un'osservazione a metà gruppo fallisce
        all_data[gid] = group_entry

        for obs in valid_obs:
          try:
            obs_id = obs["id"]
            obs_url = f"https://www.inaturalist.org/observations/{obs_id}"
            author_login = (obs.get("user") or {}).get("login") or "sconosciuto"
            author = (obs.get("user") or {}).get("name") or author_login
            member_species = obs.get("_member_species", "")
            photos_out = []
            for i, photo in enumerate(obs.get("photos", []), start=1):
                lic = photo.get("license_code")
                fname = f"{obs_id}_{i}.jpg"
                dest = os.path.join(IMAGES_DIR, gid, fname)
                rel_path = f"images/inat/{gid}/{fname}"
                url = large_url(photo)
                status = download_file(url, dest, args.dry_run)
                photos_out.append({
                    "file": rel_path,
                    "author": author,
                    "license_code": lic,
                    "license_url": LICENSE_URL.get(lic, ""),
                    "original_url": url,
                    "status": status,
                })
            group_entry["observations"].append({
                "obs_id": obs_id,
                "obs_url": obs_url,
                "author": author,
                "author_login": author_login,
                "member_species": member_species,
                "photos": photos_out,
            })
          except Exception as e:
            print(f"    [warn] osservazione {obs.get('id')} saltata per errore: {e}")
            continue

        print()

        if not args.dry_run:
            write_observations_outputs(all_data)
      except Exception as e:
        msg = f"{gid} [gruppo]: ERRORE IMPREVISTO ({e}) — salto questo gruppo, il resto continua"
        print(f"    [errore] {msg}\n")
        report_lines.append(msg)
        continue

    if not args.dry_run:
        write_observations_outputs(all_data)
        print(f"Scritto {OBSERVATIONS_JSON} e {OBSERVATIONS_JS}")

        write_credits_md(all_data)
        print(f"Scritto {CREDITS_MD}")
    else:
        print("[DRY RUN] nessun file scritto su disco (ne' immagini ne' observations.json/CREDITS.md).")

    print("\n--- REPORT FINALE ---")
    for line in report_lines:
        print(" - " + line)


if __name__ == "__main__":
    main()
