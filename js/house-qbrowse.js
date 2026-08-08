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

  const $ = id => document.getElementById(id);

  /* แท็บกลไก — เพิ่ม mechanic ใหม่ในเฟส 5-7 แล้วมาต่อแถวนี้ */
  const MECH_TABS = [
    {id:'quiz',  ic:'📝', name:'ตอบคำถาม'},
    {id:'count', ic:'🔢', name:'นับของ'},
  ];
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

  /* ---------- วาดใหม่ทั้งหน้า ---------- */
  function render(){
    if(!Q()) return;
    renderTabs();
    const wrap = $('hqb-wrap');
    const sum  = $('hqb-sum');
    wrap.innerHTML = '';
    wrap.scrollTop = 0;
    if(mech === 'count') renderCount(wrap, sum);
    else renderQuiz(wrap, sum);
    const rnd = $('hqb-random');
    if(rnd) rnd.textContent = (mech === 'count')
      ? '▶ สุ่มเล่นชุดเต็ม (นับของ)'
      : '▶ สุ่มเล่นชุดเต็ม' + (catId ? ' (เฉพาะหมวดนี้)' : '');
  }

  /* ---------- เปิด/ปิด ---------- */
  function open(){
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
    if(mech === 'count'){
      const ts = Q().catalogCount(gid);
      const t  = ts.length ? ts[(Math.random() * ts.length) | 0].theme : 'town';
      play({mech:'count', gid:gid, theme:t,
            title:'🧪 สุ่มชุดเต็ม · นับ' + (THEME_LABEL[t] || t)});
    }else{
      play({mech:'quiz', gid:gid, catId:catId, title:'🧪 สุ่มชุดเต็ม · ตอบคำถาม'});
    }
  });

  window.HouseQB = {open, close, isOpen, render};
})();
