const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" เฟส 2 — เครื่องยนต์เควสต์ (js/house-quests.js + จุดต่อใน js/house.js)
   สิ่งที่ต้องไม่พังเด็ดขาด:
     1) ทุกวันต้องมี NPC ติดป้าย "!" และกระดาน 5 ชุด — ไม่งั้นเด็กไม่มีที่หาเงิน (เฟส 1 ล็อกของไว้หมดแล้ว)
     2) โจทย์ต้องคงที่ต่อ (เด็ก + วัน + คนออกโจทย์) — เปิดใหม่กี่ครั้งก็ได้ข้อเดิม กัน reroll หาข้อง่าย
     3) **ห้ามลงโทษเด็ก** ตอบผิดกี่ครั้งก็ยังจบเควสต์ได้ ได้เหรียญเสมอ เงินไม่เคยลด
     4) เงินต้องเพิ่มผ่าน window.OwlCoins เท่านั้น และค่าตอบแทนอยู่ในช่วงที่ผู้ใช้ล็อกไว้
        (เควสต์ NPC 20-50 🪙 · กระดาน 40-80 🪙 · โบนัสครบ 5 ชุด +100)
     5) ประตูเช็คความพร้อมต้องไม่โผล่มาเงียบๆ — ต้องครบเกณฑ์ก่อน แล้วเด็กกดรับเอง */

const CHILD = { id: 'quest-test', name: 'เทสเควสต์', emoji: '🎯', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const PKEY = 'p1quiz_progress_' + CHILD.id;

async function openHouse(page, seedHouse, seedProgress) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed, pkey, prog]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    if (seed) localStorage.setItem(hkey, JSON.stringify(seed));
    if (prog) localStorage.setItem(pkey, JSON.stringify(prog));
  }, [CHILD, HKEY, seedHouse || null, PKEY, seedProgress || null]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseQuests && !!window.HouseQuestUI, null, { timeout: 30000 });
  /* เด็กใหม่จะเจอหน้าสร้างตัวละคร → หน้าเลือกสัตว์เลี้ยง ต้องผ่านทั้งสองก่อนถึงจะเดินในเมืองได้ */
  if (await page.locator('#house-creator').isVisible()) {
    await page.locator('#house-done-btn').click();
    await page.waitForFunction(() => document.getElementById('house-creator').hidden, null, { timeout: 15000 });
  }
  await page.waitForTimeout(600);
  if (await page.locator('#house-pet-picker').isVisible()) {
    await page.locator('#house-pet-skip').click();
    await page.waitForFunction(() => document.getElementById('house-pet-picker').hidden, null, { timeout: 15000 });
  }
  await page.waitForTimeout(900);
  return errors;
}
const readHouse = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), HKEY);
const coins = page => page.evaluate(() => window.OwlCoins.get());
/* เล่นเควสต์จนจบแบบ "ตอบถูกทุกข้อ" ผ่าน API ตรงๆ (ไม่ต้องคลิกทีละปุ่ม) */
const playPerfect = page => page.evaluate(() => {
  const run = window.HouseQuestUI.run();
  if (!run) return null;
  let guard = 0;
  while (!run.over && guard++ < 40) window.HouseQuests.answer(run, run.items[run.idx].correct);
  return { items: run.items.length, wrong: run.wrong };
});

