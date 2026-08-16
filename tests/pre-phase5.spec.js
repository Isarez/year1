/* ============================================================
   งานก่อนเฟส 5 — สัญญา Mount · หน้าเลือกทาง · โหมดมือในบ้าน · สะพาน HouseGames
   (ผู้ใช้สั่ง 2026-08-11 ให้ทำ 4 ชิ้นนี้ก่อนเริ่มเฟส 5)
   ============================================================ */
const { test, expect } = require('@playwright/test');
const OUT = '/private/tmp/claude-501/-Users-isarez-year1/f9a3c903-3574-4a5e-9675-beac6680d146/scratchpad/';

const CHILD = { id: 'og1', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function pickChild(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_og1', JSON.stringify({ v:1, mapV: 3,
      char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0} }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  return errs;
}
async function enterHouse(page){
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
}

test('OwlGames: mount เกมของหน้าหลักลงกล่องอื่นแล้วเล่นได้ · unmount คืน DOM ที่เดิม', async ({ page }) => {
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();

  const list = await page.evaluate(() => window.OwlGames.list());
  console.log('ลงทะเบียนแล้ว', list.length, 'เกม:', list.join(' '));
  expect(list.length).toBeGreaterThanOrEqual(20);

  const r = await page.evaluate(() => {
    const host = document.createElement('div');
    host.id = 'og-test-host';
    document.getElementById('home-view').appendChild(host);
    const before = document.getElementById('mix-view').parentElement.id;
    const ok = window.OwlGames.mount('mix', host, { catId: 'skill-mix' });
    const inHost = document.getElementById('mix-view').parentElement.id;
    const cur = window.OwlGames.current();
    const hasBody = document.body.classList.contains('og-mounted');
    window.OwlGames.unmount();
    const after = document.getElementById('mix-view').parentElement.id;
    const hidden = document.getElementById('mix-view').hidden;
    return { ok, before, inHost, cur, hasBody, after, hidden };
  });
  console.log(JSON.stringify(r));
  expect(r.ok).toBe(true);
  expect(r.inHost).toBe('og-test-host');
  expect(r.cur).toBe('mix');
  expect(r.hasBody).toBe(true);
  expect(r.after).toBe(r.before);          /* คืนที่เดิมเป๊ะ */
  expect(r.hidden).toBe(true);
  expect(errs).toEqual([]);
});

test('หน้าเลือกทาง: โผล่หลังเลือกเด็ก · เลือกทำโจทย์แล้วเข้าหน้าหมวด · ไม่เด้งซ้ำ', async ({ page }) => {
  const errs = await pickChild(page);
  await expect(page.locator('#landing-view')).toBeVisible();
  await expect(page.locator('#home-view')).toBeHidden();
  await page.screenshot({ path: OUT + 'landing.png' });

  await page.locator('#landing-quiz').click();
  await expect(page.locator('#landing-view')).toBeHidden();
  await expect(page.locator('#home-view')).toBeVisible();

  /* เข้าเกมแล้วกลับมา ต้องไม่เจอหน้าเลือกซ้ำ */
  await page.evaluate(()=>renderHome());
  await expect(page.locator('#landing-view')).toBeHidden();
  expect(errs).toEqual([]);
});
/* บั๊กจริงที่ผู้ใช้เจอ 2026-08-11 — กลับไปหน้าเลือกเด็กแล้วเข้าใหม่ ไม่เจอหน้าเลือกโหมดอีกเลย
   (ตัวคุม `chosen` ไม่เคยถูกล้าง) + ต้องมีปุ่มย้อนกลับเพื่อเปลี่ยนคนเล่นได้จากหน้านี้ */
test('หน้าเลือกทาง: ปุ่ม ← กลับไปเลือกเด็กได้ · เข้าใหม่ต้องเจอหน้าเลือกโหมดอีกครั้ง', async ({ page }) => {
  const errs = await pickChild(page);
  await expect(page.locator('#landing-view')).toBeVisible();

  /* ปุ่มย้อนกลับ → หน้าเลือกเด็ก */
  await page.locator('#landing-back').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('#landing-view')).toBeHidden();

  /* เลือกเด็กใหม่ → หน้าเลือกโหมดต้องเด้งอีกครั้ง */
  await page.locator('#child-select-view .child-card').first().click();
  await expect(page.locator('#landing-view')).toBeVisible();

  /* เข้าหน้าหมวดแล้วกดเปลี่ยนเด็กจาก header → เลือกใหม่ ก็ต้องเจอหน้าเลือกโหมดอีก */
  await page.locator('#landing-quiz').click();
  await expect(page.locator('#home-view')).toBeVisible();
  await page.locator('#switch-child-btn').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await page.locator('#child-select-view .child-card').first().click();
  await expect(page.locator('#landing-view')).toBeVisible();
  expect(errs).toEqual([]);
});

