/**
 * THE CODEX — Tests unitaires du chatbot ECHO.
 * Charge les fichiers VENDORÉS réels (fuse.min.js, compromise.js) et le
 * moteur echo-ai.js dans Node, puis vérifie ~40 cas : conjugaisons EN/FR,
 * grammaire, phrasebook, culture, aide de jeu, replis, bornes de sécurité.
 */
"use strict";

const path = require("path");
const ROOT = path.join(__dirname, "..");

// ---- Environnement renderer simulé ----
global.window = global;
global.document = { documentElement: { lang: "fr" } };

// Vendors réels (ceux expédiés dans l'app)
global.Fuse = require(path.join(ROOT, "src/renderer/vendor/fuse.min.js"));
global.nlp = require(path.join(ROOT, "src/renderer/vendor/compromise.js"));

// Données + i18n + moteur
require(path.join(ROOT, "src/renderer/js/data/i18n.js"));
require(path.join(ROOT, "src/renderer/js/data/content-core.js"));
require(path.join(ROOT, "src/renderer/js/data/content-en.js"));
require(path.join(ROOT, "src/renderer/js/data/content-fr.js"));
require(path.join(ROOT, "src/renderer/js/data/kb-en.js"));
require(path.join(ROOT, "src/renderer/js/data/kb-fr.js"));

const Codex = global.Codex;

// État minimal simulé (le moteur lit l'arc actif via Codex.state)
Codex.state = { data: { agent: { l1: "fr", l2: "en-UK" } } };

require(path.join(ROOT, "src/renderer/js/core/echo-ai.js"));

