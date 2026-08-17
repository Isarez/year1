const { test, expect } = require('@playwright/test');

/* ============================================================
   ชุดแก้ 2026-08-17 (โหมดบ้าน — ผู้ใช้แจ้ง 2 ข้อ)
     ① 🐞 บทเรียน "ดูแลเพื่อนตัวน้อย" (c5) **ค้างที่ขั้นที่ 4 ตลอดกาล**
        ต้นเหตุ: ขั้นนั้นเช็ค "ความสุขเพิ่มขึ้น" แต่บทถูกปลุกตอนรับน้องตัวแรกพอดี
        ซึ่งน้องเกิดมาความสุขเต็ม 100 อยู่แล้ว · addHappy() ตัดที่เพดาน ⇒ ลูบยังไงเลขก็ไม่ขยับ
        ⚠ นี่คือ dead end เต็มรูปแบบ = ผิดกติกาเหล็กข้อ 1 ของโหมดบ้าน
     ② 🎀 เปลี่ยนปลอกคอ/สีได้จาก "เมนูสัตว์เลี้ยง" (ฟองแตะน้อง) และ "หน้าสัตว์เลี้ยงของหนู" ด้วย
        (เดิมทำได้ที่ร้านสัตว์เลี้ยงที่เดียว ต้องเดินข้ามเมืองไปทั้งที่ของซื้อมาแล้ว/สีก็แจกฟรี)
     ③ 📷⚙️ ปุ่มกล้อง + ปุ่มเฟือง **ต้องหายไปตอนเปิดแผงเต็มจอ** (แต่งตัว / สัตว์เลี้ยง / ตกแต่ง)
        ปุ่มลอยทับแผงโดยไม่ได้ช่วยอะไร แถมเด็กเผลอกดแล้วหลุดจากงานที่ทำค้างอยู่
     ④ 🐞 กด "บันทึกเลย" ในหน้าสัตว์เลี้ยงแล้ว **ปลอกคอ/สี/ความอิ่ม/ความสุข/ท่าที่สอน หายหมด**
        ต้นเหตุ: ปุ่มนี้ทำ 2 หน้าที่ (รับเลี้ยงตัวใหม่ / บันทึกการแก้ไขตัวเดิม) แต่เรียก
        `PETCARE.onAdopt()` ทุกครั้ง ซึ่งล้าง `care` ทั้งก้อนด้วย `blank()`
     ⑤ 📐 หน้าสัตว์เลี้ยงห้ามมีสกรอลบาร์แกน x
   ============================================================ */

const CHILD = { id:'fx17', name:'เทส', emoji:'🧒', birthDate:'2018-01-15', grade:'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id, PKEY = 'p1quiz_progress_' + CHILD.id;
const SEED = {
  v:1, mapV:3, econVer:5, worldSeeded:true,
  char:{gender:0, hair:0, hairC:1, eyes:1, eyeC:0, shirt:5, bottom:0, shoes:0},
  pet:{type:'dog', name:'ด่าง', color:0},
  care:{collar:{s:'classic', c:0}},
  unlocked:['pet:dog','petcol:dog:0','collar:classic','collar:bone','collar:bell'],
};

async function openHouse(page, tutOff){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, h, s, p, off])=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(h, JSON.stringify(s));
    localStorage.setItem(p, JSON.stringify({coins: 999999}));
    if(off) window.__TUT_OFF = true;
  }, [CHILD, HKEY, SEED, PKEY, !!tutOff]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(()=>!document.getElementById('house-view').hidden, null, {timeout:30000});
  await page.waitForFunction(()=>window.__houseDbg && window.__houseDbg.mode()==='world', null, {timeout:30000});
  return errs;
}

test('🐞 บทเรียนสัตว์เลี้ยง: ขั้น "ลองลูบหัว" ต้องผ่านได้แม้ความสุขเต็ม 100 (ห้ามตัน)', async ({ page }) => {
  const errs = await openHouse(page, false);
  await page.waitForFunction(()=>!!(window.HouseTutor && window.HousePetCare), null, {timeout:20000});
  /* ตั้งความสุขเต็ม = สภาพจริงของน้องที่เพิ่งถูกรับมาเลี้ยง (จังหวะที่บท c5 ถูกปลุก) */
  await page.evaluate(()=>window.HousePetCare.setHappy(window.HousePetCare.HAPPY_MAX));
  await page.evaluate(()=>{
    if(window.HouseTutor.active()) window.HouseTutor.stop();
    window.HouseTutor.fire('c5');
  });
  await page.waitForTimeout(400);
  for(let i = 0; i < 3; i++){                       /* ข้ามไปจนถึงขั้น await (index 3) */
    await page.evaluate(()=>window.HouseTutor.force());
    await page.waitForTimeout(200);
  }
  const at = await page.evaluate(()=>window.HouseTutor.state());
  expect(at.i, 'ต้องอยู่ขั้นที่ 4').toBe(3);
  expect(at.k, 'ขั้นนี้เป็นขั้นรอให้เด็กทำอะไรบางอย่าง').toBe('await');
  expect(await page.evaluate(()=>window.HousePetCare.happiness()),
         'ความสุขต้องเต็มอยู่ = เงื่อนไขที่เคยทำให้ตัน').toBe(100);

  await page.evaluate(()=>window.HousePetCare.pat());    /* ลูบ 1 ครั้ง — เพิ่มความสุขไม่ได้แล้ว */
  await page.waitForFunction(()=>{ const s = window.HouseTutor.state(); return !s || s.i > 3; },
                             null, {timeout:15000});
  expect(await page.evaluate(()=>window.HousePetCare.happiness()),
         'ยืนยันว่าผ่านขั้นไปได้ทั้งที่ความสุขไม่ได้เพิ่มเลย').toBe(100);
  expect(errs).toEqual([]);
});

