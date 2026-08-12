const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" เฟส 1 — เศรษฐกิจ/ร้านค้า (js/house-shop.js)
   สิ่งที่ต้องไม่พังเด็ดขาด:
     1) เด็กใหม่ต้องได้ชุดเฟอร์นิเจอร์มาตรฐานวางในบ้านให้เลย (บ้านโล่ง = เล่นไม่สนุก)
     2) เด็กเก่าที่เล่นอยู่แล้ว **ของที่วางไว้/ใส่อยู่ต้องไม่หาย** หลังอัปเดต (กติกาเหล็กข้อ 3)
     3) ของที่ยังไม่ได้ซื้อต้องยังโชว์อยู่ในกล่องเลือกของ (จาง+ป้ายราคา) ไม่ใช่หายไป
     4) ซื้อของต้องตัดเงินผ่าน window.OwlCoins เท่านั้น และเงินไม่พอต้องซื้อไม่ได้ */

const CHILD = { id: 'shop-test', name: 'เทสร้าน', emoji: '🪙', birthDate: '2016-01-15' };
const HKEY = 'p1quiz_house_' + CHILD.id;

/* เปิดหน้าเว็บพร้อมตั้งเด็ก 1 คน (seedHouse = ข้อมูลบ้านที่มีอยู่ก่อน ถ้าอยากทดสอบ migration) */
async function openHouse(page, seedHouse) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    if (seed) localStorage.setItem(hkey, JSON.stringify(seed));
  }, [CHILD, HKEY, seedHouse || null]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseShop, null, { timeout: 30000 });
  await page.waitForTimeout(800);
  return errors;
}
const readHouse = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), HKEY);

test('เด็กใหม่: ได้ชุดเฟอร์นิเจอร์มาตรฐานวางในบ้าน + สิทธิ์ของชุดเริ่มต้นครบ', async ({ page }) => {
  const errors = await openHouse(page);
  expect(errors).toEqual([]);
  const d = await readHouse(page);
  /* ผูกกับค่าปัจจุบันของ SHOP ไม่ฝังเลขไว้ — ปั๊ม ECON_VER รอบหน้าจะได้ไม่ต้องมาไล่แก้เทส */
  expect(d.econVer).toBe(await page.evaluate(() => window.HouseShop.ECON_VER));

  /* 9 ชิ้นในบ้าน (ห้องนอน 2 · นั่งเล่น 3 · ครัว 3 · น้ำ 1) — ตามข้อ 26 ของแผนแม่บท + เตา */
  const inIds = (d.decor.in || []).map(r => r.id);
  ['crib', 'wardrobe', 'sofa', 'coffee-table', 'bookshelf', 'dining-table', 'chair', 'stove', 'toilet']
    .forEach(id => expect(inIds).toContain(id));

  /* ผังบ้าน 14×14: z<=6 ครึ่งบน (x0-7 นั่งเล่น | กำแพง x=8 | x9-13 ครัว)
                    z>=8 ครึ่งล่าง (x0-8 นอน | กำแพง x=9 | x10-13 น้ำ) · กำแพงนอน z=7 */
  const FW = { sofa: [2, 1], 'coffee-table': [1, 1], bookshelf: [1, 1], 'dining-table': [2, 2],
               chair: [1, 1], stove: [1, 1], crib: [1, 2], wardrobe: [2, 1], toilet: [1, 1] };
  const ROOM = { sofa: 'living', 'coffee-table': 'living', bookshelf: 'living',
                 stove: 'kitchen', 'dining-table': 'kitchen', chair: 'kitchen',
                 crib: 'bed', wardrobe: 'bed', toilet: 'bath' };
  const roomOf = (x, z) => z <= 7 ? (x <= 8 ? 'living' : 'kitchen') : (x <= 9 ? 'bed' : 'bath');
  const used = new Set();
  (d.decor.in || []).forEach(r => {
    expect(roomOf(r.x, r.z)).toBe(ROOM[r.id]);            // ของแต่ละชิ้นต้องอยู่ห้องที่ควรอยู่
    const [w, h] = FW[r.id] || [1, 1];
    for (let dz = 0; dz < h; dz++) for (let dx = 0; dx < w; dx++) {
      const x = r.x + dx, z = r.z + dz, k = x + ',' + z;
      expect(x < 14 && z < 14).toBe(true);                // ต้องอยู่ในกรอบบ้าน
      expect(z).not.toBe(7);                              // แนวกำแพงกลางบ้าน
      expect(z <= 6 && x === 8 && z !== 2 && z !== 3).toBe(false);    // กำแพงตั้งครึ่งบน
      expect(z >= 8 && x === 9 && z !== 10 && z !== 11).toBe(false);  // กำแพงตั้งครึ่งล่าง
      expect(x === 4 && z <= 1).toBe(false);              // ช่องประตูหน้าบ้าน
      expect(used.has(k)).toBe(false);                    // ห้ามวางทับกันเอง
      used.add(k);
    }
  });

  /* สิทธิ์: ของฉากนอกบ้านที่ seed ไว้ก็ต้องนับเป็นของเด็กด้วย (ลบแล้วหยิบกลับมาวางได้) */
  ['tree', 'fence-seg', 'path', 'sofa', 'toilet'].forEach(id => expect(d.unlocked).toContain(id));
  /* ชุดแต่งตัวเริ่มต้น: ทรงผม 2 · สีผม 3 (ดำ+น้ำตาล 2 เฉด) · สีเสื้อ 4 · สีกางเกง 3 · สีรองเท้า 2 */
  ['fit:hair:0', 'fit:hair:1', 'fit:hairC:0', 'fit:hairC:1', 'fit:hairC:2',
   'fit:shirt:2', 'fit:shirt:3', 'fit:shirt:4', 'fit:shirt:5', 'fit:bottom:0', 'fit:shoes:0']
    .forEach(k => expect(d.unlocked).toContain(k));
  /* index ที่แจกฟรีของแต่ละแถวต้องเรียงติดกัน (ไม่มีชิปที่ล็อกคั่นกลาง) */
  ['hair', 'hairC', 'shirt', 'bottom', 'shoes'].forEach(row => {
    const idx = d.unlocked.filter(k => k.startsWith('fit:' + row + ':'))
                          .map(k => Number(k.split(':')[2])).sort((a, b) => a - b);
    expect(idx.length).toBeGreaterThan(0);
    expect(idx[idx.length - 1] - idx[0]).toBe(idx.length - 1);
  });
  /* หมวก/แว่น/เป้/ของถือ ต้อง **ไม่** ได้ฟรี (ต้องซื้อทั้งหมด) */
  expect(d.unlocked.some(k => /^fit:(hat|glass|bag|hold):[1-9]/.test(k))).toBe(false);
});

