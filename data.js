// Dati delle specie — Lezioni 3 (commestibili) e 4 (mortali/tossici)
// Materiale di studio personale per l'esame del patentino raccolta funghi
// Foto tratte dalle slide del corso (fonti citate: A.M.I.N.T. CSM Fungomania/6; funghiitaliani.it, F. Buligan)
// "ref": caratteristiche morfologiche così come riportate nelle slide del corso (non tutte le specie
// hanno tutti i campi: alcune slide non descrivono una parte, altre specie — vescie, gyromitra, leotia —
// non hanno un vero cappello/imenio a lamelle).
// "members" (solo carte gruppo): le specie da cui vengono le foto iNaturalist del gruppo, ognuna con
// i suoi sinonimi (nome attuale su iNaturalist per primo, poi i nomi storici). Rispecchia
// scripts/species_groups.txt: se si aggiunge un membro lì, va aggiunto anche qui.

const SPECIES = [
// ---------------- COMMESTIBILI (Lezione 3) ----------------
{ id:"amanita_caesarea", cat:"commestibile", names:["Amanita caesarea"], common:"Ovolo buono", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["6-15 cm","liscio, con margine striato","colore aranciato e brillante"],
    imenio:["lamelle fitte e libere al gambo (fungo eterogeneo)","lamelle di colore giallo"],
    gambo:["cilindrico e liscio","anello \"a gonnellina\", di colore giallo","alla base ampia e robusta volva a sacco"],
    carne:["carne bianca, leggermente giallina","odore e sapore tenui e gradevoli"],
    habitat:["simbionte, estivo","boschi termofili di quercia e castagno"]
  },
},
{ id:"agaricus_campestris", cat:"commestibile", names:["Agaricus campestris"], common:"Prataiolo", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["6-10 cm","dapprima emisferico, poi da adulto piano-convesso","bianco, con margine spesso appendicolato"],
    imenio:["lamelle fitte e libere al gambo (fungo eterogeneo)","colore rosa, che a maturazione tenderà a un viola molto scuro"],
    gambo:["cilindrico e liscio","colore rosato sopra l'anello \"fugace\", bianco inferiormente"],
    carne:["carne bianca e soda","leggero viraggio al rosato al taglio","odore e sapore gradevoli, non intensi"],
    habitat:["saprotrofo, si sviluppa in prati e pascoli","da primavera ad autunno"]
  },
},
{ id:"boletus_edulis", cat:"commestibile", names:["Boletus edulis"], common:"Porcino", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["5-25 cm","colore nocciola","cuticola untuosa"],
    imenio:["a tubuli e pori tondi","bianchi nei giovani esemplari, poi giallognoli, infine verdastri"],
    gambo:["robusto e spesso","reticolo biancastro su gambo bianco"],
    carne:["carne bianca e immutabile","odore e sapore particolarmente gradevoli"],
    habitat:["simbionte, molto comune in FVG nei boschi di montagna sotto conifere e latifoglie","presente per tutta l'estate ed autunno"]
  },
},
{ id:"boletus_aereus", cat:"commestibile", names:["Boletus aereus"], common:"Porcino nero", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["6-20 cm","cuticola asciutta e vellutata","tonalità ramate su fondo marrone scuro non uniformi"],
    imenio:["a tubuli e pori tondi","bianchi nei giovani esemplari, poi giallognoli, infine verdastri"],
    gambo:["robusto e massiccio, marrone chiaro","reticolo marrone fine, più scuro all'apice"],
    carne:["carne bianca e immutabile","odore e sapore particolarmente gradevoli"],
    habitat:["simbionte, poco presente in regione","tipico di boschi termofili di latifoglie"]
  },
},
{ id:"boletus_pinophilus", cat:"commestibile", names:["Boletus pinophilus"], common:"Porcino pinicolo", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["10-30 cm","cuticola umida e rugosa, spesso con pruina bianca soprattutto da giovane","colore vinoso"],
    imenio:["a tubuli e pori tondi","bianchi nei giovani esemplari, poi giallognoli, infine olivastri"],
    gambo:["robusto e massiccio, bianco con sfumature rossicce","reticolo bianco"],
    carne:["carne bianca e immutabile","odore e sapore gradevoli"],
    habitat:["simbionte di latifoglie e aghifoglie","si raccoglie da inizio estate a fine autunno"]
  },
},
{ id:"boletus_aestivalis", cat:"commestibile", names:["Boletus aestivalis","Boletus reticulatus"], common:"Porcino estatino", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["5-10 cm","cuticola asciutta e spesso screpolata","colore dal nocciola al bruno"],
    imenio:["a tubuli e pori tondi, come in B. edulis"],
    gambo:["robusto e massiccio, bianco","reticolo molto evidente, esteso fino alla base"],
    carne:["carne bianca e immutabile","odore e sapore gradevoli"],
    habitat:["simbionte di querce e castagni, non disdegna alcune conifere"]
  },
},
{ id:"clitocybe_geotropa", cat:"commestibile", names:["Clitocybe geotropa","Infundibulicybe geotropa"], common:"Cimballo", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["10-20 cm","da convesso ad imbutiforme, quasi sempre con umbone centrale","colore crosta di pane, margine involuto soprattutto da giovane"],
    imenio:["lamelle concolori al cappello, fitte e decorrenti, intervallate da lamellule"],
    gambo:["cilindrico e leggermente clavato, colori simili al cappello"],
    carne:["carne bianca e soda","odore gradevole, sapore dolce e fruttato"],
    habitat:["saprotrofo terricolo, spunta in tardo autunno"]
  },
},
{ id:"calocybe_gambosa", cat:"commestibile", names:["Calocybe gambosa"], common:"Prugnolo, fungo di San Giorgio", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["5-10 cm","forma talvolta irregolare, margine spesso arrotondato verso le lamelle","colore dall'avorio/crema fino al giallo/nocciola"],
    imenio:["lamelle fitte e sottili, smarginate all'attaccatura del gambo","colore bianco crema"],
    gambo:["cilindrico e robusto, tozzo, a base ingrossata","colorazioni bianche, a volte ocracee alla base"],
    carne:["carne bianca e soda","odore forte di farina, che ricorda il pane fresco"],
    habitat:["saprotrofo, fruttifica sotto rosacee, si raccoglie in primavera"]
  },
},
{ id:"calvatia_gigantea", cat:"commestibile", names:["Calvatia gigantea"], common:"Vescia gigante", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["nessun vero cappello/imenio: carpoforo (esoperidio) di 30-60 cm, subgloboso","colorazione biancastra, abbastanza liscia, che con il tempo tende a screpolarsi e assumere colorazioni giallastre"],
    carne:["la polpa interna si chiama gleba: bianca e soda, con buon odore e sapore SOLO quando è di colore bianco","diventa poi pulverulenta e giallo verdognola, infine bruno ocra a pieno sviluppo (non più commestibile)"],
    habitat:["saprotrofo terricolo, si raccoglie raramente su prati e pascoli, periodo estivo-autunnale"]
  } },
{ id:"calvatia_utriformis", cat:"commestibile", names:["Calvatia utriformis"], common:"Vescia areolata (solo a gleba bianca)", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["nessun vero cappello/imenio: carpoforo (esoperidio) di 8-15 cm","colore bianco, finemente tomentoso, dissociato in areole poligonali, con una base corta"],
    carne:["la gleba (polpa) è bianca e soda, con buon odore e sapore SOLO quando perfettamente bianca","diventa poi pulverulenta e giallo verdognola, infine bruno ocra a pieno sviluppo (non più commestibile)"],
    habitat:["saprotrofo terricolo molto comune, si raccoglie su prati e pascoli, periodo estivo-autunnale"]
  } },
{ id:"coprinus_comatus", cat:"commestibile", names:["Coprinus comatus"], common:"Fungo dell'inchiostro", n:1,
  ref:{
    commestibilita:["Commestibilità libera","va cucinato subito dopo la raccolta, finché è ancora bianco"],
    cappello:["6-20 cm","ad \"ogiva\" od ovoide allungato","superficie lacerata da squame fioccose bianche, che maturano rapidamente verso tinte più scure fino al nero"],
    imenio:["lamelle libere e fitte, da giovane bianche, poi rosa, infine nere e deliquescenti"],
    gambo:["cilindrico, slanciato e cavo, con un anello posto in basso"],
    carne:["carne tenera, acquosa, bianca, poi rosata, infine nerastra e deliquescente","odore mite, sapore gradevole"],
    habitat:["saprotrofo terricolo, comune in estate e autunno nei prati e nei giardini"]
  } },
{ id:"hydnum_repandum", cat:"commestibile", names:["Hydnum repandum"], common:"Steccherino dorato", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["4-15 cm","sodo, compatto, crateriforme, lobato sul margine","vellutato, colore giallo/albicocca"],
    imenio:["ad idni (aculei) decorrenti, prima biancastri poi concolori al cappello"],
    gambo:["eccentrico, corto, robusto, colore più chiaro del cappello"],
    carne:["carne biancastra, soda, friabile e gessosa","odore fungino, sapore leggermente amarognolo"],
    habitat:["simbionte sia di latifoglia che di conifera, fruttifica a piccoli gruppi dall'estate inoltrata al tardo autunno"]
  },
},
{ id:"lactarius_deliciosus", cat:"commestibile", names:["Lactarius deliciosus"], common:"Sanguinello del pino", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["6-10 cm","aranciato, leggermente imbutiforme a maturità","decorazioni dette \"guttule e zonature\"","vira al verde molto lentamente in età adulta"],
    imenio:["lamelle fitte, sottili, leggermente decorrenti","si macchiano di verde con il tempo"],
    gambo:["evidenti \"scrobicoli\"","alla sezione quasi cavo, geme un lattice color carota immutabile"],
    carne:["carne cassante, pallida al centro, color carota sotto la superficie","lattice di colore arancione tipico, immutabile","odore fruttato, sapore dolciastro"],
    habitat:["simbionte di pino, si raccoglie da metà estate a fine autunno"]
  },
},
{ id:"lactarius_salmonicolor", cat:"commestibile", names:["Lactarius salmonicolor"], common:"Sanguinello dell'abete bianco", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["zonature concentriche ben visibili","nessuna macchia o sfumatura verdastra (non inverdisce)"],
    gambo:["presenza di scrobicoli (piccole fossette)","scrobicoli piccoli, allungati, ellittici e irregolari, molto caratteristici"],
    carne:["lattice color carota, immutabile"],
    habitat:["esclusivo di abete bianco","autunnale (ottobre-novembre)"]
  }
},
{ id:"lactarius_deterrimus", cat:"commestibile", names:["Lactarius deterrimus"], common:"Sanguinello dell'abete rosso", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["4-10 cm, convesso da giovane, poi piano-convesso e infine imbutiforme","arancio intenso o arancio-brunastro, inverdisce facilmente","cuticola separabile, lucida e viscida a tempo umido, con zonature concentriche"],
    imenio:["lamelle abbastanza fitte, arcuate o subdecorrenti, forcate vicino al gambo","colore arancio-giallognolo/arancio-rosato, si macchiano di verde dove ferite o toccate"],
    gambo:["quasi sempre senza scrobicoli","cilindrico, a volte eccentrico, fragile e presto cavo","concolore al cappello ma più scuro"],
    carne:["lattice color carota, immutabile","arancio pallido sotto la cuticola, biancastra al centro","sapore amarognolo, odore fruttato-acidulo poco gradevole"],
    habitat:["esclusivo di abete rosso","peccete umide, da luglio a ottobre"]
  }
},
{ id:"macrolepiota_procera", cat:"commestibile", names:["Macrolepiota procera"], common:"Mazza di tamburo", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["10-25 cm","da ovoidale nei giovani esemplari a completamente aperto a maturità","umbone centrale più scuro e liscio, cuticola più chiara con tipiche placche irregolari scure"],
    imenio:["lamelle fitte, bianche, libere al gambo","a maturità diventano color crema"],
    gambo:["molto alto, cilindrico, sempre ornamentato da zebrature brune su fondo più chiaro","grosso anello doppio e scorrevole, fioccoso nella parte inferiore","sempre un grosso bulbo basale"],
    carne:["carne bianco/rosata, poco consistente e morbida sul cappello, fibrosa sul gambo","sentore e sapore di nocciola"],
    habitat:["saprotrofo terricolo, si raccoglie in estate e autunno nei prati e ai margini dei boschi"]
  },
},
{ id:"rozites_caperatus", cat:"commestibile", names:["Rozites caperatus","Cortinarius caperatus"], common:"Caperata", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["6-10 cm","da giovane subgloboso, da maturo spianato con umbone ottuso","grinzoso, colore ocraceo, con pruina biancastra sulla superficie (riflessi azzurro-violetto tra le rughe)"],
    imenio:["lamelle uncinate e piuttosto spaziate, filo irregolare e biancastro"],
    gambo:["cilindrico e regolare, biancastro","fibroso e pruinoso sopra l'anello (piccolo, membranoso, aderente, bordo doppio e scorrevole)"],
    carne:["carne da giovane soda, a maturazione molle, colore crema biancastro","buon odore leggero e buon sapore"],
    habitat:["simbionte in boschi montani sia di latifoglie che di conifere, molto comune sotto abete rosso","si raccoglie in estate ed autunno"]
  },
},
{ id:"russula_cyanoxantha", cat:"commestibile", names:["Russula cyanoxantha"], common:"Colombina maggiore / violetta", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["5-15 cm","convesso, leggermente depresso","cuticola con fibrille innate, lucida e untuosa a clima umido, parzialmente separabile","colori molto variabili dal rosa violetto al blu verdastro"],
    imenio:["lamelle \"lardacee\" (untuose al tatto, elastiche, non fragili come nelle altre russule), adnate e fitte, bianche al crema"],
    gambo:["liscio e bianco, a volte con sfumature violette","più corto del diametro del cappello"],
    carne:["carne soda, compatta, detta \"cassante\"","odore lieve fungino, sapore moderatamente dolce","lamelle con consistenza tipicamente «lardacea»"],
    habitat:["simbionte molto comune sia di latifoglie che di conifere, si raccoglie da primavera ad autunno inoltrato"]
  },
},
{ id:"russula_virescens", cat:"commestibile", names:["Russula virescens"], common:"Colombina verde", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["6-10 cm","a maturità solitamente verdastro, tipicamente screpolato e dissociato in caratteristiche areole","cuticola asciutta"],
    imenio:["lamelle appena aderenti al gambo, forcate, fitte e fragili, intervallate da qualche lamellula","colore bianco crema"],
    gambo:["non troppo lungo, cilindrico, a volte ingrossato in modo non uniforme","superficie pruinosa-rugosa"],
    carne:["peso specifico decisamente superiore a molte altre specie","buon odore e sapore dolciastro"],
    habitat:["simbionte molto comune sia di latifoglie che di conifere, si raccoglie in estate e inizio autunno"]
  },
},
{ id:"cantharellus_cibarius", cat:"commestibile", names:["Cantharellus cibarius"], common:"Galletto, gialletto, finferlo", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["1-5 cm","carnoso e sodo, da appianato ad imbutiforme, margine lobato","colore tipicamente giallo, come tutte le altre parti del fungo"],
    imenio:["pseudolamelle spaziate, decorrenti, concolori al cappello ma di tonalità più chiara"],
    gambo:["sodo, pieno, corto e tozzo, attenuato dall'alto al basso, anche cilindrico o irregolare, concolore al cappello"],
    carne:["carne soda e bianca","delicato sentore fruttato, sapore dolciastro"],
    habitat:["simbionte molto diffuso sia di latifoglie che di conifere, si raccoglie da primavera ad autunno, prevalentemente diffuso nelle \"peccete\""]
  },
},
{ id:"cantharellus_gruppo", cat:"commestibile", label:"Gruppo Cantharellus cibarius (pallens / amethysteus / friesii)", names:["Cantharellus pallens","Cantharellus amethysteus","Cantharellus friesii"], common:"Gruppo del cibarius (pallens / amethysteus / friesii)", n:2, group:true,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["C. amethysteus: simile al cibarius, ma con squamette appressate violaceo-ametista","C. pallens: ricoperto da una pruina biancastra che si asporta facilmente e scompare con lo sviluppo; margine a lungo involuto","C. friesii: piccolo (circa 3 cm), lobato, vellutato, arancio vivo/arancio carota"],
    imenio:["C. amethysteus: pseudolamelle molto pallide","C. pallens: pseudolamelle pallide, più chiare verso il gambo","C. friesii: pseudolamelle rosa salmone vivo, molto anastomizzate"],
    gambo:["C. pallens: robusto, svasato e quasi bulboso alla base, pruinoso come il cappello","C. friesii: pieno, fibroso"],
    carne:["C. amethysteus e C. pallens: tendono a virare al rugginoso al tocco","C. friesii: forte odore di albicocca"],
    habitat:["C. amethysteus: soprattutto sotto faggio e conifere, agosto-settembre","C. pallens: boschi di latifoglia e misti, anche mediterranei su suolo acido, soprattutto a giugno","C. friesii: suoli acidi, conifere, castagno e faggio, su muschio e pendii umidi, giugno-luglio"]
  } },
{ id:"cantharellus_lutescens", cat:"commestibile", names:["Cantharellus lutescens","Craterellus lutescens"], common:"Finferla", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["3-6 cm","elastico e minuto, margine ondulato e frastagliato","colore bruno su sfondo arancio"],
    imenio:["subito liscio, poi appaiono venature spesse ed irregolari con rilievi lamellari irregolari","colore rosa salmone o giallo arancio"],
    gambo:["lungo, esternamente liscio, spesso con solchi longitudinali colore giallo arancio"],
    carne:["carne giallastra, elastica e minuta","gradevolissimo odore di frutta fresca, sapore dolce"],
    habitat:["simbionte, fruttifica gregaria di latifoglie e aghifoglie, soprattutto sotto pini, dall'estate fino al tardo autunno"]
  },
},
{ id:"cantharellus_tubaeformis", cat:"commestibile", names:["Cantharellus tubaeformis","Craterellus tubaeformis"], common:"Finferla", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["2-6 cm","a maturità la depressione centrale si accentua, forma di tromba","cuticola rugosa, colore bruno giallastro, margine irregolare"],
    imenio:["formato da pliche molto evidenti, anastomizzate, con disegno a lamelle distanti e decorrenti sul gambo","toni grigio giallastro"],
    gambo:["irregolare e cilindrico, tubuloso, colore giallo-olivastro"],
    carne:["carne sottile ed elastica, colore giallo pallido, minuta","odore quasi inesistente, sapore dolciastro"],
    habitat:["simbionte, fruttifica gregaria di latifoglie e aghifoglie, dall'estate all'autunno"]
  },
},
{ id:"craterellus_cornucopioides", cat:"commestibile", names:["Craterellus cornucopioides"], common:"Trombetta dei morti", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["4-8 cm","forma simile a una cornucopia, talvolta increspato, margine arrotondato o ondulato","colori nero-brunastro con piccole squamette, poi grigio-brunastro"],
    imenio:["imenoforo liscio o rugoso, non a vere lamelle","colore da grigio cenere a grigio-bluastro, tendente a schiarire (spore bianche)"],
    gambo:["indistinto dal cappello, imbutiforme ed elastico, concolore, totalmente cavo"],
    carne:["carne sottile ed elastica, colore grigio nerastro","da giovane delicato sentore fruttato e leggermente dolciastro"],
    habitat:["saprotrofo terricolo, fruttifica gregario in autunno, predilige terreni umidi nei boschi di latifoglie e conifere in prossimità di residui vegetali"]
  },
},
{ id:"agrocybe_aegerita", cat:"commestibile", names:["Agrocybe aegerita","Cyclocybe cylindracea"], common:"Piopparello", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["4-8 cm","abbastanza carnoso, da prima emisferico poi piano convesso","superficie increspata, margine leggermente appendicolato","colore bruno rossiccio, che a maturazione tenderà al biancastro"],
    imenio:["lamelle compatte, adnate, intervallate da lamellule","colorazione dal bianco, giallo ocra, colore tabacco a maturazione","anello con deposito sporale ocraceo sulla faccia superiore"],
    gambo:["cilindrico, si assottiglia leggermente alla base, colore bianco poi ocraceo, fibrillato e duro","ampio anello persistente e ricadente"],
    carne:["carne biancastra e soda","buon odore e sapore"],
    habitat:["parassita-saprotrofo, si raccoglie in estate ed autunno su latifoglie che spesso porta alla morte"]
  },
},
{ id:"sarcodon_imbricatus", cat:"commestibile", names:["Sarcodon imbricatus"], common:"Steccherino bruno", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["8-25 cm","da subito crateriforme, poi spianato con decisa depressione centrale","colore bruno, cuticola grigio brunastra ornamentata concentricamente da grosse squame brune"],
    imenio:["imenoforo a idni (aculei), non a lamelle","bianco-grigiastri, fitti e decorrenti sul gambo"],
    gambo:["centrale, corto e tozzo, prima pieno poi scavato, generalmente liscio","colore grigio-bruno"],
    carne:["carne biancastra","odore aromatico, sapore amarognolo"],
    habitat:["simbionte di abete rosso, ma anche tra altre conifere, si raccoglie in estate ed autunno"]
  },
},
{ id:"clitopilus_prunulus", cat:"commestibile", names:["Clitopilus prunulus"], common:"Spia del porcino", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["4-8 cm","a maturità quasi piano, a volte leggermente depresso al centro, margine involuto, irregolare e lobato","cuticola vellutata e asciutta a tempo secco, un po' vischiosa se bagnato","colori dal biancastro a grigio crema"],
    imenio:["lamelle rosa a maturità: fitte, minute e decorrenti, si separano facilmente dal cappello","colore bianco crema da giovane, rosate fino a rosa brunastro a maturità (fungo rodosporeo)"],
    gambo:["corto, biancastro, con la base ricoperta da fioccosità biancastra"],
    carne:["carne estremamente fragile, a frattura netta","forte odore e sapore di farina bagnata"],
    habitat:["simbionte di latifoglie e conifere, in estate ed autunno"]
  },
},
{ id:"xerocomus_badius", cat:"commestibile", names:["Xerocomus badius","Imleria badia"], common:"", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["4-12 cm","abbastanza carnoso, da prima emisferico a maturazione piano-convesso","superficie nei giovani vellutata, a maturazione liscia ed asciutta","colore uniforme marrone/bruno, ma anche rossiccio/bruno o bruno/nerastro"],
    imenio:["pori che virano fortemente al blu scuro al tocco: a tubuli e piccoli pori, colore giallo a maturazione"],
    gambo:["fascia più chiara subito sotto l'imenio, poi per tutta la lunghezza colore bruno rossiccio, fibrilloso longitudinalmente"],
    carne:["carne bianco-giallastra, vira leggermente all'azzurro al taglio","lieve odore e sapore comunque gradevoli"],
    habitat:["simbionte con preferenza per le conifere, si raccoglie dall'estate all'autunno"]
  },
},
{ id:"clitocybe_gibba", cat:"commestibile", names:["Clitocybe gibba","Infundibulicybe gibba"], common:"Imbutino", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["3-10 cm","imbutiforme, cuticola opaca finemente feltrata, piccolo umbone centrale","colore dal crema rosato fino a un bruno rossastro chiaro, margine finemente sinuato-lobato"],
    imenio:["lamelle fitte, intervallate da lamellule, decorrenti, da biancastre a color Isabella"],
    gambo:["cilindrico fibrilloso, base leggermente clavata, stopposo e cotonoso in prossimità della base, concolore al cappello"],
    carne:["carne biancastra ed elastica","leggero odore di mandorle amare, sapore dolce"],
    habitat:["saprotrofo terricolo molto comune, si raccoglie in boschi sia di latifoglie che di aghifoglie da giugno a ottobre"]
  },
},
{ id:"cortinarius_praestans", cat:"commestibile", names:["Cortinarius praestans"], common:"Occhio di bue", n:2,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["10-25 cm","carnoso, da emisferico a piano convesso, fortemente involuto nei giovani esemplari","cuticola vischiosa a tempo umido, colore lilla-bruno-porpora","a maturità nettamente rugo-solcato"],
    imenio:["lamelle smarginate, fitte e ventricose, filo seghettato","da giovane biancastre con sfumature violetto, bruno ruggine a maturità"],
    gambo:["cortina color grigio violetto","carnoso e panciuto, colore bianco, robusto, con netto bulbo basale","evidenti resti di velo generale che formano \"braccialetti\" sovrapposti color lilla"],
    carne:["carne biancastra e soda","odore leggermente terroso, sapore dolce"],
    habitat:["simbionte che predilige boschi di quercia e castagno, in estate ed autunno"]
  },
},
{ id:"marasmius_oreades", cat:"commestibile", names:["Marasmius oreades"], common:"Gambesecche", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["2-5 cm","da giovane emisferico, diventa piano-umbonato a maturità","cuticola liscia, nettamente igrofana","colore dal ocra bruno al nocciola beige"],
    imenio:["lamelle rade e libere, con numerose lamellule","lamelle e lamellule biancastre, poi ocra pallido"],
    gambo:["lungo, cilindrico ed esile","pieno, elastico e coriaceo","colore bianco-nocciola"],
    carne:["carne biancastra","odore fungino, buon sapore"],
    habitat:["saprotrofo, cresce in gruppi numerosi in prati e pascoli","dalla primavera all'autunno"]
  },
},
{ id:"lepista_nuda", cat:"commestibile", names:["Lepista nuda"], common:"", n:1,
  ref:{
    commestibilita:["Commestibilità libera"],
    cappello:["5-14 cm","a maturità convesso, margine involuto","cuticola liscia, untuosa a tempo umido, igrofana","colore grigio violetto, tende a scolorire con tempo secco a partire dal centro"],
    imenio:["lamelle fitte, adnate e secedenti, colore grigio violetto"],
    gambo:["stesso colore delle lamelle o appena più chiaro","si ingrossa alla base, dove trattiene abbondante micelio bluastro che ingloba il substrato di crescita"],
    carne:["carne viola grigiastra","odore complesso floreale più o meno intenso, non gradevolissimo; sapore dolciastro"],
    habitat:["saprotrofo terricolo, cresce su terreni ricchi di fogliame sia di conifere che latifoglie, sia in estate che autunno"]
  },
},

