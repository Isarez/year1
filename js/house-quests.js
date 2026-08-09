/* ============================================================
   บ้านของหนู — เครื่องยนต์เควสต์ (เฟส 2 ของแผนแม่บท QUEST-DESIGN.md)

   ไฟล์นี้ประกาศ global HOUSE_QUESTS(kit) คืน API ให้ js/house.js เรียกใช้
   (โหลดหลัง house-shop.js ก่อน house.js — **ไม่แตะ THREE/WebGL และไม่แตะ DOM เลย**
    เป็น catalog + ตัวสุ่ม + ตัวคิดรางวัลล้วนๆ หน้าตา/ป้าย "!" อยู่ใน house.js ทั้งหมด
    จึงเทสได้ง่ายเหมือน house-furniture.js)

   หน้าที่ 5 อย่าง:
     1) กลไกเควสต์ (mechanic) — เฟส 2 มี 2 แบบ: `quiz` (ดึงคำถามจริงจาก CATS ตามระดับชั้น)
        และ `count` (นับของตามธีมร้าน) · เฟสถัดๆ ไปเติมได้ที่ MECHS ตัวเดียว
     2) สุ่มรายวันแบบ seeded — เด็กคนเดิม + วันเดิม = โจทย์เดิมเสมอ (กด reroll ไม่ได้)
     3) กระดานเควสต์ 5 ชุด/วัน โควตาแยกจาก NPC เด็ดขาด + โบนัสครบ 100 🪙
     4) สูตรรางวัล ดาว → เหรียญ (ข้อ 6 + ข้อ 19 ของแผนแม่บท)
     5) ประตูเช็คความพร้อม (ข้อ 24) — โจทย์สูงกว่าชั้น 1 ระดับ ต้องผ่านเกณฑ์ + เด็กกดรับเอง

   ⚠ กติกาเหล็กจาก QUEST-DESIGN.md ที่ผูกกับไฟล์นี้:
     - **เงินต้องผ่าน `window.OwlCoins` เท่านั้น** ไฟล์นี้แค่ "คิดว่าได้กี่เหรียญ" แล้วคืนตัวเลข
       คนที่เรียก `OwlCoins.add()` จริงคือ js/house.js จุดเดียว
     - **ห้ามลงโทษเด็ก** ตอบผิดกี่ครั้งก็ได้ ไม่มีเวลาจับ ไม่มีการหักดาว/หักเงิน
       ตอบผิด = แค่ดาวลดลง (ต่ำสุด 1 ดาว ได้เงินเสมอ)
     - **ห้ามมี dead end** ทุกเควสต์เล่นจบได้เสมอ ถ้าคลังคำถามของชั้นนั้นว่าง จะถอยไปใช้ `count`
       ที่สร้างโจทย์เองได้โดยไม่ง้อ CATS
     - ข้อมูลเก็บใน house save ก้อนเดิม (`data.q2`) ผ่าน kit.load/kit.save → export/import ตามไปเอง
   ============================================================ */
