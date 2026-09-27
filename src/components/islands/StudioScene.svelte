<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@/lib/accessibility';

  /**
   * Hero WebGL scene: a cluster of glossy modules ("the system") that assembles on load,
   * follows the pointer, and comes apart as the hero scrolls away. Orbit rings with
   * travelling packets and a depth particle field add parallax.
   */

  let container: HTMLDivElement;
  let isReady = $state(false);
  let hasError = $state(false);

  onMount(() => {
    let cleanup: () => void = () => {};
    let disposed = false;
    const reducedMotion = prefersReducedMotion();

    const init = async () => {
      try {
        const THREE = await import('three');
        const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
        const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
        if (disposed) return;

        const isMobile = window.innerWidth < 768;
        const disposables: Array<{ dispose: () => void }> = [];
        const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

        let seed = 7;
        const random = () => {
          const value = Math.sin(seed++ * 12.9898) * 43758.5453;
          return value - Math.floor(value);
        };

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 11);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = environment;
        disposables.push(pmrem, environment);

        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
        keyLight.position.set(4, 6, 6);
        scene.add(keyLight);
        const rimLight = new THREE.PointLight(0x2f7bff, 90, 0, 2);
        rimLight.position.set(-4, 2.5, -3.5);
        scene.add(rimLight);
        const underLight = new THREE.PointLight(0x005efe, 55, 0, 2);
        underLight.position.set(2.5, -3.5, 3);
        scene.add(underLight);

        // ── Module cluster ───────────────────────────────
        const rig = new THREE.Group();
        const cluster = new THREE.Group();
        rig.add(cluster);
        scene.add(rig);

        const spacing = 1.06;
        const cells: Array<{ base: InstanceType<typeof THREE.Vector3>; accent: boolean }> = [];
        for (let x = -1; x <= 1; x += 1) {
          for (let y = -1; y <= 1; y += 1) {
            for (let z = -1; z <= 1; z += 1) {
              const isCorner = Math.abs(x) + Math.abs(y) + Math.abs(z) === 3;
              if (isCorner && random() < 0.45) continue;
              cells.push({ base: new THREE.Vector3(x * spacing, y * spacing, z * spacing), accent: false });
            }
          }
        }
        // ~10% of modules carry the brand blue (Manual: blue as focal accent)
        [4, 11, 17].forEach((index) => {
          if (cells[index]) cells[index].accent = true;
        });

        const moduleGeometry = new RoundedBoxGeometry(0.92, 0.92, 0.92, 4, 0.1);
        const darkMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x1b2029,
          metalness: 0.82,
          roughness: 0.26,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          envMapIntensity: 1.1,
        });
        const accentMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x0b3fb0,
          emissive: 0x005efe,
          emissiveIntensity: 1.25,
          metalness: 0.35,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
        });
        disposables.push(moduleGeometry, darkMaterial, accentMaterial);

        const darkCells = cells.filter((cell) => !cell.accent);
        const accentCells = cells.filter((cell) => cell.accent);
        const darkMesh = new THREE.InstancedMesh(moduleGeometry, darkMaterial, darkCells.length);
        const accentMesh = new THREE.InstancedMesh(moduleGeometry, accentMaterial, accentCells.length);
        // Instance positions animate far from the geometry's origin; a cached bounding sphere would cull them
        darkMesh.frustumCulled = false;
        accentMesh.frustumCulled = false;
        cluster.add(darkMesh, accentMesh);

        const accentEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(moduleGeometry, 30),
          new THREE.LineBasicMaterial({ color: 0x9cc4ff, transparent: true, opacity: 0.55 }),
        );
        disposables.push(accentEdges.geometry, accentEdges.material as InstanceType<typeof THREE.Material>);

        const modules = [...darkCells, ...accentCells].map((cell, index) => {
          const direction = cell.base.clone().add(new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(0.9));
          if (direction.lengthSq() < 0.01) direction.set(random() - 0.5, 1, random() - 0.5);
          direction.normalize();

          return {
            ...cell,
            mesh: cell.accent ? accentMesh : darkMesh,
            slot: cell.accent ? index - darkCells.length : index,
            direction,
            spin: new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
            spread: 0.65 + random() * 0.8,
            phase: random() * Math.PI * 2,
            edges: cell.accent ? accentEdges.clone() : null,
          };
        });
        modules.forEach((module) => module.edges && cluster.add(module.edges));

        // ── Orbit rings with travelling packets ─────────
        const ringMaterial = new THREE.LineBasicMaterial({
          color: 0x60a5fa,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(ringMaterial);
        const rings = [
          { radius: 3.1, tilt: new THREE.Euler(1.18, 0.1, 0.3), speed: 0.22 },
          { radius: 3.7, tilt: new THREE.Euler(1.45, -0.5, -0.2), speed: -0.15 },
        ].map((ring) => {
          const points = Array.from({ length: 160 }, (_, index) => {
            const angle = (index / 160) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0);
          });
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          disposables.push(geometry);
          const line = new THREE.LineLoop(geometry, ringMaterial);
          const holder = new THREE.Group();
          holder.rotation.copy(ring.tilt);
          holder.add(line);
          rig.add(holder);
          return { ...ring, holder };
        });

        // Soft round sprites shared by packets and the particle field
        const spriteMaterial = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: renderer.getPixelRatio() },
            uColor: { value: new THREE.Color(0x7fb2ff) },
          },
          vertexShader: `
            uniform float uTime;
            uniform float uPixelRatio;
            attribute float aSize;
            attribute float aSeed;
            varying float vAlpha;
            void main() {
              vec3 p = position;
              p.y += sin(uTime * 0.25 + aSeed * 6.2831) * 0.18;
              p.x += cos(uTime * 0.18 + aSeed * 4.0) * 0.12;
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z);
              vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 20.0));
            }
          `,
          fragmentShader: `
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              float a = smoothstep(0.5, 0.0, d);
              gl_FragColor = vec4(uColor, a * a * vAlpha);
            }
          `,
        });
        disposables.push(spriteMaterial);

        const fieldCount = isMobile ? 260 : 620;
        const fieldPositions = new Float32Array(fieldCount * 3);
        const fieldSizes = new Float32Array(fieldCount);
        const fieldSeeds = new Float32Array(fieldCount);
        for (let i = 0; i < fieldCount; i += 1) {
          const radius = 4.5 + random() * 9;
          const theta = random() * Math.PI * 2;
          const phi = Math.acos(2 * random() - 1);
          fieldPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius * 1.4;
          fieldPositions[i * 3 + 1] = Math.cos(phi) * radius * 0.8;
          fieldPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 4;
          fieldSizes[i] = 1.5 + random() * 3.5;
          fieldSeeds[i] = random();
        }
        const fieldGeometry = new THREE.BufferGeometry();
        fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
        fieldGeometry.setAttribute('aSize', new THREE.BufferAttribute(fieldSizes, 1));
        fieldGeometry.setAttribute('aSeed', new THREE.BufferAttribute(fieldSeeds, 1));
        disposables.push(fieldGeometry);
        const field = new THREE.Points(fieldGeometry, spriteMaterial);
        scene.add(field);

        const packetGeometry = new THREE.BufferGeometry();
        const packetPositions = new Float32Array(rings.length * 3);
        packetGeometry.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
        packetGeometry.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(rings.length).fill(22), 1));
        packetGeometry.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(rings.length).fill(0.25), 1));
        disposables.push(packetGeometry);
        const packets = new THREE.Points(packetGeometry, spriteMaterial);
        rig.add(packets);

        // ── Layout & interaction state ──────────────────
        const layout = { x: 0, y: 0, scale: 1 };
        const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        const scroll = { current: 0, target: 0 };
        const intro = { start: performance.now(), duration: reducedMotion ? 0 : 2400 };
        const matrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();
        const position = new THREE.Vector3();
        const scaleVector = new THREE.Vector3(1, 1, 1);
        const packetVector = new THREE.Vector3();
        const rigScreen = new THREE.Vector3();
        const proximity = { current: 0 };

        function applyLayout() {
          const width = Math.max(container.clientWidth, 1);
          const height = Math.max(container.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);

          // Keep the cluster clear of the headline column
          const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
          if (width < 768) {
            layout.x = halfWidth * 0.55;
            layout.y = 2.7;
            layout.scale = 0.5;
          } else if (width < 1180) {
            layout.x = halfWidth * 0.62;
            layout.y = 0.35;
            layout.scale = 0.6;
          } else {
            layout.x = halfWidth * 0.7;
            layout.y = 0.15;
            layout.scale = 0.58;
          }
        }

        function updateScrollTarget() {
          const hero = container.closest('section') ?? container;
          const height = Math.max(hero.getBoundingClientRect().height, 1);
          scroll.target = clamp(window.scrollY / height);
          container.dataset.scrollTarget = scroll.target.toFixed(3);
        }

        function renderFrame(now: number) {
          const elapsed = now / 1000;
          const introProgress = intro.duration === 0 ? 1 : clamp((now - intro.start) / intro.duration);
          const introEase = 1 - Math.pow(1 - introProgress, 4);

          pointer.x += (pointer.tx - pointer.x) * 0.05;
          pointer.y += (pointer.ty - pointer.y) * 0.05;
          scroll.current += (scroll.target - scroll.current) * 0.08;

          // Modules part slightly when the cursor approaches the cluster
          camera.updateMatrixWorld();
          rigScreen.copy(rig.position).project(camera);
          const pointerDistance = Math.hypot(pointer.tx - rigScreen.x, -pointer.ty - rigScreen.y);
          // Guard against a degenerate projection (e.g. before the first layout) poisoning the easing with NaN
          const targetProximity = reducedMotion || !Number.isFinite(pointerDistance) ? 0 : clamp(1 - pointerDistance / 0.55);
          proximity.current += (targetProximity - proximity.current) * 0.06;

          const explode = (1 - introEase) * 3.2 + scroll.current * 2.4 + proximity.current * 0.32;
          const breathing = reducedMotion ? 0 : 0.035;

          modules.forEach((module) => {
            const offset = explode * module.spread + Math.sin(elapsed * 1.2 + module.phase) * breathing;
            position.copy(module.base).addScaledVector(module.direction, offset);
            quaternion.setFromAxisAngle(module.spin, explode * module.spread * 0.9);
            matrix.compose(position, quaternion, scaleVector);
            module.mesh.setMatrixAt(module.slot, matrix);
            if (module.edges) {
              module.edges.position.copy(position);
              module.edges.quaternion.copy(quaternion);
            }
          });
          darkMesh.instanceMatrix.needsUpdate = true;
          accentMesh.instanceMatrix.needsUpdate = true;

          const idleSpin = reducedMotion ? 0.6 : elapsed * 0.12;
          cluster.rotation.set(0.62 + pointer.y * 0.22, 0.72 + idleSpin + pointer.x * 0.4, 0.08);

          rig.position.set(layout.x + pointer.x * 0.15, layout.y + scroll.current * 1.6 - pointer.y * 0.1, 0);
          rig.scale.setScalar(layout.scale * (0.86 + introEase * 0.14) * (1 - scroll.current * 0.15));

          rings.forEach((ring, index) => {
            ring.holder.rotation.z = ring.tilt.z + (reducedMotion ? 0 : elapsed * ring.speed);
            const angle = (reducedMotion ? 1.2 : elapsed * 0.6) + index * Math.PI;
            packetVector.set(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0);
            packetVector.applyEuler(ring.holder.rotation);
            packetPositions[index * 3] = packetVector.x;
            packetPositions[index * 3 + 1] = packetVector.y;
            packetPositions[index * 3 + 2] = packetVector.z;
          });
          packetGeometry.attributes.position.needsUpdate = true;
          ringMaterial.opacity = 0.28 * introEase * (1 - scroll.current * 0.7);

          field.rotation.y = pointer.x * 0.08 + (reducedMotion ? 0 : elapsed * 0.01);
          field.rotation.x = pointer.y * 0.05;
          field.position.y = scroll.current * 2.2;
          spriteMaterial.uniforms.uTime.value = reducedMotion ? 0 : elapsed;

          camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04;
          camera.position.y += (-pointer.y * 0.25 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        }

        let animationId = 0;
        let isVisible = true;
        let isTabVisible = !document.hidden;

        function loop(now: number) {
          animationId = requestAnimationFrame(loop);
          if (!isVisible || !isTabVisible) return;
          renderFrame(now);
        }

        const handlePointerMove = (event: PointerEvent) => {
          pointer.tx = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
          pointer.ty = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
        };
        const handleVisibility = () => {
          isTabVisible = !document.hidden;
        };
        const resizeObserver = new ResizeObserver(() => {
          applyLayout();
          if (reducedMotion) renderFrame(performance.now());
        });
        const visibilityObserver = new IntersectionObserver(([entry]) => {
          isVisible = entry?.isIntersecting ?? true;
        });

        applyLayout();
        updateScrollTarget();
        resizeObserver.observe(container);

        if (reducedMotion) {
          renderFrame(performance.now());
        } else {
          visibilityObserver.observe(container);
          window.addEventListener('pointermove', handlePointerMove, { passive: true });
          window.addEventListener('scroll', updateScrollTarget, { passive: true });
          document.addEventListener('visibilitychange', handleVisibility);
          animationId = requestAnimationFrame(loop);
        }

        container.dataset.sceneReady = 'true';
        isReady = true;

        cleanup = () => {
          cancelAnimationFrame(animationId);
          resizeObserver.disconnect();
          visibilityObserver.disconnect();
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('scroll', updateScrollTarget);
          document.removeEventListener('visibilitychange', handleVisibility);
          darkMesh.dispose();
          accentMesh.dispose();
          disposables.forEach((item) => item.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch (error) {
        hasError = true;
        console.error('StudioScene error:', error);
      }
    };

    // Keep Three.js out of the critical path: start well after load, during idle time
    let delayTimer = 0;
    let idleHandle = 0;
    const scheduleStart = () => {
      delayTimer = window.setTimeout(() => {
        idleHandle = 'requestIdleCallback' in window
          ? window.requestIdleCallback(() => void init(), { timeout: 800 })
          : window.setTimeout(() => void init(), 0);
      }, 2_500);
    };

    // Phones, data-saver, and low-core (<4) devices keep the CSS glow instead of paying
    // for WebGL setup (a ~2s main-thread task on throttled mobile CPUs)
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const lightweight =
      window.matchMedia('(max-width: 767px)').matches ||
      Boolean(connection?.saveData) ||
      (navigator.hardwareConcurrency ?? 8) < 4;

    if (lightweight) {
      container.dataset.sceneReady = 'lite';
    } else if (document.readyState === 'complete') {
      scheduleStart();
    } else {
      window.addEventListener('load', scheduleStart, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener('load', scheduleStart);
      window.clearTimeout(delayTimer);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
      cleanup();
    };
  });
</script>

<div class="studio-scene-wrap" aria-hidden="true">
  <div class="scene-placeholder" class:is-hidden={isReady || hasError}></div>
  <div
    bind:this={container}
    class="studio-scene"
    class:is-ready={isReady}
    class:has-error={hasError}
    data-testid="site-scene"
  ></div>
</div>

<style>
  .studio-scene-wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .scene-placeholder.is-hidden {
    opacity: 0;
    animation-play-state: paused;
  }

  .studio-scene {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 1.2s ease;
  }

  .studio-scene.is-ready {
    opacity: 1;
  }

  .studio-scene :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 767px) {
    .studio-scene.is-ready {
      opacity: 0.55;
    }
  }
</style>
