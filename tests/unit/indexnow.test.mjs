import { describe, expect, it, vi } from 'vitest';
import { submitIndexNow } from '../../scripts/submit-indexnow.mjs';

const urls = ['https://jpclow.dev/', 'https://jpclow.dev/pt/contact/'];
const sitemap = `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;
const input = {
  head: 'new-commit',
  key: 'test-public-key',
  files: ['src/styles/global.css'],
  fetchOrigin: 'https://portfolio-44w.pages.dev',
};

async function deployedFetch(url, options) {
  if (url === 'https://api.indexnow.org/indexnow') return new Response('', { status: 202 });
  const request = new URL(url);
  if (request.origin !== input.fetchOrigin) throw new Error('CI must read artifacts from the production Pages hostname.');
  if (request.pathname === '/build-sha.txt') return new Response(`${input.head}\n`);
  if (request.pathname === '/indexnow-key.txt') return new Response(`${input.key}\n`);
  if (request.pathname === '/sitemap-0.xml') return new Response(sitemap);
  throw new Error(`Unexpected request: ${url}`);
}

describe('IndexNow production notification', () => {
  it('reads artifacts via Pages but submits only canonical URLs and keyLocation', async () => {
    const fetchImpl = vi.fn(deployedFetch);
    await submitIndexNow({ ...input, fetchImpl });

    const [, options] = fetchImpl.mock.calls.find(([, options]) => options?.method === 'POST');
    expect(JSON.parse(options.body)).toEqual({
      host: 'jpclow.dev',
      key: input.key,
      keyLocation: 'https://jpclow.dev/indexnow-key.txt',
      urlList: urls,
    });
  });

  it('waits for the matching commit before reading the sitemap or notifying IndexNow', async () => {
    const fetchImpl = vi.fn(deployedFetch).mockResolvedValueOnce(new Response('old-commit'));
    const wait = vi.fn();
    await submitIndexNow({ ...input, fetchImpl, wait });

    expect(wait).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls.map(([url]) => new URL(url).pathname)).toEqual([
      '/build-sha.txt', '/build-sha.txt', '/indexnow-key.txt', '/sitemap-0.xml', '/indexnow',
    ]);
  });

  it('retries a transient sitemap failure after deployment readiness', async () => {
    let sitemapReads = 0;
    const fetchImpl = vi.fn((url, options) => {
      if (new URL(url).pathname === '/sitemap-0.xml' && sitemapReads++ === 0) {
        return Promise.resolve(new Response('Challenge', { status: 403 }));
      }
      return deployedFetch(url, options);
    });
    const wait = vi.fn();
    await submitIndexNow({ ...input, fetchImpl, wait });
    expect(wait).toHaveBeenCalledOnce();
    expect(sitemapReads).toBe(2);
    expect(fetchImpl.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  });

  it('does not submit when the published key is wrong, and stops retrying', async () => {
    const fetchImpl = vi.fn((url, options) => new URL(url).pathname === '/indexnow-key.txt'
      ? Promise.resolve(new Response('wrong-key'))
      : deployedFetch(url, options));
    const wait = vi.fn();

    await expect(submitIndexNow({ ...input, fetchImpl, wait, attempts: 2 })).rejects.toThrow('not public yet');
    expect(wait).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls.some(([url]) => new URL(url).pathname === '/sitemap-0.xml')).toBe(false);
    expect(fetchImpl.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });

  it.each([
    '<html>Not a sitemap</html>',
    '<urlset><url><loc>https://portfolio-44w.pages.dev/</loc></url></urlset>',
  ])('does not submit an empty or noncanonical sitemap: %s', async (body) => {
    const fetchImpl = vi.fn((url, options) => new URL(url).pathname === '/sitemap-0.xml'
      ? Promise.resolve(new Response(body))
      : deployedFetch(url, options));
    await expect(submitIndexNow({ ...input, fetchImpl, attempts: 1 })).rejects.toThrow('not public yet');
    expect(fetchImpl.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });

  it('keeps an IndexNow API rejection as a failure', async () => {
    const fetchImpl = vi.fn((url, options) => options?.method === 'POST'
      ? Promise.resolve(new Response('Rejected', { status: 403 }))
      : deployedFetch(url, options));
    await expect(submitIndexNow({ ...input, fetchImpl })).rejects.toThrow('IndexNow rejected 2 URLs: HTTP 403');
  });
});
