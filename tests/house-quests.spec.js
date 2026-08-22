const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" เฟส 2 — เครื่องยนต์เควสต์ (js/house-quests.js + จุดต่อใน js/house.js)
   สิ่งที่ต้องไม่พังเด็ดขาด:
     1) ทุกวันต้องมี NPC ติดป้าย "!" และกระดาน 5 ชุด — ไม่งั้นเด็กไม่มีที่หาเงิน (เฟส 1 ล็อกของไว้หมดแล้ว)
     2) โจทย์ต้องคงที่ต่อ (เด็ก + วัน + คนออกโจทย์) — เปิดใหม่กี่ครั้งก็ได้ข้อเดิม กัน reroll หาข้อง่าย
     3) **ห้ามลงโทษเด็ก** ตอบผิดกี่ครั้งก็ยังจบเควสต์ได้ ได้เหรียญเสมอ เงินไม่เคยลด
     4) เงินต้องเพิ่มผ่าน window.OwlCoins เท่านั้น และค่าตอบแทนอยู่ในช่วงที่จูนไว้
        (จูนลง ~3 เท่าเมื่อ 2026-08-08 กันเงินเฟ้อ: เควสต์ NPC 6-17 🪙 · กระดาน 10-28 🪙
         · **โบนัสครบ 5 ชุดถูกเอาออกแล้ว 2026-08-09** ห้ามใส่กลับโดยไม่ถามผู้ใช้)
        **เทสนี้คือตัวคุมไม่ให้ใครปรับรางวัลขึ้นกลับโดยไม่ตั้งใจ** — เศรษฐกิจทั้งเกมผูกกับตัวเลขชุดนี้
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
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
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
  if (await page.locator('#house-pet-picker').isVisible()) {
    await page.locator('#house-pet-skip').click();
    await page.waitForFunction(() => document.getElementById('house-pet-picker').hidden, null, { timeout: 15000 });
  }
  /* ⚠ ห้ามใช้ waitForTimeout เดาเวลาตรงนี้ — offerQuest()/SHOP.open() ใน js/house.js **ออกเงียบๆ**
     ถ้ายังไม่อยู่โหมด 'world' (ไม่ error ไม่มีอะไรขึ้นจอ) พอเครื่องช้าตอนรันทั้งชุด การ์ดเควสต์
     จะไม่โผล่ แล้วเทสไปตายที่ expect(...).toBeVisible() ครบ 10 วินาทีแทน — เจอมาแล้ว 2026-08-09 */
  await page.waitForFunction(
    () => window.__houseDbg && window.__houseDbg.mode() === 'world' && !window.__houseDbg.editing(),
    null, { timeout: 30000 });
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

/* 🎴 หา NPC ที่วันนี้แจก "งานทรงการ์ด 4 ตัวเลือก" จริงๆ
   ⚠ **ห้ามใช้ `npcIds[0]` ตรงๆ ในเทสที่ต้องกดตัวเลือก** — ตั้งแต่มีงาน Action จริง
     (ตกปลา/เก็บของ/รดน้ำ/ถ่ายรูป) กับกลไกจ่ายเงินแบบวางเหรียญ คนแรกในลิสต์อาจได้งาน
     ที่ไม่มีปุ่มตัวเลือกเลย แล้วเทสจะแดงแบบสุ่มตามวันที่ ทั้งที่โค้ดไม่ผิด (เจอจริง 2026-08-17) */
async function cardNpc(page) {
  return page.evaluate(() => {
    const q = window.HouseQuests, s = q.state();
    return s.npcIds.find(id => {
      const sp = q.specForNpc(id);
      return sp && !sp.done && q.mechShape(sp.mech) === 'card';
    }) || null;
  });
}

