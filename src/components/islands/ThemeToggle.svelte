<script lang="ts">
  import { onMount } from 'svelte';

  let isDark = $state(false);
  let mounted = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
    mounted = true;

    // Listen for system theme changes and cleanup with returned function
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        isDark = e.matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        isDark = e.newValue === 'dark';
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorage);
    };
  });

  function updateTheme() {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function handleThemeChange(event: Event) {
    isDark = (event.currentTarget as HTMLInputElement).checked;
    updateTheme();
  }
</script>

<label
  class="theme-swap"
  class:theme-swap-mounted={mounted}
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  <input
    type="checkbox"
    class="theme-swap-input"
    checked={isDark}
    onchange={handleThemeChange}
    disabled={!mounted}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    aria-busy={!mounted}
  />

  <span class="theme-swap-icon theme-swap-sun" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M5.64 17l-.71.71a1 1 0 0 0 1.41 1.41l.71-.71A1 1 0 0 0 5.64 17ZM5 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm7-7a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1ZM5.64 7.05a1 1 0 0 0 1.41-1.41l-.71-.71a1 1 0 0 0-1.41 1.41Zm12.02.29a1 1 0 0 0 .7-.29l.71-.71a1 1 0 1 0-1.41-1.41l-.66.71a1 1 0 0 0 .66 1.7ZM21 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm-9 8a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1Zm6.36-2A1 1 0 0 0 17 18.36l.71.71a1 1 0 0 0 1.41-1.41ZM12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
      />
    </svg>
  </span>

  <span class="theme-swap-icon theme-swap-moon" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36 10.14 10.14 0 1 0 22 14.05 1 1 0 0 0 21.64 13Zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27a10.15 10.15 0 0 0 10.14 10.14 9.79 9.79 0 0 0 2.1-.22 8.11 8.11 0 0 1-7.18 4.32Z"
      />
    </svg>
  </span>
</label>

<style>
  .theme-swap {
    position: relative;
    display: inline-grid;
    width: 2.45rem;
    height: 2.45rem;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgb(var(--color-border));
    border-radius: 0.5rem;
    background:
      radial-gradient(circle at 30% 20%, rgb(250 204 21 / 0.18), transparent 34%),
      rgb(var(--color-bg-secondary) / 0.82);
    color: rgb(var(--color-text-secondary));
    cursor: pointer;
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .theme-swap:hover {
    border-color: rgb(var(--color-border-hover));
    background-color: rgb(var(--color-bg-tertiary));
    transform: translateY(-1px);
  }

  .theme-swap:has(.theme-swap-input:focus-visible) {
    outline: 2px solid rgb(var(--color-accent));
    outline-offset: 2px;
  }

  .theme-swap:not(.theme-swap-mounted) {
    cursor: wait;
    opacity: 0.72;
  }

  .theme-swap-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .theme-swap-icon {
    grid-area: 1 / 1;
    display: grid;
    width: 1.35rem;
    height: 1.35rem;
    place-items: center;
    transform-origin: 50% 50%;
    transition: transform 260ms ease, opacity 220ms ease;
  }

  .theme-swap-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .theme-swap-sun {
    color: rgb(234 179 8);
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }

  .theme-swap-moon {
    color: rgb(var(--color-text-primary));
    opacity: 0;
    transform: rotate(-90deg) scale(0.15);
  }

  .theme-swap-input:checked ~ .theme-swap-sun {
    opacity: 0;
    transform: rotate(90deg) scale(0.15);
  }

  .theme-swap-input:checked ~ .theme-swap-moon {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }

  :global(html.dark) .theme-swap {
    background:
      radial-gradient(circle at 70% 20%, rgb(129 140 248 / 0.2), transparent 36%),
      rgb(var(--color-bg-secondary) / 0.88);
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-swap,
    .theme-swap-icon {
      transition: none;
    }

    .theme-swap:hover {
      transform: none;
    }
  }
</style>
