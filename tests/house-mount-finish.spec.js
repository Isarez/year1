const { test, expect } = require('@playwright/test');

/* ============================================================
   🐞 บั๊กที่ผู้ใช้แจ้ง 2026-08-17 (เกมทายเงา — แต่เป็นกับอีก 5 เกมด้วย)
     "ไม่มีจำนวนโจทย์บอกว่าต้องเล่นกี่โจทย์ · เล่นจบแล้ว popup ไม่ปิด ไม่รายงานผล
      และเล่นบนกระดานกลางเมืองแล้วเควสต์ไม่จบ"

   ต้นเหตุ 2 อย่าง แยกกันคนละที่:
     ① `js/owl-games.js` ให้ทุก engine ส่งผลกลับโฮสต์ผ่าน `OwlGames.handleFinish()`
        ซึ่งถูกเรียกอยู่บรรทัดแรกของ `finishP2Game()` เท่านั้น
        แต่มี engine 6 ตัวที่เขียนหน้าสรุปเองแยกไป (ทายเงา/จับคู่/นกฮูกสั่ง/ผสมสี/ดนตรี/หุ่นยนต์)
        ⇒ ข้ามตะเข็บนี้ไปหมด โฮสต์ไม่เคยรู้ว่าเกมจบ การ์ดเลยค้าง เควสต์ไม่จบ
     ② CSS `.og-embedded > .quiz-top{display:none}` ซ่อนแถบบนทั้งแถบตอนยืมเกมมาเล่นในการ์ด
        ซึ่งตัวนับข้อ (`.q-counter`) อยู่ในนั้น ⇒ เด็กไม่รู้ว่าต้องเล่นกี่ข้อ
   ============================================================ */

const CHILD = { id:'mf17', name:'เทส', emoji:'🧒', birthDate:'2018-01-15', grade:'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id, PKEY = 'p1quiz_progress_' + CHILD.id;
const SEED = { v:1, mapV:3, econVer:5, worldSeeded:true,
               char:{gender:0, hair:1, hairC:4, eyes:1, eyeC:0, shirt:3, bottom:6, shoes:2} };

async function intoHouse(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, h, s, p])=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(h, JSON.stringify(s));
    localStorage.setItem(p, JSON.stringify({coins: 500}));
    window.__TUT_OFF = true;
  }, [CHILD, HKEY, SEED, PKEY]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(()=>!document.getElementById('house-view').hidden, null, {timeout:30000});
  await page.waitForFunction(()=>window.__houseDbg && window.__houseDbg.mode()==='world', null, {timeout:30000});
  await page.waitForFunction(()=>!!(window.HouseGames && window.OwlGames), null, {timeout:20000});
  return errs;
}

test('🔢 เกมที่ยืมมาเล่นในการ์ดต้องเห็น "ข้อที่เท่าไหร่ / ทั้งหมดกี่ข้อ" เสมอ', async ({ page }) => {
  const errs = await intoHouse(page);
  await page.evaluate(()=>window.HouseGames.play({gameId:'shadow', gradeId:'p2'}));
  await expect(page.locator('#shadow-view .q-counter')).toBeVisible();
  expect(await page.locator('#shadow-view .q-counter').textContent(),
         'ต้องบอกทั้งข้อปัจจุบันและจำนวนข้อทั้งหมด').toMatch(/^\d+\/\d+$/);
  /* ⚠ ธง og-keep ต้องถูกถอดออกตอน unmount ไม่งั้นหน้าเต็มจอจะเพี้ยนตามไปด้วย */
  await page.evaluate(()=>window.OwlGames.unmount());
  expect(await page.evaluate(()=>document.querySelector('#shadow-view > .quiz-top').className))
    .not.toContain('og-keep');
  expect(errs).toEqual([]);
});

test('🎯 เล่นทายเงาจบในการ์ด: ต้องรายงานผลกลับโฮสต์ (เควสต์ถึงจะจบได้)', async ({ page }) => {
  const errs = await intoHouse(page);
  let done = null;
  await page.exposeFunction('__onDone', r => { done = r; });
  await page.evaluate(()=>window.HouseGames.play({gameId:'shadow', gradeId:'p2',
    onDone: r => window.__onDone(JSON.parse(JSON.stringify(r)))}));
  await page.waitForTimeout(600);
  /* ⚠ `shadowGame` ประกาศด้วย `let` ⇒ เป็น global lexical ไม่ใช่ property ของ window
     ต้องอ้างชื่อตรงๆ ใน evaluate ไม่ใช่ window.shadowGame */
  const total = await page.evaluate(()=>shadowGame.totalLevels);
  for(let i = 0; i < total + 4 && !done; i++){
    const acted = await page.evaluate(()=>{
      if(typeof shadowGame === 'undefined' || !shadowGame || shadowGame.locked) return false;
      const btns = Array.from(document.querySelectorAll('#shadow-choices .shadow-choice'));
      const b = btns.find(x => x.querySelector('.shadow-choice-emoji').textContent === shadowGame.answer.e);
      (b || btns[0]).click();
      return true;
    });
    await page.waitForTimeout(acted ? 1500 : 400);
  }
  expect(done, 'โฮสต์ต้องได้รับผลลัพธ์ — ไม่งั้นเควสต์ไม่มีทางจบ').not.toBeNull();
  expect(done.gameId).toBe('shadow');
  expect(done.totalLevels).toBe(total);
  expect(done.stars, 'ตอบถูกหมดต้องได้ 3 ดาว').toBe(3);
  expect(errs).toEqual([]);
});

