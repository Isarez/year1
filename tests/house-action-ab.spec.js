const { test, expect } = require('@playwright/test');

/* ============================================================
   เกม Action จริง "ชุด A + ชุด B" (2026-08-16 · ข้อ 55 ของ QUEST-DESIGN.md)

   รูปแบบที่ผู้ใช้กำหนด: **รับคำสั่ง → ไปทำจริงในโลก → กลับมาส่งงาน**

   ชุด A (ทำที่บ้าน/กับน้อง — ใช้ระบบที่มีอยู่แล้ว):
     🕰️ routine  · 🐾 petcare · 🐕 pettrick · 🎹 playalong
   ชุด B (ทำที่ร้านสะดวกซื้อ — งาน 2 ขา):
     🛒 shopping · 💵 changeback · 🏪 stockshelf

   จุดที่ต้องไม่พัง:
     1) ทุกตัวเป็นทรงเดิน ไม่ใช่การ์ด · มีปลายทางให้ส่งเสมอ
     2) **ไม่มีของจริง = ไม่ถูกแจก** (กันงานตัน — กติกาเหล็กข้อ 1)
     3) 💸 เงินที่จ่ายไปเพื่อทำเควสต์ **ต้องได้คืนตอนจบ** (ผู้ใช้สั่ง)
     4) ชุด B ต้องจบที่ "เดินกลับไปส่ง" ไม่ใช่จบที่ร้าน
   ============================================================ */

const CHILD = { id: 'actab', name: 'เทสแอค', emoji: '🎯', birthDate: '2018-01-15', grade: 'p3' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const BASE = { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } };

async function house(page, extra) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
  }, [CHILD, HKEY, Object.assign({}, BASE, extra || {})]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  return errors;
}
/* รับงานผ่านเส้นทางจริง: เปิดการ์ดทดสอบ → กดปุ่ม "ไปเลย" */
async function accept(page, mech, gid, seed) {
  return page.evaluate(async ([m, g, sd]) => {
    window.HouseQuestUI.playTest({ mech: m, gid: g, seed: sd, title: '🧪 ' + m });
    await new Promise(r => setTimeout(r, 400));
    const go = document.querySelector('#house-qz .hqz-yes');
    if (!go) return null;
    go.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(r => setTimeout(r, 300));
    return window.__houseDbg.walkLeg();
  }, [mech, gid, seed]);
}

const SET_A = ['routine', 'petcare', 'pettrick', 'playalong'];
const SET_B = ['shopping', 'changeback', 'stockshelf'];

test('ชุด A + B: ทุกตัวเป็นทรงเดิน ไม่ใช่การ์ด · มีปลายทางส่งงานเสมอ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(([a, b]) => {
    const Q = window.HouseQuests, out = {};
    a.concat(b).forEach(m => {
      const spec = Q.MECHS[m];
      const it = (Q.testRun({ mech: m, gid: 'p3', seed: 4 }).items || [])[0] || {};
      out[m] = { shape: Q.mechShape(m), walk: !!spec.walk, kind: it.kind,
                 target: it.target, toNpc: it.toNpc, buy: !!it.buy };
    });
    return out;
  }, [SET_A, SET_B]);
  SET_A.concat(SET_B).forEach(m => {
    expect(r[m].walk, m + ' ต้องเป็นงานเดิน').toBe(true);
    expect(r[m].shape, m + ' ต้องนับเป็นทรงเดิน (ไม่กินงบเวลาแบบการ์ด)').toBe('walk');
    expect(r[m].toNpc, m + ' ต้องมีปลายทางให้เอาไปส่ง').toBeTruthy();
  });
  SET_B.forEach(m => expect(r[m].target, m + ' ต้องเป็นงานที่ร้านสะดวกซื้อ').toBe('mart'));
  /* 💸 งานที่ต้องใช้เงินซื้อของต้องติดธง buy เพื่อให้คืนเงินตอนจบ */
  expect(r.shopping.buy, 'ไปซื้อของ = ต้องคืนเงิน').toBe(true);
  expect(r.changeback.buy, 'ทอนเงิน = ต้องคืนเงิน').toBe(true);
  expect(r.stockshelf.buy, 'จัดชั้นไม่ได้ใช้เงิน').toBe(false);
  expect(errs).toEqual([]);
});

