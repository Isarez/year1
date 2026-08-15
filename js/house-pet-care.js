/* โหมด "บ้านของหนู" — เฟส 3B: อาหารสัตว์ · ความหิว · ป่วย · หมอ
   + เฟส 12: ค่าความสุข · อาบน้ำ/สกปรก · สอนท่า · ปลอกคอ (แผนข้อ 48)
   (แผนแม่บทข้อ 18.2-18.4 ของ QUEST-DESIGN.md)

   ไฟล์นี้เป็น **ตรรกะล้วน ไม่แตะ DOM/WebGL เลย** เหมือน js/house-quests.js
   ฝั่งหน้าจอ (ชามอาหาร แถบหัวใจ การ์ดคุณหมอ) อยู่ใน js/house.js · เปิดออกมาที่ window.HousePetCare

   กติกาเหล็กที่ไฟล์นี้ต้องไม่ละเมิด (หัวเอกสาร QUEST-DESIGN.md):
     ข้อ 1 ห้ามมี dead end  — เงินไม่พอค่ารักษา ⇒ ทำงานช่วยคุณหมอแทนได้เสมอ (owe)
     ข้อ 2 ห้ามลงโทษเด็ก    — สัตว์**ไม่ตาย** ไม่หักเงิน ไม่หักดาว · ให้อาหารผิดชนิดก็ไม่เสียของ
     ข้อ 3 ห้ามทำข้อมูลเก่าหาย — เด็กที่เลี้ยงสัตว์อยู่ก่อนเฟส 3B เริ่มที่อิ่มเต็ม 100 + ได้อาหารถุงแรกฟรี
     ข้อ 5 เงินต้องผ่าน window.OwlCoins เท่านั้น
     ข้อ 6 static + localStorage ล้วน */
