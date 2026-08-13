/* ============================================================
   บ้านของหนู — หน้า "ปรับค่าต่างๆ" (เครื่องมือเทสระบบ)

   ทำไมต้องมี: ระบบในโหมดบ้านหลายอย่างต้องรอ "เวลาจริง" หรือ "เก็บเงินจริง" กว่าจะเห็นผล
   เช่น ความหิวลดวันละครั้ง · สัตว์ป่วยต้องปล่อยหิว 2 วันเล่นติดกัน · ของบางชิ้นราคา 1,500 🪙
   ⇒ เทสด้วยการเล่นจริงแทบไม่ไหว หน้านี้จึงยัดค่าให้ตรงๆ เพื่อ **ทดสอบระบบเท่านั้น**

   ⚠ กติกาของไฟล์นี้:
     - นี่คือ **ของโกง** ไม่ใช่ฟีเจอร์ให้เด็กเล่น — ต้องปิดก่อน deploy เสมอ (ดู DEV_ENABLED ข้างล่าง)
     - แก้ค่าผ่าน API สาธารณะเท่านั้น (`window.HousePetCare` / `window.HouseShop` / `window.OwlCoins`)
       ห้ามเขียน localStorage ตรงๆ ไม่งั้น migration/สถานะภายในจะเพี้ยนแบบที่เกมจริงไม่มีทางเจอ
     - เงินต้องผ่าน `window.OwlCoins` เท่านั้น (กติกาเหล็กข้อ 5 ของ QUEST-DESIGN.md)

   โหลดแบบ lazy ต่อท้าย house.js ใน js/games-ar.js — เปิดออกมาที่ `window.HouseDev`
   ============================================================ */