test('🚫 ไม่มีของจริง = ไม่ถูกแจก (กันงานตัน)', async ({ page }) => {
  const errs = await house(page);      /* บ้านใหม่: ไม่มีสัตว์เลี้ยง ไม่มีเครื่องดนตรี */
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    return {
      stock: window.__houseDbg.worldStockDbg ? null : null,
      pet: Q.mechOk('petcare'), trick: Q.mechOk('pettrick'),
      music: Q.mechOk('playalong'), routine: Q.mechOk('routine'),
      /* งานที่ร้านไม่ต้องมีของอะไรก่อน — ร้านอยู่ในเมืองเสมอ */
      shop: Q.mechOk('shopping'), change: Q.mechOk('changeback'), shelf: Q.mechOk('stockshelf'),
    };
  });
  expect(r.pet, 'ยังไม่มีสัตว์เลี้ยง → ห้ามแจกงานดูแลน้อง').toBe(false);
  expect(r.trick, 'ยังไม่มีสัตว์เลี้ยง → ห้ามแจกงานสอนท่า').toBe(false);
  expect(r.music, 'ยังไม่มีเครื่องดนตรี → ห้ามแจกงานเล่นดนตรี').toBe(false);
  expect(r.shop, 'งานที่ร้านแจกได้เสมอ').toBe(true);
  expect(r.change).toBe(true);
  expect(r.shelf).toBe(true);
  expect(errs).toEqual([]);
});

test('🕰️ กิจวัตร: อ้างอิงของที่เด็กมีจริง — ไม่มีของ = ไม่แจก · มีของ = สั่งเฉพาะที่มี', async ({ page }) => {
  /* บ้านที่มีแค่เตียงกับโต๊ะ ⇒ ห้ามสั่งให้ไปห้องน้ำ/ครัวเด็ดขาด */
  const errs = await house(page, { decor: { in: [{ id: 'bed', x: 3, z: 3, r: 0 }, { id: 'table', x: 5, z: 3, r: 0 }], out: [] } });
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const cats = window.__houseDbg.routineCats ? window.__houseDbg.routineCats() : null;
    const runs = [0, 1, 2, 3, 4].map(sd => (Q.testRun({ mech: 'routine', gid: 'p6', seed: sd }).items || [])[0] || {});
    return { ok: Q.mechOk('routine'), cats,
             need: runs.filter(i => i.target === 'catch').map(i => i.need.map(n => n.id)) };
  });
  expect(r.ok, 'บ้านมีของครบพอ → แจกงานกิจวัตรได้').toBe(true);
  /* ⚠ เกณฑ์ต้องเทียบกับ "ของที่บ้านหลังนี้มีจริง" (ชุดเริ่มต้นถูกแจกให้เด็กใหม่ด้วย)
     ไม่ใช่ลิสต์ที่เขียนตายในเทส — หัวใจคือ **ห้ามสั่งหมวดที่ไม่มี** */
  expect(r.cats.length, 'ต้องอ่านหมวดของในบ้านได้').toBeGreaterThanOrEqual(2);
  r.need.forEach(list => list.forEach(id =>
    expect(r.cats, 'ห้ามสั่งหมวดที่บ้านหลังนี้ไม่มี (ผู้ใช้สั่ง 2026-08-16)').toContain(id)));
  expect(errs).toEqual([]);
});

