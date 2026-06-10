# 🎮 THE CODEX — Guide d'installation Windows

> Vous voulez juste jouer ? Suivez les 3 étapes ci-dessous. Aucun outil de
> développement n'est nécessaire.

## Étape 1 — Télécharger le jeu

### Option A : depuis la page Releases (le plus simple)

1. Ouvrez la page **Releases** du dépôt GitHub :
   `https://github.com/Chesnel241/THE-CODEX-LANGUAGES-GAME/releases`
2. Sous la dernière version, téléchargez **l'un** de ces deux fichiers :

| Fichier | C'est quoi ? | Pour qui ? |
|---|---|---|
| `TheCodex-Setup-X.Y.Z.exe` | Installateur classique (raccourci menu Démarrer, désinstallateur) | Recommandé |
| `TheCodex-Portable-X.Y.Z.exe` | Un seul fichier, rien à installer, lancez-le où vous voulez (clé USB incluse) | Sans droits admin |

### Option B : depuis GitHub Actions (dernière version de développement)

1. Onglet **Actions** du dépôt → workflow **« Build Windows .exe »**
2. Cliquez sur la dernière exécution verte → section **Artifacts**
3. Téléchargez **TheCodex-Windows** (un .zip contenant les deux .exe)

## Étape 2 — Passer l'avertissement SmartScreen (normal)

Le jeu n'est pas (encore) signé numériquement. Au premier lancement, Windows
affichera probablement un écran bleu « Windows a protégé votre ordinateur » :

1. Cliquez sur **« Informations complémentaires »**
2. Cliquez sur **« Exécuter quand même »**

C'est tout — l'avertissement n'apparaît qu'une fois. (Pourquoi cet écran ?
Tout .exe non signé par un certificat payant déclenche SmartScreen. Le code
source du jeu est public et auditable dans ce dépôt.)

## Étape 3 — Jouer

1. Au premier lancement, le jeu vous demande :
   - **votre langue** (français ou anglais) ;
   - **la langue que vous voulez maîtriser** (anglais → arc Londres,
     français → arc Paris) ;
   - votre **nom de code** d'agent.
2. Votre progression est sauvegardée automatiquement, en local uniquement :
   `%APPDATA%\THE CODEX\codex-save.json`
3. Le jeu fonctionne **100 % hors-ligne** — aucune connexion, aucun compte.

## Raccourcis utiles

| Touche | Action |
|---|---|
| `F11` | Plein écran |

## Désinstaller

- **Version Setup** : Paramètres Windows → Applications → THE CODEX → Désinstaller
  (votre sauvegarde dans `%APPDATA%\THE CODEX` est conservée).
- **Version Portable** : supprimez simplement le .exe.

## Problèmes connus

| Symptôme | Solution |
|---|---|
| Pas de voix lors de « Écouter la prononciation » | Windows : Paramètres → Heure et langue → Voix → installer une voix anglaise/française |
| L'antivirus met le fichier en quarantaine | Binaire non signé : restaurez-le et ajoutez une exclusion, ou compilez depuis les sources (`npm install && npm run dist`) |
| Écran noir au lancement | Mettez à jour vos pilotes graphiques, ou lancez avec `--disable-gpu` |
