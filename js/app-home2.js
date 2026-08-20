/* ================================================================================
   🏡 หน้าแรกแบบรวมร่าง (v2) — เลือกเด็กแล้วเลือกโหมดในหน้าเดียว
   ทดลองอยู่หลังธง URL: เปิดด้วย  index.html?home=v2   (ปกติปิด = ของเดิมทุกอย่าง)

   ของเดิม: หน้าเลือกเด็ก → หน้าเลือกโหมด (js/app-landing.js) → หน้าหมวด/เมือง
   ของใหม่: แตะชื่อเด็ก → แถวนั้น "กางออก" โชว์ตัวละคร 3D เต็มตัวของเด็กคนนั้น
            + ปุ่มเลือกโหมดใต้ตัวละคร  (ไม่ต้องข้ามหน้า)

   ⚠ กติกาที่ยึด
   - **renderer ตัวเดียวใช้ซ้ำทุกคน** — กางได้ทีละคนเท่านั้น ⇒ WebGL context เดียวตลอด
     (canvas เป็น element เดียวที่ย้ายไปมาระหว่างแถว ไม่ใช่ canvas ต่อแถว)
   - เด็กที่ยังไม่เคยเข้าโหมดบ้าน = ยังไม่มีตัวละคร ⇒ โชว์ปุ่ม "สร้างตัวละคร" แทนช่องว่าง
   - โหมดบ้านปิดอยู่ (HOUSE_FEATURE_OFF บน main) ⇒ ถอยกลับไปพฤติกรรมเดิมทั้งหมด
     (มีโหมดเดียวก็ไม่มีอะไรให้เลือก การกางแถวจะไร้ความหมาย)
   - ทางเข้าโหมดยังวิ่งผ่าน `OwlLanding.go()` ที่เดียวเหมือนเดิม **ห้ามเขียนทางเข้าใหม่**
   ================================================================================ */
