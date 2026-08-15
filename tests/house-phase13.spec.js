/* ============================================================
   เฟส 13 — มินิเกมกลุ่ม B + D (ข้อ 52 ของ QUEST-DESIGN.md · ฉบับปรับแล้ว)

   เจตนาของทั้งเฟส: **ไม่เพิ่มการ์ด 4 ตัวเลือกเลยสักตัว**
   (กลไก 57 ตัวตอนนี้เป็นการ์ด 4 ตัวเลือกอยู่ 26 ตัว · เล่นในการ์ดลอย 53 จาก 57)

   ทำแล้ว: 🍰 ร้านขนมตามใบสั่ง (ทรงลาก `slots`)
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = g => ({ id: 'p13' + g, name: 'ขนมจีน', emoji: '🍰', birthDate: '2018-06-01', grade: g });

async function house(page, grade) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({
      v: 1, mapV: 4, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
    }));
  }, CHILD(grade || 'p3'));
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseQuests, null, { timeout: 30000 });
  return errs;
}

/* ---------------------------------------------------------------- */

test('🍰 ร้านขนม: คลังใบสั่ง ≥ 40 · ทุกใบสั่ง 3 ขั้นแรกสมเหตุสมผลด้วยตัวเอง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const sets = window.HouseQuests.DESSERT_SETS || [];
    return {
      n: sets.length,
      names: sets.map(s => s.name),
      shortSteps: sets.filter(s => !s.steps || s.steps.length < 3).map(s => s.name),
      badStep: sets.filter(s => (s.steps || []).some(st => !st[0] || !st[1])).map(s => s.name),
      /* ชั้นเล็กเล่นแค่ 3 ขั้นแรก ⇒ ขั้นที่ 1 ต้องเป็น "ภาชนะ/ฐาน" เสมอ ไม่ใช่ของโรยหน้า */
      maxSteps: Math.max.apply(null, sets.map(s => (s.steps || []).length)),
    };
  });
  expect(r.n, 'คลังต้อง ≥ 40 รายการตามเกณฑ์ที่ผู้ใช้สั่งไว้').toBeGreaterThanOrEqual(40);
  expect(new Set(r.names).size, 'ชื่อใบสั่งห้ามซ้ำ').toBe(r.n);
  expect(r.shortSteps, 'ทุกใบสั่งต้องมีอย่างน้อย 3 ขั้น (ชั้นเล็กเล่น 3 ขั้นแรก)').toEqual([]);
  expect(r.badStep, 'ทุกขั้นต้องมีทั้งรูปและคำอธิบาย').toEqual([]);
  expect(r.maxSteps).toBeLessThanOrEqual(5);
  expect(errs).toEqual([]);
});

test('🍰 ร้านขนม: เป็นทรงลาก ไม่ใช่การ์ด 4 ตัวเลือก · ไล่ระดับตามชั้น · ไม่มีตำแหน่งกำกวม', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const out = { shape: Q.mechShape ? Q.mechShape('dessert') : null, byTier: {}, ambiguous: [] };
    ['prep-p1', 'p3', 'p6'].forEach(g => {
      const run = Q.testRun({mech:'dessert', gid:g});
      const items = (run && run.items) || [];
      out.byTier[g] = items.map(it => ({
        kind: it.kind, layout: it.layout,
        bins: (it.bins || []).length, tiles: (it.tiles || []).length,
        choices: (it.choices || []).length,
      }));
      items.forEach(it => {
        /* ของ 1 ชิ้นต้องมีช่องถูกต้องช่องเดียว — ห้ามมี tile 2 ชิ้นที่ชี้ช่องเดียวกัน */
        const bins = (it.tiles || []).map(t => t.bin);
        if (new Set(bins).size !== bins.length) out.ambiguous.push(it.q);
      });
    });
    return out;
  });

  expect(r.shape, 'ต้องเป็นทรงลาก ไม่ใช่ card').toBe('drag');
  Object.keys(r.byTier).forEach(g => {
    const items = r.byTier[g];
    expect(items.length, g + ' ต้องสร้างกระดานได้').toBeGreaterThan(0);
    items.forEach(it => {
      expect(it.kind).toBe('sort');
      expect(it.layout, 'ต้องเป็นช่องเรียงลำดับ ไม่ใช่ถังหลายใบ').toBe('slots');
      expect(it.choices, 'ห้ามมีตัวเลือกให้กด — เกมนี้เล่นด้วยการลาก').toBe(0);
      expect(it.tiles).toBe(it.bins);        /* ช่องละ 1 ชิ้นพอดี */
    });
  });
  /* ไล่ระดับ: ชั้นเล็กขั้นน้อยกว่าชั้นโต */
  const small = r.byTier['prep-p1'].reduce((a, b) => a + b.bins, 0) / r.byTier['prep-p1'].length;
  const big = r.byTier['p6'].reduce((a, b) => a + b.bins, 0) / r.byTier['p6'].length;
  expect(big, 'ชั้นโตต้องได้ขั้นตอนมากกว่าชั้นเล็ก').toBeGreaterThan(small);
  expect(r.ambiguous, 'ห้ามมีของ 2 ชิ้นที่ลงช่องเดียวกันได้ (กำกวม = ลงโทษเด็กกลายๆ)').toEqual([]);
  expect(errs).toEqual([]);
});

