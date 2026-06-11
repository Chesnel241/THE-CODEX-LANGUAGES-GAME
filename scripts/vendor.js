/**
 * THE CODEX — Vendoring des librairies tierces (DevSecOps).
 *
 * Copie les builds UMD épinglés depuis node_modules vers
 * src/renderer/vendor/ et maintient un manifeste d'intégrité SHA-256.
 * La CSP du renderer (script-src 'self') interdit tout CDN : les
 * librairies sont servies localement, versionnées et auditables.
 *
 * Usage :
 *   node scripts/vendor.js            # copie + (ré)génère le manifeste
 *   node scripts/vendor.js --verify   # vérifie l'intégrité (CI) sans copier
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const VENDOR_DIR = path.join(ROOT, "src", "renderer", "vendor");
const MANIFEST = path.join(VENDOR_DIR, "vendor-manifest.json");

// Librairies épinglées : source dans node_modules → nom de fichier vendored
const LIBS = [
  { pkg: "three", src: "build/three.min.js", out: "three.min.js", global: "THREE", license: "MIT" },
  { pkg: "lottie-web", src: "build/player/lottie.min.js", out: "lottie.min.js", global: "lottie", license: "MIT" },
  { pkg: "animejs", src: "lib/anime.min.js", out: "anime.min.js", global: "anime", license: "MIT" },
  { pkg: "fuse.js", src: "dist/fuse.min.js", out: "fuse.min.js", global: "Fuse", license: "Apache-2.0" },
  { pkg: "compromise", src: "builds/compromise.js", out: "compromise.js", global: "nlp", license: "MIT" },
];

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function pkgVersion(pkg) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "node_modules", pkg, "package.json"), "utf8")).version;
}

const verifyOnly = process.argv.includes("--verify");
let failures = 0;

if (verifyOnly) {
  // ----- Mode CI : vérifie que les fichiers vendorés correspondent au manifeste -----
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  for (const entry of manifest.files) {
    const p = path.join(VENDOR_DIR, entry.file);
    if (!fs.existsSync(p)) {
      console.error(`  ✗ MANQUANT : vendor/${entry.file}`);
      failures += 1;
      continue;
    }
    const actual = sha256(fs.readFileSync(p));
    if (actual !== entry.sha256) {
      console.error(`  ✗ INTÉGRITÉ : vendor/${entry.file} — empreinte inattendue`);
      console.error(`      attendu  ${entry.sha256}`);
      console.error(`      obtenu   ${actual}`);
      failures += 1;
    } else {
      console.log(`  ✓ vendor/${entry.file} (${entry.pkg}@${entry.version}, ${entry.license})`);
    }
  }
  if (failures) {
    console.error(`\nVÉRIFICATION VENDORS ÉCHOUÉE — ${failures} fichier(s)\n`);
    process.exit(1);
  }
  console.log("\nVendors intègres ✓\n");
} else {
  // ----- Mode développement : copie + manifeste -----
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
  const files = [];
  for (const lib of LIBS) {
    const srcPath = path.join(ROOT, "node_modules", lib.pkg, lib.src);
    if (!fs.existsSync(srcPath)) {
      console.error(`  ✗ Introuvable : ${lib.pkg}/${lib.src} — lancez npm install`);
      failures += 1;
      continue;
    }
    const buf = fs.readFileSync(srcPath);
    fs.writeFileSync(path.join(VENDOR_DIR, lib.out), buf);
    const entry = {
      file: lib.out,
      pkg: lib.pkg,
      version: pkgVersion(lib.pkg),
      license: lib.license,
      global: lib.global,
      sha256: sha256(buf),
      bytes: buf.length,
    };
    files.push(entry);
    console.log(`  ✓ vendor/${lib.out} ← ${lib.pkg}@${entry.version} (${(buf.length / 1024).toFixed(0)} Ko, ${lib.license})`);
  }
  if (failures) process.exit(1);
  fs.writeFileSync(MANIFEST, JSON.stringify({ generatedAt: new Date().toISOString(), files }, null, 2));
  console.log(`\nManifeste écrit : src/renderer/vendor/vendor-manifest.json\n`);
}
