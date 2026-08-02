/* ================================================================================
   หมวด/เกมของระดับชั้น ป.1
   ถูกนำไปต่อเป็นอาเรย์ CATS ตัวเดียวใน js/data-cats.js (ลำดับ = ลำดับการ์ดในหน้าหลัก)
   ================================================================================ */

const CATS_P1 = [
  /* ===================== ระดับชั้น ป.1 (grade:'p1') ===================== */
  /* หมวดใหม่ของระดับ ป.1 — reuse quiz engine เดิม แยก id/progress จากระดับเตรียมสอบ ป.1
     Phase 1.2 (วิชาหลัก): p1-math/p1-thai/p1-eng ใช้ระบบ 5 เลเวล — q.tier 1-3 = เนื้อหา ป.1 ไล่ง่าย→ยาก,
       tier 4-5 = เนื้อหาเร่ง ป.2 ต้น-กลาง (โบนัส/ท้าทาย) + p1-iq (เชาวน์/executive function)
     Phase 1.1 (ต่อยอด quick win): p1-manners/p1-emotion (EQ ครบ 5 ด้าน CASEL), p1-music/p1-art (ดนตรี/ศิลปะ), p1-nature (วัฏจักรธรรมชาติ)
     ทุกหมวดใช้ 3-5 tier + poolPick → pickQuizQuestions เกลี่ยต่อ tier เรียงง่าย→ยากอัตโนมัติ */
  /* ---------- คณิต ป.1 : 2 level + เกมหยิบตัวเลข (ar) ---------- */
  {
    id:'p1-math1', name:'คณิต ป.1 · จำนวนและการนับ', emoji:'➕', icon:'assets/icons/p1-math.svg', color:'#7C5CFC', light:'#E9E3FF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — นับ / ค่าประจำหลัก / เปรียบเทียบ / แบบรูปจำนวน (tier1 ตัวเลือกง่าย → tier2 ตัวเลือกยาก) */
      {q:'เลข 15 มีกี่สิบ กี่หน่วย?', emoji:'🔢', choices:['1 สิบ 5 หน่วย','5 สิบ 1 หน่วย','15 สิบ','1 หน่วย'], correct:0, explain:'15 = 1 สิบ กับ 5 หน่วย', tier:1},
      {q:'จำนวนใดมากที่สุด?', emoji:'📊', choices:['72','27','17','7'], correct:0, explain:'72 มากที่สุดในกลุ่มนี้', tier:1},
      {q:'40, 50, 60, ▢ ตัวต่อไปคือเท่าไร?', emoji:'🔁', choices:['70','65','80','61'], correct:0, explain:'นับเพิ่มทีละ 10 ตัวต่อไปคือ 70', tier:1},
      {q:'"สิบสาม" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['13','31','30','3'], correct:0, explain:'สิบสาม = 13', tier:1},
      {q:'นับต่อไป: 1, 2, 3, 4, ▢', emoji:'👆', choices:['5','6','4','2'], correct:0, explain:'นับเพิ่มทีละ 1 ตัวต่อไปคือ 5', tier:1},
      {q:'จำนวนใดน้อยที่สุด?', emoji:'📉', choices:['9','19','90','29'], correct:0, explain:'9 น้อยที่สุด', tier:1},
      {q:'เรียงจากมากไปน้อยข้อใดถูกต้อง?', emoji:'📉', choices:['81, 48, 18','18, 48, 81','48, 81, 18','81, 18, 48'], correct:0, explain:'81 มากสุด แล้ว 48 แล้ว 18', tier:2},
      {q:'นับทีละ 5: 5, 10, 15, ▢', emoji:'🖐️', choices:['20','16','18','25'], correct:0, explain:'นับเพิ่มทีละ 5 ตัวต่อไปคือ 20', tier:2},
      {q:'เลข 62 มีค่าประจำหลักสิบเท่าไร?', emoji:'🔢', choices:['60','6','2','62'], correct:0, explain:'เลข 6 อยู่หลักสิบ จึงมีค่า 60', tier:2},
      {q:'นับทีละ 10: 10, 20, 30, 40, ▢', emoji:'🔟', choices:['50','45','41','60'], correct:0, explain:'นับทีละ 10 ตัวต่อไปคือ 50', tier:2},
      {q:'จำนวน 14 เป็นจำนวนคู่หรือคี่?', emoji:'🔢', choices:['จำนวนคู่','จำนวนคี่','ทั้งคู่และคี่','ไม่ใช่ทั้งสอง'], correct:0, explain:'14 หารด้วย 2 ลงตัว จึงเป็นจำนวนคู่', tier:2},
      {q:'จำนวนใดอยู่ระหว่าง 17 กับ 20?', emoji:'🔢', choices:['18','16','21','15'], correct:0, explain:'18 อยู่ระหว่าง 17 กับ 20', tier:2},
      {q:'"ยี่สิบ" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['20','12','2','21'], correct:0, explain:'ยี่สิบ = 20', tier:1},
      {q:'นับต่อไป: 3, 4, 5, 6, ▢', emoji:'👆', choices:['7','8','5','9'], correct:0, explain:'นับเพิ่มทีละ 1 ตัวต่อไปคือ 7', tier:1},
      {q:'มีดาว ⭐⭐⭐⭐⭐ กี่ดวง?', emoji:'⭐', choices:['5','4','6','3'], correct:0, explain:'นับได้ 5 ดวง', tier:1},
      {q:'เรียงจากน้อยไปมากข้อใดถูกต้อง?', emoji:'📈', choices:['5, 15, 50','50, 15, 5','15, 5, 50','5, 50, 15'], correct:0, explain:'5 น้อยสุด แล้ว 15 แล้ว 50', tier:2},
      {q:'เลข 47 มีเลขในหลักหน่วยคือเลขใด?', emoji:'🔢', choices:['7','4','40','47'], correct:0, explain:'เลข 7 อยู่หลักหน่วย', tier:2},
      {q:'จำนวนใดเป็นเลขคี่?', emoji:'🔢', choices:['7','8','10','4'], correct:0, explain:'7 หารด้วย 2 ไม่ลงตัว จึงเป็นเลขคี่', tier:2},
      {q:'นับต่อไป: 5, 6, 7, ▢', emoji:'🔢', choices:['8','9','7','10'], correct:0, explain:'นับต่อไปคือ 8', tier:1},
      {q:'เลขใดมากกว่า 7?', emoji:'🔢', choices:['9','5','3','6'], correct:0, explain:'9 มากกว่า 7', tier:1},
      {q:'มีนก 3 ตัว บินมาอีก 2 ตัว รวมกี่ตัว?', emoji:'🐦', choices:['5','4','6','3'], correct:0, explain:'3 + 2 = 5 ตัว', tier:1},
      {q:'นับถอยหลัง: 10, 9, 8, ▢', emoji:'🔟', choices:['7','6','9','5'], correct:0, explain:'นับถอยหลังคือ 7', tier:2},
      {q:'เลขใดอยู่ระหว่าง 4 กับ 6?', emoji:'🔢', choices:['5','3','7','8'], correct:0, explain:'5 อยู่ระหว่าง 4 กับ 6', tier:2},
      {q:'มีลูกอม 8 เม็ด กินไป 3 เม็ด เหลือกี่เม็ด?', emoji:'🍬', choices:['5','6','4','3'], correct:0, explain:'8 - 3 = 5 เม็ด', tier:2}
    ]
  },
  {
    id:'p1-math2', name:'คณิต ป.1 · บวก ลบ คูณ', emoji:'➗', icon:'assets/icons/p1-math2.svg', color:'#5E3FE0', light:'#E9E3FF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 (เร่ง ป.2) — บวก-ลบมีทด / โจทย์ปัญหา / แนวคิดคูณ-หารแบบกลุ่ม */
      {q:'12 + 5 = ?', emoji:'➕', choices:['17','15','16','18'], correct:0, explain:'12 บวก 5 เท่ากับ 17', tier:1},
      {q:'30 - 10 = ?', emoji:'➖', choices:['20','10','25','40'], correct:0, explain:'30 ลบ 10 เท่ากับ 20', tier:1},
      {q:'มีนก 8 ตัว บินมาอีก 6 ตัว รวมกี่ตัว?', emoji:'🐦', choices:['14','12','13','15'], correct:0, explain:'8 + 6 = 14 ตัว', tier:1},
      {q:'24 + 13 = ?', emoji:'➕', choices:['37','36','38','27'], correct:0, explain:'24 บวก 13 เท่ากับ 37', tier:1},
      {q:'20 - 7 = ?', emoji:'➖', choices:['13','11','12','14'], correct:0, explain:'20 ลบ 7 เท่ากับ 13', tier:1},
      {q:'มีนก 16 ตัว บินไป 5 ตัว เหลือกี่ตัว?', emoji:'🕊️', choices:['11','9','10','12'], correct:0, explain:'16 - 5 = 11 ตัว', tier:1},
      {q:'56 - 22 = ?', emoji:'➖', choices:['34','32','33','44'], correct:0, explain:'56 ลบ 22 เท่ากับ 34', tier:2},
      {q:'38 + 7 = ? (มีการทด)', emoji:'➕', choices:['45','44','46','47'], correct:0, explain:'38 บวก 7 เท่ากับ 45', tier:2},
      {q:'45 + 27 = ?', emoji:'➕', choices:['72','62','71','82'], correct:0, explain:'45 บวก 27 เท่ากับ 72', tier:2},
      {q:'แม่มีเงิน 50 บาท ซื้อขนม 20 บาท เหลือเงินกี่บาท?', emoji:'💰', choices:['30','20','25','40'], correct:0, explain:'50 - 20 = 30 บาท', tier:2},
      {q:'มีขนม 3 ถุง ถุงละ 4 ชิ้น รวมกี่ชิ้น?', emoji:'🍬', choices:['12','7','10','16'], correct:0, explain:'4 + 4 + 4 = 12 ชิ้น (3 กลุ่ม กลุ่มละ 4)', tier:2},
      {q:'มีลูกอม 12 เม็ด กินไป 5 เม็ด แล้วแม่ให้อีก 4 เม็ด เหลือกี่เม็ด?', emoji:'🍬', choices:['11','10','12','9'], correct:0, explain:'12 - 5 = 7 แล้ว 7 + 4 = 11 เม็ด', tier:2},
      {q:'15 + 4 = ?', emoji:'➕', choices:['19','18','20','14'], correct:0, explain:'15 บวก 4 เท่ากับ 19', tier:1},
      {q:'25 - 5 = ?', emoji:'➖', choices:['20','15','30','22'], correct:0, explain:'25 ลบ 5 เท่ากับ 20', tier:1},
      {q:'7 + 8 = ?', emoji:'➕', choices:['15','14','16','13'], correct:0, explain:'7 บวก 8 เท่ากับ 15', tier:1},
      {q:'มีลูกอม 10 เม็ด กินไป 3 เม็ด เหลือกี่เม็ด?', emoji:'🍬', choices:['7','6','8','13'], correct:0, explain:'10 - 3 = 7 เม็ด', tier:1},
      {q:'34 + 29 = ?', emoji:'➕', choices:['63','62','64','53'], correct:0, explain:'34 บวก 29 เท่ากับ 63', tier:2},
      {q:'71 - 26 = ?', emoji:'➖', choices:['45','44','46','55'], correct:0, explain:'71 ลบ 26 เท่ากับ 45', tier:2},
      {q:'มีไก่ 12 ตัว ซื้อมาเพิ่ม 9 ตัว รวมมีกี่ตัว?', emoji:'🐔', choices:['21','20','22','19'], correct:0, explain:'12 + 9 = 21 ตัว', tier:2},
      {q:'48 + 25 = ?', emoji:'➕', choices:['73','72','74','63'], correct:0, explain:'48 บวก 25 เท่ากับ 73', tier:2},
      {q:'6 + 2 = ?', emoji:'➕', choices:['8','7','9','5'], correct:0, explain:'6 บวก 2 เท่ากับ 8', tier:1},
      {q:'9 - 4 = ?', emoji:'➖', choices:['5','4','6','3'], correct:0, explain:'9 ลบ 4 เท่ากับ 5', tier:1},
      {q:'65 - 28 = ?', emoji:'➖', choices:['37','36','38','47'], correct:0, explain:'65 ลบ 28 เท่ากับ 37', tier:2},
      {q:'มีดอกไม้ 7 ดอก เด็ดไป 2 ดอก เหลือกี่ดอก?', emoji:'🌷', choices:['5','4','6','3'], correct:0, explain:'7 - 2 = 5 ดอก', tier:2}
    ]
  },
  {
    /* mechanic-move: ฝึกบวก-ลบแบบลากการ์ดตัวเลข (ar-math) — reuse engine เดิม, ช่วงตัวเลขยากกว่าระดับเตรียม ป.1 */
    id:'p1-math-ar', name:'หยิบตัวเลข ป.1', emoji:'➖', icon:'assets/icons/p1-math-ar.svg', color:'#7C5CFC', light:'#E9E3FF',
    type:'ar', mode:'math', levels:10, mathTiers:[[0,10],[5,20],[10,30]], mathChoices:4, grade:'p1', isNew:true
  },
  {
    id:'p1-math3', name:'คณิต ป.1 · โจทย์ท้าทาย', emoji:'✖️', icon:'assets/icons/p1-math3.svg', color:'#4A2FC0', light:'#E9E3FF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 3 (เร่ง ป.2) — แนวคิดการคูณ / นับกระโดดขั้นสูง / โจทย์ปัญหา 2 ขั้น */
      {q:'นับทีละ 2: 2, 4, 6, 8, ▢', emoji:'🔢', choices:['10','9','12','7'], correct:0, explain:'นับเพิ่มทีละ 2 ตัวต่อไปคือ 10', tier:1},
      {q:'20 + 30 + 10 = ?', emoji:'➕', choices:['60','50','70','40'], correct:0, explain:'20 + 30 = 50 แล้ว 50 + 10 = 60', tier:1},
      {q:'นับทีละ 3: 3, 6, 9, ▢', emoji:'👣', choices:['12','10','11','15'], correct:0, explain:'นับเพิ่มทีละ 3 ตัวต่อไปคือ 12', tier:1},
      {q:'รถ 2 คัน คันละ 4 ล้อ รวมมีกี่ล้อ?', emoji:'🚗', choices:['8','6','10','4'], correct:0, explain:'4 + 4 = 8 ล้อ (2 กลุ่ม กลุ่มละ 4)', tier:1},
      {q:'100 - 50 = ?', emoji:'➖', choices:['50','40','60','150'], correct:0, explain:'100 ลบ 50 เท่ากับ 50', tier:1},
      {q:'ครึ่งหนึ่งของ 10 คือเท่าไร?', emoji:'✂️', choices:['5','2','10','15'], correct:0, explain:'10 แบ่งครึ่งได้ 5', tier:1},
      {q:'35 + 27 = ?', emoji:'➕', choices:['62','61','63','52'], correct:0, explain:'35 บวก 27 เท่ากับ 62', tier:2},
      {q:'84 - 39 = ?', emoji:'➖', choices:['45','44','46','55'], correct:0, explain:'84 ลบ 39 เท่ากับ 45', tier:2},
      {q:'นับถอยหลังทีละ 10: 90, 80, 70, ▢', emoji:'🔟', choices:['60','65','50','75'], correct:0, explain:'ลดทีละ 10 ตัวต่อไปคือ 60', tier:2},
      {q:'มีเงิน 20 บาท ซื้อขนม 5 บาท แล้วแม่ให้อีก 10 บาท ตอนนี้มีกี่บาท?', emoji:'💰', choices:['25','15','30','20'], correct:0, explain:'20 - 5 = 15 แล้ว 15 + 10 = 25 บาท', tier:2},
      {q:'45 + 38 = ?', emoji:'➕', choices:['83','73','93','82'], correct:0, explain:'45 บวก 38 เท่ากับ 83', tier:2},
      {q:'มีเงิน 60 บาท ซื้อขนม 25 บาท เหลือกี่บาท?', emoji:'💰', choices:['35','45','25','40'], correct:0, explain:'60 - 25 = 35 บาท', tier:2},
      {q:'นับทีละ 5: 25, 30, 35, ▢', emoji:'🖐️', choices:['40','45','38','50'], correct:0, explain:'นับเพิ่มทีละ 5 ตัวต่อไปคือ 40', tier:1},
      {q:'50 + 50 = ?', emoji:'➕', choices:['100','90','110','80'], correct:0, explain:'50 บวก 50 เท่ากับ 100', tier:1},
      {q:'นับทีละ 4: 4, 8, 12, ▢', emoji:'👣', choices:['16','14','15','20'], correct:0, explain:'นับเพิ่มทีละ 4 ตัวต่อไปคือ 16', tier:1},
      {q:'ครึ่งหนึ่งของ 20 คือเท่าไร?', emoji:'✂️', choices:['10','5','20','15'], correct:0, explain:'20 แบ่งครึ่งได้ 10', tier:1},
      {q:'46 + 38 = ?', emoji:'➕', choices:['84','83','85','74'], correct:0, explain:'46 บวก 38 เท่ากับ 84', tier:2},
      {q:'92 - 47 = ?', emoji:'➖', choices:['45','44','46','55'], correct:0, explain:'92 ลบ 47 เท่ากับ 45', tier:2},
      {q:'63 + 28 = ?', emoji:'➕', choices:['91','81','90','92'], correct:0, explain:'63 บวก 28 เท่ากับ 91', tier:2},
      {q:'มีขนม 20 ชิ้น กินไป 6 ชิ้น แบ่งให้เพื่อน 4 ชิ้น เหลือกี่ชิ้น?', emoji:'🍪', choices:['10','12','9','14'], correct:0, explain:'20 - 6 = 14 แล้ว 14 - 4 = 10 ชิ้น', tier:2},
      {q:'มีนก 12 ตัว บินไป 5 ตัว แล้วบินมาอีก 3 ตัว มีนกกี่ตัว?', emoji:'🐦', choices:['10','9','11','8'], correct:0, explain:'12 - 5 = 7 แล้ว 7 + 3 = 10 ตัว', tier:1},
      {q:'15 + 15 = ?', emoji:'➕', choices:['30','25','35','20'], correct:0, explain:'15 บวก 15 เท่ากับ 30', tier:1},
      {q:'73 - 41 = ?', emoji:'➖', choices:['32','31','33','42'], correct:0, explain:'73 ลบ 41 เท่ากับ 32', tier:2},
      {q:'มีลูกอม 8 เม็ด เพื่อนให้อีก 9 เม็ด รวมกี่เม็ด?', emoji:'🍬', choices:['17','16','18','15'], correct:0, explain:'8 + 9 = 17 เม็ด', tier:2}
    ]
  },
  /* ---------- ภาษาไทย ป.1 : หลายเกมหลาย mechanic (วิเคราะห์โจทย์→เลือก mechanic ที่เหมาะ) ----------
     level = เกมแยกไล่ยาก (thai1→thai2→thai3 ล็อกตามลำดับ), ในแต่ละเกมไล่ยากด้วย tier: tier 1 = ตัวเลือกง่าย (ด่านต้น), tier 2 = ตัวเลือกยาก distractor ใกล้เคียง (ด่านหลัง) — pickQuizQuestions เรียงง่าย→ยากอัตโนมัติ
     โจทย์ประเภท "อ่าน/สะกดคำ" (เช่น "กา") ย้ายไปเกมฟัง p1-listen-th (mechanic เหมาะกว่าปรนัย) */
  {
    id:'p1-thai1', name:'ภาษาไทย ป.1 · รู้จักตัวอักษร', emoji:'📚', icon:'assets/icons/p1-thai.svg', color:'#EF5DA8', light:'#FCE0EF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — พยัญชนะต้น / สระ / ตัวสะกดพื้นฐาน (จำแนก-เปรียบเทียบ เหมาะกับปรนัย) */
      {q:'คำใดขึ้นต้นด้วยพยัญชนะ "ก"?', emoji:'🐔', choices:['ไก่','หมา','ปลา','นก'], correct:0, explain:'"ไก่" ขึ้นต้นด้วย ก', tier:1},
      {q:'คำใดมีสระ "อา"?', emoji:'👁️', choices:['ตา','ตี','ตู','โต'], correct:0, explain:'"ตา" ใช้สระ อา', tier:1},
      {q:'คำว่า "แมว" มีตัวสะกดคือตัวใด?', emoji:'🐱', choices:['ว','ม','ก','น'], correct:0, explain:'"แมว" สะกดด้วย ว', tier:1},
      {q:'คำใดมีสระ "อี"?', emoji:'🎀', choices:['ปี','ปา','ปู','โป'], correct:0, explain:'"ปี" ใช้สระ อี', tier:1},
      {q:'พยัญชนะตัวแรกของคำว่า "ปลา" คือตัวใด?', emoji:'🐟', choices:['ป','ล','า','ก'], correct:0, explain:'"ปลา" ขึ้นต้นด้วย ป', tier:1},
      {q:'คำใดมีตัวสะกด?', emoji:'🔤', choices:['กิน','มา','ตา','ปู'], correct:0, explain:'"กิน" มีตัวสะกด น ส่วนคำอื่นไม่มีตัวสะกด', tier:1},
      {q:'คำใดขึ้นต้นด้วยพยัญชนะ "ม"?', emoji:'🐜', choices:['มด','กบ','ปู','หนู'], correct:0, explain:'"มด" ขึ้นต้นด้วย ม', tier:1},
      {q:'คำใดมีสระ "อือ"?', emoji:'✋', choices:['มือ','มี','มา','มู'], correct:0, explain:'"มือ" ใช้สระ อือ (คำอื่นเป็นสระ อี/อา/อู)', tier:2},
      {q:'คำใดมีตัวสะกดมาตราแม่กง (ง)?', emoji:'🐒', choices:['ลิง','ลม','ลบ','ลด'], correct:0, explain:'"ลิง" สะกดด้วย ง (แม่กง)', tier:2},
      {q:'คำใดใช้สระ "ไอ"?', emoji:'🐔', choices:['ไก่','เก้า','แก','กา'], correct:0, explain:'"ไก่" ใช้สระ ไอ (ไ-)', tier:2},
      {q:'พยัญชนะต้นของคำว่า "ควาย" คือตัวใด?', emoji:'🐃', choices:['ค','ข','ก','ง'], correct:0, explain:'"ควาย" ขึ้นต้นด้วย ค', tier:2},
      {q:'คำใดใช้สระ "เอ"?', emoji:'🔤', choices:['เก','แก','โก','กะ'], correct:0, explain:'"เก" ใช้สระ เอ (เ-)', tier:2},
      {q:'คำว่า "กบ" มีตัวสะกดคือตัวใด?', emoji:'🐸', choices:['บ','ก','ป','ด'], correct:0, explain:'"กบ" สะกดด้วย บ', tier:2},
      {q:'คำใดใช้สระ "อู"?', emoji:'🐭', choices:['หนู','หนี','หนา','โหน'], correct:0, explain:'"หนู" ใช้สระ อู', tier:2},
      {q:'คำใดมีสระ "โอ"?', emoji:'🔤', choices:['โต','ตา','ตี','ตุ'], correct:0, explain:'"โต" ใช้สระ โอ (โ-)', tier:1},
      {q:'พยัญชนะตัวแรกของคำว่า "นก" คือตัวใด?', emoji:'🐦', choices:['น','ก','อ','ม'], correct:0, explain:'"นก" ขึ้นต้นด้วย น', tier:1},
      {q:'คำว่า "ตา" มีตัวสะกดหรือไม่?', emoji:'👁️', choices:['ไม่มีตัวสะกด','สะกดด้วย ต','สะกดด้วย น','สะกดด้วย ง'], correct:0, explain:'"ตา" ไม่มีตัวสะกด (มีแค่ ต + สระอา)', tier:1},
      {q:'คำใดมีสระ "ไอ" (ไ-)?', emoji:'🎋', choices:['ไม้','มา','มี','มู'], correct:0, explain:'"ไม้" ใช้สระ ไอ', tier:2},
      {q:'คำใดมีตัวสะกดมาตราแม่กด (ตัวสะกด ด)?', emoji:'🔤', choices:['กด','กบ','กก','กง'], correct:0, explain:'"กด" สะกดด้วย ด (แม่กด)', tier:2},
      {q:'พยัญชนะต้นของคำว่า "ขา" คือตัวใด?', emoji:'🦵', choices:['ข','ค','ก','ง'], correct:0, explain:'"ขา" ขึ้นต้นด้วย ข', tier:2},
      {q:'พยัญชนะต้นของคำว่า "ปลา" คือตัวใด?', emoji:'🐟', choices:['ป','ล','า','บ'], correct:0, explain:'ปลา ขึ้นต้นด้วย ป', tier:1},
      {q:'สระในคำว่า "มี" คือสระอะไร?', emoji:'📖', choices:['สระอี','สระอา','สระอู','สระเอ'], correct:0, explain:'มี ใช้สระอี', tier:1},
      {q:'คำใดคล้องจองกับ "นา"?', emoji:'🌾', choices:['ตา','นก','บ้าน','ปลา'], correct:0, explain:'นา คล้องจองกับ ตา', tier:2},
      {q:'พยัญชนะต้นของคำว่า "งู" คือตัวใด?', emoji:'🐍', choices:['ง','ู','น','ม'], correct:0, explain:'งู ขึ้นต้นด้วย ง', tier:2}
    ]
  },
  {
    id:'p1-thai2', name:'ภาษาไทย ป.1 · วรรณยุกต์-มาตรา', emoji:'📗', icon:'assets/icons/p1-thai2.svg', color:'#E14E9A', light:'#FCE0EF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 — วรรณยุกต์ / มาตราตัวสะกด / พยางค์ / เติมคำ */
      {q:'คำว่า "บ้าน" มีรูปวรรณยุกต์ใด?', emoji:'🏠', choices:['ไม้โท','ไม้เอก','ไม่มี','ไม้ตรี'], correct:0, explain:'"บ้าน" มีไม้โท', tier:1},
      {q:'คำใดมี "ไม้เอก"?', emoji:'🌳', choices:['ป่า','ปา','ปะ','ปี'], correct:0, explain:'"ป่า" มีไม้เอก', tier:1},
      {q:'คำว่า "โรงเรียน" มีกี่พยางค์?', emoji:'🏫', choices:['2 พยางค์','1 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'"โรง-เรียน" มี 2 พยางค์', tier:1},
      {q:'เติมคำให้ถูกต้อง: "น้อง ____ ข้าว"', emoji:'🍚', choices:['กิน','วิ่ง','นอน','บิน'], correct:0, explain:'"น้องกินข้าว" ได้ความหมายเหมาะสม', tier:1},
      {q:'คำใดสะกดมาตราแม่กน (ตัวสะกด น)?', emoji:'🔤', choices:['กิน','กบ','กัด','กัก'], correct:0, explain:'"กิน" สะกดด้วย น (แม่กน)', tier:1},
      {q:'คำว่า "ปลา" มีกี่พยางค์?', emoji:'🐟', choices:['1 พยางค์','2 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'"ปลา" มี 1 พยางค์', tier:1},
      {q:'เติมคำให้เหมาะสม: "ฝน ____ ลงมา"', emoji:'🌧️', choices:['ตก','กิน','วิ่ง','อ่าน'], correct:0, explain:'"ฝนตกลงมา" ได้ความหมายเหมาะสม', tier:1},
      {q:'คำใดมีวรรณยุกต์ "โท"?', emoji:'🍚', choices:['ข้าว','ข่าว','ขาว','ขา'], correct:0, explain:'"ข้าว" มีไม้โท (คำอื่นเป็นเอก/ไม่มี)', tier:2},
      {q:'คำว่า "น้ำ" มีรูปวรรณยุกต์ใด?', emoji:'💧', choices:['ไม้โท','ไม้เอก','ไม้ตรี','ไม่มี'], correct:0, explain:'"น้ำ" มีไม้โท', tier:2},
      {q:'คำใดสะกดมาตราแม่กม (ตัวสะกด ม)?', emoji:'💨', choices:['ลม','ลง','ลบ','ลด'], correct:0, explain:'"ลม" สะกดด้วย ม (แม่กม)', tier:2},
      {q:'คำใดสะกดถูกต้อง?', emoji:'👜', choices:['กระเป๋า','กะเป๋า','กระเปา','กะเปา'], correct:0, explain:'ที่ถูกคือ "กระเป๋า"', tier:2},
      {q:'คำว่า "นักเรียน" มีกี่พยางค์?', emoji:'🎒', choices:['2 พยางค์','1 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'"นัก-เรียน" มี 2 พยางค์', tier:2},
      {q:'คำใดสะกดมาตราแม่กก (ตัวสะกด ก)?', emoji:'🐦', choices:['นก','นม','นาน','นอน'], correct:0, explain:'"นก" สะกดด้วย ก (แม่กก)', tier:2},
      {q:'เติมคำให้เหมาะสม: "อากาศวันนี้ ____ มาก"', emoji:'☀️', choices:['ร้อน','กิน','เขียน','วิ่ง'], correct:0, explain:'"อากาศร้อนมาก" ได้ความหมายเหมาะสม', tier:2},
      {q:'คำใดมี "ไม้โท"?', emoji:'🔤', choices:['ป้า','ปา','ปะ','ปี'], correct:0, explain:'"ป้า" มีไม้โท', tier:1},
      {q:'คำว่า "แมว" มีกี่พยางค์?', emoji:'🐱', choices:['1 พยางค์','2 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'"แมว" มี 1 พยางค์', tier:1},
      {q:'คำใดสะกดมาตราแม่กง (ตัวสะกด ง)?', emoji:'🔤', choices:['ลง','ลด','ลบ','ลม'], correct:0, explain:'"ลง" สะกดด้วย ง (แม่กง)', tier:1},
      {q:'เติมคำให้เหมาะสม: "นก ____ บนท้องฟ้า"', emoji:'🐦', choices:['บิน','ว่าย','เดิน','นอน'], correct:0, explain:'"นกบินบนท้องฟ้า" ได้ความหมายเหมาะสม', tier:1},
      {q:'คำว่า "ไก่" มีรูปวรรณยุกต์ใด?', emoji:'🐔', choices:['ไม้เอก','ไม้โท','ไม้ตรี','ไม่มี'], correct:0, explain:'"ไก่" มีไม้เอก', tier:2},
      {q:'คำใดสะกดมาตราแม่เกย (ตัวสะกด ย)?', emoji:'🔤', choices:['ยาย','ยาน','ยาก','ยาม'], correct:0, explain:'"ยาย" สะกดด้วย ย (แม่เกย)', tier:2},
      {q:'คำว่า "โทรทัศน์" มีกี่พยางค์?', emoji:'📺', choices:['3 พยางค์','2 พยางค์','4 พยางค์','1 พยางค์'], correct:0, explain:'"โท-ระ-ทัด" มี 3 พยางค์', tier:2},
      {q:'เติมคำให้เหมาะสม: "ฉัน ____ หนังสือทุกวัน"', emoji:'📖', choices:['อ่าน','วิ่ง','กระโดด','ว่าย'], correct:0, explain:'"ฉันอ่านหนังสือทุกวัน" ได้ความหมายเหมาะสม', tier:2},
      {q:'เติมคำให้เหมาะสม: "แมว____หนู"', emoji:'🐱', choices:['จับ','กิน','นอน','บิน'], correct:0, explain:'แมวจับหนู เหมาะสมที่สุด', tier:1},
      {q:'คำว่า "กิน" เป็นคำบอกอะไร?', emoji:'🍽️', choices:['อาการ (กริยา)','ชื่อสิ่งของ','สี','จำนวน'], correct:0, explain:'กิน เป็นคำบอกอาการ', tier:2}
    ]
  },
  {
    id:'p1-thai3', name:'ภาษาไทย ป.1 · อ่านจับใจความ', emoji:'📘', icon:'assets/icons/p1-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 3 (เร่ง ป.2) — ควบกล้ำ / อักษรนำ / คล้องจอง / จับใจความ / คำตรงข้าม-เหมือน */
      {q:'คำใดคล้องจองกับคำว่า "บ้าน"?', emoji:'🏠', choices:['ท่าน','บิน','นก','ปู'], correct:0, explain:'"ท่าน" คล้องจองกับ "บ้าน" (เสียง -าน เหมือนกัน)', tier:1},
      {q:'อ่าน: "แม่ซื้อผลไม้ที่ตลาด" — แม่ซื้ออะไร?', emoji:'🍎', choices:['ผลไม้','ขนม','เสื้อ','ดินสอ'], correct:0, explain:'ข้อความบอกว่าแม่ซื้อ "ผลไม้"', tier:1},
      {q:'คำใดคล้องจองกับคำว่า "ปลา"?', emoji:'🐟', choices:['มา','ปู','ดี','นก'], correct:0, explain:'"มา" คล้องจองกับ "ปลา"', tier:1},
      {q:'คำใดมีความหมายตรงข้ามกับ "สูง"?', emoji:'📏', choices:['เตี้ย','ใหญ่','ยาว','กว้าง'], correct:0, explain:'ตรงข้ามกับ "สูง" คือ "เตี้ย"', tier:1},
      {q:'อ่าน: "แมวนอนอยู่บนเก้าอี้" — แมวทำอะไร?', emoji:'🐈', choices:['นอน','วิ่ง','กิน','เล่น'], correct:0, explain:'ข้อความบอกว่าแมว "นอน"', tier:1},
      {q:'คำใดมีความหมายตรงข้ามกับ "ร้อน"?', emoji:'❄️', choices:['เย็น','ใหญ่','เร็ว','ดี'], correct:0, explain:'ตรงข้ามกับ "ร้อน" คือ "เย็น"', tier:1},
      {q:'คำใดคล้องจองกับคำว่า "ดาว"?', emoji:'⭐', choices:['หาว','ดี','ปู','มด'], correct:0, explain:'"หาว" คล้องจองกับ "ดาว"', tier:1},
      {q:'อ่าน: "นกน้อยบินกลับรังตอนเย็น" — นกบินกลับที่ใด?', emoji:'🪺', choices:['รัง','บ้าน','โรงเรียน','ถ้ำ'], correct:0, explain:'ข้อความบอกว่านกบินกลับ "รัง"', tier:2},
      {q:'คำใดมีความหมายตรงข้ามกับ "หนัก"?', emoji:'⚖️', choices:['เบา','ใหญ่','ยาว','สูง'], correct:0, explain:'ตรงข้ามกับ "หนัก" คือ "เบา"', tier:2},
      {q:'คำใดคล้องจองกับคำว่า "นก"?', emoji:'🐦', choices:['ยก','นม','นา','โน'], correct:0, explain:'"ยก" คล้องจองกับ "นก" (เสียง -ก เหมือนกัน)', tier:2},
      {q:'คำใดมีความหมายตรงข้ามกับ "กว้าง"?', emoji:'📐', choices:['แคบ','ยาว','สูง','ใหญ่'], correct:0, explain:'ตรงข้ามกับ "กว้าง" คือ "แคบ"', tier:2},
      {q:'อ่าน: "น้องกินข้าวแล้วไปโรงเรียน" — น้องไปที่ไหน?', emoji:'🎒', choices:['โรงเรียน','ตลาด','บ้าน','สวน'], correct:0, explain:'ข้อความบอกว่าน้องไป "โรงเรียน"', tier:2},
      {q:'คำใดมีความหมายเหมือนกับ "ดีใจ"?', emoji:'😊', choices:['ยินดี','เสียใจ','โกรธ','กลัว'], correct:0, explain:'"ยินดี" มีความหมายเหมือน "ดีใจ"', tier:2},
      {q:'คำใดมีความหมายตรงข้ามกับ "เปิด"?', emoji:'🚪', choices:['ปิด','วาง','ถือ','ดึง'], correct:0, explain:'ตรงข้ามกับ "เปิด" คือ "ปิด"', tier:2},
      {q:'คำใดคล้องจองกับคำว่า "ไก่"?', emoji:'🐔', choices:['ไข่','ไป','กา','นก'], correct:0, explain:'"ไข่" คล้องจองกับ "ไก่"', tier:1},
      {q:'คำว่า "ลม" มีตัวสะกดคือตัวใด?', emoji:'💨', choices:['ม','ล','น','ง'], correct:0, explain:'"ลม" สะกดด้วย ม (มาตราแม่กม)', tier:1},
      {q:'คำใดคล้องจองกับคำว่า "มา"?', emoji:'👁️', choices:['ตา','มี','มู','โม'], correct:0, explain:'"ตา" คล้องจองกับ "มา" (เสียงสระ อา เหมือนกัน)', tier:1},
      {q:'คำใดมีความหมายตรงข้ามกับ "ดี"?', emoji:'👎', choices:['เลว','ใหญ่','ยาว','เร็ว'], correct:0, explain:'ตรงข้ามกับ "ดี" คือ "เลว"', tier:1},
      {q:'คำใดมีความหมายเหมือนกับ "สวย"?', emoji:'🌸', choices:['งาม','เก่า','ช้า','เล็ก'], correct:0, explain:'"งาม" มีความหมายเหมือน "สวย"', tier:2},
      {q:'อ่าน: "พี่ให้ขนมน้องหนึ่งชิ้น" — ใครเป็นคนให้ขนม?', emoji:'🍪', choices:['พี่','น้อง','แม่','ครู'], correct:0, explain:'ข้อความบอกว่า "พี่" เป็นคนให้ขนม', tier:2},
      {q:'อ่าน: "ฝนตกหนักจนน้ำท่วมถนน" — อะไรท่วม?', emoji:'🌊', choices:['ถนน','บ้าน','ต้นไม้','รถ'], correct:0, explain:'ข้อความบอกว่าน้ำท่วม "ถนน"', tier:2},
      {q:'คำใดมีความหมายเหมือนกับ "เร็ว"?', emoji:'⚡', choices:['ไว','ช้า','ดี','ใหญ่'], correct:0, explain:'"ไว" มีความหมายเหมือน "เร็ว"', tier:2},
      {q:'คำใดมีความหมายเหมือนกับ "ใหญ่"?', emoji:'🐘', choices:['โต','เล็ก','สั้น','บาง'], correct:0, explain:'โต มีความหมายเหมือน ใหญ่', tier:1},
      {q:'คำตรงข้ามกับ "ร้อน" คือคำใด?', emoji:'🥶', choices:['เย็น','อุ่น','แดด','ไฟ'], correct:0, explain:'ตรงข้ามกับ ร้อน คือ เย็น', tier:2}
    ]
  },
  {
    /* mechanic-move: โจทย์ "อ่าน/สะกดคำ" (เช่น กา สะกดอย่างไร) เหมาะกับเกมฟัง — ฟังเสียงคำแล้วเรียงตัวอักษรสะกด
       reuse engine เกมฟังคำไทยเดิม (LISTEN_WORDS_TH คำ 3-5 ตัวอักษรไล่ตามด่าน), mode:'nohint' = ไม่เฉลยตัวอักษร (ท้าทายระดับ ป.1) */
    id:'p1-listen-th', name:'ฟังสะกดคำไทย ป.1', emoji:'🎙️', icon:'assets/icons/p1-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[4,4,5], levels:10, grade:'p1', isNew:true
  },
  /* ---------- English ป.1 : 2 level + เกมฟังคำอังกฤษ (listen) ---------- */
  {
    id:'p1-eng1', name:'English ป.1 · คำศัพท์ ABC', emoji:'🔠', icon:'assets/icons/p1-eng.svg', color:'#0FB5AE', light:'#D5F5F2', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — ตัวอักษร / คำศัพท์ / สี / สัตว์ (tier1 ง่าย → tier2 ตัวเลือกใกล้เคียง) */
      {q:'"A" is for ____ ?', emoji:'🍎', choices:['Apple','Ball','Cat','Dog'], correct:0, explain:'A is for Apple 🍎', tier:1},
      {q:'"แมว" ภาษาอังกฤษคือคำใด?', emoji:'🐱', choices:['Cat','Dog','Cow','Pig'], correct:0, explain:'แมว = Cat', tier:1},
      {q:'สีแดง ภาษาอังกฤษคือคำใด?', emoji:'🔴', choices:['Red','Blue','Green','Yellow'], correct:0, explain:'สีแดง = Red', tier:1},
      {q:'"Dog" แปลว่าอะไร?', emoji:'🐶', choices:['สุนัข','แมว','หมู','วัว'], correct:0, explain:'Dog = สุนัข', tier:1},
      {q:'"B" is for ____ ?', emoji:'⚽', choices:['Ball','Apple','Egg','Sun'], correct:0, explain:'B is for Ball ⚽', tier:1},
      {q:'สีเหลือง ภาษาอังกฤษคือคำใด?', emoji:'🟡', choices:['Yellow','Red','Blue','Pink'], correct:0, explain:'สีเหลือง = Yellow', tier:1},
      {q:'Which one is an animal?', emoji:'🐰', choices:['Rabbit','Book','Chair','Cup'], correct:0, explain:'Rabbit (กระต่าย) เป็นสัตว์', tier:2},
      {q:'Which one is a fruit?', emoji:'🍌', choices:['Banana','Table','Chair','Book'], correct:0, explain:'Banana (กล้วย) is a fruit', tier:2},
      {q:'"Fish" แปลว่าอะไร?', emoji:'🐟', choices:['ปลา','นก','แมว','หมา'], correct:0, explain:'Fish = ปลา', tier:2},
      {q:'สีเขียว ภาษาอังกฤษคือคำใด?', emoji:'🟢', choices:['Green','Blue','Grey','Gold'], correct:0, explain:'สีเขียว = Green', tier:2},
      {q:'"C" is for ____ ?', emoji:'🐱', choices:['Cat','Ball','Apple','Dog'], correct:0, explain:'C is for Cat 🐱', tier:2},
      {q:'"Star" แปลว่าอะไร?', emoji:'⭐', choices:['ดาว','ดวงอาทิตย์','เมฆ','ฝน'], correct:0, explain:'Star = ดาว', tier:2},
      {q:'"D" is for ____ ?', emoji:'🐶', choices:['Dog','Cat','Apple','Ball'], correct:0, explain:'D is for Dog 🐶', tier:1},
      {q:'สีน้ำเงิน ภาษาอังกฤษคือคำใด?', emoji:'🔵', choices:['Blue','Red','Green','Pink'], correct:0, explain:'สีน้ำเงิน = Blue', tier:1},
      {q:'"Sun" แปลว่าอะไร?', emoji:'☀️', choices:['ดวงอาทิตย์','ดวงจันทร์','ดาว','เมฆ'], correct:0, explain:'Sun = ดวงอาทิตย์', tier:1},
      {q:'Which one is a color?', emoji:'🎨', choices:['Yellow','Apple','Dog','Book'], correct:0, explain:'Yellow (สีเหลือง) is a color', tier:2},
      {q:'"Bird" แปลว่าอะไร?', emoji:'🐦', choices:['นก','ปลา','แมว','หมา'], correct:0, explain:'Bird = นก', tier:2},
      {q:'"E" is for ____ ?', emoji:'🥚', choices:['Egg','Cat','Ball','Dog'], correct:0, explain:'E is for Egg 🥚', tier:2},
      {q:'"cat" แปลว่าอะไร?', emoji:'🐱', choices:['แมว','หมา','นก','ปลา'], correct:0, explain:'cat = แมว', tier:1},
      {q:'"F" is for ____ ?', emoji:'🐟', choices:['Fish','Apple','Ball','Cat'], correct:0, explain:'F is for Fish 🐟', tier:1},
      {q:'"sun" แปลว่าอะไร?', emoji:'☀️', choices:['ดวงอาทิตย์','ดวงจันทร์','ดาว','เมฆ'], correct:0, explain:'sun = ดวงอาทิตย์', tier:1},
      {q:'"B" is for ____ ?', emoji:'⚽', choices:['Ball','Apple','Egg','Fish'], correct:0, explain:'B is for Ball', tier:2},
      {q:'"red" แปลว่าสีอะไร?', emoji:'🔴', choices:['สีแดง','สีฟ้า','สีเขียว','สีเหลือง'], correct:0, explain:'red = สีแดง', tier:2},
      {q:'"fish" แปลว่าอะไร?', emoji:'🐟', choices:['ปลา','นก','แมว','หมา'], correct:0, explain:'fish = ปลา', tier:2}
    ]
  },
  {
    id:'p1-eng2', name:'English ป.1 · ตัวเลข-ประโยค', emoji:'🔡', icon:'assets/icons/p1-eng2.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 (เร่ง ป.2) — ตัวเลข 1-30 / ทักทาย / ประโยคเดี่ยว / opposite / please */
      {q:'Number "3" is ____ ?', emoji:'3️⃣', choices:['Three','One','Two','Four'], correct:0, explain:'3 = Three', tier:1},
      {q:'เลข 12 ภาษาอังกฤษคือคำใด?', emoji:'🔢', choices:['Twelve','Ten','Eleven','Twenty'], correct:0, explain:'12 = Twelve', tier:1},
      {q:'"Good ____!" คำทักทายตอนเช้า', emoji:'🌅', choices:['Morning','Night','Bye','Evening'], correct:0, explain:'Good Morning! = สวัสดีตอนเช้า', tier:1},
      {q:'"Thank you" ใช้พูดเมื่อไร?', emoji:'🙏', choices:['ตอนขอบคุณ','ตอนขอโทษ','ตอนลาก่อน','ตอนโกรธ'], correct:0, explain:'Thank you = ขอบคุณ', tier:1},
      {q:'How many apples? 🍎🍎🍎', emoji:'🍎', choices:['Three','Two','Four','Five'], correct:0, explain:'มีแอปเปิล 3 ลูก = Three', tier:1},
      {q:'The sky is ____ (ท้องฟ้าสีอะไร?)', emoji:'🌤️', choices:['Blue','Red','Pink','Black'], correct:0, explain:'The sky is Blue (ท้องฟ้าสีฟ้า)', tier:1},
      {q:'Complete: "This is a ____" 📖', emoji:'📖', choices:['Book','Fish','Star','Tree'], correct:0, explain:'This is a Book (นี่คือหนังสือ)', tier:2},
      {q:'เลข 20 ภาษาอังกฤษคือคำใด?', emoji:'🔢', choices:['Twenty','Twelve','Thirty','Ten'], correct:0, explain:'20 = Twenty', tier:2},
      {q:'What is the opposite of "big"?', emoji:'🔁', choices:['small','tall','long','fast'], correct:0, explain:'ตรงข้ามกับ big คือ small (เล็ก)', tier:2},
      {q:'"Where is the cat?" It is ____ the box. 🐱📦', emoji:'📦', choices:['in','eat','red','big'], correct:0, explain:'แมวอยู่ "in" (ข้างใน) กล่อง', tier:2},
      {q:'เติมคำสั่งสุภาพ: "____ sit down." (กรุณานั่งลง)', emoji:'🪑', choices:['Please','Thank','Sorry','Hello'], correct:0, explain:'Please sit down = กรุณานั่งลง (please = คำสุภาพ)', tier:2},
      {q:'What is the opposite of "hot"?', emoji:'❄️', choices:['cold','big','fast','new'], correct:0, explain:'ตรงข้ามกับ hot (ร้อน) คือ cold (เย็น)', tier:2},
      {q:'Number "5" is ____ ?', emoji:'5️⃣', choices:['Five','Four','Six','Nine'], correct:0, explain:'5 = Five', tier:1},
      {q:'"Good ____!" คำทักทายตอนกลางคืน', emoji:'🌙', choices:['Night','Morning','Bye','Day'], correct:0, explain:'Good Night! = ราตรีสวัสดิ์', tier:1},
      {q:'เลข 10 ภาษาอังกฤษคือคำใด?', emoji:'🔢', choices:['Ten','Nine','Eleven','Two'], correct:0, explain:'10 = Ten', tier:1},
      {q:'"Sorry" ใช้พูดเมื่อไร?', emoji:'🙇', choices:['ตอนขอโทษ','ตอนขอบคุณ','ตอนทักทาย','ตอนดีใจ'], correct:0, explain:'Sorry = ขอโทษ', tier:1},
      {q:'How many stars? ⭐⭐', emoji:'⭐', choices:['Two','One','Three','Four'], correct:0, explain:'มีดาว 2 ดวง = Two', tier:2},
      {q:'Complete: "This is a ____" 🐟', emoji:'🐟', choices:['Fish','Book','Star','Tree'], correct:0, explain:'This is a Fish (นี่คือปลา)', tier:2},
      {q:'What is the opposite of "day"?', emoji:'🌃', choices:['night','sun','hot','big'], correct:0, explain:'ตรงข้ามกับ day (กลางวัน) คือ night (กลางคืน)', tier:2},
      {q:'เลข 11 ภาษาอังกฤษคือคำใด?', emoji:'🔢', choices:['Eleven','Twelve','Ten','Seven'], correct:0, explain:'11 = Eleven', tier:2},
      {q:'เลข 5 ภาษาอังกฤษคือคำใด?', emoji:'5️⃣', choices:['five','four','six','three'], correct:0, explain:'5 = five', tier:1},
      {q:'เลข 10 ภาษาอังกฤษคือคำใด?', emoji:'🔟', choices:['ten','nine','eight','twelve'], correct:0, explain:'10 = ten', tier:1},
      {q:'"This is a ____." (รูปหมา)', emoji:'🐶', choices:['dog','cat','bird','fish'], correct:0, explain:'รูปหมา = dog', tier:2},
      {q:'เลข 7 ภาษาอังกฤษคือคำใด?', emoji:'7️⃣', choices:['seven','six','eight','five'], correct:0, explain:'7 = seven', tier:2}
    ]
  },
  {
    /* mechanic-move: ฝึกฟัง-สะกดคำอังกฤษ (listen, mode nohint) — reuse engine เกมฟังคำศัพท์อังกฤษเดิม */
    id:'p1-listen-en', name:'ฟังคำอังกฤษ ป.1', emoji:'📣', icon:'assets/icons/p1-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', wordLens:[3,4,4], levels:10, grade:'p1', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.1 — ประโยค 4-5 คำ 1 ช่องว่าง */
    id:'p1-cloze1', name:'ฟังประโยคเติมคำ ป.1 · 1', emoji:'🔈', icon:'assets/icons/p1-cloze1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en2', clozeBlanks:[1,1,1], clozeDecoys:[2,3,3], levels:10, grade:'p1', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.1 — ด่านท้าย 2 ช่องว่าง */
    id:'p1-cloze2', name:'ฟังประโยคเติมคำ ป.1 · 2', emoji:'🎙', icon:'assets/icons/p1-cloze2.svg', color:'#E0603F', light:'#FBDBD2',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en2', clozeBlanks:[1,2,2], clozeDecoys:[3,3,4], levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-eng3', name:'English ป.1 · อ่านและประโยค', emoji:'🆎', icon:'assets/icons/p1-eng3.svg', color:'#0A7A75', light:'#D5F5F2', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 3 (เร่ง ป.2) — ประโยค is/am/are / จับใจความ / opposite / นับ 1-30 */
      {q:'"I ____ a boy." เติมคำใด?', emoji:'👦', choices:['am','is','are','be'], correct:0, explain:'I am a boy (I ใช้ am)', tier:1},
      {q:'"She ____ happy." เติมคำใด?', emoji:'😊', choices:['is','am','are','be'], correct:0, explain:'She is happy (She ใช้ is)', tier:1},
      {q:'Read: "The cat is on the mat." Where is the cat?', emoji:'🐱', choices:['on the mat','in the box','under the bed','on the tree'], correct:0, explain:'ประโยคบอกว่าแมวอยู่ "on the mat"', tier:1},
      {q:'What is the opposite of "up"?', emoji:'⬆️', choices:['down','left','fast','big'], correct:0, explain:'ตรงข้ามกับ up (ขึ้น) คือ down (ลง)', tier:1},
      {q:'"We ____ friends." เติมคำใด?', emoji:'👫', choices:['are','am','is','be'], correct:0, explain:'We are friends (We ใช้ are)', tier:1},
      {q:'How many fish? 🐟🐟🐟🐟', emoji:'🐟', choices:['Four','Three','Five','Two'], correct:0, explain:'มีปลา 4 ตัว = Four', tier:1},
      {q:'"This ____ my book." เติมคำใด?', emoji:'📖', choices:['is','are','am','be'], correct:0, explain:'This is my book (This ใช้ is)', tier:2},
      {q:'Read: "Tom has a red ball." What color is the ball?', emoji:'⚽', choices:['Red','Blue','Green','Yellow'], correct:0, explain:'ประโยคบอกว่าลูกบอลสี "Red"', tier:2},
      {q:'What is the opposite of "fast"?', emoji:'🐢', choices:['slow','tall','new','hot'], correct:0, explain:'ตรงข้ามกับ fast (เร็ว) คือ slow (ช้า)', tier:2},
      {q:'"____ you like apples?" เติมคำใด?', emoji:'🍎', choices:['Do','Does','Is','Are'], correct:0, explain:'Do you like apples? (ใช้ Do กับ you)', tier:2},
      {q:'เลข 15 ภาษาอังกฤษคือคำใด?', emoji:'🔢', choices:['Fifteen','Fifty','Five','Fourteen'], correct:0, explain:'15 = Fifteen', tier:2},
      {q:'How many pencils? ✏️✏️✏️', emoji:'✏️', choices:['Three','Two','Four','Five'], correct:0, explain:'มีดินสอ 3 แท่ง = Three', tier:2},
      {q:'"You ____ my friend." เติมคำใด?', emoji:'🧒', choices:['are','am','is','be'], correct:0, explain:'You are my friend (You ใช้ are)', tier:1},
      {q:'"It ____ a dog." เติมคำใด?', emoji:'🐶', choices:['is','am','are','be'], correct:0, explain:'It is a dog (It ใช้ is)', tier:1},
      {q:'What is the opposite of "open"?', emoji:'🚪', choices:['close','run','sit','eat'], correct:0, explain:'ตรงข้ามกับ open (เปิด) คือ close (ปิด)', tier:1},
      {q:'Read: "The sun is hot." Is the sun hot?', emoji:'☀️', choices:['Yes','No','Blue','Cold'], correct:0, explain:'ประโยคบอกว่า sun is hot ดังนั้นตอบ Yes', tier:1},
      {q:'"They ____ playing." เติมคำใด?', emoji:'🧑‍🤝‍🧑', choices:['are','is','am','be'], correct:0, explain:'They are playing (They ใช้ are)', tier:2},
      {q:'What is the opposite of "happy"?', emoji:'😢', choices:['sad','fast','big','new'], correct:0, explain:'ตรงข้ามกับ happy (มีความสุข) คือ sad (เศร้า)', tier:2},
      {q:'Read: "Ann has two pens." How many pens?', emoji:'🖊️', choices:['Two','One','Three','Four'], correct:0, explain:'ประโยคบอกว่า two pens = 2 ด้าม', tier:2},
      {q:'"Please" ใช้พูดตอนไหน?', emoji:'🙏', choices:['ตอนขอร้องอย่างสุภาพ','ตอนโกรธ','ตอนวิ่งเล่น','ตอนนอน'], correct:0, explain:'Please เป็นคำสุภาพใช้ตอนขอร้อง เช่น Sit down, please.', tier:2},
      {q:'"Hello!" แปลว่าอะไร?', emoji:'👋', choices:['สวัสดี','ลาก่อน','ขอบคุณ','ขอโทษ'], correct:0, explain:'Hello = สวัสดี', tier:1},
      {q:'"What is your name?" ถามเรื่องอะไร?', emoji:'🧒', choices:['ชื่อ','อายุ','สี','อาหาร'], correct:0, explain:'ถามชื่อ', tier:1},
      {q:'"____ are you?" (ถามสบายดีไหม)', emoji:'😊', choices:['How','What','Who','Where'], correct:0, explain:'How are you? = สบายดีไหม', tier:2},
      {q:'"Goodbye!" แปลว่าอะไร?', emoji:'👋', choices:['ลาก่อน','สวัสดี','ขอบคุณ','เชิญ'], correct:0, explain:'Goodbye = ลาก่อน', tier:2}
    ]
  },
  {
    id:'p1-manners', name:'คุณธรรม ป.1 · มารยาทดี', emoji:'😊', icon:'assets/icons/p1-manners.svg', color:'#F6A609', light:'#FEEFC9', grade:'p1', poolPick:10, isNew:true,
    questions:[
      {q:'เพื่อนแบ่งขนมให้ เราควรพูดว่าอะไร?', emoji:'🍪', choices:['ขอบคุณ','ไปได้แล้ว','ไม่เอา','เงียบ'], correct:0, explain:'เมื่อได้รับของ ควรพูด "ขอบคุณ"', tier:1},
      {q:'เดินชนคนอื่นโดยไม่ตั้งใจ ควรพูดว่าอะไร?', emoji:'🙇', choices:['ขอโทษ','ช่างมัน','หลบไป','ไม่พูด'], correct:0, explain:'ทำผิดโดยไม่ตั้งใจ ควรพูด "ขอโทษ"', tier:1},
      {q:'ก่อนจะเข้าห้องของคนอื่น ควรทำอย่างไร?', emoji:'🚪', choices:['เดินเข้าเลย','เคาะประตูก่อน','ตะโกนเรียก','วิ่งเข้าไป'], correct:1, explain:'ควร "เคาะประตู" ขออนุญาตก่อนเข้า', tier:1},
      {q:'เจอคุณครูหรือผู้ใหญ่ ควรทำอย่างไร?', emoji:'🙏', choices:['ทำเป็นไม่เห็น','ไหว้ทักทาย','วิ่งหนี','หัวเราะ'], correct:1, explain:'ควร "ไหว้ทักทาย" ผู้ใหญ่ด้วยความเคารพ', tier:1},
      {q:'เห็นเพื่อนหกล้ม เราควรทำอย่างไร?', emoji:'🤕', choices:['หัวเราะเยาะ','ช่วยพยุงขึ้น','เดินหนี','ล้อเลียน'], correct:1, explain:'ควร "ช่วยพยุง" เพื่อนขึ้นและถามว่าเป็นอะไรไหม', tier:1},
      {q:'อยู่ในห้องสมุด ควรทำตัวอย่างไร?', emoji:'📚', choices:['วิ่งเล่น','คุยเสียงดัง','เงียบๆ ไม่ส่งเสียงดัง','ร้องเพลง'], correct:2, explain:'ห้องสมุดต้อง "เงียบ" เพื่อไม่รบกวนคนอื่น', tier:2},
      {q:'ทิ้งขยะควรทิ้งที่ไหน?', emoji:'🗑️', choices:['พื้น','ถังขยะ','ในกระเป๋าเพื่อน','ข้างถนน'], correct:1, explain:'ต้องทิ้งขยะลง "ถังขยะ" เสมอ', tier:2},
      {q:'จะซื้อของ มีคนต่อแถวอยู่ ควรทำอย่างไร?', emoji:'🧍', choices:['แซงคิว','ต่อแถวรอ','ผลักคนอื่น','ตะโกน'], correct:1, explain:'ควร "ต่อแถวรอ" ตามลำดับ', tier:2},
      {q:'มีของเล่นใหม่ เพื่อนอยากเล่นด้วย ควรทำอย่างไร?', emoji:'🧸', choices:['หวงไว้คนเดียว','แบ่งกันเล่น','ซ่อนของเล่น','ไล่เพื่อน'], correct:1, explain:'การ "แบ่งกันเล่น" ทำให้มีเพื่อนและสนุกด้วยกัน', tier:2},
      {q:'เพื่อนกำลังพูดอยู่ เราควรทำอย่างไร?', emoji:'🗣️', choices:['พูดแทรก','ตั้งใจฟัง','เดินหนี','หัวเราะ'], correct:1, explain:'ควร "ตั้งใจฟัง" เมื่อคนอื่นพูด', tier:2},
      {q:'หน้าไหนแสดงความรู้สึก "ดีใจ"?', emoji:'🙂', choices:['😀','😢','😠','😱'], correct:0, explain:'😀 คือหน้ายิ้ม แสดงความ "ดีใจ"', tier:3},
      {q:'เพื่อนได้รางวัล เราควรรู้สึกอย่างไรจึงจะดี?', emoji:'🏆', choices:['อิจฉา','ยินดีกับเพื่อน','โกรธ','เสียใจ'], correct:1, explain:'ควร "ยินดี" กับความสำเร็จของเพื่อน', tier:3},
      {q:'เวลาโกรธมากๆ ควรทำอย่างไรให้ใจเย็นลง?', emoji:'😤', choices:['ตะโกนใส่คน','ทุบข้าวของ','หายใจลึกๆ นับ 1-10','ร้องไห้เสียงดัง'], correct:2, explain:'"หายใจลึกๆ นับ 1-10" ช่วยให้ใจเย็นลง', tier:3},
      {q:'เห็นเพื่อนโดนแกล้ง เราควรทำอย่างไร?', emoji:'😟', choices:['แกล้งด้วย','บอกคุณครู','หัวเราะ','เดินหนี'], correct:1, explain:'ควร "บอกคุณครู" เพื่อช่วยเพื่อน', tier:3},
      {q:'เพื่อนเสียใจร้องไห้ เราควรทำอย่างไร?', emoji:'😢', choices:['ล้อเลียน','ปลอบใจเพื่อน','เดินหนี','หัวเราะ'], correct:1, explain:'ควร "ปลอบใจ" และอยู่เป็นเพื่อน', tier:3},
      {q:'ก่อนกินข้าวควรทำอะไร?', emoji:'🍽️', choices:['ล้างมือ','วิ่งเล่น','ดูทีวี','นอน'], correct:0, explain:'ควร "ล้างมือ" ให้สะอาดก่อนกินข้าว', tier:1},
      {q:'เจอเพื่อนตอนเช้าที่โรงเรียน ควรพูดว่าอะไร?', emoji:'🌅', choices:['สวัสดี','ไปให้พ้น','เงียบ','ไม่พูด'], correct:0, explain:'ควรทักทายว่า "สวัสดี"', tier:1},
      {q:'อยากยืมของเล่นของเพื่อน ควรทำอย่างไร?', emoji:'🧸', choices:['ขออนุญาตก่อน','หยิบเลย','แอบเอาไป','แย่งมา'], correct:0, explain:'ควร "ขออนุญาต" ก่อนหยิบของคนอื่น', tier:2},
      {q:'ใช้ของเล่นส่วนรวมเสร็จแล้ว ควรทำอย่างไร?', emoji:'🧹', choices:['เก็บเข้าที่','ทิ้งไว้','ซ่อนไว้','โยนทิ้ง'], correct:0, explain:'ควร "เก็บเข้าที่" ให้เรียบร้อย', tier:2},
      {q:'เพื่อนทำผิดแล้วมาขอโทษเรา ควรทำอย่างไร?', emoji:'🤝', choices:['ให้อภัย','โกรธไม่เลิก','แกล้งกลับ','ไม่คุยด้วย'], correct:0, explain:'ควร "ให้อภัย" เมื่อเพื่อนขอโทษด้วยความจริงใจ', tier:3},
      {q:'เห็นคุณยายถือของหนักมา ควรทำอย่างไร?', emoji:'👵', choices:['ช่วยถือของ','เดินหนี','ทำเป็นไม่เห็น','หัวเราะ'], correct:0, explain:'ควร "ช่วยถือของ" ให้ผู้ใหญ่', tier:3},
      {q:'ก่อนเข้าห้องของผู้อื่นควรทำอย่างไร?', emoji:'🚪', choices:['เคาะประตูขออนุญาต','เปิดเข้าไปเลย','ตะโกนเรียก','ไม่ต้องทำอะไร'], correct:0, explain:'ควรเคาะประตูขออนุญาตก่อน', tier:1},
      {q:'เมื่อเพื่อนแบ่งขนมให้ควรพูดว่าอะไร?', emoji:'🍪', choices:['ขอบคุณ','ไม่พูดอะไร','เอาอีก','ไม่เอา'], correct:0, explain:'ควรพูดขอบคุณ', tier:2},
      {q:'เวลากินข้าวควรทำอย่างไร?', emoji:'🍚', choices:['กินให้เรียบร้อยไม่หก','เล่นไปกินไป','พูดเต็มปาก','ทิ้งข้าว'], correct:0, explain:'ควรกินให้เรียบร้อย ไม่หกเลอะเทอะ', tier:3}
    ]
  },
  /* ---------- เชาวน์ ป.1 : 2 level ---------- */
  {
    id:'p1-iq1', name:'เชาวน์ ป.1 · ตรรกะและแบบรูป', emoji:'🧠', icon:'assets/icons/p1-iq.svg', color:'#2FB673', light:'#D6F3E4', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — จับผิด / แบบรูป / เปรียบเทียบ (tier1 ง่าย → tier2 ตัวเลือกใกล้เคียง) */
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🔍', choices:['⚽','🍎','🍌','🍇'], correct:0, explain:'⚽ ลูกบอล ไม่ใช่ผลไม้เหมือนตัวอื่น', tier:1},
      {q:'แบบรูป 🔺🔵🔺🔵🔺 ▢ ต่อไปคืออะไร?', emoji:'🔁', choices:['🔵','🔺','🟩','⭐'], correct:0, explain:'สลับสามเหลี่ยม-วงกลม ตัวต่อไปคือ 🔵', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🔍', choices:['🍕','🚗','🚌','🚲'], correct:0, explain:'🍕 พิซซ่าเป็นอาหาร ตัวอื่นเป็นยานพาหนะ', tier:1},
      {q:'ช้าง หมู แมว — สัตว์ใดตัวใหญ่ที่สุด?', emoji:'🐘', choices:['ช้าง','หมู','แมว','เท่ากันหมด'], correct:0, explain:'ช้างตัวใหญ่ที่สุด', tier:1},
      {q:'แบบรูปเพิ่มขึ้น: 1, 2, 3, 4, ▢', emoji:'🔢', choices:['5','4','6','2'], correct:0, explain:'เพิ่มทีละ 1 ตัวต่อไปคือ 5', tier:1},
      {q:'อันไหน "หนักที่สุด"?', emoji:'⚖️', choices:['ก้อนหิน','ขนนก','ใบไม้','ลูกโป่ง'], correct:0, explain:'ก้อนหินหนักที่สุด', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🔍', choices:['🌻','🐶','🐱','🐰'], correct:0, explain:'🌻 ดอกไม้ ไม่ใช่สัตว์เหมือนตัวอื่น', tier:2},
      {q:'แบบรูป 🔴🔴🔵🔴🔴🔵🔴🔴 ▢ ต่อไปคืออะไร?', emoji:'🔁', choices:['🔵','🔴','🟢','⭐'], correct:0, explain:'แดง 2 สลับฟ้า 1 ครบ 🔴🔴 แล้วจึงเป็น 🔵', tier:2},
      {q:'พ่อสูงกว่าแม่ แม่สูงกว่าน้อง ใครเตี้ยที่สุด?', emoji:'📏', choices:['น้อง','พ่อ','แม่','เท่ากัน'], correct:0, explain:'น้องเตี้ยที่สุด (พ่อ > แม่ > น้อง)', tier:2},
      {q:'เต่าเดินช้ากว่ากระต่าย กระต่ายเดินช้ากว่าเสือ ใครเร็วที่สุด?', emoji:'🐆', choices:['เสือ','เต่า','กระต่าย','เท่ากัน'], correct:0, explain:'เสือเร็วที่สุด (เสือ > กระต่าย > เต่า)', tier:2},
      {q:'แบบรูปลดลง: 10, 8, 6, 4, ▢', emoji:'🔢', choices:['2','5','3','0'], correct:0, explain:'ลดทีละ 2 ตัวต่อไปคือ 2', tier:2},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🔍', choices:['🍟','👕','👗','🧦'], correct:0, explain:'🍟 เป็นอาหาร ตัวอื่นเป็นเสื้อผ้า', tier:2},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🔍', choices:['🌙','😀','😢','😠'], correct:0, explain:'🌙 ดวงจันทร์ ไม่ใช่หน้าอารมณ์เหมือนตัวอื่น', tier:1},
      {q:'แบบรูป ⭐🌙⭐🌙⭐ ▢ ต่อไปคืออะไร?', emoji:'🔁', choices:['🌙','⭐','☀️','🔵'], correct:0, explain:'สลับดาว-จันทร์ ตัวต่อไปคือ 🌙', tier:1},
      {q:'อันไหน "เล็กที่สุด"?', emoji:'🐜', choices:['มด','ช้าง','ม้า','วัว'], correct:0, explain:'มดตัวเล็กที่สุด', tier:1},
      {q:'แบบรูป 🔵🔴🔴🔵🔴🔴 ▢ ต่อไปคืออะไร?', emoji:'🔁', choices:['🔵','🔴','🟢','⭐'], correct:0, explain:'ฟ้า 1 สลับแดง 2 ครบ 🔴🔴 แล้วจึงเป็น 🔵', tier:2},
      {q:'เอสูงกว่าบี ซีสูงกว่าเอ ใครสูงที่สุด?', emoji:'📏', choices:['ซี','เอ','บี','เท่ากัน'], correct:0, explain:'ซีสูงที่สุด (ซี > เอ > บี)', tier:2},
      {q:'แบบรูปเพิ่มขึ้น: 2, 4, 6, 8, ▢', emoji:'🔢', choices:['10','9','12','7'], correct:0, explain:'เพิ่มทีละ 2 ตัวต่อไปคือ 10', tier:2},
      {q:'แบบรูป: 🔴🔵🔴🔵▢ ต่อไปคือ?', emoji:'🔴', choices:['🔴','🔵','🟢','🟡'], correct:0, explain:'สลับแดง-ฟ้า ตัวต่อไปคือแดง', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🐶', choices:['รถ','หมา','แมว','นก'], correct:0, explain:'อีก 3 อย่างเป็นสัตว์ รถไม่เข้าพวก', tier:1},
      {q:'นับต่อไป: 1, 3, 5, ▢', emoji:'🔢', choices:['7','6','8','9'], correct:0, explain:'เลขคี่ ตัวต่อไปคือ 7', tier:1},
      {q:'ตรงข้ามกับ "ใหญ่" คือ?', emoji:'🐘', choices:['เล็ก','สูง','ยาว','หนา'], correct:0, explain:'ตรงข้ามกับ ใหญ่ คือ เล็ก', tier:2},
      {q:'แบบรูป: ⭐⭐🌙⭐⭐🌙⭐⭐▢', emoji:'🌙', choices:['🌙','⭐','☀️','🔵'], correct:0, explain:'ทุก 2 ดาวมี 1 พระจันทร์', tier:2},
      {q:'ถ้าวันนี้วันจันทร์ พรุ่งนี้วันอะไร?', emoji:'📅', choices:['วันอังคาร','วันอาทิตย์','วันพุธ','วันเสาร์'], correct:0, explain:'ถัดจากวันจันทร์คือวันอังคาร', tier:2}
    ]
  },
  {
    id:'p1-iq2', name:'เชาวน์ ป.1 · ความจำและกฎ', emoji:'🤔', icon:'assets/icons/p1-iq2.svg', color:'#1F9C60', light:'#D6F3E4', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 — working memory / ทำตามกฎ-สลับกฎ / จัดกลุ่ม (executive function) */
      {q:'จำลำดับนี้ไว้: 🍎🍌🍓 แล้วเลือกลำดับที่ถูกต้อง', emoji:'🧠', choices:['🍎🍌🍓','🍌🍎🍓','🍓🍌🍎','🍎🍓🍌'], correct:0, explain:'ลำดับที่ถูกคือ 🍎🍌🍓', tier:1},
      {q:'กติกา: เลือกเฉพาะ "สัตว์" — ข้อใดถูก?', emoji:'🐾', choices:['กระต่าย','รถยนต์','โต๊ะ','ดินสอ'], correct:0, explain:'กระต่ายเป็นสัตว์ ตัวอื่นเป็นสิ่งของ', tier:1},
      {q:'จำ 4 อย่างนี้: 🐶🐱🐰🐸 — ตัวใด "ไม่ได้อยู่" ในกลุ่ม?', emoji:'🧠', choices:['🐷','🐶','🐰','🐸'], correct:0, explain:'🐷 ไม่ได้อยู่ในกลุ่มที่ให้จำ', tier:1},
      {q:'กติกา: เลือกเฉพาะ "ผลไม้" — ข้อใดถูก?', emoji:'🧺', choices:['องุ่น','รองเท้า','หมวก','ช้อน'], correct:0, explain:'องุ่นเป็นผลไม้ ตัวอื่นไม่ใช่', tier:1},
      {q:'ถ้าวันนี้วันจันทร์ พรุ่งนี้เป็นวันอะไร?', emoji:'📅', choices:['วันอังคาร','วันอาทิตย์','วันพุธ','วันศุกร์'], correct:0, explain:'ถัดจากวันจันทร์คือวันอังคาร', tier:1},
      {q:'จำสี: 🔴🟡🟢 แล้วเลือกลำดับที่ถูกต้อง', emoji:'🎨', choices:['🔴🟡🟢','🟡🔴🟢','🟢🟡🔴','🔴🟢🟡'], correct:0, explain:'ลำดับที่ถูกคือ 🔴🟡🟢', tier:1},
      {q:'กติกาเปลี่ยนเป็น "เลือกสิ่งที่กินได้" — ข้อใดถูก?', emoji:'🍽️', choices:['แอปเปิล','รองเท้า','ก้อนหิน','ดินสอ'], correct:0, explain:'แอปเปิลกินได้ ต้องเปลี่ยนตามกติกาใหม่', tier:2},
      {q:'กติกาเปลี่ยนเป็น "เลือกสิ่งที่ลอยน้ำได้" — ข้อใดถูก?', emoji:'💧', choices:['เรือ','ก้อนหิน','ตะปู','เหรียญ'], correct:0, explain:'เรือลอยน้ำได้ ต้องคิดตามกติกาใหม่', tier:2},
      {q:'จำลำดับ: 🐶🐱🐶🐰 — ตัวที่ 3 คือตัวใด?', emoji:'🧠', choices:['🐶','🐱','🐰','🐸'], correct:0, explain:'ตัวที่ 3 ในลำดับคือ 🐶', tier:2},
      {q:'ถ้ากด "ปรบมือ" เฉพาะเมื่อเห็น 🐰 — เห็น 🐱 ควรทำอย่างไร?', emoji:'🖐️', choices:['อยู่เฉยๆ','ปรบมือ','กระโดด','ตะโกน'], correct:0, explain:'กติกาบอกให้ปรบเฉพาะ 🐰 เห็น 🐱 จึง "อยู่เฉยๆ"', tier:2},
      {q:'มีของ 🍎🍎🍎🍌 — ผลไม้ชนิดใดมีมากกว่า?', emoji:'🔢', choices:['🍎','🍌','เท่ากัน','ไม่มี'], correct:0, explain:'มีแอปเปิล 3 กล้วย 1 แอปเปิลมากกว่า', tier:2},
      {q:'จัดกลุ่ม: 🚗🚌🍎 — สิ่งใดควรอยู่คนละกลุ่ม?', emoji:'🗂️', choices:['🍎','🚗','🚌','ทุกอย่างกลุ่มเดียว'], correct:0, explain:'🍎 เป็นอาหาร ต่างจากยานพาหนะ 🚗🚌', tier:2},
      {q:'จำลำดับ: 🔺🔵🟢 — ตัวที่ 2 คือตัวใด?', emoji:'🧠', choices:['🔵','🔺','🟢','⭐'], correct:0, explain:'ตัวที่ 2 ในลำดับคือ 🔵', tier:1},
      {q:'กติกา: เลือกเฉพาะ "ผลไม้" — ข้อใดถูก?', emoji:'🧺', choices:['🍎','🚗','👕','📖'], correct:0, explain:'🍎 เป็นผลไม้ ตัวอื่นไม่ใช่', tier:1},
      {q:'จำ 3 อย่างนี้: 🐶🐱🐰 แล้วเลือกลำดับที่ถูกต้อง', emoji:'🧠', choices:['🐶🐱🐰','🐱🐶🐰','🐰🐱🐶','🐶🐰🐱'], correct:0, explain:'ลำดับที่ถูกคือ 🐶🐱🐰', tier:1},
      {q:'กติกา: เลือกเฉพาะ "สิ่งที่บินได้" — ข้อใดถูก?', emoji:'🦅', choices:['🐦','🐟','🐢','🐍'], correct:0, explain:'🐦 นกบินได้ ตัวอื่นบินไม่ได้', tier:1},
      {q:'กติกาเปลี่ยนเป็น "เลือกสิ่งที่มีล้อ" — ข้อใดถูก?', emoji:'🛞', choices:['🚗','🍎','🐶','📖'], correct:0, explain:'🚗 มีล้อ ต้องคิดตามกติกาใหม่', tier:2},
      {q:'จำลำดับ: 🍎🍌🍎🍇 — ตัวที่ 3 คือตัวใด?', emoji:'🧠', choices:['🍎','🍌','🍇','🍓'], correct:0, explain:'ตัวที่ 3 ในลำดับคือ 🍎', tier:2},
      {q:'ถ้ากด "ปรบมือ" เฉพาะเมื่อเห็น 🌟 — เห็น 🌙 ควรทำอย่างไร?', emoji:'🖐️', choices:['อยู่เฉยๆ','ปรบมือ','กระโดด','ตะโกน'], correct:0, explain:'กติกาให้ปรบเฉพาะ 🌟 เห็น 🌙 จึง "อยู่เฉยๆ"', tier:2},
      {q:'จัดกลุ่ม: 🐶🐱🌻 — สิ่งใดควรอยู่คนละกลุ่ม?', emoji:'🗂️', choices:['🌻','🐶','🐱','ทุกอย่างกลุ่มเดียว'], correct:0, explain:'🌻 เป็นดอกไม้ ต่างจากสัตว์ 🐶🐱', tier:2},
      {q:'จัดกลุ่ม: 🍎🍌🐱 สิ่งใดควรอยู่คนละกลุ่ม?', emoji:'🐱', choices:['🐱 (สัตว์)','🍎','🍌','ทุกอย่างกลุ่มเดียว'], correct:0, explain:'🍎🍌 เป็นผลไม้ 🐱 เป็นสัตว์ อยู่คนละกลุ่ม', tier:1},
      {q:'มือคู่กับถุงมือ เท้าคู่กับอะไร?', emoji:'🦶', choices:['รองเท้า','หมวก','เสื้อ','แว่นตา'], correct:0, explain:'เท้าใส่รองเท้า', tier:1},
      {q:'สิ่งใดมีขนาดเล็กที่สุด?', emoji:'🐜', choices:['มด','แมว','ช้าง','หมา'], correct:0, explain:'มดเล็กที่สุด', tier:2},
      {q:'ครึ่งหนึ่งของ 6 คือเท่าไร?', emoji:'➗', choices:['3','2','4','6'], correct:0, explain:'6 ÷ 2 = 3', tier:2}
    ]
  },
  {
    /* Phase 1.2 — executive function แบบ interactive (mechanic ใหม่): "นกฮูกสั่ง"
       ฝึก inhibitory control (แตะเฉพาะที่ตรงกติกา ห้ามแตะมั่ว) + cognitive flexibility (กติกาสลับกลางเกม) + มีตัวจับเวลาต่อด่าน
       type:'skill' mode:'ef' — ดู startEfGame ใน app.js (คลังของใช้ EF_CATEGORIES) */
    id:'p1-iq3', name:'เชาวน์ ป.1 · นกฮูกสั่ง', emoji:'🦉', icon:'assets/icons/p1-ef.svg', color:'#17A65B', light:'#D6F3E4',
    type:'skill', mode:'ef', levels:10, grade:'p1', isNew:true
  },
  /* ---------- เกมฝึกทักษะ ป.1 (reuse engine เดิม: นาฬิกา/ทายเงา/จับคู่/เปียโน/ผสมสี — คลังร่วมกับระดับเตรียม ป.1) ---------- */
  {
    id:'p1-clock1', name:'นาฬิกา ป.1 · บอกเวลา', emoji:'🕓', icon:'assets/icons/p1-clock1.svg', color:'#4A9EDF', light:'#DCEEFB',
    type:'skill', mode:'clock', clockMode:1, levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-clock2', name:'นาฬิกา ป.1 · บอกนาที', emoji:'🕧', icon:'assets/icons/p1-clock2.svg', color:'#3A7FC0', light:'#DCEEFB',
    type:'skill', mode:'clock', clockMode:2, levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-clock3', name:'นาฬิกา ป.1 · อีกกี่ชั่วโมง', emoji:'⏱️', icon:'assets/icons/p1-clock3.svg', color:'#3576B5', light:'#DCEEFB',
    type:'skill', mode:'clock', clockMode:3, levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-clock4', name:'นาฬิกา ป.1 · ชั่วโมงและนาที', emoji:'⌚', icon:'assets/icons/p1-clock4.svg', color:'#2F6BA8', light:'#DCEEFB',
    type:'skill', mode:'clock', clockMode:4, levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-shadow', name:'ทายเงา ป.1', emoji:'🌑', icon:'assets/icons/p1-shadow.svg', color:'#5D6D9E', light:'#E4E8F6',
    type:'skill', mode:'shadow', levels:12, grade:'p1', isNew:true
  },
  {
    id:'p1-shadow2', name:'ทายเงา ป.1 · เงาซ้อน 2', emoji:'🕶️', icon:'assets/icons/p1-shadow2.svg', color:'#4A5A8E', light:'#E4E8F6',
    type:'skill', mode:'shadow', overlap:2, levels:12, grade:'p1', isNew:true
  },
  {
    id:'p1-shadow3', name:'ทายเงา ป.1 · เงาซ้อน 3', emoji:'🌫️', icon:'assets/icons/p1-shadow3.svg', color:'#404E7C', light:'#E4E8F6',
    type:'skill', mode:'shadow', overlap:3, levels:12, grade:'p1', isNew:true
  },
  {
    id:'p1-memory', name:'จับคู่โดมิโน ป.1', emoji:'🃏', icon:'assets/icons/p1-memory.svg', color:'#E0764C', light:'#FBE3D4',
    type:'skill', mode:'memory', levels:3, grade:'p1', isNew:true
  },
  {
    id:'p1-piano', name:'เปียโน ป.1', emoji:'🎺', icon:'assets/icons/p1-piano.svg', color:'#C86FB0', light:'#F8E3F1',
    type:'skill', mode:'music', musicMode:1, levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-piano2', name:'เปียโน ป.1 · จำทำนอง', emoji:'🎷', icon:'assets/icons/p1-music-play2.svg', color:'#B85FA0', light:'#F8E3F1',
    type:'skill', mode:'music', musicMode:2, levels:7, grade:'p1', isNew:true
  },
  {
    id:'p1-piano3', name:'เปียโน ป.1 · หาโน้ตเอง', emoji:'🪗', icon:'assets/icons/p1-music-play3.svg', color:'#A8508F', light:'#F8E3F1',
    type:'skill', mode:'music', musicMode:3, levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-colormix', name:'ผสมสีวิเศษ ป.1', emoji:'🪣', icon:'assets/icons/p1-colormix.svg', color:'#E8734C', light:'#FDE7DC',
    type:'skill', mode:'mix', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-colormix2', name:'ผสมสีวิเศษ 2 ป.1', emoji:'🫧', icon:'assets/icons/p1-colormix2.svg', color:'#5E8FD8', light:'#E2ECFB',
    type:'skill', mode:'mix', mixAdvanced:true, levels:10, grade:'p1', isNew:true
  },
  {
    /* Phase 1.3 — coding mechanic ใหม่ "เรียงคำสั่งหุ่นยนต์": เรียงบัตรคำสั่ง (เดินหน้า/เลี้ยวซ้าย-ขวา) ให้หุ่นยนต์ไปถึงเป้าบนกริด
       ดู startCodeGame ใน app.js (คลังด่าน ROBOT_LEVELS) — ออกแบบ engine เผื่อ loop/เงื่อนไข (ป.2-6) ในอนาคต */
    id:'p1-code', name:'พาแมวกลับบ้าน 1', emoji:'🤖', icon:'assets/icons/p1-code.svg', color:'#2BB3A3', light:'#D6F5F1',
    type:'skill', mode:'code', codeSet:'code1', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-code2', name:'พาแมวกลับบ้าน 2', emoji:'🦾', icon:'assets/icons/p1-code2.svg', color:'#2596A0', light:'#D6F1F5',
    type:'skill', mode:'code', codeSet:'code2', levels:8, grade:'p1', isNew:true
  },
  {
    id:'p1-code3', name:'พาแมวกลับบ้าน 3', emoji:'🕹️', icon:'assets/icons/p1-code3.svg', color:'#1F7E88', light:'#D6EDF0',
    type:'skill', mode:'code', codeSet:'code3', levels:8, grade:'p1', isNew:true
  },
  {
    /* Phase 1.4 — predict-check mechanic ใหม่ "นักวิทย์ทายผล": ทายก่อนว่าจะเกิดอะไร แล้วดูผลจริง + เหตุผล
       ดู startScienceGame ใน app.js (คลัง SCIENCE_POOLS) — engine เผื่อ ป.2/ป.5 ใช้ต่อ */
    id:'p1-sci1', name:'นักวิทย์ทายผล 1 · ลอยหรือจม', emoji:'🔬', icon:'assets/icons/p1-sci1.svg', color:'#3FA9C9', light:'#D9F0F8',
    type:'skill', mode:'science', sciSet:'sci1', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-sci2', name:'นักวิทย์ทายผล 2 · รอบตัวเรา', emoji:'🧪', icon:'assets/icons/p1-sci2.svg', color:'#7C6FD6', light:'#E6E2FA',
    type:'skill', mode:'science', sciSet:'sci2', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-emotion', name:'คุณธรรม ป.1 · รู้ใจเพื่อน', emoji:'💞', icon:'assets/icons/p1-emotion.svg', color:'#FF7A9C', light:'#FFE1E9', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Phase 1.1 — EQ/CASEL: รู้จักอารมณ์ตนเอง + เข้าใจสาเหตุ + เห็นใจผู้อื่น (เติมเต็ม behavior ให้ครบ 5 ด้าน) */
      {q:'หน้าไหนแสดงความรู้สึก "ดีใจ"?', emoji:'😊', choices:['😀','😢','😠','😱'], correct:0, explain:'😀 คือหน้ายิ้ม = ดีใจ', tier:1},
      {q:'หน้าไหนแสดงความรู้สึก "เสียใจ"?', emoji:'😊', choices:['😀','😢','😠','😄'], correct:1, explain:'😢 คือหน้าร้องไห้ = เสียใจ', tier:1},
      {q:'หน้าไหนแสดงความรู้สึก "โกรธ"?', emoji:'😊', choices:['😀','😴','😠','😊'], correct:2, explain:'😠 คือหน้าบึ้ง = โกรธ', tier:1},
      {q:'ได้ของขวัญวันเกิด หนูจะรู้สึกอย่างไร?', emoji:'🎁', choices:['ดีใจ','โกรธ','กลัว','เสียใจ'], correct:0, explain:'ได้ของขวัญ ทำให้รู้สึก "ดีใจ"', tier:2},
      {q:'ทำตุ๊กตาตัวโปรดหาย หนูจะรู้สึกอย่างไร?', emoji:'🧸', choices:['ดีใจ','เสียใจ','หิว','ง่วง'], correct:1, explain:'ของรักหาย ทำให้รู้สึก "เสียใจ"', tier:2},
      {q:'อยู่คนเดียวในที่มืดๆ หนูอาจรู้สึกอย่างไร?', emoji:'🌙', choices:['กลัว','ดีใจ','หิว','ตื่นเต้นสนุก'], correct:0, explain:'ที่มืดคนเดียว อาจทำให้รู้สึก "กลัว" ได้', tier:2},
      {q:'เพื่อนร้องไห้เพราะทำดินสอหาย เราควรทำอย่างไร?', emoji:'😢', choices:['หัวเราะ','ปลอบใจและช่วยหา','เดินหนี','แกล้งซ้ำ'], correct:1, explain:'ควร "ปลอบใจและช่วยหา" = เห็นใจเพื่อน', tier:3},
      {q:'เพื่อนสอบได้ที่ 1 เราควรรู้สึกและทำอย่างไร?', emoji:'🏆', choices:['อิจฉา','ยินดีด้วยกับเพื่อน','โกรธ','ไม่สนใจ'], correct:1, explain:'ควร "ยินดีด้วย" กับความสำเร็จของเพื่อน', tier:3},
      {q:'เห็นเพื่อนใหม่ยืนอยู่คนเดียว ไม่มีเพื่อนเล่น ควรทำอย่างไร?', emoji:'🧍', choices:['ชวนมาเล่นด้วยกัน','ทำเป็นไม่เห็น','ล้อเลียน','เดินหนี'], correct:0, explain:'"ชวนมาเล่นด้วยกัน" ทำให้เพื่อนรู้สึกอบอุ่น', tier:3},
      {q:'เวลาโกรธมากๆ วิธีไหนช่วยให้ใจเย็นลง?', emoji:'😤', choices:['ทุบของ','ตะโกนใส่คน','หายใจลึกๆ นับ 1-10','แกล้งคนอื่น'], correct:2, explain:'"หายใจลึกๆ นับ 1-10" ช่วยให้ใจเย็นลง', tier:3},
      {q:'หน้าไหนแสดงความรู้สึก "ตกใจ/กลัว"?', emoji:'😊', choices:['😱','😀','😋','😎'], correct:0, explain:'😱 คือหน้าตกใจ/กลัว', tier:1},
      {q:'หน้าไหนแสดงความรู้สึก "ง่วงนอน"?', emoji:'😊', choices:['😴','😀','😢','😠'], correct:0, explain:'😴 คือหน้าง่วงนอน', tier:1},
      {q:'หน้าไหนแสดงความรู้สึก "หัวเราะสนุก"?', emoji:'😊', choices:['😆','😢','😠','😱'], correct:0, explain:'😆 คือหน้าหัวเราะสนุก', tier:1},
      {q:'โดนดุเพราะทำผิด หนูจะรู้สึกอย่างไร?', emoji:'😔', choices:['เสียใจ/ผิดหวัง','ดีใจ','สนุก','หิว'], correct:0, explain:'โดนดุ ทำให้รู้สึก "เสียใจ/ผิดหวัง"', tier:2},
      {q:'ได้ไปเที่ยวสวนสนุกที่อยากไป หนูจะรู้สึกอย่างไร?', emoji:'🎡', choices:['ตื่นเต้นดีใจ','เศร้า','โกรธ','กลัว'], correct:0, explain:'ได้ไปที่ชอบ ทำให้รู้สึก "ตื่นเต้นดีใจ"', tier:2},
      {q:'เพื่อนกลัวความมืด เราช่วยเพื่อนอย่างไรดี?', emoji:'🌙', choices:['อยู่เป็นเพื่อนและปลอบ','หัวเราะเยาะ','ทำให้กลัวกว่าเดิม','เดินหนี'], correct:0, explain:'ควร "อยู่เป็นเพื่อนและปลอบ" ให้เพื่อนอุ่นใจ', tier:3},
      {q:'เผลอทำของเล่นของเพื่อนพัง ควรทำอย่างไร?', emoji:'💔', choices:['ขอโทษและรับผิด','โทษคนอื่น','ทำเป็นไม่รู้','หนีไป'], correct:0, explain:'ควร "ขอโทษและรับผิด" อย่างจริงใจ', tier:3},
      {q:'เมื่อได้ของขวัญที่ชอบ เรารู้สึกอย่างไร?', emoji:'🎁', choices:['ดีใจ','เศร้า','โกรธ','กลัว'], correct:0, explain:'ได้ของที่ชอบจะรู้สึกดีใจ', tier:1},
      {q:'เห็นเพื่อนร้องไห้ เราควรทำอย่างไร?', emoji:'😢', choices:['ปลอบใจเพื่อน','หัวเราะ','เดินหนี','ล้อเลียน'], correct:0, explain:'ควรปลอบใจเพื่อน', tier:1},
      {q:'เมื่อรู้สึกโกรธมาก ควรทำอย่างไร?', emoji:'😤', choices:['หายใจลึกๆ ให้ใจเย็น','ตะโกนใส่คน','ทำลายของ','ตีคนอื่น'], correct:0, explain:'ควรหายใจลึกๆ ให้ใจเย็นลง', tier:2},
      {q:'เมื่อชนะเกม เพื่อนแพ้ ควรทำอย่างไร?', emoji:'🏆', choices:['ให้กำลังใจเพื่อน','ล้อเลียนเพื่อน','โอ้อวด','หัวเราะเยาะ'], correct:0, explain:'ควรมีน้ำใจนักกีฬา ให้กำลังใจเพื่อน', tier:2},
      {q:'เมื่อทำผิด เรารู้สึกอย่างไรและควรทำอย่างไร?', emoji:'😔', choices:['เสียใจและขอโทษ','ดีใจ','โทษคนอื่น','โกหก'], correct:0, explain:'ควรรู้สึกเสียใจและขอโทษ', tier:3},
      {q:'เมื่อกลัวความมืด เราควรทำอย่างไร?', emoji:'🌙', choices:['บอกผู้ใหญ่/เปิดไฟ','ร้องไห้เสียงดัง','ซ่อนตัวเงียบๆ','โกรธ'], correct:0, explain:'ควรบอกผู้ใหญ่หรือเปิดไฟให้สว่าง', tier:3}
    ]
  },
  /* ---------- ดนตรี ป.1 : 2 level ---------- */
  {
    id:'p1-music1', name:'ดนตรี ป.1 · เครื่องดนตรีและเสียง', emoji:'🎵', icon:'assets/icons/p1-music.svg', color:'#4C8DF0', light:'#DEEAFC', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — เครื่องดนตรี / วิธีเล่น / เสียงสูง-ต่ำ-ดัง-เบา */
      {q:'🥁 เป็นเครื่องดนตรีที่เล่นโดยการทำอะไร?', emoji:'🥁', choices:['ตี','เป่า','ดีด','สี'], correct:0, explain:'กลองเล่นโดยการ "ตี"', tier:1},
      {q:'🎹 คือเครื่องดนตรีชนิดใด?', emoji:'🎹', choices:['เปียโน','กลอง','ขลุ่ย','กีตาร์'], correct:0, explain:'🎹 คือเปียโน', tier:1},
      {q:'เครื่องดนตรีใดเล่นโดยการ "เป่า"?', emoji:'🎶', choices:['ขลุ่ย','กลอง','ระนาด','ฉิ่ง'], correct:0, explain:'ขลุ่ยเล่นโดยการ "เป่า"', tier:1},
      {q:'เครื่องดนตรีใดเล่นโดยการ "ดีด" สาย?', emoji:'🎸', choices:['กีตาร์','กลอง','ขลุ่ย','ฉิ่ง'], correct:0, explain:'กีตาร์เล่นโดยการ "ดีด" สาย', tier:1},
      {q:'ตอนน้องเล็กนอนหลับ เราควรร้องเพลงแบบใด?', emoji:'😴', choices:['เบาๆ','ดังมากๆ','ตะโกน','ไม่ร้องเลย'], correct:0, explain:'ควรร้อง "เบาๆ" เพื่อไม่ปลุกน้อง', tier:1},
      {q:'เพลงช้าๆ เบาๆ ทำให้เรารู้สึกอย่างไร?', emoji:'🎵', choices:['สงบผ่อนคลาย','ตื่นเต้นมาก','โกรธ','หิว'], correct:0, explain:'เพลงช้าเบาๆ ทำให้รู้สึก "สงบผ่อนคลาย"', tier:1},
      {q:'เสียงไหน "สูง" กว่ากัน?', emoji:'🔊', choices:['เสียงนกจิ๊บเล็กๆ','เสียงกลองใหญ่ตุ้มๆ','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'เสียงนกจิ๊บเป็นเสียงสูง เสียงกลองเป็นเสียงต่ำ', tier:2},
      {q:'เสียงไหน "ต่ำ" กว่ากัน?', emoji:'🔉', choices:['เสียงช้างร้อง','เสียงนกหวีด','เสียงกระดิ่งเล็ก','เท่ากัน'], correct:0, explain:'เสียงช้างร้องเป็นเสียงต่ำ (ทุ้ม)', tier:2},
      {q:'ระนาดเป็นเครื่องดนตรีที่เล่นโดยการทำอะไร?', emoji:'🎐', choices:['ตี','เป่า','ดีด','สี'], correct:0, explain:'ระนาดเล่นโดยการ "ตี" ด้วยไม้', tier:2},
      {q:'เครื่องดนตรีใดเล่นโดยการ "สี" (ลากคันชัก)?', emoji:'🎻', choices:['ไวโอลิน','กลอง','ขลุ่ย','เปียโน'], correct:0, explain:'ไวโอลินเล่นโดยการ "สี" ด้วยคันชัก', tier:2},
      {q:'เสียงฟ้าร้องดังเปรี้ยง เป็นเสียงแบบใด?', emoji:'⛈️', choices:['ดังมาก','เบามาก','ไม่มีเสียง','เสียงสูงเล็ก'], correct:0, explain:'เสียงฟ้าร้องเป็นเสียง "ดังมาก"', tier:2},
      {q:'ไวโอลินตัวเล็กกับดับเบิลเบสตัวใหญ่ ตัวไหนเสียงต่ำกว่า?', emoji:'🎼', choices:['ดับเบิลเบสตัวใหญ่','ไวโอลินตัวเล็ก','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'เครื่องยิ่งใหญ่ยิ่งเสียงต่ำ ดับเบิลเบสจึงเสียงต่ำกว่า', tier:2},
      {q:'เสียงกระซิบเบาๆ เป็นเสียงแบบใด?', emoji:'🤫', choices:['เสียงเบา','เสียงดัง','เสียงสูงมาก','ไม่มีเสียง'], correct:0, explain:'เสียงกระซิบเป็น "เสียงเบา"', tier:1},
      {q:'ฉิ่ง เล่นโดยการทำอะไร?', emoji:'🔔', choices:['ตี/กระทบกัน','เป่า','ดีด','สี'], correct:0, explain:'ฉิ่งเล่นโดยการ "ตี/กระทบกัน"', tier:1},
      {q:'ร้องเพลงในงานวันเกิดเพื่อน ควรร้องแบบใด?', emoji:'🎂', choices:['ดังและสนุก','เบาที่สุด','ไม่ร้องเลย','ร้องไห้'], correct:0, explain:'งานฉลองควรร้อง "ดังและสนุก"', tier:1},
      {q:'เสียงเป็ดร้อง "ก้าบๆ" กับเสียงสิงโตคำราม อันไหนเสียงสูงกว่า?', emoji:'🦆', choices:['เสียงเป็ด','เสียงสิงโต','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'เสียงเป็ดสูงกว่าเสียงสิงโต (สิงโตเสียงต่ำทุ้ม)', tier:2},
      {q:'ทรัมเป็ต 🎺 เล่นโดยการทำอะไร?', emoji:'🎺', choices:['เป่า','ตี','ดีด','สี'], correct:0, explain:'ทรัมเป็ตเล่นโดยการ "เป่า"', tier:2},
      {q:'เสียงระฆังใหญ่กับกระดิ่งเล็ก อันไหนเสียงต่ำกว่า?', emoji:'🛎️', choices:['ระฆังใหญ่','กระดิ่งเล็ก','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'ระฆังใหญ่เสียงต่ำกว่า (ยิ่งใหญ่ยิ่งเสียงต่ำ)', tier:2},
      {q:'เครื่องดนตรีใดใช้ตี?', emoji:'🥁', choices:['กลอง','ขลุ่ย','กีตาร์','ซอ'], correct:0, explain:'กลองเป็นเครื่องตี', tier:1},
      {q:'เสียงนกร้องเป็นเสียงจากอะไร?', emoji:'🐦', choices:['ธรรมชาติ','เครื่องดนตรี','รถยนต์','โทรทัศน์'], correct:0, explain:'เสียงนกเป็นเสียงจากธรรมชาติ', tier:1},
      {q:'ปรบมือเป็นการทำอะไร?', emoji:'👏', choices:['ให้จังหวะ','วาดภาพ','ร้องเพลง','เต้น'], correct:0, explain:'ปรบมือช่วยให้จังหวะ', tier:1},
      {q:'ขลุ่ยทำให้เกิดเสียงด้วยวิธีใด?', emoji:'🎵', choices:['เป่าลม','ตี','ดีด','สี'], correct:0, explain:'ขลุ่ยเป็นเครื่องเป่า', tier:2},
      {q:'เสียงฟ้าร้องเป็นเสียงแบบใด?', emoji:'⛈️', choices:['เสียงดัง','เสียงเบา','เสียงเพลง','เสียงกระซิบ'], correct:0, explain:'ฟ้าร้องเป็นเสียงดัง', tier:2},
      {q:'กีตาร์เล่นด้วยวิธีใด?', emoji:'🎸', choices:['ดีด','ตี','เป่า','สี'], correct:0, explain:'กีตาร์เป็นเครื่องดีด', tier:2}
    ]
  },
  {
    id:'p1-music2', name:'ดนตรี ป.1 · จังหวะและโน้ต', emoji:'🎻', icon:'assets/icons/p1-music2.svg', color:'#2F6BC4', light:'#DEEAFC', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 — จังหวะ / โน้ตไทย-สากล / ทำนอง */
      {q:'การตบมือหรือเคาะตามเพลงให้พร้อมกัน เรียกว่าอะไร?', emoji:'👏', choices:['จังหวะ','สีสัน','กลิ่น','รูปร่าง'], correct:0, explain:'การตบมือตามเพลง = การเข้า "จังหวะ"', tier:1},
      {q:'เสียงหลายๆ เสียงที่เรียงต่อกันไพเราะเป็นเพลง เรียกว่าอะไร?', emoji:'🎶', choices:['ทำนอง','สี','เส้น','ตัวเลข'], correct:0, explain:'เสียงที่เรียงกันเป็นเพลง = "ทำนอง"', tier:1},
      {q:'โน้ตดนตรีไทย "ด ร ม ฟ ซ ล ท" ตัวแรกคือตัวใด?', emoji:'🎼', choices:['ด','ท','ซ','ม'], correct:0, explain:'ตัวแรกคือ "ด" (โด)', tier:1},
      {q:'ปรบมือตามจังหวะ ตบ-ตบ-ตบ ช้าเท่ากันทุกครั้ง เรียกจังหวะแบบนี้ว่าอะไร?', emoji:'👏', choices:['จังหวะสม่ำเสมอ','ไม่มีจังหวะ','จังหวะมั่ว','เสียงสูง'], correct:0, explain:'เคาะเท่ากันทุกครั้ง = "จังหวะสม่ำเสมอ"', tier:1},
      {q:'โน้ตดนตรีไทยตัวสุดท้ายใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ท','ด','ซ','ล'], correct:0, explain:'ตัวสุดท้ายคือ "ท" (ที)', tier:1},
      {q:'เพลงที่เล่นเร็วๆ สนุกๆ ทำให้อยากทำอะไร?', emoji:'💃', choices:['เต้น/ขยับตัว','นอนหลับ','ร้องไห้','อยู่นิ่งๆ'], correct:0, explain:'เพลงเร็วสนุกทำให้อยาก "เต้น/ขยับตัว"', tier:1},
      {q:'เสียงกลองใหญ่กับเสียงกระดิ่งเล็ก เสียงใดต่ำกว่า?', emoji:'🥁', choices:['เสียงกลองใหญ่','เสียงกระดิ่งเล็ก','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'กลองใหญ่ให้เสียงต่ำ (ทุ้ม) กว่ากระดิ่งเล็ก', tier:2},
      {q:'เสียงยาวกับเสียงสั้น ต่างกันเรื่องใด?', emoji:'⏱️', choices:['ระยะเวลาของเสียง','สีของเสียง','กลิ่นของเสียง','รูปร่างของเสียง'], correct:0, explain:'เสียงยาว-สั้นต่างกันที่ระยะเวลาที่เสียงดังอยู่', tier:2},
      {q:'โน้ตไทยตัวที่ 3 ใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ม','ร','ฟ','ซ'], correct:0, explain:'ตัวที่ 3 คือ "ม" (มี)', tier:2},
      {q:'เคาะจังหวะ เร็ว-เร็ว-ช้า สลับกันไป เรียกจังหวะแบบนี้ว่าอะไร?', emoji:'🥁', choices:['จังหวะไม่สม่ำเสมอ','จังหวะเท่ากัน','ไม่มีจังหวะ','เสียงเบา'], correct:0, explain:'เคาะเร็ว-ช้าสลับ = "จังหวะไม่สม่ำเสมอ"', tier:2},
      {q:'ปรบมือตามเพลงช้ากับเพลงเร็ว ต่างกันเรื่องใด?', emoji:'👏', choices:['ความเร็วของจังหวะ','สีของเสียง','กลิ่น','ขนาดของเสียง'], correct:0, explain:'เพลงช้า-เร็วต่างกันที่ความเร็วของจังหวะ', tier:2},
      {q:'เสียงฝนตกกับเสียงกลอง เสียงใดเป็นเสียงจากธรรมชาติ?', emoji:'🌧️', choices:['เสียงฝนตก','เสียงกลอง','ทั้งสองอย่าง','ไม่มีเลย'], correct:0, explain:'เสียงฝนเป็นเสียงจากธรรมชาติ ส่วนกลองเป็นเสียงจากเครื่องดนตรี', tier:2},
      {q:'โน้ตไทยตัวที่ 2 ใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ร','ด','ม','ฟ'], correct:0, explain:'ตัวที่ 2 คือ "ร" (เร)', tier:1},
      {q:'เพลงกล่อมเด็กควรมีจังหวะแบบใด?', emoji:'👶', choices:['ช้านุ่มนวล','เร็วแรง','ดังมาก','กระโดดโลดเต้น'], correct:0, explain:'เพลงกล่อมเด็กควร "ช้านุ่มนวล" ให้หลับสบาย', tier:1},
      {q:'เสียงของกลองใหญ่เป็นเสียงแบบใด?', emoji:'🥁', choices:['เสียงต่ำ ทุ้ม','เสียงสูง แหลม','เสียงเบามาก','ไม่มีเสียง'], correct:0, explain:'กลองใหญ่ให้เสียงต่ำและทุ้มกว่ากลองเล็ก', tier:1},
      {q:'ร้องเพลงพร้อมเพื่อนในห้องเรียน ควรร้องเสียงแบบใด?', emoji:'🎶', choices:['ดังพอดี ไม่ตะโกน','ดังที่สุดเท่าที่ทำได้','เบาจนไม่ได้ยิน','ไม่ต้องร้อง'], correct:0, explain:'ควรร้องดังพอดีและพร้อมเพรียงกับเพื่อน', tier:2},
      {q:'เคาะไม้ 1 ครั้งต่อ 1 จังหวะ เท่ากันตลอดเพลง เรียกว่าอะไร?', emoji:'🥢', choices:['จังหวะสม่ำเสมอ','ไม่มีจังหวะ','จังหวะสลับไปมา','เสียงสูง'], correct:0, explain:'เคาะเท่ากันตลอด = จังหวะสม่ำเสมอ', tier:2},
      {q:'โน้ตไทยตัวที่ 5 ใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ซ','ฟ','ล','ม'], correct:0, explain:'ตัวที่ 5 คือ "ซ" (ซอล)', tier:2},
      {q:'โน้ตตัวแรกคือตัวใด?', emoji:'🎵', choices:['โด','เร','มี','ฟา'], correct:0, explain:'โน้ตตัวแรกคือ โด', tier:1},
      {q:'เรียงต่อ: ด ร ม ▢', emoji:'🎶', choices:['ฟ','ซ','ล','ท'], correct:0, explain:'ลำดับคือ ด ร ม ฟ', tier:1},
      {q:'เคาะช้าๆ กับเคาะเร็วๆ ต่างกันเรื่องใด?', emoji:'🥁', choices:['จังหวะ','สี','ขนาด','กลิ่น'], correct:0, explain:'ช้า-เร็วต่างกันที่จังหวะ', tier:1},
      {q:'เพลงกล่อมเด็กควรร้องอย่างไร?', emoji:'🌙', choices:['ช้า เบา นุ่มนวล','ดัง เร็ว','ตะโกน','กระโดด'], correct:0, explain:'เพลงกล่อมเด็กร้องช้า เบา นุ่มนวล', tier:2},
      {q:'โน้ตตัวที่ 3 ใน ด ร ม ฟ ซ คือตัวใด?', emoji:'🎼', choices:['ม','ร','ฟ','ซ'], correct:0, explain:'ตัวที่ 3 คือ ม (มี)', tier:2},
      {q:'เสียงสูงกับเสียงต่ำต่างกันอย่างไร?', emoji:'📈', choices:['ระดับเสียง','ความดัง','สี','กลิ่น'], correct:0, explain:'ต่างกันที่ระดับเสียงสูง-ต่ำ', tier:2}
    ]
  },
  /* ---------- ศิลปะ ป.1 : 2 level ---------- */
  {
    id:'p1-art1', name:'ศิลปะ ป.1 · สีสัน', emoji:'🖌️', icon:'assets/icons/p1-art.svg', color:'#FF7A45', light:'#FFE4D6', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — แม่สี / การผสมสี / สีในธรรมชาติ */
      {q:'ข้อใดคือ "แม่สี" 3 สี?', emoji:'🖍️', choices:['แดง เหลือง น้ำเงิน','ดำ ขาว เทา','ชมพู ส้ม ม่วง','เขียว ฟ้า แดง'], correct:0, explain:'แม่สีคือ แดง เหลือง น้ำเงิน', tier:1},
      {q:'สีแดง + สีเหลือง ผสมกันได้สีอะไร?', emoji:'🎨', choices:['สีส้ม','สีเขียว','สีม่วง','สีน้ำตาล'], correct:0, explain:'แดง + เหลือง = สีส้ม 🟠', tier:1},
      {q:'สีฟ้า + สีเหลือง ผสมกันได้สีอะไร?', emoji:'🎨', choices:['สีเขียว','สีส้ม','สีชมพู','สีดำ'], correct:0, explain:'ฟ้า + เหลือง = สีเขียว 🟢', tier:1},
      {q:'ท้องฟ้าตอนกลางวันปกติเป็นสีอะไร?', emoji:'🌤️', choices:['สีฟ้า','สีดำ','สีแดง','สีเขียว'], correct:0, explain:'ท้องฟ้ากลางวันเป็น "สีฟ้า"', tier:1},
      {q:'ใบไม้ส่วนใหญ่เป็นสีอะไร?', emoji:'🍃', choices:['สีเขียว','สีแดง','สีฟ้า','สีดำ'], correct:0, explain:'ใบไม้ส่วนใหญ่เป็น "สีเขียว"', tier:1},
      {q:'อยากระบายสีให้ภาพสวย ใช้อุปกรณ์ใด?', emoji:'🖌️', choices:['สีเทียน/พู่กัน','ช้อน','ยางลบ','ไม้บรรทัด'], correct:0, explain:'ใช้ "สีเทียนหรือพู่กัน" ระบายสี', tier:1},
      {q:'สีแดง + สีน้ำเงิน ผสมกันได้สีอะไร?', emoji:'🎨', choices:['สีม่วง','สีเขียว','สีส้ม','สีเหลือง'], correct:0, explain:'แดง + น้ำเงิน = สีม่วง 🟣', tier:2},
      {q:'สีขาว + สีแดง ผสมกันได้สีอ่อนแบบใด?', emoji:'🎨', choices:['สีชมพู','สีเขียว','สีดำ','สีฟ้า'], correct:0, explain:'ขาว + แดง = สีชมพู (สีแดงอ่อนลง)', tier:2},
      {q:'สีใดให้ความรู้สึก "ร้อน/อบอุ่น"?', emoji:'🔥', choices:['สีแดง','สีฟ้า','สีเขียว','สีเทา'], correct:0, explain:'สีแดง (โทนร้อน) ให้ความรู้สึกอบอุ่น', tier:2},
      {q:'สีใดให้ความรู้สึก "เย็นสบาย"?', emoji:'❄️', choices:['สีฟ้า','สีแดง','สีส้ม','สีเหลือง'], correct:0, explain:'สีฟ้า (โทนเย็น) ให้ความรู้สึกเย็นสบาย', tier:2},
      {q:'ผสมแม่สีครบ 3 สี (แดง เหลือง น้ำเงิน) มากๆ จะได้สีโทนใด?', emoji:'🎨', choices:['สีน้ำตาล-เทาเข้ม','สีขาวสว่าง','สีชมพูอ่อน','สีทอง'], correct:0, explain:'ผสมหลายสีเข้มขึ้นเรื่อยๆ ได้โทน "น้ำตาล-เทาเข้ม"', tier:2},
      {q:'กลางคืนท้องฟ้ามืดเป็นสีโทนใด?', emoji:'🌌', choices:['น้ำเงินเข้ม-ดำ','เหลืองสด','เขียวสว่าง','ส้มอ่อน'], correct:0, explain:'ท้องฟ้ากลางคืนเป็นโทน "น้ำเงินเข้ม-ดำ"', tier:2},
      {q:'กล้วยสุกส่วนใหญ่เป็นสีอะไร?', emoji:'🍌', choices:['สีเหลือง','สีฟ้า','สีม่วง','สีดำ'], correct:0, explain:'กล้วยสุกเป็น "สีเหลือง"', tier:1},
      {q:'ใบไม้และหญ้าส่วนใหญ่เป็นสีอะไร?', emoji:'🌿', choices:['สีเขียว','สีแดง','สีฟ้า','สีส้ม'], correct:0, explain:'ใบไม้/หญ้าเป็น "สีเขียว"', tier:1},
      {q:'ข้อใด "ไม่ใช่" แม่สี?', emoji:'🎨', choices:['สีเขียว','สีแดง','สีเหลือง','สีน้ำเงิน'], correct:0, explain:'สีเขียวเกิดจากผสมสี ไม่ใช่แม่สี (แม่สี = แดง เหลือง น้ำเงิน)', tier:2},
      {q:'สีรุ้ง 🌈 มีกี่สี?', emoji:'🌈', choices:['7 สี','5 สี','3 สี','10 สี'], correct:0, explain:'สีรุ้งมี 7 สี', tier:2},
      {q:'มะเขือเทศสุกเป็นสีอะไร?', emoji:'🍅', choices:['สีแดง','สีเขียว','สีฟ้า','สีดำ'], correct:0, explain:'มะเขือเทศสุกเป็น "สีแดง"', tier:1},
      {q:'ท้องฟ้าตอนพระอาทิตย์ตกเป็นสีโทนใด?', emoji:'🌇', choices:['ส้ม-แดง','เขียวสด','ฟ้าใส','ม่วงเข้ม'], correct:0, explain:'ตอนพระอาทิตย์ตกท้องฟ้าเป็นโทน "ส้ม-แดง"', tier:2},
      {q:'สีของกล้วยสุกคือสีอะไร?', emoji:'🍌', choices:['สีเหลือง','สีแดง','สีฟ้า','สีดำ'], correct:0, explain:'กล้วยสุกสีเหลือง', tier:1},
      {q:'สีของใบไม้คือสีอะไร?', emoji:'🍃', choices:['สีเขียว','สีแดง','สีฟ้า','สีส้ม'], correct:0, explain:'ใบไม้สีเขียว', tier:1},
      {q:'ระบายสีควรระบายอย่างไร?', emoji:'🖍️', choices:['อยู่ในเส้น','ออกนอกเส้น','มั่วๆ','ไม่ระบาย'], correct:0, explain:'ควรระบายให้อยู่ในเส้น', tier:1},
      {q:'สีแดงผสมสีเหลืองได้สีอะไร?', emoji:'🟠', choices:['สีส้ม','สีเขียว','สีม่วง','สีดำ'], correct:0, explain:'แดง + เหลือง = ส้ม', tier:2},
      {q:'สีของท้องฟ้ากลางคืนคือสีอะไร?', emoji:'🌃', choices:['สีกรมท่า (น้ำเงินเข้ม)','สีฟ้าสด','สีแดง','สีเหลือง'], correct:0, explain:'ท้องฟ้ากลางคืนสีกรมท่าเข้ม', tier:2},
      {q:'แม่สีมีสีอะไรบ้าง?', emoji:'🎨', choices:['แดง เหลือง น้ำเงิน','ดำ ขาว','เขียว ส้ม','ชมพู ฟ้า'], correct:0, explain:'แม่สีคือ แดง เหลือง น้ำเงิน', tier:2}
    ]
  },
  {
    id:'p1-art2', name:'ศิลปะ ป.1 · เส้นและรูปทรง', emoji:'🖼️', icon:'assets/icons/p1-art2.svg', color:'#D9542F', light:'#FFE4D6', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 — เส้น / รูปร่าง / พื้นผิว */
      {q:'รูปร่างที่มี 3 มุม เรียกว่าอะไร?', emoji:'🔺', choices:['สามเหลี่ยม','วงกลม','สี่เหลี่ยม','ดาว'], correct:0, explain:'รูปที่มี 3 มุม = สามเหลี่ยม 🔺', tier:1},
      {q:'รูปร่างกลมๆ ไม่มีมุมเลย เรียกว่าอะไร?', emoji:'⭕', choices:['วงกลม','สามเหลี่ยม','สี่เหลี่ยม','หัวใจ'], correct:0, explain:'รูปกลมไม่มีมุม = วงกลม ⭕', tier:1},
      {q:'เส้นที่โค้งไปมา ไม่ตรง เรียกว่าเส้นแบบใด?', emoji:'〰️', choices:['เส้นโค้ง','เส้นตรง','เส้นจุด','ไม่มีเส้น'], correct:0, explain:'เส้นที่โค้งไปมา = "เส้นโค้ง"', tier:1},
      {q:'เส้นที่ลากตรงจากซ้ายไปขวา เรียกว่าเส้นแบบใด?', emoji:'➖', choices:['เส้นตรง','เส้นโค้ง','เส้นหยัก','เส้นวน'], correct:0, explain:'ลากตรงไม่โค้ง = "เส้นตรง"', tier:1},
      {q:'รูปร่างที่มี 4 มุม 4 ด้านเท่ากัน เรียกว่าอะไร?', emoji:'🟦', choices:['สี่เหลี่ยมจัตุรัส','วงกลม','สามเหลี่ยม','ดาว'], correct:0, explain:'รูป 4 มุม 4 ด้านเท่ากัน = สี่เหลี่ยมจัตุรัส', tier:1},
      {q:'พื้นผิวของ "สำลี" เป็นแบบใด?', emoji:'☁️', choices:['นุ่มนิ่ม','แข็ง','ขรุขระ','คม'], correct:0, explain:'สำลี "นุ่มนิ่ม"', tier:1},
      {q:'พื้นผิวของ "ก้อนหิน" เป็นแบบใด?', emoji:'🪨', choices:['ขรุขระ','เรียบลื่น','นุ่มนิ่ม','เปียก'], correct:0, explain:'ผิวก้อนหิน "ขรุขระ"', tier:2},
      {q:'พื้นผิวของ "กระจก" เป็นแบบใด?', emoji:'🪞', choices:['เรียบลื่น','ขรุขระ','นุ่มฟู','เป็นขน'], correct:0, explain:'ผิวกระจก "เรียบลื่น"', tier:2},
      {q:'เส้นที่ขึ้นลงเป็นฟันปลา ⋀⋁⋀⋁ เรียกว่าเส้นแบบใด?', emoji:'📈', choices:['เส้นหยัก (ซิกแซก)','เส้นตรง','เส้นวงกลม','เส้นจุด'], correct:0, explain:'เส้นขึ้นลงเป็นฟันปลา = "เส้นหยัก/ซิกแซก"', tier:2},
      {q:'ลูกบอลและส้ม มีรูปทรงแบบใด?', emoji:'⚽', choices:['ทรงกลม','ทรงสี่เหลี่ยม','แบนราบ','สามเหลี่ยม'], correct:0, explain:'ลูกบอล/ส้ม เป็น "ทรงกลม"', tier:2},
      {q:'กล่องของขวัญส่วนใหญ่มีรูปทรงแบบใด?', emoji:'🎁', choices:['ทรงสี่เหลี่ยม (กล่อง)','ทรงกลม','ทรงกรวย','แบนบาง'], correct:0, explain:'กล่องของขวัญเป็น "ทรงสี่เหลี่ยม"', tier:2},
      {q:'พื้นผิวของ "ตุ๊กตาขนนุ่ม" เป็นแบบใด?', emoji:'🧸', choices:['นุ่มฟู','แข็งเรียบ','ขรุขระคม','เปียกลื่น'], correct:0, explain:'ตุ๊กตาขน "นุ่มฟู"', tier:2},
      {q:'รูปดาว ⭐ มีกี่แฉก?', emoji:'⭐', choices:['5 แฉก','3 แฉก','6 แฉก','4 แฉก'], correct:0, explain:'รูปดาวทั่วไปมี 5 แฉก', tier:1},
      {q:'เส้นที่ลากตั้งขึ้น-ลงตรงๆ เรียกว่าเส้นแบบใด?', emoji:'📏', choices:['เส้นตั้ง','เส้นนอน','เส้นโค้ง','เส้นวน'], correct:0, explain:'ลากตั้งขึ้นลง = "เส้นตั้ง"', tier:1},
      {q:'ล้อรถมีรูปร่างแบบใด?', emoji:'🛞', choices:['วงกลม','สี่เหลี่ยม','สามเหลี่ยม','ดาว'], correct:0, explain:'ล้อรถเป็นรูป "วงกลม"', tier:1},
      {q:'พื้นผิวของ "น้ำแข็ง" เป็นแบบใด?', emoji:'🧊', choices:['เย็นเรียบลื่น','ร้อนขรุขระ','นุ่มฟู','เป็นขน'], correct:0, explain:'น้ำแข็ง "เย็นและเรียบลื่น"', tier:2},
      {q:'หมวกปาร์ตี้ทรงแหลม มีรูปทรงแบบใด?', emoji:'🎉', choices:['ทรงกรวย','ทรงกลม','ทรงสี่เหลี่ยม','แบนราบ'], correct:0, explain:'หมวกปาร์ตี้ทรงแหลมเป็น "ทรงกรวย"', tier:2},
      {q:'เส้นที่วนเป็นก้นหอย เรียกว่าเส้นแบบใด?', emoji:'🌀', choices:['เส้นก้นหอย (วน)','เส้นตรง','เส้นตั้ง','เส้นนอน'], correct:0, explain:'เส้นที่วนเข้าหากลาง = "เส้นก้นหอย/เส้นวน"', tier:2},
      {q:'รูปที่มี 3 มุมคือรูปอะไร?', emoji:'🔺', choices:['สามเหลี่ยม','สี่เหลี่ยม','วงกลม','ดาว'], correct:0, explain:'3 มุมคือสามเหลี่ยม', tier:1},
      {q:'รูปกลมๆ ไม่มีมุมคือรูปอะไร?', emoji:'⭕', choices:['วงกลม','สี่เหลี่ยม','สามเหลี่ยม','ดาว'], correct:0, explain:'รูปกลมคือวงกลม', tier:1},
      {q:'เส้นที่ตรงจากบนลงล่างเรียกว่าเส้นอะไร?', emoji:'📏', choices:['เส้นตั้ง','เส้นนอน','เส้นโค้ง','เส้นวน'], correct:0, explain:'เส้นบน-ล่างคือเส้นตั้ง', tier:1},
      {q:'รูปที่มี 4 ด้านเท่ากันคือรูปอะไร?', emoji:'⬜', choices:['สี่เหลี่ยมจัตุรัส','สามเหลี่ยม','วงกลม','วงรี'], correct:0, explain:'4 ด้านเท่ากันคือสี่เหลี่ยมจัตุรัส', tier:2},
      {q:'ปั้นดินน้ำมันเป็นงานศิลปะแบบใด?', emoji:'🎨', choices:['งานปั้น','งานวาด','งานร้องเพลง','งานเขียน'], correct:0, explain:'การปั้นเป็นงานปั้น 3 มิติ', tier:2},
      {q:'พู่กันใช้ทำอะไร?', emoji:'🖌️', choices:['ระบายสี','ตัดกระดาษ','วัดความยาว','เขียนตัวเลข'], correct:0, explain:'พู่กันใช้ระบายสี', tier:2}
    ]
  },
  /* ---------- ธรรมชาติ/วิทยาศาสตร์ ป.1 : 2 level ---------- */
  {
    id:'p1-nature1', name:'ธรรมชาติ ป.1 · สิ่งมีชีวิตและที่อยู่', emoji:'🌱', icon:'assets/icons/p1-nature.svg', color:'#6FBF3B', light:'#E6F6D8', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 1 — สิ่งมีชีวิต-ไม่มีชีวิต / ที่อยู่อาศัย / อาหารสัตว์ */
      {q:'สิ่งใดต่อไปนี้ "มีชีวิต"?', emoji:'🌿', choices:['ต้นไม้','ก้อนหิน','รถยนต์','โต๊ะ'], correct:0, explain:'ต้นไม้เป็นสิ่งมีชีวิต (เติบโตได้)', tier:1},
      {q:'ปลาอาศัยอยู่ที่ไหน?', emoji:'🐟', choices:['ในน้ำ','บนต้นไม้','ใต้ดิน','บนฟ้า'], correct:0, explain:'ปลาอาศัยอยู่ "ในน้ำ"', tier:1},
      {q:'นกสร้างอะไรไว้เป็นที่อยู่และวางไข่?', emoji:'🐦', choices:['รัง','ถ้ำ','โพรง','บ้านคน'], correct:0, explain:'นกสร้าง "รัง" ไว้อยู่และวางไข่', tier:1},
      {q:'สิ่งใด "ไม่มีชีวิต"?', emoji:'🪨', choices:['ก้อนหิน','แมว','ต้นไม้','ดอกไม้'], correct:0, explain:'ก้อนหินไม่มีชีวิต (ไม่กิน ไม่โต)', tier:1},
      {q:'กระต่ายชอบกินอะไร?', emoji:'🐰', choices:['แครอท/ผัก','เนื้อ','ปลา','ก้อนหิน'], correct:0, explain:'กระต่ายกิน "แครอทและผัก"', tier:1},
      {q:'สัตว์ชนิดใดอาศัยอยู่บนต้นไม้?', emoji:'🐒', choices:['ลิง','ปลา','ปู','หอย'], correct:0, explain:'ลิงอาศัยอยู่บนต้นไม้', tier:1},
      {q:'สิ่งใด "มีชีวิต"?', emoji:'🔍', choices:['ผีเสื้อ','ตุ๊กตา','ลูกบอล','ดินสอ'], correct:0, explain:'ผีเสื้อมีชีวิต ส่วนอื่นเป็นสิ่งของ', tier:2},
      {q:'สัตว์ชนิดใด "หายใจในน้ำ" ได้ด้วยเหงือก?', emoji:'🐠', choices:['ปลา','แมว','นก','สุนัข'], correct:0, explain:'ปลาหายใจในน้ำด้วยเหงือก', tier:2},
      {q:'สัตว์ชนิดใดกินเนื้อเป็นอาหาร?', emoji:'🦁', choices:['สิงโต','วัว','กระต่าย','แพะ'], correct:0, explain:'สิงโตเป็นสัตว์กินเนื้อ', tier:2},
      {q:'"บ้าน" ตามธรรมชาติของผึ้งคืออะไร?', emoji:'🐝', choices:['รวงผึ้ง','รัง (แบบนก)','โพรงงู','ใต้น้ำ'], correct:0, explain:'ผึ้งอยู่ใน "รวงผึ้ง"', tier:2},
      {q:'อูฐเหมาะกับการอาศัยอยู่ที่ใด?', emoji:'🐪', choices:['ทะเลทราย','ใต้ทะเล','ขั้วโลกน้ำแข็ง','บนต้นไม้'], correct:0, explain:'อูฐอยู่ใน "ทะเลทราย" ที่ร้อนแห้ง', tier:2},
      {q:'สัตว์ชนิดใดกินทั้งพืชและเนื้อ?', emoji:'🐻', choices:['หมี','วัว','ม้า','กระต่าย'], correct:0, explain:'หมีกินได้ทั้งพืชและเนื้อ (สัตว์กินทั้งสองอย่าง)', tier:2},
      {q:'วัวกินอะไรเป็นอาหาร?', emoji:'🐄', choices:['หญ้า','เนื้อ','ปลา','ก้อนหิน'], correct:0, explain:'วัวกิน "หญ้า" เป็นอาหาร', tier:1},
      {q:'สัตว์ชนิดใดอาศัยอยู่ในน้ำ?', emoji:'🐟', choices:['ปลา','ลิง','นก','เสือ'], correct:0, explain:'ปลาอาศัยอยู่ในน้ำ', tier:1},
      {q:'นกใช้อะไรในการบิน?', emoji:'🐦', choices:['ปีก','ขา','หาง','ปาก'], correct:0, explain:'นกใช้ "ปีก" ในการบิน', tier:1},
      {q:'สัตว์ชนิดใดออกลูกเป็น "ไข่"?', emoji:'🥚', choices:['ไก่','วัว','หมา','แมว'], correct:0, explain:'ไก่ออกลูกเป็นไข่ (วัว/หมา/แมวออกลูกเป็นตัว)', tier:2},
      {q:'ต้นกระบองเพชรเหมาะกับที่อยู่แบบใด?', emoji:'🌵', choices:['ทะเลทรายที่แห้งแล้ง','ใต้ทะเล','ขั้วโลกน้ำแข็ง','ในถ้ำมืด'], correct:0, explain:'กระบองเพชรอยู่ใน "ทะเลทราย" ที่แห้งแล้ง', tier:2},
      {q:'หมีขาว (หมีขั้วโลก) อาศัยอยู่ที่ใด?', emoji:'🐻‍❄️', choices:['ขั้วโลกน้ำแข็ง','ทะเลทราย','ป่าฝนร้อน','ในเมือง'], correct:0, explain:'หมีขาวอยู่ที่ "ขั้วโลกน้ำแข็ง" ที่หนาวเย็น', tier:2},
      {q:'ปลาอาศัยอยู่ที่ไหน?', emoji:'🐟', choices:['ในน้ำ','บนต้นไม้','ในถ้ำ','บนฟ้า'], correct:0, explain:'ปลาอาศัยอยู่ในน้ำ', tier:1},
      {q:'สัตว์ใดบินได้?', emoji:'🐦', choices:['นก','หมา','ปลา','ช้าง'], correct:0, explain:'นกบินได้', tier:1},
      {q:'ต้นไม้ให้อะไรกับเรา?', emoji:'🌳', choices:['ร่มเงาและอากาศ','เงินทอง','ของเล่น','รถยนต์'], correct:0, explain:'ต้นไม้ให้ร่มเงาและอากาศบริสุทธิ์', tier:1},
      {q:'สัตว์ใดอยู่ได้ทั้งบนบกและในน้ำ?', emoji:'🐸', choices:['กบ','แมว','นก','ช้าง'], correct:0, explain:'กบอยู่ได้ทั้งบนบกและในน้ำ', tier:2},
      {q:'พืชต้องการอะไรในการเจริญเติบโต?', emoji:'🌱', choices:['น้ำ แสงแดด ดิน','ของเล่น','เพลง','โทรทัศน์'], correct:0, explain:'พืชต้องการน้ำ แสงแดด และดิน', tier:2},
      {q:'สัตว์ใดมีงวงยาว?', emoji:'🐘', choices:['ช้าง','แมว','นก','ปลา'], correct:0, explain:'ช้างมีงวงยาว', tier:2}
    ]
  },
  {
    id:'p1-nature2', name:'ธรรมชาติ ป.1 · วัฏจักรและสิ่งแวดล้อม', emoji:'🌳', icon:'assets/icons/p1-nature2.svg', color:'#4F9E2F', light:'#E6F6D8', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 2 — ลำดับการเติบโต/วัฏจักร / สิ่งแวดล้อม / กลางวัน-กลางคืน-ฝน */
      {q:'ลำดับการเติบโตของพืช: เมล็ด → ▢ → ต้นไม้ใหญ่', emoji:'🌱', choices:['ต้นกล้า','ก้อนหิน','ดอกไม้แห้ง','ใบไม้ร่วง'], correct:0, explain:'เมล็ด → ต้นกล้า → ต้นไม้ใหญ่', tier:1},
      {q:'ผีเสื้อแสนสวย เมื่อก่อนเคยเป็นอะไร?', emoji:'🦋', choices:['หนอน','ปลา','นก','กบ'], correct:0, explain:'ผีเสื้อเติบโตมาจาก "หนอน" (ดักแด้)', tier:1},
      {q:'กบตอนยังเล็กๆ ว่ายน้ำได้ เรียกว่าอะไร?', emoji:'🐸', choices:['ลูกอ๊อด','ลูกไก่','ลูกปลา','ลูกนก'], correct:0, explain:'กบตอนเล็กคือ "ลูกอ๊อด"', tier:1},
      {q:'ตอนกลางวันมีดวงอะไรให้แสงสว่าง?', emoji:'☀️', choices:['ดวงอาทิตย์','ดวงจันทร์','ดวงดาว','หลอดไฟ'], correct:0, explain:'กลางวันมี "ดวงอาทิตย์" ให้แสงสว่าง', tier:1},
      {q:'ตอนกลางคืนเราเห็นอะไรบนท้องฟ้า?', emoji:'🌙', choices:['ดวงจันทร์และดาว','ดวงอาทิตย์','สายรุ้ง','ผีเสื้อ'], correct:0, explain:'กลางคืนเห็น "ดวงจันทร์และดาว"', tier:1},
      {q:'ไก่ออกลูกมาเป็นอะไรก่อน?', emoji:'🥚', choices:['ไข่','ลูกไก่','หนอน','ลูกอ๊อด'], correct:0, explain:'ไก่วางไข่ก่อน แล้วไข่จึงฟักเป็นลูกไก่', tier:1},
      {q:'ต้นไม้ต้องการอะไรถึงจะเติบโตได้ดี?', emoji:'🌳', choices:['น้ำและแสงแดด','ขนมและนม','ของเล่น','โทรศัพท์'], correct:0, explain:'ต้นไม้ต้องการ "น้ำและแสงแดด"', tier:2},
      {q:'สัตว์ตัวใดช่วยผสมเกสรดอกไม้?', emoji:'🐝', choices:['ผึ้ง','เสือ','ปลาวาฬ','งู'], correct:0, explain:'"ผึ้ง" ช่วยผสมเกสรดอกไม้', tier:2},
      {q:'เพื่อรักษาสิ่งแวดล้อมให้สะอาด เราควรทำอย่างไร?', emoji:'🌍', choices:['ทิ้งขยะลงถัง','ทิ้งขยะลงแม่น้ำ','เด็ดดอกไม้ทิ้ง','เปิดน้ำทิ้งไว้'], correct:0, explain:'ควร "ทิ้งขยะลงถัง" เพื่อสิ่งแวดล้อมสะอาด', tier:2},
      {q:'ฝนตกลงมาจากที่ใด?', emoji:'🌧️', choices:['ก้อนเมฆ','พื้นดิน','ต้นไม้','แม่น้ำ'], correct:0, explain:'ฝนตกลงมาจาก "ก้อนเมฆ" บนฟ้า', tier:2},
      {q:'น้ำเมื่อโดนความเย็นจัดจะกลายเป็นอะไร?', emoji:'🧊', choices:['น้ำแข็ง','ไอน้ำ','ก้อนหิน','ทราย'], correct:0, explain:'น้ำเจอความเย็นจัดกลายเป็น "น้ำแข็ง"', tier:2},
      {q:'เราควรทำอย่างไรเพื่อประหยัดน้ำ?', emoji:'🚰', choices:['ปิดก๊อกเมื่อไม่ใช้','เปิดน้ำทิ้งไว้','เล่นน้ำทั้งวัน','ทิ้งขยะลงน้ำ'], correct:0, explain:'ควร "ปิดก๊อกเมื่อไม่ใช้" เพื่อประหยัดน้ำ', tier:2},
      {q:'ต้นไม้ช่วยให้เรามีอะไรไว้หายใจ?', emoji:'🌳', choices:['อากาศบริสุทธิ์','ขนม','ของเล่น','เงิน'], correct:0, explain:'ต้นไม้ช่วยให้ "อากาศบริสุทธิ์" ไว้หายใจ', tier:1},
      {q:'ฤดูที่ฝนตกบ่อยเรียกว่าฤดูอะไร?', emoji:'🌧️', choices:['ฤดูฝน','ฤดูร้อน','ฤดูหนาว','ฤดูใบไม้ผลิ'], correct:0, explain:'ฤดูที่ฝนตกบ่อยคือ "ฤดูฝน"', tier:1},
      {q:'ดอกไม้เมื่อบานและได้รับการผสมเกสรแล้ว จะกลายเป็นอะไร?', emoji:'🌸', choices:['ผลและเมล็ด','ก้อนหิน','ใบไม้แห้ง','ดวงดาว'], correct:0, explain:'ดอกไม้จะกลายเป็น "ผลและเมล็ด"', tier:1},
      {q:'น้ำแข็งเมื่อโดนความร้อนจะกลายเป็นอะไร?', emoji:'💧', choices:['น้ำ','ไอ','ก้อนหิน','ทราย'], correct:0, explain:'น้ำแข็งโดนความร้อนละลายกลายเป็น "น้ำ"', tier:2},
      {q:'วัฏจักรน้ำ: น้ำระเหยขึ้นไปบนฟ้ารวมกันเป็นอะไร?', emoji:'☁️', choices:['ก้อนเมฆ','ก้อนหิน','ต้นไม้','ภูเขา'], correct:0, explain:'น้ำระเหยขึ้นฟ้ารวมกันเป็น "ก้อนเมฆ"', tier:2},
      {q:'เราปลูกต้นไม้มากๆ เพื่ออะไร?', emoji:'🌲', choices:['อากาศดีและมีร่มเงา','ให้บ้านรก','ให้ร้อนขึ้น','ไม่มีประโยชน์'], correct:0, explain:'ปลูกต้นไม้ช่วยให้ "อากาศดีและมีร่มเงา"', tier:2},
      {q:'กลางวันมีอะไรบนท้องฟ้า?', emoji:'🌞', choices:['ดวงอาทิตย์','ดวงจันทร์','ดวงดาว','เมฆดำ'], correct:0, explain:'กลางวันมีดวงอาทิตย์', tier:1},
      {q:'ฝนตกลงมาจากที่ใด?', emoji:'🌧️', choices:['เมฆ','ดิน','ต้นไม้','ทะเล'], correct:0, explain:'ฝนตกลงมาจากเมฆ', tier:1},
      {q:'เราควรทิ้งขยะที่ใด?', emoji:'🗑️', choices:['ถังขยะ','พื้น','แม่น้ำ','ถนน'], correct:0, explain:'ควรทิ้งขยะในถังขยะ', tier:1},
      {q:'น้ำแข็งเกิดจากน้ำที่เป็นอย่างไร?', emoji:'🧊', choices:['เย็นจัด','ร้อนจัด','อุ่น','เดือด'], correct:0, explain:'น้ำเย็นจัดกลายเป็นน้ำแข็ง', tier:2},
      {q:'การปิดไฟเมื่อไม่ใช้ช่วยเรื่องใด?', emoji:'💡', choices:['ประหยัดไฟ','เปลืองไฟ','ห้องสว่าง','ไฟเสีย'], correct:0, explain:'ปิดไฟช่วยประหยัดไฟฟ้า', tier:2},
      {q:'กลางคืนมีอะไรบนท้องฟ้า?', emoji:'🌙', choices:['ดวงจันทร์และดาว','ดวงอาทิตย์','สายรุ้ง','ฝน'], correct:0, explain:'กลางคืนมีดวงจันทร์และดวงดาว', tier:2}
    ]
  },

  /* ---------- เกม AR ป.1 (reuse engine เดิม: โยงเส้น / ต่อประโยค) — วิชาไทย/อังกฤษ เพิ่ม mechanic AR ----------
     ใช้คลังร่วมกับระดับเตรียม ป.1 (AR_MATCH_ITEMS / AR_SENTENCES ตาม lang) แยก id/progress ต่อระดับชั้น */
  {
    id:'p1-thai-match', name:'ภาษาไทย ป.1 · โยงเส้นคำ-รูป', emoji:'🧷', icon:'assets/icons/p1-connect-th.svg', color:'#8E7CC3', light:'#EAE4F7',
    type:'ar', mode:'match', lang:'th', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-thai-sentence', name:'ภาษาไทย ป.1 · ต่อประโยค', emoji:'📜', icon:'assets/icons/p1-sentence-th.svg', color:'#F17FA8', light:'#FDE1EC',
    type:'ar', lang:'th', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-eng-sentence', name:'English ป.1 · ต่อประโยค', emoji:'🅰️', icon:'assets/icons/p1-sentence-en.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'ar', lang:'en', levels:10, grade:'p1', isNew:true
  }
];
