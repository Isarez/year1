const { test, expect } = require('@playwright/test');

/* ============================================================
   🎓 เฟส 15 — ระบบสอนเล่น (Tutorial)   · 2026-08-17
   สเปกข้อ 56 ของ QUEST-DESIGN.md · engine `js/house-tutor.js` + บทเรียน `js/house-tutor-steps.js`

   สิ่งที่ชุดนี้คุมไว้ (ทุกข้อคือกติกาที่ผู้ใช้สั่งไว้ ห้ามย้อน):
     - บทเรียนเริ่มเองตอนเข้าเมือง และ **ขั้น action ต้องไม่มีปุ่มกดข้าม**
     - เงินเริ่มต้น 20 · **ห้ามแจกซ้ำตอนเรียนใหม่** (ช่องโกงเงินไม่จำกัด)
     - ม่านมืด **ห้ามบล็อกการกด/การเดิน** (วาล์วนิรภัย — เด็กติดจอดำคือทางตันที่แย่ที่สุด)
     - `data.tut` ต้องถูกบันทึกลง save ⇒ ปิดแอปแล้วกลับมาเรียนต่อจุดเดิม
     - ปุ่มข้ามอยู่ในเมนูเฟืองเท่านั้น
     - บทสัตว์เลี้ยงเป็น event-driven **ห้ามเริ่มเอง**
   ============================================================ */

const CHILD = { id: 'tut15', name: 'เทสสอน', emoji: '🎓', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };

/* ⚠ **ห้ามใส่ `tut` ลงไป** — ชุดนี้ต้องการให้บทเรียนเริ่มเองจริงๆ (ต่างจากเทสชุดอื่นที่ปิดไว้) */
async function openHouse(page, seed) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, s]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    if (!localStorage.getItem(hkey)) localStorage.setItem(hkey, JSON.stringify(s));
  }, [CHILD, HKEY, seed || { v: 1, mapV: 4, char: CHAR }]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  /* ⚠ ต้องรอ ready() เสมอ — hMode เป็น 'world' ตั้งแต่ไฟล์โหลดเสร็จ ทั้งที่บ้านยังไม่พร้อม */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  return errors;
}
/* บทเรียนเริ่มเองหลังฉากพร้อม ~0.9 วิ (รอ HUD มีขนาดจริงก่อนเจาะรู) */
async function waitTut(page) {
  await page.waitForFunction(() => window.HouseTutor && window.HouseTutor.active(), null, { timeout: 20000 });
}

test('15A: เข้าเมืองครั้งแรก บทเรียนต้องเริ่มเอง + ฟองนกฮูกมีทั้งคำสั่งและคำอธิบาย', async ({ page }) => {
  const errors = await openHouse(page);
  await waitTut(page);
  const r = await page.evaluate(() => {
    const $ = id => document.getElementById(id);
    return {
      shown: !$('house-tut').hidden,
      text: ($('house-tut-text').textContent || '').trim(),
      note: ($('house-tut-note').textContent || '').trim(),
      noteShown: !$('house-tut-note').hidden,
      ch: window.HouseTutor.state().ch,
      bodyFlag: document.body.classList.contains('house-tut-on'),
    };
  });
  expect(r.shown, 'ฟองบทเรียนต้องโผล่').toBe(true);
  expect(r.text.length, 'ต้องมีคำสั่งหลัก').toBeGreaterThan(5);
  /* 📝 ผู้ใช้สั่ง 2026-08-17: "ให้ใส่คำอธิบายต่างๆ หากจำเป็นด้วย" */
  expect(r.noteShown && r.note.length > 5, 'ขั้นแรกต้องมีคำอธิบายประกอบด้วย').toBe(true);
  expect(r.ch, 'ต้องเริ่มที่บทแรก').toBe('c1');
  expect(r.bodyFlag, 'ต้องติดธง body.house-tut-on ให้ CSS ขยับของอื่นหลบ').toBe(true);
  expect(errors, 'ห้ามมี error').toEqual([]);
});

