const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" — หน้า "ปรับค่าต่างๆ" (เครื่องมือเทสระบบ · js/house-devtools.js)
   สิ่งที่ต้องไม่พังเด็ดขาด:
     1) **เป็นเครื่องมือเทส ไม่ใช่ของให้เด็กเล่น** ⇒ เมนูต้องมี * แดงต่อท้ายเสมอ
        และต้องปิดได้จากสวิตช์จุดเดียว (DEV_ENABLED) เหมือน QB_ENABLED ของหน้าคลังคำถาม
     2) ค่าที่ยัดต้องมีผลจริงกับระบบ (ไม่ใช่แค่เปลี่ยนตัวเลขบนจอ) — ความหิว/ป่วย/เงิน/สิทธิ์ของ
     3) เงินต้องผ่าน window.OwlCoins เท่านั้น (กติกาเหล็กข้อ 5)
     4) ปลดล็อกของแล้ว **ห้ามตัดเงิน** (เป็นของโกงสำหรับเทส ไม่ใช่การซื้อ) */

const CHILD = { id: 'dev-test', name: 'เทสปรับค่า', emoji: '🛠️', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const PKEY = 'p1quiz_progress_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
const SEED = { v: 1, mapV: 3, char: CHAR, pet: { type: 'dog', name: 'บราวนี่', color: 0 } };

async function openHouse(page, coins) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed, pkey, c]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
    localStorage.setItem(pkey, JSON.stringify({ coins: c }));
  }, [CHILD, HKEY, SEED, PKEY, coins == null ? 0 : coins]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseDev, null, { timeout: 30000 });
  await page.waitForFunction(
    () => window.__houseDbg && window.__houseDbg.mode() === 'world' && !window.__houseDbg.editing(),
    null, { timeout: 30000 });
  return errors;
}
const devOn = page => page.evaluate(() => window.HouseDev.enabled);
/* เปิดหน้าปรับค่า แล้วสลับไปแท็บที่ต้องการ */
async function openTab(page, name) {
  await page.evaluate(() => window.HouseDev.open());
  await expect(page.locator('#house-dev')).toBeVisible();
  await page.evaluate(n => {
    const b = Array.from(document.querySelectorAll('#hdev-tabs .he-tab')).find(x => x.textContent.includes(n));
    if (b) b.click();
  }, name);
  await page.waitForTimeout(200);
}
const clickBtn = (page, label) => page.evaluate(l => {
  const b = Array.from(document.querySelectorAll('#hdev-body .hdev-btn')).find(x => x.textContent.trim() === l);
  if (!b) throw new Error('ไม่เจอปุ่ม: ' + l);
  b.click();
}, label);

test.beforeEach(async ({ page }) => {
  const errors = await openHouse(page);
  if (!(await devOn(page))) test.skip(true, 'DEV_ENABLED = false (ปิดตอน deploy) — ข้ามชุดนี้');
  page.__errors = errors;
});

test('เมนูเทสในเมนูเฟืองต้องมี * แดงต่อท้ายทุกอัน (แยกจากเมนูของเด็กจริงๆ)', async ({ page }) => {
  await page.locator('#house-ctrl-gear').click();
  await page.waitForTimeout(400);
  const items = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-ctrl-list .house-ctrl-item'))
      .filter(b => b.style.display !== 'none')
      .map(b => ({ id: b.id, star: !!b.querySelector('.hc-test-star') })));
  const byId = {};
  items.forEach(i => { byId[i.id] = i.star; });
  expect(byId['house-dev-btn']).toBe(true);
  expect(byId['house-qb-btn']).toBe(true);
  /* เมนูปกติของเด็กต้องไม่มีดาว */
  expect(byId['house-theme-toggle']).toBe(false);
  expect(byId['house-exit-btn']).toBe(false);
  /* ดาวต้องเป็นสีแดงจริงในเบราว์เซอร์ ไม่ใช่แค่มี element */
  const col = await page.evaluate(() =>
    getComputedStyle(document.querySelector('#house-dev-btn .hc-test-star')).color);
  expect(col).toBe('rgb(225, 75, 60)');
});

