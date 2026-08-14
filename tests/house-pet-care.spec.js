const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" เฟส 3B — อาหาร/ความหิว/ป่วย/หมอ (js/house-pet-care.js + จุดต่อใน js/house.js)
   สิ่งที่ต้องไม่พังเด็ดขาด:
     1) **ห้ามลงโทษเด็ก** (กติกาเหล็กข้อ 2) — สัตว์ไม่ตาย · ไม่หักเงิน · ให้อาหารผิดชนิดไม่เสียของ
        · หายไปนานแค่ไหนกลับมาก็ลดแค่วันเดียว (ความอิ่มลดตาม "วันที่เข้าเล่น" ไม่ใช่เวลาจริง)
     2) **ห้ามมี dead end** (ข้อ 1) — รับเลี้ยงแล้วต้องมีอาหารถุงแรกติดมือเสมอ · เงินไม่พอค่ารักษา
        ต้องมีทาง "ทำงานช่วยคุณหมอแทน" · สัตว์ทุกชนิดต้องมีอาหารของตัวเอง
     3) ป่วยต้องใช้เวลา 2 วันเล่นที่ปล่อยหิวสนิท (มีคำเตือนล่วงหน้าเต็มวัน) และหายเองไม่ได้
     4) เงินต้องผ่าน window.OwlCoins เท่านั้น (ข้อ 5)
     5) ปล่อยสัตว์คืนแล้ว **อาหารที่ซื้อไว้ต้องไม่หาย** (ข้อ 3 ห้ามทำข้อมูลเก่าหาย) */

const CHILD = { id: 'care-test', name: 'เทสเลี้ยงสัตว์', emoji: '🍖', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const PKEY = 'p1quiz_progress_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* มีบ้าน + เลี้ยงหมาอยู่แล้ว → ข้ามหน้าสร้างตัวละคร เข้าเมืองได้เลย (หมากิน 'meat') */
const SEED = { v: 1, mapV: 3, char: CHAR, pet: { type: 'dog', name: 'บราวนี่', color: 0 } };

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
  }, [CHILD, HKEY, seedHouse === undefined ? SEED : seedHouse, PKEY, coins == null ? null : coins]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HousePetCare && !!window.HousePetUI, null, { timeout: 30000 });
  /* รอให้เข้าโหมดเดินเมืองจริงก่อน — แผงต่างๆ เปิดไม่ได้ถ้ายังไม่ใช่ 'world' (ดูหมายเหตุใน house-quests.spec.js) */
  await page.waitForFunction(
    () => window.__houseDbg && window.__houseDbg.mode() === 'world' && !window.__houseDbg.editing(),
    null, { timeout: 30000 });
  return errors;
}
const readHouse = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), HKEY);
const coinsOf = page => page.evaluate(() => window.OwlCoins.get());
/* ย้อนวันที่บันทึกไว้ให้ห่างจากวันนี้ n วัน แล้วอ่านสถานะใหม่ (จำลอง "เข้าเล่นวันใหม่") */
const rollDays = (page, n) => page.evaluate(cnt => {
  for (let i = 0; i < cnt; i++) {
    const d = JSON.parse(localStorage.getItem('p1quiz_house_care-test'));
    d.care.day = 'ย้อนหลัง-' + i;                 /* คีย์วันอะไรก็ได้ที่ไม่ตรงวันนี้ */
    localStorage.setItem('p1quiz_house_care-test', JSON.stringify(d));
    window.HousePetCare.state();                  /* เดินเวลา 1 วันเล่น */
  }
  return window.HousePetCare.state();
}, n);

