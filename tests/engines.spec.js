const { test, expect } = require('@playwright/test');
const { openApp, visibleViews, startCat } = require('./helpers');

/* เปิดทุกหมวดที่ไม่ต้องใช้กล้อง แล้วยืนยันว่า
   1) เปิด view ถูกตัว  2) เหลือ view ที่มองเห็นทีละ 1  3) ไม่มี JS error
   นี่คือตะแกรงหลักเวลาแยกไฟล์ JS — ถ้า global หลุดไฟล์ไหน เทสนี้จะจับได้ทันที */
test('ทุกหมวดที่ไม่ใช่ AR เปิดได้และเหลือ view เดียว', async ({ page }) => {
  const errors = await openApp(page);
  const ids = await page.evaluate(() => CATS.map(c => c.id));
  const failures = [];
  for (const id of ids) {
    let mode;
    try { mode = await startCat(page, id); }
    catch (e) { failures.push(id + ' เปิดไม่ได้: ' + e.message); continue; }
    if (mode === 'ar-skip') continue;
    const vis = await visibleViews(page);
    if (vis.length !== 1) failures.push(id + ' เหลือ view ' + vis.length + ' ตัว: ' + vis.join(','));
  }
  expect(failures, failures.join('\n')).toEqual([]);
  expect(errors.filter(e => !/speechSynthesis|AudioContext|play\(\)/i.test(e))).toEqual([]);
});

test('เล่นควิซจนจบแล้วเข้าหน้าสรุปผลได้ดาว', async ({ page }) => {
  await openApp(page, { grade: 'p6' });
  await startCat(page, 'p6-math1');
  for (let i = 0; i < 40; i++) {
    const done = await page.evaluate(() => !document.getElementById('result-view').hidden);
    if (done) break;
    await page.evaluate(() => {
      const c = document.querySelector('#quiz-view .choice-btn:not([disabled])'); if (c) c.click();
      const n = document.querySelector('#quiz-view .next-btn'); if (n && !n.hidden) n.click();
    });
  }
  expect(await visibleViews(page)).toEqual(['result-view']);
  expect(await page.locator('#stars-row span').count()).toBe(3);
});

test('เกมใหม่ 4 แบบเล่นผ่านด่านได้จริง', async ({ page }) => {
  await openApp(page, { grade: 'p6' });
  // ต่อวงจรไฟฟ้า: หมุนทุกชิ้นให้ตรงคำตอบแล้วกดเปิดไฟ
  const circuit = await page.evaluate(() => {
    window.startCircuitGame('p6-circuit');
    for (const k in circuitGame.cells) {
      const cell = circuitGame.cells[k];
      if (!cell.fixed) cell.rot = 0;
    }
    window.renderCircuitGrid();
    document.getElementById('circuit-check').click();
    return { locked: circuitGame.locked, mistakes: circuitGame.mistakes };
  });
  expect(circuit.locked).toBe(true);
  expect(circuit.mistakes).toBe(0);

  // เรียงลำดับ: สลับให้ถูกแล้วตรวจ
  const order = await page.evaluate(() => {
    window.startOrderGame('p6-order');
    const g = orderGame;
    g.cards.sort((a, b) => a.ord - b.ord);
    window.renderOrderRow();
    document.getElementById('order-check').click();
    return { locked: g.locked, mistakes: g.mistakes };
  });
  expect(order.locked).toBe(true);

  // กระจกวิเศษ: ระบายให้ครบ
  const mirror = await page.evaluate(() => {
    window.startMirrorGame('p6-mirror');
    const g = mirrorGame, pic = g.pic, half = g.half;
    for (let r = 0; r < pic.rows.length; r++)
      for (let c = 0; c < half; c++) g.right[r][c] = pic.rows[r][half - 1 - c];
    window.renderMirrorBoard();
    document.getElementById('mirror-check').click();
    return { locked: g.locked };
  });
  expect(mirror.locked).toBe(true);

  // แท็งแกรม: วางทุกชิ้นให้ตรงชนิด+มุม
  const tangram = await page.evaluate(() => {
    window.startTangramGame('p6-tangram');
    const g = tangramGame;
    g.slots.forEach(slot => {
      const p = g.pieces.find(x => !x.used && x.type === slot.type);
      if (!p) return;
      p.rot = slot.rot; p.used = true; slot.filled = true;
    });
    window.renderTangramBoard();
    return { filled: g.slots.every(s => s.filled) };
  });
  expect(tangram.filled).toBe(true);
});

test('โหมดบ้าน 3D: กดเข้าแล้วโหลดสคริปต์เอง และซ่อน view เกมที่ค้างอยู่', async ({ page }) => {
  await openApp(page, { grade: 'p6' });
  await startCat(page, 'p6-chart');                       // เปิดเกมค้างไว้ก่อน
  expect(await visibleViews(page)).toEqual(['chart-view']);
  // ปุ่มอยู่ในหน้าหลักที่ถูกซ่อนอยู่ (จงใจเปิดเกมค้างไว้) จึงยิง event ตรงแทนการคลิกจริง
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => typeof window.THREE !== 'undefined', null, { timeout: 30000 });
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  expect(await visibleViews(page)).toEqual(['house-view']);   // chart-view ต้องถูกซ่อนไปแล้ว
  await page.click('#house-view .back-btn');
  expect(await visibleViews(page)).toEqual(['home-view']);
});
