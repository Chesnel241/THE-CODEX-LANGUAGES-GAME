/**
 * THE CODEX — Validation CI : syntaxe de tous les fichiers JS
 * + intégrité du schéma de contenu des missions (GDD §13.3).
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
console.log("\n[1/2] Syntaxe JavaScript");
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

// ---------- 2. Schéma de contenu ----------
console.log("\n[2/2] Schéma de contenu des missions");
global.window = global; // le contenu cible le renderer
require(path.join(ROOT, "src", "renderer", "js", "data", "content.js"));
const C = global.Codex.CONTENT;

const missionIds = new Set();
const intelIds = new Set();

function checkPercee(label, content) {
  if (!Array.isArray(content.fragments) || content.fragments.length < 2 || content.fragments.length > 6) {
    fail(`${label} : nombre de fragments invalide`);
    return;
  }
  for (const f of content.fragments) {
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
    for (const w of round.solution || []) {
      if (!bankWords.has(w)) fail(`${label} / round ${i + 1} : mot de solution absent de la banque : « ${w} »`);
    }
    const validCats = new Set(["subject", "verb", "comp", "conn", "mod"]);
    for (const b of round.bank || []) {
      if (!validCats.has(b.cat)) fail(`${label} / round ${i + 1} : catégorie inconnue « ${b.cat} »`);
    }
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
  }
}

for (const m of C.missions) {
  const label = m.id;
  if (missionIds.has(m.id)) fail(`${label} : id de mission dupliqué`);
  missionIds.add(m.id);

  for (const k of ["type", "title", "location", "difficulty", "durationMin", "xpBase", "brief", "intelCard", "icon", "typeName", "subtitle"]) {
    if (m[k] === undefined) fail(`${label} : champ mission manquant « ${k} »`);
  }
  for (const k of ["narrative", "context", "intelPreview", "echo"]) {
    if (!m.brief || !m.brief[k]) fail(`${label} : champ brief manquant « ${k} »`);
  }
  if (m.intelCard) {
    if (intelIds.has(m.intelCard.id)) fail(`${label} : id d'intel dupliqué ${m.intelCard.id}`);
    intelIds.add(m.intelCard.id);
    if (!["verb", "vocab", "grammar"].includes(m.intelCard.kind)) fail(`${label} : intelCard.kind invalide`);
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

for (const [i, q] of C.dailyFallback.entries()) {
  if (!q.options || !q.options[q.correct]) fail(`dailyFallback ${i + 1} : réponse invalide`);
}

if (C.levels.length !== 5) fail("Il faut exactement 5 niveaux d'agent (GDD §10.2)");
if (C.countries.length !== 10) fail("Il faut 10 pays Phase 1 (GDD §3.2)");

if (failures === 0) {
  ok(`${C.missions.length} missions valides, ${intelIds.size} cartes intel, ${C.medals.length} médailles`);
  console.log("\nVALIDATION RÉUSSIE ✓\n");
} else {
  console.error(`\nVALIDATION ÉCHOUÉE — ${failures} erreur(s)\n`);
  process.exit(1);
}
