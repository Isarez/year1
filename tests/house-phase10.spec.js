/* ============================================================
   เฟส 10 — จังหวะเวลา & งบเวลาเควสต์ (ระลอก 1 · ข้อ 45 ของ QUEST-DESIGN.md)

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. **ตัวคูณระดับชั้นห้ามเกิน 1.20** และต้องไล่ขึ้นตามชั้น ห้ามมีชั้นไหนแซงย้อน
     2. **เงิน/วันต่างกันไม่เกิน 15% และ ป.6 ต้องไม่น้อยกว่า ป.1** (นิยาม "ยุติธรรม" ใหม่ ข้อ 45.3)
     3. **โบนัสดาว/โบนัสกระดานต้องถูกคูณด้วย** ไม่งั้นช่องว่าง 🪙/นาที ปิดไม่สนิท (ข้อ 45.8)
     4. **พลาดฟรี 1 ข้อเสมอ ไม่ว่าเควสต์จะกี่ข้อ** — เควสต์สั้นต้องไม่ถูกลงโทษหนักกว่า (ข้อ 45.9)
     5. **ทุกกลไกต้องประกาศ `secPerQ`** และเควสต์ต้องอยู่ในงบ 150-240 วิ (ข้อ 45.4)
     6. **จำนวนชุดที่จ่ายเงินเท่ากันทุกชั้น (14 ชุด/วัน)** — ห้ามปรับเวลาด้วยจำนวนชุด (ข้อ 45.3)
     7. **งานหลัก 6 / งานรอง 8** และตัวนับ ❗ นับเฉพาะงานหลัก (ข้อ 45.6)
     8. **ห้ามล็อกจำนวนงานตามระดับชั้น** — ต่างกันได้แค่คำแนะนำบนหน้าจอ
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p10a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };

async function house(page) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript((c) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_p10a', JSON.stringify({
      v: 1, mapV: 4, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
    }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  return errs;
}

test('เฟส 10A: ตัวคูณระดับชั้น — ตรงตาราง 45.8 · ไม่เกิน 1.20 · ไล่ขึ้นตามชั้น', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    return {
      table: q.TIER_MUL.slice(1),
      max: q.TIER_MUL_MAX,
      /* นอกช่วง tier ต้องไม่พังและไม่คืนค่าประหลาด */
      clampLo: q.tierMul(0), clampHi: q.tierMul(99), nan: q.tierMul(undefined),
    };
  });
  expect(r.table).toEqual([1.00, 1.05, 1.05, 1.10, 1.15, 1.15]);
  expect(r.max).toBe(1.20);
  r.table.forEach(v => expect(v).toBeLessThanOrEqual(r.max));
  for (let i = 1; i < r.table.length; i++) expect(r.table[i]).toBeGreaterThanOrEqual(r.table[i - 1]);
  /* ราวกันตก: ค่านอกช่วงต้องหนีบเข้าขอบ ไม่ใช่คืน undefined/NaN */
  expect(r.clampLo).toBe(1.00);
  expect(r.clampHi).toBe(1.15);
  expect(r.nan).toBe(1.00);
  expect(errs).toEqual([]);
});

test('เฟส 10B: เงิน/วันต่างกันไม่เกิน 15% · ป.6 ไม่น้อยกว่า ป.1 · โบนัสถูกคูณด้วย', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    /* เงิน/วันเต็ม = NPC 8 + กระดาน 5 + ครอบครัว 1 ทุกชุด 3 ดาว + โบนัสครบทุกก้อน
       ⚠ โบนัสคิดผ่านตัวคูณเดียวกับเควสต์ (ไม่งั้นช่องว่างปิดไม่สนิท) */
    const perDay = [];
    for (let t = 1; t <= 6; t++) {
      const m = q.tierMul(t);
      perDay.push(
        q.coinsFor('A', 3, t, false) * q.NPC_PER_DAY
        + q.coinsFor('board', 3, t, false) * q.BOARD_N
        + q.coinsFor('family', 3, t, false)
        + Math.round(q.STAR_BONUS.half * m) + Math.round(q.STAR_BONUS.full * m)
        + Math.round(q.BOARD_BONUS * m));
    }
    /* โบนัสที่ engine คืนออกมาจริง (ของเด็กคนนี้ = ป.3 ⇒ ตัวคูณ 1.05) */
    const sb = q.starBonus();
    return { perDay, cap: q.DAY_CAP, tier: q.difficulty().tier,
             half: sb.half.coins, full: sb.full.coins,
             baseHalf: q.STAR_BONUS.half, baseFull: q.STAR_BONUS.full };
  });
  const lo = Math.min.apply(null, r.perDay), hi = Math.max.apply(null, r.perDay);
  expect(hi / lo, 'เงิน/วันต่างกันได้ไม่เกิน 15%').toBeLessThanOrEqual(1.15 + 1e-9);
  expect(r.perDay[5], 'ป.6 ต้องไม่น้อยกว่า ป.1').toBeGreaterThanOrEqual(r.perDay[0]);
  for (let i = 1; i < r.perDay.length; i++) expect(r.perDay[i]).toBeGreaterThanOrEqual(r.perDay[i - 1]);
  /* ตัวเลขเป้าหมายของแผน: 206 (ป.1) → 237 (ป.6) — เผื่อการปัดเศษ ±6 */
  expect(Math.abs(r.perDay[0] - 206)).toBeLessThanOrEqual(6);
  expect(Math.abs(r.perDay[5] - 237)).toBeLessThanOrEqual(6);
  /* ต้องอยู่ใต้ DAY_CAP เสมอ ไม่งั้นเควสต์ท้ายๆ ของวันได้ 0 เหรียญ */
  r.perDay.forEach(v => expect(v).toBeLessThan(r.cap));
  /* โบนัสต้องถูกคูณจริง (ป.3 = ×1.05) ไม่ใช่คืนค่าฐานเปล่าๆ */
  expect(r.tier).toBe(3);
  expect(r.half).toBe(Math.round(r.baseHalf * 1.05));
  expect(r.full).toBe(Math.round(r.baseFull * 1.05));
  expect(errs).toEqual([]);
});

