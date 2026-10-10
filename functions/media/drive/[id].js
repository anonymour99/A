const mimeByExtension = {
  mov: 'video/quicktime',
  mp4: 'video/mp4',
  webm: 'video/webm',
  m4v: 'video/x-m4v'
};

function videoType(disposition, upstreamType) {
  const fileName = disposition.match(/filename\*?=(?:UTF-8''|\")?([^";]+)/i)?.[1] || '';
  const extension = decodeURIComponent(fileName).match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  return mimeByExtension[extension] || (upstreamType?.startsWith('video/') ? upstreamType : 'video/mp4');
}

export async function onRequest({ params, request }) {
  const id = String(params.id || '');
  if (!/^[\w-]{10,}$/.test(id) || !['GET', 'HEAD'].includes(request.method)) return new Response('Not found', { status: 404 });

  const source = new URL('https://drive.google.com/uc');
  source.searchParams.set('export', 'download');
  source.searchParams.set('id', id);
  const requestHeaders = new Headers();
  const range = request.headers.get('Range');
  if (range) requestHeaders.set('Range', range);

  const upstream = await fetch(source, { method: request.method, headers: requestHeaders, redirect: 'follow' });
  if (!upstream.ok && upstream.status !== 206) return new Response('Video unavailable', { status: upstream.status });

  const headers = new Headers();
  for (const name of ['Accept-Ranges', 'Content-Length', 'Content-Range', 'ETag', 'Last-Modified']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('Content-Type', videoType(upstream.headers.get('Content-Disposition') || '', upstream.headers.get('Content-Type') || ''));
  headers.set('Content-Disposition', 'inline');
  headers.set('Cache-Control', 'public, max-age=3600');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
}
