# Cloudflare CI/CD

Cloudflare Pages portfolio tracks main and runs the static build, Astro checks and unit tests before publishing dist. The GitHub Build workflow runs on pull requests or explicit manual runs, retaining Chromium/accessibility/Lighthouse coverage without repeating it automatically after merge. IndexNow and other independent automation remain enabled.

Configured on 2026-10-22. Cloudflare settings live outside Git. Rollback: restore the prior build settings and re-enable push triggers in the retained GitHub workflow. Never run both automatic deployment owners at the same time.
