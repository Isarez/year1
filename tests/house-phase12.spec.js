/* ============================================================
   เฟส 12 — กิจกรรมกับเพื่อนตัวน้อย (สัตว์เลี้ยง)
   🤚 ลูบหัว · 🫧 อาบน้ำ · 🎾 เล่นด้วยกัน · 🎪 สอนท่า 5 ท่า · 🎀 ปลอกคอ 8 แบบ 8 สี

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. **ไม่ให้เหรียญสักบาท** — ทุกกิจกรรมจ่ายเป็น "ค่าความสุข" เท่านั้น (ผู้ใช้สั่ง 2026-08-14)
     2. **ห้ามมี dead end** — น้องงีบเพราะเหงา ต้องลูบหัว/อาบน้ำได้เสมอ แล้วออกมาเองเมื่อพ้น 25%
     3. **ห้ามมีบทลงโทษ** — ลูบครบโควตาแล้วยังลูบได้ · ความคืบหน้าการสอนท่าห้ามถอยหลัง
     4. **ปลอกคอ/รอยเปื้อนต้องอยู่บนโมเดลจริง** ไม่ใช่แค่ค่าใน localStorage
     5. **state ใหม่ต้องมี migration** — เด็กก่อนเฟส 12 (ไม่มีคีย์ happy/collar) ต้องเล่นได้ปกติ
     6. **ลูกบอลแถมฟรีมากับน้อง** — ซื้อสัตว์แล้วต้องเล่นโยนบอลได้ทันทีโดยไม่ต้องซื้ออะไรอีก
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p12a', name: 'ข้าวปั้น', emoji: '🐣', birthDate: '2019-05-10', grade: 'p2' };

/* seed = house save ที่อยากให้เด็กมีตั้งแต่แรก (ไม่ส่ง = เด็กก่อนเฟส 12 ที่ไม่มีคีย์อะไรของเฟสนี้เลย) */
async function house(page, seed) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(([c, s]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify(Object.assign({
      v: 1, mapV: 4, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
      pet: { type: 'dog', color: 0, name: 'ปุยนุ่น' },
    }, s || {})));
  }, [CHILD, seed || null]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HousePetCare && !!window.HouseShop, null, { timeout: 30000 });
  return errs;
}
const coins = page => page.evaluate(() => window.OwlCoins.get());

test('เฟส 12A: เด็กก่อนเฟส 12 (ไม่มีคีย์ความสุข/ปลอกคอ) ต้องเล่นได้ + เติมค่าให้เอง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const C = window.HousePetCare;
    return {
      happy: C.happiness(),
      sleepy: C.isSleepy(),
      dirty: C.isDirty(),
      collar: C.collar(),
      learned: C.learnedTricks(),
      tricks: C.TRICKS.map(t => t.id),
    };
  });
  expect(r.happy).toBeGreaterThan(0);            /* เริ่มมาต้องไม่ใช่ 0 ไม่งั้นเด็กเปิดเกมมาเจอน้องงีบทันที */
  expect(r.sleepy).toBe(false);
  expect(r.dirty).toBe(false);
  expect(r.collar).toBeTruthy();                 /* collar() ต้องคืนค่าเสมอ ห้ามคืน null */
  expect(typeof r.collar.s).toBe('string');
  expect(r.learned).toEqual([]);
  expect(r.tricks.length).toBeGreaterThanOrEqual(5);
  expect(new Set(r.tricks).size).toBe(r.tricks.length);   /* id ท่าห้ามซ้ำ */
  expect(errs).toEqual([]);
});

test('เฟส 12B: ทุกกิจกรรมให้ค่าความสุข แต่ไม่ให้เหรียญสักบาท', async ({ page }) => {
  const errs = await house(page);
  const before = await coins(page);
  const r = await page.evaluate(() => {
    const C = window.HousePetCare;
    C.setHappy(10);
    const out = { steps: [] };
    const snap = n => out.steps.push({ n, happy: C.happiness() });
    snap('start');
    C.pat();       snap('pat');
    C.setDirty(true);                            /* น้องเกิดมาสะอาดอยู่แล้ว ต้องทำให้เลอะก่อนถึงจะอาบได้ */
    C.bath();      snap('bath');
    C.ballFetched(); snap('ball');
    C.teach('sit'); snap('teach');
    return out;
  });
  const after = await coins(page);
  expect(after, 'กิจกรรมกับสัตว์เลี้ยงห้ามจ่ายเหรียญ').toBe(before);
  const h = r.steps.map(s => s.happy);
  for (let i = 1; i < h.length; i++) expect(h[i], r.steps[i].n).toBeGreaterThan(h[i - 1]);
  expect(errs).toEqual([]);
});

