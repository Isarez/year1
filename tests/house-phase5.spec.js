/* ============================================================
   เฟส 5 — กลไกกลุ่ม C: ยืม engine เกมของหน้าหลักมาเล่นในการ์ดเควสต์
   ไม่ได้เขียนเกมใหม่ · ตัวจริงอยู่ js/games-*.js ห่อด้วย js/owl-games.js
   ============================================================ */
const { test, expect } = require('@playwright/test');
const CHILD = { id: 'p5a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function house(page){
  const errs=[]; page.on('pageerror', e=>errs.push(String(e)));
  await page.addInitScript(c=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music','off');
    localStorage.setItem('p1quiz_house_p5a', JSON.stringify({v:1,mapV:3,
      char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0}}));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
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
  expect(r.cnt.quiz/total).toBeGreaterThan(0.35);
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