test('หน้าเลือกทาง: เลือกเข้าเมืองแล้วโหมดบ้านเปิดจริง', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);
  await expect(page.locator('#house-view')).toBeVisible();
  expect(errs).toEqual([]);
});

test('โหมดมือในโหมดบ้าน: ปุ่มกล้องโผล่ตอนเปิดการ์ดเควสต์ · หายตอนปิด', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);

  await expect(page.locator('#handplay-toggle')).toHaveCount(0);
  await page.evaluate(()=>window.HouseQuestUI.playTest({mech:'tidy', title:'🧪 t'}));
  await expect(page.locator('.hqz-sort')).toBeVisible();

  /* ปุ่มกล้องต้องโผล่ และต้องอยู่ในแถบบนของโหมดบ้าน */
  const btn = page.locator('#handplay-toggle');
  await expect(btn).toBeVisible();
  const where = await page.evaluate(()=>document.getElementById('handplay-toggle').closest('section').id);
  expect(where).toBe('house-view');

  /* ถังของเกมลาก-วางต้องติดธงให้โหมดมือคลิกได้ */
  const flagged = await page.evaluate(()=>document.querySelectorAll('.hqz-bin[data-hp-click]').length);
  expect(flagged).toBeGreaterThan(0);

  /* ตัวเลือก/กล่องของเป็น <button> อยู่แล้ว = โหมดมือคลิกได้โดยไม่ต้องทำอะไรเพิ่ม */
  expect(await page.evaluate(()=>document.querySelectorAll('.hqz-tile').length)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.querySelector('.hqz-tile').tagName)).toBe('BUTTON');

  /* หรี่เฟรมเรตต้องมีจุดต่อไว้ให้ games-ar เรียก */
  expect(await page.evaluate(()=>typeof window.HouseFrameHint)).toBe('function');

  await page.locator('#hqz-close').click();
  await expect(page.locator('#handplay-toggle')).toHaveCount(0);
  expect(errs).toEqual([]);
});

/* บั๊กจริงที่ผู้ใช้เจอ 2026-08-11 — "เปิดกล้องใช้ AR แล้วมือไม่ขึ้น"
   สาเหตุ: qzShow() ถูกเรียกทุกครั้งที่เปลี่ยนข้อ (8 จุดใน house.js) แล้ว mountHandPlayHouse()
   เริ่มด้วย unmountHandPlay() = ปิดกล้องทิ้ง ⇒ เปิดกล้องแล้วมือหายทันทีที่ตอบข้อแรก
   วิธีจับ: `#hp-layer` ถูกซ่อนโดย stopHandPlay() เสมอ ⇒ ถ้ามันยัง hidden=false อยู่ = ไม่ถูกปิด */
test('โหมดมือ: เปลี่ยนข้อ/เปิดการ์ดซ้ำ ต้องไม่ปิดกล้องที่เปิดค้างอยู่', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);

  await page.evaluate(()=>window.HouseQuestUI.playTest({mech:'quiz', title:'🧪 t'}));
  await expect(page.locator('#handplay-toggle')).toBeVisible();

  /* จำลองว่ากล้องเปิดอยู่ (ไม่ขอสิทธิ์กล้องจริงในเทส) แล้วยิง qzShow ซ้ำแบบที่เกมทำตอนเปลี่ยนข้อ */
  const r = await page.evaluate(()=>{
    const layer = document.getElementById('hp-layer');
    layer.hidden = false;
    const before = document.getElementById('handplay-toggle') !== null;
    mountHandPlayHouse();
    mountHandPlayHouse();
    return {before, stillOn: !layer.hidden,
            btn: document.getElementById('handplay-toggle') !== null,
            inTop: !!document.querySelector('#house-view .quiz-top #handplay-toggle')};
  });
  expect(r.before).toBe(true);
  expect(r.stillOn).toBe(true);       /* ← ตัวจับบั๊ก: กล้องต้องไม่ถูกปิด */
  expect(r.btn).toBe(true);
  expect(r.inTop).toBe(true);

  /* แต่ปิดการ์ด = ต้องปิดกล้องให้เรียบร้อยจริงๆ */
  await page.locator('#hqz-close').click();
  expect(await page.evaluate(()=>document.getElementById('hp-layer').hidden)).toBe(true);
  expect(errs).toEqual([]);
});

