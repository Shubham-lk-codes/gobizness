(() => {
  const mount = document.getElementById('heroAnimation');
  if (!mount || !window.THREE) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const pointer = new THREE.Vector2(0.5, 0.5);
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: pointer }
  };

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'hero-animation__canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mount.appendChild(renderer.domElement);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uPointer;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float grid(vec2 uv, float scale) {
        vec2 lines = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
        float line = min(lines.x, lines.y);
        return 1.0 - min(line, 1.0);
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        p.x *= uResolution.x / uResolution.y;
        float t = uTime * 0.075;

        vec3 color = vec3(0.012, 0.047, 0.12);
        vec2 driftA = vec2(sin(t * 1.7) * 0.20, cos(t * 1.25) * 0.16);
        vec2 driftB = vec2(cos(t * 1.4) * 0.28, sin(t * 1.6) * 0.18);
        float auraA = 0.16 / (length(p - vec2(-0.47, 0.18) - driftA) + 0.14);
        float auraB = 0.13 / (length(p - vec2(0.48, -0.20) - driftB) + 0.16);
        float cursorAura = 0.075 / (length(uv - uPointer) + 0.20);
        color += vec3(0.015, 0.18, 0.52) * auraA;
        color += vec3(0.05, 0.34, 0.78) * auraB;
        color += vec3(0.22, 0.13, 0.02) * cursorAura;

        float horizon = sin((p.x * 2.0) + t * 2.2) * 0.055 + sin((p.x * 5.0) - t * 1.7) * 0.025;
        float wave = smoothstep(0.013, 0.0, abs(p.y - horizon + 0.03));
        color += vec3(0.16, 0.45, 0.92) * wave * 0.34;

        float fineGrid = grid(uv + vec2(t * 0.005, 0.0), 15.0);
        color += vec3(0.20, 0.45, 0.80) * fineGrid * 0.035;

        vec2 cell = floor(uv * vec2(19.0, 11.0));
        vec2 point = fract(uv * vec2(19.0, 11.0)) - 0.5;
        float blink = 0.55 + 0.45 * sin(t * 5.0 + hash(cell) * 6.28318);
        float star = smoothstep(0.07, 0.0, length(point)) * step(0.79, hash(cell)) * blink;
        color += vec3(0.65, 0.82, 1.0) * star * 0.42;

        float vignette = smoothstep(1.1, 0.18, length(p));
        gl_FragColor = vec4(color * (0.70 + vignette * 0.30), 1.0);
      }
    `
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const resize = () => {
    const { width, height } = mount.getBoundingClientRect();
    renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
    uniforms.uResolution.value.set(Math.max(width, 1), Math.max(height, 1));
  };

  const updatePointer = event => {
    const bounds = mount.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
    pointer.y = 1 - (event.clientY - bounds.top) / Math.max(bounds.height, 1);
  };

  let frameId = null;
  let running = false;
  let startedAt = performance.now();

  const render = now => {
    uniforms.uTime.value = (now - startedAt) * 0.001;
    renderer.render(scene, camera);
    if (running) frameId = requestAnimationFrame(render);
  };

  const start = () => {
    if (running || reduceMotion.matches || document.hidden) return;
    startedAt = performance.now() - uniforms.uTime.value * 1000;
    running = true;
    frameId = requestAnimationFrame(render);
  };

  const stop = () => {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = null;
  };

  const updateMotionPreference = () => {
    if (reduceMotion.matches) {
      stop();
      renderer.render(scene, camera);
    } else {
      start();
    }
  };

  resize();
  renderer.render(scene, camera);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mount);
  else window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', updatePointer, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  reduceMotion.addEventListener('change', updateMotionPreference);
  updateMotionPreference();
})();
