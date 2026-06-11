/**
 * THE CODEX — Base de connaissances ESPAGNOL.
 * Schéma générique : forms = [étiquette, valeur] pour l'affichage,
 * search = formes consultables par le chatbot. Notes bilingues {fr,en}.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.KB = Codex.KB || {};

(function () {
  // Fabrique compacte d'un verbe espagnol.
  function v(inf, gloss, pres, pret, fut, part, ex) {
    return {
      inf,
      gloss,
      forms: [
        ["presente", pres.join(" · ")],
        ["pretérito", pret.join(" · ")],
        ["futuro", fut],
        ["participio", part],
      ],
      search: [inf, ...pres, ...pret, fut, part],
      speak: `${inf}. ${pres[0]}, ${pres[1]}, ${pres[2]}. ${pret[0]}.`,
      ex,
    };
  }

  Codex.KB["es-ES"] = {
    verbs: [
      v("ser", { fr: "être (essence)", en: "to be (essence)" }, ["soy", "eres", "es", "somos", "sois", "son"], ["fui", "fuiste", "fue"], "seré", "sido", "Soy agente del Instituto."),
      v("estar", { fr: "être (état/lieu)", en: "to be (state/place)" }, ["estoy", "estás", "está", "estamos", "estáis", "están"], ["estuve", "estuviste", "estuvo"], "estaré", "estado", "El almacén está en Vallecas."),
      v("tener", { fr: "avoir", en: "to have" }, ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"], ["tuve", "tuviste", "tuvo"], "tendré", "tenido", "Tenemos los documentos."),
      v("haber", { fr: "avoir (auxiliaire)", en: "to have (auxiliary)" }, ["he", "has", "ha", "hemos", "habéis", "han"], ["hube", "hubiste", "hubo"], "habré", "habido", "¿Has comido ya?"),
      v("hacer", { fr: "faire", en: "to do / make" }, ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"], ["hice", "hiciste", "hizo"], "haré", "hecho", "¿Qué haces aquí?"),
      v("ir", { fr: "aller", en: "to go" }, ["voy", "vas", "va", "vamos", "vais", "van"], ["fui", "fuiste", "fue"], "iré", "ido", "El último tren va a salir."),
      v("venir", { fr: "venir", en: "to come" }, ["vengo", "vienes", "viene", "venimos", "venís", "vienen"], ["vine", "viniste", "vino"], "vendré", "venido", "Vengo del barrio."),
      v("poder", { fr: "pouvoir", en: "can / to be able" }, ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"], ["pude", "pudiste", "pudo"], "podré", "podido", "Puede entrar."),
      v("querer", { fr: "vouloir", en: "to want" }, ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"], ["quise", "quisiste", "quiso"], "querré", "querido", "Quiero un café, por favor."),
      v("saber", { fr: "savoir", en: "to know (facts)" }, ["sé", "sabes", "sabe", "sabemos", "sabéis", "saben"], ["supe", "supiste", "supo"], "sabré", "sabido", "Lo sabemos."),
      v("ver", { fr: "voir", en: "to see" }, ["veo", "ves", "ve", "vemos", "veis", "ven"], ["vi", "viste", "vio"], "veré", "visto", "Lo vi todo en el espejo."),
      v("dar", { fr: "donner", en: "to give" }, ["doy", "das", "da", "damos", "dais", "dan"], ["di", "diste", "dio"], "daré", "dado", "Si me da el cuaderno…"),
      v("decir", { fr: "dire", en: "to say" }, ["digo", "dices", "dice", "decimos", "decís", "dicen"], ["dije", "dijiste", "dijo"], "diré", "dicho", "No dijo nada."),
      v("hablar", { fr: "parler", en: "to speak" }, ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"], ["hablé", "hablaste", "habló"], "hablaré", "hablado", "Usted habla muy bien español."),
      v("comer", { fr: "manger", en: "to eat" }, ["como", "comes", "come", "comemos", "coméis", "comen"], ["comí", "comiste", "comió"], "comeré", "comido", "¿Has comido ya?"),
      v("beber", { fr: "boire", en: "to drink" }, ["bebo", "bebes", "bebe", "bebemos", "bebéis", "beben"], ["bebí", "bebiste", "bebió"], "beberé", "bebido", "Bebió su caña en silencio."),
      v("vivir", { fr: "vivre / habiter", en: "to live" }, ["vivo", "vives", "vive", "vivimos", "vivís", "viven"], ["viví", "viviste", "vivió"], "viviré", "vivido", "Vivo en La Latina."),
      v("trabajar", { fr: "travailler", en: "to work" }, ["trabajo", "trabajas", "trabaja", "trabajamos", "trabajáis", "trabajan"], ["trabajé", "trabajaste", "trabajó"], "trabajaré", "trabajado", "Ella trabaja para Babel Corp."),
      v("comprar", { fr: "acheter", en: "to buy" }, ["compro", "compras", "compra", "compramos", "compráis", "compran"], ["compré", "compraste", "compró"], "compraré", "comprado", "Compré un grabado en el Rastro."),
      v("llegar", { fr: "arriver", en: "to arrive" }, ["llego", "llegas", "llega", "llegamos", "llegáis", "llegan"], ["llegué", "llegaste", "llegó"], "llegaré", "llegado", "Acabo de llegar al barrio."),
      v("salir", { fr: "sortir / partir", en: "to leave / go out" }, ["salgo", "sales", "sale", "salimos", "salís", "salen"], ["salí", "saliste", "salió"], "saldré", "salido", "El mensajero salió a las dos."),
      v("pedir", { fr: "demander / commander", en: "to ask for / order" }, ["pido", "pides", "pide", "pedimos", "pedís", "piden"], ["pedí", "pediste", "pidió"], "pediré", "pedido", "Pidió la cuenta."),
      v("buscar", { fr: "chercher", en: "to look for" }, ["busco", "buscas", "busca", "buscamos", "buscáis", "buscan"], ["busqué", "buscaste", "buscó"], "buscaré", "buscado", "Buscamos a un mensajero."),
      v("esperar", { fr: "attendre / espérer", en: "to wait / hope" }, ["espero", "esperas", "espera", "esperamos", "esperáis", "esperan"], ["esperé", "esperaste", "esperó"], "esperaré", "esperado", "No esperará más de diez minutos."),
    ],

    grammar: [
      { id: "g-es-ser-estar", title: "Ser o estar", keywords: ["ser", "estar", "to be", "être"],
        body: { fr: "Deux verbes « être » : SER pour l'essence et l'identité (soy agente), ESTAR pour l'état et le lieu (estoy en Madrid, está cansado). Confondre les deux change le sens.", en: "Two verbs « to be »: SER for essence and identity (soy agente), ESTAR for state and place (estoy en Madrid, está cansado). Mixing them changes the meaning." },
        ex: "Soy agente. Estoy en Madrid." },
      { id: "g-es-pronouns", title: { fr: "Pronoms sujets optionnels", en: "Optional subject pronouns" }, keywords: ["pronombre", "pronoun", "yo", "tu", "sujet", "subject"],
        body: { fr: "La terminaison porte le sujet : « como » = je mange, « comes » = tu manges. On n'ajoute yo/tú que pour insister ou contraster.", en: "The ending carries the subject: « como » = I eat, « comes » = you eat. Add yo/tú only for emphasis or contrast." },
        ex: "Como aquí todos los días." },
      { id: "g-es-present", title: { fr: "Présent : -AR / -ER / -IR", en: "Present: -AR / -ER / -IR" }, keywords: ["presente", "present", "ar", "er", "ir", "conjugaison", "conjugation"],
        body: { fr: "Trois familles : hablar → hablo/hablas/habla ; comer → como/comes/come ; vivir → vivo/vives/vive. Nous : -amos/-emos/-imos.", en: "Three families: hablar → hablo/hablas/habla; comer → como/comes/come; vivir → vivo/vives/vive. We: -amos/-emos/-imos." },
        ex: "Ella trabaja para Babel Corp." },
      { id: "g-es-preterito", title: "El pretérito", keywords: ["preterito", "passé", "past", "comi", "accent"],
        body: { fr: "Le passé simple du quotidien : comí, comiste, comió. L'accent final distingue le temps : como (présent) vs comió (passé).", en: "The everyday simple past: comí, comiste, comió. The final accent distinguishes tense: como (present) vs comió (past)." },
        ex: "Comí con el jefe ayer." },
      { id: "g-es-perfecto", title: "El pretérito perfecto", keywords: ["perfecto", "haber", "he comido", "perfect"],
        body: { fr: "HABER (he/has/ha) + participe : « ¿Has comido? ». Utilisé en Espagne pour le passé récent — comme le present perfect anglais.", en: "HABER (he/has/ha) + participle: « ¿Has comido? ». Used in Spain for the recent past — like the English present perfect." },
        ex: "¿Has comido ya?" },
      { id: "g-es-tu-usted", title: "¿Tú o usted?", keywords: ["tu", "usted", "politesse", "formal", "informal"],
        body: { fr: "L'Espagne tutoie vite : bar, rue, collègues. USTED (+ verbe à la 3ᵉ personne) reste pour les aînés et l'officiel. Trop de usted sonne distant.", en: "Spain switches to tú fast: bars, streets, colleagues. USTED (+ 3rd person verb) is for elders and officialdom. Too much usted sounds distant." },
        ex: "¿Usted habla español? · ¿Tú qué te pongo?" },
      { id: "g-es-gender", title: { fr: "Genre : -o / -a", en: "Gender: -o / -a" }, keywords: ["genero", "gender", "el", "la", "masculin", "feminine"],
        body: { fr: "EL pour le masculin (souvent -o : el mercado), LA pour le féminin (souvent -a : la entrega). Exceptions à mémoriser : el día, la mano.", en: "EL for masculine (often -o: el mercado), LA for feminine (often -a: la entrega). Memorise exceptions: el día, la mano." },
        ex: "el almacén · la entrega" },
      { id: "g-es-questions", title: { fr: "¿Questions et ponctuation!", en: "¿Questions and punctuation!" }, keywords: ["question", "interrogation", "¿", "¡", "ponctuation", "punctuation"],
        body: { fr: "L'espagnol ouvre ET ferme : ¿Comiste aquí? ¡Qué desastre! L'intonation suffit à l'oral — pas d'inversion obligatoire.", en: "Spanish opens AND closes: ¿Comiste aquí? ¡Qué desastre! Intonation is enough in speech — no mandatory inversion." },
        ex: "¿Has visto el partido?" },
      { id: "g-es-ir-a", title: { fr: "Futur proche : ir a + infinitif", en: "Near future: ir a + infinitive" }, keywords: ["futur", "future", "ir a", "voy a"],
        body: { fr: "VOY A + infinitif = je vais… : « Voy a comer ». Le futur simple (-é/-á) existe, mais « ir a » domine l'oral.", en: "VOY A + infinitive = I'm going to…: « Voy a comer ». The simple future (-é/-á) exists, but « ir a » rules speech." },
        ex: "El último tren va a salir." },
      { id: "g-es-negation", title: { fr: "Négation : no + verbe", en: "Negation: no + verb" }, keywords: ["negacion", "negation", "no", "nada", "nunca"],
        body: { fr: "NO se place devant le verbe : « No veo deportes ». Double négation correcte : « No dijo nada » (il n'a rien dit).", en: "NO goes before the verb: « No veo deportes ». Double negation is correct: « No dijo nada » (he said nothing)." },
        ex: "No esperará más de diez minutos." },
      { id: "g-es-gustar", title: "Me gusta…", keywords: ["gustar", "aimer", "like", "me encanta"],
        body: { fr: "« Me gusta el barrio » = le quartier me plaît : la chose est sujet, la personne est complément. Pluriel : me gustan las tapas. Plus fort : me encanta.", en: "« Me gusta el barrio » = the neighbourhood pleases me: the thing is the subject. Plural: me gustan las tapas. Stronger: me encanta." },
        ex: "Me encanta La Latina." },
      { id: "g-es-porpara", title: "Por o para", keywords: ["por", "para", "pour", "for"],
        body: { fr: "PARA = destination/but (trabaja para Babel Corp). POR = cause/échange/passage (por la mañana, gracias por todo).", en: "PARA = destination/purpose (trabaja para Babel Corp). POR = cause/exchange/through (por la mañana, gracias por todo)." },
        ex: "Ella trabaja para Babel Corp." },
    ],

    phrasebook: [
      { phrase: "¡Buenas!", note: { fr: "Le salut passe-partout, à toute heure.", en: "The all-purpose greeting, any hour." }, theme: "social", kw: ["bonjour", "hello", "salut", "greeting"] },
      { phrase: "Una caña, por favor.", note: { fr: "Petite bière pression — LA commande madrilène.", en: "Small draft beer — THE Madrid order." }, theme: "bar", kw: ["biere", "beer", "commander", "order"] },
      { phrase: "¿Qué te pongo?", note: { fr: "« Qu'est-ce que je te sers ? » — l'accueil du barman.", en: "“What can I get you?” — the barman's welcome." }, theme: "bar" },
      { phrase: "La cuenta, por favor.", note: { fr: "L'addition, s'il vous plaît.", en: "The bill, please." }, theme: "restaurant", kw: ["addition", "bill", "payer", "pay"] },
      { phrase: "¿Cuánto cuesta?", note: { fr: "« Combien ça coûte ? » — marchés et boutiques.", en: "“How much is it?” — markets and shops." }, theme: "shopping", kw: ["prix", "price", "combien", "how much"] },
      { phrase: "¿Dónde está el metro?", note: { fr: "Demander le métro.", en: "Asking for the metro." }, theme: "directions", kw: ["metro", "direction", "chemin", "way"] },
      { phrase: "Perdona, no he entendido.", note: { fr: "« Pardon, je n'ai pas compris » — sans perdre la face.", en: "“Sorry, I didn't understand” — saving face." }, theme: "social" },
      { phrase: "¿Puede hablar más despacio?", note: { fr: "« Pouvez-vous parler plus lentement ? »", en: "“Could you speak more slowly?”" }, theme: "social" },
      { phrase: "Un billete para Sol, por favor.", note: { fr: "Acheter un ticket de métro/train.", en: "Buying a metro/train ticket." }, theme: "transport" },
      { phrase: "Necesito un médico.", note: { fr: "Urgence médicale (le 112 en Espagne).", en: "Medical emergency (112 in Spain)." }, theme: "emergency", kw: ["medecin", "doctor", "urgence", "emergency"] },
      { phrase: "¡Llame a la policía!", note: { fr: "« Appelez la police ! » (091).", en: "“Call the police!” (091)." }, theme: "emergency" },
      { phrase: "Quisiera reservar una mesa para dos.", note: { fr: "Réserver une table — le conditionnel adoucit.", en: "Booking a table — the conditional softens it." }, theme: "restaurant" },
      { phrase: "¿Qué me recomienda?", note: { fr: "« Que me conseillez-vous ? » — flatte tout serveur.", en: "“What do you recommend?” — flatters any waiter." }, theme: "restaurant" },
      { phrase: "¿A qué hora cierran?", note: { fr: "« À quelle heure fermez-vous ? »", en: "“What time do you close?”" }, theme: "shopping" },
      { phrase: "Venga, hasta luego.", note: { fr: "« Allez, à plus » — la sortie naturelle.", en: "“Right, see you” — the natural exit." }, theme: "social" },
      { phrase: "Encantado / Encantada.", note: { fr: "« Enchanté(e) » — présentations.", en: "“Pleased to meet you” — introductions." }, theme: "social" },
    ],

    culture: [
      { title: { fr: "Les horaires espagnols", en: "Spanish hours" }, text: { fr: "Déjeuner à 14 h 30, dîner à 21 h 30 ou plus tard. Arriver à 19 h dans un restaurant madrilène, c'est dîner seul avec les serveurs.", en: "Lunch at 2:30 pm, dinner at 9:30 pm or later. Arriving at 7 pm in a Madrid restaurant means dining alone with the waiters." } },
      { title: "La sobremesa", text: { fr: "Le temps sacré APRÈS le repas : café, conversation, parfois une heure entière. Demander l'addition trop vite est un faux pas.", en: "The sacred time AFTER the meal: coffee, conversation, sometimes a full hour. Asking for the bill too soon is a faux pas." } },
      { title: { fr: "Les deux bises", en: "The two kisses" }, text: { fr: "Deux bises (droite d'abord) entre amis et lors des présentations informelles — y compris homme-femme. En contexte d'affaires : poignée de main.", en: "Two kisses (right cheek first) between friends and at informal introductions — including man-woman. In business: handshake." } },
      { title: "El Rastro", text: { fr: "Le marché aux puces du dimanche, depuis quatre siècles. On y marchande — mais jamais à la première offre.", en: "The Sunday flea market, four centuries old. Haggling expected — never at the first offer." } },
      { title: { fr: "La tapa offerte", en: "The free tapa" }, text: { fr: "Dans une bonne partie de l'Espagne, une tapa accompagne gratuitement la boisson. La réclamer bruyamment trahit le touriste.", en: "In much of Spain, a free tapa comes with your drink. Demanding it loudly marks the tourist." } },
      { title: { fr: "« Ahora » est élastique", en: "« Ahora » is elastic" }, text: { fr: "« Maintenant » peut signifier dans cinq minutes… ou une heure. « Ahora mismo » resserre ; « ya » = vraiment tout de suite.", en: "“Now” can mean in five minutes… or an hour. « Ahora mismo » tightens it; « ya » = right now." } },
      { title: { fr: "Le volume sonore", en: "The noise level" }, text: { fr: "Les bars espagnols sont bruyants — parler fort n'est pas impoli, c'est participer. Chuchoter attire davantage l'attention.", en: "Spanish bars are loud — speaking up isn't rude, it's joining in. Whispering draws more attention." } },
    ],
  };
})();