test('migration: ของที่เด็กวางไว้/ใส่อยู่ก่อนอัปเดตต้องไม่หาย', async ({ page }) => {
  /* เด็กเก่า: วางเปียโน+แทรมโพลีน (ของแพงที่ชุดเริ่มต้นไม่มี) และใส่มงกุฎ+แว่นดาว */
  const legacy = {
    v: 1, mapV: 3, worldSeeded: true,
    decor: { out: [{ id: 'trampoline', x: 4, z: 5, rot: 0, col: 0 }], in: [{ id: 'piano', x: 2, z: 2, rot: 0, col: 0 }] },
    char: { gender: 0, hair: 3, hairC: 4, eyes: 1, eyeC: 2, shirt: 9, bottom: 7, shoes: 3,
            pattern: 4, hat: 5, hatC: 5, glass: 5, glassC: 9, bag: 2, bagC: 0, hold: 6, holdC: 2 },
  };
  const errors = await openHouse(page, legacy);
  expect(errors).toEqual([]);
  const d = await readHouse(page);
  /* ผูกกับค่าปัจจุบันของ SHOP ไม่ฝังเลขไว้ — ปั๊ม ECON_VER รอบหน้าจะได้ไม่ต้องมาไล่แก้เทส */
  expect(d.econVer).toBe(await page.evaluate(() => window.HouseShop.ECON_VER));

  /* ของที่วางอยู่ = ซื้อแล้ว */
  ['piano', 'trampoline'].forEach(id => expect(d.unlocked).toContain(id));
  /* ชุดที่ใส่อยู่ = ซื้อแล้วทุกชิ้น */
  ['fit:hair:3', 'fit:hairC:4', 'fit:eyeC:2', 'fit:shirt:9', 'fit:bottom:7', 'fit:shoes:3',
   'fit:pattern:4', 'fit:hat:5', 'fit:glass:5', 'fit:bag:2', 'fit:hold:6']
    .forEach(k => expect(d.unlocked).toContain(k));
  /* บ้านเดิมห้ามถูกจัดใหม่ทับ — ในบ้านยังมีแค่เปียโนตัวเดิม */
  expect((d.decor.in || []).map(r => r.id)).toEqual(['piano']);

  /* ใส่ชุดเดิมได้จริง (ชิปในหน้าแต่งตัวต้องไม่โดนล็อก) */
  const locked = await page.evaluate(() => {
    const S = window.HouseShop;
    return ['hat:5', 'glass:5', 'bag:2', 'hold:6'].filter(k => {
      const p = k.split(':');
      return !S.ownsFit(p[0], Number(p[1]));
    });
  });
  expect(locked).toEqual([]);
});

