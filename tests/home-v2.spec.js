/* ============================================================
   🏡 หน้าแรกแบบรวมร่าง (ใช้จริงแล้ว · js/app-home2.js)

   สิ่งที่ชุดนี้คุม:
     ① **โหมดบ้านปิด (main) = ต้องถอยไปทางเดิมเป๊ะ** (เลือกเด็ก → เข้าหน้าหมวดตรงๆ)
     ② แถวกางออก โชว์ตัวละคร 3D ของเด็กคนนั้น + ปุ่มเลือกโหมด
     ③ เด็กที่ยังไม่มีตัวละคร → ปุ่ม "สร้างตัวละคร" (ไม่ใช่ช่องว่าง)
     ④ **กางได้ทีละคน** — WebGL context ต้องมีตัวเดียวเสมอ
     ⑤ โหมดบ้านปิดอยู่ → ถอยกลับไปพฤติกรรมเดิมทั้งหมด
   ============================================================ */
const { test, expect } = require('@playwright/test');

const KIDS = [
  { id:'hv1', name:'น้องดาว',   emoji:'🦄', birthDate:'2019-05-02', grade:'p1' },
  { id:'hv2', name:'น้องต้นไม้', emoji:'🌳', birthDate:'2017-03-11', grade:'p3' },
];
/* hv1 เคยเข้าเมืองแล้ว (มีตัวละคร+สัตว์เลี้ยง) · hv2 ยังไม่เคย */
const HOUSE = {
  char:{skin:1, hair:2, hairC:3, eye:1, eyeC:0, shirt:2, shirtC:1, bottom:1, bottomC:2,
        shoe:0, shoeC:0, pattern:0, hat:0, glass:0, bag:0, hold:0, girl:false},
  pet:{type:'dog', color:1, name:'ปุยฝ้าย'},
  coins:120, decor:{in:[], out:[]},
};

/* houseOff = จำลอง branch main ที่ปิดโหมดบ้าน (HOUSE_FEATURE_OFF) — ทางถอยเดียวที่เหลือ
   หลังถอดธง ?home=v2 ออกแล้ว (2026-08-21) */
async function open(page, houseOff){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));

  await page.addInitScript(([kids, house])=>{
    localStorage.setItem('p1quiz_children', JSON.stringify(kids));
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_hv1', JSON.stringify(house));
  }, [KIDS, HOUSE]);
  await page.goto('/');
  await page.waitForSelector('#child-list .child-card');
  if(houseOff) await page.evaluate(()=>{
    document.getElementById('house-entry-btn').hidden = true;
    renderChildSelect();                 /* วาดรายชื่อใหม่ให้ตรงกับสภาพ "โหมดบ้านปิด" */
  });
  return errs;
}
const card = (page, i) => page.locator('#child-list .child-card').nth(i);

test('HV1: โหมดบ้านปิด (main) = ถอยไปทางเดิมทั้งหมด — ไม่กางแถว เข้าหน้าหมวดตรงๆ', async ({ page }) => {
  const errs = await open(page, true);   /* โหมดบ้านปิด */
  expect(await page.evaluate(()=> window.OwlHome2 && OwlHome2.on())).toBe(false);
  await card(page, 0).click();
  /* มีโหมดเดียว ⇒ เข้าหน้าหมวดตรงๆ ไม่ต้องถามอะไรเลย */
  await expect(page.locator('#home-view')).toBeVisible();
  expect(await page.locator('.h2-panel').count(), 'โหมดบ้านปิดแล้วต้องไม่มีแผงกางเลย').toBe(0);
  expect(errs).toEqual([]);
});