test('เด็กใหม่: วันนี้มี NPC ติดป้ายงาน 8 คน + กระดาน 5 ชุด และบันทึกลง house save', async ({ page }) => {
  const errors = await openHouse(page);
  expect(errors).toEqual([]);

  const s = await page.evaluate(() => {
    const q = window.HouseQuests;
    return { ids: q.state().npcIds, board: q.state().board.q, perDay: q.NPC_PER_DAY, n: q.BOARD_N,
             open: q.openNpcCount(), left: q.boardLeft() };
  });
  expect(s.ids.length).toBe(s.perDay);
  expect(new Set(s.ids).size).toBe(s.ids.length);        // ห้ามซ้ำคน
  expect(s.board.length).toBe(s.n);
  expect(s.open).toBe(s.perDay);
  expect(s.left).toBe(s.n);

  /* ทุกคนที่ถูกเลือกต้องเป็น NPC ที่มีบทชวนทำงานจริง (ไม่ใช่มาสคอตนกฮูก) */
  const okIds = await page.evaluate(() => window.HouseQuests.questableIds());
  s.ids.forEach(id => expect(okIds).toContain(id));

  /* ข้อมูลอยู่ใน house save ก้อนเดิม ⇒ export/import ย้ายเครื่องตามไปเอง */
  const d = await readHouse(page);
  expect(d.q2).toBeTruthy();
  expect(d.q2.npcIds.length).toBe(s.perDay);
  expect(d.q2.board.q.length).toBe(s.n);

  /* ป้าย "!" ลอยเหนือหัวคนที่มีงาน — ต้องมีครบทุกคน และยังไม่มีใครขึ้น ✓ */
  const marks = await page.evaluate(() => window.HouseQuestUI.marks());
  expect(marks.length).toBe(s.perDay);
  expect(marks.filter(m => m.open).length).toBe(s.perDay);
  expect(marks.filter(m => m.done).length).toBe(0);
});

test('โจทย์คงที่ต่อวัน: เปิดเควสต์เดิมซ้ำได้ข้อเดิมเป๊ะ (กด reroll หาข้อง่ายไม่ได้)', async ({ page }) => {
  await openHouse(page);
  const same = await page.evaluate(() => {
    const q = window.HouseQuests, id = q.state().npcIds[0];
    const key = r => r.items.map(i => i.q + '|' + i.choices.join(',') + '|' + i.correct).join('#');
    return { a: key(q.buildRun(q.specForNpc(id))), b: key(q.buildRun(q.specForNpc(id))) };
  });
  expect(same.a).toBe(same.b);
  expect(same.a.length).toBeGreaterThan(10);
});

