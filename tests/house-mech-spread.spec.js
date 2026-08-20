/* ============================================================
   🎲 เฉลี่ยกลไกเควสต์ (2026-08-20 · ผู้ใช้สั่ง)

   เดิม `rollWorkMech()` ล็อกไว้ว่า **quiz 40% + count 15%** ⇒ กว่าครึ่งของงานทั้งวัน
   เป็นการ์ดตอบคำถาม เด็กเปิดกระดานมาเจอแบบเดิมซ้ำๆ ทั้งที่มีกลไกให้เล่น 65 แบบ

   กติกาที่ชุดนี้คุมไว้ (ห้ามย้อน):
     - **quiz ต้องไม่ครองพูลอีกต่อไป** — ทุกกลไกที่คนคนนั้นแจกได้ ต้องมีโอกาสใกล้เคียงกัน
     - **แต่ quiz ต้องยังอยู่ในพูลของทุก NPC เสมอ** (สรุปบริบทข้อ 4: ทุกคนต้องตอบคำถามได้)
       ⇒ ที่เปลี่ยนคือ "ความถี่" ไม่ใช่ "ความมีอยู่"
     - **กระดาน 5 ช่องต้องเลี่ยงกลไกซ้ำกันเอง** (แต่ยังต้องครบ 5 ชุดเสมอ ห้ามแจกไม่ครบ)
     - **กลไกที่เล่นไม่ได้แล้ว ห้ามตกกลับเป็น quiz ทุกครั้ง** — ต้องสุ่มตัวแทนจากพูลของคนนั้น
       (ของเดิมทำให้ยิ่งเล่นไปในวัน กระดานยิ่งกลายเป็นตอบคำถามล้วน)
     - **`deliver` ต้องยังน้อยกว่าเพื่อน** (งานเดินข้ามเมืองที่ไม่มีอะไรให้เล่นระหว่างทาง)
   ============================================================ */
const { test, expect } = require('@playwright/test');
const { clickEnterHouse } = require('./helpers');

const CHILD = { id: 'msp', name: 'เฉลี่ยงาน', emoji: '🎲', birthDate: '2018-06-01', grade: 'p3' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* ชาวบ้านทั่วไป (ไม่ใช่คนในตึกแล็บ/ร้านดนตรีที่ใช้พูลแทนที่) */
const PLAIN_NPC = 'npc-mart';

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
  await clickEnterHouse(page);
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseQuests, null, { timeout: 30000 });
  return errs;
}

/* ---------------------------------------------------------------- */

test('MS-A: quiz ไม่ใช่กลไกที่เจอบ่อยที่สุดอีกต่อไป — ทุกตัวในพูลเฉลี่ยกัน', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(npcId => {
    const Q = window.HouseQuests;
    const pool = Q.workPool(npcId);
    const N = 6000, cnt = {};
    for (let i = 0; i < N; i++) {
      const m = Q.rollWorkMech(Math.random, npcId);
      cnt[m] = (cnt[m] | 0) + 1;
    }
    const shares = pool.map(m => (cnt[m] | 0) / N);
    return { pool, poolN: pool.length, quiz: (cnt.quiz | 0) / N,
             top: Math.max.apply(null, shares), avg: 1 / pool.length,
             kinds: Object.keys(cnt).length };
  }, PLAIN_NPC);
  console.log('พูลของ ' + PLAIN_NPC + ' = ' + r.poolN + ' กลไก · quiz ' +
              (r.quiz * 100).toFixed(1) + '% · สูงสุด ' + (r.top * 100).toFixed(1) + '%');
  expect(r.poolN, 'พูลต้องกว้างพอให้เฉลี่ยได้จริง').toBeGreaterThan(8);
  expect(r.kinds, 'ต้องแจกได้หลายแบบจริง ไม่ใช่กระจุกอยู่ไม่กี่ตัว').toBeGreaterThan(8);
  /* 🔒 หัวใจของรอบนี้: quiz เป็นแค่ 1 ในพูล ไม่ใช่ตัวที่ถูกล็อกไว้ 40% อีกแล้ว */
  expect(r.quiz, 'quiz ต้องไม่ครองพูล').toBeLessThan(r.avg * 2);
  expect(r.quiz, 'แต่ quiz ต้องยังถูกแจกอยู่จริง').toBeGreaterThan(0);
  /* ไม่มีตัวไหนควรโดดกว่าค่าเฉลี่ยเกิน ~2.5 เท่า (เผื่อโบนัสงานถนัด 9%) */
  expect(r.top, 'ห้ามมีกลไกไหนครองพูล').toBeLessThan(r.avg * 2.5 + .05);
  expect(errs).toEqual([]);
});

test('MS-B: quiz ต้องอยู่ในพูลของ NPC ที่รับงานได้ทุกคน (กติกาเดิม ห้ามหลุด)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const miss = [], empty = [];
    Q.questableIds().forEach(id => {
      const p = Q.workPool(id);
      if (!p.length) empty.push(id);
      else if (p.indexOf('quiz') < 0) miss.push(id);
    });
    return { miss, empty, n: Q.questableIds().length };
  });
  expect(r.n, 'ต้องมี NPC ที่รับงานได้จริง').toBeGreaterThan(20);
  expect(r.empty, 'ห้ามมีใครที่พูลว่างเปล่า (= ไม่มีงานให้ทำ)').toEqual([]);
  expect(r.miss, 'ทุกคนต้องมี quiz ปนอยู่เสมอ').toEqual([]);
  expect(errs).toEqual([]);
});

