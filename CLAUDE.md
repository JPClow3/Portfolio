# CLAUDE.md - Astro Portfolio

**For AI assistants (Cursor/Claude):** This file is the single source of truth for this portfolio codebase (Astro project at repo root). Use it for context, conventions, and file locations when editing this project.

## Project Overview
B2B company website for **JPCLOW**, the software engineering studio founded by João Paulo Gonçalves Santos, built with Astro 7, Svelte 5, and TypeScript. It presents services, case studies, process, and engagement models to companies (dark-first, Three.js hero, parallax), using islands architecture and a comprehensive design system.

**Live Site:** https://jpclow.dev

### Owner Info
- **GitHub:** https://github.com/JPClow3
- **LinkedIn:** https://linkedin.com/in/joaopaulosantosgo
- **Instagram:** https://www.instagram.com/_joao.paulo_sa/
- **Email:** joao@jpclow.dev

### Current Projects (src/content/projects/)
The catalog contains 18 projects in each locale. Read the frontmatter in `src/content/projects/` for the current stack, status, and case-study availability; these change as the projects evolve. The homepage features a smaller selection, and the catalog includes live, in-development, private-source, research, prototype, and archived work.

## Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 7 | Static site generation with islands |
| Language | TypeScript | Type safety (strict mode) |
| UI Islands | Svelte 5 | Interactive components (runes syntax: `$state`, `onMount`) |
| Styling | Tailwind CSS v4 | Utility-first CSS via `@tailwindcss/vite` |
| 3D/WebGL | Three.js | Homepage hero module cluster (`StudioScene`) + ambient case-study scene (`HeroScene`) |
| Content | Content Collections + MDX | Type-safe markdown content |
| Contact | Web3Forms + Cloudflare Turnstile | Serverless form submissions with bot protection |
| Deployment | Cloudflare Pages | GitHub integration builds static `dist/` |
src/
├── components/
│   ├── common/              # Reusable UI components (Astro)
│   │   ├── Icon.astro              # Centralized SVG icon system (17 icons)
│   │   └── ScrollReveal.astro      # IntersectionObserver scroll animations
│   ├── layout/              # Layout components (Astro)
│   │   ├── Header.astro            # Glassmorphism nav, mobile menu
│   │   └── Footer.astro            # Social links, credits
│   ├── islands/             # Interactive Svelte components
│   │   ├── BackToTop.svelte        # Scroll-to-top button
│   │   ├── ThemeToggle.svelte      # Dark/light toggle w/ rotate animation
│   │   ├── StudioScene.svelte      # Homepage hero Three.js scene (glossy module cluster)
│   │   └── HeroScene.svelte        # Ambient Three.js scene (case-study pages only)
│   ├── studio/              # B2B sections (Astro): StudioHero, CapabilityMarquee, ServicesGrid,
│   │                        # WorkShowcase, ProcessSection, EngineeringSection, SectorsSection,
│   │                        # EngagementSection, FaqSection, CtaBand, PageHero, SectionHeading
│   └── pages/               # Page-level components (Astro)
│       ├── HomePage.astro          # Composes the studio sections
│       ├── ServicesPage.astro      # /services/ (+ /pt/services/)
│       ├── AboutPage.astro         # /about/ company + founder
│       └── ContactPage.astro       # /contact/ project inquiry form
├── content/
│   ├── projects/             # Project markdown files
│   ├── experience/           # Experience markdown files
│   ├── profile/              # Profile content (current focus, custom metric)
│   └── blog/                 # Blog MDX files
├── layouts/
│   ├── BaseLayout.astro     # HTML shell, SEO, JSON-LD, theme, fonts
│   └── BlogLayout.astro     # Blog post wrapper
├── pages/
│   ├── index.astro          # Homepage: custom single-page layout (inline sections)
│   └── blog/
│       ├── index.astro      # Blog listing
│       └── [...slug].astro  # Dynamic blog posts
├── styles/
│   └── global.css           # Full design system
└── lib/
    ├── i18n.ts              # Flat UI strings (EN/PT): nav, footer, form
    └── studio.ts            # Structured B2B copy (EN/PT): services, process, sectors, engagement, FAQ