// ---------------- MORTALI (Lezione 4) ----------------
{ id:"amanita_phalloides", cat:"mortale", names:["Amanita phalloides"], common:"", n:2,
  ref:{
    cappello:["liscio, con fibrille innate sulla cuticola","margine liscio","colore variabile: dal bianco al verde oliva, giallo-verdastro, nocciola, fino al marrone grigio"],
    imenio:["lamelle bianche, libere al gambo (fungo eterogeneo)"],
    gambo:["cilindrico, a base bulbosa","ampio anello bianco a gonnellino","decorazioni a pelle di serpente","evidente e grossa volva bianca a sacco alla base"],
    carne:["carne bianca, compatta poi sempre più cedevole a maturità","odore quasi nullo da giovane, poi mielato, rancido e infine cadaverico negli esemplari vecchi","sapore dolciastro"],
    habitat:["tipico di boschi di latifoglia"]
  } },
{ id:"amanita_phalloides_alba", cat:"mortale", names:["Amanita phalloides forma alba","Amanita phalloides var. alba","Amanita phalloides"], common:"Forma completamente bianca", n:2,
  ref:{
    cappello:["liscio, sericeo, con fibrille innate","margine liscio","colore completamente bianco in ogni parte"],
    imenio:["lamelle libere al gambo"],
    gambo:["cilindrico, a base bulbosa","ampio anello","decorazioni a pelle di serpente (visibili a luce radente)","importante volva sacciforme"],
    carne:["carne bianca, compatta poi sempre più cedevole a maturità","odore quasi nullo da giovane, poi mielato, rancido e infine cadaverico negli esemplari vecchi","sapore dolciastro"],
    habitat:["boschi caldi e asciutti di latifoglia"]
  } },
{ id:"amanita_virosa", cat:"mortale", names:["Amanita virosa"], common:"", n:2,
  ref:{
    cappello:["bianco avorio brillante","margine liscio","conico-campanulato, quasi sempre eccentrico","spesso leggere sfumature rosa-ocracee al centro"],
    imenio:["lamelle bianche, libere al gambo (fungo eterogeneo)"],
    gambo:["bianco, ricoperto da evidente fioccosità","grosso bulbo basale","anello bianco fragile, molto in alto","volva bianca ampia, un po' inguainante, generalmente non a sacco"],
    carne:["carne bianca, tenera","odore nullo da giovane, fetido e nauseante nei vecchi esemplari"],
    habitat:["quasi esclusivo di abete rosso"]
  } },
{ id:"cortinarius_orellanus", cat:"mortale", names:["Cortinarius orellanus"], common:"", n:2,
  ref:{
    cappello:["leggermente umbonato, feltrato, asciutto","colore da bruno-aranciato a fulvo-rugginoso"],
    imenio:["lamelle smarginate, spaziate e spesse, colorazioni simili al cappello a maturità"],
    gambo:["pieno e sodo","colorazione più chiara del cappello, giallastra in alto","fibrille longitudinali fulvastre"],
    carne:["odore nettamente rafanoide (di ravanello)"],
    habitat:["latifoglia: quercia e castagno"]
  } },
{ id:"cortinarius_speciosissimus", cat:"mortale", names:["Cortinarius speciosissimus","Cortinarius rubellus","Cortinarius orellanoides"], common:"", n:2,
  ref:{
    cappello:["umbone acuto ben marcato","colorazioni sul bruno-rugginoso","3-7 cm, conico-campanulato poi convesso-appianato","superficie fibrillosa, a volte con squamette arancio verso il margine"],
    imenio:["lamelle piuttosto rade e larghe, bruno-rosse, concolori al cappello"],
    gambo:["decorazioni a bande oblique","cortina molto evanescente nei giovani esemplari","5-14 cm, cilindrico o leggermente clavato, base attenuata","bande giallo pallido a zig-zag (residui del velo), a volte visibili solo a luce radente"],
    carne:["sapore amarognolo","odore nettamente rafanoide (di ravanello)","colore giallo-ocra/bruno-fulvo, soprattutto alla base del gambo"],
    habitat:["conifere, generalmente abete rosso","peccete subalpine su suolo acido, con muschio e mirtillo, estate-autunno","frequente sulle Alpi, raro sugli Appennini"]
  } },
{ id:"lepiota_brunneoincarnata", cat:"mortale", names:["Lepiota brunneoincarnata"], common:"Lepiota di piccola taglia", n:1,
  ref:{
    cappello:["da campanulato a spianato","umbone ottuso bruno vinoso scuro al centro","superficie coperta da squame concentriche bruno scure"],
    imenio:["lamelle bianche, libere al gambo (fungo eterogeneo)"],
    gambo:["cilindrico, bianco nella parte alta","anello effimero nella parte mediana","sotto l'anello, ornamentazione simile a quella del cappello"],
    carne:["carne biancastra, con tonalità vinose chiare verso la base del gambo","odore penetrante, a volte fruttato; sapore da mite a leggermente acidulo"],
    habitat:["saprotrofo: parchi, giardini, prati, anche vasi di fiori"]
  } },
{ id:"lepiota_subincarnata", cat:"mortale", names:["Lepiota subincarnata","Lepiota josserandii"], common:"Lepiota di piccola taglia", n:1,
  ref:{
    cappello:["superficie tomentosa rosa-carnicino","frammentata in sottili squamette, più fitte al centro"],
    imenio:["lamelle bianche (fungo eterogeneo)"],
    gambo:["bianco, cilindrico","residui indistinti di anello","rosa pallido in alto e sotto l'anello, con decorazioni concolori al cappello"],
    carne:["odori e sapori variabili: dal gradevole-dolciastro fino al pelargonio/cauciù"],
    habitat:["saprotrofo ubiquitario: parchi, giardini, prati, vasi di fiori"]
  } },
{ id:"galerina_marginata", cat:"mortale", names:["Galerina marginata"], common:"", n:1,
  ref:{
    cappello:["liscio, igrofano","bruno fulvo a tempo umido, più chiaro con l'asciutto","margine striato"],
    imenio:["lamelle color argilla, bruno ruggine a maturità"],
    gambo:["cilindrico e fibroso, con anello","più scuro verso la base, con fioccosità biancastre"],
    carne:["odore e sapore farinosi","colore giallo brunastro al taglio"],
    habitat:["gregaria, su legno morto"]
  } },
{ id:"gyromitra_esculenta", cat:"mortale", names:["Gyromitra esculenta"], common:"Falsa spugnola", n:2,
  ref:{
    cappello:["nessun vero cappello a lamelle: aspetto \"cerebriforme\", detto a mitra (è un ascomicete)"],
    gambo:["bianco, corto e tozzo","parzialmente vuoto all'interno"],
    carne:["carne bianca, un po' elastica, si sbriciola come la cera","sapore e odore gradevoli"],
    habitat:["saprotrofo primaverile, habitat montani"]
  } },
{ id:"paxillus_involutus", cat:"mortale", names:["Paxillus involutus"], common:"", n:2,
  ref:{
    cappello:["tendenzialmente imbutiforme","margine fortemente involuto","superficie vellutata, colore bruno camoscio"],
    imenio:["lamelle fitte, fortemente decorrenti sul gambo","si macchiano di bruno scuro al tocco"],
    gambo:["superficie vellutata, stesso colore del cappello","si macchia di bruno scuro al tocco"],
    carne:["nessun odore o sapore particolare","tende a macchiarsi di bruno scuro"],
    habitat:["boschi umidi, sia di conifere che di latifoglie"]
  } },
{ id:"amanita_verna", cat:"mortale", names:["Amanita verna"], common:"", n:2,
  ref:{
    cappello:["liscio, bianco","senza fibrille innate sul cappello"],
    imenio:["fungo eterogeneo, lamelle bianche"],
    gambo:["cilindrico, a base bulbosa","anello presente","evidente volva che racchiude il bulbo"],
    carne:["carne bianca, tenera nel cappello, più fibrosa nel gambo","odore insignificante, sgradevole negli esemplari adulti; sapore non significativo"],
    habitat:["primaverile, boschi caldi di latifoglia (Italia centro-meridionale)"]
  } },
{ id:"leotia_lubrica", cat:"mortale", names:["Leotia lubrica"], common:"", n:2,
  ref:{
    cappello:["non un vero cappello: piccola \"testa\" globosa color giallo-verde olivastro in cima allo stipite (è un ascomicete)"],
    gambo:["cavo"],
    carne:["carne elastica, gelatinosa"],
    habitat:["estate-autunno, luoghi umidi (stesso habitat delle finferle)"]
  } },

