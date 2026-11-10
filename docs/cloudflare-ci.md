# Cloudflare CI/CD

Cloudflare Pages portfolio tracks main and runs the static build, Astro checks and unit tests before publishing dist. The GitHub Build workflow runs on pull requests or explicit manual runs, retaining Chromium/accessibility/Lighthouse coverage without repeating it automatically after merge. IndexNow and other independent automation remain enabled.

Configured on 2026-10-22. Cloudflare settings live outside Git. Rollback: restore the prior build settings and re-enable push triggers in the retained GitHub workflow. Never run both automatic deployment owners at the same time.

## IndexNow artifact checks

IndexNow reads deployment artifacts from the project's production hostname, `https://portfolio-44w.pages.dev`, using `INDEXNOW_FETCH_ORIGIN` in its workflow. Cloudflare Bot Fight Mode challenged a GitHub-hosted runner requesting the canonical sitemap with HTTP 403. The Pages hostname serves the same production deployment and lets the job verify its commit marker and public IndexNow key without changing the custom domain's security settings.

The job waits for the requested commit and matching key before reading that deployment's sitemap. Artifact requests have a timeout, and transient artifact failures share the bounded deployment retry. Submitted page URLs, host and keyLocation remain on `https://jpclow.dev`; a sitemap containing another origin is rejected. Changes to the IndexNow script or workflow also trigger this check.
