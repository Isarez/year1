const { test, expect } = require('@playwright/test');

/* ============================================================
   ของใหม่ 2026-08-17 (ผู้ใช้สั่ง 3 อย่าง)
     ① 🎓 บทเรียนบทที่ 1 ต่อท้ายด้วย "แต่งตัวให้พ่อแม่" — สอนตอนเด็กอยู่ในบ้านหลังตกแต่งเสร็จ
        (ปุ่ม #house-parent-btn โผล่เฉพาะตอนอยู่ในตัวบ้าน ⇒ จังหวะนี้เท่านั้นที่สอนได้)
     ② 📷 โหมดกล้อง "ถ่ายที่ไหนก็ได้" — ได้รูปเสมอ แล้วให้ระบบตรวจเองว่าตรงจุดใบสั่งไหม
     ③ 🎨 จานสีตัวละคร/สัตว์เลี้ยงถูกรวมไว้ที่ js/shared/char-colors.js แหล่งเดียว
        (เดิมกระจายอยู่ใน house-map.js กับ PET_TYPES ⇒ เสี่ยงแก้ที่หนึ่งแล้วอีกที่ค้างของเก่า)
   ============================================================ */

const CHILD = { id:'ft17', name:'เทส', emoji:'🧒', birthDate:'2018-01-15', grade:'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id, PKEY = 'p1quiz_progress_' + CHILD.id;
const CHAR = { gender:0, hair:1, hairC:4, eyes:1, eyeC:0, shirt:3, bottom:6, shoes:2 };
const SEED = { v:1, mapV:3, econVer:5, worldSeeded:true, char:CHAR,
               pet:{type:'panda', name:'ไผ่', color:0}, care:{collar:{s:'classic', c:0}},
               unlocked:['pet:panda','petcol:panda:0','collar:classic'] };

async function seed(page, house){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, h, s, p])=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    if(s) localStorage.setItem(h, JSON.stringify(s));
    localStorage.setItem(p, JSON.stringify({coins: 999}));
    window.__TUT_OFF = true;
  }, [CHILD, HKEY, house === undefined ? SEED : house, PKEY]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  return errs;
}
async function intoHouse(page){
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(()=>!document.getElementById('house-view').hidden, null, {timeout:30000});
  await page.waitForFunction(()=>window.__houseDbg && window.__houseDbg.mode()==='world', null, {timeout:30000});
  await page.waitForFunction(()=>!!(window.HousePlay && window.HouseTutorSteps), null, {timeout:20000});
}

test('🎓 บทเรียนบท 1 ต้องจบด้วยการสอนแต่งตัวพ่อแม่ และขั้นนั้นต้องผ่านได้จริง', async ({ page }) => {
  const errs = await seed(page);
  await intoHouse(page);
  const tail = await page.evaluate(()=>window.HouseTutorSteps.chapters
    .find(c => c.id === 'c1').steps.slice(-4).map(s => ({k:s.k, el:s.el || ''})));
  /* ⚠ ต้องชี้ปุ่ม #house-parent-btn จริงๆ — ปุ่มนี้โผล่เฉพาะตอน hScene==='in' */
  expect(tail.map(s => s.k)).toEqual(['say', 'tapUI', 'await', 'say']);
  expect(tail[1].el).toBe('house-parent-btn');

  /* เดินบทเรียนไปให้ถึง "ขั้น await ของการแต่งตัวพ่อแม่" (= ขั้นรองสุดท้ายของบท)
     ⚠ ต้องไล่ force ทีละขั้นแล้ววัดตำแหน่งจริง **ห้ามนับจำนวนครั้งเอาเอง** — บางขั้น
       check() เป็นจริงอยู่แล้วตั้งแต่เข้าขั้น engine จะข้ามให้เองโดยไม่ต้อง force */
  const total = await page.evaluate(()=>window.HouseTutorSteps.chapters
    .find(c => c.id === 'c1').steps.length);
  const target = total - 2;
  await page.evaluate(()=>{ if(window.HouseTutor.active()) window.HouseTutor.stop(); window.HouseTutor.fire('c1'); });
  for(let i = 0; i < 40; i++){
    const st = await page.evaluate(()=>window.HouseTutor.state());
    if(st && st.i >= target) break;
    await page.evaluate(()=>window.HouseTutor.force());
  }
  const at = await page.evaluate(()=>window.HouseTutor.state());
  expect(at.i, 'ต้องมาหยุดที่ขั้นแต่งตัวพ่อแม่').toBe(target);
  expect(at.k).toBe('await');

  /* เปิดหน้าแต่งตัวพ่อแม่แล้วกดเสร็จ = ครบเงื่อนไขของขั้นนี้
     (วัดแบบ "เข้าแล้วออก" ไม่ใช่ "หน้าตาพ่อแม่เปลี่ยนไหม" — เปิดดูเฉยๆ แล้วกดเสร็จต้องผ่านได้
      ไม่งั้นเป็น dead end แบบเดียวกับที่บท c5 เคยเจอ) */
  await page.evaluate(()=>window.__houseDbg.openCreator());
  await expect.poll(()=>page.evaluate(()=>window.__houseDbg.mode())).toBe('creator');
  await page.locator('#house-done-btn').dispatchEvent('click');
  await expect.poll(()=>page.evaluate(()=>{ const s = window.HouseTutor.state(); return s ? s.i : 999; }),
                    'ต้องผ่านขั้นนี้ไปได้ ไม่ค้าง').not.toBe(target);
  expect(errs).toEqual([]);
});

