/**
 * Captures the hero scene's first frame as src/assets/studio-cluster.webp, the poster
 * StudioScene shows until WebGL is ready. Re-run after changing the cluster's look:
 *
 *   npm run build && npm run scene:poster && npm run build
 *
 * The page is loaded with reduced motion, whose single static frame is identical to the first
 * animated frame. The live cluster is placed from the `.scene-poster` box, so cropping the canvas
 * to that box yields a poster that lines up with it exactly.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const port = 4430;
const output = path.resolve('src/assets/studio-cluster.webp');

const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PLAYWRIGHT_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((resolve) => server.stdout.once('data', resolve));

const browser = await chromium.launch();
try {
  // Wide viewport so the poster box, centred at 85%, lies fully inside the canvas
  const page = await browser.newPage({ viewport: { width: 2600, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await page.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  // Render on the main thread (same scene code): a worker's single reduced-motion frame on an
  // OffscreenCanvas isn't reliably kept through the visibility changes below
  await page.addInitScript(() => {
    delete HTMLCanvasElement.prototype.transferControlToOffscreen;
  });
  await page.goto(`http://127.0.0.1:${port}/`);

  const scene = page.locator('[data-testid="site-scene"]');
  await scene.locator('canvas').waitFor();
  await page.waitForSelector('[data-scene-ready="true"]', { timeout: 60_000 });
  // Let the canvas finish fading in
  await page.waitForTimeout(1_500);

  // Keep only the canvas so the screenshot has a transparent background
  await page.addStyleTag({
    content: `
      html, body, body * { background: transparent !important; box-shadow: none !important; transition: none !important; }
      body * { visibility: hidden !important; }
      *::before, *::after { display: none !important; }
      [data-testid="site-scene"], [data-testid="site-scene"] * { visibility: visible !important; }
    `,
  });

  const clip = await page.locator('.scene-poster').boundingBox();
  if (!clip) throw new Error('Poster box has no layout');
  const png = await page.screenshot({ omitBackground: true, clip });

  // Guard against capturing a blank canvas and overwriting a good poster
  const { channels } = await sharp(png).stats();
  if (channels[3].mean < 5) throw new Error('Captured frame is (almost) empty; poster not written');

  const { size } = await sharp(png).resize(1000, 1000).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(output);
  console.log(`Wrote ${path.relative(process.cwd(), output)} (${Math.round(size / 1024)} KB)`);
} finally {
  await browser.close();
  server.kill();
}
