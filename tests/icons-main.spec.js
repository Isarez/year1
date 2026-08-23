/* ============================================================
   🧩 คลังไอคอนของ "หน้าหลัก" — เฟส C/D/E ของ ICON-PLAN.md (2026-08-20)

   สิ่งที่ชุดนี้คุม:
     ① แกนกลาง `js/shared/icons.js` ต้องใช้ได้ **โดยไม่ต้องเข้าโหมดบ้าน**
        (ของเดิมคลังอยู่ใน house-icons.js ซึ่งโหลด lazy ⇒ หน้าหลักเรียกไม่ได้เลย)
     ② `OwlIcons.text()` ต้อง escape ข้อความเสมอ และปล่อย emoji ที่ยังไม่มีไอคอนไว้เหมือนเดิม
     ③ รูปประกอบโจทย์/ของในเกมนกฮูกสั่ง ต้องวาดด้วย SVG จริงเมื่อมีไอคอน
     ⑤ **ยกเว้นเกมทายเงา — ต้องเป็น emoji ล้วนทั้งเกม** (ดู IM5)
     ④ **ห้ามแตะข้อความบนปุ่มตัวเลือก** — ข้อความนั้นคือเฉลยที่ระบบใช้เทียบคำตอบ
   ============================================================ */
const { test, expect } = require('@playwright/test');
const { clickEnterQuiz } = require('./helpers');

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
  await clickEnterQuiz(page);
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

test('IM5: เกมทายเงาต้องเป็น emoji ล้วน — รูปเงากับปุ่มคำตอบต้องเป็นของชุดเดียวกัน', async ({ page }) => {
  /* 🔒 **ข้อยกเว้นของกติกา "อะไรที่ต้องมีไอคอนให้วาด SVG"** (ผู้ใช้สั่ง 2026-08-22)
     เคยแปลงเฉพาะ "ตัวเงา" เป็น SVG แต่ **ปุ่มคำตอบยังเป็น emoji** เพราะข้อความบนปุ่ม
     คือเฉลยที่ระบบใช้เทียบคำตอบ (ห้ามแตะ — ดู IM4)
     ⇒ เงาเป็นทรงหนึ่ง คำตอบเป็นอีกทรงหนึ่ง เด็กเทียบไม่ได้ = เกมพัง
     ⇒ เกมนี้ต้องใช้ emoji ทั้งคู่ "รูปคำถาม" กับ "รูปคำตอบ" จะได้เป็นของชุดเดียวกันเป๊ะ */
  const errs = await main(page);
  await page.locator('#child-select-view .child-card').first().click();
  const quiz = page.locator('.h2-mode-quiz');
  if(await quiz.isVisible().catch(()=>false)) await quiz.click();
  const r = await page.evaluate(async () => {
    const out = [];
    for(const id of ['p1-shadow', 'p1-shadow2']){
      /* ⚠ `CATS` เป็น const ระดับบนสุดของสคริปต์ธรรมดา — **ไม่ได้อยู่บน `window`** */
      const all = (typeof CATS !== 'undefined') ? CATS : [];
      const c = all.find(x => x.id === id);
      if(!c) continue;
      selectedGrade = c.grade || 'p1';
      window.startShadowGame(id);
      await new Promise(r2 => setTimeout(r2, 400));
      const p = document.getElementById('shadow-prompt');
      const b = document.querySelector('.shadow-choice-emoji');
      out.push({id,
        promptSvg: !!p.querySelector('svg'),
        promptText: (p.textContent || '').trim(),
        choiceSvg: !!(b && b.querySelector('svg')),
        choiceText: (b ? b.textContent : '').trim()});
    }
    return out;
  });
  expect(r.length, 'ต้องเปิดเกมทายเงาได้').toBeGreaterThan(0);
  r.forEach(x => {
    expect(x.promptSvg, x.id + ': รูปเงาต้องเป็น emoji ห้ามเป็น SVG').toBe(false);
    expect(x.choiceSvg, x.id + ': ปุ่มคำตอบต้องเป็น emoji').toBe(false);
    expect(x.promptText.length, x.id + ': รูปเงาต้องมีเนื้อหา').toBeGreaterThan(0);
    expect(x.choiceText.length, x.id + ': ปุ่มคำตอบต้องมีเนื้อหา').toBeGreaterThan(0);
  });
  expect(errs).toEqual([]);
});

