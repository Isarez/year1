const { test, expect } = require('@playwright/test');

/* หน้า "คลังคำถาม" ในเมนูเฟืองของโหมดบ้าน (js/house-qbrowse.js + catalog API ใน js/house-quests.js)
   หน้านี้เป็นเครื่องมือเทส จุดที่ต้องไม่พังคือ:
     1) กางคลังได้ครบทุกระดับชั้น × ทุกกลไก — ตัวเลขในตารางต้องตรงกับคลัง CATS จริง
     2) **เล่นในหน้านี้ต้องไม่แตะอะไรของเด็กเลย** ไม่ได้เหรียญ ไม่กินโควตาเควสต์วันนี้
        ไม่บวกดาว ไม่บันทึกสถิติประตูความพร้อม (ไม่งั้นเปิดเทสทีเดียวเศรษฐกิจในเกมพัง)
     3) โจทย์ทุกชนิดในคลังต้องวาดออกมาได้จริง (img / pattern / emoji / ข้อความ)
        — เป็นบั๊กที่เคยหลุดมาแล้ว 2026-08-08 (การ์ดเปล่าในหมวดเชาว์) หน้านี้คือตัวดักซ้ำ */

const CHILD = { id: 'qb-test', name: 'เทสคลัง', emoji: '📚', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
/* มีบ้านอยู่แล้ว → ข้ามหน้าสร้างตัวละคร/เลือกสัตว์เลี้ยง เข้าเมืองได้เลย */
const SEED = { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } };

async function openBrowser(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
  }, [CHILD, HKEY, SEED]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseQB && !!window.HouseQuests, null, { timeout: 30000 });
  await page.waitForTimeout(900);
  /* เปิดผ่านปุ่มจริงในเมนูเฟือง (ไม่เรียก API ตรงๆ — จะได้เทสว่าปุ่มยังผูกอยู่) */
  await page.locator('#house-ctrl-gear').dispatchEvent('click');
  await page.locator('#house-qb-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-qb').hidden, null, { timeout: 15000 });
  return errors;
}
const readHouse = page => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), HKEY);
const coins = page => page.evaluate(() => window.OwlCoins.get());

test('เปิดจากเมนูเฟือง: มีแท็บครบทุกระดับชั้น + 2 กลไก และเปิดมาที่ชั้นของเด็กคนนี้', async ({ page }) => {
  const errors = await openBrowser(page);
  expect(errors).toEqual([]);

  const nGrades = await page.evaluate(() => GRADES.length);
  await expect(page.locator('#hqb-grades .hqb-chip')).toHaveCount(nGrades);
  await expect(page.locator('#hqb-mechs .hqb-chip')).toHaveCount(2);
  /* เด็กคนนี้เป็น ป.2 ⇒ ต้องเปิดมาที่ ป.2 ไม่ใช่แท็บแรกเสมอ */
  await expect(page.locator('#hqb-grades .hqb-chip.on')).toHaveText(/ป\.2/);
  await expect(page.locator('#hqb-mechs .hqb-chip.on')).toHaveText(/ตอบคำถาม/);
});