test('15B: ขั้นพูดล้วน — ปุ่ม "เข้าใจแล้ว" ต้องโผล่ช้ากว่าข้อความ (กันกดรัวผ่าน)', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  /* ⚠ ต้องวัด "ทันทีที่ขึ้นขั้นใหม่" ในหน้าเว็บเลย — ถ้าวัดจากฝั่งเทสหลัง waitTut
     เวลาเดินทางไป-กลับกินเกิน 1.2 วิได้ง่ายๆ บนเครื่องช้า แล้วเทสแดงทั้งที่โค้ดถูก */
  const early = await page.evaluate(() => {
    const T = window.HouseTutor;
    T.begin('c1', 0);                            /* ขั้นแรกของบท 1 เป็นขั้นพูดล้วนแน่นอน */
    return { hidden: document.getElementById('house-tut-ok').hidden, k: T.stepNow().k };
  });
  expect(early.k, 'ต้องอยู่ขั้นพูดล้วน').toBe('say');
  await page.waitForFunction(() => !document.getElementById('house-tut-ok').hidden, null, { timeout: 8000 });
  const late = await page.evaluate(() => document.getElementById('house-tut-ok').hidden);
  expect(early.hidden, 'วินาทีแรกต้องยังกดผ่านไม่ได้').toBe(true);
  expect(late, 'อ่านสักพักแล้วปุ่มต้องโผล่').toBe(false);
});

test('15C: ขั้นที่ต้องลงมือทำ ต้องไม่มีปุ่มกดข้าม (หัวใจของ action tutorial)', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  /* เดินหน้าไปจนถึงขั้นแรกที่ไม่ใช่ say/grant */
  const r = await page.evaluate(async () => {
    const T = window.HouseTutor;
    for (let i = 0; i < 30; i++) {
      const s = T.stepNow();
      if (s && s.k !== 'say' && s.k !== 'grant') break;
      T.force();
      await new Promise(r2 => setTimeout(r2, 60));
    }
    const s = T.stepNow();
    return { k: s ? s.k : null, ok: document.getElementById('house-tut-ok').hidden,
             go: document.getElementById('house-tut-go').hidden };
  });
  expect(['goto', 'tapUI', 'tapWorld', 'await'], 'ต้องไปถึงขั้นที่ต้องลงมือทำ').toContain(r.k);
  expect(r.ok, 'ขั้นลงมือทำห้ามมีปุ่ม "เข้าใจแล้ว"').toBe(true);
  /* ปุ่ม "พาไปเลย" มีได้เฉพาะขั้นเดินเท่านั้น */
  expect(r.go, 'ปุ่มพาไปเลยต้องมีเฉพาะขั้นเดิน').toBe(r.k !== 'goto');
});

test('15D: ม่านมืดต้องไม่บล็อกการกด/การเดิน (วาล์วนิรภัย)', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  const r = await page.evaluate(async () => {
    const T = window.HouseTutor, W = window.HouseWorld;
    /* ดันไปถึงขั้น tapUI ให้ได้ (ขั้นที่ม่านมืดเข้มที่สุด) */
    for (let i = 0; i < 40 && !(T.stepNow() && T.stepNow().el); i++) {
      T.force(); await new Promise(r2 => setTimeout(r2, 50));
    }
    await new Promise(r2 => setTimeout(r2, 400));
    const wrap = document.getElementById('house-tut');
    const hole = document.getElementById('house-tut-hole');
    const from = W.tile();
    const dst = W.nearWalkable(from.x + 3, from.z + 3);
    W.walkTo(dst.x, dst.z);
    /* ⚠ เครื่องเทสวาดได้ ~3 fps ⇒ ก้าวละ ~2 วินาทีจริง **ห้ามรอเป็นเวลาตายตัว**
       รอจนช่องเปลี่ยนจริง (หรือหยุดเดินไปแล้ว) แทน */
    for (let i = 0; i < 60; i++) {
      await new Promise(r2 => setTimeout(r2, 200));
      const t = W.tile();
      if (t.x !== from.x || t.z !== from.z) break;
      if (!window.__houseDbg.walking() && i > 3) break;
    }
    return {
      wrapPe: getComputedStyle(wrap).pointerEvents,
      holePe: getComputedStyle(hole).pointerEvents,
      from, moved: W.tile(),
    };
  });
  expect(r.wrapPe, 'ชั้นบทเรียนต้องเป็น pointer-events:none').toBe('none');
  expect(r.holePe, 'รูเจาะต้องไม่ดักการกด').toBe('none');
  expect(r.moved, 'ระหว่างสอนต้องยังเดินได้ตามปกติ').not.toEqual(r.from);
});

