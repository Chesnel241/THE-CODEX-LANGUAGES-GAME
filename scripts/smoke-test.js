/**
 * THE CODEX — Test de fumée bout-en-bout.
 * Lance l'app Electron réelle (IPC simulés en mémoire), traverse
 * l'onboarding et joue des missions dans les deux langues.
 * Usage : npx electron scripts/smoke-test.js  (xvfb-run sous Linux)
 */
"use strict";

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let saved = null;
ipcMain.handle("save:read", () => saved);
ipcMain.handle("save:write", (_e, d) => { saved = d; return { ok: true }; });
ipcMain.handle("save:reset", () => { saved = null; return { ok: true }; });
ipcMain.handle("app:info", () => ({ version: "smoke", platform: process.platform }));

const errors = [];

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280, height: 800, show: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "src", "main", "preload.js"),
      contextIsolation: true, nodeIntegration: false, sandbox: true,
      backgroundThrottling: false,
    },
  });
  win.webContents.on("console-message", (_e, level, message) => {
    // Bruit d'infrastructure (WebGL logiciel en CI/conteneur sans GPU) — pas
    // des erreurs applicatives. Les vraies erreurs JS/CSP restent capturées.
    const infraNoise = /Autofill|GroupMarkerNotSet|[Ss]wift[Ss]hader|GL Driver Message|Automatic fallback to software WebGL/;
    if (level >= 2 && !infraNoise.test(message)) errors.push(message);
  });
  await win.loadFile(path.join(__dirname, "..", "src", "renderer", "index.html"));
  await new Promise((r) => setTimeout(r, 2200));

  const out = await win.webContents.executeJavaScript(`
    (async () => {
      const out = [];
      const wait = (ms) => new Promise(r => setTimeout(r, ms));

      // ---------- Onboarding FR → arc anglais ----------
      const start = document.querySelector('.title-start');
      if (!start) return ['NO-START'];
      start.disabled = false; start.click(); await wait(400);
      out.push(document.querySelector('.onb-wrap') ? 'ONB:ok' : 'ONB:FAIL');
      document.querySelectorAll('.lang-card')[0].click(); await wait(300); // Français
      document.querySelector('.lang-card:not(.locked)').click(); await wait(300); // Anglais UK
      document.querySelector('.onb-input').value = 'AGENT TEST';
      document.querySelector('.onb-step .btn').click(); await wait(900);
      out.push(document.querySelector('.hq-topbar') ? 'HQ-FR:ok' : 'HQ-FR:FAIL');
      out.push(Codex.state.l1() === 'fr' && Codex.state.lang() === 'en-UK' ? 'LANGS:ok' : 'LANGS:FAIL');
      out.push(Codex.music.state() ? 'MUSIC:ok(' + Codex.music.state() + ')' : 'MUSIC:FAIL');

      // ---------- Phase 3 : vendors, carte (globe 3D ou repli SVG), Lottie ----------
      const vendorsOk = window.THREE && window.lottie && window.anime && window.Fuse && window.nlp;
      out.push(vendorsOk ? 'VENDORS:ok' : 'VENDORS:FAIL');
      const mapCanvas = document.querySelector('.hq-map-wrap canvas');
      const mapSvg = document.querySelector('.hq-map');
      out.push(mapCanvas ? 'MAP:ok(globe3D)' : mapSvg ? 'MAP:ok(svg-fallback)' : 'MAP:FAIL');
      out.push(document.querySelector('.lottie-radar svg') ? 'LOTTIE:ok' : 'LOTTIE:FAIL');

      // ---------- Phase 3 : console ECHO (chatbot) ----------
      Codex.router.go('echo-console'); await wait(500);
      out.push(document.querySelector('.echoc-wrap') ? 'ECHOC-UI:ok' : 'ECHOC-UI:FAIL');
      const echoInput = document.querySelector('.echoc-input');
      echoInput.value = 'conjugue eat';
      document.querySelector('.echoc-inputrow').dispatchEvent(new Event('submit', { cancelable: true }));
      await wait(900);
      const lastData = [...document.querySelectorAll('.echoc-data')].pop();
      out.push(lastData && /ate/.test(lastData.textContent) && /eaten/.test(lastData.textContent)
        ? 'ECHOC-ASK:ok' : 'ECHOC-ASK:FAIL');
      out.push(document.querySelectorAll('.echoc-chip').length >= 3 ? 'ECHOC-CHIPS:ok' : 'ECHOC-CHIPS:FAIL');
      Codex.router.go('hq'); await wait(400);

      // ---------- Mission 1 Londres (percée complète) ----------
      const M = Codex.ARCS['en-UK'].missions;
      Codex.router.go('terrain-percee', { mission: M[0] }); await wait(800);
      out.push(document.querySelectorAll('.hotspot').length >= 4 ? 'TERRAIN-EN:ok' : 'TERRAIN-EN:FAIL');
      for (let i = 0; i < 4; i++) {
        const hs = document.querySelector('.hotspot:not(.cultural):not(.collected)');
        if (!hs) { out.push('FRAG' + i + ':MISSING'); break; }
        hs.click(); await wait(150);
        document.querySelector('.fragment-popup .btn').click(); await wait(150);
      }
      await wait(1900);
      out.push(document.querySelector('.intel-card') ? 'INTEL-EN:ok' : 'INTEL-EN:FAIL');
      out.push(Codex.state.vaultItems().some(v => v.id === 'intel-verb-eat') ? 'VAULT-EN:ok' : 'VAULT-EN:FAIL');

      // ---------- Bascule agent EN → arc français ----------
      Codex.state.data.agent.l1 = 'en';
      Codex.i18n.set('en');
      Codex.state.setL2('fr-FR');
      Codex.router.go('hq'); await wait(500);
      out.push(document.querySelector('.hq-topbar') ? 'HQ-EN:ok' : 'HQ-EN:FAIL');

      // ---------- Mission 1 Paris (percée complète) ----------
      const MF = Codex.ARCS['fr-FR'].missions;
      Codex.router.go('terrain-percee', { mission: MF[0] }); await wait(800);
      out.push(document.querySelectorAll('.hotspot').length >= 4 ? 'TERRAIN-FR:ok' : 'TERRAIN-FR:FAIL');
      for (let i = 0; i < 4; i++) {
        const hs = document.querySelector('.hotspot:not(.cultural):not(.collected)');
        if (!hs) { out.push('FRAGFR' + i + ':MISSING'); break; }
        hs.click(); await wait(150);
        document.querySelector('.fragment-popup .btn').click(); await wait(150);
      }
      await wait(1900);
      out.push(document.querySelector('.intel-card') ? 'INTEL-FR:ok' : 'INTEL-FR:FAIL');
      const fdone = document.querySelector('.intel-actions .btn:not(.btn-ghost):not(.btn-muted)');
      if (fdone) { fdone.click(); await wait(500); }
      out.push(document.querySelector('.debrief-card') ? 'DEBRIEF:ok' : 'DEBRIEF:FAIL');

      // ---------- Infiltration Paris (réponses correctes) ----------
      Codex.router.go('terrain-infiltration', { mission: MF[1] }); await wait(600);
      for (const inter of MF[1].interactions) {
        const good = inter.choices.find(c => c.correct).text;
        const btn = [...document.querySelectorAll('.choice-btn')].find(b => b.textContent === good);
        if (!btn) { out.push('INFIL-FR:NOBTN'); break; }
        btn.click(); await wait(1850);
      }
      await wait(400);
      out.push(document.querySelector('.intel-card') ? 'INFIL-FR:ok' : 'INFIL-FR:FAIL');

      // ---------- Négociation Paris ----------
      Codex.router.go('terrain-negociation', { mission: MF[3] }); await wait(500);
      for (const round of MF[3].rounds) {
        for (const w of round.solution) {
          const chip = [...document.querySelectorAll('.word-bank .word-chip')].find(c => c.textContent === w && !c.disabled);
          if (!chip) { out.push('NEGO-FR:NOCHIP ' + w); break; }
          chip.click(); await wait(40);
        }
        document.querySelector('.validate-btn').click(); await wait(2050);
      }
      await wait(300);
      out.push(document.querySelector('.intel-card') ? 'NEGO-FR:ok' : 'NEGO-FR:FAIL');

      // ---------- Surveillance Paris ----------
      Codex.router.go('terrain-surveillance', { mission: MF[2] }); await wait(500);
      out.push(document.querySelectorAll('.gloss').length > 0 ? 'GLOSS-FR:ok' : 'GLOSS-FR:FAIL');
      for (const q of MF[2].questions) {
        const card = [...document.querySelectorAll('.surv-questions .card')].find(c => c.textContent.includes(q.q));
        [...card.querySelectorAll('.choice-btn')].find(b => b.textContent === q.options[q.correct]).click();
        await wait(120);
      }
      await wait(1200);
      out.push(document.querySelector('.intel-card') ? 'SURV-FR:ok' : 'SURV-FR:FAIL');

      // ---------- Boss Paris : montage des phases ----------
      Codex.router.go('terrain-extraction', { mission: MF[5] }); await wait(300);
      document.querySelector('.phase-banner .btn').click(); await wait(300);
      document.querySelector('.phase-banner .btn').click(); await wait(600);
      out.push(document.querySelector('.suspicion-bar') ? 'BOSS-FR:ok' : 'BOSS-FR:FAIL');

      // ---------- Vault, daily, profile, settings ----------
      Codex.router.go('vault'); await wait(300);
      out.push(document.querySelector('.vault-grid') ? 'VAULT-UI:ok' : 'VAULT-UI:FAIL');
      Codex.router.go('daily'); await wait(400);
      out.push(document.querySelector('.daily-card') ? 'DAILY:ok' : 'DAILY:FAIL');
      Codex.router.go('profile'); await wait(300);
      out.push(document.querySelector('.profile-wrap') ? 'PROFILE:ok' : 'PROFILE:FAIL');
      Codex.router.go('settings'); await wait(300);
      out.push(document.querySelector('.settings-wrap') ? 'SETTINGS:ok' : 'SETTINGS:FAIL');

      // ---------- Phase 4 : Arène chronométrée ----------
      Codex.router.go('arena'); await wait(400);
      out.push(document.querySelector('.arena-wrap') ? 'ARENA-UI:ok' : 'ARENA-UI:FAIL');
      document.querySelector('.arena-zone .btn').click(); await wait(500);
      const firstQ = document.querySelector('.arena-q .choice-btn');
      out.push(firstQ ? 'ARENA-Q:ok' : 'ARENA-Q:FAIL');
      if (firstQ) { firstQ.click(); await wait(800); }
      out.push(document.querySelector('.arena-q .choice-btn') ? 'ARENA-FLOW:ok' : 'ARENA-FLOW:FAIL');

      // ---------- Phase 4 : arc espagnol (fabrique bilingue, l1=fr) ----------
      Codex.state.data.agent.l1 = 'fr'; Codex.i18n.set('fr'); Codex.state.setL2('es-ES');
      const ME = Codex.arc().missions;
      out.push(Codex.arc().id === 'es-ES' && ME.length === 4 ? 'ARC-ES:ok' : 'ARC-ES:FAIL');
      Codex.router.go('terrain-percee', { mission: ME[0] }); await wait(800);
      out.push(document.querySelectorAll('.hotspot').length >= 4 ? 'TERRAIN-ES:ok' : 'TERRAIN-ES:FAIL');
      for (let i = 0; i < 4; i++) {
        const hs = document.querySelector('.hotspot:not(.cultural):not(.collected)');
        if (!hs) { out.push('FRAGES' + i + ':MISSING'); break; }
        hs.click(); await wait(150);
        document.querySelector('.fragment-popup .btn').click(); await wait(150);
      }
      await wait(1900);
      out.push(document.querySelector('.intel-card') ? 'INTEL-ES:ok' : 'INTEL-ES:FAIL');
      out.push(/COMER/.test((Codex.echoAI.ask('conjugue comer').data || '')) ? 'ECHOC-ES:ok' : 'ECHOC-ES:FAIL');

      // ---------- Phase 4 : arc allemand (l1=en) ----------
      Codex.state.data.agent.l1 = 'en'; Codex.i18n.set('en'); Codex.state.setL2('de-DE');
      out.push(Codex.arc().id === 'de-DE' && Codex.arc().missions.length === 4 ? 'ARC-DE:ok' : 'ARC-DE:FAIL');
      out.push(/gegessen/.test((Codex.echoAI.ask('conjugate essen').data || '')) ? 'ECHOC-DE:ok' : 'ECHOC-DE:FAIL');

      out.push('XP-EN=' + (Codex.state.data.progress['en-UK'] || {}).xp +
               ' XP-FR=' + (Codex.state.data.progress['fr-FR'] || {}).xp +
               ' XP-ES=' + (Codex.state.data.progress['es-ES'] || {}).xp +
               ' VAULT=' + Codex.state.data.vault.length);
      Codex.music.stop(0.1);
      return out;
    })()
  `).catch((e) => ["EXEC ERROR: " + e]);

  console.log("SMOKE:", JSON.stringify(out));
  console.log("CONSOLE ERRORS:", errors.length ? JSON.stringify(errors.slice(0, 6), null, 2) : "none");
  const failed = out.some((s) => /FAIL|MISSING|ERROR|NOBTN|NOCHIP/.test(String(s)));
  app.exit(failed || errors.length ? 1 : 0);
});