test('กล่องเลือกของ: ของที่ยังไม่ได้ซื้อยังโชว์อยู่ (จาง + ป้ายราคา) ไม่ถูกซ่อน', async ({ page }) => {
  /* ต้องมี char มาก่อน ไม่งั้นเปิดบ้านแล้วเด้งหน้าสร้างตัวละคร (hMode='creator') กดตกแต่งไม่ได้ */
  await openHouse(page, { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } });
  await page.locator('#house-decorate-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-edit-panel').hidden, null, { timeout: 10000 });
  const s = await page.evaluate(() => ({
    total:  document.querySelectorAll('#house-edit-items .he-item').length,
    locked: document.querySelectorAll('#house-edit-items .he-item.he-locked').length,
    priced: document.querySelectorAll('#house-edit-items .he-item-price').length,
  }));
  expect(s.total).toBeGreaterThan(0);
  expect(s.locked).toBeGreaterThan(0);        // ต้องมีของที่ยังซื้อไม่ได้โชว์อยู่จริง
  expect(s.priced).toBe(s.locked);            // ของที่ล็อกต้องมีป้ายราคาครบทุกชิ้น
});

test('ซื้อของ: ตัดเงินผ่าน OwlCoins · เงินไม่พอซื้อไม่ได้ · ซื้อแล้วปลดล็อกถาวร', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(() => {
    const S = window.HouseShop, C = window.OwlCoins;
    C.set(0);
    /* ⚠ เฟส 9 ย้าย `piano` ไปหมวดเครื่องดนตรี ราคาขึ้นเป็น 1,500 ⇒ ใช้ `tv` (ระดับ 3 = 140) แทน
       เพื่อทดสอบกลไกซื้อ-ตัดเงิน ส่วนราคาเครื่องดนตรีมีเทสของตัวเองที่ house-phase9.spec.js */
    const price = S.priceFurn('tv');                    // 140 (ระดับกลาง)
    const poor = S.buyFurn('tv');                       // เงิน 0 → ต้องซื้อไม่ได้
    C.set(500);
    const rich = S.buyFurn('tv');                       // เงินพอ → ซื้อได้
    const after = C.get();
    const twice = S.buyFurn('tv');                      // ซื้อซ้ำไม่ได้ (มีแล้ว)
    return { price, poor, rich, after, twice, owns: S.ownsFurn('tv'),
             cheap: S.priceFurn('bath-mat'), mid: S.priceFurn('sofa') };
  });
  expect(r.price).toBe(140);
  expect(r.cheap).toBe(25);
  expect(r.mid).toBe(140);
  expect(r.poor).toBe(false);
  expect(r.rich).toBe(true);
  expect(r.after).toBe(360);                            // 500 - 140
  expect(r.twice).toBe(false);
  expect(r.owns).toBe(true);
  /* สิทธิ์ต้องถูกบันทึกลง house save (export/import ย้ายเครื่องตามไปด้วย) */
  const d = await readHouse(page);
  expect(d.unlocked).toContain('tv');
});