test('ตารางอาหารครบทุกชนิดสัตว์ + ราคาตรงข้อ 18.2 (ตัวคุมไม่ให้มีสัตว์ที่ให้อาหารไม่ได้)', async ({ page }) => {
  const errors = await openHouse(page);
  const out = await page.evaluate(() => {
    const C = window.HousePetCare;
    const pets = window.HouseShop.petTypes().map(p => p.id);
    return {
      food: C.FOOD.map(f => ({ id: f.id, price: f.price, pets: f.pets })),
      meals: C.MEALS_PER_BAG, gain: C.FEED_GAIN, drop: C.DAY_DROP, cure: C.CURE_COST,
      missing: pets.filter(p => !C.foodForPet(p)),
      petCount: pets.length,
    };
  });
  /* สัตว์ทุกชนิดต้องมีอาหารของตัวเอง ไม่งั้นซื้อมาเลี้ยงแล้วป้อนไม่ได้เลย = dead end */
  expect(out.missing).toEqual([]);
  expect(out.petCount).toBe(12);
  expect(out.meals).toBe(5);
  expect(out.cure).toBe(120);
  const price = {};
  out.food.forEach(f => { price[f.id] = f.price; });
  expect(price).toEqual({ meat: 60, fish: 60, veg: 50, seed: 45, hay: 50, bug: 55, bamboo: 90, magic: 150 });
  /* 1 ถุง (5 มื้อ) ต้องอยู่ได้หลายวัน ไม่ใช่ซื้อทุกวันจนเด็กหมดตัว */
  expect(out.meals * out.gain).toBeGreaterThanOrEqual(out.drop * 5);
  expect(errors).toEqual([]);
});

test('รับเลี้ยงแล้วต้องมีอาหารถุงแรกติดมือเสมอ + เริ่มที่อิ่มเต็ม (ห้ามเจอทางตันตั้งแต่วันแรก)', async ({ page }) => {
  const errors = await openHouse(page);
  const out = await page.evaluate(() => {
    const C = window.HousePetCare;
    return { st: C.state(), meat: C.meals('meat'), full: C.fullness(), sick: C.isSick() };
  });
  expect(out.full).toBe(100);
  expect(out.sick).toBe(false);
  expect(out.meat).toBe(5);              /* หมากิน meat — แถมถุงแรกให้เด็กที่เลี้ยงอยู่ก่อนเฟส 3B */
  /* ข้อมูลลง house save ก้อนเดิม ⇒ export/import ย้ายเครื่องตามไปเอง */
  const d = await readHouse(page);
  expect(d.care).toBeTruthy();
  expect(d.petFood.meat).toBe(5);
  expect(errors).toEqual([]);
});

test('ให้อาหารผิดชนิด: สัตว์ไม่กิน แต่ **ห้ามหักของในคลัง** และลองใหม่ได้ไม่จำกัด', async ({ page }) => {
  const errors = await openHouse(page);
  const out = await page.evaluate(() => {
    const C = window.HousePetCare;
    C.addMeals('fish', 3);                       /* หมาไม่กินอาหารปลา */
    const before = { fish: C.meals('fish'), meat: C.meals('meat'), full: C.fullness() };
    const r1 = C.feed('fish');
    const r2 = C.feed('fish');
    return { before, r1, r2, after: { fish: C.meals('fish'), meat: C.meals('meat'), full: C.fullness() } };
  });
  expect(out.r1.ok).toBe(false);
  expect(out.r1.reason).toBe('wrong');
  expect(out.r2.ok).toBe(false);              /* กดซ้ำกี่ครั้งก็ยังลองได้ ไม่มีบทลงโทษ */
  expect(out.after.fish).toBe(out.before.fish);   /* ของไม่หายแม้แต่มื้อเดียว */
  expect(out.after.meat).toBe(out.before.meat);
  expect(out.after.full).toBe(out.before.full);
  expect(errors).toEqual([]);
});

test('ความอิ่มลดตาม "วันที่เข้าเล่น" ไม่ใช่เวลาจริง — หายไปนานแค่ไหนกลับมาก็ลดแค่วันเดียว', async ({ page }) => {
  const errors = await openHouse(page);
  const one = await rollDays(page, 1);
  expect(one.full).toBe(65);                   /* 100 − 35 */
  expect(one.sick).toBe(false);
  const three = await rollDays(page, 2);
  expect(three.full).toBe(0);                  /* 65 → 30 → 0 (ไม่ติดลบ) */
  expect(three.sick).toBe(false);              /* หิวสนิทวันแรก ยังไม่ป่วย — มีเวลาแก้ตัวเต็มวัน */
  expect(errors).toEqual([]);
});

