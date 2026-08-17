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

test('✋ นกฮูกสั่ง: ท่ามือคือคำตอบ (แบ = แตะ · กำ = ไม่แตะ) และเปิดเฉพาะเกมนี้', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(() => {
    if (typeof window.setHandPoseMode !== 'function') return { none: true };
    const seen = {};
    ['ef', 'memory', 'mix', 'clock'].forEach(id => {
      window.setHandPoseMode(id === 'ef');
      seen[id] = window.getHandPoseMode();
      window.setHandPoseMode(false);
    });
    /* ป้ายบนปุ่มต้องบอกท่าให้เด็กรู้ตอนเปิดโหมด แล้วคืนข้อความเดิมตอนปิด */
    window.setHandPoseMode(true);
    const on = { tap: document.getElementById('ef-tap-btn').textContent,
                 skip: document.getElementById('ef-skip-btn').textContent };
    window.setHandPoseMode(false);
    const off = { tap: document.getElementById('ef-tap-btn').textContent,
                  skip: document.getElementById('ef-skip-btn').textContent };
    return { seen, on, off };
  });
  expect(r.none, 'ต้องมีสวิตช์โหมดท่ามือ').toBeFalsy();
  expect(r.seen.ef, 'เกมนกฮูกสั่งต้องเปิดโหมดท่ามือ').toBe(true);
  /* 🔒 เกมอื่นมีตัวเลือกมากกว่า 2 ทาง ท่ามือแทนปุ่มไม่ได้ ⇒ ห้ามเปิดให้ */
  ['memory', 'mix', 'clock'].forEach(id =>
    expect(r.seen[id], 'เกม ' + id + ' ต้องไม่เปิดโหมดท่ามือ').toBe(false));
  /* 🏷️ เด็ก 5 ขวบเดาเองไม่ได้ว่าท่าไหนคือคำตอบไหน — ต้องเขียนบอกบนปุ่ม */
  expect(r.on.tap, 'ปุ่มแตะต้องบอกว่าใช้ท่าแบมือ').toContain('แบมือ');
  expect(r.on.skip, 'ปุ่มไม่แตะต้องบอกว่าใช้ท่ากำมือ').toContain('กำมือ');
  expect(r.off.tap, 'ปิดโหมดแล้วต้องคืนข้อความเดิม').not.toContain('แบมือ');
  expect(r.off.skip, 'ปิดโหมดแล้วต้องคืนข้อความเดิม').not.toContain('กำมือ');
});

test('💵 ธนบัตร 20 เขียว · 50 ฟ้า · 100 แดง — โผล่เฉพาะด่านที่ราคาเกิน 100', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(() => {
    const early = [], badVal = [];
    [null, 'p5', 'p6'].forEach(h => {
      for (let lv = 1; lv <= 10; lv++) {
        const cfg = moneyLevelConfig(lv, h);
        if (!cfg.notes) continue;
        cfg.notes.forEach(v => { if ([20, 50, 100].indexOf(v) < 0) badVal.push((h || 'ปกติ') + ' ' + v); });
        /* 🔒 "ใช้เท่าที่จำเป็นเท่านั้นกับราคาที่เยอะเกิน 100" (ผู้ใช้สั่ง)
           ⇒ ด่านที่ราคาสูงสุดยังไม่ถึง 100 ห้ามมีธนบัตรให้เลย เด็กจะได้ไม่ต้องเรียนของใหม่เร็วเกิน */
        if (cfg.priceMax <= 100) early.push((h || 'ปกติ') + ' ด่าน' + lv + ' ราคาสูงสุด ' + cfg.priceMax);
      }
    });
    /* หน้าตาธนบัตรต้องเป็นสี่เหลี่ยม ไม่ใช่วงกลมแบบเหรียญ + สีตรงตามที่กำหนด */
    const probe = document.createElement('div');
    probe.innerHTML = billFace(20) + billFace(50) + billFace(100);
    document.body.appendChild(probe);
    const css = Array.from(probe.querySelectorAll('.money-bill')).map(e => {
      const st = getComputedStyle(e);
      return { r: st.borderRadius, bg: st.backgroundImage };
    });
    probe.remove();
    return { early, badVal, css, isBill: [isBillValue(20), isBillValue(50), isBillValue(100), isBillValue(10)] };
  });
  expect(r.badVal, 'ธนบัตรต้องมีแค่ 20/50/100').toEqual([]);
  expect(r.early, 'ห้ามมีธนบัตรในด่านที่ราคายังไม่ถึง 100').toEqual([]);
  expect(r.isBill, '20/50/100 = ธนบัตร · 10 = เหรียญ').toEqual([true, true, true, false]);
  /* ⚠ ธนบัตรต้องไม่กลม ไม่งั้นเด็กนับปนกับเหรียญ */
  r.css.forEach(c => expect(parseFloat(c.r), 'ธนบัตรต้องเป็นสี่เหลี่ยมมุมมน ไม่ใช่วงกลม').toBeLessThan(12));
  expect(r.css[0].bg, '20 ต้องเขียว').toContain('124, 208, 138');
  expect(r.css[1].bg, '50 ต้องฟ้า').toContain('127, 200, 240');
  expect(r.css[2].bg, '100 ต้องแดง').toContain('242, 134, 126');
});