test('เฟส 12C: ลูบหัวมีเพดานต่อวัน แต่ห้ามปฏิเสธเด็ก', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const C = window.HousePetCare;
    C.setHappy(0);
    const res = [];
    for (let i = 0; i < C.PAT_CAP + 4; i++) res.push(C.pat());
    return { res, happy: C.happiness(), cap: C.PAT_CAP, gain: C.PAT_GAIN };
  });
  expect(r.res.every(x => x.ok), 'ลูบหัวต้องไม่มีวันถูกปฏิเสธ').toBe(true);
  expect(r.happy).toBe(r.cap * r.gain);          /* เกินโควตาแล้วไม่เพิ่ม แต่ยังลูบได้ */
  expect(r.res[r.res.length - 1].gain).toBe(0);
  expect(r.res[r.res.length - 1].capped).toBe(true);
  expect(errs).toEqual([]);
});

test('เฟส 12D: สอนท่าต้องสะสมความคืบหน้า ห้ามถอยหลัง และเรียนจบแล้วอยู่ถาวร', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const C = window.HousePetCare;
    const need = C.TRICK_NEED, seen = [];
    let justLearnedAt = -1;
    for (let i = 0; i < need + 3; i++) {
      const t = C.teach('spin');
      seen.push(C.trickProg('spin'));
      if (t.justLearned) justLearnedAt = i;
    }
    /* ข้ามวัน: ความคืบหน้าและท่าที่เรียนจบต้องอยู่ครบ */
    const d = JSON.parse(localStorage.getItem('p1quiz_house_p12a'));
    d.care.day = '2000-01-01';
    localStorage.setItem('p1quiz_house_p12a', JSON.stringify(d));
    return {
      seen, justLearnedAt, need,
      after: C.trickProg('spin'),
      learned: C.trickLearned('spin'),
      list: C.learnedTricks(),
    };
  });
  for (let i = 1; i < r.seen.length; i++) expect(r.seen[i]).toBeGreaterThanOrEqual(r.seen[i - 1]);
  expect(r.justLearnedAt).toBe(r.need - 1);      /* ครั้งที่ TRICK_NEED = เรียนจบพอดี */
  expect(r.after).toBeGreaterThanOrEqual(r.need);
  expect(r.learned).toBe(true);
  expect(r.list).toContain('spin');
  expect(errs).toEqual([]);
});

test('เฟส 12E: ไม่อาบน้ำ 2 วันติด = ตัวเลอะ และอาบแล้วสะอาดทันที', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const C = window.HousePetCare;
    const out = {};
    out.day0 = C.isDirty();
    C.setDirty(true);
    out.dirty = C.isDirty();
    out.model = (function () { window.__houseDbg.restylePet(); return window.__houseDbg.petGear().dirty; })();
    const b = C.bath();
    out.bathOk = b.ok;
    out.afterBath = C.isDirty();
    out.bathedToday = C.bathedToday();
    out.again = C.bath();                        /* อาบซ้ำวันเดียวกัน = บอกว่าอาบแล้ว ไม่ใช่ error */
    window.__houseDbg.restylePet();
    out.modelAfter = window.__houseDbg.petGear().dirty;
    out.days = C.DIRTY_DAYS;
    return out;
  });
  expect(r.day0).toBe(false);
  expect(r.dirty).toBe(true);
  expect(r.model, 'รอยเปื้อนต้องอยู่บนโมเดล 3D จริง').toBe(true);
  expect(r.bathOk).toBe(true);
  expect(r.afterBath).toBe(false);
  expect(r.bathedToday).toBe(true);
  expect(r.again.ok).toBe(false);
  expect(r.again.reason).toBe('done');
  expect(r.modelAfter).toBe(false);
  expect(r.days).toBe(2);
  expect(errs).toEqual([]);
});

