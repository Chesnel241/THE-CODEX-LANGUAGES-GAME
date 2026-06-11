# THE CODEX — Desktop (Windows)

> *La langue est ton arme. Chaque mission, un nouveau pouvoir.*
> *Language is your weapon. Every mission, a new power.*

Jeu d'aventure et d'espionnage où la langue est la mécanique centrale.
Application desktop **Electron**, 100 % hors-ligne, zéro dépendance runtime.

![Statut](https://img.shields.io/badge/statut-MVP%20Phase%202-00D4FF)
![Plateforme](https://img.shields.io/badge/plateforme-Windows%20x64-9B7EFF)
![Langues](https://img.shields.io/badge/langues-🇬🇧%20Anglais%20·%20🇫🇷%20Français-2ED573)

**🎮 Pour jouer : voir [GUIDE-INSTALLATION.md](GUIDE-INSTALLATION.md)** —
téléchargez le `.exe` depuis la page Releases, double-cliquez, jouez.

## Nouveautés Phase 4

- ⚡ **Arène — Blitz d'Infiltration** (GDD §6.3) : défi chronométré en continu.
  Bonne réponse = points × combo + bonus de temps ; erreur = pénalité et combo
  brisé. Record par langue, nouveau record = +80 XP. Musique qui se tend,
  battement de cœur sous 10 s.
- 🇪🇸🇩🇪 **Deux nouvelles langues : Espagnol (Madrid) et Allemand (Berlin)** —
  4 missions chacune (Percée, Infiltration, Surveillance, Négociation),
  **arcs bilingues** : jouables par les agents francophones ET anglophones
  (la narration est générée dans la langue du joueur).
- 📚 **Bases de connaissances ES/DE** : 50 verbes conjugués (ser/estar, pince
  verbale allemande, haben/sein…), 24 fiches de grammaire, 32 expressions,
  14 dossiers culturels — le chatbot ECHO les maîtrise dans les deux langues
  d'interface.
- 🗣️ **Voix d'ECHO** : ECHO lit ses interventions et ses réponses de console à
  voix haute (synthèse vocale dans la langue de l'agent, voix neurales
  Windows 11 privilégiées, débit GDD §11.7). Activable dans les Paramètres.
- 🎵 Deux nouveaux thèmes musicaux génératifs : cadence andalouse pour Madrid,
  motorik minimal pour Berlin.
- 🧠 Module de quiz unifié (Daily Signal, Challenge de Révision, Arène) avec
  QCM générés automatiquement depuis les conjugaisons de la base.

## Nouveautés Phase 3

- 🛰️ **Console ECHO — chatbot intelligent 100 % hors-ligne** : ECHO maîtrise
  toute la base de connaissances du jeu (verbes, grammaire, phrasebook,
  culture, cartes intel, règles du jeu) via un moteur d'intentions +
  recherche floue par jeton (Fuse.js) + conjugaison NLP à la volée
  (compromise). Conversations bilingues FR/EN, blocs de conjugaison,
  pistes connexes, suggestions, prononciation TTS. 38 tests unitaires.
- 🌍 **Globe 3D au QG** (three.js) : graticule, étoiles, marqueurs de pays
  pulsants et cliquables, rotation auto + glisser-déposer — avec repli
  automatique sur la carte SVG si WebGL est indisponible.
- 📚 **Base de connaissances enrichie** : 60 verbes irréguliers anglais,
  32 conjugaisons françaises complètes (présent ×6, passé composé avec
  auxiliaire, futur, imparfait), 24 fiches de grammaire, 36 expressions de
  phrasebook, 16 dossiers culturels.
- ✨ **Animations** : lecteur Lottie (radar de transmission, coche de
  réussite — créations originales embarquées, zéro fetch) + micro-animations
  anime.js (cascades, barres XP élastiques).
- 🔐 **Chaîne d'approvisionnement durcie** : 5 librairies vendorées et
  épinglées, manifeste d'intégrité SHA-256 vérifié en CI (voir SECURITY.md).

## Nouveautés Phase 2

- 🎵 **Musique adaptative générative** (GDD §11.2) — bande-son procédurale
  WebAudio en 4 états (calme → exploration → tension → climax) qui suit la
  pression de la mission. Palette par langue : jazz électronique feutré pour
  Londres, valse manouche pour Paris. Aucun fichier audio : tout est synthétisé.
- 🇫🇷 **Second arc complet : Paris** — 6 missions d'apprentissage du français
  (MANGER, ALLER, tu/vous, passé composé avec être…), narration en anglais.
- 🧭 **Onboarding agent** — au premier lancement : langue parlée, langue
  d'apprentissage (le « théâtre d'opérations »), nom de code.
- 🌐 **Interface bilingue FR/EN** — toute la chrome UI suit la langue du joueur.
- 🎨 **UI modernisée** — typographie plus lisible, contrastes relevés, surfaces
  en dégradé, flou d'arrière-plan, toasts ; scènes 2.5D enrichies (halo
  lumineux, sol en perspective, skyline, particules dérivantes).
- 🎞️ **Flashbacks** (GDD §9.2) — chaque carte Intel rejoue son « moment de
  découverte » depuis le Coffre-Fort.
- 📦 **Release automatique** — un tag `v*` publie les `.exe` sur la page Releases.

## Contenu jouable

### 🇬🇧 Arc Londres (pour francophones) — Anglais UK
| # | Mission | Type | Objectif linguistique masqué |
|---|---|---|---|
| 1 | Opération FLAVOUR | 🔓 La Percée | Verbe irrégulier **EAT** |
| 2 | Opération LAST ORDERS | 🕵️ L'Infiltration | Vocabulaire social du pub + Suspicion |
| 3 | Opération PAPER TRAIL | 📄 La Surveillance | Email professionnel |
| 4 | Opération HANDSHAKE | 🤝 La Négociation | Construction de phrases, conditionnelle |
| 5 | Opération NIGHTLINE | 🔓 La Percée | Verbe irrégulier **GO** |
| 6 | Opération CROWN JEWEL | 🎯 L'Extraction (Boss) | Synthèse, 3 phases, fins multiples |

### 🇫🇷 Arc Paris (for English speakers) — French
| # | Mission | Type | Hidden linguistic objective |
|---|---|---|---|
| 1 | Operation TERRASSE | 🔓 La Percée | The -ER verb **MANGER** |
| 2 | Operation ZINC | 🕵️ L'Infiltration | Bistro rituals, tu/vous + Suspicion |
| 3 | Operation COURRIER | 📄 La Surveillance | Formal French memo |
| 4 | Operation RIVE GAUCHE | 🤝 La Négociation | Sentence building, agreements |
| 5 | Operation DERNIER MÉTRO | 🔓 La Percée | Irregular verb **ALLER** (être!) |
| 6 | Operation BELLE ÉPOQUE | 🎯 L'Extraction (Boss) | Synthesis, 3 phases, multiple endings |

Systèmes : **ECHO** (IA de terrain, indices limités par niveau), **Coffre-Fort**
(répétition espacée cachée + Challenge de Révision + Flashbacks), **Daily Agent
Signal**, XP / 5 niveaux par langue, 6 médailles, Cultural Intel, prononciation
TTS native (en-GB / fr-FR), QG avec carte mondiale et bascule de théâtre.

## Obtenir le `.exe`

### Option A — page Releases (recommandé)
Chaque tag `v*` publie automatiquement `TheCodex-Setup-*.exe` (installateur)
et `TheCodex-Portable-*.exe` sur la page **Releases**. Pas-à-pas (et passage
SmartScreen) dans [GUIDE-INSTALLATION.md](GUIDE-INSTALLATION.md).

### Option B — GitHub Actions
Onglet **Actions** → **« Build Windows .exe »** → *Run workflow* → artefact
**TheCodex-Windows**.

### Option C — build local (sur Windows)
```bash
npm install        # installe electron + electron-builder
npm test           # validation syntaxe + schéma de contenu (2 arcs)
npm run dist       # produit dist/TheCodex-Setup-*.exe et dist/TheCodex-Portable-*.exe
```

### Développement
```bash
npm start                              # lance l'app
npm run dev                            # + DevTools autorisés (F12)
npx electron scripts/smoke-test.js    # test bout-en-bout (joue les 2 arcs)
```

## Architecture

```
src/
├── main/                 # Processus principal Electron (durci — voir SECURITY.md)
│   ├── main.js           # Fenêtre, sandbox, IPC sauvegarde validée (v1+v2)
│   └── preload.js        # Pont contextBridge minimal (4 canaux)
└── renderer/             # Jeu (vanilla JS, CSP stricte, namespace Codex)
    ├── index.html
    ├── css/styles.css    # Design system Spy-Tech v2 (tokens GDD §12.2)
    └── js/
        ├── core/         # audio (SFX WebAudio), music (bande-son générative),
        │                 # state (persistance v2 multi-langues), router, ui
        ├── data/         # i18n (FR/EN), content-core (niveaux, médailles, carte),
        │                 # content-en (arc Londres), content-fr (arc Paris)
        ├── engines/      # percee, infiltration, negociation, surveillance, boss
        └── screens/      # title, onboarding, hq, missions, briefing, intel,
                          # debrief, vault, profile, settings, daily
scripts/
├── generate-icon.js      # Icône .ico/.png générée en pur Node (zéro dépendance)
├── validate-content.js   # Tests CI : syntaxe + intégrité des 2 arcs
└── smoke-test.js         # Test bout-en-bout : onboarding + missions des 2 langues
```

**Sauvegarde** : `%APPDATA%/THE CODEX/codex-save.json` (écriture atomique,
mode 0600, schéma validé côté main, migration v1→v2 automatique).

**Ajouter une langue** : créer `content-<lang>.js` enregistrant un arc dans
`Codex.ARCS` (schéma GDD §13.3), référencer l'`arcId` dans `content-core.js`
et ajouter un thème dans `music.js` — aucun changement moteur nécessaire.

## Roadmap (extrait GDD §16)

- **Phase 3** : ECHO IA dynamique (API Claude), mode Hard, Arène PvP,
  nouvelles langues (ES/JA/ZH/AR), missions bonus, audio natif studio.

## Sécurité

Voir [SECURITY.md](SECURITY.md) — sandbox, isolation de contexte, CSP
`connect-src 'none'`, IPC validé, zéro dépendance runtime.

---
*© CODEX Institute — Document confidentiel réservé à l'équipe fondatrice.*
