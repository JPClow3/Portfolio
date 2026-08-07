import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'projects');

const VIEWPORT = { width: 1440, height: 900 };

const targets = [
  { slug: 'moto-track', url: 'https://moto-track.net/' },
  { slug: 'lorebound', url: 'https://lorebound-dy6.pages.dev/' },
  { slug: 'agrohub', url: 'https://agrohub.unirv.edu.br/' },
  { slug: 'inova-rio-verde', url: 'https://inovarioverde.org/' },
];

const CONSENT_TEXT = /aceitar|accept|concordo|entendi|ok, entendi/i;

async function dismissConsent(page) {
  try {
    const btn = page.getByRole('button', { name: CONSENT_TEXT }).first();
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(300);
    }
  } catch {
    // no consent banner, or it didn't match — fine
  }
}

async function capture(browser, { slug, url }) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await dismissConsent(page);
  await page.waitForTimeout(600);
  const outPath = path.join(outDir, `${slug}.png`);
  await page.screenshot({ path: outPath });
  await page.close();
  console.log(`saved ${path.relative(process.cwd(), outPath)}`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const target of targets) {
    try {
      await capture(browser, target);
    } catch (err) {
      console.error(`failed ${target.slug}: ${err.message}`);
    }
  }
  await browser.close();
}

main();
