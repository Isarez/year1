/* ============================================================
   📔 เฟส 16 — สมุดสะสม (Collection Book) · ข้อ 57.1 ของ QUEST-DESIGN.md

   กติกาที่ชุดนี้คุมไว้ (ผู้ใช้ล็อกไว้ตอนอนุมัติแผน 2026-08-17 · ห้ามย้อน):
     - ช่องที่ยังไม่ได้ต้องโชว์เป็น **เงา ไม่ใช่ซ่อน**
     - **ห้ามมีรางวัลที่ต้องเก็บครบถึงจะได้** — โบนัสระหว่างทางเท่านั้น
     - **ข้อมูลเก่าต้องอ่านได้ทันที** (ตกปลามาแล้วต้องเห็นปลาในสมุดเลย ไม่ใช่เริ่มนับใหม่)
     - **ท่าที่สอนน้องต้องไม่หายเมื่อเปลี่ยนน้อง** (กติกาเหล็กข้อ 3)
     - สมุดสะสม **ไม่จ่ายเหรียญ** (กันเงินเฟ้อ — ของสะสมทั้งเกมไม่จ่ายเงินเลย)
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p16', name: 'นักสะสม', emoji: '📔', birthDate: '2018-06-01', grade: 'p3' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };

async function houseSeed(page, seed) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(([c, hkey, s, ch]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(Object.assign({ v: 1, mapV: 4, char: ch }, s || {})));
  }, [CHILD, HKEY, seed || {}, CHAR]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseBook && !!window.HousePlay, null, { timeout: 30000 });
  return errs;
}
const openBook = page => page.evaluate(() => window.HouseBook.open());

/* ---------------------------------------------------------------- */

test('16A: เปิดสมุดจากแผงกิจกรรม 🎈 ได้ · มีครบ 5 แท็บ', async ({ page }) => {
  const errs = await houseSeed(page);
  await page.evaluate(() => window.HousePlay.open());
  await expect(page.locator('#hpl-book')).toBeVisible();
  await page.locator('#hpl-book').click();
  await expect(page.locator('#house-book')).toBeVisible();
  const tabs = await page.evaluate(() => Array.from(document.querySelectorAll('#hbk-tabs .hqb-chip'))
    .map(b => b.id.replace('hbk-tab-', '')));
  expect(tabs).toEqual(['fish', 'crop', 'critter', 'trick', 'photo']);
  expect(errs, 'ห้ามมี error').toEqual([]);
});

test('16B: ช่องที่ยังไม่เจอต้องเป็น "เงา" ไม่ใช่ถูกซ่อน', async ({ page }) => {
  await houseSeed(page, { play: { v: 1, day: '', fish: { book: ['nil'], bag: {}, today: 0 } } });
  await openBook(page);
  const r = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('#hbk-body .hbk-cell'));
    const miss = cells.filter(c => !c.classList.contains('has'));
    const cs = miss.length ? getComputedStyle(miss[0].querySelector('.hbk-e')) : null;
    return {
      total: cells.length,
      hidden: miss.filter(c => c.offsetParent === null || getComputedStyle(c).display === 'none').length,
      filter: cs ? cs.filter : '',
      fishTotal: window.HousePlay.FISH.length,
    };
  });
  expect(r.total, 'ต้องกางทุกช่องของคลังปลา').toBe(r.fishTotal);
  expect(r.hidden, 'ช่องที่ยังไม่เจอห้ามถูกซ่อน').toBe(0);
  expect(r.filter, 'ช่องที่ยังไม่เจอต้องถูกทำเป็นเงา (filter brightness)').toContain('brightness(0)');
});

test('16C: ปลาที่เคยตกได้ก่อนมีสมุด ต้องโผล่ในสมุดทันที (ห้ามเริ่มนับใหม่)', async ({ page }) => {
  await houseSeed(page, { play: { v: 1, day: '', fish: { book: ['nil', 'koi', 'crab'], bag: {}, today: 0 } } });
  await openBook(page);
  const r = await page.evaluate(() => {
    const c = window.HouseBook.counts();
    const has = Array.from(document.querySelectorAll('#hbk-body .hbk-cell.has')).map(x => x.getAttribute('data-id'));
    return { got: c.fish.got, has };
  });
  expect(r.got).toBe(3);
  expect(r.has.sort()).toEqual(['crab', 'koi', 'nil']);
});

test('16D: จดของใหม่แล้วต้องบันทึกลง save จริง และไม่จดซ้ำ', async ({ page }) => {
  await houseSeed(page);
  const r = await page.evaluate(hkey => {
    const first = window.HouseBook.mark('critter', 'rabbit');
    const again = window.HouseBook.mark('critter', 'rabbit');
    const crop = window.HouseBook.mark('crop', 'carrot');
    const saved = JSON.parse(localStorage.getItem(hkey) || '{}').book || {};
    return { first, again, crop, saved, counts: window.HouseBook.counts() };
  }, HKEY);
  expect(r.first).toBe(true);
  expect(r.again, 'จดซ้ำต้องคืน false').toBe(false);
  expect(r.crop).toBe(true);
  expect(r.saved.critter).toEqual(['rabbit']);
  expect(r.saved.crop).toEqual(['carrot']);
  expect(r.counts.critter.got).toBe(1);
});

