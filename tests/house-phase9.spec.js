/* ============================================================
   เฟส 9 (เฟสสุดท้ายของแผน) — เครื่องดนตรี 11 ชิ้น + เควสต์ดนตรี 2 แบบ

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. เครื่องดนตรีเป็นของแพงที่สุดในเกมโดยตั้งใจ (500-1,500 🪙) — ห้ามลดราคาเอง
     2. ทุกชิ้นต้องมีร้านขาย (ร้านเครื่องดนตรีขายทั้ง scope in และ out — ระฆังลมแขวนนอกบ้าน)
     3. **เควสต์ดนตรีต้องมีเครื่องในบ้านก่อนถึงจะถูกแจก** ไม่งั้นเด็กรับงานแล้วเล่นไม่ได้ = dead end
     4. เสียงทั้งหมดใช้ Web Audio ชุดเดิม ห้ามโหลดไฟล์เสียงเพิ่ม
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p9a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function house(page, opts){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, withIns]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    const save = { v:1, mapV:3, char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0} };
    /* บ้านที่ "มีเครื่องดนตรีวางแล้ว" — ใช้ทดสอบว่าเควสต์ดนตรีถูกแจกจริง */
    if (withIns) save.decor = { in: [{ id:'ins-ching', x:5, z:5, rot:0, col:0 }], out: [] };
    localStorage.setItem('p1quiz_house_p9a', JSON.stringify(save));
  }, [CHILD, !!(opts && opts.withInstrument)]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  return errs;
}

test('เฟส 9A: เครื่องดนตรีครบ 11 ชิ้น · 3 ระดับ · ราคาแพงสุดในเกม · มีร้านขายครบ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const items = window.__houseDbg.furn().items.filter(i => i.cat === 'music');
    const S = window.HouseShop;
    /* ร้านไหนขายหมวด music บ้าง (ต้องครอบคลุมทั้ง scope in และ out) */
    const scopes = {};
    Object.values(S.SHOPS || {}).forEach(sh => (sh.groups || []).forEach(([sc, , list]) => {
      if (list && list.indexOf('music') >= 0) scopes[sc] = true;
    }));
    return {
      n: items.length,
      levels: items.map(i => i.music).filter((v, x, a) => a.indexOf(v) === x).sort(),
      prices: items.map(i => S.priceFurn(i.id)).sort((a, b) => a - b),
      noAction: items.filter(i => i.action !== 'music').map(i => i.id),
      /* ระดับ 1 ต้องมีโน้ตของตัวเอง · ระดับ 2 ต้องมีทำนอง */
      badData: items.filter(i => (i.music === 2 && !(i.tune && i.tune.length))).map(i => i.id),
      scopes: Object.keys(scopes).sort(),
      outItems: items.filter(i => i.scope === 'out').map(i => i.id),
    };
  });
  console.log('เครื่องดนตรี ' + r.n + ' ชิ้น · ราคา ' + r.prices.join('/'));
  expect(r.n, 'ต้องมี 11 ชิ้นตามข้อ 31').toBe(11);
  expect(r.levels, 'ต้องมีครบ 3 ระดับ').toEqual([1, 2, 3]);
  expect(r.noAction, 'ทุกชิ้นต้องแตะแล้วมีเสียง (action:music)').toEqual([]);
  expect(r.badData, 'ระดับ 2 ต้องมีทำนองของตัวเอง').toEqual([]);
  /* แพงที่สุดในเกมโดยตั้งใจ — ถูกสุด 500 แพงสุด 1,500 (ห้ามลดโดยไม่ถามผู้ใช้) */
  expect(r.prices[0]).toBeGreaterThanOrEqual(500);
  expect(r.prices[r.prices.length - 1]).toBe(1500);
  /* ระฆังลมแขวนนอกบ้าน ⇒ ร้านต้องขายฝั่ง out ด้วย ไม่งั้นไม่มีใครขาย = dead end */
  expect(r.outItems.length).toBeGreaterThan(0);
  expect(r.scopes).toEqual(['in', 'out']);
  expect(errs).toEqual([]);
});

test('เฟส 9A: เครื่องดนตรีทุกชิ้นสร้าง 3D ได้จริง', async ({ page }) => {
  const errs = await house(page);
  const bad = await page.evaluate(() => {
    const out = [];
    window.__houseDbg.furn().items.filter(i => i.cat === 'music').forEach(it => {
      try {
        const g = window.__houseDbg.buildFurn(it.id);
        if (!g || !g.children || !g.children.length) out.push(it.id + ': ไม่มี mesh');
      } catch (e) { out.push(it.id + ': ' + e.message); }
    });
    return out;
  });
  expect(bad).toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 9B: แตะเครื่องดนตรีแล้วเรียกเสียงจริง ไม่ใช้ไฟล์เสียงเพิ่ม', async ({ page }) => {
  const errs = await house(page, { withInstrument: true });
  const r = await page.evaluate(() => {
    /* ดักฟังก์ชันเสียงของหน้าหลัก แล้วเรียก playInstrument ผ่านทางเดินโค้ดจริง */
    const hits = { note: 0, seq: 0, piano: 0 };
    const realNote = window.playPianoNote, realSeq = window.playMusicSequence, realFp = window.openFreePiano;
    window.playPianoNote = (f, d) => { hits.note++; };
    window.playMusicSequence = (s, noFlash) => { hits.seq++; hits.noFlash = noFlash === true; };
    window.openFreePiano = () => { hits.piano++; };
    const F = window.__houseDbg.furn();
    ['ins-ching', 'ins-musicbox', 'ins-guitar'].forEach(id => {
      const it = F.byId[id];
      const g = window.__houseDbg.buildFurn(id);
      g.position.set(0, 0, 0);
      window.__houseDbg.playInstrument(g, it);
    });
    window.playPianoNote = realNote; window.playMusicSequence = realSeq; window.openFreePiano = realFp;
    return hits;
  });
  console.log('เสียงที่ถูกเรียก: ' + JSON.stringify(r));
  expect(r.note, 'ระดับ 1 ต้องเคาะ 1 เสียง').toBeGreaterThan(0);
  expect(r.seq, 'ระดับ 2 ต้องเล่นทำนอง').toBeGreaterThan(0);
  /* ⚠ ต้องส่ง noFlash = true เสมอ — ไม่มีเปียโนของหน้าหลักอยู่บนจอในโหมดบ้าน */
  expect(r.noFlash, 'playMusicSequence ต้องถูกเรียกด้วย noFlash=true').toBe(true);
  expect(r.piano, 'ระดับ 3 ต้องเปิดหน้าเปียโนของหนู').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});

