/**
 * THE CODEX — Mini-drapeaux SVG (créations originales, formes simplifiées).
 * Windows n'affiche pas les emojis drapeaux (🇬🇧 → « GB ») : ces vecteurs
 * garantissent un rendu identique partout. ViewBox 24×16, embarqués en JS
 * (CSP : aucun fetch).
 */
"use strict";
window.Codex = window.Codex || {};

Codex.FLAGS = {
  gb: '<rect width="24" height="16" fill="#012169"/><path d="M0,0 24,16 M24,0 0,16" stroke="#fff" stroke-width="3.2"/><path d="M0,0 24,16 M24,0 0,16" stroke="#C8102E" stroke-width="1.6"/><path d="M12,0 V16 M0,8 H24" stroke="#fff" stroke-width="5"/><path d="M12,0 V16 M0,8 H24" stroke="#C8102E" stroke-width="3"/>',
  fr: '<rect width="8" height="16" fill="#0055A4"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#EF4135"/>',
  es: '<rect width="24" height="16" fill="#AA151B"/><rect y="4" width="24" height="8" fill="#F1BF00"/>',
  de: '<rect width="24" height="5.33" fill="#0a0a0a"/><rect y="5.33" width="24" height="5.34" fill="#DD0000"/><rect y="10.67" width="24" height="5.33" fill="#FFCE00"/>',
  us: '<rect width="24" height="16" fill="#B22234"/><path d="M0,2.46 H24 M0,4.92 H24 M0,7.38 H24 M0,9.85 H24 M0,12.31 H24 M0,14.77 H24" stroke="#fff" stroke-width="1.23"/><rect width="10.5" height="8.6" fill="#3C3B6E"/>',
  br: '<rect width="24" height="16" fill="#009C3B"/><path d="M12,1.5 22.5,8 12,14.5 1.5,8 Z" fill="#FFDF00"/><circle cx="12" cy="8" r="3.4" fill="#002776"/>',
  jp: '<rect width="24" height="16" fill="#fff"/><rect width="24" height="16" fill="none" stroke="#e5e7eb" stroke-width="0.5"/><circle cx="12" cy="8" r="4.4" fill="#BC002D"/>',
  cn: '<rect width="24" height="16" fill="#DE2910"/><path d="M4.5,2.2 5.6,5.2 8.8,5.2 6.2,7.1 7.2,10.1 4.5,8.3 1.8,10.1 2.8,7.1 0.2,5.2 3.4,5.2 Z" fill="#FFDE00" transform="scale(0.9) translate(1.2,0.8)"/>',
  sa: '<rect width="24" height="16" fill="#165d31"/><rect x="4" y="6.4" width="16" height="1.6" rx="0.8" fill="#fff"/><rect x="6" y="10" width="12" height="1.2" rx="0.6" fill="#fff"/>',
  kr: '<rect width="24" height="16" fill="#fff"/><rect width="24" height="16" fill="none" stroke="#e5e7eb" stroke-width="0.5"/><path d="M12,4.2 a3.8,3.8 0 0 1 0,7.6 a1.9,1.9 0 0 1 0,-3.8 a1.9,1.9 0 0 0 0,-3.8 Z" fill="#CD2E3A"/><path d="M12,11.8 a3.8,3.8 0 0 1 0,-7.6 a1.9,1.9 0 0 1 0,3.8 a1.9,1.9 0 0 0 0,3.8 Z" fill="#0047A0"/>',
};

/** Codes pays → code drapeau (carte mondiale, arcs). */
Codex.FLAG_BY_LANG = {
  "en-UK": "gb",
  "fr-FR": "fr",
  "es-ES": "es",
  "de-DE": "de",
};