test('📷 ถ่ายรูปที่ไหนก็ได้ — ได้รูปเสมอ แต่ใบสั่งติ๊กเฉพาะตอนถ่ายตรงจุด', async ({ page }) => {
  const errs = await seed(page);
  await intoHouse(page);
  /* ยืนที่บ้านแต่ใบสั่งคือ "ริมน้ำ" = ผิดจุดแน่นอน */
  const off = await page.evaluate(()=>{
    const P = window.HousePlay, st = P.state();
    st.photo.order = 'water'; st.photo.done = false; st.photo.shots = [];
    const ok = P.photoShoot();
    return {ok, shots:(P.state().photo.shots || []).length, done: !!P.state().photo.done};
  });
  /* 🔒 กติกาเหล็กข้อ 2: กดแล้วต้องมีอะไรเกิดขึ้นเสมอ — ห้ามปฏิเสธชัตเตอร์เพราะยืนผิดที่ */
  expect(off.ok, 'ยืนผิดจุดก็ต้องถ่ายติด').toBe(true);
  expect(off.shots, 'รูปต้องเข้าอัลบั้มด้วย').toBe(1);
  expect(off.done, 'แต่ใบสั่งประจำวันต้องยังไม่ติ๊ก').toBe(false);

  const on = await page.evaluate(()=>{
    const P = window.HousePlay, st = P.state();
    st.photo.order = 'any'; st.photo.done = false;
    P.photoShoot();
    return {done: !!P.state().photo.done, shots:(P.state().photo.shots || []).length};
  });
  expect(on.done, 'ถ่ายตรงจุดแล้วใบสั่งต้องติ๊กเอง').toBe(true);
  expect(on.shots, 'รูปสะสมต่อเนื่อง').toBe(2);
  expect(errs).toEqual([]);
});

test('🎨 จานสีตัวละคร/สัตว์เลี้ยงต้องมีแหล่งเดียว — เมือง 3D ใช้ก้อนเดียวกับไฟล์กลาง', async ({ page }) => {
  const errs = await seed(page);
  await intoHouse(page);
  const r = await page.evaluate(()=>{
    const rows = window.__houseDbg.rows(), C = window.OWL_CHAR_COLORS;
    const of = k => (rows.find(x => x.key === k) || {}).colors || [];
    const pets = window.HouseShop.petTypes();
    const P = window.OWL_PET_COLORS;
    return {sameHair: of('hairC') === C.HAIR, sameShirt: of('shirt') === C.SHIRT,
            sameBottom: of('bottom') === C.BOTTOM, sameShoe: of('shoes') === C.SHOE,
            samePet: pets.every(p => p.colors === P[p.id])};
  });
  /* ⚠ ถ้าใครก๊อปสีกลับไปไว้ใน house-map.js อีก เทสนี้จะจับได้ทันที
     (สีเพี้ยนคนละที่ = ตัวละครในหน้า landing กับในเมืองคนละสี) */
  expect(r).toEqual({sameHair:true, sameShirt:true, sameBottom:true, sameShoe:true, samePet:true});
  expect(errs).toEqual([]);
});

