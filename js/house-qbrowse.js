/* ============================================================
   บ้านของหนู — หน้า "คลังคำถาม" (หน้าเทส)

   ทำไมต้องมี: โจทย์ในโหมดบ้าน**สุ่มทั้งหมด** (seeded รายวัน) เปิดเล่นเองยังไงก็ไม่มีทางรู้ว่า
   คลังมีโจทย์แบบไหนบ้าง และข้อไหนวาดออกมาแล้วเพี้ยน หน้านี้จึงกางของจริงออกมาเป็นตาราง
   แบ่งตาม **ระดับชั้น × กลไก (mechanic)** แล้วกดเล่นทีละข้อได้ด้วยเส้นทางวาดจริงของเกม

   ⚠ กติกาของไฟล์นี้:
     - **อ่านอย่างเดียว** ไม่แตะ state เควสต์/เงิน/โควตารายวันเลยแม้แต่นิดเดียว
       (เล่นในหน้านี้ไม่ได้เหรียญ ไม่กินโควตา ไม่ทำสถิติประตูความพร้อมเพี้ยน — ดู finishTestQuest ใน js/house.js)
     - ข้อมูลทั้งหมดมาจาก `window.HouseQuests` (catalogQuiz/catalogCats/catalogCount/countKinds/testRun)
       ⇒ เพิ่ม mechanic ใหม่ในตาราง MECHS ของ js/house-quests.js แล้วมาเพิ่มแท็บที่ MECH_TABS ข้างล่างที่เดียว
     - เล่นจริงผ่าน `window.HouseQuestUI.playTest()` ใน js/house.js (หน้านี้ไม่มี engine ของตัวเอง)

   โหลดแบบ lazy ต่อท้าย house.js ใน js/games-ar.js — เปิดออกมาที่ `window.HouseQB`
   ============================================================ */