test('MS-C: กระดานวันนี้ต้องหลากหลาย ไม่ใช่กลไกเดิมซ้ำกันหลายช่อง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    /* ไล่หลายวันด้วยการรีเซ็ต state ไม่ได้ (วันผูกกับนาฬิกาจริง) ⇒ ดูของวันนี้ + สุ่มซ้ำหลายรอบ
       ผ่าน rollWorkMech ตรงๆ แทน โดยจำลองกติกา "เลี่ยงตัวที่ใช้ไปแล้ว" แบบเดียวกับ rollBoard */
    const today = [];
    for (let i = 0; i < 5; i++) { const s = Q.specForBoard(i); if (s) today.push(s.mech); }
    const ids = Q.questableIds();
    let worst = 0;
    for (let d = 0; d < 200; d++) {
      const used = [];
      for (let i = 0; i < 5; i++) {
        const npc = ids[(Math.random() * ids.length) | 0];
        used.push(Q.rollWorkMech(Math.random, npc, used));
      }
      const uniq = used.filter((v, k, a) => a.indexOf(v) === k).length;
      if (!worst || uniq < worst) worst = uniq;
    }
    return { today, uniqToday: today.filter((v, k, a) => a.indexOf(v) === k).length, worst };
  });
  console.log('กระดานวันนี้: ' + r.today.join(', '));
  expect(r.today.length, 'กระดานต้องมีครบ 5 ชุดเสมอ').toBe(5);
  /* พูลของชาวบ้านกว้างพอ ⇒ เลี่ยงซ้ำได้ครบทุกช่องในทุกกรณีที่ลอง */
  expect(r.worst, 'กระดานต้องเลี่ยงกลไกซ้ำได้จริง').toBe(5);
  expect(r.uniqToday, 'กระดานของวันนี้ก็ต้องไม่ซ้ำกันเอง').toBe(5);
  expect(errs).toEqual([]);
});

test('MS-D: กลไกที่เล่นไม่ได้แล้ว ต้องหาตัวแทนจากพูล ไม่ใช่ตกเป็น quiz ทุกช่อง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(hkey => {
    const Q = window.HouseQuests;
    /* วางกระดานของ "วันนี้" ให้ทั้ง 5 ช่องเป็น findsound ซึ่งถูกปิดไว้ (testOnly)
       ⚠ ต้องใส่ `npcIds` ของจริงด้วย ไม่งั้น sync() มองว่า state ยังว่างแล้วสุ่มกระดานใหม่ทับ */
    const ids = Q.questableIds();
    const d = new Date();
    const day = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    const npcs = ids.slice(0, 5);
    const data = JSON.parse(localStorage.getItem(hkey) || '{}');
    data.q2 = {
      d: day, npcIds: ids.slice(0, 8), npc: {},
      board: { q: npcs.map(n => ({ m: 'findsound', npc: n })), done: [], st: {}, claimed: false },
      fam: { who: 'mom', m: 'quiz', st: '', stars: 0 },
      sb: { half: false, full: false }, earned: 0, stars: 0, total: 0,
      chal: { done: {}, recent: [], on: false, miss: 0, ask: '' },
    };
    localStorage.setItem(hkey, JSON.stringify(data));
    Q.reset();
    const raw = (Q.state().board.q || []).map(x => x.m);
    const out = [], again = [];
    for (let i = 0; i < 5; i++) { const s2 = Q.specForBoard(i); if (s2) out.push(s2.mech); }
    /* เปิดซ้ำต้องได้ตัวเดิมเป๊ะ (seed คงที่) — ไม่งั้นเด็กปิดการ์ดแล้วเปิดใหม่เจอคนละเกม */
    for (let i = 0; i < 5; i++) { const s2 = Q.specForBoard(i); if (s2) again.push(s2.mech); }
    return { raw, out, again, ok: Q.mechOk('findsound') };
  }, HKEY);
  console.log('ตัวแทนของ findsound: ' + r.out.join(', '));
  expect(r.ok, 'findsound ต้องยังถูกปิดอยู่').toBe(false);
  expect(r.raw, 'กระดานที่ seed ไว้ต้องไม่ถูกสุ่มใหม่ทับ').toEqual(['findsound', 'findsound', 'findsound', 'findsound', 'findsound']);
  expect(r.out.length).toBe(5);
  expect(r.out.indexOf('findsound'), 'กลไกที่ปิดไว้ห้ามหลุดออกมา').toBe(-1);
  expect(r.out.every(m => m === 'quiz'), 'ห้ามตกเป็น quiz ยกแผงแบบเดิม').toBe(false);
  expect(r.again, 'เปิดการ์ดซ้ำต้องได้กลไกเดิม').toEqual(r.out);
  expect(errs).toEqual([]);
});

test('MS-E: deliver ต้องยังน้อยกว่าเพื่อน (งานเดินข้ามเมือง)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(npcId => {
    const Q = window.HouseQuests;
    const N = 6000, cnt = {};
    for (let i = 0; i < N; i++) { const m = Q.rollWorkMech(Math.random, npcId); cnt[m] = (cnt[m] | 0) + 1; }
    const pool = Q.workPool(npcId);
    return { deliver: (cnt.deliver | 0) / N, avg: 1 / pool.length, has: pool.indexOf('deliver') >= 0 };
  }, PLAIN_NPC);
  expect(r.has, 'deliver ต้องยังอยู่ในพูล').toBe(true);
  expect(r.deliver, 'deliver ต้องน้อยกว่าค่าเฉลี่ย').toBeLessThan(r.avg);
  expect(r.deliver, 'แต่ต้องยังเจอได้อยู่').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});
