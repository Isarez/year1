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
  /* ⚠ **ไอคอนของกลไกย้ายไปอยู่ที่ `MECH_IC` ใน js/house-quests.js แล้ว (2026-08-23)**
     เพราะไฟล์นี้เป็นเครื่องมือเทสที่ถูกปิดตอน deploy ⇒ ฝั่งเกมจริงมองไม่เห็นตารางนี้
     ค่า `ic:` ที่เหลืออยู่ข้างล่างเป็นแค่ **ตัวสำรอง** — ตัวจริงอ่านผ่าน `mechIc()` เสมอ
     ส่วน `name:` ยังอยู่ที่นี่โดยตั้งใจ (มีวงเล็บอธิบายเพิ่มสำหรับคนเทส เช่น "(เดิน · ทำจริง)") */
  function mechIc(id, fallback){
    const Q = window.HouseQuests;
    return (Q && Q.mechIcon && Q.mechIcon(id)) || fallback || '';
  }
  const MECH_TABS = [
    {id:'quiz',    ic:'📝', name:'ตอบคำถาม'},
    {id:'count',   ic:'🔢', name:'นับของ'},
    /* เฟส 4B — มินิเกมครอบครัว (ในเกมจริงโผล่เฉพาะเควสต์ของพ่อ/แม่ วันละชุด) */
    {id:'tidy',     ic:'🧹', name:'เก็บของเข้าที่'},
    {id:'laundry',  ic:'🧺', name:'แยกผ้าซัก'},
    {id:'cook',     ic:'🍳', name:'ช่วยทำอาหาร'},
    {id:'routine',  ic:'🕰️', name:'กิจวัตรของหนู (เดิน · ทำจริง)'},
    {id:'budget',   ic:'💰', name:'ใช้เงินให้พอ'},
    {id:'shopping', ic:'🛒', name:'ไปซื้อของที่ร้าน (เดิน · ซื้อจริง)'},
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
    /* 2026-08-15 — engine หน้าหลักอีก 12 ตัวที่เพิ่งเปิดใช้ (ผูกกับ NPC ที่เข้าธีม ดู BONUS_MECHS) */
    {id:'shopmoney', ic:'💰', name:'ร้านค้านกฮูก (เกมหน้าหลัก)'},
    {id:'slicefrac', ic:'🍕', name:'พิซซ่าเศษส่วน (เกมหน้าหลัก)'},
    {id:'caldays',   ic:'📅', name:'ปฏิทิน (เกมหน้าหลัก)'},
    {id:'timeorder', ic:'⏳', name:'เส้นเวลา (เกมหน้าหลัก)'},
    {id:'chartread', ic:'📊', name:'แผนภูมิ (เกมหน้าหลัก)'},
    {id:'globespin', ic:'🌍', name:'หมุนโลก (เกมหน้าหลัก)'},
    {id:'mirrorsym', ic:'🪞', name:'กระจกเงา (เกมหน้าหลัก)'},
    {id:'owlsay',    ic:'🦉', name:'นกฮูกสั่ง (เกมหน้าหลัก · ปิดจับเวลา)'},
    /* เฟส 13 */
    {id:'dessert',   ic:'🍰', name:'ร้านขนมตามใบสั่ง'},
    {id:'vanish',    ic:'🫥', name:'ของหายไปไหน'},
    {id:'whois',     ic:'🕵️', name:'ทายว่าใคร (เดิน)'},
    {id:'colornum',  ic:'🎨', name:'ระบายสีตามเลข'},
    /* เฟส 5 ตกค้าง — ทายเสียง (ผูกกับ NPC ร้านเครื่องดนตรี ไม่ใช่ตึกแล็บ) */
    {id:'soundguess', ic:'👂', name:'ทายเสียง (ร้านดนตรี)'},
    /* เฟส 6 — แล็บ STEM + coding */
    {id:'sinkfloat',  ic:'🌊', name:'จม หรือ ลอย (แล็บ)'},
    {id:'magnet',     ic:'🧲', name:'แม่เหล็กดูดอะไรได้ (แล็บ)'},
    {id:'states',     ic:'🧊', name:'แข็ง เหลว แก๊ส (แล็บ)'},
    {id:'habitat',    ic:'🗺️', name:'สัตว์อยู่ที่ไหน (แล็บ)'},
    {id:'plantgrow',  ic:'🌱', name:'การเติบโต (แล็บ)'},
    {id:'measure',    ic:'📏', name:'ตวงและวัด (แล็บ)'},
    {id:'codeorder',  ic:'🧾', name:'เรียงคำสั่งให้ถูก (แล็บ)'},
    {id:'codedebug',  ic:'🐞', name:'หาคำสั่งที่ผิด (แล็บ)'},
    /* เฟส 7 — กลุ่ม B (งานที่เข้ากับร้านของ NPC) + กลุ่ม D (ไอเดียจาก IDEA.md) */
    {id:'payexact',   ic:'🧾', name:'จ่ายเงินให้พอดี'},
    {id:'changeback', ic:'💵', name:'ทอนเงินที่ร้าน (เดิน · ที่ร้านจริง)'},
    {id:'stockshelf', ic:'🏪', name:'จัดชั้นวางที่ร้าน (เดิน · ที่ร้านจริง)'},
    {id:'fishcatch',  ic:'🎣', name:'ตกปลาไปส่ง (เดิน · ตกจริง)'},
    {id:'collectgive',ic:'🍃', name:'เก็บของไปให้ (เดิน · เก็บจริง)'},
    {id:'watergarden',ic:'💧', name:'ช่วยรดน้ำแปลงผัก (เดิน · รดจริง)'},
    {id:'photogive',  ic:'📷', name:'ถ่ายรูปมาให้ดู (เดิน · ถ่ายจริง)'},
    {id:'petcare',    ic:'🐾', name:'ดูแลเพื่อนตัวน้อย (เดิน · ทำจริง)'},
    {id:'pettrick',   ic:'🐕', name:'สอนท่าให้น้อง (เดิน · ทำจริง)'},
    {id:'recipeseq',  ic:'📋', name:'ทำตามสูตร'},
    {id:'traffic',    ic:'🚦', name:'ป้ายบอกทาง'},
    {id:'deliver',    ic:'📦', name:'ส่งของถึงมือ (เดิน)'},
    {id:'spotdiff',   ic:'🔍', name:'จับผิดภาพ'},
    {id:'flashcount', ic:'⚡', name:'นับแว้บเดียว'},
    {id:'dressorder', ic:'👗', name:'แต่งตัวตามโจทย์'},
    {id:'findhidden', ic:'🗺️', name:'หาของที่หาย (เดิน)'},
    /* เฟส 9 — เควสต์ดนตรี (พี่โน้ตที่ร้านเครื่องดนตรีแจก · ต้องมีเครื่องในบ้านก่อน) */
    {id:'playalong',  ic:'🎵', name:'เล่นดนตรีที่บ้าน (เดิน · เล่นเครื่องจริง)'},
    {id:'findsound',  ic:'🎺', name:'ทายเสียงเครื่องดนตรี (🔇 ทดสอบเท่านั้น)'},
    {id:'shapebuild', ic:'🧩', name:'ต่อรูปทรงตามแบบ (แล็บ)'},
    {id:'circuit',    ic:'💡', name:'ต่อวงจรให้ไฟติด (แล็บ)'},
    {id:'robot',      ic:'🤖', name:'พาหุ่นยนต์เดิน (แล็บ)'},
    {id:'codeloop',   ic:'🔁', name:'สั่งให้วนซ้ำ (แล็บ)'},
    {id:'codecond',   ic:'🔀', name:'โปรแกรมมีเงื่อนไข (แล็บ)'},
  ];
  /* ---------- กลุ่มกลไก (2026-08-16) ----------
     ⚠ เดิมโยนชิปทั้ง 57 กลไกลงแถบเดียวสูง 86px ⇒ เห็นทีละ ~2 แถว เลื่อนหาไม่เจอ อ่านชื่อไม่ทัน
       (ผู้ใช้แจ้ง 2026-08-16) ตอนนี้เลือก "กลุ่ม" ก่อน แล้วค่อยโชว์เฉพาะชิปของกลุ่มนั้น
     ⚠ **เพิ่มกลไกใหม่ต้องเติมชื่อลงกลุ่มใดกลุ่มหนึ่งที่นี่ด้วย** ตัวที่ไม่อยู่กลุ่มไหนเลยจะตกไปกลุ่ม
       "อื่นๆ" อัตโนมัติ (ไม่หายไปเงียบๆ) — มีเทสไล่ตรวจว่าทุกแท็บต้องมีกลุ่มจริง */
  const MECH_GROUPS = [
    {id:'core',  ic:'📋', name:'พื้นฐาน',
     ids:['quiz', 'count']},
    {id:'fam',   ic:'🏡', name:'ครอบครัว',
     ids:['tidy','laundry','cook','routine','budget','clock','dinner','market',
          'orderlearn','sortcat','petcare','pettrick']},
    {id:'eng',   ic:'🎮', name:'ยืม engine หน้าหลัก',
     ids:['mix','memory','balance','clockset','shadow','sortcat2','orderg','melody','shopmoney',
          'slicefrac','caldays','timeorder','chartread','globespin','mirrorsym','owlsay',
          'shapebuild','circuit','robot','codeloop','codecond']},
    {id:'lab',   ic:'🔬', name:'ตึกแล็บ',
     ids:['sinkfloat','magnet','states','habitat','plantgrow','measure','codeorder','codedebug']},
    {id:'shop',  ic:'🏪', name:'ร้านค้า/ในเมือง',
     ids:['payexact','changeback','stockshelf','recipeseq','traffic','deliver',
          'findhidden','whois','fishcatch','collectgive','watergarden','photogive','shopping']},
    {id:'fun',   ic:'🎲', name:'เบาสมอง',
     ids:['spotdiff','flashcount','dressorder','dessert','vanish','colornum']},
    {id:'music', ic:'🎶', name:'ดนตรี',
     ids:['soundguess','playalong','findsound']},
  ];
  function groupOf(mid){
    for(let i = 0; i < MECH_GROUPS.length; i++)
      if(MECH_GROUPS[i].ids.indexOf(mid) >= 0) return MECH_GROUPS[i].id;
    return 'etc';
  }
  /* กลไกที่กางคลัง "ของ → ถัง" เป็นตารางให้ดูได้ (เฟส 6 เพิ่มคลัง STEM เข้ามา) */
  const SORT_MECHS = ['tidy', 'laundry', 'sinkfloat', 'magnet', 'states', 'habitat', 'stockshelf'];
  /* มินิเกมที่สร้างโจทย์เองล้วน ไม่มีคลังตายตัวให้กาง ⇒ หน้านี้บอกกติกา + ปุ่มสุ่มเล่นอย่างเดียว */
  const PLAY_MECHS = ['cook', 'routine', 'petfeed', 'budget', 'shopping', 'clock', 'dinner', 'market',
                      'orderlearn', 'sortcat',
                      /* เฟส 6 — แล็บ: ตัวที่สร้างโจทย์เองไม่มีคลังตายตัวให้กาง */
                      'plantgrow', 'measure', 'codeorder', 'codedebug', 'soundguess',
                      /* เฟส 7 — กลุ่ม B + D */
                      'payexact', 'changeback', 'recipeseq', 'traffic', 'deliver',
                      'spotdiff', 'flashcount', 'dressorder', 'findhidden', 'fishcatch',
                      'collectgive', 'watergarden', 'photogive',
                      /* ---- ชุด A + B (2026-08-16) ---- */
                      'petcare', 'pettrick',
                      /* เฟส 9 */
                      'playalong', 'findsound',
                      /* เฟส 5 — เกมที่ยืม engine หน้าหลักมา */
                      'mix', 'memory', 'balance', 'clockset', 'shadow', 'sortcat2', 'orderg', 'melody',
                      /* 2026-08-15 — เปิดเพิ่มอีก 12 ตัว */
                      'shopmoney', 'slicefrac', 'caldays', 'timeorder', 'chartread', 'globespin',
                      'mirrorsym', 'owlsay', 'dessert', 'vanish', 'whois', 'colornum',
                      /* เฟส 6 — แล็บ STEM/coding ที่ยืม engine หน้าหลักมาเช่นกัน */
                      'shapebuild', 'circuit', 'robot', 'codeloop', 'codecond'];
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
    shopmoney:'ยืม engine เกม "ร้านค้านกฮูก" ของหน้าหลัก — แจกโดยร้านค้าทุกชนิดในเมือง',
    slicefrac:'ยืม engine เกม "พิซซ่าเศษส่วน" — แจกโดยร้านอาหาร/ไอศกรีม/รถเข็นของกิน',
    caldays:  'ยืม engine เกม "ปฏิทิน" — แจกโดยเทศมนตรี/ผู้ใหญ่บ้าน/ไปรษณีย์/ครู/คุณยาย',
    timeorder:'ยืม engine เกม "เส้นเวลา" — แจกโดยครู/นักเรียน/คุณยาย/นักเดินทาง',
    chartread:'ยืม engine เกม "แผนภูมิ" — แจกโดยครู/นักเรียน/ร้านสะดวกซื้อ/ห้าง',
    globespin:'ยืม engine เกม "หมุนโลก" — แจกโดยนักเดินทาง/โรงแรม/ชายหาด (มีแต่หมวด ป.3 ขึ้นไป)',
    mirrorsym:'ยืม engine เกม "กระจกเงา" — แจกโดยร้านเสื้อผ้า/นักมายากล/ตัวตลก (ป.4 ขึ้นไป)',
    whois:    'เควสต์เดิน: โชว์เงาดำของชาวบ้าน (วาดจาก look จริงใน NPC_DEFS) แล้วเด็กเดินไปหาคนนั้นในเมืองแล้วแตะ · คำใบ้บอกได้แค่ย่าน ห้ามบอกชื่อ',
    colornum: 'เลือกสีจากจานแล้วแตะช่องที่เลขตรงกัน · แตะช่องเลขไม่ตรง = ไม่มีอะไรเกิดขึ้น ไม่นับพลาด · ระบายครบได้กรอบรูปไปแขวนที่บ้าน',
    vanish:   'โชว์ของบนโต๊ะ → ผ้าคลุมลงมา → เปิดออกมาหายไป 1 ชิ้น เด็กแตะของชิ้นนั้นบนถาดตรงๆ · **ถาดมีตัวลวงที่ไม่เคยอยู่บนโต๊ะปนมาด้วย** (เด็กเล็ก 1 · ชั้นโต 2 — ผู้ใช้สั่ง 2026-08-16)',
    dessert:  'ลากวัตถุดิบไปวางในช่อง 1-N ตามลำดับที่ลูกค้าสั่ง (ล่างขึ้นบนเสมอ) · คลัง 40 ใบสั่ง · ชั้นเล็กเล่น 3 ขั้นแรก',
    owlsay:   'ยืม engine เกม "นกฮูกสั่ง" — ⚠ ตัวจับเวลาถูกปิดตอนเล่นในโหมดบ้าน (กติกาเหล็กข้อ 2 ห้ามกดดัน)',
    soundguess:'ร้านเครื่องดนตรี: ฟังเสียงแล้วตอบ 4 แบบ — ทายชื่อเพลง (10 เพลงที่เด็กรู้จัก) · เสียงสูงขึ้น/ต่ำลง (30 ลาย) · นับจำนวนเสียง · ทายชื่อโน้ต (ป.4+) · กดฟังซ้ำได้ไม่จำกัด',
    sinkfloat:'แล็บ: ลากของหย่อนน้ำ — แยกว่าจมหรือลอย (คลัง 42 ชิ้น)',
    magnet:   'แล็บ: ลากของไปจ่อแม่เหล็ก — ติดหรือไม่ติด (คลัง 40 ชิ้น · ในถัง "ติด" มีแต่ของที่เป็นเหล็ก)',
    states:   'แล็บ: แยกของแข็ง/ของเหลว/แก๊ส (คลัง 42 ชิ้น · ไม่มีของกึ่งกลางอย่างเยลลี่)',
    habitat:  'แล็บ: พาสัตว์กลับถิ่นที่อยู่ — ทะเล/ป่า/ทะเลทราย/ขั้วโลก/ฟาร์ม (46 ตัว · กระดานละไม่เกิน 4 ถัง)',
    plantgrow:'แล็บ: ลากเรียงวงจรชีวิต เมล็ด→ต้นกล้า→ดอก→ผล (40 ชุด · มีวงจรชีวิตสัตว์ด้วย)',
    measure:  'แล็บ: ตวง/วัด 3 แบบสลับกัน — เลือกหน่วยที่เหมาะ · อ่านขีดบีกเกอร์ · เทียบว่าอันไหนมากกว่า (คลัง 40 รายการ)',
    codeorder:'แล็บ: ลากบล็อกคำสั่งให้เรียงถูกลำดับก่อนกดรัน (40 ภารกิจ)',
    codedebug:'แล็บ: ในชุดคำสั่งมีบรรทัดผิดอยู่ 1 บรรทัด หาให้เจอ (40 ภารกิจ · บรรทัดปลอมเป็นคำสั่งเฉพาะทางของงานอื่นเสมอ)',
    payexact: 'ร้านค้า: หยิบเหรียญให้รวมได้พอดีราคา (มีชุดที่จ่ายพอดีได้เสมอ — สร้างคำตอบก่อนแล้วค่อยแจกเหรียญหลอก)',
    changeback:'ร้านค้า: จ่ายไปเท่านี้ ราคาเท่านี้ ต้องทอนเท่าไร (คลังของ 44 ชิ้น)',
    stockshelf:'ร้านสะดวกซื้อ/ห้าง: ลากของขึ้นชั้นให้ถูกหมวด (ผลไม้/เครื่องดื่ม/ขนมปัง/เครื่องเขียน/ของเล่น/ของใช้)',
    recipeseq:'ร้านอาหาร: เห็นสูตร 3 วิแล้วสูตรหาย ต้องเรียงขั้นตอนจากความจำ (40 สูตร)',
    traffic:  'ตำรวจ/เทศมนตรี: อ่านป้ายจราจรแล้วบอกว่าต้องทำอะไร (40 ใบ · **ไม่มีจับเวลา** ต่างจากไอเดียเดิมใน IDEA.md)',
    deliver:  'เควสต์เดิน: รับของจาก NPC คนหนึ่ง แล้วเดินไปแตะตัวอีกคนเพื่อส่งของ (คำใบ้บอกชื่อ + สถานที่)',
    spotdiff: 'จับผิดภาพย่อส่วน: 2 แถวจากฉากเดียวกัน ต่างกัน 1 ชิ้น เลือกว่าชิ้นไหนหายไป (40 ฉาก)',
    flashcount:'นับแว้บเดียว: ของโผล่ 2-3 วิแล้วหาย ถามว่ามีกี่ชิ้น · ป.4+ มีของ 2 ชนิดปนกัน · **ไม่จับเวลาตอบ**',
    dressorder:'แต่งตัวตามโจทย์: หยิบของตามชนิด+สีที่สั่ง · **แต่งหุ่นในการ์ด ไม่ผูกกับของที่เด็กซื้อจริง** (กัน dead end)',
    fishcatch:'🆕 เควสต์ "ทำจริงแล้วเอาไปส่ง" ตัวแรก: รับงานแล้วการ์ดปิด เด็กออกไป**ตกปลาด้วยระบบตกปลาจริงของเฟส 11** · **สุ่มว่าเป็นปลาบ่อหรือปลาทะเล** และ**ระบุชนิดที่ต้องการ** (เด็กเล็ก 1 ชนิด · ชั้นโต 2-3 ชนิด รวมไม่เกิน 4 ตัว) · **ไม่สั่งปลาหายาก (rare 3) และไม่สั่งของขยะ** · ตกครบแล้วเดินกลับไปแตะลุงตกปลา · ปลายังเข้าถังเด็กตามปกติ ไม่ถูกริบ · **แทนที่เกม "ตกปลาคิดเลข" ที่ถูกถอดออก 2026-08-16**',
    collectgive:'🌍 Action จริง: เดินเก็บของประจำวันที่โผล่รอบเมืองให้ครบจำนวน แล้วเอาไปส่งคนที่สั่ง · **ถูกกรองออกอัตโนมัติถ้าวันนี้เก็บครบไปแล้ว** (กันงานตัน)',
    watergarden:'🌍 Action จริง: ไปรดน้ำแปลงผักที่บ้านให้ครบจำนวนแปลง แล้วกลับไปบอกคนที่สั่ง · **ถูกกรองออกถ้าไม่มีแปลงที่รดได้วันนี้**',
    photogive:'🌍 Action จริง: กดปุ่ม 🎈 → 📷 ช่างภาพ ถ่ายรูปให้ครบ แล้วเอาไปให้คนที่สั่งดู · **ถูกกรองออกถ้าอัลบั้มเต็ม**',
    findhidden:'เควสต์เดิน: NPC บอกว่าทำของหายไว้ย่านไหน เด็กเดินไปที่ย่านนั้น = เจอ (6 ย่าน × 40 ชิ้น)',
    playalong:'ร้านดนตรี: ฟังทำนอง 3-6 โน้ตแล้วกดคีย์ตามลำดับ · กดผิดเริ่มกดใหม่ข้อนั้น ไม่มีบทลงโทษอื่น · **ต้องมีเครื่องดนตรีในบ้านก่อนถึงถูกแจก**',
    findsound:'🔇 **ปิดไม่ให้ถูกแจกเป็นเควสต์จริงแล้ว (ผู้ใช้สั่ง 2026-08-16)** — เสียงสังเคราะห์ยังไม่เหมือนเครื่องจริงพอให้เด็กแยกออก กลายเป็นโจทย์เดาสุ่ม · **เปิดไว้ที่หน้านี้อย่างเดียวเพื่อทดสอบเสียง** · ห้ามเปิดกลับจนกว่าผู้ใช้จะฟังแล้วยืนยันว่าดีพอ',
    shapebuild:'แล็บ: ยืม engine "แท็งแกรม" ของหน้าหลัก ⚠ มีหมวดแค่ ป.5-6 ⇒ ชั้นต่ำกว่าจะไม่ถูกแจกงานนี้',
    circuit:  'แล็บ: ยืม engine "ต่อวงจรไฟฟ้า" ของหน้าหลัก ⚠ มีหมวดแค่ ป.6 ⇒ ชั้นอื่นจะไม่ถูกแจกงานนี้',
    robot:    'แล็บ: ยืม engine "หุ่นยนต์" ของหน้าหลัก — ชุดด่านแบบเดินตามคำสั่งล้วน (ไม่มีวนซ้ำ/เงื่อนไข)',
    codeloop: 'แล็บ: engine หุ่นยนต์ชุดที่มีคำสั่ง "วนซ้ำ" (ป.2 ขึ้นไป)',
    codecond: 'แล็บ: engine หุ่นยนต์ชุดที่มีเงื่อนไข "ถ้าเจอกำแพงให้เลี้ยว" (ป.3 ขึ้นไป)',
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
  let grp  = 'core';      /* กลุ่มกลไกที่เลือกอยู่ */
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
    /* แถวกลุ่ม — โชว์จำนวนกลไกในกลุ่มด้วย จะได้รู้ว่ากดเข้าไปแล้วเจออะไรบ้าง */
    const grw = $('hqb-groups');
    if(grw){
      grw.innerHTML = '';
      const etc = MECH_TABS.filter(t => groupOf(t.id) === 'etc');
      const list = MECH_GROUPS.concat(etc.length ? [{id:'etc', ic:'❔', name:'อื่นๆ', ids:etc.map(t=>t.id)}] : []);
      list.forEach(g=>{
        const n = MECH_TABS.filter(t => groupOf(t.id) === g.id).length;
        grw.appendChild(chip(g.ic + ' ' + g.name + ' (' + n + ')', g.id === grp, ()=>{
          grp = g.id;
          /* เปลี่ยนกลุ่มแล้วเด้งไปกลไกตัวแรกของกลุ่มนั้นทันที — ไม่ต้องกด 2 ที */
          const first = MECH_TABS.filter(t => groupOf(t.id) === grp)[0];
          if(first) mech = first.id;
          catId = ''; render();
        }));
      });
    }
    const mw = $('hqb-mechs');
    mw.innerHTML = '';
    let onChip = null;
    MECH_TABS.filter(m => groupOf(m.id) === grp).forEach(m=>{
      /* 🚶 = งานที่ต้อง "เดินไปทำตามตำแหน่งในเมือง" ไม่ได้ตอบจบในการ์ด (ผู้ใช้ขอให้เห็นชัด 2026-08-16) */
      const walk = !!((Q().MECHS[m.id] || {}).walk);
      const c = chip(mechIc(m.id, m.ic) + ' ' + m.name + (walk ? ' 🚶' : ''), m.id === mech,
        ()=>{ mech = m.id; catId = ''; render(); });
      if(m.id === mech) onChip = c;
      mw.appendChild(c);
    });
    /* กลุ่มใหญ่สุดยังยาวเกิน 2 แถวได้ ⇒ เลื่อนชิปที่เลือกอยู่เข้ามาให้เห็นเสมอ */
    if(onChip) onChip.scrollIntoView({block:'nearest'});
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

  /* ---------- กลไกที่ยืม engine หน้าหลัก: ชั้นไหนเล่นได้บ้าง ----------
     🐞 บั๊กจริงที่ผู้ใช้เจอ 2026-08-16: กดเล่น "ตาชั่งวิเศษ/แผนภูมิ/วงจรไฟฟ้า/หุ่นยนต์ …" จากหน้านี้
        แล้ว **การ์ดเด้งไปหน้าสรุปทันทีเหมือนเล่นจบแล้ว**
        ต้นเหตุ: engine พวกนี้มีหมวดเฉพาะบางระดับชั้น (วงจรไฟฟ้ามีแต่ ป.6 · แท็งแกรม ป.5-6 · ตาชั่ง ป.3+ …)
        ในเกมจริง `engineReady()` กรองไว้ไม่ให้แจกงานที่ชั้นนั้นเล่นไม่ได้ **แต่หน้าเทสนี้ข้ามด่านนั้น**
        ⇒ `startEngineGame()` หา `pickCat()` ไม่เจอ เลยเรียก `finishEngineRound(0)` = จบชุดเงียบๆ
     ⇒ หน้านี้ต้องเช็คเองก่อนโชว์ปุ่ม แล้วบอกตรงๆ ว่าชั้นไหนเล่นได้ พร้อมปุ่มกระโดดไปชั้นนั้น */
  function engineGrades(mid){
    const m = (Q().MECHS || {})[mid];
    const G = window.HouseGames;
    if(!m || !m.engine || !G || !G.pickCat) return null;   /* ไม่ใช่กลไกยืม engine */
    const ok = grades().filter(g => !!G.pickCat(m.engine, g.id, m.pick || ''));
    return {engine:m.engine, pick:m.pick || '', ok:ok};
  }
  /* ---------- มินิเกมที่สร้างโจทย์เองล้วน: บอกกติกา + กดเล่นได้เลย ---------- */
  function renderPlayOnly(wrap, sum){
    const tab = MECH_TABS.filter(t => t.id === mech)[0] || {};
    const walk = (Q().MECHS[mech] || {}).walk;
    sum.textContent = (MECH_HOW[mech] || '')
      + (walk ? ' · 🚶 งานเดิน — ต้องเดินไปทำตามตำแหน่งในเมือง (ไม่เข้ากติกาขั้นต่ำ 5 ข้อ)'
              : ' · ' + Q().MIN_Q + ' ข้อ/เควสต์');

    const eg = engineGrades(mech);
    const playable = !eg || eg.ok.some(g => g.id === gid);
    wrap.appendChild(el('div', 'hqb-empty',
      'กลไกนี้สุ่มโจทย์ใหม่ทุกครั้ง ไม่มีคลังคำถามตายตัวให้กาง — กดปุ่มข้างล่างเพื่อเล่นทดสอบได้เลย '
      + '(ในเกมจริงโผล่เฉพาะเควสต์ครอบครัว วันละ 1 ชุด)'));
    if(eg){
      wrap.appendChild(el('div', 'hqb-note' + (playable ? '' : ' warn'),
        (playable ? '✅ ' : '⚠️ ')
        + 'เกมนี้ยืม engine "' + eg.engine + '" ของหน้าหลัก'
        + (eg.pick ? ' (ชุด ' + eg.pick + ')' : '')
        + ' ⇒ เล่นได้เฉพาะชั้นที่มีหมวดของเกมนั้นจริง: '
        + (eg.ok.length ? eg.ok.map(g => g.short || g.name || g.id).join(' · ') : 'ไม่มีเลย')
        + (playable ? '' : ' — ชั้นที่เลือกอยู่ตอนนี้เล่นไม่ได้ (กดแล้วจะเด้งไปหน้าสรุปทันที)')));
    }
    const row = el('div', 'hqb-playrow');
    if(!playable && eg && eg.ok.length){
      /* ชั้นที่เลือกเล่นไม่ได้ → เปลี่ยนปุ่มเป็น "กระโดดไปชั้นที่เล่นได้" แทนการปล่อยให้กดแล้วพัง */
      const g0 = eg.ok[0];
      const jump = el('button', 'hqb-go-btn',
        '↪ เปลี่ยนไปชั้น ' + (g0.short || g0.name || g0.id) + ' แล้วเล่น');
      jump.type = 'button';
      jump.addEventListener('click', ()=>{
        if(typeof playClick === 'function') playClick();
        gid = g0.id; catId = ''; render();
      });
      row.appendChild(jump);
    }else{
      const b = el('button', 'hqb-go-btn', '▶ เล่นทดสอบ ' + mechIc(mech, tab.ic) + ' ' + (tab.name || mech));
      b.type = 'button';
      if(!playable) b.disabled = true;
      b.addEventListener('click', ()=>{
        if(typeof playClick === 'function') playClick();
        play({mech:mech, gid:gid, title:'🧪 ' + mechIc(mech, tab.ic) + ' ' + (tab.name || mech)});
      });
      row.appendChild(b);
    }
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
    grp = groupOf(mech);          /* เปิดใหม่แล้วแถบกลุ่มต้องตรงกับกลไกที่ค้างอยู่เสมอ */
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
      /* กันกดแล้วเด้งหน้าสรุปทันที (ดูคอมเมนต์ที่ engineGrades) — ชั้นนี้เล่น engine นั้นไม่ได้ */
      const eg = engineGrades(mech);
      if(eg && !eg.ok.some(g => g.id === gid)){
        if(typeof showToast === 'function')
          showToast('⚠️', 'ชั้นนี้ยังไม่มีหมวดของเกมนี้ ลองเลือกชั้นอื่นก่อนนะ');
        return;
      }
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

  /* MECH_TABS เปิดออกมาให้ชุดเทสไล่ตรวจว่า "กลไกใหม่ทุกตัวมีแท็บครบ" (tests/house-phase67.spec.js) */
  window.HouseQB = {open, close, isOpen, render, enabled:QB_ENABLED, MECH_TABS};
})();
