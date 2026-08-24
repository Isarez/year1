/* ============================================================
   เฟส 11 — มินิเกมกลุ่ม A ที่เล่นในโลก 3D จริง (js/house-play.js)
   🙈 ซ่อนแอบ · 🍃 เก็บของประจำวัน · 🎣 ตกปลา · 📷 ช่างภาพ · 🌱 แปลงผัก

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. **ห้ามมี dead end** — ตกปลาได้ตั้งแต่ยังไม่มีตู้ปลา · ปลูกผักได้ตั้งแต่ยังไม่มีเงิน
     2. **ห้ามมีบทลงโทษ** — ดึงเบ็ดไม่ทัน/ลืมรดน้ำ ต้องไม่หักอะไรและผักต้องไม่ตาย
     3. **โควตาแยกจากเควสต์ 14 ชุดเดิมเด็ดขาด** — เล่นกลุ่ม A แล้วเควสต์หาเงินต้องไม่ถูกกิน
     4. **จุดวางของต้องมาจากกริดเดินได้จริง** (ห้ามเดาพิกัด) และคนซ่อนต้องอยู่นอกบริเวณบ้าน
     5. **เงินทุกบาทผ่าน OwlCoins** และคิดจากสูตร `coinsFor()` เดียวกับเควสต์ (ไม่ตั้งเลขลอยๆ)
     6. **state ใหม่ต้องมี migration** — เด็กก่อนเฟส 11 (ไม่มีคีย์ `play`) ต้องเข้าเล่นได้ปกติ
     7. ของถาวร (สมุดปลา · ของรางวัล · แปลงผัก) **ห้ามหายตอนขึ้นวันใหม่**
   ============================================================ */
const { test, expect } = require('@playwright/test');
const { clickEnterHouse } = require('./helpers');

const CHILD = { id: 'p11a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };

/* seed = house save ที่อยากให้เด็กมีตั้งแต่แรก (null = เด็กก่อนเฟส 11 ที่ไม่มีคีย์ play เลย) */
async function house(page, seed) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(([c, s]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify(Object.assign({
      v: 1, mapV: 4, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
    }, s || {})));
  }, [CHILD, seed || null]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await clickEnterHouse(page);
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HousePlay && !!window.HouseWorld, null, { timeout: 30000 });
  return errs;
}
const coins = page => page.evaluate(() => window.OwlCoins.get());

test('เฟส 11A: เด็กก่อนเฟส 11 (ไม่มีคีย์ play) ต้องเข้าเล่นได้ + สร้าง state ให้เอง', async ({ page }) => {
  const errs = await house(page);          /* save ไม่มีคีย์ play เลย = เด็กเก่า */
  const r = await page.evaluate(() => {
    const s = window.HousePlay.state();
    const saved = JSON.parse(localStorage.getItem('p1quiz_house_p11a') || '{}');
    return {
      v: s.v, day: s.day,
      keys: Object.keys(s).sort(),
      colN: s.col.items.length,
      persisted: !!saved.play,             /* ต้องเขียนลง house save ก้อนเดิม (export/import พาไปเอง) */
      persistedDay: (saved.play || {}).day,
    };
  });
  expect(r.v).toBe(1);
  expect(r.keys).toEqual(['col', 'day', 'fish', 'garden', 'photo', 'seek', 'v']);
  expect(r.colN).toBeGreaterThan(0);
  expect(r.persisted, 'state ต้องอยู่ใน house save ก้อนเดียวกับของอื่น').toBe(true);
  expect(r.persistedDay).toBe(r.day);
  expect(errs).toEqual([]);
});

test('เฟส 11B: ปุ่ม 🎈 + แผงรายการ — โผล่เฉพาะฉากนอกบ้าน · แตะนอกกล่องแล้วปิด', async ({ page }) => {
  const errs = await house(page);
  const btn = page.locator('#house-play-btn');
  await expect(btn).toBeVisible();
  /* ต้องสูงเท่าแถบสรุปเควสต์เป๊ะ — อยู่แถวเดียวกัน (กติกา HUD ที่ล็อกไว้ 2026-08-09) */
  const h = await page.evaluate(() => [
    document.getElementById('house-play-btn').getBoundingClientRect().height,
    document.getElementById('house-quest-bar').getBoundingClientRect().height,
  ]);
  expect(h[0]).toBe(h[1]);

  await btn.click();
  await expect(page.locator('#house-playpanel')).toBeVisible();
  /* ต้องมีครบทั้ง 5 เกมในแผงเดียว
     ⚠ เฟส 16 เพิ่ม "แถวสมุดสะสม" ต่อท้ายอีก 1 แถว (ทางเข้าเดียวของสมุด) ⇒ รวมเป็น 6 แถว
       **เกณฑ์ถูกปรับ ไม่ได้ลบเทสทิ้ง** — ยังคุมว่า 5 เกมของกลุ่ม A ต้องอยู่ครบเหมือนเดิม */
  await expect(page.locator('#hpl-list .hpl-row')).toHaveCount(6);
  const names = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#hpl-list .hpl-name')).map(e => e.textContent));
  ['ซ่อนแอบ', 'ตกปลา', 'แปลงผัก'].forEach(k =>
    expect(names.some(n => n.indexOf(k) >= 0), 'ต้องมีเกม ' + k).toBe(true));
  expect(names.some(n => n.indexOf('สมุดสะสม') >= 0), 'ต้องมีทางเข้าสมุดสะสม').toBe(true);

  /* แตะพื้นที่นอกกล่อง = ปิด (กติกาเดียวกับกล่องอื่นทุกใบในโหมดบ้าน) */
  await page.mouse.click(60, 400);
  await page.waitForTimeout(250);
  await expect(page.locator('#house-playpanel')).toBeHidden();

  /* เข้าไปในบ้าน → ปุ่มต้องหาย (กลุ่ม A เล่นในเมืองเท่านั้น) */
  await page.evaluate(() => window.__houseDbg.enterHouse());
  await expect.poll(() => page.evaluate(() =>
    document.getElementById('house-play-btn').hidden), { timeout: 10000 }).toBe(true);
  expect(errs).toEqual([]);
});

test('เฟส 11C: ซ่อนแอบ — จุดแอบมาจากกริดจริง · เดินถึงได้ทุกจุด · ไม่อยู่ในบริเวณบ้าน', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const P = window.HousePlay, W = window.HouseWorld;
    const ok = P.seekStart();
    P.seekIntroSkip();   /* ⏭️ ข้ามอินโทรนับถอยหลัง 5 วิ (เพิ่ม 2026-08-16) */
    const s = P.state().seek;
    return {
      ok, n: s.spots.length, on: s.on,
      walkable: s.spots.every(t => W.walkable(t.x, t.z)),
      /* ⚠ ชาวบ้านเข้าเขตบ้านเด็กไม่ได้ ⇒ ห้ามมีใครแอบในนั้น */
      inHome: s.spots.filter(t => W.inHomeZone(t.x, t.z)).length,
      /* ⚠ ระยะต้องวัดด้วย findPath จริง — ทุกจุดต้องเดินถึงได้ (ไม่ใช่เกาะกลางแม่น้ำ) */
      reach: s.spots.map(t => W.pathLen(W.tile(), t)),
      objs: P.objs().seek,
      hint: P.seekHint(),
      again: P.seekStart(),                /* วันละครั้ง — เริ่มซ้ำต้องไม่ได้ */
    };
  });
  expect(r.ok).toBe(true);
  expect(r.n).toBeGreaterThanOrEqual(3);
  expect(r.n).toBeLessThanOrEqual(5);
  expect(r.walkable, 'ทุกจุดต้องเป็นช่องเดินได้จริง').toBe(true);
  expect(r.inHome, 'ห้ามแอบในบริเวณบ้านเด็ก').toBe(0);
  r.reach.forEach(d => expect(d, 'ทุกจุดต้องเดินถึงได้').toBeGreaterThan(0));
  expect(r.objs).toBe(r.n);                /* ต้องมีตัวคนโผล่ในฉากครบทุกจุด */
  expect(r.hint).toBeTruthy();
  expect(r.hint.level).toBeGreaterThanOrEqual(0);
  expect(r.hint.level).toBeLessThanOrEqual(3);
  expect(r.again, 'เริ่มซ้ำในวันเดียวกันต้องไม่ได้').toBe(false);
  expect(errs).toEqual([]);
});

