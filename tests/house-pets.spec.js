const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" เฟส 3A — ร้านสัตว์เลี้ยง (js/house-shop.js + จุดต่อใน js/house.js)
   สิ่งที่ต้องไม่พังเด็ดขาด:
     1) **เด็กที่เลี้ยงสัตว์อยู่ก่อนแล้วต้องไม่เสียเพื่อนตัวน้อย** — เมื่อก่อนสัตว์แจกฟรี พอเปิดร้าน
        ถ้าไม่แจกสิทธิ์ย้อนหลัง สัตว์ของเขาจะกลายเป็นล็อกทันที (ผิดกติกาเหล็กข้อ 3)
     2) ราคาต้องตรงตารางข้อ 17.1 ของแผนแม่บท — **เทสนี้คือตัวคุมไม่ให้ใครลดราคาโดยไม่ตั้งใจ**
        สัตว์คือ money sink ก้อนใหญ่ที่สุดของเกม ถ้าถูกลงเด็กได้ครบเร็วแล้วเบื่อ
     3) เงินต้องตัดผ่าน window.OwlCoins เท่านั้น และเงินไม่พอต้องซื้อไม่ได้
     4) ไม่มีสัตว์ = ไม่มีบ้านสัตว์ (ข้อ 18.1) · ปล่อยคืนแล้วบ้านหาย แต่สิทธิ์ยังอยู่ (รับกลับมาเลี้ยงฟรี)
     5) ห้ามมี dead end — ตัวที่ยังไม่ได้ซื้อยัง "เห็นอยู่" พร้อมราคา ไม่ใช่หายไปเฉยๆ */

const CHILD = { id: 'pet-test', name: 'เทสสัตว์', emoji: '🐾', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const PKEY = 'p1quiz_progress_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* มีบ้านอยู่แล้ว → ข้ามหน้าสร้างตัวละคร เข้าเมืองได้เลย */
const SEED = { v: 1, mapV: 3, char: CHAR };

async function openHouse(page, seedHouse, coins) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed, pkey, c]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
    if (c != null) localStorage.setItem(pkey, JSON.stringify({ coins: c }));
  }, [CHILD, HKEY, seedHouse || SEED, PKEY, coins == null ? null : coins]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseShop, null, { timeout: 30000 });
  await page.waitForTimeout(1100);
  return errors;
}
const readHouse = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), HKEY);
const coinsOf = page => page.evaluate(() => window.OwlCoins.get());
const petHouses = d => ((d.decor && d.decor.out) || []).filter(r => r.id === 'pet-house').length;

/* ผู้ใช้สั่ง 2026-08-09: ปุ่ม ← ต้องโผล่ **แค่ 3 หน้า** คือ แต่งตัว · สัตว์เลี้ยง · แต่งบ้าน
   ที่เหลือซ่อนหมด (รวมตอนเปิดร้าน/การ์ด/หน้าเทส) เพราะกล่องพวกนั้นมีปุ่มปิดของตัวเองอยู่แล้ว
   ⇒ เดินเล่นในเมืองปกติจะไม่มีปุ่ม ← เลย ทางออกอยู่ที่ "ออกจากบ้าน" ในเมนูเฟือง */
