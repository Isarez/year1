const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" เฟส 4A — พ่อ-แม่ในบ้าน + เควสต์ครอบครัว (js/house-family.js + จุดต่อใน js/house.js)
   สิ่งที่ต้องไม่พังเด็ดขาด (ข้อ 28 ของ QUEST-DESIGN.md):
     1) **มี default มาให้ทั้งชื่อและหน้าตา** เด็กเปิดบ้านครั้งแรกเจอพ่อแม่ยืนอยู่เลย
        ไม่มีหน้าจอบังคับสร้างตัวละครก่อน · ไม่มี data.parents = ใช้ default (เด็กเก่าไม่พัง)
     2) แก้ได้ทั้งชื่อและทุกแถวของ H_ROWS · แก้ของพ่อต้องไม่ไปโดนของแม่
     3) เควสต์ครอบครัว **วันละ 1 ชุดเท่านั้น** โควตาแยกจาก NPC/กระดานเด็ดขาด
        และสุ่มคงที่ต่อวัน (วันนี้ได้พ่อก็พ่อทั้งวัน)
     4) **ห้ามลงโทษเด็ก** — ปฏิเสธงานได้เสมอ ไม่มีบ่น ไม่มีดุ (กติกาเหล็กข้อ 2) */

const CHILD = { id: 'fam-test', name: 'เทสครอบครัว', emoji: '👨‍👩‍👧', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const PKEY = 'p1quiz_progress_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
const SEED = { v: 1, mapV: 3, char: CHAR };

async function openHouse(page, seedHouse) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed, pkey]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
    localStorage.setItem(pkey, JSON.stringify({ coins: 0 }));
  }, [CHILD, HKEY, seedHouse === undefined ? SEED : seedHouse, PKEY]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseFamily && !!window.HouseFamilyUI, null, { timeout: 30000 });
  await page.waitForFunction(
    () => window.__houseDbg && window.__houseDbg.mode() === 'world' && !window.__houseDbg.editing(),
    null, { timeout: 30000 });
  return errors;
}
/* เข้าไปในบ้าน (พ่อแม่อยู่ชั้นในเท่านั้น ไม่ออกไปในเมือง) */
async function goInside(page) {
  await page.evaluate(() => window.__houseDbg.enterHouse());
  await page.waitForFunction(() => window.__houseDbg.scene() === 'in', null, { timeout: 15000 });
  await expect.poll(() => page.evaluate(() => window.HouseFamilyUI.built().length), { timeout: 15000 }).toBe(2);
}
const readHouse = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), HKEY);

test('เด็กใหม่: มีพ่อแม่พร้อมชื่อ/หน้าตา default ทันที โดยไม่ต้องตั้งค่าอะไรก่อน', async ({ page }) => {
  const errors = await openHouse(page);
  const ps = await page.evaluate(() => window.HouseFamily.parents());
  expect(ps.dad.name).toBe('คุณพ่อ');
  expect(ps.mom.name).toBe('คุณแม่');
  /* หน้าตาต้องมีค่าครบทุกแถว ไม่ใช่ object ว่าง (ไม่งั้น buildCharacter ตกไปใช้ค่าแรกเงียบๆ) */
  ['gender', 'hair', 'hairC', 'eyes', 'shirt', 'bottom', 'shoes'].forEach(k => {
    expect(typeof ps.dad.char[k], 'dad.' + k).toBe('number');
    expect(typeof ps.mom.char[k], 'mom.' + k).toBe('number');
  });
  expect(ps.mom.char.gender).toBe(1);

  /* save ต้องยังไม่มี data.parents — ไม่มีข้อมูล = ใช้ default (เด็กที่เล่นอยู่ก่อนเฟส 4 จึงไม่พัง) */
  const d = await readHouse(page);
  expect(d.parents == null).toBe(true);
  expect(errors).toEqual([]);
});

