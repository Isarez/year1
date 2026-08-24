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
    /* 🧭 `HousePlay.colLeft` = ช่องของ "ของประจำวันที่ยังไม่ได้เก็บ" ที่ **ลูกศรนำทางของเกมจริงใช้**
       🐞 v3.2.4 เผลอย้ายเข้าไปในบล็อก DEV_ONLY ⇒ บน production เป็น undefined
          ลูกศรจึงไม่ขึ้นเลยทั้งปุ่ม "พาไปเก็บ" และเควสต์เก็บของ — เงียบสนิท ไม่มี error
          และเทสทุกไฟล์รันบน localhost ซึ่งประตู dev เปิดอยู่เสมอ จึงไม่มีใครจับได้ */
    colLeft: typeof (window.HousePlay || {}).colLeft === 'function',
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
  expect(r.colLeft, 'ลูกศรนำทางใช้ HousePlay.colLeft').toBe(true);
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
  expect(r.colLeft, 'HousePlay.colLeft คือช่องของลูกศรนำทาง ห้ามหาย').toBe(true);
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

/* 🕳 DG5 — **หน้าแรก** ก็ต้องไม่มี API โกงหลุด
   🐞 บั๊กที่เจอบน production จริง 2026-08-23: `preloadHouseIfOwned()` โหลดชุดบ้าน
      เบื้องหลังให้เด็กที่มีบ้านอยู่แล้ว ⇒ `HouseShop`/`HouseBook`/`HousePlay` เกิดขึ้นบนหน้าแรก
      แต่ตัวถอด (`lockDevApi`) ผูกกับ "ตอนเข้าเมือง" จึงยังไม่ทำงาน
      ⇒ เด็กเรียก `OwlCoins.set()` / `devUnlockAll()` ได้โดยไม่ต้องเข้าเมืองด้วยซ้ำ
   ⇒ ตอนนี้กันที่ **จุดนิยามของแต่ละโมดูล** แทน ⇒ ไม่มีช่วงเวลาที่หลุดอีก */
test('DG5: หน้าแรกบน owlkids.net (โหลดชุดบ้านเบื้องหลังแล้ว) ต้องไม่มี API โกงหลุด', async ({ page }) => {
  await serveAs(page, 'https://owlkids.net');
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, ch]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id,
      JSON.stringify({ v:1, mapV:4, char: ch, tut:{ skip:true } }));   /* มีบ้าน ⇒ preload ทำงาน */
  }, [CHILD, CHAR]);
  await page.goto('https://owlkids.net/index.html');
  await page.locator('#child-select-view .child-card').first().click();
  /* รอให้ชุดบ้านโหลดเสร็จเบื้องหลัง **โดยยังไม่กดเข้าเมือง** */
  await page.waitForFunction(() => !!window.HouseShop, null, { timeout: 60000 });
  await page.waitForTimeout(3000);

  const r = await page.evaluate(() => ({
    coinSet: typeof (window.OwlCoins || {}).set === 'function',
    shopDev: typeof (window.HouseShop || {}).devUnlockAll === 'function',
    bookDev: typeof (window.HouseBook || {}).devMarkAll === 'function',
    playDev: typeof (window.HousePlay || {}).devGrow === 'function',
    dbg:     !!window.__houseDbg,
    coinAdd: typeof (window.OwlCoins || {}).add === 'function',
  }));
  expect(r.coinSet, 'OwlCoins.set ห้ามหลุดบนหน้าแรก').toBe(false);
  expect(r.shopDev, 'HouseShop.devUnlockAll ห้ามหลุดบนหน้าแรก').toBe(false);
  expect(r.bookDev, 'HouseBook.devMarkAll ห้ามหลุดบนหน้าแรก').toBe(false);
  expect(r.playDev, 'HousePlay.devGrow ห้ามหลุดบนหน้าแรก').toBe(false);
  expect(r.dbg,     '__houseDbg ห้ามหลุดบนหน้าแรก').toBe(false);
  expect(r.coinAdd, 'OwlCoins.add ต้องยังอยู่ (เกมจริงใช้)').toBe(true);
  expect(errs).toEqual([]);
});

