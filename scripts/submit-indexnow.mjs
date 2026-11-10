import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const origin = 'https://jpclow.dev';
const host = new URL(origin).host;
const keyLocation = `${origin}/indexnow-key.txt`;

function changedFiles(head, before) {
  let base = before;
  if (!base || /^0+$/.test(base)) {
    base = execFileSync('git', ['rev-list', '-1', '--before=48 hours ago', head], { encoding: 'utf8' }).trim();
  }
  if (!base) return [];
  return execFileSync('git', ['diff', '--name-only', `${base}..${head}`], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
}

function urlsForFiles(files, allUrls) {
  const urls = new Set();
  let allPagesChanged = false;
  for (const file of files) {
    const project = file.match(/^src\/content\/projects\/(?:(pt)\/)?([^/]+)\.md$/);
    if (project) {
      urls.add(`${origin}/${project[1] ? 'pt/' : ''}projects/${project[2]}/`);
      continue;
    }
    const blog = file.match(/^src\/content\/blog\/(?:(pt)\/)?([^/]+)\.mdx?$/);
    if (blog) {
      urls.add(`${origin}/${blog[1] ? 'pt/' : ''}blog/${blog[2]}/`);
      continue;
    }
    const projectImage = file.match(/^public\/projects\/([^/.]+)\.[^/]+$/);
    if (projectImage) {
      urls.add(`${origin}/projects/${projectImage[1]}/`);
      urls.add(`${origin}/pt/projects/${projectImage[1]}/`);
      continue;
    }
    if (/^src\/(pages|components|layouts|lib|styles)\//.test(file)) allPagesChanged = true;
  }
  if (allPagesChanged) return allUrls;
  return [...urls].filter((url) => allUrls.includes(url));
}

export async function submitIndexNow({
  head,
  files,
  key,
  fetchOrigin = origin,
  fetchImpl = fetch,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  attempts = 20,
}) {
  // Only artifact reads use the Pages hostname. All submitted URLs and keyLocation
  // stay on the canonical site, even when its bot protection challenges CI runners.
  const artifactOrigin = new URL(fetchOrigin).origin;
  async function fetchText(path) {
    const url = `${artifactOrigin}${path}?check=${Date.now()}`;
    const response = await fetchImpl(url, {
      headers: { 'user-agent': 'JPCLOW IndexNow/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.text();
  }

  let allUrls;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const publishedSha = (await fetchText('/build-sha.txt')).trim();
      if (publishedSha !== head) throw new Error(`Production still serves ${publishedSha}, waiting for ${head}.`);
      const publishedKey = (await fetchText('/indexnow-key.txt')).trim();
      if (publishedKey !== key) throw new Error('The published IndexNow key does not match the repository key.');

      // Read the sitemap only after this commit is deployed, and retry transient
      // artifact failures through the same bounded deployment wait.
      const sitemap = await fetchText('/sitemap-0.xml');
      const publishedUrls = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
      if (!publishedUrls.length || publishedUrls.some((url) => new URL(url).origin !== origin)) {
        throw new Error('The published sitemap must contain canonical jpclow.dev URLs.');
      }
      allUrls = publishedUrls;
      break;
    } catch (error) {
      console.log(`Waiting for deployment: ${error.message}`);
    }
    if (attempt + 1 < attempts) await wait(15_000);
  }
  if (!allUrls) throw new Error(`Deployment ${head} or its IndexNow artifacts at ${artifactOrigin} are not public yet.`);

  const urls = urlsForFiles(files, allUrls);
  if (!urls.length) {
    console.log('No indexable URLs changed.');
    return;
  }

  const response = await fetchImpl('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
    signal: AbortSignal.timeout(15_000),
  });
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow rejected ${urls.length} URLs: HTTP ${response.status} ${await response.text()}`);
  }
  console.log(`IndexNow accepted ${urls.length} changed URLs (HTTP ${response.status}).`);
  for (const url of urls) console.log(url);
}

async function main() {
  const head = process.env.HEAD_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const files = changedFiles(head, process.env.BEFORE_SHA);
  if (!files.length) {
    console.log('No changed files to submit.');
    return;
  }
  const key = readFileSync(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8').trim();
  await submitIndexNow({ head, files, key, fetchOrigin: process.env.INDEXNOW_FETCH_ORIGIN || origin });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