test('พ่อแม่ยืนอยู่ในบ้านจริงทั้ง 2 คน และอยู่คนละห้อง (แม่ครัว/พ่อห้องนั่งเล่น)', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);
  const built = await page.evaluate(() => window.HouseFamilyUI.built().sort());
  expect(built).toEqual(['dad', 'mom']);

  const pos = await page.evaluate(() => ({
    dad: window.HouseFamilyUI.pos('dad'), mom: window.HouseFamilyUI.pos('mom'),
  }));
  expect(pos.dad).not.toBe(null);
  expect(pos.mom).not.toBe(null);
  /* คนละห้องจริง — ต้องไม่ยืนซ้อนกัน */
  expect(Math.hypot(pos.dad.x - pos.mom.x, pos.dad.z - pos.mom.z)).toBeGreaterThan(4);
  expect(errors).toEqual([]);
});

test('เควสต์ครอบครัว: วันละ 1 ชุด · สุ่มคงที่ต่อวัน · โควตาแยกจาก NPC และกระดาน', async ({ page }) => {
  const errors = await openHouse(page);
  const s = await page.evaluate(() => {
    const q = window.HouseQuests;
    return { a: q.specForFamily(), b: q.specForFamily(), who: q.familyWho(), done: q.familyDone(),
             npcOpen: q.openNpcCount(), npcPerDay: q.NPC_PER_DAY, boardLeft: q.boardLeft(), boardN: q.BOARD_N };
  });
  expect(['dad', 'mom']).toContain(s.who);
  expect(s.a.who).toBe(s.b.who);              /* เปิดซ้ำได้คนเดิมเสมอ ไม่สุ่มใหม่ */
  expect(s.a.mech).toBe(s.b.mech);
  expect(s.a.src).toBe('family');
  expect(s.a.fam).toBe('family');
  expect(s.done).toBe(false);
  /* ยังไม่ได้แตะโควตาอื่นเลย */
  expect(s.npcOpen).toBe(s.npcPerDay);
  expect(s.boardLeft).toBe(s.boardN);
  expect(errors).toEqual([]);
});

test('เล่นเควสต์ครอบครัวจนจบ: ได้เหรียญตามสูตร (3 ดาว) · วันนี้ไม่มีงานอีก · โควตา NPC/กระดานไม่ถูกกิน', async ({ page }) => {
  const errors = await openHouse(page);
  const out = await page.evaluate(() => {
    const q = window.HouseQuests;
    const run = q.buildRun(q.specForFamily());
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    const res = q.finish(run);
    return { res, done: q.familyDone(), spec: q.specForFamily(),
             npcOpen: q.openNpcCount(), npcPerDay: q.NPC_PER_DAY, boardLeft: q.boardLeft(), boardN: q.BOARD_N };
  });
  expect(out.res.stars).toBe(3);
  /* ⚠️ เฟส 10 (ข้อ 45.8): ครอบครัว 3 ดาว = base 10 × ดาว 1.6 × ตัวคูณระดับชั้น
     เด็กเทสในไฟล์นี้เป็น ป.2 ⇒ ×1.05 ⇒ 16.8 ปัดเป็น 17 (เดิมทุกชั้นได้ 16 เท่ากัน)
     **ห้ามแก้ฐาน 10/1.6 โดยไม่ถามผู้ใช้** — ตรงนี้คุมแค่ว่าสูตรถูกนำมาใช้จริง */
  expect(out.res.coins).toBe(Math.round(10 * 1.6 * 1.05));
  expect(out.done).toBe(true);
  expect(out.spec.done).toBe(true);           /* วันนี้ทำแล้ว ขอซ้ำไม่ได้ */
  expect(out.npcOpen).toBe(out.npcPerDay);    /* โควตาแยกกันจริง */
  expect(out.boardLeft).toBe(out.boardN);

  /* ข้อมูลลง house save ก้อนเดิม ⇒ export/import ตามไปเอง */
  const d = await readHouse(page);
  expect(d.q2.fam.st).toBe('done');
  expect(errors).toEqual([]);
});