test('ตารางกลไก "ตอบคำถาม" มีจำนวนข้อตรงกับคลัง CATS จริงของแต่ละชั้น', async ({ page }) => {
  const errors = await openBrowser(page);
  const gids = await page.evaluate(() => GRADES.map(g => g.id));
  for (const gid of gids) {
    const want = await page.evaluate(g => CATS.filter(c => (c.grade || 'prep-p1') === g
      && !c.mode && !c.type && c.questions && c.questions.length)
      .reduce((s, c) => s + c.questions.length, 0), gid);
    await page.evaluate(g => {                       /* กดแท็บชั้นนั้นผ่าน DOM จริง */
      const chips = document.querySelectorAll('#hqb-grades .hqb-chip');
      const i = GRADES.findIndex(x => x.id === g);
      chips[i].click();
    }, gid);
    await page.waitForTimeout(250);
    const rows = await page.locator('#hqb-wrap tr.hqb-row').count();
    expect(rows, 'จำนวนแถวของ ' + gid).toBe(want);
    expect(want).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test('ตารางกลไก "นับของ" กางครบ 16 ธีม และตัวอย่างโจทย์สร้างได้จริงทุกธีม', async ({ page }) => {
  const errors = await openBrowser(page);
  await page.locator('#hqb-mechs .hqb-chip').nth(1).click();
  await page.waitForTimeout(300);
  const nThemes = await page.evaluate(() => Object.keys(window.HouseQuests.ITEM_SETS).length);
  await expect(page.locator('#hqb-wrap tr.hqb-row')).toHaveCount(nThemes);
  /* ทุกแถวต้องมีตัวอย่าง "แถวของ → คำถาม = คำตอบ" ไม่ใช่ช่องว่าง */
  const samples = await page.locator('#hqb-wrap tr.hqb-row .hqb-q').allTextContents();
  expect(samples).toHaveLength(nThemes);
  samples.forEach(s => expect(s).toMatch(/→ .+ = \d+$/));
  /* แถบหมวดต้องหายไปตอนอยู่กลไกนับของ (count ไม่ได้ดึงจากคลัง CATS) */
  expect(await page.locator('#hqb-cats').isHidden()).toBe(true);
  expect(errors).toEqual([]);
});

test('เล่นทดสอบแล้ว **ไม่ได้เหรียญ ไม่กินโควตาวันนี้ ไม่บวกดาว** และกลับมาที่ตารางได้', async ({ page }) => {
  const errors = await openBrowser(page);
  const before = await readHouse(page);
  expect(await coins(page)).toBe(0);

  await page.locator('#hqb-wrap tr.hqb-row .hqb-play').first().click();
  await page.waitForFunction(() => !document.getElementById('house-qz').hidden, null, { timeout: 10000 });
  expect(await page.locator('#house-qb').isHidden()).toBe(true);

  /* ตอบให้ถูกจนจบชุด */
  for (let i = 0; i < 10; i++) {
    const done = await page.evaluate(() => {
      const run = window.HouseQuestUI.run();
      if (!run) return true;
      document.querySelectorAll('#hqz-stage .hqz-choice')[run.items[run.idx].correct].click();
      return false;
    });
    if (done) break;
    await page.waitForTimeout(600);
  }
  await expect(page.locator('#hqz-stage')).toContainText('โหมดทดสอบ');

  expect(await coins(page)).toBe(0);                       /* เงินต้องไม่ขยับ */
  const after = await readHouse(page);
  expect(after.q2.earned | 0).toBe(0);
  expect(after.q2.stars | 0).toBe(0);
  expect(after.q2.total | 0).toBe(0);
  expect(after.q2.npc).toEqual({});                        /* ไม่ปิดเควสต์ NPC คนไหน */
  expect(after.q2.board.done).toEqual([]);                 /* ไม่กินโควตากระดาน */
  expect(after.q2.chal.recent).toEqual([]);                /* ไม่บันทึกสถิติประตูความพร้อม */
  expect(after.q2.chal.done).toEqual({});
  expect(before && before.q2 ? before.q2.stars | 0 : 0).toBe(0);

  /* ปุ่ม "กลับไปที่ตาราง" ต้องพากลับมาที่หน้าคลัง ไม่ใช่ทิ้งไว้กลางเมือง */
  await page.locator('#hqz-stage .hqz-no').click();
  await page.waitForTimeout(400);
  expect(await page.locator('#house-qb').isHidden()).toBe(false);
  expect(await page.locator('#house-qz').isHidden()).toBe(true);
  expect(errors).toEqual([]);
});

test('โจทย์ทุกชนิดในคลัง (ภาพ/แพทเทิร์น/อิโมจิ/ข้อความ) เปิดเล่นแล้ววาดออกมาได้จริง', async ({ page }) => {
  const errors = await openBrowser(page);
  /* ระดับเตรียม ป.1 คือชั้นเดียวที่มีครบทั้ง 4 ชนิด */
  await page.evaluate(() => document.querySelectorAll('#hqb-grades .hqb-chip')[0].click());
  await page.waitForTimeout(300);

  for (const kind of ['img', 'pattern', 'emoji', 'text']) {
    const row = await page.evaluate(k => {
      const c = window.HouseQuests.catalogQuiz('prep-p1').filter(r => r.kind === k)[0];
      return c ? { catId: c.catId, qIdx: c.i } : null;
    }, kind);
    expect(row, 'ต้องมีโจทย์ชนิด ' + kind + ' ในคลังเตรียม ป.1').not.toBeNull();
    await page.evaluate(r => window.HouseQuestUI.playTest(
      { mech: 'quiz', gid: 'prep-p1', catId: r.catId, qIdx: r.qIdx, title: '🧪 เทส' },
      () => { document.getElementById('house-qb').hidden = false; }), row);
    await page.waitForTimeout(350);
    /* ต้องมี "ตัวโจทย์" อย่างน้อย 1 อย่าง + ปุ่มตัวเลือก — การ์ดเปล่าคือบั๊กที่เคยหลุด */
    const seen = await page.evaluate(() => ({
      img: !!document.querySelector('#hqz-stage .hqz-img'),
      pattern: !!document.querySelector('#hqz-stage .pattern-row'),
      emoji: !!document.querySelector('#hqz-stage .hqz-emoji'),
      q: (document.querySelector('#hqz-stage .hqz-q') || {}).textContent || '',
      choices: document.querySelectorAll('#hqz-stage .hqz-choice').length,
    }));
    expect(seen.choices, 'ชนิด ' + kind + ' ต้องมีปุ่มตัวเลือก').toBeGreaterThan(1);
    if (kind === 'img') expect(seen.img).toBe(true);
    if (kind === 'pattern') expect(seen.pattern).toBe(true);
    if (kind === 'emoji') expect(seen.emoji).toBe(true);
    if (kind === 'text') expect(seen.q.length).toBeGreaterThan(0);
    await page.evaluate(() => window.HouseQuestUI.close());
  }
  expect(errors).toEqual([]);
});

test('ออกจากบ้านระหว่างเปิดหน้าคลัง แล้วหน้าคลังต้องไม่เด้งกลับมาทับหน้าหลัก', async ({ page }) => {
  const errors = await openBrowser(page);
  await page.locator('#hqb-wrap tr.hqb-row .hqb-play').first().click();
  await page.waitForFunction(() => !document.getElementById('house-qz').hidden, null, { timeout: 10000 });
  await page.locator('#house-back').dispatchEvent('click');   /* กำลังเล่นอยู่ → กดกลับ 2 ครั้งถึงจะออกจากบ้าน */
  await page.waitForTimeout(400);
  await page.locator('#house-back').dispatchEvent('click');   /* ครั้งนี้ปิดหน้าคลัง */
  await page.waitForTimeout(400);
  await page.locator('#house-back').dispatchEvent('click');   /* ครั้งนี้ออกจากบ้านจริง */
  await page.waitForTimeout(500);
  expect(await page.locator('#house-qb').isHidden()).toBe(true);
  expect(await page.locator('#house-qz').isHidden()).toBe(true);
  expect(await page.locator('#house-view').isHidden()).toBe(true);
  expect(errors).toEqual([]);
});