test('ปุ่ม ← โผล่แค่หน้าแต่งตัว/สัตว์เลี้ยง/แต่งบ้าน — เดินเล่นปกติหรือเปิดร้านต้องไม่มี', async ({ page }) => {
  const errors = await openHouse(page, null, 400);
  const back = page.locator('#house-back');

  await expect(back).toBeHidden();                       /* เดินเล่นในเมืองปกติ */

  await page.evaluate(() => window.HouseShop.open('shop-pet'));
  await expect(page.locator('#house-shop')).toBeVisible();
  await expect(back).toBeHidden();                       /* เปิดร้านอยู่ก็ยังไม่มี (ร้านมีปุ่มออกเอง) */
  await page.evaluate(() => window.HouseShop.close());
  await page.waitForTimeout(300);

  await page.locator('#house-pet-btn').click();          /* หน้าสัตว์เลี้ยง */
  await expect(page.locator('#house-pet-picker')).toBeVisible();
  await expect(back).toBeVisible();
  await page.locator('#house-pet-skip').click();
  await page.waitForTimeout(900);

  await page.locator('#house-edit-btn').click();         /* หน้าแต่งตัว */
  await expect(page.locator('#house-creator')).toBeVisible();
  await expect(back).toBeVisible();
  await page.locator('#house-back').click();             /* ← ที่นี่คือ "ยกเลิก" กลับไปชุดเดิม */
  await page.waitForTimeout(900);
  await expect(back).toBeHidden();

  await page.locator('#house-decorate-btn').click();     /* โหมดแต่งบ้าน */
  await expect.poll(() => page.evaluate(() => window.__houseDbg.editing())).toBe(true);
  await expect(back).toBeVisible();
  expect(errors).toEqual([]);
});

test('ราคาสัตว์ + สีขน ตรงตารางข้อ 17.1 (ตัวคุมไม่ให้ลดราคาโดยไม่ตั้งใจ)', async ({ page }) => {
  const errors = await openHouse(page);
  const p = await page.evaluate(() => ({
    price: window.HouseShop.PET_PRICE,
    color: window.HouseShop.PET_COLOR_PRICE,
    groups: window.HouseShop.PET_GROUPS.map(g => g.ids.length),
    types: window.HouseShop.petTypes().map(t => t.id),
  }));
  expect(p.color).toBe(100);
  expect(p.price).toEqual({
    dog: 250, cat: 250, rabbit: 250, chick: 250,
    hamster: 450, turtle: 450, frog: 450, pig: 450,
    sheep: 800, penguin: 800,
    panda: 1500, unicorn: 1500,
  });
  /* สัตว์ทุกชนิดในเกมต้องมีราคา ไม่งั้นจะมีตัวที่ซื้อไม่ได้เลย = dead end */
  p.types.forEach(t => expect(p.price[t], 'ราคาของ ' + t).toBeGreaterThan(0));
  expect(p.groups.reduce((a, b) => a + b, 0)).toBe(p.types.length);
  expect(errors).toEqual([]);
});

test('เด็กใหม่: ยังไม่มีสัตว์ ⇒ ไม่มีบ้านสัตว์ในสนาม + หน้าเลือกสัตว์ล็อกทุกตัวแต่ยังเห็นราคา', async ({ page }) => {
  const errors = await openHouse(page, null, 0);
  const d = await readHouse(page);
  /* ⚠ ECON_VER 5 (2026-08-13): เฟอร์นิเจอร์นับเป็นจำนวนชิ้น (`d.owned`) แทนสิทธิ์ครั้งเดียว */
  expect(d.econVer).toBe(5);
  expect(petHouses(d), 'เด็กใหม่ต้องยังไม่มีบ้านสัตว์ (ข้อ 18.1)').toBe(0);
  expect(d.pet == null).toBe(true);

  await page.locator('#house-pet-btn').dispatchEvent('click');
  await page.waitForTimeout(1000);
  const n = await page.evaluate(() => window.HouseShop.petTypes().length);
  await expect(page.locator('#house-pet-chips .house-pet-chip')).toHaveCount(n);
  /* ห้ามซ่อนตัวที่ยังซื้อไม่ได้ — ต้องเห็นครบพร้อมป้ายราคา (กติกาเหล็กข้อ 1: ไม่มี dead end) */
  await expect(page.locator('#house-pet-chips .house-pet-chip.locked')).toHaveCount(n);
  await expect(page.locator('#house-pet-chips .house-pet-chip-lock')).toHaveCount(n);
  expect(await page.locator('#house-pet-done').isHidden(), 'ยังไม่มีสัตว์ ⇒ ปุ่มรับเลี้ยงต้องซ่อน').toBe(true);
  await expect(page.locator('#house-pet-sub')).toContainText('ร้านสัตว์เลี้ยง');
  expect(errors).toEqual([]);
});