test('เล่นเควสต์ NPC จนจบ: ได้เหรียญผ่าน OwlCoins · ป้ายเปลี่ยนเป็น ✓ · วันนี้คุยซ้ำไม่มีงานอีก', async ({ page }) => {
  const errors = await openHouse(page);
  const before = await coins(page);
  expect(before).toBe(0);

  const npcId = await cardNpc(page);
  expect(npcId, 'วันนี้ต้องมีชาวบ้านที่แจกงานทรงการ์ดอย่างน้อย 1 คน').not.toBeNull();
  await page.evaluate(id => window.HouseQuestUI.offer(id), npcId);
  await expect(page.locator('#house-qz')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();      // กด "รับงาน!"
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
  expect(res.coins).toBe(10);   /* 3 ดาว = 10 🪙 เท่ากันทุกชั้น */

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

/* ผู้ใช้แจ้ง 2026-08-09: รับงานแล้วคนออกโจทย์เดินจากไป เด็กงงว่าคุยกับใครอยู่
   ⇒ ระหว่างการ์ดเควสต์เปิดอยู่ NPC เจ้าของงานต้องถูกตรึงให้ยืนกับที่ (n.hold ไม่มีวันหมด) */
test('คนออกโจทย์ต้องยืนรออยู่กับเด็กตลอดรอบเล่น ไม่เดินหนีระหว่างทำเควสต์', async ({ page }) => {
  const errors = await openHouse(page);
  const npcId = await cardNpc(page);
  expect(npcId, 'วันนี้ต้องมีชาวบ้านที่แจกงานทรงการ์ดอย่างน้อย 1 คน').not.toBeNull();
  await page.evaluate(id => window.HouseQuestUI.offer(id), npcId);
  await expect(page.locator('#house-qz')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();
  await expect(page.locator('.hqz-choice')).toHaveCount(4);

  const posOf = () => page.evaluate(id => {
    const n = window.__houseDbg.npcPos(id);
    return n ? {x:+n.x.toFixed(3), z:+n.z.toFixed(3)} : null;
  }, npcId);
  const a = await posOf();
  expect(a).not.toBe(null);
  await page.waitForTimeout(4000);          /* นานกว่าฟองคำพูด (~3.6 วิ) — เมื่อก่อนพ้นช่วงนี้แล้วเดินต่อ */
  const b = await posOf();
  /* ⚠ **ห้ามเทียบตำแหน่งแบบเป๊ะ** — ตอนถูกตรึง คนที่กำลังก้าวอยู่จะ "ไถลหยุด" ต่ออีกนิดก่อนนิ่งสนิท
     (วัดจริงบนจอ tablet: ขยับรวม ~0.005 หน่วยโลก ≈ 5 มม. แล้วนิ่งภายใน ~2 วิ)
     สิ่งที่เทสนี้ต้องจับคือ "เดินหนีไปจากเด็ก" ⇒ ใช้รัศมี 0.2 ช่อง ซึ่งยังจับการเดินจริงได้สบาย
     (คนเดิน 1 ช่อง/วิ ⇒ 4 วินาที = 4 ช่อง ห่างกว่าเกณฑ์นี้ 20 เท่า) */
  const moved = Math.hypot(b.x - a.x, b.z - a.z);
  expect(moved, 'คนออกโจทย์ต้องยืนอยู่กับที่ (ขยับได้แค่ไถลหยุด)').toBeLessThan(0.2);

  /* ปิดการ์ดแล้วต้องปล่อยให้เดินต่อได้ตามปกติ (ห้ามตรึงค้างจนคนยืนแข็งทั้งเมือง) */
  await page.evaluate(() => window.HouseQuestUI.close());
  expect(await page.evaluate(() => window.__houseDbg.questNpc())).toBe(null);
  expect(errors).toEqual([]);
});

test('ตอบผิดไม่มีบทลงโทษ: ผิดรัวๆ ก็ยังจบได้ ได้ 1 ดาว + เหรียญ และเงินไม่เคยลด', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.OwlCoins.set(120));
  /* ⚠ **ห้ามหยิบ `npcIds[0]` มาดื้อๆ** (แก้ 2026-08-17) — คนออกโจทย์ของแต่ละวันสุ่มตามวันที่
     บางวันคนแรกได้กลไกแบบ "เดิน/ลากของ" ที่ `it.choices` ว่างและ `it.correct` เป็น undefined
     ⇒ `q.answer(run, undefined)` กลายเป็น `undefined === undefined` = **ตอบถูก** ⇒ `wrong` ค้าง 0
     ⇒ ได้ 3 ดาว เทสแดงทั้งที่โปรแกรมไม่ได้พัง (เจอจริงวันที่คนแรกเป็นเควสต์ตกปลา)
     ที่แย่กว่านั้น: วันอื่นๆ ที่คนแรกบังเอิญเป็นการ์ด เทสนี้เขียวโดยที่บางข้อไม่เคยตอบผิดเลย
     ⇒ เลือกเฉพาะชุดที่ตอบผิดได้จริงทุกข้อ แล้ว **ยืนยันว่าตอบผิดไปจริง** กันเทสผ่านลอยๆ */
  const out = await page.evaluate(() => {
    const q = window.HouseQuests;
    /* ⚠ **ต้องกวาดทั้ง NPC + กระดาน + ครอบครัว** (แก้ 2026-08-22) — ตั้งแต่กระดานเฉลี่ยกลไก
       ใหม่เมื่อ 2026-08-20 บางวันมีชุด "การ์ด 4 ตัวเลือก" ของ NPC เหลือชุดเดียวหรือไม่เหลือเลย
       ⚠ และต้อง **ยาวอย่างน้อย 4 ข้อ** ด้วย — งานเดิน/เกมยืม engine มีข้อเดียว (ตัวเกมคือข้อนั้น)
         พลาดข้อเดียวยังได้ 3 ดาวตามกติกา "พลาดฟรี 1 ข้อ" ⇒ ไม่ใช่ชุดที่ใช้วัดเรื่องนี้ได้ */
    let run = null;
    const specs = q.state().npcIds.map(id => q.specForNpc(id))
      .concat(((q.state().board && q.state().board.q) || []).map((_, i) => q.specForBoard(i)))
      .concat([q.specForFamily()]).filter(Boolean);
    for (const sp of specs) {
      const r = q.buildRun(sp);
      if (r.items.length >= 4 && r.items.every(it => it.choices && it.choices.length > 1)) { run = r; break; }
    }
    if (!run) return { noChoiceQuest: true };
    let guard = 0;
    while (!run.over && guard++ < 300) {
      const it = run.items[run.idx];
      const bad = it.choices.map((_, i) => i).filter(i => i !== it.correct);
      q.answer(run, bad[0]); q.answer(run, bad[1] != null ? bad[1] : bad[0]);   // ผิด 2 ครั้งก่อน
      q.answer(run, it.correct);                                                // แล้วค่อยตอบถูก
    }
    return { over: run.over, wrong: run.wrong, n: run.items.length,
             stars: q.starsOf(run), res: q.finish(run) };
  });
  expect(out.noChoiceQuest, 'แต่ละวันต้องมีเควสต์แบบมีตัวเลือกอย่างน้อย 1 ชุด').toBeFalsy();
  expect(out.over).toBe(true);                 // ผิดกี่ครั้งก็ต้องเล่นจบได้เสมอ (ห้ามมี dead end)
  expect(out.wrong, 'ต้องตอบผิดจริงครบทุกข้อ ไม่งั้นเทสผ่านแบบไม่ได้เทสอะไรเลย').toBe(out.n);
  expect(out.stars).toBe(1);
  expect(out.res.coins).toBeGreaterThan(0);    // ได้เงินเสมอ กันเด็กท้อ
  expect(await coins(page)).toBe(120);         // ยอดเงินเดิมต้องไม่ถูกหักแม้แต่เหรียญเดียว
});

/* ⚠ **โบนัสครบ 5 ชุดถูกเอาออกแล้ว** (ผู้ใช้สั่ง 2026-08-09) — เทสนี้คือตัวกันไม่ให้ใครใส่กลับ
   เควสต์กระดานได้เหรียญของตัวเองครบอยู่แล้ว โบนัสก้อนโตทำให้เด็กรู้สึกว่า "ต้องเก็บให้ครบ" */
test('กระดานเควสต์: 5 ชุดแยกโควตาจาก NPC · ค่าตอบแทน 13 (3 ดาว) · โบนัสครบ 5 ชุด +10 🪙', async ({ page }) => {
  await openHouse(page);
  await page.evaluate(() => window.HouseQuestUI.board());
  await expect(page.locator('#house-quest')).toBeVisible();
  await expect(page.locator('#hq-list .hq-row')).toHaveCount(5);
  await expect(page.locator('#hq-claim')).toBeHidden();   /* ยังทำไม่ครบ = ยังไม่มีให้รับ */

  const before = await coins(page);
  const out = await page.evaluate(() => {
    const q = window.HouseQuests, got = [];
    for (let i = 0; i < q.BOARD_N; i++) {
      const run = q.buildRun(q.specForBoard(i));
      while (!run.over) q.answer(run, run.items[run.idx].correct);
      got.push(q.finish(run).coins);
    }
    return { got, left: q.boardLeft(), npcOpen: q.openNpcCount(), npcPerDay: q.NPC_PER_DAY,
             ready: q.boardBonusReady(), bonus: q.BOARD_BONUS };
  });
  /* กระดาน 3 ดาว = base 8 × ดาว 1.6 × ตัวคูณระดับชั้นของเฟส 10 (เด็กเทสเป็น ป.2 ⇒ ×1.05)
     ⚠ ตัวคูณคูณกับผลคูณทั้งก้อนก่อนปัดเศษ ไม่ใช่คูณกับเลข 13 ที่ปัดแล้ว */
  const wantBoard = await page.evaluate(() =>
    window.HouseQuests.coinsFor('board', 3, window.HouseQuests.difficulty().tier, false));
  expect(wantBoard).toBe(Math.round(8 * 1.6 * 1.05));
  out.got.forEach(c => expect(c).toBe(wantBoard));
  expect(out.left).toBe(0);
  expect(out.npcOpen).toBe(out.npcPerDay);     // โควตา NPC ต้องไม่ถูกกระดานกิน
  expect(out.bonus).toBe(10);                  /* ผู้ใช้สั่งกลับมาที่ 10 (เดิม 35) */
  expect(out.ready).toBe(true);
  /* **ต้องกดรับเอง** — ยังไม่กดต้องยังไม่ได้เงิน */
  expect(await coins(page)).toBe(before);

  await page.evaluate(() => window.HouseQuestUI.board());
  await expect(page.locator('#hq-claim')).toBeVisible();
  await page.locator('#hq-claim').click();
  await page.waitForTimeout(350);
  /* โบนัสกระดานถูกคูณตัวคูณระดับชั้นด้วย (ข้อ 45.8 — ไม่งั้นช่องว่าง 🪙/นาที ปิดไม่สนิท) */
  expect(await coins(page) - before).toBe(Math.round(10 * 1.05));
  await expect(page.locator('#hq-claim')).toBeHidden();   /* รับได้ครั้งเดียว */
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
  const npcId = await cardNpc(page);
  expect(npcId, 'วันนี้ต้องมีชาวบ้านที่แจกงานทรงการ์ดอย่างน้อย 1 คน').not.toBeNull();
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

test('ค่าตอบแทนเท่ากันทุกระดับชั้น (NPC 6/8/10 · กระดาน 8/10/13 · ครอบครัว 10/13/16) + รายได้ต่อวันไม่เฟ้อ', async ({ page }) => {
  await openHouse(page);
  const table = await page.evaluate(() => {
    const q = window.HouseQuests, out = [];
    for (let tier = 1; tier <= 6; tier++)
      for (let st = 1; st <= 3; st++)
        out.push({ tier, st, npc: q.coinsFor('A', st, tier, false), board: q.coinsFor('board', st, tier, false),
                   family: q.coinsFor('family', st, tier, false) });
    return out;
  });
  /* ⚠️ **จูนล่าสุด 2026-08-09 ตามคำสั่งผู้ใช้ — ห้ามปรับขึ้นกลับโดยไม่ถาม**
     NPC 6/8/10 · กระดาน 8/10/13 · ครอบครัว 10/13/16 (ตามจำนวนดาว)
     และ **ทุกระดับชั้นได้เท่ากันหมด** (ตัวคูณชั้น = 1.0)
     ส่วนที่หายไปย้ายไปเป็นโบนัสดาวรายวันที่เด็กต้องกดรับเอง (+15 ครึ่งทาง · +20 เต็ม) */
  /* ⚠️ เฟส 10 ใส่ตัวคูณระดับชั้นกลับมา (สูงสุด ×1.15) ⇒ เพดานของแต่ละช่วงขยับตามตัวคูณ
     ตัวเลข "ฐาน" ยังเป็นชุดเดิมของ 2026-08-09 ทุกประการ **ห้ามปรับฐานขึ้นโดยไม่ถามผู้ใช้** */
  const MAXMUL = 1.15;
  table.forEach(r => {
    expect(r.npc).toBeGreaterThanOrEqual(6);
    expect(r.npc).toBeLessThanOrEqual(Math.round(10 * MAXMUL));
    expect(r.board).toBeGreaterThanOrEqual(8);
    expect(r.board).toBeLessThanOrEqual(Math.round(13 * MAXMUL));
    expect(r.family).toBeGreaterThanOrEqual(10);
    expect(r.family).toBeLessThanOrEqual(Math.round(16 * MAXMUL));
    expect(r.family).toBeGreaterThan(r.board);   /* วันละชุดเดียว จึงให้สูงกว่าเสมอ */
  });
  /* ตัวคูณห้ามทำให้ "ฐาน" เพี้ยน — tier 1 ต้องได้ตัวเลขเดิมของ 2026-08-09 เป๊ะ */
  const t1 = table.filter(r => r.tier === 1);
  expect(t1.map(r => r.npc)).toEqual([6, 8, 10]);
  expect(t1.map(r => r.board)).toEqual([8, 10, 13]);
  expect(t1.map(r => r.family)).toEqual([10, 13, 16]);
  /* ⚠️ **เกณฑ์นี้เปลี่ยนแล้วในเฟส 10 (ข้อ 45.8 · อนุมัติ 2026-08-12)** — เดิมบังคับว่า
     "ทุกชั้นต้องได้เท่ากันเป๊ะ" (มติ 2026-08-09) แต่พอ ป.6 ทำข้อเยอะกว่า ป.1 จริงๆ
     ความ "เท่ากันเป๊ะ" กลายเป็นความไม่เป็นธรรม ⇒ เปลี่ยนเป็น 2 เกณฑ์นี้แทน **ห้ามลบเทสทิ้ง**:
       ① เงินต่างกันไม่เกิน 15% ② ป.6 ต้องไม่น้อยกว่า ป.1 (ไม่มีชั้นไหนเสียเปรียบ) */
  [1, 2, 3].forEach(st => {
    ['npc', 'board', 'family'].forEach(k => {
      const vals = table.filter(r => r.st === st).map(r => r[k]);
      const lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      /* ⚠ เทียบเป็น "ค่าที่ปัดเศษแล้ว" ไม่ใช่อัตราส่วนดิบ — ค่าน้อยๆ อย่าง 6 🪙 การปัดขึ้น 1 หน่วย
         คิดเป็น 16.7% ทั้งที่ตัวคูณจริงคือ 15% (อัตราส่วนที่แท้จริงอยู่ที่ระดับเงินรวมต่อวัน
         ซึ่งเทสด้านล่างคุมไว้แล้ว) */
      expect(hi, k + ' ' + st + ' ดาว ต่างกันได้ไม่เกิน 15%').toBeLessThanOrEqual(Math.round(lo * 1.15));
      expect(vals[vals.length - 1], k + ' ' + st + ' ดาว: ป.6 ต้องไม่น้อยกว่า ป.1')
        .toBeGreaterThanOrEqual(vals[0]);
    });
  });
  /* รายได้สูงสุดต่อวัน (ทุกงาน ⭐⭐⭐ รวมเควสต์ครอบครัว 1 ชุด) ต้องไม่เกิน 360 🪙
     ของแพงสุดในร้าน 300 🪙 ⇒ ของชิ้นใหญ่ยังต้องใช้เวลาเก็บอย่างน้อย ~1 วันเสมอ
     ⚠ เพดานนี้ขยับจาก 320 → 360 ตอนเพิ่มเควสต์ครอบครัวในเฟส 4A (ผู้ใช้อนุมัติ 2026-08-09)
       และต้องยังต่ำกว่า DAY_CAP เสมอ ไม่งั้นเด็กชนเพดานทุกวันจนเควสต์ท้ายๆ ได้ 0 เหรียญ */
  const perDay = await page.evaluate(() => {
    const q = window.HouseQuests, out = [];
    for (let tier = 1; tier <= 6; tier++)
      out.push(q.coinsFor('A', 3, tier, false) * q.NPC_PER_DAY
             + q.coinsFor('board', 3, tier, false) * q.BOARD_N
             + q.coinsFor('family', 3, tier, false)
             + q.STAR_BONUS.half + q.STAR_BONUS.full + q.BOARD_BONUS);   /* รวมโบนัสทั้งหมด */
    return out;
  });
  /* เพดาน 206 (ป.1) → 237 (ป.6) ตามตัวคูณระดับชั้นของเฟส 10 — เผื่อการปัดเศษเล็กน้อย */
  perDay.forEach(v => expect(v).toBeLessThanOrEqual(245));
  const cap = await page.evaluate(() => window.HouseQuests.DAY_CAP);
  perDay.forEach(v => expect(v).toBeLessThan(cap));
  expect(Math.max.apply(null, perDay)).toBeGreaterThan(150);   // แต่ก็ต้องไม่น้อยจนเล่นทั้งวันแล้วซื้ออะไรไม่ได้
  /* เฟส 10: รายได้ต่อวันต่างกันได้ไม่เกิน 15% และต้องไล่ขึ้นตามชั้น ห้ามมีชั้นไหนแซงย้อน */
  expect(Math.max.apply(null, perDay) / Math.min.apply(null, perDay)).toBeLessThanOrEqual(1.15 + 1e-9);
  for (let i = 1; i < perDay.length; i++)
    expect(perDay[i], 'tier ' + (i + 1) + ' ต้องไม่น้อยกว่า tier ' + i).toBeGreaterThanOrEqual(perDay[i - 1]);
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
  /* **จำนวนข้อสุ่ม 5-10 ต่อเควสต์** (ผู้ใช้สั่ง 2026-08-10 — เดิมผูกกับระดับชั้นตายตัว ป.2 = 6 ข้อ)
     ระดับชั้นยังมีผลกับ "ความยากของแต่ละข้อ" เหมือนเดิม แต่ไม่ใช่จำนวนข้ออีกต่อไป */
  expect(out.qN).toBeGreaterThanOrEqual(5);
  expect(out.qN).toBeLessThanOrEqual(10);
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

/* หมวดเชาว์ iq1-iq4 (ระดับเตรียม ป.1) เป็นโจทย์ **ภาพล้วน** ทั้ง 60 ข้อ — q.q เป็นค่าว่าง รูปคือโจทย์ทั้งหมด
   ถ้าหน้าจอเควสต์ไม่วาด <img> เด็กจะเจอการ์ดเปล่าๆ ตอบไม่ได้เลย (บั๊กจริงที่ผู้ใช้เจอ 2026-08-08)
   หมวดเติมแพทเทิร์นก็เหมือนกัน — โจทย์อยู่ในอาเรย์ q.pattern ไม่ใช่ข้อความ */
test('โจทย์ภาพ (หมวดเชาว์) กับโจทย์แพทเทิร์น: ต้องส่งรูป/การ์ดผ่านมาถึงหน้าจอจริง', async ({ page }) => {
  await openHouse(page);
  const out = await page.evaluate(() => {
    const q = window.HouseQuests;
    const cats = q.quizCats('prep-p1');
    const iq = cats.filter(c => /^iq/.test(c.id));
    const withImg = [], withPat = [];
    cats.forEach(c => c.questions.forEach(x => {
      if (x.img) withImg.push(x); if (x.pattern) withPat.push(x);
    }));
    return { iqCats: iq.length, img: withImg.length, pat: withPat.length,
             sampleImg: withImg[0] || null, samplePat: withPat[0] || null };
  });
  expect(out.iqCats).toBe(4);
  expect(out.img).toBeGreaterThan(50);          // 60 ข้อในคลัง — ถ้าหายไปแปลว่าคลังเปลี่ยน ต้องรู้ตัว
  expect(out.pat).toBeGreaterThan(20);

  /* engine ต้องแนบ img / pattern มาให้ครบ ไม่ยุบเป็นข้อความ */
  const carried = await page.evaluate(() => {
    const q = window.HouseQuests, out = { img: 0, pat: 0, shuffledImg: 0, tries: 0 };
    /* ยิงหลายรอบให้เจอทั้งข้อภาพและข้อแพทเทิร์น (สุ่มจากคลังของชั้นเตรียม ป.1) */
    for (let k = 0; k < 60; k++) {
      const run = q.buildRun({ src: 'npc', key: 'imgtest' + k, npc: 'npc-teacher', mech: 'quiz', fam: 'A', chal: false });
      run.gid = 'prep-p1';
      const r2 = q.MECHS.quiz.gen((s => { let h = s; return () => (h = (h * 1103515245 + 12345) >>> 0) / 4294967296; })(k + 1),
                                  q.difficulty('prep-p1'), { id: 'npc-teacher', job: 'teacher' }, 'prep-p1');
      r2.forEach(it => {
        out.tries++;
        if (it.img) { out.img++; if (it.choices.join('') !== 'กขค') out.shuffledImg++; }
        if (it.pattern) { out.pat++; if (!Array.isArray(it.pattern)) out.shuffledImg++; }
      });
    }
    return out;
  });
  expect(carried.tries).toBeGreaterThan(100);
  expect(carried.img).toBeGreaterThan(0);        // ต้องหยิบโจทย์ภาพมาเจอบ้าง
  expect(carried.shuffledImg).toBe(0);           // ตัวเลือก ก/ข/ค ของโจทย์ภาพห้ามสลับ (อ้างถึงช่องในรูป)

  /* วาดจริงบนหน้าจอ: ต้องมี <img> โผล่ + มีข้อความบอกให้ดูรูป (เพราะ q.q ว่าง) */
  const shown = await page.evaluate(() => {
    const q = window.HouseQuests;
    const cats = q.quizCats('prep-p1');
    let img = null;
    cats.forEach(c => c.questions.forEach(x => { if (x.img && !img) img = x; }));
    window.HouseQuestUI.close();
    /* ยัดโจทย์ภาพเข้ารอบเล่นตรงๆ แล้วสั่งวาด (เร็วกว่าสุ่มจนกว่าจะเจอ) */
    const run = q.buildRun({ src: 'npc', key: 'shot', npc: 'npc-teacher', mech: 'quiz', fam: 'A', chal: false });
    run.items = [{ q: '', emoji: '', img: img.img, pattern: null,
                   choices: img.choices.slice(), correct: img.correct, explain: '' }];
    window.HouseQuestUI.setRun(run);
    return img.img;
  });
  await expect(page.locator('#hqz-stage img.hqz-img')).toBeVisible();
  await expect(page.locator('#hqz-stage img.hqz-img')).toHaveAttribute('src', shown);
  await expect(page.locator('#hqz-q, .hqz-q')).toContainText('ดูรูป');
  await expect(page.locator('.hqz-choice')).toHaveCount(3);
  /* รูปต้องโหลดขึ้นจริง ไม่ใช่ไอคอนรูปแตก */
  const ok = await page.evaluate(() => {
    const im = document.querySelector('#hqz-stage img.hqz-img');
    return im && im.complete && im.naturalWidth > 0;
  });
  expect(ok).toBe(true);
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

/* ผู้ใช้สั่ง 2026-08-09: แถบสรุปเควสต์ของวันนี้ (เหลือกี่ชุด/เสร็จกี่ชุด)
   กดแล้วกางรายการว่าเหลืองานของใคร ร้านไหน — เด็กจะได้รู้ว่าต้องไปหาใครต่อ */
test('แถบสรุปเควสต์วันนี้: นับเหลือ/เสร็จถูกต้อง และอัปเดตหลังเล่นจบ', async ({ page }) => {
  const errors = await openHouse(page);
  const bar = page.locator('#house-quest-bar');
  await expect(bar).toBeVisible();

  const sum0 = await page.evaluate(() => window.HouseQuests.daySummary());
  /* NPC 8 + กระดาน 5 + ครอบครัว 1 = 14 ชุด/วัน */
  expect(sum0.total).toBe(14);
  expect(sum0.left).toBe(14);
  expect(sum0.done).toBe(0);
  /* ⚠️ เฟส 10 (ข้อ 45.6): **ตัวนับ ❗ นับเฉพาะงานหลัก 6 ชุด** (กระดาน 5 + ครอบครัว 1)
     งานรอง (NPC 8 คน) เป็นของแถมที่ทำเพิ่มได้ ไม่ค้างเป็นหนี้ ⇒ แถบขึ้น 6 ไม่ใช่ 14 */
  expect(sum0.mainTotal).toBe(6);
  expect(sum0.sideTotal).toBe(8);
  await expect(page.locator('#hqbar-left')).toContainText('6');
  await expect(page.locator('#hqbar-done')).toContainText('0');
  /* ต้องมีสัญลักษณ์ให้เด็กอ่านออกโดยไม่ต้องอ่านคำ */
  /* ⚠ ❗ เป็นไอคอน SVG แล้ว (2026-08-20) ⇒ เช็คว่ามีไอคอน + ตัวเลข ไม่ใช่ตัวอักษร emoji */
  expect(await page.locator('#hqbar-left').evaluate(el => !!el.querySelector('svg')),
         'เม็ดงานที่เหลือต้องมีไอคอน SVG').toBe(true);
  expect(await page.locator('#hqbar-done').evaluate(el => !!el.querySelector('svg')),
         'เม็ดงานที่เสร็จแล้วต้องมีไอคอน SVG').toBe(true);

  /* เล่น**งานรอง** (NPC) 1 ชุดจนจบ → ✅ ขยับ แต่ ❗ ของงานหลักต้องไม่ขยับ */
  await page.evaluate(() => {
    const q = window.HouseQuests, run = q.buildRun(q.specForNpc(q.state().npcIds[0]));
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    q.finish(run);
  });
  await expect.poll(() => page.evaluate(() => document.getElementById('hqbar-done').textContent),
    { timeout: 10000 }).toContain('1');
  await expect(page.locator('#hqbar-left')).toContainText('6');

  /* เล่น**งานหลัก** (กระดาน) 1 ชุด → ❗ ต้องลดเหลือ 5 */
  await page.evaluate(() => {
    const q = window.HouseQuests, run = q.buildRun(q.specForBoard(0));
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    q.finish(run);
  });
  await expect.poll(() => page.evaluate(() => document.getElementById('hqbar-left').textContent),
    { timeout: 10000 }).toContain('5');
  await expect(page.locator('#hqbar-done')).toContainText('2');
  expect(errors).toEqual([]);
});

test('รายการเควสต์: บอกชื่อคนและร้าน/สถานที่ครบทุกชุดที่ยังไม่ได้ทำ', async ({ page }) => {
  const errors = await openHouse(page);
  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  await expect(page.locator('#hqsum-list .hqsum-row')).toHaveCount(14);
  await expect(page.locator('#hqsum-list .hqsum-row.hqsum-ok')).toHaveCount(0);   /* ยังไม่ได้ทำอะไรเลย */

  const rows = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#hqsum-list .hqsum-row')).map(r => ({
      name: r.querySelector('.hqsum-name').textContent,
      place: r.querySelector('.hqsum-place').textContent,
    })));
  /* ทุกแถวต้องมีทั้งชื่อและสถานที่ ไม่มีช่องว่าง */
  rows.forEach(r => {
    expect(r.name.length, 'ชื่อต้องไม่ว่าง').toBeGreaterThan(0);
    expect(r.place.length, 'สถานที่ต้องไม่ว่าง').toBeGreaterThan(0);
  });
  /* ต้องมีทั้งงานกระดานและงานครอบครัวอยู่ในรายการ */
  expect(rows.filter(r => r.name.includes('กระดาน')).length).toBe(5);
  expect(rows.filter(r => r.place.includes('บ้านของหนู')).length).toBe(1);

  await page.locator('#hqsum-close').click();
  await expect(page.locator('#house-qsum')).toBeHidden();
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: รายการต้องโชว์ "อันที่ทำเสร็จแล้ว" ด้วย ไม่ใช่แสดงแค่ที่เหลือ */
test('รายการเควสต์: แยกกลุ่ม "ยังไม่ได้ทำ" กับ "ทำเสร็จแล้ว" และย้ายกลุ่มตามจริงหลังเล่นจบ', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => {
    const q = window.HouseQuests, run = q.buildRun(q.specForNpc(q.state().npcIds[0]));
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    q.finish(run);
  });
  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  await expect(page.locator('#hqsum-list .hqsum-row')).toHaveCount(14);        /* ครบทุกชุดของวัน */
  await expect(page.locator('#hqsum-list .hqsum-row.hqsum-ok')).toHaveCount(1); /* ที่เพิ่งทำเสร็จ */
  /* กลุ่ม "ยังไม่ได้ทำ" ต้องมาก่อนเสมอ */
  /* ⚠️ เฟส 10 (ข้อ 45.6): แยกเป็น 3 กลุ่ม — งานสำคัญ (หลัก) → ช่วยเพื่อนบ้าน (รอง) → ทำเสร็จแล้ว
     **ห้ามซ่อนงานรองที่ยังไม่ทำ** เด็กที่อยากเล่นต่อต้องหาเจอว่าเหลือใครบ้าง (ห้ามกั้นสิทธิ์) */
  const secs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#hqsum-list .hqsum-sec')).map(e => e.textContent));
  expect(secs.length).toBe(3);
  expect(secs[0]).toContain('งานสำคัญ');
  expect(secs[1]).toContain('ช่วยเพื่อนบ้าน');
  expect(secs[2]).toContain('ทำเสร็จแล้ว');
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: กล่องที่เปิดอยู่ แตะพื้นที่ด้านนอกแล้วต้องปิด */
test('แตะนอกกล่อง = ปิดกล่อง (รายการเควสต์ · กระดาน · การ์ดเควสต์) และตัวละครต้องไม่เดินตามไปด้วย', async ({ page }) => {
  const errors = await openHouse(page);
  /* คลิกเมาส์จริงบนพื้นที่ว่างมุมซ้าย (นอกกล่องทุกใบ · นอกแถบ HUD · นอกเข็มทิศ) */
  const tapAway = async () => { await page.mouse.click(60, 260); await page.waitForTimeout(250); };

  /* 1) รายการเควสต์ */
  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  await tapAway();
  await expect(page.locator('#house-qsum')).toBeHidden();

  /* 2) กระดานเควสต์ */
  await page.evaluate(() => window.HouseQuestUI.board());
  await expect(page.locator('#house-quest')).toBeVisible();
  await tapAway();
  await expect(page.locator('#house-quest')).toBeHidden();

  /* 3) การ์ดเควสต์ */
  await page.evaluate(() => window.HouseQuestUI.offer(window.HouseQuests.state().npcIds[0]));
  await expect(page.locator('#house-qz')).toBeVisible();
  await tapAway();
  await expect(page.locator('#house-qz')).toBeHidden();
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: เพิ่มจำนวนข้อต่อเควสต์เป็น 5-10 ข้อ ไล่ตามระดับชั้น */
test('จำนวนข้อต่อเควสต์: การ์ด 9-12 ไล่ตามชั้น และเกณฑ์ดาวยืดตามจำนวนข้อ (ไม่เข้มขึ้นเงียบๆ)', async ({ page }) => {
  const errors = await openHouse(page);
  /* ⚠️ **ตัวเลขชุดนี้เปลี่ยนแล้วท้ายเฟส 11 (ข้อ 45.4)** — เดิม 5-10 ข้อไล่ตามชั้น
     แต่ 5 ข้อ × 16 วิ = 80 วิ/ชุด คือ "ทำแป๊บเดียวเสร็จ" ซึ่งเป็นปัญหาที่เฟส 10-11 ตั้งใจแก้
     ⇒ ค่าตั้งต้นของ difficulty() เป็นของ "ทรงการ์ด" = 9-12 ข้อ (ทรงลาก 6-8 ดูเทสเฟส 11) */
  const qn = await page.evaluate(() => {
    const q = window.HouseQuests, out = {};
    q.GRADES.forEach(g => { out[g.id] = q.difficulty(g.id).qN; });
    return out;
  });
  Object.keys(qn).forEach(g => {
    expect(qn[g], 'จำนวนข้อของ ' + g).toBeGreaterThanOrEqual(9);
    expect(qn[g], 'จำนวนข้อของ ' + g).toBeLessThanOrEqual(12);
  });
  expect(qn['p6']).toBe(12);
  expect(qn['p1']).toBe(9);
  expect(qn['prep-p1'], 'เตรียม ป.1 กับ ป.1 อยู่ tier เดียวกัน').toBe(qn['p1']);
  /* ต้องไล่ขึ้นตามชั้น ไม่ลดลงกลางทาง */
  const seq = await page.evaluate(() => window.HouseQuests.GRADES.map(g => window.HouseQuests.difficulty(g.id).qN));
  for (let i = 1; i < seq.length; i++) expect(seq[i]).toBeGreaterThanOrEqual(seq[i - 1]);

  /* เกณฑ์ 2 ดาวต้องยืดตามจำนวนข้อ — เควสต์ 10 ข้อ ผิด 5 ข้อยังต้องได้ 2 ดาว (ห้ามลงโทษเด็ก) */
  const stars = await page.evaluate(() => ({
    long5:  window.HouseQuests.starsOf({wrong: 5, items: new Array(10)}),
    long9:  window.HouseQuests.starsOf({wrong: 9, items: new Array(10)}),
    short2: window.HouseQuests.starsOf({wrong: 2, items: new Array(3)}),
    perfect:window.HouseQuests.starsOf({wrong: 0, items: new Array(10)}),
  }));
  expect(stars.long5).toBe(2);
  expect(stars.long9).toBe(1);
  expect(stars.short2).toBe(2);      /* พฤติกรรมเดิมของเควสต์ 3 ข้อต้องไม่เปลี่ยน */
  expect(stars.perfect).toBe(3);
  /* เฟส 10: พลาด 1 ข้อยังได้ 3 ดาวเสมอ ไม่ว่าเควสต์จะสั้นหรือยาว (ข้อ 45.9) */
  const free = await page.evaluate(() => ([
    window.HouseQuests.starsOf({wrong: 1, items: new Array(5)}),
    window.HouseQuests.starsOf({wrong: 1, items: new Array(12)}),
  ]));
  expect(free).toEqual([3, 3]);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: หน้ารายการเควสต์ต้องบอกดาวของแต่ละชุดและดาวรวมของวันนี้ */
test('หน้ารายการเควสต์: โชว์ดาวรายชุด + แถบดาวรวมของวันนี้', async ({ page }) => {
  const errors = await openHouse(page);
  /* เล่น 2 ชุด: ชุดแรกเต็ม 3 ดาว · ชุดที่สองตอบผิดรัวๆ ให้เหลือ 1 ดาว */
  const pre = await page.evaluate(() => {
    const q = window.HouseQuests, ids = q.state().npcIds;
    /* ⚠ ชุดที่ต้องการให้เหลือ 1 ดาว **ต้องเป็นเควสต์ที่ตอบผิดได้จริง** — งานเดิน (deliver/findhidden)
       กับเกมที่ยืม engine มาไม่มีปุ่มตัวเลือกให้กดผิด จะได้ 3 ดาวเสมอ ทำให้ยอดดาวไม่ตรงที่คาด
       (เฟส 7 เพิ่มงานเดินเข้าพูลของ NPC ⇒ ids[1] ไม่การันตีว่าเป็นเควสต์ตอบคำถามอีกต่อไป) */
    const answerable = sp => {
      if (!sp) return false;
      const m = q.MECHS[sp.mech];
      if (!m || m.walk || m.engine) return false;
      const r = q.buildRun(sp);
      /* ต้องยาว ≥ 4 ข้อ ไม่งั้นตอบผิดทุกข้อก็ยังได้ 3 ดาว (กติกา "พลาดฟรี 1 ข้อ") */
      return r.items.length >= 4 && r.items.every(it => it.choices && it.choices.length > 1);
    };
    /* ⚠ กวาดทั้ง NPC + กระดาน + ครอบครัว (แก้ 2026-08-22) — บางวัน NPC ไม่มีชุดการ์ดถึง 2 ชุด
       ของเดิมดู `ids` อย่างเดียวแล้ว picks[1] เป็น undefined ⇒ เทสตายที่ buildRun(undefined) */
    const picks = ids.map(id => q.specForNpc(id))
      .concat(((q.state().board && q.state().board.q) || []).map((_, i) => q.specForBoard(i)))
      .concat([q.specForFamily()]).filter(answerable);
    if (picks.length < 2) return { few: picks.length };
    const a = q.buildRun(picks[0]);
    while (!a.over) q.answer(a, a.items[a.idx].correct);
    q.finish(a);
    const b = q.buildRun(picks[1]);
    let g = 0;
    while (!b.over && g++ < 300) {
      const it = b.items[b.idx];
      const bad = it.choices.map((_, i) => i).filter(i => i !== it.correct);
      bad.forEach(i => q.answer(b, i));          /* ผิดทุกตัวเลือกก่อน */
      q.answer(b, it.correct);
    }
    q.finish(b);
    return { few: 0 };
  });

  expect(pre.few, 'วันนี้ต้องมีชุดการ์ด 4 ตัวเลือกอย่างน้อย 2 ชุด').toBe(0);
  const sum = await page.evaluate(() => window.HouseQuests.daySummary());
  expect(sum.starsMax).toBe(sum.total * 3);
  expect(sum.stars).toBe(4);                     /* 3 ดาว + 1 ดาว */

  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  await expect(page.locator('#hqsum-startxt')).toHaveText('4 / ' + sum.starsMax);
  await expect.poll(() => page.evaluate(() =>
    document.getElementById('hqsum-starfill').style.width)).not.toBe('0%');

  /* ทุกแถวต้องมีดาว 3 ดวงเสมอ (⭐ ที่ได้ + ☆ ที่ยังไม่ได้) */
  const stars = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#hqsum-list .hqsum-row')).map(r => {
      const all = Array.from(r.querySelectorAll('.hqsum-star'));
      const on = all.filter(e => e.classList.contains('on'));
      return {
        n: all.length, on: on.length,
        tone: on.length ? (on[0].className.baseVal || on[0].getAttribute('class')).match(/tone(\d)/)[1] : '',
        color: on.length ? getComputedStyle(on[0]).color : '',
        done: r.classList.contains('hqsum-ok'),
        hasNum: !!r.querySelector('.hqsum-starn'),
      };
    }));
  expect(stars.length).toBe(sum.total);
  stars.forEach(s => expect(s.n, 'ทุกแถวต้องมีดาว 3 ดวง').toBe(3));
  /* ผู้ใช้สั่ง 2026-08-09: **ไม่มีตัวเลขกำกับแล้ว** ใช้สีบอกจำนวนแทน */
  stars.forEach(s => expect(s.hasNum, 'ต้องไม่มีตัวเลขกำกับดาวแล้ว').toBe(false));
  /* ชุดที่ยังไม่ทำ = ดาวจางทั้ง 3 ดวง (ไม่มีดวงติด) */
  stars.filter(s => !s.done).forEach(s => expect(s.on).toBe(0));
  /* ชุดที่ทำแล้ว: จำนวนดาวที่ติด = โทนสี ⇒ 1 ดาว/2 ดาว/3 ดาว คนละสีกัน */
  const done = stars.filter(s => s.done);
  done.forEach(s => {
    expect(s.on).toBeGreaterThanOrEqual(1);
    expect(String(s.on), 'โทนสีต้องตรงกับจำนวนดาว').toBe(s.tone);
  });
  const c3 = done.find(s => s.on === 3), c1 = done.find(s => s.on === 1);
  expect(c3).toBeTruthy();
  expect(c1).toBeTruthy();
  expect(c3.color, 'ดาว 3 ดวงกับ 1 ดวงต้องคนละสี').not.toBe(c1.color);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: โบนัสดาวรายวัน — ครึ่งทาง +15 · เต็ม +20 · **เด็กต้องกดรับเอง**
   และปุ่มเควสต์บน HUD ต้องขึ้นแจ้งเตือนให้รู้ว่ามีของรอรับ */
test('โบนัสดาวรายวัน: กดรับได้เมื่อถึงเกณฑ์ · จ่ายผ่าน OwlCoins · รับซ้ำไม่ได้ · มีแจ้งเตือนที่ปุ่ม', async ({ page }) => {
  const errors = await openHouse(page);
  const bonus = () => page.evaluate(() => window.HouseQuests.starBonus());

  /* ⚠️ เฟส 10 (ข้อ 45.8): โบนัสถูกคูณตัวคูณระดับชั้นด้วย (เด็กเทสเป็น ป.2 ⇒ ×1.05)
     ไม่งั้นช่องว่าง 🪙/นาที ระหว่างชั้นจะปิดได้ไม่สนิท เหลือ ~5% */
  const mul = await page.evaluate(() => window.HouseQuests.tierMul(window.HouseQuests.difficulty().tier));
  const wantHalf = Math.round(15 * mul), wantFull = Math.round(20 * mul);
  let b = await bonus();
  expect(mul).toBe(1.05);
  expect(b.half.coins).toBe(wantHalf);
  expect(b.full.coins).toBe(wantFull);
  expect(b.half.ready).toBe(false);
  expect(b.halfNeed).toBe(Math.ceil(b.starsMax / 2));
  await expect(page.locator('#hqbar-alert')).toBeHidden();      /* ยังไม่มีอะไรให้รับ */

  /* เก็บดาวให้ถึงครึ่งทาง (เล่นแบบเต็มดาวไปเรื่อยๆ) */
  await page.evaluate(() => {
    const q = window.HouseQuests;
    const need = Math.ceil(q.daySummary().starsMax / 2);
    const specs = q.state().npcIds.map(id => q.specForNpc(id))
      .concat([0,1,2,3,4].map(i => q.specForBoard(i)));
    for (const sp of specs) {
      if (q.daySummary().stars >= need) break;
      const r = q.buildRun(sp);
      while (!r.over) q.answer(r, r.items[r.idx].correct);
      q.finish(r);
    }
  });
  b = await bonus();
  expect(b.stars).toBeGreaterThanOrEqual(b.halfNeed);
  expect(b.half.ready).toBe(true);
  expect(b.full.ready).toBe(false);
  /* หมุดที่ยังไม่ถึงต้องบอกไว้ล่วงหน้าว่าต้องได้กี่ดาว + ได้เงินเท่าไหร่ (มีรูปเหรียญ) */
  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  const lock = await page.evaluate(() => {
    const e = document.getElementById('hqsum-pin-full');
    return { coinIcon: !!e.querySelector('.hqsum-pincoin .hs-coin'),
             coinTxt: e.querySelector('.hqsum-pincoin').textContent.trim(),
             need: e.querySelector('.hqsum-pinneed').textContent };
  });
  expect(lock.coinIcon, 'ต้องมีรูปเหรียญบนหมุด').toBe(true);
  expect(lock.coinTxt).toBe(String(wantFull));
  /* ⚠ ⭐ บนหมุดเป็นไอคอน SVG แล้ว ⇒ ข้อความเหลือแต่ตัวเลข */
  expect(lock.need.replace(/\s/g, '')).toBe('42');
  await page.locator('#hqsum-close').click();
  /* ปุ่มบน HUD ต้องขึ้นแจ้งเตือน */
  await expect.poll(() => page.evaluate(() =>
    !document.getElementById('hqbar-alert').hidden), { timeout: 10000 }).toBe(true);
  expect(await page.evaluate(() =>
    document.getElementById('house-quest-bar').classList.contains('hqbar-gift'))).toBe(true);

  /* กดรับในหน้ารายการ → เงินเพิ่มผ่าน OwlCoins */
  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  const before = await coins(page);
  await page.locator('#hqsum-pin-half.ready').click();
  await page.waitForTimeout(400);
  expect(await coins(page) - before).toBe(wantHalf);

  /* รับซ้ำไม่ได้ + แจ้งเตือนหายไป */
  b = await bonus();
  expect(b.half.claimed).toBe(true);
  expect(b.half.ready).toBe(false);
  expect(await page.evaluate(() => window.HouseQuests.claimStarBonus('half'))).toBe(0);
  await expect(page.locator('#hqsum-pin-half.taken')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() =>
    document.getElementById('hqbar-alert').hidden), { timeout: 10000 }).toBe(true);
  expect(errors).toEqual([]);
});

test('โบนัสดาวเต็มวัน: ได้ดาวครบทุกชุดแล้วกดรับ +20 ได้', async ({ page }) => {
  const errors = await openHouse(page);
  await page.evaluate(() => {
    const q = window.HouseQuests;
    const specs = q.state().npcIds.map(id => q.specForNpc(id))
      .concat([0,1,2,3,4].map(i => q.specForBoard(i)))
      .concat([q.specForFamily()]);
    specs.forEach(sp => {
      const r = q.buildRun(sp);
      while (!r.over) q.answer(r, r.items[r.idx].correct);
      q.finish(r);
    });
  });
  const b = await page.evaluate(() => window.HouseQuests.starBonus());
  expect(b.stars).toBe(b.starsMax);
  expect(b.full.ready).toBe(true);

  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  const before = await coins(page);
  /* กดรับทั้ง 2 ก้อน (ครึ่งทาง + เต็ม) */
  for (const id of ['#hqsum-pin-half', '#hqsum-pin-full']) {
    const btn = page.locator(id + '.ready');
    if (await btn.count()) { await btn.click(); await page.waitForTimeout(350); }
  }
  /* เฟส 10: ทั้ง 2 ก้อนถูกคูณตัวคูณระดับชั้น (ป.2 ⇒ ×1.05) */
  const mul2 = await page.evaluate(() => window.HouseQuests.tierMul(window.HouseQuests.difficulty().tier));
  expect(await coins(page) - before).toBe(Math.round(15 * mul2) + Math.round(20 * mul2));
  await expect(page.locator('.hqsum-pin.taken')).toHaveCount(2);
  /* หมุดต้องอยู่ตำแหน่งตามสัดส่วนดาวที่ต้องได้ (ครึ่งทาง ~50% · เต็ม 100%) */
  const pos = await page.evaluate(() => ({
    half: document.getElementById('hqsum-pin-half').style.left,
    full: document.getElementById('hqsum-pin-full').style.left,
  }));
  /* หมุดต้องบอก **เหรียญ (รูปเหรียญ ไม่ใช่ emoji)** และ **จำนวนดาวที่ต้องได้ใต้เหรียญ** */
  const pin = await page.evaluate(() => {
    const e = document.getElementById('hqsum-pin-full');
    return { coinIcon: !!e.querySelector('.hqsum-pincoin .hs-coin'),
             taken: e.classList.contains('taken'),
             need: e.querySelector('.hqsum-pinneed').textContent,
             coinTxt: e.querySelector('.hqsum-pincoin').textContent };
  });
  /* ⚠ ⭐ บนหมุดเป็นไอคอน SVG แล้ว (2026-08-20) ⇒ ข้อความเหลือแต่ตัวเลข */
  expect(pin.need.replace(/\s/g, '')).toMatch(/^\d+$/);
  expect(parseInt(pin.need, 10)).toBe(42);       /* เต็มวัน = 14 ชุด × 3 ดาว */
  expect(pin.taken).toBe(true);
  expect(pin.coinTxt).toContain('✓');            /* รับแล้วโชว์ ✓ แทนจำนวนเงิน */
  expect(pos.full).toBe('100%');
  expect(parseInt(pos.half, 10)).toBeGreaterThanOrEqual(50);
  expect(parseInt(pos.half, 10)).toBeLessThanOrEqual(52);
  expect(errors).toEqual([]);
});

/* 🎲 กระดานเควสต์ต้อง "เฉลี่ยเจอหลายหมวดหมู่เกม" (ผู้ใช้สั่ง 2026-08-20)
   เดิม `quiz` ถูกล็อกไว้ 40% + `count` 15% ⇒ กว่าครึ่งของงานเป็นการ์ดตอบคำถาม
   เด็กเปิดกระดานมาเจอ "ตอบคำถาม" ซ้ำๆ ทั้งที่มีกลไกให้เล่น 65 แบบ
   ⚠ ตรวจจากการสุ่มจริงหลายสิบวัน ไม่ใช่ดูโค้ด — สูตรสุ่มเปลี่ยนเมื่อไหร่เทสนี้ต้องจับได้ */
test('กระดานเควสต์: กลไกไม่ซ้ำกันในกระดานเดียว · ไม่มีกลไกไหนครองเกินสัดส่วน · คนไม่ซ้ำ', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, days = [];
    for(let d = 0; d < 60; d++){
      days.push(Q.devBoardFor('2026-' + String(1 + d % 12).padStart(2, '0')
                            + '-' + String(1 + d % 28).padStart(2, '0')));
    }
    const slots = days.flatMap(b => b.map(x => x.m));
    const cnt = {};
    slots.forEach(m => { cnt[m] = (cnt[m] || 0) + 1; });
    return {
      boards: days.length,
      slots: slots.length,
      minUniqMech: Math.min(...days.map(b => new Set(b.map(x => x.m)).size)),
      npcDupBoards: days.filter(b => new Set(b.map(x => x.npc)).size < b.length).length,
      mechKinds: Object.keys(cnt).length,
      topShare: Math.max(...Object.values(cnt)) / slots.length,
      quizShare: (cnt.quiz || 0) / slots.length,
    };
  });
  expect(r.slots, 'ต้องสุ่มกระดานได้ครบทุกวัน').toBe(r.boards * 5);
  expect(r.minUniqMech, 'ทุกกระดานต้องมีกลไกไม่ซ้ำกันครบ 5 ช่อง').toBe(5);
  expect(r.npcDupBoards, 'ห้ามมีชื่อคนซ้ำในกระดานเดียว').toBe(0);
  expect(r.mechKinds, 'ตลอด 60 วันต้องเจอกลไกหลากหลาย').toBeGreaterThanOrEqual(20);
  /* 🔒 ห้ามกลับไปฮาร์ดโค้ดเปอร์เซ็นต์ให้กลไกใดกลไกหนึ่งครองกระดาน */
  expect(r.topShare, 'กลไกที่เจอบ่อยสุดต้องไม่เกิน 20% ของช่องทั้งหมด').toBeLessThan(.20);
  expect(r.quizShare, 'ตอบคำถามต้องไม่เกิน 15%').toBeLessThan(.15);
});

/* 🔒 บั๊กที่ผู้ใช้เจอ 2026-08-22: รับงาน "นับของในบ่อ" จากลุงตกปลา แล้วลุงตกปลาถามใหม่เป็นเกมผสมสี
   ต้นเหตุ: `workPool()` กรองด้วย `mechOk()` ที่อ่าน **สถานะโลกสดๆ** (ของในโลกเหลือเท่าไร ·
   มีเครื่องดนตรีไหม · engine ของชั้นนี้เล่นได้ไหม) ⇒ ขนาดพูลเปลี่ยนได้ระหว่างวัน
   แต่ `rollWorkMech()` สุ่มด้วย seed คงที่จาก **ดัชนีในพูล** ⇒ พูลขยับเมื่อไหร่ กลไกของเควสต์
   เดิมเปลี่ยนตามทันทีทั้งที่ seed ไม่ขยับเลย (เด็กปิดการ์ดแล้วกลับไปคุยใหม่ = ได้คนละเกม)
   ⇒ แก้ด้วย `lockMech()` จดกลไกลง state ตอนกดรับงาน */
test('กลไกของเควสต์ต้องไม่เปลี่ยนหลังเด็กกดรับงานแล้ว แม้พูลกลไกจะเปลี่ยนขนาด', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests, g0 = activeChild.grade;
    const grades = ['prep-p1', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    const across = id => {
      const seen = {};
      grades.forEach(g => { activeChild.grade = g; const s = q.specForNpc(id); if (s) seen[s.mech] = 1; });
      activeChild.grade = g0;
      return Object.keys(seen);
    };
    /* หาคนที่กลไก "ไหลตามพูล" จริง (ก่อนแก้บั๊กจะมีเสมอ — คนที่มีกลไกยืม engine ในพูล) */
    const drift = q.state().npcIds.filter(id => across(id).length > 1);
    if (!drift.length) return { skip: true };
    const id = drift[0];
    const before = q.specForNpc(id).mech;
    q.buildRun(q.specForNpc(id));            /* = เด็กกดรับงาน */
    const locked = (q.state().npc[id] || {}).m;
    const after = across(id);                /* พูลเปลี่ยนขนาดทุกแบบแล้วยังต้องได้กลไกเดิม */
    return { id, before, locked, after, stable: after.length === 1 && after[0] === before };
  });
  if (!r.skip) {
    expect(r.locked, 'ต้องจดกลไกลง state ตอนรับงาน').toBe(r.before);
    expect(r.stable, 'กลไกของเควสต์ที่รับไปแล้วห้ามเปลี่ยน: ' + JSON.stringify(r)).toBe(true);
  }
  expect(errors).toEqual([]);
});

/* 🔒 งานที่ให้ "เดินไปทำที่อื่น" (นับของในย่าน · หาของที่หาย) — ตัว NPC เจ้าของงานห้ามยื่นงานใหม่ทับ
   ของเดิมดักไว้เฉพาะงานที่ปลายทางคือตัวเขาเอง (`toNpc`) งานปลายทางอื่นจึงหล่นไปถึงบรรทัดยื่นงานใหม่ */
test('คุยกับคนที่ยังทำงานให้เขาค้างอยู่ ต้องทวนคำสั่งเดิม ไม่ใช่ยื่นงานใหม่', async ({ page }) => {
  const errors = await openHouse(page);
  const id = await page.evaluate(() => {
    const s = window.HouseQuests.state();
    s.npc[s.npcIds[0]] = { m: 'findhidden' };     /* งานเดินไปหาของที่หาย (ปลายทาง = ย่าน) */
    return s.npcIds[0];
  });
  await page.evaluate(i => window.HouseQuestUI.talk(i), id);
  await expect(page.locator('#hqz-stage .hqz-yes')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();          /* รับงาน */
  await page.locator('#hqz-stage .hqz-yes').click();          /* "ไปเลย!" → เริ่มงานเดิน */
  await page.waitForFunction(() => !!window.__houseDbg.walkQuest(), null, { timeout: 15000 });
  await page.evaluate(i => window.HouseQuestUI.talk(i), id);  /* กลับไปคุยกับคนเดิม */
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => ({
    run: !!window.HouseQuestUI.run(),
    card: !document.getElementById('house-qz').hidden,
    wq: window.__houseDbg.walkQuest(),
  }));
  expect(r.wq, 'งานเดินที่ทำค้างอยู่ต้องไม่ถูกล้างทิ้ง').not.toBeNull();
  expect(r.card, 'ห้ามเด้งการ์ดรับงานใหม่ทับงานที่ทำค้างอยู่').toBe(false);
  expect(r.run, 'ห้ามเริ่มรอบใหม่ทับ').toBe(false);
  expect(errors).toEqual([]);
});

/* 🌳 ต้นไม้ที่ผู้ใช้ชี้เองว่าเกะกะ (WILD_BAN) — ถอนแล้วต้องไม่งอกกลับ */
test('ช่องที่สั่งถอนต้นไม้ต้องว่างจริง', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const g = window.__houseDbg.grid();
    return ['35,61', '33,65', '43,65', '45,65', '34,61', '35,60']
      .map(k => { const [x, z] = k.split(',').map(Number); return k + '=' + (g[z] ? g[z][x] : '?'); });
  });
  r.forEach(s => expect(s, 'ช่องนี้ต้องไม่มีต้นไม้: ' + s).toContain('=0'));
  expect(errors).toEqual([]);
});