test('เฟส 9C: เควสต์ดนตรีต้องมีเครื่องในบ้านก่อน — บ้านว่างห้ามถูกแจก (กัน dead end)', async ({ page }) => {
  const errs = await house(page);          /* บ้านยังไม่มีเครื่องดนตรี */
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const rngFor = i => { let h = (i * 2654435761) >>> 0;
      return () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; }; };
    const got = new Set();
    for (let i = 0; i < 1500; i++) got.add(q.rollWorkMech(rngFor(i), 'npc-musicshop'));
    return { has: window.__houseDbg.hasInstrument(), mechs: [...got],
             okPlay: q.mechOk('playalong'), okFind: q.mechOk('findsound') };
  });
  console.log('บ้านไม่มีเครื่อง → พี่โน้ตแจก: ' + r.mechs.join(', '));
  expect(r.has).toBe(false);
  expect(r.okPlay, 'บ้านไม่มีเครื่องดนตรี ห้ามแจกเควสต์เล่นตามทำนอง').toBe(false);
  expect(r.okFind, 'บ้านไม่มีเครื่องดนตรี ห้ามแจกเควสต์ทายเสียงเครื่อง').toBe(false);
  expect(r.mechs).not.toContain('playalong');
  expect(r.mechs).not.toContain('findsound');
  /* แต่ต้องยังมีงานอื่นให้ทำเสมอ ไม่ใช่เงียบไปเลย */
  expect(r.mechs.length).toBeGreaterThan(1);
  expect(errs).toEqual([]);
});

test('เฟส 9C: บ้านมีเครื่องดนตรีแล้ว พี่โน้ตแจกเควสต์ดนตรีได้จริง', async ({ page }) => {
  const errs = await house(page, { withInstrument: true });
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const rngFor = i => { let h = (i * 2654435761) >>> 0;
      return () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; }; };
    const got = new Set();
    for (let i = 0; i < 1500; i++) got.add(q.rollWorkMech(rngFor(i), 'npc-musicshop'));
    /* ชาวบ้านทั่วไปต้องไม่ได้เควสต์ดนตรี (เป็นของร้านเครื่องดนตรีเท่านั้น) */
    const other = new Set();
    for (let i = 0; i < 1500; i++) other.add(q.rollWorkMech(rngFor(i), 'npc-mart1'));
    return { has: window.__houseDbg.hasInstrument(), music: [...got], other: [...other] };
  });
  console.log('บ้านมีเครื่อง → พี่โน้ตแจก: ' + r.music.join(', '));
  expect(r.has).toBe(true);
  expect(r.music).toContain('playalong');
  expect(r.music).toContain('findsound');
  expect(r.other, 'ชาวบ้านทั่วไปห้ามได้เควสต์ดนตรี').not.toContain('playalong');
  expect(r.other).not.toContain('findsound');
  expect(errs).toEqual([]);
});

test('เฟส 9C: กระดานเล่นตามทำนองวาดได้จริง · กดครบแล้วผ่าน · กดผิดไม่มีบทลงโทษ', async ({ page }) => {
  const errs = await house(page, { withInstrument: true });
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'playalong', title: '🎵 เล่นตามทำนอง' }));
  await expect(page.locator('.hqz-key').first()).toBeVisible({ timeout: 10000 });
  const info = await page.evaluate(() => {
    const run = window.__houseDbg.qRun();
    return { keys: document.querySelectorAll('.hqz-key').length,
             dots: document.querySelectorAll('.hqz-kdot').length,
             seq: run.items[run.idx].seq.slice() };
  });
  expect(info.keys).toBeGreaterThanOrEqual(5);
  expect(info.dots, 'ต้องมีจุดบอกความคืบหน้าเท่าจำนวนโน้ต').toBe(info.seq.length);

  /* กดผิดก่อน — ต้องไม่พัง ไม่จบเควสต์ แค่เริ่มกดใหม่ */
  const wrongKey = (info.seq[0] + 1) % info.keys;
  await page.locator('.hqz-key').nth(wrongKey).click();
  await page.waitForTimeout(500);
  expect(await page.locator('.hqz-key').count(), 'กดผิดแล้วต้องยังอยู่ข้อเดิม').toBeGreaterThan(0);

  /* กดถูกครบทั้งลำดับ → ต้องผ่านไปข้อถัดไป */
  const before = await page.evaluate(() => window.__houseDbg.qRun().idx);
  for (const k of info.seq) { await page.locator('.hqz-key').nth(k).click(); await page.waitForTimeout(120); }
  await expect.poll(() => page.evaluate(() => {
    const r = window.__houseDbg.qRun(); return r ? r.idx : 99;
  }), { timeout: 8000 }).toBeGreaterThan(before);
  expect(errs).toEqual([]);
});
