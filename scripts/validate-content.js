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
require(path.join(ROOT, "src", "renderer", "js", "data", "kb-en.js"));
require(path.join(ROOT, "src", "renderer", "js", "data", "kb-fr.js"));
require(path.join(ROOT, "src", "renderer", "assets", "lottie", "lottie-data.js"));
const Codex = global.Codex;
const C = Codex.CONTENT;

if (C.levels.length !== 5) fail("Il faut exactement 5 niveaux d'agent (GDD §10.2)");
if (C.countries.length !== 10) fail("Il faut 10 pays Phase 1 (GDD §3.2)");
for (const country of C.countries) {
  if (country.arcId && !Codex.ARCS[country.arcId]) fail(`Pays ${country.id} : arc inconnu ${country.arcId}`);
  if (typeof country.lat !== "number" || typeof country.lon !== "number" ||
      Math.abs(country.lat) > 90 || Math.abs(country.lon) > 180) {
    fail(`Pays ${country.id} : lat/lon invalides (globe 3D)`);
  }
}
ok(`${Object.keys(Codex.ARCS).length} arcs chargés : ${Object.keys(Codex.ARCS).join(", ")}`);

// ---------- 2 bis. Base de connaissances (chatbot ECHO) ----------
console.log("\n[3/4] Base de connaissances ECHO");
for (const arcId of Object.keys(Codex.ARCS)) {
  const kb = Codex.KB[arcId];
  if (!kb) { fail(`KB manquante pour l'arc ${arcId}`); continue; }
  if (!Array.isArray(kb.verbs) || kb.verbs.length < 30) fail(`KB ${arcId} : moins de 30 verbes`);
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
    } else {
      if (!Array.isArray(v.present) || v.present.length !== 6) fail(`KB ${arcId} / ${v.inf} : 6 formes au présent requises`);
      if (!["avoir", "être"].includes(v.aux)) fail(`KB ${arcId} / ${v.inf} : auxiliaire invalide`);
      for (const k of ["pc", "futur", "imparfait", "en", "ex", "group"]) {
        if (!v[k]) fail(`KB ${arcId} / ${v.inf} : champ manquant « ${k} »`);
      }
    }
  }
  for (const g of kb.grammar) {
    if (!g.id || !g.title || !g.body || !g.ex || !Array.isArray(g.keywords)) fail(`KB ${arcId} : fiche grammaire incomplète (${g.id || g.title})`);
  }
  for (const p of kb.phrasebook) {
    if (!p.phrase || !p.note || !p.theme) fail(`KB ${arcId} : entrée phrasebook incomplète`);
  }
  ok(`KB ${arcId} : ${kb.verbs.length} verbes, ${kb.grammar.length} grammaire, ${kb.phrasebook.length} phrases, ${kb.culture.length} culture`);
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

const allMissionIds = new Set();
const allIntelIds = new Set();

for (const arc of Object.values(Codex.ARCS)) {
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
    if (allMissionIds.has(m.id)) fail(`${label} : id de mission dupliqué`);
    allMissionIds.add(m.id);

    for (const k of ["type", "title", "location", "difficulty", "durationMin", "xpBase", "brief", "intelCard", "icon", "typeName", "subtitle"]) {
      if (m[k] === undefined) fail(`${label} : champ mission manquant « ${k} »`);
    }
    for (const k of ["narrative", "context", "intelPreview", "echo"]) {
      if (!m.brief || !m.brief[k]) fail(`${label} : champ brief manquant « ${k} »`);
    }
    if (m.intelCard) {
      if (allIntelIds.has(m.intelCard.id)) fail(`${label} : id d'intel dupliqué ${m.intelCard.id}`);
      allIntelIds.add(m.intelCard.id);
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
  ok(`${allMissionIds.size} missions valides, ${allIntelIds.size} cartes intel, ${C.medals.length} médailles`);
  console.log("\nVALIDATION RÉUSSIE ✓\n");
} else {
  console.error(`\nVALIDATION ÉCHOUÉE — ${failures} erreur(s)\n`);
  process.exit(1);
}
