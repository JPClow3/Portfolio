// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** @type {import('astro').AstroIntegration} */
const deploymentMarker = {
  name: 'deployment-marker',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      let sha = process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA;
      if (!sha) {
        try {
          sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
        } catch {
          sha = 'unknown';
        }
      }
      await writeFile(fileURLToPath(new URL('./build-sha.txt', dir)), `${sha}\n`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://jpclow.dev',
  output: 'static',
  build: {
    concurrency: 1
  },
  integrations: [
    svelte(),
    mdx(),
    deploymentMarker,
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          pt: 'pt-BR',
        },
      },
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/500') &&
        !page.includes('/offline') &&
        !page.includes('/.cache/'),
      serialize(item) {
        const url = item.url;

        if (url.endsWith('/') && !url.endsWith('/pt/') && url.split('/').length <= 4) {
          item.priority = 1;
          item.changefreq = ChangeFreqEnum.WEEKLY;
          return item;
        }

        if (url.includes('/pt/') && url.endsWith('/pt/')) {
          item.priority = 1;
          item.changefreq = ChangeFreqEnum.WEEKLY;
          return item;
        }

        if (/\/(pt\/)?(services|about|contact)\/$/.test(url)) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.MONTHLY;
          return item;
        }

        if (url.includes('/projects/')) {
          item.priority = 0.85;
          item.changefreq = ChangeFreqEnum.MONTHLY;
          return item;
        }

        if (url.includes('/blog/')) {
          item.priority = (url.endsWith('/blog/') || url.endsWith('/pt/blog/')) ? 0.75 : 0.7;
          item.changefreq = (url.endsWith('/blog/') || url.endsWith('/pt/blog/')) ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY;
          return item;
        }

        item.priority = 0.6;
        item.changefreq = ChangeFreqEnum.MONTHLY;
        return item;
      },
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle the lazily imported Three.js modules so dev doesn't re-optimize mid-session (504 "Outdated Optimize Dep")
    optimizeDeps: {
      include: [
        'three',
        'three/addons/geometries/RoundedBoxGeometry.js',
        'three/addons/environments/RoomEnvironment.js',
      ],
    },
    build: {
      chunkSizeWarningLimit: 800
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  image: {
    domains: ['2.gravatar.com', 'gravatar.com', 'secure.gravatar.com']
  }
});
