// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/* Playwright ของ "นกฮูกสนุกคิด"
   แอปเป็น static ล้วน (ไม่มี build step) จึงเสิร์ฟด้วย python http.server แล้วยิงเทสใส่
   จุดประสงค์หลัก: เป็นตะแกรงกันพลาดเวลา refactor (แยกไฟล์ JS / ยุบสแคฟโฟลด์ engine)
   ไม่ได้ตั้งใจทดสอบ UI ละเอียดทุกพิกเซล */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,          // แอปใช้ localStorage ร่วมกัน รันทีละไฟล์ปลอดภัยกว่า
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8899',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 900 },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    /* จอแท็บเล็ต (กลุ่มผู้ใช้จริงหลักคือ iPad) — ใช้ chromium ที่ติดตั้งอยู่แล้ว
       ไม่ใช้ devices['iPhone 13'] เพราะผูกกับ webkit ที่ต้องโหลดเบราว์เซอร์เพิ่ม */
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, isMobile: false, hasTouch: true } },
  ],
  webServer: {
    command: 'python3 -m http.server 8899',
    url: 'http://127.0.0.1:8899/version',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
