const firebaseApiKey = 'AIzaSyA6SOxcrHh2eF0h0WRGl-yrxTU0LR9o6tQ';
const adminEmail = 'anonymour2905@gmail.com';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

async function authenticatedAdmin(request) {
  const authorization = request.headers.get('Authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return false;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token })
  });
  if (!response.ok) return false;
  const account = (await response.json()).users?.[0];
  return account?.emailVerified === true && account.email?.toLowerCase() === adminEmail;
}

export async function onRequestGet({ env }) {
  const content = await env.CONTENT_STORE.get('site');
  if (!content) return json({ message: 'No published content yet' }, 404);
  return new Response(content, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export async function onRequestPut({ env, request }) {
  if (!(await authenticatedAdmin(request))) return json({ message: 'บัญชีผู้ใช้ไม่มีสิทธิ์บันทึก' }, 403);
  const body = await request.text();
  if (body.length > 5_000_000) return json({ message: 'ข้อมูลมีขนาดใหญ่เกินไป' }, 413);
  let content;
  try { content = JSON.parse(body); }
  catch { return json({ message: 'ข้อมูล JSON ไม่ถูกต้อง' }, 400); }
  if (!content || Array.isArray(content) || typeof content !== 'object') return json({ message: 'ข้อมูลหลักต้องเป็น object' }, 400);
  await env.CONTENT_STORE.put('site', JSON.stringify(content));
  return json({ ok: true });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: { Allow: 'GET, PUT, OPTIONS' } });
}