test('เฟส 11D: ซ่อนแอบ — หาครบได้เหรียญตามสูตรเควสต์ · โควตาเควสต์ 14 ชุดไม่ถูกกิน', async ({ page }) => {
  const errs = await house(page);
  const before = await coins(page);
  const sum0 = await page.evaluate(() => window.HouseQuests.daySummary());
  const r = await page.evaluate(() => {
    const P = window.HousePlay, Q = window.HouseQuests;
    P.seekStart();
    P.seekIntroSkip();
    const n = P.state().seek.spots.length;
    /* "เจอ" ทีละคนผ่านทางเดินโค้ดจริง (ข้ามการเดินเพราะเทสเดินทั้งเมืองไม่ไหว) */
    for (let i = 0; i < n; i++) P.arrive({ game: 'seek', i });
    return { n, done: P.state().seek.done, objs: P.objs().seek,
             want: Q.coinsFor('A', 3, Q.difficulty().tier, false) };
  });
  expect(r.done).toBe(true);
  expect(r.objs, 'หาครบแล้วต้องเก็บตัวคนออกจากฉาก').toBe(0);
  expect(await coins(page) - before, 'ต้องได้เท่าเควสต์ NPC 3 ดาว').toBe(r.want);
  /* 🔒 โควตาเควสต์ต้องไม่ขยับเลยแม้แต่ชุดเดียว */
  const sum1 = await page.evaluate(() => window.HouseQuests.daySummary());
  expect(sum1.total).toBe(sum0.total);
  expect(sum1.left).toBe(sum0.left);
  expect(errs).toEqual([]);
});

test('เฟส 11E: เก็บของประจำวัน — 8 ชิ้นบนช่องเดินได้ · เก็บครบแล้วได้ของรางวัล (ไม่ใช่เหรียญ)', async ({ page }) => {
  const errs = await house(page);
  const before = await coins(page);
  const r = await page.evaluate(() => {
    const P = window.HousePlay, W = window.HouseWorld;
    const st = P.state();
    const walkable = st.col.items.every(t => W.walkable(t.x, t.z));
    const n = st.col.items.length;
    const objs0 = P.objs().col;
    P.arrive({ game: 'col', i: 0 });
    const after1 = { got: P.state().col.got.length, objs: P.objs().col };
    for (let i = 1; i < n; i++) P.arrive({ game: 'col', i });
    return { n, walkable, objs0, after1, sets: P.state().col.sets,
             objsEnd: P.objs().col, colN: P.COL_N };
  });
  expect(r.n).toBe(r.colN);
  expect(r.walkable, 'ของทุกชิ้นต้องอยู่บนช่องเดินได้จริง').toBe(true);
  expect(r.objs0).toBe(r.n);
  expect(r.after1.got).toBe(1);
  expect(r.after1.objs, 'เก็บแล้วชิ้นนั้นต้องหายจากฉาก').toBe(r.n - 1);
  expect(r.objsEnd).toBe(0);
  expect(r.sets, 'เก็บครบ 1 ชุด').toBe(1);
  /* ⚠ **ห้ามจ่ายเหรียญ** — ของสะสมเป็น reward loop ที่ไม่ทำเงินเฟ้อ (ข้อ 44.4) */
  expect(await coins(page) - before, 'เก็บของต้องไม่ได้เหรียญ').toBe(0);
  expect(errs).toEqual([]);
});

test('เฟส 11F: ของรางวัลนักสะสม — ครบตามเกณฑ์แล้วปลดของแต่งบ้านให้ฟรี ไม่ตัดเงิน', async ({ page }) => {
  /* ยัดให้สะสมมาแล้ว 2 วัน แล้วเก็บครบวันที่ 3 → ต้องปลดของชิ้นแรก */
  const errs = await house(page, { play: { v: 1, day: '', col: { items: [], got: [], sets: 2, prizes: [] } } });
  const before = await coins(page);
  const r = await page.evaluate(() => {
    const P = window.HousePlay, S = window.HouseShop;
    const first = P.COL_PRIZES[0];
    const ownedBefore = S.ownsFurn(first.id);
    const n = P.state().col.items.length;
    for (let i = 0; i < n; i++) P.arrive({ game: 'col', i });
    return { first, ownedBefore, ownedAfter: S.ownsFurn(first.id),
             sets: P.state().col.sets, prizes: P.state().col.prizes };
  });
  expect(r.ownedBefore).toBe(false);
  expect(r.sets).toBe(3);
  expect(r.ownedAfter, 'ครบ 3 วันต้องปลดของชิ้นแรก').toBe(true);
  expect(r.prizes).toContain(r.first.id);
  expect(await coins(page) - before, 'ของรางวัลต้องไม่ตัดเงิน').toBe(0);
  expect(errs).toEqual([]);
});

