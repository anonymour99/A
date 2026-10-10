import { fallbackContent } from './app.js';
import { notionQueueLinks } from './notion-queue.js';
import { commissionMedia, commissionVideoHtml, commissionFileType } from './commission-media.js';

const $ = (id) => document.getElementById(id);
const config = window.ANONYMOUR_FIREBASE_CONFIG || {};
const adminEmail = (window.ANONYMOUR_ADMIN_EMAIL || '').toLowerCase().trim();
let firebaseServices;
let editingGalleryIndex = -1;
let editingAddonIndex = -1;
let editingMusicIndex = -1;
let editingContactIndex = -1;
let galleryPreviewObjectUrls = [];
let queueUrlDirty = false;
let commissionVideoDirty = false;
let commissionUploading = false;

function readyConfig() {
  return Boolean(config.apiKey && config.projectId && config.authDomain && adminEmail);
}

async function connectFirebase() {
  if (firebaseServices) return firebaseServices;
  const [{ initializeApp }, { getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification, signOut }, { getFirestore, doc, getDoc, setDoc }, { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js')
  ]);
  const app = initializeApp(config);
  firebaseServices = { auth: getAuth(app), db: getFirestore(app), storage: getStorage(app), onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification, signOut, doc, getDoc, setDoc, ref, uploadBytes, uploadBytesResumable, getDownloadURL };
  onAuthStateChanged(firebaseServices.auth, async (user) => {
    if (!user) { showSignedOut(); return; }
    if (user.email?.toLowerCase() !== adminEmail) {
      await signOut(firebaseServices.auth);
      setMessage('auth-message', 'บัญชีนี้ไม่มีสิทธิ์ดูแลเว็บไซต์ กรุณาใช้บัญชีอีเมลผู้ดูแลที่ยืนยันแล้ว', true);
      showSignedOut(); return;
    }
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      await signOut(firebaseServices.auth);
      setMessage('auth-message', 'ส่งอีเมลยืนยันแล้ว กรุณาเปิดลิงก์ในอีเมล จากนั้นกลับมาเข้าสู่ระบบอีกครั้ง');
      showSignedOut(); return;
    }
    showEditor();
    await loadDocument();
  });
  return firebaseServices;
}

function setMessage(id, message, error = false) {
  const node = $(id); node.textContent = message; node.classList.toggle('error', error);
}

function showSignedOut() { $('auth-panel').hidden = false; $('editor-panel').hidden = true; }
function showEditor() { $('auth-panel').hidden = true; $('editor-panel').hidden = false; showAdminPage(); }

const adminPages = {
  home: 'จัดการหน้าแรก',
  commission: 'จัดการหน้า Commission',
  tos: 'จัดการหน้า TOS',
  gallery: 'จัดการ My Little Gallery',
  queue: 'จัดการหน้า Queue',
  contact: 'จัดการช่องทางติดต่อ',
  translations: 'แก้คำแปล TH / EN',
  settings: 'ข้อมูลเว็บไซต์ทั้งหมด'
};

function showAdminPage() {
  const page = adminPages[location.hash.slice(1)] ? location.hash.slice(1) : 'home';
  document.querySelectorAll('[data-admin-page]').forEach((section) => { section.hidden = section.dataset.adminPage !== page; });
  document.querySelectorAll('[data-admin-nav]').forEach((link) => {
    const active = link.dataset.adminNav === page;
    link.classList.toggle('active', active);
    link.setAttribute('aria-current', active ? 'page' : 'false');
  });
  $('admin-current-page').textContent = adminPages[page];
  if (page === 'translations') renderTranslationsAdmin();
}

async function loadDocument() {
  const initialData = structuredClone(fallbackContent);
  $('content-json').value = JSON.stringify(initialData, null, 2);
  $('music-title-input').value = initialData.music?.title || '';
  $('music-artist-input').value = initialData.music?.artist || '';
  $('character-title-input').value = initialData.characterSheet?.title || 'OC Character Sheet';
  $('queue-url-input').value = initialData.queue.url;
  queueUrlDirty = false;
  renderGalleryAdmin();
  renderCommissionAdmin();
  renderAddonsAdmin();
  renderTosAdmin();
  renderMusicAdmin();
  renderContactsAdmin();
  renderTranslationsAdmin();
  setMessage('save-message', 'เปิดตัวแก้ไขแล้ว · กำลังตรวจข้อมูล Firebase…');
  await new Promise((resolve) => requestAnimationFrame(resolve));
  try {
    const { db, doc, getDoc } = await connectFirebase();
    const snapshot = await getDoc(doc(db, 'publicContent', 'site'));
    const remote = snapshot.exists() ? snapshot.data() : {};
    const data = {
      ...fallbackContent,
      ...remote,
      commission: Array.isArray(remote.commission) && remote.commission.length
        ? remote.commission
        : structuredClone(fallbackContent.commission)
    };
    data.addons = (Array.isArray(data.addons) ? data.addons : []).map(addonArray);
    data.socials = (Array.isArray(data.socials) ? data.socials : []).map(socialArray);
    $('content-json').value = JSON.stringify(data, null, 2);
    $('music-title-input').value = data.music?.title || '';
    $('music-artist-input').value = data.music?.artist || '';
    $('character-title-input').value = data.characterSheet?.title || 'OC Character Sheet';
    $('queue-url-input').value = data.queue?.url || fallbackContent.queue.url;
    queueUrlDirty = false;
    renderGalleryAdmin();
    renderCommissionAdmin();
    renderAddonsAdmin();
    renderTosAdmin();
    renderMusicAdmin();
    renderContactsAdmin();
    renderTranslationsAdmin();
    setMessage('save-message', snapshot.exists() ? 'โหลดข้อมูลจาก Firebase แล้ว' : 'กำลังใช้ข้อมูลเริ่มต้น · บันทึกเพื่อสร้างเอกสาร');
  } catch (error) {
    $('content-json').value = JSON.stringify(fallbackContent, null, 2);
    $('music-title-input').value = fallbackContent.music?.title || '';
    $('music-artist-input').value = fallbackContent.music?.artist || '';
    $('character-title-input').value = fallbackContent.characterSheet?.title || 'OC Character Sheet';
    $('queue-url-input').value = fallbackContent.queue.url;
    queueUrlDirty = false;
    renderGalleryAdmin();
    renderCommissionAdmin();
    renderAddonsAdmin();
    renderTosAdmin();
    renderMusicAdmin();
    renderContactsAdmin();
    renderTranslationsAdmin();
    setMessage('save-message', `เปิดข้อมูลเริ่มต้นให้แก้ไขได้ · Firebase ยังไม่พร้อมบันทึก (${error.message})`, true);
  }
}

async function login() {
  if (!readyConfig()) { setMessage('auth-message', 'ยังไม่ได้ตั้งค่า Firebase config และ ADMIN_EMAIL ในไฟล์ config', true); return; }
  const email = $('email').value.trim().toLowerCase();
  const password = $('password').value;
  if (!email || !password) { setMessage('auth-message', 'กรอกอีเมลและรหัสผ่านก่อนค่ะ', true); return; }
  if (email !== adminEmail) { setMessage('auth-message', 'อีเมลนี้ไม่ตรงกับบัญชีผู้ดูแลที่กำหนด', true); return; }
  setMessage('auth-message', 'กำลังเข้าสู่ระบบ…');
  try { const { auth, signInWithEmailAndPassword } = await connectFirebase(); await signInWithEmailAndPassword(auth, email, password); }
  catch (error) { setMessage('auth-message', `เข้าสู่ระบบไม่สำเร็จ: ${error.message}`, true); }
}

