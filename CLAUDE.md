# App corso funghi ("Che fungo è?")

Flashcard per il patentino di raccolta funghi (esame FVG): foto → l'utente scrive la specie → verifica. Progetto personale di studio, in italiano (UI, commenti, commit). Sito statico senza build né dipendenze: si apre con `python3 -m http.server`. Repo privato finché il CMF non conferma l'uso delle foto delle slide (`images/slides/` è gitignored, non più usata dall'app: fonte solo iNaturalist).

## Struttura

- `index.html`: landing page (disclaimer, crediti, tutorial). `app.html`: tutta l'app (HTML+CSS+JS in un file, IIFE unica in fondo; ~1400 righe).
- `data.js`: `SPECIES` (array) + `EXAM_SPECIES_IDS` (Set, specie del programma d'esame). Una specie: `{id, cat, names:[...], common, n, ref:{commestibilita,cappello,imenio,gambo,carne,habitat: [stringhe]}}`. `cat` ∈ commestibile | condizionata | sospetto | tossico | mortale. Le carte "gruppo" hanno `group:true` e `members:[[nome attuale, sinonimi...],...]` (da tenere allineato con `scripts/species_groups.txt`).
- `data/observations.js` (+ `.json`): GENERATI da `scripts/fetch_inaturalist.py`, non modificare a mano. `OBSERVATIONS[specie_id].observations[]` → ogni osservazione ha più foto dello stesso avvistamento, mostrate insieme.
- `images/inat/<specie_id>/<obs>_<n>.jpg`: foto compresse (900px, q72). Gli originali stanno in `images_inat_original_resolution/` (gitignored, backup locale). `CREDITS.md` è generato dallo script.
- `scripts/`: `fetch_inaturalist.py` (idempotente, solo licenze CC0/CC-BY/CC-BY-NC, aggiorna observations + CREDITS), `species.txt` (`id<TAB>nome;sinonimo`), `species_groups.txt`, `compress_one_inat.sh`, `trim_lt4_photos.py`. Uso in `README.md`.
- `fonts/`: font locali (niente Google Fonts). Licenze: codice MIT, foto CC individuali.

## Convenzioni dell'app (`app.html`)

- Stato persistito in localStorage con prefisso `funghi_` (sempre via `lsGet`/`lsSet`, che non lanciano se lo storage è bloccato). Elenco chiavi: grep `LS_`.
- Mazzo: `buildDeck()` filtra per categorie attive / specie disabilitate / osservazioni rimosse, poi mescola. Il mazzo si resetta SOLO al refresh o al cambio di selezione categorie/fonte/specie; per effetti collaterali usare `rebuildDeckKeepingPosition()`.
- Risposta: confronto fuzzy (`normalize`, Levenshtein, match parola per parola) contro `acceptedNames(draw)`; per i gruppi vale il nome del membro dell'osservazione + i nomi di genere.
- Testo dai dati esterni (iNaturalist, autori) sempre con `escapeHtml`; link con `safeUrl`.
- Modali: classi `modal-overlay`/`modal-panel`/`modal-header`/`modal-body`; Escape chiude.
- Debug mode (checkbox in fondo): filtro per numero di foto, scorrimento sequenziale, singola osservazione per specie; "Elimina esemplare corrente" rimuove localmente un'osservazione sbagliata (registro scaricabile).
- Pulsante "Domande carne/odore/sapore" mostra `ref.carne` come elenco "- voce": ogni voce deve avere senso da sola, quindi la prima inizia con "carne ..." minuscolo (le altre voci sono tutte minuscole, senza punto finale).
- `ref` viene dalle slide del corso (prioritarie), integrato da funghiitaliani.it dove i campi mancavano; non tutte le specie hanno tutti i campi.

## Versioni e changelog

Ogni commit che cambia qualcosa di visibile all'utente deve includere un version bump:

1. Aggiungi in cima a `CHANGELOG` in `changelog.js` una voce `{ version, notes: [...] }` con la nuova versione (semver: patch per correzioni di contenuti, minor per nuove funzioni).
2. `APP_VERSION` viene dalla prima voce, non va modificata a mano.
3. Le note sono per gli utenti (italiano, brevi, niente gergo da commit) e compaiono nel modale "Novità dalla tua ultima visita" di `app.html`, che si apre solo se la versione è più alta di quella salvata in localStorage (`funghi_lastSeenVersion`).
4. Il bump va nello stesso commit della modifica. Commit solo interni (refactor, script, docs) non richiedono bump.
