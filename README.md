# Astro Portfolio

Personal portfolio for João Paulo Gonçalves Santos — Astro, Svelte 5, TypeScript, Tailwind CSS v4. Static site with islands architecture, content collections, and a design system.

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

The contact form posts to the Cloudflare Pages Function at `/api/contact`. The function creates or updates a HubSpot contact by email and stores the selected service and inquiry in the contact's `message` property. If Turnstile is configured, the function verifies it server-side. It also sends the existing Web3Forms email notification when that key is configured.

For optional Turnstile protection, configure `PUBLIC_TURNSTILE_SITEKEY` as a Cloudflare Pages build variable and add `TURNSTILE_SECRET_KEY` as a runtime secret. Add the HubSpot credential under **Settings → Variables and Secrets** for both Production and Preview as needed:

- `HUBSPOT_ACCESS_TOKEN` — HubSpot service key with `crm.objects.contacts.read` and `crm.objects.contacts.write` scopes. Inquiries are stored in the contact's `message` property.
- `WEB3FORMS_ACCESS_KEY` — optional; keeps the email notification enabled.

The current form uses `WEB3FORMS_ACCESS_KEY` only in the Pages Function at runtime; Astro does not read it during the build. The legacy `PUBLIC_WEB3FORMS_ACCESS_KEY` name is still accepted by the Function for compatibility. The former static Web3Forms form (PR #90) required that public variable in the Pages **build environment**, because Astro evaluated `import.meta.env` while generating HTML. A `vars` entry in `wrangler.jsonc` did not provide it to the build. Keep build variables in the Pages project settings and the current notification key as a runtime secret; no Web3Forms key belongs in `wrangler.jsonc` or the browser bundle. See [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables).

Register the Turnstile widget for `jpclow.dev` and local development hosts if you enable Turnstile. For local Pages Functions, copy `.dev.vars.example` to `.dev.vars`, fill in the secrets, run `npm run build`, then serve the output with `npx wrangler pages dev dist`. `npm run dev` alone does not run Cloudflare Pages Functions.

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