// ---------------- TOSSICI (Lezione 4) ----------------
{ id:"amanita_pantherina", cat:"tossico", names:["Amanita pantherina"], common:"", n:2,
  ref:{
    cappello:["colore nocciola-marroncino","margine striato","verruche fioccose bianco candide"],
    imenio:["lamelle bianche (fungo eterogeneo)"],
    gambo:["cilindrico, a base bulbosa","anello bianco non troppo in alto","volva nettamente \"circoncisa\", a volte dissociata in cercini sovrapposti"],
    carne:["carne bianca, senza sapore","leggero odore di rapa"],
    habitat:["boschi di latifoglie e conifere, estate-autunno"]
  } },
{ id:"amanita_muscaria", cat:"tossico", names:["Amanita muscaria"], common:"", n:1,
  ref:{
    cappello:["rosso vivo-arancione","verruche bianche o gialline (varietà formosa)","margine striato"],
    imenio:["lamelle bianche, libere al gambo"],
    gambo:["massiccio","ampio anello","base bulbosa con volva dissociata in placche (\"come una bomba a mano\")"],
    carne:["inodore e insapore"],
    habitat:["boschi montani di conifere, estate-autunno"]
  } },
{ id:"agaricus_xanthodermus", cat:"tossico", names:["Agaricus xanthodermus"], common:"Falso prataiolo", n:1,
  ref:{
    cappello:["biancastro, liscio","solitamente tronco-conico"],
    imenio:["lamelle fitte, libere al gambo","rosate nei giovani esemplari, sempre più scure fino al viola-nerastro a maturità"],
    gambo:["biancastro, slanciato o ricurvo (\"a pipa\")","netto ingiallimento alla base (superficiale e alla sezione)","anello supero, doppio e persistente, a ruota dentata sulla faccia inferiore"],
    carne:["netto odore sgradevole di fenolo/inchiostro, alla base del gambo"],
    habitat:["dal bosco ai prati e giardini, estate-autunno"]
  } },
{ id:"clitocybe_bianche_gruppo", cat:"tossico", names:["Clitocybe"], common:"Clitocybi bianche di piccola taglia (gruppo)", n:1, group:true,
  members:[["Collybia dealbata","Clitocybe dealbata"],["Collybia rivulosa","Clitocybe rivulosa"],["Collybia phyllophila","Clitocybe phyllophila"],["Singerocybe phaeophthalma","Clitocybe phaeophthalma"]],
  ref:{
    cappello:["piccolo, spianato o leggermente depresso","ricoperto da una sorta di \"glassa\" bianca"],
    imenio:["lamelle da bianche a crema, adnate o leggermente decorrenti"],
    gambo:["concolore al cappello, cilindrico, privo di veli"],
    carne:["carne elastica e tenace, fibrosa nel gambo","odori sgradevoli: farina rancida o erba marcescente"]
  } },
{ id:"inocybe_sp", cat:"tossico", names:["Inocybe"], common:"Inocybe sp.", n:1, group:true,
  members:[["Inocybe geophylla"],["Pseudosperma rimosum","Inocybe rimosa"],["Inosperma erubescens","Inocybe erubescens"],["Inocybe corydalina"]],
  ref:{
    cappello:["portamento \"inociboide\": a pagoda, più o meno umbonato, mai liscio","spesso ruvido, squamuloso o rimoso","colori smorti: dal crema all'ocraceo fino al grigiastro"],
    imenio:["lamelle da adnate a quasi libere, a maturità color ocra o tabacco (sporata ocra)"],
    gambo:["cilindrico, a volte con piccolo bulbo basale"],
    carne:["carne bianca, con odori particolari, spesso spermatici"],
    habitat:["boschi sia di latifoglie che di conifere"]
  } },
{ id:"entoloma_sinuatum", cat:"tossico", names:["Entoloma sinuatum","Entoloma lividum"], common:"", n:2,
  ref:{
    cappello:["liscio, colore grigio-argento","fibrille innate sulla cuticola","da convesso a spianato"],
    imenio:["lamelle smarginate/uncinate, giallastre da giovani, rosa salmone a maturità","sporata rosa (fungo rodosporeo)"],
    gambo:["biancastro, cilindrico, massiccio e robusto"],
    carne:["odore e sapore decisi di farina"],
    habitat:["boschi di latifoglie, estate-autunno"]
  } },
{ id:"omphalotus_olearius", cat:"tossico", names:["Omphalotus olearius"], common:"Fungo dell'ulivo", n:2,
  ref:{
    cappello:["a maturità imbutiforme","margine sottile e involuto","colore dal giallo-aranciato al bruno-rossastro"],
    imenio:["lamelle molto fitte, basse, molto decorrenti sul gambo","colore giallo zafferano, bioluminescenti (visibili al buio)"],
    gambo:["solitamente eccentrico, pieno e fibroso","colore simile alle lamelle"],
    carne:["sapore dolce e gradevole, odore quasi nullo"],
    habitat:["lignicolo: ceppaie o radici di olivo e altre latifoglie"]
  } },
{ id:"tricholoma_pardinum", cat:"tossico", names:["Tricholoma pardinum"], common:"", n:2,
  ref:{
    cappello:["aspetto massiccio (portamento tricolomoide)","convesso, colore grigio-cenere","ricoperto da grosse squame grigio-nerastre"],
    imenio:["lamelle uncinate-smarginate, bianche con riflessi azzurrini, poi gialline con riflessi verde chiarissimo"],
    gambo:["biancastro, si macchia di bruno se manipolato","robusto, spesso clavato"],
    carne:["carne bianca e soda nel cappello, un po' fibrosa nel gambo","netto odore e sapore di farina"],
    habitat:["sia abete rosso che latifoglia"]
  } },
{ id:"hypholoma_fasciculare", cat:"tossico", names:["Hypholoma fasciculare"], common:"Falso chiodino, zolfino", n:1,
  ref:{
    cappello:["generalmente convesso, liscio","colore giallo zolfo, centro un po' più scuro"],
    imenio:["lamelle giallo-verdastre nei giovani esemplari, grigio-violacee a maturità"],
    gambo:["privo di anello, lungo e flessuoso","tonalità un po' più chiara del cappello"],
    carne:["carne molto amara all'assaggio, odore insignificante"],
    habitat:["lignicolo, latifoglie, stagione di crescita molto lunga"]
  } },
{ id:"russula_gruppo_emeticine", cat:"tossico", names:["Russula emetica"], common:"Gruppo delle russule emeticine", n:2, group:true,
  members:[["Russula emetica"],["Russula nobilis","Russula mairei"],["Russula silvestris","Russula sylvestris"],["Russula griseascens"]],
  ref:{
    cappello:["colorazioni sulle tonalità del rosso, più o meno scolorito"],
    imenio:["lamelle bianco candido"],
    gambo:["bianco candido"],
    carne:["carne cassante (si spezza nettamente)","sapore più o meno acre o piccante"],
    habitat:["simbionti estivo-autunnali, sia conifere che latifoglie"]
  } },
{ id:"boletus_satanas", cat:"tossico", names:["Boletus satanas","Rubroboletus satanas"], common:"", n:2,
  ref:{
    cappello:["colori spettacolari, portamento boletoide","bianco ghiaccio-grigiastro, finemente vellutato"],
    imenio:["tubuli e pori dal giallo-aranciato al rosso cupo a maturità"],
    gambo:["spesso obeso","fine reticolo rosso","giallo in alto, lampone nella parte mediana, giallo-brunastro verso la base"],
    carne:["sapore dolce, odore grato da giovane (disgustoso a maturità)","giallo molto pallido al taglio, vira a un azzurro leggero verso il cappello"],
    habitat:["boschi di quercia e castagno, tarda estate"]
  } },
{ id:"ramaria_pallida", cat:"tossico", names:["Ramaria pallida"], common:"", n:1,
  ref:{
    cappello:["nessun vero cappello: corpo fruttifero coralloide di 6-15 cm, a ramificazioni fitte ed erette","colori smorti con riflessi rosa-lilacini da giovane, poi crema-ocra/ocra-brunastro","apici dei rami con 3-4 punte, normalmente denticolate","genere difficile da determinare con certezza: le colorazioni si assomigliano molto tra specie, soprattutto a maturità"],
    gambo:["base carnosa e compatta, simile a un tronco, biancastra"],
    carne:["carne compatta, biancastra, immutabile al taglio","odore di cicoria tostata o leggermente di liquirizia; sapore dolce, appena amarognolo dopo lunga masticazione"],
    habitat:["boschi di conifere montani (abete rosso e bianco), anche misti con latifoglie","da fine estate ai primi geli"]
  } },
{ id:"lactarius_torminosus", cat:"tossico", names:["Lactarius torminosus"], common:"", n:1,
  ref:{
    cappello:["rosato, margine follettato/lanoso","zonature concentriche","5-12 cm, compatto, convesso e molto involuto, poi depresso/imbutiforme","peluria a ciuffi sul margine che nei giovani copre le lamelle"],
    imenio:["lamelle molto fitte e sottili, crema pallido con sfumature rosate"],
    gambo:["cilindrico o leggermente attenuato alla base","da biancastro a quasi concolore al cappello, spesso più scuro all'apice"],
    carne:["lattice bianco (non arancione)","sapore piccantissimo","odore fruttato","carne bianca con sfumature rosate verso la superficie"],
    habitat:["simbionte esclusivo di betulla"]
  } },
{ id:"tricholoma_sciodes", cat:"tossico", names:["Tricholoma sciodes"], common:"", n:1,
  ref:{
    cappello:["superficie grigio metallico lucente","percorso da fibrille innate più scure","umbone ottuso al centro"],
    imenio:["lamelle smarginate, biancastre con riflessi cenere","filo quasi sempre puntinato di nero"],
    gambo:["cilindrico, fibroso, a volte ricurvo alla base","biancastro poi sfumato di grigio a maturità"],
    carne:["odore terroso","sapore nettamente amaro, piccante dopo lunga masticazione"],
    habitat:["specie autunnale, tipica dei boschi di faggio"]
  } },
{ id:"tricholoma_virgatum", cat:"tossico", names:["Tricholoma virgatum"], common:"", n:1,
  ref:{
    cappello:["netto umbone acuto al centro, ben marcato","colore di fondo grigio cinereo, piuttosto scuro","conico, poi campanulato e infine appianato; aspetto lucente, con fini fibrille grigio-nerastre","margine spesso lobato e fessurato negli adulti"],
    imenio:["lamelle fitte, smarginate, biancastre da giovani, poi crema-grigiastre con macchie rugginose"],
    gambo:["cilindrico, clavato verso la base semibulbosa","biancastro, finemente puntinato all'apice"],
    carne:["carne biancastra, grigio chiaro nel cappello e in alto nel gambo, appena ocracea alla base","odore leggero, un po' rafanoide","sapore prima amaro, poi subito acre e infine piccante"],
    habitat:["boschi di conifere, con preferenza per pino silvestre e abete rosso"]
  } },
{ id:"tylopilus_felleus", cat:"tossico", names:["Tylopilus felleus"], common:"Fiele di terra", n:1,
  ref:{
    cappello:["4-15 cm, emisferico, poi convesso e infine pulvinato","cuticola asciutta, finemente vellutata, si screpola col secco","colore da bruno chiaro a nocciola, camoscio, ocra, a volte grigiastro"],
    imenio:["pori che tendono al rosa con la maturazione"],
    gambo:["evidente reticolo bruno scuro, molto in rilievo"],
    carne:["sapore amarissimo"],
    habitat:["da giugno a ottobre, boschi di conifere e latifoglie su suolo acido, anche castagneti"]
  } },
{ id:"amanita_ovoidea", cat:"tossico", names:["Amanita ovoidea"], common:"", n:2,
  ref:{
    cappello:["spesso di grande taglia, tutto bianco, aspetto burroso","margine liscio, festonato da lembi penduli cremosi (resti del velo parziale)"],
    imenio:["lamelle con filo frastagliato-fioccoso, dal bianco al crema rosato"],
    gambo:["robusto, molto infisso nel terreno","ricoperto da fioccosità cremose facilmente removibili","ampia e persistente volva sacciforme alla base"],
    carne:["carne soda e fibrosa","odore non piacevole, tipo acqua salmastra"],
    habitat:["ambiente mediterraneo: pino e latifoglia (es. leccio)"]
  } },
{ id:"amanita_citrina", cat:"tossico", names:["Amanita citrina"], common:"", n:1,
  ref:{
    cappello:["margine liscio, privo di fibrille","colore giallo pallido","cosparso di verruche più scure"],
    imenio:["lamelle libere al gambo, fitte, bianche sfumate di giallino"],
    gambo:["quasi concolore al cappello, slanciato","superficie striato-forforacea","ampio anello","base grossa, bulbosa e marginata, chiusa in una volva a sua volta marginata"],
    carne:["netto odore di ravanello"],
    habitat:["conifera e latifoglia, dall'estate all'autunno inoltrato"]
  } },
{ id:"coprinopsis_atramentaria", cat:"tossico", names:["Coprinopsis atramentaria"], common:"", n:1,
  ref:{
    cappello:["ovoidale, colore grigio-piombo"],
    imenio:["lamelle fittissime, nerastre, deliquescenti (si sciolgono a maturità)"],
    gambo:["biancastro"],
    carne:["carne molto esigua, biancastra","odore non significativo, sapore dolciastro"],
    habitat:["dove sia sepolto materiale organico marcescente"]
  } },

