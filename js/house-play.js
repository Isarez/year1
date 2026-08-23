/* ============================================================
   js/house-play.js — เฟส 11: มินิเกม "กลุ่ม A" ที่เล่นในโลก 3D จริง (ไม่เปิดการ์ดถาม-ตอบ)
   แผน: QUEST-DESIGN.md ข้อ 44 (กลุ่ม A) · รายละเอียดรายเกมเดิมอยู่ IDEA.md (ลบออกแล้วเมื่อทำจริง)

   5 เกม: 🙈 ซ่อนแอบ · 🍃 เก็บของประจำวัน · 🎣 ตกปลา · 📷 ช่างภาพ · 🌱 แปลงผัก

   🔒 กติกาที่ทุกเกมในไฟล์นี้ต้องผ่าน (ห้ามละเมิด):
     1. **ห้ามมีตัวจับเวลากดดัน · ห้ามมีคำว่า "แพ้" · ห้ามหักเงิน/หักดาว** (กติกาเหล็กข้อ 2)
     2. **ห้ามมี dead end** — เกมที่ผูกกับของที่ต้องซื้อ (ตู้ปลา/แปลงผัก) ต้องเล่นได้ตั้งแต่ยังไม่มีของ
     3. **เงินจ่ายผ่าน `HouseWorld.award()` จุดเดียว** (= `awardCoins()` ใน house.js · ข้อ 5)
     4. **โควตารายวันแยกจากเควสต์ 14 ชุดเดิมเด็ดขาด** — ไม่งั้นเกมเบาสมองจะไปกินโควตาหาเงิน
     5. **ของสะสม/ปลา/ผัก จ่ายเป็นของ ไม่ใช่เหรียญ** (ข้อ 44.4) กันเงินเฟ้อ — มีแค่ซ่อนแอบกับ
        ขายผักที่จ่ายเหรียญ และทั้งคู่คิดจากสูตรเดียวกับเควสต์ NPC จึงไม่ทำเศรษฐกิจเพี้ยน
     6. **ห้ามเดาพิกัดบนแผนที่** — จุดวางของทุกจุดสุ่มจากกริดเดินได้จริง (`HouseWorld.grid()`)
        และห้ามอยู่ในบริเวณบ้านเด็ก (`inHomeZone`) สำหรับของที่ผูกกับชาวบ้าน

   🚪 ไฟล์นี้แตะภายใน house.js ไม่ได้ (IIFE) — คุยผ่าน `window.HouseWorld` ประตูเดียว
   ============================================================ */
