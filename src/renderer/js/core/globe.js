/**
 * THE CODEX — Globe 3D du QG (three.js, vendoré).
 * Sphère graticule + étoiles + marqueurs de pays cliquables, rotation
 * automatique et au glisser. Auto-nettoyage quand le canvas quitte le DOM.
 * Si WebGL est indisponible, mount() retourne null → repli carte SVG.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  function webglAvailable() {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch { return false; }
  }

  function latLonToVec3(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new window.THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /** Graticule : parallèles + méridiens en lignes fines. */
  function buildGraticule(THREE, r) {
    const group = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.10 });
    const SEG = 64;

    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      for (let i = 0; i <= SEG; i++) {
        const lon = (i / SEG) * 360 - 180;
        pts.push(latLonToVec3(lat, lon, r));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const pts = [];
      for (let i = 0; i <= SEG; i++) {
        const lat = (i / SEG) * 180 - 90;
        pts.push(latLonToVec3(lat, lon, r));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    return group;
  }

  /** Texture radiale douce (halo des marqueurs) générée au runtime. */
  function glowTexture(THREE, color) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  /**
   * Monte le globe.
   * @param container élément hôte (position:relative)
   * @param opts { countries: [{...,lat,lon, status, color}], onSelect(c), onHover(c|null, x, y) }
   * @returns contrôleur { dispose } ou null si WebGL indisponible
   */
  function mount(container, opts) {
    if (!window.THREE || !webglAvailable()) return null;
    const THREE = window.THREE;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { return null; }

    const W = () => container.clientWidth || 600;
    const H = () => container.clientHeight || 480;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.domElement.style.cssText = "position:absolute; inset:0; cursor:grab;";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
    camera.position.set(0, 0.55, 3.1);
    camera.lookAt(0, 0, 0);

    const globe = new THREE.Group();
    scene.add(globe);

    // Sphère de fond légèrement teintée
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.985, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0x0a1426, transparent: true, opacity: 0.92 })
    ));
    globe.add(buildGraticule(THREE, 1));

    // Halo atmosphérique
    const atmosphere = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture(THREE, "rgba(0,212,255,0.55)"),
      transparent: true, opacity: 0.5, depthWrite: false,
    }));
    atmosphere.scale.set(2.9, 2.9, 1);
    scene.add(atmosphere);

    // Étoiles
    const starPts = [];
    for (let i = 0; i < 450; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(7 + Math.random() * 8);
      starPts.push(v);
    }
    scene.add(new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(starPts),
      new THREE.PointsMaterial({ color: 0xaaccee, size: 0.035, transparent: true, opacity: 0.7 })
    ));

    // Marqueurs de pays
    const markers = [];
    const pulses = [];
    for (const c of opts.countries) {
      const pos = latLonToVec3(c.lat, c.lon, 1.012);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(c.status === "locked" ? 0.018 : 0.026, 12, 12),
        new THREE.MeshBasicMaterial({ color: c.color })
      );
      dot.position.copy(pos);
      dot.userData.country = c;
      globe.add(dot);
      markers.push(dot);

      const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(THREE, c.haloCss), transparent: true, depthWrite: false,
        opacity: c.status === "locked" ? 0.25 : 0.8,
      }));
      halo.scale.setScalar(c.status === "locked" ? 0.1 : 0.2);
      halo.position.copy(pos.clone().multiplyScalar(1.004));
      globe.add(halo);

      if (c.status === "active" || c.status === "playable") {
        pulses.push({ sprite: halo, base: 0.2, phase: Math.random() * Math.PI * 2 });
      }
    }

    // Europe face caméra au démarrage
    globe.rotation.y = -2.1;

    // ----- Interactions -----
    const ray = new THREE.Raycaster();
    ray.params.Points = { threshold: 0.05 };
    const pointer = new THREE.Vector2();
    let dragging = false;
    let moved = 0;
    let last = { x: 0, y: 0 };
    let autoRotate = true;

    function pick(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(markers, false)[0];
      return hit ? hit.object.userData.country : null;
    }

    renderer.domElement.addEventListener("pointerdown", (e) => {
      dragging = true; moved = 0; autoRotate = false;
      last = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = "grabbing";
    });
    window.addEventListener("pointerup", () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      setTimeout(() => { autoRotate = true; }, 2500);
    });
    renderer.domElement.addEventListener("pointermove", (e) => {
      if (dragging) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        globe.rotation.y += dx * 0.005;
        globe.rotation.x = Math.max(-0.7, Math.min(0.7, globe.rotation.x + dy * 0.003));
        last = { x: e.clientX, y: e.clientY };
        if (opts.onHover) opts.onHover(null, 0, 0);
      } else {
        const c = pick(e);
        renderer.domElement.style.cursor = c ? "pointer" : "grab";
        if (opts.onHover) opts.onHover(c, e.clientX, e.clientY);
      }
    });
    renderer.domElement.addEventListener("click", (e) => {
      if (moved > 6) return; // c'était un drag
      const c = pick(e);
      if (c && opts.onSelect) opts.onSelect(c);
    });

    // ----- Boucle de rendu (auto-nettoyage hors DOM) -----
    let raf = 0;
    let t = 0;
    let everConnected = false; // le conteneur peut être attaché après mount()
    function animate() {
      if (renderer.domElement.isConnected) everConnected = true;
      else if (everConnected) return dispose();
      raf = requestAnimationFrame(animate);
      t += 0.016;
      if (autoRotate && !dragging) globe.rotation.y += 0.0011;
      for (const p of pulses) {
        p.sprite.scale.setScalar(p.base * (1 + 0.45 * Math.abs(Math.sin(t * 1.8 + p.phase))));
      }
      if (container.clientWidth && (renderer.domElement.width !== container.clientWidth * renderer.getPixelRatio())) {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    }

    function dispose() {
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    animate();
    return { dispose };
  }

  Codex.globe = { mount };
})();
