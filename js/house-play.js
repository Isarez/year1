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
      fish:   {book:[], today:0, spot:null},             /* book = ชนิดปลาที่เคยได้ (ถาวร) */
      photo:  {order:'', done:false, shots:[]},          /* shots = รูปที่เก็บไว้ (จำกัดจำนวน+ย่อเล็ก) */
      garden: {plots:[], watered:''},                    /* plots = [{x,z,seed,stage,fed}] */
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
    p.garden = Object.assign({}, p.garden, {watered:''});
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
    return true;
  }
  function seekClear(){
    const w = W();
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
    P.seek.found.push(i);
    const left = P.seek.spots.length - P.seek.found.length;
    const w = W();
    if(typeof playCorrect === 'function') playCorrect();
    if(left > 0){
      w.toast('🙈', 'เจอแล้ว 1 คน! เหลืออีก ' + left + ' คนนะ');
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
    w.toast('🎉', 'เจอเพื่อนครบทุกคนแล้ว! ได้ ' + coins + ' เหรียญ');
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
    W().toast('🙈', 'พักก่อนได้เลย เพื่อนยังแอบรออยู่ที่เดิมนะ');
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
      const body = k.sphere(.17, th.col, 12);
      body.scale.set(1.25, .55, 1); body.position.y = .2; g.add(body);
      const top = k.sphere(.11, th.alt, 10); top.position.y = .34; g.add(top);
      const ring = k.cyl(.32, .32, .02, th.alt, 16); ring.position.y = .03; g.add(ring);
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
    const left = P.col.items.length - P.col.got.length;
    if(left > 0){
      w.toast(th.emoji, 'เก็บ' + th.name + 'ได้แล้ว ' + P.col.got.length + '/' + P.col.items.length);
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
      if(ok) w.toast('🎁', 'ปลด "' + pz.label + '" แล้ว! ไปหยิบได้ในโหมดตกแต่งบ้าน');
    });
  }

  /* ============================================================
     🎣 A3 — ตกปลาที่ท่าน้ำ
     เดินไปยืนติดน้ำแล้วกด "เหวี่ยงเบ็ด" → รอทุ่นจม → กด "ดึง!" ให้ทัน
     ⚠ **ปล่อยไม่ทันคือ "ปลาหนี" ไม่ใช่ "แพ้"** ลองใหม่ได้ไม่จำกัด ไม่เสียอะไรเลย (กติกาเหล็กข้อ 2)
     ⚠ **ตกปลาได้ตั้งแต่ยังไม่มีตู้ปลา** (ไม่งั้น dead end) — ปลาที่ได้ไปอยู่ใน "สมุดปลา" เสมอ
       ถ้ามีตู้ปลาในบ้านค่อยเห็นว่ายจริงเพิ่มอีกทาง
     ============================================================ */
  const FISH = [
    {id:'nil',    n:'ปลานิล',       e:'🐟', rare:1},
    {id:'carp',   n:'ปลาตะเพียน',   e:'🐠', rare:1},
    {id:'catfish',n:'ปลาดุก',       e:'🐡', rare:1},
    {id:'snake',  n:'ปลาช่อน',      e:'🐟', rare:1},
    {id:'guppy',  n:'ปลาหางนกยูง',  e:'🐠', rare:1},
    {id:'gold',   n:'ปลาทอง',       e:'🐠', rare:2},
    {id:'koi',    n:'ปลาคาร์ป',     e:'🐟', rare:2},
    {id:'angel',  n:'ปลาเทวดา',     e:'🐠', rare:2},
    {id:'shrimp', n:'กุ้งแม่น้ำ',    e:'🦐', rare:2},
    {id:'crab',   n:'ปูนา',          e:'🦀', rare:2},
    {id:'turtle', n:'เต่าน้อย',      e:'🐢', rare:3},
    {id:'squid',  n:'ปลาหมึกจิ๋ว',   e:'🦑', rare:3},
    {id:'star',   n:'ปลาดาว',       e:'⭐', rare:3},
    {id:'jelly',  n:'แมงกะพรุนเรืองแสง', e:'🪼', rare:3},
    {id:'boot',   n:'รองเท้าบูตเก่า', e:'🥾', rare:1},   /* ของฮาๆ — เด็กชอบ และไม่ทำให้รู้สึกว่าพลาด */
  ];
  /* ---------- ป้ายลอยเหนือของในฉาก (billboard) ----------
     ใช้แนวคิดเดียวกับป้าย "!" เหนือหัวชาวบ้าน: แผ่นเดียว วาดจาก canvas แล้วหันเข้าหากล้องทุกเฟรม
     ⚠ วัสดุ cache ตามไอคอน ⇒ ป้ายชนิดเดียวกันใช้ draw call ร่วมกัน */
  const bubbleMats = {};
  let BUBBLE_GEO = null;
  function bubbleMat(icon){
    if(bubbleMats[icon]) return bubbleMats[icon];
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const c = cv.getContext('2d');
    c.beginPath(); c.arc(64, 58, 46, 0, Math.PI*2);
    c.fillStyle = '#FFFDF5'; c.fill();
    c.lineWidth = 7; c.strokeStyle = '#C08340'; c.stroke();
    c.beginPath(); c.moveTo(52, 96); c.lineTo(64, 122); c.lineTo(76, 96); c.closePath();
    c.fillStyle = '#FFFDF5'; c.fill();
    c.lineWidth = 6; c.strokeStyle = '#C08340'; c.stroke();
    c.beginPath(); c.moveTo(54, 95); c.lineTo(74, 95); c.strokeStyle = '#FFFDF5'; c.lineWidth = 7; c.stroke();
    c.font = '54px system-ui, "Apple Color Emoji", sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(icon, 64, 60);
    const tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    bubbleMats[icon] = new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false, alphaTest:.15});
    return bubbleMats[icon];
  }
  function makeBubble(icon){
    if(!BUBBLE_GEO) BUBBLE_GEO = new THREE.PlaneGeometry(.86, .86);
    const m = new THREE.Mesh(BUBBLE_GEO, bubbleMat(icon));
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
    return fishSpots.some(s => Math.abs(s.x - t.x) <= 1 && Math.abs(s.z - t.z) <= 1);
  }

  let fishState = null;      /* {phase:'wait'|'bite', t, fish} */
  let fishBob = null;
  let fishSpots = [];        /* [{x,z,kind:'pond'|'sea',obj}] — จุดตกปลาถาวร 2 จุด */

  /* ---------- จุดตกปลา 2 จุด: บ่อน้ำใหญ่ 1 · ทะเล 1 (ผู้ใช้สั่ง 2026-08-13) ----------
     ⚠ **ห้ามเดาพิกัด** — อ่านจากผังจริง: ท่าไม้ตกปลา (`POND_PIER`) สำหรับบ่อน้ำ
       ส่วนทะเลไล่หาช่องเดินได้ช่องแรกที่ติดผืนน้ำทะเลจากกริดจริง
     ⚠ ต้องมีป้ายลอยให้เห็นแต่ไกล ไม่งั้นเด็กไม่มีทางรู้ว่าตกปลาได้ตรงไหน */
  function findFishSpots(){
    const w = W(); if(!w) return [];
    const out = [];
    const pier = w.pondPier();
    const p = pier && w.nearWalkable(pier.x, pier.z);
    if(p) out.push({x:p.x, z:p.z, kind:'pond', name:'บ่อน้ำใหญ่'});
    /* ทะเล: ช่องเดินได้ที่มีน้ำทะเลติดอยู่ข้างๆ — เลือกช่องที่เดินถึงได้จริงช่องแรก */
    const g = w.grid(), OW = w.OUT_W(), OD = w.OUT_D();
    for(let x = OW - 1; x >= 0 && out.length < 2; x--){
      for(let z = 0; z < OD; z++){
        if(!w.walkable(x, z) || !w.visibleSpot(x, z)) continue;
        const touchesSea = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz]) => w.isSea(x+dx, z+dz));
        if(!touchesSea) continue;
        if(w.pathLen(w.tile(), {x, z}) <= 0) continue;    /* เดินไปไม่ถึง = ไม่นับ */
        out.push({x, z, kind:'sea', name:'ริมทะเล'});
        break;
      }
    }
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
    fishSpots.forEach((sp, i)=>{
      const g = new THREE.Group();
      const b = makeBubble('🎣');
      b.position.y = 1.35;
      g.add(b);
      g.position.set(w.wx(sp.x), w.groundY(sp.x, sp.z), w.wz(sp.z));
      g.userData.hPick = {game:'fishspot', i:i, x:sp.x, z:sp.z};
      g.userData.bubble = b;
      w.spawn(g);
      sp.obj = g;
    });
  }

  function fishCast(){
    const w = W();
    if(fishState) return false;
    if(!atFishSpot()){
      w.toast('🎣', 'ต้องไปที่จุดตกปลาก่อนนะ — มองหาป้าย 🎣 ที่บ่อน้ำหรือริมทะเล');
      return false;
    }
    const rng = rngFrom(fnv(childKey() + '|' + Date.now() + '|fish'));
    /* เวลาที่ปลาจะกิน 1.2-3.4 วิ — เป็น "จังหวะของเกม" ไม่ใช่ตัวจับเวลากดดันเด็ก
       (ไม่มีนับถอยหลังบนจอ ไม่มีบทลงโทษถ้าพลาด กดใหม่ได้ทันที) */
    fishState = {phase:'wait', t: 1.2 + rng() * 2.2, fish: rollFish(rng)};
    fishBobBuild();
    renderPanel();
    return true;
  }
  function rollFish(rng){
    const r = rng();
    const want = r < .6 ? 1 : (r < .9 ? 2 : 3);
    const pool = FISH.filter(f => f.rare === want);
    return pool[(rng() * pool.length) | 0] || FISH[0];
  }
  function fishBobBuild(){
    const w = W(); if(!w) return;
    fishBobClear();
    const k = w.kit(), t = w.tile();
    const g = new THREE.Group();
    const ball = k.sphere(.16, 0xf2544b, 12); ball.position.y = .12; g.add(ball);
    const cap = k.sphere(.16, 0xfff6e6, 12); cap.scale.set(1, .5, 1); cap.position.y = .22; g.add(cap);
    k.merge(g);
    g.position.set(w.wx(t.x), .02, w.wz(t.z));
    g.userData.hPick = {game:'fish'};
    w.spawn(g);
    fishBob = g;
  }
  function fishBobClear(){ const w = W(); if(fishBob && w) w.despawn(fishBob); fishBob = null; }
  /* กด "ดึง!" — ถูกจังหวะได้ปลา · ไม่ถูกจังหวะ = ปลาหนี ลองใหม่ได้เลย ไม่เสียอะไร */
  function fishPull(){
    const w = W();
    if(!fishState) return false;
    if(fishState.phase !== 'bite'){
      fishState = null; fishBobClear();
      w.toast('🎣', 'ยังไม่ถึงจังหวะ ปลาว่ายหนีไปแล้ว — ลองใหม่ได้เลยนะ');
      renderPanel();
      return false;
    }
    const f = fishState.fish;
    fishState = null; fishBobClear();
    P.fish.today = (P.fish.today | 0) + 1;
    const isNew = (P.fish.book || []).indexOf(f.id) < 0;
    if(isNew) P.fish.book = (P.fish.book || []).concat([f.id]);
    persist();
    if(typeof playCongrats === 'function') playCongrats();
    w.toast(f.e, (isNew ? 'ได้ตัวใหม่! ' : 'ได้ ') + f.n + ' แล้ว (สมุดปลา ' + P.fish.book.length + '/' + FISH.length + ')');
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
  const PHOTO_MAX = 6;             /* เก็บได้กี่รูป (เกินแล้วทับรูปเก่าสุด) */
  const PHOTO_W = 160;             /* ความกว้างที่ย่อเก็บ — ~8-14 KB/รูป */
  const PHOTO_ORDERS = [
    {id:'water',  name:'ถ่ายรูปริมน้ำ',        hint:'ไปยืนใกล้แม่น้ำหรือสะพานแล้วกดถ่าย'},
    {id:'home',   name:'ถ่ายรูปหน้าบ้านของหนู', hint:'กลับไปที่บริเวณบ้านแล้วกดถ่าย'},
    {id:'market', name:'ถ่ายรูปที่ตลาด',        hint:'เดินไปที่ลานตลาดรถเข็นแล้วกดถ่าย'},
    {id:'any',    name:'ถ่ายรูปมุมที่หนูชอบ',   hint:'เดินไปมุมไหนก็ได้ที่ชอบ แล้วกดถ่ายเลย'},
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
  function photoShoot(){
    const w = W();
    if(!photoSpotOk()){ w.toast('📷', photoOrder().hint); return false; }
    const url = grabShot();
    if(!url){ w.toast('📷', 'ถ่ายรูปไม่สำเร็จ ลองใหม่อีกครั้งนะ'); return false; }
    P.photo.shots = (P.photo.shots || []).concat([{u:url, d:dayKey()}]).slice(-PHOTO_MAX);
    const first = !P.photo.done;
    P.photo.done = true;
    persist();
    if(typeof playCongrats === 'function') playCongrats();
    w.toast('📸', first ? 'ถ่ายรูปสำเร็จ! เก็บไว้ในอัลบั้มแล้ว' : 'เก็บรูปใหม่เข้าอัลบั้มแล้ว');
    renderPanel();
    return true;
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
      return out.toDataURL('image/jpeg', .72);
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
  const SEEDS = [
    {id:'carrot', n:'แครอท',    e:'🥕', col:0xf08a3c, pay:2},
    {id:'tomato', n:'มะเขือเทศ', e:'🍅', col:0xe4574f, pay:2},
    {id:'corn',   n:'ข้าวโพด',   e:'🌽', col:0xf3c53f, pay:3},
    {id:'pumpkin',n:'ฟักทอง',    e:'🎃', col:0xef8b2c, pay:3},
  ];
  const GROW_MAX = 3;              /* 0 = เมล็ด · 1 = ต้นอ่อน · 2 = มีดอก · 3 = เก็บได้ */
  const PLOT_MAX = 4;
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
  function bedAction(i){
    const sl = slotAt(i);
    if(!sl) return 'plant';
    if(sl.stage >= GROW_MAX) return 'harvest';
    return (P.garden.watered === dayKey()) ? 'wait' : 'water';
  }
  const BED_ICON = {plant:'🌱', water:'💧', harvest:'🧺', wait:'😴'};

  function gardenPlant(i){
    const w = W();
    if(!P) return false;
    const n = beds().length;
    if(!n){ w.toast('🌱', 'ไม่มีแปลงผักในบริเวณบ้านแล้ว ลองหยิบกลับมาวางในโหมดตกแต่งนะ'); return false; }
    if(i == null) i = [...Array(n).keys()].find(k => !slotAt(k));
    if(i == null){ w.toast('🌱', 'ปลูกครบทุกแปลงแล้ว รดน้ำรอให้โตก่อนนะ'); return false; }
    if(slotAt(i)){ w.toast('🌱', 'แปลงนี้มีต้นไม้อยู่แล้วนะ'); return false; }
    const rng = rngFrom(fnv(childKey() + '|' + Date.now() + '|seed' + i));
    const sd = SEEDS[(rng() * SEEDS.length) | 0];
    setSlot(i, {seed: sd.id, stage: 0});
    persist(); gardenBuild(); renderPanel();
    if(typeof playCorrect === 'function') playCorrect();
    w.toast(sd.e, 'ปลูก' + sd.n + 'แล้ว! อย่าลืมมารดน้ำทุกวันนะ');
    return true;
  }
  function gardenWater(i){
    const w = W();
    if(!P) return false;
    const growing = beds().map((_, k) => k).filter(k => { const s = slotAt(k); return s && s.stage < GROW_MAX; });
    if(!growing.length){ w.toast('🌱', 'ยังไม่มีต้นไม้ให้รดน้ำเลย ลองปลูกดูสิ'); return false; }
    if(P.garden.watered === dayKey()){
      w.toast('💧', 'วันนี้รดน้ำไปแล้วนะ พรุ่งนี้ค่อยมารดใหม่');
      return false;
    }
    /* รดครั้งเดียวได้ทั้งสวน — เด็ก 5 ขวบไม่ควรต้องเดินรดทีละแปลง 4 รอบ */
    P.garden.watered = dayKey();
    growing.forEach(k => { const s = slotAt(k); setSlot(k, {seed:s.seed, stage:s.stage + 1}); });
    persist(); gardenBuild(); renderPanel();
    if(typeof playCorrect === 'function') playCorrect();
    w.toast('💧', 'รดน้ำแล้ว! ต้นไม้โตขึ้นอีกขั้น ' + growing.length + ' ต้น');
    return true;
  }
  function gardenHarvest(i){
    const w = W();
    if(!P) return false;
    const ripe = beds().map((_, k) => k).filter(k => { const s = slotAt(k); return s && s.stage >= GROW_MAX; });
    const take = (i != null && ripe.indexOf(i) >= 0) ? [i] : ripe;
    if(!take.length){ w.toast('🌱', 'ยังไม่มีต้นไหนโตพอเก็บเลย รดน้ำอีกสักวันนะ'); return false; }
    let coins = 0;
    take.forEach(k => {
      const s = slotAt(k);
      const sd = SEEDS.find(x => x.id === s.seed) || SEEDS[0];
      coins += sd.pay;
      setSlot(k, null);
    });
    persist(); gardenBuild(); renderPanel();
    w.award(coins);
    if(typeof playCongrats === 'function') playCongrats();
    w.toast('🧺', 'เก็บผักได้ ' + take.length + ' ต้น ขายได้ ' + coins + ' เหรียญ!');
    w.refreshHud();
    return true;
  }
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
      if(sl){
        const sd = SEEDS.find(x => x.id === sl.seed) || SEEDS[0];
        if(sl.stage >= 1){
          const stem = k.cyl(.045, .06, .18 + sl.stage * .14, 0x5aa84f, 8);
          stem.position.y = .22 + (.18 + sl.stage * .14) / 2; g.add(stem);
          const leaf = k.sphere(.13 + sl.stage * .04, 0x76c46a, 10);
          leaf.scale.set(1.4, .6, 1.4); leaf.position.y = .26 + sl.stage * .14; g.add(leaf);
        }else{
          const seedBall = k.sphere(.08, 0x8d6e63, 8); seedBall.position.y = .26; g.add(seedBall);
        }
        if(sl.stage >= GROW_MAX){ const fr = k.sphere(.15, sd.col, 12); fr.position.y = .6; g.add(fr); }
        k.merge(g);
      }
      /* ป้ายลอยบอกว่าแตะแล้วจะเกิดอะไร (ผู้ใช้สั่ง 2026-08-13) */
      const b = makeBubble(BED_ICON[bedAction(i)] || '🌱');
      b.position.y = 1.25;
      g.add(b);
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
    const e = $('house-playpanel'); if(!e) return;
    e.hidden = false;
    renderPanel();
  }
  function closePanel(){ const e = $('house-playpanel'); if(e) e.hidden = true; }

  function row(icon, title, sub, btns){
    const d = document.createElement('div');
    d.className = 'hpl-row';
    const ic = document.createElement('span'); ic.className = 'hpl-ic'; ic.textContent = icon;
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
      el.textContent = b.label;
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
      list.appendChild(row('🙈', 'ซ่อนแอบกับเพื่อนบ้าน', 'วันนี้เล่นครบแล้ว พรุ่งนี้เพื่อนจะมาแอบใหม่นะ', []));
    }else if(P.seek.on){
      const h = seekHint();
      const r = row('🙈', 'ซ่อนแอบกับเพื่อนบ้าน',
        'เจอแล้ว ' + P.seek.found.length + '/' + P.seek.spots.length + ' คน · ' + (h ? h.text : ''),
        [{label:'ไปหาต่อ', fn: closePanel},
         {label:'พักก่อน', alt:true, id:'hpl-seek-pause', fn: seekPause}]);
      r.insertBefore(seekFaces(), r.querySelector('.hpl-btns'));
      list.appendChild(r);
    }else if(seekPaused()){
      const r = row('🙈', 'ซ่อนแอบกับเพื่อนบ้าน',
        'พักอยู่ · เจอแล้ว ' + P.seek.found.length + '/' + P.seek.spots.length + ' คน เพื่อนยังแอบที่เดิม',
        [{label:'เล่นต่อ', id:'hpl-seek-resume', fn: ()=>{ if(seekResume()) closePanel(); }}]);
      r.insertBefore(seekFaces(), r.querySelector('.hpl-btns'));
      list.appendChild(r);
    }else{
      const r = row('🙈', 'ซ่อนแอบกับเพื่อนบ้าน', 'เพื่อนจะไปแอบในเมือง เดินไปหาให้เจอทุกคน',
        [{label:'เริ่มเล่น', id:'hpl-seek', fn: ()=>{
          if(seekStart()){ closePanel(); W().toast('🙈', 'เพื่อนไปแอบแล้ว! ออกไปหาให้เจอนะ'); }
          else W().toast('🙈', 'วันนี้เล่นไปแล้ว พรุ่งนี้มาใหม่นะ');
        }}]);
      r.insertBefore(seekFaces(true), r.querySelector('.hpl-btns'));
      list.appendChild(r);
    }

    /* 🍃 เก็บของประจำวัน */
    list.appendChild(row(th.emoji, 'เก็บ' + th.name + 'ทั่วเมือง',
      'วันนี้เก็บแล้ว ' + P.col.got.length + '/' + (P.col.items.length || COL_N)
      + ' ชิ้น · สะสมครบมา ' + (P.col.sets | 0) + ' วัน', []));

    /* 🎣 ตกปลา */
    const fishSub = 'สมุดปลา ' + ((P.fish.book || []).length) + '/' + FISH.length
                  + ' ชนิด · วันนี้ได้ ' + (P.fish.today | 0) + ' ตัว';
    if(fishState){
      list.appendChild(row('🎣', 'ตกปลา',
        fishState.phase === 'bite' ? '‼️ ทุ่นจมแล้ว! รีบดึง!' : 'เหวี่ยงเบ็ดแล้ว รอทุ่นจม…',
        [{label:'ดึง!', id:'hpl-pull', fn: fishPull}]));
    }else{
      list.appendChild(row('🎣', 'ตกปลา',
        fishSub + ' · มีจุดตกปลาที่บ่อน้ำใหญ่กับริมทะเล มองหาป้าย 🎣 นะ',
        [{label:'เหวี่ยงเบ็ด', id:'hpl-cast', off: !atFishSpot(), fn: fishCast}]));
    }

    /* 📷 ช่างภาพ */
    const po = photoOrder();
    list.appendChild(row('📷', po.name,
      (P.photo.done ? 'วันนี้ถ่ายแล้ว · ' : '') + po.hint
      + ' · อัลบั้ม ' + ((P.photo.shots || []).length) + '/' + PHOTO_MAX,
      [{label:'ถ่ายรูป', id:'hpl-shot', fn: photoShoot}]));

    /* 🌱 แปลงผัก — แตะที่แปลงในเมืองได้เลย ปุ่มในแผงเป็นทางลัดสำรอง */
    const nb = beds().length;
    const growing = beds().map((_, i) => slotAt(i)).filter(Boolean);
    const ripe = growing.filter(x => x.stage >= GROW_MAX).length;
    list.appendChild(row('🌱', 'แปลงผักหน้าบ้าน',
      nb ? ('มี ' + nb + ' แปลง · ปลูกแล้ว ' + growing.length + ' · โตพร้อมเก็บ ' + ripe
            + ' · แตะที่แปลงในเมืองได้เลย (ดูป้ายเหนือแปลง)')
         : 'ไม่มีแปลงผักในบริเวณบ้าน ลองหยิบกลับมาวางในโหมดตกแต่งนะ',
      [{label:'ปลูก', id:'hpl-plant', off: !nb, fn: ()=>gardenPlant(null)},
       {label:'รดน้ำ', id:'hpl-water', alt:true, off: !nb, fn: ()=>gardenWater(null)},
       {label:'เก็บผัก', id:'hpl-harvest', alt:true, off: !ripe, fn: ()=>gardenHarvest(null)}]));
  }

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
                 + '<span class="hsk-left">เหลืออีก ' + left + ' คน</span>';
    el.className = 'house-seek-hud lv' + h.level;
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
    w.toast('📷', photoOrder().hint);
    return true;
  }
  function photoExit(){
    document.body.classList.remove('house-photo');
    const f = $('house-photo-ui'); if(f) f.hidden = true;
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
  }
  function clearAll(){ seekClear(); colClear(); gardenClear(); fishBobClear(); fishSpotsClear(); }
  function stop(){
    started = false;
    fishState = null;
    clearAll();
    closePanel();
    photoExit();
    const el = $('house-seek-hud'); if(el) el.hidden = true;
  }
  function onScene(to){
    /* กลุ่ม A เล่นได้เฉพาะฉากนอกบ้าน — เข้าบ้านแล้วเก็บของทิ้ง ออกมาค่อยวางใหม่ */
    clearAll();
    fishState = null;
    if(to === 'out' && started) buildAll();
    renderPanel();
  }
  function tick(dt, t){
    if(!started) return;
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
        W().toast('🐟', 'ปลาว่ายหนีไปแล้ว ไม่เป็นไรนะ ลองใหม่ได้เลย');
        renderPanel();
      }
      if(fishBob){
        fishBob.position.y = fishState && fishState.phase === 'bite'
          ? -.12 + Math.sin(t * .02) * .04
          : .02 + Math.sin(t * .004) * .05;
      }
    }
    /* ป้ายลอยทุกใบต้องหันเข้าหากล้อง (แปลงผัก + จุดตกปลา) */
    billboards(gardenObjs);
    billboards(fishSpots.map(x => x.obj).filter(Boolean));
    hintT += dt;
    if(hintT > .35){ hintT = 0; refreshHint(); }
  }
  /* แตะของในฉาก — คืน true = จัดการเองแล้ว (house.js จะไม่ทำอย่างอื่นต่อ)
     เดินไปหาก่อนแล้วค่อยทำ (เหมือนแตะชาวบ้าน) เด็กจะได้เห็นตัวละครเดินไปเก็บจริงๆ */
  function tapPick(pick){
    const w = W(); if(!w || !pick) return false;
    if(pick.game === 'fish'){ fishPull(); return true; }
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
    else if(pick.game === 'garden'){
      /* ทำกับ "แปลงที่แตะ" แปลงเดียว ตามที่ป้ายลอยบอกไว้ (ผู้ใช้สั่ง 2026-08-13) */
      const act = bedAction(pick.i);
      if(act === 'plant') gardenPlant(pick.i);
      else if(act === 'water') gardenWater(pick.i);
      else if(act === 'harvest') gardenHarvest(pick.i);
      else W().toast('💧', 'วันนี้รดน้ำไปแล้ว พรุ่งนี้ต้นนี้จะโตขึ้นอีกขั้นนะ');
    }
  }

  window.HousePlay = {
    start, stop, tick, tapPick, arrive, onScene,
    open: openPanel, close: closePanel, isOpen: panelOpen,
    /* ---- จุดต่อชุดเทส (ไม่มีอะไรที่เกมจริงไม่ผ่าน) ---- */
    state: () => P,
    seekStart, seekHint, seekPause, seekResume, seekPaused,
    beds, bedAction, fishSpots: () => fishSpots, atFishSpot,
    fishCast, fishPull, fishState: () => fishState,
    photoShoot, photoOrder, grabShot, photoEnter, photoExit, photoMode,
    gardenPlant, gardenWater, gardenHarvest,
    objs: () => ({seek: seekObjs.length, col: colObjs.length, garden: gardenObjs.length}),
    FISH, SEEDS, COL_PRIZES, COL_N, PLOT_MAX, GROW_MAX, PHOTO_MAX,
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
    const px = $('house-photo-exit');
    if(px) px.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); photoExit(); });
  }
})();
