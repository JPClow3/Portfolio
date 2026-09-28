<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@/lib/accessibility';
  import posterUrl from '@/assets/studio-cluster.webp?url';
  import type { SceneLayout } from '@/lib/studio-scene/core';
  import type { WorkerInbound, WorkerOutbound } from '@/lib/studio-scene/worker';

  /**
   * Host for the hero WebGL scene (src/lib/studio-scene). The scene renders in a worker on an
   * OffscreenCanvas, so it starts right after load without blocking the main thread; browsers
   * without WebGL in workers fall back to a delayed main-thread render. This component measures
   * the page and forwards layout, pointer, scroll and visibility.
   */

  let container: HTMLDivElement;
  let poster: HTMLDivElement;
  let isReady = $state(false);
  let hasError = $state(false);
  let isLite = $state(false);
  // Static stand-in where WebGL doesn't run
  const showPoster = $derived(isLite || hasError);

  interface SceneTarget {
    layout(layout: SceneLayout): void;
    pointer(x: number, y: number): void;
    scroll(target: number): void;
    active(value: boolean): void;
  }

  onMount(() => {
    const reducedMotion = prefersReducedMotion();
    const isMobile = window.innerWidth < 768;
    let disposed = false;
    const teardown: Array<() => void> = [];

    // The poster (scripts/capture-scene-poster.mjs) shows the cluster at this scale, cropped to
    // this fraction of the canvas height
    const POSTER_SCALE = 0.58;
    const POSTER_EXTENT = 0.7;

    const readLayout = (): SceneLayout => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const pixelRatio = Math.min(window.devicePixelRatio, width < 768 ? 1.5 : 2);
      // Keep the cluster clear of the headline column. The poster's CSS box is the source of
      // truth for where the cluster sits and how big it is
      const posterBox = poster.getBoundingClientRect();
      if (posterBox.width === 0) return { width, height, pixelRatio, cx: 0.775, cy: 0.1, scale: 0.5 }; // phones
      const containerBox = container.getBoundingClientRect();
      return {
        width,
        height,
        pixelRatio,
        cx: (posterBox.left + posterBox.width / 2 - containerBox.left) / width,
        cy: (posterBox.top + posterBox.height / 2 - containerBox.top) / height,
        scale: (POSTER_SCALE * posterBox.height) / (POSTER_EXTENT * height),
      };
    };

    const readScroll = () => {
      const hero = container.closest('section') ?? container;
      const target = Math.min(1, Math.max(0, window.scrollY / Math.max(hero.getBoundingClientRect().height, 1)));
      container.dataset.scrollTarget = target.toFixed(3);
      return target;
    };

    const markReady = () => {
      container.dataset.sceneReady = 'true';
      isReady = true;
    };

    const createCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      container.appendChild(canvas);
      return canvas;
    };

    /** Feeds page state to a running scene; returns a disconnect function */
    const connect = (target: SceneTarget) => {
      const resizeObserver = new ResizeObserver(() => target.layout(readLayout()));
      resizeObserver.observe(container);
      if (reducedMotion) return () => resizeObserver.disconnect();

      let isVisible = true;
      const updateActive = () => target.active(isVisible && !document.hidden);
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
        updateActive();
      });
      visibilityObserver.observe(container);
      const handlePointerMove = (event: PointerEvent) => {
        target.pointer(
          (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2,
          (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2,
        );
      };
      const handleScroll = () => target.scroll(readScroll());
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('visibilitychange', updateActive);

      return () => {
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('visibilitychange', updateActive);
      };
    };

    const startMainThread = async () => {
      let canvas: HTMLCanvasElement | undefined;
      try {
        const { createStudioScene, createSceneRunner } = await import('@/lib/studio-scene/core');
        if (disposed) return;
        canvas = createCanvas();
        // Yield between setup steps so no single main-thread task blocks input
        const pause = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0));
        const scene = await createStudioScene(canvas, { reducedMotion, isMobile, pause });
        if (disposed) {
          scene.dispose();
          canvas.remove();
          return;
        }
        scene.setScroll(readScroll());
        const runner = createSceneRunner(scene, { reducedMotion, layout: readLayout(), onFirstFrame: markReady });
        const disconnect = connect({
          layout: (layout) => runner.setLayout(layout),
          pointer: (x, y) => scene.setPointer(x, y),
          scroll: (target) => scene.setScroll(target),
          active: (value) => runner.setActive(value),
        });
        teardown.push(() => {
          disconnect();
          runner.dispose();
          canvas?.remove();
        });
      } catch (error) {
        canvas?.remove();
        hasError = true;
        console.error('StudioScene error:', error);
      }
    };

    // Main-thread fallback: start ≥2.5s after load, during idle time. Sooner lands WebGL setup
    // inside Lighthouse's trace and fails the desktop TBT budget (2s was flaky).
    let delayTimer = 0;
    let idleHandle = 0;
    const scheduleMainThread = () => {
      delayTimer = window.setTimeout(() => {
        idleHandle = 'requestIdleCallback' in window
          ? window.requestIdleCallback(() => void startMainThread(), { timeout: 800 })
          : window.setTimeout(() => void startMainThread(), 0);
      }, 2_500);
    };

    const startWorker = () => {
      const canvas = createCanvas();
      const offscreen = canvas.transferControlToOffscreen();
      const worker = new Worker(new URL('../../lib/studio-scene/worker.ts', import.meta.url), { type: 'module' });
      const send = (message: WorkerInbound, transfer: Transferable[] = []) => worker.postMessage(message, transfer);
      let disconnect = () => {};
      const stop = () => {
        disconnect();
        worker.terminate();
        canvas.remove();
      };
      // e.g. Safari 16.4–16.x: OffscreenCanvas without WebGL
      const fallBack = (reason: string) => {
        stop();
        console.warn('StudioScene: worker rendering unavailable, falling back to the main thread:', reason);
        if (!disposed) scheduleMainThread();
      };

      worker.onmessage = ({ data }: MessageEvent<WorkerOutbound>) => {
        if (data.type === 'ready') markReady();
        else fallBack(data.message);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        fallBack(event.message);
      };

      send({ type: 'init', canvas: offscreen, reducedMotion, isMobile, layout: readLayout(), scroll: readScroll() }, [offscreen]);
      disconnect = connect({
        layout: (layout) => send({ type: 'layout', layout }),
        pointer: (x, y) => send({ type: 'pointer', x, y }),
        scroll: (target) => send({ type: 'scroll', target }),
        active: (value) => send({ type: 'active', value }),
      });
      teardown.push(stop);
    };

    const supportsWorkerRendering =
      typeof Worker !== 'undefined' &&
      typeof OffscreenCanvas !== 'undefined' &&
      'transferControlToOffscreen' in HTMLCanvasElement.prototype;
    // After load so the worker's download doesn't compete with the page's critical resources
    const start = () => (supportsWorkerRendering ? startWorker() : scheduleMainThread());

    // Phones, data-saver, and low-core (<4) devices skip WebGL: phones keep the CSS glow, larger
    // screens get the static poster
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const lightweight =
      window.matchMedia('(max-width: 767px)').matches ||
      Boolean(connection?.saveData) ||
      (navigator.hardwareConcurrency ?? 8) < 4;

    if (lightweight) {
      container.dataset.sceneReady = 'lite';
      isLite = true;
    } else if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener('load', start);
      window.clearTimeout(delayTimer);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
      teardown.forEach((fn) => fn());
    };
  });