/* 🔁 **เล่นซ้ำเควสต์ของชาวบ้าน** (ผู้ใช้สั่ง 2026-08-22)
   ทำเสร็จแล้วกลับไปคุยกับคนเดิม เล่นใหม่เพื่อเก็บดาวให้ครบได้
   💰 จ่าย **เฉพาะส่วนต่างของดาว** — เท่าเดิม/แย่ลง = ไม่ได้เงิน (ไม่งั้นเป็นเครื่องปั๊มเงิน)
   ⭐ ดาวที่จดไว้เก็บค่าที่ดีที่สุดเสมอ · ไม่นับเป็นชุดใหม่ของวันนี้ */
test('เล่นซ้ำเควสต์ชาวบ้าน: ได้ดาวมากกว่าเดิมจึงได้เงินส่วนต่าง · เท่าเดิมไม่ได้เงิน', async ({ page }) => {
  const errors = await openHouse(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    window.OwlCoins.set(0);
    /* หาเควสต์ NPC ที่ "ตอบผิดได้จริง" และยาวพอที่ตอบผิดหมดแล้วเหลือ 1 ดาว */
    const pick = q.state().npcIds.map(i => ({ i, s: q.specForNpc(i) })).filter(o => {
      const m = q.MECHS[o.s.mech];
      if (!m || m.walk || m.engine) return false;
      const r0 = q.buildRun(o.s);
      if (r0.items.length < 4 || !r0.items.every(it => it.choices && it.choices.length > 1)) return false;
      const t = q.buildRun(o.s), it = t.items[0];
      const w = it.choices.map((_, k) => k).filter(k => k !== it.correct);
      return !q.answer(t, w[0]).ok;          /* ตอบผิดแล้วต้องนับว่าผิดจริง */
    })[0];
    if (!pick) return { skip: true };
    const worst = sp => {
      const r0 = q.buildRun(sp);
      let g = 0;
      while (!r0.over && g++ < 300) {
        const it = r0.items[r0.idx];
        it.choices.map((_, k) => k).filter(k => k !== it.correct).forEach(k => q.answer(r0, k));
        q.answer(r0, it.correct);
      }
      return q.finish(r0);
    };
    const best = sp => {
      const r0 = q.buildRun(sp);
      while (!r0.over) q.answer(r0, r0.items[r0.idx].correct);
      return q.finish(r0);
    };
    const a = worst(q.specForNpc(pick.i));          /* รอบแรก — ดาวน้อย */
    const doneSpec = q.specForNpc(pick.i);
    const b = best(doneSpec);                        /* เล่นซ้ำ ทำได้ดีขึ้น */
    const c = best(q.specForNpc(pick.i));            /* เล่นซ้ำอีก ดาวเท่าเดิม */
    const tier = q.difficulty().tier;
    return { done: doneSpec.done, redoable: doneSpec.src === 'npc',
             full: q.coinsFor('A', 3, tier, false),
             a, b, c, saved: (q.state().npc[pick.i] || {}).stars, total: q.state().total };
  });
  if (r.skip) return;
  expect(r.done, 'รอบแรกจบแล้วต้องถูกจดว่าทำเสร็จ').toBe(true);
  expect(r.a.stars, 'รอบแรกตอบผิดทุกข้อต้องได้ 1 ดาว').toBe(1);
  expect(r.a.coins, 'รอบแรกต้องได้เงินเสมอ').toBeGreaterThan(0);
  expect(r.b.redo, 'รอบที่ 2 ต้องถูกนับเป็นการเล่นซ้ำ').toBe(true);
  expect(r.b.stars, 'รอบที่ 2 ตอบถูกหมดต้องได้ 3 ดาว').toBe(3);
  expect(r.b.better).toBe(true);
  expect(r.b.coins, 'ดาวเพิ่มขึ้นต้องได้เงินส่วนต่าง').toBeGreaterThan(0);
  /* 🔒 รวมทั้งชีวิตของชุดนี้ต้องเท่ากับ "ค่าตอบแทน 3 ดาว" พอดี — เล่นซ้ำกี่รอบก็ไม่เกินนี้ */
  expect(r.a.coins + r.b.coins + r.c.coins, 'เล่นซ้ำแล้วรวมต้องไม่เกินค่าตอบแทน 3 ดาว').toBe(r.full);
  expect(r.c.coins, 'เล่นซ้ำแล้วดาวเท่าเดิม ต้องไม่ได้เงินเลย').toBe(0);
  expect(r.saved, 'ดาวที่จดไว้ต้องเป็นค่าที่ดีที่สุด').toBe(3);
  expect(r.total, 'เล่นซ้ำต้องไม่นับเป็นชุดใหม่').toBe(1);
  expect(errors).toEqual([]);
});