test('เฟส 11G: ตกปลา — จุดตกปลาบนท่าไม้ 2 จุด + ทะเล 1 · ดึงไม่ทันไม่มีบทลงโทษ · ได้ปลาแล้วลงสมุด', async ({ page }) => {
  const errs = await house(page);
  const before = await coins(page);

  /* ⚠ ผู้ใช้สั่ง 2026-08-13: ต้องมีจุดตกปลาถาวร **บ่อน้ำ 1 · ทะเล 1** พร้อมป้ายลอยให้กดเริ่ม
     ไม่ใช่ "ยืนตรงไหนก็ตกได้" แบบเดิมที่เด็กไม่มีทางรู้ว่าตกได้ตรงไหน */
  const spots = await page.evaluate(() => {
    const P = window.HousePlay, W = window.HouseWorld;
    /* ⚠ เฟส 11 รอบแก้ 2026-08-14: **ทุ่นอยู่ในน้ำ ไม่ใช่ช่องที่เด็กยืน** (เดิมทุ่นทับตัวเด็ก)
       `x/z` = ช่องน้ำที่ทุ่นลอย · `sx/sz` = ช่องบนท่าที่เด็กไปยืน */
    return P.fishSpots().map(s => ({
      x: s.x, z: s.z, sx: s.sx, sz: s.sz, kind: s.kind,
      inWater: W.isWater(s.x, s.z),
      walkable: W.walkable(s.sx, s.sz),
      reach: W.pathLen(W.tile(), {x: s.sx, z: s.sz}),
      hasBubble: !!(s.obj && s.obj.userData.bubble),
      rings: s.obj ? (s.obj.userData.rings || []).length : 0,
    }));
  });
  /* ⚠ ผู้ใช้สั่งเพิ่มท่าไม้ 2026-08-13: ท่าข้างลุงตกปลา (z20) + ท่าเหนือบ่อ (z15-16)
     ⇒ จุดในบ่อ 2 จุด + ทะเล 1 จุด = 3 จุด · ทุกจุดต้องอยู่บน "พื้นไม้ของท่า" ที่เดินได้จริง */
  /* ⚠ 2026-08-14: ทะเลใช้ท่าไม้จริงที่ x51/x31 แทนการหาช่องริมหาดอัตโนมัติ
     (ช่องริมหาดยืนติดขอบพื้นพอดี ผิดกติกา "ทุกจุดต้องห่างขอบพื้น 1 ช่อง") */
  expect(spots.length, 'ต้องมีจุดตกปลา 4 จุด (บ่อ 2 + ทะเล 2)').toBe(4);
  expect(spots.filter(s => s.kind === 'pond').length).toBe(2);
  expect(spots.filter(s => s.kind === 'sea').length).toBe(2);
  spots.forEach(s => {
    expect(s.walkable, s.kind + ' ช่องที่เด็กยืนต้องเดินได้จริง').toBe(true);
    expect(s.inWater, s.kind + ' ทุ่นต้องอยู่ในน้ำ').toBe(true);
    expect(s.x !== s.sx || s.z !== s.sz, s.kind + ' ทุ่นต้องไม่ทับช่องเด็ก').toBe(true);
    expect(s.reach, s.kind + ' ต้องเดินไปถึงได้จริง (วัดด้วย findPath)').toBeGreaterThan(0);
    expect(s.hasBubble, s.kind + ' ต้องมีป้ายลอยให้เด็กเห็น').toBe(true);
    expect(s.rings, s.kind + ' ต้องมีวงคลื่นบอกจุด').toBe(3);
    /* 🔒 ผู้ใช้ล็อกไว้ 2026-08-14: **"จุดตกปลาห่างจากฝั่ง 1 ช่อง"**
       = ระหว่างช่องที่เด็กยืนกับช่องที่ทุ่นลอย ต้องมีน้ำคั่นพอดี 1 ช่อง ⇒ ระยะรวม 2 ช่องเสมอ
       (เคยแก้ให้ติดกัน = 1 ช่อง แล้วผู้ใช้สั่งย้ายกลับ **ห้ามย่อกลับอีก**) */
    expect(Math.abs(s.x - s.sx) + Math.abs(s.z - s.sz), s.kind + ' ทุ่นต้องห่างที่ยืน 2 ช่องพอดี').toBe(2);
  });
  /* 🪵 ท่าน้ำ = "พื้นไม้ปูบนน้ำ" — ช่องท่าทุกช่องต้องเป็นน้ำจริง ไม่งั้นได้แผ่นไม้วางบนหญ้า
     (ผู้ใช้แจ้งซ้ำหลายรอบ 2026-08-14 · ต้นเหตุคือตัววาดพื้นปูบล็อกหญ้าไว้ข้างใต้) */
  const decks = await page.evaluate(() => {
    const W = window.HouseWorld, out = [];
    for (let z = 0; z < 68; z++) for (let x = 0; x < 68; x++)
      if (W.isWaterDeck(x, z)) out.push({ x, z, wet: W.isPond(x, z) || W.isSea(x, z), walk: W.walkable(x, z) });
    return out;
  });
  expect(decks.length, 'ต้องมีพื้นไม้ปูบนน้ำจริง (ท่าในบ่อ + ท่าน้ำทะเล)').toBeGreaterThan(0);
  decks.forEach(d => {
    expect(d.wet, 'ช่อง ' + d.x + ',' + d.z + ' เป็นแผ่นไม้แต่ข้างใต้ไม่ใช่น้ำ').toBe(true);
    expect(d.walk, 'ช่อง ' + d.x + ',' + d.z + ' เป็นแผ่นไม้ต้องเดินได้').toBe(true);
  });

  /* ยังไม่ไปถึงจุด = เหวี่ยงไม่ได้ (แต่ต้องไม่พังและไม่หักอะไร) */
  const dry = await page.evaluate(() => ({ cast: window.HousePlay.fishCast(),
                                           st: window.HousePlay.fishState() }));
  expect(dry.cast).toBe(false);
  expect(dry.st).toBe(null);

  /* วาร์ปไปที่จุดตกปลาจริง แล้วเล่นผ่านทางเดินโค้ดเดียวกับตอนแตะป้าย */
  await page.evaluate(() => {
    const s = window.HousePlay.fishSpots()[0];
    window.__houseDbg.tp(s.sx, s.sz);        /* ไปยืนบนท่า ไม่ใช่ลงไปในน้ำ */
  });
  const r = await page.evaluate(async () => {
    const P = window.HousePlay;
    const atSpot = P.atFishSpot();
    const cast = P.fishCast();
    const bookBefore = P.state().fish.book.length;
    /* ดึงก่อนปลากิน = ปลาหนี — ต้องไม่หักอะไรเลย และเหวี่ยงใหม่ได้ทันที */
    const early = P.fishPull();
    const afterEarly = { st: P.fishState(), book: P.state().fish.book.length };
    P.fishCast();
    /* ⚠ ต้องเผื่อเวลาเยอะ — engine clamp dt ที่ 50ms/เฟรม ตอนเฟรมตกเวลาในเกมเดินช้ากว่าจริงหลายเท่า */
    await new Promise(res => {
      const t0 = Date.now();
      const iv = setInterval(() => {
        const s = P.fishState();
        if ((s && s.phase === 'bite') || Date.now() - t0 > 30000) { clearInterval(iv); res(); }
      }, 50);
    });
    const bit = P.fishState() && P.fishState().phase === 'bite';
    const got = bit ? P.fishPull() : false;
    return { atSpot, cast, early, afterEarly, bookBefore, bit, got,
             book: P.state().fish.book.length, today: P.state().fish.today, total: P.FISH.length };
  });
  expect(r.atSpot).toBe(true);
  expect(r.cast).toBe(true);
  expect(r.early, 'ดึงก่อนจังหวะ = ไม่ได้ปลา').toBe(false);
  expect(r.afterEarly.st, 'ปลาหนีแล้วต้องเคลียร์สถานะให้เหวี่ยงใหม่ได้').toBe(null);
  expect(r.afterEarly.book, 'ดึงพลาดต้องไม่ทำให้สมุดปลาหาย').toBe(r.bookBefore);
  expect(r.bit, 'ต้องมีจังหวะปลากินจริง').toBe(true);
  expect(r.got).toBe(true);
  expect(r.book).toBe(r.bookBefore + 1);
  expect(r.today).toBe(1);
  expect(r.total).toBeGreaterThanOrEqual(15);
  /* ตกปลาไม่จ่ายเหรียญ (ได้เป็น "ปลา") — และเล่นได้ทั้งที่ยังไม่มีตู้ปลา = ไม่มี dead end */
  expect(await coins(page) - before).toBe(0);
  expect(errs).toEqual([]);
});


