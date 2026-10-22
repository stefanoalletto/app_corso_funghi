# Che fungo è?

Flashcard per allenarsi al riconoscimento dei funghi in vista dell'esame del patentino di
raccolta. Mostra una foto, tu provi a indovinare la specie, poi verifichi la risposta.

Non affiliato a nessun ente o associazione micologica: è un progetto personale di studio.

## Uso

Basta aprire `index.html` in un browser: è una landing page con i disclaimer d'uso e un
mini tutorial, con un pulsante per entrare nell'app vera e propria (`app.html`). Se il
browser dovesse bloccare il caricamento degli script locali, avvia un piccolo server dalla
cartella del progetto:

```
python3 -m http.server 8000
```

e apri `http://localhost:8000/`.

## Struttura

```
index.html            landing page: disclaimer, crediti, mini tutorial, pulsante "inizia"
app.html               l'app
data.js               specie, nomi, categorie, caratteristiche morfologiche dalle slide
data/
  observations.json   dati grezzi delle osservazioni iNaturalist
  observations.js      stesso contenuto, avvolto per essere caricato con <script src>
  observations_amint.json/.js  ritrovamenti dalle schede AMINT (stesso formato)
  removed_amint.json   ritrovamenti AMINT eliminati a mano, mai più inclusi
images/
  inat/<specie>/        foto della community iNaturalist, raggruppate per osservazione
  amint/<specie>/       foto delle schede AMINT (Curti, Lezzi, Minciarelli), raggruppate per ritrovamento
scripts/
  fetch_inaturalist.py  scarica le foto iNaturalist rispettando le licenze
  species.txt           elenco specie -> nome scientifico (con eventuali sinonimi)
  species_groups.txt     elenco delle carte "gruppo" (più specie in un pool condiviso)
  replace_removed.py     sostituisce le osservazioni eliminate (registro dell'app) con nuove da iNaturalist
  compress_one_inat.sh   comprime una foto iNaturalist (libjpeg-turbo, 900px, qualità 72)
  fetch_amint.py         scarica le foto delle schede AMINT dei soli autori autorizzati
fonts/                 font ospitati in locale (niente richieste a Google Fonts), licenza OFL
CREDITS.md             attribuzione per ogni foto iNaturalist (autore, licenza, link)
CREDITS_AMINT.md       attribuzione per ogni foto AMINT (autore, scheda, link al post)
```

## Licenze

- **Codice**: MIT (vedi `LICENSE`).
- **Font** (`fonts/`): Fraunces, Work Sans, IBM Plex Mono, sotto SIL Open Font License 1.1
  (testi in `fonts/OFL-*.txt`).
- **Foto iNaturalist** (`images/inat/`): ciascuna sotto la licenza Creative Commons
  individuale del proprio autore (CC0, CC BY o CC BY-NC — mai licenze più restrittive).
  Attribuzione completa in `CREDITS.md`. Le foto CC BY-NC non possono essere usate a
  scopo commerciale.
- **Foto AMINT** (`images/amint/`): tutti i diritti riservati agli autori (Pietro Curti,
  Tomaso Lezzi, Luigi Minciarelli), usate con autorizzazione esplicita di AMINT limitata a questi autori.
  Non sono foto con licenza libera: non riutilizzarle fuori da questa app.

## Rigenerare o estendere le foto iNaturalist

```
cd scripts
python3 fetch_inaturalist.py --dry-run --species <id1>,<id2>   # prova su poche specie
python3 fetch_inaturalist.py --target 20                        # tutte le specie di species.txt
python3 fetch_inaturalist.py --groups --group-target 20         # anche le carte "gruppo"
```

Lo script è idempotente (non riscarica i file già presenti) e scrive un report a schermo
con quante osservazioni valide ha trovato per specie e perché ha scartato le altre
(licenza non ammessa, numero di foto fuori range, troppe dello stesso osservatore).

## Foto AMINT

```
python3 scripts/fetch_amint.py --dry-run   # report: schede abbinate, foto prese e scartate
python3 scripts/fetch_amint.py             # scarica, comprime, scrive observations_amint + CREDITS_AMINT
python3 scripts/fetch_amint.py --refresh   # riscarica le pagine del forum invece di usare la cache
```

AMINT ha autorizzato l'uso delle foto di soli tre autori: Pietro Curti, Tomaso Lezzi e
Luigi Minciarelli (nell'autorizzazione scritto "Minciatelli": refuso, sul forum quella grafia
non compare mai; confermato che è lui). Le schede sono topic del forum funghiitaliani.it e ogni post
(un ritrovamento) dice "Foto di <Autore>": lo script prende un post solo se l'unico autore
citato è autorizzato, e scarta comunque le immagini caricate da altri utenti del forum.
Esclude anche il post descrittivo iniziale delle schede, che ha un solo credito per tutte le
immagini (`--include-descrittivi` per includerlo). I ritrovamenti AMINT eliminati dall'app si
tolgono con `python3 scripts/fetch_amint.py --registro ~/Downloads/registro_rimozioni.json`.

## Disclaimer

Le identificazioni delle foto dipendono dal consenso della community di iNaturalist
(osservazioni "research grade"). Possono contenere errori.
Questa app serve solo per esercitarsi al riconoscimento visivo: **non usarla come unica
fonte per decidere se un fungo è commestibile.**

## Sostituire le osservazioni sbagliate

Dalla debug mode dell'app, "Elimina esemplare corrente" rimuove un'osservazione solo nel
browser e la annota nel registro scaricabile. Per toglierle davvero e rimpiazzarle:

```
python3 scripts/replace_removed.py ~/Downloads/registro_rimozioni.json --dry-run
python3 scripts/replace_removed.py ~/Downloads/registro_rimozioni.json
```

Le foto AMINT non passano dalla revisione (sono considerate corrette) ma contano nel totale: si
integra da iNaturalist solo se una specie scende sotto 30 esemplari (iNat rimaste + carte AMINT),
e solo fino a tornare a 30 (`TARGET_TOTAL` in `review.html` e `replace_removed.py`).

Gli id eliminati finiscono in `data/removed_observations.json` (cumulativo, da committare):
il fetch non li ripescherà mai. Le voci già eliminate in passato sono gestite.
