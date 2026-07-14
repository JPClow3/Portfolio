import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SITE,
  buildProfessionalServiceSchema,
  getHomeSeo,
  getBlogIndexSeo,
  formatPageTitle,
  getPathAlternates,
  getOgLocale,
  getAlternateOgLocales,
  buildHomeFaqSchema,
} from '../../src/lib/seo';

describe('seo utilities', () => {
  const siteUrl = new URL(SITE.url);

  describe('getHomeSeo()', () => {
    it('returns freelance-focused metadata for English', () => {
      const seo = getHomeSeo('en');

      expect(seo.title.toLowerCase()).toContain('freelance');
      expect(seo.description.toLowerCase()).toContain('freelance');
      expect(seo.keywords.some((keyword) => keyword.includes('freelance'))).toBe(true);
    });

    it('returns freelance-focused metadata for Portuguese', () => {
      const seo = getHomeSeo('pt');

      expect(seo.title.toLowerCase()).toContain('freelancer');
      expect(seo.description.toLowerCase()).toContain('freelancer');
    });
  });

  describe('getBlogIndexSeo()', () => {
    it('includes freelance positioning in blog metadata', () => {
      const seo = getBlogIndexSeo();

      expect(seo.title.toLowerCase()).toContain('freelance');
      expect(seo.description.length).toBeGreaterThan(40);
    });
  });

  describe('formatPageTitle()', () => {
    it('appends freelance suffix when title has no pipe', () => {
      expect(formatPageTitle('Lorebound', 'en')).toContain('Freelance Developer');
      expect(formatPageTitle('Lorebound', 'pt')).toContain('Desenvolvedor Freelancer');
    });

    it('preserves titles that already include a pipe', () => {
      const title = 'Custom Title | Example';
      expect(formatPageTitle(title, 'en')).toBe(title);
    });
  });

  describe('getPathAlternates()', () => {
    it('returns en, pt, and x-default for homepage paths', () => {
      const alternates = getPathAlternates('/', siteUrl);

      expect(alternates).toHaveLength(3);
      expect(alternates.map((item) => item.hreflang)).toEqual(['en-US', 'pt-BR', 'x-default']);
    });

    it('returns localized project alternates', () => {
      const alternates = getPathAlternates('/projects/lorebound/', siteUrl);

      expect(alternates.some((item) => item.url.endsWith('/projects/lorebound/'))).toBe(true);
      expect(alternates.some((item) => item.url.endsWith('/pt/projects/lorebound/'))).toBe(true);
    });
  });

  describe('locale helpers', () => {
    it('maps site locales to Open Graph values', () => {
      expect(getOgLocale('en')).toBe('en-US');
      expect(getOgLocale('pt')).toBe('pt-BR');
      expect(getAlternateOgLocales('en')).toEqual(['pt-BR']);
    });
  });

  describe('buildHomeFaqSchema()', () => {
    it('builds FAQ entries for both languages', () => {
      const enFaq = buildHomeFaqSchema('en');
      const ptFaq = buildHomeFaqSchema('pt');

      expect(enFaq['@type']).toBe('FAQPage');
      expect(ptFaq['@type']).toBe('FAQPage');
      expect(enFaq.mainEntity.length).toBeGreaterThan(0);
      expect(ptFaq.mainEntity.length).toBeGreaterThan(0);
    });
  });

  describe('service schema', () => {
    it('does not fabricate a price range for freelance services', () => {
      const schema = buildProfessionalServiceSchema({
        lang: 'en',
        siteUrl,
        description: 'Freelance development services.',
      });

      expect(schema).not.toHaveProperty('priceRange');
    });
  });

  describe('robots.txt', () => {
    it('publishes a sitemap without an unsupported Host directive', () => {
      const robots = readFileSync(resolve(process.cwd(), 'public/robots.txt'), 'utf8');

      expect(robots).toContain('Sitemap: https://jpclow.dev/sitemap-index.xml');
      expect(robots).not.toMatch(/^Host:/m);
    });
  });
});
