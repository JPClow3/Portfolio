<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@/lib/accessibility';

  let isVisible = $state(false);
  let showReducedMotion = $state(false);

  onMount(() => {
    showReducedMotion = prefersReducedMotion();

    function handleScroll() {
      const scrollPosition = window.scrollY;
      isVisible = scrollPosition > 500;
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: showReducedMotion ? 'auto' : 'smooth',
      });
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Allow activation on Enter key as well
      if (e.key === 'Enter') {
        scrollToTop();
      }
    }

    window.addEventListener('scroll', handleScroll);
    const button = document.querySelector('#back-to-top-btn') as HTMLButtonElement;
    if (button) {
      button.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (button) {
        button.removeEventListener('keydown', handleKeyDown);
      }
    };
  });
</script>

<button
  id="back-to-top-btn"
  on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  aria-label="Back to top"
  class="back-to-top-button"
  class:visible={isVisible}
>
  <svg
    class="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M5 15l7-7 7 7"
    ></path>
  </svg>
</button>

<style>
  .back-to-top-button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, rgb(var(--color-accent)), rgb(168 85 247));
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    opacity: 0;
    pointer-events: none;
    transform: translateY(2rem) scale(0.9);
    transition:
      opacity 200ms ease,
      transform 200ms ease;
    box-shadow: 0 4px 12px rgb(var(--color-accent) / 0.3);
    z-index: 40;
  }

  .back-to-top-button:hover {
    transform: translateY(1rem) scale(1);
    box-shadow: 0 8px 20px rgb(var(--color-accent) / 0.5);
  }

  .back-to-top-button:focus-visible {
    outline: 2px solid rgb(var(--color-accent));
    outline-offset: 2px;
  }

  .back-to-top-button.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  @media (max-width: 640px) {
    .back-to-top-button {
      bottom: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .back-to-top-button svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .back-to-top-button {
      transition: none;
    }

    .back-to-top-button:hover {
      transform: none;
    }
  }
</style>
