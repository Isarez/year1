# นกฮูกสนุกคิด — เตรียมสอบ ป.1

เว็บแอปไฟล์เดียว (`index.html`, ไม่มี build step) สำหรับเตรียมสอบเข้า ป.1 deploy ผ่าน GitHub Pages จาก branch `main` ที่ https://isarez.github.io/year1/

## กฎการทำงานในโปรเจคนี้

- **ตอบผู้ใช้เป็นภาษาไทยเสมอ** ไม่ว่าจะถามอะไร (โค้ด/ชื่อตัวแปรเป็นภาษาอังกฤษได้ตามปกติ)
- **ห้าม `git push` เอง** ต้องถามผู้ใช้ก่อนทุกครั้ง แม้จะ commit ไปแล้วก็ตาม
- **ตรวจสอบก่อนบอกว่าทำเสร็จ**: รัน JS syntax check กับ `index.html` ก่อนส่งมอบงานทุกครั้ง เช่น
  ```bash
  node -e "
  const fs = require('fs');
  const html = fs.readFileSync('index.html','utf8');
  const js = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] || '';
  try { new Function(js); console.log('OK JS syntax'); } catch(e){ console.error('ERROR:', e.message); }
  "
  ```
- **หลัง push/deploy สำเร็จทุกครั้ง**:
  1. สรุปสิ่งที่เปลี่ยนแปลงสั้นๆ ให้ผู้ใช้ทราบ
  2. เขียนสรุปนั้นลงไฟล์นี้ (`CLAUDE.md`) ด้วย โดยเพิ่มเป็นรายการใหม่ในหัวข้อ "ประวัติการเปลี่ยนแปลง (changelog)" ด้านล่าง (รูปแบบ: `- YYYY-MM-DD: สรุปสั้นๆ`) และถ้าเปลี่ยนแปลงพฤติกรรม/สถานะสำคัญของแอป ให้อัปเดตหัวข้อ "สถานะปัจจุบันของแอป" ให้ตรงด้วย
  3. ก่อน push/deploy ทุกครั้ง ให้ตรวจและอัปเดต `README.md` ให้ตรงกับสถานะล่าสุดของแอปด้วย (เช่น ฟีเจอร์ใหม่, หมวดหมู่ใหม่) แล้ว commit `README.md` ไปพร้อมกับ `CLAUDE.md` และ `index.html` ใน push เดียวกัน

## สถานะปัจจุบันของแอป (สำคัญ อย่าย้อนกลับโดยไม่ถาม)

- **ธีมกลางวัน/กลางคืน**: ปุ่ม `#theme-toggle` ใน header สลับ `body.night-mode`, จำค่าไว้ที่ `localStorage['p1quiz_theme']`. กลางคืน: ท้องฟ้าเปลี่ยนเป็นสีกรมท่า, พระอาทิตย์ (`.bg-sun`) fade ออกและพระจันทร์ (`.bg-moon`) fade เข้า, เมฆเปลี่ยนสี, ลูกโป่งลอยเปลี่ยนเป็นดาว. ตัวอักษรที่ไม่ได้อยู่บนการ์ดขาว/ครีม (header title, hero, footer) ต้องมี override สี `body.night-mode` เพราะสีเริ่มต้น (`--ink`/`--ink-soft` น้ำตาลเข้ม) อ่านไม่ออกบนพื้นหลังกลางคืน
  - ข้อควรระวัง CSS: `@keyframes` ที่ animate `opacity` จะ override static opacity rule เสมอ ไม่ว่าจะ specificity อะไร — ถ้าจะซ่อน/โชว์ element ตามธีม ต้อง scope animation ไว้ใน selector ของธีมนั้นๆ ด้วย ไม่ใช่ใส่ไว้ที่ base rule
  - Grid ที่มีเนื้อหาไม่ยอมหด (เช่น emoji ใหญ่) ต้องใช้ `grid-template-columns:repeat(N,minmax(0,1fr))` ไม่ใช่ `repeat(N,1fr)` เฉยๆ ไม่งั้นจะ overflow ออกนอก panel บนจอมือถือแคบ (`#emoji-picker` เจอปัญหานี้มาแล้ว)
