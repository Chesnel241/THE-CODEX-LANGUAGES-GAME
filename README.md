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

## Nouveautés Phase 9 — VOIX DU JOUEUR, BIBLIOTHÈQUE & EXAMENS BLANCS

- 🎙️ **Studio Vocal — le joueur parle enfin** : écoutez le modèle (TTS natif),
  lisez la phrase à voix haute, le module vocal analyse votre **rythme de
  lecture** (durée parlée, pics de syllabes) en Web Audio **100 % local** —
  rien n'est enregistré ni transmis. Listening + Reading + **Speaking**.
  Repli « écoute active » avec auto-évaluation si le micro est refusé.
- 📚 **Bibliothèque des mots** : 384 mots de fréquence (96 par langue,
  8 thèmes : voyage, table, affaires, ville, urgences, sentiments,
  technologie, temps) avec glosses bilingues — consultables et écoutables,
  injectés dans l'Arène, le Daily Signal et l'index du chatbot ECHO.
- 🎓 **Examens Blancs type certification** (mission spéciale) : banques de
  sujets originales par langue — **TOEIC blanc** (anglais, score /990),
  **TCF blanc** (français), **DELE blanco** (espagnol), **Goethe blanko**
  (allemand) avec estimation CECRL. Conditions réelles : chrono, écoute
  limitée à 2, énoncés audio non affichés, corrections détaillées à la fin.
  Nouvelle médaille **🎓 Certifié** (≥ 80 %).
- 📡 **Contrôle Radio post-mission** : après chaque Carte Intel gagnée,
  lisez la phrase d'exemple à voix haute au micro pour « verrouiller »
  l'intel (+15 XP) — la parole entre dans la boucle de mission.
- 🔐 Permissions durcies : seul `media:audio` (micro) est autorisé, tout le
  reste demeure refusé ; analyse vocale sans aucun enregistrement.

## Nouveautés Phase 8 — RÈGLES DU JEU : MANUEL, PROTOCOLES & VISITE GUIDÉE

- 📖 **Manuel de l'Agent** : référence complète en jeu (concept, les 5 types
  de mission, score/XP/niveaux, médailles, Coffre-Fort, Arène, Console ECHO,
  globe des langues) — accessible depuis l'écran titre (avant même de
  s'enrôler), le QG et la fin de la visite guidée. Bilingue FR/EN.
- 📜 **Protocoles de mission** : à la première rencontre de chaque type de
  mission, une fiche de règles s'affiche (objectif, déroulé numéroté, barème
  exact). Re-consultable à tout moment via le bouton « ? » de la barre ECHO
  sur le terrain, ou depuis le Manuel.
- 🧭 **Visite guidée du QG** : à la première arrivée au QG, ECHO fait le tour
  des modules avec un projecteur lumineux (globe, transmission, mission en
  vedette, progression, modules) — passable, rejouable depuis le Manuel.
- 💾 Sauvegarde : champ `tutorial` (visite faite + protocoles vus) — les
  sauvegardes existantes migrent automatiquement.

## Nouveautés Phase 7 — GLOBE RÉEL, AVATARS & CINÉMATIQUE

- 🌍 **Vrai globe stratégique** : les continents et frontières **Natural
  Earth** (domaine public, via `world-atlas` + `topojson-client` vendorés)
  sont peints en texture équirectangulaire au montage — terres lumineuses,
  côtes au halo cyan, frontières fines, graticule, atmosphère et étoiles.
- 🛰️ **Panneau de renseignement pays** façon jeu de stratégie : survolez un
  marqueur du globe → drapeau, nom, langue, statut, missions accomplies et XP.
- 🧑‍🚀 **Vrais avatars stylisés** (`characters.js`) : jambes, torse, bras,
  tête expressive, chevelures variées, bonnets, chignons, lunettes, écharpe
  d'agent — respiration, regard qui balaie, cycle de marche procédural.
- 🚶 **Agent ZERO incarné** : votre agent apparaît dans chaque scène et
  **marche jusqu'aux points d'intérêt** que vous cliquez avant de les activer.
- 🎬 **Intro cinématique** : plan orbital de 2 s avec letterbox (barres noires
  glissantes) à l'entrée de chaque scène — désactivée en animations réduites.
- 🎞️ **Carton-titre façon film** pendant l'intro : ville et lieu de
  l'opération s'affichent en surimpression puis s'effacent.
- 🚶‍♀️ **PNJ déambulants** : des figurants marchent entre des points proches
  de leur position — la vie continue autour de l'agent.
- 🗣️ **Interlocuteur face caméra** dans les dialogues d'infiltration, éclairé
  en douche chaude, carte de dialogue déportée façon visual novel.

## Nouveautés Phase 6 — SCÈNES 3D TEMPS RÉEL

- 🎮 **Chaque mission se joue désormais dans un environnement 3D** (three.js) :
  8 décors low-poly construits procéduralement — restaurant aux lampes
  suspendues, pub au comptoir de cuivre, terrasse de café, open space aux
  écrans lumineux, marché aux auvents rayés, rue nocturne aux fenêtres
  allumées, quai de métro carrelé, gala au lustre doré.
- 🧍 **PNJ low-poly** en attente dans les scènes, éclairages dynamiques par
  ambiance (lampes ponctuelles, néons, guirlandes), brouillard de profondeur.
- 🎥 **Caméra vivante** : travelling d'entrée, dérive lente, parallaxe à la
  souris (désactivée en mode animations réduites).
- 📌 **Hotspots ancrés dans le monde 3D** : les points d'intérêt des missions
  sont projetés depuis l'espace 3D à chaque frame, avec anneaux lumineux au
  sol — sans aucun changement dans les moteurs de mission ni les tests.
- 🪂 **Repli automatique** sur les scènes CSS 2.5D si WebGL est indisponible.

## Nouveautés Phase 5 — UI « HOLO-OS »

- 🔤 **Typographie embarquée** : Space Mono + Inter (OFL) vendorées en woff2
  avec intégrité SHA-256 — les polices du GDD §12.3 enfin réelles, identiques
  sur toutes les machines.
- 🧭 **Iconographie vectorielle** : 26 icônes Lucide (ISC) extraites en JS
  embarqué (zéro fetch, CSP intacte) — navigation, types de mission, actions.
- 🏳️ **Drapeaux SVG faits main** : Windows n'affiche pas les emojis drapeaux
  (🇬🇧 → « GB ») ; 10 mini-drapeaux vectoriels garantissent un rendu identique
  partout (onboarding, QG, en-têtes, profil).
- 🖼️ **Panneaux holographiques** : équerres lumineuses cyan/violet sur les
  documents classifiés, cartes intel, popups, HUD d'Arène.
- 🌌 **Couches d'ambiance** : aurora dérivante animée + scanlines CRT subtiles
  sur le titre et le QG ; emblème animé (anneaux orbitaux + cœur hexagonal).
- ✨ **Micro-finitions** : balayage de brillance sur les boutons, accent
  latéral sur les choix de dialogue, barre d'actions du QG en icônes.

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
