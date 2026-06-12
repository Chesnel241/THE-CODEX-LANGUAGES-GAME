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
  { pkg: "topojson-client", src: "dist/topojson-client.min.js", out: "topojson-client.min.js", global: "topojson", license: "ISC" },
];

// Polices embarquées (woff2, licence OFL) → vendor/fonts/
const FONTS = [
  { pkg: "@fontsource/inter", src: "files/inter-latin-400-normal.woff2", out: "fonts/inter-400.woff2", license: "OFL-1.1" },
  { pkg: "@fontsource/inter", src: "files/inter-latin-600-normal.woff2", out: "fonts/inter-600.woff2", license: "OFL-1.1" },
  { pkg: "@fontsource/inter", src: "files/inter-latin-700-normal.woff2", out: "fonts/inter-700.woff2", license: "OFL-1.1" },
  { pkg: "@fontsource/inter", src: "files/inter-latin-800-normal.woff2", out: "fonts/inter-800.woff2", license: "OFL-1.1" },
  { pkg: "@fontsource/space-mono", src: "files/space-mono-latin-400-normal.woff2", out: "fonts/space-mono-400.woff2", license: "OFL-1.1" },
  { pkg: "@fontsource/space-mono", src: "files/space-mono-latin-700-normal.woff2", out: "fonts/space-mono-700.woff2", license: "OFL-1.1" },
];

// Icônes Lucide (ISC) → embarquées en JS (CSP : aucun fetch au runtime)
const ICON_NAMES = [
  "radio", "satellite", "zap", "archive", "id-card", "settings",
  "lock-open", "drama", "file-search", "handshake", "target",
  "chevron-left", "volume-2", "send", "check", "sparkles",
  "shield", "trophy", "timer", "globe", "map-pin", "award",
  "play", "x", "lightbulb", "message-square",
  "circle-help", "book-open",
];

function buildIconsData() {
  const out = {};
  for (const name of ICON_NAMES) {
    const p = path.join(ROOT, "node_modules", "lucide-static", "icons", `${name}.svg`);
    if (!fs.existsSync(p)) {
      console.error(`  ✗ Icône Lucide introuvable : ${name}`);
      failures += 1;
      continue;
    }
    const svg = fs.readFileSync(p, "utf8");
    // Extrait le contenu interne du <svg> (paths/shapes), viewBox lucide = 0 0 24 24
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
    out[name] = inner;
  }
  const banner = "/**\n * THE CODEX — Icônes Lucide embarquées (ISC, https://lucide.dev)\n * Généré par scripts/vendor.js — NE PAS ÉDITER À LA MAIN.\n */\n\"use strict\";\nwindow.Codex = window.Codex || {};\nCodex.ICONS = ";
  return banner + JSON.stringify(out, null, 1) + ";\n";
}

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
  // ----- Polices -----
  fs.mkdirSync(path.join(VENDOR_DIR, "fonts"), { recursive: true });
  for (const f of FONTS) {
    const srcPath = path.join(ROOT, "node_modules", f.pkg, f.src);
    if (!fs.existsSync(srcPath)) {
      console.error(`  ✗ Police introuvable : ${f.pkg}/${f.src}`);
      failures += 1;
      continue;
    }
    const buf = fs.readFileSync(srcPath);
    fs.writeFileSync(path.join(VENDOR_DIR, f.out), buf);
    files.push({ file: f.out, pkg: f.pkg, version: pkgVersion(f.pkg), license: f.license, sha256: sha256(buf), bytes: buf.length });
    console.log(`  ✓ vendor/${f.out} ← ${f.pkg} (${(buf.length / 1024).toFixed(0)} Ko, ${f.license})`);
  }

  // ----- Icônes (générées en JS embarqué) -----
  const iconsJs = buildIconsData();
  if (!failures) {
    const iconsBuf = Buffer.from(iconsJs, "utf8");
    fs.writeFileSync(path.join(VENDOR_DIR, "icons-data.js"), iconsBuf);
    files.push({
      file: "icons-data.js", pkg: "lucide-static", version: pkgVersion("lucide-static"),
      license: "ISC", global: "Codex.ICONS", sha256: sha256(iconsBuf), bytes: iconsBuf.length,
    });
    console.log(`  ✓ vendor/icons-data.js ← lucide-static (${ICON_NAMES.length} icônes, ISC)`);
  }

  // ----- Données monde (Natural Earth via world-atlas, domaine public) -----
  {
    const topoSrc = path.join(ROOT, "node_modules", "world-atlas", "countries-110m.json");
    if (!fs.existsSync(topoSrc)) {
      console.error("  ✗ world-atlas/countries-110m.json introuvable");
      failures += 1;
    } else {
      const topo = fs.readFileSync(topoSrc, "utf8");
      const js = "/**\n * THE CODEX — Frontières mondiales Natural Earth 110m (domaine public),\n * via world-atlas (ISC). Généré par scripts/vendor.js — NE PAS ÉDITER.\n */\n\"use strict\";\nwindow.Codex = window.Codex || {};\nCodex.WORLD_TOPO = " + topo + ";\n";
      const buf = Buffer.from(js, "utf8");
      fs.writeFileSync(path.join(VENDOR_DIR, "world-data.js"), buf);
      files.push({
        file: "world-data.js", pkg: "world-atlas", version: pkgVersion("world-atlas"),
        license: "ISC / Natural Earth (domaine public)", global: "Codex.WORLD_TOPO",
        sha256: sha256(buf), bytes: buf.length,
      });
      console.log(`  ✓ vendor/world-data.js ← world-atlas countries-110m (${(buf.length / 1024).toFixed(0)} Ko)`);
    }
  }

  if (failures) process.exit(1);
  fs.writeFileSync(MANIFEST, JSON.stringify({ generatedAt: new Date().toISOString(), files }, null, 2));
  console.log(`\nManifeste écrit : src/renderer/vendor/vendor-manifest.json\n`);
}
