import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const origin = 'https://jpclow.dev';
const host = new URL(origin).host;
const key = readFileSync(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8').trim();
const keyLocation = `${origin}/indexnow-key.txt`;
const head = process.env.HEAD_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const before = process.env.BEFORE_SHA;

function changedFiles() {
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

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'JPCLOW IndexNow/1.0' }, cache: 'no-store' });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

const files = changedFiles();
if (!files.length) {
  console.log('No changed files to submit.');
  process.exit(0);
}

const sitemap = await fetchText(`${origin}/sitemap-0.xml`);
const allUrls = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const urls = urlsForFiles(files, allUrls);
if (!urls.length) {
  console.log('No indexable URLs changed.');
  process.exit(0);
}

let deployed = false;
for (let attempt = 0; attempt < 20; attempt++) {
  try {
    const publishedSha = (await fetchText(`${origin}/build-sha.txt?check=${Date.now()}`)).trim();
    const publishedKey = (await fetchText(`${keyLocation}?check=${Date.now()}`)).trim();
    if (publishedSha === head && publishedKey === key) {
      deployed = true;
      break;
    }
  } catch (error) {
    console.log(`Waiting for deployment: ${error.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 15_000));
}
if (!deployed) throw new Error(`Deployment ${head} or IndexNow key is not public yet.`);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});
if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected ${urls.length} URLs: HTTP ${response.status} ${await response.text()}`);
}
console.log(`IndexNow accepted ${urls.length} changed URLs (HTTP ${response.status}).`);
for (const url of urls) console.log(url);