test('หน้าแต่งตัว: แถวสีของเครื่องแต่งโผล่เฉพาะตอนใส่ชิ้นนั้นอยู่', async ({ page }) => {
  /* เด็กที่มีสิทธิ์เฉพาะหมวกแบบ 1 — ยังไม่ได้ใส่อะไรเลย */
  await openHouse(page, {
    v: 1, mapV: 3, econVer: 2,
    unlocked: ['fit:hair:0', 'fit:shirt:5', 'fit:bottom:0', 'fit:shoes:0', 'fit:hat:1'],
    char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0,
            pattern: 0, hat: 0, hatC: 5, glass: 0, glassC: 9, bag: 0, bagC: 0, hold: 0, holdC: 2 },
  });
  await page.locator('#house-edit-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-creator').hidden, null, { timeout: 10000 });
  const rows = () => page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-creator-rows .house-row-label span:last-child')).map(e => e.textContent));

  /* ยังไม่ใส่อะไร → ต้องไม่มีแถวสีของเครื่องแต่งสักแถว */
  const before = await rows();
  ['สีเครื่องหัว', 'สีแว่นตา', 'สีของสะพาย', 'สีของถือ'].forEach(l => expect(before).not.toContain(l));
  expect(before).toContain('เครื่องหัว');          // ตัวเลือกชิ้นของยังอยู่ครบ

  /* ใส่หมวกแบบที่ 1 → แถว "สีเครื่องหัว" ต้องโผล่ทันที ต่อท้ายแถวเครื่องหัว */
  await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('#house-creator-rows > div'))
      .find(d => /เครื่องหัว/.test(d.textContent));
    row.querySelectorAll('.house-chip')[1].click();
  });
  await page.waitForTimeout(400);
  const after = await rows();
  expect(after.indexOf('สีเครื่องหัว')).toBe(after.indexOf('เครื่องหัว') + 1);
  ['สีแว่นตา', 'สีของสะพาย', 'สีของถือ'].forEach(l => expect(after).not.toContain(l));

  /* ถอดหมวกกลับ (✖) → แถวสีหายไปอีกครั้ง */
  await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('#house-creator-rows > div'))
      .find(d => /^.{0,4}เครื่องหัว/.test(d.textContent));
    row.querySelectorAll('.house-chip')[0].click();
  });
  await page.waitForTimeout(400);
  expect(await rows()).not.toContain('สีเครื่องหัว');
});

test('หน้าแต่งตัว: ลายเสื้อมาก่อนสีเสื้อ และมีเส้นคั่นแบ่งกลุ่ม', async ({ page }) => {
  await openHouse(page, { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } });
  await page.locator('#house-edit-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-creator').hidden, null, { timeout: 10000 });
  const r = await page.evaluate(() => ({
    labels: Array.from(document.querySelectorAll('#house-creator-rows .house-row-label span:last-child')).map(e => e.textContent),
    seps: document.querySelectorAll('#house-creator-rows .house-row-sep').length,
  }));
  expect(r.labels.indexOf('ลายเสื้อ')).toBe(r.labels.indexOf('สีเสื้อ') - 1);
  /* 10 กลุ่ม (เพศ/ผม/ตา/เสื้อ/กางเกง/รองเท้า/เครื่องหัว/แว่น/เป้/ของถือ) → เส้นคั่น 9 เส้น */
  expect(r.seps).toBe(9);
});