// ---------------- COMMESTIBILITÀ CONDIZIONATA (Lezione 2) ----------------
// Nota: le slide indicano solo il TIPO di preparazione richiesta (sbollentatura/lunga
// cottura/sgambatura/sbucciatura), senza specificare tempi o temperature precisi.
{ id:"armillaria_mellea", cat:"condizionata", names:["Armillaria mellea"], common:"Chiodino", n:1,
  ref:{
    commestibilita:["Sbollentatura (almeno 15 minuti), lunga cottura (almeno 30 minuti), sgambatura"],
    cappello:["poco striato, mai igrofano, squame sempre presenti al centro"],
    imenio:["lamelle bianche/crema, arcuato-decorrenti (sporata bianca)"],
    gambo:["bianco e striato sopra l'anello, colorato con fiocchi biancastri sotto","anello doppio persistente, bordo giallo"],
    carne:["carne soda nel cappello, fibrosa e coriacea nel gambo (che per questo non si consuma)","odore tenue, fungino, poco gradevole; sapore acidulo-dolciastro"],
    habitat:["parassita di latifoglie e pini, pianura/collina molto infossato"]
  } },
{ id:"armillaria_ostoyae", cat:"condizionata", names:["Armillaria ostoyae"], common:"Chiodino", n:0,
  ref:{
    commestibilita:["Sbollentatura (almeno 15 minuti), lunga cottura (almeno 30 minuti), sgambatura"],
    cappello:["bordo striato, squame su tutta la superficie"],
    imenio:["lamelle bianche/crema, arcuato-decorrenti (sporata bianca)"],
    gambo:["bianco e striato sopra l'anello, colorato con fiocchi biancastri sotto","anello doppio persistente, fiocchi scuri sul bordo"],
    carne:["sapore resinoso"],
    habitat:["parassita di conifere, faggio, castagno"]
  } },
{ id:"armillaria_gallica", cat:"condizionata", names:["Armillaria gallica"], common:"Chiodino", n:1,
  ref:{
    commestibilita:["Sbollentatura (almeno 15 minuti), lunga cottura (almeno 30 minuti), sgambatura"],
    cappello:["poco striato, poco igrofano, squame giallastre"],
    imenio:["lamelle bianche/crema, arcuato-decorrenti (sporata bianca)"],
    gambo:["clavato, con fiocchi gialli sotto l'anello","anello doppio fibrilloso, fugace, fiocchi gialli sulla faccia inferiore"],
    habitat:["parassita di latifoglie, poco infossato"]
  } },
{ id:"armillaria_cepistipes", cat:"condizionata", names:["Armillaria cepistipes"], common:"Chiodino", n:1,
  ref:{
    commestibilita:["Sbollentatura (almeno 15 minuti), lunga cottura (almeno 30 minuti), sgambatura"],
    cappello:["molto striato, molto igrofano, squame scure al centro, poco visibili"],
    imenio:["lamelle bianche/crema, arcuato-decorrenti (sporata bianca)"],
    gambo:["ingrossato alla base, bianco sopra l'anello, nocciola sotto","anello cortiniforme"],
    habitat:["parassita di latifoglie, a piccoli cespi"]
  } },
{ id:"armillaria_tabescens", cat:"condizionata", names:["Armillaria tabescens"], common:"Chiodino senza anello", n:1,
  ref:{
    commestibilita:["Sbollentatura (almeno 15 minuti), lunga cottura (almeno 30 minuti), sgambatura"],
    cappello:["umbone presente, squame al centro","4-8 cm, tenace ed elastico, igrofano","colore bruno-ocra/tabacco, squamette concolori più fitte al centro","margine sottile e lobato"],
    imenio:["lamelle bianche/crema, arcuato-decorrenti (sporata bianca)","fitte, rosate negli esemplari maturi (colore della carne, non delle spore)"],
    gambo:["slanciato, flessuoso, superficie fibrillosa e striata","anello assente","8-12 cm, molto tenace e fibroso, spesso ricurvo","in alto concolore al cappello, in basso ocra-bruno più scuro"],
    carne:["carne poco abbondante, elastica nel cappello, tenace e fibrosa nel gambo","biancastra, fulvo-rossastra alla base del gambo","odore gradevole, poco caratteristico"],
    habitat:["parassita di latifoglie, pianura/collina","cespitoso, in gruppi numerosi su tronchi e radici, con preferenza per le querce"]
  } },
{ id:"leccinum_aurantiacum", cat:"condizionata", names:["Leccinum aurantiacum"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sgambatura (tempi non specificati nelle slide del corso)"],
    imenio:["pori piccoli, tondi, grigiastri"],
    cappello:["rosso arancio"],
    gambo:["squamoso: squame bianche, poi bruno/nerastre"],
    carne:["carne mite; bianca, poi rosa, poi viola/nerastra"],
    habitat:["simbionte di pioppo tremulo/bianco"]
  } },
{ id:"leccinum_carpini", cat:"condizionata", names:["Leccinum carpini","Leccinum pseudoscabrum"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sgambatura (tempi non specificati nelle slide del corso)"],
    imenio:["pori piccoli, tondi, grigiastri"],
    cappello:["bruno bocciardato"],
    gambo:["squamoso: squame bruno-nerastre"],
    carne:["carne mite; grigia, poi grigio nerastro"],
    habitat:["simbionte di latifoglie"]
  } },
{ id:"leccinum_quercinum", cat:"condizionata", names:["Leccinum quercinum"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sgambatura (tempi non specificati nelle slide del corso)"],
    imenio:["pori piccoli, tondi, grigiastri"],
    cappello:["rosso brunastro","da sferico a convesso-pulvinato, colori da rosso-arancio a rosso mattone","cuticola feltrata, asciutta, viscida a tempo umido, sporgente oltre il margine"],
    gambo:["squamoso: squame rosso-bruno","cilindrico, slanciato, fibroso","squame presto bruno-rossastre poi più scure; base spesso con macchie verde-bluastre"],
    carne:["carne mite; bianca, poi rosa, poi violetto","tenera nel cappello, soda e fibrosa nel gambo; col tempo annerisce"],
    habitat:["simbionte di latifoglie","in particolare quercia, castagno e carpino"]
  } },
{ id:"leccinum_scabrum", cat:"condizionata", names:["Leccinum scabrum"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sgambatura (tempi non specificati nelle slide del corso)"],
    imenio:["pori piccoli, tondi, grigiastri"],
    cappello:["bruno nocciola, liscio"],
    gambo:["squamoso: squame grigie, poi bruno/nerastre"],
    carne:["carne mite; bianca, immutabile"],
    habitat:["simbionte di betulle"]
  } },
{ id:"morchella_esculenta", cat:"condizionata", names:["Morchella esculenta"], common:"Spugnola gialla", n:1,
  ref:{
    commestibilita:["Lunga cottura, mai crude (tempi non specificati nelle slide del corso)"],
    cappello:["mitra formata da alveoli (cellette) accostate, disposte casualmente","cappello (mitra) e gambo differenziati","mitra arrotondata, colore giallastro","forma variabile: tondeggiante, ovoide o conica; colore da giallo-ocra a ocra-olivastro, bruno o grigio-nerastro"],
    gambo:["gambo e cappello vuoti internamente","generalmente tozzo, più corto della mitra, allargato alla base","superficie rugolosa/pruinosa, biancastra o bianco-crema, spesso con macchie rugginose alla base"],
    carne:["carne biancastra, leggermente paglierina a maturità, cerosa","odore spermatico, sapore dolciastro e gradevole"],
    habitat:["ascomicete, crescita primaverile","da metà marzo a inizio giugno, in ambienti freschi e umidi su terreni sciolti","probabilmente legata a frassino, olmo, alberi da frutto; anche sotto pioppo e abete rosso"]
  } },
{ id:"morchella_elata", cat:"condizionata", names:["Morchella elata"], common:"Spugnola nera", n:1,
  ref:{
    commestibilita:["Lunga cottura, mai crude (tempi non specificati nelle slide del corso)"],
    cappello:["mitra formata da alveoli (cellette) accostate, disposte longitudinalmente","cappello (mitra) e gambo differenziati","mitra allungata/conica, colore crema/bruno/nerastro","forma slanciata, alveoli lunghi e profondi"],
    gambo:["gambo e cappello vuoti internamente"],
    carne:["odore salmastro a maturità"],
    habitat:["ascomicete, crescita primaverile","saprotrofa su residui legnosi, soprattutto di abete rosso; anche nella pacciamatura di corteccia"]
  } },
{ id:"russula_olivacea", cat:"condizionata", names:["Russula olivacea"], common:"", n:1,
  ref:{
    commestibilita:["Cottura condizionata: tempi di cottura lunghi, non inferiori a 40 minuti, al fine di inattivare le tossine termolabili contenute"],
    cappello:["superficie opaca, cuticola spesso raggrinzita in cerchi concentrici, da verde oliva a rosso vinoso"],
    imenio:["lamelle ventricose, adnate, forcate, prima crema poi giallo ocra, senza lamellule, fragili"],
    gambo:["quasi sempre sfumato di lilla all'apice"],
    carne:["carne cassante, senza lattice"],
    habitat:["faggio e quercia"]
  } },
{ id:"suillus_granulatus", cat:"condizionata", names:["Suillus granulatus"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sbucciatura della cuticola (tempi non specificati nelle slide del corso)"],
    cappello:["viscido, cuticola separabile","cuticola giallastra-bruno mattone"],
    imenio:["pori con goccioline nel giovane"],
    gambo:["senza anello, con granulazioni","chiazze brune alla base"],
    carne:["carne bianco-giallastra, immutabile","soda e compatta nei giovani, spugnosa e molliccia negli adulti","sapore leggermente acidulo o resinoso, odore tenue o leggermente fruttato"],
    habitat:["simbionte di pino a 2 aghi"]
  } },
{ id:"suillus_luteus", cat:"condizionata", names:["Suillus luteus"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sbucciatura della cuticola (tempi non specificati nelle slide del corso)"],
    cappello:["viscido, cuticola separabile","cuticola bruno-violacea"],
    imenio:["pori immutabili alla pressione","reticolo giallo sopra l'anello, punteggiature giallo-marrone sotto"],
    gambo:["con anello evidente, violaceo nella pagina inferiore"],
    carne:["carne bianca, soda e compatta negli esemplari giovani"],
    habitat:["simbionte di pino a 2 aghi"]
  } },
{ id:"suillus_grevillei", cat:"condizionata", names:["Suillus grevillei"], common:"", n:1,
  ref:{
    commestibilita:["Lunga cottura, sbucciatura della cuticola (tempi non specificati nelle slide del corso)"],
    cappello:["viscido, cuticola separabile","cuticola arancio-mattone"],
    imenio:["pori rossastri alla compressione","reticolo rossastro sopra l'anello, punteggiatura arancio-mattone sotto"],
    gambo:["con anello"],
    habitat:["simbionte di larice"]
  } },
{ id:"amanita_rubescens", cat:"condizionata", names:["Amanita rubescens"], common:"Tignosa rossastra", n:0,
  // caratteristiche non presenti nelle slide del corso (citata solo come risposta a un
  // esercizio in Lezione 2, senza descrizione): fonte funghiitaliani.it
  ref:{
    commestibilita:["Buon commestibile, ma solo ben cotta: contiene tossine termolabili, rischio di sindrome emolitica se poco cotta"],
    cappello:["4-10 cm, da globoso a progressivamente appianato, margine non striato","superficie con residui velari verrucoso-squamosi di tonalità grigiastra","colore dal rossastro al bruno-rossastro, tende a scolorire con l'età o piogge intense"],
    imenio:["lamelle bianche, fitte, libere o appena adnate al gambo","si macchiano di rosso se manipolate o a maturità"],
    gambo:["cilindrico, si allarga progressivamente verso la base bulbosa","bianco in alto, sempre più sfumato di rosa/rosso verso la base","anello carnoso, inserito in posizione superiore, a gonnellina ampia","volva non ben visibile: il velo generale si frammenta e lascia solo piccole protuberanze perliformi alla base del gambo"],
    carne:["carne biancastra, assume sfumature rossastre al taglio (reazione diagnostica)","soda e spessa nel cappello, filamentosa nel gambo"],
    habitat:["simbionte, molto diffuso in boschi sia di conifere che di latifoglie, dalla primavera al tardo autunno"]
  }
},

