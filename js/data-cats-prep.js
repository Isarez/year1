/* ================================================================================
   หมวด/เกมของเตรียมสอบ ป.1 (หมวดที่ไม่มี cat.grade)
   ถูกนำไปต่อเป็นอาเรย์ CATS ตัวเดียวใน js/data-cats.js (ลำดับ = ลำดับการ์ดในหน้าหลัก)
   ================================================================================ */

const CATS_PREP = [
  {
    id:'math', name:'คณิตศาสตร์', emoji:'🔢', icon:'assets/icons/math.svg', color:'#FF8A5B', light:'#FFE7DA',
    questions:[
      {q:'★★★★★★★ มีดาวกี่ดวง?', emoji:'', choices:['5','6','7','8'], correct:2, explain:'นับดาวได้ทั้งหมด 7 ดวงจ้ะ'},
      {q:'จำนวน "สิบสอง" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['21','12','20','22'], correct:1, explain:'สิบสอง เขียนเป็นตัวเลขคือ 12'},
      {q:'ข้อใดเรียงจากน้อยไปมากได้ถูกต้อง?', emoji:'📊', choices:['15, 9, 4','4, 9, 15','9, 15, 4','15, 4, 9'], correct:1, explain:'4 น้อยที่สุด ตามด้วย 9 แล้ว 15'},
      {q:'จำนวนใดอยู่ระหว่าง 17 กับ 20?', emoji:'🔢', choices:['16','18','21','15'], correct:1, explain:'18 อยู่ระหว่าง 17 กับ 20'},
      {q:'8 + 6 = ?', emoji:'➕', choices:['13','14','15','16'], correct:1, explain:'8 บวก 6 เท่ากับ 14'},
      {q:'ถ้า ▢ + 5 = 13 แล้ว ▢ คือเท่าไร?', emoji:'➕', choices:['6','7','8','9'], correct:2, explain:'8 + 5 = 13 ดังนั้น ▢ คือ 8'},
      {q:'แม่ซื้อส้ม 12 ลูก และองุ่น 6 ลูก มีผลไม้ทั้งหมดกี่ลูก?', emoji:'🍊', choices:['18','17','19','16'], correct:0, explain:'12 + 6 = 18 ลูก'},
      {q:'20 - 7 = ?', emoji:'➖', choices:['11','12','13','14'], correct:2, explain:'20 ลบ 7 เท่ากับ 13'},
      {q:'มีนกเกาะกิ่งไม้ 16 ตัว บินไป 5 ตัว เหลือนกกี่ตัว?', emoji:'🐦', choices:['9','10','11','12'], correct:2, explain:'16 - 5 = 11 ตัว'},
      {q:'แบบรูปตัวเลข 2, 4, 6, 8, ▢ ตัวต่อไปคือเท่าไร?', emoji:'🔁', choices:['9','10','11','12'], correct:1, explain:'นับเพิ่มทีละ 2 ตัวต่อไปคือ 10'}
    ]
  },
  {
    id:'thai', name:'ภาษาไทย 1', emoji:'📖', icon:'assets/icons/thai-1.svg', color:'#33B7EE', light:'#DBF3FE',
    questions:[
      {q:'ข้อใดมีพยัญชนะต้นเหมือนกับคำว่า "ปลา"?', emoji:'🐟', choices:['มะม่วง','ปูนา','กล้วย','ฝักบัว'], correct:1, explain:'"ปูนา" มีพยัญชนะต้น ป เหมือน "ปลา"'},
      {q:'ข้อใดมีพยัญชนะต้นแตกต่างจากข้ออื่น?', emoji:'🔤', choices:['กา','กบ','กวาง','ขาว'], correct:3, explain:'"ขาว" ขึ้นต้นด้วย ข ต่างจากตัวอื่นที่ขึ้นต้นด้วย ก'},
      {q:'ข้อใดมีสระเหมือนกับคำว่า "ใบไม้"?', emoji:'🍃', choices:['ใจดี','บ้านใหม่','ไฟฟ้า','เด็กน้อย'], correct:0, explain:'"ใจดี" ใช้สระ ใ- เหมือนกัน'},
      {q:'คำในข้อใดใช้สระ "อา"?', emoji:'🔤', choices:['หนู','มะนาว','กา','โต'], correct:2, explain:'"กา" ใช้สระ อา'},
      {q:'ข้อใดมีตัวสะกดเหมือนกับคำว่า "กลม"?', emoji:'🔤', choices:['นาม','กิน','เดิน','บิน'], correct:0, explain:'"นาม" สะกดด้วย ม เหมือน "กลม"'},
      {q:'คำว่า "ฟ้าหลังฝน" มีตัวสะกดกี่ตัว?', emoji:'🌦️', choices:['1 ตัว','2 ตัว','3 ตัว','ไม่มีตัวสะกด'], correct:1, explain:'มีตัวสะกด น ใน "หลัง" และ น ใน "ฝน" รวม 2 ตัว'},
      {q:'ข้อใดมีรูปวรรณยุกต์ตรงกับคำว่า "น้ำ"?', emoji:'💧', choices:['ข้าว','ขา','ข่าว','ขาว'], correct:0, explain:'"ข้าว" มีวรรณยุกต์โทเหมือน "น้ำ"'},
      {q:'คำใดมีวรรณยุกต์ตรี?', emoji:'🔤', choices:['ป้า','ป่า','ป๊า','ปา'], correct:2, explain:'"ป๊า" มีรูปวรรณยุกต์ตรี'},
      {q:'ข้อใดเป็นประโยคที่เรียงคำได้ถูกต้อง?', emoji:'✏️', choices:['แมวดำวิ่งเร็ว','วิ่งแมวดำเร็ว','เร็วดำวิ่งแมว','ดำแมวเร็ววิ่ง'], correct:0, explain:'"แมวดำวิ่งเร็ว" เรียงคำถูกต้องตามหลักไวยากรณ์'},
      {q:'ข้อใดมีความหมายแตกต่างจากข้ออื่น?', emoji:'💭', choices:['ดีใจ','ยินดี','สุขใจ','เสียใจ'], correct:3, explain:'"เสียใจ" มีความหมายตรงข้ามกับคำอื่นที่แปลว่ามีความสุข'}
    ]
  },
  {
    id:'thai2', name:'ภาษาไทย 2', emoji:'📝', icon:'assets/icons/thai-2.svg', color:'#2FBF9B', light:'#D6F5EC',
    questions:[
      {q:'เลือกคำที่เหมาะสมเติมในช่องว่าง: "น้องนุ่น _____ อาหารเช้า"', emoji:'🍚', choices:['กิน','ว่าย','ขับ','นอน'], correct:0, explain:'น้องนุ่น "กิน" อาหารเช้า'},
      {q:'เลือกคำที่เหมาะสมเติมในช่องว่าง: "แม่ _____ ดอกไม้ในสวน"', emoji:'🌷', choices:['กิน','รดน้ำ','ขับ','ว่าย'], correct:1, explain:'แม่ "รดน้ำ" ดอกไม้ในสวน'},
      {q:'เลือกคำที่เหมาะสมเติมในช่องว่าง: "วันนี้ท้องฟ้า _____ เพราะฝนกำลังจะตก"', emoji:'☁️', choices:['ครึ้ม','สว่าง','ใส','แจ่มใส'], correct:0, explain:'ท้องฟ้า "ครึ้ม" คือมืดครึ้มก่อนฝนจะตก'},
      {q:'เลือกคำที่เหมาะสมเติมในช่องว่าง: "นักเรียนควร _____ น้ำวันละ 8 แก้ว"', emoji:'💧', choices:['เท','ตัก','ดื่ม','กรอก'], correct:2, explain:'ควร "ดื่ม" น้ำวันละ 8 แก้ว เพื่อสุขภาพที่ดี'},
      {q:'เลือกคำที่เหมาะสมเติมในช่องว่าง: "เอกวิ่งเล่นท่ามกลาง _____ จนตัวเปียกโชก"', emoji:'🌧️', choices:['แดด','ฝน','หมอก','ลม'], correct:1, explain:'วิ่งเล่นท่ามกลาง "ฝน" จึงทำให้ตัวเปียกโชก'},
      {q:'เรียงคำต่อไปนี้ให้เป็นประโยคที่ถูกต้อง: "โรงเรียน / น้อง / ไป"', emoji:'🔤', choices:['โรงเรียน ไป น้อง','น้อง ไป โรงเรียน','ไป โรงเรียน น้อง','น้อง โรงเรียน ไป'], correct:1, explain:'"น้อง ไป โรงเรียน" เรียงคำได้ถูกต้อง'},
      {q:'เรียงคำต่อไปนี้ให้เป็นประโยคที่ถูกต้อง: "กิน / น้อง / ทอด / ไก่"', emoji:'🔤', choices:['กิน น้อง ทอด ไก่','ไก่ น้อง กิน ทอด','ทอด กิน น้อง ไก่','น้อง กิน ไก่ ทอด'], correct:3, explain:'"น้อง กิน ไก่ ทอด" เรียงคำได้ถูกต้อง'},
      {q:'เรียงคำต่อไปนี้ให้เป็นประโยคที่ถูกต้อง: "สวย / ดอกไม้ / ในสวน / มาก"', emoji:'🔤', choices:['สวย ดอกไม้ มาก ในสวน','มาก สวย ดอกไม้ ในสวน','ดอกไม้ ในสวน สวย มาก','ในสวน มาก ดอกไม้ สวย'], correct:2, explain:'"ดอกไม้ ในสวน สวย มาก" เรียงคำได้ถูกต้อง'},
      {q:'เรียงคำต่อไปนี้ให้เป็นประโยคที่ถูกต้อง: "ฉัน / กิน / ชอบ / แตงโม"', emoji:'🔤', choices:['ฉัน ชอบ กิน แตงโม','ชอบ ฉัน แตงโม กิน','กิน ฉัน แตงโม ชอบ','แตงโม กิน ชอบ ฉัน'], correct:0, explain:'"ฉัน ชอบ กิน แตงโม" เรียงคำได้ถูกต้อง'},
      {q:'เรียงคำต่อไปนี้ให้เป็นประโยคที่ถูกต้อง: "เห็น / ใน / ฉัน / ปู / ทะเล"', emoji:'🔤', choices:['เห็น ทะเล ปู ใน ฉัน','ฉัน เห็น ปู ใน ทะเล','ปู ฉัน เห็น ทะเล ใน','ใน ฉัน ทะเล ปู เห็น'], correct:1, explain:'"ฉัน เห็น ปู ใน ทะเล" เรียงคำได้ถูกต้อง'}
    ]
  },
  {
    id:'english', name:'English', emoji:'🔤', icon:'assets/icons/english.svg', color:'#4CBE84', light:'#DEF5E7',
    questions:[
      {q:'Which picture matches the word "APPLE"?', emoji:'', choices:['🍊','🍎','🍌','🍇'], correct:1, explain:'APPLE means แอปเปิ้ล 🍎'},
      {q:'Which picture matches the word "DOG"?', emoji:'', choices:['🐱','🐟','🐶','🐰'], correct:2, explain:'DOG means สุนัข 🐶'},
      {q:'Which picture matches the word "SCHOOL"?', emoji:'', choices:['🏥','🏬','🏠','🏫'], correct:3, explain:'SCHOOL means โรงเรียน 🏫'},
      {q:'What colour is a banana?', emoji:'', choices:['Red','Yellow','Blue','Green'], correct:1, explain:'A banana is Yellow (สีเหลือง)'},
      {q:'Which word is a number?', emoji:'', choices:['Cat','Blue','Seven','Apple'], correct:2, explain:'"Seven" แปลว่า เจ็ด เป็นตัวเลข'},
      {q:'Which one is NOT a fruit?', emoji:'', choices:['Mango','Orange','Carrot','Banana'], correct:2, explain:'"Carrot" คือแครอท เป็นผัก ไม่ใช่ผลไม้'},
      {q:'A ___ is a pet. Choose the best word.', emoji:'', choices:['Rock','Dog','Tree','Book'], correct:1, explain:'"Dog" (สุนัข) เป็นสัตว์เลี้ยง'},
      {q:'How many days are in one week?', emoji:'', choices:['Five','Six','Seven','Eight'], correct:2, explain:'หนึ่งสัปดาห์มี Seven (เจ็ด) วัน'},
      {q:'I see with my two ___.', emoji:'', choices:['eyes','ears','hands','feet'], correct:0, explain:'"eyes" แปลว่า ดวงตา ใช้มองเห็น'},
      {q:'The cat is ___ the box.', emoji:'', choices:['under','on','behind','next'], correct:1, explain:'"on" แปลว่า อยู่บน — The cat is on the box'}
    ]
  },
  {
    id:'behavior', name:'พฤติกรรมดี-ไม่ดี', emoji:'🌟', icon:'assets/icons/behavior.svg', color:'#FFC53D', light:'#FFF2CE',
    questions:[
      {q:'ข้อใดแสดงพฤติกรรมที่ดี?', emoji:'🙏', choices:['ทิ้งขยะลงพื้น','ไหว้ทักทายผู้ใหญ่','ทะเลาะกับเพื่อน','เล่นมือถือขณะกินข้าว'], correct:1, explain:'การไหว้ทักทายผู้ใหญ่เป็นมารยาทที่ดีและสุภาพ'},
      {q:'ข้อใดแสดงพฤติกรรมที่ไม่ดี?', emoji:'😠', choices:['อ่านหนังสือ','ช่วยเหลือเพื่อน','แกล้งเพื่อน','รดน้ำต้นไม้'], correct:2, explain:'การแกล้งเพื่อนเป็นพฤติกรรมที่ไม่ดี ไม่ควรทำ'},
      {q:'ข้อใดเป็นพฤติกรรมที่ดีในห้องเรียน?', emoji:'✋', choices:['ยกมือก่อนพูด','นอนหลับในห้องเรียน','พูดคุยเสียงดัง','กินขนมในห้อง'], correct:0, explain:'การยกมือก่อนพูดเป็นระเบียบวินัยที่ดี'},
      {q:'ข้อใดเป็นสิ่งที่นักเรียนไม่ควรทำ?', emoji:'🚫', choices:['ทิ้งขยะในถัง','เดินเข้าแถวเป็นระเบียบ','พูดเบาในห้องสมุด','วางเท้าบนเก้าอี้'], correct:3, explain:'การวางเท้าบนเก้าอี้เป็นสิ่งที่ไม่สุภาพ ไม่ควรทำ'},
      {q:'เมื่อทำผิดพลาด ควรพูดว่าอะไร?', emoji:'💬', choices:['ขอโทษครับ/ค่ะ','ไม่ใช่ความผิดของฉัน','ช่างมัน','แล้วไง'], correct:0, explain:'การกล่าวขอโทษเมื่อทำผิดเป็นมารยาทที่ดี'},
      {q:'เมื่อได้รับของขวัญ ควรพูดว่าอะไร?', emoji:'🎁', choices:['ขอบคุณครับ/ค่ะ','เอาไปเลย','แค่นี้เอง','ไม่เอา'], correct:0, explain:'การกล่าวขอบคุณแสดงความมีน้ำใจและสุภาพ'},
      {q:'ก่อนรับประทานอาหาร ควรทำอะไรก่อน?', emoji:'🧼', choices:['ล้างมือ','วิ่งเล่น','นอนหลับ','ดูทีวี'], correct:0, explain:'ควรล้างมือให้สะอาดก่อนรับประทานอาหารทุกครั้ง'},
      {q:'เมื่อเจอผู้ใหญ่ ควรทำอย่างไร?', emoji:'🙇', choices:['ไหว้สวัสดี','วิ่งหนี','เมินเฉย','ทำหน้าบูดบึ้ง'], correct:0, explain:'การไหว้สวัสดีผู้ใหญ่เป็นมารยาทไทยที่ดีงาม'}
    ]
  },
  {
    id:'animals', name:'สัตว์และที่อยู่', emoji:'🐾', icon:'assets/icons/animals.svg', color:'#F17FA8', light:'#FDE1EC',
    questions:[
      {q:'ข้อใดเป็นสัตว์ที่อยู่ในน้ำ ทั้งหมด?', emoji:'🌊', choices:['สิงโต หมี กวาง','ปลา กุ้ง ปลาหมึก','กบ เสือ ลิง','นก ผีเสื้อ ค้างคาว'], correct:1, explain:'ปลา กุ้ง ปลาหมึก ล้วนอาศัยอยู่ในน้ำ'},
      {q:'ข้อใดเป็นสัตว์ครึ่งบกครึ่งน้ำ?', emoji:'🐸', choices:['สิงโต','กบ','โลมา','นก'], correct:1, explain:'กบสามารถอยู่ได้ทั้งในน้ำและบนบก'},
      {q:'ช้างจัดเป็นสัตว์ประเภทใด?', emoji:'🐘', choices:['สัตว์น้ำ','สัตว์ครึ่งบกครึ่งน้ำ','สัตว์ป่า/สัตว์บก','สัตว์ปีก'], correct:2, explain:'ช้างเป็นสัตว์บกที่อาศัยอยู่ในป่า'},
      {q:'สัตว์ใดไม่ใช่สัตว์เลี้ยง?', emoji:'🐯', choices:['สุนัข','แมว','เสือโคร่ง','กระต่าย'], correct:2, explain:'เสือโคร่งเป็นสัตว์ป่า ไม่ใช่สัตว์เลี้ยงในบ้าน'},
      {q:'สัตว์ชนิดใดเป็นสัตว์ประจำชาติไทย?', emoji:'🇹🇭', choices:['สิงโต','ยีราฟ','ช้าง','หมี'], correct:2, explain:'ช้างเป็นสัตว์ประจำชาติไทย'},
      {q:'ข้อใดเป็นสัตว์ในฟาร์ม ทั้งหมด?', emoji:'🐄', choices:['วัว หมู ไก่ เป็ด','เสือ ช้าง ลิง','ฉลาม กุ้ง ปลา','นก ผีเสื้อ ค้างคาว'], correct:0, explain:'วัว หมู ไก่ เป็ด ล้วนเป็นสัตว์ที่เลี้ยงในฟาร์ม'},
      {q:'สัตว์ชนิดใดมีพิษและอันตราย?', emoji:'⚠️', choices:['ไก่','แกะ','แมงป่อง','กระต่าย'], correct:2, explain:'แมงป่องมีพิษที่หาง เป็นอันตราย'},
      {q:'จระเข้จัดอยู่ในกลุ่มสัตว์ใด?', emoji:'🐊', choices:['ครึ่งบกครึ่งน้ำเหมือนกบ','สัตว์เลื้อยคลาน','สัตว์น้ำเหมือนปลา','สัตว์เลี้ยง'], correct:1, explain:'จระเข้เป็นสัตว์เลื้อยคลาน แม้จะอยู่ได้ทั้งบกและน้ำ'},
      {q:'โลมาต่างจากปลาอย่างไร?', emoji:'🐬', choices:['โลมาอยู่บนบก ปลาอยู่ในน้ำ','โลมาหายใจด้วยปอด ต้องขึ้นมาหายใจ','โลมาเป็นสัตว์ชนิดเดียวกับปลา','โลมาบินได้ แต่ปลาว่ายน้ำได้'], correct:1, explain:'โลมาเป็นสัตว์เลี้ยงลูกด้วยนม ต้องขึ้นมาหายใจบนผิวน้ำ'},
      {q:'สัตว์ตัวใดอาศัยอยู่ในป่า?', emoji:'🌳', choices:['โลมา','ปู','ช้าง','ปลาหมึก'], correct:2, explain:'ช้างอาศัยอยู่ในป่า เป็นสัตว์บก'},
      {q:'สัตว์ใดไม่ใช่สัตว์ป่า?', emoji:'🐳', choices:['เสือโคร่ง','วาฬ','กวาง','ลิง'], correct:1, explain:'วาฬเป็นสัตว์ทะเล ไม่ใช่สัตว์ป่า'},
      {q:'ลูกอ๊อดอาศัยอยู่ที่ไหน?', emoji:'💧', choices:['ในน้ำ','บนต้นไม้','บนภูเขา','ในทะเลทราย'], correct:0, explain:'ลูกอ๊อดอาศัยอยู่ในน้ำ ก่อนเติบโตเป็นกบที่ขึ้นบกได้'}
    ]
  },
  {
    id:'days', name:'วันในสัปดาห์', emoji:'📅', icon:'assets/icons/weekday.svg', color:'#9B7DE0', light:'#EAE1FC',
    questions:[
      {q:'วันจันทร์ ภาษาอังกฤษคือข้อใด?', emoji:'🌙', choices:['Tuesday','Sunday','Monday','Friday'], correct:2, explain:'วันจันทร์ คือ Monday'},
      {q:'วันอังคาร ภาษาอังกฤษคือข้อใด?', emoji:'🔥', choices:['Wednesday','Monday','Sunday','Tuesday'], correct:3, explain:'วันอังคาร คือ Tuesday'},
      {q:'วันพุธ ภาษาอังกฤษคือข้อใด?', emoji:'💚', choices:['Wednesday','Saturday','Thursday','Tuesday'], correct:0, explain:'วันพุธ คือ Wednesday'},
      {q:'วันพฤหัสบดี ภาษาอังกฤษคือข้อใด?', emoji:'⚡', choices:['Sunday','Thursday','Friday','Wednesday'], correct:1, explain:'วันพฤหัสบดี คือ Thursday'},
      {q:'วันศุกร์ ภาษาอังกฤษคือข้อใด?', emoji:'🎉', choices:['Monday','Tuesday','Friday','Saturday'], correct:2, explain:'วันศุกร์ คือ Friday'},
      {q:'วันเสาร์ ภาษาอังกฤษคือข้อใด?', emoji:'⭐', choices:['Sunday','Friday','Wednesday','Saturday'], correct:3, explain:'วันเสาร์ คือ Saturday'},
      {q:'วันอาทิตย์ ภาษาอังกฤษคือข้อใด?', emoji:'☀️', choices:['Sunday','Thursday','Monday','Saturday'], correct:0, explain:'วันอาทิตย์ คือ Sunday'}
    ]
  },
  {
    id:'iq1', name:'เชาวน์ปัญญา 1', emoji:'🧩', icon:'assets/icons/iq-1.svg', color:'#7C6EF2', light:'#E6E2FD',
    questions:(function(){
      /* Q1-Q15: answers from PDF answer key (0=ก,1=ข,2=ค) */
      const answers = [1,1,0,2,2,1,2,1,2,2, 2,2,1,0,1];
      const letters = ['ก','ข','ค'];
      return answers.map((correct, i)=>{
        const num = String(i+1).padStart(2,'0');
        return { q:'', emoji:'', img:'assets/iq2/q'+num+'.png', choices:letters, correct:correct, explain:'คำตอบคือข้อ '+letters[correct]+' ตามภาพโจทย์ด้านบน' };
      });
    })()
  },
  {
    id:'iq2', name:'เชาวน์ปัญญา 2', emoji:'🔍', icon:'assets/icons/iq-2.svg', color:'#3498DB', light:'#D6EEF8',
    questions:(function(){
      /* Q16-Q30: answers from PDF answer key (0=ก,1=ข,2=ค) */
      const answers = [1,0,2,0,2, 1,0,2,2,1, 1,2,1,1,1];
      const letters = ['ก','ข','ค'];
      return answers.map((correct, i)=>{
        const num = String(i+16).padStart(2,'0');
        return { q:'', emoji:'', img:'assets/iq2/q'+num+'.png', choices:letters, correct:correct, explain:'คำตอบคือข้อ '+letters[correct]+' ตามภาพโจทย์ด้านบน' };
      });
    })()
  },
  {
    id:'iq3', name:'เชาวน์ปัญญา 3', emoji:'💡', icon:'assets/icons/iq-3.svg', color:'#E67E22', light:'#FDEBD0',
    questions:(function(){
      /* Q31-Q45: answers from PDF answer key (0=ก,1=ข,2=ค); Q38 corrected to ข */
      const answers = [0,0,1,2,1,2,0,1,2,2, 1,0,2,2,0];
      const letters = ['ก','ข','ค'];
      return answers.map((correct, i)=>{
        const num = String(i+31).padStart(2,'0');
        return { q:'', emoji:'', img:'assets/iq2/q'+num+'.png', choices:letters, correct:correct, explain:'คำตอบคือข้อ '+letters[correct]+' ตามภาพโจทย์ด้านบน' };
      });
    })()
  },
  {
    id:'iq4', name:'เชาวน์ปัญญา 4', emoji:'🎯', icon:'assets/icons/iq-4.svg', color:'#27AE60', light:'#D5F5E3',
    questions:(function(){
      /* Q46-Q60: answers from PDF answer key (0=ก,1=ข,2=ค); Q52 corrected to ข, Q53 corrected to ค */
      const answers = [1,0,2,2,0, 0,1,2,0,0, 2,0,0,2,1];
      const letters = ['ก','ข','ค'];
      return answers.map((correct, i)=>{
        const num = String(i+46).padStart(2,'0');
        return { q:'', emoji:'', img:'assets/iq2/q'+num+'.png', choices:letters, correct:correct, explain:'คำตอบคือข้อ '+letters[correct]+' ตามภาพโจทย์ด้านบน' };
      });
    })()
  },
  {
    id:'pattern', name:'เติมแพทเทิร์น', emoji:'🔮', icon:'assets/icons/pattern.svg', color:'#C94FB6', light:'#F7DFF3',
    poolPick:10, isNew:true,
    /* คลัง 30 ข้อ สุ่ม 10 ข้อต่อรอบ (poolPick) — tier 1 ง่าย (ABAB), tier 2 กลาง (ABCABC/AABB), tier 3 ยาก (จำนวนเพิ่ม-ลด/ไล่เฉด/ไล่ลำดับ)
       q.pattern = แถวโจทย์ที่โชว์เป็นการ์ด emoji + ช่อง ? ท้ายแถว (render พิเศษใน renderQuestion) */
    questions:[
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🍎','🍌','🍎','🍌'], choices:['🍎','🍌','🍇','🍉'], correct:0, explain:'แบบรูปสลับ 🍎 กับ 🍌 ตัวต่อไปคือ 🍎'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🐶','🐱','🐶','🐱','🐶'], choices:['🐭','🐱','🐰','🐶'], correct:1, explain:'แบบรูปสลับ 🐶 กับ 🐱 ตัวต่อไปคือ 🐱'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['⚽','🏀','⚽','🏀'], choices:['🏀','🎾','⚽','🏐'], correct:2, explain:'แบบรูปสลับ ⚽ กับ 🏀 ตัวต่อไปคือ ⚽'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🌞','🌙','🌞','🌙','🌞'], choices:['🌞','⭐','🌙','☁️'], correct:2, explain:'แบบรูปสลับ 🌞 กับ 🌙 ตัวต่อไปคือ 🌙'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🚗','🚌','🚗','🚌'], choices:['🚌','🚗','🚲','✈️'], correct:1, explain:'แบบรูปสลับ 🚗 กับ 🚌 ตัวต่อไปคือ 🚗'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['⭐','❤️','⭐','❤️','⭐'], choices:['⭐','💛','❤️','💚'], correct:2, explain:'แบบรูปสลับ ⭐ กับ ❤️ ตัวต่อไปคือ ❤️'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🐸','🦆','🐸','🦆'], choices:['🦆','🐸','🐟','🐢'], correct:1, explain:'แบบรูปสลับ 🐸 กับ 🦆 ตัวต่อไปคือ 🐸'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🌸','🍀','🌸','🍀','🌸'], choices:['🌸','🌻','🍀','🌵'], correct:2, explain:'แบบรูปสลับ 🌸 กับ 🍀 ตัวต่อไปคือ 🍀'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🍦','🍩','🍦','🍩'], choices:['🍩','🍪','🧁','🍦'], correct:3, explain:'แบบรูปสลับ 🍦 กับ 🍩 ตัวต่อไปคือ 🍦'},
      {tier:1, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🔴','🔵','🔴','🔵','🔴'], choices:['🔴','🔵','🟢','🟡'], correct:1, explain:'แบบรูปสลับ 🔴 กับ 🔵 ตัวต่อไปคือ 🔵'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🍎','🍌','🍇','🍎','🍌'], choices:['🍎','🍌','🍇','🍓'], correct:2, explain:'แบบรูปวนซ้ำ 🍎 🍌 🍇 ตัวต่อไปคือ 🍇'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🐶','🐱','🐭','🐶','🐱'], choices:['🐭','🐶','🐱','🐹'], correct:0, explain:'แบบรูปวนซ้ำ 🐶 🐱 🐭 ตัวต่อไปคือ 🐭'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🔴','🟡','🔵','🔴','🟡'], choices:['🟢','🔴','🟣','🔵'], correct:3, explain:'แบบรูปวนซ้ำ 🔴 🟡 🔵 ตัวต่อไปคือ 🔵'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🚗','🚕','🚌','🚗','🚕'], choices:['🚗','🚌','🚕','🚓'], correct:1, explain:'แบบรูปวนซ้ำ 🚗 🚕 🚌 ตัวต่อไปคือ 🚌'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🌞','⛅','🌙','🌞','⛅'], choices:['🌞','⛅','🌧️','🌙'], correct:3, explain:'แบบรูปวนซ้ำ 🌞 ⛅ 🌙 ตัวต่อไปคือ 🌙'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🐟','🐟','🐦','🐦','🐟','🐟'], choices:['🐟','🐦','🐝','🐛'], correct:1, explain:'แบบรูปจับคู่ 🐟🐟 แล้ว 🐦🐦 ตัวต่อไปคือ 🐦'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🍓','🍓','🍋','🍋','🍓','🍓'], choices:['🍓','🍊','🍋','🍏'], correct:2, explain:'แบบรูปจับคู่ 🍓🍓 แล้ว 🍋🍋 ตัวต่อไปคือ 🍋'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🦁','🐵','🦒','🦁','🐵'], choices:['🦒','🦁','🐵','🐘'], correct:0, explain:'แบบรูปวนซ้ำ 🦁 🐵 🦒 ตัวต่อไปคือ 🦒'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🚓','🚓','🚑','🚑','🚓','🚓'], choices:['🚒','🚓','🚜','🚑'], correct:3, explain:'แบบรูปจับคู่ 🚓🚓 แล้ว 🚑🚑 ตัวต่อไปคือ 🚑'},
      {tier:2, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🍕','🍔','🌭','🍕','🍔'], choices:['🍟','🌭','🍕','🍔'], correct:1, explain:'แบบรูปวนซ้ำ 🍕 🍔 🌭 ตัวต่อไปคือ 🌭'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['⭐','⭐⭐','⭐⭐⭐'], choices:['⭐⭐','⭐⭐⭐⭐','⭐','⭐⭐⭐⭐⭐'], correct:1, explain:'ดาวเพิ่มขึ้นทีละ 1 ดวง ตัวต่อไปคือ 4 ดวง'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🍎','🍎🍎','🍎🍎🍎'], choices:['🍎','🍎🍎🍎🍎','🍎🍎','🍎🍎🍎'], correct:1, explain:'แอปเปิ้ลเพิ่มขึ้นทีละ 1 ลูก ตัวต่อไปคือ 4 ลูก'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🎈🎈🎈🎈','🎈🎈🎈','🎈🎈'], choices:['🎈🎈🎈','🎈🎈','🎈','🎈🎈🎈🎈'], correct:2, explain:'ลูกโป่งลดลงทีละ 1 ใบ ตัวต่อไปคือ 1 ใบ'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['1️⃣','2️⃣','3️⃣','4️⃣'], choices:['5️⃣','6️⃣','3️⃣','7️⃣'], correct:0, explain:'นับเพิ่มทีละ 1 ตัวต่อไปคือ 5'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['2️⃣','4️⃣','6️⃣'], choices:['7️⃣','9️⃣','8️⃣','5️⃣'], correct:2, explain:'นับเพิ่มทีละ 2 ตัวต่อไปคือ 8'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🌕','🌗','🌑','🌕','🌗'], choices:['🌕','🌑','🌗','⭐'], correct:1, explain:'พระจันทร์ค่อยๆ มืดลงแล้ววนซ้ำ ตัวต่อไปคือ 🌑'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['❤️','🧡','💛','💚'], choices:['💜','💙','🖤','🤎'], correct:1, explain:'สีไล่ตามสายรุ้ง แดง ส้ม เหลือง เขียว ตัวต่อไปคือฟ้า 💙'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🐥','🐥🐥','🐥🐥🐥'], choices:['🐥🐥','🐥🐥🐥🐥','🐥🐥🐥','🐥'], correct:1, explain:'ลูกเจี๊ยบเพิ่มขึ้นทีละ 1 ตัว ตัวต่อไปคือ 4 ตัว'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['🌱','🌿','🌳','🌱','🌿'], choices:['🌱','🌵','🌳','🌿'], correct:2, explain:'ต้นไม้โตขึ้น เล็ก กลาง ใหญ่ แล้ววนซ้ำ ตัวต่อไปคือ 🌳'},
      {tier:3, q:'ตัวต่อไปคืออะไรเอ่ย?', pattern:['5️⃣','4️⃣','3️⃣'], choices:['1️⃣','3️⃣','2️⃣','6️⃣'], correct:2, explain:'นับถอยหลังทีละ 1 ตัวต่อไปคือ 2'}
    ]
  },
  {
    id:'ar-thai', name:'ต่อประโยค (ไทย)', emoji:'🖐️', icon:'assets/icons/sentence-th.svg', color:'#F17FA8', light:'#FDE1EC',
    type:'ar', lang:'th', levels:10
  },
  {
    id:'ar-eng', name:'ต่อประโยค (Eng)', emoji:'🤟', icon:'assets/icons/sentence-en.svg', color:'#3EC6C6', light:'#D8F6F6',
    type:'ar', lang:'en', levels:10
  },
  {
    id:'ar-math', name:'หยิบตัวเลข 1', emoji:'🧮', icon:'assets/icons/count.svg', color:'#FFB020', light:'#FFF1D6',
    type:'ar', mode:'math', levels:10, mathTiers:[[0,7],[0,13],[0,20]]
  },
  {
    id:'ar-math2', name:'หยิบตัวเลข 2', emoji:'🔟', icon:'assets/icons/count2.svg', color:'#4CAF50', light:'#DFF3E0',
    type:'ar', mode:'math', levels:10, mathTiers:[[10,17],[10,23],[10,30]], mathChoices:4
  },
  {
    id:'ar-math3', name:'หยิบตัวเลข 3', emoji:'💯', icon:'assets/icons/count3.svg', color:'#E8598C', light:'#FDE1EA',
    type:'ar', mode:'math', levels:10, mathTiers:[[20,50],[30,75],[50,100]], mathChoices:4
  },
  {
    id:'ar-match', name:'โยงเส้น (ไทย)', emoji:'🪢', icon:'assets/icons/connect-th.svg', color:'#8E7CC3', light:'#EAE4F7',
    type:'ar', mode:'match', lang:'th', levels:10
  },
  {
    id:'ar-match-en', name:'โยงเส้น (Eng)', emoji:'🔗', icon:'assets/icons/connect-en.svg', color:'#4FA9E8', light:'#DCF0FB',
    type:'ar', mode:'match', lang:'en', levels:10
  },
  {
    id:'ar-count', name:'หยิบให้ครบ', emoji:'🧺', icon:'assets/icons/collect.svg', color:'#1FAF9E', light:'#D3F3EF',
    type:'ar', mode:'count', levels:10, desktopOnly:true
  },
  {
    id:'skill-memory', name:'จับคู่โดมิโน', emoji:'🎲', icon:'assets/icons/domino.svg', color:'#E0764C', light:'#FBE3D4',
    type:'skill', mode:'memory', levels:3
  },
  {
    id:'skill-animals', name:'จับคู่สัตว์', emoji:'🦜', icon:'assets/icons/match-animal.svg', color:'#3A9A6E', light:'#D8F3DC',
    type:'skill', mode:'animals', levels:3
  },
  {
    id:'skill-shadow', name:'ทายเงา 1', emoji:'🔦', icon:'assets/icons/shadow.svg', color:'#5D6D9E', light:'#E4E8F6',
    type:'skill', mode:'shadow', levels:15
  },
  {
    id:'skill-shadow2', name:'ทายเงา 2', emoji:'👥', icon:'assets/icons/shadow-2.svg', color:'#7C5CA8', light:'#EDE3F8',
    type:'skill', mode:'shadow', overlap:2, levels:15
  },
  {
    id:'skill-shadow3', name:'ทายเงา 3', emoji:'🎭', icon:'assets/icons/shadow-3.svg', color:'#B25D7E', light:'#F9E3EC',
    type:'skill', mode:'shadow', overlap:3, levels:15
  },
  {
    id:'skill-mix', name:'ผสมสี 1', emoji:'🎨', icon:'assets/icons/mix-1.svg', color:'#E8734C', light:'#FDE7DC',
    type:'skill', mode:'mix', levels:10
  },
  {
    id:'skill-mix2', name:'ผสมสี 2', emoji:'🌈', icon:'assets/icons/mix-2.svg', color:'#5E8FD8', light:'#E2ECFB',
    type:'skill', mode:'mix', mixAdvanced:true, levels:10
  },
  {
    id:'skill-music', name:'เกมดนตรี 1', emoji:'🎹', icon:'assets/icons/music-1.svg', color:'#C86FB0', light:'#F8E3F1',
    type:'skill', mode:'music', musicMode:1, levels:10
  },
  {
    id:'skill-music2', name:'เกมดนตรี 2', emoji:'🎼', icon:'assets/icons/music-2.svg', color:'#7B6FD0', light:'#E7E3F8',
    type:'skill', mode:'music', musicMode:2, levels:7
  },
  {
    id:'skill-music3', name:'เกมดนตรี 3', emoji:'🎤', icon:'assets/icons/music-3.svg', color:'#D08A5E', light:'#FBEBDD',
    type:'skill', mode:'music', musicMode:3, levels:10, cardTag:'🎹 เล่นผ่านปลดล็อกเปียโน'
  },
  {
    id:'skill-clock1', name:'นาฬิกาวิเศษ 1', emoji:'🕐', icon:'assets/icons/clock-1.svg', color:'#4A9EDF', light:'#DCEEFB',
    type:'skill', mode:'clock', clockMode:1, levels:10, isNew:true
  },
  {
    id:'skill-clock2', name:'นาฬิกาวิเศษ 2', emoji:'🕰️', icon:'assets/icons/clock-2.svg', color:'#E0813F', light:'#FBE9D9',
    type:'skill', mode:'clock', clockMode:2, levels:10, isNew:true
  },
  {
    id:'skill-clock3', name:'นาฬิกาวิเศษ 3', emoji:'⏳', icon:'assets/icons/clock-3.svg', color:'#7E57C2', light:'#E9E1F7',
    type:'skill', mode:'clock', clockMode:3, levels:10, isNew:true
  },
  {
    id:'skill-clock4', name:'นาฬิกาวิเศษ 4', emoji:'⏰', icon:'assets/icons/clock-4.svg', color:'#D9536F', light:'#FBDDE4',
    type:'skill', mode:'clock', clockMode:4, levels:10, isNew:true
  },
  {
    id:'listen1', name:'ฟังคำศัพท์ 1', emoji:'🎧', icon:'assets/icons/listen-1.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'hint', wordLens:[3,3,4], levels:10
  },
  {
    id:'listen2', name:'ฟังคำศัพท์ 2', emoji:'👂', icon:'assets/icons/listen-2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'nohint', wordLens:[3,4,4], levels:10
  },
  {
    id:'listen-th1', name:'ฟังคำไทย 1', emoji:'🗣️', icon:'assets/icons/listen-th1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'hint', lang:'th', wordLens:[3,4,5], levels:10
  },
  {
    id:'listen-th2', name:'ฟังคำไทย 2', emoji:'🔊', icon:'assets/icons/listen-th2.svg', color:'#2FAE86', light:'#D8F3EA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[4,4,5], levels:10
  },
  {
    id:'write-dots1', name:'ลากเส้นต่อจุด 1', emoji:'✏️', icon:'assets/icons/dots-1.svg', color:'#F08A24', light:'#FDEBD5',
    type:'write', mode:'dots', dotsPool:'easy', levels:10, isNew:true
  },
  {
    id:'write-dots2', name:'ลากเส้นต่อจุด 2', emoji:'🖍️', icon:'assets/icons/dots-2.svg', color:'#9C64C8', light:'#F0E4FA',
    type:'write', mode:'dots', dotsPool:'hard', levels:10, isNew:true
  }
];
