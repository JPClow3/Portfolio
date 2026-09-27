/**
 * Lighthouse budget check against the production build (`dist/`).
 *
 *   npm run build && npm run test:lighthouse
 *   LH_PAGES=/,/services/ LH_FORM_FACTORS=mobile npm run test:lighthouse
 *   LH_PERF_MOBILE=75 LH_PERF_DESKTOP=85 npm run test:lighthouse   # relax perf budgets (e.g. CI)
 *   (Git Bash on Windows: prefix with MSYS_NO_PATHCONV=1 so LH_PAGES paths are not rewritten)
 *
 * Serves dist with scripts/serve.mjs, audits each page per form factor with the
 * Playwright-managed Chromium, writes HTML/JSON reports to lighthouse-reports/,
 * and exits non-zero when a category score is below its budget.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';

const PORT = Number(process.env.LH_PORT ?? 4420);
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = (process.env.LH_PAGES ?? '/,/services/,/about/,/contact/,/projects/,/projects/moto-track/,/pt/').split(',');
const FORM_FACTORS = (process.env.LH_FORM_FACTORS ?? 'mobile,desktop').split(',');
const OUT_DIR = path.resolve('lighthouse-reports');

// Minimum category scores (0–100). Mobile performance runs under simulated slow 4G + 4x CPU throttling.
// Performance budgets can be relaxed per environment (shared CI runners are noisier than a workstation).
const BUDGETS = {
  mobile: { performance: Number(process.env.LH_PERF_MOBILE ?? 80), accessibility: 100, 'best-practices': 95, seo: 100 },
  desktop: { performance: Number(process.env.LH_PERF_DESKTOP ?? 90), accessibility: 100, 'best-practices': 95, seo: 100 },
};

const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PLAYWRIGHT_PORT: String(PORT) },
  stdio: 'ignore',
});

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/`);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Static server did not start on ${BASE}`);
}

const slug = (page) => page.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';

let chrome;
let failed = false;
const rows = [];

try {
  await waitForServer();
  mkdirSync(OUT_DIR, { recursive: true });
  chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--lang=en-US'],
  });

  for (const formFactor of FORM_FACTORS) {
    const desktop = formFactor === 'desktop';
    for (const page of PAGES) {
      const result = await lighthouse(`${BASE}${page}`, {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor,
        screenEmulation: desktop
          ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
          : undefined,
        throttling: desktop ? { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } : undefined,
      });

      const [html, json] = result.report;
      const name = `${formFactor}-${slug(page)}`;
      writeFileSync(path.join(OUT_DIR, `${name}.html`), html);
      writeFileSync(path.join(OUT_DIR, `${name}.json`), json);

      const { categories, audits } = result.lhr;
      const scores = Object.fromEntries(Object.entries(categories).map(([id, category]) => [id, Math.round(category.score * 100)]));
      const misses = Object.entries(BUDGETS[formFactor]).filter(([id, min]) => scores[id] < min);
      if (misses.length) failed = true;

      rows.push({
        page,
        formFactor,
        ...scores,
        LCP: audits['largest-contentful-paint'].displayValue,
        TBT: audits['total-blocking-time'].displayValue,
        CLS: audits['cumulative-layout-shift'].displayValue,
        status: misses.length ? `FAIL (${misses.map(([id]) => id).join(', ')})` : 'ok',
      });

      if (misses.length) {
        const failing = Object.values(audits)
          .filter((audit) => audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'informative' && audit.scoreDisplayMode !== 'manual')
          .map((audit) => `    - ${audit.id}: ${audit.title}${audit.displayValue ? ` (${audit.displayValue})` : ''}`);
        console.log(`\n[${formFactor}] ${page} below budget. Failing audits:\n${failing.join('\n')}`);
      }
    }
  }

  console.log('');
  console.table(rows);
  writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(rows, null, 2));
  console.log(`Reports: ${OUT_DIR}`);
} finally {
  try {
    chrome?.kill();
  } catch {
    // Windows can hold a lock on Chrome's temp profile; it is cleaned up by the OS later
  }
  server.kill();
}

process.exit(failed ? 1 : 0);
