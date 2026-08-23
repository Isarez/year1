/* ============================================================
   🔒 ประตูเครื่องมือเทส — ผูกกับ hostname ไม่ใช่สวิตช์ที่คนต้องจำสลับ

   เดิมมีสวิตช์ 5 ตัวที่ต้องตั้งเป็น `false` ทุกครั้งก่อน deploy
   (QB_ENABLED · DEV_ENABLED · MUSIC_PANEL_ENABLED · POS_CHIP_ENABLED · DEV_API_ENABLED)
   ⇒ พลาดมาแล้ว 2 ครั้งในวันเดียว (ลืม POS_CHIP · `git add -A` ดูดค่า dev เข้า commit)

   ตอนนี้ทุกตัวคำนวณจาก `location.hostname` เอง ⇒ **เป็นไปไม่ได้ที่จะ ship ติดขึ้น production**
   ⚠️ ชุดนี้ยิงจาก 2 hostname จริง: `127.0.0.1` (เทส = ต้องเปิด) และ `owlkids.net` (= ต้องปิด)
      ตัวหลังใช้ `page.route()` ดักคำขอแล้วเสิร์ฟไฟล์จากเครื่อง ⇒ `location.hostname` เป็นของจริง
   ============================================================ */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHILD = { id: 'gate', name: 'ประตู', emoji: '🔒', birthDate: '2018-06-01', grade: 'p3' };
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };

const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
               '.svg':'image/svg+xml', '.png':'image/png', '.json':'application/json' };

/* เสิร์ฟไฟล์ในโปรเจคภายใต้ origin ที่กำหนด — ใช้จำลอง production ด้วย hostname จริง */
async function serveAs(page, origin) {
  await page.route(origin + '/**', route => {
    const u = new URL(route.request().url());
    let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory())
      return route.fulfill({ status: 404, body: 'not found' });
    route.fulfill({ body: fs.readFileSync(file),
                    contentType: MIME[path.extname(file)] || 'application/octet-stream' });
  });
}

async function probe(page, url) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, ch]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id,
      JSON.stringify({ v:1, mapV:4, char: ch, tut:{ skip:true } }));
  }, [CHILD, CHAR]);
  await page.goto(url);
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('.h2-mode-house, #house-entry-btn').first().click();
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 60000 });
  await page.waitForTimeout(7000);
  const r = await page.evaluate(() => ({
    host:    location.hostname,
    dbg:     !!window.__houseDbg,
    coinSet: typeof (window.OwlCoins || {}).set === 'function',
    shopDev: typeof (window.HouseShop || {}).devUnlockAll === 'function',
    qb:      !!(window.HouseQB  || {}).enabled,
    dev:     !!(window.HouseDev || {}).enabled,
    /* ปุ่มเครื่องมือในเมนูเฟือง — ของเด็กต้องไม่เห็นเลย
       ⚠ ซ่อนด้วย `style.display='none'` (ไม่ใช่ attribute `hidden`) ⇒ ต้องวัดที่ computed style
         เช็ค `.hidden` แล้วจะได้ false เสมอทั้งที่ปุ่มถูกซ่อนอยู่จริง */
    btns: ['house-qb-btn', 'house-dev-btn', 'house-music-btn']
            .filter(id => { const e = document.getElementById(id);
                            return e && getComputedStyle(e).display !== 'none'; }),
    posChip: !(document.getElementById('house-pos-chip') || {}).hidden,
    /* ของที่เกมจริงใช้ ต้องอยู่ทั้ง 2 ฝั่ง */
    coinAdd: typeof (window.OwlCoins || {}).add === 'function',
    paint:   typeof window.__housePaint === 'function',
  }));
  return { r, errs };
}

