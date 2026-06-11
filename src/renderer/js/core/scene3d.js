/**
 * THE CODEX — Moteur de scènes 3D (three.js, vendoré).
 * Chaque terrain de mission devient un environnement low-poly temps réel :
 * sol, architecture, mobilier, PNJ, éclairages par ambiance, caméra vivante
 * (dérive + parallaxe souris). Les hotspots DOM existants sont « adoptés » :
 * leurs positions % deviennent des ancres 3D projetées à l'écran chaque
 * frame — aucun changement dans les moteurs de mission, mêmes tests.
 * Repli : si WebGL est indisponible, mount() retourne null → scènes CSS.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  function webglAvailable() {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch { return false; }
  }

  // ---------- Palettes par ambiance (accordées aux dégradés CSS) ----------
  const PALETTES = {
    restaurant: { ground: 0x3a2a18, wall: 0x4a3522, accent: 0x8a5a2b, light: 0xffc880, glow: 0xffb060, night: false },
    pub:        { ground: 0x2e1d10, wall: 0x3c2814, accent: 0x6b4a24, light: 0xffaa55, glow: 0xff9540, night: false },
    cafe:       { ground: 0x40331e, wall: 0x554427, accent: 0x96703a, light: 0xffd890, glow: 0xffc870, night: false },
    office:     { ground: 0x16243a, wall: 0x1d3050, accent: 0x2a4a78, light: 0xa8d4ff, glow: 0x78c8ff, night: true },
    market:     { ground: 0x2a2e16, wall: 0x3a3f1e, accent: 0x6a7030, light: 0xfff0a0, glow: 0xd8e878, night: false },
    street:     { ground: 0x0d1322, wall: 0x141d33, accent: 0x1f2c4d, light: 0x88aaff, glow: 0x64a0ff, night: true },
    metro:      { ground: 0x14202c, wall: 0x1b2c3c, accent: 0x2a4456, light: 0x9affe6, glow: 0x8cffe6, night: true },
    gala:       { ground: 0x221229, wall: 0x2e1a38, accent: 0x4a2a58, light: 0xe6aaff, glow: 0xd28cff, night: true },
  };

  // ---------- Aides géométriques low-poly ----------
  function mat(color, opts = {}) {
    return new window.THREE.MeshStandardMaterial({
      color, flatShading: true, roughness: opts.roughness ?? 0.92, metalness: opts.metalness ?? 0.05,
      emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 1,
    });
  }

  function box(parent, w, h, d, color, x, y, z, opts = {}) {
    const m = new window.THREE.Mesh(new window.THREE.BoxGeometry(w, h, d), mat(color, opts));
    m.position.set(x, y, z);
    if (opts.ry) m.rotation.y = opts.ry;
    parent.add(m);
    return m;
  }

  function cyl(parent, rTop, rBot, h, color, x, y, z, opts = {}) {
    const m = new window.THREE.Mesh(new window.THREE.CylinderGeometry(rTop, rBot, h, opts.seg || 8), mat(color, opts));
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  function pane(parent, w, h, color, x, y, z, intensity = 1) {
    const m = new window.THREE.Mesh(
      new window.THREE.PlaneGeometry(w, h),
      new window.THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 * intensity })
    );
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  /** PNJ low-poly : corps capsule, tête sphère, oscillation d'attente. */
  function npc(parent, color, x, z, ry = 0) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.7, 3, 8), mat(color));
    body.position.y = 0.75;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 8), mat(0xe8c4a0));
    head.position.y = 1.45;
    g.add(body, head);
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    g.userData.bobPhase = Math.random() * Math.PI * 2;
    parent.add(g);
    return g;
  }

  /** Table + chaises (intérieurs). */
  function tableSet(parent, P, x, z) {
    cyl(parent, 0.55, 0.55, 0.06, P.accent, x, 0.78, z, { seg: 10 });
    cyl(parent, 0.07, 0.09, 0.75, P.accent, x, 0.38, z);
    for (const a of [0, Math.PI]) {
      const cx = x + Math.cos(a) * 0.95;
      const cz = z + Math.sin(a) * 0.95;
      box(parent, 0.42, 0.07, 0.42, P.accent, cx, 0.45, cz);
      box(parent, 0.42, 0.5, 0.07, P.accent, cx, 0.72, cz + (a === 0 ? 0.2 : -0.2));
      for (const [ox, oz] of [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]]) {
        box(parent, 0.05, 0.45, 0.05, P.accent, cx + ox, 0.22, cz + oz);
      }
    }
  }

  /** Lampe suspendue avec lumière ponctuelle. */
  function hangLamp(parent, P, x, z, height = 3.4) {
    const THREE = window.THREE;
    cyl(parent, 0.012, 0.012, 4.2 - height + 0.8, 0x222222, x, height + 0.4, z);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.3, 8, 1, true), mat(0x223344, { roughness: 0.6 }));
    shade.position.set(x, height, z);
    parent.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: P.light }));
    bulb.position.set(x, height - 0.1, z);
    parent.add(bulb);
    const l = new THREE.PointLight(P.light, 0.7, 9, 1.8);
    l.position.set(x, height - 0.2, z);
    parent.add(l);
  }

  // ---------- Environnements ----------
  function buildRoom(world, P, opts = {}) {
    // Sol en lattes
    for (let i = -5; i <= 5; i++) {
      box(world, 1.55, 0.1, 14, i % 2 ? P.ground : P.ground + 0x050402, i * 1.6, -0.05, -2);
    }
    // Murs fond + côtés
    box(world, 17, 5, 0.3, P.wall, 0, 2.5, -7.5);
    box(world, 0.3, 5, 14, P.wall, -8.4, 2.5, -1);
    box(world, 0.3, 5, 14, P.wall, 8.4, 2.5, -1);
    // Fenêtres lumineuses sur le mur du fond
    for (let i = -2; i <= 2; i++) {
      pane(world, 1.7, 2.0, opts.windowColor || (P.night ? 0x1a2c55 : 0xbfe3ff), i * 3.1, 2.6, -7.32, P.night ? 0.85 : 1);
      box(world, 1.9, 0.12, 0.1, P.accent, i * 3.1, 1.5, -7.3);
    }
    // Plinthe / frise
    box(world, 17, 0.3, 0.12, P.accent, 0, 0.15, -7.32);
  }

  const ENVS = {
    restaurant(world, P) {
      buildRoom(world, P);
      // Comptoir / bar à gauche
      box(world, 4.2, 1.05, 1.1, P.accent, -5.4, 0.52, -5.4);
      box(world, 4.4, 0.12, 1.3, 0x2a1a0e, -5.4, 1.12, -5.4);
      // Étagère à bouteilles
      box(world, 4.2, 1.6, 0.18, P.wall + 0x0a0604, -5.4, 3.0, -7.25);
      for (let i = 0; i < 7; i++) {
        cyl(world, 0.06, 0.08, 0.42, [0x3a7a4a, 0x7a3a3a, 0x3a5a7a][i % 3], -6.9 + i * 0.5, 3.0, -7.18);
      }
      tableSet(world, P, -2.2, -2.2);
      tableSet(world, P, 2.4, -3.4);
      tableSet(world, P, 5.2, -1.2);
      tableSet(world, P, 0.4, 0.6);
      hangLamp(world, P, -2.2, -2.2);
      hangLamp(world, P, 2.4, -3.4);
      hangLamp(world, P, 3.4, 0.4);
      npc(world, 0x6b4a8a, -4.6, -4.2, 0.6);
      npc(world, 0x3a5a7a, 2.4, -2.5, -2.6);
      npc(world, 0x7a4a3a, -1.4, -1.9, 2.4);
    },

    pub(world, P) {
      buildRoom(world, P, { windowColor: 0x35200e });
      // Grand comptoir central-droit avec poignées
      box(world, 6.4, 1.1, 1.2, P.accent, 2.6, 0.55, -4.8);
      box(world, 6.6, 0.14, 1.45, 0x1d1208, 2.6, 1.2, -4.8);
      for (let i = 0; i < 4; i++) {
        cyl(world, 0.05, 0.05, 0.5, 0xc8a04a, 0.4 + i * 1.45, 1.55, -4.8);
      }
      // Tabourets
      for (let i = 0; i < 4; i++) {
        cyl(world, 0.26, 0.26, 0.08, 0x4a2c12, 0.4 + i * 1.45, 0.72, -3.5, { seg: 10 });
        cyl(world, 0.05, 0.07, 0.7, 0x2c1a0c, 0.4 + i * 1.45, 0.35, -3.5);
      }
      // Cible de fléchettes
      cyl(world, 0.5, 0.5, 0.07, 0x1a3a2a, -6.2, 2.8, -7.25, { seg: 16 });
      cyl(world, 0.3, 0.3, 0.08, 0xaa3333, -6.2, 2.8, -7.22, { seg: 16 });
      cyl(world, 0.1, 0.1, 0.09, 0xddaa33, -6.2, 2.8, -7.2, { seg: 12 });
      tableSet(world, P, -3.6, -1.4);
      tableSet(world, P, -0.4, 0.8);
      hangLamp(world, P, 2.6, -4.4, 3.1);
      hangLamp(world, P, -3.6, -1.4);
      npc(world, 0x445566, 1.2, -3.3, 0);
      npc(world, 0x664433, 2.9, -3.3, 0.4);
      npc(world, 0x556644, -3.0, -0.7, -2.2);
    },

    cafe(world, P) {
      buildRoom(world, P, { windowColor: 0xcfe8ff });
      // Vitrine pâtisserie
      box(world, 3.6, 1.0, 1.0, P.accent, -5.2, 0.5, -5.2);
      pane(world, 3.4, 0.5, 0xeaf6ff, -5.2, 1.15, -4.68, 0.5);
      // Machine espresso
      box(world, 1.1, 0.8, 0.7, 0x3a3a44, -6.4, 1.5, -6.6);
      cyl(world, 0.06, 0.06, 0.3, 0xccccd4, -6.1, 1.2, -6.2);
      // Terrasse : petites tables rondes
      tableSet(world, P, -2.0, -1.6);
      tableSet(world, P, 1.8, -2.8);
      tableSet(world, P, 4.6, -0.6);
      tableSet(world, P, 0.6, 1.0);
      // Store rayé au-dessus du comptoir
      for (let i = 0; i < 6; i++) {
        box(world, 0.62, 0.06, 1.5, i % 2 ? 0xb8453a : 0xe8e0d0, -6.9 + i * 0.63, 2.6, -5.0, { ry: 0 });
      }
      hangLamp(world, P, 1.8, -2.8);
      hangLamp(world, P, -2.0, -1.6);
      npc(world, 0x7a5a8a, -4.5, -3.9, 1.2);
      npc(world, 0x3a6a5a, 2.1, -1.9, -2.8);
      npc(world, 0x8a6a3a, 4.4, 0.3, 2.8);
    },

    office(world, P) {
      buildRoom(world, P, { windowColor: 0x0e1a33 });
      // Rangées de bureaux avec écrans lumineux
      for (const [x, z] of [[-4.5, -3.5], [-1.0, -3.5], [2.5, -3.5], [-2.8, -0.5], [0.8, -0.5], [4.2, -0.5]]) {
        box(world, 2.2, 0.08, 1.1, P.accent, x, 0.78, z);
        for (const [ox, oz] of [[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]]) {
          box(world, 0.07, 0.74, 0.07, 0x223044, x + ox, 0.39, z + oz);
        }
        box(world, 0.85, 0.5, 0.05, 0x101820, x - 0.35, 1.18, z - 0.25);
        pane(world, 0.74, 0.4, 0x66d9ff, x - 0.35, 1.18, z - 0.21, 0.9);
        box(world, 0.5, 0.04, 0.3, 0x2a3850, x + 0.55, 0.84, z + 0.15);
      }
      // Armoires de classement
      for (let i = 0; i < 3; i++) {
        box(world, 1.0, 2.2, 0.6, 0x24364f, -7.5, 1.1, -6.4 + i * 1.4);
      }
      npc(world, 0x3a4a6a, -1.0, -2.7, 0);
      npc(world, 0x5a3a4a, 2.5, -2.7, 0.3);
    },

    market(world, P) {
      // Place extérieure : dallage
      for (let i = -5; i <= 5; i++) {
        for (let j = -4; j <= 1; j++) {
          box(world, 1.5, 0.08, 1.5, (i + j) % 2 ? P.ground : P.ground + 0x060704, i * 1.6, -0.04, j * 1.6);
        }
      }
      // Étals à auvents rayés
      const stall = (x, z, c1, c2) => {
        box(world, 2.6, 0.9, 1.2, 0x6a4a2a, x, 0.45, z);
        for (const ox of [-1.15, 1.15]) cyl(world, 0.05, 0.05, 2.2, 0x4a3520, x + ox, 1.55, z);
        for (let i = 0; i < 4; i++) {
          box(world, 0.7, 0.06, 1.7, i % 2 ? c1 : c2, x - 1.05 + i * 0.7, 2.62 - i * 0.04, z, { ry: 0 });
        }
        for (let i = 0; i < 5; i++) {
          box(world, 0.34, 0.3, 0.34, [0xc44a3a, 0xd8a03a, 0x4a8a3a, 0xb8b8c8][i % 4], x - 0.9 + i * 0.45, 1.06, z - 0.15);
        }
      };
      stall(-4.6, -4.2, 0xb8453a, 0xe8e0d0);
      stall(0.2, -5.0, 0x3a6a9a, 0xe8e0d0);
      stall(5.0, -4.0, 0x4a8a3a, 0xe8e0d0);
      stall(-2.4, -0.8, 0xb8862a, 0xe8e0d0);
      stall(3.2, -0.4, 0x8a4a8a, 0xe8e0d0);
      // Guirlande de lumières
      for (let i = 0; i < 9; i++) {
        const bx = -7 + i * 1.75;
        const by = 3.3 + Math.sin(i * 1.1) * 0.18;
        const b = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.07, 6, 5), new window.THREE.MeshBasicMaterial({ color: 0xffe8a0 }));
        b.position.set(bx, by, -2.6);
        world.add(b);
      }
      const l = new window.THREE.PointLight(P.light, 0.8, 14, 1.6);
      l.position.set(0, 3.4, -2.5);
      world.add(l);
      npc(world, 0x7a4a3a, -4.2, -3.0, 0.4);
      npc(world, 0x3a5a7a, 0.6, -3.8, -0.5);
      npc(world, 0x4a6a3a, 3.0, 0.6, 2.6);
      npc(world, 0x6a3a5a, -1.8, 0.3, 1.8);
    },

    street(world, P) {
      // Chaussée + trottoir
      box(world, 18, 0.1, 6, 0x0a0f1c, 0, -0.05, 1.2);
      box(world, 18, 0.18, 4, P.ground, 0, -0.02, -4.2);
      for (let i = 0; i < 5; i++) box(world, 1.2, 0.04, 0.22, 0xd8d8c8, -7 + i * 3.4, 0.02, 1.2);
      // Façades avec fenêtres éclairées
      for (let bIdx = 0; bIdx < 4; bIdx++) {
        const bx = -6.6 + bIdx * 4.4;
        const bh = 4.4 + (bIdx % 2) * 1.4;
        box(world, 3.6, bh, 1.4, P.wall + bIdx * 0x020304, bx, bh / 2, -6.6);
        for (let fy = 0; fy < Math.floor(bh / 1.3); fy++) {
          for (let fx = 0; fx < 3; fx++) {
            if ((bIdx + fy + fx) % 3 === 0) continue; // fenêtres éteintes
            pane(world, 0.58, 0.72, 0xffd080, bx - 1.05 + fx * 1.05, 1.1 + fy * 1.3, -5.88, 0.85);
          }
        }
      }
      // Lampadaires
      for (const x of [-5.2, 0.4, 5.8]) {
        cyl(world, 0.07, 0.09, 3.6, 0x202833, x, 1.8, -1.6);
        box(world, 0.7, 0.1, 0.26, 0x202833, x + 0.25, 3.62, -1.6);
        const b = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.11, 8, 6), new window.THREE.MeshBasicMaterial({ color: P.light }));
        b.position.set(x + 0.55, 3.55, -1.6);
        world.add(b);
        const l = new window.THREE.PointLight(P.light, 0.85, 8, 1.7);
        l.position.set(x + 0.55, 3.4, -1.6);
        world.add(l);
      }
      npc(world, 0x33415c, -3.4, -0.4, 0.7);
      npc(world, 0x4a3a5a, 4.2, -2.2, -0.5);
    },

    metro(world, P) {
      // Quai + fosse + rails
      box(world, 18, 0.5, 7, P.ground, 0, -0.25, -2.2);
      box(world, 18, 0.1, 3.4, 0x05080e, 0, -0.62, 3.2);
      for (const rz of [2.4, 3.9]) box(world, 18, 0.07, 0.12, 0x3a4452, 0, -0.5, rz);
      box(world, 18, 0.06, 0.5, 0xc8c83a, 0, 0.02, 1.15); // bande jaune
      // Voûte carrelée
      box(world, 18, 5.2, 0.4, P.wall, 0, 2.6, -5.8);
      for (let i = -4; i <= 4; i++) {
        box(world, 1.7, 2.4, 0.1, P.accent, i * 1.95, 1.7, -5.58);
      }
      // Panneau de station lumineux
      pane(world, 4.2, 0.85, 0x0a1a2c, 0, 3.2, -5.5, 1);
      pane(world, 3.9, 0.6, P.glow, 0, 3.2, -5.45, 0.35);
      // Piliers
      for (const x of [-5.4, 0, 5.4]) cyl(world, 0.22, 0.26, 4.4, 0x2c3a48, x, 2.2, -2.4, { seg: 10 });
      // Bancs
      for (const x of [-3.0, 2.8]) {
        box(world, 2.0, 0.09, 0.55, 0x37495c, x, 0.55, -3.6);
        for (const ox of [-0.8, 0.8]) box(world, 0.09, 0.55, 0.5, 0x2a3a4a, x + ox, 0.27, -3.6);
      }
      // Néons froids
      for (const x of [-4, 0, 4]) {
        const tube = new window.THREE.Mesh(new window.THREE.BoxGeometry(2.6, 0.07, 0.14), new window.THREE.MeshBasicMaterial({ color: 0xcffcf2 }));
        tube.position.set(x, 4.15, -2.2);
        world.add(tube);
        const l = new window.THREE.PointLight(P.light, 0.6, 9, 1.8);
        l.position.set(x, 3.9, -2.2);
        world.add(l);
      }
      npc(world, 0x33415c, -2.6, -2.9, 0.4);
      npc(world, 0x4a4036, 3.4, -2.9, -0.6);
    },

    gala(world, P) {
      // Parquet brillant
      for (let i = -5; i <= 5; i++) {
        box(world, 1.55, 0.08, 14, i % 2 ? 0x241428 : 0x2a182e, i * 1.6, -0.04, -2, { roughness: 0.35, metalness: 0.25 });
      }
      box(world, 17, 5.6, 0.3, P.wall, 0, 2.8, -7.5);
      // Baie vitrée — ville scintillante
      pane(world, 10.5, 3.4, 0x0a0618, 0, 2.7, -7.3, 1);
      for (let i = 0; i < 42; i++) {
        const wx = -4.9 + Math.random() * 9.8;
        const wy = 1.4 + Math.random() * 2.4;
        pane(world, 0.09, 0.13, [0xffd080, 0x80d4ff, 0xff9ac8][i % 3], wx, wy, -7.24, 0.9);
      }
      // Colonnes
      for (const x of [-6.8, -2.3, 2.3, 6.8]) {
        cyl(world, 0.3, 0.36, 5.4, 0x3a2444, x, 2.7, -6.6, { seg: 10 });
        box(world, 0.9, 0.18, 0.9, 0x4a2e56, x, 5.45, -6.6);
      }
      // Lustre
      const ch = new window.THREE.Group();
      cyl(ch, 0.02, 0.02, 1.2, 0x886644, 0, 4.6, -2.5);
      cyl(ch, 0.55, 0.75, 0.16, 0xc8a44a, 0, 4.0, -2.5, { seg: 12, metalness: 0.6, roughness: 0.3 });
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const b = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.07, 6, 5), new window.THREE.MeshBasicMaterial({ color: 0xffe8b0 }));
        b.position.set(Math.cos(a) * 0.62, 3.92, -2.5 + Math.sin(a) * 0.62);
        ch.add(b);
      }
      world.add(ch);
      const l = new window.THREE.PointLight(0xffd9a0, 1.0, 13, 1.6);
      l.position.set(0, 3.8, -2.5);
      world.add(l);
      // Table de réception
      box(world, 4.6, 0.1, 1.1, 0xf0e8e0, -4.6, 0.92, -5.4);
      box(world, 4.4, 0.85, 0.95, 0x3a2444, -4.6, 0.45, -5.4);
      for (let i = 0; i < 5; i++) cyl(world, 0.09, 0.06, 0.24, 0xd8ecff, -6.2 + i * 0.8, 1.1, -5.4, { seg: 8 });
      npc(world, 0x2a2a3a, -3.0, -3.2, 0.5);
      npc(world, 0x6a2a3a, 1.6, -2.4, -0.7);
      npc(world, 0x2a4a5a, 4.4, -3.6, 0.2);
      npc(world, 0x55304a, -0.8, -0.6, 2.6);
    },
  };

  // ---------- Montage ----------
  function mount(container, sceneDef) {
    if (!window.THREE || !webglAvailable()) return null;
    const THREE = window.THREE;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { return null; }

    const P = PALETTES[sceneDef.ambiance] || PALETTES.street;
    const W = () => container.clientWidth || 1024;
    const H = () => container.clientHeight || 540;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.domElement.className = "scene3d-canvas";
    container.insertBefore(renderer.domElement, container.firstChild);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(P.night ? 0x05070f : P.ground, 9, 26);

    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 60);
    const camBase = { x: 0, y: 4.1, z: 11.6 };
    camera.position.set(camBase.x, camBase.y, camBase.z + 1.6); // dolly d'entrée
    camera.lookAt(0, 1.3, -2);

    // Lumières globales
    scene.add(new THREE.AmbientLight(P.night ? 0x33405e : 0x6a6258, P.night ? 1.1 : 0.8));
    const sun = new THREE.DirectionalLight(P.light, P.night ? 0.35 : 0.8);
    sun.position.set(5, 9, 6);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(P.glow, 0.3);
    rim.position.set(-6, 4, -4);
    scene.add(rim);

    const world = new THREE.Group();
    scene.add(world);
    (ENVS[sceneDef.ambiance] || ENVS.street)(world, P);

    // ----- Adoption des hotspots DOM : % → ancre 3D → projection -----
    const anchors = [];
    function adopt(el) {
      if (el.dataset.adopted3d) return;
      el.dataset.adopted3d = "1";
      const xPct = parseFloat(el.style.left) || 50;
      const yPct = parseFloat(el.style.top) || 50;
      const wx = (xPct / 100) * 15 - 7.5;          // gauche→droite
      const wz = -6.2 + (yPct / 100) * 8.4;        // haut (loin) → bas (près)
      anchors.push({ el, v: new THREE.Vector3(wx, 1.5, wz) });
      // Petit socle lumineux sous chaque ancre
      const ringGeo = new THREE.RingGeometry(0.3, 0.42, 20);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: el.classList.contains("cultural") ? 0xffb347 : 0x00d4ff,
        transparent: true, opacity: 0.55, side: THREE.DoubleSide,
      }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(wx, 0.06, wz);
      ring.userData.pulse = Math.random() * Math.PI * 2;
      world.add(ring);
      anchors[anchors.length - 1].ring = ring;
    }
    container.querySelectorAll(".hotspot").forEach(adopt);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1 && n.classList && n.classList.contains("hotspot")) adopt(n);
        }
      }
    });
    mo.observe(container, { childList: true });

    // ----- Parallaxe souris -----
    let mx = 0, my = 0;
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    container.addEventListener("pointermove", onMove);

    // ----- Boucle de rendu -----
    const reduced = Codex.state && Codex.state.data.settings.reducedMotion;
    const v = new THREE.Vector3();
    let raf = 0;
    let t = 0;
    let everConnected = false;
    function animate() {
      if (renderer.domElement.isConnected) everConnected = true;
      else if (everConnected) return dispose();
      raf = requestAnimationFrame(animate);
      t += 0.016;

      // Caméra : dolly d'entrée + dérive + parallaxe
      const dolly = Math.max(0, 1.6 - t * 1.4);
      const sway = reduced ? 0 : Math.sin(t * 0.32) * 0.35;
      camera.position.set(
        camBase.x + sway + mx * 0.55,
        camBase.y + (reduced ? 0 : Math.sin(t * 0.21) * 0.12) - my * 0.3,
        camBase.z + dolly
      );
      camera.lookAt(mx * 0.8, 1.3 - my * 0.3, -2);

      // PNJ : oscillation d'attente ; anneaux : pulsation
      world.traverse((o) => {
        if (o.userData.bobPhase !== undefined) o.position.y = Math.sin(t * 1.7 + o.userData.bobPhase) * 0.035;
        if (o.userData.pulse !== undefined) {
          const s = 1 + Math.sin(t * 2.4 + o.userData.pulse) * 0.12;
          o.scale.setScalar(s);
          o.material.opacity = 0.4 + Math.sin(t * 2.4 + o.userData.pulse) * 0.18;
        }
      });

      // Projection des hotspots DOM sur l'écran
      for (const a of anchors) {
        if (!a.el.isConnected) { if (a.ring) { a.ring.visible = false; } continue; }
        v.copy(a.v).project(camera);
        const sx = (v.x * 0.5 + 0.5) * 100;
        const sy = (-v.y * 0.5 + 0.5) * 100;
        a.el.style.left = `${sx}%`;
        a.el.style.top = `${sy}%`;
        if (a.ring) a.ring.visible = !a.el.classList.contains("collected");
      }

      if (container.clientWidth && renderer.domElement.width !== container.clientWidth * renderer.getPixelRatio()) {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    }

    function dispose() {
      cancelAnimationFrame(raf);
      mo.disconnect();
      container.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    animate();
    return { dispose };
  }

  Codex.scene3d = { mount };
})();
