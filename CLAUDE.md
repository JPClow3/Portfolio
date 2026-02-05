# CLAUDE.md - Portfolio Project

## Project Overview
Personal portfolio website for João Paulo Gonçalves Santos built with modern web technologies.

**Live Site**: https://joaopaulosantos.dev (Vercel)

---

## New Stack (Astro 5 Rebuild)

Located in `astro-portfolio/` directory.

### Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 5 | Static site generation with islands |
| Language | TypeScript | Type safety |
| UI Islands | Svelte 5 | Interactive components |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| 3D/WebGL | Three.js | Hero visual effects |
| Content | Astro Content Collections + MDX | Type-safe blog/portfolio data |
| Deployment | Vercel | Edge network hosting |

### Directory Structure
```
astro-portfolio/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI (Astro)
│   │   ├── layout/          # Header, Footer (Astro)
│   │   ├── islands/         # Interactive Svelte components
│   │   │   ├── ThemeToggle.svelte
│   │   │   └── HeroScene.svelte (Three.js 3D)
│   │   └── sections/        # Page sections (Astro)
│   │       ├── Hero.astro
│   │       ├── About.astro
│   │       ├── Experience.astro
│   │       ├── Projects.astro
│   │       ├── Skills.astro
│   │       └── Contact.astro
│   ├── content/
│   │   ├── config.ts        # Zod schemas
│   │   ├── projects/        # .md files
│   │   ├── experience/      # .md files
│   │   └── blog/            # .mdx files
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   ├── styles/
│   │   └── global.css       # Tailwind + theme variables
│   └── lib/
│       └── i18n.ts          # Translations (EN/PT)
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

### Key Patterns

**Islands Architecture**
- Static Astro components for layout and content
- Svelte islands hydrated only where interactivity is needed
- `client:load` for critical interactions (ThemeToggle)
- `client:visible` for below-fold components

**Theme System**
- CSS variables for colors in `:root` and `html.dark`
- Inline script in `<head>` prevents flash
- localStorage persistence + system preference detection

**Content Collections**
- Type-safe schemas with Zod validation
- Projects, Experience, Blog collections
- Bilingual support (lang field: 'en' | 'pt')

### Commands
```bash
cd astro-portfolio
npm run dev      # Dev server on localhost:4321
npm run build    # Production build
npm run preview  # Preview production build
```

### Important Files
- `astro.config.mjs` - Integrations, Vite plugins, i18n
- `src/content/config.ts` - Content collection schemas
- `src/styles/global.css` - Theme CSS variables
- `src/lib/i18n.ts` - UI translations
- `src/components/islands/HeroScene.svelte` - Three.js 3D scene

---

## Legacy Stack (React)

Located in root directory. Original CRA-based implementation.

### Tech Stack
- React 19.2.0 (Create React App)
- Tailwind CSS 3.4.18
- Framer Motion, GSAP, Three.js
- Service Worker for PWA

### Commands
```bash
npm start     # Dev server on localhost:3000
npm run build # Production build
```

### Directory Structure
```
src/
├── components/     # React components
├── context/        # AppContext, ThemeContext, etc.
├── hooks/          # Custom hooks
├── utils/          # Utilities
├── App.js          # Main component
├── data.js         # Portfolio content (bilingual)
└── index.css       # Styles

public/
├── sw.js           # Service Worker
└── manifest.json   # PWA manifest
```

---

## Development Notes

- **Astro project is the new main development target**
- Legacy React code maintained for reference
- Both use Tailwind with class-based dark mode
- Content data migrated from `data.js` to Content Collections
- 3D effects use vanilla Three.js (not Threlte, for better Svelte 5 compatibility)