test('🎀 เมนูสัตว์เลี้ยง: เปลี่ยนแบบปลอกคอและสีได้ และน้องในฉากเปลี่ยนตามทันที', async ({ page }) => {
  const errs = await openHouse(page, true);
  await page.waitForFunction(()=>!!(window.__houseDbg.petPos && window.__houseDbg.petPos()), null, {timeout:20000});
  await page.evaluate(()=>window.__houseDbg.petTap());
  await page.waitForTimeout(400);

  const labels = ()=> page.evaluate(()=>
    Array.from(document.querySelectorAll('#hpm-grid .hpm-btn')).map(b => b.textContent));
  const tap = (txt)=> page.evaluate((t)=>{
    Array.from(document.querySelectorAll('#hpm-grid .hpm-btn')).find(b => b.textContent.includes(t)).click();
  }, txt);

  expect((await labels()).join('|'), 'เมนูหลักต้องมีปุ่มปลอกคอ').toContain('ปลอกคอ');
  await tap('ปลอกคอ');
  await page.waitForTimeout(300);
  const list = (await labels()).join('|');
  expect(list, 'ต้องเห็นเฉพาะปลอกคอที่ซื้อแล้ว').toContain('กระดิ่ง');
  expect(list, 'ต้องมีทางไปเลือกสี').toContain('เปลี่ยนสี');

  await tap('กระดิ่ง');
  await page.waitForTimeout(400);
  expect(await page.evaluate(()=>window.HousePetCare.collar()), 'เปลี่ยนแบบแล้วต้องบันทึกจริง')
    .toEqual({s:'bell', c:0});
  /* ⚠ ต้องเช็คโมเดล 3D ด้วย — ลืม restylePet() แล้วค่าจะบันทึกแต่น้องยังใส่ของเดิมอยู่ */
  expect((await page.evaluate(()=>window.__houseDbg.petGear())).style,
         'น้องในฉากต้องเปลี่ยนปลอกคอตามทันที').toBe('bell');

  await tap('เปลี่ยนสี');
  await page.waitForTimeout(300);
  await tap('ฟ้า');
  await page.waitForTimeout(400);
  expect(await page.evaluate(()=>window.HousePetCare.collar()), 'เปลี่ยนสีแล้วต้องคงแบบเดิมไว้')
    .toEqual({s:'bell', c:4});
  expect(errs).toEqual([]);
});

const uiVisible = (page, id) => page.evaluate(i => {
  const e = document.getElementById(i); return !!e && !e.hidden;
}, id);
const CHROME = ['house-photo-btn', 'house-ctrl-gear'];
async function chrome(page){
  const out = [];
  for(const id of CHROME) out.push(await uiVisible(page, id));
  return out;
}

