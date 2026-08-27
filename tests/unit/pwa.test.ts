import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('PWA & Service Worker configuration', () => {
  const manifestPath = resolve(process.cwd(), 'public/site.webmanifest');
  const swPath = resolve(process.cwd(), 'public/sw.js');
  const offlinePath = resolve(process.cwd(), 'public/offline.html');

  it('provides a valid site.webmanifest with all required PWA fields', () => {
    expect(existsSync(manifestPath)).toBe(true);
    const content = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    expect(manifest.name).toContain('João Paulo');
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#087896');
    expect(manifest.background_color).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    const has192 = manifest.icons.some((icon: { sizes: string }) => icon.sizes === '192x192');
    const has512 = manifest.icons.some((icon: { sizes: string }) => icon.sizes === '512x512');
    expect(has192).toBe(true);
    expect(has512).toBe(true);
  });

  it('provides a valid service worker with caching strategies and lifecycle events', () => {
    expect(existsSync(swPath)).toBe(true);
    const swContent = readFileSync(swPath, 'utf8');

    expect(swContent).toContain('CACHE_NAME');
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('activate'");
    expect(swContent).toContain("addEventListener('fetch'");
    expect(swContent).toContain('/offline.html');
    expect(swContent).toContain('/site.webmanifest');
    expect(swContent).toContain('skipWaiting');
    expect(swContent).toContain('clients.claim');
  });

  it('provides a valid and responsive offline fallback page', () => {
    expect(existsSync(offlinePath)).toBe(true);
    const offlineContent = readFileSync(offlinePath, 'utf8');

    expect(offlineContent).toContain('<!DOCTYPE html>');
    expect(offlineContent).toContain('Offline');
    expect(offlineContent).toContain('window.location.reload()');
    expect(offlineContent).toContain("addEventListener('online'");
  });
});
