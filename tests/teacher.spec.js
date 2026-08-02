const { test, expect } = require('@playwright/test');

/* โหมดคุณครู (teacher/) — หน้าแยกที่ใช้ "โค้ดกลาง" js/shared/*.js ร่วมกับหน้าเด็ก
   เทสชุดนี้มีไว้กันพลาดเวลาแก้โค้ดกลางแล้วหน้าครูพังโดยไม่รู้ตัว */

async function openTeacher(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => {
    localStorage.setItem('owlkids_teacher_profile', JSON.stringify({ name: 'ครูเทส', school: 'โรงเรียนเทสอัตโนมัติ', emoji: '🦉' }));
    localStorage.setItem('p1quiz_music', 'off');
  });
  await page.goto('/teacher/');
  await page.waitForFunction(() => typeof window.showToast === 'function');
  return errors;
}

test('หน้าครูเปิดได้ ไม่มี error และเห็นโค้ดกลางครบ', async ({ page }) => {
  const errors = await openTeacher(page);
  const has = await page.evaluate(() => ['showToast', 'setTheme', 'shuffleArray', 'playClick', 'playCongrats',
    'renderPianoKeys', 'playPianoNote', 'pickThaiVoice', 'drawCartoonHand', 'stopARGame']
    .filter(n => typeof window[n] !== 'function'));
  expect(has).toEqual([]);          // ฟังก์ชันกลางต้องมาถึงหน้าครูครบทุกตัว
  expect(errors).toEqual([]);
});

test('หน้าครู: สลับธีมกลางวัน/กลางคืนได้ และจำค่าไว้ที่ key เดียวกับหน้าเด็ก', async ({ page }) => {
  await openTeacher(page);
  const before = await page.evaluate(() => document.body.classList.contains('night-mode'));
  await page.click('#theme-toggle');
  const after = await page.evaluate(() => ({
    night: document.body.classList.contains('night-mode'),
    saved: localStorage.getItem('p1quiz_theme'),
  }));
  expect(after.night).toBe(!before);
  expect(after.saved).toBe(after.night ? 'night' : 'day');
});

test('หน้าครู: เข้าหน้าหลักของครูแล้วเปิดฟอร์มสร้างเกมได้', async ({ page }) => {
  const errors = await openTeacher(page);
  await page.waitForFunction(() => !document.getElementById('teacher-home-view').hidden);
  await page.click('#teacher-add-big-btn');   // ครูใหม่ยังไม่มีโจทย์ → ปุ่มเพิ่มโจทย์ใบใหญ่
  await expect(page.locator('#builder-view')).toBeVisible();
  expect(errors).toEqual([]);
});