// ---------------- TOSSICI, aggiunte da Lezione 2 ----------------

// ---------------- SOSPETTI (Lezione 2) ----------------
{ id:"hygrophoropsis_aurantiaca", cat:"sospetto", names:["Hygrophoropsis aurantiaca"], common:"Falso finferlo", n:2,
  ref:{
    cappello:["colore arancio acceso in ogni parte del fungo"],
    imenio:["lamelle decorrenti, forcate, tipicamente arancioni"],
    carne:["odore erbaceo, sapore dolce"],
    habitat:["saprotrofo su residui vegetali, dall'estate al tardo autunno"]
  } },

// ---------------- SOSPETTI (Lezione 5) ----------------
{ id:"clitocybe_nebularis", cat:"sospetto", names:["Clitocybe nebularis"], common:"Fungo delle nebbie", n:2,
  ref:{
    commestibilita:["Nessuna evidenza scientifica di tossicità, ma alcune regioni (tra cui il FVG) la considerano prudenzialmente sospetta, per il rischio di confusione con il tossico Entoloma sinuatum","se consumata: prebollitura obbligatoria con eliminazione dell'acqua, seguita da lunga cottura"],
    cappello:["medio-grandi dimensioni, da emisferico-convesso a piano-convesso a maturità","basso umbone, margine involuto da giovane","cuticola liscia, lucente a tempo umido, grigio metallico/grigio cenere"],
    imenio:["lamelle secedenti (si staccano \"a pacchetto\"), adnato-decorrenti","colore dal bianco al crema a maturità"],
    gambo:["clavato, robusto, di colore chiaro"],
    carne:["carne bianca","odore molto forte ed aromatico, di difficile descrizione ma tipico ed esclusivo della specie"],
    habitat:["saprotrofa, comune in autunno in boschi preferenzialmente di latifoglia","crescita numerosa anche in cerchi delle streghe"]
  },
},
{ id:"leucoagaricus_leucothites", cat:"sospetto", names:["Leucoagaricus leucothites","Lepiota naucina"], common:"", n:2,
  ref:{
    commestibilita:["Tradizionalmente consumata ma inserita dalla Regione FVG tra i funghi sospetti, per intossicazioni gastrointestinali documentate di causa ancora sconosciuta — consumo sconsigliato"],
    cappello:["a maturità quasi completamente piano, umbone ottuso centrale","cuticola liscia bianco candida, appena ocracea al centro"],
    imenio:["lamelle fitte, libere al gambo (fungo eterogeneo)","biancastre, sfumate di rosa a maturità","sporata comunque bianca (specie leucosporea)"],
    gambo:["bianco, cilindrico","anello ascendente, membranoso e persistente, bianco","base allargata a forma di clava","mai la volva"],
    carne:["carne bianca, soda","odore e sapore gradevoli, fungini"],
    habitat:["saprotrofa, comune in prati, giardini e parchi","compare in autunno in numerosi esemplari"]
  },
},
{ id:"macrolepiota_rhacodes", cat:"sospetto", names:["Macrolepiota rhacodes","Chlorophyllum rhacodes","Macrolepiota rachodes"], common:"Falsa mazza di tamburo", n:2,
  ref:{
    commestibilita:["Frequentemente e storicamente consumata, ma a volte ha provocato sindromi gastrointestinali — ritenuta sospetta, sconsigliata soprattutto per chi non l'ha mai mangiata"],
    cappello:["prima ovoidale, poi spianato, diametro fino a 15-20 cm","umbone liscio bruno-rossastro al centro","cuticola crema/brunastra, dissociata in larghe squame sovrapposte (\"come tegole\"), bordo rialzato, su carne biancastra sottostante"],
    imenio:["lamelle libere al gambo, fitte, color crema-biancastro","arrossano se sfregate"],
    gambo:["cilindrico, lungo, liscio (mai zebrato), fibroso, cavo","anello doppio evidente e scorrevole","grosso bulbo basale","vira nettamente al rosso cupo se sfregato"],
    carne:["carne tenera e biancastra nel cappello","al taglio vira fino al rosso-vinoso","odore tipico di patata cruda","sapore dolce, come di nocciola"],
    habitat:["saprotrofa di boschi e radure"]
  },
},
{ id:"boletus_luridus", cat:"sospetto", names:["Boletus luridus","Suillellus luridus"], common:"", n:2,
  ref:{
    commestibilita:["Commestibilità condizionata alla lunga cottura — rimane comunque specie sospetta per la legge del Friuli Venezia Giulia"],
    cappello:["da emisferico a convesso, superficie finemente vellutata","cuticola ocra-olivastro/bruno-camoscio, vira al blu al tocco"],
    imenio:["tubuli gialli poi verdastri, virano nettamente al blu a contatto con l'aria","pori giallo-arancio fino al rosso mattone, viranti al blu scuro al tocco"],
    gambo:["evidente reticolo rosso a maglie allungate","forma panciuta, a volte slanciata","colore giallastro, bruno-rossastro verso la base","vira al blu al tocco"],
    carne:["carne giallognola, colore barbabietola verso la base del gambo e nel cappello","rossa appena sotto il punto di contatto con i tubuli (\"linea di Bataille\" alla sezione)","tutto il fungo, sezionato, vira al blu anche all'interno","grata al gusto e all'olfatto"],
    habitat:["estivo-autunnale, predilige i terreni calcarei ma cresce anche su suolo neutro o subacido","con latifoglie (faggio, quercia, carpino) e conifere (pino, abete), anche nei parchi cittadini, dal mare alla montagna"]
  },
},
];