test('migration: เด็กที่เลี้ยงสัตว์อยู่ก่อนเปิดร้าน ต้องได้ชนิด+สีนั้นฟรี และสัตว์/บ้านสัตว์ต้องไม่หาย', async ({ page }) => {
  /* สภาพก่อนเฟส 3A: econVer 3 · เลือกแพนด้าสีที่ 2 มาฟรี · บ้านสัตว์ถูก seed ไว้ในสนาม */
  const legacy = {
    v: 1, mapV: 3, econVer: 3, worldSeeded: true, char: CHAR,
    pet: { type: 'panda', name: 'ไผ่หวาน', color: 1 },
    decor: { out: [{ id: 'pet-house', x: 3, z: 3, rot: 0, col: 0 }], in: [] },
    unlocked: [],
  };
  const errors = await openHouse(page, legacy, 0);
  const d = await readHouse(page);
  /* ⚠ ECON_VER 5 (2026-08-13): เฟอร์นิเจอร์นับเป็นจำนวนชิ้น (`d.owned`) แทนสิทธิ์ครั้งเดียว */
  expect(d.econVer).toBe(5);
  expect(d.pet).toEqual({ type: 'panda', name: 'ไผ่หวาน', color: 1 });
  expect(petHouses(d), 'บ้านสัตว์ที่วางอยู่แล้วห้ามหาย').toBe(1);

  const own = await page.evaluate(() => ({
    panda: window.HouseShop.ownsPet('panda'),
    col0: window.HouseShop.ownsPetColor('panda', 0),
    col1: window.HouseShop.ownsPetColor('panda', 1),
    dog: window.HouseShop.ownsPet('dog'),
  }));
  expect(own.panda, 'แพนด้าที่เลี้ยงอยู่ต้องได้ฟรี (กติกาเหล็กข้อ 3)').toBe(true);
  expect(own.col0).toBe(true);
  expect(own.col1, 'สีที่ใช้อยู่ต้องได้ฟรีด้วย').toBe(true);
  expect(own.dog, 'ตัวที่ไม่เคยเลี้ยงต้องยังต้องซื้อ').toBe(false);

  /* เงิน 0 แต่ยังเปิดหน้าเลือกสัตว์แล้วกดบันทึกแพนด้าตัวเดิมได้ ไม่ติดตัน */
  await page.locator('#house-pet-btn').dispatchEvent('click');
  await page.waitForTimeout(1000);
  expect(await page.locator('#house-pet-done').isHidden()).toBe(false);
  await expect(page.locator('#house-pet-chips .house-pet-chip.active')).toContainText('แพนด้า');
  expect(errors).toEqual([]);
});

test('ซื้อสัตว์: ตัดเงินผ่าน OwlCoins · เงินไม่พอซื้อไม่ได้ · ซื้อแล้วพาไปตั้งชื่อรับเลี้ยงต่อ', async ({ page }) => {
  const errors = await openHouse(page, null, 300);
  expect(await coinsOf(page)).toBe(300);

  await page.evaluate(() => window.HouseShop.open('shop-pet'));
  await page.waitForTimeout(700);
  /* 4 แท็บกลุ่มราคาสัตว์ + อาหาร (เฟส 3B) + ปลอกคอ/ของเล่น (เฟส 12) */
  await expect(page.locator('#house-shop-tabs .he-tab')).toHaveCount(7);
  await expect(page.locator('#house-shop-tabs .he-tab').nth(4)).toContainText('อาหาร');
  await expect(page.locator('#house-shop-tabs .he-tab').last()).toContainText('ของเล่น');

  /* เงิน 300 ซื้อแพนด้า 1,500 ไม่ได้ */
  const rich = await page.evaluate(() => window.HouseShop.buyPet('panda'));
  expect(rich).toBe(false);
  expect(await coinsOf(page)).toBe(300);
  expect(await page.evaluate(() => window.HouseShop.ownsPet('panda'))).toBe(false);

  /* ซื้อหมาน้อย 250 ผ่านการ์ดจริงในร้าน */
  await page.evaluate(() => {
    const c = Array.from(document.querySelectorAll('#house-shop-items .hs-card'))
      .find(b => b.textContent.includes('หมาน้อย'));
    c.click();
  });
  await page.waitForTimeout(300);
  await page.locator('#house-shop-buy .hs-buy-btn').click();
  await page.waitForTimeout(2200);
  expect(await coinsOf(page)).toBe(50);
  expect(await page.evaluate(() => window.HouseShop.ownsPet('dog'))).toBe(true);
  /* สีแรกต้องแถมมากับตัว ไม่งั้นซื้อสัตว์แล้วไม่มีสีให้ใช้ */
  expect(await page.evaluate(() => window.HouseShop.ownsPetColor('dog', 0))).toBe(true);
  expect(await page.evaluate(() => window.HouseShop.ownsPetColor('dog', 1))).toBe(false);
  /* ซื้อแล้วต้องพาไปหน้าตั้งชื่อทันที (เด็ก 5 ขวบไม่ควรต้องเดาว่าต้องกดปุ่มไหนต่อ) */
  expect(await page.locator('#house-pet-picker').isHidden()).toBe(false);
  await expect(page.locator('#house-pet-chips .house-pet-chip.active')).toContainText('หมาน้อย');
  expect(errors).toEqual([]);
});

