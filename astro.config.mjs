// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jpclow.dev',
  output: 'static',
  integrations: [
    svelte(),
    mdx(),
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

        if (url.includes('/projects/')) {
          item.priority = 0.85;
          item.changefreq = ChangeFreqEnum.MONTHLY;
          return item;
        }

        if (url.includes('/blog/')) {
          item.priority = url.endsWith('/blog/') ? 0.75 : 0.7;
          item.changefreq = url.endsWith('/blog/') ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY;
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
