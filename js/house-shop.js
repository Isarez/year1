/* ============================================================
   บ้านของหนู — ร้านค้า/ระบบเศรษฐกิจ (เฟส 1 ของแผนแม่บท QUEST-DESIGN.md)

   ไฟล์นี้ประกาศ global HOUSE_SHOP(kit) คืน API ให้ js/house.js เรียกใช้
   (โหลดหลัง house-furniture.js ก่อน house.js — ไม่แตะ THREE/WebGL เลย
    แตะแค่ DOM ของหน้าร้านกับ localStorage ผ่าน kit.load/kit.save ที่ house.js ส่งมาให้)

   หน้าที่ 4 อย่าง:
     1) ตารางราคา — เฟอร์นิเจอร์ 116 ชิ้น 4 ระดับ (25/60/140/300) + ชุดแต่งตัว
     2) คลังของที่ซื้อแล้ว (`data.unlocked` เก็บใน house save ก้อนเดิม → export/import ตามไปเอง)
     3) migration `econVer` — ของที่เด็กวางไว้/ใส่อยู่แล้ว **ต้องนับว่าซื้อแล้วทุกชิ้น ห้ามหาย**
     4) หน้าร้าน (overlay bottom-sheet สไตล์เดียวกับกล่องเลือกเฟอร์นิเจอร์)

   ⚠ กติกาเหล็กจาก QUEST-DESIGN.md ที่ผูกกับไฟล์นี้:
     - เงินต้องผ่าน `window.OwlCoins` เท่านั้น ห้ามเขียน `progress.coins` ตรงๆ
     - ของที่ซื้อไม่ไหวยัง **โชว์ให้เห็น** (สีจาง + ป้ายราคา) ไม่ซ่อน — ให้เด็กเห็นเป้าหมาย
     - ห้ามลงโทษเด็ก: ซื้อแล้วเป็นของถาวร ลบทิ้งจากบ้านก็ยังมีสิทธิ์วางใหม่ฟรีเสมอ
   ============================================================ */
