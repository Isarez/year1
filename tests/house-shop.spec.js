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
  expect(d.econVer).toBe(2);

  /* 8 ชิ้นในบ้าน (ห้องนอน 2 · นั่งเล่น 3 · ครัว 2 · น้ำ 1) — ตามข้อ 26 ของแผนแม่บท */
  const inIds = (d.decor.in || []).map(r => r.id);
  ['crib', 'wardrobe', 'sofa', 'coffee-table', 'bookshelf', 'dining-table', 'chair', 'toilet']
    .forEach(id => expect(inIds).toContain(id));

  /* ของที่วางให้ต้องอยู่ถูกห้องจริง ไม่ทับกำแพง/ประตูหน้าบ้าน และไม่ทับกันเอง */
  const FW = { sofa: [2, 1], 'coffee-table': [1, 1], bookshelf: [1, 1], 'dining-table': [2, 2],
               chair: [1, 1], crib: [1, 2], wardrobe: [2, 1], toilet: [1, 1] };
  const used = new Set();
  (d.decor.in || []).forEach(r => {
    const [w, h] = FW[r.id] || [1, 1];
    for (let dz = 0; dz < h; dz++) for (let dx = 0; dx < w; dx++) {
      const x = r.x + dx, z = r.z + dz, k = x + ',' + z;
      expect(z).not.toBe(7);                              // แนวกำแพงกลางบ้าน
      expect(z <= 6 && x === 12 && z !== 2 && z !== 3).toBe(false);   // กำแพงตั้งครึ่งบน
      expect(z >= 8 && x === 14 && z !== 10 && z !== 11).toBe(false); // กำแพงตั้งครึ่งล่าง
      expect(x === 4 && z <= 1).toBe(false);              // ช่องประตูหน้าบ้าน
      expect(used.has(k)).toBe(false);                    // ห้ามวางทับกันเอง
      used.add(k);
    }
  });

  /* สิทธิ์: ของฉากนอกบ้านที่ seed ไว้ก็ต้องนับเป็นของเด็กด้วย (ลบแล้วหยิบกลับมาวางได้) */
  ['tree', 'fence-seg', 'path', 'sofa', 'toilet'].forEach(id => expect(d.unlocked).toContain(id));
  /* ชุดแต่งตัวเริ่มต้น: ทรงผม 2 · สีเสื้อ 4 · สีกางเกง 3 · สีรองเท้า 2 */
  ['fit:hair:0', 'fit:hair:1', 'fit:shirt:5', 'fit:bottom:0', 'fit:shoes:0']
    .forEach(k => expect(d.unlocked).toContain(k));
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
  expect(d.econVer).toBe(2);

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
    const price = S.priceFurn('piano');                 // 300 (ระดับใหญ่/พิเศษ)
    const poor = S.buyFurn('piano');                    // เงิน 0 → ต้องซื้อไม่ได้
    C.set(500);
    const rich = S.buyFurn('piano');                    // เงินพอ → ซื้อได้
    const after = C.get();
    const twice = S.buyFurn('piano');                   // ซื้อซ้ำไม่ได้ (มีแล้ว)
    return { price, poor, rich, after, twice, owns: S.ownsFurn('piano'),
             cheap: S.priceFurn('bath-mat'), mid: S.priceFurn('sofa') };
  });
  expect(r.price).toBe(300);
  expect(r.cheap).toBe(25);
  expect(r.mid).toBe(140);
  expect(r.poor).toBe(false);
  expect(r.rich).toBe(true);
  expect(r.after).toBe(200);                            // 500 - 300
  expect(r.twice).toBe(false);
  expect(r.owns).toBe(true);
  /* สิทธิ์ต้องถูกบันทึกลง house save (export/import ย้ายเครื่องตามไปด้วย) */
  const d = await readHouse(page);
  expect(d.unlocked).toContain('piano');
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

test('หน้าร้าน: เปิดห้างเฟอร์นิเจอร์/ห้างแฟชั่นแล้วมีสินค้าโชว์ครบ', async ({ page }) => {
  await openHouse(page);
  const furn = await page.evaluate(() => {
    window.HouseShop.open('mall-furniture');
    return {
      open:  !document.getElementById('house-shop').hidden,
      tabs:  document.querySelectorAll('#house-shop-tabs .he-tab').length,
      cards: document.querySelectorAll('#house-shop-items .hs-card').length,
      title: document.getElementById('house-shop-title').textContent,
    };
  });
  expect(furn.open).toBe(true);
  expect(furn.tabs).toBe(10);                   // 6 หมวดในบ้าน + 4 หมวดนอกบ้าน (ยังไม่แยกไปร้านอื่นจนเฟส 2-3)
  expect(furn.cards).toBeGreaterThan(0);

  const fash = await page.evaluate(() => {
    window.HouseShop.open('mall-fashion');
    const cards = Array.from(document.querySelectorAll('#house-shop-items .hs-card'));
    return {
      tabs:  document.querySelectorAll('#house-shop-tabs .he-tab').length,
      cards: cards.length,
      /* ตัวเลือก "ไม่ใส่" เป็นของฟรี ต้องไม่ถูกเอามาวางขาย */
      hasFree: cards.some(c => /ไม่ใส่|ไม่ถือ|ไม่สะพาย/.test(c.textContent)),
    };
  });
  expect(fash.tabs).toBe(11);                   // 11 แถวที่มีราคา (เพศ/ทรงตา/สีของแต่ง = ฟรี ไม่ขาย)
  expect(fash.cards).toBeGreaterThan(0);
  expect(fash.hasFree).toBe(false);

  await page.evaluate(() => window.HouseShop.close());
  expect(await page.evaluate(() => document.getElementById('house-shop').hidden)).toBe(true);
});
