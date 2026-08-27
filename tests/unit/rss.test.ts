import { describe, it, expect } from 'vitest';
import rss from '@astrojs/rss';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('RSS feeds generation', () => {
  it('generates a valid RSS 2.0 structure using @astrojs/rss', async () => {
    const samplePosts = [
      {
        title: 'Test Post 1',
        pubDate: new Date('2025-01-15T00:00:00Z'),
        description: 'First test post description',
        link: '/blog/test-post-1/',
        categories: ['web', 'astro'],
        customData: '<language>en-US</language>',
      },
      {
        title: 'Test Post 2 (PT)',
        pubDate: new Date('2025-01-10T00:00:00Z'),
        description: 'Second test post description in PT',
        link: '/pt/blog/test-post-2/',
        categories: ['astro', 'portugues'],
        customData: '<language>pt-BR</language>',
      },
    ];

    const response = await rss({
      title: 'João Paulo Santos — Blog',
      description: 'Engineering blog notes',
      site: 'https://jpclow.dev',
      items: samplePosts,
      customData: '<language>en-US</language><atom:link href="https://jpclow.dev/rss.xml" rel="self" type="application/rss+xml"/>',
      xmlns: {
        atom: 'http://www.w3.org/2005/Atom',
      },
    });

    expect(response.status).toBe(200);
    const xml = await response.text();

    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(xml).toContain('<title>João Paulo Santos — Blog</title>');
    expect(xml).toContain('<atom:link href="https://jpclow.dev/rss.xml" rel="self" type="application/rss+xml"/>');
    expect(xml).toContain('<title>Test Post 1</title>');
    expect(xml).toContain('https://jpclow.dev/blog/test-post-1/');
    expect(xml).toContain('<category>web</category>');
  });

  it('validates generated dist/rss.xml and dist/pt/rss.xml if built', () => {
    const rssPath = resolve(process.cwd(), 'dist/rss.xml');
    const ptRssPath = resolve(process.cwd(), 'dist/pt/rss.xml');

    if (existsSync(rssPath)) {
      const xml = readFileSync(rssPath, 'utf8');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(xml).toContain('<title>João Paulo Santos — Blog</title>');
      expect(xml).toContain('https://jpclow.dev/rss.xml');
    }

    if (existsSync(ptRssPath)) {
      const ptXml = readFileSync(ptRssPath, 'utf8');
      expect(ptXml).toContain('<rss version="2.0"');
      expect(ptXml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(ptXml).toContain('https://jpclow.dev/pt/rss.xml');
      expect(ptXml).toContain('<language>pt-BR</language>');
    }
  });
});