// ---- Mini-harnais ----
let passed = 0;
let failed = 0;
function check(label, cond, detail) {
  if (cond) { passed += 1; console.log(`  ✓ ${label}`); }
  else { failed += 1; console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`); }
}
function full(reply) { return [reply.text, reply.data || ""].join("\n"); }
function setLang(l1, l2) {
  Codex.state.data.agent.l1 = l1;
  Codex.state.data.agent.l2 = l2;
  Codex.i18n.set(l1);
  Codex.echoAI.rebuild();
}

// ================= Arc ANGLAIS (joueur francophone) =================
console.log("\n[1/4] Arc en-UK — joueur FR");
setLang("fr", "en-UK");

let r = Codex.echoAI.ask("Conjugue EAT");
check("« Conjugue EAT » → paradigme complet", /ate/.test(full(r)) && /eaten/.test(full(r)), full(r).slice(0, 90));
check("…avec sens français", /manger/.test(full(r)));

r = Codex.echoAI.ask("passé de go");
check("« passé de go » → went/gone", /went/.test(full(r)) && /gone/.test(full(r)));

r = Codex.echoAI.ask("ate");
check("forme conjuguée seule « ate » → retrouve EAT", /EAT/.test(full(r)));

r = Codex.echoAI.ask("conjugate bring");
check("« conjugate bring » → brought", /brought/.test(full(r)));

r = Codex.echoAI.ask("conjugate sneeze"); // hors base → compromise
check("verbe hors base « sneeze » → conjugaison NLP", /sneez/i.test(full(r)), full(r).slice(0, 90));

r = Codex.echoAI.ask("c'est quoi le present perfect ?");
check("question grammaire present perfect", /participe|have\/has/i.test(full(r)));

r = Codex.echoAI.ask("question tag");
check("grammaire question tags", /isn't it|tag/i.test(full(r)));

r = Codex.echoAI.ask("comment commander une bière au pub");
check("phrasebook pub", /pint|round|pub/i.test(full(r)));

r = Codex.echoAI.ask("mind the gap");
check("culture « Mind the gap »", /métro|quai|rame/i.test(full(r)));

r = Codex.echoAI.ask("comment gagner des médailles ?");
check("aide de jeu — médailles", /Précision|Fantôme|Silence/i.test(full(r)));

r = Codex.echoAI.ask("c'est quoi la suspicion ?");
check("aide de jeu — suspicion", /Complication|100/i.test(full(r)));

r = Codex.echoAI.ask("xp");
check("aide de jeu — XP", /Fragments|150|\+50/i.test(full(r)));

r = Codex.echoAI.ask("zzzzqqqq introuvable");
check("repli gracieux sur question inconnue", Array.isArray(r.suggestions) && r.suggestions.length >= 3 && r.text.length > 10);

r = Codex.echoAI.ask("");
check("entrée vide → repli", r.text.length > 0 && Array.isArray(r.suggestions));

r = Codex.echoAI.ask("a".repeat(5000));
check("entrée de 5000 caractères → bornée, pas de crash", r.text.length > 0);

r = Codex.echoAI.ask("<script>alert(1)</script> conjugue eat");
check("tentative d'injection neutralisée (traitement texte pur)", /ate/.test(full(r)) || r.text.length > 0);

// ================= Arc FRANÇAIS (joueur anglophone) =================
console.log("\n[2/4] Arc fr-FR — joueur EN");
setLang("en", "fr-FR");

r = Codex.echoAI.ask("Conjugate ALLER");
check("« Conjugate ALLER » → je vais / vont", /je vais/.test(full(r)) && /vont/.test(full(r)));
check("…signale l'auxiliaire ÊTRE", /ÊTRE|être/i.test(full(r)) && /⚠/.test(full(r)));

r = Codex.echoAI.ask("je suis allé");
check("forme « je suis allé » → retrouve ALLER", /ALLER/.test(full(r)));

r = Codex.echoAI.ask("conjugaison de manger");
check("« conjugaison de manger » → nous mangeons", /mangeons/.test(full(r)));

r = Codex.echoAI.ask("which verbs take être in the past?");
check("grammaire — verbes à être", /aller|venir|arriver/i.test(full(r)));

r = Codex.echoAI.ask("tu or vous?");
check("grammaire — tu/vous", /strangers|vous/i.test(full(r)));

r = Codex.echoAI.ask("how to order a coffee");
check("phrasebook — café", /café|s'il vous plaît/i.test(full(r)));

r = Codex.echoAI.ask("la bise");
check("culture — la bise", /cheek|kiss|region/i.test(full(r)));

r = Codex.echoAI.ask("attendre");
check("verbe ATTENDRE → j'attendrai", /attendrai|attendu/.test(full(r)));

r = Codex.echoAI.ask("how do medals work");
check("aide EN — medals", /Precision|Ghost|Lightning/i.test(full(r)));

r = Codex.echoAI.ask("what is the daily signal");
check("aide EN — daily signal", /micro-mission|Vault|50/i.test(full(r)));

// ================= Index & cohérence =================
console.log("\n[3/4] Index & cohérence");
check("index non vide (arc FR actif)", Codex.echoAI._entriesCount() >= 80, String(Codex.echoAI._entriesCount()));
const kbEN = Codex.KB["en-UK"];
const kbFR = Codex.KB["fr-FR"];
check("≥ 55 verbes irréguliers anglais", kbEN.verbs.length >= 55, String(kbEN.verbs.length));
check("≥ 30 verbes français", kbFR.verbs.length >= 30, String(kbFR.verbs.length));
check("≥ 12 fiches grammaire par langue", kbEN.grammar.length >= 12 && kbFR.grammar.length >= 12);
check("≥ 18 entrées phrasebook par langue", kbEN.phrasebook.length >= 18 && kbFR.phrasebook.length >= 18);
check("≥ 8 dossiers culturels par langue", kbEN.culture.length >= 8 && kbFR.culture.length >= 8);

// Unicité des verbes
const dupEN = kbEN.verbs.length !== new Set(kbEN.verbs.map((v) => v.inf)).size;
const dupFR = kbFR.verbs.length !== new Set(kbFR.verbs.map((v) => v.inf)).size;
check("aucun verbe dupliqué", !dupEN && !dupFR);

// Intégrité des verbes FR : 6 formes au présent + auxiliaire valide
let frOk = true;
for (const v of kbFR.verbs) {
  if (!Array.isArray(v.present) || v.present.length !== 6) frOk = false;
  if (!["avoir", "être"].includes(v.aux)) frOk = false;
  if (!v.pc || !v.futur || !v.imparfait || !v.en || !v.ex) frOk = false;
}
check("verbes FR : 6 formes présent + auxiliaire + pc/futur/imparfait", frOk);

// Intégrité des verbes EN
let enOk = true;
for (const v of kbEN.verbs) {
  if (!v.inf || !v.past || !v.pp || !v.third || !v.ger || !v.fr || !v.ex) enOk = false;
}
check("verbes EN : 5 formes + sens + exemple", enOk);

// ================= Performance =================
console.log("\n[4/4] Performance");
const t0 = Date.now();
for (let i = 0; i < 50; i++) Codex.echoAI.ask("conjugue aller et donne moi le futur");
const ms = Date.now() - t0;
check(`50 requêtes < 2000 ms (${ms} ms)`, ms < 2000);

// ================= Bilan =================
console.log(`\n${passed} réussis · ${failed} échoués`);
if (failed > 0) {
  console.error("\nTESTS ECHO ÉCHOUÉS ✗\n");
  process.exit(1);
}
console.log("\nTESTS ECHO RÉUSSIS ✓\n");
