/* ============================================================
   🎓 เฟส 15 — ระบบสอนเล่นของโหมดบ้าน (engine)   · 2026-08-17
   สเปกเต็มอยู่ข้อ 56 ของ QUEST-DESIGN.md

   หลักการที่ผู้ใช้กำหนด: **Action tutorial ไม่ใช่กล่องข้อความให้อ่าน**
     จอมืดลง → เจาะรูเฉพาะจุดที่ต้องแตะ → เด็กแตะ/เดินเอง → ระบบตรวจว่าทำจริงแล้วค่อยไปต่อ
     **ห้ามมีปุ่ม "ถัดไป" ให้กดรัวผ่านทั้งบทเรียน** (ขั้นที่เป็น action ไม่มีปุ่มข้ามเลย
     ขั้นที่เป็นคำอธิบายล้วนมีปุ่ม "เข้าใจแล้ว" ที่ **โผล่ช้ากว่าข้อความ 1.2 วิ** กันกดรัว)

   🔑 **ไฟล์นี้ไม่รู้จักเนื้อบทเรียนเลย** — บทเรียนอยู่ `js/house-tutor-steps.js` ทั้งหมด
      (ผู้ใช้สั่งให้แยก engine ออกจากเนื้อหาตั้งแต่แรก จะได้เพิ่มบทโดยไม่ต้องแตะ engine)

   📋 คำสั่ง 6 ชนิด (ตารางข้อ 56.2)
     say      นกฮูกพูด                → จบเมื่อเด็กกด "เข้าใจแล้ว"
     goto     ให้เดินไปที่จุดหนึ่ง      → จบเมื่อเดินไปถึงเอง (มีปุ่ม "พาไปเลย" ช่วย)
     tapUI    เจาะรูที่ปุ่มบนจอ         → จบเมื่อกดปุ่มนั้นจริง (หรือ check() ผ่าน)
     tapWorld ป้ายชี้ของในโลก 3D       → จบเมื่อ check() ผ่าน
     await    รอเหตุการณ์จริง          → จบเมื่อ check() ผ่าน
     grant    ให้เงิน/ของ              → ทำทันทีแล้วไปต่อ

   🔒 กติกากันเด็กติด (ข้อ 56.7 — **สำคัญกว่าความเนี้ยบของ tutorial ทุกข้อ**)
     - **ไม่ล็อกการเดินและไม่บล็อกปุ่มใดๆ** ⇒ ม่านมืดเป็น `pointer-events:none` เสมอ
       (สเปกเดิมเขียนว่า "ปุ่มอื่นกดไม่ได้ชั่วคราว" — **จงใจไม่ทำ** เพราะขัดข้อ
        "ไม่ล็อกการเดิน" ในหน้าเดียวกัน และถ้าหลุดสถานะไหนสักอย่างเด็กจะแตะอะไรไม่ได้เลย
        ซึ่งเป็นทางตันที่แย่ที่สุด · ม่านมืดยังชี้เป้าได้ผลโดยไม่ต้องบล็อก)
     - **วาล์วนิรภัย**: ขั้นไหนค้างเกิน `STEP_TIMEOUT` หรือหาเป้าหมายไม่เจอ ⇒ ข้ามเองเงียบๆ
     - **เล่นค้างข้ามวันได้** — `data.tut` อยู่ในก้อน house data ซึ่ง export/import พ่วงไปด้วยอยู่แล้ว
     - **ห้ามให้เควสต์รายวัน/แถบสัตว์เลี้ยงเด้งทับ** — ระหว่างสอนตั้ง `body.house-tut-on`

   🚪 ประตูเดียวคือ `window.HouseTutor` — `js/house.js` เรียกแค่ 4 จุด (start/stop/tick/onScene)
   ============================================================ */