// Specie del programma d'esame (elenchi regionali FVG: commestibili, condizionati, sospetti,
// mortali, tossici). Le voci "e relativo gruppo" / "tutte le specie" sono espanse nelle carte
// corrispondenti presenti sopra.
const EXAM_SPECIES_IDS = new Set([
  // commestibilità libera
  "amanita_caesarea", "agaricus_campestris",
  "boletus_edulis", "boletus_aereus", "boletus_pinophilus", "boletus_aestivalis",
  "clitocybe_geotropa", "calocybe_gambosa", "calvatia_gigantea", "calvatia_utriformis",
  "coprinus_comatus", "hydnum_repandum",
  "lactarius_deliciosus", "lactarius_salmonicolor", "lactarius_deterrimus",
  "macrolepiota_procera", "rozites_caperatus", "russula_cyanoxantha", "russula_virescens",
  "cantharellus_cibarius", "cantharellus_lutescens", "cantharellus_tubaeformis",
  "craterellus_cornucopioides", "agrocybe_aegerita",
  // commestibilità condizionata
  "armillaria_mellea", "armillaria_ostoyae", "armillaria_gallica", "armillaria_cepistipes", "armillaria_tabescens",
  "leccinum_aurantiacum", "leccinum_carpini", "leccinum_quercinum", "leccinum_scabrum",
  "russula_olivacea", "morchella_esculenta", "morchella_elata",
  // sospetti
  "clitocybe_nebularis", "leucoagaricus_leucothites", "macrolepiota_rhacodes", "boletus_luridus",
  // mortali
  "amanita_phalloides", "amanita_phalloides_alba", "amanita_virosa",
  "cortinarius_orellanus", "cortinarius_speciosissimus",
  "lepiota_brunneoincarnata", "lepiota_subincarnata",
  // tossici
  "amanita_pantherina", "amanita_muscaria", "agaricus_xanthodermus", "clitocybe_bianche_gruppo",
  "inocybe_sp", "paxillus_involutus", "entoloma_sinuatum", "gyromitra_esculenta",
  "omphalotus_olearius", "hypholoma_fasciculare", "ramaria_pallida", "lactarius_torminosus",
  "russula_gruppo_emeticine", "boletus_satanas", "tricholoma_pardinum",
  "tricholoma_sciodes", "tricholoma_virgatum", "tylopilus_felleus", "amanita_ovoidea",
]);
