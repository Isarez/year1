/* ============================================================
   👋 เฟส 18 — เพื่อนบ้านที่จำเด็กได้ (Neighbour Memory) · ข้อ 57.3 ของ QUEST-DESIGN.md

   กติกาที่ชุดนี้คุมไว้ (ห้ามย้อน):
     - **ห้ามมีค่าความสนิทที่ลดลง** เมื่อไม่ได้เล่นหลายวัน (กติกาเหล็กข้อ 2 · ห้ามลงโทษ)
     - **ห้ามล็อกเนื้อหาไว้หลังความสนิท** — คนที่ยังไม่เคยช่วยต้องแจกงาน/เปิดร้านได้เหมือนเดิม
     - ความถนัด = **เพิ่มโอกาส ไม่ใช่ล็อก** (ล็อกแล้วเด็กเจอโจทย์เดิมทุกวัน)
     - เก็บเฉพาะคนที่เคยช่วยจริง **ไม่ seed ทั้งเมือง** (NPC 69 คน)
     - กลไกที่ถูกปิดไว้ (`testOnly`) ห้ามหลุดออกมาทางความถนัด
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p18', name: 'เพื่อนบ้าน', emoji: '👋', birthDate: '2018-06-01', grade: 'p3' };
const HKEY = 'p1quiz_house_' + CHILD.id;
/* พูลกลไกขั้นต่ำที่ถือว่า "เฉลี่ยได้จริง" — ต่ำกว่านี้แปลว่าพูลถูกตัดโดยไม่ตั้งใจ */
const Q_POOL_MIN = 8;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };

async function house(page, extra) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(([c, hkey, ch, ex]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(Object.assign({ v: 1, mapV: 4, char: ch }, ex || {})));
  }, [CHILD, HKEY, CHAR, extra]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseQuests && !!window.__houseDbg.neigh(), null, { timeout: 30000 });
  return errs;
}

/* ---------------------------------------------------------------- */

test('18A: ทำงานให้ใครเสร็จ = จดไว้ในความจำของคนนั้น (นับตอนงานจบ ไม่ใช่ตอนรับงาน)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(hkey => {
    const N = window.__houseDbg.neigh();
    const a = N.onQuestDone('npc-mart', 'quiz');
    const b = N.onQuestDone('npc-mart', 'quiz');
    const saved = JSON.parse(localStorage.getItem(hkey) || '{}').npc || {};
    return { a, b, saved, lvl: N.level('npc-mart'), other: N.level('npc-pet') };
  }, HKEY);
  expect(r.a.n).toBe(1);
  expect(r.a.levelUp, 'งานแรกต้องขึ้นขั้นความสนิททันที (เห็นผลวันแรก)').toBe(true);
  expect(r.b.n).toBe(2);
  expect(r.saved.who['npc-mart'].m.quiz).toBe(2);
  expect(r.lvl).toBeGreaterThanOrEqual(1);
  expect(r.other, 'คนที่ยังไม่เคยช่วยต้องเป็นขั้น 0').toBe(0);
  expect(errs).toEqual([]);
});

test('18B: ความสนิทห้ามลดลงเลย แม้เว้นไปหลายวัน', async ({ page }) => {
  /* seed เหมือนเด็กที่เคยช่วยไว้ 8 งานเมื่อนานมาแล้ว (วันเก่ามาก) */
  await house(page, { npc: { v: 1, who: { 'npc-mart': { n: 8, d: '2020-1-1', m: { quiz: 8 } } } } });
  const r = await page.evaluate(() => {
    const N = window.__houseDbg.neigh();
    const before = N.level('npc-mart');
    N.sync();
    return { before, after: N.level('npc-mart'), n: N.doneCount('npc-mart'), max: N.LV_MAX };
  });
  expect(r.before).toBe(3);
  expect(r.after, 'ผ่านไปนานแค่ไหนความสนิทต้องเท่าเดิม').toBe(3);
  expect(r.n).toBe(8);
});

