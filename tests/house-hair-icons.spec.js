const { test, expect } = require('@playwright/test');

/* ============================================================
   💇 ไอคอนทรงผมในหน้าแต่งตัวต้องเปลี่ยนตามเพศ  · 2026-08-17 (ผู้ใช้แจ้ง)

   🐞 บั๊กที่แก้: `addHair(head, girl, style, hex)` ใน js/house-avatar.js วาด **ทรงคนละชุดกันสนิท**
      ระหว่างชายกับหญิงที่ index เดียวกัน (ชาย = แสกข้าง/สไปก์/เกรียน · หญิง = หางม้า/แกละ/เปีย)
      แต่ `outfitIcon('hair', i)` มีตารางเดียวคือของเด็กชาย ⇒ เลือกเป็นเด็กผู้หญิงแล้ว
      **รูปตัวอย่างไม่เปลี่ยนตาม** เด็กเห็นรูปทรงชาย แต่กดแล้วได้ทรงหญิงที่ไม่ตรงกับรูปเลย

   🔒 กติกาที่ต้องคงไว้: **ลำดับไอคอนต้องตรงกับ case ใน addHair() ทั้ง 2 ฝั่ง**
      เพิ่มทรงใหม่ต้องต่อท้ายพร้อมกันทั้ง js/house-avatar.js และตารางไอคอนใน js/house-map.js
   ============================================================ */

const CHILD = { id: 'hairic', name: 'ทดสอบผม', emoji: '👧', birthDate: '2018-01-15', grade: 'p2' };

async function openCreator(page) {
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
  await page.locator('#house-edit-btn').click();
  await page.waitForFunction(() => document.querySelectorAll('#house-creator-rows > div').length > 3,
    null, { timeout: 15000 });
}

/* คืน HTML ของชิปทั้งแถว "ทรงผม" ในหน้าแต่งตัว */
async function hairChips(page) {
  return page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#house-creator-rows > div'));
    const r = rows.find(x => (x.querySelector('.house-row-label') || {}).textContent
                             && x.querySelector('.house-row-label').textContent.indexOf('ทรงผม') >= 0);
    if (!r) return null;
    return Array.from(r.querySelectorAll('.house-chip')).map(b => b.innerHTML);
  });
}

test('ไอคอนทรงผม: ชายกับหญิงต้องเป็นคนละรูปทุกแบบ และครบตามจำนวนทรงจริง', async ({ page }) => {
  await openCreator(page);
  /* วัดจาก **ชิปจริงบนหน้าจอ** ไม่ใช่จากตารางในโค้ด — เทสนี้ต้องจับได้ถ้าวันหลัง
     มีคนแก้ตารางไอคอนแล้วลืมต่อสายเข้าหน้าแต่งตัว */
  const boy = await hairChips(page);
  expect(boy, 'ต้องหาแถวทรงผมเจอ').not.toBeNull();
  expect(boy.length, 'ต้องมีทรงผมอย่างน้อย 12 แบบ').toBeGreaterThanOrEqual(12);

  /* สลับเป็นเด็กผู้หญิง แล้วชิปทุกอันต้องเปลี่ยนรูป */
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#house-creator-rows > div'));
    const g = rows.find(x => {
      const l = x.querySelector('.house-row-label');
      return l && (l.textContent.indexOf('เพศ') >= 0 || l.textContent.indexOf('หนู') >= 0);
    });
    const chips = g ? g.querySelectorAll('.house-chip') : [];
    if (chips[1]) chips[1].click();
  });
  await page.waitForTimeout(600);
  const girl = await hairChips(page);

  expect(girl.length, 'สลับเพศแล้วจำนวนชิปต้องเท่าเดิม').toBe(boy.length);
  const unchanged = [];
  girl.forEach((g, i) => { if (g === boy[i]) unchanged.push(i); });
  /* 🔒 หัวใจของบั๊ก — ทุกแบบต้องเปลี่ยนรูป ไม่ใช่แค่บางแบบ */
  expect(unchanged, 'ทุกทรงต้องเปลี่ยนรูปตามเพศ (index ที่ยังเหมือนเดิม)').toEqual([]);
  girl.forEach((g, i) => expect(g.length, 'ไอคอนหญิงแบบที่ ' + i + ' ต้องไม่ว่าง').toBeGreaterThan(30));
});
