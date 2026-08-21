const { test, expect } = require('@playwright/test');

/* ============================================================
   🗂️ ปุ่ม "จัดการข้อมูล" ต้องเข้าถึงได้เสมอ · 2026-08-17 (ผู้ใช้สั่ง)
     ① แถบบนของหน้าเลือกเด็ก (`#clear-btn` — ของเดิม)
     ② เมนูเฟืองในโหมดบ้านของหนู (`#house-data-btn`)
   ⚠ **เดิมมีทางที่ 3 คือปุ่มบนหน้าเลือกโหมด (`#landing-data`)** — หน้าเลือกโหมดถูกถอดออก
     ทั้งหน้าแล้ว 2026-08-21 (แทนด้วยหน้าแรกแบบรวมร่าง) ทางนั้นจึงหายไปด้วย
     เทสของทางที่ 3 **ถูกเปลี่ยนเป็นตัวคุมว่า "หน้าเลือกเด็กต้องมีปุ่มนี้อยู่จริง" ไม่ได้ลบทิ้ง**
     (หน้าแรกใหม่ = หน้าเลือกเด็ก ⇒ ทางที่ ① อยู่ตรงหน้าเด็กอยู่แล้ว)

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
  await page.goto('/');
  await page.waitForSelector('#child-list .child-card');
}

test('หน้าแรก: แตะชื่อเด็กแล้วต้องมีทางเข้าจัดการข้อมูล และเปิดกล่องเดิมได้', async ({ page }) => {
  await pick(page);
  await page.locator('#child-select-view .child-card').first().click();
  const dat = page.locator('.h2-data');
  await expect(dat, 'หน้าแรกต้องมีทางเข้าจัดการข้อมูลเสมอ').toBeVisible();
  /* ⚠ ต้อง "เบา" กว่าปุ่มโหมดชัดเจน เด็กจะได้ไม่เข้าใจว่าเป็นทางเลือกที่ 3
     วัดจาก **ความสูง** ไม่ใช่พื้นที่ — ตัวนี้เป็นลิงก์ข้อความกินเต็มแถวของตัวเอง
     พื้นที่จึงกว้างกว่าปุ่มได้ทั้งที่ดูเบากว่ามาก */
  const sz = await page.evaluate(()=>{
    const d = document.querySelector('.h2-data').getBoundingClientRect();
    const m = document.querySelector('.h2-mode').getBoundingClientRect();
    return {d:d.height, m:m.height, own: d.top >= m.bottom - 1};
  });
  expect(sz.d, 'ต้องเตี้ยกว่าปุ่มโหมดชัดเจน').toBeLessThan(sz.m * 0.6);
  expect(sz.own, 'ต้องอยู่แถวของตัวเอง ไม่เรียงข้างปุ่มโหมด').toBe(true);
  await dat.click();
  await expect(page.locator('#clear-modal')).not.toBeHidden();
  /* ต้องเป็นกล่องเดิมที่มีครบ 3 ทาง: ย้ายเครื่อง / รีเซ็ต / ลบ */
  await expect(page.locator('#export-child-btn')).toBeVisible();
  await expect(page.locator('#reset-progress-btn')).toBeVisible();
  await expect(page.locator('#delete-child-btn')).toBeVisible();
});

test('โหมดบ้านของหนู: เมนูเฟืองมีจัดการข้อมูล และกล่องต้องเปิดทับเมืองได้', async ({ page }) => {
  await pick(page);
  await page.locator('#child-select-view .child-card').first().click();
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