test('18C: เคยช่วยแล้ว NPC ต้องทักถึงเรื่องนั้นก่อนบทปกติ · ยังไม่เคยช่วย = บทเดิมเป๊ะ', async ({ page }) => {
  await house(page, { npc: { v: 1, who: { 'npc-mart': { n: 4, d: '2020-1-1', m: { quiz: 4 } } } } });
  const r = await page.evaluate(() => {
    const N = window.__houseDbg.neigh();
    return { known: N.greeting('npc-mart'), unknown: N.greeting('npc-pet') };
  });
  expect(r.known && r.known.length, 'คนที่เคยช่วยต้องมีคำทักพิเศษ').toBeGreaterThan(5);
  expect(r.unknown, 'คนที่ยังไม่เคยช่วยต้องไม่มีคำทักพิเศษ (ใช้บทเดิม)').toBe(null);
  /* ห้ามมีคำต่อว่า/เร่งในคำทักทุกขั้น */
  const bad = await page.evaluate(() => {
    const N = window.__houseDbg.neigh();
    const words = ['หายไปไหน', 'ทำไมไม่', 'ไม่มาเลย', 'ช้า', 'แย่'];
    const all = [];
    for (let n = 1; n <= 12; n++) {
      const s = window.__houseDbg.neigh();
      all.push(s.greeting('npc-mart') || '');
      s.bumpTalk('npc-mart');
    }
    return all.filter(t => words.some(w => t.indexOf(w) >= 0));
  });
  expect(bad, 'คำทักต้องไม่มีคำต่อว่า/เร่ง').toEqual([]);
});

test('18D: ห้ามล็อกเนื้อหาหลังความสนิท — คนที่ไม่เคยช่วยต้องยังแจกงานได้ปกติ', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const specs = (Q.state().npcIds || []).map(id => Q.specForNpc(id)).filter(Boolean);
    return { n: specs.length, mechs: specs.map(s => s.mech) };
  });
  expect(r.n, 'ต้องมีงานให้ทำตั้งแต่วันแรกโดยไม่ต้องสนิทกับใคร').toBeGreaterThan(0);
  expect(r.mechs.every(m => !!m)).toBe(true);
});

test('18E: งานที่ถนัด = เพิ่มโอกาส ไม่ใช่ล็อก (ต้องยังได้กลไกอื่นอีกหลายแบบ)', async ({ page }) => {
  await house(page, { npc: { v: 1, who: { 'npc-mart': { n: 9, d: '2020-1-1', m: { melody: 9 } } } } });
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, N = window.__houseDbg.neigh();
    const fav = N.favMech('npc-mart');
    /* สุ่มงานของคนนี้ 200 รอบด้วย rng ธรรมดา แล้วดูการกระจาย */
    const cnt = {};
    for (let i = 0; i < 200; i++) {
      const m = Q.rollWorkMech(Math.random, 'npc-mart');
      cnt[m] = (cnt[m] | 0) + 1;
    }
    return { fav, kinds: Object.keys(cnt).length, favShare: (cnt[fav] | 0) / 200,
             quiz: (cnt.quiz | 0) / 200, pool: Q.workPool('npc-mart').length };
  });
  expect(r.fav, 'ช่วยคนเดิมด้วยกลไกเดิมหลายครั้ง = กลายเป็นงานที่ถนัด').toBe('melody');
  expect(r.kinds, 'ต้องยังสุ่มได้หลายแบบ ไม่ใช่แบบเดียว').toBeGreaterThan(3);
  expect(r.favShare, 'งานถนัดต้องไม่ครองเกินครึ่ง').toBeLessThan(.5);
  /* 🔄 **เกณฑ์ quiz ถูกกลับด้าน 2026-08-20 (ผู้ใช้สั่ง) ไม่ได้ลบทิ้ง**
     เดิมบังคับว่า quiz ต้อง ≥30% และต้องเจอบ่อยกว่างานถนัด (ยุคที่ quiz ถูกล็อกไว้ 40%)
     ตอนนี้ทุกกลไกเฉลี่ยเท่ากัน ⇒ quiz ต้อง **ไม่ครองพูล** แต่ก็ **ต้องยังอยู่ในพูลเสมอ** */
  expect(r.quiz, 'quiz ต้องไม่ครองพูลอีกต่อไป').toBeLessThan(.25);
  expect(r.quiz, 'แต่ quiz ต้องยังถูกแจกอยู่ ห้ามหายไปเลย').toBeGreaterThan(0);
  expect(Q_POOL_MIN, 'พูลของร้านสะดวกซื้อต้องกว้างพอให้เฉลี่ยได้จริง').toBeLessThan(r.pool);
});

