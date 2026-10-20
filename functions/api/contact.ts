interface Env {
  HUBSPOT_ACCESS_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
  WEB3FORMS_ACCESS_KEY?: string;
  PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
}

interface ContactSubmission {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  service?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
  botcheck?: unknown;
}

interface HubSpotContact {
  id: string;
}

const json = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const text = (value: unknown, maxLength: number): string =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const HUBSPOT_CRM_API_VERSION = '2026-09';

async function hubspotRequest<T>(
  path: string,
  token: string,
  init: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.hubapi.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HubSpot request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

async function saveInquiry(env: Env, submission: {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}): Promise<void> {
  if (!env.HUBSPOT_ACCESS_TOKEN) throw new Error('HubSpot is not configured');

  const [firstname, ...lastNameParts] = submission.name.split(/\s+/);
  const properties: Record<string, string> = { email: submission.email };
  if (firstname) properties.firstname = firstname;
  const lastname = lastNameParts.join(' ');
  if (lastname) properties.lastname = lastname;
  if (submission.company) properties.company = submission.company;
  properties.message = [
    submission.service ? `Service: ${submission.service}` : '',
    submission.message,
  ].filter(Boolean).join('\n\n');

  const existing = await hubspotRequest<{ results?: HubSpotContact[] }>(
    `/crm/objects/${HUBSPOT_CRM_API_VERSION}/0-1/search`,
    env.HUBSPOT_ACCESS_TOKEN,
    {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: submission.email }] }],
        properties: ['email'],
        limit: 1,
      }),
    },
  );

  const contact = existing.results?.[0]
    ? await hubspotRequest<HubSpotContact>(
        `/crm/objects/${HUBSPOT_CRM_API_VERSION}/0-1/${encodeURIComponent(existing.results[0].id)}`,
        env.HUBSPOT_ACCESS_TOKEN,
        { method: 'PATCH', body: JSON.stringify({ properties }) },
      )
    : await hubspotRequest<HubSpotContact>(
        `/crm/objects/${HUBSPOT_CRM_API_VERSION}/0-1`,
        env.HUBSPOT_ACCESS_TOKEN,
        { method: 'POST', body: JSON.stringify({ properties }) },
      );

}

async function verifyTurnstile(token: string, secret: string, request: Request): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function sendEmailNotification(env: Env, submission: {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}): Promise<void> {
  const accessKey = env.WEB3FORMS_ACCESS_KEY ?? env.PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: 'New project inquiry — jpclow.dev',
        from_name: submission.name,
        email: submission.email,
        company: submission.company,
        service: submission.service,
        message: submission.message,
      }),
    });

    if (!response.ok) console.error(`Web3Forms notification failed (${response.status})`);
  } catch {
    console.error('Web3Forms notification could not be sent');
  }
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return json({ success: false }, 403);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ success: false }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 16_000) return json({ success: false }, 413);

  let payload: ContactSubmission;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 16_000) return json({ success: false }, 413);
    payload = JSON.parse(rawBody) as ContactSubmission;
  } catch {
    return json({ success: false }, 400);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json({ success: false }, 400);
  }

  // Silently accept the honeypot to avoid teaching bots how the filter works.
  if (text(payload.botcheck, 100)) return json({ success: true });

  const submission = {
    name: text(payload.name, 160),
    email: text(payload.email, 254).toLowerCase(),
    company: text(payload.company, 160),
    service: text(payload.service, 160),
    message: text(payload.message, 10_000),
  };
  const turnstileToken = text(payload.turnstileToken, 2_048);

  if (
    !submission.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) ||
    submission.message.length < 10
  ) {
    return json({ success: false }, 400);
  }

  if (!env.HUBSPOT_ACCESS_TOKEN) {
    console.error('Contact form integration is missing required secrets');
    return json({ success: false }, 503);
  }

  try {
    if (env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) return json({ success: false }, 400);
      const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, request);
      if (!verified) return json({ success: false, code: 'turnstile_failed' }, 403);
    }

    await saveInquiry(env, submission);
    await sendEmailNotification(env, submission);
    return json({ success: true });
  } catch {
    console.error('Contact form submission could not be saved to HubSpot');
    return json({ success: false }, 502);
  }
}
