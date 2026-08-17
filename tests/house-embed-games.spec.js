const { test, expect } = require('@playwright/test');

/* ============================================================
   🎮 เกมของหน้าหลักที่ยืมมาเล่นในการ์ดเควสต์ — 3 ข้อที่ผู้ใช้แจ้ง 2026-08-17
     ① 🁣 โดมิโน: สัดส่วนการ์ดเพี้ยน (ครึ่งบน/ล่างกว้างกว่าสูง ดูไม่เป็นโดมิโน)
     ② 🎨 ผสมสี: ต้องบอกด้วยว่าต้องผสมกี่สี
     ③ 🪟 เล่นจบแล้วคลิกนอก popup → หน้าสรุปหลุดไปอยู่หลังฉากเมือง
   ============================================================ */

const CHILD = { id: 'embg', name: 'ทดสอบเกม', emoji: '🎮', birthDate: '2018-01-15', grade: 'p2' };

async function openHouse(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({
      v: 1, mapV: 4, worldSeeded: true,
      char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
    }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  /* ⚠ ต้องรอ ready() เสมอ — hMode เป็น 'world' ตั้งแต่ไฟล์โหลดเสร็จ ทั้งที่บ้านยังไม่พร้อม */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  return errors;
}
/* เปิดการ์ดทดสอบแล้วกด "เล่นเลย!" ให้เกมจริงถูก mount */
async function play(page, mech) {
  await page.evaluate(m => window.HouseQuestUI.playTest({ mech: m, title: 'ทดสอบ ' + m }), mech);
  await page.locator('#hqz-stage button').first().click();
  await page.waitForTimeout(1800);
}

test('🁣 โดมิโน: การ์ดต้องเป็นสัดส่วน 1:2 (ครึ่งบน/ล่างเป็นจัตุรัส)', async ({ page }) => {
  await openHouse(page);
  await play(page, 'memory');
  const r = await page.evaluate(() => {
    const c = document.querySelector('.domino-card');
    if (!c) return null;
    const b = c.getBoundingClientRect();
    const half = c.querySelector('.domino-half').getBoundingClientRect();
    return { w: b.width, h: b.height, hw: half.width, hh: half.height };
  });
  expect(r, 'ต้องมีการ์ดโดมิโนวาดอยู่จริง').not.toBeNull();
  /* 🁣 โดมิโนจริง = สี่เหลี่ยม 1:2 ⇒ ครึ่งบน/ล่างเป็นจัตุรัส ตารางจุด 3×3 จึงไม่ยืดออกข้าง */
  expect(r.h / r.w, 'การ์ดต้องสูงเป็น 2 เท่าของความกว้าง').toBeGreaterThan(1.85);
  expect(r.h / r.w, 'การ์ดต้องไม่สูงเกิน 2 เท่ามาก').toBeLessThan(2.2);
  expect(Math.abs(r.hw - r.hh) / r.hw, 'แต่ละครึ่งต้องเกือบเป็นจัตุรัส').toBeLessThan(0.25);
});

test('🁣 กระดานจับคู่: การ์ดทุกใบต้องอยู่ในกรอบ popup ไม่ล้นออกไปโดนตัด', async ({ page }) => {
  await openHouse(page);
  await play(page, 'memory');
  const r = await page.evaluate(() => {
    const qz = document.getElementById('house-qz').getBoundingClientRect();
    const out = [];
    document.querySelectorAll('.memory-card').forEach((c, i) => {
      const b = c.getBoundingClientRect();
      if (b.right > qz.right || b.left < qz.left) out.push(i);
    });
    return { n: document.querySelectorAll('.memory-card').length, out,
             qz: Math.round(qz.left) + '-' + Math.round(qz.right) };
  });
  expect(r.n, 'ต้องมีการ์ดในกระดาน').toBeGreaterThan(4);
  /* ⚠ ของเดิมคอลัมน์ตั้ง `flex:0 0 auto` ⇒ กว้างเท่าการ์ดทุกใบเรียงแถวเดียว แล้วล้นออกนอกการ์ดเควสต์ */
  expect(r.out, 'ห้ามมีการ์ดใบไหนล้นออกนอกกรอบ · popup=' + r.qz + '').toEqual([]);
});

test('🎨 ผสมสี: ต้องบอกจำนวนสีที่ต้องผสมไว้ข้างสีเป้าหมาย', async ({ page }) => {
  await openHouse(page);
  await play(page, 'mix');
  const r = await page.evaluate(() => {
    const n = document.querySelector('.mix-need');
    const tgt = document.getElementById('mix-target-text');
    return { txt: n ? n.textContent.trim() : null,
             inTarget: !!(n && tgt && tgt.contains(n)),
             vis: !!(n && n.getClientRects().length) };
  });
  expect(r.txt, 'ต้องมีป้ายบอกจำนวนสี').toBeTruthy();
  /* ต้องมีตัวเลขจริง ไม่ใช่ข้อความลอยๆ */
  expect(/\d/.test(r.txt), 'ป้ายต้องมีตัวเลขจำนวนสี').toBe(true);
  /* ⚠ ต้องอยู่ **ข้างสีเป้าหมาย** ไม่ใช่ในแถบคำใบ้คนละที่ เด็กจะได้เห็นพร้อมกัน */
  expect(r.inTarget, 'ป้ายต้องอยู่ในบรรทัดเป้าหมาย').toBe(true);
  expect(r.vis, 'ป้ายต้องมองเห็นจริง').toBe(true);
});

test('🪟 เกมยิงผลลัพธ์หลังถูกปิดไปแล้ว ต้องไม่เปิดหน้าสรุปของหน้าหลักค้างหลังฉากเมือง', async ({ page }) => {
  const errors = await openHouse(page);
  await play(page, 'memory');
  /* เด็กคลิกนอก popup = ปิดการ์ด + unmount เกม */
  await page.mouse.click(60, 640);
  await page.waitForTimeout(700);
  /* engine ที่มีตัวจับเวลา/อนิเมชันยิงผลตามมาทีหลังได้ */
  const r = await page.evaluate(() => {
    let threw = null;
    try { if (typeof finishP2Game === 'function') finishP2Game(6, 6); }
    catch (e) { threw = String(e && e.message || e); }
    const vis = Array.from(document.querySelectorAll('main > section, body > section'))
      .filter(x => x && !x.hidden).map(x => x.id || '(noid)');
    return { threw, vis, houseOpen: !document.getElementById('house-view').hidden };
  });
  /* ⚠ ของเดิมสั่ง showOnlyView(resultView) ก่อนจะรู้ว่าไม่มีหมวดจริง ⇒ หน้าสรุปค้างอยู่ใน <main>
     ซึ่งอยู่ **หลังฉากเมือง** (#house-view z-index 70) แล้ว throw ตามมาที่ cat.id */
  expect(r.threw, 'ห้าม throw').toBeNull();
  expect(r.vis, 'ห้ามมีหน้าสรุปของหน้าหลักเปิดค้างอยู่หลังเมือง').not.toContain('result-view');
  expect(r.houseOpen, 'ต้องยังอยู่ในเมืองตามปกติ').toBe(true);
  expect(errors, 'ห้ามมี error').toEqual([]);
});

test('🎨 ผสมสี: ใต้หม้อต้องมีวงกลมเส้นประครบตามจำนวนสีที่ต้องใช้ · หยอดแล้วสีมาแทนที่', async ({ page }) => {
  await openHouse(page);
  await play(page, 'mix');
  const before = await page.evaluate(() => ({
    empty: document.querySelectorAll('#mix-pot-chips .mix-chip-empty').length,
    filled: document.querySelectorAll('#mix-pot-chips .mix-chip:not(.mix-chip-empty)').length,
    dashed: (function(){ const e = document.querySelector('.mix-chip-empty');
      return e ? getComputedStyle(e).borderStyle : null; })(),
    tag: (function(){ const e = document.querySelector('.mix-chip-empty');
      return e ? e.tagName : null; })(),
  }));
  /* ⚠ ต้องโชว์ตั้งแต่ยังไม่หยอดสีเลย — เดิมแถวนี้ว่างเปล่า เด็กไม่รู้ว่าต้องใช้กี่สี */
  expect(before.empty + before.filled, 'ต้องมีช่องครบตามจำนวนสีของด่าน').toBeGreaterThanOrEqual(2);
  expect(before.empty, 'ต้องมีช่องว่างเส้นประอย่างน้อย 1 ช่อง').toBeGreaterThan(0);
  expect(before.dashed, 'ช่องว่างต้องเป็นเส้นประ').toBe('dashed');
  /* ⚠ ช่องว่างต้องกดไม่ได้ — ทางหยอดสีมีทางเดียวคือกดกระปุกสี */
  expect(before.tag, 'ช่องว่างต้องไม่ใช่ปุ่ม').not.toBe('BUTTON');

  await page.locator('.mix-jar').first().click();
  await page.waitForTimeout(2200);
  const after = await page.evaluate(() => ({
    empty: document.querySelectorAll('#mix-pot-chips .mix-chip-empty').length,
    filled: document.querySelectorAll('#mix-pot-chips .mix-chip:not(.mix-chip-empty)').length,
  }));
  /* 🎨 หัวใจของสิ่งที่ผู้ใช้สั่ง: หยอดสีแล้ว **สีมาแทนที่ช่องเส้นประ** จำนวนรวมต้องเท่าเดิม */
  expect(after.filled, 'หยอดแล้วต้องมีจุดสีเพิ่ม').toBe(before.filled + 1);
  expect(after.empty, 'ช่องเส้นประต้องลดลง 1').toBe(before.empty - 1);
  expect(after.empty + after.filled, 'จำนวนช่องรวมต้องเท่าเดิม').toBe(before.empty + before.filled);
});

test('🕐 การ์ดนาฬิกา: แบ่งครึ่งจอ หน้าปัดซ้าย โจทย์ขวา และหน้าปัดต้องใหญ่พอ', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'clock', title: 'ทดสอบ clock' }));
  await page.locator('#hqz-stage button').first().click();
  await page.waitForTimeout(1800);
  const r = await page.evaluate(() => {
    const st = document.getElementById('hqz-stage');
    const sv = document.querySelector('.hqz-clock svg');
    const q = document.querySelector('.hqz-q');
    if (!sv || !q) return null;
    const a = sv.getBoundingClientRect(), b = q.getBoundingClientRect();
    return { split: st.classList.contains('hqz-split'), clockW: a.width,
             clockRight: a.right, qLeft: b.left, stageW: st.getBoundingClientRect().width };
  });
  expect(r, 'ต้องมีทั้งหน้าปัดและโจทย์').not.toBeNull();
  expect(r.split, 'เวทีต้องอยู่โหมดแบ่งครึ่ง').toBe(true);
  /* ⚠ ของเดิมหน้าปัดล็อกไว้ 196px บนการ์ดกว้าง ~1,000px ⇒ เล็กจนดูเวลายาก (ผู้ใช้แจ้ง) */
  expect(r.clockW, 'หน้าปัดต้องใหญ่กว่าเดิมชัดเจน').toBeGreaterThan(240);
  expect(r.clockW / r.stageW, 'หน้าปัดควรกินราวครึ่งหนึ่งของเวที').toBeGreaterThan(0.3);
  /* หน้าปัดอยู่ซ้าย โจทย์อยู่ขวา — ต้องไม่ทับกัน */
  expect(r.qLeft, 'โจทย์ต้องอยู่ขวาของหน้าปัด').toBeGreaterThanOrEqual(r.clockRight - 2);
});

