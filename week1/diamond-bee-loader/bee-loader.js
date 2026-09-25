/**
 * BeeLoader — a 3D diamond bee brooch that works as a progress indicator.
 *
 *   Determinate   0%     : the brooch rests, still, wings folded
 *                 1–99%  : it takes off and flies, bobbing up and down, climbing as progress rises
 *                 100%   : it lands back in place, wings flickering
 *   Indeterminate         : a waggle dance, a figure-eight loop, for as long as progress is unknown
 *
 *   const loader = BeeLoader(document.getElementById('stage'), { onUpdate });
 *   loader.setProgress(40);        // determinate
 *   loader.setIndeterminate(true); // progress unknown
 *
 * Needs three.js r128 (global THREE).
 */
(function (global) {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = (t) => t * t * (3 - 2 * t);

  /* ---------------- materials ---------------- */
  function studioEnvironment(renderer) {
    // A small "light box" scene rendered into a PMREM env map, so metals and stones have something to reflect.
    const scene = new THREE.Scene();
    const room = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true }));
    const cols = []; const pos = room.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 20; const c = new THREE.Color().setHSL(0.62, 0.06, 0.03 + 0.22 * Math.max(0, y));
      cols.push(c.r, c.g, c.b);
    }
    room.geometry.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    scene.add(room);
    const panel = (w, h, x, y, z, k, col = 0xffffff) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); scene.add(m);
    };
    panel(14, 4, 0, 12, 6, 6);            // overhead softbox
    panel(4, 10, -12, 3, 6, 4.5);         // left strip
    panel(4, 10, 12, 2, 4, 3.5, 0xfff1dc); // warm right strip
    panel(10, 3, 0, -2, 14, 2.2);         // low front fill
    panel(2, 2, 6, 8, 10, 12);            // hot spot for glints
    panel(2, 2, -7, 6, 11, 10);
    const pm = new THREE.PMREMGenerator(renderer);
    const tex = pm.fromScene(scene, 0.02).texture;
    pm.dispose();
    // a sharp cube map of the same light box, for the diamonds' refraction and fire
    const rt = new THREE.WebGLCubeRenderTarget(512, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
    const cc = new THREE.CubeCamera(0.1, 100, rt); cc.update(renderer, scene);
    tex.cubeMap = rt.texture;
    return tex;
  }

  // Diamond shader: flat facets, reflection + refraction with a fake internal bounce off a
  // pseudo-random back facet, and per-channel refractive index for dispersion ("fire").
  function diamondMaterial(cube, tint, extra = 0) {
    return new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: { env: { value: cube }, tint: { value: new THREE.Color(tint) }, time: { value: 0 }, glow: { value: extra } },
      vertexShader: `
        varying vec3 vWorld; varying vec3 vN; varying vec3 vLocalN;
        void main() {
          vec4 p = vec4(position, 1.0);
          mat3 nm = mat3(modelMatrix);
          #ifdef USE_INSTANCING
            p = instanceMatrix * p;
            nm = nm * mat3(instanceMatrix);
          #endif
          vec4 w = modelMatrix * p;
          vWorld = w.xyz;
          vN = normalize(nm * normal);          // flat: one normal per facet (non-indexed geometry)
          vLocalN = normal;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `
        uniform samplerCube env; uniform vec3 tint; uniform float time; uniform float glow;
        varying vec3 vWorld; varying vec3 vN; varying vec3 vLocalN;
        float h1(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
        vec3 bounce(vec3 N, float seed) {
          vec3 r = vec3(h1(N * 3.1 + seed), h1(N.yzx * 5.7 + seed), h1(N.zxy * 9.3 + seed)) - 0.5;
          return normalize(-N + r * 1.7);
        }
        void main() {
          vec3 N = normalize(vN);
          vec3 I = normalize(vWorld - cameraPosition);
          if (dot(N, I) > 0.0) N = -N;
          vec3 fid = floor(vLocalN * 16.0 + 0.5);      // stable id per facet (local space, so it doesn't swim)
          float facet = h1(fid);
          vec3 B = bounce(fid / 16.0, 0.0);
          B = normalize(B + 0.07 * vec3(sin(time * 0.7 + facet * 6.28), cos(time * 0.5 + facet * 4.0), 0.0));
          vec3 fire;
          fire.r = textureCube(env, reflect(refract(I, N, 1.0 / 2.407), B)).r;
          fire.g = textureCube(env, reflect(refract(I, N, 1.0 / 2.426), B)).g;
          fire.b = textureCube(env, reflect(refract(I, N, 1.0 / 2.451), B)).b;
          // second bounce, darker: gives the black-and-white facet pattern of a real brilliant
          vec3 B2 = bounce(fid / 16.0, 3.7);
          vec3 deep = textureCube(env, reflect(refract(I, N, 1.0 / 2.42), B2)).rgb;
          vec3 refl = textureCube(env, reflect(I, N)).rgb;
          float fres = 0.17 + 0.83 * pow(1.0 - max(dot(-I, N), 0.0), 5.0);
          vec3 body = mix(fire, deep, 0.15 + 0.25 * facet);
          vec3 c = mix(body, refl, fres);
          float l = dot(c, vec3(0.3333));
          c = mix(vec3(l), c, 0.75);                       // near-colourless, keeping the spectral flashes
          c = pow(max(c, 0.0), vec3(1.2)) * 3.1 + 0.05;    // high contrast: bright flashes, darker facets
          c = c * tint + tint * glow;
          gl_FragColor = vec4(c, 1.0);
          #include <tonemapping_fragment>
          #include <encodings_fragment>
        }`,
    });
  }

  function makeMaterials(env) {
    return {
      gold: new THREE.MeshStandardMaterial({ color: 0xE39A1E, metalness: 1, roughness: 0.2, envMap: env, envMapIntensity: 1.5 }),
      goldBright: new THREE.MeshStandardMaterial({ color: 0xF4B92E, metalness: 1, roughness: 0.13, envMap: env, envMapIntensity: 1.7 }),
      platinum: new THREE.MeshStandardMaterial({ color: 0xD7D9DD, metalness: 1, roughness: 0.28, envMap: env, envMapIntensity: 1.25 }),
      diamond: diamondMaterial(env.cubeMap, 0xFFFFFF),
      canary: diamondMaterial(env.cubeMap, 0xFFD24A, 0.06),
      // translucent enamel wings, like plique-à-jour: light passes through, edges and veins stay metal
      glassPlat: new THREE.MeshPhysicalMaterial({ color: 0xEEF1F6, metalness: 0.05, roughness: 0.06, transmission: 0, transparent: true, opacity: 0.28, envMap: env, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, depthWrite: false }),
      glassGold: new THREE.MeshPhysicalMaterial({ color: 0xE9A21C, metalness: 0.25, roughness: 0.06, transparent: true, opacity: 0.58, emissive: 0x5a3500, emissiveIntensity: 0.35, envMap: env, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, depthWrite: false }),
    };
  }

  /* ---------------- geometry ---------------- */
  // Round brilliant profile (radius 1), revolved and turned so the table faces the camera.
  function brilliant() {
    const P = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];
    const A = (k) => k * Math.PI / 8;                        // 16 directions around the stone
    const CROWN = 0.3, PAV = 0.86, TABLE = 0.56, GIRD = 0.018;
    const tri = [];
    const add = (...vs) => { for (let i = 1; i < vs.length - 1; i++) tri.push(vs[0], vs[i], vs[i + 1]); };
    const T = (k) => P(A(2 * k), TABLE, CROWN);                // table corners (8)
    const S = (k) => P(A(2 * k + 1), 0.8, CROWN * 0.62);       // star points (8)
    const G = (j) => P(A(j), 1, GIRD);                         // girdle top (16)
    const g = (j) => P(A(j), 1, -GIRD);                        // girdle bottom (16)
    const Q = (k) => P(A(2 * k + 1), 0.24, -PAV * 0.78);      // lower-girdle points (8)
    const C = [0, -PAV, 0], top = [0, CROWN, 0];
    for (let k = 0; k < 8; k++) {
      const k1 = (k + 1) % 8, km = (k + 7) % 8;
      add(top, T(k1), T(k));                                  // table
      add(T(k), T(k1), S(k));                                 // star facet
      add(T(k), S(k), G(2 * k), S(km));                       // bezel (kite)
      add(S(k), G(2 * k + 1), G(2 * k));                      // upper girdle facets
      add(S(k), G((2 * k + 2) % 16), G(2 * k + 1));
      add(g(2 * k), g(2 * k + 1), Q(k));                      // lower girdle facets
      add(g(2 * k + 1), g((2 * k + 2) % 16), Q(k));
      add(g(2 * k), Q(k), C, Q(km));                          // pavilion main (kite)
    }
    for (let j = 0; j < 16; j++) { const j1 = (j + 1) % 16; add(G(j), G(j1), g(j1), g(j)); }  // girdle band
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(tri.flat(), 3));
    geo.rotateX(Math.PI / 2);                                 // table faces the viewer
    geo.computeVertexNormals();
    return geo;
  }

  function tube(points, r, mat, seg = 40) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r, 10, false), mat);
    const cap = new THREE.SphereGeometry(r, 10, 8);
    [points[0], points[points.length - 1]].forEach((p) => { const s = new THREE.Mesh(cap, mat); s.position.set(...p); m.add(s); });
    return m;
  }

  function extrudeShape(pts, depth, bevel, mat, frameMat, frameR = 0.03) {
    const sh = new THREE.Shape();
    sh.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 3) sh.bezierCurveTo(...pts[i], ...pts[i + 1], ...pts[i + 2]);
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 28 });
    g.translate(0, 0, -depth / 2);
    const m = new THREE.Mesh(g, mat);
    if (mat.transparent) m.renderOrder = 2;
    if (frameMat) {                                            // a metal frame around the translucent pane
      const outline = sh.getSpacedPoints(90).map((v) => new THREE.Vector3(v.x, v.y, 0));
      const curve = new THREE.CatmullRomCurve3(outline, true);
      m.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 180, frameR, 8, true), frameMat));
    }
    return m;
  }

  function buildBee(M) {
    const bee = new THREE.Group();
    const gem = brilliant(16), gemSmall = brilliant(10);
    const sparklePoints = [];

    // abdomen: oval canary diamond in a gold claw setting
    const abd = new THREE.Mesh(gem, M.canary); abd.scale.set(0.62, 0.8, 0.62); abd.rotation.z = 0.15; abd.position.set(0, -0.55, 0.05); bee.add(abd);
    const abdRim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 10, 64), M.gold); abdRim.scale.set(0.63, 0.81, 1); abdRim.position.set(0, -0.55, 0.03); bee.add(abdRim);
    sparklePoints.push([0.18, -0.35, 0.3, 1.2], [-0.2, -0.8, 0.28, 0.9]);
    // gold side cages hugging the abdomen, running into the legs
    for (const s of [-1, 1]) {
      bee.add(tube([[s * 0.38, 0.08, 0.02], [s * 0.66, -0.3, 0.08], [s * 0.64, -0.8, 0.1], [s * 0.42, -1.2, 0.08], [s * 0.3, -1.42, 0.06]], 0.045, M.gold));
      bee.add(tube([[s * 0.3, -1.3, 0.05], [s * 0.36, -1.52, 0.04], [s * 0.48, -1.62, 0.03]], 0.035, M.gold));   // foot
    }

    // thorax: white round diamond in a platinum bezel
    const th = new THREE.Mesh(gem, M.diamond); th.scale.setScalar(0.42); th.rotation.set(-0.32, 0.18, 0.2); th.position.set(0, 0.4, 0.08); bee.add(th);
    const thRim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.04, 10, 48), M.platinum); thRim.position.set(0, 0.4, 0.06); bee.add(thRim);
    sparklePoints.push([0.12, 0.52, 0.25, 1.1]);

    // neck collar + head stone + antennae
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.12, 28), M.goldBright); collar.rotation.z = Math.PI / 2; collar.scale.set(1, 1.6, 0.7); collar.position.set(0, 0.86, 0.06); bee.add(collar);
    const head = new THREE.Mesh(gem, M.diamond); head.scale.setScalar(0.17); head.rotation.set(-0.35, -0.2, 0); head.position.set(0, 1.07, 0.08); bee.add(head);
    const cup = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.025, 8, 32), M.gold); cup.position.set(0, 1.07, 0.06); bee.add(cup);
    sparklePoints.push([0.04, 1.12, 0.18, 0.8]);
    for (const s of [-1, 1]) {
      bee.add(tube([[s * 0.07, 1.2, 0.05], [s * 0.15, 1.45, 0.06], [s * 0.24, 1.68, 0.07], [s * 0.33, 1.76, 0.07], [s * 0.42, 1.62, 0.06], [s * 0.32, 1.4, 0.05], [s * 0.2, 1.22, 0.04]], 0.034, M.goldBright, 60));
    }

    // wings (each pivots at the thorax so it can beat)
    const wings = [];
    for (const s of [-1, 1]) {
      const pivot = new THREE.Group(); pivot.position.set(s * 0.32, 0.42, -0.02); bee.add(pivot);
      const W = (pts) => pts.map(([x, y]) => [s * x, y]);
      // upper wing: platinum, pavé set
      const up = extrudeShape(W([[0, 0.12], [0.8, 0.22], [1.7, 0.02], [2.45, -0.38], [2.6, -0.5], [2.52, -0.7], [2.32, -0.68], [1.5, -0.44], [0.8, -0.16], [0.1, -0.12], [-0.02, -0.02], [-0.02, 0.06], [0, 0.12]]), 0.05, 0.035, M.glassPlat, M.platinum, 0.034);
      pivot.add(up);
      // platinum veins through the enamel
      for (let i = 0; i < 3; i++) { const o = i * 0.12; pivot.add(tube([[s * 0.15, 0.04 - o * 0.6, 0.01], [s * 1.2, -0.04 - o, 0.01], [s * 2.3, -0.42 - o * 0.5, 0.01]], 0.012, M.platinum, 24)); }
      const pave = new THREE.InstancedMesh(gemSmall, M.diamond, 22); let k = 0; const d = new THREE.Object3D();
      const place = (x, y, r) => { d.position.set(s * x, y, 0.07); d.scale.setScalar(r); d.rotation.set(0, 0, Math.random()); d.updateMatrix(); pave.setMatrixAt(k++, d.matrix); };
      for (let i = 0; i < 9; i++) { const t = i / 8; place(0.25 + t * 1.55, 0.1 - t * 0.12 - t * t * 0.16, 0.088 - t * 0.012); }
      for (let i = 0; i < 8; i++) { const t = i / 7; place(0.38 + t * 1.45, -0.07 - t * 0.14 - t * t * 0.14, 0.08 - t * 0.012); }
      place(2.08, -0.46, 0.15);                                   // the larger stone near the tip
      for (let i = 0; i < 3; i++) place(1.9 + i * 0.1, -0.24 - i * 0.07, 0.06);
      pave.count = k; pivot.add(pave);
      sparklePoints.push([s * 2.08, -0.46 + 0.42, 0.2, 0.9], [s * 1.2, -0.08 + 0.42, 0.15, 0.6]);
      // engraved ribs at the tip
      for (let i = 0; i < 7; i++) {
        const t = i / 6; const x0 = 2.22 + t * 0.04, y0 = -0.68 + t * 0.26;
        pivot.add(tube([[s * x0, y0, 0.07], [s * (x0 + 0.28 - t * 0.14), y0 - 0.06 + t * 0.05, 0.06]], 0.012, M.platinum, 6));
      }
      // lower wing: fluted yellow gold
      const lo = extrudeShape(W([[0.02, -0.02], [0.5, 0.06], [1.0, -0.3], [1.12, -0.68], [1.16, -0.9], [0.98, -1.02], [0.82, -0.98], [0.5, -0.8], [0.12, -0.4], [0.02, -0.02]]), 0.07, 0.05, M.glassGold, M.goldBright, 0.03);
      lo.position.z = 0.03; pivot.add(lo);
      for (let i = 0; i < 5; i++) {
        const t = i / 4;
        pivot.add(tube([[s * (0.12 + t * 0.12), -0.08 - t * 0.02, 0.1], [s * (0.55 + t * 0.2), -0.45 - t * 0.12, 0.11], [s * (0.9 + t * 0.12), -0.85 - t * 0.06, 0.09]], 0.018, M.gold, 16));
      }
      // small platinum lower-wing edge with stones
      const edge = extrudeShape(W([[0.72, -0.98], [0.9, -1.12], [1.3, -1.18], [1.42, -1.02], [1.44, -0.92], [1.2, -0.86], [1.12, -0.72], [1.0, -0.9], [0.86, -0.96], [0.72, -0.98]]), 0.04, 0.03, M.glassPlat, M.platinum, 0.026);
      edge.position.z = -0.02; pivot.add(edge);
      const pave2 = new THREE.InstancedMesh(gemSmall, M.diamond, 5);
      for (let i = 0; i < 5; i++) { d.position.set(s * (0.9 + i * 0.1), -1.02 + (i > 2 ? 0.04 * (i - 2) : 0), 0.04); d.scale.setScalar(0.055); d.updateMatrix(); pave2.setMatrixAt(i, d.matrix); }
      pivot.add(pave2);
      wings.push({ pivot, side: s });
    }
    return { bee, wings, sparklePoints };
  }

  function sparkleTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.15, 'rgba(255,250,235,.55)'); g.addColorStop(1, 'rgba(255,240,210,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    x.globalCompositeOperation = 'lighter'; x.strokeStyle = 'rgba(255,255,255,.9)';
    for (const [w, a] of [[2.2, 0], [2.2, Math.PI / 2], [1.1, Math.PI / 4], [1.1, -Math.PI / 4]]) {
      x.lineWidth = w; x.beginPath(); x.moveTo(64 + Math.cos(a) * 62, 64 + Math.sin(a) * 62); x.lineTo(64 - Math.cos(a) * 62, 64 - Math.sin(a) * 62); x.stroke();
    }
    const t = new THREE.CanvasTexture(c); return t;
  }

  /* ---------------- loader ---------------- */
  function BeeLoader(host, opts = {}) {
    const reduceMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!opts.preserve });
    renderer.setPixelRatio(Math.min(2, global.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);
    const canvas = renderer.domElement; canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'A diamond and gold bee brooch');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100); camera.position.set(0, 0.2, 12.5);
    const env = studioEnvironment(renderer);
    const M = makeMaterials(env);
    scene.add(new THREE.AmbientLight(0xfff3e0, 0.25));
    const key = new THREE.DirectionalLight(0xfff0d6, 1.6); key.position.set(3, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xdfe8ff, 0.9); rim.position.set(-5, 2, -3); scene.add(rim);

    const { bee, wings, sparklePoints } = buildBee(M);
    const rig = new THREE.Group(); rig.add(bee); scene.add(rig);
    bee.rotation.x = -0.12;

    // soft golden contact glow under the bee (shrinks as it rises)
    const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,205,120,.55)'); g.addColorStop(1, 'rgba(255,205,120,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    shadow.position.set(0, -2.15, -0.6); scene.add(shadow);

    // twinkles on the stones
    const sTex = sparkleTexture();
    const sparkles = sparklePoints.map(([x, y, z, s], i) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      sp.position.set(x, y, z + 0.2); sp.userData = { base: s * 0.55, seed: i * 1.7 };
      bee.add(sp); return sp;
    });

    // pointer: drag to turn the brooch in the light
    let userYaw = 0.22, userPitch = 0, drag = null;
    canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: userYaw, pitch: userPitch }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => { if (!drag) return; userYaw = clamp(drag.yaw + (e.clientX - drag.x) * 0.008, -1.1, 1.1); userPitch = clamp(drag.pitch + (e.clientY - drag.y) * 0.005, -0.5, 0.5); });
    const end = () => { drag = null; };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      canvas.style.width = '100%'; canvas.style.height = '100%';
    }
    new ResizeObserver(resize).observe(host); resize();

    // ---- state ----
    let shown = 0, target = 0, indet = false;
    let flight = 0;          // 0 resting … 1 airborne (eased)
    let beat = 0, t = 0, waggle = 0, flicker = 9, sinceFlicker = 0, lastState = 'empty';
    let last = performance.now();

    function report() {
      if (indet) return opts.onUpdate?.({ percent: null, state: 'indeterminate' });
      const state = shown <= 0.001 ? 'empty' : shown >= 99.999 ? 'complete' : 'progress';
      if (state === 'complete' && lastState !== 'complete') { flicker = 0; sinceFlicker = 0; }
      lastState = state;
      opts.onUpdate?.({ percent: shown, state });
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;

      // progress easing (determinate)
      if (!indet) {
        const gap = target - shown;
        if (Math.abs(gap) < 0.02 || reduceMotion) shown = target;
        else shown += Math.sign(gap) * Math.min(Math.abs(gap), Math.max(gap > 0 ? 6 : 30, Math.min(gap > 0 ? 45 : 140, Math.abs(gap) * 2.8)) * dt);
      }
      const airborne = indet || (shown > 0.001 && shown < 99.999);
      flight += ((airborne ? 1 : 0) - flight) * Math.min(1, dt * (airborne ? 2.4 : 1.9));
      if (reduceMotion) flight = airborne ? 1 : 0;
      const f = smooth(clamp(flight));

      // wings: fast beat while flying, a decaying flicker after landing, a small flicker now and then while complete
      beat += dt * Math.PI * 2 * (reduceMotion ? 0 : 10.5);
      let wingOpen = 0.18 * f + 0.55 * f * Math.sin(beat);
      if (!indet && lastState === 'complete') {
        flicker += dt; sinceFlicker += dt;
        if (sinceFlicker > 4.2) { flicker = 0; sinceFlicker = 0; }
        if (flicker < 1.6 && !reduceMotion) wingOpen += 0.42 * Math.exp(-flicker * 2.6) * Math.sin(flicker * Math.PI * 2 * 7) * (1 - f);
      }
      wings.forEach(({ pivot, side }) => {
        pivot.rotation.y = side * wingOpen * 1.1;       // beat toward / away from the viewer
        pivot.rotation.z = side * wingOpen * 0.28;      // and lift
      });

      // body: bob up and down, climb with progress; waggle dance when indeterminate
      const p = indet ? 0.35 : shown / 100;
      if (indet && !reduceMotion) waggle += dt * 1.35; else waggle *= Math.pow(0.1, dt);
      const bob = reduceMotion ? 0 : Math.sin(t * 2.3) * 0.2 + Math.sin(t * 5.1) * 0.05;
      const wx = indet ? Math.sin(waggle) * 1.25 : 0;
      const wy = indet ? Math.sin(waggle * 2) * 0.35 : 0;
      rig.position.x += ((f * wx) - rig.position.x) * Math.min(1, dt * 4);
      rig.position.y = f * (0.35 + 0.55 * p + bob + wy);
      rig.rotation.z = f * (indet ? -Math.cos(waggle) * 0.28 : Math.sin(t * 1.7) * 0.06);
      rig.rotation.x = f * (Math.sin(t * 2.3 + 0.8) * 0.08 - 0.1) + userPitch;
      rig.rotation.y = userYaw * (1 - 0.4 * f) + f * Math.sin(t * 0.9) * 0.18;
      bee.position.y = 0;

      const lift = rig.position.y;
      shadow.scale.set(1 - lift * 0.25, 1 - lift * 0.2, 1); shadow.material.opacity = clamp(1 - lift * 0.45, 0.25, 1);
      shadow.position.x = rig.position.x * 0.9;

      sparkles.forEach((sp) => {
        const w = Math.max(0, Math.sin(t * 1.6 + sp.userData.seed * 3.1) * 1.4 - 0.6);
        sp.material.opacity = reduceMotion ? 0.25 : w;
        sp.scale.setScalar(sp.userData.base * (0.6 + w * 0.8));
        sp.material.rotation = t * 0.4 + sp.userData.seed;
      });

      M.diamond.uniforms.time.value = t; M.canary.uniforms.time.value = t;
      renderer.render(scene, camera);
      report();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return {
      setProgress(v) { target = clamp(Number(v) || 0, 0, 100); },
      setIndeterminate(on) { indet = !!on; if (!indet) lastState = shown >= 99.999 ? 'complete' : 'progress'; },
      get progress() { return shown; },
      get indeterminate() { return indet; },
    };
  }

  global.BeeLoader = BeeLoader;
})(window);