test('บ้านสัตว์ตามเงื่อนไข: รับเลี้ยง → บ้านโผล่ · ปล่อยคืน → บ้านหาย แต่สิทธิ์ยังอยู่ (รับกลับมาฟรี)', async ({ page }) => {
  const errors = await openHouse(page, null, 300);
  await page.evaluate(() => window.HouseShop.buyPet('dog'));
  await page.waitForTimeout(2200);
  await page.locator('#house-pet-done').dispatchEvent('click');
  await page.waitForTimeout(1500);

  let d = await readHouse(page);
  expect(d.pet.type).toBe('dog');
  expect(petHouses(d), 'รับเลี้ยงแล้วต้องมีบ้านสัตว์ 1 หลัง').toBe(1);

  await page.locator('#house-pet-btn').dispatchEvent('click');
  await page.waitForTimeout(1000);
  await page.locator('#house-pet-remove').dispatchEvent('click');
  await page.waitForTimeout(1500);

  d = await readHouse(page);
  expect(d.pet == null).toBe(true);
  expect(petHouses(d), 'ปล่อยคืนแล้วบ้านสัตว์ต้องหายไปด้วย (ข้อ 18.1)').toBe(0);
  /* สิทธิ์ยังอยู่ ⇒ รับกลับมาเลี้ยงใหม่ได้ฟรี ไม่ต้องจ่ายอีกรอบ (กันเด็กเสียดายจนไม่กล้าลองตัวอื่น) */
  expect(await page.evaluate(() => window.HouseShop.ownsPet('dog'))).toBe(true);
  expect(await coinsOf(page)).toBe(50);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่งแก้ 2026-08-09: เดิมกางสีของสัตว์ "ทุกตัวที่มี" เป็น section ต่อกันยาวเรื่อยๆ
   เปลี่ยนเป็น **แตะเลือกสัตว์ตัวไหน สีของตัวนั้นถึงโผล่** — section เดียวเสมอ ไม่แยกตามชนิด
   และ **สัตว์ที่ยังไม่มีก็ต้องดูสีได้** (ดูตัวอย่างก่อนตัดสินใจเก็บเงิน) แต่ยังซื้อสีไม่ได้ */
test('ร้านสัตว์: สัตว์ที่ยังไม่มีก็เลือกดูสีได้ แต่ซื้อสีไม่ได้จนกว่าจะรับมาเลี้ยง', async ({ page }) => {
  const errors = await openHouse(page, null, 400);
  await page.evaluate(() => window.HouseShop.open('shop-pet'));
  await page.waitForTimeout(700);
  /* เด็กใหม่ยังไม่มีสัตว์สักตัว — แตะกระต่ายแล้วต้องเห็นสีของกระต่าย */
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('#house-shop-items .hs-card'))
      .find(b => b.textContent.includes('กระต่าย')).click();
  });
  await page.waitForTimeout(300);
  const h = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-shop-items .hs-subsec')).map(x => x.textContent.trim()));
  expect(h.length).toBe(1);
  expect(h[0]).toContain('กระต่าย');
  expect(h[0]).toContain('รับมาเลี้ยงก่อน');        /* บอกเหตุผลไว้ตรงหัวข้อ เด็กจะได้ไม่งง */
  /* กดซื้อสีไม่ได้จริง และเงินต้องไม่ถูกหัก */
  expect(await page.evaluate(() => window.HouseShop.buyPetColor('rabbit', 1))).toBe(false);
  expect(await coinsOf(page)).toBe(400);
  expect(errors).toEqual([]);
});

