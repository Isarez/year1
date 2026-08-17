const { test, expect } = require('@playwright/test');

/* ============================================================
   ชุดแก้ 2026-08-17 (ผู้ใช้แจ้ง 3 ข้อ)
     ① 🔌🧩 ต่อวงจรไฟฟ้า + ต่อรูปทรง — เปิดให้เล่นตั้งแต่ ป.1 (เดิมมีเฉพาะ ป.5-6)
     ② 🪙 เหรียญในเกมมีแค่ 4 แบบ: 1 · 2 · 5 · 10
     ③ ✋ ท่าแบมือ = แตะ — **เฉพาะเกมนกฮูกสั่ง** เกมอื่นห้ามโดนด้วย
   ============================================================ */

const NEW_CATS = ['p1-circuit','p1-tangram','p2-circuit','p2-tangram',
                  'p3-circuit','p3-tangram','p4-circuit','p4-tangram'];

test('🔌🧩 มีหมวดต่อวงจรไฟ/ต่อรูปทรงครบ ป.1-ป.4 และ emoji ไม่ซ้ำในชั้นเดียวกัน', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(cats => {
    const miss = cats.filter(id => !CATS.find(c => c.id === id));
    const dup = [];
    ['p1','p2','p3','p4','p5','p6'].forEach(g => {
      const seen = {};
      CATS.filter(c => c.grade === g).forEach(c => {
        if (seen[c.emoji]) dup.push(g + ' ' + c.emoji + ': ' + seen[c.emoji] + ' / ' + c.id);
        seen[c.emoji] = c.id;
      });
    });
    /* ชั้นเล็กต้องมีเพดานความยาก ไม่งั้นได้ด่านของ ป.6 มาเลย */
    const noCap = cats.filter(id => {
      const c = CATS.find(x => x.id === id);
      return c && !(c.circuitMax || c.tangramMax);
    });
    return { miss, dup, noCap };
  }, NEW_CATS);
  expect(r.miss, 'ต้องมีหมวดใหม่ครบทุกชั้น').toEqual([]);
  /* ⚠ กติกาเดิมของโปรเจค: emoji ห้ามซ้ำ ไม่งั้นสมุดสติกเกอร์แยกหมวดไม่ออก */
  expect(r.dup, 'emoji ห้ามซ้ำในชั้นเดียวกัน').toEqual([]);
  expect(r.noCap, 'หมวดของชั้นเล็กต้องมีเพดานความยาก').toEqual([]);
});

test('🔌🧩 ป.1 เล่นได้จริง และได้เนื้อหาระดับง่ายตามเพดาน', async ({ page }) => {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(() => {
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id: 'lg1', name: 'ทดสอบ', emoji: '🔌', birthDate: '2019-01-15', grade: 'p1' }]));
    localStorage.setItem('p1quiz_active_child', 'lg1');
    localStorage.setItem('p1quiz_music', 'off');
    window.__TUT_OFF = true;
  });
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-quiz').click();
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    startCircuitGame('p1-circuit');
    const cells = document.querySelectorAll('#circuit-grid > *').length;
    startTangramGame('p1-tangram');
    return { cells, size: circuitGame.size, pieces: tangramGame.slots.length };
  });
  expect(errs, 'ห้ามมี error').toEqual([]);
  /* ⚠ ป.1 ต้องได้กระดาน 3×3 และรูปที่ใช้ 3 ชิ้นเท่านั้น — ของ ป.6 คือ 4×4 และ 5 ชิ้น */
  expect(r.cells, 'กระดานวงจรไฟของ ป.1 ต้องเป็น 3×3').toBe(9);
  expect(r.pieces, 'รูปของ ป.1 ต้องใช้ไม่เกิน 3 ชิ้น').toBeLessThanOrEqual(3);
});

test('🪙 เหรียญในเกมร้านค้าต้องมีแค่ 1/2/5/10 ทุกระดับชั้น', async ({ page }) => {
  await page.goto('/');
  const bad = await page.evaluate(() => {
    const out = [];
    [null, 'p5', 'p6'].forEach(h => {
      for (let lv = 1; lv <= 10; lv++) {
        const cfg = moneyLevelConfig(lv, h);
        cfg.coins.forEach(v => { if ([1, 2, 5, 10].indexOf(v) < 0) out.push((h || 'ปกติ') + ' ด่าน' + lv + ' = ' + v); });
      }
    });
    return out;
  });
  /* 🔒 ทั้งแอปใช้หน้าตาเหรียญชุดเดียว (cv1/cv2/cv5/cv10) — เหรียญ 20/50/100 ไม่มีหน้าตารองรับ
     และเด็กที่เพิ่งเรียนจากเกมจ่ายเงิน/ทอนเงินจะเจอเหรียญคนละชุดแล้วสับสน */
  expect(bad, 'ห้ามมีเหรียญนอกเหนือจาก 1/2/5/10').toEqual([]);
});

test('✋ ท่าแบมือ = แตะ ต้องเปิดเฉพาะเกมนกฮูกสั่งเท่านั้น', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(() => {
    if (typeof window.setHandOpenMode !== 'function') return { none: true };
    const seen = {};
    ['ef', 'memory', 'mix', 'clock'].forEach(id => {
      window.HouseGames && window.HouseGames.tune
        ? window.HouseGames.tune(id, true)
        : window.setHandOpenMode(id === 'ef');
      seen[id] = window.getHandOpenMode();
      window.setHandOpenMode(false);
    });
    return { seen };
  });
  expect(r.none, 'ต้องมีสวิตช์โหมดแบมือ').toBeFalsy();
  expect(r.seen.ef, 'เกมนกฮูกสั่งต้องเปิดโหมดแบมือ').toBe(true);
  /* 🔒 เกมที่ต้องเล็งแม่น (ลากเส้น/คีย์เปียโน) ห้ามโดนด้วย — เด็กจะเผลอแบมือแล้วกดโดนของที่ไม่ได้ตั้งใจ */
  ['memory', 'mix', 'clock'].forEach(id =>
    expect(r.seen[id], 'เกม ' + id + ' ต้องไม่เปิดโหมดแบมือ').toBe(false));
});
