/* ============================================================
   บ้านของหนู — ผังเมือง/ข้อมูลแผนที่ (แยกออกจาก js/house.js เมื่อ 2026-07-30)
   ไฟล์นี้คือ "แผนที่" ล้วนๆ: ขนาดกริด, แม่น้ำ/สะพาน/คลอง, บริเวณบ้าน, ถนนและล็อตของชุมชน,
   ป่า/บ่อน้ำ/ทะเล/หาด, ฟาร์มและคอกสัตว์, ลานกิจกรรม, โรงเรียน, ทุ่งดอกไม้, สระว่ายน้ำ,
   ชาวบ้าน (NPC_DEFS), เสาไฟ, แนวพุ่มไม้ และผังห้องในบ้าน — พร้อมฟังก์ชันตรวจช่องแบบ pure
   (isBridgeZ, isPondTile, seaEdgeZ, isLampTile, roomOf ฯลฯ)

   ประกาศ global HOUSE_MAP(ctx) คืน object ของทุกค่าให้ js/house.js ดึงไปใช้เป็นตัวแปรเดิม
   ctx.inBox = helper ตรวจว่าอยู่ในกรอบไหม (ยังอยู่ฝั่ง house.js)
   **ไม่แตะ DOM / ไม่ใช้ THREE / ไม่รู้จัก state ของเกม** — แก้แผนที่ได้ที่นี่ที่เดียว
   (เป็นฐานของเครื่องมือแก้แผนที่ใน FEATURE.md ด้วย)
   ============================================================ */
