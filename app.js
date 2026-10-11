import { notionQueueLinks } from './notion-queue.js';
import { commissionVideoHtml } from './commission-media.js';

const sourceUrl = window.ANONYMOUR_SOURCE_URL || 'https://anonymour.carrd.co/';

export const fallbackContent = {
  status: 'STATUS : OPEN',
  music: { title: '', artist: '', url: '' },
  musicPlaylist: [],
  characterSheet: { title: 'OC Character Sheet', image: 'https://anonymour.carrd.co/assets/images/image01.jpg?v=f1c65cb3' },
  queue: {
    title: 'Commission queue',
    details: 'เช็กคิวและความคืบหน้าล่าสุดได้จากบอร์ด Notion ค่ะ',
    status: 'อัปเดตบน Notion',
    url: 'https://tartan-lettuce-a11.notion.site/Commission-queue-ba3921cc5e72830bbbc18147ef988254'
  },
  commission: [
    { category: 'LIVE2D · RIGGING', title: 'Full body rigging', details: 'Live2D rigging full body · ระยะเวลาประมาณ 7–30 วัน', price: '8,000', symbol: '✳' },
    { category: 'YCH · DRAW + RIG', title: 'Milky Class YCH', details: 'ระยะเวลาวาดและริกประมาณ 7–14 วัน · ไม่รับงาน 18+', price: '2,200', symbol: '♡' }
  ],
  addons: [
    ['Face expression', 'เริ่มต้น 500 ฿'], ['Mouth shrug', 'เริ่มต้น 1,000 ฿'], ['Puff cheeks', 'เริ่มต้น 1,000 ฿'], ['Tough out', 'เริ่มต้น 2,000 ฿'], ['Ears', 'เริ่มต้น 2,000 ฿'], ['Tail', 'เริ่มต้น 2,000 ฿'], ['Wings', 'เริ่มต้น 2,000 ฿'], ['Idle animation', 'เริ่มต้น 500 ฿'], ['Pose (toggle)', 'เริ่มต้น 1,000 ฿'], ['Pose (animation)', 'เริ่มต้น 1,000 ฿'], ['Add hairstyle', 'เริ่มต้น 2,000 ฿'], ['Add outfit', 'เริ่มต้น 3,000 ฿']
  ],
  gallery: [
    { title: 'Timeline 122', category: 'rigging', tag: 'LIVE2D RIGGING', icon: '☾', mid: '#82619b', deep: '#282035', driveId: '1GWLnvvH22RAXgl8G6mlUFQMuB7EpghGG', image: 'https://drive.google.com/thumbnail?id=1GWLnvvH22RAXgl8G6mlUFQMuB7EpghGG&sz=w1000', description: 'Live2D rigging showcase · วิดีโอต้นฉบับจาก Carrd' },
    { title: 'Shimiya · YCH chibi', category: 'rigging', tag: 'YCH · RIGGING', icon: '✦', mid: '#9076ad', deep: '#241c31', youtubeId: 'Fg7ybIbNNcI', image: 'https://img.youtube.com/vi/Fg7ybIbNNcI/hqdefault.jpg', description: 'Shimiya (YCH chibi) Showcase · วิดีโอต้นฉบับจาก Carrd' },
    { title: 'Resia Remynell', category: 'rigging', tag: 'LIVE2D RIGGING', icon: '♡', mid: '#ab6d91', deep: '#312035', youtubeId: '4RzT7WVDYys', image: 'https://img.youtube.com/vi/4RzT7WVDYys/hqdefault.jpg', description: '[Live2D Showcase] Resia Remynell · วิดีโอต้นฉบับจาก Carrd' },
    { title: 'Loading screen', category: 'motion', tag: 'LOADING SCREEN', icon: '✳', mid: '#786aaf', deep: '#1d2034', driveId: '1QIGffFgsn4MKq5gL5ehOe80Upg_sn5n6', image: 'https://drive.google.com/thumbnail?id=1QIGffFgsn4MKq5gL5ehOe80Upg_sn5n6&sz=w1000', description: 'Video Project 1 · motion sample จาก Carrd' },
    { title: 'Emote animation', category: 'art', tag: 'EMOTE', icon: '☁', mid: '#bd8db1', deep: '#322137', driveId: '1ppTwvyulkMOL4zU2ACbXcTfybxztoRi-', image: 'https://drive.google.com/thumbnail?id=1ppTwvyulkMOL4zU2ACbXcTfybxztoRi-&sz=w1000', description: 'Emote animation · วิดีโอต้นฉบับจาก Carrd' },
    { title: 'Idle animation', category: 'motion', tag: 'PNG / GIF TUBER', icon: '☆', mid: '#9d77ae', deep: '#282036', driveId: '1FniSF-RlJBvDCarOsl-ROW1T00op7n2c', image: 'https://drive.google.com/thumbnail?id=1FniSF-RlJBvDCarOsl-ROW1T00op7n2c&sz=w1000', description: 'PNG/GIF Tuber idle animation · วิดีโอต้นฉบับจาก Carrd' }
  ],
  terms: [
    { title: 'การชำระเงิน', icon: '💰', body: 'ราคาที่ระบุ รวมสิทธิ์เชิงพาณิชย์ (Commercial Use) แล้ว\nมัดจำ 50% เพื่อยืนยันและล็อกคิว ก่อนเริ่มงาน\nสามารถผ่อนชำระได้สูงสุด 3 เดือน โดยต้องชำระตามกำหนดที่ตกลงกัน หากชำระล่าช้ากว่ากำหนด จะมีค่าธรรมเนียมเพิ่มเติม 20% ของราคางานต่อเดือน\nในกรณียกเลิกงานหลังจากยืนยันคิวและเริ่มดำเนินงานแล้ว ขอสงวนสิทธิ์ไม่คืนเงินมัดจำในทุกกรณี 🙏' },
    { title: 'คิว & ระยะเวลาการทำงาน', icon: '📅', body: 'ระยะเวลาการทำงานขึ้นอยู่กับความซับซ้อนของโมเดลและรายละเอียดที่ต้องการ\nระยะเวลาที่แจ้งเป็นเพียงการประมาณการ อาจมีการเปลี่ยนแปลงตามลำดับคิวและความซับซ้อนของงาน กรุณาแจ้ง Deadline ที่ต้องการก่อนยืนยันคิวเพื่อให้สามารถประเมินระยะเวลาได้\nหากมีสิ่งที่ต้องการเป็นพิเศษสำหรับการใช้งานโมเดล กรุณาแจ้งก่อนเริ่มงาน' },
    { title: 'ไฟล์สำหรับ Rigging', icon: '📁', body: 'กรุณาเตรียมไฟล์สำหรับ Rigging ดังนี้\nส่งไฟล์ PSD ที่พร้อมสำหรับการ Rigging\nแยกเลเยอร์และชิ้นส่วนที่ต้องการให้ขยับอย่างเหมาะสม\nตั้งชื่อเลเยอร์เป็นภาษาอังกฤษ\nหากไฟล์มีปัญหา / เลเยอร์ไม่ถูกต้อง / ต้องจัดระเบียบหรือแยกไฟล์ใหม่ก่อนเริ่ม Rigging\n→ มีค่าจัดไฟล์เพิ่มเติม 500 บาท\nหากต้องการให้ช่วยแก้ไขหรือเตรียมไฟล์นอกเหนือจากขอบเขตที่กำหนด กรุณาสอบถามก่อนเริ่มงาน\nแนะนำ: ควรตรวจสอบ PSD ให้เรียบร้อยก่อนส่ง เพื่อช่วยลดระยะเวลาและค่าใช้จ่ายเพิ่มเติม' },
    { title: 'Reference & Brief', icon: '📝', body: 'สามารถส่ง Reference / ตัวอย่างการขยับ / วิดีโอ / โมเดลตัวอย่าง ที่ต้องการมาให้ดูก่อนเริ่มงานได้\nReference จะใช้เป็นแนวทางในการ Rigging เท่านั้น และไม่สามารถรับประกันว่าจะเหมือนต้นฉบับ 100%\nกรุณาแจ้งรายละเอียดหรือฟังก์ชันที่ต้องการเป็นพิเศษก่อนเริ่มงาน หากมีการเพิ่มรายละเอียดหรือฟังก์ชันใหม่หลังเริ่มงาน อาจมีค่าใช้จ่ายเพิ่มเติม' },
    { title: 'ไฟล์งาน & ลิขสิทธิ์', icon: '🔐', body: 'ไฟล์ที่ส่งมอบให้ลูกค้าจะเป็นไฟล์สำหรับใช้งานโมเดลตามขอบเขตที่ตกลงกัน\nการนำไฟล์ Rigging ไปดัดแปลง แก้โครงสร้าง หรือใช้ในลักษณะที่ละเมิดข้อตกลง ขอสงวนสิทธิ์ดำเนินการตามกฎหมาย\nหากต้องการรับไฟล์ .cmo3 (ไฟล์สำหรับริก) คิดค่าบริการเพิ่มเติม 3 เท่าของราคางาน' },
    { title: 'Portfolio & Promotion', icon: '📢', body: 'ผลงานทุกชิ้นมีสิทธิ์ถูกนำไปใช้ใน Portfolio และ Social Media ของ Anonymour เพื่อการโปรโมตและแสดงผลงาน\nหากไม่สะดวกให้เผยแพร่ สามารถแจ้งได้ก่อนเริ่มงาน ลูกค้าสามารถแจ้งกำหนดช่วงเวลาที่สะดวกให้เผยแพร่ผลงานได้' },
    { title: 'การแก้ไขงาน', icon: '🎨', body: 'สามารถแก้ไขงานได้ฟรี 2 ครั้งต่อ 1 รอบการอัปเดต\nการแก้ไขเพิ่มเติมจากจำนวนที่กำหนด คิดค่าบริการเริ่มต้นที่ 100 บาท/ครั้ง ขึ้นอยู่กับรายละเอียดของการแก้ไข' },
    { title: 'หลังส่งมอบงาน', icon: '🛠️', body: 'หลังจากได้รับไฟล์งานแล้ว สามารถแจ้งปัญหาหรือขอแก้ไขงานได้ฟรีภายใน 30 วันนับจากวันที่ได้รับไฟล์\nการแก้ไขภายในระยะเวลาดังกล่าวต้องอยู่ในขอบเขตงานเดิมที่ตกลงกัน\nการเพิ่มฟังก์ชันใหม่ เปลี่ยนบรีฟ หรือการแก้ไขที่นอกเหนือจากขอบเขตเดิม อาจมีค่าใช้จ่ายเพิ่มเติม' },
    { title: 'ข้อตกลงเพิ่มเติม', icon: '⚠️', body: 'การเริ่มงานจะถือว่าลูกค้ายอมรับ Terms & Conditions ทั้งหมด\nกรุณาตรวจสอบรายละเอียดงาน ราคา และขอบเขตงานให้เรียบร้อยก่อนยืนยันคิว\nหากมีข้อสงสัยหรือมีความต้องการนอกเหนือจากที่ระบุไว้ สามารถสอบถามได้ก่อนเริ่มงาน ข้อตกลงบางส่วนสามารถปรับเปลี่ยนได้ตามลักษณะของงาน' }
  ],
  socials: [
    ['Discord', sourceUrl], ['Twitch', 'https://twitch.tv/anonymour_'], ['X', 'https://x.com/uranonymour'], ['TikTok', sourceUrl], ['VGen', 'https://vgen.co/anonymour_']
  ]
};