test('หน้าร้าน: แตะการ์ด = ดูตัวอย่าง 3D + แถบซื้อ · การ์ดขนาดเท่ากันทุกใบ · พรีวิวได้ทุกแบบรวมสี', async ({ page }) => {
  await openHouse(page, { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } });
  await page.evaluate(() => { window.OwlCoins.set(400); window.HouseShop.open('mall-furniture'); });
  await page.waitForTimeout(500);

  /* เข้าร้านปุ๊บต้องเจอหน้าพรีวิวของชิ้นแรกเลย ไม่ใช่ตารางเปล่าๆ */
  expect(await page.evaluate(() => document.body.classList.contains('house-preview'))).toBe(true);
  expect(await page.evaluate(() => document.getElementById('house-shop-buy').hidden)).toBe(false);

  /* ทุกใบต้องสูงเท่ากันเป๊ะ ไม่ว่าชื่อจะสั้นหรือยาว */
  const heights = await page.evaluate(() =>
    Array.from(new Set(Array.from(document.querySelectorAll('#house-shop-items .hs-card'))
      .map(e => Math.round(e.getBoundingClientRect().height)))));
  expect(heights.length).toBe(1);

  /* แตะการ์ด = เลือกดู ไม่ใช่ซื้อทันที (เงินต้องไม่ลด) */
  const picked = await page.evaluate(() => {
    const c = Array.from(document.querySelectorAll('#house-shop-items .hs-card'))
      .find(e => /เก้าอี้นวม/.test(e.textContent));
    c.click();
    return null;
  });
  await page.waitForTimeout(500);
  const st = await page.evaluate(() => ({
    preview: document.body.classList.contains('house-preview'),
    selected: document.querySelectorAll('#house-shop-items .hs-card.hs-sel').length,
    barShown: !document.getElementById('house-shop-buy').hidden,
    barText: document.getElementById('house-shop-buy').textContent,
    coins: window.OwlCoins.get(),
    owns: window.HouseShop.ownsFurn('armchair'),
    cardShown: !document.getElementById('house-prev-card').hidden,
    listShown: document.querySelectorAll('#house-shop-items .hs-card').length > 0
               && getComputedStyle(document.getElementById('house-shop-items')).display !== 'none',
  }));
  expect(st.preview).toBe(true);            // โมเดล 3D ขึ้นแล้ว
  expect(st.cardShown).toBe(true);          // กรอบพรีวิวลอยอยู่จริง
  expect(st.listShown).toBe(true);          // **รายการสินค้ายังอยู่ครบ ไม่ใช่สลับหน้า**
  expect(st.selected).toBe(1);
  expect(st.barShown).toBe(true);
  expect(st.barText).toContain('เก้าอี้นวม');
  expect(st.coins).toBe(400);               // แตะดูเฉยๆ ห้ามตัดเงิน
  expect(st.owns).toBe(false);

  /* กดปุ่มในแถบซื้อถึงจะซื้อจริง */
  await page.evaluate(() => document.querySelector('#house-shop-buy .hs-buy-btn').click());
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.OwlCoins.get())).toBe(260);   // 400 - 140
  expect(await page.evaluate(() => window.HouseShop.ownsFurn('armchair'))).toBe(true);

  /* แถบซื้อไม่มีปุ่ม ← แล้ว (เอาออก 2026-08-08) — กดการ์ดใบอื่นเปลี่ยนของที่ดูได้เลย */
  expect(await page.evaluate(() => document.querySelectorAll('#house-shop-buy .hs-buy-back').length)).toBe(0);

  /* ชุดแต่งตัวพรีวิวได้ทุกแถว — แบบ "มีทรง" (หมวก) */
  await page.evaluate(() => window.HouseShop.open('mall-fashion'));
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('#house-shop-tabs .he-tab')).find(b => /หมวก/.test(b.textContent)).click();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('#house-shop-items .hs-card')[0].click());
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.body.classList.contains('house-preview'))).toBe(true);

  /* ...และแถวสีก็พรีวิวได้เหมือนกัน (เห็นสีจริงบนตัวละคร ไม่ใช่แค่สวอตช์เล็กๆ) */
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('#house-shop-tabs .he-tab')).find(b => /เสื้อ/.test(b.textContent)).click();
  });
  await page.waitForTimeout(300);
  /* เปลี่ยนหมวดแล้วพรีวิวต้อง **ไม่หาย** — เลื่อนไปโชว์ของชิ้นแรกของหมวดใหม่แทน */
  expect(await page.evaluate(() => document.body.classList.contains('house-preview'))).toBe(true);
  expect(await page.evaluate(() => document.getElementById('house-shop-buy').hidden)).toBe(false);
  await page.evaluate(() => document.querySelectorAll('#house-shop-items .hs-card')[0].click());
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.body.classList.contains('house-preview'))).toBe(true);
  expect(await page.evaluate(() => document.getElementById('house-shop-buy').hidden)).toBe(false);

  /* ปุ่มย้อนกลับซ้ายบน = ออกจากร้าน (ยังอยู่ในบ้าน) · พรีวิว/แถบซื้อต้องถูกเก็บให้หมด */
  await page.locator('#house-back').dispatchEvent('click');
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({
    preview: document.body.classList.contains('house-preview'),
    bar: document.getElementById('house-shop-buy').hidden,
    shop: document.getElementById('house-shop').hidden,
    card: document.getElementById('house-prev-card').hidden,
    stillHome: !document.getElementById('house-view').hidden,   // ยังไม่หลุดออกจากโหมดบ้าน
  }));
  expect(after).toEqual({ preview: false, bar: true, shop: true, card: true, stillHome: true });
});