</script>

<div class="studio-scene-wrap" aria-hidden="true">
  <div class="scene-placeholder" class:is-hidden={isReady || showPoster}></div>
  <!-- Background only set when shown, so the image isn't downloaded otherwise -->
  <div
    bind:this={poster}
    class="scene-poster"
    class:is-shown={showPoster}
    style:background-image={showPoster ? `url(${posterUrl})` : undefined}
  ></div>
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

  /*
   * Pre-rendered frame of the scene (scripts/capture-scene-poster.mjs), shown where WebGL doesn't
   * run on screens ≥768px. The box always exists there because it also places and sizes the live
   * cluster (see readLayout). Viewport-anchored: the hero's height changes with font swap, so
   * sizing from it would shift things (CLS).
   */
  .scene-poster {
    display: none;
    position: absolute;
    --size: 70svh;
    left: calc(85% - var(--size) / 2);
    top: calc(47.8svh - var(--size) / 2);
    width: var(--size);
    height: var(--size);
    background: no-repeat center / contain;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .scene-poster.is-shown {
    opacity: 1;
  }

  @media (min-width: 768px) {
    .scene-poster {
      display: block;
    }

    /* Glow where the cluster will assemble */
    .scene-placeholder {
      top: 47.8svh;
      left: 85%;
      translate: -50% -50%;
    }
  }

  @media (min-width: 768px) and (max-width: 1179px) {
    .scene-poster {
      --size: calc(70svh * 0.6 / 0.58);
      left: calc(81% - var(--size) / 2);
      top: calc(44.8svh - var(--size) / 2);
    }

    .scene-placeholder {
      top: 44.8svh;
      left: 81%;
    }
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
