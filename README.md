# Anonymour commission portfolio

เว็บพอร์ตโฟลิโอภาษาไทย/อังกฤษสำหรับ Live2D rigging, YCH, illustration และงานเสริม ใช้ HTML/CSS/JavaScript แบบ static เพื่อ deploy บน Cloudflare Pages ได้โดยตรง

## สิ่งที่มีในโปรเจกต์

- หน้าแรก, commission, add-ons, commission queue บน Notion, gallery และ terms of service โดยช่องทางติดต่ออยู่บนหน้าแรก
- Responsive layout, เมนูมือถือ, ตัวกรองแกลเลอรี, modal รายละเอียด/ราคา, TOS accordion
- Reveal animation ตอนเลื่อนหน้า และประกายตามเมาส์ (ปิดตาม `prefers-reduced-motion`)
- `/admin` สำหรับผู้ดูแลแก้ข้อมูล แล้วบันทึกเอกสารเดียวไป Firebase Cloud Firestore
- หน้า admin มีแบบฟอร์มเพิ่มและแก้ไขวิดีโอใน Gallery รองรับลิงก์ YouTube, Google Drive และไฟล์ `.mp4` / `.webm` โดยตรง พร้อมภาพปกเสริม
- ตัวเล่นเพลงหน้าแรกใช้ไฟล์ `.mp3` จาก Firebase Storage และอัปโหลดไฟล์ใหม่ได้จากหน้า admin
- ปุ่ม OC Character Sheet เปิดรูปแบบป๊อปอัป และเปลี่ยนรูป PNG, JPG หรือ WebP ได้จากหน้า admin
- Firestore rules เปิดอ่านเฉพาะเอกสารเนื้อหาสาธารณะ และให้ผู้ดูแลอีเมลที่ยืนยันแล้วเขียนได้
- Cloudflare Pages config, headers และ redirect สำหรับหน้า admin

## เปิดพรีวิวในเครื่อง

รัน `node preview.mjs` ในโฟลเดอร์โปรเจกต์ แล้วเปิด http://127.0.0.1:4173/ (หลังบ้าน: http://127.0.0.1:4173/admin)
เปิดผ่านเซิร์ฟเวอร์นี้เพื่อให้ JavaScript modules และข้อมูลบนหน้าเว็บทำงาน ไม่เปิดโฟลเดอร์ด้วย `file:///`
กด Ctrl+C ในเทอร์มินัลเมื่อต้องการหยุดพรีวิว

## ตั้งค่า Firebase ก่อนใช้งานระบบหลังบ้าน

1. สร้าง Firebase project และ Web App ใน Firebase Console แล้วเปิด **Authentication → Email/Password** และสร้างบัญชีผู้ดูแลที่ยืนยันอีเมลแล้ว
2. สร้าง Cloud Firestore database และเปิด Firebase Storage
3. วาง Firebase web config ใน `firebase-config.js` และอีเมลผู้ดูแลใน `admin-config.js`
4. เปลี่ยน `REPLACE_WITH_VERIFIED_ADMIN_EMAIL` ใน `firestore.rules` และ `storage.rules` เป็นอีเมลเดียวกัน แล้ว deploy rules จาก Firebase Console หรือ Firebase CLI
5. เปิด `/admin` เพื่ออัปโหลดไฟล์เพลง MP3 หรือรูป OC แก้ข้อมูล และกดบันทึก ข้อมูลสาธารณะถูกเก็บที่ `publicContent/site` ส่วนไฟล์อยู่ใน Firebase Storage

Firebase web config เป็นข้อมูลระบุตัวโปรเจกต์สาธารณะ ไม่ใช่ service-account key หรือรหัสลับ ห้ามวาง private key หรือ service account ในเว็บ

ค่าเริ่มต้นใน `app.js` ทำให้หน้าเว็บแสดงได้ก่อนเชื่อม Firebase เมื่อยังไม่ตั้งค่า Firebase หน้าหลังบ้านจะไม่เปิดรับการเข้าสู่ระบบ

## ข้อมูลผลงานและคิว

### วิดีโอหน้า Commission

ใน `/admin` ไปที่ **วิดีโอหน้า Commission** แล้วเลือกรายการที่ต้องการ:

- วางลิงก์ YouTube (watch, youtu.be, Shorts หรือ Live) แล้วกด **ใช้ลิงก์นี้**
- หรือเลือกไฟล์ **MP4 / WebM ไม่เกิน 100 MB** จากอุปกรณ์ แล้วกด **อัปโหลดวิดีโอ** รอจนแสดงตัวอย่าง
- กด **บันทึกและเผยแพร่** เพื่อแสดงวิดีโอใต้รายละเอียดรายการในหน้า Commission
- ปุ่ม **นำวิดีโอออกจากรายการ** ลบการแสดงวิดีโอในข้อมูลร่าง ต้องบันทึกอีกครั้ง ไฟล์เดิมใน Storage จะไม่ถูกลบ

ข้อมูลเก็บใน `commission[].video` เป็น URL YouTube หรือ URL ไฟล์ HTTPS ส่วนไฟล์อัปโหลดเก็บใน `commission-videos/` บน Firebase Storage ต้องตั้งค่า Firebase และเผยแพร่ `storage.rules` ที่มีส่วนนี้ (แทนอีเมลผู้ดูแลก่อน) จึงจะอัปโหลดได้ วิดีโอ YouTube ต้องอนุญาตการฝังจากเจ้าของวิดีโอ ตัวเล่นไม่เริ่มเล่นอัตโนมัติ

Gallery ฝังตัวอย่าง Live2D, YCH, loading screen, emote และ idle animation ที่เชื่อมจาก Carrd ผู้ดูแลเพิ่มหรือแก้ไขวิดีโอผ่านแบบฟอร์มบน `/admin` โดยวาง URL จาก YouTube, Google Drive หรือไฟล์วิดีโอโดยตรงได้ ส่วน Commission Queue ฝังบอร์ด Notion จาก `queue.url` และมีปุ่มเปิด Notion แยก ผู้ดูแลวางลิงก์หน้าที่เผยแพร่หรือโค้ดจาก Embed this page ในส่วน “บอร์ดคิวงาน” ของ CMS แล้วกด “บันทึกและเผยแพร่” บอร์ดต้องเผยแพร่บน Notion ก่อน และรองรับโดเมน notion.site / notion.so

ลิงก์ Twitch, X และ VGen ใช้ URL โปรไฟล์ที่พบจาก VGen; Discord และ TikTok พากลับไปที่ Carrd ซึ่งมีปุ่มโปรไฟล์ต้นทางให้กดต่อ ผู้ดูแลแก้ URL ได้ใน `socials` ผ่านหน้า admin

## Deploy ขึ้น Cloudflare Pages

เชื่อม GitHub repository กับ Cloudflare Pages แล้วตั้ง build command เป็น `exit 0` และ build output directory เป็น `.` (root ของโปรเจกต์) จากนั้น Pages จะ deploy ทุกครั้งที่มี push ไปยัง production branch หรือใช้ Wrangler ตามขั้นตอนของ Cloudflare Pages

ก่อนเปิด public ให้ตั้งค่า Firebase, เปลี่ยนอีเมลผู้ดูแลใน Firestore rules และแทน gallery placeholders กับลิงก์โซเชียลด้วยข้อมูลจริง