test('18F: เก็บเฉพาะคนที่เคยช่วยจริง — ห้าม seed ทั้งเมืองลง save', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(hkey => {
    const N = window.__houseDbg.neigh();
    N.onQuestDone('npc-mart', 'quiz');
    const saved = JSON.parse(localStorage.getItem(hkey) || '{}').npc || {};
    return { keys: Object.keys(saved.who || {}) };
  }, HKEY);
  expect(r.keys).toEqual(['npc-mart']);
});

test('18G: กลไกที่ถูกปิดไว้ (testOnly) ห้ามหลุดออกมาทางงานที่ถนัด', async ({ page }) => {
  await house(page, { npc: { v: 1, who: { 'npc-mart': { n: 9, d: '2020-1-1', m: { findsound: 9 } } } } });
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const out = {};
    for (let i = 0; i < 300; i++) { const m = Q.rollWorkMech(Math.random, 'npc-mart'); out[m] = 1; }
    return { got: Object.keys(out), ok: Q.mechOk('findsound') };
  });
  expect(r.ok, 'findsound ต้องยังถูกปิดอยู่').toBe(false);
  expect(r.got.indexOf('findsound'), 'กลไกที่ปิดไว้ห้ามถูกแจก').toBe(-1);
});

test('18H: คุยกับคนที่เคยช่วยจริงในเมือง = ฟองคำพูดมีคำทักถึงเรื่องเก่านำหน้าบทเดิม', async ({ page }) => {
  const errs = await house(page, { npc: { v: 1, who: { 'npc-mart': { n: 5, d: '2020-1-1', m: { quiz: 5 } } } } });
  const r = await page.evaluate(() => {
    const N = window.__houseDbg.neigh();
    const want = N.greeting('npc-mart');
    window.HouseQuestUI.talk('npc-mart');
    const el = document.getElementById('house-npc-bubble');
    return { on: el.classList.contains('on'), txt: (el.textContent || ''), want };
  });
  expect(r.on, 'ฟองคำพูดต้องโผล่').toBe(true);
  expect(r.txt.indexOf(r.want), 'ต้องมีคำทักถึงเรื่องที่เคยช่วยอยู่ในฟอง').toBeGreaterThanOrEqual(0);
  expect(r.txt.length, 'ต้องมีบทปกติต่อท้ายด้วย ไม่ใช่แทนที่').toBeGreaterThan(r.want.length + 3);
  expect(errs).toEqual([]);
});

test('18I: คนที่ไม่เคยช่วย คุยแล้วต้องไม่มีคำทักพิเศษปน', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    window.HouseQuestUI.talk('npc-mart');
    const el = document.getElementById('house-npc-bubble');
    return (el.textContent || '');
  });
  ['ขอบใจที่เคยมาช่วย', 'คราวก่อน', 'เพื่อนคนเก่ง'].forEach(w => {
    expect(r.indexOf(w), 'ห้ามมีคำทักของความสนิทโผล่ก่อนเคยช่วย: ' + w).toBe(-1);
  });
});