(function(){
  'use strict';

  const $ = id => document.getElementById(id);
  function W(){ return window.HouseWorld || null; }
  function STEPS(){ return window.HouseTutorSteps || null; }

  /* ⏱️ วาล์วนิรภัย: ขั้นเดียวห้ามค้างนานกว่านี้ (วินาที) — หมดเวลาแล้วข้ามไปเองเงียบๆ
     ⚠ ตัวเลขนี้ต้อง **เผื่อเด็กเดินข้ามเมืองจริง** (แผนที่ 56×42 เดินไกลสุด ~40 ช่อง ≈ 70 วิ)
       ตั้งสั้นกว่านี้แล้วบทเรียนจะข้ามตัวเองทั้งที่เด็กกำลังเดินไปอยู่ */
  const STEP_TIMEOUT = 180;
  /* ปุ่ม "เข้าใจแล้ว" โผล่ช้ากว่าข้อความเท่านี้ (วินาที) — กันเด็กกดรัวผ่านโดยไม่ได้ดู */
  const SAY_DELAY = 1.2;
  /* ถือว่า "ถึงที่หมายแล้ว" เมื่อห่างไม่เกินกี่ช่อง (วัดด้วยระยะเดินจริง ไม่ใช่เส้นตรง) */
  const GOTO_NEAR = 2;

  let run = null;          /* {ch, i, t0 (นาฬิกาจริง), tapped, mark} */
  let marker = null;       /* วงแหวนเรืองแสงบนพื้น (goto/tapWorld) */
  let markerT = 0;
  let tapArmed = null;     /* {el, fn} ตัวดักคลิกของขั้น tapUI */
  let started = false;

  /* ================= state ที่บันทึกลง save ของเด็ก =================
     รูปแบบ: data.tut = {ch:'c1', i:3, done:['c1'], skip:false}
     ⚠ ต้องอ่าน/เขียนผ่าน 2 ฟังก์ชันนี้เท่านั้น จะได้มีจุดเดียวที่รู้จักโครงสร้าง */
  function tut(){
    const w = W(); if(!w) return null;
    const d = w.load() || {};
    return d.tut || null;
  }
  function saveTut(patch){
    const w = W(); if(!w) return;
    const cur = tut() || {ch:null, i:0, done:[], skip:false};
    w.save({tut: Object.assign({}, cur, patch)});
  }

  /* บทนี้เรียนจบไปแล้วหรือยัง */
  function chDone(id){
    const t = tut();
    return !!(t && (t.done || []).indexOf(id) >= 0);
  }
  function skipped(){ const t = tut(); return !!(t && t.skip); }

  /* ================= หน้าจอ ================= */
  function els(){
    return {wrap:$('house-tut'), hole:$('house-tut-hole'), dim:$('house-tut-dim'), say:$('house-tut-say'),
            ic:$('house-tut-ic'), tx:$('house-tut-text'), note:$('house-tut-note'),
            go:$('house-tut-go'), ok:$('house-tut-ok'), bar:$('house-tut-bar')};
  }
  function hideUi(){
    const e = els();
    if(e.wrap) e.wrap.hidden = true;
    if(e.hole) e.hole.hidden = true;
    if(e.dim)  e.dim.hidden  = true;
    document.body.classList.remove('house-tut-on');
  }
  function showUi(){
    const e = els();
    if(e.wrap) e.wrap.hidden = false;
    document.body.classList.add('house-tut-on');
  }

  /* เจาะรูที่ปุ่มบนจอ — ใช้ box-shadow วงใหญ่ทำม่านมืดรอบๆ ช่องที่เจาะ
     ⚠ ต้องวัดตำแหน่งใหม่ทุกเฟรม ปุ่มบางตัวขยับ (แถบเควสต์/แถบสัตว์เลี้ยงยืดหดตามเนื้อหา) */
  function paintHole(el){
    const e = els();
    if(!e.hole) return;
    if(!el || el.hidden || !el.getClientRects().length){ hideHole(e); return; }
    const r = el.getBoundingClientRect();
    if(r.width < 2 || r.height < 2){ hideHole(e); return; }
    const pad = 8;
    const x0 = r.left - pad, y0 = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
    e.hole.style.left   = x0 + 'px';
    e.hole.style.top    = y0 + 'px';
    e.hole.style.width  = w + 'px';
    e.hole.style.height = h + 'px';
    e.hole.style.borderRadius = Math.min(28, r.height / 2 + pad) + 'px';
    e.hole.hidden = false;
    /* ม่าน 4 แผ่นล้อมรอบรู — คิดจากสี่เหลี่ยมของรูตรงๆ ไม่ต้องพึ่งเงาวงใหญ่ */
    if(e.dim){
      const W2 = window.innerWidth, H2 = window.innerHeight;
      const put = (id, l, t, ww, hh) => {
        const n = $(id); if(!n) return;
        n.style.left = Math.max(0, l) + 'px';  n.style.top = Math.max(0, t) + 'px';
        n.style.width = Math.max(0, ww) + 'px'; n.style.height = Math.max(0, hh) + 'px';
      };
      put('htd-t', 0, 0, W2, y0);
      put('htd-b', 0, y0 + h, W2, H2 - (y0 + h));
      put('htd-l', 0, y0, x0, h);
      put('htd-r', x0 + w, y0, W2 - (x0 + w), h);
      e.dim.hidden = false;
    }
  }

  function hideHole(e){
    if(e.hole) e.hole.hidden = true;
    if(e.dim)  e.dim.hidden  = true;
  }

  /* ================= วงแหวนบนพื้นในโลก 3D ================= */
  function markerClear(){
    const w = W();
    if(marker && w) w.despawn(marker);
    marker = null;
  }
  function markerAt(x, z){
    const w = W(); if(!w) return;
    markerClear();
    const k = w.kit();
    const g = new THREE.Group();
    const ring = k.torus(.62, .09, 0xFFD166, 22);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .06;
    g.add(ring);
    const ring2 = k.torus(.34, .06, 0xFFF1A8, 18);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = .05;
    g.add(ring2);
    /* ลูกศรชี้ลงลอยเหนือจุด — เด็กเห็นแต่ไกลว่า "ตรงนี้แหละ" */
    const ar = k.cone(.3, .5, 0xFFD166, 10);
    ar.rotation.x = Math.PI;
    ar.position.y = 1.5;
    g.add(ar);
    g.position.set(w.wx(x), w.groundY(x, z) + .01, w.wz(z));
    marker = w.spawn(g);
    markerT = 0;
  }
  function markerTick(dt){
    if(!marker) return;
    markerT += dt;
    const s = 1 + Math.sin(markerT * 3.2) * .12;
    marker.children[0].scale.set(s, s, 1);
    marker.children[1].scale.set(2 - s, 2 - s, 1);
    marker.children[2].position.y = 1.5 + Math.sin(markerT * 3.2) * .18;
    marker.children[2].rotation.y = markerT * 1.6;
  }

  /* ================= ตัวช่วยของ step ================= */
  function val(v){ return (typeof v === 'function') ? v() : v; }

  /* 🎯 ช่องที่ "ยืนได้จริง" ของเป้าหมาย — เป้าหมายหลายอย่าง **บล็อกช่องของตัวเอง**
     (แปลงผัก · ตะกร้าขายของ · กระดานภารกิจ · ตัวอาคาร) เดินไปทับไม่ได้
     ⚠ ถ้าไม่สแนปมาช่องข้างๆ `pathLen` จะคืน -1 ตลอด ⇒ ขั้นนั้นไม่มีวันจบ
       แล้วไปหลุดที่วาล์วนิรภัย 180 วิ = เด็กยืนงงอยู่ 3 นาทีโดยไม่รู้ว่าทำถูกแล้ว
     (วงแหวนยังปักที่ **ตัวของจริง** ไม่ใช่ช่องที่สแนป — เด็กต้องเห็นว่าชี้ไปที่อะไร) */
  function standTile(t){
    const w = W(); if(!w || !t) return null;
    if(w.walkable(t.x, t.z)) return t;
    const n = w.nearWalkable(t.x, t.z);
    return n ? {x:n.x, z:n.z} : null;
  }
  /* ระยะเดินจริงจากตัวเด็กไปช่องนั้น — **ห้ามใช้เส้นตรง** (กติกาเดิมของเฟส 10:
     แม่น้ำ/สะพานทำให้ 10 ช่องเส้นตรงกลายเป็นเดินอ้อม 40 ช่อง) */
  function walkDist(t){
    const w = W(); const g = standTile(t);
    if(!w || !g) return -1;
    return w.pathLen(w.tile(), g);
  }

  function armTap(id){
    disarmTap();
    const el = $(id);
    if(!el) return;
    const fn = ()=>{ if(run) run.tapped = true; };
    el.addEventListener('click', fn, true);
    tapArmed = {el, fn};
  }
  function disarmTap(){
    if(tapArmed) tapArmed.el.removeEventListener('click', tapArmed.fn, true);
    tapArmed = null;
  }

  /* ================= ลูปหลัก ================= */
  function chapter(){
    const S = STEPS(); if(!S || !run) return null;
    return S.chapters.find(c => c.id === run.ch) || null;
  }
  function step(){
    const c = chapter();
    return c ? c.steps[run.i] : null;
  }

  function enterStep(){
    const s = step();
    if(!s){ finishChapter(); return; }
    /* ⏱️ **ต้องจับเวลาด้วยนาฬิกาจริง (`Date.now`) ห้ามสะสมจาก `dt` ของลูปวาด**
       ลูปวาดถูก clamp ไว้ 50 ms/เฟรม ⇒ เครื่องช้าที่วาดได้ 3 fps เดินเวลาแค่ 0.15 วิ ต่อ 1 วินาทีจริง
       เวลาที่ให้เด็ก "อ่านก่อนกดผ่าน" 1.2 วิ จะกลายเป็นรอ 8 วินาทีจริง และวาล์วนิรภัย 180 วิ
       จะกลายเป็น 20 นาที (กับดักเดียวกับตัวนับถอยหลังของเกมซ่อนแอบ 2026-08-16) */
    run.t0 = Date.now(); run.tapped = false;
    /* 📌 ค่าตั้งต้นของขั้นนี้ — ขั้นที่วัด "เพิ่มขึ้นจากเดิม" ต้องรู้ว่า "เดิม" เท่าไร
       (เช่น "ซื้อเฟอร์นิเจอร์ 1 ชิ้น" ต้องเทียบกับจำนวนของที่มีอยู่ก่อน ไม่ใช่เช็คว่ามีของไหม
        — บ้านมีของแถมตั้งต้นอยู่แล้ว `starterHomeRecs()` เช็คแบบหลังจะผ่านทันทีโดยไม่ได้ซื้อ) */
    run.mark = s.mark ? val(s.mark) : null;
    disarmTap();
    markerClear();

    /* ขั้นที่ทำไปแล้ว (เช่นเด็กซื้อของชิ้นนั้นไว้ก่อนเปิดบทเรียน) ⇒ ข้ามเลย ไม่ต้องให้ทำซ้ำ */
    if(s.skipIf && val(s.skipIf)){ next(); return; }

    if(s.k === 'grant'){
      if(s.coins && window.OwlCoins) window.OwlCoins.add(s.coins);
      if(s.run) s.run();
      const w = W();
      if(w && s.text) w.toast(s.icon || '🎁', s.text);
      if(w) w.refreshHud();
      next();
      return;
    }
    if(s.k === 'tapUI') armTap(s.el);
    /* ขั้นไหนก็ตามที่บอก `at` มา = มีจุดหมายในโลก ⇒ ปักวงแหวนให้เสมอ
       (ไม่จำกัดแค่ goto — ขั้น await บางตัวก็ต้องบอกว่า "ไปทำที่ไหน" เช่นเดินเข้าบ้าน) */
    { const t = val(s.at); if(t) markerAt(t.x, t.z); }
    paintSay(s);
  }

  function paintSay(s){
    const e = els();
    showUi();
    if(e.ic)   e.ic.textContent = s.icon || '🦉';
    if(e.tx)   e.tx.textContent = val(s.text) || '';
    /* 📝 คำอธิบายเพิ่ม (ผู้ใช้สั่ง 2026-08-17: "ใส่คำอธิบายต่างๆ หากจำเป็นด้วย")
       บรรทัดเล็กใต้ข้อความหลัก — บอก "ทำไปทำไม/ได้อะไร" ไม่ใช่บอกซ้ำว่าให้ทำอะไร */
    const note = val(s.note) || '';
    if(e.note){ e.note.textContent = note; e.note.hidden = !note; }
    /* ปุ่ม "พาไปเลย" มีเฉพาะขั้นเดินไปที่ไหนสักแห่ง */
    if(e.go) e.go.hidden = (s.k !== 'goto');
    /* ปุ่ม "เข้าใจแล้ว" มีเฉพาะขั้นพูดล้วน — ขั้น action ไม่มีทางกดข้าม */
    if(e.ok) e.ok.hidden = true;
    if(e.bar) e.bar.textContent = progressText();
  }
  function progressText(){
    const c = chapter();
    if(!c) return '';
    return c.name + ' · ' + (run.i + 1) + '/' + c.steps.length;
  }

  function next(){
    if(!run) return;
    run.i++;
    saveTut({ch: run.ch, i: run.i});
    enterStep();
  }
  function finishChapter(){
    const t = tut() || {};
    const done = (t.done || []).slice();
    if(run && done.indexOf(run.ch) < 0) done.push(run.ch);
    const c = chapter();
    saveTut({ch: null, i: 0, done});
    const w = W();
    if(c && w){
      w.toast('🎓', 'จบบทเรียน "' + c.name + '" แล้ว เก่งมาก!');
      if(typeof playCongrats === 'function') playCongrats();
    }
    run = null;
    disarmTap();
    markerClear();
    hideUi();
    /* บทถัดไปที่ยังไม่ได้เรียนและพร้อมเรียนแล้ว ⇒ ต่อให้เลย (เว้นบทที่เป็น event-driven) */
    setTimeout(()=>{ if(started) autoStart(); }, 1400);
  }

  /* เงื่อนไขจบของแต่ละชนิด */
  function stepDone(s){
    if(s.check && val(s.check)) return true;
    if(s.k === 'say')      return false;                 /* รอปุ่ม "เข้าใจแล้ว" */
    if(s.k === 'tapUI')    return !!run.tapped;
    if(s.k === 'goto'){
      const t = val(s.at);
      if(!t) return true;                                /* เป้าหมายหาย = วาล์วนิรภัย ปล่อยผ่าน */
      const d = walkDist(t);
      return d >= 0 && d <= (s.near || GOTO_NEAR);
    }
    return false;                                        /* tapWorld/await รอ check() ล้วน */
  }

  function tick(dt){
    if(!run) return;
    markerTick(dt);
    const s = step();
    if(!s) return;
    const el = (Date.now() - run.t0) / 1000;        /* วินาทีจริงตั้งแต่เข้าขั้นนี้ */

    /* ปุ่ม "เข้าใจแล้ว" ของขั้นพูดล้วน — โผล่ช้ากว่าข้อความ กันกดรัวผ่าน */
    if(s.k === 'say'){
      const e = els();
      if(e.ok && e.ok.hidden && el >= SAY_DELAY) e.ok.hidden = false;
    }
    /* เจาะรูตามปุ่มทุกเฟรม (ปุ่มขยับได้ — แถบเควสต์/แถบสัตว์เลี้ยงยืดหดตามเนื้อหา)
       ⚠ ขั้น `say` ก็เจาะรูได้ถ้าบอก `el` มา — ใช้ตอน "แนะนำว่าปุ่มนี้คืออะไร" โดยยังไม่ต้องให้กด */
    if(s.el) paintHole($(s.el));
    else hideHole(els());

    /* ระยะทางที่เหลือ — บอกเป็นตัวเลขให้เด็กรู้ว่าใกล้ถึงหรือยัง */
    if(s.k === 'goto'){
      const e = els(), t = val(s.at), d = walkDist(t);
      if(e.bar) e.bar.textContent = progressText() + (d > 0 ? ' · อีก ' + d + ' ก้าว' : '');
    }

    if(stepDone(s)){ next(); return; }

    /* 🛟 วาล์วนิรภัย — ค้างนานเกินไปแล้วข้ามเองเงียบๆ ดีกว่าปล่อยให้เด็กติด */
    if(el > STEP_TIMEOUT) next();
  }

  /* ================= ปุ่มบนฟองนกฮูก ================= */
  function bindBtns(){
    const e = els();
    if(e.ok) e.ok.addEventListener('click', ()=>{
      if(typeof playClick === 'function') playClick();
      if(run) next();
    });
    /* 🚶 "พาไปเลย" — เดินอัตโนมัติ **แต่ยังเห็นตัวเดินจริง ห้ามวาร์ป** (ผู้ใช้สั่ง)
       แผนที่ 56×42 · ห้างเฟอร์นิเจอร์อยู่มุมใต้ ร้านสัตว์เลี้ยงอยู่มุมเหนือ ⇒ เดินเองอาจ 40+ ช่อง */
    if(e.go) e.go.addEventListener('click', ()=>{
      if(typeof playClick === 'function') playClick();
      const s = step(), w = W();
      if(!s || !w) return;
      const g = standTile(val(s.at));
      if(g) w.walkTo(g.x, g.z);
    });
  }

  /* ================= วงจรชีวิต ================= */
  /* บทไหนควรเริ่มตอนนี้ — ไล่ตามลำดับในไฟล์บทเรียน ข้ามบทที่เรียนจบแล้ว
     ⚠ บทที่ตั้งธง `event:true` (บทสัตว์เลี้ยง) **ห้ามเริ่มเอง** ต้องรอถูกปลุกด้วย `fire()` */
  function nextChapterId(){
    const S = STEPS(); if(!S) return null;
    const c = S.chapters.find(x => !x.event && !chDone(x.id) && (!x.ready || x.ready()));
    return c ? c.id : null;
  }
  function begin(id, at){
    const S = STEPS(); if(!S) return false;
    const c = S.chapters.find(x => x.id === id);
    if(!c || !c.steps.length) return false;
    run = {ch:id, i: Math.max(0, Math.min(c.steps.length - 1, at | 0)), t0: Date.now(), tapped:false};
    saveTut({ch:id, i:run.i});
    enterStep();
    return true;
  }
  function autoStart(){
    if(run || skipped() || !STEPS()) return false;
    const w = W();
    if(!w || w.mode() !== 'world') return false;
    const t = tut();
    /* เล่นค้างไว้ข้ามวัน — กลับมาต่อตรงที่ค้าง (ผู้ใช้ปิดแอปกลางบทได้) */
    if(t && t.ch && !chDone(t.ch)) return begin(t.ch, t.i);
    const id = nextChapterId();
    return id ? begin(id, 0) : false;
  }

  function start(){
    started = true;
    bindBtns();
    /* รอให้ฉาก/HUD วาดเสร็จก่อน ไม่งั้นเจาะรูที่ปุ่มซึ่งยังไม่มีขนาด */
    setTimeout(()=>{ if(started) autoStart(); }, 900);
  }
  function stop(){
    started = false;
    run = null;
    disarmTap();
    markerClear();
    hideUi();
  }
  function onScene(){
    /* ของในฉากถูกล้างทุกครั้งที่เปลี่ยนฉาก ⇒ วงแหวนต้องวาดใหม่ (ไม่งั้นค้างเป็นซาก) */
    marker = null;
    const s = step();
    const w = W();
    if(!s || !w || w.scene() !== 'out') return;
    { const t = val(s.at); if(t) markerAt(t.x, t.z); }
  }

  /* 🔔 ปลุกบทที่เป็น event-driven (บทสัตว์เลี้ยงเด้งเองตอนเด็กได้สัตว์ตัวแรก) */
  function fire(id){
    if(skipped() || chDone(id)) return false;
    if(run && run.ch === id) return false;
    /* กำลังสอนบทอื่นค้างอยู่ = ไม่แทรก (เด็กจะสับสน) — จบบทนั้นก่อนแล้วค่อยมาเอง */
    if(run) return false;
    return begin(id, 0);
  }

  /* 🙈 ปุ่มข้ามอยู่ในเมนูเฟือง (พ่อแม่กด) — **เด็กข้ามเองไม่ได้** (ผู้ใช้สั่ง) */
  function skipAll(){
    const S = STEPS();
    const all = S ? S.chapters.map(c => c.id) : [];
    saveTut({ch:null, i:0, done:all, skip:true});
    stop();
    started = true;
    const w = W();
    if(w) w.toast('🎓', 'ข้ามบทเรียนแล้ว — เปิดเรียนใหม่ได้ที่เมนูตั้งค่า');
    return true;
  }
  /* เรียนใหม่ตั้งแต่ต้น (ข้อ 56.7 "สอนซ้ำได้จากเมนูเฟือง") */
  function restart(){
    saveTut({ch:null, i:0, done:[], skip:false});
    run = null;
    markerClear();
    hideUi();
    started = true;
    return autoStart();
  }

  window.HouseTutor = {
    start, stop, tick, onScene, fire, skipAll, restart,
    active: () => !!run,
    /* ---- จุดต่อชุดเทส ---- */
    state: () => run ? {ch:run.ch, i:run.i, k:(step()||{}).k, t:(Date.now()-run.t0)/1000} : null,
    saved: () => tut(),
    begin, autoStart, chDone, skipped,
    stepNow: () => step(),
    /* ค่าตั้งต้นที่ขั้นนี้จดไว้ — ไฟล์บทเรียนใช้เทียบว่า "เพิ่มขึ้นแล้วหรือยัง" */
    mark: () => run ? run.mark : null,
    force: () => { if(run) next(); },      /* เทส: ผ่านขั้นนี้ไปโดยไม่ต้องทำจริง */
  };
})();
