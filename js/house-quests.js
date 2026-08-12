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
  /* ⚠ **ขั้นต่ำ 5 โจทย์/กระดานต่อ 1 เควสต์เสมอ ไม่ว่าจะเป็นเกมอะไร** (ผู้ใช้สั่ง 2026-08-10)
   มินิเกมใหม่ทุกตัวต้องอ้างค่านี้ ห้ามตั้งเลขต่ำกว่านี้เอง */
const MIN_Q = 5;
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

  /* ---------- คลังโจทย์/ข้อมูลนิ่ง (แยกไปอยู่ js/house-quest-data.js เมื่อ 2026-08-12) ----------
     ⚠ ดึงกลับมาเป็นชื่อเดิมทุกตัว ⇒ โค้ดส่วนที่เหลือของไฟล์นี้ไม่ต้องแก้แม้แต่บรรทัดเดียว
     ⚠ ถ้าไฟล์ข้อมูลไม่ถูกโหลด (ลำดับใน games-ar.js ผิด) ให้พังทันทีตรงนี้แบบมีข้อความบอก
       ดีกว่าปล่อยให้คลังเป็น undefined แล้วไปพังลึกๆ ตอนเด็กเปิดเควสต์จริง */
  if(typeof window.HOUSE_QUEST_DATA !== 'function')
    throw new Error('house-quest-data.js ต้องถูกโหลดก่อน house-quests.js');
  const QD = window.HOUSE_QUEST_DATA();
  const {ITEM_SETS, SORT_SETS, ORDER_POOLS, STEM_SETS, GROW_SETS, COIN_UNITS, PRICED_GOODS, SHELF_CATS, RECIPE_SETS, TRAFFIC_CARDS, SPOT_SCENES, DRESS_ITEMS, HIDDEN_ZONES, HIDDEN_ITEMS, SOUND_MOTIFS, CODE_TASKS, MEASURE_ITEMS, MEASURE_UNITS, PET_FACE, MARKET_GOODS, NPC_THEMES} = QD;

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
    /* ตารางอาหารสัตว์ของจริงอยู่ที่ js/house-pet-care.js — ไฟล์นี้ขอมาทาง kit ไม่อ่าน global เอง */
    const petFoods = kit.petFoods || function(){ return []; };
    /* เฟส 9 — คลังเครื่องดนตรี (ชื่อ/อิโมจิ/โน้ตของแต่ละชิ้น) + บ้านหลังนี้มีเครื่องดนตรีแล้วหรือยัง
       ⚠ ข้อมูลจริงอยู่ในคลังเฟอร์นิเจอร์ (js/house-furniture.js) ไฟล์นี้ขอมาทาง kit ไม่อ่าน global เอง */
    const instruments  = kit.instruments  || function(){ return []; };
    const hasInstrument = kit.hasInstrument || function(){ return false; };
    /* บ้านหลังนี้มีโต๊ะ/เก้าอี้ในบ้านไหม (เควสต์ "ไปนั่งกินข้าว") — ฝั่งหน้าจอเป็นคนตอบ */
    const hasIndoorSeat = kit.hasIndoorSeat || function(){ return false; };
    /* เกมของหน้าหลักตัวนี้พร้อมให้ยืมมาเล่นในบ้านไหม (เฟส 5) — ฝั่งหน้าจอถาม OwlGames/HouseGames ให้
       ⚠ ไฟล์นี้ไม่รู้จัก DOM/registry จึงต้องถามออกไป ไม่ใช่เช็คเอง */
    const hasGame = kit.hasGame || function(){ return false; };
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
    /* ---------- ไล่ระดับความยาก "ภายในเควสต์เดียว" (ผู้ใช้สั่ง 2026-08-10) ----------
       ข้อแรกง่ายสุด ข้อท้ายเต็มระดับชั้นของเด็ก ⇒ อุ่นเครื่องก่อนแล้วค่อยยาก
       ⚠ `p` = สัดส่วนความคืบหน้าในเควสต์ (0 = ข้อแรก · 1 = ข้อสุดท้าย) มินิเกมทุกตัวใช้ค่านี้ร่วมกัน
       ⚠ **ไล่ระดับไม่กระทบเงิน** — `coinsFor()` คิดจากประเภทเควสต์กับดาวเท่านั้น ไม่ดูจำนวน/ความยากข้อ */
    function stepDiff(diff, i, n){
      const p = (n <= 1) ? 1 : i / (n - 1);
      const at = (lo, hi) => Math.round(lo + (hi - lo) * p);
      return Object.assign({}, diff, {
        p: p,
        countMax: Math.max(4, at(Math.ceil(diff.countMax * .55), diff.countMax)),
        kinds:    Math.max(1, at(1, diff.kinds)),
      });
    }
    function difficulty(gid){
      const tier = Math.max(1, gradeIndex(gid || gradeId()));   /* เตรียม ป.1 กับ ป.1 = tier 1 */
      return {
        tier: tier,
        /* จำนวนข้อต่อเควสต์ — **5-10 ข้อ ไล่ตามชั้น** (ผู้ใช้สั่งเพิ่มจาก 3-5 เมื่อ 2026-08-09)
           เตรียม ป.1/ป.1 = 5 · ป.2 = 6 · ป.3 = 7 · ป.4 = 8 · ป.5 = 9 · ป.6 = 10
           ⚠ ยาวขึ้นเท่าตัว แต่ **ค่าตอบแทนคิดต่อเควสต์เหมือนเดิม** ⇒ เหรียญต่อข้อลดลงครึ่งหนึ่ง
             (ตั้งใจ: ยืดเวลาเล่นต่อวันโดยไม่ทำเงินเฟ้อ — ตัวเลขเหรียญเป็นค่าที่ผู้ใช้ล็อกไว้ ห้ามขยับเอง) */
        /* ค่าตั้งต้น — **จำนวนข้อจริงสุ่มใหม่ทุกเควสต์ที่ buildRun() (5-10 ข้อ ไม่จำเป็นต้องเท่ากัน)**
           ผู้ใช้สั่ง 2026-08-10 · ระดับชั้นยังมีผลกับ "ความยากของแต่ละข้อ" เหมือนเดิม ไม่ใช่จำนวนข้อ */
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
    /* กลไกของงาน NPC/กระดาน — เฟส 5 เพิ่มเกมกลุ่ม C เข้ามา
       ⚠ **quiz ต้องมีโอกาสเจอมากที่สุดเสมอ** (กติกาข้อ 4 ของแผน: ทุก NPC ต้องตอบคำถามได้)
       ⚠ ถ้าเกมกลุ่ม C ยังโหลดไม่เสร็จ/ไม่มีในเครื่องนี้ ต้องถอยไป quiz ไม่ใช่ปล่อยพัง */
    /* npcId = คนที่จะแจกงานนี้ (ถ้ามี) — เฟส 6 ใช้แยกว่าเป็นคนในตึกแล็บไหม
       ⚠ กลไกที่ยืม engine ต้องกรองด้วย engineReady เสมอ ไม่งั้นเด็กชั้นเล็กจะได้งาน
         วงจรไฟฟ้า/แท็งแกรมที่ไม่มีหมวดให้เล่น (ถอยไป quiz ให้เอง ไม่ปล่อยพัง) */
    /* กลไกนี้บ้านหลังนี้เล่นได้จริงไหม — เฟส 9 เพิ่มเงื่อนไข "ต้องมีเครื่องดนตรีในบ้านก่อน"
       ⚠ ต้องกรองทั้งตอนสุ่มแจกงาน **และ** ตอนสร้าง spec (เด็กอาจขายเครื่องทิ้งหลังรับงานไปแล้ว) */
    function mechOk(m){
      const spec = MECHS[m];
      if(!spec) return false;
      if(spec.music && !hasInstrument()) return false;
      if(spec.engine && !engineReady(m)) return false;
      return true;
    }
    function rollWorkMech(rng, npcId){
      const lab = labMechsFor(npcId);
      if(lab){
        const pool = lab.filter(m => mechOk(m));
        if(pool.length) return pool[(rng() * pool.length) | 0];
        return 'quiz';
      }
      const r = rng();
      if(r < .40) return 'quiz';                    /* quiz ต้องเจอบ่อยที่สุดเสมอ (กติกาข้อ 4) */
      if(r < .55) return 'count';
      /* งานส่งของ — ให้ทุกคนแจกได้ (ข้อ 15.2: "เชื่อม NPC เข้าหากัน") แต่โอกาสน้อยกว่าตัวอื่น
         เพราะเป็นงานเดินข้ามเมืองที่กินเวลานานกว่าเควสต์ที่จบในการ์ดใบเดียว */
      if(r < .61) return 'deliver';
      /* เฟส 7: งานที่ "เข้ากับร้านของคนนี้" มาก่อนเกมทั่วไป — เด็กจะรู้สึกว่างานสมเหตุสมผลกับที่ที่ยืนอยู่ */
      const bonus = bonusMechsFor(npcId);
      if(bonus.length && r < .78) return bonus[(rng() * bonus.length) | 0];
      const pool = ENGINE_MECHS.filter(m => engineReady(m));
      if(!pool.length) return bonus.length ? bonus[(rng() * bonus.length) | 0]
                                           : (rng() < .5 ? 'count' : 'quiz');
      return pool[(rng() * pool.length) | 0];
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
      /* สุ่มจนได้กลไกที่บ้านหลังนี้เล่นได้จริง (เช่นเควสต์ไปนั่งโต๊ะต้องมีโต๊ะ/เก้าอี้ก่อน) */
      let m = pick(rng, FAM_MECHS), guard = 0;
      while(!famMechOk(m) && guard++ < 20) m = pick(rng, FAM_MECHS);
      if(!famMechOk(m)) m = 'quiz';
      return { who: who, m: m, st:'', stars:0 };
    }
    /* กระดาน 5 ชุด/วัน — โควตาแยกจาก NPC เด็ดขาด (ข้อ 19) */
    function rollBoard(day){
      const rng = rngFrom(fnv(childId() + '|' + day + '|board'));
      const ids = questableIds();
      const out = [];
      for(let i=0; i<BOARD_N; i++){
        /* ⚠ ต้องสุ่ม **คน** ก่อน **งาน** เสมอ — งานของตึกแล็บผูกกับตัวคน (ดู LAB_MECHS)
             ถ้าสลับลำดับ กระดานจะแจกงานแล็บให้ชาวบ้านทั่วไปมั่วไปหมด */
        const npc = ids.length ? pick(rng, ids) : '';
        out.push({ m: rollWorkMech(rng, npc), npc: npc });
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
    /* ---------- คลังโจทย์จาก "เกมหน้าหลัก" ที่เอามาใช้ซ้ำ (ผู้ใช้สั่ง 2026-08-10) ----------
       ⚠ อ่านจาก global ของหน้าหลักตรงๆ (`ORDER_SETS` / `EF_CATEGORIES` ใน js/data-pools.js)
         ซึ่งโหลดมาก่อนไฟล์นี้เสมอ · **ถ้าไม่มีให้ถอยไปใช้คลังของโหมดบ้านเอง ห้ามพัง**
       ⚠ ORDER_SETS ติดแท็กระดับชั้น (p4/p5/p6) — เด็กเล็กไม่มีชุดของตัวเอง จึงถอยไปใช้ ORDER_POOLS */
    function mainOrderSets(gid){
      if(typeof ORDER_SETS === 'undefined' || !Array.isArray(ORDER_SETS)) return [];
      return ORDER_SETS.filter(o => o.tag === gid && o.items && o.items.length >= 3)
                       .map(o => ({name:o.prompt, steps:o.items.map(x => [x.e, x.l])}));
    }
    function efSortSet(){
      if(typeof EF_CATEGORIES === 'undefined' || !EF_CATEGORIES) return null;
      const bins = Object.keys(EF_CATEGORIES).map(k => ({
        id:k, name:EF_CATEGORIES[k].name, emoji:EF_CATEGORIES[k].items[0],
        items:EF_CATEGORIES[k].items.slice(1),
      })).filter(b => b.items.length >= 4);
      if(bins.length < 2) return null;
      return {name:'จัดหมวดของ', emoji:'🗂️', q:'ช่วยจัดของพวกนี้ลงหมวดให้ถูกหน่อยนะ', bins:bins};
    }

    /* ---------- ตัวสร้างกลไก "จัดของลงถัง" (เฟส 4B) ----------
       1 "ข้อ" = 1 กระดาน (ของ 4-8 ชิ้น ลงถัง 2-4 ใบ) ⇒ ใช้เวลานานกว่าโจทย์ตอบคำถามมาก
       ⇒ **จำนวนกระดานต่อเควสต์ = ครึ่งหนึ่งของ diff.qN แต่ไม่ต่ำกว่า MIN_Q** ไม่ใช่ qN เต็ม
          เกณฑ์ดาวคิดจาก `run.items.length` อยู่แล้ว จึงยืดตามเองไม่ต้องแก้ starsOf */
    /* จำนวนกระดานของมินิเกม = จำนวนข้อของเควสต์นั้น (5-10 สุ่มมาแล้วที่ buildRun) แต่ไม่ต่ำกว่า MIN_Q */
    function sortRounds(diff){ return Math.max(MIN_Q, diff.qN | 0); }
    /* opt = {set, only, id} — เฟส 6 ใช้ตัวนี้ซ้ำกับคลัง STEM ที่ไม่ใช่เกมครอบครัว
       (จม/ลอย · แม่เหล็ก · สถานะสสาร · ถิ่นที่อยู่ ล้วนเป็น "จัดของลงถัง" ทรงเดียวกันเป๊ะ
        ⇒ ไม่ต้องเขียนหน้าจอใหม่เลยแม้แต่บรรทัดเดียว — renderSortStep เดิมวาดให้ได้ทันที) */
    function sortMech(setId, getSet, opt){
      opt = opt || {};
      const set0 = opt.set || SORT_SETS[setId];
      return {
        id:opt.id || setId, name:(set0 || {}).name || setId, sort:true,
        fam: opt.fam || 'family', only: opt.only === null ? undefined : (opt.only || 'family'),
        gen(rng, diff){
          const set = getSet ? (getSet() || set0) : set0;
          if(!set) return MECHS.count.gen(rng, diff, {id:'', job:'villager'});
          /* `maxBins` = เพดานจำนวนถังต่อกระดาน (คลังที่มีถังเยอะกว่านั้นจะสุ่มมาใช้บางถัง)
             จำเป็นกับคลังถิ่นที่อยู่ที่มี 5 ถัง — การ์ดใบเล็กวางสวยสุดที่ 4 ถัง (2×2) */
          const cap   = Math.min(set.bins.length, set.maxBins || set.bins.length);
          const binN  = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : cap);
          /* ไล่ระดับภายในเควสต์: กระดานแรกของน้อย → กระดานสุดท้ายเต็มระดับชั้น (ผู้ใช้สั่ง 2026-08-10) */
          const tLo = diff.tier <= 2 ? 3 : (diff.tier <= 4 ? 4 : 5);
          const tHi = diff.tier <= 2 ? 5 : (diff.tier <= 4 ? 7 : 9);
          const nR = sortRounds(diff);
          const out = [];
          for(let r = 0; r < nR; r++){
            const p  = (nR <= 1) ? 1 : r / (nR - 1);
            const tN = Math.round(tLo + (tHi - tLo) * p);
            const bins = pickMany(rng, set.bins, Math.min(binN, set.bins.length));
            /* แจกของให้ **ทุกถังมีอย่างน้อย 1 ชิ้น** — ถังที่ว่างเปล่าทั้งกระดานทำให้เด็กงงว่าใส่ผิดไหม */
            const tiles = [];
            const left  = bins.map(b => shuffled(rng, b.items));
            bins.forEach((b, i) => { tiles.push({e: left[i].pop(), bin: b.id}); });
            /* guard: ถ้าของในถังที่เลือกไว้หมดก่อนครบจำนวน ให้หยุด (ไม่วนไม่รู้จบ) */
            let guard = 0;
            while(tiles.length < tN && guard++ < 200){
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
    /* ---------- เกมเรียงลำดับ: ลากขั้นตอนไปวางในช่อง 1..N ----------
       ใช้กระดานลาก-วางชุดเดียวกับเกมจัดของ ต่างกันแค่ `layout:'slots'` (ช่องละ 1 ชิ้น เรียงเป็นแถว) */
    /* opt = {id, name, q, sets, fam, only} — เฟส 6 ใช้ซ้ำกับวงจรชีวิต (plant-grow) ที่ไม่ใช่เกมครอบครัว */
    function orderMech(poolId, getSets, opt){
      opt = opt || {};
      const pool = opt.sets ? {name:opt.name || poolId, q:opt.q || '', sets:opt.sets}
                            : ORDER_POOLS[poolId];
      return {
        id:opt.id || poolId, name:pool.name, sort:true,
        fam: opt.fam || 'family', only: opt.only === null ? undefined : (opt.only || 'family'),
        gen(rng, diff, def, gid){
          /* คลังจากเกมหน้าหลักมาก่อน (ถ้าระดับชั้นนี้มี) ไม่มีก็ใช้คลังของโหมดบ้าน */
          const outer = getSets ? getSets(gid || '') : null;
          const sets  = (outer && outer.length) ? outer : pool.sets;
          const nR = sortRounds(diff);
          const nStepMax = diff.tier <= 2 ? 3 : (diff.tier <= 4 ? 4 : 5);
          const out = [];
          for(let r = 0; r < nR; r++){
            const p = (nR <= 1) ? 1 : r / (nR - 1);
            const nStep = Math.max(3, Math.round(3 + (nStepMax - 3) * p));   /* ไล่ระดับในรอบ */
            const set = sets[(r + ((rng() * sets.length) | 0)) % sets.length];
            const steps = set.steps.slice(0, Math.min(nStep, set.steps.length));
            const bins = steps.map((_, i) => ({id:'s' + i, name:'ที่ ' + (i + 1), emoji:String(i + 1)}));
            const tiles = shuffled(rng, steps.map((st, i) => ({e:st[0], label:st[1], bin:'s' + i})))
                            .map((t, i) => ({k:'t' + i, e:t.e, label:t.label, bin:t.bin}));
            out.push({kind:'sort', layout:'slots', q:(outer && outer.length) ? set.name : (pool.q + set.name), emoji:'', choices:[], correct:0,
                      bins, tiles, explain:'เรียงถูกทุกขั้นเลย เก่งมาก!'});
          }
          return out;
        },
        verify(it, placed){
          placed = placed || {};
          const bad = it.tiles.filter(t => placed[t.k] !== t.bin).map(t => t.k);
          return {ok: bad.length === 0, bad: bad};
        },
      };
    }
    /* ---------- เกมเตือนเรื่องสัตว์: ลากอาหารไปให้สัตว์ที่กินของนั้น ----------
       ⚠ ต้องเลือกสัตว์ที่ "กินอาหารคนละชนิดกัน" เท่านั้น — แมวกับเพนกวินกินปลาเหมือนกัน
         ถ้าอยู่กระดานเดียวกันเด็กวางถูกก็ยังถูกนับว่าผิด (ผิดกติกาเหล็กข้อ 2) */
    function petFeedMech(){
      return {
        /* ⚠ เฟส 7: เปิดให้ร้านสัตว์เลี้ยง/ฟาร์มแจกงานนี้ได้ด้วย (ผู้ใช้สั่ง 2026-08-12)
           ตารางอาหารยังมาจาก js/house-pet-care.js ตัวจริงเหมือนเดิม จึงเข้ากับร้านอยู่แล้วโดยธรรมชาติ */
        id:'petfeed', name:'เตือนเรื่องสัตว์', fam:'family', sort:true, only:'',
        gen(rng, diff){
          const foods = (petFoods() || []).filter(f => f.pets && f.pets.length && PET_FACE[f.pets[0]]);
          if(!foods.length) return MECHS.count.gen(rng, diff, {id:'', job:'villager'});
          const binN  = Math.min(diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : 4), foods.length);
          const tileN = diff.tier <= 2 ? 4 : (diff.tier <= 4 ? 6 : 8);
          const out = [];
          for(let r = 0; r < MIN_Q; r++){
            const use = pickMany(rng, foods, binN);        /* 1 ชนิดอาหาร = 1 ตัว ⇒ ไม่มีทางกำกวม */
            const bins = use.map(f => {
              const p = PET_FACE[f.pets[0]];
              return {id:f.pets[0], name:p.n, emoji:p.e};
            });
            const tiles = [];
            use.forEach((f, i) => tiles.push({e:f.emoji, label:f.name, bin:bins[i].id}));
            let guard = 0;
            while(tiles.length < tileN && guard++ < 100){
              const i = (rng() * use.length) | 0;
              tiles.push({e:use[i].emoji, label:use[i].name, bin:bins[i].id});
            }
            out.push({kind:'sort', q:'ถึงเวลาให้อาหารแล้ว ลากอาหารไปให้น้องแต่ละตัวหน่อยนะ',
                      emoji:'', choices:[], correct:0,
                      bins, tiles: shuffled(rng, tiles).map((t, i) => ({k:'t' + i, e:t.e, label:t.label, bin:t.bin})),
                      explain:'น้องๆ ได้กินอาหารที่ถูกชนิดครบทุกตัวแล้ว!'});
          }
          return out;
        },
        verify(it, placed){
          placed = placed || {};
          const bad = it.tiles.filter(t => placed[t.k] !== t.bin).map(t => t.k);
          return {ok: bad.length === 0, bad: bad};
        },
      };
    }
    /* ---------- เกมใช้เงินให้พอ: เลือกของให้ครบจำนวนโดยรวมแล้วไม่เกินงบ ----------
       ⚠ **มีคำตอบถูกได้หลายชุด** (ขอแค่ครบจำนวนและไม่เกินเงิน) ตั้งใจให้เป็นแบบนี้
         เด็กได้ลองคิดเอง ไม่ใช่ทายว่าผู้ใหญ่คิดชุดไหนอยู่ */
    function budgetMech(){
      return {
        id:'budget', name:'ใช้เงินให้พอ', fam:'family', basket:true, only:'family',
        gen(rng, diff){
          const need  = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : 4);
          const shelf = diff.tier <= 2 ? 5 : (diff.tier <= 4 ? 6 : 8);
          const pmax  = diff.tier <= 2 ? 6 : (diff.tier <= 4 ? 12 : 25);
          const out = [];
          for(let r = 0; r < MIN_Q; r++){
            const goods = pickMany(rng, MARKET_GOODS, shelf);
            const tiles = goods.map((g, i) => ({k:'t' + i, e:g[0], label:g[1],
                                                price: 1 + ((rng() * pmax) | 0)}));
            /* งบ = ราคาถูกสุด need ชิ้น + เผื่อนิดหน่อย ⇒ **มีคำตอบที่เป็นไปได้เสมอ** และไม่ง่ายเกิน */
            const cheap = tiles.map(t => t.price).sort((a, b) => a - b).slice(0, need)
                               .reduce((a, b) => a + b, 0);
            const budget = cheap + 1 + ((rng() * 3) | 0);
            out.push({kind:'sort', basket:true, need:need, budget:budget,
                      q:'คุณแม่ให้เงิน ' + budget + ' เหรียญ ช่วยเลือกของ ' + need + ' อย่างให้ไม่เกินเงินนะ',
                      emoji:'', choices:[], correct:0,
                      bins:[{id:'basket', name:'ตะกร้าของหนู', emoji:'🧺'}],
                      tiles: shuffled(rng, tiles),
                      explain:'เลือกได้ครบและไม่เกินเงินเลย เก่งมาก!'});
          }
          return out;
        },
        verify(it, placed){
          placed = placed || {};
          const inb = it.tiles.filter(t => placed[t.k] === 'basket');
          const sum = inb.reduce((a, t) => a + t.price, 0);
          if(inb.length !== it.need || sum > it.budget){
            /* บอกเฉพาะชิ้นที่ทำให้เกินงบ (ถ้าเกิน) — ไม่เด้งทิ้งทั้งตะกร้าให้เด็กเริ่มใหม่หมด */
            const bad = sum > it.budget
              ? inb.slice().sort((a, b) => b.price - a.price).slice(0, 1).map(t => t.k)
              : [];
            return {ok:false, bad: bad};
          }
          return {ok:true};
        },
      };
    }
    /* ---------- เกมจำรายการของ: ดูรายการก่อน แล้วหยิบให้ครบ ----------
       ⚠ เฟส 7 (ผู้ใช้สั่ง 2026-08-12): **เปิดให้ NPC/กระดานหยิบไปใช้ได้ด้วย** ไม่ใช่ของเควสต์ครอบครัวล้วน
         แต่ต้อง **เปลี่ยนคนสั่งกับคลังของให้เข้ากับร้าน** ไม่งั้นแม่ค้าขนมพูดว่า "คุณแม่สั่ง" = สับสน
         (`only:''` = ใช้ได้ทั้งเควสต์ครอบครัวและงาน NPC · ค่าตอบแทนยังคิดจาก spec.fam ของงานนั้นเหมือนเดิม) */
    function shoppingMech(){
      return {
        id:'shopping', name:'จำของที่แม่สั่ง', fam:'family', basket:true, memory:true, only:'',
        gen(rng, diff, def){
          const need  = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : 4);
          /* งานของ NPC ใช้ของตามธีมร้านคนนั้น · เควสต์ครอบครัวใช้ของในตลาดเหมือนเดิม */
          const themed = def && def.id ? (ITEM_SETS[themeOf(def).items] || null) : null;
          const bank = themed ? themed.map(e => [e, '']) : MARKET_GOODS;
          const who  = def && def.id ? (def.name || 'พี่เขา') : 'คุณแม่';
          const shelf = Math.min(bank.length, need + (diff.tier <= 2 ? 3 : 5));
          const out = [];
          for(let r = 0; r < MIN_Q; r++){
            const goods = pickMany(rng, bank, shelf);
            const want  = goods.slice(0, need);
            out.push({kind:'sort', basket:true, memory:true, need:need,
                      showFor: diff.tier <= 2 ? 4500 : 3500,
                      list: want.map(g => ({e:g[0], label:g[1]})),
                      q:'หยิบของที่' + who + 'สั่งให้ครบนะ',
                      emoji:'', choices:[], correct:0,
                      bins:[{id:'basket', name:'ตะกร้าของหนู', emoji:'🧺'}],
                      tiles: shuffled(rng, goods).map((g, i) => ({k:'t' + i, e:g[0], label:g[1],
                                                                  want: want.indexOf(g) >= 0})),
                      explain:'จำได้ครบทุกอย่างเลย!'});
          }
          return out;
        },
        verify(it, placed){
          placed = placed || {};
          const bad = it.tiles.filter(t => (placed[t.k] === 'basket') !== !!t.want && placed[t.k] === 'basket')
                              .map(t => t.k);
          const okCount = it.tiles.filter(t => t.want && placed[t.k] === 'basket').length;
          return {ok: bad.length === 0 && okCount === it.need, bad: bad};
        },
      };
    }
    /* ---------- เฟส 5: กลไกกลุ่ม C — ยืม engine เกมของหน้าหลักมาเล่นในการ์ดเควสต์ ----------
       ไม่ได้เขียนเกมใหม่ · ตัวจริงอยู่ที่ js/games-*.js แล้วห่อด้วย js/owl-games.js
       ⚠ **1 เควสต์ = 1 รอบเกม** (engine เดิมเป็นเกมยาว 10 ด่านอยู่แล้ว) ไม่ใช่ 5-10 ข้อแบบกลไกอื่น
         ⇒ ดาวมาจาก "จำนวนที่พลาด" ที่ engine คืนมา ไม่ใช่ run.wrong ที่นับเอง
       ⚠ ตัวตัดสินว่าเล่นจบแล้วอยู่ที่หน้าจอ (js/house.js) — ไฟล์นี้แค่บอกว่าจะเล่นเกมไหน */
    /* ---------- เฟส 6: ตวง/วัดในแล็บ (measure-lab) ----------
       โจทย์ 4 ตัวเลือกธรรมดา 3 แบบสลับกัน ⇒ ใช้ทางวาด/ทางตอบเดิมทั้งหมด ไม่ต้องมี verify()
         ① วัดของชิ้นนี้ด้วยหน่วยอะไร   (ทุกชั้น)
         ② อ่านขีดบนบีกเกอร์ว่ากี่ ml   (ทุกชั้น · มีรูป `it.beaker` ให้หน้าจอวาด)
         ③ ของสองอย่างอันไหนมากกว่า     (ป.3 ขึ้นไป — ต้องเทียบหน่วยเป็น)
       ⚠ ข้อ ③ ต้องเทียบ **หน่วยเดียวกัน** เท่านั้น (ml กับ ml) ไม่งั้นเด็กต้องแปลงหน่วยซึ่งเกินวัย */
    function measureMech(){
      const UNITS = MEASURE_UNITS;
      const conv = {ml:1, L:1000, g:1, kg:1000, mm:1, cm:10, m:1000, km:1000000};
      return {
        id:'measure', name:'ตวงและวัด', fam:'A',
        gen(rng, diff){
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            const mode = (diff.tier >= 3 && rng() < .3) ? 3 : (rng() < .5 ? 1 : 2);
            if(mode === 2){
              /* อ่านขีดบีกเกอร์ — ขีดหยาบสำหรับเด็กเล็ก (50 ml) ละเอียดขึ้นตามชั้น */
              const step = diff.tier <= 2 ? 50 : (diff.tier <= 4 ? 25 : 10);
              const max  = diff.tier <= 2 ? 200 : (diff.tier <= 4 ? 300 : 500);
              const n    = Math.max(1, ((rng() * (max / step - 1)) | 0) + 1);
              const ans  = n * step;
              const opts = [ans];
              let guard = 0;
              while(opts.length < 4 && guard++ < 60){
                const v = ans + step * (((rng() * 5) | 0) - 2);
                if(v > 0 && v <= max && opts.indexOf(v) < 0) opts.push(v);
              }
              while(opts.length < 4) opts.push(ans + step * opts.length);
              const order = shuffled(rng, opts);
              out.push({kind:'beaker', beaker:{val:ans, max:max, step:step},
                        q:'น้ำในบีกเกอร์มีกี่มิลลิลิตร?', emoji:'', show:'',
                        choices: order.map(v => v + ' ml'), correct: order.indexOf(ans),
                        explain:'อ่านที่ขีดได้ ' + ans + ' ml พอดี'});
            }else if(mode === 3){
              /* เทียบว่าอันไหนมากกว่า — หยิบของหน่วยเดียวกัน 2 ชิ้นที่ค่าต่างกันชัดๆ */
              const kind = ['vol','mass','len'][(rng() * 3) | 0];
              const pool = MEASURE_ITEMS.filter(x => UNITS[x[2]].kind === kind);
              if(pool.length < 2) continue;
              const two = pickMany(rng, pool, 2);
              const v0 = two[0][3] * conv[two[0][2]], v1 = two[1][3] * conv[two[1][2]];
              if(v0 === v1) continue;
              const big = v0 > v1 ? two[0] : two[1];
              const order = shuffled(rng, two);
              out.push({q:'อันไหน' + (kind === 'len' ? 'ยาวกว่า' : (kind === 'mass' ? 'หนักกว่า' : 'มากกว่า')) + '?',
                        emoji:'', show: two[0][0] + '  ' + two[1][0],
                        choices: order.map(x => x[0] + ' ' + x[1]),
                        correct: order.indexOf(big),
                        explain: big[1] + ' ประมาณ ' + big[3] + ' ' + big[2]});
            }else{
              /* วัดด้วยหน่วยอะไร — ตัวลวงมาจากหน่วยคนละชนิด (ชั้นเล็ก) หรือชนิดเดียวกัน (ชั้นโต ยากขึ้น) */
              const it   = pick(rng, MEASURE_ITEMS);
              const ans  = it[2];
              const same = Object.keys(UNITS).filter(u => u !== ans && UNITS[u].kind === UNITS[ans].kind);
              const diffU= Object.keys(UNITS).filter(u => UNITS[u].kind !== UNITS[ans].kind);
              const from = dk.p > .5 && same.length >= 3 ? same : shuffled(rng, same.concat(diffU));
              const opts = [ans].concat(pickMany(rng, from, 3));
              const order = shuffled(rng, opts);
              out.push({q:'วัด "' + it[1] + '" ควรใช้หน่วยอะไร?', emoji: it[0], show:'',
                        choices: order.map(u => UNITS[u].n), correct: order.indexOf(ans),
                        explain: it[1] + ' ประมาณ ' + it[3] + ' ' + it[2]});
            }
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }

    /* ================= เฟส 7 — กลไกกลุ่ม B (ข้อ 15.2) =================
       ทุกตัวใช้ "ทรงหน้าจอ" ที่มีอยู่แล้ว ⇒ ไม่ต้องเขียนหน้าจอใหม่:
         pay-exact / fish-math = ตะกร้า + ปุ่มยืนยัน (ทรงเดียวกับ budget)
         stock-shelf           = จัดของลงถังหลายใบ (ทรงเดียวกับ tidy)
         recipe-seq            = เรียงลำดับ + โชว์สูตรก่อน (ทรง slots + memory)
         change-back / traffic = โจทย์ 4 ตัวเลือกธรรมดา */

    /* ---------- จ่ายเงินให้พอดี ----------
       ⚠ **ต้องมีชุดเหรียญที่จ่ายพอดีได้เสมอ** ⇒ สร้างคำตอบก่อน แล้วค่อยแจกเหรียญหลอกเพิ่ม
         (ถ้าสุ่มเหรียญก่อนแล้วหวังว่าจะรวมได้พอดี = มีโอกาสเป็น dead end จริงๆ) */
    function payExactMech(){
      return {
        id:'payexact', name:'จ่ายเงินให้พอดี', fam:'A', basket:true,
        gen(rng, diff){
          const out = [];
          const nR = sortRounds(diff);
          for(let r = 0; r < nR; r++){
            const p = (nR <= 1) ? 1 : r / (nR - 1);
            /* ราคาตามชั้น + ไล่ระดับในเควสต์ (ข้อแรกถูกสุด) */
            const cap  = diff.tier <= 2 ? 10 : (diff.tier <= 4 ? 30 : 80);
            const lo   = Math.max(2, Math.round(cap * .2));
            const price= Math.max(2, Math.round(lo + (cap - lo) * p));
            const units= COIN_UNITS.filter(u => u <= price);
            /* หาชุดเหรียญที่รวมได้พอดี (greedy จากใหญ่ไปเล็ก ⇒ ได้เสมอเพราะมีเหรียญ 1) */
            const pay = [];
            let left = price, guard = 0;
            while(left > 0 && guard++ < 40){
              const fit = units.filter(u => u <= left);
              const u = fit[fit.length - 1];
              pay.push(u); left -= u;
            }
            if(left !== 0) continue;
            /* เหรียญหลอก — จำนวนตามชั้น (ยิ่งเยอะยิ่งต้องคิด) */
            const extra = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : 4);
            const coins = pay.slice();
            for(let i = 0; i < extra; i++) coins.push(pick(rng, COIN_UNITS));
            const good = pick(rng, PRICED_GOODS);
            out.push({kind:'sort', basket:true, payTo: price, coinPay:true,
                      q:'ซื้อ' + good[1] + ' ' + good[0] + ' ราคา ' + price + ' เหรียญ — หยิบเหรียญให้พอดีนะ',
                      emoji:'', choices:[], correct:0,
                      bins:[{id:'basket', name:'จ่ายตรงนี้', emoji:'🧾'}],
                      tiles: shuffled(rng, coins).map((c, i) => ({k:'c' + i, e:'', coin:c, label:''})),
                      explain:'จ่ายได้พอดี ' + price + ' เหรียญเลย!'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
        verify(it, placed){
          placed = placed || {};
          const sum = it.tiles.filter(t => placed[t.k] === 'basket')
                              .reduce((a, t) => a + t.coin, 0);
          return {ok: sum === it.payTo, bad: []};
        },
      };
    }
    /* ---------- ทอนเงิน ---------- โจทย์ 4 ตัวเลือกธรรมดา */
    function changeBackMech(){
      return {
        id:'changeback', name:'ทอนเงิน', fam:'A',
        gen(rng, diff){
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            const cap = diff.tier <= 2 ? 10 : (diff.tier <= 4 ? 40 : 90);
            const good = pick(rng, PRICED_GOODS);
            const price = Math.max(1, Math.min(cap, Math.round(good[2] * (dk.p > .5 ? 2 : 1))));
            /* จ่ายด้วยเหรียญกลมๆ ที่มากกว่าราคา — เด็กคิดง่ายกว่าจำนวนสุ่มมั่ว */
            const payOpts = [10, 20, 50, 100].filter(v => v > price);
            if(!payOpts.length) continue;
            const paid = payOpts[0];
            const ans = paid - price;
            const opts = [ans];
            let g2 = 0;
            while(opts.length < 4 && g2++ < 60){
              const v = ans + (((rng() * 9) | 0) - 4);
              if(v >= 0 && opts.indexOf(v) < 0) opts.push(v);
            }
            while(opts.length < 4) opts.push(ans + opts.length + 1);
            const order = shuffled(rng, opts);
            out.push({q:'ซื้อ' + good[1] + ' ราคา ' + price + ' เหรียญ จ่ายไป ' + paid
                        + ' เหรียญ ต้องทอนกี่เหรียญ?',
                      emoji: good[0], show:'',
                      choices: order.map(String), correct: order.indexOf(ans),
                      explain: paid + ' − ' + price + ' = ' + ans + ' เหรียญ'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }
    /* ---------- จัดชั้นวาง ---------- ทรงเดียวกับ tidy แต่ถังคือ "ชั้นในร้าน" */
    function stockShelfMech(){
      const set = {
        name:'จัดชั้นวาง', emoji:'🏪', maxBins:4,
        q:'ของมาส่งแล้ว ช่วยจัดขึ้นชั้นให้ถูกที่หน่อยนะ',
        bins: Object.keys(SHELF_CATS).map(k => ({
          id:k, name:SHELF_CATS[k].name, emoji:SHELF_CATS[k].emoji,
          items: PRICED_GOODS.filter(g => g[3] === k).map(g => g[0]),
        })),
      };
      return sortMech('', null, {set:set, id:'stockshelf', fam:'A', only:null});
    }
    /* ---------- ตกปลาคิดเลข ----------
       ⚠ ต้องมีคำตอบเสมอ ⇒ สุ่ม "ปลาที่เป็นคำตอบ" ก่อน แล้วค่อยเติมปลาหลอก */
    function fishMathMech(){
      const FISH = ['🐟','🐠','🐡','🦐','🦀','🦞','🐙','🦑'];
      return {
        id:'fishmath', name:'ตกปลาคิดเลข', fam:'A', basket:true,
        gen(rng, diff){
          const out = [];
          const nR = sortRounds(diff);
          for(let r = 0; r < nR; r++){
            const p = (nR <= 1) ? 1 : r / (nR - 1);
            const need = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 2 + ((rng() * 2) | 0) : 3);
            const cap  = diff.tier <= 2 ? 9 : (diff.tier <= 4 ? 20 : 50);
            const want = [];
            for(let i = 0; i < need; i++) want.push(1 + ((rng() * Math.max(2, Math.round(cap * (.3 + .5 * p)) / need)) | 0));
            const total = want.reduce((a, b) => a + b, 0);
            const extra = diff.tier <= 2 ? 3 : (diff.tier <= 4 ? 4 : 5);
            const nums = want.slice();
            for(let i = 0; i < extra; i++) nums.push(1 + ((rng() * cap) | 0));
            out.push({kind:'sort', basket:true, sumTo: total, need: need,
                      q:'ตกปลาให้ตัวเลขรวมกันได้ ' + total + ' พอดี (' + need + ' ตัว)',
                      emoji:'', choices:[], correct:0,
                      bins:[{id:'basket', name:'ข้องใส่ปลา', emoji:'🪣'}],
                      tiles: shuffled(rng, nums).map((n, i) => ({k:'f' + i, e: FISH[i % FISH.length],
                                                                label: String(n), num: n})),
                      explain:'รวมกันได้ ' + total + ' พอดีเลย!'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
        verify(it, placed){
          placed = placed || {};
          const inb = it.tiles.filter(t => placed[t.k] === 'basket');
          const sum = inb.reduce((a, t) => a + t.num, 0);
          /* ⚠ ยอมรับ **ทุกชุดที่รวมได้เท่าโจทย์** ไม่ใช่เฉพาะชุดที่ตั้งใจไว้ (เหมือนเกม budget)
             เด็กคิดวิธีของตัวเองแล้วถูกก็ต้องผ่าน — บังคับจำนวนตัวไว้กันเดาแบบใส่หมดทั้งกระดาน */
          return {ok: sum === it.sumTo && inb.length === it.need, bad: []};
        },
      };
    }
    /* ---------- ทำตามสูตร ---------- เรียงลำดับ + เห็นสูตรก่อนแล้วสูตรหาย */
    function recipeMech(){
      const base = orderMech('', null, {id:'recipeseq', name:'ทำตามสูตร', fam:'A', only:null,
                                        q:'ทำตามสูตร — ', sets: RECIPE_SETS});
      const gen0 = base.gen;
      base.gen = function(rng, diff, def, gid){
        const items = gen0.call(base, rng, diff, def, gid);
        /* ติดธง memory ให้ทุกกระดาน ⇒ หน้าจอโชว์สูตรก่อน 3 วิ แล้วค่อยให้ลาก
           (ใช้ทาง renderMemoryList เดิมที่เกม shopping ใช้อยู่ — ต้องมี it.list ให้มันวาด) */
        items.forEach(it=>{
          it.memory = true;
          it.showFor = 3200;
          it.list = it.tiles.slice()
                      .sort((a, b) => a.bin.localeCompare(b.bin))
                      .map(t => ({e:t.e, label:t.label}));
        });
        return items;
      };
      return base;
    }
    /* ================= เฟส 7 — กลไกกลุ่ม D (ข้อ 15.4) ================= */

    /* ---------- จับผิดภาพ (spot-diff) ----------
       การ์ดใบเล็กวางภาพ 2 ฉากเต็มๆ ไม่ไหว ⇒ ย่อเป็น "2 แถวของเหมือนกัน สลับไป 1 ชิ้น"
       เด็กเลือกว่าชิ้นไหนที่ต่าง (ตัวเลือกเป็นอิโมจิ) — ยังฝึกการเทียบภาพเหมือนเดิม */
    function spotDiffMech(){
      return {
        id:'spotdiff', name:'จับผิดภาพ', fam:'A',
        gen(rng, diff){
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            const sc = pick(rng, SPOT_SCENES);
            /* จำนวนของในแถว: ชั้นเล็ก 4 → ชั้นโต 8 · ไล่ระดับภายในเควสต์ด้วย */
            const nLo = diff.tier <= 2 ? 4 : (diff.tier <= 4 ? 5 : 6);
            const nHi = diff.tier <= 2 ? 5 : (diff.tier <= 4 ? 7 : 8);
            const n   = Math.min(sc[1].length - 1, Math.round(nLo + (nHi - nLo) * dk.p));
            const row  = pickMany(rng, sc[1], n);
            const rest = sc[1].filter(e => row.indexOf(e) < 0);
            if(!rest.length) continue;
            const at  = (rng() * n) | 0;
            const was = row[at];
            const now = pick(rng, rest);
            const row2 = row.slice(); row2[at] = now;
            /* ตัวเลือก = ของที่ "หายไป" + ของอื่นในแถวบน (เด็กต้องหาว่าชิ้นไหนไม่อยู่ในแถวล่างแล้ว) */
            const others = row.filter((_, i) => i !== at);
            const order = shuffled(rng, [was].concat(pickMany(rng, others, Math.min(3, others.length))));
            out.push({kind:'spot', rows:[row, row2],
                      q:'ฉาก"' + sc[0] + '" สองแถวนี้ต่างกัน — ของชิ้นไหนหายไปจากแถวล่าง?',
                      emoji:'', show:'', choices: order, correct: order.indexOf(was),
                      explain: was + ' หายไป กลายเป็น ' + now + ' แทน'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }
    /* ---------- นับแว้บเดียว (flash-count) ----------
       โชว์ของกระจายบนการ์ด 2-3 วิ แล้วซ่อน → ถามว่ามีกี่ชิ้น
       ⚠ "ซ่อนของ" คือตัวกลไกเอง ไม่ใช่การจับเวลาตอบ — ตอบช้าแค่ไหนก็ได้ ไม่มีบทลงโทษ */
    function flashCountMech(){
      return {
        id:'flashcount', name:'นับแว้บเดียว', fam:'A',
        gen(rng, diff, def){
          const set = ITEM_SETS[themeOf(def).items] || ITEM_SETS.town;
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            /* ชั้นเล็ก: ของชนิดเดียว 2-5 ชิ้น · ชั้นโต: 2 ชนิดปนกัน แล้วถามเจาะชนิด */
            const two = diff.tier >= 4 && dk.p > .4;
            const main = pick(rng, set);
            const other = pick(rng, set.filter(e => e !== main));
            const nMain = 2 + ((rng() * Math.max(2, Math.min(7, dk.countMax - 2))) | 0);
            const nOther = two ? 1 + ((rng() * 4) | 0) : 0;
            let cells = [];
            for(let i = 0; i < nMain; i++) cells.push(main);
            for(let i = 0; i < nOther; i++) cells.push(other);
            cells = shuffled(rng, cells);
            const opts = [nMain];
            let g2 = 0;
            while(opts.length < 4 && g2++ < 60){
              const v = Math.max(1, nMain + (((rng() * 5) | 0) - 2));
              if(opts.indexOf(v) < 0) opts.push(v);
            }
            while(opts.length < 4) opts.push(nMain + opts.length);
            const order = shuffled(rng, opts);
            out.push({kind:'flash', flash:{cells: cells, showFor: diff.tier <= 2 ? 3000 : 2400},
                      q:'เมื่อกี้มี ' + main + ' กี่ชิ้น?', emoji:'', show:'',
                      choices: order.map(String), correct: order.indexOf(nMain),
                      explain:'มี ' + main + ' ทั้งหมด ' + nMain + ' ชิ้น'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }
    /* ---------- แต่งตัวตามโจทย์ (dress-order) ----------
       ⚠ **แต่งหุ่นในการ์ด ไม่ผูกกับของแต่งตัวที่เด็กซื้อจริง** (ผู้ใช้ตัดสิน 2026-08-12)
         ตั้งแต่เฟส 1 ปิดของฟรี ของแต่งตัวต้องซื้อ ⇒ ถ้าสั่ง "ใส่หมวกฟาง" แล้วเด็กยังไม่มี = dead end
       ใช้ทรงตะกร้า (เลือกของใส่ตะกร้าแล้วกดยืนยัน) เหมือนเกมซื้อของ — เด็กคุ้นท่าอยู่แล้ว */
    function dressMech(){
      return {
        id:'dressorder', name:'แต่งตัวตามโจทย์', fam:'A', basket:true,
        gen(rng, diff){
          const out = [];
          const nR = sortRounds(diff);
          for(let r = 0; r < nR; r++){
            const p = (nR <= 1) ? 1 : r / (nR - 1);
            const need = diff.tier <= 2 ? 1 : (diff.tier <= 4 ? Math.round(1 + p) : Math.round(2 + p));
            const shelf = Math.min(DRESS_ITEMS.length, need + (diff.tier <= 2 ? 3 : 5));
            const pool = pickMany(rng, DRESS_ITEMS, shelf);
            const want = pool.slice(0, need);
            /* ⚠ ของที่ "ไม่ต้องการ" ห้ามมีชนิด+สีตรงกับของที่สั่งเป๊ะ ไม่งั้นมี 2 คำตอบที่ถูกพอกัน */
            const sig = x => x[1] + '|' + x[2];
            const wantSig = want.map(sig);
            const tiles = pool.filter((x, i) => i < need || wantSig.indexOf(sig(x)) < 0);
            if(tiles.length < need + 1) continue;
            const order = want.map(w => w[1] + w[2]).join(' กับ ');
            out.push({kind:'sort', basket:true, need:need, dress:true,
                      q:'ช่วยหยิบ' + order + 'ให้หน่อยนะ',
                      emoji:'', choices:[], correct:0,
                      bins:[{id:'basket', name:'ชุดของหนู', emoji:'🪞'}],
                      tiles: shuffled(rng, tiles).map((x, i) => ({k:'d' + i, e:x[0],
                                        label:x[1] + x[2], want: wantSig.indexOf(sig(x)) >= 0})),
                      explain:'ใส่ครบตามที่บอกเลย เก่งมาก!'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
        verify(it, placed){
          placed = placed || {};
          const inb = it.tiles.filter(t => placed[t.k] === 'basket');
          const bad = inb.filter(t => !t.want).map(t => t.k);
          const got = inb.filter(t => t.want).length;
          return {ok: bad.length === 0 && got === it.need, bad: bad};
        },
      };
    }
    /* ---------- หาของที่หาย (find-hidden) ---------- เควสต์เดินในโลก 3D จริง
       NPC บอกว่าทำของหายไว้ที่ย่านไหน → เด็กเดินไปที่นั่น = เจอ
       ⚠ ใช้ **ย่านที่ questZonesAt() ใน js/house.js รู้จักจริง** เท่านั้น ไม่งั้นเดินยังไงก็ไม่จบ
       ⚠ ไม่เข้ากติกาขั้นต่ำ MIN_Q โดยตั้งใจ (กติกาเดียวกับ dinner/market/deliver) */
    function findHiddenMech(){
      return {
        id:'findhidden', name:'หาของที่หาย', fam:'B', walk:true,
        gen(rng){
          const zone = pick(rng, HIDDEN_ZONES);
          const th   = pick(rng, HIDDEN_ITEMS);
          return [{kind:'walk', target:'zone', zone: zone[0], give:{e:th[0], label:th[1]},
                   q:'ทำ' + th[1] + ' ' + th[0] + ' หายไว้แถว' + zone[1] + ' ช่วยไปหาให้หน่อยได้ไหม?',
                   go:'ไปหาให้! ' + th[0],
                   hint:'ไปหา' + th[1] + ' ' + th[0] + ' ที่' + zone[1],
                   emoji:'', choices:[], correct:0,
                   explain:'เจอแล้ว! ขอบคุณที่ช่วยหานะ'}];
        },
        verify(){ return {ok:true}; },     /* หน้าจอเป็นคนตัดสินว่าเดินถึงย่านนั้นจริงแล้ว */
      };
    }

    /* ---------- ส่งของถึงมือ (deliver) ---------- เควสต์เดินในโลก 3D จริง
       รับของจาก NPC คนนี้ → เดินไปหาอีกคน → แตะตัวเขา = จบงาน
       ⚠ **ไม่เข้ากติกาขั้นต่ำ MIN_Q โดยตั้งใจ** (กติกาเดียวกับ dinner/market ของเฟส 4B)
         งานเดินคือ "ไปให้ถึงแล้วทำ" ชิ้นเดียวจบ บังคับเดินวน 5 รอบจะกลายเป็นงานน่าเบื่อ
       ⚠ **ปลายทางต้องเป็นคนที่เดินไปถึงได้จริงเสมอ** ⇒ เลือกจาก questableIds() เท่านั้น
         (คนกลุ่มนี้ยืนอยู่ในเมืองและระบบเดินไปหาได้อยู่แล้วทุกวัน) และห้ามเป็นคนที่แจกงานเอง
       ⚠ ชื่อ/สถานที่ของปลายทางให้ฝั่งหน้าจอเติมเอง — ไฟล์นี้ไม่รู้จักผังเมือง (ส่งไปแค่ id) */
    const DELIVER_ITEMS = [
      ['📦','พัสดุ'], ['✉️','จดหมาย'], ['🎁','ของขวัญ'], ['🍱','ข้าวกล่อง'], ['🧺','ตะกร้าผลไม้'],
      ['📕','หนังสือ'], ['🔧','เครื่องมือ'], ['💐','ช่อดอกไม้'], ['🍰','เค้ก'], ['🧸','ตุ๊กตา'],
      ['🗝️','กุญแจ'], ['👜','กระเป๋า'], ['☂️','ร่ม'], ['🧢','หมวก'], ['🍞','ขนมปังอบใหม่'],
    ];
    function deliverMech(){
      return {
        id:'deliver', name:'ส่งของถึงมือ', fam:'B', walk:true,
        gen(rng, diff, def){
          const ids = questableIds().filter(id => id !== (def && def.id));
          if(!ids.length) return MECHS.count.gen(rng, diff, def || {id:'', job:'villager'});
          const to = pick(rng, ids);
          const th = pick(rng, DELIVER_ITEMS);
          return [{kind:'walk', target:'npc', toNpc: to, give:{e:th[0], label:th[1]},
                   q:'ช่วยเอา' + th[1] + ' ' + th[0] + ' ไปส่งให้หน่อยได้ไหม?',
                   go:'รับไปส่งเลย! ' + th[0],
                   hint:'เอา' + th[1] + 'ไปส่งให้',      /* หน้าจอต่อท้ายด้วยชื่อคน + สถานที่ */
                   emoji:'', choices:[], correct:0,
                   explain:'ส่งของถึงมือเรียบร้อย ขอบคุณมากนะ!'}];
        },
        verify(){ return {ok:true}; },     /* หน้าจอเป็นคนตัดสินว่าเดินไปถึงตัวคนนั้นจริงแล้ว */
      };
    }
    /* ================= เฟส 9 — เควสต์ดนตรี (ข้อ 31) =================
       ⚠ **ทั้ง 2 แบบต้องมีเครื่องดนตรีในบ้านเด็กก่อนถึงจะแจก** (`hasInstrument()` ส่งมาทาง kit)
         ไม่งั้นเด็กรับงานแล้วเล่นไม่ได้ = dead end แบบเดียวกับเควสต์ `dinner` ที่ต้องมีโต๊ะก่อน
       ⚠ เสียงทั้งหมดใช้ Web Audio ชุดเดิม ไม่โหลดไฟล์เสียงเพิ่ม (หน้าจอเป็นคนเล่นเสียงจาก `it.sound`) */

    /* ---------- เล่นตามทำนอง (play-along) ----------
       ฟังทำนอง 4-6 โน้ตแล้วกดปุ่มโน้ตตามลำดับ · กดผิด = เริ่มกดใหม่ข้อนั้น (ไม่มีบทลงโทษอื่น) */
    function playAlongMech(){
      return {
        id:'playalong', name:'เล่นตามทำนอง', fam:'A', music:true,
        gen(rng, diff){
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            /* ชั้นเล็ก 3 โน้ตจากคีย์ 5 ตัว → ชั้นโต 6 โน้ตจากคีย์ 7 ตัว · ไล่ระดับในเควสต์ด้วย */
            const keyN = diff.tier <= 2 ? 5 : 7;
            const nLo = diff.tier <= 2 ? 3 : 4;
            const nHi = diff.tier <= 2 ? 4 : 6;
            const n = Math.round(nLo + (nHi - nLo) * dk.p);
            const seq = [];
            for(let i = 0; i < n; i++) seq.push((rng() * keyN) | 0);
            out.push({kind:'playalong', sound:{seq: seq.slice()}, seq: seq.slice(), keys: keyN,
                      q:'ฟังทำนองนี้แล้วกดตามให้ถูกลำดับนะ', emoji:'🎵', show:'',
                      choices:[], correct:0,
                      explain:'เล่นตามได้ครบทุกตัวเลย เก่งมาก!'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
        /* payload = อาเรย์ลำดับคีย์ที่เด็กกด — หน้าจอส่งมาเมื่อกดครบจำนวนแล้ว */
        verify(it, got){
          got = got || [];
          if(got.length !== it.seq.length) return {ok:false, bad:[]};
          const bad = [];
          it.seq.forEach((v, i) => { if(got[i] !== v) bad.push(i); });
          return {ok: bad.length === 0, bad: bad};
        },
      };
    }
    /* ---------- ทายเสียงเครื่องดนตรี (find-sound) ----------
       ⚠ เสียงของแต่ละเครื่องต่างกันที่ **โน้ต/จำนวนโน้ตที่ผูกกับชิ้นนั้นจริงๆ** (item.note/item.tune)
         ไม่ใช่ timbre — Web Audio ชุดนี้เปลี่ยน timbre ไม่ได้ ⇒ เด็กที่เคยแตะเครื่องในบ้าน
         จะจำเสียงได้จริง (เล่นเองได้ทุกเมื่อ) จึงยุติธรรม ไม่ใช่โจทย์เดา */
    function findSoundMech(){
      return {
        id:'findsound', name:'ทายเสียงเครื่องดนตรี', fam:'A', music:true,
        gen(rng, diff){
          const all = instruments();
          if(all.length < 4) return MECHS.count.gen(rng, diff, {id:'', job:'villager'});
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const four = pickMany(rng, all, 4);
            const ans = four[0];
            const order = shuffled(rng, four);
            out.push({kind:'sound',
                      sound: ans.tune && ans.tune.length ? {seq: ans.tune} : {seq: [ans.note | 0]},
                      q:'ฟังเสียงนี้แล้วทายสิว่าเครื่องดนตรีอะไร?', emoji:'👂', show:'',
                      choices: order.map(x => x.emoji + ' ' + x.name),
                      correct: order.indexOf(ans),
                      explain:'เสียงนี้คือ' + ans.name + ' ' + ans.emoji});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }

    /* ---------- ป้ายจราจร ---------- โจทย์ 4 ตัวเลือกจากคลังที่เขียนคำตอบไว้แล้ว */
    function trafficMech(){
      return {
        id:'traffic', name:'ป้ายบอกทาง', fam:'A',
        gen(rng, diff){
          const cards = pickMany(rng, TRAFFIC_CARDS, Math.min(diff.qN, TRAFFIC_CARDS.length));
          return cards.map(c=>{
            const order = shuffled(rng, [c[2]].concat(c[3]));
            return {q:c[1], emoji:c[0], show:'',
                    choices: order, correct: order.indexOf(c[2]),
                    explain:'ถูกต้อง! ' + c[2]};
          });
        },
      };
    }

    /* ---------- เฟส 5 ตกค้าง: ทายเสียง (sound-guess) ----------
       โจทย์ 4 ตัวเลือกธรรมดา + ปุ่ม "ฟังอีกครั้ง" (หน้าจอเป็นคนเล่นเสียงจาก `it.sound`)
       ⚠ **ต้องกดฟังซ้ำได้ไม่จำกัด** — เด็กเล็กฟังรอบเดียวไม่ทัน และการจำกัดจำนวนครั้งคือการลงโทษ
       ⚠ ตัวเลือกของข้อ "ทายเพลง" ต้องเป็นชื่อเพลงในคลังเดียวกันเสมอ ไม่ปนชื่อมั่ว */
    function soundMech(){
      const songs = (typeof MUSIC_LEVEL2_SONGS !== 'undefined') ? MUSIC_LEVEL2_SONGS : [];
      const keys  = (typeof MUSIC_WHITE_KEYS   !== 'undefined') ? MUSIC_WHITE_KEYS   : [];
      return {
        id:'soundguess', name:'ทายเสียง', fam:'A',
        gen(rng, diff){
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            /* เลือกชนิดโจทย์ตามชั้น: เด็กเล็กได้แต่ "ขึ้น/ลง" กับ "ทายเพลง" ที่ง่ายที่สุด
               ชั้นโตเริ่มมีนับจำนวนโน้ตและทายชื่อโน้ต */
            const bag = ['dir', 'song'];
            if(diff.tier >= 2) bag.push('count');
            if(diff.tier >= 4 && keys.length) bag.push('note');
            const mode = pick(rng, bag);
            if(mode === 'song' && songs.length >= 4){
              const four = pickMany(rng, songs, 4);
              const ans  = four[0];
              const n    = diff.tier <= 2 ? 7 : (diff.tier <= 4 ? 6 : 5);   /* ชั้นโตได้ยินสั้นลง = ยากขึ้น */
              const order = shuffled(rng, four);
              out.push({kind:'sound', sound:{seq: ans.notes.slice(0, n), beats: (ans.beats || []).slice(0, n)},
                        q:'ฟังทำนองนี้แล้วทายสิว่าเพลงอะไร?', emoji:'🎵', show:'',
                        choices: order.map(s => s.name), correct: order.indexOf(ans),
                        explain:'เพลงนี้คือ ' + ans.name});
            }else if(mode === 'count'){
              const n = 2 + ((rng() * (dk.p > .5 ? 5 : 3)) | 0);            /* 2-6 ตัว ไล่ระดับในเควสต์ */
              const seq = [];
              for(let i = 0; i < n; i++) seq.push((rng() * 8) | 0);
              const opts = [n];
              let g2 = 0;
              while(opts.length < 4 && g2++ < 40){
                const v = Math.max(1, n + (((rng() * 5) | 0) - 2));
                if(opts.indexOf(v) < 0) opts.push(v);
              }
              while(opts.length < 4) opts.push(n + opts.length);
              const order = shuffled(rng, opts);
              out.push({kind:'sound', sound:{seq: seq},
                        q:'ได้ยินเสียงกี่ตัว?', emoji:'🔢', show:'',
                        choices: order.map(String), correct: order.indexOf(n),
                        explain:'มีทั้งหมด ' + n + ' เสียง'});
            }else if(mode === 'note' && keys.length){
              /* ทายชื่อโน้ต — ใช้เฉพาะคีย์ช่วงแรก (ด-ท) ไม่งั้นตัวเลือกจะมีชื่อซ้ำกันสองตัว */
              const wi  = (rng() * 7) | 0;
              const ans = keys[wi].th;
              const others = [];
              for(let i = 0; i < 7; i++) if(i !== wi) others.push(keys[i].th);
              const order = shuffled(rng, [ans].concat(pickMany(rng, others, 3)));
              out.push({kind:'sound', sound:{seq:[wi]},
                        q:'เสียงนี้คือโน้ตตัวอะไร?', emoji:'🎹', show:'',
                        choices: order, correct: order.indexOf(ans),
                        explain:'เสียงนี้คือตัว ' + ans});
            }else{
              const m = pick(rng, SOUND_MOTIFS);
              const ans = m.dir === 'up' ? 'เสียงสูงขึ้น ⬆️' : 'เสียงต่ำลง ⬇️';
              const order = shuffled(rng, ['เสียงสูงขึ้น ⬆️', 'เสียงต่ำลง ⬇️']);
              out.push({kind:'sound', sound:{seq: m.s},
                        q:'ฟังแล้วบอกหน่อย เสียงสูงขึ้นหรือต่ำลง?', emoji:'👂', show:'',
                        choices: order, correct: order.indexOf(ans),
                        explain: m.dir === 'up' ? 'ไล่จากเสียงต่ำไปเสียงสูง' : 'ไล่จากเสียงสูงลงมาเสียงต่ำ'});
            }
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }

    /* ---------- เฟส 6: หาบรรทัดที่ผิด (code-debug) ----------
       โชว์ชุดคำสั่งของภารกิจหนึ่ง แล้วสลับ 1 บรรทัดเป็นคำสั่งจากภารกิจอื่น เด็กหาว่าบรรทัดไหนไม่เข้าพวก
       ⚠ **บรรทัดปลอมต้องเป็นคำสั่ง "เฉพาะทาง" ของงานอื่นเท่านั้น** — ถ้าหยิบคำสั่งทั่วไป
         (เดินหน้า/เลี้ยวซ้าย/หันกลับ) มาใส่ มันเข้ากับงานไหนก็ได้ ⇒ เด็กหาไม่เจอ/เถียงได้ว่าไม่ผิด
         ตัวกรองคือ GENERIC ด้านล่าง **ห้ามเอาออก** */
    const GENERIC = ['⬆️','⬇️','➡️','⬅️','🔄'];
    function codeDebugMech(){
      const special = [];
      CODE_TASKS.forEach((t, ti) => t[1].forEach(s => {
        if(GENERIC.indexOf(s[0]) < 0) special.push({s:s, ti:ti});
      }));
      return {
        id:'codedebug', name:'หาคำสั่งที่ผิด', fam:'A',
        gen(rng, diff){
          const out = [];
          for(let k = 0; k < diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);
            const ti = (rng() * CODE_TASKS.length) | 0;
            const task = CODE_TASKS[ti];
            /* ชั้นเล็กเห็นน้อยบรรทัด ชั้นโตเห็นครบ · ไล่ระดับภายในเควสต์ด้วย (ข้อแรกสั้นสุด) */
            const nMax = diff.tier <= 2 ? 3 : (diff.tier <= 4 ? 4 : 5);
            const n = Math.max(3, Math.min(task[1].length,
                        Math.round(3 + (nMax - 3) * dk.p)));
            const steps = task[1].slice(0, n).map(s => [s[0], s[1]]);
            const badPool = special.filter(x => x.ti !== ti
                              && !steps.some(s => s[0] === x.s[0]));
            if(!badPool.length) continue;
            const bad = pick(rng, badPool).s;
            const at = (rng() * n) | 0;                       /* บรรทัดที่ถูกสลับ */
            steps[at] = [bad[0], bad[1]];
            const order = steps.map((_, i) => 'บรรทัดที่ ' + (i + 1));
            out.push({kind:'code', lines: steps.map((s, i) => ({n:i + 1, e:s[0], t:s[1]})),
                      q:'ภารกิจ "' + task[0] + '" — มีคำสั่งผิดอยู่ 1 บรรทัด บรรทัดไหน?',
                      emoji:'', show:'', choices: order, correct: at,
                      explain:'บรรทัดที่ ' + (at + 1) + ' ("' + bad[1] + '") ไม่เกี่ยวกับงานนี้เลย'});
          }
          return out.length ? out : MECHS.count.gen(rng, diff, {id:'', job:'villager'});
        },
      };
    }

    /* `pick` = หมวดย่อยของเกมเดียวกัน (ใช้กับ code: plain/loop/cond — ดู PICKS ใน js/house-games.js)
       `ask`  = ประโยคชวนเล่นเฉพาะตัว (แล็บพูดคนละแบบกับชาวบ้านทั่วไป) */
    function engineMech(gameId, name, emoji, opt){
      opt = opt || {};
      return {
        id:opt.id || gameId, name:name, fam:'A', engine:gameId, pick:opt.pick || '', only:'engine',
        gen(){
          return [{kind:'engine', game:gameId, pick:opt.pick || '', emoji:emoji || '',
                   q: opt.ask || ('มาเล่น "' + name + '" ด้วยกันหน่อยสิ!'),
                   go:'เล่นเลย! ' + (emoji || '🎮'),
                   choices:[], correct:0, explain:''}];
        },
        verify(){ return {ok:true}; },      /* หน้าจอส่งมาเมื่อ engine จบเกมแล้วเท่านั้น */
      };
    }

    /* ---------- เควสต์ที่ต้อง "เดินไปทำนอกบ้าน" (family-time / shopping-list) ----------
       ⚠ **กลุ่มนี้ไม่เข้ากติกา "อย่างน้อย MIN_Q ข้อ" โดยตั้งใจ** (ผู้ใช้อนุมัติ 2026-08-10)
         กติกานั้นใช้กับเกมที่เปิด popup ให้เด็กตอบคำถามเท่านั้น — งานเดินคือ "ไปให้ถึงแล้วทำ"
         ชิ้นเดียวจบ ถ้าบังคับให้เดินวน 5 รอบจะกลายเป็นงานน่าเบื่อแทนที่จะสนุก
       ⚠ ตัวตัดสินว่า "ไปถึงแล้ว" อยู่ที่ js/house.js (ไฟล์นี้ไม่รู้จักผังเมือง/ฉาก 3D)
         ที่นี่แค่บอกว่าเป้าหมายคืออะไรผ่าน `target` */
    function dinnerMech(){
      return {
        id:'dinner', name:'กินข้าวพร้อมหน้า', fam:'family', walk:true, only:'family',
        gen(){
          return [{kind:'walk', target:'table',
                   q:'เดี๋ยวเรากินข้าวพร้อมหน้ากันนะ ไปนั่งรอที่โต๊ะก่อนเลยจ้ะ',
                   go:'ไปนั่งที่โต๊ะ 🍽️', hint:'ไปนั่งที่โต๊ะหรือเก้าอี้ในบ้านกันนะ',
                   emoji:'', choices:[], correct:0, explain:'นั่งกินข้าวพร้อมหน้ากันแล้ว อบอุ่นจัง!'}];
        },
        verify(){ return {ok:true}; },     /* หน้าจอเป็นคนตัดสินว่าไปถึงจริงแล้วค่อยส่งมา */
      };
    }
    function marketMech(){
      return {
        id:'market', name:'ไปซื้อของให้แม่', fam:'family', walk:true, only:'family',
        gen(rng, diff){
          const need  = diff.tier <= 2 ? 2 : (diff.tier <= 4 ? 3 : 4);
          const shelf = Math.min(MARKET_GOODS.length, need + (diff.tier <= 2 ? 3 : 5));
          const goods = pickMany(rng, MARKET_GOODS, shelf);
          const want  = goods.slice(0, need);
          return [
            {kind:'walk', target:'market', list: want.map(g => ({e:g[0], label:g[1]})),
             q:'ช่วยไปซื้อของที่ตลาดให้หน่อยนะ จำให้ได้ว่าต้องซื้ออะไรบ้าง',
             go:'จำได้แล้ว ไปตลาด! 🛒', hint:'เดินไปที่ตลาดในหมู่บ้านกันนะ',
             emoji:'', choices:[], correct:0, explain:''},
            {kind:'sort', basket:true, need:need, q:'ถึงตลาดแล้ว! หยิบของที่คุณแม่สั่งให้ครบนะ',
             emoji:'', choices:[], correct:0,
             bins:[{id:'basket', name:'ตะกร้าของหนู', emoji:'🧺'}],
             tiles: shuffled(rng, goods).map((g, i) => ({k:'t' + i, e:g[0], label:g[1],
                                                        want: want.indexOf(g) >= 0})),
             explain:'ซื้อของครบตามที่แม่สั่งเลย!'},
          ];
        },
        verify(it, placed){
          if(it.kind === 'walk') return {ok:true};
          placed = placed || {};
          const bad = it.tiles.filter(t => placed[t.k] === 'basket' && !t.want).map(t => t.k);
          const got = it.tiles.filter(t => t.want && placed[t.k] === 'basket').length;
          return {ok: bad.length === 0 && got === it.need, bad: bad};
        },
      };
    }

    /* ---------- เกมดูนาฬิกา: ตื่นให้ตรงเวลา ----------
       เป็นโจทย์ 4 ตัวเลือกธรรมดา แค่มีหน้าปัดนาฬิกาเป็นรูปประกอบ (`it.clock`)
       ⇒ ใช้ทางตอบเดิมทั้งหมด ไม่ต้องมี verify() ของตัวเอง */
    function clockMech(){
      const say = (h, m) => (m === 0 ? h + ' โมง' : (m === 30 ? h + ' โมงครึ่ง' : h + ' โมง ' + m + ' นาที'));
      return {
        id:'clock', name:'ตื่นให้ตรงเวลา', fam:'family', only:'family',
        gen(rng, diff){
          const out = [];
          for(let r = 0; r < MIN_Q; r++){
            const h = 1 + ((rng() * 12) | 0);
            const m = diff.tier <= 2 ? 0
                    : (diff.tier <= 4 ? (rng() < .5 ? 0 : 30) : [0, 5, 15, 30, 45][(rng() * 5) | 0]);
            const ans = say(h, m);
            const opts = [ans];
            let guard = 0;
            while(opts.length < 4 && guard++ < 60){
              const dh = ((h + 11 + ((rng() * 3) | 0)) % 12) + 1;
              const dm = diff.tier <= 2 ? 0 : [0, 30, 15, 45][(rng() * 4) | 0];
              const v = say(dh, dm);
              if(opts.indexOf(v) < 0) opts.push(v);
            }
            while(opts.length < 4) opts.push(say(((h + opts.length) % 12) + 1, m));
            const order = shuffled(rng, opts);
            out.push({kind:'clock', clock:{h:h, m:m}, q:'นาฬิกาบอกเวลาว่ากี่โมง?',
                      emoji:'', show:'', choices:order, correct:order.indexOf(ans),
                      explain:'ตอนนี้คือ ' + ans + ' พอดี'});
          }
          return out;
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
          cats.forEach(c => { c.questions.forEach((q, i) => bank.push({q:q, ord:i})); });
          const qs = pickMany(rng, bank, Math.min(diff.qN, bank.length));
          /* ⚠ **เรียงตามลำดับที่โจทย์อยู่ในคลัง** — คลัง CATS เขียนไล่ง่าย→ยากอยู่แล้ว
             จึงได้ "ไล่ระดับความยากภายในเควสต์" ฟรีโดยไม่ต้องติดป้ายความยากใหม่ทั้งคลัง */
          qs.sort((a, b) => a.ord - b.ord);
          return qs.map(x => normQuiz(rng, x.q));
        },
      },
      /* ---- นับของ: สร้างโจทย์เองทั้งหมด ไม่ง้อคลัง (จึงเป็นตัวสำรองกันทางตันด้วย) ---- */
      count: {
        id:'count', name:'นับของ', fam:'A',
        gen(rng, diff, def){
          const set = ITEM_SETS[themeOf(def).items] || ITEM_SETS.town;
          const out = [];
          for(let k=0; k<diff.qN; k++){
            const dk = stepDiff(diff, k, diff.qN);      /* ข้อแรกของน้อย/ชนิดเดียว → ข้อท้ายเต็มระดับชั้น */
            const kinds = pickMany(rng, set, dk.kinds);
            const nums  = kinds.map(() => 2 + ((rng() * (dk.countMax - 2)) | 0));
            let cells = [];
            kinds.forEach((e, i) => { for(let j=0; j<nums[i]; j++) cells.push(e); });
            cells = shuffled(rng, cells);
            let qText, ans;
            if(dk.kinds === 1 || rng() < .55){                   /* นับของชนิดเดียว */
              const t = (rng() * kinds.length) | 0;
              qText = 'มี ' + kinds[t] + ' กี่ชิ้น?';
              ans = nums[t];
            }else if(dk.tier >= 5 && rng() < .5){                /* ต่างกันกี่ชิ้น (ป.5-6) */
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
      tidy:     sortMech('tidy'),
      laundry:  sortMech('laundry'),
      cook:     orderMech('cook'),
      routine:  orderMech('routine'),
      /* คลังจากเกมหน้าหลัก: เรียงลำดับตามหลักสูตร (ORDER_SETS) + จัดหมวดของ (EF_CATEGORIES) */
      orderlearn: orderMech('routine', mainOrderSets),
      sortcat:    sortMech('tidy', efSortSet),
      petfeed:  petFeedMech(),
      budget:   budgetMech(),
      shopping: shoppingMech(),
      clock:    clockMech(),
      dinner:   dinnerMech(),
      market:   marketMech(),
      /* เฟส 5 — กลุ่ม C: ยืม engine เกมของหน้าหลัก (ดูข้อ 15.3 ของ QUEST-DESIGN.md) */
      mix:      engineMech('mix',     'ผสมสี',        '🎨'),
      memory:   engineMech('memory',  'จับคู่ความจำ',  '🎴'),
      balance:  engineMech('balance', 'ตาชั่งวิเศษ',   '⚖️'),
      clockset: engineMech('clock',   'นาฬิกาวิเศษ',   '🕐'),
      shadow:   engineMech('shadow',  'ทายเงา',       '🫥'),
      sortcat2: engineMech('sort',    'จัดหมวดหมู่',   '🗂️'),
      orderg:   engineMech('order',   'เรียงลำดับ',    '🔢'),
      melody:   engineMech('music',   'เล่นตามทำนอง',  '🎹'),
      /* ---- เฟส 6 — แล็บ STEM ที่เขียนใหม่ (ข้อ 30) ----
         4 ตัวแรกเป็น "จัดของลงถัง" ทรงเดียวกับเกมครอบครัว ⇒ ใช้ renderSortStep เดิมได้เลย
         ⚠ ทุกตัวต้องมี `fam:'A'` (งานในร้าน) และ `only:null` = ไม่ใช่ของเควสต์ครอบครัว */
      sinkfloat: sortMech('', null, {set:STEM_SETS.sinkfloat, id:'sinkfloat', fam:'A', only:null}),
      magnet:    sortMech('', null, {set:STEM_SETS.magnet,    id:'magnet',    fam:'A', only:null}),
      states:    sortMech('', null, {set:STEM_SETS.states,    id:'states',    fam:'A', only:null}),
      habitat:   sortMech('', null, {set:STEM_SETS.habitat,   id:'habitat',   fam:'A', only:null}),
      plantgrow: orderMech('', null, {id:'plantgrow', name:'การเติบโต', sets:GROW_SETS, fam:'A', only:null,
                                      q:'ช่วยเรียงว่าอะไรเกิดก่อนหลัง — '}),
      measure:   measureMech(),
      /* ---- เฟส 6 — coding ที่เขียนใหม่ (ข้อ 30.1) ----
         codeorder = เรียงบล็อกคำสั่งให้ถูกลำดับ **ก่อน**กดรัน (ใช้กระดานลากชุดเดียวกับ cook/routine)
         codedebug = หาบรรทัดที่ผิด 1 บรรทัด (โจทย์ 4 ตัวเลือก + รายการคำสั่งเป็นรูปประกอบ) */
      codeorder: orderMech('', null, {id:'codeorder', name:'เรียงคำสั่งให้ถูก', fam:'A', only:null,
                                      q:'เรียงคำสั่งให้หุ่นยนต์ทำงานนี้ — ',
                                      sets: CODE_TASKS.map(t => ({name:t[0], steps:t[1]}))}),
      codedebug: codeDebugMech(),
      /* ---- เฟส 5 ตกค้าง: ทายเสียง (กลุ่ม C ข้อ 15.3 ที่เฟส 5 ข้ามไป) ----
         ร้านเครื่องดนตรีกับฟาร์มเป็นคนแจก (ดู SOUND_NPCS) ไม่ได้แจกทั้งเมือง */
      soundguess: soundMech(),
      /* ---- เฟส 7 — กลไกกลุ่ม B (ข้อ 15.2) · escort ถูกตัดออกตามคำสั่งผู้ใช้ ---- */
      payexact:   payExactMech(),
      changeback: changeBackMech(),
      stockshelf: stockShelfMech(),
      fishmath:   fishMathMech(),
      recipeseq:  recipeMech(),
      traffic:    trafficMech(),
      deliver:    deliverMech(),
      /* ---- เฟส 7 — กลไกกลุ่ม D (ข้อ 15.4 · ไอเดียจาก IDEA.md) ---- */
      /* ---- เฟส 9 — เควสต์ดนตรี (พี่โน้ตที่ร้านเครื่องดนตรีเป็นคนแจก) ---- */
      playalong:  playAlongMech(),
      findsound:  findSoundMech(),
      spotdiff:   spotDiffMech(),
      flashcount: flashCountMech(),
      dressorder: dressMech(),
      findhidden: findHiddenMech(),
      /* ---- เฟส 6 — แล็บ STEM/coding ที่ยืม engine เดิม (ข้อ 30/30.1) ----
         mix-color-lab / balance-lab ใช้ mech `mix`/`balance` ข้างบนซ้ำ ไม่ต้องมีตัวใหม่
         (แค่ NPC แล็บหยิบไปใช้ — ดู LAB_MECHS) ที่เพิ่มจริงคือ 5 ตัวนี้ */
      shapebuild: engineMech('tangram', 'ต่อรูปทรงตามแบบ', '🧩',
                    {id:'shapebuild', ask:'ช่วยต่อรูปทรงตามแบบในห้องแล็บหน่อยได้ไหม?'}),
      circuit:    engineMech('circuit', 'ต่อวงจรให้ไฟติด', '💡',
                    {id:'circuit',   ask:'หลอดไฟในแล็บดับอยู่ ช่วยต่อวงจรให้ไฟติดหน่อยสิ!'}),
      robot:      engineMech('code',    'พาหุ่นยนต์เดิน',  '🤖',
                    {id:'robot', pick:'plain', ask:'ช่วยเขียนคำสั่งพาหุ่นยนต์ไปให้ถึงเป้าหน่อยนะ'}),
      codeloop:   engineMech('code',    'สั่งให้วนซ้ำ',    '🔁',
                    {id:'codeloop', pick:'loop', ask:'ลองใช้คำสั่ง "วนซ้ำ" ให้โปรแกรมสั้นลงหน่อยสิ!'}),
      codecond:   engineMech('code',    'โปรแกรมมีเงื่อนไข', '🔀',
                    {id:'codecond', pick:'cond', ask:'คราวนี้ยากขึ้น — ถ้าเจอกำแพงต้องให้หุ่นยนต์เลี้ยวนะ'}),
    };
    /* กลไกที่ยืม engine หน้าหลัก — id ของ mech ไม่จำเป็นต้องตรงกับ id ของเกม (ดู .engine)
       ⚠ **ตัวของแล็บ (shapebuild/circuit/robot/codeloop/codecond) ไม่อยู่ในลิสต์นี้โดยตั้งใจ**
         ข้อ 30 ของแผนระบุว่าแล็บคือ "จุดเดียวในเมือง" ที่แจกโจทย์ STEM/coding
         ⇒ ชาวบ้านทั่วไปสุ่มไม่ได้ ต้องเดินไปที่ตึกแล็บเท่านั้น (ดู LAB_MECHS) */
    const ENGINE_MECHS = ['mix','memory','balance','clockset','shadow','sortcat2','orderg','melody'];
    /* ⚠ เช็ค 3 ชั้น: ลงทะเบียนกับ OwlGames · อยู่ใน HouseGames.ALLOW · **มีหมวดที่ชั้นเด็กเล่นได้จริง**
       ชั้นที่ 3 เพิ่มในเฟส 6 เพราะวงจรไฟฟ้ามีแต่หมวด ป.6 / แท็งแกรมมีแต่ ป.5-6
       ⚠ ต้องส่ง gid มาด้วยเมื่อกำลังคิดโจทย์ท้าทาย (ชั้นถัดไป) ไม่งั้นเช็คผิดชั้น */
    function engineReady(m, gid){
      const spec = MECHS[m];
      return !!(spec && spec.engine && hasGame(spec.engine, gid || gradeId(), spec.pick || ''));
    }
    /* ================= เฟส 6 — งานประจำ "ตึกแล็บ" (ข้อ 30 + 30.1) =================
       แผนกำหนดว่าแล็บคือ **จุดเดียวในเมือง** ที่แจกโจทย์วิทย์/วัด-ตวง/เขียนโปรแกรม
       ⇒ กลไกกลุ่มนี้ไม่อยู่ใน ENGINE_MECHS (ที่ชาวบ้านทั่วเมืองสุ่มได้) แต่ผูกกับ NPC รายคนตรงนี้
       แบ่งหน้าที่ตามข้อ 30.1: ดร.ฟ้า 🔬 วิทย์ · ดร.ต้น 🧪 วัด/ตวง/คณิต · พี่ผู้ช่วย 🥽 หุ่นยนต์+coding
       นักเรียนหน้าตึก 🎒 = เวอร์ชันง่ายสำหรับเด็กเล็ก (ไม่มีงาน coding/ของที่ต้องใช้ชั้นสูง)
       ⚠ **ต้องมี quiz ปนอยู่ทุกคนเสมอ** (กติกาข้อ 4: ทุก NPC ต้องตอบคำถามได้) */
    const LAB_MECHS = {
      'npc-lab1': ['sinkfloat','magnet','states','habitat','plantgrow','circuit','mix','quiz'],
      'npc-lab2': ['measure','balance','shapebuild','sortcat2','count','quiz'],
      'npc-lab3': ['robot','codeloop','codecond','codeorder','codedebug','quiz'],
      'npc-stu':  ['sinkfloat','plantgrow','habitat','states','codeorder','quiz','count'],
    };
    /* ทายเสียง (เฟส 5 ตกค้าง) — ข้อ 15.3 ระบุ NPC ร้านเครื่องดนตรี
       เก็บเป็นตารางเดียวกับแล็บเพราะกติกาเหมือนกันเป๊ะ: กลไกที่ผูกกับ "คน" ไม่ใช่สุ่มทั้งเมือง */
    const SPOT_MECHS = [
      /* เฟส 9: พี่โน้ตแจกเควสต์ดนตรีด้วย — `playalong`/`findsound` ถูกกรองออกเองถ้าบ้านยังไม่มีเครื่องดนตรี
         (ดู mechOk ด้านล่าง) ⇒ เด็กที่ยังไม่ได้ซื้อจะได้ quiz/count/ทายเสียงตามปกติ ไม่มีทางตัน */
      [/^npc-music/, ['soundguess','melody','playalong','findsound','quiz','count']],
    ];
    function labMechsFor(npcId){
      if(!npcId) return null;
      if(LAB_MECHS[npcId]) return LAB_MECHS[npcId];
      if(/^npc-stu/.test(npcId)) return LAB_MECHS['npc-stu'];
      for(let i = 0; i < SPOT_MECHS.length; i++)
        if(SPOT_MECHS[i][0].test(npcId)) return SPOT_MECHS[i][1];
      return null;
    }
    function isLabNpc(npcId){ return !!labMechsFor(npcId); }
    /* ---------- เฟส 7: กลไกกลุ่ม B ที่ "เพิ่มเข้าไปในพูลปกติ" ของ NPC บางกลุ่ม ----------
       ⚠ ต่างจาก LAB_MECHS/SPOT_MECHS ตรงที่ **ไม่แทนที่พูลเดิม** — ร้านค้ายังได้ quiz/count/เกม
         ตามปกติ แค่มีโอกาสได้งานที่เข้ากับร้านตัวเองเพิ่มขึ้นมา (ข้อ 15.2 ระบุ "NPC ที่เหมาะ")
       ⚠ ถ้าใส่เป็นตารางแทนที่ ร้านสะดวกซื้อจะไม่มีวันแจกโจทย์คณิตทั่วไปอีกเลย = โจทย์จำเจ */
    const BONUS_MECHS = [
      /* ร้านค้าทุกชนิด: จ่ายเงิน/ทอนเงิน */
      [/^npc-(mart|mk|cart|food|ice|mall|shop|pet|music|toy|garden)/, ['payexact','changeback']],
      /* ร้านสะดวกซื้อ + ห้าง: จัดชั้นวาง + จำรายการของ (เฟส 4B ที่เปิดให้ NPC ใช้ในเฟส 7) */
      [/^npc-(mart|mall)/,                 ['stockshelf','shopping']],
      /* ร้านสัตว์เลี้ยง + ฟาร์ม: จับคู่สัตว์↔อาหาร (feed-pet ของข้อ 15.2 = petfeed ของเฟส 4B) */
      [/^npc-(pet|farm|cowboy)/,           ['petfeed']],
      /* ตลาด/รถเข็น: จำรายการของ (ของในโจทย์เปลี่ยนตามธีมร้านให้เอง) */
      [/^npc-(mk|cart)/,                   ['shopping']],
      /* ร้านอาหาร/ไอศกรีม/ตลาด: ทำตามสูตร */
      [/^npc-(food|ice|mk|cart)/,          ['recipeseq']],
      /* ริมน้ำ/ชาวประมง: ตกปลาคิดเลข */
      [/^npc-(fisher|beach|camp)/,         ['fishmath']],
      /* ตำรวจ/เทศมนตรี: ป้ายจราจร + ของหายในเมือง (find-hidden — คนที่ชาวบ้านไปแจ้งของหาย) */
      [/^npc-(police|mayor|headman)/,      ['traffic','findhidden']],
      /* ---- เฟส 7 กลุ่ม D: เกมสังเกต/ความจำ แจกได้กว้างกว่าเพราะไม่ผูกกับอาชีพใครเป็นพิเศษ ---- */
      [/^npc-(mall|shop|mart|mk|cart|toy|garden|kid|stu)/, ['spotdiff','flashcount']],
      [/^npc-(mall-fash|shop|kid)/,        ['dressorder']],
    ];
    function bonusMechsFor(npcId){
      if(!npcId) return [];
      let out = [];
      for(let i = 0; i < BONUS_MECHS.length; i++)
        if(BONUS_MECHS[i][0].test(npcId)) out = out.concat(BONUS_MECHS[i][1]);
      return out;
    }
    const MECH_IDS = Object.keys(MECHS);
    /* กลไกที่ **เควสต์ครอบครัวเท่านั้น**สุ่มได้ — NPC/กระดานยังเป็น quiz/count เหมือนเดิม
       (มินิเกม 8 แบบของเฟส 4B + quiz/count ที่ใช้ตั้งแต่เฟส 4A) */
    const FAM_MECHS = ['quiz', 'count', 'tidy', 'laundry', 'cook', 'routine',
                       'petfeed', 'budget', 'shopping', 'clock', 'dinner', 'market',
                       'orderlearn', 'sortcat'];
    /* เควสต์ "เดินไปทำ" — ต้องเช็คก่อนว่าเล่นได้จริงในบ้านหลังนี้ ไม่งั้นเด็กรับงานแล้วทำไม่ได้ (ห้ามมี dead end) */
    function famMechOk(m){
      if(m === 'dinner') return !!hasIndoorSeat();      /* ไม่มีโต๊ะ/เก้าอี้ในบ้าน = ไปนั่งไม่ได้ */
      if(m === 'orderlearn') return mainOrderSets(gradeId()).length >= 2;   /* ชั้นนี้ไม่มีคลัง = ไม่แจก */
      if(m === 'sortcat') return !!efSortSet();
      return true;
    }

    /* ================= สร้างชุดโจทย์ 1 เควสต์ ================= */
    /* spec = {src:'npc'|'board', key, npc, mech, fam, chal} — เปิดกี่ครั้งก็ได้ชุดเดิม (seed คงที่) */
    function specForNpc(npcId){
      const s = state();
      if(s.npcIds.indexOf(npcId) < 0) return null;
      const rec = s.npc[npcId] || {};
      const rng = rngFrom(fnv(childId() + '|' + s.d + '|' + npcId));
      const mech = rec.m || rollWorkMech(rng, npcId);
      const done = rec.st === 'done';
      const um = mechOk(mech) ? mech : 'quiz';
      return { src:'npc', key:npcId, npc:npcId, mech: um,
               fam:'A', chal: done ? !!rec.chal : rollChal(npcId),
               done: done, stars: rec.stars | 0 };
    }
    /* เควสต์ครอบครัวของวันนี้ — `who` บอกว่าพ่อหรือแม่เป็นคนขอ (ตัวอีกคนไม่มีงาน) */
    function specForFamily(){
      const s = state();
      const f = s.fam || {};
      if(!f.who) return null;
      const done = f.st === 'done';
      const fm = (MECHS[f.m] && famMechOk(f.m)) ? f.m : 'quiz';
      return { src:'family', key:'fam', who:f.who, npc:'', mech: fm,
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
      const bm = mechOk(b.m) ? b.m : 'quiz';
      return { src:'board', key:'b' + i, idx:i, npc:b.npc, mech: bm,
               fam:'board', chal: done ? false : rollChal('b' + i), done: done };
    }
    /* ---------- กันโจทย์ซ้ำภายในเควสต์เดียว (ผู้ใช้แจ้ง 2026-08-10) ----------
       กลไกที่ "สุ่มสร้างโจทย์เอง" (count · มินิเกมทุกตัว) มีโอกาสออกโจทย์เหมือนเดิมซ้ำในรอบเดียว
       เพราะแต่ละข้อสุ่มอิสระกัน ⇒ ตรงนี้ตัดซ้ำแล้วสุ่มเพิ่มจนครบ
       ⚠ ถ้าคลังเล็กจนหาไม่ครบจริงๆ **ยอมให้เควสต์สั้นลง ดีกว่าให้เด็กเจอโจทย์เดิมซ้ำ**
         (เกณฑ์ดาวคิดจาก run.items.length อยู่แล้ว จึงยืดตามเองไม่มีใครเสียเปรียบ) */
    function itemSig(it){
      if(!it) return '';
      if(it.kind === 'sort'){
        return 's|' + (it.q || '') + '|' + (it.bins || []).map(b => b.id).join(',')
             + '|' + (it.tiles || []).map(t => t.e + '>' + t.bin).slice().sort().join(',')
             + '|' + (it.budget == null ? '' : it.budget)
             + '|' + (it.list || []).map(x => x.e).slice().sort().join(',');
      }
      return 'q|' + (it.q || '') + '|' + (it.show || '') + '|' + (it.emoji || '') + '|' + (it.img || '')
           + '|' + (it.pattern || []).join(',')
           + '|' + (it.clock ? it.clock.h + ':' + it.clock.m : '')
           + '|' + (it.choices || []).join('~');
    }
    function uniqueRun(mech, rng, diff, def, gid, first){
      const want = first.length;
      const out = [], seen = {};
      const take = batch => {
        for(let i = 0; i < batch.length && out.length < want; i++){
          const sg = itemSig(batch[i]);
          if(seen[sg]) continue;
          seen[sg] = 1;
          out.push(batch[i]);
        }
      };
      take(first);
      let tries = 0;
      while(out.length < want && tries++ < 10){
        const more = mech.gen(rng, diff, def, gid);
        if(!more || !more.length) break;
        take(more);
      }
      return out.length ? out : first;
    }

    /* สร้าง "รอบเล่น" จริง — โจทย์ผูกกับ seed ของเควสต์ ⇒ ปิดแล้วเปิดใหม่ได้โจทย์เดิม ไม่ใช่สุ่มใหม่ */
    function buildRun(spec){
      const s = state();
      const own = gradeId();
      /* โจทย์ท้าทาย = ระดับชั้นถัดไป (ข้อ 24) — เลือกเฉพาะตอนประตูเปิดแล้วและสุ่มติด */
      const chal = spec.chal && gradeIndex(own) < GR.length - 1;
      const gid  = chal ? gradeAt(gradeIndex(own) + 1) : own;
      const rng  = rngFrom(fnv(childId() + '|' + s.d + '|' + spec.key + '|run'));
      /* **จำนวนข้อสุ่ม 5-10 ต่อเควสต์** (ผู้ใช้สั่ง 2026-08-10) — seed เดิม ⇒ เปิดใหม่ได้ชุดเดิมเสมอ
         ⚠ จำนวนข้อ **ไม่มีผลกับเงิน** ค่าตอบแทนคิดต่อเควสต์เหมือนเดิมทุกประการ (ดู coinsFor) */
      const diff = Object.assign({}, difficulty(gid), {qN: 5 + ((rng() * 6) | 0)});
      const def  = defById[spec.npc] || {id:spec.npc || '', job:'villager'};
      let items  = MECHS[spec.mech].gen(rng, diff, def, gid);
      if(!items || !items.length) items = MECHS.count.gen(rng, diff, def, gid);
      items = uniqueRun(MECHS[spec.mech], rng, diff, def, gid, items);   /* ห้ามมีโจทย์ซ้ำในรอบเดียว */
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
      const seed = (opt.seed == null) ? ((Math.random() * 1e9) | 0) : opt.seed;
      const rng  = rngFrom(fnv(['t', gid, mech, opt.catId || '', opt.qIdx == null ? '' : opt.qIdx,
                                opt.theme || '', seed].join('|')));
      const diff = Object.assign({}, difficulty(gid), {qN: 5 + ((rng() * 6) | 0)});
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
      items = uniqueRun(MECHS[mech], rng, diff, def, gid, items);
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
      DAY_CAP, NPC_PER_DAY, BOARD_N, BOARD_BONUS, FAM_BASE, STAR_MUL, MIN_Q,
      CHAL_NEED, CHAL_ACC, CHAL_KEEP, CHAL_MISS, CHAL_RATE, CHAL_MUL,
      MECHS, MECH_IDS, ITEM_SETS,
      sync, reset, state, difficulty, quizCats, themeOf, catSubject, questableIds,
      specForNpc, specForBoard, specForFamily, familyWho, familyDone, daySummary,
      STAR_BONUS, starBonus, starBonusReady, claimStarBonus,
      buildRun, answer, submit, starsOf, coinsFor, finish, itemSig,
      FAM_MECHS, ENGINE_MECHS, SORT_SETS, ORDER_POOLS, PET_FACE, MARKET_GOODS, catalogSort, famMechOk,
      /* เฟส 6 — แล็บ STEM/coding (คลัง + ตารางแบ่งงานตาม NPC · เทสใช้ไล่นับว่าคลัง ≥ 40 จริง) */
      STEM_SETS, GROW_SETS, MEASURE_ITEMS, MEASURE_UNITS, CODE_TASKS, LAB_MECHS, SOUND_MOTIFS,
      /* เฟส 7 — กลุ่ม B (คลัง + ตารางกลไกพิเศษตาม NPC) */
      PRICED_GOODS, SHELF_CATS, RECIPE_SETS, TRAFFIC_CARDS, DELIVER_ITEMS, COIN_UNITS,
      BONUS_MECHS, bonusMechsFor,
      /* เฟส 7 — กลุ่ม D */
      SPOT_SCENES, DRESS_ITEMS, HIDDEN_ITEMS, HIDDEN_ZONES,
      SOUND_SONGS: (typeof MUSIC_LEVEL2_SONGS !== 'undefined') ? MUSIC_LEVEL2_SONGS : [],
      labMechsFor, isLabNpc, engineReady, rollWorkMech, mechOk,
      /* หน้าคลังคำถาม (js/house-qbrowse.js) — อ่านอย่างเดียว ไม่แตะ state */
      catalogQuiz, catalogCats, catalogCount, countKinds, testRun, GRADES:GR,
      ownGrade: () => gradeId(),      /* ระดับชั้นของเด็กคนที่เล่นอยู่ (หน้าคลังคำถามเปิดมาที่ชั้นนี้ก่อน) */
      boardBonusReady, boardClaim, boardLeft,
      chalReady, chalAsked, chalAccept, chalAccuracy, rollChal,
      npcStatus, openNpcCount,
    };
  };
})();
