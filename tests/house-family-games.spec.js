/* ============================================================
   เฟส 4B — มินิเกมครอบครัว
   ตอนนี้มี 2 เกมที่ใช้กลไก "จัดของลงถัง" (sort) ร่วมกัน:
     tidy    = เก็บของเข้าที่
     laundry = แยกผ้าซัก
   ⚠ เกมพวกนี้โผล่เฉพาะ **เควสต์ครอบครัว** เท่านั้น
     (NPC/กระดานได้ quiz/count + กลไกกลุ่ม engine ของเฟส 5 แต่ห้ามได้มินิเกม 4B)
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
    localStorage.setItem('p1quiz_house_' + child.id, JSON.stringify({ v: 1, mapV: 3, tut: { skip: true },
      char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } }));
  }, [CHILD, grade || '']);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  /* ⚠ ห้ามรอแค่ mode()==='world' — hMode มีค่าเริ่มต้นเป็น 'world' ตั้งแต่ house.js โหลดเสร็จ
     ทั้งที่ startHouseGame() ยังไม่ทำงาน ถ้าเปิดการ์ดก่อนหน้านั้น startHouseGame() จะปิดทิ้งเงียบๆ */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready()
                                   && window.__houseDbg.mode() === 'world', null, { timeout: 30000 });
  return errors;
}
/* เปิดกระดานมินิเกมผ่านเส้นทางทดสอบ (ไม่กินโควตาเควสต์จริง) */
async function openBoard(page, mech) {
  await page.evaluate(m => window.HouseQuestUI.playTest({ mech: m, title: '🧪 ' + m }), mech);
  await expect(page.locator('.hqz-sort')).toBeVisible({ timeout: 8000 });
}
/* ยิงเหตุการณ์ "ลากของไปปล่อยในถัง" จากในหน้าเว็บโดยตรง
   ⚠ **ห้ามใช้ el.click()** — กระดานนี้ฟัง pointerdown/move/up ไม่ได้ฟัง click
     (เทสที่ใช้ .click() จะเงียบๆ ไม่มีอะไรเกิดขึ้นเลย เจอมาแล้ว 2026-08-10)
   ใช้ pointer event จริงจึงเดินผ่านโค้ดเส้นทางเดียวกับที่เด็กเล่น แต่เร็วกว่าขยับเมาส์ทีละก้าว */
const DRAG_FN = `function(tileEl, binEl){
  const a = tileEl.getBoundingClientRect(), b = binEl.getBoundingClientRect();
  const at = (x, y) => ({pointerId: 1, clientX: x, clientY: y, bubbles: true});
  tileEl.dispatchEvent(new PointerEvent('pointerdown', at(a.x + a.width / 2, a.y + a.height / 2)));
  window.dispatchEvent(new PointerEvent('pointermove', at(b.x + b.width / 2, b.y + b.height / 2)));
  window.dispatchEvent(new PointerEvent('pointerup',   at(b.x + b.width / 2, b.y + b.height / 2)));
}`;
/* เล่นกระดานปัจจุบันให้ถูกทั้งหมด คืน true ถ้ายังมีกระดานถัดไป */
async function solveBoard(page) {
  return await page.evaluate(async src => {
    const drag = eval('(' + src + ')');
    const run = window.__houseDbg.qRun();
    const it = run.items[run.idx];
    const bins = Array.from(document.querySelectorAll('.hqz-bin'));
    const tiles = Array.from(document.querySelectorAll('.hqz-tray .hqz-tile'));
    for (const t of tiles) {
      const want = it.tiles.find(x => x.k === t.dataset.k).bin;
      drag(t, bins[it.bins.findIndex(b => b.id === want)]);
      await new Promise(r => setTimeout(r, 15));
    }
    await new Promise(r => setTimeout(r, 850));
    return !!document.querySelector('.hqz-sort');
  }, DRAG_FN);
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
            if (it.tiles.length < 3) out.push(where + ' ของน้อยเกินไป (' + it.tiles.length + ')');
          });
          if (run.items.length < q.MIN_Q) out.push('gid=' + g.id + ' กระดานน้อยเกินไป (' + run.items.length + ')');
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

/* ⚠ อัปเดต 2 รอบ — เจตนาของเทสนี้เปลี่ยนไปตามคำสั่งผู้ใช้ ไม่ได้ถูกลดทอน:
     เฟส 5 (2026-08-11): NPC/กระดาน **สุ่มกลไกกลุ่ม C (ยืม engine หน้าหลัก) ได้แล้ว**
     เฟส 7 (2026-08-12): **`petfeed` กับ `shopping` เปิดให้ NPC ที่เกี่ยวข้องหยิบไปใช้ได้ด้วย**
       (ร้านสัตว์เลี้ยง/ฟาร์ม ↔ petfeed · ร้านสะดวกซื้อ/ตลาด ↔ shopping — ข้อ 15.2 กลุ่ม B)
   ที่ยัง **ต้องเป็นของเควสต์ครอบครัวล้วน** คือมินิเกมที่เล่าเรื่องในบ้านโดยเฉพาะ
   (เก็บของเข้าที่ · แยกผ้าซัก · ทำอาหาร · กิจวัตร · ใช้เงินให้พอ · ตื่นให้ตรงเวลา · กินข้าวพร้อมหน้า · ไปซื้อของให้แม่) */
