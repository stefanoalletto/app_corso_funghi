// Versione dell'app e novità mostrate all'utente alla prima visita dopo un aggiornamento.
// Una voce per ogni version bump, la più recente in cima; APP_VERSION = versione della prima voce.
const CHANGELOG = [
  { version: "1.0.2", notes: [
    "Pulsante \"Solo specie esame\" nel pannello Specie (elenchi regionali FVG)",
    "Caratteri morfologici (cappello, imenio, gambo, carne) completati dove mancavano",
    "Descrizioni della carne più chiare in \"Domande carne/odore/sapore\"",
    "Nota di cottura per Russula olivacea",
    "Numero di versione in fondo alla pagina e questo elenco delle novità"
  ]}
];
const APP_VERSION = CHANGELOG[0].version;