test('ป้อนอาหารถูกชนิด: อิ่มขึ้นจริง · ตัดมื้อในคลัง 1 มื้อ · อิ่มเต็มแล้วไม่กินเพิ่ม (ไม่เสียของ)', async ({ page }) => {
  const errors = await openHouse(page);
  await rollDays(page, 2);                     /* 100 → 65 → 30 */
  const out = await page.evaluate(() => {
    const C = window.HousePetCare;
    const before = C.meals('meat');
    const a = C.feed('meat');                  /* 30 + 50 = 80 */
    const b = C.feed('meat');                  /* 80 + 50 → ตัน 100 */
    const c = C.feed('meat');                  /* อิ่มเต็มแล้ว ห้ามกินต่อ */
    return { before, a, b, c, meat: C.meals('meat'), full: C.fullness() };
  });
  expect(out.a.ok).toBe(true);
  expect(out.a.full).toBe(80);
  expect(out.b.ok).toBe(true);
  expect(out.b.full).toBe(100);
  expect(out.c.ok).toBe(false);
  expect(out.c.reason).toBe('stuffed');
  expect(out.meat).toBe(out.before - 2);       /* หัก 2 มื้อ (ครั้งที่ 3 ไม่หัก) */
  expect(out.full).toBe(100);
  expect(errors).toEqual([]);
});

test('ป่วย: ต้องปล่อยหิวสนิท 2 วันเล่นติดกัน · หายเองไม่ได้ · จ่ายค่ารักษา 120 ผ่าน OwlCoins', async ({ page }) => {
  const errors = await openHouse(page, undefined, 500);
  const sickAt = await rollDays(page, 4);      /* 65 → 30 → 0 (หิว 1 วัน) → ยังหิว = ป่วย */
  expect(sickAt.sick).toBe(true);

  /* ป่วยแล้วให้อาหารไม่ได้ ต้องไปหาหมอเท่านั้น (ผู้ใช้ล็อกข้อนี้ไว้) */
  const fed = await page.evaluate(() => window.HousePetCare.feed('meat'));
  expect(fed.ok).toBe(false);
  expect(fed.reason).toBe('sick');
  /* วันผ่านไปอีกก็ไม่หายเอง */
  const later = await rollDays(page, 2);
  expect(later.sick).toBe(true);

  const before = await coinsOf(page);
  expect(before).toBe(500);
  const res = await page.evaluate(() => window.HousePetCare.cure());
  expect(res).toBe('cured');
  expect(await coinsOf(page)).toBe(500 - 120);          /* ตัดเงินผ่าน OwlCoins เท่านั้น */
  const st = await page.evaluate(() => window.HousePetCare.state());
  expect(st.sick).toBe(false);
  expect(st.full).toBe(100);                            /* รักษาแล้วกลับมาแข็งแรงเต็มที่ */
  expect(errors).toEqual([]);
});

test('เงินไม่พอค่ารักษา: หมอไม่ไล่กลับ ให้ทำงานแทน แล้วเล่นเควสต์จบ 1 ชุดน้องหายป่วย (ห้ามมี dead end)', async ({ page }) => {
  const errors = await openHouse(page, undefined, 10);   /* เงินน้อยกว่าค่ารักษามาก */
  await rollDays(page, 4);
  expect(await page.evaluate(() => window.HousePetCare.isSick())).toBe(true);

  const res = await page.evaluate(() => window.HousePetCare.cure());
  expect(res).toBe('quest');                             /* ไม่ใช่ทางตัน — ได้งานแทนค่ารักษา */
  expect(await coinsOf(page)).toBe(10);                  /* **ห้ามหักเงิน** แม้แต่เหรียญเดียว */
  expect(await page.evaluate(() => window.HousePetCare.owesWork())).toBe(true);
  expect(await page.evaluate(() => window.HousePetCare.isSick())).toBe(true);

  /* เล่นเควสต์ให้จบ 1 ชุด → ใช้หนี้ครบ น้องหายป่วยเอง */
  const done = await page.evaluate(() => {
    const q = window.HouseQuests, run = q.buildRun(q.specForNpc(q.state().npcIds[0]));
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    q.finish(run);
    return window.HousePetCare.questDone();
  });
  expect(done).toBe(true);
  const st = await page.evaluate(() => window.HousePetCare.state());
  expect(st.sick).toBe(false);
  expect(st.owe).toBe(false);
  expect(st.full).toBe(100);
  expect(errors).toEqual([]);
});

