<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@/lib/accessibility';

  let container: HTMLDivElement;
  let isLoading = $state(true);
  let showReducedMotion = $state(false);
  let hasError = $state(false);
  let errorMessage = $state('');

  const sceneProfiles = {
    about: { hero: 1, particles: 1, lines: 1, ribbons: 1, vertical: 0.05, calm: 0.1 },
    projects: { hero: 0.32, particles: 1.18, lines: 1.55, ribbons: 1.08, vertical: 0.14, calm: 0 },
    experience: { hero: 0.16, particles: 1.04, lines: 1.22, ribbons: 0.9, vertical: 0.85, calm: 0.08 },
    activity: { hero: 0.1, particles: 0.88, lines: 0.78, ribbons: 0.7, vertical: 0.25, calm: 0.32 },
    contact: { hero: 0.08, particles: 0.8, lines: 0.66, ribbons: 0.58, vertical: 0.08, calm: 0.44 },
    blog: { hero: 0.08, particles: 0.76, lines: 0.58, ribbons: 0.5, vertical: 0.05, calm: 0.5 },
    default: { hero: 0.1, particles: 0.8, lines: 0.62, ribbons: 0.56, vertical: 0.08, calm: 0.42 },
  } as const;

  type SceneSection = keyof typeof sceneProfiles;

  onMount(() => {
    let cleanup: () => void = () => {};

    showReducedMotion = prefersReducedMotion();

    const normalizeSection = (section?: string): SceneSection =>
      section && section in sceneProfiles ? (section as SceneSection) : 'default';

    function getRouteSection(): SceneSection {
      if (window.location.pathname.startsWith('/projects')) return 'projects';
      if (window.location.pathname.startsWith('/blog')) return 'blog';

      return 'default';
    }

    container.dataset.sceneSection = getRouteSection();
    container.dataset.logoFocus = 'false';

    if (showReducedMotion) {
      isLoading = false;
      return;
    }

    const initScene = async () => {
      try {
        const THREE = await import('three');

        const isMobile = window.innerWidth < 768;
        const particlesCount = isMobile ? 95 : 190;
        const lineCount = isMobile ? 22 : 42;
        const disposables: Array<{ dispose: () => void }> = [];
        const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 90);
        camera.position.set(0, 0.1, 7.2);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.35 : 1.85));
        renderer.domElement.setAttribute('aria-hidden', 'true');
        container.appendChild(renderer.domElement);

        const readCssColor = (name: string, fallback: number) => {
          const rawValue = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
          const channels = rawValue.split(/\s+/).map((channel) => Number(channel));

          if (channels.length < 3 || channels.some((channel) => Number.isNaN(channel))) {
            return new THREE.Color(fallback);
          }

          return new THREE.Color(channels[0] / 255, channels[1] / 255, channels[2] / 255);
        };

        let seed = 58;
        const random = () => {
          const value = Math.sin(seed++) * 10000;
          return value - Math.floor(value);
        };

        const rootGroup = new THREE.Group();
        const fieldGroup = new THREE.Group();
        const heroGroup = new THREE.Group();
        const ribbonGroup = new THREE.Group();
        scene.add(rootGroup);
        rootGroup.add(fieldGroup, heroGroup, ribbonGroup);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.62);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(2.5, 3.5, 5.5);
        scene.add(keyLight);

        const fillLight = new THREE.PointLight(0x7dd3fc, 0.65, 16);
        fillLight.position.set(-3.5, -1.5, 4.5);
        scene.add(fillLight);

        const prismGeometry = new THREE.IcosahedronGeometry(isMobile ? 0.92 : 1.28, 1);
        const prismMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          roughness: 0.2,
          metalness: 0.04,
          transparent: true,
          opacity: isMobile ? 0.11 : 0.14,
          depthWrite: false,
          side: THREE.DoubleSide,
          transmission: 0.25,
        });
        disposables.push(prismGeometry, prismMaterial);

        const prism = new THREE.Mesh(prismGeometry, prismMaterial);
        heroGroup.add(prism);

        const edgeGeometry = new THREE.EdgesGeometry(prismGeometry, 14);
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: isMobile ? 0.24 : 0.34,
        });
        disposables.push(edgeGeometry, edgeMaterial);
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        heroGroup.add(edges);

        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: isMobile ? 0.07 : 0.11,
          depthWrite: false,
        });
        const outerRingGeometry = new THREE.TorusGeometry(isMobile ? 1.22 : 1.72, 0.0045, 8, 128);
        const innerRingGeometry = new THREE.TorusGeometry(isMobile ? 0.74 : 1.05, 0.0035, 8, 96);
        disposables.push(ringMaterial, outerRingGeometry, innerRingGeometry);

        const outerRing = new THREE.Mesh(outerRingGeometry, ringMaterial);
        outerRing.rotation.set(1.04, 0.16, -0.22);
        heroGroup.add(outerRing);

        const innerRingMaterial = ringMaterial.clone();
        disposables.push(innerRingMaterial);
        const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
        innerRing.rotation.set(0.28, 1.18, 0.12);
        heroGroup.add(innerRing);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particlesCount * 3);
        const particleBasePositions = new Float32Array(particlesCount * 3);
        const particleSpeeds = new Float32Array(particlesCount);
        const particleDepths = new Float32Array(particlesCount);
        const fieldWidth = isMobile ? 8.2 : 12.4;
        const fieldHeight = isMobile ? 10.5 : 9.2;

        for (let i = 0; i < particlesCount; i += 1) {
          const index = i * 3;
          const depth = random();
          particleBasePositions[index] = (random() - 0.5) * fieldWidth;
          particleBasePositions[index + 1] = (random() - 0.5) * fieldHeight;
          particleBasePositions[index + 2] = -1.4 - depth * 5.6;
          particleSpeeds[i] = 0.45 + random() * 0.9;
          particleDepths[i] = depth;
          particlePositions[index] = particleBasePositions[index];
          particlePositions[index + 1] = particleBasePositions[index + 1];
          particlePositions[index + 2] = particleBasePositions[index + 2];
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
          color: 0x7dd3fc,
          size: isMobile ? 0.017 : 0.021,
          transparent: true,
          opacity: isMobile ? 0.28 : 0.36,
          depthWrite: false,
        });
        disposables.push(particlesGeometry, particlesMaterial);
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        fieldGroup.add(particles);

        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(lineCount * 6);
        const lineBasePositions = new Float32Array(lineCount * 6);

        for (let i = 0; i < lineCount; i += 1) {
          const index = i * 6;
          const x = (random() - 0.5) * (isMobile ? 6.8 : 10.8);
          const y = (random() - 0.5) * (isMobile ? 8.2 : 7.6);
          const z = -1.5 - random() * 4.8;
          lineBasePositions[index] = x;
          lineBasePositions[index + 1] = y;
          lineBasePositions[index + 2] = z;
          lineBasePositions[index + 3] = x + (random() - 0.5) * 1.2;
          lineBasePositions[index + 4] = y + (random() - 0.5) * 1.2;
          lineBasePositions[index + 5] = z + (random() - 0.5) * 0.55;

          for (let offset = 0; offset < 6; offset += 1) {
            linePositions[index + offset] = lineBasePositions[index + offset];
          }
        }

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: isMobile ? 0.08 : 0.13,
        });
        disposables.push(lineGeometry, lineMaterial);
        const depthLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        fieldGroup.add(depthLines);

        const ribbonMaterial = new THREE.LineBasicMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: isMobile ? 0.07 : 0.1,
        });
        disposables.push(ribbonMaterial);

        for (let ribbonIndex = 0; ribbonIndex < (isMobile ? 2 : 3); ribbonIndex += 1) {
          const points = [];
          const amplitude = 0.38 + ribbonIndex * 0.08;
          const yBase = -2.3 + ribbonIndex * 1.9;

          for (let pointIndex = 0; pointIndex < 44; pointIndex += 1) {
            const progress = pointIndex / 43;
            points.push(
              new THREE.Vector3(
                -6 + progress * 12,
                yBase + Math.sin(progress * Math.PI * 2 + ribbonIndex) * amplitude,
                -3.2 - ribbonIndex * 0.75,
              ),
            );
          }

          const ribbonGeometry = new THREE.BufferGeometry().setFromPoints(points);
          disposables.push(ribbonGeometry);
          const ribbon = new THREE.Line(ribbonGeometry, ribbonMaterial);
          ribbon.rotation.z = (ribbonIndex - 1) * 0.08;
          ribbonGroup.add(ribbon);
        }

        const applyTheme = () => {
          const accent = readCssColor('--color-accent', 0x7dd3fc);
          const hover = readCssColor('--color-accent-hover', 0xbae6fd);

          prismMaterial.color.copy(accent);
          edgeMaterial.color.copy(accent);
          ringMaterial.color.copy(hover);
          innerRingMaterial.color.copy(hover);
          particlesMaterial.color.copy(hover);
          lineMaterial.color.copy(accent);
          ribbonMaterial.color.copy(accent);
          fillLight.color.copy(hover);
        };

        applyTheme();

        const themeObserver = new MutationObserver(applyTheme);
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });

        const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
        const scroll = { current: 0, target: 0 };
        const logoFocus = { current: 0, target: 0 };
        let activeSection: SceneSection = getRouteSection();
        const mood = { ...sceneProfiles[activeSection] };
        const particleAttribute = particlesGeometry.getAttribute('position');
        const lineAttribute = lineGeometry.getAttribute('position');

        function setSceneSection(section?: string) {
          activeSection = normalizeSection(section);
          container.dataset.sceneSection = activeSection;
        }

        function findNearestSceneSection(sections: HTMLElement[]) {
          const anchorY = window.innerHeight * 0.42;
          let nextSection = sections[0]?.dataset.sceneSection ?? sections[0]?.id ?? getRouteSection();
          let bestDistance = Number.POSITIVE_INFINITY;

          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const crossesAnchor = rect.top <= anchorY && rect.bottom >= anchorY;
            const distance = crossesAnchor ? 0 : Math.min(Math.abs(rect.top - anchorY), Math.abs(rect.bottom - anchorY));

            if (distance < bestDistance) {
              bestDistance = distance;
              nextSection = section.dataset.sceneSection ?? section.id ?? nextSection;
            }
          });

          return nextSection;
        }

        function syncSceneSectionFromViewport() {
          const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-section]:not([data-testid="site-scene"])'));

          if (sections.length === 0) {
            setSceneSection(getRouteSection());
            return;
          }

          setSceneSection(findNearestSceneSection(sections));
        }

        function handleSectionChange(event: Event) {
          const section = (event as CustomEvent<{ section?: string }>).detail?.section;
          setSceneSection(section);
        }

        function handleLogoFocus(event: Event) {
          const active = Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active);
          logoFocus.target = active ? 1 : 0;
          container.dataset.logoFocus = active ? 'true' : 'false';
        }

        function updateScrollTarget() {
          const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
          scroll.target = clamp(window.scrollY / maxScroll);
          container.dataset.scrollTarget = scroll.target.toFixed(3);
        }

        function handleResize() {
          const width = Math.max(container.clientWidth, 1);
          const height = Math.max(container.clientHeight, 1);

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          updateScrollTarget();
        }

        function handlePointerMove(event: PointerEvent) {
          pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
          pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
        }

        function handlePointerLeave() {
          pointer.targetX = 0;
          pointer.targetY = 0;
        }

        let sceneSectionObserver: IntersectionObserver | null = null;
        const sceneSections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-section]:not([data-testid="site-scene"])'));

        if (sceneSections.length > 0 && 'IntersectionObserver' in window) {
          sceneSectionObserver = new IntersectionObserver(syncSceneSectionFromViewport, {
            rootMargin: '-24% 0px -56% 0px',
            threshold: [0, 0.12, 0.36, 0.72],
          });

          sceneSections.forEach((section) => sceneSectionObserver?.observe(section));
        }

        let animationId = 0;
        const clock = new THREE.Clock();
        let isTabVisible = true;
        let frame = 0;

        function animate() {
          animationId = requestAnimationFrame(animate);

          if (!isTabVisible) return;

          frame += 1;
          const elapsedTime = clock.getElapsedTime();
          pointer.x += (pointer.targetX - pointer.x) * 0.055;
          pointer.y += (pointer.targetY - pointer.y) * 0.055;
          scroll.current += (scroll.target - scroll.current) * 0.045;
          logoFocus.current += (logoFocus.target - logoFocus.current) * 0.065;

          const targetMood = sceneProfiles[activeSection] ?? sceneProfiles.default;
          mood.hero += (targetMood.hero - mood.hero) * 0.035;
          mood.particles += (targetMood.particles - mood.particles) * 0.035;
          mood.lines += (targetMood.lines - mood.lines) * 0.035;
          mood.ribbons += (targetMood.ribbons - mood.ribbons) * 0.035;
          mood.vertical += (targetMood.vertical - mood.vertical) * 0.035;
          mood.calm += (targetMood.calm - mood.calm) * 0.035;

          const scrollWave = Math.sin(scroll.current * Math.PI * 2);
          const heroPresence = (1 - clamp(scroll.current * 3, 0, 0.86)) * mood.hero;
          const baseHeroX = isMobile ? 1.25 : 2.35;
          const baseHeroY = isMobile ? -1.2 : 0.42;
          const motionScale = 1 - mood.calm * 0.36;

          rootGroup.rotation.x = pointer.y * -0.018 * motionScale;
          rootGroup.rotation.y = pointer.x * 0.026 * motionScale;

          heroGroup.position.x = baseHeroX + pointer.x * 0.18 * motionScale + scroll.current * (isMobile ? 0.3 : 1.8);
          heroGroup.position.y = baseHeroY - scroll.current * (isMobile ? 2.2 : 1.75) + Math.sin(elapsedTime * 0.36) * 0.08 * motionScale;
          heroGroup.position.z = -0.12 - scroll.current * 1.2;
          heroGroup.scale.setScalar((isMobile ? 1.34 : 1.22) - scroll.current * 0.42);
          heroGroup.rotation.x = -0.1 + Math.sin(elapsedTime * 0.22) * 0.06 * motionScale + pointer.y * 0.05 * motionScale;
          heroGroup.rotation.y = elapsedTime * 0.08 * motionScale + pointer.x * 0.1 * motionScale + scroll.current * 0.62;
          heroGroup.rotation.z = Math.sin(elapsedTime * 0.18) * 0.04 * motionScale - scroll.current * 0.18;

          prismMaterial.opacity = (isMobile ? 0.09 : 0.13) * heroPresence;
          edgeMaterial.opacity = (isMobile ? 0.2 : 0.34) * heroPresence;
          ringMaterial.opacity = (isMobile ? 0.055 : 0.09) * heroPresence;
          innerRingMaterial.opacity = ringMaterial.opacity;

          outerRing.rotation.z = elapsedTime * 0.045 * motionScale + scroll.current * 1.2;
          innerRing.rotation.y = elapsedTime * 0.07 * motionScale + scroll.current * 1.4;
          fieldGroup.rotation.y = pointer.x * 0.035 * motionScale + scroll.current * 0.28;
          fieldGroup.rotation.x = pointer.y * -0.018 * motionScale + scrollWave * 0.018;
          ribbonGroup.position.y = -scroll.current * 0.55 + pointer.y * -0.08 * motionScale;
          ribbonGroup.rotation.z = pointer.x * 0.025 * motionScale + scroll.current * -0.08;

          for (let i = 0; i < particlesCount; i += 1) {
            const index = i * 3;
            const depth = particleDepths[i];
            const drift = elapsedTime * particleSpeeds[i];
            const parallax = (depth - 0.5) * 0.8;
            const logoEligible = i % 3 === 0 ? 1 : 0.36;
            const logoStrength = logoFocus.current * logoEligible * (0.08 + depth * 0.11);
            const logoX = isMobile ? -2.9 : -5.15;
            const logoY = isMobile ? 4.35 : 3.15;
            const verticalTrace = mood.vertical * Math.sin(elapsedTime * (0.45 + depth * 0.28) + i * 0.17) * (0.22 + depth * 0.28);
            const baseX =
              particleBasePositions[index] +
              Math.sin(drift + i * 0.31) * 0.055 * motionScale +
              pointer.x * (0.12 + depth * 0.18) * motionScale;
            const baseY =
              particleBasePositions[index + 1] +
              Math.cos(drift * 0.74 + i * 0.23) * 0.05 * motionScale +
              scroll.current * parallax +
              verticalTrace +
              pointer.y * (0.08 + depth * 0.1) * motionScale;

            particlePositions[index] = baseX + (logoX - baseX) * logoStrength;
            particlePositions[index + 1] = baseY + (logoY - baseY) * logoStrength;
            particlePositions[index + 2] =
              particleBasePositions[index + 2] +
              Math.sin(drift * 0.48 + scroll.current * 5) * 0.08 * motionScale +
              logoFocus.current * 0.22 * logoEligible;
          }

          particleAttribute.needsUpdate = true;

          for (let i = 0; i < linePositions.length; i += 3) {
            const wave = Math.sin(elapsedTime * 0.35 + i * 0.13 + scroll.current * 4) * 0.045 * motionScale;
            const verticalTrace = mood.vertical * Math.sin(elapsedTime * 0.52 + i * 0.09) * 0.26;
            linePositions[i] = lineBasePositions[i] + pointer.x * 0.05 * motionScale;
            linePositions[i + 1] = lineBasePositions[i + 1] + wave + scroll.current * 0.18 + verticalTrace;
            linePositions[i + 2] = lineBasePositions[i + 2];
          }

          lineAttribute.needsUpdate = true;
          particlesMaterial.opacity = ((isMobile ? 0.23 : 0.32) + scroll.current * (isMobile ? 0.04 : 0.06)) * mood.particles;
          lineMaterial.opacity = ((isMobile ? 0.06 : 0.1) + scroll.current * 0.035) * mood.lines;
          ribbonMaterial.opacity = ((isMobile ? 0.045 : 0.08) + Math.abs(scrollWave) * 0.025) * mood.ribbons;

          camera.position.x += (pointer.x * 0.18 - camera.position.x) * 0.035;
          camera.position.y += (0.1 + pointer.y * -0.08 - camera.position.y) * 0.035;
          camera.lookAt(0, 0, -1.2);

          renderer.render(scene, camera);

          if (frame % 12 === 0) {
            container.dataset.scrollDepth = scroll.current.toFixed(3);
            container.dataset.pointerX = pointer.x.toFixed(3);
            container.dataset.sceneSection = activeSection;
            container.dataset.logoFocus = logoFocus.target > 0 ? 'true' : 'false';
          }
        }

        function handleVisibilityChange() {
          isTabVisible = !document.hidden;
          if (isTabVisible) {
            clock.start();
          }
        }

        handleResize();
        updateScrollTarget();
        setSceneSection(getRouteSection());
        syncSceneSectionFromViewport();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', updateScrollTarget, { passive: true });
        window.addEventListener('resize', syncSceneSectionFromViewport);
        window.addEventListener('scroll', syncSceneSectionFromViewport, { passive: true });
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('portfolio:section-change', handleSectionChange);
        window.addEventListener('portfolio:logo-focus', handleLogoFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        container.dataset.sceneReady = 'true';
        container.dataset.scrollDepth = '0';
        container.dataset.scrollTarget = scroll.target.toFixed(3);
        container.dataset.sceneSection = activeSection;
        container.dataset.logoFocus = 'false';
        isLoading = false;
        animate();

        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', updateScrollTarget);
          window.removeEventListener('resize', syncSceneSectionFromViewport);
          window.removeEventListener('scroll', syncSceneSectionFromViewport);
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerleave', handlePointerLeave);
          window.removeEventListener('portfolio:section-change', handleSectionChange);
          window.removeEventListener('portfolio:logo-focus', handleLogoFocus);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          sceneSectionObserver?.disconnect();
          themeObserver.disconnect();
          cancelAnimationFrame(animationId);
          disposables.forEach((disposable) => disposable.dispose());
          renderer.dispose();

          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (error) {
        isLoading = false;
        hasError = true;
        errorMessage = error instanceof Error ? error.message : 'Failed to load 3D scene';
        console.error('HeroScene error:', error);
      }
    };

    initScene();

    return () => cleanup();
  });