test('HV2: ใส่ธง → แถวกางออก โชว์ตัวละคร 3D + ปุ่มโหมดครบ 2 ปุ่ม', async ({ page }) => {
  const errs = await open(page);
  await card(page, 0).click();
  await expect(page.locator('.h2-panel')).toBeVisible();
  /* ชุด 3D โหลดแบบ lazy — รอจนตัวละครถูกวาดจริง */
  await page.waitForSelector('.h2-panel #h2-canvas', { timeout: 30000 });
  const r = await page.evaluate(()=>{
    const c = document.getElementById('h2-canvas');
    return {
      w: c.width, h: c.height,
      modes: Array.from(document.querySelectorAll('.h2-mode .h2-mode-name')).map(e=>e.textContent),
      cap: (document.querySelector('.h2-cap')||{}).textContent || '',
      active: (typeof activeChild !== 'undefined' && activeChild) ? activeChild.id : '',
    };
  });
  expect(r.w, 'canvas ต้องถูกตั้งขนาดจริงแล้ว').toBeGreaterThan(100);
  expect(r.h).toBeGreaterThan(100);
  expect(r.modes).toEqual(['เข้าเมือง', 'ทำโจทย์']);
  expect(r.cap, 'ชื่อสัตว์เลี้ยงต้องขึ้นใต้ตัวละคร').toContain('ปุยฝ้าย');
  expect(r.active, 'แตะชื่อแล้วต้องตั้งเป็นคนเล่นปัจจุบันทันที').toBe('hv1');
  expect(errs).toEqual([]);
});

test('HV3: เด็กที่ยังไม่เคยเข้าเมือง → ปุ่มสร้างตัวละคร + มีปุ่มโหมดเดียว', async ({ page }) => {
  const errs = await open(page);
  await card(page, 1).click();
  await expect(page.locator('.h2-create')).toBeVisible();
  const r = await page.evaluate(()=>({
    canvas: !!document.querySelector('.h2-panel #h2-canvas'),
    svg: !!document.querySelector('.h2-create svg'),
    modes: Array.from(document.querySelectorAll('.h2-mode .h2-mode-name')).map(e=>e.textContent),
  }));
  expect(r.canvas, 'ไม่มีตัวละคร = ต้องไม่วาด canvas').toBe(false);
  expect(r.svg, 'ไอคอนต้องเป็น SVG (กติกาไอคอนของโปรเจกต์)').toBe(true);
  expect(r.modes, 'ปุ่มสร้างตัวละครทำหน้าที่ทางเข้าเมืองแล้ว ไม่ต้องมีปุ่มซ้ำ').toEqual(['ทำโจทย์']);
  expect(errs).toEqual([]);
});

test('HV4: กางได้ทีละคนเท่านั้น (WebGL context ตัวเดียว)', async ({ page }) => {
  await open(page);
  await card(page, 0).click();
  await expect(page.locator('.h2-panel')).toHaveCount(1);
  await card(page, 1).click();
  await expect(page.locator('.h2-panel')).toHaveCount(1);
  expect(await page.locator('.h2-create').count(), 'แผงที่เหลือต้องเป็นของคนที่ 2').toBe(1);
  /* แตะซ้ำคนเดิม = ยุบ */
  await card(page, 1).click();
  await expect(page.locator('.h2-panel')).toHaveCount(0);
});

test('HV5: ปุ่ม "ทำโจทย์" พาเข้าหน้าหมวด · กลับมาแล้วแผงต้องยุบ', async ({ page }) => {
  const errs = await open(page);
  await card(page, 1).click();
  await page.locator('.h2-mode-quiz').click();
  await expect(page.locator('#home-view')).toBeVisible();
  await expect(page.locator('#child-select-view')).toBeHidden();
  expect(await page.locator('.h2-panel').count()).toBe(0);
  /* กลับไปหน้าเลือกเด็ก */
  await page.evaluate(()=> renderChildSelect());
  await expect(page.locator('#child-select-view')).toBeVisible();
  expect(await page.locator('.h2-panel').count(), 'ต้องไม่มีแผงค้างจากรอบก่อน').toBe(0);
  expect(errs).toEqual([]);
});

test('HV6: โหมดบ้านปิดอยู่ → ถอยกลับไปพฤติกรรมเดิม (ไม่กางแถว)', async ({ page }) => {
  await open(page);
  await page.evaluate(()=>{ document.getElementById('house-entry-btn').hidden = true; });
  expect(await page.evaluate(()=> OwlHome2.on())).toBe(false);
  await card(page, 1).click();
  await expect(page.locator('#home-view')).toBeVisible();
  expect(await page.locator('.h2-panel').count()).toBe(0);
});