/* 🚪 ปุ่มย้อนกลับบนหน้าเลือกหมวด (ผู้ใช้แจ้ง 2026-08-17)
   เดิมทางออกเดียวของหน้าเลือกหมวดคือ "กดที่ชื่อเด็กบนแถบบน" ซึ่งไม่มีอะไรบอกว่ากดได้
   ⚠ **เทสนี้ถูกกลับด้าน ไม่ได้ลบทิ้ง (2026-08-20 · ผู้ใช้สั่ง)**
     เดิมกดแล้วกลับ "หน้าเลือกโหมด" — ตอนนี้หน้านั้นกำลังเลิกใช้ (แทนด้วยหน้าแรกแบบรวมร่าง)
     ⇒ ปลายทางใหม่คือ **หน้าเลือกเด็ก** และป้ายปุ่มเปลี่ยนเป็น "ย้อนกลับ" */
test('🚪 หน้าเลือกหมวดต้องมีปุ่มย้อนกลับที่อ่านออก และกดแล้วกลับหน้าเลือกเด็ก', async ({ page }) => {
  const errs = await seed(page, null);
  await page.locator('#landing-quiz').click();
  await expect(page.locator('#home-view')).toBeVisible();

  const btn = page.locator('#home-exit-btn');
  await expect(btn, 'ต้องเห็นปุ่มย้อนกลับบนหน้าเลือกหมวด').toBeVisible();
  /* ⚠ **ต้องมีข้อความ ไม่ใช่ลูกศรเปล่า** — ต้นเหตุเดิมคือทางออกไม่มีคำอธิบาย เด็กไม่รู้ว่ากดได้ */
  expect((await btn.textContent()).replace(/\s+/g, ' ').trim()).toContain('ย้อนกลับ');
  expect((await btn.textContent()).length, 'ต้องยาวกว่าลูกศรตัวเดียว').toBeGreaterThan(3);

  await btn.click();
  await expect(page.locator('#child-select-view'), 'กดแล้วต้องกลับหน้าเลือกเด็ก').toBeVisible();
  await expect(page.locator('#landing-view'), 'ห้ามแวะหน้าเลือกโหมดอีก').toBeHidden();
  await expect(page.locator('#home-view')).toBeHidden();
  expect(errs).toEqual([]);
});

/* ⚠ **กลับด้านจากเทสเดิม (2026-08-20)** — เดิมบังคับว่า "โหมดบ้านปิด = ต้องซ่อนปุ่ม"
   เพราะปลายทางคือหน้าเลือกโหมดซึ่งไม่โผล่ กดแล้วเป็นทางตัน
   ตอนนี้ปลายทางคือหน้าเลือกเด็กซึ่งมีอยู่จริงเสมอ ⇒ ต้องโชว์ปุ่มได้ทุกกรณี */
test('🚪 โหมดบ้านปิดอยู่ ปุ่มย้อนกลับก็ยังต้องใช้ได้ (ปลายทางคือหน้าเลือกเด็ก มีอยู่เสมอ)', async ({ page }) => {
  await seed(page, null);
  await page.locator('#landing-quiz').click();
  await expect(page.locator('#home-view')).toBeVisible();
  await page.evaluate(()=>{
    document.getElementById('house-entry-btn').hidden = true;
    if(window.OwlLanding) OwlLanding.refreshQuizExitBtn();
  });
  await expect(page.locator('#home-exit-row')).toBeVisible();
  await page.locator('#home-exit-btn').click();
  await expect(page.locator('#child-select-view')).toBeVisible();
});
