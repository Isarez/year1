const { test } = require('@playwright/test');
const CHILD = { id: 'ico2', name: 'ไอคอน', emoji: '🎨', birthDate: '2018-06-01', grade: 'p3' };
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* โฟลเดอร์ผลลัพธ์อยู่ใน repo ⇒ รันได้ทุกเครื่อง (test-results/ ถูก ignore อยู่แล้ว) */
const DIR = require('path').join(__dirname, '..', 'test-results', 'shots') + '/';
require('fs').mkdirSync(DIR, { recursive: true });
const LIST = (process.env.ICO_LIST || 'fish-nil,fish-squid,fish-octopus,fish-conch,fish-seahorse,fish-puffer,fish-shrimp,fish-snail,food-meat,food-hay,ui-teach,collar-bone,critter-sheep,trick-roll,fish-seaturtle,fish-flat').split(',');
test('zoom', async ({ page }) => {
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
  await page.evaluate((ids) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;background:#FFF8EC;z-index:9999;overflow:hidden;padding:14px;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start';
    ids.forEach(id => {
      const d = document.createElement('div');
      d.style.cssText = 'width:290px;display:flex;flex-direction:column;align-items:center;gap:4px;font:700 13px sans-serif;color:#5b4a35;background:#fff;border-radius:14px;padding:8px';
      d.innerHTML = window.HouseIcons.html(id, 150) + '<span style="font-size:11px">' + id + '</span>';
      wrap.appendChild(d);
    });
    document.body.appendChild(wrap);
  }, LIST);
  await page.waitForTimeout(250);
  await page.screenshot({ path: DIR + (process.env.ICO_OUT || 'zoom') + '.png' });
});