test('✋ นกฮูกสั่ง: ค้างท่าครบ 2 วิ แล้วต้องตอบให้ตรงปุ่ม (แบ→แตะ · กำ→ไม่แตะ)', async ({ page }) => {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(() => {
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id: 'efp', name: 'ทดสอบ', emoji: '🦉', birthDate: '2018-01-15', grade: 'p2' }]));
    localStorage.setItem('p1quiz_active_child', 'efp');
    localStorage.setItem('p1quiz_music', 'off');
    window.__TUT_OFF = true;
  });
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-quiz').click();
  await page.waitForTimeout(500);
  const r = await page.evaluate(async () => {
    startEfGame('p1-iq3');
    window.setEfNoTimer(true);            /* ตัดตัวจับเวลาออก เทสจะได้ไม่แข่งกับด่านที่หมดเวลาเอง */
    window.setHandPoseMode(true);
    const hit = [];
    document.getElementById('ef-tap-btn').addEventListener('click', () => hit.push('tap'));
    document.getElementById('ef-skip-btn').addEventListener('click', () => hit.push('skip'));
    /* ป้อนค่า "ความกางของนิ้ว" เข้าระบบท่ามือโดยตรง — ไม่ต้องเปิดกล้องจริง
       แบมือจริงวัดได้ ~1.9-2.2 · กำมือ ~1.0-1.2 */
    const hold = async (spread, ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) { hpPoseTick(spread); await new Promise(r2 => setTimeout(r2, 60)); }
    };
    await hold(2.1, 700);
    const early = hit.slice();
    const prog = parseFloat(getComputedStyle(document.getElementById('ef-tap-btn'))
                   .getPropertyValue('--hp-dwell-p')) || 0;
    await hold(2.1, 1800);
    const afterOpen = hit.slice();
    await hold(2.1, 1500);                /* ค้างท่าเดิมต่อ — ห้ามตอบซ้ำ */
    const afterHold = hit.slice();
    await hold(1.05, 2400);
    const afterFist = hit.slice();
    window.setHandPoseMode(false);
    return { early, prog, afterOpen, afterHold, afterFist };
  });
  expect(errs, 'ห้ามมี error').toEqual([]);
  /* ⚠ ต้องค้างครบ 2 วิถึงจะตอบ — แวบเดียวห้ามนับ ไม่งั้นเด็กขยับมือแล้วตอบเองมั่ว */
  expect(r.early, 'ยังไม่ครบ 2 วิ ต้องยังไม่ตอบ').toEqual([]);
  expect(r.prog, 'ต้องโชว์ความคืบหน้าบนปุ่มระหว่างค้างท่า').toBeGreaterThan(0.15);
  expect(r.afterOpen, 'แบมือครบ 2 วิ = ตอบ "แตะเลย"').toEqual(['tap']);
  /* ⚠ ค้างท่าเดิมต่อห้ามยิงซ้ำ — ต้องเปลี่ยนท่าก่อน */
  expect(r.afterHold, 'ค้างท่าเดิมต่อต้องไม่ตอบซ้ำ').toEqual(['tap']);
  expect(r.afterFist[r.afterFist.length - 1], 'กำมือครบ 2 วิ = ตอบ "ไม่แตะ"').toBe('skip');
});
