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
     แถวที่ไม่อยู่ในตาราง = ฟรีทั้งแถว (เพศ/รูปทรงดวงตา = หน้าตาเด็กเอง ไม่ใช่ของซื้อ
     ส่วนสีของหมวก/แว่น/เป้/ของถือ ฟรี เพราะต้องซื้อตัวของก่อนถึงจะเห็นสีอยู่แล้ว) */
  const FIT_PRICE = {
    hair:30, hairC:30, eyeC:30,
    shirt:15, bottom:15, shoes:15,
    pattern:40,
    hat:60, glass:60,
    bag:80, hold:80,
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
  };

  const ECON_VER = 2;

  /* ---------- ผังร้าน ----------
     เฟส 1 เปิด 2 ร้าน: ห้างเฟอร์นิเจอร์ (ของตกแต่งทั้งหมด) + ห้างแฟชั่น (ชุดแต่งตัวทั้งหมด)
     ⚠ ห้างเฟอร์นิเจอร์ขาย **ทุกหมวด** รวมของนอกบ้าน (สวน/เครื่องเล่น/ที่นั่งนอกบ้าน) ไปก่อน
        เพราะร้านต้นไม้กับร้านของเล่นยังไม่เปิดจนเฟส 2-3 — ถ้าไม่ขายตรงนี้ของกลุ่มนั้นจะซื้อไม่ได้เลย
        (ผิดกติกาเหล็กข้อ 1 "ห้ามมี dead end") พอเปิดร้านที่เหลือแล้วค่อยย้ายหมวดไปตามข้อ 17.4 */
  const SHOPS = {
    'mall-furniture': {kind:'furn',   icon:'🛋️', title:'ห้างเฟอร์นิเจอร์',
                       sub:'เลือกของไปแต่งบ้านได้เลย! กดที่ของเพื่อซื้อ แล้วไปวางในโหมดตกแต่งบ้านนะ'},
    'mall-fashion':   {kind:'fashion', icon:'👗', title:'ห้างแฟชั่น',
                       sub:'ซื้อชุดใหม่ให้ตัวเองได้เลย! ซื้อแล้วไปใส่ที่ปุ่มแต่งตัวนะ'},
  };

  window.HOUSE_SHOP = function(kit){
    const FURN   = kit.FURN;
    const H_ROWS = kit.H_ROWS;
    const DEF    = kit.H_DEFAULT_CHAR || {};
    const load   = kit.load, save = kit.save;
    const onChange = kit.onChange || function(){};

    const $ = id => document.getElementById(id);
    const click = () => { if(typeof playClick === 'function') playClick(); };
    const toast = (ic, msg) => { if(typeof showToast === 'function') showToast(ic, msg); };
    const coins = () => (window.OwlCoins ? window.OwlCoins.get() : 0);

    /* ---------- คลังสิทธิ์ ----------
       เก็บเป็นอาเรย์ string ก้อนเดียวใน house save (`data.unlocked`)
       เฟอร์นิเจอร์ = id ตรงๆ ('sofa') · ชุดแต่งตัว = 'fit:<แถว>:<index>' ('fit:hat:3')
       cache ไว้ใน Set เพราะตอนวาดกล่องเลือกของถูกถามทีละชิ้นเป็นร้อยครั้ง — ล้าง cache เมื่อ
       เปลี่ยนเด็ก (kit.childId เปลี่ยน) หรือมีการซื้อ/migrate (invalidate) */
    let ownSet = null, ownFor = null;
    function fitKey(row, i){ return 'fit:' + row + ':' + i; }
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
      const el = $('house-shop');
      if(!el) return false;
      const t = $('house-shop-title'), sb = $('house-shop-sub');
      if(t)  t.textContent  = cfg.icon + ' ' + cfg.title;
      if(sb) sb.textContent = cfg.sub;
      el.hidden = false;
      document.body.classList.add('house-shop-open');
      renderTabs();
      renderItems();
      return true;
    }
    function close(){
      if(!isOpen()) return;
      openId = null;
      const el = $('house-shop');
      if(el) el.hidden = true;
      document.body.classList.remove('house-shop-open');
    }

    /* รายการแท็บหมวด — รายการที่มี `sec` คือ "หัวข้อกลุ่ม" (ไม่ใช่ปุ่ม กดไม่ได้)
       ของเยอะจนแท็บล้นแถวเดียว จึงจัดกลุ่มให้เด็กกวาดตาหาหมวดที่ต้องการเจอเร็วขึ้น */
    /* ชื่อแท็บสั้นลงเฉพาะในร้าน (หน้าแต่งตัวยังใช้ชื่อเต็มเหมือนเดิม)
       — ชื่อยาวกินความกว้าง 1 แถวเต็มบนมือถือ ทำให้แถบหมวดสูงขึ้นอีกบรรทัดโดยไม่จำเป็น */
    const TAB_SHORT = {bottom:'สีกางเกง'};
    const FASHION_GROUPS = [
      {sec:'💇 ผม',       keys:['hair','hairC']},
      {sec:'👀 ดวงตา',    keys:['eyeC']},
      {sec:'👕 เสื้อผ้า',  keys:['pattern','shirt','bottom','shoes']},
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
          rows.forEach(r => out.push({id:r.key, label:TAB_SHORT[r.key] || r.label, emoji:''}));
        });
        return out;
      }
      /* ร้านเฟอร์นิเจอร์: กลุ่ม "ในบ้าน" ก่อน แล้วต่อด้วยกลุ่ม "นอกบ้าน" */
      [['in','🏠 ในบ้าน'], ['out','🌳 นอกบ้าน']].forEach(([sc, label])=>{
        const cats = FURN.cats[sc] || [];
        if(!cats.length) return;
        out.push({sec:label});
        cats.forEach(c => out.push({id:sc + ':' + c.id, label:c.label, emoji:c.emoji}));
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
        b.innerHTML = (c.emoji ? '<span class="he-tab-emoji">' + c.emoji + '</span>' : '')
                    + '<span>' + c.label + '</span>';
        b.onclick = ()=>{ click(); shopTab = c.id; renderTabs(); renderItems(); };
        wrap.appendChild(b);
        /* แท็บขึ้นบรรทัดใหม่ได้ (ไม่เลื่อนแนวนอนแล้ว) แต่ถ้ากลุ่มยาวจนต้องเลื่อนแนวตั้ง
           ก็ยังต้องเลื่อนแท็บที่เลือกอยู่มาให้เห็น ไม่งั้นเด็กงงว่าดูหมวดไหนอยู่ */
        if(c.id === shopTab && b.scrollIntoView) setTimeout(()=>b.scrollIntoView({block:'nearest', inline:'nearest'}), 0);
      });
    }

    function hex(v){ return '#' + v.toString(16).padStart(6, '0'); }
    /* การ์ดสินค้า 1 ใบ — ของที่ซื้อแล้วขึ้น ✓, เงินไม่พอขึ้นราคาสีจางแต่ยังเห็น (ไม่ซ่อน) */
    function makeCard(opts){
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hs-card' + (opts.owned ? ' hs-owned' : (coins() < opts.price ? ' hs-poor' : ''));
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
      if(!opts.owned) b.onclick = opts.onBuy;
      else b.onclick = ()=>{ click(); toast('✓', opts.name + ' มีอยู่แล้วนะ'); };
      return b;
    }

    function renderItems(){
      const wrap = $('house-shop-items');
      if(!wrap) return;
      wrap.innerHTML = '';
      const cfg = SHOPS[openId];
      if(!cfg || !shopTab) return;
      if(cfg.kind === 'fashion'){
        const row = H_ROWS.find(r => r.key === shopTab);
        if(!row) return;
        const n = row.type === 'color' ? row.colors.length : (row.type === 'num' ? row.n : 0);
        for(let i = 0; i < n; i++){
          const price = priceFit(row.key, i);
          if(price === 0) continue;                 /* ตัวเลือกฟรี (เช่น "ไม่ใส่") ไม่ต้องวางขาย */
          const nm = (FIT_NAMES[row.key] && FIT_NAMES[row.key][i]) || (row.label + ' ' + (i + 1));
          const owned = ownsFit(row.key, i);
          wrap.appendChild(makeCard({
            name: nm, price, owned,
            color: row.type === 'color' ? row.colors[i] : null,
            emoji: String(i + 1),
            onBuy: ()=>{ click(); if(buyFit(row.key, i, nm)) renderItems(); },
          }));
        }
        return;
      }
      const parts = shopTab.split(':'), scope = parts[0], cat = parts[1];
      FURN.items.filter(it => it.scope === scope && it.cat === cat).forEach(it=>{
        const price = priceFurn(it.id);
        const owned = ownsFurn(it.id);
        wrap.appendChild(makeCard({
          name: it.name, price, owned, emoji: it.emoji,
          onBuy: ()=>{ click(); if(buyFurn(it.id)) renderItems(); },
        }));
      });
    }

    /* ยอดเงินเปลี่ยนจากที่อื่น (เช่นได้เหรียญจากเควสต์) ระหว่างเปิดร้านอยู่ → วาดใหม่ให้ราคาไม่ค้างจาง */
    document.addEventListener('owlcoins', ()=>{ if(isOpen()) renderItems(); });

    return {
      ECON_VER, SHOPS, TIER_PRICE, FIT_PRICE,
      migrate, invalidate,
      priceFurn, priceFit, ownsFurn, ownsFit,
      buyFurn, buyFit,
      starterHome, starterFit, STARTER_FURN,
      shopForLot, open, close, isOpen,
      refresh: ()=>{ if(isOpen()) renderItems(); },
    };
  };
})();