const byId = (id) => document.getElementById(id);
let content = structuredClone(fallbackContent);
let musicPlaylistIndex = 0;
let siteLanguage = localStorage.getItem('anonymour-language') === 'en' ? 'en' : 'th';

function localized(item, key) {
  if (!item) return '';
  return siteLanguage === 'en' ? item[`${key}En`] || item[key] || '' : item[key] || '';
}

const defaultInterfaceText = {
  th: { home: 'หน้าหลัก', commission: 'Commission', queue: 'คิวงาน', gallery: 'My Little Gallery', tos: 'ข้อตกลง', back: '← หน้าแรก', contact: 'ติดต่อจองคิว →', details: 'รายละเอียด', addonName: 'รายการ', addonSupport: 'รองรับ', addonPrice: 'ราคาเริ่มต้น (THB)', addonDetails: 'รายละเอียดเพิ่มเติม', galleryOriginal: 'เปิดแกลเลอรีต้นฉบับ →', language: 'EN' },
  en: { home: 'Home', commission: 'Commission', queue: 'Queue', gallery: 'My Little Gallery', tos: 'Terms', back: '← Home', contact: 'Book a commission →', details: 'Details', addonName: 'Add-on', addonSupport: 'Supports', addonPrice: 'Starting price (THB)', addonDetails: 'More details', galleryOriginal: 'Open original gallery →', language: 'TH' }
};