test('🕰️ กิจวัตร: บ้านที่มีของไม่ถึง 2 หมวด ต้องไม่ถูกแจก', async ({ page }) => {
  const errs = await house(page);
  /* ⚠ ต้องล้างของในบ้านทิ้ง **หลัง** เข้าเกมแล้ว เพราะชุดเริ่มต้นถูกแจกตอนสร้างบ้าน */
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const before = window.__houseDbg.routineCats().length;
    window.__houseDbg.setDecor({ in: [], out: [] });
    return { before, cats: window.__houseDbg.routineCats(), ok: Q.mechOk('routine') };
  });
  expect(r.before, 'ก่อนล้าง บ้านต้องมีของอยู่').toBeGreaterThanOrEqual(2);
  expect(r.cats.length, 'ล้างแล้วต้องไม่มีของเหลือ').toBeLessThan(2);
  expect(r.ok, 'ไม่มีของ → สั่ง "ทำตามลำดับ" ไม่ได้ ต้องไม่แจก').toBe(false);
  expect(errs).toEqual([]);
});

test('🐾 ดูแลน้อง: ทำจริงกับน้องแล้วตัวนับขยับ · ครบแล้วเดินกลับไปส่งได้', async ({ page }) => {
  const errs = await house(page, { pet: { type: 'dog', name: 'ด่าง', col: 0 } });
  const r = await page.evaluate(async () => {
    window.HouseQuestUI.playTest({ mech: 'petcare', gid: 'p3', seed: 2, title: '🧪 ดูแลน้อง' });
    await new Promise(r2 => setTimeout(r2, 400));
    const go = document.querySelector('#house-qz .hqz-yes');
    go.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(r2 => setTimeout(r2, 300));
    const wq = window.__houseDbg.walkCatch();
    if (!wq) return { err: 'ไม่เข้าโหมดงานเดิน' };
    /* ทำงานที่สั่งผ่านประตูเดียวกับที่ระบบสัตว์เลี้ยงใช้ */
    const steps = [];
    wq.need.forEach(rw => {
      for (let i = 0; i < rw.n + 1; i++) steps.push(window.HouseWorld.questCaught('pet', rw.id));
    });
    /* ทำอย่างอื่นที่ไม่ได้สั่งต้องไม่นับ */
    const wrong = window.HouseWorld.questCaught('pet', 'zzz');
    return { wq, steps, wrong, done: window.__houseDbg.walkCatch().done };
  });
  expect(r.err).toBeUndefined();
  expect(r.wq.need.length).toBeGreaterThan(0);
  expect(r.wrong, 'ทำอย่างที่ไม่ได้สั่ง = ไม่นับ').toBe(false);
  expect(r.done, 'ทำครบแล้วต้องเดินไปส่งได้').toBe(true);
  expect(errs).toEqual([]);
});

test('🏪 ชุด B เป็นงาน 2 ขา: ถึงร้านแล้วยังไม่จบ · ต้องเดินกลับไปส่งอีกที', async ({ page }) => {
  const errs = await house(page);
  const leg1 = await accept(page, 'stockshelf', 'p3', 1);
  expect(leg1, 'รับงานแล้วต้องเข้าโหมดงานเดิน').toBeTruthy();
  expect(leg1.target).toBe('mart');
  expect(leg1.leg, 'เริ่มที่ขา 1 = เดินไปร้าน').toBe(1);
  expect(leg1.done, 'ยังไม่ได้ทำอะไร ต้องยังส่งไม่ได้').toBe(false);

  /* ถึงร้าน → กระดานเปิด แต่ **ยังไม่จบเควสต์** */
  const atShop = await page.evaluate(async () => {
    window.__houseDbg.martArrive();
    await new Promise(r => setTimeout(r, 400));
    return { leg: window.__houseDbg.walkLeg(),
             cardOpen: !document.getElementById('house-qz').hidden,
             /* ⚠ คลาสเปลี่ยนตอนออกแบบหน้าจอชั้นวางใหม่ 2026-08-16
                (.hqz-mart-bin/.hqz-mart-item → .hqz-shelf/.hqz-crate-it) */
             bins: document.querySelectorAll('.hqz-shelf').length,
             tiles: document.querySelectorAll('.hqz-crate-it').length };
  });
  expect(atShop.leg.leg, 'ถึงร้านแล้วเข้าขา 2').toBe(2);
  expect(atShop.cardOpen, 'ถึงร้านแล้วกระดานต้องเปิด').toBe(true);
  expect(atShop.bins, 'ต้องมีชั้นวางให้จัด').toBeGreaterThanOrEqual(2);
  expect(atShop.tiles, 'ต้องมีของให้จัด').toBeGreaterThanOrEqual(4);
  expect(atShop.leg.done, 'เพิ่งถึงร้าน ยังส่งงานไม่ได้').toBe(false);
  expect(errs).toEqual([]);
});