(function(){
  'use strict';

  const FLAG_KEY = 'p1quiz_home_v2';
  let enabled = false;
  let openId = '';            /* id เด็กที่กางอยู่ตอนนี้ ('' = ไม่มี) */
  let canvasEl = null;        /* canvas ตัวเดียวของทั้งหน้า */
  let loading = null;         /* promise ตอนกำลังโหลดชุด 3D */

  function $(id){ return document.getElementById(id); }
  function click(){ if(typeof playClick === 'function') playClick(); }

  /* ธงเปิด/ปิด — จำไว้ใน sessionStorage ด้วย เพราะปุ่ม "โหลดเวอร์ชันใหม่" เขียน URL ใหม่ทั้งเส้น
     (location.replace(base+'?r=…')) ธงใน query string จะหลุดหายไปเฉยๆ */
  (function readFlag(){
    let q = '';
    try{ q = new URLSearchParams(location.search).get('home') || ''; }catch(e){}
    try{
      if(q === 'v2'){ sessionStorage.setItem(FLAG_KEY, '1'); }
      else if(q){ sessionStorage.removeItem(FLAG_KEY); }
      enabled = sessionStorage.getItem(FLAG_KEY) === '1';
    }catch(e){ enabled = (q === 'v2'); }
  })();

  function houseOn(){ return !!(window.OwlLanding && OwlLanding.houseOn()); }
  /* ใช้ได้จริงก็ต่อเมื่อโหมดบ้านเปิดอยู่ — ไม่งั้นมีโหมดเดียว กางแถวไปก็ไม่มีอะไรให้เลือก */
  function on(){ return enabled && houseOn(); }

  function hasHouseData(id){
    try{ return !!localStorage.getItem('p1quiz_house_' + id); }catch(e){ return false; }
  }
  function anyoneHasHouse(){
    return (typeof children !== 'undefined' && children || []).some(c => hasHouseData(c.id));
  }
  function ready3d(){ return !!(window.HouseCharView); }

  /* โหลดชุด 3D (ครั้งเดียวทั้งแอป ไม่ใช่ต่อเด็ก) — curtain=true จะเดินหลอดให้เห็น */
  function load3d(curtain){
    if(ready3d()) return Promise.resolve(true);
    if(loading) return loading;
    if(typeof loadHouseMode !== 'function') return Promise.resolve(false);
    loading = loadHouseMode(!!curtain)
      .then(()=>{ if(curtain && typeof houseCurtain === 'function') houseCurtain(1, 'พร้อมแล้ว!'); return ready3d(); })
      .catch(()=> false)
      .then(ok=>{
        loading = null;
        if(curtain){
          const el = $('house-loading');
          if(el){ el.classList.add('done'); setTimeout(()=>{ el.hidden = true; el.classList.remove('done'); }, 320); }
        }
        return ok;
      });
    return loading;
  }

  /* ---------- ชิ้นส่วน UI ---------- */
  function icon(id, size){
    return (window.OwlIcons && OwlIcons.has(id)) ? OwlIcons.html(id, size || 26) : '';
  }
  function modeBtn(cls, imgSrc, label, sub, onClick){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'h2-mode ' + cls;
    const im = document.createElement('img');
    im.className = 'h2-mode-ic'; im.src = imgSrc; im.alt = '';
    const tx = document.createElement('span');
    tx.className = 'h2-mode-tx';
    const n = document.createElement('span'); n.className = 'h2-mode-name'; n.textContent = label;
    const s = document.createElement('span'); s.className = 'h2-mode-sub'; s.textContent = sub;
    tx.appendChild(n); tx.appendChild(s);
    b.appendChild(im); b.appendChild(tx);
    b.addEventListener('click', e=>{ e.stopPropagation(); click(); onClick(); });
    return b;
  }

  function getCanvas(){
    if(!canvasEl){
      canvasEl = document.createElement('canvas');
      canvasEl.id = 'h2-canvas';
      canvasEl.className = 'h2-canvas';
      canvasEl.setAttribute('aria-label', 'ตัวละครของหนู');
      canvasEl.addEventListener('click', ()=>{
        click();
        if(window.HouseCharView) HouseCharView.cheer();
      });
    }
    return canvasEl;
  }

  /* วาดเนื้อในช่องตัวละครตามสถานะปัจจุบัน (โหลดอยู่ / มีตัวละคร / ยังไม่มี) */
  function paintStage(panel, child){
    const stage = panel.querySelector('.h2-stage');
    const modes = panel.querySelector('.h2-modes');
    if(!stage) return;
    const hasChar = ready3d() && HouseCharView.hasChar(child.id);

    stage.innerHTML = '';
    stage.classList.toggle('h2-empty', !hasChar);
    if(!ready3d() && hasHouseData(child.id)){
      /* มีบ้านอยู่แล้วแต่ชุด 3D ยังมาไม่ถึง — บอกให้รู้ว่ากำลังทำงานอยู่ ไม่ใช่ค้าง */
      const w = document.createElement('div');
      w.className = 'h2-wait';
      w.innerHTML = '<span class="h2-spin" aria-hidden="true"></span>';
      const t = document.createElement('span');
      t.textContent = 'กำลังเตรียมตัวละคร…';
      w.appendChild(t);
      stage.appendChild(w);
    } else if(hasChar){
      stage.appendChild(getCanvas());
      HouseCharView.mount(canvasEl, child.id);
      const pn = HouseCharView.petName(child.id);
      if(pn){
        const cap = document.createElement('div');
        cap.className = 'h2-cap';
        cap.textContent = 'กับ ' + pn;
        stage.appendChild(cap);
      }
    } else {
      /* ยังไม่เคยเข้าโหมดบ้าน = ยังไม่มีตัวละคร ⇒ ชวนไปสร้าง (ปุ่มนี้พาเข้าเมืองเลย) */
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'h2-create';
      b.innerHTML = icon('ui-newchar', 46);
      const t = document.createElement('span');
      t.textContent = 'สร้างตัวละครของหนู';
      b.appendChild(t);
      const s = document.createElement('small');
      s.textContent = 'เลือกทรงผม เสื้อผ้า แล้วเข้าเมืองได้เลย';
      b.appendChild(s);
      b.addEventListener('click', e=>{ e.stopPropagation(); click(); go('house'); });
      stage.appendChild(b);
    }

    /* ปุ่มโหมด: มีตัวละครแล้วค่อยโชว์ "เข้าเมือง" คู่กับ "ทำโจทย์"
       ยังไม่มีตัวละคร → ปุ่มสร้างตัวละครด้านบนทำหน้าที่ทางเข้าเมืองอยู่แล้ว ไม่ต้องมี 2 ปุ่มซ้ำ */
    if(modes){
      modes.innerHTML = '';
      if(hasChar){
        modes.appendChild(modeBtn('h2-mode-house', 'assets/icons/my-house.svg',
          'เข้าเมือง', 'เดินเล่น · ทำเควสต์', ()=>go('house')));
      }
      modes.appendChild(modeBtn('h2-mode-quiz', 'assets/icons/landing-quiz.svg',
        'ทำโจทย์', 'เลือกหมวดที่อยากฝึก', ()=>go('quiz')));
    }
  }

  function go(mode){
    collapse();
    if(window.OwlLanding && OwlLanding.go) OwlLanding.go(mode);
  }

  function collapse(){
    if(window.HouseCharView) HouseCharView.unmount();
    const list = $('child-list');
    if(list) Array.prototype.forEach.call(list.querySelectorAll('.h2-panel'), p=>p.remove());
    if(list) Array.prototype.forEach.call(list.querySelectorAll('.child-row.h2-open'), r=>r.classList.remove('h2-open'));
    openId = '';
  }

  /* แตะการ์ดเด็ก — กางแถวนั้น (แตะซ้ำที่คนเดิม = ยุบ) */
  function toggle(child, row){
    if(openId === child.id){ collapse(); return; }
    collapse();
    /* ตั้งเด็กคนนี้เป็นคนเล่นปัจจุบันก่อน (ยังไม่เข้าโหมดไหน)
       'age' = โปรไฟล์เก่าที่ยังไม่มีวันเกิด ⇒ popup ถามวันเกิดเปิดขึ้นมาแทน */
    if(typeof activateChild === 'function' && activateChild(child.id) !== 'ok') return;

    openId = child.id;
    row.classList.add('h2-open');
    const panel = document.createElement('div');
    panel.className = 'h2-panel';
    const stage = document.createElement('div'); stage.className = 'h2-stage';
    const modes = document.createElement('div'); modes.className = 'h2-modes';
    panel.appendChild(stage); panel.appendChild(modes);
    row.parentNode.insertBefore(panel, row.nextSibling);
    paintStage(panel, child);

    /* ยังไม่มีชุด 3D แต่เด็กคนนี้มีบ้าน → โหลดเงียบๆ แล้ววาดใหม่เมื่อพร้อม */
    if(!ready3d() && hasHouseData(child.id)){
      load3d(false).then(()=>{
        if(openId !== child.id) return;
        const p = document.querySelector('.h2-panel');
        if(p) paintStage(p, child);
      });
    }
    setTimeout(()=>{ if(panel.isConnected) panel.scrollIntoView({block:'nearest', behavior:'smooth'}); }, 60);
  }

  /* เรียกจาก renderChildSelect() ทุกครั้งที่วาดรายชื่อใหม่ */
  function reset(){ collapse(); }

  /* เรียกจาก INIT — มีเด็กที่เคยเข้าเมืองอยู่แล้ว ⇒ โหลดชุด 3D พร้อมม่านก่อนให้เลือก
     เด็กใหม่ล้วน (ยังไม่มีใครมีบ้าน) ⇒ ไม่โหลดอะไรเลย จะได้ไม่ต้องรอ 2 MB ฟรีๆ */
  function boot(){
    if(!on() || ready3d()) return;
    if(!anyoneHasHouse()) return;
    if(typeof houseCurtain === 'function') houseCurtain(.05, 'กำลังเตรียมตัวละคร…');
    load3d(true).then(()=>{
      if(!openId) return;
      const p = document.querySelector('.h2-panel');
      const c = (children || []).find(x => x.id === openId);
      if(p && c) paintStage(p, c);
    });
  }

  window.addEventListener('resize', ()=>{ if(openId && window.HouseCharView) HouseCharView.resize(); });

  window.OwlHome2 = {on, toggle, reset, boot, collapse,
    /* ชุดเทส */ _openId:()=>openId, _enabled:()=>enabled};
})();
