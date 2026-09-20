# CLAUDE.md - Astro Portfolio

**For AI assistants (Cursor/Claude):** This file is the single source of truth for this portfolio codebase (Astro project at repo root). Use it for context, conventions, and file locations when editing this project.

## Project Overview
Modern portfolio website for João Paulo Gonçalves Santos built with Astro 7, Svelte 5, and TypeScript. Uses islands architecture for optimal performance with a comprehensive design system.

**Live Site:** https://jpclow.dev

### Owner Info
- **GitHub:** https://github.com/JPClow3
- **LinkedIn:** https://linkedin.com/in/joaopaulosantosgo
- **Instagram:** https://www.instagram.com/_joao.paulo_sa/
- **Email:** joao@jpclow.dev

### Current Projects (src/content/projects/)
| File | Project | Tech |
|------|---------|------|
| throughline.md | Throughline | React, TypeScript, IndexedDB, PWA, End-to-End Encryption |
| lorebound.md | Lorebound | TypeScript, React, Cloudflare Workers, Supabase, AI, Stripe |
| moto-track.md | Moto Track | Django, HTMX, Tailwind CSS, PostgreSQL, Docker |
| hefesto.md | Hefesto | Python, XGBoost, Geospatial Data, Climate Data, ML Ops |
| agrohub.md | AgroHub UniRV | Python, Django, HTMX, Tailwind CSS, Alpine.js, Docker Swarm, Portainer |
| inova-rio-verde.md | Inova Rio Verde | Next.js, Tailwind CSS, Mapbox, MapTiler, deck.gl, Cloudflare Hyperdrive, Neon Postgres |
| portfolio.md | Developer Portfolio | Astro, Svelte, TypeScript, Tailwind CSS, Three.js |
| resonant-echoes.md | Resonant Echoes | TypeScript, Google Gemini, AI |
| league-ai-oracle.md | League AI Oracle | TypeScript, AI/ML, Riot Games API |
| veins-of-eridun.md | Veins of Eridûn | TypeScript, AI |

## Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 7 | Static site generation with islands |
| Language | TypeScript | Type safety (strict mode) |
| UI Islands | Svelte 5 | Interactive components (runes syntax: `$state`, `onMount`) |
| Styling | Tailwind CSS v4 | Utility-first CSS via `@tailwindcss/vite` |
| 3D/WebGL | Three.js | Hero visual effects (floating icosahedron + particles) |
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
│   │   └── HeroScene.svelte        # Three.js 3D scene
│   └── pages/               # Page-level components (Astro)
│       └── HomePage.astro          # Full homepage layout (all sections inline)
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
    └── i18n.ts              # UI translations (EN/PT)
```

## Commands
```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Production build
npm run preview  # Preview production build
```

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

### Homepage
- `pages/index.astro` delegates to `components/pages/HomePage.astro`, which owns the full page layout with all sections inlined (hero, tech marquee, projects bento, journey timeline, GitHub stats, contact footer). The `pt/index.astro` page renders the same component, picking up the `pt` locale from Astro's i18n routing.

### Islands Architecture
- Astro components are static by default (zero JS shipped)
- Svelte 5 components hydrate only with client directives:
  - `client:load` — Immediate hydration (ThemeToggle)
  - `client:visible` — When scrolled into view (HeroScene)
  - `client:idle` — After page load, during idle time

### Theme System
- CSS variables in `global.css` for light (`:root`) and dark (`html.dark`)
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
- JSON-LD Person structured data in BaseLayout
- OG + Twitter Card meta tags
- Self-hosted fonts via `@fontsource/inter` + `@fontsource/space-grotesk` (zero external font CDNs)
- Skip link for keyboard navigation
- Auto-generated sitemap via `@astrojs/sitemap`
- Static output (SSG) — all HTML generated at build time

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
| HomePage | `components/pages/HomePage.astro` | Full page layout — hero, marquee, bento grid, timeline, GitHub stats, contact footer |
| Header | `components/layout/Header.astro` | Glass nav, scroll shadow, mobile menu, i18n |
| Footer | `components/layout/Footer.astro` | Social links, credits |
| Icon | `components/common/Icon.astro` | 17-icon SVG system |
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
