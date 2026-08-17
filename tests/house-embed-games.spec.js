const { test, expect } = require('@playwright/test');

/* ============================================================
   🎮 เกมของหน้าหลักที่ยืมมาเล่นในการ์ดเควสต์ — 3 ข้อที่ผู้ใช้แจ้ง 2026-08-17
     ① 🁣 โดมิโน: สัดส่วนการ์ดเพี้ยน (ครึ่งบน/ล่างกว้างกว่าสูง ดูไม่เป็นโดมิโน)
     ② 🎨 ผสมสี: ต้องบอกด้วยว่าต้องผสมกี่สี
     ③ 🪟 เล่นจบแล้วคลิกนอก popup → หน้าสรุปหลุดไปอยู่หลังฉากเมือง
   ============================================================ */

const CHILD = { id: 'embg', name: 'ทดสอบเกม', emoji: '🎮', birthDate: '2018-01-15', grade: 'p2' };

async function openHouse(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({
      v: 1, mapV: 4, worldSeeded: true,
      char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
    }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  /* ⚠ ต้องรอ ready() เสมอ — hMode เป็น 'world' ตั้งแต่ไฟล์โหลดเสร็จ ทั้งที่บ้านยังไม่พร้อม */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  return errors;
}
/* เปิดการ์ดทดสอบแล้วกด "เล่นเลย!" ให้เกมจริงถูก mount */
async function play(page, mech) {
  await page.evaluate(m => window.HouseQuestUI.playTest({ mech: m, title: 'ทดสอบ ' + m }), mech);
  await page.locator('#hqz-stage button').first().click();
  await page.waitForTimeout(1800);
}

test('🁣 โดมิโน: การ์ดต้องเป็นสัดส่วน 1:2 (ครึ่งบน/ล่างเป็นจัตุรัส)', async ({ page }) => {
  await openHouse(page);
  await play(page, 'memory');
  const r = await page.evaluate(() => {
    const c = document.querySelector('.domino-card');
    if (!c) return null;
    const b = c.getBoundingClientRect();
    const half = c.querySelector('.domino-half').getBoundingClientRect();
    return { w: b.width, h: b.height, hw: half.width, hh: half.height };
  });
  expect(r, 'ต้องมีการ์ดโดมิโนวาดอยู่จริง').not.toBeNull();
  /* 🁣 โดมิโนจริง = สี่เหลี่ยม 1:2 ⇒ ครึ่งบน/ล่างเป็นจัตุรัส ตารางจุด 3×3 จึงไม่ยืดออกข้าง */
  expect(r.h / r.w, 'การ์ดต้องสูงเป็น 2 เท่าของความกว้าง').toBeGreaterThan(1.85);
  expect(r.h / r.w, 'การ์ดต้องไม่สูงเกิน 2 เท่ามาก').toBeLessThan(2.2);
  expect(Math.abs(r.hw - r.hh) / r.hw, 'แต่ละครึ่งต้องเกือบเป็นจัตุรัส').toBeLessThan(0.25);
});

test('🁣 กระดานจับคู่: การ์ดทุกใบต้องอยู่ในกรอบ popup ไม่ล้นออกไปโดนตัด', async ({ page }) => {
  await openHouse(page);
  await play(page, 'memory');
  const r = await page.evaluate(() => {
    const qz = document.getElementById('house-qz').getBoundingClientRect();
    const out = [];
    document.querySelectorAll('.memory-card').forEach((c, i) => {
      const b = c.getBoundingClientRect();
      if (b.right > qz.right || b.left < qz.left) out.push(i);
    });
    return { n: document.querySelectorAll('.memory-card').length, out,
             qz: Math.round(qz.left) + '-' + Math.round(qz.right) };
  });
  expect(r.n, 'ต้องมีการ์ดในกระดาน').toBeGreaterThan(4);
  /* ⚠ ของเดิมคอลัมน์ตั้ง `flex:0 0 auto` ⇒ กว้างเท่าการ์ดทุกใบเรียงแถวเดียว แล้วล้นออกนอกการ์ดเควสต์ */
  expect(r.out, 'ห้ามมีการ์ดใบไหนล้นออกนอกกรอบ · popup=' + r.qz + '').toEqual([]);
});

test('🎨 ผสมสี: ต้องบอกจำนวนสีที่ต้องผสมไว้ข้างสีเป้าหมาย', async ({ page }) => {
  await openHouse(page);
  await play(page, 'mix');
  const r = await page.evaluate(() => {
    const n = document.querySelector('.mix-need');
    const tgt = document.getElementById('mix-target-text');
    return { txt: n ? n.textContent.trim() : null,
             inTarget: !!(n && tgt && tgt.contains(n)),
             vis: !!(n && n.getClientRects().length) };
  });
  expect(r.txt, 'ต้องมีป้ายบอกจำนวนสี').toBeTruthy();
  /* ต้องมีตัวเลขจริง ไม่ใช่ข้อความลอยๆ */
  expect(/\d/.test(r.txt), 'ป้ายต้องมีตัวเลขจำนวนสี').toBe(true);
  /* ⚠ ต้องอยู่ **ข้างสีเป้าหมาย** ไม่ใช่ในแถบคำใบ้คนละที่ เด็กจะได้เห็นพร้อมกัน */
  expect(r.inTarget, 'ป้ายต้องอยู่ในบรรทัดเป้าหมาย').toBe(true);
  expect(r.vis, 'ป้ายต้องมองเห็นจริง').toBe(true);
});

test('🪟 เกมยิงผลลัพธ์หลังถูกปิดไปแล้ว ต้องไม่เปิดหน้าสรุปของหน้าหลักค้างหลังฉากเมือง', async ({ page }) => {
  const errors = await openHouse(page);
  await play(page, 'memory');
  /* เด็กคลิกนอก popup = ปิดการ์ด + unmount เกม */
  await page.mouse.click(60, 640);
  await page.waitForTimeout(700);
  /* engine ที่มีตัวจับเวลา/อนิเมชันยิงผลตามมาทีหลังได้ */
  const r = await page.evaluate(() => {
    let threw = null;
    try { if (typeof finishP2Game === 'function') finishP2Game(6, 6); }
    catch (e) { threw = String(e && e.message || e); }
    const vis = Array.from(document.querySelectorAll('main > section, body > section'))
      .filter(x => x && !x.hidden).map(x => x.id || '(noid)');
    return { threw, vis, houseOpen: !document.getElementById('house-view').hidden };
  });
  /* ⚠ ของเดิมสั่ง showOnlyView(resultView) ก่อนจะรู้ว่าไม่มีหมวดจริง ⇒ หน้าสรุปค้างอยู่ใน <main>
     ซึ่งอยู่ **หลังฉากเมือง** (#house-view z-index 70) แล้ว throw ตามมาที่ cat.id */
  expect(r.threw, 'ห้าม throw').toBeNull();
  expect(r.vis, 'ห้ามมีหน้าสรุปของหน้าหลักเปิดค้างอยู่หลังเมือง').not.toContain('result-view');
  expect(r.houseOpen, 'ต้องยังอยู่ในเมืองตามปกติ').toBe(true);
  expect(errors, 'ห้ามมี error').toEqual([]);
});
