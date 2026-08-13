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
  /* ⚠️ **เคยลองจูนความเร็วแล้ว 2 ทาง เมื่อ 2026-08-13 — ทั้งคู่ไม่คุ้ม อย่าลองซ้ำ**
     ① `--use-angle=metal` (บังคับ chromium ใช้ GPU จริงแทน SwiftShader)
        → **เร็วขึ้น 6.5 เท่า** (ชุดเต็ม 42 → 6.9 นาที · CPU/worker 682% → 133%)
        → **แต่ทำ 6 เทสแดง**: hand-play ในบ้าน 2 · ลากของลงถัง 3 · แถบบนคลิกทะลุ 1
          (เทสพวกนี้คุมพฤติกรรมจริงที่ผู้ใช้เจอ **ห้ามแก้เทสให้เข้ากับ flag ของ harness**)
     ② `workers: 4` (ขนานระดับไฟล์)
        → ได้แค่ 9.4 → 7.6 นาที เพราะ SwiftShader กิน ~7 core ต่อ worker อยู่แล้ว (CPU ตัน 804%)
        → แถมทำเทส hand-play หลุด timeout แบบสุ่ม (โดนแย่ง CPU)
     ⇒ สรุป: คอขวดคือ **การเรนเดอร์ WebGL ด้วย CPU** ถ้าจะเร่งจริงต้องแก้ที่ตรงนั้น
       (เช่นโหมดเทสที่ลดขนาด canvas/หรี่ลูปวาด) ไม่ใช่เพิ่ม worker หรือสลับ backend กราฟิก */
  fullyParallel: false,          // แอปใช้ localStorage ร่วมกัน รันทีละไฟล์ปลอดภัยกว่า
  workers: Number(process.env.PW_WORKERS) || 1,
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
