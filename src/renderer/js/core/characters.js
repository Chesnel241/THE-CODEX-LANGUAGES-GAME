/**
 * THE CODEX — Fabrique de personnages 3D stylisés (three.js).
 * Avatars low-poly « cute-réalistes » : jambes, torse, bras, mains, tête
 * avec chevelure et yeux — palettes variées, accessoires (bonnet, chignon,
 * lunettes). Animations procédurales : respiration, regard, balancement,
 * cycle de marche. Utilisé par scene3d (PNJ + agent ZERO).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const SKINS = [0xf2cba8, 0xe0a878, 0xb97f57, 0x8a5a3b, 0xf6d7bd];
  const HAIRS = [0x2b2118, 0x4a3220, 0x141414, 0x7a4a22, 0xb8b8c0, 0x803a2a];
  const TOPS  = [0x7a4a8a, 0x3a6a9a, 0x4a8a5a, 0xb8554a, 0xc88a3a, 0x556677, 0x8a3a6a];
  const BOTTOMS = [0x2c3a52, 0x3a3430, 0x44324a, 0x24404a];

  function std(color, opts = {}) {
    return new window.THREE.MeshStandardMaterial({
      color, flatShading: true, roughness: opts.roughness ?? 0.9, metalness: 0.04,
    });
  }

  function pick(arr, i) { return arr[i % arr.length]; }

  /**
   * Crée un avatar. opts : { seed, palette?, hat?, bun?, glasses?, coat? }
   * Retourne un Group avec userData.rig = { head, armL, armR, legL, legR, torso }.
   */
  function create(opts = {}) {
    const THREE = window.THREE;
    const seed = opts.seed ?? Math.floor(Math.random() * 999);
    const skin = std(opts.skin ?? pick(SKINS, seed));
    const hairC = opts.hair ?? pick(HAIRS, seed * 3 + 1);
    const topC = opts.top ?? pick(TOPS, seed * 7 + 2);
    const botC = opts.bottom ?? pick(BOTTOMS, seed * 5 + 1);

    const g = new THREE.Group();
    const rig = {};

    // Jambes
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.155, 0.46, 0.17), std(botC));
      leg.position.set(side * 0.105, 0.23, 0);
      g.add(leg);
      rig[side < 0 ? "legL" : "legR"] = leg;
      // Chaussures
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.09, 0.24), std(0x1c1c22));
      shoe.position.set(side * 0.105, 0.045, 0.025);
      g.add(shoe);
      rig[side < 0 ? "shoeL" : "shoeR"] = shoe;
    }

    // Torse (manteau long pour l'agent)
    const torsoH = opts.coat ? 0.72 : 0.58;
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, torsoH, 0.3), std(topC));
    torso.position.y = 0.46 + torsoH / 2 - (opts.coat ? 0.1 : 0);
    g.add(torso);
    rig.torso = torso;
    // Épaules adoucies
    const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.255, 0.1, 2, 8), std(topC));
    shoulders.rotation.z = Math.PI / 2;
    shoulders.position.y = torso.position.y + torsoH / 2 - 0.06;
    g.add(shoulders);

    // Écharpe d'agent (accent cyan)
    if (opts.coat) {
      const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.34), std(0x00a8cc, { roughness: 0.7 }));
      scarf.position.y = torso.position.y + torsoH / 2 + 0.02;
      g.add(scarf);
    }

    // Bras + mains
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.34, 2, 8), std(topC));
      arm.position.set(side * 0.34, torso.position.y + 0.08, 0);
      arm.rotation.z = side * 0.1;
      g.add(arm);
      rig[side < 0 ? "armL" : "armR"] = arm;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), skin);
      hand.position.set(side * 0.375, torso.position.y - 0.22, 0);
      g.add(hand);
      rig[side < 0 ? "handL" : "handR"] = hand;
    }

    // Tête : groupe pivotable
    const headG = new THREE.Group();
    const headY = 0.46 + torsoH + 0.16 - (opts.coat ? 0.1 : 0);
    headG.position.y = headY;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), skin);
    headG.add(head);

    // Chevelure : calotte + variantes (bonnet / chignon / mèche)
    const style = seed % 4;
    if (opts.hat || style === 3) {
      const hat = new THREE.Mesh(new THREE.SphereGeometry(0.215, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), std(pick(TOPS, seed + 3)));
      hat.position.y = 0.045;
      headG.add(hat);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.03, 14), std(pick(TOPS, seed + 3)));
      brim.position.y = 0.03;
      headG.add(brim);
    } else {
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.222, 12, 9, 0, Math.PI * 2, 0, Math.PI / 1.8), std(hairC));
      hair.position.y = 0.02;
      headG.add(hair);
      if (style === 1 || opts.bun) {
        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), std(hairC));
        bun.position.set(0, 0.16, -0.16);
        headG.add(bun);
      }
      if (style === 2) {
        // Cheveux longs : pans latéraux
        for (const s of [-1, 1]) {
          const lock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.14), std(hairC));
          lock.position.set(s * 0.18, -0.1, -0.04);
          headG.add(lock);
        }
      }
    }

    // Yeux
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 6), std(0x141821, { roughness: 0.3 }));
      eye.position.set(s * 0.075, 0.015, 0.185);
      headG.add(eye);
    }
    // Lunettes
    if (opts.glasses || seed % 5 === 4) {
      for (const s of [-1, 1]) {
        const lens = new THREE.Mesh(
          new THREE.TorusGeometry(0.05, 0.009, 6, 12),
          std(0x222a36, { roughness: 0.4 })
        );
        lens.position.set(s * 0.075, 0.015, 0.196);
        headG.add(lens);
      }
    }

    g.add(headG);
    rig.head = headG;

    g.userData.rig = rig;
    g.userData.charAnim = { phase: Math.random() * Math.PI * 2, torsoY: torso.position.y };
    if (opts.scale) g.scale.setScalar(opts.scale);
    return g;
  }

  /** Anime un personnage : idle (respiration, regard) ou marche (cycle). */
  function animate(g, t, walking) {
    const rig = g.userData.rig;
    const a = g.userData.charAnim;
    if (!rig || !a) return;
    if (walking) {
      const w = t * 9 + a.phase;
      rig.legL.rotation.x = Math.sin(w) * 0.65;
      rig.legR.rotation.x = -Math.sin(w) * 0.65;
      rig.armL.rotation.x = -Math.sin(w) * 0.5;
      rig.armR.rotation.x = Math.sin(w) * 0.5;
      rig.torso.position.y = a.torsoY + Math.abs(Math.sin(w)) * 0.03; // rebond du pas
      rig.head.rotation.y = 0;
    } else {
      const w = t * 1.6 + a.phase;
      rig.legL.rotation.x *= 0.85;
      rig.legR.rotation.x *= 0.85;
      rig.armL.rotation.x *= 0.85;
      rig.armR.rotation.x *= 0.85;
      rig.torso.position.y = a.torsoY;
      rig.torso.scale.y = 1 + Math.sin(w) * 0.012;          // respiration
      rig.head.rotation.y = Math.sin(t * 0.45 + a.phase) * 0.35; // regard qui balaie
      rig.head.rotation.x = Math.sin(t * 0.3 + a.phase * 2) * 0.06;
      rig.armL.rotation.z = 0.1 + Math.sin(w) * 0.025;
      rig.armR.rotation.z = -0.1 - Math.sin(w + 1) * 0.025;
    }
  }

  Codex.characters = { create, animate };
})();
