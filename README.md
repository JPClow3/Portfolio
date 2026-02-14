# Astro Portfolio

Personal portfolio for João Paulo Gonçalves Santos — Astro 5, Svelte 5, TypeScript, Tailwind CSS v4. Static site with islands architecture, content collections, and a design system.

**Live:** https://jpclow.dev

## Commands

| Command         | Action                              |
| :-------------- | :---------------------------------- |
| `npm install`   | Install dependencies                |
| `npm run dev`   | Dev server at `localhost:4321`      |
| `npm run build` | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally  |
| `npm start`     | Serve `dist/` (for production/Railway) |

## Deploy on Railway

1. Create a new project at [Railway](https://railway.com) and deploy from this GitHub repo.
2. **Root directory:** leave empty (app is at repo root).
3. **Build:** Railpack will run `npm install` and `npm run build`. Override build command to `npm run build` if needed.
4. **Start:** Set to `npm start` (serves the static `dist/` folder).
5. **Variables:** Add `PUBLIC_WEB3FORMS_ACCESS_KEY` (and any other env vars) in the service variables. See `.env.example`.
6. **Networking:** Generate a Railway domain or attach a custom domain.

## Contact form

The contact form uses [Web3Forms](https://web3forms.com). Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_ACCESS_KEY`. On Railway, set `PUBLIC_WEB3FORMS_ACCESS_KEY` in the service variables (used at build time).

## Project structure

```
src/
├── components/   # Astro layout/sections, Svelte islands (ThemeToggle, HeroScene)
├── content/      # Collections: projects, experience, profile, blog
├── layouts/      # BaseLayout, BlogLayout
├── pages/        # index, blog
├── styles/       # global.css design system
└── lib/          # i18n (EN/PT)
```

See `CLAUDE.md` for detailed conventions and file reference.