test('🕐 เลย์เอาต์แบ่งครึ่งต้องไม่ค้างไปข้อถัดไปที่ไม่มีหน้าปัด', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'clock', title: 'clock' }));
  await page.locator('#hqz-stage button').first().click();
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.HouseQuestUI.close());
  await page.waitForTimeout(400);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'quiz', title: 'quiz' }));
  await page.locator('#hqz-stage button').first().click();
  await page.waitForTimeout(1500);
  const split = await page.evaluate(() => document.getElementById('hqz-stage').classList.contains('hqz-split'));
  /* 🐞 เจอจริงตอนเทส: คลาสค้าง ⇒ ข้อถัดไปโจทย์ไปอยู่ขวา อิโมจิไปอยู่ซ้าย */
  expect(split, 'ข้อที่ไม่มีหน้าปัดต้องกลับเป็นคอลัมน์เดียว').toBe(false);
});

test('🪙 ร้านค้านกฮูก: ต้องใช้เหรียญชุดเดียวกับเกมจ่ายเงิน/ทอนเงิน', async ({ page }) => {
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    window.__TUT_OFF = true;
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-quiz').click();
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const t = Array.from(document.querySelectorAll('.cat-card'))
      .find(x => (x.textContent || '').indexOf('ร้านค้านกฮูก') >= 0);
    if (t) t.click();
  });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => ({
    owl: document.querySelectorAll('#money-view .hqz-coinface').length,
    old: document.querySelectorAll('#money-view .money-coin').length,
    cls: Array.from(document.querySelectorAll('#money-view .hqz-coinface'))
      .map(e => Array.from(e.classList).find(c => c.indexOf('cv') === 0)),
  }));
  /* 🔒 ห้ามมีหน้าตาเหรียญชุดที่ 2 ในแอป — เด็กเจอเหรียญคนละแบบระหว่างเกมแล้วนับผิด */
  expect(r.owl, 'ต้องใช้เหรียญนกฮูก (.hqz-coinface)').toBeGreaterThan(0);
  expect(r.old, 'ห้ามเหลือเหรียญแบบเก่า (.money-coin)').toBe(0);
  r.cls.forEach(c => expect(['cv1', 'cv2', 'cv5', 'cv10'], 'ต้องเป็นเหรียญ 1/2/5/10').toContain(c));
});