test('16E: แตะสัตว์ป่าในเมือง = จดลงสมุด · สัตว์ในคอกฟาร์มติด tag ครบ 4 ชนิด (ห้ามรวมสัตว์ร้าน)', async ({ page }) => {
  await houseSeed(page);
  /* รอให้สัตว์ป่าเดินเข้าฉากอย่างน้อย 1 ตัว (spawn เองตามเวลา) */
  await page.waitForFunction(() => (window.__houseDbg.critters() || []).length > 0, null, { timeout: 30000 });
  const r = await page.evaluate(() => {
    const kinds = window.__houseDbg.critters();
    window.__houseDbg.startleAt(0);
    const farm = Array.from(new Set(window.__houseDbg.farmTagged())).sort();
    return { type: kinds[0], got: window.HouseBook.got('critter'), farm };
  });
  expect(r.got, 'แตะสัตว์ป่าแล้วต้องถูกจด').toContain(r.type);
  expect(r.farm, 'สัตว์ฟาร์ม 4 ชนิดเท่านั้นที่จดได้ (สัตว์ในคอกร้านสัตว์เลี้ยงต้องไม่ติด tag)')
    .toEqual(['chick', 'cow', 'pig', 'sheep']);
});

test('16F: รางวัลเป็นโบนัสระหว่างทาง — ห้ามมีอันไหนต้องเก็บครบ · ถึงเกณฑ์แล้วปลดของฟรีจริง', async ({ page }) => {
  await houseSeed(page);
  const r = await page.evaluate(() => {
    const B = window.HouseBook;
    const total = B.counts().total.total;
    const maxAt = Math.max.apply(null, B.PRIZES.map(p => p.at));
    /* จดสัตว์ + พืช + ท่า ให้ครบทุกชนิดเพื่อดันตัวนับข้ามเกณฑ์แรก */
    B.CRITTERS.forEach(c => B.mark('critter', c.id));
    (window.HousePlay.SEEDS || []).forEach(s => B.mark('crop', s.id));
    const got = B.counts().total.got;
    const unlocked = (window.HouseShop.state ? window.HouseShop.state() : null);
    return { total, maxAt, got, first: B.PRIZES[0],
             owns: window.HouseShop.ownsFurn ? window.HouseShop.ownsFurn(B.PRIZES[0].id) : null,
             prizes: B.state().prizes };
  });
  expect(r.maxAt, 'รางวัลสุดท้ายต้องไม่ใช่ "เก็บครบทุกช่อง"').toBeLessThan(r.total);
  expect(r.got, 'จดครบสัตว์+พืชแล้วต้องเกินเกณฑ์แรก').toBeGreaterThanOrEqual(r.first.at);
  expect(r.prizes, 'รางวัลแรกต้องถูกปลดแล้ว').toContain(r.first.id);
});

test('16G: สมุดสะสมห้ามจ่ายเหรียญ (กันเงินเฟ้อ)', async ({ page }) => {
  await houseSeed(page);
  const r = await page.evaluate(() => {
    const before = window.OwlCoins.get();
    const B = window.HouseBook;
    B.CRITTERS.forEach(c => B.mark('critter', c.id));
    (window.HousePlay.SEEDS || []).forEach(s => B.mark('crop', s.id));
    return { before, after: window.OwlCoins.get() };
  });
  expect(r.after, 'จดของใหม่ต้องไม่ได้เหรียญ').toBe(r.before);
});

test('16H: ท่าที่สอนน้องสำเร็จต้องอยู่ในสมุดตลอดไป แม้ตอนนี้ไม่มีสัตว์เลี้ยงแล้ว', async ({ page }) => {
  await houseSeed(page, { book: { v: 1, critter: [], crop: [], trick: ['sit', 'spin'], prizes: [] } });
  await openBook(page);
  const r = await page.evaluate(() => {
    window.HouseBook.open('trick');
    const has = Array.from(document.querySelectorAll('#hbk-body .hbk-cell.has')).map(x => x.getAttribute('data-id'));
    return { has: has.sort(), pet: (window.HousePetCare.learnedTricks() || []).length,
             got: window.HouseBook.counts().trick.got };
  });
  expect(r.pet, 'เทสนี้ต้องไม่มีสัตว์เลี้ยง (learnedTricks ว่าง)').toBe(0);
  expect(r.has).toEqual(['sit', 'spin']);
  expect(r.got).toBe(2);
});

test('16I: แท็บรูปถ่ายเปิดอัลบั้มเดิมได้ (ไม่ทำอัลบั้มซ้ำใบใหม่)', async ({ page }) => {
  await houseSeed(page);
  await page.evaluate(() => window.HouseBook.open('photo'));
  await expect(page.locator('#hbk-album')).toBeVisible();
  await page.locator('#hbk-album').click();
  await expect(page.locator('#house-album')).toBeVisible();
  await expect(page.locator('#house-book')).toBeHidden();
});