/* 🕸 DG6 — **ตะแกรงกันทั้งตระกูล**: ของที่ถูกกันไว้ให้เครื่องมือเทส ต้องไม่มีใครในเกมจริงเรียกใช้

   🐞 บั๊กที่ผู้ใช้เจอ 2026-08-24: `HousePlay.colLeft` (ช่องของลูกศรนำทาง) ถูกย้ายเข้าบล็อก
      DEV_ONLY ตอนทำประตูเครื่องมือเทส ⇒ บน production เป็น undefined ⇒ **ลูกศรไม่ขึ้นเลย**
      แบบเงียบสนิท (`(P && P.colLeft) ? … : []` กลืน error ให้เรียบร้อย)
      ⇒ เทสรายตัวจับไม่ได้ เพราะทุกไฟล์รันบน localhost ที่ประตู dev เปิดอยู่เสมอ

   วิธีคุม: เทียบ "คีย์ที่มีตอนรันในเครื่อง" กับ "คีย์ที่มีบน production" ⇒ ได้รายชื่อของที่ถูกกันไว้
   แล้วไล่ดูซอร์สว่ามีไฟล์ของ **เกมจริง** เรียก `.<คีย์>` อยู่ไหม (ไฟล์เครื่องมือเทสเรียกได้ตามปกติ)
   ⚠ ใช้ **หน้าแรก** ทั้ง 2 ฝั่ง ไม่ต้องเข้าเมือง — ชุดบ้านถูกโหลดเบื้องหลังอยู่แล้ว (ดู DG5) */
test('DG6: ของที่ปิดไว้ให้เครื่องมือเทส ต้องไม่มีโค้ดของเกมจริงเรียกใช้', async ({ page }) => {
  const MODS = ['HousePlay', 'HouseShop', 'HouseBook'];
  /* ไฟล์ที่ "เป็นเครื่องมือเทสอยู่แล้ว" — เรียกของ dev ได้ ไม่นับเป็นความผิด */
  const DEV_FILES = ['house-devtools.js', 'house-qbrowse.js'];

  const keysOn = async (url) => {
    await page.addInitScript(([c, ch]) => {
      localStorage.setItem('p1quiz_children', JSON.stringify([c]));
      localStorage.setItem('p1quiz_active_child', c.id);
      localStorage.setItem('p1quiz_music', 'off');
      localStorage.setItem('p1quiz_house_' + c.id,
        JSON.stringify({ v: 1, mapV: 4, char: ch, tut: { skip: true } }));
    }, [CHILD, CHAR]);
    await page.goto(url);
    await page.locator('#child-select-view .child-card').first().click();
    await page.waitForFunction(() => !!window.HousePlay && !!window.HouseShop && !!window.HouseBook,
                               null, { timeout: 60000 });
    await page.waitForTimeout(2500);
    return page.evaluate(ms => { const o = {};
      ms.forEach(m => { o[m] = Object.keys(window[m] || {}); }); return o; },
      ['HousePlay', 'HouseShop', 'HouseBook']);
  };

  const local = await keysOn('/');
  await serveAs(page, 'https://owlkids.net');
  const prod = await keysOn('https://owlkids.net/index.html');

  const files = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js'));
  const bad = [];
  MODS.forEach(m => {
    const gated = local[m].filter(k => prod[m].indexOf(k) < 0);
    expect(gated.length, m + ' ต้องมีของที่ปิดไว้ให้เครื่องมือเทสอยู่บ้าง (ไม่งั้นเทียบผิดฝั่ง)')
      .toBeGreaterThan(0);
    gated.forEach(k => {
      files.forEach(f => {
        if (DEV_FILES.indexOf(f) >= 0) return;
        const src = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')
                      .replace(/\/\*[\s\S]*?\*\//g, '');        /* ตัดคอมเมนต์ กันชื่อในคำอธิบาย */
        /* ตัวไฟล์ที่นิยามเองเรียกภายในได้ (คนละตัวกับ export) — สนใจเฉพาะการเรียกข้ามไฟล์ */
        const re = new RegExp('(HousePlay|HouseShop|HouseBook|\\bP|\\bPL|\\bS|\\bSHOP|\\bC)\\s*\\.\\s*'
                              + k + '\\b');
        if (re.test(src)) bad.push(f + ' เรียก ' + m + '.' + k);
      });
    });
  });
  expect(bad, '⛔ โค้ดของเกมจริงเรียกของที่ถูกปิดไว้บน production ⇒ ฟีเจอร์นั้นตายเงียบๆ')
    .toEqual([]);
});