(function(){
  'use strict';

  /* ---------- ราคาเฟอร์นิเจอร์: ระดับ 1-4 ต่อ id ----------
     1 จิ๋ว 25 (กระถาง/ตุ๊กตา/พรม/ป้าย) · 2 เล็ก 60 (เก้าอี้/โต๊ะเล็ก/ชั้นวาง)
     3 กลาง 140 (โซฟา/เตียง/ตู้เย็น/ชิงช้า) · 4 ใหญ่-พิเศษ 300 (สระ/บ้านต้นไม้/ไฟประดับ)
     ชิ้นไหนไม่มีในตาราง = ระดับ 2 (กันลืมตอนเพิ่มของใหม่ในเฟส 8 แล้วราคาหาย) */
  const TIER_PRICE = [0, 25, 60, 140, 300];
  const FURN_TIER = {
    /* ---- ห้องน้ำ ---- */
    'bath-mat':1, 'kids-potty':1, 'towel-rack':1,
    'bath-cabinet':2, 'bath-sink':2, 'shower':2, 'toilet':2,
    'bathtub':3, 'washer':3,
    /* ---- ห้องนอน ---- */
    'coat-rack':1,
    'cradle':2, 'nightstand':2,
    'bed':3, 'crib':3, 'dresser':3, 'vanity':3, 'wardrobe':3,
    'bunk-bed':4,
    /* ---- ของแต่งในบ้าน ---- */
    'globe':1, 'plant':1, 'table-lamp':1, 'wall-clock':1, 'wall-picture':1, 'big-teddy':1, 'rug':1,
    'bookshelf':2, 'floor-lamp':2, 'toy-box':2,
    'aquarium':3, 'tv':3,
    'piano':4,
    /* ---- ครัว ---- */
    'rice-cooker':1,
    'microwave':2, 'sink':2, 'water-cooler':2,
    'counter':3, 'cupboard':3, 'fridge':3, 'stove':3,
    'kitchen-island':4,
    /* ---- ที่นั่งในบ้าน ---- */
    'floor-cushion':1, 'stool':1,
    'beanbag':2, 'chair':2, 'highchair':2, 'kids-chair':2,
    'armchair':3, 'egg-chair':3, 'rocking-chair':3, 'sofa':3,
    /* ---- โต๊ะ ---- */
    'side-table':1,
    'bar-table':2, 'coffee-table':2, 'console-table':2, 'tv-stand':2,
    'desk':3, 'dining-table':3, 'round-table':3, 'table':3,
    /* ---- ต้นไม้/สวน ---- */
    'bush':1, 'cactus':1, 'clover-patch':1, 'flowerbed':1, 'mushroom':1, 'rose-bush':1,
    'sunflower':1, 'tulip-pot':1,
    'hedge':2, 'palm-tall':2, 'pine':2, 'topiary':2, 'tree':2, 'tree-round':2,
    'flower-arch':3,
    /* ---- เครื่องเล่น ---- */
    'kite':1,
    'spring-rider':2,
    'basketball-hoop':3, 'monkey-bars':3, 'sandbox':3, 'seesaw':3, 'slide':3, 'soccer-goal':3, 'swing':3,
    'kiddie-pool':4, 'playhouse':4, 'trampoline':4,
    /* ---- ที่นั่งนอกบ้าน ---- */
    'garden-stool':1,
    'bench':2, 'log-bench':2, 'sun-lounger':2,
    'garden-swing':3, 'hammock':3, 'picnic':3,
    /* ---- ของแต่งนอกบ้าน ---- */
    'balloon':1, 'birdhouse':1, 'fence-corner':1, 'fence-seg':1, 'gnome':1, 'mailbox':1,
    'path':1, 'stone-path':1,
    'bbq-grill':2, 'bird-bath':2, 'campfire':2, 'flag-pole':2, 'lamp-post':2, 'pet-house':2,
    'scarecrow':2, 'wheelbarrow':2,
    'statue':3, 'windmill':3, 'wooden-bridge':3,
    'fountain':4, 'pond':4, 'string-lights':4, 'well':4,
  };

  /* ---------- ราคาชุดแต่งตัว (ต่อ 1 ตัวเลือกในแถวนั้น) ----------
     แถวที่ไม่อยู่ในตาราง = ฟรีทั้งแถว (เพศ/รูปทรงดวงตา = หน้าตาเด็กเอง ไม่ใช่ของซื้อ)
     สีของเครื่องแต่ง (hatC/glassC/bagC/holdC) **เปิดขายเมื่อ 2026-08-07 ตามคำขอผู้ใช้**
     — ราคาถูกกว่าสีอื่น (20) เพราะต้องซื้อตัวของก่อนถึงจะได้ใช้ ไม่ใช่ของที่ซื้อแล้วใช้ได้เลย */
  const FIT_PRICE = {
    hair:30, hairC:30, eyeC:30,
    shirt:15, bottom:15, shoes:15,
    pattern:40,
    hat:60, glass:60,
    bag:80, hold:80,
    hatC:20, glassC:20, bagC:20, holdC:20,
  };
  /* ชื่อไทยของแต่ละแบบ (ใช้บนการ์ดในร้าน — เด็กอ่านรูปไม่ออกต้องมีชื่อกำกับ)
     ตรงกับคอมเมนต์ H_*_N ใน js/house-map.js ถ้าเพิ่มแบบใหม่ต้องเติมที่นี่ด้วย */
  const FIT_NAMES = {
    hair:    ['ผมสั้น','ผมบ๊อบ','ผมหางม้า','ผมยาว','ผมมวย','ผมหยิก'],
    pattern: ['เรียบ','ทางขวาง','จุด','ดาว','หัวใจ','เอี๊ยม','ซิกแซก','กระเป๋าหน้าอก','ปกกะลาสี','ทางตั้ง'],
    hat:     ['ไม่ใส่','หมวกแก๊ป','หมวกไหมพรม','หมวกฟาง','โบว์','มงกุฎ','หูสัตว์','หมวกปาร์ตี้','ที่คาดผมดอกไม้'],
    glass:   ['ไม่ใส่','แว่นกลม','แว่นเหลี่ยม','แว่นกันแดด','แว่นหัวใจ','แว่นดาว','แว่นว่ายน้ำ'],
    bag:     ['ไม่สะพาย','เป้นักเรียน','เป้หมี','กระดองเต่า','ปีกผีเสื้อ','ปีกนางฟ้า','กระเป๋าสะพายเฉียง'],
    hold:    ['ไม่ถือ','ลูกโป่ง','ตุ๊กตาหมี','ไอศกรีม','หนังสือ','ไม้กายสิทธิ์','ลูกบอล','ช่อดอกไม้','ร่ม'],
  };

  /* ---------- ของที่ให้ฟรีตั้งแต่วันแรก (ข้อ 26 ของแผนแม่บท) ----------
     เฟอร์นิเจอร์ในบ้าน 8 ชิ้น = "ชุดมาตรฐาน" ที่วางไว้ให้เลย (ดู STARTER_HOME)
     ของนอกบ้าน (รั้ว/ทางเดิน/ต้นไม้/บ้านสัตว์) = ของฉากที่ seedWorldDecor วางไว้อยู่แล้ว
     ต้องนับว่าเป็นสิทธิ์ของเด็กด้วย ไม่งั้นลบทิ้งแล้วหยิบกลับมาวางไม่ได้ */
  const STARTER_FURN = [
    'crib','wardrobe',                      /* ห้องนอน */
    'sofa','coffee-table','bookshelf',      /* ห้องนั่งเล่น */
    'dining-table','chair','stove',         /* ครัว (เตาเป็นของมาตรฐานตั้งแต่ 2026-08-07) */
    'toilet',                               /* ห้องน้ำ */
    'tree','fence-corner','fence-seg','path','pet-house',   /* ของฉากนอกบ้าน */
  ];
  /* ตำแหน่งชุดมาตรฐานในบ้าน (พิกัดช่องกริดในบ้าน **14×14**, anchor = มุมซ้ายบนของชิ้น, rot 0 = หันไป +z)
     ผังห้อง: z<=6 ครึ่งบน (x0-7 นั่งเล่น, x9-13 ครัว) · z>=8 ครึ่งล่าง (x0-9 นอน, x11-13 น้ำ)
     ⚠ ต้องเลี่ยง 4 อย่าง (ถ้าย้ายกำแพงในอนาคตต้องมาไล่ผังนี้ใหม่):
       1) แนวกำแพง z=7 · x=8 (ครึ่งบน) · x=10 (ครึ่งล่าง)
       2) ช่องประตูหน้าบ้าน x=4 z0-1 (เดินเข้าบ้านมาต้องไม่ชนของ)
       3) ช่องเดินระหว่างห้อง: x3-4 ที่ z=7-8 (นั่งเล่น↔นอน), x11-12 ที่ z=6-7 (ครัว↔น้ำ),
          x=8 ที่ z2-3 (นั่งเล่น↔ครัว), x=10 ที่ z10-11 (นอน↔น้ำ)
       4) วางชนกันเอง — `starterHomeRecs()` ใน js/house.js เช็ค decorCanPlace ให้อีกชั้นตอน seed */
  const STARTER_HOME = [
    /* ⚠ "ชิดผนัง" = ต้องแนบผนังจริงเท่านั้น — บ้านเป็นทรง dollhouse มีผนังแค่ 2 ด้านที่ไกลกล้อง
       (x=0 และ z=0) กับผนังกั้นห้อง (z=7, x=8 ครึ่งบน, x=10 ครึ่งล่าง)
       ด้าน x สูงสุด/z สูงสุดเปิดโล่งให้กล้องมอง วางตู้พิงไว้จะดูลอยไม่มีอะไรหนุนหลัง */
    /* ห้องนั่งเล่น: โซฟาชิดผนังซ้าย · โต๊ะกลางอยู่หน้าโซฟา · ชั้นหนังสือมุมในติดผนังหลัง
       (ชั้นหนังสือเลี่ยง x=6 เพราะเป็นตำแหน่งหน้าต่างบนผนังหลัง จะบังพอดี) */
    {id:'sofa',         x:0,  z:2,  rot:0, col:0},
    {id:'coffee-table', x:1,  z:3,  rot:0, col:0},
    {id:'bookshelf',    x:7,  z:0,  rot:0, col:0},
    /* ครัว: เตาชิดผนังหลัง · โต๊ะกินข้าวกลางห้องมีเก้าอี้อยู่ด้านหน้า (ฝั่ง +z) */
    {id:'stove',        x:12, z:0,  rot:0, col:0},
    {id:'dining-table', x:11, z:3,  rot:0, col:0},
    {id:'chair',        x:11, z:5,  rot:0, col:0},
    /* ห้องนอน: เตียงเดี่ยวชิดผนังซ้ายใต้หน้าต่าง (z10-11) · ตู้เสื้อผ้าพิงผนังกั้นห้อง z=7 */
    {id:'crib',         x:0,  z:10, rot:0, col:0},
    {id:'wardrobe',     x:6,  z:8,  rot:0, col:0},
    /* ห้องน้ำ: โถส้วมพิงผนังกั้นห้อง z=7 มุมใน ไม่ขวางช่องเดินเข้า (x11 ที่ z10-11) */
    {id:'toilet',       x:13, z:8,  rot:0, col:0},
  ];
  /* ชุดแต่งตัวที่ให้ฟรี — ทรงผม 2 · สีผม 3 · สีตา 1 · สีเสื้อ 4 · สีกางเกง 3 · สีรองเท้า 2
     หมวก/แว่น/เป้/ของถือ ได้แค่ตัวเลือก "ไม่ใส่" (index 0) ที่เหลือต้องซื้อทั้งหมด
     (ค่าปริยายของตัวละคร H_DEFAULT_CHAR จะถูก union เข้ามาอัตโนมัติใน starterFit())
     ⚠ **index ที่แจกฟรีในแต่ละแถวต้องเรียงติดกันเสมอ** — ถ้าชิปที่ปลดล็อกกระจายสลับกับชิปที่ล็อก
       เด็กจะอ่านไม่ออกว่าอันไหนเลือกได้ (เดิมสีเสื้อเป็น [0,1,2,5] มีช่องล็อก 3-4 คั่นกลาง)
     สีผม 0-2 = ดำ/น้ำตาล/น้ำตาลอ่อน (เปิดสีน้ำตาลเพิ่ม 2026-08-07 ตามคำขอผู้ใช้)
     สีเสื้อ 2-5 = เหลือง/เขียวอ่อน/เขียวน้ำทะเล/ฟ้า (ต้องคลุม index 5 เพราะเป็นสีเสื้อปริยายของตัวละคร) */
  const STARTER_FIT = {
    hair:[0,1], hairC:[0,1,2], eyeC:[0],
    shirt:[2,3,4,5], bottom:[0,1,2], shoes:[0,1],
    pattern:[0], hat:[0], glass:[0], bag:[0], hold:[0],
    /* สีของเครื่องแต่ง: แจก 3 สีแรกฟรีทุกชิ้น — ซื้อหมวกมาแล้วต้องมีสีให้เลือกบ้าง
       ไม่ใช่ได้สีเดียวแล้วต้องจ่ายเพิ่มทุกสี (ผูกกับ H_DEFAULT_CHAR ที่ตั้ง hatC/glassC/bagC/holdC = 0
       ไว้แล้ว index ที่แจกฟรีจึงเรียงติดกัน 0-2 ตามกติกา) */
    hatC:[0,1,2], glassC:[0,1,2], bagC:[0,1,2], holdC:[0,1,2],
  };

  /* ---------- ราคาสัตว์เลี้ยง (ข้อ 17.1 ของแผนแม่บท — เฟส 3A) ----------
     ไล่ตามความ "หายาก" ให้เด็กมีอะไรให้ตั้งเป้าออมเงิน (รายได้เต็มที่วันละ ~130-310 🪙):
       เริ่มต้น 250 ≈ 1 วัน · กลาง 450 ≈ 2 วัน · พิเศษ 800 ≈ 3-4 วัน · หายาก 1,500 ≈ 1 สัปดาห์
     ⚠️ **ห้ามลดราคาลงโดยไม่ถามผู้ใช้** — สัตว์คือ money sink ก้อนใหญ่ที่สุดของเกม ถ้าถูกไปเด็กได้ครบเร็วแล้วเบื่อ */
  const PET_PRICE = {
    dog:250, cat:250, rabbit:250, chick:250,          /* เริ่มต้น */
    hamster:450, turtle:450, frog:450, pig:450,       /* กลาง */
    sheep:800, penguin:800,                           /* พิเศษ */
    panda:1500, unicorn:1500,                         /* หายาก */
  };
  const PET_COLOR_PRICE = 100;   /* สีขนเพิ่มเติม — สีแรกแถมมากับตัวสัตว์ตอนซื้อ */
  /* จัดกลุ่มเป็นแท็บในร้าน (ราคาเดียวกันอยู่ด้วยกัน เด็กเทียบง่าย + แท็บไม่ยาวเกินจอ) */
  const PET_GROUPS = [
    {id:'start', label:'เริ่มต้น', emoji:'🌱', ids:['dog','cat','rabbit','chick']},
    {id:'mid',   label:'กลาง',    emoji:'⭐', ids:['hamster','turtle','frog','pig']},
    {id:'rare',  label:'พิเศษ',   emoji:'💎', ids:['sheep','penguin']},
    {id:'epic',  label:'หายาก',   emoji:'👑', ids:['panda','unicorn']},
  ];

  /* 2 = เริ่มระบบเศรษฐกิจ · 3 = เปิดขายสีของเครื่องแต่ง (2026-08-07)
     4 = เฟส 3A เปิดร้านสัตว์เลี้ยง (2026-08-08) — สัตว์ที่เด็กเลี้ยงอยู่ก่อนแล้วต้องได้ฟรีถาวร
     ⚠ ต้องปั๊มเลขทุกครั้งที่ "เพิ่มแถวที่มีราคา" — migrate() จะได้รันซ้ำแล้วแจกสิทธิ์ของแถวใหม่
       ให้เด็กที่ใส่สีนั้นอยู่ก่อนแล้ว ไม่งั้นชุดที่ใส่อยู่จะกลายเป็นล็อกทันที (ผิดกติกาเหล็กข้อ 3) */
  /* ---------- ไอคอน SVG ประจำหมวดเฟอร์นิเจอร์ (10 หมวด) ----------
     สไตล์เดียวกับ H_ROW_ICONS ใน js/house-map.js: แบนๆ พาสเทล ขอบมน viewBox 24×24
     (ของเดิมใช้ emoji ระบบ ซึ่งหน้าตาต่างกันทุกเครื่องและไม่เข้าชุดกับธีมไอคอนของแอป)
     ⚠ เพิ่มหมวดใหม่ในคลังเฟอร์นิเจอร์ต้องมาเพิ่มไอคอนที่นี่ด้วย ไม่งั้นแท็บจะโล่ง */
  const FURN_CAT_ICONS = {
    seat:  '<svg viewBox="0 0 24 24"><path d="M4 12a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v.6a2.4 2.4 0 0 0-2.4 2.4V17H6.4v-2A2.4 2.4 0 0 0 4 12.6z" fill="#FFD6A0" stroke="#E59A5B" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 9V7.5A1.5 1.5 0 0 1 8.5 6h7A1.5 1.5 0 0 1 17 7.5V9" fill="#FFE9C8" stroke="#E59A5B" stroke-width="1.4"/><path d="M5.5 17v2M18.5 17v2" stroke="#E59A5B" stroke-width="1.7" stroke-linecap="round"/></svg>',
    table: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="3.2" rx="1.5" fill="#E8B87C" stroke="#C08340" stroke-width="1.6"/><path d="M6 12.2V19M18 12.2V19" stroke="#C08340" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="6.6" r="2.1" fill="#FFF3D6" stroke="#C08340" stroke-width="1.4"/></svg>',
    bed:   '<svg viewBox="0 0 24 24"><path d="M3 16v-4.5A2.5 2.5 0 0 1 5.5 9H19a2 2 0 0 1 2 2v5z" fill="#F2A0B8" stroke="#C9557A" stroke-width="1.6" stroke-linejoin="round"/><rect x="5" y="10.4" width="5" height="3.2" rx="1.4" fill="#FFF" stroke="#C9557A" stroke-width="1.3"/><path d="M3 16h18M4 16v2.6M20 16v2.6" stroke="#C9557A" stroke-width="1.8" stroke-linecap="round"/></svg>',
    kitchen:'<svg viewBox="0 0 24 24"><path d="M5 10h11a1 1 0 0 1 1 1v4.5a3.5 3.5 0 0 1-3.5 3.5h-6A3.5 3.5 0 0 1 4 15.5V11a1 1 0 0 1 1-1z" fill="#B9D9EC" stroke="#3F7FA6" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 11.6h2.2a1.6 1.6 0 0 1 0 3.2H17" fill="none" stroke="#3F7FA6" stroke-width="1.6"/><path d="M8 7.4c0-1.2 1.2-1.2 1.2-2.4M12 7.4c0-1.2 1.2-1.2 1.2-2.4" stroke="#7FB3CE" stroke-width="1.5" stroke-linecap="round"/></svg>',
    bath:  '<svg viewBox="0 0 24 24"><path d="M3 12h18v2.5A4.5 4.5 0 0 1 16.5 19h-9A4.5 4.5 0 0 1 3 14.5z" fill="#CDEEE0" stroke="#2F9E6B" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 12V7.2A2.2 2.2 0 0 1 8.2 5a2.2 2.2 0 0 1 2.2 2.2" fill="none" stroke="#2F9E6B" stroke-width="1.6" stroke-linecap="round"/><circle cx="10.4" cy="7.6" r="1" fill="#2F9E6B"/><path d="M6 19v1.4M18 19v1.4" stroke="#2F9E6B" stroke-width="1.7" stroke-linecap="round"/></svg>',
    decor: '<svg viewBox="0 0 24 24"><path d="M7 14h10l-1.2 6H8.2z" fill="#E8B87C" stroke="#C08340" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 14c0-3 1.4-5.4 4-6.4-.4 3.4-1.8 5.4-4 6.4z" fill="#8CD08C" stroke="#3E9E52" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 14c0-2.6-1.2-4.6-3.4-5.6.3 3 1.5 4.7 3.4 5.6z" fill="#A8DDA8" stroke="#3E9E52" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    garden:'<svg viewBox="0 0 24 24"><circle cx="12" cy="9.4" r="5.6" fill="#8CD08C" stroke="#3E9E52" stroke-width="1.7"/><circle cx="8.6" cy="11.4" r="3.4" fill="#A8DDA8" stroke="#3E9E52" stroke-width="1.5"/><path d="M12 14v6" stroke="#A9743F" stroke-width="2.2" stroke-linecap="round"/></svg>',
    play:  '<svg viewBox="0 0 24 24"><path d="M5 19 15 7h4v2L9.5 19z" fill="#8FC7F0" stroke="#3A79D8" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 7V4.6M19 7V4.6" stroke="#3A79D8" stroke-width="1.7" stroke-linecap="round"/><path d="M4 19h7" stroke="#3A79D8" stroke-width="1.8" stroke-linecap="round"/></svg>',
    seatout:'<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="2.8" rx="1.3" fill="#C9A06A" stroke="#8A5F30" stroke-width="1.5"/><rect x="3" y="6.6" width="18" height="2.6" rx="1.2" fill="#DDBB88" stroke="#8A5F30" stroke-width="1.5"/><path d="M5.5 13.8V19M18.5 13.8V19" stroke="#8A5F30" stroke-width="1.8" stroke-linecap="round"/></svg>',
    decorout:'<svg viewBox="0 0 24 24"><path d="M6 20h12l-1-3.2H7z" fill="#BFD8E6" stroke="#4A7E9E" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 16.8V12h6v4.8z" fill="#D8ECF5" stroke="#4A7E9E" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 12V7.4" stroke="#4A7E9E" stroke-width="1.7" stroke-linecap="round"/><path d="M12 4.2c1.6 1.4 2.4 2.4 2.4 3.2a2.4 2.4 0 0 1-4.8 0c0-.8.8-1.8 2.4-3.2z" fill="#7FC7EC" stroke="#3A93C4" stroke-width="1.4"/></svg>',
  };

  const ECON_VER = 4;

  /* ---------- ผังร้าน ----------
     เฟส 1 เปิด 2 ร้าน: ห้างเฟอร์นิเจอร์ (ของตกแต่งทั้งหมด) + ห้างแฟชั่น (ชุดแต่งตัวทั้งหมด)
     ⚠ ห้างเฟอร์นิเจอร์ขาย **ทุกหมวด** รวมของนอกบ้าน (สวน/เครื่องเล่น/ที่นั่งนอกบ้าน) ไปก่อน
        เพราะร้านต้นไม้กับร้านของเล่นยังไม่เปิดจนเฟส 2-3 — ถ้าไม่ขายตรงนี้ของกลุ่มนั้นจะซื้อไม่ได้เลย
        (ผิดกติกาเหล็กข้อ 1 "ห้ามมี dead end") พอเปิดร้านที่เหลือแล้วค่อยย้ายหมวดไปตามข้อ 17.4 */
  const SHOPS = {
    'mall-furniture': {kind:'furn',   icon:'🛋️', title:'ห้างเฟอร์นิเจอร์',
                       sub:'แตะที่ของเพื่อดูตัวอย่างก่อนได้เลย ชอบแล้วค่อยกดซื้อ แล้วไปวางในโหมดตกแต่งบ้านนะ'},
    'mall-fashion':   {kind:'fashion', icon:'👗', title:'ห้างแฟชั่น',
                       sub:'แตะที่ชุดเพื่อลองดูก่อนได้เลย ชอบแล้วค่อยกดซื้อ แล้วไปใส่ที่ปุ่มแต่งตัวนะ'},
    /* เฟส 3A — ล็อต shop-pet มีอยู่ในแผนที่อยู่แล้ว (js/house-map.js) แค่ผูกร้านเข้าไป */
    'shop-pet':       {kind:'pet', icon:'🐾', title:'ร้านสัตว์เลี้ยง',
                       sub:'แตะที่เพื่อนตัวน้อยเพื่อดูตัวจริงก่อนได้เลย ซื้อแล้วตั้งชื่อรับมาเลี้ยงได้ทันที'},
  };

  window.HOUSE_SHOP = function(kit){
    const FURN   = kit.FURN;
    const ICONS  = kit.H_ROW_ICONS || {};
    const H_ROWS = kit.H_ROWS;
    const DEF    = kit.H_DEFAULT_CHAR || {};
    const load   = kit.load, save = kit.save;
    const onChange = kit.onChange || function(){};

    /* คลังชนิดสัตว์อยู่ใน js/house.js ซึ่งโหลด **หลัง** ไฟล์นี้ ⇒ ต้องรับเป็นฟังก์ชัน (เรียกตอนใช้จริง)
       ถ้ารับเป็นค่าตรงๆ จะชน TDZ ของ const PET_TYPES ตอนสร้าง SHOP */
    const petTypes = kit.petTypes || function(){ return []; };
    const petInfo  = t => petTypes().filter(p => p.id === t)[0] || null;

    const $ = id => document.getElementById(id);
    const click = () => { if(typeof playClick === 'function') playClick(); };
    const toast = (ic, msg) => { if(typeof showToast === 'function') showToast(ic, msg); };
    const coins = () => (window.OwlCoins ? window.OwlCoins.get() : 0);

    /* ---------- คลังสิทธิ์ ----------
       เก็บเป็นอาเรย์ string ก้อนเดียวใน house save (`data.unlocked`)
       เฟอร์นิเจอร์ = id ตรงๆ ('sofa') · ชุดแต่งตัว = 'fit:<แถว>:<index>' ('fit:hat:3')
       สัตว์เลี้ยง = 'pet:<ชนิด>' ('pet:dog') · สีขนสัตว์ = 'pet:<ชนิด>:<index>' ('pet:dog:2')
       cache ไว้ใน Set เพราะตอนวาดกล่องเลือกของถูกถามทีละชิ้นเป็นร้อยครั้ง — ล้าง cache เมื่อ
       เปลี่ยนเด็ก (kit.childId เปลี่ยน) หรือมีการซื้อ/migrate (invalidate) */
    let ownSet = null, ownFor = null;
    function fitKey(row, i){ return 'fit:' + row + ':' + i; }
    function petKey(type){ return 'pet:' + type; }
    function petColKey(type, i){ return 'pet:' + type + ':' + i; }
    function ensureSet(){
      const cid = kit.childId ? kit.childId() : '';
      if(!ownSet || ownFor !== cid){
        const d = load() || {};
        ownSet = new Set(d.unlocked || []);
        ownFor = cid;
      }
      return ownSet;
    }
    function invalidate(){ ownSet = null; ownFor = null; }
    function grant(keys){
      const d = load() || {};
      const s = new Set(d.unlocked || []);
      let added = 0;
      keys.forEach(k=>{ if(!s.has(k)){ s.add(k); added++; } });
      if(added) save({unlocked: Array.from(s)});
      invalidate();
      return added;
    }

    /* ---------- ราคา ---------- */
    function priceFurn(id){
      const t = FURN_TIER[id];
      return TIER_PRICE[t == null ? 2 : t];
    }
    function priceFit(row, i){
      if(i === 0){
        /* ตัวเลือกแรกของแถวของแต่ง = "ไม่ใส่" ต้องฟรีเสมอ (ไม่งั้นถอดหมวกไม่ได้)
           ส่วนแถวลายเสื้อ index 0 = เสื้อเรียบ ก็ให้ฟรีเหมือนกัน */
        const row0 = H_ROWS.find(r => r.key === row);
        if(row0 && (row0.none || row === 'pattern')) return 0;
      }
      return FIT_PRICE[row] || 0;
    }

    /* ---------- สิทธิ์ ---------- */
    function ownsFurn(id){ return ensureSet().has(id); }
    function ownsFit(row, i){
      if(priceFit(row, i) === 0) return true;      /* ของฟรีถือว่ามีสิทธิ์เสมอ ไม่ต้องจดลง save */
      return ensureSet().has(fitKey(row, i));
    }
    /* ---------- สัตว์เลี้ยง (เฟส 3A) ----------
       ⚠ **ซื้อครั้งเดียวเป็นของถาวร** เหมือนเฟอร์นิเจอร์/ชุดแต่งตัว — ปล่อยคืนแล้วรับกลับมาเลี้ยงใหม่ฟรี
       (แผนข้อ 23 เขียนไว้ว่า "ซื้อซ้ำจ่ายครึ่งเดียว" แต่พอสิทธิ์เก็บถาวรใน `unlocked` แล้ว "ฟรี" ใจดีกว่า
        และตรงเจตนาเดิมกว่า = กันเด็กเสียดายจนไม่กล้าลองสัตว์ตัวอื่น · จดไว้ในข้อ 35.5 ของแผนแม่บท) */
    function pricePet(type){ return PET_PRICE[type] || 0; }
    function ownsPet(type){ return ensureSet().has(petKey(type)); }
    /* สีแรก (index 0) ติดมากับตัวสัตว์เสมอ — ซื้อสัตว์แล้วต้องมีสีให้ใช้อย่างน้อย 1 สี */
    function ownsPetColor(type, i){
      return (i | 0) === 0 ? ownsPet(type) : ensureSet().has(petColKey(type, i));
    }
    function buyPet(type){
      const info = petInfo(type);
      if(!info || ownsPet(type)) return false;
      const ok = buy(petKey(type), pricePet(type), info.label);
      if(ok){
        grant([petColKey(type, 0)]);
        /* ซื้อแล้วพาไปตั้งชื่อ+รับเลี้ยงต่อทันที — เด็ก 5 ขวบไม่ควรต้องเดาว่าต้องไปกดปุ่มไหนต่อ
           (หน่วงไว้ให้ toast "ได้ ... แล้ว!" ขึ้นก่อน แล้วค่อยสลับฉาก) */
        if(kit.onPetBought) setTimeout(()=>kit.onPetBought(type), 700);
      }
      return ok;
    }
    function buyPetColor(type, i){
      const info = petInfo(type);
      if(!info || ownsPetColor(type, i)) return false;
      if(!ownsPet(type)){                         /* กันซื้อสีของสัตว์ที่ยังไม่มี (ซื้อไปก็ใช้ไม่ได้) */
        toast('🐾', 'ต้องรับ' + info.label + 'มาเลี้ยงก่อนถึงจะเลือกสีได้นะ');
        return false;
      }
      const col = info.colors[i];
      return buy(petColKey(type, i), PET_COLOR_PRICE, 'สี' + ((col && col.n) || (i + 1)) + 'ของ' + info.label);
    }

    /* ---------- ซื้อ ---------- */
    function buy(key, price, label){
      if(!window.OwlCoins){ return false; }
      if(coins() < price){
        toast('💰', 'เงินยังไม่พอนะ เก็บเหรียญเพิ่มอีกนิดแล้วค่อยกลับมา!');
        return false;
      }
      if(!window.OwlCoins.spend(price)) return false;
      grant([key]);
      toast('🎉', 'ได้ ' + label + ' แล้ว!');
      onChange();
      return true;
    }
    function buyFurn(id){
      const it = FURN.byId[id];
      if(!it || ownsFurn(id)) return false;
      return buy(id, priceFurn(id), it.name);
    }
    function buyFit(row, i, label){
      if(ownsFit(row, i)) return false;
      return buy(fitKey(row, i), priceFit(row, i), label);
    }

    /* ---------- ชุดเริ่มต้น ---------- */
    function starterFit(){
      const keys = [];
      Object.keys(STARTER_FIT).forEach(row=>{
        STARTER_FIT[row].forEach(i=>{ if(priceFit(row, i) > 0) keys.push(fitKey(row, i)); });
      });
      /* union กับชุดปริยายของตัวละคร — กันเคสค่าปริยายไปตรงกับตัวเลือกที่ยังไม่ได้แจก
         แล้วเด็กใหม่เปิดมาเจอชุดตัวเองล็อกอยู่ */
      H_ROWS.forEach(r=>{
        const v = DEF[r.key];
        if(typeof v === 'number' && priceFit(r.key, v) > 0) keys.push(fitKey(r.key, v));
      });
      return keys;
    }
    function starterHome(){ return STARTER_HOME.map(r => Object.assign({}, r)); }

    /* ---------- migration (กติกาเหล็กข้อ 3: ของเก่าห้ามหาย) ----------
       เรียกจาก loadHouseData() ของ house.js ทุกครั้งที่อ่านข้อมูล — ทำงานจริงครั้งเดียวต่อเด็ก
       คืน true ถ้าแก้ข้อมูล (ให้คนเรียกเขียนกลับ localStorage) */
    function migrate(d){
      if(!d || d.econVer === ECON_VER) return false;
      const s = new Set(d.unlocked || []);
      /* 1) ทุกชิ้นที่วางอยู่ในบ้าน/สนามตอนนี้ = ซื้อแล้ว */
      ['out','in'].forEach(sc=>{
        const list = (d.decor && d.decor[sc]) || [];
        list.forEach(r=>{ if(r && r.id) s.add(r.id); });
      });
      /* 2) ทุกชิ้นที่ใส่อยู่บนตัวตอนนี้ = ซื้อแล้ว */
      const ch = d.char || {};
      H_ROWS.forEach(r=>{
        const v = ch[r.key];
        if(typeof v === 'number' && priceFit(r.key, v) > 0) s.add(fitKey(r.key, v));
      });
      /* 3) บวกชุดเริ่มต้นให้ทุกคน (เด็กเก่าที่ยังไม่มีของพวกนี้ก็ได้ไปด้วย ไม่มีใครเสียเปรียบ) */
      STARTER_FURN.forEach(id=>s.add(id));
      starterFit().forEach(k=>s.add(k));
      /* 4) เฟส 3A: สัตว์ที่เด็กเลี้ยงอยู่ **ก่อน** เปิดร้าน = ได้ฟรีถาวรทั้งชนิดและสีที่ใช้อยู่
         (เมื่อก่อนเลือกสัตว์ได้ฟรี ถ้าไม่แจกสิทธิ์ตรงนี้ เพื่อนตัวน้อยของเด็กจะกลายเป็นล็อกทันที
          = ผิดกติกาเหล็กข้อ 3 "ห้ามทำข้อมูลเก่าหาย" · **ห้ามลบบล็อกนี้แม้จะดูเหมือนโค้ดตายในอนาคต**) */
      if(d.pet && d.pet.type){
        s.add(petKey(d.pet.type));
        s.add(petColKey(d.pet.type, 0));
        s.add(petColKey(d.pet.type, d.pet.color | 0));
      }
      d.unlocked = Array.from(s);
      d.econVer = ECON_VER;
      invalidate();
      return true;
    }

    /* ============================================================
       หน้าร้าน (overlay bottom-sheet — เด็กยังเห็นตัวร้านข้างหลัง)
       ============================================================ */
    let openId = null, shopTab = null;

    function isOpen(){ return openId !== null; }
    function shopForLot(lotId){ return SHOPS[lotId] ? lotId : null; }

    function open(lotId){
      const cfg = SHOPS[lotId];
      if(!cfg) return false;
      openId = lotId;
      shopTab = null;
      sel = null; selKey = null;
      const el = $('house-shop');
      if(!el) return false;
      const t = $('house-shop-title'), sb = $('house-shop-sub');
      if(t)  t.textContent  = cfg.icon + ' ' + cfg.title;
      if(sb) sb.textContent = cfg.sub;
      el.hidden = false;
      document.body.classList.add('house-shop-open');
      renderTabs();
      renderItems();
      /* เข้าร้านปุ๊บโชว์ตัวอย่างของชิ้นแรกเลย (ไม่ต้องเจอหน้าตารางเปล่าๆ ก่อน)
         — เด็กเห็นทันทีว่าร้านนี้ขายอะไร แล้วค่อยแตะใบอื่น/กดปุ่ม ← กลับมาดูรายการทั้งหมด */
      selectFirst();
      return true;
    }
    function close(){
      if(!isOpen()) return;
      openId = null;
      sel = null; selKey = null;
      if(kit.closePreview) kit.closePreview();     /* ปิดพรีวิว 3D ด้วย ไม่งั้นค้างอยู่หลังปิดร้าน */
      const el = $('house-shop');
      if(el) el.hidden = true;
      const bar = $('house-shop-buy');
      if(bar){ bar.hidden = true; bar.innerHTML = ''; }
      document.body.classList.remove('house-shop-open');
    }

    /* รายการแท็บหมวด — รายการที่มี `sec` คือ "หัวข้อกลุ่ม" (ไม่ใช่ปุ่ม กดไม่ได้)
       ของเยอะจนแท็บล้นแถวเดียว จึงจัดกลุ่มให้เด็กกวาดตาหาหมวดที่ต้องการเจอเร็วขึ้น */
    /* ชื่อแท็บสั้นลงเฉพาะในร้าน (หน้าแต่งตัวยังใช้ชื่อเต็มเหมือนเดิม)
       — ชื่อยาวกินความกว้าง 1 แถวเต็มบนมือถือ ทำให้แถบหมวดสูงขึ้นอีกบรรทัดโดยไม่จำเป็น */
    /* ชื่อแท็บใช้ชื่อ "ตัวของ" ไม่ใช่ชื่อแถว — เพราะแท็บเดียวมีทั้งแบบและสีของชิ้นนั้นอยู่ด้วยกันแล้ว */
    const TAB_SHORT = {hair:'ผม', eyeC:'ดวงตา', pattern:'เสื้อ', bottom:'กางเกง', shoes:'รองเท้า',
                       hat:'หมวก', glass:'แว่น', bag:'เป้', hold:'ของถือ'};
    /* เครื่องแต่งชิ้นไหนมีแถวสีคู่กัน → **ไม่แยกเป็นแท็บ** แต่เอาสีไปต่อท้ายรายการในแท็บของชิ้นนั้น
       (แยกเป็นแท็บแล้วหมวดพุ่งเป็น 15 อัน ยาวเกินจอจนต้องมี scrollbar เลื่อนหาหมวด — ผู้ใช้แจ้ง 2026-08-08
        แถมซื้อหมวกกับสีหมวกคนละที่ก็ไม่เป็นธรรมชาติ) */
    const FIT_COLOR_OF = {hair:'hairC', pattern:'shirt', hat:'hatC', glass:'glassC', bag:'bagC', hold:'holdC'};
    const FASHION_GROUPS = [
      {sec:'👕 ตัวเรา',   keys:['hair','eyeC','pattern','bottom','shoes']},
      {sec:'🎀 ของแต่ง',  keys:['hat','glass','bag','hold']},
    ];
    function tabsFor(){
      const cfg = SHOPS[openId];
      if(!cfg) return [];
      const out = [];
      if(cfg.kind === 'fashion'){
        FASHION_GROUPS.forEach(g=>{
          const rows = g.keys.map(k => H_ROWS.find(r => r.key === k)).filter(r => r && FIT_PRICE[r.key]);
          if(!rows.length) return;
          out.push({sec:g.sec});
          rows.forEach(r => out.push({id:r.key, label:TAB_SHORT[r.key] || r.label, svg:ICONS[r.key] || ''}));
        });
        return out;
      }
      /* ร้านสัตว์เลี้ยง: แท็บตามกลุ่มราคา (สีขนของสัตว์แต่ละตัวไปต่อท้ายในแท็บเดียวกัน ไม่แยกหมวด
         ตามกติกา "ตัวของ + สีของมัน อยู่แท็บเดียวกัน" ข้อ 17.4) */
      if(cfg.kind === 'pet'){
        PET_GROUPS.forEach(g=>{
          out.push({id:'petg:' + g.id, label:g.label, emoji:g.emoji});
        });
        return out;
      }
      /* ร้านเฟอร์นิเจอร์: กลุ่ม "ในบ้าน" ก่อน แล้วต่อด้วยกลุ่ม "นอกบ้าน" */
      [['in','🏠 ในบ้าน'], ['out','🌳 นอกบ้าน']].forEach(([sc, label])=>{
        const cats = FURN.cats[sc] || [];
        if(!cats.length) return;
        out.push({sec:label});
        cats.forEach(c => out.push({id:sc + ':' + c.id, label:c.label, svg:FURN_CAT_ICONS[c.id] || '', emoji:c.emoji}));
      });
      return out;
    }
    function renderTabs(){
      const wrap = $('house-shop-tabs');
      if(!wrap) return;
      const tabs = tabsFor();
      const first = tabs.find(t => t.id);
      if(!shopTab && first) shopTab = first.id;
      wrap.innerHTML = '';
      tabs.forEach(c=>{
        if(c.sec){                                   /* หัวข้อกลุ่ม — กินเต็มบรรทัด ดันแท็บกลุ่มถัดไปขึ้นบรรทัดใหม่ */
          const h = document.createElement('div');
          h.className = 'hs-tabsec';
          h.innerHTML = '<span>' + c.sec + '</span>';
          wrap.appendChild(h);
          return;
        }
        const b = document.createElement('button');
        b.className = 'he-tab' + (c.id === shopTab ? ' active' : '');
        /* ไอคอน SVG มาก่อน (เข้าชุดกับธีมไอคอนของแอป) ถ้าหมวดไหนยังไม่มีค่อยตกไปใช้ emoji เดิม */
        b.innerHTML = (c.svg ? '<span class="he-tab-ic">' + c.svg + '</span>'
                             : (c.emoji ? '<span class="he-tab-emoji">' + c.emoji + '</span>' : ''))
                    + '<span>' + c.label + '</span>';
        /* เปลี่ยนหมวด → เลือกของชิ้นแรกของหมวดใหม่ต่อทันที **ห้ามปิดพรีวิว**
           (กรอบพรีวิวเป็นหน้าต่างลอยแล้ว รายการยังอยู่ครบ ถ้าปิดทิ้งเด็กจะงงว่าของหายไปไหน) */
        b.onclick = ()=>{ click(); shopTab = c.id; renderTabs(); renderItems(); selectFirst(); };
        wrap.appendChild(b);
        /* แท็บขึ้นบรรทัดใหม่ได้ (ไม่เลื่อนแนวนอนแล้ว) แต่ถ้ากลุ่มยาวจนต้องเลื่อนแนวตั้ง
           ก็ยังต้องเลื่อนแท็บที่เลือกอยู่มาให้เห็น ไม่งั้นเด็กงงว่าดูหมวดไหนอยู่ */
        if(c.id === shopTab && b.scrollIntoView) setTimeout(()=>b.scrollIntoView({block:'nearest', inline:'nearest'}), 0);
      });
    }

    function hex(v){ return '#' + v.toString(16).padStart(6, '0'); }
    /* การ์ดสินค้า 1 ใบ — ของที่ซื้อแล้วขึ้น ✓, เงินไม่พอขึ้นราคาสีจางแต่ยังเห็น (ไม่ซ่อน)
       **แตะการ์ด = เลือกดู ไม่ใช่ซื้อทันที** (กันเด็กเผลอกดจนเงินหมด) — ซื้อที่แถบด้านล่างอีกที */
    function makeCard(opts){
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hs-card' + (opts.owned ? ' hs-owned' : (coins() < opts.price ? ' hs-poor' : ''))
                  + (opts.key === selKey ? ' hs-sel' : '');
      const pic = document.createElement('span');
      if(opts.color != null){
        pic.className = 'hs-sw';
        pic.style.background = (typeof opts.color === 'object')
          ? 'linear-gradient(' + hex(opts.color.a) + ' 0 50%, ' + hex(opts.color.b) + ' 50% 100%)'
          : hex(opts.color);
      }else{
        pic.className = 'hs-emoji';
        pic.textContent = opts.emoji || '🎁';
      }
      b.appendChild(pic);
      const nm = document.createElement('span');
      nm.className = 'hs-name';
      nm.textContent = opts.name;
      b.appendChild(nm);
      const pr = document.createElement('span');
      pr.className = 'hs-price';
      /* เหรียญวาดด้วย CSS ไม่ใช้ emoji 🪙 — เครื่องบางรุ่นไม่มีตัวนี้ในฟอนต์ แล้วขึ้นเป็นวงกลมเทาทึบ */
      pr.innerHTML = opts.owned ? '✓ มีแล้ว' : ('<i class="hs-coin"></i>' + opts.price);
      b.appendChild(pr);
      b._opts = opts;                 /* เก็บไว้ให้ selectFirst() เลือกได้โดยไม่ต้องยิง click จริง */
      b.onclick = ()=>{ click(); select(opts); };
      return b;
    }

    /* ---------- เลือกสินค้า → พรีวิว 3D ฝั่งซ้าย + แถบซื้อด้านล่าง ---------- */
    let sel = null, selKey = null;
    /* ชุดแต่งตัว **พรีวิวได้ทุกแถว** รวมแถวสีด้วย (ปรับ 2026-08-07 ตามคำขอผู้ใช้)
       — พอร้านกลายเป็น "พรีวิวมาก่อน" ทั้งร้านแล้ว การ์ดสีที่กดแล้วไม่มีอะไรขึ้นจะดูเหมือนแอปค้าง
         และเห็นสีจริงบนตัวละครชัดกว่าดูจากสวอตช์สี่เหลี่ยมเล็กๆ อยู่แล้ว */
    function previewableFit(row){ return !!row; }
    function select(opts){
      sel = opts; selKey = opts.key;
      if(kit.preview && opts.preview) kit.preview(opts.preview);
      else if(kit.closePreview) kit.closePreview();
      renderItems();
      renderBuyBar();
    }
    /* เลือกของชิ้นแรกในหมวดที่เปิดอยู่ (ใช้ตอนเพิ่งเข้าร้าน) — ไม่มีของก็แค่ไม่ทำอะไร */
    function selectFirst(){
      const wrap = $('house-shop-items');
      const first = wrap && wrap.querySelector('.hs-card');
      if(first && first._opts){ select(first._opts); return; }   /* ไม่ยิง click จริง จะได้ไม่มีเสียงกดซ้ำ */
      renderBuyBar();
    }
    function clearSelected(){
      if(!sel && !selKey) return;
      sel = null; selKey = null;
      if(kit.closePreview) kit.closePreview();
      renderItems();
      renderBuyBar();
    }
    function renderBuyBar(){
      const bar = $('house-shop-buy');
      if(!bar) return;
      if(!sel){ bar.hidden = true; bar.innerHTML = ''; return; }
      bar.hidden = false;
      bar.innerHTML = '';
      /* (เคยมีปุ่ม ← กลับไปเลือกของอื่นตรงนี้ — เอาออก 2026-08-08 ตามคำขอผู้ใช้
         ตอนนี้ตารางสินค้าโชว์อยู่ตลอดแล้ว กดการ์ดใบอื่นได้เลย ไม่ต้องมีทางกลับแยก) */
      const nm = document.createElement('span');
      nm.className = 'hs-buy-name';
      nm.textContent = sel.name;
      bar.appendChild(nm);
      const btn = document.createElement('button');
      btn.type = 'button';
      if(sel.owned){
        btn.className = 'hs-buy-btn hs-buy-have';
        btn.textContent = '✓ มีแล้ว';
        btn.onclick = ()=>{ click(); toast('✓', sel.name + ' มีอยู่แล้วนะ'); };
      }else{
        const poor = coins() < sel.price;
        btn.className = 'hs-buy-btn' + (poor ? ' hs-buy-poor' : '');
        btn.innerHTML = 'ซื้อเลย <i class="hs-coin"></i>' + sel.price;
        btn.onclick = ()=>{
          click();
          if(!sel.onBuy()) return;
          sel.owned = true;                 /* ซื้อสำเร็จ → แถบเปลี่ยนเป็น "มีแล้ว" ทันที ไม่ต้องปิดพรีวิว */
          renderItems(); renderBuyBar();
        };
      }
      bar.appendChild(btn);
    }

    /* วางการ์ดของ "แถวชุดแต่งตัว" 1 แถวลงในตาราง (ข้ามตัวเลือกที่ฟรี เช่น "ไม่ใส่") */
    function addFitCards(wrap, row){
      const n = row.type === 'color' ? row.colors.length : (row.type === 'num' ? row.n : 0);
      for(let i = 0; i < n; i++){
        const price = priceFit(row.key, i);
        if(price === 0) continue;
        const nm = (FIT_NAMES[row.key] && FIT_NAMES[row.key][i]) || (row.label + ' ' + (i + 1));
        wrap.appendChild(makeCard({
          key: 'fit:' + row.key + ':' + i,
          name: nm, price, owned: ownsFit(row.key, i),
          color: row.type === 'color' ? row.colors[i] : null,
          emoji: String(i + 1),
          preview: previewableFit(row) ? {kind:'fit', row:row.key, i} : null,
          onBuy: ()=> buyFit(row.key, i, nm),
        }));
      }
    }
    function renderItems(){
      const wrap = $('house-shop-items');
      if(!wrap) return;
      wrap.innerHTML = '';
      const cfg = SHOPS[openId];
      if(!cfg || !shopTab) return;
      /* ป้ายคั่นบอกชื่อหมวดที่กำลังดู — เด็กจะได้รู้ว่าของข้างล่างนี้คือหมวดไหน */
      const head = $('house-shop-items-head');
      if(head){
        const cur = tabsFor().find(t => t.id === shopTab);
        head.innerHTML = '<span>🛍️ ' + (cur ? cur.label : 'ของในหมวดนี้') + '</span>';
      }
      if(cfg.kind === 'fashion'){
        const row = H_ROWS.find(r => r.key === shopTab);
        if(!row) return;
        addFitCards(wrap, row);
        /* เครื่องแต่งที่มีแถวสีคู่กัน — เอาสีมาต่อท้ายในแท็บเดียวกัน คั่นด้วยหัวข้อย่อย
           (ซื้อหมวกกับสีหมวกอยู่ที่เดียวกัน และหมวดไม่บานจนต้องเลื่อนหา) */
        const cKey = FIT_COLOR_OF[row.key];
        const cRow = cKey && H_ROWS.find(r => r.key === cKey);
        if(cRow){
          const h = document.createElement('div');
          h.className = 'hs-subsec';
          h.innerHTML = '<span>🎨 ' + cRow.label + '</span>';
          wrap.appendChild(h);
          addFitCards(wrap, cRow);
        }
        return;
      }
      if(cfg.kind === 'pet'){
        const g = PET_GROUPS.filter(x => 'petg:' + x.id === shopTab)[0];
        if(!g) return;
        g.ids.forEach(type=>{
          const info = petInfo(type);
          if(!info) return;
          wrap.appendChild(makeCard({
            key: petKey(type),
            name: info.label, price: pricePet(type), owned: ownsPet(type), emoji: info.emoji,
            preview: {kind:'pet', type, color:0},
            onBuy: ()=> buyPet(type),
          }));
        });
        /* สีขน — โชว์เฉพาะสัตว์ที่ "มีแล้ว" เท่านั้น (ซื้อสีของสัตว์ที่ยังไม่มีก็ใช้ไม่ได้ ยิ่งทำให้เด็กงง)
           ⇒ แท็บของเด็กใหม่จะสั้นๆ แค่การ์ดสัตว์ แล้วค่อยยาวขึ้นเมื่อเริ่มมีเพื่อนตัวน้อย */
        g.ids.filter(t => ownsPet(t)).forEach(type=>{
          const info = petInfo(type);
          const cols = (info && info.colors) || [];
          if(cols.length < 2) return;
          const h = document.createElement('div');
          h.className = 'hs-subsec';
          h.innerHTML = '<span>🎨 สีขนของ' + info.label + '</span>';
          wrap.appendChild(h);
          cols.forEach((col, i)=>{
            wrap.appendChild(makeCard({
              key: petColKey(type, i),
              name: col.n, price: PET_COLOR_PRICE, owned: ownsPetColor(type, i),
              color: col.c,
              preview: {kind:'pet', type, color:i},
              onBuy: ()=> buyPetColor(type, i),
            }));
          });
        });
        return;
      }
      const parts = shopTab.split(':'), scope = parts[0], cat = parts[1];
      FURN.items.filter(it => it.scope === scope && it.cat === cat).forEach(it=>{
        wrap.appendChild(makeCard({
          key: it.id,
          name: it.name, price: priceFurn(it.id), owned: ownsFurn(it.id), emoji: it.emoji,
          preview: {kind:'furn', id: it.id},
          onBuy: ()=> buyFurn(it.id),
        }));
      });
    }

    /* ยอดเงินเปลี่ยนจากที่อื่น (เช่นได้เหรียญจากเควสต์) ระหว่างเปิดร้านอยู่ → วาดใหม่ให้ราคาไม่ค้างจาง */
    document.addEventListener('owlcoins', ()=>{ if(isOpen()){ renderItems(); renderBuyBar(); } });

    return {
      ECON_VER, SHOPS, TIER_PRICE, FIT_PRICE,
      migrate, invalidate,
      priceFurn, priceFit, ownsFurn, ownsFit,
      buyFurn, buyFit,
      /* สัตว์เลี้ยง (เฟส 3A) — house.js ใช้ล็อกหน้าเลือกสัตว์ + เทสเรียกตรวจสิทธิ์ */
      PET_PRICE, PET_COLOR_PRICE, PET_GROUPS,
      pricePet, ownsPet, ownsPetColor, buyPet, buyPetColor,
      petTypes,        /* PET_TYPES อยู่ใน IIFE ของ house.js — ทางเดียวที่เทสมองเห็นคือผ่านตรงนี้ */
      starterHome, starterFit, STARTER_FURN,
      shopForLot, open, close, isOpen, clearSelected,
      refresh: ()=>{ if(isOpen()){ renderItems(); renderBuyBar(); } },
    };
  };
})();
