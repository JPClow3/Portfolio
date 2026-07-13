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
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `22.16.0` |

The `wrangler.jsonc` file mirrors the Pages output directory for local Wrangler workflows, and `.node-version` pins the Node version used by Cloudflare's build image.

## Contact form

The contact form uses [Web3Forms](https://web3forms.com) gated by Cloudflare Turnstile. Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_ACCESS_KEY`, `PUBLIC_TURNSTILE_SITEKEY`, and `PUBLIC_TURNSTILE_WORKER_URL`. In production, set the same variables in Cloudflare Pages build environment variables.

Register the Turnstile widget for `jpclow.dev`, `localhost`, and `127.0.0.1`. The Worker URL should point to the Turnstile siteverify Worker; the browser verifies Turnstile there first, then submits the existing Web3Forms payload.

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
