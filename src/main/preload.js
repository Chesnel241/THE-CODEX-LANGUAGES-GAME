/**
 * THE CODEX — Preload.
 * Pont minimal et explicite entre le renderer sandboxé et le main process.
 * Aucune API Node n'est exposée — uniquement 4 canaux IPC nommés.
 */
"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("codexBridge", {
  readSave: () => ipcRenderer.invoke("save:read"),
  writeSave: (data) => ipcRenderer.invoke("save:write", data),
  resetSave: () => ipcRenderer.invoke("save:reset"),
  appInfo: () => ipcRenderer.invoke("app:info"),
});
