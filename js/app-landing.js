/* ================================================================================
   หน้าเลือกทาง (landing) — เลือกเด็กเสร็จแล้วให้เลือกก่อนว่าจะไปไหน
     🏠 เข้าเมือง  → โหมดบ้าน 3D
     📚 ทำโจทย์   → หน้าเลือกหมวดแบบเดิม

   ทำไมต้องมี
   ----------
   แผนระยะยาวคือให้โหมดบ้านเป็นหน้าหลัก แต่ชุด 3D หนัก ~1.2 MB
   ถ้าโยนเด็กเข้าเมืองทุกครั้ง เด็กที่แค่อยากทำโจทย์ต้องรอโหลดฟรีๆ
   ⇒ ให้เลือกเองตั้งแต่ต้น แล้วค่อย lazy-load เฉพาะทางที่เลือก

   ⚠ กติกา
   - โผล่ "ครั้งเดียวตอนเข้าแอป" เท่านั้น กลับจากเกมมาหน้าหมวดต้องไม่เจอหน้านี้ซ้ำ
     (ตัวคุมคือ `chosen` — `renderHome()` ไม่เกี่ยวข้องกับไฟล์นี้เลย)
   - ถ้าโหมดบ้านถูกปิดอยู่ (HOUSE_FEATURE_OFF บน main → ปุ่ม #house-entry-btn ติด hidden)
     **ต้องข้ามหน้านี้ไปหน้าหมวดเลย** ไม่งั้นเด็กเจอหน้าเลือกที่มีทางเดียว
   ================================================================================ */
