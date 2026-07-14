# Dual-market freelance SEO design

## Goal

Make `jpclow.dev` discoverable to prospective freelance-development clients in Brazil and internationally, while keeping English and Brazilian Portuguese pages genuinely localized and technically unambiguous to search engines.

## Positioning

- English pages target international remote-contract searches, including freelance software development, Python, Django, React, APIs, and automation.
- Portuguese pages target Brazilian freelance-development searches with equivalent service intent.
- The homepage remains the primary conversion page. Case studies provide proof of delivery, and the contact section is the primary lead action.

## Metadata and content

- Maintain page-specific titles and descriptions that lead with the relevant language's freelance-service wording and then name the technical specialties.
- Keep visible homepage copy aligned with metadata: services, remote availability, English/Portuguese communication, and a contact path.
- Give case studies accurate, project-specific titles, descriptions, technologies, Open Graph data, and article metadata.
- Keep English-only blog pages English-only rather than inventing untranslated Portuguese alternates.

## Canonical and language routing

- Each indexable page emits one self-canonical URL.
- `/` and `/pt/` reference each other through `en-US`, `pt-BR`, and `x-default` hreflang links.
- Each translated case-study pair emits the same three hreflang links.
- English-only blog pages emit English and `x-default` links only.
- Not-found and error pages emit `noindex, nofollow` and never appear in the sitemap.

## Structured data

- Emit `WebSite`, `Person`, and `ProfessionalService` schemas from the shared layout, using real owner, service, language, and contact details.
- Add homepage-only FAQ schema for the real questions a prospective client would ask: freelance availability, services, remote work, and how to start.
- Add an `ItemList` for featured projects on the homepage and project-specific `CreativeWork` schema on case studies.
- Do not claim invented ratings, prices, office addresses, or service guarantees.

## Crawl controls

- `robots.txt` allows normal indexing and points to `https://jpclow.dev/sitemap-index.xml`.
- It blocks only non-public/non-indexable paths and optionally high-volume third-party SEO crawlers when that is a deliberate operating choice.
- Remove unsupported host directives and comments that do not affect crawler behavior.
- The generated sitemap includes canonical, indexable public routes only, excludes error/cache paths, and assigns modest priority/change-frequency hints without relying on them as ranking signals.

## Verification

1. Extend the existing SEO utility tests before implementation for the expected bilingual metadata, hreflang, schema, and crawl behavior.
2. Run unit tests, `astro check`, production build, and `git diff --check`.
3. Inspect built homepage, Portuguese homepage, a localized project pair, `robots.txt`, and generated sitemap XML to confirm canonical URLs, alternates, robots directives, and excluded error pages.

## Scope boundaries

- This work improves on-site discoverability; it does not guarantee rankings or replace backlink, content, Google Search Console, Bing Webmaster Tools, or client-review acquisition work.
- No paid advertising, analytics-provider setup, or deployment changes are included.
