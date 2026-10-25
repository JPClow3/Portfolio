// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { onRequestPost } from '../../functions/api/contact';

afterEach(() => vi.unstubAllGlobals());
const submit = (context: Record<string, unknown> = {}) => onRequestPost({
  request: new Request('https://jpclow.dev/api/contact', {
    method: 'POST', headers: { Origin: 'https://jpclow.dev', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Client', email: 'test@example.test', service: 'API integrations', message: 'A sufficiently detailed test inquiry.', ...context }),
  }),
  env: { HUBSPOT_ACCESS_TOKEN: 'test-token', WEB3FORMS_ACCESS_KEY: 'test-key' },
});

describe('inquiry context reaches HubSpot and the optional notification', () => {
  it.each([false, true])('saves known context when updating an existing contact: %s', async existing => {
    const calls: { url: string; body: any; method?: string }[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)), method: init.method });
      return Response.json(url.endsWith('/search') ? { results: existing ? [{ id: '123' }] : [] } : { id: '123', success: true });
    }));
    expect((await submit({ project: 'agrohub', engagement: 'consulting' })).status).toBe(200);
    expect(calls[1].method).toBe(existing ? 'PATCH' : 'POST');
    expect(calls[1].body.properties.message).toContain('Related project: agrohub');
    expect(calls[1].body.properties.message).toContain('Engagement: consulting');
    expect(calls[2].body).toMatchObject({ project: 'agrohub', engagement: 'consulting' });
  });
  it('drops unknown context before it reaches the CRM', async () => {
    const calls: any[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      calls.push(JSON.parse(String(init.body)));
      return Response.json(url.endsWith('/search') ? { results: [] } : { id: '123', success: true });
    }));
    await submit({ project: 'unknown-project', engagement: '<script>' });
    expect(JSON.stringify(calls)).not.toMatch(/unknown-project|<script>/);
  });
  it('does not acknowledge success if the CRM write fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    const result = await submit();
    expect(result.status).toBe(502);
    expect(await result.json()).toEqual({ success: false });
  });
  it('keeps both Pages Functions reachable when custom routing is enabled', () => {
    const routes = JSON.parse(readFileSync(new URL('../../public/_routes.json', import.meta.url), 'utf8'));
    expect(routes.include).toEqual(expect.arrayContaining(['/api/contact', '/api/events']));
  });
});