/* ⚠ 2026-08-16: `routine` ออกจากกลุ่มนี้แล้ว — เปลี่ยนเป็นงาน Action ที่ต้อง **เดินกลับไปส่งที่ตัว NPC**
     ซึ่งพ่อแม่รับคืนไม่ได้ (ทางส่งงานอยู่ที่ talkToNpc เท่านั้น) ⇒ ย้ายไปเป็นงานของชาวเมือง (ข้อ 55) */
const FAM_ONLY = ['tidy', 'laundry', 'cook', 'budget', 'clock', 'dinner', 'market',
                  'orderlearn', 'sortcat'];
test('มินิเกมของบ้านยังเป็นของเควสต์ครอบครัวล้วน — NPC/กระดานได้เฉพาะที่อนุญาตไว้', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate((famOnly) => {
    const q = window.HouseQuests;
    const others = [];
    q.state().npcIds.forEach(id => { const s = q.specForNpc(id); if (s) others.push(s.mech); });
    for (let i = 0; i < q.BOARD_N; i++) { const s = q.specForBoard(i); if (s) others.push(s.mech); }
    /* สุ่มให้เยอะกว่าชุดของวันนี้ จะได้เห็นกลไกที่ NPC "มีสิทธิ์ได้" ครบจริงๆ ไม่ใช่แค่ที่บังเอิญออกวันนี้ */
    const wide = [];
    q.questableIds().forEach(id => {
      for (let i = 0; i < 40; i++) {
        let h = (i * 2654435761 + id.length) >>> 0;
        const rng = () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; };
        wide.push(q.rollWorkMech(rng, id));
      }
    });
    /* รายชื่องานที่ "ร้านสัตว์เลี้ยงมีสิทธิ์แจก" — ดูจากตารางผูก ไม่ใช่ผลสุ่ม (ไม่ผ่านด่านกันงานตัน) */
    const petBind = [];
    q.BONUS_MECHS.forEach(row => { if (row[0].test('npc-pet1')) petBind.push.apply(petBind, row[1]); });
    return { petBind, fam: q.FAM_MECHS, engines: q.ENGINE_MECHS,
             others: others.filter((v, i, a) => a.indexOf(v) === i),
             wide: wide.filter((v, i, a) => a.indexOf(v) === i),
             leak: wide.filter(m => famOnly.indexOf(m) >= 0).filter((v, i, a) => a.indexOf(v) === i) };
  }, FAM_ONLY);
  expect(r.fam).toContain('tidy');
  expect(r.fam).toContain('laundry');
  expect(r.fam).toContain('quiz');
  /* ① มินิเกมที่เล่าเรื่องในบ้าน ต้องไม่หลุดไปอยู่กับ NPC/กระดานเด็ดขาด */
  expect(r.leak).toEqual([]);
  r.others.forEach(m => expect(FAM_ONLY).not.toContain(m));
  /* ② เฟส 7: มินิเกมที่เปิดให้ NPC หยิบไปใช้ ต้อง "ถึงมือ NPC ได้จริง" (ไม่ใช่แค่ไม่ห้าม)
     ⚠ 2026-08-16: `petfeed`/`shopping` เวอร์ชันการ์ดถูกถอดออกแล้ว — กลายเป็นงาน Action จริง
       `petcare` (ไปดูแลน้องที่บ้าน) กับ `shopping` (ไปซื้อของที่ร้านสะดวกซื้อ) แทน */
  expect(r.wide).toContain('shopping');
  /* ⚠ `petcare` ไม่โผล่ในบ้านที่ยังไม่มีสัตว์เลี้ยง — **นั่นคือด่านกันงานตันทำงานถูกต้องแล้ว**
     จึงเช็คที่ "ผูกกับร้านสัตว์ไว้จริงไหม" แทนการรอให้สุ่มออกมา */
  expect(r.petBind, 'ร้านสัตว์เลี้ยงต้องมีสิทธิ์แจกงานดูแลน้อง').toContain('petcare');
  expect(errors).toEqual([]);
});

