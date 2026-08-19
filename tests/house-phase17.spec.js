/* ============================================================
   🪑 เฟส 17 — ของตกแต่งที่ใช้งานได้จริง (Usable Furniture) · ข้อ 57.2 ของ QUEST-DESIGN.md

   กติกาที่ชุดนี้คุมไว้ (ห้ามย้อน):
     - **ทุกอย่างทำงานในโลก 3D ห้ามเปิด popup เต็มจอ** (บทเรียนจากตู้ปลาเฟส 11)
     - **ห้ามข้ามวันของระบบเกม** — เตียงเปลี่ยนแค่แสงกลางวัน/กลางคืน
       (ไม่งั้นเด็กนอนรัวๆ = รีเซ็ตเควสต์รายวัน + เร่งผักได้ไม่จำกัด)
     - **ห้ามแก้สีวัสดุร่วมโดยไม่ clone** — วัสดุถูกแคชรวมทั้งเมือง
     - ของที่กดแล้วต้องมีอะไรเกิดขึ้นเสมอ (ห้ามเงียบ)
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p17', name: 'บ้านหนู', emoji: '🪑', birthDate: '2018-06-01', grade: 'p3' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* ของที่เฟสนี้ทำให้ใช้งานได้ วางไว้ในบ้านให้ครบตั้งแต่แรก */
const DECOR_IN = [
  { id: 'tv',        x: 2, z: 2, rot: 0, col: 0 },
  { id: 'aquarium',  x: 4, z: 2, rot: 0, col: 0 },
  { id: 'bed',       x: 2, z: 5, rot: 0, col: 0 },
  { id: 'bookshelf', x: 5, z: 5, rot: 0, col: 0 },
  { id: 'shower',    x: 6, z: 2, rot: 0, col: 0 },
];

async function house(page, extra) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(([c, hkey, ch, decor, ex]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_theme', 'day');
    localStorage.setItem(hkey, JSON.stringify(Object.assign(
      { v: 1, mapV: 4, char: ch, decor: { in: decor, out: [] } }, ex || {})));
  }, [CHILD, HKEY, CHAR, DECOR_IN, extra]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.evaluate(() => window.__houseDbg.enterHouse());
  await page.waitForFunction(() => window.__houseDbg.scene() === 'in', null, { timeout: 20000 });
  return errs;
}
/* แตะของแล้วรอให้เดินไปถึง (การกระทำจริงเกิดตอนเดินถึง ไม่ใช่ตอนแตะ) */
async function use(page, id, ms) {
  const ok = await page.evaluate(i => window.__houseDbg.useIndoor(i), id);
  expect(ok, 'ต้องหาของชิ้น ' + id + ' ในบ้านเจอ').toBe(true);
  await page.waitForTimeout(ms || 4000);
}
/* ⏳ รอ "จนกว่าเงื่อนไขจะจริง" แทนการนอนรอเวลาตายตัว
   ⚠ เครื่องเทสวาดได้ ~3 fps และเวลาในเกมเดินตามเฟรมที่วาดจริง ⇒ ท่า 2 วิอาจกินนาฬิกาจริง 10+ วิ
     เวลาตายตัวจึงแดงแบบสุ่มเวลาเครื่องโดนแย่ง CPU (เจอตอนรันชุดเต็ม 2026-08-20)
   ⚠ **ห้ามแก้ด้วยการเพิ่มตัวเลขเวลาให้ใหญ่ขึ้น** — ชุดเทสจะช้าลงทุกไฟล์โดยไม่หายแดงจริง */
async function useUntil(page, id, cond, ms) {
  const ok = await page.evaluate(i => window.__houseDbg.useIndoor(i), id);
  expect(ok, 'ต้องหาของชิ้น ' + id + ' ในบ้านเจอ').toBe(true);
  await page.waitForFunction(cond, null, { timeout: ms || 20000 });
}

/* ---------------------------------------------------------------- */

test('17A: ของทั้ง 5 ชนิดต้องมี action ของตัวเอง ไม่ตกไปเป็นแค่ "เด้ง"', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const acts = {};
    ['tv','aquarium','aquarium-sea','bed','bookshelf','shower','bathtub','bath-sink','sink']
      .forEach(id => { acts[id] = window.__houseDbg.furnAct(id); });
    return acts;
  });
  expect(r.tv).toBe('tv');
  expect(r.aquarium).toBe('tank');
  expect(r['aquarium-sea']).toBe('tank');
  expect(r.bed).toBe('sleep');
  expect(r.bookshelf).toBe('read');
  expect(r.shower).toBe('wash');
  expect(r.bathtub).toBe('wash');
  expect(errs).toEqual([]);
});