(function(){
  'use strict';

  /* ---------- ตารางอาหาร (ข้อ 18.2) ----------
     **นี่คือของเล่นสอนจริง** เด็กต้องรู้ว่าสัตว์ตัวไหนกินอะไร ⇒ ให้ผิดชนิดสัตว์ส่ายหัวไม่กิน
     แต่ไม่เสียของ ไม่เสียเงิน ลองใหม่ได้ไม่จำกัด (กติกาเหล็กข้อ 2)
     ⚠ สัตว์ทุกชนิดใน PET_TYPES ต้องมีอาหารของตัวเองเสมอ ไม่งั้นเลี้ยงแล้วให้อาหารไม่ได้เลย = dead end
       (มีเทสคุมไว้ที่ tests/house-pet-care.spec.js)
     `color` = สีของก้อนอาหารในชามตอนเล่นอนิเมชันป้อนอาหารในฉาก 3D (js/house.js) */
  const FOOD = [
    {id:'meat',   emoji:'🍖', name:'อาหารเนื้อ',  price:60,  color:0xd0694a, pets:['dog']},
    {id:'fish',   emoji:'🐟', name:'อาหารปลา',   price:60,  color:0x7fb6d9, pets:['cat','penguin']},
    {id:'veg',    emoji:'🥕', name:'ผักสด',      price:50,  color:0xf0913f, pets:['rabbit','turtle']},
    {id:'seed',   emoji:'🌾', name:'เมล็ดพืช',    price:45,  color:0xe8c874, pets:['chick','hamster']},
    {id:'hay',    emoji:'🌿', name:'หญ้าแห้ง',    price:50,  color:0xc9b56a, pets:['sheep','pig']},
    {id:'bug',    emoji:'🦗', name:'แมลง',       price:55,  color:0x8a9a5b, pets:['frog']},
    {id:'bamboo', emoji:'🎋', name:'ไผ่',        price:90,  color:0x7cb342, pets:['panda']},
    {id:'magic',  emoji:'🌈', name:'อาหารวิเศษ',  price:150, color:0xf2a0c8, pets:['unicorn']},
  ];

  const MEALS_PER_BAG = 5;    /* 1 ถุง = 5 มื้อ (เก็บใน data.petFood เป็น "จำนวนมื้อ" ไม่ใช่จำนวนถุง) */
  const FEED_GAIN     = 50;   /* 1 มื้อ = อิ่มขึ้น 50 ⇒ ถุงนึงอยู่ได้ ~7 วันเล่น */
  const DAY_DROP      = 35;   /* ลดต่อ "วันที่เด็กเข้าเล่น" ไม่ใช่เวลาจริง (ข้อ 18.3) */
  const FULL_MAX      = 100;
  const LOW_AT        = 50;   /* ต่ำกว่านี้ = โชว์แถบหัวใจเหนือหัว + สัตว์เริ่มบ่นหิว */
  const SICK_DAYS     = 2;    /* อิ่ม 0 ติดกัน 2 วันเล่น ถึงจะป่วย (มีคำเตือนล่วงหน้าเต็มวัน) */
  const CURE_COST     = 120;  /* ค่ารักษาที่โรงพยาบาล (ข้อ 18.4) */

  /* ---------- เฟส 12: ค่าความสุข (ข้อ 48.1) ----------
     คนละเรื่องกับ "ความอิ่ม" — อิ่มคือหน้าที่ (ให้อาหารไม่งั้นป่วย) ส่วนความสุขคือความผูกพัน
     ⚠ **ห้ามผูกความสุขกับบทลงโทษใดๆ** (กติกาเหล็กข้อ 2) ต่ำสุดที่เกิดขึ้นได้คือ "น้องไปนอนพักในบ้าน"
       ซึ่งแก้ได้ทันทีด้วยลูบหัว/อาบน้ำที่ทำได้ฟรีเสมอ ไม่ต้องใช้เงินสักบาท (ห้ามมี dead end — ข้อ 1) */
  const HAPPY_MAX   = 100;
  const HAPPY_DROP  = 20;   /* ลดต่อ "วันที่เด็กเข้าเล่น" เหมือนความอิ่ม (ไม่ใช่เวลาจริง) */
  const DIRTY_EXTRA = 10;   /* ตัวสกปรกแล้วความสุขลดเร็วขึ้นวันละเท่านี้ */
  const SLEEP_AT    = 25;   /* ต่ำกว่านี้ = น้องไปนอนในบ้านสัตว์ ไม่เดินตามเด็ก (ผู้ใช้สั่ง 2026-08-14) */
  const DIRTY_DAYS  = 2;    /* ไม่ได้อาบน้ำติดกันกี่วันเล่นถึงจะมีรอยเปื้อนบนตัว */

  /* แต้มความสุขต่อ action (ผู้ใช้อนุมัติ 2026-08-14) — **ทุกอย่างไม่ให้เหรียญเลยสักบาท** */
  const PAT_GAIN    = 3;    const PAT_CAP    = 5;   /* ลูบหัวได้ไม่จำกัด แต่ได้แต้มวันละ 5 ครั้ง */
  const BATH_GAIN   = 25;                          /* อาบน้ำวันละครั้ง */
  const BALL_GAIN   = 6;                           /* คาบบอลกลับมา 1 ครั้ง */
  const TRICK_GAIN  = 12;   const TRICK_CAP  = 3;   /* สอนท่าเดิมได้แต้มวันละ 3 รอบ */
  const FEED_HAPPY  = 5;                           /* ให้อาหารก็ดีใจด้วย */
  const TRICK_NEED  = 5;    /* สอนสำเร็จกี่รอบน้องถึงทำท่านั้นเองได้ตลอดไป */

  /* 5 ท่าที่สอนได้ — เลือกให้ "เงารวม" ต่างกันชัด เด็กดูออกว่าน้องทำท่าอะไรโดยไม่ต้องอ่าน */
  const TRICKS = [
    {id:'sit',  emoji:'🪑', name:'นั่ง',      cue:'นั่ง!'},
    {id:'spin', emoji:'🔄', name:'หมุนตัว',   cue:'หมุน!'},
    {id:'high', emoji:'🙌', name:'ไฮไฟว์',    cue:'ไฮไฟว์!'},
    {id:'jump', emoji:'🤸', name:'กระโดด',    cue:'กระโดด!'},
    {id:'roll', emoji:'😴', name:'นอนกลิ้ง',  cue:'กลิ้ง!'},
  ];
  const TRICK_BY_ID = {};
  TRICKS.forEach(t => { TRICK_BY_ID[t.id] = t; });

  const FOOD_BY_ID = {};
  FOOD.forEach(f => { FOOD_BY_ID[f.id] = f; });
  const FOOD_FOR_PET = {};
  FOOD.forEach(f => f.pets.forEach(p => { FOOD_FOR_PET[p] = f.id; }));

  window.HOUSE_PET_CARE = function(kit){
    kit = kit || {};
    const load   = kit.load   || function(){ return {}; };
    const save   = kit.save   || function(){};
    const dayKey = kit.dayKey || function(){ const d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); };
    const onChange = kit.onChange || function(){};
    const coins = () => (window.OwlCoins ? window.OwlCoins.get() : 0);

    /* ---------- สถานะ ----------
       data.care     = {day, full, hungry, sick, owe,
                        happy, bathDay, noBath, dirty, pat, patDay,   ← เฟส 12
                        tricks:{<id>:รอบที่สอนสำเร็จ}, trickDay:{d:วันนี้, n:{<id>:รอบวันนี้}},
                        collar:{s:แบบ, c:สี}}
       data.petFood  = {<foodId>: จำนวนมื้อคงเหลือ}
       เก็บใน house save ก้อนเดิม ⇒ export/import ย้ายเครื่องตามไปเองอยู่แล้ว */
    function blank(){
      return {day: dayKey(), full: FULL_MAX, hungry: 0, sick: false, owe: false,
              happy: HAPPY_MAX, bathDay: dayKey(), noBath: 0, dirty: false,
              pat: 0, patDay: dayKey(), tricks: {}, trickDay: {d: dayKey(), n: {}},
              collar: {s: 'classic', c: 0}};
    }
    /* เติมช่องของเฟส 12 ให้ข้อมูลเก่าที่ยังไม่มี — คืน true ถ้าเติมจริง (กติกาเหล็กข้อ 3)
       ⚠ **น้องที่เลี้ยงอยู่ก่อนเฟส 12 ต้องเริ่มที่ความสุขเต็มและถือว่าอาบน้ำแล้ววันนี้**
         ไม่งั้นเด็กเปิดเกมมาเจอน้องนอนซมอยู่ในบ้านทั้งที่ไม่ได้ทำอะไรผิด */
    function fillV12(c){
      if(typeof c.happy === 'number') return false;
      const today = dayKey();
      c.happy   = HAPPY_MAX;
      c.bathDay = today; c.noBath = 0; c.dirty = false;
      c.pat = 0; c.patDay = today;
      c.tricks = c.tricks || {};
      c.trickDay = {d: today, n: {}};
      c.collar = c.collar || {s: 'classic', c: 0};
      return true;
    }
    function petOf(d){ return (d && d.pet) || null; }

    /* อ่านสถานะ + เดินเวลาให้ทันวันนี้ (เรียกได้บ่อยเท่าไหร่ก็ได้ เขียน save เฉพาะตอนมีอะไรเปลี่ยนจริง)
       ⚠ ความอิ่มลดตาม "วันที่เข้าเล่น" ⇒ หายไป 3 เดือนกลับมาก็แค่หิว 1 วัน ไม่ป่วยทันที (ข้อ 18.3)
         เด็กที่หายไปนานต้องไม่ถูกลงโทษ นี่คือหัวใจของกติกาเหล็กข้อ 2 */
    function sync(){
      const d = load() || {};
      if(!petOf(d)) return null;                 /* ไม่มีสัตว์ = ไม่มีอะไรให้ดูแล */
      let c = d.care, dirty = false;
      if(!c || typeof c.full !== 'number'){
        c = blank(); dirty = true;
        /* เด็กที่เลี้ยงสัตว์อยู่ก่อนเฟส 3B (หรือเพิ่งรับเลี้ยง) — แถมอาหารถุงแรกให้ตรงชนิดสัตว์
           ไม่งั้นเปิดเกมมาเจอน้องหิวแต่ยังไม่มีเงินซื้ออาหาร = ทางตันตั้งแต่ยังไม่ทันเริ่ม */
        if(!d.petFood) d.petFood = {};
        const fid = FOOD_FOR_PET[d.pet.type];
        if(fid && !d.petFood[fid]) d.petFood[fid] = MEALS_PER_BAG;
      }
      if(fillV12(c)) dirty = true;
      const today = dayKey();
      if(c.day !== today){
        c.day = today;
        c.full = Math.max(0, c.full - DAY_DROP);
        /* นับ "วันเล่นที่ปล่อยให้หิวสนิท" ติดกัน — ครบ 2 วันถึงป่วย ให้เด็กมีเวลาแก้ตัวเต็มวัน */
        c.hungry = c.full <= 0 ? (c.hungry | 0) + 1 : 0;
        if(c.hungry >= SICK_DAYS) c.sick = true;
        /* ---------- เฟส 12: ความสุข + วันอาบน้ำ ----------
           ⚠ เดินทีละ "วันเล่น" เหมือนความอิ่มเป๊ะ ⇒ หายไป 3 เดือนกลับมาก็ลดแค่รอบเดียว */
        if(c.bathDay !== today) c.noBath = (c.noBath | 0) + 1;
        c.dirty = (c.noBath | 0) >= DIRTY_DAYS;
        c.happy = Math.max(0, (c.happy | 0) - HAPPY_DROP - (c.dirty ? DIRTY_EXTRA : 0));
        c.pat = 0; c.patDay = today;
        c.trickDay = {d: today, n: {}};
        dirty = true;
      }
      if(dirty){ d.care = c; save({care: c, petFood: d.petFood || {}}); }
      return c;
    }

    function state(){ return sync(); }
    function fullness(){ const c = sync(); return c ? c.full : FULL_MAX; }
    function isSick(){ const c = sync(); return !!(c && c.sick); }
    function isHungry(){ const c = sync(); return !!(c && c.full < LOW_AT); }
    function owesWork(){ const c = sync(); return !!(c && c.owe); }

    /* ---------- คลังอาหาร ---------- */
    function meals(id){
      const d = load() || {};
      return ((d.petFood || {})[id]) | 0;
    }
    function bagsAll(){
      const d = load() || {}, f = d.petFood || {}, out = {};
      FOOD.forEach(x => { out[x.id] = f[x.id] | 0; });
      return out;
    }
    function addMeals(id, n){
      if(!FOOD_BY_ID[id]) return false;
      const d = load() || {}, f = Object.assign({}, d.petFood || {});
      f[id] = Math.max(0, (f[id] | 0) + (n | 0));
      save({petFood: f});
      onChange();
      return true;
    }
    /* ซื้อ 1 ถุงจากร้านสัตว์เลี้ยง — ตัดเงินผ่าน OwlCoins เท่านั้น (กติกาเหล็กข้อ 5) */
    function buyBag(id){
      const f = FOOD_BY_ID[id];
      if(!f || !window.OwlCoins) return false;
      if(coins() < f.price) return false;
      if(!window.OwlCoins.spend(f.price)) return false;
      addMeals(id, MEALS_PER_BAG);
      return true;
    }
    function foodForPet(type){ return FOOD_FOR_PET[type] || null; }

    /* ---------- ให้อาหาร ----------
       คืน {ok, reason} — reason: 'nopet' | 'sick' | 'empty' | 'wrong' | 'stuffed'
       ⚠ 'wrong' = ให้ผิดชนิด **ห้ามหักของในคลัง** สัตว์แค่ส่ายหัว เด็กลองใหม่ได้เรื่อยๆ */
    function feed(id){
      const d = load() || {}, pet = petOf(d);
      if(!pet) return {ok:false, reason:'nopet'};
      const c = sync();
      if(c.sick) return {ok:false, reason:'sick'};
      if(!FOOD_BY_ID[id]) return {ok:false, reason:'wrong'};
      if(FOOD_FOR_PET[pet.type] !== id) return {ok:false, reason:'wrong'};
      if(meals(id) <= 0) return {ok:false, reason:'empty'};
      if(c.full >= FULL_MAX) return {ok:false, reason:'stuffed'};
      addMeals(id, -1);
      c.full = Math.min(FULL_MAX, c.full + FEED_GAIN);
      c.hungry = 0;
      c.happy = Math.min(HAPPY_MAX, (c.happy | 0) + FEED_HAPPY);   /* เฟส 12: อิ่มแล้วก็ดีใจด้วย */
      save({care: c});
      onChange();
      return {ok:true, full: c.full, happy: c.happy};
    }

    /* ============================================================
       เฟส 12 — ความสุข · อาบน้ำ · สอนท่า · ปลอกคอ (ข้อ 48)
       ⚠ **ทุกฟังก์ชันในบล็อกนี้ห้ามแตะเหรียญเด็ดขาด** (ผู้ใช้สั่ง 2026-08-14
         "ไม่ต้องให้เงินเด็ก") ความสุขคือรางวัลของมันเอง ไม่ใช่ช่องทางหาเงินอีกทาง
       ============================================================ */
    function happiness(){ const c = sync(); return c ? (c.happy | 0) : HAPPY_MAX; }
    /* น้องง่วง/เหงาจนไปนอนพักในบ้าน — เรียกไม่ออก ต้องลูบหัวหรืออาบน้ำให้ก่อน */
    function isSleepy(){ const c = sync(); return !!(c && (c.happy | 0) < SLEEP_AT); }
    function isDirty(){ const c = sync(); return !!(c && c.dirty); }
    function bathedToday(){ const c = sync(); return !!(c && c.bathDay === dayKey()); }
    /* เพิ่มความสุข (ตัวกลางจุดเดียว — คืนแต้มที่ได้จริงหลังชนเพดาน 100) */
    function addHappy(n){
      const c = sync();
      if(!c) return 0;
      const before = c.happy | 0;
      c.happy = Math.max(0, Math.min(HAPPY_MAX, before + (n | 0)));
      const got = c.happy - before;
      if(got !== 0){ save({care: c}); onChange(); }
      return got;
    }

    /* ---------- ลูบหัว (ทำได้ทุกที่ทั้งเมือง — ผู้ใช้สั่ง) ----------
       เกินโควตาวันนี้แล้วยัง "ลูบได้" อยู่ (น้องยังดีใจ มีอนิเมชันครบ) แค่ไม่ได้แต้มเพิ่ม
       ⚠ **ห้ามปฏิเสธการลูบหัวเด็ดขาด** — ลูบน้องแล้วโดนบอกว่า "พอแล้ว" คือการลงโทษเด็กเปล่าๆ */
    function pat(){
      const c = sync();
      if(!c) return {ok:false, reason:'nopet'};
      const today = dayKey();
      if(c.patDay !== today){ c.patDay = today; c.pat = 0; }
      const room = (c.pat | 0) < PAT_CAP;
      /* ⚠ ต้อง save ก่อนเรียก addHappy() เสมอ — sync() อ่านใหม่จาก localStorage ทุกครั้ง
         ⇒ ถ้า save ทีหลัง ก้อนเก่าในมือจะทับค่าความสุขที่ addHappy เพิ่งเขียนลงไปทิ้ง */
      if(room){ c.pat = (c.pat | 0) + 1; save({care: c}); }
      const gain = room ? addHappy(PAT_GAIN) : 0;
      if(room) onChange();
      return {ok:true, gain, capped: !room, left: Math.max(0, PAT_CAP - (c.pat | 0))};
    }

    /* ---------- อาบน้ำ (วันละครั้ง · ทำได้เฉพาะบริเวณบ้าน) ---------- */
    function bath(){
      const c = sync();
      if(!c) return {ok:false, reason:'nopet'};
      if(c.sick) return {ok:false, reason:'sick'};
      if(c.bathDay === dayKey()) return {ok:false, reason:'done'};
      c.bathDay = dayKey(); c.noBath = 0; c.dirty = false;
      save({care: c});
      const gain = addHappy(BATH_GAIN);
      onChange();
      return {ok:true, gain};
    }

    /* ---------- เล่นบอล ---------- */
    function ballFetched(){
      const c = sync();
      if(!c) return {ok:false, reason:'nopet'};
      return {ok:true, gain: addHappy(BALL_GAIN)};
    }
    /* ของเล่นชิ้นอื่น (เฟส 12.1) — แต้มต่อรอบต่างกันตามของ ส่งเข้ามาได้เลย */
    function toyPlayed(gain){
      const c = sync();
      if(!c) return {ok:false, reason:'nopet'};
      return {ok:true, gain: addHappy(gain == null ? BALL_GAIN : gain)};
    }

    /* ---------- สอนท่า ----------
       สอนสำเร็จ 5 รอบ = น้องทำท่านั้นเองได้ตลอดไป (ความคืบหน้าไม่มีวันถอยหลัง — กติกาเหล็กข้อ 2)
       คืน {ok, gain, prog, need, justLearned, capped} */
    function trickProg(id){
      const c = sync();
      return c ? ((c.tricks || {})[id] | 0) : 0;
    }
    function trickLearned(id){ return trickProg(id) >= TRICK_NEED; }
    function learnedTricks(){
      const c = sync();
      if(!c) return [];
      return TRICKS.filter(t => ((c.tricks || {})[t.id] | 0) >= TRICK_NEED).map(t => t.id);
    }
    function teach(id){
      const c = sync();
      if(!c) return {ok:false, reason:'nopet'};
      if(!TRICK_BY_ID[id]) return {ok:false, reason:'notrick'};
      if(c.sick) return {ok:false, reason:'sick'};
      const today = dayKey();
      if(!c.trickDay || c.trickDay.d !== today) c.trickDay = {d: today, n: {}};
      const done = c.trickDay.n[id] | 0;
      const capped = done >= TRICK_CAP;
      c.trickDay.n[id] = done + 1;
      c.tricks = c.tricks || {};
      const before = c.tricks[id] | 0;
      const prog = Math.min(TRICK_NEED, before + 1);
      c.tricks[id] = prog;
      save({care: c});
      const gain = capped ? 0 : addHappy(TRICK_GAIN);
      onChange();
      return {ok:true, gain, prog, need: TRICK_NEED, capped,
              justLearned: before < TRICK_NEED && prog >= TRICK_NEED};
    }

    /* ---------- ปลอกคอ ----------
       "แบบ/สีที่ซื้อแล้ว" เก็บใน data.unlocked ฝั่ง HouseShop · ที่นี่จำแค่ "ตอนนี้ใส่อันไหน" */
    function collar(){
      const c = sync();
      const v = (c && c.collar) || null;
      return {s: (v && v.s) || 'classic', c: (v && v.c) | 0};
    }
    function setCollar(style, color){
      const c = sync();
      if(!c) return false;
      c.collar = {s: style || 'classic', c: color | 0};
      save({care: c});
      onChange();
      return true;
    }

    /* ---------- คุณหมอ (ข้อ 18.4) ----------
       ป่วยแล้ว **ไม่หายเอง** ต้องคุยหมอเท่านั้น · จ่าย 120 🪙 หรือถ้าเงินไม่พอก็ทำงานช่วยหมอแทน
       คืน 'cured' | 'quest' | 'well' | 'nopet' */
    function cure(){
      const c = sync();
      if(!c) return 'nopet';
      if(!c.sick) return 'well';
      if(coins() >= CURE_COST && window.OwlCoins && window.OwlCoins.spend(CURE_COST)){
        heal(c);
        return 'cured';
      }
      /* เงินไม่พอ → หมอไม่ไล่กลับ ให้ทำงานแทนค่ารักษา (ห้ามมี dead end — กติกาเหล็กข้อ 1) */
      c.owe = true;
      save({care: c});
      onChange();
      return 'quest';
    }
    function heal(c){
      c.sick = false; c.owe = false; c.hungry = 0; c.full = FULL_MAX;
      save({care: c});
      onChange();
    }
    /* เรียกทุกครั้งที่เด็กเล่นเควสต์จบ (js/house.js) — ถ้าติดค้างงานคุณหมออยู่ ถือว่าใช้หนี้ครบ
       คืน true เมื่อเพิ่งรักษาหายรอบนี้ (house.js เอาไปขึ้นข้อความ/เอฟเฟกต์) */
    function questDone(){
      const c = sync();
      if(!c || !c.owe) return false;
      heal(c);
      return true;
    }

    /* รับเลี้ยงตัวใหม่ = เริ่มนับใหม่หมด + แถมอาหารถุงแรกของชนิดนั้นให้ (กันทางตัน)
       ⚠ เรียกหลัง saveHouseData({pet:…}) แล้วเท่านั้น เพราะอ่านชนิดสัตว์จาก save */
    function onAdopt(){
      const d = load() || {}, pet = petOf(d);
      if(!pet) return;
      const c = blank();
      const f = Object.assign({}, d.petFood || {});
      const fid = FOOD_FOR_PET[pet.type];
      if(fid && !(f[fid] | 0)) f[fid] = MEALS_PER_BAG;
      save({care: c, petFood: f});
      onChange();
    }
    /* ปล่อยสัตว์คืน — ล้างสถานะสุขภาพทิ้ง (แต่ **ไม่แตะคลังอาหาร** ที่เด็กซื้อไว้ ยังเป็นของเขา
       รับตัวเดิมกลับมาเลี้ยงใหม่แล้วอาหารที่เหลือต้องยังอยู่ครบ) */
    function onRelease(){ save({care: null}); onChange(); }

    /* ---------- เครื่องมือเทสเท่านั้น (js/house-devtools.js) ----------
       ⚠ **ห้ามเรียกจากโค้ดเกมจริง** — ความหิว/ป่วยในเกมต้องมาจากการเดินวันเล่นเท่านั้น
         มีไว้เพราะการรอ "2 วันเล่น" เพื่อเทสสัตว์ป่วยด้วยการเล่นจริงทำไม่ไหว */
    function petType(){ const d = load() || {}; return d.pet ? d.pet.type : ''; }
    function setFull(v){
      const c = sync(); if(!c) return false;
      c.full = Math.max(0, Math.min(FULL_MAX, v | 0));
      c.hungry = c.full <= 0 ? Math.max(1, c.hungry | 0) : 0;
      save({care: c}); onChange();
      return true;
    }
    function setHappy(v){
      const c = sync(); if(!c) return false;
      c.happy = Math.max(0, Math.min(HAPPY_MAX, v | 0));
      save({care: c}); onChange();
      return true;
    }
    /* บังคับให้ตัวเปื้อน/สะอาดทันที (เทสรอ 2 วันเล่นจริงไม่ไหวเหมือนกัน) */
    function setDirty(on){
      const c = sync(); if(!c) return false;
      if(on){ c.dirty = true; c.noBath = DIRTY_DAYS; c.bathDay = ''; }
      else { c.dirty = false; c.noBath = 0; c.bathDay = dayKey(); }
      save({care: c}); onChange();
      return true;
    }
    function setSick(on){
      const c = sync(); if(!c) return false;
      if(on){ c.sick = true; c.full = 0; c.hungry = SICK_DAYS; save({care: c}); onChange(); }
      else heal(c);
      return true;
    }

    return {
      FOOD, MEALS_PER_BAG, FEED_GAIN, DAY_DROP, FULL_MAX, LOW_AT, SICK_DAYS, CURE_COST,
      petType, setFull, setSick, setHappy, setDirty,   /* เครื่องมือเทสเท่านั้น */
      state, fullness, isSick, isHungry, owesWork,
      meals, bagsAll, addMeals, buyBag, foodForPet,
      feed, cure, questDone, onAdopt, onRelease,
      /* ---- เฟส 12 ---- */
      TRICKS, TRICK_NEED, TRICK_CAP, HAPPY_MAX, HAPPY_DROP, SLEEP_AT, DIRTY_DAYS,
      PAT_GAIN, PAT_CAP, BATH_GAIN, BALL_GAIN, TRICK_GAIN, FEED_HAPPY,
      happiness, isSleepy, isDirty, bathedToday, addHappy,
      pat, bath, ballFetched, toyPlayed,
      trickProg, trickLearned, learnedTricks, teach,
      collar, setCollar,
    };
  };
})();
