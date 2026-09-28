/**
 * Runs the hero scene off the main thread on an OffscreenCanvas: loading Three.js, building the
 * scene, compiling shaders and rendering never block input or count as main-thread work, so the
 * scene can start as soon as the page has loaded. StudioScene.svelte is the host.
 */
import { createSceneRunner, createStudioScene, type SceneLayout } from './core';

export type WorkerInbound =
  | { type: 'init'; canvas: OffscreenCanvas; reducedMotion: boolean; isMobile: boolean; layout: SceneLayout; scroll: number }
  | { type: 'layout'; layout: SceneLayout }
  | { type: 'pointer'; x: number; y: number }
  | { type: 'scroll'; target: number }
  | { type: 'active'; value: boolean };

export type WorkerOutbound = { type: 'ready' } | { type: 'error'; message: string };

const post = (message: WorkerOutbound) => self.postMessage(message);

let scene: Awaited<ReturnType<typeof createStudioScene>> | undefined;
let runner: ReturnType<typeof createSceneRunner> | undefined;
// Updates that arrive while the scene is still being built
let pendingLayout: SceneLayout | undefined;
let pendingActive = true;
let pendingScroll: number | undefined;

self.onmessage = async ({ data }: MessageEvent<WorkerInbound>) => {
  switch (data.type) {
    case 'init':
      try {
        scene = await createStudioScene(data.canvas, { reducedMotion: data.reducedMotion, isMobile: data.isMobile });
        scene.setScroll(pendingScroll ?? data.scroll);
        runner = createSceneRunner(scene, {
          reducedMotion: data.reducedMotion,
          layout: pendingLayout ?? data.layout,
          onFirstFrame: () => post({ type: 'ready' }),
        });
        runner.setActive(pendingActive);
      } catch (error) {
        post({ type: 'error', message: error instanceof Error ? error.message : String(error) });
      }
      break;
    case 'layout':
      if (runner) runner.setLayout(data.layout);
      else pendingLayout = data.layout;
      break;
    case 'pointer':
      scene?.setPointer(data.x, data.y);
      break;
    case 'scroll':
      if (scene) scene.setScroll(data.target);
      else pendingScroll = data.target;
      break;
    case 'active':
      pendingActive = data.value;
      runner?.setActive(data.value);
      break;
  }
};