- **เพลงพื้นหลัง**: procedural Web Audio (ไม่ใช่ไฟล์เสียง) default เป็น **เปิด** สำหรับผู้ใช้ใหม่ (`localStorage['p1quiz_music'] !== 'off'`) เสียงเบา (`0.025`) ห้ามปรับเสียงดังขึ้นโดยไม่ถาม
- **หมวดหมู่ (`CATS`)**: math, thai (ภาษาไทย 1), thai2 (ล็อกจนกว่าจะทำ thai1 จบ), english, behavior, animals, days, iq1-iq4 (ล็อกตามลำดับผ่าน `CAT_REQUIRES`)
- **"days" category**: ค่าตำแหน่งคำตอบถูก shuffle แบบ one-time manual fix ไปแล้ว (ของเดิมตอบ index 0 หมด) — อย่า shuffle ซ้ำอีก
- **พื้นหลังกลางวัน**: ท้องฟ้าสีฟ้า gradient, มีพระอาทิตย์หมุนช้าๆ, เมฆลอย, ลูกโป่งลอย, ประกายดาวระยิบระยับ — เคยมีสายรุ้งแล้วเอาออกตามคำขอผู้ใช้ **ห้ามใส่กลับโดยไม่ถาม**
- **นกฮูกมาสคอต**: มุมขวาล่าง คลิกแล้วสุ่มข้อความให้กำลังใจจาก `OWL_MSGS.cheer` (คนละปุ่มกับสมุดสติกเกอร์ `#sticker-tally-btn`)
- **Favicon/ไอคอน**: `assets/favicon.svg` เป็น source of truth ถ้าแก้ต้อง regenerate PNG ทุกไซส์ด้วย `rsvg-convert -w <size> -h <size> assets/favicon.svg -o assets/<name>.png`
- **ข้อมูลผู้ใช้ทั้งหมดเก็บใน `localStorage` เท่านั้น ไม่มี backend** — footer มีข้อความยืนยันเรื่องนี้ ต้องคงความจริงนี้ไว้ถ้าจะเพิ่มฟีเจอร์ sync/backend ในอนาคต
- **มินิเกม AR (จับคู่นิ้วมือ)**: หมวด `ar-thai`/`ar-eng` (ต่อประโยค ลากคำใส่ช่องตามลำดับ) และ `ar-math` (คิดเลข บวก/ลบ 1-2 หลัก ลากการ์ดคำตอบที่ถูกใส่ช่องเดียว) ทั้ง 3 หมวดมี `isNew:true` ทำให้ขึ้นป้าย "NEW ✨" บนการ์ดหน้าเลือกหมวด (ลบออกเมื่อผู้ใช้เห็นว่าเกมไม่ใหม่แล้วโดยถามก่อน). หน้าเลือกหมวดแบ่งเป็น 2 section: "คำถาม-คำตอบ" (`#cat-grid`) กับ "การโต้ตอบ" (`#cat-grid-interactive`, มีแต่หมวด type `ar`)
- **Theme transition**: ท้องฟ้ากลางวัน/กลางคืนใช้ 2 เลเยอร์ `.bg-sky-day`/`.bg-sky-night` ซ้อนกันแล้ว crossfade ด้วย `opacity 2s` (ไม่ใช้ `transition:background` บน gradient เพราะเบราว์เซอร์ tween gradient ตรงๆ ไม่ได้) พระอาทิตย์/พระจันทร์ใช้ wrapper div แยกจาก SVG เดิมเพื่อทำ transform translateY แยกจาก animation หมุน/pulse เดิม (element เดียวมี transform 2 ระบบพร้อมกันไม่ได้)
- **ปุ่มวิธีติดตั้งแอป**: `#install-toggle` เป็นปุ่ม text ("วิธีติดตั้งแอปบน iPad/แท็บเล็ต") ลอยมุมล่างซ้าย (`.install-link-btn`) ไม่ใช่ icon ใน header อีกต่อไป กดแล้วเปิด `#install-modal` (คำแนะนำ iPad/iPhone Safari + Android Chrome) ซ่อนอัตโนมัติตอนอยู่ใน AR view (`body.ar-open .install-link-btn{display:none}`)
- **ปุ่มเต็มหน้าจอ**: มี 2 ปุ่มที่ผูก logic เดียวกัน — `#fullscreen-toggle` ใน header (หน้าปกติ) และ `#ar-fullscreen-toggle` ใน `.quiz-top` ของ AR view (มุมขวาบน ข้าง `#ar-level-counter`) ทั้งคู่ผูกกับ `fsBtns` array และ `refreshFsBtn()` เดียวกัน ถ้าเพิ่มปุ่มเต็มหน้าจอใหม่ให้เพิ่ม id เข้า array นี้แทนการเขียน handler แยก

## ประวัติการเปลี่ยนแปลง (changelog)

- 2026-07-02: เพิ่มมินิเกม AR 3 หมวด (ต่อประโยคไทย/Eng, คิดเลข) พร้อมแก้บั๊กจับ/วางการ์ด, ปรับ layout ช่องวางขึ้นด้านบน, style glassmorphism, แยกหน้าเลือกหมวดเป็น 2 section, เพิ่ม animation พระอาทิตย์ตก-พระจันทร์ขึ้นและ crossfade สีท้องฟ้าตอนสลับธีม, เพิ่มป้าย NEW บนการ์ดหมวดใหม่
- 2026-07-02: เพิ่มปุ่ม "วิธีติดตั้งแอปบน iPad/แท็บเล็ต" (ย้ายจาก icon ใน header มาเป็นปุ่ม text ลอยมุมล่างซ้าย) และเพิ่มปุ่มเต็มหน้าจอในโหมด AR (มุมขวาบน)