/* ลากของชิ้นหนึ่งไปปล่อยกลางถังที่ต้องการ (pointer event จริง ไม่ใช่ .click()) */
async function dragTile(page, tile, target) {
  const a = await tile.boundingBox(), b = await target.boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 + 20, { steps: 4 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
  await page.mouse.up();
}

test('ลาก-วาง: ลากของไปปล่อยในถังแล้วของอยู่ในถังจริง · ระหว่างลากถังที่เล็งอยู่ต้องไฮไลต์', async ({ page }) => {
  const errors = await openHouse(page);
  await openBoard(page, 'tidy');
  const tile = page.locator('.hqz-tray .hqz-tile').first();
  const bin = page.locator('.hqz-bin').first();
  const trayBefore = await page.locator('.hqz-tray .hqz-tile').count();

  /* ระหว่างลาก: ตัวที่ลากต้องลอย (.drag) และถังที่เล็งอยู่ต้องไฮไลต์ (.over) */
  const a = await tile.boundingBox(), b = await bin.boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
  expect(await page.locator('.hqz-tile.drag').count()).toBe(1);
  expect(await page.locator('.hqz-bin.over').count()).toBe(1);
  await page.mouse.up();

  expect(await page.locator('.hqz-tile.drag').count()).toBe(0);
  expect(await bin.locator('.hqz-tile').count()).toBe(1);
  expect(await page.locator('.hqz-tray .hqz-tile').count()).toBe(trayBefore - 1);
  expect(errors).toEqual([]);
});

test('ลาก-วาง: ลากของออกจากถังกลับลงถาดได้ · ปล่อยนอกถังก็กลับถาด (ไม่หายไปไหน)', async ({ page }) => {
  const errors = await openHouse(page);
  await openBoard(page, 'tidy');
  const bin = page.locator('.hqz-bin').first();
  await dragTile(page, page.locator('.hqz-tray .hqz-tile').first(), bin);
  expect(await bin.locator('.hqz-tile').count()).toBe(1);

  await dragTile(page, bin.locator('.hqz-tile').first(), page.locator('.hqz-tray'));
  expect(await bin.locator('.hqz-tile').count()).toBe(0);

  /* ปล่อยกลางที่ว่างนอกการ์ด — ของต้องกลับถาด ไม่ค้างลอยอยู่บนจอ */
  const t = page.locator('.hqz-tray .hqz-tile').first();
  const a = await t.boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(12, 12, { steps: 6 });
  await page.mouse.up();
  expect(await page.locator('.hqz-tile.drag').count()).toBe(0);
  expect(await page.locator('.hqz-tray .hqz-tile').count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('ทางสำรอง: แตะของ → แตะถัง = วางลง · แตะของในถัง = เอากลับถาด (เด็กที่ลากไม่ไหวต้องมีทางไปต่อ)', async ({ page }) => {
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
  const r = await page.evaluate(async src => {
    const drag = eval('(' + src + ')');
    const run = window.__houseDbg.qRun();
    const it = run.items[run.idx];
    const bins = Array.from(document.querySelectorAll('.hqz-bin'));
    const tiles = Array.from(document.querySelectorAll('.hqz-tray .hqz-tile'));
    /* ชิ้นแรกวางผิดถัง ที่เหลือวางถูก */
    tiles.forEach((t, i) => {
      const want = it.tiles.find(x => x.k === t.dataset.k).bin;
      const id = i === 0 ? it.bins.filter(b => b.id !== want)[0].id : want;
      drag(t, bins[it.bins.findIndex(b => b.id === id)]);
    });
    await new Promise(r2 => setTimeout(r2, 1000));
    return { tray: document.querySelectorAll('.hqz-tray .hqz-tile').length,
             inBin: document.querySelectorAll('.hqz-bin .hqz-tile').length,
             total: it.tiles.length, wrong: window.__houseDbg.qRun().wrong };
  }, DRAG_FN);
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
  /* ผู้ใช้สั่ง 2026-08-10: ไม่ว่าเกมอะไรต้องมีอย่างน้อย 5 โจทย์/กระดานต่อ 1 เควสต์เสมอ */
  const min = await page.evaluate(() => window.HouseQuests.MIN_Q);
  expect(min).toBe(5);
  r.forEach(x => { expect(x.rounds).toBeGreaterThanOrEqual(min); expect(x.binN).toBeGreaterThanOrEqual(2); });
  expect(errors).toEqual([]);
});


/* ============================================================
   เฟส 4B — มินิเกมที่เหลืออีก 6 แบบ
   cook/routine = เรียงลำดับ · petfeed = จับคู่อาหารสัตว์ · budget = ใช้เงินให้พอ
   shopping = จำรายการของ · clock = ดูนาฬิกา
   ============================================================ */
/* ⚠ 2026-08-16: `petfeed`/`routine`/`shopping` ถูกเปลี่ยนเป็นงาน Action จริงในโลกแล้ว
     (ดูข้อ 55) ⇒ ไม่ใช่กระดานในการ์ดอีก จึงไม่อยู่ในชุดนี้ — มีเทสของตัวเองที่
     `tests/house-action-ab.spec.js` */
const ALL_GAMES = ['tidy', 'laundry', 'cook', 'budget', 'clock'];
/* เควสต์ "เดินไปทำนอกบ้าน" — ไม่เข้ากติกาขั้นต่ำ 5 ข้อ (ผู้ใช้อนุมัติ 2026-08-10) */
const WALK_GAMES = ['dinner', 'market'];

/* เล่นกระดานปัจจุบันให้ถูก (รู้เฉลยจาก run) — รองรับทุกกลไก คืน true ถ้ายังมีข้อถัดไป */
async function solveAny(page) {
  return await page.evaluate(async src => {
    const drag = eval('(' + src + ')');
    const run = window.__houseDbg.qRun();
    if (!run) return false;
    const it = run.items[run.idx];
    /* หน้า "จำรายการของ" — กดผ่านไปหน้าหยิบของก่อน */
    const memBtn = document.querySelector('#hqz-stage .hqz-yes');
    if (it.memory && document.querySelector('.hqz-memlist')) {
      memBtn.click();
      await new Promise(r => setTimeout(r, 300));
    }
    /* ⚠ ตัวบอกว่า "ยังมีข้อถัดไป" ต้องดูจาก qRun() ไม่ใช่ดูว่ามี .hqz-sort บนจอ —
       หน้า "จำรายการของ" ไม่มี .hqz-sort เลยจะถูกเข้าใจผิดว่าเล่นจบแล้ว (เจอ 2026-08-10) */
    const more = () => !!window.__houseDbg.qRun();
    if (it.kind === 'clock') {
      document.querySelectorAll('.hqz-choice')[it.correct].click();
      await new Promise(r => setTimeout(r, 700));
      return more();
    }
    const bins = Array.from(document.querySelectorAll('.hqz-bin'));
    const tiles = Array.from(document.querySelectorAll('.hqz-tray .hqz-tile'));
    if (it.basket) {
      /* เกมตะกร้า: เลือกให้ครบตามกติกาแล้วกดปุ่มยืนยันเอง */
      let want;
      if (it.memory) want = it.tiles.filter(t => t.want);
      else want = it.tiles.slice().sort((a, b) => a.price - b.price).slice(0, it.need);
      want.forEach(w => {
        const el = tiles.find(t => t.dataset.k === w.k);
        if (el) drag(el, bins[0]);
      });
      await new Promise(r => setTimeout(r, 60));
      Array.from(document.querySelectorAll('#hqz-stage .hqz-yes')).pop().click();
      await new Promise(r => setTimeout(r, 850));
      return more();
    }
    for (const t of tiles) {
      const want = it.tiles.find(x => x.k === t.dataset.k).bin;
      drag(t, bins[it.bins.findIndex(b => b.id === want)]);
      await new Promise(r => setTimeout(r, 12));
    }
    await new Promise(r => setTimeout(r, 850));
    return more();
  }, DRAG_FN);
}

test('มินิเกมครบ 8 แบบ · ทุกแบบสร้างโจทย์ได้จริงทุกระดับชั้น และไม่ต่ำกว่า 5 ข้อ', async ({ page }) => {
  const errors = await openHouse(page);
  const bad = await page.evaluate(games => {
    const q = window.HouseQuests;
    const out = [];
    games.forEach(mech => {
      if (q.FAM_MECHS.indexOf(mech) < 0) out.push(mech + ' ไม่อยู่ใน FAM_MECHS');
      q.GRADES.forEach(g => {
        for (let seed = 0; seed < 4; seed++) {
          const run = q.testRun({ mech, gid: g.id, seed });
          const where = mech + '/' + g.id + '/' + seed;
          if (run.items.length < q.MIN_Q) out.push(where + ' ข้อน้อยกว่า MIN_Q');
          run.items.forEach(it => {
            if (it.kind === 'clock') {
              if (!it.clock || it.choices.length !== 4) out.push(where + ' โจทย์นาฬิกาไม่ครบ');
              if (it.correct < 0) out.push(where + ' ไม่มีคำตอบที่ถูกในตัวเลือก');
            } else if (it.kind === 'sort') {
              if (!it.tiles.length || !it.bins.length) out.push(where + ' กระดานว่าง');
              const ids = it.bins.map(b => b.id);
              it.tiles.forEach(t => {
                if (!it.basket && ids.indexOf(t.bin) < 0) out.push(where + ' ' + t.e + ' ไม่มีถังรองรับ');
              });
            } else out.push(where + ' kind แปลก: ' + it.kind);
          });
        }
      });
    });
    return out;
  }, ALL_GAMES);
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
});

test('เกมเรียงลำดับ: ทุกช่องมีของที่ถูกต้องหนึ่งชิ้นพอดี · ขั้นตอนที่ตัดสั้นลงยังเรียงถูก', async ({ page }) => {
  const errors = await openHouse(page);
  const bad = await page.evaluate(() => {
    const q = window.HouseQuests;
    const out = [];
    /* ⚠ `routine` ออกจากชุดนี้ 2026-08-16 — ไม่ใช่กระดานลากแล้ว (ข้อ 55) */
    ['cook'].forEach(mech => {
      q.GRADES.forEach(g => {
        for (let seed = 0; seed < 4; seed++) {
          q.testRun({ mech, gid: g.id, seed }).items.forEach(it => {
            const per = {};
            it.tiles.forEach(t => { per[t.bin] = (per[t.bin] | 0) + 1; });
            it.bins.forEach(b => {
              if (per[b.id] !== 1) out.push(mech + '/' + g.id + ' ช่อง ' + b.id + ' มี ' + (per[b.id] | 0) + ' ชิ้น');
            });
            if (it.tiles.length !== it.bins.length) out.push(mech + ' จำนวนของกับช่องไม่เท่ากัน');
            it.tiles.forEach(t => { if (!t.label) out.push(mech + ' ขั้นตอนไม่มีชื่อกำกับ'); });
          });
        }
      });
    });
    return out;
  });
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
});

/* 🗑️ เทส "เกมอาหารสัตว์" ถูกถอดออก 2026-08-16
   — กลไกนั้นเปลี่ยนเป็นงาน Action จริงในโลกแล้ว (ข้อ 55) เทสตัวใหม่อยู่ที่
   tests/house-action-ab.spec.js ซึ่งเทสของจริงในโลก ไม่ใช่กระดานในการ์ด */
test('เกมใช้เงินให้พอ: มีคำตอบที่เป็นไปได้เสมอ · เกินงบไม่ผ่าน · ครบและไม่เกินผ่าน', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const out = [];
    let checked = 0;
    q.GRADES.forEach(g => {
      for (let seed = 0; seed < 4; seed++) {
        const run = q.testRun({ mech: 'budget', gid: g.id, seed });
        run.items.forEach((it, i) => {
          const cheap = it.tiles.map(t => t.price).sort((a, b) => a - b)
                          .slice(0, it.need).reduce((a, b) => a + b, 0);
          if (cheap > it.budget) out.push(g.id + ' ข้อ ' + i + ' ถูกสุดยังเกินงบ = ไม่มีคำตอบ');
          checked++;
        });
      }
    });
    /* ลองตอบจริง 1 ชุด */
    const run = q.testRun({ mech: 'budget', seed: 3 });
    const it = run.items[0];
    const sorted = it.tiles.slice().sort((a, b) => a.price - b.price);
    const okPick = {}; sorted.slice(0, it.need).forEach(t => { okPick[t.k] = 'basket'; });
    const few = {}; sorted.slice(0, Math.max(1, it.need - 1)).forEach(t => { few[t.k] = 'basket'; });
    const over = {}; it.tiles.slice().sort((a, b) => b.price - a.price)
                       .slice(0, it.need).forEach(t => { over[t.k] = 'basket'; });
    const overSum = Object.keys(over).reduce((a, k) => a + it.tiles.find(t => t.k === k).price, 0);
    return { out, checked, few: q.submit(run, few).ok,
             over: overSum > it.budget ? q.submit(run, over).ok : false,
             good: q.submit(run, okPick).ok };
  });
  expect(r.out).toEqual([]);
  expect(r.checked).toBeGreaterThan(20);
  expect(r.few, 'เลือกไม่ครบจำนวนต้องยังไม่ผ่าน').toBe(false);
  expect(r.over, 'เกินงบต้องไม่ผ่าน').toBe(false);
  expect(r.good, 'ครบจำนวนและไม่เกินงบต้องผ่าน').toBe(true);
  expect(errors).toEqual([]);
});

/* 🗑️ เทส "เกมจำรายการของ" ถูกถอดออก 2026-08-16
   — กลไกนั้นเปลี่ยนเป็นงาน Action จริงในโลกแล้ว (ข้อ 55) เทสตัวใหม่อยู่ที่
   tests/house-action-ab.spec.js ซึ่งเทสของจริงในโลก ไม่ใช่กระดานในการ์ด */
test('เกมนาฬิกา: หน้าปัดวาดจริง · เข็มสั้นอยู่หน้าเข็มยาว · คำบอกเวลาตรงแบบเดียวกับเกมนาฬิกาวิเศษ', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'clock', title: '🧪 นาฬิกา' }));
  await expect(page.locator('.hqz-clock svg')).toBeVisible({ timeout: 8000 });
  const r = await page.evaluate(() => {
    const svg = document.querySelector('.hqz-clock svg');
    const lines = Array.from(svg.querySelectorAll('line'));
    const len = l => Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value,
                                l.y2.baseVal.value - l.y1.baseVal.value);
    const it = window.__houseDbg.qRun().items[0];
    return { lines: lines.length, lastIsShort: len(lines[lines.length - 1]) < len(lines[0]),
             txt: it.choices[it.correct], h: it.clock.h, m: it.clock.m };
  });
  expect(r.lines).toBe(2);
  expect(r.lastIsShort, 'เข็มสั้น (ชั่วโมง) ต้องวาดทีหลัง = อยู่หน้า').toBe(true);
  const want = r.m === 0 ? r.h + ' โมง' : (r.m === 30 ? r.h + ' โมงครึ่ง' : r.h + ' โมง ' + r.m + ' นาที');
  expect(r.txt).toBe(want);
  expect(errors).toEqual([]);
});