test('หน้าร้าน: เปิดห้างเฟอร์นิเจอร์/ห้างแฟชั่นแล้วมีสินค้าโชว์ครบ', async ({ page }) => {
  await openHouse(page);
  /* แถบหมวดต้องเห็นครบทุกหมวดพร้อมกัน ไม่มีอันไหนถูกตัด/ถูก scrollbar บัง (ขึ้นบรรทัดใหม่ได้ ไม่เลื่อนแนวนอน) */
  const tabState = () => page.evaluate(() => {
    const t = document.getElementById('house-shop-tabs');
    const box = t.getBoundingClientRect();
    const tabs = Array.from(t.querySelectorAll('.he-tab'));
    return {
      tabs: tabs.length,
      secs: t.querySelectorAll('.hs-tabsec').length,
      icons: t.querySelectorAll('.he-tab-ic svg').length,
      clippedY: t.scrollHeight - t.clientHeight,      // 0 = ไม่มีหมวดไหนถูกตัดหาย
      wrap: getComputedStyle(t).flexWrap,             // wrap = ขึ้นบรรทัดใหม่ ไม่เลื่อนแนวนอน
      ovfY: getComputedStyle(t).overflowY,            // ต้องเป็น visible = ไม่มี scrollbar เลื่อนหาหมวด
      /* ปุ่ม "ออกจากร้าน" ต้องอยู่ในจอเสมอ — แถบหมวดไม่มีเพดานแล้ว ถ้ายาวเกินจะดันปุ่มตกขอบ */
      btnIn: Math.round(document.getElementById('house-shop-close').getBoundingClientRect().bottom) <= innerHeight + 1,
      /* ห้ามมีแท็บล้นออกนอกกรอบทางแนวนอน (= เลื่อนแนวนอนแล้วมีหมวดซ่อนอยู่ทางขวา ซึ่งคือบั๊กเดิม)
         แนวตั้งไม่เช็คตรงนี้ เพราะถ้าจอเตี้ยมากแถบจะเลื่อนแนวตั้งได้ ไม่มีหมวดไหนหายถาวร */
      outsideX: tabs.filter(b => {
        const r = b.getBoundingClientRect();
        return r.right > box.right + 1 || r.left < box.left - 1;
      }).length,
    };
  });

  const furn = await page.evaluate(() => {
    window.HouseShop.open('mall-furniture');
    return {
      open:  !document.getElementById('house-shop').hidden,
      cards: document.querySelectorAll('#house-shop-items .hs-card').length,
      title: document.getElementById('house-shop-title').textContent,
    };
  });
  expect(furn.open).toBe(true);
  expect(furn.cards).toBeGreaterThan(0);
  const ft = await tabState();
  /* 7 หมวดในบ้านล้วน — ของนอกบ้านย้ายไปร้านต้นไม้/ร้านของเล่นแล้วเมื่อ 2026-08-08 (ข้อ 17.4)
     กลุ่มเดียวจึงไม่ต้องมีหัวข้อกลุ่มคั่น · เฟส 9 เพิ่มหมวด "เครื่องดนตรี" (scope in) อีก 1 หมวด */
  expect(ft.tabs).toBe(7);
  expect(ft.secs).toBe(0);
  expect(ft.wrap).toBe('wrap');
  expect(ft.clippedY).toBe(0);                  // ต้องเห็นหมวดครบพร้อมกัน ไม่ถูกตัด
  expect(ft.outsideX).toBe(0);
  expect(ft.icons).toBe(ft.tabs);               // ทุกหมวดต้องมีไอคอน SVG
  expect(ft.ovfY).toBe('visible');              // ห้ามมี scrollbar ที่แถบหมวด
  expect(ft.btnIn).toBe(true);

  const fash = await page.evaluate(() => {
    window.HouseShop.open('mall-fashion');
    const cards = Array.from(document.querySelectorAll('#house-shop-items .hs-card'));
    return {
      cards: cards.length,
      /* ตัวเลือก "ไม่ใส่" เป็นของฟรี ต้องไม่ถูกเอามาวางขาย */
      hasFree: cards.some(c => /ไม่ใส่|ไม่ถือ|ไม่สะพาย/.test(c.textContent)),
    };
  });
  expect(fash.cards).toBeGreaterThan(0);
  expect(fash.hasFree).toBe(false);
  const st = await tabState();
  /* 10 หมวด = ผม/ดวงตา/เสื้อ/กางเกง/แบบรองเท้า/สีรองเท้า + เครื่องหัว/แว่นตา/สะพายหลัง/ของถือ
     (สีของแต่ละชิ้นอยู่ในแท็บของชิ้นนั้น ไม่แยกเป็นหมวดต่างหาก)
     ⚠ เฟส 8 เพิ่มแท็บ "แบบรองเท้า" เข้ามา — ตัวเลขนี้ขึ้นได้ แต่ `clippedY` ด้านล่าง
       ต้องเป็น 0 เสมอ (หมวดต้องเห็นครบพร้อมกันโดยไม่ต้องเลื่อนหา) */
  expect(st.tabs).toBe(10);
  expect(st.secs).toBe(2);                      // หัวข้อกลุ่ม: ตัวเรา / ของแต่ง
  expect(st.clippedY).toBe(0);                  // ต้องเห็นหมวดครบพร้อมกัน ไม่ต้องมี scrollbar เลื่อนหา
  expect(st.outsideX).toBe(0);
  expect(st.icons).toBe(st.tabs);               // ทุกหมวดต้องมีไอคอน SVG
  expect(st.ovfY).toBe('visible');              // ห้ามมี scrollbar ที่แถบหมวด
  expect(st.btnIn).toBe(true);

  await page.evaluate(() => window.HouseShop.close());
  expect(await page.evaluate(() => document.getElementById('house-shop').hidden)).toBe(true);
});

