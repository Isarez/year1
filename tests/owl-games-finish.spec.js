/* ============================================================
   🔌 สัญญา Mount — **ทุกเกมที่ลงทะเบียนกับ OwlGames ต้องส่งผลกลับโฮสต์ได้**

   🐞 บั๊กจริงที่ผู้ใช้แจ้ง 2026-08-22: **เกมนาฬิกาบนกระดานเควสต์ ตอบข้อสุดท้ายแล้วค้าง**
      ต้นเหตุ: `finishClockGame()` มีหน้าสรุปของตัวเอง **ไม่ได้วิ่งผ่าน `finishP2Game()`**
      จึงไม่มีตะเข็บ `reportGameResult()` ⇒ ตอนถูกยืมไปเล่นในการ์ดเควสต์ มันไปสั่ง
      `showOnlyView(resultView)` ของหน้าหลัก ซึ่งอยู่ใน `<main>` **หลังฉากเมือง**
      (`#house-view` z-index 70) ⇒ เด็กเห็นการ์ดค้างไม่ไปไหน

   ⇒ เทสนี้ไล่ตรวจ **ทุกเกมที่ลงทะเบียน** ไม่ใช่แค่ตัวที่อยู่ใน ALLOW ตอนนี้
     เพราะวันหลังมีคนใส่เกมเข้า ALLOW เพิ่ม แล้วบั๊กเดิมจะกลับมาเงียบๆ
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'og9', name: 'เทสเกม', emoji: '🎮', birthDate: '2014-06-01', grade: 'p5' };

async function app(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
  }, CHILD);
  await page.goto('/');
  await page.waitForFunction(() => !!window.OwlGames, null, { timeout: 20000 });
  return errs;
}

test('OG1: ทุกเกมที่ลงทะเบียนต้องมีตะเข็บส่งผลกลับโฮสต์ (ไม่งั้นการ์ดเควสต์ค้าง)', async ({ page }) => {
  await app(page);
  const ids = await page.evaluate(() => window.OwlGames.list());
  expect(ids.length, 'ต้องมีเกมลงทะเบียนไว้').toBeGreaterThanOrEqual(20);

  /* หาไฟล์ที่มีฟังก์ชัน finish ของแต่ละเกม แล้วตรวจว่ามีตะเข็บก่อนเปิดหน้าสรุปของหน้าหลัก */
  const files = ['js/games-math.js', 'js/games-think.js', 'js/games-art.js',
                 'js/games-code.js', 'js/games-write.js'];
  const bad = [];
  for(const f of files){
    let src = await (await page.request.get('/' + f)).text();
    /* ⚠ **ต้องตัดคอมเมนต์ออกก่อนสแกน** — คอมเมนต์อธิบายบั๊กมีคำว่า showOnlyView(resultView)
       อยู่ในเนื้อความ ทำให้หาเจอ "ก่อน" บรรทัดตะเข็บจริง แล้วรายงานผิดว่าไม่มีตะเข็บ */
    src = src.replace(/\/\*[\s\S]*?\*\//g, ' ');
    const re = /^function (finish[A-Za-z0-9]+)\(\)\{/gm;
    let m;
    while((m = re.exec(src))){
      const from = m.index;
      const at = src.indexOf('showOnlyView(resultView)', from);
      if(at < 0 || at - from > 1600) continue;       /* ฟังก์ชันนี้ไม่ได้เปิดหน้าสรุปของหน้าหลัก */
      const head = src.slice(from, at);
      /* `finishP2Game` เองคือเจ้าของตะเข็บ — เรียก OwlGames.handleFinish ตรงๆ */
      if(head.includes('reportGameResult(') || head.includes('OwlGames.handleFinish')) continue;
      bad.push(f.split('/').pop() + ' → ' + m[1]);
    }
  }
  expect(bad, 'เกมที่จะทำให้การ์ดเควสต์ค้าง (ต้องเรียก reportGameResult() ก่อน showOnlyView)').toEqual([]);
});

test('OG2: เกมนาฬิกาเล่นจนจบในโฮสต์อื่นแล้วต้องส่งผลกลับ ไม่เด้งหน้าสรุปของหน้าหลัก', async ({ page }) => {
  const errs = await app(page);
  const r = await page.evaluate(async () => {
    /* จำลองโฮสต์ (แบบเดียวกับที่การ์ดเควสต์ทำ) แล้วเล่นเกมนาฬิกาจนจบ */
    const host = document.createElement('div');
    host.id = 'og-clock-host';
    document.body.appendChild(host);
    let got = null;
    const cat = (typeof CATS !== 'undefined' ? CATS : []).find(c => c.mode === 'clock');
    if(!cat) return {noCat:true};
    selectedGrade = cat.grade || 'p1';
    const ok = window.OwlGames.mount('clock', host, {catId: cat.id, onDone: res => { got = res; }});
    if(!ok) return {noMount:true};
    await new Promise(r2 => setTimeout(r2, 300));
    /* บังคับให้ถึงด่านสุดท้ายแล้วจบเกมผ่านทางเดินโค้ดจริง */
    clockGame.level = clockGame.totalLevels;
    finishClockGame();
    await new Promise(r2 => setTimeout(r2, 300));
    return {
      got,
      resultShown: !document.getElementById('result-view').hidden,
      stillMounted: !!window.OwlGames.current(),
    };
  });
  expect(r.noCat, 'ต้องมีหมวดเกมนาฬิกาในคลัง').toBeFalsy();
  expect(r.noMount, 'ต้อง mount เกมนาฬิกาได้').toBeFalsy();
  expect(r.got, 'โฮสต์ต้องได้รับผลลัพธ์ (ไม่งั้นการ์ดค้าง)').toBeTruthy();
  expect(r.got.gameId).toBe('clock');
  expect(r.resultShown, 'ห้ามเด้งหน้าสรุปของหน้าหลักทับ').toBe(false);
  expect(r.stillMounted, 'ต้องถูก unmount หลังส่งผลแล้ว').toBe(false);
  expect(errs).toEqual([]);
});
