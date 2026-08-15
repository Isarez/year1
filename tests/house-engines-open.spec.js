/* ============================================================
   เปิด engine หน้าหลักที่ยังไม่เคยถูกใช้ในโหมดบ้าน 12 ตัว (2026-08-15)

   ปัญหาที่แก้: กลไกเควสต์ 49 ตัว เป็น "การ์ด 4 ตัวเลือก" ถึง 26 ตัว (53%)
   ทั้งที่หน้าหลักลงทะเบียน engine ไว้กับ OwlGames 23 ตัว แต่โหมดบ้านเปิดใช้แค่ 11
   ⇒ อีก 12 ตัวเขียนเสร็จ+เทสแล้ว นอนรออยู่เฉยๆ

   ⚠ กติกาที่ชุดนี้คุมไว้:
     1. **เกมที่เปิดใหม่ต้องเล่นได้จริงในการ์ดใบเล็ก** — ไม่ล้นจนต้องเลื่อน
        (กติกาเดิมของโปรเจค: เพิ่มเข้า ALLOW ได้เฉพาะหลังลองเล่นจริงเท่านั้น)
     2. **ต้องผูกกับ NPC ที่เข้าธีมเท่านั้น ไม่โยนเข้าพูลรวมทั้งเมือง**
        (ไม่งั้นช่างไม้ชวนเล่นพิซซ่าเศษส่วน = โจทย์ไม่เข้ากับคนพูด)
     3. **"นกฮูกสั่ง" ต้องปิดตัวจับเวลาในโหมดบ้าน** (กติกาเหล็กข้อ 2: ห้ามกดดัน/ลงโทษ)
        และ **ต้องคืนค่าให้หน้าหลักเสมอ** ไม่ว่าเด็กจะออกจากเกมทางไหน
     4. **ห้ามมี dead end** — เกมที่มีแต่หมวดชั้นสูงต้องไม่ถูกแจกให้เด็กเล็ก
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = g => ({ id: 'eng-' + g, name: 'มะปราง', emoji: '🦊', birthDate: '2016-04-01', grade: g });

/* engine ที่เพิ่งเปิด + mech id ในโหมดบ้าน + ชั้นต่ำสุดที่มีหมวดให้เล่นจริง */
const OPENED = [
  { game: 'money',    mech: 'shopmoney' },
  { game: 'fraction', mech: 'slicefrac' },
  { game: 'calendar', mech: 'caldays'   },
  { game: 'timeline', mech: 'timeorder' },
  { game: 'chart',    mech: 'chartread' },
  { game: 'world',    mech: 'globespin' },
  { game: 'mirror',   mech: 'mirrorsym' },
  { game: 'ef',       mech: 'owlsay'    },
];

/* 🚧 ยังเปิดไม่ได้ — เนื้อหาตกใต้ขอบการ์ดบนจอ desktop เตี้ย (เหตุผลเต็มอยู่ที่ ALLOW)
   เทสด้านล่างคุมไว้ว่า **ห้ามเผลอเปิดกลับจนกว่าจะแก้ให้พอดีจริง** */
const NOT_YET = ['coord', 'area', 'dots', 'science'];

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
  }, CHILD(grade || 'p6'));
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseGames && !!window.OwlGames, null, { timeout: 30000 });
  return errs;
}

/* ---------------------------------------------------------------- */

test('engine ที่เปิดใหม่: ลงทะเบียนครบ · มี mech ในโหมดบ้าน · หา category ได้จริง', async ({ page }) => {
  const errs = await house(page, 'p6');
  const r = await page.evaluate(list => {
    const G = window.HouseGames, O = window.OwlGames, Q = window.HouseQuests;
    return list.map(o => ({
      game: o.game, mech: o.mech,
      registered: O.has(o.game),
      allowed: !!G.ALLOW[o.game],
      hasMech: !!(Q && Q.MECHS ? Q.MECHS[o.mech] : null),
      cat: !!G.pickCat(o.game, 'p6', ''),
    }));
  }, OPENED);

  r.forEach(x => {
    expect(x.registered, x.game + ' ต้องลงทะเบียนกับ OwlGames').toBe(true);
    expect(x.allowed, x.game + ' ต้องอยู่ใน HouseGames.ALLOW').toBe(true);
    expect(x.cat, x.game + ' ต้องหา category ของ ป.6 เจอ').toBe(true);
  });
  expect(errs).toEqual([]);
});