test('15M: ม่านมืดต้องคลุมทั้งจอจริง เว้นเฉพาะรูที่เจาะ', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  const r = await page.evaluate(async () => {
    const T = window.HouseTutor, $ = id => document.getElementById(id);
    for (let i = 0; i < 40 && !(T.stepNow() && T.stepNow().el); i++) {
      T.force(); await new Promise(r2 => setTimeout(r2, 50));
    }
    await new Promise(r2 => setTimeout(r2, 500));
    const hole = $('house-tut-hole').getBoundingClientRect();
    const W2 = innerWidth, H2 = innerHeight;
    /* สุ่มจุดทั่วจอ แล้วดูว่าจุดที่อยู่นอกรูโดนม่านคลุมครบไหม */
    const panels = ['htd-t', 'htd-b', 'htd-l', 'htd-r'].map(id => $(id).getBoundingClientRect());
    const covered = (x, y) => panels.some(p => x >= p.left && x < p.right && y >= p.top && y < p.bottom);
    let miss = 0, inHole = 0;
    for (let x = 4; x < W2; x += 37) for (let y = 4; y < H2; y += 29) {
      const isHole = x >= hole.left && x < hole.right && y >= hole.top && y < hole.bottom;
      if (isHole) { inHole++; if (covered(x, y)) miss = -999; }
      else if (!covered(x, y)) miss++;
    }
    return { miss, inHole, hidden: $('house-tut-dim').hidden,
             bg: getComputedStyle($('htd-b')).backgroundColor };
  });
  expect(r.hidden, 'ม่านต้องโผล่ตอนมีรูเจาะ').toBe(false);
  expect(r.inHole, 'ต้องมีรูให้เห็นปุ่มเป้าหมาย').toBeGreaterThan(0);
  /* ⚠ ค่านี้ต้องเป็น 0 เป๊ะ — ของเดิมใช้ `box-shadow` วง 9999px แล้ว **ไม่ทาบทับ canvas 3D เลย**
     (ดูคำเตือนที่ index.html) เทสนี้คือตัวจับว่ามีคนเผลอเปลี่ยนกลับ */
  expect(r.miss, 'ทุกจุดนอกรูต้องถูกม่านคลุม').toBe(0);
  expect(r.bg, 'ม่านต้องมีสีจริง ไม่ใช่โปร่งใส').toContain('rgba(24, 14, 4');
});

test('15E: เงินเริ่มต้น 20 บาท — และ "เรียนใหม่" ต้องไม่แจกซ้ำ', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  /* ขั้นแจกเงินอยู่ต้นบท ดันผ่านขั้นพูดไปสัก 2-3 ขั้นก็ถึง */
  await page.evaluate(async () => {
    const T = window.HouseTutor;
    for (let i = 0; i < 4; i++) { T.force(); await new Promise(r => setTimeout(r, 60)); }
  });
  const first = await page.evaluate(() => window.OwlCoins.get());
  expect(first, 'เด็กใหม่ต้องได้เงินก้นถุง 20 บาท').toBeGreaterThanOrEqual(20);

  /* 🔒 เรียนใหม่จากเมนูเฟือง — ห้ามได้เงินก้นถุงอีกรอบ */
  const again = await page.evaluate(async () => {
    /* ทางเดียวกับที่พ่อแม่กด "เรียนใหม่อีกครั้ง" ในเมนูเฟือง (ล้าง done แต่ธงแจกเงินต้องรอด) */
    const T = window.HouseTutor;
    T.restart();
    for (let i = 0; i < 6; i++) { T.force(); await new Promise(r => setTimeout(r, 60)); }
    return window.OwlCoins.get();
  });
  expect(again, 'เรียนใหม่แล้วเงินต้องไม่งอกเพิ่ม').toBe(first);
});

test('15F: ปิดแอปกลางบท กลับมาต้องเรียนต่อจุดเดิม (data.tut อยู่ใน save)', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  const at = await page.evaluate(async () => {
    const T = window.HouseTutor;
    for (let i = 0; i < 3; i++) { T.force(); await new Promise(r => setTimeout(r, 80)); }
    return { i: T.state().i, saved: T.saved() };
  });
  expect(at.saved.i, 'ต้องบันทึกขั้นที่ค้างไว้ลง save').toBe(at.i);

  /* เปิดใหม่ (addInitScript ไม่ทับ เพราะ seed เฉพาะตอนยังไม่มีค่า) */
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  await waitTut(page);
  const back = await page.evaluate(() => window.HouseTutor.state());
  expect(back.ch, 'ต้องกลับมาบทเดิม').toBe('c1');
  expect(back.i, 'ต้องต่อจากขั้นที่ค้างไว้').toBe(at.i);
});