test('HouseGames: ยืม engine หน้าหลักมาเล่นในการ์ดเควสต์ได้จริง', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);

  const list = await page.evaluate(()=>window.HouseGames.allowed());
  console.log('เกมที่เปิดให้เล่นในบ้าน:', list.join(' '));
  expect(list.length).toBeGreaterThanOrEqual(6);

  const r = await page.evaluate(()=>{
    const ok = window.HouseGames.play({gameId:'mix', gradeId:'p2'});
    const view = document.getElementById('mix-view');
    return {ok, cardOpen: !document.getElementById('house-qz').hidden,
            inStage: view.closest('#hqz-stage') !== null,
            embedded: view.classList.contains('og-embedded'),
            mounted: window.OwlGames.current()};
  });
  console.log(JSON.stringify(r));
  expect(r.ok).toBe(true);
  expect(r.cardOpen).toBe(true);
  expect(r.inStage).toBe(true);
  expect(r.embedded).toBe(true);
  expect(r.mounted).toBe('mix');

  /* ปิดการ์ด → view ต้องกลับที่เดิมและซ่อน */
  await page.evaluate(()=>window.HouseQuestUI.closeCard());
  const after = await page.evaluate(()=>{
    window.OwlGames.unmount();
    const v = document.getElementById('mix-view');
    return {hidden: v.hidden, inStage: v.closest('#hqz-stage') !== null, cur: window.OwlGames.current()};
  });
  expect(after.inStage).toBe(false);
  expect(after.hidden).toBe(true);
  expect(after.cur).toBe(null);
  expect(errs).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-12: ในโหมดบ้าน ตอบด้วยการ "ชี้ค้าง 1.5 วินาที" ไม่ต้องจีบนิ้ว
   ⚠ เกม ป.3 ในหน้าหลักต้องยังเป็นจีบนิ้วเหมือนเดิม (CLAUDE.md ล็อกไว้)
   เทสนี้เรียก updateHandCursor() ตรงๆ จึงไม่ต้องเปิดกล้องจริง */
