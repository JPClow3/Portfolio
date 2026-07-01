<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:boundary>
  {@render children()}
  
  {#snippet failed(error, reset)}
    <div class="flex flex-col items-center justify-center rounded-lg border border-[rgb(var(--color-error)/0.3)] bg-[rgb(var(--color-bg-secondary))] p-6 text-center shadow-md">
      <div class="mb-3 text-[rgb(var(--color-error))]">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="mb-2 font-bold text-[rgb(var(--color-error))]">Something went wrong</h3>
      <p class="mb-4 text-sm text-[rgb(var(--color-text-secondary))]">{error?.message || 'Failed to load component'}</p>
      <button 
        class="rounded-md bg-[rgb(var(--color-error))] px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        onclick={reset}
      >
        Try Again
      </button>
    </div>
  {/snippet}
</svelte:boundary>
