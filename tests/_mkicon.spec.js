/* 🔧 เครื่องมือสร้างไฟล์ PNG ของไอคอนแอปจาก assets/app-icon.svg
   ⚠ **ไม่ใช่เทส** (ไฟล์ขึ้นต้นด้วย `_` ถูกกันออกด้วย testIgnore) — รันมือเมื่อแก้ไอคอน:
       npx playwright test --config=<override ที่ไม่มี testIgnore> tests/_mkicon.spec.js
   เหตุผลที่ไม่ใช้ `rsvg-convert` ตามที่ CLAUDE.md เคยเขียนไว้: เครื่องไม่มีแล้ว
   ⇒ เรนเดอร์ด้วย chromium ที่ playwright ติดตั้งไว้อยู่แล้ว ไม่ต้องลงเครื่องมือเพิ่ม */
const { test } = require('@playwright/test');
const fs = require('fs');
const SIZES = [[180,'apple-touch-icon.png'], [192,'icon-192.png'], [512,'icon-512.png']];
test('make icons', async ({ page }) => {
  const svg = fs.readFileSync('assets/app-icon.svg', 'utf8');
  for(const [n, name] of SIZES){
    await page.setViewportSize({width:n, height:n});
    await page.setContent('<style>html,body{margin:0;padding:0}svg{display:block}</style>'
      + svg.replace(/width="\d+" height="\d+"/, 'width="'+n+'" height="'+n+'"'));
    const buf = await page.locator('svg').screenshot({omitBackground:false});
    fs.writeFileSync('assets/' + name, buf);
    console.log('เขียน assets/' + name, n + 'px', buf.length + ' ไบต์');
  }
});