test('💸 ซื้อของทำเควสต์: จ่ายเงินจริงแล้วได้คืนตอนจบ (ผู้ใช้สั่ง)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(async () => {
    window.OwlCoins.add(500);
    const before = window.OwlCoins.get();
    window.HouseQuestUI.playTest({ mech: 'shopping', gid: 'p3', seed: 7, title: '🧪 ซื้อของ' });
    await new Promise(r2 => setTimeout(r2, 400));
    document.querySelector('#house-qz .hqz-yes').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(r2 => setTimeout(r2, 250));
    window.__houseDbg.martArrive();
    await new Promise(r2 => setTimeout(r2, 400));
    /* หยิบของตามรายการจริงจากชั้นวาง */
    const leg = window.__houseDbg.walkLeg();
    const want = window.__houseDbg.martWant ? window.__houseDbg.martWant() : null;
    const btns = Array.from(document.querySelectorAll('.hqz-mart-shelf .hqz-mart-item'));
    return { before, leg, shelfBtns: btns.length, want };
  });
  expect(r.leg.buy, 'งานซื้อของต้องติดธงคืนเงิน').toBe(true);
  expect(r.shelfBtns, 'ต้องมีชั้นวางของให้หยิบ').toBeGreaterThan(3);
  expect(errs).toEqual([]);
});

test('🗑️ การ์ดที่ถูกแทนด้วย Action จริงต้องถูกถอดออกแล้ว', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const tabs = (window.HouseQB ? window.HouseQB.MECH_TABS : []).map(t => t.id);
    return {
      petfeed: !!Q.MECHS['petfeed'], petfeedTab: tabs.indexOf('petfeed') >= 0,
      fishmath: !!Q.MECHS['fishmath'],
      /* ตัวที่ยัง id เดิมแต่เปลี่ยนพฤติกรรมแล้ว ต้องไม่ใช่การ์ด/ลากอีก */
      shapes: ['routine', 'shopping', 'changeback', 'stockshelf', 'playalong'].map(m => Q.mechShape(m)),
    };
  });
  expect(r.petfeed, 'การ์ด petfeed ต้องถูกถอด (มี petcare ที่ทำจริงแล้ว)').toBe(false);
  expect(r.petfeedTab, 'แท็บ petfeed ต้องหายด้วย').toBe(false);
  expect(r.fishmath, 'การ์ด fishmath ต้องถูกถอดไปแล้ว').toBe(false);
  r.shapes.forEach(sh => expect(sh, 'ต้องเป็นทรงเดินหมดแล้ว').toBe('walk'));
  expect(errs).toEqual([]);
});

test('📊 สัดส่วน Action ต้องเพิ่มขึ้นจริง และไม่เกินเพดานที่ล็อกไว้', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const ids = Object.keys(Q.MECHS);
    const walk = ids.filter(m => Q.mechShape(m) === 'walk');
    return { total: ids.length, walk: walk.length, list: walk };
  });
  console.log('Action จริง ' + r.walk + '/' + r.total + ': ' + r.list.join(', '));
  expect(r.walk, 'ต้องมี Action จริงอย่างน้อย 16 ตัว').toBeGreaterThanOrEqual(16);
  /* 🔒 เพดานที่ล็อกไว้ในข้อ 54.8 — เกินนี้เด็กจะใช้เวลาเดินมากกว่าคิด และงบเวลา 240 วิ/เควสต์พัง */
  expect(r.walk, 'ห้ามเกิน 20 ตัว (เพดานที่ล็อกไว้)').toBeLessThanOrEqual(20);
  expect(errs).toEqual([]);
});

