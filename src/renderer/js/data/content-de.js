/**
 * THE CODEX — Arc ALLEMAND · Berlin (fabrique bilingue).
 * La narration est générée dans la L1 de l'agent (fr ou en) via T(fr, en).
 */
"use strict";
window.Codex = window.Codex || {};

Codex.ARC_FACTORIES["de-DE"] = function buildGermanArc(l1) {
  const T = (fr, en) => (l1 === "fr" ? fr : en);

  return {
    id: "de-DE",
    l1,
    language: { id: "de-DE", name: T("Allemand", "German"), flag: "🇩🇪", country: T("Allemagne", "Germany"), tts: "de-DE" },
    theme: "de-DE",
    zone: { id: "berlin", name: "Berlin", domain: T("Verbes du quotidien · Präsens & Perfekt", "Everyday verbs · Präsens & Perfekt") },

    echo: {
      hq: [
        T("Agent, un nouveau dossier vous attend à Berlin.", "Agent, a new dossier awaits you in Berlin."),
        T("BABEL CORP a ouvert une antenne à Kreuzberg. Restez vif.", "BABEL CORP opened a branch in Kreuzberg. Stay sharp."),
        T("Votre intel s'accumule — Berlin récompense la précision.", "Your intel is stacking up — Berlin rewards precision."),
      ],
      success: [
        T("Excellent, Agent. Structure parfaitement idiomatique.", "Excellent, Agent. Perfectly idiomatic structure."),
        T("Mission propre. Sehr gut.", "Clean mission. Sehr gut."),
      ],
      perfect: [
        T("Zéro erreur. La rigueur allemande vous va bien.", "Zero errors. German rigour suits you."),
      ],
      warning: [
        T("Attention. La cible a noté votre formulation.", "Careful. The target noted your phrasing."),
      ],
      urgent: [
        T("Recentrez. Le mot le plus neutre. Maintenant.", "Refocus. The most neutral word. Now."),
      ],
    },

    missions: [
      // ============================================================
      // DE-BER-001 — LA PERCÉE — verbe ESSEN
      // ============================================================
      {
        id: "DE-BER-001",
        type: "percee",
        typeName: T("La Percée", "The Breach"),
        icon: "🔓",
        title: "Operation MARKTHALLE",
        subtitle: T("Craquer le code de la cantine", "Crack the canteen's code"),
        location: "Markthalle Neun · Kreuzberg",
        difficulty: 2,
        durationMin: 10,
        xpBase: 150,
        brief: {
          narrative: T(
            "Un traiteur de la Markthalle Neun sert de boîte aux lettres à BABEL CORP. Fondez-vous parmi les habitués du marché couvert de Kreuzberg.",
            "A food stall at Markthalle Neun doubles as a dead-drop for BABEL CORP. Blend in with the regulars of Kreuzberg's covered market."
          ),
          context: T(
            "Quatre fragments d'intel sont dissimulés entre les stands. Une erreur de langue, et la boîte aux lettres se déplace.",
            "Four intel fragments are hidden among the stands. One language slip, and the dead-drop moves."
          ),
          intelPreview: T("VERBE : [█████]", "VERB: [█████]"),
          echo: T(
            "Votre objectif : un verbe fort allemand — il change de voyelle sous vos yeux. Ouvrez l'œil.",
            "Your objective: a German strong verb — it changes vowel before your eyes. Stay sharp."
          ),
        },
        scene: {
          name: "Markthalle Neun",
          ambiance: "market",
          props: [
            { e: "🥨", x: 14, y: 50 }, { e: "🌭", x: 34, y: 58 }, { e: "🍺", x: 84, y: 44 },
            { e: "🏮", x: 50, y: 14, size: 28 }, { e: "🧀", x: 68, y: 56 },
          ],
        },
        fragments: [
          {
            id: "frag-de01", icon: "📋", label: T("L'ardoise du stand", "The stall chalkboard"), x: 18, y: 46,
            sceneText: T(
              "Un habitué commande : « Ich esse hier jeden Tag. » La vendeuse rit : « Und er isst immer dasselbe! »",
              "A regular orders: « Ich esse hier jeden Tag. » The vendor laughs: « Und er isst immer dasselbe! »"
            ),
            intel: "ICH ESSE · DU ISST · ER/SIE ISST",
            rule: T("Verbe fort : la voyelle change au singulier — esse → isst.", "Strong verb: the vowel changes in the singular — esse → isst."),
            echo: T("E devient I : ich esse, du isst. Ce changement de voyelle signe les verbes forts allemands.",
                    "E becomes I: ich esse, du isst. That vowel shift is the signature of German strong verbs."),
          },
          {
            id: "frag-de02", icon: "💬", label: T("Conversation captée", "Overheard conversation"), x: 44, y: 38,
            sceneText: T(
              "Deux clients : « Aßt ihr gestern hier? » — « Ja, ich aß mit dem Chef. Die Currywurst war großartig. »",
              "Two customers: « Aßt ihr gestern hier? » — « Ja, ich aß mit dem Chef. Die Currywurst war großartig. »"
            ),
            intel: "ICH ASS (aß) — Präteritum",
            rule: T("Prétérit du verbe fort : essen → aß (à l'écrit surtout).", "Strong verb preterite: essen → aß (mostly written German)."),
            echo: T("« Aß » — le passé littéraire. À l'oral, Berlin préfère le Perfekt. Fragment suivant.",
                    "« Aß » — the literary past. Spoken Berlin prefers the Perfekt. Next fragment."),
          },
          {
            id: "frag-de03", icon: "🪧", label: T("Le panneau du chef", "The chef's sign"), x: 67, y: 32,
            sceneText: T(
              "Sur le panneau : « Gut essen, gut leben. » Et dessous : « Hast du schon bei uns gegessen? »",
              "On the sign: « Gut essen, gut leben. » Below: « Hast du schon bei uns gegessen? »"
            ),
            intel: "HABE GEGESSEN · HAST GEGESSEN — Perfekt",
            rule: T("HABEN + GEGESSEN… et le participe se jette À LA FIN de la phrase.", "HABEN + GEGESSEN… and the participle is thrown to the END of the sentence."),
            echo: T("Le participe attend en fin de phrase : « Hast du schon … gegessen? ». L'allemand garde le meilleur pour la fin.",
                    "The participle waits at the end: « Hast du schon … gegessen? ». German saves the best for last."),
          },
          {
            id: "frag-de04", icon: "📓", label: T("Le carnet du serveur", "The waiter's notepad"), x: 82, y: 60,
            sceneText: T(
              "Dans le carnet : « Tisch 4 wird um 20 Uhr essen » · « Herr H. würde alles essen, wenn es gratis ist. »",
              "In the notepad: « Tisch 4 wird um 20 Uhr essen » · « Herr H. würde alles essen, wenn es gratis ist. »"
            ),
            intel: "WIRD ESSEN (Futur) · WÜRDE ESSEN (Konditional)",
            rule: T("werden/würde + infinitif EN FIN de phrase.", "werden/würde + infinitive at the END of the sentence."),
            echo: T("Werden + infinitif final : « wird … essen ». Le paradigme est complet, Agent.",
                    "Werden + final infinitive: « wird … essen ». The paradigm is complete, Agent."),
          },
        ],
        cultural: {
          icon: "♻️", label: T("La consigne", "The deposit"), x: 55, y: 78,
          title: "Pfand",
          text: T(
            "Presque toutes les bouteilles portent une consigne (Pfand, 8 à 25 centimes). On les rapporte au supermarché — ou on les pose près des poubelles pour les collecteurs : un geste berlinois.",
            "Nearly every bottle carries a deposit (Pfand, 8–25 cents). You return them to the supermarket — or leave them beside bins for collectors: a very Berlin gesture."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "verb",
          id: "intel-verb-essen",
          lemma: "ESSEN",
          phonetics: "/ˈɛsn̩/",
          tag: T("VERBE FORT ⚠ — VOYELLE CHANGEANTE", "STRONG VERB ⚠ — VOWEL CHANGE"),
          speakText: "essen. Ich esse, du isst, er isst. Ich habe gegessen.",
          flashback: T(
            "Markthalle Neun, vendredi midi. Une vendeuse rit : « Er isst immer dasselbe! » Derrière le stand, une enveloppe glisse sous une planche à charcuterie…",
            "Markthalle Neun, Friday noon. A vendor laughs: « Er isst immer dasselbe! » Behind the stall, an envelope slides under a charcuterie board…"
          ),
          table: [
            { label: "PRÄSENS", value: "ich esse · du isst ⚡\ner/sie isst · wir essen\nihr esst · sie essen" },
            { label: "PRÄTERITUM", value: T("ich aß\n(registre écrit)", "ich aß\n(written register)") },
            { label: "PERFEKT", value: "ich habe gegessen\n(participe en fin ⚡)" },
            { label: T("FUTUR / COND.", "FUTURE / COND."), value: "wird essen\nwürde essen" },
          ],
          examples: ["Ich esse hier jeden Tag.", "Hast du schon gegessen?", "Er würde alles essen."],
          quiz: [
            { q: T("« Du ____ immer dasselbe. »", "« Du ____ immer dasselbe. »"), options: ["esse", "isst", "essen"], a: 1 },
            { q: T("Quel est le participe passé de ESSEN ?", "What is the past participle of ESSEN?"), options: ["geessen", "gegessen", "aßen"], a: 1 },
            { q: T("« Hast du schon ____ ? »", "« Hast du schon ____ ? »"), options: ["gegessen", "isst", "essen"], a: 0 },
          ],
        },
      },

      // ============================================================
      // DE-BER-002 — L'INFILTRATION — le Späti
      // ============================================================
      {
        id: "DE-BER-002",
        type: "infiltration",
        typeName: T("L'Infiltration", "The Infiltration"),
        icon: "🕵️",
        title: "Operation SPÄTI",
        subtitle: T("Passer pour un habitué du quartier", "Pass for a neighbourhood regular"),
        location: "Späti 24 · Kreuzberg",
        difficulty: 3,
        durationMin: 12,
        xpBase: 130,
        brief: {
          narrative: T(
            "Un coursier de BABEL CORP s'arrête chaque soir au Späti de la Wrangelstraße. Achetez votre bière, tenez le banc devant la vitrine, et observez la remise du paquet.",
            "A BABEL CORP courier stops every evening at the Späti on Wrangelstraße. Buy your beer, hold the bench outside, and watch the package change hands."
          ),
          context: T(
            "Le Späti a ses codes : direct mais poli, du/Sie selon l'âge, et on ne bloque jamais le frigo.",
            "The Späti has its codes: direct but polite, du/Sie by age, and never block the fridge."
          ),
          intelPreview: T("VOCABULAIRE : [██████]", "VOCABULARY: [██████]"),
          echo: T("À Berlin, la politesse est directe. Les détours éveillent les soupçons.", "In Berlin, politeness is direct. Detours raise suspicion."),
        },
        scene: {
          name: "Späti 24 — Wrangelstraße",
          ambiance: "street",
          props: [
            { e: "🍺", x: 16, y: 44 }, { e: "🧃", x: 36, y: 50 }, { e: "🚲", x: 84, y: 60, size: 44 },
            { e: "💡", x: 52, y: 12, size: 28 }, { e: "📰", x: 70, y: 50 },
          ],
        },
        interactions: [
          {
            npc: "Der Spätibesitzer", npcIcon: "🧔",
            line: "Na? Was darf's sein?",
            context: T("Il réapprovisionne le frigo sans se retourner.", "He restocks the fridge without turning around."),
            choices: [
              { text: "N'Abend. Ein Bier, bitte.", correct: true, reaction: T("Il tend la bouteille et décapsule d'un geste. Vous êtes du quartier.", "He hands over the bottle and pops the cap in one motion. You belong here.") },
              { text: "Geben Sie mir sofort ein Bier!", reaction: T("Trop impérieux. Il vous sert au ralenti, exprès.", "Too imperious. He serves you in slow motion, on purpose."), suspicion: 20 },
              { text: "Bonsoir, une bière s'il vous plaît.", reaction: T("Du français au Späti… Il vous dévisage.", "French at the Späti… He stares at you."), suspicion: 15 },
            ],
            echoHint: T("« N'Abend » — le bonsoir abrégé du quartier. Puis commande courte : « Ein Bier, bitte. »", "« N'Abend » — the neighbourhood's clipped good evening. Then a short order: « Ein Bier, bitte. »"),
          },
          {
            npc: "Eine Nachbarin", npcIcon: "👩‍🦳",
            line: "Sie sind neu hier, oder?",
            context: T("Elle vous vouvoie — elle a l'âge de le faire.", "She uses Sie — she's earned the right."),
            choices: [
              { text: "Ja, ich bin gerade erst hergezogen.", correct: true, reaction: T("« Willkommen im Kiez! » Elle lève sa bouteille vers vous.", "« Willkommen im Kiez! » She raises her bottle to you.") },
              { text: "Du bist aber neugierig!", reaction: T("La tutoyer, ELLE ? Le banc entier se fige.", "Using du with HER? The whole bench freezes."), suspicion: 25 },
              { text: "Das geht Sie nichts an.", reaction: T("Sec, même pour Berlin. Elle vous mémorise.", "Cold, even for Berlin. She memorises your face."), suspicion: 20 },
            ],
            echoHint: T("Elle vous vouvoie : répondez en Sie. « Ich bin gerade erst hergezogen » — je viens d'emménager.", "She used Sie: answer in Sie. « Ich bin gerade erst hergezogen » — I just moved here."),
          },
          {
            npc: "Der Spätibesitzer", npcIcon: "🧔",
            line: "Pfandflasche zurück? Sonst noch was?",
            context: T("Il désigne la bouteille vide près de vous.", "He nods at the empty bottle beside you."),
            choices: [
              { text: "Klar, hier. Und 'ne Brezel dazu.", correct: true, reaction: T("Pfand rendu, bretzel en main. Geste de local parfait.", "Pfand returned, pretzel in hand. A flawless local move.") },
              { text: "Die Flasche werfe ich weg.", reaction: T("JETER une bouteille consignée ?! Trois têtes se retournent.", "THROWING a deposit bottle?! Three heads turn."), suspicion: 20 },
              { text: "Was ist Pfand?", reaction: T("Ne pas connaître le Pfand… vous n'êtes pas d'ici.", "Not knowing Pfand… you're not from here."), suspicion: 15 },
            ],
            echoHint: T("Le Pfand se rend, toujours. « Klar, hier » — bien sûr, tenez.", "Pfand always goes back. « Klar, hier » — sure, here you go."),
          },
          {
            npc: "Ein Stammkunde", npcIcon: "🧑",
            line: "Endlich Feierabend, was? Was für ein Tag…",
            context: T("Il s'assoit sur le banc avec sa bière. Le coursier approche au coin de la rue.", "He sits on the bench with his beer. The courier rounds the corner."),
            choices: [
              { text: "Sag bloß nichts. Was für eine Woche!", correct: true, reaction: T("Il trinque contre votre bouteille. Vous êtes invisible, parfaitement intégré.", "He clinks your bottle. You're invisible, perfectly blended in.") },
              { text: "Ich arbeite nie. Arbeit ist sinnlos.", reaction: T("Mépriser le travail un soir de Feierabend… Il s'écarte.", "Scorning work on a Feierabend evening… He edges away."), suspicion: 20 },
              { text: "Feierabend? Was bedeutet das?", reaction: T("Ne pas connaître le Feierabend, c'est ne pas connaître l'Allemagne.", "Not knowing Feierabend means not knowing Germany."), suspicion: 15 },
            ],
            echoHint: T("« Feierabend » — la fin de journée sacrée. Renchérissez : « Was für eine Woche! »", "« Feierabend » — the sacred end of the workday. Match him: « Was für eine Woche! »"),
          },
          {
            npc: "Der Spätibesitzer", npcIcon: "🧔",
            line: "Ich mache gleich Kasse. Zahlst du noch?",
            context: T("Le coursier entre et pose un paquet derrière le comptoir. L'instant décisif.", "The courier walks in and sets a package behind the counter. The decisive moment."),
            choices: [
              { text: "Klar. Was macht das?", correct: true, reaction: T("Vous payez en habitué. Dans le reflet de la vitrine, le paquet change d'étagère. Tout est enregistré.", "You pay like a regular. In the window's reflection, the package moves shelves. All recorded.") },
              { text: "Ich bleibe noch zwei Stunden hier.", reaction: T("Vouloir rester après la caisse ? Le coursier vous repère.", "Staying past the till? The courier clocks you."), suspicion: 25 },
              { text: "Das Bier geht aufs Haus, oder?", reaction: T("Demander la gratuité… Il rit jaune. On se souviendra de vous.", "Asking for it on the house… A cold laugh. You'll be remembered."), suspicion: 20 },
            ],
            echoHint: T("« Was macht das? » — ça fait combien ? La sortie naturelle de l'habitué.", "« Was macht das? » — what does it come to? The regular's natural exit."),
          },
        ],
        cultural: {
          title: T("Du ou Sie ?", "Du or Sie?"),
          text: T(
            "Le « Sie » reste la norme avec les inconnus adultes et au travail — mais Berlin tutoie plus vite que le reste de l'Allemagne, surtout à Kreuzberg. En cas de doute : Sie, et laissez l'autre proposer le « du ».",
            "« Sie » remains the norm with adult strangers and at work — but Berlin switches to du faster than the rest of Germany, especially in Kreuzberg. When in doubt: Sie, and let the other person offer « du »."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "vocab",
          id: "intel-vocab-spaeti",
          lemma: "SPÄTI-KIT",
          phonetics: T("registre informel · Berlin", "informal register · Berlin"),
          tag: T("VOCABULAIRE ACTIF — SOCIAL", "ACTIVE VOCABULARY — SOCIAL"),
          speakText: "N'Abend. Ein Bier, bitte. Was macht das? Endlich Feierabend.",
          flashback: T(
            "Wrangelstraße, 22 h. Les bancs du Späti, la lumière des frigos, et dans le reflet de la vitrine, un paquet qui change d'étagère…",
            "Wrangelstraße, 10 pm. The Späti benches, the fridge light, and in the window's reflection a package moving shelves…"
          ),
          entries: [
            { en: "N'Abend!", note: T("« Guten Abend » abrégé — le salut du soir au quartier.", "Clipped « Guten Abend » — the neighbourhood evening greeting.") },
            { en: "Was darf's sein?", note: T("« Qu'est-ce que ce sera ? » — l'accueil du commerçant.", "“What'll it be?” — the shopkeeper's welcome.") },
            { en: "Ein Bier, bitte.", note: T("Commande courte et polie — le standard.", "Short, polite order — the standard.") },
            { en: "Pfand", note: T("La consigne des bouteilles — se rend, toujours.", "The bottle deposit — always returned.") },
            { en: "Feierabend", note: T("La fin de journée de travail, presque sacrée.", "The end of the workday, near-sacred.") },
            { en: "Was macht das?", note: T("« Ça fait combien ? » — pour payer.", "“What does it come to?” — to pay.") },
          ],
          examples: ["N'Abend! Ein Bier, bitte.", "Endlich Feierabend!", "Was macht das?"],
        },
      },

      // ============================================================
      // DE-BER-003 — LA SURVEILLANCE — note interne
      // ============================================================
      {
        id: "DE-BER-003",
        type: "surveillance",
        typeName: T("La Surveillance", "The Surveillance"),
        icon: "📄",
        title: "Operation MEMO",
        subtitle: T("Décoder la note interne de Berlin", "Decode the Berlin internal memo"),
        location: T("Planque CODEX · Neukölln", "CODEX safehouse · Neukölln"),
        difficulty: 2,
        durationMin: 10,
        xpBase: 120,
        brief: {
          narrative: T(
            "Notre cellule a intercepté une note interne de l'antenne berlinoise de BABEL CORP : une livraison sensible se prépare.",
            "Our cell intercepted an internal memo from BABEL CORP's Berlin branch: a sensitive delivery is being staged."
          ),
          context: T("Extrayez les informations critiques avant la fermeture du canal.", "Extract the critical information before the channel closes."),
          intelPreview: T("DOCUMENT : [████ ████]", "DOCUMENT: [████ ████]"),
          echo: T("Cherchez le qui, le quand, le où. Le reste est du bruit.", "Hunt for the who, the when, the where. The rest is noise."),
        },
        scene: { name: T("Planque de Neukölln", "Neukölln safehouse"), ambiance: "office", props: [] },
        document: {
          title: "INTERNE MITTEILUNG — SICHERER KANAL 6",
          meta: "Von: k.brandt@babelcorp-berlin.de\nAn: team-archiv@babelcorp-berlin.de\nBetreff: Lieferung vorverlegt — DRINGENDE Anweisungen",
          paragraphs: [
            "An das ganze Team,",
            "die Lieferung vom Freitag wird auf Donnerstag, 7 Uhr, vorverlegt. Der Fahrer benutzt den Hintereingang des Lagers in Spandau und wartet nicht länger als zehn Minuten.",
            "Wie immer darf nur Frau Krüger das Empfangsbuch unterschreiben. Niemand sonst berührt die Unterlagen.",
            "Falls jemand nach den Kisten fragt, lautet die vereinbarte Antwort: Sie enthalten Broschüren für das Büro in Lissabon.",
            "Mit freundlichen Grüßen,\nK. Brandt — Koordination",
          ],
          glossary: {
            Lieferung: { ph: "/ˈliːfəʁʊŋ/", hint: T("📦 une livraison", "📦 a delivery") },
            vorverlegt: { ph: "/ˈfoːɐ̯fɛɐ̯leːkt/", hint: T("⏪ avancée dans le temps", "⏪ moved earlier in time") },
            Hintereingang: { ph: "/ˈhɪntɐʔaɪnɡaŋ/", hint: T("🚪 l'entrée arrière", "🚪 the rear entrance") },
            Lagers: { ph: "/ˈlaːɡɐs/", hint: T("🏭 de l'entrepôt", "🏭 of the warehouse") },
            unterschreiben: { ph: "/ʊntɐˈʃʁaɪbn̩/", hint: T("✍️ signer", "✍️ to sign") },
            Empfangsbuch: { ph: "/ɛmˈpfaŋsbuːx/", hint: T("📖 le registre de réception", "📖 the receiving log") },
            vereinbarte: { ph: "/fɛɐ̯ˈʔaɪnbaːɐ̯tə/", hint: T("🤝 convenue à l'avance", "🤝 agreed in advance") },
            Kisten: { ph: "/ˈkɪstn̩/", hint: T("🧰 les caisses", "🧰 the crates") },
          },
        },
        questions: [
          {
            q: T("Quand la livraison a-t-elle désormais lieu ?", "When does the delivery now take place?"),
            options: [T("Jeudi à 7 h", "Thursday at 7 am"), T("Vendredi à 7 h", "Friday at 7 am"), T("Jeudi à midi", "Thursday at noon")],
            correct: 0,
            echoHint: T("« …wird auf Donnerstag, 7 Uhr, vorverlegt. »", "« …wird auf Donnerstag, 7 Uhr, vorverlegt. »"),
          },
          {
            q: T("Par où le chauffeur entre-t-il ?", "Which entrance does the driver use?"),
            options: [T("L'entrée principale", "The main entrance"), T("L'entrée arrière de l'entrepôt de Spandau", "The rear entrance of the Spandau warehouse"), T("Le quai de Kreuzberg", "The Kreuzberg dock")],
            correct: 1,
            echoHint: T("« Hintereingang des Lagers in Spandau ».", "« Hintereingang des Lagers in Spandau »."),
          },
          {
            q: T("Qui peut signer le registre de réception ?", "Who may sign the receiving log?"),
            options: [T("N'importe quel employé", "Any employee"), T("Le chauffeur", "The driver"), T("Mme Krüger uniquement", "Mrs Krüger only")],
            correct: 2,
            echoHint: T("« …darf nur Frau Krüger das Empfangsbuch unterschreiben. »", "« …darf nur Frau Krüger das Empfangsbuch unterschreiben. »"),
          },
          {
            q: T("Quelle est la couverture officielle des caisses ?", "What is the agreed cover story for the crates?"),
            options: [T("Des brochures pour Lisbonne", "Brochures for Lisbon"), T("Des archives comptables", "Accounting archives"), T("Du matériel pour Munich", "Equipment for Munich")],
            correct: 0,
            echoHint: T("« Die vereinbarte Antwort » ferme la note.", "« Die vereinbarte Antwort » closes the memo."),
          },
        ],
        cultural: {
          title: "Mit freundlichen Grüßen",
          text: T(
            "LA formule de clôture des emails allemands — si standard qu'on l'abrège « MfG ». Trop familier (« LG ») dans un contexte formel marque immédiatement l'étranger.",
            "THE German email sign-off — so standard it's abbreviated « MfG ». Too casual (« LG ») in a formal context instantly marks the outsider."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "vocab",
          id: "intel-vocab-buero-de",
          lemma: "AKTE BERLIN",
          phonetics: T("registre professionnel · écrit", "professional register · written"),
          tag: T("COMPRÉHENSION ÉCRITE — NOTE FORMELLE", "READING COMPREHENSION — FORMAL MEMO"),
          speakText: "Die Lieferung wird auf Donnerstag vorverlegt. Nur Frau Krüger unterschreibt.",
          flashback: T(
            "Neukölln, 3 h du matin. L'écran clignote : « ABFANGEN ERFOLGREICH ». Quelque part à Spandau, un entrepôt change ses horaires…",
            "Neukölln, 3 am. The screen blinks: « ABFANGEN ERFOLGREICH ». Somewhere in Spandau, a warehouse changes its schedule…"
          ),
          entries: [
            { en: "die Lieferung", note: T("La livraison.", "The delivery.") },
            { en: "das Lager", note: T("L'entrepôt.", "The warehouse.") },
            { en: "der Hintereingang", note: T("L'entrée arrière.", "The rear entrance.") },
            { en: "unterschreiben", note: T("Signer (verbe inséparable ici).", "To sign.") },
            { en: "die vereinbarte Antwort", note: T("La réponse convenue — la couverture.", "The agreed answer — the cover story.") },
            { en: "Mit freundlichen Grüßen", note: T("Formule de clôture standard (« MfG »).", "Standard sign-off (« MfG »).") },
          ],
          examples: ["Die Lieferung wird vorverlegt.", "Niemand sonst berührt die Unterlagen.", "Mit freundlichen Grüßen, K. Brandt."],
        },
      },

      // ============================================================
      // DE-BER-004 — LA NÉGOCIATION — Mauerpark
      // ============================================================
      {
        id: "DE-BER-004",
        type: "negociation",
        typeName: T("La Négociation", "The Negotiation"),
        icon: "🤝",
        title: "Operation FLOHMARKT",
        subtitle: T("Retourner l'informatrice Krüger", "Turn the informant Krüger"),
        location: "Mauerpark Flohmarkt · Prenzlauer Berg",
        difficulty: 3,
        durationMin: 14,
        xpBase: 140,
        brief: {
          narrative: T(
            "Frau Krüger — la seule signature autorisée de Spandau — tient un stand de vinyles au marché aux puces du Mauerpark le dimanche. Elle parlera, si votre allemand inspire confiance.",
            "Frau Krüger — Spandau's only authorised signature — runs a vinyl stand at the Mauerpark flea market on Sundays. She'll talk, if your German inspires trust."
          ),
          context: T(
            "Chaque phrase doit être irréprochable — et le verbe à sa place. Un participe égaré, et elle remballe.",
            "Every sentence must be flawless — and the verb in its place. One stray participle, and she packs up."
          ),
          intelPreview: T("GRAMMAIRE : [██████████]", "GRAMMAR: [██████████]"),
          echo: T("En allemand, la position du verbe est votre crédibilité. Le participe attend la fin.", "In German, verb position is your credibility. The participle waits for the end."),
        },
        scene: {
          name: "Mauerpark — Flohmarkt",
          ambiance: "market",
          props: [
            { e: "💿", x: 14, y: 50 }, { e: "🎸", x: 34, y: 56 }, { e: "🧥", x: 80, y: 52 },
            { e: "🌳", x: 90, y: 20, size: 44 }, { e: "📦", x: 56, y: 62 },
          ],
        },
        rounds: [
          {
            npcLine: "Beweisen Sie, dass Sie vom Institut kommen. Warum sollte ich mit Ihnen reden?",
            targetL1: T("« Nous avons les documents. »", "“We have the documents.”"),
            solution: ["Wir", "haben", "die Dokumente"],
            bank: [
              { w: "Wir", cat: "subject" }, { w: "Sie", cat: "subject" },
              { w: "haben", cat: "verb" }, { w: "hat", cat: "verb" }, { w: "habt", cat: "verb" },
              { w: "die Dokumente", cat: "comp" }, { w: "gestern", cat: "mod" },
            ],
            okReaction: T("Elle redresse un vinyle, l'air de rien. « Weiter. »", "She straightens a record, casually. « Weiter. »"),
            echoHint: T("WIR → haben. HAT = il/elle ; HABT = vous (pluriel familier).", "WIR → haben. HAT = he/she; HABT = you (plural informal)."),
          },
          {
            npcLine: "Wurden Sie verfolgt? Wo waren Sie gestern Abend?",
            targetL1: T("« J'ai mangé au marché hier. » (le participe à la fin !)", "“I ate at the market yesterday.” (participle at the end!)"),
            solution: ["Ich", "habe", "gestern im Markt", "gegessen"],
            bank: [
              { w: "Ich", cat: "subject" }, { w: "Er", cat: "subject" },
              { w: "habe", cat: "verb" }, { w: "hat", cat: "verb" },
              { w: "gestern im Markt", cat: "comp" },
              { w: "gegessen", cat: "verb" }, { w: "esse", cat: "verb" },
            ],
            okReaction: T("Le participe est tombé pile en fin de phrase. Ses épaules se relâchent.", "The participle landed exactly at the end. Her shoulders ease."),
            echoHint: T("Perfekt : HABE en 2ᵉ position… GEGESSEN tout au bout. La pince verbale allemande.", "Perfekt: HABE in 2nd position… GEGESSEN at the very end. The German verb bracket."),
          },
          {
            npcLine: "Da drüben steht eine Frau am Plattenstand. Kennen Sie die?",
            targetL1: T("« Elle travaille pour Babel Corp. »", "“She works for Babel Corp.”"),
            solution: ["Sie", "arbeitet", "für Babel Corp"],
            bank: [
              { w: "Sie", cat: "subject" }, { w: "Wir", cat: "subject" },
              { w: "arbeitet", cat: "verb" }, { w: "arbeite", cat: "verb" }, { w: "arbeiten", cat: "verb" },
              { w: "für Babel Corp", cat: "comp" }, { w: "immer", cat: "mod" },
            ],
            okReaction: T("« Dann haben wir wenig Zeit. » Elle glisse un carnet entre deux pochettes.", "« Dann haben wir wenig Zeit. » She slips a notebook between two sleeves."),
            echoHint: T("SIE (elle) → arbeitet, avec -ET. ARBEITEN = ils / vouvoiement.", "SIE (she) → arbeitet, with -ET. ARBEITEN = they / formal you."),
          },
          {
            npcLine: "Wenn ich Ihnen dieses Heft gebe… was passiert dann mit mir?",
            targetL1: T("« Si vous nous aidez, nous vous protégerons. »", "“If you help us, we will protect you.”"),
            solution: ["Wenn", "Sie uns helfen", "schützen wir Sie"],
            bank: [
              { w: "Wenn", cat: "conn" }, { w: "Weil", cat: "conn" },
              { w: "Sie uns helfen", cat: "verb" }, { w: "Sie uns hilft", cat: "verb" },
              { w: "schützen wir Sie", cat: "verb" }, { w: "wir Sie schützen", cat: "verb" },
            ],
            okReaction: T("Un long silence. Puis le carnet glisse dans votre sac, sous un vinyle de Nina Hagen.", "A long silence. Then the notebook slides into your bag, under a Nina Hagen record."),
            echoHint: T("Après la subordonnée en WENN, le verbe ouvre la principale : « …, schützen wir Sie ». L'inversion est la clé.", "After the WENN clause, the verb opens the main clause: « …, schützen wir Sie ». The inversion is the key."),
          },
        ],
        cultural: {
          title: "Mauerpark",
          text: T(
            "Construit sur l'ancien no man's land du Mur, le Mauerpark accueille chaque dimanche puces et karaoké géant. Marchander y est admis — mais avec le sourire, jamais à l'usure.",
            "Built on the Wall's former no man's land, Mauerpark hosts a flea market and giant karaoke every Sunday. Haggling is fine — with a smile, never by attrition."
          ),
          xp: 20,
        },
        intelCard: {
          kind: "grammar",
          id: "intel-grammar-de-structure",
          lemma: "SATZMOTOR",
          phonetics: T("Le verbe en 2ᵉ position — toujours", "The verb in 2nd position — always"),
          tag: T("GRAMMAIRE OPÉRATIONNELLE", "OPERATIONAL GRAMMAR"),
          speakText: "Wenn Sie uns helfen, schützen wir Sie.",
          flashback: T(
            "Mauerpark, dimanche. Un karaoké hurle au loin. Krüger pèse la position de chacun de vos verbes. À la quatrième phrase, le carnet change de mains…",
            "Mauerpark, Sunday. Karaoke roars in the distance. Krüger weighs the position of your every verb. At the fourth sentence, the notebook changes hands…"
          ),
          table: [
            { label: "V2", value: T("Le verbe conjugué en 2ᵉ position :\nIch habe… · Gestern habe ich…", "The conjugated verb in 2nd position:\nIch habe… · Gestern habe ich…") },
            { label: T("PINCE VERBALE", "VERB BRACKET"), value: "habe … gegessen\nwird … essen" },
            { label: "WENN-SATZ", value: T("Subordonnée : verbe à la fin,\npuis inversion : …, schützen wir Sie", "Sub-clause: verb at the end,\nthen inversion: …, schützen wir Sie") },
            { label: "PRÄSENS", value: "-e · -st · -t\narbeite · arbeitest · arbeitet" },
          ],
          examples: ["Wir haben die Dokumente.", "Ich habe gestern im Markt gegessen.", "Wenn Sie uns helfen, schützen wir Sie."],
          quiz: [
            { q: "« Sie ____ für Babel Corp. »", options: ["arbeite", "arbeitet", "arbeitest"], a: 1 },
            { q: T("« Ich habe gestern im Markt ____. »", "« Ich habe gestern im Markt ____. »"), options: ["esse", "aß", "gegessen"], a: 2 },
          ],
        },
      },
    ],

    dailyFallback: [
      { q: { fr: "« Du ____ immer dasselbe. » (ESSEN)", en: "« Du ____ immer dasselbe. » (ESSEN)" }, options: ["esse", "isst", "essen"], correct: 1 },
      { q: { fr: "Quel est le participe passé de ESSEN ?", en: "What is the past participle of ESSEN?" }, options: ["gegessen", "geessen", "aßen"], correct: 0 },
      { q: { fr: "« Feierabend » signifie…", en: "« Feierabend » means…" }, options: [{ fr: "La fin de la journée de travail", en: "The end of the workday" }, { fr: "Un jour férié", en: "A public holiday" }, { fr: "Une fête d'anniversaire", en: "A birthday party" }], correct: 0 },
      { q: { fr: "Que fait-on d'une bouteille avec Pfand ?", en: "What do you do with a Pfand bottle?" }, options: [{ fr: "On la rapporte", en: "Return it" }, { fr: "On la jette", en: "Throw it away" }, { fr: "On la casse", en: "Smash it" }], correct: 0 },
      { q: { fr: "« Sie ____ für Babel Corp. » (elle)", en: "« Sie ____ für Babel Corp. » (she)" }, options: ["arbeiten", "arbeitet", "arbeite"], correct: 1 },
    ],
  };
};