async function save() {
  try {
    if (commissionUploading) throw new Error('รออัปโหลดวิดีโอให้เสร็จก่อน');
    if (commissionVideoDirty || $('commission-video-file').files.length) throw new Error('กดใช้ลิงก์หรืออัปโหลดวิดีโอ Commission ก่อนบันทึก');
    const data = JSON.parse($('content-json').value);
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('ข้อมูลหลักต้องเป็น JSON object');
    if (queueUrlDirty) data.queue = { ...fallbackContent.queue, ...data.queue, url: readQueueUrl() };
    if (data.queue?.url) notionQueueLinks(data.queue.url);
    for (const key of ['commission', 'addons', 'gallery', 'terms', 'socials']) if (data[key] !== undefined && !Array.isArray(data[key])) throw new Error(`ฟิลด์ ${key} ต้องเป็นรายการ (array)`);
    for (const item of data.commission || []) if (item.video) commissionMedia(item.video);
    setMessage('save-message', 'กำลังบันทึก…');
    const { auth, db, doc, setDoc } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์บันทึก');
    const publishedData = structuredClone(data);
    publishedData.addons = (publishedData.addons || []).map(addonObject);
    publishedData.socials = (publishedData.socials || []).map(socialObject);
    await setDoc(doc(db, 'publicContent', 'site'), publishedData);
    $('content-json').value = JSON.stringify(data, null, 2);
    $('queue-url-input').value = data.queue?.url || fallbackContent.queue.url;
    queueUrlDirty = false;
    setMessage('save-message', 'บันทึกแล้ว · เว็บไซต์จะแสดงข้อมูลใหม่เมื่อโหลดซ้ำ');
  } catch (error) { setMessage('save-message', `ยังบันทึกไม่ได้: ${error.message}`, true); }
}

function readDraft() {
  const data = JSON.parse($('content-json').value);
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('ข้อมูลหลักต้องเป็น JSON object');
  if (!Array.isArray(data.commission)) data.commission = [];
  if (!Array.isArray(data.addons)) data.addons = [];
  data.addons = data.addons.map(addonArray);
  if (!Array.isArray(data.gallery)) data.gallery = [];
  if (!Array.isArray(data.terms)) data.terms = [];
  if (!Array.isArray(data.musicPlaylist)) data.musicPlaylist = data.music?.url ? [data.music] : [];
  if (!Array.isArray(data.socials)) data.socials = [];
  data.socials = data.socials.map(socialArray);
  return data;
}

function addonArray(item) {
  if (Array.isArray(item)) {
    return [
      item[0] || '', item[1] || '', item[2] || '', item[3] || '',
      item[4] || '', item[5] || '', item[6] || '', item[7] || ''
    ];
  }
  if (item && typeof item === 'object') {
    return [
      item.name || '', item.price || '', item.nameEn || '', item.priceEn || '',
      item.support || '', item.supportEn || '', item.details || '', item.detailsEn || ''
    ];
  }
  return ['', '', '', '', '', '', '', ''];
}

function addonObject(item) {
  const row = addonArray(item);
  return {
    name: row[0],
    price: row[1],
    nameEn: row[2],
    priceEn: row[3],
    support: row[4],
    supportEn: row[5],
    details: row[6],
    detailsEn: row[7]
  };
}

function socialArray(item) {
  if (Array.isArray(item)) return [item[0] || '', item[1] || ''];
  if (item && typeof item === 'object') return [item.label || '', item.url || ''];
  return ['', ''];
}

function socialObject(item) {
  const row = socialArray(item);
  return { label: row[0], url: row[1] };
}

const translationInterfaceDefaults = {
  th: { home: 'หน้าหลัก', commission: 'Commission', queue: 'คิวงาน', gallery: 'My Little Gallery', tos: 'ข้อตกลง', back: '← หน้าแรก', contact: 'ติดต่อจองคิว →', details: 'รายละเอียด', addonName: 'รายการ', addonSupport: 'รองรับ', addonPrice: 'ราคาเริ่มต้น (THB)', addonDetails: 'รายละเอียดเพิ่มเติม', galleryOriginal: 'เปิดแกลเลอรีต้นฉบับ →' },
  en: { home: 'Home', commission: 'Commission', queue: 'Queue', gallery: 'My Little Gallery', tos: 'Terms', back: '← Home', contact: 'Book a commission →', details: 'Details', addonName: 'Add-on', addonSupport: 'Supports', addonPrice: 'Starting price (THB)', addonDetails: 'More details', galleryOriginal: 'Open original gallery →' }
};

function translationInput(group, index, field, label, thValue, enValue, multiline = false) {
  const attrs = `data-translation-group="${group}" data-translation-index="${index}" data-translation-field="${field}"`;
  const thai = multiline
    ? `<textarea ${attrs} data-translation-lang="th">${escapeAdmin(thValue)}</textarea>`
    : `<input type="text" ${attrs} data-translation-lang="th" value="${escapeAdmin(thValue)}">`;
  const english = multiline
    ? `<textarea ${attrs} data-translation-lang="en" placeholder="ว่างไว้เพื่อใช้ภาษาไทย">${escapeAdmin(enValue)}</textarea>`
    : `<input type="text" ${attrs} data-translation-lang="en" placeholder="ว่างไว้เพื่อใช้ภาษาไทย" value="${escapeAdmin(enValue)}">`;
  return `<div class="translation-pair"><label class="translation-field"><b>TH · ${escapeAdmin(label)}</b>${thai}</label><label class="translation-field"><b>EN · ${escapeAdmin(label)}</b>${english}</label></div>`;
}

function translationGroup(title, cards, open = false) {
  return `<details class="translation-group"${open ? ' open' : ''}><summary>${escapeAdmin(title)}</summary><div class="translation-group-body">${cards || '<p class="translation-empty">ยังไม่มีรายการในส่วนนี้</p>'}</div></details>`;
}