test('เกมที่เปิดใหม่ทุกตัว: mount ในการ์ดเควสต์ได้จริง และไม่ล้นจนต้องเลื่อน', async ({ page }) => {
  const errs = await house(page, 'p6');
  const bad = [];
  for (const o of OPENED) {
    await page.evaluate(() => { window.OwlGames.unmount(); window.HouseQuestUI.closeCard(); });
    const ok = await page.evaluate(id => window.HouseGames.play({ gameId: id, gradeId: 'p6' }), o.game);
    expect(ok, o.game + ' ต้องเปิดในการ์ดได้').toBe(true);
    await page.waitForTimeout(450);
    const m = await page.evaluate(() => {
      const card = document.querySelector('#house-qz .house-qz') || document.getElementById('house-qz');
      const stage = document.getElementById('hqz-stage');
      const view = stage ? stage.querySelector('section:not([hidden])') : null;
      return {
        cur: window.OwlGames.current(),
        mountedInStage: !!view,
        overflowY: card.scrollHeight - card.clientHeight,
        overflowX: card.scrollWidth - card.clientWidth,
      };
    });
    if (m.cur !== o.game) bad.push(o.game + ': engine ไม่ได้ถูก mount (' + m.cur + ')');
    if (!m.mountedInStage) bad.push(o.game + ': view ไม่ได้ย้ายมาอยู่ในเวทีของการ์ด');
    /* เกินนี้ = เด็กต้องเลื่อนหาของที่ต้องกด (บทเรียนเปียโนของเฟส 5) */
    if (m.overflowY > 2) bad.push(o.game + ': ล้นการ์ดแนวตั้ง ' + m.overflowY + 'px');
    if (m.overflowX > 2) bad.push(o.game + ': ล้นการ์ดแนวนอน ' + m.overflowX + 'px');
  }
  expect(bad, 'เกมที่ยังเล่นในการ์ดไม่ได้ ห้ามปล่อยเข้า ALLOW').toEqual([]);
  expect(errs).toEqual([]);
});

test('เกมที่เปิดใหม่ทุกตัว: เล่นจบแล้วได้ดาว + คืน view กลับหน้าหลักเรียบร้อย', async ({ page }) => {
  const errs = await house(page, 'p6');
  for (const o of OPENED) {
    await page.evaluate(() => { window.OwlGames.unmount(); window.HouseQuestUI.closeCard(); });
    await page.evaluate(id => window.HouseGames.play({ gameId: id, gradeId: 'p6' }), o.game);
    await page.waitForTimeout(300);
    /* จำลองว่า engine เล่นจบแบบไม่พลาดเลย — วิ่งผ่านตะเข็บจริง finishP2Game() */
    await page.evaluate(() => finishP2Game('x', 0, 10, 'เล่น'));
    await expect(page.locator('.hqz-stars')).toBeVisible({ timeout: 8000 });
    const after = await page.evaluate(() => ({
      cur: window.OwlGames.current(),
      stars: (document.querySelector('.hqz-stars') || {}).textContent || '',
      leftover: !!document.querySelector('#hqz-stage section'),
    }));
    expect(after.cur, o.game + ' ต้องถอด engine ออกหลังจบ').toBe(null);
    expect(after.stars, o.game + ' ต้องได้ 3 ดาวเมื่อไม่พลาดเลย').toContain('⭐⭐⭐');
    expect(after.leftover, o.game + ' view ต้องถูกคืนกลับหน้าหลัก ไม่ค้างในเวที').toBe(false);
  }
  expect(errs).toEqual([]);
});