test('DG1: รันในเครื่อง (127.0.0.1) — เครื่องมือเทสต้องเปิดครบ', async ({ page }) => {
  const { r, errs } = await probe(page, '/');
  expect(r.host).toBe('127.0.0.1');
  expect(r.dbg, '__houseDbg ต้องมี ไม่งั้นชุดเทสอื่นพังยกแผง').toBe(true);
  expect(r.coinSet && r.shopDev, 'API ของเทสต้องครบ').toBe(true);
  expect(r.qb && r.dev, 'หน้าคลังโจทย์/ปรับค่าต้องเปิด').toBe(true);
  expect(r.coinAdd && r.paint).toBe(true);
  expect(errs).toEqual([]);
});

test('DG2: hostname เป็น owlkids.net — เครื่องมือเทสต้องหายหมด แต่เกมต้องเล่นได้', async ({ page }) => {
  await serveAs(page, 'https://owlkids.net');
  const { r, errs } = await probe(page, 'https://owlkids.net/index.html');
  expect(r.host, 'ต้องเป็น hostname ของ production จริง').toBe('owlkids.net');

  expect(r.dbg,     '__houseDbg ห้ามขึ้น production').toBe(false);
  expect(r.coinSet, 'OwlCoins.set = ตั้งเงินได้ตามใจ ห้ามขึ้น production').toBe(false);
  expect(r.shopDev, 'HouseShop.devUnlockAll = ปลดล็อกทั้งเกม ห้ามขึ้น production').toBe(false);
  expect(r.qb,      'หน้าคลังโจทย์ห้ามเปิด').toBe(false);
  expect(r.dev,     'หน้าปรับค่าต่างๆ ห้ามเปิด').toBe(false);
  expect(r.btns,    'ปุ่มเครื่องมือเทสในเมนูเฟืองห้ามโผล่').toEqual([]);
  expect(r.posChip, 'ป้ายพิกัดห้ามโผล่').toBe(false);

  /* 🔑 เกมของเด็กต้องไม่พังตามไปด้วย */
  expect(r.coinAdd, 'OwlCoins.add เป็นทางจ่ายรางวัลเควสต์ ห้ามหาย').toBe(true);
  expect(r.paint,   '__housePaint คือโหมดช่างภาพ ห้ามหาย').toBe(true);
  expect(errs).toEqual([]);
});

/* ---------------------------------------------------------------- */

/* 🔢 ป้ายนับผู้เข้าชม — ต้องเลือกตัวนับจาก hostname เองเหมือนกัน
   ⚠ ข้อกำหนดจากผู้ใช้: **เทสต้องยิงลงตัวนับทดสอบเสมอ ยอดจริงห้ามขยับ**
     (รันชุดเต็ม 864 เทสวันละหลายรอบ ถ้าโดน counter จริงยอดเพี้ยนถาวร) */
async function badgeSrc(page, url) {
  await page.goto(url);
  await page.waitForFunction(
    () => { const i = document.querySelector('img.visitor-badge'); return i && i.src; },
    null, { timeout: 15000 });
  return page.evaluate(() => {
    const i = document.querySelector('img.visitor-badge');
    return decodeURIComponent(new URL(i.src).searchParams.get('url') || '');
  });
}

test('DG3: ป้ายนับผู้เข้าชม — รันในเครื่องต้องลงตัวนับทดสอบเท่านั้น', async ({ page }) => {
  expect(await badgeSrc(page, '/'), 'หน้าเด็ก').toBe('https://owlkids.net/test');
  expect(await badgeSrc(page, '/teacher/'), 'หน้าครู').toBe('https://owlkids.net/teacher-test');
});

test('DG4: ป้ายนับผู้เข้าชม — hostname เป็น owlkids.net ถึงจะนับของจริง', async ({ page }) => {
  await serveAs(page, 'https://owlkids.net');
  expect(await badgeSrc(page, 'https://owlkids.net/index.html'), 'หน้าเด็ก')
    .toBe('https://owlkids.net');
  expect(await badgeSrc(page, 'https://owlkids.net/teacher/index.html'), 'หน้าครู')
    .toBe('https://owlkids.net/teacher');
});
