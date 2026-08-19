/* ============================================================
   📔 สมุดสะสม (Collection Book) — เฟส 16 ของโหมด "บ้านของหนู"
   (ข้อ 57.1 ของ QUEST-DESIGN.md · ผู้ใช้อนุมัติแผน 2026-08-17)

   ปัญหาที่แก้: ของที่เด็กหามาได้กระจัดกระจายอยู่คนละที่ (สมุดปลาอยู่ในแผงกิจกรรม ·
   รูปอยู่ในอัลบั้ม · ท่าที่สอนน้องอยู่ในเมนูน้อง) เด็กไม่เห็นภาพรวมว่า "เก็บอะไรมาแล้วบ้าง"
   ⇒ รวมเป็นสมุดเล่มเดียว เปิดจากแผงกิจกรรม 🎈

   🔒 กติกาที่ล็อกไว้ (ห้ามย้อนโดยไม่ถามผู้ใช้)
   - **ช่องที่ยังไม่ได้ต้องโชว์เป็นเงา ไม่ใช่ซ่อน** — เด็กต้องเห็นว่ายังขาดอะไร
     (กติกาเดียวกับของในร้าน ข้อ 17.4)
   - **ห้ามมีรางวัลที่ "ต้องเก็บครบถึงจะได้"** — ให้เป็นโบนัสระหว่างทางเท่านั้น
     ไม่งั้นกลายเป็นการกดดัน (กติกาเหล็กข้อ 2)
   - **ข้อมูลเก่าต้องอ่านได้ทันที** — เด็กที่ตกปลามาแล้วต้องเห็นปลาในสมุดเลย ไม่ใช่เริ่มนับใหม่
     ⇒ ปลา/รูป **ไม่จด state ซ้ำ** อ่านจาก `play.fish.book` / `play.photo.shots` ตรงๆ
   - **ห้ามจ่ายเหรียญ** — ของสะสมทั้งเกมไม่จ่ายเงิน (กันเงินเฟ้อ ข้อ 44.4)
     รางวัลเป็นของตกแต่งที่ปลดผ่าน `HouseShop.grantFree()` เหมือน COL_PRIZES ของเฟส 11

   📁 state: house save คีย์ `book` = `{v, critter:[], crop:[], trick:[]}`
      (อยู่ก้อนเดียวกับของอื่น ⇒ ระบบ export/import ข้ามเครื่องพาไปเอง)
   ============================================================ */