test('เฟส 11H: ช่างภาพ — ได้ภาพจริงจากฉาก 3D · เก็บไม่เกินเพดาน · ไม่ต้องเปิด preserveDrawingBuffer', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const P = window.HousePlay;
    /* ⚠ ใบสั่งรูปสุ่มตาม **วันที่จริง** ⇒ บางวันสั่ง "ถ่ายที่ตลาด/ริมน้ำ" แล้วเด็กยืนผิดที่
       ทุกช็อตจะถูกปฏิเสธ เทสแดงเองโดยที่โค้ดไม่ได้ผิด (เจอ 2026-08-17 พอวันเปลี่ยน)
       ⇒ ตรึงใบสั่งเป็น "มุมไหนก็ได้" เทสนี้วัดเรื่องเพดานจำนวนรูป ไม่ได้วัดด่านตำแหน่ง */
    P.state().photo.order = 'any';
    const u = P.grabShot();
    /* ถ่ายรัวๆ เกินเพดาน — ต้องตัดของเก่าทิ้ง ไม่ใช่บวมจน localStorage เต็ม */
    for (let i = 0; i < P.PHOTO_MAX + 4; i++) P.photoShoot();
    const saved = JSON.parse(localStorage.getItem('p1quiz_house_p11a') || '{}');
    return { head: (u || '').slice(0, 22), len: (u || '').length,
             shots: P.state().photo.shots.length, max: P.PHOTO_MAX,
             saveKB: Math.round(JSON.stringify(saved).length / 1024),
             order: P.photoOrder().id };
  });
  expect(r.head, 'ต้องเป็นรูป jpeg ที่อ่านจาก canvas จริง').toContain('data:image/jpeg');
  expect(r.len, 'ภาพต้องไม่ว่างเปล่า (ถ้าบัฟเฟอร์ถูกเคลียร์จะได้ภาพดำสั้นๆ)').toBeGreaterThan(1500);
  expect(r.shots).toBe(r.max);
  /* ⚠ **15 รูป × 900px** (ผู้ใช้กำหนดใหม่ 2026-08-20 · เดิม 12 รูป × 760px)
     เกณฑ์นี้คุมไม่ให้ใครดันความละเอียด/จำนวนรูปขึ้นจนบ้านหลายคนชน localStorage (~5 MB)
     ⚠ วัดจริงแล้ว **จอแท็บเล็ตกินที่มากกว่าจอกว้าง ~20%** (สัดส่วนจอสูงกว่า ⇒ รูปสูงกว่า
       ที่ความกว้างเท่ากัน) — เกณฑ์ต้องเผื่อฝั่งแท็บเล็ตเสมอ
     🔒 คู่กับ `MAX_CHILDREN = 10` ใน js/app-core.js: 10 คน × ~2,600 KB ยังไม่ถึงเพดานจริง
       เพราะเด็กส่วนใหญ่ไม่ถ่ายครบ 15 ใบ · **ห้ามเพิ่ม PHOTO_MAX/PHOTO_W อีกโดยไม่ถามผู้ใช้** */
  expect(r.saveKB, 'house save ต้องไม่บวมจนเสี่ยง localStorage เต็ม').toBeLessThan(2600);
  expect(r.order).toBeTruthy();
  /* ⚠ ห้ามเปิด preserveDrawingBuffer — มันกินเฟรมเรตตลอดเวลาที่เด็กเล่น */
  const ctxAttr = await page.evaluate(() => {
    const cv = document.getElementById('house-canvas');
    const gl = cv.getContext('webgl2') || cv.getContext('webgl');
    return gl ? !!gl.getContextAttributes().preserveDrawingBuffer : null;
  });
  expect(ctxAttr).toBe(false);
  expect(errs).toEqual([]);
});

test('เฟส 11I: แปลงผัก — 4 แปลงถาวรที่ x14-15/z33-34 · ย้ายได้ในโหมดตกแต่ง · ทำทีละแปลงตามป้าย', async ({ page }) => {
  const errs = await house(page);
  const before = await coins(page);

  /* ⚠ ผู้ใช้กำหนดพิกัดเอง 2026-08-13 — แปลงต้องมีให้ตั้งแต่แรก ไม่ใช่สุ่มที่ตอนกดปลูก */
  const bed0 = await page.evaluate(() => {
    const P = window.HousePlay, W = window.HouseWorld;
    return { beds: P.beds(), inHome: P.beds().every(b => W.inHomeZone(b.x, b.z)),
             acts: P.beds().map((_, i) => P.bedAction(i)),
             bubbles: P.objs().garden };
  });
  expect(bed0.beds).toEqual([{x:14,z:33},{x:15,z:33},{x:14,z:34},{x:15,z:34}]);
  expect(bed0.inHome, 'แปลงต้องอยู่ในบริเวณบ้าน (ย้ายได้ในโหมดตกแต่ง)').toBe(true);
  expect(bed0.acts, 'ตอนแรกทุกแปลงว่าง = ปลูกได้').toEqual(['plant','plant','plant','plant']);
  expect(bed0.bubbles, 'ทุกแปลงต้องมีป้ายลอยบอกว่าทำอะไรได้').toBe(4);

  /* แปลงเป็นเฟอร์นิเจอร์จริง ⇒ ต้องอยู่ในคลังของที่เด็ก "มีสิทธิ์" อยู่แล้ว (ไม่ต้องซื้อ) */
  expect(await page.evaluate(() => window.HouseShop.ownsFurn('veg-plot'))).toBe(true);

  const r = await page.evaluate(() => {
    const P = window.HousePlay;
    /* ⚠️ เฟส 11 (รอบแก้ 2026-08-13): **ต้องมีเมล็ดในคลังก่อนถึงจะปลูกได้** — ซื้อกี่เม็ดปลูกได้เท่านั้น
       (เทสจึงต้องเติมเมล็ดให้ก่อน แทนที่จะปลูกลอยๆ แบบเดิม) */
    const noSeed = P.gardenPlant(0);
    P.addSeed(P.SEEDS[0].id, 4);
    /* แตะแปลงที่ 1 → ปลูก · แปลงอื่นต้องยังว่าง (ทำทีละแปลงตามที่ผู้ใช้สั่ง) */
    P.arrive({ game:'garden', i:0 });
    const afterPlant = { acts: P.beds().map((_, i) => P.bedAction(i)) };
    /* แตะแปลงเดิมอีกที → รดน้ำ (ป้ายเปลี่ยนเป็น 💧 แล้ว) */
    P.arrive({ game:'garden', i:0 });
    const stage1 = P.state().garden.plots[0].stage;
    const wateredAct = P.bedAction(0);
    /* จำลองลืมรดหลายวัน — ผักต้องไม่ตายและไม่ถอยขั้น */
    P.state().garden.plots[0].wd = '';
    const survived = { has: !!P.state().garden.plots[0], stage: P.state().garden.plots[0].stage };
    /* ⚠ **รดน้ำเป็นรายแปลงแล้ว** (แก้บั๊ก 2026-08-14: เดิมใช้ garden.watered ก้อนเดียว ทำให้
       ปลูกแปลงใหม่วันเดียวกันแล้วรดไม่ได้) ⇒ รีเซ็ต `wd` ของแปลงนั้นแทน */
    for (let i = 0; i < 9; i++) { const sl = P.state().garden.plots[0]; if (sl) sl.wd = ''; P.gardenWater(0); }
    const ripeAct = P.bedAction(0);
    P.arrive({ game:'garden', i:0 });
    return { afterPlant, stage1, wateredAct, survived, ripeAct, noSeed,
             seedLeft: P.seedCount(P.SEEDS[0].id), crop: P.cropCount(P.SEEDS[0].id),
             emptyAfter: P.bedAction(0), max: P.GROW_MAX, plotMax: P.PLOT_MAX };
  });
  expect(r.noSeed, 'ไม่มีเมล็ดต้องปลูกไม่ได้').toBe(false);
  expect(r.seedLeft, 'ปลูก 1 แปลง = เมล็ดลด 1 เม็ด').toBe(3);
  expect(r.crop, 'เก็บแล้วผลผลิตเข้าคลัง (ยังไม่ได้เงิน ต้องเอาไปขาย)').toBe(1);
  expect(r.afterPlant.acts[0], 'ปลูกแปลงแรกแล้วป้ายเปลี่ยนเป็นรดน้ำ').toBe('water');
  expect(r.afterPlant.acts.slice(1), 'แปลงอื่นต้องยังว่าง — ทำทีละแปลง').toEqual(['plant','plant','plant']);
  expect(r.stage1).toBe(1);
  expect(r.wateredAct, 'รดแล้ววันนี้ = รอวันพรุ่งนี้').toBe('wait');
  expect(r.survived.has, '⚠ ลืมรดน้ำแล้วผักต้องไม่ตาย').toBe(true);
  expect(r.survived.stage, 'และต้องไม่ถอยขั้นด้วย').toBe(1);
  expect(r.ripeAct, 'โตเต็มแล้วป้ายต้องเปลี่ยนเป็นเก็บ').toBe('harvest');
  expect(r.emptyAfter, 'เก็บแล้วแปลงว่างอีกครั้ง').toBe('plant');
  /* 🔒 ผู้ใช้สั่ง 2026-08-14: **ซื้อแปลงเพิ่มได้สูงสุด 8 แปลง** (ชุดเริ่มต้นยังให้มา 4 เหมือนเดิม)
     — เกณฑ์เดิมที่บังคับว่า PLOT_MAX ต้องเป็น 4 ถูกทับด้วยมตินี้ **ห้ามลบเทสทิ้ง ให้เปลี่ยนเกณฑ์** */
  expect(r.plotMax, 'เพดานแปลงผัก = 8').toBe(8);
  /* เพดานต้องบังคับใช้จริงทั้งตอนซื้อและตอนแจกฟรี ไม่ใช่แค่ตัวเลขลอยๆ */
  const cap = await page.evaluate(() => {
    const S = window.HouseShop;
    let n = 0;
    while (S.grantFree('veg-plot') && n < 40) n++;
    return { plots: S.furnCount('veg-plot'), max: S.FURN_MAX['veg-plot'],
             buyWhenFull: S.buyFurn('veg-plot'),
             basket: S.furnCount('sell-basket'), basketMax: S.FURN_MAX['sell-basket'],
             basketGrant: S.grantFree('sell-basket') };
  });
  expect(cap.max).toBe(8);
  expect(cap.plots, 'แจกฟรีเกินเพดานไม่ได้').toBe(8);
  expect(cap.buyWhenFull, 'ชนเพดานแล้วซื้อเพิ่มไม่ได้').toBe(false);
  /* 🧺 ตะกร้าขายของ = ของ default 1 ใบ ไม่มีขายในร้าน (ผู้ใช้สั่ง 2026-08-14) */
  expect(cap.basketMax).toBe(1);
  expect(cap.basket, 'ตะกร้ามีได้ใบเดียว').toBe(1);
  expect(cap.basketGrant, 'ตะกร้าเพิ่มใบที่ 2 ไม่ได้').toBe(false);
  /* ⚠ เก็บผักแล้ว **ยังไม่ได้เงิน** — ต้องเอาไปขายที่ร้านต้นไม้ก่อน (ผู้ใช้สั่ง 2026-08-13) */
  expect(await coins(page) - before, 'เก็บผักยังไม่ได้เงิน').toBe(0);
  expect(errs).toEqual([]);
});


