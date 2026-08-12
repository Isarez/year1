/* ตัวช่วยร่วมของทุกเทส — เข้าแอปแล้วเลือกโปรไฟล์เด็กให้เรียบร้อยก่อนเริ่มทดสอบ */
const CHILD = { name: 'เทสอัตโนมัติ', emoji: '🦉' };

/** เปิดแอปพร้อมโปรไฟล์เด็ก 1 คน (seed ลง localStorage ก่อนสคริปต์รัน) */
async function openApp(page, { grade = null, birthYear = 2016 } = {}) {
  await page.addInitScript(({ child, by }) => {
    const id = 'test-child-1';
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id, name: child.name, emoji: child.emoji, birthDate: by + '-01-15' }
    ]));
    localStorage.setItem('p1quiz_active_child', id);
    localStorage.setItem('p1quiz_music', 'off');   // ปิดเพลงกันเสียงรบกวน/AudioContext
  }, { child: CHILD, by: birthYear });

  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await page.waitForFunction(() => typeof CATS !== 'undefined' && typeof window.renderHome === 'function');
  // แอปเปิดมาที่หน้าเลือกโปรไฟล์เสมอ — กดการ์ดเด็กที่ seed ไว้เพื่อเข้าหน้าหลัก
  const cardSel = '#child-select-view .child-card';
  if (await page.locator(cardSel).count()) {
    await page.locator(cardSel).first().click();
    /* ⚠ เมื่อโหมดบ้านเปิดอยู่ (branch feature/house-owl) เลือกเด็กแล้วจะเจอ **หน้าเลือกทาง**
       (`#landing-view` จาก js/app-landing.js) คั่นก่อน ไม่ได้เข้าหน้าหมวดตรงๆ เหมือนตอน
       โหมดบ้านปิด ⇒ ต้องกดการ์ด "ทำโจทย์" ต่ออีกที ไม่งั้นรอ home-view จนหมดเวลา
       (หนี้ค้างจากงานก่อนเฟส 5 · ทำให้ smoke/curriculum/engines แดงยกแผง 22 เทส · แก้ 2026-08-12) */
    const landing = page.locator('#landing-quiz');
    if (await landing.isVisible().catch(() => false)) await landing.click();
    await page.waitForFunction(() => !document.getElementById('home-view').hidden);
  }
  if (grade) {
    await page.evaluate(g => { selectedGrade = g; window.renderHome(); }, grade);
  }
  return errors;
}

/** id ของ section ที่กำลังแสดงอยู่ (ต้องเหลือทีละ 1 เสมอ) */
function visibleViews(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('section')).filter(s => !s.hidden).map(s => s.id));
}

/** เริ่มเกมจาก id หมวด โดยเรียก dispatcher เดียวกับที่การ์ดใช้ */
async function startCat(page, catId) {
  return page.evaluate(async id => {
    const c = CATS.find(x => x.id === id);
    if (!c) throw new Error('ไม่พบหมวด ' + id);
    if (c.type === 'ar') return 'ar-skip';          // เกม AR ต้องใช้กล้อง ข้ามใน headless
    if (c.type === 'listen') {
      await (c.mode === 'cloze' ? window.startClozeGame(id) : window.startListenGame(id));
      return c.mode === 'cloze' ? 'cloze' : 'listen';
    }
    if (c.type === 'write') { window.startDotsGame(id); return 'dots'; }
    if (c.type !== 'skill') { window.startQuiz(id); return 'quiz'; }
    /* type skill: แยกตาม mode เหมือน dispatcher ของการ์ดใน app.js (default = จับคู่ความจำ) */
    const f = {
      memory: 'startMemoryGame', shadow: 'startShadowGame', mix: 'startMixGame', music: 'startMusicGame',
      clock: 'startClockGame', ef: 'startEfGame', code: 'startCodeGame', science: 'startScienceGame',
      money: 'startMoneyGame', fraction: 'startFractionGame', balance: 'startBalanceGame',
      calendar: 'startCalendarGame', timeline: 'startTimelineGame', sort: 'startSortGame',
      world: 'startWorldGame', coord: 'startCoordGame', chart: 'startChartGame', area: 'startAreaGame',
      angle: 'startAngleGame', circuit: 'startCircuitGame', tangram: 'startTangramGame',
      mirror: 'startMirrorGame', order: 'startOrderGame',
    };
    const fn = f[c.mode] || 'startMemoryGame';
    if (typeof window[fn] !== 'function') throw new Error('ไม่มี engine ' + fn + ' (mode ' + c.mode + ')');
    window[fn](id);
    return c.mode || 'memory';
  }, catId);
}

module.exports = { openApp, visibleViews, startCat, CHILD };
