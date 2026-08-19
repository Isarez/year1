const { test, expect } = require('@playwright/test');

/* ============================================================
   🪑 เฟอร์นิเจอร์ทุกชิ้นต้อง "สร้างโมเดลออกมาถูก"  · 2026-08-17
   ผู้ใช้แจ้งว่า **ของที่เพิ่มเข้ามาใหม่หลายชิ้น build มาไม่ถูก** ⇒ ทำเป็นเทสไล่ตรวจทั้งคลัง
   แทนที่จะไล่ดูด้วยตาทีละชิ้น (193 ชิ้น ดูด้วยตาไม่ไหวและตกหล่นแน่นอน)

   เกณฑ์ที่ตรวจ (ทุกข้อเคยจับของพังได้จริงมาแล้ว):
     ① build() ต้องไม่ throw และต้องมีรูปจริง (ไม่ใช่ group ว่าง)
     ② ห้ามจมพื้น — ขอบล่างต้องไม่ต่ำกว่า -0.06
     ③ ห้ามล้นช่องที่จองไว้ (fw × fd) เกิน 0.35 หน่วย ⇒ ไม่งั้นทับของที่วางข้างๆ
     ④ ห้ามสูงเกิน 3 หน่วย (บังกล้อง iso จนมองไม่เห็นของหลังมัน)

   🐞 **กับดักที่จับได้จากเกณฑ์ ③ (2026-08-17)**: กรวย 4 เหลี่ยมที่ `rotation.y = π/4`
      กว้างจริง = **r × √2 × 2 ไม่ใช่ r × 2** ⇒ เรือนกระจกจิ๋ว r=1.1 กว้าง 3.11 บนช่อง 2×2
      และบ้านต้นไม้ r=.85 กว้าง 2.40 — ทั้งคู่ล้นไปทับของข้างๆ โดยไม่มีใครสังเกต
   ============================================================ */

const CHILD = { id: 'furnfit', name: 'ตรวจของ', emoji: '🛋️', birthDate: '2018-01-15', grade: 'p2' };

/* ของที่ "ล้นช่องโดยตั้งใจ" — ทรงพุ่ม/ใบไม้ที่ต้องแผ่คลุมออกไปถึงจะดูเป็นต้นไม้จริง
   ⚠ **ห้ามเติมชื่อลงลิสต์นี้เพื่อให้เทสเขียว** — เติมได้เฉพาะของที่ตั้งใจให้แผ่จริงๆ
     ถ้าของใหม่ล้นช่อง ให้ไปแก้โมเดลให้พอดีช่องก่อนเสมอ */
const OVERHANG_OK = ['tree-round', 'pine', 'palm-tall', 'sandbox', 'pet-house',
                     'monkey-bars', 'kite', 'playhouse', 'wheelbarrow'];
/* ของที่ "ลอยโดยตั้งใจ" — แขวนเพดาน/ติดผนัง */
const FLOAT_OK = ['swing-chair', 'star-mobile'];
/* ของที่ขอบล่างต่ำกว่าพื้นโดยตั้งใจ (ฝังลงดิน/แผ่ราบกับพื้น) */
const SUNK_OK = ['clover-patch', 'kite'];

async function openHouse(page) {
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
}

test('เฟอร์นิเจอร์ทุกชิ้น: สร้างโมเดลได้จริง · ไม่จมพื้น · ไม่ล้นช่องที่จองไว้', async ({ page }) => {
  test.setTimeout(120000);
  await openHouse(page);
  const rows = await page.evaluate(() => {
    const D = window.__houseDbg, FURN = D.furn(), kit = D.decorKit();
    return (FURN.items || []).map(it => {
      const g = new THREE.Group();
      let err = null;
      try { it.build(g, (it.colors || [0xcccccc])[0], kit, { x: 0, z: 0, rot: 0, col: 0 }); }
      catch (e) { err = String(e && e.message || e); }
      const bb = new THREE.Box3().setFromObject(g);
      const empty = !isFinite(bb.min.x);
      return {
        id: it.id, name: it.name, fw: it.fw || 1, fd: it.fd || 1, wall: !!it.wall, err, empty,
        x: empty ? 0 : +(bb.max.x - bb.min.x).toFixed(2),
        z: empty ? 0 : +(bb.max.z - bb.min.z).toFixed(2),
        y0: empty ? 0 : +bb.min.y.toFixed(2),
        y1: empty ? 0 : +bb.max.y.toFixed(2),
      };
    });
  });
  expect(rows.length, 'คลังเฟอร์นิเจอร์ต้องโหลดครบ').toBeGreaterThan(150);

  const broken = [], sunk = [], over = [], tall = [], float = [];
  rows.forEach(r => {
    if (r.err) { broken.push(r.id + ': ' + r.err); return; }
    if (r.empty) { broken.push(r.id + ': ไม่มีรูปเลย'); return; }
    if (r.y0 < -0.06 && SUNK_OK.indexOf(r.id) < 0) sunk.push(r.id + ' y0=' + r.y0);
    /* ⚠ เกณฑ์เดิม 0.30 หลวมเกินไป — โซฟา/เก้าอี้นวม/ชักโครก/อ่างอาบน้ำลอยอยู่ 10-12.5 ซม.
       มาตลอดโดยเทสไม่จับ (ผู้ใช้แจ้ง 2026-08-19 ว่าของตกแต่งเพี้ยน) ⇒ บีบเหลือ 0.08
       **ห้ามผ่อนกลับ** — ของที่ตั้งใจให้ลอยจริงๆ ให้ใส่ชื่อใน FLOAT_OK แทน */
    if (r.y0 > 0.08 && !r.wall && FLOAT_OK.indexOf(r.id) < 0) float.push(r.id + ' y0=' + r.y0);
    if (OVERHANG_OK.indexOf(r.id) < 0) {
      if (r.x > r.fw + 0.35) over.push(r.id + ' กว้าง ' + r.x + ' > ' + r.fw + ' ช่อง');
      if (r.z > r.fd + 0.35) over.push(r.id + ' ลึก ' + r.z + ' > ' + r.fd + ' ช่อง');
    }
    if (r.y1 > 3.0) tall.push(r.id + ' สูง ' + r.y1);
  });

  expect(broken, 'ทุกชิ้นต้องสร้างโมเดลออกมาได้จริง').toEqual([]);
  expect(sunk, 'ห้ามมีชิ้นไหนจมพื้น').toEqual([]);
  expect(float, 'ห้ามมีชิ้นไหนลอยกลางอากาศ (ยกเว้นของแขวนเพดาน/ติดผนัง)').toEqual([]);
  /* ⚠ ข้อนี้คือตัวจับกับดัก "กรวย 4 เหลี่ยมหมุน 45° กว้าง r×√2×2" ที่หลุดมา 2 ชิ้น */
  expect(over, 'ห้ามมีชิ้นไหนล้นช่องที่จองไว้จนไปทับของข้างๆ').toEqual([]);
  expect(tall, 'ห้ามมีชิ้นไหนสูงจนบังกล้อง').toEqual([]);
});
