<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container: HTMLDivElement;
  let mounted = $state(false);
  let isLoading = $state(true);
  let prefersReducedMotion = $state(false);

  onMount(() => {
    mounted = true;

    // Check for reduced motion preference
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If reduced motion is preferred, show static gradient instead
    if (prefersReducedMotion) {
      isLoading = false;
      return;
    }

    // Check if mobile for reduced particle count
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 50 : 100;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    // Mark as loaded once canvas is ready
    isLoading = false;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 0.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Main geometry - Wireframe icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();
    let isTabVisible = true;

    function animate() {
      animationId = requestAnimationFrame(animate);

      // Skip rendering if tab is not visible
      if (!isTabVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Rotate icosahedron
      icosahedron.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
      icosahedron.rotation.y = elapsedTime * 0.2;

      // Float effect
      icosahedron.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

      // Rotate particles slowly
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    // Pause animation when tab is hidden (performance optimization)
    function handleVisibilityChange() {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.start(); // Resume clock to prevent jump
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  });
</script>

<div bind:this={container} class="scene-container">
  {#if isLoading && !prefersReducedMotion}
    <!-- Loading skeleton -->
    <div class="loading-skeleton">
      <div class="skeleton-shape"></div>
    </div>
  {/if}

  {#if prefersReducedMotion}
    <!-- Static gradient for reduced motion preference -->
    <div class="static-gradient"></div>
  {/if}
</div>

<style>
  .scene-container {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  .scene-container :global(canvas) {
    display: block;
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
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      rgb(var(--color-accent) / 0.1) 0%,
      rgb(168 85 247 / 0.1) 100%
    );
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .static-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgb(var(--color-accent) / 0.1) 0%,
      transparent 70%
    );
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

  @media (prefers-reduced-motion: reduce) {
    .skeleton-shape {
      animation: none;
    }
  }
</style>