test('เฟส 12F: ความสุขต่ำ = น้องไปงีบในบ้าน · เรียกไม่ออก แต่ลูบ/อาบได้ แล้วออกมาเอง', async ({ page }) => {
  /* ต้องมีบ้านสัตว์เลี้ยงวางอยู่จริงถึงจะมีที่ให้งีบ */
  /* ใช้พิกัดชุดเดียวกับ tests/house-pets.spec.js (mapV 3 แล้วให้ migration เลื่อนให้เอง) */
  const errs = await house(page, {
    mapV: 3, econVer: 3, worldSeeded: true,
    decor: { out: [{ id: 'pet-house', x: 3, z: 3, rot: 0, col: 0 }], in: [] },
  });
  expect(await page.evaluate(() => window.HousePetCare.SLEEP_AT)).toBe(25);
  await page.evaluate(() => window.HousePetCare.setHappy(5));
  /* รอเงื่อนไข ไม่นอนรอเป็นวินาที (เวลาในเกมเดินตามเฟรมที่วาดจริง) */
  await page.waitForFunction(() => window.__houseDbg.petRest().lonely, null, { timeout: 20000 });
  const menu = await page.evaluate(() => {
    window.__houseDbg.petTap();                  /* แตะน้อง = ต้องเปิดเมนู ไม่ใช่เรียกออกมาเดินเล่น */
    return { on: window.__houseDbg.petMenu(), still: window.__houseDbg.petRest() };
  });
  expect(menu.on, 'แตะน้องที่งีบอยู่ต้องเปิดเมนูให้เลือก ไม่ใช่ทางตัน').toBe(true);
  expect(menu.still.lonely, 'ยังเรียกออกมาไม่ได้จนกว่าความสุขจะพ้น 25%').toBe(true);
  /* ลูบหัวได้เสมอแม้กำลังงีบ (ทางแก้ที่เด็กมีอยู่ในมือ) */
  expect(await page.evaluate(() => window.HousePetCare.pat().ok)).toBe(true);
  await page.evaluate(() => window.HousePetCare.setHappy(90));
  await page.waitForFunction(() => !window.__houseDbg.petRest().rest, null, { timeout: 20000 });
  expect(errs).toEqual([]);
});

test('เฟส 12G: เมนูฟองมี 4 กิจกรรม + เมนูสอนท่าโชว์ความคืบหน้าครบทุกท่า', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.__houseDbg.petTap());
  const menu = page.locator('#house-pet-menu');
  await expect(menu).toBeVisible();
  await expect(menu.locator('.hpm-btn')).toHaveCount(4);
  /* ปุ่มทุกใบต้องมีทั้งไอคอนและคำอธิบาย (เด็ก 5 ขวบดูรูปเป็นหลัก) */
  const shape = await menu.evaluate(el => Array.from(el.querySelectorAll('.hpm-btn')).map(b => ({
    ic: (b.querySelector('.hpm-ic') || {}).textContent || '',
    lb: (b.querySelector('.hpm-lb') || {}).textContent || '',
  })));
  shape.forEach(s => { expect(s.ic.length).toBeGreaterThan(0); expect(s.lb.length).toBeGreaterThan(0); });
  /* เข้าเมนูสอนท่า */
  await menu.locator('.hpm-btn').nth(3).click();
  const n = await page.evaluate(() => window.HousePetCare.TRICKS.length);
  await expect(menu.locator('.hpm-btn')).toHaveCount(n);
  const pips = await menu.evaluate(el => Array.from(el.querySelectorAll('.hpm-btn')).map(b => b.querySelectorAll('.hpm-pips i').length));
  const need = await page.evaluate(() => window.HousePetCare.TRICK_NEED);
  pips.forEach(p => expect(p).toBe(need));
  expect(errs).toEqual([]);
});

