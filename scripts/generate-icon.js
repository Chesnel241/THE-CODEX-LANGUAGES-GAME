/**
 * THE CODEX — Génère build/icon.png (512px) et build/icon.ico
 * (frames 256 PNG + 48/32/16 BMP) en pur Node, sans dépendance.
 * Design : hexagone ECHO en dégradé cyan→violet sur fond noir espace.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ---------- CRC32 (pour les chunks PNG) ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ---------- Dessin ----------
/** SDF d'un hexagone pointe en haut (Inigo Quilez). */
function hexSDF(px, py, r) {
  const kx = -0.866025404, ky = 0.5, kz = 0.577350269;
  let x = Math.abs(px), y = Math.abs(py);
  const d = 2 * Math.min(kx * x + ky * y, 0);
  x -= d * kx;
  y -= d * ky;
  x -= Math.min(Math.max(x, -kz * r), kz * r);
  y -= r;
  return Math.sign(y) * Math.hypot(x, y);
}

function lerp(a, b, t) { return a + (b - a) * t; }

/** Rendu RGBA d'une icône size×size. */
function renderIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const c = size / 2;
  const hexR = size * 0.34;
  const ringW = size * 0.055;
  const dotR = size * 0.10;
  const cornerR = size * 0.18;

  const cyan = [0, 212, 255];
  const purple = [155, 126, 255];
  const bg = [6, 10, 18];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Coins arrondis (alpha)
      const dx = Math.max(cornerR - x, x - (size - 1 - cornerR), 0);
      const dy = Math.max(cornerR - y, y - (size - 1 - cornerR), 0);
      const cornerDist = Math.hypot(dx, dy);
      let alpha = cornerDist > cornerR ? 0 : 255;

      // Fond + léger halo radial cyan
      const distC = Math.hypot(x - c, y - c) / c;
      const halo = Math.max(0, 1 - distC) * 0.12;
      let r = bg[0] + cyan[0] * halo;
      let g = bg[1] + cyan[1] * halo;
      let b = bg[2] + cyan[2] * halo;

      // Dégradé diagonal pour les éléments
      const t = (x + y) / (2 * size);
      const er = lerp(cyan[0], purple[0], t);
      const eg = lerp(cyan[1], purple[1], t);
      const eb = lerp(cyan[2], purple[2], t);

      // Anneau hexagonal
      const sdf = hexSDF(x - c, y - c, hexR);
      const ring = Math.max(0, 1 - Math.abs(Math.abs(sdf) - ringW) / (size * 0.02));
      // Point central (fragment)
      const dot = Math.max(0, Math.min(1, (dotR - Math.hypot(x - c, y - c)) / (size * 0.02)));

      const k = Math.min(1, ring + dot);
      r = lerp(r, er, k);
      g = lerp(g, eg, k);
      b = lerp(b, eb, k);

      px[i] = Math.round(Math.min(255, r));
      px[i + 1] = Math.round(Math.min(255, g));
      px[i + 2] = Math.round(Math.min(255, b));
      px[i + 3] = alpha;
    }
  }
  return px;
}

// ---------- Encodage PNG ----------
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(rgba, size) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  // scanlines avec filtre 0
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------- Encodage frame BMP pour ICO ----------
function encodeBMPFrame(rgba, size) {
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);          // biSize
  header.writeInt32LE(size, 4);         // biWidth
  header.writeInt32LE(size * 2, 8);     // biHeight (XOR + AND)
  header.writeUInt16LE(1, 12);          // biPlanes
  header.writeUInt16LE(32, 14);         // biBitCount
  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const src = ((size - 1 - y) * size + x) * 4; // bottom-up
      const dst = (y * size + x) * 4;
      xor[dst] = rgba[src + 2];     // B
      xor[dst + 1] = rgba[src + 1]; // G
      xor[dst + 2] = rgba[src];     // R
      xor[dst + 3] = rgba[src + 3]; // A
    }
  }
  const andRow = Math.ceil(size / 32) * 4;
  const and = Buffer.alloc(andRow * size); // tout opaque (alpha gère la transparence)
  return Buffer.concat([header, xor, and]);
}

// ---------- Assemblage ICO ----------
function encodeICO(frames) {
  // frames : [{ size, data, isPng }]
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type icône
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + 16 * count;
  for (const f of frames) {
    const e = Buffer.alloc(16);
    e[0] = f.size >= 256 ? 0 : f.size;
    e[1] = f.size >= 256 ? 0 : f.size;
    e.writeUInt16LE(1, 4);  // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(f.data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += f.data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...frames.map((f) => f.data)]);
}

// ---------- Main ----------
const outDir = path.join(__dirname, "..", "build");
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "icon.png"), encodePNG(renderIcon(512), 512));

const ico = encodeICO([
  { size: 256, data: encodePNG(renderIcon(256), 256) },
  { size: 48, data: encodeBMPFrame(renderIcon(48), 48) },
  { size: 32, data: encodeBMPFrame(renderIcon(32), 32) },
  { size: 16, data: encodeBMPFrame(renderIcon(16), 16) },
]);
fs.writeFileSync(path.join(outDir, "icon.ico"), ico);

console.log("✓ build/icon.png (512px) et build/icon.ico (256/48/32/16) générés.");
