/**
 * THE CODEX — Arc FRANÇAIS · Paris.
 * L1 (narration language): English — for English-speaking agents.
 * Mission schema per GDD §13.3.
 */
"use strict";
window.Codex = window.Codex || {};

Codex.ARCS["fr-FR"] = {
  id: "fr-FR",
  l1: "en",
  language: { id: "fr-FR", name: "French", flag: "🇫🇷", country: "France", tts: "fr-FR" },
  theme: "fr-FR",
  zone: { id: "paris", name: "Paris", domain: "Everyday verbs · Le présent & le passé composé" },

  echo: {
    hq: [
      "Agent, a new dossier is waiting for your signature in Paris.",
      "The Paris network is restless tonight. Stay sharp.",
      "Your intel is stacking up. Exactly what the Institute expected from you.",
      "BABEL CORP has moved assets to the Left Bank. Every word matters now.",
    ],
    success: [
      "Excellent instinct, Agent. The structure you chose is perfectly idiomatic.",
      "Clean mission. The Institute will take note.",
      "You're progressing faster than projected. Don't slow down.",
    ],
    perfect: [
      "Zero errors. I'm starting to wonder if you need me at all.",
      "Surgical work, Agent. Rare, at this level.",
    ],
    warning: [
      "Careful. The target noticed something unusual in your phrasing.",
      "Suspicion rising. Choose your next word with care.",
    ],
    urgent: [
      "Refocus. Pick the most neutral word available. Now.",
      "The room is tightening. No more approximations.",
    ],
  },

  missions: [
    // ================================================================
    // FR-PAR-001 — LA PERCÉE — Verbe MANGER
    // ================================================================
    {
      id: "FR-PAR-001",
      type: "percee",
      typeName: "La Percée",
      icon: "🔓",
      title: "Operation TERRASSE",
      subtitle: "Crack the chef's code",
      location: "Café de Flore · Saint-Germain",
      difficulty: 2,
      durationMin: 10,
      xpBase: 150,
      brief: {
        narrative: "A pastry chef working for BABEL CORP uses the Café de Flore as a front. To approach the target without raising eyebrows, you must blend in with the regulars on the terrace.",
        context: "Four intel fragments are hidden across the café. One clumsy phrase, and the target walks.",
        intelPreview: "VERB: [██████]",
        echo: "Your linguistic objective: the full paradigm of the most useful -ER verb in French. Eyes open, Agent.",
      },
      scene: {
        name: "Café de Flore — the terrace",
        ambiance: "cafe",
        props: [
          { e: "☕", x: 14, y: 45 }, { e: "🥐", x: 32, y: 58 }, { e: "🪑", x: 24, y: 74, size: 54 },
          { e: "🪑", x: 72, y: 76, size: 54 }, { e: "📰", x: 48, y: 62 }, { e: "🍷", x: 86, y: 40 },
          { e: "🌳", x: 93, y: 30, size: 56 }, { e: "💡", x: 58, y: 12, size: 28 },
        ],
      },
      fragments: [
        {
          id: "frag-f01", icon: "📋", label: "The menu board", x: 18, y: 48,
          sceneText: "A regular smiles at the waiter: « Je mange ici tous les midis. » Her friend laughs: « Et il mange toujours la même chose ! »",
          intel: "JE MANGE · TU MANGES · IL/ELLE MANGE",
          rule: "-ER verbs, present tense: -e, -es, -e. All three sound identical.",
          echo: "Those endings are silent — mange, manges, mange all sound the same. French hides its grammar in the spelling.",
        },
        {
          id: "frag-f02", icon: "💬", label: "Overheard at the counter", x: 44, y: 40,
          sceneText: "Two friends greet each other: « Tu as mangé ? » — « Non, j'ai pas eu le temps. On va où ? »",
          intel: "J'AI MANGÉ — passé composé",
          rule: "Past tense: AVOIR (ai/as/a) + past participle MANGÉ.",
          echo: "« Tu as mangé ? » — the everyday French past. AVOIR plus the participle. You'll hear it ten times a day.",
        },
        {
          id: "frag-f03", icon: "🪧", label: "The chef's chalkboard", x: 68, y: 33,
          sceneText: "On the chalkboard, a motto: « Bien manger, c'est bien vivre. » Below it: « Nous mangeons local, vous mangez frais. »",
          intel: "NOUS MANGEONS · VOUS MANGEZ",
          rule: "NOUS form keeps the E: mangEons — to keep the soft G sound.",
          echo: "Note that extra E in « mangeons ». Without it, the G would harden. A spelling trap the French love.",
        },
        {
          id: "frag-f04", icon: "📓", label: "The waiter's notepad", x: 82, y: 64,
          sceneText: "In the waiter's notepad: « La table 4 mangera à 20h » · « M. H. — dit qu'il mangerait n'importe quoi si c'est gratuit. »",
          intel: "MANGERA (futur) · MANGERAIT (conditionnel)",
          rule: "Future and conditional are built on the full infinitive: manger + endings.",
          echo: "MANGERA, MANGERAIT — the infinitive is your stem. The paradigm is complete, Agent.",
        },
      ],
      cultural: {
        icon: "☕", label: "The coffee order", x: 56, y: 80,
        title: "« Un café » = an espresso",
        text: "In France, ordering « un café » gets you an espresso. If you want a long black coffee, ask for « un café allongé » — and a milky one is « un grand crème ».",
        xp: 20,
      },
      intelCard: {
        kind: "verb",
        id: "intel-verb-manger",
        lemma: "MANGER",
        phonetics: "/mɑ̃.ʒe/",
        tag: "VERBE DU 1ᵉʳ GROUPE (-ER)",
        speakText: "manger. Je mange, tu manges, il mange. J'ai mangé. Nous mangeons.",
        flashback: "Café de Flore, noon. A regular waves at the waiter: « Je mange ici tous les midis ! » Behind the counter, the pastry chef glances at the street — twice. You note the time…",
        table: [
          { label: "PRÉSENT", value: "je mange\ntu manges\nil/elle mange ⚡" },
          { label: "PASSÉ COMPOSÉ", value: "j'ai mangé\n(avoir + participe)" },
          { label: "NOUS / VOUS / ILS", value: "nous mangeons ⚠\nvous mangez\nils mangent" },
          { label: "FUTUR / COND.", value: "je mangerai\nje mangerais\n(base : l'infinitif)" },
        ],
        examples: ["Je mange ici tous les midis.", "Tu as mangé ?", "Nous mangeons local."],
        quiz: [
          { q: "What is the past participle of MANGER?", options: ["mangé", "mangeé", "mangu"], a: 0 },
          { q: "« Nous ____ local. »", options: ["mangons", "mangeons", "mangez"], a: 1 },
          { q: "« Tu ____ mangé ? »", options: ["es", "a", "as"], a: 2 },
        ],
      },
    },

    // ================================================================
    // FR-PAR-002 — L'INFILTRATION — Bistrot Le Petit Zinc
    // ================================================================
    {
      id: "FR-PAR-002",
      type: "infiltration",
      typeName: "L'Infiltration",
      icon: "🕵️",
      title: "Operation ZINC",
      subtitle: "Pass for a local at the counter",
      location: "Le Petit Zinc · Le Marais",
      difficulty: 3,
      durationMin: 12,
      xpBase: 130,
      brief: {
        narrative: "A BABEL CORP courier stops at Le Petit Zinc every Thursday evening. You must hold your place at the counter, pass for a neighbourhood regular, and watch a package change hands.",
        context: "Parisian bistros run on ritual. Skip a « bonjour », use « tu » with a stranger — and every head in the room turns.",
        intelPreview: "VOCABULARY: [██████]",
        echo: "The French café has its liturgy. « Bonjour » opens every door — forgetting it closes them all.",
      },
      scene: {
        name: "Le Petit Zinc — the counter",
        ambiance: "pub",
        props: [
          { e: "🍷", x: 15, y: 42 }, { e: "🥖", x: 86, y: 32, size: 36 }, { e: "🪑", x: 76, y: 72, size: 50 },
          { e: "🕰️", x: 50, y: 14, size: 34 }, { e: "☕", x: 34, y: 46 },
        ],
      },
      interactions: [
        {
          npc: "Le serveur", npcIcon: "🧑‍🍳",
          line: "Bonjour ! Vous désirez ?",
          context: "He wipes the counter without looking up. The whole room can hear your answer.",
          choices: [
            { text: "Bonjour, un café, s'il vous plaît.", correct: true, reaction: "A nod. The espresso machine hisses. You're part of the furniture." },
            { text: "Café.", reaction: "No « bonjour »… The waiter's jaw tightens. A regular smirks.", suspicion: 20 },
            { text: "Je veux du café maintenant.", reaction: "Too blunt. He serves you slowly, very slowly.", suspicion: 15 },
          ],
          echoHint: "In France, « Bonjour » comes before everything. Skipping it marks you instantly.",
        },
        {
          npc: "Une habituée", npcIcon: "👩‍🦳",
          line: "Vous êtes nouveau dans le quartier, non ?",
          context: "She studies you over her glasses, friendly but precise.",
          choices: [
            { text: "Oui, je viens d'arriver. C'est un beau quartier.", correct: true, reaction: "« Ah, vous verrez, on est bien ici. » She returns to her crossword. Perfect." },
            { text: "Tu es qui, toi ?", correct: false, reaction: "« Tu » ?! To a stranger her age? The counter goes quiet.", suspicion: 25 },
            { text: "That is not your business.", reaction: "English, and rude with it. She raises an eyebrow at the waiter.", suspicion: 20 },
          ],
          echoHint: "Strangers get « vous ». « Tu » too early breaks a cover faster than any accent.",
        },
        {
          npc: "Le serveur", npcIcon: "🧑‍🍳",
          line: "Et avec ceci ?",
          context: "He's back, pen behind his ear. Anything else?",
          choices: [
            { text: "Ce sera tout, merci.", correct: true, reaction: "« Très bien. » He slides the saucer with your bill under the cup." },
            { text: "Rien.", reaction: "One dry word. The waiter exchanges a glance with the regular.", suspicion: 15 },
            { text: "Donne-moi l'addition.", reaction: "« Donne »-moi? Tu-form to a waiter. The room notices.", suspicion: 20 },
          ],
          echoHint: "« Ce sera tout, merci » — the standard closing. Polite, short, invisible.",
        },
        {
          npc: "Un client pressé", npcIcon: "🧔",
          line: "Pardon, cette chaise est libre ?",
          context: "He gestures at the stool next to you — right where you need to keep sitting.",
          choices: [
            { text: "Oui, allez-y, je vous en prie.", correct: true, reaction: "« Merci ! » He takes the stool. You keep your line of sight to the door." },
            { text: "Non.", reaction: "No explanation, no smile. He frowns and stays — closer than you'd like.", suspicion: 15 },
            { text: "Prends-la et laisse-moi.", reaction: "Tu-form again, and aggressive. People start to remember your face.", suspicion: 20 },
          ],
          echoHint: "« Je vous en prie » — the polished way to say 'go ahead'. Generosity is great cover.",
        },
        {
          npc: "Le patron", npcIcon: "👨‍🦲",
          line: "On ferme dans dix minutes, messieurs dames !",
          context: "He taps his watch. By the door, the courier reaches into his bag.",
          choices: [
            { text: "Très bien — l'addition, s'il vous plaît.", correct: true, reaction: "He brings the bill. In the mirror, you watch the package change hands. You saw everything." },
            { text: "Pourquoi vous fermez ?!", reaction: "The whole room turns. The courier pauses, package half-out of the bag.", suspicion: 20 },
            { text: "Je reste encore une heure.", reaction: "The patron laughs out loud. Memorable — the wrong kind.", suspicion: 25 },
          ],
          echoHint: "« L'addition, s'il vous plaît » — the regular's exit line. Calm, expected, invisible.",
        },
      ],
      cultural: {
        title: "Tu or vous?",
        text: "Use « vous » with strangers, shopkeepers and anyone older. « Tu » too early is one of the fastest ways to be remembered in France — fatal for a cover.",
        xp: 20,
      },
      intelCard: {
        kind: "vocab",
        id: "intel-vocab-bistrot",
        lemma: "BISTROT SURVIVAL KIT",
        phonetics: "informal register · France",
        tag: "ACTIVE VOCABULARY — SOCIAL",
        speakText: "Bonjour, un café, s'il vous plaît. Ce sera tout, merci. L'addition, s'il vous plaît.",
        flashback: "Le Petit Zinc, Thursday, 6:50 pm. The patron taps his watch: « On ferme dans dix minutes ! » In the mirror behind the bottles, a package slides across a table…",
        entries: [
          { en: "Bonjour !", note: "The mandatory opener — before any request, anywhere, always." },
          { en: "Un café, s'il vous plaît.", note: "The standard counter order. « S'il vous plaît » seals it." },
          { en: "Vous désirez ?", note: "The waiter's 'what can I get you?'. Answer with your order + merci." },
          { en: "Ce sera tout, merci.", note: "'That will be all' — the polite close to an order." },
          { en: "Je vous en prie.", note: "'Please do / you're welcome' — polished and friendly." },
          { en: "L'addition, s'il vous plaît !", note: "'The bill, please' — the regular's exit line." },
        ],
        examples: ["Bonjour, un café allongé, s'il vous plaît.", "Ce sera tout, merci.", "L'addition, s'il vous plaît !"],
      },
    },

    // ================================================================
    // FR-PAR-003 — LA SURVEILLANCE — Note interne interceptée
    // ================================================================
    {
      id: "FR-PAR-003",
      type: "surveillance",
      typeName: "La Surveillance",
      icon: "📄",
      title: "Operation COURRIER",
      subtitle: "Decode BABEL CORP's Paris memo",
      location: "CODEX safehouse · Belleville",
      difficulty: 2,
      durationMin: 10,
      xpBase: 120,
      brief: {
        narrative: "Our technical cell intercepted an internal memo from BABEL CORP's Paris office. It contains the details of a sensitive hand-over somewhere in the city.",
        context: "Extract the critical information before the channel closes. Every missed detail is an advantage for the adversary.",
        intelPreview: "DOCUMENT: [████ ████]",
        echo: "Read like an agent: hunt for the who, the when, the where. Everything else is noise.",
      },
      scene: { name: "Belleville safehouse", ambiance: "office", props: [] },
      document: {
        title: "NOTE INTERCEPTÉE — CANAL SÉCURISÉ 9",
        meta: "De : c.marchand@babelcorp-paris.fr\nÀ : equipe-archives@babelcorp-paris.fr\nObjet : Réunion avancée — consignes URGENTES",
        paragraphs: [
          "À toute l'équipe,",
          "La réunion du vendredi est avancée à jeudi, 9 heures, salle Voltaire. Merci d'être ponctuels — la direction sera présente.",
          "Le coursier déposera le dossier à l'accueil avant midi. Il n'attendra pas plus de dix minutes.",
          "Comme d'habitude, seule Mme Lefèvre est autorisée à signer le registre. Personne d'autre ne touche aux documents.",
          "Si quelqu'un pose des questions sur le dossier, la réponse convenue est qu'il contient des brochures pour le bureau de Lisbonne.",
          "Cordialement,\nC. Marchand — Coordination",
        ],
        glossary: {
          "réunion": { ph: "/ʁe.y.njɔ̃/", hint: "📅 a work meeting" },
          "avancée": { ph: "/a.vɑ̃.se/", hint: "⏪ moved earlier in time" },
          "coursier": { ph: "/kuʁ.sje/", hint: "🚴 a person who delivers packages" },
          "dossier": { ph: "/do.sje/", hint: "🗂️ a file, a folder of documents" },
          "accueil": { ph: "/a.kœj/", hint: "🛎️ the reception desk" },
          "registre": { ph: "/ʁə.ʒistʁ/", hint: "📖 an official record book to sign" },
          "convenue": { ph: "/kɔ̃v.ny/", hint: "🤝 agreed in advance" },
          "brochures": { ph: "/bʁɔ.ʃyʁ/", hint: "📚 thin printed booklets" },
        },
      },
      questions: [
        {
          q: "When is the meeting now scheduled?",
          options: ["Thursday at 9, salle Voltaire", "Friday at 9, salle Voltaire", "Thursday at noon"],
          correct: 0,
          echoHint: "The memo opposes two days. Look for « avancée » — moved up.",
        },
        {
          q: "Where will the courier leave the file?",
          options: ["In salle Voltaire", "At the reception desk (l'accueil)", "At Mme Lefèvre's office"],
          correct: 1,
          echoHint: "« À l'accueil » — the reception. Before noon.",
        },
        {
          q: "Who alone may sign the register?",
          options: ["Any team member", "The courier", "Mme Lefèvre"],
          correct: 2,
          echoHint: "« Seule Mme Lefèvre est autorisée… »",
        },
        {
          q: "What is the agreed cover story about the file?",
          options: ["Brochures for the Lisbon office", "Accounting archives", "IT equipment for Madrid"],
          correct: 0,
          echoHint: "« La réponse convenue » — the agreed answer — closes the memo.",
        },
      ],
      cultural: {
        title: "« Cordialement »",
        text: "The standard French email sign-off. Too warm (« bisous ») or too stiff (« veuillez agréer… ») in the wrong context marks an outsider immediately.",
        xp: 20,
      },
      intelCard: {
        kind: "vocab",
        id: "intel-vocab-bureau",
        lemma: "BUREAU FILE",
        phonetics: "professional register · written",
        tag: "READING COMPREHENSION — FORMAL MEMO",
        speakText: "La réunion est avancée à jeudi. Le coursier déposera le dossier à l'accueil.",
        flashback: "Belleville, 2 am. The screen blinks: « INTERCEPTION RÉUSSIE — CANAL 9 ». BABEL CORP's memo renders line by line. Somewhere in the 8th arrondissement, a courier re-reads his orders…",
        entries: [
          { en: "la réunion /ʁe.y.njɔ̃/", note: "The meeting. « Avancée » = moved earlier." },
          { en: "le coursier /kuʁ.sje/", note: "The courier — delivers packages and files." },
          { en: "le dossier /do.sje/", note: "The file, the folder. Watch this word — spies live in it." },
          { en: "l'accueil /a.kœj/", note: "Reception desk. One of French's trickiest spellings." },
          { en: "le registre /ʁə.ʒistʁ/", note: "The official record book one signs." },
          { en: "Cordialement", note: "Standard professional sign-off — the safe choice." },
        ],
        examples: ["La réunion est avancée à jeudi.", "Le coursier déposera le dossier.", "Cordialement, C. Marchand."],
      },
    },

    // ================================================================
    // FR-PAR-004 — LA NÉGOCIATION — La bouquiniste des quais
    // ================================================================
    {
      id: "FR-PAR-004",
      type: "negociation",
      typeName: "La Négociation",
      icon: "🤝",
      title: "Operation RIVE GAUCHE",
      subtitle: "Turn the informant Aubert",
      location: "Quais de Seine · Notre-Dame",
      difficulty: 3,
      durationMin: 14,
      xpBase: 140,
      brief: {
        narrative: "Marguerite Aubert runs a bouquiniste stall on the Seine — and keeps BABEL CORP's accounts on the side. She'll talk, if you earn her trust. She's been burned before, and she listens to grammar the way a jeweller listens to a coin.",
        context: "Every sentence must be flawless French. An agent who fumbles agreements inspires no confidence at all.",
        intelPreview: "GRAMMAR: [██████████]",
        echo: "Build each sentence with precision. Here, your grammar is your credibility.",
      },
      scene: {
        name: "The bouquiniste stalls — left bank",
        ambiance: "market",
        props: [
          { e: "📚", x: 12, y: 55 }, { e: "🗼", x: 88, y: 20, size: 50 }, { e: "📖", x: 32, y: 60 },
          { e: "🏮", x: 52, y: 15, size: 28 }, { e: "🌉", x: 70, y: 35, size: 48 },
        ],
      },
      rounds: [
        {
          npcLine: "Prouvez que vous venez de l'Institut. Pourquoi je vous parlerais ?",
          targetL1: "“We have the documents.”",
          solution: ["Nous", "avons", "les documents"],
          bank: [
            { w: "Nous", cat: "subject" }, { w: "Elle", cat: "subject" },
            { w: "avons", cat: "verb" }, { w: "avez", cat: "verb" }, { w: "a", cat: "verb" },
            { w: "les documents", cat: "comp" }, { w: "hier", cat: "mod" },
          ],
          okReaction: "Aubert glances down the quay, then nods. « Continuez. »",
          echoHint: "Subject NOUS → AVONS. AVEZ belongs to vous, A to il/elle.",
        },
        {
          npcLine: "On vous a suivi ? Où étiez-vous hier soir ?",
          targetL1: "“I ate at the bistro yesterday.”",
          solution: ["J'", "ai mangé", "au bistrot", "hier"],
          bank: [
            { w: "J'", cat: "subject" }, { w: "Il", cat: "subject" },
            { w: "ai mangé", cat: "verb" }, { w: "a mangé", cat: "verb" }, { w: "mange", cat: "verb" },
            { w: "au bistrot", cat: "comp" }, { w: "hier", cat: "mod" }, { w: "demain", cat: "mod" },
          ],
          okReaction: "A simple, credible alibi — in clean passé composé. Her shoulders drop a little.",
          echoHint: "The past of MANGER — you secured it at Operation TERRASSE. J'AI + participle.",
        },
        {
          npcLine: "Il y a une femme qui nous observe depuis le pont. Vous la connaissez ?",
          targetL1: "“She works for Babel Corp.”",
          solution: ["Elle", "travaille", "pour Babel Corp"],
          bank: [
            { w: "Elle", cat: "subject" }, { w: "Ils", cat: "subject" },
            { w: "travaille", cat: "verb" }, { w: "travailles", cat: "verb" }, { w: "travaillent", cat: "verb" },
            { w: "pour Babel Corp", cat: "comp" }, { w: "toujours", cat: "mod" },
          ],
          okReaction: "« Alors nous n'avons pas beaucoup de temps. » She slips a notebook from under the stall.",
          echoHint: "ELLE → travaille, silent ending. TRAVAILLES is for tu, TRAVAILLENT for ils.",
        },
        {
          npcLine: "Si je vous donne ce carnet… qu'est-ce qui m'arrive, à moi ?",
          targetL1: "“If you help us, we will protect you.”",
          solution: ["Si", "vous", "nous aidez", "nous", "vous protégerons"],
          bank: [
            { w: "Si", cat: "conn" }, { w: "Quand", cat: "conn" },
            { w: "vous", cat: "subject" }, { w: "nous", cat: "subject" },
            { w: "nous aidez", cat: "verb" }, { w: "nous aidons", cat: "verb" },
            { w: "vous protégerons", cat: "verb" }, { w: "vous protégeons", cat: "verb" },
          ],
          okReaction: "She presses the notebook into your hand. « Ne me faites pas regretter ça. »",
          echoHint: "Real conditional: SI + present, then the future — protégerons.",
        },
      ],
      cultural: {
        title: "Les bouquinistes",
        text: "The green boxes along the Seine have sold books since the 16th century — UNESCO-listed, and the best place in Paris to talk without being overheard.",
        xp: 20,
      },
      intelCard: {
        kind: "grammar",
        id: "intel-grammar-fr-structure",
        lemma: "MOTEUR DE PHRASE",
        phonetics: "Sujet → Verbe → Complément",
        tag: "OPERATIONAL GRAMMAR",
        speakText: "Si vous nous aidez, nous vous protégerons.",
        flashback: "The quays at dusk, Notre-Dame's bells behind you. Aubert weighs every one of your sentences like a coin. At the fourth, she slides a notebook across the books: « Ne me faites pas regretter ça. »",
        table: [
          { label: "BASE ORDER", value: "Sujet + Verbe + Complément\nElle travaille pour Babel Corp." },
          { label: "SILENT ENDINGS", value: "je travaille · tu travailles\nils travaillent — same sound!" },
          { label: "PASSÉ COMPOSÉ", value: "avoir + participe\nJ'ai mangé au bistrot." },
          { label: "REAL CONDITIONAL", value: "Si + présent,\npuis futur (protégerons)" },
        ],
        examples: ["Nous avons les documents.", "Elle travaille pour Babel Corp.", "Si vous nous aidez, nous vous protégerons."],
        quiz: [
          { q: "“Elle ____ pour Babel Corp.”", options: ["travailles", "travaille", "travaillent"], a: 1 },
          { q: "Complete: “Si vous nous aidez, nous vous ____.”", options: ["protégeons", "protégerions", "protégerons"], a: 2 },
        ],
      },
    },

    // ================================================================
    // FR-PAR-005 — LA PERCÉE — Verbe ALLER (métro de nuit)
    // ================================================================
    {
      id: "FR-PAR-005",
      type: "percee",
      typeName: "La Percée",
      icon: "🔓",
      title: "Operation DERNIER MÉTRO",
      subtitle: "Tail the courier underground",
      location: "Station Châtelet · midnight",
      difficulty: 3,
      durationMin: 10,
      xpBase: 150,
      brief: {
        narrative: "The courier left the bistro with the package and vanished into Châtelet — the largest métro station in the world. You follow him through the night corridors, where every sign, every announcement, every scribbled note may hold the intel you need.",
        context: "The last train leaves at 00:47. Four fragments before he disappears.",
        intelPreview: "VERB: [█████]",
        echo: "Tonight's target: the most irregular verb in French. It goes everywhere — literally.",
      },
      scene: {
        name: "Châtelet — platform 4",
        ambiance: "metro",
        props: [
          { e: "🚇", x: 50, y: 68, size: 64 }, { e: "🕛", x: 14, y: 18, size: 34 },
          { e: "🎷", x: 85, y: 50, size: 40 }, { e: "💡", x: 30, y: 12, size: 28 }, { e: "🧍", x: 72, y: 60, size: 40 },
        ],
      },
      fragments: [
        {
          id: "frag-f101", icon: "🪧", label: "The departures board", x: 25, y: 40,
          sceneText: "The display reads: « Les trains vont toutes les 5 minutes. Le dernier train va partir à 00h47. »",
          intel: "JE VAIS · TU VAS · IL VA · ILS VONT",
          rule: "ALLER, present tense: totally irregular — vais, vas, va, vont.",
          echo: "Nothing in « vais, vas, va » looks like ALLER. Total irregularity — which is why it's everywhere. Secure it.",
        },
        {
          id: "frag-f102", icon: "💬", label: "Platform conversation", x: 60, y: 50,
          sceneText: "Two métro workers chat: « Tu es allé à la réunion de sécurité ? » — « Oui, j'y suis allé à neuf heures. Une perte de temps. »",
          intel: "JE SUIS ALLÉ — passé composé with ÊTRE",
          rule: "ALLER takes ÊTRE in the past, not avoir: je suis allé(e).",
          echo: "ALLER is one of the famous ÊTRE verbs. « Je suis allé » — never « j'ai allé ». Movement verbs travel with être.",
        },
        {
          id: "frag-f103", icon: "📌", label: "Note on the booth", x: 80, y: 32,
          sceneText: "On the controller's booth, a note: « Partie chercher les clés — retour dans 5 min. » Below: « Elle est allée au dépôt. »",
          intel: "ELLE EST ALLÉE — agreement of the participle",
          rule: "With être, the participle agrees: elle est alléE (feminine adds -e).",
          echo: "That extra E on « allée » — with être, the participle agrees with the subject. Silent, but written. The French will notice.",
        },
        {
          id: "frag-f104", icon: "📓", label: "Dropped note", x: 42, y: 72,
          sceneText: "The courier drops a paper. You pick it up: « Nous irons ce soir. H. irait seul s'il le fallait. »",
          intel: "IRONS (futur) · IRAIT (conditionnel)",
          rule: "Future stem of ALLER is IR-: j'irai, nous irons, il irait.",
          echo: "IR- : a third shape for the same verb. Vais, allé, irai — the full arsenal of ALLER, Agent.",
        },
      ],
      cultural: {
        icon: "💺", label: "The folding seats", x: 12, y: 78,
        title: "Les strapontins",
        text: "The fold-down seats by métro doors are fine when the carriage is empty — but standing up to free space in a crowded train is an unwritten rule every Parisian obeys.",
        xp: 20,
      },
      intelCard: {
        kind: "verb",
        id: "intel-verb-aller",
        lemma: "ALLER",
        phonetics: "/a.le/",
        tag: "VERBE IRRÉGULIER ⚠ — TOP 3 DE LA LANGUE",
        speakText: "aller. Je vais, tu vas, il va. Je suis allé. Nous irons.",
        flashback: "Châtelet, 00:40. The board blinks: « Le dernier train va partir. » On the empty platform, the courier drops a crumpled note. You count to three, then pick it up…",
        table: [
          { label: "PRÉSENT", value: "je vais · tu vas\nil va · ils vont ⚡" },
          { label: "PASSÉ COMPOSÉ", value: "je suis allé(e)\n(être, pas avoir !)" },
          { label: "ACCORD", value: "elle est alléE\nils sont alléS" },
          { label: "FUTUR / COND.", value: "j'irai · nous irons\nil irait (base IR-)" },
        ],
        examples: ["Le dernier train va partir.", "J'y suis allé à neuf heures.", "Nous irons ce soir."],
        quiz: [
          { q: "“Je ____ au bureau.” (ALLER)", options: ["vais", "va", "allez"], a: 0 },
          { q: "Which auxiliary does ALLER take in the past?", options: ["avoir", "être", "faire"], a: 1 },
          { q: "“Nous ____ ce soir.” (ALLER, futur)", options: ["allons", "irions", "irons"], a: 2 },
        ],
      },
    },

    // ================================================================
    // FR-PAR-006 — L'EXTRACTION — Mission Boss
    // ================================================================
    {
      id: "FR-PAR-006",
      type: "extraction",
      typeName: "L'Extraction — BOSS",
      icon: "🎯",
      title: "Operation BELLE ÉPOQUE",
      subtitle: "Unmask the liaison agent",
      location: "Private reception · Musée d'Orsay",
      difficulty: 5,
      durationMin: 25,
      xpBase: 300,
      brief: {
        narrative: "Everything converges here. Aubert's notebook points to a private reception at the Musée d'Orsay, where BABEL CORP will hand its list of informants to an unknown liaison agent. Infiltrate the gala, crack the safe's passphrase, and negotiate the list out of the building.",
        context: "Three phases. No room for error. Everything you acquired in Paris will be tested.",
        intelPreview: "FINAL OPERATION: [████████████]",
        echo: "Final phase, Agent. I'll be quieter than usual — you don't need me anymore. Prove it.",
      },
      scene: {
        name: "Musée d'Orsay — the grand nave",
        ambiance: "gala",
        props: [
          { e: "🥂", x: 20, y: 45 }, { e: "🎻", x: 80, y: 35, size: 40 }, { e: "🕰️", x: 50, y: 18, size: 56 },
          { e: "🕴️", x: 65, y: 65, size: 44 }, { e: "🖼️", x: 35, y: 30, size: 36 },
        ],
      },
      phases: [
        {
          kind: "infiltration",
          title: "PHASE 1 — L'INFILTRATION",
          desc: "Enter the gala without raising suspicion.",
          interactions: [
            {
              npc: "L'hôtesse d'accueil", npcIcon: "💁",
              line: "Bonsoir. Votre nom, je vous prie ?",
              context: "She holds the guest list. Your cover: food critic for a culinary review.",
              choices: [
                { text: "Bonsoir. Harris, de la Revue Culinaire.", correct: true, reaction: "She scans her list. « Ah oui, Monsieur Harris. Bonne soirée. »" },
                { text: "Moi c'est Harris.", reaction: "Too casual for a gala. She re-reads her list carefully.", suspicion: 20 },
                { text: "Vous n'avez pas besoin de mon nom.", reaction: "Two security guards turn their heads toward you.", suspicion: 30 },
              ],
              echoHint: "Introduce yourself simply: « Bonsoir », name, affiliation. Polite, neutral.",
            },
            {
              npc: "Un convive", npcIcon: "🤵",
              line: "Magnifique, n'est-ce pas ? Vous êtes déjà venu ici ?",
              context: "He hands you a glass of champagne, affable but watchful.",
              choices: [
                { text: "Jamais — mais je suis allé à l'exposition Renoir l'an dernier.", correct: true, reaction: "« Excellent choix. » He introduces you to the group. Flawless passé composé — with être." },
                { text: "Oui, j'ai allé ici l'année dernière.", reaction: "« J'ai allé »… His smile freezes imperceptibly.", suspicion: 20 },
                { text: "Je suis ici pour regarder quelqu'un.", reaction: "He sets down his glass and drifts away.", suspicion: 30 },
              ],
              echoHint: "ALLER takes ÊTRE: « je suis allé ». You secured this at Operation DERNIER MÉTRO.",
            },
            {
              npc: "Le maître d'hôtel", npcIcon: "🫅",
              line: "Monsieur, le salon privé est réservé aux invités autorisés.",
              context: "He blocks the door behind which the safe waits. You need a reason to enter.",
              choices: [
                { text: "Madame Marchand m'attend. Elle est arrivée il y a une heure.", correct: true, reaction: "He checks discreetly, then steps aside. « Très bien, monsieur. »" },
                { text: "Ouvre cette porte tout de suite.", reaction: "« Je vous demande pardon ? » His hand drifts to his earpiece.", suspicion: 30 },
                { text: "Je suis invité autorisé.", reaction: "The missing article catches his ear. He studies you.", suspicion: 15 },
              ],
              echoHint: "Invoke Marchand — the name from the intercepted memo. Passé composé: « elle est arrivée ».",
            },
          ],
        },
        {
          kind: "percee",
          title: "PHASE 2 — LA PERCÉE",
          desc: "The safe is locked behind a passphrase. Find the two fragments of the code.",
          scene: {
            name: "Private salon — the safe",
            ambiance: "gala",
            props: [{ e: "🖼️", x: 20, y: 30, size: 50 }, { e: "🗄️", x: 75, y: 55, size: 56 }, { e: "🕯️", x: 50, y: 18, size: 30 }],
          },
          fragments: [
            {
              id: "frag-f201", icon: "🖼️", label: "Plaque under a painting", x: 25, y: 35,
              sceneText: "Under a painting of the Seine: « Le temps va où il doit aller. »",
              intel: "VA · ALLER — the code uses the paradigm of ALLER",
              rule: "Present 3rd person (va) + infinitive (aller).",
              echo: "The code is a sentence. First half secured: « va… aller ».",
            },
            {
              id: "frag-f201b", icon: "🗄️", label: "The safe's dial", x: 75, y: 55,
              sceneText: "The dial reads: « Complétez : Ils ont ____ le morceau. (MANGER, participe) » You compose: M-A-N-G-É.",
              intel: "MANGÉ — the final key",
              rule: "« Manger le morceau » — French idiom: to spill the beans.",
              echo: "« Manger le morceau » — to talk, to confess. The safe clicks open. But someone just walked in behind you.",
            },
          ],
        },
        {
          kind: "negociation",
          title: "PHASE 3 — LA NÉGOCIATION",
          desc: "The liaison agent caught you — the woman from the bridge. Negotiate your way out with the list.",
          rounds: [
            {
              npcLine: "Éloignez-vous du coffre. Pour qui travaillez-vous ?",
              targetL1: "“You work for Babel Corp, and we know it.”",
              solution: ["Vous", "travaillez", "pour Babel Corp", "et", "nous le savons"],
              bank: [
                { w: "Vous", cat: "subject" }, { w: "Nous", cat: "subject" },
                { w: "travaillez", cat: "verb" }, { w: "travaille", cat: "verb" }, { w: "travaillons", cat: "verb" },
                { w: "pour Babel Corp", cat: "comp" }, { w: "et", cat: "conn" }, { w: "mais", cat: "conn" },
                { w: "nous le savons", cat: "comp" },
              ],
              okReaction: "She pauses, just for a beat. You've turned the interrogation around.",
              echoHint: "VOUS → travaillez. Then the connector ET.",
            },
            {
              npcLine: "Et pourquoi je vous laisserais sortir d'ici avec cette liste ?",
              targetL1: "“If you give us the list, we will erase your name.”",
              solution: ["Si", "vous", "nous donnez la liste", "nous", "effacerons votre nom"],
              bank: [
                { w: "Si", cat: "conn" }, { w: "Parce que", cat: "conn" },
                { w: "vous", cat: "subject" }, { w: "nous", cat: "subject" },
                { w: "nous donnez la liste", cat: "verb" }, { w: "nous donne la liste", cat: "verb" },
                { w: "effacerons votre nom", cat: "verb" }, { w: "effaçons votre nom", cat: "verb" },
              ],
              okReaction: "A long silence. Then she lays the list on the table and melts into the crowd. Extraction complete.",
              echoHint: "The conditional from RIVE GAUCHE: SI + present, then the future — effacerons.",
            },
          ],
        },
      ],
      endings: {
        perfect: { min: 90, title: "EXTRACTION PARFAITE", text: "Not a trace. The list is in the Institute's hands and BABEL CORP doesn't even know you exist. The first lines of the TOKYO dossier appear on your terminal…" },
        good: { min: 70, title: "EXTRACTION RÉUSSIE", text: "A few complications, but the list is secured. The Institute opens the file on your next destination." },
        rough: { min: 50, title: "EXTRACTION CHAOTIQUE", text: "Objective barely met. BABEL CORP now knows an agent is operating in Paris. Watch your back." },
        bad: { min: 0, title: "EXTRACTION COMPROMISE", text: "The list is incomplete and your cover is fragile. The Institute recommends a consolidation mission before any new operation." },
      },
      intelCard: {
        kind: "grammar",
        id: "intel-grammar-fr-mastery",
        lemma: "PARIS MASTERY",
        phonetics: "operational synthesis · Paris",
        tag: "ARC PARIS — COMPLET",
        speakText: "Vous avez terminé l'opération de Paris. Bravo, Agent.",
        flashback: "The Orsay clock glows above the nave. The list on the table, the liaison agent gone. Your earpiece crackles: « Extraction confirmée, Agent. Le monde vous attend. »",
        table: [
          { label: "VERBES CRAQUÉS", value: "MANGER — j'ai mangé\nALLER — je suis allé" },
          { label: "DEUX AUXILIAIRES", value: "avoir : j'ai mangé\nêtre : je suis allé(e)" },
          { label: "POLITESSE", value: "vous + Bonjour\n= toutes les portes" },
          { label: "CONDITIONNELLE", value: "Si + présent,\npuis futur" },
        ],
        examples: ["Le temps va où il doit aller.", "Si vous nous donnez la liste, nous effacerons votre nom."],
      },
    },
  ],

  dailyFallback: [
    { q: "What is the past participle of MANGER?", options: ["mangé", "mangeé", "mangu"], correct: 0 },
    { q: "“Je ____ au bureau.” (ALLER)", options: ["vais", "va", "allez"], correct: 0 },
    { q: "Which verb takes ÊTRE in the passé composé?", options: ["manger", "aller", "travailler"], correct: 1 },
    { q: "What must open every request in France?", options: ["Bonjour", "Pardon", "Allez"], correct: 0 },
    { q: "“L'addition, s'il vous plaît” means…", options: ["The bill, please", "The menu, please", "The exit, please"], correct: 0 },
  ],
};