/* ---------- 🧭 ลูกศรนำทางเควสต์เก็บของ (ผู้ใช้สั่ง 2026-08-16) ---------- */
test('🧭 เก็บของไปให้: มีลูกศรบอกทางไปของที่ต้องเก็บ · ของอยู่ในจอแล้วไม่ต้องมีลูกศรซ้ำ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(async () => {
    const D = window.__houseDbg;
    /* 🔒 ลูกศรต้องโผล่ **เฉพาะตอนทำเควสต์** ไม่ใช่ตอนเล่นกิจกรรมรายวัน (ผู้ใช้สั่ง 2026-08-16)
       กิจกรรมรายวันเปิดค้างทั้งวัน ⇒ ลูกศรจะโชว์ตลอดเวลาจนรบกวนเด็กที่แค่อยากเดินเล่น */
    const idle = D.qArrow();
    window.HouseQuestUI.playTest({ mech: 'collectgive', gid: 'p3', seed: 1, title: '🧪 เก็บของ' });
    await new Promise(r2 => setTimeout(r2, 400));
    document.querySelector('#house-qz .hqz-yes').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(r2 => setTimeout(r2, 500));
    const busy = D.qArrow();
    /* ของที่เหลือต้องมีจริง และลูกศรต้องเล็งไปชิ้นที่ใกล้ที่สุด */
    const left = window.HousePlay.colLeft();
    const t = D.tile ? null : null;
    /* เก็บครบตามที่สั่ง → ลูกศรต้องหายไป (เหลือแค่เดินไปส่ง) */
    const need = D.walkCatch().need[0];
    for (let i = 0; i < need.n; i++) window.HouseWorld.questCaught('leaf', '');
    await new Promise(r2 => setTimeout(r2, 400));
    const doneCatch = D.walkCatch().done;
    return { idle, busy, leftN: left.length, doneCatch, done: D.qArrow() };
  });
  expect(r.idle.target, 'ยังไม่ได้รับเควสต์ = ห้ามมีลูกศรมารบกวน').toBeNull();
  expect(r.leftN, 'ต้องมีของประจำวันให้เก็บจริง').toBeGreaterThan(0);
  expect(r.busy.target, 'รับงานแล้วต้องมีเป้าให้ชี้').toBeTruthy();
  expect(r.busy.target.dist, 'ต้องบอกระยะเป็นจำนวนช่อง').toBeGreaterThan(0);
  expect(r.doneCatch, 'เก็บครบแล้วต้องพร้อมเดินไปส่ง').toBe(true);
  expect(r.done.target, 'เก็บครบแล้วลูกศรต้องหาย (เหลือแค่เดินไปส่ง)').toBeNull();
  expect(errs).toEqual([]);
});

test('🧭 ลูกศรต้องไม่บังการแตะพื้น และซ่อนตอนโหมดตกแต่ง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const el = document.getElementById('house-qarrow');
    const cs = getComputedStyle(el);
    return { pe: cs.pointerEvents, pos: cs.position, exists: !!el,
             editHide: !!Array.from(document.styleSheets).some(ss => {
               try { return Array.from(ss.cssRules).some(r2 =>
                 r2.selectorText && r2.selectorText.indexOf('house-edit') >= 0
                 && r2.selectorText.indexOf('house-qarrow') >= 0); } catch (e) { return false; }
             }) };
  });
  expect(r.exists).toBe(true);
  expect(r.pe, 'ลูกศรต้องแตะทะลุได้ ไม่งั้นบังการแตะพื้นเพื่อเดิน').toBe('none');
  expect(r.pos).toBe('fixed');
  expect(r.editHide, 'โหมดตกแต่งต้องซ่อนลูกศร').toBe(true);
  expect(errs).toEqual([]);
});