test('HV7: ฟอร์มเพิ่มเด็กมี 2 ปุ่ม (เข้าเมือง/เริ่มเรียน) + ปุ่มยกเลิกที่กลับไปรายชื่อได้', async ({ page }) => {
  const errs = await open(page);
  await page.locator('#child-add-new-btn').click();
  await expect(page.locator('#child-submit-house')).toBeVisible();
  await expect(page.locator('#child-submit-btn')).toBeVisible();
  await expect(page.locator('#child-cancel-btn')).toBeVisible();
  expect(await page.locator('#child-submit-house img').count(), 'ไอคอนต้องเป็นไฟล์ SVG').toBe(1);
  await page.locator('#child-cancel-btn').click();
  await expect(page.locator('#child-add-form')).toBeHidden();
  await expect(page.locator('#child-add-new-btn')).toBeVisible();
  expect(await page.locator('#child-list .child-card').count(), 'ยกเลิกแล้วต้องไม่มีเด็กเพิ่ม').toBe(2);
  expect(errs).toEqual([]);
});

test('HV8: โหมดบ้านปิด → ฟอร์มเพิ่มเด็กเป็นแบบเดิม (ปุ่มเดียว ไม่มีปุ่มเข้าเมือง)', async ({ page }) => {
  await open(page, true);   /* โหมดบ้านปิด */
  await page.locator('#child-add-new-btn').click();
  await expect(page.locator('#child-submit-house')).toBeHidden();
  await expect(page.locator('#child-submit-btn')).toHaveText('เริ่มเรียนเลย! 🚀');
});

test('HV9: ช่องตัวละครเป็นฉากจำลองเมืองจริง (ไม่ใช่พื้นหลังเปล่า)', async ({ page }) => {
  await open(page);
  await card(page, 0).click();
  await page.waitForSelector('.h2-panel #h2-canvas', { timeout: 30000 });
  const r = await page.evaluate(()=>({
    n: window.__houseDbg.cvSceneSize(),
    cap: !!document.querySelector('.h2-cap'),
  }));
  /* พื้นหญ้า + รั้ว + ต้นไม้ + พุ่ม + ดอกไม้ + ไฟ + เงา + ตัวละคร + สัตว์เลี้ยง */
  expect(r.n, 'ฉากต้องมีของมากกว่าแค่ไฟกับตัวละคร').toBeGreaterThan(5);
  expect(r.cap, 'ป้ายชื่อสัตว์เลี้ยงต้องอยู่ในกรอบฉาก').toBe(true);
});

test('HV10: ปุ่ม "ย้อนกลับ" ในหน้าทำโจทย์ → กลับหน้าเลือกเด็ก (ไม่ใช่หน้าเลือกโหมด)', async ({ page }) => {
  const errs = await open(page);
  await card(page, 1).click();
  await page.locator('.h2-mode-quiz').click();
  await expect(page.locator('#home-view')).toBeVisible();
  const btn = page.locator('#home-exit-btn');
  await expect(btn).toBeVisible();
  await expect(btn, 'ป้ายปุ่มต้องเป็น "ย้อนกลับ"').toContainText('ย้อนกลับ');
  await btn.click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  expect(await page.locator('#landing-view').count(), 'หน้าเลือกโหมดถูกถอดออกทั้งหน้าแล้ว').toBe(0);
  expect(errs).toEqual([]);
});

test('HV11: โปรไฟล์เก่าที่ยังไม่มีวันเกิด — ใส่วันเกิดแล้วกลับมากางแถวเดิม ไม่ผ่านหน้าเลือกโหมด', async ({ page }) => {
  await page.addInitScript(()=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id:'old1', name:'เด็กเก่า', emoji:'🐧' }]));      /* ไม่มี birthDate */
    localStorage.setItem('p1quiz_music', 'off');
  });
  await page.goto('/');
  await page.waitForSelector('#child-list .child-card');
  await card(page, 0).click();
  await expect(page.locator('#age-modal')).toBeVisible();
  await page.selectOption('#age-modal .dob-day', '5');
  await page.selectOption('#age-modal .dob-mon', '3');
  await page.selectOption('#age-modal .dob-year', String(new Date().getFullYear() - 7));
  await page.locator('#age-modal-confirm-btn').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('.h2-panel'), 'ต้องกางแถวของเด็กคนนั้นให้เลย').toHaveCount(1);
});

