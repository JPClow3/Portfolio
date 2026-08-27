import { describe, it, expect } from 'vitest';
import worker, { type Env } from '../../workers/observability/src/index';

describe('Observability Cloudflare Worker', () => {
  const mockEnv: Env = {
    ALLOWED_ORIGINS: 'https://jpclow.dev,http://localhost:4321',
  };

  const mockCtx = {
    waitUntil: (promise: Promise<unknown>) => promise,
    passThroughOnException: () => {},
  } as any;

  it('handles CORS preflight OPTIONS requests', async () => {
    const request = new Request('https://telemetry.example.com/', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://jpclow.dev',
      },
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://jpclow.dev');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('returns health status on GET /health', async () => {
    const request = new Request('https://telemetry.example.com/health', {
      method: 'GET',
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('healthy');
    expect(body.version).toBe('1.0.0');
    expect(typeof body.kvConfigured).toBe('boolean');
  });

  it('ingests valid Web Vitals telemetry payload on POST /', async () => {
    const payload = {
      type: 'web-vital',
      timestamp: new Date().toISOString(),
      path: '/blog/hello-world',
      name: 'LCP',
      value: 1200,
    };

    const request = new Request('https://telemetry.example.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://jpclow.dev',
      },
      body: JSON.stringify(payload),
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(202);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.id).toBeTruthy();
  });

  it('ingests runtime-error payloads on POST /', async () => {
    const payload = {
      type: 'runtime-error',
      timestamp: new Date().toISOString(),
      path: '/projects/hefesto',
      message: 'Uncaught TypeError: Cannot read properties of undefined',
      source: 'https://jpclow.dev/_astro/entry.js',
      line: 42,
      column: 15,
    };

    const request = new Request('https://telemetry.example.com/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(202);

    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it('rejects invalid payload without type on POST /', async () => {
    const payload = {
      foo: 'bar',
    };

    const request = new Request('https://telemetry.example.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toContain('Invalid payload');
  });

  it('protects GET /stats with AUTH_TOKEN when configured', async () => {
    const envWithAuth: Env = {
      ...mockEnv,
      AUTH_TOKEN: 'secret-token-123',
    };

    const unauthorizedReq = new Request('https://telemetry.example.com/stats', {
      method: 'GET',
    });
    const unauthResponse = await worker.fetch(unauthorizedReq, envWithAuth, mockCtx);
    expect(unauthResponse.status).toBe(401);

    const authorizedReq = new Request('https://telemetry.example.com/stats', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer secret-token-123',
      },
    });
    const authResponse = await worker.fetch(authorizedReq, envWithAuth, mockCtx);
    expect(authResponse.status).toBe(200);
  });
});
