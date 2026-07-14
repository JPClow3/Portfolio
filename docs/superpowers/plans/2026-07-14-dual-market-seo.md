# Dual-market freelance SEO implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio technically indexable and relevant to freelance-development searches in English and Brazilian Portuguese.

**Architecture:** Keep SEO data and schema generation in `src/lib/seo.ts`, then consume it in the shared Astro layout and page-level components. The static sitemap plugin and `public/robots.txt` express only crawlable, canonical public routes. Tests exercise the helper contracts, while the production build confirms generated HTML and XML output.

**Tech Stack:** Astro 7, TypeScript, Vitest, `@astrojs/sitemap`, static Cloudflare Pages output.

## Global Constraints

- Preserve the existing English `/` and Brazilian Portuguese `/pt/` routes.
- Use real services, languages, contact data, and project information only.
- Do not add dependencies or alter Cloudflare deployment configuration.
- Keep non-indexable error paths out of the sitemap and emit `noindex, nofollow` for them.
- Keep all metadata and visible positioning natural; no keyword stuffing.

---

### Task 1: Lock the SEO utility contract with tests

**Files:**
- Modify: `tests/unit/seo.test.ts`
- Modify: `src/lib/seo.ts`

**Interfaces:**
- Consumes: `getPathAlternates(pathname, siteUrl)`, `buildProfessionalServiceSchema(options)`.
- Produces: stable English/Portuguese alternate-link arrays and an accurate service schema without invented price data.

- [ ] **Step 1: Write the failing tests**

```ts
import { buildProfessionalServiceSchema } from '../../src/lib/seo';

it('does not fabricate a price range for freelance services', () => {
  const schema = buildProfessionalServiceSchema({
    lang: 'en',
    siteUrl,
    description: 'Freelance development services.',
  });

  expect(schema).not.toHaveProperty('priceRange');
});

it('does not create Portuguese alternates for English-only blog pages', () => {
  const alternates = getPathAlternates('/blog/example-post/', siteUrl);

  expect(alternates.map((item) => item.hreflang)).toEqual(['en-US', 'x-default']);
});
```

- [ ] **Step 2: Run the targeted tests and verify the price-range test fails**

Run: `npm run test:unit -- tests/unit/seo.test.ts`

Expected: the `priceRange` assertion fails because the property exists.

- [ ] **Step 3: Implement the minimal schema correction**

```ts
export function buildProfessionalServiceSchema({ lang, siteUrl, description }: SchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}#freelance-service`,
    name: lang === 'pt' ? 'João Paulo Santos — Desenvolvimento Freelancer' : 'João Paulo Santos — Freelance Development',
    url: siteUrl.toString(),
    description,
    image: new URL('/og-image.svg', siteUrl).toString(),
    areaServed: [
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    availableLanguage: ['English', 'Portuguese'],
  };
}
```

- [ ] **Step 4: Run the targeted tests and verify they pass**

Run: `npm run test:unit -- tests/unit/seo.test.ts`

Expected: all tests in `tests/unit/seo.test.ts` pass.

### Task 2: Make robots and sitemap crawl directives precise

**Files:**
- Modify: `public/robots.txt`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: the production origin `https://jpclow.dev` and static sitemap output.
- Produces: crawler directives with one sitemap URL and a sitemap limited to public indexable routes.

- [ ] **Step 1: Write the failing crawl-output test**

```ts
it('keeps the sitemap URL as the only public crawler directive', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');

  expect(robots).toContain('Sitemap: https://jpclow.dev/sitemap-index.xml');
  expect(robots).not.toMatch(/^Host:/m);
});
```

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `npm run test:unit -- tests/unit/seo.test.ts`

Expected: failure because `public/robots.txt` contains `Host:`.

- [ ] **Step 3: Implement the minimal crawl correction**

```txt
User-agent: *
Allow: /
Disallow: /.cache/
Disallow: /404
Disallow: /500

Sitemap: https://jpclow.dev/sitemap-index.xml
```

Remove the unsupported `Host:` directive, preserve explicit crawler groups only when their policy differs from the wildcard group, and retain the sitemap plugin filter for error/cache paths.

- [ ] **Step 4: Run targeted tests and a production build**

Run: `npm run test:unit -- tests/unit/seo.test.ts; npm run build`

Expected: tests pass and `dist/sitemap-index.xml` plus `dist/sitemap-0.xml` are generated without error paths.

### Task 3: Verify generated bilingual discovery surfaces

**Files:**
- Verify: `dist/index.html`
- Verify: `dist/pt/index.html`
- Verify: `dist/projects/throughline/index.html`
- Verify: `dist/pt/projects/throughline/index.html`
- Verify: `dist/robots.txt`
- Verify: `dist/sitemap-0.xml`

**Interfaces:**
- Consumes: completed static build output.
- Produces: evidence that metadata, structured data, alternates, robots, and sitemap match the public SEO contract.

- [ ] **Step 1: Inspect rendered homepage and Portuguese homepage metadata**

Run: `rg -n "canonical|hreflang|Freelance|Freelancer|ProfessionalService|FAQPage" dist/index.html dist/pt/index.html`

Expected: both pages contain self-canonical URLs, `en-US`/`pt-BR`/`x-default` alternates, localized freelance titles, and valid service/FAQ JSON-LD.

- [ ] **Step 2: Inspect a translated project pair and crawl files**

Run: `rg -n "canonical|hreflang" dist/projects/throughline/index.html dist/pt/projects/throughline/index.html; Get-Content -Raw dist/robots.txt; Get-Content -Raw dist/sitemap-0.xml`

Expected: the project pair references each other, robots has no `Host:` directive, and sitemap XML contains no `404`, `500`, or cache URL.

- [ ] **Step 3: Run repository verification**

Run: `npx astro check; npm test; git diff --check`

Expected: Astro checks, unit/browser tests, and diff whitespace check complete with exit code 0.