/* ---------- ร้านใหม่ 2 ร้าน + ย้ายหมวดของนอกบ้าน (2026-08-08 · ข้อ 17.4 ของ QUEST-DESIGN.md) ----------
   ของนอกบ้านเคยขายรวมอยู่ในห้างเฟอร์นิเจอร์ ย้ายมาร้านต้นไม้/ร้านของเล่นแล้ว
   ⚠ จุดที่พังแล้วเจ็บที่สุด = **มีหมวดตกหล่นไม่มีร้านไหนขาย** เด็กจะซื้อของหมวดนั้นไม่ได้ตลอดกาล
     (ผิดกติกาเหล็กข้อ 1 "ห้ามมี dead end") — เทสข้อแรกคือตัวดักเรื่องนี้ */
test('ทุกหมวดเฟอร์นิเจอร์ต้องมีร้านขายเสมอ ห้ามมีหมวดที่ตกหล่น', async ({ page }) => {
  const errors = await openHouse(page, { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } });
  const r = await page.evaluate(() => {
    const S = window.HouseShop;
    const sold = new Set();
    Object.keys(S.SHOPS).forEach(id => {
      (S.SHOPS[id].groups || []).forEach(([sc, label, only]) => {
        S.open(id);
        Array.from(document.querySelectorAll('#house-shop-tabs .he-tab')).forEach(() => {});
        (only || []).forEach(c => sold.add(sc + ':' + c));
        if (!only) sold.add(sc + ':*');
        S.close();
      });
    });
    return { sold: Array.from(sold) };
  });
  /* หมวดทั้งหมดที่มีของจริงในคลัง */
  const all = await page.evaluate(() => {
    const seen = {};
    /* อ่านจากการ์ดที่ร้านวาดจริงทุกร้าน — ไม่ต้องพึ่ง FURN ที่อยู่ใน IIFE ของ house.js */
    const S = window.HouseShop, out = {};
    Object.keys(S.SHOPS).forEach(id => {
      S.open(id);
      Array.from(document.querySelectorAll('#house-shop-tabs .he-tab')).forEach(t => {
        t.click();
        out[id] = (out[id] || 0) + document.querySelectorAll('#house-shop-items .hs-card').length;
      });
      S.close();
    });
    return out;
  });
  /* ร้านที่ขายเฟอร์นิเจอร์ทุกร้านต้องมีของจริงอย่างน้อย 1 ชิ้น (ร้านว่าง = หมวดตกหล่น) */
  ['mall-furniture', 'shop-garden', 'shop-toy'].forEach(id => {
    expect(all[id], 'ร้าน ' + id + ' ต้องมีสินค้า').toBeGreaterThan(0);
  });
  expect(r.sold).toContain('out:garden');
  expect(r.sold).toContain('out:seatout');
  expect(r.sold).toContain('out:decorout');
  expect(r.sold).toContain('out:play');
  expect(errors).toEqual([]);
});

