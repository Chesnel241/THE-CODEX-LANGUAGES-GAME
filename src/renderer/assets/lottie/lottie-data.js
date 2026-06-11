/**
 * THE CODEX — Animations Lottie embarquées (créations originales).
 * Format Bodymovin/Lottie standard, servies en JS pour rester dans la
 * CSP (aucun fetch). Jouées par Codex.fx.lottie via lottie-web (vendoré).
 *
 *  - radar : balayage radar + ping (QG, Daily Signal)
 *  - check : coche de validation tracée (debriefing)
 */
"use strict";
window.Codex = window.Codex || {};

Codex.LOTTIE = {
  // ---------------------------------------------------------------
  // RADAR — cadran 120×120, balayage 3 s en boucle + cercle de ping
  // ---------------------------------------------------------------
  radar: {
    v: "5.5.2", fr: 30, ip: 0, op: 90, w: 120, h: 120, nm: "codex-radar", ddd: 0, assets: [],
    layers: [
      // Balayage rotatif
      {
        ddd: 0, ind: 1, ty: 4, nm: "sweep", sr: 1,
        ks: {
          o: { a: 0, k: 85 },
          r: { a: 1, k: [{ i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 0, s: [0] }, { t: 90, s: [360] }] },
          p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [{
          ty: "gr", nm: "line", it: [
            { ty: "sh", ks: { a: 0, k: { i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [[0, 0], [46, 0]], c: false } } },
            { ty: "st", c: { a: 0, k: [0, 0.83, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 2 },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        }],
        ip: 0, op: 90, st: 0,
      },
      // Ping : cercle qui s'étend et s'estompe
      {
        ddd: 0, ind: 2, ty: 4, nm: "ping", sr: 1,
        ks: {
          o: { a: 1, k: [{ i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 0, s: [80] }, { t: 80, s: [0] }] },
          r: { a: 0, k: 0 }, p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] }, t: 0, s: [12, 12, 100] }, { t: 80, s: [100, 100, 100] }] },
        },
        shapes: [{
          ty: "gr", nm: "ring", it: [
            { ty: "el", s: { a: 0, k: [92, 92] }, p: { a: 0, k: [0, 0] } },
            { ty: "st", c: { a: 0, k: [0, 0.83, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2.5 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        }],
        ip: 0, op: 90, st: 0,
      },
      // Cadran : deux cercles fixes + point central
      {
        ddd: 0, ind: 3, ty: 4, nm: "dial", sr: 1,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [
          {
            ty: "gr", nm: "outer", it: [
              { ty: "el", s: { a: 0, k: [96, 96] }, p: { a: 0, k: [0, 0] } },
              { ty: "st", c: { a: 0, k: [0, 0.83, 1, 1] }, o: { a: 0, k: 45 }, w: { a: 0, k: 2 } },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
          {
            ty: "gr", nm: "inner", it: [
              { ty: "el", s: { a: 0, k: [56, 56] }, p: { a: 0, k: [0, 0] } },
              { ty: "st", c: { a: 0, k: [0, 0.83, 1, 1] }, o: { a: 0, k: 30 }, w: { a: 0, k: 1.5 } },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
          {
            ty: "gr", nm: "core", it: [
              { ty: "el", s: { a: 0, k: [8, 8] }, p: { a: 0, k: [0, 0] } },
              { ty: "fl", c: { a: 0, k: [0, 0.83, 1, 1] }, o: { a: 0, k: 100 } },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
        ip: 0, op: 90, st: 0,
      },
    ],
  },

  // ---------------------------------------------------------------
  // CHECK — coche de réussite tracée dans un cercle (non bouclé)
  // ---------------------------------------------------------------
  check: {
    v: "5.5.2", fr: 30, ip: 0, op: 55, w: 120, h: 120, nm: "codex-check", ddd: 0, assets: [],
    layers: [
      // La coche, tracée par trim path
      {
        ddd: 0, ind: 1, ty: 4, nm: "tick", sr: 1,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [60, 62, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [{
          ty: "gr", nm: "tickpath", it: [
            { ty: "sh", ks: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-22, 2], [-6, 18], [24, -16]], c: false } } },
            { ty: "st", c: { a: 0, k: [0.18, 0.84, 0.45, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 9 }, lc: 2, lj: 2 },
            { ty: "tm", s: { a: 0, k: 0 }, e: { a: 1, k: [{ i: { x: [0.3], y: [1] }, o: { x: [0.7], y: [0] }, t: 14, s: [0] }, { t: 38, s: [100] }] }, o: { a: 0, k: 0 }, m: 1 },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        }],
        ip: 0, op: 55, st: 0,
      },
      // Le cercle, avec pop d'apparition
      {
        ddd: 0, ind: 2, ty: 4, nm: "circle", sr: 1,
        ks: {
          o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [60, 60, 0] }, a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ i: { x: [0.2, 0.2, 0.2], y: [1.4, 1.4, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] }, t: 0, s: [40, 40, 100] }, { t: 16, s: [100, 100, 100] }] },
        },
        shapes: [{
          ty: "gr", nm: "ring", it: [
            { ty: "el", s: { a: 0, k: [98, 98] }, p: { a: 0, k: [0, 0] } },
            { ty: "st", c: { a: 0, k: [0.18, 0.84, 0.45, 1] }, o: { a: 0, k: 90 }, w: { a: 0, k: 6 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        }],
        ip: 0, op: 55, st: 0,
      },
    ],
  },
};
