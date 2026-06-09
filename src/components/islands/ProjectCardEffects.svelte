<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@/lib/accessibility';

  onMount(() => {
    if (prefersReducedMotion()) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt-card]'));
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const handlePointerMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
        const tiltX = (x - 0.5) * 5.5;
        const tiltY = (0.5 - y) * 4.5;

        card.style.setProperty('--spot-x', `${Math.round(x * 100)}%`);
        card.style.setProperty('--spot-y', `${Math.round(y * 100)}%`);
        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
        card.dataset.pointerActive = 'true';
      };

      const resetCard = () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.dataset.pointerActive = 'false';
      };

      card.addEventListener('pointermove', handlePointerMove, { passive: true });
      card.addEventListener('pointerleave', resetCard);
      card.addEventListener('blur', resetCard, true);
      cleanups.push(() => {
        card.removeEventListener('pointermove', handlePointerMove);
        card.removeEventListener('pointerleave', resetCard);
        card.removeEventListener('blur', resetCard, true);
        resetCard();
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
</script>
