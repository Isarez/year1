/* ============================================================
   🧑 แถบชื่อเด็กบน header + ปุ่มโหลดเวอร์ชันใหม่ (2026-08-20)

   🐞 บั๊กจริง: กด "เปลี่ยนเด็ก" กลับมาหน้าเลือกเด็กแล้ว **แถบชื่อเด็กยังค้างอยู่**
      ต้นเหตุ: ปุ่มนั้นเรียก renderChildSelect() อย่างเดียว ไม่ได้แตะ header เลย
   ⚠ ทุกทางที่กลับมาหน้าเลือกเด็กวิ่งผ่าน renderChildSelect() ⇒ คุมที่นั่นจุดเดียว
   ============================================================ */
const { test, expect } = require('@playwright/test');
const { clickEnterQuiz } = require('./helpers');

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
  await clickEnterQuiz(page);
  await expect(page.locator('#child-chip-group'), 'เข้าเล่นแล้วต้องเห็นชื่อเด็ก').toBeVisible();
  await expect(page.locator('#header-child-name')).toHaveText(CHILD.name);

  await page.locator('#switch-child-btn').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('#child-chip-group'), 'กลับมาหน้าเลือกเด็กแล้วแถบชื่อต้องหาย').toBeHidden();
  /* ⚠ บรรทัดคำทัก #brand-sub ถูกถอดออกจาก header แล้ว (ผู้ใช้สั่ง 2026-08-20)
     เทสเดิมเช็คว่าคำทักไม่ค้างชื่อเด็ก — ตอนนี้เปลี่ยนเป็นเช็คว่า "ไม่มี element นั้นแล้ว"
     ไม่ได้ลบเทสทิ้ง เพราะสิ่งที่คุมจริงคือ "ห้ามมีชื่อเด็กค้างบน header" */
  expect(await page.locator('#brand-sub').count(), 'ถอด #brand-sub ออกจาก header แล้ว').toBe(0);
  expect(errs).toEqual([]);
});

/* 🔄 ปุ่มโหลดเวอร์ชันใหม่ (merge มาจาก main v2.0.1) — มีเฉพาะหน้าเลือกเด็ก */
test('MH2: ปุ่มโหลดเวอร์ชันใหม่โผล่เฉพาะหน้าเลือกเด็ก', async ({ page }) => {
  const errs = await open(page);
  await expect(page.locator('#reload-btn'), 'หน้าเลือกเด็กต้องมีปุ่มโหลดใหม่').toBeVisible();
  await page.locator('#child-select-view .child-card').first().click();
  await clickEnterQuiz(page);
  await expect(page.locator('#reload-btn'), 'เข้าเล่นแล้วต้องซ่อน').toBeHidden();
  await page.locator('#switch-child-btn').click();
  await expect(page.locator('#reload-btn'), 'กลับมาแล้วต้องโผล่อีกครั้ง').toBeVisible();
  expect(errs).toEqual([]);
});

/* 🎹 เพลงพื้นหลังของหน้าทำโจทย์ (เขียนใหม่ทั้งชุด 2026-08-20 · js/music-quiz.js)
   ⚠ **เทสนี้ถูกปรับ ไม่ได้ลบ** — เดิมคุมว่า "ใช้เพลงเดิมแต่เปลี่ยนเป็นเสียงเปียโน"
     ตอนนี้ผู้ใช้สั่งแต่งเพลงใหม่ทั้งชุดและ **ให้เบาลงเท่าโหมดบ้าน**
   ⚠ วัดจาก "ค่าที่ส่งเข้าเครื่องสังเคราะห์เสียง" ไม่ใช่ชื่อตัวแปร */
test('MH3: เพลงหน้าทำโจทย์เป็นเปียโนหลายชั้น และดังไม่เกินเพลงในโหมดบ้าน', async ({ page }) => {
  await open(page);
  const r = await page.evaluate(() => {
    const t = MUSIC_TRACKS[0];
    const sum = v => v.parts.reduce((a, p) => a + p[1], 0);
    const lead = musicLayerOpt('lead', t);
    /* พีค = ผลรวมของทุกชั้นที่ดังพร้อมกัน (คอร์ดนับ 3 โน้ต) — สูตรเดียวกับ house-phase14 */
    const peakOf = (layers) => layers.reduce((a, k) => {
      const o = musicLayerOpt(k, t);
      const n = (k === 'chord') ? 3 : 1;
      return a + o.gain * sum(o) * n + (o.sub ? .35 * o.gain : 0);
    }, 0);
    return {
      tracks: MUSIC_TRACKS.length,
      layered: MUSIC_TRACKS.every(x => !!x.layers && !x.notes),
      leadNotes: t.layers.lead.length,
      partials: lead.parts.length,
      /* โอเวอร์โทนของเปียโนจริง **ห้ามลงตัวเป๊ะ** ไม่งั้นฟังเป็นออร์แกน */
      exactHarmonic: lead.parts.every(p => Number.isInteger(p[0])),
      atk: lead.atk,
      leadGain: lead.gain,
      peakQuiz:  peakOf(['lead', 'bass', 'chord']),
      peakHouse: peakOf(['lead', 'bass', 'chord', 'spark']),   /* โหมดบ้านมีชั้นประกายเพิ่ม */
      /* ทางเพลงชั้นเดียว (หน้าครูยังใช้อยู่) ดังกว่านี้ — ตัวเลขที่หน้าทำโจทย์เคยใช้ */
      oldMainGain: MUSIC_MAIN_GAIN,
    };
  });
  expect(r.tracks, 'ต้องมี 6 เพลง').toBe(6);
  expect(r.layered, 'ทุกเพลงต้องเป็นแบบหลายชั้น (ไม่งั้นจะกลับไปดังเท่าเดิม)').toBe(true);
  expect(r.leadNotes, 'ทำนองต้องยาวพอ').toBeGreaterThan(100);
  expect(r.partials, 'ต้องมีโอเวอร์โทนหลายชั้น ไม่ใช่ sine เปล่าตัวเดียว').toBeGreaterThan(3);
  expect(r.exactHarmonic, 'โอเวอร์โทนต้องไม่ลงตัวเป๊ะ (ไม่งั้นเป็นออร์แกน)').toBe(false);
  expect(r.atk, 'เปียโนขึ้นเสียงเร็วมาก (ค้อนกระทบสาย)').toBeLessThan(.02);
  /* 🔊 หัวใจของรอบนี้: ชั้นทำนอง (เสียงที่เด็กได้ยินเด่นสุด) ต้องเบาลงมาเท่าโหมดบ้าน */
  expect(r.leadGain, 'ชั้นทำนองต้องใช้ค่าเดียวกับโหมดบ้าน ไม่ใช่ MUSIC_MAIN_GAIN')
    .toBeLessThan(r.oldMainGain);
  expect(r.peakQuiz, 'ต้องดังไม่เกินเพลงในโหมดบ้าน').toBeLessThanOrEqual(r.peakHouse);
});