test('🎯 หน้าสรุปมาตรฐานของการ์ดต้องขึ้นแทนกระดานเกมเมื่อเล่นจบ', async ({ page }) => {
  const errs = await intoHouse(page);
  await page.evaluate(()=>window.HouseGames.play({gameId:'shadow', gradeId:'p2'}));
  await page.waitForTimeout(600);
  const total = await page.evaluate(()=>shadowGame.totalLevels);
  for(let i = 0; i < total + 4; i++){
    if(await page.evaluate(()=>!!document.querySelector('#house-qz .hqz-stars'))) break;
    const acted = await page.evaluate(()=>{
      if(typeof shadowGame === 'undefined' || !shadowGame || shadowGame.locked) return false;
      const btns = Array.from(document.querySelectorAll('#shadow-choices .shadow-choice'));
      const b = btns.find(x => x.querySelector('.shadow-choice-emoji').textContent === shadowGame.answer.e);
      (b || btns[0]).click();
      return true;
    });
    await page.waitForTimeout(acted ? 1500 : 400);
  }
  await expect(page.locator('#house-qz .hqz-stars')).toBeVisible();
  expect(await page.locator('#house-qz .hqz-gain').textContent()).toContain('ทายเงา');
  /* 🔒 ห้ามให้หน้าสรุปของ "หน้าหลัก" เด้งขึ้นมาซ้อน — มันอยู่หลังฉากเมือง เด็กเห็นเป็น popup หลุด */
  expect(await page.evaluate(()=>document.getElementById('result-view').hidden)).toBe(true);
  expect(errs).toEqual([]);
});

/* 🐞 บั๊กที่จับได้ตอนรีวิว 2026-08-17 — **ปิดการ์ดกลางคันแล้วเกมพัง**
   ทุก engine เลื่อนด่านด้วย `setTimeout(...)` แล้วใน callback เรียก `render<X>Level()`
   ซึ่งอ่าน state จาก **ตัวแปร global** — แต่ `stop()` ตอน unmount ล้าง state เป็น null ไปแล้ว
   ⇒ เด็กตอบข้อแล้วปิดการ์ดทันที (ภายในเวลาหน่วงเลื่อนด่าน ~1.2-1.7 วิ) = TypeError
   ⚠ เทสนี้กันทั้งคลาส ไม่ใช่เกมเดียว — เพิ่ม engine ใหม่เข้า ALLOW แล้วจะถูกคุมอัตโนมัติ */
test('🛟 ปิดการ์ดกลางคันระหว่างที่ตัวจับเวลาเลื่อนด่านยังค้าง — ทุกเกมต้องไม่พัง', async ({ page }) => {
  test.setTimeout(300000);
  const errs = await intoHouse(page);
  const ids = await page.evaluate(()=>window.HouseGames.allowed());
  expect(ids.length, 'ต้องมีเกมให้ยืมเล่นจริง').toBeGreaterThan(10);
  const bad = [], skipped = [];
  for(const id of ids){
    const before = errs.length;
    /* ⚠ ใช้ ป.6 เพราะบางเกมมีหมวดเฉพาะชั้นสูง (mirror ป.4-6 · world/order ป.3-6)
       ⇒ ถ้าใช้ ป.2 จะ mount ไม่ขึ้นเอง ซึ่งเป็นพฤติกรรมที่ถูกต้อง ไม่ใช่บั๊ก */
    const mounted = await page.evaluate((g)=>window.HouseGames.play({gameId:g, gradeId:'p6'}), id);
    await page.waitForTimeout(450);
    for(let k = 0; k < 2; k++){
      await page.evaluate(()=>{
        const b = Array.from(document.querySelectorAll('.og-embedded button, .og-embedded .hqz-tile'))
          .filter(x => !x.disabled && x.offsetParent)[0];
        if(b) b.click();
      });
      await page.waitForTimeout(280);
    }
    await page.evaluate(()=>window.__houseDbg.closeQuest());   /* ปิดทั้งที่ timer ยังค้าง */
    await page.waitForTimeout(1700);
    if(!mounted){ skipped.push(id); continue; }   /* ไม่มีหมวดของชั้นนี้ = ข้าม ไม่ใช่บั๊ก */
    if(errs.length > before) bad.push(id + ':' + errs.slice(before).join('|').slice(0, 140));
  }
  expect(bad, 'ต้องไม่มีเกมไหนพังตอนปิดการ์ดกลางคัน').toEqual([]);
  expect(ids.length - skipped.length, 'ต้องได้ทดสอบเกมจริงเกินครึ่ง').toBeGreaterThan(ids.length / 2);
});