test('เล่นจนจบได้ทุกเกม · ได้ดาว · โหมดทดสอบไม่แตะข้อมูลเด็ก', async ({ page }) => {
  test.setTimeout(240000);
  const errors = await openHouse(page);
  const before = await page.evaluate(() => ({
    coins: window.OwlCoins.get(), left: window.HouseQuests.daySummary().left }));
  for (const mech of ALL_GAMES) {
    await page.evaluate(m => window.HouseQuestUI.playTest({ mech: m, title: '🧪 ' + m }), mech);
    await page.waitForTimeout(400);
    for (let i = 0; i < 14; i++) { if (!(await solveAny(page))) break; }
    await expect(page.locator('.hqz-stars'), 'เกม ' + mech + ' ต้องเล่นจบได้').toBeVisible({ timeout: 12000 });
    await page.locator('#hqz-close').click();
    await page.waitForTimeout(200);
  }
  const after = await page.evaluate(() => ({
    coins: window.OwlCoins.get(), left: window.HouseQuests.daySummary().left }));
  expect(after).toEqual(before);
  expect(errors).toEqual([]);
});

test('ท่าประจำของพ่อแม่: แต่ละกิจกรรมมีท่าของตัวเอง ไม่ใช่ท่าเดียวกันหมด', async ({ page }) => {
  const errors = await openHouse(page);
  const poses = await page.evaluate(() => {
    const P = window.__houseDbg.pose ? window.__houseDbg.pose() : null;
    if (!P) return null;
    return Object.keys(P).map(k => k + ':' + P[k].base + '/' + P[k].amp + '/' + P[k].spd + '/' + P[k].alt);
  });
  expect(poses, 'ต้องมีตารางท่าประจำ').not.toBe(null);
  expect(poses.length).toBeGreaterThanOrEqual(6);
  expect(new Set(poses.map(p => p.split(':')[1])).size, 'ท่าต้องไม่ซ้ำกันทุกกิจกรรม')
    .toBe(poses.length);
  expect(errors).toEqual([]);
});


