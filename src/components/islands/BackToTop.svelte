<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@/lib/accessibility';

  // Ring progress reads --scroll-progress, written on <html> by Interactions.astro
  const RADIUS = 21;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let isVisible = $state(false);
  let showReducedMotion = $state(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: showReducedMotion ? 'auto' : 'smooth' });
  }

  onMount(() => {
    showReducedMotion = prefersReducedMotion();

    const handleScroll = () => {
      isVisible = window.scrollY > 600;
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';

      if (isEditable) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleGlobalKeyDown);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  });
</script>

<button
  id="back-to-top-btn"
  type="button"
  onclick={scrollToTop}
  aria-label="Back to top"
  class="back-to-top-button"
  class:visible={isVisible}
  style={`--ring: ${CIRCUMFERENCE.toFixed(2)}`}
>
  <svg class="progress-ring" viewBox="0 0 48 48" aria-hidden="true">
    <circle class="ring-track" cx="24" cy="24" r={RADIUS} />
    <circle class="ring-value" cx="24" cy="24" r={RADIUS} />
  </svg>
  <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
</button>

<style>
  .back-to-top-button {
    position: fixed;
    right: 1.75rem;
    bottom: 1.75rem;
    z-index: 40;
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border: 0;
    border-radius: 999px;
    color: rgb(var(--color-text-primary));
    background: rgb(var(--color-bg-secondary) / 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 12px 30px -12px rgb(0 0 0 / 0.5), inset 0 0 0 1px rgb(var(--color-border));
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transform: translateY(1rem) scale(0.9);
    transition:
      opacity 0.3s ease,
      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease;
  }

  .back-to-top-button.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  .back-to-top-button:hover {
    box-shadow: 0 16px 36px -12px rgb(0 94 254 / 0.6), inset 0 0 0 1px rgb(var(--color-accent) / 0.5);
  }

  .back-to-top-button:hover .arrow {
    transform: translateY(-2px);
  }

  .back-to-top-button:active {
    transform: scale(0.94);
  }

  .back-to-top-button:focus-visible {
    outline: 2px solid rgb(var(--color-accent));
    outline-offset: 3px;
  }

  .progress-ring,
  .arrow {
    grid-area: 1 / 1;
  }

  .progress-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-ring circle {
    fill: none;
    stroke-width: 2;
  }

  .ring-track {
    stroke: rgb(var(--color-border));
  }

  .ring-value {
    stroke: rgb(var(--color-accent));
    stroke-linecap: round;
    stroke-dasharray: var(--ring);
    stroke-dashoffset: calc(var(--ring) * (1 - var(--scroll-progress, 0)));
    filter: drop-shadow(0 0 4px rgb(var(--color-accent) / 0.8));
  }

  .arrow {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (max-width: 768px) {
    .back-to-top-button {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .back-to-top-button,
    .arrow {
      transition: none;
    }
  }
</style>
