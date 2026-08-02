/* ================================================================================
   หมวด/เกมของระดับชั้น ป.2
   ถูกนำไปต่อเป็นอาเรย์ CATS ตัวเดียวใน js/data-cats.js (ลำดับ = ลำดับการ์ดในหน้าหลัก)
   ================================================================================ */

const CATS_P2 = [
  /* ===================== ระดับชั้น ป.2 (grade:'p2') ===================== */
  /* หมวดใหม่ของระดับ ป.2 — reuse engine เดิม แยก id/progress จาก ป.1 (ไม่ใส่ field icon → การ์ด fallback ใช้ cat.emoji)
     Phase 2.1 (คณิต): จำนวนไม่เกิน 1000 / บวก-ลบมีทด / คูณ-หาร (เนื้อหาใหม่ ป.2) + calculation engine (ar-math mathOps ×÷) */
  /* ---------- คณิต ป.2 ---------- */
  {
    id:'p2-math1', name:'คณิต ป.2 · จำนวนไม่เกิน 1000', emoji:'🔢', icon:'assets/icons/p2-math1.svg', color:'#7C5CFC', light:'#E9E3FF', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — หลัก/นับกระโดด/คู่-คี่/เปรียบเทียบ (ง่าย) */
      {q:'เลข 253 มีเลขในหลักร้อยคือเลขใด?', emoji:'🔢', choices:['2','5','3','253'], correct:0, explain:'เลข 2 อยู่หลักร้อย', tier:1},
      {q:'"สามร้อยสี่สิบ" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['340','304','3040','34'], correct:0, explain:'สามร้อยสี่สิบ = 340', tier:1},
      {q:'นับทีละ 100: 100, 200, 300, ▢', emoji:'💯', choices:['400','310','350','500'], correct:0, explain:'นับเพิ่มทีละ 100 ตัวต่อไปคือ 400', tier:1},
      {q:'นับทีละ 5: 20, 25, 30, ▢', emoji:'🖐️', choices:['35','32','40','31'], correct:0, explain:'นับเพิ่มทีละ 5 ตัวต่อไปคือ 35', tier:1},
      {q:'จำนวนใดมากที่สุด?', emoji:'📊', choices:['512','215','152','125'], correct:0, explain:'512 มากที่สุด', tier:1},
      {q:'128 เป็นจำนวนคู่หรือคี่?', emoji:'🔢', choices:['จำนวนคู่','จำนวนคี่','ทั้งคู่และคี่','ไม่ใช่ทั้งสอง'], correct:0, explain:'128 หารด้วย 2 ลงตัว จึงเป็นจำนวนคู่', tier:1},
      {q:'นับทีละ 2: 10, 12, 14, ▢', emoji:'👣', choices:['16','15','18','20'], correct:0, explain:'นับเพิ่มทีละ 2 ตัวต่อไปคือ 16', tier:1},
      {q:'จำนวนใดน้อยที่สุด?', emoji:'📉', choices:['405','450','504','540'], correct:0, explain:'405 น้อยที่สุด', tier:1},
      {q:'เลข 486 มีเลขในหลักหน่วยคือเลขใด?', emoji:'🔢', choices:['6','4','8','486'], correct:0, explain:'เลข 6 อยู่หลักหน่วย', tier:1},
      /* tier2 — ค่าประจำหลัก/เรียงลำดับ/เครื่องหมาย (ยาก) */
      {q:'เรียงจากน้อยไปมากข้อใดถูกต้อง?', emoji:'📈', choices:['203, 230, 320','320, 230, 203','230, 203, 320','203, 320, 230'], correct:0, explain:'203 น้อยสุด แล้ว 230 แล้ว 320', tier:2},
      {q:'เลข 7 ในจำนวน 274 มีค่าเท่าไร?', emoji:'🔢', choices:['70','7','700','74'], correct:0, explain:'เลข 7 อยู่หลักสิบ จึงมีค่า 70', tier:2},
      {q:'"ห้าร้อยเอ็ด" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['501','510','5001','51'], correct:0, explain:'ห้าร้อยเอ็ด = 501', tier:2},
      {q:'นับทีละ 10: 250, 260, 270, ▢', emoji:'🔟', choices:['280','271','290','275'], correct:0, explain:'นับเพิ่มทีละ 10 ตัวต่อไปคือ 280', tier:2},
      {q:'จำนวนใดอยู่ระหว่าง 199 กับ 210?', emoji:'🔢', choices:['205','198','215','190'], correct:0, explain:'205 อยู่ระหว่าง 199 กับ 210', tier:2},
      {q:'235 เป็นจำนวนคู่หรือคี่?', emoji:'🔢', choices:['จำนวนคี่','จำนวนคู่','ทั้งคู่และคี่','ไม่ใช่ทั้งสอง'], correct:0, explain:'235 หารด้วย 2 ไม่ลงตัว จึงเป็นจำนวนคี่', tier:2},
      {q:'เรียงจากมากไปน้อยข้อใดถูกต้อง?', emoji:'📉', choices:['880, 808, 88','88, 808, 880','808, 880, 88','880, 88, 808'], correct:0, explain:'880 มากสุด แล้ว 808 แล้ว 88', tier:2},
      {q:'เลข 600 มีค่าประจำหลักร้อยเท่าไร?', emoji:'🔢', choices:['600','6','60','0'], correct:0, explain:'เลข 6 อยู่หลักร้อย จึงมีค่า 600', tier:2},
      {q:'เติมเครื่องหมายให้ถูก: 415 ▢ 451', emoji:'⚖️', choices:['<','>','=','≠'], correct:0, explain:'415 น้อยกว่า 451 จึงใช้ <', tier:2},
      {q:'เลข 305 มีเลขในหลักสิบคือเลขใด?', emoji:'🔢', choices:['0','3','5','305'], correct:0, explain:'เลข 0 อยู่หลักสิบ', tier:1},
      {q:'นับทีละ 2: 20, 22, 24, ▢', emoji:'👣', choices:['26','25','28','23'], correct:0, explain:'เพิ่มทีละ 2 ตัวต่อไปคือ 26', tier:1},
      {q:'จำนวนใดเป็นเลขคู่?', emoji:'🔢', choices:['48','35','21','17'], correct:0, explain:'48 หารด้วย 2 ลงตัว เป็นเลขคู่', tier:1},
      {q:'เลข 9 ในจำนวน 592 มีค่าเท่าไร?', emoji:'🔢', choices:['90','9','900','95'], correct:0, explain:'เลข 9 อยู่หลักสิบ มีค่า 90', tier:2},
      {q:'จำนวนใดอยู่ระหว่าง 340 กับ 360?', emoji:'🔢', choices:['350','330','370','300'], correct:0, explain:'350 อยู่ระหว่าง 340 กับ 360', tier:2},
      {q:'เรียงจากมากไปน้อยข้อใดถูก?', emoji:'📉', choices:['210, 201, 120','120, 201, 210','201, 210, 120','210, 120, 201'], correct:0, explain:'210 มากสุด แล้ว 201 แล้ว 120', tier:2}
    ]
  },
  {
    id:'p2-math2', name:'คณิต ป.2 · บวก ลบ ไม่เกิน 1000', emoji:'➕', icon:'assets/icons/p2-math2.svg', color:'#5E3FE0', light:'#E9E3FF', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — บวก-ลบหลักร้อยแบบไม่ทด + โจทย์ปัญหาง่าย */
      {q:'120 + 30 = ?', emoji:'➕', choices:['150','140','160','123'], correct:0, explain:'120 บวก 30 เท่ากับ 150', tier:1},
      {q:'250 - 50 = ?', emoji:'➖', choices:['200','150','210','300'], correct:0, explain:'250 ลบ 50 เท่ากับ 200', tier:1},
      {q:'340 + 200 = ?', emoji:'➕', choices:['540','360','520','560'], correct:0, explain:'340 บวก 200 เท่ากับ 540', tier:1},
      {q:'มีหนังสือ 45 เล่ม ซื้อเพิ่ม 30 เล่ม รวมกี่เล่ม?', emoji:'📚', choices:['75','70','80','65'], correct:0, explain:'45 + 30 = 75 เล่ม', tier:1},
      {q:'500 - 300 = ?', emoji:'➖', choices:['200','300','250','800'], correct:0, explain:'500 ลบ 300 เท่ากับ 200', tier:1},
      {q:'210 + 100 = ?', emoji:'➕', choices:['310','300','320','110'], correct:0, explain:'210 บวก 100 เท่ากับ 310', tier:1},
      {q:'มีเงิน 80 บาท ใช้ไป 25 บาท เหลือกี่บาท?', emoji:'💰', choices:['55','65','50','45'], correct:0, explain:'80 - 25 = 55 บาท', tier:1},
      {q:'63 + 24 = ?', emoji:'➕', choices:['87','86','88','77'], correct:0, explain:'63 บวก 24 เท่ากับ 87', tier:1},
      {q:'90 - 40 = ?', emoji:'➖', choices:['50','40','60','30'], correct:0, explain:'90 ลบ 40 เท่ากับ 50', tier:1},
      /* tier2 — มีการทด/โจทย์ปัญหา 1-2 ขั้น/เครื่องหมาย */
      {q:'156 + 128 = ? (มีการทด)', emoji:'➕', choices:['284','274','294','283'], correct:0, explain:'156 บวก 128 เท่ากับ 284', tier:2},
      {q:'305 - 148 = ?', emoji:'➖', choices:['157','167','147','257'], correct:0, explain:'305 ลบ 148 เท่ากับ 157', tier:2},
      {q:'มีนกในกรง 234 ตัว บินไป 120 ตัว เหลือกี่ตัว?', emoji:'🐦', choices:['114','124','104','354'], correct:0, explain:'234 - 120 = 114 ตัว', tier:2},
      {q:'247 + 175 = ?', emoji:'➕', choices:['422','412','432','421'], correct:0, explain:'247 บวก 175 เท่ากับ 422', tier:2},
      {q:'เติมเครื่องหมายให้ถูก: 120 + 50 ▢ 200', emoji:'⚖️', choices:['<','>','=','≠'], correct:0, explain:'120 + 50 = 170 ซึ่งน้อยกว่า 200 จึงใช้ <', tier:2},
      {q:'แม่ซื้อผลไม้ 180 บาท และขนม 145 บาท จ่ายเงินรวมกี่บาท?', emoji:'🛒', choices:['325','315','335','225'], correct:0, explain:'180 + 145 = 325 บาท', tier:2},
      {q:'420 - 275 = ?', emoji:'➖', choices:['145','155','135','245'], correct:0, explain:'420 ลบ 275 เท่ากับ 145', tier:2},
      {q:'มีลูกอม 96 เม็ด แบ่งให้น้อง 48 เม็ด เหลือกี่เม็ด?', emoji:'🍬', choices:['48','58','38','44'], correct:0, explain:'96 - 48 = 48 เม็ด', tier:2},
      {q:'368 + 254 = ?', emoji:'➕', choices:['622','612','632','621'], correct:0, explain:'368 บวก 254 เท่ากับ 622', tier:2},
      {q:'400 + 300 = ?', emoji:'➕', choices:['700','600','800','430'], correct:0, explain:'400 บวก 300 เท่ากับ 700', tier:1},
      {q:'650 - 50 = ?', emoji:'➖', choices:['600','700','550','650'], correct:0, explain:'650 ลบ 50 เท่ากับ 600', tier:1},
      {q:'มีเงิน 120 บาท ได้เพิ่ม 60 บาท รวมกี่บาท?', emoji:'💰', choices:['180','160','200','60'], correct:0, explain:'120 + 60 = 180 บาท', tier:1},
      {q:'275 + 138 = ? (มีการทด)', emoji:'➕', choices:['413','403','423','412'], correct:0, explain:'275 บวก 138 เท่ากับ 413', tier:2},
      {q:'500 - 265 = ?', emoji:'➖', choices:['235','245','225','335'], correct:0, explain:'500 ลบ 265 เท่ากับ 235', tier:2},
      {q:'มีลูกอม 84 เม็ด แบ่งให้เพื่อน 36 เม็ด เหลือกี่เม็ด?', emoji:'🍬', choices:['48','58','38','44'], correct:0, explain:'84 - 36 = 48 เม็ด', tier:2}
    ]
  },
  {
    id:'p2-math3', name:'คณิต ป.2 · คูณ หาร', emoji:'✖️', icon:'assets/icons/p2-math3.svg', color:'#4A2FC0', light:'#E9E3FF', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — คูณกลุ่มเท่าๆ กัน (สูตรคูณ 2-5) + หารแบ่งเท่าๆ กัน */
      {q:'2 × 3 = ? (2 กลุ่ม กลุ่มละ 3)', emoji:'✖️', choices:['6','5','8','4'], correct:0, explain:'2 × 3 = 3 + 3 = 6', tier:1},
      {q:'5 × 2 = ?', emoji:'✖️', choices:['10','7','12','8'], correct:0, explain:'5 × 2 = 5 + 5 = 10', tier:1},
      {q:'มีจาน 3 ใบ ใบละ 4 ชิ้น รวมกี่ชิ้น?', emoji:'🍽️', choices:['12','7','10','9'], correct:0, explain:'3 × 4 = 12 ชิ้น', tier:1},
      {q:'4 × 2 = ?', emoji:'✖️', choices:['8','6','10','4'], correct:0, explain:'4 × 2 = 4 + 4 = 8', tier:1},
      {q:'แบ่งลูกอม 10 เม็ด ใส่ 2 ถุงเท่าๆ กัน ถุงละกี่เม็ด?', emoji:'🍬', choices:['5','4','6','2'], correct:0, explain:'10 ÷ 2 = 5 เม็ด', tier:1},
      {q:'3 × 3 = ?', emoji:'✖️', choices:['9','6','12','8'], correct:0, explain:'3 × 3 = 3 + 3 + 3 = 9', tier:1},
      {q:'12 ÷ 3 = ?', emoji:'➗', choices:['4','3','5','6'], correct:0, explain:'12 แบ่งเป็น 3 กลุ่มเท่าๆ กัน ได้กลุ่มละ 4', tier:1},
      {q:'2 × 5 = ?', emoji:'✖️', choices:['10','8','12','7'], correct:0, explain:'2 × 5 = 5 + 5 = 10', tier:1},
      {q:'รถ 3 คัน คันละ 4 ล้อ รวมมีกี่ล้อ?', emoji:'🚗', choices:['12','8','10','7'], correct:0, explain:'3 × 4 = 12 ล้อ', tier:1},
      /* tier2 — สูตรคูณสูงขึ้น + หารโจทย์ปัญหา */
      {q:'6 × 4 = ?', emoji:'✖️', choices:['24','20','28','18'], correct:0, explain:'6 × 4 = 24', tier:2},
      {q:'5 × 5 = ?', emoji:'✖️', choices:['25','20','30','15'], correct:0, explain:'5 × 5 = 25', tier:2},
      {q:'แบ่งดินสอ 18 แท่ง ให้ 3 คนเท่าๆ กัน คนละกี่แท่ง?', emoji:'✏️', choices:['6','5','7','9'], correct:0, explain:'18 ÷ 3 = 6 แท่ง', tier:2},
      {q:'20 ÷ 4 = ?', emoji:'➗', choices:['5','4','6','8'], correct:0, explain:'20 แบ่งเป็น 4 กลุ่มเท่าๆ กัน ได้กลุ่มละ 5', tier:2},
      {q:'7 × 3 = ?', emoji:'✖️', choices:['21','18','24','20'], correct:0, explain:'7 × 3 = 21', tier:2},
      {q:'มีกล่อง 4 กล่อง กล่องละ 5 ลูก รวมกี่ลูก?', emoji:'📦', choices:['20','16','24','15'], correct:0, explain:'4 × 5 = 20 ลูก', tier:2},
      {q:'24 ÷ 6 = ?', emoji:'➗', choices:['4','3','5','6'], correct:0, explain:'24 แบ่งเป็น 6 กลุ่มเท่าๆ กัน ได้กลุ่มละ 4', tier:2},
      {q:'8 × 2 = ?', emoji:'✖️', choices:['16','14','18','12'], correct:0, explain:'8 × 2 = 8 + 8 = 16', tier:2},
      {q:'แบ่งขนม 15 ชิ้น ใส่ 5 จานเท่าๆ กัน จานละกี่ชิ้น?', emoji:'🍪', choices:['3','2','4','5'], correct:0, explain:'15 ÷ 5 = 3 ชิ้น', tier:2},
      {q:'5 × 3 = ?', emoji:'✖️', choices:['15','12','18','10'], correct:0, explain:'5 × 3 = 15', tier:1},
      {q:'4 × 4 = ?', emoji:'✖️', choices:['16','12','20','8'], correct:0, explain:'4 × 4 = 16', tier:1},
      {q:'มีจาน 2 ใบ ใบละ 5 ชิ้น รวมกี่ชิ้น?', emoji:'🍽️', choices:['10','7','12','8'], correct:0, explain:'2 × 5 = 10 ชิ้น', tier:1},
      {q:'6 × 3 = ?', emoji:'✖️', choices:['18','15','21','12'], correct:0, explain:'6 × 3 = 18', tier:2},
      {q:'21 ÷ 3 = ?', emoji:'➗', choices:['7','6','8','9'], correct:0, explain:'21 แบ่ง 3 กลุ่มเท่าๆ กัน ได้กลุ่มละ 7', tier:2},
      {q:'มีดินสอ 20 แท่ง แบ่งใส่ 4 กล่องเท่าๆ กัน กล่องละกี่แท่ง?', emoji:'✏️', choices:['5','4','6','8'], correct:0, explain:'20 ÷ 4 = 5 แท่ง', tier:2}
    ]
  },
  {
    /* calculation engine: ar-math + mathOps ×÷ (เนื้อหาใหม่ ป.2 เป็นต้นสายที่ ป.3-6 ใช้ต่อ) */
    id:'p2-math-ar', name:'คูณ-หารมหัศจรรย์', emoji:'✳️', icon:'assets/icons/p2-math-ar.svg', color:'#5E3FE0', light:'#E9E3FF',
    type:'ar', mode:'math', levels:10, mathTiers:[[2,5],[2,9],[2,12]], mathOps:['×','÷'], mathChoices:4, grade:'p2', isNew:true
  },

  /* ---------- ภาษาไทย ป.2 (อักษร 3 หมู่ / คำควบกล้ำ-อักษรนำ-การันต์ / อ่านจับใจความ) ---------- */
  {
    id:'p2-thai1', name:'ภาษาไทย ป.2 · อักษร 3 หมู่-มาตราตัวสะกด', emoji:'📖', icon:'assets/icons/p2-thai1.svg', color:'#EF5DA8', light:'#FCE0EF', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — อักษรสูง/กลาง/ต่ำ, มาตราตัวสะกด, วรรณยุกต์ (ง่าย) */
      {q:'ข้อใดเป็นอักษรสูง?', emoji:'📚', choices:['ข','ก','ด','บ'], correct:0, explain:'ข เป็นอักษรสูง (ก ด บ เป็นอักษรกลาง)', tier:1},
      {q:'ข้อใดเป็นอักษรกลาง?', emoji:'📚', choices:['จ','ค','ง','ท'], correct:0, explain:'จ เป็นอักษรกลาง (ค ง ท เป็นอักษรต่ำ)', tier:1},
      {q:'คำว่า "นก" มีตัวสะกดอยู่ในมาตราใด?', emoji:'🐦', choices:['แม่กก','แม่กด','แม่กน','แม่กม'], correct:0, explain:'"นก" สะกดด้วย ก จึงอยู่มาตราแม่กก', tier:1},
      {q:'คำใดมีสระ "เอ"?', emoji:'✏️', choices:['เก','กา','กี','กู'], correct:0, explain:'"เก" ใช้สระ เอ', tier:1},
      {q:'คำว่า "บ้าน" มีวรรณยุกต์ใด?', emoji:'🏠', choices:['ไม้โท','ไม้เอก','ไม้ตรี','ไม้จัตวา'], correct:0, explain:'"บ้าน" ใช้ไม้โท', tier:1},
      {q:'มาตราแม่กม สะกดด้วยตัวใด?', emoji:'🔤', choices:['ม','น','ง','ย'], correct:0, explain:'มาตราแม่กม สะกดด้วย ม', tier:1},
      {q:'ข้อใดเป็นอักษรต่ำ?', emoji:'📚', choices:['ค','ก','จ','ป'], correct:0, explain:'ค เป็นอักษรต่ำ (ก จ ป เป็นอักษรกลาง)', tier:1},
      {q:'คำว่า "กิน" มีตัวสะกดอยู่ในมาตราใด?', emoji:'🍚', choices:['แม่กน','แม่กก','แม่กม','แม่กง'], correct:0, explain:'"กิน" สะกดด้วย น จึงอยู่มาตราแม่กน', tier:1},
      {q:'วรรณยุกต์เอกใช้รูปใด?', emoji:'✍️', choices:['◌่','◌้','◌๊','◌๋'], correct:0, explain:'ไม้เอกคือ ◌่', tier:1},
      /* tier2 — จำนวนอักษร, จำแนกหมู่, พยางค์ (ยาก) */
      {q:'คำว่า "ไก่" ผันด้วยวรรณยุกต์ใด?', emoji:'🐔', choices:['เอก','โท','ตรี','สามัญ'], correct:0, explain:'"ไก่" ใช้ไม้เอก', tier:2},
      {q:'อักษรสูงมีทั้งหมดกี่ตัว?', emoji:'🔢', choices:['11 ตัว','9 ตัว','7 ตัว','5 ตัว'], correct:0, explain:'อักษรสูงมี 11 ตัว', tier:2},
      {q:'คำใดอยู่ในมาตราแม่กด?', emoji:'🐜', choices:['มด','นก','ลม','กา'], correct:0, explain:'"มด" สะกดด้วย ด จึงอยู่มาตราแม่กด', tier:2},
      {q:'คำว่า "เสือ" ขึ้นต้นด้วยอักษรหมู่ใด?', emoji:'🐯', choices:['อักษรสูง','อักษรกลาง','อักษรต่ำ','ไม่มีหมู่'], correct:0, explain:'ส เป็นอักษรสูง', tier:2},
      {q:'คำใดมีสระ "อือ"?', emoji:'✋', choices:['มือ','มา','มี','มู'], correct:0, explain:'"มือ" ใช้สระ อือ', tier:2},
      {q:'คำว่า "ช้าง" มีวรรณยุกต์ใด?', emoji:'🐘', choices:['ไม้โท','ไม้เอก','ไม้ตรี','ไม้จัตวา'], correct:0, explain:'"ช้าง" ใช้ไม้โท', tier:2},
      {q:'มาตราแม่กง สะกดด้วยตัวใด?', emoji:'🔔', choices:['ง','น','ม','ก'], correct:0, explain:'มาตราแม่กง สะกดด้วย ง', tier:2},
      {q:'คำใดขึ้นต้นด้วยอักษรกลาง?', emoji:'🦀', choices:['ปู','คอ','ซอ','ทอ'], correct:0, explain:'ป เป็นอักษรกลาง', tier:2},
      {q:'คำว่า "ต้นไม้" มีกี่พยางค์?', emoji:'🌳', choices:['2 พยางค์','1 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'ต้น-ไม้ = 2 พยางค์', tier:2},
      {q:'คำว่า "แมว" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'🐱', choices:['แม่เกอว','แม่กน','แม่กม','แม่กก'], correct:0, explain:'แมว สะกดด้วย ว อยู่แม่เกอว', tier:1},
      {q:'อักษรสูงคือข้อใด?', emoji:'📖', choices:['ข','ก','ด','บ'], correct:0, explain:'ข เป็นอักษรสูง', tier:1},
      {q:'คำว่า "ปลา" มีกี่พยางค์?', emoji:'🐟', choices:['1 พยางค์','2 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'ปลา อ่านว่า ปลา 1 พยางค์', tier:1},
      {q:'คำใดมีตัวสะกดในมาตราแม่กง?', emoji:'📗', choices:['ลิง','ลม','ลบ','ลด'], correct:0, explain:'ลิง สะกดด้วย ง อยู่แม่กง', tier:2},
      {q:'อักษรกลางคือข้อใด?', emoji:'📕', choices:['จ','ผ','ถ','ห'], correct:0, explain:'จ เป็นอักษรกลาง', tier:2},
      {q:'คำว่า "โรงเรียน" มีกี่พยางค์?', emoji:'🏫', choices:['2 พยางค์','1 พยางค์','3 พยางค์','4 พยางค์'], correct:0, explain:'โรง-เรียน 2 พยางค์', tier:2}
    ]
  },
  {
    id:'p2-thai2', name:'ภาษาไทย ป.2 · คำควบกล้ำ-คำตรงข้าม', emoji:'📝', icon:'assets/icons/p2-thai2.svg', color:'#E14E9A', light:'#FCE0EF', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — คำควบกล้ำ, คำตรงข้าม, คำคล้องจอง, การันต์ (ง่าย) */
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🥁', choices:['กลอง','กอง','ของ','คอง'], correct:0, explain:'"กลอง" มีอักษรควบ กล', tier:1},
      {q:'คำตรงข้ามกับ "ใหญ่" คือคำใด?', emoji:'🔍', choices:['เล็ก','ยาว','หนา','กว้าง'], correct:0, explain:'ใหญ่ ตรงข้ามกับ เล็ก', tier:1},
      {q:'คำตรงข้ามกับ "สูง" คือคำใด?', emoji:'📏', choices:['เตี้ย','ผอม','เบา','ช้า'], correct:0, explain:'สูง ตรงข้ามกับ เตี้ย', tier:1},
      {q:'คำใดมีตัวการันต์?', emoji:'🌙', choices:['จันทร์','จัน','จาน','จน'], correct:0, explain:'"จันทร์" มี ร์ (ตัว ร ที่มีทัณฑฆาต ์ กำกับ) เป็นตัวการันต์ จึงไม่ออกเสียง', tier:1},
      {q:'คำใดคล้องจองกับ "ตา"?', emoji:'👁️', choices:['นา','นก','มือ','ปู'], correct:0, explain:'"นา" คล้องจองกับ "ตา" (เสียงสระ อา)', tier:1},
      {q:'คำตรงข้ามกับ "ร้อน" คือคำใด?', emoji:'🌡️', choices:['เย็น','อุ่น','แห้ง','เปียก'], correct:0, explain:'ร้อน ตรงข้ามกับ เย็น', tier:1},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🍶', choices:['ขวด','ขด','คด','ขอด'], correct:0, explain:'"ขวด" มีอักษรควบ ขว', tier:1},
      {q:'คำตรงข้ามกับ "เปิด" คือคำใด?', emoji:'🚪', choices:['ปิด','ปัด','ผูก','พับ'], correct:0, explain:'เปิด ตรงข้ามกับ ปิด', tier:1},
      {q:'คำว่า "หนู" มีตัวใดเป็นอักษรนำ?', emoji:'🐭', choices:['ห','น','ก','อ'], correct:0, explain:'"หนู" มี ห นำ น (ห เป็นอักษรนำ)', tier:1},
      /* tier2 — ควบแท้-ไม่แท้, ร หัน, สะกดถูก (ยาก) */
      {q:'คำใดสะกดถูกต้อง?', emoji:'📞', choices:['โทรศัพท์','โทรสับ','โทระสับ','โทรสัพ'], correct:0, explain:'สะกดถูกคือ "โทรศัพท์"', tier:2},
      {q:'คำตรงข้ามกับ "กลางวัน" คือคำใด?', emoji:'🌗', choices:['กลางคืน','ตอนเย็น','เที่ยง','เช้า'], correct:0, explain:'กลางวัน ตรงข้ามกับ กลางคืน', tier:2},
      {q:'คำใดเป็นคำควบกล้ำแท้?', emoji:'🍳', choices:['ครัว','จริง','สร้าง','ทราย'], correct:0, explain:'"ครัว" ออกเสียงควบ คร ครบ (จริง สร้าง ทราย เป็นควบไม่แท้)', tier:2},
      {q:'คำว่า "บรรทัด" อ่านออกเสียงว่าอย่างไร?', emoji:'📐', choices:['บัน-ทัด','บอ-ระ-ทัด','บัน-ระ-ทัด','บัด'], correct:0, explain:'รร (ร หัน) อ่านเป็นเสียง "อัน" จึงอ่านว่า บัน-ทัด', tier:2},
      {q:'คำใดมีตัวการันต์?', emoji:'📅', choices:['วันเสาร์','วันเสา','วันสาว','วันซาว'], correct:0, explain:'"วันเสาร์" มี ร์ เป็นตัวการันต์', tier:2},
      {q:'คำตรงข้ามกับ "ขยัน" คือคำใด?', emoji:'😴', choices:['ขี้เกียจ','ตั้งใจ','เก่ง','ดี'], correct:0, explain:'ขยัน ตรงข้ามกับ ขี้เกียจ', tier:2},
      {q:'คำใดคล้องจองกับ "นอน"?', emoji:'🛏️', choices:['ก้อน','กบ','กา','กิน'], correct:0, explain:'"ก้อน" คล้องจองกับ "นอน" (เสียง ออน)', tier:2},
      {q:'คำใดสะกดถูกต้อง?', emoji:'🧼', choices:['สะอาด','สะอาต','สอาด','สะหอาด'], correct:0, explain:'สะกดถูกคือ "สะอาด"', tier:2},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'📝', choices:['ปลา','ปา','ตา','นา'], correct:0, explain:'ปลา มี ป ควบ ล เป็นคำควบกล้ำ', tier:1},
      {q:'คำตรงข้ามกับ "ดี" คือคำใด?', emoji:'👍', choices:['เลว','เก่ง','สวย','ใหญ่'], correct:0, explain:'ตรงข้ามกับ ดี คือ เลว', tier:1},
      {q:'คำใดเป็นอักษรนำ?', emoji:'🐍', choices:['หนู','นู','ดู','ปู'], correct:0, explain:'หนู มี ห นำ น เป็นอักษรนำ', tier:1},
      {q:'คำตรงข้ามกับ "เปิด" คือคำใด?', emoji:'🚪', choices:['ปิด','กด','ดัน','ยก'], correct:0, explain:'ตรงข้ามกับ เปิด คือ ปิด', tier:2},
      {q:'คำใดมีความหมายเหมือน "เร็ว"?', emoji:'💨', choices:['ไว','ช้า','หนัก','ใหญ่'], correct:0, explain:'ไว มีความหมายเหมือน เร็ว', tier:2},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🌊', choices:['ครับ','คับ','งับ','นับ'], correct:0, explain:'ครับ มี ค ควบ ร เป็นคำควบกล้ำ', tier:2}
    ]
  },
  {
    id:'p2-thai3', name:'ภาษาไทย ป.2 · อ่านจับใจความ', emoji:'📘', icon:'assets/icons/p2-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — จับใจความประโยคเดียว, มารยาท, คำพูดเหมาะสม (ง่าย) */
      {q:'อ่าน: "แมวของฉันชอบนอนกลางแดด" ข้อความนี้พูดถึงสัตว์อะไร?', emoji:'🐱', choices:['แมว','หมา','นก','ปลา'], correct:0, explain:'ข้อความพูดถึงแมว', tier:1},
      {q:'อ่าน: "วันนี้ฝนตก น้องจึงพกร่มไปโรงเรียน" น้องพกอะไรไป?', emoji:'☂️', choices:['ร่ม','หมวก','เสื้อกันหนาว','รองเท้า'], correct:0, explain:'น้องพกร่มไปเพราะฝนตก', tier:1},
      {q:'เมื่อเดินชนเพื่อนโดยไม่ตั้งใจ ควรพูดว่าอย่างไร?', emoji:'🙇', choices:['ขอโทษนะ','ไม่เป็นไร','เร็วๆ','ระวังหน่อย'], correct:0, explain:'ควรกล่าวขอโทษเมื่อทำผิด', tier:1},
      {q:'"แม่ทำกับข้าวอร่อยมาก" ประโยคนี้บอกความรู้สึกอย่างไร?', emoji:'😋', choices:['ชอบ/พอใจ','โกรธ','เสียใจ','กลัว'], correct:0, explain:'"อร่อยมาก" แสดงความพอใจ', tier:1},
      {q:'เรียงกิจวัตร: ตื่นนอน → ▢ → ไปโรงเรียน ข้อใดควรอยู่ตรงกลาง?', emoji:'🪥', choices:['แปรงฟัน','เข้านอน','ดูทีวีดึก','กินข้าวเย็น'], correct:0, explain:'หลังตื่นนอนควรแปรงฟันก่อนไปโรงเรียน', tier:1},
      {q:'เมื่อเพื่อนช่วยเหลือเรา ควรพูดว่าอย่างไร?', emoji:'🤝', choices:['ขอบคุณ','ไปให้พ้น','ช้าจัง','ทำไมช่วย'], correct:0, explain:'ควรกล่าวขอบคุณเมื่อมีคนช่วยเหลือ', tier:1},
      {q:'อ่าน: "นกกำลังบินอยู่บนท้องฟ้า" นกอยู่ที่ไหน?', emoji:'🐦', choices:['บนท้องฟ้า','ในน้ำ','ใต้ดิน','ในกรง'], correct:0, explain:'นกบินอยู่บนท้องฟ้า', tier:1},
      {q:'เวลาครูกำลังพูดหน้าชั้น เราควรทำอย่างไร?', emoji:'👂', choices:['ตั้งใจฟัง','คุยกับเพื่อน','เล่นของเล่น','นอนหลับ'], correct:0, explain:'ควรตั้งใจฟังเมื่อครูพูด', tier:1},
      {q:'อ่าน: "พี่ปลูกต้นไม้ทุกเช้า" พี่ทำอะไร?', emoji:'🌱', choices:['ปลูกต้นไม้','รดน้ำ','เก็บใบไม้','ตัดหญ้า'], correct:0, explain:'พี่ปลูกต้นไม้ทุกเช้า', tier:1},
      /* tier2 — ข้อคิด, คาดคะเน, มารยาท (ยาก) */
      {q:'อ่าน: "มดตัวเล็กช่วยกันขนอาหารกลับรัง พวกมันขยันมาก" เรื่องนี้ให้ข้อคิดเรื่องใด?', emoji:'🐜', choices:['ความสามัคคีและขยัน','ความโลภ','ความขี้เกียจ','ความกลัว'], correct:0, explain:'มดช่วยกันทำงานแสดงถึงความสามัคคีและขยัน', tier:2},
      {q:'ถ้าฝนตกหนักและฟ้าร้อง เราไม่ควรทำสิ่งใด?', emoji:'⛈️', choices:['ยืนใต้ต้นไม้ใหญ่','อยู่ในบ้าน','ปิดหน้าต่าง','ใส่เสื้อกันฝน'], correct:0, explain:'ไม่ควรยืนใต้ต้นไม้ใหญ่ตอนฟ้าร้องเพราะอันตราย', tier:2},
      {q:'อ่าน: "ปลาว่ายอยู่ในบ่อ แมวมองด้วยตาเป็นประกาย" แมวน่าจะอยากทำอะไร?', emoji:'🐟', choices:['จับปลากิน','ว่ายน้ำ','นอนหลับ','ร้องเพลง'], correct:0, explain:'คาดคะเนได้ว่าแมวอยากจับปลากิน', tier:2},
      {q:'ประโยคใดสุภาพที่สุดเมื่อขอสิ่งของ?', emoji:'✏️', choices:['ขอดินสอหน่อยได้ไหมคะ','เอาดินสอมา','ดินสอ!','ส่งดินสอเร็ว'], correct:0, explain:'"ขอ...หน่อยได้ไหมคะ" เป็นคำพูดสุภาพ', tier:2},
      {q:'เรียงการปลูกต้นไม้: เมล็ด → ▢ → ต้นไม้ใหญ่ ข้อกลางคือ?', emoji:'🌿', choices:['ต้นกล้าเล็ก','ผลไม้สุก','ใบไม้ร่วง','ดอกเหี่ยว'], correct:0, explain:'เมล็ดงอกเป็นต้นกล้าเล็กก่อนโตเป็นต้นใหญ่', tier:2},
      {q:'อ่าน: "น้องทำแก้วแตกแล้วรีบเก็บกวาด" การกระทำนี้แสดงว่าน้องเป็นเด็กอย่างไร?', emoji:'🧹', choices:['รับผิดชอบ','ขี้เกียจ','ใจร้าย','ขี้กลัว'], correct:0, explain:'การรีบเก็บกวาดแสดงความรับผิดชอบ', tier:2},
      {q:'ข้อใดเป็นมารยาทในการอ่านหนังสือในห้องสมุด?', emoji:'📚', choices:['อ่านเงียบๆ','อ่านเสียงดัง','ฉีกหน้าหนังสือ','วิ่งเล่น'], correct:0, explain:'ในห้องสมุดควรอ่านเงียบๆ ไม่รบกวนผู้อื่น', tier:2},
      {q:'อ่าน: "ต้นกับเพื่อนแบ่งขนมกันกิน" เรื่องนี้ให้ข้อคิดเรื่องใด?', emoji:'🍪', choices:['การแบ่งปัน','การแข่งขัน','ความเห็นแก่ตัว','ความกลัว'], correct:0, explain:'การแบ่งขนมกันกินคือการแบ่งปัน', tier:2},
      {q:'"น้องกวาดบ้านทุกเช้า" น้องทำอะไร?', emoji:'🧹', choices:['กวาดบ้าน','ล้างจาน','รดน้ำต้นไม้','ซักผ้า'], correct:0, explain:'เรื่องบอกว่าน้องกวาดบ้าน', tier:1},
      {q:'"ฝนตกทำให้ดินชุ่มน้ำ" อะไรทำให้ดินชุ่มน้ำ?', emoji:'🌧️', choices:['ฝนตก','แดดออก','ลมพัด','หิมะตก'], correct:0, explain:'ฝนตกทำให้ดินชุ่มน้ำ', tier:1},
      {q:'"พี่ช่วยแม่ยกของ" พี่ช่วยใคร?', emoji:'📦', choices:['แม่','ครู','เพื่อน','น้อง'], correct:0, explain:'เรื่องบอกว่าพี่ช่วยแม่', tier:1},
      {q:'"มดตัวเล็กช่วยกันขนอาหาร" เรื่องนี้สอนเรื่องใด?', emoji:'🐜', choices:['ความสามัคคี','ความสะอาด','การออม','ความซื่อสัตย์'], correct:0, explain:'มดช่วยกันทำงาน สอนความสามัคคี', tier:2},
      {q:'"เพราะขยัน ต้นจึงสอบได้คะแนนดี" อะไรคือเหตุ?', emoji:'📚', choices:['ความขยัน','คะแนนดี','ไปโรงเรียน','กินข้าว'], correct:0, explain:'เหตุคือความขยัน ผลคือคะแนนดี', tier:2},
      {q:'"ควรแบ่งของเล่นให้เพื่อน" เรื่องนี้สอนเรื่องใด?', emoji:'🧸', choices:['ความมีน้ำใจ','การประหยัด','ความสะอาด','การตรงต่อเวลา'], correct:0, explain:'การแบ่งปันสอนเรื่องความมีน้ำใจ', tier:2}
    ]
  },
  {
    /* ฟังสะกดคำไทย ป.2 — reuse listen engine (คลัง LISTEN_WORDS_TH ร่วมกับระดับอื่น) */
    id:'p2-listen-th', name:'ฟังสะกดคำไทย ป.2', emoji:'🎙️', icon:'assets/icons/p2-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[4,5,5], levels:10, grade:'p2', isNew:true
  },
  {
    id:'p2-thai-match', name:'ภาษาไทย ป.2 · โยงเส้นคำ-รูป', emoji:'🧷', icon:'assets/icons/p2-thai-match.svg', color:'#8E7CC3', light:'#EAE4F7',
    type:'ar', mode:'match', lang:'th', levels:10, grade:'p2', isNew:true
  },
  {
    id:'p2-thai-sentence', name:'ภาษาไทย ป.2 · ต่อประโยค', emoji:'📜', icon:'assets/icons/p2-thai-sentence.svg', color:'#F17FA8', light:'#FDE1EC',
    type:'ar', lang:'th', levels:10, grade:'p2', isNew:true
  },

  /* ---------- English ป.2 (ประโยคเดี่ยว / จำนวน 1-30 / How many-Where is / please) ---------- */
  {
    id:'p2-eng1', name:'English ป.2 · คำศัพท์-ประโยคเดี่ยว', emoji:'🔤', icon:'assets/icons/p2-eng1.svg', color:'#0FB5AE', light:'#D5F5F2', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — คำศัพท์ + This is / It is (ง่าย) */
      {q:'"cat" แปลว่าอะไร?', emoji:'🐱', choices:['แมว','หมา','นก','ปลา'], correct:0, explain:'cat = แมว', tier:1},
      {q:'"The dog is big." ประโยคนี้พูดถึงสัตว์อะไร?', emoji:'🐶', choices:['หมา','แมว','ช้าง','นก'], correct:0, explain:'dog = หมา', tier:1},
      {q:'"apple" แปลว่าผลไม้อะไร?', emoji:'🍎', choices:['แอปเปิ้ล','กล้วย','ส้ม','องุ่น'], correct:0, explain:'apple = แอปเปิ้ล', tier:1},
      {q:'"This is a book." แปลว่าอะไร?', emoji:'📕', choices:['นี่คือหนังสือ','นั่นคือปากกา','นี่คือโต๊ะ','นี่คือกระเป๋า'], correct:0, explain:'This is a book = นี่คือหนังสือ', tier:1},
      {q:'"red" แปลว่าสีอะไร?', emoji:'🔴', choices:['สีแดง','สีฟ้า','สีเขียว','สีเหลือง'], correct:0, explain:'red = สีแดง', tier:1},
      {q:'"It is a ball." "ball" คืออะไร?', emoji:'⚽', choices:['ลูกบอล','รองเท้า','หมวก','ร่ม'], correct:0, explain:'ball = ลูกบอล', tier:1},
      {q:'"fish" แปลว่าอะไร?', emoji:'🐟', choices:['ปลา','ไก่','หมู','วัว'], correct:0, explain:'fish = ปลา', tier:1},
      {q:'"The bird is small." นกมีขนาดอย่างไร?', emoji:'🐤', choices:['เล็ก','ใหญ่','สูง','ยาว'], correct:0, explain:'small = เล็ก', tier:1},
      {q:'"banana" แปลว่าผลไม้อะไร?', emoji:'🍌', choices:['กล้วย','ส้ม','แตงโม','มะม่วง'], correct:0, explain:'banana = กล้วย', tier:1},
      /* tier2 — แปลประโยคเดี่ยว, คำศัพท์กว้างขึ้น (ยาก) */
      {q:'"The elephant is big." แปลว่าอะไร?', emoji:'🐘', choices:['ช้างตัวใหญ่','ช้างตัวเล็ก','หนูตัวใหญ่','ช้างสีฟ้า'], correct:0, explain:'The elephant is big = ช้างตัวใหญ่', tier:2},
      {q:'คำใดแปลว่า "โรงเรียน"?', emoji:'🏫', choices:['school','house','book','car'], correct:0, explain:'school = โรงเรียน', tier:2},
      {q:'"This is my mother." แปลว่าอะไร?', emoji:'👩', choices:['นี่คือแม่ของฉัน','นี่คือพ่อของฉัน','นั่นคือแม่ของฉัน','นี่คือครูของฉัน'], correct:0, explain:'This is my mother = นี่คือแม่ของฉัน', tier:2},
      {q:'คำใดแปลว่า "ต้นไม้"?', emoji:'🌳', choices:['tree','flower','grass','leaf'], correct:0, explain:'tree = ต้นไม้', tier:2},
      {q:'"The apple is red." แอปเปิ้ลสีอะไร?', emoji:'🍎', choices:['สีแดง','สีเขียว','สีเหลือง','สีม่วง'], correct:0, explain:'red = สีแดง', tier:2},
      {q:'คำใดแปลว่า "น้ำ"?', emoji:'💧', choices:['water','milk','juice','tea'], correct:0, explain:'water = น้ำ', tier:2},
      {q:'"It is a big house." บ้านเป็นอย่างไร?', emoji:'🏠', choices:['หลังใหญ่','หลังเล็ก','สีแดง','เก่า'], correct:0, explain:'big house = บ้านหลังใหญ่', tier:2},
      {q:'คำใดแปลว่า "มือ"?', emoji:'✋', choices:['hand','foot','head','eye'], correct:0, explain:'hand = มือ', tier:2},
      {q:'"The sun is yellow." ดวงอาทิตย์สีอะไร?', emoji:'☀️', choices:['สีเหลือง','สีแดง','สีฟ้า','สีขาว'], correct:0, explain:'yellow = สีเหลือง', tier:2},
      {q:'"apple" แปลว่าอะไร?', emoji:'🍎', choices:['แอปเปิล','กล้วย','ส้ม','องุ่น'], correct:0, explain:'apple = แอปเปิล', tier:1},
      {q:'"dog" แปลว่าอะไร?', emoji:'🐶', choices:['สุนัข','แมว','นก','ปลา'], correct:0, explain:'dog = สุนัข', tier:1},
      {q:'สีของท้องฟ้าตอนกลางวันคือสีอะไร (ภาษาอังกฤษ)?', emoji:'🌤️', choices:['blue','red','green','black'], correct:0, explain:'ท้องฟ้าสีฟ้า = blue', tier:1},
      {q:'"three" คือเลขอะไร?', emoji:'3️⃣', choices:['3','2','5','8'], correct:0, explain:'three = 3', tier:2},
      {q:'"big" ตรงข้ามกับคำใด?', emoji:'🐘', choices:['small','tall','hot','fast'], correct:0, explain:'big (ใหญ่) ตรงข้ามกับ small (เล็ก)', tier:2},
      {q:'"banana" แปลว่าอะไร?', emoji:'🍌', choices:['กล้วย','แอปเปิล','ส้ม','มะม่วง'], correct:0, explain:'banana = กล้วย', tier:2}
    ]
  },
  {
    id:'p2-eng2', name:'English ป.2 · จำนวน-ตำแหน่ง', emoji:'🔡', icon:'assets/icons/p2-eng2.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — จำนวน 1-30, in/on/under, Yes/No (ง่าย) */
      {q:'"ten" คือเลขอะไร?', emoji:'🔟', choices:['10','2','7','12'], correct:0, explain:'ten = 10', tier:1},
      {q:'"How many?" เป็นคำถามเกี่ยวกับอะไร?', emoji:'❓', choices:['จำนวน (มีกี่อัน)','ตำแหน่ง','ชื่อสิ่งของ','สี'], correct:0, explain:'How many = ถามจำนวน', tier:1},
      {q:'"twenty" คือเลขอะไร?', emoji:'🔢', choices:['20','12','2','30'], correct:0, explain:'twenty = 20', tier:1},
      {q:'"The cat is on the table." แมวอยู่ที่ไหน?', emoji:'🐱', choices:['บนโต๊ะ','ใต้โต๊ะ','ในกล่อง','ข้างโต๊ะ'], correct:0, explain:'on = บน', tier:1},
      {q:'"fifteen" คือเลขอะไร?', emoji:'🔢', choices:['15','50','5','14'], correct:0, explain:'fifteen = 15', tier:1},
      {q:'"in" แปลว่าอะไร?', emoji:'📦', choices:['ใน/ข้างใน','บน','ใต้','ข้าง'], correct:0, explain:'in = ใน', tier:1},
      {q:'"Is this a dog?" เป็นคำถามแบบใด?', emoji:'🐶', choices:['ตอบ Yes/No','ถามจำนวน','ถามตำแหน่ง','ถามสี'], correct:0, explain:'Is this...? เป็นคำถาม Yes/No', tier:1},
      {q:'"under" แปลว่าอะไร?', emoji:'🪑', choices:['ใต้','บน','ใน','ข้าง'], correct:0, explain:'under = ใต้', tier:1},
      {q:'"thirty" คือเลขอะไร?', emoji:'🔢', choices:['30','13','3','20'], correct:0, explain:'thirty = 30', tier:1},
      /* tier2 — How many/Where is เชิงสถานการณ์, Yes/No ตอบให้ถูก (ยาก) */
      {q:'"How many apples?" ในภาพมี 🍎🍎🍎 ควรตอบว่าอะไร?', emoji:'🍎', choices:['three','two','four','five'], correct:0, explain:'มี 3 ลูก = three', tier:2},
      {q:'"Where is the ball? It is under the chair." ลูกบอลอยู่ที่ไหน?', emoji:'⚽', choices:['ใต้เก้าอี้','บนเก้าอี้','ในเก้าอี้','ข้างเก้าอี้'], correct:0, explain:'under the chair = ใต้เก้าอี้', tier:2},
      {q:'"There are five birds." มีนกกี่ตัว?', emoji:'🐦', choices:['5 ตัว','4 ตัว','1 ตัว','15 ตัว'], correct:0, explain:'five = 5', tier:2},
      {q:'"twenty-five" คือเลขอะไร?', emoji:'🔢', choices:['25','52','15','20'], correct:0, explain:'twenty-five = 25', tier:2},
      {q:'"Is that a cat?" ถ้าในภาพเป็นหมา ควรตอบว่าอะไร?', emoji:'🐶', choices:['No, it isn\'t.','Yes, it is.','It is red.','Three.'], correct:0, explain:'ในภาพเป็นหมา จึงตอบ No, it isn\'t.', tier:2},
      {q:'"The book is in the bag." หนังสืออยู่ที่ไหน?', emoji:'🎒', choices:['ในกระเป๋า','บนกระเป๋า','ใต้กระเป๋า','ข้างกระเป๋า'], correct:0, explain:'in the bag = ในกระเป๋า', tier:2},
      {q:'"How many legs does a dog have?" หมามีกี่ขา?', emoji:'🐕', choices:['four','two','three','six'], correct:0, explain:'หมามี 4 ขา = four', tier:2},
      {q:'"eighteen" คือเลขอะไร?', emoji:'🔢', choices:['18','80','8','28'], correct:0, explain:'eighteen = 18', tier:2},
      {q:'"Where is the cat? It is on the box." แมวอยู่ที่ไหน?', emoji:'📦', choices:['บนกล่อง','ในกล่อง','ใต้กล่อง','หลังกล่อง'], correct:0, explain:'on the box = บนกล่อง', tier:2},
      {q:'"This is ___ book." (1 เล่ม)', emoji:'📕', choices:['a','an','two','many'], correct:0, explain:'book ขึ้นต้นเสียงพยัญชนะ ใช้ a', tier:1},
      {q:'"I ___ a student."', emoji:'🧒', choices:['am','is','are','be'], correct:0, explain:'I ใช้กับ am', tier:1},
      {q:'"How many fingers? ___" (5 นิ้ว)', emoji:'🖐️', choices:['five','four','six','ten'], correct:0, explain:'5 = five', tier:1},
      {q:'"This is ___ apple." (สระ)', emoji:'🍎', choices:['an','a','two','some'], correct:0, explain:'apple ขึ้นต้นเสียงสระ ใช้ an', tier:2},
      {q:'พหูพจน์ของ "cat" คือคำใด?', emoji:'🐱', choices:['cats','cates','cat','caties'], correct:0, explain:'เติม s เป็น cats', tier:2},
      {q:'"They ___ happy."', emoji:'😄', choices:['are','is','am','be'], correct:0, explain:'They ใช้กับ are', tier:2}
    ]
  },
  {
    id:'p2-eng3', name:'English ป.2 · คำสั่ง-คำขอร้อง', emoji:'🔠', icon:'assets/icons/p2-eng3.svg', color:'#0A7A75', light:'#D5F5F2', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — please, ทักทาย, เทศกาล, คำตรงข้าม (ง่าย) */
      {q:'"Please sit down." แปลว่าอะไร?', emoji:'🪑', choices:['กรุณานั่งลง','กรุณายืนขึ้น','เปิดหนังสือ','ปิดประตู'], correct:0, explain:'Please sit down = กรุณานั่งลง', tier:1},
      {q:'"Good morning" ใช้ทักทายตอนไหน?', emoji:'🌅', choices:['ตอนเช้า','ตอนเย็น','ตอนกลางคืน','ตอนเที่ยง'], correct:0, explain:'Good morning = สวัสดีตอนเช้า', tier:1},
      {q:'"Open your book." ครูสั่งให้ทำอะไร?', emoji:'📖', choices:['เปิดหนังสือ','ปิดหนังสือ','วางหนังสือ','อ่านหนังสือ'], correct:0, explain:'Open your book = เปิดหนังสือ', tier:1},
      {q:'"Thank you" แปลว่าอะไร?', emoji:'🙏', choices:['ขอบคุณ','ขอโทษ','สวัสดี','ลาก่อน'], correct:0, explain:'Thank you = ขอบคุณ', tier:1},
      {q:'"big" ตรงข้ามกับคำใด?', emoji:'🔎', choices:['small','tall','long','red'], correct:0, explain:'big (ใหญ่) ตรงข้ามกับ small (เล็ก)', tier:1},
      {q:'"Christmas" คือเทศกาลอะไร?', emoji:'🎄', choices:['คริสต์มาส','ปีใหม่','ฮาโลวีน','วันเกิด'], correct:0, explain:'Christmas = วันคริสต์มาส', tier:1},
      {q:'"Please come here." แปลว่าอะไร?', emoji:'👋', choices:['กรุณามานี่','กรุณาไปที่นั่น','นั่งลง','ยืนขึ้น'], correct:0, explain:'Please come here = กรุณามานี่', tier:1},
      {q:'"Goodbye" ใช้พูดตอนไหน?', emoji:'👋', choices:['ตอนจากลา','ตอนพบกัน','ตอนกินข้าว','ตอนนอน'], correct:0, explain:'Goodbye = ลาก่อน (ใช้ตอนจากลา)', tier:1},
      {q:'"hot" ตรงข้ามกับคำใด?', emoji:'🥶', choices:['cold','big','fast','happy'], correct:0, explain:'hot (ร้อน) ตรงข้ามกับ cold (เย็น)', tier:1},
      /* tier2 — คำสั่งปฏิเสธ+please, คำตรงข้าม, บทสนทนา (ยาก) */
      {q:'"Don\'t talk in class, please." แปลว่าอะไร?', emoji:'🤫', choices:['กรุณาอย่าคุยในห้องเรียน','กรุณาพูดดังๆ','เปิดหน้าต่าง','ปิดไฟ'], correct:0, explain:'Don\'t talk in class = อย่าคุยในห้องเรียน', tier:2},
      {q:'"happy" ตรงข้ามกับคำใด?', emoji:'😢', choices:['sad','big','hot','fast'], correct:0, explain:'happy (มีความสุข) ตรงข้ามกับ sad (เศร้า)', tier:2},
      {q:'"Happy New Year" แปลว่าอะไร?', emoji:'🎉', choices:['สวัสดีปีใหม่','สุขสันต์วันเกิด','สวัสดีตอนเช้า','ราตรีสวัสดิ์'], correct:0, explain:'Happy New Year = สวัสดีปีใหม่', tier:2},
      {q:'"I want water, please." ผู้พูดต้องการอะไร?', emoji:'🥤', choices:['น้ำ','นม','ขนม','ข้าว'], correct:0, explain:'water = น้ำ', tier:2},
      {q:'"Stand up, please." แปลว่าอะไร?', emoji:'🧍', choices:['กรุณายืนขึ้น','กรุณานั่งลง','กรุณาเดิน','กรุณาวิ่ง'], correct:0, explain:'Stand up = ยืนขึ้น', tier:2},
      {q:'"fast" ตรงข้ามกับคำใด?', emoji:'🐢', choices:['slow','tall','short','new'], correct:0, explain:'fast (เร็ว) ตรงข้ามกับ slow (ช้า)', tier:2},
      {q:'"How are you?" ควรตอบว่าอะไร?', emoji:'😊', choices:['I\'m fine, thank you.','My name is Ann.','It is a cat.','Thank you.'], correct:0, explain:'How are you? ตอบ I\'m fine, thank you.', tier:2},
      {q:'"day" ตรงข้ามกับคำใด?', emoji:'🌙', choices:['night','sun','morning','light'], correct:0, explain:'day (กลางวัน) ตรงข้ามกับ night (กลางคืน)', tier:2},
      {q:'"Please be quiet." แปลว่าอะไร?', emoji:'🤐', choices:['กรุณาเงียบ','กรุณาพูด','กรุณาร้องเพลง','กรุณาหัวเราะ'], correct:0, explain:'Please be quiet = กรุณาเงียบ', tier:2},
      {q:'"Thank you." แปลว่าอะไร?', emoji:'🙏', choices:['ขอบคุณ','สวัสดี','ลาก่อน','ขอโทษ'], correct:0, explain:'Thank you = ขอบคุณ', tier:1},
      {q:'"Good morning." ใช้ทักทายตอนไหน?', emoji:'🌅', choices:['ตอนเช้า','ตอนกลางคืน','ตอนเที่ยง','ตอนเย็น'], correct:0, explain:'Good morning ใช้ทักทายตอนเช้า', tier:1},
      {q:'"Sit down, please." หมายถึงอะไร?', emoji:'🪑', choices:['กรุณานั่งลง','กรุณายืนขึ้น','กรุณาเงียบ','กรุณาออกไป'], correct:0, explain:'Sit down = นั่งลง', tier:1},
      {q:'"Good night." ใช้พูดตอนไหน?', emoji:'🌙', choices:['ก่อนนอน','ตอนเช้า','ตอนกินข้าว','ตอนไปโรงเรียน'], correct:0, explain:'Good night ใช้พูดก่อนนอน', tier:2},
      {q:'"Stand up." หมายถึงอะไร?', emoji:'🧍', choices:['ยืนขึ้น','นั่งลง','นอนลง','เดินไป'], correct:0, explain:'Stand up = ยืนขึ้น', tier:2},
      {q:'"I am sorry." แปลว่าอะไร?', emoji:'😔', choices:['ฉันขอโทษ','ฉันดีใจ','ฉันหิว','ฉันง่วง'], correct:0, explain:'I am sorry = ฉันขอโทษ', tier:2}
    ]
  },
  {
    /* ฟังคำอังกฤษ ป.2 — reuse listen engine (คลัง LISTEN_WORDS default en) */
    id:'p2-listen-en', name:'ฟังคำอังกฤษ ป.2', emoji:'📣', icon:'assets/icons/p2-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', wordLens:[3,4,5], levels:10, grade:'p2', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.2 — ประโยคไทย 5-6 คำ */
    id:'p2-cloze1', name:'ฟังประโยคเติมคำ ป.2 · 1', emoji:'📨', icon:'assets/icons/p2-cloze1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en3', clozeBlanks:[1,1,1], clozeDecoys:[3,3,4], levels:10, grade:'p2', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.2 — ประโยคอังกฤษสั้น */
    id:'p2-cloze2', name:'ฟังประโยคเติมคำ ป.2 · 2', emoji:'📩', icon:'assets/icons/p2-cloze2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en3', clozeBlanks:[1,2,2], clozeDecoys:[3,4,4], levels:10, grade:'p2', isNew:true
  },
  {
    id:'p2-eng-sentence', name:'English ป.2 · ต่อประโยค', emoji:'🅰️', icon:'assets/icons/p2-eng-sentence.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'ar', lang:'en', levels:10, grade:'p2', isNew:true
  },

  /* ---------- คุณธรรม / สังคมศึกษา ป.2 ---------- */
  {
    id:'p2-manners', name:'สังคม ป.2 · มารยาทและหน้าที่', emoji:'😇', icon:'assets/icons/p2-manners.svg', color:'#F6A609', light:'#FEEFC9', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — มารยาทไทย / กฎกติกา / คุณธรรมพื้นฐาน (ง่าย) */
      {q:'เมื่อรับของจากผู้ใหญ่ ควรทำอย่างไร?', emoji:'🙏', choices:['รับด้วยสองมือและไหว้ขอบคุณ','คว้าไปเลย','ไม่รับ','โยนทิ้ง'], correct:0, explain:'ควรรับด้วยสองมือและกล่าวขอบคุณ', tier:1},
      {q:'ก่อนข้ามถนนควรทำอย่างไร?', emoji:'🚸', choices:['มองซ้าย-ขวาให้ปลอดภัย','วิ่งข้ามทันที','หลับตาข้าม','เล่นกลางถนน'], correct:0, explain:'ต้องมองซ้าย-ขวาก่อนข้ามเพื่อความปลอดภัย', tier:1},
      {q:'เมื่อทำผิดควรทำอย่างไร?', emoji:'😔', choices:['ขอโทษและแก้ไข','โทษคนอื่น','หนีไป','โกหก'], correct:0, explain:'ควรขอโทษและแก้ไขสิ่งที่ทำผิด', tier:1},
      {q:'ไฟจราจรสีแดงหมายถึงอะไร?', emoji:'🔴', choices:['หยุด','ไปได้','ระวัง','เลี้ยว'], correct:0, explain:'ไฟแดงคือให้หยุด', tier:1},
      {q:'เมื่อเข้าแถวซื้อของ ควรทำอย่างไร?', emoji:'🧍', choices:['ต่อแถวรอคิว','แทรกคิว','ผลักคนอื่น','ตะโกน'], correct:0, explain:'ควรต่อแถวรอคิวอย่างเป็นระเบียบ', tier:1},
      {q:'การช่วยงานบ้านพ่อแม่แสดงถึงคุณธรรมข้อใด?', emoji:'🧹', choices:['ความกตัญญู','ความเกียจคร้าน','ความโลภ','ความกลัว'], correct:0, explain:'การช่วยพ่อแม่แสดงความกตัญญู', tier:1},
      {q:'เมื่อเพื่อนพูด เราควรทำอย่างไร?', emoji:'👂', choices:['ตั้งใจฟัง','พูดแทรก','เดินหนี','หัวเราะเยาะ'], correct:0, explain:'ควรตั้งใจฟังเมื่อผู้อื่นพูด', tier:1},
      {q:'ในห้องเรียนควรทิ้งขยะที่ใด?', emoji:'🗑️', choices:['ถังขยะ','ใต้โต๊ะ','พื้นห้อง','กระเป๋าเพื่อน'], correct:0, explain:'ต้องทิ้งขยะลงถังขยะ', tier:1},
      {q:'ท่าไหว้ที่ถูกต้องคือทำอย่างไร?', emoji:'🙏', choices:['พนมมือไว้ระหว่างอก','ยกมือข้างเดียว','กำมือ','ชูนิ้ว'], correct:0, explain:'การไหว้คือพนมมือทั้งสองข้าง', tier:1},
      /* tier2 — สถานการณ์ / ศาสนา / หน้าที่พลเมือง (ยาก) */
      {q:'เพื่อนทำดินสอหล่น เราควรทำอย่างไร?', emoji:'✏️', choices:['ช่วยเก็บให้','เดินข้ามไป','แกล้งเตะ','หัวเราะ'], correct:0, explain:'ควรช่วยเหลือเพื่อนด้วยความมีน้ำใจ', tier:2},
      {q:'ผู้ที่เป็นหัวหน้าของโรงเรียนคือใคร?', emoji:'🏫', choices:['ผู้อำนวยการโรงเรียน','นักเรียน','แม่ค้า','คนขับรถ'], correct:0, explain:'ผู้อำนวยการเป็นผู้บริหารโรงเรียน', tier:2},
      {q:'สัญลักษณ์ของศาสนาพุทธคือข้อใด?', emoji:'☸️', choices:['ธรรมจักร','ไม้กางเขน','พระจันทร์เสี้ยว','โอม'], correct:0, explain:'ธรรมจักรเป็นสัญลักษณ์ของศาสนาพุทธ', tier:2},
      {q:'การรอคิวโดยไม่แซง แสดงถึงคุณธรรมข้อใด?', emoji:'🚶', choices:['ความอดทน','ความโกรธ','ความรีบร้อน','ความเห็นแก่ตัว'], correct:0, explain:'การรอคิวแสดงความอดทนและมีระเบียบ', tier:2},
      {q:'เพื่อนมีความเชื่อต่างจากเรา ควรทำอย่างไร?', emoji:'🤝', choices:['เคารพความแตกต่าง','ล้อเลียน','บังคับให้เชื่อเหมือนเรา','ทะเลาะ'], correct:0, explain:'ควรเคารพความคิดและความเชื่อที่แตกต่าง', tier:2},
      {q:'ผู้นำของหมู่บ้านเรียกว่าอะไร?', emoji:'🏘️', choices:['ผู้ใหญ่บ้าน','ครู','หมอ','ตำรวจ'], correct:0, explain:'ผู้ใหญ่บ้านเป็นผู้นำของหมู่บ้าน', tier:2},
      {q:'ก่อนพระสงฆ์บิณฑบาต ชาวพุทธนิยมทำสิ่งใด?', emoji:'🍚', choices:['ตักบาตร','เล่นเกม','นอนหลับ','ดูทีวี'], correct:0, explain:'การตักบาตรเป็นการทำบุญตอนเช้า', tier:2},
      {q:'เมื่ออยู่ในที่สาธารณะควรทำอย่างไร?', emoji:'🏞️', choices:['พูดเบาๆ ไม่รบกวนผู้อื่น','ตะโกนเสียงดัง','ทิ้งขยะเรี่ยราด','วิ่งชนคน'], correct:0, explain:'ควรมีมารยาทไม่รบกวนผู้อื่นในที่สาธารณะ', tier:2},
      {q:'เมื่อได้รับของจากผู้ใหญ่ควรทำอย่างไร?', emoji:'🙏', choices:['รับด้วยสองมือและขอบคุณ','คว้าไปเลย','ไม่สนใจ','โยนทิ้ง'], correct:0, explain:'ควรรับด้วยสองมือและกล่าวขอบคุณ', tier:1},
      {q:'ก่อนกินข้าวควรทำอะไร?', emoji:'🧼', choices:['ล้างมือ','เล่นเกม','ดูทีวี','นอน'], correct:0, explain:'ควรล้างมือก่อนกินข้าว', tier:1},
      {q:'เมื่อไอหรือจามควรทำอย่างไร?', emoji:'🤧', choices:['ปิดปากปิดจมูก','หันไปหาคนอื่น','ไม่ต้องทำอะไร','ตะโกน'], correct:0, explain:'ควรปิดปากปิดจมูกเวลาไอจาม', tier:1},
      {q:'เมื่อทำของเพื่อนเสียหายควรทำอย่างไร?', emoji:'😔', choices:['ขอโทษและรับผิดชอบ','หนีไป','โทษคนอื่น','เงียบไว้'], correct:0, explain:'ควรขอโทษและรับผิดชอบ', tier:2},
      {q:'เมื่อเข้าห้องน้ำสาธารณะเสร็จควรทำอย่างไร?', emoji:'🚽', choices:['กดชักโครกและล้างมือ','ทิ้งไว้เลย','เปิดน้ำทิ้ง','ขีดเขียนผนัง'], correct:0, explain:'ควรกดชักโครกและล้างมือให้เรียบร้อย', tier:2},
      {q:'การพูดจากับผู้ใหญ่ควรใช้คำแบบใด?', emoji:'🗣️', choices:['สุภาพ มีครับ/ค่ะ','คำหยาบ','ตะโกน','ไม่พูด'], correct:0, explain:'ควรพูดสุภาพ ลงท้ายด้วยครับ/ค่ะ', tier:2}
    ]
  },
  {
    id:'p2-social', name:'สังคม ป.2 · ชุมชนและเงินทอง', emoji:'🏘️', icon:'assets/icons/p2-social.svg', color:'#E5893B', light:'#FBEAD5', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — เวลา / อาชีพ-บริการ / ธรรมชาติ vs มนุษย์สร้าง (ง่าย) */
      {q:'วันถัดจาก "วันนี้" เรียกว่าอะไร?', emoji:'📅', choices:['พรุ่งนี้','เมื่อวาน','เดือนหน้า','ปีที่แล้ว'], correct:0, explain:'วันถัดไปคือพรุ่งนี้ (อนาคต)', tier:1},
      {q:'หมอมีหน้าที่ทำอะไร?', emoji:'👩‍⚕️', choices:['รักษาคนป่วย','ตัดผม','ดับไฟ','สอนหนังสือ'], correct:0, explain:'หมอมีหน้าที่รักษาคนป่วย', tier:1},
      {q:'สิ่งใดเกิดขึ้นเองตามธรรมชาติ?', emoji:'⛰️', choices:['ภูเขา','ตึก','ถนน','รถยนต์'], correct:0, explain:'ภูเขาเกิดขึ้นเองตามธรรมชาติ', tier:1},
      {q:'"เมื่อวานนี้" เป็นเหตุการณ์ในช่วงเวลาใด?', emoji:'⏮️', choices:['อดีต','ปัจจุบัน','อนาคต','พรุ่งนี้'], correct:0, explain:'เมื่อวานนี้เป็นเรื่องที่ผ่านไปแล้ว (อดีต)', tier:1},
      {q:'ครูมีหน้าที่ทำอะไร?', emoji:'👨‍🏫', choices:['สอนหนังสือ','รักษาโรค','ขายของ','ขับรถเมล์'], correct:0, explain:'ครูมีหน้าที่สอนหนังสือ', tier:1},
      {q:'สิ่งใดที่มนุษย์สร้างขึ้น?', emoji:'🏢', choices:['ตึก','แม่น้ำ','ต้นไม้','ก้อนเมฆ'], correct:0, explain:'ตึกเป็นสิ่งที่มนุษย์สร้างขึ้น', tier:1},
      {q:'ถ้าซื้อขนม 5 บาท จ่ายเหรียญ 10 บาท จะได้เงินทอนกี่บาท?', emoji:'💰', choices:['5 บาท','10 บาท','15 บาท','ไม่ได้ทอน'], correct:0, explain:'10 - 5 = ทอน 5 บาท', tier:1},
      {q:'ประเพณีสงกรานต์เกี่ยวข้องกับสิ่งใด?', emoji:'💦', choices:['น้ำ','กระทง','เทียน','ว่าว'], correct:0, explain:'สงกรานต์เป็นประเพณีเล่นน้ำ', tier:1},
      {q:'ชาวนามีอาชีพทำอะไร?', emoji:'🌾', choices:['ปลูกข้าว','ตัดผม','ขับเครื่องบิน','รักษาฟัน'], correct:0, explain:'ชาวนาปลูกข้าว', tier:1},
      /* tier2 — เศรษฐศาสตร์ / ประวัติศาสตร์ / ภูมิศาสตร์ (ยาก) */
      {q:'การนำเงินส่วนหนึ่งเก็บไว้ใช้ในอนาคตเรียกว่าอะไร?', emoji:'🐷', choices:['การออม','การซื้อ','การขาย','การแลก'], correct:0, explain:'การเก็บเงินไว้ใช้ภายหลังคือการออม', tier:2},
      {q:'การเอาของมาแลกกันโดยไม่ใช้เงิน เรียกว่าอะไร?', emoji:'🔄', choices:['การแลกเปลี่ยนสินค้า','การออม','การซื้อด้วยเงิน','การกู้ยืม'], correct:0, explain:'การแลกของกับของโดยตรงคือการแลกเปลี่ยนสินค้า', tier:2},
      {q:'ประเพณีลอยกระทงใช้สิ่งใดลอยน้ำ?', emoji:'🪷', choices:['กระทง','ว่าว','เทียนพรรษา','พลุ'], correct:0, explain:'ลอยกระทงคือการลอยกระทงในน้ำ', tier:2},
      {q:'ดินสอทำมาจากทรัพยากรใด?', emoji:'✏️', choices:['ไม้','เหล็ก','แก้ว','พลาสติกล้วน'], correct:0, explain:'ดินสอส่วนใหญ่ทำจากไม้', tier:2},
      {q:'ธนาคารในชุมชนมีหน้าที่อะไร?', emoji:'🏦', choices:['รับฝากเงินและให้บริการทางการเงิน','รักษาคนป่วย','สอนหนังสือ','ขายอาหารสด'], correct:0, explain:'ธนาคารรับฝากเงินและให้บริการทางการเงิน เช่น การออม', tier:2},
      {q:'ทรัพยากรใดใช้แล้วไม่หมดไป?', emoji:'💧', choices:['น้ำและอากาศ','น้ำมัน','ถ่านหิน','แร่ทองคำ'], correct:0, explain:'น้ำและอากาศเป็นทรัพยากรที่ใช้แล้วไม่หมดไป (หมุนเวียนได้)', tier:2},
      {q:'ถ้ามีรายได้ 20 บาท ควรทำอย่างไรจึงเหมาะสม?', emoji:'💵', choices:['ใช้บางส่วนและเก็บออมบ้าง','ใช้หมดทันที','ยืมเพื่อนเพิ่ม','ทิ้งไป'], correct:0, explain:'ควรใช้จ่ายพอดีและแบ่งเก็บออม', tier:2},
      {q:'พื้นที่กว้างมีน้ำเค็มเป็นบริเวณกว้างเรียกว่าอะไร?', emoji:'🌊', choices:['ทะเล','แม่น้ำ','ภูเขา','ทะเลทราย'], correct:0, explain:'ทะเลเป็นแหล่งน้ำเค็มขนาดใหญ่', tier:2},
      {q:'เงินเหรียญ 10 บาทมีค่าเท่ากับเหรียญ 5 บาทกี่เหรียญ?', emoji:'🪙', choices:['2 เหรียญ','3 เหรียญ','5 เหรียญ','10 เหรียญ'], correct:0, explain:'10 ÷ 5 = 2 เหรียญ', tier:1},
      {q:'สถานที่ใดไปซื้ออาหารสด?', emoji:'🛒', choices:['ตลาด','โรงเรียน','วัด','สวนสาธารณะ'], correct:0, explain:'ตลาดเป็นที่ซื้ออาหารสด', tier:1},
      {q:'อาชีพใดสอนหนังสือ?', emoji:'👨‍🏫', choices:['ครู','ชาวนา','หมอ','ตำรวจ'], correct:0, explain:'ครูมีหน้าที่สอนหนังสือ', tier:1},
      {q:'การออมเงินใส่กระปุกมีประโยชน์อย่างไร?', emoji:'🐷', choices:['มีเงินเก็บไว้ใช้','ทำให้จน','เสียเงิน','ไม่มีประโยชน์'], correct:0, explain:'การออมทำให้มีเงินเก็บไว้ใช้', tier:2},
      {q:'ธงชาติไทยมีสีอะไรบ้าง?', emoji:'🇹🇭', choices:['แดง ขาว น้ำเงิน','เขียว เหลือง แดง','ฟ้า ขาว','ดำ ขาว'], correct:0, explain:'ธงไตรรงค์มี แดง ขาว น้ำเงิน', tier:2},
      {q:'พื้นที่สูงมากมีต้นไม้ปกคลุมเรียกว่าอะไร?', emoji:'⛰️', choices:['ภูเขา','ทะเล','ทะเลทราย','แม่น้ำ'], correct:0, explain:'พื้นที่สูงคือภูเขา', tier:2}
    ]
  },

  /* ---------- เชาวน์ปัญญา ป.2 ---------- */
  {
    id:'p2-iq1', name:'เชาวน์ ป.2 · ตรรกะและแบบรูป', emoji:'🧠', icon:'assets/icons/p2-iq1.svg', color:'#2FB673', light:'#D6F3E4', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — แบบรูป / ไม่เข้าพวก / เปรียบเทียบ (ง่าย) */
      {q:'แบบรูป: 🔴🔵🔴🔵🔴 ▢ ต่อไปคือ?', emoji:'🔁', choices:['🔵','🔴','🟢','🟡'], correct:0, explain:'สลับ แดง-ฟ้า ตัวต่อไปคือฟ้า', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🔍', choices:['🚗','🍎','🍌','🍊'], correct:0, explain:'🚗 เป็นรถ ที่เหลือเป็นผลไม้', tier:1},
      {q:'แบบรูปเลข: 1, 2, 3, 4, ▢', emoji:'🔢', choices:['5','6','4','2'], correct:0, explain:'เพิ่มทีละ 1 ตัวต่อไปคือ 5', tier:1},
      {q:'ถ้า 🐶 คู่กับเสียง "โฮ่ง" แล้ว 🐱 คู่กับเสียงใด?', emoji:'🐱', choices:['เหมียว','จิ๊บ','มอ','อึ่ง'], correct:0, explain:'แมวร้อง เหมียว', tier:1},
      {q:'สัตว์ใดตัวใหญ่ที่สุด?', emoji:'📏', choices:['ช้าง','แมว','หนู','มด'], correct:0, explain:'ช้างตัวใหญ่ที่สุด', tier:1},
      {q:'แบบรูป: A, B, A, B, A, ▢', emoji:'🔤', choices:['B','A','C','D'], correct:0, explain:'สลับ A-B ตัวต่อไปคือ B', tier:1},
      {q:'แบบรูป: 🌙⭐🌙⭐ ▢ ต่อไปคือ?', emoji:'✨', choices:['🌙','⭐','☀️','☁️'], correct:0, explain:'สลับ พระจันทร์-ดาว ตัวต่อไปคือพระจันทร์', tier:1},
      {q:'สิ่งใดไม่ใช่ผลไม้?', emoji:'🥕', choices:['แครอท','แอปเปิ้ล','กล้วย','ส้ม'], correct:0, explain:'แครอทเป็นผัก', tier:1},
      {q:'สิ่งใดหนักที่สุด?', emoji:'⚖️', choices:['ก้อนหิน','ขนนก','ใบไม้','กระดาษ'], correct:0, explain:'ก้อนหินหนักที่สุด', tier:1},
      /* tier2 — แบบรูปเลข / ลำดับ / อุปมา (ยาก) */
      {q:'แบบรูปเลข: 2, 4, 6, 8, ▢', emoji:'🔢', choices:['10','9','12','7'], correct:0, explain:'เพิ่มทีละ 2 ตัวต่อไปคือ 10', tier:2},
      {q:'ถ้าวันนี้วันจันทร์ พรุ่งนี้เป็นวันอะไร?', emoji:'📅', choices:['อังคาร','อาทิตย์','พุธ','ศุกร์'], correct:0, explain:'ถัดจากจันทร์คืออังคาร', tier:2},
      {q:'แบบรูป: 🔺🔺🔻🔺🔺🔻🔺🔺 ▢', emoji:'🔻', choices:['🔻','🔺','⬛','⬜'], correct:0, explain:'ทุก 2 สามเหลี่ยมขึ้นตามด้วยลง 1 อัน', tier:2},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🪑', choices:['แมว','เก้าอี้','โต๊ะ','เตียง'], correct:0, explain:'แมวเป็นสัตว์ ที่เหลือเป็นเฟอร์นิเจอร์', tier:2},
      {q:'แบบรูปเลข: 5, 10, 15, 20, ▢', emoji:'🔢', choices:['25','21','30','24'], correct:0, explain:'เพิ่มทีละ 5 ตัวต่อไปคือ 25', tier:2},
      {q:'ถ้า 🍎 สีแดง 🍌 สีเหลือง แล้ว 🍇 น่าจะสีอะไร?', emoji:'🍇', choices:['ม่วง','ฟ้า','ขาว','ดำ'], correct:0, explain:'องุ่นมักมีสีม่วง', tier:2},
      {q:'แบบรูปเลข: 1, 3, 5, 7, ▢', emoji:'🔢', choices:['9','8','10','6'], correct:0, explain:'เลขคี่เพิ่มทีละ 2 ตัวต่อไปคือ 9', tier:2},
      {q:'เรียงจากเล็กไปใหญ่ ข้อใดถูก?', emoji:'📐', choices:['มด หมา ช้าง','ช้าง หมา มด','หมา ช้าง มด','ช้าง มด หมา'], correct:0, explain:'มดเล็กสุด ช้างใหญ่สุด', tier:2},
      {q:'เติมเลขต่อไป: 3, 6, 9, ▢', emoji:'🔢', choices:['12','10','15','8'], correct:0, explain:'เพิ่มทีละ 3 ตัวต่อไปคือ 12', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🍎', choices:['รถ','แอปเปิล','กล้วย','ส้ม'], correct:0, explain:'อีก 3 อย่างเป็นผลไม้ รถไม่เข้าพวก', tier:1},
      {q:'ตรงข้ามกับ "สูง" คือ?', emoji:'📏', choices:['เตี้ย','ใหญ่','ยาว','หนา'], correct:0, explain:'ตรงข้ามกับ สูง คือ เตี้ย', tier:1},
      {q:'เติมเลขต่อไป: 2, 4, 8, ▢ (คูณ 2)', emoji:'✖️', choices:['16','10','12','6'], correct:0, explain:'คูณ 2 ทุกครั้ง ตัวต่อไปคือ 16', tier:2},
      {q:'ถ้าวันนี้วันเสาร์ พรุ่งนี้วันอะไร?', emoji:'📅', choices:['วันอาทิตย์','วันศุกร์','วันจันทร์','วันพุธ'], correct:0, explain:'ถัดจากวันเสาร์คือวันอาทิตย์', tier:2},
      {q:'น้องอายุ 5 ปี พี่แก่กว่า 2 ปี พี่อายุเท่าไร?', emoji:'🧒', choices:['7 ปี','6 ปี','5 ปี','3 ปี'], correct:0, explain:'5 + 2 = 7 ปี', tier:2}
    ]
  },
  {
    id:'p2-iq2', name:'เชาวน์ ป.2 · ความจำและมิติ', emoji:'🤔', icon:'assets/icons/p2-iq2.svg', color:'#1F9C60', light:'#D6F3E4', grade:'p2', poolPick:10, isNew:true,
    questions:[
      /* tier1 — กฎ / จับคู่ / ทิศทาง (ง่าย) */
      {q:'คำว่า "แมว" มีตัวอักษรกี่ตัว?', emoji:'🔤', choices:['3','2','4','5'], correct:0, explain:'แ-ม-ว รวม 3 ตัว', tier:1},
      {q:'ถ้ากฎคือ "แตะเฉพาะสีแดง" ควรแตะข้อใด?', emoji:'🎯', choices:['🍎','🍏','🫐','🍋'], correct:0, explain:'🍎 สีแดง', tier:1},
      {q:'จำนวนใดมาก่อน 5?', emoji:'🔢', choices:['4','6','7','8'], correct:0, explain:'4 มาก่อน 5', tier:1},
      {q:'ทิศตรงข้ามกับ "ขึ้น" คือทิศใด?', emoji:'⬆️', choices:['ลง','ซ้าย','ขวา','หน้า'], correct:0, explain:'ตรงข้ามกับขึ้นคือลง', tier:1},
      {q:'กฎ: นับเพิ่มทีละ 2 เริ่มจาก 1 ตัวถัดไปคือ?', emoji:'➡️', choices:['3','2','4','5'], correct:0, explain:'1 + 2 = 3', tier:1},
      {q:'สิ่งใดควรอยู่คู่กัน?', emoji:'🧦', choices:['ถุงเท้า-รองเท้า','ถุงเท้า-หมวก','ช้อน-หมวก','ปากกา-รองเท้า'], correct:0, explain:'ถุงเท้าใส่คู่กับรองเท้า', tier:1},
      {q:'จำภาพ: 🐶🐱🐰 ตัวที่อยู่ตรงกลางคือ?', emoji:'👀', choices:['🐱','🐶','🐰','🐭'], correct:0, explain:'ตัวกลางคือแมว', tier:1},
      {q:'กฎ: "ห้ามแตะสัตว์" ข้อใดห้ามแตะ?', emoji:'🚫', choices:['🐸','🍎','⚽','🚗'], correct:0, explain:'🐸 เป็นสัตว์ จึงห้ามแตะ', tier:1},
      {q:'เงาของ 🌳 น่าจะเป็นรูปใด?', emoji:'🌚', choices:['รูปต้นไม้','รูปบ้าน','รูปรถ','รูปแมว'], correct:0, explain:'เงาต้องเป็นรูปทรงเดียวกับต้นไม้', tier:1},
      /* tier2 — สลับกฎ / พับ-หมุน / ลำดับ (ยาก) */
      {q:'ถ้าเข้าแถวเรียงจากเตี้ยไปสูง คนเตี้ยที่สุดอยู่ตำแหน่งใด?', emoji:'🧍', choices:['หน้าสุด','หลังสุด','ตรงกลาง','ไม่แน่นอน'], correct:0, explain:'เรียงเตี้ยไปสูง คนเตี้ยสุดอยู่หน้าสุด', tier:2},
      {q:'กฎกลับด้าน: ถ้า "เปิด→ปิด" แล้ว "ขึ้น→▢"', emoji:'🔀', choices:['ลง','ออก','มา','ไป'], correct:0, explain:'ตรงข้ามกับขึ้นคือลง', tier:2},
      {q:'ลำดับวัน: จันทร์ อังคาร พุธ พฤหัส ▢', emoji:'📆', choices:['ศุกร์','เสาร์','อาทิตย์','จันทร์'], correct:0, explain:'ถัดจากพฤหัสคือศุกร์', tier:2},
      {q:'กล่องวาง 2 ชั้น ชั้นละ 3 กล่อง รวมมีกี่กล่อง?', emoji:'📦', choices:['6','5','9','3'], correct:0, explain:'2 × 3 = 6 กล่อง', tier:2},
      {q:'พับกระดาษครึ่งหนึ่งแล้วเจาะ 1 รู เมื่อคลี่ออกจะมีกี่รู?', emoji:'📄', choices:['2','1','3','4'], correct:0, explain:'พับครึ่งเจาะ 1 รู คลี่ออกได้ 2 รู', tier:2},
      {q:'กฎสลับสี: แดง-เขียว-แดง-เขียว ตัวที่ 6 คือสีอะไร?', emoji:'🎨', choices:['เขียว','แดง','เหลือง','ฟ้า'], correct:0, explain:'ตำแหน่งคู่เป็นสีเขียว ตัวที่ 6 คือเขียว', tier:2},
      {q:'ตัวอักษร "M" เมื่อกลับหัวลง จะดูเหมือนตัวใด?', emoji:'🔄', choices:['W','E','N','Z'], correct:0, explain:'M กลับหัวได้ตัว W', tier:2},
      {q:'ถ้าวางลูกบอลบนพื้นที่เอียง ลูกบอลจะทำอย่างไร?', emoji:'⚽', choices:['กลิ้งลงต่ำ','กลิ้งขึ้นสูง','ลอยขึ้น','อยู่นิ่ง'], correct:0, explain:'ลูกบอลจะกลิ้งลงที่ต่ำตามแรงโน้มถ่วง', tier:2},
      {q:'มือ คู่กับ ถุงมือ แล้ว เท้า คู่กับอะไร?', emoji:'🦶', choices:['รองเท้า','หมวก','แว่นตา','เสื้อ'], correct:0, explain:'เท้าใส่คู่กับรองเท้า', tier:1},
      {q:'นก อยู่กับ รัง แล้ว ปลา อยู่กับอะไร?', emoji:'🐟', choices:['น้ำ','ต้นไม้','ถ้ำ','ฟ้า'], correct:0, explain:'ปลาอยู่ในน้ำ', tier:1},
      {q:'1 สัปดาห์มีกี่วัน?', emoji:'📅', choices:['7 วัน','5 วัน','10 วัน','30 วัน'], correct:0, explain:'1 สัปดาห์มี 7 วัน', tier:1},
      {q:'ครึ่งหนึ่งของ 8 คือเท่าไร?', emoji:'➗', choices:['4','3','8','2'], correct:0, explain:'8 ÷ 2 = 4', tier:2},
      {q:'มี 5 นิ้วต่อมือ สองมือมีกี่นิ้ว?', emoji:'🖐️', choices:['10 นิ้ว','5 นิ้ว','15 นิ้ว','8 นิ้ว'], correct:0, explain:'5 × 2 = 10 นิ้ว', tier:2},
      {q:'1 โหลเท่ากับกี่ชิ้น?', emoji:'📦', choices:['12 ชิ้น','10 ชิ้น','6 ชิ้น','20 ชิ้น'], correct:0, explain:'1 โหล = 12 ชิ้น', tier:2}
    ]
  },
  {
    /* reuse EF engine (นกฮูกสั่ง) — แยก id/progress จาก ป.1 */
    id:'p2-iq3', name:'เชาวน์ ป.2 · นกฮูกสั่ง', emoji:'🦉', icon:'assets/icons/p2-iq3.svg', color:'#17A65B', light:'#D6F3E4',
    type:'skill', mode:'ef', levels:10, grade:'p2', isNew:true
  },

  /* ---------- ดนตรี ป.2 (quiz) ---------- */
  {
    id:'p2-music1', name:'ดนตรี ป.2 · เครื่องดนตรีและเสียง', emoji:'🎵', icon:'assets/icons/p2-music1.svg', color:'#4C8DF0', light:'#DEEAFC', grade:'p2', poolPick:10, isNew:true,
    questions:[
      {q:'เครื่องดนตรีใดเล่นโดยการ "ตี"?', emoji:'🥁', choices:['กลอง','ขลุ่ย','ไวโอลิน','กีตาร์'], correct:0, explain:'กลองเล่นด้วยการตี', tier:1},
      {q:'เสียง "โครม!" ดังมาจากสิ่งใด?', emoji:'⛈️', choices:['ฟ้าร้อง','นกร้อง','น้ำหยด','ลมพัดเบา'], correct:0, explain:'ฟ้าร้องมีเสียงดังโครม', tier:1},
      {q:'เครื่องดนตรีใดเล่นโดยการ "เป่า"?', emoji:'🎺', choices:['ขลุ่ย','กลอง','ระนาด','ฉิ่ง'], correct:0, explain:'ขลุ่ยเล่นด้วยการเป่า', tier:1},
      {q:'เสียงแมวร้องเป็นอย่างไร?', emoji:'🐱', choices:['เหมียว','โฮ่ง','จิ๊บ','มอ'], correct:0, explain:'แมวร้องเหมียว', tier:1},
      {q:'เครื่องดนตรีไทยข้อใดใช้ตี?', emoji:'🎶', choices:['ระนาด','ซอ','ขลุ่ย','จะเข้'], correct:0, explain:'ระนาดเล่นด้วยการตี', tier:1},
      {q:'เสียงทุ้มต่ำมักมาจากสิ่งใด?', emoji:'🥁', choices:['กลองใหญ่','นกหวีด','กระดิ่งเล็ก','ขลุ่ยเล็ก'], correct:0, explain:'กลองใหญ่ให้เสียงทุ้มต่ำ', tier:1},
      {q:'เครื่องดนตรีใดมี "สาย"?', emoji:'🎸', choices:['กีตาร์','กลอง','ฉิ่ง','ขลุ่ย'], correct:0, explain:'กีตาร์มีสายสำหรับดีด', tier:1},
      {q:'เพลงจังหวะช้าฟังแล้วรู้สึกอย่างไร?', emoji:'😌', choices:['สงบผ่อนคลาย','ตื่นเต้นมาก','โกรธ','กลัว'], correct:0, explain:'เพลงช้าช่วยให้รู้สึกสงบ', tier:1},
      {q:'เสียงกระดิ่งเป็นอย่างไร?', emoji:'🔔', choices:['กริ๊ง','ตูม','ครืน','ฟู่'], correct:0, explain:'กระดิ่งมีเสียงกริ๊ง', tier:1},
      {q:'ฉิ่ง-ฉาบ เป็นเครื่องดนตรีประเภทใด?', emoji:'🎼', choices:['เครื่องตี','เครื่องเป่า','เครื่องสี','เครื่องดีด'], correct:0, explain:'ฉิ่ง-ฉาบ เป็นเครื่องตี', tier:2},
      {q:'เสียงสูงแหลมมักมาจากสิ่งใด?', emoji:'📢', choices:['นกหวีด','กลองใหญ่','ฆ้องใหญ่','เบส'], correct:0, explain:'นกหวีดมีเสียงสูงแหลม', tier:2},
      {q:'"ซอ" เล่นด้วยวิธีใด?', emoji:'🎻', choices:['สี','ตี','เป่า','ดีด'], correct:0, explain:'ซอเล่นด้วยการสี', tier:2},
      {q:'เครื่องดนตรีใดเป็นของไทย?', emoji:'🇹🇭', choices:['ระนาด','เปียโน','กีตาร์','กลองชุด'], correct:0, explain:'ระนาดเป็นเครื่องดนตรีไทย', tier:2},
      {q:'เสียงใดเบาที่สุด?', emoji:'🤫', choices:['กระซิบ','ตะโกน','ฟ้าร้อง','ตีกลอง'], correct:0, explain:'เสียงกระซิบเบาที่สุด', tier:2},
      {q:'"จะเข้" เล่นด้วยวิธีใด?', emoji:'🪕', choices:['ดีด','เป่า','ตี','สี'], correct:0, explain:'จะเข้เล่นด้วยการดีด', tier:2},
      {q:'โน้ตดนตรีไทยเสียงต่ำสุดในกลุ่มเริ่มด้วยตัวใด?', emoji:'🎵', choices:['โด','ที','ซอล','มี'], correct:0, explain:'โด (ด) เป็นเสียงต่ำเริ่มต้น', tier:2},
      {q:'วงดนตรีต้องเล่นอย่างไรจึงไพเราะ?', emoji:'🎷', choices:['พร้อมเพรียงกัน','ต่างคนต่างเล่น','แข่งกันดัง','เล่นคนละจังหวะ'], correct:0, explain:'ต้องเล่นพร้อมเพรียงกัน', tier:2},
      {q:'เครื่องดนตรีใดใช้ "ดีด"?', emoji:'🎸', choices:['กีตาร์','กลอง','ขลุ่ย','ฉิ่ง'], correct:0, explain:'กีตาร์เล่นด้วยการดีดสาย', tier:2},
      {q:'เครื่องดนตรีใดใช้ "ตี"?', emoji:'🥁', choices:['กลอง','ขลุ่ย','กีตาร์','ซอ'], correct:0, explain:'กลองเป็นเครื่องตี', tier:1},
      {q:'เครื่องดนตรีใดใช้ "เป่า"?', emoji:'🎺', choices:['ขลุ่ย','กลอง','กีตาร์','ระนาด'], correct:0, explain:'ขลุ่ยเป็นเครื่องเป่า', tier:1},
      {q:'เสียงที่ดังมากๆ เรียกว่าเสียงแบบใด?', emoji:'🔊', choices:['เสียงดัง','เสียงเบา','เสียงสูง','เสียงต่ำ'], correct:0, explain:'เสียงที่ดังมากคือเสียงดัง', tier:1},
      {q:'ไวโอลินเล่นด้วยวิธีใด?', emoji:'🎻', choices:['สี','ตี','เป่า','ดีด'], correct:0, explain:'ไวโอลินใช้คันชักสี', tier:2},
      {q:'เสียงเกิดจากอะไร?', emoji:'🔔', choices:['การสั่นสะเทือน','แสง','ความร้อน','น้ำ'], correct:0, explain:'เสียงเกิดจากการสั่นสะเทือน', tier:2},
      {q:'ระนาดเป็นเครื่องดนตรีประเภทใด?', emoji:'🎼', choices:['เครื่องตี','เครื่องเป่า','เครื่องสาย','เครื่องดีด'], correct:0, explain:'ระนาดใช้ไม้ตี เป็นเครื่องตี', tier:2}
    ]
  },
  {
    id:'p2-music2', name:'ดนตรี ป.2 · จังหวะและโน้ต', emoji:'🎶', icon:'assets/icons/p2-music2.svg', color:'#2F6BC4', light:'#DEEAFC', grade:'p2', poolPick:10, isNew:true,
    questions:[
      {q:'ปรบมือ "ตบ-ตบ-ตบ" มีกี่ครั้ง?', emoji:'👏', choices:['3','2','4','1'], correct:0, explain:'นับได้ 3 ครั้ง', tier:1},
      {q:'โน้ตตัวถัดจาก "โด เร มี" คือตัวใด?', emoji:'🎵', choices:['ฟา','ซอล','ลา','โด'], correct:0, explain:'ลำดับคือ โด เร มี ฟา', tier:1},
      {q:'จังหวะช้านุ่มนวลเหมาะกับเพลงแบบใด?', emoji:'🎶', choices:['เพลงกล่อมเด็ก','เพลงเต้นรำเร็ว','เพลงมาร์ช','เพลงวิ่งแข่ง'], correct:0, explain:'เพลงกล่อมเด็กใช้จังหวะช้านุ่มนวล', tier:1},
      {q:'เสียงสูงขึ้นเรื่อยๆ: โด เร มี ▢', emoji:'⬆️', choices:['ฟา','โด','เร','ที'], correct:0, explain:'ถัดจากมีคือฟา (สูงขึ้น)', tier:1},
      {q:'เคาะจังหวะ 1-2-1-2 เป็นจังหวะแบบใด?', emoji:'🥁', choices:['สม่ำเสมอ','มั่ว','เงียบ','สลับช้าเร็ว'], correct:0, explain:'1-2-1-2 เป็นจังหวะสม่ำเสมอ', tier:1},
      {q:'โน้ต "ซอล" อยู่สูงหรือต่ำกว่า "โด"?', emoji:'🎼', choices:['สูงกว่า','ต่ำกว่า','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'ซอลอยู่สูงกว่าโด', tier:1},
      {q:'ขณะร้องเพลงชาติ ควรมีท่าทางอย่างไร?', emoji:'🇹🇭', choices:['ยืนตรง','นั่งเล่น','วิ่ง','นอน'], correct:0, explain:'ควรยืนตรงด้วยความเคารพ', tier:1},
      {q:'นับจังหวะ 1-2-3-4 แล้ววนใหม่ ถัดจาก 4 คือ?', emoji:'🔢', choices:['1','5','0','2'], correct:0, explain:'วนกลับไปเริ่มที่ 1', tier:1},
      {q:'เสียง "ตุ้ม ตุ้ม" เป็นจังหวะของเครื่องใด?', emoji:'🥁', choices:['กลอง','ขลุ่ย','ซอ','ฉิ่ง'], correct:0, explain:'กลองให้เสียงตุ้มตุ้ม', tier:1},
      {q:'โน้ต โด เร มี ฟา ซอล ลา ▢ ตัวถัดไปคือ?', emoji:'🎵', choices:['ที','โด','ซอล','มี'], correct:0, explain:'ถัดจากลาคือที', tier:2},
      {q:'จังหวะเพลงมาร์ชเหมาะกับการทำสิ่งใด?', emoji:'🥁', choices:['เดินสวนสนาม','นอนหลับ','นั่งสมาธิ','กินข้าว'], correct:0, explain:'เพลงมาร์ชใช้ประกอบการเดินสวนสนาม', tier:2},
      {q:'เรียงเสียงจากต่ำไปสูง ข้อใดถูก?', emoji:'📈', choices:['โด-มี-ซอล','ซอล-มี-โด','มี-โด-ซอล','ซอล-โด-มี'], correct:0, explain:'โดต่ำสุด ซอลสูงสุด', tier:2},
      {q:'เสียงที่ลากยาว ต่างจากเสียงสั้นอย่างไร?', emoji:'🎶', choices:['ค้างอยู่นานกว่า','ดังกว่าเสมอ','สูงกว่าเสมอ','ต่ำกว่าเสมอ'], correct:0, explain:'ความยาวของเสียงคือระยะเวลาที่เสียงนั้นค้างอยู่', tier:2},
      {q:'จังหวะ "ช้า-เร็ว-ช้า-เร็ว" เป็นแบบใด?', emoji:'🔀', choices:['สลับกัน','เหมือนกันหมด','เงียบตลอด','ช้าตลอด'], correct:0, explain:'เป็นจังหวะสลับช้า-เร็ว', tier:2},
      {q:'ร้องเพลงพร้อมเพื่อนควรทำอย่างไร?', emoji:'🎤', choices:['ร้องให้พร้อมกัน','ร้องแข่งดัง','ร้องคนละจังหวะ','ร้องเงียบคนเดียว'], correct:0, explain:'ควรร้องให้พร้อมเพรียงกัน', tier:2},
      {q:'โน้ตเสียงสูงสุดในกลุ่ม โด เร มี คือตัวใด?', emoji:'🔝', choices:['มี','โด','เร','ฟา'], correct:0, explain:'ในกลุ่มนี้ มี สูงสุด', tier:2},
      {q:'ถ้าเคาะจังหวะเร็วขึ้นเรื่อยๆ เพลงจะเป็นอย่างไร?', emoji:'⏩', choices:['เร่งเร็วขึ้น','ช้าลง','เงียบลง','หยุด'], correct:0, explain:'จังหวะเร็วขึ้นเพลงจะเร่งขึ้น', tier:2},
      {q:'เพลงกล่อมเด็กควรมีจังหวะอย่างไร?', emoji:'🌙', choices:['ช้านุ่มนวล','เร็วแรง','กระโดดโลดเต้น','ดังสนั่น'], correct:0, explain:'เพลงกล่อมเด็กใช้จังหวะช้านุ่มนวล', tier:2},
      {q:'โน้ตดนตรีตัวแรกคือตัวใด?', emoji:'🎵', choices:['โด','ที','ซอล','ฟา'], correct:0, explain:'ลำดับเริ่มที่ โด เร มี', tier:1},
      {q:'การเคาะจังหวะสม่ำเสมอเรียกว่าอะไร?', emoji:'🥁', choices:['จังหวะ','ทำนอง','เนื้อร้อง','เสียงประสาน'], correct:0, explain:'การเคาะสม่ำเสมอคือจังหวะ', tier:1},
      {q:'เรียงโน้ตให้ถูก: โด เร ▢ ฟา', emoji:'🎶', choices:['มี','ซอล','ที','ลา'], correct:0, explain:'ลำดับคือ โด เร มี ฟา', tier:1},
      {q:'เพลงที่ร้องเชียร์กีฬาควรมีจังหวะแบบใด?', emoji:'📣', choices:['สนุกคึกคัก','ช้าเศร้า','เงียบ','ไม่มีจังหวะ'], correct:0, explain:'เพลงเชียร์ควรสนุกคึกคัก', tier:2},
      {q:'ถ้าปรบมือตามจังหวะเพลงเร็ว ต้องปรบอย่างไร?', emoji:'👏', choices:['ปรบถี่ขึ้นตามจังหวะ','ปรบช้าลง','หยุดปรบ','ปรบดังที่สุด'], correct:0, explain:'จังหวะเร็วหมายถึงเสียงเคาะถี่ขึ้น จึงต้องปรบให้ทันจังหวะ', tier:2},
      {q:'เสียงสูงกับเสียงต่ำต่างกันอย่างไร?', emoji:'📈', choices:['ระดับเสียงต่างกัน','ความดังต่างกัน','สีต่างกัน','ไม่ต่างกัน'], correct:0, explain:'เสียงสูง-ต่ำต่างกันที่ระดับเสียง', tier:2}
    ]
  },

  /* ---------- ศิลปะ ป.2 (quiz) ---------- */
  {
    id:'p2-art1', name:'ศิลปะ ป.2 · สีสัน', emoji:'🎨', icon:'assets/icons/p2-art1.svg', color:'#FF7A45', light:'#FFE4D6', grade:'p2', poolPick:10, isNew:true,
    questions:[
      {q:'สีแดงผสมสีเหลืองได้สีอะไร?', emoji:'🟠', choices:['สีส้ม','สีเขียว','สีม่วง','สีน้ำตาล'], correct:0, explain:'แดง + เหลือง = ส้ม', tier:1},
      {q:'สีฟ้าผสมสีเหลืองได้สีอะไร?', emoji:'🟢', choices:['สีเขียว','สีส้ม','สีม่วง','สีชมพู'], correct:0, explain:'ฟ้า + เหลือง = เขียว', tier:1},
      {q:'ท้องฟ้าตอนกลางวันมีสีอะไร?', emoji:'🌤️', choices:['สีฟ้า','สีเขียว','สีแดง','สีดำ'], correct:0, explain:'ท้องฟ้ากลางวันเป็นสีฟ้า', tier:1},
      {q:'สีแดงผสมสีขาวได้สีอะไร?', emoji:'🩷', choices:['สีชมพู','สีเทา','สีส้ม','สีม่วง'], correct:0, explain:'แดง + ขาว = ชมพู', tier:1},
      {q:'ใบไม้ส่วนใหญ่มีสีอะไร?', emoji:'🍃', choices:['สีเขียว','สีฟ้า','สีม่วง','สีแดง'], correct:0, explain:'ใบไม้ส่วนใหญ่สีเขียว', tier:1},
      {q:'สีแดงผสมสีน้ำเงินได้สีอะไร?', emoji:'🟣', choices:['สีม่วง','สีเขียว','สีส้ม','สีเหลือง'], correct:0, explain:'แดง + น้ำเงิน = ม่วง', tier:1},
      {q:'สีใดเป็นสีโทนร้อน?', emoji:'🔥', choices:['สีแดง','สีฟ้า','สีเขียว','สีม่วง'], correct:0, explain:'สีแดงเป็นสีโทนร้อน', tier:1},
      {q:'ดวงอาทิตย์มักวาดด้วยสีอะไร?', emoji:'☀️', choices:['สีเหลือง','สีฟ้า','สีดำ','สีเขียว'], correct:0, explain:'ดวงอาทิตย์มักวาดสีเหลือง', tier:1},
      {q:'สีดำผสมสีขาวได้สีอะไร?', emoji:'⚪', choices:['สีเทา','สีชมพู','สีน้ำตาล','สีส้ม'], correct:0, explain:'ดำ + ขาว = เทา', tier:1},
      {q:'สีใดเป็นสีโทนเย็น?', emoji:'❄️', choices:['สีฟ้า','สีแดง','สีส้ม','สีเหลือง'], correct:0, explain:'สีฟ้าเป็นสีโทนเย็น', tier:2},
      {q:'แม่สี (สีหลัก) มีสีใดบ้าง?', emoji:'🎨', choices:['แดง เหลือง น้ำเงิน','เขียว ส้ม ม่วง','ชมพู เทา ดำ','ขาว ดำ แดง'], correct:0, explain:'แม่สีคือ แดง เหลือง น้ำเงิน', tier:2},
      {q:'ถ้าอยากได้สีเข้มขึ้น ควรผสมสีใด?', emoji:'⚫', choices:['สีดำ','สีขาว','สีเหลือง','สีชมพู'], correct:0, explain:'ผสมสีดำจะทำให้เข้มขึ้น', tier:2},
      {q:'สีส้มเกิดจากการผสมสีคู่ใด?', emoji:'🟠', choices:['แดง + เหลือง','ฟ้า + เหลือง','แดง + ฟ้า','ดำ + ขาว'], correct:0, explain:'ส้ม = แดง + เหลือง', tier:2},
      {q:'รุ้งกินน้ำมีกี่สี?', emoji:'🌈', choices:['7','5','3','10'], correct:0, explain:'รุ้งกินน้ำมี 7 สี', tier:2},
      {q:'สีเขียวเกิดจากการผสมสีคู่ใด?', emoji:'🟢', choices:['ฟ้า + เหลือง','แดง + ขาว','ดำ + เหลือง','แดง + ฟ้า'], correct:0, explain:'เขียว = ฟ้า + เหลือง', tier:2},
      {q:'ถ้าอยากให้สีอ่อนลง ควรผสมสีใด?', emoji:'⚪', choices:['สีขาว','สีดำ','สีแดง','สีน้ำเงิน'], correct:0, explain:'ผสมสีขาวจะทำให้อ่อนลง', tier:2},
      {q:'สีม่วงเกิดจากการผสมสีคู่ใด?', emoji:'🟣', choices:['แดง + น้ำเงิน','เหลือง + ฟ้า','ขาว + ดำ','ส้ม + เขียว'], correct:0, explain:'ม่วง = แดง + น้ำเงิน', tier:2},
      {q:'สีของหญ้าและใบไม้คือสีอะไร?', emoji:'🌿', choices:['สีเขียว','สีน้ำตาล','สีฟ้า','สีม่วง'], correct:0, explain:'หญ้าและใบไม้มีสีเขียว', tier:2},
      {q:'แม่สีมีกี่สี?', emoji:'🎨', choices:['3 สี','2 สี','5 สี','7 สี'], correct:0, explain:'แม่สีมี 3 สี แดง เหลือง น้ำเงิน', tier:1},
      {q:'สีเหลืองผสมสีขาวได้สีอะไร?', emoji:'🎨', choices:['สีเหลืองอ่อน','สีเขียว','สีน้ำตาล','สีดำ'], correct:0, explain:'ผสมสีขาวจะทำให้สีอ่อนลง เหลือง + ขาว = เหลืองอ่อน', tier:1},
      {q:'ท้องฟ้ากลางวันเป็นสีอะไร?', emoji:'🌤️', choices:['สีฟ้า','สีแดง','สีดำ','สีเขียว'], correct:0, explain:'ท้องฟ้ากลางวันสีฟ้า', tier:1},
      {q:'สีน้ำเงินผสมสีเหลืองได้สีอะไร?', emoji:'🟢', choices:['สีเขียว','สีส้ม','สีม่วง','สีชมพู'], correct:0, explain:'น้ำเงิน + เหลือง = เขียว', tier:2},
      {q:'สีใดให้ความรู้สึกร้อน?', emoji:'🔥', choices:['สีแดง','สีฟ้า','สีเขียว','สีขาว'], correct:0, explain:'สีแดงเป็นสีโทนร้อน', tier:2},
      {q:'สีแดงผสมสีน้ำเงินได้สีอะไร?', emoji:'🟣', choices:['สีม่วง','สีเขียว','สีส้ม','สีเทา'], correct:0, explain:'แดง + น้ำเงิน = ม่วง', tier:2}
    ]
  },
  {
    id:'p2-art2', name:'ศิลปะ ป.2 · เส้นและรูปทรง', emoji:'🖼️', icon:'assets/icons/p2-art2.svg', color:'#D9542F', light:'#FFE4D6', grade:'p2', poolPick:10, isNew:true,
    questions:[
      {q:'รูปที่มี 3 ด้านคือรูปอะไร?', emoji:'🔺', choices:['สามเหลี่ยม','สี่เหลี่ยม','วงกลม','ห้าเหลี่ยม'], correct:0, explain:'รูป 3 ด้านคือสามเหลี่ยม', tier:1},
      {q:'รูปที่มี 4 ด้านเท่ากันทุกด้านคือรูปอะไร?', emoji:'🟦', choices:['สี่เหลี่ยมจัตุรัส','สามเหลี่ยม','วงกลม','วงรี'], correct:0, explain:'4 ด้านเท่ากันคือสี่เหลี่ยมจัตุรัส', tier:1},
      {q:'รูปใดไม่มีมุมเลย?', emoji:'⭕', choices:['วงกลม','สามเหลี่ยม','สี่เหลี่ยม','ห้าเหลี่ยม'], correct:0, explain:'วงกลมไม่มีมุม', tier:1},
      {q:'เส้นที่ตรงไม่คดเรียกว่าเส้นอะไร?', emoji:'📏', choices:['เส้นตรง','เส้นโค้ง','เส้นหยัก','เส้นคด'], correct:0, explain:'เส้นตรงคือเส้นที่ไม่คดงอ', tier:1},
      {q:'ลูกบอลมีรูปทรงแบบใด?', emoji:'⚽', choices:['ทรงกลม','ทรงเหลี่ยม','แบน','ยาว'], correct:0, explain:'ลูกบอลเป็นทรงกลม', tier:1},
      {q:'รูปสามเหลี่ยมมีกี่มุม?', emoji:'🔺', choices:['3','4','2','5'], correct:0, explain:'สามเหลี่ยมมี 3 มุม', tier:1},
      {q:'หน้าต่างส่วนใหญ่มีรูปร่างแบบใด?', emoji:'🪟', choices:['สี่เหลี่ยม','วงกลม','สามเหลี่ยม','ดาว'], correct:0, explain:'หน้าต่างส่วนใหญ่เป็นสี่เหลี่ยม', tier:1},
      {q:'เส้นที่โค้งงอเรียกว่าเส้นอะไร?', emoji:'〰️', choices:['เส้นโค้ง','เส้นตรง','เส้นตั้ง','เส้นนอน'], correct:0, explain:'เส้นที่โค้งคือเส้นโค้ง', tier:1},
      {q:'รูปวงกลมมีกี่ด้าน?', emoji:'⭕', choices:['ไม่มีด้าน','3 ด้าน','4 ด้าน','1 ด้าน'], correct:0, explain:'วงกลมไม่มีด้านและมุม', tier:1},
      {q:'รูปที่มี 5 ด้านคือรูปอะไร?', emoji:'🔷', choices:['ห้าเหลี่ยม','หกเหลี่ยม','สี่เหลี่ยม','สามเหลี่ยม'], correct:0, explain:'รูป 5 ด้านคือห้าเหลี่ยม', tier:2},
      {q:'รังผึ้งมีช่องรูปทรงแบบใด?', emoji:'🐝', choices:['หกเหลี่ยม','วงกลม','สามเหลี่ยม','สี่เหลี่ยม'], correct:0, explain:'ช่องรังผึ้งเป็นรูปหกเหลี่ยม', tier:2},
      {q:'สี่เหลี่ยมผืนผ้าต่างจากจัตุรัสอย่างไร?', emoji:'▭', choices:['ด้านยาวไม่เท่าด้านกว้าง','มี 3 ด้าน','กลม','ไม่มีมุม'], correct:0, explain:'ผืนผ้ามีด้านยาวกับด้านกว้างไม่เท่ากัน', tier:2},
      {q:'รูปทรงของลูกเต๋าเรียกว่าอะไร?', emoji:'🎲', choices:['ลูกบาศก์','ทรงกลม','ทรงกรวย','ทรงกระบอก'], correct:0, explain:'ลูกเต๋าเป็นทรงลูกบาศก์', tier:2},
      {q:'หมวกปาร์ตี้ทรงแหลมเป็นทรงอะไร?', emoji:'🎉', choices:['ทรงกรวย','ทรงกลม','ลูกบาศก์','ทรงกระบอก'], correct:0, explain:'หมวกแหลมเป็นทรงกรวย', tier:2},
      {q:'เส้นที่ขึ้นๆ ลงๆ เป็นฟันปลาเรียกว่าเส้นอะไร?', emoji:'⚡', choices:['เส้นหยัก','เส้นตรง','เส้นโค้ง','เส้นวงกลม'], correct:0, explain:'เส้นฟันปลาคือเส้นหยัก', tier:2},
      {q:'ดาวห้าแฉกมีกี่มุมแหลม?', emoji:'⭐', choices:['5','6','4','3'], correct:0, explain:'ดาวห้าแฉกมี 5 มุมแหลม', tier:2},
      {q:'รูปวงรีต่างจากวงกลมอย่างไร?', emoji:'🥚', choices:['รียาวไม่กลมสนิท','มีมุม','มี 4 ด้าน','เป็นเส้นตรง'], correct:0, explain:'วงรีมีลักษณะรียาว ไม่กลมสนิทเท่าวงกลม', tier:2},
      {q:'ทรงกระป๋องน้ำอัดลมเรียกว่าทรงอะไร?', emoji:'🥫', choices:['ทรงกระบอก','ทรงกลม','ลูกบาศก์','ทรงกรวย'], correct:0, explain:'กระป๋องเป็นทรงกระบอก', tier:2},
      {q:'รูปหกเหลี่ยมมีกี่ด้าน?', emoji:'🔷', choices:['6 ด้าน','5 ด้าน','4 ด้าน','3 ด้าน'], correct:0, explain:'หกเหลี่ยมมี 6 ด้าน', tier:1},
      {q:'รูปกลมไม่มีมุมคือรูปอะไร?', emoji:'⭕', choices:['วงกลม','สี่เหลี่ยม','สามเหลี่ยม','ดาว'], correct:0, explain:'รูปกลมไม่มีมุมคือวงกลม', tier:1},
      {q:'เส้นที่ลากจากซ้ายไปขวาเรียกว่าเส้นอะไร?', emoji:'➖', choices:['เส้นนอน','เส้นตั้ง','เส้นโค้ง','เส้นหยัก'], correct:0, explain:'เส้นซ้าย-ขวาคือเส้นนอน', tier:1},
      {q:'รูปที่มี 4 ด้านเท่ากันคือรูปอะไร?', emoji:'⬜', choices:['สี่เหลี่ยมจัตุรัส','สามเหลี่ยม','วงกลม','วงรี'], correct:0, explain:'4 ด้านเท่ากันคือสี่เหลี่ยมจัตุรัส', tier:2},
      {q:'ลูกฟุตบอลมีรูปทรงแบบใด?', emoji:'⚽', choices:['ทรงกลม','ทรงสี่เหลี่ยม','ทรงกระบอก','ทรงกรวย'], correct:0, explain:'ลูกบอลเป็นทรงกลม', tier:2},
      {q:'ปั้นดินน้ำมันเป็นงานศิลปะแบบใด?', emoji:'🎨', choices:['งานปั้น (3 มิติ)','งานวาด','งานร้องเพลง','งานเขียน'], correct:0, explain:'การปั้นเป็นงาน 3 มิติ', tier:2}
    ]
  },

  /* ---------- ธรรมชาติ / วิทยาศาสตร์ ป.2 (quiz) ---------- */
  {
    id:'p2-nature1', name:'ธรรมชาติ ป.2 · สิ่งมีชีวิตและพืช', emoji:'🌱', icon:'assets/icons/p2-nature1.svg', color:'#6FBF3B', light:'#E6F6D8', grade:'p2', poolPick:10, isNew:true,
    questions:[
      {q:'สิ่งใดเป็นสิ่งมีชีวิต?', emoji:'🌳', choices:['ต้นไม้','ก้อนหิน','รถยนต์','โต๊ะ'], correct:0, explain:'ต้นไม้เป็นสิ่งมีชีวิต', tier:1},
      {q:'พืชต้องการสิ่งใดเพื่อเจริญเติบโต?', emoji:'🌞', choices:['น้ำและแสงแดด','ขนม','ของเล่น','โทรทัศน์'], correct:0, explain:'พืชต้องการน้ำและแสงแดด', tier:1},
      {q:'สิ่งใดไม่มีชีวิต?', emoji:'🪨', choices:['ก้อนหิน','แมว','ปลา','นก'], correct:0, explain:'ก้อนหินไม่มีชีวิต', tier:1},
      {q:'สิ่งมีชีวิตต้องการอะไรเพื่ออยู่รอด?', emoji:'🍽️', choices:['อาหาร','สีสวย','เสียงเพลง','ของเล่น'], correct:0, explain:'สิ่งมีชีวิตต้องการอาหาร', tier:1},
      {q:'ส่วนใดของพืชดูดน้ำจากดิน?', emoji:'🌱', choices:['ราก','ดอก','ใบ','ผล'], correct:0, explain:'รากทำหน้าที่ดูดน้ำและอาหารจากดิน', tier:1},
      {q:'ลูกของแมวเรียกว่าอะไร?', emoji:'🐱', choices:['ลูกแมว','ลูกหมา','ลูกไก่','ลูกนก'], correct:0, explain:'สิ่งมีชีวิตให้ลูกคล้ายพ่อแม่ ลูกแมวจึงเป็นแมว', tier:1},
      {q:'สิ่งใดเจริญเติบโตได้?', emoji:'🌿', choices:['ต้นไม้','ก้อนหิน','รถ','แก้วน้ำ'], correct:0, explain:'ต้นไม้เจริญเติบโตได้', tier:1},
      {q:'พืชสร้างอาหารได้ที่ส่วนใดโดยใช้แสง?', emoji:'🍃', choices:['ใบ','ราก','ดอก','ผล'], correct:0, explain:'ใบพืชสร้างอาหารโดยใช้แสงแดด', tier:1},
      {q:'สิ่งใดหายใจได้?', emoji:'🐟', choices:['ปลา','หิน','ตุ๊กตา','รถ'], correct:0, explain:'ปลาเป็นสิ่งมีชีวิตจึงหายใจได้', tier:1},
      {q:'วัฏจักรชีวิตพืชดอกเริ่มจากสิ่งใด?', emoji:'🌰', choices:['เมล็ด','ต้นใหญ่','ผลสุก','ใบร่วง'], correct:0, explain:'วัฏจักรพืชเริ่มจากเมล็ดงอกเป็นต้น', tier:2},
      {q:'ข้อใดเป็นลักษณะของสิ่งมีชีวิต?', emoji:'💗', choices:['เติบโตและสืบพันธุ์ได้','อยู่นิ่งตลอด','ไม่ต้องการอาหาร','ไม่เคลื่อนไหว'], correct:0, explain:'สิ่งมีชีวิตเติบโตและสืบพันธุ์ได้', tier:2},
      {q:'เรียงวัฏจักร: เมล็ด → ต้นอ่อน → ▢ → ต้นออกดอก ข้อกลางคือ?', emoji:'🌿', choices:['ต้นโต','ผลสุก','เมล็ดใหม่','ใบร่วง'], correct:0, explain:'ต้นอ่อนโตเป็นต้นโตก่อนออกดอก', tier:2},
      {q:'ถ้าไม่รดน้ำต้นไม้เลย จะเกิดอะไรขึ้น?', emoji:'🥀', choices:['เหี่ยวเฉาและตาย','โตเร็วขึ้น','ออกดอกทันที','เปลี่ยนเป็นหิน'], correct:0, explain:'พืชขาดน้ำจะเหี่ยวเฉาและตาย', tier:2},
      {q:'สิ่งใดต่างจากพวก (เป็นสิ่งไม่มีชีวิต)?', emoji:'🧸', choices:['ตุ๊กตาหมี','กระต่าย','นก','ปลา'], correct:0, explain:'ตุ๊กตาหมีไม่มีชีวิต ที่เหลือเป็นสัตว์', tier:2},
      {q:'ผีเสื้อเจริญเติบโตมาจากตัวอะไร?', emoji:'🦋', choices:['หนอน','ลูกอ๊อด','ลูกไก่','ลูกกบ'], correct:0, explain:'ผีเสื้อโตมาจากหนอน (ผ่านดักแด้)', tier:2},
      {q:'กบเมื่อยังเล็กอยู่ในน้ำเรียกว่าอะไร?', emoji:'🐸', choices:['ลูกอ๊อด','หนอน','ดักแด้','ลูกปลา'], correct:0, explain:'ลูกกบตัวเล็กที่มีหางเรียกว่าลูกอ๊อด', tier:2},
      {q:'ส่วนของพืชที่มักมีสีสวยเพื่อล่อแมลงคือส่วนใด?', emoji:'🌸', choices:['ดอก','ราก','ลำต้น','เมล็ด'], correct:0, explain:'ดอกมีสีสวยเพื่อล่อแมลงมาช่วยผสมเกสร', tier:2},
      {q:'สิ่งมีชีวิตต่างจากสิ่งไม่มีชีวิตอย่างไร?', emoji:'🌼', choices:['ต้องการอาหารและเติบโตได้','มีสีสันเสมอ','แข็งแรงกว่า','ไม่เคลื่อนที่'], correct:0, explain:'สิ่งมีชีวิตต้องการอาหาร เติบโต และสืบพันธุ์ได้', tier:2},
      {q:'ส่วนของพืชที่ดูดน้ำจากดินคือส่วนใด?', emoji:'🌱', choices:['ราก','ใบ','ดอก','ผล'], correct:0, explain:'รากดูดน้ำจากดิน', tier:1},
      {q:'สัตว์ชนิดใดหายใจด้วยเหงือก?', emoji:'🐟', choices:['ปลา','นก','แมว','งู'], correct:0, explain:'ปลาหายใจด้วยเหงือก', tier:1},
      {q:'สิ่งมีชีวิตต้องการอะไรเพื่อเติบโต?', emoji:'💧', choices:['อาหาร น้ำ อากาศ','ของเล่น','ทีวี','เงิน'], correct:0, explain:'ต้องการอาหาร น้ำ อากาศ', tier:1},
      {q:'ส่วนของพืชที่สร้างอาหารคือส่วนใด?', emoji:'🌿', choices:['ใบ','ราก','ลำต้น','ดอก'], correct:0, explain:'ใบสร้างอาหารด้วยการสังเคราะห์แสง', tier:2},
      {q:'สัตว์ชนิดใดเลี้ยงลูกด้วยนม?', emoji:'🐄', choices:['วัว','ปลา','นก','กบ'], correct:0, explain:'วัวเลี้ยงลูกด้วยนม', tier:2},
      {q:'สิ่งใดไม่ใช่สิ่งมีชีวิต?', emoji:'🪨', choices:['ก้อนหิน','ต้นไม้','ปลา','คน'], correct:0, explain:'ก้อนหินไม่ใช่สิ่งมีชีวิต', tier:2}
    ]
  },
  {
    id:'p2-nature2', name:'ธรรมชาติ ป.2 · วัสดุ แสง และดิน', emoji:'🔬', icon:'assets/icons/p2-nature2.svg', color:'#4F9E2F', light:'#E6F6D8', grade:'p2', poolPick:10, isNew:true,
    questions:[
      {q:'วัสดุใดดูดซับน้ำได้ดี?', emoji:'🧻', choices:['ผ้า','พลาสติก','แก้ว','เหล็ก'], correct:0, explain:'ผ้าดูดซับน้ำได้ดี', tier:1},
      {q:'เราใช้สิ่งใดกันฝนเพราะไม่ดูดน้ำ?', emoji:'☂️', choices:['ร่มพลาสติก','ผ้าเช็ดตัว','กระดาษทิชชู่','ฟองน้ำ'], correct:0, explain:'ร่มพลาสติกไม่ดูดน้ำจึงกันฝนได้', tier:1},
      {q:'แสงเดินทางเป็นแนวแบบใด?', emoji:'💡', choices:['เส้นตรง','เส้นโค้ง','ซิกแซก','วงกลม'], correct:0, explain:'แสงเดินทางเป็นเส้นตรง', tier:1},
      {q:'เรามองเห็นสิ่งของได้เพราะอะไร?', emoji:'👁️', choices:['มีแสงสะท้อนเข้าตา','ของส่งเสียง','ของมีกลิ่น','ของร้อน'], correct:0, explain:'แสงสะท้อนจากวัตถุเข้าสู่ตาทำให้เรามองเห็น', tier:1},
      {q:'ดินชนิดใดเหมาะกับการปั้น?', emoji:'🏺', choices:['ดินเหนียว','ดินทราย','ดินร่วน','ดินแห้ง'], correct:0, explain:'ดินเหนียวจับตัวดีจึงเหมาะกับการปั้น', tier:1},
      {q:'ขวดพลาสติกใช้แล้วควรทำอย่างไร?', emoji:'♻️', choices:['นำไปรีไซเคิล','ทิ้งลงแม่น้ำ','เผาในบ้าน','ฝังใต้ต้นไม้'], correct:0, explain:'ควรนำไปรีไซเคิลเพื่อใช้ใหม่', tier:1},
      {q:'ผ้าเช็ดตัวมีสมบัติอย่างไร?', emoji:'🛁', choices:['ดูดน้ำได้ดี','ไม่ดูดน้ำเลย','แข็งมาก','ละลายน้ำ'], correct:0, explain:'ผ้าเช็ดตัวดูดน้ำได้ดี', tier:1},
      {q:'ในที่มืดสนิทเรามองเห็นสิ่งของหรือไม่?', emoji:'🌑', choices:['ไม่เห็น','เห็นชัดเจน','เห็นสีสวย','เห็นเฉพาะสีแดง'], correct:0, explain:'ไม่มีแสงจึงมองไม่เห็น', tier:1},
      {q:'สิ่งใดเป็นแหล่งกำเนิดแสง?', emoji:'☀️', choices:['ดวงอาทิตย์','ก้อนหิน','กระจก','ต้นไม้'], correct:0, explain:'ดวงอาทิตย์เป็นแหล่งกำเนิดแสง', tier:1},
      {q:'วัสดุใดไม่ดูดซับน้ำ?', emoji:'🪣', choices:['พลาสติก','ผ้า','กระดาษ','ฟองน้ำ'], correct:0, explain:'พลาสติกไม่ดูดซับน้ำ', tier:2},
      {q:'แป้ง + น้ำตาล + กะทิ ผสมกันทำเป็นอะไรได้?', emoji:'🍡', choices:['ขนมไทย','ยางลบ','ดินสอ','แก้วน้ำ'], correct:0, explain:'ผสมกันแล้วได้ขนมไทย', tier:2},
      {q:'ดินทรายมีลักษณะอย่างไร?', emoji:'🏖️', choices:['ร่วนไม่จับตัว','เหนียวจับตัวดี','แข็งเป็นก้อน','เปียกตลอด'], correct:0, explain:'ดินทรายร่วนซุยไม่จับตัวกัน', tier:2},
      {q:'เพื่อถนอมสายตา ควรอ่านหนังสือในที่แบบใด?', emoji:'📖', choices:['สว่างพอดี','มืดสนิท','แสงจ้ามาก','ใต้แดดจัด'], correct:0, explain:'ควรอ่านในที่มีแสงสว่างพอดี', tier:2},
      {q:'การนำวัสดุที่ใช้แล้วมาทำใหม่เรียกว่าอะไร?', emoji:'♻️', choices:['รีไซเคิล','ทิ้งขยะ','เผาทำลาย','ฝังกลบ'], correct:0, explain:'การนำกลับมาใช้ใหม่คือรีไซเคิล', tier:2},
      {q:'เงาเกิดขึ้นเพราะอะไร?', emoji:'🌚', choices:['แสงถูกวัตถุบัง','วัตถุมีสี','วัตถุร้อน','วัตถุส่งเสียง'], correct:0, explain:'เมื่อวัตถุบังแสงจะเกิดเงา', tier:2},
      {q:'ในดินมีสิ่งใดปนอยู่บ้าง?', emoji:'🪱', choices:['เศษหินและซากพืชซากสัตว์','พลาสติกล้วน','แก้วล้วน','เหล็กล้วน'], correct:0, explain:'ดินมีเศษหิน ซากพืชซากสัตว์ น้ำ และอากาศ', tier:2},
      {q:'ดินร่วนเหมาะกับสิ่งใด?', emoji:'🥬', choices:['ปลูกผัก','สร้างถนน','ทำแก้ว','หล่อเหล็ก'], correct:0, explain:'ดินร่วนอุดมสมบูรณ์เหมาะกับการปลูกพืช', tier:2},
      {q:'ถ้าเอากระจกมารับแสง แสงจะเป็นอย่างไร?', emoji:'🪞', choices:['สะท้อนกลับไป','หายไป','ถูกดูดกลืน','เปลี่ยนเป็นเสียง'], correct:0, explain:'กระจกสะท้อนแสงกลับไป', tier:2},
      {q:'น้ำเมื่อโดนความเย็นจัดจะกลายเป็นอะไร?', emoji:'🧊', choices:['น้ำแข็ง','ไอน้ำ','ดิน','ทราย'], correct:0, explain:'น้ำเย็นจัดกลายเป็นน้ำแข็ง', tier:1},
      {q:'กลางวันเรามองเห็นอะไรบนท้องฟ้า?', emoji:'🌞', choices:['ดวงอาทิตย์','ดวงดาว','ดวงจันทร์เต็มดวง','ดาวหาง'], correct:0, explain:'กลางวันเห็นดวงอาทิตย์', tier:1},
      {q:'วัสดุใดลอยน้ำได้?', emoji:'🌊', choices:['ไม้','ก้อนหิน','ตะปูเหล็ก','เหรียญ'], correct:0, explain:'ไม้มีน้ำหนักเบา ลอยน้ำได้', tier:1},
      {q:'น้ำเมื่อโดนความร้อนมากๆ จะกลายเป็นอะไร?', emoji:'♨️', choices:['ไอน้ำ','น้ำแข็ง','ก้อนหิน','ดิน'], correct:0, explain:'น้ำร้อนจัดกลายเป็นไอน้ำ', tier:2},
      {q:'แม่เหล็กดูดวัตถุที่ทำจากอะไรได้?', emoji:'🧲', choices:['เหล็ก','ไม้','พลาสติก','แก้ว'], correct:0, explain:'แม่เหล็กดูดเหล็กได้', tier:2},
      {q:'เงาเกิดขึ้นได้เพราะอะไร?', emoji:'🌑', choices:['แสงถูกวัตถุบัง','ไม่มีแสง','วัตถุร้อน','วัตถุเปียก'], correct:0, explain:'เงาเกิดเมื่อวัตถุบังแสง', tier:2}
    ]
  },

  /* ---------- เกมฝึกทักษะ ป.2 (reuse engine เดิม แยก id/progress) ---------- */
  { id:'p2-memory', name:'จับคู่โดมิโน ป.2', emoji:'🃏', icon:'assets/icons/p2-memory.svg', color:'#E0764C', light:'#FBE3D4', type:'skill', mode:'memory', levels:3, memoryPairs:[8,12,16], grade:'p2', isNew:true },
  { id:'p2-animalsort', name:'แยกสัตว์ บก-น้ำ-ปีก', emoji:'🐾', icon:'assets/icons/p2-animalsort.svg', color:'#4E9A51', light:'#DCEFD9', type:'skill', mode:'sort', sortSet:'landsea', levels:10, grade:'p2', isNew:true },
  { id:'p2-timeline', name:'เรียงลำดับเหตุการณ์', emoji:'🗓️', icon:'assets/icons/p2-timeline.svg', color:'#C98A3A', light:'#F7E9D2', type:'skill', mode:'timeline', timelineMax:4, levels:8, grade:'p2', isNew:true },

  /* ---------- coding ป.2 (พาแมวกลับบ้าน + บัตร "ทำซ้ำ N รอบ" loop — Phase 2.2 extend code engine) ---------- */
  { id:'p2-code1', name:'พาแมววนซ้ำ 1', emoji:'🤖', icon:'assets/icons/p2-code1.svg', color:'#2BB3A3', light:'#D6F5F1', type:'skill', mode:'code', codeSet:'p2a', codeLoop:true, levels:10, grade:'p2', isNew:true },
  { id:'p2-code2', name:'พาแมววนซ้ำ 2', emoji:'🔁', icon:'assets/icons/p2-code2.svg', color:'#2596A0', light:'#D6F1F5', type:'skill', mode:'code', codeSet:'p2b', codeLoop:true, levels:8, grade:'p2', isNew:true },
  { id:'p2-code3', name:'พาแมววนซ้ำ 3', emoji:'🎮', icon:'assets/icons/p2-code3.svg', color:'#1F7E88', light:'#D6EDF0', type:'skill', mode:'code', codeSet:'p2c', codeLoop:true, levels:8, grade:'p2', isNew:true },

  /* ---------- นักวิทย์ทายผล ป.2 (reuse predict-check engine — Phase 2.3) ---------- */
  { id:'p2-sci1', name:'นักวิทย์ ป.2 · มีชีวิตไหม', emoji:'🧫', icon:'assets/icons/p2-sci1.svg', color:'#3FA9C9', light:'#D9F0F8', type:'skill', mode:'science', sciSet:'p2living', levels:10, grade:'p2', isNew:true },
  { id:'p2-sci2', name:'นักวิทย์ ป.2 · วัสดุดูดซับน้ำ', emoji:'🌡️', icon:'assets/icons/p2-sci2.svg', color:'#7C6FD6', light:'#E6E2FA', type:'skill', mode:'science', sciSet:'p2absorb', levels:10, grade:'p2', isNew:true },

  /* ---------- engine ใหม่ ป.2 (IDEA + Phase 2.2): ร้านค้า/เศษส่วน/ตาชั่ง/ปฏิทิน — view แยกของตัวเอง ---------- */
  { id:'p2-money', name:'ร้านค้านกฮูก', emoji:'🪙', icon:'assets/icons/p2-money.svg', color:'#E5A93B', light:'#FBEBCB', type:'skill', mode:'money', levels:10, grade:'p2', isNew:true },
  { id:'p2-fraction', name:'พิซซ่าเศษส่วน', emoji:'🍕', icon:'assets/icons/p2-fraction.svg', color:'#E1503A', light:'#FBDBD4', type:'skill', mode:'fraction', levels:10, grade:'p2', isNew:true },
  { id:'p2-balance', name:'ตาชั่งวิเศษ', emoji:'⚖️', icon:'assets/icons/p2-balance.svg', color:'#7C8CFF', light:'#E4E8FF', type:'skill', mode:'balance', levels:10, grade:'p2', isNew:true },
  { id:'p2-calendar', name:'ปฏิทินวิเศษ', emoji:'📅', icon:'assets/icons/p2-calendar.svg', color:'#E67E9C', light:'#FBE1EA', type:'skill', mode:'calendar', levels:10, grade:'p2', isNew:true }
];