function currentInterfaceText() {
  const merged = { ...defaultInterfaceText[siteLanguage], ...(content.interfaceText?.[siteLanguage] || {}) };
  Object.keys(merged).forEach((key) => { if (typeof merged[key] === 'string') merged[key] = merged[key].replaceAll('↗', '→'); });
  return merged;
}

function applyInterfaceLanguage() {
  const text = currentInterfaceText();
  document.documentElement.lang = siteLanguage;
  const navLabels = { 'index.html': `⌂ ${text.home}`, 'commission.html': `♡ ${text.commission}`, 'queue.html': `☷ ${text.queue}`, 'gallery.html': `▧ ${text.gallery}`, 'tos.html': `✎ ${text.tos}` };
  document.querySelectorAll('.airy-nav a, .main-nav a').forEach((link) => {
    const file = new URL(link.href, location.href).pathname.split('/').pop() || 'index.html';
    if (navLabels[file]) link.textContent = navLabels[file];
  });
  document.querySelectorAll('.site-footer a:first-child').forEach((node) => { node.textContent = text.back; });
  document.querySelectorAll('.site-footer a:last-child').forEach((node) => { node.textContent = text.contact; });
  document.querySelectorAll('.commission-bottom a').forEach((node) => { node.textContent = text.details; });
  const button = document.querySelector('.language-switch');
  if (button) { button.textContent = text.language; button.setAttribute('aria-label', siteLanguage === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'); }
}

function setupLanguageSwitcher() {
  const nav = document.querySelector('.airy-nav, .main-nav');
  if (!nav || nav.querySelector('.language-switch')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'language-switch';
  button.addEventListener('click', () => {
    siteLanguage = siteLanguage === 'th' ? 'en' : 'th';
    localStorage.setItem('anonymour-language', siteLanguage);
    render();
  });
  nav.append(button);
  applyInterfaceLanguage();
}

function renderCommission(filter = 'all') {
  const list = byId('commission-list');
  if (!list) return;
  const categories = [...new Set(content.commission.map((item) => item.category || 'Commission'))];
  const filters = byId('commission-filters');
  if (filters) filters.innerHTML = `<button class="commission-filter ${filter === 'all' ? 'active' : ''}" data-commission-filter="all">${siteLanguage === 'en' ? 'All' : 'ทั้งหมด'} <span>${String(content.commission.length).padStart(2, '0')}</span></button>${categories.map((category, index) => `<button class="commission-filter ${filter === String(index) ? 'active' : ''}" data-commission-filter="${index}">${escapeText(siteLanguage === 'en' ? content.commission.find((item) => (item.category || 'Commission') === category)?.categoryEn || category : category)}</button>`).join('')}`;
  const rows = filter === 'all' ? content.commission : content.commission.filter((item) => (item.category || 'Commission') === categories[Number(filter)]);
  list.innerHTML = rows.map((item) => {
    const index = content.commission.indexOf(item);
    const image = item.image ? `<img class="commission-image" src="${safeHref(item.image)}" alt="${escapeText(localized(item, 'title'))}" loading="lazy" />` : '';
    return `<article class="commission-card reveal ${image ? 'has-preview' : ''}" data-symbol="${escapeText(item.symbol || '✦')}"><span class="small-index">${String(index + 1).padStart(2, '0')} / ${escapeText(localized(item, 'category'))}</span><div class="commission-card-layout"><div class="commission-card-media">${image}${commissionVideoHtml(item)}</div><div class="commission-card-copy"><h3>${escapeText(localized(item, 'title'))}</h3><p>${escapeText(localized(item, 'details'))}</p><div class="commission-bottom"><div class="price">${escapeText(item.price)} <small>THB</small></div></div></div></div></article>`;
  }).join('');
  observeReveals();
}

function renderGallery(filter = 'all') {
  const grid = byId('gallery-grid');
  if (!grid) return;
  const rows = content.gallery.filter((item) => filter === 'all' || item.category === filter);
  grid.innerHTML = rows.map((item, index) => {
    const media = getMedia(item);
    const image = item.image || media.thumbnail;
    const preview = image
      ? `<img class="work-image" src="${safeHref(image)}" alt="${escapeText(localized(item, 'title'))}" loading="lazy" />`
      : media.type === 'video'
        ? `<video class="work-image" src="${safeHref(media.src)}" muted playsinline preload="metadata"></video>`
        : '';
    return `<article class="work-card reveal" tabindex="0" role="button" aria-label="${siteLanguage === 'en' ? 'Open details' : 'เปิดรายละเอียด'} ${escapeText(localized(item, 'title'))}" data-work="${content.gallery.indexOf(item)}"><div class="work-art ${preview ? 'has-media' : ''}" style="--art-mid:${safeColor(item.mid, '#82619b')};--art-deep:${safeColor(item.deep, '#282035')}" data-icon="${escapeText(item.icon || '▶')}">${preview}${media.type !== 'none' ? '<span class="video-badge">VIDEO</span>' : ''}<span class="art-small top">ANONYMOUR · ${String(index + 1).padStart(2, '0')}</span></div></article>`;
  }).join('');
  observeReveals();
}

function renderAddons() {
  const text = currentInterfaceText();
  const rows = content.addons.map((item) => {
    const label = siteLanguage === 'en'
      ? addonField(item, 2, 'nameEn') || addonField(item, 0, 'name')
      : addonField(item, 0, 'name');
    const price = siteLanguage === 'en'
      ? addonField(item, 3, 'priceEn') || addonField(item, 1, 'price')
      : addonField(item, 1, 'price');
    const support = siteLanguage === 'en'
      ? addonField(item, 5, 'supportEn') || addonField(item, 4, 'support')
      : addonField(item, 4, 'support');
    return [label || '', support || (siteLanguage === 'en' ? 'Ask first' : 'สอบถาม'), price || ''];
  });
  const table = `<div class="addon-table-head"><span>${escapeText(text.addonName)}</span><span>${escapeText(text.addonSupport)}</span><span>${escapeText(text.addonPrice)}</span></div>${rows.map(([label, support, price]) => `<div class="addon-table-row"><span>${escapeText(label)}</span><em>${escapeText(support)}</em><b>${escapeText(price)}</b></div>`).join('')}`;
  const list = byId('addons-list');
  if (list) list.innerHTML = table;
  const preview = byId('addons-preview');
  if (preview) preview.innerHTML = table;
}

function addonField(item, arrayIndex, objectKey) {
  if (Array.isArray(item)) return item[arrayIndex] || '';
  return item && typeof item === 'object' ? item[objectKey] || '' : '';
}

function renderTerms() {
  const list = byId('tos-list');
  if (list) list.innerHTML = content.terms.map((item, index) => `<article class="tos-item open"><button class="tos-trigger" aria-expanded="true" aria-controls="term-${index}"><span class="tos-number">${escapeText(item.icon || String(index + 1).padStart(2, '0'))}</span><span class="tos-title">${escapeText(localized(item, 'title'))}</span><span class="tos-icon">＋</span></button><div class="tos-body" id="term-${index}"><div class="tos-body-inner"><p>${escapeText(localized(item, 'body'))}</p></div></div></article>`).join('');
}

function renderSocials() {
  const links = byId('social-links');
  if (links) links.innerHTML = content.socials.map((item) => `<a href="${safeHref(socialField(item, 1, 'url'))}" target="_blank" rel="noreferrer">${escapeText(socialField(item, 0, 'label'))} →</a>`).join('');
  const homeLinks = document.querySelectorAll('.home-socials, .home-contact-card .contact-list');
  if (homeLinks.length) {
    const icons = { Discord: '◉', Twitch: '♜', X: '𝕏', TikTok: '♪', VGen: '♡' };
    homeLinks.forEach((homeLink) => {
      const contactList = homeLink.classList.contains('contact-list');
      homeLink.innerHTML = content.socials.map((item) => {
        const label = socialField(item, 0, 'label');
        const href = socialField(item, 1, 'url');
        return contactList
          ? `<a href="${safeHref(href)}" target="_blank" rel="noreferrer"><span class="contact-link-icon">${icons[label] || '✦'}</span><span>${escapeText(label)}</span><b class="text-arrow">→</b></a>`
          : `<a href="${safeHref(href)}" target="_blank" rel="noreferrer" aria-label="${escapeText(label)}" title="${escapeText(label)}">${icons[label] || '✦'}</a>`;
      }).join('');
    });
  }
  document.querySelectorAll('[data-contact="vgen"]').forEach((link) => {
    const vgen = content.socials.find((item) => socialField(item, 0, 'label').toLowerCase() === 'vgen');
    link.href = safeHref(vgen ? socialField(vgen, 1, 'url') : 'https://vgen.co/');
  });
}

function socialField(item, arrayIndex, objectKey) {
  if (Array.isArray(item)) return item[arrayIndex] || '';
  return item && typeof item === 'object' ? item[objectKey] || '' : '';
}

function renderQueue() {
  const queue = content.queue || fallbackContent.queue;
  document.querySelectorAll('[data-queue="title"]').forEach((node) => node.textContent = localized(queue, 'title') || fallbackContent.queue.title);
  document.querySelectorAll('[data-queue="details"]').forEach((node) => node.textContent = localized(queue, 'details') || fallbackContent.queue.details);
  document.querySelectorAll('[data-queue="status"]').forEach((node) => node.textContent = localized(queue, 'status') || fallbackContent.queue.status);
  const frame = byId('queue-embed');
  const message = byId('queue-embed-message');
  const loading = byId('queue-loading');
  try {
    const links = notionQueueLinks(queue.url || fallbackContent.queue.url);
    document.querySelectorAll('[data-queue-link]').forEach((node) => { node.href = links.publicUrl; node.hidden = false; });
    if (frame) {
      if (frame.getAttribute('src') !== links.embedUrl) {
        frame.dispatchEvent(new Event('queue:loading'));
        frame.src = links.embedUrl;
      }
      frame.title = localized(queue, 'title') || 'Commission queue on Notion';
      frame.hidden = false;
    }
    if (message) message.hidden = true;
  } catch {
    if (frame) frame.dispatchEvent(new Event('queue:idle'));
    if (loading) loading.hidden = true;
    if (frame) { frame.removeAttribute('src'); frame.hidden = true; }
    if (message) message.hidden = false;
    document.querySelectorAll('[data-queue-link]').forEach((node) => { node.removeAttribute('href'); node.hidden = true; });
  }
}

function renderMusic() {
  musicPlaylistIndex = 0;
  updateMusicTrack(false);
}

function getMusicPlaylist() {
  if (Array.isArray(content.musicPlaylist) && content.musicPlaylist.length) return content.musicPlaylist;
  return content.music?.url ? [content.music] : [];
}

function updateMusicTrack(autoplay = false) {
  const audio = byId('music-audio');
  if (!audio) return;
  const playlist = getMusicPlaylist();
  if (playlist.length) musicPlaylistIndex = (musicPlaylistIndex + playlist.length) % playlist.length;
  else musicPlaylistIndex = 0;
  const music = playlist[musicPlaylistIndex] || fallbackContent.music;
  const url = safeAudioUrl(music.url);
  const player = audio.closest('.custom-player');
  const toggle = byId('music-toggle');
  const progress = byId('music-progress');
  const mute = byId('music-mute');
  const volume = byId('music-volume');
  const previous = byId('music-previous');
  const next = byId('music-next');
  byId('music-title').textContent = music.title || 'ยังไม่ได้เพิ่มเพลง';
  byId('music-artist').textContent = music.artist || 'เพิ่มไฟล์ MP3 จากหลังบ้าน';
  if (url) {
    const changed = audio.src !== url;
    audio.src = url;
    player.dataset.playerState = 'ready';
    [toggle, progress, mute, volume, previous, next].forEach((control) => { if (control) control.disabled = false; });
    if (changed) { progress.value = '0'; byId('music-time').textContent = '0:00 / 0:00'; }
    if (autoplay) audio.play().catch(() => {});
  } else {
    audio.removeAttribute('src');
    player.dataset.playerState = 'empty';
    [toggle, progress, mute, volume, previous, next].forEach((control) => { if (control) control.disabled = true; });
  }
}

function renderCharacterSheet() {
  const image = byId('character-sheet-image');
  if (!image) return;
  const sheet = content.characterSheet || fallbackContent.characterSheet;
  image.src = safeHref(sheet.image || fallbackContent.characterSheet.image);
  image.alt = localized(sheet, 'title') || 'OC Character Sheet';
  const title = byId('character-sheet-title');
  if (title) title.textContent = localized(sheet, 'title') || 'OC Character Sheet';
}

function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function safeHref(value) {
  try { const url = new URL(value, location.origin); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escapeText(url.href) : sourceUrl; }
  catch { return sourceUrl; }
}

function safeAudioUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return ['https:', 'http:'].includes(url.protocol) && /\.mp3(?:$|[?#])/i.test(url.href) ? url.href : '';
  } catch { return ''; }
}

function safeColor(value, fallback) {
  return /^#[\da-f]{3,8}$/i.test(String(value || '')) ? value : fallback;
}

function getMedia(item) {
  let youtubeId = item.youtubeId || '';
  let driveId = item.driveId || '';
  const videoUrl = String(item.video || '').trim();

  if (videoUrl) {
    try {
      const url = new URL(videoUrl);
      if (url.hostname === 'youtu.be') youtubeId = url.pathname.split('/').filter(Boolean)[0] || '';
      if (url.hostname.includes('youtube.com')) youtubeId = url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/)?.[1] || '';
      if (url.hostname === 'drive.google.com') driveId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get('id') || '';
    } catch { /* Invalid URLs fall through to the decorative preview. */ }
  }

  if (/^[\w-]{11}$/.test(youtubeId)) return { type: 'embed', src: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`, thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` };
  if (/^[\w-]+$/.test(driveId)) return { type: 'video', src: `/media/drive/${driveId}`, thumbnail: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000` };
  if (videoUrl) {
    try { const url = new URL(videoUrl); if (['https:', 'http:'].includes(url.protocol)) return { type: 'video', src: url.href, thumbnail: '' }; }
    catch { /* Ignore malformed video URLs. */ }
  }
  return { type: 'none', src: '', thumbnail: '' };
}

function render() {
  document.querySelectorAll('[data-content="status"]').forEach((node) => node.textContent = content.status);
  const welcomeStatus = String(content.status || '').replace(/^status\s*:\s*/i, '').trim().toLowerCase();
  document.querySelectorAll('[data-welcome-status]').forEach((node) => {
    node.textContent = /^(open|closed|waitlist)$/.test(welcomeStatus) ? `commission ${welcomeStatus}` : content.status;
  });
  renderCommission(); renderGallery(); renderAddons(); renderTerms(); renderSocials(); renderQueue(); renderMusic(); renderCharacterSheet(); applyInterfaceLanguage();
  if (byId('year')) byId('year').textContent = new Date().getFullYear();
  observeReveals();
}

let revealObserver;
function observeReveals() {
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible')); return; }
  revealObserver ||= new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((node) => revealObserver.observe(node));
}

function setupInteractions() {
  const menu = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (menu && toggle) {
    toggle.addEventListener('click', () => { const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));
  }
  const airyMenu = document.querySelector('.airy-nav');
  const airyToggle = document.querySelector('.airy-menu-toggle');
  if (airyMenu && airyToggle) {
    airyToggle.addEventListener('click', () => { const open = airyMenu.classList.toggle('open'); airyToggle.setAttribute('aria-expanded', open); });
    airyMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { airyMenu.classList.remove('open'); airyToggle.setAttribute('aria-expanded', 'false'); }));
  }
  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderGallery(button.dataset.filter); }));
  const commissionFilters = byId('commission-filters');
  if (commissionFilters) commissionFilters.addEventListener('click', (event) => { const button = event.target.closest('.commission-filter'); if (button) renderCommission(button.dataset.commissionFilter || 'all'); });
  const addonDialog = byId('addons-dialog');
  const addonOpen = byId('addons-open');
  if (addonOpen && addonDialog) addonOpen.addEventListener('click', () => addonDialog.showModal());
  document.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  [addonDialog, byId('work-dialog')].filter(Boolean).forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
  const characterDialog = byId('character-dialog');
  const characterOpen = byId('character-sheet-open');
  if (characterOpen && characterDialog) characterOpen.addEventListener('click', () => characterDialog.showModal());
  if (characterDialog) characterDialog.addEventListener('click', (event) => { if (event.target === characterDialog) characterDialog.close(); });
  const tosList = byId('tos-list');
  if (tosList) tosList.addEventListener('click', (event) => { const button = event.target.closest('.tos-trigger'); if (!button) return; const item = button.closest('.tos-item'); item.classList.toggle('open'); button.setAttribute('aria-expanded', item.classList.contains('open')); });
  const addonsCollapse = byId('addons-collapse');
  if (addonsCollapse) addonsCollapse.addEventListener('click', () => { const card = addonsCollapse.closest('.addons-card'); const collapsed = card.classList.toggle('is-collapsed'); addonsCollapse.setAttribute('aria-expanded', String(!collapsed)); addonsCollapse.setAttribute('aria-label', collapsed ? 'เปิดตาราง Add-ons' : 'พับตาราง Add-ons'); addonsCollapse.textContent = collapsed ? '＋' : '−'; });
  const showWork = (card) => {
    const item = content.gallery[Number(card.dataset.work)];
    if (!item) return;
    const media = getMedia(item);
    const preview = media.type === 'embed'
      ? `<iframe class="work-video" src="${safeHref(media.src)}" title="${escapeText(localized(item, 'title'))}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="eager"></iframe>`
      : media.type === 'video'
        ? `<video class="work-video" src="${safeHref(media.src)}" poster="${item.image ? safeHref(item.image) : ''}" controls playsinline webkit-playsinline preload="metadata"></video>`
        : item.image
          ? `<img class="work-image" src="${safeHref(item.image)}" alt="${escapeText(localized(item, 'title'))}" />`
          : escapeText(item.icon || '▶');
    const detail = byId('work-detail');
    const dialog = byId('work-dialog');
    if (!detail || !dialog) return;
    const fullscreenButton = media.type !== 'none' ? `<button class="work-fullscreen" type="button" aria-label="${siteLanguage === 'en' ? 'View video fullscreen' : 'ดูวิดีโอเต็มจอ'}">${siteLanguage === 'en' ? 'Fullscreen' : 'เต็มจอ'}</button>` : '';
    detail.innerHTML = `<div class="work-detail-art" style="--art-mid:${safeColor(item.mid, '#82619b')};--art-deep:${safeColor(item.deep, '#282035')}">${preview}${fullscreenButton}</div><div class="work-detail-copy"><span class="small-index">${escapeText(localized(item, 'tag'))}</span><h2>${escapeText(localized(item, 'title'))}</h2><p>${escapeText(localized(item, 'description'))}</p><a class="text-link" href="${safeHref(sourceUrl + '#gallery')}" target="_blank" rel="noreferrer">${escapeText(currentInterfaceText().galleryOriginal)}</a></div>`;
    dialog.showModal();
    document.body.classList.add('gallery-modal-open');
    const fullscreen = detail.querySelector('.work-fullscreen');
    if (fullscreen) fullscreen.addEventListener('click', async () => {
      const mediaNode = detail.querySelector('.work-video');
      const stage = detail.querySelector('.work-detail-art');
      try {
        if (mediaNode?.tagName === 'VIDEO' && typeof mediaNode.webkitEnterFullscreen === 'function') { mediaNode.webkitEnterFullscreen(); return; }
        const target = mediaNode?.tagName === 'VIDEO' ? mediaNode : stage;
        const request = target?.requestFullscreen || target?.webkitRequestFullscreen;
        if (request) { await request.call(target); return; }
        window.open(media.src, '_blank', 'noopener,noreferrer');
      } catch { window.open(media.src, '_blank', 'noopener,noreferrer'); }
    });
  };
  const gallery = byId('gallery-grid');
  if (gallery) {
    gallery.addEventListener('click', (event) => { const card = event.target.closest('.work-card'); if (card) showWork(card); });
    gallery.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { const card = event.target.closest('.work-card'); if (card) { event.preventDefault(); showWork(card); } } });
  }
  const workDialog = byId('work-dialog');
  if (workDialog) workDialog.addEventListener('close', () => { document.body.classList.remove('gallery-modal-open'); const detail = byId('work-detail'); if (detail) detail.innerHTML = ''; });
  const ticker = document.querySelector('.airy-ticker');
  const tickerTrack = ticker?.querySelector('.airy-ticker-track');
  if (ticker && tickerTrack) {
    let dragging = false;
    let startX = 0;
    let dragOffset = 0;
    ticker.addEventListener('pointerdown', (event) => {
      dragging = true;
      startX = event.clientX;
      dragOffset = 0;
      ticker.classList.add('is-dragging');
      tickerTrack.style.animationPlayState = 'paused';
      ticker.setPointerCapture(event.pointerId);
    });
    ticker.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      dragOffset += event.clientX - startX;
      startX = event.clientX;
      tickerTrack.style.transform = `translate3d(${dragOffset}px, 0, 0)`;
    });
    const releaseTicker = (event) => {
      if (!dragging) return;
      dragging = false;
      ticker.classList.remove('is-dragging');
      tickerTrack.style.transform = '';
      tickerTrack.style.animationPlayState = 'running';
      if (event.pointerId !== undefined && ticker.hasPointerCapture(event.pointerId)) ticker.releasePointerCapture(event.pointerId);
    };
    ticker.addEventListener('pointerup', releaseTicker);
    ticker.addEventListener('pointercancel', releaseTicker);
  }
  const audio = byId('music-audio');
  const musicToggle = byId('music-toggle');
  const musicProgress = byId('music-progress');
  const musicMute = byId('music-mute');
  const musicVolume = byId('music-volume');
  const musicPrevious = byId('music-previous');
  const musicNext = byId('music-next');
  const musicTime = byId('music-time');
  const formatTime = (seconds) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
  if (audio && musicToggle && musicProgress && musicMute && musicVolume && musicTime) {
    audio.volume = Number(musicVolume.value);
    musicToggle.addEventListener('click', async () => {
      if (!audio.src) return;
      if (audio.paused) { try { await audio.play(); } catch { return; } }
      else audio.pause();
    });
    audio.addEventListener('play', () => { musicToggle.classList.add('is-playing'); musicToggle.setAttribute('aria-label', 'หยุดเพลงชั่วคราว'); });
    audio.addEventListener('pause', () => { musicToggle.classList.remove('is-playing'); musicToggle.setAttribute('aria-label', 'เล่นเพลง'); });
    audio.addEventListener('timeupdate', () => {
      const duration = audio.duration || 0;
      musicProgress.value = duration ? String((audio.currentTime / duration) * 100) : '0';
      musicTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
    });
    musicProgress.addEventListener('input', () => { if (audio.duration) audio.currentTime = (Number(musicProgress.value) / 100) * audio.duration; });
    musicMute.addEventListener('click', () => { audio.muted = !audio.muted; musicMute.classList.toggle('is-muted', audio.muted); musicMute.textContent = audio.muted ? 'MUTE' : 'VOL'; musicMute.setAttribute('aria-label', audio.muted ? 'เปิดเสียง' : 'ปิดเสียง'); });
    musicVolume.addEventListener('input', () => { audio.volume = Number(musicVolume.value); audio.muted = audio.volume === 0; musicMute.classList.toggle('is-muted', audio.muted); musicMute.textContent = audio.muted ? 'MUTE' : 'VOL'; });
    if (musicPrevious) musicPrevious.addEventListener('click', () => { musicPlaylistIndex -= 1; updateMusicTrack(true); });
    if (musicNext) musicNext.addEventListener('click', () => { musicPlaylistIndex += 1; updateMusicTrack(true); });
    audio.addEventListener('ended', () => {
      if (getMusicPlaylist().length > 1) { musicPlaylistIndex += 1; updateMusicTrack(true); }
      else musicToggle.classList.remove('is-playing');
    });
  }
  let lastSparkle = 0;
  document.addEventListener('pointermove', (event) => { if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return; const layer = document.querySelector('.sparkle-layer'); if (!layer) return; const now = performance.now(); if (now - lastSparkle < 95) return; lastSparkle = now; const spark = document.createElement('span'); spark.className = 'sparkle'; spark.textContent = Math.random() > .5 ? '✦' : '✧'; spark.style.left = `${event.clientX + (Math.random() * 14 - 7)}px`; spark.style.top = `${event.clientY + (Math.random() * 14 - 7)}px`; layer.append(spark); setTimeout(() => spark.remove(), 700); });
}

