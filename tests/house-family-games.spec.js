/* ============================================================
   เฟส 4B — มินิเกมครอบครัว
   ตอนนี้มี 2 เกมที่ใช้กลไก "จัดของลงถัง" (sort) ร่วมกัน:
     tidy    = เก็บของเข้าที่
     laundry = แยกผ้าซัก
   ⚠ เกมพวกนี้โผล่เฉพาะ **เควสต์ครอบครัว** เท่านั้น — NPC/กระดานต้องยังเป็น quiz/count เหมือนเดิม
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'fg1', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p2' };

async function openHouse(page, grade) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(([c, g]) => {
    const child = Object.assign({}, c, g ? { grade: g } : {});
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_progress_' + child.id, JSON.stringify({ coins: 300 }));
    localStorage.setItem('p1quiz_house_' + child.id, JSON.stringify({ v: 1, mapV: 3,
      char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } }));
  }, [CHILD, grade || '']);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.mode() === 'world', null, { timeout: 30000 });
  await page.waitForTimeout(900);
  return errors;
}
/* เปิดกระดานมินิเกมผ่านเส้นทางทดสอบ (ไม่กินโควตาเควสต์จริง) */
async function openBoard(page, mech) {
  await page.evaluate(m => window.HouseQuestUI.playTest({ mech: m, title: '🧪 ' + m }), mech);
  await expect(page.locator('.hqz-sort')).toBeVisible({ timeout: 8000 });
}
/* เล่นกระดานปัจจุบันให้ถูกทั้งหมด คืน true ถ้ายังมีกระดานถัดไป */
async function solveBoard(page) {
  return await page.evaluate(async () => {
    const run = window.__houseDbg.qRun();
    const it = run.items[run.idx];
    const bins = Array.from(document.querySelectorAll('.hqz-bin'));
    const tiles = Array.from(document.querySelectorAll('.hqz-tray .hqz-tile'));
    for (const t of tiles) {
      const want = it.tiles.find(x => x.k === t.dataset.k).bin;
      t.click();
      bins[it.bins.findIndex(b => b.id === want)].click();
      await new Promise(r => setTimeout(r, 15));
    }
    await new Promise(r => setTimeout(r, 850));
    return !!document.querySelector('.hqz-sort');
  });
}

test('คลังของ: ของชิ้นเดียวห้ามอยู่ 2 ถังในเกมเดียวกัน (ไม่งั้นโจทย์ไม่มีคำตอบที่ถูกแน่นอน)', async ({ page }) => {
  const errors = await openHouse(page);
  const bad = await page.evaluate(() => {
    const sets = window.HouseQuests.SORT_SETS;
    const out = [];
    Object.keys(sets).forEach(id => {
      const seen = {};
      sets[id].bins.forEach(b => b.items.forEach(e => {
        if (seen[e]) out.push(id + ':' + e + ' อยู่ทั้ง ' + seen[e] + ' และ ' + b.id);
        seen[e] = b.id;
      }));
    });
    return out;
  });
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
});

test('กระดานที่สุ่มออกมา: ทุกถังมีของอย่างน้อย 1 ชิ้น · ของทุกชิ้นมีถังที่ถูกต้องอยู่บนกระดาน', async ({ page }) => {
  const errors = await openHouse(page);
  const bad = await page.evaluate(() => {
    const q = window.HouseQuests;
    const out = [];
    ['tidy', 'laundry'].forEach(mech => {
      q.GRADES.forEach(g => {
        for (let seed = 0; seed < 6; seed++) {
          const run = q.testRun({ mech, gid: g.id, seed });
          run.items.forEach((it, n) => {
            const where = 'gid=' + g.id + ' mech=' + mech + ' seed=' + seed + ' ข้อ' + n;
            if (it.kind !== 'sort') { out.push(where + ' kind ผิด'); return; }
            const ids = it.bins.map(b => b.id);
            const used = {};
            it.tiles.forEach(t => {
              if (ids.indexOf(t.bin) < 0) out.push(where + ' ' + t.e + ' ไม่มีถังรองรับ');
              used[t.bin] = 1;
            });
            ids.forEach(id => { if (!used[id]) out.push(where + ' ถัง ' + id + ' ว่างเปล่า'); });
            if (it.tiles.length < 4) out.push(where + ' ของน้อยเกินไป (' + it.tiles.length + ')');
          });
          if (run.items.length < 3) out.push('gid=' + g.id + ' กระดานน้อยเกินไป');
        }
      });
    });
    return out;
  });
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
});

test('เอนจิน: วางผิดคืนรายชื่อชิ้นที่ผิด · ผิดซ้ำข้อเดิมนับครั้งเดียว · วางถูกครบแล้วผ่าน', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const run = q.testRun({ mech: 'tidy', seed: 7 });
    const it = run.items[0];
    const wrongAll = {};
    it.tiles.forEach(t => {
      const other = it.bins.filter(b => b.id !== t.bin)[0];
      wrongAll[t.k] = other.id;
    });
    const a = q.submit(run, wrongAll);
    const b = q.submit(run, wrongAll);           /* ผิดซ้ำข้อเดิม */
    const right = {};
    it.tiles.forEach(t => { right[t.k] = t.bin; });
    const c = q.submit(run, right);
    return { badN: (a.bad || []).length, tiles: it.tiles.length, aOk: a.ok, bOk: b.ok,
             wrong: run.wrong, cOk: c.ok, idx: run.idx };
  });
  expect(r.aOk).toBe(false);
  expect(r.badN).toBe(r.tiles);          /* วางผิดทุกชิ้น = คืนครบทุกชิ้น */
  expect(r.bOk).toBe(false);
  expect(r.wrong).toBe(1);               /* ผิดข้อเดิม 2 ครั้ง นับ 1 (กติกาเหล็กข้อ 2) */
  expect(r.cOk).toBe(true);
  expect(r.idx).toBe(1);
  expect(errors).toEqual([]);
});