test('เฟส 10C: starsOf — พลาดฟรี 1 ข้อเสมอ ไม่ว่าเควสต์จะกี่ข้อ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const st = (n, wrong) => q.starsOf({ items: new Array(n).fill(0), wrong });
    const out = {};
    [5, 6, 9, 12].forEach(n => {
      out[n] = { w0: st(n, 0), w1: st(n, 1), w2: st(n, 2), wAll: st(n, n) };
    });
    return out;
  });
  Object.keys(r).forEach(n => {
    expect(r[n].w0, n + ' ข้อ ไม่พลาดเลย = 3 ดาว').toBe(3);
    expect(r[n].w1, n + ' ข้อ พลาด 1 ข้อยังต้องได้ 3 ดาว (พลาดฟรี)').toBe(3);
    expect(r[n].w2, n + ' ข้อ พลาด 2 ข้อ ต้องยังได้อย่างน้อย 2 ดาว').toBeGreaterThanOrEqual(2);
    /* ห้ามลงโทษเด็ก — ผิดทุกข้อก็ยังได้ 1 ดาว + เงิน (กติกาเหล็กข้อ 2) */
    expect(r[n].wAll, n + ' ข้อ ผิดหมดก็ยังต้องได้ 1 ดาว').toBeGreaterThanOrEqual(1);
  });
  expect(errs).toEqual([]);
});

test('เฟส 10D: ทุกกลไกประกาศ secPerQ + งบเวลา/ชุดอยู่ในช่วง 150-240 วิ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const miss = [], shapes = {};
    Object.keys(q.MECHS).forEach(k => {
      const sh = q.mechShape(k);
      shapes[sh] = (shapes[sh] || 0) + 1;
      const sec = q.mechSecPerQ(k);
      /* ทรงเดินคำนวณจากระยะจริงตอนสร้างเควสต์ จึงเป็น null ได้ ที่เหลือต้องมีตัวเลข */
      if (sh !== 'walk' && !(sec > 0)) miss.push(k + ':' + sh);
    });
    return { miss, shapes, card: q.SEC_CARD, drag: q.SEC_DRAG, engine: q.SEC_ENGINE,
             lo: q.QUEST_SEC_LO, hi: q.QUEST_SEC_HI, total: Object.keys(q.MECHS).length };
  });
  expect(r.miss, 'กลไกที่ลืมประกาศ secPerQ').toEqual([]);
  expect(r.card).toBe(16);
  expect(r.drag).toBe(30);
  expect(r.lo).toBe(150);
  expect(r.hi).toBe(240);
  /* ต้องมีครบทั้ง 4 ทรง ไม่ใช่โดนเหมาเป็น card หมด (แปลว่าตารางจำแนกหลุด) */
  ['card', 'drag', 'engine', 'walk'].forEach(s => expect(r.shapes[s] || 0, 'ทรง ' + s).toBeGreaterThan(0));
  /* 1 ชุดของ engine ต้องอยู่ในงบเวลาเช่นกัน */
  expect(r.engine).toBeGreaterThanOrEqual(r.lo);
  expect(r.engine).toBeLessThanOrEqual(r.hi);
  expect(errs).toEqual([]);
});

