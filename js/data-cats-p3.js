/* ================================================================================
   หมวด/เกมของระดับชั้น ป.3
   ถูกนำไปต่อเป็นอาเรย์ CATS ตัวเดียวใน js/data-cats.js (ลำดับ = ลำดับการ์ดในหน้าหลัก)
   ================================================================================ */

const CATS_P3 = [
  /* ===================== ระดับชั้น ป.3 (grade:'p3') ===================== */
  /* หมวดใหม่ของระดับ ป.3 — reuse engine เดิม แยก id/progress จาก ป.1-2 (ไม่ใส่ field icon → การ์ด fallback ใช้ cat.emoji)
     Phase 3.1 (คณิต — แกนของ ป.3): จำนวนไม่เกิน 100,000 / บวก-ลบระคนมีทด / คูณ-หาร (แม่สูง+มีเศษ)
     + calculation engine (ar-math ×÷ ตัวเลขใหญ่ขึ้น) + หมวดใหม่ "เศษส่วนแสนสนุก" (reuse fraction engine — แนวคิดใหม่แกนของ ป.3) */
  /* ---------- คณิต ป.3 ---------- */
  {
    id:'p3-math1', name:'คณิต ป.3 · จำนวนไม่เกิน 100,000', emoji:'#️⃣', icon:'assets/icons/p3-math1.svg', color:'#7C5CFC', light:'#E9E3FF', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — หลักหมื่น-พัน/อ่าน-เขียน/นับกระโดด/เปรียบเทียบ (ง่าย) */
      {q:'เลข 45,120 มีเลขในหลักหมื่นคือเลขใด?', emoji:'#️⃣', choices:['4','5','1','45'], correct:0, explain:'เลข 4 อยู่หลักหมื่น', tier:1},
      {q:'"สองหมื่นห้าพัน" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['25,000','20,500','2,500','25,500'], correct:0, explain:'สองหมื่นห้าพัน = 25,000', tier:1},
      {q:'นับทีละ 1,000: 3,000, 4,000, 5,000, ▢', emoji:'💯', choices:['6,000','5,100','5,500','7,000'], correct:0, explain:'นับเพิ่มทีละ 1,000 ตัวต่อไปคือ 6,000', tier:1},
      {q:'จำนวนใดมากที่สุด?', emoji:'📊', choices:['12,430','12,340','12,304','12,043'], correct:0, explain:'12,430 มากที่สุด', tier:1},
      {q:'เลข 50,000 อ่านว่าอย่างไร?', emoji:'🗣️', choices:['ห้าหมื่น','ห้าพัน','ห้าแสน','ห้าร้อย'], correct:0, explain:'50,000 อ่านว่า ห้าหมื่น', tier:1},
      {q:'จำนวนใดน้อยที่สุด?', emoji:'📉', choices:['8,090','8,900','9,080','9,800'], correct:0, explain:'8,090 น้อยที่สุด', tier:1},
      {q:'นับทีละ 100: 4,700, 4,800, 4,900, ▢', emoji:'🔟', choices:['5,000','4,910','5,900','4,000'], correct:0, explain:'นับเพิ่มทีละ 100 ตัวต่อไปคือ 5,000', tier:1},
      {q:'เลข 72,415 มีเลขในหลักพันคือเลขใด?', emoji:'#️⃣', choices:['2','7','4','1'], correct:0, explain:'เลข 2 อยู่หลักพัน', tier:1},
      {q:'"หนึ่งหมื่น" มีค่าเท่ากับเลขใด?', emoji:'🔢', choices:['10,000','1,000','100,000','1,00'], correct:0, explain:'หนึ่งหมื่น = 10,000', tier:1},
      /* tier2 — ค่าประจำหลัก/เรียงลำดับ/ปัดเศษ/เครื่องหมาย (ยาก) */
      {q:'เรียงจากน้อยไปมากข้อใดถูกต้อง?', emoji:'📈', choices:['5,234; 5,342; 5,432','5,432; 5,342; 5,234','5,342; 5,234; 5,432','5,234; 5,432; 5,342'], correct:0, explain:'5,234 น้อยสุด แล้ว 5,342 แล้ว 5,432', tier:2},
      {q:'เลข 8 ในจำนวน 80,000 มีค่าเท่าไร?', emoji:'#️⃣', choices:['80,000','8,000','800','8'], correct:0, explain:'เลข 8 อยู่หลักหมื่น จึงมีค่า 80,000', tier:2},
      {q:'"หนึ่งหมื่นห้าร้อย" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['10,500','15,000','1,500','10,050'], correct:0, explain:'หนึ่งหมื่นห้าร้อย = 10,500', tier:2},
      {q:'เติมเครื่องหมายให้ถูก: 23,000 ▢ 23,100', emoji:'⚖️', choices:['<','>','=','≠'], correct:0, explain:'23,000 น้อยกว่า 23,100 จึงใช้ <', tier:2},
      {q:'จำนวนใดอยู่ระหว่าง 9,990 กับ 10,010?', emoji:'🔢', choices:['10,000','9,980','10,020','9,090'], correct:0, explain:'10,000 อยู่ระหว่าง 9,990 กับ 10,010', tier:2},
      {q:'ปัด 4,780 ให้เป็นจำนวนเต็มหลักพันได้เท่าไร?', emoji:'🎯', choices:['5,000','4,000','4,800','4,700'], correct:0, explain:'4,780 ใกล้ 5,000 มากกว่า จึงปัดเป็น 5,000', tier:2},
      {q:'นับทีละ 10,000: 20,000, 30,000, 40,000, ▢', emoji:'💯', choices:['50,000','41,000','45,000','60,000'], correct:0, explain:'นับเพิ่มทีละ 10,000 ตัวต่อไปคือ 50,000', tier:2},
      {q:'เรียงจากมากไปน้อยข้อใดถูกต้อง?', emoji:'📉', choices:['66,000; 60,600; 6,600','6,600; 60,600; 66,000','60,600; 66,000; 6,600','66,000; 6,600; 60,600'], correct:0, explain:'66,000 มากสุด แล้ว 60,600 แล้ว 6,600', tier:2},
      {q:'เลข 34,567 มีเลขในหลักหมื่นคือเลขใด?', emoji:'#️⃣', choices:['3','4','5','7'], correct:0, explain:'เลข 3 อยู่หลักหมื่น', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: จำนวนเกินแสน (6-7 หลัก) */
      {q:'เลข 250,000 อ่านว่าอย่างไร?', emoji:'💯', choices:['สองแสนห้าหมื่น','สองหมื่นห้าพัน','สองแสนห้าพัน','สองล้านห้าแสน'], correct:0, explain:'250,000 = สองแสนห้าหมื่น', tier:3},
      {q:'"สามแสน" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['300,000','30,000','3,000,000','3,000'], correct:0, explain:'สามแสน = 300,000', tier:3},
      {q:'จำนวน 1,000,000 (หนึ่งล้าน) มีกี่หลัก?', emoji:'#️⃣', choices:['7 หลัก','6 หลัก','5 หลัก','8 หลัก'], correct:0, explain:'หนึ่งล้านมี 7 หลัก', tier:3},
      {q:'เลข 456,789 มีเลขในหลักแสนคือเลขใด?', emoji:'📊', choices:['4','5','6','7'], correct:0, explain:'เลข 4 อยู่หลักแสน', tier:3},
      {q:'จำนวนใดมากที่สุด?', emoji:'📈', choices:['520,000','98,000','452,000','99,999'], correct:0, explain:'520,000 มากที่สุด (ห้าแสนสองหมื่น)', tier:3}
    ]
  },
  {
    id:'p3-math2', name:'คณิต ป.3 · บวก ลบ ระคน', emoji:'🧾', icon:'assets/icons/p3-math2.svg', color:'#5E3FE0', light:'#E9E3FF', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — บวก-ลบหลักพันแบบง่าย + โจทย์ปัญหา 1 ขั้น */
      {q:'1,250 + 300 = ?', emoji:'➕', choices:['1,550','1,250','1,520','1,850'], correct:0, explain:'1,250 บวก 300 เท่ากับ 1,550', tier:1},
      {q:'2,400 - 200 = ?', emoji:'➖', choices:['2,200','2,600','2,000','2,220'], correct:0, explain:'2,400 ลบ 200 เท่ากับ 2,200', tier:1},
      {q:'3,120 + 450 = ?', emoji:'➕', choices:['3,570','3,170','3,520','3,560'], correct:0, explain:'3,120 บวก 450 เท่ากับ 3,570', tier:1},
      {q:'มีเงินเก็บ 500 บาท ได้เพิ่มอีก 250 บาท รวมกี่บาท?', emoji:'💰', choices:['750','700','800','250'], correct:0, explain:'500 + 250 = 750 บาท', tier:1},
      {q:'4,000 - 1,500 = ?', emoji:'➖', choices:['2,500','2,000','3,500','1,500'], correct:0, explain:'4,000 ลบ 1,500 เท่ากับ 2,500', tier:1},
      {q:'1,340 + 260 = ?', emoji:'➕', choices:['1,600','1,500','1,660','1,400'], correct:0, explain:'1,340 บวก 260 เท่ากับ 1,600', tier:1},
      {q:'มีสติกเกอร์ 320 ดวง ใช้ไป 120 ดวง เหลือกี่ดวง?', emoji:'✨', choices:['200','240','180','300'], correct:0, explain:'320 - 120 = 200 ดวง', tier:1},
      {q:'640 + 280 = ? (มีการทด)', emoji:'➕', choices:['920','820','900','940'], correct:0, explain:'640 บวก 280 เท่ากับ 920', tier:1},
      {q:'900 - 350 = ?', emoji:'➖', choices:['550','650','450','560'], correct:0, explain:'900 ลบ 350 เท่ากับ 550', tier:1},
      /* tier2 — บวก-ลบมีทดหลายหลัก + โจทย์ปัญหา 2 ขั้น + เครื่องหมาย */
      {q:'1,456 + 1,278 = ?', emoji:'➕', choices:['2,734','2,634','2,744','2,724'], correct:0, explain:'1,456 บวก 1,278 เท่ากับ 2,734', tier:2},
      {q:'3,205 - 1,148 = ?', emoji:'➖', choices:['2,057','2,157','1,957','2,067'], correct:0, explain:'3,205 ลบ 1,148 เท่ากับ 2,057', tier:2},
      {q:'มีเงิน 1,000 บาท ซื้อของ 350 บาท และ 275 บาท เหลือกี่บาท?', emoji:'🛒', choices:['375','325','475','625'], correct:0, explain:'1,000 - 350 - 275 = 375 บาท', tier:2},
      {q:'2,470 + 1,750 = ?', emoji:'➕', choices:['4,220','4,120','4,210','4,320'], correct:0, explain:'2,470 บวก 1,750 เท่ากับ 4,220', tier:2},
      {q:'เติมเครื่องหมายให้ถูก: 1,200 + 500 ▢ 1,800', emoji:'⚖️', choices:['<','>','=','≠'], correct:0, explain:'1,200 + 500 = 1,700 ซึ่งน้อยกว่า 1,800 จึงใช้ <', tier:2},
      {q:'ร้านมีนม 450 ขวด ขายไป 180 ขวด เติมอีก 200 ขวด เหลือกี่ขวด?', emoji:'🥛', choices:['470','430','370','530'], correct:0, explain:'450 - 180 + 200 = 470 ขวด', tier:2},
      {q:'4,200 - 2,750 = ?', emoji:'➖', choices:['1,450','1,550','1,350','2,450'], correct:0, explain:'4,200 ลบ 2,750 เท่ากับ 1,450', tier:2},
      {q:'รถบัสมีผู้โดยสาร 640 คน ลง 250 คน ขึ้น 130 คน เหลือกี่คน?', emoji:'🚌', choices:['520','470','390','630'], correct:0, explain:'640 - 250 + 130 = 520 คน', tier:2},
      {q:'3,680 + 2,540 = ?', emoji:'➕', choices:['6,220','6,120','6,210','6,320'], correct:0, explain:'3,680 บวก 2,540 เท่ากับ 6,220', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: ทศนิยมเบื้องต้น (อ่าน/เปรียบเทียบ/บวก-ลบง่าย) */
      {q:'ทศนิยม 0.5 อ่านว่าอย่างไร?', emoji:'🔢', choices:['ศูนย์จุดห้า','ห้าจุดศูนย์','ศูนย์จุดห้าสิบ','ห้าสิบ'], correct:0, explain:'0.5 อ่านว่า ศูนย์จุดห้า', tier:3},
      {q:'ทศนิยม 0.7 กับ 0.5 ตัวใดมากกว่า?', emoji:'⚖️', choices:['0.7','0.5','เท่ากัน','เทียบไม่ได้'], correct:0, explain:'0.7 มากกว่า 0.5', tier:3},
      {q:'เศษหนึ่งส่วนสอง (½) เขียนเป็นทศนิยมได้เท่าไร?', emoji:'🥧', choices:['0.5','0.2','1.2','5.0'], correct:0, explain:'½ = 0.5', tier:3},
      {q:'0.3 + 0.4 = ?', emoji:'➕', choices:['0.7','0.34','0.12','7.0'], correct:0, explain:'0.3 บวก 0.4 เท่ากับ 0.7', tier:3},
      {q:'1.5 - 0.5 = ?', emoji:'➖', choices:['1.0','2.0','0.5','1.5'], correct:0, explain:'1.5 ลบ 0.5 เท่ากับ 1.0', tier:3}
    ]
  },
  {
    id:'p3-math3', name:'คณิต ป.3 · คูณ หาร', emoji:'🟰', icon:'assets/icons/p3-math3.svg', color:'#4A2FC0', light:'#E9E3FF', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — สูตรคูณแม่ 2-6 + หารแบ่งเท่าๆ กัน + โจทย์ปัญหาง่าย */
      {q:'6 × 3 = ?', emoji:'✖️', choices:['18','15','21','12'], correct:0, explain:'6 × 3 = 18', tier:1},
      {q:'7 × 2 = ?', emoji:'✖️', choices:['14','12','16','9'], correct:0, explain:'7 × 2 = 14', tier:1},
      {q:'มีถุง 4 ถุง ถุงละ 6 ลูก รวมกี่ลูก?', emoji:'🛍️', choices:['24','20','28','10'], correct:0, explain:'4 × 6 = 24 ลูก', tier:1},
      {q:'8 × 3 = ?', emoji:'✖️', choices:['24','21','27','16'], correct:0, explain:'8 × 3 = 24', tier:1},
      {q:'แบ่งขนม 15 ชิ้น ให้ 3 คนเท่าๆ กัน คนละกี่ชิ้น?', emoji:'🍪', choices:['5','4','6','3'], correct:0, explain:'15 ÷ 3 = 5 ชิ้น', tier:1},
      {q:'9 × 2 = ?', emoji:'✖️', choices:['18','16','20','11'], correct:0, explain:'9 × 2 = 18', tier:1},
      {q:'16 ÷ 4 = ?', emoji:'➗', choices:['4','3','5','6'], correct:0, explain:'16 แบ่งเป็น 4 กลุ่มเท่าๆ กัน ได้กลุ่มละ 4', tier:1},
      {q:'6 × 5 = ?', emoji:'✖️', choices:['30','25','35','24'], correct:0, explain:'6 × 5 = 30', tier:1},
      {q:'รถ 5 คัน คันละ 4 ล้อ รวมมีกี่ล้อ?', emoji:'🚗', choices:['20','16','24','9'], correct:0, explain:'5 × 4 = 20 ล้อ', tier:1},
      /* tier2 — สูตรคูณแม่สูง 7-9 + คูณสองหลัก + หารมีเศษ + โจทย์ปัญหา */
      {q:'7 × 8 = ?', emoji:'✖️', choices:['56','54','58','48'], correct:0, explain:'7 × 8 = 56', tier:2},
      {q:'9 × 6 = ?', emoji:'✖️', choices:['54','56','48','63'], correct:0, explain:'9 × 6 = 54', tier:2},
      {q:'23 × 2 = ?', emoji:'✖️', choices:['46','44','48','43'], correct:0, explain:'23 × 2 = 46', tier:2},
      {q:'45 ÷ 5 = ?', emoji:'➗', choices:['9','8','7','10'], correct:0, explain:'45 แบ่งเป็น 5 กลุ่มเท่าๆ กัน ได้กลุ่มละ 9', tier:2},
      {q:'8 × 7 = ?', emoji:'✖️', choices:['56','54','63','49'], correct:0, explain:'8 × 7 = 56', tier:2},
      {q:'มีดินสอ 48 แท่ง แบ่งใส่ 6 กล่องเท่าๆ กัน กล่องละกี่แท่ง?', emoji:'✏️', choices:['8','7','9','6'], correct:0, explain:'48 ÷ 6 = 8 แท่ง', tier:2},
      {q:'13 × 3 = ?', emoji:'✖️', choices:['39','36','33','43'], correct:0, explain:'13 × 3 = 39', tier:2},
      {q:'30 ÷ 4 ได้ผลลัพธ์เท่าไร (มีเศษ)?', emoji:'➗', choices:['7 เศษ 2','6 เศษ 2','7 เศษ 3','8 เศษ 0'], correct:0, explain:'4 × 7 = 28 เหลือเศษ 2 จึงได้ 7 เศษ 2', tier:2},
      {q:'12 × 4 = ?', emoji:'✖️', choices:['48','44','52','46'], correct:0, explain:'12 × 4 = 48', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: เศษส่วน (เศษเกิน↔จำนวนคละ, เปรียบเทียบ) + คูณสองหลัก */
      {q:'เศษเกิน 5/2 เท่ากับจำนวนคละใด?', emoji:'🥧', choices:['2½ (สองเศษหนึ่งส่วนสอง)','1½','5½','2¼'], correct:0, explain:'5 ÷ 2 = 2 เหลือเศษ 1 จึงเป็น 2½', tier:3},
      {q:'จำนวนคละ 1½ เท่ากับเศษเกินใด?', emoji:'🍕', choices:['3/2','2/3','1/2','5/2'], correct:0, explain:'1½ = 1 + ½ = 2/2 + 1/2 = 3/2', tier:3},
      {q:'เศษส่วน ½ กับ ¾ ตัวใดมากกว่า?', emoji:'⚖️', choices:['¾','½','เท่ากัน','เทียบไม่ได้'], correct:0, explain:'¾ (สามในสี่) มากกว่า ½ (สองในสี่)', tier:3},
      {q:'¼ + ¼ = ? (ตัวส่วนเท่ากัน)', emoji:'➕', choices:['2/4 (= ½)','2/8','1/4','4/4'], correct:0, explain:'บวกตัวเศษ 1+1=2 ตัวส่วนคงเดิม ได้ 2/4 = ½', tier:3},
      {q:'23 × 4 = ?', emoji:'✖️', choices:['92','86','94','82'], correct:0, explain:'23 × 4 = 92', tier:3}
    ]
  },
  {
    /* calculation engine: ar-math + mathOps ×÷ ตัวเลขใหญ่ขึ้นกว่า ป.2 (ต่อยอด calculation chain) */
    id:'p3-math-ar', name:'คิดเลขเร็ว ป.3', emoji:'🔣', icon:'assets/icons/p3-math-ar.svg', color:'#5E3FE0', light:'#E9E3FF',
    type:'ar', mode:'math', levels:10, mathTiers:[[2,9],[3,12],[6,12]], mathOps:['×','÷'], mathChoices:4, grade:'p3', isNew:true
  },
  {
    /* หมวดใหม่ "เศษส่วนแสนสนุก" — reuse fraction engine (แบ่งพิซซ่า/เค้ก) เนื้อหาแกนใหม่ของ ป.3 */
    id:'p3-fraction', name:'เศษส่วนแสนสนุก', emoji:'🥧', icon:'assets/icons/p3-fraction.svg', color:'#E1503A', light:'#FBDBD4', type:'skill', mode:'fraction', levels:10, handPlay:true, grade:'p3', isNew:true
  },

  /* ---------- Phase 3.2: ร้านค้า (reuse money engine) + วิชาภาษา/สังคม/เชาวน์ (reuse quiz engine) ---------- */
  { id:'p3-money', name:'ร้านค้าจำลอง ป.3', emoji:'💴', icon:'assets/icons/p3-money.svg', color:'#D98E2B', light:'#FBEBCB', type:'skill', mode:'money', levels:10, handPlay:true, grade:'p3', isNew:true },

  /* ---------- ภาษาไทย ป.3 (ชนิดของคำ-มาตราตัวสะกด / คำและสำนวน / อ่านจับใจความเชิงเหตุผล) ---------- */
  {
    id:'p3-thai1', name:'ภาษาไทย ป.3 · ชนิดของคำ-มาตราตัวสะกด', emoji:'📔', icon:'assets/icons/p3-thai1.svg', color:'#EF5DA8', light:'#FCE0EF', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — ชนิดของคำพื้นฐาน + มาตราตัวสะกด (ง่าย) */
      {q:'คำว่า "แมว" เป็นคำชนิดใด?', emoji:'🐱', choices:['คำนาม','คำกริยา','คำสรรพนาม','คำวิเศษณ์'], correct:0, explain:'แมว เป็นชื่อสัตว์ จึงเป็นคำนาม', tier:1},
      {q:'คำว่า "วิ่ง" เป็นคำชนิดใด?', emoji:'🏃', choices:['คำกริยา','คำนาม','คำสรรพนาม','คำวิเศษณ์'], correct:0, explain:'วิ่ง เป็นคำแสดงอาการ จึงเป็นคำกริยา', tier:1},
      {q:'คำว่า "ฉัน เธอ เขา" เป็นคำชนิดใด?', emoji:'🧑', choices:['คำสรรพนาม','คำนาม','คำกริยา','คำวิเศษณ์'], correct:0, explain:'เป็นคำใช้แทนชื่อ จึงเป็นคำสรรพนาม', tier:1},
      {q:'คำใดเป็นคำนาม?', emoji:'📔', choices:['โรงเรียน','เดิน','เร็ว','และ'], correct:0, explain:'โรงเรียน เป็นชื่อสถานที่ จึงเป็นคำนาม', tier:1},
      {q:'คำว่า "นก" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'🐦', choices:['แม่กก','แม่กน','แม่กม','แม่กง'], correct:0, explain:'นก สะกดด้วย ก จึงอยู่แม่กก', tier:1},
      {q:'คำว่า "บ้าน" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'🏠', choices:['แม่กน','แม่กก','แม่กด','แม่กบ'], correct:0, explain:'บ้าน สะกดด้วย น จึงอยู่แม่กน', tier:1},
      {q:'คำว่า "ลม" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'💨', choices:['แม่กม','แม่กง','แม่กน','แม่กก'], correct:0, explain:'ลม สะกดด้วย ม จึงอยู่แม่กม', tier:1},
      {q:'คำใดเป็นคำกริยา?', emoji:'🍽️', choices:['กิน','ปลา','สวย','เขา'], correct:0, explain:'กิน เป็นคำแสดงอาการ จึงเป็นคำกริยา', tier:1},
      {q:'คำว่า "ปลา" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'🐟', choices:['แม่ ก กา (ไม่มีตัวสะกด)','แม่กก','แม่กน','แม่กบ'], correct:0, explain:'ปลา ไม่มีตัวสะกด จึงอยู่แม่ ก กา', tier:1},
      /* tier2 — วิเคราะห์คำในประโยค + มาตราตัวสะกดยากขึ้น (ยาก) */
      {q:'"เขาอ่านหนังสือ" คำใดเป็นคำกริยา?', emoji:'📖', choices:['อ่าน','เขา','หนังสือ','ที่'], correct:0, explain:'อ่าน เป็นคำแสดงอาการ จึงเป็นคำกริยา', tier:2},
      {q:'"เด็กวิ่งเร็ว" คำว่า "เร็ว" ขยายคำใด?', emoji:'💨', choices:['วิ่ง','เด็ก','เร็ว','ที่'], correct:0, explain:'เร็ว เป็นคำวิเศษณ์ขยายกริยา "วิ่ง"', tier:2},
      {q:'คำใดเป็นคำสรรพนาม?', emoji:'🙋', choices:['ท่าน','หนังสือ','สนุก','โต๊ะ'], correct:0, explain:'ท่าน ใช้แทนชื่อบุคคล จึงเป็นคำสรรพนาม', tier:2},
      {q:'คำว่า "แก้ว" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'🥛', choices:['แม่เกอว','แม่กน','แม่กม','แม่กก'], correct:0, explain:'แก้ว สะกดด้วย ว จึงอยู่แม่เกอว', tier:2},
      {q:'คำว่า "ดอกไม้" คำว่า "ดอก" อยู่ในมาตราแม่ใด?', emoji:'🌸', choices:['แม่กก','แม่กด','แม่กบ','แม่กน'], correct:0, explain:'ดอก สะกดด้วย ก จึงอยู่แม่กก', tier:2},
      {q:'คำใดสะกดด้วยมาตราแม่กด?', emoji:'📔', choices:['มด','ลง','คน','ยำ'], correct:0, explain:'มด สะกดด้วย ด จึงอยู่แม่กด', tier:2},
      {q:'คำใดเป็นคำวิเศษณ์ (บอกลักษณะ)?', emoji:'🌈', choices:['สวย','โรงเรียน','นอน','เรา'], correct:0, explain:'สวย เป็นคำบอกลักษณะ จึงเป็นคำวิเศษณ์', tier:2},
      {q:'"น้องกินข้าว" ประโยคนี้มีคำนามกี่คำ?', emoji:'🍚', choices:['2 คำ (น้อง, ข้าว)','1 คำ','3 คำ','ไม่มี'], correct:0, explain:'น้อง และ ข้าว เป็นคำนาม รวม 2 คำ', tier:2},
      {q:'คำว่า "สนาม" อยู่ในมาตราตัวสะกดแม่ใด?', emoji:'⚽', choices:['แม่กม','แม่กน','แม่กง','แม่กก'], correct:0, explain:'สนาม สะกดด้วย ม จึงอยู่แม่กม', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: คำบุพบท/คำสันธาน/คำวิเศษณ์บอกจำนวน */
      {q:'คำใดเป็น "คำเชื่อม" (สันธาน)?', emoji:'🔗', choices:['และ','วิ่ง','สวย','โต๊ะ'], correct:0, explain:'"และ" ใช้เชื่อมคำ/ประโยค เป็นคำสันธาน', tier:3},
      {q:'"แมวอยู่ ___ โต๊ะ" ควรเติมคำบุพบทใด?', emoji:'🐱', choices:['ใต้','กิน','เร็ว','และ'], correct:0, explain:'ใต้ เป็นคำบุพบทบอกตำแหน่ง', tier:3},
      {q:'"เด็กสองคน" คำว่า "สอง" เป็นคำชนิดใด?', emoji:'🔢', choices:['คำวิเศษณ์บอกจำนวน','คำนาม','คำกริยา','คำสันธาน'], correct:0, explain:'"สอง" บอกจำนวน เป็นคำวิเศษณ์', tier:3},
      {q:'ประโยค "ฉันไปโรงเรียนเพราะอยากเก่ง" คำใดเป็นคำเชื่อมบอกเหตุผล?', emoji:'📚', choices:['เพราะ','ไป','เก่ง','ฉัน'], correct:0, explain:'"เพราะ" เชื่อมบอกเหตุผล เป็นคำสันธาน', tier:3},
      {q:'คำใดเป็นคำบุพบทบอกทิศทาง?', emoji:'➡️', choices:['ไปทาง','สวยงาม','นอน','หนังสือ'], correct:0, explain:'"ไปทาง" เป็นคำบุพบทบอกทิศทาง', tier:3}
    ]
  },
  {
    id:'p3-thai2', name:'ภาษาไทย ป.3 · คำและสำนวน', emoji:'🔖', icon:'assets/icons/p3-thai2.svg', color:'#E14E9A', light:'#FCE0EF', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — คำควบกล้ำ/อักษรนำ/คำคล้องจอง (ง่าย) */
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🔖', choices:['ปลา','ปา','ตา','นา'], correct:0, explain:'ปลา มี ป ควบกับ ล จึงเป็นคำควบกล้ำ', tier:1},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'✏️', choices:['กวาง','กาง','ขาว','คาง'], correct:0, explain:'กวาง มี ก ควบกับ ว จึงเป็นคำควบกล้ำ', tier:1},
      {q:'คำที่คล้องจองกับ "ปลา" คือคำใด?', emoji:'🐟', choices:['ตา','ปู','นก','ไก่'], correct:0, explain:'ปลา คล้องจองกับ ตา (สระอาเหมือนกัน)', tier:1},
      {q:'คำใดเป็นอักษรนำ?', emoji:'📖', choices:['หมา','มา','กา','ตา'], correct:0, explain:'หมา มี ห นำ ม จึงเป็นอักษรนำ', tier:1},
      {q:'คำที่คล้องจองกับ "ดาว" คือคำใด?', emoji:'⭐', choices:['ราว','ดิน','ฟ้า','นก'], correct:0, explain:'ดาว คล้องจองกับ ราว', tier:1},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🌊', choices:['ครับ','คับ','งับ','นับ'], correct:0, explain:'ครับ มี ค ควบกับ ร จึงเป็นคำควบกล้ำ', tier:1},
      {q:'คำใดเป็นอักษรนำ?', emoji:'🐍', choices:['หนู','นู','ดู','ปู'], correct:0, explain:'หนู มี ห นำ น จึงเป็นอักษรนำ', tier:1},
      {q:'คำที่คล้องจองกับ "แมว" คือคำใด?', emoji:'🐱', choices:['แก้ว','หมา','นก','ปลา'], correct:0, explain:'แมว คล้องจองกับ แก้ว', tier:1},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🌳', choices:['ไกว','กาว','เกา','เขา'], correct:0, explain:'ไกว มี ก ควบกับ ว จึงเป็นคำควบกล้ำ', tier:1},
      /* tier2 — สำนวน/สุภาษิต/คำตรงข้าม (ยาก) */
      {q:'สำนวน "น้ำขึ้นให้รีบตัก" หมายถึงอะไร?', emoji:'🪣', choices:['มีโอกาสให้รีบทำ','ตักน้ำใส่ตุ่ม','อาบน้ำทุกวัน','รอฝนตก'], correct:0, explain:'หมายถึง เมื่อมีโอกาสควรรีบทำ', tier:2},
      {q:'สุภาษิต "ช้าๆ ได้พร้าเล่มงาม" สอนเรื่องอะไร?', emoji:'🪚', choices:['ทำอะไรค่อยเป็นค่อยไปย่อมได้ผลดี','เดินให้ช้า','ลับมีดทุกวัน','รีบทำงาน'], correct:0, explain:'สอนว่าทำสิ่งใดอย่างรอบคอบย่อมได้ผลดี', tier:2},
      {q:'คำตรงข้ามกับ "ขยัน" คือคำใด?', emoji:'😴', choices:['ขี้เกียจ','เก่ง','ดี','เร็ว'], correct:0, explain:'ตรงข้ามกับ ขยัน คือ ขี้เกียจ', tier:2},
      {q:'สำนวน "หัวหมอ" หมายถึงคนแบบใด?', emoji:'🤓', choices:['ชอบใช้เล่ห์เหลี่ยม','เป็นหมอ','ปวดหัว','หัวโต'], correct:0, explain:'หัวหมอ หมายถึง คนเจ้าเล่ห์ ชอบเถียง', tier:2},
      {q:'คำตรงข้ามกับ "มืด" คือคำใด?', emoji:'💡', choices:['สว่าง','ดำ','เย็น','ลึก'], correct:0, explain:'ตรงข้ามกับ มืด คือ สว่าง', tier:2},
      {q:'สุภาษิต "รักวัวให้ผูก รักลูกให้ตี" สอนเรื่องอะไร?', emoji:'🐄', choices:['อบรมสั่งสอนลูกด้วยความรัก','ผูกวัวไว้','ตีลูกทุกวัน','เลี้ยงวัว'], correct:0, explain:'สอนว่าการอบรมลูกคือความรักที่แท้จริง', tier:2},
      {q:'คำใดเป็นคำที่มีความหมายเหมือน "ใหญ่"?', emoji:'🐘', choices:['โต','เล็ก','สั้น','บาง'], correct:0, explain:'โต มีความหมายเหมือน ใหญ่', tier:2},
      {q:'สำนวน "ไก่งามเพราะขน คนงามเพราะแต่ง" หมายถึงอะไร?', emoji:'🐔', choices:['การแต่งตัวช่วยให้ดูดีขึ้น','ไก่มีขนสวย','คนสวยทุกคน','เลี้ยงไก่'], correct:0, explain:'หมายถึง การแต่งกายช่วยเสริมให้ดูงามขึ้น', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: สุภาษิต/คำพังเพยยากขึ้น + ราชาศัพท์เบื้องต้น */
      {q:'สุภาษิต "น้ำน้อยย่อมแพ้ไฟ" สอนเรื่องอะไร?', emoji:'🔥', choices:['ฝ่ายที่มีกำลังน้อยย่อมสู้ฝ่ายมากไม่ได้','ดับไฟด้วยน้ำ','น้ำมีน้อย','อย่าจุดไฟ'], correct:0, explain:'ฝ่ายที่อ่อนแอ/น้อยกว่าย่อมสู้ฝ่ายที่แข็งแรงกว่าไม่ได้', tier:3},
      {q:'สำนวน "ชักใบให้เรือเสีย" หมายถึงอะไร?', emoji:'⛵', choices:['พูดหรือทำให้เรื่องออกนอกทาง','แล่นเรือเก่ง','ซ่อมเรือ','เย็บใบเรือ'], correct:0, explain:'หมายถึง พูดแทรกหรือทำให้เรื่องที่กำลังคุยกันเขวออกนอกทาง', tier:3},
      {q:'คำพังเพย "ตำน้ำพริกละลายแม่น้ำ" หมายถึงอะไร?', emoji:'🌊', choices:['ลงทุนลงแรงไปโดยเปล่าประโยชน์','ทำอาหารอร่อย','ว่ายน้ำเก่ง','ตำน้ำพริก'], correct:0, explain:'ใช้จ่ายหรือลงแรงมากแต่ไม่ได้ผล', tier:3},
      {q:'คำพังเพย "น้ำท่วมปาก" หมายถึงอะไร?', emoji:'🤐', choices:['รู้เรื่องแต่พูดไม่ได้เพราะลำบากใจ','ดื่มน้ำมากเกินไป','น้ำท่วมบ้าน','พูดมากเกินไป'], correct:0, explain:'หมายถึง รู้เรื่องแต่พูดออกไปไม่ได้เพราะเกรงใจหรือลำบากใจ', tier:3},
      {q:'สำนวน "ขี่ช้างจับตั๊กแตน" หมายถึงอะไร?', emoji:'🐘', choices:['ลงทุนมากเพื่อผลเล็กน้อย','จับแมลง','เลี้ยงช้าง','ทำงานใหญ่'], correct:0, explain:'ลงทุน/ลงแรงมากเกินไปเพื่อสิ่งเล็กน้อย', tier:3}
    ]
  },
  {
    id:'p3-thai3', name:'ภาษาไทย ป.3 · อ่านจับใจความ', emoji:'🗨️', icon:'assets/icons/p3-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — อ่านเรื่องสั้นแล้วตอบ (ง่าย) */
      {q:'"น้องแมวชอบนอนกลางแดด" น้องแมวชอบนอนที่ไหน?', emoji:'🐱', choices:['กลางแดด','ในตู้เย็น','บนต้นไม้','ใต้ดิน'], correct:0, explain:'เรื่องบอกว่าน้องแมวชอบนอนกลางแดด', tier:1},
      {q:'"ฝนตกหนัก ถนนจึงลื่น" เพราะอะไรถนนจึงลื่น?', emoji:'🌧️', choices:['ฝนตกหนัก','แดดออก','ลมแรง','รถเยอะ'], correct:0, explain:'เรื่องบอกเหตุว่าฝนตกหนัก ถนนจึงลื่น', tier:1},
      {q:'"ต้นไม้ให้ร่มเงาและอากาศบริสุทธิ์" ต้นไม้ให้อะไรกับเรา?', emoji:'🌳', choices:['ร่มเงาและอากาศบริสุทธิ์','เงินทอง','ของเล่น','เสื้อผ้า'], correct:0, explain:'เรื่องบอกว่าต้นไม้ให้ร่มเงาและอากาศบริสุทธิ์', tier:1},
      {q:'"เด็กดีตื่นเช้าไปโรงเรียน" เด็กดีตื่นเวลาใด?', emoji:'🌅', choices:['เช้า','ดึก','เที่ยง','บ่าย'], correct:0, explain:'เรื่องบอกว่าเด็กดีตื่นเช้า', tier:1},
      {q:'"ผึ้งเก็บน้ำหวานจากดอกไม้" ผึ้งเก็บอะไร?', emoji:'🐝', choices:['น้ำหวาน','ใบไม้','ก้อนหิน','เมล็ดพืช'], correct:0, explain:'เรื่องบอกว่าผึ้งเก็บน้ำหวาน', tier:1},
      {q:'"พี่ช่วยแม่ล้างจานทุกวัน" พี่ช่วยแม่ทำอะไร?', emoji:'🍽️', choices:['ล้างจาน','กวาดบ้าน','รดน้ำต้นไม้','ซักผ้า'], correct:0, explain:'เรื่องบอกว่าพี่ช่วยแม่ล้างจาน', tier:1},
      {q:'"กบร้องเมื่อฝนจะตก" กบร้องตอนไหน?', emoji:'🐸', choices:['เมื่อฝนจะตก','ตอนแดดจัด','ตอนหิมะตก','ตอนลมแรง'], correct:0, explain:'เรื่องบอกว่ากบร้องเมื่อฝนจะตก', tier:1},
      {q:'"ดวงอาทิตย์ขึ้นทางทิศตะวันออก" ดวงอาทิตย์ขึ้นทางทิศใด?', emoji:'☀️', choices:['ตะวันออก','ตะวันตก','เหนือ','ใต้'], correct:0, explain:'เรื่องบอกว่าดวงอาทิตย์ขึ้นทางทิศตะวันออก', tier:1},
      {q:'"หนูนากอดแม่ก่อนนอนทุกคืน" หนูนากอดแม่ตอนไหน?', emoji:'🛏️', choices:['ก่อนนอน','ตอนเช้า','ตอนกินข้าว','ตอนไปโรงเรียน'], correct:0, explain:'เรื่องบอกว่าหนูนากอดแม่ก่อนนอน', tier:1},
      /* tier2 — จับใจความ/ข้อคิด/แยกข้อเท็จจริง-ความเห็น (ยาก) */
      {q:'"มดตัวเล็กแต่ช่วยกันขนอาหารได้มาก" เรื่องนี้สอนเรื่องอะไร?', emoji:'🐜', choices:['ความสามัคคี','ความสะอาด','การออม','ความซื่อสัตย์'], correct:0, explain:'มดช่วยกันทำงาน เป็นการสอนเรื่องความสามัคคี', tier:2},
      {q:'ข้อใดเป็น "ข้อเท็จจริง"?', emoji:'💬', choices:['น้ำเดือดที่อุณหภูมิ 100 องศา','ส้มอร่อยที่สุด','สีฟ้าสวยกว่าสีแดง','หนังเรื่องนี้สนุกมาก'], correct:0, explain:'น้ำเดือดที่ 100 องศา เป็นความจริงที่พิสูจน์ได้ จึงเป็นข้อเท็จจริง', tier:2},
      {q:'ข้อใดเป็น "ข้อคิดเห็น"?', emoji:'💭', choices:['ขนมนี้อร่อยที่สุดในโลก','แมวมี 4 ขา','1 สัปดาห์มี 7 วัน','ปลาอยู่ในน้ำ'], correct:0, explain:'"อร่อยที่สุด" เป็นความรู้สึกของแต่ละคน จึงเป็นข้อคิดเห็น', tier:2},
      {q:'"เพราะขยันอ่านหนังสือ ต้นจึงสอบได้ที่หนึ่ง" อะไรคือเหตุ?', emoji:'📚', choices:['ขยันอ่านหนังสือ','สอบได้ที่หนึ่ง','ไปโรงเรียน','กินข้าวเช้า'], correct:0, explain:'เหตุคือ ขยันอ่านหนังสือ ผลคือ สอบได้ที่หนึ่ง', tier:2},
      {q:'"เต่าเดินช้าแต่ไม่ยอมแพ้จนชนะกระต่าย" เรื่องนี้สอนอะไร?', emoji:'🐢', choices:['ความเพียรพยายามนำไปสู่ความสำเร็จ','เต่าเดินเร็ว','กระต่ายขี้เกียจกิน','อย่าวิ่งแข่ง'], correct:0, explain:'เต่าไม่ยอมแพ้จนชนะ สอนเรื่องความเพียร', tier:2},
      {q:'ข้อใดเป็น "ข้อเท็จจริง"?', emoji:'🌍', choices:['โลกหมุนรอบดวงอาทิตย์','ฤดูหนาวน่าอยู่ที่สุด','ทะเลสวยกว่าภูเขา','อากาศวันนี้ดีจัง'], correct:0, explain:'โลกหมุนรอบดวงอาทิตย์ เป็นความจริงทางวิทยาศาสตร์', tier:2},
      {q:'"ควรแบ่งขนมให้เพื่อนที่ไม่มี" เรื่องนี้สอนเรื่องอะไร?', emoji:'🍪', choices:['ความมีน้ำใจแบ่งปัน','การประหยัด','ความตรงต่อเวลา','ความสะอาด'], correct:0, explain:'การแบ่งขนมให้เพื่อน สอนเรื่องความมีน้ำใจ', tier:2},
      {q:'"ปิดไฟเมื่อไม่ใช้ ช่วยประหยัดพลังงาน" ผลของการปิดไฟคืออะไร?', emoji:'💡', choices:['ประหยัดพลังงาน','ห้องมืด','ไฟเสีย','ค่าไฟเพิ่ม'], correct:0, explain:'เรื่องบอกว่าปิดไฟช่วยประหยัดพลังงาน', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: จับใจความเชิงเหตุผล/ข้อคิด/คาดคะเน */
      {q:'"เมฆดำครึ้มทั่วท้องฟ้า ลมเริ่มพัดแรง" น่าจะเกิดอะไรขึ้นต่อไป?', emoji:'🌧️', choices:['ฝนกำลังจะตก','แดดออกจ้า','หิมะตก','ท้องฟ้าใส'], correct:0, explain:'เมฆดำ+ลมแรง เป็นสัญญาณว่าฝนกำลังจะตก (การคาดคะเน)', tier:3},
      {q:'"มดง่ามเก็บอาหารตุนไว้ในหน้าฝน" เรื่องนี้ให้ข้อคิดใด?', emoji:'🐜', choices:['ควรเตรียมพร้อมและรู้จักออม','มดชอบกินอาหาร','ฝนตกทุกวัน','อย่าเก็บอาหาร'], correct:0, explain:'การตุนอาหารไว้ล่วงหน้าสอนเรื่องการเตรียมพร้อมและการออม', tier:3},
      {q:'ข้อใดเป็น "ข้อคิดเห็น" ไม่ใช่ข้อเท็จจริง?', emoji:'💭', choices:['หนังสือเล่มนี้สนุกที่สุด','หนังสือมี 50 หน้า','ปกหนังสือสีฟ้า','หนังสือหนัก 200 กรัม'], correct:0, explain:'"สนุกที่สุด" เป็นความรู้สึกของแต่ละคน จึงเป็นข้อคิดเห็น', tier:3},
      {q:'"เพราะฝนตกหนักติดต่อกันหลายวัน น้ำในแม่น้ำจึงเอ่อล้น" อะไรคือผล?', emoji:'🌊', choices:['น้ำในแม่น้ำเอ่อล้น','ฝนตกหนัก','อากาศเย็น','ท้องฟ้ามืด'], correct:0, explain:'เหตุคือฝนตกหนัก ผลคือน้ำเอ่อล้น', tier:3},
      {q:'"ทุกคนช่วยกันเก็บขยะจนชายหาดสะอาด" เรื่องนี้แสดงถึงคุณค่าใด?', emoji:'🏖️', choices:['ความร่วมมือร่วมใจ','ความเห็นแก่ตัว','ความขี้เกียจ','การแข่งขัน'], correct:0, explain:'ทุกคนช่วยกันแสดงถึงความร่วมมือร่วมใจ (สามัคคี)', tier:3}
    ]
  },

  {
    /* AR ป.3 — ต่อประโยคไทยยาว 4-6 คำ (sentenceLens ทำให้ยากกว่า ป.1-2 ที่ใช้ 3-4-5 คำ) */
    id:'p3-thai-sentence', name:'ภาษาไทย ป.3 · ต่อประโยคยาว', emoji:'📃', icon:'assets/icons/p3-thai-sentence.svg', color:'#D63D8C', light:'#FCE0EF',
    type:'ar', lang:'th', sentenceLens:[4,5,6], levels:10, grade:'p3', isNew:true
  },

  /* ---------- English ป.3 (คำศัพท์เดือน-อากาศ / ไวยากรณ์ประโยค / อ่านเรื่องสั้น) ---------- */
  {
    id:'p3-eng1', name:'English ป.3 · Months & Weather', emoji:'🗺️', icon:'assets/icons/p3-eng1.svg', color:'#0FB5AE', light:'#D5F5F2', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — คำศัพท์เดือน/วัน/อากาศ (ง่าย) */
      {q:'"มกราคม" ภาษาอังกฤษคือคำใด?', emoji:'🗓️', choices:['January','June','July','March'], correct:0, explain:'มกราคม = January', tier:1},
      {q:'"hot" แปลว่าอะไร?', emoji:'🌡️', choices:['ร้อน','หนาว','ฝนตก','มีลม'], correct:0, explain:'hot แปลว่า ร้อน', tier:1},
      {q:'"Sunday" คือวันอะไร?', emoji:'📅', choices:['วันอาทิตย์','วันจันทร์','วันเสาร์','วันศุกร์'], correct:0, explain:'Sunday = วันอาทิตย์', tier:1},
      {q:'"cold" แปลว่าอะไร?', emoji:'🥶', choices:['หนาว','ร้อน','มีเมฆ','มีแดด'], correct:0, explain:'cold แปลว่า หนาว', tier:1},
      {q:'"December" คือเดือนอะไร?', emoji:'🎄', choices:['ธันวาคม','ตุลาคม','กันยายน','สิงหาคม'], correct:0, explain:'December = ธันวาคม', tier:1},
      {q:'"rainy" แปลว่าอากาศแบบใด?', emoji:'🌧️', choices:['ฝนตก','แดดออก','ลมแรง','หิมะตก'], correct:0, explain:'rainy แปลว่า ฝนตก / มีฝน', tier:1},
      {q:'"Monday" คือวันอะไร?', emoji:'📅', choices:['วันจันทร์','วันอังคาร','วันพุธ','วันอาทิตย์'], correct:0, explain:'Monday = วันจันทร์', tier:1},
      {q:'"summer" คือฤดูอะไร?', emoji:'🏖️', choices:['ฤดูร้อน','ฤดูหนาว','ฤดูฝน','ฤดูใบไม้ร่วง'], correct:0, explain:'summer = ฤดูร้อน', tier:1},
      {q:'"windy" แปลว่าอากาศแบบใด?', emoji:'💨', choices:['มีลม','ร้อน','ฝนตก','มีแดด'], correct:0, explain:'windy แปลว่า มีลม', tier:1},
      /* tier2 — เรียงเดือน/วัน + ประโยคบอกอากาศ (ยาก) */
      {q:'What month comes after April?', emoji:'🗓️', choices:['May','March','June','August'], correct:0, explain:'หลังเดือน April (เมษายน) คือ May (พฤษภาคม)', tier:2},
      {q:'It is ___ today. (มีแดด)', emoji:'☀️', choices:['sunny','rainy','snowy','windy'], correct:0, explain:'มีแดด = sunny', tier:2},
      {q:'What day comes after Wednesday?', emoji:'📅', choices:['Thursday','Tuesday','Friday','Monday'], correct:0, explain:'หลัง Wednesday (พุธ) คือ Thursday (พฤหัส)', tier:2},
      {q:'How is the weather? It is ___ (หิมะตก)', emoji:'❄️', choices:['snowy','sunny','hot','dry'], correct:0, explain:'หิมะตก = snowy', tier:2},
      {q:'"winter" คือฤดูอะไร?', emoji:'⛄', choices:['ฤดูหนาว','ฤดูร้อน','ฤดูฝน','ฤดูใบไม้ผลิ'], correct:0, explain:'winter = ฤดูหนาว', tier:2},
      {q:'"July" เป็นเดือนที่เท่าไรของปี?', emoji:'🗓️', choices:['เดือนที่ 7','เดือนที่ 6','เดือนที่ 8','เดือนที่ 9'], correct:0, explain:'July คือเดือนกรกฎาคม เดือนที่ 7', tier:2},
      {q:'"cloudy" แปลว่าอากาศแบบใด?', emoji:'☁️', choices:['มีเมฆมาก','ท้องฟ้าใส','ฝนตกหนัก','ลมแรง'], correct:0, explain:'cloudy แปลว่า มีเมฆมาก', tier:2},
      {q:'March, April, ___ , June', emoji:'🗓️', choices:['May','July','February','August'], correct:0, explain:'ลำดับเดือนคือ March, April, May, June', tier:2},
      {q:'"rainy season" คือฤดูอะไรในไทย?', emoji:'🌧️', choices:['ฤดูฝน','ฤดูร้อน','ฤดูหนาว','ฤดูใบไม้ผลิ'], correct:0, explain:'rainy season = ฤดูฝน', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: เดือน/ฤดูขั้นสูง (ลำดับ, spring/autumn) */
      {q:'How many months are there in a year?', emoji:'🗓️', choices:['twelve','ten','seven','thirty'], correct:0, explain:'1 ปีมี 12 เดือน = twelve', tier:3},
      {q:'What is the first month of the year?', emoji:'📅', choices:['January','December','March','June'], correct:0, explain:'เดือนแรกของปีคือ January (มกราคม)', tier:3},
      {q:'What month comes before December?', emoji:'🗓️', choices:['November','October','January','August'], correct:0, explain:'ก่อน December คือ November (พฤศจิกายน)', tier:3},
      {q:'"spring" คือฤดูอะไร?', emoji:'🌸', choices:['ฤดูใบไม้ผลิ','ฤดูหนาว','ฤดูร้อน','ฤดูใบไม้ร่วง'], correct:0, explain:'spring = ฤดูใบไม้ผลิ', tier:3},
      {q:'"autumn" (fall) คือฤดูอะไร?', emoji:'🍂', choices:['ฤดูใบไม้ร่วง','ฤดูใบไม้ผลิ','ฤดูฝน','ฤดูร้อน'], correct:0, explain:'autumn/fall = ฤดูใบไม้ร่วง', tier:3}
    ]
  },
  {
    id:'p3-eng2', name:'English ป.3 · Grammar & Sentences', emoji:'🅱️', icon:'assets/icons/p3-eng2.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — this/that, a/an, plural, be (ง่าย) */
      {q:'___ is a cat. (ชี้ของที่อยู่ใกล้)', emoji:'🐱', choices:['This','Those','Them','Are'], correct:0, explain:'ของใกล้ตัว 1 สิ่ง ใช้ This', tier:1},
      {q:'She is ___ girl.', emoji:'👧', choices:['a','an','are','the two'], correct:0, explain:'girl ขึ้นต้นด้วยเสียงพยัญชนะ ใช้ a', tier:1},
      {q:'This is ___ egg. (สระ)', emoji:'🥚', choices:['an','a','two','some'], correct:0, explain:'egg ขึ้นต้นด้วยเสียงสระ ใช้ an', tier:1},
      {q:'One book, two ___.', emoji:'📚', choices:['books','book','bookes','a book'], correct:0, explain:'พหูพจน์ของ book คือ books', tier:1},
      {q:'They ___ happy.', emoji:'😄', choices:['are','is','am','be'], correct:0, explain:'They ใช้กับ are', tier:1},
      {q:'I ___ a student.', emoji:'🧒', choices:['am','is','are','be'], correct:0, explain:'I ใช้กับ am', tier:1},
      {q:'___ are books. (ชี้ของหลายสิ่งที่อยู่ใกล้)', emoji:'📚', choices:['These','This','It','A'], correct:0, explain:'ของใกล้ตัวหลายสิ่ง ใช้ These', tier:1},
      {q:'He ___ football.', emoji:'⚽', choices:['plays','play','playing','played'], correct:0, explain:'ประธาน He เติม s ที่กริยา จึงเป็น plays', tier:1},
      {q:'พหูพจน์ของ "child" คือคำใด?', emoji:'🧒', choices:['children','childs','childes','child'], correct:0, explain:'child เป็นพหูพจน์แบบพิเศษ คือ children', tier:1},
      /* tier2 — present simple ผันตามประธาน + Or-question + irregular plural (ยาก) */
      {q:'He ___ ice cream. (like)', emoji:'🍦', choices:['likes','like','liking','liked'], correct:0, explain:'ประธาน He ใช้ likes (เติม s)', tier:2},
      {q:'I have two ___ . (foot)', emoji:'🦶', choices:['feet','foots','foot','feets'], correct:0, explain:'พหูพจน์ของ foot คือ feet', tier:2},
      {q:'___ that a dog or a cat?', emoji:'🐶', choices:['Is','Are','Am','Do'], correct:0, explain:'ประธานเอกพจน์ that ใช้ Is นำหน้าคำถาม', tier:2},
      {q:'She ___ to school every day. (go)', emoji:'🏫', choices:['goes','go','going','gone'], correct:0, explain:'ประธาน She ใช้ goes', tier:2},
      {q:'___ you like milk? — Yes, I do.', emoji:'🥛', choices:['Do','Does','Are','Is'], correct:0, explain:'ประธาน you ใช้ Do ในประโยคคำถาม', tier:2},
      {q:'My mom ___ rice. (cook)', emoji:'🍚', choices:['cooks','cook','cooking','cooked'], correct:0, explain:'ประธานเอกพจน์ mom ใช้ cooks', tier:2},
      {q:'There ___ three cats on the mat.', emoji:'🐱', choices:['are','is','am','be'], correct:0, explain:'three cats เป็นพหูพจน์ ใช้ are', tier:2},
      {q:'This is ___ umbrella. (สระ)', emoji:'☂️', choices:['an','a','the two','some'], correct:0, explain:'umbrella ขึ้นต้นด้วยเสียงสระ ใช้ an', tier:2},
      {q:'พหูพจน์ของ "mouse" คือคำใด?', emoji:'🐭', choices:['mice','mouses','mouse','mices'], correct:0, explain:'พหูพจน์ของ mouse คือ mice', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: present simple ผันตามประธาน (es/y→ies) + irregular plural */
      {q:'He ___ TV every evening. (watch)', emoji:'📺', choices:['watches','watch','watching','watched'], correct:0, explain:'ประธาน He + กริยาลงท้าย ch เติม es = watches', tier:3},
      {q:'She ___ English at school. (study)', emoji:'📚', choices:['studies','studys','study','studying'], correct:0, explain:'study ลงท้าย y เปลี่ยนเป็น ies = studies', tier:3},
      {q:'My father ___ a big car. (have)', emoji:'🚗', choices:['has','have','haves','having'], correct:0, explain:'ประธานเอกพจน์ใช้ has', tier:3},
      {q:'___ she like ice cream?', emoji:'🍦', choices:['Does','Do','Is','Are'], correct:0, explain:'ประธานเอกพจน์ she ใช้ Does ในคำถาม', tier:3},
      {q:'พหูพจน์ของ "tooth" คือคำใด?', emoji:'🦷', choices:['teeth','tooths','tooth','teeths'], correct:0, explain:'พหูพจน์ของ tooth คือ teeth', tier:3}
    ]
  },
  {
    id:'p3-eng3', name:'English ป.3 · Reading', emoji:'🎏', icon:'assets/icons/p3-eng3.svg', color:'#0A7A75', light:'#D5F5F2', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — อ่านประโยคสั้นแล้วตอบ + First/Then (ง่าย) */
      {q:'Tom has a red ball. What color is the ball?', emoji:'🔴', choices:['red','blue','green','yellow'], correct:0, explain:'ประโยคบอกว่า a red ball สีแดง', tier:1},
      {q:'First, wash your hands. Then, ___ .', emoji:'🍽️', choices:['eat','sleep','run','sing'], correct:0, explain:'ล้างมือก่อนแล้วจึงกิน (eat)', tier:1},
      {q:'Is this a pen or a pencil? (ในภาพเป็นดินสอ)', emoji:'✏️', choices:['a pencil','a pen','a book','a bag'], correct:0, explain:'ในภาพเป็นดินสอ ตอบ a pencil', tier:1},
      {q:'A dog says ___ .', emoji:'🐶', choices:['woof','meow','moo','quack'], correct:0, explain:'เสียงหมาคือ woof', tier:1},
      {q:'The sun is in the ___ .', emoji:'☀️', choices:['sky','sea','box','bag'], correct:0, explain:'ดวงอาทิตย์อยู่บนท้องฟ้า (sky)', tier:1},
      {q:'Nan likes cats. Does Nan like cats?', emoji:'🐱', choices:['Yes','No','Maybe','Never'], correct:0, explain:'ประโยคบอกว่า Nan ชอบแมว ตอบ Yes', tier:1},
      {q:'An apple is a ___ .', emoji:'🍎', choices:['fruit','animal','car','color'], correct:0, explain:'แอปเปิลเป็นผลไม้ (fruit)', tier:1},
      {q:'We go to school by ___ . (รถบัส)', emoji:'🚌', choices:['bus','plane','boat','train'], correct:0, explain:'รถบัส = bus', tier:1},
      {q:'Birds can ___ .', emoji:'🐦', choices:['fly','swim','dig','read'], correct:0, explain:'นกบินได้ (fly)', tier:1},
      /* tier2 — อ่านเรื่องแล้วตอบเชิงจับใจความ + ลำดับขั้นตอน (ยาก) */
      {q:'Ann is 8 years old. How old is Ann?', emoji:'🎂', choices:['8','7','9','10'], correct:0, explain:'ประโยคบอกว่า Ann อายุ 8 ปี', tier:2},
      {q:'First, mix the eggs. ___ , cook them.', emoji:'🍳', choices:['Then','First','Ball','Red'], correct:0, explain:'ลำดับขั้นตอน ใช้ Then (จากนั้น)', tier:2},
      {q:'The cat is on the mat. Where is the cat?', emoji:'🐱', choices:['on the mat','under the bed','in the box','on the tree'], correct:0, explain:'ประโยคบอกว่าแมวอยู่บนเสื่อ (on the mat)', tier:2},
      {q:'Ben has 3 pens and 2 pencils. How many pens?', emoji:'🖊️', choices:['3','2','5','1'], correct:0, explain:'Ben มีปากกา 3 ด้าม (3 pens)', tier:2},
      {q:'A cow gives us ___ .', emoji:'🐄', choices:['milk','eggs','wool','honey'], correct:0, explain:'วัวให้นม (milk)', tier:2},
      {q:'A frog can jump. Can a frog jump?', emoji:'🐸', choices:['Yes, it can','No, it cannot','It can fly','It can read'], correct:0, explain:'กบกระโดดได้ ตอบ Yes, it can', tier:2},
      {q:'In the morning we say ___ .', emoji:'🌅', choices:['Good morning','Good night','Goodbye','Thank you'], correct:0, explain:'ตอนเช้าทักทายว่า Good morning', tier:2},
      {q:'"Finally" ใช้บอกลำดับใด?', emoji:'🏁', choices:['สุดท้าย','อันแรก','ตรงกลาง','ก่อนหน้า'], correct:0, explain:'Finally แปลว่า สุดท้าย / ในที่สุด', tier:2},
      {q:'Sara has a dog. The dog is big. Is the dog big?', emoji:'🐕', choices:['Yes, it is','No, it is not','It is small','It is a cat'], correct:0, explain:'ประโยคบอกว่าหมาตัวใหญ่ ตอบ Yes, it is', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: ลำดับขั้นตอน First/Then/Finally + อ่านจับใจความยาวขึ้น */
      {q:'First, wake up. Then, brush your teeth. ___, eat breakfast.', emoji:'🍳', choices:['Finally','First','Then again','Never'], correct:0, explain:'ขั้นตอนสุดท้ายใช้ Finally', tier:3},
      {q:'Ben goes to school from Monday to Friday. Does Ben go to school on Sunday?', emoji:'🏫', choices:['No, he does not','Yes, he does','Every day','On Sunday only'], correct:0, explain:'Ben ไปโรงเรียนจันทร์-ศุกร์ ไม่ไปวันอาทิตย์', tier:3},
      {q:'A week has seven days. How many days are there in two weeks?', emoji:'📅', choices:['fourteen','seven','ten','twelve'], correct:0, explain:'7 × 2 = 14 = fourteen', tier:3},
      {q:'Order the steps: First → Then → ___ ?', emoji:'🔢', choices:['Finally','Yesterday','Because','And'], correct:0, explain:'ลำดับคือ First → Then → Finally', tier:3},
      {q:'Mom makes a cake. First she mixes eggs and flour. What does she mix?', emoji:'🎂', choices:['eggs and flour','rice and fish','water only','sugar and salt'], correct:0, explain:'ประโยคบอกว่าผสม eggs and flour (ไข่กับแป้ง)', tier:3}
    ]
  },

  {
    /* AR ป.3 — English sentence builder 4-6 words */
    id:'p3-eng-sentence', name:'English ป.3 · ต่อประโยคยาว', emoji:'🖊️', icon:'assets/icons/p3-eng-sentence.svg', color:'#0A7A75', light:'#D5F5F2',
    type:'ar', lang:'en', sentenceLens:[4,5,6], levels:10, grade:'p3', isNew:true
  },
  {
    /* AR ป.3 — โยงเส้นคำอังกฤษกับรูป (ป.1/ป.2 เป็นภาษาไทย ป.3 ต่อยอดเป็นอังกฤษ) */
    id:'p3-eng-match', name:'English ป.3 · โยงเส้นคำ-รูป', emoji:'🗂️', icon:'assets/icons/p3-eng-match.svg', color:'#0A8F89', light:'#D5F5F2',
    type:'ar', mode:'match', lang:'en', levels:10, grade:'p3', isNew:true
  },

  /* ---------- สังคมศึกษา ป.3 (หน้าที่พลเมือง-ชุมชน / สิทธิ-หน้าที่-การอยู่ร่วมกัน) ---------- */
  {
    id:'p3-social1', name:'สังคม ป.3 · ชุมชนและหน้าที่', emoji:'🏙️', icon:'assets/icons/p3-social1.svg', color:'#F6A609', light:'#FEEFC9', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — บทบาทในชุมชน/ความปลอดภัย/มารยาท (ง่าย) */
      {q:'สมาชิกในชุมชนควรปฏิบัติต่อกันอย่างไร?', emoji:'🤝', choices:['ช่วยเหลือกัน','แข่งกัน','ไม่สนใจกัน','ทะเลาะกัน'], correct:0, explain:'อยู่ร่วมกันควรช่วยเหลือกัน', tier:1},
      {q:'ใครมีหน้าที่ดูแลความปลอดภัยในชุมชน?', emoji:'👮', choices:['ตำรวจ','พ่อครัว','นักร้อง','ช่างตัดผม'], correct:0, explain:'ตำรวจมีหน้าที่ดูแลความปลอดภัย', tier:1},
      {q:'โรงพยาบาลในชุมชนมีหน้าที่อะไร?', emoji:'🏥', choices:['รักษาคนป่วย','ขายของ','สอนหนังสือ','ซ่อมรถ'], correct:0, explain:'โรงพยาบาลมีหน้าที่รักษาคนป่วย', tier:1},
      {q:'เมื่อข้ามถนนควรทำอย่างไร?', emoji:'🚸', choices:['ข้ามทางม้าลายและดูรถ','วิ่งข้ามตรงไหนก็ได้','หลับตาข้าม','ข้ามตอนไฟเขียวรถ'], correct:0, explain:'ควรข้ามทางม้าลายและมองรถให้ปลอดภัย', tier:1},
      {q:'การทิ้งขยะให้ถูกที่เป็นการทำสิ่งใด?', emoji:'🗑️', choices:['รักษาความสะอาดชุมชน','ทำให้สกปรก','สิ้นเปลือง','ผิดกฎหมายร้ายแรง'], correct:0, explain:'ทิ้งขยะให้ถูกที่ช่วยรักษาความสะอาด', tier:1},
      {q:'เราควรปฏิบัติต่อผู้สูงอายุอย่างไร?', emoji:'👵', choices:['เคารพและช่วยเหลือ','ล้อเลียน','ไม่สนใจ','แซงคิว'], correct:0, explain:'ควรเคารพและช่วยเหลือผู้สูงอายุ', tier:1},
      {q:'อาชีพใดผลิตข้าวให้เรากิน?', emoji:'🌾', choices:['ชาวนา','หมอ','ครู','นักบิน'], correct:0, explain:'ชาวนาปลูกข้าวให้เรากิน', tier:1},
      {q:'เงินที่ใช้ซื้อของในประเทศไทยคือหน่วยใด?', emoji:'💰', choices:['บาท','ดอลลาร์','เยน','ยูโร'], correct:0, explain:'เงินไทยมีหน่วยเป็นบาท', tier:1},
      {q:'การเข้าคิวซื้อของแสดงถึงสิ่งใด?', emoji:'🧍', choices:['มีระเบียบวินัย','ความเร็ว','ความรวย','ความเก่ง'], correct:0, explain:'การเข้าคิวแสดงถึงการมีระเบียบวินัย', tier:1},
      /* tier2 — เศรษฐกิจ/แผนที่/ทรัพยากร (ยาก) */
      {q:'ภาษีที่ประชาชนจ่ายนำไปใช้ทำสิ่งใด?', emoji:'🏗️', choices:['พัฒนาประเทศ เช่น สร้างถนน โรงเรียน','ซื้อของเล่นให้เด็ก','เก็บไว้เฉยๆ','แจกฟรีทุกคน'], correct:0, explain:'ภาษีนำไปพัฒนาประเทศ สร้างสาธารณูปโภค', tier:2},
      {q:'การออมเงินมีประโยชน์อย่างไร?', emoji:'🐷', choices:['มีเงินใช้ยามจำเป็น','ทำให้จน','เสียเงิน','ไม่มีประโยชน์'], correct:0, explain:'การออมช่วยให้มีเงินใช้ยามจำเป็น', tier:2},
      {q:'แผนที่ใช้ประโยชน์อย่างไร?', emoji:'🗺️', choices:['บอกตำแหน่งและเส้นทาง','บอกเวลา','บอกอากาศ','บอกราคา'], correct:0, explain:'แผนที่ใช้บอกตำแหน่งและเส้นทาง', tier:2},
      {q:'ทิศที่พระอาทิตย์ขึ้นคือทิศใด?', emoji:'🧭', choices:['ทิศตะวันออก','ทิศตะวันตก','ทิศเหนือ','ทิศใต้'], correct:0, explain:'พระอาทิตย์ขึ้นทางทิศตะวันออก', tier:2},
      {q:'สินค้าที่ผลิตในชุมชนของตนเองเรียกว่าอะไร?', emoji:'🧺', choices:['สินค้าท้องถิ่น','สินค้านำเข้า','สินค้าต่างประเทศ','ของเล่น'], correct:0, explain:'สินค้าที่ผลิตในชุมชนคือสินค้าท้องถิ่น', tier:2},
      {q:'ก่อนซื้อของเราควรพิจารณาสิ่งใดก่อน?', emoji:'🛒', choices:['ความจำเป็นและราคา','สีของกล่อง','ความดังของโฆษณา','ยี่ห้อแพงสุด'], correct:0, explain:'ควรพิจารณาความจำเป็นและราคาก่อนซื้อ', tier:2},
      {q:'ผู้ใหญ่บ้านหรือกำนันมีหน้าที่อะไร?', emoji:'🏘️', choices:['ดูแลหมู่บ้าน/ชุมชน','สอนหนังสือ','รักษาคนป่วย','ขับรถเมล์'], correct:0, explain:'ผู้ใหญ่บ้าน/กำนันดูแลชุมชนของตน', tier:2},
      {q:'การประหยัดน้ำและไฟฟ้าช่วยเรื่องใด?', emoji:'💧', choices:['ประหยัดทรัพยากรและค่าใช้จ่าย','ทำให้สกปรก','เสียเวลา','ไม่ช่วยอะไร'], correct:0, explain:'ช่วยประหยัดทรัพยากรและลดค่าใช้จ่าย', tier:2},
      {q:'เข็มทิศใช้บอกสิ่งใด?', emoji:'🧭', choices:['ทิศทาง','เวลา','อุณหภูมิ','น้ำหนัก'], correct:0, explain:'เข็มทิศใช้บอกทิศทาง', tier:2},
      {q:'ใครมีหน้าที่ดับไฟเมื่อเกิดไฟไหม้ในชุมชน?', emoji:'🚒', choices:['นักดับเพลิง','คนขายของ','ครู','นักร้อง'], correct:0, explain:'นักดับเพลิงมีหน้าที่ดับไฟ', tier:1},
      {q:'สถานที่ใดในชุมชนที่เราไปยืมหนังสืออ่านได้?', emoji:'📚', choices:['ห้องสมุด','ตลาด','สถานีตำรวจ','ปั๊มน้ำมัน'], correct:0, explain:'ห้องสมุดเป็นที่ยืมอ่านหนังสือ', tier:1},
      {q:'เมื่อไฟจราจรเป็นสีแดง รถต้องทำอย่างไร?', emoji:'🚦', choices:['หยุด','ไปต่อ','เร่งความเร็ว','บีบแตร'], correct:0, explain:'ไฟแดงคือสัญญาณให้หยุด', tier:1},
      {q:'ทิศที่พระอาทิตย์ตกคือทิศใด?', emoji:'🌇', choices:['ทิศตะวันตก','ทิศตะวันออก','ทิศเหนือ','ทิศใต้'], correct:0, explain:'พระอาทิตย์ตกทางทิศตะวันตก', tier:2},
      {q:'อาชีพใดให้บริการส่งจดหมายและพัสดุ?', emoji:'📮', choices:['บุรุษไปรษณีย์','ชาวนา','หมอ','ตำรวจ'], correct:0, explain:'บุรุษไปรษณีย์ส่งจดหมายและพัสดุ', tier:2},
      {q:'สินค้าที่นำมาจากต่างประเทศเรียกว่าอะไร?', emoji:'🚢', choices:['สินค้านำเข้า','สินค้าส่งออก','สินค้าท้องถิ่น','ของเล่น'], correct:0, explain:'สินค้าจากต่างประเทศคือสินค้านำเข้า', tier:2}
    ]
  },
  {
    id:'p3-social2', name:'สังคม ป.3 · สิทธิ หน้าที่ และการอยู่ร่วมกัน', emoji:'🗳️', icon:'assets/icons/p3-social2.svg', color:'#E5893B', light:'#FBEAD5', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — กฎ/สิทธิ/หน้าที่/การอยู่ร่วมกัน (ง่าย) */
      {q:'กฎของห้องเรียนมีไว้เพื่ออะไร?', emoji:'📋', choices:['ให้อยู่ร่วมกันอย่างเป็นสุข','ทำให้เด็กกลัว','ลงโทษเด็ก','ไม่มีประโยชน์'], correct:0, explain:'กฎมีไว้เพื่อให้อยู่ร่วมกันอย่างเป็นสุข', tier:1},
      {q:'เด็กทุกคนมีสิทธิได้รับสิ่งใด?', emoji:'🎒', choices:['การศึกษา','รถยนต์','เงินทอง','โทรศัพท์'], correct:0, explain:'เด็กทุกคนมีสิทธิได้รับการศึกษา', tier:1},
      {q:'หน้าที่สำคัญของนักเรียนคืออะไร?', emoji:'📚', choices:['ตั้งใจเรียน','เล่นเกม','นอนในห้อง','พูดคุยเสียงดัง'], correct:0, explain:'หน้าที่ของนักเรียนคือตั้งใจเรียน', tier:1},
      {q:'เมื่อทำผิดควรทำอย่างไร?', emoji:'🙏', choices:['ขอโทษและแก้ไข','โทษคนอื่น','หนีไป','เงียบไว้'], correct:0, explain:'เมื่อทำผิดควรขอโทษและแก้ไข', tier:1},
      {q:'การช่วยงานบ้านเป็นหน้าที่ต่อใคร?', emoji:'🏠', choices:['ครอบครัว','เพื่อนบ้าน','โรงเรียน','ร้านค้า'], correct:0, explain:'ช่วยงานบ้านเป็นหน้าที่ต่อครอบครัว', tier:1},
      {q:'การรอคอยตามคิวเป็นการเคารพสิทธิของใคร?', emoji:'🧍', choices:['ผู้อื่น','ตัวเองเท่านั้น','ไม่มีใคร','คนรวย'], correct:0, explain:'การเข้าคิวเป็นการเคารพสิทธิผู้อื่น', tier:1},
      {q:'เมื่อมีความคิดเห็นต่างกันควรทำอย่างไร?', emoji:'💬', choices:['รับฟังและปรึกษากัน','ทะเลาะกัน','เดินหนี','ตะโกนใส่กัน'], correct:0, explain:'ควรรับฟังและปรึกษากัน', tier:1},
      {q:'ของใช้ส่วนรวมในโรงเรียนเราควรทำอย่างไร?', emoji:'🪑', choices:['ช่วยกันดูแลรักษา','ทำลาย','เอากลับบ้าน','ขีดเขียนเล่น'], correct:0, explain:'ของส่วนรวมควรช่วยกันดูแลรักษา', tier:1},
      {q:'สิ่งใดที่เราควรเคารพเมื่ออยู่ในที่สาธารณะ?', emoji:'🚸', choices:['กฎ ระเบียบ และสิทธิผู้อื่น','เฉพาะเพื่อนเรา','ไม่ต้องเคารพใคร','เฉพาะครู'], correct:0, explain:'ควรเคารพกฎระเบียบและสิทธิของผู้อื่น', tier:1},
      /* tier2 — ประชาธิปไตย/ผู้นำ-ผู้ตาม/เศรษฐกิจพอเพียง (ยาก) */
      {q:'การเลือกหัวหน้าห้องด้วยการยกมือโหวตเรียกว่าอะไร?', emoji:'🗳️', choices:['การออกเสียงลงคะแนน','การจับสลากลงโทษ','การแข่งวิ่ง','การสอบ'], correct:0, explain:'การยกมือเลือกคือการออกเสียงลงคะแนน', tier:2},
      {q:'เมื่อเสียงข้างมากเลือกแล้ว เราควรทำอย่างไร?', emoji:'🤝', choices:['ยอมรับผลและร่วมมือ','โกรธและไม่ทำตาม','เลือกใหม่เรื่อยๆ','ออกจากห้อง'], correct:0, explain:'ในระบอบประชาธิปไตยควรยอมรับผลเสียงข้างมาก', tier:2},
      {q:'ผู้นำที่ดีควรมีลักษณะอย่างไร?', emoji:'🧑‍🏫', choices:['รับผิดชอบและรับฟังผู้อื่น','สั่งอย่างเดียว','เอาแต่ใจ','ไม่สนใจใคร'], correct:0, explain:'ผู้นำที่ดีต้องรับผิดชอบและรับฟัง', tier:2},
      {q:'"ประชาธิปไตย" หมายถึงอะไร?', emoji:'🗳️', choices:['ประชาชนมีส่วนร่วมในการตัดสินใจ','คนเดียวสั่งทุกอย่าง','ไม่มีกฎ','เลือกคนรวยเท่านั้น'], correct:0, explain:'ประชาธิปไตยคือประชาชนมีส่วนร่วม', tier:2},
      {q:'เศรษฐกิจพอเพียงสอนให้เราทำสิ่งใด?', emoji:'🐷', choices:['ใช้จ่ายอย่างพอประมาณ','ใช้เงินให้หมด','กู้เงินมาใช้','ซื้อของแพงเสมอ'], correct:0, explain:'เศรษฐกิจพอเพียงสอนให้ใช้จ่ายพอประมาณ', tier:2},
      {q:'สิทธิมักมาพร้อมกับสิ่งใด?', emoji:'⚖️', choices:['หน้าที่','รางวัล','เงิน','ของเล่น'], correct:0, explain:'มีสิทธิก็ต้องมีหน้าที่ควบคู่กัน', tier:2},
      {q:'ผู้ตามที่ดีควรทำอย่างไร?', emoji:'👥', choices:['ให้ความร่วมมือและทำหน้าที่ของตน','ขัดขวางทุกอย่าง','เงียบเฉยไม่ช่วย','แย่งเป็นผู้นำ'], correct:0, explain:'ผู้ตามที่ดีควรให้ความร่วมมือ', tier:2},
      {q:'คนในชุมชนที่มาจากต่างวัฒนธรรม เราควรทำอย่างไร?', emoji:'🌏', choices:['เคารพความแตกต่างและอยู่ร่วมกัน','ล้อเลียน','ไม่คบหา','ขับไล่'], correct:0, explain:'ควรเคารพความแตกต่างและอยู่ร่วมกันอย่างสันติ', tier:2},
      {q:'การประหยัดและอดออมเป็นส่วนหนึ่งของหลักคิดใด?', emoji:'💴', choices:['เศรษฐกิจพอเพียง','การแข่งขัน','การกู้ยืม','การใช้จ่ายฟุ่มเฟือย'], correct:0, explain:'การประหยัดอดออมเป็นหลักเศรษฐกิจพอเพียง', tier:2},
      {q:'เมื่อเพื่อนล้มเจ็บ เราควรทำอย่างไร?', emoji:'🤕', choices:['ช่วยเหลือและบอกครู','หัวเราะเยาะ','เดินหนี','แกล้งซ้ำ'], correct:0, explain:'ควรช่วยเหลือเพื่อนและแจ้งครู', tier:1},
      {q:'ในห้องเรียนถ้าอยากพูด เราควรทำอย่างไรก่อน?', emoji:'🙋', choices:['ยกมือขออนุญาต','ตะโกนพูดเลย','พูดแทรกเพื่อน','เดินไปหน้าห้อง'], correct:0, explain:'ควรยกมือขออนุญาตก่อนพูด', tier:1},
      {q:'การพูด "ขอบคุณ" เมื่อได้รับความช่วยเหลือแสดงถึงสิ่งใด?', emoji:'🙏', choices:['มารยาทที่ดี','ความขี้เกียจ','ความโกรธ','ความกลัว'], correct:0, explain:'การขอบคุณเป็นมารยาทที่ดี', tier:1},
      {q:'ธงชาติไทยมีกี่สี?', emoji:'🇹🇭', choices:['3 สี (แดง ขาว น้ำเงิน)','2 สี','5 สี','1 สี'], correct:0, explain:'ธงไตรรงค์มี 3 สี คือ แดง ขาว น้ำเงิน', tier:2},
      {q:'การเข้าแถวเคารพธงชาติตอนเช้าแสดงถึงสิ่งใด?', emoji:'🎌', choices:['ความรักชาติและระเบียบวินัย','ความเหนื่อย','การเล่นสนุก','การแข่งขัน'], correct:0, explain:'การเคารพธงชาติแสดงถึงความรักชาติและมีวินัย', tier:2},
      {q:'เมื่อเห็นผู้สูงอายุยืนบนรถเมล์ เราที่นั่งอยู่ควรทำอย่างไร?', emoji:'👵', choices:['ลุกให้ท่านนั่ง','นั่งเฉยๆ','แกล้งหลับ','เล่นโทรศัพท์'], correct:0, explain:'ควรเสียสละที่นั่งให้ผู้สูงอายุ', tier:2}
    ]
  },

  /* ---------- เชาวน์ปัญญา ป.3 (ตรรกะ-แบบรูป / ความจำ-มิติสัมพันธ์) ---------- */
  {
    id:'p3-iq1', name:'เชาวน์ ป.3 · ตรรกะและแบบรูป', emoji:'💫', icon:'assets/icons/p3-iq1.svg', color:'#2FB673', light:'#D6F3E4', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — อนุกรมง่าย/แบบรูป/ไม่เข้าพวก (ง่าย) */
      {q:'เติมเลขต่อไป: 2, 4, 6, 8, ▢', emoji:'🔢', choices:['10','9','12','7'], correct:0, explain:'เพิ่มทีละ 2 ตัวต่อไปคือ 10', tier:1},
      {q:'เติมเลขต่อไป: 5, 10, 15, 20, ▢', emoji:'🖐️', choices:['25','21','30','24'], correct:0, explain:'เพิ่มทีละ 5 ตัวต่อไปคือ 25', tier:1},
      {q:'แบบรูป: 🔺🔺🔵🔺🔺🔵🔺🔺▢ ต่อไปคือ?', emoji:'🔵', choices:['🔵','🔺','🟢','🟡'], correct:0, explain:'ทุก 2 สามเหลี่ยมจะมี 1 วงกลม จึงเป็น 🔵', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🍎', choices:['รถยนต์','แอปเปิล','กล้วย','ส้ม'], correct:0, explain:'อีก 3 อย่างเป็นผลไม้ รถยนต์ไม่เข้าพวก', tier:1},
      {q:'ถ้าวันนี้เป็นวันจันทร์ พรุ่งนี้เป็นวันอะไร?', emoji:'📅', choices:['วันอังคาร','วันอาทิตย์','วันพุธ','วันเสาร์'], correct:0, explain:'ถัดจากวันจันทร์คือวันอังคาร', tier:1},
      {q:'เติมเลขต่อไป: 1, 3, 5, 7, ▢', emoji:'🔢', choices:['9','8','10','6'], correct:0, explain:'เลขคี่เรียงกัน ตัวต่อไปคือ 9', tier:1},
      {q:'ตรงข้ามกับคำว่า "สูง" คือคำใด?', emoji:'📏', choices:['เตี้ย','ใหญ่','ยาว','หนา'], correct:0, explain:'ตรงข้ามกับ สูง คือ เตี้ย', tier:1},
      {q:'เติมเลขต่อไป: 10, 9, 8, 7, ▢', emoji:'🔽', choices:['6','5','8','11'], correct:0, explain:'ลดทีละ 1 ตัวต่อไปคือ 6', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🟦', choices:['สีแดง','วงกลม','สามเหลี่ยม','สี่เหลี่ยม'], correct:0, explain:'อีก 3 อย่างเป็นรูปทรง สีแดงไม่เข้าพวก', tier:1},
      /* tier2 — อนุกรมทวีคูณ/รหัสตัวอักษร/โจทย์ปัญหาเชิงตรรกะ (ยาก) */
      {q:'เติมเลขต่อไป: 1, 2, 4, 8, ▢', emoji:'✖️', choices:['16','10','12','9'], correct:0, explain:'คูณ 2 ทุกครั้ง ตัวต่อไปคือ 16', tier:2},
      {q:'ถ้า A=1, B=2, C=3 แล้ว D=?', emoji:'🔤', choices:['4','5','3','6'], correct:0, explain:'เรียงตามลำดับ D คือตัวที่ 4', tier:2},
      {q:'เติมเลขต่อไป: 3, 6, 9, 12, ▢', emoji:'🔢', choices:['15','13','18','14'], correct:0, explain:'เพิ่มทีละ 3 ตัวต่อไปคือ 15', tier:2},
      {q:'เติมเลขต่อไป: 21, 18, 15, 12, ▢', emoji:'🔽', choices:['9','10','11','6'], correct:0, explain:'ลดทีละ 3 ตัวต่อไปคือ 9', tier:2},
      {q:'น้องอายุ 6 ปี พี่แก่กว่าน้อง 3 ปี พี่อายุเท่าไร?', emoji:'🧒', choices:['9 ปี','8 ปี','3 ปี','6 ปี'], correct:0, explain:'6 + 3 = 9 ปี', tier:2},
      {q:'ถ้าเมื่อวานเป็นวันศุกร์ วันนี้เป็นวันอะไร?', emoji:'📆', choices:['วันเสาร์','วันพฤหัส','วันอาทิตย์','วันศุกร์'], correct:0, explain:'ถัดจากวันศุกร์คือวันเสาร์', tier:2},
      {q:'ในกล่องมีลูกบอลแดง 3 ลูก ฟ้า 2 ลูก หยิบ 1 ครั้ง มีโอกาสได้สีใดมากกว่า?', emoji:'🔴', choices:['สีแดง','สีฟ้า','เท่ากัน','สีเขียว'], correct:0, explain:'แดงมี 3 ลูก มากกว่าฟ้า จึงมีโอกาสได้แดงมากกว่า', tier:2},
      {q:'เติมเลขต่อไป: 2, 3, 5, 8, 12, ▢', emoji:'🔢', choices:['17','15','16','13'], correct:0, explain:'บวกเพิ่มทีละ 1,2,3,4,5 ตัวต่อไปคือ 12+5 = 17', tier:2},
      {q:'ถ้า 🍎 ราคา 3 บาท ซื้อ 2 ผล ต้องจ่ายกี่บาท?', emoji:'🍎', choices:['6 บาท','5 บาท','3 บาท','9 บาท'], correct:0, explain:'3 × 2 = 6 บาท', tier:2},
      {q:'เติมเลขต่อไป: 4, 8, 12, 16, ▢', emoji:'🔢', choices:['20','18','24','15'], correct:0, explain:'เพิ่มทีละ 4 ตัวต่อไปคือ 20', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🐶', choices:['เก้าอี้','หมา','แมว','นก'], correct:0, explain:'อีก 3 อย่างเป็นสัตว์ เก้าอี้ไม่เข้าพวก', tier:1},
      {q:'ตรงข้ามกับคำว่า "หนัก" คือคำใด?', emoji:'⚖️', choices:['เบา','ใหญ่','ยาว','ร้อน'], correct:0, explain:'ตรงข้ามกับ หนัก คือ เบา', tier:1},
      {q:'เติมเลขต่อไป: 100, 90, 80, 70, ▢', emoji:'🔽', choices:['60','65','75','50'], correct:0, explain:'ลดทีละ 10 ตัวต่อไปคือ 60', tier:2},
      {q:'ถ้าวันนี้วันพุธ อีก 2 วันเป็นวันอะไร?', emoji:'📆', choices:['วันศุกร์','วันพฤหัส','วันเสาร์','วันอังคาร'], correct:0, explain:'พุธ +2 วัน = ศุกร์', tier:2},
      {q:'เติมเลขต่อไป: 1, 4, 9, 16, ▢ (จำนวนยกกำลังสอง)', emoji:'🔢', choices:['25','20','24','30'], correct:0, explain:'1,4,9,16,25 คือ 1×1,2×2,3×3,4×4,5×5', tier:2}
    ]
  },
  {
    id:'p3-iq2', name:'เชาวน์ ป.3 · ความจำและการจับคู่', emoji:'🔆', icon:'assets/icons/p3-iq2.svg', color:'#1F9C60', light:'#D6F3E4', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — จับคู่ความสัมพันธ์/คำตรงข้าม/คิดเลขในชีวิต (ง่าย) */
      {q:'มือ คู่กับ ถุงมือ แล้ว เท้า คู่กับอะไร?', emoji:'🦶', choices:['รองเท้า','หมวก','แว่นตา','เสื้อ'], correct:0, explain:'เท้าใส่คู่กับรองเท้า เหมือนมือกับถุงมือ', tier:1},
      {q:'นก อยู่กับ รัง แล้ว ปลา อยู่กับอะไร?', emoji:'🐟', choices:['น้ำ','ต้นไม้','ถ้ำ','ท้องฟ้า'], correct:0, explain:'ปลาอยู่ในน้ำ เหมือนนกอยู่ในรัง', tier:1},
      {q:'ร้อน ตรงข้ามกับ เย็น แล้ว กลางวัน ตรงข้ามกับอะไร?', emoji:'🌙', choices:['กลางคืน','เช้า','เที่ยง','บ่าย'], correct:0, explain:'กลางวันตรงข้ามกับกลางคืน', tier:1},
      {q:'1 สัปดาห์มีกี่วัน?', emoji:'📅', choices:['7 วัน','5 วัน','10 วัน','30 วัน'], correct:0, explain:'1 สัปดาห์มี 7 วัน', tier:1},
      {q:'ครู คู่กับ โรงเรียน แล้ว หมอ คู่กับอะไร?', emoji:'👩‍⚕️', choices:['โรงพยาบาล','ตลาด','สวนสัตว์','โรงหนัง'], correct:0, explain:'หมอทำงานที่โรงพยาบาล', tier:1},
      {q:'เปิด ตรงข้ามกับอะไร?', emoji:'🚪', choices:['ปิด','ดัง','สูง','ร้อน'], correct:0, explain:'เปิด ตรงข้ามกับ ปิด', tier:1},
      {q:'มี 5 นิ้วต่อมือ 1 ข้าง สองมือมีกี่นิ้ว?', emoji:'🖐️', choices:['10 นิ้ว','5 นิ้ว','15 นิ้ว','8 นิ้ว'], correct:0, explain:'5 × 2 = 10 นิ้ว', tier:1},
      {q:'เรียงจากเล็กไปใหญ่ ข้อใดถูก?', emoji:'🐘', choices:['มด แมว ช้าง','ช้าง แมว มด','แมว ช้าง มด','ช้าง มด แมว'], correct:0, explain:'มดเล็กสุด แล้วแมว แล้วช้างใหญ่สุด', tier:1},
      {q:'รถ 1 คันมี 4 ล้อ รถ 2 คันมีกี่ล้อ?', emoji:'🚗', choices:['8 ล้อ','4 ล้อ','6 ล้อ','10 ล้อ'], correct:0, explain:'4 × 2 = 8 ล้อ', tier:1},
      /* tier2 — คิดเลขเชิงเหตุผล/หน่วยนับ/ทิศทาง (ยาก) */
      {q:'ครึ่งหนึ่งของ 10 คือเท่าไร?', emoji:'➗', choices:['5','2','10','15'], correct:0, explain:'10 ÷ 2 = 5', tier:2},
      {q:'2 โหล เท่ากับกี่ชิ้น?', emoji:'📦', choices:['24 ชิ้น','12 ชิ้น','20 ชิ้น','10 ชิ้น'], correct:0, explain:'1 โหล = 12 ชิ้น, 2 โหล = 24 ชิ้น', tier:2},
      {q:'ถ้า 3 คนกินพิซซ่า 1 ถาด แล้ว 9 คนต้องใช้กี่ถาด?', emoji:'🍕', choices:['3 ถาด','2 ถาด','9 ถาด','1 ถาด'], correct:0, explain:'9 ÷ 3 = 3 ถาด', tier:2},
      {q:'นาฬิกาบอกเวลา 3 นาฬิกา เข็มสั้นชี้เลขใด?', emoji:'🕐', choices:['3','12','6','9'], correct:0, explain:'เข็มสั้นบอกชั่วโมง เวลา 3 นาฬิกาชี้เลข 3', tier:2},
      {q:'ถ้าหันหน้าไปทางทิศเหนือแล้วกลับหลังหัน จะหันไปทิศใด?', emoji:'🧭', choices:['ทิศใต้','ทิศเหนือ','ทิศตะวันออก','ทิศตะวันตก'], correct:0, explain:'ตรงข้ามกับทิศเหนือคือทิศใต้', tier:2},
      {q:'3 คู่ เท่ากับกี่ชิ้น?', emoji:'🧦', choices:['6 ชิ้น','3 ชิ้น','9 ชิ้น','12 ชิ้น'], correct:0, explain:'1 คู่ = 2 ชิ้น, 3 คู่ = 6 ชิ้น', tier:2},
      {q:'แบบรูปวันเว้นวัน: จันทร์ พุธ ศุกร์ ▢', emoji:'📆', choices:['อาทิตย์','เสาร์','อังคาร','พฤหัส'], correct:0, explain:'เว้นวันไปเรื่อยๆ ถัดจากศุกร์คืออาทิตย์', tier:2},
      {q:'มีขนม 12 ชิ้น แบ่งให้เพื่อน 4 คนเท่าๆ กัน คนละกี่ชิ้น?', emoji:'🍪', choices:['3 ชิ้น','4 ชิ้น','2 ชิ้น','6 ชิ้น'], correct:0, explain:'12 ÷ 4 = 3 ชิ้น', tier:2},
      {q:'สมุด 1 เล่มหนา 50 หน้า สมุด 2 เล่มมีกี่หน้า?', emoji:'📔', choices:['100 หน้า','50 หน้า','150 หน้า','25 หน้า'], correct:0, explain:'50 × 2 = 100 หน้า', tier:2},
      {q:'ผึ้ง คู่กับ น้ำผึ้ง แล้ว วัว คู่กับอะไร?', emoji:'🐄', choices:['นม','ไข่','ขนสัตว์','น้ำผึ้ง'], correct:0, explain:'วัวให้นม เหมือนผึ้งให้น้ำผึ้ง', tier:1},
      {q:'ดินสอ คู่กับ เขียน แล้ว กรรไกร คู่กับอะไร?', emoji:'✂️', choices:['ตัด','วาด','อ่าน','ทา'], correct:0, explain:'กรรไกรใช้ตัด เหมือนดินสอใช้เขียน', tier:1},
      {q:'กลางวันมี ดวงอาทิตย์ กลางคืนมีอะไร?', emoji:'🌙', choices:['ดวงจันทร์','สายรุ้ง','เมฆฝน','ต้นไม้'], correct:0, explain:'กลางคืนเห็นดวงจันทร์', tier:1},
      {q:'1 ชั่วโมงมีกี่นาที?', emoji:'🕐', choices:['60 นาที','30 นาที','100 นาที','24 นาที'], correct:0, explain:'1 ชั่วโมง = 60 นาที', tier:2},
      {q:'ถ้าซื้อของ 45 บาท จ่ายด้วยแบงก์ 50 บาท จะได้เงินทอนเท่าไร?', emoji:'💵', choices:['5 บาท','10 บาท','15 บาท','45 บาท'], correct:0, explain:'50 - 45 = 5 บาท', tier:2},
      {q:'ครึ่งโหลเท่ากับกี่ชิ้น?', emoji:'📦', choices:['6 ชิ้น','12 ชิ้น','3 ชิ้น','24 ชิ้น'], correct:0, explain:'1 โหล = 12 ครึ่งโหล = 6 ชิ้น', tier:2}
    ]
  },

  /* ---------- เกมฝึกทักษะ ป.3 (reuse engine เดิม แยก id/progress) ---------- */
  { id:'p3-memory', name:'จับคู่โดมิโน ป.3', emoji:'🀄', icon:'assets/icons/p3-memory.svg', color:'#E0764C', light:'#FBE3D4', type:'skill', mode:'memory', levels:3, memoryPairs:[8,12,16], handPlay:true, grade:'p3', isNew:true },

  /* ---------- Phase 3.3: หมวดใหม่ "เส้นเวลามหัศจรรย์" (timeline engine ใหม่ — ต้นสายที่ ป.4-6 ใช้ต่อ) ---------- */
  { id:'p3-timeline', name:'เส้นเวลามหัศจรรย์', emoji:'🏛️', icon:'assets/icons/p3-timeline.svg', color:'#B07A2E', light:'#F5E7CE', type:'skill', mode:'timeline', levels:10, handPlay:true, grade:'p3', isNew:true },

  /* ---------- Phase 3.4: sort engine (ลากใส่ตะกร้า) — นักสืบแม่เหล็ก (วิทย์) + จัดหมวดหมู่คำอังกฤษ ---------- */
  { id:'p3-magnet', name:'นักสืบแม่เหล็ก', emoji:'🧲', icon:'assets/icons/p3-magnet.svg', color:'#3FA9C9', light:'#D9F0F8', type:'skill', mode:'sort', sortSet:'magnet', levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-engsort', name:'English ป.3 · จัดหมวดหมู่คำ', emoji:'🏷️', icon:'assets/icons/p3-engsort.svg', color:'#0A7A75', light:'#D5F5F2', type:'skill', mode:'sort', sortSet:'engword', levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-mathsort', name:'แยกเลขคู่-เลขคี่', emoji:'🧮', icon:'assets/icons/p3-mathsort.svg', color:'#6A4FE0', light:'#E7E2FC', type:'skill', mode:'sort', sortSet:'evenodd', levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-thaisort', name:'แยกพยัญชนะ-สระ', emoji:'🔤', icon:'assets/icons/p3-thaisort.svg', color:'#E14E9A', light:'#FCE0EF', type:'skill', mode:'sort', sortSet:'thaichar', levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-scisort', name:'แยกสิ่งมีชีวิต-ไม่มีชีวิต', emoji:'🦠', icon:'assets/icons/p3-scisort.svg', color:'#2FA36B', light:'#D9F2E4', type:'skill', mode:'sort', sortSet:'living', levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-coord', name:'ขุมทรัพย์พิกัด', emoji:'💎', icon:'assets/icons/p3-coord.svg', color:'#C77D2E', light:'#F6E7CF', type:'skill', mode:'coord', levels:10, handPlay:true, grade:'p3', isNew:true },
  {
    id:'p3-engclock', name:'English ป.3 · บอกเวลา (What time is it?)', emoji:'🕰️', icon:'assets/icons/p3-engclock.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — o'clock (ดูรูปนาฬิกา เลือกประโยคอังกฤษ) */
      {q:'What time is it? (ดูรูปนาฬิกา)', emoji:'🕒', choices:['It is three o\'clock.','It is two o\'clock.','It is four o\'clock.','It is eight o\'clock.'], correct:0, explain:'เข็มสั้นชี้ 3 เข็มยาวชี้ 12 = three o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕘', choices:['It is nine o\'clock.','It is six o\'clock.','It is ten o\'clock.','It is three o\'clock.'], correct:0, explain:'🕘 = nine o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕕', choices:['It is six o\'clock.','It is five o\'clock.','It is seven o\'clock.','It is twelve o\'clock.'], correct:0, explain:'🕕 = six o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕛', choices:['It is twelve o\'clock.','It is one o\'clock.','It is six o\'clock.','It is ten o\'clock.'], correct:0, explain:'🕛 = twelve o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕐', choices:['It is one o\'clock.','It is two o\'clock.','It is twelve o\'clock.','It is seven o\'clock.'], correct:0, explain:'🕐 = one o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕔', choices:['It is five o\'clock.','It is four o\'clock.','It is six o\'clock.','It is nine o\'clock.'], correct:0, explain:'🕔 = five o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕗', choices:['It is eight o\'clock.','It is seven o\'clock.','It is nine o\'clock.','It is three o\'clock.'], correct:0, explain:'🕗 = eight o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕚', choices:['It is eleven o\'clock.','It is ten o\'clock.','It is twelve o\'clock.','It is two o\'clock.'], correct:0, explain:'🕚 = eleven o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕓', choices:['It is four o\'clock.','It is three o\'clock.','It is five o\'clock.','It is eight o\'clock.'], correct:0, explain:'🕓 = four o\'clock', tier:1},
      /* tier2 — half past + แปลไทย-อังกฤษ */
      {q:'What time is it?', emoji:'🕝', choices:['It is half past two.','It is half past three.','It is two o\'clock.','It is half past one.'], correct:0, explain:'🕝 = สองโมงครึ่ง = half past two', tier:2},
      {q:'What time is it?', emoji:'🕞', choices:['It is half past three.','It is half past four.','It is three o\'clock.','It is half past two.'], correct:0, explain:'🕞 = half past three', tier:2},
      {q:'What time is it?', emoji:'🕧', choices:['It is half past twelve.','It is twelve o\'clock.','It is half past one.','It is half past six.'], correct:0, explain:'🕧 = half past twelve', tier:2},
      {q:'What time is it?', emoji:'🕡', choices:['It is half past six.','It is six o\'clock.','It is half past five.','It is half past seven.'], correct:0, explain:'🕡 = half past six', tier:2},
      {q:'"It is seven o\'clock." ตรงกับนาฬิกาเรือนใด?', emoji:'⏰', choices:['🕖','🕗','🕕','🕥'], correct:0, explain:'seven o\'clock = 🕖 (7:00)', tier:2},
      {q:'"หกโมงครึ่ง" ภาษาอังกฤษพูดว่าอย่างไร?', emoji:'🕡', choices:['It is half past six.','It is six o\'clock.','It is half past seven.','It is sixty o\'clock.'], correct:0, explain:'หกโมงครึ่ง = half past six', tier:2},
      {q:'What time is it?', emoji:'🕜', choices:['It is half past one.','It is one o\'clock.','It is half past two.','It is half past twelve.'], correct:0, explain:'🕜 = half past one', tier:2},
      {q:'ประโยค "It is ten o\'clock." หมายถึงเวลาใด?', emoji:'🕙', choices:['สิบโมง','สี่โมง','สิบโมงครึ่ง','สิบสองโมง'], correct:0, explain:'ten o\'clock = สิบโมงตรง', tier:2},
      {q:'What time is it?', emoji:'🕑', choices:['It is two o\'clock.','It is one o\'clock.','It is three o\'clock.','It is twelve o\'clock.'], correct:0, explain:'🕑 = two o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕖', choices:['It is seven o\'clock.','It is six o\'clock.','It is eight o\'clock.','It is nine o\'clock.'], correct:0, explain:'🕖 = seven o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕙', choices:['It is ten o\'clock.','It is nine o\'clock.','It is eleven o\'clock.','It is twelve o\'clock.'], correct:0, explain:'🕙 = ten o\'clock', tier:1},
      {q:'What time is it?', emoji:'🕟', choices:['It is half past four.','It is four o\'clock.','It is half past five.','It is half past three.'], correct:0, explain:'🕟 = half past four (สี่โมงครึ่ง)', tier:2},
      {q:'"It is nine o\'clock." ตรงกับนาฬิกาเรือนใด?', emoji:'⏰', choices:['🕘','🕗','🕙','🕕'], correct:0, explain:'nine o\'clock = 🕘 (9:00)', tier:2},
      {q:'ประโยค "It is half past two." หมายถึงเวลาใด?', emoji:'🕝', choices:['สองโมงครึ่ง','สองโมง','สามโมงครึ่ง','สิบสองโมงครึ่ง'], correct:0, explain:'half past two = สองโมงครึ่ง', tier:2}
    ]
  },

  /* ---------- Phase 3.4b: หมวดใหม่ "โลกหมุน" (world engine ใหม่ — วิทย์ กลางวัน/กลางคืน) ---------- */
  { id:'p3-world', name:'โลกหมุน กลางวัน-กลางคืน', emoji:'🌎', icon:'assets/icons/p3-world.svg', color:'#2E86C1', light:'#D6EAF8', type:'skill', mode:'world', levels:10, handPlay:true, grade:'p3', isNew:true },

  /* ---------- Phase 3.5: วิทยาศาสตร์ ป.3 (quiz) — แรง/แสง/พลังงาน + สิ่งมีชีวิต/พืช ---------- */
  {
    id:'p3-sci1', name:'วิทยาศาสตร์ ป.3 · แรง แสง พลังงาน', emoji:'⚗️', icon:'assets/icons/p3-sci1.svg', color:'#3FA9C9', light:'#D9F0F8', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — แรง/แม่เหล็ก/แสง เบื้องต้น (ง่าย) */
      {q:'แรงที่ทำให้ของตกลงสู่พื้นคือแรงอะไร?', emoji:'🍎', choices:['แรงโน้มถ่วง','แรงลม','แรงแม่เหล็ก','แรงคน'], correct:0, explain:'ของตกลงพื้นเพราะแรงโน้มถ่วงของโลก', tier:1},
      {q:'แม่เหล็กมีขั้วกี่ขั้ว?', emoji:'🧲', choices:['2 ขั้ว (เหนือ-ใต้)','1 ขั้ว','3 ขั้ว','4 ขั้ว'], correct:0, explain:'แม่เหล็กมี 2 ขั้ว คือ ขั้วเหนือ (N) และขั้วใต้ (S)', tier:1},
      {q:'แม่เหล็กดูดวัตถุที่ทำจากอะไรได้?', emoji:'🔩', choices:['เหล็ก','ไม้','พลาสติก','แก้ว'], correct:0, explain:'แม่เหล็กดูดวัตถุที่ทำจากเหล็กได้', tier:1},
      {q:'แสงเดินทางเป็นเส้นแบบใด?', emoji:'🔦', choices:['เส้นตรง','เส้นโค้ง','เส้นหยัก','วงกลม'], correct:0, explain:'แสงเดินทางเป็นเส้นตรง', tier:1},
      {q:'เงาเกิดขึ้นได้เพราะอะไร?', emoji:'🌑', choices:['แสงถูกวัตถุบัง','ไม่มีแสง','วัตถุร้อน','วัตถุเปียก'], correct:0, explain:'เงาเกิดเมื่อวัตถุบังทางเดินของแสง', tier:1},
      {q:'ขั้วแม่เหล็กที่ "เหมือนกัน" จะเป็นอย่างไร?', emoji:'🧲', choices:['ผลักกัน','ดึงดูดกัน','ติดกัน','หายไป'], correct:0, explain:'ขั้วเหมือนกันจะผลักกัน', tier:1},
      {q:'ขั้วแม่เหล็กที่ "ต่างกัน" จะเป็นอย่างไร?', emoji:'🧲', choices:['ดึงดูดกัน','ผลักกัน','ระเบิด','ไม่มีอะไรเกิดขึ้น'], correct:0, explain:'ขั้วต่างกันจะดึงดูดกัน', tier:1},
      {q:'การออกแรงดันหรือดึง ทำให้วัตถุเป็นอย่างไร?', emoji:'💪', choices:['เคลื่อนที่','หายไป','เปลี่ยนสี','ร้อนขึ้นทันที'], correct:0, explain:'แรงทำให้วัตถุเคลื่อนที่หรือเปลี่ยนรูปร่าง', tier:1},
      {q:'พลังงานแสงและความร้อนจากธรรมชาติมาจากอะไร?', emoji:'☀️', choices:['ดวงอาทิตย์','ดวงจันทร์','ก้อนเมฆ','ดวงดาว'], correct:0, explain:'ดวงอาทิตย์เป็นแหล่งพลังงานแสงและความร้อน', tier:1},
      /* tier2 — จำแนกแรง/สมบัติแสง/พลังงาน (ยาก) */
      {q:'แรงชนิดใดเป็น "แรงไม่สัมผัส" (ไม่ต้องแตะก็มีแรง)?', emoji:'🧲', choices:['แรงแม่เหล็ก','แรงเสียดทาน','แรงดึงเชือก','แรงผลักประตู'], correct:0, explain:'แรงแม่เหล็กและแรงโน้มถ่วงเป็นแรงไม่สัมผัส', tier:2},
      {q:'ลูกบอลที่กลิ้งบนพื้นแล้วค่อยๆ หยุด เพราะแรงอะไร?', emoji:'⚽', choices:['แรงเสียดทาน','แรงแม่เหล็ก','แรงลม','ไม่มีแรง'], correct:0, explain:'แรงเสียดทานระหว่างลูกบอลกับพื้นทำให้หยุด', tier:2},
      {q:'วัตถุที่แสงส่องผ่านได้หมดเรียกว่าอะไร?', emoji:'🪟', choices:['โปร่งใส','ทึบแสง','โปร่งแสง','มืด'], correct:0, explain:'วัตถุที่แสงผ่านได้หมด เช่น กระจกใส เรียกว่าโปร่งใส', tier:2},
      {q:'วัตถุที่แสงผ่านไม่ได้เลยเรียกว่าอะไร?', emoji:'🧱', choices:['ทึบแสง','โปร่งใส','โปร่งแสง','สะท้อน'], correct:0, explain:'วัตถุที่แสงผ่านไม่ได้ เช่น กำแพง เรียกว่าทึบแสง', tier:2},
      {q:'เข็มทิศชี้ทิศได้เพราะโลกเปรียบเหมือนอะไร?', emoji:'🧭', choices:['แม่เหล็กขนาดใหญ่','ลูกบอล','กระจก','ไฟฉาย'], correct:0, explain:'โลกมีสนามแม่เหล็ก เข็มทิศจึงชี้ทิศเหนือ-ใต้ได้', tier:2},
      {q:'พื้นผิวยิ่งขรุขระ แรงเสียดทานจะเป็นอย่างไร?', emoji:'🪨', choices:['มากขึ้น','น้อยลง','หายไป','เท่าเดิมเสมอ'], correct:0, explain:'พื้นผิวขรุขระทำให้แรงเสียดทานมากขึ้น', tier:2},
      {q:'พลังงานไฟฟ้าเปลี่ยนเป็นพลังงานแสงได้ในอุปกรณ์ใด?', emoji:'💡', choices:['หลอดไฟ','พัดลม','ตู้เย็น','ลำโพง'], correct:0, explain:'หลอดไฟเปลี่ยนพลังงานไฟฟ้าเป็นแสง', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: แรงโน้มถ่วง-น้ำหนัก, พลังงานรูปแบบต่างๆ, สถานะสสาร */
      {q:'"น้ำหนัก" ของวัตถุเกิดจากแรงชนิดใดดึงดูด?', emoji:'⚖️', choices:['แรงโน้มถ่วงของโลก','แรงแม่เหล็ก','แรงลม','แรงเสียดทาน'], correct:0, explain:'น้ำหนักคือแรงที่โลกดึงดูดวัตถุ (แรงโน้มถ่วง)', tier:3},
      {q:'พัดลมเปลี่ยนพลังงานไฟฟ้าเป็นพลังงานรูปแบบใด?', emoji:'💨', choices:['พลังงานกล (การเคลื่อนที่)','พลังงานแสง','พลังงานเสียงอย่างเดียว','พลังงานความเย็น'], correct:0, explain:'พัดลมหมุนใบพัด เปลี่ยนไฟฟ้าเป็นพลังงานกล', tier:3},
      {q:'สสารมี 3 สถานะคืออะไร?', emoji:'🧊', choices:['ของแข็ง ของเหลว แก๊ส','ร้อน อุ่น เย็น','เล็ก กลาง ใหญ่','ดำ ขาว เทา'], correct:0, explain:'สสารมี 3 สถานะ: ของแข็ง ของเหลว และแก๊ส', tier:3},
      {q:'น้ำแข็ง (ของแข็ง) เมื่อได้รับความร้อนจะเปลี่ยนเป็นสถานะใด?', emoji:'💧', choices:['ของเหลว (น้ำ)','แก๊สทันที','ของแข็งแข็งขึ้น','หายไป'], correct:0, explain:'น้ำแข็งได้รับความร้อนจะละลายเป็นน้ำ (ของเหลว)', tier:3},
      {q:'พลังงานที่สะสมในแบตเตอรี่เป็นพลังงานรูปแบบใด?', emoji:'🔋', choices:['พลังงานเคมี','พลังงานแสง','พลังงานเสียง','พลังงานลม'], correct:0, explain:'แบตเตอรี่เก็บพลังงานเคมี แล้วเปลี่ยนเป็นไฟฟ้า', tier:3}
    ]
  },
  {
    id:'p3-sci2', name:'วิทยาศาสตร์ ป.3 · สิ่งมีชีวิตและพืช', emoji:'🧬', icon:'assets/icons/p3-sci2.svg', color:'#2FA36B', light:'#D9F2E4', grade:'p3', poolPick:10, isNew:true,
    questions:[
      /* tier1 — ส่วนของพืช/ความต้องการของสิ่งมีชีวิต (ง่าย) */
      {q:'ส่วนของพืชที่ดูดน้ำและแร่ธาตุจากดินคือส่วนใด?', emoji:'🌱', choices:['ราก','ใบ','ดอก','ผล'], correct:0, explain:'รากดูดน้ำและแร่ธาตุจากดิน', tier:1},
      {q:'ส่วนของพืชที่สร้างอาหาร (สังเคราะห์แสง) คือส่วนใด?', emoji:'🌿', choices:['ใบ','ราก','ลำต้น','ดอก'], correct:0, explain:'ใบสร้างอาหารด้วยการสังเคราะห์แสง', tier:1},
      {q:'ส่วนของพืชที่ทำหน้าที่สืบพันธุ์คือส่วนใด?', emoji:'🌸', choices:['ดอก','ราก','ใบ','ลำต้น'], correct:0, explain:'ดอกเป็นส่วนที่ใช้สืบพันธุ์ของพืช', tier:1},
      {q:'สิ่งมีชีวิตต้องการสิ่งใดเพื่อการเจริญเติบโต?', emoji:'💧', choices:['อาหาร น้ำ และอากาศ','ของเล่น','โทรทัศน์','เงินทอง'], correct:0, explain:'สิ่งมีชีวิตต้องการอาหาร น้ำ และอากาศ', tier:1},
      {q:'สัตว์กลุ่มใดหายใจด้วยเหงือก?', emoji:'🐟', choices:['ปลา','นก','แมว','งู'], correct:0, explain:'ปลาหายใจด้วยเหงือก', tier:1},
      {q:'สัตว์ชนิดใดเลี้ยงลูกด้วยนม?', emoji:'🐄', choices:['วัว','ปลา','นก','กบ'], correct:0, explain:'วัวเป็นสัตว์เลี้ยงลูกด้วยนม', tier:1},
      {q:'ลำต้นของพืชทำหน้าที่อะไร?', emoji:'🌳', choices:['ลำเลียงน้ำและค้ำจุนต้น','สร้างอาหารอย่างเดียว','ดูดน้ำ','สืบพันธุ์'], correct:0, explain:'ลำต้นลำเลียงน้ำ-อาหารและค้ำจุนต้นพืช', tier:1},
      {q:'สิ่งใดต่อไปนี้ "ไม่ใช่" สิ่งมีชีวิต?', emoji:'🪨', choices:['ก้อนหิน','ต้นไม้','ปลา','คน'], correct:0, explain:'ก้อนหินไม่ใช่สิ่งมีชีวิต เพราะไม่กิน ไม่โต ไม่สืบพันธุ์', tier:1},
      {q:'พืชสร้างอาหารโดยใช้แสงจากอะไร?', emoji:'☀️', choices:['ดวงอาทิตย์','หลอดไฟบ้าน','ดวงจันทร์','ไฟฉาย'], correct:0, explain:'พืชใช้แสงจากดวงอาทิตย์สังเคราะห์อาหาร', tier:1},
      /* tier2 — จำแนกสัตว์/พืชมีดอก-ไม่มีดอก/วงจรชีวิต (ยาก) */
      {q:'กบจัดอยู่ในสัตว์กลุ่มใด?', emoji:'🐸', choices:['สัตว์สะเทินน้ำสะเทินบก','สัตว์เลื้อยคลาน','ปลา','นก'], correct:0, explain:'กบอยู่ได้ทั้งบนบกและในน้ำ เป็นสัตว์สะเทินน้ำสะเทินบก', tier:2},
      {q:'งูและจิ้งจกจัดเป็นสัตว์กลุ่มใด?', emoji:'🐍', choices:['สัตว์เลื้อยคลาน','สัตว์ปีก','ปลา','สัตว์เลี้ยงลูกด้วยนม'], correct:0, explain:'งูและจิ้งจกเป็นสัตว์เลื้อยคลาน', tier:2},
      {q:'สัตว์ชนิดใด "ไม่มีกระดูกสันหลัง"?', emoji:'🐜', choices:['มด','ปลา','นก','แมว'], correct:0, explain:'มด (แมลง) เป็นสัตว์ไม่มีกระดูกสันหลัง', tier:2},
      {q:'ผีเสื้อมีการเจริญเติบโตตามลำดับใด?', emoji:'🦋', choices:['ไข่ → หนอน → ดักแด้ → ผีเสื้อ','ผีเสื้อ → ไข่ → หนอน','หนอน → ไข่ → ผีเสื้อ','ไข่ → ผีเสื้อ'], correct:0, explain:'ผีเสื้อเติบโตแบบ ไข่ → หนอน → ดักแด้ → ผีเสื้อ', tier:2},
      {q:'พืชมีดอกต่างจากพืชไม่มีดอกอย่างไร?', emoji:'🌺', choices:['พืชมีดอกมีดอกไว้สืบพันธุ์','พืชมีดอกไม่มีราก','พืชมีดอกไม่มีใบ','ไม่ต่างกัน'], correct:0, explain:'พืชมีดอก เช่น กุหลาบ มีดอกไว้สืบพันธุ์ ต่างจากเฟิร์น/มอสที่ไม่มีดอก', tier:2},
      {q:'ส่วนใดของดอกที่เจริญกลายเป็นผล?', emoji:'🍎', choices:['รังไข่ในดอก','กลีบดอก','ก้านใบ','ราก'], correct:0, explain:'หลังการผสมพันธุ์ รังไข่ในดอกจะเจริญเป็นผล', tier:2},
      {q:'สัตว์เลี้ยงลูกด้วยนมหายใจด้วยอวัยวะใด?', emoji:'🫁', choices:['ปอด','เหงือก','ผิวหนัง','ราก'], correct:0, explain:'สัตว์เลี้ยงลูกด้วยนมหายใจด้วยปอด', tier:2},
      /* tier3 — เนื้อหาเร่ง ป.4: จำแนกสัตว์มีกระดูกสันหลัง 5 กลุ่ม + โปร่งใส/โปร่งแสง/ทึบแสง */
      {q:'สัตว์มีกระดูกสันหลังแบ่งเป็นกี่กลุ่มใหญ่?', emoji:'🦴', choices:['5 กลุ่ม','2 กลุ่ม','10 กลุ่ม','3 กลุ่ม'], correct:0, explain:'ปลา/สะเทินน้ำสะเทินบก/เลื้อยคลาน/นก/เลี้ยงลูกด้วยนม รวม 5 กลุ่ม', tier:3},
      {q:'ปลาวาฬจัดอยู่ในสัตว์กลุ่มใด?', emoji:'🐳', choices:['สัตว์เลี้ยงลูกด้วยนม','ปลา','สัตว์เลื้อยคลาน','ปลาหมึก'], correct:0, explain:'วาฬหายใจด้วยปอดและเลี้ยงลูกด้วยนม แม้อยู่ในน้ำ', tier:3},
      {q:'เต่าจัดอยู่ในสัตว์กลุ่มใด?', emoji:'🐢', choices:['สัตว์เลื้อยคลาน','ปลา','สัตว์เลี้ยงลูกด้วยนม','สัตว์ปีก'], correct:0, explain:'เต่าเป็นสัตว์เลื้อยคลาน (มีเกล็ด วางไข่)', tier:3},
      {q:'"แครอท" ที่เรากิน เป็นส่วนใดของพืช?', emoji:'🥕', choices:['ราก','ใบ','ดอก','ผล'], correct:0, explain:'แครอทคือรากที่สะสมอาหารของพืช', tier:3},
      {q:'พืชที่ไม่มีดอกและสืบพันธุ์ด้วยสปอร์คือพืชชนิดใด?', emoji:'🌿', choices:['เฟิร์น','กุหลาบ','มะม่วง','ทานตะวัน'], correct:0, explain:'เฟิร์นเป็นพืชไม่มีดอก สืบพันธุ์ด้วยสปอร์', tier:3}
    ]
  },

  /* ---------- Phase 3.5: เกมฝึกทักษะต่อยอด ป.3 (reuse engine เดิม) ---------- */
  {
    /* ฟังคำอังกฤษ ป.3 — คำ 4-5 ตัวอักษร (ต่อจาก ป.2 ที่จบที่ 5 และก่อน ป.4 ที่ไปถึง 7) */
    id:'p3-listen-en', name:'ฟังคำอังกฤษ ป.3', emoji:'📻', icon:'assets/icons/p3-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', wordLens:[4,5,5], levels:10, grade:'p3', isNew:true
  },
  {
    /* ฟังสะกดคำไทย ป.3 — คำ 4-6 ตัวอักษร */
    id:'p3-listen-th', name:'ฟังสะกดคำไทย ป.3', emoji:'📢', icon:'assets/icons/p3-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[4,5,6], levels:10, grade:'p3', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.3 — ประโยคไทยมีเหตุ-ผล 6-7 คำ */
    id:'p3-cloze1', name:'ฟังประโยคเติมคำ ป.3 · 1', emoji:'🗞', icon:'assets/icons/p3-cloze1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en4', clozeBlanks:[1,1,2], clozeDecoys:[3,4,4], levels:10, grade:'p3', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.3 — ประโยคอังกฤษ 5-6 คำ */
    id:'p3-cloze2', name:'ฟังประโยคเติมคำ ป.3 · 2', emoji:'📧', icon:'assets/icons/p3-cloze2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en4', clozeBlanks:[1,2,2], clozeDecoys:[4,4,5], levels:10, grade:'p3', isNew:true
  },
  { id:'p3-iq3', name:'เชาวน์ ป.3 · นกฮูกสั่ง', emoji:'🦉', icon:'assets/icons/p3-iq3.svg', color:'#17A65B', light:'#D6F3E4', type:'skill', mode:'ef', levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-code1', name:'พาหุ่นยนต์ ป.3 · 1', emoji:'👾', icon:'assets/icons/p3-code1.svg', color:'#2BB3A3', light:'#D6F5F1', type:'skill', mode:'code', codeSet:'p3a', codeLoop:true, levels:10, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-code2', name:'พาหุ่นยนต์ ป.3 · 2', emoji:'🛸', icon:'assets/icons/p3-code2.svg', color:'#2596A0', light:'#D6F1F5', type:'skill', mode:'code', codeSet:'p3b', codeLoop:true, levels:8, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-code3', name:'พาหุ่นยนต์ ป.3 · 3', emoji:'🎛️', icon:'assets/icons/p3-code3.svg', color:'#1F7E88', light:'#D6EDF0', type:'skill', mode:'code', codeSet:'p3c', codeLoop:true, levels:8, handPlay:true, grade:'p3', isNew:true },
  { id:'p3-code4', name:'ถ้าเจอกำแพงให้เลี้ยว', emoji:'🔀', icon:'assets/icons/p3-code4.svg', color:'#1B6E77', light:'#D3EBEE', type:'skill', mode:'code', codeSet:'p3if', codeLoop:true, codeCond:true, levels:10, handPlay:true, grade:'p3', isNew:true },

  /* ---------- ดนตรี ป.3 (quiz) ---------- */
  {
    id:'p3-music1', name:'ดนตรี ป.3 · เครื่องดนตรีและการบรรเลง', emoji:'📯', icon:'assets/icons/p3-music1.svg', color:'#4C8DF0', light:'#DEEAFC', grade:'p3', poolPick:10, isNew:true,
    questions:[
      {q:'เครื่องดนตรีชนิดใดใช้วิธี "เป่า" ให้เกิดเสียง?', emoji:'🎺', choices:['ทรัมเป็ต','กลอง','กีตาร์','ระนาด'], correct:0, explain:'ทรัมเป็ตเป็นเครื่องเป่า', tier:1},
      {q:'เครื่องดนตรีชนิดใดใช้วิธี "ตี"?', emoji:'🥁', choices:['กลอง','ขลุ่ย','ไวโอลิน','ทรัมเป็ต'], correct:0, explain:'กลองเป็นเครื่องตี', tier:1},
      {q:'เครื่องดนตรีชนิดใดใช้วิธี "ดีด"?', emoji:'🎸', choices:['กีตาร์','กลอง','ขลุ่ย','ฉาบ'], correct:0, explain:'กีตาร์เป็นเครื่องดีด', tier:1},
      {q:'ไวโอลินเล่นด้วยวิธีใด?', emoji:'🎻', choices:['สี','เป่า','ตี','ดีด'], correct:0, explain:'ไวโอลินใช้คันชักสีที่สาย', tier:1},
      {q:'เสียงเกิดจากการทำอะไรของวัตถุ?', emoji:'🔔', choices:['การสั่นสะเทือน','การเปลี่ยนสี','การละลาย','การแข็งตัว'], correct:0, explain:'เสียงเกิดจากวัตถุสั่นสะเทือน', tier:1},
      {q:'ระนาดเป็นเครื่องดนตรีประเภทใด?', emoji:'🎼', choices:['เครื่องตี','เครื่องเป่า','เครื่องสาย','เครื่องดีด'], correct:0, explain:'ระนาดใช้ไม้ตี เป็นเครื่องตี', tier:1},
      {q:'ซอเป็นเครื่องดนตรีไทยที่เล่นด้วยวิธีใด?', emoji:'🪕', choices:['สี','ตี','เป่า','เขย่า'], correct:0, explain:'ซอใช้คันชักสี', tier:1},
      {q:'เปียโนทำให้เกิดเสียงเมื่อเราทำอะไร?', emoji:'🎹', choices:['กดคีย์','เป่า','สี','เขย่า'], correct:0, explain:'เปียโนเกิดเสียงเมื่อกดคีย์', tier:1},
      {q:'รีคอร์เดอร์ทำให้เกิดเสียงด้วยวิธีใด?', emoji:'🎶', choices:['เป่าลมเข้าไป','ตีด้วยไม้','ดีดสาย','สีด้วยคันชัก'], correct:0, explain:'รีคอร์เดอร์เป็นเครื่องเป่า เป่าลมเข้าไป', tier:2},
      {q:'เราได้ยินเสียงเพราะเสียงเดินทางผ่านอะไรมาถึงหู?', emoji:'👂', choices:['อากาศ','แสง','ไฟฟ้า','สายตา'], correct:0, explain:'เสียงเดินทางผ่านอากาศมาถึงหูเรา', tier:2},
      {q:'ฉิ่ง ฉาบ กรับ จัดเป็นเครื่องดนตรีประเภทใด?', emoji:'🎵', choices:['เครื่องตีประกอบจังหวะ','เครื่องเป่า','เครื่องสาย','เครื่องดีด'], correct:0, explain:'ฉิ่ง ฉาบ กรับ เป็นเครื่องตีให้จังหวะ', tier:2},
      {q:'วงดนตรีไทยที่มีระนาดและฆ้องวงเรียกว่าวงอะไร?', emoji:'🥁', choices:['วงปี่พาทย์','วงดุริยางค์','วงร็อก','วงลูกทุ่ง'], correct:0, explain:'วงที่มีระนาด ฆ้องวง คือวงปี่พาทย์', tier:2},
      {q:'เสียงสูงกับเสียงต่ำ ต่างกันอย่างไร?', emoji:'📈', choices:['ระดับเสียงต่างกัน','ความดังต่างกัน','สีต่างกัน','ไม่ต่างกัน'], correct:0, explain:'เสียงสูง-ต่ำต่างกันที่ระดับเสียง', tier:2},
      {q:'ทรัมเป็ตทำจากวัสดุใดเป็นหลัก?', emoji:'🎺', choices:['โลหะ (ทองเหลือง)','ไม้','แก้ว','ยาง'], correct:0, explain:'ทรัมเป็ตเป็นเครื่องเป่าทองเหลือง', tier:2},
      {q:'ฉาบ 2 อันตีกระทบกันเป็นเครื่องดนตรีประเภทใด?', emoji:'🥁', choices:['เครื่องตี','เครื่องเป่า','เครื่องสาย','เครื่องดีด'], correct:0, explain:'ฉาบใช้ตีกระทบกัน เป็นเครื่องตี', tier:1},
      {q:'พิณและจะเข้ เล่นด้วยวิธีใด?', emoji:'🪕', choices:['ดีด','เป่า','สี','ตี'], correct:0, explain:'พิณและจะเข้เป็นเครื่องดีด', tier:1},
      {q:'แซกโซโฟนเล่นด้วยวิธีใด?', emoji:'🎷', choices:['เป่า','ตี','ดีด','สี'], correct:0, explain:'แซกโซโฟนเป็นเครื่องเป่า', tier:1},
      {q:'กลองชุดใช้ส่วนใดของร่างกายในการเล่น?', emoji:'🥁', choices:['มือและเท้า','ปากอย่างเดียว','ตา','จมูก'], correct:0, explain:'กลองชุดตีด้วยไม้ในมือและเหยียบด้วยเท้า', tier:1},
      {q:'เครื่องดนตรีใดต่อไปนี้ "ไม่ใช่" เครื่องสาย?', emoji:'🎶', choices:['ขลุ่ย','กีตาร์','ไวโอลิน','ซอ'], correct:0, explain:'ขลุ่ยเป็นเครื่องเป่า ที่เหลือเป็นเครื่องสาย', tier:2},
      {q:'อูคูเลเล่เป็นเครื่องดนตรีประเภทเดียวกับอะไร?', emoji:'🎸', choices:['กีตาร์ (ดีด)','กลอง','ขลุ่ย','ซอ'], correct:0, explain:'อูคูเลเล่ใช้ดีดสายเหมือนกีตาร์', tier:2},
      {q:'วงดนตรีที่มีกีตาร์ กลองชุด และเบส เรียกว่าวงประเภทใด?', emoji:'🎸', choices:['วงสตริง','วงปี่พาทย์','วงมโหรี','วงเครื่องสายไทย'], correct:0, explain:'กีตาร์+กลองชุด+เบส เป็นวงสตริง (สมัยใหม่)', tier:2},
      {q:'เสียงนกร้องหรือเสียงน้ำไหล จัดเป็นเสียงประเภทใด?', emoji:'🐦', choices:['เสียงจากธรรมชาติ','เสียงเครื่องดนตรี','เสียงคนร้อง','เสียงเครื่องจักร'], correct:0, explain:'เสียงนก เสียงน้ำ เป็นเสียงจากธรรมชาติ', tier:2}
    ]
  },
  {
    id:'p3-music2', name:'ดนตรี ป.3 · โน้ตและจังหวะ', emoji:'🪘', icon:'assets/icons/p3-music2.svg', color:'#2F6BC4', light:'#DEEAFC', grade:'p3', poolPick:10, isNew:true,
    questions:[
      {q:'โน้ตดนตรีไทยตัวแรกคือตัวใด?', emoji:'🎵', choices:['โด','ที','ซอล','ฟา'], correct:0, explain:'ลำดับโน้ตเริ่มที่ โด เร มี...', tier:1},
      {q:'โน้ตสากลตัว C ตรงกับโน้ตไทยตัวใด?', emoji:'🎼', choices:['โด','เร','มี','ฟา'], correct:0, explain:'C = โด', tier:1},
      {q:'เรียงโน้ตให้ถูก: โด เร ▢ ฟา', emoji:'🎶', choices:['มี','ซอล','ที','ลา'], correct:0, explain:'ลำดับคือ โด เร มี ฟา', tier:1},
      {q:'การเคาะจังหวะสม่ำเสมอเรียกว่าอะไร?', emoji:'🥁', choices:['จังหวะ','ทำนอง','เนื้อร้อง','เสียงประสาน'], correct:0, explain:'การเคาะสม่ำเสมอคือจังหวะ', tier:1},
      {q:'เพลงที่ร้องช้าๆ เบาๆ ก่อนนอนเรียกว่าเพลงอะไร?', emoji:'🌙', choices:['เพลงกล่อมเด็ก','เพลงเชียร์','เพลงเดินแถว','เพลงปลุก'], correct:0, explain:'เพลงช้าเบาก่อนนอนคือเพลงกล่อมเด็ก', tier:1},
      {q:'ตัวโน้ตที่เขียนบนเส้นบรรทัด 5 เส้นเรียกว่าอะไร?', emoji:'🎼', choices:['บรรทัด 5 เส้น','ตาราง','กราฟ','ปฏิทิน'], correct:0, explain:'โน้ตเขียนบนบรรทัด 5 เส้น', tier:1},
      {q:'โน้ตตัวถัดจาก "มี" คือตัวใด?', emoji:'🎵', choices:['ฟา','เร','โด','ลา'], correct:0, explain:'ลำดับคือ มี ฟา ซอล', tier:1},
      {q:'D ในโน้ตสากลตรงกับโน้ตไทยตัวใด?', emoji:'🎹', choices:['เร','โด','มี','ซอล'], correct:0, explain:'D = เร', tier:1},
      {q:'เรียงโน้ตจากต่ำไปสูงข้อใดถูก?', emoji:'📈', choices:['โด เร มี ฟา','ฟา มี เร โด','มี โด ฟา เร','เร ฟา โด มี'], correct:0, explain:'จากต่ำไปสูงคือ โด เร มี ฟา', tier:2},
      {q:'ถ้าเคาะจังหวะเร็วขึ้น เพลงจะเป็นอย่างไร?', emoji:'⚡', choices:['สนุกกระชับขึ้น','ช้าลง','เงียบลง','ไม่เปลี่ยน'], correct:0, explain:'จังหวะเร็วทำให้เพลงกระชับสนุกขึ้น', tier:2},
      {q:'โน้ต 7 ตัว (โด เร มี ฟา ซอล ลา ที) แล้วขึ้นตัวใหม่คือตัวใด?', emoji:'🎶', choices:['โด (สูงขึ้น)','ที','ซอล','เร'], correct:0, explain:'ครบ 7 ตัวจะวนกลับมา โด อีกครั้ง (สูงขึ้น)', tier:2},
      {q:'สัญลักษณ์ที่บอกความช้า-เร็วของเพลงเรียกว่าอะไร?', emoji:'⏱️', choices:['จังหวะ (Tempo)','สีของโน้ต','ชื่อเพลง','เนื้อร้อง'], correct:0, explain:'ความช้า-เร็วของเพลงคือจังหวะ/tempo', tier:2},
      {q:'G ในโน้ตสากลตรงกับโน้ตไทยตัวใด?', emoji:'🎼', choices:['ซอล','ลา','ฟา','ที'], correct:0, explain:'G = ซอล', tier:2},
      {q:'การปรบมือตามเพลงเป็นการฝึกเรื่องใด?', emoji:'👏', choices:['จังหวะ','การวาดภาพ','การอ่าน','การนับเงิน'], correct:0, explain:'ปรบมือตามเพลงคือการฝึกจังหวะ', tier:2},
      {q:'F ในโน้ตสากลตรงกับโน้ตไทยตัวใด?', emoji:'🎼', choices:['ฟา','มี','ซอล','เร'], correct:0, explain:'F = ฟา', tier:1},
      {q:'A ในโน้ตสากลตรงกับโน้ตไทยตัวใด?', emoji:'🎹', choices:['ลา','ที','ซอล','โด'], correct:0, explain:'A = ลา', tier:1},
      {q:'โน้ตตัวก่อน "ซอล" คือตัวใด?', emoji:'🎵', choices:['ฟา','ลา','มี','ที'], correct:0, explain:'ลำดับคือ ฟา ซอล ลา ตัวก่อนซอลคือฟา', tier:1},
      {q:'เติมโน้ตให้ครบ: โด เร มี ฟา ▢ ลา ที', emoji:'🎶', choices:['ซอล','โด','เร','มี'], correct:0, explain:'ลำดับที่ขาดคือ ซอล', tier:1},
      {q:'เพลงที่ใช้เดินสวนสนามควรมีจังหวะแบบใด?', emoji:'🥁', choices:['หนักแน่นสม่ำเสมอ','ช้าเนิบนาบ','เงียบมาก','ไม่มีจังหวะ'], correct:0, explain:'เพลงเดินแถวต้องจังหวะหนักแน่นสม่ำเสมอ', tier:2},
      {q:'B ในโน้ตสากลตรงกับโน้ตไทยตัวใด?', emoji:'🎼', choices:['ที','ลา','ซอล','โด'], correct:0, explain:'B = ที', tier:2},
      {q:'ถ้าเคาะจังหวะช้าลง เพลงจะให้ความรู้สึกอย่างไร?', emoji:'🐌', choices:['สงบ นุ่มนวล','ตื่นเต้นเร็ว','ดังขึ้น','สูงขึ้น'], correct:0, explain:'จังหวะช้าทำให้เพลงฟังสงบนุ่มนวล', tier:2},
      {q:'โน้ตเรียงลงจากสูงไปต่ำข้อใดถูก?', emoji:'📉', choices:['ที ลา ซอล ฟา','โด เร มี ฟา','ฟา ซอล ลา ที','มี ฟา ซอล ลา'], correct:0, explain:'จากสูงไปต่ำคือ ที ลา ซอล ฟา', tier:2}
    ]
  },

  /* ---------- ศิลปะ ป.3 (quiz) ---------- */
  {
    id:'p3-art1', name:'ศิลปะ ป.3 · องค์ประกอบและสี', emoji:'🩰', icon:'assets/icons/p3-art1.svg', color:'#FF7A45', light:'#FFE4D6', grade:'p3', poolPick:10, isNew:true,
    questions:[
      {q:'แม่สีมีกี่สี?', emoji:'🎨', choices:['3 สี','2 สี','5 สี','7 สี'], correct:0, explain:'แม่สีมี 3 สี คือ แดง เหลือง น้ำเงิน', tier:1},
      {q:'สีแดงผสมกับสีเหลืองได้สีอะไร?', emoji:'🟠', choices:['สีส้ม','สีเขียว','สีม่วง','สีน้ำตาล'], correct:0, explain:'แดง + เหลือง = ส้ม', tier:1},
      {q:'สีน้ำเงินผสมกับสีเหลืองได้สีอะไร?', emoji:'🟢', choices:['สีเขียว','สีส้ม','สีม่วง','สีชมพู'], correct:0, explain:'น้ำเงิน + เหลือง = เขียว', tier:1},
      {q:'สีแดงผสมกับสีน้ำเงินได้สีอะไร?', emoji:'🟣', choices:['สีม่วง','สีเขียว','สีส้ม','สีเทา'], correct:0, explain:'แดง + น้ำเงิน = ม่วง', tier:1},
      {q:'สีใดให้ความรู้สึก "ร้อน"?', emoji:'🔥', choices:['สีแดง','สีฟ้า','สีเขียว','สีขาว'], correct:0, explain:'สีแดง ส้ม เหลือง เป็นสีโทนร้อน', tier:1},
      {q:'สีใดให้ความรู้สึก "เย็น"?', emoji:'❄️', choices:['สีฟ้า','สีแดง','สีส้ม','สีเหลือง'], correct:0, explain:'สีฟ้า น้ำเงิน เขียว เป็นสีโทนเย็น', tier:1},
      {q:'การวางภาพให้ทั้งสองข้างเท่าๆ กันเรียกว่าอะไร?', emoji:'⚖️', choices:['สมดุล','ซ้ำ','จุดเด่น','ว่างเปล่า'], correct:0, explain:'สองข้างเท่ากันคือความสมดุล', tier:1},
      {q:'การใช้ลวดลายเดิมซ้ำๆ ต่อกันเรียกว่าอะไร?', emoji:'🔁', choices:['การซ้ำ','สมดุล','จุดเด่น','เงา'], correct:0, explain:'ลวดลายซ้ำๆ คือการซ้ำ (pattern)', tier:1},
      {q:'สิ่งที่ดึงดูดสายตาที่สุดในภาพเรียกว่าอะไร?', emoji:'⭐', choices:['จุดเด่น','พื้นหลัง','กรอบ','เงา'], correct:0, explain:'สิ่งที่เด่นสะดุดตาที่สุดคือจุดเด่น', tier:2},
      {q:'สีขาวผสมกับสีแดงจะได้สีอะไร?', emoji:'🩷', choices:['สีชมพู (อ่อนลง)','สีดำ','สีเขียว','สีฟ้า'], correct:0, explain:'ผสมขาวทำให้สีอ่อนลง แดง+ขาว = ชมพู', tier:2},
      {q:'ถ้าอยากให้ภาพดูมีจุดเด่น ควรทำอย่างไร?', emoji:'🎯', choices:['ใช้สีหรือขนาดต่างจากส่วนอื่น','ทำให้ทุกอย่างเหมือนกันหมด','ใช้สีเดียวทั้งภาพ','ปล่อยว่าง'], correct:0, explain:'ทำให้ต่างจากส่วนอื่นจะกลายเป็นจุดเด่น', tier:2},
      {q:'สีตรงข้ามกันในวงจรสี เมื่ออยู่ด้วยกันจะเป็นอย่างไร?', emoji:'🎨', choices:['ตัดกันเด่นชัด','กลมกลืนหายไป','กลายเป็นสีเดียว','มองไม่เห็น'], correct:0, explain:'สีตรงข้ามอยู่ด้วยกันจะตัดกันเด่นชัด', tier:2},
      {q:'สีดำผสมกับสีเหลืองเล็กน้อยจะได้ผลอย่างไร?', emoji:'🟡', choices:['สีเข้มลง','สีสว่างขึ้น','เป็นสีขาว','เป็นสีแดง'], correct:0, explain:'ผสมดำทำให้สีเข้มลง', tier:2},
      {q:'ภาพที่มีทั้งสมดุล การซ้ำ และจุดเด่น จะดูเป็นอย่างไร?', emoji:'🖼️', choices:['สวยงามน่ามอง','ยุ่งเหยิง','ว่างเปล่า','น่ากลัว'], correct:0, explain:'มีองค์ประกอบครบจะดูสวยงามลงตัว', tier:2},
      {q:'สีเหลืองผสมกับสีน้ำเงินได้สีอะไร?', emoji:'🟢', choices:['สีเขียว','สีส้ม','สีม่วง','สีน้ำตาล'], correct:0, explain:'เหลือง + น้ำเงิน = เขียว', tier:1},
      {q:'สีใดเป็นสีโทนเย็น?', emoji:'💙', choices:['สีน้ำเงิน','สีแดง','สีส้ม','สีเหลือง'], correct:0, explain:'น้ำเงิน ฟ้า เขียว เป็นสีโทนเย็น', tier:1},
      {q:'ระบายสีในภาพควรระบายอย่างไรให้สวย?', emoji:'🖍️', choices:['ระบายไปทางเดียวกันให้เรียบ','ระบายมั่วทุกทิศ','ระบายออกนอกเส้น','ไม่ต้องระบาย'], correct:0, explain:'ระบายไปทางเดียวกันจะเรียบเนียนสวย', tier:1},
      {q:'แม่สีทั้งสามคือสีอะไรบ้าง?', emoji:'🎨', choices:['แดง เหลือง น้ำเงิน','ดำ ขาว เทา','เขียว ส้ม ม่วง','ชมพู ฟ้า ทอง'], correct:0, explain:'แม่สีคือ แดง เหลือง น้ำเงิน', tier:1},
      {q:'สีคู่ตรงข้ามของสีแดงในวงจรสีคือสีใด?', emoji:'🟢', choices:['สีเขียว','สีส้ม','สีเหลือง','สีชมพู'], correct:0, explain:'สีคู่ตรงข้ามของแดงคือเขียว', tier:2},
      {q:'ถ้าอยากได้สีน้ำตาลควรผสมสีใดเข้าด้วยกัน?', emoji:'🟤', choices:['แดง เหลือง น้ำเงิน รวมกัน','ขาวกับดำ','ฟ้ากับชมพู','เขียวกับเหลือง'], correct:0, explain:'ผสมแม่สีทั้งสามจะได้สีน้ำตาล', tier:2},
      {q:'การจัดวางให้มีที่ว่าง (พื้นที่ว่าง) ในภาพมีประโยชน์อย่างไร?', emoji:'🖼️', choices:['ทำให้ภาพดูไม่อึดอัด','ทำให้ภาพว่างเปล่า','ทำให้ภาพเสีย','ไม่มีประโยชน์'], correct:0, explain:'ที่ว่างช่วยให้ภาพดูโปร่ง ไม่อึดอัด', tier:2},
      {q:'สีอ่อน-สีเข้ม (น้ำหนักสี) ในภาพช่วยเรื่องใด?', emoji:'🌗', choices:['ทำให้ภาพมีมิติ ตื้น-ลึก','ทำให้ภาพแบน','ทำให้ภาพมืด','ไม่ช่วยอะไร'], correct:0, explain:'น้ำหนักสีอ่อน-เข้มทำให้ภาพมีมิติ', tier:2}
    ]
  },
  {
    id:'p3-art2', name:'ศิลปะ ป.3 · เส้น รูปทรง และงานสร้างสรรค์', emoji:'🧵', icon:'assets/icons/p3-art2.svg', color:'#D9542F', light:'#FFE4D6', grade:'p3', poolPick:10, isNew:true,
    questions:[
      {q:'เส้นที่ลากจากซ้ายไปขวาเรียกว่าเส้นอะไร?', emoji:'➖', choices:['เส้นนอน','เส้นตั้ง','เส้นโค้ง','เส้นหยัก'], correct:0, explain:'เส้นแนวซ้าย-ขวาคือเส้นนอน', tier:1},
      {q:'เส้นที่ลากจากบนลงล่างเรียกว่าเส้นอะไร?', emoji:'📏', choices:['เส้นตั้ง','เส้นนอน','เส้นเฉียง','เส้นวน'], correct:0, explain:'เส้นแนวบน-ล่างคือเส้นตั้ง', tier:1},
      {q:'รูปทรงที่มี 3 ด้านคือรูปอะไร?', emoji:'🔺', choices:['สามเหลี่ยม','สี่เหลี่ยม','วงกลม','ห้าเหลี่ยม'], correct:0, explain:'3 ด้านคือสามเหลี่ยม', tier:1},
      {q:'รูปทรงที่กลมไม่มีมุมคือรูปอะไร?', emoji:'⭕', choices:['วงกลม','สี่เหลี่ยม','สามเหลี่ยม','ดาว'], correct:0, explain:'รูปกลมไม่มีมุมคือวงกลม', tier:1},
      {q:'รูปทรงที่มี 4 ด้านเท่ากันคือรูปอะไร?', emoji:'⬜', choices:['สี่เหลี่ยมจัตุรัส','สามเหลี่ยม','วงกลม','วงรี'], correct:0, explain:'4 ด้านเท่ากันคือสี่เหลี่ยมจัตุรัส', tier:1},
      {q:'ปั้นดินน้ำมันเป็นงานศิลปะแบบใด?', emoji:'🎨', choices:['งานปั้น (3 มิติ)','งานวาด','งานร้องเพลง','งานเขียน'], correct:0, explain:'การปั้นเป็นงาน 3 มิติ', tier:1},
      {q:'สิ่งที่ใช้ระบายสีน้ำคืออะไร?', emoji:'🖌️', choices:['พู่กัน','ค้อน','กรรไกร','ไม้บรรทัด'], correct:0, explain:'ระบายสีน้ำใช้พู่กัน', tier:1},
      {q:'เส้นโค้งมนให้ความรู้สึกอย่างไร?', emoji:'〰️', choices:['นุ่มนวลอ่อนโยน','แข็งกระด้าง','น่ากลัว','เศร้า'], correct:0, explain:'เส้นโค้งให้ความรู้สึกนุ่มนวล', tier:2},
      {q:'การพับกระดาษเป็นรูปต่างๆ เรียกว่าอะไร?', emoji:'📄', choices:['ศิลปะพับกระดาษ (โอริงามิ)','การวาด','การปั้น','การทอ'], correct:0, explain:'การพับกระดาษเป็นรูปคือโอริงามิ', tier:2},
      {q:'รูปทรงเรขาคณิตกับรูปทรงอิสระต่างกันอย่างไร?', emoji:'🔷', choices:['เรขาคณิตมีแบบแผน อิสระเป็นอิสระ','เหมือนกัน','อิสระมีมุมมากกว่า','เรขาคณิตไม่มีชื่อ'], correct:0, explain:'รูปเรขาคณิตมีแบบแผน (วงกลม สี่เหลี่ยม) รูปอิสระเป็นรูปธรรมชาติ', tier:2},
      {q:'การนำวัสดุเหลือใช้มาทำงานศิลปะช่วยเรื่องใด?', emoji:'♻️', choices:['ประหยัดและรักษ์โลก','สิ้นเปลือง','ทำให้สกปรก','ไม่มีประโยชน์'], correct:0, explain:'ใช้วัสดุเหลือใช้ช่วยประหยัดและรักษ์สิ่งแวดล้อม', tier:2},
      {q:'ถ้าต้องการวาดภาพให้ดูมีระยะไกล-ใกล้ ควรทำอย่างไร?', emoji:'🏞️', choices:['ของใกล้วาดใหญ่ ของไกลวาดเล็ก','วาดเท่ากันหมด','วาดของไกลใหญ่กว่า','ไม่ระบายสี'], correct:0, explain:'ของใกล้ใหญ่ ของไกลเล็ก ทำให้เห็นระยะ', tier:2},
      {q:'งานภาพต่อ (โมเสก/ปะติด) ทำจากอะไร?', emoji:'🧩', choices:['ชิ้นเล็กๆ นำมาต่อเป็นภาพ','สีน้ำอย่างเดียว','ดินปั้น','เสียงเพลง'], correct:0, explain:'งานปะติดใช้ชิ้นเล็กๆ ต่อกันเป็นภาพ', tier:2},
      {q:'เส้นเฉียงให้ความรู้สึกอย่างไร?', emoji:'📐', choices:['เคลื่อนไหว ไม่หยุดนิ่ง','สงบนิ่ง','มั่นคง','ว่างเปล่า'], correct:0, explain:'เส้นเฉียงให้ความรู้สึกเคลื่อนไหว', tier:2},
      {q:'เส้นตรงแนวนอนให้ความรู้สึกอย่างไร?', emoji:'➖', choices:['สงบ ราบเรียบ','ตื่นเต้น','วุ่นวาย','น่ากลัว'], correct:0, explain:'เส้นนอนให้ความรู้สึกสงบ ราบเรียบ', tier:1},
      {q:'รูปทรงที่มี 5 ด้านคือรูปอะไร?', emoji:'⬠', choices:['ห้าเหลี่ยม','สี่เหลี่ยม','สามเหลี่ยม','วงกลม'], correct:0, explain:'5 ด้านคือห้าเหลี่ยม', tier:1},
      {q:'การวาดภาพระบายสีด้วยสีเทียนเรียกว่างานประเภทใด?', emoji:'🖍️', choices:['งานวาดภาพ','งานปั้น','งานพับ','งานทอ'], correct:0, explain:'ระบายสีเทียนเป็นงานวาดภาพ 2 มิติ', tier:1},
      {q:'สิ่งใดใช้ตัดกระดาษในงานศิลปะ?', emoji:'✂️', choices:['กรรไกร','พู่กัน','ดินสอ','ไม้บรรทัด'], correct:0, explain:'กรรไกรใช้ตัดกระดาษ', tier:1},
      {q:'รูปทรง 3 มิติ (มีความหนา) เช่นอะไร?', emoji:'📦', choices:['ลูกบาศก์ (กล่อง)','สี่เหลี่ยมแบน','วงกลมแบน','เส้นตรง'], correct:0, explain:'ลูกบาศก์/ทรงกลม เป็นรูปทรง 3 มิติมีความหนา', tier:2},
      {q:'ลวดลายที่เกิดจากการนำรูปทรงมาเรียงซ้ำๆ เรียกว่าอะไร?', emoji:'🔷', choices:['ลวดลาย (แพทเทิร์น)','จุดเด่น','เงา','ระยะ'], correct:0, explain:'การเรียงรูปทรงซ้ำๆ เกิดเป็นลวดลาย (pattern)', tier:2},
      {q:'การพิมพ์ภาพจากใบไม้หรือมือจุ่มสีเรียกว่างานประเภทใด?', emoji:'🍃', choices:['งานภาพพิมพ์','งานปั้น','งานเย็บ','งานร้องเพลง'], correct:0, explain:'จุ่มสีแล้วกดพิมพ์เป็นงานภาพพิมพ์', tier:2},
      {q:'ในการปั้นดินให้เป็นรูปสัตว์ ควรเริ่มจากขั้นตอนใด?', emoji:'🎨', choices:['ปั้นรูปทรงหลักก่อนแล้วเติมรายละเอียด','ปั้นตาก่อน','ระบายสีก่อนปั้น','พับกระดาษก่อน'], correct:0, explain:'ควรปั้นรูปทรงหลัก (ลำตัว) ก่อนแล้วค่อยเติมรายละเอียด', tier:2}
    ]
  },

  /* ---------- ธรรมชาติ ป.3 (quiz) — สิ่งแวดล้อม/โลกและท้องฟ้า ---------- */
  {
    id:'p3-nature1', name:'ธรรมชาติ ป.3 · สิ่งแวดล้อมและการอนุรักษ์', emoji:'🪺', icon:'assets/icons/p3-nature1.svg', color:'#6FBF3B', light:'#E6F6D8', grade:'p3', poolPick:10, isNew:true,
    questions:[
      {q:'การทิ้งขยะลงแม่น้ำทำให้เกิดอะไร?', emoji:'🌊', choices:['น้ำเน่าเสีย','น้ำสะอาดขึ้น','ปลาเยอะขึ้น','ไม่เป็นไร'], correct:0, explain:'ขยะในแม่น้ำทำให้น้ำเน่าเสีย', tier:1},
      {q:'การปลูกต้นไม้ช่วยเรื่องใด?', emoji:'🌳', choices:['ให้อากาศบริสุทธิ์','ทำให้ร้อนขึ้น','ทำให้สกปรก','ไม่มีประโยชน์'], correct:0, explain:'ต้นไม้ช่วยให้อากาศบริสุทธิ์', tier:1},
      {q:'สัญลักษณ์ ♻️ หมายถึงอะไร?', emoji:'♻️', choices:['การนำกลับมาใช้ใหม่','ห้ามทิ้งขยะ','อันตราย','น้ำดื่ม'], correct:0, explain:'♻️ คือการรีไซเคิล นำกลับมาใช้ใหม่', tier:1},
      {q:'ขยะชนิดใดนำมารีไซเคิลได้?', emoji:'🥤', choices:['ขวดพลาสติก','เศษอาหาร','ใบไม้แห้ง','น้ำ'], correct:0, explain:'ขวดพลาสติก กระดาษ แก้ว นำมารีไซเคิลได้', tier:1},
      {q:'การปิดก๊อกน้ำเมื่อไม่ใช้ช่วยเรื่องใด?', emoji:'🚰', choices:['ประหยัดน้ำ','เปลืองน้ำ','ทำให้น้ำสกปรก','ไม่ช่วยอะไร'], correct:0, explain:'ปิดก๊อกช่วยประหยัดน้ำ', tier:1},
      {q:'สิ่งใดทำให้อากาศเป็นพิษ?', emoji:'💨', choices:['ควันรถและควันโรงงาน','ต้นไม้','ดอกไม้','สายฝน'], correct:0, explain:'ควันรถ ควันโรงงานทำให้อากาศเป็นพิษ', tier:1},
      {q:'สัตว์ป่าควรอยู่ที่ไหน?', emoji:'🦌', choices:['ในป่าตามธรรมชาติ','ในบ้านคน','ในถุงพลาสติก','ในรถ'], correct:0, explain:'สัตว์ป่าควรอยู่ในป่าตามธรรมชาติ', tier:1},
      {q:'ถุงผ้าดีกว่าถุงพลาสติกอย่างไร?', emoji:'🧺', choices:['ใช้ซ้ำได้ ลดขยะ','แพงกว่า','ใช้ครั้งเดียว','ย่อยยากกว่า'], correct:0, explain:'ถุงผ้าใช้ซ้ำได้ ช่วยลดขยะพลาสติก', tier:2},
      {q:'ป่าไม้ถูกทำลายจะส่งผลอย่างไร?', emoji:'🪵', choices:['สัตว์ไม่มีที่อยู่ น้ำท่วมง่าย','อากาศดีขึ้น','ฝนตกมากขึ้น','ไม่มีผล'], correct:0, explain:'ตัดไม้ทำลายป่าทำให้สัตว์ไร้ที่อยู่และเกิดน้ำท่วม', tier:2},
      {q:'"3R" ในการจัดการขยะคืออะไร?', emoji:'🗑️', choices:['ลดใช้ ใช้ซ้ำ รีไซเคิล','วิ่ง อ่าน เขียน','แดง เขียว น้ำเงิน','กิน นอน เล่น'], correct:0, explain:'3R = Reduce Reuse Recycle (ลด ใช้ซ้ำ รีไซเคิล)', tier:2},
      {q:'การแยกขยะก่อนทิ้งมีประโยชน์อย่างไร?', emoji:'🧴', choices:['นำไปใช้ต่อได้ง่ายขึ้น','ทำให้ขยะเยอะขึ้น','เสียเวลาเปล่า','ทำให้สกปรก'], correct:0, explain:'แยกขยะช่วยให้นำไปรีไซเคิลได้ง่าย', tier:2},
      {q:'พลังงานสะอาดที่ได้จากดวงอาทิตย์เรียกว่าอะไร?', emoji:'☀️', choices:['พลังงานแสงอาทิตย์','พลังงานถ่านหิน','พลังงานน้ำมัน','พลังงานขยะ'], correct:0, explain:'พลังงานจากแดดคือพลังงานแสงอาทิตย์ เป็นพลังงานสะอาด', tier:2},
      {q:'เหตุใดจึงไม่ควรเผาขยะในที่โล่ง?', emoji:'🔥', choices:['เกิดควันพิษเป็นอันตราย','ทำให้เย็นลง','ขยะหายหมดดี','ไม่มีผลเสีย'], correct:0, explain:'การเผาขยะทำให้เกิดควันพิษเป็นอันตรายต่อสุขภาพ', tier:2},
      {q:'ขยะเปียก (เศษอาหาร) ควรทิ้งอย่างไร?', emoji:'🍎', choices:['แยกทิ้ง/ทำปุ๋ยหมัก','ทิ้งรวมกับพลาสติก','ทิ้งลงแม่น้ำ','เผาทิ้ง'], correct:0, explain:'เศษอาหารนำไปทำปุ๋ยหมักได้ ควรแยกทิ้ง', tier:1},
      {q:'สัตว์และพืชหลายชนิดในโลกเรียกรวมว่าอะไร?', emoji:'🌏', choices:['ความหลากหลายทางชีวภาพ','ขยะ','สิ่งของ','เครื่องจักร'], correct:0, explain:'ความหลากหลายของสิ่งมีชีวิตเรียกว่าความหลากหลายทางชีวภาพ', tier:1},
      {q:'การใช้จักรยานแทนรถยนต์ช่วยเรื่องใด?', emoji:'🚲', choices:['ลดมลพิษทางอากาศ','เพิ่มควันพิษ','เปลืองน้ำมัน','ทำให้รถติด'], correct:0, explain:'จักรยานไม่ปล่อยควัน ช่วยลดมลพิษ', tier:1},
      {q:'ป่าชายเลนมีประโยชน์อย่างไร?', emoji:'🌿', choices:['เป็นที่อยู่ของสัตว์น้ำและกันคลื่น','ทำให้น้ำเสีย','ไม่มีประโยชน์','ทำให้ร้อน'], correct:0, explain:'ป่าชายเลนเป็นที่อยู่สัตว์น้ำและช่วยกันคลื่นลม', tier:1},
      {q:'"ภาวะโลกร้อน" เกิดจากสาเหตุใดเป็นหลัก?', emoji:'🌡️', choices:['แก๊สเรือนกระจกจากการเผาไหม้','ปลูกต้นไม้มาก','ฝนตกบ่อย','ทะเลกว้าง'], correct:0, explain:'แก๊สเรือนกระจกจากควันรถ/โรงงานทำให้โลกร้อนขึ้น', tier:2},
      {q:'น้ำสะอาดสำหรับดื่มได้มาจากแหล่งใดที่เหมาะที่สุด?', emoji:'💧', choices:['น้ำที่ผ่านการกรอง/ต้มสุก','น้ำในคลอง','น้ำฝนที่ค้างในกระป๋องสนิม','น้ำทะเล'], correct:0, explain:'น้ำดื่มควรผ่านการกรองหรือต้มให้สะอาดก่อน', tier:2},
      {q:'การอนุรักษ์สัตว์ป่าที่ใกล้สูญพันธุ์ควรทำอย่างไร?', emoji:'🐘', choices:['ไม่ล่าและช่วยดูแลที่อยู่อาศัย','จับมาเลี้ยงในบ้าน','ล่าเพื่อขาย','ตัดป่าที่มันอยู่'], correct:0, explain:'ควรไม่ล่าและช่วยรักษาป่าที่เป็นบ้านของสัตว์', tier:2},
      {q:'ฝนกรดเกิดจากสิ่งใดปนเปื้อนในอากาศ?', emoji:'🌧️', choices:['ควันพิษจากโรงงานและรถ','ละอองดอกไม้','ไอน้ำสะอาด','แสงแดด'], correct:0, explain:'ควันพิษทำให้ฝนมีสภาพเป็นกรด เรียกฝนกรด', tier:2}
    ]
  },
  {
    id:'p3-nature2', name:'ธรรมชาติ ป.3 · ดิน หิน น้ำ และท้องฟ้า', emoji:'🌴', icon:'assets/icons/p3-nature2.svg', color:'#4F9E2F', light:'#E6F6D8', grade:'p3', poolPick:10, isNew:true,
    questions:[
      {q:'น้ำเมื่อได้รับความร้อนมากๆ จะกลายเป็นอะไร?', emoji:'♨️', choices:['ไอน้ำ','น้ำแข็ง','ก้อนหิน','ดิน'], correct:0, explain:'น้ำร้อนจัดกลายเป็นไอน้ำ', tier:1},
      {q:'น้ำเมื่อเย็นจัดจะกลายเป็นอะไร?', emoji:'🧊', choices:['น้ำแข็ง','ไอน้ำ','ทราย','ดิน'], correct:0, explain:'น้ำเย็นจัดกลายเป็นน้ำแข็ง', tier:1},
      {q:'ดินใช้ประโยชน์อะไรกับพืช?', emoji:'🌱', choices:['ให้พืชหยั่งรากและดูดอาหาร','ให้แสง','ให้เสียง','ให้ลม'], correct:0, explain:'ดินเป็นที่ยึดรากและมีธาตุอาหารให้พืช', tier:1},
      {q:'เมฆเกิดจากอะไรลอยขึ้นไปบนฟ้า?', emoji:'☁️', choices:['ไอน้ำ','ควันไฟ','ฝุ่นดิน','ทราย'], correct:0, explain:'ไอน้ำลอยขึ้นไปรวมตัวเป็นเมฆ', tier:1},
      {q:'กลางวันเรามองเห็นอะไรบนท้องฟ้า?', emoji:'🌞', choices:['ดวงอาทิตย์','ดวงดาว','ดวงจันทร์เต็มดวง','ดาวหาง'], correct:0, explain:'กลางวันเห็นดวงอาทิตย์', tier:1},
      {q:'กลางคืนเรามองเห็นอะไรบนท้องฟ้า?', emoji:'🌙', choices:['ดวงจันทร์และดวงดาว','ดวงอาทิตย์','สายรุ้ง','เมฆฝนเท่านั้น'], correct:0, explain:'กลางคืนเห็นดวงจันทร์และดวงดาว', tier:1},
      {q:'ทรายเป็นส่วนหนึ่งของอะไร?', emoji:'🏖️', choices:['ดิน/หินที่แตกเป็นเม็ดเล็ก','น้ำ','อากาศ','ไฟ'], correct:0, explain:'ทรายเกิดจากหินและดินที่แตกเป็นเม็ดเล็กๆ', tier:1},
      {q:'ฝนเกิดขึ้นได้อย่างไร?', emoji:'🌧️', choices:['ไอน้ำในเมฆรวมตัวเป็นหยดน้ำแล้วตกลงมา','ดวงอาทิตย์ร้อนเกินไป','ลมพัดแรง','ดินเปียก'], correct:0, explain:'ไอน้ำในเมฆควบแน่นเป็นหยดน้ำแล้วตกเป็นฝน', tier:2},
      {q:'วัฏจักรของน้ำมีลำดับอย่างไร?', emoji:'🔄', choices:['ระเหย → เมฆ → ฝน','ฝน → ดิน → ไฟ','ลม → หิน → ทราย','แดด → เมฆ → หิมะ'], correct:0, explain:'น้ำระเหย → กลายเป็นเมฆ → ตกเป็นฝน วนไปเรื่อยๆ', tier:2},
      {q:'หินมีประโยชน์อย่างไรกับคน?', emoji:'🪨', choices:['ใช้ก่อสร้างบ้านและถนน','ใช้กิน','ใช้หายใจ','ใช้รดน้ำต้นไม้'], correct:0, explain:'หินใช้ในการก่อสร้างบ้าน ถนน กำแพง', tier:2},
      {q:'ดวงจันทร์ในแต่ละคืนเราเห็นรูปร่างต่างกันเพราะอะไร?', emoji:'🌗', choices:['แสงอาทิตย์ส่องดวงจันทร์ต่างมุมกัน','ดวงจันทร์เปลี่ยนขนาด','มีเมฆบัง','ดวงจันทร์หายไป'], correct:0, explain:'เราเห็นดวงจันทร์เสี้ยว/เต็มดวงต่างกันตามมุมที่แสงอาทิตย์ส่อง', tier:2},
      {q:'ดินชนิดใดเหมาะปลูกพืชที่สุด?', emoji:'🌾', choices:['ดินร่วน','ดินทราย','ดินเหนียวล้วน','ก้อนหิน'], correct:0, explain:'ดินร่วนระบายน้ำดีและมีอาหารพืช เหมาะปลูกพืชที่สุด', tier:2},
      {q:'อากาศที่เราหายใจมีแก๊สใดที่สิ่งมีชีวิตต้องใช้?', emoji:'🫁', choices:['ออกซิเจน','ควันพิษ','ฝุ่น','ไอเสีย'], correct:0, explain:'สิ่งมีชีวิตหายใจใช้แก๊สออกซิเจน', tier:2},
      {q:'สายรุ้งเกิดขึ้นเมื่อใด?', emoji:'🌈', choices:['แสงอาทิตย์ส่องผ่านละอองน้ำหลังฝนตก','ตอนกลางคืน','ตอนหิมะตก','ตอนลมแรง'], correct:0, explain:'สายรุ้งเกิดเมื่อแสงแดดส่องผ่านละอองน้ำในอากาศ', tier:2},
      {q:'ดวงอาทิตย์เป็นดาวประเภทใด?', emoji:'☀️', choices:['ดาวฤกษ์ (ให้แสงสว่างเอง)','ดาวเคราะห์','ดวงจันทร์','ดาวหาง'], correct:0, explain:'ดวงอาทิตย์เป็นดาวฤกษ์ที่ให้แสงและความร้อนเอง', tier:1},
      {q:'โลกของเราเป็นดาวประเภทใด?', emoji:'🌍', choices:['ดาวเคราะห์','ดาวฤกษ์','ดวงจันทร์','ก้อนเมฆ'], correct:0, explain:'โลกเป็นดาวเคราะห์ที่โคจรรอบดวงอาทิตย์', tier:1},
      {q:'อากาศประกอบด้วยอะไรบ้าง?', emoji:'💨', choices:['แก๊สหลายชนิด เช่น ออกซิเจน','น้ำอย่างเดียว','ดินอย่างเดียว','แสงอย่างเดียว'], correct:0, explain:'อากาศคือแก๊สหลายชนิดผสมกัน เช่น ออกซิเจน ไนโตรเจน', tier:1},
      {q:'น้ำในโลกส่วนใหญ่อยู่ที่ไหน?', emoji:'🌊', choices:['ทะเลและมหาสมุทร','ในแก้วน้ำ','ในเมฆ','ใต้ดินเท่านั้น'], correct:0, explain:'น้ำส่วนใหญ่บนโลกอยู่ในทะเลและมหาสมุทร', tier:1},
      {q:'หินที่เกิดจากลาวาภูเขาไฟเย็นตัวลงคือหินประเภทใด?', emoji:'🌋', choices:['หินอัคนี','หินตะกอน','หินทราย','ดินเหนียว'], correct:0, explain:'ลาวาเย็นตัวกลายเป็นหินอัคนี', tier:2},
      {q:'ลมเกิดจากอะไร?', emoji:'🌬️', choices:['อากาศเคลื่อนที่','ดินเคลื่อนที่','น้ำระเหยเฉยๆ','แสงส่อง'], correct:0, explain:'ลมคืออากาศที่เคลื่อนที่', tier:2},
      {q:'ดาวเคราะห์ในระบบสุริยะโคจรรอบสิ่งใด?', emoji:'🪐', choices:['ดวงอาทิตย์','โลก','ดวงจันทร์','ดาวหาง'], correct:0, explain:'ดาวเคราะห์ทุกดวงโคจรรอบดวงอาทิตย์', tier:2},
      {q:'เหตุใดกลางวันจึงสว่างและกลางคืนจึงมืด?', emoji:'🌗', choices:['เพราะโลกหมุนรอบตัวเอง','เพราะดวงอาทิตย์ดับ','เพราะมีเมฆ','เพราะดวงจันทร์บัง'], correct:0, explain:'โลกหมุนรอบตัวเอง ด้านที่หันเข้าดวงอาทิตย์เป็นกลางวัน', tier:2}
    ]
  }
];