test('เฟส 11J: ขึ้นวันใหม่ — ของรายวันรีเซ็ต แต่ของถาวรห้ามหาย', async ({ page }) => {
  const errs = await house(page, {
    play: {
      v: 1, day: '1999-1-1',                        /* วันเก่า ⇒ ต้องถูกม้วนวันทันทีที่เข้าเกม */
      seek: { on: true, spots: [{ x: 5, z: 5 }], found: [0], done: true },
      col:  { items: [{ x: 5, z: 5 }], got: [0], sets: 4, prizes: ['birdhouse'] },
      fish: { book: ['nil', 'gold'], today: 9, spot: null },
      photo:{ order: 'water', done: true, shots: [{ u: 'x', d: '1999-1-1' }] },
      garden:{ plots: [{ seed: 'carrot', stage: 2 }], watered: '1999-1-1' },   /* คีย์เก่า — ต้องถูก migrate */
    },
  });
  const r = await page.evaluate(() => {
    const s = window.HousePlay.state();
    return {
      day: s.day,
      seekDone: s.seek.done, seekOn: s.seek.on,
      colGot: s.col.got.length, colSets: s.col.sets, prizes: s.col.prizes,
      fishToday: s.fish.today, book: s.fish.book,
      photoDone: s.photo.done, shots: s.photo.shots.length,
      plots: s.garden.plots, watered: s.garden.watered, wd: s.garden.plots[0].wd,
    };
  });
  /* รีเซ็ตรายวัน */
  expect(r.day).not.toBe('1999-1-1');
  expect(r.seekDone, 'ซ่อนแอบเล่นได้ใหม่ในวันใหม่').toBe(false);
  expect(r.seekOn).toBe(false);
  expect(r.colGot).toBe(0);
  expect(r.fishToday).toBe(0);
  expect(r.photoDone).toBe(false);
  /* ⚠ `garden.watered` (รายวันทั้งสวน) ถูกแทนด้วย `wd` รายแปลงแล้ว — migration ต้องย้ายค่าให้
     และ **ห้ามล้าง `wd` ตอนขึ้นวันใหม่** (เทียบกับวันปัจจุบันตอนใช้งานอยู่แล้ว) */
  expect(r.watered, 'คีย์เก่าต้องถูกลบหลัง migrate').toBe(undefined);
  expect(r.wd, 'ค่าที่รดไว้ต้องย้ายมาอยู่ที่ตัวแปลง').toBe('1999-1-1');
  /* ⚠ ของถาวรห้ามหายเด็ดขาด */
  expect(r.colSets, 'จำนวนวันที่เก็บครบ').toBe(4);
  expect(r.prizes).toEqual(['birdhouse']);
  expect(r.book, 'สมุดปลา').toEqual(['nil', 'gold']);
  expect(r.shots, 'อัลบั้มรูป').toBe(1);
  expect(r.plots.length, 'ต้นผักที่ปลูกไว้').toBe(1);
  expect(r.plots[0].stage, 'และขั้นการเติบโตต้องคงเดิม').toBe(2);
  expect(r.plots[0].seed).toBe('carrot');
  expect(errs).toEqual([]);
});

test('เฟส 11K: ของในฉากต้องถูกเก็บกวาด — เข้าบ้าน/ออกจากบ้านแล้วไม่ค้าง', async ({ page }) => {
  const errs = await house(page);
  const out0 = await page.evaluate(() => { window.HousePlay.seekStart(); window.HousePlay.seekIntroSkip(); window.HousePlay.seekIntroSkip(); return window.HousePlay.objs(); });
  expect(out0.col).toBeGreaterThan(0);
  expect(out0.seek).toBeGreaterThan(0);

  await page.evaluate(() => window.__houseDbg.enterHouse());
  await page.waitForTimeout(1200);
  const inside = await page.evaluate(() => window.HousePlay.objs());
  expect(inside, 'อยู่ในบ้าน = ต้องไม่มีของกลุ่ม A ค้างในฉาก').toEqual({ seek: 0, col: 0, garden: 0 });

  /* ออกมาข้างนอกต้องกลับมาครบ (ของที่ยังไม่ได้เก็บ) */
  await page.evaluate(() => window.__houseDbg.leaveHouse());
  await expect.poll(() => page.evaluate(() => window.HousePlay.objs().col), { timeout: 15000 })
    .toBeGreaterThan(0);
  expect(errs).toEqual([]);
});

/* ============================================================
   รอบแก้ 2026-08-14 — กติกาที่ผู้ใช้สั่งเพิ่ม
   ① ตกปลาอยู่ = **เดินไม่ได้** (ของเดิมเดินหนีไปได้ทั้งที่เบ็ดยังอยู่ในน้ำ)
   ② ดึงเบ็ดต้องมี **ท่าทางของตัวเด็ก** ไม่ใช่แค่ทุ่นหาย
   ③ ปุ่มของที่บ้าน (สัตว์เลี้ยง/แต่งตัว/แต่งบ้าน) โผล่ **เฉพาะตอนอยู่ที่บ้าน**
   ④ เข็มทิศเป็นคอลัมน์แรกของ HUD สูงเท่า 2 แถว · แถบเควสต์อยู่ใต้เข็มทิศ
   ============================================================ */