/* ============================================================
   เควสต์ที่ต้อง "เดินไปทำนอกบ้าน" + กันโจทย์ซ้ำในรอบเดียว
   ============================================================ */

test('ไม่มีโจทย์ซ้ำภายในเควสต์เดียว — ทุกกลไก ทุกระดับชั้น', async ({ page }) => {
  const errors = await openHouse(page);
  const dup = await page.evaluate(() => {
    const q = window.HouseQuests;
    const out = [];
    q.FAM_MECHS.concat(['count']).forEach(mech => {
      q.GRADES.forEach(g => {
        for (let seed = 0; seed < 6; seed++) {
          const run = q.testRun({ mech, gid: g.id, seed });
          const seen = {};
          run.items.forEach((it, i) => {
            const sg = q.itemSig(it);
            if (seen[sg] != null) out.push(mech + '/' + g.id + '/seed' + seed
              + ' ข้อ ' + i + ' ซ้ำกับข้อ ' + seen[sg]);
            seen[sg] = i;
          });
        }
      });
    });
    return out;
  });
  expect(dup).toEqual([]);
  expect(errors).toEqual([]);
});

test('เควสต์เดิน: รับงานแล้วการ์ดต้องปิดให้เด็กเดินได้ · ยังไม่ถือว่าทำเสร็จ', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'market', title: '🧪 ตลาด' }));
  await expect(page.locator('#house-qz')).toBeVisible();
  const items = await page.evaluate(() => window.__houseDbg.qRun().items.map(i => i.kind));
  expect(items).toEqual(['walk', 'sort']);        /* เดินไปก่อน แล้วค่อยซื้อของ */

  await page.locator('#hqz-stage .hqz-yes').click();
  await expect(page.locator('#house-qz')).toBeHidden();          /* การ์ดต้องปิด ไม่งั้นเดินไม่ได้ */
  expect(await page.evaluate(() => window.__houseDbg.walkQuest())).toEqual({ target: 'market', idx: 0 });
  expect(errors).toEqual([]);
});