(function(){
  'use strict';

  let chosen = false;      /* เลือกไปแล้วในรอบนี้ไหม — กันหน้าเลือกเด้งซ้ำตอนกลับจากเกม */

  function $(id){ return document.getElementById(id); }

  /* โหมดบ้านเปิดให้เล่นอยู่ไหม — ดูจากปุ่มจริงในหน้า ไม่ใช่ค่าคงที่ (main กับ branch ต่างกัน) */
  function houseOn(){
    const b = $('house-entry-btn');
    return !!b && !b.hidden;
  }

  function hide(){
    const v = $('landing-view');
    if(v) v.hidden = true;
  }

  /* ไปหน้าเลือกหมวด (ทางเดิมทั้งหมด) */
  function goQuiz(){
    chosen = true;
    hide();
    if(typeof enterHomeReal === 'function') enterHomeReal();
  }

  /* เข้าเมือง — กดปุ่มเดิมของหน้าหลัก เพื่อใช้เส้นทาง lazy-load ชุดเดียวกับที่ทดสอบไว้แล้ว
     ⚠ ต้องเปิดหน้าหมวดไว้ข้างหลังด้วย เพราะตอนออกจากบ้านเกมจะกลับมาที่หน้านั้น */
  function goHouse(){
    chosen = true;
    hide();
    if(typeof enterHomeReal === 'function') enterHomeReal();
    const b = $('house-entry-btn');
    if(b) b.click();
  }

  /* เรียกจาก enterHome() — คืน true ถ้าหน้านี้รับช่วงต่อแล้ว (ผู้เรียกต้องหยุดทำงานของตัวเอง) */
  function maybeShow(){
    if(chosen || !houseOn()) return false;
    const v = $('landing-view');
    if(!v) return false;
    $('child-select-view').hidden = true;
    const home = $('home-view');
    if(home) home.hidden = true;
    v.hidden = false;
    const name = (typeof activeChild !== 'undefined' && activeChild) ? activeChild.name : 'หนู';
    const t = $('landing-greet');
    if(t) t.textContent = 'สวัสดีจ้า ' + name + '! วันนี้อยากทำอะไรดี?';
    window.scrollTo({top:0, behavior:'smooth'});
    return true;
  }

  /* สลับด้วยตัวเองได้ทีหลัง — เปิดหน้าเลือกใหม่
     📌 **ตอนนี้ไม่มีใครเรียกแล้ว** (ปุ่มย้อนกลับบนหน้าเลือกหมวดเปลี่ยนไปหาหน้าเลือกเด็กแทน
        2026-08-20) เก็บไว้เป็นทางกลับเผื่อหน้าเลือกโหมดถูกเรียกใช้อีก */
  function reopen(){ chosen = false; return maybeShow(); }

  /* กลับไปหน้าเลือกเด็ก = เริ่มรอบใหม่ ⇒ ต้องล้าง `chosen` ด้วยเสมอ
     ⚠ ตัวนี้ถูกเรียกจาก renderChildSelect() ใน js/app-core.js ทุกครั้งที่กลับไปหน้าเลือกเด็ก
       ไม่งั้นเลือกเด็กใหม่แล้วจะข้ามหน้านี้ไปหน้าหมวดเลย (บั๊กที่ผู้ใช้เจอ 2026-08-11) */
  function reset(){ chosen = false; hide(); }

  /* ปุ่ม ← บนหน้านี้ — ให้เปลี่ยนคนเล่นได้โดยไม่ต้องเข้าเกมก่อน */
  function backToChildSelect(){
    if(typeof renderChildSelect === 'function') renderChildSelect();  /* เรียก reset() ให้เองอยู่แล้ว */
    else reset();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* 🚪 ปุ่ม "ย้อนกลับ" บนหน้าเลือกหมวด (ผู้ใช้สั่ง 2026-08-17 · เปลี่ยนปลายทาง 2026-08-20)
     เดิมทางออกเดียวคือกดที่ชื่อเด็กบนแถบบน (`#switch-child-btn`) ซึ่ง **ไม่มีอะไรบอกว่ากดได้**
     🔒 **ปลายทางคือหน้าเลือกเด็กเสมอ ไม่ใช่หน้าเลือกโหมด** — หน้าเลือกโหมดกำลังถูกเลิกใช้
        (ถูกแทนด้วยหน้าแรกแบบรวมร่าง `js/app-home2.js` ที่เลือกโหมดได้ในหน้าเลือกเด็กเลย)
     ⇒ ไม่ต้องซ่อนตอนโหมดบ้านปิดอีกแล้ว ปลายทางมีอยู่จริงทุกกรณี */
  function refreshQuizExitBtn(){
    const row = $('home-exit-row');
    if(row) row.hidden = false;
  }

  function init(){
    const h = $('landing-house'), q = $('landing-quiz'), b = $('landing-back');
    const ex = $('home-exit-btn');
    if(ex) ex.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      backToChildSelect();
    });
    if(h) h.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); goHouse(); });
    if(q) q.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); goQuiz(); });
    if(b) b.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); backToChildSelect(); });
    /* 🗂️ จัดการข้อมูล — ใช้กล่องเดียวกับหน้าเลือกเด็ก (ผู้ใช้สั่ง 2026-08-17)
       ⚠ **ห้ามทำกล่องใหม่ซ้ำ** — ย้ายข้อมูล/รีเซ็ต/ลบ ต้องมีทางเดียวจุดเดียวเสมอ
         ไม่งั้นวันหลังแก้ที่หนึ่งแล้วอีกที่ค้างของเก่า */
    const d = $('landing-data');
    if(d) d.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      if(typeof showClearModal === 'function') showClearModal();
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ทางเข้าโหมดสำหรับหน้าอื่น (js/app-home2.js) — ใช้เส้นทางเดียวกับปุ่มบนหน้านี้เป๊ะ
     ⚠ **ห้ามให้ที่อื่นเขียนทางเข้าเมือง/หน้าหมวดขึ้นใหม่เอง** ไม่งั้นวันหลังแก้ที่นี่แล้วอีกทางค้างของเก่า */
  function go(mode){ if(mode === 'house') goHouse(); else goQuiz(); }

  window.OwlLanding = {maybeShow, reopen, reset, hide, houseOn, refreshQuizExitBtn, go};
})();