(function(){
  const $ = id => document.getElementById(id);
  const W  = () => window.HouseWorld;
  const PL = () => window.HousePlay;
  const PC = () => window.HousePetCare;
  /* 🎨 ไอคอน SVG (js/house-icons.js) — ไม่มี = ถอยไปใช้ emoji เดิม */
  const ICO = (id, emoji, size)=> (window.HouseIcons ? window.HouseIcons.htmlOr(id, emoji, size) : String(emoji || ''));
  /* id ไอคอนของแต่ละแท็บ — ต้องตรงกับคลังใน js/house-icons.js */
  const ICO_PREFIX = {fish:'fish-', crop:'seed-', critter:'critter-', trick:'trick-'};

  const BOOK_V = 1;

  /* ---------- 🐛 สัตว์ที่เจอในเมือง ----------
     7 ตัวแรก = สัตว์ป่าที่เดินเข้ามาในฉากเอง (ระบบ critter ใน js/house.js — แตะแล้วมันตกใจวิ่งหนี)
     4 ตัวหลัง = สัตว์ในคอกฟาร์ม (แตะได้ตลอดเพราะยืนประจำที่)
     ⚠ `id` ต้องตรงกับ type ที่ house.js ส่งเข้ามาเป๊ะ — ไม่ตรงแล้วจดไม่ลงโดยไม่มี error ให้จับ */
  const CRITTERS = [
    {id:'rabbit',   e:'🐰', n:'กระต่ายป่า'},
    {id:'bird',     e:'🐦', n:'นกน้อย'},
    {id:'squirrel', e:'🐿️', n:'กระรอก'},
    {id:'chicken',  e:'🐔', n:'ไก่เดินเล่น'},
    {id:'cat',      e:'🐈', n:'แมวจร'},
    {id:'duck',     e:'🦆', n:'เป็ดน้ำ'},
    {id:'fish',     e:'🐟', n:'ปลาผุดน้ำ'},
    {id:'cow',      e:'🐄', n:'วัวในฟาร์ม'},
    {id:'sheep',    e:'🐑', n:'แกะในฟาร์ม'},
    {id:'pig',      e:'🐖', n:'หมูในฟาร์ม'},
    {id:'chick',    e:'🐤', n:'ลูกเจี๊ยบ'},
  ];
  const CRITTER_BY_ID = {};
  CRITTERS.forEach(c => { CRITTER_BY_ID[c.id] = c; });

  /* ---------- 🎁 โบนัสระหว่างทาง ----------
     นับ "ช่องที่เก็บได้รวมทุกแท็บ" (ปลา 48 + ผัก 6 + สัตว์ 11 + ท่าน้อง 5 = 70 ช่อง)
     ⚠ เกณฑ์สูงสุด 45 จาก 70 **โดยตั้งใจ** — ไม่มีรางวัลไหนต้องเก็บครบ (กติกาเหล็กข้อ 2)
     ⚠ ปลดฟรี ไม่ตัดเงิน (เหมือน COL_PRIZES) และ id ต้องไม่ซ้ำกับรางวัลของเฟส 11 */
  const PRIZES = [
    {at:12, id:'bird-nest-box', label:'กล่องรังนกของนักสะสม'},
    {at:26, id:'aquarium',      label:'ตู้ปลาของนักสะสม'},
    {at:45, id:'aquarium-sea',  label:'ตู้ปลาทะเลของนักสะสม'},
  ];

  let B = null;

  function blank(){ return {v:BOOK_V, critter:[], crop:[], trick:[], prizes:[]}; }

  function sync(){
    const w = W(); if(!w) return null;
    const d = w.load() || {};
    let b = d.book;
    let dirty = false;
    if(!b || typeof b !== 'object' || (b.v | 0) !== BOOK_V){ b = blank(); dirty = true; }
    ['critter', 'crop', 'trick', 'prizes'].forEach(k=>{
      if(!Array.isArray(b[k])){ b[k] = []; dirty = true; }
    });
    B = b;
    if(dirty) persist();
    return b;
  }
  function persist(){ const w = W(); if(w && B) w.save({book: B}); }
  function state(){ return B || sync(); }

  /* ---------- คลังของแต่ละแท็บ (อ่านจากแหล่งจริงเสมอ ห้ามคัดลอกมาเก็บซ้ำ) ---------- */
  function fishAll(){ const p = PL(); return (p && p.FISH) || []; }
  function cropAll(){ const p = PL(); return (p && p.SEEDS) || []; }
  function trickAll(){ const c = PC(); return (c && c.TRICKS) || []; }
  function playState(){ const p = PL(); return (p && p.state && p.state()) || null; }
  function fishGot(){ const s = playState(); return (s && s.fish && s.fish.book) || []; }
  function shots(){ const s = playState(); return (s && s.photo && s.photo.shots) || []; }
  /* ท่าที่ "เคยสอนสำเร็จ" — รวมของน้องตัวปัจจุบันเข้ากับที่จดไว้ถาวร
     ⚠ `PETCARE.learnedTricks()` ผูกกับสัตว์ตัวที่เลี้ยงอยู่ ปล่อยคืนแล้วค่าหาย
       ⇒ สมุดต้องจดของตัวเองด้วย ไม่งั้นของสะสมของเด็กหายเพราะเปลี่ยนน้อง (กติกาเหล็กข้อ 3) */
  function trickGot(){
    const c = PC();
    const now = (c && c.learnedTricks) ? c.learnedTricks() : [];
    const s = state() || {trick:[]};
    const out = (s.trick || []).slice();
    now.forEach(id => { if(out.indexOf(id) < 0) out.push(id); });
    return out;
  }
  function gotList(tab){
    if(tab === 'fish')    return fishGot();
    if(tab === 'crop')    return (state() || {}).crop || [];
    if(tab === 'critter') return (state() || {}).critter || [];
    if(tab === 'trick')   return trickGot();
    return [];
  }
  function allList(tab){
    if(tab === 'fish')    return fishAll().map(f => ({id:f.id, e:f.e, n:f.n}));
    if(tab === 'crop')    return cropAll().map(s => ({id:s.id, e:s.e, n:s.n}));
    if(tab === 'critter') return CRITTERS.map(c => ({id:c.id, e:c.e, n:c.n}));
    if(tab === 'trick')   return trickAll().map(t => ({id:t.id, e:t.emoji, n:t.name}));
    return [];
  }
  const TABS = [
    {id:'fish',    e:'🐟', label:'ปลา'},
    {id:'crop',    e:'🌱', label:'ผัก/ผลไม้'},
    {id:'critter', e:'🐛', label:'สัตว์ในเมือง'},
    {id:'trick',   e:'🎪', label:'ท่าของน้อง'},
    {id:'photo',   e:'📷', label:'รูปถ่าย'},
  ];
  /* ตัวนับของทุกแท็บ — ชุดเทสและแถวในแผงกิจกรรมใช้ตัวเดียวกันนี้ */
  function counts(){
    const o = {};
    ['fish', 'crop', 'critter', 'trick'].forEach(t=>{
      const all = allList(t), got = gotList(t);
      o[t] = {got: all.filter(x => got.indexOf(x.id) >= 0).length, total: all.length};
    });
    const p = PL();
    o.photo = {got: shots().length, total: (p && p.PHOTO_MAX) || 12};
    o.total = {
      got:   o.fish.got + o.crop.got + o.critter.got + o.trick.got,
      total: o.fish.total + o.crop.total + o.critter.total + o.trick.total,
    };
    return o;
  }

  /* ---------- 🖊 จดของใหม่ ----------
     ประตูเดียวที่ระบบอื่นเรียกเข้ามา — คืน true ถ้าเป็นของ "ชนิดใหม่" จริงๆ
     ⚠ ห้ามเรียกในลูปวาดภาพ (อ่าน/เขียน localStorage) */
  function mark(kind, id){
    if(!id) return false;
    const s = state(); if(!s) return false;
    if(kind !== 'critter' && kind !== 'crop' && kind !== 'trick') return false;
    if(!Array.isArray(s[kind])) s[kind] = [];
    if(s[kind].indexOf(id) >= 0) return false;
    /* ของที่ไม่มีในคลัง (ชนิดที่ถูกถอดออกภายหลัง) ก็จดได้ แต่ไม่ประกาศ — กันสมุดพัง */
    s[kind].push(id);
    persist();
    const info = allList(kind).find(x => x.id === id);
    const w = W();
    if(info && w){
      const nm = {critter:'สัตว์', crop:'พืช', trick:'ท่า'}[kind];
      w.toast(ICO((ICO_PREFIX[kind] || '') + id, '📔'), 'จด' + nm + 'ใหม่ลงสมุดสะสม: ' + info.n + ' แล้ว!');
    }
    checkPrize();
    if(isOpen()) render();
    return true;
  }
  /* โบนัสระหว่างทาง — ปลดของตกแต่งให้ฟรี (ไม่ตัดเงิน ไม่ใช่การซื้อ) */
  function checkPrize(){
    const s = state(); if(!s) return;
    const n = counts().total.got;
    const w = W();
    PRIZES.forEach(pz=>{
      if(n < pz.at) return;
      if((s.prizes || []).indexOf(pz.id) >= 0) return;
      const ok = window.HouseShop && window.HouseShop.grantFree
        ? window.HouseShop.grantFree(pz.id) : false;
      s.prizes = (s.prizes || []).concat([pz.id]);
      persist();
      if(ok && w) w.toast(ICO('ui-gift', '🎁'), 'สมุดสะสมครบ ' + pz.at + ' ช่องแล้ว! ได้ "' + pz.label
                               + '" ไปหยิบได้ในโหมดตกแต่งบ้านเลย');
    });
  }

  /* ============================================================
     หน้าจอ — การ์ดลอยชุดเดียวกับแผงอื่นในโหมดบ้าน (ไม่เต็มจอ เด็กยังเห็นเมืองข้างหลัง)
     ============================================================ */
  let tab = 'fish';

  function isOpen(){ const e = $('house-book'); return !!e && !e.hidden; }
  function open(which){
    const w = W();
    if(!w || w.mode() !== 'world' || w.editing()) return;
    sync();
    if(window.HouseShop) window.HouseShop.close();
    if(window.HouseQuestUI) window.HouseQuestUI.close();
    if(window.HouseQB) window.HouseQB.close();
    if(window.HouseDev) window.HouseDev.close();
    if(PL() && PL().close) PL().close();
    /* ⚠ ปลา/รูปไม่ได้ผ่าน `mark()` (จดอยู่ฝั่ง house-play) ⇒ ต้องเช็ครางวัลตอนเปิดสมุดด้วย
       ไม่งั้นเด็กที่ตกปลาจนถึงเกณฑ์จะเห็นข้อความ "เก็บครบ 12 ช่องจะได้…" ทั้งที่ครบไปแล้ว */
    checkPrize();
    if(which && TABS.some(t => t.id === which)) tab = which;
    const e = $('house-book'); if(!e) return;
    e.hidden = false;
    render();
  }
  function close(){ const e = $('house-book'); if(e) e.hidden = true; }

  function render(){
    if(!isOpen()) return;
    sync();
    const c = counts();
    const head = $('hbk-count');
    if(head) head.textContent = c.total.got + '/' + c.total.total + ' ช่อง';

    /* แถบแท็บ */
    const tw = $('hbk-tabs');
    if(tw){
      tw.innerHTML = '';
      TABS.forEach(t=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'hqb-chip' + (t.id === tab ? ' on' : '');
        b.id = 'hbk-tab-' + t.id;
        const k = c[t.id];
        /* ⚠ ชื่อกับตัวเลขต้องแยกบรรทัด — เขียนต่อกันแถวเดียวทำให้ชิปยาวรวมเกินความกว้างการ์ด
           แล้วแท็บสุดท้าย (📷 รูปถ่าย) ตกไปแถวสอง (ผู้ใช้แจ้ง 2026-08-19) */
        b.innerHTML = ICO('tab-' + t.id, t.e, 20)
                    + '<span class="hbk-tabtx">' + t.label + '<i>' + k.got + '/' + k.total + '</i></span>';
        b.onclick = ()=>{ if(typeof playClick === 'function') playClick(); tab = t.id; render(); };
        tw.appendChild(b);
      });
    }
    const body = $('hbk-body');
    if(!body) return;
    body.innerHTML = '';
    if(tab === 'photo') renderPhoto(body);
    else renderGrid(body);

    /* แถวรางวัลระหว่างทาง — บอกล่วงหน้าเสมอว่าอีกกี่ช่องได้อะไร (ไม่ใช่เซอร์ไพรส์) */
    const pr = $('hbk-prize');
    if(pr){
      const s = state();
      const next = PRIZES.find(p => (s.prizes || []).indexOf(p.id) < 0);
      pr.textContent = next
        ? 'เก็บครบ ' + next.at + ' ช่องจะได้ "' + next.label + '" (ตอนนี้ ' + c.total.got + ' ช่อง)'
        : 'ได้ของรางวัลนักสะสมครบทุกชิ้นแล้ว เก่งมาก! เก็บต่อไปได้เรื่อยๆ นะ';
    }
  }
  /* ช่องเก็บของ — ⚠ ช่องที่ยังไม่ได้ต้องเป็น "เงา" ไม่ใช่ช่องว่าง/ซ่อน */
  function renderGrid(body){
    const all = allList(tab), got = gotList(tab);
    const g = document.createElement('div');
    g.className = 'hbk-grid';
    all.forEach(it=>{
      const has = got.indexOf(it.id) >= 0;
      const d = document.createElement('div');
      d.className = 'hbk-cell' + (has ? ' has' : '');
      d.setAttribute('data-id', it.id);
      const e = document.createElement('span');
      e.className = 'hbk-e';
      /* ⚠ ช่องที่ยังไม่เจอต้องเป็น **เงาของรูปจริง** ⇒ ใช้ไอคอนตัวเดียวกันแล้วให้ CSS ทำเป็นเงา
         (ของเดิมเป็น emoji + filter brightness(0) · ตอนนี้เป็น SVG + fill ทึบผ่าน CSS) */
      e.innerHTML = ICO((ICO_PREFIX[tab] || '') + it.id, it.e, 30);
      const n = document.createElement('span');
      n.className = 'hbk-n';
      n.textContent = has ? it.n : 'ยังไม่เจอ';
      d.appendChild(e); d.appendChild(n);
      g.appendChild(d);
    });
    body.appendChild(g);
    const tip = document.createElement('div');
    tip.className = 'hbk-tip';
    tip.textContent = {
      fish:    'ไปตกปลาที่บ่อน้ำใหญ่กับริมทะเลได้เลย ปลาคนละชุดกันนะ',
      crop:    'ปลูกผักที่แปลงหน้าบ้านแล้วเก็บตอนโตเต็มที่ จะได้จดลงสมุด',
      critter: 'เดินเล่นในเมืองแล้วแตะสัตว์ที่เจอ ทั้งสัตว์ป่าและสัตว์ในฟาร์ม',
      trick:   'สอนท่าให้เพื่อนตัวน้อยจนน้องทำเองได้ ท่านั้นจะมาอยู่ในสมุดตลอดไป',
    }[tab] || '';
    body.appendChild(tip);
  }
  function renderPhoto(body){
    const p = PL();
    const n = shots().length, max = (p && p.PHOTO_MAX) || 12;
    const d = document.createElement('div');
    d.className = 'hbk-photo';
    d.innerHTML = '<span class="hbk-photo-e">' + ICO('ui-photo', '📷', 30) + '</span>'
      + '<span class="hbk-photo-tx">เก็บรูปไว้ ' + n + '/' + max + ' ใบ<i>'
      + 'ถ่ายรูปได้ที่ปุ่มกล้องมุมขวาบน ถ่ายที่ไหนก็ได้เลย</i></span>';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hpl-btn';
    b.id = 'hbk-album';
    b.textContent = 'เปิดอัลบั้ม';
    b.onclick = ()=>{
      if(typeof playClick === 'function') playClick();
      close();
      if(p && p.photoAlbumOpen) p.photoAlbumOpen();
    };
    d.appendChild(b);
    body.appendChild(d);
  }

  /* ============================================================
     🔓 เครื่องมือเทส — ปลดล็อกสมุดสะสมทั้งเล่ม (เรียกจากหน้า "ปรับค่าต่างๆ")
     ⚠ แต่ละแท็บอยู่คนละที่กันจริงๆ **ห้ามยัดลง `book` ก้อนเดียวให้จบ**
       ปลา  → `play.fish.book`  (HousePlay.devFishAll)
       รูป  → `play.photo.shots`(HousePlay.devPhotoFill)
       ผัก/สัตว์/ท่าน้อง → คีย์ `book` ของไฟล์นี้
     ไม่งั้นตัวเลขบนแท็บกับของจริงในเกมจะไม่ตรงกัน (สมุดอ่านจากแหล่งจริงเสมอ)
     ============================================================ */
  function devMarkAll(kind){
    const s = state(); if(!s) return 0;
    const ids = allList(kind).map(x => x.id);
    if(!ids.length) return 0;
    s[kind] = ids.slice();
    persist();
    checkPrize();
    if(isOpen()) render();
    return ids.length;
  }
  function devUnlockAll(){
    const out = {fish:0, photo:0, crop:0, critter:0, trick:0};
    const p = PL();
    if(p && p.devFishAll)    out.fish  = p.devFishAll(true);
    if(p && p.devPhotoFill)  out.photo = p.devPhotoFill(true);
    ['crop', 'critter', 'trick'].forEach(k => { out[k] = devMarkAll(k); });
    checkPrize();
    if(isOpen()) render();
    return out;
  }
  function devClearAll(){
    const s = state();
    if(s){ s.critter = []; s.crop = []; s.trick = []; s.prizes = []; persist(); }
    const p = PL();
    if(p && p.devFishAll)   p.devFishAll(false);
    if(p && p.devPhotoFill) p.devPhotoFill(false);
    if(isOpen()) render();
    return true;
  }

  window.HouseBook = {
    open, close, isOpen, render,
    mark, counts, state, sync, checkPrize,
    devMarkAll, devUnlockAll, devClearAll,
    CRITTERS, PRIZES, TABS,
    tab: () => tab,
    /* ชุดเทส: คลังของแต่ละแท็บและของที่เก็บได้แล้ว */
    all: allList, got: gotList,
  };

  {
    const c = $('hbk-close');
    if(c) c.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); close(); });
  }
})();
