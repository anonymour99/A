import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const types = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8' };
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    let path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (path === '/') path = '/index.html';
    if (path === '/admin' || path === '/admin/') path = '/admin.html';
    if (!/^\/[a-z][a-z0-9-]*\.(html|css|js)$/.test(path)) {
      response.writeHead(404).end('Not found');
      return;
    }
    const body = await readFile(new URL(`.${path}`, import.meta.url));
    response.writeHead(200, {
      'Content-Type': types[path.split('.').pop()],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Page unavailable');
  }
});
server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
server.listen(4173, '127.0.0.1', () => console.log('Anonymour preview: http://127.0.0.1:4173/'));