test('ร้านสัตว์: สีขนโผล่เฉพาะตัวที่เลือกอยู่ ไม่กางทุกตัวที่มี', async ({ page }) => {
  const errors = await openHouse(page, null, 900);
  /* ซื้อ 2 ตัวในกลุ่มเดียวกัน (เริ่มต้น) เพื่อพิสูจน์ว่าไม่ได้กางสีของทั้งคู่พร้อมกัน */
  await page.evaluate(() => { window.HouseShop.buyPet('dog'); });
  await page.waitForTimeout(2200);
  await page.evaluate(() => { window.HouseShop.buyPet('cat'); });
  await page.waitForTimeout(2200);

  await page.evaluate(() => window.HouseShop.open('shop-pet'));
  await page.waitForTimeout(700);
  const headings = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-shop-items .hs-subsec')).map(h => h.textContent.trim()));

  /* แตะการ์ดหมาน้อย → เห็นเฉพาะสีของหมา */
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('#house-shop-items .hs-card'))
      .find(b => b.textContent.includes('หมาน้อย')).click();
  });
  await page.waitForTimeout(300);
  let h = await headings();
  expect(h.length).toBe(1);
  expect(h[0]).toContain('หมาน้อย');

  /* แตะการ์ดแมวเหมียว → สลับเป็นสีของแมวแทน (ไม่ใช่ต่อท้ายเพิ่มอีก section) */
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('#house-shop-items .hs-card'))
      .find(b => b.textContent.includes('แมวเหมียว')).click();
  });
  await page.waitForTimeout(300);
  h = await headings();
  expect(h.length).toBe(1);
  expect(h[0]).toContain('แมวเหมียว');
  expect(errors).toEqual([]);
});

