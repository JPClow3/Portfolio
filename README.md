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

## Deploy with Docker / Dokploy on AWS EC2

1. **Docker:** The project includes a multi-stage `Dockerfile` (`node:22-alpine` for building, `nginx:alpine` for serving) and `nginx.conf` for static file serving.
2. **Dokploy:** Create an App service, point to this GitHub repo, and select Dockerfile deployment.
3. **Build Arguments:** Set `PUBLIC_WEB3FORMS_ACCESS_KEY` as a build argument in Dokploy so it's embedded at build time.
4. **Networking:** Expose port 80 and attach your custom domain in Dokploy.

## Contact form

The contact form uses [Web3Forms](https://web3forms.com). Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_ACCESS_KEY`. In production (Dokploy), set `PUBLIC_WEB3FORMS_ACCESS_KEY` as a Docker build argument.

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
