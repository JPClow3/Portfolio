<script lang="ts">
  import { tick } from 'svelte';
  import type { CommandPaletteItem } from '@/lib/command-palette';

  interface Props {
    items: CommandPaletteItem[];
    strings: {
      title: string;
      trigger: string;
      placeholder: string;
      empty: string;
      hint: string;
    };
  }

  let { items, strings }: Props = $props();
  let dialog: HTMLDialogElement;
  let input: HTMLInputElement;
  let trigger: HTMLButtonElement;
  let open = $state(false);
  let query = $state('');
  let activeIndex = $state(0);
  let restoreFocusTarget: HTMLElement | null = null;

  const filteredItems = $derived(
    items.filter((item) => {
      const needle = query.trim().toLocaleLowerCase();
      if (!needle) return true;
      return [item.label, item.group, item.status ?? '', ...item.keywords]
        .join(' ')
        .toLocaleLowerCase()
        .includes(needle);
    }),
  );

  function showPalette() {
    restoreFocusTarget = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    query = '';
    activeIndex = 0;
    open = true;
    tick().then(() => {
      if (!dialog.open) dialog.showModal();
      input.focus();
    });
  }

  function hidePalette() {
    open = false;
    if (dialog?.open) dialog.close();
    restoreFocusTarget?.focus();
  }

  function activate(item: CommandPaletteItem) {
    if (item.kind === 'external') {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      hidePalette();
      return;
    }

    hidePalette();
    window.location.assign(item.href);
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filteredItems.length - 1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    }
    if (event.key === 'Enter' && filteredItems[activeIndex]) {
      event.preventDefault();
      activate(filteredItems[activeIndex]);
    }
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (open) hidePalette();
      else showPalette();
    }
  }

  function handleDialogClose() {
    if (!open) return;
    open = false;
    restoreFocusTarget?.focus();
  }

  function updateQuery(event: Event) {
    query = (event.currentTarget as HTMLInputElement).value;
    activeIndex = 0;
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<button
  bind:this={trigger}
  type="button"
  data-testid="command-palette-trigger"
  class="hidden items-center gap-2 rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary)/0.58)] px-2.5 py-1.5 text-xs font-semibold text-[rgb(var(--color-text-secondary))] transition-colors hover:border-[rgb(var(--color-border-hover))] hover:text-[rgb(var(--color-text-primary))] sm:inline-flex"
  onclick={showPalette}
  aria-haspopup="dialog"
>
  <span>{strings.trigger}</span>
  <kbd class="rounded border border-[rgb(var(--color-border))] px-1.5 py-0.5 font-mono text-[10px] text-[rgb(var(--color-text-muted))]">⌘ K</kbd>
</button>

<dialog
  bind:this={dialog}
  class="m-auto w-[min(92vw,38rem)] overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-primary))] p-0 text-[rgb(var(--color-text-primary))] shadow-2xl backdrop:bg-black/55"
  aria-label={strings.title}
  onclose={handleDialogClose}
>
  <div class="border-b border-[rgb(var(--color-border))] p-3 sm:p-4">
    <input
      bind:this={input}
      data-testid="command-palette-input"
      value={query}
      oninput={updateQuery}
      onkeydown={handleInputKeydown}
      placeholder={strings.placeholder}
      aria-label={strings.placeholder}
      class="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary)/0.72)] px-3 py-2.5 text-sm outline-none placeholder:text-[rgb(var(--color-text-muted))] focus:border-[rgb(var(--color-accent))]"
    />
  </div>

  <div class="max-h-[min(56vh,30rem)] overflow-y-auto p-2" role="listbox" aria-label={strings.title}>
    {#if filteredItems.length > 0}
      {#each filteredItems as item, index (item.id)}
        <button
          type="button"
          role="option"
          aria-selected={index === activeIndex}
          class={`flex w-full items-center justify-between gap-4 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[rgb(var(--color-bg-tertiary)/0.72)] ${index === activeIndex ? 'bg-[rgb(var(--color-accent)/0.12)]' : ''}`}
          onmouseenter={() => (activeIndex = index)}
          onclick={() => activate(item)}
        >
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold">{item.label}</span>
            <span class="mt-0.5 block text-xs text-[rgb(var(--color-text-muted))]">{item.group}</span>
          </span>
          {#if item.status}
            <span class="shrink-0 rounded border border-[rgb(var(--color-accent)/0.35)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[rgb(var(--color-accent))]">{item.status}</span>
          {/if}
        </button>
      {/each}
    {:else}
      <p class="px-3 py-8 text-center text-sm text-[rgb(var(--color-text-muted))]">{strings.empty}</p>
    {/if}
  </div>

  <p class="border-t border-[rgb(var(--color-border))] px-4 py-3 text-xs text-[rgb(var(--color-text-muted))]">{strings.hint}</p>
</dialog>
