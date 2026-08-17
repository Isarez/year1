/* ================================================================================
   OwlGames — "สัญญา Mount" ให้ engine เกมของหน้าหลักไปเล่นที่อื่นได้ด้วย

   ทำไมต้องมี
   ----------
   engine เกมทุกตัวใน js/games-*.js ผูกกับ DOM ของตัวเองแบบตายตัว
   (`showOnlyView(mixView)` แล้ว `$('mix-hint')`, `$('mix-pot-chips')` ...)
   ⇒ โหมดบ้านเอาไปใช้ไม่ได้ ต้องเขียนกลไกใหม่ซ้ำของเดิม
   พอถึงเฟส 5-7 จะมีของซ้ำกันราว 20 ชุด แล้วตอนโหมดบ้านขึ้นเป็นหน้าหลักฝั่งหนึ่งจะกลายเป็นโค้ดตาย

   วิธีที่เลือก (ถูกและเสี่ยงน้อยที่สุด)
   ----------------------------------
   **ย้ายทั้งกล่อง view ไปแปะในโฮสต์ใหม่ แทนที่จะรื้อ engine**
   id ของลูกๆ ยังไม่ซ้ำในเอกสาร ⇒ `$('mix-hint')` ยังหาเจอเหมือนเดิมทุกประการ
   ⇒ **ไม่ต้องแก้โค้ด engine แม้แต่บรรทัดเดียว** แค่ลงทะเบียนว่า view ไหนคู่กับ start/stop ตัวไหน

   ตะเข็บส่งผลลัพธ์
   ---------------
   engine ทุกตัวจบเกมด้วย `finishP2Game()` (25 จุดเรียก) ⇒ แทรกเช็คจุดเดียวที่หัวฟังก์ชันนั้น
   ถ้ากำลังถูก mount อยู่ ให้ส่งผลกลับโฮสต์แทนการเด้งหน้าสรุปของหน้าหลัก

   ⚠ ข้อควรระวังเวลาเพิ่ม engine ใหม่เข้ามา
   - `stop()` ต้องล้าง state ของ engine ให้หมด (ตัวจับเวลา/ลูปวาด) ไม่งั้นค้างทำงานหลังปิดการ์ด
   - engine ที่ใช้กล้อง (ar-view) **ห้ามลงทะเบียน** — มันกินทั้งจอและมีวงจรกล้องของตัวเอง
   ================================================================================ */
