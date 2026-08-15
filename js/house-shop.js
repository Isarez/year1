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
  /* ⚠ ระดับ 5-7 เพิ่มในเฟส 9 สำหรับ **เครื่องดนตรี** ซึ่งเป็นของแพงที่สุดในเกมโดยตั้งใจ (ข้อ 31)
     400-1,500 🪙 ⇒ เด็กต้องเก็บเงินหลายวันถึงจะได้ชิ้นแรก เป็น money sink ปลายเกมคู่กับสัตว์เลี้ยง
     **ห้ามลดราคาโดยไม่ถามผู้ใช้** (กติกาเดียวกับราคาสัตว์เลี้ยง) */
  const TIER_PRICE = [0, 25, 60, 140, 300, 500, 900, 1500];
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
    'aquarium':3, 'aquarium-sea':3, 'tv':3,
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
    'bush':1, 'cactus':1, 'clover-patch':1, 'flowerbed':1, 'mushroom':1, 'rose-bush':1, 'veg-plot':1, 'sell-basket':1,
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

    /* ================= เฟส 8 — ของใหม่ 64 ชิ้น (2026-08-12) =================
       ตั้งราคาตามขนาด/ความอลังการเหมือนของเดิมเป๊ะ ไม่มีของชิ้นไหนแพงกว่าเพดานเดิม (300)
       ⚠ ของที่ "ใช้งานได้จริง/ตัวใหญ่" ให้ระดับ 3-4 · ของจิ๋วตั้งโต๊ะให้ระดับ 1
       ⚠ **ห้ามลืมชิ้นไหน** — ชิ้นที่ไม่อยู่ในตารางจะได้ระดับ 2 อัตโนมัติซึ่งอาจถูก/แพงผิดขนาด
         (มีเทสไล่ตรวจว่าเฟอร์นิเจอร์ทุกชิ้นในคลังมีราคาในตารางนี้จริง) */
    /* ---- ที่นั่งในบ้าน (+6) ---- */
    'stool-round':1, 'pouf':1,
    'papasan':2, 'floor-sofa':2,
    'love-seat':3, 'swing-chair':3,
    /* ---- โต๊ะ (+6) ---- */
    'nest-tables':1, 'round-coffee':1,
    'kids-table':2, 'craft-cart':2,
    'study-desk':3, 'art-table':3,
    /* ---- ห้องนอน (+6) ---- */
    'night-light':1,
    'dress-mirror':2, 'toy-chest-bed':2,
    'day-bed':3, 'hammock-in':3,
    'canopy-bed':4,
    /* ---- ครัว (+8) ---- */
    'fruit-bowl':1, 'dish-rack':1, 'kettle-set':1,
    'toaster':2, 'blender':2, 'spice-rack':2, 'trash-bin':2, 'pot-shelf':2,
    /* ---- ห้องน้ำ (+5) ---- */
    'bath-toys':1, 'flower-mirror':1,
    'towel-shelf':2, 'step-stool':2,
    'duck-tub':3,
    /* ---- ของแต่งในบ้าน (+10) ---- */
    'star-mobile':1, 'growth-chart':1, 'wall-shelf-cloud':1, 'pet-bed-in':1, 'photo-wall':1,
    'chalkboard':2, 'beanbag-frog':2, 'floor-globe-big':2,
    'toy-shelf':3, 'reading-nook':3,
    /* ---- สวน (+8) ---- */
    'berry-bush':1, 'bird-nest-box':1, 'stepping-log':1,
    'veggie-plot':2, 'wind-spinner':2, 'garden-arch-vine':2,
    'lotus-pond':3,
    'greenhouse-mini':4,
    /* ---- เครื่องเล่น (+5) ---- */
    'balance-beam':2,
    'jungle-net':3, 'mini-maze':3, 'water-table':3,
    'tree-house':4,
    /* ---- ที่นั่งนอกบ้าน (+4) ---- */
    'canvas-chair':2, 'picnic-set':2,
    'swing-bench':3, 'tree-bench':3,
    /* ---- ของแต่งนอกบ้าน (+6) ---- */
    'house-sign':1, 'sun-dial':1,
    'garden-lantern':2, 'garden-gnome-family':2, 'garden-cart':2,
    'stone-lantern-row':3,

    /* ---- เฟส 9: เครื่องดนตรี 11 ชิ้น (ข้อ 31) ----
       ระดับ 1 (เสียงเดียว) = 500 · ระดับ 2 (เล่นเป็นชุด) = 900 · ระดับ 3 (เปิดหน้าเต็ม) = 1,500
       ⚠ `piano` ย้ายจากหมวด decor มา music ในเฟส 9 ⇒ **ราคาขึ้นจาก 300 เป็น 1,500**
         ของที่เด็กซื้อไปแล้วยังเป็นของเขา (สิทธิ์ผูกกับ id ไม่ใช่ราคา) แค่คนที่ยังไม่ซื้อจะแพงขึ้น */
    'ins-ching':5, 'ins-tambourine':5, 'ins-krap':5, 'ins-windchime':5,
    'ins-musicbox':6, 'ins-ranat':6, 'ins-flute':6,
    'ins-keyboard':7, 'ins-guitar':7, 'ins-ukulele':7, 'piano':7,
  };

  /* ---------- เพดานจำนวนชิ้นที่ "มีได้" ต่อ 1 ไอดี (ผู้ใช้สั่ง 2026-08-14) ----------
     ⚠ เฟส 11 เปิดให้ซื้อเฟอร์นิเจอร์ซ้ำได้ไม่จำกัด ⇒ ของที่ระบบเกมอ่านจำนวนไปใช้ต่อจะพัง
       ถ้าเด็กกดซื้อรัวๆ (แปลงผัก 50 แปลง = กดรดน้ำทีเดียวโตหมดทั้งสวน = เงินเฟ้อ)
     📌 **ของที่ไม่อยู่ในตารางนี้ = ซื้อได้ไม่จำกัดเหมือนเดิม** (ของแต่งบ้านทั่วไป ยิ่งเยอะยิ่งสนุก)
        ใส่เฉพาะของที่ "มีความหมายกับกลไกเกม" เท่านั้น
     ⚠ เพดานนี้คุมทั้ง `buyFurn()` (ซื้อด้วยเงิน) และ `grantFree()` (ของรางวัล) — ห้ามคุมแค่ทางเดียว */
  const FURN_MAX = {
    'veg-plot': 8,      /* แปลงผัก — ผู้ใช้กำหนดเอง 8 แปลง (ชุดเริ่มต้นให้มา 4) */
    'sell-basket': 1,   /* ตะกร้าขายของ — ของ default 1 ใบ **ไม่มีขายในร้าน** (ดู noShop) */
    'pet-house': 1,     /* บ้านสัตว์ — เลี้ยงได้ทีละตัว มีหลายหลังก็ไม่มีความหมาย */
  };
  const furnMax = id => (Object.prototype.hasOwnProperty.call(FURN_MAX, id) ? FURN_MAX[id] : Infinity);

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
    /* เฟส 8: แบบรองเท้า — ราคาเท่าลายเสื้อ (เห็นทั้งตัวพอๆ กัน แต่ชิ้นเล็กกว่าหมวก/กระเป๋า) */
    shoeStyle:40,
  };
  /* ชื่อไทยของแต่ละแบบ (ใช้บนการ์ดในร้าน — เด็กอ่านรูปไม่ออกต้องมีชื่อกำกับ)
     ตรงกับคอมเมนต์ H_*_N ใน js/house-map.js ถ้าเพิ่มแบบใหม่ต้องเติมที่นี่ด้วย */
  const FIT_NAMES = {
    /* ⚠ ลำดับต้องตรงกับ case ใน js/house.js เป๊ะ และ **ต่อท้ายเท่านั้น ห้ามแทรกกลาง**
       (ชื่อที่เลื่อนไปคนละแบบ = เด็กกดซื้อของที่เห็นในรูปแล้วได้อีกชิ้น) */
    hair:    ['ผมสั้น','ผมบ๊อบ','ผมหางม้า','ผมยาว','ผมมวย','ผมหยิก',
              'ผมสั้นเกรียน','ผมแสกกลาง','ผมหยิกฟู','ผมหน้าม้าหนา','ผมโมฮอว์ก','ผมยาวประบ่า'],
    pattern: ['เรียบ','ทางขวาง','จุด','ดาว','หัวใจ','เอี๊ยม','ซิกแซก','กระเป๋าหน้าอก','ปกกะลาสี','ทางตั้ง',
              'ตารางสก็อต','ดาวกระจาย','หัวใจคู่','จุดใหญ่','แถบเฉียง','รอยเท้าสัตว์','เลขหนึ่ง','ดาวเรียงแถว',
              'สายรุ้ง','หน้ายิ้ม'],
    hat:     ['ไม่ใส่','หมวกแก๊ป','หมวกไหมพรม','หมวกฟาง','โบว์','มงกุฎ','หูสัตว์','หมวกปาร์ตี้','ที่คาดผมดอกไม้',
              'หูแมว','หูกระต่าย','หมวกกันน็อก','หมวกปีกกว้าง','โบว์ใหญ่','ผ้าโพกหัว','หมวกกัปตัน','มงกุฎดอกไม้',
              'หมวกไหมพรมมีปอม'],
    glass:   ['ไม่ใส่','แว่นกลม','แว่นเหลี่ยม','แว่นกันแดด','แว่นหัวใจ','แว่นดาว','แว่นว่ายน้ำ',
              'กันแดดหัวใจ','แว่นดำน้ำ','แว่นนักบิน','แว่นวิทยาศาสตร์','แว่นกลมโต'],
    bag:     ['ไม่สะพาย','เป้นักเรียน','เป้หมี','กระดองเต่า','ปีกผีเสื้อ','ปีกนางฟ้า','กระเป๋าสะพายเฉียง',
              'เป้ลายสัตว์','กระเป๋าคาดอก','ถังน้ำ','เป้จรวด','ปีกค้างคาว','เป้ไดโนเสาร์','กระเป๋าดอกไม้'],
    hold:    ['ไม่ถือ','ลูกโป่ง','ตุ๊กตาหมี','ไอศกรีม','หนังสือ','ไม้กายสิทธิ์','ลูกบอล','ช่อดอกไม้','ร่ม',
              'ตาข่ายจับแมลง','กล้องถ่ายรูป','ว่าว','ไม้เทนนิส','กระเป๋าเดินทาง','ลูกโป่งสัตว์','ไอศกรีมโคน',
              'กีตาร์จิ๋ว','ธง'],
    shoeStyle:['รองเท้าผ้าใบ','บูทหุ้มข้อ','รองเท้าแตะ','รองเท้าเต้น','บูทกันฝน','รองเท้าสเก็ต',
              'รองเท้าวิ่ง','รองเท้าหิมะ'],
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
    'tree','fence-corner','fence-seg','path',               /* ของฉากนอกบ้าน */
    /* ⚠ **`pet-house` ถูกเอาออกจากชุดเริ่มต้นแล้ว 2026-08-14 (ผู้ใช้สั่ง)** — ล็อกไว้จนกว่าจะ
       ซื้อสัตว์เลี้ยงตัวแรก · ปลดให้อัตโนมัติใน buyPet() ⇒ ไม่มี dead end
       เหตุผล: ยังไม่มีสัตว์แล้วมีบ้านสัตว์วางได้ เด็กจะงงว่าบ้านนี้ของใคร */
    'veg-plot', 'sell-basket',              /* แปลงผัก 4 แปลง + ตะกร้าขายของ (เฟส 11) — ติดมากับบ้าน */
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

  /* ---------- เฟส 12: ปลอกคอ + ของเล่นสัตว์เลี้ยง (ข้อ 48 · ผู้ใช้สั่ง 2026-08-14) ----------
     🎀 ปลอกคอ 8 แบบ — **แบบธรรมดากับป้ายกระดูกแถมฟรีตอนรับน้องมาเลี้ยง** ที่เหลือซื้อในร้าน
       ⚠ **สีทั้ง 8 สีฟรีทุกสีเมื่อมีแบบนั้นแล้ว** (ต่างจากสีขนสัตว์ที่คิดเงินรายสี) —
         ปลอกคอเป็นของแต่งตัวชิ้นเล็ก ถ้าเก็บเงินรายสีอีกจะกลายเป็นบิลยาวเหยียดโดยไม่ได้อะไรเพิ่ม
     🎾 ของเล่น — **ลูกบอลแถมฟรีมากับสัตว์เลี้ยงเสมอ** (ผู้ใช้สั่ง: เริ่มต้นต้องเล่นโยนบอลได้เลย)
       ของเล่นชิ้นอื่นเป็นของ **เฟส 12.1** มาต่อท้ายลิสต์นี้ — `gain` = ความสุขต่อรอบเล่น
     ⚠ **ของเล่นเป็นคนละหมวดกับของตกแต่งบ้านโดยตั้งใจ** (ผู้ใช้สั่ง) ไม่ผ่าน FURN/โหมดตกแต่งเลย
       ซื้อแล้วไปโผล่ในเมนูฟองของน้องแทน ⇒ ไม่ต้องหาที่วาง ไม่กินเพดาน FURN_MAX */
  const PET_COLLARS = [
    {id:'classic',  emoji:'⭕', name:'ปลอกคอธรรมดา', price:0,   free:true},
    {id:'bone',     emoji:'🦴', name:'ป้ายกระดูก',   price:0,   free:true},
    {id:'bow',      emoji:'🎀', name:'โบว์น่ารัก',    price:80},
    {id:'heart',    emoji:'💗', name:'ป้ายหัวใจ',     price:80},
    {id:'star',     emoji:'⭐', name:'หมุดดาว',      price:100},
    {id:'bell',     emoji:'🔔', name:'กระดิ่ง',      price:120, jingle:true},
    {id:'flower',   emoji:'🌸', name:'พวงมาลัยดอกไม้', price:130},
    {id:'bandana',  emoji:'🧣', name:'ผ้าพันคอ',     price:150},
  ];
  const COLLAR_COLORS = [
    {n:'แดง',   c:0xe5533d}, {n:'ส้ม',    c:0xf0913f}, {n:'เหลือง', c:0xf4c542},
    {n:'เขียว', c:0x66bb6a}, {n:'ฟ้า',    c:0x4fc3f7}, {n:'น้ำเงิน', c:0x5c7cfa},
    {n:'ม่วง',  c:0xab77dd}, {n:'ชมพู',  c:0xf279ae},
  ];
  /* ---------- ของเล่นสัตว์เลี้ยง (เฟส 12 = ลูกบอลฟรี · เฟส 12.1 = อีก 7 ชิ้น · ข้อ 50) ----------
     `gain` = ความสุขที่น้องได้ต่อการเล่น 1 รอบ (ผู้ใช้กำหนดกรอบไว้ +6 ถึง +10)
     ท่าเล่นประจำแต่ละชิ้นอยู่ที่ `SPECS` ใน js/house-pet-toys.js (ยกเว้น ball ที่อยู่ใน house.js)

     💰 **ราคาคิดจากคลังของเดิมทั้งเกม ไม่ได้ตั้งลอยๆ** (ข้อ 50 เตือนไว้เองว่าต้องคิดใหม่ก่อนลงมือ):
       ปลอกคอ 80-150 · อาหาร 45-150/ถุง · สัตว์ 250-1,500 · รายได้เด็ก ~206-237 🪙/วัน
       ⇒ ชิ้นแรก **120** (ใกล้ปลอกคอแพงสุด เด็กเก็บไม่กี่วันก็ซื้อได้ชิ้นแรก ไม่ต้องรอเป็นสัปดาห์)
       ⇒ ชิ้นสุดท้าย **400** (~2 วันของรายได้ · ยังถูกกว่าสัตว์ตัวถูกสุดที่ 250 อยู่ 1 ระดับ)
       ⇒ รวมทั้งชุด **1,740 🪙 ≈ 8 วัน** คิดเป็น ~6.5% ของมูลค่าของทั้งเกม (~26,545)
     ⚠ **ของเล่นเป็น money sink ที่ไม่คืนเป็นเงินเลย** ถ้าตั้งแพงกว่านี้จะไปแย่งงบกับของแต่งบ้าน
       ที่เด็กอยากได้จริงๆ — **ห้ามปรับราคาขึ้นโดยไม่ถามผู้ใช้** */
  const PET_TOYS = [
    {id:'ball',    emoji:'🎾', name:'ลูกบอล',      price:0,   free:true, gain:6,
     sub:'แถมฟรีมากับน้อง · โยนให้น้องวิ่งไปคาบกลับมา'},
    {id:'rope',    emoji:'🪢', name:'เชือกดึง',     price:120, gain:6,
     sub:'คาบคนละปลายแล้วดึงสู้กัน'},
    {id:'wand',    emoji:'🪶', name:'ไม้ล่อขนนก',   price:150, gain:7,
     sub:'แกว่งเป็นวง น้องกระโดดตะปบตาม'},
    {id:'disc',    emoji:'🥏', name:'จานร่อน',      price:200, gain:7,
     sub:'ร่อนไปไกลๆ น้องกระโดดงับกลางอากาศ'},
    {id:'plush',   emoji:'🧸', name:'ตุ๊กตาผ้า',    price:240, gain:8,
     sub:'น้องคาบสะบัดไปมาแล้วโยนขึ้นเอง'},
    {id:'bubbles', emoji:'🫧', name:'เครื่องเป่าฟองสบู่', price:290, gain:8,
     sub:'ฟองลอยเป็นแถว น้องวิ่งไล่ตบทีละลูก'},
    {id:'hoop',    emoji:'🛟', name:'ห่วงกระโดด',   price:340, gain:9,
     sub:'ถือห่วงให้น้องวิ่งลอดกลับไป-กลับมา'},
    /* ⚠ id ต้องเป็น `pet-slide` ไม่ใช่ `slide` — คลังเฟอร์นิเจอร์มี `slide` (สไลเดอร์สนามเด็กเล่น)
       อยู่ก่อนแล้ว ชนกันแล้วเทส "ของเล่นห้ามปนกับของตกแต่ง" ของเฟส 12 แดงทันที */
    {id:'pet-slide', emoji:'🛝', name:'สไลเดอร์เล็ก', price:400, gain:10,
     sub:'น้องปีนขึ้นแล้วไถลลงเองซ้ำๆ'},
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
    /* เฟส 9 — หมวดเครื่องดนตรี (โน้ตดนตรีคู่ ทรงมนเข้าชุดกับไอคอนหมวดอื่น)
       ⚠ ทุกหมวดต้องมีไอคอน SVG ของตัวเอง ไม่ใช่ตกไปใช้ emoji — มีเทสคุมว่า
         จำนวนไอคอน SVG ต้องเท่าจำนวนแท็บเสมอ (แท็บที่ใช้ emoji จะดูหลุดธีมทันที) */
    music: '<svg viewBox="0 0 24 24"><path d="M9.5 16.5V6.2l8-1.6v9.4" fill="none" stroke="#8E5BC0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="7.6" cy="16.8" rx="2.6" ry="2.1" fill="#C8A2F0" stroke="#8E5BC0" stroke-width="1.6"/><ellipse cx="15.6" cy="14.6" rx="2.4" ry="2" fill="#C8A2F0" stroke="#8E5BC0" stroke-width="1.6"/></svg>',
    decor: '<svg viewBox="0 0 24 24"><path d="M7 14h10l-1.2 6H8.2z" fill="#E8B87C" stroke="#C08340" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 14c0-3 1.4-5.4 4-6.4-.4 3.4-1.8 5.4-4 6.4z" fill="#8CD08C" stroke="#3E9E52" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 14c0-2.6-1.2-4.6-3.4-5.6.3 3 1.5 4.7 3.4 5.6z" fill="#A8DDA8" stroke="#3E9E52" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    garden:'<svg viewBox="0 0 24 24"><circle cx="12" cy="9.4" r="5.6" fill="#8CD08C" stroke="#3E9E52" stroke-width="1.7"/><circle cx="8.6" cy="11.4" r="3.4" fill="#A8DDA8" stroke="#3E9E52" stroke-width="1.5"/><path d="M12 14v6" stroke="#A9743F" stroke-width="2.2" stroke-linecap="round"/></svg>',
    play:  '<svg viewBox="0 0 24 24"><path d="M5 19 15 7h4v2L9.5 19z" fill="#8FC7F0" stroke="#3A79D8" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 7V4.6M19 7V4.6" stroke="#3A79D8" stroke-width="1.7" stroke-linecap="round"/><path d="M4 19h7" stroke="#3A79D8" stroke-width="1.8" stroke-linecap="round"/></svg>',
    seatout:'<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="2.8" rx="1.3" fill="#C9A06A" stroke="#8A5F30" stroke-width="1.5"/><rect x="3" y="6.6" width="18" height="2.6" rx="1.2" fill="#DDBB88" stroke="#8A5F30" stroke-width="1.5"/><path d="M5.5 13.8V19M18.5 13.8V19" stroke="#8A5F30" stroke-width="1.8" stroke-linecap="round"/></svg>',
    decorout:'<svg viewBox="0 0 24 24"><path d="M6 20h12l-1-3.2H7z" fill="#BFD8E6" stroke="#4A7E9E" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 16.8V12h6v4.8z" fill="#D8ECF5" stroke="#4A7E9E" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 12V7.4" stroke="#4A7E9E" stroke-width="1.7" stroke-linecap="round"/><path d="M12 4.2c1.6 1.4 2.4 2.4 2.4 3.2a2.4 2.4 0 0 1-4.8 0c0-.8.8-1.8 2.4-3.2z" fill="#7FC7EC" stroke="#3A93C4" stroke-width="1.4"/></svg>',
  };

  /* ECON_VER 5 (2026-08-13): **เฟอร์นิเจอร์นับเป็น "จำนวนชิ้น" แล้ว ไม่ใช่ "สิทธิ์ครั้งเดียววางได้ไม่จำกัด"**
     (ผู้ใช้สั่ง — ซื้อ 1 ชิ้นต้องวางได้แค่ 1 อัน) จำนวนเก็บที่ `d.owned = {id: n}`
     ⚠ `d.unlocked` ยังอยู่เหมือนเดิมสำหรับของแต่งตัว/สัตว์เลี้ยง ซึ่งเป็น "สิทธิ์" จริงๆ ไม่ใช่ของนับชิ้น */
  /* ⚠ เฟส 12 **ไม่ต้องขยับเลขนี้** — ลูกบอลกับปลอกคอ 2 แบบแรกใช้ธง `free:true` คิดสดตอนถาม
     (ไม่ได้จดลง `unlocked`) ⇒ เด็กที่เลี้ยงน้องมาก่อนเฟส 12 ได้ของแถมเองอัตโนมัติ ไม่ต้อง migrate */
  const ECON_VER = 5;

  /* ---------- ผังร้าน ----------
     เฟส 1 เปิด 2 ร้าน: ห้างเฟอร์นิเจอร์ (ของตกแต่งทั้งหมด) + ห้างแฟชั่น (ชุดแต่งตัวทั้งหมด)
     ⚠ ห้างเฟอร์นิเจอร์ขาย **ทุกหมวด** รวมของนอกบ้าน (สวน/เครื่องเล่น/ที่นั่งนอกบ้าน) ไปก่อน
        เพราะร้านต้นไม้กับร้านของเล่นยังไม่เปิดจนเฟส 2-3 — ถ้าไม่ขายตรงนี้ของกลุ่มนั้นจะซื้อไม่ได้เลย
        (ผิดกติกาเหล็กข้อ 1 "ห้ามมี dead end") พอเปิดร้านที่เหลือแล้วค่อยย้ายหมวดไปตามข้อ 17.4 */
  const SHOPS = {
    /* `groups` = [scope, หัวข้อกลุ่ม (null = ไม่ต้องมีหัวข้อ), รายชื่อหมวดที่ขาย (ไม่ใส่ = ทุกหมวดของ scope นั้น)]
       ⚠ **ของนอกบ้านย้ายออกจากห้างเฟอร์นิเจอร์ไปร้านต้นไม้/ร้านของเล่นแล้วเมื่อ 2026-08-08** (ข้อ 17.4)
         — ของที่เด็กซื้อไปก่อนหน้านี้ยังเป็นของเขาอยู่ (สิทธิ์เก็บถาวรใน data.unlocked) แค่ย้ายที่ขายเฉยๆ
         ทุกหมวดต้องมีร้านขายเสมอ ห้ามมีหมวดที่ตกหล่นไม่มีใครขาย = dead end (กติกาเหล็กข้อ 1) */
    'mall-furniture': {kind:'furn',   icon:'🛋️', title:'ห้างเฟอร์นิเจอร์',
                       groups:[['in', null]],
                       sub:'แตะที่ของเพื่อดูตัวอย่างก่อนได้เลย ชอบแล้วค่อยกดซื้อ แล้วไปวางในโหมดตกแต่งบ้านนะ'},
    'mall-fashion':   {kind:'fashion', icon:'👗', title:'ห้างแฟชั่น',
                       sub:'แตะที่ชุดเพื่อลองดูก่อนได้เลย ชอบแล้วค่อยกดซื้อ แล้วไปใส่ที่ปุ่มแต่งตัวนะ'},
    /* เฟส 3A — ล็อต shop-pet มีอยู่ในแผนที่อยู่แล้ว (js/house-map.js) แค่ผูกร้านเข้าไป */
    'shop-pet':       {kind:'pet', icon:'🐾', title:'ร้านสัตว์เลี้ยง',
                       sub:'แตะที่เพื่อนตัวน้อยเพื่อดูตัวจริงก่อนได้เลย ซื้อแล้วตั้งชื่อรับมาเลี้ยงได้ทันที'},
    /* เฟส 11: ร้านต้นไม้เป็นทั้งที่ **ซื้อเมล็ดพันธุ์** และ **ขายผักที่ปลูกเอง** (ผู้ใช้สั่ง 2026-08-13)
       ส่วนร้านสะดวกซื้อรับซื้อปลาที่เด็กตกได้ — เนื้อในของ 2 แท็บนี้วาดโดย js/house-play.js
       ผ่าน `HousePlay.renderTrade()` ⇒ ไฟล์ร้านค้าไม่ต้องรู้จักเมล็ด/ปลาเลย */
    'shop-garden':    {kind:'furn', icon:'🌷', title:'ร้านต้นไม้',
                       groups:[['out', null, ['garden','seatout','decorout']]],
                       trade:['seed','crop'],
                       sub:'ต้นไม้ ดอกไม้ ของแต่งสวน · ซื้อเมล็ดพันธุ์กับขายผักที่ปลูกเองได้ที่นี่'},
    'shop-mart':      {kind:'trade', icon:'🏪', title:'ร้านสะดวกซื้อ',
                       trade:['fish'],
                       sub:'พี่รับซื้อปลาที่หนูตกได้นะ เอามาขายได้เลย'},
    'shop-toy':       {kind:'furn', icon:'🎠', title:'ร้านของเล่น',
                       groups:[['out', null, ['play']]],
                       sub:'เครื่องเล่นสนามสำหรับหน้าบ้านหนู แตะดูตัวอย่างก่อนซื้อได้นะ'},
    /* เฟส 9 — ล็อต shop-music + พี่โน้ต (npc-musicshop) มีในผังอยู่แล้วตั้งแต่ 2026-08-06
       ⚠ ขายทั้ง scope `in` และ `out` เพราะระฆังลมเป็นเครื่องดนตรีที่แขวนนอกบ้าน
         (หมวด `music` มีอยู่ทั้ง 2 ฝั่งในคลัง — ถ้าใส่แค่ฝั่งเดียวระฆังลมจะไม่มีใครขาย = dead end) */
    'shop-music':     {kind:'furn', icon:'🎸', title:'ร้านเครื่องดนตรี',
                       groups:[['in', null, ['music']], ['out', null, ['music']]],
                       sub:'ซื้อไปวางในบ้านแล้วแตะเล่นได้จริงเลยนะ ชิ้นไหนก็มีเสียงของตัวเอง'},
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
    /* เครื่องยนต์ดูแลสัตว์ (เฟส 3B) — รับเป็นฟังก์ชันด้วยเหตุผลเดียวกับ petTypes (โหลดคนละไฟล์) */
    const care = kit.care || function(){ return null; };

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
    /* เฟส 12 — ปลอกคอ/ของเล่นเป็นสิทธิ์รวม **ไม่ผูกกับสัตว์ตัวไหน** ซื้อครั้งเดียวใช้ได้กับน้องทุกตัว
       (เปลี่ยนสัตว์แล้วต้องซื้อปลอกคอใหม่หมด = ลงโทษเด็กที่อยากลองเลี้ยงตัวอื่น ผิดกติกาเหล็กข้อ 2) */
    function collarKey(id){ return 'collar:' + id; }
    function toyKey(id){ return 'toy:' + id; }
    /* 'pet:dog' / 'pet:dog:2' → 'dog' (ใช้รู้ว่าตอนนี้เด็กเลือกดูสัตว์ตัวไหนอยู่ในร้าน) */
    function petTypeOfKey(k){
      const p = String(k || '').split(':');
      return p[0] === 'pet' && p[1] ? p[1] : null;
    }
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
    /* ---------- จำนวนเฟอร์นิเจอร์ที่ "มี" (เฟส 11 · ผู้ใช้สั่ง 2026-08-13) ----------
       ⚠ ของเก่าที่มีแต่ `unlocked` (ยังไม่ผ่าน migration รอบนี้) ให้ถือว่ามี 1 ชิ้น
         จะได้ไม่มีใครของหายระหว่างทาง (กติกาเหล็กข้อ 3) */
    function ownedMap(){ const d = load() || {}; return d.owned || {}; }
    /* จำนวนชิ้นที่วางอยู่ในเซฟตอนนี้ (ทั้งในบ้านและนอกบ้าน) */
    function placedInSave(id){
      const d = load() || {};
      let n = 0;
      ['out','in'].forEach(sc=>{
        ((d.decor && d.decor[sc]) || []).forEach(r=>{ if(r && r.id === id) n++; });
      });
      return n;
    }
    /* ⚠ **ต้องเป็น max(ที่ซื้อ, ที่วางอยู่จริง) เสมอ** — ของที่ระบบ seed ให้เอง (รั้ว ~40 ชิ้น ·
       ต้นไม้ · ทางเดิน · แปลงผัก 4) ไม่ได้ผ่านการซื้อ ถ้านับแค่ยอดที่ซื้อจะกลายเป็น "วางเกินสิทธิ์"
       แล้วแผงตกแต่งขึ้น 0/1 ทั้งที่ของวางอยู่เต็มสนาม (เจอจากเทส 2026-08-13)
       ⚠ ไม่เปิดช่องให้โกง: จะวางเพิ่มได้ก็ต่อเมื่อ "ที่มี > ที่วางอยู่" อยู่ดี */
    /* ⚠ **ต้องบันทึกค่าที่ยกขึ้นด้วย** ไม่ใช่คำนวณสดทุกครั้ง — ถ้าคืน max() เฉยๆ พอเด็กลบของ
       จำนวน "ที่วางอยู่" ลดลง ยอดรวมที่มีก็ลดตามไปด้วย ⇒ ตัวเลขในแผงตกแต่งนับผิด
       (ผู้ใช้แจ้ง 2026-08-14: วางแล้วลบ counter เพี้ยน) ⇒ ยกครั้งเดียวแล้วจำไว้ถาวร */
    function furnCount(id){
      const m = ownedMap();
      const has = Object.prototype.hasOwnProperty.call(m, id);
      const own = has ? (m[id] | 0) : (ensureSet().has(id) ? 1 : 0);
      const placed = placedInSave(id);
      if(placed > own){ addFurnCount(id, placed - own); return placed; }
      if(!has && own > 0) addFurnCount(id, 0);      /* ตรึงค่าเริ่มต้นลง owned ครั้งเดียว */
      return own;
    }
    function addFurnCount(id, n){
      const d = load() || {};
      const m = Object.assign({}, d.owned || {});
      if(!Object.prototype.hasOwnProperty.call(m, id)) m[id] = ensureSet().has(id) ? 1 : 0;
      m[id] = Math.max(0, (m[id] | 0) + n);
      save({owned: m});
      return m[id];
    }
    /* "มีอย่างน้อย 1 ชิ้น" — ผู้เรียกเดิมทั้งหมดยังใช้ความหมายนี้ได้เหมือนเดิม */
    function ownsFurn(id){ return furnCount(id) > 0; }
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
        /* ปลดบ้านสัตว์ให้ตอนซื้อสัตว์ตัวแรก (แจกฟรี 1 หลัง ไม่ตัดเงิน) */
        if(furnCount('pet-house') <= 0) grantFree('pet-house');
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

    /* ---------- ปลอกคอ + ของเล่น (เฟส 12) ---------- */
    const collarInfo = id => PET_COLLARS.filter(x => x.id === id)[0] || null;
    const toyInfo    = id => PET_TOYS.filter(x => x.id === id)[0] || null;
    function ownsCollar(id){
      const it = collarInfo(id);
      if(!it) return false;
      return it.free || ensureSet().has(collarKey(id));
    }
    function ownsToy(id){
      const it = toyInfo(id);
      if(!it) return false;
      return it.free ? hasAnyPet() : ensureSet().has(toyKey(id));
    }
    /* ของแถม "มากับน้อง" จะนับว่ามีก็ต่อเมื่อเด็กมีสัตว์เลี้ยงอยู่จริงเท่านั้น */
    function hasAnyPet(){ const d = load() || {}; return !!(d.pet && d.pet.type); }
    function ownedToys(){ return PET_TOYS.filter(t => ownsToy(t.id)); }
    function ownedCollars(){ return PET_COLLARS.filter(t => ownsCollar(t.id)); }
    function buyCollar(id){
      const it = collarInfo(id);
      if(!it || ownsCollar(id)) return false;
      return buy(collarKey(id), it.price, it.name);
    }
    function buyToy(id){
      const it = toyInfo(id);
      if(!it || ownsToy(id)) return false;
      if(!hasAnyPet()){                     /* ซื้อของเล่นไว้ก่อนมีน้องก็เล่นไม่ได้ ต้องบอกให้ชัด */
        toast('🐾', 'รับเพื่อนตัวน้องมาเลี้ยงก่อนนะ แล้วค่อยเลือกของเล่นให้น้อง');
        return false;
      }
      return buy(toyKey(id), it.price, it.name);
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
    /* ⚠ **ซื้อซ้ำได้แล้ว** — ซื้อกี่ครั้งก็วางได้เท่านั้นชิ้น (เดิมซื้อครั้งเดียววางได้ไม่จำกัด) */
    function buyFurn(id){
      const it = FURN.byId[id];
      if(!it) return false;
      /* ⚠ เช็คเพดาน **ก่อนตัดเงินเสมอ** ไม่งั้นเด็กจ่ายเงินแล้วไม่ได้ของ */
      const cap = furnMax(id);
      if(furnCount(id) >= cap){
        toast('✋', 'มี' + it.name + 'ครบ ' + cap + ' ชิ้นแล้ว ซื้อเพิ่มไม่ได้นะ');
        return false;
      }
      const price = priceFurn(id);
      if(!window.OwlCoins) return false;
      if(coins() < price){
        toast('💰', 'เงินยังไม่พอนะ เก็บเหรียญเพิ่มอีกนิดแล้วค่อยกลับมา!');
        return false;
      }
      if(!window.OwlCoins.spend(price)) return false;
      /* ⚠ **ต้องนับจำนวนก่อน `grant()` เสมอ** — `addFurnCount()` ใช้ `unlocked` เป็นค่าตั้งต้น
         ตอนที่ยังไม่มีคีย์ใน `owned` ถ้า grant ไปก่อน ซื้อครั้งแรกจะกลายเป็น 0→1(จาก unlocked)→2
         คือได้ฟรีไป 1 ชิ้น (เทสจับได้ 2026-08-13) */
      const n = addFurnCount(id, 1);
      grant([id]);                         /* คงสิทธิ์เดิมไว้ด้วย (โค้ดเก่าบางส่วนยังอ่าน unlocked) */
      toast('🎉', 'ได้ ' + it.name + ' แล้ว! (มีทั้งหมด ' + n + ' ชิ้น)');
      onChange();
      return true;
    }
    /* ปลดของให้ฟรีโดย **ไม่ตัดเงิน** — ใช้กับ "ของรางวัลจากการสะสม" ของเฟส 11 เท่านั้น
       (ของที่ซื้อด้วยเงินไม่ได้ ต้องเก็บของครบชุดถึงจะได้) ⚠ ไม่ใช่เครื่องมือเทส ห้ามสับสนกับ
       `devUnlockAll` — ตัวนี้เกมจริงเรียกได้ แต่ต้องมี "เหตุผลว่าเด็กทำอะไรมาถึงได้" เสมอ */
    function grantFree(id){
      if(!FURN.byId[id]) return false;
      if(furnCount(id) >= furnMax(id)) return false;   /* เพดานคุมของแจกด้วย ไม่ใช่แค่ของที่ซื้อ */
      addFurnCount(id, 1);               /* นับก่อน grant ด้วยเหตุผลเดียวกับ buyFurn */
      grant([id]);
      onChange();
      return true;
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

    /* ---------- เครื่องมือเทสเท่านั้น (js/house-devtools.js) ----------
       ⚠ **ของโกง ห้ามเรียกจากโค้ดเกมจริงเด็ดขาด** — ปลดล็อกโดยไม่ตัดเงิน ใช้เทสว่าของทุกชิ้น
         วาง/ใส่/ใช้ได้จริงไหมโดยไม่ต้องนั่งเก็บเงินหมื่นกว่าเหรียญก่อน
       (ยังผ่าน grant() ตัวเดียวกับการซื้อจริง สถานะ/cache จึงตรงกันเป๊ะ ไม่ใช่เขียน localStorage ตรงๆ) */
    function devAllKeys(kind){
      const keys = [];
      if(kind === 'furn' || kind === 'all')
        FURN.items.forEach(it=>{ if(priceFurn(it.id) > 0) keys.push(it.id); });
      if(kind === 'fit' || kind === 'all')
        H_ROWS.forEach(r=>{
          const n = r.type === 'color' ? r.colors.length : (r.type === 'num' ? r.n : 0);
          for(let i = 0; i < n; i++) if(priceFit(r.key, i) > 0) keys.push(fitKey(r.key, i));
        });
      if(kind === 'pet' || kind === 'all')
        petTypes().forEach(p=>{
          keys.push(petKey(p.id));
          (p.colors || []).forEach((c, i)=> keys.push(petColKey(p.id, i)));
        });
      return keys;
    }
    function devUnlockAll(kind){
      const keys = devAllKeys(kind || 'all');
      grant(keys);
      onChange();
      if(isOpen()){ renderItems(); renderBuyBar(); }
      return keys.length;
    }
    /* คืนค่าเป็น "เด็กใหม่": ล้างสิทธิ์ที่ซื้อไว้ แต่คืนชุดเริ่มต้นให้ ไม่งั้นชุดที่ใส่อยู่จะกลายเป็นล็อก */
    function devLockAll(){
      save({unlocked: []});
      invalidate();
      grant(starterFit().concat(STARTER_FURN));
      onChange();
      if(isOpen()){ renderItems(); renderBuyBar(); }
    }

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
      /* ---------- econVer 5: แปลง "สิทธิ์" เป็น "จำนวนชิ้น" ----------
         ⚠ **ห้ามให้ของที่เด็กวางอยู่แล้วหายเด็ดขาด** (กติกาเหล็กข้อ 3)
           ⇒ จำนวนที่ให้ = max(จำนวนที่วางอยู่จริงตอนนี้, 1) สำหรับทุกชิ้นที่เคยมีสิทธิ์
           เด็กที่เคยวางโซฟา 5 ตัวจากสิทธิ์ใบเดียว จะได้ 5 ชิ้นไปเลย ไม่ถูกริบ */
      if(!d.owned){
        const placed = {};
        ['out','in'].forEach(sc=>{
          ((d.decor && d.decor[sc]) || []).forEach(r=>{
            if(r && r.id) placed[r.id] = (placed[r.id] | 0) + 1;
          });
        });
        const own = {};
        s.forEach(k=>{ if(FURN.byId[k]) own[k] = Math.max(1, placed[k] | 0); });
        Object.keys(placed).forEach(k=>{ if(FURN.byId[k]) own[k] = Math.max(own[k] | 0, placed[k]); });
        d.owned = own;
      }
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
                       hat:'หมวก', glass:'แว่น', bag:'เป้', hold:'ของถือ', shoeStyle:'แบบรองเท้า'};
    /* เครื่องแต่งชิ้นไหนมีแถวสีคู่กัน → **ไม่แยกเป็นแท็บ** แต่เอาสีไปต่อท้ายรายการในแท็บของชิ้นนั้น
       (แยกเป็นแท็บแล้วหมวดพุ่งเป็น 15 อัน ยาวเกินจอจนต้องมี scrollbar เลื่อนหาหมวด — ผู้ใช้แจ้ง 2026-08-08
        แถมซื้อหมวกกับสีหมวกคนละที่ก็ไม่เป็นธรรมชาติ) */
    const FIT_COLOR_OF = {hair:'hairC', pattern:'shirt', hat:'hatC', glass:'glassC', bag:'bagC', hold:'holdC'};
    const FASHION_GROUPS = [
      /* เฟส 8: แบบรองเท้าอยู่ก่อนสีรองเท้า — เด็กเลือก "ทรง" ก่อนแล้วค่อยเลือกสีของทรงนั้น
         (กติกาเดียวกับหน้าแต่งตัว: จับคู่แบบมาก่อนสีของชิ้นนั้นเสมอ) */
      {sec:'👕 ตัวเรา',   keys:['hair','eyeC','pattern','bottom','shoeStyle','shoes']},
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
      /* เฟส 11: แท็บซื้อ-ขายของสวน/ปลา — ต่อท้ายแท็บปกติของร้านนั้น */
      const tradeTabs = ()=> (cfg.trade || [])
        .filter(k => window.HousePlay && window.HousePlay.tradeAvailable(k))
        .map(k => ({id:'trade:' + k, label: window.HousePlay.tradeLabel(k),
                    emoji: window.HousePlay.tradeEmoji(k)}));
      if(cfg.kind === 'trade') return tradeTabs();
      /* ร้านสัตว์เลี้ยง: แท็บตามกลุ่มราคา (สีขนของสัตว์แต่ละตัวไปต่อท้ายในแท็บเดียวกัน ไม่แยกหมวด
         ตามกติกา "ตัวของ + สีของมัน อยู่แท็บเดียวกัน" ข้อ 17.4) */
      if(cfg.kind === 'pet'){
        PET_GROUPS.forEach(g=>{
          out.push({id:'petg:' + g.id, label:g.label, emoji:g.emoji});
        });
        /* เฟส 3B — อาหารสัตว์อยู่แท็บสุดท้าย (ข้อ 18.2) ต่อท้ายกลุ่มราคาสัตว์ */
        if(care()) out.push({id:'petfood', label:'อาหาร', emoji:'🍖'});
        /* เฟส 12 — ปลอกคอกับของเล่นของน้อง (คนละหมวดกับของตกแต่งบ้าน) */
        out.push({id:'petgear', label:'ปลอกคอ', emoji:'🎀'});
        out.push({id:'pettoy',  label:'ของเล่น', emoji:'🎾'});
        return out;
      }
      /* ร้านที่ขายเฟอร์นิเจอร์ — หมวดที่ขายมาจาก cfg.groups ของร้านนั้น (ห้างเฟอร์/ร้านต้นไม้/ร้านของเล่น) */
      (cfg.groups || [['in','🏠 ในบ้าน'], ['out','🌳 นอกบ้าน']]).forEach(([sc, label, only])=>{
        let cats = FURN.cats[sc] || [];
        if(only) cats = cats.filter(c => only.indexOf(c.id) >= 0);
        if(!cats.length) return;
        if(label) out.push({sec:label});
        cats.forEach(c => out.push({id:sc + ':' + c.id, label:c.label, svg:FURN_CAT_ICONS[c.id] || '', emoji:c.emoji}));
      });
      const tt = tradeTabs();
      if(tt.length){ out.push({sec:'🌱 สวนของหนู'}); tt.forEach(t => out.push(t)); }
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
        b.onclick = ()=>{ click(); shopTab = c.id; renderTabs(); renderItems();
                          if(shopTab.indexOf('trade:') !== 0) selectFirst(); };
        wrap.appendChild(b);
        /* แท็บขึ้นบรรทัดใหม่ได้ (ไม่เลื่อนแนวนอนแล้ว) แต่ถ้ากลุ่มยาวจนต้องเลื่อนแนวตั้ง
           ก็ยังต้องเลื่อนแท็บที่เลือกอยู่มาให้เห็น ไม่งั้นเด็กงงว่าดูหมวดไหนอยู่ */
        if(c.id === shopTab && b.scrollIntoView) setTimeout(()=>b.scrollIntoView({block:'nearest', inline:'nearest'}), 0);
      });
    }

    function hex(v){ return '#' + v.toString(16).padStart(6, '0'); }
    /* การ์ดสินค้า 1 ใบ — ของที่ซื้อแล้วขึ้น ✓, เงินไม่พอขึ้นราคาสีจางแต่ยังเห็น (ไม่ซ่อน)
       **แตะการ์ด = เลือกดู ไม่ใช่ซื้อทันที** (กันเด็กเผลอกดจนเงินหมด) — ซื้อที่แถบด้านล่างอีกที */
    /* ป้ายชื่อเฟอร์นิเจอร์ + จำนวนที่มีจริงตอนนี้ (คิดสดทุกครั้ง ไม่งั้นตัวเลขค้างหลังซื้อ)
       ของที่มีเพดาน (`FURN_MAX`) ต้องบอก "มี 4/8" ให้เด็กเห็นว่าซื้อได้อีกกี่ชิ้น ไม่ใช่ปล่อยให้กด
       จนเจอ toast ปฏิเสธเอาเอง */
    function furnLabel(it){
      const n = furnCount(it.id), cap = furnMax(it.id);
      if(cap !== Infinity) return it.name + ' (มี ' + n + '/' + cap + ')';
      return it.name + (n > 0 ? ' (มี ' + n + ')' : '');
    }
    const furnFull = it => furnCount(it.id) >= furnMax(it.id);
    function makeCard(opts){
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hs-card' + (opts.owned ? ' hs-owned' : (coins() < opts.price ? ' hs-poor' : ''))
                  + (opts.key === selKey ? ' hs-sel' : '')
                  + (opts.sub ? ' hs-has-sub' : '');   /* ใบที่มีบรรทัดรองสูงกว่าปกติ — ทั้งแท็บใส่เหมือนกันหมด ขนาดจึงยังเท่ากัน */
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
      /* บรรทัดรองใต้ชื่อ (อาหารสัตว์ใช้บอกว่าของสัตว์ตัวไหน + เหลือกี่มื้อ) — ขึ้นบรรทัดใหม่ด้วย \n ได้ */
      if(opts.sub){
        const sb = document.createElement('span');
        sb.className = 'hs-sub';
        sb.textContent = opts.sub;
        b.appendChild(sb);
      }
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
      /* ⚠ `sel` เป็น opts ก้อนเดิมตั้งแต่ตอนกดเลือก — `renderItems()` สร้างการ์ดใหม่แต่ไม่ได้
         อัปเดตก้อนนี้ ⇒ ของที่เพิ่งซื้อจนชนเพดานจะยังโชว์ปุ่ม "ซื้อเลย" อยู่
         ⇒ ถามสถานะสดผ่าน `maxedFn()` ทุกครั้งที่วาดแถบ */
      if(sel.maxedFn && sel.maxedFn()){ sel.owned = true; sel.repeat = false; sel.maxed = true; }
      /* (เคยมีปุ่ม ← กลับไปเลือกของอื่นตรงนี้ — เอาออก 2026-08-08 ตามคำขอผู้ใช้
         ตอนนี้ตารางสินค้าโชว์อยู่ตลอดแล้ว กดการ์ดใบอื่นได้เลย ไม่ต้องมีทางกลับแยก) */
      const nm = document.createElement('span');
      nm.className = 'hs-buy-name';
      nm.textContent = sel.name;
      bar.appendChild(nm);
      const btn = document.createElement('button');
      btn.type = 'button';
      /* `repeat` = ของกินได้หมดไป (อาหารสัตว์ เฟส 3B) ซื้อซ้ำได้ไม่จำกัด ⇒ ไม่มีสถานะ "มีแล้ว" */
      if(sel.owned && !sel.repeat && sel.action){
        /* ของที่ "มีแล้ว" แต่ยังมีอะไรให้ทำต่อ (เฟส 12: ปลอกคอ → กดใส่ให้น้องได้เลยจากในร้าน)
           ⚠ ปุ่มนี้ **ห้ามตัดเงิน** ไม่ว่ากรณีใด มันคือการหยิบของที่ซื้อไปแล้วมาใช้เฉยๆ */
        btn.className = 'hs-buy-btn';
        btn.textContent = sel.action.label ? sel.action.label() : 'ใช้เลย';
        btn.onclick = ()=>{ click(); sel.action.run(); renderItems(); renderBuyBar(); };
      }else if(sel.owned && !sel.repeat){
        btn.className = 'hs-buy-btn hs-buy-have';
        btn.textContent = sel.maxed ? '✓ มีครบแล้ว' : '✓ มีแล้ว';
        btn.onclick = ()=>{ click(); toast('✓', sel.name + (sel.maxed ? ' ครบเพดานแล้วนะ' : ' มีอยู่แล้วนะ')); };
      }else{
        const poor = coins() < sel.price;
        btn.className = 'hs-buy-btn' + (poor ? ' hs-buy-poor' : '');
        btn.innerHTML = 'ซื้อเลย <i class="hs-coin"></i>' + sel.price;
        btn.onclick = ()=>{
          click();
          if(!sel.onBuy()) return;
          if(!sel.repeat) sel.owned = true; /* ซื้อสำเร็จ → แถบเปลี่ยนเป็น "มีแล้ว" ทันที ไม่ต้องปิดพรีวิว */
          /* ของที่ซื้อซ้ำได้: อัปเดตจำนวนที่มีบนแถบ+การ์ดให้ตรงทันที (ไม่งั้นตัวเลขค้างค่าเก่า) */
          if(sel.nameFn) sel.name = sel.nameFn();
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
      /* เฟส 11: แท็บซื้อเมล็ด/ขายผัก/ขายปลา — ให้ js/house-play.js วาดเนื้อในเอง */
      if(shopTab.indexOf('trade:') === 0){
        const head = $('house-shop-items-head');
        const kind = shopTab.slice(6);
        if(head) head.innerHTML = '<span>' + (window.HousePlay ? window.HousePlay.tradeEmoji(kind) : '🛍️')
                                + ' ' + (window.HousePlay ? window.HousePlay.tradeLabel(kind) : '') + '</span>';
        if(window.HousePlay) window.HousePlay.renderTrade(wrap, kind, ()=>{ renderItems(); });
        /* แท็บนี้ไม่มี "ของที่เลือกอยู่" ⇒ ต้องเคลียร์แถบซื้อกับพรีวิว 3D ทิ้ง
           ไม่งั้นของจากแท็บก่อนหน้าจะค้างอยู่แล้วเด็กกดซื้อผิดชิ้น */
        sel = null; selKey = null;
        if(kit.closePreview) kit.closePreview();
        renderBuyBar();
        return;
      }
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
        /* ---------- แท็บอาหาร (เฟส 3B) ----------
           ของกินได้หมดไป ⇒ ซื้อซ้ำได้เสมอ (repeat) และโชว์ว่าเหลือกี่มื้อแทนป้าย "มีแล้ว"
           **ขายครบทุกชนิดเสมอ ไม่กรองตามสัตว์ที่มี** — เด็กซื้อเผื่อสัตว์ตัวใหม่ล่วงหน้าได้ */
        if(shopTab === 'petfood'){
          const C = care();
          if(!C) return;
          const d = load() || {}, pet = d.pet || null;
          C.FOOD.forEach(f=>{
            const left = C.meals(f.id);
            const mine = pet && C.foodForPet(pet.type) === f.id;
            /* **ต้องบอกเสมอว่าอาหารถุงนี้ของสัตว์ตัวไหน** — นี่คือตัวสอนหลักของเฟส 3B
               (เด็กต้องรู้ว่าสัตว์ตัวไหนกินอะไร) ถ้าไม่บอกก็เหลือแค่การเดาสุ่ม */
            /* สัตว์ละบรรทัด — เบราว์เซอร์ตัดคำไทยกลางคำ ("หมา/น้อย") ถ้าปล่อยให้ไหลบรรทัดเดียว */
            const who = f.pets.map(p => { const i = petInfo(p); return i ? i.emoji + ' ' + i.label : p; }).join('\n');
            wrap.appendChild(makeCard({
              key: 'food:' + f.id,
              name: f.name + (mine ? ' ⭐' : ''),
              sub: 'สำหรับ\n' + who + (left ? '\nเหลือ ' + left + ' มื้อ' : ''),
              price: f.price, owned: false, repeat: true, emoji: f.emoji,
              onBuy: ()=>{
                if(coins() < f.price){ toast('💰', 'เงินยังไม่พอนะ เก็บเหรียญเพิ่มอีกนิดแล้วค่อยกลับมา!'); return false; }
                if(!C.buyBag(f.id)) return false;
                toast('🎉', 'ได้ ' + f.name + ' 1 ถุง (' + C.MEALS_PER_BAG + ' มื้อ) แล้ว!');
                onChange();
                return true;
              },
            }));
          });
          return;
        }
        /* ---------- แท็บปลอกคอ (เฟส 12) ----------
           พรีวิวเป็น "น้องตัวจริงที่ใส่ปลอกคออันนี้" ไม่ใช่รูปปลอกคอลอยๆ — เด็กจะได้เห็นว่าใส่แล้วสวยไหม
           ⚠ ยังไม่มีน้องก็ดูได้ (พรีวิวใช้หมาเป็นตัวอย่าง) แต่ซื้อไปก็ยังใส่ไม่ได้จนกว่าจะมีน้อง */
        if(shopTab === 'petgear'){
          const d0 = load() || {}, myPet = d0.pet || null;
          const C0 = care();
          const worn = C0 && C0.collar ? C0.collar() : {s:'classic', c:0};
          const shownType = myPet ? myPet.type : 'dog';
          const shownCol  = myPet ? (myPet.color | 0) : 0;
          const wearCollar = (sid, ci, msg)=>{
            if(!C0 || !myPet){ toast('🐾', 'รับเพื่อนตัวน้องมาเลี้ยงก่อนนะ แล้วค่อยแต่งตัวให้น้อง'); return; }
            C0.setCollar(sid, ci);
            toast('🎀', msg);
            onChange();
          };
          PET_COLLARS.forEach(it=>{
            const own = ownsCollar(it.id), on = own && worn.s === it.id;
            wrap.appendChild(makeCard({
              key: collarKey(it.id),
              name: it.name + (on ? ' (ใส่อยู่)' : ''),
              sub: it.price === 0 ? 'แถมฟรีมากับน้อง' : 'ซื้อครั้งเดียว ใช้ได้กับน้องทุกตัว',
              price: it.price, owned: own, emoji: it.emoji,
              preview: {kind:'pet', type: shownType, color: shownCol,
                        collar: {s: it.id, c: worn.c | 0}},
              onBuy: ()=> buyCollar(it.id),
              action: own ? {label: ()=> on ? '✓ ใส่อยู่' : '🎀 ใส่ให้น้อง',
                             run: ()=> on ? toast('🎀', 'น้องใส่' + it.name + 'อยู่แล้วนะ')
                                          : wearCollar(it.id, worn.c | 0, 'น้องใส่' + it.name + 'แล้ว น่ารักจัง!')}
                          : null,
            }));
          });
          /* สีของปลอกคอ — **ฟรีทุกสี** ⇒ แตะแล้วเปลี่ยนสีที่น้องใส่ทันที ไม่มีปุ่มซื้อ */
          const h = document.createElement('div');
          h.className = 'hs-subsec';
          h.innerHTML = '<span>🎨 สีปลอกคอ (ฟรีทุกสี แตะเปลี่ยนได้เลย)</span>';
          wrap.appendChild(h);
          COLLAR_COLORS.forEach((col, i)=>{
            wrap.appendChild(makeCard({
              key: 'collarcol:' + i,
              name: col.n, price: 0, owned: true, color: col.c,
              preview: {kind:'pet', type: shownType, color: shownCol,
                        collar: {s: worn.s, c: i}},
              action: {label: ()=> (worn.c | 0) === i ? '✓ สีนี้อยู่' : '🎨 เปลี่ยนเป็นสีนี้',
                       run: ()=> wearCollar(worn.s, i, 'เปลี่ยนปลอกคอเป็นสี' + col.n + 'แล้ว!')},
            }));
          });
          return;
        }
        /* ---------- แท็บของเล่น (เฟส 12 · ของเล่นชิ้นอื่นมาเพิ่มในเฟส 12.1) ---------- */
        if(shopTab === 'pettoy'){
          PET_TOYS.forEach(it=>{
            const own = ownsToy(it.id);
            wrap.appendChild(makeCard({
              key: toyKey(it.id),
              name: it.name,
              sub: it.sub || ('เล่นแล้วน้องมีความสุขขึ้น +' + (it.gain | 0)),
              price: it.price, owned: own, emoji: it.emoji,
              onBuy: ()=> buyToy(it.id),
            }));
          });
          return;
        }
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
        /* ---------- สีขน: โชว์ของ "ตัวที่เลือกอยู่" ตัวเดียว ----------
           เดิมกางเป็น section ของสัตว์ทุกตัวที่มี ทำให้แท็บยาวขึ้นเรื่อยๆ และเด็กต้องเลื่อนหาว่าสีไหนของใคร
           (ผู้ใช้สั่งแก้ 2026-08-09) ⇒ แตะการ์ดสัตว์ตัวไหน สีของตัวนั้นก็โผล่ต่อท้ายทันที section เดียวจบ
           ⚠ **โชว์สีของสัตว์ที่ยังไม่มีด้วย** (ผู้ใช้สั่งเพิ่ม 2026-08-09 — กลับข้อตัดสินใจของเฟส 3A)
             เด็กจะได้เห็นก่อนว่าตัวนี้มีสีอะไรบ้างคุ้มกับที่ต้องเก็บเงินไหม แตะดูตัวอย่าง 3D ได้เต็มที่
             แต่ **ยังซื้อไม่ได้จนกว่าจะรับมาเลี้ยงก่อน** — buyPetColor() เป็นคนกันไว้ พร้อมบอกเหตุผล */
        const selType = petTypeOfKey(selKey);
        if(selType && g.ids.indexOf(selType) >= 0){
          const info = petInfo(selType);
          const cols = (info && info.colors) || [];
          if(cols.length >= 2){
            const h = document.createElement('div');
            h.className = 'hs-subsec';
            /* ยังไม่ได้รับมาเลี้ยง = ดูสีได้แต่ซื้อไม่ได้ ⇒ บอกไว้ตรงหัวข้อเลย เด็กจะได้ไม่กดแล้วงงว่าทำไมไม่ได้ */
            h.innerHTML = '<span>🎨 สีขนของ' + info.label
                        + (ownsPet(selType) ? '' : ' — รับมาเลี้ยงก่อนถึงจะเลือกสีได้') + '</span>';
            wrap.appendChild(h);
            cols.forEach((col, i)=>{
              wrap.appendChild(makeCard({
                key: petColKey(selType, i),
                name: col.n, price: PET_COLOR_PRICE, owned: ownsPetColor(selType, i),
                color: col.c,
                preview: {kind:'pet', type:selType, color:i},
                onBuy: ()=> buyPetColor(selType, i),
              }));
            });
          }
        }
        return;
      }
      const parts = shopTab.split(':'), scope = parts[0], cat = parts[1];
      /* ⚠ `noShop` = ของที่ **ติดมากับบ้านและไม่มีขาย** (ตะกร้าขายของ) — ต้องกรองที่นี่ที่เดียว
         ห้ามลบออกจากคลัง `FURN` เพราะโหมดตกแต่งยังต้องหยิบมาวางได้ */
      FURN.items.filter(it => it.scope === scope && it.cat === cat && !it.noShop).forEach(it=>{
        wrap.appendChild(makeCard({
          key: it.id,
          /* ⚠ เฟส 11: เฟอร์นิเจอร์ซื้อซ้ำได้ ⇒ ต้องส่ง **`repeat:true`** ด้วย
             ไม่งั้น `renderBuyBar()` จะตั้ง `sel.owned = true` หลังซื้อสำเร็จ แล้วแถบเปลี่ยนเป็น
             "✓ มีแล้ว" ⇒ **กดซื้อซ้ำไม่ได้จนกว่าจะไปกดสินค้าชิ้นอื่นก่อน**
             (ผู้ใช้แจ้งบั๊กนี้ 2026-08-14) · `nameFn` ให้แถบอัปเดตจำนวนที่มีหลังซื้อทันที
             ⚠ ของที่ **ชนเพดานแล้ว** ส่ง `owned:true` เพื่อให้การ์ด/แถบขึ้น "✓ มีครบแล้ว"
               และกดซื้อไม่ได้ (กันเด็กกดแล้วโดนปฏิเสธซ้ำๆ โดยไม่รู้ว่าทำไม) */
          name: furnLabel(it),
          nameFn: ()=> furnLabel(it),
          price: priceFurn(it.id), owned: furnFull(it), repeat: !furnFull(it), emoji: it.emoji,
          maxed: furnFull(it), maxedFn: ()=> furnFull(it),
          preview: {kind:'furn', id: it.id},
          onBuy: ()=> buyFurn(it.id),
        }));
      });
    }

    /* ยอดเงินเปลี่ยนจากที่อื่น (เช่นได้เหรียญจากเควสต์) ระหว่างเปิดร้านอยู่ → วาดใหม่ให้ราคาไม่ค้างจาง */
    document.addEventListener('owlcoins', ()=>{ if(isOpen()){ renderItems(); renderBuyBar(); } });

    return {
      ECON_VER, SHOPS, TIER_PRICE, FIT_PRICE, FIT_NAMES,   /* FIT_NAMES: ชุดเทสเฟส 8 ใช้ตรวจว่าชื่อไทยครบทุกแบบ */
      migrate, invalidate,
      priceFurn, priceFit, ownsFurn, ownsFit,
      furnCount, addFurnCount,          /* เฟส 11: เฟอร์นิเจอร์นับเป็นจำนวนชิ้น */
      FURN_MAX, furnMax,                /* เพดานจำนวนต่อไอดี (js/house-play.js กับหน้าเทสอ่านค่านี้) */
      buyFurn, buyFit,
      /* สัตว์เลี้ยง (เฟส 3A) — house.js ใช้ล็อกหน้าเลือกสัตว์ + เทสเรียกตรวจสิทธิ์ */
      PET_PRICE, PET_COLOR_PRICE, PET_GROUPS,
      pricePet, ownsPet, ownsPetColor, buyPet, buyPetColor,
      petTypes,        /* PET_TYPES อยู่ใน IIFE ของ house.js — ทางเดียวที่เทสมองเห็นคือผ่านตรงนี้ */
      /* ปลอกคอ + ของเล่นสัตว์เลี้ยง (เฟส 12) — house.js อ่านคลังนี้ไปวาดปลอกคอ 3D กับเมนูฟองของน้อง */
      PET_COLLARS, COLLAR_COLORS, PET_TOYS,
      ownsCollar, ownsToy, ownedCollars, ownedToys, buyCollar, buyToy,
      starterHome, starterFit, STARTER_FURN,
      grantFree,                       /* เฟส 11: ของรางวัลจากการเก็บของสะสมครบชุด (ไม่ตัดเงิน) */
      devUnlockAll, devLockAll,        /* เครื่องมือเทสเท่านั้น — ห้ามเรียกจากโค้ดเกมจริง */
      shopForLot, open, close, isOpen, clearSelected,
      refresh: ()=>{ if(isOpen()){ renderItems(); renderBuyBar(); } },
    };
  };
})();
