/**
 * THE CODEX — Processus principal Electron.
 *
 * Durcissement sécurité (DevSecOps) :
 *  - Sandbox Chromium activé globalement
 *  - contextIsolation + nodeIntegration désactivé dans le renderer
 *  - Toute navigation et ouverture de fenêtre refusées
 *  - Permissions refusées sauf micro (Studio Vocal, analyse 100 % locale)
 *  - IPC minimal et validé (sauvegarde locale uniquement)
 *  - Écriture de sauvegarde atomique (tmp + rename)
 */
"use strict";

const { app, BrowserWindow, ipcMain, session, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

const IS_DEV = process.argv.includes("--dev");
const SAVE_VERSIONS = [1, 2]; // v1 : MVP ; v2 : multi-langues (migré côté renderer)
const SAVE_MAX_BYTES = 1024 * 1024; // 1 Mo — borne dure anti-abus

// Sandbox pour tous les renderers, avant app.ready.
// Seule exception : développement explicite (--dev ET --no-sandbox), pour les
// conteneurs Linux sans sandbox SUID. En production, toujours actif.
if (!(IS_DEV && process.argv.includes("--no-sandbox"))) {
  app.enableSandbox();
}

// Une seule instance de l'application
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

function savePath() {
  return path.join(app.getPath("userData"), "codex-save.json");
}

/** Validation stricte du payload de sauvegarde côté main. */
function isValidSave(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if (!SAVE_VERSIONS.includes(data.version)) return false;
  let serialized;
  try {
    serialized = JSON.stringify(data);
  } catch {
    return false;
  }
  return Buffer.byteLength(serialized, "utf8") <= SAVE_MAX_BYTES;
}

/** Écriture atomique : on n'écrase jamais la sauvegarde par un fichier partiel. */
function atomicWrite(filePath, content) {
  const tmp = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, content, { encoding: "utf8", mode: 0o600 });
  fs.renameSync(tmp, filePath);
}

function registerIpc() {
  ipcMain.handle("save:read", () => {
    try {
      const raw = fs.readFileSync(savePath(), "utf8");
      if (Buffer.byteLength(raw, "utf8") > SAVE_MAX_BYTES) return null;
      const data = JSON.parse(raw);
      return isValidSave(data) ? data : null;
    } catch {
      return null; // pas de sauvegarde, ou corrompue → l'app repart proprement
    }
  });

  ipcMain.handle("save:write", (_event, data) => {
    if (!isValidSave(data)) return { ok: false, error: "invalid-payload" };
    try {
      atomicWrite(savePath(), JSON.stringify(data));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: IS_DEV ? String(err) : "write-failed" };
    }
  });

  ipcMain.handle("save:reset", () => {
    try {
      fs.rmSync(savePath(), { force: true });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

  ipcMain.handle("app:info", () => ({
    version: app.getVersion(),
    platform: process.platform,
  }));
}

function hardenSession() {
  // Seul le micro (Studio Vocal — analyse locale, jamais transmise) est
  // autorisé ; toute autre permission web est refusée.
  function micOnly(permission, details) {
    if (permission !== "media") return false;
    const d = details || {};
    if (Array.isArray(d.mediaTypes)) return d.mediaTypes.length > 0 && d.mediaTypes.every((t) => t === "audio");
    return d.mediaType === "audio"; // PermissionCheckHandler (forme singulière)
  }
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback, details) => {
    callback(micOnly(permission, details));
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission, _origin, details) => micOnly(permission, details));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: "#060A12",
    title: "THE CODEX",
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      devTools: IS_DEV,
    },
  });

  win.loadFile(path.join(__dirname, "..", "renderer", "index.html"));

  win.once("ready-to-show", () => win.show());

  // Aucune navigation externe : l'app est 100 % locale et hors-ligne.
  win.webContents.on("will-navigate", (event) => event.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  // F11 plein écran ; F12 DevTools en mode développement uniquement.
  win.webContents.on("before-input-event", (_event, input) => {
    if (input.type !== "keyDown") return;
    if (input.key === "F11") win.setFullScreen(!win.isFullScreen());
    if (input.key === "F12" && IS_DEV) win.webContents.toggleDevTools();
  });

  return win;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  hardenSession();
  registerIpc();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Défense en profondeur : refuser tout webContents non prévu (webview, etc.)
app.on("web-contents-created", (_event, contents) => {
  contents.on("will-attach-webview", (event) => event.preventDefault());
});