(function(){
  'use strict';

  const REG = {};          /* id → {view, start, stop, needsCat} */
  let cur = null;          /* {id, host, placeholder, view, opts} ตอนกำลัง mount อยู่ */
  let realShowOnly = null; /* showOnlyView ตัวจริง ตอนถูกครอบไว้ระหว่าง mount */

  function el(id){ return document.getElementById(id); }

  /* ลงทะเบียน engine — เรียกจากท้ายไฟล์ js/games-*.js ของใครของมัน
     spec = {view:'mix-view', start(opts), stop(), needsCat:true} */
  function register(id, spec){
    if(!id || !spec || !spec.view || typeof spec.start !== 'function') return false;
    REG[id] = {view:spec.view, start:spec.start, stop:spec.stop || null,
               needsCat: spec.needsCat !== false, name: spec.name || id};
    return true;
  }
  function has(id){ return !!REG[id]; }
  function list(){ return Object.keys(REG); }
  function current(){ return cur ? cur.id : null; }

  /* เอาเกม `id` ไปวาดในกล่อง `host`
     opts = {catId, onDone(result), onExit} · คืน true ถ้าติดตั้งสำเร็จ
     ⚠ host ต้องเป็น element ที่ยังอยู่ในเอกสารจริง (ไม่ใช่ fragment ลอยๆ) */
  function mount(id, host, opts){
    const spec = REG[id];
    if(!spec || !host) return false;
    unmount();                                   /* กันซ้อน — เล่นได้ทีละเกม */
    const view = el(spec.view);
    if(!view) return false;
    opts = opts || {};
    if(spec.needsCat && !opts.catId) return false;

    /* จำที่เดิมไว้ด้วย placeholder เพื่อคืนกลับให้ตรงตำแหน่งเป๊ะตอน unmount
       (ลำดับ section ใน <main> มีผลกับ CSS บางตัว จึงคืนที่เดิมเสมอ ไม่ใช่ append ท้าย) */
    const ph = document.createComment('owl-games:' + spec.view);
    view.parentNode.insertBefore(ph, view);
    host.appendChild(view);
    view.hidden = false;
    view.classList.add('og-embedded');
    /* 🔢 **ตัวนับข้อต้องรอดจากการซ่อนแถบบน** (ผู้ใช้แจ้ง 2026-08-17 จากเกมทายเงา)
       `.og-embedded > .quiz-top` ถูกซ่อนทั้งแถบ ⇒ เด็กไม่รู้เลยว่าต้องเล่นกี่ข้อ
       ⇒ ติดธง `og-keep` ให้แถบบนของ view ที่ **มีตัวนับข้อจริง** แล้วให้ CSS ดึงเฉพาะ
         ตัวนับ+หลอดความคืบหน้ากลับมาลอยมุมขวาบน (ดู .og-keep ใน css/style.css)
       ⚠ ตัวที่ไม่มี `.q-counter` (เช่นเกมที่นับเป็นอย่างอื่น) ไม่ต้องติดธง จะได้ไม่มีกล่องเปล่าโผล่ */
    const top = view.querySelector(':scope > .quiz-top');
    if(top && top.querySelector('.q-counter')) top.classList.add('og-keep');
    document.body.classList.add('og-mounted');

    cur = {id, host, placeholder: ph, view, opts};

    /* ⚠ engine ทุกตัวเริ่มด้วย `showOnlyView(ของตัวเอง)` ซึ่งจะ **ซ่อนทุก view ที่เหลือรวมทั้งโฮสต์**
       (โหมดบ้านอยู่ใน ALL_VIEWS ด้วย ⇒ การ์ดเควสต์หายทั้งใบ) จึงต้องครอบไว้ระหว่าง mount
       ให้ทำแค่ "โชว์ view ที่ขอ" ไม่ต้องไปซ่อนของคนอื่น — โฮสต์เป็นคนคุมการมองเห็นเอง */
    if(typeof window.showOnlyView === 'function' && !realShowOnly){
      realShowOnly = window.showOnlyView;
      window.showOnlyView = function(v){ if(v) v.hidden = false; };
    }
    try{
      spec.start(opts);
      view.hidden = false;        /* กันกรณี engine ไปซ่อนตัวเองระหว่างตั้งค่า */
    }catch(e){
      /* start พังกลางทาง → คืน DOM ให้เรียบร้อยก่อน ไม่ปล่อยให้ view ค้างอยู่ในโฮสต์ */
      unmount();
      throw e;
    }
    return true;
  }

  /* ถอดเกมออกแล้วคืน view กลับที่เดิม — เรียกซ้ำได้ปลอดภัย */
  function unmount(){
    if(!cur) return false;
    const c = cur;
    cur = null;                                  /* เคลียร์ก่อนเรียก stop กัน stop วนกลับมาเรียก unmount ซ้ำ */
    if(realShowOnly){ window.showOnlyView = realShowOnly; realShowOnly = null; }
    const spec = REG[c.id];
    if(spec && spec.stop){ try{ spec.stop(); }catch(e){} }
    c.view.classList.remove('og-embedded');
    const kept = c.view.querySelector(':scope > .quiz-top.og-keep');
    if(kept) kept.classList.remove('og-keep');      /* คืนแถบบนให้หน้าเต็มจอเหมือนเดิม */
    c.view.hidden = true;
    if(c.placeholder && c.placeholder.parentNode){
      c.placeholder.parentNode.insertBefore(c.view, c.placeholder);
      c.placeholder.parentNode.removeChild(c.placeholder);
    }
    document.body.classList.remove('og-mounted');
    return true;
  }

  /* ตะเข็บผลลัพธ์ — finishP2Game() เรียกตัวนี้เป็นบรรทัดแรก
     คืน true = โฮสต์รับผลไปจัดการเองแล้ว ห้ามเด้งหน้าสรุปของหน้าหลัก */
  function handleFinish(catId, mistakes, totalLevels, doneWord){
    if(!cur) return false;
    const c = cur;
    const stars = mistakes === 0 ? 3 : (mistakes <= 4 ? 2 : 1);
    const res = {gameId: c.id, catId, mistakes, totalLevels, doneWord, stars};
    const cb = c.opts.onDone;
    unmount();                                   /* ถอดก่อนเรียก callback — โฮสต์จะได้วาดของตัวเองทับได้เลย */
    if(typeof cb === 'function') cb(res);
    return true;
  }

  window.OwlGames = {register, has, list, current, mount, unmount, handleFinish};
})();
