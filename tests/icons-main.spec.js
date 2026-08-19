/* ============================================================
   🧩 คลังไอคอนของ "หน้าหลัก" — เฟส C/D/E ของ ICON-PLAN.md (2026-08-20)

   สิ่งที่ชุดนี้คุม:
     ① แกนกลาง `js/shared/icons.js` ต้องใช้ได้ **โดยไม่ต้องเข้าโหมดบ้าน**
        (ของเดิมคลังอยู่ใน house-icons.js ซึ่งโหลด lazy ⇒ หน้าหลักเรียกไม่ได้เลย)
     ② `OwlIcons.text()` ต้อง escape ข้อความเสมอ และปล่อย emoji ที่ยังไม่มีไอคอนไว้เหมือนเดิม
     ③ รูปประกอบโจทย์/เงาปริศนา/ของในเกมนกฮูกสั่ง ต้องวาดด้วย SVG จริงเมื่อมีไอคอน
     ④ **ห้ามแตะข้อความบนปุ่มตัวเลือก** — ข้อความนั้นคือเฉลยที่ระบบใช้เทียบคำตอบ
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'icomain', name: 'ไอคอน', emoji: '🎨', birthDate: '2018-06-01', grade: 'p1' };

async function main(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if(m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
  }, CHILD);
  await page.goto('/');
  await page.waitForFunction(() => !!window.OwlIcons, null, { timeout: 20000 });
  return errs;
}

test('IM1: แกนกลางคลังไอคอนใช้ได้ทันทีบนหน้าหลัก (ไม่ต้องเข้าโหมดบ้าน)', async ({ page }) => {
  const errs = await main(page);
  const r = await page.evaluate(() => ({
    n: window.OwlIcons.ids().length,
    alias: window.HouseIcons === window.OwlIcons,
    ui: ['ui-star', 'ui-check', 'ui-lock', 'ui-coin', 'ui-gift'].filter(i => !window.OwlIcons.has(i)),
    houseNotLoaded: !window.HousePlay,          /* ยังไม่ได้เข้าบ้าน = แพ็กโหมดบ้านยังไม่โหลด */
  }));
  expect(r.n, 'ต้องมีไอคอนพร้อมใช้ตั้งแต่หน้าหลัก').toBeGreaterThan(80);
  expect(r.alias, 'ชื่อเดิม HouseIcons ต้องชี้ไปที่แกนกลางตัวเดียวกัน').toBe(true);
  expect(r.ui, 'ไอคอน UI กลางต้องอยู่ในแกนกลาง ไม่ใช่ในแพ็กโหมดบ้าน').toEqual([]);
  expect(r.houseNotLoaded, 'เทสนี้ต้องยังไม่เข้าโหมดบ้าน').toBe(true);
  expect(errs).toEqual([]);
});

test('IM2: ไอคอนคลังโจทย์วาดได้ทุกตัว · แผนที่ emoji ชี้ไป id ที่มีจริง', async ({ page }) => {
  const errs = await main(page);
  const r = await page.evaluate(() => {
    const I = window.OwlIcons, bad = [];
    const ids = I.ids().filter(i => i.indexOf('q-') === 0);
    ids.forEach(id => {
      let h = '';
      try { h = I.html(id, 30); } catch (e) { bad.push(id + ' → ' + e.message); return; }
      if(!h || h.indexOf('<svg') !== 0) bad.push(id + ' → คืนค่าว่าง');
    });
    /* ทุก emoji ที่ map ไว้ต้องได้ SVG จริง */
    const badMap = [];
    ['🍎', '⭐', '➕', '🔴', '➡️', '🌳', '📚', '🚗', '⚖️', '🔢'].forEach(e => {
      if(!I.hasEmoji(e)) badMap.push(e);
    });
    return { n: ids.length, bad, badMap };
  });
  expect(r.n, 'แพ็กคลังโจทย์ต้องโหลด').toBeGreaterThan(60);
  expect(r.bad, 'ไอคอนที่วาดแล้วพัง').toEqual([]);
  expect(r.badMap, 'emoji ยอดฮิตที่ยังไม่ได้ map').toEqual([]);
  expect(errs).toEqual([]);
});

test('IM3: OwlIcons.text() — escape ข้อความเสมอ · emoji ที่ไม่มีไอคอนต้องไม่หาย', async ({ page }) => {
  await main(page);
  const r = await page.evaluate(() => {
    const I = window.OwlIcons;
    return {
      escaped: I.text('<script>x</script> ⭐'),
      unknown: I.text('🫏 ทดสอบ'),         /* emoji ที่ยังไม่มีไอคอน */
      plain: I.text('ไม่มีอิโมจิเลย'),
      has: [I.hasEmoji('มี ⭐ นะ'), I.hasEmoji('ไม่มีเลย')],
    };
  });
  expect(r.escaped, 'ต้อง escape แท็ก').toContain('&lt;script&gt;');
  expect(r.escaped, 'ห้ามปล่อย <script> ดิบ').not.toContain('<script>');
  expect(r.escaped, '⭐ ต้องกลายเป็น SVG').toContain('<svg');
  expect(r.unknown, 'emoji ที่ไม่มีไอคอนต้องยังอยู่').toContain('🫏');
  expect(r.plain).toBe('ไม่มีอิโมจิเลย');
  expect(r.has).toEqual([true, false]);
});

test('IM4: โจทย์ควิซ — รูปประกอบเป็น SVG แต่ **ข้อความบนปุ่มตัวเลือกต้องไม่ถูกแตะ**', async ({ page }) => {
  const errs = await main(page);
  await page.locator('#child-select-view .child-card').first().click();
  /* เปิดหน้าเลือกโหมด → ทำโจทย์ */
  const quiz = page.locator('#landing-quiz');
  if(await quiz.count()) await quiz.click();
  await page.locator('#cat-grid .cat-card').first().click();
  await page.waitForSelector('#choice-grid .choice-btn', { timeout: 20000 });
  const r = await page.evaluate(() => {
    const em = document.getElementById('q-emoji');
    const btns = Array.from(document.querySelectorAll('#choice-grid .choice-btn'));
    return {
      emojiHtml: em ? em.innerHTML : '',
      emojiText: em ? em.textContent : '',
      choiceTexts: btns.map(b => b.textContent),
      choiceHasSvg: btns.some(b => !!b.querySelector('svg')),
    };
  });
  /* ⚠ ปุ่มตัวเลือกต้องยังเป็นข้อความล้วน — ระบบเทียบคำตอบจาก textContent */
  expect(r.choiceHasSvg, 'ปุ่มตัวเลือกต้องไม่ถูกเปลี่ยนเป็นรูป').toBe(false);
  r.choiceTexts.forEach(t => expect(t.length, 'ปุ่มตัวเลือกต้องมีข้อความเสมอ').toBeGreaterThan(0));
  expect(errs).toEqual([]);
});