test('เควสต์ไปตลาด: พอถึงตลาดกระดานซื้อของเด้งขึ้นเอง · ซื้อครบแล้วจบงาน', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'market', title: '🧪 ตลาด' }));
  await expect(page.locator('#house-qz')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();
  await expect(page.locator('#house-qz')).toBeHidden();

  await page.evaluate(() => window.__houseDbg.tp(13, 59));       /* กลางตลาด */
  await expect(page.locator('.hqz-sort')).toBeVisible({ timeout: 10000 });
  expect(await page.evaluate(() => window.__houseDbg.walkQuest())).toBe(null);

  await page.evaluate(async src => {
    const drag = eval('(' + src + ')');
    const run = window.__houseDbg.qRun();
    const it = run.items[run.idx];
    const bin = document.querySelector('.hqz-bin');
    it.tiles.filter(t => t.want).forEach(w => {
      const el = Array.from(document.querySelectorAll('.hqz-tray .hqz-tile'))
                   .find(t => t.dataset.k === w.k);
      if (el) drag(el, bin);
    });
    await new Promise(r => setTimeout(r, 60));
    Array.from(document.querySelectorAll('#hqz-stage .hqz-yes')).pop().click();
  }, DRAG_FN);
  await expect(page.locator('.hqz-stars')).toBeVisible({ timeout: 10000 });
  expect(errors).toEqual([]);
});

test('เควสต์กินข้าวพร้อมหน้า: นั่งโต๊ะ/เก้าอี้ในบ้านแล้วจบงาน', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => window.__houseDbg.enterHouse());
  await page.waitForFunction(() => window.__houseDbg.scene() === 'in', null, { timeout: 15000 });
  await page.waitForTimeout(800);

  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'dinner', title: '🧪 กินข้าว' }));
  await expect(page.locator('#house-qz')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();
  await expect(page.locator('#house-qz')).toBeHidden();
  expect(await page.evaluate(() => window.__houseDbg.walkQuest())).toEqual({ target: 'table', idx: 0 });

  expect(await page.evaluate(() => window.__houseDbg.sitIndoor()), 'บ้านต้องมีที่นั่งให้ไปนั่ง').toBe(true);
  await expect(page.locator('.hqz-stars')).toBeVisible({ timeout: 20000 });
  expect(await page.evaluate(() => window.__houseDbg.walkQuest())).toBe(null);
  expect(errors).toEqual([]);
});

test('เควสต์ไปนั่งโต๊ะจะไม่ถูกแจกถ้าบ้านยังไม่มีโต๊ะ/เก้าอี้ (ห้ามมี dead end)', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    /* ⚠ เขียน localStorage ตรงๆ ไม่ได้ผล — js/house.js เก็บข้อมูลบ้านไว้ในหน่วยความจำด้วย
       ⇒ ทดสอบกติกาที่เอนจินโดยตรง โดยสร้าง engine อีกตัวที่บอกว่า "บ้านไม่มีที่นั่ง" */
    const q2 = window.HOUSE_QUESTS({ load: () => ({}), save: () => {},
                                     childId: () => 'x', gradeId: () => 'p3',
                                     dayKey: () => '2026-1-1', hasIndoorSeat: () => false });
    const q3 = window.HOUSE_QUESTS({ load: () => ({}), save: () => {},
                                     childId: () => 'x', gradeId: () => 'p3',
                                     dayKey: () => '2026-1-1', hasIndoorSeat: () => true });
    /* สุ่มวันจริงๆ หลายวัน: วันที่บ้านไม่มีที่นั่ง ต้องไม่เคยได้กลไก dinner เลย */
    let picked = false;
    for (let d = 1; d <= 60; d++) {
      const eng = window.HOUSE_QUESTS({ load: () => ({}), save: () => {},
                                        childId: () => 'kid', gradeId: () => 'p3',
                                        dayKey: () => '2026-3-' + d, hasIndoorSeat: () => false });
      eng.sync();
      const sp = eng.specForFamily();
      if (sp && sp.mech === 'dinner') picked = true;
    }
    return { noSeat: q2.famMechOk('dinner'), withSeat: q3.famMechOk('dinner'),
             real: window.HouseQuests.famMechOk('dinner'), picked };
  });
  expect(r.noSeat, 'บ้านไม่มีที่นั่ง = ต้องไม่แจกเควสต์นี้').toBe(false);
  expect(r.withSeat).toBe(true);
  expect(r.real, 'ชุดเฟอร์นิเจอร์เริ่มต้นต้องมีโต๊ะหรือเก้าอี้ในบ้าน').toBe(true);
  expect(r.picked, 'สุ่ม 60 วันแล้วต้องไม่มีวันไหนได้เควสต์ที่เล่นไม่ได้เลย').toBe(false);
  expect(errors).toEqual([]);
});