test('โหมดมือในบ้าน: ชี้ค้าง 1.5 วิ = ตอบ · แถบเดินแบบ linear · ขยับออกแล้วเริ่มนับใหม่', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);
  await page.evaluate(()=>window.HouseQuestUI.playTest({mech:'quiz', title:'🧪 ชี้ค้าง'}));
  await expect(page.locator('#house-qz')).toBeVisible();

  const r = await page.evaluate(async ()=>{
    setHandDwellMode(true);
    const btn = document.querySelector('#house-qz button:not(#hqz-close)');
    const b = btn.getBoundingClientRect();
    const x = b.left + b.width/2, y = b.top + b.height/2;
    let clicked = false;
    btn.addEventListener('click', ()=>{ clicked = true; }, {once:true});

    /* ชี้ครึ่งทาง แล้วขยับออกไปที่ว่าง → ต้องรีเซ็ต (ไม่มี .hp-dwell เหลือ) */
    /* ⚠ ความคืบหน้าของวงแหวนเดินตาม **เฟรมที่วาดจริง** ไม่ใช่เวลาเดินสด
       เครื่องเทสตอนรันทั้งชุดพร้อมกันวาดได้ ~1 fps ⇒ ชี้ 600 ms อาจยังไม่ทันขยับเลย
       แล้วเทสแดงทั้งที่โค้ดถูก (เจอจริง 2026-08-17 · รันเดี่ยวผ่าน รันรวมแดง)
       ⇒ ชี้จนกว่าจะเห็นวงแหวนขยับจริง แต่หยุดตั้งแต่ยังไม่ถึงครึ่ง จะได้ทดสอบการรีเซ็ตต่อได้ */
    let pMid = 0;
    const t0 = Date.now();
    while(Date.now()-t0 < 5000 && pMid <= 0.15){
      updateHandCursor(x, y, false);
      const el0 = document.querySelector('.hp-dwell');
      if(el0) pMid = Math.max(pMid, parseFloat(getComputedStyle(el0).getPropertyValue('--hp-dwell-p')) || 0);
      await new Promise(r2=>setTimeout(r2,60));
    }
    updateHandCursor(2, 2, false);
    const resetOk = !document.querySelector('.hp-dwell') && !clicked;

    /* ชี้ค้างยาวๆ ต้องกดให้ + เก็บคู่ (เวลา, ความคืบหน้า) ไว้ตรวจว่าเดินแบบ linear */
    const marks = [];
    const t1 = Date.now();
    while(Date.now()-t1 < 4000 && !clicked){
      updateHandCursor(x, y, false);
      const el = document.querySelector('.hp-dwell');
      if(el) marks.push([Date.now()-t1, parseFloat(getComputedStyle(el).getPropertyValue('--hp-dwell-p'))]);
      await new Promise(r2=>setTimeout(r2,60));
    }
    const box = document.querySelector('#house-qz button:not(#hqz-close)');
    return { clicked, held: Date.now()-t1, pMid, resetOk, marks,
             outlineOffset: parseFloat(getComputedStyle(box).outlineOffset) || 0 };
  });
  console.log('ชี้ค้าง: ' + JSON.stringify(r));
  expect(r.pMid, 'วงแหวนต้องเดินหน้าระหว่างชี้').toBeGreaterThan(0.15);
  expect(r.resetOk, 'ขยับนิ้วออกจากปุ่มแล้วต้องเริ่มนับใหม่ ไม่กดเอง').toBe(true);
  expect(r.clicked, 'ชี้ค้างครบแล้วต้องนับเป็นการกด').toBe(true);
  expect(r.held).toBeGreaterThan(1200);
  /* ⚠ เพดานนี้วัดรวม "เวลาที่ลูปเทสรู้ตัว" ด้วย ไม่ใช่เวลาของกลไกเพียวๆ — เครื่องเทสวาดได้ ~3 fps
     จึงรู้ตัวช้ากว่าจริงได้หลายร้อยมิลลิวินาที (เคยตั้งไว้ 2400 แล้วแดงที่ 2425 โดยกลไกไม่ได้ผิดเลย)
     ตัวที่พิสูจน์ว่ากลไกถูกจริงคือ `marks` ข้างล่างที่ต้องโตแบบ linear ตาม t/1500 */
  expect(r.held).toBeLessThan(3200);
  /* linear = ความคืบหน้าต้องโตตามเวลาแบบตรงๆ (คลาดจาก t/1500 ไม่เกิน 0.15) */
  r.marks.forEach(([ms,p])=>{ expect(Math.abs(p - Math.min(1, ms/1500))).toBeLessThan(0.15); });
  /* เส้นต้องวาดในกรอบปุ่ม ไม่งั้นโผล่พ้นขอบการ์ดออกไปในโลก 3D */
  expect(r.outlineOffset, 'เส้นเล็ง/แถบต้องอยู่ในกรอบปุ่ม (outline-offset ติดลบ)').toBeLessThanOrEqual(0);
  expect(errs).toEqual([]);
});

test('เกมหน้าหลักยังใช้ท่าเดิม — ชี้ค้างต้องไม่กดให้เอง', async ({ page }) => {
  const errs = await pickChild(page);
  const r = await page.evaluate(async ()=>{
    setHandDwellMode(false);
    const btn = document.querySelector('#home-view button');
    const b = btn.getBoundingClientRect();
    let clicked = false;
    const stop = e => { clicked = true; e.preventDefault(); e.stopPropagation(); };
    btn.addEventListener('click', stop, true);
    const t0 = Date.now();
    while(Date.now()-t0 < 4000){ updateHandCursor(b.left+b.width/2, b.top+b.height/2, false); await new Promise(r2=>setTimeout(r2,100)); }
    btn.removeEventListener('click', stop, true);
    return { clicked, ring: !!document.querySelector('.hp-dwell') };
  });
  expect(r.clicked, 'หน้าหลักต้องไม่ตอบด้วยการชี้ค้าง (ท่าเดิม = จีบนิ้ว)').toBe(false);
  expect(r.ring).toBe(false);
  expect(errs).toEqual([]);
});

/* โหมดชี้ค้างไม่ได้ตัดการจีบนิ้วทิ้ง — เด็กที่จีบนิ้วเป็นต้องตอบได้ทันทีไม่ต้องรอ 1.5 วิ
   (ผู้ใช้ยืนยัน 2026-08-12 ให้คงไว้ + เพิ่มคำอธิบาย) */
