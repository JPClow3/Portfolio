export interface KVNamespace {
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  get(key: string): Promise<string | null>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export interface Env {
  OBSERVABILITY_KV?: KVNamespace;
  OBSERVABILITY_DB?: D1Database;
  DISCORD_WEBHOOK_URL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  AUTH_TOKEN?: string;
  ALLOWED_ORIGINS?: string;
}

export interface TelemetryEvent {
  type: 'web-vital' | 'runtime-error' | string;
  timestamp: string;
  path: string;
  name?: string;
  value?: number;
  message?: string;
  source?: string;
  line?: number;
  column?: number;
  [key: string]: unknown;
}

function getCorsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
    : ['https://jpclow.dev', 'http://localhost:4321', 'http://127.0.0.1:4321'];

  const allowOrigin =
    origin && (allowed.includes('*') || allowed.includes(origin))
      ? origin
      : allowed[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = getCorsHeaders(request, env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    // Health check endpoint
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          kvConfigured: Boolean(env.OBSERVABILITY_KV),
          d1Configured: Boolean(env.OBSERVABILITY_DB),
          discordAlertsConfigured: Boolean(env.DISCORD_WEBHOOK_URL),
          telegramAlertsConfigured: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Stats / Summary endpoint (protected by AUTH_TOKEN if configured)
    if (request.method === 'GET' && (url.pathname === '/stats' || url.pathname === '/api/stats')) {
      if (env.AUTH_TOKEN) {
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace(/^Bearer\s+/i, '');
        if (token !== env.AUTH_TOKEN) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      }

      let d1Stats = null;
      if (env.OBSERVABILITY_DB) {
        try {
          const recentEvents = await env.OBSERVABILITY_DB.prepare(
            `SELECT type, count(*) as count FROM telemetry_events GROUP BY type`
          ).all();

          const recentErrors = await env.OBSERVABILITY_DB.prepare(
            `SELECT path, error_message, count(*) as count, max(timestamp) as last_seen 
             FROM telemetry_events 
             WHERE type = 'runtime-error' 
             GROUP BY path, error_message 
             ORDER BY count DESC 
             LIMIT 10`
          ).all();

          const webVitalsAvg = await env.OBSERVABILITY_DB.prepare(
            `SELECT metric_name, round(avg(metric_value), 2) as avg_value, count(*) as samples 
             FROM telemetry_events 
             WHERE type = 'web-vital' AND metric_name IS NOT NULL 
             GROUP BY metric_name`
          ).all();

          d1Stats = {
            eventCounts: recentEvents.results,
            topErrors: recentErrors.results,
            webVitalsAverages: webVitalsAvg.results,
          };
        } catch {
          d1Stats = { error: 'Failed to query D1 database' };
        }
      }

      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          d1: d1Stats,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Ingest telemetry events (POST / or POST /events)
    if (request.method === 'POST') {
      try {
        const payload = (await request.json()) as TelemetryEvent;

        if (!payload || typeof payload !== 'object' || !payload.type) {
          return new Response(JSON.stringify({ error: 'Invalid payload: missing type' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const timestamp = payload.timestamp || new Date().toISOString();
        const path = payload.path || '/';

        // Extract Cloudflare Edge context safely
        const cf = (request as unknown as { cf?: { country?: string; city?: string } }).cf;
        const country = cf?.country || 'Unknown';
        const city = cf?.city || 'Unknown';
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        const enrichedEvent = {
          id,
          ...payload,
          timestamp,
          path,
          geo: { country, city },
          userAgent,
        };

        // 1. Store in Cloudflare KV if bound
        if (env.OBSERVABILITY_KV) {
          ctx.waitUntil(
            env.OBSERVABILITY_KV.put(`event:${timestamp}:${id}`, JSON.stringify(enrichedEvent), {
              expirationTtl: 60 * 60 * 24 * 30, // 30 days TTL
            }).catch(() => {})
          );
        }

        // 2. Store in Cloudflare D1 if bound
        if (env.OBSERVABILITY_DB) {
          ctx.waitUntil(
            env.OBSERVABILITY_DB.prepare(
              `INSERT INTO telemetry_events (
                id, type, path, timestamp, metric_name, metric_value, 
                error_message, error_source, error_line, error_column, 
                country, city, user_agent
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(
                id,
                payload.type,
                path,
                timestamp,
                payload.name || null,
                typeof payload.value === 'number' ? payload.value : null,
                payload.message || null,
                payload.source || null,
                payload.line || null,
                payload.column || null,
                country,
                city,
                userAgent
              )
              .run()
              .catch(() => {})
          );
        }

        // 3. Dispatch Instant Alert for runtime errors
        if (payload.type === 'runtime-error') {
          // Discord Alert
          if (env.DISCORD_WEBHOOK_URL) {
            ctx.waitUntil(
              sendDiscordAlert(env.DISCORD_WEBHOOK_URL, {
                id,
                path,
                message: payload.message || 'Unknown runtime error',
                source: payload.source,
                line: payload.line,
                column: payload.column,
                country,
                timestamp,
              })
            );
          }

          // Telegram Alert
          if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
            ctx.waitUntil(
              sendTelegramAlert(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, {
                id,
                path,
                message: payload.message || 'Unknown runtime error',
                source: payload.source,
                line: payload.line,
                country,
                timestamp,
              })
            );
          }
        }

        return new Response(JSON.stringify({ success: true, id }), {
          status: 202,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: 'Failed to process telemetry payload',
            details: err instanceof Error ? err.message : String(err),
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, POST, OPTIONS',
        ...corsHeaders,
      },
    });
  },
};

async function sendDiscordAlert(
  webhookUrl: string,
  errorInfo: {
    id: string;
    path: string;
    message: string;
    source?: string;
    line?: number;
    column?: number;
    country: string;
    timestamp: string;
  }
) {
  try {
    const embed = {
      title: '🚨 Portfolio Runtime Error Detected',
      color: 0xef4444, // Red
      description: `\`\`\`\n${errorInfo.message}\n\`\`\``,
      fields: [
        { name: '📍 Path', value: `\`${errorInfo.path}\``, inline: true },
        { name: '🌍 Location', value: errorInfo.country, inline: true },
        {
          name: '📄 Source',
          value: errorInfo.source
            ? `\`${errorInfo.source}:${errorInfo.line ?? '?'}:${errorInfo.column ?? '?'}\``
            : 'Unknown',
          inline: false,
        },
      ],
      timestamp: errorInfo.timestamp,
      footer: { text: `Event ID: ${errorInfo.id}` },
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Portfolio Observability',
        avatar_url: 'https://jpclow.dev/apple-touch-icon.png',
        embeds: [embed],
      }),
    });
  } catch {
    // Non-blocking alerting: ignore alert dispatch failure
  }
}

async function sendTelegramAlert(
  botToken: string,
  chatId: string,
  errorInfo: {
    id: string;
    path: string;
    message: string;
    source?: string;
    line?: number;
    country: string;
    timestamp: string;
  }
) {
  try {
    const text = `🚨 *Portfolio Runtime Error*\n\n*Error:* \`${errorInfo.message}\`\n*Path:* \`${errorInfo.path}\`\n*Location:* ${errorInfo.country}\n*Source:* \`${errorInfo.source || 'N/A'}:${errorInfo.line || '?'}\`\n\n_Time: ${errorInfo.timestamp}_`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch {
    // Non-blocking alerting: ignore alert dispatch failure
  }
}