test('แถบสถานะใต้ชื่อเด็ก: ชื่อสัตว์ · ไอคอนอาหารที่กิน · หลอดความอิ่ม · ปุ่มให้อาหาร', async ({ page }) => {
  const errors = await openHouse(page);
  const bar = page.locator('#house-pet-bar');
  await expect(bar).toBeVisible();
  await expect(page.locator('#hpb-pet')).toContainText('บราวนี่');
  await expect(page.locator('#hpb-food-ic')).toHaveText('🍖');    /* หมากินอาหารเนื้อ */
  await expect(page.locator('#hpb-left')).toHaveText('×5');       /* จำนวนมื้อคงเหลืออยู่หลังหลอด */
  await expect(page.locator('#hpb-feed')).toContainText('ให้อาหาร');
  /* อิ่มเต็ม = หลอดเต็ม ไม่มีคลาสเตือน */
  await expect.poll(() => page.evaluate(() => document.getElementById('hpb-fill').style.width)).toBe('100%');
  expect(await bar.evaluate(el => el.classList.contains('hpb-warn'))).toBe(false);

  /* หิวแล้วหลอดต้องสั้นลง + แถบขึ้นสถานะเตือน */
  await rollDays(page, 2);                                        /* 100 → 65 → 30 */
  await expect.poll(() => page.evaluate(() => document.getElementById('hpb-fill').style.width)).toBe('30%');
  await expect.poll(() => page.evaluate(() => document.getElementById('house-pet-bar').classList.contains('hpb-warn'))).toBe(true);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่งเอา popup เลือกอาหารออก 2026-08-09 — สัตว์แต่ละตัวกินได้ชนิดเดียวอยู่แล้ว
   การ์ดจึงมีของใบเดียว = คลิกเปล่าเพิ่มมาขั้นนึงโดยไม่ได้อะไร ⇒ กดปุ่มในแถบแล้วป้อนเลย */
test('กดปุ่มให้อาหารครั้งเดียวป้อนเลย ไม่มี popup ให้เลือก · จำนวนมื้อในแถบลดลง', async ({ page }) => {
  const errors = await openHouse(page);
  await expect(page.locator('#hpb-feed')).toBeVisible();
  await rollDays(page, 2);                                /* ให้หิวก่อน ไม่งั้นกดแล้วเด้ง "อิ่มอยู่" */

  const before = await page.evaluate(() => window.HousePetCare.fullness());
  await page.locator('#hpb-feed').click();
  await expect.poll(() => page.evaluate(() => window.HousePetCare.fullness())).toBe(before + 50);
  /* ต้องไม่มีการ์ด/แผงอะไรเด้งมาให้เลือกเลย */
  expect(await page.evaluate(() => !!document.getElementById('house-feed'))).toBe(false);
  await expect(page.locator('#hpb-left')).toHaveText('×4');
  expect(errors).toEqual([]);
});

test('อิ่มอยู่แล้วกดให้อาหาร: น้องบอกว่าอิ่ม และ **ห้ามหักอาหารในคลัง**', async ({ page }) => {
  const errors = await openHouse(page);
  await expect(page.locator('#hpb-left')).toHaveText('×5');
  const full = await page.evaluate(() => window.HousePetCare.fullness());
  expect(full).toBe(100);

  await page.locator('#hpb-feed').click();
  await page.waitForTimeout(600);
  /* ของไม่หาย ความอิ่มไม่เปลี่ยน และไม่มีอนิเมชันป้อนอาหารเริ่มขึ้น */
  expect(await page.evaluate(() => window.HousePetCare.meals('meat'))).toBe(5);
  expect(await page.evaluate(() => window.HousePetCare.fullness())).toBe(100);
  expect(await page.evaluate(() => window.__houseDbg.feeding())).toBe(false);
  await expect(page.locator('#hpb-left')).toHaveText('×5');
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่งเพิ่ม 2026-08-09: ป้อนอาหารแล้วต้องมี "ท่าทาง" ให้เห็น ไม่ใช่ตัวเลขขยับเฉยๆ
   เด็ก 5 ขวบต้องเข้าใจว่าเกิดอะไรขึ้นจากภาพล้วนๆ โดยไม่ต้องอ่าน */
test('อนิเมชันป้อนอาหาร: มีชามโผล่ในฉาก · น้องวิ่งเข้ามาหาเด็ก · จบแล้วเก็บชามและเดินต่อได้', async ({ page }) => {
  /* ⚠ เทสตัวนี้รอ "เวลาในเกม" ไม่ใช่เวลาจริง — engine clamp dt ที่ 50ms/เฟรม ตอนเครื่องรันเทสทั้งชุด
     พร้อมกัน เฟรมตกหนักจนอนิเมชัน 2.6 วิใช้เวลาจริงเกิน 30 วินาทีได้ ⇒ ต้องขยาย timeout ของเทสนี้
     (ไม่ใช่ปัญหาของเกม บนเครื่องจริงเฟรมเต็มก็ 2.6 วิตามที่ออกแบบ) */
  test.slow();
  const errors = await openHouse(page);
  await rollDays(page, 2);
  /* ⚠ รอให้ฉากนิ่งก่อน — engine clamp dt ไว้ที่ 50ms/เฟรม (js/house.js) ⇒ ตอนเฟรมตกช่วงเพิ่งโหลดเสร็จ
     "เวลาในเกม" เดินช้ากว่านาฬิกาจริงหลายเท่า อนิเมชัน 2.6 วิอาจกินเวลาจริงเกิน 10 วิได้ */
  await page.waitForTimeout(2500);
  const far = await page.evaluate(() => {
    const c = window.__houseDbg.charPos();
    return Math.hypot(window.__houseDbg.petPos().x - c.x, window.__houseDbg.petPos().z - c.z);
  });

  await page.locator('#hpb-feed').click();
  /* กำลังเล่นอนิเมชันอยู่ */
  await expect.poll(() => page.evaluate(() => window.__houseDbg.feeding())).toBe(true);

  /* น้องต้องเข้ามายืนกินข้างๆ เด็ก (ไม่ใช่ยืนเฉยที่เดิม) */
  await expect.poll(() => page.evaluate(() => {
    const c = window.__houseDbg.charPos(), p = window.__houseDbg.petPos();
    return Math.hypot(p.x - c.x, p.z - c.z) < 1.6;   /* มายืนกินหน้าเด็ก (ตรงชามที่วางไว้) */
  }), { timeout: 15000 }).toBe(true);
  expect(far).toBeGreaterThan(0);

  /* จบแล้วต้องเคลียร์สถานะ ไม่ค้าง (ไม่งั้นน้องเดินต่อไม่ได้ทั้งเกม) */
  await expect.poll(() => page.evaluate(() => window.__houseDbg.feeding()), { timeout: 90000 }).toBe(false);
  expect(errors).toEqual([]);
});

test('ร้านสัตว์เลี้ยงมีแท็บอาหาร: ซื้อได้ซ้ำไม่จำกัด ตัดเงินตามราคา และเพิ่มมื้อในคลัง', async ({ page }) => {
  const errors = await openHouse(page, undefined, 300);
  await page.evaluate(() => window.HouseShop.open('shop-pet'));
  await expect(page.locator('#house-shop')).toBeVisible();

  const tabs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-shop-tabs .he-tab')).map(b => b.textContent));
  expect(tabs.some(t => /อาหาร/.test(t))).toBe(true);

  /* การ์ดอาหารต้อง **บอกเสมอว่าเป็นของสัตว์ตัวไหน** (นี่คือตัวสอนหลักของเฟส 3B) */
  await page.evaluate(() => {
    const t = Array.from(document.querySelectorAll('#house-shop-tabs .he-tab'))
      .find(b => /อาหาร/.test(b.textContent));
    t.click();
  });
  await expect(page.locator('#house-shop-items .hs-card')).toHaveCount(8);
  const subs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-shop-items .hs-card')).map(c => {
      const s = c.querySelector('.hs-sub');
      return s ? s.textContent : '';
    }));
  expect(subs.length).toBe(8);
  subs.forEach(s => expect(s).toContain('สำหรับ'));
  expect(subs.join('|')).toContain('หมาน้อย');
  expect(subs.filter(s => /แมวเหมียว/.test(s) && /เพนกวิน/.test(s)).length).toBe(1);  /* อาหารปลากินได้ 2 ตัว */

  const out = await page.evaluate(() => {
    const C = window.HousePetCare;
    const before = { meat: C.meals('meat'), coins: window.OwlCoins.get() };
    const a = C.buyBag('meat');                  /* 60 🪙 → +5 มื้อ */
    const b = C.buyBag('meat');                  /* ซื้อซ้ำได้ ไม่มี "มีแล้ว" */
    return { before, a, b, meat: C.meals('meat'), coins: window.OwlCoins.get() };
  });
  expect(out.a).toBe(true);
  expect(out.b).toBe(true);
  expect(out.meat).toBe(out.before.meat + 10);
  expect(out.coins).toBe(out.before.coins - 120);
  expect(errors).toEqual([]);
});

test('ปล่อยสัตว์คืน: สถานะสุขภาพล้าง แต่อาหารที่ซื้อไว้ต้องยังอยู่ครบ (ห้ามทำข้อมูลเก่าหาย)', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => { window.HousePetCare.addMeals('fish', 7); });
  await rollDays(page, 1);

  await page.evaluate(() => { window.HousePetCare.onRelease(); });
  let d = await readHouse(page);
  expect(d.care).toBeFalsy();
  expect(d.petFood.fish).toBe(7);              /* อาหารเป็นของเด็ก ไม่ผูกกับตัวสัตว์ */
  expect(d.petFood.meat).toBe(5);

  /* รับกลับมาเลี้ยงใหม่ → เริ่มนับใหม่ที่อิ่มเต็ม แต่ไม่แจกอาหารซ้ำให้ฟรีอีกถุง */
  const st = await page.evaluate(() => {
    window.HousePetCare.onAdopt();
    return { st: window.HousePetCare.state(), meat: window.HousePetCare.meals('meat') };
  });
  expect(st.st.full).toBe(100);
  expect(st.st.sick).toBe(false);
  expect(st.meat).toBe(5);
  expect(errors).toEqual([]);
});