test('เฟส 12H: ปลอกคอ — มีหลายแบบหลายสี ใส่แล้วขึ้นบนโมเดลจริง และแบบฟรีต้องมี', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseShop, C = window.HousePetCare, D = window.__houseDbg;
    const free = S.PET_COLLARS.filter(c => c.price === 0);
    C.setCollar('classic', 3);
    D.restylePet();
    const on = D.petGear();
    return {
      styles: S.PET_COLLARS.length,
      colors: S.COLLAR_COLORS.length,
      freeN: free.length,
      owned: S.ownedCollars().map(c => c.id),
      ids: S.PET_COLLARS.map(c => c.id),
      on,
      worn: C.collar(),
    };
  });
  expect(r.styles).toBeGreaterThanOrEqual(6);
  expect(r.colors).toBeGreaterThanOrEqual(6);
  expect(r.freeN, 'ต้องมีปลอกคอฟรีอย่างน้อย 1 แบบตั้งแต่รับน้องมาเลี้ยง').toBeGreaterThanOrEqual(1);
  expect(new Set(r.ids).size).toBe(r.ids.length);
  expect(r.owned.length).toBeGreaterThanOrEqual(r.freeN);
  expect(r.on.collar, 'ปลอกคอต้องอยู่บนโมเดล 3D จริง').toBe(true);
  expect(r.on.style).toBe('classic');
  expect(r.worn.c).toBe(3);
  expect(errs).toEqual([]);
});

test('เฟส 12I: ลูกบอลแถมฟรี — ซื้อสัตว์แล้วเล่นได้ทันทีโดยไม่ต้องซื้ออะไรอีก', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseShop;
    return {
      toys: S.PET_TOYS.map(t => ({ id: t.id, price: t.price, free: !!t.free })),
      owned: S.ownedToys().map(t => t.id),
      ball: S.ownsToy('ball'),
    };
  });
  expect(r.ball, 'ลูกบอลต้องแถมฟรีมากับน้อง').toBe(true);
  expect(r.owned).toContain('ball');
  expect(r.toys.filter(t => t.free).length).toBeGreaterThanOrEqual(1);
  expect(errs).toEqual([]);
});

test('เฟส 12J: ปลอกคอ/ของเล่นขายที่ร้านสัตว์เลี้ยง และแยกขาดจากของตกแต่งบ้าน', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.HouseShop.open('shop-pet'));
  const tabs = page.locator('#house-shop-tabs .he-tab');
  await expect(tabs).not.toHaveCount(0);
  const labels = await tabs.allTextContents();
  expect(labels.join('|')).toContain('ปลอกคอ');
  expect(labels.join('|')).toContain('ของเล่น');
  /* ต้องไม่มี id ของปลอกคอ/ของเล่นหลุดไปอยู่ในคลังเฟอร์นิเจอร์ (ผู้ใช้สั่งให้แยกจาก decor) */
  const clash = await page.evaluate(() => {
    const S = window.HouseShop;
    const furn = new Set((window.__houseDbg.furn().items || []).map(f => f.id));
    const all = S.PET_COLLARS.map(c => c.id).concat(S.PET_TOYS.map(t => t.id));
    return all.filter(id => furn.has(id));
  });
  expect(clash).toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 12K: กิจกรรมจริงในโลก 3D — เล่นจบแล้วน้องต้องกลับมาเดินตามได้ตามปกติ', async ({ page }) => {
  const errs = await house(page);
  const h0 = await page.evaluate(() => { window.HousePetCare.setHappy(80); return window.HousePetCare.happiness(); });
  const during = await page.evaluate(() => {
    window.__houseDbg.petTap();
    document.querySelectorAll('#house-pet-menu .hpm-btn')[0].click();   /* 🤚 ลูบหัว */
    return window.__houseDbg.petAct();
  });
  expect(during, 'กดปุ่มแล้วต้องเข้าสู่กิจกรรมจริง').toBe('pat');
  /* ⚠ เวลาในเกมเดินตามเฟรมที่วาดจริง (dt จำกัดที่ .05) เครื่องเทสวาดช้ากว่าเครื่องเด็กมาก
     ⇒ **ต้องรอเงื่อนไข ห้ามนอนรอเป็นวินาที** ไม่งั้นเทสแดงแบบสุ่มบนเครื่องที่ช้ากว่า */
  await page.waitForFunction(() => !window.__houseDbg.petAct(), null, { timeout: 30000 });
  const r = await page.evaluate(() => ({
    menu: window.__houseDbg.petMenu(), h1: window.HousePetCare.happiness(),
    rest: window.__houseDbg.petRest(),
  }));
  expect(r.menu).toBe(false);
  expect(r.rest.rest, 'เล่นจบแล้วน้องต้องอยู่ข้างนอกเดินตามเด็กตามปกติ').toBe(false);
  expect(r.h1).toBeGreaterThan(h0);
  expect(errs).toEqual([]);
});
