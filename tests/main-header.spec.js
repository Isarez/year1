/* ============================================================
   🧑 แถบชื่อเด็กบน header + ปุ่มโหลดเวอร์ชันใหม่ (2026-08-20)

   🐞 บั๊กจริง: กด "เปลี่ยนเด็ก" กลับมาหน้าเลือกเด็กแล้ว **แถบชื่อเด็กยังค้างอยู่**
      ต้นเหตุ: ปุ่มนั้นเรียก renderChildSelect() อย่างเดียว ไม่ได้แตะ header เลย
   ⚠ ทุกทางที่กลับมาหน้าเลือกเด็กวิ่งผ่าน renderChildSelect() ⇒ คุมที่นั่นจุดเดียว
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'hdr', name: 'น้องเฮดเดอร์', emoji: '🙂', birthDate: '2018-06-01', grade: 'p1' };

async function open(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if(m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
  }, CHILD);
  await page.goto('/');
  await page.waitForSelector('#child-select-view .child-card', { timeout: 20000 });
  return errs;
}

test('MH1: กด "เปลี่ยนเด็ก" กลับมาหน้าเลือกเด็ก → แถบชื่อเด็กต้องหายไป', async ({ page }) => {
  const errs = await open(page);
  /* หน้าเลือกเด็กตอนเปิดแอป: แถบชื่อยังไม่โผล่ */
  await expect(page.locator('#child-chip-group')).toBeHidden();

  await page.locator('#child-select-view .child-card').first().click();
  const quiz = page.locator('#landing-quiz');
  if(await quiz.count()) await quiz.click();
  await expect(page.locator('#child-chip-group'), 'เข้าเล่นแล้วต้องเห็นชื่อเด็ก').toBeVisible();
  expect(await page.locator('#brand-sub').textContent()).toContain(CHILD.name);

  await page.locator('#switch-child-btn').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('#child-chip-group'), 'กลับมาหน้าเลือกเด็กแล้วแถบชื่อต้องหาย').toBeHidden();
  expect(await page.locator('#brand-sub').textContent(),
         'คำทักบน header ต้องไม่ค้างชื่อเด็กคนเดิม').not.toContain(CHILD.name);
  expect(errs).toEqual([]);
});

/* 🔄 ปุ่มโหลดเวอร์ชันใหม่ (merge มาจาก main v2.0.1) — มีเฉพาะหน้าเลือกเด็ก */
test('MH2: ปุ่มโหลดเวอร์ชันใหม่โผล่เฉพาะหน้าเลือกเด็ก', async ({ page }) => {
  const errs = await open(page);
  await expect(page.locator('#reload-btn'), 'หน้าเลือกเด็กต้องมีปุ่มโหลดใหม่').toBeVisible();
  await page.locator('#child-select-view .child-card').first().click();
  const quiz = page.locator('#landing-quiz');
  if(await quiz.count()) await quiz.click();
  await expect(page.locator('#reload-btn'), 'เข้าเล่นแล้วต้องซ่อน').toBeHidden();
  await page.locator('#switch-child-btn').click();
  await expect(page.locator('#reload-btn'), 'กลับมาแล้วต้องโผล่อีกครั้ง').toBeVisible();
  expect(errs).toEqual([]);
});

/* 🎹 เพลงพื้นหลังต้องเป็นเสียงเปียโน (ผู้ใช้สั่ง — ใช้เพลงเดิม ไม่แตะโน้ต)
   ⚠ วัดจาก "ค่าที่ส่งเข้าเครื่องสังเคราะห์เสียง" ไม่ใช่ชื่อตัวแปร
   ⚠ **ความดังต้องไม่เพิ่ม** — เพลงพื้นหลังต้องเบากว่าเสียงกดปุ่มเสมอ (กติกาเดิม) */
test('MH3: เพลงพื้นหลังใช้เสียงเปียโน · โน้ตเพลงเดิมไม่ถูกแตะ · ความดังไม่เพิ่ม', async ({ page }) => {
  await open(page);
  const r = await page.evaluate(() => {
    const t = MUSIC_TRACKS[0];
    const opt = musicMainVoiceOpt(t);
    const sum = opt.parts.reduce((a, p) => a + p[1], 0);
    return {
      tracks: MUSIC_TRACKS.length,
      notes: t.notes.length,
      partials: opt.parts.length,
      /* โอเวอร์โทนของเปียโนจริง **ห้ามลงตัวเป๊ะ** ไม่งั้นฟังเป็นออร์แกน */
      exactHarmonic: opt.parts.every(p => Number.isInteger(p[0])),
      atk: opt.atk,
      peak: sum * opt.gain + (opt.sub ? .35 * opt.gain : 0),
      sine: true,
    };
  });
  expect(r.tracks, 'ต้องยังมีเพลงครบเหมือนเดิม').toBeGreaterThanOrEqual(5);
  expect(r.notes, 'โน้ตของเพลงต้องไม่ถูกแตะ').toBeGreaterThan(20);
  expect(r.partials, 'ต้องมีโอเวอร์โทนหลายชั้น ไม่ใช่ sine เปล่าตัวเดียว').toBeGreaterThan(3);
  expect(r.exactHarmonic, 'โอเวอร์โทนต้องไม่ลงตัวเป๊ะ (ไม่งั้นเป็นออร์แกน)').toBe(false);
  expect(r.atk, 'เปียโนขึ้นเสียงเร็วมาก (ค้อนกระทบสาย)').toBeLessThan(.02);
  /* ของเดิม: .90 + .35 = 1.25 ⇒ ใหม่ต้องไม่เกินนี้มาก */
  expect(r.peak, 'ความดังรวมต้องไม่เพิ่มจากเดิมอย่างมีนัย').toBeLessThan(1.4);
});
