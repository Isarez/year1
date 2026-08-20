/* ============================================================
   🏡 หน้าแรกแบบรวมร่าง (ทดลอง · ธง ?home=v2 · js/app-home2.js)

   สิ่งที่ชุดนี้คุม:
     ① **ไม่ใส่ธง = ต้องเป็นของเดิมเป๊ะ** (เลือกเด็ก → หน้าเลือกโหมด)
        ธงทดลองต้องไม่รั่วไปกระทบผู้ใช้จริงเด็ดขาด
     ② ใส่ธงแล้ว แถวกางออก โชว์ตัวละคร 3D ของเด็กคนนั้น + ปุ่มเลือกโหมด
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

async function open(page, flag){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([kids, house])=>{
    localStorage.setItem('p1quiz_children', JSON.stringify(kids));
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_hv1', JSON.stringify(house));
  }, [KIDS, HOUSE]);
  await page.goto(flag ? '/?home=v2' : '/?home=v1');
  await page.waitForSelector('#child-list .child-card');
  return errs;
}
const card = (page, i) => page.locator('#child-list .child-card').nth(i);

test('HV1: ?home=v1 = ทางเดิมยังใช้ได้ (เลือกเด็กแล้วไปหน้าเลือกโหมด ไม่มีแถวกาง)', async ({ page }) => {
  const errs = await open(page, false);
  expect(await page.evaluate(()=> window.OwlHome2 && OwlHome2.on())).toBe(false);
  await card(page, 0).click();
  await expect(page.locator('#landing-view')).toBeVisible();
  expect(await page.locator('.h2-panel').count(), 'ปิดธงแล้วต้องไม่มีแผงกางเลย').toBe(0);
  expect(errs).toEqual([]);
});

test('HV2: ใส่ธง → แถวกางออก โชว์ตัวละคร 3D + ปุ่มโหมดครบ 2 ปุ่ม', async ({ page }) => {
  const errs = await open(page, true);
  await card(page, 0).click();
  await expect(page.locator('.h2-panel')).toBeVisible();
  /* ชุด 3D โหลดแบบ lazy — รอจนตัวละครถูกวาดจริง */
  await page.waitForSelector('.h2-panel #h2-canvas', { timeout: 30000 });
  await expect(page.locator('#landing-view')).toBeHidden();
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
  const errs = await open(page, true);
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
  await open(page, true);
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
  const errs = await open(page, true);
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
  await open(page, true);
  await page.evaluate(()=>{ document.getElementById('house-entry-btn').hidden = true; });
  expect(await page.evaluate(()=> OwlHome2.on())).toBe(false);
  await card(page, 1).click();
  await expect(page.locator('#home-view')).toBeVisible();
  expect(await page.locator('.h2-panel').count()).toBe(0);
});

test('HV7: ฟอร์มเพิ่มเด็กมี 2 ปุ่ม (เข้าเมือง/เริ่มเรียน) + ปุ่มยกเลิกที่กลับไปรายชื่อได้', async ({ page }) => {
  const errs = await open(page, true);
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

test('HV8: ?home=v1 → ฟอร์มเพิ่มเด็กเป็นแบบเดิม (ปุ่มเดียว ไม่มีปุ่มเข้าเมือง)', async ({ page }) => {
  await open(page, false);
  await page.locator('#child-add-new-btn').click();
  await expect(page.locator('#child-submit-house')).toBeHidden();
  await expect(page.locator('#child-submit-btn')).toHaveText('เริ่มเรียนเลย! 🚀');
});

test('HV9: ช่องตัวละครเป็นฉากจำลองเมืองจริง (ไม่ใช่พื้นหลังเปล่า)', async ({ page }) => {
  await open(page, true);
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
  const errs = await open(page, true);
  await card(page, 1).click();
  await page.locator('.h2-mode-quiz').click();
  await expect(page.locator('#home-view')).toBeVisible();
  const btn = page.locator('#home-exit-btn');
  await expect(btn).toBeVisible();
  await expect(btn, 'ป้ายปุ่มต้องเป็น "ย้อนกลับ"').toContainText('ย้อนกลับ');
  await btn.click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('#landing-view'), 'หน้าเลือกโหมดต้องไม่โผล่อีก').toBeHidden();
  expect(errs).toEqual([]);
});

test('HV11: โปรไฟล์เก่าที่ยังไม่มีวันเกิด — ใส่วันเกิดแล้วกลับมากางแถวเดิม ไม่ผ่านหน้าเลือกโหมด', async ({ page }) => {
  await page.addInitScript(()=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id:'old1', name:'เด็กเก่า', emoji:'🐧' }]));      /* ไม่มี birthDate */
    localStorage.setItem('p1quiz_music', 'off');
  });
  await page.goto('/?home=v2');
  await page.waitForSelector('#child-list .child-card');
  await card(page, 0).click();
  await expect(page.locator('#age-modal')).toBeVisible();
  await page.selectOption('#age-modal .dob-day', '5');
  await page.selectOption('#age-modal .dob-mon', '3');
  await page.selectOption('#age-modal .dob-year', String(new Date().getFullYear() - 7));
  await page.locator('#age-modal-confirm-btn').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
  await expect(page.locator('#landing-view')).toBeHidden();
  await expect(page.locator('.h2-panel'), 'ต้องกางแถวของเด็กคนนั้นให้เลย').toHaveCount(1);
});