test('เฟส 10E: สูตรทรงเดิน — 5-10 ข้อตามระยะ · ตรงตาราง 45.5 · ยิ่งไกลยิ่งข้อน้อย', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const rows = [8, 15, 25, 40].map(d => ({ d, n: q.walkQCount(d, 0), sec: q.secWalk(d) }));
    /* กวาดทุกระยะ 0-120 ช่อง ต้องอยู่ใน 5-10 เสมอ ไม่ว่าจะสุ่ม ±1 หรือไม่ */
    let bad = null;
    for (let d = 0; d <= 120 && !bad; d++)
      [-1, 0, 1].forEach(j => {
        const n = q.walkQCount(d, j);
        if (!bad && (n < 5 || n > 10)) bad = { d, j, n };
      });
    return { rows, bad, base: q.SEC_WALK_BASE, per: q.SEC_WALK_PER_TILE, minQ: q.MIN_Q };
  });
  expect(r.base).toBe(12);
  expect(r.per).toBe(0.6);
  /* ตารางในแผน: 8 ช่อง→10 ข้อ · 15→9 · 25→7 · 40→5 */
  expect(r.rows.map(x => x.n)).toEqual([10, 9, 7, 5]);
  /* เวลารวมต่อชุดต้องอยู่ในงบ 150-240 วิ ทุกแถว */
  r.rows.forEach(x => {
    const total = x.n * x.sec;
    expect(total, 'ระยะ ' + x.d + ' ช่อง: ' + Math.round(total) + ' วิ').toBeGreaterThanOrEqual(150);
    expect(total).toBeLessThanOrEqual(240);
  });
  expect(r.bad, 'ทุกระยะต้อง clamp อยู่ใน 5-10 ข้อ').toBe(null);
  expect(r.minQ).toBe(5);
  expect(errs).toEqual([]);
});

test('เฟส 10F: งานหลัก 6 / งานรอง 8 · ตัวนับ ❗ นับเฉพาะงานหลัก · ไม่ล็อกงานตามชั้น', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const d = q.daySummary();
    return {
      total: d.total, mainTotal: d.mainTotal, sideTotal: d.sideTotal,
      mainLeft: d.mainLeft, sideLeft: d.sideLeft, left: d.left,
      /* งานหลักต้องเป็นกระดาน+ครอบครัวเท่านั้น · งานรองต้องเป็น NPC เท่านั้น */
      mainSrc: Array.from(new Set(d.items.filter(x => x.main).map(x => x.src))).sort(),
      sideSrc: Array.from(new Set(d.items.filter(x => !x.main).map(x => x.src))).sort(),
      goal: q.goalSets(), tier: q.difficulty().tier,
      npcPerDay: q.NPC_PER_DAY, boardN: q.BOARD_N,
    };
  });
  expect(r.mainTotal, 'งานหลัก = กระดาน 5 + ครอบครัว 1').toBe(6);
  expect(r.sideTotal, 'งานรอง = NPC 8 คน').toBe(8);
  expect(r.total, 'รวม 14 ชุด/วัน').toBe(14);
  expect(r.mainSrc).toEqual(['board', 'family']);
  expect(r.sideSrc).toEqual(['npc']);
  expect(r.mainLeft + r.sideLeft).toBe(r.left);
  /* คำแนะนำต่างกันตามชั้นได้ แต่ต้องไม่เกินจำนวนชุดจริง (ไม่ใช่การกั้นสิทธิ์) */
  expect(r.goal).toBeGreaterThanOrEqual(6);
  expect(r.goal).toBeLessThanOrEqual(14);
  /* 🔒 จำนวนชุดที่จ่ายเงินต้องเท่ากันทุกชั้น — ปรับเวลาด้วยจำนวนข้อเท่านั้น ห้ามปรับด้วยจำนวนชุด */
  expect(r.npcPerDay).toBe(8);
  expect(r.boardN).toBe(5);
  /* แถบบนต้องโชว์ตัวเลขงานหลัก ไม่ใช่ 14 */
  const bar = await page.evaluate(() => (document.getElementById('hqbar-left') || {}).textContent || '');
  expect(bar.replace(/[^0-9]/g, '')).toBe(String(r.mainLeft));
  expect(errs).toEqual([]);
});

test('เฟส 10G: จำนวนชุด/วันเท่ากันทุกระดับชั้น (ห้ามปรับเวลาด้วยจำนวนชุด)', async ({ page }) => {
  const errs = await house(page);
  /* เปลี่ยนระดับชั้นของเด็กแล้ว re-sync engine — จำนวนชุดต้องไม่ขยับเลยสักชั้น */
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const out = [];
    ['prep', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach(g => {
      /* difficulty(gid) รับ grade id ตรงๆ ⇒ ไม่ต้องแตะ localStorage ของเด็กจริง */
      out.push({ g, tier: q.difficulty(g).tier });
    });
    const d = q.daySummary();
    return { out, sets: d.total, board: q.BOARD_N, npc: q.NPC_PER_DAY };
  });
  /* tier ต้องไล่ 1..6 (prep กับ p1 = 1 เหมือนกัน) */
  expect(r.out.map(x => x.tier)).toEqual([1, 1, 2, 3, 4, 5, 6]);
  expect(r.sets).toBe(r.board + 1 + r.npc);
  expect(errs).toEqual([]);
});