test('🧩 แท็งแกรม: ทุกรูปต้องอยู่ในเวที และชิ้นในถาดต้องมีขนาดตามช่องที่มันใช้', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(() => {
    const over = [];
    TANGRAM_FIGURES.forEach(f => f.slots.forEach(sl => {
      const [x, y, w] = sl;
      /* ⚠ เวทีแท็งแกรมกว้าง 280×280 — ล้นแล้วชิ้นนั้นถูกตัดหาย เด็กมองไม่เห็นเงาที่ต้องวาง */
      if (x + w > 280 || y + w > 280) over.push(f.name + ' ' + sl.join(','));
    }));
    /* ทุกรูปต้องมีชิ้นครบและมีขนาดกำกับ */
    const bad = TANGRAM_FIGURES.filter(f => !f.slots.length || f.slots.some(sl => !(sl[2] > 0)));
    return { over, bad: bad.map(f => f.name), n: TANGRAM_FIGURES.length };
  });
  expect(r.n, 'ต้องมีรูปให้ต่อหลายแบบ').toBeGreaterThan(5);
  expect(r.over, 'ห้ามมีชิ้นไหนล้นออกนอกเวที (รูป/พิกัดที่ล้น)').toEqual([]);
  expect(r.bad, 'ทุกชิ้นต้องมีขนาดกำกับ').toEqual([]);
});

