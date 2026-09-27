import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SITE,
  buildPersonSchema,
  buildProfessionalServiceSchema,
  buildServicesSchema,
  getHomeSeo,
  getPageSeo,
  getBlogIndexSeo,
  formatPageTitle,
  getPathAlternates,
  getOgLocale,
  getAlternateOgLocales,
  buildHomeFaqSchema,
  buildBreadcrumbSchema,
  buildProjectBreadcrumbSchema,
  buildBlogBreadcrumbSchema,
  getProjectOgImageUrl,
  getBlogOgImageUrl,
} from '../../src/lib/seo';

describe('seo utilities', () => {
  const siteUrl = new URL(SITE.url);

  describe('getHomeSeo()', () => {
    it('returns company (B2B) metadata for English', () => {
      const seo = getHomeSeo('en');

      expect(seo.title).toContain('JPCLOW');
      expect(seo.title.toLowerCase()).toContain('software engineering studio');
      expect(seo.title).toContain('João Paulo Santos');
      expect(seo.description.toLowerCase()).toContain('for companies');
      expect(seo.description.toLowerCase()).not.toContain('freelance');
    });

    it('returns company (B2B) metadata for Portuguese', () => {
      const seo = getHomeSeo('pt');

      expect(seo.title.toLowerCase()).toContain('estúdio de engenharia de software');
      expect(seo.title).toContain('João Paulo Santos');
      expect(seo.description.toLowerCase()).toContain('para empresas');
      expect(seo.description.toLowerCase()).not.toContain('freelancer');
    });
  });

  describe('search snippet lengths', () => {
    // Google truncates titles around ~60 characters and descriptions around ~160
    const entries = (['en', 'pt'] as const).flatMap((lang) => [
      [`${lang} home`, getHomeSeo(lang)],
      [`${lang} services`, getPageSeo('services', lang)],
      [`${lang} about`, getPageSeo('about', lang)],
      [`${lang} contact`, getPageSeo('contact', lang)],
      [`${lang} blog`, getBlogIndexSeo(lang)],
    ] as const);

    it.each(entries)('%s title fits in a search result', (_, seo) => {
      expect(seo.title.length).toBeLessThanOrEqual(60);
      expect(seo.title).toContain('JPCLOW');
    });

    it.each(entries)('%s description is 70–160 characters', (_, seo) => {
      expect(seo.description.length).toBeGreaterThanOrEqual(70);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });
  });

  describe('getPageSeo()', () => {
    it('returns localized metadata for the studio pages', () => {
      for (const page of ['services', 'about', 'contact'] as const) {
        expect(getPageSeo(page, 'en').title).toContain('JPCLOW');
        expect(getPageSeo(page, 'pt').title).toContain('JPCLOW');
        expect(getPageSeo(page, 'pt').description).not.toBe(getPageSeo(page, 'en').description);
      }
    });
  });

  describe('getBlogIndexSeo()', () => {
    it('uses company positioning in blog metadata for both locales', () => {
      const enSeo = getBlogIndexSeo('en');
      const ptSeo = getBlogIndexSeo('pt');

      expect(enSeo.title).toContain('JPCLOW');
      expect(enSeo.description.length).toBeGreaterThan(40);

      expect(ptSeo.title).toContain('JPCLOW');
      expect(ptSeo.description.length).toBeGreaterThan(40);
    });
  });

  describe('formatPageTitle()', () => {
    it('appends the studio suffix when title has no pipe', () => {
      expect(formatPageTitle('Lorebound', 'en')).toBe('Lorebound | JPCLOW | Software Studio');
      expect(formatPageTitle('Lorebound', 'pt')).toBe('Lorebound | JPCLOW | Estúdio de Software');
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

    it('returns en, pt, and x-default for studio pages in either locale', () => {
      for (const path of ['/services/', '/pt/about/', '/contact/', '/pt/projects/']) {
        const alternates = getPathAlternates(path, siteUrl);
        expect(alternates.map((item) => item.hreflang)).toEqual(['en-US', 'pt-BR', 'x-default']);
        expect(alternates[1].url.startsWith('https://jpclow.dev/pt/')).toBe(true);
      }
    });

    it('returns localized blog alternates for index and posts', () => {
      const indexAlternates = getPathAlternates('/blog/', siteUrl);
      expect(indexAlternates.map((item) => item.hreflang)).toEqual(['en-US', 'pt-BR', 'x-default']);
      expect(indexAlternates.some((item) => item.url.endsWith('/blog/'))).toBe(true);
      expect(indexAlternates.some((item) => item.url.endsWith('/pt/blog/'))).toBe(true);

      const postAlternates = getPathAlternates('/blog/hello-world/', siteUrl);
      expect(postAlternates.map((item) => item.hreflang)).toEqual(['en-US', 'pt-BR', 'x-default']);
      expect(postAlternates.some((item) => item.url.endsWith('/blog/hello-world/'))).toBe(true);
      expect(postAlternates.some((item) => item.url.endsWith('/pt/blog/hello-world/'))).toBe(true);
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
    it('does not fabricate a price range for studio services', () => {
      const schema = buildProfessionalServiceSchema({
        lang: 'en',
        siteUrl,
        description: 'Software engineering services.',
      });

      expect(schema).not.toHaveProperty('priceRange');
    });

    it('describes JPCLOW as the organization with the founder linked', () => {
      const schema = buildProfessionalServiceSchema({ lang: 'en', siteUrl, description: '' });

      expect(schema['@id']).toBe('https://jpclow.dev/#organization');
      expect(schema.name).toBe('JPCLOW');
      expect(schema.founder).toEqual({ '@id': 'https://jpclow.dev/#person' });
      expect(schema.serviceType.length).toBeGreaterThan(0);
    });

    it('lists every service in the services catalog with anchor URLs', () => {
      const catalog = buildServicesSchema('pt', siteUrl);

      expect(catalog['@type']).toBe('OfferCatalog');
      expect(catalog.itemListElement[0].itemOffered.url).toMatch(/^https:\/\/jpclow\.dev\/pt\/services\/#/);
    });
  });

  describe('person schema', () => {
    it('keeps nationality and city-level location semantically distinct', () => {
      const schema = buildPersonSchema({
        lang: 'en',
        siteUrl,
        description: 'Full-stack product engineer in Brazil.',
      });

      expect(schema.nationality).toEqual({ '@type': 'Country', name: 'Brazil' });
      expect(schema.homeLocation).toEqual({ '@type': 'Place', name: 'Rio Verde, GO, Brazil' });
    });
  });

  describe('buildBreadcrumbSchema()', () => {
    it('generates standard Schema.org BreadcrumbList with correct positions', () => {
      const schema = buildBreadcrumbSchema([
        { name: 'Home', url: 'https://jpclow.dev/' },
        { name: 'Projects', url: 'https://jpclow.dev/projects/' },
        { name: 'Lorebound', url: 'https://jpclow.dev/projects/lorebound/' },
      ]);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jpclow.dev/',
      });
      expect(schema.itemListElement[2]).toEqual({
        '@type': 'ListItem',
        position: 3,
        name: 'Lorebound',
        item: 'https://jpclow.dev/projects/lorebound/',
      });
    });

    it('generates project case study breadcrumbs for English and Portuguese', () => {
      const enBreadcrumb = buildProjectBreadcrumbSchema({
        lang: 'en',
        siteUrl,
        title: 'Throughline',
        slug: 'throughline',
      });

      expect(enBreadcrumb.itemListElement[0].name).toBe('Home');
      expect(enBreadcrumb.itemListElement[0].item).toBe('https://jpclow.dev/');
      expect(enBreadcrumb.itemListElement[1].name).toBe('Projects & case studies');
      expect(enBreadcrumb.itemListElement[2].name).toBe('Throughline');
      expect(enBreadcrumb.itemListElement[2].item).toBe('https://jpclow.dev/projects/throughline/');

      const ptBreadcrumb = buildProjectBreadcrumbSchema({
        lang: 'pt',
        siteUrl,
        title: 'Throughline',
        slug: 'throughline',
      });

      expect(ptBreadcrumb.itemListElement[0].name).toBe('Início');
      expect(ptBreadcrumb.itemListElement[0].item).toBe('https://jpclow.dev/pt/');
      expect(ptBreadcrumb.itemListElement[1].name).toBe('Projetos e cases');
      expect(ptBreadcrumb.itemListElement[2].item).toBe('https://jpclow.dev/pt/projects/throughline/');
    });

    it('generates blog breadcrumbs with correct URLs', () => {
      const blogBreadcrumb = buildBlogBreadcrumbSchema({
        lang: 'en',
        siteUrl,
        title: 'Hello World',
        slug: 'hello-world',
      });

      expect(blogBreadcrumb.itemListElement).toHaveLength(3);
      expect(blogBreadcrumb.itemListElement[1].name).toBe('Blog');
      expect(blogBreadcrumb.itemListElement[1].item).toBe('https://jpclow.dev/blog/');
      expect(blogBreadcrumb.itemListElement[2].name).toBe('Hello World');
      expect(blogBreadcrumb.itemListElement[2].item).toBe('https://jpclow.dev/blog/hello-world/');
    });
  });

  describe('OG image URL helpers', () => {
    it('returns correct paths for project case study OG images', () => {
      expect(getProjectOgImageUrl('lorebound', 'en')).toBe('/open-graph/projects/lorebound.png');
      expect(getProjectOgImageUrl('lorebound', 'pt')).toBe('/open-graph/pt/projects/lorebound.png');
      expect(getProjectOgImageUrl('lorebound', 'en', siteUrl)).toBe('https://jpclow.dev/open-graph/projects/lorebound.png');
    });

    it('returns correct paths for blog post OG images', () => {
      expect(getBlogOgImageUrl('hello-world')).toBe('/open-graph/blog/hello-world.png');
      expect(getBlogOgImageUrl('hello-world', siteUrl)).toBe('https://jpclow.dev/open-graph/blog/hello-world.png');
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

