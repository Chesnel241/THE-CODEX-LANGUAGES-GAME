/**
 * THE CODEX — Base de connaissances ALLEMAND.
 * Schéma générique : forms = [étiquette, valeur] pour l'affichage,
 * search = formes consultables par le chatbot. Notes bilingues {fr,en}.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.KB = Codex.KB || {};

(function () {
  // Fabrique compacte d'un verbe allemand. aux: "haben" | "sein".
  function v(inf, gloss, pres, praet, part, aux, ex) {
    return {
      inf,
      gloss,
      forms: [
        ["präsens", pres.join(" · ")],
        ["präteritum", praet],
        ["perfekt", `${aux === "sein" ? "ist" : "hat"} ${part} ${aux === "sein" ? "⚠ sein" : ""}`.trim()],
        ["partizip II", part],
      ],
      search: [inf, ...pres, praet, part],
      speak: `${inf}. ich ${pres[0]}, du ${pres[1]}, er ${pres[2]}.`,
      ex,
    };
  }

  Codex.KB["de-DE"] = {
    verbs: [
      v("sein", { fr: "être", en: "to be" }, ["bin", "bist", "ist", "sind", "seid", "sind"], "war", "gewesen", "sein", "Ich bin Agent des Instituts."),
      v("haben", { fr: "avoir", en: "to have" }, ["habe", "hast", "hat", "haben", "habt", "haben"], "hatte", "gehabt", "haben", "Wir haben die Dokumente."),
      v("werden", { fr: "devenir / futur", en: "to become / future" }, ["werde", "wirst", "wird", "werden", "werdet", "werden"], "wurde", "geworden", "sein", "Die Lieferung wird vorverlegt."),
      v("gehen", { fr: "aller (à pied)", en: "to go (on foot)" }, ["gehe", "gehst", "geht", "gehen", "geht", "gehen"], "ging", "gegangen", "sein", "Der Kurier ging zum Späti."),
      v("kommen", { fr: "venir", en: "to come" }, ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], "kam", "gekommen", "sein", "Der Fahrer kommt um sieben."),
      v("fahren", { fr: "aller (véhicule)", en: "to go (by vehicle)" }, ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], "fuhr", "gefahren", "sein", "Er fährt nach Spandau."),
      v("machen", { fr: "faire", en: "to do / make" }, ["mache", "machst", "macht", "machen", "macht", "machen"], "machte", "gemacht", "haben", "Was machen Sie hier?"),
      v("essen", { fr: "manger", en: "to eat" }, ["esse", "isst", "isst", "essen", "esst", "essen"], "aß", "gegessen", "haben", "Hast du schon gegessen?"),
      v("trinken", { fr: "boire", en: "to drink" }, ["trinke", "trinkst", "trinkt", "trinken", "trinkt", "trinken"], "trank", "getrunken", "haben", "Er trank sein Bier am Späti."),
      v("sprechen", { fr: "parler", en: "to speak" }, ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"], "sprach", "gesprochen", "haben", "Sie sprechen sehr gut Deutsch."),
      v("arbeiten", { fr: "travailler", en: "to work" }, ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"], "arbeitete", "gearbeitet", "haben", "Sie arbeitet für Babel Corp."),
      v("geben", { fr: "donner", en: "to give" }, ["gebe", "gibst", "gibt", "geben", "gebt", "geben"], "gab", "gegeben", "haben", "Wenn ich Ihnen dieses Heft gebe…"),
      v("nehmen", { fr: "prendre", en: "to take" }, ["nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"], "nahm", "genommen", "haben", "Er nahm die Akte."),
      v("sehen", { fr: "voir", en: "to see" }, ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"], "sah", "gesehen", "haben", "Ich habe alles im Spiegel gesehen."),
      v("wissen", { fr: "savoir", en: "to know (facts)" }, ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"], "wusste", "gewusst", "haben", "Wir wissen es."),
      v("können", { fr: "pouvoir", en: "can / to be able" }, ["kann", "kannst", "kann", "können", "könnt", "können"], "konnte", "gekonnt", "haben", "Sie können eintreten."),
      v("müssen", { fr: "devoir", en: "must / to have to" }, ["muss", "musst", "muss", "müssen", "müsst", "müssen"], "musste", "gemusst", "haben", "Das Team muss bereit sein."),
      v("wollen", { fr: "vouloir", en: "to want" }, ["will", "willst", "will", "wollen", "wollt", "wollen"], "wollte", "gewollt", "haben", "Ich will einen Kaffee, bitte."),
      v("sagen", { fr: "dire", en: "to say" }, ["sage", "sagst", "sagt", "sagen", "sagt", "sagen"], "sagte", "gesagt", "haben", "Sie sagte nichts."),
      v("bleiben", { fr: "rester", en: "to stay" }, ["bleibe", "bleibst", "bleibt", "bleiben", "bleibt", "bleiben"], "blieb", "geblieben", "sein", "Bleiben Sie in der Nähe der Theke."),
      v("kaufen", { fr: "acheter", en: "to buy" }, ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"], "kaufte", "gekauft", "haben", "Ich kaufte eine Platte im Mauerpark."),
      v("suchen", { fr: "chercher", en: "to look for" }, ["suche", "suchst", "sucht", "suchen", "sucht", "suchen"], "suchte", "gesucht", "haben", "Wir suchen einen Kurier."),
      v("warten", { fr: "attendre", en: "to wait" }, ["warte", "wartest", "wartet", "warten", "wartet", "warten"], "wartete", "gewartet", "haben", "Er wartet nicht länger als zehn Minuten."),
      v("verstehen", { fr: "comprendre", en: "to understand" }, ["verstehe", "verstehst", "versteht", "verstehen", "versteht", "verstehen"], "verstand", "verstanden", "haben", "Jetzt verstehe ich den Plan."),
      v("helfen", { fr: "aider", en: "to help" }, ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"], "half", "geholfen", "haben", "Wenn Sie uns helfen…"),
      v("finden", { fr: "trouver", en: "to find" }, ["finde", "findest", "findet", "finden", "findet", "finden"], "fand", "gefunden", "haben", "Wir fanden den Safe."),
    ],

    grammar: [
      { id: "g-de-v2", title: { fr: "V2 — le verbe en 2ᵉ position", en: "V2 — the verb in 2nd position" }, keywords: ["v2", "position", "ordre", "word order", "verbe", "verb"],
        body: { fr: "Le verbe conjugué occupe TOUJOURS la 2ᵉ position de la phrase déclarative : « Ich habe… », « Gestern habe ich… ». Si autre chose ouvre la phrase, le sujet passe après le verbe.", en: "The conjugated verb ALWAYS takes 2nd position in a statement: « Ich habe… », « Gestern habe ich… ». If something else opens the sentence, the subject moves after the verb." },
        ex: "Gestern habe ich im Markt gegessen." },
      { id: "g-de-bracket", title: { fr: "La pince verbale", en: "The verb bracket" }, keywords: ["pince", "bracket", "klammer", "perfekt", "participe", "participle", "fin", "end"],
        body: { fr: "Au Perfekt et au futur, l'auxiliaire est en 2ᵉ position et le participe/infinitif ferme la phrase : « Ich habe gestern im Markt GEGESSEN ». Tout le sens attend la fin.", en: "In the Perfekt and future, the auxiliary sits in 2nd position and the participle/infinitive closes the sentence: « Ich habe gestern im Markt GEGESSEN ». The meaning waits until the end." },
        ex: "Hast du schon gegessen?" },
      { id: "g-de-perfekt", title: { fr: "Perfekt : haben ou sein", en: "Perfekt: haben or sein" }, keywords: ["perfekt", "haben", "sein", "auxiliaire", "auxiliary", "passé", "past"],
        body: { fr: "Le passé de l'oral : HABEN + participe pour la plupart des verbes ; SEIN pour le mouvement et le changement d'état (gehen, kommen, fahren, bleiben) : « Ich bin gegangen ».", en: "The spoken past: HABEN + participle for most verbs; SEIN for movement and change of state (gehen, kommen, fahren, bleiben): « Ich bin gegangen »." },
        ex: "Ich bin nach Spandau gefahren." },
      { id: "g-de-du-sie", title: "Du oder Sie?", keywords: ["du", "sie", "politesse", "formal", "informal", "vouvoiement"],
        body: { fr: "SIE (+ verbe pluriel) avec les inconnus adultes et au travail ; DU entre amis, jeunes, et vite à Berlin. En cas de doute : Sie — et laissez l'autre proposer le du.", en: "SIE (+ plural verb) with adult strangers and at work; DU among friends, the young, and quickly in Berlin. When in doubt: Sie — let the other person offer du." },
        ex: "Sind Sie neu hier? · Bist du aus dem Kiez?" },
      { id: "g-de-genders", title: "Der, die, das", keywords: ["genre", "gender", "article", "der", "die", "das"],
        body: { fr: "Trois genres : DER (m), DIE (f), DAS (n) — peu prévisibles, à apprendre avec le nom : der Markt, die Lieferung, das Lager. Pluriel : toujours DIE.", en: "Three genders: DER (m), DIE (f), DAS (n) — barely predictable, learn them with the noun: der Markt, die Lieferung, das Lager. Plural: always DIE." },
        ex: "der Kurier · die Akte · das Bier" },
      { id: "g-de-akkusativ", title: { fr: "L'accusatif : den", en: "The accusative: den" }, keywords: ["accusatif", "akkusativ", "cas", "case", "den", "complément", "object"],
        body: { fr: "Le complément d'objet direct change l'article masculin : der → DEN. « Ich sehe DEN Kurier ». Féminin, neutre et pluriel ne bougent pas à l'accusatif.", en: "The direct object changes the masculine article: der → DEN. « Ich sehe DEN Kurier ». Feminine, neuter and plural don't change in the accusative." },
        ex: "Ich sehe den Kurier." },
      { id: "g-de-nebensatz", title: { fr: "Wenn… : le verbe à la fin", en: "Wenn…: the verb at the end" }, keywords: ["wenn", "weil", "dass", "subordonnée", "subordinate", "fin", "end"],
        body: { fr: "Dans la subordonnée (wenn, weil, dass…), le verbe conjugué part EN FIN : « Wenn Sie uns helfen, … ». Et la principale qui suit s'ouvre sur le verbe : « …, schützen wir Sie ».", en: "In a subordinate clause (wenn, weil, dass…), the conjugated verb goes to the END: « Wenn Sie uns helfen, … ». And the following main clause opens with the verb: « …, schützen wir Sie »." },
        ex: "Wenn Sie uns helfen, schützen wir Sie." },
      { id: "g-de-strong", title: { fr: "Verbes forts : la voyelle change", en: "Strong verbs: the vowel shifts" }, keywords: ["verbe fort", "strong verb", "voyelle", "vowel", "isst", "fährt"],
        body: { fr: "Beaucoup de verbes changent de voyelle aux 2ᵉ/3ᵉ personnes : essen → du isst ; fahren → du fährst ; sprechen → du sprichst ; nehmen → du nimmst.", en: "Many verbs shift their vowel in the 2nd/3rd person: essen → du isst; fahren → du fährst; sprechen → du sprichst; nehmen → du nimmst." },
        ex: "Er isst immer dasselbe." },
      { id: "g-de-negation", title: { fr: "Négation : nicht / kein", en: "Negation: nicht / kein" }, keywords: ["negation", "nicht", "kein", "ne pas", "not"],
        body: { fr: "NICHT nie le verbe ou l'adjectif (« Ich verstehe nicht ») ; KEIN nie un nom (« Ich habe kein Bier » = pas de bière).", en: "NICHT negates verbs and adjectives (« Ich verstehe nicht »); KEIN negates nouns (« Ich habe kein Bier » = no beer)." },
        ex: "Er wartet nicht länger als zehn Minuten." },
      { id: "g-de-wfragen", title: "W-Fragen", keywords: ["question", "wer", "was", "wo", "wann", "wie", "interrogation"],
        body: { fr: "Wer (qui), was (quoi), wo (où), wann (quand), wie (comment), warum (pourquoi) — puis le verbe en 2ᵉ position : « Wo ist das Lager? ». Question fermée : verbe en tête — « Hast du gegessen? ».", en: "Wer (who), was (what), wo (where), wann (when), wie (how), warum (why) — then the verb in 2nd position: « Wo ist das Lager? ». Yes/no question: verb first — « Hast du gegessen? »." },
        ex: "Was darf's sein?" },
      { id: "g-de-capitals", title: { fr: "Les noms en majuscule", en: "Capitalised nouns" }, keywords: ["majuscule", "capital", "nom", "noun", "orthographe", "spelling"],
        body: { fr: "TOUS les noms communs prennent une majuscule : das Bier, die Lieferung, der Feierabend. Le repère le plus fiable pour identifier un nom allemand.", en: "ALL common nouns are capitalised: das Bier, die Lieferung, der Feierabend. The most reliable marker of a German noun." },
        ex: "Endlich Feierabend!" },
      { id: "g-de-separable", title: { fr: "Verbes à particule séparable", en: "Separable-prefix verbs" }, keywords: ["separable", "particule", "prefix", "trennbar", "an", "auf", "ein"],
        body: { fr: "La particule se détache et part en fin de phrase : einkaufen → « Ich kaufe ein » ; anrufen → « Ich rufe Sie an ». Au Perfekt, le -ge- se glisse au milieu : eingekauft.", en: "The prefix detaches and goes to the end: einkaufen → « Ich kaufe ein »; anrufen → « Ich rufe Sie an ». In the Perfekt, -ge- slips into the middle: eingekauft." },
        ex: "Ich rufe Sie morgen an." },
    ],

    phrasebook: [
      { phrase: "N'Abend!", note: { fr: "« Guten Abend » abrégé — le salut du soir.", en: "Clipped « Guten Abend » — the evening greeting." }, theme: "social", kw: ["bonsoir", "evening", "salut", "greeting"] },
      { phrase: "Ein Bier, bitte.", note: { fr: "Commande courte et polie — le standard.", en: "Short, polite order — the standard." }, theme: "bar", kw: ["biere", "beer", "commander", "order"] },
      { phrase: "Was darf's sein?", note: { fr: "« Qu'est-ce que ce sera ? » — l'accueil du commerçant.", en: "“What'll it be?” — the shopkeeper's welcome." }, theme: "bar" },
      { phrase: "Die Rechnung, bitte.", note: { fr: "L'addition, s'il vous plaît.", en: "The bill, please." }, theme: "restaurant", kw: ["addition", "bill", "payer", "pay"] },
      { phrase: "Was macht das?", note: { fr: "« Ça fait combien ? » — au comptoir.", en: "“What does it come to?” — at the counter." }, theme: "shopping", kw: ["prix", "price", "combien", "how much"] },
      { phrase: "Wo ist die U-Bahn?", note: { fr: "Demander le métro (U-Bahn).", en: "Asking for the metro (U-Bahn)." }, theme: "directions", kw: ["metro", "direction", "chemin", "way"] },
      { phrase: "Entschuldigung, das habe ich nicht verstanden.", note: { fr: "« Pardon, je n'ai pas compris. »", en: "“Sorry, I didn't understand.”" }, theme: "social" },
      { phrase: "Können Sie langsamer sprechen?", note: { fr: "« Pouvez-vous parler plus lentement ? »", en: "“Could you speak more slowly?”" }, theme: "social" },
      { phrase: "Einmal nach Alexanderplatz, bitte.", note: { fr: "Acheter un ticket — « un aller pour… ».", en: "Buying a ticket — “one to…”." }, theme: "transport" },
      { phrase: "Ich brauche einen Arzt.", note: { fr: "Urgence médicale (le 112).", en: "Medical emergency (112)." }, theme: "emergency", kw: ["medecin", "doctor", "urgence", "emergency"] },
      { phrase: "Rufen Sie die Polizei!", note: { fr: "« Appelez la police ! » (110).", en: "“Call the police!” (110)." }, theme: "emergency" },
      { phrase: "Ich möchte einen Tisch für zwei reservieren.", note: { fr: "Réserver une table — « möchte » adoucit.", en: "Booking a table — « möchte » softens it." }, theme: "restaurant" },
      { phrase: "Was empfehlen Sie?", note: { fr: "« Que me conseillez-vous ? »", en: "“What do you recommend?”" }, theme: "restaurant" },
      { phrase: "Wann schließen Sie?", note: { fr: "« À quelle heure fermez-vous ? »", en: "“What time do you close?”" }, theme: "shopping" },
      { phrase: "Schönen Feierabend!", note: { fr: "« Bonne fin de journée de travail » — très apprécié.", en: "“Enjoy your after-work evening” — much appreciated." }, theme: "social" },
      { phrase: "Freut mich.", note: { fr: "« Enchanté » — présentations.", en: "“Pleased to meet you” — introductions." }, theme: "social" },
    ],

    culture: [
      { title: "Pfand", text: { fr: "Presque toutes les bouteilles portent une consigne (8-25 cts). On les rapporte — ou on les pose près des poubelles pour les collecteurs : un geste très berlinois.", en: "Nearly every bottle carries a deposit (8–25 cents). Return them — or leave them beside bins for collectors: a very Berlin gesture." } },
      { title: "Feierabend", text: { fr: "La fin de la journée de travail, quasi sacrée. Appeler un collègue après le Feierabend est un vrai faux pas. « Schönen Feierabend ! » est le salut de 17 h.", en: "The end of the workday, near-sacred. Calling a colleague after Feierabend is a real faux pas. « Schönen Feierabend! » is the 5 pm greeting." } },
      { title: { fr: "Le dimanche silencieux", en: "Silent Sunday" }, text: { fr: "Le dimanche, presque tout est fermé et le bruit est réglementé (Ruhezeit) : pas de perceuse, pas de tondeuse. Les Spätis, eux, restent ouverts — d'où leur statut culte.", en: "On Sunday almost everything is closed and noise is regulated (Ruhezeit): no drilling, no mowing. Spätis stay open — hence their cult status." } },
      { title: { fr: "L'argent liquide", en: "Cash culture" }, text: { fr: "« Nur Bargeld » (espèces uniquement) reste courant dans les bars et petits commerces berlinois. Toujours avoir du liquide sur soi.", en: "« Nur Bargeld » (cash only) is still common in Berlin bars and small shops. Always carry cash." } },
      { title: { fr: "La ponctualité", en: "Punctuality" }, text: { fr: "Arriver à l'heure, c'est déjà presque en retard. Cinq minutes d'avance est la norme professionnelle — et un retard s'annonce, même de cinq minutes.", en: "Arriving on time is almost late. Five minutes early is the professional norm — and any delay is announced, even five minutes." } },
      { title: { fr: "Le feu rouge piéton", en: "The pedestrian light" }, text: { fr: "Traverser au rouge sous le regard d'enfants vous vaudra des remarques. L'Ampelmann est-berlinois est devenu une icône.", en: "Jaywalking in front of children earns you remarks. The East-Berlin Ampelmann became an icon." } },
      { title: "Späti", text: { fr: "Le Spätkauf — épicerie de nuit berlinoise. On y achète une bière qu'on boit sur le banc devant : une institution sociale autant qu'un commerce.", en: "The Spätkauf — Berlin's late-night corner shop. You buy a beer and drink it on the bench outside: as much a social institution as a shop." } },
    ],
  };
})();
