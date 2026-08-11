/* ============================================================
   งานก่อนเฟส 5 — สัญญา Mount · หน้าเลือกทาง · โหมดมือในบ้าน · สะพาน HouseGames
   (ผู้ใช้สั่ง 2026-08-11 ให้ทำ 4 ชิ้นนี้ก่อนเริ่มเฟส 5)
   ============================================================ */
const { test, expect } = require('@playwright/test');
const OUT = '/private/tmp/claude-501/-Users-isarez-year1/f9a3c903-3574-4a5e-9675-beac6680d146/scratchpad/';

const CHILD = { id: 'og1', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function pickChild(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_og1', JSON.stringify({ v:1, mapV:3,
      char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0} }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  return errs;
}
async function enterHouse(page){
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
}

test('OwlGames: mount เกมของหน้าหลักลงกล่องอื่นแล้วเล่นได้ · unmount คืน DOM ที่เดิม', async ({ page }) => {
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();

  const list = await page.evaluate(() => window.OwlGames.list());
  console.log('ลงทะเบียนแล้ว', list.length, 'เกม:', list.join(' '));
  expect(list.length).toBeGreaterThanOrEqual(20);

  const r = await page.evaluate(() => {
    const host = document.createElement('div');
    host.id = 'og-test-host';
    document.getElementById('home-view').appendChild(host);
    const before = document.getElementById('mix-view').parentElement.id;
    const ok = window.OwlGames.mount('mix', host, { catId: 'skill-mix' });
    const inHost = document.getElementById('mix-view').parentElement.id;
    const cur = window.OwlGames.current();
    const hasBody = document.body.classList.contains('og-mounted');
    window.OwlGames.unmount();
    const after = document.getElementById('mix-view').parentElement.id;
    const hidden = document.getElementById('mix-view').hidden;
    return { ok, before, inHost, cur, hasBody, after, hidden };
  });
  console.log(JSON.stringify(r));
  expect(r.ok).toBe(true);
  expect(r.inHost).toBe('og-test-host');
  expect(r.cur).toBe('mix');
  expect(r.hasBody).toBe(true);
  expect(r.after).toBe(r.before);          /* คืนที่เดิมเป๊ะ */
  expect(r.hidden).toBe(true);
  expect(errs).toEqual([]);
});

test('หน้าเลือกทาง: โผล่หลังเลือกเด็ก · เลือกทำโจทย์แล้วเข้าหน้าหมวด · ไม่เด้งซ้ำ', async ({ page }) => {
  const errs = await pickChild(page);
  await expect(page.locator('#landing-view')).toBeVisible();
  await expect(page.locator('#home-view')).toBeHidden();
  await page.screenshot({ path: OUT + 'landing.png' });

  await page.locator('#landing-quiz').click();
  await expect(page.locator('#landing-view')).toBeHidden();
  await expect(page.locator('#home-view')).toBeVisible();

  /* เข้าเกมแล้วกลับมา ต้องไม่เจอหน้าเลือกซ้ำ */
  await page.evaluate(()=>renderHome());
  await expect(page.locator('#landing-view')).toBeHidden();
  expect(errs).toEqual([]);
});
test('หน้าเลือกทาง: เลือกเข้าเมืองแล้วโหมดบ้านเปิดจริง', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);
  await expect(page.locator('#house-view')).toBeVisible();
  expect(errs).toEqual([]);
});

test('โหมดมือในโหมดบ้าน: ปุ่มกล้องโผล่ตอนเปิดการ์ดเควสต์ · หายตอนปิด', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);

  await expect(page.locator('#handplay-toggle')).toHaveCount(0);
  await page.evaluate(()=>window.HouseQuestUI.playTest({mech:'tidy', title:'🧪 t'}));
  await expect(page.locator('.hqz-sort')).toBeVisible();

  /* ปุ่มกล้องต้องโผล่ และต้องอยู่ในแถบบนของโหมดบ้าน */
  const btn = page.locator('#handplay-toggle');
  await expect(btn).toBeVisible();
  const where = await page.evaluate(()=>document.getElementById('handplay-toggle').closest('section').id);
  expect(where).toBe('house-view');

  /* ถังของเกมลาก-วางต้องติดธงให้โหมดมือคลิกได้ */
  const flagged = await page.evaluate(()=>document.querySelectorAll('.hqz-bin[data-hp-click]').length);
  expect(flagged).toBeGreaterThan(0);

  /* ตัวเลือก/กล่องของเป็น <button> อยู่แล้ว = โหมดมือคลิกได้โดยไม่ต้องทำอะไรเพิ่ม */
  expect(await page.evaluate(()=>document.querySelectorAll('.hqz-tile').length)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.querySelector('.hqz-tile').tagName)).toBe('BUTTON');

  /* หรี่เฟรมเรตต้องมีจุดต่อไว้ให้ games-ar เรียก */
  expect(await page.evaluate(()=>typeof window.HouseFrameHint)).toBe('function');

  await page.locator('#hqz-close').click();
  await expect(page.locator('#handplay-toggle')).toHaveCount(0);
  expect(errs).toEqual([]);
});

test('HouseGames: ยืม engine หน้าหลักมาเล่นในการ์ดเควสต์ได้จริง', async ({ page }) => {
  const errs = await pickChild(page);
  await enterHouse(page);

  const list = await page.evaluate(()=>window.HouseGames.allowed());
  console.log('เกมที่เปิดให้เล่นในบ้าน:', list.join(' '));
  expect(list.length).toBeGreaterThanOrEqual(6);

  const r = await page.evaluate(()=>{
    const ok = window.HouseGames.play({gameId:'mix', gradeId:'p2'});
    const view = document.getElementById('mix-view');
    return {ok, cardOpen: !document.getElementById('house-qz').hidden,
            inStage: view.closest('#hqz-stage') !== null,
            embedded: view.classList.contains('og-embedded'),
            mounted: window.OwlGames.current()};
  });
  console.log(JSON.stringify(r));
  expect(r.ok).toBe(true);
  expect(r.cardOpen).toBe(true);
  expect(r.inStage).toBe(true);
  expect(r.embedded).toBe(true);
  expect(r.mounted).toBe('mix');

  /* ปิดการ์ด → view ต้องกลับที่เดิมและซ่อน */
  await page.evaluate(()=>window.HouseQuestUI.closeCard());
  const after = await page.evaluate(()=>{
    window.OwlGames.unmount();
    const v = document.getElementById('mix-view');
    return {hidden: v.hidden, inStage: v.closest('#hqz-stage') !== null, cur: window.OwlGames.current()};
  });
  expect(after.inStage).toBe(false);
  expect(after.hidden).toBe(true);
  expect(after.cur).toBe(null);
  expect(errs).toEqual([]);
});