test('ร้านต้นไม้/ร้านของเล่น: เปิดได้ มีหมวดถูกต้อง และห้างเฟอร์นิเจอร์ไม่มีของนอกบ้านแล้ว', async ({ page }) => {
  const errors = await openHouse(page, { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } });
  const shopTabs = id => page.evaluate(i => {
    window.HouseShop.open(i);
    const t = Array.from(document.querySelectorAll('#house-shop-tabs .he-tab')).map(b => b.textContent.trim());
    const n = document.querySelectorAll('#house-shop-items .hs-card').length;
    window.HouseShop.close();
    return { t, n };
  }, id);

  const furn = await shopTabs('mall-furniture');
  /* ⚠ เฟส 9 เพิ่มหมวด "เครื่องดนตรี" (scope in) ⇒ ห้างเฟอร์นิเจอร์ที่ขาย "ทุกหมวดของ in"
     จึงมีแท็บนี้ด้วยโดยอัตโนมัติ — ถูกต้องแล้ว ของยังอยู่ในบ้านล้วนเหมือนเดิม */
  expect(furn.t).toEqual(['ที่นั่ง', 'โต๊ะ', 'ห้องนอน', 'ครัว', 'ห้องน้ำ', 'ตกแต่ง', 'เครื่องดนตรี']);
  expect(furn.t).not.toContain('เครื่องเล่น');
  expect(furn.t).not.toContain('ตกแต่งสวน');

  const gd = await shopTabs('shop-garden');
  expect(gd.t).toEqual(['ต้นไม้', 'ที่นั่ง', 'ตกแต่งสวน']);
  expect(gd.n).toBeGreaterThan(0);

  const toy = await shopTabs('shop-toy');
  expect(toy.t).toEqual(['เครื่องเล่น']);
  expect(toy.n).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('ผังเมือง: ล็อตที่ย้าย/เพิ่มใหม่ ต้องมีช่องหน้าประตูเดินได้จริง ไม่มีตึกทับกัน', async ({ page }) => {
  const errors = await openHouse(page, { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } });
  const r = await page.evaluate(() => {
    const M = window.HOUSE_MAP({ inBox: (b, x, z) => !!b && x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1 });
    const g = window.__houseDbg.grid();
    const lots = M.VILLAGE_LOTS;
    const at = id => lots.filter(l => l.id === id)[0];
    const door = l => l.face === 'x'
      ? { x: l.x1 + 1, z: Math.round((l.z0 + l.z1) / 2) }
      : { x: Math.round((l.x0 + l.x1) / 2), z: l.z1 + 1 };
    const walk = (x, z) => { const v = (g[z] || [])[x]; return v === 0 || v === 2; };
    /* ล็อตทับกันเองไหม (เช็คทุกคู่) */
    let overlap = null;
    for (let i = 0; i < lots.length && !overlap; i++) for (let j = i + 1; j < lots.length; j++) {
      const a = lots[i], b = lots[j];
      if (a.x0 <= b.x1 && b.x0 <= a.x1 && a.z0 <= b.z1 && b.z0 <= a.z1) { overlap = a.id + ' ทับ ' + b.id; break; }
    }
    const ids = ['carpenter-hut', 'shop-garden', 'shop-toy', 'mall-fashion', 'mall-furniture'];
    return {
      overlap,
      lots: ids.map(id => { const l = at(id); return l ? { id, box: [l.x0, l.x1, l.z0, l.z1], face: l.face || 'z', doorWalk: walk(door(l).x, door(l).z) } : { id, missing: true }; }),
    };
  });
  expect(r.overlap, 'ล็อตอาคารห้ามทับกัน').toBeNull();
  r.lots.forEach(l => {
    expect(l.missing, 'ล็อต ' + l.id + ' ต้องมีอยู่').toBeFalsy();
    expect(l.doorWalk, 'ช่องหน้าประตูของ ' + l.id + ' ต้องเดินได้').toBe(true);
  });
  /* ห้างทั้งสองหลังต้องหันหน้าทางเดียวกัน (ผู้ใช้สั่งเมื่อ 2026-08-08) */
  const fash = r.lots.filter(l => l.id === 'mall-fashion')[0];
  const furn = r.lots.filter(l => l.id === 'mall-furniture')[0];
  expect(fash.face).toBe('x');
  expect(fash.face).toBe(furn.face);
  expect(errors).toEqual([]);
});