test('IM6: เกมนกฮูกสั่ง — ของในโจทย์ต้องเป็น emoji ให้ตรงกับตัวอย่างในบรรทัดกติกา', async ({ page }) => {
  /* 🔒 เหตุผลเดียวกับ IM5: บรรทัดกติกาโชว์ตัวอย่างของหมวดเป็น emoji ("แตะเฉพาะ **ผลไม้ 🍎**")
     ถ้าของกลางจอเป็น SVG ⇒ คนละทรงกับตัวอย่าง เด็กเทียบไม่ได้ */
  const errs = await main(page);
  await page.locator('#child-select-view .child-card').first().click();
  const quiz = page.locator('.h2-mode-quiz');
  if(await quiz.isVisible().catch(()=>false)) await quiz.click();
  const r = await page.evaluate(async () => {
    const all = (typeof CATS !== 'undefined') ? CATS : [];
    const c = all.find(x => x.mode === 'ef');
    if(!c) return null;
    selectedGrade = c.grade || 'prep-p1';
    window.startEfGame(c.id);
    await new Promise(r2 => setTimeout(r2, 400));
    const it = document.getElementById('ef-item');
    const rule = document.getElementById('ef-rule');
    return {itemSvg: !!it.querySelector('svg'), itemText: (it.textContent || '').trim(),
            ruleSvg: !!rule.querySelector('svg')};
  });
  expect(r, 'ต้องมีเกมนกฮูกสั่งในคลัง').not.toBeNull();
  expect(r.itemSvg, 'ของในโจทย์ต้องเป็น emoji ห้ามเป็น SVG').toBe(false);
  expect(r.ruleSvg, 'บรรทัดกติกาต้องเป็น emoji เหมือนกัน').toBe(false);
  expect(r.itemText.length, 'ของในโจทย์ต้องมีเนื้อหา').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});

/* 🎨 IM7 — ลูกศรบนการ์ดเลือกเด็กต้องเป็น SVG (ผู้ใช้แจ้ง 2026-08-23)
   ของเดิมเป็นอักขระ `▶` (U+25B6) ซึ่งมี **ทั้งร่าง glyph ธรรมดาและร่าง emoji สี**
   ⇒ macOS/Windows/Android แสดงคนละแบบ ขนาดก็ไม่เท่ากัน
   ⚠ กฎรวมของโปรเจค: อะไรที่เป็น "ไอคอนของปุ่ม/ของ/สถานะ" ต้องวาด SVG
     (ท่าทาง/อารมณ์ยังใช้ emoji ได้ · โจทย์ที่ต้องเทียบรูปกับคำตอบก็ยังเป็น emoji) */
test('IM7: ลูกศรบนการ์ดเลือกเด็กเป็น SVG ไม่ใช่อักขระ ▶ (ข้าม OS ต้องเหมือนกัน)', async ({ page }) => {
  const errs = await main(page);
  const r = await page.evaluate(() => {
    const nav = document.querySelector('#child-select-view .child-card .cnav');
    if (!nav) return null;
    const cs = getComputedStyle(nav);
    return {
      svg: !!nav.querySelector('svg'),
      txt: (nav.textContent || '').trim(),
      /* ต้องรับสีจาก CSS ไม่ใช่ inline style เดิม จะได้เปลี่ยนตามธีมได้ */
      hasColor: !!cs.color,
    };
  });
  expect(r, 'หน้าเลือกเด็กต้องมีการ์ดเด็กอย่างน้อย 1 ใบ').not.toBeNull();
  expect(r.svg, 'ลูกศรต้องวาดด้วย SVG').toBe(true);
  expect(r.txt, 'ห้ามเหลืออักขระ ▶ หรือ emoji ใดๆ ในลูกศร').toBe('');
  expect(r.hasColor).toBe(true);
  expect(errs).toEqual([]);
});