test('เควสต์เดินไม่เข้ากติกาขั้นต่ำ 5 ข้อ แต่ยังต้องเล่นจบและได้ดาวตามปกติ', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(games => {
    const q = window.HouseQuests;
    const out = {};
    games.forEach(m => {
      const run = q.testRun({ mech: m, seed: 2 });
      out[m] = { n: run.items.length, first: run.items[0].kind, walk: !!q.MECHS[m].walk,
                 stars: q.starsOf(run) };
    });
    return out;
  }, WALK_GAMES);
  expect(r.dinner.n).toBe(1);
  expect(r.market.n).toBe(2);
  Object.keys(r).forEach(m => {
    expect(r[m].walk, m + ' ต้องถูกทำเครื่องหมายว่าเป็นงานเดิน').toBe(true);
    expect(r[m].first).toBe('walk');
    expect(r[m].stars).toBe(3);          /* ยังคิดดาวได้ปกติ */
  });
  expect(errors).toEqual([]);
});

test('จำนวนโจทย์ต่อเควสต์: ตามตาราง qN ของทรงนั้น · เปิดใหม่ได้ชุดเดิม', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    /* ⚠ **2 กลุ่มนี้ไม่เข้ากติกา 5-10 ข้อโดยตั้งใจ** (ห้ามเอามานับรวม):
         - กลุ่ม engine (เฟส 5): 1 เควสต์ = 1 รอบเกม 10 ด่านของ engine เดิม
         - งานเดิน (เฟส 4B/7): "ไปให้ถึงแล้วทำ" ชิ้นเดียวจบ — dinner/market/deliver/findhidden
           (ผู้ใช้อนุมัติข้อยกเว้นนี้ตั้งแต่ 2026-08-10 · กติกา 5 ข้อใช้กับเกมที่เปิด popup ให้ตอบเท่านั้น) */
    const eng = q.ENGINE_MECHS;
    const oneShot = sp => eng.indexOf(sp.mech) >= 0 || !!(q.MECHS[sp.mech] && q.MECHS[sp.mech].walk);
    const ns = [];
    const specs = [];
    q.state().npcIds.forEach(id => { const sp = q.specForNpc(id); if (sp) specs.push(sp); });
    for (let i = 0; i < q.BOARD_N; i++) { const sp = q.specForBoard(i); if (sp) specs.push(sp); }
    specs.filter(sp => !oneShot(sp))
         .forEach(sp => ns.push(q.buildRun(sp).items.length));
    /* เปิดเควสต์เดิมซ้ำต้องได้จำนวนข้อเท่าเดิม (seed คงที่) */
    const sp0 = specs.filter(sp => !oneShot(sp))[0];
    const again = sp0 ? [q.buildRun(sp0).items.length, q.buildRun(sp0).items.length] : [1, 1];
    const engNs = specs.filter(sp => eng.indexOf(sp.mech) >= 0)
                       .map(sp => q.buildRun(sp).items.length);
    const byShape = specs.filter(sp => !oneShot(sp))
      .map(sp => ({mech: sp.mech, shape: q.mechShape(sp.mech), n: q.buildRun(sp).items.length}));
    return { ns, engNs, again, byShape };
  });
  /* ⚠️ **กติกาเปลี่ยนแล้วท้ายเฟส 11 (ข้อ 45.4)** — เดิม "สุ่ม 5-10 ข้อ ไม่เท่ากันทุกเควสต์"
     (มติ 2026-08-10) ถูกทับด้วยตาราง `qN` ตายตัวตามทรงของกลไก: **การ์ด 9-12 · ลาก 6-8 ตามชั้น**
     เหตุผล: การสุ่มทำให้เควสต์เดียวกันบางวัน 80 วิ บางวัน 160 วิ ⇒ คุมงบเวลา 150-240 วิ/ชุดไม่ได้เลย
     ⇒ เทสนี้เปลี่ยนจาก "ต้องไม่เท่ากัน" เป็น "ต้องตรงตารางของทรงนั้น" **ห้ามลบเทสทิ้ง** */
  r.ns.forEach(n => {
    expect(n).toBeGreaterThanOrEqual(6);     /* ทรงลากน้อยสุด 6 ข้อ */
    expect(n).toBeLessThanOrEqual(12);       /* ทรงการ์ดมากสุด 12 ข้อ */
  });
  /* กลุ่ม engine = ก้อนเดียวเสมอ (หน้าจอจะ mount เกมยาว 10 ด่านของหน้าหลักลงไปในนั้น) */
  r.engNs.forEach(n => expect(n).toBe(1));
  /* ทุกชุดต้องยาวตรงตารางของทรงตัวเอง (ยอมสั้นกว่าได้ถ้า uniqueRun ตัดโจทย์ซ้ำจนคลังหมด) */
  const want = await page.evaluate(() => {
    const q = window.HouseQuests, t = q.difficulty().tier;
    return { card: q.qNFor(t, 'card'), drag: q.qNFor(t, 'drag'), minQ: q.MIN_Q };
  });
  r.byShape.forEach(x => {
    const cap = x.shape === 'drag' ? want.drag : want.card;
    expect(x.n, x.mech + ' (' + x.shape + ')').toBeLessThanOrEqual(cap);
    expect(x.n, x.mech + ' (' + x.shape + ')').toBeGreaterThanOrEqual(want.minQ);
  });
  expect(r.again[0]).toBe(r.again[1]);
  expect(errors).toEqual([]);
});