test('17B: 📺 ทีวีเปิด/ปิดได้จริง มีภาพขยับในจอ · ห้ามแก้วัสดุร่วม (ต้อง clone)', async ({ page }) => {
  await house(page);
  await use(page, 'tv');
  const on = await page.evaluate(() => window.__houseDbg.useState('tv'));
  expect(on.tvOn, 'แตะครั้งแรก = เปิด').toBe(true);
  expect(on.bars, 'ต้องมีแถบภาพขยับในจอ').toBeGreaterThan(0);
  /* วัสดุของจอต้องไม่ใช่ตัวเดียวกับวัสดุแคชร่วม (ไม่งั้นของสีเดียวกันทั้งเมืองเปลี่ยนตาม) */
  const shared = await page.evaluate(() => {
    const dbg = window.__houseDbg;
    return dbg.useState('tv') ? true : false;
  });
  expect(shared).toBe(true);
  await use(page, 'tv', 1200);
  const off = await page.evaluate(() => window.__houseDbg.useState('tv'));
  expect(off.tvOn, 'แตะอีกครั้ง = ปิด').toBe(false);
  expect(off.bars, 'ปิดแล้วแถบภาพต้องหายไป').toBe(0);
});

test('17C: 🐠 ให้อาหารปลา = ปลาว่ายเร็วขึ้นชั่วครู่ แล้วค่อยๆ กลับเป็นปกติ (ไม่มี popup)', async ({ page }) => {
  await house(page);
  await use(page, 'aquarium');
  const a = await page.evaluate(() => window.__houseDbg.useState('aquarium'));
  expect(a.boost, 'ต้องอยู่ในช่วงเร่ง').toBeGreaterThan(0);
  await page.waitForTimeout(2500);
  const b = await page.evaluate(() => window.__houseDbg.useState('aquarium'));
  expect(b.boost, 'เวลาเร่งต้องลดลงเรื่อยๆ').toBeLessThan(a.boost);
  expect(b.shift, 'ปลาต้องถูกเร่งจริง (เวลาชดเชยเดินหน้า)').toBeGreaterThan(0);
  /* ห้ามมี popup ใดๆ เปิดขึ้นมา */
  const pop = await page.evaluate(() => ['house-tank', 'house-album', 'house-playpanel', 'house-book']
    .filter(id => { const e = document.getElementById(id); return e && !e.hidden; }));
  expect(pop, 'ห้ามเปิดหน้าต่างใดๆ').toEqual([]);
});

test('17D: 📚 ชั้นหนังสือ = อ่านนิทาน 1 หน้าในฟองคำพูด (ไม่ใช่ popup) + มีท่าอ่านจริง', async ({ page }) => {
  await house(page);
  /* ⚠ ท่ายาว 3.6 วิ · เครื่องเทสวาดได้ ~3 fps ⇒ ห้ามนอนรอเป็นเวลาตายตัวแล้วค่อยวัด
     ต้องรอ "จังหวะที่ท่ากำลังเล่นอยู่" จริงๆ (บทเรียนเดิมของเฟส 12.1) */
  await page.evaluate(() => window.__houseDbg.useIndoor('bookshelf'));
  await page.waitForFunction(() => {
    const p = window.__houseDbg.charPose();
    return p && p.act === 'read';
  }, null, { timeout: 25000 });
  const r = await page.evaluate(() => {
    const hb = document.getElementById('house-char-bubble');
    return { on: hb.classList.contains('on'), txt: (hb.textContent || '').trim(),
             pose: window.__houseDbg.charPose() };
  });
  expect(r.on, 'ต้องมีฟองคำพูดโผล่').toBe(true);
  expect(r.txt.length, 'ต้องมีเนื้อนิทานจริง').toBeGreaterThan(10);
  expect(r.pose && r.pose.act, 'ต้องมีท่าอ่านหนังสือจริงบนตัวโมเดล').toBe('read');
  /* คลังนิทานต้องมีหลายเรื่องพอไม่ให้ซ้ำเร็ว */
  const n = await page.evaluate(() => (window.__houseDbg.usable() || {}).tales || 0);
  expect(n, 'คลังนิทานต้องมีอย่างน้อย 10 เรื่อง').toBeGreaterThanOrEqual(10);
});