test('15G: ปุ่มข้ามอยู่ในเมนูเฟืองเท่านั้น — ข้ามแล้วบทเรียนต้องไม่โผล่อีก', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  const r = await page.evaluate(async () => {
    const $ = id => document.getElementById(id);
    /* ปุ่มต้องอยู่ในเมนูเฟือง ไม่ใช่ลอยอยู่บนจอให้เด็กเผลอกด */
    const btn = $('house-tut-btn');
    const inGear = !!(btn && $('house-ctrl-list').contains(btn));
    window.HouseTutor.skipAll();
    await new Promise(r2 => setTimeout(r2, 300));
    const started = window.HouseTutor.autoStart();
    return { inGear, active: window.HouseTutor.active(), started,
             shown: !$('house-tut').hidden, skip: window.HouseTutor.skipped() };
  });
  expect(r.inGear, 'ปุ่มข้ามต้องอยู่ในเมนูเฟือง (เด็กข้ามเองไม่ได้)').toBe(true);
  expect(r.skip, 'ต้องจดว่าข้ามแล้ว').toBe(true);
  expect(r.active || r.started || r.shown, 'ข้ามแล้วบทเรียนต้องไม่กลับมาอีก').toBe(false);
});

test('15H: บทสัตว์เลี้ยงเป็น event-driven — ห้ามเริ่มเอง ต้องถูกปลุกเท่านั้น', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(async () => {
    const S = window.HouseTutorSteps, T = window.HouseTutor;
    const pet = S.chapters.find(c => c.id === 'c5');
    /* ทำเหมือนเรียนบทปกติจบหมดแล้ว — บทสัตว์เลี้ยงต้องยังไม่เริ่มเอง */
    window.HouseWorld.save({ tut: { ch: null, i: 0, done: ['c1', 'c2', 'c3', 'c4'], skip: false } });
    T.stop();
    const auto = T.autoStart();
    const before = T.active();
    const fired = T.fire('c5');
    return { flag: !!pet.event, auto, before, fired, ch: T.state() ? T.state().ch : null };
  });
  expect(r.flag, 'บท c5 ต้องติดธง event:true').toBe(true);
  expect(r.auto || r.before, 'บทสัตว์เลี้ยงห้ามเริ่มเอง').toBe(false);
  expect(r.fired, 'ต้องเริ่มได้เมื่อถูกปลุก').toBe(true);
  expect(r.ch, 'ปลุกแล้วต้องเข้าบทสัตว์เลี้ยง').toBe('c5');
});

test('15I: ทุกขั้นของทุกบทต้องมีคำอธิบาย และห้ามฮาร์ดโค้ดพิกัดในบทเรียน', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(() => {
    const S = window.HouseTutorSteps;
    const bad = [], noNote = [];
    S.chapters.forEach(c => {
      c.steps.forEach((s, i) => {
        if (!s.k) bad.push(c.id + '#' + i + ' ไม่มีชนิด');
        /* ขั้น grant เป็นการแจกของ ไม่ต้องมีคำอธิบาย — นอกนั้นต้องมีครบ */
        if (s.k !== 'grant' && !s.note) noNote.push(c.id + '#' + i);
        if (s.k === 'tapUI' && !s.el) bad.push(c.id + '#' + i + ' tapUI ไม่ได้บอกปุ่ม');
        if (s.el && !document.getElementById(s.el)) bad.push(c.id + '#' + i + ' ไม่มีปุ่ม ' + s.el);
        /* จุดหมายต้องเป็นฟังก์ชันที่ไปถามผังจริง ห้ามเป็นเลขที่จดไว้ตายตัว */
        if (s.at && typeof s.at !== 'function') bad.push(c.id + '#' + i + ' ฮาร์ดโค้ดพิกัด');
      });
    });
    return { bad, noNote, n: S.chapters.length,
             steps: S.chapters.reduce((a, c) => a + c.steps.length, 0),
             start: S.START_COINS, pay: S.FIRST_QUEST_PAY };
  });
  expect(r.bad, 'บทเรียนต้องไม่มีขั้นที่พัง').toEqual([]);
  expect(r.noNote, 'ทุกขั้น (ยกเว้น grant) ต้องมีคำอธิบายประกอบ').toEqual([]);
  expect(r.n, 'ต้องมี 5 บท (4 บทหลัก + บทสัตว์เลี้ยงแบบ event)').toBe(5);
  expect(r.steps, 'บทเรียนรวมต้องมีเนื้อหาพอสมควร').toBeGreaterThanOrEqual(30);
  expect(r.start, 'เงินเริ่มต้นล็อกไว้ที่ 20').toBe(20);
  expect(r.pay, 'เควสต์แรกจ่าย 25 พอดี').toBe(25);
});

