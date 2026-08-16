/* ============================================================
   เฟส 8 — เฟอร์นิเจอร์ 180 ชิ้น · ของแต่งตัว 114 แบบ · ปุ่มเลือกเป็นไอคอน SVG

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. เฟอร์นิเจอร์ทุกชิ้นต้องมีราคาใน FURN_TIER และอยู่ในหมวดที่มีร้านขายจริง
     2. **index ของแบบเดิมห้ามขยับ** — เก็บตรงๆ ใน save ของเด็ก ขยับแล้วตัวละครเปลี่ยนหน้าตาเองทั้งเมือง
     3. แบบรองเท้า index 0 ต้องเป็นทรงผ้าใบเดิม (เด็กก่อนเฟส 8 ไม่มีคีย์นี้ ⇒ ตกมาที่ 0)
     4. ปุ่มเลือกในหน้าแต่งตัวต้องเป็น "รูปของชิ้นนั้น" ไม่ใช่ตัวเลข (เด็ก 5 ขวบอ่านเลขแล้วไม่รู้ว่าคืออะไร)
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p8a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function house(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_p8a', JSON.stringify({ v:1, mapV: 3,
      char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0} }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  return errs;
}

test('เฟส 8A: คลังเฟอร์นิเจอร์ครบ 180 ชิ้น · id ไม่ซ้ำ · ทุกชิ้นมีราคาและมีร้านขาย', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const items = window.__houseDbg.furn().items;
    const ids = items.map(i => i.id);
    /* ร้านประกาศของที่ขายด้วย `groups: [[scope, หัวข้อ, [หมวด...]]]`
       ⚠ ไม่ใส่รายชื่อหมวด = ขาย "ทุกหมวดของ scope นั้น" ⇒ ต้องกางออกมาเองก่อนเทียบ */
    const F0 = window.__houseDbg.furn();
    const shopCats = {};
    Object.values(window.HouseShop.SHOPS || {}).forEach(sh => {
      (sh.groups || []).forEach(([scope, , list]) => {
        if (list && list.length) list.forEach(c => shopCats[c] = true);
        else (F0.cats[scope] || []).forEach(c => shopCats[c.id] = true);
      });
    });
    return {
      n: items.length,
      dup: ids.filter((v, i) => ids.indexOf(v) !== i),
      noPrice: items.filter(i => !window.HouseShop.priceFurn(i.id)).map(i => i.id),
      noShop: [...new Set(items.map(i => i.cat))].filter(c => !shopCats[c]),
      noEmoji: items.filter(i => !i.emoji || !i.name).map(i => i.id),
    };
  });
  console.log('เฟอร์นิเจอร์: ' + r.n + ' ชิ้น');
  /* ⚠ เฟส 9 เพิ่มเครื่องดนตรีเข้าคลังอีก 10 ชิ้น ⇒ เช็คเป็น "อย่างน้อย" ไม่ใช่เท่ากับ
     (ล็อกตัวเลขตายตัวไว้ทำให้เฟสถัดไปที่เพิ่มของทำเทสนี้แดงทั้งที่ไม่ได้ผิดอะไร) */
  expect(r.n, 'เฟส 8 ต้องมีอย่างน้อย 180 ชิ้นตามตารางข้อ 27').toBeGreaterThanOrEqual(180);
  expect(r.dup, 'id ห้ามซ้ำ (ผูก save/inventory ของเด็ก)').toEqual([]);
  expect(r.noPrice, 'ทุกชิ้นต้องมีราคา').toEqual([]);
  expect(r.noShop, 'ทุกหมวดต้องมีร้านขาย ห้ามมีหมวดตกหล่น').toEqual([]);
  expect(r.noEmoji, 'ทุกชิ้นต้องมีชื่อ + ไอคอน').toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 8A: ของใหม่ทุกชิ้นสร้าง 3D ได้จริง ไม่มีชิ้นไหนพัง', async ({ page }) => {
  test.setTimeout(90000);
  const errs = await house(page);
  const bad = await page.evaluate(() => {
    const F = window.__houseDbg.furn();
    const out = [];
    F.items.forEach(it => {
      try {
        const g = window.__houseDbg.buildFurn(it.id);
        if (!g || !g.children || !g.children.length) out.push(it.id + ': ไม่มี mesh เลย');
      } catch (e) { out.push(it.id + ': ' + e.message); }
    });
    return out;
  });
  expect(bad).toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 8B: ของแต่งตัวครบ 114 แบบ · ชื่อไทยครบ · index เดิมไม่ขยับ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const rows = {};
    window.__houseDbg.rows().forEach(rw => { if (rw.type === 'num') rows[rw.key] = rw.n; });
    const names = window.HouseShop.FIT_NAMES || {};
    const missing = Object.keys(rows).filter(k => k !== 'gender' && k !== 'eyes'
      && (!names[k] || names[k].length !== rows[k]));
    return { rows, missing, total: Object.values(rows).reduce((a, b) => a + b, 0) };
  });
  console.log('ของแต่งตัว: ' + JSON.stringify(r.rows) + ' รวม ' + r.total);
  /* ตัวเลขที่ล็อกไว้หลังเฟส 8 — ลดลงเมื่อไหร่แปลว่ามีคนลบแบบทิ้ง (index ของเด็กจะเลื่อน) */
  expect(r.rows.hair).toBeGreaterThanOrEqual(12);
  expect(r.rows.eyes).toBeGreaterThanOrEqual(12);
  expect(r.rows.pattern).toBeGreaterThanOrEqual(20);
  expect(r.rows.hat).toBeGreaterThanOrEqual(18);
  expect(r.rows.glass).toBeGreaterThanOrEqual(12);
  expect(r.rows.bag).toBeGreaterThanOrEqual(14);
  expect(r.rows.hold).toBeGreaterThanOrEqual(18);
  expect(r.rows.shoeStyle, 'แถวแบบรองเท้าของเฟส 8').toBeGreaterThanOrEqual(8);
  expect(r.total).toBeGreaterThanOrEqual(114);
  expect(r.missing, 'แถวที่ชื่อไทยไม่ครบทุกแบบ').toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 8B: ทุกแบบสร้างตัวละครได้จริง ไม่มีแบบไหนทำให้พัง', async ({ page }) => {
  test.setTimeout(120000);
  const errs = await house(page);
  const bad = await page.evaluate(() => {
    const out = [];
    const rows = window.__houseDbg.rows().filter(r => r.type === 'num' && r.key !== 'gender');
    [0, 1].forEach(gender => {
      rows.forEach(row => {
        for (let i = 0; i < row.n; i++) {
          const cfg = Object.assign({}, window.__houseDbg.defaultChar(), { gender });
          cfg[row.key] = i;
          try {
            const g = window.__houseDbg.buildChar(cfg);
            if (!g || !g.children || !g.children.length) out.push(row.key + '[' + i + '] เพศ' + gender + ': ว่าง');
          } catch (e) { out.push(row.key + '[' + i + '] เพศ' + gender + ': ' + e.message); }
        }
      });
    });
    return out;
  });
  expect(bad).toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 8B: แบบรองเท้า index 0 ต้องเป็นทรงเดิม — เด็กก่อนเฟส 8 หน้าตาห้ามเปลี่ยน', async ({ page }) => {
  const errs = await house(page);
  const same = await page.evaluate(() => {
    /* save เก่าไม่มีคีย์ shoeStyle เลย ⇒ ต้องได้ผลเท่ากับตั้ง shoeStyle:0 เป๊ะ */
    const base = window.__houseDbg.defaultChar();
    const old = Object.assign({}, base); delete old.shoeStyle;
    const zero = Object.assign({}, base, { shoeStyle: 0 });
    const count = cfg => { const g = window.__houseDbg.buildChar(cfg); let n = 0;
      g.traverse(() => n++); return n; };
    return count(old) === count(zero);
  });
  expect(same, 'เด็กที่ไม่มีคีย์ shoeStyle ต้องได้รองเท้าทรงเดิม').toBe(true);
  expect(errs).toEqual([]);
});

