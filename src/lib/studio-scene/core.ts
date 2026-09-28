/**
 * Hero WebGL scene: a cluster of glossy modules ("the system") that assembles on load,
 * follows the pointer, and comes apart as the hero scrolls away. Orbit rings with
 * travelling packets and a depth particle field add parallax.
 *
 * DOM-free so it runs in a worker on an OffscreenCanvas (the default, see worker.ts) or on the
 * main thread as a fallback. The host measures the page and feeds layout, pointer and scroll in.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface SceneLayout {
  width: number;
  height: number;
  pixelRatio: number;
  /** Cluster centre, as fractions of the canvas */
  cx: number;
  cy: number;
  scale: number;
}

export interface SceneOptions {
  reducedMotion: boolean;
  isMobile: boolean;
  /** Called between setup steps; lets a main-thread host yield so no single task blocks input */
  pause?: () => Promise<void>;
}

export interface StudioScene {
  setLayout(layout: SceneLayout): void;
  /** Pointer position in [-1, 1] across the viewport */
  setPointer(x: number, y: number): void;
  /** Hero scroll progress in [0, 1] */
  setScroll(target: number): void;
  render(now: number): void;
  dispose(): void;
}

export type SceneCanvas = HTMLCanvasElement | OffscreenCanvas;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export async function createStudioScene(canvas: SceneCanvas, options: SceneOptions): Promise<StudioScene> {
  const { reducedMotion, isMobile } = options;
  const pause = options.pause ?? (async () => {});
  const disposables: Array<{ dispose: () => void }> = [];

  let seed = 7;
  const random = () => {
    const value = Math.sin(seed++ * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  disposables.push(renderer);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const dispose = () => disposables.forEach((item) => item.dispose());

  try {
    await pause();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    disposables.push(pmrem, environment);

    await pause();

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
    const cells: Array<{ base: THREE.Vector3; accent: boolean }> = [];
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
    disposables.push(darkMesh, accentMesh);
    // Instance positions animate far from the geometry's origin; a cached bounding sphere would cull them
    darkMesh.frustumCulled = false;
    accentMesh.frustumCulled = false;
    cluster.add(darkMesh, accentMesh);

    const accentEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(moduleGeometry, 30),
      new THREE.LineBasicMaterial({ color: 0x9cc4ff, transparent: true, opacity: 0.55 }),
    );
    disposables.push(accentEdges.geometry, accentEdges.material as THREE.Material);

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
        uPixelRatio: { value: 1 },
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

    // Compile shaders (in parallel where supported) before the first frame instead of inside it
    await renderer.compileAsync(scene, camera);

    // ── Layout & interaction state ──────────────────
    const layout = { cx: 0.5, cy: 0.5, scale: 1 };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const scroll = { current: 0, target: 0 };
    // Time runs from the first frame, so the intro plays in full however late the scene starts
    // and the reduced-motion frame matches the poster (scripts/capture-scene-poster.mjs)
    let startTime: number | undefined;
    const introDuration = reducedMotion ? 0 : 2400;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scaleVector = new THREE.Vector3(1, 1, 1);
    const packetVector = new THREE.Vector3();
    const rigScreen = new THREE.Vector3();
    const proximity = { current: 0 };

    return {
      setLayout(next) {
        const width = Math.max(next.width, 1);
        const height = Math.max(next.height, 1);
        renderer.setPixelRatio(next.pixelRatio);
        renderer.setSize(width, height, false);
        spriteMaterial.uniforms.uPixelRatio.value = next.pixelRatio;
        camera.aspect = width / height;
        // The cluster stays at the world origin and the projection is shifted instead, so it
        // renders identically at any aspect ratio (and matches the static poster)
        camera.setViewOffset(width, height, (0.5 - next.cx) * width, (0.5 - next.cy) * height, width, height);
        layout.cx = next.cx;
        layout.cy = next.cy;
        layout.scale = next.scale;
      },

      setPointer(x, y) {
        pointer.tx = x;
        pointer.ty = y;
      },

      setScroll(target) {
        scroll.target = clamp(target);
      },

      render(now) {
        startTime ??= now;
        const elapsed = (now - startTime) / 1000;
        const introProgress = introDuration === 0 ? 1 : clamp((now - startTime) / introDuration);
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
          const offset = explode * module.spread + (Math.sin(elapsed * 1.2 + module.phase) - Math.sin(module.phase)) * breathing;
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

        const idleSpin = reducedMotion ? 0 : elapsed * 0.12;
        cluster.rotation.set(0.62 + pointer.y * 0.22, 0.72 + idleSpin + pointer.x * 0.4, 0.08);

        rig.position.set(pointer.x * 0.15, scroll.current * 1.6 - pointer.y * 0.1, 0);
        rig.scale.setScalar(layout.scale * (0.86 + introEase * 0.14) * (1 - scroll.current * 0.15));

        rings.forEach((ring, index) => {
          ring.holder.rotation.z = ring.tilt.z + (reducedMotion ? 0 : elapsed * ring.speed);
          const angle = 1.2 + (reducedMotion ? 0 : elapsed * 0.6) + index * Math.PI;
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
      },

      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}

type FrameRequest = (callback: (now: number) => void) => number;

/**
 * Drives a scene: renders every frame while active (or once per change with reduced motion)
 * and reports the first rendered frame. Shared by the worker and the main-thread fallback.
 */
export function createSceneRunner(
  scene: StudioScene,
  { reducedMotion, layout, onFirstFrame }: { reducedMotion: boolean; layout: SceneLayout; onFirstFrame: () => void },
) {
  // Workers get requestAnimationFrame alongside OffscreenCanvas in current browsers
  const requestFrame: FrameRequest = typeof requestAnimationFrame === 'function'
    ? (callback) => requestAnimationFrame(callback)
    : (callback) => setTimeout(() => callback(performance.now()), 16) as unknown as number;
  const cancelFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;

  let active = true;
  let frameId = 0;
  let hasRendered = false;

  const draw = (now: number) => {
    scene.render(now);
    if (!hasRendered) {
      hasRendered = true;
      onFirstFrame();
    }
  };

  const loop = (now: number) => {
    frameId = requestFrame(loop);
    if (active) draw(now);
  };

  scene.setLayout(layout);
  if (reducedMotion) draw(performance.now());
  else frameId = requestFrame(loop);

  return {
    setLayout(layout: SceneLayout) {
      scene.setLayout(layout);
      if (reducedMotion) draw(performance.now());
    },
    setActive(value: boolean) {
      active = value;
    },
    dispose() {
      cancelFrame(frameId);
      scene.dispose();
    },
  };
}
