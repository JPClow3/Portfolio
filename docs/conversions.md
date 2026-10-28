# Portfolio conversion measurement

The static site sends small events to the same-origin `/api/events` Pages Function.
Wrangler binds `CONVERSIONS` to `portfolio_conversions` in production and
`portfolio_conversions_preview` for branch previews. Only `/api/events` and
the existing `/api/contact` handler use Pages Functions; other paths remain static.
Cloudflare creates the dataset after the first write; no browser API key is used.

## Events and interpretation

- `page_view`: page category and language; useful as a broad denominator.
- `case_study_view`: a published case study was opened, with its project ID.
- `inquiry_click`: contact/email link, placement and selected project/service/model.
- `form_start`: first input/change in one inquiry attempt.
- `form_success`: `/api/contact` returned HTTP success and `success: true` after saving to HubSpot.

These are event counts, not unique visitors or a person-level attribution funnel.
Successful submissions are browser-observed acknowledgements, not proof of inbox delivery.
Compare the same date ranges, locales and page categories before and after changes.
Do not infer causal improvements from raw counts alone. Ingest is public and counts may
include bots; same-origin checks are a browser guard, not authentication.

Only fixed, allowlisted values are accepted. No names, email addresses, inquiry text,
IP addresses, user agents, cookies, visitor IDs, full URLs, query strings or referrers
are included in the application payload. DNT and GPC suppress collection. Events are
best effort and never block contact or navigation. The service does not emit alerts.

## Reading results

Use Cloudflare Analytics Engine with an account token having **Account Analytics: Read**.
Keep this token outside any `PUBLIC_*` variable. In a shell with
`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` set:

```sh
node scripts/conversion-report.mjs
```

Optional variables: `CONVERSION_DAYS` (1–90, default 30),
`CONVERSION_PREVIEW=true` for branch preview data. The report uses
`SUM(_sample_interval)` to account for Analytics Engine sampling.

## Validation and publication

Run unit tests for the request parser, request limits, privacy and binding writes.
Build with `PUBLIC_CONVERSION_TESTING=true` to exercise the browser events locally;
browser tests intercept `/api/events` and `/api/contact`, so they never send real inquiries.
Omit that flag for normal local previews (collection is disabled on localhost).
Cloudflare Analytics Engine is not emulated locally: a hosted preview write followed
by a query of `portfolio_conversions_preview` is required to prove storage.
Production collection starts only when these changes are deployed through Pages.

The ID allowlists in `src/lib/inquiry.ts` must match project and service content;
unit tests enforce that contract when content changes.

References: [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/#analytics-engine),
[Analytics Engine SQL API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/).
