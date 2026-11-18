import http from 'node:http';
import { createReviewsApi } from './reviews-api.mjs';
import { watch, createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 5501);
const clients = new Set();
const reviewsApi = createReviewsApi(root);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const reload = `<script>const previewEvents=new EventSource('/__preview_events');previewEvents.onmessage=()=>location.reload();</script>`;

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/reviews') { await reviewsApi(req, res); return; }
    if (pathname === '/__preview_events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write(': connected\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    const relative = pathname.replace(/^\/+/, '') || 'index.html';
    const filename = path.resolve(root, relative);
    const parts = path.relative(root, filename).split(path.sep);
    if (parts[0] === '..' || path.isAbsolute(path.relative(root, filename)) || parts.some(p => p.startsWith('.') || ['node_modules', 'scripts', 'supabase'].includes(p))) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const extension = path.extname(filename).toLowerCase();
    if (!types[extension]) { res.writeHead(404).end('Not found'); return; }
    const info = await stat(filename);
    if (!info.isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[extension], 'Cache-Control': 'no-store' });
    if (extension === '.html') {
      const html = await readFile(filename, 'utf8');
      res.end(html.includes('</body>') ? html.replace('</body>', `${reload}</body>`) : html + reload);
    } else {
      const stream = createReadStream(filename);
      stream.on('error', () => res.destroy());
      stream.pipe(res);
    }
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end('Not found');
  }
});

let timer;
function refresh() {
  clearTimeout(timer);
  timer = setTimeout(() => { for (const client of clients) client.write('data: reload\n\n'); }, 150);
}
// Watch only the HTML site, without traversing dependencies or private files.
const watchers = [watch(root, (_, name) => {
  if (name && /\.(html|css|js)$/i.test(name)) refresh();
}), watch(path.join(root, 'assets'), { recursive: true }, refresh)];
const heartbeat = setInterval(() => { for (const client of clients) client.write(': heartbeat\n\n'); }, 20000);
server.on('error', error => { console.error(`Preview failed: ${error.message}`); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`Globaxify live preview: http://localhost:${port}\nSave an HTML, CSS or JS file to refresh the browser. Stop with Ctrl+C.`));
process.on('SIGINT', () => {
  clearInterval(heartbeat);
  clearTimeout(timer);
  for (const watcher of watchers) watcher.close();
  for (const client of clients) client.end();
  server.close();
});
