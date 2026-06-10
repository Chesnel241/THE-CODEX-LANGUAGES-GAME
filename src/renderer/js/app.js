/**
 * THE CODEX — Bootstrap et flow de mission.
 * Calcule score, XP (GDD §10.1), médailles (GDD §10.4), alimente
 * le Coffre-Fort, puis enchaîne Carte Intel → Debriefing.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const flow = {
    /**
     * Point d'entrée unique de fin de mission, appelé par les moteurs.
     * @param mission objet mission de l'arc actif
     * @param r résultat moteur { errors, hintsUsed, fragments, cultural, maxSuspicion, timeSec }
     */
    completeMission(mission, r) {
      const st = Codex.state;
      const arc = Codex.arc();
      const perfect = r.errors === 0;
      const silent = r.hintsUsed === 0;
      const score = Math.max(10, Math.min(100, 100 - r.errors * 12 - r.hintsUsed * 8));

      // ----- XP (GDD §10.1) -----
      const xpBreakdown = {
        base: mission.xpBase,
        fragments: r.fragments * 15,
        cultural: 0,
        perfect: perfect ? 100 : 0,
        silent: silent ? 50 : 0,
      };

      // Cultural Intel : trouvé sur le terrain (percée) ou débriefé (autres types)
      let culturalAwarded = false;
      if (mission.cultural) {
        const spatial = mission.cultural.x !== undefined;
        if (!spatial || r.cultural > 0) {
          culturalAwarded = true;
          xpBreakdown.cultural = mission.cultural.xp;
          st.data.stats.culturalFound += 1;
          st.addToVault({
            id: `cult-${mission.id}`,
            kind: "cultural",
            title: mission.cultural.title,
            subtitle: mission.location,
            data: { text: mission.cultural.text },
          });
        }
      }

      const xp = Object.values(xpBreakdown).reduce((a, b) => a + b, 0);
      const levelUp = st.addXp(xp);

      // ----- Coffre-Fort : la Carte Intel de la mission -----
      st.addToVault({
        id: mission.intelCard.id,
        kind: mission.intelCard.kind,
        title: mission.intelCard.lemma,
        subtitle: mission.intelCard.tag,
        data: mission.intelCard,
      });

      // ----- Enregistrement de la mission -----
      const firstMission = st.data.stats.missionsCompleted === 0;
      st.recordMission(mission, score);

      // ----- Médailles (GDD §10.4) -----
      const newMedals = [];
      const tryAward = (id, cond) => { if (cond && st.awardMedal(id)) newMedals.push(id); };
      tryAward("premier_contact", firstMission);
      tryAward("precision", perfect && silent);
      tryAward("fantome", mission.type === "infiltration" && r.maxSuspicion === 0);
      tryAward("silence_radio", silent);
      tryAward("eclair", r.timeSec < mission.durationMin * 60 * 0.5);
      tryAward("explorateur", arc.missions
        .filter((m) => m.cultural)
        .every((m) => st.data.vault.some((v) => v.id === `cult-${m.id}`)));

      const result = { ...r, score, perfect, silent, xp, xpBreakdown, levelUp, newMedals, culturalAwarded };
      Codex.router.go("intel", { mission, result });
    },
  };

  Codex.flow = flow;

  // ----- Bootstrap -----
  async function boot() {
    await Codex.state.init();
    Codex.router.go("title");
  }

  // Premier geste utilisateur → déverrouille l'AudioContext (politique Chromium)
  document.addEventListener("click", function unlock() {
    document.removeEventListener("click", unlock);
    try { Codex.audio.sfx.click(); } catch { /* audio indisponible */ }
  }, { once: true });

  window.addEventListener("DOMContentLoaded", boot);
})();