```

## Commands
```bash
npm run dev               # Start dev server (localhost:4321)
npm run build             # Production build
npm run preview           # Preview production build
npm run images:optimize   # PNG→WebP + 800px variants for project screenshots (required for srcset)

npm test                  # Unit + Chromium e2e
npm run test:unit         # Vitest (tests/unit, .ts/.js/.mjs)
npm run test:e2e:chromium # Playwright against dist/ (served by scripts/serve.mjs on :4410)
npm run test:a11y         # Only the axe WCAG 2.1 A/AA scan (tests/e2e/accessibility.spec.ts)
npm run test:lighthouse   # Lighthouse budgets on dist/ (run `npm run build` first)
```

### Testing
- **Unit (`tests/unit/`)**: SEO/schema, i18n hygiene (EN/PT key parity, no dead keys, no first-person copy), studio copy integrity (`studio.test.ts`: locale parity, cited case studies exist, no invented clients/prices), responsive image variants, command palette, OG images, RSS, PWA, commit-message policy.
- **E2E (`tests/e2e/`)**: build first (`npm run build`); forms need `PUBLIC_WEB3FORMS_ACCESS_KEY`, `PUBLIC_TURNSTILE_SITEKEY`, `PUBLIC_TURNSTILE_WORKER_URL` at build time (CI builds without them, so form tests skip). `studio.spec.ts` covers header hide/reveal, nav indicator, scroll progress, hero count-up/decode, copy-email, FAQ, contact payload, deep links, internal link crawl, language switcher, mobile menu, phone overflow + runtime errors, SEO metadata, JSON-LD, theme default. Stub `challenges.cloudflare.com` in new specs so `networkidle` settles.
- **Accessibility**: `accessibility.spec.ts` runs axe on 10 pages in dark and light themes (reduced motion so reveals are visible); zero violations expected.
- **Lighthouse (`scripts/lighthouse.mjs`)**: serves `dist/` on :4420, audits `/`, `/services/`, `/about/`, `/contact/`, `/projects/`, a case study and `/pt/` on mobile + desktop with `--lang=en-US`, writes `lighthouse-reports/` (gitignored). Budgets: accessibility 100, SEO 100, best practices 95, performance 80 mobile / 90 desktop (override with `LH_PERF_MOBILE`/`LH_PERF_DESKTOP`; CI uses 75/85). Filter with `LH_PAGES` / `LH_FORM_FACTORS` (Git Bash: prefix `MSYS_NO_PATHCONV=1`).
- **CI (`.github/workflows/build.yml`)**: build → astro check → unit → Chromium e2e (incl. axe) → Lighthouse, uploading Lighthouse reports always and the Playwright report on failure.

### Performance guardrails (found via Lighthouse — keep them)
- `StudioScene` skips WebGL on phones (<768px), data-saver, and devices with fewer than 4 cores (CSS glow only; `data-scene-ready="lite"`), and on desktop starts ≥2.5s after `load`.
- Hero text must be partly painted on the first frame (`.reveal-line` starts at 60%, `.fade-rise` at opacity 0.01) so it counts for FCP/LCP.
- Don't position hero decorations with `%` of the hero height (font swap changes it → CLS); use `svh`/`inset: 0`.
- Project screenshots use `projectImageSources()` (`src/lib/images.ts`) for `srcset`; below-the-fold images are `loading="lazy"`.
- `public/_headers` sets immutable caching for `/_astro/*` and security headers on Cloudflare Pages; `scripts/serve.mjs` mirrors it and compresses (br/gzip) so local audits match production.
- No cross-document `@view-transition`: it froze rendering after click navigation in Chromium (fragment scroll and IntersectionObserver never ran).
- Critical fonts (Space Grotesk 600, Inter 400 latin) are preloaded in `BaseLayout`; the hero content is top-anchored, not vertically centred, so font swap can't shift it.

### SEO conventions
- Titles ≤ 60 chars and descriptions 70–160 chars for home/services/about/contact/blog (enforced in `tests/unit/seo.test.ts`).
- Every top-level page has its own 1200×630 social preview generated at build time: `/open-graph/site/{home,services,about,contact,projects,blog}.png` (+ `/open-graph/pt/site/...`) via `getSiteOgImageUrl()` + `src/lib/site-og.ts`; `BaseLayout` defaults to the localized home preview.
- Structured data: Organization (`#organization`) + founder Person on every page; `buildStudioPageSchemas()` adds typed `WebPage`/`AboutPage`/`ContactPage` + `BreadcrumbList` to studio pages; the catalog is a `CollectionPage` with an `ItemList`; case studies are `CreativeWork` published by the organization.
- Internal linking: case studies link to the services that cite them ("Services behind this project") and to the next case study; service cards deep-link to `/services/#<id>`.
- Honesty: copy must not claim production/client delivery for projects whose status is research, prototype, or in development (`studio.test.ts` guards the sectors lead and the "Related work" label). Keep `public/llms.txt` in sync with project status and attribution.

### Reading & page styles
- `.prose` (long-form Markdown for case studies and blog posts) is defined in `global.css` — no typography plugin is installed.
- Heading base styles live in `@layer base` so `.mono-label`/utilities can restyle headings.
- In light mode the header is always a solid dark bar (its logo is white); don't make it transparent over light pages.
- The catalog has client-side status filters (`[data-catalog-filters]`, `aria-pressed`, live count); `ScrollReveal` passes `data-*` attributes through.

---

## Design System (`src/styles/global.css`)

Follows the JPCLOW Manual de Identidade Visual v1.0 (institutional source of truth for brand).
Known exception: `HeroScene.svelte` (Three.js particles) is kept per owner decision, even though
Manual §9 recommends avoiding excess particles/futurist effects.

### CSS Variables

**Institutional tokens (Manual §19.1–§19.4):**
- `--jpclow-blue: #005EFE`, `--jpclow-dark: #1D2026`, `--jpclow-bg: #F7F8FA`, `--jpclow-surface: #FFFFFF`
- `--jpclow-text-secondary: #667085`, `--jpclow-border: #DDE1E7`
- `--jpclow-bg-dark: #0E1014`, `--jpclow-surface-dark: #171A20`
- `--space-1`–`--space-8`: 4, 8, 16, 24, 32, 48, 64, 96px
- `--radius-sm/md/lg`: 4 / 8 / 12px (small elements / buttons / cards — no pills)
- `--font-body: "Inter", Arial, sans-serif`; `--font-display: "Space Grotesk", "Inter", Arial, sans-serif`
- Type scale §7.4: display 64, H1 48, H2 36, H3 28, H4 22, body-lg 18, body 16, small 14, caption 12px

**Colors** (RGB format for use with `rgb()` and opacity):
- `--color-bg-primary/secondary/tertiary` — Background levels (`#F7F8FA` / `#FFFFFF` light; `#0E1014` / `#171A20` / `#1D2026` dark)
- `--color-text-primary/secondary/muted` — Text hierarchy (secondary `#667085` light)
- `--color-accent` / `--color-accent-hover` — Brand accent `#005EFE`, hover `#0049C7` light / `#60A5FA` dark (legible variant, never a logo recolor)
- `--color-accent-contrast: 255 255 255`
- `--color-border` — `#DDE1E7` light / `#2A313B`-range dark
- `--color-success` / `--color-warning` / `--color-error` — Functional status colors, always paired with text/icon (§6.4)
- Light mode in `:root`, dark mode in `html.dark` (base `#0E1014`, never pure black)

**Typography:**
- Headings (`h1`–`h6`): Space Grotesk (Medium/Semibold/Bold)
- Body/UI: Inter (Regular/Medium/Semibold); fallbacks Arial / system sans-serif

**Shadows (discreet, functional — Manual §13.1):**
- `.hover-lift`: `translateY(-4px)` + `0 6px 16px` neutral shadow (no accent glow)
- `.hover-glow`: subtle neutral shadow only
- No heavy/glow shadows as a default style

**Studio layer (end of `global.css`, inside `@layer components`):** owner-approved exception to Manual §13 — subtle blue glows on buttons/cards/3D. Classes: `.studio-container`, `.studio-section`, `.eyebrow`, `.mono-label`, `.display-xl/.display-lg/.heading-section`, `.text-outline`, `.text-shine`, `.reveal-line`, `.fade-rise`, `.btn .btn-primary .btn-ghost`, `.link-arrow`, `.panel`, `.spotlight`, `.beam-border`, `.icon-tile`, `.chip`, `.grid-floor`, `.hero-aurora`, `.work-*`, `.process-*`, `.code-window`, `.arch-line`. Keep them in the layer so Tailwind utilities can override them. Motion layer (end of file): smart-hiding header + progress line, sliding nav indicator, `.split-word`, button light sweep/press/loading, `.u-link`, card lift, `.grain`, `.pointer-glow`, `.field` states, copy feedback, animated FAQ (`::details-content`). Avoid class names that collide with Tailwind utilities (e.g. `ring`).

### Utility Classes

| Class | Purpose |
|-------|---------|
| `.glass` | Glassmorphism: `backdrop-blur(12px)`, 70% bg opacity |
| `.glass-card` | Stronger glass: `backdrop-blur(16px)`, 60% bg, elevated shadow, border |
| `.gradient-text` | Solid brand-accent text (sobriety: no gradient fill per Manual §6) |
| `.hover-lift` | Hover: `translateY(-4px)` + medium shadow |
| `.hover-glow` | Hover: subtle neutral shadow only |
| `.link-underline` | Animated underline via `::after` pseudo-element |
| `.skip-link` | Accessibility skip-to-content (visible on `:focus`) |

### Animation Classes

| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Opacity 0 → 1 |
| `.animate-slide-up` | Opacity + translateY(20px → 0) |
| `.animate-slide-down` | Opacity + translateY(-20px → 0) |
| `.animate-scale-in` | Opacity + scale(0.95 → 1) |
| `.stagger-1` – `.stagger-6` | Animation delays (100ms increments) |

### Accessibility
- `@media (prefers-reduced-motion: reduce)` — Disables all animations and transitions
- Custom `:focus-visible` outline with accent color

---

## Reusable Components

### `Icon.astro`
Centralized SVG icon system (Lucide-compatible, uniform `stroke-width: 2` per Manual §10).

**Props:** `name` (required), `size` (default: 24), `class` (optional)

**Available icons (17):** `github`, `linkedin`, `instagram`, `email`, `phone`, `location`, `external-link`, `arrow-down`, `menu`, `close`, `sun`, `moon`, `calendar`, `briefcase`, `graduation`, `code`, `check`

**Usage:**
```astro
<Icon name="github" size={20} class="text-[rgb(var(--color-accent))]" />
```

### `ScrollReveal.astro`
IntersectionObserver wrapper for scroll-triggered animations.

**Props:**
- `animation` — `'fade-up'` | `'fade-down'` | `'fade-left'` | `'fade-right'` | `'scale'` | `'fade'` (default: `'fade-up'`)
- `delay` — ms (default: 0)
- `duration` — ms (default: 600)
- `threshold` — 0–1 (default: 0.1)
- `tag` — `'div'` | `'section'` | `'article'` | `'li'` | `'span'` (default: `'div'`)
- `class` — optional additional classes

**Usage:**
```astro
<ScrollReveal animation="fade-up" delay={200}>
  <h2>Animated on scroll</h2>
</ScrollReveal>
```

Respects `prefers-reduced-motion`. Re-initializes on Astro page transitions via `astro:page-load`.

---

## Key Patterns

### Homepage & studio pages
- `pages/index.astro` delegates to `components/pages/HomePage.astro`, which composes the `components/studio/*` sections: hero (StudioScene) → capability marquee → services bento → sticky-stacked case studies (featured projects) → process → engineering showcase → sectors → engagement models → FAQ → CTA band (`#contact`).
- `/services/`, `/about/`, `/contact/` each have EN and `pt/` route files delegating to a page component. The full contact form (`common/ContactForm.astro`) lives on `/contact/`.
- B2B copy is edited in `src/lib/studio.ts` (typed `StudioCopy`, one object per locale). Project references use content-collection slugs.
- Keep claims factual: no invented clients, testimonials, prices, or metrics — stats in the hero are computed from content.

### Islands Architecture
- Astro components are static by default (zero JS shipped)
- Svelte 5 components hydrate only with client directives:
  - `client:load` — Immediate hydration (ThemeToggle)
  - `client:visible` — When scrolled into view (HeroScene)
  - `client:idle` — After page load, during idle time

### Theme System
- CSS variables in `global.css` for light (`:root`) and dark (`html.dark`); `.force-dark` applies the dark tokens to a subtree (hero, header, footer, CTA band, engineering section) so they stay dark in light mode
- **Dark-first:** the inline init script uses dark unless the visitor explicitly stored `theme=light`
- Inline `<script is:inline>` in BaseLayout prevents FOUC
- ThemeToggle.svelte: `$state` rune, localStorage + system preference, smooth rotate/scale icon animation
- Body has `transition: background-color 200ms` for smooth theme switching

### Header
- Glassmorphism via `.glass` class
- Scroll shadow effect (adds `box-shadow` after 50px scroll)
- Desktop: nav links with animated underline on hover
- Mobile menu: `aria-expanded`, `aria-controls`, Escape key close, click-outside close, hamburger/X icon toggle, smooth max-height animation
- Re-initializes on Astro page transitions

### Contact Form
- Web3Forms API (`https://api.web3forms.com/submit`)
- Cloudflare Turnstile widget verifies through `PUBLIC_TURNSTILE_WORKER_URL` before Web3Forms submission
- Honeypot spam protection (`botcheck` hidden checkbox)
- Client-side validation: required fields, email regex, min message length
- Real-time validation on blur
- Loading state: disabled button + spinner
- Success/error messages via `aria-live="polite"` region
- **Setup:** Set `PUBLIC_WEB3FORMS_ACCESS_KEY`, `PUBLIC_TURNSTILE_SITEKEY`, and `PUBLIC_TURNSTILE_WORKER_URL` in `.env` (local) or in Cloudflare Pages build environment variables. Register Turnstile domains for `jpclow.dev`, `localhost`, and `127.0.0.1`.

### Content Collections
Located in `src/content/`, schemas in `config.ts`:
- **projects** — title, description, tech[], link?, github?, image?, featured, lang, order
- **experience** — company, role, startDate, endDate?, location?, tasks[], lang, order
- **blog** — title, description, pubDate, updatedDate?, heroImage?, tags[], draft, lang
- **profile** — lang, currentFocus (title, items[]), customMetric (label, githubUsername, fallbackEvents[])

### SEO & Performance
- JSON-LD structured data in BaseLayout: WebSite, ProfessionalService (`#organization`, JPCLOW) with founder Person (`#person`); FAQPage on home (from `studio.ts`); OfferCatalog on `/services/`
- JSON-LD `BreadcrumbList` structured data in project case studies (`ProjectCaseStudy.astro`) and blog articles (`BlogLayout.astro`)
- Dynamic build-time OpenGraph & Twitter Card PNG images generated via Satori + `@resvg/resvg-js` (`src/lib/og-image.ts`) at `/open-graph/projects/[slug].png`, `/open-graph/pt/projects/[slug].png`, `/open-graph/blog/[slug].png`, and `/open-graph/pt/blog/[slug].png` (author: JPCLOW)
- Page metadata lives in `src/lib/seo.ts` (`getHomeSeo`, `getPageSeo`, `getBlogIndexSeo`); hreflang alternates cover `/services/`, `/about/`, `/contact/`, `/projects/`, and blog paths
- Self-hosted fonts via `@fontsource/inter` + `@fontsource/space-grotesk` (zero external font CDNs)
- Skip link for keyboard navigation
- Auto-generated sitemap via `@astrojs/sitemap`
- Static output (SSG) — all HTML and OG images generated at build time

### Path Aliases
Configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@lib/*` → `src/lib/*`

---

## Component Inventory

| Component | File | Key Features |
|-----------|------|--------------|
| HomePage | `components/pages/HomePage.astro` | Composes the B2B studio sections |
| Header | `components/layout/Header.astro` | Glass nav, scroll shadow, mobile menu, i18n |
| Footer | `components/layout/Footer.astro` | Social links, credits |
| Icon | `components/common/Icon.astro` | Lucide-style SVG icons (names typed in `icon-names.ts`) |
| Parallax | `components/common/Parallax.astro` | Scroll-linked translateY wrapper (`speed`), reduced-motion safe |
| Spotlight | `components/common/Spotlight.astro` | Cursor-following glow card surface |
| ContactForm | `components/common/ContactForm.astro` | Web3Forms + Turnstile inquiry form |
| StudioScene | `components/islands/StudioScene.svelte` | Hero WebGL cluster; loads ≥2.5s after `load` |
| Interactions | `components/common/Interactions.astro` | Site-wide motion: `--scroll-progress`, `[data-magnetic]`, `[data-scramble]`, `[data-count]`, `[data-pointer-glow]`, `[data-copy]`, stacked-card depth |
| SplitText | `components/common/SplitText.astro` | Word-by-word masked heading reveal (inside `<ScrollReveal>`) |
| ScrollReveal | `components/common/ScrollReveal.astro` | IntersectionObserver scroll animations |
| HeroScene | `components/islands/HeroScene.svelte` | Three.js 3D icosahedron + particles |
| ThemeToggle | `components/islands/ThemeToggle.svelte` | Dark/light toggle with icon animation |
| BackToTop | `components/islands/BackToTop.svelte` | Scroll-to-top button |

---

## Important Files
- `astro.config.mjs` — Svelte, MDX, Sitemap, i18n config (static output, no adapter)
- `src/content.config.ts` — Zod schemas for content collections (Astro content layer)
- `src/styles/global.css` — Complete design system (variables, utilities, animations)
- `src/lib/i18n.ts` — Bilingual translations (EN/PT)
- `src/components/common/Icon.astro` — Centralized icon system
- `src/components/common/ScrollReveal.astro` — Scroll animation wrapper
- `src/components/islands/HeroScene.svelte` — Three.js 3D scene
- `src/components/islands/ThemeToggle.svelte` — Theme toggle with icon animation
- `src/layouts/BaseLayout.astro` — SEO, structured data, theme init, font loading
- `public/brand/` — Official logo/symbol SVGs (`logo-primary`, `logo-negative`, `icon-primary`, `icon-negative` + `README.txt`); source of truth is the Brand Pack

## Code Conventions
- **Astro components:** Static content, layouts, sections (zero JS by default)
- **Svelte components:** Interactive islands only, use runes (`$state`, `onMount`)
- **TypeScript:** Strict mode, interfaces for props
- **Tailwind:** Utility-first with CSS variables for theming; use `rgb(var(--color-*))` pattern
- **Content:** Markdown/MDX with Zod-validated frontmatter
- **Accessibility:** `aria-*` attributes, `prefers-reduced-motion`, skip link, focus-visible
- **Icons:** Always use `<Icon name="..." />`, never inline SVGs in sections
- **Animations:** Always use `<ScrollReveal>` wrapper, never manual IntersectionObserver

## Deployment
- Static output (`output: 'static'`). No platform adapter.
- **Production:** Cloudflare Pages project `portfolio`, connected to GitHub repo `JPClow3/Portfolio`.
  - Production branch: `main`
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Root directory: `/`
  - Node version: `22.16.0` via `.node-version` and Pages `NODE_VERSION`
  - `wrangler.jsonc` sets `pages_build_output_dir` to `./dist` for local Wrangler workflows.
  - Set `PUBLIC_WEB3FORMS_ACCESS_KEY`, `PUBLIC_TURNSTILE_SITEKEY`, and `PUBLIC_TURNSTILE_WORKER_URL` in Cloudflare Pages build environment variables so Astro can embed them at build time.
- **Local preview:** `npm run preview` (Astro's built-in preview server on port 4321)