test('สีขน: ซื้อสีของสัตว์ที่ยังไม่มีไม่ได้ · มีแล้วซื้อได้และตัดเงิน 100', async ({ page }) => {
  const errors = await openHouse(page, null, 400);
  expect(await page.evaluate(() => window.HouseShop.buyPetColor('cat', 1)),
    'ยังไม่มีแมว ห้ามให้ซื้อสีแมว (ซื้อไปก็ใช้ไม่ได้)').toBe(false);
  expect(await coinsOf(page)).toBe(400);

  await page.evaluate(() => window.HouseShop.buyPet('dog'));
  await page.waitForTimeout(2200);
  expect(await coinsOf(page)).toBe(150);
  expect(await page.evaluate(() => window.HouseShop.buyPetColor('dog', 1))).toBe(true);
  expect(await coinsOf(page)).toBe(50);
  expect(await page.evaluate(() => window.HouseShop.ownsPetColor('dog', 1))).toBe(true);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: ออกแบบเคอร์เซอร์ "ฟองคำพูด" ไว้บอกว่าชาวบ้านคนนี้คุยได้
   ให้เข้าชุดกับเคอร์เซอร์นกฮูกเดิม — ต้องเปลี่ยนจริงตอนวางเมาส์บนตัว NPC เท่านั้น */
/* หา "ที่ว่าง" บนจอที่ไม่มีตัวที่คุยได้อยู่จริง — ห้าม hardcode พิกัด เพราะ desktop กับ tablet
   มุมกล้องต่างกัน จุดเดียวกันอาจมีคนยืนอยู่พอดีบนจอหนึ่ง (เทสแดงแบบนี้มาแล้ว 2026-08-10) */
async function emptySpot(page) {
  const size = page.viewportSize();
  const cands = [];
  for (const fy of [0.9, 0.12, 0.75, 0.25]) for (const fx of [0.06, 0.94, 0.2, 0.8])
    cands.push({ x: Math.round(size.width * fx), y: Math.round(size.height * fy) });
  for (const c of cands) {
    if (!(await page.evaluate(p => window.__houseTalkAt(p.x, p.y), c))) return c;
  }
  throw new Error('หาที่ว่างบนจอไม่เจอ (มีตัวละครเต็มจอ?)');
}

test('เคอร์เซอร์ฟองคำพูด: วางเมาส์บนชาวบ้านแล้วเปลี่ยนจริง · ที่ว่างเปล่าไม่เปลี่ยน', async ({ page }) => {
  const errors = await openHouse(page, null, 0);
  const canvas = page.locator('#house-canvas');
  const cursorOf = () => page.evaluate(() => getComputedStyle(document.getElementById('house-canvas')).cursor);

  /* พื้นโล่งมุมจอ — ต้องยังเป็นเคอร์เซอร์นกฮูกปกติ ไม่ใช่ฟองคำพูด */
  let blank = await emptySpot(page);
  await page.mouse.move(blank.x, blank.y);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.__houseTalkHover())).toBe(false);
  const plain = await cursorOf();

  /* วาร์ปไปลานหน้าโรงพยาบาลก่อน — หน้าบ้านเด็กไม่มีชาวบ้านอยู่ในจอเลยสักคน (NPC เข้าเขตบ้านไม่ได้) */
  await page.evaluate(() => window.__houseDbg.tp(58, 35));
  await page.waitForTimeout(1500);

  /* ⚠ ชาวบ้านหลายคนเดินตลอดเวลา ⇒ วัดพิกัดแล้วเลื่อนเมาส์ไปอาจไม่ทัน ต้องลองซ้ำ
     (npcOnScreen เลือกคนที่ยืนประจำที่ให้ก่อนแล้ว แต่บางมุมกล้องอาจไม่มีคนยืนอยู่ในจอ) */
  let hovered = false, at = null;
  for(let i = 0; i < 12 && !hovered; i++){
    at = await page.evaluate(() => window.__houseDbg.npcOnScreen());
    if(!at){ await page.waitForTimeout(300); continue; }
    await page.mouse.move(Math.round(at.x) + (i % 2), Math.round(at.y));   /* ขยับ 1px สลับ บังคับให้เกิด event */
    await page.waitForTimeout(220);
    hovered = await page.evaluate(() => window.__houseTalkHover());
  }
  expect(at, 'ต้องมีชาวบ้านอยู่ในจออย่างน้อย 1 คน').not.toBe(null);
  expect(hovered, 'วางเมาส์บนตัวชาวบ้านแล้วเคอร์เซอร์ต้องเปลี่ยน').toBe(true);

  const talk = await cursorOf();
  expect(talk).not.toBe(plain);
  expect(talk).toContain('svg');            /* เป็นเคอร์เซอร์รูปที่วาดเอง ไม่ใช่ pointer ของระบบ */
  expect(talk).toContain('7 32');           /* hotspot = ปลายหางฟอง ชี้โดนตัวชาวบ้าน */
  expect(await canvas.evaluate(el => el.classList.contains('house-talk-hover'))).toBe(true);

  /* เลื่อนออกจากตัว → กลับเป็นเคอร์เซอร์ปกติ ไม่ค้าง
     ⚠ ต้องหาที่ว่าง **ใหม่** ตรงนี้ — วาร์ปมาที่ใหม่แล้ว จุดเดิมอาจมีชาวบ้านยืนอยู่ */
  blank = await emptySpot(page);
  await page.mouse.move(blank.x, blank.y);
  await expect.poll(() => page.evaluate(() => window.__houseTalkHover()), { timeout: 5000 }).toBe(false);
  expect(await cursorOf()).toBe(plain);
  expect(errors).toEqual([]);
});
