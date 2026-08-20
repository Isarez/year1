const { test, expect } = require('@playwright/test');

/* ============================================================
   🗂️ ปุ่ม "จัดการข้อมูล" ต้องเข้าถึงได้จาก 3 ที่  · 2026-08-17 (ผู้ใช้สั่ง)
     ① แถบบนของหน้าเลือกเด็ก (`#clear-btn` — ของเดิม)
     ② หน้าเลือกโหมด (`#landing-data` — ใหม่)
     ③ เมนูเฟืองในโหมดบ้านของหนู (`#house-data-btn` — ใหม่)

   🔒 **ทั้ง 3 ทางต้องเปิด `#clear-modal` ตัวเดียวกัน ห้ามทำกล่องใหม่ซ้ำ**
      ระบบย้ายข้อมูล/รีเซ็ต/ลบ ต้องมีทางเดียวจุดเดียว ไม่งั้นวันหลังแก้ที่หนึ่งแล้วอีกที่ค้างของเก่า
   ============================================================ */

const CHILD = { id: 'datamenu', name: 'ทดสอบข้อมูล', emoji: '🗂️', birthDate: '2018-01-15', grade: 'p2' };

async function pick(page) {
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
  /* ⚠ `?home=v1` — ตั้งแต่ 2026-08-20 หน้าแรกเป็นแบบรวมร่างซึ่ง **ไม่มีหน้าเลือกโหมดแล้ว**
     ทางเข้า "จัดการข้อมูล" ของหน้านั้นจึงเหลือปุ่มบนแถบหน้าเลือกเด็ก (#clear-btn) กับเมนูเฟือง
     ในโหมดบ้าน — เทสในไฟล์นี้คุมทั้ง 3 ทางเหมือนเดิม แต่ทางที่ 2 ต้องเปิดหน้าเก่ามาดู */
  await page.goto('/?home=v1');
  await page.locator('#child-select-view .child-card').first().click();
  await page.waitForSelector('#landing-view:not([hidden])', { timeout: 20000 });
}

test('หน้าเลือกโหมด: มีปุ่มจัดการข้อมูล และต้องเล็กกว่าการ์ด 2 ใบชัดเจน', async ({ page }) => {
  await pick(page);
  const size = await page.evaluate(() => {
    const d = document.getElementById('landing-data').getBoundingClientRect();
    const card = document.getElementById('landing-house').getBoundingClientRect();
    const back = document.getElementById('landing-back').getBoundingClientRect();
    return { dArea: d.width * d.height, cArea: card.width * card.height,
             sameRow: Math.abs(d.top - back.top) < 4 };
  });
  /* ⚠ ปุ่มนี้ห้ามใหญ่จนเด็กเข้าใจว่าเป็น "ทางเลือกที่ 3" ข้างการ์ดเข้าเมือง/ทำโจทย์ */
  expect(size.dArea, 'ต้องเล็กกว่าการ์ดหลักมาก').toBeLessThan(size.cArea * 0.25);
  expect(size.sameRow, 'ต้องอยู่แถวเดียวกับปุ่มเปลี่ยนคนเล่น').toBe(true);

  await page.locator('#landing-data').click();
  await expect(page.locator('#clear-modal')).not.toBeHidden();
  /* ต้องเป็นกล่องเดิมที่มีครบ 3 ทาง: ย้ายเครื่อง / รีเซ็ต / ลบ */
  await expect(page.locator('#export-child-btn')).toBeVisible();
  await expect(page.locator('#reset-progress-btn')).toBeVisible();
  await expect(page.locator('#delete-child-btn')).toBeVisible();
});

test('โหมดบ้านของหนู: เมนูเฟืองมีจัดการข้อมูล และกล่องต้องเปิดทับเมืองได้', async ({ page }) => {
  await pick(page);
  await page.locator('#house-entry-btn').dispatchEvent('click');
  /* ⚠ ต้องรอ ready() เสมอ — hMode เป็น 'world' ตั้งแต่ไฟล์โหลดเสร็จ ทั้งที่บ้านยังไม่พร้อม */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });

  const inGear = await page.evaluate(() => {
    const b = document.getElementById('house-data-btn');
    return !!(b && document.getElementById('house-ctrl-list').contains(b));
  });
  expect(inGear, 'ปุ่มต้องอยู่ในเมนูเฟือง').toBe(true);

  await page.locator('#house-ctrl-gear').click();
  await page.locator('#house-data-btn').click();
  await expect(page.locator('#clear-modal')).not.toBeHidden();

  const z = await page.evaluate(() => ({
    modal: +getComputedStyle(document.getElementById('clear-modal')).zIndex,
    house: +getComputedStyle(document.getElementById('house-view')).zIndex,
    gearOpen: !document.getElementById('house-ctrl-list').hidden,
  }));
  /* ⚠ กล่องต้องอยู่เหนือ #house-view ไม่งั้นกดแล้วเหมือนไม่มีอะไรเกิดขึ้น */
  expect(z.modal, 'กล่องต้องอยู่เหนือฉากเมือง').toBeGreaterThan(z.house);
  expect(z.gearOpen, 'เมนูเฟืองต้องปิดตัวเองหลังกด').toBe(false);
});