async function loadPublishedContent() {
  const config = window.ANONYMOUR_FIREBASE_CONFIG || {};
  if (!config.apiKey || !config.projectId) return;
  try {
    const [{ initializeApp }, { getFirestore, doc, getDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
    ]);
    const db = getFirestore(initializeApp(config));
    const snapshot = await getDoc(doc(db, 'publicContent', 'site'));
    if (snapshot.exists()) content = mergeContent(fallbackContent, decodeFirestoreValue(snapshot.data()));
    render();
  } catch (error) { console.warn('Could not load published Firebase content; showing the saved starter content.', error); }
}

function mergeContent(base, incoming) {
  return { ...structuredClone(base), ...incoming, commission: incoming.commission || base.commission, addons: incoming.addons || base.addons, gallery: incoming.gallery || base.gallery, terms: incoming.terms || base.terms, socials: incoming.socials || base.socials, musicPlaylist: incoming.musicPlaylist || base.musicPlaylist };
}

function decodeFirestoreValue(value) {
  if (Array.isArray(value)) return value.map(decodeFirestoreValue);
  if (!value || typeof value !== 'object') return value;
  if (value.__anonymourArray === true && value.items && typeof value.items === 'object') {
    return Array.from({ length: Number(value.length) || 0 }, (_, index) => decodeFirestoreValue(value.items[String(index)]));
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decodeFirestoreValue(item)]));
}

if (!document.body.classList.contains('admin-page')) {
  setupLanguageSwitcher();
  render();
  setupInteractions();
  loadPublishedContent();
}