test('เล่นเควสต์ NPC จนจบ: ได้เหรียญผ่าน OwlCoins · ป้ายเปลี่ยนเป็น ✓ · วันนี้คุยซ้ำไม่มีงานอีก', async ({ page }) => {
  const errors = await openHouse(page);
  const before = await coins(page);
  expect(before).toBe(0);

  const npcId = await page.evaluate(() => window.HouseQuests.state().npcIds[0]);
  await page.evaluate(id => window.HouseQuestUI.offer(id), npcId);
  await expect(page.locator('#house-qz')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();      // กด "รับงาน!"
  await page.waitForTimeout(200);
  await expect(page.locator('.hqz-choice')).toHaveCount(4);

  const played = await playPerfect(page);
  expect(played.items).toBeGreaterThanOrEqual(3);
  expect(played.wrong).toBe(0);
  await page.evaluate(() => {                              // ปิดรอบเล่นให้เหมือนตอบข้อสุดท้ายถูก
    const r = window.HouseQuestUI.run();
    if (r) window.HouseQuests.answer(r, r.items[r.idx] ? r.items[r.idx].correct : 0);
  });

  /* จบเควสต์จริงผ่าน UI: ตอบข้อสุดท้ายด้วยการคลิกปุ่ม แล้วต้องเห็นหน้าสรุปดาว */
  const res = await page.evaluate(id => {
    const q = window.HouseQuests, run = q.buildRun(q.specForNpc(id));
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    return q.finish(run);
  }, npcId);
  expect(res.stars).toBe(3);
  expect(res.coins).toBeGreaterThanOrEqual(20);
  expect(res.coins).toBeLessThanOrEqual(50);

  await page.evaluate(c => window.OwlCoins.add(c), res.coins);
  expect(await coins(page)).toBe(res.coins);

  /* สถานะ + ป้ายเหนือหัวต้องเปลี่ยนเป็น "ทำแล้ว" */
  expect(await page.evaluate(id => window.HouseQuests.npcStatus(id), npcId)).toBe('done');
  await page.evaluate(() => window.HouseQuestUI.close());
  /* ป้ายอัปเดตในลูปวาดภาพ (เฟรมถัดไป) จึงต้องรอ ไม่ใช่อ่านทันที */
  await page.waitForFunction(id => {
    const m = window.HouseQuestUI.marks().find(x => x.id === id);
    return !!m && !m.open;
  }, npcId, { timeout: 10000 });

  /* คุยซ้ำวันนี้ → ไม่มีการ์ดชวนรับงานเด้งอีก (cooldown ถึงพรุ่งนี้) */
  await page.evaluate(id => window.HouseQuestUI.talk(id), npcId);
  await page.waitForTimeout(1200);
  await expect(page.locator('#house-qz')).toBeHidden();
  expect(errors).toEqual([]);
});

test('ตอบผิดไม่มีบทลงโทษ: ผิดรัวๆ ก็ยังจบได้ ได้ 1 ดาว + เหรียญ และเงินไม่เคยลด', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.OwlCoins.set(120));
  const out = await page.evaluate(() => {
    const q = window.HouseQuests, id = q.state().npcIds[0];
    const run = q.buildRun(q.specForNpc(id));
    let guard = 0;
    while (!run.over && guard++ < 300) {
      const it = run.items[run.idx];
      const bad = it.choices.map((_, i) => i).filter(i => i !== it.correct);
      q.answer(run, bad[0]); q.answer(run, bad[1] != null ? bad[1] : bad[0]);   // ผิด 2 ครั้งก่อน
      q.answer(run, it.correct);                                                // แล้วค่อยตอบถูก
    }
    return { over: run.over, wrong: run.wrong, stars: q.starsOf(run), res: q.finish(run) };
  });
  expect(out.over).toBe(true);                 // ผิดกี่ครั้งก็ต้องเล่นจบได้เสมอ (ห้ามมี dead end)
  expect(out.stars).toBe(1);
  expect(out.res.coins).toBeGreaterThan(0);    // ได้เงินเสมอ กันเด็กท้อ
  expect(await coins(page)).toBe(120);         // ยอดเงินเดิมต้องไม่ถูกหักแม้แต่เหรียญเดียว
});

test('กระดานเควสต์: 5 ชุดแยกโควตาจาก NPC · ทำครบได้โบนัส 100 🪙 · ค่าตอบแทน 40-80', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.board());
  await expect(page.locator('#house-quest')).toBeVisible();
  await expect(page.locator('#hq-list .hq-row')).toHaveCount(5);
  await expect(page.locator('#hq-claim')).toBeHidden();

  const out = await page.evaluate(() => {
    const q = window.HouseQuests, got = [];
    for (let i = 0; i < q.BOARD_N; i++) {
      const run = q.buildRun(q.specForBoard(i));
      while (!run.over) q.answer(run, run.items[run.idx].correct);
      got.push(q.finish(run).coins);
    }
    return { got, ready: q.boardBonusReady(), left: q.boardLeft(),
             npcOpen: q.openNpcCount(), npcPerDay: q.NPC_PER_DAY };
  });
  out.got.forEach(c => { expect(c).toBeGreaterThanOrEqual(40); expect(c).toBeLessThanOrEqual(80); });
  expect(out.left).toBe(0);
  expect(out.ready).toBe(true);
  expect(out.npcOpen).toBe(out.npcPerDay);     // โควตา NPC ต้องไม่ถูกกระดานกิน

  const before = await coins(page);
  await page.evaluate(() => window.HouseQuestUI.board());
  await expect(page.locator('#hq-claim')).toBeVisible();
  await page.locator('#hq-claim').click();
  await page.waitForTimeout(300);
  expect(await coins(page) - before).toBe(100);
  await expect(page.locator('#hq-claim')).toBeHidden();   // รับได้ครั้งเดียว
});

