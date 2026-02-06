# CLAUDE.md - Portfolio Project

## Project Overview
Personal portfolio website for João Paulo Gonçalves Santos built with modern web technologies.

**Live Site**: https://joaopaulosantos.dev (Vercel)

### Owner Info
- **Name:** João Paulo Gonçalves Santos
- **GitHub:** https://github.com/JPClow3
- **LinkedIn:** https://linkedin.com/in/joaopaulosantosgo
- **Instagram:** https://www.instagram.com/_joao.paulo_sa/
- **Email:** joaopaulo.grv4@gmail.com
- **Phone:** +55 64 9 9957-2265
- **Location:** Rio Verde, GO - Brazil

### Featured Projects (from GitHub)
| Project | Description | Tech |
|---------|-------------|------|
| League AI Oracle | AI strategic co-pilot for LoL | TypeScript, AI/ML, Riot Games API |
| Veins of Eridûn | AI text adventure game | TypeScript, AI |
| Resonant Echoes | Fantasy text adventure with Gemini | TypeScript, Google Gemini, AI |
| Portfolio | This portfolio site | Astro, Svelte, TypeScript, Tailwind |

---

## New Stack (Astro 5 Rebuild)

Located in `astro-portfolio/` directory. **This is the active development target.**

### Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 5 | Static site generation with islands |
| Language | TypeScript | Type safety |
| UI Islands | Svelte 5 | Interactive components (runes syntax) |
| Styling | Tailwind CSS v4 | Utility-first CSS via `@tailwindcss/vite` |
| 3D/WebGL | Three.js | Hero visual effects |
| Content | Astro Content Collections + MDX | Type-safe blog/portfolio data |
| Contact | Web3Forms | Serverless contact form |
| Deployment | Vercel | Edge network hosting |

### Directory Structure
```
astro-portfolio/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI (Astro)
│   │   │   ├── Icon.astro          # Centralized SVG icons (16 icons)
│   │   │   └── ScrollReveal.astro  # IntersectionObserver animations
│   │   ├── layout/          # Header, Footer (Astro)
│   │   ├── islands/         # Interactive Svelte components
│   │   │   ├── ThemeToggle.svelte  # Dark/light toggle w/ icon animation
│   │   │   └── HeroScene.svelte    # Three.js 3D scene
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
│   │   ├── BaseLayout.astro  # HTML shell, SEO, JSON-LD, theme
│   │   └── BlogLayout.astro  # Blog post wrapper
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   ├── styles/
│   │   └── global.css       # Design system: variables, utilities, animations
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
- `client:visible` for below-fold components (HeroScene)

**Design System (global.css)**
- CSS variables for colors, shadows, transitions, fluid typography
- Light/dark theme via `:root` and `html.dark`
- Utility classes: `.glass`, `.glass-card`, `.hover-lift`, `.hover-glow`, `.link-underline`
- Animation classes: `.animate-slide-up`, `.animate-slide-down`, `.animate-scale-in`, `.stagger-1`–`.stagger-6`
- `prefers-reduced-motion` disables all animations

**Reusable Components**
- `Icon.astro` — 17 SVG icons (github, linkedin, instagram, email, phone, location, calendar, briefcase, graduation, code, check, etc.)
- `ScrollReveal.astro` — IntersectionObserver wrapper with 6 animation types (fade-up/down/left/right, scale, fade)

**Theme System**
- CSS variables for colors in `:root` and `html.dark`
- Inline script in `<head>` prevents FOUC
- localStorage persistence + system preference detection
- ThemeToggle with smooth rotate/scale icon transition

**SEO & Performance**
- JSON-LD Person structured data in BaseLayout
- OG + Twitter meta tags
- Google Fonts preloading with async load + noscript fallback
- Skip link for keyboard accessibility
- Sitemap auto-generation

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
- `astro.config.mjs` — Svelte, MDX, Sitemap, Vercel integrations + i18n
- `src/content/config.ts` — Zod schemas for content validation
- `src/styles/global.css` — Full design system (variables, utilities, animations)
- `src/lib/i18n.ts` — Bilingual UI translations
- `src/components/common/Icon.astro` — Centralized icon system
- `src/components/common/ScrollReveal.astro` — Scroll animation wrapper
- `src/components/islands/HeroScene.svelte` — Three.js 3D scene
- `src/components/islands/ThemeToggle.svelte` — Dark/light mode toggle
- `src/layouts/BaseLayout.astro` — SEO, structured data, theme, font loading

### Setup Note
- Contact form uses Web3Forms — replace `YOUR_WEB3FORMS_ACCESS_KEY` in Contact.astro with your key from https://web3forms.com

---

## Legacy Stack (React)

Located in root directory. Original CRA-based implementation, maintained for reference only.

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
- Legacy React code maintained for reference only
- Both use Tailwind with class-based dark mode
- Content data migrated from `data.js` to Content Collections
- 3D effects use vanilla Three.js (not Threlte, for better Svelte 5 compatibility)
- PostCSS config in `astro-portfolio/postcss.config.cjs` prevents parent config conflicts
