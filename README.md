# THE CODEX — Desktop (Windows)

> *La langue est ton arme. Chaque mission, un nouveau pouvoir.*

Jeu d'aventure et d'espionnage où la langue est la mécanique centrale.
Application desktop **Electron** (Phase 2 du GDD §14.1), 100 % hors-ligne,
zéro dépendance runtime.

![Statut](https://img.shields.io/badge/statut-MVP%20jouable-00D4FF)
![Plateforme](https://img.shields.io/badge/plateforme-Windows%20x64-9B7EFF)

## Contenu jouable (Arc Londres — Anglais UK)

| # | Mission | Type | Objectif linguistique masqué |
|---|---|---|---|
| 1 | Opération FLAVOUR | 🔓 La Percée | Paradigme du verbe irrégulier **EAT** |
| 2 | Opération LAST ORDERS | 🕵️ L'Infiltration | Vocabulaire social du pub (+ Compteur de Suspicion) |
| 3 | Opération PAPER TRAIL | 📄 La Surveillance | Compréhension écrite — email professionnel |
| 4 | Opération HANDSHAKE | 🤝 La Négociation | Construction de phrases, accords, conditionnelle |
| 5 | Opération NIGHTLINE | 🔓 La Percée | Paradigme du verbe irrégulier **GO** |
| 6 | Opération CROWN JEWEL | 🎯 L'Extraction (Boss) | Synthèse en 3 phases, fins multiples selon score |

Systèmes implémentés : **ECHO** (IA de terrain, indices limités par niveau),
**Coffre-Fort** (collection d'intel + répétition espacée cachée + Challenge de
Révision), **Daily Agent Signal**, progression **XP / 5 niveaux d'agent**,
**6 médailles**, Cultural Intel, sound design synthétisé WebAudio (aucun asset
audio), prononciation TTS native Windows, QG avec carte mondiale.

## Obtenir le `.exe`

### Option A — via GitHub Actions (recommandé, aucun outil requis)

1. Onglet **Actions** du dépôt → workflow **« Build Windows .exe »** → *Run workflow*
2. Télécharger l'artefact **TheCodex-Windows** :
   - `TheCodex-Setup-0.1.0.exe` — installateur NSIS
   - `TheCodex-Portable-0.1.0.exe` — exécutable portable (sans installation)

### Option B — build local (sur Windows)

```bash
npm install        # installe electron + electron-builder
npm test           # validation syntaxe + schéma de contenu
npm run icon       # régénère build/icon.ico si besoin
npm run dist       # produit dist/TheCodex-Setup-*.exe et dist/TheCodex-Portable-*.exe
```

### Lancer en développement

```bash
npm start          # lance l'app
npm run dev        # + DevTools autorisés (F12)
```

## Architecture

```
src/
├── main/                 # Processus principal Electron (durci — voir SECURITY.md)
│   ├── main.js           # Fenêtre, sandbox, IPC sauvegarde validée
│   └── preload.js        # Pont contextBridge minimal (4 canaux)
└── renderer/             # Jeu (vanilla JS, CSP stricte, namespace Codex)
    ├── index.html
    ├── css/styles.css    # Design system Spy-Tech (tokens GDD §12.2)
    └── js/
        ├── core/         # audio (WebAudio), state (persistance), router, ui
        ├── data/         # content.js — missions, niveaux, médailles, ECHO
        ├── engines/      # percee, infiltration, negociation, surveillance, boss
        └── screens/      # title, hq, missions, briefing, intel, debrief,
                          # vault, profile, settings, daily
scripts/
├── generate-icon.js      # Icône .ico/.png générée en pur Node (zéro dépendance)
└── validate-content.js   # Tests CI : syntaxe + intégrité du contenu
```

**Sauvegarde** : `%APPDATA%/THE CODEX/codex-save.json` (écriture atomique,
mode 0600, schéma validé côté main process).

## Roadmap (extrait GDD §16)

- **Phase 2** : ECHO IA dynamique (API Claude), mode Hard, Arène PvP, nouvelles
  langues (FR/ES/JA/ZH/AR), missions bonus, audio natif studio.
- La structure de contenu (`content.js`) suit le schéma JSON du GDD §13.3 —
  l'ajout d'une mission ne demande aucune modification de code moteur.

## Sécurité

Voir [SECURITY.md](SECURITY.md) — sandbox, isolation de contexte, CSP
`connect-src 'none'`, IPC validé, zéro dépendance runtime.

---
*© CODEX Institute — Document confidentiel réservé à l'équipe fondatrice.*