(function(){
  'use strict';

  /* ---------- สูตรรางวัล (ข้อ 6 + ข้อ 19 ของแผนแม่บท) ----------
     เหรียญ = base(ตระกูลเควสต์) × mulStar   (ตัวคูณระดับชั้น = 1.0 ทุกชั้น)
     ⚠️ **จูนลง ~3 เท่าเมื่อ 2026-08-08 ตามคำสั่งผู้ใช้ — ห้ามปรับขึ้นกลับโดยไม่ถามก่อน**
     ของทั้งเกมรวม ~15,800 🪙 (เฟอร์นิเจอร์ 116 ชิ้น 11,005 + ของแต่งตัว 160 ชิ้น 4,780)
     ของเดิม (base A=18 · board=28 · โบนัส 100) ให้วันละ ~600 🪙 ⇒ เด็กซื้อครบทั้งเกมใน ~27 วัน
     และของชิ้นแพงสุด 300 🪙 ใช้เวลาไม่ถึงครึ่งวัน = เงินเฟ้อ เล่นแป๊บเดียวได้ของหลายชิ้น เด็กเบื่อเร็ว
     ตัวเลขชุดใหม่ให้วันละ ~130-300 🪙 (แล้วแต่ชั้น/ดาว) ⇒ **จังหวะการออมที่ตั้งใจ**:
       สีเสื้อ 15 🪙 = 2 เควสต์ · เฟอร์จิ๋ว 25 = 3 เควสต์ · เล็ก 60 = ครึ่งวัน
       กลาง 140 = ~1 วัน · ใหญ่ 300 = ~1.5 วัน · สัตว์หายาก 1,500 = ~1 สัปดาห์ · ครบทั้งเกม ~80 วัน
     A = งานในร้าน · B = งานเดินโลก (เฟส 7) · C = งานสร้างสรรค์ (เฟส 7) · board = กระดาน */
  /* family = เควสต์ครอบครัว (พ่อ/แม่ในบ้าน · เฟส 4A) — วันละ 1 ชุดเท่านั้น โควตาแยกจาก NPC/กระดาน
     จึงให้สูงกว่าทั้งคู่ (14-39 🪙 · ผู้ใช้เลือกตัวเลขนี้เอง 2026-08-09 ห้ามปรับโดยไม่ถาม)
     แผนข้อ 28 เขียนไว้ 50-90 แต่นั่นเขียนก่อนจูนเศรษฐกิจลง ~3 เท่าเมื่อ 2026-08-08 */
  /* ⚠️ **จูนลงอีกรอบ 2026-08-09 ตามคำสั่งผู้ใช้ — ห้ามปรับขึ้นกลับโดยไม่ถาม**
       - เควสต์ NPC: ลดเฉพาะ 2-3 ดาว (1 ดาวคงเดิม 6-8) ⇒ ทำผ่านตัวคูณดาว
       - กระดาน + ครอบครัว: ลดทุกระดับดาว ⇒ ทำผ่าน base ของตระกูลนั้นโดยตรง
     ผลลัพธ์ (ทุกชั้นเท่ากัน): NPC 6 / 8 / 10 · กระดาน 8 / 10 / 13 · ครอบครัว 10 / 13 / 16
     ส่วนที่หายไปถูกชดเชยด้วย **โบนัสดาวรายวัน** (ครึ่งทาง +15 · เต็ม +20) ที่เด็กต้องกดรับเอง */
  const FAM_BASE   = { A:6, B:8, C:7, board:8, family:10 };
  const STAR_MUL   = [0, 1.0, 1.3, 1.6];        /* index = จำนวนดาว (เดิม 1.0/1.5/2.0) */
  /* ---------- โบนัสดาวรายวัน (ผู้ใช้สั่งเพิ่ม 2026-08-09) ----------
     ได้ดาวถึงครึ่งของดาวเต็มวันนี้ → กดรับ 15 🪙 · ได้ครบเต็มจำนวน → กดรับอีก 20 🪙
     **ต้องกดรับเองในหน้ารายการเควสต์** (ไม่จ่ายอัตโนมัติ) เพื่อให้เด็กรู้ตัวว่าได้อะไรมา
     ⚠ ต่างจากโบนัส "ทำครบ 5 ชุด" ของกระดานที่ถูกเอาออกไป — อันนี้วัดที่ **คุณภาพ (ดาว)** ไม่ใช่จำนวนชุด
       และไม่บังคับให้ทำครบทุกชุด (ครึ่งทางก็ได้แล้ว) จึงไม่ขัดกติกาข้อ 2 */
  const STAR_BONUS = {half:15, full:20};
  const BOARD_BONUS = 10;                        /* ทำกระดานครบ 5 ชุด → กดรับที่กระดาน (ผู้ใช้สั่งกลับมา 2026-08-09) */
  const CHAL_MUL   = 1.5;                        /* โจทย์ท้าทาย (สูงกว่าชั้น 1 ระดับ) ได้เหรียญ ×1.5 */
  const DAY_CAP    = 400;                        /* เพดานเหรียญต่อวัน — กันฟาร์ม (ป.6 เล่นครบแบบไม่พลาดเลย ~340) */
  const NPC_PER_DAY = 8;                         /* วันนี้มีกี่ NPC ที่ติดป้าย "!" (ข้อ 7: 5-8 ร้าน/วัน) */
  const BOARD_N     = 5;                         /* กระดาน 5 ชุด/วัน (ข้อ 19) */
  /* ⚠ **โบนัสครบ 5 ชุดของกระดานถูกเอาออกแล้ว** (ผู้ใช้สั่ง 2026-08-09)
     เควสต์กระดานได้เหรียญของตัวเองครบอยู่แล้ว โบนัสก้อนโตทำให้เด็กรู้สึกว่า "ต้องเก็บให้ครบ"
     ซึ่งขัดกับกติกาที่ว่าไม่บังคับ ไม่ลงโทษ · **ห้ามใส่กลับโดยไม่ถามผู้ใช้** */

  /* ---------- ประตูเช็คความพร้อม (ข้อ 24) ---------- */
  const CHAL_NEED = 12;    /* ต้องทำเควสต์ระดับตัวเองสำเร็จครบกี่ชุดก่อนถูกถาม */
  const CHAL_ACC  = 0.7;   /* ความแม่น 10 ชุดล่าสุด (ดาวที่ได้ / ดาวเต็ม) */
  const CHAL_KEEP = 10;    /* เก็บผลย้อนหลังกี่ชุดไว้คิดความแม่น */
  const CHAL_MISS = 3;     /* พลาดโจทย์ท้าทายกี่ชุดติด ⇒ ปิดชั่วคราว (ไม่หักอะไรทั้งสิ้น) */
  const CHAL_RATE = 0.25;  /* เปิดประตูแล้วผสมโจทย์ท้าทายกี่ % (ข้อ 24 ระบุ ~20%) */

  /* ---------- ตัวสุ่มแบบ seeded (ต้นแบบเดียวกับ pickDailyQuests ใน house.js) ----------
     FNV-1a หา seed จากสตริง แล้วเดินด้วย LCG — เด็กคนเดิม+วันเดิม+คีย์เดิม ได้ลำดับเดิมเสมอ */
  function fnv(s){
    let h = 2166136261;
    s = String(s);
    for(let i=0; i<s.length; i++){ h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function rngFrom(seed){
    let h = (seed >>> 0) || 1;
    return function(){ h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; };
  }
  function pick(rng, arr){ return arr[(rng() * arr.length) | 0]; }
  function pickMany(rng, arr, n){
    const pool = arr.slice(), out = [];
    while(out.length < n && pool.length) out.push(pool.splice((rng()*pool.length)|0, 1)[0]);
    return out;
  }
  function shuffled(rng, arr){
    const a = arr.slice();
    for(let i=a.length-1; i>0; i--){ const j = (rng()*(i+1))|0; const t=a[i]; a[i]=a[j]; a[j]=t; }
    return a;
  }

  /* ---------- ธีมของของในโจทย์นับ (mechanic `count`) ----------
     เลือกชุดตามร้าน/อาชีพของ NPC เพื่อให้โจทย์ "เข้ากับร้าน" ตามโจทย์ตั้งต้นข้อ 0 */
  const ITEM_SETS = {
    fruit:  ['🍉','🍎','🍌','🍇','🍓','🍊'],
    snack:  ['🍬','🍪','🍩','🧁','🍿','🍫'],
    food:   ['🍜','🍚','🥟','🍢','🌭','🥞'],
    ice:    ['🍦','🍧','🍨','🥤','🧋','🍮'],
    toy:    ['🪀','🧸','🎈','🎁','🪁','🎲'],
    animal: ['🐶','🐱','🐰','🐥','🐢','🐹'],
    farm:   ['🐄','🐓','🐷','🌽','🥕','🥬'],
    plant:  ['🌻','🌷','🌵','🍀','🌳','🍄'],
    sea:    ['🐚','🐠','🦀','🐬','🏖️','⛵'],
    tool:   ['🔨','🪚','📏','🔧','🪣','🧰'],
    book:   ['📕','📗','📘','✏️','📐','🎒'],
    music:  ['🎸','🥁','🎹','🎺','🎻','🎤'],
    lab:    ['🧪','🔬','🧲','🔭','⚗️','🧫'],
    home:   ['🛋️','🪑','🛏️','🪟','🕰️','🖼️'],
    dress:  ['👗','👕','👒','👜','👟','🧦'],
    town:   ['🎈','⚽','🎪','🌈','🎨','🪁'],
  };
  /* ================= เฟส 4B — มินิเกมครอบครัว =================
     กลไก "จัดของลงถัง" (`sort`) ใช้ร่วมกัน 2 เกม ต่างกันแค่คลังของ:
       tidy    = เก็บของเข้าที่ (ถัง = ห้องในบ้าน)
       laundry = แยกผ้าซัก    (ถัง = ประเภทผ้า)
     ⚠ **ของชิ้นเดียวห้ามอยู่ 2 ถังในเกมเดียวกัน** ไม่งั้นโจทย์ไม่มีคำตอบที่ถูกต้องแน่นอน
       (ข้ามเกมซ้ำได้ เช่น 🧦 อยู่ห้องนอนของ tidy และตะกร้าของชิ้นเล็กของ laundry)
     ⚠ เกมครอบครัวเท่านั้น — NPC/กระดานยังสุ่มได้แค่ quiz/count เหมือนเดิม */
  const SORT_SETS = {
    /* ⚠ **ของทุกชิ้นต้องมีถังที่ถูกต้องแค่ถังเดียวอย่างชัดเจนสำหรับเด็ก 5 ขวบ**
       ห้ามใส่ของกำกวม (📖 อยู่ห้องนอนหรือห้องนั่งเล่น? ⏰ กับ 🕰️ ต่างกันยังไง?)
       เด็กตอบตามเหตุผลของตัวเองแล้วยัง "ผิด" = ลงโทษเด็กกลายๆ ผิดกติกาเหล็กข้อ 2
       ⇒ ถังจึงเป็น **หมวดของ** (ครัว/ห้องน้ำ/ของเล่น/ของใช้เรียน) ไม่ใช่ห้องในบ้าน */
    tidy: {
      name:'เก็บของเข้าที่', emoji:'🧹',
      q:'ของพวกนี้วางผิดที่ ช่วยเก็บเข้าที่ให้หน่อยนะ',
      bins:[
        {id:'kitchen', name:'ของใช้ในครัว',  emoji:'🍳', items:['🥄','🍴','🥣','🍽️','🫖','🧂']},
        {id:'bath',    name:'ของใช้ห้องน้ำ', emoji:'🚿', items:['🧼','🪥','🧴','🧻','🧽']},
        /* ⚠ ของเล่นต้อง **ดูออกทันทีตอนย่อเหลือ 30px** — 🪀 (โยโย่) กลายเป็นลูกบอลเขียวเฉยๆ
             เด็กเดาไม่ออกว่าคืออะไร (เจอตอนดูภาพจริง 2026-08-10) จึงเปลี่ยนเป็นของที่รูปทรงเด่น */
        {id:'toy',     name:'กล่องของเล่น',  emoji:'🧸', items:['🧸','🎈','🎲','🚗','⚽','🧩']},
        {id:'study',   name:'โต๊ะเรียน',     emoji:'📚', items:['📕','✏️','📐','🎒','📏','🖍️']},
      ],
    },
    laundry: {
      name:'แยกผ้าซัก', emoji:'🧺',
      q:'ช่วยแยกผ้าลงตะกร้าให้ถูกใบหน่อยนะ',
      bins:[
        {id:'top',   name:'เสื้อ',           emoji:'👕', items:['👕','👚','🧥','👔']},
        {id:'pants', name:'กางเกง-กระโปรง',  emoji:'👖', items:['👖','🩳','👗']},
        {id:'small', name:'ของชิ้นเล็ก',     emoji:'🧦', items:['🧦','🧣','🧤','🧢','👒']},
      ],
    },
  };
  /* ชุดของ + วิชาที่ NPC คนนี้ชอบออกโจทย์ — ไล่จากเฉพาะเจาะจงไปกว้าง เจอตัวแรกที่ตรงแล้วหยุด */
  const NPC_THEMES = [
    [/^npc-lab/,                     'lab',    ['sci','iq']],
    [/^npc-teacher|^npc-stu|^npc-student/, 'book', ['thai','eng','iq']],
    [/^npc-doctor|^npc-nurse/,       'lab',    ['sci','social']],
    [/^npc-police/,                  'town',   ['social','iq']],
    [/^npc-music/,                   'music',  ['art']],
    [/^npc-mall-fash/,               'dress',  ['art','iq']],
    [/^npc-mall-furn/,               'home',   ['math','iq']],
    [/^npc-beach|^npc-fisher/,       'sea',    ['sci','math']],
    [/^npc-farm|^npc-cowboy/,        'farm',   ['sci','math']],
    [/^npc-camp/,                    'plant',  ['sci','social']],
    [/^npc-carpenter|^npc-hut/,      'tool',   ['math','iq']],
    [/^npc-pet/,                     'animal', ['sci','math']],
    [/^npc-mart/,                    'snack',  ['math']],
    [/^npc-food|^npc-mk-(noodle|meatball|sausage|tokyo)/, 'food', ['math']],
    [/^npc-ice|^npc-mk-(ice|shave|smoothie)/, 'ice',  ['math']],
    [/^npc-mk-toy|^npc-clown|^npc-play/, 'toy', ['iq','art']],
    [/^npc-cart-fruit|^npc-mk-fruit/, 'fruit', ['math']],
    [/^npc-headman|^npc-mayor/,      'town',   ['social','thai']],
  ];
  function themeOf(def){
    /* หน้า "คลังคำถาม" ส่งธีมมาตรงๆ เพื่อบังคับให้ได้ชุดของที่ต้องการดู (NPC จริงไม่มีฟิลด์นี้) */
    if(def && def.themeKey && ITEM_SETS[def.themeKey])
      return {items:def.themeKey, subj:def.subjKey || ['math']};
    const id = def && def.id || '';
    for(let i=0; i<NPC_THEMES.length; i++)
      if(NPC_THEMES[i][0].test(id)) return {items:NPC_THEMES[i][1], subj:NPC_THEMES[i][2]};
    const job = def && def.job;
    if(job === 'vendor') return {items:'snack', subj:['math']};
    if(job === 'farmer') return {items:'farm',  subj:['sci','math']};
    if(job === 'fisher') return {items:'sea',   subj:['sci','math']};
    if(job === 'teacher')return {items:'book',  subj:['thai','eng']};
    if(job === 'kid')    return {items:'toy',   subj:['iq','art']};
    return {items:'town', subj:['misc','iq','thai']};
  }

  /* ---------- จับหมวดใน CATS เข้าวิชา (ใช้เลือกคำถามให้เข้าธีมร้าน) ----------
     id หมวดของระดับเตรียม ป.1 ไม่มี prefix (math/thai/english/iq1…) ส่วน ป.1-6 มี prefix (p3-math2…)
     จึงจับด้วยคำในชื่อ id แทนการไล่รายชื่อทีละหมวด (เพิ่มหมวดใหม่แล้วไม่ต้องมาแก้ที่นี่) */
  function catSubject(c){
    const id = c.id || '';
    if(/math|money|fraction|number/.test(id))            return 'math';
    if(/thai/.test(id))                                  return 'thai';
    if(/eng/.test(id))                                   return 'eng';
    if(/iq|pattern|logic|ef\b/.test(id))                 return 'iq';
    if(/sci|nature|animal|world|health|body/.test(id))   return 'sci';
    if(/manner|emotion|behavior|social|safety|money/.test(id)) return 'social';
    if(/music|art|day|clock|time/.test(id))              return 'art';
    return 'misc';
  }

  window.HOUSE_QUESTS = function(kit){
    kit = kit || {};
    const load    = kit.load    || function(){ return {}; };
    const save    = kit.save    || function(){};
    const childId = kit.childId || function(){ return '-'; };
    const gradeId = kit.gradeId || function(){ return 'prep-p1'; };
    const dayKey  = kit.dayKey  || function(){ const d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); };
    const npcDefs = kit.npcDefs || [];
    const defById = {};
    npcDefs.forEach(d=>{ defById[d.id] = d; });

    /* ================= คลังคำถามจาก CATS ================= */
    const GR = (typeof GRADES !== 'undefined') ? GRADES : [{id:'prep-p1'}];
    function gradeIndex(gid){ const i = GR.findIndex(g=>g.id===gid); return i < 0 ? 0 : i; }
    function gradeAt(i){ return (GR[Math.max(0, Math.min(GR.length-1, i))] || GR[0]).id; }
    /* หมวดควิซ (มีคลัง questions + ไม่ใช่เกมกลไกอื่น) ของระดับชั้นนั้น */
    const quizCache = {};
    function quizCats(gid){
      if(quizCache[gid]) return quizCache[gid];
      let out = [];
      if(typeof CATS !== 'undefined')
        out = CATS.filter(c => (c.grade || 'prep-p1') === gid
                            && !c.mode && !c.type
                            && c.questions && c.questions.length);
      quizCache[gid] = out;
      return out;
    }

    /* ================= ระดับความยาก (ข้อ 5) ================= */
    function difficulty(gid){
      const tier = Math.max(1, gradeIndex(gid || gradeId()));   /* เตรียม ป.1 กับ ป.1 = tier 1 */
      return {
        tier: tier,
        /* จำนวนข้อต่อเควสต์ — **5-10 ข้อ ไล่ตามชั้น** (ผู้ใช้สั่งเพิ่มจาก 3-5 เมื่อ 2026-08-09)
           เตรียม ป.1/ป.1 = 5 · ป.2 = 6 · ป.3 = 7 · ป.4 = 8 · ป.5 = 9 · ป.6 = 10
           ⚠ ยาวขึ้นเท่าตัว แต่ **ค่าตอบแทนคิดต่อเควสต์เหมือนเดิม** ⇒ เหรียญต่อข้อลดลงครึ่งหนึ่ง
             (ตั้งใจ: ยืดเวลาเล่นต่อวันโดยไม่ทำเงินเฟ้อ — ตัวเลขเหรียญเป็นค่าที่ผู้ใช้ล็อกไว้ ห้ามขยับเอง) */
        qN:      Math.min(10, 4 + tier),
        countMax:tier <= 2 ? 9 : (tier <= 4 ? 15 : 24),/* จำนวนของสูงสุดในโจทย์นับ */
        kinds:   tier <= 2 ? 1 : (tier <= 4 ? 2 : 3),  /* ของกี่ชนิดปนกันในโจทย์นับ */
        hints:   tier <= 2,                            /* ป.1-2 มีคำใบ้/ตัวช่วย */
        mulTier: 1,                                    /* ทุกชั้นเท่ากัน (ผู้ใช้สั่ง 2026-08-09) */
      };
    }

    /* ================= state ใน house save (data.q2) ================= */
    let S = null;
    function blank(){
      return { d:'', npcIds:[], npc:{}, board:{q:[], done:[], st:{}, claimed:false},
               sb:{half:false, full:false},
               fam:{who:'', m:'', st:'', stars:0},
               earned:0, stars:0, total:0,
               chal:{done:{}, recent:[], on:false, miss:0, ask:''} };
    }
    function persist(){
      if(!S) return;
      save({q2:{ d:S.d, npcIds:S.npcIds, npc:S.npc, board:S.board, fam:S.fam, sb:S.sb,
                 earned:S.earned, stars:S.stars, total:S.total, chal:S.chal }});
    }
    /* โหลด state + รีเซ็ตส่วน "รายวัน" เมื่อขึ้นวันใหม่
       ⚠ ของที่ต้องอยู่ข้ามวัน: stars (ดาวสะสม) · total · chal ทั้งก้อน — ห้ามรีเซ็ต */
    function sync(){
      const data = load() || {};
      const raw = data.q2 || {};
      const day = dayKey();
      S = blank();
      S.stars = raw.stars | 0;
      S.total = raw.total | 0;
      if(raw.chal){
        S.chal.done   = raw.chal.done || {};
        S.chal.recent = (raw.chal.recent || []).slice(-CHAL_KEEP);
        S.chal.on     = !!raw.chal.on;
        S.chal.miss   = raw.chal.miss | 0;
        S.chal.ask    = raw.chal.ask || '';
      }
      if(raw.d === day){
        S.d      = day;
        S.npcIds = (raw.npcIds || []).filter(id => defById[id]);
        S.npc    = raw.npc || {};
        S.board  = raw.board || {q:[], done:[], claimed:false};
        S.board.q      = S.board.q || [];
        S.board.done   = S.board.done || [];
        S.board.st     = S.board.st || {};
        S.board.claimed= !!S.board.claimed;
        S.fam    = raw.fam || {who:'', m:'', st:'', stars:0};
        S.sb     = raw.sb  || {half:false, full:false};
        S.earned = raw.earned | 0;
      }
      if(S.d !== day || !S.npcIds.length){       /* วันใหม่ (หรือ save เก่ายังไม่มีข้อมูล) → สุ่มชุดใหม่ */
        S.d      = day;
        S.npcIds = rollNpcs(day);
        S.npc    = {};
        S.board  = {q: rollBoard(day), done:[], st:{}, claimed:false};
        S.fam    = rollFamily(day);
        S.sb     = {half:false, full:false};
        S.earned = 0;
        persist();
      }
      if(!S.board.q.length){ S.board.q = rollBoard(day); persist(); }
      if(!S.fam || !S.fam.who){ S.fam = rollFamily(day); persist(); }
      return S;
    }
    function state(){ return S || sync(); }
    function reset(){ S = null; quizCache.__ = 0; return sync(); }   /* สลับเด็ก → โหลดใหม่ทั้งก้อน */

    /* ================= สุ่มว่าวันนี้ใครมีงาน ================= */
    /* NPC ที่รับงานได้ = ทุกคนที่มีบท `quest:` ในผัง (มาสคอตนกฮูก/คนที่ไม่มีบทงาน ไม่นับ)
       ⇒ ทุกคนในกลุ่มนี้เล่นได้ทันทีตั้งแต่วันแรกด้วย mechanic `quiz` ตามข้อ 15.1 */
    function questableIds(){
      return npcDefs.filter(d => d.quest && !d.mascot).map(d => d.id);
    }
    function rollNpcs(day){
      const rng = rngFrom(fnv(childId() + '|' + day + '|npcs'));
      return pickMany(rng, questableIds(), NPC_PER_DAY);
    }
    /* เควสต์ครอบครัว 1 ชุด/วัน (ข้อ 28) — สุ่มว่าวันนี้พ่อหรือแม่เป็นคนขอ (อีกคนพูดให้กำลังใจ)
       seeded ด้วย childId+วัน ⇒ วันนี้ได้พ่อก็พ่อทั้งวัน รีเฟรชกี่ครั้งก็ไม่เปลี่ยน */
    function rollFamily(day){
      const rng = rngFrom(fnv(childId() + '|' + day + '|fam'));
      /* กลไกของเควสต์ครอบครัว = สุ่มจาก FAM_MECHS (มีมินิเกมของเฟส 4B ด้วย)
         วันละชุดเดียว ⇒ สุ่มเท่าๆ กันไปเลย เด็กจะได้เจอครบทุกแบบภายในไม่กี่วัน */
      const who = rng() < .5 ? 'dad' : 'mom';
      return { who: who, m: pick(rng, FAM_MECHS), st:'', stars:0 };
    }
    /* กระดาน 5 ชุด/วัน — โควตาแยกจาก NPC เด็ดขาด (ข้อ 19) */
    function rollBoard(day){
      const rng = rngFrom(fnv(childId() + '|' + day + '|board'));
      const ids = questableIds();
      const out = [];
      for(let i=0; i<BOARD_N; i++){
        out.push({ m: rng() < .35 ? 'count' : 'quiz', npc: ids.length ? pick(rng, ids) : '' });
      }
      return out;
    }

    /* แปลงโจทย์ 1 ข้อจากคลัง CATS → รูปแบบที่หน้าจอเควสต์วาดได้
       ⚠ ส่งรูปแบบโจทย์ครบทุกชนิดที่คลัง CATS ใช้จริง ไม่ยุบเป็นข้อความ:
         img     = โจทย์ภาพล้วน (หมวดเชาว์ iq1-iq4 · q.q เป็นค่าว่าง)
         pattern = แถวการ์ดอิโมจิ + ช่อง ? (หมวดเติมแพทเทิร์น)
       ถ้าลืมชนิดใดชนิดหนึ่ง เด็กจะเจอการ์ดเปล่าๆ ตอบไม่ได้ (เคยพลาดกับ img มาแล้ว 2026-08-08) */
    function normQuiz(rng, q){
      /* สลับตำแหน่งตัวเลือก — คลังต้นฉบับเฉลยอยู่ index 0 เกือบทุกข้อ ถ้าไม่สลับเด็กกดปุ่มแรกรัวๆ ก็ผ่าน
         **ยกเว้นโจทย์ภาพ** (หมวดเชาว์) ที่ตัวเลือกเป็นตัวอักษร ก/ข/ค ซึ่งอ้างถึงช่องในรูป
         ต้องเรียงตามเดิมเสมอ ไม่งั้นเด็กเห็นปุ่ม "ค ก ข" แล้วสับสนกับรูป (เฉลยกระจายอยู่แล้วในคลัง) */
      const idx = q.img ? q.choices.map((_, i) => i)
                        : shuffled(rng, q.choices.map((_, i) => i));
      return {
        q: q.q || '',
        emoji: q.emoji || '',
        img: q.img || '',
        pattern: q.pattern || null,
        choices: idx.map(i => q.choices[i]),
        correct: idx.indexOf(q.correct),
        explain: q.explain || '',
      };
    }
    /* ชนิดหน้าตาโจทย์ — หน้าคลังคำถามใช้แยกคอลัมน์ให้เห็นว่าข้อไหนวาดด้วยเส้นทางไหน */
    function quizKind(q){
      if(q.img) return 'img';
      if(q.pattern) return 'pattern';
      if(q.emoji) return 'emoji';
      return 'text';
    }

    /* ================= กลไกเควสต์ (mechanic) ================= */
    /* แต่ละกลไกมี gen(rng, diff, def, gid) → คืนอาเรย์ข้อ [{q, emoji, show, choices, correct, explain}]
       เฟส 2 มี 2 แบบ · เฟส 5-7 ค่อยเติมที่ตารางนี้ที่เดียว (house.js ไม่ต้องแก้) */
    /* ---------- ตัวสร้างกลไก "จัดของลงถัง" (เฟส 4B) ----------
       1 "ข้อ" = 1 กระดาน (ของ 4-8 ชิ้น ลงถัง 2-4 ใบ) ⇒ ใช้เวลานานกว่าโจทย์ตอบคำถามมาก
       ⇒ **จำนวนกระดานต่อเควสต์ = ครึ่งหนึ่งของ diff.qN (อย่างน้อย 3)** ไม่ใช่ qN เต็ม
          เกณฑ์ดาวคิดจาก `run.items.length` อยู่แล้ว จึงยืดตามเองไม่ต้องแก้ starsOf */
    function sortRounds(diff){ return Math.max(3, Math.round(diff.qN / 2)); }
    function sortMech(setId){
      const set = SORT_SETS[setId];
      return {
        id:setId, name:set.name, fam:'family', sort:true, only:'family',
        gen(rng, diff){
          const binN  = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : set.bins.length);
          const tileN = diff.tier <= 2 ? 4 : (diff.tier <= 4 ? 6 : 8);
          const out = [];
          for(let r = 0; r < sortRounds(diff); r++){
            const bins = pickMany(rng, set.bins, Math.min(binN, set.bins.length));
            /* แจกของให้ **ทุกถังมีอย่างน้อย 1 ชิ้น** — ถังที่ว่างเปล่าทั้งกระดานทำให้เด็กงงว่าใส่ผิดไหม */
            const tiles = [];
            const left  = bins.map(b => shuffled(rng, b.items));
            bins.forEach((b, i) => { tiles.push({e: left[i].pop(), bin: b.id}); });
            /* guard: ถ้าของในถังที่เลือกไว้หมดก่อนครบจำนวน ให้หยุด (ไม่วนไม่รู้จบ) */
            let guard = 0;
            while(tiles.length < tileN && guard++ < 200){
              const i = (rng() * bins.length) | 0;
              if(!left[i].length) continue;
              tiles.push({e: left[i].pop(), bin: bins[i].id});
            }
            const order = shuffled(rng, tiles).map((t, i) => ({k:'t' + i, e:t.e, bin:t.bin}));
            out.push({
              kind:'sort', q:set.q, emoji:'', choices:[], correct:0,
              bins: bins.map(b => ({id:b.id, name:b.name, emoji:b.emoji})),
              tiles: order,
              explain:'ของทุกชิ้นอยู่ถูกที่แล้ว เก่งมาก!',
            });
          }
          return out;
        },
        /* payload = {tileKey: binId} — คืนรายชื่อชิ้นที่วางผิดให้หน้าจอเด้งกลับถาด */
        verify(it, placed){
          placed = placed || {};
          const bad = it.tiles.filter(t => placed[t.k] !== t.bin).map(t => t.k);
          return {ok: bad.length === 0, bad: bad};
        },
      };
    }
    const MECHS = {
      /* ---- ตอบคำถาม: ดึงโจทย์จริงจาก CATS ตามระดับชั้น + เอียงไปทางวิชาที่เข้ากับร้าน ---- */
      quiz: {
        id:'quiz', name:'ตอบคำถาม', fam:'A',
        gen(rng, diff, def, gid){
          const all = quizCats(gid);
          if(!all.length) return MECHS.count.gen(rng, diff, def, gid);   /* กันทางตัน: ไม่มีคลัง → ใช้โจทย์นับแทน */
          const want = themeOf(def).subj;
          const fit  = all.filter(c => want.indexOf(catSubject(c)) >= 0);
          const pool = fit.length ? fit : all;
          /* รวมคำถามจาก 2-3 หมวดที่เข้าธีม แล้วสุ่มมา qN ข้อ (ไม่ซ้ำข้อ) */
          const cats = pickMany(rng, pool, Math.min(3, pool.length));
          let bank = [];
          cats.forEach(c => { bank = bank.concat(c.questions); });
          const qs = pickMany(rng, bank, Math.min(diff.qN, bank.length));
          return qs.map(q => normQuiz(rng, q));
        },
      },
      /* ---- นับของ: สร้างโจทย์เองทั้งหมด ไม่ง้อคลัง (จึงเป็นตัวสำรองกันทางตันด้วย) ---- */
      count: {
        id:'count', name:'นับของ', fam:'A',
        gen(rng, diff, def){
          const set = ITEM_SETS[themeOf(def).items] || ITEM_SETS.town;
          const out = [];
          for(let k=0; k<diff.qN; k++){
            const kinds = pickMany(rng, set, diff.kinds);
            const nums  = kinds.map(() => 2 + ((rng() * (diff.countMax - 2)) | 0));
            let cells = [];
            kinds.forEach((e, i) => { for(let j=0; j<nums[i]; j++) cells.push(e); });
            cells = shuffled(rng, cells);
            let qText, ans;
            if(diff.kinds === 1 || rng() < .55){                 /* นับของชนิดเดียว */
              const t = (rng() * kinds.length) | 0;
              qText = 'มี ' + kinds[t] + ' กี่ชิ้น?';
              ans = nums[t];
            }else if(diff.tier >= 5 && rng() < .5){              /* ต่างกันกี่ชิ้น (ป.5-6) */
              let a = 0, b = 1;
              if(nums[b] > nums[a]){ const t=a; a=b; b=t; }
              qText = 'มี ' + kinds[a] + ' มากกว่า ' + kinds[b] + ' อยู่กี่ชิ้น?';
              ans = nums[a] - nums[b];
            }else{                                               /* รวมทั้งหมดกี่ชิ้น */
              qText = 'รวมทั้งหมดกี่ชิ้น?';
              ans = nums.reduce((s, n) => s + n, 0);
            }
            /* ตัวเลือก 4 ตัว: คำตอบจริง + ตัวลวงที่ห่างไม่เกิน 3 (เด็กต้องนับจริง ไม่ใช่เดาจากขนาดตัวเลข) */
            const opts = [ans];
            let guard = 0;
            while(opts.length < 4 && guard++ < 60){
              const v = ans + (((rng() * 7) | 0) - 3);
              if(v >= 0 && opts.indexOf(v) < 0) opts.push(v);
            }
            while(opts.length < 4) opts.push(ans + opts.length);
            const order = shuffled(rng, opts);
            out.push({ q: qText, emoji:'', show: cells.join(''),
                       choices: order.map(String), correct: order.indexOf(ans),
                       explain: 'นับได้ ' + ans + ' ชิ้นพอดี' });
          }
          return out;
        },
      },
      /* ---- เฟส 4B: จัดของลงถัง (เกมครอบครัว) — สร้างโจทย์เองทั้งหมด ไม่ง้อคลัง ---- */
      tidy:    sortMech('tidy'),
      laundry: sortMech('laundry'),
    };
    const MECH_IDS = Object.keys(MECHS);
    /* กลไกที่ **เควสต์ครอบครัวเท่านั้น**สุ่มได้ — NPC/กระดานยังเป็น quiz/count เหมือนเดิม */
    const FAM_MECHS = ['quiz', 'count', 'tidy', 'laundry'];

    /* ================= สร้างชุดโจทย์ 1 เควสต์ ================= */
    /* spec = {src:'npc'|'board', key, npc, mech, fam, chal} — เปิดกี่ครั้งก็ได้ชุดเดิม (seed คงที่) */
    function specForNpc(npcId){
      const s = state();
      if(s.npcIds.indexOf(npcId) < 0) return null;
      const rec = s.npc[npcId] || {};
      const rng = rngFrom(fnv(childId() + '|' + s.d + '|' + npcId));
      const mech = rec.m || (rng() < .35 ? 'count' : 'quiz');
      const done = rec.st === 'done';
      return { src:'npc', key:npcId, npc:npcId, mech: MECHS[mech] ? mech : 'quiz',
               fam:'A', chal: done ? !!rec.chal : rollChal(npcId),
               done: done, stars: rec.stars | 0 };
    }
    /* เควสต์ครอบครัวของวันนี้ — `who` บอกว่าพ่อหรือแม่เป็นคนขอ (ตัวอีกคนไม่มีงาน) */
    function specForFamily(){
      const s = state();
      const f = s.fam || {};
      if(!f.who) return null;
      const done = f.st === 'done';
      return { src:'family', key:'fam', who:f.who, npc:'', mech: MECHS[f.m] ? f.m : 'quiz',
               fam:'family', chal: done ? false : rollChal('fam'),
               done: done, stars: f.stars | 0 };
    }
    /* สรุปเควสต์ของ "วันนี้" ทั้งหมด (แถบสรุป + หน้ารายการใน js/house.js)
       คืนเฉพาะข้อมูลดิบ — ชื่อคน/ชื่อร้านให้ฝั่งหน้าจอไปแปลเอง (ไฟล์นี้ไม่รู้จักผังเมือง) */
    /* คืน **ทุกชุดของวันนี้พร้อมธง done** (ผู้ใช้สั่งให้โชว์อันที่ทำเสร็จแล้วด้วย 2026-08-09)
       ฝั่งหน้าจอเป็นคนแยกกลุ่ม/แปลชื่อคน-ชื่อร้านเอง (ไฟล์นี้ไม่รู้จักผังเมือง) */
    function daySummary(){
      const s = state();
      const items = [];
      const bst = s.board.st || {};
      s.npcIds.forEach(id=>{
        const r = s.npc[id] || {};
        items.push({src:'npc', id, done: r.st === 'done', stars: r.stars | 0});
      });
      for(let i=0; i<BOARD_N; i++)
        items.push({src:'board', idx:i, done: s.board.done.indexOf(i) >= 0, stars: bst[i] | 0});
      const f = s.fam || {};
      if(f.who) items.push({src:'family', who:f.who, done: f.st === 'done', stars: f.stars | 0});
      const left = items.filter(x => !x.done).length;
      /* ดาวของ "วันนี้" (ไม่ใช่ดาวสะสมทั้งชีวิตที่อยู่ใน s.stars) + เพดานดาวที่เป็นไปได้ */
      const starsGot = items.reduce((a, x) => a + (x.stars | 0), 0);
      return {left, done: items.length - left, total: items.length, items,
              stars: starsGot, starsMax: items.length * 3};
    }
    function familyWho(){ const f = state().fam || {}; return f.who || ''; }
    function familyDone(){ const f = state().fam || {}; return f.st === 'done'; }
    function specForBoard(i){
      const s = state();
      const b = s.board.q[i];
      if(!b) return null;
      const done = s.board.done.indexOf(i) >= 0;
      return { src:'board', key:'b' + i, idx:i, npc:b.npc, mech: MECHS[b.m] ? b.m : 'quiz',
               fam:'board', chal: done ? false : rollChal('b' + i), done: done };
    }
    /* สร้าง "รอบเล่น" จริง — โจทย์ผูกกับ seed ของเควสต์ ⇒ ปิดแล้วเปิดใหม่ได้โจทย์เดิม ไม่ใช่สุ่มใหม่ */
    function buildRun(spec){
      const s = state();
      const own = gradeId();
      /* โจทย์ท้าทาย = ระดับชั้นถัดไป (ข้อ 24) — เลือกเฉพาะตอนประตูเปิดแล้วและสุ่มติด */
      const chal = spec.chal && gradeIndex(own) < GR.length - 1;
      const gid  = chal ? gradeAt(gradeIndex(own) + 1) : own;
      const diff = difficulty(gid);
      const def  = defById[spec.npc] || {id:spec.npc || '', job:'villager'};
      const rng  = rngFrom(fnv(childId() + '|' + s.d + '|' + spec.key + '|run'));
      let items  = MECHS[spec.mech].gen(rng, diff, def, gid);
      if(!items || !items.length) items = MECHS.count.gen(rng, diff, def, gid);
      return { spec, def, gid, chal, diff, items, idx:0, wrong:0, missed:{}, over:false };
    }
    /* ส่งคำตอบ 1 ครั้ง (ทุกกลไก) — คืน {ok, done, bad}
       กลไกตอบคำถาม: payload = index ของตัวเลือก · กลไกจัดของ: payload = {tileKey: binId}
       กลไกไหนมี `verify()` จะใช้ตัวนั้น ที่เหลือเทียบกับ `it.correct` แบบเดิม
       ⚠ ตอบผิดไม่มีบทลงโทษ แค่ให้ลองใหม่ (ดาวลดลงเท่านั้น — กติกาเหล็กข้อ 2) */
    function submit(run, payload){
      if(run.over) return {ok:true, done:true};
      const it = run.items[run.idx];
      const m  = MECHS[run.spec.mech];
      const res = (m && m.verify) ? m.verify(it, payload) : {ok: payload === it.correct};
      if(!res.ok){
        if(!run.missed[run.idx]){ run.missed[run.idx] = 1; run.wrong++; }
        return {ok:false, done:false, bad: res.bad || []};
      }
      run.idx++;
      if(run.idx >= run.items.length){ run.over = true; return {ok:true, done:true}; }
      return {ok:true, done:false};
    }
    /* ตอบ 1 ครั้ง — คืน {ok, done} · ตอบผิดไม่มีบทลงโทษ แค่ให้ลองใหม่ (ดาวลดลงเท่านั้น) */
    function answer(run, i){
      if(run.over) return {ok:true, done:true};
      const q = run.items[run.idx];
      const ok = i === q.correct;
      if(!ok){
        if(!run.missed[run.idx]){ run.missed[run.idx] = 1; run.wrong++; }   /* ข้อเดียวผิดซ้ำ นับครั้งเดียว */
        return {ok:false, done:false};
      }
      run.idx++;
      if(run.idx >= run.items.length){ run.over = true; return {ok:true, done:true}; }
      return {ok:true, done:false};
    }
    /* ⚠ เกณฑ์ 2 ดาว **ต้องยืดตามจำนวนข้อ** — เดิมตายตัวที่ "ผิดไม่เกิน 2 ข้อ" ซึ่งตอนเควสต์มี 3 ข้อ
       คือผ่อนปรนมาก (ผิดได้ 2 ใน 3) แต่พอเพิ่มเป็น 10 ข้อจะกลายเป็นเข้มขึ้นเท่าตัวโดยไม่ตั้งใจ
       ⇒ คิดเป็นสัดส่วนเดิม (~2/3 ของจำนวนข้อ) ให้ความรู้สึกเหมือนเดิมทุกระดับชั้น (กติกาเหล็กข้อ 2) */
    function starsOf(run){
      if(run.wrong === 0) return 3;
      const n = (run.items && run.items.length) || 3;
      return run.wrong <= Math.max(2, Math.round(n * 2 / 3)) ? 2 : 1;
    }                               /* ผิดเยอะแค่ไหนก็ยังได้ 1 ดาว + เงิน — ห้ามลงโทษเด็ก */
    function coinsFor(fam, stars, tier, chal){
      const base = FAM_BASE[fam] || FAM_BASE.A;
      /* ⚠ **ทุกระดับชั้นได้เท่ากันหมด (ตัวคูณชั้น = 1.0)** — ผู้ใช้สั่ง 2026-08-09 ห้ามใส่ตัวคูณกลับ
         เดิม ป.1 ×1.0 → ป.6 ×1.4 ซึ่งทำให้พี่ ป.6 ได้เงินมากกว่าน้อง ป.1 ทั้งที่ทำงานเท่ากัน
         (พารามิเตอร์ `tier` ยังรับไว้เพื่อไม่ให้ผู้เรียก/เทสเดิมพัง แต่ไม่มีผลกับเหรียญแล้ว) */
      const v = base * (STAR_MUL[stars] || 1) * (chal ? CHAL_MUL : 1);
      return Math.max(1, Math.round(v));
    }

    /* ---------- ปิดเควสต์ + คิดรางวัล (ผู้เรียกเป็นคนจ่ายเงินผ่าน OwlCoins) ---------- */
    function finish(run){
      const s = state();
      const stars = starsOf(run);
      let coins = coinsFor(run.spec.fam, stars, run.diff.tier, run.chal);
      /* เพดานเหรียญต่อวัน — ตัดที่เพดานแต่ไม่เคยติดลบ และไม่บอกเด็กว่า "หมดโควตา" แบบดุๆ */
      const room = Math.max(0, DAY_CAP - (s.earned | 0));
      const capped = coins > room;
      if(capped) coins = room;
      s.earned = (s.earned | 0) + coins;
      s.stars  = (s.stars | 0) + stars;
      s.total  = (s.total | 0) + 1;

      if(run.spec.src === 'npc'){
        s.npc[run.spec.key] = {m:run.spec.mech, st:'done', stars:stars, chal:!!run.chal};
      }else if(run.spec.src === 'board'){
        if(s.board.done.indexOf(run.spec.idx) < 0) s.board.done.push(run.spec.idx);
        /* เก็บดาวรายชุดด้วย — หน้ารายการเควสต์ต้องโชว์ว่าแต่ละชุดได้กี่ดาว (ผู้ใช้สั่ง 2026-08-09)
           ข้อมูลเก่าที่ไม่มี `st` จะอ่านได้ 0 เอง ไม่ต้อง migrate */
        s.board.st = s.board.st || {};
        s.board.st[run.spec.idx] = stars;
      }else if(run.spec.src === 'family'){
        s.fam = Object.assign({}, s.fam, {st:'done', stars:stars});
      }

      /* ---------- ประตูเช็คความพร้อม: เก็บสถิติ ---------- */
      const own = gradeId();
      if(run.chal){
        if(stars <= 1){ s.chal.miss = (s.chal.miss | 0) + 1; }
        else s.chal.miss = 0;
        if(s.chal.miss >= CHAL_MISS){    /* พลาด 3 ชุดติด → พักไว้ก่อน ไม่หักเงิน ไม่หักดาว */
          s.chal.on = false; s.chal.miss = 0; s.chal.ask = '';
        }
      }else{
        s.chal.done[own] = (s.chal.done[own] | 0) + 1;
        s.chal.recent.push(stars);
        if(s.chal.recent.length > CHAL_KEEP) s.chal.recent = s.chal.recent.slice(-CHAL_KEEP);
      }
      persist();
      return {stars, coins, capped, chal:!!run.chal,
              boardLeft: BOARD_N - s.board.done.length,
              boardBonus: boardBonusReady()};
    }

    /* ---------- ประตูเช็คความพร้อม (ข้อ 24) ---------- */
    function chalAccuracy(){
      const r = state().chal.recent;
      if(!r.length) return 0;
      return r.reduce((a, b) => a + b, 0) / (r.length * 3);
    }
    /* ถึงเวลาชวนหรือยัง — ครบ 3 เงื่อนไข: ปริมาณ · คุณภาพ · ยังมีชั้นถัดไปให้ท้าทาย
       (ความสมัครใจคือปุ่ม "ลองเลย/ยังไม่พร้อม" ที่ house.js เป็นคนแสดง) */
    function chalReady(){
      const s = state();
      if(s.chal.on) return false;
      if(s.chal.ask === s.d) return false;                       /* ถามไปแล้ววันนี้ ไม่ตื๊อ */
      if(gradeIndex(gradeId()) >= GR.length - 1) return false;    /* ป.6 ไม่มีชั้นถัดไป */
      if((s.chal.done[gradeId()] | 0) < CHAL_NEED) return false;
      if(s.chal.recent.length < CHAL_KEEP) return false;
      return chalAccuracy() >= CHAL_ACC;
    }
    function chalAsked(){ const s = state(); s.chal.ask = s.d; persist(); }
    function chalAccept(yes){
      const s = state();
      s.chal.ask = s.d;
      if(yes){ s.chal.on = true; s.chal.miss = 0; }
      persist();
      return s.chal.on;
    }
    /* เควสต์ถัดไปควรเป็นโจทย์ท้าทายไหม — สุ่มด้วย seed คงที่ต่อเควสต์ (เปิดซ้ำไม่เปลี่ยนใจ) */
    function rollChal(key){
      const s = state();
      if(!s.chal.on) return false;
      if(gradeIndex(gradeId()) >= GR.length - 1) return false;
      return rngFrom(fnv(childId() + '|' + s.d + '|' + key + '|chal'))() < CHAL_RATE;
    }

    /* ================= คลังคำถาม (หน้าเทส · js/house-qbrowse.js) =================
       โจทย์ในเกมสุ่มทั้งหมด เปิดเล่นเองยังไงก็ไม่รู้ว่าคลังมีอะไรบ้าง หน้านี้จึงกาง "ของจริง" ออกมาเป็นตาราง
       ⚠ ทุกอย่างในบล็อกนี้เป็น **อ่านอย่างเดียว** ห้ามแตะ state/persist เด็ดขาด
         (เล่นในหน้าเทสต้องไม่ได้เหรียญ ไม่กินโควตาวันนี้ ไม่ทำสถิติประตูความพร้อมเพี้ยน) */

    /* ทุกข้อของ mechanic `quiz` ในระดับชั้นนั้น เรียงตามหมวด (ไม่สลับตัวเลือก — ตารางต้องโชว์เฉลยจริง) */
    function catalogQuiz(gid){
      const out = [];
      quizCats(gid).forEach(c=>{
        const subj = catSubject(c);
        c.questions.forEach((q, i)=>{
          out.push({
            catId:c.id, catName:c.name || c.id, catEmoji:c.emoji || '❓', subj:subj,
            i:i, kind:quizKind(q),
            q:q.q || '', emoji:q.emoji || '', img:q.img || '', pattern:q.pattern || null,
            nCh:(q.choices || []).length,
            answer:(q.choices || [])[q.correct],
          });
        });
      });
      return out;
    }
    /* หมวดของระดับชั้นนั้น + จำนวนข้อ (ไว้ทำแถบกรองหมวด) */
    function catalogCats(gid){
      return quizCats(gid).map(c => ({
        id:c.id, name:c.name || c.id, emoji:c.emoji || '❓',
        subj:catSubject(c), n:c.questions.length,
      }));
    }
    /* `count` สร้างโจทย์เองไม่มีคลังตายตัว ⇒ กางเป็น "ธีมของ" แทน พร้อมตัวอย่างที่สุ่มได้จริง 1 ข้อ */
    function catalogCount(gid){
      const diff = difficulty(gid);
      const byTheme = {};
      Object.keys(ITEM_SETS).forEach(k=>{ byTheme[k] = []; });
      npcDefs.forEach(d=>{
        const t = themeOf(d).items;
        if(byTheme[t]) byTheme[t].push(d.name || d.id);
      });
      return Object.keys(ITEM_SETS).map(k=>{
        const rng = rngFrom(fnv('cat|' + gid + '|' + k));
        const s = MECHS.count.gen(rng, diff, {id:'', job:'', themeKey:k}, gid)[0] || {};
        return {
          theme:k, items:ITEM_SETS[k], npcs:byTheme[k] || [],
          kinds:diff.kinds, countMax:diff.countMax, qN:diff.qN,
          sample:{show:s.show || '', q:s.q || '', answer:(s.choices || [])[s.correct]},
        };
      });
    }
    /* แบบคำถามที่ `count` สุ่มได้ในชั้นนั้น (ดูโค้ด MECHS.count.gen — ต้องแก้คู่กันถ้าเพิ่มแบบใหม่) */
    function countKinds(gid){
      const diff = difficulty(gid);
      const out = ['นับของชนิดเดียว'];
      if(diff.kinds > 1) out.push('รวมทั้งหมดกี่ชิ้น');
      if(diff.tier >= 5) out.push('มากกว่ากันกี่ชิ้น');
      return out;
    }
    const ALL_SUBJ = ['math','thai','eng','iq','sci','social','art','misc'];
    /* รอบเล่นแบบทดสอบ — โครงเดียวกับ buildRun เป๊ะๆ (จะได้เทสเส้นทางวาดจริง) แต่ spec.test = true
       ⇒ js/house.js จะไม่จ่ายเหรียญ ไม่เรียก QUESTS.finish() และไม่แตะ state ใดๆ
       opt = {mech, gid, catId, qIdx, theme, title, seed}
         catId + qIdx → เล่นข้อนั้นข้อเดียว · catId อย่างเดียว → สุ่ม qN ข้อจากหมวดนั้น
         theme (count) → บังคับชุดของตามธีม · ไม่ระบุอะไรเลย → สุ่มเหมือนเควสต์จริง */
    function testRun(opt){
      opt = opt || {};
      const gid  = opt.gid || gradeId();
      const mech = MECHS[opt.mech] ? opt.mech : 'quiz';
      const diff = difficulty(gid);
      const seed = (opt.seed == null) ? ((Math.random() * 1e9) | 0) : opt.seed;
      const rng  = rngFrom(fnv(['t', gid, mech, opt.catId || '', opt.qIdx == null ? '' : opt.qIdx,
                                opt.theme || '', seed].join('|')));
      const def  = {id:'', job:'villager',
                    themeKey: ITEM_SETS[opt.theme] ? opt.theme : 'town',
                    subjKey: ALL_SUBJ};
      let items = null;
      if(opt.catId){
        const c = quizCats(gid).filter(x => x.id === opt.catId)[0];
        if(c && c.questions.length){
          items = (opt.qIdx == null)
            ? pickMany(rng, c.questions, Math.min(diff.qN, c.questions.length)).map(q => normQuiz(rng, q))
            : (c.questions[opt.qIdx] ? [normQuiz(rng, c.questions[opt.qIdx])] : null);
        }
      }
      if(!items || !items.length) items = MECHS[mech].gen(rng, diff, def, gid);
      if(!items || !items.length) items = MECHS.count.gen(rng, diff, def, gid);
      const spec = {src:'test', key:'test', npc:'', mech:mech, fam:'A', chal:false,
                    test:true, title: opt.title || '🧪 ทดสอบคำถาม'};
      return {spec, def, gid, chal:false, diff, items, idx:0, wrong:0, missed:{}, over:false,
              test:true, opt:opt};
    }

    /* ---------- คลังของกลไกจัดของ (หน้าคลังคำถาม — อ่านอย่างเดียว) ---------- */
    function catalogSort(setId, gid){
      const set = SORT_SETS[setId];
      if(!set) return null;
      const diff = difficulty(gid || gradeId());
      return {
        id:setId, name:set.name, emoji:set.emoji, q:set.q,
        rounds: sortRounds(diff),
        binN: diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : set.bins.length),
        tileN: diff.tier <= 2 ? 4 : (diff.tier <= 4 ? 6 : 8),
        bins: set.bins.map(b => ({id:b.id, name:b.name, emoji:b.emoji, items:b.items.slice()})),
      };
    }

    /* ---------- สถานะของ NPC สำหรับป้ายเหนือหัว ---------- */
    function npcStatus(npcId){
      const s = state();
      if(s.npcIds.indexOf(npcId) < 0) return 'none';
      const r = s.npc[npcId];
      return (r && r.st === 'done') ? 'done' : 'open';
    }
    function openNpcCount(){ return state().npcIds.filter(id => npcStatus(id) === 'open').length; }
    /* ---------- โบนัสดาวรายวัน ----------
       คืนสถานะของทั้ง 2 ก้อน: ถึงเกณฑ์แล้วหรือยัง · กดรับไปหรือยัง · ได้กี่เหรียญ */
    function starBonus(){
      const s = state();
      const d = daySummary();
      const sb = s.sb || {half:false, full:false};
      const halfNeed = Math.ceil(d.starsMax / 2);
      return {
        stars: d.stars, starsMax: d.starsMax, halfNeed,
        half: {coins: STAR_BONUS.half, need: halfNeed,
               ready: d.stars >= halfNeed && !sb.half, claimed: !!sb.half},
        full: {coins: STAR_BONUS.full, need: d.starsMax,
               ready: d.starsMax > 0 && d.stars >= d.starsMax && !sb.full, claimed: !!sb.full},
      };
    }
    /* มีอะไรให้กดรับอยู่ไหม (ปุ่มเควสต์บน HUD ใช้ตัวนี้ขึ้นจุดแจ้งเตือน) */
    function starBonusReady(){ const b = starBonus(); return b.half.ready || b.full.ready; }
    /* กดรับ — คืนจำนวนเหรียญที่ได้ (0 = ยังไม่ถึงเกณฑ์/รับไปแล้ว) · ผู้เรียกเป็นคนจ่ายผ่าน OwlCoins */
    function claimStarBonus(kind){
      const s = state(), b = starBonus();
      if(kind !== 'half' && kind !== 'full') return 0;
      if(!b[kind].ready) return 0;
      const room = Math.max(0, DAY_CAP - (s.earned | 0));   /* ยังอยู่ใต้เพดานรายวันเหมือนเควสต์ปกติ */
      const coins = Math.min(b[kind].coins, room);
      s.sb = Object.assign({half:false, full:false}, s.sb);
      s.sb[kind] = true;
      s.earned = (s.earned | 0) + coins;
      persist();
      return coins;
    }

    /* ---------- กระดาน: โบนัสทำครบ 5 ชุด ----------
       ⚠ เคยเอาออกไปเมื่อ 2026-08-09 แล้ว **ผู้ใช้สั่งให้เอากลับมาแต่ลดเหลือ 10 🪙** (เดิม 35)
         ก้อนเล็กลงมากจึงไม่กดดันเหมือนเดิม แค่ให้รู้สึกดีตอนเก็บครบ */
    function boardBonusReady(){ const s = state(); return s.board.done.length >= BOARD_N && !s.board.claimed; }
    function boardClaim(){
      const s = state();
      if(!boardBonusReady()) return 0;
      s.board.claimed = true;
      const room = Math.max(0, DAY_CAP - (s.earned | 0));
      const coins = Math.min(BOARD_BONUS, room);
      s.earned = (s.earned | 0) + coins;
      s.stars  = (s.stars | 0) + 1;
      persist();
      return coins;
    }

    /* ---------- กระดาน ---------- */
    function boardLeft(){ const s = state(); return BOARD_N - s.board.done.length; }

    return {
      /* ค่าคงที่ให้ UI/เทสอ้างอิงได้ ไม่ต้องเดาเลข */
      DAY_CAP, NPC_PER_DAY, BOARD_N, BOARD_BONUS, FAM_BASE, STAR_MUL,
      CHAL_NEED, CHAL_ACC, CHAL_KEEP, CHAL_MISS, CHAL_RATE, CHAL_MUL,
      MECHS, MECH_IDS, ITEM_SETS,
      sync, reset, state, difficulty, quizCats, themeOf, catSubject, questableIds,
      specForNpc, specForBoard, specForFamily, familyWho, familyDone, daySummary,
      STAR_BONUS, starBonus, starBonusReady, claimStarBonus,
      buildRun, answer, submit, starsOf, coinsFor, finish,
      FAM_MECHS, SORT_SETS, catalogSort,
      /* หน้าคลังคำถาม (js/house-qbrowse.js) — อ่านอย่างเดียว ไม่แตะ state */
      catalogQuiz, catalogCats, catalogCount, countKinds, testRun, GRADES:GR,
      ownGrade: () => gradeId(),      /* ระดับชั้นของเด็กคนที่เล่นอยู่ (หน้าคลังคำถามเปิดมาที่ชั้นนี้ก่อน) */
      boardBonusReady, boardClaim, boardLeft,
      chalReady, chalAsked, chalAccept, chalAccuracy, rollChal,
      npcStatus, openNpcCount,
    };
  };
})();