test('เฟส 8C: ปุ่มเลือกในหน้าแต่งตัวเป็นรูป ไม่ใช่ตัวเลข (เด็กอ่านเลขไม่ออกว่าเป็นของอะไร)', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.__houseDbg.openCreator && window.__houseDbg.openCreator());
  await expect(page.locator('#house-creator-rows .house-chip').first()).toBeVisible({ timeout: 10000 });
  const r = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#house-creator-rows > div'));
    const out = { withIcon: 0, numeric: [], noneBtns: 0 };
    rows.forEach(rw => {
      Array.from(rw.querySelectorAll('.house-chip')).forEach(b => {
        if (b.classList.contains('house-chip-color')) return;
        if (b.classList.contains('house-chip-none')) { out.noneBtns++; return; }
        if (b.querySelector('svg')) out.withIcon++;
        else if (/^\d+$/.test((b.textContent || '').trim())) out.numeric.push((b.getAttribute('aria-label') || '') + '=' + b.textContent.trim());
      });
    });
    return out;
  });
  console.log('ชิปที่เป็นรูป: ' + r.withIcon + ' · ยังเป็นตัวเลข: ' + r.numeric.length + ' · ปุ่มไม่ใส่: ' + r.noneBtns);
  expect(r.withIcon, 'ต้องมีชิปที่เป็นรูปจำนวนมาก').toBeGreaterThan(40);
  expect(r.numeric, 'ห้ามเหลือปุ่มตัวเลขในแถวแบบอีก').toEqual([]);
  /* ปุ่ม "ไม่ใส่" ยังต้องเป็น ✖ เหมือนเดิม (ผู้ใช้ล็อกไว้) */
  expect(r.noneBtns).toBeGreaterThan(0);
  expect(errs).toEqual([]);
});
