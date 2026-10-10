// Classic script: the file:// notice must work even when ES modules are blocked.
(() => {
  const frame = document.getElementById('queue-embed');
  const loading = document.getElementById('queue-loading');
  const message = document.getElementById('queue-embed-message');
  const retry = document.getElementById('queue-retry');
  const preview = document.getElementById('queue-preview-link');
  if (!frame) return;

  if (location.protocol === 'file:') {
    frame.hidden = true;
    loading.hidden = true;
    retry.hidden = true;
    preview.hidden = false;
    message.textContent = 'หน้านี้เปิดจากไฟล์ในเครื่อง กรุณาเปิดผ่านพรีวิวเว็บไซต์เพื่อดูบอร์ด Notion';
    message.hidden = false;
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
    return;
  }

  let timeout;
  const stopLoading = () => { clearTimeout(timeout); loading.hidden = true; };
  const startLoading = () => {
    clearTimeout(timeout);
    message.hidden = true;
    loading.hidden = false;
    timeout = setTimeout(() => {
      loading.hidden = true;
      message.textContent = 'Notion ใช้เวลาโหลดนาน ลองโหลดบอร์ดอีกครั้ง หรือกด “เปิด Notion” เพื่อดูคิวงาน';
      message.hidden = false;
    }, 15000);
  };
  frame.addEventListener('queue:loading', startLoading);
  frame.addEventListener('queue:idle', stopLoading);
  frame.addEventListener('load', stopLoading);
  frame.addEventListener('error', () => {
    stopLoading();
    message.textContent = 'โหลดบอร์ดไม่สำเร็จ ลองอีกครั้งหรือกด “เปิด Notion”';
    message.hidden = false;
  });
  retry.addEventListener('click', () => {
    const source = frame.getAttribute('src');
    if (!source) return;
    startLoading();
    frame.src = source;
  });
  startLoading();
})();