</script>

<div bind:this={container} class="scene-container" data-testid="site-scene">
  {#if isLoading && !showReducedMotion && !hasError}
    <div class="loading-skeleton">
      <div class="skeleton-shape"></div>
    </div>
  {/if}

  {#if showReducedMotion}
    <div class="static-gradient"></div>
  {/if}

  {#if hasError}
    <div class="error-gradient" role="status" aria-live="polite">
      <div class="error-message">
        <p>Failed to load 3D scene</p>
        <p class="error-detail">{errorMessage}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .scene-container {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.72;
  }

  .scene-container :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .loading-skeleton {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }

  .skeleton-shape {
    width: 9rem;
    height: 9rem;
    border-radius: 0.85rem;
    background: linear-gradient(
      135deg,
      rgb(var(--color-accent) / 0.1) 0%,
      rgb(14 165 233 / 0.08) 100%
    );
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .static-gradient {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgb(var(--color-accent) / 0.07), transparent 36%),
      linear-gradient(225deg, rgb(14 165 233 / 0.055), transparent 46%);
  }

  .error-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgb(var(--color-accent) / 0.06) 0%,
      rgb(14 165 233 / 0.05) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-message {
    padding: 1rem;
    border-radius: 0.5rem;
    background: rgb(var(--color-bg-secondary) / 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgb(var(--color-border));
    text-align: center;
  }

  .error-message p {
    margin: 0;
    font-size: 0.875rem;
    color: rgb(var(--color-text-secondary));
  }

  .error-detail {
    font-size: 0.75rem !important;
    opacity: 0.7;
    margin-top: 0.5rem;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
  }

  @media (max-width: 640px) {
    .scene-container {
      opacity: 0.62;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-shape {
      animation: none;
    }
  }
</style>
