/**
 * THE CODEX — Validation CI : syntaxe de tous les fichiers JS
 * + intégrité du schéma de contenu des arcs (GDD §13.3).
 * Zéro dépendance — exécuté par `npm test`.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
let failures = 0;

function fail(msg) {
  failures += 1;
  console.error(`  ✗ ${msg}`);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

// ---------- 1. Vérification de syntaxe (node --check) ----------
console.log("\n[1/4] Syntaxe JavaScript");
function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(p));
    else if (entry.name.endsWith(".js")) files.push(p);
  }
  return files;
}

const jsFiles = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "scripts"))];
for (const f of jsFiles) {
  const res = spawnSync(process.execPath, ["--check", f], { encoding: "utf8" });
  if (res.status !== 0) fail(`${path.relative(ROOT, f)} : ${res.stderr.trim()}`);
}
if (failures === 0) ok(`${jsFiles.length} fichiers JS valides`);

// ---------- 2. Chargement du contenu ----------
console.log("\n[2/4] Chargement des données");
global.window = global; // le contenu cible le renderer
require(path.join(ROOT, "src", "renderer", "js", "data", "content-core.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "content-en.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "content-fr.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "content-es.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "content-de.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "kb-en.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "kb-fr.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "kb-es.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "kb-de.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "vocab-en.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "vocab-fr.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "vocab-es.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "vocab-de.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "exams-en.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "exams-fr.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "exams-es.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "exams-de.js"));
require(path.join(ROOT, "src", "renderer", "assets", "lottie", "lottie-data.js"));
const Codex = global.Codex;
const C = Codex.CONTENT;

if (C.levels.length !== 5) fail("Il faut exactement 5 niveaux d'agent (GDD §10.2)");
if (C.countries.length !== 10) fail("Il faut 10 pays Phase 1 (GDD §3.2)");
for (const country of C.countries) {
  if (country.arcId && !Codex.ARCS[country.arcId] && !Codex.ARC_FACTORIES[country.arcId]) {
    fail(`Pays ${country.id} : arc inconnu ${country.arcId}`);
  }
  if (typeof country.lat !== "number" || typeof country.lon !== "number" ||
      Math.abs(country.lat) > 90 || Math.abs(country.lon) > 180) {
    fail(`Pays ${country.id} : lat/lon invalides (globe 3D)`);
  }
}

// Arcs à valider : statiques + fabriques bilingues construites dans LES DEUX L1
const arcsToValidate = [...Object.values(Codex.ARCS)];
for (const id of Object.keys(Codex.ARC_FACTORIES)) {
  for (const l1 of ["fr", "en"]) arcsToValidate.push(Codex.getArc(id, l1));
}
const arcIds = [...Object.keys(Codex.ARCS), ...Object.keys(Codex.ARC_FACTORIES)];
ok(`${arcIds.length} arcs chargés : ${arcIds.join(", ")} (fabriques validées en fr + en)`);

// ---------- 2 bis. Base de connaissances (chatbot ECHO) ----------
console.log("\n[3/4] Base de connaissances ECHO");
for (const arcId of arcIds) {
  const kb = Codex.KB[arcId];
  if (!kb) { fail(`KB manquante pour l'arc ${arcId}`); continue; }
  const minVerbs = Codex.ARC_FACTORIES[arcId] ? 20 : 30;
  if (!Array.isArray(kb.verbs) || kb.verbs.length < minVerbs) fail(`KB ${arcId} : moins de ${minVerbs} verbes`);
  if (!Array.isArray(kb.grammar) || kb.grammar.length < 10) fail(`KB ${arcId} : moins de 10 fiches grammaire`);
  if (!Array.isArray(kb.phrasebook) || kb.phrasebook.length < 15) fail(`KB ${arcId} : moins de 15 phrases`);
  if (!Array.isArray(kb.culture) || kb.culture.length < 6) fail(`KB ${arcId} : moins de 6 dossiers culturels`);

  const seen = new Set();
  for (const v of kb.verbs) {
    if (seen.has(v.inf)) fail(`KB ${arcId} : verbe dupliqué « ${v.inf} »`);
    seen.add(v.inf);
    if (arcId === "en-UK") {
      for (const k of ["inf", "third", "ger", "past", "pp", "fr", "ex"]) {
        if (!v[k]) fail(`KB ${arcId} / ${v.inf} : champ manquant « ${k} »`);
      }
    } else if (arcId === "fr-FR") {
      if (!Array.isArray(v.present) || v.present.length !== 6) fail(`KB ${arcId} / ${v.inf} : 6 formes au présent requises`);
      if (!["avoir", "être"].includes(v.aux)) fail(`KB ${arcId} / ${v.inf} : auxiliaire invalide`);
      for (const k of ["pc", "futur", "imparfait", "en", "ex", "group"]) {
        if (!v[k]) fail(`KB ${arcId} / ${v.inf} : champ manquant « ${k} »`);
      }
    } else {
      // Schéma générique (es-ES, de-DE) : forms [label, valeur] + search
      if (!Array.isArray(v.forms) || v.forms.length < 3) fail(`KB ${arcId} / ${v.inf} : moins de 3 lignes de formes`);
      for (const row of v.forms || []) {
        if (!Array.isArray(row) || row.length !== 2 || !row[0] || !row[1]) fail(`KB ${arcId} / ${v.inf} : ligne de forme invalide`);
      }
      if (!Array.isArray(v.search) || v.search.length < 5) fail(`KB ${arcId} / ${v.inf} : formes de recherche insuffisantes`);
      if (!v.gloss || !v.gloss.fr || !v.gloss.en) fail(`KB ${arcId} / ${v.inf} : gloss bilingue {fr,en} requis`);
      if (!v.ex) fail(`KB ${arcId} / ${v.inf} : exemple manquant`);
    }
  }

  // Champs bilingues : si objet, doit contenir fr ET en
  function biOk(x) { return typeof x === "string" || (x && typeof x.fr === "string" && typeof x.en === "string"); }
  for (const g of kb.grammar) {
    if (!g.id || !biOk(g.title) || !biOk(g.body) || !g.ex || !Array.isArray(g.keywords)) fail(`KB ${arcId} : fiche grammaire incomplète (${g.id || "?"})`);
  }
  for (const p of kb.phrasebook) {
    if (!p.phrase || !biOk(p.note) || !p.theme) fail(`KB ${arcId} : entrée phrasebook incomplète`);
  }
  for (const c of kb.culture || []) {
    if (!biOk(c.title) || !biOk(c.text)) fail(`KB ${arcId} : dossier culturel incomplet`);
  }
  ok(`KB ${arcId} : ${kb.verbs.length} verbes, ${kb.grammar.length} grammaire, ${kb.phrasebook.length} phrases, ${kb.culture.length} culture`);
}

// ---------- 3 bis. Bibliothèque des mots + Examens Blancs ----------
for (const arcId of arcIds) {
  const bank = Codex.VOCAB[arcId];
  if (!bank || !Array.isArray(bank.themes) || bank.themes.length < 6) {
    fail(`VOCAB ${arcId} : moins de 6 thèmes`);
    continue;
  }
  let words = 0;
  const seenWords = new Set();
  for (const theme of bank.themes) {
    if (!theme.id || !theme.name || !theme.name.fr || !theme.name.en) fail(`VOCAB ${arcId} : thème sans nom bilingue`);
    if (!Array.isArray(theme.words) || theme.words.length < 8) fail(`VOCAB ${arcId} / ${theme.id} : moins de 8 mots`);
    for (const w of theme.words || []) {
      if (!w.w || !w.g || !w.g.fr || !w.g.en) fail(`VOCAB ${arcId} / ${theme.id} : entrée sans gloss bilingue (${w.w || "?"})`);
      if (seenWords.has(w.w)) fail(`VOCAB ${arcId} : mot dupliqué « ${w.w} »`);
      seenWords.add(w.w);
      words += 1;
    }
  }
  ok(`VOCAB ${arcId} : ${bank.themes.length} thèmes, ${words} mots`);

  const exam = Codex.EXAMS[arcId];
  if (!exam) { fail(`EXAMS ${arcId} : examen blanc manquant`); continue; }
  if (!exam.name || !exam.style || !exam.scale || !exam.durationMin) fail(`EXAMS ${arcId} : métadonnées incomplètes`);
  let qTotal = 0;
  for (const s of exam.sections || []) {
    if (!s.kind || !s.name || !s.name.fr || !s.name.en || !s.intro) fail(`EXAMS ${arcId} : section incomplète`);
    for (const [i, q] of (s.questions || []).entries()) {
      qTotal += 1;
      if (!Array.isArray(q.options) || q.options.length !== 4) fail(`EXAMS ${arcId} / ${s.kind} ${i + 1} : il faut 4 options`);
      if (q.correct === undefined || !q.options[q.correct]) fail(`EXAMS ${arcId} / ${s.kind} ${i + 1} : index de réponse invalide`);
      if (s.kind === "listening" && !q.tts) fail(`EXAMS ${arcId} / ${s.kind} ${i + 1} : énoncé audio (tts) manquant`);
      if (s.kind !== "listening" && !q.q) fail(`EXAMS ${arcId} / ${s.kind} ${i + 1} : énoncé manquant`);
    }
    if (s.kind === "reading" && !s.passage) fail(`EXAMS ${arcId} / reading : passage manquant`);
  }
  if (qTotal < 18) fail(`EXAMS ${arcId} : moins de 18 questions (${qTotal})`);
  ok(`EXAMS ${arcId} : « ${exam.name} », ${qTotal} questions, ${exam.sections.length} sections`);
}

// Animations Lottie embarquées : structure de base
for (const name of ["radar", "check"]) {
  const a = Codex.LOTTIE && Codex.LOTTIE[name];
  if (!a || !Array.isArray(a.layers) || !a.layers.length || !a.w || !a.h || a.op <= a.ip) {
    fail(`Animation Lottie « ${name} » invalide`);
  }
}
ok("2 animations Lottie embarquées valides");

// ---------- 4. Schéma des missions ----------
console.log("\n[4/4] Schéma de contenu des missions");

function checkPercee(label, content) {
  if (!Array.isArray(content.fragments) || content.fragments.length < 2 || content.fragments.length > 6) {
    fail(`${label} : nombre de fragments invalide`);
    return;
  }
  const seen = new Set();
  for (const f of content.fragments) {
    if (seen.has(f.id)) fail(`${label} : fragment id dupliqué ${f.id}`);
    seen.add(f.id);
    for (const k of ["id", "icon", "label", "sceneText", "intel", "rule", "echo"]) {
      if (!f[k]) fail(`${label} / ${f.id || "?"} : champ fragment manquant « ${k} »`);
    }
    if (typeof f.x !== "number" || f.x < 0 || f.x > 100 || typeof f.y !== "number" || f.y < 0 || f.y > 100) {
      fail(`${label} / ${f.id} : position hors écran (x/y en %)`);
    }
  }
}

function checkInfiltration(label, content) {
  if (!Array.isArray(content.interactions) || content.interactions.length < 2) {
    fail(`${label} : interactions manquantes`);
    return;
  }
  for (const [i, inter] of content.interactions.entries()) {
    const correct = (inter.choices || []).filter((c) => c.correct);
    if (correct.length !== 1) fail(`${label} / interaction ${i + 1} : il faut exactement 1 choix correct`);
    if (!inter.echoHint) fail(`${label} / interaction ${i + 1} : echoHint manquant`);
    for (const ch of inter.choices) {
      if (!ch.correct && typeof ch.suspicion !== "number") {
        fail(`${label} / interaction ${i + 1} : choix incorrect sans valeur de suspicion`);
      }
    }
  }
}

function checkNegociation(label, content) {
  if (!Array.isArray(content.rounds) || content.rounds.length < 1) {
    fail(`${label} : rounds manquants`);
    return;
  }
  for (const [i, round] of content.rounds.entries()) {
    const bankWords = new Set((round.bank || []).map((b) => b.w));
    if (bankWords.size !== (round.bank || []).length) fail(`${label} / round ${i + 1} : mots dupliqués dans la banque`);
    for (const w of round.solution || []) {
      if (!bankWords.has(w)) fail(`${label} / round ${i + 1} : mot de solution absent de la banque : « ${w} »`);
    }
    const validCats = new Set(["subject", "verb", "comp", "conn", "mod"]);
    for (const b of round.bank || []) {
      if (!validCats.has(b.cat)) fail(`${label} / round ${i + 1} : catégorie inconnue « ${b.cat} »`);
    }
    if (!round.echoHint || !round.okReaction) fail(`${label} / round ${i + 1} : echoHint/okReaction manquant`);
  }
}

function checkSurveillance(label, mission) {
  const doc = mission.document;
  if (!doc || !Array.isArray(doc.paragraphs) || doc.paragraphs.length === 0) {
    fail(`${label} : document manquant`);
    return;
  }
  const fullText = doc.paragraphs.join(" ").toLowerCase();
  for (const key of Object.keys(doc.glossary || {})) {
    if (!fullText.includes(key.toLowerCase())) fail(`${label} : entrée de glossaire introuvable dans le texte : « ${key} »`);
  }
  for (const [i, q] of (mission.questions || []).entries()) {
    if (!Array.isArray(q.options) || q.correct === undefined || !q.options[q.correct]) {
      fail(`${label} / question ${i + 1} : index de réponse invalide`);
    }
    if (!q.echoHint) fail(`${label} / question ${i + 1} : echoHint manquant`);
  }
}

// Unicité inter-arcs : un même id ne peut appartenir qu'à un seul arc
// (les fabriques bilingues produisent légitimement deux fois les mêmes ids).
const missionIdOwner = new Map();
const intelIdOwner = new Map();
function claim(map, id, owner, what) {
  if (map.has(id) && map.get(id) !== owner) fail(`${id} : ${what} dupliqué entre ${map.get(id)} et ${owner}`);
  map.set(id, owner);
}

let missionsChecked = 0;
for (const arc of arcsToValidate) {
  if (!arc.l1 || !["fr", "en"].includes(arc.l1)) fail(`Arc ${arc.id} : l1 invalide`);
  if (!arc.language || !arc.language.tts) fail(`Arc ${arc.id} : language.tts manquant`);
  if (!arc.zone || !arc.zone.name) fail(`Arc ${arc.id} : zone manquante`);
  for (const pool of ["hq", "success", "perfect", "warning", "urgent"]) {
    if (!arc.echo || !Array.isArray(arc.echo[pool]) || arc.echo[pool].length === 0) {
      fail(`Arc ${arc.id} : pool ECHO manquant « ${pool} »`);
    }
  }
  if (!Array.isArray(arc.dailyFallback) || arc.dailyFallback.length < 3) fail(`Arc ${arc.id} : dailyFallback insuffisant`);
  for (const [i, q] of (arc.dailyFallback || []).entries()) {
    if (!q.options || !q.options[q.correct]) fail(`Arc ${arc.id} / dailyFallback ${i + 1} : réponse invalide`);
  }

  for (const m of arc.missions) {
    const label = m.id;
    claim(missionIdOwner, m.id, arc.id, "id de mission");
    missionsChecked += 1;

    for (const k of ["type", "title", "location", "difficulty", "durationMin", "xpBase", "brief", "intelCard", "icon", "typeName", "subtitle"]) {
      if (m[k] === undefined) fail(`${label} : champ mission manquant « ${k} »`);
    }
    for (const k of ["narrative", "context", "intelPreview", "echo"]) {
      if (!m.brief || !m.brief[k]) fail(`${label} : champ brief manquant « ${k} »`);
    }
    if (m.intelCard) {
      claim(intelIdOwner, m.intelCard.id, arc.id, "id d'intel");
      if (!["verb", "vocab", "grammar"].includes(m.intelCard.kind)) fail(`${label} : intelCard.kind invalide`);
      if (Array.isArray(m.intelCard.quiz)) {
        for (const [i, q] of m.intelCard.quiz.entries()) {
          if (!q.options || q.options[q.a] === undefined) fail(`${label} / quiz ${i + 1} : index de réponse invalide`);
        }
      }
    }

    if (m.type === "percee") checkPercee(label, m);
    else if (m.type === "infiltration") checkInfiltration(label, m);
    else if (m.type === "negociation") checkNegociation(label, m);
    else if (m.type === "surveillance") checkSurveillance(label, m);
    else if (m.type === "extraction") {
      if (!Array.isArray(m.phases) || m.phases.length < 2) fail(`${label} : phases boss manquantes`);
      for (const phase of m.phases || []) {
        const plabel = `${label} / ${phase.title}`;
        if (phase.kind === "percee") checkPercee(plabel, phase);
        else if (phase.kind === "infiltration") checkInfiltration(plabel, phase);
        else if (phase.kind === "negociation") checkNegociation(plabel, phase);
        else fail(`${plabel} : kind de phase inconnu « ${phase.kind} »`);
      }
      if (!m.endings || !m.endings.perfect || !m.endings.bad) fail(`${label} : fins de boss manquantes`);
    } else {
      fail(`${label} : type de mission inconnu « ${m.type} »`);
    }
  }
}

if (failures === 0) {
  ok(`${missionIdOwner.size} missions uniques (${missionsChecked} instances validées), ${intelIdOwner.size} cartes intel, ${C.medals.length} médailles`);
  console.log("\nVALIDATION RÉUSSIE ✓\n");
} else {
  console.error(`\nVALIDATION ÉCHOUÉE — ${failures} erreur(s)\n`);
  process.exit(1);
}