test('16J: แตะพื้นที่นอกกล่อง = ปิดสมุด (เหมือนกล่องอื่นในโหมดบ้าน)', async ({ page }) => {
  await houseSeed(page);
  await openBook(page);
  await expect(page.locator('#house-book')).toBeVisible();
  const box = await page.locator('#house-canvas').boundingBox();
  await page.mouse.click(box.x + 12, box.y + box.height - 12);
  await expect(page.locator('#house-book')).toBeHidden();
});

test('16K: ปลาที่ตกได้ก็ต้องนับเข้าโบนัสระหว่างทาง (ปลาไม่ผ่าน mark)', async ({ page }) => {
  /* เด็กที่ตกปลามาแล้ว 13 ชนิดตั้งแต่ก่อนมีสมุด ⇒ เปิดสมุดครั้งแรกต้องได้รางวัลแรกทันที */
  await houseSeed(page, { play: { v: 1, day: '', fish: { bag: {}, today: 0,
    book: ['nil','carp','catfish','guppy','sew','climb','sway','tadpole','snail','snake','shrimp','crab','feather'] } } });
  const r = await page.evaluate(() => {
    window.HouseBook.open();
    const B = window.HouseBook;
    return { got: B.counts().total.got, prizes: B.state().prizes, first: B.PRIZES[0].id,
             owns: window.HouseShop.ownsFurn(B.PRIZES[0].id) };
  });
  expect(r.got).toBeGreaterThanOrEqual(13);
  expect(r.prizes, 'เปิดสมุดแล้วต้องได้รางวัลที่ถึงเกณฑ์ไปแล้ว').toContain(r.first);
  expect(r.owns, 'ของรางวัลต้องถูกปลดให้จริง').toBe(true);
});

/* 🐞 16L — บั๊กจริงที่ผู้ใช้เจอ 2026-08-19: "แท็บปลาไม่แสดง"
   ไอคอนปลาตัวหนึ่งวาดไม่ได้ ⇒ TypeError กลางลูปวาดกริด ⇒ **ทั้งแท็บว่างเปล่า**
   ⇒ ต้องเช็คว่าทุกแท็บวาดครบทุกช่อง ไม่ใช่แค่ "เปิดกล่องขึ้น" */
test('16L: ทุกแท็บวาดครบทุกช่องจริง (ช่องหายแม้ช่องเดียว = ไอคอนพัง)', async ({ page }) => {
  const errs = await houseSeed(page);
  await openBook(page);
  const r = await page.evaluate(() => {
    const out = [];
    ['fish', 'crop', 'critter', 'trick'].forEach(t => {
      const b = document.getElementById('hbk-tab-' + t);
      b.click();
      const cells = document.querySelectorAll('#hbk-body .hbk-cell').length;
      const want = window.HouseBook.all(t).length;
      const svg = document.querySelectorAll('#hbk-body .hbk-cell .hbk-e svg').length;
      out.push({ t, cells, want, svg });
    });
    return out;
  });
  r.forEach(x => {
    expect(x.cells, 'แท็บ ' + x.t + ' วาดช่องไม่ครบ').toBe(x.want);
    expect(x.svg, 'แท็บ ' + x.t + ' มีช่องที่ไอคอนวาดไม่ออก').toBe(x.want);
  });
  expect(errs, 'ห้ามมี error').toEqual([]);
});

/* 🔒 16M — ผู้ใช้สั่ง 2026-08-19: **แท็บทั้ง 5 ต้องอยู่แถวเดียวกันเสมอ**
   เดิมชื่อกับตัวเลขต่อกันเป็นบรรทัดเดียว ⇒ ชิปรวมกันกว้างเกินการ์ด แท็บ 📷 ตกไปแถวสอง
   ⚠ วัดจากพิกัดจริง (y ต้องเท่ากันทุกชิป) และชิปต้องไม่ล้นออกนอกแถบ */
test('16M: แท็บทั้ง 5 อยู่แถวเดียวกัน ไม่ตกบรรทัด และไม่ล้นออกนอกแถบ', async ({ page }) => {
  const errs = await houseSeed(page);
  await openBook(page);
  const r = await page.evaluate(() => {
    const wrap = document.getElementById('hbk-tabs');
    const w = wrap.getBoundingClientRect();
    const tabs = [...wrap.children].map(b => { const q = b.getBoundingClientRect();
      return { y: Math.round(q.y), left: Math.round(q.left), right: Math.round(q.right) }; });
    return { tabs, left: Math.round(w.left), right: Math.round(w.right), n: tabs.length };
  });
  expect(r.n).toBe(5);
  const ys = [...new Set(r.tabs.map(t => t.y))];
  expect(ys.length, 'แท็บตกไปมากกว่า 1 แถว').toBe(1);
  r.tabs.forEach(t => {
    expect(t.left).toBeGreaterThanOrEqual(r.left - 1);
    expect(t.right).toBeLessThanOrEqual(r.right + 1);
  });
  expect(errs, 'ห้ามมี error').toEqual([]);
});