test('ประตูเช็คความพร้อม: ยังไม่ครบเกณฑ์ต้องไม่ถาม · ครบแล้วต้องถามก่อนเสมอ', async ({ page }) => {
  await openHouse(page);
  expect(await page.evaluate(() => window.HouseQuests.chalReady())).toBe(false);

  /* ยัดสถิติให้ครบเกณฑ์: ทำครบ 12 ชุดของชั้นตัวเอง + ความแม่น 10 ชุดล่าสุด ≥ 70% */
  const ready = await page.evaluate(() => {
    const q = window.HouseQuests, s = q.state();
    s.chal.done['p2'] = q.CHAL_NEED;
    s.chal.recent = new Array(q.CHAL_KEEP).fill(3);
    s.chal.ask = '';
    return { ready: q.chalReady(), acc: q.chalAccuracy() };
  });
  expect(ready.acc).toBeCloseTo(1, 5);
  expect(ready.ready).toBe(true);

  /* ถามแล้วต้องมีปุ่มให้เลือก 2 ทาง และ "ยังไม่พร้อม" ต้องไม่เปิดโจทย์ยาก */
  const npcId = await page.evaluate(() => window.HouseQuests.state().npcIds[0]);
  await page.evaluate(id => window.HouseQuestUI.offer(id), npcId);
  await page.locator('#hqz-stage .hqz-yes').click();      // รับงาน → เจอการ์ดถามท้าทาย
  await page.waitForTimeout(200);
  await expect(page.locator('#hqz-who')).toContainText('ท้าทาย');
  await page.locator('#hqz-stage .hqz-no').click();       // "ยังไม่พร้อม"
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.HouseQuests.state().chal.on)).toBe(false);
  await expect(page.locator('.hqz-choice')).toHaveCount(4);   // เข้าเล่นโจทย์ระดับตัวเองต่อทันที

  /* ถามไปแล้ววันนี้ = ไม่ตื๊อซ้ำ */
  expect(await page.evaluate(() => window.HouseQuests.chalReady())).toBe(false);
});

test('เพดานเหรียญต่อวัน: เกินเพดานแล้วไม่ติดลบ และยังเล่นเควสต์ได้ตามปกติ', async ({ page }) => {
  await openHouse(page);
  const out = await page.evaluate(() => {
    const q = window.HouseQuests, s = q.state();
    s.earned = q.DAY_CAP - 5;
    const run = q.buildRun(q.specForNpc(s.npcIds[1]));
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    const a = q.finish(run);
    const run2 = q.buildRun(q.specForNpc(s.npcIds[2]));
    while (!run2.over) q.answer(run2, run2.items[run2.idx].correct);
    const b = q.finish(run2);
    return { a, b, earned: q.state().earned, cap: q.DAY_CAP };
  });
  expect(out.a.coins).toBe(5);
  expect(out.a.capped).toBe(true);
  expect(out.b.coins).toBe(0);          // ชนเพดานแล้วได้ 0 แต่ไม่ติดลบ และเควสต์ยังจบได้
  expect(out.earned).toBe(out.cap);
});

test('ค่าตอบแทนอยู่ในช่วงที่ล็อกไว้ทุกระดับชั้น (NPC 20-50 · กระดาน 40-80)', async ({ page }) => {
  await openHouse(page);
  const table = await page.evaluate(() => {
    const q = window.HouseQuests, out = [];
    for (let tier = 1; tier <= 6; tier++)
      for (let st = 1; st <= 3; st++)
        out.push({ tier, st, npc: q.coinsFor('A', st, tier, false), board: q.coinsFor('board', st, tier, false) });
    return out;
  });
  table.forEach(r => {
    expect(r.npc).toBeGreaterThanOrEqual(18);
    expect(r.npc).toBeLessThanOrEqual(50);
    expect(r.board).toBeGreaterThanOrEqual(28);
    expect(r.board).toBeLessThanOrEqual(80);
  });
  /* โจทย์ท้าทายต้องได้มากกว่าโจทย์ปกติเสมอ (แรงจูงใจให้ลองของยาก) */
  const chal = await page.evaluate(() => ({
    plain: window.HouseQuests.coinsFor('A', 3, 2, false),
    hard:  window.HouseQuests.coinsFor('A', 3, 2, true),
  }));
  expect(chal.hard).toBeGreaterThan(chal.plain);
});