test('แตะพ่อ/แม่: คนที่มีงานยื่นงานให้ · อีกคนบอกใบ้ · ปฏิเสธได้ไม่มีใครโกรธ', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);
  const who = await page.evaluate(() => window.HouseQuests.familyWho());
  const other = who === 'dad' ? 'mom' : 'dad';

  /* ผู้ใช้สั่ง 2026-08-09: **แตะตัว = คุยเพื่อทำเควสต์เท่านั้น**
     คนที่ไม่มีงาน → ได้แค่ฟองคำพูด **ห้ามมีกล่องอะไรเด้งมาบังจอ** */
  await page.evaluate(w => window.HouseFamilyUI.tap(w), other);
  await page.waitForTimeout(600);
  await expect(page.locator('#house-qz')).toBeHidden();

  /* คนที่มีงาน → การ์ดชวนช่วยงาน + ปฏิเสธได้ */
  await page.evaluate(w => window.HouseFamilyUI.tap(w), who);
  await expect(page.locator('#house-qz')).toBeVisible();
  await expect(page.locator('#hqz-sub')).toContainText('งานของครอบครัว');
  await expect(page.locator('#hqz-stage .hqz-yes')).toContainText('ช่วยเลย');
  await page.locator('#hqz-stage .hqz-no').click();       /* "ไว้ก่อน" */
  await expect(page.locator('#house-qz')).toBeHidden();
  /* ปฏิเสธแล้วงานต้องยังอยู่ ไม่ถูกริบ (ห้ามลงโทษเด็ก) */
  expect(await page.evaluate(() => window.HouseQuests.familyDone())).toBe(false);
  expect(errors).toEqual([]);
});

test('แต่งตัว/ตั้งชื่อให้พ่อแม่: บันทึกลง data.parents · แก้ของคนหนึ่งไม่โดนอีกคน · ยกเลิกแล้วไม่บันทึก', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);

  /* เปิดหน้าแต่งตัวของแม่ → ต้องมีแถวตั้งชื่อ + แท็บพ่อ/แม่ และ **ไม่มีแถวเลือกเพศ** */
  await page.evaluate(() => window.HouseFamilyUI.dress('mom'));
  await expect(page.locator('#house-creator')).toBeVisible();
  await expect(page.locator('#house-creator-name-row')).toBeVisible();
  await expect(page.locator('#house-creator-tabs .he-tab')).toHaveCount(2);
  await expect(page.locator('#house-creator-title')).toContainText('คุณแม่');
  expect(await page.evaluate(() =>
    Array.from(document.querySelectorAll('#house-creator-rows .house-row-label'))
      .some(e => e.textContent.includes('หนูเป็น')))).toBe(false);
  await page.fill('#house-creator-name', 'แม่หมี');
  await page.locator('#house-done-btn').click();
  await page.waitForTimeout(900);

  let ps = await page.evaluate(() => window.HouseFamily.parents());
  expect(ps.mom.name).toBe('แม่หมี');
  expect(ps.dad.name).toBe('คุณพ่อ');        /* แก้แม่ต้องไม่ไปโดนพ่อ */
  let d = await readHouse(page);
  expect(d.parents.mom.name).toBe('แม่หมี');
  expect(d.parents.dad == null).toBe(true);
  expect(d.char).toEqual(CHAR);              /* **ห้ามเขียนทับตัวละครของเด็กเอง** */

  /* ยกเลิก → ต้องไม่บันทึกอะไรเลย */
  await page.evaluate(() => window.HouseFamilyUI.dress('dad'));
  await expect(page.locator('#house-creator')).toBeVisible();
  await page.fill('#house-creator-name', 'พ่อหมี');
  await page.locator('#house-back').click();
  await page.waitForTimeout(900);
  ps = await page.evaluate(() => window.HouseFamily.parents());
  expect(ps.dad.name).toBe('คุณพ่อ');
  d = await readHouse(page);
  expect(d.parents.dad == null).toBe(true);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่งเพิ่ม 2026-08-09: พ่อแม่ต้อง **เดินและทำกิจกรรมตามอุปกรณ์ที่มีในบ้านจริง**
   (บ้านไม่มีของชนิดนั้น = ไม่มีกิจกรรมนั้น ไม่ใช่แกล้งทำลอยๆ ให้เด็กงง) */
