/* ============================================================
   เฟส 5 — กลไกกลุ่ม C: ยืม engine เกมของหน้าหลักมาเล่นในการ์ดเควสต์
   ไม่ได้เขียนเกมใหม่ · ตัวจริงอยู่ js/games-*.js ห่อด้วย js/owl-games.js
   ============================================================ */
const { test, expect } = require('@playwright/test');
const { clickEnterHouse } = require('./helpers');
const CHILD = { id: 'p5a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function house(page){
  const errs=[]; page.on('pageerror', e=>errs.push(String(e)));
  await page.addInitScript(c=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music','off');
    localStorage.setItem('p1quiz_house_p5a', JSON.stringify({v:1,mapV: 3,
      char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0}}));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await clickEnterHouse(page);
  await page.waitForFunction(()=>window.__houseDbg && window.__houseDbg.ready(), null, {timeout:30000});
  return errs;
}
test('เฟส 5: เควสต์สุ่มกลไกกลุ่ม C ได้ · quiz ยังเจอบ่อยสุด', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(()=>{
    const q = window.HouseQuests;
    const cnt = {};
    for(let d=1; d<=120; d++){
      const eng = window.HOUSE_QUESTS({ load:()=>({}), save:()=>{}, childId:()=>'k', gradeId:()=>'p3',
        dayKey:()=>'2026-9-'+d, npcDefs:[], hasGame:()=>true });
      eng.sync();
      for(let i=0;i<eng.BOARD_N;i++){ const s2=eng.specForBoard(i); if(s2) cnt[s2.mech]=(cnt[s2.mech]||0)+1; }
    }
    return {cnt, engines:q.ENGINE_MECHS};
  });
  console.log(JSON.stringify(r.cnt));
  const total = Object.values(r.cnt).reduce((a,b)=>a+b,0);
  /* ⚠ **เกณฑ์นี้ถูกกลับด้านเมื่อ 2026-08-20 ไม่ได้ลบทิ้ง**
     เดิม `quiz` ถูกล็อกไว้ 40% ("ต้องเจอบ่อยที่สุดเสมอ") ⇒ กว่าครึ่งของงานเป็นการ์ดตอบคำถาม
     ผู้ใช้สั่งให้ **เฉลี่ยเจอหลายหมวดหมู่** ⇒ ตอนนี้ทุกกลไกในพูลมีโอกาสใกล้เคียงกัน
     สิ่งที่ยังต้องจริงคือ **quiz ต้องยังอยู่ในพูลเสมอ** (ทุก NPC ตอบคำถามได้) ไม่ใช่ต้องเจอบ่อยสุด */
  expect(r.cnt.quiz, 'quiz ต้องยังถูกแจกอยู่ (ห้ามหายไปจากพูล)').toBeGreaterThan(0);
  expect(r.cnt.quiz/total, 'แต่ต้องไม่ครองกระดานอีกต่อไป').toBeLessThan(0.30);
  const engHits = r.engines.reduce((a,m)=>a+(r.cnt[m]||0),0);
  expect(engHits, 'ต้องสุ่มเจอเกมกลุ่ม C บ้าง').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});
test('เฟส 5: เล่นเกมที่ยืมมาในการ์ดเควสต์ได้จริง · จบแล้วได้ดาว', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(()=>window.HouseQuestUI.playTest({mech:'mix', title:'🧪 ผสมสี'}));
  await expect(page.locator('#hqz-stage .hqz-yes')).toBeVisible();
  await page.locator('#hqz-stage .hqz-yes').click();

  /* engine ของหน้าหลักต้องถูกย้ายมาอยู่ในเวทีของการ์ด */
  await expect(page.locator('#hqz-stage #mix-view')).toBeVisible();
  expect(await page.evaluate(()=>window.OwlGames.current())).toBe('mix');

  /* จำลองว่า engine เล่นจบ (พลาด 0 ครั้ง) → ต้องได้ 3 ดาวและคืน view กลับที่เดิม */
  await page.evaluate(()=>finishP2Game(window.__houseDbg.qRun ? 'skill-mix' : 'skill-mix', 0, 10, 'ผสมสี'));
  await expect(page.locator('.hqz-stars')).toBeVisible({timeout:8000});
  const after = await page.evaluate(()=>({
    cur: window.OwlGames.current(),
    inStage: !!document.querySelector('#hqz-stage #mix-view'),
    stars: document.querySelector('.hqz-stars').textContent,
  }));
  console.log(JSON.stringify(after));
  expect(after.cur).toBe(null);
  expect(after.inStage).toBe(false);
  expect(after.stars).toContain('⭐⭐⭐');
  expect(errs).toEqual([]);
});