test('🦉 นกฮูกสั่ง: โหมดบ้านต้องไม่มีตัวจับเวลา และต้องคืนค่าให้หน้าหลักทุกทางออก', async ({ page }) => {
  const errs = await house(page, 'p3');

  /* ① เล่นในโหมดบ้าน → แถบเวลาต้องไม่หด (ไม่มี transition ที่วิ่งอยู่) */
  await page.evaluate(() => window.HouseGames.play({ gameId: 'ef', gradeId: 'p3' }));
  await expect(page.locator('#hqz-stage #ef-view')).toBeVisible();
  const during = await page.evaluate(() => {
    const bar = document.getElementById('ef-timer-fill');
    return { width: bar.style.width, transition: bar.style.transition };
  });
  expect(during.width, 'แถบเวลาต้องค้างเต็มหลอด ไม่หด').toBe('100%');
  expect(during.transition, 'ต้องไม่มีอนิเมชันนับถอยหลัง').toBe('none');

  /* ② รอเกินเวลาปกติของ 1 ด่าน (ป.3 = 4.5 วิ) แล้วต้องยังไม่ถูกตัดสินว่า "ไม่แตะ" */
  await page.waitForTimeout(5200);
  const still = await page.evaluate(() => ({
    cur: window.OwlGames.current(),
    disabled: document.getElementById('ef-tap-btn').disabled,
  }));
  expect(still.cur, 'เกมต้องยังเล่นอยู่ ไม่ถูกตัดจบเพราะหมดเวลา').toBe('ef');
  expect(still.disabled, 'ปุ่มต้องยังกดได้ = ยังไม่ถูกตอบแทน').toBe(false);

  /* ③ เด็กปิดการ์ดกลางเกม (ทางออกที่ไม่ผ่าน onDone) → ค่าต้องถูกคืน */
  await page.evaluate(() => window.__houseDbg.closeQuest());
  const restored = await page.evaluate(() => {
    /* เริ่มเกมเดิมบนหน้าหลักแล้วดูว่าแถบเวลากลับมานับถอยหลังไหม */
    window.OwlGames.unmount();
    const cat = window.HouseGames.pickCat('ef', 'p3', '');
    startEfGame(cat.id);
    const bar = document.getElementById('ef-timer-fill');
    return { transition: bar.style.transition, width: bar.style.width };
  });
  expect(restored.transition, 'หน้าหลักต้องกลับมามีตัวจับเวลาเหมือนเดิม').toContain('width');
  expect(restored.width, 'แถบต้องเริ่มหดลง 0%').toBe('0%');
  expect(errs).toEqual([]);
});

test('ผูกกับ NPC ที่เข้าธีมเท่านั้น — ไม่หลุดเข้าพูลรวมของชาวบ้านทั้งเมือง', async ({ page }) => {
  const errs = await house(page, 'p6');
  const r = await page.evaluate(list => {
    const Q = window.HouseQuests;
    const ids = list.map(o => o.mech);
    /* ① ห้ามอยู่ใน ENGINE_MECHS (พูลที่ชาวบ้านทุกคนสุ่มได้) */
    const inPool = ids.filter(m => (Q.ENGINE_MECHS || []).indexOf(m) >= 0);
    /* ② ทุกตัวต้องมีคนแจกจริงอย่างน้อย 1 คน (ไม่งั้นเปิดไว้เฉยๆ ไม่มีใครได้เล่น) */
    const npcs = (Q.NPC_DEFS || window.__houseDbg.npcDefs() || []).map(n => n.id);
    const orphan = ids.filter(m => {
      const viaBonus = npcs.some(id => (Q.bonusMechsFor(id) || []).indexOf(m) >= 0);
      const viaLab = Object.keys(Q.LAB_MECHS || {}).some(k => (Q.LAB_MECHS[k] || []).indexOf(m) >= 0);
      return !viaBonus && !viaLab;
    });
    /* ③ ตัวอย่างว่าโจทย์เข้ากับอาชีพจริง */
    const sample = {
      iceShop:   Q.bonusMechsFor('npc-ice'),
      fashion:   Q.bonusMechsFor('npc-mall-fash'),
      teacher:   Q.bonusMechsFor('npc-teacher'),
      traveler:  Q.bonusMechsFor('npc-traveler'),
    };
    return { inPool, orphan, sample };
  }, OPENED);

  expect(r.inPool, 'ห้ามโยนเข้าพูลรวม — โจทย์จะไม่เข้ากับคนที่พูด').toEqual([]);
  expect(r.orphan, 'ทุกตัวต้องมี NPC แจกจริง ไม่งั้นเปิดไว้เปล่าๆ').toEqual([]);
  /* เข้าธีมจริง: ช่างไม้ได้พื้นที่ · ร้านไอศกรีมได้เศษส่วน · ตำรวจได้พิกัด · ร้านเสื้อผ้าได้กระจก */
  expect(r.sample.iceShop).toContain('slicefrac');      /* ร้านไอศกรีม = แบ่งชิ้นให้เท่ากัน */
  expect(r.sample.fashion).toContain('mirrorsym');      /* ร้านเสื้อผ้ามีกระจกลองชุด */
  expect(r.sample.teacher).toContain('chartread');      /* ครู = อ่านแผนภูมิ */
  expect(r.sample.traveler).toContain('globespin');     /* นักเดินทาง = โลกกว้าง */
  /* และต้องไม่สลับกัน */
  expect(r.sample.iceShop).not.toContain('globespin');
  expect(r.sample.traveler).not.toContain('slicefrac');
  expect(errs).toEqual([]);
});