function renderTranslationsAdmin() {
  const root = $('translation-sections');
  if (!root) return;
  try {
    const data = readDraft();
    data.interfaceText = data.interfaceText || structuredClone(translationInterfaceDefaults);
    data.interfaceText.th = { ...translationInterfaceDefaults.th, ...(data.interfaceText.th || {}) };
    data.interfaceText.en = { ...translationInterfaceDefaults.en, ...(data.interfaceText.en || {}) };
    $('content-json').value = JSON.stringify(data, null, 2);
    const labels = { home: 'เมนูหน้าแรก', commission: 'เมนู Commission', queue: 'เมนู Queue', gallery: 'เมนู Gallery', tos: 'เมนู TOS', back: 'ปุ่มกลับหน้าแรก', contact: 'ปุ่มติดต่อ', details: 'ปุ่มรายละเอียด', addonName: 'หัวตาราง Add-on', addonSupport: 'หัวตารางรองรับ', addonPrice: 'หัวตารางราคา', addonDetails: 'หัวข้อรายละเอียด Add-on', galleryOriginal: 'ลิงก์แกลเลอรีต้นฉบับ' };
    const interfaceCards = Object.keys(labels).map((field) => `<div class="translation-card">${translationInput('interface', 0, field, labels[field], data.interfaceText.th[field], data.interfaceText.en[field])}</div>`).join('');
    const queue = data.queue || {};
    const queueCards = `<div class="translation-card"><span class="translation-card-title">QUEUE</span>${translationInput('queue', 0, 'title', 'ชื่อหน้า', queue.title, queue.titleEn)}${translationInput('queue', 0, 'details', 'รายละเอียด', queue.details, queue.detailsEn, true)}${translationInput('queue', 0, 'status', 'สถานะ', queue.status, queue.statusEn)}</div>`;
    const character = data.characterSheet || {};
    const characterCards = `<div class="translation-card"><span class="translation-card-title">OC CHARACTER SHEET</span>${translationInput('characterSheet', 0, 'title', 'ชื่อหัวข้อ', character.title, character.titleEn)}</div>`;
    const commissionCards = data.commission.map((item, index) => `<div class="translation-card"><span class="translation-card-title">COMMISSION ${index + 1} · ${escapeAdmin(item.title || '')}</span>${translationInput('commission', index, 'category', 'หมวดหมู่', item.category, item.categoryEn)}${translationInput('commission', index, 'title', 'ชื่อรายการ', item.title, item.titleEn)}${translationInput('commission', index, 'details', 'รายละเอียด', item.details, item.detailsEn, true)}</div>`).join('');
    const addonCards = data.addons.map((item, index) => `<div class="translation-card"><span class="translation-card-title">ADD-ON ${index + 1} · ${escapeAdmin(item?.[0] || '')}</span>${translationInput('addons', index, 'name', 'ชื่อ Add-on', item?.[0], item?.[2])}${translationInput('addons', index, 'price', 'ราคา', item?.[1], item?.[3])}${translationInput('addons', index, 'support', 'รองรับ', item?.[4], item?.[5])}${translationInput('addons', index, 'details', 'รายละเอียด', item?.[6], item?.[7], true)}</div>`).join('');
    const galleryCards = data.gallery.map((item, index) => `<div class="translation-card"><span class="translation-card-title">GALLERY ${index + 1} · ${escapeAdmin(item.title || '')}</span>${translationInput('gallery', index, 'title', 'ชื่อผลงาน', item.title, item.titleEn)}${translationInput('gallery', index, 'tag', 'ป้ายกำกับ', item.tag, item.tagEn)}${translationInput('gallery', index, 'description', 'รายละเอียด', item.description, item.descriptionEn, true)}</div>`).join('');
    const termCards = data.terms.map((item, index) => `<div class="translation-card"><span class="translation-card-title">TOS ${index + 1} · ${escapeAdmin(item.title || '')}</span>${translationInput('terms', index, 'title', 'ชื่อหัวข้อ', item.title, item.titleEn)}${translationInput('terms', index, 'body', 'รายละเอียด', item.body, item.bodyEn, true)}</div>`).join('');
    root.innerHTML = [translationGroup('ข้อความปุ่มและเมนู', interfaceCards, true), translationGroup('หน้าแรก', characterCards), translationGroup('Queue', queueCards), translationGroup('Commission', commissionCards), translationGroup('Add-ons', addonCards), translationGroup('My Little Gallery', galleryCards), translationGroup('TOS', termCards)].join('');
    setMessage('translation-message', 'แก้ข้อความแล้วกด “บันทึกและเผยแพร่” ด้านล่าง');
  } catch (error) { setMessage('translation-message', `เปิดคำแปลไม่ได้: ${error.message}`, true); }
}

function updateTranslation(event) {
  const input = event.target.closest('[data-translation-group]');
  if (!input) return;
  try {
    const data = readDraft();
    const { translationGroup: group, translationField: field, translationLang: lang } = input.dataset;
    const index = Number(input.dataset.translationIndex || 0);
    const value = input.value;
    if (group === 'interface') {
      data.interfaceText = data.interfaceText || structuredClone(translationInterfaceDefaults);
      data.interfaceText[lang] = data.interfaceText[lang] || {};
      data.interfaceText[lang][field] = value;
    } else if (group === 'addons') {
      const item = data.addons[index];
      if (!item) throw new Error('ไม่พบ Add-on ที่เลือก');
      const slots = { name: [0, 2], price: [1, 3], support: [4, 5], details: [6, 7] };
      const slot = slots[field]?.[lang === 'en' ? 1 : 0];
      if (slot === undefined) throw new Error('ไม่พบช่องคำแปล Add-on');
      item[slot] = value;
    } else {
      const target = group === 'queue' || group === 'characterSheet' ? data[group] : data[group]?.[index];
      if (!target) throw new Error('ไม่พบรายการที่เลือก');
      target[lang === 'en' ? `${field}En` : field] = value;
    }
    $('content-json').value = JSON.stringify(data, null, 2);
    setMessage('translation-message', 'อัปเดตคำแปลในข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อใช้งานจริง');
  } catch (error) { setMessage('translation-message', error.message, true); }
}

function readQueueUrl() {
  const input = $('queue-url-input').value.trim();
  // Read only the iframe src; never insert pasted embed HTML into the page.
  const value = input.startsWith('<')
    ? new DOMParser().parseFromString(input, 'text/html').querySelector('iframe')?.getAttribute('src')
    : input;
  notionQueueLinks(value);
  return new URL(value).href;
}

function applyQueueUrl() {
  try {
    const data = readDraft();
    data.queue = { ...fallbackContent.queue, ...data.queue, url: readQueueUrl() };
    $('content-json').value = JSON.stringify(data, null, 2);
    $('queue-url-input').value = data.queue.url;
    queueUrlDirty = false;
    setMessage('queue-message', 'อัปเดตลิงก์แล้ว · กด “บันทึกและเผยแพร่” เพื่อแสดงบอร์ดบนหน้า Queue');
  } catch (error) { setMessage('queue-message', error.message, true); }
}

async function uploadMusic() {
  try {
    const file = $('music-file').files[0];
    if (!file) throw new Error('กรุณาเลือกไฟล์เพลง .mp3');
    if (!/\.mp3$/i.test(file.name) || (file.type && file.type !== 'audio/mpeg')) throw new Error('รองรับเฉพาะไฟล์ MP3 เท่านั้น');
    if (file.size > 25 * 1024 * 1024) throw new Error('ไฟล์เพลงต้องมีขนาดไม่เกิน 25 MB');
    if (!config.storageBucket) throw new Error('ยังไม่ได้ตั้งค่า storageBucket ใน firebase-config.js');
    const title = $('music-title-input').value.trim() || file.name.replace(/\.mp3$/i, '');
    const artist = $('music-artist-input').value.trim();
    setMessage('music-message', 'กำลังอัปโหลดไฟล์ MP3…');
    const { auth, storage, ref, uploadBytes, getDownloadURL } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์อัปโหลด');
    const musicRef = ref(storage, `music/${crypto.randomUUID()}.mp3`);
    await uploadBytes(musicRef, file, { contentType: 'audio/mpeg', cacheControl: 'public,max-age=3600' });
    const url = await getDownloadURL(musicRef);
    const data = readDraft();
    const song = { title, artist, url, fileName: file.name };
    if (editingMusicIndex >= 0) data.musicPlaylist[editingMusicIndex] = song;
    else data.musicPlaylist.push(song);
    data.music = data.musicPlaylist[0] || { title: '', artist: '', url: '' };
    $('content-json').value = JSON.stringify(data, null, 2);
    resetMusicForm();
    renderMusicAdmin();
    setMessage('music-message', 'เพิ่มเพลงแล้ว · กด “บันทึกและเผยแพร่” เพื่ออัปเดตเพลย์ลิสต์');
  } catch (error) { setMessage('music-message', `อัปโหลดเพลงไม่ได้: ${error.message}`, true); }
}

