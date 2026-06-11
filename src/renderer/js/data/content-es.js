/**
 * THE CODEX — Arc ESPAGNOL · Madrid (fabrique bilingue).
 * La narration est générée dans la L1 de l'agent (fr ou en) via T(fr, en).
 */
"use strict";
window.Codex = window.Codex || {};

Codex.ARC_FACTORIES["es-ES"] = function buildSpanishArc(l1) {
  const T = (fr, en) => (l1 === "fr" ? fr : en);

  return {
    id: "es-ES",
    l1,
    language: { id: "es-ES", name: T("Espagnol", "Spanish"), flag: "🇪🇸", country: T("Espagne", "Spain"), tts: "es-ES" },
    theme: "es-ES",
    zone: { id: "madrid", name: "Madrid", domain: T("Verbes du quotidien · El presente & el pretérito", "Everyday verbs · El presente & el pretérito") },

    echo: {
      hq: [
        T("Agent, un nouveau dossier vous attend à Madrid.", "Agent, a new dossier awaits you in Madrid."),
        T("Le réseau madrilène de BABEL CORP s'agite. Restez vif.", "BABEL CORP's Madrid network is stirring. Stay sharp."),
        T("Votre intel s'accumule — l'Institut prend note.", "Your intel is stacking up — the Institute takes note."),
      ],
      success: [
        T("Excellent instinct, Agent. Structure parfaitement idiomatique.", "Excellent instinct, Agent. Perfectly idiomatic structure."),
        T("Mission propre. Madrid vous réussit.", "Clean mission. Madrid suits you."),
      ],
      perfect: [
        T("Zéro erreur. Impressionnant, même pour vous.", "Zero errors. Impressive, even for you."),
      ],
      warning: [
        T("Attention. La cible a tiqué sur votre formulation.", "Careful. The target flinched at your phrasing."),
      ],
      urgent: [
        T("Recentrez. Le mot le plus neutre possible. Maintenant.", "Refocus. The most neutral word available. Now."),
      ],
    },

    missions: [
      // ============================================================
      // ES-MAD-001 — LA PERCÉE — verbe COMER
      // ============================================================
      {
        id: "ES-MAD-001",
        type: "percee",
        typeName: T("La Percée", "The Breach"),
        icon: "🔓",
        title: "Operación TAPAS",
        subtitle: T("Craquer le code du marché", "Crack the market's code"),
        location: "Mercado de San Miguel · Madrid",
        difficulty: 2,
        durationMin: 10,
        xpBase: 150,
        brief: {
          narrative: T(
            "Un traiteur du Mercado de San Miguel sert de boîte aux lettres à BABEL CORP. Fondez-vous parmi les clients du marché couvert le plus célèbre de Madrid.",
            "A caterer at the Mercado de San Miguel doubles as a dead-drop for BABEL CORP. Blend in with the crowd of Madrid's most famous covered market."
          ),
          context: T(
            "Quatre fragments d'intel sont dissimulés entre les étals. Une erreur de langue, et la boîte aux lettres se déplace.",
            "Four intel fragments are hidden among the stalls. One language slip, and the dead-drop moves."
          ),
          intelPreview: T("VERBE : [█████]", "VERB: [█████]"),
          echo: T(
            "Votre objectif : le paradigme complet d'un verbe en -ER espagnol. Ouvrez l'œil, Agent.",
            "Your objective: the full paradigm of a Spanish -ER verb. Eyes open, Agent."
          ),
        },
        scene: {
          name: "Mercado de San Miguel",
          ambiance: "market",
          props: [
            { e: "🫒", x: 14, y: 52 }, { e: "🥘", x: 33, y: 60 }, { e: "🍷", x: 84, y: 42 },
            { e: "🏮", x: 50, y: 14, size: 28 }, { e: "🦐", x: 68, y: 58 },
          ],
        },
        fragments: [
          {
            id: "frag-es01", icon: "📋", label: T("L'ardoise du comptoir", "The counter chalkboard"), x: 18, y: 46,
            sceneText: T(
              "Une habituée commande : « Yo como aquí todos los días. » Le serveur sourit : « Y él come siempre lo mismo. »",
              "A regular orders: « Yo como aquí todos los días. » The waiter smiles: « Y él come siempre lo mismo. »"
            ),
            intel: "YO COMO · TÚ COMES · ÉL/ELLA COME",
            rule: T("Verbes en -ER au présent : -o, -es, -e.", "-ER verbs, present tense: -o, -es, -e."),
            echo: T("Le -O final, c'est JE. Pas besoin de pronom : « como » suffit — l'espagnol le porte dans la terminaison.",
                    "That final -O means I. No pronoun needed: « como » is enough — Spanish carries it in the ending."),
          },
          {
            id: "frag-es02", icon: "💬", label: T("Conversation captée", "Overheard conversation"), x: 44, y: 38,
            sceneText: T(
              "Deux clients : « ¿Comiste aquí ayer? » — « Sí, comí con el jefe. La tortilla, increíble. »",
              "Two customers: « ¿Comiste aquí ayer? » — « Sí, comí con el jefe. La tortilla, increíble. »"
            ),
            intel: "COMÍ · COMISTE · COMIÓ — pretérito",
            rule: T("Passé simple (pretérito) : -í, -iste, -ió. L'accent change le sens !", "Simple past (pretérito): -í, -iste, -ió. The accent changes the meaning!"),
            echo: T("« Comí » — l'accent final porte le passé. « Como » sans accent = présent. Un trait de plume sépare hier d'aujourd'hui.",
                    "« Comí » — the final accent carries the past. « Como » without it = present. One pen stroke separates yesterday from today."),
          },
          {
            id: "frag-es03", icon: "🪧", label: T("Le panneau du chef", "The chef's sign"), x: 67, y: 32,
            sceneText: T(
              "Sur le panneau : « Comer bien es vivir bien. » Et dessous : « ¿Has comido ya nuestra paella? »",
              "On the sign: « Comer bien es vivir bien. » Below: « ¿Has comido ya nuestra paella? »"
            ),
            intel: "HE COMIDO · HAS COMIDO — pretérito perfecto",
            rule: T("HABER (he/has/ha) + participe COMIDO : le passé lié au présent.", "HABER (he/has/ha) + participle COMIDO: the past linked to the present."),
            echo: T("« ¿Has comido? » — exactement le « Have you eaten? » anglais. Les langues se répondent, Agent.",
                    "« ¿Has comido? » — exactly the English « Have you eaten? ». Languages echo each other, Agent."),
          },
          {
            id: "frag-es04", icon: "📓", label: T("Le carnet du serveur", "The waiter's notepad"), x: 82, y: 60,
            sceneText: T(
              "Dans le carnet : « La mesa 4 comerá a las 22h » · « El Sr. H. dice que comería cualquier cosa si es gratis. »",
              "In the notepad: « La mesa 4 comerá a las 22h » · « El Sr. H. dice que comería cualquier cosa si es gratis. »"
            ),
            intel: "COMERÁ (futuro) · COMERÍA (condicional)",
            rule: T("Futur et conditionnel : l'infinitif entier + terminaisons (-á / -ía).", "Future and conditional: the full infinitive + endings (-á / -ía)."),
            echo: T("L'infinitif est votre socle : comer-á, comer-ía. Paradigme complet, Agent.",
                    "The infinitive is your base: comer-á, comer-ía. Full paradigm, Agent."),
          },
        ],
        cultural: {
          icon: "🍢", label: T("L'assiette offerte", "The free plate"), x: 55, y: 78,
          title: T("La tapa offerte", "The free tapa"),
          text: T(
            "Dans une bonne partie de l'Espagne (Grenade, León…), une tapa est offerte avec la boisson. À Madrid, c'est souvent une petite assiette d'olives — la réclamer bruyamment trahit le touriste.",
            "In much of Spain (Granada, León…), a free tapa comes with your drink. In Madrid it's often a small plate of olives — loudly demanding one marks the tourist."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "verb",
          id: "intel-verb-comer",
          lemma: "COMER",
          phonetics: "/koˈmeɾ/",
          tag: T("VERBE EN -ER — RÉGULIER MODÈLE", "-ER VERB — MODEL REGULAR"),
          speakText: "comer. Yo como, tú comes, él come. Comí. He comido. Comeré.",
          flashback: T(
            "San Miguel, midi. Une habituée lance au serveur : « ¡Yo como aquí todos los días! » Derrière l'étal, le traiteur glisse une enveloppe sous une assiette de jambon…",
            "San Miguel, noon. A regular calls to the waiter: « ¡Yo como aquí todos los días! » Behind the stall, the caterer slips an envelope under a plate of ham…"
          ),
          table: [
            { label: "PRESENTE", value: "como · comes · come\ncomemos · coméis · comen" },
            { label: "PRETÉRITO", value: "comí · comiste · comió\n(l'accent = passé ⚡)" },
            { label: "PERFECTO", value: "he comido\n¿Has comido ya?" },
            { label: T("FUTUR / COND.", "FUTURE / COND."), value: "comeré · comerá\ncomería" },
          ],
          examples: ["Yo como aquí todos los días.", "Comí con el jefe ayer.", "¿Has comido ya?"],
          quiz: [
            { q: T("Quel est le pretérito de COMER (je) ?", "What is the pretérito of COMER (I)?"), options: ["comí", "como", "comido"], a: 0 },
            { q: "« ¿____ comido ya? »", options: ["Ha", "Has", "He"], a: 1 },
            { q: T("« Él ____ siempre lo mismo. »", "« Él ____ siempre lo mismo. »"), options: ["como", "comes", "come"], a: 2 },
          ],
        },
      },

      // ============================================================
      // ES-MAD-002 — L'INFILTRATION — bar à tapas
      // ============================================================
      {
        id: "ES-MAD-002",
        type: "infiltration",
        typeName: T("L'Infiltration", "The Infiltration"),
        icon: "🕵️",
        title: "Operación TERTULIA",
        subtitle: T("Passer pour un habitué du bar", "Pass for a bar regular"),
        location: "Bar El Doble · La Latina",
        difficulty: 3,
        durationMin: 12,
        xpBase: 130,
        brief: {
          narrative: T(
            "Un comptable de BABEL CORP prend l'apéritif au bar El Doble chaque soir. Tenez le comptoir, passez pour un habitué du quartier, et observez à qui il remet sa serviette.",
            "A BABEL CORP accountant takes his evening aperitif at Bar El Doble. Hold the counter, pass for a neighbourhood regular, and watch who he hands his briefcase to."
          ),
          context: T(
            "Le bar espagnol a ses codes : on salue en entrant, on commande court, on tutoie vite — mais pas n'importe qui.",
            "The Spanish bar has its codes: greet when entering, order short, switch to tú quickly — but not with just anyone."
          ),
          intelPreview: T("VOCABULAIRE : [██████]", "VOCABULARY: [██████]"),
          echo: T("Au bar, deux mots suffisent. Trois, c'est déjà suspect.", "At the bar, two words are enough. Three is already suspicious."),
        },
        scene: {
          name: "Bar El Doble — la barra",
          ambiance: "pub",
          props: [
            { e: "🍺", x: 16, y: 42 }, { e: "🫒", x: 36, y: 48 }, { e: "⚽", x: 86, y: 28, size: 34 },
            { e: "🕰️", x: 52, y: 14, size: 32 }, { e: "🥖", x: 70, y: 52 },
          ],
        },
        interactions: [
          {
            npc: "El camarero", npcIcon: "🧔",
            line: "¡Buenas! ¿Qué te pongo?",
            context: T("Il essuie le comptoir sans vous regarder.", "He wipes the counter without looking at you."),
            choices: [
              { text: "Buenas. Una caña, por favor.", correct: true, reaction: T("Il tire la pression d'un geste sûr. Vous faites partie du décor.", "He pulls the draft with a steady hand. You're part of the furniture.") },
              { text: "Quiero una cerveza ahora mismo.", reaction: T("Trop sec. Deux habitués tournent la tête.", "Too blunt. Two regulars turn their heads."), suspicion: 15 },
              { text: "Hello, one beer please.", reaction: T("L'anglais au comptoir d'El Doble… le barman vous re-dévisage.", "English at El Doble's counter… the barman looks you over again."), suspicion: 20 },
            ],
            echoHint: T("« Una caña » : LA commande madrilène — petite pression. Avec « Buenas » d'abord, toujours.", "« Una caña »: THE Madrid order — a small draft. With « Buenas » first, always."),
          },
          {
            npc: "Una vecina", npcIcon: "👵",
            line: "¿Tú no eres del barrio, verdad?",
            context: T("Elle vous jauge par-dessus son verre de vermut.", "She sizes you up over her glass of vermut."),
            choices: [
              { text: "Acabo de llegar. Me encanta La Latina.", correct: true, reaction: T("« ¡Bienvenido! » Elle retourne à son vermut. Couverture solide.", "« ¡Bienvenido! » She returns to her vermut. Cover holding."), },
              { text: "¿Y a usted qué le importa?", reaction: T("Agressif. Le comptoir entier vous a entendu.", "Aggressive. The whole counter heard you."), suspicion: 25 },
              { text: "No. Yo soy turista profesional.", reaction: T("« Turista profesional » ? Elle hausse un sourcil.", "« Turista profesional »? She raises an eyebrow."), suspicion: 15 },
            ],
            echoHint: T("Une réponse simple et chaleureuse : vous venez d'arriver, le quartier vous plaît.", "A simple, warm answer: you just arrived, you love the neighbourhood."),
          },
          {
            npc: "El camarero", npcIcon: "🧔",
            line: "¿Algo de comer? La tortilla está recién hecha.",
            context: T("Il pose une assiette d'olives offerte.", "He sets down a free plate of olives."),
            choices: [
              { text: "Venga, un pincho de tortilla.", correct: true, reaction: T("« ¡Marchando! » Le mot « venga » vous a fondu dans le décor.", "« ¡Marchando! » That « venga » melted you into the scenery.") },
              { text: "No. Solo bebida.", reaction: T("Refus sec de la tortilla fraîche. Les habitués remarquent.", "A dry refusal of fresh tortilla. The regulars notice."), suspicion: 10 },
              { text: "¿La tortilla tiene patatas?", reaction: T("…demander si la tortilla a des pommes de terre ? Silence consterné.", "…asking if the tortilla has potatoes? Appalled silence."), suspicion: 20 },
            ],
            echoHint: T("« Venga » — la particule magique espagnole : allez, d'accord, c'est parti. Acceptez le pincho.", "« Venga » — Spain's magic particle: come on, alright, let's go. Accept the pincho."),
          },
          {
            npc: "Un parroquiano", npcIcon: "🧑",
            line: "¿Has visto el partido? ¡Qué desastre!",
            context: T("Il cherche un allié de comptoir. Le comptable est à deux tabourets.", "He wants a counter ally. The accountant sits two stools away."),
            choices: [
              { text: "Ni me hables. Un desastre total.", correct: true, reaction: T("Il lève son verre vers vous. Vous êtes du quartier maintenant.", "He raises his glass to you. You're a local now.") },
              { text: "No veo deportes. Es una pérdida de tiempo.", reaction: T("Mépriser le foot, ici… La conversation s'arrête net.", "Scorning football, here… The conversation stops dead."), suspicion: 20 },
              { text: "¿Qué partido?", reaction: T("Ne pas savoir QUEL match ? Tout le bar le sait.", "Not knowing WHICH match? The whole bar knows."), suspicion: 15 },
            ],
            echoHint: T("Validez son indignation : « Ni me hables » — m'en parle pas. L'empathie de comptoir.", "Mirror his outrage: « Ni me hables » — don't get me started. Counter-top empathy."),
          },
          {
            npc: "El camarero", npcIcon: "🧔",
            line: "Vamos cerrando, ¿os cobro?",
            context: T("Le comptable se lève, serviette à la main. C'est l'instant décisif.", "The accountant stands, briefcase in hand. The decisive moment."),
            choices: [
              { text: "Sí, ¿qué te debo?", correct: true, reaction: T("Vous payez en habitué. Dans le miroir, la serviette change de mains. Tout est enregistré.", "You pay like a regular. In the mirror, the briefcase changes hands. All recorded.") },
              { text: "¡No! Yo me quedo una hora más.", reaction: T("Exiger de rester ? Le comptable vous repère et sort par-derrière.", "Demanding to stay? The accountant clocks you and slips out the back."), suspicion: 25 },
              { text: "Invita la casa, ¿no?", reaction: T("Réclamer la gratuité… Le barman rit jaune. On se souviendra de vous.", "Demanding it on the house… The barman's laugh is cold. You'll be remembered."), suspicion: 20 },
            ],
            echoHint: T("« ¿Qué te debo? » — qu'est-ce que je te dois ? La sortie naturelle de l'habitué.", "« ¿Qué te debo? » — what do I owe you? The regular's natural exit."),
          },
        ],
        cultural: {
          title: T("¿Tú o usted ?", "¿Tú or usted?"),
          text: T(
            "L'Espagne tutoie vite : au bar, entre collègues, dans la rue. « Usted » reste pour les personnes âgées et l'administration. Trop de « usted » à Madrid sonne distant — l'inverse de la France.",
            "Spain switches to tú fast: at the bar, between colleagues, in the street. « Usted » is for the elderly and official business. Too much « usted » in Madrid sounds distant — the opposite of France."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "vocab",
          id: "intel-vocab-bar-es",
          lemma: "KIT DE BARRA",
          phonetics: T("registre informel · Espagne", "informal register · Spain"),
          tag: T("VOCABULAIRE ACTIF — SOCIAL", "ACTIVE VOCABULARY — SOCIAL"),
          speakText: "¡Buenas! Una caña, por favor. Venga, un pincho de tortilla. ¿Qué te debo?",
          flashback: T(
            "El Doble, 21 h. Le barman crie « ¡Marchando! », la rue embaume la friture, et dans le miroir derrière les bouteilles, une serviette en cuir glisse d'une main à l'autre…",
            "El Doble, 9 pm. The barman shouts « ¡Marchando! », the street smells of frying oil, and in the mirror behind the bottles a leather briefcase slides from one hand to another…"
          ),
          entries: [
            { en: "¡Buenas!", note: T("Le salut passe-partout, à toute heure.", "The all-purpose greeting, any time of day.") },
            { en: "Una caña, por favor.", note: T("Petite bière pression — LA commande standard.", "A small draft beer — THE standard order.") },
            { en: "¿Qué te pongo?", note: T("« Qu'est-ce que je te sers ? » — l'accueil du barman.", "“What can I get you?” — the barman's welcome.") },
            { en: "Venga.", note: T("Allez / d'accord / c'est parti — la particule universelle.", "Come on / alright / let's go — the universal particle.") },
            { en: "¿Qué te debo?", note: T("« Qu'est-ce que je te dois ? » — pour payer en habitué.", "“What do I owe you?” — paying like a regular.") },
            { en: "La cuenta, por favor.", note: T("L'addition, version restaurant.", "The bill, restaurant version.") },
          ],
          examples: ["¡Buenas! Una caña y un pincho.", "Venga, nos vemos mañana.", "¿Qué te debo?"],
        },
      },

      // ============================================================
      // ES-MAD-003 — LA SURVEILLANCE — memo intercepté
      // ============================================================
      {
        id: "ES-MAD-003",
        type: "surveillance",
        typeName: T("La Surveillance", "The Surveillance"),
        icon: "📄",
        title: "Operación CORREO",
        subtitle: T("Décoder la note interne de Madrid", "Decode the Madrid internal memo"),
        location: T("Planque CODEX · Lavapiés", "CODEX safehouse · Lavapiés"),
        difficulty: 2,
        durationMin: 10,
        xpBase: 120,
        brief: {
          narrative: T(
            "Notre cellule a intercepté une note interne du bureau madrilène de BABEL CORP : une remise sensible se prépare quelque part dans la ville.",
            "Our cell intercepted an internal memo from BABEL CORP's Madrid office: a sensitive hand-over is being staged somewhere in the city."
          ),
          context: T(
            "Extrayez les informations critiques avant la fermeture du canal.",
            "Extract the critical information before the channel closes."
          ),
          intelPreview: T("DOCUMENT : [████ ████]", "DOCUMENT: [████ ████]"),
          echo: T("Cherchez le qui, le quand, le où. Le reste est du bruit.", "Hunt for the who, the when, the where. The rest is noise."),
        },
        scene: { name: T("Planque de Lavapiés", "Lavapiés safehouse"), ambiance: "office", props: [] },
        document: {
          title: "NOTA INTERCEPTADA — CANAL SEGURO 4",
          meta: "De: c.ibarra@babelcorp-madrid.es\nPara: equipo-archivo@babelcorp-madrid.es\nAsunto: Entrega adelantada — instrucciones URGENTES",
          paragraphs: [
            "A todo el equipo,",
            "La entrega del viernes se adelanta al jueves a las 8 de la mañana, en el almacén de Vallecas. El mensajero no esperará más de diez minutos.",
            "Como siempre, solo la Sra. Vega está autorizada a firmar el registro de entrada. Nadie más toca los documentos.",
            "Si alguien pregunta por las cajas, la respuesta acordada es que contienen folletos para la oficina de Lisboa.",
            "Un saludo,\nC. Ibarra — Coordinación",
          ],
          glossary: {
            entrega: { ph: "/enˈtɾeɣa/", hint: T("📦 une livraison, une remise", "📦 a delivery, a hand-over") },
            adelanta: { ph: "/aðeˈlanta/", hint: T("⏪ avancée dans le temps", "⏪ moved earlier in time") },
            "almacén": { ph: "/almaˈθen/", hint: T("🏭 entrepôt de stockage", "🏭 a storage warehouse") },
            mensajero: { ph: "/mensaˈxeɾo/", hint: T("🚴 celui qui livre les plis", "🚴 the one who delivers packages") },
            firmar: { ph: "/fiɾˈmaɾ/", hint: T("✍️ apposer sa signature", "✍️ to sign") },
            registro: { ph: "/reˈxistɾo/", hint: T("📖 le cahier officiel d'entrées", "📖 the official entry log") },
            acordada: { ph: "/akoɾˈðaða/", hint: T("🤝 convenue à l'avance", "🤝 agreed in advance") },
            folletos: { ph: "/foˈʎetos/", hint: T("📚 brochures imprimées", "📚 printed booklets") },
          },
        },
        questions: [
          {
            q: T("Quand la livraison a-t-elle désormais lieu ?", "When does the delivery now take place?"),
            options: [T("Jeudi à 8 h", "Thursday at 8 am"), T("Vendredi à 8 h", "Friday at 8 am"), T("Jeudi à midi", "Thursday at noon")],
            correct: 0,
            echoHint: T("« Se adelanta al jueves… » — avancée à jeudi.", "« Se adelanta al jueves… » — moved up to Thursday."),
          },
          {
            q: T("Où la remise a-t-elle lieu ?", "Where does the hand-over happen?"),
            options: [T("Au bureau de Lisbonne", "At the Lisbon office"), T("À l'entrepôt de Vallecas", "At the Vallecas warehouse"), T("Au Mercado de San Miguel", "At the Mercado de San Miguel")],
            correct: 1,
            echoHint: T("« En el almacén de Vallecas. »", "« En el almacén de Vallecas. »"),
          },
          {
            q: T("Qui peut signer le registre ?", "Who may sign the log?"),
            options: [T("N'importe quel employé", "Any employee"), T("Le messager", "The courier"), T("Mme Vega uniquement", "Mrs Vega only")],
            correct: 2,
            echoHint: T("« Solo la Sra. Vega está autorizada… »", "« Solo la Sra. Vega está autorizada… »"),
          },
          {
            q: T("Quelle est la couverture officielle des caisses ?", "What is the agreed cover story for the crates?"),
            options: [T("Des brochures pour Lisbonne", "Brochures for Lisbon"), T("Des archives comptables", "Accounting archives"), T("Du matériel de bureau pour Séville", "Office supplies for Seville")],
            correct: 0,
            echoHint: T("« La respuesta acordada » ferme la note.", "« La respuesta acordada » closes the memo."),
          },
        ],
        cultural: {
          title: T("« Ahora » est élastique", "« Ahora » is elastic"),
          text: T(
            "« Ahora » (maintenant) peut vouloir dire dans cinq minutes… ou dans une heure. « Ahora mismo » resserre un peu. Pour du vraiment immédiat : « ya ».",
            "« Ahora » (now) can mean in five minutes… or in an hour. « Ahora mismo » tightens it a little. For truly immediate: « ya »."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "vocab",
          id: "intel-vocab-oficina-es",
          lemma: "ARCHIVO MADRID",
          phonetics: T("registre professionnel · écrit", "professional register · written"),
          tag: T("COMPRÉHENSION ÉCRITE — NOTE FORMELLE", "READING COMPREHENSION — FORMAL MEMO"),
          speakText: "La entrega se adelanta al jueves. Solo la señora Vega firma el registro.",
          flashback: T(
            "Lavapiés, 3 h du matin. L'écran clignote : « INTERCEPTACIÓN COMPLETADA ». Quelque part à Vallecas, un entrepôt change ses horaires…",
            "Lavapiés, 3 am. The screen blinks: « INTERCEPTACIÓN COMPLETADA ». Somewhere in Vallecas, a warehouse changes its schedule…"
          ),
          entries: [
            { en: "la entrega", note: T("La livraison, la remise.", "The delivery, the hand-over.") },
            { en: "el almacén", note: T("L'entrepôt.", "The warehouse.") },
            { en: "el mensajero", note: T("Le coursier.", "The courier.") },
            { en: "firmar el registro", note: T("Signer le registre.", "To sign the log.") },
            { en: "la respuesta acordada", note: T("La réponse convenue — la couverture.", "The agreed answer — the cover story.") },
            { en: "Un saludo", note: T("Formule de clôture standard des emails.", "Standard email sign-off.") },
          ],
          examples: ["La entrega se adelanta al jueves.", "Nadie más toca los documentos.", "Un saludo, C. Ibarra."],
        },
      },

      // ============================================================
      // ES-MAD-004 — LA NÉGOCIATION — El Rastro
      // ============================================================
      {
        id: "ES-MAD-004",
        type: "negociation",
        typeName: T("La Négociation", "The Negotiation"),
        icon: "🤝",
        title: "Operación RASTRO",
        subtitle: T("Retourner l'informatrice Vega", "Turn the informant Vega"),
        location: "El Rastro · La Latina",
        difficulty: 3,
        durationMin: 14,
        xpBase: 140,
        brief: {
          narrative: T(
            "La Sra. Vega — la seule signature autorisée de Vallecas — vend des gravures anciennes au Rastro le dimanche. Elle est prête à parler, si votre espagnol inspire confiance.",
            "Sra. Vega — Vallecas' only authorised signature — sells old prints at the Rastro on Sundays. She'll talk, if your Spanish inspires trust."
          ),
          context: T(
            "Chaque phrase doit être grammaticalement irréprochable. Un faux accord, et elle replie son étal.",
            "Every sentence must be grammatically flawless. One bad agreement, and she folds her stall."
          ),
          intelPreview: T("GRAMMAIRE : [██████████]", "GRAMMAR: [██████████]"),
          echo: T("Construisez avec précision. Ici, la grammaire est votre crédibilité.", "Build with precision. Here, grammar is your credibility."),
        },
        scene: {
          name: "El Rastro — Ribera de Curtidores",
          ambiance: "market",
          props: [
            { e: "🖼️", x: 14, y: 50 }, { e: "📻", x: 34, y: 58 }, { e: "🧥", x: 80, y: 52 },
            { e: "☀️", x: 88, y: 14, size: 36 }, { e: "📚", x: 56, y: 60 },
          ],
        },
        rounds: [
          {
            npcLine: "Demuestre que viene del Instituto. ¿Por qué hablaría con usted?",
            targetL1: T("« Nous avons les documents. »", "“We have the documents.”"),
            solution: ["Tenemos", "los documentos"],
            bank: [
              { w: "Tenemos", cat: "verb" }, { w: "Tienen", cat: "verb" }, { w: "Tengo", cat: "verb" },
              { w: "los documentos", cat: "comp" }, { w: "ayer", cat: "mod" },
            ],
            okReaction: T("Elle replace une gravure, l'air de rien. « Siga. »", "She repositions a print, casually. « Siga. »"),
            echoHint: T("NOUS = -emos. Pas de pronom nécessaire : « Tenemos » se suffit.", "WE = -emos. No pronoun needed: « Tenemos » stands alone."),
          },
          {
            npcLine: "¿La siguieron? ¿Dónde estuvo usted ayer?",
            targetL1: T("« J'ai mangé au marché hier. »", "“I ate at the market yesterday.”"),
            solution: ["Comí", "en el mercado", "ayer"],
            bank: [
              { w: "Comí", cat: "verb" }, { w: "Como", cat: "verb" }, { w: "Comió", cat: "verb" },
              { w: "en el mercado", cat: "comp" }, { w: "ayer", cat: "mod" }, { w: "mañana", cat: "mod" },
            ],
            okReaction: T("Un alibi simple, au pretérito impeccable. Ses épaules se relâchent.", "A simple alibi, in flawless pretérito. Her shoulders ease."),
            echoHint: T("Le pretérito de COMER — l'accent final fait tout : COMÍ.", "The pretérito of COMER — the final accent does it all: COMÍ."),
          },
          {
            npcLine: "Hay una mujer mirándonos desde el puesto de discos. ¿La conoce?",
            targetL1: T("« Elle travaille pour Babel Corp. »", "“She works for Babel Corp.”"),
            solution: ["Ella", "trabaja", "para Babel Corp"],
            bank: [
              { w: "Ella", cat: "subject" }, { w: "Ellos", cat: "subject" },
              { w: "trabaja", cat: "verb" }, { w: "trabajas", cat: "verb" }, { w: "trabajan", cat: "verb" },
              { w: "para Babel Corp", cat: "comp" }, { w: "siempre", cat: "mod" },
            ],
            okReaction: T("« Entonces tenemos poco tiempo. » Elle glisse un carnet entre deux gravures.", "« Entonces tenemos poco tiempo. » She slips a notebook between two prints."),
            echoHint: T("ELLA → trabaja (-a). TRABAJAS = tu ; TRABAJAN = ils.", "ELLA → trabaja (-a). TRABAJAS = you; TRABAJAN = they."),
          },
          {
            npcLine: "Si le doy este cuaderno… ¿qué pasa conmigo?",
            targetL1: T("« Si vous nous aidez, nous vous protégerons. »", "“If you help us, we will protect you.”"),
            solution: ["Si", "usted", "nos ayuda", "la protegeremos"],
            bank: [
              { w: "Si", cat: "conn" }, { w: "Cuando", cat: "conn" },
              { w: "usted", cat: "subject" }, { w: "nosotros", cat: "subject" },
              { w: "nos ayuda", cat: "verb" }, { w: "nos ayudan", cat: "verb" },
              { w: "la protegeremos", cat: "verb" }, { w: "la protegemos", cat: "verb" },
            ],
            okReaction: T("Un long silence. Puis le carnet glisse dans votre sac, sous une gravure de la Plaza Mayor.", "A long silence. Then the notebook slides into your bag, under a print of Plaza Mayor."),
            echoHint: T("SI + présent, puis futur : « la protegeremos ». Le -eremos porte la promesse.", "SI + present, then future: « la protegeremos ». The -eremos carries the promise."),
          },
        ],
        cultural: {
          title: "El Rastro",
          text: T(
            "Le marché aux puces du dimanche madrilène, depuis quatre siècles. On y marchande tout — sauf à la première offre : refuser puis revenir fait partie du rituel.",
            "Madrid's Sunday flea market, four centuries old. Everything is haggled — but never at the first offer: walking away and coming back is part of the ritual."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "grammar",
          id: "intel-grammar-es-structure",
          lemma: "MOTOR DE FRASE",
          phonetics: T("Sujet (optionnel) → Verbe → Complément", "Subject (optional) → Verb → Complement"),
          tag: T("GRAMMAIRE OPÉRATIONNELLE", "OPERATIONAL GRAMMAR"),
          speakText: "Si usted nos ayuda, la protegeremos.",
          flashback: T(
            "Le Rastro à midi, marée humaine. Vega pèse chacune de vos terminaisons comme une pièce d'or. À la quatrième phrase, le carnet change de propriétaire…",
            "The Rastro at noon, a human tide. Vega weighs each of your endings like a gold coin. At the fourth sentence, the notebook changes hands…"
          ),
          table: [
            { label: T("PRONOMS OPTIONNELS", "OPTIONAL PRONOUNS"), value: T("La terminaison porte le sujet :\ncomo = je mange", "The ending carries the subject:\ncomo = I eat") },
            { label: "PRESENTE", value: "-o · -es/-as · -e/-a\ntrabaja · come · vive" },
            { label: "PRETÉRITO", value: "comí · comiste · comió\n(accent final ⚡)" },
            { label: T("CONDITIONNELLE", "CONDITIONAL"), value: T("Si + présent,\npuis futur (-emos/-á)", "Si + present,\nthen future (-emos/-á)") },
          ],
          examples: ["Tenemos los documentos.", "Ella trabaja para Babel Corp.", "Si usted nos ayuda, la protegeremos."],
          quiz: [
            { q: "« Ella ____ para Babel Corp. »", options: ["trabajan", "trabaja", "trabajas"], a: 1 },
            { q: T("« Si usted nos ayuda, la ____. »", "« Si usted nos ayuda, la ____. »"), options: ["protegemos", "protegía", "protegeremos"], a: 2 },
          ],
        },
      },
    ],

    dailyFallback: [
      { q: { fr: "Quel est le pretérito de COMER (je) ?", en: "What is the pretérito of COMER (I)?" }, options: ["comí", "como", "comeré"], correct: 0 },
      { q: { fr: "Que commander au bar à Madrid ?", en: "What do you order at a Madrid bar?" }, options: ["Una caña", "Un magnum", "Una cerveza grande ahora"], correct: 0 },
      { q: { fr: "« ¿____ comido ya? »", en: "« ¿____ comido ya? »" }, options: ["He", "Has", "Ha"], correct: 1 },
      { q: { fr: "« Venga » signifie…", en: "« Venga » means…" }, options: [{ fr: "Allez / d'accord", en: "Come on / alright" }, { fr: "Au revoir", en: "Goodbye" }, { fr: "Attention", en: "Watch out" }], correct: 0 },
      { q: { fr: "« Ella ____ para Babel Corp. »", en: "« Ella ____ para Babel Corp. »" }, options: ["trabajas", "trabaja", "trabajan"], correct: 1 },
    ],
  };
};
