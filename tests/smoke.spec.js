const { test, expect } = require('@playwright/test');
const { openApp, visibleViews, clickEnterQuiz } = require('./helpers');

test.describe('โหลดแอปและหน้าหลัก', () => {
  test('เปิดแอปได้ ไม่มี error และมีหมวดครบตามข้อมูล', async ({ page }) => {
    const errors = await openApp(page);
    const counts = await page.evaluate(() => {
      const per = {};
      CATS.forEach(c => { const g = c.grade || 'prep'; per[g] = (per[g] || 0) + 1; });
      return { total: CATS.length, per, views: ALL_VIEWS.length };
    });
    expect(counts.total).toBeGreaterThan(300);
    expect(counts.views).toBeGreaterThan(25);
    expect(await visibleViews(page)).toEqual(['home-view']);
    expect(errors).toEqual([]);
  });

  test('ไม่โหลดไฟล์ 3D ตอนเปิดแอปครั้งแรก (lazy-load)', async ({ page }) => {
    await openApp(page);
    const state = await page.evaluate(() => ({
      three: typeof window.THREE,
      house: typeof window.startHouseGame,
      scripts: Array.from(document.querySelectorAll('script[src]')).map(s => s.src.split('/').pop()),
    }));
    expect(state.three).toBe('undefined');
    expect(state.house).toBe('undefined');
    expect(state.scripts.join(' ')).not.toContain('three.min.js');
  });

  test('ทุกไฟล์ที่หน้าเว็บอ้างถึงต้องมีอยู่จริง และไม่มี CDN ของ MediaPipe', async ({ page, baseURL }) => {
    const bad = [];
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await openApp(page);
    const html = await page.content();
    expect(html).not.toContain('cdn.jsdelivr.net');
    // ไฟล์ MediaPipe ต้องเสิร์ฟได้จากในโปรเจค
    for (const f of ['js/vendor/mediapipe/hands/hands.js',
                     'js/vendor/mediapipe/camera_utils/camera_utils.js',
                     'js/vendor/three.min.js']) {
      const res = await page.request.head(baseURL + '/' + f);
      expect(res.status(), f).toBe(200);
    }
    expect(bad).toEqual([]);
  });

  /* ปุ่มโหลดเวอร์ชันใหม่ — แก้ปัญหา iPad ที่ Add to Home Screen แล้วค้าง index.html เก่าใน cache
     (ไม่มี service worker) ปุ่มต้องมีเฉพาะหน้าเลือกเด็ก และต้องพาไป URL ใหม่จริง ไม่ใช่แค่ reload เฉยๆ */
  test('ปุ่มโหลดเวอร์ชันใหม่: โชว์เฉพาะหน้าเลือกเด็ก และบังคับดึง index.html ใหม่', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('p1quiz_children', JSON.stringify([
        { id: 'c1', name: 'เทส', emoji: '🦉', birthDate: '2016-01-15' }]));
      localStorage.setItem('p1quiz_music', 'off');
    });
    await page.goto('/');
    await expect(page.locator('#reload-btn')).toBeVisible();          // หน้าเลือกเด็ก → เห็น

    await page.locator('#child-select-view .child-card').first().click();
    /* branch นี้เปิดโหมดบ้านไว้ ⇒ เลือกเด็กแล้วแวะหน้าเลือกโหมดก่อน (บน main ที่ปิดไว้จะข้ามไปเลย)
       เทสนี้ยกมาจาก main ตอน merge v2.0.2 จึงตกขั้นนี้ไป — ต้องรองรับทั้ง 2 ฝั่ง */
    await clickEnterQuiz(page);
    await expect(page.locator('#home-view')).toBeVisible();
    await expect(page.locator('#reload-btn')).toBeHidden();           // หน้าหลัก → ซ่อน

    await page.locator('#switch-child-btn').click();
    await expect(page.locator('#reload-btn')).toBeVisible();          // กลับมา → เห็นอีก

    await page.locator('#reload-btn').click();
    await page.waitForURL(/\?r=\d+/, { timeout: 10000 });             // ต้องเปลี่ยน URL จริง
    await expect(page.locator('#child-select-view')).toBeVisible();
    // ข้อมูลเด็กอยู่ใน localStorage ต้องไม่หายไปกับการรีโหลด
    expect(await page.locator('#child-select-view .child-card').count()).toBe(1);
  });

  test('การ์ดหมวดทุกใบสูงเท่ากันและไม่มี scroll แนวนอน', async ({ page }) => {
    await openApp(page);
    for (const g of ['prep-p1', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6']) {
      const r = await page.evaluate(grade => {
        selectedGrade = grade; window.renderHome();
        const cards = Array.from(document.querySelectorAll('.cat-card'));
        const hs = [...new Set(cards.map(c => Math.round(c.getBoundingClientRect().height)))];
        return { grade, cards: cards.length, heights: hs };
      }, g);
      expect(r.cards, g + ' ต้องมีการ์ด').toBeGreaterThan(0);
      expect(r.heights.length, g + ' การ์ดสูงไม่เท่ากัน: ' + r.heights.join('/')).toBe(1);
    }
  });

  /* 🦉 ไอคอนแอปบนหน้าจอโฮม (ผู้ใช้แจ้ง 2026-08-22 หลังลงบน iPad จริง)
     ① iOS ครอบไอคอนด้วยมุมโค้ง ⇒ วาดชนขอบแล้วหูนกฮูกโดนตัด
     ② apple-touch-icon ที่พื้นโปร่งใส iOS จะถมด้วยสีดำ ⇒ ต้องมีพื้นทึบ */
  test('ไอคอนแอป: ต้องมีพื้นทึบและเว้นขอบให้พ้นมุมโค้งของ iOS', async ({ page, baseURL }) => {
    for(const f of ['assets/apple-touch-icon.png', 'assets/icon-192.png', 'assets/icon-512.png',
                    'assets/app-icon.svg']){
      const res = await page.request.get(baseURL + '/' + f);
      expect(res.status(), f).toBe(200);
    }
    /* ตรวจพื้นทึบ + ระยะขอบ ด้วยการอ่านพิกเซลจริงจากรูป */
    await page.goto('/');
    const r = await page.evaluate(async () => {
      const img = new Image();
      await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = 'assets/icon-512.png'; });
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const at = (px, py) => { const i = (py * c.width + px) * 4; return [d[i], d[i+1], d[i+2], d[i+3]]; };
      /* หาขอบเขตของ "สิ่งที่ไม่ใช่พื้นหลัง"
         ⚠ พื้นหลังเป็น **เกรเดียนต์แนวตั้ง** ⇒ เทียบกับสีมุมเดียวไม่ได้ ต้องเทียบกับ
           สีพื้นของ "แถวเดียวกัน" (อ่านจากคอลัมน์ริมซ้ายของแถวนั้น) */
      let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
      const alphaCorner = at(2, 2)[3];
      for(let py = 0; py < c.height; py += 2){
        const bg = at(1, py);
        const near = p => Math.abs(p[0]-bg[0]) + Math.abs(p[1]-bg[1]) + Math.abs(p[2]-bg[2]) < 40;
        for(let px = 0; px < c.width; px += 2){
        if(near(at(px, py))) continue;
        if(px < minX) minX = px; if(px > maxX) maxX = px;
        if(py < minY) minY = py; if(py > maxY) maxY = py;
      }}
      return {w:c.width, alphaCorner, minX, minY, maxX, maxY};
    });
    expect(r.alphaCorner, 'พื้นหลังต้องทึบ (ไม่งั้น iOS ถมดำ)').toBe(255);
    /* เนื้อไอคอนต้องเว้นขอบอย่างน้อย ~7% ของด้าน ทุกด้าน */
    const pad = r.w * 0.07;
    expect(r.minX, 'ขอบซ้าย').toBeGreaterThan(pad);
    expect(r.minY, 'ขอบบน').toBeGreaterThan(pad);
    expect(r.w - r.maxX, 'ขอบขวา').toBeGreaterThan(pad);
    expect(r.w - r.maxY, 'ขอบล่าง').toBeGreaterThan(pad);
  });
});