function renderMusicAdmin() {
  try {
    const data = readDraft();
    $('music-items').innerHTML = data.musicPlaylist.length
      ? data.musicPlaylist.map((song, index) => `<div class="gallery-admin-item"><div><strong>${escapeAdmin(song.title || `เพลง ${index + 1}`)}</strong><small>${escapeAdmin(song.artist || song.fileName || 'MP3')}</small></div><div class="admin-list-actions"><button type="button" data-edit-music="${index}">แก้ไข</button><button type="button" class="danger-button" data-delete-music="${index}">ลบ</button></div></div>`).join('')
      : '<p class="admin-message">ยังไม่มีเพลงในเพลย์ลิสต์</p>';
  } catch (error) { setMessage('music-message', error.message, true); }
}

function resetMusicForm() {
  editingMusicIndex = -1;
  $('music-title-input').value = '';
  $('music-artist-input').value = '';
  $('music-file').value = '';
  $('music-upload').innerHTML = 'อัปโหลดและเพิ่มเพลง <span>↑</span>';
  $('music-save').hidden = true;
  $('music-delete').hidden = true;
}

function editMusic(index) {
  try {
    const song = readDraft().musicPlaylist[index];
    if (!song) throw new Error('ไม่พบเพลงที่เลือก');
    editingMusicIndex = index;
    $('music-title-input').value = song.title || '';
    $('music-artist-input').value = song.artist || '';
    $('music-file').value = '';
    $('music-upload').innerHTML = 'อัปโหลดไฟล์ใหม่แทนเพลงนี้ <span>↑</span>';
    $('music-save').hidden = false;
    $('music-delete').hidden = false;
    setMessage('music-message', `กำลังแก้ไขเพลงที่ ${index + 1}`);
  } catch (error) { setMessage('music-message', error.message, true); }
}