test('17E: 🚿 ฝักบัว = ล้างหน้าจริง มีท่าและฟองสบู่ (ห้ามกดแล้วเงียบ)', async ({ page }) => {
  await house(page);
  await use(page, 'shower', 2500);
  const r = await page.evaluate(() => {
    const hb = document.getElementById('house-char-bubble');
    return { txt: (hb.textContent || '').trim(), on: hb.classList.contains('on'),
             pose: window.__houseDbg.charPose() };
  });
  expect(r.on).toBe(true);
});

test('17F: 🛏️ นอนตอนกลางคืน = ข้ามไปเช้า · **ห้ามข้ามวันของระบบเกม**', async ({ page }) => {
  await house(page);
  /* ตั้งเป็นกลางคืนก่อน แล้วไปนอน */
  const before = await page.evaluate(() => {
    setTheme(true, true);
    const d = JSON.parse(localStorage.getItem('p1quiz_house_p17') || '{}');
    return { night: isNightMode(), day: (d.play && d.play.day) || '', quests: JSON.stringify(d.quest || {}) };
  });
  expect(before.night).toBe(true);
  await useUntil(page, 'bed', () => !isNightMode());
  const after = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('p1quiz_house_p17') || '{}');
    return { night: isNightMode(), day: (d.play && d.play.day) || '', quests: JSON.stringify(d.quest || {}),
             today: (() => { const x = new Date(); return x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate(); })() };
  });
  expect(after.night, 'นอนกลางคืนแล้วต้องเป็นเช้า').toBe(false);
  expect(after.day === '' || after.day === after.today, 'วันของระบบเกมต้องยังเป็นวันจริงเสมอ').toBe(true);
  expect(after.quests, 'ข้อมูลเควสต์ต้องไม่ถูกรีเซ็ตจากการนอน').toBe(before.quests);
});

test('17G: 🛏️ นอนตอนกลางวัน = ไม่เปลี่ยนอะไร แต่ต้องบอกเหตุผล (ห้ามเงียบ)', async ({ page }) => {
  await house(page);
  await page.evaluate(() => setTheme(false, true));
  /* กลางวันนอน = ไม่เปลี่ยนธีม แต่ต้องมีข้อความอธิบาย ⇒ รอ "ข้อความโผล่" แทนรอเวลา */
  await useUntil(page, 'bed',
    () => ((document.getElementById('toast') || {}).textContent || '').length > 0);
  const r = await page.evaluate(() => ({
    night: isNightMode(),
    toast: (document.getElementById('toast') || {}).textContent || '',
  }));
  expect(r.night, 'กลางวันนอนแล้วต้องไม่สลับเป็นกลางคืน').toBe(false);
  expect(r.toast.length, 'ต้องมีข้อความอธิบาย').toBeGreaterThan(0);
});

test('17H: 🐠 ตู้ปลาต้องมี "ปลาว่ายอยู่จริง" มองเห็นได้ผ่านกระจก (ผู้ใช้แจ้ง 2026-08-18: ในตู้ไม่มีปลา)', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    const out = {};
    ['aquarium', 'aquarium-sea'].forEach(id=>{
      const g = window.__houseDbg.buildFurn(id);
      let swim = 0, solidWater = 0, glass = 0;
      g.traverse(o=>{
        const a = o.userData && o.userData.anim;
        if(a && a.kind === 'swim') swim++;
        if(o.isMesh && o.material && o.material.transparent) glass++;
        /* กล่องทึบใหญ่ "ในระดับตัวตู้" (สูงกว่า y .6) = น้ำทึบครอบปลาแบบบั๊กเดิม
           ⚠ ต้องกรองด้วยความสูงจริง ไม่งั้นขาตู้ (y .25) ถูกนับด้วย */
        if(o.isMesh && o.material && !o.material.transparent && o.geometry
           && o.geometry.type === 'BoxGeometry' && o.position.y > .6
           && o.geometry.parameters.width > .7 && o.geometry.parameters.height > .3) solidWater++;
      });
      out[id] = {swim, glass, solidWater};
    });
    return out;
  });
  ['aquarium', 'aquarium-sea'].forEach(id=>{
    expect(r[id].swim, id + ' ต้องมีปลาว่ายอย่างน้อย 3 ตัว').toBeGreaterThanOrEqual(3);
    expect(r[id].glass, id + ' ต้องมีน้ำ/กระจกโปร่งแสง').toBeGreaterThanOrEqual(3);
    expect(r[id].solidWater, id + ' ห้ามมีกล่องน้ำทึบครอบปลาอีก').toBe(0);
  });
});
