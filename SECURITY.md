# THE CODEX — Posture de sécurité (DevSecOps)

Application desktop Electron **100 % hors-ligne** : aucune donnée ne quitte la
machine de l'utilisateur. Ce document décrit les mesures de durcissement
appliquées et le modèle de menace retenu.

## Modèle de menace

| Actif | Menace | Mitigation |
|---|---|---|
| Machine de l'utilisateur | Exécution de code via le renderer | Sandbox Chromium + isolation de contexte + CSP stricte |
| Sauvegarde locale | Corruption / payload malveillant | Validation de schéma côté main + borne de taille 1 Mo + écriture atomique |
| Chaîne d'approvisionnement | Dépendance compromise | **Zéro dépendance runtime** ; 2 devDependencies (electron, electron-builder) verrouillées par lockfile |
| Distribution | Binaire altéré | Build reproductible en CI GitHub Actions ; signature de code possible (voir ci-dessous) |

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
