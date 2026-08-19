const { test } = require('@playwright/test');
const CHILD = { id: 'ico2', name: 'ไอคอน', emoji: '🎨', birthDate: '2018-06-01', grade: 'p3' };
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* โฟลเดอร์ผลลัพธ์อยู่ใน repo ⇒ รันได้ทุกเครื่อง (test-results/ ถูก ignore อยู่แล้ว) */
const DIR = require('path').join(__dirname, '..', 'test-results', 'shots') + '/';
require('fs').mkdirSync(DIR, { recursive: true });
/* ชื่อไทยของแต่ละไอคอน เพื่อรีวิวว่า "รูปตรงกับชื่อไหม" */
test('sheets', async ({ page }) => {
  await page.addInitScript(([c, ch]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({ v: 1, mapV: 4, char: ch }));
  }, [CHILD, CHAR]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseIcons, null, { timeout: 30000 });
  const pages = await page.evaluate(() => {
    const names = {};
    (window.HousePlay.FISH || []).forEach(f => names['fish-' + f.id] = f.n);
    (window.HousePlay.SEEDS || []).forEach(s => names['seed-' + s.id] = s.n);
    (window.HouseBook.CRITTERS || []).forEach(c => names['critter-' + c.id] = c.n);
    (window.HousePetCare.TRICKS || []).forEach(t => names['trick-' + t.id] = t.name);
    (window.HousePetCare.FOOD || []).forEach(f => names['food-' + f.id] = f.name);
    (window.HouseShop.PET_TOYS || []).forEach(t => names['toy-' + t.id] = t.name);
    (window.HouseShop.PET_COLLARS || []).forEach(c => names['collar-' + c.id] = c.name);
    window.__icoNames = names;
    return window.HouseIcons.ids().length;
  });
  const ids = await page.evaluate(() => window.HouseIcons.ids());
  const per = 24;
  for (let p0 = 0; p0 * per < ids.length; p0++) {
    await page.evaluate(([slice, names]) => {
      const old = document.getElementById('icon-sheet'); if (old) old.remove();
      const wrap = document.createElement('div');
      wrap.id = 'icon-sheet';
      wrap.style.cssText = 'position:fixed;inset:0;background:#FFF8EC;z-index:9999;overflow:hidden;padding:14px;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start';
      slice.forEach(id => {
        const d = document.createElement('div');
        d.style.cssText = 'width:190px;display:flex;flex-direction:column;align-items:center;gap:4px;font:700 13px/1.25 sans-serif;color:#5b4a35;background:#fff;border-radius:14px;padding:10px 4px';
        d.innerHTML = window.HouseIcons.html(id, 64)
          + '<span>' + (names[id] || id.replace(/^[a-z]+-/, '')) + '</span>'
          + '<span style="font-size:10px;color:#a08f78">' + id + '</span>';
        wrap.appendChild(d);
      });
      document.body.appendChild(wrap);
    }, [ids.slice(p0 * per, p0 * per + per), await page.evaluate(() => window.__icoNames)]);
    await page.waitForTimeout(250);
    await page.screenshot({ path: DIR + 'sheet-' + p0 + '.png' });
  }
  console.log('pages:', Math.ceil(ids.length / per));
});
