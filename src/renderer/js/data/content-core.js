/**
 * THE CODEX — Données partagées entre tous les arcs linguistiques :
 * niveaux d'agent, médailles, carte mondiale. Les arcs (missions, ECHO,
 * quiz) sont enregistrés dans Codex.ARCS par les fichiers content-<lang>.js.
 */
"use strict";
window.Codex = window.Codex || {};

Codex.CONTENT = {
  // GDD §10.2 — noms localisés via i18n (lvl.<key>)
  levels: [
    { id: 1, key: "recrue", xp: 0, hints: Infinity },
    { id: 2, key: "operateur", xp: 500, hints: 3 },
    { id: 3, key: "elite", xp: 1500, hints: 1 },
    { id: 4, key: "fantome", xp: 3500, hints: 0 },
    { id: 5, key: "legende", xp: 7000, hints: 0 },
  ],

  // GDD §10.4 — libellés localisés via i18n (medal.<id>)
  medals: [
    { id: "premier_contact", icon: "🛸" },
    { id: "precision", icon: "🎯" },
    { id: "fantome", icon: "🥷" },
    { id: "silence_radio", icon: "🔕" },
    { id: "eclair", icon: "⚡" },
    { id: "explorateur", icon: "🔭" },
  ],

  // GDD §3.2 — positions sur la carte stylisée (viewBox 1000×520).
  // arcId : arc jouable correspondant (null = Phase 3).
  countries: [
    { id: "uk", lat: 54, lon: -2, flag: "🇬🇧", name: "Royaume-Uni · United Kingdom", lang: "Anglais (UK) · English", x: 468, y: 138, arcId: "en-UK" },
    { id: "fr", lat: 46.5, lon: 2.5, flag: "🇫🇷", name: "France", lang: "Français · French", x: 487, y: 172, arcId: "fr-FR" },
    { id: "us", lat: 39, lon: -98, flag: "🇺🇸", name: "États-Unis · United States", lang: "Anglais (US) · English (US)", x: 220, y: 195, arcId: null },
    { id: "es", lat: 40, lon: -3.5, flag: "🇪🇸", name: "Espagne · Spain", lang: "Espagnol · Spanish", x: 462, y: 205, arcId: "es-ES" },
    { id: "br", lat: -10, lon: -52, flag: "🇧🇷", name: "Brésil · Brazil", lang: "Portugais (BR) · Portuguese", x: 320, y: 350, arcId: null },
    { id: "de", lat: 51, lon: 10, flag: "🇩🇪", name: "Allemagne · Germany", lang: "Allemand · German", x: 520, y: 150, arcId: "de-DE" },
    { id: "jp", lat: 36, lon: 138, flag: "🇯🇵", name: "Japon · Japan", lang: "Japonais · Japanese", x: 858, y: 200, arcId: null },
    { id: "cn", lat: 35, lon: 103, flag: "🇨🇳", name: "Chine · China", lang: "Mandarin", x: 770, y: 215, arcId: null },
    { id: "sa", lat: 24, lon: 45, flag: "🇸🇦", name: "Arabie Saoudite · Saudi Arabia", lang: "Arabe (MSA) · Arabic", x: 600, y: 250, arcId: null },
    { id: "kr", lat: 36.5, lon: 128, flag: "🇰🇷", name: "Corée du Sud · South Korea", lang: "Coréen · Korean", x: 828, y: 195, arcId: null },
  ],
};

/** Arcs statiques (narration dans une seule L1) : en-UK, fr-FR. */
Codex.ARCS = {};

/** Fabriques d'arcs bilingues : id → (l1) => arc. Espagnol, allemand… */
Codex.ARC_FACTORIES = {};
const arcCache = {};

/** Résout un arc pour une L1 donnée (les fabriques sont mises en cache). */
Codex.getArc = function (id, l1) {
  if (Codex.ARCS[id]) return Codex.ARCS[id];
  const factory = Codex.ARC_FACTORIES[id];
  if (!factory) return null;
  const key = `${id}:${l1}`;
  if (!arcCache[key]) arcCache[key] = factory(l1);
  return arcCache[key];
};

/** Un arc est jouable si sa narration existe dans la langue de l'agent. */
Codex.isArcPlayable = function (id, l1) {
  if (Codex.ARC_FACTORIES[id]) return true; // bilingue
  const arc = Codex.ARCS[id];
  return Boolean(arc && arc.l1 === l1);
};

/** Tous les arcs jouables pour une L1 (onboarding, carte du QG). */
Codex.arcsFor = function (l1) {
  const out = [];
  for (const arc of Object.values(Codex.ARCS)) if (arc.l1 === l1) out.push(arc);
  for (const id of Object.keys(Codex.ARC_FACTORIES)) out.push(Codex.getArc(id, l1));
  return out;
};

/** Arc actif = langue d'apprentissage (L2) de l'agent. */
Codex.arc = function () {
  const l1 = (Codex.state && Codex.state.data.agent.l1) || "fr";
  const l2 = (Codex.state && Codex.state.data.agent.l2) || "en-UK";
  return Codex.getArc(l2, l1) || Codex.ARCS["en-UK"];
};
