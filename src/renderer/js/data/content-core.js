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
    { id: "uk", flag: "🇬🇧", name: "Royaume-Uni · United Kingdom", lang: "Anglais (UK) · English", x: 468, y: 138, arcId: "en-UK" },
    { id: "fr", flag: "🇫🇷", name: "France", lang: "Français · French", x: 487, y: 172, arcId: "fr-FR" },
    { id: "us", flag: "🇺🇸", name: "États-Unis · United States", lang: "Anglais (US) · English (US)", x: 220, y: 195, arcId: null },
    { id: "es", flag: "🇪🇸", name: "Espagne · Spain", lang: "Espagnol · Spanish", x: 462, y: 205, arcId: null },
    { id: "br", flag: "🇧🇷", name: "Brésil · Brazil", lang: "Portugais (BR) · Portuguese", x: 320, y: 350, arcId: null },
    { id: "de", flag: "🇩🇪", name: "Allemagne · Germany", lang: "Allemand · German", x: 520, y: 150, arcId: null },
    { id: "jp", flag: "🇯🇵", name: "Japon · Japan", lang: "Japonais · Japanese", x: 858, y: 200, arcId: null },
    { id: "cn", flag: "🇨🇳", name: "Chine · China", lang: "Mandarin", x: 770, y: 215, arcId: null },
    { id: "sa", flag: "🇸🇦", name: "Arabie Saoudite · Saudi Arabia", lang: "Arabe (MSA) · Arabic", x: 600, y: 250, arcId: null },
    { id: "kr", flag: "🇰🇷", name: "Corée du Sud · South Korea", lang: "Coréen · Korean", x: 828, y: 195, arcId: null },
  ],
};

/** Registre des arcs linguistiques (rempli par content-en.js / content-fr.js). */
Codex.ARCS = {};

/** Arc actif = langue d'apprentissage (L2) de l'agent. */
Codex.arc = function () {
  const l2 = (Codex.state && Codex.state.data.agent.l2) || "en-UK";
  return Codex.ARCS[l2] || Codex.ARCS["en-UK"];
};