test('🎀 หน้า "สัตว์เลี้ยงของหนู": มีแถวปลอกคอ + สีปลอกคอ และเปลี่ยนแล้วบันทึกจริง', async ({ page }) => {
  const errs = await openHouse(page, true);
  await page.locator('#house-pet-btn').dispatchEvent('click');
  await expect(page.locator('#house-pet-picker')).toBeVisible();
  await expect(page.locator('#house-pet-collar-row')).toBeVisible();
  await expect(page.locator('#house-pet-collarcol-row')).toBeVisible();

  const nStyles = await page.evaluate(()=>window.HouseShop.PET_COLLARS.length);
  const nCols   = await page.evaluate(()=>window.HouseShop.COLLAR_COLORS.length);
  /* ⚠ แบบที่ยังไม่ได้ซื้อ **ต้องโชว์อยู่** พร้อมป้ายราคา (กติกาเดียวกับชิปสัตว์/สี — ห้ามซ่อน) */
  await expect(page.locator('#house-pet-collars .house-chip')).toHaveCount(nStyles);
  await expect(page.locator('#house-pet-collar-colors .house-chip')).toHaveCount(nCols);
  expect(await page.locator('#house-pet-collars .house-chip.locked').count(),
         'ปลอกคอที่ยังไม่ได้ซื้อต้องขึ้นแม่กุญแจ ไม่ใช่หายไป').toBeGreaterThan(0);

  await page.evaluate(()=>{
    Array.from(document.querySelectorAll('#house-pet-collars .house-chip'))
      .find(b => b.textContent.includes('กระดิ่ง')).click();
  });
  await expect.poll(()=>page.evaluate(()=>window.HousePetCare.collar().s)).toBe('bell');
  await page.evaluate(()=>document.querySelectorAll('#house-pet-collar-colors .house-chip')[4].click());
  expect(await page.evaluate(()=>window.HousePetCare.collar()), 'เปลี่ยนสีต้องคงแบบเดิมไว้')
    .toEqual({s:'bell', c:4});
  expect(errs).toEqual([]);
});

test('📷⚙️ ปุ่มกล้อง/เฟืองต้องหายตอนเปิดแผงเต็มจอ และกลับมาตอนออก', async ({ page }) => {
  const errs = await openHouse(page, true);
  expect(await chrome(page), 'อยู่ในเมืองปกติต้องเห็นทั้ง 2 ปุ่ม').toEqual([true, true]);

  for(const [name, open, close] of [
    ['หน้าสัตว์เลี้ยง', '#house-pet-btn',      '#house-pet-skip'],
    ['หน้าแต่งตัว',     '#house-edit-btn',     '#house-done-btn'],
  ]){
    await page.locator(open).dispatchEvent('click');
    await expect.poll(()=>chrome(page), 'เปิด' + name + 'แล้วต้องซ่อนทั้ง 2 ปุ่ม').toEqual([false, false]);
    await page.locator(close).dispatchEvent('click');
    await expect.poll(()=>chrome(page), 'ออกจาก' + name + 'แล้วต้องคืนทั้ง 2 ปุ่ม').toEqual([true, true]);
  }

  await page.locator('#house-decorate-btn').dispatchEvent('click');
  await expect.poll(()=>page.evaluate(()=>window.__houseDbg.editing())).toBe(true);
  expect(await chrome(page), 'โหมดตกแต่งก็ต้องซ่อนทั้ง 2 ปุ่ม').toEqual([false, false]);
  expect(errs).toEqual([]);
});

test('🐞 บันทึกน้องตัวเดิม: ปลอกคอ/สี/สถานะการดูแล ต้องไม่ถูกล้าง', async ({ page }) => {
  const errs = await openHouse(page, true);
  /* ทำให้สถานะ "ไม่ใช่ค่าเริ่มต้น" ก่อน จะได้รู้ว่าถูกล้างหรือไม่ */
  await page.evaluate(()=>{
    window.HousePetCare.setHappy(55);
    window.HousePetCare.setFull(60);
    window.HousePetCare.setCollar('bell', 4);
  });
  await page.locator('#house-pet-btn').dispatchEvent('click');
  await expect(page.locator('#house-pet-picker')).toBeVisible();
  /* เปลี่ยนแค่สีขนน้อง แล้วกดบันทึก (ชนิดเดิม = ตัวเดิม) */
  await page.evaluate(()=>{
    const cs = document.querySelectorAll('#house-pet-colors .house-chip:not(.locked)');
    if(cs.length > 1) cs[1].click();
  });
  await page.locator('#house-pet-done').dispatchEvent('click');
  await expect.poll(()=>page.evaluate(()=>window.__houseDbg.mode())).toBe('world');

  expect(await page.evaluate(()=>window.HousePetCare.collar()), 'ปลอกคอต้องอยู่ครบ')
    .toEqual({s:'bell', c:4});
  expect(await page.evaluate(()=>window.HousePetCare.happiness()), 'ความสุขห้ามถูกรีเซ็ต').toBe(55);
  expect(await page.evaluate(()=>window.HousePetCare.fullness()), 'ความอิ่มห้ามถูกรีเซ็ต').toBe(60);
  /* น้องตัวจริงที่เพิ่ง spawn ใหม่ต้องใส่ปลอกคอนั้นด้วย ไม่ใช่แค่ค่าใน save */
  expect((await page.evaluate(()=>window.__houseDbg.petGear())).style).toBe('bell');
  expect(errs).toEqual([]);
});