test('🤖 พาหุ่นยนต์: แผนที่ต้องเห็นครบโดยไม่ต้องเลื่อนจอ', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'robot', title: 'robot' }));
  await page.locator('#hqz-stage button').first().click();
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => {
    const st = document.querySelector('.code-iso-stage');
    const stage = document.getElementById('hqz-stage');
    if (!st) return null;
    const a = st.getBoundingClientRect(), b = stage.getBoundingClientRect();
    return { inView: a.top >= b.top - 2 && a.bottom <= b.bottom + 2,
             scroll: stage.scrollHeight - stage.clientHeight, w: a.width };
  });
  expect(r, 'ต้องมีแผนที่หุ่นยนต์').not.toBeNull();
  /* ⚠ ของเดิมเรียงลงมาคอลัมน์เดียว ⇒ ต้องเลื่อนจอ แล้วแผนที่ซึ่งเป็นตัวโจทย์หายไปจากสายตา */
  expect(r.scroll, 'การ์ดต้องไม่มีแถบเลื่อน').toBeLessThanOrEqual(2);
  expect(r.inView, 'แผนที่ต้องอยู่ในกรอบที่มองเห็น').toBe(true);
  expect(r.w, 'แผนที่ต้องใหญ่พอ').toBeGreaterThan(240);
});
