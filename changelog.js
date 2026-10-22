// Versione dell'app e novità mostrate all'utente alla prima visita dopo un aggiornamento.
// Una voce per ogni version bump, la più recente in cima; APP_VERSION = versione della prima voce.
const CHANGELOG = [
  { version: "1.3.0", notes: [
    "Quasi 1000 nuove foto dalle schede AMINT di Pietro Curti, Tomaso Lezzi e Luigi Minciarelli, per gentile concessione di AMINT",
    "Le foto AMINT si mescolano a quelle di iNaturalist; dopo la risposta c'è il link alla scheda originale",
    "Tolte molte altre foto iNaturalist poco chiare o sbagliate, sostituite con nuove osservazioni dove servivano"
  ]},
  { version: "1.2.0", notes: [
    "Di default sono attive solo le specie del programma d'esame (cambialo da \"Specie…\")",
    "Per le specie sospette la scheda indica che sono sospette per la legge regionale FVG",
    "Sostituite molte foto poco chiare o sbagliate con nuove osservazioni"
  ]},
  { version: "1.1.0", notes: [
    "Il campo della risposta ora diventa rosso (sbagliata) o verde (giusta), molto più visibile",
    "Scrivendo una sola parola si verifica solo il genere: il pulsante \"Verifica solo il genere\" non serve più",
    "Sostituite alcune foto sbagliate o poco chiare con nuove osservazioni"
  ]},
  { version: "1.0.2", notes: [
    "Pulsante \"Solo specie esame\" nel pannello Specie (elenchi regionali FVG)",
    "Caratteri morfologici (cappello, imenio, gambo, carne) completati dove mancavano",
    "Descrizioni della carne più chiare in \"Domande carne/odore/sapore\"",
    "Nota di cottura per Russula olivacea",
    "Numero di versione in fondo alla pagina e questo elenco delle novità"
  ]}
];
const APP_VERSION = CHANGELOG[0].version;