test('พ่อแม่เดินไปมาในบ้านจริง ไม่ยืนแข็งอยู่จุดเดียว', async ({ page }) => {
  test.slow();                     /* รอ "เวลาในเกม" — engine clamp dt 50ms/เฟรม */
  const errors = await openHouse(page);
  await goInside(page);
  const at0 = await page.evaluate(() => ({ dad: window.HouseFamilyUI.pos('dad'), mom: window.HouseFamilyUI.pos('mom') }));
  /* อย่างน้อย 1 คนต้องขยับจากจุดเริ่มภายในเวลาที่ให้ (อีกคนอาจกำลังทำกิจกรรมอยู่กับที่) */
  await expect.poll(async () => {
    const at = await page.evaluate(() => ({ dad: window.HouseFamilyUI.pos('dad'), mom: window.HouseFamilyUI.pos('mom') }));
    const moved = w => Math.hypot(at[w].x - at0[w].x, at[w].z - at0[w].z) > 0.6;
    return moved('dad') || moved('mom');
  }, { timeout: 60000 }).toBe(true);
  expect(errors).toEqual([]);
});

/* หา "ที่ว่าง" บนจอที่ไม่มีตัวที่คุยได้อยู่จริง — ห้าม hardcode พิกัด เพราะ desktop กับ tablet
   มุมกล้องต่างกัน จุดเดียวกันอาจมีคนยืนอยู่พอดีบนจอหนึ่ง (เทสแดงแบบนี้มาแล้ว 2026-08-10) */
async function emptySpot(page) {
  const size = page.viewportSize();
  const cands = [];
  for (const fy of [0.9, 0.12, 0.75, 0.25]) for (const fx of [0.06, 0.94, 0.2, 0.8])
    cands.push({ x: Math.round(size.width * fx), y: Math.round(size.height * fy) });
  for (const c of cands) {
    if (!(await page.evaluate(p => window.__houseTalkAt(p.x, p.y), c))) return c;
  }
  throw new Error('หาที่ว่างบนจอไม่เจอ (มีตัวละครเต็มจอ?)');
}

test('เคอร์เซอร์ฟองคำพูดใช้กับพ่อแม่ในบ้านด้วย (ไม่ใช่เฉพาะชาวบ้านในเมือง)', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);
  const blank = await emptySpot(page);
  await page.mouse.move(blank.x, blank.y);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__houseTalkHover())).toBe(false);

  let hovered = false;
  for (let i = 0; i < 12 && !hovered; i++) {
    const p = await page.evaluate(() => window.HouseFamilyUI.screen('mom') || window.HouseFamilyUI.screen('dad'));
    if (!p) { await page.waitForTimeout(300); continue; }
    await page.mouse.move(Math.round(p.x) + (i % 2), Math.round(p.y));
    await page.waitForTimeout(220);
    hovered = await page.evaluate(() => window.__houseTalkHover());
  }
  expect(hovered, 'วางเมาส์บนตัวพ่อแม่แล้วเคอร์เซอร์ต้องเปลี่ยนเป็นฟองคำพูด').toBe(true);
  expect(errors).toEqual([]);
});