test('เฟส 11L: ตกปลาอยู่ = เดินไม่ได้ · ดึงเบ็ดแล้วมีท่าทาง · ดึงเสร็จเดินต่อได้', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(async () => {
    const P = window.HousePlay, W = window.HouseWorld, D = window.__houseDbg;
    const sp = P.fishSpots()[0];
    D.tp(sp.sx, sp.sz);
    const start = W.tile();
    /* ⚠ **ห้าม hardcode ปลายทาง** — ช่องรอบบ่อน้ำเป็นน้ำ/ป่าเยอะ ถ้าเล็งไปช่องที่เดินไม่ได้
       เทสจะแดงสลับไปมาโดยไม่เกี่ยวกับของที่คุมอยู่ ⇒ ไล่หาช่องที่ findPath บอกว่าเดินถึงจริง */
    let dest = null;
    for (let r = 3; r <= 8 && !dest; r++)
      for (let dx = -r; dx <= r && !dest; dx++) for (let dz = -r; dz <= r && !dest; dz++) {
        const t = { x: start.x + dx, z: start.z + dz };
        if (Math.abs(dx) + Math.abs(dz) < 3) continue;
        if (W.walkable(t.x, t.z) && W.pathLen(start, t) > 0) dest = t;
      }
    P.fishCast();
    /* สั่งเดินทุกทางที่มี: ผ่าน HouseWorld.walkTo และผ่านการแตะฉากจริง */
    W.walkTo(dest.x, dest.z);
    D.tapScene(dest.x, dest.z);
    await new Promise(res => setTimeout(res, 900));
    const stuck = W.tile();
    const posing = D.charPose();
    /* ดึงเบ็ด (ยังไม่ถึงจังหวะก็ได้ — ต้องมีท่าดึงเหมือนกัน) แล้วต้องเดินได้อีกครั้ง */
    P.fishPull();
    const pulled = D.charPose();
    const freed = P.fishState();
    W.walkTo(dest.x, dest.z);
    return { start, dest, stuck, posing, pulled, freed };
  });
  expect(r.stuck, '🎣 กำลังตกปลาอยู่ต้องเดินไม่ได้เลย').toEqual(r.start);
  expect(r.posing.act, 'ระหว่างรอปลาต้องค้างท่าถือคันเบ็ดไว้').toBe('cast');
  expect(r.posing.hold, 'ท่าถือคันเบ็ดต้องเป็นแบบค้างไว้ ไม่ใช่เล่นจบแล้วกลับท่ายืน').toBe(true);
  expect(r.pulled.act, 'ดึงเบ็ดต้องมีท่าทางของตัวเด็ก').toBe('pull');
  expect(r.freed, 'ดึงแล้วต้องเลิกสถานะตกปลา').toBe(null);
  /* ⚠ **ต้อง poll ไม่ใช่ setTimeout ตายตัว** — เดิน 3 ช่องใช้ ~1 วิตอนเฟรมเต็ม แต่ตอนรันทั้งชุด
     เฟรมตกจน engine clamp `dt` ที่ 50ms/เฟรม ⇒ "เวลาในเกม" เดินช้ากว่านาฬิกาจริงหลายเท่า
     (เทสตัวนี้เคยผ่านตอนรันเดี่ยวแต่แดงตอนรันทั้งชุดด้วยเหตุนี้) */
  await expect.poll(() => page.evaluate(() => window.HouseWorld.tile()), { timeout: 30000 })
    .not.toEqual(r.start);
  expect(errs).toEqual([]);
});

test('เฟส 11M: ปุ่มของที่บ้านโผล่เฉพาะตอนอยู่บ้าน + เข็มทิศเป็นคอลัมน์แรกสูงเท่า 2 แถว', async ({ page }) => {
  const errs = await house(page);
  const IDS = ['house-pet-btn', 'house-edit-btn', 'house-decorate-btn'];
  const snap = () => page.evaluate(ids => {
    const rc = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
    const cam = document.getElementById('house-photo-btn');
    return {
      shown: ids.map(i => !document.getElementById(i).hidden),
      /* ปุ่มของที่บ้านต้องอยู่ "แถวเดียวกับปุ่มกล้อง" คือใน .house-ctrl-top เดียวกัน */
      besideCam: ids.every(i => document.getElementById(i).parentElement === cam.parentElement),
      atHome: document.body.classList.contains('house-at-home'),
      compass: rc(document.getElementById('house-compass')),
      chip: rc(document.getElementById('house-child-chip')),
      quest: rc(document.getElementById('house-quest-bar')),
    };
  }, IDS);

  /* กลางเมือง (ไกลบ้าน) — ต้องไม่มีปุ่มพวกนี้ */
  await page.evaluate(() => window.__houseDbg.tp(40, 30));
  await page.waitForTimeout(500);
  const away = await snap();
  expect(away.shown, 'อยู่ไกลบ้าน = ปุ่มของที่บ้านต้องหายหมด').toEqual([false, false, false]);
  expect(away.atHome).toBe(false);

  /* ในบริเวณบ้าน — ต้องโผล่ครบและอยู่ข้างปุ่มกล้อง */
  await page.evaluate(() => window.__houseDbg.tp(20, 33));
  await page.waitForTimeout(500);
  const home = await snap();
  expect(home.shown, 'อยู่บริเวณบ้าน = ปุ่มของที่บ้านต้องโผล่ครบ').toEqual([true, true, true]);
  expect(home.besideCam, 'ปุ่มของที่บ้านต้องอยู่แถวเดียวกับปุ่มกล้อง (ผู้ใช้สั่ง 2026-08-14)').toBe(true);

  /* ในตัวบ้านก็ถือว่าอยู่บ้าน */
  await page.evaluate(() => window.__houseDbg.enterHouse());
  await page.waitForTimeout(700);
  expect((await snap()).shown, 'อยู่ในตัวบ้านก็ต้องเห็นปุ่มชุดนี้').toEqual([true, true, true]);
  await page.evaluate(() => window.__houseDbg.leaveHouse());
  await page.waitForTimeout(700);

  /* 🧭 เข็มทิศ = คอลัมน์แรกของ HUD · สูงเท่า 2 แถวพอดี · แถบเควสต์อยู่ใต้เข็มทิศ */
  const c = home.compass, chip = home.chip, q = home.quest;
  expect(c.x, 'เข็มทิศต้องเป็นคอลัมน์ซ้ายสุด อยู่หน้าชื่อเด็ก').toBeLessThan(chip.x);
  expect(c.y, 'เข็มทิศต้องเริ่มแถวเดียวกับชื่อเด็ก').toBe(chip.y);
  /* สูง = แถวชื่อเด็ก + ระยะห่าง + แถบสัตว์เลี้ยง ⇒ ล่างสุดต้องพอดีกับก่อนแถบเควสต์ */
  expect(c.h, 'เข็มทิศต้องสูงกว่า 1 แถว (ต้องเท่า 2 แถว)').toBeGreaterThan(chip.h * 1.8);
  expect(q.y, 'แถบเควสต์ต้องอยู่ใต้เข็มทิศ').toBeGreaterThanOrEqual(c.y + c.h);
  expect(q.x, 'แถบเควสต์ต้องเริ่มชิดซ้ายตรงกับเข็มทิศ').toBe(c.x);
  expect(errs).toEqual([]);
});

