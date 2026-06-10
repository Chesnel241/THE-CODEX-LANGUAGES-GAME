/**
 * THE CODEX — État du jeu et persistance.
 * La sauvegarde transite par le pont IPC (validée côté main).
 * Repli localStorage si l'app est ouverte hors Electron (dev navigateur).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const SAVE_VERSION = 1;
  const LANG = "en-UK";

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function defaultData() {
    return {
      version: SAVE_VERSION,
      agent: { codeName: "AGENT ZERO", createdAt: new Date().toISOString() },
      settings: { volume: 70, ambience: true, reducedMotion: false },
      progress: {
        [LANG]: { xp: 0, missions: {} }, // missions: { id: { bestScore, attempts, completedAt } }
      },
      vault: [], // { id, kind, title, data, acquiredAt, timesReviewed, lastReviewed }
      medals: [], // { id, earnedAt }
      daily: { lastCompleted: null, count: 0 },
      stats: {
        missionsCompleted: 0,
        fragmentsCollected: 0,
        culturalFound: 0,
        daysActive: [],
        history: [], // 10 dernières missions { id, title, score, date }
      },
    };
  }

  let saveTimer = null;

  const state = {
    data: defaultData(),
    lang: LANG,

    async init() {
      let loaded = null;
      try {
        if (window.codexBridge) {
          loaded = await window.codexBridge.readSave();
        } else {
          loaded = JSON.parse(localStorage.getItem("codex-save") || "null");
        }
      } catch { loaded = null; } // pont indisponible ou sauvegarde corrompue → départ propre
      if (loaded && loaded.version === SAVE_VERSION) {
        // Fusion défensive : les champs manquants reprennent les valeurs par défaut
        this.data = Object.assign(defaultData(), loaded);
        this.data.settings = Object.assign(defaultData().settings, loaded.settings);
        this.data.stats = Object.assign(defaultData().stats, loaded.stats);
      }
      this.touchDay();
      document.body.classList.toggle("reduced-motion", this.data.settings.reducedMotion);
    },

    save() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        if (window.codexBridge) {
          window.codexBridge.writeSave(this.data);
        } else {
          try { localStorage.setItem("codex-save", JSON.stringify(this.data)); } catch { /* plein */ }
        }
      }, 250);
    },

    async reset() {
      if (window.codexBridge) await window.codexBridge.resetSave();
      else localStorage.removeItem("codex-save");
      this.data = defaultData();
      this.touchDay();
      this.save();
    },

    touchDay() {
      const t = todayStr();
      if (!this.data.stats.daysActive.includes(t)) {
        this.data.stats.daysActive.push(t);
        this.save();
      }
    },

    // ----- Progression -----
    prog() { return this.data.progress[LANG]; },

    addXp(amount) {
      const before = this.level();
      this.prog().xp += amount;
      this.save();
      const after = this.level();
      return after.id !== before.id ? after : null; // niveau gagné ?
    },

    level() {
      const xp = this.prog().xp;
      const levels = Codex.CONTENT.levels;
      let current = levels[0];
      for (const l of levels) if (xp >= l.xp) current = l;
      return current;
    },

    nextLevel() {
      const xp = this.prog().xp;
      return Codex.CONTENT.levels.find((l) => l.xp > xp) || null;
    },

    isMissionDone(id) {
      const m = this.prog().missions[id];
      return Boolean(m && m.completedAt);
    },

    isMissionUnlocked(missionId) {
      const list = Codex.CONTENT.missions;
      const idx = list.findIndex((m) => m.id === missionId);
      if (idx <= 0) return true;
      return this.isMissionDone(list[idx - 1].id);
    },

    recordMission(mission, score) {
      const entry = this.prog().missions[mission.id] || { attempts: 0, bestScore: 0 };
      entry.attempts += 1;
      entry.bestScore = Math.max(entry.bestScore, score);
      entry.completedAt = new Date().toISOString();
      this.prog().missions[mission.id] = entry;
      this.data.stats.missionsCompleted += 1;
      this.data.stats.history.unshift({ id: mission.id, title: mission.title, score, date: todayStr() });
      this.data.stats.history = this.data.stats.history.slice(0, 10);
      this.save();
    },

    // ----- Coffre-Fort -----
    addToVault(item) {
      if (this.data.vault.some((v) => v.id === item.id)) return false;
      this.data.vault.push({ ...item, acquiredAt: new Date().toISOString(), timesReviewed: 0, lastReviewed: null });
      this.save();
      return true;
    },

    vaultByKind(kind) { return this.data.vault.filter((v) => v.kind === kind); },

    markReviewed(id) {
      const v = this.data.vault.find((v) => v.id === id);
      if (v) {
        v.timesReviewed += 1;
        v.lastReviewed = new Date().toISOString();
        this.save();
      }
    },

    /** Répétition espacée simplifiée (esprit SM-2) : item "à revoir" si
     *  l'intervalle écoulé dépasse 2^(timesReviewed) jours. */
    needsReview(item) {
      const last = item.lastReviewed || item.acquiredAt;
      const days = (Date.now() - new Date(last).getTime()) / 86400000;
      return days >= Math.pow(2, Math.min(item.timesReviewed, 6));
    },

    // ----- Médailles -----
    hasMedal(id) { return this.data.medals.some((m) => m.id === id); },

    awardMedal(id) {
      if (this.hasMedal(id)) return false;
      this.data.medals.push({ id, earnedAt: new Date().toISOString() });
      this.save();
      return true;
    },

    // ----- Daily Signal -----
    dailyAvailable() { return this.data.daily.lastCompleted !== todayStr(); },

    completeDaily() {
      this.data.daily.lastCompleted = todayStr();
      this.data.daily.count += 1;
      this.save();
    },

    todayStr,
  };

  Codex.state = state;
})();