test('🍰 ร้านขนม: แจกโดยร้านของหวานเท่านั้น ไม่หลุดไปทั้งเมือง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const npcs = (window.__houseDbg.npcDefs() || []).map(n => n.id);
    const givers = npcs.filter(id => (Q.bonusMechsFor(id) || []).indexOf('dessert') >= 0);
    return {
      givers,
      inPool: (Q.ENGINE_MECHS || []).indexOf('dessert') >= 0,
      inFamily: (Q.FAM_MECHS || []).indexOf('dessert') >= 0,
      carpenter: (Q.bonusMechsFor('npc-carpenter') || []).indexOf('dessert') >= 0,
    };
  });
  expect(r.givers.length, 'ต้องมีร้านที่แจกงานนี้จริง').toBeGreaterThan(0);
  expect(r.inPool, 'ห้ามอยู่ในพูลรวมของชาวบ้านทั้งเมือง').toBe(false);
  expect(r.inFamily, 'ไม่ใช่เควสต์ครอบครัว').toBe(false);
  expect(r.carpenter, 'ช่างไม้ต้องไม่แจกงานประกอบขนม').toBe(false);
  expect(errs).toEqual([]);
});

test('🍰 ร้านขนม: เล่นในการ์ดได้จริง — ลากครบแล้วผ่าน · ค่าตอบแทนเท่ากลไกอื่น', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'dessert', title: '🍰 ร้านขนม' }));
  /* หน้าแรกเป็นการ์ดรับงาน (ปุ่มตกลง) — บางกลไกข้ามไปกระดานเลย จึงกดเฉพาะเมื่อมีปุ่ม */
  const yes = page.locator('#hqz-stage .hqz-yes');
  if (await yes.count()) await yes.first().click();
  /* กระดานลาก-วางต้องขึ้นจริง (ช่องเรียงลำดับ = .hqz-sort + .hqz-slots) */
  await expect(page.locator('.hqz-sort').first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.hqz-slots').first()).toBeVisible({ timeout: 10000 });

  const r = await page.evaluate(() => {
    const run = window.__houseDbg.qRun();
    const it = run && run.items[run.idx];
    const Q = window.HouseQuests;
    return {
      hasBoard: !!it && it.kind === 'sort',
      /* ตรวจว่าคำตอบที่ถูกต้อง "มีอยู่จริง" — วางตามที่ engine บอกแล้วต้องผ่าน */
      okWhenRight: it ? Q.MECHS.dessert.verify(it, (it.tiles || []).reduce((m, t) => { m[t.k] = t.bin; return m; }, {})).ok : false,
      badWhenWrong: it && it.tiles.length > 1
        ? !Q.MECHS.dessert.verify(it, (it.tiles || []).reduce((m, t, i) => { m[t.k] = it.tiles[(i + 1) % it.tiles.length].bin; return m; }, {})).ok
        : true,
    };
  });
  expect(r.hasBoard).toBe(true);
  expect(r.okWhenRight, 'วางถูกทุกช่องแล้วต้องผ่าน (ไม่งั้นเป็น dead end)').toBe(true);
  expect(r.badWhenWrong, 'วางสลับช่องแล้วต้องยังไม่ผ่าน').toBe(true);
  expect(errs).toEqual([]);
});

/* ---------------- 🫥 ของหายไปไหน ---------------- */