test('ปุ่มแต่งตัวพ่อแม่: โผล่เฉพาะตอนอยู่ในบ้าน · กดแล้วเข้าหน้าแต่งตัว · สลับแท็บแล้วข้อมูลไม่หาย', async ({ page }) => {
  const errors = await openHouse(page);
  await expect(page.locator('#house-parent-btn')).toBeHidden();   /* อยู่นอกบ้าน = ไม่มีปุ่ม */
  await goInside(page);
  await expect(page.locator('#house-parent-btn')).toBeVisible();

  await page.locator('#house-parent-btn').click();
  await page.waitForTimeout(900);
  await expect(page.locator('#house-creator')).toBeVisible();
  await expect(page.locator('#house-creator-tabs .he-tab')).toHaveCount(2);

  /* พิมพ์ชื่อในแท็บที่เปิดอยู่ → สลับไปอีกแท็บ → สลับกลับ ชื่อต้องยังอยู่ */
  const first = await page.evaluate(() => window.__houseDbg.creatorWho());
  await page.fill('#house-creator-name', 'ชื่อทดสอบ');
  await page.evaluate(w => {
    const bs = Array.from(document.querySelectorAll('#house-creator-tabs .he-tab'));
    bs[w === 'dad' ? 1 : 0].click();
  }, first);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.__houseDbg.creatorWho())).not.toBe(first);
  await page.evaluate(w => {
    const bs = Array.from(document.querySelectorAll('#house-creator-tabs .he-tab'));
    bs[w === 'dad' ? 0 : 1].click();
  }, first);
  await page.waitForTimeout(400);
  expect(await page.inputValue('#house-creator-name')).toBe('ชื่อทดสอบ');
  expect(errors).toEqual([]);
});

/* บั๊กที่ผู้ใช้เจอ 2026-08-09: แต่งตัวให้พ่อ/แม่แล้วออกจากหน้านั้น **ตัวเด็กกลายเป็นพ่อ/แม่ทันที**
   สาเหตุ: exitCreatorToWorld() เรียก rebuildChar(creatorCfg) ทั้งที่ creatorCfg ยังเป็นหน้าตาของพ่อแม่
   โดนทั้งตอนกดบันทึกและตอนยกเลิก — เทสนี้คือตัวกันไม่ให้กลับมาอีก */
test('แต่งตัวพ่อแม่แล้วออก: ตัวเด็กในฉากต้องไม่เปลี่ยนเป็นพ่อ/แม่ (ทั้งตอนบันทึกและยกเลิก)', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);
  const before = await page.evaluate(() => window.__houseDbg.charLook());
  expect(before.gender).toBe(0);
  expect(before.shirt).toBe(CHAR.shirt);

  /* 1) ยกเลิก */
  await page.evaluate(() => window.HouseFamilyUI.dress('mom'));
  await expect(page.locator('#house-creator')).toBeVisible();
  await page.locator('#house-back').click();
  await page.waitForTimeout(900);
  let after = await page.evaluate(() => window.__houseDbg.charLook());
  expect(after.gender, 'ยกเลิกแล้วเด็กต้องไม่กลายเป็นแม่').toBe(0);
  expect(after.shirt).toBe(CHAR.shirt);
  expect(after.hair).toBe(CHAR.hair);

  /* 2) กดบันทึก */
  await page.evaluate(() => window.HouseFamilyUI.dress('mom'));
  await expect(page.locator('#house-creator')).toBeVisible();
  await page.locator('#house-done-btn').click();
  await page.waitForTimeout(1000);
  after = await page.evaluate(() => window.__houseDbg.charLook());
  expect(after.gender, 'บันทึกแล้วเด็กก็ต้องไม่กลายเป็นแม่').toBe(0);
  expect(after.shirt).toBe(CHAR.shirt);

  /* แต่หน้าตาของแม่ต้องถูกบันทึกจริง (ไม่ใช่แก้บั๊กด้วยการไม่บันทึกอะไรเลย) */
  const d = await readHouse(page);
  expect(d.parents.mom).toBeTruthy();
  expect(d.char).toEqual(CHAR);
  expect(errors).toEqual([]);
});

/* ท่าเดิน: buildCharacter() เก็บ rig ไว้ที่ g.userData ตรงๆ ไม่ใช่ userData.anim
   อ่านผิดแล้วขาไม่ขยับเลย (ตัวเลื่อนแต่เหมือนลอยไป) — เทสนี้จับว่าขาแกว่งจริง */
