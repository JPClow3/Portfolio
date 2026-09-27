import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const compressibleTypes = /^(text\/|application\/(javascript|json|manifest\+json|xml)|image\/svg\+xml)/;

// Mirrors public/_headers so local audits see production caching
function cacheControlFor(pathname) {
  if (pathname.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (/^\/(projects|brand)\/.+\.[a-z0-9]+$/i.test(pathname)) return 'public, max-age=604800, stale-while-revalidate=86400';
  if (pathname.startsWith('/open-graph/')) return 'public, max-age=86400, stale-while-revalidate=604800';
  return 'public, max-age=0, must-revalidate';
}

const port = Number(process.env.PLAYWRIGHT_PORT || 4410);
const distDir = path.resolve(process.cwd(), 'dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  let filePath = path.join(distDir, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath)) {
    const notFoundPath = path.join(distDir, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFoundPath).pipe(res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': cacheControlFor(pathname),
  };

  // Compress text responses like Cloudflare Pages does in production
  const acceptEncoding = String(req.headers['accept-encoding'] ?? '');
  const stream = fs.createReadStream(filePath);
  if (compressibleTypes.test(contentType) && /\bbr\b/.test(acceptEncoding)) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'br', Vary: 'Accept-Encoding' });
    stream.pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res);
    return;
  }
  if (compressibleTypes.test(contentType) && /\bgzip\b/.test(acceptEncoding)) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
    stream.pipe(zlib.createGzip()).pipe(res);
    return;
  }

  res.writeHead(200, headers);
  stream.pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server running on http://127.0.0.1:${port}`);
});