(function(){
  'use strict';

  const $ = id => document.getElementById(id);
  const W = () => window.HouseWorld;
  /* 🎨 ไอคอน SVG (js/house-icons.js) — ไม่มีไฟล์/ไม่มีไอคอนตัวนั้น = ถอยไปใช้ emoji เดิม ห้ามพัง */
  const ICO = (id, emoji, size)=> (window.HouseIcons ? window.HouseIcons.htmlOr(id, emoji, size) : String(emoji || ''));
  const Q = () => window.HouseQuests;

  /* ---------- ตัวสุ่มแบบ seeded (ต้นแบบเดียวกับ house-quests.js — เด็ก+วัน+คีย์เดิม ได้ผลเดิมเสมอ) ---------- */
  function fnv(s){
    let h = 2166136261; s = String(s);
    for(let i=0; i<s.length; i++){ h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function rngFrom(seed){
    let h = (seed >>> 0) || 1;
    return function(){ h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; };
  }
  function dayKey(){ const d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
  function childKey(){
    try{ return localStorage.getItem('p1quiz_active_child') || ''; }catch(e){ return ''; }
  }

  /* ============================================================
     state — เก็บใน house save คีย์ `play` ก้อนเดียว
     ⚠ **migration + export/import ต้องคิดตั้งแต่แรก** (กติกาเหล็กข้อ 3):
       - ไม่มีคีย์ `play` = เด็กก่อนเฟส 11 ⇒ สร้างค่าเริ่มต้นให้ ไม่มีอะไรพัง
       - `play` ทั้งก้อนอยู่ใน house save เดียวกับของอื่น ⇒ ระบบย้ายข้อมูลข้ามเครื่องพาไปด้วยเอง
       - `v` ไว้เผื่อเปลี่ยนโครงในอนาคต (ตอนนี้ 1)
     ============================================================ */
  const PLAY_V = 1;
  function blank(){
    return {
      v: PLAY_V, day: '',
      seek:   {on:false, spots:[], found:[], done:false},
      col:    {items:[], got:[], sets:0, prizes:[]},     /* sets = เก็บครบมากี่วัน · prizes = ของที่ปลดแล้ว */
      fish:   {book:[], bag:{}, today:0, spot:null},     /* book = เคยได้อะไรบ้าง (ถาวร) · bag = ตัวที่ยังไม่ได้ขาย */
      photo:  {order:'', done:false, shots:[]},          /* shots = รูปที่เก็บไว้ (จำกัดจำนวน+ย่อเล็ก) */
      garden: {plots:[], seeds:{}, crop:{}},             /* plots = ช่องปลูกตามลำดับแปลง (มี wd = วันที่รดล่าสุด) */
    };
  }
  let P = null;                     /* state ที่ sync แล้วของวันนี้ */

  function persist(){
    if(!P || !W()) return;
    W().save({play: P});
  }
  /* อ่าน + เลื่อนวันให้ตรงกับ "วันที่เข้าเล่น" (กลไกเดียวกับความหิวสัตว์ใน house-pet-care.js)
     ⇒ หายไป 3 เดือนกลับมา ต้นผักก็โตแค่วันเดียว ไม่ใช่ 90 วัน */
  function sync(){
    const w = W(); if(!w) return null;
    const d = w.load() || {};
    let p = d.play;
    let dirty = false;
    if(!p || typeof p !== 'object' || (p.v | 0) !== PLAY_V){ p = blank(); dirty = true; }
    /* เติมกิ่งที่ขาด (เผื่อ save เก่าที่มี play แต่ยังไม่มีเกมใหม่บางตัว) */
    const base = blank();
    Object.keys(base).forEach(k=>{
      if(k === 'v' || k === 'day') return;
      if(!p[k] || typeof p[k] !== 'object'){ p[k] = base[k]; dirty = true; }
    });
    /* ย้ายจาก "รดรายวันทั้งสวน" มาเป็น "รดรายแปลง" — เซฟเก่าที่รดไปแล้ววันนี้ให้ถือว่ารดทุกแปลง
       (ไม่งั้นเด็กที่เพิ่งรดจะรดซ้ำได้ทันทีในวันเดียวกัน = โตเร็วเกิน) */
    if(p.garden && p.garden.watered && Array.isArray(p.garden.plots)){
      p.garden.plots.forEach(pl=>{ if(pl && pl.wd == null) pl.wd = p.garden.watered; });
      delete p.garden.watered;
      dirty = true;
    }
    const today = dayKey();
    if(p.day !== today){
      p.day = today;
      rollDay(p);
      dirty = true;
    }
    P = p;
    if(dirty) persist();
    return p;
  }
  /* ของที่ "รีเซ็ตรายวัน" — ⚠ ของสะสมถาวร (สมุดปลา · ของรางวัล · แปลงผัก) ห้ามแตะเด็ดขาด */
  function rollDay(p){
    p.seek  = {on:false, spots:[], found:[], done:false};
    p.col   = Object.assign({}, p.col, {items:[], got:[]});
    p.fish  = Object.assign({}, p.fish, {today:0});
    p.photo = Object.assign({}, p.photo, {order:'', done:false});
    /* ⚠ ขึ้นวันใหม่ **ห้ามล้าง `wd` ทิ้ง** — เทียบกับ dayKey() ตอนใช้งานอยู่แล้ว
       (ถ้าล้างจะกลายเป็นว่าเด็กที่ไม่ได้เข้าเล่นหลายวันรดรวดเดียวแล้วโตพรวด) */
  }
  function seedRng(tag){ return rngFrom(fnv(childKey() + '|' + dayKey() + '|play|' + tag)); }

  /* ---------- ค่าตอบแทน — คิดจากสูตรเดียวกับเควสต์ NPC เพื่อไม่ให้เศรษฐกิจเพี้ยน ----------
     ⚠ **ห้ามตั้งเลขเหรียญลอยๆ ในไฟล์นี้** ต้องผ่าน `coinsFor()` ของ engine เควสต์เสมอ
       (ตัวคูณระดับชั้นของเฟส 10 จะได้ตามมาเอง และเพดาน DAY_CAP ยังคุมอยู่) */
  function payFor(stars){
    const q = Q();
    if(!q) return 6;
    return q.coinsFor('A', stars || 3, q.difficulty().tier, false);
  }

  /* ============================================================
     ตัวช่วยเลือกช่องบนแผนที่ — ⚠ สุ่มจากกริดเดินได้จริงเสมอ ห้ามเดาพิกัด (ข้อ 44.4)
     ============================================================ */
  function walkableTiles(rng, n, opt){
    const w = W(); if(!w) return [];
    opt = opt || {};
    const OW = w.OUT_W(), OD = w.OUT_D();
    const out = [], seen = {};
    let guard = 0;
    while(out.length < n && guard++ < n * 400){
      const x = (rng() * OW) | 0, z = (rng() * OD) | 0;
      const k = x + ',' + z;
      if(seen[k]) continue;
      if(!w.walkable(x, z)) continue;
      /* 🌉 **ห้ามวางของบนสะพาน** (ผู้ใช้แจ้ง 2026-08-16) — ของถูกวางที่ y=0 แต่ผิวสะพานอยู่สูงกว่า
         ⇒ ของจมอยู่ใต้แผ่นสะพาน เด็กมองไม่เห็นและเดินทับไปเฉยๆ = หาไม่เจอทั้งวัน
         (ช่องสะพานคือค่า 2 ในกริดผังเมือง — ตัวเดียวกับที่ questZonesAt ใช้) */
      if(w.isBridge && w.isBridge(x, z)) continue;
      /* 🏠 **ห้ามวางของในเขตตึก/ร้าน** (ผู้ใช้แจ้ง 2026-08-16: กลีบดอกไม้โดนร่มร้านอาหารบัง)
         ล็อตร้านมีหลังคา ร่ม ป้าย ฯลฯ บังของที่วางที่พื้นจนมองไม่เห็น
         ⇒ โปรยเฉพาะที่โล่ง — เผื่อขอบล็อต 1 ช่องด้วย กันของไปแอบใต้ชายคา */
      if(w.lotAt && w.lotAt(x, z, 1)) continue;
      if(opt.noHome && w.inHomeZone(x, z)) continue;
      if(opt.homeOnly && !w.inHomeZone(x, z)) continue;
      /* กระจายให้ห่างกันพอ เด็กจะได้ไม่เจอกองเดียวจบ (เช็คด้วยระยะเส้นตรง — พอสำหรับ "กระจาย"
         ส่วนระยะที่เอาไปคิดเวลาต้องใช้ pathLen เท่านั้น) */
      if(opt.apart && out.some(t => Math.abs(t.x - x) + Math.abs(t.z - z) < opt.apart)) continue;
      /* ช่องที่มีของอยู่แล้วจากรอบก่อนๆ (เช่นต้นผักที่ปลูกไว้) — ห้ามทับ */
      if(opt.avoid && opt.avoid.some(t => t.x === x && t.z === z)) continue;
      /* ⚠ ของที่ "เด็กต้องมองหาให้เจอ" ต้องไม่โดนตึกบังจากมุมกล้อง (ผู้ใช้แจ้ง 2026-08-13)
         ใช้กับทั้งคนซ่อนและของสะสม — ของสะสมชิ้นเล็กยิ่งโดนบังง่ายกว่าตัวคนอีก */
      if(opt.seen && !w.visibleSpot(x, z)) continue;
      seen[k] = 1;
      out.push({x, z});
    }
    return out;
  }
  /* ระยะเดินจริงจากตัวเด็ก — **ต้องใช้ findPath ผ่าน HouseWorld.pathLen เท่านั้น**
     (แม่น้ำ/สะพานทำให้เส้นตรงหลอกได้ถึง 4 เท่า — เหตุผลเต็มอยู่ในข้อ 45.5) */
  function walkDist(t){
    const w = W(); if(!w) return 0;
    const d = w.pathLen(w.tile(), t);
    return d < 0 ? 0 : d;
  }

  /* ============================================================
     🙈 A1 — ซ่อนแอบกับเพื่อนบ้าน
     เพื่อน 3-5 คนไปแอบตามจุดในเมือง เด็กเดินไปแตะทีละคน · ใบ้ด้วย "ร้อน/เย็น" บน HUD
     ไม่มีเวลาจำกัด ไม่มีตอบผิด · หาครบ = ได้เหรียญเท่าเควสต์ NPC 3 ดาว
     ⚠ **จำนวนคนคิดจากสูตรทรงเดินของเฟส 10** (`walkQCount`) โดยวัดระยะด้วย `findPath()` จริง
       — นี่คือเกมที่พิสูจน์ว่าสูตรนั้นให้เวลาเล่นอยู่ในงบ 150-240 วิ จริง
     ============================================================ */
  const SEEK_MIN = 3, SEEK_MAX = 5;
  let seekObjs = [];

  function seekStart(){
    const w = W(); if(!w || !P) return false;
    /* ⚠ ต้องกัน "เริ่มซ้ำ" ตอนที่ยังเล่นค้างอยู่ด้วย ไม่ใช่เช็คแค่ `done` — ไม่งั้นกดปุ่มซ้ำ
       จะสุ่มจุดแอบใหม่ทั้งชุด แล้วคนที่เด็กอุตส่าห์เดินไปเจอมาแล้วจะหายไปเฉยๆ */
    if(P.seek.done || P.seek.on) return false;
    const rng = seedRng('seek');
    /* หาจุดแอบที่เดินถึงได้จริงและอยู่นอกบริเวณบ้าน (ชาวบ้านเข้าเขตบ้านเด็กไม่ได้) */
    const cand = walkableTiles(rng, 40, {noHome:true, apart:6, seen:true});
    /* ⚠ **ต้องกรองจุดที่กล้องมองไม่เห็นทิ้ง** — ผู้ใช้แจ้ง 2026-08-13 ว่าเพื่อนไปแอบหลังตึก
       แล้วเด็กหาไม่เจอเลยจริงๆ (กล้อง iso มองจากทิศ +x,+z ตึกในแนวทแยงจึงบังมิด)
       เกมซ่อนแอบต้อง "หายาก" ไม่ใช่ "มองไม่เห็น" */
    const reach = cand.filter(t => walkDist(t) > 0).slice(0, SEEK_MAX * 3);
    if(reach.length < SEEK_MIN) return false;
    /* จำนวนคน = สูตรทรงเดิน clamp ลงมาที่ 3-5 (เกมนี้ 1 "ข้อ" = เดินไปหา 1 คน) */
    const avg = Math.round(reach.slice(0, SEEK_MAX).reduce((a, t) => a + walkDist(t), 0)
                / Math.min(SEEK_MAX, reach.length));
    const n = Math.max(SEEK_MIN, Math.min(SEEK_MAX, (Q() ? Q().walkQCount(avg, 0) : 4)));
    P.seek = {on:true, spots: reach.slice(0, n).map(t => ({x:t.x, z:t.z})), found:[], done:false};
    persist();
    seekBuild();
    seekIntroStart();          /* 🙈 อินโทร: เพื่อนมารวมตัว → นับถอยหลัง → วิ่งกระจายไปแอบ */
    return true;
  }
  /* ================= 🙈 อินโทรเกมซ่อนแอบ (2026-08-16 · ผู้ใช้สั่ง) =================
     ① เพื่อนทุกคนเดินมารวมกันที่ตัวเด็ก  ② เด็กนั่งยองปิดตา + นับถอยหลัง 5→0
     ③ ระหว่างนับ เพื่อนวิ่งกระจายออกไปยังจุดแอบของตัวเอง  ④ นับจบ = เริ่มหาได้

     ⚠ ระหว่างอินโทร **ห้ามนับว่าเจอ** — ไม่งั้นเพื่อนวิ่งผ่านตัวเด็กแล้วถูกนับว่าเจอทันที
     ⚠ ตำแหน่งคำนวณจาก "จุดแอบจริง" ทุกเฟรม ⇒ ปิดเกมกลางอินโทรแล้วไม่มีอะไรค้าง */
  const SEEK_GATHER = 2.0;      /* วิ่งมารวมตัว (วินาที) — ไม่ต้องรีบ */
  const SEEK_CHAT   = 1.5;      /* ยืนคุยกันก่อนแยกย้าย (ผู้ใช้ปรับ 2 → 1 → 1.5 วิ) */
  const SEEK_COUNT  = 5;        /* นับถอยหลังกี่วินาที */
  const SEEK_SCATTER= 3.8;      /* วิ่งไปแอบ — ช้าลงกว่าเดิม (ผู้ใช้สั่ง) เสร็จตอนเหลือ ~1.2 วิ */
  let seekIntro = null;
  function seekIntroStart(){
    const w = W(); if(!w) return;
    const t = w.tile();
    /* 🔵 **ล้อมวงรอบตัวเด็ก — คนละช่อง ไม่ทับกันและไม่ทับตัวเด็ก** (ผู้ใช้แจ้ง 2026-08-16)
       เดิมทุกคนเดินไปที่ "ช่องของเด็ก" ช่องเดียวกันหมด ⇒ ซ้อนกันเป็นก้อนและถูกตัวเด็กบังมิด
       ⇒ หาช่องรอบตัวเด็กที่ **เดินได้จริง** แล้วแจกให้คนละช่อง (ขยายวงออกถ้าช่องไม่พอ) */
    const ring = [];
    const seenRing = {};
    for(let r = 1; r <= 4 && ring.length < P.seek.spots.length; r++){
      for(let dz = -r; dz <= r; dz++) for(let dx = -r; dx <= r; dx++){
        if(Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;   /* เฉพาะขอบวงรัศมี r */
        const x = t.x + dx, z = t.z + dz, k = x + ',' + z;
        if(seenRing[k]) continue;
        seenRing[k] = 1;
        if(!w.walkable(x, z)) continue;                            /* ติดตึก/รั้ว/น้ำ = ข้ามไป */
        if(x === t.x && z === t.z) continue;                       /* ห้ามยืนทับตัวเด็ก */
        ring.push({x:x, z:z});
      }
    }
    /* แจกช่องแบบ "ใครใกล้ช่องไหนได้ช่องนั้น" — เส้นทางจะได้ไม่ตัดกันมั่ว */
    const taken = [];
    const legs = (P.seek.spots || []).map(sp=>{
      let best = -1, bd = 1e9;
      ring.forEach((c, ci)=>{
        if(taken.indexOf(ci) >= 0) return;
        const d = Math.abs(c.x - sp.x) + Math.abs(c.z - sp.z);
        if(d < bd){ bd = d; best = ci; }
      });
      /* ช่องรอบตัวเด็กไม่พอจริงๆ (ยืนอยู่ซอกแคบ) → ถอยไปใช้ช่องของเด็ก ดีกว่าไม่มีเส้นทาง */
      const dst = best >= 0 ? (taken.push(best), ring[best]) : {x:t.x, z:t.z};
      const path = w.path({x:sp.x, z:sp.z}, dst) || [];
      return path.length ? path : [{x:sp.x, z:sp.z}, dst];
    });
    /* ⚠ **จับเวลาด้วยนาฬิกาจริง ไม่ใช่สะสม dt** — ลูปวาดหนีบ dt ไว้ที่ 50 ms/เฟรม
       เครื่องช้าที่วาดได้ 3 fps จะเดินเวลาช้ากว่าจริง ~6 เท่า ⇒ "นับ 5 วิ" กลายเป็นครึ่งนาที
       (เจอจากเทสจริง 2026-08-16) · เลขนับถอยหลังต้องเป็นวินาทีจริงเสมอ */
    seekIntro = {t0: Date.now(), from:{x:t.x, z:t.z}, shown:-1, legs:legs, crouched:false};
    /* 💬 ช่วงรวมตัว+คุยกัน เด็ก **ยืนคุย** ยังไม่นั่งยอง (ผู้ใช้สั่ง 2026-08-16)
       ค่อยเปลี่ยนเป็นท่านั่งยองปิดตาตอนเริ่มนับ */
    if(w.pose) w.pose('talk', (SEEK_GATHER + SEEK_CHAT) * 1000);
  }
  function seekIntroActive(){ return !!seekIntro; }
  /* ตำแหน่งบนเส้นทางที่สัดส่วน k (0 = ต้นทาง · 1 = ปลายทาง) — เดินตามช่องจริงทีละช่อง */
  function pathPoint(w, path, k){
    if(!path || !path.length) return null;
    if(path.length === 1) return {x:w.wx(path[0].x), z:w.wz(path[0].z)};
    const f = Math.max(0, Math.min(1, k)) * (path.length - 1);
    const i = Math.min(path.length - 2, Math.floor(f));
    const r = f - i;
    const a = path[i], b = path[i + 1];
    return {x: w.wx(a.x) + (w.wx(b.x) - w.wx(a.x)) * r,
            z: w.wz(a.z) + (w.wz(b.z) - w.wz(a.z)) * r};
  }
  function seekIntroTick(){
    const w = W(); if(!w || !seekIntro) return;
    const T = (Date.now() - seekIntro.t0) / 1000;
    const tGather = SEEK_GATHER, tChat = SEEK_GATHER + SEEK_CHAT;
    const total = tChat + SEEK_COUNT;
    const ease = v => v * v * (3 - 2 * v);
    seekObjs.forEach((g, i)=>{
      const idx = (g.userData.hPick ? g.userData.hPick.i : i);
      const path = seekIntro.legs[idx];
      if(!path) return;
      let pt, run = 0;
      if(T < tGather){                            /* ① วิ่งเข้ามาหาเด็กตามทางจริง */
        pt = pathPoint(w, path, ease(T / tGather));
        run = Math.abs(Math.sin(T * 8 + i)) * .09;
      }else if(T < tChat){                        /* ② ยืนคุยกัน — เด้งเบาๆ เหมือนกำลังพูด */
        pt = pathPoint(w, path, 1);
        run = Math.abs(Math.sin((T - tGather) * 5.5 + i * 1.7)) * .045;
      }else{                                      /* ③ วิ่งกระจายกลับไปแอบ (ย้อนเส้นทางเดิม) */
        const k = ease(Math.min(1, (T - tChat) / SEEK_SCATTER));
        pt = pathPoint(w, path, 1 - k);
        run = k < 1 ? Math.abs(Math.sin(T * 8 + i)) * .09 : 0;
      }
      if(!pt) return;
      /* หันหน้าไปทางที่กำลังไป (เทียบกับตำแหน่งเฟรมก่อน) */
      const dx = pt.x - g.position.x, dz = pt.z - g.position.z;
      if(Math.abs(dx) + Math.abs(dz) > .002) g.rotation.y = Math.atan2(dx, dz);
      else if(T >= tGather && T < tChat)
        g.rotation.y = Math.atan2(w.wx(seekIntro.from.x) - pt.x, w.wz(seekIntro.from.z) - pt.z);
      g.position.x = pt.x; g.position.z = pt.z;
      g.position.y = (g.userData.baseY || 0) + run;
      /* หายไปตอนถึงที่แอบแล้ว (เหลือ 2 วิสุดท้ายของการนับ) */
      g.visible = !(T >= tChat + SEEK_SCATTER);
      /* ชุดเทส: จดช่องที่ยืนอยู่จริง เพื่อตรวจว่าล้อมวงไม่ทับกัน */
      (window.__seekObjPos = window.__seekObjPos || [])[idx] =
        {x: Math.round(pt.x + (w.OUT_W() - 1) / 2), z: Math.round(pt.z + (w.OUT_D() - 1) / 2)};
    });
    /* ---- เลขนับถอยหลัง (เริ่มตอนแยกย้าย) ---- */
    if(T >= tChat){
      /* 🙈 เริ่มนับ = เริ่มนั่งยองปิดตา (ท่าค่อยๆ ย่อลงภายใน ~1 วิ ดู charPoseAt) */
      if(!seekIntro.crouched){
        seekIntro.crouched = true;
        /* ⚠ ความยาว 5.9 วิ = นับ 5 + **ลุกขึ้นยืน .9** — ตัวเลขจังหวะอยู่ใน charPoseAt('hide')
           แก้ที่นี่ต้องแก้ที่นั่นด้วย ไม่งั้นเด็กลุกผิดจังหวะโดยไม่มีอะไรฟ้อง */
        if(w.pose) w.pose('hide', 5.9 * 1000);
      }
      const left = Math.max(0, Math.ceil(SEEK_COUNT - (T - tChat)));
      if(left !== seekIntro.shown){
        seekIntro.shown = left;
        if(w.bigCount) w.bigCount(left);
        if(left > 0 && typeof playClick === 'function') playClick();
      }
    }
    if(T >= total + .35){
      seekIntro = null;
      if(w.bigCount) w.bigCount(null);
      seekBuild();                               /* วางกลับที่จุดแอบให้ตรงเป๊ะ */
      w.toast(ICO('ui-seek', '🙈'), 'เพื่อนแอบเรียบร้อยแล้ว ไปตามหากันเลย!');
    }
  }
  function seekIntroSkip(){
    const w = W();
    if(!seekIntro) return;
    seekIntro = null;
    if(w && w.bigCount) w.bigCount(null);
    seekBuild();
  }
  function seekIntroStop(){
    const w = W();
    seekIntro = null;
    if(w && w.bigCount) w.bigCount(null);
  }
  function seekClear(){
    const w = W();
    seekIntroStop();
    seekObjs.forEach(o => { if(w) w.despawn(o); });
    seekObjs = [];
  }
  function seekBuild(){
    const w = W(); if(!w || !P || !P.seek.on) return;
    seekClear();
    P.seek.spots.forEach((s, i)=>{
      if(P.seek.found.indexOf(i) >= 0) return;
      const g = seekKid(i);
      /* ⚠ สะพานไม้ผิวบนอยู่ที่ y=.12 — วางที่ 0 แล้วตัวเด็กจะจมใต้แผ่นไม้ (ผู้ใช้แจ้ง 2026-08-13) */
      g.position.set(w.wx(s.x), w.groundY(s.x, s.z), w.wz(s.z));
      g.userData.hPick = {game:'seek', i:i, x:s.x, z:s.z};
      g.userData.baseY = w.groundY(s.x, s.z);
      /* ⚠ tag ต้องอยู่ที่ **ทุกลูก** ด้วย เพราะ raycast ชนที่ mesh แล้วไต่ขึ้นหา ancestor —
         ตัวลูกที่ไม่มี tag ก็ไต่เจอที่ group อยู่ดี แต่ตั้งไว้ที่ group พอ (house.js ไต่ให้) */
      w.spawn(g);
      seekObjs.push(g);
    });
  }
  /* เพื่อนบ้านตัวจิ๋วที่กำลังแอบ — โผล่แค่หัวกับมือ (ยังไม่ต้องวาดตัวเต็ม เด็กเห็นแล้วรู้ทันทีว่าคือคน) */
  function seekKid(i){
    const k = W().kit();
    const g = new THREE.Group();
    const skin = [0xf7d3ae, 0xe8bb90, 0xd6a678][i % 3];
    const hair = [0x4a3327, 0x6b4a2f, 0x2f2320][i % 3];
    const body = k.cyl(.22, .26, .5, [0x7ec4f5, 0xf7a8c8, 0x9ee29a, 0xffd166, 0xc4a8f5][i % 5]);
    body.position.y = .25; g.add(body);
    const head = k.sphere(.24, skin, 14); head.position.y = .68; g.add(head);
    const cap = k.sphere(.25, hair, 14);
    cap.scale.set(1, .62, 1); cap.position.y = .78; g.add(cap);
    /* มือโบกเล็กๆ ให้เด็กเห็นว่า "มีคนอยู่ตรงนี้" ตอนเข้าใกล้ */
    const arm = k.cyl(.06, .06, .3, skin, 8);
    arm.position.set(.24, .46, 0); arm.rotation.z = -.7; g.add(arm);
    k.merge(g);                       /* รวม draw call — เหตุผลเดียวกับของสะสมข้างบน */
    g.userData.seekPh = i * 1.7;
    return g;
  }
  function seekFind(i){
    if(!P || !P.seek.on || P.seek.found.indexOf(i) >= 0) return;
    if(seekIntroActive()) return;      /* ยังนับถอยหลังอยู่ — เพื่อนวิ่งผ่านตัวเด็กต้องไม่ถูกนับว่าเจอ */
    P.seek.found.push(i);
    const left = P.seek.spots.length - P.seek.found.length;
    const w = W();
    if(typeof playCorrect === 'function') playCorrect();
    if(left > 0){
      w.toast(ICO('ui-seek', '🙈'), 'เจอแล้ว 1 คน! เหลืออีก ' + left + ' คนนะ');
      seekBuild();
      renderPanel();
      return;
    }
    /* ครบแล้ว — จ่ายเหรียญเท่าเควสต์ NPC 3 ดาว (ผ่านสูตรกลาง ไม่ตั้งเลขเอง) */
    P.seek.on = false; P.seek.done = true;
    persist();
    seekClear();
    const coins = payFor(3);
    w.award(coins);
    if(typeof playCongrats === 'function') playCongrats();
    w.toast('🎉', 'เจอเพื่อนครบทุกคนแล้ว! ได้ ' + coins + ' บาท');
    renderPanel();
    w.refreshHud();
  }
  /* ยกเลิกการเล่น **แต่เก็บ progress ไว้** (ผู้ใช้สั่ง 2026-08-13) — เด็กเบื่อกลางคันแล้วกลับมา
     เล่นต่อได้ ไม่ต้องเริ่มหาใหม่ทั้งหมด · จุดแอบกับคนที่เจอแล้วยังอยู่ครบ */
  function seekPause(){
    if(!P || !P.seek.on) return false;
    P.seek.on = false;
    persist();
    seekClear();
    renderPanel();
    W().toast(ICO('ui-seek', '🙈'), 'พักก่อนได้เลย เพื่อนยังแอบรออยู่ที่เดิมนะ');
    return true;
  }
  function seekResume(){
    if(!P || P.seek.done || P.seek.on) return false;
    if(!(P.seek.spots || []).length) return false;
    P.seek.on = true;
    persist();
    seekBuild();
    renderPanel();
    return true;
  }
  /* เล่นค้างอยู่ไหม (หยุดพักไว้แต่ยังไม่จบ) */
  function seekPaused(){ return !!(P && !P.seek.done && !P.seek.on && (P.seek.spots || []).length); }

  /* คำใบ้ระยะทาง — ระยะเดินจริงถึงคนที่ใกล้ที่สุดที่ยังไม่เจอ */
  function seekHint(){
    if(!P || !P.seek.on) return null;
    let best = -1;
    P.seek.spots.forEach((s, i)=>{
      if(P.seek.found.indexOf(i) >= 0) return;
      const d = walkDist(s);
      if(d > 0 && (best < 0 || d < best)) best = d;
    });
    if(best < 0) return null;
    const lv = best <= 4 ? 3 : (best <= 10 ? 2 : (best <= 20 ? 1 : 0));
    /* ⚠ **ห้ามใช้คำว่า "ร้อน/เย็น"** — ผู้ใช้สั่งเปลี่ยน 2026-08-13 เพราะเด็ก 5 ขวบตีความตรงตัว
       ว่าเป็นอุณหภูมิ แล้วงงว่าเกี่ยวอะไรกับการหาเพื่อน ⇒ ใช้คำบอกระยะทางตรงๆ แทน */
    return {dist: best, level: lv,
            text: ['อยู่ไกลมาก', 'อยู่ไกล', 'ใกล้แล้ว', 'ใกล้มาก! มองรอบๆ ดูสิ'][lv]};
  }

  /* ============================================================
     🍃 A2 — ของหล่นตามฤดู (เก็บของประจำวัน)
     ของชิ้นเล็ก 8 ชิ้นกระจายทั่วเมืองตาม seed รายวัน · เดินไปแตะเก็บ · **ไม่มีโจทย์เลยสักข้อ**
     ⚠ **ไม่จ่ายเหรียญ** (ข้อ 44.4) — เก็บครบชุด = ได้ "แต้มสะสม" แล้วปลดของแต่งบ้านพิเศษ
       ที่ซื้อด้วยเงินไม่ได้ ⇒ เป็น reward loop ใหม่ที่ไม่ทำเงินเฟ้อ
     ============================================================ */
  const COL_N = 8;
  /* ธีมหมุนตามช่วงเวลา/ฤดู — **ต้องมีของให้เก็บทุกวันเสมอ** ไม่มีวันไหนว่างเปล่า */
  const COL_THEMES = [
    {id:'leaf',  name:'ใบไม้',    emoji:'🍃', col:0xe08a3c, alt:0xd4b13a},
    {id:'shell', name:'เปลือกหอย', emoji:'🐚', col:0xffe2c6, alt:0xf7c9d8},
    {id:'star',  name:'ดาวตก',    emoji:'⭐', col:0xffd75e, alt:0xfff0a8},
    {id:'flower',name:'กลีบดอกไม้', emoji:'🌸', col:0xf79fc4, alt:0xf7d2e6},
  ];
  function colTheme(){
    const m = new Date().getMonth();
    return COL_THEMES[m % COL_THEMES.length];
  }
  let colObjs = [];
  /* ทรงของแต่ละธีม — เล็กแต่ต้องอ่านออกจากเงารวมตอนมองมุม iso
     🌸 กลีบดอกไม้ = กลีบ 5 แฉกวางแบนซ้อนเกสรกลาง (เดิมเป็นก้อนกลม เด็กดูไม่รู้ว่าคืออะไร)
     🍃 ใบไม้ = แผ่นรี + ก้านกลาง · 🐚 เปลือกหอย = พัดซี่ · ⭐ ดาวตก = ดาว 5 แฉก + หาง */
  function buildCollectible(g, th, k){
    if(th.id === 'flower'){
      for(let i = 0; i < 5; i++){
        const pet = k.sphere(.12, th.col, 10);
        pet.scale.set(1, .34, 1.55);
        const a = i / 5 * Math.PI * 2;
        pet.position.set(Math.sin(a) * .12, .19, Math.cos(a) * .12);
        pet.rotation.y = a;
        g.add(pet);
      }
      const mid = k.sphere(.07, th.alt, 10); mid.scale.set(1, .6, 1); mid.position.y = .23; g.add(mid);
      return;
    }
    if(th.id === 'leaf'){
      const bl = k.sphere(.15, th.col, 10);
      bl.scale.set(.6, .22, 1.5); bl.position.y = .19; bl.rotation.y = .5; g.add(bl);
      const vein = k.cyl(.018, .018, .42, th.alt, 6);
      vein.rotation.set(Math.PI/2, 0, .5); vein.position.y = .21; g.add(vein);
      return;
    }
    if(th.id === 'shell'){
      for(let i = 0; i < 4; i++){
        const rb = k.sphere(.13, i % 2 ? th.col : th.alt, 10);
        rb.scale.set(.34, .3, 1.15);
        rb.position.set((i - 1.5) * .07, .18, 0);
        rb.rotation.y = (i - 1.5) * .17;
        g.add(rb);
      }
      const base = k.sphere(.08, th.alt, 8); base.scale.set(1.5, .5, .5); base.position.y = .15; g.add(base);
      return;
    }
    /* ⭐ ดาวตก */
    for(let i = 0; i < 5; i++){
      const sp = k.sphere(.1, th.col, 8);
      sp.scale.set(.42, .26, 1.25);
      const a = i / 5 * Math.PI * 2;
      sp.position.set(Math.sin(a) * .1, .2, Math.cos(a) * .1);
      sp.rotation.y = a;
      g.add(sp);
    }
    const core = k.sphere(.09, th.alt, 10); core.scale.set(1, .55, 1); core.position.y = .21; g.add(core);
  }
  function colEnsure(){
    if(!P) return;
    if(P.col.items && P.col.items.length) return;
    const rng = seedRng('col');
    P.col.items = walkableTiles(rng, COL_N, {apart:4, seen:true}).map(t => ({x:t.x, z:t.z}));
    P.col.got = [];
    persist();
  }
  function colClear(){ const w = W(); colObjs.forEach(o => { if(w) w.despawn(o); }); colObjs = []; }
  function colBuild(){
    const w = W(); if(!w || !P) return;
    colClear();
    const th = colTheme(), k = w.kit();
    P.col.items.forEach((it, i)=>{
      if(P.col.got.indexOf(i) >= 0) return;
      const g = new THREE.Group();
      /* ของชิ้นเล็กทรงมนๆ + วงเรืองแสงใต้ชิ้น ให้เด็กเห็นแต่ไกลว่ามีอะไรให้เก็บ
         ⚠ **ต้อง merge ทุกก้อน** — เฟรมเรตในโหมดบ้าน = จำนวน draw call ไม่ใช่จำนวนสามเหลี่ยม
           ของ 8 ชิ้น × 3 mesh = 24 draw call ซึ่งพอจะทำให้ MediaPipe ในโหมดมือ
           ไม่ได้รันเลยใน 2-3 วินาทีแรกหลังเข้าบ้าน (เทส handplay-camera จับได้จริง 2026-08-13) */
      /* ⚠ **ต้องดูออกด้วยเงารวมว่าเป็นของอะไร** (ผู้ใช้แจ้ง 2026-08-14 ว่ากลีบดอกไม้ดูไม่รู้เรื่อง)
         ⇒ วาดทรงจริงของแต่ละธีม ไม่ใช่ก้อนกลมสีต่างกันเฉยๆ — บทเรียนเดียวกับไอคอนเฟส 8 */
      buildCollectible(g, th, k);
      const ring = k.cyl(.3, .3, .02, th.alt, 16); ring.position.y = .03; g.add(ring);
      k.merge(g);
      g.position.set(w.wx(it.x), w.groundY(it.x, it.z), w.wz(it.z));
      g.userData.hPick = {game:'col', i:i, x:it.x, z:it.z};
      g.userData.colPh = i * .9;
      g.userData.baseY = w.groundY(it.x, it.z);
      w.spawn(g);
      colObjs.push(g);
    });
  }
  /* ของรางวัลเมื่อเก็บครบชุดสะสม — เป็นของแต่งบ้านที่ **ซื้อด้วยเงินไม่ได้** */
  const COL_PRIZES = [
    {at:3,  id:'birdhouse', label:'บ้านนกของนักสะสม'},
    {at:7,  id:'fountain',  label:'น้ำพุเล็กของนักสะสม'},
    {at:12, id:'gnome',     label:'ตุ๊กตาคนแคระของนักสะสม'},
  ];
  function colTake(i){
    if(!P || P.col.got.indexOf(i) >= 0) return;
    P.col.got.push(i);
    const w = W(), th = colTheme();
    if(typeof playCorrect === 'function') playCorrect();
    /* 🍃 เควสต์ "เก็บของไปส่ง" — บอกฝั่งเควสต์ว่าเก็บได้เพิ่ม 1 ชิ้น (ประตูเดียวกับตกปลา) */
    if(w.questCaught) w.questCaught('leaf', '');
    const left = P.col.items.length - P.col.got.length;
    if(left > 0){
      w.toast(ICO('col-' + th.id, th.emoji), 'เก็บ' + th.name + 'ได้แล้ว ' + P.col.got.length + '/' + P.col.items.length);
    }else{
      P.col.sets = (P.col.sets | 0) + 1;
      w.toast('🎉', 'เก็บครบทั้ง ' + P.col.items.length + ' ชิ้นแล้ว! (สะสมมา ' + P.col.sets + ' วัน)');
      if(typeof playCongrats === 'function') playCongrats();
      colPrize();
    }
    persist();
    colBuild();
    renderPanel();
  }
  function colPrize(){
    const w = W();
    COL_PRIZES.forEach(pz=>{
      if((P.col.sets | 0) < pz.at) return;
      if((P.col.prizes || []).indexOf(pz.id) >= 0) return;
      /* ⚠ ปลดให้ฟรี ไม่ตัดเงิน — เป็นรางวัลของการสะสม ไม่ใช่การซื้อ */
      const ok = window.HouseShop && window.HouseShop.grantFree
        ? window.HouseShop.grantFree(pz.id) : false;
      P.col.prizes = (P.col.prizes || []).concat([pz.id]);
      if(ok) w.toast(ICO('ui-gift', '🎁'), 'ปลด "' + pz.label + '" แล้ว! ไปหยิบได้ในโหมดตกแต่งบ้าน');
    });
  }

  /* ============================================================
     🎣 A3 — ตกปลาที่ท่าน้ำ
     เดินไปยืนติดน้ำแล้วกด "เหวี่ยงเบ็ด" → รอทุ่นจม → กด "ดึง!" ให้ทัน
     ⚠ **ปล่อยไม่ทันคือ "ปลาหนี" ไม่ใช่ "แพ้"** ลองใหม่ได้ไม่จำกัด ไม่เสียอะไรเลย (กติกาเหล็กข้อ 2)
     ⚠ **ตกปลาได้ตั้งแต่ยังไม่มีตู้ปลา** (ไม่งั้น dead end) — ปลาที่ได้ไปอยู่ใน "สมุดปลา" เสมอ
       ถ้ามีตู้ปลาในบ้านค่อยเห็นว่ายจริงเพิ่มอีกทาง
     ============================================================ */
  /* ---------- คลังปลา (รื้อใหม่ 2026-08-13 ตามคำสั่งผู้ใช้) ----------
     **บ่อน้ำกับทะเลเป็นคนละชนิดกันทั้งหมด** และแบ่งเกรดตามความหายาก
       เกรด 1 = หาง่าย (โผล่ 60%) · เกรด 2 = หายาก (30%) · เกรด 3 = หายากมาก (10%)
     💰 ราคาขาย **ตั้งไว้ต่ำโดยตั้งใจ** — รายได้หลักของเด็กต้องมาจากเควสต์ (206-237 🪙/วัน)
        ตกปลาเป็นของแถมเพลินๆ ไม่ใช่ทางลัดหาเงิน (กติกา "ห้ามทำเงินเฟ้อ" ข้อ 44.4)
        ⇒ ตกทั้งวันได้ราวๆ 20-40 🪙 เท่านั้น **ห้ามปรับขึ้นโดยไม่ถามผู้ใช้** */
  const FISH = [
    /* 🐟 ปลาน้ำจืด — เจอเฉพาะที่บ่อน้ำใหญ่ (ขยายจาก 11 เป็น 24 ชนิด 2026-08-16
       เหตุผล: เควสต์ตกปลาจริงต้อง "สั่งชนิดปลา" ได้หลากหลาย ไม่งั้นเด็กเจอโจทย์ซ้ำเดิมทุกวัน) */
    {id:'nil',     n:'ปลานิล',        e:'🐟', rare:1, where:'pond', pay:3},
    {id:'carp',    n:'ปลาตะเพียน',    e:'🐠', rare:1, where:'pond', pay:3},
    {id:'catfish', n:'ปลาดุก',        e:'🐡', rare:1, where:'pond', pay:4},
    {id:'guppy',   n:'ปลาหางนกยูง',   e:'🐠', rare:1, where:'pond', pay:3},
    {id:'sew',     n:'ปลาซิว',        e:'🐟', rare:1, where:'pond', pay:2},
    {id:'climb',   n:'ปลาหมอ',        e:'🐠', rare:1, where:'pond', pay:4},
    {id:'sway',    n:'ปลาสวาย',       e:'🐟', rare:1, where:'pond', pay:4},
    {id:'tadpole', n:'ลูกอ๊อด',        e:'🐸', rare:1, where:'pond', pay:2},
    {id:'snail',   n:'หอยขม',          e:'🐚', rare:1, where:'pond', pay:2},
    {id:'boot',    n:'รองเท้าบูตเก่า', e:'🥾', rare:1, where:'pond', pay:1, junk:true},  /* ของฮาๆ เด็กชอบ */
    {id:'can',     n:'กระป๋องเก่า',    e:'🥫', rare:1, where:'pond', pay:1, junk:true},
    {id:'snake',   n:'ปลาช่อน',       e:'🐟', rare:2, where:'pond', pay:8},
    {id:'shrimp',  n:'กุ้งแม่น้ำ',     e:'🦐', rare:2, where:'pond', pay:9},
    {id:'crab',    n:'ปูนา',           e:'🦀', rare:2, where:'pond', pay:8},
    {id:'feather', n:'ปลากราย',       e:'🐠', rare:2, where:'pond', pay:9},
    {id:'gourami', n:'ปลาแรด',        e:'🐟', rare:2, where:'pond', pay:9},
    {id:'goby',    n:'ปลาบู่',         e:'🐡', rare:2, where:'pond', pay:8},
    {id:'eel',     n:'ปลาไหล',        e:'🐍', rare:2, where:'pond', pay:10},
    {id:'betta',   n:'ปลากัด',        e:'🐠', rare:2, where:'pond', pay:11},
    {id:'frog',    n:'กบนา',           e:'🐸', rare:2, where:'pond', pay:7},
    {id:'gold',    n:'ปลาทอง',        e:'🐠', rare:3, where:'pond', pay:16},
    {id:'koi',     n:'ปลาคาร์ป',      e:'🐟', rare:3, where:'pond', pay:18},
    {id:'turtle',  n:'เต่าน้อย',       e:'🐢', rare:3, where:'pond', pay:20},
    {id:'arowana', n:'ปลาตะพัด',      e:'🐉', rare:3, where:'pond', pay:24},
    /* 🌊 ปลาทะเล — เจอเฉพาะริมทะเล (ขยายจาก 10 เป็น 24 ชนิด) */
    {id:'sardine', n:'ปลาซาร์ดีน',    e:'🐟', rare:1, where:'sea',  pay:3},
    {id:'mackerel',n:'ปลาทู',         e:'🐠', rare:1, where:'sea',  pay:4},
    {id:'anchovy', n:'ปลากะตัก',      e:'🐟', rare:1, where:'sea',  pay:3},
    {id:'seabass', n:'ปลากะพง',       e:'🐟', rare:1, where:'sea',  pay:4},
    {id:'damsel',  n:'ปลาสลิดหิน',    e:'🐠', rare:1, where:'sea',  pay:3},
    {id:'seashrimp',n:'กุ้งทะเล',      e:'🦐', rare:1, where:'sea',  pay:4},
    {id:'scallop', n:'หอยเชลล์',       e:'🐚', rare:1, where:'sea',  pay:3},
    {id:'conch',   n:'หอยสังข์',       e:'🐚', rare:1, where:'sea',  pay:4},
    {id:'seaweed', n:'สาหร่ายพันเบ็ด', e:'🌿', rare:1, where:'sea',  pay:1, junk:true},
    {id:'bottle',  n:'ขวดลอยน้ำ',      e:'🍶', rare:1, where:'sea',  pay:1, junk:true},
    {id:'squid',   n:'ปลาหมึกจิ๋ว',    e:'🦑', rare:2, where:'sea',  pay:9},
    {id:'clown',   n:'ปลาการ์ตูน',    e:'🐠', rare:2, where:'sea',  pay:10},
    {id:'puffer',  n:'ปลาปักเป้า',    e:'🐡', rare:2, where:'sea',  pay:9},
    {id:'kingfish',n:'ปลาอินทรี',     e:'🐟', rare:2, where:'sea',  pay:10},
    {id:'flat',    n:'ปลาลิ้นหมา',    e:'🐡', rare:2, where:'sea',  pay:9},
    {id:'bluecrab',n:'ปูม้า',          e:'🦀', rare:2, where:'sea',  pay:10},
    {id:'butterfly',n:'ปลาผีเสื้อ',    e:'🐠', rare:2, where:'sea',  pay:11},
    {id:'parrot',  n:'ปลานกแก้ว',     e:'🐠', rare:2, where:'sea',  pay:11},
    {id:'urchin',  n:'เม่นทะเล',       e:'🌰', rare:2, where:'sea',  pay:8},
    {id:'octopus', n:'ปลาหมึกยักษ์น้อย', e:'🐙', rare:2, where:'sea', pay:12},
    {id:'star',    n:'ปลาดาว',        e:'⭐', rare:3, where:'sea',  pay:17},
    {id:'jelly',   n:'แมงกะพรุนเรืองแสง', e:'🪼', rare:3, where:'sea', pay:20},
    {id:'seahorse',n:'ม้าน้ำ',         e:'🐴', rare:3, where:'sea',  pay:22},
    {id:'seaturtle',n:'เต่าทะเลน้อย',  e:'🐢', rare:3, where:'sea',  pay:24},
  ];

  const fishById = id => FISH.find(f => f.id === id) || null;

  /* ---------- ป้ายลอยเหนือของในฉาก (billboard) ----------
     ใช้แนวคิดเดียวกับป้าย "!" เหนือหัวชาวบ้าน: แผ่นเดียว วาดจาก canvas แล้วหันเข้าหากล้องทุกเฟรม
     ⚠ วัสดุ cache ตามไอคอน ⇒ ป้ายชนิดเดียวกันใช้ draw call ร่วมกัน */
  const bubbleMats = {};
  let BUBBLE_GEO = null;
  /* ⚠ **ไอคอนในป้ายวาดเองด้วยเส้น ไม่ใช้ emoji** (ผู้ใช้สั่ง 2026-08-14)
     เหตุผลเดียวกับที่โปรเจคนี้เลี่ยง emoji มาตลอด: บางเครื่องไม่มี glyph แล้วขึ้นเป็นกล่องเทา
     และรูปทรง/สีคุมไม่ได้ ⇒ ป้ายแต่ละแบบเลยดูไม่ต่างกันพอตอนย่อเหลือ ~40px บนจอจริง */
  const BUBBLE_ART = {
    fish: (c)=>{                                  /* 🎣 คันเบ็ด + ทุ่น */
      c.strokeStyle = '#8B5A2B'; c.lineWidth = 7; c.lineCap = 'round';
      c.beginPath(); c.moveTo(38, 86); c.lineTo(84, 30); c.stroke();
      c.strokeStyle = '#5A7D96'; c.lineWidth = 3.5;
      c.beginPath(); c.moveTo(84, 30); c.quadraticCurveTo(92, 52, 74, 62); c.stroke();
      c.beginPath(); c.arc(74, 68, 8, 0, Math.PI*2);
      c.fillStyle = '#F2544B'; c.fill();
      c.lineWidth = 3; c.strokeStyle = '#fff'; c.stroke();
      c.beginPath(); c.arc(74, 68, 8, Math.PI, Math.PI*2);
      c.fillStyle = '#FFF6E6'; c.fill();
    },
    seed: (c)=>{                                  /* 🌱 ต้นอ่อน 2 ใบ */
      c.strokeStyle = '#5AA84F'; c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.moveTo(64, 92); c.lineTo(64, 52); c.stroke();
      c.fillStyle = '#76C46A';
      [[-1, 0], [1, 0]].forEach(([sgn])=>{
        c.beginPath();
        c.ellipse(64 + sgn*20, 50, 20, 12, sgn * .5, 0, Math.PI*2);
        c.fill();
      });
      c.fillStyle = '#8FD06C';
      c.beginPath(); c.ellipse(64, 34, 13, 9, 0, 0, Math.PI*2); c.fill();
    },
    water: (c)=>{                                 /* 💧 หยดน้ำ */
      c.beginPath();
      c.moveTo(64, 26);
      c.bezierCurveTo(96, 62, 92, 96, 64, 96);
      c.bezierCurveTo(36, 96, 32, 62, 64, 26);
      c.closePath();
      c.fillStyle = '#4FC3F7'; c.fill();
      c.lineWidth = 5; c.strokeStyle = '#2E6F9E'; c.stroke();
      c.beginPath(); c.ellipse(54, 74, 7, 10, -.3, 0, Math.PI*2);
      c.fillStyle = 'rgba(255,255,255,.75)'; c.fill();
    },
    harvest: (c)=>{                               /* 🧺 ตะกร้า */
      c.strokeStyle = '#A5744B'; c.lineWidth = 6; c.lineCap = 'round';
      c.beginPath(); c.arc(64, 66, 24, Math.PI, 0); c.stroke();
      c.beginPath();
      c.moveTo(34, 66); c.lineTo(42, 100); c.lineTo(86, 100); c.lineTo(94, 66);
      c.closePath();
      c.fillStyle = '#D9A86C'; c.fill();
      c.lineWidth = 5; c.strokeStyle = '#A5744B'; c.stroke();
      c.strokeStyle = '#A5744B'; c.lineWidth = 3.5;
      [50, 64, 78].forEach(x=>{ c.beginPath(); c.moveTo(x - 2, 68); c.lineTo(x + 2, 100); c.stroke(); });
    },
    basket: (c)=>{                                /* ตะกร้าขายของ — มีผัก/ปลาโผล่ */
      c.fillStyle = '#F0A14B';
      c.beginPath(); c.ellipse(50, 52, 11, 16, -.35, 0, Math.PI*2); c.fill();
      c.fillStyle = '#7CC46A';
      c.beginPath(); c.ellipse(78, 52, 15, 10, .3, 0, Math.PI*2); c.fill();
      c.beginPath();
      c.moveTo(30, 64); c.lineTo(40, 104); c.lineTo(88, 104); c.lineTo(98, 64);
      c.closePath();
      c.fillStyle = '#D9A86C'; c.fill();
      c.lineWidth = 5; c.strokeStyle = '#A5744B'; c.stroke();
      c.lineWidth = 4;
      c.beginPath(); c.moveTo(30, 64); c.lineTo(98, 64); c.stroke();
    },
  };
  function bubbleMat(kind){
    if(bubbleMats[kind]) return bubbleMats[kind];
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const c = cv.getContext('2d');
    /* ฟองคำพูดทรงมน + หางชี้ลง (โทนเดียวกับป้าย "!" ของชาวบ้าน) */
    c.beginPath(); c.moveTo(64, 100); c.lineTo(52, 84); c.lineTo(76, 84); c.closePath();
    c.beginPath();
    c.moveTo(20, 12); c.lineTo(108, 12);
    c.quadraticCurveTo(118, 12, 118, 24); c.lineTo(118, 76);
    c.quadraticCurveTo(118, 88, 108, 88); c.lineTo(76, 88);
    c.lineTo(64, 106); c.lineTo(52, 88); c.lineTo(20, 88);
    c.quadraticCurveTo(10, 88, 10, 76); c.lineTo(10, 24);
    c.quadraticCurveTo(10, 12, 20, 12); c.closePath();
    c.fillStyle = '#FFFDF5'; c.fill();
    c.lineWidth = 7; c.strokeStyle = '#C08340'; c.lineJoin = 'round'; c.stroke();
    /* วาดไอคอนไว้กลางฟอง (ย่อลงให้อยู่ในกรอบ) */
    const art = BUBBLE_ART[kind] || BUBBLE_ART.seed;
    c.save();
    c.translate(64, 48); c.scale(.62, .62); c.translate(-64, -60);
    c.lineJoin = 'round'; c.lineCap = 'round';
    art(c);
    c.restore();
    const tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    bubbleMats[kind] = new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false, alphaTest:.12});
    return bubbleMats[kind];
  }
  function makeBubble(kind){
    if(!BUBBLE_GEO) BUBBLE_GEO = new THREE.PlaneGeometry(.95, .95);
    const m = new THREE.Mesh(BUBBLE_GEO, bubbleMat(kind));
    m.renderOrder = 6;
    return m;
  }
  /* ป้ายทุกใบต้องหันเข้าหากล้อง ไม่งั้นมองจากมุม iso แล้วเห็นเป็นแผ่นเฉียงๆ อ่านไม่ออก */
  function billboards(list){
    const w = W(); if(!w) return;
    const r = w.camRot(); if(!r) return;
    list.forEach(g => { const b = g && g.userData && g.userData.bubble; if(b) b.rotation.copy(r); });
  }
  /* ยืนอยู่ที่จุดตกปลาหรือยัง (ต้องอยู่ในระยะ 1 ช่อง — เดินไปแล้วอาจหยุดข้างๆ) */
  function atFishSpot(){
    const w = W(); if(!w) return false;
    const t = w.tile();
    return fishSpots.some(s => Math.abs(s.sx - t.x) <= 1 && Math.abs(s.sz - t.z) <= 1);
  }

  let fishState = null;      /* {phase:'wait'|'bite', t, fish} */
  let fishBob = null;
  const DEV_ONLY = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
                   || location.protocol === 'file:';
  let fishSpots = [];        /* [{x,z,kind:'pond'|'sea',obj}] — จุดตกปลาถาวร 2 จุด */

  /* ---------- จุดตกปลา 2 จุด: บ่อน้ำใหญ่ 1 · ทะเล 1 (ผู้ใช้สั่ง 2026-08-13) ----------
     ⚠ **ห้ามเดาพิกัด** — อ่านจากผังจริง: ท่าไม้ตกปลา (`POND_PIER`) สำหรับบ่อน้ำ
       ส่วนทะเลไล่หาช่องเดินได้ช่องแรกที่ติดผืนน้ำทะเลจากกริดจริง
     ⚠ ต้องมีป้ายลอยให้เห็นแต่ไกล ไม่งั้นเด็กไม่มีทางรู้ว่าตกปลาได้ตรงไหน */
  function findFishSpots(){
    const w = W(); if(!w) return [];
    const out = [];
    /* จุดตกปลาทั้งหมดมาจากท่าไม้ที่ผังประกาศไว้ (บ่อน้ำ 2 · ทะเล 2)
       ⚠ `x/z` = ช่องน้ำที่ทุ่นลอย · `sx/sz` = ช่องที่เด็กไปยืน (บนท่า) — **คนละช่องกันเสมอ**
       ⚠ **`kind` ต้องตรงกับผืนน้ำจริง** ไม่งั้นตกที่ทะเลแล้วได้ปลาน้ำจืด (เจอจากเทส 2026-08-14) */
    (w.pondFishSpots() || []).forEach(sp=>{
      if(!w.walkable(sp.stand.x, sp.stand.z)) return;
      out.push({x:sp.water.x, z:sp.water.z, sx:sp.stand.x, sz:sp.stand.z,
                kind: sp.sea ? 'sea' : 'pond', name:sp.name});
    });
    /* ⚠ **เลิกหาจุดทะเลอัตโนมัติแล้ว** (2026-08-14) — ของเดิมไปเจอช่องทรายริมน้ำ ซึ่งยืน
       "ติดขอบพื้น" พอดี ผิดกติกาที่ผู้ใช้สั่งว่าทุกจุดต้องห่างขอบพื้นอย่างน้อย 1 ช่อง
       ตอนนี้ใช้ท่าไม้ที่ยื่นลงทะเลจริงแทน (x51-52 และ x31) ซึ่งอยู่กลางน้ำชัดเจน */
    return out;
  }
  function fishSpotsClear(){
    const w = W();
    fishSpots.forEach(s => { if(s.obj && w) w.despawn(s.obj); });
    fishSpots = [];
  }
  function fishSpotsBuild(){
    const w = W(); if(!w) return;
    fishSpotsClear();
    fishSpots = findFishSpots();
    const k = w.kit();
    fishSpots.forEach((sp, i)=>{
      const g = new THREE.Group();
      /* วงคลื่นบนผิวน้ำ 3 วง — บอกว่า "ตรงนี้ตกปลาได้" และตอนตกจะใช้บอกว่าปลาใกล้มาแค่ไหน */
      const rings = [];
      for(let r = 0; r < 3; r++){
        /* ⚠ สีต้อง **กลืนไปกับผิวน้ำ** ไม่ใช่ขาวโพลน (ผู้ใช้แจ้ง 2026-08-14 ว่าไม่เข้ากับน้ำ)
           ฟ้าอ่อนอมขาว + โปร่งแสง ⇒ ดูเป็นระลอกคลื่นจริง ไม่ใช่วงแหวนพลาสติกลอยอยู่ */
        const ring = k.torus(.34, .038, 0xd8f2ff, 18);
        ring.material = ring.material.clone();
        ring.material.transparent = true;
        ring.material.opacity = .55;
        ring.rotation.x = Math.PI/2;          /* ⚠ torus() คืนวงตั้งฉาก ต้องพลิกเองให้วางแบน */
        ring.position.y = .04;
        ring.userData.ph = r / 3;
        g.add(ring); rings.push(ring);
      }
      const b = makeBubble('fish');
      b.position.y = 1.35;
      g.add(b);
      /* ⚠ ทุ่นอยู่ "ในน้ำ" ⇒ ไม่ยกตามท่าไม้ (groundY ของช่องน้ำ = 0) */
      g.position.set(w.wx(sp.x), 0, w.wz(sp.z));
      g.userData.hPick = {game:'fishspot', i:i, x:sp.sx, z:sp.sz};
      g.userData.bubble = b;
      g.userData.rings = rings;
      w.spawn(g);
      sp.obj = g;
    });
  }

  function fishCast(){
    const w = W();
    if(fishState) return false;
    if(!atFishSpot()){
      w.toast(ICO('ui-fishing', '🎣'), 'ต้องไปที่จุดตกปลาก่อนนะ — มองหาป้าย 🎣 ที่บ่อน้ำหรือริมทะเล');
      return false;
    }
    const rng = rngFrom(fnv(childKey() + '|' + Date.now() + '|fish'));
    /* เวลาที่ปลาจะกิน 1.2-3.4 วิ — เป็น "จังหวะของเกม" ไม่ใช่ตัวจับเวลากดดันเด็ก
       (ไม่มีนับถอยหลังบนจอ ไม่มีบทลงโทษถ้าพลาด กดใหม่ได้ทันที) */
    const t = w.tile();
    const sp = fishSpots.find(x => Math.abs(x.sx - t.x) <= 1 && Math.abs(x.sz - t.z) <= 1) || fishSpots[0];
    const wait = 1.2 + rng() * 2.2;
    fishState = {phase:'wait', t: wait, wait: wait, fish: rollFish(rng, whereNow()), spot: sp};
    fishBobBuild(sp);
    /* ⚠ ป้าย 🎣 ต้องหายระหว่างตก (ผู้ใช้สั่ง 2026-08-14) — ไม่งั้นเด็กแตะซ้ำแล้วงงว่าทำไมไม่มีอะไรเกิด */
    fishSpots.forEach(x => { if(x.obj && x.obj.userData.bubble) x.obj.userData.bubble.visible = false; });
    renderPanel();
    return true;
  }
  /* สุ่มปลาตาม "ที่ที่ยืนอยู่" — บ่อกับทะเลได้คนละชุดเลย (ผู้ใช้สั่ง 2026-08-13) */
  function whereNow(){
    const w = W(); if(!w) return 'pond';
    const t = w.tile();
    const sp = fishSpots.find(s => Math.abs(s.sx - t.x) <= 1 && Math.abs(s.sz - t.z) <= 1);
    return sp ? sp.kind : 'pond';
  }
  /* 💰 **กันเงินเฟ้อจากการตกปลารัวๆ** (ผู้ใช้สั่ง 2026-08-22)
     ปลาขายได้ตัวละ 2-24 🪙 และตกได้ไม่จำกัด ⇒ เด็กที่นั่งตกทั้งวันทำเงินได้เกินเพดานเควสต์ไปมาก
     ⇒ ตกเกิน `FISH_FREE` ตัวในวันเดียว ปลาเริ่ม "เบื่อเบ็ด": เจอขยะมากขึ้น · ปลาหายากน้อยลงมากๆ
     🔒 **ห้ามทำให้ตกไม่ได้เลย** (กติกาเหล็ก: ไม่ลงโทษเด็ก) — ยังได้ปลาธรรมดาเรื่อยๆ ได้ของสะสมต่อ
        แค่ "คุ้มน้อยลง" จนไม่มีใครอยากนั่งฟาร์มเงิน
     🔒 **ห้ามหรี่ระหว่างทำเควสต์ตกปลา** — เควสต์สั่งปลาเจาะจงเป็นชนิด หรี่แล้วเควสต์ไม่มีวันจบ
     ⏱ นับจาก `P.fish.today` ที่ล้างทุกวันอยู่แล้ว ⇒ พรุ่งนี้กลับมาเหมือนเดิม */
  const FISH_FREE  = 10;    /* 10 ตัวแรกของวัน = โอกาสเดิมทุกอย่าง */
  const FISH_TIRED = 20;    /* ตัวที่ 20 ขึ้นไป = แย่สุด แล้วคงที่ ไม่แย่ลงไปกว่านี้อีก */
  const FISH_JUNK_MAX = .45;   /* โอกาสได้ขยะที่เพิ่มเข้ามาตอนเบื่อเบ็ดเต็มที่ */
  function fishTired(){
    const w = W();
    if(w && w.questFishing && w.questFishing()) return 0;
    const n = (P && P.fish) ? (P.fish.today | 0) : 0;
    if(n < FISH_FREE) return 0;
    return Math.min(1, (n - FISH_FREE) / (FISH_TIRED - FISH_FREE));
  }
  function rollFish(rng, where){
    const here = FISH.filter(f => f.where === where);
    const k = fishTired();
    /* ① ขยะที่ "แถมเข้ามา" ตอนเบื่อเบ็ด (ขยะในกองปลาหาง่ายยังมีเหมือนเดิม ไม่ได้เอาออก) */
    if(k > 0 && rng() < FISH_JUNK_MAX * k){
      const junk = here.filter(f => f.junk);
      if(junk.length) return junk[(rng() * junk.length) | 0];
    }
    /* ② ปลาหายาก: 30% → 8% · หายากมาก: 10% → 1% */
    const p3 = .10 - .09 * k;
    const p2 = .30 - .22 * k;
    const r = rng();
    const want = r < p3 ? 3 : (r < p3 + p2 ? 2 : 1);
    const pool = here.filter(f => f.rare === want);
    return pool[(rng() * pool.length) | 0] || here[0] || FISH[0];
  }
  /* ทุ่นลอย **ที่ช่องน้ำของจุดนั้น** (ไม่ใช่ช่องที่เด็กยืน — ผู้ใช้แจ้ง 2026-08-14 ว่าทุ่นทับตัวเด็ก)
     + อนิเมชันเหวี่ยง: ทุ่นพุ่งเป็นเส้นโค้งจากมือเด็กไปลงน้ำ ~0.55 วิ */
  function fishBobBuild(sp){
    const w = W(); if(!w) return;
    fishBobClear();
    const k = w.kit(), t = w.tile();
    const g = new THREE.Group();
    const ball = k.sphere(.16, 0xf2544b, 12); ball.position.y = .12; g.add(ball);
    const cap = k.sphere(.16, 0xfff6e6, 12); cap.scale.set(1, .5, 1); cap.position.y = .22; g.add(cap);
    k.merge(g);
    const from = {x: w.wx(t.x), z: w.wz(t.z)};
    const to   = {x: w.wx(sp.x), z: w.wz(sp.z)};
    g.position.set(from.x, .5, from.z);
    g.userData.hPick = {game:'fish'};
    g.userData.cast = {from, to, t:0, dur:.55};
    w.spawn(g);
    fishBob = g;
    /* หันหน้าเด็กไปทางน้ำก่อนเหวี่ยง — เห็นแล้วรู้ว่ากำลังตกปลาอยู่ */
    if(w.faceTo) w.faceTo(sp.x, sp.z);
    /* ⚠ `0` = **ค้างท่าถือคันเบ็ดไว้จนกว่าจะเลิกตก** (ปล่อยกลับท่ายืนทันทีจะเห็นทุ่นลอยอยู่ในน้ำ
       แต่ตัวเด็กยืนเฉยๆ เหมือนไม่ได้ตกปลา) — คลายที่ `fishBobClear()` ตอนดึงเบ็ด/เลิกเล่น */
    if(w.pose) w.pose('cast', 0);
  }
  function fishBobClear(){
    const w = W();
    if(fishBob && w) w.despawn(fishBob);
    fishBob = null;
    if(w && w.pose) w.pose(null);          /* คลายท่าถือคันเบ็ด กลับไปยืนปกติ */
    /* คืนป้าย 🎣 ให้ทุกจุดเมื่อเลิกตก */
    fishSpots.forEach(x => { if(x.obj && x.obj.userData.bubble) x.obj.userData.bubble.visible = true; });
  }
  /* กด "ดึง!" — ถูกจังหวะได้ปลา · ไม่ถูกจังหวะ = ปลาหนี ลองใหม่ได้เลย ไม่เสียอะไร */
  function fishPull(){
    const w = W();
    if(!fishState) return false;
    if(fishState.phase !== 'bite'){
      fishState = null; fishBobClear();
      /* ⚠ ต้องสั่งท่า **หลัง** fishBobClear() เพราะตัวนั้นเรียก pose(null) คลายท่าถือคันทิ้ง */
      if(w.pose) w.pose('pull', 850);        /* ดึงเปล่าก็ยังต้องเห็นว่าเด็กกระตุกคันเบ็ดจริง */
      w.toast(ICO('ui-fishing', '🎣'), 'ยังไม่ถึงจังหวะ ปลาว่ายหนีไปแล้ว — ลองใหม่ได้เลยนะ');
      renderPanel();
      return false;
    }
    const f = fishState.fish;
    fishState = null; fishBobClear();
    if(w.pose) w.pose('pull', 1400);         /* ดึงติดปลา — จังหวะยาวกว่า มีตอนยกปลาขึ้นมาดูด้วย */
    P.fish.today = (P.fish.today | 0) + 1;
    const isNew = (P.fish.book || []).indexOf(f.id) < 0;
    if(isNew) P.fish.book = (P.fish.book || []).concat([f.id]);
    /* 📔 เฟส 16: สมุดปลาเป็นแท็บหนึ่งของสมุดสะสม ⇒ ได้ตัวใหม่ต้องเช็ครางวัลระหว่างทางด้วย
       (ปลาไม่ผ่าน `HouseBook.mark()` เพราะจดอยู่ใน play state มาตั้งแต่เฟส 11 — ห้ามจดซ้ำ 2 ที่) */
    if(isNew && window.HouseBook) window.HouseBook.checkPrize();
    /* เก็บตัวจริงเข้าถัง เอาไปขายที่ร้านสะดวกซื้อได้ (สมุดปลาเป็นแค่ "เคยเจออะไรบ้าง" ถาวร) */
    P.fish.bag = Object.assign({}, P.fish.bag);
    P.fish.bag[f.id] = (P.fish.bag[f.id] | 0) + 1;
    persist();
    if(typeof playCongrats === 'function') playCongrats();
    { const t2 = w.tile();
      spawnFx({x:w.wx(t2.x), y:w.groundY(t2.x, t2.z), z:w.wz(t2.z)},
              {col:0xffd166, col2:0xfff3b0, up:true, h:1.1, n:12}); }
    w.toast(ICO('fish-' + f.id, f.e), (isNew ? 'ได้ตัวใหม่! ' : 'ได้ ') + f.n + ' แล้ว (สมุดปลา ' + P.fish.book.length + '/' + FISH.length + ')');
    /* 🎣 เควสต์ "ตกปลาไปส่ง" (2026-08-16) — บอกฝั่งเควสต์ว่าได้ปลาเพิ่ม 1 ตัวแล้ว
       ⚠ ต้องอยู่ **หลัง** toast ของเกม ไม่งั้น toast ความคืบหน้าเควสต์จะถูกทับทันที */
    if(w.questCaught) w.questCaught('fish', f.id);
    renderPanel();
    return true;
  }

  /* ============================================================
     📷 A4 — ภารกิจช่างภาพ
     ใบสั่งวันละใบ ("ถ่ายรูปที่ริมหาด" ฯลฯ) เดินไปที่นั่นแล้วกดชัตเตอร์ → ได้ภาพจริงจากฉาก 3D
     ⚠ **ไม่ใช้ `preserveDrawingBuffer`** (กินเฟรมเรตตลอดเวลา) — ใช้วิธีที่ถูกกว่ามาก:
       สั่ง `render()` แล้ว `toDataURL()` **ในจังหวะเดียวกัน (synchronous)** ก่อนเบราว์เซอร์
       จะเคลียร์บัฟเฟอร์ตอน composite ⇒ ได้ภาพครบโดยไม่ต้องแลกเฟรมเรตเลย
     ⚠ รูปเก็บเป็น dataURL **ย่อเล็ก + จำกัดจำนวน** ไม่งั้น localStorage เต็มแล้วพังทั้งเซฟ
     ============================================================ */
  /* เก็บได้กี่รูป — รูปละ ~8-14 KB (jpeg กว้าง 160px) ⇒ 12 รูป ≈ 170 KB
     ยังห่างจากเพดาน localStorage (~5 MB/โดเมน) มาก แต่ไม่ปล่อยให้โตไม่จำกัด
     ⚠ **เต็มแล้วไม่ทับรูปเก่าอัตโนมัติ** — เด้งอัลบั้มให้เด็กเลือกลบเอง (รูปเป็นของที่เด็กตั้งใจถ่าย)
     ⚠ ผู้ใช้สั่งเพิ่มเป็น 20 รูป 2026-08-14 ⇒ ~280 KB ยังห่างเพดาน localStorage (~5 MB) มาก */
  const PHOTO_MAX = 15;
  /* ความกว้างที่ย่อเก็บ — ผู้ใช้แจ้ง 2026-08-14 ว่า 160px เบลอมากตอนกดดูรูปใหญ่
     ⚠ ผู้ใช้เลือกเอง 2026-08-14: **ลดเหลือ 12 รูป แล้วเพิ่มความคมเป็น 760px**
       (~65-80 KB/รูป × 12 ≈ 800-960 KB ต่อเด็ก 1 คน · ครอบครัวลูก 3 คน ≈ 2.9 MB
        ยังใต้เพดาน localStorage ~5 MB)
     ⚠ **ห้ามเพิ่มความกว้างโดยไม่ลดจำนวนรูปลงพร้อมกัน** — มีเทสคุมขนาดเซฟไว้ */
  const PHOTO_W = 900;
  /* `where` = **จุดที่ใบสั่งวันนี้อยากได้ บอกเป็นภาษาเด็ก** (ผู้ใช้สั่ง 2026-08-18)
     ของเดิมมีแต่ `hint` สั้นๆ ⇒ เด็กเปิดแผงกิจกรรมแล้วยังไม่รู้ว่า "ตรงไหนคือริมน้ำ"
     ⇒ แยกเป็น 2 บรรทัด: `where` บอกว่าอยากได้ที่ไหน · `look` บอกว่าให้มองหาอะไรถึงจะรู้ว่าถึงแล้ว
     ⚠ ต้องเป็นคำที่เด็ก 5 ขวบมองหาในฉากได้จริง ห้ามใช้ชื่อโซนในโค้ด */
  const PHOTO_ORDERS = [
    {id:'water',  name:'ถ่ายรูปริมน้ำ',        hint:'ไปยืนใกล้แม่น้ำหรือสะพานแล้วกดถ่าย',
     where:'ริมแม่น้ำ หรือบนสะพาน', look:'มองหาน้ำสีฟ้า ยืนให้น้ำอยู่ใกล้ๆ ตัว'},
    {id:'home',   name:'ถ่ายรูปหน้าบ้านของหนู', hint:'กลับไปที่บริเวณบ้านแล้วกดถ่าย',
     where:'บริเวณบ้านของหนูเอง', look:'เดินกลับไปที่บ้านที่มีรั้วกับสวนของหนู'},
    {id:'market', name:'ถ่ายรูปที่ตลาด',        hint:'เดินไปที่ลานตลาดรถเข็นแล้วกดถ่าย',
     where:'ลานตลาดที่มีรถเข็นขายของ', look:'มองหาร่มสีสดๆ กับรถเข็นเรียงกันหลายคัน'},
    {id:'any',    name:'ถ่ายรูปมุมที่หนูชอบ',   hint:'เดินไปมุมไหนก็ได้ที่ชอบ แล้วกดถ่ายเลย',
     where:'มุมไหนก็ได้ที่หนูชอบ', look:'วันนี้ไม่มีจุดบังคับ ถ่ายตรงไหนก็สำเร็จเลย'},
  ];
  function photoOrder(){
    if(!P) return PHOTO_ORDERS[3];
    if(!P.photo.order){
      const rng = seedRng('photo');
      P.photo.order = PHOTO_ORDERS[(rng() * PHOTO_ORDERS.length) | 0].id;
      persist();
    }
    return PHOTO_ORDERS.find(o => o.id === P.photo.order) || PHOTO_ORDERS[3];
  }
  function photoSpotOk(){
    const w = W(), o = photoOrder(), t = w.tile();
    if(o.id === 'any') return true;
    if(o.id === 'water'){
      const g = w.grid(), tt = w.tile();
      for(let dz=-2; dz<=2; dz++) for(let dx=-2; dx<=2; dx++){
        const row = g && g[tt.z + dz];
        if(row && (row[tt.x + dx] === 1 || row[tt.x + dx] === 2)) return true;
      }
      return false;
    }
    if(o.id === 'home') return w.inHomeZone(t.x, t.z);
    if(o.id === 'market') return (w.zoneName(t.x, t.z) || '').indexOf('ตลาด') >= 0;
    return true;
  }
  /* เสียงชัตเตอร์ (ผู้ใช้สั่ง 2026-08-13) — ประกอบจาก playTone ชุดเดิมของแอป
     **ไม่โหลดไฟล์เสียงเพิ่มแม้แต่ไฟล์เดียว** (กติกาเดียวกับเครื่องดนตรีเฟส 9)
     2 จังหวะสั้นๆ ให้ได้ยินเป็น "แชะ" — ม่านเปิดแล้วปิด */
  function playShutter(){
    if(typeof playTone !== 'function') return;
    playTone(1900, .035, 'square', 0,    .05);
    playTone(1200, .05,  'square', .045, .05);
  }
  /* พรีวิวรูปที่เพิ่งถ่าย — โผล่เป็น "รูปถ่าย 1 ใบ" กลางจอ 2 วินาทีแล้วหายเอง */
  let photoPvT = null;
  function photoPreview(url){
    const el = $('house-photo-pv'), im = $('house-photo-pv-img');
    if(!el || !im) return;
    im.src = url;
    el.hidden = false;
    el.classList.remove('on');
    void el.offsetWidth;                 /* force reflow ให้อนิเมชันเล่นซ้ำได้ทุกครั้ง */
    el.classList.add('on');
    clearTimeout(photoPvT);
    photoPvT = setTimeout(()=>{ el.classList.remove('on'); el.hidden = true; }, 2000);
  }
  function photoShoot(){
    const w = W();
    /* 📷 **ถ่ายได้ทุกที่ แล้วให้เกมตรวจเองว่าตรงจุดของใบสั่งไหม** (ผู้ใช้สั่ง 2026-08-17)
       ของเดิม: ยืนผิดที่ = **กดชัตเตอร์ไม่ติดเลย** เด้ง toast บอกใบสั่งแล้วจบ
       ⇒ เด็กที่แค่อยากถ่ายรูปสวยๆ เก็บไว้ ทำไม่ได้เลยจนกว่าจะเดินไปจุดที่ระบบสั่ง
         = ลงโทษกลายๆ และขัดกติกาเหล็กข้อ 2 (กดแล้วต้องมีอะไรเกิดขึ้นเสมอ ห้ามเงียบ/ห้ามดุ)
       ⇒ ตอนนี้: **ได้รูปทุกครั้ง** เก็บเข้าอัลบั้มเสมอ · เควสต์ "ถ่ายรูปมาให้ดู" ก็นับให้ทุกใบ
         (เควสต์นั้นขอแค่ "วิวสวยๆ" ไม่ได้ระบุสถานที่)
         ส่วน **ใบสั่งประจำวัน** จะติ๊กว่าสำเร็จก็ต่อเมื่อยืนตรงจุดจริงเท่านั้น — ระบบตรวจให้เอง
       ⚠ ยืนผิดจุดต้อง **ชมก่อนแล้วค่อยบอกทาง** ไม่ใช่บอกว่าทำผิด */
    if((P.photo.shots || []).length >= PHOTO_MAX){
      w.toast(ICO('ui-camera', '📷'), 'อัลบั้มเต็มแล้ว (' + PHOTO_MAX + ' รูป) ลบรูปเก่าออกก่อนนะ');
      photoAlbumOpen();
      return false;
    }
    const o = photoOrder();
    const onSpot = photoSpotOk();
    const wasDone = !!P.photo.done;
    playShutter();
    const url = grabShot();
    if(!url){ w.toast(ICO('ui-camera', '📷'), 'ถ่ายรูปไม่สำเร็จ ลองใหม่อีกครั้งนะ'); return false; }
    P.photo.shots = (P.photo.shots || []).concat([{u:url, d:dayKey()}]);
    if(onSpot) P.photo.done = true;      /* ใบสั่งวันนี้สำเร็จ — เฉพาะตอนยืนถูกจุด */
    persist();
    /* 📷 เควสต์ "ถ่ายรูปไปให้ดู" — นับทุกใบที่ถ่ายสำเร็จ ไม่ผูกกับใบสั่งประจำวัน */
    if(w.questCaught) w.questCaught('photo', '');
    photoPreview(url);
    if(onSpot && !wasDone) w.toast('🎉', 'ตรงจุดพอดีเลย! ทำใบสั่ง "' + o.name + '" สำเร็จแล้ว');
    else if(!onSpot)       w.toast(ICO('ui-camera', '📷'), 'ได้รูปสวยแล้ว เก็บไว้ในอัลบั้มให้นะ · '
                                       + 'ใบสั่งวันนี้คือ "' + o.name + '" — ' + o.hint);
    renderPanel();
    return true;
  }
  /* ---------- อัลบั้มรูป — เปิดดู/ลบได้ ----------
     ⚠ **ต้องลบได้จริง** เพราะรูปเก็บเป็น dataURL ใน localStorage ซึ่งมีเพดาน ~5MB ต่อโดเมน
       ถ้าลบไม่ได้ เด็กถ่ายจนเต็มแล้วเซฟทั้งก้อนจะเขียนไม่ลง = ข้อมูลบ้านหายทั้งหมด */
  /* ⚠ **เปิดอัลบั้มจากในโหมดถ่ายรูปแล้วห้ามหลุดออกจากโหมด** (ผู้ใช้สั่ง 2026-08-14)
     เด็กเปิดดูรูปเก่าแล้วปิด ต้องได้เล็งกล้องต่อทันที ไม่ต้องกดเข้าโหมดใหม่ */
  function photoAlbumOpen(){
    const el = $('house-album');
    if(!el) return;
    el.hidden = false;
    renderAlbum();
  }
  function photoAlbumClose(){ const el = $('house-album'); if(el) el.hidden = true; photoBigClose(); }
  /* ดูรูปใหญ่ทีละใบ */
  function photoBig(url){
    const el = $('house-photo-big'), im = $('house-photo-big-img');
    if(!el || !im) return;
    im.src = url; el.hidden = false;
  }
  function photoBigClose(){ const el = $('house-photo-big'); if(el) el.hidden = true; }
  function photoAlbumIsOpen(){ const el = $('house-album'); return !!el && !el.hidden; }
  function renderAlbum(){
    const list = $('house-album-list');
    if(!list || !P) return;
    const shots = P.photo.shots || [];
    const cnt = $('house-album-count');
    if(cnt) cnt.textContent = shots.length + ' / ' + PHOTO_MAX + ' รูป';
    list.innerHTML = '';
    if(!shots.length){
      const e = document.createElement('div');
      e.className = 'hpt-note';
      e.textContent = 'ยังไม่มีรูปเลย กดปุ่มกล้องมุมขวาบนแล้วออกไปถ่ายรูปในเมืองได้เลยนะ';
      list.appendChild(e);
      return;
    }
    shots.forEach((sh, i)=>{
      const c = document.createElement('div');
      c.className = 'halb-card';
      const img = document.createElement('img');
      img.src = sh.u; img.alt = 'รูปที่ถ่ายวันที่ ' + sh.d;
      c.appendChild(img);
      const cap = document.createElement('span');
      cap.className = 'halb-cap';
      cap.textContent = sh.d;
      c.appendChild(cap);
      /* แตะที่รูป = ดูใหญ่ (ผู้ใช้สั่ง 2026-08-14) */
      c.onclick = ()=>{ if(typeof playClick === 'function') playClick(); photoBig(sh.u); };
      const del = document.createElement('button');
      del.type = 'button'; del.className = 'halb-del'; del.textContent = '✕';
      del.setAttribute('aria-label', 'ลบรูปนี้');
      del.onclick = (ev)=>{
        ev.stopPropagation();                 /* ไม่งั้นกดลบแล้วเปิดรูปใหญ่ตามมาด้วย */
        if(typeof playClick === 'function') playClick();
        P.photo.shots = (P.photo.shots || []).filter((_, k) => k !== i);
        persist();
        renderAlbum();
        renderPanel();
      };
      c.appendChild(del);
      list.appendChild(c);
    });
  }
  /* ⚠ ต้อง render + toDataURL **ติดกันในจังหวะเดียว** ห้ามคั่นด้วย await/setTimeout
     ไม่งั้นบัฟเฟอร์ถูกเคลียร์ไปแล้วจะได้ภาพดำล้วน (นี่คือเหตุผลที่ไม่ต้องเปิด preserveDrawingBuffer) */
  function grabShot(){
    try{
      const cv = document.getElementById('house-canvas');
      if(!cv || !window.__housePaint) return null;
      window.__housePaint();
      const out = document.createElement('canvas');
      const ratio = cv.height / cv.width;
      out.width = PHOTO_W; out.height = Math.max(1, Math.round(PHOTO_W * ratio));
      out.getContext('2d').drawImage(cv, 0, 0, out.width, out.height);
      return out.toDataURL('image/jpeg', .74);
    }catch(e){ return null; }
  }

  /* ============================================================
     🌱 A5 — แปลงผักหน้าบ้าน (รื้อใหม่ 2026-08-13 ตามคำสั่งผู้ใช้)
     **แปลงผัก 4 แปลงเป็นของที่มีอยู่แล้วตั้งแต่แรก** (เฟอร์นิเจอร์ `veg-plot` ที่ seed ไว้ที่
     x14-15 / z33-34) ⇒ **ย้ายได้ในโหมดตกแต่งเหมือนของชิ้นอื่นทุกประการ** โดยไม่ต้องเขียนกลไกย้ายใหม่
     แต่ละแปลงมี **ป้ายลอยบอกว่าตอนนี้ทำอะไรได้** (ปลูก / รดน้ำ / เก็บ) แตะแล้วทำกับแปลงนั้นแปลงเดียว

     ⚠ **ตำแหน่งแปลงอ่านจาก decor จริงเสมอ ห้ามเก็บพิกัดซ้ำใน play state** — ไม่งั้นเด็กย้ายแปลง
       ในโหมดตกแต่งแล้วต้นผักจะค้างอยู่ที่เดิม · ส่วน "ต้นอะไรโตขั้นไหน" ผูกกับ **ลำดับแปลง** (index)
     ⚠ **ผักต้องไม่ตาย** ลืมรดน้ำ = แค่ไม่โตวันนั้น (กติกาเหล็กข้อ 2)
     ⚠ เมล็ดไม่ต้องซื้อ — เด็กใหม่มี 0 เหรียญ ถ้าบังคับซื้อคือ dead end ตั้งแต่วันแรก
     ============================================================ */
  /* ---------- เมล็ดพันธุ์แบ่งเกรด (ผู้ใช้สั่ง 2026-08-13) ----------
     **แพงขึ้น = ใช้เวลาปลูกนานขึ้น = ขายได้แพงขึ้น** (ต้องคุ้มค่ารอ ไม่งั้นไม่มีใครซื้อเกรดสูง)
     `days` = ต้องรดน้ำกี่วันถึงเก็บได้ (รดได้วันละครั้ง ⇒ เท่ากับจำนวน "วันที่เข้าเล่น")

     💰 กันเงินเฟ้อ — กำไรต่อต้นคิดแล้วอยู่ที่ 5 / 9 / 15 🪙 ต่อ 3 / 4 / 5 วัน
        มี 4 แปลง ⇒ เต็มที่ ~20-60 🪙 ต่อรอบปลูก ซึ่งน้อยกว่ารายได้เควสต์ 1 วัน (206-237)
        **เป็นของแถมให้มีเหตุผลกลับมาพรุ่งนี้ ไม่ใช่ทางลัดหาเงิน · ห้ามปรับขึ้นโดยไม่ถามผู้ใช้** */
  const SEEDS = [
    {id:'carrot',  n:'แครอท',     e:'🥕', col:0xf08a3c, grade:1, cost:6,  pay:11, days:3},
    {id:'lettuce', n:'ผักสลัด',   e:'🥬', col:0x7cc46a, grade:1, cost:6,  pay:11, days:3},
    {id:'tomato',  n:'มะเขือเทศ', e:'🍅', col:0xe4574f, grade:2, cost:12, pay:21, days:4},
    {id:'corn',    n:'ข้าวโพด',   e:'🌽', col:0xf3c53f, grade:2, cost:12, pay:21, days:4},
    {id:'pumpkin', n:'ฟักทอง',    e:'🎃', col:0xef8b2c, grade:3, cost:20, pay:35, days:5},
    {id:'melon',   n:'แตงโม',     e:'🍉', col:0x5aa84f, grade:3, cost:20, pay:35, days:5},
  ];
  const GRADE_NAME = {1:'ธรรมดา', 2:'ดี', 3:'พิเศษ'};
  const seedById = id => SEEDS.find(x => x.id === id) || SEEDS[0];

  const GROW_MAX = 3;              /* ค่าอ้างอิงเดิม (เมล็ดเกรด 1) — ของจริงดู growMax() ต่อเมล็ด */
  function growMax(seedId){ return seedById(seedId).days; }
  /* เพดานจำนวนแปลงผัก — **แหล่งความจริงเดียวอยู่ที่ `FURN_MAX` ของ js/house-shop.js**
     (ผู้ใช้สั่ง 2026-08-14: ซื้อเพิ่มได้สูงสุด 8 แปลง) อ่านมาเก็บไว้เฉยๆ กันเลขหลุดกัน 2 ที่ */
  const PLOT_MAX = (window.HouseShop && window.HouseShop.FURN_MAX
                    && window.HouseShop.FURN_MAX['veg-plot']) || 8;
  let gardenObjs = [];

  function beds(){ const w = W(); return w ? (w.vegPlots() || []) : []; }
  /* ช่องปลูกของแปลงที่ i — `null` = แปลงว่าง */
  function slotAt(i){
    const arr = P && P.garden && P.garden.plots;
    return (arr && arr[i]) || null;
  }
  function setSlot(i, v){
    if(!P) return;
    const arr = (P.garden.plots || []).slice();
    while(arr.length <= i) arr.push(null);
    arr[i] = v;
    P.garden.plots = arr;
  }
  /* ตอนนี้แปลงนี้ทำอะไรได้ — ใช้ทั้งเลือกไอคอนป้ายและตัดสินใจตอนแตะ */
  /* ⚠ **รดน้ำนับ "รายแปลง" ไม่ใช่รายวันทั้งสวน** (บั๊กจริงที่ผู้ใช้เจอ 2026-08-14):
     ของเดิมใช้ `garden.watered` ก้อนเดียว ⇒ รดแปลงเก่าไปแล้ว พอปลูกแปลงใหม่วันเดียวกัน
     แปลงใหม่จะรดไม่ได้เลยทั้งที่ยังไม่เคยรด ⇒ ต้องรอข้ามวันโดยไม่มีเหตุผล
     ⇒ เก็บวันที่รดล่าสุดไว้ที่ตัวแปลงเอง (`sl.wd`) */
  function bedAction(i){
    const sl = slotAt(i);
    if(!sl) return 'plant';
    if(sl.stage >= growMax(sl.seed)) return 'harvest';
    return (sl.wd === dayKey()) ? 'wait' : 'water';
  }
  /* ---------- คลังเมล็ด / คลังผลผลิต ---------- */
  function seedCount(id){ return ((P && P.garden.seeds) || {})[id] | 0; }
  function seedTotal(){ return SEEDS.reduce((a, sd) => a + seedCount(sd.id), 0); }
  function cropCount(id){ return ((P && P.garden.crop) || {})[id] | 0; }
  function addSeed(id, n){
    if(!P) return;
    P.garden.seeds = Object.assign({}, P.garden.seeds);
    P.garden.seeds[id] = Math.max(0, seedCount(id) + n);
    persist();
  }
  const BED_ICON = {plant:'seed', water:'water', harvest:'harvest'};

  function gardenPlant(i, seedId){
    const w = W();
    if(!P) return false;
    const n = beds().length;
    if(!n){ w.toast(ICO('ui-garden', '🌱'), 'ไม่มีแปลงผักในบริเวณบ้านแล้ว ลองหยิบกลับมาวางในโหมดตกแต่งนะ'); return false; }
    if(i == null) i = [...Array(n).keys()].find(k => !slotAt(k));
    if(i == null){ w.toast(ICO('ui-garden', '🌱'), 'ปลูกครบทุกแปลงแล้ว รดน้ำรอให้โตก่อนนะ'); return false; }
    if(slotAt(i)){ w.toast(ICO('ui-garden', '🌱'), 'แปลงนี้มีต้นไม้อยู่แล้วนะ'); return false; }
    /* ⚠ **ต้องมีเมล็ดในคลังก่อนถึงจะปลูกได้** (ผู้ใช้สั่ง 2026-08-13) — ซื้อกี่เม็ดปลูกได้เท่านั้น
       ⚠ ไม่ใช่ dead end: เมล็ดถูกสุด 6 🪙 ซึ่งเด็กหาได้จากเควสต์ชุดเดียว และร้านบอกทางไว้ชัด */
    const kinds = SEEDS.filter(x => seedCount(x.id) > 0);
    if(!kinds.length){
      w.toast(ICO('ui-seedbag', '🌰'), 'ยังไม่มีเมล็ดพันธุ์เลย ไปซื้อที่ร้านต้นไม้ก่อนนะ');
      return false;
    }
    /* ⚠ **มีเมล็ดหลายพันธุ์ต้องให้เด็กเลือกเอง** (ผู้ใช้แจ้ง 2026-08-14 ว่าเลือกไม่ได้)
       มีพันธุ์เดียว = ปลูกเลย ไม่ต้องถาม (อย่าให้เด็กกดเกินจำเป็น) */
    if(seedId == null){
      if(kinds.length === 1) seedId = kinds[0].id;
      else { seedPick(i, kinds); return false; }
    }
    if(seedCount(seedId) <= 0){
      w.toast(ICO('ui-seedbag', '🌰'), 'เมล็ดพันธุ์นี้หมดแล้ว ไปซื้อเพิ่มที่ร้านต้นไม้นะ');
      return false;
    }
    const sd = seedById(seedId);
    addSeed(sd.id, -1);
    setSlot(i, {seed: sd.id, stage: 0, wd: ''});
    persist(); gardenBuild(); renderPanel();
    if(typeof playCorrect === 'function') playCorrect();
    gardenFx(i, 'plant', sd);
    actPose('plant', 1250, i);
    w.toast(ICO('seed-' + sd.id, sd.e), 'ปลูก' + sd.n + 'แล้ว! อย่าลืมมารดน้ำทุกวันนะ');
    return true;
  }
  /* หน้าต่างเลือกเมล็ด — ใช้แผงเดียวกับรายการกิจกรรม (เด็กไม่ต้องเรียนรู้หน้าตาใหม่) */
  function seedPick(i, kinds){
    const el = $('house-seedpick'), list = $('house-seedpick-list');
    if(!el || !list) return;
    list.innerHTML = '';
    kinds.forEach(sd=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hsp-item';
      b.innerHTML = '<span class="hsp-e">' + ICO('seed-' + sd.id, sd.e, 26) + '</span>'
        + '<span class="hsp-tx"><b>' + sd.n + '</b><i>รดน้ำ ' + sd.days + ' วัน · ขายได้ ' + sd.pay + '</i></span>'
        + '<span class="hsp-n">×' + seedCount(sd.id) + '</span>';
      b.onclick = ()=>{
        if(typeof playClick === 'function') playClick();
        el.hidden = true;
        gardenPlant(i, sd.id);
      };
      list.appendChild(b);
    });
    el.hidden = false;
  }
  function seedPickClose(){ const el = $('house-seedpick'); if(el) el.hidden = true; }

  /* ---------- อนิเมชันตอนปลูก / รดน้ำ / เก็บ (ผู้ใช้สั่ง 2026-08-14) ----------
     อนุภาคเล็กๆ ลอยขึ้นเหนือแปลง แล้วหายไปเอง — บอกเด็กว่า "สิ่งที่กดมีผลจริง"
     ⚠ อายุสั้น (~0.9 วิ) และไม่กันการกดต่อ ไม่ใช่ cutscene ที่ต้องรอ */
  /* ---------- อนุภาคบอกผลของการกระทำ (ปลูก / รดน้ำ / เก็บ / ตกปลา) ----------
     ⚠ ผู้ใช้แจ้ง 2026-08-14 ว่า "ยังไม่เห็นอนิเมชันเลย" — ของเดิมเล็กเกิน (r .05-.07)
       สั้นเกิน (.9 วิ) และเกิดที่ระดับพื้นซึ่งโดนต้นไม้/แปลงบัง
     ⇒ ทำใหม่: ชิ้นใหญ่ขึ้น 2 เท่า · อยู่นานขึ้น (1.6 วิ) · เริ่มสูงเหนือของ · พุ่งออกเป็นวงแล้วตก
       และแขวนไว้ที่ `scene` (spawnFx) เพื่อไม่ให้ของฉากบัง
     📌 **กติกาที่ผู้ใช้สั่งไว้ 2026-08-14: ระบบใหม่ทุกอย่างต้องมีอนิเมชันบอกผลเสมอ** */
  let gfx = [];
  const FX_LIFE = 1.6;
  function spawnFx(pos, opt){
    const w = W(); if(!w) return;
    const k = w.kit();
    const g = new THREE.Group();
    const n = opt.n || 9;
    for(let j = 0; j < n; j++){
      const p = opt.shape === 'drop'
        ? k.sphere(.085, opt.col, 8)
        : k.sphere(.11, j % 2 ? opt.col : (opt.col2 || opt.col), 8);
      if(opt.shape === 'drop') p.scale.set(.75, 1.5, .75);
      const a = j / n * Math.PI * 2;
      const rr = .12 + Math.random() * .2;
      p.position.set(Math.sin(a) * rr, .1 + Math.random() * .2, Math.cos(a) * rr);
      p.userData.vx = Math.sin(a) * (.5 + Math.random() * .5);
      p.userData.vz = Math.cos(a) * (.5 + Math.random() * .5);
      p.userData.vy = opt.up ? (1.5 + Math.random() * .9) : (-.2 - Math.random() * .5);
      g.add(p);
    }
    g.position.set(pos.x, pos.y + (opt.h || .9), pos.z);
    w.spawnFx(g);
    gfx.push({g, t:0, up:!!opt.up});
  }
  /* ท่าทางของเด็กตอนทำสวน — **ต้องหันหน้าเข้าหาแปลงก่อนเสมอ** ไม่งั้นเด็กก้มปลูกใส่อากาศ
     ด้านหลังแปลง (เด็กเดินมาจากทางไหนก็หันค้างอยู่ทางนั้น) · `i` = แปลงที่กำลังทำ */
  function actPose(kind, ms, i){
    const w = W(); if(!w || !w.pose) return;
    const bed = (i != null) ? beds()[i] : null;
    if(bed && w.faceTo) w.faceTo(bed.x, bed.z);
    w.pose(kind, ms);
  }
  function gardenFx(i, kind, sd){
    const w = W(); if(!w) return;
    const bed = beds()[i]; if(!bed) return;
    const pos = {x:w.wx(bed.x), y:w.groundY(bed.x, bed.z), z:w.wz(bed.z)};
    if(kind === 'water')        spawnFx(pos, {col:0x4fc3f7, col2:0xb3e5fc, shape:'drop', up:false, h:1.5, n:11});
    else if(kind === 'harvest') spawnFx(pos, {col:(sd && sd.col) || 0xf3c53f, col2:0xfff3b0, up:true, h:.7, n:10});
    else                        spawnFx(pos, {col:0x8d6e63, col2:0xc8a27a, up:true, h:.6, n:8});
  }
  function updateGardenFx(dt){
    for(let i = gfx.length - 1; i >= 0; i--){
      const f = gfx[i];
      f.t += dt;
      f.g.children.forEach(p=>{
        p.position.x += (p.userData.vx || 0) * dt;
        p.position.z += (p.userData.vz || 0) * dt;
        p.userData.vy = (p.userData.vy || 0) - 3.4 * dt;      /* แรงโน้มถ่วง — ตกลงเป็นเส้นโค้ง */
        p.position.y += p.userData.vy * dt;
      });
      const k2 = f.t / FX_LIFE;
      f.g.scale.setScalar(Math.max(.01, 1 - k2 * k2));         /* หดช้าตอนต้น เห็นชัดกว่าเดิม */
      if(f.t > FX_LIFE){ W().despawn(f.g); gfx.splice(i, 1); }
    }
  }
  function gardenFxClear(){ const w = W(); gfx.forEach(f => { if(w) w.despawn(f.g); }); gfx = []; }

  function gardenWater(i){
    const w = W();
    if(!P) return false;
    /* รดได้เฉพาะแปลงที่ยังไม่โตเต็ม **และยังไม่ได้รดวันนี้** */
    const all = beds().map((_, k) => k).filter(k => { const s = slotAt(k); return s && s.stage < growMax(s.seed); });
    const growing = (i != null && all.indexOf(i) >= 0) ? [i] : all.filter(k => slotAt(k).wd !== dayKey());
    if(!all.length){ w.toast(ICO('ui-garden', '🌱'), 'ยังไม่มีต้นไม้ให้รดน้ำเลย ลองปลูกดูสิ'); return false; }
    if(!growing.length || (i != null && slotAt(i).wd === dayKey())){
      w.toast(ICO('ui-water', '💧'), 'แปลงนี้รดน้ำไปแล้ววันนี้ พรุ่งนี้ค่อยมารดใหม่นะ');
      return false;
    }
    growing.forEach(k => { const s = slotAt(k); setSlot(k, {seed:s.seed, stage:s.stage + 1, wd:dayKey()}); });
    persist(); gardenBuild(); renderPanel();
    if(typeof playCorrect === 'function') playCorrect();
    growing.forEach(k2 => gardenFx(k2, 'water'));
    /* 🌱 เควสต์ "รดน้ำแปลงผัก" — นับตามจำนวนแปลงที่รดได้จริงในครั้งนี้ */
    if(w.questCaught) growing.forEach(()=> w.questCaught('water', ''));
    actPose('water', 1500, growing[0]);
    w.toast(ICO('ui-water', '💧'), 'รดน้ำแล้ว! ต้นไม้โตขึ้นอีกขั้น ' + growing.length + ' ต้น');
    return true;
  }
  function gardenHarvest(i){
    const w = W();
    if(!P) return false;
    const ripe = beds().map((_, k) => k).filter(k => { const s = slotAt(k); return s && s.stage >= growMax(s.seed); });
    const take = (i != null && ripe.indexOf(i) >= 0) ? [i] : ripe;
    if(!take.length){ w.toast(ICO('ui-garden', '🌱'), 'ยังไม่มีต้นไหนโตพอเก็บเลย รดน้ำอีกสักวันนะ'); return false; }
    /* ⚠ **เก็บแล้วยังไม่ได้เงินทันที** — ผลผลิตเข้าตะกร้าก่อน แล้วเอาไปขายที่ร้านต้นไม้
       (ผู้ใช้สั่ง 2026-08-13) ⇒ เด็กได้เรียนรู้วงจร ปลูก → เก็บ → เอาไปขาย จริงๆ
       และเอาไปทำเควสต์ของพ่อแม่ได้ด้วย */
    P.garden.crop = Object.assign({}, P.garden.crop);
    take.forEach(k => {
      const s = slotAt(k);
      P.garden.crop[s.seed] = (P.garden.crop[s.seed] | 0) + 1;
      /* 📔 เฟส 16: พันธุ์ที่ปลูกจนโตแล้วเก็บได้ = จดลงสมุดสะสม (ชนิดใหม่จะขึ้น toast ให้เอง) */
      if(window.HouseBook) window.HouseBook.mark('crop', s.seed);
      gardenFx(k, 'harvest', seedById(s.seed));
      setSlot(k, null);
    });
    actPose('harvest', 1400, take[0]);        /* ⚠ นอกลูป — อยู่ในลูปจะรีสตาร์ตท่าทุกแปลงที่เก็บ */
    persist(); gardenBuild(); renderPanel();
    if(typeof playCongrats === 'function') playCongrats();
    w.toast(ICO('ui-basket', '🧺'), 'เก็บผักได้ ' + take.length + ' ต้น! เอาไปขายที่ร้านต้นไม้ได้เลย');
    return true;
  }
  /* ---------- ทรงต้นผักแยกตามพันธุ์ (ผู้ใช้สั่ง 2026-08-14) ----------
     ⚠ **ต้องดูออกจากเงารวมว่าแปลงไหนปลูกอะไร** ไม่ใช่ต่างกันแค่สีลูก
       (บทเรียนเดียวกับไอคอนเฟส 8 และกลีบดอกไม้) */
  function buildCrop(g, k, sl){
    const sd = seedById(sl.seed);
    const st = sl.stage, full = growMax(sl.seed);
    if(st < 1){                                   /* ยังเป็นเมล็ดในดิน */
      const sb = k.sphere(.075, 0x6d4c41, 8); sb.position.y = .25; g.add(sb);
      return;
    }
    const p = Math.min(1, st / full);             /* ความคืบหน้าการโต 0-1 */
    const h = .18 + p * .34;
    if(sd.id === 'corn'){                         /* 🌽 ต้นสูง ใบยาวชี้ขึ้น */
      const stem = k.cyl(.05, .06, h * 1.5, 0x5aa84f, 8); stem.position.y = .22 + h * .75; g.add(stem);
      [-1, 1].forEach(sgn=>{
        const lf = k.sphere(.1, 0x76c46a, 8);
        lf.scale.set(.35, .2, 1.7); lf.position.set(sgn * .12, .3 + h, 0); lf.rotation.z = sgn * .5; g.add(lf);
      });
      if(st >= full){ const c = k.cyl(.08, .06, .26, sd.col, 8); c.position.set(.11, .55 + h, 0); g.add(c); }
      return;
    }
    if(sd.id === 'carrot'){                       /* 🥕 พุ่มใบฝอยเตี้ย + หัวโผล่ดิน */
      for(let j = 0; j < 5; j++){
        const lf = k.cyl(.02, .03, h, 0x76c46a, 6);
        const a = j / 5 * Math.PI * 2;
        lf.position.set(Math.sin(a) * .09, .22 + h / 2, Math.cos(a) * .09);
        lf.rotation.z = Math.sin(a) * .35; lf.rotation.x = Math.cos(a) * .35; g.add(lf);
      }
      if(st >= full){ const c = k.cone ? k.cone(.09, .2, sd.col, 8) : k.cyl(.09, .02, .2, sd.col, 8);
        c.position.y = .3; c.rotation.x = Math.PI; g.add(c); }
      return;
    }
    if(sd.id === 'lettuce'){                      /* 🥬 กอใบซ้อนเป็นชั้นเตี้ยๆ */
      for(let j = 0; j < 3; j++){
        const lf = k.sphere(.16 - j * .03, j ? 0x8fd06c : 0x76c46a, 10);
        lf.scale.set(1.5, .3 + p * .2, 1.5); lf.position.y = .24 + j * .07 * (1 + p); g.add(lf);
      }
      return;
    }
    if(sd.id === 'tomato'){                       /* 🍅 ต้นพุ่มมีหลักค้ำ + ลูกกลมห้อย */
      const stem = k.cyl(.035, .045, h, 0x5aa84f, 8); stem.position.y = .22 + h / 2; g.add(stem);
      const pole = k.cyl(.022, .022, h * 1.25, 0xb98a52, 6); pole.position.set(.11, .22 + h * .62, 0); g.add(pole);
      const bush = k.sphere(.15, 0x76c46a, 10); bush.scale.set(1, .8, 1); bush.position.y = .26 + h; g.add(bush);
      if(st >= full) [[-.1, 0], [.09, .06]].forEach(([x, z])=>{
        const fr = k.sphere(.075, sd.col, 10); fr.position.set(x, .24 + h, z); g.add(fr); });
      return;
    }
    /* 🎃 ฟักทอง / 🍉 แตงโม — เถาเลื้อยแผ่กับดิน + ลูกใหญ่วางบนดิน */
    for(let j = 0; j < 4; j++){
      const vine = k.sphere(.12, 0x76c46a, 8);
      const a = j / 4 * Math.PI * 2 + .4;
      vine.scale.set(1.3, .22, .7);
      vine.position.set(Math.sin(a) * .18 * p, .21, Math.cos(a) * .18 * p);
      vine.rotation.y = a; g.add(vine);
    }
    if(st >= full){
      const fr = k.sphere(.2, sd.col, 12); fr.scale.set(1, .82, 1); fr.position.y = .34; g.add(fr);
      const st2 = k.cyl(.03, .03, .1, 0x5aa84f, 6); st2.position.y = .5; g.add(st2);
    }
  }
  /* ⚠ **ห้ามล้างอนุภาคตรงนี้** — `gardenBuild()` เรียก `gardenClear()` ทุกครั้งที่ปลูก/รดน้ำ/เก็บ
     ถ้าล้างด้วย อนุภาคที่เพิ่งสร้างจะถูกลบทิ้งในเฟรมเดียวกัน ⇒ **เด็กไม่เห็นอนิเมชันเลย**
     (ผู้ใช้แจ้ง 2026-08-14 ว่ายังไม่เห็น — นี่คือต้นเหตุจริง) · อนุภาคหายเองเมื่อหมดอายุ
     ส่วนการล้างทิ้งทำที่ `clearAll()` ตอนออกจากบ้าน/สลับฉากเท่านั้น */
  function gardenClear(){ const w = W(); gardenObjs.forEach(o => { if(w) w.despawn(o); }); gardenObjs = []; }
  /* วาด "ต้นพืช + ป้ายบอกสิ่งที่ทำได้" ทับบนเบาะดินที่เป็นเฟอร์นิเจอร์จริง
     ⚠ ตัวเบาะดินไม่ได้วาดที่นี่ (เป็น decor `veg-plot`) — ที่นี่วาดเฉพาะของที่เปลี่ยนตามสถานะ */
  function gardenBuild(){
    const w = W(); if(!w || !P) return;
    gardenClear();
    const k = w.kit();
    beds().forEach((bed, i)=>{
      const sl = slotAt(i);
      const g = new THREE.Group();
      if(sl){ buildCrop(g, k, sl); k.merge(g); }
      /* ป้ายลอยบอกว่าแตะแล้วจะเกิดอะไร
         ⚠ **ไม่มีอะไรให้ทำ = ไม่ต้องมีป้าย** (ผู้ใช้สั่ง 2026-08-14) — ป้ายที่กดแล้วไม่เกิดอะไร
           ทำให้เด็กเดินไปกดเก้อ และรกสายตาเมื่อมีหลายแปลง */
      const act = bedAction(i);
      let b = null;
      if(act !== 'wait'){
        b = makeBubble(BED_ICON[act] || 'seed');
        b.position.y = 1.25;
        g.add(b);
      }
      g.userData.bubble = b;
      g.position.set(w.wx(bed.x), w.groundY(bed.x, bed.z), w.wz(bed.z));
      g.userData.hPick = {game:'garden', i:i, x:bed.x, z:bed.z};
      w.spawn(g);
      gardenObjs.push(g);
    });
  }


  /* ============================================================
     แผง "เล่นในเมือง" — ประตูเดียวที่เด็กเข้าถึงทั้ง 5 เกม
     ⚠ ตั้งใจให้เป็น **ปุ่มเดียว + แผงเดียว** ไม่ใช่ 5 ทางเข้ากระจาย — HUD ในโหมดบ้านต้องแน่น
       (กติกาที่ล็อกไว้ 2026-08-09: ทุกชิ้นลอยทับโลก 3D ที่เด็กกำลังเล่นอยู่)
     ============================================================ */
  function panelOpen(){ const e = $('house-playpanel'); return !!e && !e.hidden; }
  function openPanel(){
    const w = W();
    if(!w || w.mode() !== 'world' || w.editing()) return;
    if(window.HouseShop) window.HouseShop.close();
    if(window.HouseQuestUI) window.HouseQuestUI.close();
    if(window.HouseQB) window.HouseQB.close();
    if(window.HouseDev) window.HouseDev.close();
    if(window.HouseBook) window.HouseBook.close();
    const e = $('house-playpanel'); if(!e) return;
    e.hidden = false;
    renderPanel();
  }
  function closePanel(){ const e = $('house-playpanel'); if(e) e.hidden = true; }

  function row(icon, title, sub, btns){
    const d = document.createElement('div');
    d.className = 'hpl-row';
    const ic = document.createElement('span'); ic.className = 'hpl-ic';
    /* ไอคอนเป็น SVG (ขึ้นต้น `<svg`) หรือ emoji ก็ได้ — ของเก่ายังส่ง emoji มาได้เหมือนเดิม */
    if(typeof icon === 'string' && icon.slice(0, 4) === '<svg') ic.innerHTML = icon;
    else ic.textContent = icon;
    const tx = document.createElement('span'); tx.className = 'hpl-tx';
    const t1 = document.createElement('span'); t1.className = 'hpl-name'; t1.textContent = title;
    const t2 = document.createElement('span'); t2.className = 'hpl-sub'; t2.textContent = sub;
    tx.appendChild(t1); tx.appendChild(t2);
    d.appendChild(ic); d.appendChild(tx);
    const bw = document.createElement('span'); bw.className = 'hpl-btns';
    (btns || []).forEach(b=>{
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'hpl-btn' + (b.alt ? ' hpl-btn-alt' : '');
      /* 🎨 ไอคอนบนปุ่มเป็น SVG (กฎถาวร: อะไรที่ต้องมีไอคอนให้วาดเป็น SVG)
         ⚠ ใส่ผ่าน element ของตัวเอง แล้วชื่อปุ่มเป็น text node เสมอ — ห้ามต่อเข้า innerHTML รวมกัน */
      if(b.ico){
        el.classList.add('hpl-btn-ico');
        const ic = document.createElement('span');
        ic.className = 'hpl-btn-ic';
        ic.innerHTML = ICO(b.ico, '', 20);
        el.appendChild(ic);
      }
      el.appendChild(document.createTextNode(b.label));
      if(b.id) el.id = b.id;
      if(b.off) el.disabled = true;
      else el.onclick = ()=>{ if(typeof playClick === 'function') playClick(); b.fn(); };
      bw.appendChild(el);
    });
    d.appendChild(bw);
    return d;
  }
  /* รูปตัวอย่าง "หน้าตาเพื่อนที่ไปแอบ" (ผู้ใช้สั่ง 2026-08-13) — เด็กจะได้รู้ว่ากำลังมองหาอะไร
     ⚠ สี/ทรงต้องตรงกับตัวจริงใน 3D เป๊ะ (ใช้ชุดสีเดียวกับ seekKid) ไม่งั้นยิ่งทำให้หลง
     คนที่เจอแล้วขึ้นเครื่องหมายถูกทับ เด็กจะได้เห็นว่าเหลือใครบ้าง */
  const SEEK_SHIRT = ['#7ec4f5', '#f7a8c8', '#9ee29a', '#ffd166', '#c4a8f5'];
  const SEEK_SKIN  = ['#f7d3ae', '#e8bb90', '#d6a678'];
  const SEEK_HAIR  = ['#4a3327', '#6b4a2f', '#2f2320'];
  function seekFaces(sample){
    const wrap = document.createElement('span');
    wrap.className = 'hpl-faces';
    const n = sample ? 3 : (P.seek.spots || []).length;
    for(let i = 0; i < n; i++){
      const found = !sample && P.seek.found.indexOf(i) >= 0;
      const d = document.createElement('span');
      d.className = 'hpl-face' + (found ? ' found' : '');
      d.innerHTML = '<svg viewBox="0 0 36 36" aria-hidden="true">'
        + '<path d="M10 34v-9a8 8 0 0 1 16 0v9z" fill="' + SEEK_SHIRT[i % 5] + '"/>'
        + '<circle cx="18" cy="15" r="8.6" fill="' + SEEK_SKIN[i % 3] + '"/>'
        + '<path d="M9.4 13.5a8.6 8.6 0 0 1 17.2 0z" fill="' + SEEK_HAIR[i % 3] + '"/>'
        + '<circle cx="15" cy="16" r="1.5" fill="#3b2a1d"/><circle cx="21" cy="16" r="1.5" fill="#3b2a1d"/>'
        + '</svg>' + (found ? '<i class="hpl-face-ok">✓</i>' : '');
      wrap.appendChild(d);
    }
    return wrap;
  }
  function renderPanel(){
    const list = $('hpl-list');
    if(!list || !panelOpen() || !P) return;
    list.innerHTML = '';
    const th = colTheme();

    /* 🙈 ซ่อนแอบ */
    if(P.seek.done){
      list.appendChild(row(ICO('ui-seek', '🙈'), 'ซ่อนแอบกับเพื่อนบ้าน', 'วันนี้เล่นครบแล้ว พรุ่งนี้เพื่อนจะมาแอบใหม่นะ', []));
    }else if(P.seek.on){
      const h = seekHint();
      const r = row(ICO('ui-seek', '🙈'), 'ซ่อนแอบกับเพื่อนบ้าน',
        'เจอแล้ว ' + P.seek.found.length + '/' + P.seek.spots.length + ' คน · ' + (h ? h.text : ''),
        [{label:'พักก่อน', alt:true, id:'hpl-seek-pause', fn: seekPause}]);
      r.insertBefore(seekFaces(), r.querySelector('.hpl-btns'));
      list.appendChild(r);
    }else if(seekPaused()){
      const r = row(ICO('ui-seek', '🙈'), 'ซ่อนแอบกับเพื่อนบ้าน',
        'พักอยู่ · เจอแล้ว ' + P.seek.found.length + '/' + P.seek.spots.length + ' คน เพื่อนยังแอบที่เดิม',
        [{label:'เล่นต่อ', id:'hpl-seek-resume', fn: ()=>{ if(seekResume()) closePanel(); }}]);
      r.insertBefore(seekFaces(), r.querySelector('.hpl-btns'));
      list.appendChild(r);
    }else{
      const r = row(ICO('ui-seek', '🙈'), 'ซ่อนแอบกับเพื่อนบ้าน', 'เพื่อนจะไปแอบในเมือง เดินไปหาให้เจอทุกคน',
        [{label:'เริ่มเล่น', id:'hpl-seek', fn: ()=>{
          if(seekStart()){ closePanel(); W().toast(ICO('ui-seek', '🙈'), 'เพื่อนไปแอบแล้ว! ออกไปหาให้เจอนะ'); }
          else W().toast(ICO('ui-seek', '🙈'), 'วันนี้เล่นไปแล้ว พรุ่งนี้มาใหม่นะ');
        }}]);
      r.insertBefore(seekFaces(true), r.querySelector('.hpl-btns'));
      list.appendChild(r);
    }

    /* 🍃 เก็บของประจำวัน
       🧭 **ปุ่มนำทาง** (ผู้ใช้สั่ง 2026-08-22) — ของกระจายทั่วเมือง เด็กหาเองไม่เจอจนเลิกเล่น
       ⚠ เป็นสวิตช์ที่ **เด็กกดเปิด/ปิดเอง** ไม่ใช่ลูกศรที่โผล่เอง (กติกา 2026-08-16 ยังอยู่ครบ)
          และดับเองเมื่อเก็บครบ ⇒ ไม่มีทางค้างรบกวนทั้งวัน */
    const colLeftN = (P.col.items || []).length - (P.col.got || []).length;
    const guiding = !!(W() && W().guidingCollect && W().guidingCollect());
    const colBtns = colLeftN > 0 ? [{
      label: guiding ? 'พอแล้ว' : 'พาไปเก็บ', ico: 'ui-compass', alt: guiding,
      fn: ()=>{ if(W() && W().guideCollect){ W().guideCollect(!guiding); renderPanel(); } }
    }] : [];
    list.appendChild(row(ICO('col-' + th.id, th.emoji), 'เก็บ' + th.name + 'ทั่วเมือง',
      'วันนี้เก็บแล้ว ' + P.col.got.length + '/' + (P.col.items.length || COL_N)
      + ' ชิ้น · สะสมครบมา ' + (P.col.sets | 0) + ' วัน'
      + (colLeftN > 0 ? ' · กดปุ่มแล้วจะมีลูกศรชี้ทางไปชิ้นที่ใกล้ที่สุดให้' : ''), colBtns));

    /* 🎣 ตกปลา */
    let fishSub = 'สมุดปลา ' + ((P.fish.book || []).length) + '/' + FISH.length
                  + ' ชนิด · วันนี้ได้ ' + (P.fish.today | 0) + ' ตัว';
    /* 🐟 บอกตรงๆ ว่าทำไมวันนี้ปลาหายากเริ่มไม่ติดเบ็ด — ไม่งั้นเด็กนึกว่าเกมพัง
       (โทนเป็น "ปลาไปพักแล้ว" ไม่ใช่ "หนูเล่นเยอะเกินไป" — ห้ามทำให้รู้สึกถูกดุ) */
    if(fishTired() > 0) fishSub += ' · วันนี้ปลาตัวใหญ่ๆ ไปพักกันหมดแล้ว พรุ่งนี้ค่อยมาใหม่นะ';
    /* ⚠ **ไม่มีปุ่มลงมือทำในแผงนี้แล้ว** (ผู้ใช้สั่ง 2026-08-14) — แผงนี้ทำหน้าที่ "บอกว่าวันนี้มีอะไรให้ทำ"
       อย่างเดียว ส่วนการลงมือให้เด็กออกไปแตะของจริงในเมือง (ป้ายลอย 🎣/🌱 · ปุ่มกล้องมุมขวาบน)
       เหตุผล: ถ้ากดจากแผงได้หมด เด็กจะไม่ได้ออกไปเดินเล่นในเมืองเลย ซึ่งขัดเจตนาของกลุ่ม A */
    list.appendChild(row(ICO('ui-fishing', '🎣'), 'ตกปลา',
      fishState
        ? (fishState.phase === 'bite' ? '‼️ ทุ่นจมแล้ว! รีบแตะทุ่นเลย!' : 'กำลังตกอยู่ · รอทุ่นจม…')
        : (fishSub + ' · มีจุดตกปลาที่บ่อน้ำใหญ่กับริมทะเล มองหาป้ายรูปเบ็ดตกปลาแล้วแตะได้เลย'), []));

    /* 📷 ช่างภาพ
       ⚠ ต้องบอกให้ชัดว่า **ถ่ายที่ไหนก็ได้** ไม่งั้นเด็กยังนึกว่าต้องเดินไปจุดนั้นก่อนถึงจะกดได้
       ⚠ **บอกรายละเอียดจุดของวันนี้ด้วย** (ผู้ใช้สั่ง 2026-08-18) — ของเดิมบอกแค่ hint บรรทัดเดียว
         เด็กเลยไม่รู้ว่าต้องไปตรงไหนและถึงหรือยัง ⇒ เพิ่ม "วันนี้อยากได้รูปที่…" + "ตอนนี้หนูอยู่…"
         โดยอ่านจาก `photoSpotOk()` ตัวเดียวกับที่ใช้ตัดสินตอนกดชัตเตอร์ — ข้อความกับผลจึงตรงกันเสมอ */
    const po = photoOrder();
    /* กันพังตอนเปิดแผงจากในบ้าน/ก่อนแผนที่พร้อม — แผงกิจกรรมห้ามล้มเพราะบรรทัดบอกทาง */
    let atSpot = false, here = '';
    try{ atSpot = photoSpotOk(); here = (W().zoneName(W().tile().x, W().tile().z) || '').trim(); }
    catch(e){ atSpot = false; here = ''; }
    const status = P.photo.done ? '✓ ใบสั่งวันนี้สำเร็จแล้ว ถ่ายเก็บเพิ่มได้อีกตามใจเลย'
      : atSpot ? '✓ ตอนนี้หนูยืนตรงจุดแล้ว! กดปุ่มกล้องมุมขวาบนได้เลย'
      : 'ตอนนี้หนูอยู่' + (here ? 'ที่ ' + here : 'ไกลจากจุดนั้น') + ' · ' + po.look;
    list.appendChild(row(ICO('ui-camera', '📷'), po.name,
      'วันนี้อยากได้รูปที่ ' + po.where + ' · ' + status
      + ' · ถ่ายมุมไหนก็ได้นะ เก็บเข้าอัลบั้มให้ทุกใบ (ใบสั่งจะติ๊กเองเมื่อถ่ายตรงจุด)'
      + ' · อัลบั้ม ' + ((P.photo.shots || []).length) + '/' + PHOTO_MAX, []));

    /* 🌱 แปลงผัก — แตะที่แปลงในเมืองได้เลย ปุ่มในแผงเป็นทางลัดสำรอง */
    const nb = beds().length;
    const growing = beds().map((_, i) => slotAt(i)).filter(Boolean);
    const ripe = growing.filter(x => x.stage >= GROW_MAX).length;
    list.appendChild(row(ICO('ui-garden', '🌱'), 'แปลงผักหน้าบ้าน',
      nb ? ('มี ' + nb + ' แปลง · ปลูกแล้ว ' + growing.length + ' · โตพร้อมเก็บ ' + ripe
            + ' · เมล็ดในกระเป๋า ' + seedTotal() + ' เม็ด · แตะที่แปลงหน้าบ้านได้เลย (ดูป้ายเหนือแปลง)')
         : 'ไม่มีแปลงผักในบริเวณบ้าน ลองหยิบกลับมาวางในโหมดตกแต่งนะ', []));

    /* 📔 สมุดสะสม (เฟส 16) — ทางเข้าเดียวของสมุด อยู่ท้ายแผงเพราะไม่ใช่ "กิจกรรมของวันนี้"
       แต่เป็นภาพรวมของทุกอย่างที่เด็กสะสมมา */
    if(window.HouseBook){
      const bc = window.HouseBook.counts();
      list.appendChild(row(ICO('ui-book', '📔'), 'สมุดสะสมของหนู',
        'เก็บได้แล้ว ' + bc.total.got + '/' + bc.total.total + ' ช่อง · ปลา ' + bc.fish.got
        + ' · พืช ' + bc.crop.got + ' · สัตว์ ' + bc.critter.got + ' · ท่าน้อง ' + bc.trick.got
        + ' · รูป ' + bc.photo.got,
        [{label:'เปิดสมุด', id:'hpl-book', fn: ()=>{ closePanel(); window.HouseBook.open(); }}]));
    }
  }

  /* ============================================================
     🛒 ซื้อ-ขายที่ร้าน (ผู้ใช้สั่ง 2026-08-13)
     ร้านต้นไม้: ซื้อเมล็ดพันธุ์ + ขายผักที่ปลูกเอง · ร้านสะดวกซื้อ: ขายปลาที่ตกได้
     ⚠ **เนื้อในวาดที่นี่ ไม่ใช่ที่ house-shop.js** — ไฟล์ร้านค้าไม่ต้องรู้จักเมล็ด/ปลาเลย
       (ประตูเดียวคือ tradeAvailable/tradeLabel/tradeEmoji/renderTrade)
     ⚠ เงินเข้า-ออกผ่าน `OwlCoins` เหมือนร้านอื่นทุกประการ (ข้อ 5) */
  const TRADE = {
    seed: {label:'ซื้อเมล็ดพันธุ์', emoji:'🌰', ico:'ui-seedbag'},
    crop: {label:'ขายผักของหนู',   emoji:'🧺', ico:'ui-basket'},
    fish: {label:'ขายปลาที่ตกได้',  emoji:'🐟', ico:'ui-fishing'},
  };
  function tradeAvailable(kind){ return !!TRADE[kind]; }
  function tradeLabel(kind){ return (TRADE[kind] || {}).label || ''; }
  /* คืน **ไอคอน SVG** ถ้ามี (ไม่งั้น emoji เดิม) — ฝั่งร้านค้าใส่ลง innerHTML ได้ทั้งคู่ */
  function tradeEmoji(kind){ const t = TRADE[kind] || {}; return ICO(t.ico, t.emoji || '🛍️', 30); }

  function coinIcon(n){ return '<i class="hs-coin"></i>' + n; }
  function tradeCard(o){
    const d = document.createElement('div');
    d.className = 'hpt-row' + (o.dim ? ' dim' : '');
    d.innerHTML = '<span class="hpt-e">' + (o.ico ? ICO(o.ico, o.emoji, 30) : o.emoji) + '</span>'
      + '<span class="hpt-tx"><b>' + o.name + '</b><i>' + o.sub + '</i></span>'
      + '<span class="hpt-price">' + coinIcon(o.price) + '</span>';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hpl-btn' + (o.sell ? ' hpl-btn-alt' : '');
    b.textContent = o.btn;
    b.disabled = !!o.off;
    if(!o.off) b.onclick = ()=>{ if(typeof playClick === 'function') playClick(); o.fn(); };
    d.appendChild(b);
    return d;
  }
  function renderTrade(wrap, kind, redraw){
    if(!P) sync();
    if(!P) return;
    const coins = ()=> (window.OwlCoins ? window.OwlCoins.get() : 0);
    const done = ()=>{ persist(); gardenBuild(); renderPanel(); if(redraw) redraw(); };

    if(kind === 'seed'){
      const note = document.createElement('div');
      note.className = 'hpt-note';
      note.textContent = 'ซื้อกี่เม็ดก็ปลูกได้เท่านั้นนะ · เมล็ดที่แพงกว่าใช้เวลาปลูกนานกว่า แต่ขายได้ราคาดีกว่า';
      wrap.appendChild(note);
      SEEDS.forEach(sd=>{
        wrap.appendChild(tradeCard({
          emoji: sd.e, ico: 'seed-' + sd.id, name: sd.n + ' (' + GRADE_NAME[sd.grade] + ')',
          sub: 'รดน้ำ ' + sd.days + ' วันก็เก็บได้ · ขายได้ ' + sd.pay + ' บาท · มีอยู่ ' + seedCount(sd.id) + ' เม็ด',
          price: sd.cost, btn: 'ซื้อ 1 เม็ด', off: coins() < sd.cost,
          /* ⚠ ผู้ใช้แจ้ง 2026-08-14: กดซื้อแล้วกดซ้ำไม่ได้ ต้องไปกดที่อื่นก่อน
             ต้นเหตุ: `done()` วาดรายการใหม่ทั้งก้อน ปุ่มที่นิ้วยังจิ้มอยู่จึงถูกลบทิ้ง
             ⇒ เลื่อนการวาดใหม่ไปหลังจบ event ปัจจุบัน ปุ่มใหม่จะพร้อมรับคลิกถัดไปทันที */
          fn: ()=>{
            if(!window.OwlCoins || !window.OwlCoins.spend(sd.cost)){
              W().toast(ICO('ui-coin', '💰'), 'เงินยังไม่พอนะ เก็บเงินเพิ่มอีกนิดแล้วค่อยกลับมา!');
              return;
            }
            addSeed(sd.id, 1);
            W().toast(ICO('seed-' + sd.id, sd.e), 'ได้เมล็ด' + sd.n + ' 1 เม็ด! เอาไปปลูกที่แปลงหน้าบ้านได้เลย');
            setTimeout(done, 0);
          },
        }));
      });
      return;
    }

    if(kind === 'crop'){
      const have = SEEDS.filter(sd => cropCount(sd.id) > 0);
      if(!have.length){
        const e = document.createElement('div');
        e.className = 'hpt-note';
        e.textContent = 'ยังไม่มีผักให้ขายเลย ลองซื้อเมล็ดไปปลูกที่แปลงหน้าบ้านก่อนนะ';
        wrap.appendChild(e);
        return;
      }
      have.forEach(sd=>{
        const n = cropCount(sd.id);
        wrap.appendChild(tradeCard({
          emoji: sd.e, ico: 'seed-' + sd.id, name: sd.n, sell: true,
          sub: 'เก็บไว้ ' + n + ' ชิ้น · ขายได้ชิ้นละ ' + sd.pay + ' บาท',
          price: sd.pay * n, btn: 'ขายทั้งหมด',
          fn: ()=>{
            const got = sd.pay * n;
            P.garden.crop = Object.assign({}, P.garden.crop);
            P.garden.crop[sd.id] = 0;
            W().award(got);
            W().toast(ICO('ui-coin', '🪙'), 'ขาย' + sd.n + ' ' + n + ' ชิ้น ได้ ' + got + ' บาท!');
            W().refreshHud();
            setTimeout(done, 0);
          },
        }));
      });
      return;
    }

    if(kind === 'fish'){
      const bag = (P.fish.bag) || {};
      const have = FISH.filter(f => (bag[f.id] | 0) > 0);
      if(!have.length){
        const e = document.createElement('div');
        e.className = 'hpt-note';
        e.textContent = 'ยังไม่มีปลาให้ขายเลย ลองไปตกที่ท่าน้ำในบ่อหรือริมทะเลก่อนนะ';
        wrap.appendChild(e);
        return;
      }
      have.forEach(f=>{
        const n = bag[f.id] | 0;
        wrap.appendChild(tradeCard({
          emoji: f.e, ico: 'fish-' + f.id, name: f.n, sell: true,
          sub: (f.where === 'sea' ? 'ปลาทะเล' : 'ปลาน้ำจืด') + ' · '
             + ['', 'หาง่าย', 'หายาก', 'หายากมาก'][f.rare] + ' · มี ' + n + ' ตัว',
          price: f.pay * n, btn: 'ขายทั้งหมด',
          fn: ()=>{
            const got = f.pay * n;
            P.fish.bag = Object.assign({}, P.fish.bag);
            P.fish.bag[f.id] = 0;
            W().award(got);
            W().toast(ICO('ui-coin', '🪙'), 'ขาย' + f.n + ' ' + n + ' ตัว ได้ ' + got + ' บาท!');
            W().refreshHud();
            setTimeout(done, 0);
          },
        }));
      });
    }
  }

  /* ============================================================
     🧺 ตะกร้าของที่เก็บได้ (ผู้ใช้สั่ง 2026-08-14) — วางที่ x17/z37 หน้าบ้าน
     แตะแล้วดูว่าเก็บผัก/ปลาอะไรไว้บ้าง อย่างละกี่ชิ้น และขายได้ราคาเท่าไหร่
     ⚠ **ดูอย่างเดียว ขายจริงต้องไปที่ร้าน** (ผัก→ร้านต้นไม้ · ปลา→ร้านสะดวกซื้อ)
       เพื่อไม่ให้เด็กขายของได้จากหน้าบ้านโดยไม่ต้องออกไปไหนเลย
     ============================================================ */
  /* ⚠ ตัวตะกร้าเป็น **เฟอร์นิเจอร์จริง** (`sell-basket`) แล้ว ⇒ ที่นี่วาดแค่ป้ายลอยเหนือมัน
     ตำแหน่งอ่านจาก decor ทุกครั้ง ⇒ เด็กย้ายตะกร้าในโหมดตกแต่งแล้วป้ายตามไปเอง
     และเด็กยืนทับไม่ได้เพราะ decor บล็อกช่องเดินอยู่แล้ว (ผู้ใช้สั่ง 2026-08-14) */
  let basketObj = null;
  function basketTile(){ const w = W(); return w && w.basketTile ? w.basketTile() : null; }
  function basketBuild(){
    const w = W(); if(!w) return;
    basketClear();
    const t = basketTile();
    if(!t) return;                        /* เด็กลบตะกร้าทิ้ง = ไม่มีป้าย (หยิบกลับมาวางได้เสมอ) */
    const g = new THREE.Group();
    const b = makeBubble('basket'); b.position.y = 1.15; g.add(b);
    g.position.set(w.wx(t.x), w.groundY(t.x, t.z), w.wz(t.z));
    g.userData.hPick = {game:'basket', x:t.x, z:t.z};
    g.userData.bubble = b;
    w.spawn(g);
    basketObj = g;
  }
  function basketClear(){ const w = W(); if(basketObj && w) w.despawn(basketObj); basketObj = null; }
  function basketOpen(){
    const el = $('house-basket');
    if(!el || !P) return false;
    closePanel();
    el.hidden = false;
    renderBasket();
    return true;
  }
  function basketClose(){ const el = $('house-basket'); if(el) el.hidden = true; }
  function basketIsOpen(){ const e = $('house-basket'); return !!e && !e.hidden; }
  function renderBasket(){
    const list = $('house-basket-list'), sub = $('house-basket-sub');
    if(!list || !P) return;
    list.innerHTML = '';
    const rows = [];
    SEEDS.forEach(sd=>{ const n = cropCount(sd.id);
      if(n > 0) rows.push({e:sd.e, ico:'seed-' + sd.id, n:sd.n, cnt:n, pay:sd.pay, where:'ขายที่ร้านต้นไม้'}); });
    const bag = (P.fish.bag) || {};
    FISH.forEach(f=>{ const n = bag[f.id] | 0;
      if(n > 0) rows.push({e:f.e, ico:'fish-' + f.id, n:f.n, cnt:n, pay:f.pay, where:'ขายที่ร้านสะดวกซื้อ'}); });
    const total = rows.reduce((a, r) => a + r.pay * r.cnt, 0);
    if(sub) sub.textContent = rows.length
      ? ('ถ้าขายหมดจะได้ ' + total + ' บาท · เอาไปขายที่ร้านได้เลย')
      : 'ตะกร้ายังว่างอยู่ ลองไปปลูกผักหรือตกปลาดูสิ';
    rows.forEach(r=>{
      const d = document.createElement('div');
      d.className = 'hpt-row';
      d.innerHTML = '<span class="hpt-e">' + ICO(r.ico, r.e, 30) + '</span>'
        + '<span class="hpt-tx"><b>' + r.n + ' ×' + r.cnt + '</b><i>ชิ้นละ ' + r.pay + ' · ' + r.where + '</i></span>'
        + '<span class="hpt-price"><i class="hs-coin"></i>' + (r.pay * r.cnt) + '</span>';
      list.appendChild(d);
    });
  }

  /* 🗑️ **ระบบตู้ปลาถูกยกเลิกทั้งระบบ 2026-08-17 (ผู้ใช้สั่ง)**
     เดิม: แตะตู้ปลาในบ้าน → เปิด popup โชว์ปลาที่ตกได้ว่ายอยู่ข้างใน
     เหตุผลที่ถอด: popup ไม่เหมือนตู้ปลาจริง · ไอคอนปลากับอนิเมชันว่ายไม่สวย
     ⇒ ปลาที่ตกได้ไปอยู่ใน **สมุดสะสม (เฟส 16)** แทน — ดู QUEST-DESIGN.md ข้อ 57
     ⚠ **ห้ามเอา popup ตู้ปลากลับมา** — ตู้ปลายังเป็นเฟอร์นิเจอร์ตกแต่งได้ตามปกติ แตะแล้วเด้งเฉยๆ
       เหมือนของตกแต่งชิ้นอื่น (ถ้าจะให้แตะแล้วมีอะไรเกิดขึ้น ให้ไปทำที่เฟส 17 "ใช้งานของตกแต่ง") */

  /* ---------- แถบบอกระยะห่างตอนเล่นซ่อนแอบ ----------
     ผู้ใช้สั่ง 2026-08-13: **ย้ายมาไว้กลางล่างของจอ เว้นจากขอบขึ้นมา** และ **เขียนอธิบายให้ชัด
     ว่าแถบนี้คือระยะห่างจากเพื่อนที่แอบ** ไม่งั้นเด็กไม่รู้ว่าแถบนี้บอกอะไร
     ⚠ ห้ามใช้คำว่าร้อน/เย็นอีก (เด็กตีความเป็นอุณหภูมิ) — ใช้ "อยู่ใกล้/อยู่ไกล" ตรงๆ */
  let hintKey = '';
  function refreshHint(){
    const el = $('house-seek-hud');
    if(!el) return;
    const w = W();
    const on = !!(P && P.seek.on && w && w.mode() === 'world' && !w.editing() && w.scene() === 'out'
                  && !document.body.classList.contains('house-photo'));
    if(el.hidden === on) el.hidden = !on;
    if(!on){ hintKey = ''; return; }
    const h = seekHint();
    if(!h) return;
    const left = P.seek.spots.length - P.seek.found.length;
    const key = h.level + '/' + P.seek.found.length;
    if(key === hintKey) return;
    hintKey = key;
    /* หลอด 4 ขีด: ยิ่งใกล้ยิ่งเต็ม — เด็กที่อ่านไม่คล่องดูจากหลอดกับสีได้เลย */
    const bars = [0,1,2,3].map(i =>
      '<i class="hsk-seg' + (i <= h.level ? ' on' : '') + '"></i>').join('');
    el.innerHTML = '<span class="hsk-lab">ระยะห่างจากเพื่อนที่ใกล้ที่สุด</span>'
                 + '<span class="hsk-bar">' + bars + '</span>'
                 + '<span class="hsk-txt">' + h.text + '</span>'
                 + '<span class="hsk-left">เหลืออีก ' + left + ' คน</span>'
                 /* ⏸ ปุ่มพักอยู่ตรงนี้ด้วย (ผู้ใช้สั่ง 2026-08-17) — ของเดิมต้องเปิดแผง 🎈 ก่อน
                    ⚠ ตัวแถบเป็น `pointer-events:none` ปุ่มจึงต้องเปิดกลับเป็น `auto` เอง */
                 + '<button type="button" class="hsk-pause" id="hsk-pause-btn">⏸ พักก่อน</button>';
    el.className = 'house-seek-hud lv' + h.level;
    const pb = $('hsk-pause-btn');
    if(pb) pb.addEventListener('click', ()=>{
      if(typeof playClick === 'function') playClick();
      seekPause();
    });
  }

  /* ============================================================
     📷 โหมดถ่ายรูป (ผู้ใช้สั่ง 2026-08-13)
     ปุ่มกล้องอยู่ข้างปุ่มตั้งค่า → กดแล้ว **ซ่อน UI ตามมุมจอทั้งหมด** เหลือแต่กรอบโฟกัส 4 มุม
     กับปุ่มชัตเตอร์ ⇒ เด็กเห็นเมืองเต็มจอเหมือนเล็งกล้องจริง
     ⚠ ต้องซ่อน UI **ก่อน** สั่งวาดเฟรมที่จะถ่าย ไม่งั้นได้ภาพติดปุ่มไปด้วย
       (UI เป็น DOM ไม่ได้อยู่บน canvas จึงไม่ติดในภาพอยู่แล้ว — แต่ซ่อนเพื่อให้เด็ก "เห็นภาพที่จะได้")
     ============================================================ */
  function photoMode(){ return document.body.classList.contains('house-photo'); }
  function photoEnter(){
    const w = W();
    if(!w || w.mode() !== 'world' || w.editing()) return false;
    closePanel();
    if(window.HouseShop) window.HouseShop.close();
    if(window.HouseQuestUI) window.HouseQuestUI.close();
    document.body.classList.add('house-photo');
    const f = $('house-photo-ui'); if(f) f.hidden = false;
    w.toast(ICO('ui-camera', '📷'), photoOrder().hint);
    return true;
  }
  function photoExit(){
    document.body.classList.remove('house-photo');
    const f = $('house-photo-ui'); if(f) f.hidden = true;
    /* ออกจากโหมดกล้องแล้วอัลบั้ม/รูปใหญ่ต้องปิดตามไปด้วย (ผู้ใช้สั่ง 2026-08-14)
       ไม่งั้นเด็กกด ✕ แล้วยังมีหน้าต่างค้างบังจออยู่ */
    photoAlbumClose();
    return true;
  }

  /* ============================================================
     วงจรชีวิต + ตัวรับเหตุการณ์จาก house.js
     ============================================================ */
  let started = false, hintT = 0;

  function start(){
    const w = W(); if(!w) return;
    sync();
    if(!P) return;
    colEnsure();
    if(w.scene() === 'out') buildAll();
    started = true;
    renderPanel();
  }
  function buildAll(){
    if(P && P.seek.on) seekBuild();
    colBuild();
    gardenBuild();
    fishSpotsBuild();
    basketBuild();
  }
  function clearAll(){ seekClear(); colClear(); gardenClear(); gardenFxClear(); fishBobClear(); fishSpotsClear(); basketClear(); }
  function stop(){
    started = false;
    fishState = null;
    clearAll();
    closePanel();
    photoExit();
    photoAlbumClose();
    seedPickClose();
    basketClose();
    const el = $('house-seek-hud'); if(el) el.hidden = true;
  }
  function onScene(to){
    /* กลุ่ม A เล่นได้เฉพาะฉากนอกบ้าน — เข้าบ้านแล้วเก็บของทิ้ง ออกมาค่อยวางใหม่ */
    clearAll();
    fishState = null;
    if(to === 'out' && started) buildAll();
    renderPanel();
  }
  /* 🚶 **เดินผ่านของ = เก็บเลย ไม่ต้องแตะ** (ผู้ใช้สั่ง 2026-08-16)
     เด็กเล็กเล็งแตะของชิ้นเล็กๆ ในฉาก 3D ยาก ⇒ ให้เดินชนแล้วเก็บได้ด้วย
     ⚠ ยังแตะเก็บได้เหมือนเดิม (โหมดเล่นด้วยมือใช้การแตะ) — เพิ่มทางเก็บ ไม่ได้แทนที่
     ⚠ เช็คเฉพาะตอนเปลี่ยนช่อง ไม่ใช่ทุกเฟรม (ลูปนี้วิ่ง 60 ครั้ง/วินาที) */
  let lastWalkTile = '';
  function pickupUnderfoot(){
    const w = W(); if(!w || !P) return;
    if(w.scene() !== 'out' || w.mode() !== 'world' || w.editing()) return;
    const t2 = w.tile();
    const key = t2.x + ',' + t2.z;
    if(key === lastWalkTile) return;
    lastWalkTile = key;
    /* 🍃 ของประจำวัน */
    (P.col.items || []).forEach((it, i)=>{
      if((P.col.got || []).indexOf(i) >= 0) return;
      if(Math.abs(it.x - t2.x) <= 0 && Math.abs(it.z - t2.z) <= 0) colTake(i);
    });
    /* 🙈 ซ่อนแอบ — เดินชนคนที่แอบอยู่ก็เจอเลย */
    if(P.seek.on) (P.seek.spots || []).forEach((sp, i)=>{
      if((P.seek.found || []).indexOf(i) >= 0) return;
      if(Math.abs(sp.x - t2.x) <= 1 && Math.abs(sp.z - t2.z) <= 1) seekFind(i);
    });
  }
  function tick(dt, t){
    if(!started) return;
    if(seekIntro){ seekIntroTick(); }
    pickupUnderfoot();
    /* ของสะสมลอยขึ้นลง + หมุนช้าๆ ให้สะดุดตาแต่ไม่วูบวาบจนรบกวน */
    for(let i=0; i<colObjs.length; i++){
      const g = colObjs[i];
      g.position.y = (g.userData.baseY || 0) + .06 + Math.sin(t * .0028 + (g.userData.colPh || 0)) * .06;
      g.rotation.y += dt * .6;
    }
    for(let i=0; i<seekObjs.length; i++){
      const g = seekObjs[i];
      g.position.y = (g.userData.baseY || 0) + Math.abs(Math.sin(t * .0022 + (g.userData.seekPh || 0))) * .05;
    }
    /* จังหวะตกปลา — ทุ่นเด้ง แล้วจมตอนปลากิน */
    if(fishState){
      fishState.t -= dt;
      if(fishState.phase === 'wait' && fishState.t <= 0){
        fishState.phase = 'bite';
        fishState.t = 1.6;                 /* ช่วงที่ดึงทันคือ 1.6 วิ — กว้างพอสำหรับเด็ก 5 ขวบ */
        if(typeof playClick === 'function') playClick();
        W().toast('‼️', 'ทุ่นจมแล้ว! กด "ดึง!" เลย');
        renderPanel();
      }else if(fishState.phase === 'bite' && fishState.t <= 0){
        fishState = null; fishBobClear();
        W().toast(ICO('ui-fishing', '🐟'), 'ปลาว่ายหนีไปแล้ว ไม่เป็นไรนะ ลองใหม่ได้เลย');
        renderPanel();
      }
      /* ⚠ **ต้องเช็คซ้ำ** — สาขา "ปลาหนี" ข้างบนเคลียร์ `fishState` ทิ้งไปแล้วในเฟรมเดียวกัน
         ถ้าอ่านต่อจะ throw ทุกเฟรมที่ปลาหนี (เจอจากเทส 2026-08-14) */
      if(fishState && fishBob){
        const cs = fishBob.userData.cast;
        if(cs && cs.t < cs.dur){
          /* กำลังเหวี่ยง — พุ่งเป็นเส้นโค้งจากมือเด็กไปลงน้ำ */
          cs.t += dt;
          const p = Math.min(1, cs.t / cs.dur);
          fishBob.position.x = cs.from.x + (cs.to.x - cs.from.x) * p;
          fishBob.position.z = cs.from.z + (cs.to.z - cs.from.z) * p;
          fishBob.position.y = .5 + Math.sin(p * Math.PI) * 1.1 - p * .48;
          /* ทุ่นแตะน้ำ = น้ำกระเซ็น (บอกว่าเหวี่ยงถึงแล้ว) */
          if(p >= 1 && !cs.splash){
            cs.splash = true;
            spawnFx({x:cs.to.x, y:0, z:cs.to.z}, {col:0x8fd8f5, col2:0xffffff, up:true, h:.1, n:10});
          }
        }else{
          fishBob.position.y = fishState.phase === 'bite'
            ? -.12 + Math.sin(t * .02) * .04     /* ปลากินเหยื่อ = ทุ่นกระตุกถี่ๆ */
            : .02 + Math.sin(t * .004) * .05;
        }
      }
      /* วงคลื่น "เข้าใกล้ทุ่น" ตามเวลาที่เหลือก่อนปลากิน — เด็กดูแล้วรู้ว่าใกล้ได้แล้ว
         ⚠ เป็นการ "บอกใบ้" ไม่ใช่ตัวจับเวลากดดัน (ไม่มีตัวเลขนับถอยหลัง ไม่มีบทลงโทษ) */
      const sp = fishState && fishState.spot;
      if(sp && sp.obj){
        const near = fishState.phase === 'bite' ? 1
                   : 1 - Math.max(0, Math.min(1, fishState.t / (fishState.wait || 1)));
        (sp.obj.userData.rings || []).forEach((r, ri)=>{
          const k2 = ((t * .0006 + (r.userData.ph || 0)) % 1);
          const wide = 1.9 - near * 1.25;                 /* ปลาใกล้ = วงแคบลงเข้าหาทุ่น */
          r.scale.setScalar(.35 + k2 * wide);
          r.visible = true;
          r.position.y = .04;
        });
      }
    }
    /* วงคลื่นตอนยังไม่ได้ตก — กระเพื่อมช้าๆ บอกว่า "ตรงนี้ตกปลาได้" */
    if(!fishState){
      fishSpots.forEach(spx=>{
        if(!spx.obj) return;
        (spx.obj.userData.rings || []).forEach(r=>{
          const k2 = ((t * .0004 + (r.userData.ph || 0)) % 1);
          r.scale.setScalar(.35 + k2 * 1.5);
        });
      });
    }
    /* ป้ายลอยทุกใบต้องหันเข้าหากล้อง (แปลงผัก + จุดตกปลา) */
    updateGardenFx(dt);
    billboards(gardenObjs);
    billboards(fishSpots.map(x => x.obj).filter(Boolean));
    if(basketObj) billboards([basketObj]);
    hintT += dt;
    if(hintT > .35){ hintT = 0; refreshHint(); }
  }
  /* แตะของในฉาก — คืน true = จัดการเองแล้ว (house.js จะไม่ทำอย่างอื่นต่อ)
     เดินไปหาก่อนแล้วค่อยทำ (เหมือนแตะชาวบ้าน) เด็กจะได้เห็นตัวละครเดินไปเก็บจริงๆ */
  function tapPick(pick){
    const w = W(); if(!w || !pick) return false;
    /* ⚠ **อยู่ในโหมดถ่ายรูปห้ามทำกิจกรรมใดๆ** (ผู้ใช้สั่ง 2026-08-14)
       เด็กกำลังเล็งกล้องอยู่ ถ้าแตะโดนของแล้วเด้งหน้าต่างขึ้นมาจะเสียจังหวะถ่าย */
    if(photoMode()){ w.toast(ICO('ui-camera', '📷'), 'กำลังถ่ายรูปอยู่นะ กดปุ่ม ✕ ออกจากโหมดถ่ายรูปก่อนได้เลย'); return true; }
    if(pick.game === 'fish'){ fishPull(); return true; }
    if(pick.game === 'fishspot' && fishState){ fishPull(); return true; }   /* กำลังตกอยู่ = แตะเพื่อดึง */
    const t = w.nearWalkable(pick.x, pick.z);
    if(!t) return false;
    w.walkTo(t.x, t.z, {type:'play2', pick: pick, pos: new THREE.Vector3(w.wx(pick.x), 0, w.wz(pick.z))});
    return true;
  }
  /* เดินถึงแล้ว — ทำสิ่งที่ตั้งใจ */
  function arrive(pick){
    if(!pick) return;
    if(pick.game === 'seek')   seekFind(pick.i);
    else if(pick.game === 'col') colTake(pick.i);
    else if(pick.game === 'fishspot') fishCast();
    else if(pick.game === 'basket') basketOpen();
    else if(pick.game === 'garden'){
      /* ทำกับ "แปลงที่แตะ" แปลงเดียว ตามที่ป้ายลอยบอกไว้ (ผู้ใช้สั่ง 2026-08-13) */
      const act = bedAction(pick.i);
      if(act === 'plant') gardenPlant(pick.i);
      else if(act === 'water') gardenWater(pick.i);
      else if(act === 'harvest') gardenHarvest(pick.i);
      else W().toast(ICO('ui-water', '💧'), 'วันนี้รดน้ำไปแล้ว พรุ่งนี้ต้นนี้จะโตขึ้นอีกขั้นนะ');
    }
  }

  window.HousePlay = {
    start, stop, tick, tapPick, arrive, onScene,
    open: openPanel, close: closePanel, isOpen: panelOpen,
    /* ---- จุดต่อชุดเทส (ไม่มีอะไรที่เกมจริงไม่ผ่าน) ---- */
    state: () => P,
    seekStart, seekHint, seekIntroActive, seekIntroSkip,
    /* 🔄 รีเซ็ตกิจกรรมรายวันทั้งชุด (เครื่องมือเทส — เรียกจากหน้าปรับค่าต่างๆ)
       ⚠ ใช้ `rollDay()` ตัวเดียวกับที่ระบบใช้ตอนขึ้นวันใหม่จริง **ห้ามเขียน state เอง**
         ⇒ ของสะสมถาวร (สมุดปลา · ของรางวัล · แปลงผัก) ปลอดภัยแน่นอน ไม่ถูกล้างไปด้วย */
    devResetDay: ()=>{
      if(!P) return false;
      seekClear(); colClear();
      rollDay(P);
      persist();
      colBuild(); seekBuild();
      renderPanel();
      return true;
    }, seekPause, seekResume, seekPaused, seedPick, seedPickClose,
    tradeAvailable, tradeLabel, tradeEmoji, renderTrade,
    SEEDS, seedCount, cropCount, seedTotal, addSeed, growMax, fishById,
    beds, bedAction, fishSpots: () => fishSpots, atFishSpot,
    fishCast, fishPull, fishState: () => fishState,
    photoShoot, photoOrder, grabShot, photoEnter, photoExit, photoMode,
    photoAlbumOpen, photoAlbumClose, photoAlbumIsOpen, playShutter, photoBig, photoBigClose,
    basketOpen, basketClose, basketIsOpen, basketTile,
    fxCount: () => gfx.length,          /* ชุดเทส: อนิเมชันถูกสร้างจริงและไม่ถูกลบทิ้งทันที */
    /* เครื่องมือเทสเท่านั้น — เปิดเฉพาะตอนรันในเครื่อง
       ⚠ กันที่จุดนิยาม ไม่ใช่ลบทีหลัง (หน้าแรกโหลดชุดบ้านเบื้องหลังให้เด็กที่มีบ้านอยู่แล้ว) */
    ...(DEV_ONLY ? {
      /* เครื่องมือเทส: เร่งเวลาผัก (js/house-devtools.js) */
      devGrow: (n)=>{ if(!P) return 0; let c = 0;
        (P.garden.plots || []).forEach((pl, i2)=>{ if(!pl) return;
          const m = growMax(pl.seed);
          const st = Math.min(m, (pl.stage | 0) + (n || 1));
          if(st !== pl.stage){ setSlot(i2, {seed:pl.seed, stage:st, wd:''}); c++; } });
        persist(); gardenBuild(); renderPanel(); return c; },
      /* 🔓 เครื่องมือเทส — เติม "สมุดปลา" ให้ครบทุกชนิด / ล้างทิ้ง (js/house-devtools.js)
         ⚠ ปลาเป็นของสะสมที่ **สมุดสะสมอ่านจาก `play.fish.book` ตรงๆ** (ไม่จดซ้ำที่ house-book)
           ⇒ ปลดล็อกสมุดสะสมต้องมาแก้ที่นี่ ห้ามไปเขียน state ของสมุดแทน */
      /* 🧪 ชุดเทส: ตั้งจำนวนปลาที่ตกไปแล้ววันนี้ + สุ่มปลาตรงๆ (ใช้วัดว่าโอกาสหรี่ลงจริง) */
      devFishToday: n => { if(P){ P.fish.today = n | 0; persist(); } },
      devRollFish: where => rollFish(Math.random, where || 'pond'),
      devFishAll: (on)=>{
        if(!P) return 0;
        P.fish = Object.assign({}, P.fish, {book: on === false ? [] : FISH.map(f => f.id)});
        persist(); renderPanel();
        return (P.fish.book || []).length;
      },
      /* 🔓 เครื่องมือเทส — ยัดรูปตัวอย่างลงอัลบั้มให้เต็ม (แท็บ 📷 ของสมุดสะสม)
         รูปวาดเองด้วย canvas เล็กๆ ไม่ได้แคปหน้าจอจริง (เร็วกว่ามากและไม่ต้องรอเฟรม) */
      devPhotoFill: (on)=>{
        if(!P) return 0;
        if(on === false){ P.photo = Object.assign({}, P.photo, {shots: []}); persist(); return 0; }
        const shots = (P.photo.shots || []).slice();
        for(let i = shots.length; i < PHOTO_MAX; i++){
          const cv = document.createElement('canvas');
          cv.width = 160; cv.height = 120;
          const g = cv.getContext('2d');
          const hue = (i * 47) % 360;
          g.fillStyle = 'hsl(' + hue + ',62%,72%)'; g.fillRect(0, 0, 160, 120);
          g.fillStyle = 'hsl(' + hue + ',52%,42%)';
          g.font = 'bold 46px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText(String(i + 1), 80, 62);
          shots.push({u: cv.toDataURL('image/jpeg', .7), d: dayKey()});
        }
        P.photo = Object.assign({}, P.photo, {shots});
        persist(); renderPanel();
        return shots.length;
      },
      gardenPlant, gardenWater, gardenHarvest,
      objs: () => ({seek: seekObjs.length, col: colObjs.length, garden: gardenObjs.length}),
      /* 🧭 ช่องของ "ของประจำวันที่ยังไม่ได้เก็บ" — ลูกศรนำทางของเควสต์เก็บของใช้ (2026-08-16)
         ⚠ ต้องกรอง `got` ออกเสมอ ไม่งั้นลูกศรชี้ไปที่ของที่เก็บไปแล้ว */
      colLeft: ()=> (!P || !P.col.items) ? []
        : P.col.items.map((it, i) => ({x:it.x, z:it.z, i:i}))
                     .filter(it => (P.col.got || []).indexOf(it.i) < 0)
    } : {}),
    FISH, SEEDS, COL_PRIZES, COL_N, PLOT_MAX, GROW_MAX, PHOTO_MAX,
    /* ---- 🚪 ประตูเดียวที่ฝั่งเควสต์ใช้เช็คว่า "วันนี้ยังทำงานแนว Action ได้อีกกี่ครั้ง" ----
       ⚠ **ต้องเช็คก่อนแจกงานเสมอ** ไม่งั้นเด็กเก็บของครบไปแล้วแล้วเพิ่งได้งานให้เก็บ = ตันทั้งวัน
         (กติกาเหล็กข้อ 1 ห้ามมี dead end) · เพิ่มงานแนวนี้ให้เติมคีย์ที่นี่ที่เดียว */
    worldStock: ()=>{
      if(!P) return {leaf:0, water:0, photo:0};
      const left = Math.max(0, ((P.col.items || []).length) - ((P.col.got || []).length));
      const wet  = beds().map((_, k) => k)
        .filter(k => { const st = slotAt(k); return st && st.stage < growMax(st.seed) && st.wd !== dayKey(); });
      return {leaf:left, water:wet.length, photo: Math.max(0, PHOTO_MAX - ((P.photo.shots || []).length))};
    },
  };

  /* ---------- ผูกปุ่ม (element อยู่ใน index.html · โหลดมาก่อนไฟล์นี้เสมอ) ---------- */
  {
    const b = $('house-play-btn');
    if(b) b.addEventListener('click', ()=>{
      if(typeof playClick === 'function') playClick();
      if(panelOpen()) closePanel(); else openPanel();
    });
    const c = $('hpl-close');
    if(c) c.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); closePanel(); });
    const cam = $('house-photo-btn');
    if(cam) cam.addEventListener('click', ()=>{
      if(typeof playClick === 'function') playClick();
      if(photoMode()) photoExit(); else photoEnter();
    });
    const sh = $('house-shutter');
    if(sh) sh.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); photoShoot(); });
    const ab = $('house-album-btn');
    if(ab) ab.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); photoAlbumOpen(); });
    const bk = $('house-basket-close');
    if(bk) bk.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); basketClose(); });
    const sc = $('house-seedpick-close');
    if(sc) sc.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); seedPickClose(); });
    const bg = $('house-photo-big');
    if(bg) bg.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); photoBigClose(); });
    const ac = $('house-album-close');
    if(ac) ac.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); photoAlbumClose(); });
    const px = $('house-photo-exit');
    if(px) px.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); photoExit(); });
  }
})();
