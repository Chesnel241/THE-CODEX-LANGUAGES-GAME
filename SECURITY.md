# THE CODEX — Posture de sécurité (DevSecOps)

Application desktop Electron **100 % hors-ligne** : aucune donnée ne quitte la
machine de l'utilisateur. Ce document décrit les mesures de durcissement
appliquées et le modèle de menace retenu.

## Modèle de menace

| Actif | Menace | Mitigation |
|---|---|---|
| Machine de l'utilisateur | Exécution de code via le renderer | Sandbox Chromium + isolation de contexte + CSP stricte |
| Sauvegarde locale | Corruption / payload malveillant | Validation de schéma côté main + borne de taille 1 Mo + écriture atomique |
| Chaîne d'approvisionnement | Dépendance compromise | Librairies **vendorées et épinglées** avec manifeste SHA-256 vérifié en CI (voir ci-dessous) ; devDependencies verrouillées par lockfile |
| Distribution | Binaire altéré | Build reproductible en CI GitHub Actions ; signature de code possible (voir ci-dessous) |
| Entrée libre (chatbot ECHO) | Injection via la saisie | Traitement texte pur (aucune éval), borne 300 caractères, affichage par `textContent` uniquement |

## Librairies vendorées (politique de chaîne d'approvisionnement)

Le renderer embarque ces librairies open source, **copiées localement** dans
`src/renderer/vendor/` (la CSP `script-src 'self'` interdit tout CDN) :

| Librairie | Version épinglée | Licence | Usage |
|---|---|---|---|
| three | 0.149.0 | MIT | Globe 3D du QG + scènes de mission |
| lottie-web | 5.x | MIT | Animations vectorielles (créations originales embarquées) |
| animejs | 3.2.2 | MIT | Micro-animations UI |
| fuse.js | 6.6.2 | Apache-2.0 | Recherche floue du chatbot ECHO |
| compromise | 14.x | MIT | Conjugaison anglaise NLP hors base |
| topojson-client | 3.x | ISC | Décodage des frontières mondiales (globe) |
| world-atlas | 2.x | ISC / Natural Earth (domaine public) | Frontières Natural Earth 110m (JS embarqué) |
| @fontsource/inter + space-mono | 5.x | OFL-1.1 | Typographie embarquée (GDD §12.3) |
| lucide-static | 1.x | ISC | Icônes vectorielles (extraites en JS embarqué) |

Contrôles :
- `src/renderer/vendor/vendor-manifest.json` fige **l'empreinte SHA-256** de
  chaque fichier ; `node scripts/vendor.js --verify` échoue la CI à la moindre
  altération (exécuté par `npm test`)
- Mise à jour uniquement via `npm run vendor` (re-copie depuis des versions
  épinglées + régénération du manifeste, diff auditables en revue)
- Aucune de ces librairies n'accède au réseau ; `connect-src 'none'` le
  garantit au niveau plateforme

## Durcissement Electron

- `app.enableSandbox()` — sandbox Chromium pour tous les renderers
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- Preload minimal : 4 canaux IPC nommés exposés via `contextBridge`, aucune API Node
- **CSP stricte** dans `index.html` : `default-src 'none'`, `connect-src 'none'`,
  `script-src 'self'` — aucun chargement distant, aucun appel réseau, aucun
  script inline possible. Seul `style-src` autorise `'unsafe-inline'`
  (styles cosmétiques des templates ; sans exécution de script et avec
  échappement systématique du texte, le risque résiduel est négligeable)
- `will-navigate` bloqué, `setWindowOpenHandler` → deny, `will-attach-webview` → deny
- Toutes les permissions web refusées (`setPermissionRequestHandler` → false)
- DevTools désactivés hors mode `--dev`
- Menu applicatif supprimé, instance unique (`requestSingleInstanceLock`)
- Aucun gestionnaire d'auto-update non signé (`publish: null`)

## IPC & données

- Le renderer ne peut **que** lire/écrire/réinitialiser la sauvegarde et lire la version
- Le main process valide chaque payload : type objet, `version` attendue, taille ≤ 1 Mo
- Écriture **atomique** (fichier temporaire + rename) en mode `0600`
- Tout texte injecté dans le DOM passe par un échappement HTML systématique (`Codex.ui.esc`)

## Signature de code (recommandé pour la distribution publique)

Les binaires produits par le CI ne sont **pas signés**. Pour éviter les
avertissements SmartScreen en production :

1. Obtenir un certificat de signature de code (OV ou EV)
2. Renseigner les secrets `CSC_LINK` / `CSC_KEY_PASSWORD` dans GitHub Actions
3. electron-builder signera automatiquement les `.exe`

## Signaler une vulnérabilité

Ouvrir une *security advisory* GitHub privée sur ce dépôt. Ne pas divulguer
publiquement avant correctif.