test('HV12: เพดานข้อมูล — เด็กสูงสุด 10 คน · รูป 15 ใบที่ 900px', async ({ page }) => {
  /* 🔒 3 ค่านี้ผูกกันเป็นชุด: 10 คน × (15 รูป × ~16,000 + ข้อมูลอื่น ~31,600) ≈ 3.0 MB
     จากโควตา localStorage 5,242,880 ตัวอักษร (วัดจริง 2026-08-20)
     **แก้ค่าไหนต้องคำนวณใหม่ทั้งชุด** */
  await open(page);
  const r = await page.evaluate(()=>({ max: typeof MAX_CHILDREN !== 'undefined' ? MAX_CHILDREN : null }));
  expect(r.max, 'เพดานจำนวนเด็ก').toBe(10);
  const src = await (await page.request.get('/js/house-play.js')).text();
  expect(src, 'จำนวนรูปสูงสุด').toContain('const PHOTO_MAX = 15;');
  expect(src, 'ความกว้างรูป').toContain('const PHOTO_W = 900;');
});

test('HV13: เพิ่มเด็กครบ 10 คนแล้วต้องกดเพิ่มไม่ได้ (ซ่อนปุ่ม + บอกเหตุผล)', async ({ page }) => {
  await page.addInitScript(()=>{
    const kids = Array.from({length:10}, (_,i)=>(
      { id:'k'+i, name:'เด็ก'+i, emoji:'🦉', birthDate:'2018-06-01', grade:'p1' }));
    localStorage.setItem('p1quiz_children', JSON.stringify(kids));
    localStorage.setItem('p1quiz_music', 'off');
  });
  await page.goto('/');
  await page.waitForSelector('#child-list .child-card');
  expect(await page.locator('#child-list .child-card').count()).toBe(10);
  await expect(page.locator('#child-add-new-btn'), 'ครบแล้วต้องซ่อนปุ่มเพิ่ม').toBeHidden();
  await expect(page.locator('#cs-sub'), 'ต้องบอกเหตุผลด้วย ไม่ใช่ปุ่มหายเฉยๆ').toContainText('10');
  /* เรียก addChild ตรงๆ ก็ต้องไม่เพิ่มให้ */
  const after = await page.evaluate(()=>{ addChild('เกินโควตา'); return children.length; });
  expect(after, 'ห้ามเพิ่มเกินเพดานแม้เรียกฟังก์ชันตรงๆ').toBe(10);
});

test('HV14: เด็กที่ยังไม่มีตัวละคร — กด ← ในหน้าสร้างตัวละคร ต้องกลับหน้าเลือกเด็ก', async ({ page }) => {
  const errs = await open(page);
  await card(page, 1).click();                       /* hv2 = ยังไม่เคยเข้าเมือง */
  await page.locator('.h2-create').click();          /* ปุ่มสร้างตัวละคร → เข้าเมือง+เปิดหน้าสร้าง */
  await page.waitForFunction(()=> window.__houseDbg && __houseDbg.ready && __houseDbg.ready(),
    null, { timeout: 60000 });
  await page.waitForSelector('#house-creator:not([hidden])', { timeout: 20000 });
  await page.locator('#house-back').click();
  /* 🔒 ต้องกลับ "หน้าเลือกเด็ก" ไม่ใช่หน้าทำโจทย์ (ผู้ใช้แจ้ง 2026-08-20) */
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('#home-view'), 'ห้ามโผล่หน้าทำโจทย์').toBeHidden();
  await expect(page.locator('#house-view')).toBeHidden();
  expect(errs).toEqual([]);
});