test('🐾 รับเลี้ยงน้อง "ตัวใหม่" ต้องยังรีเซ็ตสถานะให้เหมือนเดิม (ไม่ใช่ปิดไปทั้งหมด)', async ({ page }) => {
  const errs = await openHouse(page, true);
  await page.evaluate(()=>{ window.HousePetCare.setHappy(20); window.HousePetCare.setFull(15); });
  /* ปล่อยน้องคืนก่อน แล้วรับเลี้ยงใหม่ = ตัวใหม่จริงๆ */
  await page.locator('#house-pet-btn').dispatchEvent('click');
  await expect(page.locator('#house-pet-picker')).toBeVisible();
  await page.locator('#house-pet-remove').dispatchEvent('click');
  await expect.poll(()=>page.evaluate(()=>{ const d = window.__houseDbg; return d.mode(); })).toBe('world');
  await page.locator('#house-pet-btn').dispatchEvent('click');
  await page.locator('#house-pet-done').dispatchEvent('click');
  await expect.poll(()=>page.evaluate(()=>window.__houseDbg.mode())).toBe('world');
  expect(await page.evaluate(()=>window.HousePetCare.happiness()),
         'น้องตัวใหม่ต้องเริ่มที่ความสุขเต็ม').toBe(100);
  expect(await page.evaluate(()=>window.HousePetCare.fullness()),
         'น้องตัวใหม่ต้องเริ่มที่ความอิ่มเต็ม').toBeGreaterThan(15);
  expect(errs).toEqual([]);
});

test('📐 หน้าสัตว์เลี้ยงห้ามมีสกรอลบาร์แกน x', async ({ page }) => {
  await openHouse(page, true);
  await page.locator('#house-pet-btn').dispatchEvent('click');
  await expect(page.locator('#house-pet-picker')).toBeVisible();
  const r = await page.evaluate(()=>{
    const el = document.querySelector('#house-pet-picker .house-creator-rows');
    return {ox: getComputedStyle(el).overflowX, sw: el.scrollWidth, cw: el.clientWidth};
  });
  /* ⚠ overflow-y:auto อย่างเดียวจะทำให้แกน x กลายเป็น auto เอง ⇒ ต้องประกาศ hidden ให้ชัด */
  expect(r.ox, 'ต้องปิดสกรอลแกน x ไว้ชัดเจน').toBe('hidden');
  expect(r.sw, 'เนื้อในต้องไม่ล้นออกด้านข้าง').toBeLessThanOrEqual(r.cw);
});

/* 🗑️ ระบบตู้ปลาถูกยกเลิกทั้งระบบ 2026-08-17 (ผู้ใช้สั่ง — popup ไม่เหมือนตู้ปลาจริง ปลาไม่สวย)
   ปลาที่ตกได้ย้ายไปอยู่ใน "สมุดสะสม" (เฟส 16 · QUEST-DESIGN.md ข้อ 57.1) แทน */
test('🗑️ ตู้ปลา: popup ต้องหายหมด แต่ยังเป็นเฟอร์นิเจอร์ตกแต่งได้เหมือนเดิม', async ({ page }) => {
  const errs = await openHouse(page, true);
  const r = await page.evaluate(()=>{
    const F = window.__houseDbg.furn();
    return {
      panel: !!document.getElementById('house-tank'),
      api: ['openTank','closeTank','tankIsOpen','tankFish','TANK_MAX','TANK_PER_KIND']
             .filter(k => k in window.HousePlay),
      actions: ['aquarium','aquarium-sea'].map(id => (F.byId[id] || {}).action),
      buildable: ['aquarium','aquarium-sea'].every(id => typeof (F.byId[id] || {}).build === 'function'),
    };
  });
  expect(r.panel, 'แผง #house-tank ต้องถูกลบออกจากหน้า').toBe(false);
  expect(r.api, 'API ตู้ปลาต้องไม่เหลืออยู่ใน HousePlay').toEqual([]);
  /* ⚠ `action` ต้องหายไป ⇒ แตะแล้วตกลงมาที่ decorBounce เหมือนของตกแต่งชิ้นอื่น */
  expect(r.actions, 'ตู้ปลาต้องไม่มี action พิเศษแล้ว').toEqual([undefined, undefined]);
  /* 🔒 แต่ **ห้ามลบตัวเฟอร์นิเจอร์ทิ้ง** — เด็กที่ซื้อ/วางไว้แล้วต้องยังมีของอยู่ (กติกาเหล็กข้อ 3) */
  expect(r.buildable, 'ตู้ปลาต้องยังสร้างโมเดลได้ปกติ').toBe(true);
  /* วางตู้ปลาไว้ในบ้านแล้วต้องไม่มี error ตอนวาดฉาก */
  expect(await page.evaluate(()=>{
    try{ const g = window.__houseDbg.buildFurn('aquarium'); return g.children.length > 0; }
    catch(e){ return 'ERR:' + e.message; }
  })).toBe(true);
  expect(errs).toEqual([]);
});