function saveMusicMetadata() {
  try {
    const data = readDraft();
    const song = data.musicPlaylist[editingMusicIndex];
    if (!song) throw new Error('เลือกเพลงที่ต้องการแก้ไขก่อน');
    song.title = $('music-title-input').value.trim() || song.title;
    song.artist = $('music-artist-input').value.trim();
    data.music = data.musicPlaylist[0] || { title: '', artist: '', url: '' };
    $('content-json').value = JSON.stringify(data, null, 2);
    resetMusicForm();
    renderMusicAdmin();
    setMessage('music-message', 'แก้ชื่อเพลงแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('music-message', error.message, true); }
}

function deleteMusic(index = editingMusicIndex) {
  try {
    const data = readDraft();
    const song = data.musicPlaylist[index];
    if (!song) throw new Error('ไม่พบเพลงที่เลือก');
    if (!confirm(`ลบเพลง “${song.title || `เพลง ${index + 1}`}” ออกจากเพลย์ลิสต์หรือไม่?`)) return;
    data.musicPlaylist.splice(index, 1);
    data.music = data.musicPlaylist[0] || { title: '', artist: '', url: '' };
    $('content-json').value = JSON.stringify(data, null, 2);
    resetMusicForm();
    renderMusicAdmin();
    setMessage('music-message', 'ลบเพลงจากข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('music-message', error.message, true); }
}

async function uploadCharacterSheet() {
  try {
    const file = $('character-file').files[0];
    if (!file) throw new Error('กรุณาเลือกรูป OC');
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) throw new Error('รองรับเฉพาะ PNG, JPG และ WebP');
    if (file.size > 10 * 1024 * 1024) throw new Error('ไฟล์รูปต้องมีขนาดไม่เกิน 10 MB');
    if (!config.storageBucket) throw new Error('ยังไม่ได้ตั้งค่า storageBucket ใน firebase-config.js');
    const title = $('character-title-input').value.trim() || 'OC Character Sheet';
    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    setMessage('character-message', 'กำลังอัปโหลดรูป OC…');
    const { auth, storage, ref, uploadBytes, getDownloadURL } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์อัปโหลด');
    const imageRef = ref(storage, `character/current.${extension}`);
    await uploadBytes(imageRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
    const image = await getDownloadURL(imageRef);
    const data = readDraft();
    data.characterSheet = { ...(data.characterSheet || {}), title, image };
    $('content-json').value = JSON.stringify(data, null, 2);
    setMessage('character-message', 'อัปโหลดแล้ว · กด “บันทึกและเผยแพร่” เพื่อแสดงรูปใหม่');
  } catch (error) { setMessage('character-message', `อัปโหลดรูปไม่ได้: ${error.message}`, true); }
}

function videoValue(item) {
  if (item.video) return item.video;
  if (item.youtubeId) return `https://youtu.be/${item.youtubeId}`;
  if (item.driveId) return `https://drive.google.com/file/d/${item.driveId}/view`;
  return '';
}

function renderCommissionAdmin(preferredIndex) {
  try {
    const data = readDraft();
    const items = data.commission;
    $('commission-item').innerHTML = items.map((item, index) => `<option value="${index}">${escapeAdmin(item.title || `Commission ${index + 1}`)}</option>`).join('');
    const requested = preferredIndex ?? Number($('commission-item').value || 0);
    const selected = items.length ? Math.min(Math.max(Number(requested) || 0, 0), items.length - 1) : -1;
    if (selected >= 0) $('commission-item').value = String(selected);
    selectCommissionItem();
  } catch (error) { setMessage('commission-video-message', error.message, true); }
}

function selectCommissionItem() {
  try {
    const item = readDraft().commission?.[$('commission-item').value];
    $('commission-category').value = item?.category || '';
    $('commission-title').value = item?.title || '';
    $('commission-price').value = item?.price || '';
    $('commission-symbol').value = item?.symbol || '';
    $('commission-details').value = item?.details || '';
    $('commission-image-url').value = item?.image || '';
    $('commission-video-url').value = item ? videoValue(item) : '';
    $('commission-image-file').value = '';
    $('commission-video-file').value = '';
    commissionVideoDirty = false;
    const image = item?.image ? `<img class="admin-media-preview" src="${escapeAdmin(item.image)}" alt="${escapeAdmin(item.title || 'Commission preview')}" />` : '';
    $('commission-video-preview').innerHTML = `${image}${item ? commissionVideoHtml(item) : ''}`;
    for (const id of ['commission-save-item', 'commission-delete', 'commission-image-upload', 'commission-image-remove', 'commission-video-apply', 'commission-video-upload', 'commission-video-remove']) $(id).disabled = !item;
    setMessage('commission-video-message', item ? '' : 'กด “เพิ่มรายการ” เพื่อสร้าง Commission card ใหม่');
  } catch (error) { setMessage('commission-video-message', error.message, true); }
}

function applyCommissionItem() {
  try {
    const data = readDraft();
    const index = Number($('commission-item').value);
    const item = data.commission[index];
    if (!item) throw new Error('ไม่พบรายการ Commission ที่เลือก');
    const title = $('commission-title').value.trim();
    const category = $('commission-category').value.trim();
    const price = $('commission-price').value.trim();
    if (!title || !category || !price) throw new Error('กรุณาใส่ชื่อ หมวดหมู่ และราคา');
    const image = $('commission-image-url').value.trim();
    if (image && !['https:', 'http:'].includes(new URL(image).protocol)) throw new Error('ลิงก์รูปต้องขึ้นต้นด้วย http:// หรือ https://');
    data.commission[index] = { ...item, category, title, details: $('commission-details').value.trim(), price, symbol: $('commission-symbol').value.trim() || '✦', image };
    $('content-json').value = JSON.stringify(data, null, 2);
    renderCommissionAdmin(index);
    setMessage('commission-video-message', 'บันทึกข้อมูลรายการแล้ว · กด “บันทึกและเผยแพร่” เพื่ออัปเดตหน้าเว็บ');
  } catch (error) { setMessage('commission-video-message', `บันทึกรายการไม่ได้: ${error.message}`, true); }
}

function addCommissionItem() {
  try {
    const data = readDraft();
    data.commission.push({ category: 'COMMISSION', title: 'รายการใหม่', details: '', price: '0', symbol: '✦', image: '', video: '' });
    $('content-json').value = JSON.stringify(data, null, 2);
    renderCommissionAdmin(data.commission.length - 1);
    $('commission-title').select();
    setMessage('commission-video-message', 'เพิ่มการ์ดใหม่แล้ว · แก้ข้อมูลและกดบันทึกรายการ');
  } catch (error) { setMessage('commission-video-message', error.message, true); }
}

function deleteCommissionItem() {
  try {
    const data = readDraft();
    const index = Number($('commission-item').value);
    const item = data.commission[index];
    if (!item) throw new Error('ไม่พบรายการ Commission ที่เลือก');
    if (!confirm(`ลบรายการ “${item.title || `Commission ${index + 1}`}” ออกจากหน้าเว็บหรือไม่?`)) return;
    data.commission.splice(index, 1);
    $('content-json').value = JSON.stringify(data, null, 2);
    renderCommissionAdmin(Math.max(0, index - 1));
    setMessage('commission-video-message', 'ลบรายการจากข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('commission-video-message', error.message, true); }
}

function writeCommissionImage(value, index = $('commission-item').value) {
  const data = readDraft();
  const item = data.commission?.[index];
  if (!item) throw new Error('ไม่พบรายการ Commission ที่เลือก');
  if (value) {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('ลิงก์รูปไม่ถูกต้อง');
    item.image = url.href;
  } else delete item.image;
  $('content-json').value = JSON.stringify(data, null, 2);
  renderCommissionAdmin(Number(index));
  setMessage('commission-video-message', 'อัปเดตรูปแล้ว · กด “บันทึกและเผยแพร่” เพื่อแสดงบนหน้า Commission');
}

async function uploadCommissionImage() {
  if (commissionUploading) return;
  let controls = [];
  try {
    const file = $('commission-image-file').files[0];
    if (!file) throw new Error('กรุณาเลือกไฟล์รูป');
    const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[file.type];
    if (!extension) throw new Error('รองรับ PNG, JPG และ WebP เท่านั้น');
    if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('ไฟล์รูปต้องไม่เกิน 10 MB');
    const index = Number($('commission-item').value);
    if (!readDraft().commission[index]) throw new Error('เลือก Commission ก่อนอัปโหลด');
    if (!config.storageBucket) throw new Error('ยังไม่ได้ตั้งค่า Firebase Storage');
    commissionUploading = true;
    controls = [...$('editor-panel').querySelectorAll('input, select, textarea, button')].map((node) => [node, node.disabled]);
    controls.forEach(([node]) => { node.disabled = true; });
    setMessage('commission-video-message', 'กำลังอัปโหลดรูป…');
    const { auth, storage, ref, uploadBytes, getDownloadURL } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์อัปโหลด');
    const imageRef = ref(storage, `commission-images/${crypto.randomUUID()}.${extension}`);
    await uploadBytes(imageRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
    writeCommissionImage(await getDownloadURL(imageRef), index);
  } catch (error) { setMessage('commission-video-message', `อัปโหลดรูปไม่ได้: ${error.message}`, true); }
  finally {
    commissionUploading = false;
    controls.forEach(([node, disabled]) => { node.disabled = disabled; });
  }
}

function writeCommissionVideo(value, index = $('commission-item').value) {
  const data = readDraft();
  const item = data.commission?.[index];
  if (!item) throw new Error('ไม่พบรายการ Commission ที่เลือก');
  if (value) { commissionMedia(value); item.video = value; }
  else delete item.video;
  delete item.youtubeId;
  delete item.driveId;
  $('content-json').value = JSON.stringify(data, null, 2);
  renderCommissionAdmin(Number(index));
  setMessage('commission-video-message', 'อัปเดตวิดีโอแล้ว · กด “บันทึกและเผยแพร่” เพื่อแสดงบนหน้า Commission');
}

function applyCommissionVideo() {
  try {
    const value = $('commission-video-url').value.trim();
    if (!value) throw new Error('กรุณาใส่ลิงก์วิดีโอ');
    writeCommissionVideo(value);
  } catch (error) { setMessage('commission-video-message', error.message, true); }
}

async function uploadCommissionVideo() {
  if (commissionUploading) return;
  let controls = [];
  try {
    const file = $('commission-video-file').files[0];
    const { extension, type } = commissionFileType(file);
    const index = $('commission-item').value;
    if (!readDraft().commission?.[index]) throw new Error('เลือก Commission ก่อนอัปโหลด');
    if (!config.storageBucket) throw new Error('ยังไม่ได้ตั้งค่า Firebase Storage');
    commissionUploading = true;
    controls = [...$('editor-panel').querySelectorAll('input, select, textarea, button')].map((node) => [node, node.disabled]);
    controls.forEach(([node]) => { node.disabled = true; });
    setMessage('commission-video-message', 'กำลังอัปโหลดวิดีโอ… 0%');
    const { auth, storage, ref, uploadBytesResumable, getDownloadURL } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์อัปโหลด');
    const videoRef = ref(storage, `commission-videos/${crypto.randomUUID()}.${extension}`);
    const task = uploadBytesResumable(videoRef, file, { contentType: type });
    await new Promise((resolve, reject) => task.on('state_changed', (snapshot) => {
      setMessage('commission-video-message', `กำลังอัปโหลดวิดีโอ… ${Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)}%`);
    }, reject, resolve));
    writeCommissionVideo(await getDownloadURL(videoRef), index);
  } catch (error) { setMessage('commission-video-message', `อัปโหลดไม่ได้: ${error.message}`, true); }
  finally {
    commissionUploading = false;
    controls.forEach(([node, disabled]) => { node.disabled = disabled; });
  }
}

function renderGalleryAdmin() {
  try {
    const data = readDraft();
    $('gallery-items').innerHTML = data.gallery.length
      ? data.gallery.map((item, index) => `<div class="gallery-admin-item"><div><strong>${escapeAdmin(item.title || `ผลงาน ${index + 1}`)}</strong><small>${escapeAdmin(item.fileName || item.tag || item.category || 'GALLERY')} · ${videoValue(item) ? 'VIDEO' : 'IMAGE'}</small></div><div class="admin-list-actions"><button type="button" data-edit-gallery="${index}">แก้ไข</button><button type="button" class="danger-button" data-delete-gallery="${index}">ลบ</button></div></div>`).join('')
      : '<p class="admin-message">ยังไม่มีผลงานใน Gallery</p>';
  } catch (error) { setMessage('gallery-message', `อ่านข้อมูล Gallery ไม่ได้: ${error.message}`, true); }
}

function renderGalleryPreview() {
  galleryPreviewObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  galleryPreviewObjectUrls = [];
  const previews = [];
  const imageFile = $('gallery-image-file').files[0];
  const imageUrl = $('gallery-image').value.trim();
  const videoFile = $('gallery-video-file').files[0];
  const videoUrl = $('gallery-video').value.trim();
  if (imageFile) {
    const url = URL.createObjectURL(imageFile);
    galleryPreviewObjectUrls.push(url);
    previews.push(`<figure><img src="${url}" alt="พรีวิวรูปผลงาน" /><figcaption>พรีวิวรูป</figcaption></figure>`);
  } else if (imageUrl) {
    try {
      const url = new URL(imageUrl);
      if (['https:', 'http:'].includes(url.protocol)) previews.push(`<figure><img src="${escapeAdmin(url.href)}" alt="พรีวิวรูปผลงาน" /><figcaption>พรีวิวรูป</figcaption></figure>`);
    } catch {}
  }
  if (videoFile) {
    const url = URL.createObjectURL(videoFile);
    galleryPreviewObjectUrls.push(url);
    previews.push(`<figure><video src="${url}" controls playsinline preload="metadata"></video><figcaption>พรีวิววิดีโอ</figcaption></figure>`);
  } else if (videoUrl) {
    try { previews.push(`<figure>${commissionVideoHtml({ video: videoUrl })}<figcaption>พรีวิววิดีโอ</figcaption></figure>`); }
    catch { previews.push('<span>ลิงก์วิดีโอนี้ยังไม่รองรับการพรีวิว</span>'); }
  }
  $('gallery-preview').innerHTML = previews.length ? previews.join('') : '<span>พรีวิวรูปหรือวิดีโอจะแสดงตรงนี้</span>';
}

function escapeAdmin(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function resetGalleryForm() {
  editingGalleryIndex = -1;
  for (const id of ['gallery-title', 'gallery-filename', 'gallery-tag', 'gallery-video', 'gallery-image', 'gallery-description']) $(id).value = '';
  $('gallery-video-file').value = '';
  $('gallery-image-file').value = '';
  $('gallery-category').value = 'rigging';
  $('gallery-apply').innerHTML = 'เพิ่มวิดีโอใน Gallery <span>＋</span>';
  $('gallery-cancel').hidden = true;
  setMessage('gallery-message', '');
  renderGalleryPreview();
}

function editGallery(index) {
  try {
    const item = readDraft().gallery[index];
    if (!item) throw new Error('ไม่พบรายการที่เลือก');
    editingGalleryIndex = index;
    $('gallery-title').value = item.title || '';
    $('gallery-filename').value = item.fileName || '';
    $('gallery-category').value = ['rigging', 'art', 'motion'].includes(item.category) ? item.category : 'rigging';
    $('gallery-tag').value = item.tag || '';
    $('gallery-video').value = videoValue(item);
    $('gallery-image').value = item.image || '';
    $('gallery-description').value = item.description || '';
    $('gallery-apply').innerHTML = 'อัปเดตวิดีโอรายการนี้ <span>✓</span>';
    $('gallery-cancel').hidden = false;
    $('gallery-title').focus();
    setMessage('gallery-message', `กำลังแก้ไขรายการที่ ${index + 1}`);
    renderGalleryPreview();
  } catch (error) { setMessage('gallery-message', error.message, true); }
}

function applyGalleryVideo() {
  try {
    const title = $('gallery-title').value.trim();
    const video = $('gallery-video').value.trim();
    const image = $('gallery-image').value.trim();
    if (!title) throw new Error('กรุณาใส่ชื่อผลงาน');
    if (!video && !image) throw new Error('กรุณาใส่รูปหรือวิดีโออย่างน้อยหนึ่งรายการ');
    if (video) {
      const url = new URL(video);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('ลิงก์วิดีโอต้องขึ้นต้นด้วย http:// หรือ https://');
    }
    if (image) {
      const url = new URL(image);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('ลิงก์รูปต้องขึ้นต้นด้วย http:// หรือ https://');
    }

    const data = readDraft();
    const palette = [['#82619b', '#282035'], ['#9076ad', '#241c31'], ['#ab6d91', '#312035'], ['#786aaf', '#1d2034']][data.gallery.length % 4];
    const current = editingGalleryIndex >= 0 ? data.gallery[editingGalleryIndex] : {};
    const next = {
      ...current,
      title,
      fileName: $('gallery-filename').value.trim(),
      category: $('gallery-category').value,
      tag: $('gallery-tag').value.trim() || 'VIDEO',
      video,
      image,
      description: $('gallery-description').value.trim(),
      icon: current.icon || '▶',
      mid: current.mid || palette[0],
      deep: current.deep || palette[1]
    };
    delete next.youtubeId;
    delete next.driveId;
    if (editingGalleryIndex >= 0) data.gallery[editingGalleryIndex] = next;
    else data.gallery.push(next);
    $('content-json').value = JSON.stringify(data, null, 2);
    const message = editingGalleryIndex >= 0 ? 'อัปเดตรายการแล้ว' : 'เพิ่มผลงานแล้ว';
    resetGalleryForm();
    renderGalleryAdmin();
    setMessage('gallery-message', `${message} · กด “บันทึกและเผยแพร่” เพื่ออัปเดตหน้าเว็บ`);
  } catch (error) { setMessage('gallery-message', `ยังเพิ่มวิดีโอไม่ได้: ${error.message}`, true); }
}

function deleteGalleryItem(index) {
  try {
    const data = readDraft();
    const item = data.gallery[index];
    if (!item) throw new Error('ไม่พบวิดีโอที่เลือก');
    if (!confirm(`ลบ “${item.title || `ผลงาน ${index + 1}`}” ออกจาก Gallery หรือไม่?`)) return;
    data.gallery.splice(index, 1);
    $('content-json').value = JSON.stringify(data, null, 2);
    resetGalleryForm();
    renderGalleryAdmin();
    setMessage('gallery-message', 'ลบวิดีโอจากข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('gallery-message', error.message, true); }
}

async function uploadGalleryVideo() {
  if (commissionUploading) return;
  let controls = [];
  try {
    const file = $('gallery-video-file').files[0];
    const { extension, type } = commissionFileType(file);
    const originalName = file.name || `video.${extension}`;
    if (!$('gallery-title').value.trim()) $('gallery-title').value = originalName.replace(/\.(mp4|webm)$/i, '');
    if (!$('gallery-filename').value.trim()) $('gallery-filename').value = originalName;
    if (!config.storageBucket) throw new Error('ยังไม่ได้ตั้งค่า Firebase Storage');
    commissionUploading = true;
    controls = [...$('editor-panel').querySelectorAll('input, select, textarea, button')].map((node) => [node, node.disabled]);
    controls.forEach(([node]) => { node.disabled = true; });
    setMessage('gallery-message', 'กำลังอัปโหลดวิดีโอ… 0%');
    const { auth, storage, ref, uploadBytesResumable, getDownloadURL } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์อัปโหลด');
    const videoRef = ref(storage, `gallery-videos/${crypto.randomUUID()}.${extension}`);
    const task = uploadBytesResumable(videoRef, file, { contentType: type });
    await new Promise((resolve, reject) => task.on('state_changed', (snapshot) => {
      setMessage('gallery-message', `กำลังอัปโหลดวิดีโอ… ${Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)}%`);
    }, reject, resolve));
    $('gallery-video').value = await getDownloadURL(videoRef);
    applyGalleryVideo();
  } catch (error) { setMessage('gallery-message', `อัปโหลดวิดีโอไม่ได้: ${error.message}`, true); }
  finally {
    commissionUploading = false;
    controls.forEach(([node, disabled]) => { node.disabled = disabled; });
  }
}

async function uploadGalleryImage() {
  if (commissionUploading) return;
  let controls = [];
  try {
    const file = $('gallery-image-file').files[0];
    if (!file) throw new Error('กรุณาเลือกไฟล์รูป');
    const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[file.type];
    if (!extension) throw new Error('รองรับ PNG, JPG และ WebP เท่านั้น');
    if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('ไฟล์รูปต้องไม่เกิน 10 MB');
    if (!config.storageBucket) throw new Error('ยังไม่ได้ตั้งค่า Firebase Storage');
    commissionUploading = true;
    controls = [...$('editor-panel').querySelectorAll('input, select, textarea, button')].map((node) => [node, node.disabled]);
    controls.forEach(([node]) => { node.disabled = true; });
    setMessage('gallery-message', 'กำลังอัปโหลดรูป…');
    const { auth, storage, ref, uploadBytes, getDownloadURL } = await connectFirebase();
    const user = auth.currentUser;
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== adminEmail) throw new Error('บัญชีผู้ใช้ไม่มีสิทธิ์อัปโหลด');
    const imageRef = ref(storage, `gallery-images/${crypto.randomUUID()}.${extension}`);
    await uploadBytes(imageRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
    $('gallery-image').value = await getDownloadURL(imageRef);
    $('gallery-image-file').value = '';
    renderGalleryPreview();
    setMessage('gallery-message', 'อัปโหลดรูปแล้ว · ตรวจพรีวิวและกดเพิ่มหรืออัปเดตผลงาน');
  } catch (error) { setMessage('gallery-message', `อัปโหลดรูปไม่ได้: ${error.message}`, true); }
  finally {
    commissionUploading = false;
    controls.forEach(([node, disabled]) => { node.disabled = disabled; });
  }
}

function renderAddonsAdmin() {
  try {
    const data = readDraft();
    $('addon-items').innerHTML = data.addons.length
      ? data.addons.map((item, index) => `<div class="gallery-admin-item"><div><strong>${escapeAdmin(item?.[0] || `Add-on ${index + 1}`)}</strong><small>${escapeAdmin(item?.[1] || '')}</small></div><div class="admin-list-actions"><button type="button" data-edit-addon="${index}">แก้ไข</button><button type="button" class="danger-button" data-delete-addon="${index}">ลบ</button></div></div>`).join('')
      : '<p class="admin-message">ยังไม่มี Add-on</p>';
  } catch (error) { setMessage('addon-message', error.message, true); }
}

function resetAddonForm() {
  editingAddonIndex = -1;
  $('addon-name').value = '';
  $('addon-price').value = '';
  $('addon-support').value = '';
  $('addon-details').value = '';
  $('addon-apply').textContent = 'เพิ่ม Add-on ＋';
  $('addon-cancel').hidden = true;
}

function editAddon(index) {
  try {
    const item = readDraft().addons[index];
    if (!item) throw new Error('ไม่พบ Add-on ที่เลือก');
    editingAddonIndex = index;
    $('addon-name').value = item[0] || '';
    $('addon-price').value = item[1] || '';
    $('addon-support').value = item[4] || '';
    $('addon-details').value = item[6] || '';
    $('addon-apply').textContent = 'บันทึก Add-on ✓';
    $('addon-cancel').hidden = false;
    $('addon-name').focus();
  } catch (error) { setMessage('addon-message', error.message, true); }
}

function applyAddon() {
  try {
    const name = $('addon-name').value.trim();
    const price = $('addon-price').value.trim();
    const support = $('addon-support').value.trim();
    const details = $('addon-details').value.trim();
    if (!name || !price) throw new Error('กรุณาใส่ชื่อและราคา Add-on');
    const data = readDraft();
    if (editingAddonIndex >= 0) data.addons[editingAddonIndex] = [name, price, data.addons[editingAddonIndex]?.[2] || '', data.addons[editingAddonIndex]?.[3] || '', support, data.addons[editingAddonIndex]?.[5] || '', details, data.addons[editingAddonIndex]?.[7] || ''];
    else data.addons.push([name, price, '', '', support, '', details, '']);
    $('content-json').value = JSON.stringify(data, null, 2);
    const message = editingAddonIndex >= 0 ? 'แก้ไข Add-on แล้ว' : 'เพิ่ม Add-on แล้ว';
    resetAddonForm();
    renderAddonsAdmin();
    setMessage('addon-message', `${message} · กด “บันทึกและเผยแพร่” เพื่ออัปเดตหน้าเว็บ`);
  } catch (error) { setMessage('addon-message', error.message, true); }
}

function deleteAddon(index) {
  try {
    const data = readDraft();
    const item = data.addons[index];
    if (!item) throw new Error('ไม่พบ Add-on ที่เลือก');
    if (!confirm(`ลบ Add-on “${item[0]}” หรือไม่?`)) return;
    data.addons.splice(index, 1);
    $('content-json').value = JSON.stringify(data, null, 2);
    resetAddonForm();
    renderAddonsAdmin();
    setMessage('addon-message', 'ลบ Add-on จากข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('addon-message', error.message, true); }
}

function renderContactsAdmin() {
  try {
    const data = readDraft();
    $('contact-items').innerHTML = data.socials.length
      ? data.socials.map((item, index) => `<div class="gallery-admin-item"><div><strong>${escapeAdmin(item?.[0] || `ช่องทาง ${index + 1}`)}</strong><small>${escapeAdmin(item?.[1] || '')}</small></div><div class="admin-list-actions"><button type="button" data-edit-contact="${index}">แก้ไข</button><button type="button" class="danger-button" data-delete-contact="${index}">ลบ</button></div></div>`).join('')
      : '<p class="admin-message">ยังไม่มีช่องทางติดต่อ</p>';
  } catch (error) { setMessage('contact-message', error.message, true); }
}

function resetContactForm() {
  editingContactIndex = -1;
  $('contact-name').value = '';
  $('contact-url').value = '';
  $('contact-apply').textContent = 'เพิ่มช่องทาง ＋';
  $('contact-cancel').hidden = true;
}

function editContact(index) {
  try {
    const item = readDraft().socials[index];
    if (!item) throw new Error('ไม่พบช่องทางที่เลือก');
    editingContactIndex = index;
    $('contact-name').value = item[0] || '';
    $('contact-url').value = item[1] || '';
    $('contact-apply').textContent = 'บันทึกช่องทาง ✓';
    $('contact-cancel').hidden = false;
    $('contact-name').focus();
  } catch (error) { setMessage('contact-message', error.message, true); }
}

function applyContact() {
  try {
    const name = $('contact-name').value.trim();
    const value = $('contact-url').value.trim();
    if (!name || !value) throw new Error('กรุณาใส่ชื่อช่องทางและลิงก์');
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://');
    const data = readDraft();
    if (editingContactIndex >= 0) data.socials[editingContactIndex] = [name, url.href];
    else data.socials.push([name, url.href]);
    $('content-json').value = JSON.stringify(data, null, 2);
    const message = editingContactIndex >= 0 ? 'แก้ไขช่องทางแล้ว' : 'เพิ่มช่องทางแล้ว';
    resetContactForm();
    renderContactsAdmin();
    setMessage('contact-message', `${message} · กด “บันทึกและเผยแพร่” เพื่ออัปเดตหน้าเว็บ`);
  } catch (error) { setMessage('contact-message', error.message, true); }
}

function deleteContact(index) {
  try {
    const data = readDraft();
    const item = data.socials[index];
    if (!item) throw new Error('ไม่พบช่องทางที่เลือก');
    if (!confirm(`ลบช่องทาง “${item[0]}” หรือไม่?`)) return;
    data.socials.splice(index, 1);
    $('content-json').value = JSON.stringify(data, null, 2);
    resetContactForm();
    renderContactsAdmin();
    setMessage('contact-message', 'ลบช่องทางจากข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('contact-message', error.message, true); }
}

function renderTosAdmin(preferredIndex) {
  try {
    const data = readDraft();
    $('tos-item').innerHTML = data.terms.map((item, index) => `<option value="${index}">${escapeAdmin(item.title || `หัวข้อ ${index + 1}`)}</option>`).join('');
    const requested = preferredIndex ?? Number($('tos-item').value || 0);
    const selected = data.terms.length ? Math.min(Math.max(Number(requested) || 0, 0), data.terms.length - 1) : -1;
    if (selected >= 0) $('tos-item').value = String(selected);
    selectTosItem();
  } catch (error) { setMessage('tos-message', error.message, true); }
}

function selectTosItem() {
  try {
    const item = readDraft().terms?.[$('tos-item').value];
    $('tos-title').value = item?.title || '';
    $('tos-icon').value = item?.icon || '';
    $('tos-body').value = item?.body || '';
    $('tos-save').disabled = !item;
    $('tos-delete').disabled = !item;
    setMessage('tos-message', item ? '' : 'กด “เพิ่มหัวข้อ” เพื่อสร้าง TOS ใหม่');
  } catch (error) { setMessage('tos-message', error.message, true); }
}

function addTosItem() {
  try {
    const data = readDraft();
    data.terms.push({ title: 'หัวข้อใหม่', icon: '♡', body: '' });
    $('content-json').value = JSON.stringify(data, null, 2);
    renderTosAdmin(data.terms.length - 1);
    $('tos-title').select();
  } catch (error) { setMessage('tos-message', error.message, true); }
}

function applyTosItem() {
  try {
    const data = readDraft();
    const index = Number($('tos-item').value);
    if (!data.terms[index]) throw new Error('ไม่พบหัวข้อ TOS ที่เลือก');
    const title = $('tos-title').value.trim();
    const body = $('tos-body').value.trim();
    if (!title || !body) throw new Error('กรุณาใส่ชื่อหัวข้อและรายละเอียด');
    data.terms[index] = { ...data.terms[index], title, icon: $('tos-icon').value.trim() || '♡', body };
    $('content-json').value = JSON.stringify(data, null, 2);
    renderTosAdmin(index);
    setMessage('tos-message', 'แก้ไขหัวข้อแล้ว · กด “บันทึกและเผยแพร่” เพื่ออัปเดตหน้าเว็บ');
  } catch (error) { setMessage('tos-message', error.message, true); }
}

function deleteTosItem() {
  try {
    const data = readDraft();
    const index = Number($('tos-item').value);
    const item = data.terms[index];
    if (!item) throw new Error('ไม่พบหัวข้อ TOS ที่เลือก');
    if (!confirm(`ลบหัวข้อ “${item.title || `TOS ${index + 1}`}” หรือไม่?`)) return;
    data.terms.splice(index, 1);
    $('content-json').value = JSON.stringify(data, null, 2);
    renderTosAdmin(Math.max(0, index - 1));
    setMessage('tos-message', 'ลบหัวข้อจากข้อมูลร่างแล้ว · กด “บันทึกและเผยแพร่” เพื่อยืนยัน');
  } catch (error) { setMessage('tos-message', error.message, true); }
}

$('login').addEventListener('click', login);
$('queue-url-input').addEventListener('input', () => { queueUrlDirty = true; });
$('queue-apply').addEventListener('click', applyQueueUrl);
$('password').addEventListener('keydown', (event) => { if (event.key === 'Enter') login(); });
$('save').addEventListener('click', save);
$('logout').addEventListener('click', async () => { if (firebaseServices) await firebaseServices.signOut(firebaseServices.auth); });
$('gallery-apply').addEventListener('click', applyGalleryVideo);
$('gallery-upload').addEventListener('click', uploadGalleryVideo);
$('gallery-image-upload').addEventListener('click', uploadGalleryImage);
$('gallery-cancel').addEventListener('click', resetGalleryForm);
$('gallery-video').addEventListener('input', renderGalleryPreview);
$('gallery-image').addEventListener('input', renderGalleryPreview);
$('gallery-video-file').addEventListener('change', renderGalleryPreview);
$('gallery-image-file').addEventListener('change', renderGalleryPreview);
$('gallery-items').addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-gallery]');
  const deleteButton = event.target.closest('[data-delete-gallery]');
  if (editButton) editGallery(Number(editButton.dataset.editGallery));
  if (deleteButton) deleteGalleryItem(Number(deleteButton.dataset.deleteGallery));
});
$('music-upload').addEventListener('click', uploadMusic);
$('music-new').addEventListener('click', () => { resetMusicForm(); $('music-title-input').focus(); });
$('music-save').addEventListener('click', saveMusicMetadata);
$('music-delete').addEventListener('click', () => deleteMusic());
$('music-items').addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-music]');
  const deleteButton = event.target.closest('[data-delete-music]');
  if (editButton) editMusic(Number(editButton.dataset.editMusic));
  if (deleteButton) deleteMusic(Number(deleteButton.dataset.deleteMusic));
});
$('character-upload').addEventListener('click', uploadCharacterSheet);
$('commission-item').addEventListener('change', selectCommissionItem);
$('commission-add').addEventListener('click', addCommissionItem);
$('commission-save-item').addEventListener('click', applyCommissionItem);
$('commission-delete').addEventListener('click', deleteCommissionItem);
$('commission-image-upload').addEventListener('click', uploadCommissionImage);
$('commission-image-remove').addEventListener('click', () => {
  try { writeCommissionImage(''); } catch (error) { setMessage('commission-video-message', error.message, true); }
});
$('commission-video-url').addEventListener('input', () => { commissionVideoDirty = true; });
$('commission-video-apply').addEventListener('click', applyCommissionVideo);
$('commission-video-upload').addEventListener('click', uploadCommissionVideo);
$('commission-video-remove').addEventListener('click', () => {
  try { writeCommissionVideo(''); } catch (error) { setMessage('commission-video-message', error.message, true); }
});
$('addon-apply').addEventListener('click', applyAddon);
$('addon-new').addEventListener('click', () => { resetAddonForm(); $('addon-name').focus(); });
$('addon-cancel').addEventListener('click', resetAddonForm);
$('addon-items').addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-addon]');
  const deleteButton = event.target.closest('[data-delete-addon]');
  if (editButton) editAddon(Number(editButton.dataset.editAddon));
  if (deleteButton) deleteAddon(Number(deleteButton.dataset.deleteAddon));
});
$('tos-item').addEventListener('change', selectTosItem);
$('tos-add').addEventListener('click', addTosItem);
$('tos-save').addEventListener('click', applyTosItem);
$('tos-delete').addEventListener('click', deleteTosItem);
$('contact-apply').addEventListener('click', applyContact);
$('contact-new').addEventListener('click', () => { resetContactForm(); $('contact-name').focus(); });
$('contact-cancel').addEventListener('click', resetContactForm);
$('contact-items').addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-contact]');
  const deleteButton = event.target.closest('[data-delete-contact]');
  if (editButton) editContact(Number(editButton.dataset.editContact));
  if (deleteButton) deleteContact(Number(deleteButton.dataset.deleteContact));
});
$('translation-sections').addEventListener('input', updateTranslation);
$('content-json').addEventListener('change', () => { renderGalleryAdmin(); renderCommissionAdmin(); renderAddonsAdmin(); renderTosAdmin(); renderMusicAdmin(); renderContactsAdmin(); renderTranslationsAdmin(); });
window.addEventListener('hashchange', showAdminPage);
showAdminPage();

if (!readyConfig()) setMessage('auth-message', 'ตั้งค่า Firebase Web App ใน firebase-config.js และอีเมลผู้ดูแลใน admin-config.js ก่อนค่ะ');
else connectFirebase().catch((error) => setMessage('auth-message', `เชื่อมต่อ Firebase ไม่สำเร็จ: ${error.message}`, true));