test('มินิเกมโผล่เฉพาะเควสต์ครอบครัว — NPC/กระดานยังเป็น quiz/count เท่านั้น', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const fam = q.FAM_MECHS;
    const others = [];
    q.state().npcIds.forEach(id => { const s = q.specForNpc(id); if (s) others.push(s.mech); });
    for (let i = 0; i < q.BOARD_N; i++) { const s = q.specForBoard(i); if (s) others.push(s.mech); }
    return { fam, others: others.filter((v, i, a) => a.indexOf(v) === i) };
  });
  expect(r.fam).toContain('tidy');
  expect(r.fam).toContain('laundry');
  expect(r.fam).toContain('quiz');
  r.others.forEach(m => expect(['quiz', 'count']).toContain(m));
  expect(errors).toEqual([]);
});

test('หน้าจอ: แตะของ → แตะถัง = วางลง · แตะของในถัง = เอากลับถาด', async ({ page }) => {
  const errors = await openHouse(page);
  await openBoard(page, 'tidy');
  const first = page.locator('.hqz-tray .hqz-tile').first();
  await first.click();
  await expect(first).toHaveClass(/sel/);
  const trayBefore = await page.locator('.hqz-tray .hqz-tile').count();
  await page.locator('.hqz-bin').first().click();
  expect(await page.locator('.hqz-tray .hqz-tile').count()).toBe(trayBefore - 1);
  expect(await page.locator('.hqz-bin').first().locator('.hqz-tile').count()).toBe(1);

  await page.locator('.hqz-bin').first().locator('.hqz-tile').first().click();
  expect(await page.locator('.hqz-tray .hqz-tile').count()).toBe(trayBefore);
  expect(errors).toEqual([]);
});

test('หน้าจอ: วางผิดเด้งกลับถาด แต่ชิ้นที่ถูกยังอยู่ในถัง (ไม่ต้องเริ่มใหม่หมด)', async ({ page }) => {
  const errors = await openHouse(page, 'p6');           /* ป.6 = ของ 8 ชิ้น ถัง 4 ใบ จะได้มีทั้งถูกทั้งผิด */
  await openBoard(page, 'tidy');
  const r = await page.evaluate(async () => {
    const run = window.__houseDbg.qRun();
    const it = run.items[run.idx];
    const bins = Array.from(document.querySelectorAll('.hqz-bin'));
    const tiles = Array.from(document.querySelectorAll('.hqz-tray .hqz-tile'));
    /* ชิ้นแรกวางผิดถัง ที่เหลือวางถูก */
    tiles.forEach((t, i) => {
      const want = it.tiles.find(x => x.k === t.dataset.k).bin;
      const id = i === 0 ? it.bins.filter(b => b.id !== want)[0].id : want;
      t.click();
      bins[it.bins.findIndex(b => b.id === id)].click();
    });
    await new Promise(r2 => setTimeout(r2, 1000));
    return { tray: document.querySelectorAll('.hqz-tray .hqz-tile').length,
             inBin: document.querySelectorAll('.hqz-bin .hqz-tile').length,
             total: it.tiles.length, wrong: window.__houseDbg.qRun().wrong };
  });
  expect(r.tray).toBe(1);                       /* เด้งกลับเฉพาะชิ้นที่ผิด */
  expect(r.inBin).toBe(r.total - 1);            /* ที่เหลืออยู่ในถังต่อไป */
  expect(r.wrong).toBe(1);
  expect(errors).toEqual([]);
});

test('เล่นจนจบชุดได้ดาว · โหมดทดสอบไม่จ่ายเหรียญและไม่กินโควตาเควสต์ของวันนี้', async ({ page }) => {
  const errors = await openHouse(page);
  const before = await page.evaluate(() => ({
    coins: window.OwlCoins.get(), left: window.HouseQuests.daySummary().left,
    stars: window.HouseQuests.daySummary().stars }));
  await openBoard(page, 'laundry');
  for (let i = 0; i < 12; i++) { if (!(await solveBoard(page))) break; }
  await expect(page.locator('.hqz-stars')).toBeVisible({ timeout: 10000 });
  const after = await page.evaluate(() => ({
    coins: window.OwlCoins.get(), left: window.HouseQuests.daySummary().left,
    stars: window.HouseQuests.daySummary().stars }));
  expect(after).toEqual(before);
  expect(errors).toEqual([]);
});

test('จำนวนของ/ถัง/กระดาน ไล่ตามระดับชั้น (ป.1 ง่ายกว่า ป.6 เสมอ)', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    return q.GRADES.map(g => Object.assign({ gid: g.id }, q.catalogSort('tidy', g.id)));
  });
  const p1 = r[0], p6 = r[r.length - 1];
  expect(p1.tileN).toBeLessThan(p6.tileN);
  expect(p1.binN).toBeLessThanOrEqual(p6.binN);
  expect(p1.rounds).toBeLessThanOrEqual(p6.rounds);
  r.forEach(x => { expect(x.rounds).toBeGreaterThanOrEqual(3); expect(x.binN).toBeGreaterThanOrEqual(2); });
  expect(errors).toEqual([]);
});