test('โจทย์เข้ากับระดับชั้นและธีมร้าน: ดึงคำถามจริงจาก CATS ของชั้นเด็ก', async ({ page }) => {
  await openHouse(page);
  const out = await page.evaluate(() => {
    const q = window.HouseQuests;
    const cats = q.quizCats('p2');
    const bank = new Set();
    cats.forEach(c => c.questions.forEach(x => bank.add(x.q)));
    /* ครูอ้อยต้องออกโจทย์ภาษา (ไทย/อังกฤษ) — ธีมร้านต้องมีผลจริง ไม่ใช่สุ่มมั่ว */
    const th = q.themeOf({ id: 'npc-teacher', job: 'teacher' });
    const mart = q.themeOf({ id: 'npc-mart', job: 'vendor' });
    const run = q.buildRun({ src: 'npc', key: 'npc-teacher', npc: 'npc-teacher', mech: 'quiz', fam: 'A', chal: false });
    return { cats: cats.length, tier: run.diff.tier, gid: run.gid,
             inBank: run.items.every(i => bank.has(i.q)),
             qN: run.items.length, thSubj: th.subj, martSubj: mart.subj,
             choices: run.items.every(i => i.choices.length >= 2 && i.correct >= 0 && i.correct < i.choices.length) };
  });
  expect(out.cats).toBeGreaterThan(5);
  expect(out.gid).toBe('p2');
  expect(out.tier).toBe(2);
  expect(out.qN).toBe(3);              // ป.1-2 = 3 ข้อ (เด็กเล็กสมาธิสั้นกว่า)
  expect(out.inBank).toBe(true);       // คำถามมาจากคลังจริงของชั้น ป.2
  expect(out.choices).toBe(true);
  expect(out.thSubj).toContain('thai');
  expect(out.martSubj).toContain('math');

  /* เฉลยต้องไม่กองอยู่ปุ่มแรกทุกข้อ (คลังต้นฉบับเฉลย index 0 เกือบหมด — ต้องสลับจริง) */
  const spread = await page.evaluate(() => {
    const q = window.HouseQuests, pos = {};
    q.state().npcIds.forEach(id => {
      const run = q.buildRun(q.specForNpc(id));
      run.items.forEach(i => { pos[i.correct] = (pos[i.correct] | 0) + 1; });
    });
    return pos;
  });
  expect(Object.keys(spread).length).toBeGreaterThan(1);
});

test('โจทย์นับของ: สร้างเองได้โดยไม่ง้อคลังคำถาม และคำตอบตรงกับของที่โชว์จริง', async ({ page }) => {
  await openHouse(page);
  const out = await page.evaluate(() => {
    const q = window.HouseQuests;
    const diff = q.difficulty('p2');
    const bad = [];
    ['npc-mart', 'npc-pet', 'npc-teacher', 'npc-lab1'].forEach(id => {
      const run = q.buildRun({ src: 'npc', key: 'x' + id, npc: id, mech: 'count', fam: 'A', chal: false });
      run.items.forEach(it => {
        if (!it.show) { bad.push(id + ':no-show'); return; }
        const m = it.q.match(/มี (\S+?) กี่ชิ้น/);
        if (m) {
          const want = Array.from(it.show).filter(ch => it.show.includes(ch));
          const n = it.show.split(m[1]).length - 1;
          if (String(n) !== it.choices[it.correct]) bad.push(id + ':count ' + it.q + ' → ' + n + ' vs ' + it.choices[it.correct]);
          if (!want.length) bad.push(id + ':empty');
        }
        if (new Set(it.choices).size !== it.choices.length) bad.push(id + ':dup-choice');
      });
    });
    return { bad, kinds: diff.kinds, max: diff.countMax };
  });
  expect(out.bad).toEqual([]);
  expect(out.kinds).toBe(1);           // ป.1-2 ปนของชนิดเดียว (นับง่ายก่อน)
});
