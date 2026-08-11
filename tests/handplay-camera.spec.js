/* ============================================================
   โหมดมือ — เปิดกล้องจริงในโหมดบ้าน (ใช้กล้องปลอมของ chromium)
   ⚠ แยกไฟล์เพราะ launchOptions ต้องอยู่ระดับบนสุดของไฟล์ (Playwright บังคับ)
   ============================================================ */
const { test, expect } = require('@playwright/test');

/* เทสพฤติกรรมจริง — เปิดกล้อง (กล้องปลอมของ chromium) แล้วดูว่ากราฟคายผลลัพธ์ออกมาไหม
 ⚠ กล้องปลอมเป็นลายเคลื่อนไหว ไม่ใช่มือคน ⇒ ตรวจได้แค่ว่า "ท่อทำงาน" ไม่ใช่ "เจอมือ"
   แต่พอ: ตอนไฟล์หาย มันจะ abort ตั้งแต่เฟรมแรก ผลลัพธ์เป็น 0 เสมอ */
test.use({
launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
permissions: ['camera'],
});
const CHILD = { id: 'mp1', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };

test('เปิดกล้องในการ์ดเควสต์แล้ว MediaPipe ประมวลผลได้จริง (ไม่ abort)', async ({ page }) => {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('response', r => { if (r.status() >= 400 && /mediapipe/.test(r.url())) errs.push('HTTP ' + r.status() + ' ' + r.url()); });
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({ v: 1, mapV: 3,
      char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'quiz', title: '🧪 กล้อง' }));
  await expect(page.locator('#handplay-toggle')).toBeVisible();

  await page.locator('#handplay-toggle').click();
  /* รอให้ wasm โหลด + กล้องติด (ก้อนใหญ่ ~12 MB ผ่าน localhost) */
  await page.waitForFunction(() => typeof hpActive !== 'undefined' && hpActive === true, null, { timeout: 40000 });
  expect(await page.evaluate(() => document.getElementById('hp-layer').hidden)).toBe(false);

  const n = await page.evaluate(async () => {
    window.__n = 0;
    hpHands.onResults(() => { window.__n++; });
    await new Promise(r => setTimeout(r, 3000));
    return window.__n;
  });
  console.log('MediaPipe คายผลลัพธ์', n, 'เฟรมใน 3 วินาที');
  expect(n, 'MediaPipe ไม่ประมวลผลเลย = ไฟล์โมเดลหายหรือ abort').toBeGreaterThan(0);
  expect(errs).toEqual([]);

  /* ปิดกล้องให้เรียบร้อยก่อนจบเทส */
  await page.evaluate(() => stopHandPlay());
});