test('🫥 ของหายไปไหน: ของบนถาดเป็นชุดเดิมทั้งหมด ไม่มีตัวลวง · มีคำตอบถูกเสมอ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const bad = { noAnswer: [], decoy: [], dupItem: [], gapCount: [], notInBefore: [] };
    ['prep-p1', 'p3', 'p6'].forEach(g => {
      for (let s = 0; s < 6; s++) {
        const run = Q.testRun({ mech: 'vanish', gid: g, seed: s });
        (run.items || []).forEach(it => {
          if (it.kind !== 'vanish') return;
          const gone = it.choices[it.correct];
          if (it.correct < 0 || !gone) bad.noAnswer.push(g + '#' + s);
          /* ถาดต้องเป็นชุดเดิมเป๊ะ — ห้ามมีของที่ไม่เคยโผล่บนโต๊ะ */
          it.choices.forEach(c => { if (it.before.indexOf(c) < 0) bad.decoy.push(c); });
          if (it.choices.length !== it.before.length) bad.decoy.push('ขนาดถาดไม่เท่าของบนโต๊ะ');
          /* ของห้ามซ้ำในกระดานเดียว ไม่งั้นชิ้นที่หายยังอยู่บนโต๊ะ = ไม่มีคำตอบถูก */
          if (new Set(it.before).size !== it.before.length) bad.dupItem.push(g);
          /* ต้องหายพอดี 1 ช่อง */
          const gaps = it.after.filter(e => !e).length;
          if (gaps !== 1) bad.gapCount.push(gaps);
          /* ชิ้นที่หายต้องเคยอยู่บนโต๊ะ และต้องไม่เหลืออยู่หลังเปิดผ้า */
          if (it.before.indexOf(gone) < 0 || it.after.indexOf(gone) >= 0) bad.notInBefore.push(gone);
        });
      }
    });
    return bad;
  });
  expect(r.noAnswer, 'ทุกกระดานต้องมีคำตอบที่ถูก').toEqual([]);
  expect(r.decoy, 'ห้ามมีตัวลวงที่ไม่เคยโผล่บนโต๊ะ (เด็กจำครบก็ยังตอบผิดได้ = ลงโทษกลายๆ)').toEqual([]);
  expect(r.dupItem, 'ของห้ามซ้ำในกระดานเดียว').toEqual([]);
  expect(r.gapCount, 'ต้องหายพอดี 1 ชิ้น').toEqual([]);
  expect(r.notInBefore, 'ชิ้นที่หายต้องเคยอยู่บนโต๊ะและต้องหายไปจริง').toEqual([]);
  expect(errs).toEqual([]);
});

test('🫥 ของหายไปไหน: ไล่ระดับตามชั้น · เด็กเล็กได้ดูนานกว่า', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const avg = g => {
      const runs = [0, 1, 2].map(s => Q.testRun({ mech: 'vanish', gid: g, seed: s }));
      const items = runs.reduce((a, r2) => a.concat(r2.items || []), []).filter(i => i.kind === 'vanish');
      return { n: items.reduce((a, i) => a + i.before.length, 0) / items.length,
               showFor: items[0].showFor };
    };
    return { small: avg('prep-p1'), big: avg('p6') };
  });
  expect(r.big.n, 'ชั้นโตต้องจำของมากกว่าชั้นเล็ก').toBeGreaterThan(r.small.n);
  expect(r.small.showFor, 'เด็กเล็กต้องได้เวลาดูนานกว่า').toBeGreaterThan(r.big.showFor);
  expect(errs).toEqual([]);
});

test('🫥 ของหายไปไหน: เล่นจริง — โชว์ของ → คลุม → แตะตอบได้ · ตอบผิดแล้วห้ามย้อนไปโชว์ซ้ำ', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'vanish', title: '🫥 ของหายไปไหน' }));
  /* จังหวะ 1: โต๊ะของครบ ยังไม่มีปุ่มให้แตะ */
  await expect(page.locator('.hqz-vanish-tray').first()).toBeVisible({ timeout: 8000 });
  expect(await page.locator('.hqz-vpick').count(), 'ตอนโชว์ของต้องยังไม่มีถาดให้ตอบ').toBe(0);

  /* จังหวะ 2: ถาดให้แตะโผล่ + ช่องว่างบนโต๊ะพอดี 1 ช่อง */
  await expect(page.locator('.hqz-vpick').first()).toBeVisible({ timeout: 15000 });
  const st = await page.evaluate(() => {
    const it = window.__houseDbg.qRun().items[window.__houseDbg.qRun().idx];
    return { gaps: document.querySelectorAll('.hqz-vtile.gap').length,
             picks: document.querySelectorAll('.hqz-vpick').length,
             correct: it.correct };
  });
  expect(st.gaps).toBe(1);
  expect(st.picks).toBeGreaterThanOrEqual(4);

  /* ตอบผิดก่อน → ต้องยังอยู่หน้าเดิม ห้ามย้อนไปโชว์ของใหม่ (เฉลยให้ฟรี) */
  const wrongIdx = (st.correct + 1) % st.picks;
  await page.locator('.hqz-vpick').nth(wrongIdx).click();
  await page.waitForTimeout(400);
  const afterWrong = await page.evaluate(() => ({
    picks: document.querySelectorAll('.hqz-vpick').length,
    covered: !!document.querySelector('.hqz-vanish-tray.covered'),
  }));
  expect(afterWrong.picks, 'ตอบผิดแล้วต้องยังอยู่หน้าเดิม ให้ลองใหม่ได้').toBeGreaterThan(0);

  /* ตอบถูก → ไปข้อถัดไป */
  await page.locator('.hqz-vpick').nth(st.correct).click();
  await page.waitForTimeout(900);
  expect(errs).toEqual([]);
});