test('ท่าเดินพ่อแม่: ขาต้องแกว่งจริงตอนเดิน ไม่ใช่ลอยไปเฉยๆ', async ({ page }) => {
  test.slow();
  const errors = await openHouse(page);
  await goInside(page);
  const seen = new Set();
  await expect.poll(async () => {
    const legs = await page.evaluate(() => {
      const out = {};
      ['dad', 'mom'].forEach(w => {
        const g = window.HouseFamilyUI.rig(w);
        if (g) out[w] = g.legs[0];
      });
      return out;
    });
    Object.keys(legs).forEach(w => seen.add(w + ':' + (legs[w] > 0.15 ? 'up' : legs[w] < -0.15 ? 'dn' : 'mid')));
    /* ต้องเคยเห็นขาอยู่ทั้งท่าหน้าและท่าหลัง = แกว่งจริง */
    return ['dad', 'mom'].some(w => seen.has(w + ':up') && seen.has(w + ':dn'));
  }, { timeout: 60000 }).toBe(true);
  expect(errors).toEqual([]);
});

/* ผู้ใช้เจอ 2026-08-09: เปิดหน้าแต่งตัวแล้ว (1) ฟองคำพูดพ่อแม่ยังลอยทับอยู่
   (2) ป้ายชื่อเด็กไปโผล่บนหัวพ่อ/แม่ที่กำลังพรีวิว — ทั้งคู่เป็นป้าย DOM ที่ลอยตามพิกัด 3D */
test('เปิดหน้าแต่งตัว: ฟองคำพูดพ่อแม่และป้ายชื่อเด็กต้องหายทันที ไม่ทะลุมาทับ', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);

  /* ทำให้ฟองคำพูดขึ้นก่อน (แตะคนที่ไม่มีงาน = ได้ฟองอย่างเดียว) */
  const who = await page.evaluate(() => window.HouseQuests.familyWho());
  await page.evaluate(w => window.HouseFamilyUI.tap(w), who === 'dad' ? 'mom' : 'dad');
  await page.waitForTimeout(300);
  expect(await page.evaluate(() =>
    document.getElementById('house-npc-bubble').classList.contains('on'))).toBe(true);

  /* เปิดหน้าแต่งตัวทันที → ฟองต้องหาย และชื่อเด็กต้องไม่ลอยอยู่บนหัวพ่อแม่ */
  await page.evaluate(() => window.HouseFamilyUI.dress('mom'));
  await expect(page.locator('#house-creator')).toBeVisible();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() =>
    document.getElementById('house-npc-bubble').classList.contains('on')), 'ฟองคำพูดต้องหาย').toBe(false);
  expect(await page.evaluate(() =>
    document.getElementById('house-char-name').hidden), 'ป้ายชื่อเด็กต้องถูกซ่อน').toBe(true);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: เอาป้ายงาน "!" ชุดเดียวกับชาวบ้านในเมืองมาใช้กับพ่อแม่ด้วย
   ⇒ เด็กเห็นจากไกลว่าวันนี้ต้องไปหาใคร โดยไม่ต้องไล่แตะทีละคน */
test('ป้ายงาน "!" เหนือหัวพ่อแม่: ขึ้นเฉพาะคนที่มีงานวันนี้ · ทำเสร็จแล้วเปลี่ยนเป็น ✓', async ({ page }) => {
  const errors = await openHouse(page);
  await goInside(page);
  const who = await page.evaluate(() => window.HouseQuests.familyWho());
  const other = who === 'dad' ? 'mom' : 'dad';

  const marksOf = () => page.evaluate(() => {
    const m = {};
    window.HouseFamilyUI.marks().forEach(x => { m[x.who] = { open: x.open, done: x.done }; });
    return m;
  });
  await expect.poll(async () => (await marksOf())[who].open, { timeout: 10000 }).toBe(true);
  let m = await marksOf();
  expect(m[who].done).toBe(false);
  expect(m[other].open, 'คนที่ไม่มีงานต้องไม่มีป้าย').toBe(false);
  expect(m[other].done).toBe(false);

  /* เล่นเควสต์ครอบครัวจนจบ → ป้ายต้องเปลี่ยนเป็น ✓ */
  await page.evaluate(() => {
    const q = window.HouseQuests, run = q.buildRun(q.specForFamily());
    while (!run.over) q.answer(run, run.items[run.idx].correct);
    q.finish(run);
  });
  await expect.poll(async () => (await marksOf())[who].done, { timeout: 10000 }).toBe(true);
  m = await marksOf();
  expect(m[who].open).toBe(false);
  expect(m[other].open).toBe(false);
  expect(errors).toEqual([]);
});