test('จำนวนข้อไม่มีผลกับเงิน — เควสต์ 5 ข้อกับ 10 ข้อได้เท่ากันเป๊ะ', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const out = {};
    ['A', 'board', 'family'].forEach(fam => {
      out[fam] = [1, 2, 3].map(st => q.coinsFor(fam, st, 1, false));
    });
    /* เล่นจริง 2 เควสต์ที่ยาวไม่เท่ากัน แล้วเทียบเงินที่ควรได้ */
    const runs = q.state().npcIds.map(id => q.buildRun(q.specForNpc(id)));
    const byLen = {};
    runs.forEach(run => {
      run.items.forEach(() => {});
      byLen[run.items.length] = q.coinsFor(run.spec.fam, 3, run.diff.tier, false);
    });
    return { out, byLen };
  });
  /* ทุกความยาวของเควสต์ NPC ต้องให้เงินเท่ากันหมดที่ดาวเท่ากัน */
  const vals = Object.keys(r.byLen).map(k => r.byLen[k]);
  expect(new Set(vals).size, 'เควสต์ยาวไม่เท่ากันต้องได้เงินเท่ากัน').toBe(1);
  expect(r.out.A).toEqual([6, 8, 10]);
  expect(r.out.board).toEqual([8, 10, 13]);
  expect(r.out.family).toEqual([10, 13, 16]);
  expect(errors).toEqual([]);
});

test('ความยากไล่ระดับภายในเควสต์ — ครึ่งหลังยากกว่าครึ่งแรกโดยเฉลี่ย', async ({ page }) => {
  const errors = await openHouse(page);
  /* ⚠ วัดเป็น "ค่าเฉลี่ยครึ่งแรก vs ครึ่งหลัง" ไม่ใช่เทียบข้อต่อข้อ — เนื้อโจทย์ยังสุ่มอยู่
     ข้อเดี่ยวๆ จึงแกว่งได้ตามธรรมชาติ แต่ภาพรวมต้องไล่ขึ้นเสมอ */
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const half = (arr, fn) => {
      const h = Math.floor(arr.length / 2);
      const avg = xs => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
      return [avg(arr.slice(0, h).map(fn)), avg(arr.slice(-h).map(fn))];
    };
    const acc = {};
    const add = (k, lo, hi) => { acc[k] = acc[k] || [0, 0]; acc[k][0] += lo; acc[k][1] += hi; };
    q.GRADES.forEach(g => {
      for (let seed = 0; seed < 25; seed++) {
        const c = q.testRun({ mech: 'count', gid: g.id, seed });
        const [a, b] = half(c.items, it => Array.from(it.show || '').length);
        add('count', a, b);
        const t = q.testRun({ mech: 'tidy', gid: g.id, seed });
        const [c1, c2] = half(t.items, it => it.tiles.length);
        add('tidy', c1, c2);
        const k = q.testRun({ mech: 'cook', gid: g.id, seed });
        const [d1, d2] = half(k.items, it => it.tiles.length);
        add('cook', d1, d2);
      }
    });
    return acc;
  });
  Object.keys(r).forEach(k => {
    expect(r[k][1], k + ': ครึ่งหลังต้องยากกว่าครึ่งแรก (' + r[k].join(' → ') + ')')
      .toBeGreaterThan(r[k][0]);
  });
  expect(errors).toEqual([]);
});

test('คลังโจทย์จากเกมหน้าหลักถูกนำมาใช้จริง (ORDER_SETS + EF_CATEGORIES)', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    /* จัดหมวดของ: ชื่อถังต้องมาจาก EF_CATEGORIES ของหน้าหลักจริงๆ */
    const cat = q.testRun({ mech: 'sortcat', gid: 'p3', seed: 1 });
    const names = Object.keys(EF_CATEGORIES).map(k => EF_CATEGORIES[k].name);
    const binNames = cat.items[0].bins.map(b => b.name);
    /* เรียงลำดับตามหลักสูตร: ป.5 ต้องดึงจาก ORDER_SETS ได้ · ป.1 ไม่มีคลังจึงต้องไม่ถูกแจก */
    const p5 = q.testRun({ mech: 'orderlearn', gid: 'p5', seed: 1 });
    const prompts = ORDER_SETS.filter(o => o.tag === 'p5').map(o => o.prompt);
    return {
      binOk: binNames.every(n => names.indexOf(n) >= 0), binNames,
      p5q: p5.items.map(it => it.q), p5Ok: p5.items.some(it => prompts.indexOf(it.q) >= 0),
      hasSets: prompts.length,
    };
  });
  expect(r.hasSets).toBeGreaterThan(3);
  expect(r.binOk, 'ถังของเกมจัดหมวดต้องมาจาก EF_CATEGORIES ของหน้าหลัก: ' + r.binNames).toBe(true);
  expect(r.p5Ok, 'เกมเรียงลำดับ ป.5 ต้องดึงโจทย์จาก ORDER_SETS ของหน้าหลัก').toBe(true);
  expect(errors).toEqual([]);
});