test('ไม่มีสัตว์เลี้ยง: แถบขึ้นสถานะกุญแจล็อก และระบบดูแลไม่ทำงาน (ไม่มีอะไรให้ดูแล)', async ({ page }) => {
  const errors = await openHouse(page, { v: 1, mapV: 3, char: CHAR });
  /* 🔒 ผู้ใช้สั่ง 2026-08-14: **เลิกซ่อนแถบตอนยังไม่มีสัตว์** — ให้โชว์เป็นสถานะกุญแจล็อกแทน
     เกณฑ์เดิม (`toBeHidden`) ถูกทับด้วยมตินี้ **ห้ามลบเทส ให้เปลี่ยนเกณฑ์**
     เหตุผลของมติ: เด็กที่ยังไม่มีสัตว์จะไม่มีทางรู้เลยว่ามีระบบเลี้ยงสัตว์อยู่ในเกม */
  await expect(page.locator('#house-pet-bar')).toBeVisible();
  await expect(page.locator('#house-pet-bar')).toHaveClass(/hpb-locked/);
  await expect(page.locator('#hpb-feed-label')).toHaveText(/รับเลี้ยง/);
  /* ของที่ยังไม่มีความหมายต้องไม่โผล่ (หลอดความอิ่ม/ไอคอนอาหาร) */
  expect(await page.evaluate(() => [
    getComputedStyle(document.querySelector('#house-pet-bar .hpb-meter')).display,
    getComputedStyle(document.getElementById('hpb-food')).display,
  ])).toEqual(['none', 'none']);
  const out = await page.evaluate(() => ({
    st: window.HousePetCare.state(),
    fed: window.HousePetCare.feed('meat'),
    cure: window.HousePetCare.cure(),
  }));
  expect(out.st).toBe(null);
  expect(out.fed.ok).toBe(false);
  expect(out.fed.reason).toBe('nopet');
  expect(out.cure).toBe('nopet');
  expect(errors).toEqual([]);
});