test('เฟส 11N: แถบเพื่อนตัวน้อยโชว์เสมอ — ยังไม่มีสัตว์ = สถานะกุญแจล็อก กดแล้วบอกทางไปรับเลี้ยง', async ({ page }) => {
  const errs = await house(page);          /* save ไม่มี pet = เด็กที่ยังไม่เคยรับเลี้ยง */
  await page.evaluate(() => window.__houseDbg.tp(20, 33));
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const bar = document.getElementById('house-pet-bar');
    const cs = id => getComputedStyle(document.getElementById(id)).display;
    return {
      hidden: bar.hidden, locked: bar.classList.contains('hpb-locked'),
      lock: getComputedStyle(bar.querySelector('.hpb-lock')).display,
      meter: cs('hpb-fill') === 'none' ? 'none' : getComputedStyle(bar.querySelector('.hpb-meter')).display,
      food: cs('hpb-food'),
      label: document.getElementById('hpb-feed-label').textContent,
      name: document.getElementById('hpb-pet').textContent,
      w: Math.round(bar.getBoundingClientRect().width),
    };
  });
  /* 🔒 ผู้ใช้สั่ง 2026-08-14: **ห้ามซ่อนทั้งแถบตอนยังไม่มีสัตว์** — ต้องเห็นเป็นกุญแจล็อกไว้ */
  expect(r.hidden, 'ยังไม่มีสัตว์ก็ต้องเห็นแถบ').toBe(false);
  expect(r.locked).toBe(true);
  expect(r.lock, 'ต้องมีรูปกุญแจ').not.toBe('none');
  expect(r.meter, 'หลอดความอิ่มยังไม่มีความหมาย ต้องซ่อน').toBe('none');
  expect(r.food, 'ไอคอนอาหารยังไม่มีความหมาย ต้องซ่อน').toBe('none');
  expect(r.label, 'ปุ่มต้องชวนไปรับเลี้ยง ไม่ใช่ "ให้อาหาร"').toContain('รับเลี้ยง');
  expect(r.name).toContain('ยังไม่มีเพื่อน');
  expect(r.w, 'แถบต้องกว้างพออ่านออก').toBeGreaterThan(120);

  /* กดแล้วต้องมีทางไปต่อ (toast บอกทาง) ไม่ใช่กดแล้วเงียบ */
  await page.locator('#hpb-feed').click();
  await expect(page.locator('#toast')).toContainText('ร้านสัตว์เลี้ยง', { timeout: 5000 });
  expect(errs).toEqual([]);
});

/* 💰 **กันเงินเฟ้อจากการตกปลารัวๆ** (ผู้ใช้สั่ง 2026-08-22)
   ตกเกิน 10 ตัวในวันเดียว → เจอขยะมากขึ้น · ปลาหายากน้อยลงมากๆ
   🔒 แต่ยังต้องตกได้เรื่อยๆ (ห้ามตัน) และ **ห้ามหรี่ตอนทำเควสต์ตกปลา** (เควสต์สั่งปลาเจาะจง) */
test('11P: ตกปลาเยอะเกินไปในวันเดียว → ขยะเยอะขึ้น ปลาหายากน้อยลง แต่ยังตกได้เสมอ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const P = window.HousePlay;
    const roll = n => {
      P.devFishToday(n);
      const c = { junk: 0, r1: 0, r2: 0, r3: 0, nil: 0 };
      for (let i = 0; i < 4000; i++) {
        const f = P.devRollFish('pond');
        if (!f) { c.nil++; continue; }
        if (f.junk) c.junk++;
        c['r' + f.rare]++;
      }
      return c;
    };
    return { fresh: roll(0), mid: roll(15), tired: roll(30) };
  });
  const pc = (o, k) => o[k] / 4000;
  expect(r.fresh.nil + r.mid.nil + r.tired.nil, 'ต้องได้ของทุกครั้ง ห้ามตกแล้วไม่ได้อะไรเลย').toBe(0);
  /* 10 ตัวแรก = โอกาสเดิมทุกอย่าง */
  expect(pc(r.fresh, 'r3'), 'ยังไม่เหนื่อย: ปลาหายากมากต้องยังราว 10%').toBeGreaterThan(.07);
  /* ยิ่งตกยิ่งเจอขยะ · ปลาหายากยิ่งหด */
  expect(pc(r.mid, 'junk'), 'ตกไป 15 ตัวแล้วต้องเจอขยะมากกว่าเดิมชัดเจน').toBeGreaterThan(pc(r.fresh, 'junk') * 2);
  expect(pc(r.tired, 'junk'), 'ตกไป 30 ตัวแล้วขยะต้องมากกว่านั้นอีก').toBeGreaterThan(pc(r.mid, 'junk'));
  expect(pc(r.tired, 'r3'), 'ปลาหายากมากต้องเหลือน้อยมากๆ').toBeLessThan(.02);
  expect(pc(r.tired, 'r2'), 'ปลาหายากต้องหดลงชัดเจน').toBeLessThan(pc(r.fresh, 'r2') / 3);
  /* 🔒 ยังได้ปลาจริง (ไม่ใช่ขยะล้วน) — ห้ามลงโทษเด็กจนเล่นต่อไม่สนุก */
  expect(pc(r.tired, 'r1') - pc(r.tired, 'junk'), 'ต้องยังได้ปลาธรรมดาเยอะกว่าขยะเสมอ').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});

/* 🧭 ปุ่มนำทางไปเก็บของประจำวัน (ผู้ใช้สั่ง 2026-08-22)
   ⚠ ต้องเป็น **สวิตช์ที่เด็กกดเอง** ไม่ใช่ลูกศรที่โผล่เองตลอดวัน (กติกา 2026-08-16 ยังอยู่) */
test('11Q: แผงกิจกรรมมีปุ่มนำทางไปเก็บของ · กดแล้วลูกศรขึ้น · กดซ้ำแล้วดับ', async ({ page }) => {
  const errs = await house(page);
  /* ลูกศรต้องยังไม่โผล่เองก่อนกดปุ่ม */
  const before = await page.evaluate(() => window.__houseDbg.qArrow().shown);
  expect(before, 'ยังไม่กดปุ่ม ลูกศรต้องไม่โผล่เอง').toBe(false);

  await page.locator('#house-play-btn').click();
  await expect(page.locator('#house-playpanel')).toBeVisible();
  const btn = page.locator('#house-playpanel .hpl-btn', { hasText: 'พาไปเก็บ' });
  await expect(btn, 'แผงกิจกรรมต้องมีปุ่มนำทางไปเก็บของ').toHaveCount(1);
  /* 🎨 กฎถาวร: อะไรที่ต้องมีไอคอน ให้วาดเป็น SVG ห้ามใช้ emoji (ผู้ใช้สั่ง 2026-08-22) */
  const ic = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#house-playpanel .hpl-btn'))
      .find(x => /พาไปเก็บ/.test(x.textContent));
    return { svg: !!b.querySelector('.hpl-btn-ic svg'), emoji: /[\u{1F300}-\u{1FAFF}]/u.test(b.textContent) };
  });
  expect(ic.svg, 'ไอคอนบนปุ่มต้องเป็น SVG').toBe(true);
  expect(ic.emoji, 'ห้ามเหลือ emoji บนปุ่ม').toBe(false);
  await btn.click();
  await expect.poll(() => page.evaluate(() => window.HouseWorld.guidingCollect())).toBe(true);
  /* 🧭 กดแล้ว **แผงต้องปิดให้เอง** (ผู้ใช้สั่ง 2026-08-24) — ลูกศรอยู่ในโลก 3D
     แผงเปิดค้างอยู่เด็กก็ไม่เห็นลูกศรที่เพิ่งสั่งให้ขึ้น */
  await expect(page.locator('#house-playpanel'), 'กด "พาไปเก็บ" แล้วแผงต้องปิดเอง').toBeHidden();
  /* กด "พอแล้ว" ต้องเปิดแผงกลับมาก่อน (ปุ่มอยู่ในแผง) */
  await page.locator('#house-play-btn').click();
  await expect(page.locator('#house-playpanel')).toBeVisible();
  /* ⚠ `guidingCollect()` เป็น state ใน JS ที่พลิกทันทีตอนกดปุ่ม แต่ตัวลูกศร `#house-qarrow`
     **ลูปวาดเป็นคนอัปเดต** ⇒ ต้อง poll ห้ามอ่านครั้งเดียวต่อจากบรรทัดบน
     (เครื่องเทสวาดได้ ~3 fps จริง · กับดักเดิมที่บันทึกไว้ตั้งแต่เฟส 12.1) */
  await expect.poll(() => page.evaluate(() => window.__houseDbg.qArrow().shown),
                    { message: 'กดปุ่มแล้วต้องมีลูกศรชี้ทาง' }).toBe(true);
  const on = await page.evaluate(() => window.__houseDbg.qArrow());
  expect(on.target && on.target.tile, 'ลูกศรต้องชี้ไปที่ของจริงในเมือง').toBeTruthy();

  await page.locator('#house-playpanel .hpl-btn', { hasText: 'พอแล้ว' }).click();
  await expect.poll(() => page.evaluate(() => window.HouseWorld.guidingCollect())).toBe(false);
  await expect.poll(() => page.evaluate(() => window.__houseDbg.qArrow().shown)).toBe(false);
  expect(errs).toEqual([]);
});

