# Portfolio Observability Worker

Production-ready Cloudflare Worker providing zero-cost telemetry ingestion, Core Web Vitals tracking, error logging, and instant Discord/Telegram alerts.

## Features

- ⚡ **Zero Cost / Serverless**: Runs completely on Cloudflare Workers Free Tier (100k requests/day).
- 📊 **Core Web Vitals**: Ingests LCP, CLS, INP, FCP, TTFB, and navigation timing metrics.
- 🚨 **Instant Alerts**: Automatically notifies Discord webhooks and/or Telegram when JavaScript runtime errors occur.
- 💾 **Storage Flexibility**: Supports Cloudflare KV (fast key-value storage with 30-day auto-expiry) and Cloudflare D1 (SQL relational database with index queries).
- 🔒 **Privacy First**: Respects Do Not Track (`DNT: 1`), strips personal data, and sanitizes payloads.
- 🌐 **CORS Ready**: Configured for `jpclow.dev` and local development.

---

## Quick Setup & Deployment

### 1. Prerequisites
Ensure you have Wrangler installed (`npm i -g wrangler` or run via `npx wrangler`).

### 2. Create KV Namespace (Optional for Key-Value storage)
```bash
npx wrangler kv:namespace create OBSERVABILITY_KV
```
Copy the generated ID and update `wrangler.jsonc`.

### 3. Create D1 Database (Optional for SQL Analytics)
```bash
npx wrangler d1 create observability-db
```
Copy the `database_id` into `wrangler.jsonc`, then apply the schema:
```bash
npx wrangler d1 execute observability-db --remote --file=./schema.sql
```

### 4. Configure Alert Secrets (Optional)

#### For Discord Alerts:
```bash
npx wrangler secret put DISCORD_WEBHOOK_URL
# Paste your Discord Webhook URL (e.g., https://discord.com/api/webhooks/...)
```

#### For Telegram Alerts:
```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
# Paste your Telegram Bot Token from @BotFather

npx wrangler secret put TELEGRAM_CHAT_ID
# Paste your Telegram Chat ID
```

#### For Protected Stats API:
```bash
npx wrangler secret put AUTH_TOKEN
# Paste a secure random token for accessing /stats
```

### 5. Deploy the Worker
```bash
cd workers/observability
npx wrangler deploy
```

Cloudflare will output your Worker URL, e.g.:
`https://jp-portfolio-observability.<your-subdomain>.workers.dev`

---

## Connecting to Portfolio (Astro)

1. In your local `.env` (or in Cloudflare Pages build environment variables):
   ```env
   PUBLIC_OBSERVABILITY_ENDPOINT="https://jp-portfolio-observability.<your-subdomain>.workers.dev"
   ```

2. Rebuild the portfolio (`npm run build`).

The site in `src/layouts/BaseLayout.astro` will automatically send Core Web Vitals and error telemetry via non-blocking `navigator.sendBeacon`.

---

## Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` or `/events` | `POST` | Ingest Web Vitals and Error telemetry payloads |
| `/health` | `GET` | Health check & worker configuration status |
| `/stats` | `GET` | Aggregated metrics and top errors from D1 (requires `Bearer <AUTH_TOKEN>` if set) |