test('แท็บความหิว: ตั้งค่าความอิ่ม/ป่วยแล้วมีผลจริงกับระบบและกับแถบสถานะบนจอ', async ({ page }) => {
  await openTab(page, 'ความหิวสัตว์');

  await clickBtn(page, '0');
  expect(await page.evaluate(() => window.HousePetCare.fullness())).toBe(0);
  await expect.poll(() => page.evaluate(() => document.getElementById('hpb-fill').style.width)).toBe('4%');

  await clickBtn(page, '75');
  expect(await page.evaluate(() => window.HousePetCare.fullness())).toBe(75);

  await clickBtn(page, 'ทำให้ป่วย 🤒');
  expect(await page.evaluate(() => window.HousePetCare.isSick())).toBe(true);
  /* ⚠ ปุ่ม "พาไปหาหมอ" ย้ายไปอยู่ในเมนูฟองของน้องแล้ว (2026-08-15)
     แถบสถานะจึงบอกความป่วยด้วย **หน้าตาของแถบ** แทน: ติดคลาสเตือน + หลอดความอิ่มว่าง */
  await expect.poll(() => page.evaluate(() => ({
    warn: document.getElementById('house-pet-bar').classList.contains('hpb-warn'),
    fill: document.getElementById('hpb-fill').style.width,
  }))).toEqual({ warn: true, fill: '0%' });

  await clickBtn(page, 'รักษาให้หาย');
  expect(await page.evaluate(() => window.HousePetCare.isSick())).toBe(false);
  expect(await page.evaluate(() => window.HousePetCare.fullness())).toBe(100);
  expect(page.__errors).toEqual([]);
});

test('แท็บความหิว: ปุ่มอาหารเติม/ล้างคลังได้จริง และแถบสถานะอัปเดตตาม', async ({ page }) => {
  await openTab(page, 'ความหิวสัตว์');
  await clickBtn(page, 'อาหารหมดเกลี้ยง');
  expect(await page.evaluate(() => window.HousePetCare.meals('meat'))).toBe(0);
  await expect.poll(() => page.evaluate(() => document.getElementById('hpb-left').textContent)).toBe('×0');

  await clickBtn(page, '+5 มื้อ (ของสัตว์ตัวนี้)');
  expect(await page.evaluate(() => window.HousePetCare.meals('meat'))).toBe(5);
  await expect.poll(() => page.evaluate(() => document.getElementById('hpb-left').textContent)).toBe('×5');

  await clickBtn(page, '+5 มื้อ ทุกชนิด');
  expect(await page.evaluate(() => window.HousePetCare.meals('bamboo'))).toBe(5);
  expect(page.__errors).toEqual([]);
});

test('แท็บเงิน: เพิ่ม/ตั้งยอดผ่าน OwlCoins เท่านั้น', async ({ page }) => {
  await openTab(page, 'เงิน');
  expect(await page.evaluate(() => window.OwlCoins.get())).toBe(0);
  await clickBtn(page, '+500');
  expect(await page.evaluate(() => window.OwlCoins.get())).toBe(500);
  await clickBtn(page, '+1000');
  expect(await page.evaluate(() => window.OwlCoins.get())).toBe(1500);
  await clickBtn(page, '20,000');
  expect(await page.evaluate(() => window.OwlCoins.get())).toBe(20000);
  await clickBtn(page, '0');
  expect(await page.evaluate(() => window.OwlCoins.get())).toBe(0);
  expect(page.__errors).toEqual([]);
});

test('แท็บปลดล็อก: ได้ของจริงทุกชิ้นโดย **ไม่ตัดเงิน** และล้างสิทธิ์กลับได้', async ({ page }) => {
  await openTab(page, 'ปลดล็อกของ');
  const before = await page.evaluate(() => window.OwlCoins.get());

  await clickBtn(page, '🔓 ปลดล็อกหมดทั้งเกม');
  const own = await page.evaluate(() => ({
    coins: window.OwlCoins.get(),
    panda: window.HouseShop.ownsPet('panda'),
    unicornColor: window.HouseShop.ownsPetColor('unicorn', 1),
    sofa: window.HouseShop.ownsFurn('sofa'),
  }));
  expect(own.coins).toBe(before);            /* ของโกง ไม่ใช่การซื้อ — ห้ามตัดเงิน */
  expect(own.panda).toBe(true);
  expect(own.unicornColor).toBe(true);
  expect(own.sofa).toBe(true);

  await clickBtn(page, 'คืนค่าเป็นเด็กใหม่');
  expect(await page.evaluate(() => window.HouseShop.ownsPet('panda'))).toBe(false);
  expect(page.__errors).toEqual([]);
});

test('ปิดหน้าปรับค่า: ปิดด้วยปุ่มในกล่องตัวเอง และ **ห้ามมีปุ่ม ← โผล่มาซ้อน**', async ({ page }) => {
  await page.evaluate(() => window.HouseDev.open());
  await expect(page.locator('#house-dev')).toBeVisible();
  /* กล่องนี้มีปุ่มปิดของตัวเองแล้ว ⇒ ปุ่ม ← มุมจอต้องไม่โผล่มาซ้อน (ผู้ใช้สั่ง 2026-08-09) */
  await expect(page.locator('#house-back')).toBeHidden();
  await page.locator('#hdev-close').click();
  await expect(page.locator('#house-dev')).toBeHidden();
  expect(await page.locator('#house-view').isHidden()).toBe(false);   /* ยังไม่ออกจากบ้าน */
  expect(page.__errors).toEqual([]);
});
