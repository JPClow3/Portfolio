---
description: "Portfolio workspace configuration for AI agents"
applyTo: "**"
---

# Copilot Instructions — Portfolio

**Source of truth:** [`CLAUDE.md`](../CLAUDE.md)  
**For:** Astro 5 + Svelte 5 + TypeScript portfolio (`jpclow.dev`)

---

## Quick Reference

**Owner:** João Paulo Gonçalves Santos  
**GitHub:** https://github.com/JPClow3  
**Tech:** Astro 5 (SSG), Svelte 5, TypeScript, Tailwind CSS v4, Three.js  
**Output:** Static site → Railway deployment

### Commands
```bash
npm install       # Install dependencies
npm run dev       # Dev server (localhost:4321)
npm run build     # Production build → dist/
npm run preview   # Preview dist/ locally
npm start         # Serve dist/ (Railway)

npm test          # Run all tests (unit + e2e)
npm run test:unit # Vitest unit tests
npm run test:e2e  # Playwright e2e tests
npm run test:e2e:ui # Playwright UI mode
```

---

## Architecture at a Glance

### Islands Architecture
- **Astro components** (`.astro`): Server-rendered static HTML, zero JS by default
- **Svelte islands** (`.svelte`): Hydrated selectively with client directives
  - `client:load` — Immediate (ThemeToggle)
  - `client:visible` — On scroll (HeroScene)
  - `client:idle` — During idle time

### Content Collections
Located in `src/content/`, schemas in `config.ts`:
- **projects** — Title, description, tech[], link, github, image, featured, lang, order
- **experience** — Company, role, startDate, endDate, location, tasks[], lang, order
- **blog** — Title, description, pubDate, heroImage, tags, draft (MDX)
- **profile** — Current focus, custom metric (GitHub activity)

### Design System
- **Colors:** CSS variables (RGB format) in `src/styles/global.css`
- **Utilities:** `.glass`, `.glass-card`, `.gradient-text`, `.hover-lift`, `.hover-glow`, `.link-underline`
- **Animations:** `.animate-fade-in`, `.animate-slide-up/down/left/right`, `.animate-scale-in`, `.stagger-1–6`
- **Accessibility:** `@media (prefers-reduced-motion)`, focus-visible outline, skip link

---

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Icon.astro          # 17-icon SVG system
│   │   ├── ScrollReveal.astro  # IntersectionObserver scroll animations
│   │   └── BlogSkeleton.astro
│   ├── layout/
│   │   ├── Header.astro        # Glassmorphism nav, mobile menu
│   │   └── Footer.astro
│   ├── islands/
│   │   ├── ThemeToggle.svelte  # Dark/light theme
│   │   ├── HeroScene.svelte    # Three.js 3D scene
│   │   └── BackToTop.svelte
│   ├── sections/               # Reusable page sections
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Experience.astro
│   │   ├── Projects.astro
│   │   ├── Skills.astro
│   │   ├── Contact.astro
│   │   ├── BlogPreview.astro
│   │   └── home/               # Home-page specific variants
│   └── pages/
│       └── HomePage.astro
├── content/
│   ├── config.ts               # Zod schemas
│   ├── projects/
│   ├── experience/
│   ├── blog/
│   └── profile/
├── layouts/
│   ├── BaseLayout.astro        # SEO, structured data, theme init
│   └── BlogLayout.astro
├── pages/
│   ├── index.astro             # Homepage: custom single-page layout
│   ├── 404.astro
│   └── blog/
│       ├── index.astro         # Blog listing
│       └── [...slug].astro     # Dynamic posts
├── lib/
│   ├── i18n.ts                 # EN/PT translations
│   ├── github.ts
│   └── accessibility.ts
└── styles/
    └── global.css              # Design system: colors, shadows, animations
```

---

## Key Conventions

### Components
- **Astro files:** Static content, layouts, sections (zero JS shipped)
- **Svelte files:** Islands only — interactive elements with runes (`$state`, `onMount`)
- **Props:** TypeScript interfaces for all components
- **Icons:** Always use `<Icon name="..." />` from `Icon.astro` (never inline SVGs)
- **Animations:** Wrap in `<ScrollReveal>` component (never manual IntersectionObserver)

### Styling
- **Tailwind:** Utility-first via `@tailwindcss/vite`
- **CSS variables:** `rgb(var(--color-*))` pattern for theming
- **Naming:** Follow design system for consistent appearance
- **Accessibility:** Ensure contrast ratios (4.5:1 text, 3:1 graphics), focus-visible outlines, ARIA attributes

### Content & Frontmatter
- **Markdown/MDX:** Zod-validated frontmatter in `src/content/`
- **Type safety:** Auto-generated types via `astro:content`
- **Collections:** Use `getCollection()` and `getEntry()` for queries

### TypeScript
- **Strict mode enabled** in `tsconfig.json`
- **Path aliases:** `@/*`, `@components/*`, `@layouts/*`, `@lib/*`
- **Interfaces for props:** Explicitly type all component inputs

---

## Environment Variables

### Local (`.env` — copy from `.env.example`)
```
PUBLIC_WEB3FORMS_ACCESS_KEY=<your-key>
```

### Production (Railway service variables)
Same as above — used at **build time** (static output).

---

## Contact Form

- **Service:** Web3Forms API (`https://api.web3forms.com/submit`)
- **Validation:** Client-side (required fields, email regex, min message length)
- **Security:** Honeypot spam protection (`botcheck` hidden field)
- **Feedback:** Real-time validation on blur, success/error messages via `aria-live`

---

## Testing

### Unit Tests (Vitest)
```bash
npm run test:unit
```
Location: `tests/unit/`

### E2E Tests (Playwright)
```bash
npm run test:e2e        # Run headless
npm run test:e2e:ui     # Visual mode
npm run test:e2e:debug  # Debug mode
```
Location: `tests/e2e/`

---

## Deployment

### Local Preview
```bash
npm run build
npm run preview
```

### Railway
1. Connect GitHub repo to Railway
2. **Build command:** `npm run build`
3. **Start command:** `npm start` (serves `dist/`)
4. **Environment:** Set `PUBLIC_WEB3FORMS_ACCESS_KEY` in Railway dashboard
5. **Domain:** Generate Railway domain or attach custom domain

---

## For More Details

- **Comprehensive guide:** See [`CLAUDE.md`](../CLAUDE.md) for full architecture, component inventory, and code examples
- **Accessibility:** Instructions at `vscode-userdata:/c%3A/Users/jpsantos/AppData/Roaming/Code/User/prompts/a11y.instructions.md`
- **Astro best practices:** Instructions at `vscode-userdata:/c%3A/Users/jpsantos/AppData/Roaming/Code/User/prompts/astro.instructions.md`

---

## Anti-Patterns to Avoid

❌ **Don't:**
- Import Svelte components without `client:*` directives (they won't hydrate)
- Inline SVGs instead of using `Icon.astro`
- Use manual DOM queries; prefer reactive Svelte stores or Astro props
- Skip `prefers-reduced-motion` media queries — accessibility matters
- Export default styles from `.astro` files (use scoped `<style>` blocks)
- Hardcode colors; use CSS variables
- Omit TypeScript types on component props

✅ **Do:**
- Use `<ScrollReveal>` for animated-on-scroll content
- Validate content with Zod schemas
- Leverage Astro's static output for performance
- Test accessibility with Playwright + manual review
- Document component props and their types
- Use Tailwind utilities with design system variables