/* 🧑 หน้ารายการเควสต์ต้องโชว์ "ตัวคนที่ฝากงาน" ในแถวของกระดานด้วย (ผู้ใช้สั่ง 2026-08-22)
   ของเดิมขึ้นไอคอนกระดานเหมือนกันหมดทั้ง 5 แถว เด็กแยกไม่ออกว่าแถวไหนเป็นงานของใคร */
test('หน้ารายการเควสต์: แถวงานกระดานโชว์ตัว NPC ที่ฝากงานไว้', async ({ page }) => {
  const errors = await openHouse(page);
  const ids = await page.evaluate(() =>
    window.HouseQuests.daySummary().items.filter(x => x.src === 'board').map(x => x.npc));
  expect(ids.length, 'กระดานต้องมี 5 ชุด').toBe(5);
  ids.forEach(id => expect(id, 'ทุกชุดบนกระดานต้องรู้ว่าใครฝากงานไว้').toBeTruthy());

  await page.locator('#house-quest-bar').click();
  await expect(page.locator('#house-qsum')).toBeVisible();
  const names = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#hqsum-list .hqsum-row'))
      .map(r => ({ name: (r.querySelector('.hqsum-name') || {}).textContent || '',
                   svg: !!(r.querySelector('.hqsum-ic svg')) })));
  expect(names.some(n => n.name === 'กระดานเควสต์'),
    'ห้ามเหลือแถวที่ขึ้นแค่ว่า "กระดานเควสต์"').toBe(false);
  expect(names.every(n => n.svg), 'ทุกแถวต้องมีรูปคน/ไอคอนเป็น SVG').toBe(true);
  expect(errors).toEqual([]);
});