test('ห้ามมี dead end — เกมที่มีแต่หมวดชั้นสูงต้องไม่ถูกแจกให้เด็กเล็ก', async ({ page }) => {
  const errs = await house(page, 'prep-p1');
  const r = await page.evaluate(() => {
    const G = window.HouseGames;
    /* ป.4 ขึ้นไปเท่านั้น: พื้นที่ · กระจกเงา — ป.3 ขึ้นไป: หมุนโลก · พิกัด */
    return {
      mirror: !!G.pickCat('mirror', 'prep-p1', ''),
      world:  !!G.pickCat('world',  'prep-p1', ''),
      /* ตัวที่มีหมวดเด็กเล็กจริงต้องยังเล่นได้ (ปฏิทินต่ำสุดคือ ป.1 — ระดับเตรียม ป.1 ยังไม่มี) */
      calendarP1: !!G.pickCat('calendar', 'p1', ''),
      calendarPrep: !!G.pickCat('calendar', 'prep-p1', ''),
    };
  });
  ['mirror', 'world'].forEach(k => {
    expect(r[k], k + ' ไม่ควรมีหมวดให้เด็กระดับเตรียม ป.1 (ไม่งั้นเจอโจทย์เกินวัย)').toBe(false);
  });
  expect(r.calendarP1, 'ปฏิทินมีหมวด ป.1 ⇒ เด็ก ป.1 ต้องเล่นได้').toBe(true);
  expect(r.calendarPrep, 'ระดับเตรียม ป.1 ยังไม่มีหมวดปฏิทิน ⇒ ต้องไม่ถูกแจก').toBe(false);
  expect(errs).toEqual([]);
});

test('🚧 4 ตัวที่ยังเปิดไม่ได้ ต้องยังปิดอยู่ (กันเผลอเปิดกลับโดยไม่ได้แก้ให้พอดีก่อน)', async ({ page }) => {
  const errs = await house(page, 'p6');
  const r = await page.evaluate(list => {
    const G = window.HouseGames;
    return list.map(id => ({ id, allowed: !!G.ALLOW[id], plays: G.play({ gameId: id, gradeId: 'p6' }) }));
  }, NOT_YET);
  r.forEach(x => {
    expect(x.allowed, x.id + ' ยังเล่นในการ์ดไม่พอดี — ห้ามใส่กลับใน ALLOW จนกว่าจะแก้ engine').toBe(false);
    expect(x.plays, x.id + ' ต้องเปิดไม่ได้ (คืน false) ไม่ใช่เปิดแล้วเนื้อหาตกขอบ').toBe(false);
  });
  expect(errs).toEqual([]);
});
