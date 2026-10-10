// Share one URL between the CMS, the embedded board, and the external link.
export function notionQueueLinks(value) {
  const url = new URL(String(value || '').trim());
  const supported = ['notion.site', 'notion.so'].some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  if (url.protocol !== 'https:' || !supported || url.username || url.password || url.port) {
    throw new Error('กรุณาใช้ลิงก์ HTTPS ของหน้า Notion ที่เผยแพร่แล้ว (notion.site หรือ notion.so)');
  }
  const publicUrl = new URL(url.href);
  publicUrl.pathname = publicUrl.pathname.replace(/^\/ebd\//, '/');
  const embedUrl = new URL(url.href);
  if (!embedUrl.pathname.startsWith('/ebd/')) {
    const id = embedUrl.pathname.match(/([a-f\d]{32}|[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12})\/?$/i)?.[1];
    if (!id) throw new Error('กรุณาคัดลอกลิงก์จาก Embed this page ใน Notion');
    embedUrl.pathname = `/ebd/${id.replaceAll('-', '')}`;
  }
  return { publicUrl: publicUrl.href, embedUrl: embedUrl.href };
}
