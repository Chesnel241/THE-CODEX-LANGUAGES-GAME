/**
 * THE CODEX — Globe 3D du QG, v2 « stratégie » (three.js, vendoré).
 * Vrais continents : frontières Natural Earth 110m (Codex.WORLD_TOPO,
 * domaine public) décodées par topojson-client et peintes en texture
 * équirectangulaire au montage — terres lumineuses sur océan profond,
 * frontières de pays, atmosphère, étoiles, marqueurs cliquables.
 * Le QG affiche un panneau d'infos pays façon jeu de stratégie (onHover).
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

  /**
   * Peint la Terre en équirectangulaire : océan profond, masses terrestres
   * au dégradé froid « renseignement », côtes lumineuses, frontières fines.
   */
  function buildEarthTexture(THREE) {
    const W = 2048, H = 1024;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");

    // Océan : dégradé profond
    const oc = ctx.createLinearGradient(0, 0, 0, H);
    oc.addColorStop(0, "#050b18");
    oc.addColorStop(0.5, "#081226");
    oc.addColorStop(1, "#050b18");
    ctx.fillStyle = oc;
    ctx.fillRect(0, 0, W, H);

    if (!window.topojson || !Codex.WORLD_TOPO) return new THREE.CanvasTexture(cv);

    const topo = Codex.WORLD_TOPO;
    const countries = window.topojson.feature(topo, topo.objects.countries);
    const borders = window.topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);

    const px = (lon) => ((lon + 180) / 360) * W;
    const py = (lat) => ((90 - lat) / 180) * H;

    function tracePolygon(ring) {
      ctx.moveTo(px(ring[0][0]), py(ring[0][1]));
      for (let i = 1; i < ring.length; i++) ctx.lineTo(px(ring[i][0]), py(ring[i][1]));
      ctx.closePath();
    }
    function traceGeom(geom) {
      const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
      for (const poly of polys) for (const ring of poly) tracePolygon(ring);
    }

    // Terres : remplissage + lueur de côte
    ctx.beginPath();
    for (const f of countries.features) traceGeom(f.geometry);
    const land = ctx.createLinearGradient(0, 0, 0, H);
    land.addColorStop(0, "#16314f");
    land.addColorStop(0.5, "#1d4060");
    land.addColorStop(1, "#16314f");
    ctx.fillStyle = land;
    ctx.fill("evenodd");
    ctx.shadowColor = "rgba(0, 212, 255, 0.55)";
    ctx.shadowBlur = 6;
    ctx.strokeStyle = "rgba(90, 200, 240, 0.85)";
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Frontières intérieures, fines et discrètes
    ctx.beginPath();
    const bGeoms = borders.type === "MultiLineString" ? borders.coordinates : [borders.coordinates];
    for (const line of bGeoms) {
      ctx.moveTo(px(line[0][0]), py(line[0][1]));
      for (let i = 1; i < line.length; i++) ctx.lineTo(px(line[i][0]), py(line[i][1]));
    }
    ctx.strokeStyle = "rgba(120, 170, 210, 0.28)";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Graticule léger directement dans la texture
    ctx.strokeStyle = "rgba(0, 212, 255, 0.07)";
    ctx.lineWidth = 1;
    for (let lon = -150; lon <= 180; lon += 30) {
      ctx.beginPath(); ctx.moveTo(px(lon), 0); ctx.lineTo(px(lon), H); ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath(); ctx.moveTo(0, py(lat)); ctx.lineTo(W, py(lat)); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 4;
    return tex;
  }

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
   * @param opts { countries: [{..., lat, lon, status, color, haloCss}], onSelect(c), onHover(c|null, x, y) }
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
    const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 100);
    camera.position.set(0, 0.5, 3.05);
    camera.lookAt(0, 0, 0);

    const globe = new THREE.Group();
    scene.add(globe);

    // Terre : texture Natural Earth peinte au montage
    const earthTex = buildEarthTexture(THREE);
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 48),
      new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.85, metalness: 0.05 })
    );
    globe.add(earth);

    // Éclairage : soleil froid + lumière d'appoint cyan
    scene.add(new THREE.AmbientLight(0x8aa4c8, 0.55));
    const sun = new THREE.DirectionalLight(0xeaf4ff, 1.25);
    sun.position.set(4, 2.2, 3.5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x00d4ff, 0.22);
    fill.position.set(-5, -1, -2);
    scene.add(fill);

    // Atmosphère : coque rim + halo sprite
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.035, 48, 36),
      new THREE.MeshBasicMaterial({ color: 0x2a9fd4, transparent: true, opacity: 0.10, side: THREE.BackSide, blending: THREE.AdditiveBlending })
    );
    scene.add(atmo);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture(THREE, "rgba(0,180,240,0.5)"), transparent: true, opacity: 0.55, depthWrite: false,
    }));
    halo.scale.set(3.05, 3.05, 1);
    scene.add(halo);

    // Étoiles
    const starPts = [];
    for (let i = 0; i < 500; i++) {
      starPts.push(new THREE.Vector3().randomDirection().multiplyScalar(8 + Math.random() * 9));
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
        new THREE.SphereGeometry(c.status === "locked" ? 0.016 : 0.024, 12, 12),
        new THREE.MeshBasicMaterial({ color: c.color })
      );
      dot.position.copy(pos);
      dot.userData.country = c;
      globe.add(dot);
      markers.push(dot);

      const mhalo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(THREE, c.haloCss), transparent: true, depthWrite: false,
        opacity: c.status === "locked" ? 0.25 : 0.85,
      }));
      mhalo.scale.setScalar(c.status === "locked" ? 0.09 : 0.18);
      mhalo.position.copy(pos.clone().multiplyScalar(1.004));
      globe.add(mhalo);

      if (c.status === "active" || c.status === "playable") {
        pulses.push({ sprite: mhalo, base: 0.18, phase: Math.random() * Math.PI * 2 });
        // Anneau au sol du marqueur actif
        if (c.status === "active") {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.03, 0.042, 24),
            new THREE.MeshBasicMaterial({ color: c.color, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
          );
          ring.position.copy(pos.clone().multiplyScalar(1.002));
          ring.lookAt(pos.clone().multiplyScalar(2));
          globe.add(ring);
          pulses.push({ sprite: ring, base: 1, phase: 0, isRing: true });
        }
      }
    }

    // Europe face caméra
    globe.rotation.y = -2.1;

    // ----- Interactions -----
    const ray = new THREE.Raycaster();
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
      if (moved > 6) return;
      const c = pick(e);
      if (c && opts.onSelect) opts.onSelect(c);
    });

    // ----- Boucle de rendu (auto-nettoyage hors DOM) -----
    let raf = 0;
    let t = 0;
    let everConnected = false;
    function animate() {
      if (renderer.domElement.isConnected) everConnected = true;
      else if (everConnected) return dispose();
      raf = requestAnimationFrame(animate);
      t += 0.016;
      if (autoRotate && !dragging) globe.rotation.y += 0.0009;
      for (const p of pulses) {
        if (p.isRing) {
          const s = 1 + Math.sin(t * 2.2) * 0.35;
          p.sprite.scale.setScalar(s);
          p.sprite.material.opacity = 0.55 + Math.sin(t * 2.2) * 0.25;
        } else {
          p.sprite.scale.setScalar(p.base * (1 + 0.45 * Math.abs(Math.sin(t * 1.8 + p.phase))));
        }
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