(function(){
  'use strict';

  /* ============================================================
     🔒 DEV_FEATURE_OFF — สวิตช์เปิด/ปิดหน้านี้ **จุดเดียวในทั้งโปรเจค**

     `true`  = เห็นปุ่ม 🛠️ ในเมนูเฟือง (ใช้บน branch ระหว่างพัฒนา/เทส)
     `false` = ซ่อนปุ่ม + เปิดหน้านี้ไม่ได้เลย (**ค่าที่ต้องใช้ทุกครั้งที่ merge ขึ้น `main`/deploy จริง**)

     ⚠️ **ก่อน merge เข้า `main` ทุกครั้งต้องตั้งเป็น `false`** เหมือน QB_ENABLED ใน js/house-qbrowse.js
     (กติกาเดียวกันเป๊ะ: เครื่องมือเทส = ปิดตอน deploy เสมอ ไม่ต้องถามผู้ใช้ซ้ำ)
     ============================================================ */
  const DEV_ENABLED = true;

  const $ = id => document.getElementById(id);
  const click = () => { if(typeof playClick === 'function') playClick(); };
  const toast = (ic, msg) => { if(typeof showToast === 'function') showToast(ic, msg); };

  const TABS = [
    {id:'pet',    ic:'🐾', name:'ความหิวสัตว์'},
    {id:'coins',  ic:'🪙', name:'เงิน'},
    {id:'unlock', ic:'🔓', name:'ปลดล็อกของ'},
    {id:'garden', ic:'🌱', name:'เร่งเวลาผัก'},
  ];
  let tab = 'pet';

  const care  = () => window.HousePetCare || null;
  const shop  = () => window.HouseShop || null;
  const coins = () => (window.OwlCoins ? window.OwlCoins.get() : 0);

  function isOpen(){ const e = $('house-dev'); return !!e && !e.hidden; }
  function close(){ const e = $('house-dev'); if(e) e.hidden = true; }
  function open(){
    if(!DEV_ENABLED) return;
    const e = $('house-dev'); if(!e) return;
    e.hidden = false;
    renderTabs(); renderBody();
  }

  function renderTabs(){
    const wrap = $('hdev-tabs'); if(!wrap) return;
    wrap.innerHTML = '';
    TABS.forEach(t=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'he-tab' + (t.id === tab ? ' active' : '');
      b.innerHTML = '<span class="he-tab-emoji">' + t.ic + '</span><span>' + t.name + '</span>';
      b.onclick = ()=>{ click(); tab = t.id; renderTabs(); renderBody(); };
      wrap.appendChild(b);
    });
  }

  /* แถวหนึ่งของแผง: ป้ายซ้าย + กลุ่มปุ่มขวา */
  function row(parent, label, btns){
    const r = document.createElement('div'); r.className = 'hdev-row';
    const l = document.createElement('div'); l.className = 'hdev-label'; l.textContent = label;
    r.appendChild(l);
    const g = document.createElement('div'); g.className = 'hdev-btns';
    btns.forEach(b=>{
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'hdev-btn' + (b.warn ? ' hdev-warn' : '');
      el.textContent = b.t;
      el.onclick = ()=>{ click(); b.fn(); renderBody(); };
      g.appendChild(el);
    });
    r.appendChild(g);
    parent.appendChild(r);
  }
  function note(parent, txt){
    const n = document.createElement('div'); n.className = 'hdev-note'; n.textContent = txt;
    parent.appendChild(n);
  }

  function renderBody(){
    const body = $('hdev-body'); if(!body) return;
    body.innerHTML = '';
    if(tab === 'pet')    return renderPet(body);
    if(tab === 'coins')  return renderCoins(body);
    if(tab === 'unlock') return renderUnlock(body);
    if(tab === 'garden') return renderGarden(body);
  }

  /* ---------- แท็บเร่งเวลาผัก (ผู้ใช้สั่ง 2026-08-14) ----------
     ผักโตตาม "วันที่เข้าเล่น" ⇒ เทสจริงต้องรอข้ามวัน ซึ่งทดสอบไม่ไหว
     ⚠ ทำผ่าน API สาธารณะของ HousePlay เท่านั้น **ห้ามเขียน localStorage ตรงๆ**
       (กติกาเดิมของหน้านี้ — ไม่งั้น migration/cache ภายในจะเพี้ยนแบบที่เกมจริงไม่มีทางเจอ) */
  function renderGarden(body){
    const PL = window.HousePlay;
    if(!PL){ note(body, 'ระบบกิจกรรมยังโหลดไม่เสร็จ'); return; }
    const beds = PL.beds() || [];
    const planted = beds.map((_, i) => PL.state() && (PL.state().garden.plots || [])[i]).filter(Boolean);
    note(body, 'แปลงทั้งหมด ' + beds.length + ' แปลง · ปลูกแล้ว ' + planted.length + ' แปลง'
             + (planted.length ? '' : ' — ยังไม่มีอะไรให้เร่ง ลองไปปลูกก่อน'));
    row(body, 'เร่งการเติบโต', [1, 2, 5].map(n=>({
      label: '+' + n + ' วัน',
      fn: ()=>{ const c = PL.devGrow(n); toast('🌱', 'เร่งให้ ' + c + ' แปลง'); renderBody(); },
    })));
    row(body, 'เมล็ดพันธุ์', (PL.SEEDS || []).slice(0, 3).map(sd=>({
      label: sd.e + ' +5',
      fn: ()=>{ PL.addSeed(sd.id, 5); toast(sd.e, 'ได้เมล็ด' + sd.n + ' 5 เม็ด'); renderBody(); },
    })));
    row(body, 'เมล็ดพันธุ์ (ต่อ)', (PL.SEEDS || []).slice(3).map(sd=>({
      label: sd.e + ' +5',
      fn: ()=>{ PL.addSeed(sd.id, 5); toast(sd.e, 'ได้เมล็ด' + sd.n + ' 5 เม็ด'); renderBody(); },
    })));
  }

  /* ---------- แท็บความหิว: ยัดค่าความอิ่ม/ป่วยของสัตว์ตัวปัจจุบัน ---------- */
  function renderPet(body){
    const C = care();
    if(!C){ note(body, 'ระบบดูแลสัตว์ยังโหลดไม่เสร็จ'); return; }
    const st = C.state();
    if(!st){
      note(body, 'ยังไม่มีสัตว์เลี้ยง — ไปรับเลี้ยงที่ร้านสัตว์เลี้ยงก่อน แล้วค่อยกลับมาปรับค่าได้');
      return;
    }
    const cur = C.fullness(), sick = C.isSick();
    note(body, 'ตอนนี้: ความอิ่ม ' + cur + '/' + C.FULL_MAX
             + (sick ? ' · 🤒 ป่วยอยู่' : ' · สบายดี')
             + (st.owe ? ' · ติดค้างงานคุณหมอ' : ''));
    row(body, 'ตั้งความอิ่ม', [0, 25, 50, 75, 100].map(v=>({
      t: String(v), fn: ()=>{ C.setFull(v); afterPetChange(); },
    })));
    row(body, 'สุขภาพ', [
      {t:'ทำให้ป่วย 🤒', warn:true, fn: ()=>{ C.setSick(true);  afterPetChange(); }},
      {t:'รักษาให้หาย',            fn: ()=>{ C.setSick(false); afterPetChange(); }},
    ]);
    row(body, 'คลังอาหาร', [
      {t:'+5 มื้อ (ของสัตว์ตัวนี้)', fn: ()=>{
        const fid = C.foodForPet(C.petType());
        if(fid){ C.addMeals(fid, 5); afterPetChange(); }
      }},
      {t:'+5 มื้อ ทุกชนิด', fn: ()=>{ C.FOOD.forEach(f=> C.addMeals(f.id, 5)); afterPetChange(); }},
      {t:'อาหารหมดเกลี้ยง', warn:true, fn: ()=>{
        C.FOOD.forEach(f=>{ const n = C.meals(f.id); if(n) C.addMeals(f.id, -n); });
        afterPetChange();
      }},
    ]);
    note(body, 'หมายเหตุ: "ป่วย" ในเกมจริงต้องปล่อยให้หิวสนิท 2 วันเล่นติดกัน '
             + 'และหายได้ทางเดียวคือคุยคุณหมอ (จ่าย ' + C.CURE_COST + ' 🪙 หรือทำงานแทน)');
  }
  function afterPetChange(){
    if(window.HouseDevHooks && window.HouseDevHooks.petChanged) window.HouseDevHooks.petChanged();
  }

  /* ---------- แท็บเงิน ---------- */
  function renderCoins(body){
    note(body, 'ยอดตอนนี้: ' + coins() + ' 🪙');
    if(!window.OwlCoins){ note(body, 'ระบบเหรียญยังไม่พร้อม'); return; }
    row(body, 'เพิ่มเงิน', [100, 500, 1000, 5000].map(v=>({
      t: '+' + v, fn: ()=> window.OwlCoins.add(v),
    })));
    row(body, 'ตั้งยอด', [
      {t:'0', warn:true, fn: ()=> window.OwlCoins.set(0)},
      {t:'1,000',        fn: ()=> window.OwlCoins.set(1000)},
      {t:'20,000',       fn: ()=> window.OwlCoins.set(20000)},
    ]);
    note(body, 'ของทั้งเกมรวมกันราว 15,800 🪙 — ตั้ง 20,000 แล้วซื้อได้ทุกอย่างเพื่อเทสหน้าร้าน');
  }

  /* ---------- แท็บปลดล็อกของ ---------- */
  function renderUnlock(body){
    const S = shop();
    if(!S){ note(body, 'ระบบร้านค้ายังโหลดไม่เสร็จ'); return; }
    note(body, 'ปลดล็อกให้ "เป็นเจ้าของ" ทันทีโดยไม่ตัดเงิน — ใช้เทสว่าของทุกชิ้นวาง/ใส่/ใช้ได้จริงไหม');
    row(body, 'เฟอร์นิเจอร์', [{t:'ปลดล็อกทั้งหมด', fn: ()=>{
      const n = S.devUnlockAll('furn'); toast('🔓', 'ปลดล็อกเฟอร์นิเจอร์ ' + n + ' ชิ้น');
    }}]);
    row(body, 'ชุดแต่งตัว', [{t:'ปลดล็อกทั้งหมด', fn: ()=>{
      const n = S.devUnlockAll('fit'); toast('🔓', 'ปลดล็อกชุดแต่งตัว ' + n + ' แบบ');
    }}]);
    row(body, 'สัตว์เลี้ยง + สีขน', [{t:'ปลดล็อกทั้งหมด', fn: ()=>{
      const n = S.devUnlockAll('pet'); toast('🔓', 'ปลดล็อกสัตว์/สีขน ' + n + ' รายการ');
    }}]);
    row(body, 'ทุกอย่างรวดเดียว', [{t:'🔓 ปลดล็อกหมดทั้งเกม', fn: ()=>{
      const n = S.devUnlockAll('all'); toast('🔓', 'ปลดล็อกรวม ' + n + ' รายการ');
    }}]);
    row(body, 'ล้างสิทธิ์', [{t:'คืนค่าเป็นเด็กใหม่', warn:true, fn: ()=>{
      S.devLockAll(); toast('🔒', 'ล้างสิทธิ์ที่ซื้อไว้ทั้งหมดแล้ว (ชุดเริ่มต้นยังอยู่)');
    }}]);
  }

  const cb = $('hdev-close');
  if(cb) cb.addEventListener('click', ()=>{ click(); close(); });

  /* ปิดอยู่ → ซ่อนปุ่มในเมนูเฟืองทิ้งไปเลย (inline style ชนะ .icon-btn{display:inline-flex} เสมอ) */
  if(!DEV_ENABLED){
    const b = $('house-dev-btn');
    if(b) b.style.display = 'none';
  }

  window.HouseDev = {open, close, isOpen, enabled:DEV_ENABLED};
})();