/* ผู้ใช้แจ้ง 2026-08-12: เปียโนในการ์ดเควสต์เห็นคีย์ไม่ครบ ต้องเลื่อนดู
   ⇒ การ์ดของเกมที่ยืม engine หน้าหลักต้องกว้างขึ้น + คีย์ยืดพอดีกล่องเหมือน modal "เปียโนของหนู" */
test('เปียโนในการ์ดเควสต์: เห็นคีย์ครบทุกตัว ไม่ต้องเลื่อนดู', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(()=>window.HouseGames.play({gameId:'music', gradeId:'p3'}));
  await expect(page.locator('#music-piano')).toBeVisible();
  const m = await page.evaluate(()=>{
    const wrap = document.querySelector('#music-view .music-piano-wrap');
    const piano = document.getElementById('music-piano');
    const card = document.querySelector('#house-qz .house-qz') || document.getElementById('house-qz');
    const keys = Array.from(piano.querySelectorAll('.music-white'));
    const last = keys[keys.length-1].getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    return { overflowX: wrap.scrollWidth - wrap.clientWidth,
             overflowY: card.scrollHeight - card.clientHeight,
             keyW: Math.round(keys[0].getBoundingClientRect().width),
             lastKeyInside: last.right <= w.right + 1,
             keys: keys.length };
  });
  console.log('เปียโนในการ์ด: ' + JSON.stringify(m));
  expect(m.keys).toBeGreaterThan(10);
  expect(m.overflowX, 'คีย์ล้นกล่อง = เด็กต้องเลื่อนหาคีย์ที่ต้องกด').toBeLessThanOrEqual(2);
  expect(m.overflowY, 'การ์ดสูงเกินจนต้องเลื่อน').toBeLessThanOrEqual(2);
  expect(m.lastKeyInside).toBe(true);
  expect(m.keyW, 'คีย์แคบเกินไปสำหรับนิ้วเด็ก').toBeGreaterThan(38);
  expect(errs).toEqual([]);
});

/* เกมอื่นที่ยืมมาเล่นก็ต้องพอดีการ์ดเหมือนกัน (ไม่มีเลื่อนแนวตั้ง) */
test('เกมที่ยืม engine มาเล่น: พอดีการ์ด ไม่ต้องเลื่อนแนวตั้ง', async ({ page }) => {
  const errs = await house(page);
  for(const g of ['mix','memory','balance','shadow']){
    await page.evaluate(()=>{ window.OwlGames.unmount(); window.HouseQuestUI.closeCard(); });
    await page.evaluate(id=>window.HouseGames.play({gameId:id, gradeId:'p3'}), g);
    await page.waitForTimeout(500);
    const o = await page.evaluate(()=>{
      const card = document.querySelector('#house-qz .house-qz') || document.getElementById('house-qz');
      return card.scrollHeight - card.clientHeight;
    });
    expect(o, 'เกม ' + g + ' ล้นการ์ดจนต้องเลื่อน').toBeLessThanOrEqual(2);
  }
  expect(errs).toEqual([]);
});

/* ผู้ใช้แจ้ง 2026-08-12: เล่นเปียโนด้วยโหมดมือไม่ได้ — คีย์ฟัง pointerdown ไม่ได้ฟัง click
   ⇒ hpFire() ต้องยิง pointer event จริงให้ของกลุ่ม HP_POINTER_SEL */
test('เปียโน: ชี้ค้างด้วยโหมดมือแล้วคีย์กดติดจริง', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(()=>window.HouseGames.play({gameId:'music', gradeId:'p3'}));
  await expect(page.locator('#music-piano .music-white').first()).toBeVisible();
  const r = await page.evaluate(async ()=>{
    setHandDwellMode(true);
    const key = document.querySelector('#music-piano .music-white');
    let fired = 0;
    key.addEventListener('pointerdown', ()=>{ fired++; });
    const b = key.getBoundingClientRect();
    const t0 = Date.now();
    while(Date.now()-t0 < 3000 && !fired){
      updateHandCursor(b.left+b.width/2, b.top+b.height*0.8, false);
      await new Promise(r2=>setTimeout(r2,60));
    }
    return {fired, ms: Date.now()-t0};
  });
  console.log('เปียโน+โหมดมือ: ' + JSON.stringify(r));
  expect(r.fired, 'ชี้ค้างบนคีย์เปียโนแล้วต้องกดติด').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});