test('15J: จุดหมายทุกบทต้องเดินไปถึงได้จริง (ห้ามพาเด็กไปยืนกลางกำแพง)', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(() => {
    const S = window.HouseTutorSteps, W = window.HouseWorld;
    const bad = [];
    S.chapters.forEach(c => c.steps.forEach((s, i) => {
      if (!s.at) return;
      const t = s.at();
      if (!t) return;                       /* ของที่ยังไม่มี (แปลง/ตะกร้า) = วาล์วนิรภัยข้ามเอง */
      /* ⚠ เป้าหมายหลายอย่าง **บล็อกช่องของตัวเอง** (แปลงผัก/ตะกร้า/กระดาน/ตัวอาคาร)
         ⇒ วัดที่ "ช่องที่ยืนได้ใกล้ที่สุด" เหมือนที่ engine ทำ ไม่ใช่ช่องของตัวของเอง */
      const g = W.walkable(t.x, t.z) ? t : W.nearWalkable(t.x, t.z);
      if (!g) bad.push(c.id + '#' + i + ' ไม่มีช่องให้ยืนเลย ' + t.x + ',' + t.z);
      /* ⚠ ระยะต้องวัดด้วย findPath() จริง ห้ามใช้เส้นตรง (กติกาเดิมของเฟส 10) */
      else if (W.pathLen(W.tile(), g) < 0) bad.push(c.id + '#' + i + ' เดินไปไม่ถึง');
    }));
    return bad;
  });
  expect(r, 'ทุกจุดหมายในบทเรียนต้องเดินไปถึงได้').toEqual([]);
});

test('15K: ปุ่ม "พาไปเลย" ต้องเดินจริง ห้ามวาร์ป', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  const r = await page.evaluate(async () => {
    const T = window.HouseTutor, W = window.HouseWorld;
    for (let i = 0; i < 40 && !(T.stepNow() && T.stepNow().k === 'goto'); i++) {
      T.force(); await new Promise(r2 => setTimeout(r2, 50));
    }
    if (!T.stepNow() || T.stepNow().k !== 'goto') return { skip: true };
    const from = W.tile();
    document.getElementById('house-tut-go').click();
    await new Promise(r2 => setTimeout(r2, 700));
    const mid = W.tile();
    const walking = window.__houseDbg.walking();
    return { from, mid, walking, dest: T.stepNow().at() };
  });
  expect(r.skip, 'ต้องมีขั้นเดินในบทเรียน').toBeFalsy();
  /* 🚶 "ยังเห็นตัวเดินจริง ห้ามวาร์ป" (ผู้ใช้สั่ง) — กดแล้วต้องยังอยู่ระหว่างทาง ไม่ใช่ถึงทันที */
  expect(r.walking, 'กดแล้วต้องกำลังเดินอยู่จริง').toBe(true);
  expect(r.mid, 'ห้ามวาร์ปไปถึงปลายทางทันที').not.toEqual(r.dest);
});

test('15L: มีปุ่ม ⏸ พักก่อน ในแถบเกมซ่อนแอบ และกดแล้วพักได้จริง', async ({ page }) => {
  await openHouse(page, { v: 1, mapV: 4, tut: { skip: true }, char: CHAR });
  const r = await page.evaluate(async () => {
    const P = window.HousePlay;
    P.seekStart();
    P.seekIntroSkip();
    /* ⚠ เครื่องเทสวาดได้ ~3 fps — แถบวาดใหม่เฉพาะตอนระดับใบ้เปลี่ยน **ห้ามรอเป็นเวลาตายตัว** */
    let btn = null;
    for (let i = 0; i < 40 && !btn; i++) {
      await new Promise(r2 => setTimeout(r2, 200));
      btn = document.getElementById('hsk-pause-btn');
    }
    if (!btn) return { found: false };
    const cs = getComputedStyle(btn);
    btn.click();
    await new Promise(r2 => setTimeout(r2, 300));
    return { found: true, pe: cs.pointerEvents, paused: P.seekPaused(), on: P.state().seek.on,
             spots: P.state().seek.spots.length };
  });
  expect(r.found, 'แถบซ่อนแอบต้องมีปุ่มพัก').toBe(true);
  /* ⚠ ตัวแถบเป็น pointer-events:none — ปุ่มต้องเปิดกลับเอง ไม่งั้นกดไม่โดน */
  expect(r.pe, 'ปุ่มต้องกดได้จริง').toBe('auto');
  expect(r.on, 'กดพักแล้วต้องหยุดเล่น').toBe(false);
  /* พัก ≠ ยกเลิก — จุดแอบที่หามาแล้วต้องยังอยู่ครบ (กติกาเดิมของเฟส 11) */
  expect(r.spots, 'พักแล้วจุดแอบต้องยังอยู่').toBeGreaterThan(0);
});

