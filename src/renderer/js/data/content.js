/**
 * THE CODEX — Base de contenu Phase 1 : Anglais UK · Londres.
 * Structure conforme au schéma de mission du GDD §13.3.
 */
"use strict";
window.Codex = window.Codex || {};

Codex.CONTENT = {
  language: { id: "en-UK", name: "Anglais (UK)", flag: "🇬🇧", country: "Royaume-Uni" },

  // GDD §10.2
  levels: [
    { id: 1, name: "RECRUE", xp: 0, hints: Infinity },
    { id: 2, name: "OPÉRATEUR", xp: 500, hints: 3 },
    { id: 3, name: "ÉLITE", xp: 1500, hints: 1 },
    { id: 4, name: "FANTÔME", xp: 3500, hints: 0 },
    { id: 5, name: "LÉGENDE", xp: 7000, hints: 0 },
  ],

  // GDD §3.2 — positions sur la carte stylisée (viewBox 1000×520)
  countries: [
    { id: "uk", flag: "🇬🇧", name: "Royaume-Uni", lang: "Anglais (UK)", x: 468, y: 138, active: true },
    { id: "us", flag: "🇺🇸", name: "États-Unis", lang: "Anglais (US)", x: 220, y: 195, active: false },
    { id: "fr", flag: "🇫🇷", name: "France", lang: "Français", x: 487, y: 172, active: false },
    { id: "es", flag: "🇪🇸", name: "Espagne", lang: "Espagnol", x: 462, y: 205, active: false },
    { id: "br", flag: "🇧🇷", name: "Brésil", lang: "Portugais (BR)", x: 320, y: 350, active: false },
    { id: "de", flag: "🇩🇪", name: "Allemagne", lang: "Allemand", x: 520, y: 150, active: false },
    { id: "jp", flag: "🇯🇵", name: "Japon", lang: "Japonais", x: 858, y: 200, active: false },
    { id: "cn", flag: "🇨🇳", name: "Chine", lang: "Mandarin", x: 770, y: 215, active: false },
    { id: "sa", flag: "🇸🇦", name: "Arabie Saoudite", lang: "Arabe (MSA)", x: 600, y: 250, active: false },
    { id: "kr", flag: "🇰🇷", name: "Corée du Sud", lang: "Coréen", x: 828, y: 195, active: false },
  ],

  // GDD §10.4
  medals: [
    { id: "premier_contact", icon: "🛸", name: "Premier Contact", desc: "Première mission complétée" },
    { id: "precision", icon: "🎯", name: "Précision", desc: "Mission parfaite — aucune erreur, aucune aide" },
    { id: "fantome", icon: "🥷", name: "Fantôme", desc: "Infiltration sans déclencher de Suspicion" },
    { id: "silence_radio", icon: "🔕", name: "Silence Radio", desc: "Mission complétée sans utiliser ECHO" },
    { id: "eclair", icon: "⚡", name: "Éclair", desc: "Mission complétée en moins de 50 % du temps estimé" },
    { id: "explorateur", icon: "🔭", name: "Explorateur", desc: "Tous les Cultural Intel de la zone trouvés" },
  ],

  zone: { id: "london", name: "Londres", level: "Recrue", domain: "Verbes du quotidien · Présent simple" },

  echo: {
    hq: [
      "Agent, une nouvelle mission attend votre signature à Londres.",
      "Le terrain londonien est encore chaud. Restez focalisé.",
      "Votre intel s'accumule. C'est exactement ce que l'Institut attendait de vous.",
      "BABEL CORP renforce ses positions. Chaque mot compte désormais.",
    ],
    success: [
      "Excellent instinct, Agent. La structure que vous avez choisie est idiomatique.",
      "Mission propre. L'Institut prendra note.",
      "Vous progressez plus vite que prévu. Ne ralentissez pas.",
    ],
    perfect: [
      "Zéro erreur. Je commence à me demander si vous avez vraiment besoin de moi.",
      "Travail d'orfèvre, Agent. Rare, à ce niveau.",
    ],
    warning: [
      "Attention. La cible a noté quelque chose d'inhabituel dans votre vocabulaire.",
      "Suspicion en hausse. Choisissez le prochain mot avec soin.",
    ],
    urgent: [
      "Recentrez. Choisissez le mot le plus neutre disponible. Maintenant.",
      "La situation se tend. Plus aucune approximation possible.",
    ],
  },

  missions: [
    // ================================================================
    // EN-LON-001 — LA PERCÉE — Verbe EAT (annexe du GDD)
    // ================================================================
    {
      id: "EN-LON-001",
      type: "percee",
      typeName: "La Percée",
      icon: "🔓",
      title: "Opération FLAVOUR",
      subtitle: "Craquer le code du chef",
      location: "The Crown Restaurant · Soho",
      difficulty: 2,
      durationMin: 10,
      xpBase: 150,
      brief: {
        narrative: "Un chef cuisinier travaillant pour BABEL CORP utilise le restaurant The Crown à Soho comme couverture. Pour approcher la cible sans éveiller les soupçons, vous devez vous fondre parmi les clients réguliers.",
        context: "Quatre fragments d'intel sont dissimulés dans la salle. Une erreur de langage, et la cible se méfie.",
        intelPreview: "VERBE : [████]",
        echo: "Votre objectif linguistique : le paradigme complet d'un verbe irrégulier. Ouvrez l'œil, Agent.",
      },
      scene: {
        name: "The Crown — salle principale",
        ambiance: "restaurant",
        props: [
          { e: "🍷", x: 12, y: 38 }, { e: "🕯️", x: 30, y: 30, size: 30 }, { e: "🪑", x: 22, y: 72, size: 56 },
          { e: "🪑", x: 70, y: 75, size: 56 }, { e: "🍽️", x: 48, y: 60 }, { e: "🥂", x: 86, y: 35 },
          { e: "🚪", x: 94, y: 55, size: 60 }, { e: "💡", x: 60, y: 12, size: 30 },
        ],
      },
      fragments: [
        {
          id: "frag-001", icon: "📋", label: "Menu du restaurant", x: 18, y: 50,
          sceneText: "Le serveur s'approche d'une cliente régulière. Elle commande : « I always eat the salmon here. » Son ami sourit : « He eats the same thing every single time. »",
          intel: "I EAT · You EAT · He/She EATS",
          rule: "He / She / It → ajoute un S au présent simple.",
          echo: "Notez ce S sur EATS. C'est la marque du présent simple pour he/she/it. Simple — mais fondamental.",
        },
        {
          id: "frag-002", icon: "💬", label: "Conversation captée", x: 42, y: 42,
          sceneText: "Deux clients discutent. Vous captez : « Did you eat here before? » — « I ate here last month, yes. The steak was incredible. »",
          intel: "ATE — passé simple de EAT",
          rule: "Verbe irrégulier : EAT → ATE (pas de « -ed »).",
          echo: "Irrégulier. EAT ne suit pas la règle standard. Le passé c'est ATE — retenez-le, il reviendra.",
        },
        {
          id: "frag-003", icon: "🪧", label: "Tableau du chef", x: 66, y: 35,
          sceneText: "Sur le tableau noir, une citation : « Eating is believing. » En dessous : « She has eaten every dish on this menu. »",
          intel: "EATING (gérondif) · HAS EATEN (present perfect)",
          rule: "Participe passé EATEN — utilisé avec have / has / had.",
          echo: "EATEN est le participe passé. Avec have/has → present perfect. Indispensable pour les expériences.",
        },
        {
          id: "frag-004", icon: "📓", label: "Carnet du serveur", x: 82, y: 65,
          sceneText: "Dans le carnet du serveur : « Table 4 will eat at 8pm » · « Mr. H. — says he would eat anything if it's free. »",
          intel: "WILL EAT (futur) · WOULD EAT (conditionnel)",
          rule: "Avec will / would → forme de base EAT, jamais EATS.",
          echo: "Avec will et would, on revient toujours à la base : EAT, jamais EATS. Arsenal complet.",
        },
      ],
      cultural: {
        icon: "🍴", label: "Spéciaux du jour", x: 55, y: 80,
        title: "Les « specials » britanniques",
        text: "Au Royaume-Uni, les spéciaux du jour sont écrits à la craie sur un tableau noir — les demander au serveur avant de regarder le tableau passe pour une marque d'inattention.",
        xp: 20,
      },
      intelCard: {
        kind: "verb",
        id: "intel-verb-eat",
        lemma: "EAT",
        phonetics: "/iːt/",
        tag: "VERBE IRRÉGULIER ⚠",
        speakText: "eat, ate, eaten. She eats here every week.",
        table: [
          { label: "PRÉSENT SIMPLE", value: "I/You/We eat\nHe/She eats ⚡" },
          { label: "PASSÉ SIMPLE", value: "ate\n(irrégulier !)" },
          { label: "COMPOSÉS", value: "have/has eaten\nwas eating\neating (gérondif)" },
          { label: "FUTUR / COND.", value: "will eat\ngoing to eat\nwould eat" },
        ],
        examples: ["She eats here every week.", "We ate at 8.", "Have you eaten?"],
      },
    },

    // ================================================================
    // EN-LON-002 — L'INFILTRATION — Pub The Red Lion
    // ================================================================
    {
      id: "EN-LON-002",
      type: "infiltration",
      typeName: "L'Infiltration",
      icon: "🕵️",
      title: "Opération LAST ORDERS",
      subtitle: "Se fondre parmi les habitués",
      location: "The Red Lion · Westminster",
      difficulty: 3,
      durationMin: 12,
      xpBase: 130,
      brief: {
        narrative: "Un coursier de BABEL CORP fréquente le pub The Red Lion chaque jeudi soir. Vous devez vous installer au comptoir, passer pour un habitué et gagner la confiance du personnel pour observer la remise d'un colis.",
        context: "Chaque mot compte. Un registre trop formel ou une formule maladroite, et la salle entière vous remarquera.",
        intelPreview: "VOCABULAIRE : [██████]",
        echo: "Le pub anglais a ses codes. Écoutez d'abord, parlez ensuite. Votre couverture en dépend.",
      },
      scene: {
        name: "The Red Lion — comptoir",
        ambiance: "pub",
        props: [
          { e: "🍺", x: 15, y: 40 }, { e: "🎯", x: 88, y: 30, size: 36 }, { e: "🪑", x: 75, y: 70, size: 50 },
          { e: "🕰️", x: 50, y: 15, size: 34 }, { e: "🍻", x: 35, y: 45 },
        ],
      },
      interactions: [
        {
          npc: "Le barman", npcIcon: "🧔",
          line: "Evening! What can I get you?",
          context: "Il essuie un verre en vous jaugeant du regard.",
          choices: [
            { text: "A pint of bitter, please.", correct: true, reaction: "Il hoche la tête et tire votre pinte. Vous êtes dans le décor." },
            { text: "Give me one beer now.", reaction: "Trop sec. Quelques regards se tournent vers vous.", suspicion: 15 },
            { text: "I want to drink the beers.", reaction: "Le barman hausse un sourcil. Formulation étrange.", suspicion: 15 },
          ],
          echoHint: "Au pub, la commande standard : « A pint of..., please. » Court et poli.",
        },
        {
          npc: "Un habitué", npcIcon: "👴",
          line: "You alright, mate?",
          context: "Il lève à peine les yeux de son journal.",
          choices: [
            { text: "Yeah, good thanks. You?", correct: true, reaction: "« Not bad, not bad. » Il retourne à son journal. Parfait." },
            { text: "Why? Do I look sick?", reaction: "Il fronce les sourcils, surpris. Vous avez pris la salutation au pied de la lettre.", suspicion: 20 },
            { text: "I am alright, thank you very much, sir.", reaction: "Beaucoup trop formel pour un pub. Il vous fixe un instant.", suspicion: 10 },
          ],
          echoHint: "« You alright? » est une salutation, pas une question sur votre santé. Répondez léger.",
        },
        {
          npc: "La serveuse", npcIcon: "👩",
          line: "Anything to eat with that? Kitchen closes at nine.",
          context: "Elle attend, carnet en main.",
          choices: [
            { text: "I'll have the fish and chips, please.", correct: true, reaction: "« Good choice. » Elle griffonne et disparaît en cuisine." },
            { text: "I eated already, thanks.", reaction: "« Eated » ? Son stylo s'arrête une seconde.", suspicion: 15 },
            { text: "Bring food.", reaction: "Silence gêné. Ce n'est pas comme ça qu'on parle ici.", suspicion: 20 },
          ],
          echoHint: "« I'll have... » est la formule de commande la plus naturelle. Et le passé de EAT, vous le connaissez.",
        },
        {
          npc: "Un client au comptoir", npcIcon: "🧑",
          line: "It's my round — what are you having?",
          context: "Il sort son portefeuille en vous incluant dans le groupe.",
          choices: [
            { text: "Cheers! Same again, please.", correct: true, reaction: "« Lovely. » Vous faites maintenant partie du groupe. Couverture renforcée." },
            { text: "No. I pay only for me.", reaction: "Refuser une tournée aussi sèchement ? La table se fige.", suspicion: 25 },
            { text: "What is a round?", reaction: "Tout le monde se regarde. Un Anglais saurait.", suspicion: 20 },
          ],
          echoHint: "La tournée — « round » — est sacrée. On accepte avec « Cheers! », on rend la suivante.",
        },
        {
          npc: "Le barman", npcIcon: "🧔",
          line: "Last orders, ladies and gents!",
          context: "Il fait sonner la cloche. C'est le moment d'observer la remise du colis sans vous faire remarquer.",
          choices: [
            { text: "One for the road, then. Cheers.", correct: true, reaction: "Il vous sert en souriant. Au fond, le coursier passe son colis. Vous voyez tout." },
            { text: "Why do you ring this bell?!", reaction: "Toute la salle vous regarde. Le coursier glisse le colis hors de votre vue.", suspicion: 25 },
            { text: "I order you to continue the service.", reaction: "Le barman éclate de rire. Mauvais genre de mémorable.", suspicion: 25 },
          ],
          echoHint: "« Last orders » : la cloche annonce les dernières commandes. « One for the road » est la réponse d'habitué.",
        },
      ],
      cultural: {
        title: "Le « round system »",
        text: "Au pub, chacun paie une tournée à tour de rôle. Esquiver son tour est l'un des pires faux pas sociaux britanniques.",
        xp: 20,
      },
      intelCard: {
        kind: "vocab",
        id: "intel-vocab-pub",
        lemma: "PUB SURVIVAL KIT",
        phonetics: "registre informel · Royaume-Uni",
        tag: "VOCABULAIRE ACTIF — SOCIAL",
        speakText: "A pint of bitter, please. You alright, mate? It's my round. One for the road.",
        entries: [
          { en: "A pint of..., please.", note: "La commande standard au comptoir — courte et polie." },
          { en: "You alright, mate?", note: "Salutation courante, pas une question de santé. Réponse : « Yeah, good thanks, you? »" },
          { en: "I'll have the fish and chips.", note: "« I'll have... » : formule naturelle pour commander un plat." },
          { en: "It's my round.", note: "« C'est ma tournée. » S'accepte avec « Cheers! »." },
          { en: "Last orders!", note: "Dernières commandes avant la fermeture — annoncées à la cloche." },
          { en: "One for the road.", note: "« Un dernier pour la route. » La réplique des habitués." },
        ],
        examples: ["Cheers, mate!", "Same again, please.", "What are you having?"],
      },
    },

    // ================================================================
    // EN-LON-003 — LA SURVEILLANCE — Email intercepté
    // ================================================================
    {
      id: "EN-LON-003",
      type: "surveillance",
      typeName: "La Surveillance",
      icon: "📄",
      title: "Opération PAPER TRAIL",
      subtitle: "Décoder la logistique de BABEL CORP",
      location: "Planque CODEX · Camden",
      difficulty: 2,
      durationMin: 10,
      xpBase: 120,
      brief: {
        narrative: "Notre cellule technique a intercepté un email interne de BABEL CORP Logistics. Il contient les détails d'une livraison sensible quelque part dans Londres.",
        context: "Extrayez les informations critiques avant que le canal ne soit refermé. Chaque détail manqué est un avantage pour l'adversaire.",
        intelPreview: "DOCUMENT : [████ ████]",
        echo: "Lisez comme un agent : cherchez le qui, le quand, le où. Le reste est du bruit.",
      },
      scene: { name: "Planque de Camden", ambiance: "office", props: [] },
      document: {
        title: "EMAIL INTERCEPTÉ — CANAL SÉCURISÉ 7",
        meta: "From: r.osborne@babelcorp-logistics.co.uk\nTo: warehouse-east@babelcorp-logistics.co.uk\nSubject: Delivery schedule — URGENT revision",
        paragraphs: [
          "Dear team,",
          "Please note that the shipment of archive crates has been moved forward. The lorry will now arrive on Thursday at dawn, not on Friday as previously announced.",
          "The driver will use the rear entrance of the Greenwich warehouse. He will not wait more than ten minutes, so the unloading team must be ready before his arrival.",
          "As usual, the foreman signs the delivery note. Nobody else is authorised to handle the paperwork.",
          "If anyone asks questions about the crates, the agreed answer is that they contain printing supplies for the Lisbon office.",
          "Regards,\nR. Osborne — Logistics Coordinator",
        ],
        glossary: {
          shipment: { ph: "/ˈʃɪpmənt/", hint: "📦 goods sent from one place to another" },
          lorry: { ph: "/ˈlɒri/", hint: "🚛 a large vehicle for transporting goods (UK)" },
          dawn: { ph: "/dɔːn/", hint: "🌅 the first light of day, very early morning" },
          warehouse: { ph: "/ˈweəhaʊs/", hint: "🏭 a large building where goods are stored" },
          unloading: { ph: "/ʌnˈləʊdɪŋ/", hint: "⬇️ taking goods out of a vehicle" },
          foreman: { ph: "/ˈfɔːmən/", hint: "👷 the worker in charge of a team" },
          paperwork: { ph: "/ˈpeɪpəwɜːk/", hint: "📑 official documents to fill and sign" },
          crates: { ph: "/kreɪts/", hint: "🧰 large wooden boxes for transport" },
        },
      },
      questions: [
        {
          q: "Quand la livraison arrive-t-elle désormais ?",
          options: ["Jeudi à l'aube", "Vendredi matin", "Jeudi à midi"],
          correct: 0,
          echoHint: "Le document oppose deux jours. Cherchez « moved forward » — avancé.",
        },
        {
          q: "Par où le chauffeur entrera-t-il ?",
          options: ["L'entrée principale du dépôt", "L'entrée arrière du dépôt de Greenwich", "Le quai de Camden"],
          correct: 1,
          echoHint: "« Rear entrance » — l'arrière, pas l'avant.",
        },
        {
          q: "Qui est autorisé à signer le bon de livraison ?",
          options: ["N'importe quel membre de l'équipe", "Le chauffeur", "Le contremaître (foreman) uniquement"],
          correct: 2,
          echoHint: "« The foreman signs... Nobody else is authorised. »",
        },
        {
          q: "Quelle est la couverture officielle du contenu des caisses ?",
          options: ["Des fournitures d'impression pour Lisbonne", "Des archives comptables", "Du matériel informatique pour Madrid"],
          correct: 0,
          echoHint: "La réponse convenue — « the agreed answer » — est à la fin du document.",
        },
      ],
      cultural: {
        title: "« Lorry », pas « truck »",
        text: "Au Royaume-Uni, le camion se dit « lorry ». « Truck » est compris, mais signe immédiatement un locuteur américain — détail fatal pour une couverture.",
        xp: 20,
      },
      intelCard: {
        kind: "vocab",
        id: "intel-vocab-logistics",
        lemma: "LOGISTICS FILE",
        phonetics: "registre professionnel · écrit",
        tag: "COMPRÉHENSION ÉCRITE — EMAIL FORMEL",
        speakText: "The shipment arrives at dawn. The foreman signs the delivery note.",
        entries: [
          { en: "shipment /ˈʃɪpmənt/", note: "Une expédition de marchandises." },
          { en: "lorry /ˈlɒri/", note: "Camion (UK). Les Américains disent « truck »." },
          { en: "at dawn /dɔːn/", note: "À l'aube — première lumière du jour." },
          { en: "warehouse /ˈweəhaʊs/", note: "Entrepôt de stockage." },
          { en: "foreman /ˈfɔːmən/", note: "Contremaître — chef d'équipe sur le terrain." },
          { en: "paperwork /ˈpeɪpəwɜːk/", note: "Les documents officiels, la paperasse." },
        ],
        examples: ["The lorry arrives on Thursday.", "He signs the paperwork.", "The crates contain supplies."],
      },
    },

    // ================================================================
    // EN-LON-004 — LA NÉGOCIATION — L'informateur de Borough Market
    // ================================================================
    {
      id: "EN-LON-004",
      type: "negociation",
      typeName: "La Négociation",
      icon: "🤝",
      title: "Opération HANDSHAKE",
      subtitle: "Retourner l'informateur Whitmore",
      location: "Borough Market · Southwark",
      difficulty: 3,
      durationMin: 14,
      xpBase: 140,
      brief: {
        narrative: "Edward Whitmore, comptable de BABEL CORP, est prêt à parler — si vous gagnez sa confiance. Il vous attend près des étals de Borough Market, nerveux, prêt à disparaître au moindre faux pas.",
        context: "Chaque phrase doit être grammaticalement irréprochable. Un agent qui maîtrise mal sa langue n'inspire aucune confiance.",
        intelPreview: "GRAMMAIRE : [██████████]",
        echo: "Construisez vos phrases avec précision. La grammaire, ici, c'est votre crédibilité.",
      },
      scene: {
        name: "Borough Market — allée couverte",
        ambiance: "market",
        props: [
          { e: "🍎", x: 12, y: 55 }, { e: "🧀", x: 30, y: 60 }, { e: "🥖", x: 80, y: 58 },
          { e: "🏮", x: 50, y: 15, size: 30 }, { e: "📦", x: 90, y: 75, size: 46 },
        ],
      },
      rounds: [
        {
          npcLine: "Prove you're from the Institute. Why should I talk to you?",
          targetL1: "« Nous avons les documents. »",
          solution: ["We", "have", "the documents"],
          bank: [
            { w: "We", cat: "subject" }, { w: "She", cat: "subject" },
            { w: "have", cat: "verb" }, { w: "has", cat: "verb" }, { w: "eat", cat: "verb" },
            { w: "the documents", cat: "comp" }, { w: "yesterday", cat: "mod" },
          ],
          okReaction: "Whitmore jette un œil autour de lui, puis hoche la tête. « Go on. »",
          echoHint: "Sujet WE → HAVE, jamais HAS. HAS est réservé à he/she/it.",
        },
        {
          npcLine: "Were you followed? Where were you yesterday evening?",
          targetL1: "« J'ai mangé au restaurant hier. »",
          solution: ["I", "ate", "at the restaurant", "yesterday"],
          bank: [
            { w: "I", cat: "subject" }, { w: "He", cat: "subject" },
            { w: "ate", cat: "verb" }, { w: "eated", cat: "verb" }, { w: "eats", cat: "verb" },
            { w: "at the restaurant", cat: "comp" }, { w: "yesterday", cat: "mod" }, { w: "tomorrow", cat: "mod" },
          ],
          okReaction: "Un alibi simple, crédible, bien formulé. Il se détend légèrement.",
          echoHint: "Le passé de EAT… vous l'avez sécurisé à l'Opération FLAVOUR. Pas de « -ed ».",
        },
        {
          npcLine: "There's a woman watching us from the coffee stall. Do you know her?",
          targetL1: "« Elle travaille pour Babel Corp. »",
          solution: ["She", "works", "for Babel Corp"],
          bank: [
            { w: "She", cat: "subject" }, { w: "They", cat: "subject" },
            { w: "works", cat: "verb" }, { w: "work", cat: "verb" }, { w: "working", cat: "verb" },
            { w: "for Babel Corp", cat: "comp" }, { w: "never", cat: "mod" },
          ],
          okReaction: "« Then we don't have much time. » Il sort une clé USB de sa poche.",
          echoHint: "SHE → le verbe prend un S au présent simple. Toujours.",
        },
        {
          npcLine: "If I give you this... what happens to me?",
          targetL1: "« Si vous nous aidez, nous vous protégerons. »",
          solution: ["If", "you", "help us", "we", "will protect you"],
          bank: [
            { w: "If", cat: "conn" }, { w: "Because", cat: "conn" },
            { w: "you", cat: "subject" }, { w: "we", cat: "subject" },
            { w: "help us", cat: "verb" }, { w: "helps us", cat: "verb" },
            { w: "will protect you", cat: "verb" }, { w: "would protected you", cat: "verb" },
          ],
          okReaction: "Whitmore glisse la clé USB dans votre main. « Don't make me regret this. »",
          echoHint: "Première conditionnelle : IF + présent, puis WILL + base verbale.",
        },
      ],
      cultural: {
        title: "Borough Market",
        text: "Plus vieux marché alimentaire de Londres (XIIIᵉ siècle). On y goûte avant d'acheter — refuser un échantillon tendu par un commerçant est presque impoli.",
        xp: 20,
      },
      intelCard: {
        kind: "grammar",
        id: "intel-grammar-structure",
        lemma: "SENTENCE ENGINE",
        phonetics: "Sujet → Verbe → Complément",
        tag: "GRAMMAIRE OPÉRATIONNELLE",
        speakText: "If you help us, we will protect you.",
        table: [
          { label: "ORDRE DE BASE", value: "Sujet + Verbe + Complément\nShe works for Babel Corp." },
          { label: "ACCORD 3ᵉ PERS.", value: "He/She/It → verbe + S\nShe works · He eats" },
          { label: "PASSÉ IRRÉGULIER", value: "eat → ate\n(jamais « eated »)" },
          { label: "CONDITIONNEL RÉEL", value: "If + présent,\nwill + base verbale" },
        ],
        examples: ["We have the documents.", "She works for Babel Corp.", "If you help us, we will protect you."],
      },
    },

    // ================================================================
    // EN-LON-005 — LA PERCÉE — Verbe GO (nuit, métro)
    // ================================================================
    {
      id: "EN-LON-005",
      type: "percee",
      typeName: "La Percée",
      icon: "🔓",
      title: "Opération NIGHTLINE",
      subtitle: "Suivre le coursier dans la nuit",
      location: "Embankment Station · minuit",
      difficulty: 3,
      durationMin: 10,
      xpBase: 150,
      brief: {
        narrative: "Le coursier de BABEL CORP a quitté le pub avec le colis. Il se dirige vers la station Embankment. Vous le suivez dans le métro de nuit, où chaque panneau, chaque annonce, chaque note griffonnée peut contenir l'intel dont vous avez besoin.",
        context: "Le dernier train part à 00h30. Quatre fragments avant qu'il ne disparaisse.",
        intelPreview: "VERBE : [██]",
        echo: "Le verbe le plus utilisé de la langue anglaise est votre cible ce soir. Il est partout — encore faut-il le voir.",
      },
      scene: {
        name: "Embankment — quai nord",
        ambiance: "street",
        props: [
          { e: "🚇", x: 50, y: 68, size: 64 }, { e: "🕛", x: 14, y: 18, size: 34 },
          { e: "🧱", x: 85, y: 45, size: 44 }, { e: "💡", x: 30, y: 12, size: 28 }, { e: "🧍", x: 72, y: 60, size: 40 },
        ],
      },
      fragments: [
        {
          id: "frag-101", icon: "🪧", label: "Panneau d'affichage", x: 25, y: 40,
          sceneText: "Le panneau lumineux indique : « Trains go every 10 minutes. The last train goes at 00:30. »",
          intel: "GO · GOES (he/she/it)",
          rule: "Présent simple : GO, mais GOES à la 3ᵉ personne — notez le -ES.",
          echo: "GO prend -ES, pas seulement -S : goes. Une irrégularité d'orthographe à sécuriser.",
        },
        {
          id: "frag-102", icon: "💬", label: "Conversation sur le quai", x: 60, y: 50,
          sceneText: "Deux employés du métro discutent : « Did you go to the safety meeting? » — « I went there at nine. Waste of time. »",
          intel: "WENT — passé simple de GO",
          rule: "Verbe irrégulier total : GO → WENT (aucun rapport de forme).",
          echo: "GO devient WENT au passé. Aucune logique apparente — c'est un héritage d'un autre verbe ancien. Mémorisez.",
        },
        {
          id: "frag-103", icon: "📌", label: "Mot sur la guérite", x: 80, y: 32,
          sceneText: "Sur la guérite du contrôleur, un mot : « Gone to platform 4 — back in 5 min. » Et en dessous : « Sarah has gone home. »",
          intel: "GONE — participe passé",
          rule: "GONE avec have/has : « has gone » = est parti(e).",
          echo: "GONE est le participe. « He has gone » — il est parti. Vous croiserez cette forme constamment.",
        },
        {
          id: "frag-104", icon: "📓", label: "Note interceptée", x: 42, y: 72,
          sceneText: "Le coursier jette un papier. Vous le ramassez : « We will go tonight. H. would go alone if necessary. »",
          intel: "WILL GO (futur) · WOULD GO (conditionnel)",
          rule: "Après will / would : base verbale GO, jamais goes/went.",
          echo: "Après will et would, la base : GO. Le paradigme est complet, Agent.",
        },
      ],
      cultural: {
        icon: "⚠️", label: "Annonce au sol", x: 12, y: 78,
        title: "« Mind the gap »",
        text: "L'annonce « Mind the gap » (attention à l'espace entre le quai et la rame) est culte dans le métro londonien — au point d'être vendue sur des t-shirts. Un Londonien ne la remarque même plus.",
        xp: 20,
      },
      intelCard: {
        kind: "verb",
        id: "intel-verb-go",
        lemma: "GO",
        phonetics: "/ɡəʊ/",
        tag: "VERBE IRRÉGULIER ⚠ — TOP 3 DE LA LANGUE",
        speakText: "go, went, gone. The last train goes at half past midnight.",
        table: [
          { label: "PRÉSENT SIMPLE", value: "I/You/We go\nHe/She goes ⚡" },
          { label: "PASSÉ SIMPLE", value: "went\n(irrégulier total !)" },
          { label: "COMPOSÉS", value: "have/has gone\nwas going\ngoing (gérondif)" },
          { label: "FUTUR / COND.", value: "will go\ngoing to go\nwould go" },
        ],
        examples: ["The last train goes at 00:30.", "I went there at nine.", "She has gone home."],
      },
    },

    // ================================================================
    // EN-LON-006 — L'EXTRACTION — Mission Boss
    // ================================================================
    {
      id: "EN-LON-006",
      type: "extraction",
      typeName: "L'Extraction — BOSS",
      icon: "🎯",
      title: "Opération CROWN JEWEL",
      subtitle: "Démasquer l'agent de liaison",
      location: "Réception diplomatique · The Shard",
      difficulty: 5,
      durationMin: 25,
      xpBase: 300,
      brief: {
        narrative: "Tout converge ici. La clé USB de Whitmore désigne une réception au sommet du Shard où BABEL CORP doit remettre la liste de ses informateurs à un agent de liaison inconnu. Infiltrez le gala, craquez le code du coffre, et négociez l'extraction de la liste.",
        context: "Trois phases. Aucun droit à l'erreur. Tout ce que vous avez acquis à Londres sera mis à l'épreuve.",
        intelPreview: "OPÉRATION FINALE : [████████████]",
        echo: "Phase finale, Agent. Je serai plus silencieuse que d'habitude — vous n'avez plus besoin de moi. Prouvez-le.",
      },
      scene: {
        name: "The Shard — 32ᵉ étage",
        ambiance: "gala",
        props: [
          { e: "🥂", x: 20, y: 45 }, { e: "🎻", x: 80, y: 35, size: 40 }, { e: "🏙️", x: 50, y: 20, size: 60 },
          { e: "🕴️", x: 65, y: 65, size: 44 }, { e: "💎", x: 35, y: 30, size: 26 },
        ],
      },
      phases: [
        {
          kind: "infiltration",
          title: "PHASE 1 — L'INFILTRATION",
          desc: "Entrez dans le gala sans éveiller les soupçons.",
          interactions: [
            {
              npc: "L'hôtesse d'accueil", npcIcon: "💁",
              line: "Good evening. May I have your name, please?",
              context: "Elle tient la liste des invités. Votre couverture : journaliste gastronomique.",
              choices: [
                { text: "Good evening. Harris, from The Culinary Review.", correct: true, reaction: "Elle parcourt sa liste. « Ah yes, Mr. Harris. Enjoy your evening. »" },
                { text: "Me name is Harris.", reaction: "« Me name » ? Elle relit sa liste avec attention.", suspicion: 20 },
                { text: "You don't need my name.", reaction: "Deux agents de sécurité tournent la tête vers vous.", suspicion: 30 },
              ],
              echoHint: "Présentez-vous simplement : nom, puis affiliation. Registre poli, neutre.",
            },
            {
              npc: "Un convive", npcIcon: "🤵",
              line: "Wonderful view, isn't it? Have you been here before?",
              context: "Il vous tend une coupe de champagne, l'air affable mais observateur.",
              choices: [
                { text: "Never — but I have eaten at the restaurant downstairs.", correct: true, reaction: "« Excellent choice. » Il vous présente au groupe. Présent perfect impeccable." },
                { text: "Yes, I goed here last year.", reaction: "« Goed »… Son sourire se fige imperceptiblement.", suspicion: 20 },
                { text: "I am here for watch someone.", reaction: "Il repose sa coupe et s'éloigne lentement.", suspicion: 30 },
              ],
              echoHint: "« Have you been...? » appelle le present perfect : have + participe. EATEN, vous connaissez.",
            },
            {
              npc: "Le maître d'hôtel", npcIcon: "🫅",
              line: "Sir, the private viewing room is for authorised guests only.",
              context: "Il bloque la porte derrière laquelle se trouve le coffre. Il vous faut une raison d'entrer.",
              choices: [
                { text: "Mr. Osborne is expecting me. He arrived an hour ago.", correct: true, reaction: "Il vérifie discrètement, puis s'écarte. « Very well, sir. »" },
                { text: "Open this door now.", reaction: "« I beg your pardon? » Sa main glisse vers son oreillette.", suspicion: 30 },
                { text: "I am authorised guest.", reaction: "L'article manquant l'a fait tiquer. Il vous observe.", suspicion: 15 },
              ],
              echoHint: "Invoquez Osborne — le nom de l'email intercepté. Passé simple : « he arrived ».",
            },
          ],
        },
        {
          kind: "percee",
          title: "PHASE 2 — LA PERCÉE",
          desc: "Le coffre est verrouillé par une phrase de passe. Trouvez les deux fragments du code.",
          scene: {
            name: "Salon privé — le coffre",
            ambiance: "gala",
            props: [{ e: "🖼️", x: 20, y: 30, size: 50 }, { e: "🗄️", x: 75, y: 55, size: 56 }, { e: "🕯️", x: 50, y: 18, size: 30 }],
          },
          fragments: [
            {
              id: "frag-201", icon: "🖼️", label: "Gravure au mur", x: 25, y: 35,
              sceneText: "Sous une gravure de la Tamise : « The river has gone where it always goes. »",
              intel: "HAS GONE · GOES — le code utilise le paradigme de GO",
              rule: "Present perfect (has gone) + présent 3ᵉ personne (goes).",
              echo: "Le code est une phrase. Première moitié sécurisée : « has gone... goes ».",
            },
            {
              id: "frag-202", icon: "🗄️", label: "Cadran du coffre", x: 75, y: 55,
              sceneText: "Le cadran affiche : « Complete: They ____ the truth long ago. (EAT, passé) » Vous composez : A-T-E.",
              intel: "ATE — la clé finale du coffre",
              rule: "Passé simple irrégulier de EAT — acquis à l'Opération FLAVOUR.",
              echo: "ATE. Le coffre s'ouvre. La liste est là — mais quelqu'un entre derrière vous.",
            },
          ],
        },
        {
          kind: "negociation",
          title: "PHASE 3 — LA NÉGOCIATION",
          desc: "L'agent de liaison vous a surpris. C'est elle — la femme du marché. Négociez votre sortie avec la liste.",
          rounds: [
            {
              npcLine: "Step away from the safe. Who do you work for?",
              targetL1: "« Vous travaillez pour Babel Corp, et nous le savons. »",
              solution: ["You", "work", "for Babel Corp", "and", "we know it"],
              bank: [
                { w: "You", cat: "subject" }, { w: "We", cat: "subject" },
                { w: "work", cat: "verb" }, { w: "works", cat: "verb" },
                { w: "for Babel Corp", cat: "comp" }, { w: "and", cat: "conn" }, { w: "but", cat: "conn" },
                { w: "we know it", cat: "comp" },
              ],
              okReaction: "Elle marque un temps d'arrêt. Vous avez renversé l'interrogatoire.",
              echoHint: "YOU → base verbale, sans S. Puis le connecteur AND.",
            },
            {
              npcLine: "And why would I let you walk out of here with that list?",
              targetL1: "« Si vous nous donnez la liste, nous effacerons votre nom. »",
              solution: ["If", "you", "give us the list", "we", "will erase your name"],
              bank: [
                { w: "If", cat: "conn" }, { w: "When", cat: "conn" },
                { w: "you", cat: "subject" }, { w: "we", cat: "subject" },
                { w: "give us the list", cat: "verb" }, { w: "gives us the list", cat: "verb" },
                { w: "will erase your name", cat: "verb" }, { w: "erased your name", cat: "verb" },
              ],
              okReaction: "Un long silence. Puis elle pose la liste sur la table et disparaît dans la foule. Extraction réussie.",
              echoHint: "La conditionnelle de l'Opération HANDSHAKE : IF + présent, WILL + base.",
            },
          ],
        },
      ],
      endings: {
        perfect: { min: 90, title: "EXTRACTION PARFAITE", text: "Aucune trace. La liste est entre les mains de l'Institut et BABEL CORP ignore même votre existence. Les premières lignes du dossier PARIS apparaissent sur votre terminal…", },
        good: { min: 70, title: "EXTRACTION RÉUSSIE", text: "Quelques complications, mais la liste est sécurisée. L'Institut ouvre le dossier de votre prochaine destination.", },
        rough: { min: 50, title: "EXTRACTION CHAOTIQUE", text: "Objectif atteint de justesse. BABEL CORP sait désormais qu'un agent opère à Londres. Restez sur vos gardes.", },
        bad: { min: 0, title: "EXTRACTION COMPROMISE", text: "La liste est incomplète et votre couverture fragilisée. L'Institut recommande une mission de consolidation avant toute nouvelle opération.", },
      },
      intelCard: {
        kind: "grammar",
        id: "intel-grammar-mastery",
        lemma: "LONDON MASTERY",
        phonetics: "synthèse opérationnelle · Londres",
        tag: "ARC LONDRES — COMPLET",
        speakText: "You have completed the London operation. Well done, Agent.",
        table: [
          { label: "VERBES CRAQUÉS", value: "EAT — ate — eaten\nGO — went — gone" },
          { label: "PRÉSENT 3ᵉ PERS.", value: "She works · He eats\nThe train goes" },
          { label: "PRESENT PERFECT", value: "have/has + participe\n« Have you eaten? »" },
          { label: "CONDITIONNELLE", value: "If + présent,\nwill + base verbale" },
        ],
        examples: ["The river has gone where it always goes.", "If you give us the list, we will erase your name."],
      },
    },
  ],

  // Banque de secours pour le Daily Signal (si coffre presque vide)
  dailyFallback: [
    { q: "Quel est le passé simple de EAT ?", options: ["ate", "eated", "eaten"], correct: 0 },
    { q: "« He ____ the same thing every time. »", options: ["eat", "eats", "eating"], correct: 1 },
    { q: "Que répondre à « You alright, mate? » ?", options: ["Why? Do I look sick?", "Yeah, good thanks, you?", "I am alright, sir."], correct: 1 },
    { q: "Comment dit-on « camion » au Royaume-Uni ?", options: ["truck", "lorry", "wagon"], correct: 1 },
    { q: "Quel est le participe passé de GO ?", options: ["went", "goed", "gone"], correct: 2 },
  ],
};
