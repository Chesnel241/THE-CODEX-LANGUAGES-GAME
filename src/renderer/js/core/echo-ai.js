/**
 * THE CODEX — ECHO AI : chatbot hors-ligne maîtrisant toute la base
 * de connaissances du jeu (verbes, grammaire, phrasebook, culture,
 * cartes intel acquises, règles du jeu).
 *
 * Pipeline : normalisation → détection d'intention (conjugaison,
 * traduction, aide de jeu) → recherche floue Fuse.js sur l'index →
 * mise en forme dans la voix d'ECHO. Conjugaison anglaise à la volée
 * via compromise (NLP) pour les verbes hors base.
 *
 * Sécurité : aucun réseau, aucune éval — pur traitement de chaînes ;
 * tout affichage passe par textContent côté UI.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  let fuse = null;
  let indexLang = null;
  let entries = [];

  // ---------- Utilitaires ----------
  function norm(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[«»"“”!?,;:.()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Mots vides retirés avant la recherche floue (pas avant la détection de verbe)
  const STOPWORDS = new Set([
    // fr
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux", "et", "ou", "que", "qui", "quoi",
    "quel", "quelle", "quels", "quelles", "cest", "c'est", "comment", "pourquoi", "quand", "est", "sont",
    "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "on", "pour", "dans", "sur", "avec",
    "sans", "par", "tres", "ne", "pas", "si", "ca", "se", "en", "moi", "donne",
    // en
    "the", "a", "an", "of", "in", "on", "at", "to", "for", "with", "how", "what", "which", "who",
    "whom", "when", "where", "why", "is", "are", "was", "were", "do", "does", "did", "can", "could",
    "would", "should", "i", "you", "he", "she", "we", "they", "it", "my", "your", "me", "us", "them",
    "this", "that", "please", "about", "tell",
  ]);

  function stripStopwords(nq) {
    const kept = nq.split(" ").filter((w) => w && !STOPWORDS.has(w));
    return kept.join(" ");
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /** Résout un champ bilingue {fr, en} dans la langue d'interface. */
  function R(x) {
    if (x && typeof x === "object" && !Array.isArray(x)) return x[Codex.i18n.get()] ?? x.fr ?? x.en;
    return x;
  }

  function voice() {
    const fr = Codex.i18n.get() === "fr";
    return {
      lead: fr
        ? ["Analyse terminée.", "Intel localisée.", "Décodage immédiat, Agent.", "Voici ce que l'Institut sait.", "Archives consultées."]
        : ["Analysis complete.", "Intel located.", "Decoding now, Agent.", "Here is what the Institute knows.", "Archives consulted."],
      fallback: fr
        ? ["Cette information n'est pas dans mes archives. Reformulez, ou essayez l'une des pistes ci-dessous.",
           "Signal trop faible, Agent. Précisez votre requête — un verbe, une règle, une expression."]
        : ["That information is not in my archives. Rephrase, or try one of the leads below.",
           "Signal too weak, Agent. Be more specific — a verb, a rule, an expression."],
      gameHint: fr ? "Demandez-moi aussi : un verbe à conjuguer, une règle de grammaire, un fait culturel." : "You can also ask me: a verb to conjugate, a grammar rule, a cultural fact.",
    };
  }

  function L(keyFr, keyEn) { return Codex.i18n.get() === "fr" ? keyFr : keyEn; }

  // ---------- Construction de l'index ----------
  function buildIndex() {
    const arc = Codex.arc();
    const kb = Codex.KB[arc.id] || {};
    entries = [];

    // Verbes — trois schémas : anglais (past/pp), français (present[]/pc),
    // générique espagnol/allemand (forms/search)
    (kb.verbs || []).forEach((v) => {
      let forms;
      if (v.search) forms = v.search;
      else if (v.past) forms = [v.inf, v.past, v.pp, v.third, v.ger];
      else forms = [v.inf, ...(v.present || []), v.pc, v.futur].map((f) => (f || "").replace(/^j'|^je |^tu |^il\/elle |^nous |^vous |^ils\/elles /, ""));
      entries.push({
        type: "verb", title: v.inf,
        text: forms.filter(Boolean).join(" ") + " " + (R(v.gloss) || v.fr || v.en || ""),
        keywords: forms.filter(Boolean),
        payload: v,
      });
    });

    // Grammaire
    (kb.grammar || []).forEach((g) => entries.push({
      type: "grammar", title: R(g.title), text: R(g.body), keywords: g.keywords || [], payload: g,
    }));

    // Phrasebook (kw = alias bilingues optionnels)
    (kb.phrasebook || []).forEach((p) => entries.push({
      type: "phrase", title: p.phrase, text: R(p.note) + " " + p.theme, keywords: [p.theme, ...(p.kw || [])], payload: p,
    }));

    // Culture
    (kb.culture || []).forEach((c) => entries.push({
      type: "culture", title: R(c.title), text: R(c.text), keywords: [], payload: c,
    }));

    // Cartes intel des missions de l'arc (briefs + exemples)
    arc.missions.forEach((m) => {
      const card = m.intelCard;
      entries.push({
        type: "intel", title: card.lemma,
        text: [card.tag, ...(card.examples || []), ...((card.entries || []).map((e) => e.en + " " + e.note))].join(" "),
        keywords: [m.title, m.typeName],
        payload: { card, mission: m },
      });
    });

    // Aide de jeu (localisée selon la L1 du joueur)
    const help = Codex.i18n.get() === "fr" ? HELP_FR : HELP_EN;
    help.forEach((h) => entries.push({ type: "help", title: h.title, text: h.body, keywords: h.keywords, payload: h }));

    // Champs de recherche normalisés (sans accents) : la requête l'est aussi,
    // sinon « etre » ne retrouverait jamais « être ».
    for (const e of entries) {
      e.ntitle = norm(e.title);
      e.nkeywords = (e.keywords || []).map(norm);
      e.ntext = norm(e.text);
    }

    fuse = new window.Fuse(entries, {
      keys: [
        { name: "ntitle", weight: 0.45 },
        { name: "nkeywords", weight: 0.35 },
        { name: "ntext", weight: 0.2 },
      ],
      includeScore: true,
      threshold: 0.42,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
    indexLang = arc.id + ":" + Codex.i18n.get();
  }

  function ensureIndex() {
    const want = Codex.arc().id + ":" + Codex.i18n.get();
    if (!fuse || indexLang !== want) buildIndex();
  }

  /**
   * Recherche par jeton avec agrégation : Fuse (Bitap) note mal les
   * requêtes multi-mots entières (« mind gap » vs « mind the gap »
   * dépasse le budget d'erreurs). On cherche donc chaque jeton et on
   * cumule les gains par entrée — les entrées couvrant le plus de
   * jetons remontent naturellement.
   */
  function searchIndex(cleaned, nq) {
    let tokens = [...new Set(cleaned.split(" ").filter((t) => t.length >= 2))].slice(0, 8);
    if (tokens.length === 0 || cleaned.length < 4) {
      tokens = [...new Set(nq.split(" ").filter((t) => t.length >= 2))].slice(0, 8);
    }
    if (!tokens.length) return [];

    const agg = new Map(); // refIndex → { item, gain }
    for (const t of tokens) {
      for (const h of fuse.search(t, { limit: 12 })) {
        const cur = agg.get(h.refIndex) || { item: h.item, gain: 0 };
        cur.gain += Math.max(0, 0.55 - h.score); // bon match ≈ +0.55, match faible ≈ +0
        agg.set(h.refIndex, cur);
      }
    }
    return [...agg.values()]
      .filter((r) => r.gain >= 0.18) // au moins un jeton solidement matché
      .sort((a, b) => b.gain - a.gain);
  }

  // ---------- Aide de jeu ----------
  const HELP_FR = [
    { title: "Gagner de l'XP", keywords: ["xp", "experience", "points", "niveau", "progression"],
      body: "Fragments +15, missions 120–300 XP, mission parfaite +100, sans m'utiliser +50, Cultural Intel +20, Signal quotidien +50. Cinq grades : Recrue → Opérateur → Élite → Fantôme → Légende." },
    { title: "Les médailles", keywords: ["medaille", "medailles", "badge", "accomplissement", "trophee"],
      body: "Six médailles : Premier Contact, Précision (zéro erreur, zéro aide), Fantôme (infiltration sans suspicion), Silence Radio (sans ECHO), Éclair (moins de 50 % du temps estimé), Explorateur (tous les Cultural Intel d'une zone)." },
    { title: "Le Compteur de Suspicion", keywords: ["suspicion", "compteur", "infiltration", "100%", "complication"],
      body: "Chaque mauvaise réponse en Infiltration fait monter la suspicion ; les bonnes la font redescendre. À 100 %, pas de game over : je déclenche la Phase Complication et vous changez d'approche." },
    { title: "Le Coffre-Fort", keywords: ["coffre", "coffre-fort", "vault", "revision", "flashback"],
      body: "Toute intel acquise y est archivée. Les fiches à réviser portent un halo ambre — la répétition espacée travaille pour vous. Lancez-y un Challenge de Révision, ou rejouez les Flashbacks." },
    { title: "Le Signal Quotidien", keywords: ["signal", "quotidien", "daily", "jour"],
      body: "Une micro-mission par jour : cinq vérifications tirées de votre propre Coffre-Fort. +50 XP, jamais de pénalité pour les jours manqués." },
    { title: "Changer de langue", keywords: ["langue", "changer", "theatre", "francais", "anglais", "interface"],
      body: "Sur la carte du QG, cliquez un théâtre d'opérations actif pour basculer. La langue de l'interface se règle dans Paramètres. Chaque langue garde sa propre progression." },
    { title: "Comment jouer", keywords: ["jouer", "aide", "regles", "comment", "mission", "commencer"],
      body: "Depuis le QG, choisissez une mission : Percée (fragments cachés), Infiltration (dialogues sous suspicion), Négociation (construction de phrases), Surveillance (document à décoder). Le boss final teste tout l'arc." },
    { title: "Qui est ECHO ?", keywords: ["echo", "ia", "qui es-tu", "assistant", "oreillette"],
      body: "Votre IA de terrain, dans l'oreillette. Je connais chaque verbe, chaque règle et chaque dossier de l'Institut. Demandez — mais sur le terrain, mes indices sont comptés." },
  ];

  const HELP_EN = [
    { title: "Earning XP", keywords: ["xp", "experience", "points", "level", "progression"],
      body: "Fragments +15, missions 120–300 XP, flawless mission +100, no ECHO +50, Cultural Intel +20, Daily Signal +50. Five ranks: Rookie → Operative → Elite → Ghost → Legend." },
    { title: "Medals", keywords: ["medal", "medals", "badge", "achievement", "trophy"],
      body: "Six medals: First Contact, Precision (zero errors, zero help), Ghost (infiltration without suspicion), Radio Silence (no ECHO), Lightning (under 50% of estimated time), Explorer (all Cultural Intel in a zone)." },
    { title: "The Suspicion meter", keywords: ["suspicion", "meter", "infiltration", "100%", "complication"],
      body: "Each wrong answer in Infiltration raises suspicion; correct ones lower it. At 100%, no game over: I trigger the Complication Phase and you change approach." },
    { title: "The Vault", keywords: ["vault", "review", "flashback", "archive"],
      body: "All acquired intel is archived there. Files due for review glow amber — spaced repetition works for you. Launch a Review Challenge, or replay the Flashbacks." },
    { title: "The Daily Signal", keywords: ["signal", "daily", "day"],
      body: "One micro-mission per day: five checks drawn from your own Vault. +50 XP, and never a penalty for missed days." },
    { title: "Switching language", keywords: ["language", "switch", "theatre", "french", "english", "interface"],
      body: "On the HQ map, click an active theatre of operations to switch. Interface language lives in Settings. Each language keeps its own progression." },
    { title: "How to play", keywords: ["play", "help", "rules", "how", "mission", "start"],
      body: "From HQ, pick a mission: Breach (hidden fragments), Infiltration (dialogue under suspicion), Negotiation (sentence building), Surveillance (document decoding). The final boss tests the whole arc." },
    { title: "Who is ECHO?", keywords: ["echo", "ai", "who are you", "assistant", "earpiece"],
      body: "Your field AI, in the earpiece. I know every verb, rule and dossier in the Institute. Ask away — but in the field, my hints are rationed." },
  ];

  // ---------- Formatage des réponses ----------
  function verbAnswerEN(v) {
    const data = [
      `${v.inf.toUpperCase()} — ${v.fr}`,
      `${L("présent", "present")} : I ${v.inf} · he/she ${v.third}`,
      `${L("passé", "past")} : ${v.past} · ${L("participe", "participle")} : ${v.pp}`,
      `${L("gérondif", "gerund")} : ${v.ger}`,
      `${L("ex.", "e.g.")} ${v.ex}`,
    ].join("\n");
    return { text: pick(voice().lead), data, speak: `${v.inf}, ${v.past}, ${v.pp}. ${v.ex}` };
  }

  /** Verbe au schéma générique (espagnol, allemand…) : forms = [label, valeur]. */
  function verbAnswerGeneric(v) {
    const lines = [`${v.inf.toUpperCase()} — ${R(v.gloss)}`];
    for (const [label, value] of v.forms || []) lines.push(`${label} : ${value}`);
    lines.push(`${L("ex.", "e.g.")} ${v.ex}`);
    return { text: pick(voice().lead), data: lines.join("\n"), speak: v.speak || v.inf };
  }

  function verbAnswer(v) {
    if (v.search) return verbAnswerGeneric(v);
    return Codex.arc().id === "en-UK" ? verbAnswerEN(v) : verbAnswerFR(v);
  }

  function verbAnswerFR(v) {
    const aux = v.aux === "être" ? `${L("auxiliaire", "auxiliary")} ÊTRE ⚠` : `${L("auxiliaire", "auxiliary")} avoir`;
    const data = [
      `${v.inf.toUpperCase()} — ${v.en} (${v.group}, ${aux})`,
      `${L("présent", "present")} : ${v.present.join(" · ")}`,
      `${L("passé composé", "passé composé")} : ${v.pc}`,
      `${L("futur", "future")} : ${v.futur} · ${L("imparfait", "imperfect")} : ${v.imparfait}`,
      `${L("ex.", "e.g.")} ${v.ex}`,
    ].join("\n");
    return { text: pick(voice().lead), data, speak: `${v.inf}. ${v.present[0]}, ${v.present[1]}, ${v.present[2]}. ${v.pc}.` };
  }

  /** Conjugaison anglaise à la volée via compromise, pour les verbes hors base. */
  function conjugateWithNLP(word) {
    try {
      const c = window.nlp(word).verbs().conjugate();
      if (!c || !c.length) return null;
      const f = c[0];
      if (!f.Infinitive) return null;
      const data = [
        `${f.Infinitive.toUpperCase()}`,
        `${L("présent", "present")} : I ${f.Infinitive} · he/she ${f.PresentTense || f.Infinitive + "s"}`,
        `${L("passé", "past")} : ${f.PastTense || "—"}${f.Participle ? ` · ${L("participe", "participle")} : ${f.Participle}` : ""}`,
        `${L("gérondif", "gerund")} : ${f.Gerund || f.Infinitive + "ing"}`,
      ].join("\n");
      return { text: pick(voice().lead), data, speak: `${f.Infinitive}, ${f.PastTense || ""}` };
    } catch { return null; }
  }

  /**
   * Détection de verbe avec scoring : le verbe dont les formes recouvrent
   * le plus de mots de la requête gagne (« je suis allé » → ALLER, pas ÊTRE).
   */
  function findVerb(q) {
    const arc = Codex.arc();
    const kb = Codex.KB[arc.id] || {};
    const nq = norm(q);
    const words = nq.split(" ");
    let best = null;
    let bestScore = 0;

    for (const v of kb.verbs || []) {
      let forms;
      if (v.search) forms = v.search;
      else if (v.past) forms = [v.inf, v.past, v.pp, v.third, v.ger];
      else forms = [v.inf, v.pc, v.futur, v.imparfait, ...(v.present || [])];
      let score = 0;
      for (const f of forms) {
        if (!f) continue;
        const nf = norm(f)
          .replace(/^(j|je|tu|il\/elle|nous|vous|ils\/elles)\s+/, "")
          .replace(/\be\b/g, "") // résidu de « (e) »
          .trim();
        if (!nf) continue;
        if (nq === nf) score = Math.max(score, 100); // requête = la forme exacte
        const parts = nf.split(" ").filter(Boolean);
        const matched = parts.filter((p) => (p.length > 2 || parts.length === 1) && words.includes(p));
        if (matched.length) {
          score = Math.max(score, matched.length * 10 + matched.join("").length);
        }
      }
      if (score > bestScore) { bestScore = score; best = v; }
    }
    return bestScore > 0 ? best : null;
  }

  function entryAnswer(entry) {
    const v = voice();
    switch (entry.type) {
      case "verb":
        return verbAnswer(entry.payload);
      case "grammar":
        return { text: `${pick(v.lead)} ${R(entry.payload.title)}.`, data: `${R(entry.payload.body)}\n${L("ex.", "e.g.")} ${entry.payload.ex}` };
      case "phrase":
        return { text: pick(v.lead), data: `« ${entry.payload.phrase} »\n${R(entry.payload.note)}`, speak: entry.payload.phrase };
      case "culture":
        return { text: `${pick(v.lead)} ${L("Dossier culturel :", "Cultural file:")} ${R(entry.payload.title)}.`, data: R(entry.payload.text) };
      case "intel": {
        const c = entry.payload.card;
        return { text: `${pick(v.lead)} ${L("Archive de mission :", "Mission archive:")} ${entry.payload.mission.title}.`, data: `${c.lemma} — ${c.tag}\n${(c.examples || []).slice(0, 2).join("\n")}`, speak: c.speakText };
      }
      case "help":
        return { text: `${pick(v.lead)} ${entry.payload.title}.`, data: entry.payload.body };
      default:
        return null;
    }
  }

  function suggestions() {
    const arc = Codex.arc();
    const fr = Codex.i18n.get() === "fr";
    switch (arc.id) {
      case "en-UK":
        return fr
          ? ["Conjugue EAT", "Passé de GO", "C'est quoi le present perfect ?", "Comment commander au pub ?", "Comment gagner des médailles ?"]
          : ["Conjugate EAT", "Past of GO", "What is the present perfect?", "How to order at the pub?", "How do I earn XP?"];
      case "fr-FR":
        return fr
          ? ["Conjugue ALLER", "Auxiliaire de VENIR ?", "Tu ou vous ?", "Commander un café", "Comment gagner de l'XP ?"]
          : ["Conjugate ALLER", "Which verbs take être?", "Tu or vous?", "How to order a coffee?", "How do medals work?"];
      case "es-ES":
        return fr
          ? ["Conjugue COMER", "Ser ou estar ?", "Tú ou usted ?", "Commander au bar", "C'est quoi le pretérito ?"]
          : ["Conjugate COMER", "Ser or estar?", "Tú or usted?", "How to order at the bar?", "What is the pretérito?"];
      case "de-DE":
        return fr
          ? ["Conjugue ESSEN", "C'est quoi la pince verbale ?", "Du ou Sie ?", "Haben ou sein ?", "Commander au Späti"]
          : ["Conjugate ESSEN", "What is the verb bracket?", "Du or Sie?", "Haben or sein?", "How to order at the Späti?"];
      default:
        return fr ? ["Comment jouer ?", "Comment gagner de l'XP ?"] : ["How to play?", "How do I earn XP?"];
    }
  }

  // ---------- Point d'entrée ----------
  const CONJ_RE = /\b(conjugue[rz]?|conjugate|conjugaison(?: de)?|le passe de|passe(?: compose)? de|past (?:tense )?of|participe de|participle of|present de|futur de|future of|auxiliaire de|auxiliary of|imparfait de)\b/g;

  function ask(question) {
    ensureIndex();
    const v = voice();
    const q = String(question || "").slice(0, 300); // borne dure
    const nq = norm(q);
    if (!nq) return { text: pick(v.fallback), suggestions: suggestions() };

    const hasConjIntent = CONJ_RE.test(nq);
    CONJ_RE.lastIndex = 0;
    const wordCount = nq.split(" ").length;

    // 1. Intention conjugaison / verbe direct.
    //    Gardé court pour ne pas détourner les vraies questions de grammaire
    //    (« which verbs take être » ne doit pas répondre la fiche ÊTRE).
    if (hasConjIntent || wordCount <= 4) {
      const verb = findVerb(nq.replace(CONJ_RE, " "));
      CONJ_RE.lastIndex = 0;
      if (verb) {
        return { ...verbAnswer(verb), suggestions: suggestions() };
      }
    }

    // 2. Conjugaison anglaise à la volée (verbe hors base)
    if (Codex.arc().id === "en-UK" && hasConjIntent) {
      const m = nq.match(/(?:conjugue[rz]?|conjugate|conjugaison(?: de)?|past (?:tense )?of|passe de|participle of|participe de)\s+([a-z]+)/);
      if (m && !STOPWORDS.has(m[1])) {
        const out = conjugateWithNLP(m[1]);
        if (out) return { ...out, suggestions: suggestions() };
      }
    }

    // 3. Recherche par jeton sur l'index, requête débarrassée des mots vides
    const cleaned = stripStopwords(nq) || nq;
    const hits = searchIndex(cleaned, nq);
    if (hits.length) {
      const best = entryAnswer(hits[0].item);
      if (best) {
        // Pistes connexes (2 max)
        const related = hits.slice(1, 4)
          .filter((h) => h.item.title !== hits[0].item.title)
          .slice(0, 2)
          .map((h) => h.item.title);
        return { ...best, related, suggestions: suggestions() };
      }
    }

    // 4. Repli dans la voix d'ECHO
    return { text: `${pick(v.fallback)} ${v.gameHint}`, suggestions: suggestions() };
  }

  Codex.echoAI = { ask, rebuild: buildIndex, _entriesCount: () => entries.length };
})();