(function(){
'use strict';

window.HOUSE_MAP = function(ctx){
const inBox = ctx.inBox;

const H_SKIN = 0xffd9b3;
const H_HAIR_COLORS = [0x3b2a1a,0x6b4423,0xa5692a,0xe8c05c,0xf28c28,0xd94f30,0xf48fb1,0x9b59b6,0x5aa7e8,0x58c473,
  /* สีผมชุดใหม่ (2026-08-04) — โทนพาสเทล/สีสนุกสำหรับเด็ก */
  0x1c1c1c,0xc9a227,0xe0e0e0,0xff8a65,0x4dd0e1,0xffb7d5,0xb39ddb];
const H_EYE_COLORS  = [0x33261d,0x6b4423,0x3a79d8,0x3f9d5a,0x8e5bc0,0xe56aa4,0x7a8894,0xd8a520,
  0x26c6da,0xef5350,0x7e57c2,0x66bb6a];
/* เสื้อ: สีเดียวล้วน — **ลายทางตั้ง (เดิมเป็น entry 2 สีในแถวนี้) ย้ายไปเป็น "ลายเสื้อ" แบบที่ 9 แล้ว**
   (ผู้ใช้แจ้ง 2026-08-04: สีกับลายต้องแยกแถวกัน ไม่ปนกันในแถวสี) ห้ามเอา entry {a,b} กลับมาใส่แถวนี้ */
const H_SHIRT_COLORS  = [0xef5350,0xffa726,0xffd54f,0x9ccc65,0x4db6ac,0x42a5f5,0x7986cb,0xba68c8,0xf06292,0x8d6e63,
  0xffffff,0x26c6da,0xff7043,0xd4e157,0xf8bbd0,0xfff59d,0xb39ddb,0x00bfa5,0x5c6bc0,0xa1887f,
  0x37474f,0x66bb6a,0x9575cd,0x4dd0e1,0xffab91,0xc5e1a5];
const H_BOTTOM_COLORS = [0x3f5aa8,0x6d4c41,0x455a64,0x00897b,0xc62828,0xf48fb1,0x9575cd,0x558b2f,0xffb74d,0x263238,
  0x1e88e5,0x00acc1,0xe57373,0x9ccc65,0x5c6bc0,0xff8a65,0xffffff,0x795548,
  /* แบบ 2 สี (กางเกงท่อนบน a / ท่อนล่าง b, กระโปรงตัว a / ชายกระโปรง b) */
  {a:0x3f5aa8,b:0xffffff},{a:0xf48fb1,b:0xffffff},{a:0xc62828,b:0x3f5aa8},{a:0x558b2f,b:0xffd54f},{a:0x7e57c2,b:0xffffff},
  {a:0x455a64,b:0xffd54f},{a:0x00897b,b:0xffffff},{a:0xba68c8,b:0xfff59d},{a:0x1e88e5,b:0xf06292}];
const H_SHOE_COLORS   = [0xffffff,0x333333,0xef5350,0x42a5f5,0xffca28,0x66bb6a,0xab47bc,0x8d6e63,
  0xff7043,0x26a69a,0xf06292,0x7e57c2,0xfff176,0x90a4ae];
/* สีของแต่ง — จานสีเดียวกันแต่ **แยกแถวให้เลือกสีของหมวก/แว่น/เป้/ของถือ ได้อิสระของใครของมัน**
   (เดิมใช้แถวเดียวคุมทุกชิ้น ผู้ใช้ขอให้แยกเมื่อ 2026-08-04) */
const H_ACC_COLORS = [0xef5350,0xff9800,0xffd54f,0x66bb6a,0x26c6da,0x42a5f5,0x7e57c2,0xf06292,
  0xffffff,0x546e7a,0x8d6e63,0xa5d6a7];
/* ⚠ **เพิ่มแบบใหม่ต้องต่อท้ายเสมอ ห้ามแทรกกลาง/สลับลำดับ** — ตัวเลขที่เด็กเลือกไว้ถูกเก็บเป็น
     index ตรงๆ ใน save การแทรกกลางจะทำให้ตัวละครของเด็กที่เล่นอยู่เปลี่ยนหน้าตาเองทั้งเมือง */
const H_HAIR_N = 12, H_EYE_N = 12;
/* จำนวนแบบของชุดตกแต่งใหม่ (index 0 = ไม่ใส่ เสมอ ยกเว้นลายเสื้อที่ index 0 = เสื้อเรียบ)
   ⚠ ทุกแบบวาดใน js/house.js — เพิ่มเลขตรงนี้ต้องไปเพิ่ม case ในฟังก์ชันที่คู่กันด้วยเสมอ
   เฟส 8 (2026-08-12) ขยายทุกแถวตามตารางข้อ 29: 56 → 114 แบบ */
const H_PATTERN_N = 20;  /* ลายเสื้อ: เรียบ/ทางขวาง/จุด/ดาว/หัวใจ/เอี๊ยม/ซิกแซก/กระเป๋าหน้าอก/ปกกะลาสี/ทางตั้ง
                            + เฟส 8: ตารางสก็อต/ดาวกระจาย/หัวใจคู่/จุดใหญ่/แถบเฉียง/รอยเท้าสัตว์/เลข 1/ดวงดาวเรียง/สายรุ้ง/หน้ายิ้ม */
const H_HAT_N = 18;      /* เครื่องหัว: ไม่ใส่/แก๊ป/ไหมพรม/ฟาง/โบว์/มงกุฎ/หูสัตว์/หมวกปาร์ตี้/ที่คาดผมดอกไม้
                            + เฟส 8: หูแมว/หูกระต่าย/หมวกกันน็อก/หมวกกันแดดปีกกว้าง/โบว์ใหญ่/ผ้าโพก/หมวกกัปตัน/มงกุฎดอกไม้/หมวกไหมพรมมีปอม */
const H_GLASS_N = 12;    /* แว่น: ไม่ใส่/กลม/เหลี่ยม/กันแดด/หัวใจ/ดาว/แว่นว่ายน้ำ
                            + เฟส 8: กันแดดหัวใจ/แว่นดำน้ำ/นักบิน/วิทยาศาสตร์/แว่นการ์ตูนกลมโต */
const H_BAG_N = 14;      /* ของสะพายหลัง: ไม่สะพาย/เป้นักเรียน/เป้หมี/กระดองเต่า/ปีกผีเสื้อ/ปีกนางฟ้า/กระเป๋าสะพายเฉียง
                            + เฟส 8: เป้ลายสัตว์/กระเป๋าคาดอก/ถังน้ำ/เป้จรวด/ปีกค้างคาว/เป้ไดโนเสาร์/กระเป๋าดอกไม้ */
const H_HOLD_N = 18;     /* ของถือ: ไม่ถือ/ลูกโป่ง/ตุ๊กตาหมี/ไอศกรีม/หนังสือ/ไม้กายสิทธิ์/ลูกบอล/ช่อดอกไม้/ร่ม
                            + เฟส 8: ตาข่ายจับแมลง/กล้องถ่ายรูป/ว่าว/ไม้เทนนิส/กระเป๋าเดินทาง/ลูกโป่งสัตว์/ไอศกรีมโคน/กีตาร์จิ๋ว/ธง */
const H_SHOE_STYLE_N = 8;/* รองเท้าแบบ (แถวใหม่เฟส 8): ผ้าใบ/บูท/แตะ/รองเท้าเต้น/บูทกันฝน/สเก็ต/รองเท้าวิ่ง/รองเท้าหิมะ
                            ⚠ แถวนี้เป็น "รูปทรง" ต่างหากจากแถว `shoes` เดิมที่เป็น **สี** — คนละแถวกัน */

/* สีของเครื่องแต่ง (hatC/glassC/bagC/holdC) ตั้งเป็น 0 ทั้งหมดตั้งแต่ 2026-08-07 ตอนเปิดขายสี
   — index ที่แจกฟรีจะได้เรียงติดกัน 0-2 (ไม่มีชิปปลดล็อกโดดไปกลางแถวที่ล็อก)
   ไม่กระทบหน้าตาเด็กใหม่ เพราะค่าเริ่มต้นของตัวของคือ "ไม่ใส่" อยู่แล้ว ยังไม่เห็นสี */
const H_DEFAULT_CHAR = {gender:0, hair:0, hairC:0, eyes:1, eyeC:0, shirt:5, bottom:0, shoes:0, shoeStyle:0,
  pattern:0, hat:0, hatC:0, glass:0, glassC:0, bag:0, bagC:0, hold:0, holdC:0};

/* หน้าตาเริ่มต้นของพ่อ-แม่ในบ้าน (เฟส 4A · ข้อ 28 ของ QUEST-DESIGN.md)
   เด็กเปิดบ้านครั้งแรกต้อง **เจอพ่อแม่ยืนอยู่แล้วทันที ไม่มีหน้าจอบังคับให้สร้างตัวละครก่อน**
   ⇒ ต้องมีค่าปริยายครบทุกแถวของ H_ROWS · เด็กแก้ชื่อ/หน้าตาเองได้ทีหลังทุกแถว
   ⚠ ใช้เฉพาะแถวที่มีอยู่จริงใน H_ROWS เท่านั้น (ค่าที่ไม่มีในแถวจะถูก build ตกไปใช้ค่าแรกเงียบๆ) */
const H_DEFAULT_PARENT_DAD = {gender:0, hair:1, hairC:0, eyes:0, eyeC:0, shirt:1, bottom:2, shoes:1,
  pattern:0, hat:0, hatC:0, glass:1, glassC:0, bag:0, bagC:0, hold:0, holdC:0};
const H_DEFAULT_PARENT_MOM = {gender:1, hair:2, hairC:2, eyes:1, eyeC:1, shirt:8, bottom:1, shoes:2,
  pattern:0, hat:0, hatC:0, glass:0, glassC:0, bag:0, bagC:0, hold:0, holdC:0};

/* ลำดับแถวในหน้าแต่งตัว — **จับคู่ "แบบ" มาก่อน "สี" ของชิ้นนั้นเสมอ**
   (ทรงผม→สีผม · ดวงตา→สีตา · ลายเสื้อ→สีเสื้อ · เครื่องหัว→สีเครื่องหัว …)
   เด็กจะได้เลือกว่าจะใส่อะไรก่อน แล้วค่อยเลือกสีของสิ่งนั้น ไม่สลับไปมา
   `sec:true` = ขึ้นกลุ่มใหม่ → `buildCreatorRows` ขีดเส้นคั่นให้ก่อนแถวนี้
   (แถวสีเกาะอยู่ในกลุ่มเดียวกับแบบของมัน เด็กจะได้รู้ว่าสีนี้ของชิ้นไหน)
   `needs:'<คีย์>'` = แถวสีของเครื่องแต่งชิ้นนั้น → **ซ่อนทั้งแถวถ้ายังไม่ได้ใส่/ยังไม่มีชิ้นนั้น**
   (เลือกสีหมวกทั้งที่ไม่ได้ใส่หมวกไม่มีความหมาย แถมทำให้รายการยาวโดยเปล่าประโยชน์) */
const H_ROWS = [
  {key:'gender', label:'หนูเป็น...', type:'text', options:['👦 เด็กชาย','👧 เด็กหญิง']},
  {key:'hair',   label:'ทรงผม',      type:'num',  n:H_HAIR_N, sec:true},
  {key:'hairC',  label:'สีผม',       type:'color', colors:H_HAIR_COLORS},
  {key:'eyes',   label:'ดวงตา',      type:'num',  n:H_EYE_N, sec:true},
  {key:'eyeC',   label:'สีตา',       type:'color', colors:H_EYE_COLORS},
  {key:'pattern',label:'ลายเสื้อ',    type:'num',  n:H_PATTERN_N, none:true, sec:true},
  {key:'shirt',  label:'สีเสื้อ',     type:'color', colors:H_SHIRT_COLORS},
  {key:'bottom', label:'สีกางเกง/กระโปรง', type:'color', colors:H_BOTTOM_COLORS, sec:true},
  {key:'shoeStyle', label:'แบบรองเท้า', type:'num', n:H_SHOE_STYLE_N, sec:true},
  {key:'shoes',  label:'สีรองเท้า',   type:'color', colors:H_SHOE_COLORS},
  {key:'hat',    label:'เครื่องหัว',   type:'num',  n:H_HAT_N, none:true, sec:true},
  {key:'hatC',   label:'สีเครื่องหัว', type:'color', colors:H_ACC_COLORS, needs:'hat'},
  {key:'glass',  label:'แว่นตา',      type:'num',  n:H_GLASS_N, none:true, sec:true},
  {key:'glassC', label:'สีแว่นตา',    type:'color', colors:H_ACC_COLORS, needs:'glass'},
  {key:'bag',    label:'สะพายหลัง',   type:'num',  n:H_BAG_N, none:true, sec:true},
  {key:'bagC',   label:'สีของสะพาย',  type:'color', colors:H_ACC_COLORS, needs:'bag'},
  {key:'hold',   label:'ของถือ',      type:'num',  n:H_HOLD_N, none:true, sec:true},
  {key:'holdC',  label:'สีของถือ',    type:'color', colors:H_ACC_COLORS, needs:'hold'},
];
/* ไอคอน SVG แบนๆ พาสเทลขอบมน ชุดเดียวกับธีมไอคอนหมวดในแอป (แทน emoji ระบบเดิมที่ไม่เข้ากับ template) */
const H_ROW_ICONS = {
  gender: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#ffe0b3" stroke="#e59a5b" stroke-width="2"/><circle cx="9" cy="11" r="1.3" fill="#6b4a2b"/><circle cx="15" cy="11" r="1.3" fill="#6b4a2b"/><path d="M9 14.6 Q12 17 15 14.6" fill="none" stroke="#c9573f" stroke-width="1.8" stroke-linecap="round"/></svg>',
  hair:   '<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="5" rx="2.2" fill="#c8a2f0" stroke="#8e5bc0" stroke-width="1.8"/><line x1="7" y1="10.5" x2="7" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/><line x1="10.5" y1="10.5" x2="10.5" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/><line x1="14" y1="10.5" x2="14" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/><line x1="17.5" y1="10.5" x2="17.5" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/></svg>',
  hairC:  '<svg viewBox="0 0 24 24"><path d="M12 3 C 8.5 8.5, 6.5 11.5, 6.5 14.5 a5.5 5.5 0 0 0 11 0 c0-3-2-6-5.5-11.5 z" fill="#ffb27d" stroke="#f07a3e" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="10" cy="13.5" rx="1.4" ry="2.1" fill="#fff" opacity=".55"/></svg>',
  eyes:   '<svg viewBox="0 0 24 24"><path d="M3 12 Q12 5 21 12 Q12 19 3 12 z" fill="#dff1fb" stroke="#5b9fc9" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.4" fill="#3a79d8"/><circle cx="12" cy="12" r="1.5" fill="#1c2b4a"/><circle cx="13.4" cy="10.7" r=".8" fill="#fff"/></svg>',
  eyeC:   '<svg viewBox="0 0 24 24"><path d="M12 3 C 8.5 8.5, 6.5 11.5, 6.5 14.5 a5.5 5.5 0 0 0 11 0 c0-3-2-6-5.5-11.5 z" fill="#8fbef0" stroke="#3a79d8" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="10" cy="13.5" rx="1.4" ry="2.1" fill="#fff" opacity=".55"/></svg>',
  shirt:  '<svg viewBox="0 0 24 24"><path d="M8.5 4 L4 7 L6 10.2 L8 9 V20 H16 V9 L18 10.2 L20 7 L15.5 4 Q12 6.8 8.5 4 z" fill="#7ec0f5" stroke="#3a86c9" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  bottom: '<svg viewBox="0 0 24 24"><path d="M6.5 4 H17.5 L16.6 20 H13 L12 10.5 L11 20 H7.4 z" fill="#7f8fd6" stroke="#4a5aa8" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  shoes:  '<svg viewBox="0 0 24 24"><path d="M3 15.5 V11.5 Q3 9.5 5 9.5 L8 9.5 L11 12.5 L18 14.2 Q21 14.8 21 17 V18.5 H3 z" fill="#ffd24d" stroke="#d99a1f" stroke-width="1.8" stroke-linejoin="round"/><line x1="8" y1="11" x2="9.6" y2="12.6" stroke="#d99a1f" stroke-width="1.5" stroke-linecap="round"/><line x1="10.2" y1="12" x2="11.8" y2="13.6" stroke="#d99a1f" stroke-width="1.5" stroke-linecap="round"/></svg>',
  /* เฟส 8: แถว "แบบรองเท้า" (รูปทรง) — ใช้รองเท้าบูทให้ต่างจากไอคอนแถว "สีรองเท้า" ที่เป็นผ้าใบสีเหลือง */
  shoeStyle: '<svg viewBox="0 0 24 24"><path d="M8 4.5 h6 v9 h3.6 a2.4 2.4 0 0 1 2.4 2.4 v1.6 a1 1 0 0 1 -1 1 h-11 z" fill="#a1785a" stroke="#7a5540" stroke-width="1.8" stroke-linejoin="round"/><line x1="8" y1="7.5" x2="14" y2="7.5" stroke="#7a5540" stroke-width="1.5"/></svg>',
  pattern:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#ffe08a" stroke="#e0a52e" stroke-width="1.8"/><circle cx="9" cy="9" r="1.7" fill="#ef5350"/><circle cx="15" cy="9" r="1.7" fill="#42a5f5"/><circle cx="9" cy="15" r="1.7" fill="#42a5f5"/><circle cx="15" cy="15" r="1.7" fill="#ef5350"/></svg>',
  hat:    '<svg viewBox="0 0 24 24"><path d="M6 13 Q6 5.5 12 5.5 Q18 5.5 18 13 z" fill="#7fd1a6" stroke="#2f9e6b" stroke-width="1.8" stroke-linejoin="round"/><path d="M3.5 13 H20.5 Q21 15.5 18.5 15.5 H5.5 Q3 15.5 3.5 13 z" fill="#a8e6c4" stroke="#2f9e6b" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  glass:  '<svg viewBox="0 0 24 24"><circle cx="7.5" cy="13" r="4.2" fill="#dff1fb" stroke="#4a6fa5" stroke-width="1.8"/><circle cx="16.5" cy="13" r="4.2" fill="#dff1fb" stroke="#4a6fa5" stroke-width="1.8"/><path d="M11.7 12.6 Q12 11.6 12.3 12.6" fill="none" stroke="#4a6fa5" stroke-width="1.8" stroke-linecap="round"/><path d="M3.3 11.4 L4.6 9.6 M20.7 11.4 L19.4 9.6" stroke="#4a6fa5" stroke-width="1.8" stroke-linecap="round"/></svg>',
  bag:    '<svg viewBox="0 0 24 24"><rect x="5" y="9" width="14" height="11.5" rx="3.2" fill="#f2a0b8" stroke="#c9557a" stroke-width="1.8"/><path d="M9 9.5 V7.5 a3 3 0 0 1 6 0 V9.5" fill="none" stroke="#c9557a" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="13.5" width="6" height="3.6" rx="1.4" fill="#fff" stroke="#c9557a" stroke-width="1.5"/></svg>',
  hold:   '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="9" rx="5.6" ry="6.3" fill="#ff9fb0" stroke="#e05575" stroke-width="1.8"/><path d="M12 15.3 L11 17 h2 z" fill="#e05575"/><path d="M12 17 q2 2.5 0 4.5" fill="none" stroke="#e05575" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="9.8" cy="7.2" rx="1.5" ry="2" fill="#fff" opacity=".6"/></svg>',
  hatC:   '<svg viewBox="0 0 24 24"><path d="M6 12.5 Q6 6 12 6 Q18 6 18 12.5 z" fill="#7fb8f5" stroke="#3a79d8" stroke-width="1.7" stroke-linejoin="round"/><path d="M4 12.5 H20 Q20.5 14.8 18.2 14.8 H5.8 Q3.5 14.8 4 12.5 z" fill="#b7d9fb" stroke="#3a79d8" stroke-width="1.7" stroke-linejoin="round"/><circle cx="19.2" cy="18.6" r="2.7" fill="#ffb3c8" stroke="#e0709a" stroke-width="1.4"/></svg>',
  glassC: '<svg viewBox="0 0 24 24"><circle cx="7.5" cy="11" r="4" fill="#dff1fb" stroke="#78909c" stroke-width="1.7"/><circle cx="16.5" cy="11" r="4" fill="#dff1fb" stroke="#78909c" stroke-width="1.7"/><path d="M11.6 10.7 Q12 9.8 12.4 10.7" fill="none" stroke="#78909c" stroke-width="1.7" stroke-linecap="round"/><circle cx="19.2" cy="18.6" r="2.7" fill="#a5e0b0" stroke="#4caf70" stroke-width="1.4"/></svg>',
  bagC:   '<svg viewBox="0 0 24 24"><rect x="4.5" y="8" width="12" height="9.5" rx="2.8" fill="#f2a0b8" stroke="#c9557a" stroke-width="1.7"/><path d="M8 8.5 V7 a2.5 2.5 0 0 1 5 0 V8.5" fill="none" stroke="#c9557a" stroke-width="1.7" stroke-linecap="round"/><circle cx="19.2" cy="18.6" r="2.7" fill="#ffe08a" stroke="#e0a52e" stroke-width="1.4"/></svg>',
  holdC:  '<svg viewBox="0 0 24 24"><ellipse cx="10" cy="8.5" rx="4.6" ry="5.2" fill="#ff9fb0" stroke="#e05575" stroke-width="1.7"/><path d="M10 13.7 q1.7 2.3 0 4.6" fill="none" stroke="#e05575" stroke-width="1.5" stroke-linecap="round"/><circle cx="19.2" cy="18.6" r="2.7" fill="#9fd8f5" stroke="#3a9ad8" stroke-width="1.4"/></svg>',
  accC:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#fff3c4" stroke="#e0a52e" stroke-width="1.8"/><path d="M12 3.5 a8.5 8.5 0 0 1 0 17 z" fill="#ffb3c8"/><circle cx="8.6" cy="9.4" r="1.5" fill="#66bb6a"/><circle cx="8.6" cy="14.6" r="1.5" fill="#42a5f5"/></svg>',
};
/* ============================================================
   เฟส 8C — ไอคอนของ "แต่ละแบบ" ในหน้าแต่งตัว (ข้อ 29 ของ QUEST-DESIGN.md)

   ปัญหาเดิม: แถว type:'num' ทุกแถวแสดงเป็นปุ่มตัวเลข 1 2 3 4… ซึ่งขัดหลักการโปรเจค
   ที่ว่า "เด็ก 5 ขวบต้องเข้าใจด้วยสายตาโดยไม่ต้องอ่านออก" — เลข 7 ไม่บอกอะไรเลยว่าเป็นหมวกอะไร

   วิธี: `outfitIcon(rowKey, i)` คืน SVG จำลอง "ของชิ้นนั้นจริงๆ" สไตล์แบนพาสเทลขอบมน
   ชุดเดียวกับ H_ROW_ICONS ด้านบน
   ⚠ ปุ่ม "ไม่ใส่" (index 0 ของแถวที่มี none) ยังเป็น ✖ เหมือนเดิม — ห้ามเปลี่ยนเป็นไอคอน
   ⚠ ชิปสีทั้งหมดคงเดิม (ไอคอนใช้เฉพาะแถวแบบ)
   ⚠ **ลำดับต้องตรงกับ case ใน js/house.js เป๊ะ** ถ้าเพิ่มแบบใหม่ต้องต่อท้ายทั้ง 2 ที่พร้อมกัน
   ============================================================ */
const OI_SKIN = '#ffe0b3', OI_LINE = '#e59a5b', OI_HAIR = '#8d6e63', OI_HAIRD = '#6d4c41';
const OI_A = '#7fc8f0', OI_AD = '#3f9ad0', OI_B = '#ffb3c6', OI_BD = '#e5789a';
const OI_C = '#ffd97d', OI_CD = '#e0a93e', OI_G = '#9ede9e', OI_GD = '#5bb85b';
/* หัวเปล่า (ใช้เป็นฐานของไอคอนทรงผม/หมวก/แว่น) */
const oiHead = (y) => '<circle cx="12" cy="' + (y || 13) + '" r="6" fill="' + OI_SKIN + '" stroke="' + OI_LINE + '" stroke-width="1.6"/>';
const oiSvg  = (inner) => '<svg viewBox="0 0 24 24">' + inner + '</svg>';

/* ---- ทรงผม 12 แบบ ----
   ⚠ **ต้องต่างกันที่ "เงารวม" (silhouette) ไม่ใช่รายละเอียดเล็กๆ** — ไอคอนโชว์แค่ 32px
     รอบแรกเขียน path คล้ายกันหมด ผลคือ 12 แบบดูเหมือนกันเป๊ะบนจอจริง เด็กแยกไม่ออกเลย
     (เห็นจาก screenshot ตอนเทส 2026-08-12) ⇒ ทุกแบบต้องมีของยื่นพ้นวงหัวที่ต่างกัน
   H / D = placeholder ของสีผม/สีขอบ (แทนค่าให้ตอนสร้าง OI_HAIR_SHAPES ด้านล่าง) */
const OI_HAIR_ICONS = [
  /* 0 แสกข้าง */
  '<path d="M6 12 A6 6 0 0 1 18 12 L17.6 8.6 Q12 5 7 9.6 Z" fill="H" stroke="D" stroke-width="1.2"/>',
  /* 1 สไปก์ตั้ง */
  '<path d="M6.2 11.4 A6 6 0 0 1 17.8 11.4 L17 9 L15.6 5.6 L13.8 8.6 L12 4.6 L10.2 8.6 L8.4 5.6 L7 9 Z" fill="H" stroke="D" stroke-width="1.1" stroke-linejoin="round"/>',
  /* 2 บ๊อบ */
  '<path d="M5 14.4 Q5 6 12 6 Q19 6 19 14.4 L17.4 14.4 Q17.4 9.4 12 9.4 Q6.6 9.4 6.6 14.4 Z" fill="H" stroke="D" stroke-width="1.2" stroke-linejoin="round"/>',
  /* 3 หยิกฟู */
  '<circle cx="12" cy="7.4" r="3" fill="H"/><circle cx="7.6" cy="9.6" r="2.6" fill="H"/><circle cx="16.4" cy="9.6" r="2.6" fill="H"/><circle cx="6.2" cy="13" r="2.2" fill="H"/><circle cx="17.8" cy="13" r="2.2" fill="H"/>',
  /* 4 อาโฮเกะ (เส้นชี้) */
  '<path d="M6 11.6 A6 6 0 0 1 18 11.6 L17 9 Q12 6 7 9 Z" fill="H" stroke="D" stroke-width="1.2"/><path d="M12.4 6.6 Q13.6 2.6 16.4 3.6" fill="none" stroke="H" stroke-width="1.8" stroke-linecap="round"/>',
  /* 5 มัดจุกท้ายทอย */
  '<path d="M6 11.6 A6 6 0 0 1 18 11.6 L17 9 Q12 6.2 7 9 Z" fill="H" stroke="D" stroke-width="1.2"/><circle cx="19" cy="9.4" r="2.4" fill="H" stroke="D" stroke-width="1"/>',
  /* 6 เกรียน */
  '<path d="M7 10.6 A5 5 0 0 1 17 10.6 Q12 8.6 7 10.6 Z" fill="H" stroke="D" stroke-width="1.2"/>',
  /* 7 แสกกลาง */
  '<path d="M6 12 A6 6 0 0 1 11.4 6.2 L11.4 10 Q9 9.6 7 11 Z" fill="H" stroke="D" stroke-width="1.1"/><path d="M18 12 A6 6 0 0 0 12.6 6.2 L12.6 10 Q15 9.6 17 11 Z" fill="H" stroke="D" stroke-width="1.1"/>',
  /* 8 อาฟโร (วงใหญ่คลุมหัว แล้ววาดหน้าทับ) */
  '<circle cx="12" cy="10.6" r="7.4" fill="H" stroke="D" stroke-width="1.2"/><circle cx="12" cy="13.6" r="5.2" fill="' + OI_SKIN + '" stroke="' + OI_LINE + '" stroke-width="1.2"/>',
  /* 9 หน้าม้าหนา */
  '<path d="M5.4 12.4 Q5.4 5.6 12 5.6 Q18.6 5.6 18.6 12.4 L18.6 11 Q12 8.6 5.4 11 Z" fill="H" stroke="D" stroke-width="1.2"/><rect x="5.6" y="9.4" width="12.8" height="2.8" rx="1.3" fill="H"/>',
  /* 10 โมฮอว์ก */
  '<path d="M7.6 10.6 A4.6 4.6 0 0 1 16.4 10.6 Z" fill="H"/><path d="M9.6 9.6 L12 3.4 L14.4 9.6 Z" fill="H" stroke="D" stroke-width="1.1" stroke-linejoin="round"/>',
  /* 11 ยาวประบ่า */
  '<path d="M5 19 Q4.6 6 12 6 Q19.4 6 19 19 L16.6 19 Q17.4 9.6 12 9.6 Q6.6 9.6 7.4 19 Z" fill="H" stroke="D" stroke-width="1.2" stroke-linejoin="round"/>',
];
const OI_HAIR_SHAPES = OI_HAIR_ICONS.map(p =>
  p.split('"H"').join('"' + OI_HAIR + '"').split('"D"').join('"' + OI_HAIRD + '"'));

/* ---- ดวงตา 12 แบบ ---- */
const OI_EYES = [
  '<circle cx="9.4" cy="12.6" r="1.5" fill="#4a3a2a"/><circle cx="14.6" cy="12.6" r="1.5" fill="#4a3a2a"/>',
  '<circle cx="9.4" cy="12.6" r="2.4" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="9.4" cy="12.6" r="1.2" fill="#4a3a2a"/><circle cx="14.6" cy="12.6" r="2.4" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="14.6" cy="12.6" r="1.2" fill="#4a3a2a"/>',
  '<path d="M7.8 13.4 L9.4 11.6 L11 13.4 M13 13.4 L14.6 11.6 L16.2 13.4" fill="none" stroke="#4a3a2a" stroke-width="1.5" stroke-linecap="round"/>',
  '<rect x="7.9" y="12" width="3" height="1.4" rx=".7" fill="#4a3a2a"/><rect x="13.1" y="12" width="3" height="1.4" rx=".7" fill="#4a3a2a"/>',
  '<circle cx="9.4" cy="12.8" r="2.2" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="9.4" cy="12.8" r="1.1" fill="#4a3a2a"/><path d="M7.6 10.4 L9 9.4" stroke="#4a3a2a" stroke-width="1.2" stroke-linecap="round"/><circle cx="14.6" cy="12.8" r="2.2" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="14.6" cy="12.8" r="1.1" fill="#4a3a2a"/><path d="M16.4 10.4 L15 9.4" stroke="#4a3a2a" stroke-width="1.2" stroke-linecap="round"/>',
  '<ellipse cx="9.4" cy="12.6" rx="1.1" ry="2" fill="#4a3a2a"/><ellipse cx="14.6" cy="12.6" rx="1.1" ry="2" fill="#4a3a2a"/>',
  '<path d="M7.8 13 A1.7 1.7 0 0 1 11 13 M13 13 A1.7 1.7 0 0 1 16.2 13" fill="none" stroke="#4a3a2a" stroke-width="1.5" stroke-linecap="round"/>',
  '<circle cx="9.4" cy="12.6" r="2.6" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="9.4" cy="12.6" r="1.4" fill="#4a3a2a"/><circle cx="10.4" cy="11.6" r=".6" fill="#fff"/><circle cx="14.6" cy="12.6" r="2.6" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="14.6" cy="12.6" r="1.4" fill="#4a3a2a"/><circle cx="15.6" cy="11.6" r=".6" fill="#fff"/>',
  '<circle cx="9.4" cy="13.2" r="2.2" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="9.4" cy="13.4" r="1.1" fill="#4a3a2a"/><rect x="7.2" y="11.4" width="4.4" height="1.3" rx=".6" fill="' + OI_SKIN + '" stroke="' + OI_LINE + '" stroke-width=".7"/><circle cx="14.6" cy="13.2" r="2.2" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="14.6" cy="13.4" r="1.1" fill="#4a3a2a"/><rect x="12.4" y="11.4" width="4.4" height="1.3" rx=".6" fill="' + OI_SKIN + '" stroke="' + OI_LINE + '" stroke-width=".7"/>',
  '<path d="M9.4 14.4 L7.7 12.4 A1.1 1.1 0 0 1 9.4 11.1 A1.1 1.1 0 0 1 11.1 12.4 Z" fill="#ff5a7a"/><path d="M14.6 14.4 L12.9 12.4 A1.1 1.1 0 0 1 14.6 11.1 A1.1 1.1 0 0 1 16.3 12.4 Z" fill="#ff5a7a"/>',
  '<circle cx="9.3" cy="12.6" r="3" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="9.3" cy="12.6" r="1.6" fill="#4a3a2a"/><circle cx="10.5" cy="11.4" r=".7" fill="#fff"/><circle cx="14.7" cy="12.6" r="3" fill="#fff" stroke="#4a3a2a" stroke-width="1"/><circle cx="14.7" cy="12.6" r="1.6" fill="#4a3a2a"/><circle cx="15.9" cy="11.4" r=".7" fill="#fff"/>',
  '<path d="M7.8 12.4 A1.7 1.7 0 0 0 11 12.4 M13 12.4 A1.7 1.7 0 0 0 16.2 12.4" fill="none" stroke="#4a3a2a" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="7.4" cy="14.6" rx="1.2" ry=".7" fill="#ffb3b3"/><ellipse cx="16.6" cy="14.6" rx="1.2" ry=".7" fill="#ffb3b3"/>',
];
/* ---- ลายเสื้อ 20 แบบ (วาดบนทรงเสื้อ) ---- */
const OI_SHIRT = '<path d="M8 6 L10 5 Q12 6.6 14 5 L16 6 L18.4 8 L16.6 10 L16 10 L16 19 Q12 20 8 19 L8 10 L7.4 10 L5.6 8 Z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.4" stroke-linejoin="round"/>';
const OI_PAT = [
  '',
  '<path d="M8 11 H16 M8 14 H16 M8 17 H16" stroke="#fff" stroke-width="1.4"/>',
  '<circle cx="10.4" cy="11.6" r=".9" fill="#fff"/><circle cx="13.6" cy="13.6" r=".9" fill="#fff"/><circle cx="10.4" cy="16" r=".9" fill="#fff"/>',
  '<path d="M12 10.6 l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z" fill="#fff"/>',
  '<path d="M12 16 L9.8 13.6 A1.5 1.5 0 0 1 12 11.8 A1.5 1.5 0 0 1 14.2 13.6 Z" fill="#fff"/>',
  '<path d="M9.6 10.6 H14.4 V16 H9.6 Z" fill="#ffd97d" stroke="#e0a93e" stroke-width="1"/>',
  '<path d="M8 12 l2-1.6 2 1.6 2-1.6 2 1.6" fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>',
  '<rect x="12.6" y="10.6" width="3" height="2.6" rx=".5" fill="#fff"/>',
  '<path d="M8.4 6.6 Q12 9.6 15.6 6.6 L16.6 8.4 Q12 11.6 7.4 8.4 Z" fill="#fff"/>',
  '<path d="M10.4 10 V19 M13.6 10 V19" stroke="#fff" stroke-width="1.6"/>',
  '<path d="M8 12 H16 M8 15.4 H16 M10.4 10 V19 M13.6 10 V19" stroke="#fff" stroke-width="1"/>',
  '<path d="M10 11 l.5 1 1 .2-.8.7.2 1.1-.9-.5-.9.5.2-1.1-.8-.7 1-.2z" fill="#fff"/><path d="M14 14 l.5 1 1 .2-.8.7.2 1.1-.9-.5-.9.5.2-1.1-.8-.7 1-.2z" fill="#fff"/>',
  '<path d="M10.6 14.6 L9 12.9 A1.1 1.1 0 0 1 10.6 11.6 A1.1 1.1 0 0 1 12.2 12.9 Z" fill="#fff"/><path d="M14 16.4 L12.4 14.7 A1.1 1.1 0 0 1 14 13.4 A1.1 1.1 0 0 1 15.6 14.7 Z" fill="#fff"/>',
  '<circle cx="10.6" cy="12" r="1.5" fill="#fff"/><circle cx="14" cy="16" r="1.5" fill="#fff"/>',
  '<path d="M8.6 17 L14.6 10.4 M11 18.4 L16 12.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
  '<circle cx="12" cy="14" r="1.4" fill="#fff"/><circle cx="10.4" cy="11.8" r=".7" fill="#fff"/><circle cx="12" cy="11.2" r=".7" fill="#fff"/><circle cx="13.6" cy="11.8" r=".7" fill="#fff"/>',
  '<path d="M11 11.4 L12.4 10.6 V17 M10.6 17 H14.2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  '<path d="M9.4 12.4 l.4.9.9.1-.7.6.2 1-.8-.5-.8.5.2-1-.7-.6.9-.1z" fill="#fff"/><path d="M12 12.4 l.4.9.9.1-.7.6.2 1-.8-.5-.8.5.2-1-.7-.6.9-.1z" fill="#fff"/><path d="M14.6 12.4 l.4.9.9.1-.7.6.2 1-.8-.5-.8.5.2-1-.7-.6.9-.1z" fill="#fff"/>',
  '<path d="M8 12 H16" stroke="#ff6b6b" stroke-width="1.5"/><path d="M8 14 H16" stroke="#ffd93d" stroke-width="1.5"/><path d="M8 16 H16" stroke="#6bcb77" stroke-width="1.5"/>',
  '<circle cx="12" cy="13.8" r="2.4" fill="#fff"/><circle cx="11.1" cy="13.2" r=".45" fill="#4a3a2a"/><circle cx="12.9" cy="13.2" r=".45" fill="#4a3a2a"/><path d="M10.9 14.8 Q12 15.8 13.1 14.8" fill="none" stroke="#4a3a2a" stroke-width=".8" stroke-linecap="round"/>',
];
/* ---- เครื่องหัว 18 แบบ (index 0 = ไม่ใส่ ⇒ ไม่มีไอคอน) ---- */
const OI_HAT = [
  '',
  '<path d="M6 10.4 A6 6 0 0 1 18 10.4 Z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/><path d="M12 10.4 H21 A2 2 0 0 1 21 12.4 H12 Z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/>',
  '<path d="M6.2 10.8 A6 6 0 0 1 17.8 10.8 Z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3"/><rect x="5.6" y="10.4" width="12.8" height="2.4" rx="1.2" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3"/><circle cx="12" cy="4.6" r="1.6" fill="' + OI_B + '"/>',
  '<path d="M7.4 10.4 A4.6 4.6 0 0 1 16.6 10.4 Z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/><ellipse cx="12" cy="11" rx="8.4" ry="1.8" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/>',
  '<circle cx="9.4" cy="7" r="2.2" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2"/><circle cx="14.6" cy="7" r="2.2" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2"/><circle cx="12" cy="7" r="1.2" fill="' + OI_BD + '"/>',
  '<path d="M6.6 10.4 L6.6 5.6 L9.4 8 L12 4.6 L14.6 8 L17.4 5.6 L17.4 10.4 Z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3" stroke-linejoin="round"/>',
  '<path d="M7 8.6 L8 4.6 L11 7.4 Z" fill="' + OI_HAIR + '"/><path d="M17 8.6 L16 4.6 L13 7.4 Z" fill="' + OI_HAIR + '"/><path d="M6.4 10.2 A6 6 0 0 1 17.6 10.2" fill="none" stroke="' + OI_HAIRD + '" stroke-width="1.4"/>',
  '<path d="M12 3.6 L15.6 10.4 H8.4 Z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3" stroke-linejoin="round"/><circle cx="12" cy="3.4" r="1.2" fill="' + OI_C + '"/>',
  '<path d="M6.4 10.4 A6 6 0 0 1 17.6 10.4" fill="none" stroke="' + OI_BD + '" stroke-width="1.6"/><circle cx="16.6" cy="8.4" r="2.2" fill="' + OI_B + '"/><circle cx="16.6" cy="8.4" r=".9" fill="' + OI_C + '"/>',
  '<path d="M7.6 9 L8.6 4.6 L11.6 7.8 Z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.1" stroke-linejoin="round"/><path d="M16.4 9 L15.4 4.6 L12.4 7.8 Z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.1" stroke-linejoin="round"/>',
  '<rect x="8" y="3.4" width="2.6" height="6.4" rx="1.3" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.1"/><rect x="13.4" y="3.4" width="2.6" height="6.4" rx="1.3" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.1"/>',
  '<path d="M6 11 A6 6 0 0 1 18 11 Z" fill="' + OI_G + '" stroke="' + OI_GD + '" stroke-width="1.4"/><rect x="5.4" y="10.6" width="13.2" height="1.8" rx=".9" fill="' + OI_GD + '"/>',
  '<ellipse cx="12" cy="11" rx="9" ry="2.2" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/><path d="M8 10.6 A4 4 0 0 1 16 10.6 Z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/>',
  '<circle cx="8.4" cy="6.6" r="3" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2"/><circle cx="15.6" cy="6.6" r="3" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2"/><circle cx="12" cy="6.6" r="1.5" fill="' + OI_BD + '"/>',
  '<path d="M5.8 10.4 Q12 6 18.2 10.4 L17.6 12 Q12 8.4 6.4 12 Z" fill="' + OI_G + '" stroke="' + OI_GD + '" stroke-width="1.2"/><circle cx="18.4" cy="11.4" r="1.4" fill="' + OI_G + '"/>',
  '<path d="M6.6 10.4 A5.4 5.4 0 0 1 17.4 10.4 Z" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.3"/><rect x="6" y="10.2" width="12" height="1.8" rx=".9" fill="' + OI_A + '"/><path d="M12 10.2 H20 A1.4 1.4 0 0 1 20 12 H12 Z" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.2"/>',
  '<circle cx="7.4" cy="9.4" r="1.5" fill="' + OI_B + '"/><circle cx="10.4" cy="7.4" r="1.5" fill="' + OI_C + '"/><circle cx="13.6" cy="7.4" r="1.5" fill="' + OI_B + '"/><circle cx="16.6" cy="9.4" r="1.5" fill="' + OI_C + '"/>',
  '<path d="M6.4 10.6 A5.6 5.6 0 0 1 17.6 10.6 Z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/><rect x="5.8" y="10.2" width="12.4" height="2.2" rx="1.1" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.1"/><circle cx="12" cy="4.2" r="1.8" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.1"/>',
];
/* ---- แว่นตา 12 แบบ ---- */
const OI_GLASS = [
  '',
  '<circle cx="8.6" cy="13" r="3" fill="#eaf6ff" stroke="#4a3a2a" stroke-width="1.3"/><circle cx="15.4" cy="13" r="3" fill="#eaf6ff" stroke="#4a3a2a" stroke-width="1.3"/><path d="M11.6 13 H12.4" stroke="#4a3a2a" stroke-width="1.3"/>',
  '<rect x="5.6" y="10.6" width="6" height="4.6" rx="1" fill="#eaf6ff" stroke="#4a3a2a" stroke-width="1.3"/><rect x="12.4" y="10.6" width="6" height="4.6" rx="1" fill="#eaf6ff" stroke="#4a3a2a" stroke-width="1.3"/><path d="M11.6 12.6 H12.4" stroke="#4a3a2a" stroke-width="1.3"/>',
  '<rect x="5.4" y="10.6" width="6.2" height="4.6" rx="2" fill="#4a3a2a"/><rect x="12.4" y="10.6" width="6.2" height="4.6" rx="2" fill="#4a3a2a"/><path d="M11.6 12.4 H12.4" stroke="#4a3a2a" stroke-width="1.4"/>',
  '<path d="M8.6 16 L6 13.2 A1.8 1.8 0 0 1 8.6 10.8 A1.8 1.8 0 0 1 11.2 13.2 Z" fill="#ff5a7a"/><path d="M15.4 16 L12.8 13.2 A1.8 1.8 0 0 1 15.4 10.8 A1.8 1.8 0 0 1 18 13.2 Z" fill="#ff5a7a"/>',
  '<path d="M8.6 10 l.8 1.8 2 .2-1.5 1.3.4 1.9-1.7-1-1.7 1 .4-1.9-1.5-1.3 2-.2z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width=".8"/><path d="M15.4 10 l.8 1.8 2 .2-1.5 1.3.4 1.9-1.7-1-1.7 1 .4-1.9-1.5-1.3 2-.2z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width=".8"/>',
  '<circle cx="8.6" cy="13" r="3.2" fill="#9fdcf5" stroke="' + OI_AD + '" stroke-width="1.4"/><circle cx="15.4" cy="13" r="3.2" fill="#9fdcf5" stroke="' + OI_AD + '" stroke-width="1.4"/><path d="M4 12.6 H5.4 M18.6 12.6 H20" stroke="' + OI_AD + '" stroke-width="1.6" stroke-linecap="round"/>',
  '<path d="M8.6 16.2 L5.8 13.2 A1.9 1.9 0 0 1 8.6 10.6 A1.9 1.9 0 0 1 11.4 13.2 Z" fill="#4a3a2a"/><path d="M15.4 16.2 L12.6 13.2 A1.9 1.9 0 0 1 15.4 10.6 A1.9 1.9 0 0 1 18.2 13.2 Z" fill="#4a3a2a"/>',
  '<rect x="5" y="9.8" width="14" height="6" rx="2.4" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.4"/><rect x="6.6" y="11.2" width="10.8" height="3.2" rx="1.4" fill="#d8f3ff"/>',
  '<path d="M5.4 11 h5.8 l-.8 4 h-3.4 z" fill="#8fd6f0" stroke="' + OI_AD + '" stroke-width="1.2"/><path d="M18.6 11 h-5.8 l.8 4 h3.4 z" fill="#8fd6f0" stroke="' + OI_AD + '" stroke-width="1.2"/><path d="M11.2 11.6 H12.8" stroke="' + OI_AD + '" stroke-width="1.2"/>',
  '<circle cx="8.6" cy="13" r="3.2" fill="#d8f3ff" stroke="' + OI_GD + '" stroke-width="1.5"/><circle cx="15.4" cy="13" r="3.2" fill="#d8f3ff" stroke="' + OI_GD + '" stroke-width="1.5"/><path d="M11.8 12.6 H12.2" stroke="' + OI_GD + '" stroke-width="2"/><path d="M4.4 11.6 H5.6 M18.4 11.6 H19.6" stroke="' + OI_GD + '" stroke-width="1.5" stroke-linecap="round"/>',
  '<circle cx="8.4" cy="13" r="3.6" fill="#fff" stroke="#4a3a2a" stroke-width="1.5"/><circle cx="15.6" cy="13" r="3.6" fill="#fff" stroke="#4a3a2a" stroke-width="1.5"/><path d="M12 12.6 H12.1" stroke="#4a3a2a" stroke-width="1.5"/><path d="M6.6 11 L7.8 10.2" stroke="#4a3a2a" stroke-width="1" stroke-linecap="round"/>',
];
/* ---- ของสะพาย 14 แบบ ---- */
const OI_BAG = [
  '',
  '<rect x="7" y="8.6" width="10" height="10" rx="2.4" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.4"/><rect x="7" y="8.6" width="10" height="3.4" rx="1.6" fill="' + OI_AD + '"/><rect x="10.6" y="13" width="2.8" height="2" rx=".6" fill="#fff"/>',
  '<circle cx="12" cy="13.4" r="5.4" fill="' + OI_HAIR + '" stroke="' + OI_HAIRD + '" stroke-width="1.4"/><circle cx="8.2" cy="8.6" r="2" fill="' + OI_HAIR + '"/><circle cx="15.8" cy="8.6" r="2" fill="' + OI_HAIR + '"/><circle cx="10.4" cy="12.4" r=".7" fill="#4a3a2a"/><circle cx="13.6" cy="12.4" r=".7" fill="#4a3a2a"/>',
  '<ellipse cx="12" cy="13.4" rx="6" ry="5" fill="' + OI_G + '" stroke="' + OI_GD + '" stroke-width="1.4"/><path d="M8.4 11 L15.6 11 M8.4 15.6 L15.6 15.6 M12 8.6 V18.2" stroke="' + OI_GD + '" stroke-width="1"/>',
  '<path d="M11.4 12 Q6 6.6 5.4 12 Q5 16.4 11.4 14.6 Z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2"/><path d="M12.6 12 Q18 6.6 18.6 12 Q19 16.4 12.6 14.6 Z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2"/><rect x="11.2" y="9.6" width="1.6" height="8" rx=".8" fill="' + OI_BD + '"/>',
  '<path d="M11.4 12.4 Q6.4 7 5.6 12.4 Q5.4 16 11.4 15 Z" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.2"/><path d="M12.6 12.4 Q17.6 7 18.4 12.4 Q18.6 16 12.6 15 Z" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.2"/>',
  '<rect x="9" y="11.4" width="8" height="6" rx="1.6" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/><path d="M9.6 11.4 L6.6 6.6" stroke="' + OI_CD + '" stroke-width="1.6" stroke-linecap="round"/>',
  '<rect x="7" y="8.6" width="10" height="10" rx="2.4" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.4"/><circle cx="9.8" cy="12" r="1" fill="' + OI_CD + '"/><circle cx="14" cy="14.4" r="1" fill="' + OI_CD + '"/><circle cx="13.4" cy="11" r=".8" fill="' + OI_CD + '"/>',
  '<rect x="7.4" y="12" width="9.2" height="5.6" rx="1.6" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3"/><rect x="7.4" y="12" width="9.2" height="2" rx="1" fill="' + OI_BD + '"/><path d="M8 12 L14 6.6" stroke="' + OI_BD + '" stroke-width="1.4" stroke-linecap="round"/>',
  '<path d="M8 9.4 h8 l-1 9 h-6 z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/><path d="M7.4 9.4 h9.2" stroke="' + OI_AD + '" stroke-width="1.6" stroke-linecap="round"/><path d="M9.4 9.4 A2.6 2.6 0 0 1 14.6 9.4" fill="none" stroke="' + OI_AD + '" stroke-width="1.2"/>',
  '<rect x="9" y="8.6" width="6" height="8.4" rx="3" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.3"/><path d="M12 4.6 L14.4 9 H9.6 Z" fill="#ff6b6b"/><path d="M9 15 L7 18 M15 15 L17 18" stroke="#ffa726" stroke-width="1.6" stroke-linecap="round"/>',
  '<path d="M11.4 12 Q6 8.6 4.6 13.4 Q7.4 12.6 11.4 15 Z" fill="#7e57c2" stroke="#5e35b1" stroke-width="1.2"/><path d="M12.6 12 Q18 8.6 19.4 13.4 Q16.6 12.6 12.6 15 Z" fill="#7e57c2" stroke="#5e35b1" stroke-width="1.2"/>',
  '<ellipse cx="12" cy="13.4" rx="5.2" ry="5" fill="' + OI_G + '" stroke="' + OI_GD + '" stroke-width="1.3"/><path d="M12 8 l1.4 2 -2.8 0 z" fill="' + OI_GD + '"/><path d="M12 10.6 l1.4 2 -2.8 0 z" fill="' + OI_GD + '"/>',
  '<rect x="7.6" y="10.6" width="8.8" height="7.4" rx="2" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3"/><circle cx="12" cy="13.6" r="1.2" fill="' + OI_C + '"/><circle cx="10.2" cy="12.4" r=".9" fill="#fff"/><circle cx="13.8" cy="12.4" r=".9" fill="#fff"/><circle cx="10.2" cy="14.8" r=".9" fill="#fff"/><circle cx="13.8" cy="14.8" r=".9" fill="#fff"/>',
];
/* ---- ของถือ 18 แบบ ---- */
const OI_HOLD = [
  '',
  '<circle cx="12" cy="8.4" r="4.4" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3"/><path d="M12 12.8 Q13 16 12 19.4" fill="none" stroke="' + OI_BD + '" stroke-width="1.2"/>',
  '<circle cx="12" cy="13.4" r="4.6" fill="' + OI_HAIR + '" stroke="' + OI_HAIRD + '" stroke-width="1.3"/><circle cx="8.8" cy="9.4" r="1.9" fill="' + OI_HAIR + '"/><circle cx="15.2" cy="9.4" r="1.9" fill="' + OI_HAIR + '"/><circle cx="10.6" cy="12.6" r=".7" fill="#4a3a2a"/><circle cx="13.4" cy="12.6" r=".7" fill="#4a3a2a"/>',
  '<path d="M9.4 11 h5.2 l-1.6 8 h-2 z" fill="#e6b877" stroke="#c99552" stroke-width="1.2"/><circle cx="10.8" cy="9.6" r="2.2" fill="' + OI_B + '"/><circle cx="13.4" cy="9.6" r="2.2" fill="#fff3c4"/>',
  '<rect x="6.6" y="9" width="10.8" height="8.4" rx="1.2" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/><path d="M12 9 V17.4" stroke="' + OI_AD + '" stroke-width="1.2"/>',
  '<path d="M8 18 L15.4 8.6" stroke="#d7a86e" stroke-width="2" stroke-linecap="round"/><path d="M16 4.6 l1 2.2 2.4.3-1.8 1.6.5 2.3-2.1-1.2-2.1 1.2.5-2.3-1.8-1.6 2.4-.3z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width=".9"/>',
  '<circle cx="12" cy="13" r="5" fill="#fff" stroke="#4a3a2a" stroke-width="1.3"/><path d="M12 8 L14.6 11.4 L13.4 15.4 H10.6 L9.4 11.4 Z" fill="#4a3a2a"/>',
  '<circle cx="9.4" cy="9.6" r="2.2" fill="' + OI_B + '"/><circle cx="14.4" cy="9" r="2.2" fill="' + OI_C + '"/><circle cx="12" cy="12.4" r="2.2" fill="#fff"/><path d="M10.6 14 L11.4 19 M13.4 13.6 L12.6 19" stroke="' + OI_GD + '" stroke-width="1.4" stroke-linecap="round"/>',
  '<path d="M4.6 12 A7.4 7.4 0 0 1 19.4 12 Z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3"/><path d="M12 12 V17.4 A1.8 1.8 0 0 0 15 18" fill="none" stroke="' + OI_BD + '" stroke-width="1.3" stroke-linecap="round"/>',
  '<path d="M9 19 L13 10" stroke="#d7a86e" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="14.6" cy="8" rx="4" ry="3.4" fill="#eaf6ff" stroke="' + OI_AD + '" stroke-width="1.3"/>',
  '<rect x="5.6" y="9.4" width="12.8" height="8.6" rx="2" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/><circle cx="12" cy="13.6" r="2.8" fill="#eaf6ff" stroke="' + OI_AD + '" stroke-width="1.2"/><rect x="7.4" y="7" width="3.4" height="2.4" rx=".8" fill="' + OI_AD + '"/>',
  '<path d="M12 4.6 L18 10.6 L12 16.6 L6 10.6 Z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/><path d="M12 16.6 Q11 19 12.6 20" fill="none" stroke="' + OI_CD + '" stroke-width="1.1"/>',
  '<ellipse cx="12" cy="8.6" rx="4" ry="4.6" fill="#eaf6ff" stroke="' + OI_GD + '" stroke-width="1.4"/><path d="M12 13.2 V19.4" stroke="#d7a86e" stroke-width="1.8" stroke-linecap="round"/>',
  '<rect x="6" y="10" width="12" height="8" rx="1.6" fill="' + OI_HAIR + '" stroke="' + OI_HAIRD + '" stroke-width="1.3"/><path d="M10 10 V7.6 h4 V10" fill="none" stroke="' + OI_HAIRD + '" stroke-width="1.3"/><path d="M6 13.6 H18" stroke="' + OI_HAIRD + '" stroke-width="1.1"/>',
  '<ellipse cx="12" cy="9" rx="4.4" ry="3.6" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3"/><circle cx="15.6" cy="6.4" r="2.2" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.1"/><path d="M12 12.6 V19.4" stroke="' + OI_AD + '" stroke-width="1.1"/>',
  '<path d="M9.6 12 h4.8 l-1.4 7.4 h-2 z" fill="#e6b877" stroke="#c99552" stroke-width="1.2"/><circle cx="12" cy="10" r="2.6" fill="' + OI_B + '"/><circle cx="12" cy="6.8" r="2.2" fill="#fff3c4"/><circle cx="12" cy="4.4" r="1" fill="#ef5350"/>',
  '<rect x="10.8" y="4.6" width="2.4" height="8" rx="1" fill="#d7a86e"/><ellipse cx="12" cy="15" rx="4.6" ry="4" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/><circle cx="12" cy="15" r="1.4" fill="#4a3a2a"/>',
  '<path d="M8 4.6 V19.4" stroke="#d7a86e" stroke-width="1.8" stroke-linecap="round"/><path d="M8.8 5.4 h8.4 l-2 3 2 3 h-8.4 z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.2" stroke-linejoin="round"/>',
];
/* ---- แบบรองเท้า 8 แบบ ---- */
const OI_SHOE = [
  '<path d="M4.6 16 h6 l3.4 -3 h4 a2 2 0 0 1 2 2 v1 a2 2 0 0 1 -2 2 h-13.4 z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3" stroke-linejoin="round"/>',
  '<path d="M8 6 h6 v8 h4 a2 2 0 0 1 2 2 v1 a1 1 0 0 1 -1 1 h-11 z" fill="' + OI_HAIR + '" stroke="' + OI_HAIRD + '" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 9 h6" stroke="' + OI_HAIRD + '" stroke-width="1.1"/>',
  '<path d="M5 16.4 h13 a1.6 1.6 0 0 1 0 2.4 h-13 a1.2 1.2 0 0 1 0 -2.4 z" fill="' + OI_C + '" stroke="' + OI_CD + '" stroke-width="1.3"/><path d="M8 16.4 Q11.4 12.6 14.6 16.4" fill="none" stroke="' + OI_CD + '" stroke-width="1.4"/>',
  '<path d="M5.6 15.6 h6 l3.4 -2.6 h3.4 a1.8 1.8 0 0 1 1.8 1.8 v1.4 a1.6 1.6 0 0 1 -1.6 1.6 h-13 z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3" stroke-linejoin="round"/><circle cx="9.4" cy="14.6" r="1.4" fill="' + OI_BD + '"/>',
  '<path d="M8 4.6 h6.4 v10 h3.6 a1.8 1.8 0 0 1 1.8 1.8 v1 a1 1 0 0 1 -1 1 h-10.8 z" fill="' + OI_G + '" stroke="' + OI_GD + '" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 6.6 h6.4" stroke="' + OI_GD + '" stroke-width="1.2"/>',
  '<path d="M6 13 h6 l3.4 -2.6 h3 a1.8 1.8 0 0 1 1.8 1.8 v1.4 a1.4 1.4 0 0 1 -1.4 1.4 h-12.8 z" fill="' + OI_B + '" stroke="' + OI_BD + '" stroke-width="1.3" stroke-linejoin="round"/><circle cx="9" cy="17.4" r="1.8" fill="#fff" stroke="#4a3a2a" stroke-width="1.2"/><circle cx="16" cy="17.4" r="1.8" fill="#fff" stroke="#4a3a2a" stroke-width="1.2"/>',
  '<path d="M4.6 15.4 h6 l3.4 -2.8 h4 a2 2 0 0 1 2 2 v1.2 h-15.4 z" fill="' + OI_GD + '" stroke="#3d8b3d" stroke-width="1.3" stroke-linejoin="round"/><rect x="4.4" y="15.8" width="15.6" height="2.4" rx="1.2" fill="#fff" stroke="#3d8b3d" stroke-width="1.1"/>',
  '<path d="M6 12.6 h5.4 l3.4 -2 h3.4 a2 2 0 0 1 2 2 v2 h-14.2 z" fill="' + OI_A + '" stroke="' + OI_AD + '" stroke-width="1.3" stroke-linejoin="round"/><rect x="5.4" y="10.4" width="14" height="2.6" rx="1.3" fill="#fff" stroke="' + OI_AD + '" stroke-width="1.1"/><rect x="4.6" y="15" width="15.6" height="2.6" rx="1.2" fill="' + OI_HAIRD + '"/>',
];
/* คืน SVG ของ "แบบที่ i" ในแถว rowKey — ไม่มีก็คืนค่าว่าง (ผู้เรียกจะถอยไปใช้ตัวเลขเหมือนเดิม) */
function outfitIcon(rowKey, i){
  switch(rowKey){
    /* ⚠ ทรงผมบางแบบ (อาฟโร) วาดวงผมคลุมแล้ววาดหน้าทับเอง ⇒ ส่ง markup เต็มมาเลย ไม่ห่อ path ซ้ำ */
    case 'hair':  return oiSvg(oiHead() + (OI_HAIR_SHAPES[i] || OI_HAIR_SHAPES[0]));
    case 'eyes':  return oiSvg(oiHead() + (OI_EYES[i] || ''));
    case 'pattern': return oiSvg(OI_SHIRT + (OI_PAT[i] || ''));
    case 'hat':   return i === 0 ? '' : oiSvg(oiHead(14) + (OI_HAT[i] || ''));
    case 'glass': return i === 0 ? '' : oiSvg(oiHead() + (OI_GLASS[i] || ''));
    case 'bag':   return i === 0 ? '' : oiSvg(OI_BAG[i] || '');
    case 'hold':  return i === 0 ? '' : oiSvg(OI_HOLD[i] || '');
    case 'shoeStyle': return oiSvg(OI_SHOE[i] || OI_SHOE[0]);
  }
  return '';
}


/* ---------- แผนที่นอกบ้าน (grid) ----------
   ค่า tile: 0 = หญ้าเดินได้, 1 = น้ำ (คลอง), 2 = สะพานเดินได้, 3 = ถูกบล็อก (ต้นไม้/บ้าน) */
/* เฟส 6: ขยายอีก 2 ด้าน — ทิศเหนือ (-x) ใส่บ่อน้ำใหญ่, ทิศตะวันออก (-z) ใส่โซนฟาร์ม+ชายหาด+ทะเล
   ทำโดย "เลื่อนพิกัดเดิมทั้งแผนที่" ด้วย NPAD/EPAD แล้วเขียนของใหม่ด้วยพิกัดใหม่ตรงๆ
   ของตกแต่งที่เด็กวางไว้เก็บเป็นพิกัดช่องใน localStorage → ต้องเลื่อนตามด้วย (ดู migrateHouseMap) */
/* เฟส 7: ขยายทิศตะวันออก (-z) อีก 10 ช่อง เป็น "ฟาร์มเลี้ยงสัตว์" — พิกัดเดิมของเฟส 6 เลื่อนอีกชั้นด้วย EPAD2
   → พิกัดเก่าสุด (เฟส ≤4) ใช้ sx/sz/sRect/sTile/sList (เลื่อน NPAD + EPAD + EPAD2)
     พิกัดที่เขียนไว้ตอนเฟส 6 (บ่อน้ำ/คลอง/ฟาร์ม/ชายหาด/ชุมชนที่ 2) ใช้ s2z/s2Rect/s2List (เลื่อนแค่ EPAD2)
     พิกัดที่เขียนใหม่รอบนี้ (ฟาร์มเลี้ยงสัตว์ z 0-9) เขียนตรงๆ ไม่ต้องเลื่อน */
const NPAD = 12, EPAD = 16, EPAD2 = 10;
const EPAD_ALL = EPAD + EPAD2;
const OUT_W = 56 + NPAD, OUT_D = 42 + EPAD_ALL;   /* 68 × 68 (เดิม 68×58, 56×42, 40×30) */
const sx = v => v + NPAD, sz = v => v + EPAD_ALL;                                /* เลื่อนพิกัดเดิม */
const sRect = r => Object.assign({}, r, {x0:r.x0+NPAD, x1:r.x1+NPAD, z0:r.z0+EPAD_ALL, z1:r.z1+EPAD_ALL});
const sTile = t => Object.assign({}, t, {x:t.x+NPAD, z:t.z+EPAD_ALL});
const sList = a => a.map(p => [p[0]+NPAD, p[1]+EPAD_ALL].concat(p.slice(2)));
const s2z = v => v + EPAD2;                                                      /* เลื่อนพิกัดเฟส 6 */
const s2Rect = r => Object.assign({}, r, {z0:r.z0+EPAD2, z1:r.z1+EPAD2});
const s2Tile = t => Object.assign({}, t, {z:t.z+EPAD2});
const s2List = a => a.map(p => [p[0], p[1]+EPAD2].concat(p.slice(2)));
const RIVER_X = [16,17].map(sx);
const BRIDGE_Z = [9,10].map(sz);        /* สะพานเหนือ: ออกจากบริเวณบ้านตรงๆ ไปถนนใหญ่ของชุมชน */
const BRIDGE2_Z = [26,27].map(sz);      /* สะพานใต้: ออกทางช่องรั้วพุ่มด้านล่าง → ถนนล่างของชุมชน */
const FARM_BRIDGE_Z = [11,12];          /* สะพานเหนือสุด: เชื่อมโซนฟาร์ม (หน้าบ้านชาวนา) ↔ ทางเดินไปชายหาด */
const BRIDGES = [FARM_BRIDGE_Z, BRIDGE_Z, BRIDGE2_Z];
function isBridgeZ(z){ return FARM_BRIDGE_Z.includes(z) || BRIDGE_Z.includes(z) || BRIDGE2_Z.includes(z); }
const HOUSE_FOOT = sRect({x0:3, x1:6, z0:3, z1:5});
const DOOR_TILE = sTile({x:5, z:6});   /* ช่องหญ้าหน้าประตูบ้าน */
const SPAWN_TILE = sTile({x:9, z:11});
/* ต้นไม้ seed (decor ย้าย/ลบได้) — ต้องอยู่ในบริเวณบ้าน (HOME_ZONE) เท่านั้น
   ของนอกกรอบเป็นฉากตายตัวใน WILD_GROVES แทน (ย้ายไม่ได้ จึงไม่หลุดกติกา "วางได้แค่ในบริเวณบ้าน") */
const TREES = sList([[3,11],[1,12],[3,17],[12,2],[9,15],[12,5],[13,12],[14,2],[6,13],[11,7],
               [14,9],[2,15],[10,13],[15,6],[5,19],[13,17],[11,18],[15,16]]);
/* ([15,4] = ช่อง 27,30 เอาออกแล้วเมื่อ 2026-08-09 — อยู่กลางทางเดินใหม่ x26-27/z25-39 พอดี) */
const FLOWERS = sList([[8,5],[10,9],[2,10],[6,16],[11,3],[12,16],[4,7],[1,18],[14,19],[19,16],[20,16],
                 [21,17],[40,12],[52,18],[52,23],[22,25],
                 [34,28],[44,29],[22,36],[37,34],[19,38],[47,39]]).concat([
                 /* ดอกไม้แถบชุมชนที่ 2 + สวนท้ายชุมชน (พิกัดใหม่ ไม่ต้องเลื่อน)
                    (เดิมมี [8,42] = ช่อง 8,52 เอาออกแล้วเมื่อ 2026-08-03 — อยู่ใต้ตัวแฟชั่นมอลล์พอดี) */
                 [10,56],[11,55],[21,57],[5,55],[18,57],[15,42],[3,39]].map(p=>[p[0], p[1]+EPAD2]));

/* ---------- กรอบ "บริเวณบ้าน" (วาง/ย้ายของตกแต่งได้แค่ในกรอบนี้) ----------
   ⚠ ย่อกรอบมา 2 รอบแล้ว (ดูรายละเอียดกติกาการวางของที่ inHomeZone ด้านล่าง)
     2026-08-09 รอบแรก: sx(0)/sz(0)-sz(19) (จริง x12-27 / z26-45) → x13-27 / z27-41
     2026-08-09 รอบสอง (คำขอผู้ใช้): ตัดท้ายเหลือ **แถว z38** และตัดคอลัมน์ท้ายจาก x27 เหลือ **x25**
       ⇒ จริง **x13-25 / z27-38** — แถบที่ตัดออก (x26-27 / z39-41) กลายเป็นทางเดินรอบบ้าน (ดู HOME_TRAIL) */
const HOME_ZONE = {x0:sx(1), x1:sx(13), z0:sz(1), z1:sz(12)};
/* บริเวณบ้าน: รั้วไม้ครีม **ล้อมกรอบบริเวณบ้านทั้งผืน** (ไม่ใช่แค่สนามรอบตัวบ้านเหมือนเดิม)
   — เปลี่ยนเมื่อ 2026-08-09 ตามคำขอผู้ใช้ ⇒ YARD = HOME_ZONE เป๊ะๆ ของที่เด็กวางได้ทุกชิ้นจึงอยู่ในรั้วเสมอ
   (ต้นไม้/ดอกไม้ที่เคยทับแนวรั้ว [1,3],[8,2],[2,8],[7,1] ถูกย้ายออกไปนอกสนามแล้ว) */
const YARD = {x0:HOME_ZONE.x0, x1:HOME_ZONE.x1, z0:HOME_ZONE.z0, z1:HOME_ZONE.z1};
/* ช่องรั้วเปิด 2 ทาง (คำขอผู้ใช้ 2026-08-09):
   1) ขอบตะวันออก x25 / z35-36 — ตรงแนวสะพานเหนือ (BRIDGE_Z) พอดี ออกไปทางเดิน x26-27 แล้วข้ามสะพานเข้าเมือง
   2) ขอบใต้ x19-20 / z38 — ตรงแนวทางเดินดินหน้าบ้าน (HOME_EXIT_X) ที่ทอดลงไปหาสะพานใต้ */
const GATE_TILES = [{x:HOME_ZONE.x1, z:sz(9)}, {x:HOME_ZONE.x1, z:sz(10)},
                    {x:sx(7), z:HOME_ZONE.z1}, {x:sx(8), z:HOME_ZONE.z1}];
/* ช่องปลายทางเดินหินหน้าประตูบ้าน — แนว x เดียวกับ DOOR_TILE ต้องโล่งตลอด ห้ามวางของทับ
   (เดิมค่านี้คือ "ช่องรั้วเปิด" ตอนรั้วยังล้อมแค่สนามรอบบ้าน ตอนนี้อยู่กลางสนามแล้ว ไม่ใช่ช่องรั้ว) */
const GATE_TILE = sTile({x:5, z:8});
const PET_HOUSE_TILE = sTile({x:8, z:3});/* ในสนาม ข้างขวาบ้านใหญ่ */
/* "หน้าบ้าน" = แถบหญ้าฝั่งประตู (+z) ตั้งแต่ช่องหน้าประตูถึงหน้าประตูรั้ว กว้างเท่าตัวบ้าน+ข้างละ 1-2 ช่อง
   กล้อง isometric มองจากฝั่ง (+x,+z) → ถ้ามีต้นไม้สูงในแถบนี้จะบังตัวบ้านพอดี จึงห้าม seed ของสูงลงไป */
const HOUSE_VIEW = {x0:HOUSE_FOOT.x0-1, x1:HOUSE_FOOT.x1+2, z0:DOOR_TILE.z, z1:sz(10)};
function isFenceTile(x, z){
  const edge = ((x===YARD.x0 || x===YARD.x1) && z>=YARD.z0 && z<=YARD.z1) ||
               ((z===YARD.z0 || z===YARD.z1) && x>=YARD.x0 && x<=YARD.x1);
  return edge && !GATE_TILES.some(g => g.x===x && g.z===z);
}

/* ---------- กติกาการวางของในกรอบ "บริเวณบ้าน" (ตัวกรอบ HOME_ZONE ประกาศไว้ข้างบน คู่กับ YARD/รั้ว) ----------
   นอกกรอบ (ป่ารอบบ้าน + ฝั่งหมู่บ้านข้ามสะพาน) เดินเที่ยวได้ แต่เป็นฉากตายตัว ตกแต่งไม่ได้
   → decorCanPlace เช็ค inHomeZone, โหมดตกแต่งโชว์กรอบเส้นประ (homeZoneFrame) ให้เด็กเห็นขอบเขต
   แถบที่ถูกตัดออกตอนย่อกรอบกลายเป็นป่า/ทางเดินปกติ (wildPlantable ปลูกต้นไม้ป่าทับได้แล้ว) */
function inHomeZone(x, z){
  return x>=HOME_ZONE.x0 && x<=HOME_ZONE.x1 && z>=HOME_ZONE.z0 && z<=HOME_ZONE.z1;
}
function clampHomeTile(t){
  return {x: Math.max(HOME_ZONE.x0, Math.min(HOME_ZONE.x1, t.x)),
          z: Math.max(HOME_ZONE.z0, Math.min(HOME_ZONE.z1, t.z))};
}
/* แถวรอยต่อขอบบริเวณบ้านด้านใต้ — เดิมเป็นแนวพุ่มไม้ตีกรอบ เอาออกแล้ว (บริเวณบ้านดูโล่งต่อเนื่องกับป่า
   ขอบเขตวางของยังเห็นได้จากกรอบเส้นประในโหมดตกแต่ง) เก็บค่าไว้เป็นแถวหญ้าโล่ง + จุดตั้งต้นทางเดินดินออกจากบ้าน */
const HOME_EDGE_Z = HOME_ZONE.z1 + 1, HOME_EXIT_X = [7,8].map(sx);

/* ---------- ชุมชนฝั่งข้ามสะพาน (x≥18) ----------
   ผังเมืองแบบตาราง: ถนนหินกว้าง 2 ช่อง 4 สาย + ลานกลางชุมชนมีน้ำพุ + ล็อตอาคาร (ร้านค้า/บ้าน NPC/โรงเรียน)
   ทุกล็อตหันประตูไปทางทิศใต้ (+z) เสมอ และช่องหน้าประตู (z1+1) เป็นทางเดินว่างเสมอ
   → เฟสถัดไป: วางตัว NPC ที่ช่องหน้าประตู แล้วผูกเควสต์/เกมโจทย์เข้ากับ lot.id ได้เลย */
const VILLAGE_X0 = RIVER_X[RIVER_X.length-1] + 1;      /* ช่องแรกฝั่งชุมชน */
const VILLAGE_ROADS = [
  {x0:18, x1:55, z0:9,  z1:10},           /* ถนนใหญ่ ต่อจากสะพานตรงเข้าชุมชน — ยาวจนสุดขอบแผนที่ทิศตะวันออก (x67) */
  {x0:25, x1:26, z0:3,  z1:37},           /* ถนนแยกเหนือ-ใต้ ฝั่งตะวันตก */
  {x0:41, x1:42, z0:3,  z1:37},           /* ถนนแยกเหนือ-ใต้ ฝั่งตะวันออก */
  {x0:18, x1:55, z0:26, z1:27},           /* ถนนใต้ (ต่อจากสะพานใต้ BRIDGE2_Z) — ต่อไปจนสุดขอบแผนที่ทิศตะวันออก */
].map(sRect).concat([
  {x0:53, x1:54, z0:14, z1:18},           /* ถนนลงชายหาด (ต่อจากถนนแยกฝั่งตะวันออกไปหาดทราย) */
].map(s2Rect)).concat([
  /* ถนนแยกเลียบสนามเด็กเล่น (พิกัดจริง ไม่ต้องเลื่อน): จากถนนบน z36 ผ่านหน้าสถานีตำรวจ
     ตัดถนนใต้ที่ z52-53 แล้วยาวต่อไปจนสุดขอบแผนที่ทิศใต้ */
  {x0:64, x1:65, z0:46, z1:67},
]);
/* ---------- ชุมชนที่ 2: ทิศตะวันตกเฉียงเหนือ + ทิศตะวันตก (ฝั่งเดียวกับบ้านเด็ก ไม่ต้องข้ามคลอง) ----------
   ผังเหมือนชุมชนแรก (ถนนหินกว้าง 2 ช่อง + ล็อตหันประตูไปทิศตะวันตก +z) แต่เล็กกว่า
   ต่อกับทางเดินดินหน้าบ้าน (HOME_TRAIL) ตรงหัวสะพานใต้ → เด็กเดินจากบ้านมาถึงได้เลย
   พิกัดชุดนี้เป็นพิกัดใหม่ (ไม่ต้อง sRect เลื่อน เพราะเป็นพื้นที่ที่เพิ่งเปิดตอนขยายแผนที่) */
const VILLAGE2_ROADS = [
  {x0:6,  x1:21, z0:47, z1:48},   /* ถนนใหญ่ของชุมชน วิ่งจากถนนแยกฝั่งตะวันตกเฉียงเหนือ (x6-7) มาจบที่ถนนแยกริมคลอง
                                     (เดิมเริ่มที่ x1 = ขอบแผนที่ทิศเหนือ — ช่วง x1-5 เคยเป็นทางเดินคั่นระหว่าง
                                      "ร้านผัก 🥕" กับ "บ้านหลังสีฟ้า" ตัดทิ้งเมื่อ 2026-08-03 ตามคำขอผู้ใช้
                                      ให้ 2 บล็อกนั้นรวมเป็นผืนเดียวสำหรับเฟอร์นิเจอร์มอลล์
                                      ⇒ **ห้ามต่อกลับถึง x1** ไม่งั้นถนนจะผ่ากลางตัวห้าง)
                                     (เดิมยาวถึง x27 = ถนนหลังโรงเรียน เอาออกแล้ว เขตโรงเรียนจะได้เป็นผืนเดียว) */
  {x0:5,  x1:5,  z0:44, z1:52},   /* ทางเท้าหน้าเฟอร์นิเจอร์มอลล์ (จริง = x5 / z54-62) ปูพื้นชุดเดียวกับถนน
                                     ต่อเนื่องกับถนนแยก x6-7 เป็นลานหน้าห้างกว้าง 3 ช่อง (เสาไฟ 5,62 ยืนบนทางเท้านี้พอดี) */
  {x0:6,  x1:7,  z0:44, z1:54},   /* ถนนแยกฝั่งตะวันตกเฉียงเหนือ (จบที่ถนนล่าง ไม่ยื่นเข้าสวน) */
  {x0:20, x1:21, z0:44, z1:54},   /* ถนนแยกฝั่งริมคลอง (ต่อจากทางเดินดินหน้าสะพานใต้) */
  {x0:1,  x1:27, z0:53, z1:54},   /* ถนนล่าง (หน้าโรงเรียน) */
  /* ⚠ พิกัดในลิสต์นี้ถูกเลื่อนด้วย s2Rect (+EPAD2 = +10 บนแกน z) ⇒ **เขียนค่าลบ 10 เสมอ**
     ลานทางเดินใหญ่หน้าร้านของเล่น (จริง = x5-10 / z43-53) — เพิ่ม 2026-08-09 ตามคำขอผู้ใช้
     ต่อเนื่องเป็นผืนเดียวกับลานหน้าห้าง 2 หลัง (x5) และถนนแยก x6-7 ที่อยู่ถัดลงไป
     โบโซ่กับรถเข็นลูกโป่งย้ายมาตั้งกลางลานนี้ */
  {x0:5,  x1:10, z0:34, z1:43},
  /* ทางเดินต่อจากลานหน้าร้านของเล่นไปทางตึกแล็บ (จริง = x11-18 / z44-45) เพิ่ม 2026-08-09 */
  {x0:11, x1:18, z0:34, z1:35},
  /* ทางเดินเลียบข้างร้านของเล่นฝั่งตะวันตก (จริง = x11-12 / z39-43) เพิ่ม 2026-08-09 ตามคำขอผู้ใช้
     — ต่อลานหน้าร้านของเล่นขึ้นไปทางทุ่งด้านบน ผ่านหน้ารถเข็น 2 คันที่ x14/x17 */
  {x0:11, x1:12, z0:29, z1:33},
  {x0:8,  x1:19, z0:44, z1:45},   /* ลานทางเดินหน้าตึกแล็บ (จริง = x8-19 / z54-55) — คั่นระหว่างตึกแล็บ
                                     กับขอบเหนือของตลาด (z56) ปูพื้นชุดเดียวกับถนน ต่อเนื่องกับลานตลาด
                                     ทั้งผืน (คำขอผู้ใช้ 2026-08-03 — เดิมเป็นแนวหญ้าหลังย่อกรอบตลาดลงมา) */
].map(s2Rect);
const PLAZA = sRect({x0:30, x1:37, z0:14, z1:22});     /* ลานกลางชุมชน (พื้นหินอ่อน เดินได้) */
const FOUNTAIN = sRect({x0:33, x1:34, z0:17, z1:18});  /* น้ำพุกลางลาน (บล็อกทางเดิน) */
/* ล็อตอาคาร: kind shop = ร้านค้า (มีกันสาด+ป้ายรูป), home = บ้าน NPC, school = โรงเรียน
   icon = อิโมจิบนป้ายร้าน (วาดรวมเป็น texture แผ่นเดียว ดู buildSignAtlas) */
const VILLAGE_LOTS = [
  /* ร้านสะดวกซื้อของชุมชน (เดิมล็อตนี้เป็น "ร้านขนมปัง" ทรงบ้านจั่ว เปลี่ยนทั้งร้านเมื่อ 2026-08-02)
     ตัวอาคารเป็นตึกหลังคาแบน + แถบป้ายคาดรอบ + กระจกหน้าร้านบานใหญ่ (ดู buildMinimart ใน house.js)
     wall ขาวนวลตัดกับแถบป้ายสีส้ม ให้ดูเป็นร้านสะดวกซื้อ ไม่ใช่บ้าน */
  {id:'shop-mart',    kind:'shop', shopKind:'mart',   name:'ร้านสะดวกซื้อ', icon:'🏪', wall:0xfdfbf5, roof:0xef8354, x0:20, x1:23, z0:5,  z1:7},
  /* ร้านสัตว์เลี้ยง+อาบน้ำตัดขนหลังใหญ่ — ล็อตขยายเป็น 7×4 กินที่ของ "ร้านเกม" เดิมที่เอาออกไปแล้ว
     คอกสัตว์ย้ายจากหลังร้านมาอยู่ "ด้านข้าง" ทางทิศตะวันตกของร้าน (ดู pen-petshop ใน ANIMAL_PENS) */
  {id:'shop-pet',     kind:'shop', shopKind:'pet',    name:'ร้านสัตว์เลี้ยง', icon:'🐾', wall:0xfff0e0, roof:0xf2a65a, x0:34, x1:40, z0:4,  z1:7},
  /* โรงพยาบาลของชุมชน (เดิมเป็นล็อตร้านผลไม้) — ล็อตใหญ่ 8×5 ตึกขาว 2 ชั้น + ลานจอดรถพยาบาล
     ร้านผลไม้ย้ายไปอยู่ท้ายแถวร้านค้าด้านล่างแทน (ล็อตเดิมเล็กเกินไปสำหรับโรงพยาบาล) */
  {id:'hospital',     kind:'hospital', name:'โรงพยาบาล', icon:'🏥', desc:'โรงพยาบาลของชุมชน มีคุณหมอกับพยาบาลคอยดูแลทุกคนให้แข็งแรง',
   wall:0xf7fbff, roof:0x5aa9e6, x0:44, x1:51, z0:3,  z1:7},
  /* ร้านอาหารหลังใหญ่: รวมที่ของร้านไอติมเดิมกับร้านสัตว์เลี้ยงเดิมเป็นผืนเดียว มีลานโต๊ะนั่งกินข้าวด้วย */
  {id:'shop-food',      kind:'shop', shopKind:'food',      name:'ร้านอาหาร',       icon:'🍜', wall:0xfff4e2, roof:0xe4574a, x0:20, x1:23, z0:12, z1:16},   /* lot = เฉพาะตัวอาคาร ลานโต๊ะยื่นออกไปทางใต้ (เดินเข้าไปนั่งได้) */
  /* บ้านหลังใหญ่ของท่านเทศมนตรี (เดิม home-2 บ้านฟ้าหลังเล็ก) — ล็อตกว้างขึ้นเป็น 5×4 ให้สมฐานะ */
  {id:'mayor-house',  kind:'mayor', name:'บ้านท่านเทศมนตรี', icon:'🏛️', desc:'บ้านหลังใหญ่ที่สุดในชุมชน มีเสาสูงกับหอนาฬิกาด้วย',
   wall:0xfff6ea, roof:0x6f86c9, x0:19, x1:23, z0:29, z1:32},
  /* โรงแรมของชุมชน (เดิม home-3 บ้านหลังคาชมพู) — ตึก 3 ชั้น ล็อต 5×4 */
  {id:'hotel',        kind:'hotel', name:'โรงแรมของชุมชน', icon:'🏨', desc:'โรงแรมสำหรับแขกที่มาเที่ยวชุมชนเรา มีสระว่ายน้ำอยู่ข้างๆ ด้วย',
   wall:0xfff2dc, roof:0xe8759b, x0:28, x1:32, z0:29, z1:32},
  /* (home-4 บ้านหลังคาเขียวเดิม เอาออกแล้ว พื้นที่ตรงนั้นกลายเป็นสระว่ายน้ำของโรงแรม — ดู POOL) */
  /* สถานีตำรวจของชุมชน (เดิม home-5 บ้านหลังคาเหลือง) — ตัวอาคารขาว-น้ำเงิน มีกันสาดหน้าประตู + ไฟสัญญาณบนหลังคา */
  /* สถานีตำรวจ: ขยายจาก 4×3 เป็น 7×4 (อาคารใหญ่สมเป็นสถานี มีลานจอดรถสายตรวจ)
     และเลื่อนลงมาทางใต้/ตะวันตกให้ชิดทางเดิน — ห่างถนนใหญ่เส้นล่างแค่ช่องเดียว เดินเข้าง่าย */
  {id:'police-station', kind:'police', style:'plain', name:'สถานีตำรวจ', icon:'🚓', desc:'สถานีตำรวจของชุมชน มีคุณตำรวจคอยดูแลให้ทุกคนปลอดภัย',
   wall:0xf2f7ff, roof:0x3f6bb5, x0:44, x1:50, z0:21, z1:24},
  /* ร้านเครื่องดนตรีของชุมชน (เดิมล็อตนี้เป็น home-6 "บ้านเพื่อนบ้าน" หลังคาม่วง เปลี่ยนทั้งหลังเมื่อ 2026-08-06)
     ล็อตขยายจาก 4×3 เป็น 7×4 เท่าสถานีตำรวจ (ร้านใหญ่) ตัวอาคาร 2 ชั้นหลังคาแบน แถบป้ายคาดรอบ
     กระจกโชว์เครื่องดนตรี + แถบคีย์เปียโนคาดฐาน + กีตาร์ยักษ์บนดาดฟ้า (ดู buildMusicShop ใน house.js)
     คงโทนม่วงของหลังเดิมไว้ ให้จำที่หมายเดิมได้ แต่ผนังขาวนวลตัดกับแถบม่วง ดูเป็นร้านไม่ใช่บ้าน */
  {id:'shop-music', kind:'shop', shopKind:'music', name:'ร้านเครื่องดนตรี', icon:'🎸',
   desc:'ร้านเครื่องดนตรีของชุมชน มีกีตาร์ กลอง คีย์บอร์ด ให้ลองเล่นได้',
   wall:0xfdf8ff, roof:0x9a72d8, x0:44, x1:50, z0:29, z1:32},
].map(sRect).concat([
  /* โซนฟาร์มทิศตะวันออก + ชุมชนที่ 2 (พิกัดที่เขียนไว้ตอนเฟส 6 → เลื่อนด้วย s2Rect) */
  {id:'farm-barn',  kind:'barn', name:'โรงนาเพื่อนบ้าน', icon:'🐄', wall:0xe0715c, roof:0xf6e3cc, x0:22, x1:25, z0:10, z1:12},
  {id:'farm-house', kind:'home', style:'dormer', name:'บ้านชาวนา', icon:'🌾', wall:0xfff2dc, roof:0xd8a24a, x0:22, x1:25, z0:0,  z1:2},
  /* ชุมชนที่ 2 ทิศตะวันตก/ตะวันตกเฉียงเหนือ — ประตูออกถนนใหญ่ (z47) แถวบน / ถนนล่าง (z53) แถวล่าง
     โรงเรียนย้ายมาอยู่ริมคลองใหญ่ฝั่งเดียวกับบ้านเด็ก (เดิมอยู่ฝั่งชุมชนข้ามสะพาน) — id เดิมคงไว้
     ล็อตที่เคยติดโรงเรียนริมคลอง (w-home-3) เอาออกแล้ว เปิดเป็นลานหญ้าข้างโรงเรียน */
  /* (w-home-1 บ้านหลังคาฟ้า x1-4/z54-56 + w-shop-veg ร้านผัก 🥕 x1-4/z60-62 เอาออกแล้วเมื่อ 2026-08-03
     ตามคำขอผู้ใช้ — พร้อมกับตัดทางเดิน (ถนนใหญ่ช่วง x1-5) ที่คั่นอยู่ระหว่างสองหลังออกไปด้วย
     ทั้ง 2 บล็อกรวมเป็นผืนเดียวกลายเป็น "เฟอร์นิเจอร์มอลล์" หลังเดียวยาวตลอด ดู mall-furniture ด้านล่าง
     ป้าผักเจ้าของร้านเดิม (npc-veg) จึงถูกเอาออกไปด้วย) */
  /* (w-home-2 บ้านหลังคาชมพู + w-shop-milk ร้านนมหลังคาฟ้า เอาออกแล้วเมื่อ 2026-08-02 —
     แถว z54-56 ทั้งแถบ x8-19 กลายเป็นถนนคนเดินของตลาด ต่อขยายจากลานตลาดที่อยู่ใต้ถนนใหญ่ลงไป
     ลุงนมเจ้าของร้านนมเดิมย้ายมาขายนมที่รถเข็นในตลาดแทน ดู npc-milk) */
  /* (w-home-4 หลังคาม่วง + w-home-5 หลังคาแดง เอาออกแล้วเมื่อ 2026-08-02 — บล็อกนี้กลายเป็น
     "ตลาดรถเข็นหน้าโรงเรียน" ทั้งผืน ดู MARKET / MARKET_CARTS ด้านล่าง) */
  {id:'school',      kind:'school', name:'โรงเรียน',   icon:'🏫', wall:0xfff2dc, roof:0xef5f5f, x0:23, x1:26, z0:45, z1:48},   /* ตัวอาคารอยู่แถว z55-58 (หน้าโรงเรียนเป็นลาน z59-62) */
].map(s2Rect)).concat([
  /* เฟส 7 (แถบใหม่ทิศตะวันออก z 0-9 + ริมบ่อน้ำ) — พิกัดใหม่ เขียนตรงๆ ไม่ต้องเลื่อน */
  /* กระท่อมริมบ่อ: ย้ายไปชิดขอบแผนที่ด้านบน (ทิศเหนือสุด x0-3) ริมชายบ่อฝั่งตะวันตก
     ท่าไม้+คนตกปลายังอยู่ชายบ่อฝั่งตะวันออก (x9-11) ตามเดิม — คนละมุมบ่อ หลังคาจึงไม่บังกัน */
  {id:'pond-hut',     kind:'hut',  name:'กระท่อมริมบ่อ', icon:'🎣', wall:0xcf9f68, roof:0x8d6e63, x0:0, x1:3, z0:24, z1:26},
  {id:'farm-cowshed', kind:'barn', name:'โรงเลี้ยงวัว',  icon:'🐮', wall:0xf6e3cc, roof:0xc4573f, x0:13, x1:16, z0:1,  z1:3},
  /* กระท่อมช่างไม้: ป่าทิศเหนือ เหนือบ้านเด็กขึ้นไป — ตัวกระท่อมเป็นซุงซ้อนชั้น มีเพิงช่างไม้เปิดโล่งด้านหน้า
     รอบๆ เป็นลานโล่งกลางป่า มีตอไม้/กองซุง/ไม้แปรรูป (CARPENTER_PROPS) ให้ดูเหมือนที่ทำงานของช่างไม้จริง
     ถอยหลัง (ทิศ -z) ไป 4 ช่องเมื่อ 2026-08-03 ตามคำขอผู้ใช้ (เดิม z40-42) — ลานช่างไม้/ของในลาน/
     กรอบเดินของลุงช่างไม้กับป้ามะลิ เลื่อนตามมาทั้งชุด ไม่งั้นกองซุงจะค้างอยู่ที่เดิมห่างจากกระท่อม
     ⚠ ขยับไปทางตะวันออก (-z) 4 ช่องเมื่อ 2026-08-08 (เดิม z36-38) แล้ว **ถอยกลับมาทางตะวันตก (+z) 2 ช่อง
       เมื่อ 2026-08-09 ตามคำขอผู้ใช้** (สุทธิ z34-36) แล้ว **ถอยหลัง (-z) อีก 1 ช่องในวันเดียวกัน
       ตามคำขอผู้ใช้** ⇒ สุทธิ **z32-34** · ต่อกับขอบลานตั้งแคมป์ (CAMP z1=31) พอดี
       ลานช่างไม้/ของในลาน/กรอบเดินของลุงกับป้ามะลิ เลื่อนตามทั้งชุดทุกครั้ง */
  {id:'carpenter-hut', kind:'carpenter', name:'กระท่อมช่างไม้', icon:'🪚', wall:0xe8c79a, roof:0x7fb98c, x0:1, x1:4, z0:32, z1:34},
  /* ---------- ร้านต้นไม้/สวน (เพิ่ม 2026-08-08 · ข้อ 17.4 ของ QUEST-DESIGN.md) ----------
     ⚠ ย้ายมาลานหญ้าหน้าโรงเรียน (เดิม x1-4/z37-40 กลางป่าข้างกระท่อมช่างไม้) เมื่อ 2026-08-09
       ตามคำขอผู้ใช้ — ขอบหน้าร้านจบที่ z51 ตรงจุดที่รถเข็นลูกโป่งของโบโซ่เคยตั้งอยู่
       (โบโซ่ + รถเข็นย้ายไปลานทางเดินใหม่หน้าร้านของเล่นแทน) ช่องหน้าประตูคือ z52 ซึ่งโล่งอยู่แล้ว */
  {id:'shop-garden', kind:'shop', shopKind:'garden', name:'ร้านต้นไม้', icon:'🌷',
   desc:'ร้านต้นไม้กับของแต่งสวนของชุมชน มีกระถางดอกไม้ ต้นไม้ ของแต่งสนามให้เลือกเยอะเลย',
   wall:0xf2fbef, roof:0x6cb96a, x0:22, x1:25, z0:47, z1:50},
  /* บ้านชาวประมง: บ้านไม้ทิศตะวันออกเฉียงใต้ หลังร้านหนังสือ (หลังคาฟ้า) ริมถนนที่ลงไปชายหาด
     ด้านหลังบ้าน (ฝั่งทะเล) มีราวตากปลา FISH_RACKS */
  {id:'fisher-home',  kind:'hut',  name:'บ้านชาวประมง', icon:'🐟', wall:0xdcb888, roof:0x7d5a46, x0:49, x1:52, z0:23, z1:25},
  /* ตึกแล็บวิทยาศาสตร์ของชุมชน — ตั้งบนที่โล่งเหนือตลาดรถเข็น (มุมล็อตด้านใต้-ตะวันตกอยู่ที่ช่อง x17,z52
     แล้วกินพื้นที่ไปทางเหนือ (-x) กับตะวันออก (-z) เป็น 6×5 ช่อง) ประตูหันลง +z ออกหาถนนคนเดินของตลาด
     ต้นไม้ป่าที่เคยขึ้นตรงนี้หายไปเองตามกติกา canPlant (ของสูงห้ามอยู่ในระยะ 4 ช่องจากล็อตอาคาร) */
  {id:'lab', kind:'lab', name:'แล็บวิทยาศาสตร์', icon:'🔬',
   desc:'ห้องทดลองวิทยาศาสตร์ของชุมชน มีโดมดูดาวบนหลังคาด้วย นักวิทยาศาสตร์ทำงานกันอยู่ข้างใน',
   wall:0xf7fbff, roof:0x5aa9e6, x0:12, x1:17, z0:48, z1:52},
  /* ---------- ห้างสรรพสินค้า 2 หลังของชุมชนที่ 2 (เพิ่มเมื่อ 2026-08-03) ----------
     ทั้งคู่ใช้ kind:'mall' → buildMall() ใน js/house.js (ตึกกระจกหลังคาแบน 2 ชั้น + ป้ายใหญ่บนดาดฟ้า)
     ต่างกันที่ `mallKind` = ของที่ขาย (ของโชว์ในตู้กระจก / สัญลักษณ์ยักษ์บนหลังคา / ของหน้าร้าน)

     1) เฟอร์นิเจอร์มอลล์ — กินที่ของร้านผัก + บ้านฟ้า + ทางเดินที่คั่นอยู่ รวมเป็นผืนเดียว 5×9 ช่อง
        (กินถึงคอลัมน์ขอบแผนที่ x0 ด้วย — ด้านหลังห้างชนขอบแผนที่พอดี ไม่มีใครเดินอ้อมหลังอยู่แล้ว
         เอาความลึกที่ได้มาเว้นเป็นลานหน้าห้าง "ในกรอบล็อต" ของโชว์หน้าห้างจะได้ไม่ไปตั้งบนช่องที่เด็กเดินทะลุได้)
        (หลังยาวที่สุดในเมือง) **`face:'x'` = หันหน้าไปทาง +x (ทิศใต้)** ออกหาถนนแยก x6-7 ตามคำขอผู้ใช้
        ไม่ใช่ +z เหมือนล็อตอื่นทั้งแผนที่ ⇒ lotDoorTile/inLotFrontStrip เช็คธงนี้ และ buildMall หมุนตัวอาคาร 90°
     2) แฟชั่นมอลล์ — **ย้ายมาต่อแถวเดียวกับเฟอร์นิเจอร์มอลล์เมื่อ 2026-08-08 ตามคำขอผู้ใช้**
        (เดิมอยู่ x5-10/z48-52 ข้างตึกแล็บ) มาแทนที่ทุ่งทานตะวันผืนใหญ่ x0-4/z43-52 ที่ถูกเอาออกไป
        ติดธง `face:'x'` เหมือนกัน ⇒ **หันหน้าไปทาง +x ทางเดียวกับเฟอร์นิเจอร์มอลล์** ลานหน้าห้างเป็น
        คอลัมน์ x5 ต่อกันยาวเป็นแถวห้าง 2 หลัง เว้น z53 เป็นทางเดินคั่นระหว่างสองหลัง */
  {id:'mall-furniture', kind:'mall', mallKind:'furniture', face:'x', name:'เฟอร์นิเจอร์มอลล์', icon:'🛋️',
   desc:'ห้างเฟอร์นิเจอร์หลังใหญ่ที่สุดในเมือง มีโซฟา เตียง โคมไฟ ตู้ ครบทุกอย่างเลย',
   wall:0xfff6ea, roof:0xe89a4f, x0:0, x1:4, z0:54, z1:62},
  {id:'mall-fashion', kind:'mall', mallKind:'fashion', face:'x', name:'แฟชั่นมอลล์', icon:'👗',
   desc:'ห้างเสื้อผ้าของชุมชน มีชุดสวยๆ หมวก กระเป๋า รองเท้า ให้เลือกเต็มไปหมดเลย',
   wall:0xfff4fa, roof:0xef7fa8, x0:0, x1:4, z0:44, z1:52},
  /* ---------- ร้านของเล่น (เพิ่ม 2026-08-08 · ข้อ 17.4) ----------
     ตั้งบนล็อตที่แฟชั่นมอลล์ย้ายออกไป เว้นคอลัมน์ x5 ไว้เป็นลานหน้าห้างของแฟชั่นมอลล์
     อยู่ติดตลาด/ตึกแล็บ = ทางที่เด็กเดินผ่านบ่อยที่สุดในเมือง เหมาะกับร้านของเล่น
     ⚠ ขยับไปทางตะวันออก (-z) อีก 6 ช่อง (เดิม z48-52) เมื่อ 2026-08-09 ตามคำขอผู้ใช้ — ขอบหน้าร้านมาจบที่ z42
       พอดี แล้วเปิดพื้นที่ z43-53 ทั้งผืนเป็น "ลานทางเดิน" ใหม่หน้าร้าน (ดู VILLAGE2_ROADS) */
  {id:'shop-toy', kind:'shop', shopKind:'toy', name:'ร้านของเล่น', icon:'🎠',
   desc:'ร้านของเล่นของชุมชน มีชิงช้า ม้าโยก บ้านต้นไม้ เครื่องเล่นสนามให้เลือกเพียบ',
   wall:0xfff7e6, roof:0x54b3d6, x0:6, x1:10, z0:39, z1:43},
]);
const LOT_BY_ID = {}; VILLAGE_LOTS.forEach(l=>{ LOT_BY_ID[l.id] = l; });
/* ช่องหน้าประตูล็อต (ที่เด็กจะเดินไปยืนคุย/รับเควสต์กับ NPC ในเฟสถัดไป)
   ปกติทุกล็อตหันประตูไป +z → ช่องหน้าประตูอยู่แถว z1+1
   ล็อตที่ติดธง `face:'x'` (เฟอร์นิเจอร์มอลล์) หันประตูไป +x (ทิศใต้) → ช่องหน้าประตูอยู่คอลัมน์ x1+1 แทน */
function lotDoorTile(lot){
  if(lot.face === 'x') return {x: lot.x1 + 1, z: Math.round((lot.z0+lot.z1)/2)};
  return {x: Math.round((lot.x0+lot.x1)/2), z: lot.z1 + 1};
}
/* กลุ่มต้นไม้ฉากตายตัวนอกกรอบบ้าน: [x กลางกลุ่ม, z กลางกลุ่ม, จำนวนต้น, ชนิด]
   ฉากทั้งหมดนี้ถูก "รวม geometry" เป็นก้อนต่อโซน (ดู buildStaticScenery) จึงใส่ได้เยอะโดยไม่กิน draw call */
const WILD_GROVES = [
  /* แนวป่าปิดขอบเหนือของฟาร์ม (หลังคอกสัตว์) — เดิมเป็นหญ้าโล่งยาวจนดูโหวง */
  [15,0,3,'pine'], [17,1,2,'tree-round'], [14,2,3,'pine'], [16,3,2,'tree'],
  [18,1,2,'pine'], [15,5,2,'tree-round'], [14,7,2,'pine'], [16,8,2,'tree-round'],


  /* ป่าใต้แนวพุ่ม (ฝั่งบ้าน z≥21) */
  [2,24,3,'pine'], [7,26,3,'tree-round'], [12,23,2,'pine'], [4,28,2,'tree-round'], [14,27,2,'pine'],
  [2,33,3,'pine'], [8,34,3,'tree-round'], [13,32,2,'pine'], [5,38,3,'tree-round'], [11,39,3,'pine'],
  [1,29,2,'tree-round'], [15,36,2,'pine'],
  /* ริมคลองฝั่งชุมชน + ขอบแผนที่ด้านเหนือ */
  [19,3,2,'tree-round'], [19,16,2,'pine'], [19,23,2,'tree-round'], [19,33,3,'pine'], [19,39,2,'tree-round'],
  [23,1,2,'tree-round'], [29,1,2,'pine'], [35,1,2,'tree-round'], [45,1,2,'pine'], [51,2,3,'tree-round'],
  /* คั่นระหว่างล็อตในชุมชน */
  [28,10,1,'pine'], [44,7,1,'tree-round'], [28,23,2,'tree-round'], [39,24,2,'pine'],
  [23,17,2,'tree-round'], [44,17,2,'pine'], [23,34,2,'pine'], [39,17,1,'tree-round'],
  /* สวนสาธารณะมุมตะวันออกเฉียงใต้ + ขอบแผนที่ด้านใต้ */
  [51,15,3,'tree-round'], [51,24,3,'pine'], [51,34,3,'tree-round'], [46,39,3,'pine'],
  [36,40,3,'tree-round'], [28,39,2,'pine'], [21,40,2,'tree-round'], [54,8,2,'pine'],
].map(g => [g[0]+NPAD, g[1]+EPAD_ALL, g[2], g[3]]).concat([
  /* ป่าเหนือ (แถบใหม่ทิศเหนือ x<12) — พิกัดใหม่ ไม่ต้องเลื่อน */
  [2,19,3,'pine'], [7,22,3,'tree-round'], [3,27,3,'pine'], [9,30,2,'tree-round'], [2,35,3,'tree-round'],
  [7,38,3,'pine'], [3,43,3,'tree-round'], [11,33,2,'pine'], [5,17,2,'tree-round'], [1,41,2,'pine'],
  /* ป่าล้อมลานแคมป์ (ทิศใต้+ตะวันตกของแคมป์) — ลานแคมป์ห้ามต้นไม้สุ่มงอกในกรอบ CAMP ถ้าไม่ปลูกล้อมไว้
     รอบนอก แถบนี้จะกลายเป็นทุ่งหญ้าโล่งใหญ่ ไม่เหลือความเป็น "แคมป์กลางป่า" (เติมเมื่อ 2026-08-04) */
  [0,20,2,'pine'], [2,22,2,'tree-round'], [11,19,2,'pine'], [10,24,2,'tree-round'],
  [12,16,2,'pine'], [9,22,2,'pine'], [11,21,1,'tree-round'],
  /* ริมบ่อน้ำใหญ่ */
  [11,3,1,'pine'], [11,12,1,'tree-round'], [1,0,1,'tree-round'], [6,16,1,'pine'],
  /* กรอบต้นไม้ของชุมชนที่ 2: แนวเหนือ (คั่นป่ากับชุมชน) + สวนเล็กท้ายชุมชนริมขอบแผนที่ทิศตะวันตก */
  [13,40,3,'tree-round'], [24,40,2,'pine'], [16,41,2,'pine'],
  [11,56,3,'tree-round'], [16,57,2,'pine'], [25,56,3,'pine'], [2,57,2,'tree-round'], [4,56,2,'pine'],
].map(g => [g[0], g[1]+EPAD2, g[2], g[3]]));
const WILD_BUSHES = [[1,22],[9,29],[15,22],[5,21],[19,21],[24,17],[28,3],[35,25],[38,7],[20,10],[33,11],[29,24],
                     [3,31],[10,36],[14,40],[19,11],[24,29],[31,25],[44,11],[44,24],[50,10],[50,20],[50,30],[38,40],
                     [24,7],[44,33],[29,13],[38,13]].map(p=>[p[0]+NPAD, p[1]+EPAD_ALL]).concat([
                     /* พุ่มกกริมบ่อน้ำ + ริมคลองส่งน้ำในฟาร์ม (พิกัดใหม่) */
                     [1,15],[4,15],[8,14],[11,10],[11,5],[7,0],[3,0],[0,9],[12,6],[12,9],
                     [16,6],[27,9],[18,15],[13,15],[21,6],
                     /* พุ่มไม้เตี้ยแทรกป่ารอบลานแคมป์ (กติกาพุ่มเว้นระยะอาคารน้อยกว่าต้นไม้สูง
                        จึงแทรกช่วง z32-34 ที่ติดกระท่อมช่างไม้จนต้นไม้สูงปลูกไม่ได้) */
                     [1,22],[3,24],[6,25],[8,25],[10,21],[3,18],[2,20],[11,17],
                     /* สวนเล็กท้ายชุมชนที่ 2 (ทิศตะวันตก) */
                     [9,57],[14,55],[19,56],[22,57],[6,57],[26,55]].map(p=>[p[0], p[1]+EPAD2]));
/* ต้นไม้/พุ่มที่ผู้ใช้เลือกช่องเอง — วางตรงช่องนี้เป๊ะ ไม่ต้องผ่านกติกาเว้นระยะถนน/อาคารของป่าอัตโนมัติ
   (ใช้กับจุดตกแต่งเฉพาะที่ เช่น ริมถนนแยกข้างสนามเด็กเล่น ที่กติกาป่าปกติจะไม่ยอมให้ปลูก)
   หมายเหตุ: แถวนี้อยู่รอบสถานีตำรวจ (x56-62 z47-50) ซึ่งเข้าเงื่อนไข "ขอบล็อตอาคาร"
   ต้นไม้จึงถูกกติกาป่าตัดทิ้งตอนท้าย — js/house.js ติดธง fixed ให้ชุดนี้รอดทุกต้น (ดู wildLayout) */
const FIXED_PLANTS = [
  /* --- ป่ารอบลานตั้งแคมป์ + ชายบ่อน้ำ (ผู้ใช้เลือกช่องเอง 2026-08-04) ---
     ช่องพวกนี้อยู่ในระยะ 4 ช่องรอบล็อตกระท่อม หรืออยู่ในกรอบ CAMP กติกาป่าอัตโนมัติจึงปลูกให้ไม่ได้
     ต้องลงเป็น FIXED_PLANTS เท่านั้น (ธง fixed ข้ามทั้งตัวกรองกติกาป่าและการถอนต้นแก้คอขวด) */
  [5,30,'pine'], [6,31,'tree-round'], [4,32,'tree'], [5,26,'pine'], [4,24,'tree-round'], [11,23,'pine'],
  [7,24,'bush'], [8,24,'bush'],                /* พุ่มกกริมน้ำหน้าแคมป์ */
  [11,20,'bush'], [11,21,'bush'],              /* พุ่มกกข้างท่าไม้ตกปลา (POND_PIER อยู่ที่ 11,19 — ห้ามปลูกทับ) */
  /* --- ขอบแผนที่เหนือ-ตะวันตกของบ่อน้ำใหญ่ ---
     แถบหญ้าริมขอบแผนที่กว้าง 2 ช่อง (x0-1) เดิมโล่งเตียนตลอดแนวบ่อ ปลูกเฉพาะคอลัมน์นอกสุด x0
     ⚠ ห้ามปลูกคอลัมน์ x1 และห้ามปลูก (0,10)/(0,11) เด็ดขาด — เป็น "ทางเดินเลียบบ่อ" เส้นเดียวของฝั่งนี้
       (ทิศใต้ตันด้วยล็อตกระท่อม x0-3/z24-26 ทิศเหนือออกได้ทางช่อง 0,9 ช่องเดียว) ปลูกทับแล้วเด็กเดินเข้าไม่ได้ */
  [0,12,'pine'], [0,14,'tree-round'], [0,17,'pine'], [0,18,'bush'],
  [0,20,'tree-round'], [0,23,'pine'],
  /* แบ่งมาปลูก "ริมขอบบ่อด้านบน" ด้วย ไม่ให้ไปกองอยู่ริมขอบแผนที่แถวเดียว (ผู้ใช้แจ้ง 2026-08-04)
     เลือกเฉพาะช่องที่ติดผิวน้ำจริง → ได้แนวต้นไม้เลียบชายบ่อ มองจากในเมืองเห็นบ่ออยู่ในดงไม้ */
  [2,11,'bush'], [3,11,'bush'], [4,11,'tree-round'], [4,10,'tree-round'],   /* ปลายบ่อด้านเหนือฝั่งตะวันตก */
  [8,11,'bush'], [8,10,'bush'], [9,10,'bush'],                              /* ปลายบ่อด้านเหนือฝั่งตะวันออก */
  [9,12,'pine'], [10,13,'bush'], [11,15,'tree-round'], [11,11,'pine'],      /* ชายบ่อฝั่งตะวันออกไล่ลงมา */
  [66,26,'tree'],                              /* ต้นไม้ริมทางเดินเหนือโรงพยาบาล (ผู้ใช้เลือกช่องเอง) */
  [61,46,'tree-round'], [56,46,'tree'], [67,44,'tree'],
  [63,48,'bush'],                              /* 63,46-47 เปลี่ยนเป็นม้านั่งแล้ว (ดู BENCH_SPOTS) */
  [66,46,'bush'], [66,47,'bush'], [66,48,'bush'],
  /* แนวพุ่มไม้ริมขอบแผนที่ทิศตะวันออก ข้างสนามเด็กเล่น (z36 เป็นถนน จึงเริ่มที่ z37)
     — เว้น z44 ไว้ให้ต้นไม้ที่ปลูกไว้ก่อนแล้วยืนแทรกอยู่กลางแนว */
  [67,37,'bush'], [67,38,'bush'], [67,39,'bush'], [67,40,'bush'], [67,41,'bush'],
  [67,42,'bush'], [67,43,'bush'], [67,45,'bush'], [67,46,'bush'],
];
const WILD_MUSHROOMS = [[3,26],[10,24],[13,29],[23,19],[35,29],[6,35],[14,34],[51,19],[28,36],[47,36],[19,29],[52,27]]
                     .map(p=>[p[0]+NPAD, p[1]+EPAD_ALL]).concat(s2List([[4,24],[8,33],[2,45],[6,20],[10,55],[23,57],[17,56]]));

/* ---------- ทิศเหนือ: บ่อน้ำใหญ่ + คลองส่งน้ำเชื่อมเข้าคลองหลัก ----------
   บ่อเป็นวงรี (เช็คด้วยสมการวงรี ไม่ต้องลิสต์ทีละช่อง) อยู่มุมเหนือ-ตะวันออกของแผนที่
   คลองส่งน้ำวิ่งตามแกน x จากบ่อ → คลองหลัก ผ่านกลางโซนฟาร์ม มีสะพานไม้เล็กข้ามตรงทางเดินฟาร์ม */
/* วงรี — เว้นขอบแผนที่ทุกด้านไว้ 1 ช่องเป็นหญ้าเดินได้รอบบ่อ (ไม่ให้น้ำไหลตกขอบเกาะ) */
const POND = {cx:6, cz:s2z(7.4), rx:5, rz:6.7};
function isPondTile(x, z){
  const dx = (x - POND.cx) / POND.rx, dz = (z - POND.cz) / POND.rz;
  return dx*dx + dz*dz <= 1;
}
const CANAL_Z = [7,8].map(s2z);                          /* คลองส่งน้ำ กว้าง 2 ช่อง วิ่งตามแกน x */
const CANAL_X0 = 9, CANAL_X1 = RIVER_X[0] - 1;
const CANAL_BRIDGE_X = [19,20];                 /* สะพานเล็กข้ามคลองส่งน้ำ (ตรงแนวทางเดินฟาร์ม) */
function isCanalTile(x, z){ return CANAL_Z.indexOf(z)>=0 && x>=CANAL_X0 && x<=CANAL_X1; }
function isCanalBridgeTile(x, z){ return isCanalTile(x, z) && CANAL_BRIDGE_X.indexOf(x)>=0; }

/* ---------- ทิศตะวันออก: โซนฟาร์มของเพื่อนบ้าน (x 12-27 ในแถบใหม่ z 0-15) ----------
   แปลงผัก = ดินไถ (เดินได้) สลับกับ "ร่องต้นพืช" (บล็อก) ให้เด็กเดินตามร่องได้เหมือนฟาร์มจริง */
const FARM_PLOTS = [
  {x0:13, x1:17, z0:1,  z1:5,  crop:'corn'},
  {x0:22, x1:26, z0:4,  z1:6,  crop:'tomato'},
  {x0:13, x1:17, z0:10, z1:14, crop:'cabbage'},
].map(s2Rect);
/* ⚠ จบที่ **ก่อน** ขอบบริเวณบ้าน 1 ช่อง (z26) — ผูกกับ HOME_ZONE.z0 ไว้ ถ้าย่อ/ขยายกรอบบ้าน
   ทางเดินจะเลื่อนตามเอง ไม่ค้างโผล่เข้ามาในสนาม (ผู้ใช้แจ้ง 2026-08-09 ว่ามีช่องเกินที่ x19-20/z27) */
const FARM_TRAIL = {x0:19, x1:20, z0:0, z1:HOME_ZONE.z0 - 1};   /* ทางเดินดินจากบริเวณบ้าน → ฟาร์ม */
function farmPlotAt(x, z){
  for(let i=0;i<FARM_PLOTS.length;i++){ const p = FARM_PLOTS[i];
    if(x>=p.x0 && x<=p.x1 && z>=p.z0 && z<=p.z1) return p; }
  return null;
}
function isCropTile(x, z){ const p = farmPlotAt(x, z); return !!p && (z - p.z0) % 2 === 0; }

/* ---------- ขอบทิศตะวันออกเฉียงใต้: ชายหาด + ทะเล ----------
   ชายฝั่งวิ่งเฉียงจากปากคลอง (x=RIVER_X[0]) ลงไปมุมใต้-ตะวันออก ยิ่งใต้ทะเลยิ่งกว้าง
   seaEdgeZ = ช่อง z สุดท้ายที่เป็นทะเลของแถว x นั้น (-1 = แถวนี้ยังไม่ถึงทะเล) */
/* ลดขนาดทะเลลง (SEA_BASE_Z/SEA_MAX_Z เลื่อนเข้าหาขอบแผนที่) แล้วขยายหาดทรายให้กว้างขึ้น (BEACH_W 3→5)
   ผลพลอยได้ที่ตั้งใจ: หาดทรายไม่ชิดลานกิจกรรม (PLAZA2 z19) อีกต่อไป — เหลือหญ้าคั่น 2-5 ช่อง
   และแถว z10-13 ริมแม่น้ำกลายเป็นพื้นดินเดินได้ จึงย้ายสะพานฟาร์มขึ้นมาตรงบ้านชาวนาได้ */
const SEA_X0 = RIVER_X[0], SEA_SLOPE = .35, SEA_MAX_Z = s2z(8), SEA_BASE_Z = s2z(1) - 4, BEACH_W = 5;
function seaEdgeZ(x){
  return x < SEA_X0 ? -1 : Math.min(SEA_MAX_Z, SEA_BASE_Z + Math.round((x - SEA_X0) * SEA_SLOPE));
}
function isSeaTile(x, z){ return z <= seaEdgeZ(x); }
/* ⚠ **ทะเลใช้ "สันทราย" ไม่ใช่ท่าไม้** (ผู้ใช้สั่ง 2026-08-14) — ท่าไม้ในทะเลแสดงผลไม่ถูก
   (ยาว 5 ช่องแล้วเสาลอยอยู่กลางน้ำลึก ดูไม่เข้ากับหาด) ⇒ ทำเป็นแนวทรายยื่นลงทะเลแทน
   พื้นเป็นแบบเดียวกับหาดทราย เดินได้ปกติ · x51-52 คู่กัน · x31 เป็นสันเดี่ยว */
/* ⚠ **x51 ต้องยาวกว่า x52** — ไม่งั้นปลายสันของ x51 จะมี x52 เดินได้อยู่ข้างๆ
   ผิดกติกาที่ผู้ใช้สั่งว่า "จุดตกปลาต้องห่างจากขอบพื้นเดินได้" (เจอจากเทส 2026-08-14)
   ยาวต่างกัน 2 ช่อง ⇒ ปลายสันของ x51 มีน้ำล้อม 3 ด้าน เหลือทางเดินกลับด้านเดียว */
/* ⚠ **สันทรายในทะเลถูกลบทิ้งทั้งหมดแล้ว** (ผู้ใช้สั่ง 2026-08-14 — แก้ผิดมาหลายรอบ)
   ทะเลเหลือของเดียวคือ "พื้นไม้ปูบนน้ำ" ที่ x51-52 / z12-15 (ดู SEA_DECKS) */
const SEA_SPITS = [];
/* ช่วงที่ปูเป็น "พื้นไม้ของท่า" แทนทราย (ผู้ใช้กำหนดเอง: x51-52 / z12-15)
   ⚠ พื้นไม้เป็น **ตัวพื้นเอง** ไม่ใช่แผ่นวางทับพื้นอีกที (ดู buildDeckTile ใน house.js)
   ⚠ ทุกช่องในกรอบนี้ต้องเป็น "น้ำ" — ถ้าขยายกรอบไปโดนหาดทราย ช่องนั้นจะไม่ถูกปูไม้
     (isWaterDeckTile คัดออก) แล้วจะเห็นทรายโผล่กลางท่า */
const SEA_DECKS = [{x0:51, x1:52, z0:12, z1:15}];
function isSeaDeckTile(x, z){
  for(let i=0; i<SEA_DECKS.length; i++){
    const d = SEA_DECKS[i];
    if(x >= d.x0 && x <= d.x1 && z >= d.z0 && z <= d.z1) return true;
  }
  return false;
}
function isSeaSpitTile(x, z){
  for(let i=0; i<SEA_SPITS.length; i++){
    const p = SEA_SPITS[i];
    if(x !== p.x) continue;
    const z0 = seaEdgeZ(x) + 1;                 /* ช่องทรายสุดท้ายก่อนถึงน้ำ */
    if(z <= z0 && z > z0 - p.len) return true;
  }
  return false;
}
function isSandTile(x, z){
  if(RIVER_X.indexOf(x) >= 0) return false;              /* ปากคลองใหญ่ไหลลงทะเล ไม่มีทรายคั่น */
  /* สันทรายที่ยื่นลงทะเล = พื้นหาดเหมือนกัน (ผู้ใช้สั่ง 2026-08-14 ว่าพื้นตรงนั้นต้องเป็นแบบหาด) */
  if(isSeaSpitTile(x, z)) return true;
  if(isSeaDeckTile(x, z)) return false;                  /* ตรงนี้เป็นพื้นไม้ ไม่ใช่ทราย */
  const e = seaEdgeZ(x); return e >= 0 && z > e && z <= e + BEACH_W;
}
function isWetSandTile(x, z){ return z === seaEdgeZ(x) + 1; }
/* ต้นมะพร้าวริมหาด: [x, z ห่างจากขอบน้ำกี่ช่อง (1-BEACH_W)] — วาง z ตามแนวชายฝั่งอัตโนมัติ */
/* หาดกว้างขึ้นแล้ว → ต้นมะพร้าวย้ายไปแถวหลังสุด (ห่างขอบน้ำ 4-5 ช่อง) เป็นแนวคั่นหาดกับทุ่งหญ้า
   ปล่อยแถวหน้า (ห่าง 2-3 ช่อง) ให้ร่ม/เก้าอี้ผ้าใบ และแถวติดน้ำ (ห่าง 1) โล่งไว้ให้เด็กเดินเล่นริมคลื่น */
/* (เอาต้นมะพร้าว [43,4] / [51,4] / [61,4] ออกเมื่อ 2026-08-03 — 3 ต้นนั้นยืน "หน้า" ชั้นวางเรือ/ราวห่วงยาง
   พอดี (z มากกว่า = อยู่ใกล้กล้องกว่า) พุ่มใบเลยบังของที่เพิ่งวางจนมองไม่เห็น · ผู้ใช้อนุญาตให้เอาต้นออกได้) */
const PALM_SPOTS = [[63,5],[35,4],[41,5],[47,5],[57,5],[65,5],[49,5],[45,5],[59,5]];
/* เรือลอยในทะเล: [x, ห่างจากขอบน้ำเข้าไปในทะเลกี่ช่อง, ชนิด] — อยู่บนผิวน้ำ (บล็อกอยู่แล้ว) ไม่แตะกริดเดิน
   sail = เรือใบลำใหญ่ (ลอยไกลฝั่ง), row = เรือประมงลำเล็ก (ใกล้ฝั่ง) */
const BOAT_SPOTS = [[34,4,'sail'],[42,6,'row'],[50,8,'sail'],[60,11,'row'],[46,3,'row'],[37,2,'row'],[64,6,'sail'],
                    [54,9,'net']];                  /* net = เรือประมงกำลังจับปลา (อวน+ทุ่น) กลางทะเลหน้าบ้านชาวประมง */
/* (เรือประมงจอดเกยหาดที่ (38,16) เอาออกแล้วเมื่อ 2026-08-03 ตามคำขอผู้ใช้ — ตัวเรือถูกวางจมทราย
   ลงไป .06 พร้อมแผ่นฟองคลื่นสีขาวที่ตั้งใจไว้ใช้บนผิวน้ำ มองมุมไอโซแล้วเหลือแต่พายกับกราบเรือโผล่
   ดูเหมือนของพัง ⇒ ห้ามเอาเรือกลับมาวางบนทรายอีก ถ้าจะมีเรือต้องอยู่บนผิวน้ำ (ดู BOAT_SPOTS)) */
/* ---------- ที่เก็บอุปกรณ์ริมหาด: ชั้นวางเรือแคนู / ราวแขวนห่วงยาง ----------
   [x, ห่างจากขอบน้ำกี่ช่อง, ชนิด] — คิด z จากแนวชายฝั่งจริงเหมือนต้นมะพร้าว/ร่ม (ดู beachPropTiles)
   วางคุมหาดครบ 4 ส่วน ไล่จากทิศเหนือ (x น้อย ติดสะพาน) ลงใต้: เรือ → ห่วง → ห่วง → เรือ
   ทุกจุดเลี่ยงช่องของต้นมะพร้าว/ร่ม/เก้าอี้ผ้าใบที่มีอยู่ก่อนแล้ว (ไม่ต้องรื้อของเดิมออกสักชิ้น) */
const BEACH_RACKS = [
  [36, 5, 'canoe'],   /* ส่วนที่ 1 — หาดเหนือ (ช่องจริง 36,15 ตามที่ผู้ใช้เลือก) */
  [43, 3, 'ring'],    /* ส่วนที่ 2 (ช่องจริง 43,15) */
  [51, 3, 'ring'],    /* ส่วนที่ 3 (ช่องจริง 51,18) */
  [66, 4, 'canoe'],   /* ส่วนที่ 4 — หาดใต้สุด (ช่องจริง 66,22 ตามที่ผู้ใช้เลือก) */
];
/* ราวตากปลาหน้าบ้านชาวประมง: [x, z, rot] — บล็อกช่องตัวเอง อยู่ระหว่างตัวบ้านกับชายหาด */
const FISH_RACKS = [[54,21,0],[54,23,0]];

/* ---------- เฟส 7: ฟาร์มเลี้ยงสัตว์ทิศตะวันออก (แถบใหม่ z 0-9 — พิกัดใหม่ เขียนตรงๆ) ----------
   คอกสัตว์ = รั้วไม้ล้อมรอบ (บล็อกทางเดิน) เว้น "ประตูคอก" 1 ช่องให้เด็กเดินเข้าไปดูสัตว์ใกล้ๆ ได้
   บางคอกพื้นเป็นดิน (soil:true) ให้ดูต่างจากทุ่งหญ้า */
const ANIMAL_PENS = [
  {id:'pen-cow',   x0:2,  x1:9,  z0:0, z1:3, soil:false, gate:[[9,2]]},
  {id:'pen-sheep', x0:5,  x1:11, z0:5, z1:9, soil:false, gate:[[11,7]]},
  /* คอกหมู: ขยายให้ใหญ่ขึ้นและเลื่อนขอบตะวันตกมาชิดทางเดินฟาร์ม (x19-20) ประตูจึงเปิดออกที่ทางเดินพอดี */
  {id:'pen-pig',   x0:21, x1:27, z0:0, z1:5, soil:true,  gate:[[21,2],[21,3]]},   /* x28-29 เป็นแม่น้ำ ขยายเกินนี้ไม่ได้ */
  /* คอกสัตว์เลี้ยงข้างร้านสัตว์ (ฝั่งตะวันตกของตัวร้าน) — คอกโล่ง **ไม่มีหลังคา** พื้นปูกระเบื้องพาสเทล
     รั้วเป็นรั้วเมือง (style 'pet') คนละแบบกับรั้วไม้ฟาร์ม · ประตูกว้าง 2 ช่องหันออกหน้าร้าน
     ข้างในมีสัตว์เลี้ยงที่เด็กเลี้ยงได้เดินเล่นจริง (ดู SHOP_PETS) */
  {id:'pen-petshop', style:'pet', x0:40, x1:45, z0:29, z1:33, soil:false, gate:[[42,33],[43,33]]},
  {id:'pen-chick', x0:21, x1:26, z0:5, z1:8, soil:true,  gate:[[21,6]]},
];
function penAt(x, z){
  for(let i=0;i<ANIMAL_PENS.length;i++){ const p = ANIMAL_PENS[i];
    if(x>=p.x0 && x<=p.x1 && z>=p.z0 && z<=p.z1) return p; }
  return null;
}
function isPenFenceTile(x, z){
  const p = penAt(x, z); if(!p) return false;
  const edge = (x===p.x0 || x===p.x1 || z===p.z0 || z===p.z1);
  return edge && !p.gate.some(gt => gt[0]===x && gt[1]===z);
}
function isPenSoilTile(x, z){ const p = penAt(x, z); return !!p && !!p.soil; }
/* สัตว์ในฟาร์ม: [x, z, ชนิด] — บล็อกช่องตัวเอง (เดินชนตัวสัตว์ไม่ได้) */
const FARM_ANIMALS = [
  [4,1,'cow'],  [6,1,'cow'],  [8,1,'cow'],
  [7,6,'sheep'],[9,6,'sheep'],[8,8,'sheep'],
  [24,1,'pig'], [24,3,'pig'],
  [22,7,'chick'],[24,7,'chick'],
];
/* ของในฟาร์ม: [x, z, ชนิด] — hay ฟ่อนฟาง, trough รางน้ำ, coop เล้าไก่, windmill กังหันลมสูบน้ำ */
const FARM_PROPS = [
  [3,1,'hay'],  [13,9,'hay'], [17,7,'hay'],
  [23,1,'trough'], [23,7,'trough'],
  [25,7,'coop'],
  [11,2,'windmill'],
];
/* ---------- กระถางต้นไม้ตั้งพื้น (ของฉากตายตัว บล็อกช่องตัวเอง เดินอ้อมได้) ----------
   [x, z] — ใช้ตกแต่งซอกข้างร้าน/ริมทางที่ต้นไม้ป่างอกไม่ได้ (ติดขอบล็อตอาคาร)
   หน้าตา = กระถางดินเผา + พุ่มใบ + ดอกไม้แซม (ดู buildPotPlant ใน js/house.js) สีสุ่มคงที่จากพิกัดช่อง */
const POT_SPOTS = [
  [26,47],   /* ข้างร้านต้นไม้ ฝั่งเดียวกับซุ้มดอกไม้ที่ย้ายมาไว้ด้านข้าง (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้) */
];
/* ---------- คอกสัตว์ข้างร้านสัตว์เลี้ยง (pen-petshop) ----------
   SHOP_PETS = สัตว์เลี้ยงที่เด็ก "เลือกเลี้ยงได้จริง" (ชนิดเดียวกับ PET_TYPES ใน js/house.js)
   มายืน/เดินเล่นรอลูกค้าอยู่ในคอก: [x, z, ชนิด, index สีขน] — เดินไปมาในคอกเหมือนสัตว์ฟาร์ม
   PET_PEN_PROPS = ของในคอก (บล็อกช่องตัวเอง + สัตว์ไม่เดินทับ): kennel บ้านหมา, bowls ชามน้ำ/อาหาร, toys ตะกร้าของเล่น */
const SHOP_PETS = [
  [42,30,'dog',0], [44,30,'cat',0], [41,31,'rabbit',0],
  [43,31,'hamster',0], [44,31,'turtle',0], [42,32,'chick',0],
];
const PET_PEN_PROPS = [[41,30,'kennel'], [44,32,'bowls'], [41,32,'toys']];
/* ป้ายเมนูสามเหลี่ยมตั้งพื้นหน้าลานร้านอาหาร (บล็อกช่องตัวเอง — เดินทะลุไม่ได้) */
const FOOD_SIGN = {x:36, z:43, rot:-.5};
/* เป็ดลอยน้ำในบ่อ (ช่องผิวน้ำ ไม่ต้องบล็อกเพิ่ม น้ำบล็อกอยู่แล้ว) */
const POND_DUCKS = [[4,16],[5,14]];
/* กระท่อมริมบ่อ (ล็อต pond-hut) + ท่าไม้ยื่นลงบ่อ + NPC นั่งตกปลาที่ปลายท่า
   ท่า/คนตกปลาอยู่บนผิวน้ำทั้งหมด จึงไม่แตะกริดเดิน (น้ำบล็อกอยู่แล้ว) */
/* ท่า+คนตกปลาอยู่ชายบ่อด้านตะวันออก ฝั่งบ้านเด็ก (กระท่อมย้ายไปมุมเหนือสุดแล้ว คนละมุมบ่อ ไม่บังกัน)
   ท่ายื่นไปทางทิศเหนือ (-x) จึงหมุน 180° (rot 2) */
const POND_PIER = {x:11, z:19, len:3, rot:2};
/* ท่าไม้เพิ่มเติม (ผู้ใช้สั่ง 2026-08-13) — ท่าเดิมมีลุงตกปลานั่งอยู่ปลายท่า เด็กจึงไม่มีที่ยืนตก
   ⇒ เพิ่มท่าข้างลุงที่ z20 (จุดตกปลาของเด็กอยู่ข้างๆ ลุงพอดี) + ท่าคู่ที่ z15-16 อีกจุด
   ⚠ rot 2 = ยื่นไปทาง −x ⇒ ท่า x=11 len=3 กินช่อง x9-11 (FISHER_TILE.x = 9 คือปลายท่าพอดี) */
const POND_PIERS = [
  {x:11, z:19, len:3, rot:2},      /* ท่าเดิม — ลุงตกปลานั่งปลายท่า */
  {x:11, z:20, len:3, rot:2},      /* ท่าข้างลุง */
  {x:11, z:15, len:3, rot:2},      /* ท่าเหนือ (คู่ z15-16) */
  {x:11, z:16, len:3, rot:2},
];
/* ช่องที่เป็น "พื้นไม้ของท่า" — เดินได้ และผิวบนสูงกว่าพื้นดิน (ดู groundY ใน house.js) */
function seaPierZ0(x){ return seaEdgeZ(x) + 1; }
/* พื้นไม้ของท่า — **เฉพาะท่าในบ่อน้ำ** (สันทรายในทะเลเป็นพื้นหาด ไม่ใช่ไม้) */
function isPierTile(x, z){
  for(let i=0; i<POND_PIERS.length; i++){
    const p = POND_PIERS[i];
    if(z === p.z && x <= p.x && x > p.x - p.len) return true;
  }
  return false;
}
/* ⚠⚠ **ช่องที่เป็น "แผ่นไม้ปูบนน้ำ" จริงๆ — ต้องมีน้ำอยู่ข้างใต้เท่านั้น** (ผู้ใช้สั่ง 2026-08-14
   หลังแก้ผิดมาหลายรอบ) ใช้ 2 ที่ใน `js/house.js` และ **ต้องเป็นตัวเดียวกันเป๊ะทั้งคู่**:
     ① ตัววาดพื้น — ช่องพวกนี้ **ห้ามปูบล็อกหญ้า/ทราย** ไม่งั้นได้ "แผ่นไม้วางบนสนามหญ้า"
        (นี่คือต้นเหตุจริงของบั๊กที่แก้ไม่หายสักที: ตัววาดพื้นเดิมข้ามแค่ช่องน้ำ `=== 1`
         แต่ช่องท่าเป็นค่า 2 กับ 0 ⇒ ได้บล็อกหญ้าโผล่ขึ้นมากลางบ่อ/กลางทะเลทุกครั้ง)
     ② ตัววาดแผ่นไม้ — ปูทีละช่องตามลิสต์นี้ **ห้ามคำนวณความยาวแล้วหมุนเอา**
   ⇒ แผ่นไม้กับช่องเดินได้เป็นชุดเดียวกันเสมอ เหลื่อมกันไม่ได้อีก
   ช่องริมฝั่งที่เป็นดิน (เช่น x11 ของท่าในบ่อ) จะไม่เข้าเงื่อนไข = ยังเป็นหญ้าปกติ
   ท่าจึงดู "เริ่มต้นที่ริมน้ำ" อย่างที่ควรเป็น */
function isWaterDeckTile(x, z){
  if(!isPierTile(x, z) && !isSeaDeckTile(x, z)) return false;
  return isPondTile(x, z) || isSeaTile(x, z) || isCanalTile(x, z) || RIVER_X.indexOf(x) >= 0;
}
/* จุดตกปลาบนท่า — **ปลายท่า** เพื่อให้ยืนอยู่เหนือผิวน้ำจริง (เด็กจะได้รู้สึกว่ากำลังตกปลา)
   ⚠ ท่าเดิม z19 ไม่มีจุด เพราะลุงนั่งอยู่ตรงนั้นแล้ว */
/* ⚠ **จุดตกปลาต้องอยู่ "ในน้ำ" ไม่ใช่ช่องที่เด็กยืน** (ผู้ใช้แจ้ง 2026-08-14 ว่าทุ่นทับตัวเด็ก)
   `stand` = ปลายท่าไม้/ริมฝั่งที่เด็กไปยืน · `water` = ช่องน้ำที่ทุ่นกับวงคลื่นอยู่ */
/* 🔒 **กติกาที่ผู้ใช้ล็อกไว้ 2026-08-14 — ห้ามเปลี่ยนเอง: "จุดตกปลาห่างจากฝั่ง 1 ช่อง"**
   คือระหว่างช่องที่เด็กยืน (`stand` = ปลายท่า/ริมฝั่ง) กับช่องที่ทุ่นลอย (`water`)
   ต้องมี **ช่องน้ำคั่นกลางพอดี 1 ช่อง** ⇒ ระยะรวม = 2 ช่องเสมอ
   (เคยแก้ให้ติดกันแล้วผู้ใช้สั่งย้ายกลับ — ทุ่นชิดตัวเกินไปดูเหมือนยืนจุ่มเท้าอยู่ริมน้ำ) */
const POND_FISH_SPOTS = [
  {stand:{x:9, z:20}, water:{x:7, z:20}, name:'ท่าน้ำข้างลุงตกปลา'},
  {stand:{x:9, z:15}, water:{x:7, z:15}, name:'ท่าน้ำเหนือบ่อ'},
];
/* ---------- จุดตกปลาในทะเล ----------
   ⚠ **พิกัดผู้ใช้กำหนดเองทั้งหมด 2026-08-14 ห้ามคำนวณเอง**
   จุดที่ 1 = ปลายท่าน้ำไม้ที่ยื่นลงทะเล (พื้นไม้ x51-52/z12-15 ⇒ ปลายสุดคือ z12 ทุ่นที่ z11)
   จุดที่ 2 = หาดธรรมชาติที่ x31 (ไม่มีสันทราย/ท่าไม้แล้ว — ยืนบนหาดตกลงทะเลตรงๆ) */
/* 🔒 กติกาเดียวกับ POND_FISH_SPOTS: **ทุ่นห่างจากช่องที่ยืน 2 ช่อง (คั่นด้วยน้ำ 1 ช่อง)**
   ปลายพื้นไม้ทะเลคือ z12 ⇒ ทุ่นอยู่ z10 · ริมหาด x31 ยืน z9 ⇒ ทุ่นอยู่ z7
   ⚠ ธง `sea` ที่ใส่ไว้ที่นี่เป็นแค่คำอธิบาย — ตัวที่ตัดสินว่าได้ปลาน้ำจืดหรือปลาทะเลจริงๆ คือ
     `pondFishSpots()` ใน `js/house.js` ที่คิดจาก `isSeaTile()` ของช่องน้ำจริงในกริด */
function seaFishSpots(){
  return [
    {stand:{x:51, z:12}, water:{x:51, z:10}, sea:true, name:'ปลายท่าน้ำทะเล'},
    {stand:{x:31, z:9},  water:{x:31, z:7},  sea:true, name:'ริมหาด'},
  ];
}
const FISHER_TILE = {x:9, z:19, rot:2};    /* ปลายท่า นั่งหันหน้าเข้าบ่อ (ทิศเหนือ) */

/* ---------- ลานกิจกรรมใหญ่ริมแม่น้ำ (ระหว่างสุดถนนชุมชนกับหาดทราย/ทะเล) ----------
   พื้นหินอ่อนแบบเดียวกับลานกลางชุมชน มีเวทีใหญ่ + ม้านั่งเป็นแถวหน้าเวที + ธงราว + รถเข็นขายของ
   ผังลาน: ทิศเหนือ (x30) ติดแม่น้ำ, ทิศตะวันออก (z19) มองออกไปเห็นหาดทราย,
           ทิศตะวันตก (z28) ต่อกับถนนแยกของชุมชน (x37-38 z29 ขึ้นไป) */
const PLAZA2 = {x0:30, x1:40, z0:19, z1:28};   /* 11 × 10 ช่อง (เดิม 8 × 4) */
/* ระหว่างลานกิจกรรมกับหาดทรายปล่อยเป็นทุ่งหญ้าโล่ง ไม่มีทางเดินคั่น (เอาออกตามคำขอผู้ใช้ — ห้ามใส่กลับโดยไม่ถาม) */
const STAGE  = {x0:31, x1:33, z0:22, z1:25};   /* เวที (บล็อกทางเดิน) */
const BANNER_POLES = [[30,19],[40,19],[30,28],[40,28],[35,19],[35,28]];   /* เสาธงราวรอบลาน (บล็อก) */
/* ม้านั่งในชุมชน: [x, z, rot] — บล็อกช่องตัวเอง */
const BENCH_SPOTS = [
  [39,31,3],                                     /* ริมถนนใหญ่ชุมชนแรก (ฝั่งเหนือ) */
  [55,26,3],                                     /* ริมถนนใหญ่ชุมชนแรก (ฝั่งใต้) — ตัว 55,39 / 55,54 เอาออกแล้ว */
  [63,46,1],[63,47,1],                           /* ริมถนนแยกข้างสนามเด็กเล่น หันหน้าเข้าถนน (+x) */
  /* ลานน้ำพุกลางชุมชน: ม้านั่งในลาน "หันหน้าเข้าน้ำพุ" ทุกตัว (น้ำพุอยู่ x45-46 z43-44) */
  [42,41,1],[42,42,1],[42,46,1],[42,47,1],       /* ขอบลานฝั่ง x น้อย หันไป +x */
  [49,41,3],[49,42,3],[49,46,3],[49,47,3],       /* ขอบลานฝั่ง x มาก หันไป -x */
  [43,40,0],[44,40,0],[47,40,0],[48,40,0],       /* ขอบลานแถวบน หันไป +z */
  [42,51,0],[43,51,0],[48,51,0],[49,51,0],       /* ริมถนนใต้ลาน (z52-53) หันหน้าเข้าถนน */
  /* (เดิมมีม้านั่ง 24,56 / 27,56 ตรงนี้ — อยู่ในเขตโรงเรียน x22-27 z54-62 เอาออกแล้ว) */
  [4,65,2],[12,65,2],[22,65,2],                  /* สวนท้ายชุมชนที่ 2 */
  /* (เดิมมีม้านั่ง 11,56 / 16,56 บนทางเดินในตลาด — เอาออกแล้วเมื่อ 2026-08-03 ตามคำขอผู้ใช้
     "เอาม้านั่งในตลาดออก" ⇒ ห้ามวางม้านั่งในกรอบ MARKET x8-19 / z56-62 อีก) */
  [36,21,3],[36,24,3],[36,27,3],                 /* ลานกิจกรรม: แถวหน้าเวที (หันเข้าเวที = -x) */
  [38,21,3],[38,24,3],[38,27,3],                 /* ลานกิจกรรม: แถวหลัง */
  [31,20,2],                                     /* ลานกิจกรรม: ริมลานฝั่งหาดทราย (หันออกทะเล = -z)
                                                    (34,20 กับ 39,20 เอาออกแล้ว 2026-08-09 ตามคำขอผู้ใช้) */
  [30,24,3],                                     /* ลานกิจกรรม: ริมแม่น้ำ (หันเข้าแม่น้ำ = -x) — ไม่ปิดช่องแคบข้างเวที */
  [30,27,1],                                     /* ⚠ กลับหน้าเป็น rot 1 (+x = หันเข้าลาน) เมื่อ 2026-08-09 ตามคำขอผู้ใช้
                                                    — เดิม rot 3 หันออกแม่น้ำเหมือนตัว 30,24 */
];
/* ---------- ตลาดรถเข็นหน้าโรงเรียน (ชุมชนที่ 2) ----------
   เดิมแถบนี้เป็นบ้าน/ร้าน 4 หลัง รื้อออกหมดแล้ว (w-home-4 ม่วง + w-home-5 แดง แถวล่าง,
   w-home-2 ชมพู + w-shop-milk ฟ้า แถวบน) กลายเป็นย่านตลาดผืนเดียว x8-19 / z56-62
   ถนนใหญ่ z57-58 พาดผ่านในกรอบนี้พอดี — ไม่ได้แบ่งตลาดเป็น 2 ลานอีกแล้ว แต่กลายเป็น
   "ทางเดินกลางตลาด" เส้นหนึ่งไปเลย เพราะพื้นตลาดทั้งผืนปูเป็นพื้นถนนแบบเดียวกับถนนรอบๆ
   (คำขอผู้ใช้ 2026-08-03 — เดิมปูอิฐโทนส้มแยกโซน เอาออกแล้ว ห้ามใส่กลับโดยไม่ถาม)
   ขนาบด้วยถนนครบทุกด้าน (z53-55 เป็นแนวหญ้า/เสาไฟหน้าตึกแล็บ, ถนนล่างหน้าโรงเรียน z63-64,
   ถนนแยก x6-7 และ x20-21) ฝั่งตะวันออกข้ามถนน x20-21 ไปคือรั้วโรงเรียน เด็กนักเรียนจึงเดินมาซื้อของได้
     - **เว้นระยะรถเข็นในแถวเดียวกันห่างกัน 3 ช่องเสมอ** (คันหนึ่งกว้าง ~1.2 + กันสาดยื่น) เคยวางห่าง
       2 ช่องแล้ว มองมุมไอโซเห็นเป็นกำแพงกันสาดติดกันยาวเป็นพืด แยกไม่ออกว่ามีกี่ร้าน
     - **ไม่มีม้านั่งในกรอบตลาด** (คำขอผู้ใช้ 2026-08-03 — เดิมมี 11,56 / 16,56 เอาออกแล้ว) ให้ลานโล่งเดินสบาย
     - **ไม่มีเสาไฟในกรอบตลาด** (คำขอผู้ใช้ 2026-08-03 — เดิมมีต้นหนึ่งที่ 19,62 เอาออกแล้ว ดู LAMP_SPOTS)
       ตลาดอาศัยเสาไฟที่ล้อมอยู่นอกกรอบแทน (18,53 / 13,65 / 5,62 / 4,53)
   แม่ค้ายืน "ข้างรถเข็นของตัวเอง" ทุกคน (ดู NPC_DEFS กลุ่ม npc-mk-* — ติดธง stand:true ยืนนิ่งไม่เดิน) */
const MARKET = {x0:8, x1:19, z0:56, z1:62};
function inMarket(x, z){ return inBox(MARKET, x, z); }
const MARKET_SIGNS = [{x:8, z:62}, {x:8, z:56}];   /* ป้ายตลาด 2 จุด: มุมใต้ + มุมเหนือ (ทางเข้าฝั่งถนนแยก x6-7 ทั้งคู่)
                                                     ย่านตลาดยาว 7 ช่อง ป้ายเดียวที่มุมใต้สุดมองไม่เห็นจากฝั่งเหนือ */
/* เสาธงราว: [x, z, span] — span>0 = เสาต้นซ้ายที่ถือเชือกธงยาว span ช่องไปหาเสาต้นขวา (span 0 = เสาเปล่ารับปลาย)
   ตั้งไว้ "แถวเดียวกับรถเข็น" ไม่ใช่กลางทางเดิน — กล้องไอโซมองจาก +z ถ้าขึงกลางลาน
   เชือกจะพาดตัดหน้ารถเข็นกับตัวคนบนจอ
   ขึงครบทั้ง 3 แถว (z56/z59/z62) ให้เหมือนกันหมด (คำขอผู้ใช้ 2026-08-03 "ใส่ธงเหมือนแถวอื่น")
   — เสาต้นขวาของแถวหน้าสุดตั้งที่ (19,62) ได้แล้วเพราะเสาไฟที่เคยยืนช่องนั้นถูกเอาออกไป */
/* ⚠ เสาต้นขวาของทั้ง 3 แถวขยับเข้ามา 1 ช่อง (x19 → x18) เมื่อ 2026-08-09 ตามคำขอผู้ใช้
   ⇒ span ของเสาต้นซ้ายลดจาก 10 เหลือ 9 ตามไปด้วยทุกแถว (ไม่งั้นเชือกธงจะยาวเลยเสาต้นขวาไป 1 ช่อง) */
const MARKET_BUNTING = [[9,56,9],[18,56,0], [9,59,9],[18,59,0], [9,62,9],[18,62,0]];
/* รถเข็นขายของ: [x, z, rot, ชนิด] — fruit ผลไม้, ice ไอศกรีม, noodle ก๋วยเตี๋ยว, balloon ลูกโป่ง
   + ชนิดของตลาดหน้าโรงเรียน: meatball ลูกชิ้นปิ้ง, sausage ไส้กรอก, tokyo ขนมโตเกียว, snack ขนมขบเคี้ยว,
     smoothie น้ำปั่น, popcorn ป๊อปคอร์น, cotton สายไหม, toy ของเล่น, milk นมเย็น, shave น้ำแข็งไส
     (ดู buildCart ใน house.js) */
const CART_SPOTS = [
  [39,29,3,'fruit'], [39,34,3,'noodle'],
  /* (รถเข็นไอติม 55,37 เอาออกแล้ว — พื้นที่กลายเป็นสนามเด็กเล่น) */
  /* รถเข็นลูกโป่ง: (18,47) → (23,51) เมื่อ 2026-08-03 → **กลางลานทางเดินใหม่หน้าร้านของเล่น (8,48)
     เมื่อ 2026-08-09 ตามคำขอผู้ใช้** (ที่เดิมกลายเป็นล็อตร้านต้นไม้ไปแล้ว)
     หันหน้า +z เข้าหากล้องเหมือนรถเข็นในตลาด · โบโซ่ (npc-clown) เดินขายลูกโป่งอยู่แถวนี้ */
  [8,48,0,'balloon'],
  /* รถเข็น 2 คันริมทุ่งเหนือลานร้านของเล่น (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้) — หันหน้า +z เข้าหากล้อง
     ชนิด popcorn/snack ว่างอยู่พอดี (ถูกตัดออกจากตลาดหน้าโรงเรียนตอนลดเหลือ 3 คัน/แถว) */
  [14,43,0,'popcorn'], [17,43,0,'snack'],
  /* รถเข็นนักมายากล (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้) — ตั้งกลางลานหน้าร้านของเล่นเหมือนรถเข็นลูกโป่งของโบโซ่
     คนละมุมลานกัน (โบโซ่ 8,48 · มายากล 8,51) พี่มายากล (npc-magician) ยืนข้างรถคันนี้ */
  [8,51,0,'magic'],
  [34,27,0,'fruit'], [40,25,3,'ice'], [32,20,2,'balloon'],   /* ในลานกิจกรรม (เลี่ยงแนวถนน x37-38) */
  /* --- ตลาดหน้าโรงเรียน: 3 แถว แถวละ 4 คัน (12 คัน) หันหน้า +z เข้าหากล้องทุกแถว ---
     ⚠ **ลดจาก 4 คัน/แถว เหลือ 3 คัน/แถว (12 → 9 คัน) เมื่อ 2026-08-09 ตามคำขอผู้ใช้ เพราะเฟรมเรตตกที่ตลาด**
       ต้นเหตุคือ NPC 1 คน = ~27 draw call (merge ไม่ได้เพราะมีข้อต่อขยับ) แม่ค้ายืนติดกัน 12 คนในเฟรมเดียว
       ⇒ ตัดคันขวาสุดของทุกแถวออก พร้อมแม่ค้าประจำคัน (npc-mk-popcorn / snack / ice)
       **ห้ามเพิ่มกลับเป็น 4 คัน/แถวโดยไม่ถามผู้ใช้ก่อน**
     คอลัมน์ x = 10,13,16 → ห่างกัน 3 ช่องเท่ากันทุกคู่ เว้นจากขอบลานตลาด (x8 / x19) 2 กับ 3 ช่อง
     แถว z = 56 / 59 / 62 → ช่องไฟระหว่างแถว 2 ช่องเท่ากันทุกคู่ (z57-58 = ถนนใหญ่ที่พาดผ่านพอดี
       กลายเป็นทางเดินกลางตลาดไปในตัว · z60-61 = ทางเดินคั่นแถวกลางกับแถวหน้า)
     แถวแรก/แถวสุดท้ายชิดขอบกรอบตลาดพอดี (z56 = z0, z62 = z1) เพราะกรอบตลาดถูกย่อลงมาให้พอดี
     กับ 3 แถว + ช่องไฟ 2 ช่อง (คำขอผู้ใช้ 2026-08-03) */
  [10,56,0,'milk'],     [13,56,0,'fruit'],    [16,56,0,'shave'],
  [10,59,0,'meatball'], [13,59,0,'sausage'],  [16,59,0,'tokyo'],
  [10,62,0,'toy'],      [13,62,0,'cotton'],   [16,62,0,'smoothie'],
];

/* ---------- เขตโรงเรียน (ชุมชนที่ 2) ----------
   ล้อมรั้วรอบ box x22-27 / z54-62 (ตัวอาคารอยู่แถว z55-58 หน้าโรงเรียน z59-62 เป็นลานปูหิน)
   เว้น "ประตูโรงเรียน" 2 ช่องหน้าอาคาร (ตรงกับถนนล่าง z63) ให้เด็กเดินเข้าไปได้ มีซุ้มประตูคร่อมไว้
   เสาธงอยู่กลางลานหน้าอาคาร (บล็อกช่องตัวเอง) ครูเดินไปมาอยู่ในรั้วนี้ */
const SCHOOL_BOX  = {x0:22, x1:27, z0:54, z1:62};
const SCHOOL_LOT  = {x0:23, x1:26, z0:55, z1:58};   /* ช่องที่ตัวอาคารทับ (ตรงกับล็อต id:'school') */
const SCHOOL_GATE = [[25,62],[26,62]];              /* ประตูรั้ว (เดินผ่านได้) */
const SCHOOL_FLAG = {x:24, z:61};                   /* เสาธงกลางลานหน้าโรงเรียน */
function inSchoolYard(x, z){                        /* ในรั้วโรงเรียนแต่ไม่ใช่ตัวอาคาร = ลาน */
  return inBox(SCHOOL_BOX, x, z) && !inBox(SCHOOL_LOT, x, z);
}
function isSchoolFenceTile(x, z){
  if(!inBox(SCHOOL_BOX, x, z)) return false;
  const edge = (x===SCHOOL_BOX.x0 || x===SCHOOL_BOX.x1 || z===SCHOOL_BOX.z0 || z===SCHOOL_BOX.z1);
  return edge && !SCHOOL_GATE.some(gt => gt[0]===x && gt[1]===z);
}

/* ---------- ลานช่างไม้ (ป่าทิศเหนือ เหนือบ้านเด็ก) ----------
   ของในลานรอบกระท่อมช่างไม้: [x, z, ชนิด] บล็อกช่องตัวเองเหมือนม้านั่ง/รถเข็น (เด็กเดินอ้อมได้)
   เว้นช่องหน้าประตู (6,32) กับกลางลานไว้ ให้เดินเข้าไปคุยกับลุงช่างไม้ได้สบาย
   ลานไม้ (CARPENTER_YARD) เป็นพื้นตกแต่งเฉยๆ ไม่บล็อกทางเดิน */
/* ⚠ พิกัดชุดนี้เลื่อนตามล็อตกระท่อมเสมอ — สุทธิ -3 จากของเดิม (กระท่อม z36-38 → z32-34) */
const CARPENTER_PROPS = [
  [5,32,'sawhorse'], [5,34,'planks'],  [5,37,'stump'],
  [0,36,'chop'],     [6,36,'logs'],    [0,38,'logs'],
];
/* พื้นไม้หน้ากระท่อม (ตกแต่ง ไม่บล็อก) — ร้านต้นไม้ย้ายออกไปหน้าโรงเรียนแล้ว ลานจึงกลับมากว้าง 2 แถวได้ */
const CARPENTER_YARD = {x0:1, x1:4, z0:35, z1:36};
/* ---------- ลานตั้งแคมป์กลางป่าทิศเหนือ (เหนือบ้านเด็กขึ้นไป) ----------
   กรอบ CAMP = ลานโล่งกลางป่า **ห้ามของฉากสุ่ม (ต้นไม้/พุ่ม/เห็ด) งอกในกรอบนี้** (ดู wildPlantable)
   ต้นไม้รอบนอกกรอบยังแน่นเหมือนเดิม ลานจึงดูเป็น "ที่โล่งกลางป่า" ที่คนมากางเต็นท์จริงๆ
   ผัง (แคมป์เล็ก 2 เต็นท์ริมบ่อน้ำ — ถอยห่างกระท่อมกับชายน้ำเมื่อ 2026-08-04 ตามคำขอผู้ใช้):
        **เต็นท์ 2 หลังเท่านั้น** (ห้ามเพิ่มเป็น 3 หลังกลับโดยไม่ถาม) วาง **เว้นจากผิวน้ำ 2 ช่องพอดี**
        ทั้งคู่ — ชายบ่อเป็นเส้นโค้ง (น้ำถึง z24 ที่ x6 แต่ถึงแค่ z22 ที่ x9) เต็นท์จึงเยื้องกันตามแนวโค้ง
        ของชายน้ำ ไม่ได้เรียงตรงแถวเดียวกัน **ห้ามดันกลับไปเรียงแถวเดียวกัน** เพราะหลังหนึ่งจะไปติดน้ำทันที
        และเว้นจากกระท่อมไม้ริมบ่อ (ล็อต x0-3 / z24-26) ไว้ 2 ช่อง (x4-5 โล่ง)
        **เต็นท์เป็นทรงจั่วขนาด 2 คนนอน กินที่หลังละ 1 ช่อง** สันทอดตามแกน z
        ⇒ ประตูอยู่ที่ "หน้าจั่ว" ด้าน +z (ไม่ใช่ด้านลาดหลังคา) หันหลังให้บ่อน้ำ หันหน้าเข้าหากองไฟ
        กองไฟอยู่หน้าเต็นท์ (z มากกว่า = ใกล้กล้องกว่า) จึงไม่ถูกเต็นท์บัง มีท่อนไม้นั่ง **2 ที่** ขนาบ
        ⚠ กรอบ CAMP ย่อ/ขยับตามของที่วางจริงทุกครั้ง — ถ้ากรอบใหญ่เกิน ป่ารอบแคมป์จะโหว่เป็นทุ่งหญ้าโล่ง
          ใหญ่ผิดที่ (กรอบนี้ห้ามต้นไม้สุ่มงอก) แต่ต้องคลุมแถบระหว่างเต็นท์กับน้ำไว้ด้วย ไม่งั้นต้นไม้ป่า
          จะงอกแทรกตรงช่องว่าง 2 ช่องนั้นแล้วบังวิวบ่อน้ำ */
const CAMP = {x0:4, x1:10, z0:24, z1:31};
const CAMP_TENTS = [   /* [x, z, สี] — เต็นท์ 2 คนนอน กินช่องละ 1 ช่อง · สี = index ใน TENT_COLORS */
  [6, 27, 0],          /* น้ำถึง z24 ตรงคอลัมน์นี้ → เว้น z25-26 = 2 ช่อง */
  [9, 25, 1],          /* น้ำถึงแค่ z22 ตรงคอลัมน์นี้ → เว้น z23-24 = 2 ช่อง */
];
const CAMP_FIRE = {x:9, z:28};
/* ⚠ เอาของออก 4 ชิ้นเมื่อ 2026-08-09 ตามคำขอผู้ใช้ — **ห้ามใส่กลับโดยไม่ถามก่อน**
   ท่อนไม้นั่ง 2 ที่ (8,29 / 10,29 'log') · กองฟืน (10,27 'wood') · เสาแขวนตะเกียง (10,30 'lantern')
   เหลือแค่เป้+ลังเสบียงชิ้นเดียว ลานแคมป์จึงโล่งขึ้นมาก (โค้ดวาด buildCampProp ของชนิดที่เอาออกยังอยู่ครบ) */
const CAMP_PROPS = [   /* [x, z, ชนิด] — บล็อกช่องตัวเองทุกชิ้น (เดินอ้อมได้) */
  [7,28,'gear'],      /* เป้+ลังเสบียง วางระหว่างเต็นท์แดงกับกองไฟ (ของใช้อยู่กลางแคมป์ ไม่ใช่กองทิ้งไกลๆ) */
];
/* กรอบเดินเล่นของลุงช่างไม้กับป้ามะลิ = ล็อตกระท่อม (x1-4 / z32-34) ขยายออกทุกทิศ 7 ช่อง
   (ตัดที่ขอบแผนที่ x0) — สองคนนี้เดินวนอยู่แถวบ้านตัวเอง ไม่เดินไปไกลทั่วเมืองเหมือน npc-walk
   เลื่อนตามกระท่อมเสมอ (สุทธิ -3 จากของเดิม z29-45) */
const CARPENTER_ROAM = {x0:0, x1:11, z0:25, z1:41};

/* ---------- แปลงดอกไม้หน้าลานกิจกรรม ----------
   ทุ่งหญ้าโล่งหน้าลาน (นอกขอบลานฝั่ง x41 ขึ้นไป) — จัดเป็นกระบะดอกไม้ 2×2 ช่อง 4 แปลง เรียงเป็นตาราง
   เว้นช่องเดินคั่นระหว่างแปลงทุกด้าน (x45 / z23-24) เดินลอดเข้าออกลานได้สบาย
   บล็อกทางเดินเหมือนม้านั่ง/รถเข็น (เด็กเดินอ้อมได้ ไม่เหยียบดอกไม้) */
const FLOWER_BEDS = [
  {x0:43, x1:44, z0:21, z1:22}, {x0:46, x1:47, z0:21, z1:22},
  {x0:43, x1:44, z0:25, z1:26}, {x0:46, x1:47, z0:25, z1:26},
  /* แถวแปลงดอกไม้หน้าโรงพยาบาล (ทิศเหนือของถนน) */
  {x0:57, x1:58, z0:25, z1:26}, {x0:60, x1:61, z0:25, z1:26}, {x0:63, x1:64, z0:25, z1:26},
  /* ---- แปลงดอกไม้ของร้านต้นไม้ (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้ "หลังร้านขายต้นไม้ให้เป็นแปลงดอกไม้ของร้าน") ----
     ร้านต้นไม้ (ล็อต x22-25 / z47-50) หันประตูไป +z ⇒ **"หลังร้าน" คือฝั่ง -z** = แถบ z42-46
     จัดเป็นกระบะ 2×2 สี่แปลงเหมือนแปลงหน้าลานกิจกรรม เว้นช่องเดินคั่นเป็นกากบาท (คอลัมน์ x24 / แถว z44)
     ⇒ เดินเข้าไปดูแปลงหลังร้านได้ และยังอ้อมไปหลังอาคาร (แถว z46) ได้ตามปกติ
     ⚠ แถบนี้เคยเป็นทุ่งทานตะวัน 2 ผืนที่งอกทับตัวอาคารร้าน (ดู SUNFLOWER_FIELDS) เอาออกพร้อมกันแล้ว */
  {x0:22, x1:23, z0:42, z1:43}, {x0:25, x1:26, z0:42, z1:43},
  {x0:22, x1:23, z0:45, z1:46}, {x0:25, x1:26, z0:45, z1:46},
];
/* ---------- ทุ่งดอกไม้ใหญ่ (ทิศตะวันตกเฉียงใต้ หน้าบ้านหลังคาชมพู home-3 / เขียว home-4) ----------
   ที่ว่างระหว่างปลายทางเดิน 2 เส้น (ถนน x37-38 กับ x53-54) หน้าบ้าน 2 หลังนั้นพอดี
   ดอกไม้ในทุ่งเป็น **ของตกแต่งบนพื้น ไม่บล็อกทางเดิน** (เด็กเดินลุยทุ่งได้ เหมือนดอกไม้ป่าทั่วแผนที่)
   แถว z = FLOWER_FIELD_PATH เป็นทางเดินดินกลางทุ่ง เชื่อมทางเดิน 2 ฝั่งเข้าหากัน มีซุ้มดอกไม้คร่อมหัวท้าย
   ช่องไหนมีต้นไม้/พุ่มอยู่แล้วจะข้ามไปเอง (เช็ค outGrid ตอนสร้างฉาก) ทุ่งจึงแทรกไปตามที่ว่างจริง */
const FLOWER_FIELD = {x0:39, x1:52, z0:59, z1:63};
const FLOWER_FIELD_PATH = 61;
/* ---------- ทุ่งดอกทานตะวัน (หลายผืนทั่วเมือง) ----------
   ต้นทานตะวันสูงกว่าดอกไม้ทุ่งอื่นมาก จึง **บล็อกช่อง** เหมือนทุ่งดอกไม้ผืนอื่น (เด็กเดินอ้อม ไม่เดินทะลุต้น)
   ⇒ เพิ่มผืนใหม่ทีไรต้องเช็คว่าไม่ปิดทางเดินจนเกิดซอกตัน (ดัมพ์กริดจริงจาก engine มาดูก่อนเสมอ)
   `path` (ถ้ามี) = แถว z ที่เว้นเป็นทางเดินดินผ่ากลางทุ่ง เดินเข้าไปเล่นกลางทุ่งได้
   ช่องที่ติดล็อตอาคาร/มีต้นไม้อยู่ก่อนแล้วจะถูกข้ามเองตอนวางผัง (ดู fieldFlowerPlan ใน js/house.js) */
const SUNFLOWER_FIELDS = [
  /* (ผืนใหญ่ข้างห้าง x0-4 / z43-52 เอาออกแล้วเมื่อ 2026-08-08 ตามคำขอผู้ใช้ —
     **แฟชั่นมอลล์ย้ายมาตั้งแทนที่ตรงนี้** ต่อแถวเดียวกับเฟอร์นิเจอร์มอลล์) */
  /* (2 ผืนเล็กในทุ่งโล่งฝั่งตะวันออกของตึกแล็บ x22-23/z46-49 กับ x25-26/z46-49 **เอาออกแล้ว 2026-08-09**
     — ตอนย้ายร้านต้นไม้มาลงล็อต x22-25/z47-50 เมื่อ 2026-08-08 ลืมเก็บกวาด 2 ผืนนี้ ทานตะวันเลยงอก
     ทับตัวอาคารร้านอยู่ 6 กับ 3 ช่อง · พื้นที่ "หลังร้าน" เปลี่ยนเป็นแปลงดอกไม้ของร้านแทน ดู FLOWER_BEDS) */
  /* แปลงปลูกดอกไม้ของร้านต้นไม้ (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้) — ผืนยาวคั่นระหว่างทางเดินใหม่ x11-12
     กับทางเดินรอบบ้าน x19-27 พอดี ⇒ ทุ่งทานตะวันขวางไว้ทั้งแถบ เดินอ้อมได้ทางลานร้านของเล่น */
  {x0:13, x1:18, z0:40, z1:41},
  /* ผืนข้างโรงพยาบาลฝั่งขอบแผนที่ทิศตะวันออก (เว้นคอลัมน์ x64 ไว้เป็นทางเดินเลียบโรงพยาบาล
     — x64 ถูกกันไว้ให้เองอยู่แล้วเพราะติดขอบล็อตโรงพยาบาล 1 ช่อง) */
  {x0:65, x1:67, z0:29, z1:33},
];
/* สีดอกไล่เป็นแถบตามแถว z (แถบชมพู / เหลือง / ม่วง / ส้ม) ให้ดูเป็นทุ่งดอกไม้ที่จัดไว้ ไม่ใช่ดอกป่ากระจัดกระจาย */
const FIELD_ROW_COLORS = [[0xff8fb3,0xffc1d6], [0xffd54f,0xffe9a8], [0xb388ff,0xd9c4ff], [0xff8a65,0xffc2ab]];
/* ---------- ทุ่งดอกไม้ผืนใหญ่ริมขอบแผนที่ทิศใต้ (x30-67 / z62-67) ----------
   ผืนนี้กินพื้นที่ว่างท้ายชุมชนทั้งแถบ ดอกไม้เบาบางกว่าทุ่งหน้าโรงแรมนิดหน่อย (ผืนใหญ่มาก ต้องคุมจำนวนชิ้น)
   ถนน 2 เส้นที่มาจบที่ z63 ต่อเป็น "ทางเดินดิน" ลงไปจนสุดขอบแผนที่ ให้เดินทะลุทุ่งได้ไม่ตัน */
/* ทุ่งดอกไม้ตีขอบแผนที่ทิศใต้ฝั่งตะวันตก — ต่อกับทุ่งใหญ่ FLOWER_MEADOW (x30-67) ให้เป็นแนวเดียวกันตลอดขอบใต้
   (ช่องที่เป็นน้ำ/ของฉาก/ทางเดิน จะถูกข้ามเองด้วย fieldOpen ตอนสร้างทุ่ง) */
const FLOWER_WEST = {x0:0, x1:26, z0:65, z1:67};
/* ลานโต๊ะหน้าร้านอาหาร (นอกล็อตอาคาร เดินเข้าไปนั่งได้) — ห้ามให้ต้นไม้/เห็ด/ดอกไม้งอกทับลาน */
const FOOD_DECK = {x0:32, x1:35, z0:43, z1:50};
/* แถวดอกไม้ริมลานร้านอาหารฝั่งตะวันตก (x31) — เป็นดอกไม้ล้วน ไม่เอาต้นไม้ */
const FOOD_FLOWER_COL = {x0:31, x1:31, z0:41, z1:51};
const FLOWER_MEADOW = {x0:30, x1:67, z0:62, z1:67};
const MEADOW_TRAILS = [{x0:37, x1:38, z0:64, z1:67}, {x0:53, x1:54, z0:64, z1:67}];
function inMeadowTrail(x, z){
  return MEADOW_TRAILS.some(t => x>=t.x0 && x<=t.x1 && z>=t.z0 && z<=t.z1);
}

/* ---------- สนามเด็กเล่นกลางเมือง (แทนที่ร้านดอกไม้/ผลไม้/เฟอร์นิเจอร์/หนังสือ ที่เอาออกไป) ----------
   PLAYGROUND = ผืนพื้นยางกันกระแทกทั้งสนาม (เดินได้ทั้งผืน ไม่มีรั้ว เข้าออกได้ทุกด้าน)
   PLAY_ITEMS = เครื่องเล่นแต่ละชิ้น: tiles = ช่องที่ตัวเครื่องเล่นกินจริง (บล็อกทางเดิน)
     ride:true  = เด็กแตะแล้วเดินไป "นั่งเล่นจริง" (ชิงช้า/กระดานหก/ม้าโยก — ใช้กลไก rock เดียวกับชิงช้าในบ้าน)
     spin:true  = ม้าหมุน เด็กขึ้นไปหมุนไปกับเครื่องเล่นได้
     ที่เหลือ  = แตะแล้วเด็กเดินไปเล่นข้างๆ เครื่องเล่นขยับ + มีประกายดาว
   ทุกชิ้น "ขยับได้" จึงไม่ถูก merge รวมกับฉากตายตัว (ดู spawnPlayground ใน js/house.js) */
const PLAYGROUND = {x0:55, x1:66, z0:37, z1:45};
/* รั้วรอบสนาม = ขอบนอกทั้ง 4 ด้านของ PLAYGROUND (บล็อกทางเดิน) เว้น "ประตูเดียว" ด้านทิศเหนือ
   ตรงหน้าโรงพยาบาลพอดี (ประตูโรงพยาบาลอยู่ x60 z34) — เสาไฟที่ตั้งอยู่ก่อนแล้วให้คงไว้ ไม่วางรั้วทับ */
const PLAY_GATE = [[59,37],[60,37],   /* ประตูหน้าโรงพยาบาล (ทิศเหนือ) */
                   [64,45],[65,45]];  /* ประตูทิศใต้ รับกับถนนแยกที่วิ่งขึ้นมาจากขอบแผนที่ */
const PLAY_SIGN = {x:58, z:37};                 /* ป้ายสนามข้างประตู (อยู่บนแนวรั้ว บล็อกอยู่แล้ว) */
/* หมายเหตุผัง: **ห้ามวางเครื่องเล่นปิดช่องหน้าประตู (59,38) กับ (60,38)** ไม่งั้นสนามจะเดินเข้าไม่ได้ทั้งผืน
   (เคยพลาดมาแล้ว — ชิงช้าไปตั้งขวางหน้าประตูพอดี) ตรวจซ้ำได้ด้วยสคริปต์เช็คทางเดินก่อน commit */
const PLAY_ITEMS = [
  {id:'sandbox',  kind:'sandbox',  tiles:[[56,38],[57,38],[56,39],[57,39]], rot:0, stand:[58,39]},
  {id:'swing',    kind:'swing',    tiles:[[61,38],[62,38]], rot:0, ride:true,  stand:[61,39]},
  {id:'slide',    kind:'slide',    tiles:[[64,41],[64,42]], rot:0,             stand:[64,40]},   /* ยืนรอที่ "หลังบันได" ไม่ใช่ข้างราง */
  {id:'carousel', kind:'carousel', tiles:[[60,41],[61,41],[60,42],[61,42]], rot:0, spin:true, stand:[59,42]},   /* กลางสนามพอดี */
  {id:'seesaw',   kind:'seesaw',   tiles:[[56,42],[56,43]], rot:0, ride:true,  stand:[57,42]},
  {id:'spring-duck',  kind:'spring', variant:'duck',  tiles:[[64,38]], rot:0, ride:true, stand:[63,38]},
  {id:'spring-horse', kind:'spring', variant:'horse', tiles:[[58,44]], rot:0, ride:true, stand:[58,43]},
];
const PLAY_TILE_SET = new Set();
PLAY_ITEMS.forEach(it => it.tiles.forEach(t => PLAY_TILE_SET.add(t[0] + ',' + t[1])));
function inPlayground(x, z){
  return x>=PLAYGROUND.x0 && x<=PLAYGROUND.x1 && z>=PLAYGROUND.z0 && z<=PLAYGROUND.z1;
}
function isPlayItemTile(x, z){ return PLAY_TILE_SET.has(x + ',' + z); }
/* ช่องที่เป็น "รั้วสนาม": ขอบนอกของสนาม ยกเว้นช่องประตูกับช่องที่มีเสาไฟตั้งอยู่แล้ว */
function isPlayFenceTile(x, z){
  if(!inPlayground(x, z)) return false;
  const edge = (x===PLAYGROUND.x0 || x===PLAYGROUND.x1 || z===PLAYGROUND.z0 || z===PLAYGROUND.z1);
  if(!edge) return false;
  if(PLAY_GATE.some(gt => gt[0]===x && gt[1]===z)) return false;
  return !isLampTile(x, z);
}

/* ---------- สระว่ายน้ำของโรงแรม (พื้นที่บ้านหลังคาเขียวเดิม) ----------
   POOL = ผิวน้ำ (บล็อกทางเดิน) / POOL_DECK = ลานกระเบื้องรอบสระ (เดินได้ แค่เปลี่ยนพื้น)
   ของบนลาน (เตียงอาบแดด/ร่ม/ห่วงยาง/ต้นไม้กระถาง) บล็อกช่องตัวเองเหมือนของฉากอื่น */
const POOL = {x0:48, x1:51, z0:56, z1:58};
const POOL_DECK = {x0:47, x1:52, z0:55, z1:59};
const POOL_PROPS = [
  [47,55,'palm'], [52,55,'umbrella'], [47,59,'chair'], [49,59,'chair'], [51,59,'chair'], [52,59,'ring'],
];
function inPool(x, z){ return x>=POOL.x0 && x<=POOL.x1 && z>=POOL.z0 && z<=POOL.z1; }
function inPoolDeck(x, z){ return x>=POOL_DECK.x0 && x<=POOL_DECK.x1 && z>=POOL_DECK.z0 && z<=POOL_DECK.z1; }

/* ---------- กรอบลานน้ำพุกลางชุมชน (จัดวางเองทั้งกรอบ) ----------
   กรอบ x39-52 z37-51 ล้อมด้วยถนนทั้ง 4 ด้าน ข้างในมี: ลานหินอ่อน (PLAZA) + น้ำพุกลางลาน
   + เสาไฟ 4 มุมลาน + ม้านั่ง + กระดานภารกิจ + ซุ้มทางเดินเข้า 3 ทาง ที่เหลือเป็น "ทุ่งดอกไม้" ทั้งหมด
   ของฉากสุ่ม (ต้นไม้/พุ่ม/ดอกไม้ริมทาง/เสาไฟอัตโนมัติ) ห้ามงอกในกรอบนี้ ลานจะได้โล่งตามที่ออกแบบไว้ */
const PLAZA_YARD = {x0:39, x1:52, z0:37, z1:51};
/* ทางเดินเข้าลาน 3 ทาง (ปูหินต่อจากลาน + มีซุ้มไม้เลื้อยคร่อมตลอดทาง ซุ้มไม่บล็อกช่อง เดินลอดได้) */
const PLAZA_GATES = [
  {x0:45, x1:46, z0:37, z1:39, axis:'z'},   /* ทางเข้าทิศเหนือ (ต่อจากถนน z35-36) */
  {x0:39, x1:41, z0:43, z1:44, axis:'x'},   /* ทางเข้าฝั่งถนน x37-38 */
  {x0:50, x1:52, z0:43, z1:44, axis:'x'},   /* ทางเข้าฝั่งถนน x53-54 */
];
function inPlazaYard(x, z){
  return x>=PLAZA_YARD.x0 && x<=PLAZA_YARD.x1 && z>=PLAZA_YARD.z0 && z<=PLAZA_YARD.z1;
}
function inPlazaGate(x, z){
  return PLAZA_GATES.some(g => x>=g.x0 && x<=g.x1 && z>=g.z0 && z<=g.z1);
}

function inFlowerBed(x, z){
  return FLOWER_BEDS.some(b => x>=b.x0 && x<=b.x1 && z>=b.z0 && z<=b.z1);
}

/* ---------- ชาวบ้าน (NPC) + กระดานภารกิจ (เฟส 8) ----------
   job: 'vendor' = พ่อค้า/แม่ค้า — **ยืนประจำอยู่หน้าร้านเสมอ เด็กไม่ต้องเข้าไปในร้าน**
        อื่นๆ (villager/teacher/farmer/…) = ชาวบ้านทั่วไป ยืนตามจุดของตัวเอง
   ตำแหน่ง 2 แบบ:
     - `lot` + `side` → คิดช่องจาก "ข้างประตูร้าน" ให้อัตโนมัติ (side -1 = ฝั่งทิศเหนือ, +1 = ทิศใต้)
     - `x`,`z` ตรงๆ → ใช้กับร้านที่ช่องหน้าประตูเป็นถนนพอดี (ชุมชนที่ 2) จะได้ไม่ไปยืนขวางถนน
   `roam` = เดินไปมาในกรอบที่กำหนด (คนกลุ่มนี้ **ไม่บล็อกช่อง** เพราะขยับตลอด)
            `roam:{town:true}` = ไม่จำกัดกรอบ เดินไปได้ทั่วเมือง (สุ่มปลายทางจากช่องถนน/ลานทั้งแผนที่ แล้วหาทางเดินจริงไป)
            คนที่ไม่มี roam ยืนประจำที่และบล็อกช่องตัวเอง (เด็กเดินทะลุตัวคนไม่ได้)
   `look` = หน้าตา/ชุด (ดู buildVillager) — geometry ของทุกคนถูก merge เหลือคนละ 1 draw call
   `lines` = บทพูดตอนเด็กเดินมาคุย (สุ่มไล่ทีละบรรทัด)
   `quest` = บทเชิญชวนเล่นเกมโจทย์ — **ช่องนี้คือจุดผูกเกม quest ในเฟสถัดไป** (ดู npcQuestHook) */
const NPC_DEFS = [
  /* --- พ่อค้าแม่ค้าประจำหน้าร้าน (ชุมชนข้ามสะพาน) --- */
  {id:'npc-mart',   name:'พี่นวล',   icon:'🏪', job:'vendor', lot:'shop-mart', side:1,
   look:{girl:true, skin:0, shirt:0x6fbf73, pants:0xf7f3ee, hair:1, hairC:2, hat:'cap', prop:'basket', apron:true},
   lines:['ร้านสะดวกซื้อของพี่มีทุกอย่างเลย ขนม น้ำ ไอศกรีม!', 'หยิบตะกร้าใบนี้ไปเดินเลือกของได้เลยจ้ะ',
          'ไอศกรีมอยู่ในตู้แช่หน้าร้านนะ เย็นๆ ชื่นใจเลย'],
   quest:'ช่วยพี่นับของในตะกร้าหน่อยได้ไหม'},
  {id:'npc-pet',    name:'พี่ปุย',    icon:'🐾', job:'vendor', lot:'shop-pet', side:1,
   look:{skin:0, shirt:0xffb877, pants:0x6d4c41, hair:2, hairC:2, hat:null, prop:null},
   lines:['ที่ร้านมีลูกหมาลูกแมวน่ารักเยอะเลย ไปดูที่คอกข้างร้านได้นะ',
          'เลี้ยงสัตว์ต้องให้อาหารกับน้ำทุกวันนะ',
          'ร้านพี่อาบน้ำตัดขนให้น้องหมาน้องแมวด้วยนะ ขนฟูสวยเลย'],
   quest:'ช่วยพี่นับลูกสัตว์ในคอกหน่อยได้ไหม'},
  {id:'npc-food',   name:'ป้าอิ่ม',    icon:'🍜', job:'vendor', lot:'shop-food', side:1,
   look:{girl:true, skin:2, shirt:0xef8354, pants:0xfff3e0, hair:2, hairC:0, hat:null, prop:null, apron:true},
   lines:['ก๋วยเตี๋ยวร้อนๆ ของป้าอร่อยที่สุดในเมืองเลย', 'กินข้าวให้ครบทุกมื้อนะหนู'],
   quest:'ช่วยป้านับชามในร้านหน่อยได้ไหมจ๊ะ'},
  {id:'npc-ice',    name:'พี่ฟ้า',    icon:'🍨', job:'vendor', lot:'shop-food', side:-1,
   look:{skin:0, shirt:0x7fc4e8, pants:0xfff3e0, hair:1, hairC:0, hat:null, prop:null, apron:true},
   lines:['ร้านเรามีของหวานกับไอศกรีมด้วยนะ', 'นั่งโต๊ะข้างนอกได้เลย ลมเย็นสบาย'],
   quest:'ทายสีไอศกรีมกับพี่ไหม'},
  /* เจ้าของร้านเครื่องดนตรี (ล็อต shop-music ที่มาแทนบ้านหลังคาม่วงหลังเดิม)
     ⚠ id ต้องไม่ใช่ 'npc-music' — ชื่อนั้นมีคนใช้แล้ว (พี่นักดนตรีข้างเวทีกลางเมือง) ชุดเทสจับ id ซ้ำ */
  {id:'npc-musicshop', name:'พี่โน้ต',  icon:'🎸', job:'vendor', lot:'shop-music', side:1,
   look:{skin:1, shirt:0x7e57c2, pants:0x455a64, hair:1, hairC:1, hat:'cap', prop:'guitar', apron:true},
   lines:['ยินดีต้อนรับสู่ร้านเครื่องดนตรีจ้ะ ลองเล่นได้ทุกชิ้นเลยนะ',
          'กีตาร์ กลอง คีย์บอร์ด ชอบชิ้นไหนบอกพี่ได้เลย',
          'ดนตรีทำให้ใจเราสนุกขึ้นนะ ลองเคาะกลองดูสิ'],
   quest:'ช่วยพี่ทายเสียงเครื่องดนตรีหน่อยไหม'},
  /* --- พนักงานหน้าห้าง 2 หลังของชุมชนที่ 2 (เดิมช่องนี้เป็นป้าผัก npc-veg เจ้าของร้านผักที่รื้อไปแล้ว) ---
     ยืนบนทางเท้าหน้าห้าง ไม่ขวางประตู: เฟอร์นิเจอร์มอลล์หันหน้า +x จึงยืนเยื้องประตูไปทางแถว z
     ส่วนแฟชั่นมอลล์หันหน้า +z ยืนเยื้องข้างประตูตามปกติ */
  /* `shop` = id ล็อตร้านที่พนักงานคนนี้ดูแล — คุยจบแล้วเปิดหน้าร้านให้เลย (เฟส 1 เศรษฐกิจ) */
  {id:'npc-mall-furn', name:'พี่โซฟา', icon:'🛋️', job:'vendor', x:5, z:60, rot:1, shop:'mall-furniture',
   look:{skin:1, shirt:0xe89a4f, pants:0x6d4c41, hair:2, hairC:1, hat:'cap', prop:'box', apron:true},
   lines:['ยินดีต้อนรับสู่เฟอร์นิเจอร์มอลล์จ้ะ ข้างในกว้างมากเลยนะ',
          'โซฟาตัวนี้นั่งนุ่มมาก ลองนั่งดูได้เลย', 'ห้องนอนสวยๆ เริ่มจากเลือกเตียงกับโคมไฟให้เข้ากันนะ'],
   quest:'ช่วยพี่จับคู่โซฟากับหมอนอิงสีเดียวกันหน่อยได้ไหม'},
  /* ย้ายตามแฟชั่นมอลล์มายืนที่ลานหน้าห้างคอลัมน์ x5 (เดิม x10,z53) — rot:1 เหมือนพี่โซฟา
     เพราะห้างทั้งสองหลังหันหน้าไป +x ทางเดียวกันแล้ว */
  {id:'npc-mall-fash', name:'พี่ชุดสวย', icon:'👗', job:'vendor', x:5, z:48, rot:1, shop:'mall-fashion',
   look:{girl:true, skin:0, shirt:0xef7fa8, pants:0xf7f3ee, hair:3, hairC:0, hat:null, prop:'basket'},
   lines:['แฟชั่นมอลล์มีชุดสวยๆ ครบทุกไซซ์เลยจ้ะ', 'หมวกกับกระเป๋าใบนี้เข้ากันมากเลยนะ',
          'ลองเลือกสีที่หนูชอบที่สุดดูสิจ๊ะ'],
   quest:'มาช่วยพี่เลือกชุดให้เข้ากับหมวกไหมจ๊ะ'},
  /* เจ้าของร้านต้นไม้ + ร้านของเล่น (เพิ่ม 2026-08-08 พร้อมร้านใหม่ 2 ร้าน) */
  {id:'npc-garden', name:'ป้าใบเตย', icon:'🌷', job:'vendor', lot:'shop-garden', side:1, shop:'shop-garden',
   look:{girl:true, skin:1, shirt:0x6cb96a, pants:0xd8c39a, hair:2, hairC:1, hat:'straw', prop:'basket', apron:true},
   lines:['ต้นไม้ของป้ารดน้ำทุกเช้าเลยจ้ะ ใบเลยเขียวสวย',
          'เอาไปปลูกที่สนามหน้าบ้านสวยมากเลยนะ', 'ดอกไม้สีไหนที่หนูชอบที่สุดจ๊ะ'],
   quest:'ช่วยป้านับกระถางต้นไม้หน้าร้านหน่อยได้ไหมจ๊ะ'},
  /* ⚠ พี่ตุ๊กตาติดธง `stand:true` (คำขอผู้ใช้ 2026-08-09 "ให้ยืนหน้าร้าน") — หน้าร้านของเล่นเป็น
     "ลานทางเดิน" ทั้งผืน (VILLAGE2_ROADS x5-10/z43-53) ส่วนกรอบเดินอัตโนมัติของพ่อค้าแม่ค้าติดเงื่อนไข
     nearShop = ห้ามเหยียบช่องถนน ⇒ ไม่เหลือช่องให้ยืนสักช่อง แล้วโดนดันไปยืนหลังร้าน
     ธง stand ตัดกรอบเดินทิ้ง ให้ยืนนิ่งที่ช่องข้างประตูร้านตลอด (บล็อกช่องตัวเองเหมือนแม่ค้าตลาด) */
  {id:'npc-toy', name:'พี่ตุ๊กตา', icon:'🎠', job:'vendor', lot:'shop-toy', side:1, stand:true, shop:'shop-toy',
   look:{skin:0, shirt:0x54b3d6, pants:0xef7fa8, hair:0, hairC:0, hat:'cap', prop:'ball'},
   lines:['ร้านพี่มีเครื่องเล่นสนามครบเลย ชิงช้า ม้าโยก บ้านต้นไม้',
          'เอาไปวางที่สนามหน้าบ้านแล้วชวนเพื่อนมาเล่นได้นะ', 'อันไหนน่าสนุกที่สุดล่ะ?'],
   quest:'ช่วยพี่นับของเล่นในกล่องหน่อยได้ไหม'},
  /* พ่อค้าแม่ค้ารถเข็น (ยืนข้างรถเข็นของตัวเอง) */
  {id:'npc-cart-fruit',  name:'พี่แตงโม', icon:'🍉', job:'vendor', x:33, z:27, rot:0,
   look:{skin:1, shirt:0xe36f5c, pants:0x6fbf73, hair:0, hairC:0, hat:'cap', prop:'basket'},
   lines:['แตงโมหวานๆ เย็นๆ จ้า', 'ลานนี้สนุกนะ เดี๋ยวมีการแสดงที่เวทีด้วย'],
   quest:'ทายว่าผลไม้ในรถเข็นมีกี่ลูกไหม'},
  /* โบโซ่ขายลูกโป่ง — ย้ายมา **กลางลานทางเดินใหม่หน้าร้านของเล่น** พร้อมรถเข็น (8,48) เมื่อ 2026-08-09
     `roam` = เดินไปมารอบรถเข็นในกรอบลานพอดี (คนกลุ่ม roam ไม่บล็อกช่อง) · หน้าตาชุดโบโซ่: หมวกกรวยลายทาง
     + ผมฟูสองข้าง + จมูกกลมแดง (ดู hat 'clown' ใน buildVillager) ตั้ง nose:0 ไว้ ไม่งั้นจะได้จมูกซ้อน 2 อัน */
  {id:'npc-clown', name:'โบโซ่', icon:'🎈', job:'vendor', x:9, z:48, rot:0,
   roam:{x0:5, x1:10, z0:43, z1:53},
   look:{skin:0, shirt:0xef5f5f, pants:0x5aa9e6, shoe:0xffd54f, hair:0, hairC:5, hat:'clown', hatC:0xb388ff,
         prop:'balloon', nose:0, face:5, brow:2, freckle:true, beard:0},
   lines:['ลูกโป่งจ้า ลูกโป่งสีสวยๆ เอาสีอะไรดีจ๊ะ!', 'ดูนี่นะ… โบโซ่บิดลูกโป่งเป็นรูปหมาได้ด้วย!',
          'ยิ้มหน่อยสิจ๊ะ วันนี้อากาศดีมากเลย'],
   quest:'มาทายว่าลูกโป่งสีไหนมีเยอะที่สุดกับโบโซ่ไหม'},
  /* นักมายากลข้างรถเข็นมายากล (8,51) — เพิ่ม 2026-08-09 ตามคำขอผู้ใช้ ยืนคนละมุมลานกับโบโซ่
     ⚠ ใช้หมวกทรงสูง (hat 'top') ร่วมกับท่านนายกเทศมนตรี → **ต้องแยกให้ออกด้วยสี+ของ**: หมวกม่วง (mayor ดำ)
     ถือไม้กายสิทธิ์ และ **ห้ามใส่ `sash`** (สายสะพาย+เหรียญตราเป็นเครื่องหมายประจำตัวท่านนายกฯ)
     `roam` = เดินไปมาในกรอบลานเดียวกับโบโซ่ (คนกลุ่ม roam ไม่บล็อกช่อง เดินสวนกันได้) */
  {id:'npc-magician', name:'พี่มายากล', icon:'🎩', job:'vendor', x:9, z:51, rot:0,
   roam:{x0:5, x1:10, z0:43, z1:53},
   look:{skin:1, shirt:0x7e57c2, pants:0x3a3540, shoe:0x3a3540, hair:0, hairC:0,
         hat:'top', hatC:0x7e57c2, hatC2:0xffd54f, prop:'wand', face:3, brow:1},
   lines:['ดูให้ดีนะจ๊ะ… ฮึบ! กระต่ายโผล่ออกมาจากหมวกแล้ว!',
          'มายากลไม่ใช่เวทมนตร์จริงนะ เป็นการฝึกมือให้ไวๆ ต่างหาก',
          'อยากดูอีกรอบไหมจ๊ะ คราวนี้ดูที่มือพี่ให้ดีๆ เลย'],
   quest:'มาทายว่าไพ่ใบไหนซ่อนอยู่ใต้หมวกกับพี่ไหม'},
  {id:'npc-cart-noodle', name:'ป้าเส้น',  icon:'🍜', job:'vendor', x:39, z:33, rot:0,
   look:{girl:true, skin:2, shirt:0xffc857, pants:0xe0715c, hair:1, hairC:1, hat:'straw', prop:'bowl', apron:true},
   lines:['ก๋วยเตี๋ยวร้อนๆ หอมมากเลยจ้า', 'หิวหรือยังจ๊ะ นั่งพักที่ม้านั่งก่อนก็ได้นะ'],
   quest:'ช่วยป้านับชามหน่อยได้ไหมจ๊ะ'},
  /* --- แม่ค้า/พ่อค้าประจำรถเข็นในตลาดหน้าโรงเรียน (ยืนข้างรถเข็นของตัวเอง ดู MARKET/CART_SPOTS) ---
     ทุกคนยืนช่องข้างรถเข็นของตัวเอง — พิกัดต้องเดินคู่กับ CART_SPOTS เสมอ
     ถ้าย้ายรถเข็น อย่าลืมย้ายคนขายตาม ไม่งั้นจะกลายเป็นคนยืนลอยกลางลานไม่มีร้าน
     `stand:true` = ยืนติดร้านตลอด ไม่เดินไปไหน (คำขอผู้ใช้) → ไม่ได้ roam อัตโนมัติแบบ vendor คนอื่น
     rot ของแถวเหนือ/แถวใต้ตั้งเป็น 0 (หันหน้า +z เข้าหากล้อง) ทั้งคู่ ไม่ได้หันเข้าหากันตามแนวลาน
     เพราะกล้องไอโซของเกมมองจากทิศ +z ทิศเดียวตายตัว — ถ้าให้แถวใต้หันเข้าลาน เด็กจะเห็นแต่หลังคนขายตลอดเวลา */
  {id:'npc-mk-meatball', name:'ป้าลูกชิ้น', icon:'🍢', job:'vendor', x:11, z:59, rot:0, stand:true,
   look:{girl:true, skin:2, shirt:0xe4574a, pants:0xf7f3ee, hair:1, hairC:1, hat:'bandana', hatC:0xffd54f, prop:'tray', apron:true},
   lines:['ลูกชิ้นปิ้งร้อนๆ จ้า จิ้มน้ำจิ้มหวานๆ อร่อยมาก!', 'ไม้ละสิบบาทเองจ้ะ เอากี่ไม้ดี'],
   quest:'ช่วยป้านับลูกชิ้นในไม้หน่อยได้ไหมจ๊ะ'},
  {id:'npc-mk-sausage',  name:'ลุงไส้กรอก', icon:'🌭', job:'vendor', x:14, z:59, rot:0, stand:true,
   look:{skin:3, shirt:0xef8354, pants:0x6d4c41, hair:0, hairC:1, hat:'cap', prop:'tray', apron:true},
   lines:['ไส้กรอกทอดกรอบนอกนุ่มในจ้า', 'รอแป๊บนึงนะ กำลังทอดอยู่เลย'],
   quest:'ทายว่าลุงทอดไส้กรอกได้กี่ไม้แล้วไหม'},
  {id:'npc-mk-tokyo',    name:'พี่โตเกียว', icon:'🥞', job:'vendor', x:17, z:59, rot:0, stand:true,
   look:{girl:true, skin:0, shirt:0xffd54f, pants:0xf7f3ee, hair:2, hairC:0, hat:'bandana', hatC:0xef8fa5, prop:'tray', apron:true},
   lines:['ขนมโตเกียวไส้ครีม ไส้ไส้กรอก มีครบเลยจ้ะ', 'ม้วนร้อนๆ อร่อยที่สุดเลยนะ'],
   quest:'ช่วยพี่นับขนมโตเกียวบนกระทะหน่อยได้ไหม'},
  {id:'npc-mk-smoothie', name:'พี่น้ำปั่น', icon:'🥤', job:'vendor', x:17, z:62, rot:0, stand:true,
   look:{girl:true, skin:1, shirt:0xb388ff, pants:0xf7f3ee, hair:3, hairC:0, hat:'cap', prop:'bottle', apron:true},
   lines:['น้ำปั่นเย็นๆ ชื่นใจจ้า มีสตรอว์เบอร์รีกับมะม่วงนะ', 'ปั่นสดๆ ให้เลย รอแป๊บเดียว!'],
   quest:'ช่วยพี่นับแก้วน้ำปั่นหน่อยได้ไหม'},
  {id:'npc-mk-toy',      name:'ป้าของเล่น', icon:'🪀', job:'vendor', x:11, z:62, rot:0, stand:true,
   look:{girl:true, skin:1, shirt:0x8fd694, pants:0x6d4c41, hair:1, hairC:2, hat:'straw', prop:'ball'},
   lines:['ของเล่นน่ารักๆ เยอะเลย มาดูก่อนได้จ้ะ', 'กังหันลมอันนี้หมุนสวยมากเลยนะ'],
   quest:'มาเลือกของเล่นชิ้นโปรดกับป้าไหมจ๊ะ'},
  {id:'npc-mk-cotton',   name:'พี่สายไหม', icon:'🍬', job:'vendor', x:14, z:62, rot:0, stand:true,
   look:{girl:true, skin:0, shirt:0xef8fa5, pants:0xf7f3ee, hair:2, hairC:0, hat:'bandana', hatC:0x7fc4e8, prop:'balloon'},
   lines:['สายไหมนุ่มๆ เหมือนก้อนเมฆเลยจ้ะ', 'มีสีชมพูกับสีฟ้าด้วยนะ ชอบสีไหน'],
   quest:'ช่วยพี่นับไม้สายไหมหน่อยได้ไหม'},
  /* แม่ค้าลานเหนือ (ถนนคนเดิน z54) — ลุงนมคือเจ้าของ "ร้านนม" หลังเดิมที่รื้อไปแล้ว ย้ายมาเข็นรถขายแทน
     (คง id `npc-milk` ไว้เหมือนเดิม ไม่ตั้ง id ใหม่ เผื่อมีอะไรอ้างถึงคนนี้อยู่) */
  {id:'npc-milk',        name:'ลุงนม',    icon:'🥛', job:'vendor', x:11, z:56, rot:0, stand:true,
   look:{skin:2, shirt:0xf7fbff, pants:0x7fc4e8, hair:4, hairC:1, hat:'cap', prop:'bottle', apron:true},
   lines:['นมสดวันนี้เย็นเจี๊ยบเลย!', 'ดื่มนมทุกวันนะ จะได้สูงๆ', 'ร้านลุงย้ายมาเข็นรถขายในตลาดแล้วจ้ะ'],
   quest:'ช่วยลุงนับขวดนมหน่อยได้ไหม'},
  {id:'npc-mk-fruit',    name:'ป้าผลไม้', icon:'🍉', job:'vendor', x:14, z:56, rot:0, stand:true,
   look:{girl:true, skin:3, shirt:0x6fbf73, pants:0xffc857, hair:3, hairC:2, hat:'straw', prop:'basket', apron:true},
   lines:['ผลไม้หั่นใส่ถุงแช่เย็นไว้แล้วจ้า', 'กินผลไม้ทุกวันแข็งแรงนะลูก'],
   quest:'ทายชื่อผลไม้ในรถเข็นกับป้าไหมจ๊ะ'},
  {id:'npc-mk-shave',    name:'พี่น้ำแข็งไส', icon:'🍧', job:'vendor', x:17, z:56, rot:0, stand:true,
   look:{skin:1, shirt:0x9ad9f0, pants:0xf7f3ee, hair:0, hairC:0, hat:'bandana', hatC:0x8fd694, prop:'bowl', apron:true},
   lines:['น้ำแข็งไสราดน้ำหวาน เย็นสดชื่นจ้า', 'มีน้ำแดง น้ำเขียว น้ำส้ม ราดรวมกันก็ได้นะ'],
   quest:'ช่วยพี่นับขวดน้ำหวานหน่อยได้ไหม'},
  /* --- นักวิทยาศาสตร์ประจำตึกแล็บ (เสื้อกาวน์ขาว) เดินวนรอบตึกของตัวเอง --- */
  {id:'npc-lab1', name:'ดร.ฟ้า', icon:'🔬', job:'villager', x:19, z:50, rot:0,
   roam:{x0:9, x1:20, z0:45, z1:54},
   look:{girl:true, skin:0, shirt:0xfdfbf5, pants:0x7fc4e8, hair:3, hairC:0, hat:null, prop:'bottle', glasses:true},
   lines:['ที่แล็บเรากำลังทดลองเรื่องน้ำกับน้ำมันอยู่เลย', 'ใส่แว่นตานิรภัยทุกครั้งก่อนทำการทดลองนะ'],
   quest:'อยากมาทำการทดลองสนุกๆ กับพี่ไหม'},
  /* (ดร.ต้น เดิมยืนที่ 11,49 — ตอนนี้ช่องนั้นอยู่ใต้ตัวแฟชั่นมอลล์แล้ว ย้ายมายืนที่ซอยระหว่างห้างกับตึกแล็บ) */
  {id:'npc-lab2', name:'ดร.ต้น', icon:'🧪', job:'villager', x:11, z:53, rot:0,
   roam:{x0:9, x1:20, z0:45, z1:54},
   look:{skin:2, shirt:0xfdfbf5, pants:0x4a6fa5, hair:0, hairC:1, hat:null, prop:'book', glasses:true},
   lines:['บนหลังคาตึกมีโดมดูดาวด้วยนะ กลางคืนเห็นดาวชัดมาก', 'วิทยาศาสตร์เริ่มจากการตั้งคำถามว่า "ทำไม" เสมอ'],
   quest:'มาทายผลการทดลองกับลุงไหม'},
  {id:'npc-lab3', name:'พี่ผู้ช่วยแล็บ', icon:'🥽', job:'villager', x:13, z:53, rot:0,
   roam:{x0:9, x1:20, z0:45, z1:54},
   look:{skin:1, shirt:0xfdfbf5, pants:0x8fd694, hair:2, hairC:2, hat:'cap', prop:'box', glasses:true},
   lines:['พี่กำลังยกอุปกรณ์ทดลองเข้าไปในแล็บพอดีเลย', 'อยากดูขวดทดลองเดือดปุดๆ ไหม อยู่บนหลังคานั่นไง!'],
   quest:'มาช่วยพี่นับหลอดทดลองหน่อยได้ไหม'},
  /* --- นักเรียนเดินเล่นแถวตลาดหน้าโรงเรียน (ชุดนักเรียน เสื้อขาว) ---
     กรอบเดินคลุม "ลานตลาด + ถนนที่ล้อมตลาดทั้ง 4 ด้าน + สวนเล็กท้ายถนน" ไม่ได้ขังไว้ในลานตลาดอย่างเดียว
     (คำขอผู้ใช้) — ระบบ roam สุ่มช่องปลายทางในกรอบแล้วเดินตามทางจริง เด็กกลุ่มนี้จึงเดินวนรอบตลาด
     แวะเข้าลานบ้าง ออกไปเดินถนนบ้าง สลับไปเรื่อยๆ  น้องเจไดกรอบกว้างสุด เดินไปหน้าโรงเรียน/เข้าประตูโรงเรียนได้ด้วย */
  {id:'npc-stu1', name:'น้องพลอย', icon:'🎒', job:'kid', x:10, z:60, rot:0,
   roam:{x0:6, x1:21, z0:53, z1:65},
   look:{girl:true, skin:0, shirt:0xf7fbff, pants:0x4a6fa5, hair:2, hairC:0, hat:null, prop:'box', kid:true},
   lines:['เลิกเรียนแล้วต้องแวะตลาดหน้าโรงเรียนก่อนทุกวันเลย!', 'ลูกชิ้นปิ้งเจ้านั้นอร่อยที่สุดเลยนะ'],
   quest:'มาช่วยเราเลือกขนมหน่อยได้ไหม'},
  {id:'npc-stu2', name:'น้องกันต์', icon:'🎒', job:'kid', x:14, z:61, rot:0,
   roam:{x0:6, x1:21, z0:53, z1:65},
   look:{skin:2, shirt:0xf7fbff, pants:0x4a6fa5, hair:0, hairC:1, hat:null, prop:'ball', kid:true},
   lines:['วันนี้เราเก็บเงินค่าขนมมาซื้อของเล่นด้วยนะ', 'ป๊อปคอร์นกับสายไหม เอาอันไหนดี ตัดสินใจไม่ถูกเลย'],
   quest:'มาทายราคาขนมกับเราไหม'},
  {id:'npc-stu3', name:'น้องอิ่ม', icon:'🎒', job:'kid', x:17, z:60, rot:0,
   roam:{x0:6, x1:21, z0:53, z1:65},
   look:{girl:true, skin:1, shirt:0xf7fbff, pants:0x4a6fa5, hair:3, hairC:1, hat:null, prop:'cone', kid:true},
   lines:['ไอติมของเราจะละลายแล้ว ต้องรีบกิน!', 'นั่งกินที่ม้านั่งตรงมุมโน้นก็ได้นะ'],
   quest:'มานั่งกินขนมด้วยกันไหม'},
  {id:'npc-stu4', name:'น้องเจได', icon:'🎒', job:'kid', x:12, z:61, rot:0,
   roam:{x0:6, x1:27, z0:53, z1:65},
   look:{skin:0, shirt:0xf7fbff, pants:0x4a6fa5, hair:0, hairC:0, hat:'cap', prop:'balloon', kid:true},
   lines:['ตลาดนี้มีของกินเยอะมาก เดินดูทั้งวันก็ไม่เบื่อ', 'พรุ่งนี้เราจะชวนเพื่อนมาอีก!'],
   quest:'มาเดินดูรถเข็นให้ครบทุกคันกับเราไหม'},
  /* --- ชาวบ้านตามจุดต่างๆ --- */
  {id:'npc-headman', name:'ผู้ใหญ่บ้าน', icon:'📜', job:'headman', x:45, z:41, rot:0, board:true,
   look:{skin:2, shirt:0xef8354, pants:0x4a6fa5, hair:4, hairC:1, hat:'straw', prop:'scroll'},
   lines:['ยินดีต้อนรับสู่หมู่บ้านของเรานะ!', 'เดินเล่นได้ทั่วเลย ร้านค้าอยู่แถวถนนกลางหมู่บ้านนะ'],
   quest:'ถ้าหลงทางมาถามลุงได้เสมอเลยนะ'},
  /* --- ท่านนายกเทศมนตรี: เดินตรวจอยู่ในละแวกบ้านตัวเอง (ล็อต mayor-house x31-35 / z55-58) ---
     ชุดให้เด็กดูแล้วรู้ทันทีว่าเป็น "เจ้านายของเมือง": หมวกทรงสูง (hat 'top') + สายสะพายทองพาดอก
     พร้อมเหรียญตรา (sash) + สูทน้ำเงินเข้ม + ผมขาว + หนวด (beard 2) + แว่น + ถือม้วนประกาศ
     กรอบเดินคลุมถนน/ลานรอบบ้านทั้ง 4 ด้าน (ช่องที่เป็นตัวบ้านถูกกรองออกเองตอนสุ่มจุดหมาย) */
  {id:'npc-mayor', name:'ท่านนายกฯ', icon:'🎩', job:'villager', x:34, z:60, rot:0,
   roam:{x0:31, x1:39, z0:53, z1:61},
   look:{skin:1, shirt:0x3f4a6b, pants:0x2f3f66, shoe:0x2f2a26, hair:0, hairC:4, hat:'top', hatC:0x3a3540,
         hatC2:0xe4574a, sash:true, sashC:0xffd54f, prop:'scroll', glasses:true, beard:2, brow:3},
   lines:['สวัสดีจ้ะหนู ท่านนายกฯ เดินตรวจความเรียบร้อยของเมืองอยู่พอดี',
          'เมืองเราสะอาดน่าอยู่แบบนี้ ก็เพราะทุกคนช่วยกันนะ',
          'บ้านหลังใหญ่ที่มีหอนาฬิกานั่นแหละ บ้านของท่านนายกฯ เอง'],
   quest:'มาช่วยท่านนายกฯ ดูแลเมืองให้น่าอยู่ไหม'},
  /* --- พนักงานโรงแรม 2 คน (ล็อต hotel x40-44 / z55-58 · สระว่ายน้ำ x48-51 / z56-58) ---
     คนแรกดูแลสระ (เดินอยู่บนลานรอบสระ ถือห่วงชูชีพ) · อีกคนเป็นพนักงานยกกระเป๋าเดินอยู่แถวหน้าโรงแรม */
  {id:'npc-hotel-pool', name:'พี่ดูแลสระ', icon:'🛟', job:'villager', x:46, z:57, rot:0,
   roam:{x0:45, x1:55, z0:54, z1:59},
   look:{skin:1, shirt:0xf7fbff, pants:0x4a6fa5, hair:0, hairC:0, hat:'cap', prop:'ring'},
   lines:['ลงสระต้องมีผู้ใหญ่อยู่ด้วยเสมอนะ พี่คอยดูอยู่ตรงนี้แหละ',
          'ก่อนลงน้ำอบอุ่นร่างกายก่อนนะ จะได้ไม่เป็นตะคริว'],
   quest:'มาทายว่าห่วงยางลอยน้ำได้เพราะอะไรไหม'},
  {id:'npc-hotel-bell', name:'พี่พนักงานโรงแรม', icon:'🧳', job:'villager', x:43, z:59, rot:0,
   roam:{x0:36, x1:46, z0:53, z1:61},
   look:{skin:2, shirt:0xb5443c, pants:0x2f3f66, hair:0, hairC:1, hat:'cap', prop:'suitcase'},
   lines:['ยินดีต้อนรับสู่โรงแรมของเราครับ ให้พี่ช่วยยกกระเป๋าไหม',
          'ห้องพักชั้นบนมองเห็นสระว่ายน้ำกับทุ่งดอกไม้เลยนะ'],
   quest:'มาช่วยพี่นับกระเป๋าของแขกไหม'},
  /* --- คุณหมอกับพยาบาลประจำโรงพยาบาล (ล็อต hospital x56-63 / z29-33) ---
     เดินอยู่แถบลานหน้าโรงพยาบาล (z34-36) ที่โล่งตลอดแนว · หมอ = เสื้อกาวน์ขาว + หูฟังคล้องคอ (stetho)
     + กากบาทแดงบนอก (cross) · พยาบาล = หมวกพยาบาลกากบาทแดง (hat 'nurse') + ถือถาดยา */
  {id:'npc-doctor', name:'คุณหมอใจดี', icon:'🩺', job:'villager', x:58, z:35, rot:0,
   roam:{x0:55, x1:65, z0:34, z1:36},
   look:{skin:0, shirt:0xfdfbf5, pants:0x4a6fa5, hair:0, hairC:0, hat:null, prop:'book',
         glasses:true, stetho:true, cross:true},
   lines:['ไม่สบายเมื่อไหร่มาหาหมอได้เลยนะ ไม่ต้องกลัว',
          'ล้างมือบ่อยๆ แล้วนอนให้พอ เดี๋ยวก็แข็งแรงจ้ะ',
          'หมอฟังเสียงหัวใจด้วยเจ้านี่แหละ ตุบๆ ตุบๆ ฟังสนุกมากนะ'],
   quest:'มาให้คุณหมอตรวจร่างกายเล่นๆ ไหม'},
  {id:'npc-nurse', name:'พี่พยาบาล', icon:'💉', job:'villager', x:62, z:35, rot:0,
   roam:{x0:55, x1:65, z0:34, z1:36},
   look:{girl:true, skin:1, shirt:0xf7fbff, pants:0x9ad9f0, hair:1, hairC:0, hat:'nurse',
         prop:'tray', cross:true},
   lines:['เก่งมากจ้ะ ฉีดยาแป๊บเดียวเอง ไม่เจ็บเลยนะ',
          'กินยาให้ครบตามที่คุณหมอสั่งด้วยนะจ๊ะ'],
   quest:'มาช่วยพี่พยาบาลนับยาบนถาดไหมจ๊ะ'},
  {id:'npc-granny',  name:'คุณยาย',     icon:'👵', job:'villager', x:44, z:46, rot:0,
   look:{girl:true, skin:1, shirt:0xf0e4ff, pants:0x9a72d8, hair:3, hairC:4, hat:null, prop:null},
   lines:['น้ำพุกลางหมู่บ้านสวยเนอะ', 'ยายนั่งดูเด็กๆ วิ่งเล่นทุกวันเลยจ้ะ'],
   quest:'มาเล่าเรื่องหมู่บ้านให้ฟังไหมจ๊ะ'},
  {id:'npc-kid1',    name:'น้องแก้ม',    icon:'🧒', job:'kid', x:47, z:46, rot:0,
   look:{girl:true, skin:0, shirt:0xffd54f, pants:0xf28cae, hair:2, hairC:0, hat:null, prop:'ball', kid:true},
   lines:['มาวิ่งเล่นด้วยกันไหม!', 'เราชอบมาเล่นที่ลานน้ำพุที่สุดเลย'],
   quest:'มาแข่งเกมกับเราไหม'},
  {id:'npc-teacher', name:'ครูอ้อย',    icon:'🏫', job:'teacher', x:24, z:60, rot:0,
   roam:{x0:22, x1:27, z0:54, z1:62},                      /* เดินไปมาอยู่ในรั้วโรงเรียนเท่านั้น */
   look:{girl:true, skin:1, shirt:0xef5f5f, pants:0xf7f3ee, hair:3, hairC:0, hat:null, prop:'book', glasses:true},
   lines:['สวัสดีจ้ะ วันนี้มาเที่ยวโรงเรียนเหรอ', 'ตั้งใจเรียนนะ เดี๋ยวเก่งขึ้นเยอะเลย'],
   quest:'มาทำแบบฝึกหัดกับครูไหมจ๊ะ'},
  {id:'npc-farmer',  name:'ลุงชาวนา',   icon:'🌾', job:'farmer', x:23, z:23, rot:0,
   look:{skin:3, shirt:0xd8a24a, pants:0x6d4c41, hair:4, hairC:1, hat:'straw', prop:'hoe'},
   lines:['ข้าวในนาโตดีเลยปีนี้', 'ในโรงนามีวัวกับแกะด้วยนะ ไปดูได้เลย'],
   quest:'ช่วยลุงนับสัตว์ในคอกหน่อยได้ไหม'},
  {id:'npc-cowboy',  name:'พี่เลี้ยงวัว', icon:'🐄', job:'farmer', x:14, z:4, rot:0,
   look:{skin:2, shirt:0xc4573f, pants:0x4a6fa5, hair:0, hairC:1, hat:'cap', prop:'bucket'},
   lines:['วัวของพี่ชอบให้ลูบหัวนะ', 'ระวังนะ เดี๋ยวแกะจะเดินมาชนขา!'],
   quest:'ทายเสียงสัตว์ในฟาร์มกับพี่ไหม'},
  {id:'npc-fisher2', name:'ลุงชาวประมง', icon:'🐟', job:'fisher', x:52, z:26, rot:0,   /* ยืนหน้าบ้านตัวเอง (ล็อต fisher-home) */
   look:{skin:3, shirt:0x5aa9e6, pants:0x4a6fa5, hair:4, hairC:1, hat:'straw', prop:'fish'},
   lines:['วันนี้ได้ปลามาเยอะเลย ตากไว้ข้างหลังนั่นแหละ', 'เรือลุงจอดอยู่กลางทะเลโน่น เห็นไหม'],
   quest:'ช่วยลุงนับปลาบนราวตากหน่อยได้ไหม'},
  /* ลุงช่างไม้ + ป้ามะลิ (แฟนของลุง) อยู่กระท่อมช่างไม้ในป่าทิศเหนือ เดินเล่นรอบๆ บ้านตัวเอง
     กรอบ CARPENTER_ROAM = ห่างจากตัวกระท่อมได้ไกลสุด 7 ช่องทุกทิศ (ไม่เดินหลุดเข้าไปในเขตบ้านเด็ก) */
  {id:'npc-carpenter', name:'ลุงช่างไม้', icon:'🪚', job:'carpenter', lot:'carpenter-hut', side:1,
   roam:CARPENTER_ROAM,
   look:{skin:2, shirt:0xef8354, pants:0x8d6e63, hair:0, hairC:1, hat:'cap', prop:'saw'},
   lines:['ลุงกำลังเลื่อยไม้ทำเก้าอี้ตัวใหม่อยู่เลย', 'ไม้ในป่านี้หอมมากนะ เอามาทำของเล่นก็สวย'],
   quest:'มาช่วยลุงเรียงไม้ให้เป็นกองหน่อยได้ไหม'},
  {id:'npc-hut',     name:'ป้ามะลิ',    icon:'🪑', job:'villager', lot:'carpenter-hut', side:-1,
   roam:CARPENTER_ROAM,
   look:{girl:true, skin:1, shirt:0x6fbf73, pants:0x8d6e63, hair:1, hairC:2, hat:null, prop:'bucket'},
   lines:['ป้าเป็นแฟนของลุงช่างไม้จ้ะ อยู่กระท่อมไม้หลังนั้นเอง', 'ลุงเลื่อยไม้เสร็จ ป้าก็ทาสีให้สวยๆ ต่อจ้ะ'],
   quest:'มาช่วยป้าเลือกสีทาเก้าอี้ไหมจ๊ะ'},
  /* --- คนที่ชายหาด (ทรายที่เดินได้อยู่แถบ x42-56 / z15-21 นอกนั้นเป็นทะเล) ---
     พี่ชายหาดเดิมยืนนิ่งจุดเดียว ใส่ `roam` ให้เดินเล่นตามหาดแล้วเมื่อ 2026-08-03 ตามคำขอผู้ใช้
     พร้อมเพิ่มเพื่อนอีก 3 คน (เด็กก่อกองทราย / คนเล่นน้ำ / ป้าเก็บเปลือกหอย) หาดจะได้ไม่โล่งเหงา */
  /* --- กลุ่มคนตั้งแคมป์กลางป่าทิศเหนือ (ดูผังลานที่ CAMP/CAMP_TENTS) ---
     2 คนเดินวนอยู่ในลานแคมป์ของตัวเอง ไม่เดินหลุดเข้าไปในเขตบ้านเด็ก
     กรอบ roam กว้างกว่ากรอบลานนิดหน่อย ให้เดินเข้าป่ารอบๆ ได้บ้าง แต่ยังอยู่แถวแคมป์ */
  {id:'npc-camp1', name:'พี่หัวหน้าแคมป์', icon:'⛺', job:'villager', x:10, z:28, rot:0,
   roam:{x0:5, x1:10, z0:27, z1:31},
   look:{skin:2, shirt:0x6fbf73, pants:0x6d4c41, hair:0, hairC:1, hat:'straw', prop:'box'},
   lines:['กางเต็นท์ริมบ่อน้ำสนุกมากเลยนะ กลางคืนเห็นดาวสะท้อนบนผิวน้ำด้วย',
          'ก่อไฟต้องมีผู้ใหญ่อยู่ด้วยเสมอนะ แล้วต้องดับให้สนิทก่อนนอน',
          'เดินป่าอย่าเดินคนเดียวนะ ไปเป็นกลุ่มปลอดภัยกว่า'],
   quest:'มาช่วยพี่นับเต็นท์ในแคมป์ไหม'},
  /* (npc-camp2 "ป้าแม่ครัวแคมป์" 🍲 เอาออกแล้วเมื่อ 2026-08-09 ตามคำขอผู้ใช้ — พร้อมกับของในลานแคมป์
     ที่ถูกเอาออกไปด้วย แคมป์เหลือ 2 คน: พี่หัวหน้าแคมป์ + น้องลูกเสือ) */
  {id:'npc-camp3', name:'น้องลูกเสือ', icon:'🔥', job:'kid', x:6, z:29, rot:0,
   roam:{x0:5, x1:10, z0:27, z1:31},
   look:{skin:0, shirt:0xffd54f, pants:0x6fbf73, hair:0, hairC:0, hat:'beanie', hatC:0xe4574a,
         prop:'marsh', kid:true},
   lines:['เราปิ้งมาร์ชแมลโลว์อยู่! ไหม้นิดหน่อยแต่อร่อยมาก',
          'เมื่อคืนได้ยินเสียงนกเค้าแมวร้องด้วยนะ', 'คืนนี้จะนอนเต็นท์หลังสีฟ้า!'],
   quest:'มาปิ้งมาร์ชแมลโลว์กับเราไหม'},
  {id:'npc-beach',   name:'พี่ชายหาด',  icon:'🏖️', job:'villager', x:45, z:17, rot:0,
   roam:{x0:30, x1:52, z0:9,  z1:21},        /* ถึงหาดเหนือสุดที่ติดหัวสะพาน (x30-33 / z9-13) ตามคำขอผู้ใช้ */
   look:{skin:2, shirt:0x7fc4e8, pants:0xffd54f, hair:0, hairC:0, hat:'cap', prop:'ball'},
   lines:['ทะเลวันนี้ใสมากเลย!', 'นั่งเก้าอี้ผ้าใบใต้ร่มก็สบายนะ ลองดูสิ'],
   quest:'มาเก็บเปลือกหอยแข่งกันไหม'},
  {id:'npc-beach-kid', name:'น้องทราย', icon:'🏰', job:'kid', x:47, z:17, rot:0,
   roam:{x0:32, x1:50, z0:10, z1:20},
   look:{skin:0, shirt:0xffd54f, pants:0xef8354, hair:2, hairC:0, hat:null, prop:'bucket', kid:true},
   lines:['เรากำลังก่อปราสาททรายอยู่เลย มาช่วยกันไหม!', 'คลื่นซัดปราสาททรายพังอีกแล้ว ต้องก่อใหม่!'],
   quest:'มาช่วยกันก่อปราสาททรายไหม'},
  {id:'npc-beach-swim', name:'พี่ห่วงยาง', icon:'🛟', job:'villager', x:54, z:19, rot:0,
   roam:{x0:52, x1:58, z0:18, z1:21},
   look:{skin:1, shirt:0x8fd694, pants:0x7fc4e8, hair:0, hairC:0, hat:null, prop:'ring'},
   lines:['น้ำทะเลอุ่นกำลังดีเลย ลงมาเล่นด้วยกันไหม', 'ลงน้ำต้องใส่ห่วงยางนะ แล้วอย่าออกไปไกลฝั่ง'],
   quest:'มาทายว่าคลื่นซัดเข้าฝั่งกี่ลูกไหม'},
  {id:'npc-beach-shell', name:'ป้าเปลือกหอย', icon:'🐚', job:'villager', x:43, z:20, rot:0,
   roam:{x0:30, x1:46, z0:9,  z1:21},
   look:{girl:true, skin:3, shirt:0xff8fb3, pants:0xfff3e0, hair:3, hairC:4, hat:'straw', prop:'basket'},
   lines:['ป้าเดินเก็บเปลือกหอยสวยๆ ทุกเช้าเลยจ้ะ', 'เปลือกหอยใบนี้เอาไปแนบหูฟังสิ ได้ยินเสียงคลื่นด้วยนะ'],
   quest:'มาช่วยป้านับเปลือกหอยในตะกร้าไหมจ๊ะ'},
  /* ลูกชาวประมง — เดินเล่นระหว่างหน้าบ้านตัวเอง (ล็อต fisher-home) กับชายหาดหน้าบ้าน
     กรอบครอบคอลัมน์ x48 ที่เป็นทางเดินเชื่อมหาดกับหน้าบ้านพอดี จึงเดินไปมาได้จริงทั้ง 2 ฝั่ง */
  {id:'npc-fisher-kid', name:'น้องเกล็ดปลา', icon:'🐠', job:'kid', x:50, z:26, rot:0,
   roam:{x0:46, x1:54, z0:17, z1:26},
   look:{skin:2, shirt:0x5aa9e6, pants:0xf7f3ee, hair:0, hairC:1, hat:'cap', prop:'bucket', kid:true},
   lines:['พ่อเราเป็นชาวประมงนะ เรือลำโน้นของพ่อเอง!', 'เราช่วยพ่อตากปลาทุกวันเลย',
          'วิ่งเล่นบนหาดหน้าบ้านสนุกที่สุดเลย'],
   quest:'มาช่วยเรานับปลาในถังไหม'},
  {id:'npc-music',   name:'พี่นักดนตรี', icon:'🎸', job:'villager', x:34, z:23, rot:0,
   look:{skin:0, shirt:0xb388ff, pants:0x4a6fa5, hair:2, hairC:0, hat:'cap', prop:'guitar'},
   lines:['เดี๋ยวพี่จะขึ้นเวทีเล่นเพลงแล้วนะ', 'ชอบเพลงแบบไหนจ๊ะ สนุกๆ หรือเบาๆ'],
   quest:'มาเล่นโน้ตดนตรีตามพี่ไหม'},
  /* --- เด็กๆ ที่สนามเด็กเล่นกลางเมือง (วิ่งเล่นอยู่ในสนามเท่านั้น) --- */
  {id:'npc-play1', name:'น้องมิ้นท์', icon:'🧒', job:'kid', x:58, z:40, rot:0,
   roam:{x0:56, x1:65, z0:38, z1:44},          /* วิ่งเล่นในรั้วสนามเท่านั้น */
   look:{girl:true, skin:0, shirt:0x7fc4e8, pants:0xffd54f, hair:2, hairC:0, hat:null, prop:'ball', kid:true},
   lines:['สนามเด็กเล่นใหม่สนุกมากเลย!', 'ชิงช้ากับม้าหมุนเล่นได้ด้วยนะ ลองสิ'],
   quest:'มาแข่งเล่นเครื่องเล่นให้ครบทุกอันไหม'},
  {id:'npc-play2', name:'น้องข้าวปั้น', icon:'🧒', job:'kid', x:61, z:40, rot:0,
   roam:{x0:56, x1:65, z0:38, z1:44},
   look:{skin:2, shirt:0xef8354, pants:0x6fbf73, hair:0, hairC:1, hat:'cap', prop:null, kid:true},
   lines:['เราชอบเล่นบ่อทรายที่สุดเลย', 'กระดานหกต้องเล่นสองคนถึงจะสนุกนะ'],
   quest:'มาต่อปราสาททรายด้วยกันไหม'},
  /* --- ชาวบ้านที่เดินไปมา (ไม่บล็อกช่อง) ให้หมู่บ้านดูคึกคัก --- */
  {id:'npc-walk1', name:'พี่นักวิ่ง', icon:'🏃', job:'villager', x:48, z:35, rot:0,
   roam:{town:true},                                      /* เดินได้ทั่วเมือง */
   look:{skin:1, shirt:0xffd54f, pants:0xe36f5c, hair:0, hairC:0, hat:null, prop:null},
   lines:['วิ่งออกกำลังกายทุกเช้าเลย!', 'ถนนเส้นนี้ไปถึงชายหาดได้นะ']},
  {id:'npc-walk2', name:'น้องบีม',   icon:'🧒', job:'kid', x:44, z:47, rot:0,
   roam:{town:true},                                      /* เดินได้ทั่วเมือง */
   look:{skin:0, shirt:0x6fbf73, pants:0x5aa9e6, hair:0, hairC:1, hat:null, prop:'balloon', kid:true},
   lines:['ลูกโป่งของเราสวยไหม!', 'เดี๋ยวเราจะไปเล่นที่ลานน้ำพุ ไปด้วยกันไหม']},
  {id:'npc-walk3', name:'ลุงเดินเล่น', icon:'🚶', job:'villager', x:37, z:26, rot:0,
   roam:{town:true},                                      /* เดินได้ทั่วเมือง */
   look:{skin:3, shirt:0x7f9fd6, pants:0x6d4c41, hair:4, hairC:1, hat:'straw', prop:null},
   lines:['ลานนี้ลมเย็นสบายจริงๆ', 'เดินเล่นตอนเย็นดีต่อสุขภาพนะ']},
  {id:'npc-walk4', name:'พี่ส่งของ', icon:'📦', job:'villager', x:16, z:57, rot:0,
   roam:{town:true},                                      /* เดินได้ทั่วเมือง */
   look:{skin:2, shirt:0xef8354, pants:0x4a6fa5, hair:0, hairC:0, hat:'cap', prop:'box'},
   lines:['พี่กำลังไปส่งของที่ร้านนมพอดี', 'หมู่บ้านนี้คนใจดีทุกคนเลยนะ']},
  /* --- ตำรวจชุมชน: คนหนึ่งเดินตรวจทั่วเมือง อีกคนเดินตรวจรอบจัตุรัสน้ำพุกลางเมือง --- */
  {id:'npc-police-town', name:'คุณตำรวจใจดี', icon:'👮', job:'villager', x:54, z:45, rot:0,
   roam:{town:true},                                      /* เดินตรวจความเรียบร้อยทั่วเมือง */
   look:{skin:1, shirt:0x4a6fa5, pants:0x2f3f66, hair:0, hairC:0, hat:'police', prop:null},
   lines:['สวัสดีจ้ะ ข้ามถนนดูรถให้ดีๆ นะ', 'ถ้าหลงทางเมื่อไหร่ มาบอกคุณตำรวจได้เลย'],
   quest:'มาช่วยคุณตำรวจดูแลชุมชนให้ปลอดภัยไหม'},
  /* ย้ายมาเดินตรวจรอบจัตุรัสน้ำพุกลางเมือง (กรอบเดียวกับ PLAZA_YARD) — เริ่มยืนบนลานหินกลางจัตุรัส
     ทุ่งดอกไม้รอบลานเดินไม่ได้แล้ว เขาจึงเดินวนอยู่บนลานหิน/ทางเข้าซุ้มรอบน้ำพุ */
  {id:'npc-police-station', name:'คุณตำรวจหมี', icon:'🚨', job:'villager', x:44, z:47, rot:0,
   roam:{x0:39, x1:52, z0:37, z1:51},
   look:{skin:2, shirt:0x4a6fa5, pants:0x2f3f66, hair:4, hairC:1, hat:'police', prop:null},
   lines:['พี่เดินตรวจรอบจัตุรัสน้ำพุอยู่จ้ะ', 'มีอะไรไม่สบายใจ มาเล่าให้พี่ตำรวจฟังได้เลย'],
   quest:'อยากเดินตรวจรอบจัตุรัสกับพี่ไหม'},
  /* --- คนเดินทางไกล: เดินตามเส้นทางจริงจากที่หนึ่งไปอีกที่หนึ่งทั่วเมือง (route = จุดแวะเรียงลำดับ วนซ้ำ)
         หาเส้นทางด้วย findPath เดียวกับตัวเด็ก จึงเลี้ยวตามถนน ไม่เดินทะลุบ้าน/ต้นไม้ --- */
  {id:'npc-post', name:'พี่ไปรษณีย์', icon:'📮', job:'villager',
   route:[[45,40],[37,35],[37,52],[53,52],[53,35]],
   look:{skin:1, shirt:0x5aa9e6, pants:0x4a6fa5, hair:0, hairC:0, hat:'cap', prop:'box'},
   lines:['พี่เดินส่งจดหมายรอบหมู่บ้านทุกวันเลย', 'ถ้าอยากส่งจดหมายหาใคร บอกพี่ได้นะ']},
  {id:'npc-student', name:'น้องปอ', icon:'🎒', job:'kid',
   route:[[25,63],[21,60],[21,57],[7,57],[7,62]],   /* แวะหน้าประตูโรงเรียนก่อนวนกลับเข้าหมู่บ้าน */
   look:{skin:0, shirt:0xf7f3ee, pants:0x4a6fa5, hair:1, hairC:0, hat:null, prop:'book', kid:true},
   lines:['เรากำลังเดินไปโรงเรียนพอดีเลย', 'วันนี้ครูจะสอนอ่านคำใหม่ด้วยนะ']},
  {id:'npc-shopper', name:'ป้าจ่ายตลาด', icon:'🧺', job:'villager',
   route:[[44,48],[42,45],[49,45],[47,48]],
   look:{girl:true, skin:2, shirt:0xffc857, pants:0xe36f5c, hair:3, hairC:2, hat:null, prop:'basket'},
   lines:['ป้ามาซื้อของที่ตลาดกลางหมู่บ้านจ้า', 'ตะกร้าป้าหนักจัง ช่วยป้าถือหน่อยได้ไหม']},
  {id:'npc-dogwalk', name:'ลุงพาหมาเดิน', icon:'🐕', job:'villager',
   route:[[38,30],[38,45],[44,42]],
   look:{skin:3, shirt:0x6fbf73, pants:0x6d4c41, hair:4, hairC:4, hat:'straw', prop:null},
   lines:['เจ้าด่างชอบเดินเส้นนี้ที่สุดเลย', 'พาหมาเดินเล่นทุกเย็น สนุกดีนะ']},
  {id:'npc-traveler', name:'พี่นักเดินทาง', icon:'🧭', job:'villager',
   route:[[19,50],[24,53],[30,36],[37,36]],
   look:{skin:1, shirt:0xef8354, pants:0x8d6e63, hair:2, hairC:1, hat:'cap', prop:'bottle'},
   lines:['พี่เดินข้ามสะพานมาจากฝั่งป่าโน่นเลย', 'เดินไปเรื่อยๆ เดี๋ยวก็ถึงชายหาดนะ']},
  {id:'npc-play', name:'น้องเปรี้ยว', icon:'⚽', job:'kid',
   route:[[34,21],[34,26],[37,26],[37,22]],
   look:{skin:2, shirt:0xef5f5f, pants:0xffd54f, hair:1, hairC:1, hat:null, prop:'ball', kid:true},
   lines:['มาเตะบอลที่ลานกิจกรรมกันไหม!', 'วิ่งเล่นตรงนี้สนุกที่สุดเลย']},
  {id:'npc-farmgo', name:'ป้าตะกร้าผัก', icon:'🥬', job:'farmer',
   route:[[20,20],[20,26],[24,30]],
   look:{girl:true, skin:3, shirt:0x6fbf73, pants:0x8d6e63, hair:2, hairC:3, hat:'straw', prop:'basket'},
   lines:['ป้าเก็บผักจากไร่ไปขายที่ตลาดจ้า', 'ผักสดๆ ต้องเก็บตอนเช้านะ']},

  /* --- มาสคอตนกฮูกของแอป (หน้าตาตามโลโก้ Owlkids) --- 
     roam:{map:true} = เดินได้ทุกช่องที่เดินได้จริงทั้งแผนที่ ไม่จำกัดแค่ถนน/ลานเหมือนชาวบ้าน
     จึงโผล่ได้ทั้งในสวนหน้าบ้าน ป่า ฟาร์ม ชายหาด และลานน้ำพุ
     เกิดกลางเมือง (ลานน้ำพุ) — ช่องว่างข้างน้ำพุที่ไม่ชนเสาไฟมุมลานและที่ยืนของชาวบ้าน
     ไม่มี look (ไม่ได้ใช้โมเดลคน) — js/house.js สร้างด้วย buildOwlMascot() ตาม mascot:true
     แตะแล้วพูดคำให้กำลังใจจาก OWL_MSGS.cheer ชุดเดียวกับนกฮูกหน้าหลัก */
  /* --- ลุงตกปลาที่ท่าไม้ริมบ่อ: เดิมเป็นของฉากตายตัว (แตะไม่ได้) ย้ายมาเป็น NPC เต็มตัวให้เด็กคุยด้วยได้
     y = ความสูงพื้นท่าไม้ · faceRad = หันหน้าเข้าหากลางบ่อ (คำนวณจากพิกัดจริง ไม่ fix ทิศ) --- */
  {id:'npc-fisher', name:'ลุงตกปลา', icon:'🎣', job:'villager', fisher:true,
   x:FISHER_TILE.x, z:FISHER_TILE.z, y:.21,
   faceRad: Math.atan2(POND.cx - FISHER_TILE.x, POND.cz - FISHER_TILE.z),
   lines:['วันนี้ปลาชุมเลยนะ นั่งเป็นเพื่อนลุงไหม',
          'ตกปลาต้องใจเย็นๆ นะหนู รอให้ทุ่นขยับก่อน',
          'เมื่อเช้าลุงได้ปลาตัวใหญ่มากเลยล่ะ'],
   quest:'ช่วยลุงนับเป็ดในบ่อหน่อยได้ไหม'},
  {id:'owl-mascot', name:'นกฮูกน้อย', icon:'🦉', job:'mascot', mascot:true,
   x:FOUNTAIN.x1 + 1, z:FOUNTAIN.z0 - 1, rot:2, roam:{map:true},
   lines:['ฮู้ๆ! มาเดินเล่นด้วยกันไหม']}
];
/* หน้าตาชาวบ้าน: เติมรายละเอียดที่ไม่ได้ระบุใน NPC_DEFS ด้วยค่าสุ่ม "คงที่ต่อคน" (แฮชจาก id)
   → ทุกคนหน้าไม่เหมือนกัน (ตา/ปาก/คิ้ว/จมูก/กระ/เครา) แต่คนเดิมหน้าเดิมทุกครั้งที่เข้าเกม */
function npcHash(s){
  let h = 2166136261;
  for(let i=0; i<s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function npcFaceVariety(id, look){
  const lk = Object.assign({}, look), h = npcHash(id);
  if(lk.eyes == null)    lk.eyes = h % H_EYE_N;
  if(lk.face == null)    lk.face = (h >>> 3) % 6;            /* แบบปาก */
  if(lk.brow == null)    lk.brow = (h >>> 6) % 4;            /* คิ้ว: ไม่มี/ตรง/ยก/หนา */
  if(lk.nose == null)    lk.nose = (h >>> 9) % 3;
  if(lk.freckle == null) lk.freckle = ((h >>> 12) % 4) === 0;
  if(lk.beard == null)   lk.beard = (!lk.girl && !lk.kid && ((h >>> 14) % 3) === 0) ? ((h >>> 16) % 2) + 1 : 0;
  return lk;
}
/* กรอบเดินของเจ้าของฟาร์ม — เดินวนอยู่ในเขตฟาร์ม/คอกสัตว์ของตัวเอง (ช่องที่ติดของจะถูกกรองทีหลัง) */
const FARM_ROAM = {
  'npc-farmer': {x0:21, x1:26, z0:23, z1:27},
  'npc-cowboy': {x0:12, x1:18, z0:4,  z1:8},
};
/* คิดช่องยืนจริงของแต่ละคน (พ่อค้าแม่ค้า = ข้างประตูร้านของตัวเอง) */
const NPCS = NPC_DEFS.map(d=>{
  const n = Object.assign({}, d);
  if(n.lot && n.side != null){
    const dt = lotDoorTile(LOT_BY_ID[n.lot]);
    n.x = dt.x + n.side; n.z = dt.z;
  }
  if(n.route){ n.x = n.route[0][0]; n.z = n.route[0][1]; }   /* คนเดินทางไกล เริ่มที่จุดแวะแรก */
  if(n.rot == null) n.rot = 0;
  n.look = npcFaceVariety(n.id, n.look || {});
  /* พ่อค้าแม่ค้าเดินไปมาแถวหน้าร้านตัวเอง / เจ้าของฟาร์มเดินอยู่ในฟาร์ม (nearShop = ไม่เดินลงถนน)
     ยกเว้นคนที่ติดธง `stand:true` = ยืนติดรถเข็น/แผงของตัวเองตลอด ไม่เดินไปไหนเลย (คำขอผู้ใช้: แม่ค้าตลาดรถเข็น)
     คนกลุ่มนี้จะเข้าเงื่อนไข NPC_TILES ด้านล่างด้วย = บล็อกช่องที่ยืน เด็กเดินทะลุตัวไม่ได้ */
  if(!n.roam && !n.route && !n.stand && (n.job === 'vendor' || n.job === 'farmer'))
    n.roam = FARM_ROAM[n.id] || {x0:n.x-2, x1:n.x+2, z0:n.z-1, z1:n.z+1, nearShop:true};
  return n;
});
/* คนที่เดินไปมา (roam/route) ไม่จองช่องยืนใน grid — ไม่งั้นจะบล็อกทางเดินของตัวเองและของเด็ก */
const NPC_TILES = NPCS.filter(n => !n.roam && !n.route).map(n => [n.x, n.z]);
/* ช่องประจำตัวของทุกคนที่ไม่ได้เดินทางไกล — ใช้กันของฉาก (ต้นไม้/ป้าย) มาตั้งทับจุดยืน
   ถึงคนกลุ่ม roam จะไม่บล็อกช่อง แต่ก็ไม่ควรมีต้นไม้งอกกลางร้าน/กลางฟาร์มที่เขาเดินอยู่ */
const NPC_STAND = NPCS.filter(n => !n.route).map(n => [n.x, n.z]);
/* กระดานภารกิจประจำวัน — ตั้งข้างน้ำพุกลางหมู่บ้าน (บล็อกช่องตัวเอง) */
const QUEST_BOARD = {x:45, z:48, rot:0, w:2};   /* กระดานกว้าง ~2 ช่อง จองช่อง x45-46 (ตัวกระดานวางกึ่งกลางระหว่างสองช่อง) */

function isQuestBoardTile(x, z){
  return z===QUEST_BOARD.z && x>=QUEST_BOARD.x && x<QUEST_BOARD.x + (QUEST_BOARD.w||1);
}
/* ---------- เสาไฟริมทาง (พิกัดจัดวางเองทั้งหมด) ----------
   เสาไฟบล็อกช่องของตัวเองเหมือนม้านั่ง จึงต้องเลือกช่องที่ปิดแล้วไม่ตัดทางเดิน (เช็คด้วย check-map.js)
   4 ต้นแรก = 4 มุมลานน้ำพุ ที่เหลือ = ไล่ไปตามถนน/ทางเดินทั่วเมือง */
const LAMP_FIXED = [[42,40],[49,40],[42,48],[49,48]];
const LAMP_SPOTS = LAMP_FIXED.concat([
  [55,61],[55,51],[45,54],[36,54],[36,63],[30,51],[36,48],[36,40],[30,34],
  [36,32],[46,34],[55,34],[65,34],[52,27],[41,28],[41,19],[31,17],[27,10],[18,25],
  [18,16],[18,8],[21,46],[18,53],[27,65],[13,65],[5,62],[1,65],
  /* (เดิม [5,56] ย้ายมา [4,53] เมื่อ 2026-08-09 ตามคำขอผู้ใช้ — มายืนตรงช่องทางเดินคั่นระหว่าง
     แฟชั่นมอลล์ (z44-52) กับเฟอร์นิเจอร์มอลล์ (z54-62) พอดี เป็นหมุดบอกรอยต่อของห้าง 2 หลัง) */
  [4,53],
  /* (เดิม [19,54] ย้ายมาเป็น [18,53] และ [13,56] เอาออก — ทั้งคู่เคยตั้งอยู่กลางแถบ x8-19/z54-56
     ที่ตอนนี้เปิดเป็นลานทางเดินหน้าตึกแล็บแล้ว)
     (เดิม [19,62] เอาออกเมื่อ 2026-08-03 ตามคำขอผู้ใช้ "เอาเสาไฟในตลาดออก" — เป็นต้นเดียวที่ยืนอยู่
     ในกรอบ MARKET แล้วบังแถวรถเข็นหน้าสุด ⇒ ห้ามวางเสาไฟในกรอบ x8-19/z56-62 อีก เสาไฟรอบตลาด
     ใช้ [18,53] / [13,65] / [5,62] / [4,53] ที่อยู่นอกกรอบล้อมไว้ให้แล้ว) */
  [55,43],[18,1],[66,51],   /* 66,51 = เดิมอยู่ที่ 65,51 ขยับออกข้างถนนแยกใหม่ x64-65 */
  [11,46],                  /* ริมทางเดินใหม่ x11-18/z44-45 (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้) */
  /* 2 ต้นขนาบแนวรั้วบ้านด้านใต้ (แถว z39) — คั่นระหว่างช่วงพุ่มไม้กับช่องทางเดินออกจากบ้าน x19-20
     ⚠ ห้ามวางเสาไฟ/พุ่มทับ x19-20/z39 เด็ดขาด เป็นทางเดินออกจากช่องรั้วใต้ทางเดียวของบ้าน */
  [25,39], [18,39],
]);
const LAMP_SET = new Set(LAMP_SPOTS.map(p => p[0] + ',' + p[1]));
function isLampTile(x, z){ return LAMP_SET.has(x + ',' + z); }
/* ---------- แนวพุ่มไม้ตีขอบเมือง ----------
   พุ่มเตี้ยเรียงติดกันเป็นแนว (ริมแม่น้ำ/ขอบโซน) บล็อกช่องตัวเอง เดินทะลุไม่ได้
   เว้นช่วงหัวสะพาน/ถนนไว้เสมอ ไม่งั้นจะปิดทางเดินข้ามโซน */
const HEDGE_LINES = [
  /* แนวพุ่มไม้จัดสวน (เพิ่มเมื่อ 2026-08-03 ตามคำขอผู้ใช้) — buildHedgeBush มีดอกไม้เล็กแซมให้เองแล้ว
     ราว 1 ใน 4 พุ่ม (สูตร (x*5+z*3)%4) แนวพวกนี้จึงมีพุ่มมีดอกกระจายอยู่ในแถวเองโดยไม่ต้องระบุทีละพุ่ม */
  {x0:27, x1:27, z0:42, z1:51},   /* ตีขอบทุ่งโล่งฝั่งริมคลอง (กินช่อง 27,47 ที่เคยเป็นต้นสน กับ 27,48 ที่เคยเป็นพุ่มเล็ก)
                                     ⚠ ยืดขึ้นเหนือถึง z42 เมื่อ 2026-08-09 (เดิมเริ่ม z46) — ช่อง 27,42 เป็นหัวมุม
                                     ต่อกับทางเดินใหม่ x19-27/z40-41 (ดู HOME_TRAIL) ผู้ใช้สั่งถอนต้นไม้เดิมออก
                                     แล้วให้เป็น "พุ่มไม้" แทน จึงให้แนวนี้กินช่องนั้นไว้ */
  /* แนวพุ่มไม้ตีขอบรั้วบ้านด้านใต้ (แถว z39) — เว้น x18/x25 ไว้ให้เสาไฟ และเว้น x19-20 ไว้เป็นช่องทางเดิน
     ออกจากช่องรั้วใต้ (เพิ่ม 2026-08-09 ตามคำขอผู้ใช้) */
  {x0:13, x1:17, z0:39, z1:39},
  {x0:21, x1:24, z0:39, z1:39},
  /* (แนวพุ่ม x18/z46-52 "ตีขอบทุ่งโล่งฝั่งตึกแล็บ" เอาออกแล้วเมื่อ 2026-08-09 ตามคำขอผู้ใช้
     — ทุ่งโล่งข้างตึกแล็บกลับมาเป็นทุ่งหญ้าเปิดโล่งเหมือนเดิม) */
  {x0:45, x1:45, z0:55, z1:58},   /* คั่นระหว่างตัวโรงแรมกับลานสระว่ายน้ำ (ทางเข้าสระยังเดินอ้อมทาง x46 ที่ z54 ได้) */
  {x0:30, x1:30, z0:54, z1:67}, {x0:30, x1:30, z0:37, z1:50},
  {x0:30, x1:30, z0:29, z1:33}, {x0:30, x1:30, z0:14, z1:17},
  {x0:31, x1:35, z0:29, z1:29}, {x0:31, x1:35, z0:18, z1:18},
  {x0:27, x1:27, z0:5,  z1:9},  {x0:27, x1:27, z0:13, z1:16},
  {x0:27, x1:27, z0:19, z1:24}, {x0:27, x1:27, z0:66, z1:67},   /* ⚠ ท่อนแรกเดิมจบ z25 — หดเหลือ z24
                                     เมื่อ 2026-08-09 เพราะช่อง 27,25 กลายเป็นทางเดินรอบบ้านแล้ว (HOME_TRAIL) */
];
const HEDGE_SET = new Set();
HEDGE_LINES.forEach(r=>{ for(let z=r.z0; z<=r.z1; z++) for(let x=r.x0; x<=r.x1; x++) HEDGE_SET.add(x + ',' + z); });
const HEDGE_TILES = Array.from(HEDGE_SET).map(k => k.split(',').map(Number));
function isHedgeTile(x, z){ return HEDGE_SET.has(x + ',' + z); }

return {
  H_SKIN, H_HAIR_COLORS, H_EYE_COLORS, H_SHIRT_COLORS, H_BOTTOM_COLORS, H_SHOE_COLORS, H_ACC_COLORS,
  H_PATTERN_N, H_HAT_N, H_GLASS_N, H_BAG_N, H_HOLD_N,
  H_HAIR_N, H_EYE_N, H_DEFAULT_CHAR, H_DEFAULT_PARENT_DAD, H_DEFAULT_PARENT_MOM, H_ROWS, H_ROW_ICONS, NPAD,
  outfitIcon,   /* เฟส 8C: ไอคอนของแต่ละแบบในหน้าแต่งตัว — อยู่ใน IIFE ของไฟล์นี้ ต้องส่งออกทางนี้เท่านั้น */
  EPAD, EPAD2, EPAD_ALL, OUT_W, OUT_D, sx,
  sz, sRect, sTile, sList, s2z, s2Rect,
  s2Tile, s2List, RIVER_X, BRIDGE_Z, BRIDGE2_Z, FARM_BRIDGE_Z,
  BRIDGES, HOUSE_FOOT, DOOR_TILE, SPAWN_TILE, TREES, FLOWERS,
  YARD, GATE_TILE, GATE_TILES, PET_HOUSE_TILE, HOUSE_VIEW, HOME_ZONE, HOME_EDGE_Z,
  HOME_EXIT_X, VILLAGE_X0, VILLAGE_ROADS, VILLAGE2_ROADS, PLAZA, FOUNTAIN,
  VILLAGE_LOTS, LOT_BY_ID, WILD_GROVES, WILD_BUSHES, WILD_MUSHROOMS, POND,
  CANAL_Z, CANAL_X0, CANAL_X1, CANAL_BRIDGE_X, FARM_PLOTS, FARM_TRAIL,
  SEA_X0, SEA_SLOPE, SEA_MAX_Z, SEA_BASE_Z, BEACH_W, PALM_SPOTS,
  BOAT_SPOTS, BEACH_RACKS, FISH_RACKS, ANIMAL_PENS, FARM_ANIMALS, FARM_PROPS, FIXED_PLANTS,
  SHOP_PETS, PET_PEN_PROPS, FOOD_SIGN, POT_SPOTS,
  PLAYGROUND, PLAY_SIGN, PLAY_GATE, PLAY_ITEMS, inPlayground, isPlayItemTile, isPlayFenceTile,
  POND_DUCKS, POND_PIER, POND_PIERS, SEA_SPITS, isSeaSpitTile, SEA_DECKS, isSeaDeckTile,
  seaPierZ0, isPierTile, isWaterDeckTile, POND_FISH_SPOTS, seaFishSpots,
  FISHER_TILE, PLAZA2, STAGE, BANNER_POLES,
  BENCH_SPOTS, CART_SPOTS, SCHOOL_BOX, SCHOOL_LOT, SCHOOL_GATE, SCHOOL_FLAG,
  MARKET, inMarket, MARKET_SIGNS, MARKET_BUNTING,
  CARPENTER_PROPS, CARPENTER_YARD, CARPENTER_ROAM, CAMP, CAMP_TENTS, CAMP_FIRE, CAMP_PROPS,
  FLOWER_BEDS, FLOWER_FIELD, FLOWER_FIELD_PATH,
  SUNFLOWER_FIELDS,
  FIELD_ROW_COLORS, FLOWER_MEADOW, FLOWER_WEST, FOOD_DECK, FOOD_FLOWER_COL, MEADOW_TRAILS, POOL, POOL_DECK, POOL_PROPS,
  PLAZA_YARD, PLAZA_GATES, NPC_DEFS, FARM_ROAM, NPCS, NPC_TILES,
  NPC_STAND, QUEST_BOARD, LAMP_FIXED, LAMP_SPOTS, LAMP_SET, HEDGE_LINES,
  HEDGE_SET, HEDGE_TILES, isBridgeZ, isFenceTile, inHomeZone, clampHomeTile,
  lotDoorTile, isPondTile, isCanalTile, isCanalBridgeTile, farmPlotAt, isCropTile,
  seaEdgeZ, isSeaTile, isSandTile, isWetSandTile, penAt, isPenFenceTile,
  isPenSoilTile, inSchoolYard, isSchoolFenceTile, inMeadowTrail, inPool, inPoolDeck,
  inPlazaYard, inPlazaGate, inFlowerBed, npcHash, npcFaceVariety, isQuestBoardTile,
  isLampTile, isHedgeTile,
};
};
})();