/* 🛒 ช่องรายการในร้าน — ของเหลือน้อยแล้วช่องต้องไม่ยืดสูงผิดปกติ และต้องเท่ากันทุกช่อง
   (ผู้ใช้แจ้ง 2026-08-22 · ก่อนแก้: แถวขายปลา 2 แถวสูง 155px ทั้งที่เนื้อหาจริง ~55px) */
test('11R: ช่องรายการในร้านสูงเท่ากันทุกช่อง ไม่ยืดตามที่ว่างเวลาของเหลือน้อย', async ({ page }) => {
  const errs = await house(page, {
    play: {
      v: 1, day: '', seek: { on: false, spots: [], found: [], done: false },
      col: { items: [], got: [], sets: 0, prizes: [] },
      fish: { book: ['nil', 'carp'], bag: { nil: 2, carp: 1 }, today: 0, spot: null },
      photo: { order: '', done: false, shots: [] },
      garden: { plots: [], seeds: {}, crop: {} },
    },
  });
  const r = await page.evaluate(async () => {
    window.HouseShop.open('shop-mart');
    await new Promise(z => setTimeout(z, 400));
    const w = document.getElementById('house-shop-items');
    const hs = Array.from(w.querySelectorAll('.hpt-row')).map(c => Math.round(c.getBoundingClientRect().height));
    return { n: hs.length, min: Math.min.apply(null, hs), max: Math.max.apply(null, hs) };
  });
  expect(r.n, 'ต้องมีแถวขายปลา 2 ชนิด').toBe(2);
  expect(r.max, 'ช่องต้องสูงเท่าเนื้อหาจริง ไม่ยืดเต็มที่ว่าง').toBeLessThan(100);
  expect(r.max - r.min, 'ทุกช่องต้องสูงเท่ากัน').toBe(0);
  expect(errs).toEqual([]);
});


/* 🙈 แถบบอกระยะห่างตอนซ่อนแอบ ต้องยังไม่โผล่ระหว่างนับถอยหลัง (ผู้ใช้สั่ง 2026-08-24)
   ตอนนั้นเด็กนั่งปิดตาอยู่ และเพื่อนกำลังวิ่งผ่านไปหาที่แอบ ⇒ แถบจะขยับตามคนที่วิ่งผ่าน = ใบ้ผิด */
test('11S: เริ่มเกมซ่อนแอบ — แถบบอกระยะห่างต้องซ่อนระหว่างนับถอยหลัง แล้วโผล่ตอนนับจบ',
  async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.HousePlay.seekStart());
  await page.waitForTimeout(600);
  const during = await page.evaluate(() => ({
    intro: window.HousePlay.seekIntroActive(),
    bar: !document.getElementById('house-seek-hud').hidden,
  }));
  expect(during.intro, 'ต้องอยู่ช่วงนับถอยหลัง').toBe(true);
  expect(during.bar, 'ระหว่างนับถอยหลังห้ามโชว์แถบบอกระยะห่าง').toBe(false);

  /* นับจบ (ข้ามอินโทร = จังหวะเดียวกับนับถึง 0) ⇒ แถบต้องโผล่เอง */
  await page.evaluate(() => window.HousePlay.seekIntroSkip());
  await expect.poll(() => page.evaluate(() => !document.getElementById('house-seek-hud').hidden),
                    { message: 'นับจบแล้วแถบต้องโผล่' }).toBe(true);

  /* 🙈 แถบต้องโชว์ **หน้าเพื่อนที่ไปแอบ** ด้วย และใช้คลาสชุดเดียวกับในแผงกิจกรรม
     (ผู้ใช้สั่ง 2026-08-24 — เจอแล้วต้องได้ effect เดียวกันเป๊ะ: จางลง + ติด ✓) */
  const faces = await page.evaluate(() => {
    const el = document.getElementById('house-seek-hud');
    return { n: el.querySelectorAll('.hpl-face').length,
             spots: window.HousePlay.state().seek.spots.length,
             found: el.querySelectorAll('.hpl-face.found').length,
             wrap: !!el.querySelector('.hpl-faces') };
  });
  expect(faces.wrap, 'ต้องใช้กล่องหน้าเพื่อนชุดเดียวกับแผงกิจกรรม (.hpl-faces)').toBe(true);
  expect(faces.n, 'ต้องมีหน้าเพื่อนครบทุกคนที่ไปแอบ').toBe(faces.spots);
  expect(faces.found, 'ยังไม่เจอใคร ต้องยังไม่มีคนไหนจาง').toBe(0);

  /* เจอ 1 คน ⇒ หน้าคนนั้นต้องจางลงและติด ✓ (เหมือนในแผง) */
  await page.evaluate(() => { window.HousePlay.state().seek.found = [0]; });
  await expect.poll(() => page.evaluate(() =>
    document.querySelectorAll('#house-seek-hud .hpl-face.found').length),
    { message: 'เจอแล้วหน้าคนนั้นต้องเปลี่ยนสถานะบนแถบด้วย' }).toBe(1);
  const ok = await page.evaluate(() => ({
    ok: document.querySelectorAll('#house-seek-hud .hpl-face-ok').length,
    dim: getComputedStyle(document.querySelector('#house-seek-hud .hpl-face.found')).opacity,
    dimPanel: (() => { const d = document.createElement('div');
      d.innerHTML = '<span class="hpl-face found"></span>'; document.body.appendChild(d);
      const o = getComputedStyle(d.firstChild.firstChild || d.firstChild).opacity;
      d.remove(); return o; })(),
  }));
  expect(ok.ok, 'ต้องติดเครื่องหมาย ✓ เหมือนในแผง').toBe(1);
  expect(ok.dim, 'ความจางต้องเป็นค่าเดียวกับในแผง (ใช้คลาสร่วมกัน)').toBe(ok.dimPanel);
  expect(errs).toEqual([]);
});
