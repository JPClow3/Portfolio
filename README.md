# Astro Portfolio

Personal portfolio for João Paulo Gonçalves Santos — Astro 5, Svelte 5, TypeScript, Tailwind CSS v4. Static site with islands architecture, content collections, and a design system.

**Live:** https://jpclow.dev

## Commands

| Command         | Action                              |
| :-------------- | :---------------------------------- |
| `npm install`   | Install dependencies                |
| `npm run dev`   | Dev server at `localhost:4321`      |
| `npm run build` | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm start`       | Alias for `npm run preview`         |

## Deploy with Cloudflare Pages

Production runs on Cloudflare Pages with GitHub integration from `JPClow3/Portfolio`.

| Setting | Value |
| :------ | :---- |
| Project | `portfolio` |
| Production branch | `master` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `22.16.0` |

The `wrangler.jsonc` file mirrors the Pages output directory for local Wrangler workflows, and `.node-version` pins the Node version used by Cloudflare's build image.

## Contact form

The contact form uses [Web3Forms](https://web3forms.com). Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_ACCESS_KEY`. In production, set `PUBLIC_WEB3FORMS_ACCESS_KEY` in Cloudflare Pages build environment variables.

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

See `AGENTS.md` and `CLAUDE.md` for detailed conventions and file reference.
