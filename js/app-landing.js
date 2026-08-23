/* ================================================================================
   🚪 ทางเข้าโหมด (mode router)

   📌 **หน้าเลือกโหมดถูกถอดออกทั้งหน้าแล้ว 2026-08-21 (ผู้ใช้สั่ง)**
      ของเดิม: เลือกเด็ก → หน้าเลือกโหมด (การ์ด 🏠 เข้าเมือง / 📚 ทำโจทย์) → หน้าหมวด/เมือง
      ตอนนี้: เลือกโหมดได้ในหน้าเลือกเด็กเลย (`js/app-home2.js`) หน้าคั่นจึงไม่มีเหตุผลอยู่ต่อ
      ⇒ ลบ `#landing-view` ออกจาก index.html และลบ `maybeShow()/reopen()/reset()` ทิ้ง

   ไฟล์นี้ยังอยู่เพราะเหลือ 3 หน้าที่ที่ยังมีคนใช้จริง:
     ① `go(mode)` — **ประตูเดียวที่ทุกทางเข้าใช้ร่วมกัน** (ปุ่มบนหน้าแรก · ฟอร์มสร้างโปรไฟล์)
        🔒 **ห้ามให้ที่อื่นเขียนทางเข้าเมือง/หน้าหมวดขึ้นใหม่เอง** ไม่งั้นวันหลังแก้ที่นี่แล้วอีกทางค้างของเก่า
     ② `houseOn()` — โหมดบ้านเปิดอยู่ไหม (ดูจากปุ่มจริงในหน้า ไม่ใช่ค่าคงที่)
        `OwlHome2.on()` ใช้ตัวนี้ตัดสินว่าจะกางแถวไหม · เปิดให้เด็กเล่นจริงตั้งแต่ v3.0.0 แล้ว
     ③ ปุ่ม "ย้อนกลับ" บนหน้าเลือกหมวด → พากลับหน้าเลือกเด็ก
   ================================================================================ */
(function(){
  'use strict';

  function $(id){ return document.getElementById(id); }

  /* โหมดบ้านเปิดให้เล่นอยู่ไหม — ดูจากปุ่มจริงในหน้า ไม่ใช่ค่าคงที่ (main กับ branch ต่างกัน) */
  function houseOn(){
    const b = $('house-entry-btn');
    return !!b && !b.hidden;
  }

  /* ไปหน้าเลือกหมวด (ทางเดิมทั้งหมด) */
  function goQuiz(){
    if(typeof enterHomeReal === 'function') enterHomeReal();
  }

  /* เข้าเมือง — กดปุ่มเดิมของหน้าหลัก เพื่อใช้เส้นทาง lazy-load ชุดเดียวกับที่ทดสอบไว้แล้ว
     ⚠ ต้องเปิดหน้าหมวดไว้ข้างหลังด้วย เพราะตอนออกจากเมืองเกมจะกลับมาที่หน้านั้น */
  function goHouse(){
    if(typeof enterHomeReal === 'function') enterHomeReal();
    const b = $('house-entry-btn');
    if(b) b.click();
  }

  function go(mode){ if(mode === 'house') goHouse(); else goQuiz(); }

  /* กลับไปหน้าเลือกเด็ก */
  function backToChildSelect(){
    if(typeof renderChildSelect === 'function') renderChildSelect();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* 🚪 ปุ่ม "ย้อนกลับ" บนหน้าเลือกหมวด (ผู้ใช้สั่ง 2026-08-17 · เปลี่ยนปลายทาง 2026-08-20)
     เดิมทางออกเดียวคือกดที่ชื่อเด็กบนแถบบน (`#switch-child-btn`) ซึ่ง **ไม่มีอะไรบอกว่ากดได้**
     🔒 **ปลายทางคือหน้าเลือกเด็กเสมอ** ⇒ โชว์ได้ตลอด ไม่ต้องเช็คว่าโหมดบ้านเปิดอยู่ไหม
     (ฟังก์ชันนี้ยังอยู่เพราะ `renderHome()` เรียกทุกครั้งที่กลับมาหน้าหมวด) */
  function refreshQuizExitBtn(){
    const row = $('home-exit-row');
    if(row) row.hidden = false;
  }

  function init(){
    const ex = $('home-exit-btn');
    if(ex) ex.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      backToChildSelect();
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.OwlLanding = {go, houseOn, refreshQuizExitBtn};
})();