test('โหมดมือในบ้าน: จีบนิ้วยังตอบได้ทันที ไม่ต้องรอชี้ค้าง', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);
  await page.evaluate(()=>window.HouseQuestUI.playTest({mech:'quiz', title:'🧪 จีบนิ้ว'}));
  const r = await page.evaluate(async ()=>{
    setHandDwellMode(true);                 /* โหมดบ้าน = ชี้ค้าง แต่จีบนิ้วต้องยังใช้ได้ */
    const btn = document.querySelector('#house-qz button:not(#hqz-close)');
    const b = btn.getBoundingClientRect();
    const x = b.left + b.width/2, y = b.top + b.height/2;
    let clicked = false, tClick = 0;
    btn.addEventListener('click', ()=>{ clicked = true; tClick = Date.now(); }, {once:true});
    updateHandCursor(x, y, false);          /* เฟรมแรกยังไม่จีบ */
    /* ⚠ ต้องจับเวลา **ตั้งแต่จังหวะจีบนิ้ว** ไม่ใช่ตั้งแต่เฟรมแรก — `updateHandCursor` เองก็กิน
       เวลาหลายร้อย ms ตอนเครื่องโดนรันทั้งชุดพร้อมกัน แล้วเทสแดงทั้งที่จีบนิ้วตอบทันทีจริงๆ
       (เจอจริง 2026-08-17 · รันเดี่ยวผ่าน รันรวมแดง) */
    const tPinch = Date.now();
    updateHandCursor(x, y, true);           /* จีบนิ้ว = ต้องตอบทันที */
    await new Promise(r2=>setTimeout(r2, 120));
    return { clicked, ms: clicked ? tClick - tPinch : -1 };
  });
  console.log('จีบนิ้ว: ' + JSON.stringify(r));
  expect(r.clicked, 'จีบนิ้วต้องตอบได้ทันทีแม้อยู่ในโหมดชี้ค้าง').toBe(true);
  expect(r.ms, 'ต้องไม่ต้องรอครบเวลาชี้ค้าง').toBeLessThan(300);   /* ชี้ค้างคือ 1,500 ms */
  expect(errs).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-12: แถบ HUD ทุกแถวใช้ .house-hud-row ตัวเดียว (margin-top 10) ห้ามมี row2 */
test('แถบ HUD โหมดบ้าน: ทุกแถวใช้คลาสเดียวกัน ระยะเท่ากัน ชิดซ้ายตรงกัน', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);
  const m = await page.evaluate(()=>{
    const rows = Array.from(document.querySelectorAll('#house-view .house-hud-row'));
    const qb = document.getElementById('house-quest-bar');
    return {
      row2: document.querySelectorAll('.house-hud-row2').length,
      mts: rows.map(r=>getComputedStyle(r).marginTop),
      qbLeft: Math.round(qb.getBoundingClientRect().left),
      chipLeft: Math.round(document.querySelector('#house-view .child-chip').getBoundingClientRect().left),
      compassLeft: Math.round(document.getElementById('house-compass').getBoundingClientRect().left),
    };
  });
  console.log('HUD: ' + JSON.stringify(m));
  expect(m.row2, 'ไม่ควรมี .house-hud-row2 เหลืออยู่แล้ว').toBe(0);
  m.mts.forEach(v => expect(v).toBe('10px'));
  /* 🗺️ HUD ถูกจัดใหม่ 2026-08-14: **เข็มทิศเป็นคอลัมน์แรกหน้าชื่อเด็ก สูงเท่า 2 แถว**
     และ **แถบเควสต์ย้ายไปอยู่ใต้เข็มทิศ** ⇒ แถบเควสต์ชิดซ้ายตรงกับ "เข็มทิศ" ไม่ใช่ "ชื่อเด็ก"
     (เกณฑ์เดิมเทียบกับชื่อเด็กค้างมาจากก่อนจัดใหม่ จึงแดงมาตลอดโดยที่หน้าจอถูกต้องแล้ว) */
  expect(m.qbLeft, 'แถบเควสต์ต้องชิดซ้ายตรงกับเข็มทิศ').toBe(m.compassLeft);
  expect(m.chipLeft, 'ชื่อเด็กต้องอยู่ขวาของเข็มทิศ').toBeGreaterThan(m.compassLeft);
  expect(errs).toEqual([]);
});
