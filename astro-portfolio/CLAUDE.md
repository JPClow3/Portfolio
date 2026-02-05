# CLAUDE.md - Astro Portfolio

## Project Overview
Modern portfolio website built with Astro 5, Svelte 5, and TypeScript. Uses islands architecture for optimal performance.

## Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 5 | Static site generation with islands |
| Language | TypeScript | Type safety |
| UI Islands | Svelte 5 | Interactive components (runes syntax) |
| Styling | Tailwind CSS v4 | Utility-first CSS via @tailwindcss/vite |
| 3D/WebGL | Three.js | Hero visual effects |
| Content | Content Collections + MDX | Type-safe markdown content |
| Deployment | Vercel | Edge network hosting |

## Directory Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components (Astro)
│   ├── layout/          # Header, Footer (Astro)
│   ├── islands/         # Interactive Svelte components
│   │   ├── ThemeToggle.svelte
│   │   └── HeroScene.svelte
│   └── sections/        # Page sections (Astro)
│       ├── Hero.astro
│       ├── About.astro
│       ├── Experience.astro
│       ├── Projects.astro
│       ├── Skills.astro
│       └── Contact.astro
├── content/
│   ├── config.ts        # Zod schemas for collections
│   ├── projects/        # Project markdown files
│   ├── experience/      # Experience markdown files
│   └── blog/            # Blog MDX files
├── layouts/
│   ├── BaseLayout.astro # Main HTML shell, SEO, theme
│   └── BlogLayout.astro # Blog post wrapper
├── pages/
│   ├── index.astro      # Homepage
│   └── blog/
│       ├── index.astro  # Blog listing
│       └── [...slug].astro # Dynamic blog posts
├── styles/
│   └── global.css       # Tailwind + CSS variables
└── lib/
    └── i18n.ts          # UI translations (EN/PT)
```

## Commands
```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Production build
npm run preview  # Preview production build
```

## Key Patterns

### Islands Architecture
- Astro components are static by default (zero JS)
- Svelte components hydrate only with client directives:
  - `client:load` - Immediate hydration (ThemeToggle)
  - `client:visible` - When scrolled into view
  - `client:idle` - After page load, during idle time

### Theme System
- CSS variables in `global.css` for light/dark themes
- Inline `<script is:inline>` in BaseLayout prevents flash
- ThemeToggle.svelte manages localStorage + system preference

### Content Collections
Located in `src/content/`, defined in `config.ts`:
- **projects** - title, description, tech[], github, featured
- **experience** - company, role, startDate, endDate, tasks[]
- **blog** - title, description, pubDate, tags[], draft

### Path Aliases
Configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@lib/*` → `src/lib/*`

## Important Files
- `astro.config.mjs` - Svelte, MDX, Sitemap, Vercel integrations
- `src/content/config.ts` - Zod schemas for content validation
- `src/styles/global.css` - Theme CSS variables
- `src/lib/i18n.ts` - Bilingual translations
- `src/components/islands/HeroScene.svelte` - Three.js 3D scene

## Code Conventions
- Astro components: Static content, layouts, sections
- Svelte components: Interactive islands only
- TypeScript: Strict mode enabled
- Tailwind: Utility-first, custom CSS variables for theming
- Content: Markdown/MDX with frontmatter schemas

## Deployment
- Vercel adapter configured in astro.config.mjs
- Static output by default
- Automatic deployments via GitHub integration