/* ผู้ใช้สั่ง 2026-08-09: แตะพ่อ/แม่แล้ว **เด็กต้องเดินไปหาก่อน** ค่อยคุย (เหมือนแตะชาวบ้านในเมือง)
   ตะโกนคุยข้ามห้องดูไม่เป็นธรรมชาติ และเด็กไม่รู้ว่าต้องเดินไปไหน */
test('แตะพ่อ/แม่: เด็กเดินไปหาก่อนแล้วค่อยคุย ไม่ใช่คุยข้ามห้อง', async ({ page }) => {
  test.slow();
  const errors = await openHouse(page);
  await goInside(page);
  const who = await page.evaluate(() => window.HouseQuests.familyWho());

  const gap = () => page.evaluate(w => {
    const c = window.__houseDbg.charPos(), p = window.HouseFamilyUI.pos(w);
    return (c && p) ? Math.hypot(c.x - p.x, c.z - p.z) : -1;
  }, who);
  const far = await gap();
  expect(far, 'ตอนเริ่มเด็กต้องยืนห่างพ่อแม่').toBeGreaterThan(2);

  /* แตะผ่านเส้นทางจริงของเกม (raycast → walkToParent) */
  await page.evaluate(w => window.HouseFamilyUI.tapScene(w), who);
  /* ต้องเดินเข้ามาใกล้ก่อน แล้วการ์ดงานถึงจะเด้ง */
  await expect.poll(gap, { timeout: 30000 }).toBeLessThan(2);
  await expect(page.locator('#house-qz')).toBeVisible({ timeout: 15000 });
  expect(errors).toEqual([]);
});

/* ผู้ใช้แจ้ง 2026-08-09: แถบบนกว้างเต็มจอและโปร่งใส ถ้ากินคลิกทั้งแถว
   เด็กแตะพื้นตรงระดับแถบบนแล้วตัวละครไม่เดินเลย */
test('แถบบนต้องคลิกทะลุได้: แตะช่องว่างข้างปุ่มแล้วต้องโดน canvas ไม่ใช่แถบ', async ({ page }) => {
  const errors = await openHouse(page);
  const box = await page.evaluate(() => {
    const r = document.querySelector('.house-overlay-ui .quiz-top').getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  expect(box.w, 'แถวนี้กว้างเต็มจอจริง').toBeGreaterThan(600);

  /* จุดว่างท้ายแถว (เลยปุ่มสุดท้ายไปแล้ว) ต้องทะลุถึง canvas */
  const hit = await page.evaluate(b => {
    const el = document.elementFromPoint(Math.round(b.x + b.w - 90), Math.round(b.y + b.h / 2));
    return el ? el.id || el.tagName : 'none';
  }, box);
  expect(hit, 'ช่องว่างในแถบบนต้องคลิกทะลุถึง canvas').toBe('house-canvas');

  /* ปุ่มจริงต้องยังกดได้ (ไม่ใช่ปิด pointer-events ทั้งแถวจนกดปุ่มไม่ได้) */
  const onBtn = await page.evaluate(() => {
    const r = document.getElementById('house-edit-btn').getBoundingClientRect();
    const el = document.elementFromPoint(Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2));
    return el ? (el.closest('#house-edit-btn') ? 'btn' : (el.id || el.tagName)) : 'none';
  });
  expect(onBtn).toBe('btn');
  expect(errors).toEqual([]);
});