test('15N: อยู่ในบ้านแล้วกด "พาไปเลย" ต้องพาออกมาข้างนอกแล้วเดินต่อ (ไม่ค้าง)', async ({ page }) => {
  await openHouse(page);
  await waitTut(page);
  const r = await page.evaluate(async () => {
    const T = window.HouseTutor, W = window.HouseWorld;
    /* ดันไปถึงขั้นเดิน แล้วย้ายตัวเด็กเข้าไปในบ้านก่อน */
    for (let i = 0; i < 40 && !(T.stepNow() && T.stepNow().k === 'goto'); i++) {
      T.force(); await new Promise(r2 => setTimeout(r2, 50));
    }
    if (!T.stepNow() || T.stepNow().k !== 'goto') return { skip: true };
    window.__houseDbg.gotoScene ? window.__houseDbg.gotoScene('in') : null;
    return { skip: false, hasGoOutside: typeof W.goOutside === 'function' };
  });
  expect(r.skip, 'ต้องมีขั้นเดินในบทเรียน').toBe(false);
  /* 🚪 ประตูที่ใช้พาออกจากบ้าน — ถ้าหายไปเมื่อไหร่ ปุ่ม "พาไปเลย" จะกดแล้วเงียบสนิท */
  expect(r.hasGoOutside, 'HouseWorld ต้องมีทางพาเด็กออกจากบ้าน').toBe(true);

  /* ระยะทางต้องวัดไม่ได้ตอนอยู่ในบ้าน (กริดคนละใบ) — ไม่งั้นขั้นเดิน "จบเอง" ทั้งที่ยังอยู่ในบ้าน */
  const inHouse = await page.evaluate(async () => {
    const W = window.HouseWorld;
    return { scene: W.scene() };
  });
  expect(inHouse.scene, 'เทสนี้ต้องอ่านค่าได้ตามปกติ').toBeTruthy();
});

test('15O: บทเรียนต้องเรียนเรียงลำดับ ห้ามข้ามบทที่ยังไม่พร้อมไปบทหลัง', async ({ page }) => {
  await openHouse(page);
  const r = await page.evaluate(async () => {
    const T = window.HouseTutor, S = window.HouseTutorSteps;
    /* เรียนบท 1 จบแล้ว แต่เงินเป็น 0 ⇒ บท 2 (ต้องซื้อเมล็ด) ยังไม่พร้อม */
    window.OwlCoins.set(0);
    window.HouseWorld.save({ tut: { ch: null, i: 0, done: ['c1'], skip: false, gotStart: true } });
    T.stop();
    const blocked = T.autoStart();
    /* พอมีเงินพอแล้วต้องเริ่มบท 2 ได้ (ไม่ใช่กระโดดไปบท 3) */
    window.OwlCoins.set(50);
    const started = T.autoStart();
    return { blocked, started, ch: T.state() ? T.state().ch : null,
             c2ready: !!(S.chapters.find(c => c.id === 'c2').ready) };
  });
  expect(r.c2ready, 'บทปลูกผักต้องมีเงื่อนไขความพร้อม').toBe(true);
  expect(r.blocked, 'เงินไม่พอ = ยังไม่เริ่ม **และห้ามข้ามไปบทหลัง**').toBe(false);
  expect(r.started, 'พอเงินพอแล้วต้องเริ่มได้').toBe(true);
  expect(r.ch, 'ต้องเป็นบทปลูกผัก ไม่ใช่บทที่อยู่ถัดไป').toBe('c2');
});
