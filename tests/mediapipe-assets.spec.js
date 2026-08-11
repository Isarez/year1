/* ============================================================
   MediaPipe Hands — ไฟล์ที่ self-host ไว้ต้องครบจริง

   ทำไมต้องมีเทสนี้
   ----------------
   ตอน self-host MediaPipe (2026-07-30) ดาวน์โหลดมาไม่ครบ — **ขาด `hands.binarypb`**
   (ตัวกราฟของโมเดล) ผลคือ wasm โหลดสำเร็จ กล้องติด หลอดไฟกล้องขึ้น แต่พอจะเริ่มประมวลผล
   มันจะ `Check failed: tempConfig.ParseFromString(binary_graph)` แล้ว abort ⇒
   **ไม่เคยตรวจจับมือได้เลยทั้งเกม AR และโหมดมือ ตั้งแต่วันนั้นถึง 2026-08-11**
   และอาการที่เห็นคือ "เปิดกล้องแล้วมือไม่ขึ้น" เฉยๆ ไม่มี error ให้เห็นบนหน้าจอ

   ⚠ ห้ามเปลี่ยนไปโหลดจาก CDN เพื่อแก้ปัญหานี้ — โปรเจคนี้ต้อง self-host ทุกไลบรารี
   ============================================================ */
const { test, expect } = require('@playwright/test');

/* ไฟล์ที่ `hands.js` ร้องขอตอนทำงานจริง (ชื่อไฟล์อยู่ในตัว hands.js เอง)
   ⚠ `hand_landmark_full.tflite` จะถูกใช้ก็ต่อเมื่อตั้ง modelComplexity:1 — ตอนนี้ทั้งแอปใช้ 0 (lite)
     ถ้าวันไหนเปลี่ยนเป็น 1 ต้องดาวน์โหลดไฟล์นั้นมาเพิ่มด้วย ไม่งั้นเจอบั๊กเดิมซ้ำ */
const NEED = [
  'js/vendor/mediapipe/hands/hands.js',
  'js/vendor/mediapipe/hands/hands.binarypb',
  'js/vendor/mediapipe/hands/hand_landmark_lite.tflite',
  'js/vendor/mediapipe/hands/hands_solution_packed_assets.data',
  'js/vendor/mediapipe/hands/hands_solution_packed_assets_loader.js',
  'js/vendor/mediapipe/hands/hands_solution_simd_wasm_bin.js',
  'js/vendor/mediapipe/hands/hands_solution_simd_wasm_bin.wasm',
  'js/vendor/mediapipe/hands/hands_solution_wasm_bin.js',
  'js/vendor/mediapipe/hands/hands_solution_wasm_bin.wasm',
  'js/vendor/mediapipe/camera_utils/camera_utils.js',
];

test('ไฟล์ MediaPipe ที่ self-host ไว้ต้องมีครบทุกตัว', async ({ request }) => {
  const missing = [];
  for (const p of NEED) {
    const r = await request.get('/' + p);
    if (!r.ok()) missing.push(p + ' → HTTP ' + r.status());
  }
  expect(missing, 'ไฟล์ MediaPipe หาย — โหมดมือ/เกม AR จะเปิดกล้องได้แต่ไม่เจอมือ').toEqual([]);
});

test('ห้ามมีโค้ดไหนโหลด MediaPipe จาก CDN (ต้อง self-host เท่านั้น)', async ({ request }) => {
  const files = ['js/games-ar.js', 'teacher/teacher-ar.js'];
  const bad = [];
  for (const f of files) {
    const txt = await (await request.get('/' + f)).text();
    if (/cdn\.jsdelivr\.net[^'"]*mediapipe/.test(txt)) bad.push(f);
  }
  expect(bad).toEqual([]);
});