(function(){
  'use strict';

  /* ============================================================
     🔒 QB_FEATURE_OFF — สวิตช์เปิด/ปิดหน้านี้ **จุดเดียวในทั้งโปรเจค**

     `true`  = เห็นปุ่ม 📚 ในเมนูเฟือง (ใช้บน branch `feature/house-owl` ระหว่างพัฒนา/เทสทั้ง 9 เฟส)
     `false` = ซ่อนปุ่ม + เปิดหน้านี้ไม่ได้เลย (**ค่าที่ต้องใช้ทุกครั้งที่ merge ขึ้น `main`/deploy จริง**)

     ⚠️ **ก่อน merge เข้า `main` ทุกครั้งต้องตั้งเป็น `false`** — นี่คือเครื่องมือเทส ไม่ใช่ของให้เด็กเล่น
     ปิดที่นี่ที่เดียวพอ ไม่ต้องไปแก้ index.html/CSS (ใช้ inline style ซ่อนปุ่ม จึงไม่ติดกับดัก
     specificity แบบ `.house-entry-btn[hidden]` ที่เคยเจอมาแล้ว) แล้วเทสชุด
     `tests/house-qbrowse.spec.js` จะข้ามตัวเองอัตโนมัติ เทสยังเขียวครบเหมือนเดิม
     ============================================================ */
  const QB_ENABLED = true;

  const $ = id => document.getElementById(id);

  /* แท็บกลไก — เพิ่ม mechanic ใหม่ในเฟส 5-7 แล้วมาต่อแถวนี้ */
  const MECH_TABS = [
    {id:'quiz',    ic:'📝', name:'ตอบคำถาม'},
    {id:'count',   ic:'🔢', name:'นับของ'},
    /* เฟส 4B — มินิเกมครอบครัว (ในเกมจริงโผล่เฉพาะเควสต์ของพ่อ/แม่ วันละชุด) */
    {id:'tidy',     ic:'🧹', name:'เก็บของเข้าที่'},
    {id:'laundry',  ic:'🧺', name:'แยกผ้าซัก'},
    {id:'cook',     ic:'🍳', name:'ช่วยทำอาหาร'},
    {id:'routine',  ic:'🕰️', name:'กิจวัตรของหนู'},
    {id:'petfeed',  ic:'🐾', name:'เตือนเรื่องสัตว์'},
    {id:'budget',   ic:'💰', name:'ใช้เงินให้พอ'},
    {id:'shopping', ic:'🛒', name:'จำของที่แม่สั่ง'},
    {id:'clock',    ic:'⏰', name:'ตื่นให้ตรงเวลา'},
    {id:'dinner',   ic:'🍽️', name:'กินข้าวพร้อมหน้า'},
    {id:'market',   ic:'🏪', name:'ไปซื้อของให้แม่'},
    {id:'orderlearn', ic:'📚', name:'เรียงลำดับ (คลังหน้าหลัก)'},
    {id:'sortcat',    ic:'🗂️', name:'จัดหมวดของ (คลังหน้าหลัก)'},
    /* เฟส 5 — ยืม engine เกมของหน้าหลักมาเล่นในการ์ดเควสต์ */
    {id:'mix',      ic:'🎨', name:'ผสมสี (เกมหน้าหลัก)'},
    {id:'memory',   ic:'🎴', name:'จับคู่ความจำ (เกมหน้าหลัก)'},
    {id:'balance',  ic:'⚖️', name:'ตาชั่งวิเศษ (เกมหน้าหลัก)'},
    {id:'clockset', ic:'🕐', name:'นาฬิกาวิเศษ (เกมหน้าหลัก)'},
    {id:'shadow',   ic:'🫥', name:'ทายเงา (เกมหน้าหลัก)'},
    {id:'sortcat2', ic:'🗂️', name:'จัดหมวดหมู่ (เกมหน้าหลัก)'},
    {id:'orderg',   ic:'🔢', name:'เรียงลำดับ (เกมหน้าหลัก)'},
    {id:'melody',   ic:'🎹', name:'เล่นตามทำนอง (เกมหน้าหลัก)'},
  ];
  const SORT_MECHS = ['tidy', 'laundry'];
  /* มินิเกมที่สร้างโจทย์เองล้วน ไม่มีคลังตายตัวให้กาง ⇒ หน้านี้บอกกติกา + ปุ่มสุ่มเล่นอย่างเดียว */
  const PLAY_MECHS = ['cook', 'routine', 'petfeed', 'budget', 'shopping', 'clock', 'dinner', 'market',
                      'orderlearn', 'sortcat',
                      /* เฟส 5 — เกมที่ยืม engine หน้าหลักมา */
                      'mix', 'memory', 'balance', 'clockset', 'shadow', 'sortcat2', 'orderg', 'melody'];
  const MECH_HOW = {
    cook:     'ลากขั้นตอนทำอาหารไปวางในช่อง 1-N ให้ถูกลำดับ · ชั้นเล็ก 3 ขั้น ชั้นโต 5 ขั้น',
    routine:  'ลากกิจวัตรประจำวันไปเรียงว่าทำอะไรก่อนหลัง · ชั้นเล็ก 3 ขั้น ชั้นโต 5 ขั้น',
    petfeed:  'ลากอาหารไปให้สัตว์ที่กินของนั้น · ตารางอาหารมาจาก js/house-pet-care.js ตัวจริง',
    budget:   'เลือกของให้ครบจำนวนโดยรวมราคาไม่เกินงบ · มีคำตอบถูกได้หลายชุด',
    shopping: 'ดูรายการของที่แม่สั่งก่อน แล้วหยิบให้ครบจากชั้นวาง',
    clock:    'ดูหน้าปัดนาฬิกาแล้วตอบว่ากี่โมง · ชั้นเล็กเป็นชั่วโมงเต็ม ชั้นโตมีนาที',
    dinner:   'เควสต์เดิน: รับงานแล้วการ์ดปิด เด็กเดินไปนั่งโต๊ะ/เก้าอี้ในบ้าน = จบงาน (ต้องมีโต๊ะหรือเก้าอี้ในบ้านก่อน)',
    market:   'เควสต์เดิน: จำรายการที่บ้าน → เดินไปตลาด → พอถึงตลาดกระดานซื้อของเด้งขึ้นเอง',
    orderlearn: 'ลากเรียงลำดับจากคลัง ORDER_SETS ของเกมหน้าหลัก (แยกตามระดับชั้น ป.4-ป.6) — ชั้นที่ไม่มีคลังจะไม่ถูกแจกเกมนี้',
    sortcat:  'ลากของลงหมวดจากคลัง EF_CATEGORIES ของเกม "นกฮูกสั่ง" ในหน้าหลัก (ผลไม้/สัตว์บก/ยานพาหนะ/ของกิน/แมลง/สัตว์น้ำ)',
    mix:      'ยืม engine เกม "ผสมสี" ของหน้าหลักมาเล่นในการ์ดเควสต์ (1 เควสต์ = 1 รอบเกม)',
    memory:   'ยืม engine เกม "จับคู่ความจำ" ของหน้าหลัก',
    balance:  'ยืม engine เกม "ตาชั่งวิเศษ" ของหน้าหลัก',
    clockset: 'ยืม engine เกม "นาฬิกาวิเศษ" ของหน้าหลัก (ลากเข็มจริง ไม่ใช่แค่อ่านหน้าปัด)',
    shadow:   'ยืม engine เกม "ทายเงา" ของหน้าหลัก',
    sortcat2: 'ยืม engine เกม "จัดหมวดหมู่" ของหน้าหลัก',
    orderg:   'ยืม engine เกม "เรียงลำดับ" ของหน้าหลัก',
    melody:   'ยืม engine เกม "ดนตรี/เล่นตามทำนอง" ของหน้าหลัก',
  };
  const KIND_LABEL = {img:'🖼️ ภาพ', pattern:'🔮 แพทเทิร์น', emoji:'😀 อิโมจิ', text:'🔤 ข้อความ'};
  const SUBJ_LABEL = {math:'เลข', thai:'ไทย', eng:'อังกฤษ', iq:'เชาว์', sci:'วิทย์',
                      social:'สังคม', art:'ศิลปะ', misc:'อื่นๆ'};
  /* ชื่อไทยของธีมของในกลไก `count` (คีย์ = ITEM_SETS ใน js/house-quests.js) */
  const THEME_LABEL = {fruit:'ผลไม้', snack:'ขนม', food:'อาหาร', ice:'ของหวานเย็น', toy:'ของเล่น',
                       animal:'สัตว์เลี้ยง', farm:'ไร่นา', plant:'ต้นไม้', sea:'ทะเล', tool:'เครื่องมือช่าง',
                       book:'เครื่องเขียน', music:'ดนตรี', lab:'ห้องแล็บ', home:'ของในบ้าน',
                       dress:'เสื้อผ้า', town:'ของในเมือง'};

  let gid  = '';          /* ระดับชั้นที่เลือกอยู่ */
  let mech = 'quiz';
  let catId = '';         /* '' = ทุกหมวด (แท็บกลไก quiz เท่านั้น) */

  function Q(){ return window.HouseQuests || null; }
  function grades(){ const q = Q(); return (q && q.GRADES) || (typeof GRADES !== 'undefined' ? GRADES : []); }
  function isOpen(){ const el = $('house-qb'); return !!el && !el.hidden; }

  /* ---------- ตัวช่วยสร้าง element (ไม่มี innerHTML กับข้อความจากคลัง — โจทย์บางข้อมี < > ปนอยู่) ---------- */
  function el(tag, cls, txt){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(txt != null) e.textContent = txt;
    return e;
  }
  function chip(label, on, fn){
    const b = el('button', 'hqb-chip' + (on ? ' on' : ''), label);
    b.type = 'button';
    b.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); fn(); });
    return b;
  }
  function cell(row, cls, txt){ row.appendChild(el('td', cls, txt)); }
  /* หัวตาราง: ใส่ class เดียวกับ td ของคอลัมน์นั้นเสมอ — จอแคบซ่อนคอลัมน์ด้วย class เดียว หัวกับตัวจะได้หายพร้อมกัน */
  function head(cols){
    const th = el('thead'), hr = el('tr');
    cols.forEach(c => hr.appendChild(el('th', c.c, c.t)));
    th.appendChild(hr);
    return th;
  }
  function clip(s, n){
    s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    const a = Array.from(s);
    return a.length > n ? a.slice(0, n).join('') + '…' : s;
  }

  /* ---------- แถบกรอง ---------- */
  function renderTabs(){
    const gw = $('hqb-grades');
    gw.innerHTML = '';
    grades().forEach(g=>{
      gw.appendChild(chip((g.emoji ? g.emoji + ' ' : '') + (g.short || g.name || g.id), g.id === gid,
        ()=>{ gid = g.id; catId = ''; render(); }));
    });
    const mw = $('hqb-mechs');
    mw.innerHTML = '';
    MECH_TABS.forEach(m=>{
      mw.appendChild(chip(m.ic + ' ' + m.name, m.id === mech,
        ()=>{ mech = m.id; catId = ''; render(); }));
    });
    /* แถบหมวดมีเฉพาะกลไก quiz (count ไม่ได้ดึงจากคลัง CATS) */
    const cw = $('hqb-cats');
    cw.innerHTML = '';
    cw.hidden = (mech !== 'quiz');
    if(mech !== 'quiz') return;
    const cats = Q().catalogCats(gid);
    cw.appendChild(chip('ทั้งหมด', catId === '', ()=>{ catId = ''; render(); }));
    cats.forEach(c=>{
      cw.appendChild(chip(c.emoji + ' ' + c.name + ' (' + c.n + ')', c.id === catId,
        ()=>{ catId = c.id; render(); }));
    });
  }

  /* ---------- ตาราง: กลไก quiz ---------- */
  function renderQuiz(wrap, sum){
    const all  = Q().catalogQuiz(gid);
    const rows = catId ? all.filter(r => r.catId === catId) : all;
    const cnt  = {img:0, pattern:0, emoji:0, text:0};
    all.forEach(r => { cnt[r.kind]++; });
    sum.textContent = rows.length + ' ข้อ จาก ' + Q().catalogCats(gid).length + ' หมวด'
      + ' · ทั้งชั้นนี้: ' + KIND_LABEL.text + ' ' + cnt.text
      + ' · ' + KIND_LABEL.emoji + ' ' + cnt.emoji
      + ' · ' + KIND_LABEL.pattern + ' ' + cnt.pattern
      + ' · ' + KIND_LABEL.img + ' ' + cnt.img;

    const tb = el('table', 'hqb-table');
    tb.appendChild(head([{t:'#', c:'hqb-n'}, {t:'หมวด', c:'hqb-cat'}, {t:'วิชา', c:'hqb-subj'},
                         {t:'ชนิด', c:'hqb-kind'}, {t:'โจทย์', c:'hqb-q'},
                         {t:'เฉลย', c:'hqb-ans'}, {t:'', c:'hqb-go'}]));
    const bd = el('tbody');
    let lastCat = '';
    rows.forEach((r, n)=>{
      /* หัวกลุ่มคั่นเมื่อดู "ทั้งหมด" — ไม่งั้นเลื่อนไปสักพักจะไม่รู้แล้วว่าอยู่หมวดไหน */
      if(!catId && r.catId !== lastCat){
        lastCat = r.catId;
        const gr = el('tr', 'hqb-grp');
        const gc = el('td', null, r.catEmoji + ' ' + r.catName);
        gc.colSpan = 7;
        gr.appendChild(gc); bd.appendChild(gr);
      }
      const tr = el('tr', 'hqb-row');
      cell(tr, 'hqb-n', String(n + 1));
      cell(tr, 'hqb-cat', r.catEmoji + ' ' + r.catName);
      cell(tr, 'hqb-subj', SUBJ_LABEL[r.subj] || r.subj);
      cell(tr, 'hqb-kind', KIND_LABEL[r.kind] || r.kind);
      /* โจทย์ภาพไม่มีข้อความเลย ⇒ โชว์ชื่อไฟล์รูปแทน จะได้ตามไปดูของจริงได้ */
      const qTxt = r.q ? r.q
                 : (r.img ? '🖼️ ' + r.img.split('/').pop()
                 : (r.pattern ? r.pattern.join(' ') + ' ?' : '—'));
      cell(tr, 'hqb-q', (r.emoji ? r.emoji + ' ' : '') + clip(qTxt, 64));
      cell(tr, 'hqb-ans', clip(r.answer, 18) + ' (' + r.nCh + ' ตัวเลือก)');
      const td = el('td', 'hqb-go');
      td.appendChild(playBtn('▶', {mech:'quiz', gid:gid, catId:r.catId, qIdx:r.i,
                                   title:'🧪 ' + r.catEmoji + ' ' + r.catName}));
      tr.appendChild(td);
      bd.appendChild(tr);
    });
    tb.appendChild(bd);
    wrap.appendChild(tb);
    if(!rows.length) wrap.appendChild(el('div', 'hqb-empty', 'ระดับชั้นนี้ยังไม่มีคลังคำถาม — ในเกมจริงจะถอยไปใช้กลไก "นับของ" แทน (กันทางตัน)'));
  }

  /* ---------- ตาราง: กลไก count (สร้างโจทย์เอง ไม่มีคลังตายตัว ⇒ กางเป็นธีมของ) ---------- */
  function renderCount(wrap, sum){
    const rows = Q().catalogCount(gid);
    const k    = Q().countKinds(gid);
    const d    = rows[0] || {qN:0, kinds:0, countMax:0};
    sum.textContent = rows.length + ' ธีมของ · ชั้นนี้: ' + d.qN + ' ข้อ/เควสต์ · ของ '
      + d.kinds + ' ชนิดปนกัน · มากสุด ' + d.countMax + ' ชิ้น · แบบโจทย์: ' + k.join(' / ');

    const tb = el('table', 'hqb-table');
    tb.appendChild(head([{t:'#', c:'hqb-n'}, {t:'ธีม', c:'hqb-cat'}, {t:'ชุดของ', c:'hqb-items'},
                         {t:'ใครออกโจทย์แบบนี้', c:'hqb-npc'},
                         {t:'ตัวอย่างที่สุ่มได้', c:'hqb-q'}, {t:'', c:'hqb-go'}]));
    const bd = el('tbody');
    rows.forEach((r, n)=>{
      const tr = el('tr', 'hqb-row');
      cell(tr, 'hqb-n', String(n + 1));
      cell(tr, 'hqb-cat', (THEME_LABEL[r.theme] || r.theme) + ' (' + r.theme + ')');
      cell(tr, 'hqb-items', r.items.join(' '));
      cell(tr, 'hqb-npc', r.npcs.length ? clip(r.npcs.join(', '), 40) + ' (' + r.npcs.length + ')' : '— ไม่มี NPC ใช้ธีมนี้');
      cell(tr, 'hqb-q', clip(r.sample.show, 28) + ' → ' + r.sample.q + ' = ' + r.sample.answer);
      const td = el('td', 'hqb-go');
      td.appendChild(playBtn('▶', {mech:'count', gid:gid, theme:r.theme,
                                   title:'🧪 นับของ · ' + (THEME_LABEL[r.theme] || r.theme)}));
      tr.appendChild(td);
      bd.appendChild(tr);
    });
    tb.appendChild(bd);
    wrap.appendChild(tb);
  }

  /* ---------- เล่นแบบทดสอบ ---------- */
  function playBtn(label, opt){
    const b = el('button', 'hqb-play', label);
    b.type = 'button';
    b.setAttribute('aria-label', 'เล่นทดสอบ');
    b.addEventListener('click', ()=>{ if(typeof playClick === 'function') playClick(); play(opt); });
    return b;
  }
  /* ซ่อนตารางไว้ก่อนแล้วค่อยเปิดคืนตอนปิดการ์ดเควสต์ — เด็ก/คนเทสจะได้กลับมาที่แถวเดิม */
  function play(opt){
    const ui = window.HouseQuestUI;
    if(!ui || !ui.playTest){
      if(typeof showToast === 'function') showToast('🧪', 'ยังเปิดโหมดทดสอบไม่ได้ ลองเข้าบ้านใหม่อีกครั้งนะ');
      return;
    }
    $('house-qb').hidden = true;
    ui.playTest(opt, ()=>{ $('house-qb').hidden = false; });
  }

  /* ---------- ตาราง: กลไกจัดของลงถัง (เฟส 4B) ---------- */
  function renderSort(wrap, sum){
    const c = Q().catalogSort(mech, gid);
    if(!c){ wrap.appendChild(el('div', 'hqb-empty', 'ไม่มีข้อมูลกลไกนี้')); return; }
    sum.textContent = c.rounds + ' กระดาน/เควสต์ · ชั้นนี้: ถัง ' + c.binN + ' ใบ · ของ '
      + c.tileN + ' ชิ้น/กระดาน · คลังของทั้งหมด '
      + c.bins.reduce((a, b) => a + b.items.length, 0) + ' ชิ้น';

    const tb = el('table', 'hqb-table');
    tb.appendChild(head([{t:'#', c:'hqb-n'}, {t:'ถัง', c:'hqb-cat'},
                         {t:'ของที่ต้องอยู่ถังนี้', c:'hqb-q'}, {t:'', c:'hqb-go'}]));
    const bd = el('tbody');
    c.bins.forEach((b, n)=>{
      const tr = el('tr', 'hqb-row');
      cell(tr, 'hqb-n', String(n + 1));
      cell(tr, 'hqb-cat', b.emoji + ' ' + b.name);
      cell(tr, 'hqb-q', b.items.join(' '));
      const go = el('td', 'hqb-go');
      go.appendChild(playBtn('▶', {mech:mech, gid:gid,
        title:'🧪 ' + c.emoji + ' ' + c.name + ' · ' + b.name}));
      tr.appendChild(go);
      bd.appendChild(tr);
    });
    tb.appendChild(bd);
    wrap.appendChild(tb);
    wrap.appendChild(el('div', 'hqb-empty',
      'กลไกนี้สร้างโจทย์เองทั้งหมด ไม่มีคลังคำถามตายตัว — ปุ่ม ▶ ทุกแถวสุ่มกระดานชุดใหม่เหมือนกัน '
      + '(ในเกมจริงโผล่เฉพาะเควสต์ครอบครัว วันละ 1 ชุด)'));
  }

  /* ---------- มินิเกมที่สร้างโจทย์เองล้วน: บอกกติกา + กดเล่นได้เลย ---------- */
  function renderPlayOnly(wrap, sum){
    const tab = MECH_TABS.filter(t => t.id === mech)[0] || {};
    const walk = (Q().MECHS[mech] || {}).walk;
    sum.textContent = (MECH_HOW[mech] || '')
      + (walk ? ' · งานเดิน (ไม่เข้ากติกาขั้นต่ำ 5 ข้อ)' : ' · ' + Q().MIN_Q + ' ข้อ/เควสต์');
    const box = el('div', 'hqb-empty',
      'กลไกนี้สุ่มโจทย์ใหม่ทุกครั้ง ไม่มีคลังคำถามตายตัวให้กาง — กดปุ่มข้างล่างเพื่อเล่นทดสอบได้เลย '
      + '(ในเกมจริงโผล่เฉพาะเควสต์ครอบครัว วันละ 1 ชุด)');
    wrap.appendChild(box);
    const row = el('div', 'hqb-playrow');
    const b = el('button', 'hqb-go-btn', '▶ เล่นทดสอบ ' + (tab.ic || '') + ' ' + (tab.name || mech));
    b.type = 'button';
    b.addEventListener('click', ()=>{
      if(typeof playClick === 'function') playClick();
      play({mech:mech, gid:gid, title:'🧪 ' + (tab.ic || '') + ' ' + (tab.name || mech)});
    });
    row.appendChild(b);
    wrap.appendChild(row);
  }

  /* ---------- วาดใหม่ทั้งหน้า ---------- */
  function render(){
    if(!Q()) return;
    renderTabs();
    const wrap = $('hqb-wrap');
    const sum  = $('hqb-sum');
    wrap.innerHTML = '';
    wrap.scrollTop = 0;
    if(PLAY_MECHS.indexOf(mech) >= 0) renderPlayOnly(wrap, sum);
    else if(SORT_MECHS.indexOf(mech) >= 0) renderSort(wrap, sum);
    else if(mech === 'count') renderCount(wrap, sum);
    else renderQuiz(wrap, sum);
    const rnd = $('hqb-random');
    if(rnd){
      const tab = MECH_TABS.filter(t => t.id === mech)[0];
      rnd.textContent = (mech === 'quiz')
        ? '▶ สุ่มเล่นชุดเต็ม' + (catId ? ' (เฉพาะหมวดนี้)' : '')
        : '▶ สุ่มเล่นชุดเต็ม (' + ((tab && tab.name) || mech) + ')';
    }
  }

  /* ---------- เปิด/ปิด ---------- */
  function open(){
    if(!QB_ENABLED) return;
    const q = Q();
    if(!q){
      if(typeof showToast === 'function') showToast('📚', 'คลังคำถามยังไม่พร้อม ลองเข้าบ้านใหม่อีกครั้งนะ');
      return;
    }
    if(!gid){
      /* เปิดครั้งแรกให้ยืนอยู่ที่ชั้นของเด็กคนนี้ก่อน (ตรงกับที่เขาเจอในเกมจริง) */
      const gs  = grades();
      const own = q.ownGrade ? q.ownGrade() : '';
      gid = gs.some(g => g.id === own) ? own : ((gs[0] && gs[0].id) || '');
    }
    render();
    $('house-qb').hidden = false;
  }
  function close(){ const e = $('house-qb'); if(e) e.hidden = true; }

  $('hqb-close').addEventListener('click', ()=>{
    if(typeof playClick === 'function') playClick();
    close();
  });
  /* ปุ่มล่าง: สุ่มชุดเต็มเหมือนเควสต์จริง (จำนวนข้อตามระดับชั้น) — ไล่กดทีละข้อไม่ไหวก็ใช้ตัวนี้ */
  $('hqb-random').addEventListener('click', ()=>{
    if(typeof playClick === 'function') playClick();
    if(PLAY_MECHS.indexOf(mech) >= 0 || SORT_MECHS.indexOf(mech) >= 0){
      const tab = MECH_TABS.filter(t => t.id === mech)[0];
      play({mech:mech, gid:gid, title:'🧪 สุ่มชุดเต็ม · ' + ((tab && tab.name) || mech)});
      return;
    }
    if(mech === 'count'){
      const ts = Q().catalogCount(gid);
      const t  = ts.length ? ts[(Math.random() * ts.length) | 0].theme : 'town';
      play({mech:'count', gid:gid, theme:t,
            title:'🧪 สุ่มชุดเต็ม · นับ' + (THEME_LABEL[t] || t)});
    }else{
      play({mech:'quiz', gid:gid, catId:catId, title:'🧪 สุ่มชุดเต็ม · ตอบคำถาม'});
    }
  });

  /* ปิดอยู่ → ซ่อนปุ่มในเมนูเฟืองทิ้งไปเลย (inline style ชนะ .icon-btn{display:inline-flex} เสมอ
     ไม่ต้องพึ่ง CSS rule เพิ่ม จึงลืมไม่ได้และปิดไม่ครึ่งๆ กลางๆ) */
  if(!QB_ENABLED){
    const b = $('house-qb-btn');
    if(b) b.style.display = 'none';
  }

  window.HouseQB = {open, close, isOpen, render, enabled:QB_ENABLED};
})();
