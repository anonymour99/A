const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function commissionMedia(value) {
  if (!value) return null;
  let url;
  try { url = new URL(value); } catch { throw new Error('กรุณาใส่ลิงก์ YouTube หรือไฟล์ MP4 / WebM ที่ถูกต้อง'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('ลิงก์วิดีโอต้องใช้ https://');
  const host = url.hostname.toLowerCase();
  const youtube = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'];
  let id;
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (youtube.includes(host)) {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
  }
  if (host === 'youtu.be' || youtube.includes(host)) {
    if (!/^[\w-]{11}$/.test(id || '')) throw new Error('ลิงก์ YouTube ต้องเป็นวิดีโอ ไม่ใช่ช่องหรือเพลย์ลิสต์');
    return { type: 'youtube', url: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
  }
  if (!/\.(mp4|webm)$/i.test(url.pathname)) throw new Error('รองรับลิงก์ YouTube หรือไฟล์ .mp4 / .webm เท่านั้น');
  return { type: 'video', url: url.href };
}

export function commissionVideoHtml(item) {
  let media;
  try { media = commissionMedia(item.video || (item.youtubeId ? `https://youtu.be/${item.youtubeId}` : '')); }
  catch { return ''; }
  if (!media) return '';
  const title = escapeHtml(item.title || 'Commission video');
  const url = escapeHtml(media.url);
  return `<div class="commission-media">${media.type === 'youtube'
    ? `<iframe src="${url}" title="${title}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    : `<video src="${url}" aria-label="${title}" controls playsinline preload="metadata">Your browser does not support video.</video>`}</div>`;
}

export function commissionFileType(file) {
  if (!file) throw new Error('กรุณาเลือกไฟล์วิดีโอ');
  const extension = file.name.match(/\.(mp4|webm)$/i)?.[1].toLowerCase();
  const type = extension && `video/${extension}`;
  if (!type || (file.type && file.type !== type)) throw new Error('รองรับไฟล์ MP4 และ WebM เท่านั้น');
  if (!file.size || file.size > 100 * 1024 * 1024) throw new Error('ไฟล์ต้องมีขนาดมากกว่า 0 และไม่เกิน 100 MB');
  return { extension, type };
}
