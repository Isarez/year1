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
       ⇒ วาด **แถวจุดนับข้อ** ไว้บนสุดของ view แทน (ดู startDots ด้านล่าง)
         (เดิมดึงป้าย 1/3 + หลอดกลับมาลอยมุมขวาบน แต่ไปทับการ์ดของเกมจับคู่ — แก้ 2026-08-22)
       ⚠ ตัวที่ไม่มี `.q-counter` (เช่นเกมที่นับเป็นอย่างอื่น) ไม่ต้องติดธง จะได้ไม่มีกล่องเปล่าโผล่ */
    const top = view.querySelector(':scope > .quiz-top');
    if(top && top.querySelector('.q-counter')) startDots(view, top);
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
    stopDots(c.view);
    c.view.hidden = true;
    if(c.placeholder && c.placeholder.parentNode){
      c.placeholder.parentNode.insertBefore(c.view, c.placeholder);
      c.placeholder.parentNode.removeChild(c.placeholder);
    }
    document.body.classList.remove('og-mounted');
    return true;
  }

  /* ================= 🔵 จุดนับข้อของเกมที่ถูกยืมมาเล่นในการ์ด =================
     🐞 ผู้ใช้แจ้ง 2026-08-22: **แถบความคืบหน้าในเกมจับคู่บังการ์ด**
        ของเดิม (`og-keep` · 2026-08-17) ดึง "ป้าย 1/3 + หลอดความคืบหน้า" กลับมาลอย
        `position:absolute` มุมขวาบนของการ์ด เพื่อไม่ให้กินความสูง
        ⇒ แต่กระดานของเกมจับคู่กว้างเต็มการ์ด **ป้ายจึงไปทับการ์ดใบขวาบนพอดี**
     ⇒ เปลี่ยนเป็น **แถวจุดนับข้อ** แบบเดียวกับที่การ์ดเควสต์ใช้อยู่แล้ว (`.hqz-dot`)
        วางใน flow ด้านบนสุดของ view สูงแค่ ~10px ⇒ ไม่ทับอะไรและแทบไม่กินที่

     🔑 **ไม่ต้องแก้ engine สักตัว** — อ่านจำนวนข้อจาก `.q-counter` ("3/10") ที่ engine
        ทุกตัวอัปเดตอยู่แล้ว แล้วเฝ้าดูด้วย MutationObserver
     ⚠ engine บางตัวนับแบบ "ด่านที่กำลังทำ" (1/10 ตั้งแต่ยังไม่ตอบ) ⇒ จุดที่ `i < cur-1`
       คือข้อที่ผ่านแล้ว · `i === cur-1` คือข้อปัจจุบัน (สีเดียวกับ .hqz-dot.now) */
  let dotObs = null;
  function paintDots(box, txt){
    const m = String(txt || '').match(/(\d+)\s*\/\s*(\d+)/);
    if(!m){ box.innerHTML = ''; return; }
    const cur2 = +m[1], total = +m[2];
    if(!(total > 0) || total > 40){ box.innerHTML = ''; return; }
    if(box.children.length !== total){
      box.innerHTML = '';
      for(let i = 0; i < total; i++) box.appendChild(document.createElement('i'));
    }
    for(let i = 0; i < total; i++){
      box.children[i].className = i < cur2 - 1 ? 'on' : (i === cur2 - 1 ? 'now' : '');
    }
  }
  function startDots(view, top){
    stopDots(view);
    const counter = top.querySelector('.q-counter');
    const box = document.createElement('div');
    box.className = 'og-dots';
    view.insertBefore(box, view.firstChild);
    paintDots(box, counter.textContent);
    dotObs = new MutationObserver(()=>paintDots(box, counter.textContent));
    dotObs.observe(counter, {childList:true, characterData:true, subtree:true});
  }
  function stopDots(view){
    if(dotObs){ dotObs.disconnect(); dotObs = null; }
    const box = view && view.querySelector(':scope > .og-dots');
    if(box) box.remove();
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
