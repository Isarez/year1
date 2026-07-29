/* ============================= DATA ============================= */
const CATS = [
  {
    id:'math', name:'คณิตศาสตร์', emoji:'🔢', icon:'assets/icons/math.svg', color:'#FF8A5B', light:'#FFE7DA',
    questions:[
      {q:'★★★★★★★ มีดาวกี่ดวง?', emoji:'', choices:['5','6','7','8'], correct:2, explain:'นับดาวได้ทั้งหมด 7 ดวงจ้ะ'},
      {q:'จำนวน "สิบสอง" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'🔢', choices:['21','12','20','22'], correct:1, explain:'สิบสอง เขียนเป็นตัวเลขคือ 12'},
      {q:'ข้อใดเรียงจากน้อยไปมากได้ถูกต้อง?', emoji:'📊', choices:['15, 9, 4','4, 9, 15','9, 15, 4','15, 4, 9'], correct:1, explain:'4 น้อยที่สุด ตามด้วย 9 แล้ว 15'},
      {q:'จำนวนใดอยู่ระหว่าง 17 กับ 20?', emoji:'🔢', choices:['16','18','21','15'], correct:1, explain:'18 อยู่ระหว่าง 17 กับ 20'},
      {q:'8 + 6 = ?', emoji:'➕', choices:['13','14','15','16'], correct:1, explain:'8 บวก 6 เท่ากับ 14'},
      {q:'ถ้า ▢ + 5 = 13 แล้ว ▢ คือเท่าไร?', emoji:'➕', choices:['6','7','8','9'], correct:2, explain:'8 + 5 = 13 ดังนั้น ▢ คือ 8'},
      {q:'แม่ซื้อส้ม 24 ลูก และองุ่น 15 ลูก มีผลไม้ทั้งหมดกี่ลูก?', emoji:'🍊', choices:['39','38','40','41'], correct:0, explain:'24 + 15 = 39 ลูก'},
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
  },

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
      {q:'โน้ตสากลหลักมีกี่ตัว (C D E F G A B)?', emoji:'🎹', choices:['7 ตัว','5 ตัว','8 ตัว','6 ตัว'], correct:0, explain:'โน้ตสากลหลักมี 7 ตัว: C D E F G A B', tier:1},
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
  },

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
      {q:'ตัวโน้ตที่ค้างเสียงยาว ต่างจากตัวสั้นอย่างไร?', emoji:'🎶', choices:['เสียงยาวกว่า','ดังกว่า','สูงกว่า','ต่ำกว่า'], correct:0, explain:'โน้ตยาวค้างเสียงนานกว่า', tier:2},
      {q:'จังหวะ "ช้า-เร็ว-ช้า-เร็ว" เป็นแบบใด?', emoji:'🔀', choices:['สลับกัน','เหมือนกันหมด','เงียบตลอด','ช้าตลอด'], correct:0, explain:'เป็นจังหวะสลับช้า-เร็ว', tier:2},
      {q:'ร้องเพลงพร้อมเพื่อนควรทำอย่างไร?', emoji:'🎤', choices:['ร้องให้พร้อมกัน','ร้องแข่งดัง','ร้องคนละจังหวะ','ร้องเงียบคนเดียว'], correct:0, explain:'ควรร้องให้พร้อมเพรียงกัน', tier:2},
      {q:'โน้ตเสียงสูงสุดในกลุ่ม โด เร มี คือตัวใด?', emoji:'🔝', choices:['มี','โด','เร','ฟา'], correct:0, explain:'ในกลุ่มนี้ มี สูงสุด', tier:2},
      {q:'ถ้าเคาะจังหวะเร็วขึ้นเรื่อยๆ เพลงจะเป็นอย่างไร?', emoji:'⏩', choices:['เร่งเร็วขึ้น','ช้าลง','เงียบลง','หยุด'], correct:0, explain:'จังหวะเร็วขึ้นเพลงจะเร่งขึ้น', tier:2},
      {q:'เพลงกล่อมเด็กควรมีจังหวะอย่างไร?', emoji:'🌙', choices:['ช้านุ่มนวล','เร็วแรง','กระโดดโลดเต้น','ดังสนั่น'], correct:0, explain:'เพลงกล่อมเด็กใช้จังหวะช้านุ่มนวล', tier:2},
      {q:'โน้ตดนตรีตัวแรกคือตัวใด?', emoji:'🎵', choices:['โด','ที','ซอล','ฟา'], correct:0, explain:'ลำดับเริ่มที่ โด เร มี', tier:1},
      {q:'การเคาะจังหวะสม่ำเสมอเรียกว่าอะไร?', emoji:'🥁', choices:['จังหวะ','ทำนอง','เนื้อร้อง','เสียงประสาน'], correct:0, explain:'การเคาะสม่ำเสมอคือจังหวะ', tier:1},
      {q:'เรียงโน้ตให้ถูก: โด เร ▢ ฟา', emoji:'🎶', choices:['มี','ซอล','ที','ลา'], correct:0, explain:'ลำดับคือ โด เร มี ฟา', tier:1},
      {q:'เพลงที่ร้องเชียร์กีฬาควรมีจังหวะแบบใด?', emoji:'📣', choices:['สนุกคึกคัก','ช้าเศร้า','เงียบ','ไม่มีจังหวะ'], correct:0, explain:'เพลงเชียร์ควรสนุกคึกคัก', tier:2},
      {q:'ตัวโน้ตเขียนอยู่บนอะไร?', emoji:'🎼', choices:['บรรทัด 5 เส้น','ตาราง','กราฟ','กระดาน'], correct:0, explain:'โน้ตเขียนบนบรรทัด 5 เส้น', tier:2},
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
  { id:'p2-calendar', name:'ปฏิทินวิเศษ', emoji:'📅', icon:'assets/icons/p2-calendar.svg', color:'#E67E9C', light:'#FBE1EA', type:'skill', mode:'calendar', levels:10, grade:'p2', isNew:true },

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
  },

  /* ===================== ระดับชั้น ป.4 (grade:'p4') =====================
     อ้างอิงตัวชี้วัดหลักสูตรแกนกลาง ป.4 — คณิต: จำนวนเกิน 100,000 / คูณ-หารหลายหลัก / เศษส่วน-ทศนิยม-มุม-พื้นที่
     ภาษาไทย: ชนิดของคำ 7 ชนิด, คำเป็น-คำตาย, สำนวน-สุภาษิต, อ่านจับใจความ | English: Present Simple, jobs/routine, reading
     โจทย์ tier 1-2 = เนื้อหา ป.4, tier 3 = เนื้อหาเร่ง ป.5 (ห้ามเกิน 1 ชั้น) */
  /* ---------- คณิต ป.4 ---------- */
  {
    id:'p4-math1', name:'คณิต ป.4 · จำนวนนับและค่าประจำหลัก', emoji:'🔷', icon:'assets/icons/p4-math1.svg', color:'#7C5CFC', light:'#E9E3FF', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'เลข 356,214 มีเลขในหลักแสนคือเลขใด?', emoji:'🔢', choices:['3','5','6','2'], correct:0, explain:'เลข 3 อยู่หลักแสน', tier:1},
      {q:'"สี่แสนสองหมื่น" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'✍️', choices:['420,000','402,000','42,000','4,200,000'], correct:0, explain:'สี่แสนสองหมื่น = 420,000', tier:1},
      {q:'เลข 7 ในจำนวน 470,000 มีค่าเท่าไร?', emoji:'💯', choices:['70,000','7,000','700,000','7'], correct:0, explain:'เลข 7 อยู่หลักหมื่น จึงมีค่า 70,000', tier:1},
      {q:'จำนวนใดมากที่สุด?', emoji:'📊', choices:['905,000','890,999','899,000','98,999'], correct:0, explain:'905,000 มากที่สุด', tier:1},
      {q:'1,000,000 อ่านว่าอย่างไร?', emoji:'🗣️', choices:['หนึ่งล้าน','หนึ่งแสน','หนึ่งหมื่น','สิบล้าน'], correct:0, explain:'1,000,000 อ่านว่า หนึ่งล้าน', tier:1},
      {q:'นับทีละ 100,000: 200,000, 300,000, 400,000, ▢', emoji:'🔟', choices:['500,000','410,000','450,000','600,000'], correct:0, explain:'นับเพิ่มทีละ 100,000 ตัวต่อไปคือ 500,000', tier:1},
      {q:'จำนวนใดน้อยที่สุด?', emoji:'📉', choices:['64,999','65,000','65,900','66,000'], correct:0, explain:'64,999 น้อยที่สุด', tier:1},
      {q:'เลข 8 ในจำนวน 8,340,000 อยู่ในหลักใด?', emoji:'#️⃣', choices:['หลักล้าน','หลักแสน','หลักหมื่น','หลักพัน'], correct:0, explain:'8,340,000 อ่านว่า แปดล้านสามแสนสี่หมื่น เลข 8 จึงอยู่หลักล้าน', tier:1},
      {q:'"สองล้านห้าแสน" เขียนเป็นตัวเลขได้อย่างไร?', emoji:'✏️', choices:['2,500,000','250,000','2,050,000','25,000,000'], correct:0, explain:'สองล้านห้าแสน = 2,500,000', tier:1},
      {q:'ปัด 47,860 ให้เป็นจำนวนเต็มหลักพันได้เท่าไร?', emoji:'🎯', choices:['48,000','47,000','47,900','50,000'], correct:0, explain:'หลักร้อยเป็น 8 (มากกว่า 5) จึงปัดขึ้นเป็น 48,000', tier:2},
      {q:'ปัด 236,400 ให้เป็นจำนวนเต็มหลักหมื่นได้เท่าไร?', emoji:'🎯', choices:['240,000','230,000','236,000','200,000'], correct:0, explain:'หลักพันเป็น 6 (มากกว่า 5) จึงปัดขึ้นเป็น 240,000', tier:2},
      {q:'เรียงจากน้อยไปมากข้อใดถูกต้อง?', emoji:'📈', choices:['58,900; 59,800; 95,000','95,000; 59,800; 58,900','59,800; 58,900; 95,000','58,900; 95,000; 59,800'], correct:0, explain:'58,900 น้อยสุด แล้ว 59,800 แล้ว 95,000', tier:2},
      {q:'เติมเครื่องหมายให้ถูก: 305,000 ▢ 350,000', emoji:'⚖️', choices:['<','>','=','≠'], correct:0, explain:'305,000 น้อยกว่า 350,000 จึงใช้ <', tier:2},
      {q:'จำนวนใดอยู่ระหว่าง 199,000 กับ 201,000?', emoji:'🔍', choices:['200,500','198,000','202,000','190,000'], correct:0, explain:'200,500 อยู่ระหว่าง 199,000 กับ 201,000', tier:2},
      {q:'890,000 + 10,000 = ?', emoji:'➕', choices:['900,000','891,000','800,000','990,000'], correct:0, explain:'890,000 + 10,000 = 900,000', tier:2},
      {q:'จำนวน 4,706,000 อ่านว่าอย่างไร?', emoji:'🗣️', choices:['สี่ล้านเจ็ดแสนหกพัน','สี่ล้านเจ็ดหมื่นหกพัน','สี่แสนเจ็ดหมื่นหกพัน','สี่ล้านเจ็ดแสนหกหมื่น'], correct:0, explain:'4,706,000 = สี่ล้าน เจ็ดแสน หกพัน', tier:2},
      {q:'จำนวนคู่ที่มากที่สุดที่น้อยกว่า 50,001 คือจำนวนใด?', emoji:'🧮', choices:['50,000','49,999','50,002','49,998'], correct:0, explain:'50,000 เป็นจำนวนคู่และน้อยกว่า 50,001', tier:2},
      {q:'ค่าประจำหลักของเลข 6 ในจำนวน 3,620,000 คือเท่าไร?', emoji:'💠', choices:['600,000','60,000','6,000,000','6,000'], correct:0, explain:'เลข 6 อยู่หลักแสน จึงมีค่า 600,000', tier:2},
      {q:'จำนวนใดหารด้วย 5 ลงตัว?', emoji:'✳️', choices:['12,345','12,341','12,343','12,347'], correct:0, explain:'จำนวนที่ลงท้ายด้วย 0 หรือ 5 หารด้วย 5 ลงตัว', tier:3},
      {q:'ตัวประกอบทั้งหมดของ 12 มีกี่ตัว?', emoji:'🧩', choices:['6 ตัว (1,2,3,4,6,12)','4 ตัว','5 ตัว','12 ตัว'], correct:0, explain:'ตัวประกอบของ 12 คือ 1, 2, 3, 4, 6, 12 รวม 6 ตัว', tier:3},
      {q:'จำนวนใดเป็น "จำนวนเฉพาะ"?', emoji:'🔒', choices:['13','15','21','27'], correct:0, explain:'13 มีตัวประกอบแค่ 1 กับ 13 จึงเป็นจำนวนเฉพาะ', tier:3},
      {q:'ค.ร.น. (ตัวคูณร่วมน้อย) ของ 4 กับ 6 คือเท่าไร?', emoji:'🔗', choices:['12','24','6','4'], correct:0, explain:'พหุคูณของ 4 คือ 4,8,12… ของ 6 คือ 6,12… ตัวร่วมที่น้อยที่สุดคือ 12', tier:3},
      {q:'ห.ร.ม. (ตัวหารร่วมมาก) ของ 12 กับ 18 คือเท่าไร?', emoji:'🧷', choices:['6','3','12','2'], correct:0, explain:'ตัวหารร่วมของ 12 กับ 18 คือ 1,2,3,6 ตัวที่มากที่สุดคือ 6', tier:3}
    ]
  },
  {
    id:'p4-math2', name:'คณิต ป.4 · คูณ หาร และโจทย์ระคน', emoji:'🟠', icon:'assets/icons/p4-math2.svg', color:'#5E3FE0', light:'#E9E3FF', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'24 × 3 = ?', emoji:'✖️', choices:['72','62','74','69'], correct:0, explain:'24 × 3 = 72', tier:1},
      {q:'125 × 4 = ?', emoji:'✖️', choices:['500','450','520','480'], correct:0, explain:'125 × 4 = 500', tier:1},
      {q:'96 ÷ 8 = ?', emoji:'➗', choices:['12','11','13','8'], correct:0, explain:'96 ÷ 8 = 12', tier:1},
      {q:'144 ÷ 12 = ?', emoji:'➗', choices:['12','11','14','16'], correct:0, explain:'144 ÷ 12 = 12', tier:1},
      {q:'มีกล่อง 15 กล่อง กล่องละ 12 ชิ้น รวมกี่ชิ้น?', emoji:'📦', choices:['180','170','190','150'], correct:0, explain:'15 × 12 = 180 ชิ้น', tier:1},
      {q:'แบ่งดินสอ 156 แท่ง ใส่กล่องละ 12 แท่ง ได้กี่กล่อง?', emoji:'✏️', choices:['13 กล่อง','12 กล่อง','14 กล่อง','15 กล่อง'], correct:0, explain:'156 ÷ 12 = 13 กล่อง', tier:1},
      {q:'32 × 20 = ?', emoji:'✖️', choices:['640','620','660','340'], correct:0, explain:'32 × 2 = 64 แล้วเติม 0 ได้ 640', tier:1},
      {q:'250 ÷ 5 = ?', emoji:'➗', choices:['50','45','55','25'], correct:0, explain:'250 ÷ 5 = 50', tier:1},
      {q:'8 × 7 × 2 = ?', emoji:'🧮', choices:['112','98','102','114'], correct:0, explain:'8 × 7 = 56 แล้ว 56 × 2 = 112', tier:1},
      {q:'243 × 12 = ?', emoji:'✖️', choices:['2,916','2,816','2,936','2,406'], correct:0, explain:'243 × 12 = 243 × 10 + 243 × 2 = 2,430 + 486 = 2,916', tier:2},
      {q:'375 ÷ 15 = ?', emoji:'➗', choices:['25','24','26','35'], correct:0, explain:'15 × 25 = 375 จึงได้ 25', tier:2},
      {q:'87 ÷ 6 ได้ผลลัพธ์เท่าไร (มีเศษ)?', emoji:'➗', choices:['14 เศษ 3','13 เศษ 3','14 เศษ 5','15 เศษ 1'], correct:0, explain:'6 × 14 = 84 เหลือเศษ 3 จึงได้ 14 เศษ 3', tier:2},
      {q:'ซื้อสมุด 24 เล่ม เล่มละ 18 บาท ต้องจ่ายกี่บาท?', emoji:'📒', choices:['432 บาท','422 บาท','442 บาท','382 บาท'], correct:0, explain:'24 × 18 = 432 บาท', tier:2},
      {q:'มีเงิน 1,000 บาท ซื้อของชิ้นละ 145 บาท จำนวน 6 ชิ้น เหลือเงินกี่บาท?', emoji:'💰', choices:['130 บาท','140 บาท','120 บาท','230 บาท'], correct:0, explain:'145 × 6 = 870 แล้ว 1,000 - 870 = 130 บาท', tier:2},
      {q:'(12 + 8) × 5 = ?', emoji:'🧮', choices:['100','52','60','108'], correct:0, explain:'ทำในวงเล็บก่อน 12 + 8 = 20 แล้ว 20 × 5 = 100', tier:2},
      {q:'25 × 4 × 3 = ? (ใช้สมบัติการสลับที่ช่วยคิด)', emoji:'🔄', choices:['300','280','320','250'], correct:0, explain:'25 × 4 = 100 แล้ว 100 × 3 = 300', tier:2},
      {q:'รถบัส 1 คันนั่งได้ 45 คน นักเรียน 315 คนต้องใช้รถกี่คัน?', emoji:'🚌', choices:['7 คัน','6 คัน','8 คัน','9 คัน'], correct:0, explain:'315 ÷ 45 = 7 คัน', tier:2},
      {q:'โรงงานผลิตของ 1,250 ชิ้นต่อวัน 8 วันผลิตได้กี่ชิ้น?', emoji:'🏭', choices:['10,000 ชิ้น','9,000 ชิ้น','12,500 ชิ้น','8,250 ชิ้น'], correct:0, explain:'1,250 × 8 = 10,000 ชิ้น', tier:2},
      {q:'36 ÷ 4 + 5 × 2 = ?', emoji:'🧠', choices:['19','28','23','16'], correct:0, explain:'คูณหารก่อน: 36 ÷ 4 = 9, 5 × 2 = 10 แล้วบวกกัน = 19', tier:3},
      {q:'50 - (6 × 4) ÷ 2 = ?', emoji:'🧠', choices:['38','12','26','44'], correct:0, explain:'ในวงเล็บ 6 × 4 = 24 แล้ว 24 ÷ 2 = 12 สุดท้าย 50 - 12 = 38', tier:3},
      {q:'ถ้า ▢ × 15 = 450 แล้ว ▢ คือเท่าไร?', emoji:'❓', choices:['30','25','35','45'], correct:0, explain:'450 ÷ 15 = 30', tier:3},
      {q:'พ่อค้าซื้อไข่ 30 แผง แผงละ 30 ฟอง ขายไป 700 ฟอง เหลือกี่ฟอง?', emoji:'🥚', choices:['200 ฟอง','300 ฟอง','100 ฟอง','250 ฟอง'], correct:0, explain:'30 × 30 = 900 ฟอง แล้ว 900 - 700 = 200 ฟอง', tier:3},
      {q:'ค่าเฉลี่ยของ 10, 20 และ 30 คือเท่าไร?', emoji:'📊', choices:['20','30','25','60'], correct:0, explain:'(10 + 20 + 30) ÷ 3 = 60 ÷ 3 = 20', tier:3}
    ]
  },
  {
    id:'p4-math3', name:'คณิต ป.4 · เศษส่วน ทศนิยม มุม และพื้นที่', emoji:'📐', icon:'assets/icons/p4-math3.svg', color:'#4A2FC0', light:'#E9E3FF', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'1/4 + 2/4 = ?', emoji:'🍕', choices:['3/4','3/8','2/8','1/2'], correct:0, explain:'ตัวส่วนเท่ากัน บวกเฉพาะตัวเศษ 1 + 2 = 3 ได้ 3/4', tier:1},
      {q:'5/8 - 2/8 = ?', emoji:'🍰', choices:['3/8','3/16','7/8','2/8'], correct:0, explain:'ตัวส่วนเท่ากัน ลบเฉพาะตัวเศษ 5 - 2 = 3 ได้ 3/8', tier:1},
      {q:'เศษส่วนใดเท่ากับ 1/2?', emoji:'🥧', choices:['2/4','1/3','3/8','2/5'], correct:0, explain:'2/4 ย่อได้เป็น 1/2 จึงเท่ากัน', tier:1},
      {q:'ทศนิยม 0.25 อ่านว่าอย่างไร?', emoji:'🔢', choices:['ศูนย์จุดสองห้า','ศูนย์จุดยี่สิบห้า','สองจุดห้า','ยี่สิบห้า'], correct:0, explain:'0.25 อ่านว่า ศูนย์จุดสองห้า', tier:1},
      {q:'0.5 เขียนเป็นเศษส่วนได้เท่าไร?', emoji:'➗', choices:['1/2','1/5','5/10 เท่านั้น','2/5'], correct:0, explain:'0.5 = 5/10 = 1/2', tier:1},
      {q:'มุมที่มีขนาด 90 องศา เรียกว่ามุมอะไร?', emoji:'📐', choices:['มุมฉาก','มุมแหลม','มุมป้าน','มุมตรง'], correct:0, explain:'มุม 90 องศา คือมุมฉาก', tier:1},
      {q:'มุมที่เล็กกว่า 90 องศา เรียกว่ามุมอะไร?', emoji:'📏', choices:['มุมแหลม','มุมป้าน','มุมฉาก','มุมกลับ'], correct:0, explain:'มุมที่เล็กกว่า 90 องศา คือมุมแหลม', tier:1},
      {q:'สี่เหลี่ยมผืนผ้ากว้าง 4 ซม. ยาว 6 ซม. มีพื้นที่เท่าไร?', emoji:'🟦', choices:['24 ตร.ซม.','20 ตร.ซม.','10 ตร.ซม.','12 ตร.ซม.'], correct:0, explain:'พื้นที่สี่เหลี่ยมผืนผ้า = กว้าง × ยาว = 4 × 6 = 24 ตารางเซนติเมตร', tier:1},
      {q:'สี่เหลี่ยมจัตุรัสด้านละ 5 ซม. มีความยาวรอบรูปเท่าไร?', emoji:'⬜', choices:['20 ซม.','25 ซม.','10 ซม.','15 ซม.'], correct:0, explain:'ความยาวรอบรูป = 5 × 4 ด้าน = 20 เซนติเมตร', tier:1},
      {q:'3/5 กับ 2/5 ตัวใดมากกว่า?', emoji:'⚖️', choices:['3/5','2/5','เท่ากัน','เทียบไม่ได้'], correct:0, explain:'ตัวส่วนเท่ากัน ตัวเศษมากกว่าย่อมมากกว่า 3/5 จึงมากกว่า', tier:2},
      {q:'0.7 กับ 0.65 ตัวใดมากกว่า?', emoji:'📈', choices:['0.7','0.65','เท่ากัน','เทียบไม่ได้'], correct:0, explain:'0.7 = 0.70 ซึ่งมากกว่า 0.65', tier:2},
      {q:'1.2 + 0.35 = ?', emoji:'➕', choices:['1.55','1.47','1.25','1.75'], correct:0, explain:'จัดจุดทศนิยมให้ตรงกัน 1.20 + 0.35 = 1.55', tier:2},
      {q:'2.5 - 0.8 = ?', emoji:'➖', choices:['1.7','1.3','2.3','1.8'], correct:0, explain:'2.5 - 0.8 = 1.7', tier:2},
      {q:'มุมที่มีขนาดมากกว่า 90 แต่น้อยกว่า 180 องศา เรียกว่ามุมอะไร?', emoji:'📐', choices:['มุมป้าน','มุมแหลม','มุมฉาก','มุมตรง'], correct:0, explain:'มุมระหว่าง 90-180 องศา คือมุมป้าน', tier:2},
      {q:'มุมตรงมีขนาดกี่องศา?', emoji:'📏', choices:['180 องศา','90 องศา','360 องศา','45 องศา'], correct:0, explain:'มุมตรงเป็นเส้นตรง มีขนาด 180 องศา', tier:2},
      {q:'สี่เหลี่ยมผืนผ้ากว้าง 7 ซม. ยาว 9 ซม. มีความยาวรอบรูปเท่าไร?', emoji:'🟨', choices:['32 ซม.','63 ซม.','16 ซม.','25 ซม.'], correct:0, explain:'ความยาวรอบรูป = (7 + 9) × 2 = 32 เซนติเมตร', tier:2},
      {q:'พื้นที่ 1 ตารางเมตร เท่ากับกี่ตารางเซนติเมตร?', emoji:'🧮', choices:['10,000 ตร.ซม.','100 ตร.ซม.','1,000 ตร.ซม.','10 ตร.ซม.'], correct:0, explain:'1 เมตร = 100 ซม. พื้นที่จึงเป็น 100 × 100 = 10,000 ตารางเซนติเมตร', tier:2},
      {q:'แผนภูมิแท่งใช้แสดงสิ่งใด?', emoji:'📊', choices:['เปรียบเทียบจำนวนของแต่ละกลุ่ม','บอกเวลา','วัดอุณหภูมิเท่านั้น','บอกทิศทาง'], correct:0, explain:'แผนภูมิแท่งใช้เปรียบเทียบจำนวนหรือปริมาณของแต่ละกลุ่มได้ง่าย', tier:2},
      {q:'จำนวนคละ 2 3/4 เท่ากับเศษเกินใด?', emoji:'🍕', choices:['11/4','9/4','8/4','7/4'], correct:0, explain:'2 × 4 = 8 บวกตัวเศษ 3 ได้ 11 จึงเป็น 11/4', tier:3},
      {q:'1/2 + 1/4 = ? (ตัวส่วนไม่เท่ากัน)', emoji:'🥧', choices:['3/4','2/6','1/6','2/4'], correct:0, explain:'ทำ 1/2 ให้เป็น 2/4 แล้วบวก 1/4 ได้ 3/4', tier:3},
      {q:'0.4 × 10 = ?', emoji:'✖️', choices:['4','0.04','40','0.4'], correct:0, explain:'คูณด้วย 10 เลื่อนจุดทศนิยมไปขวา 1 ตำแหน่ง ได้ 4', tier:3},
      {q:'สามเหลี่ยมมีมุมภายในรวมกันกี่องศา?', emoji:'🔺', choices:['180 องศา','90 องศา','360 องศา','270 องศา'], correct:0, explain:'มุมภายในของสามเหลี่ยมรวมกันได้ 180 องศาเสมอ', tier:3},
      {q:'ห้องกว้าง 3 เมตร ยาว 5 เมตร ปูกระเบื้องแผ่นละ 1 ตารางเมตร ต้องใช้กี่แผ่น?', emoji:'🧱', choices:['15 แผ่น','8 แผ่น','16 แผ่น','12 แผ่น'], correct:0, explain:'พื้นที่ห้อง = 3 × 5 = 15 ตารางเมตร จึงใช้กระเบื้อง 15 แผ่น', tier:3}
    ]
  },
  /* ---------- ภาษาไทย ป.4 (ชนิดของคำ 7 ชนิด / คำเป็น-คำตาย-คำพ้อง-สำนวน / อ่านจับใจความ) ---------- */
  {
    id:'p4-thai1', name:'ภาษาไทย ป.4 · ชนิดของคำและคำเป็นคำตาย', emoji:'📕', icon:'assets/icons/p4-thai1.svg', color:'#EF5DA8', light:'#FCE0EF', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'คำว่า "โรงเรียน" เป็นคำชนิดใด?', emoji:'🏫', choices:['คำนาม','คำกริยา','คำสรรพนาม','คำวิเศษณ์'], correct:0, explain:'โรงเรียนเป็นชื่อสถานที่ จึงเป็นคำนาม', tier:1},
      {q:'คำว่า "เดิน" เป็นคำชนิดใด?', emoji:'🚶', choices:['คำกริยา','คำนาม','คำบุพบท','คำสันธาน'], correct:0, explain:'เดินเป็นคำแสดงอาการ จึงเป็นคำกริยา', tier:1},
      {q:'คำใดเป็นคำสรรพนาม?', emoji:'🙋', choices:['ดิฉัน','วิ่ง','สวย','บน'], correct:0, explain:'ดิฉันใช้แทนชื่อผู้พูด จึงเป็นคำสรรพนาม', tier:1},
      {q:'"ดอกไม้สวยมาก" คำว่า "สวย" เป็นคำชนิดใด?', emoji:'🌸', choices:['คำวิเศษณ์','คำนาม','คำกริยา','คำสรรพนาม'], correct:0, explain:'สวยเป็นคำขยายบอกลักษณะ จึงเป็นคำวิเศษณ์', tier:1},
      {q:'คำใดเป็นคำบุพบท?', emoji:'📍', choices:['ใน','กิน','แมว','เร็ว'], correct:0, explain:'"ใน" บอกตำแหน่ง เป็นคำบุพบท', tier:1},
      {q:'คำใดเป็นคำสันธาน (คำเชื่อม)?', emoji:'🔗', choices:['และ','โต๊ะ','วิ่ง','สูง'], correct:0, explain:'"และ" ใช้เชื่อมคำหรือประโยค เป็นคำสันธาน', tier:1},
      {q:'คำใดเป็นคำอุทาน?', emoji:'❗', choices:['โอ๊ย','เดิน','บ้าน','เขา'], correct:0, explain:'"โอ๊ย" เป็นคำเปล่งเสียงแสดงอารมณ์ จึงเป็นคำอุทาน', tier:1},
      {q:'คำใดเป็น "คำเป็น"?', emoji:'📖', choices:['กิน','กัด','กบ','กัก'], correct:0, explain:'คำเป็นสะกดด้วยแม่ กง กน กม เกย เกอว หรือสระเสียงยาว — "กิน" สะกดแม่กน จึงเป็นคำเป็น', tier:1},
      {q:'คำใดเป็น "คำตาย"?', emoji:'📗', choices:['นก','นม','นาน','นอน'], correct:0, explain:'คำตายสะกดด้วยแม่ กก กด กบ — "นก" สะกดแม่กก จึงเป็นคำตาย', tier:1},
      {q:'"นักเรียนอ่านหนังสือในห้องสมุด" มีคำนามกี่คำ?', emoji:'📚', choices:['3 คำ (นักเรียน, หนังสือ, ห้องสมุด)','2 คำ','4 คำ','1 คำ'], correct:0, explain:'นักเรียน หนังสือ และห้องสมุด เป็นคำนามรวม 3 คำ', tier:2},
      {q:'"เขาวิ่งเร็วมาก" คำว่า "มาก" ขยายคำใด?', emoji:'🏃', choices:['เร็ว','วิ่ง','เขา','ไม่ขยายคำใด'], correct:0, explain:'"มาก" เป็นคำวิเศษณ์ขยายคำวิเศษณ์ "เร็ว" อีกที', tier:2},
      {q:'คำใดเป็นคำนามที่บอกหมวดหมู่ (สมุหนาม)?', emoji:'👥', choices:['ฝูง','แมว','วิ่ง','สวย'], correct:0, explain:'"ฝูง" ใช้เรียกกลุ่มของสิ่งมีชีวิต เช่น ฝูงนก เป็นสมุหนาม', tier:2},
      {q:'"ฉันไปโรงเรียนแต่เขาอยู่บ้าน" คำเชื่อมในประโยคนี้คือคำใด?', emoji:'🔗', choices:['แต่','ไป','อยู่','บ้าน'], correct:0, explain:'"แต่" เป็นคำสันธานเชื่อมความที่ขัดแย้งกัน', tier:2},
      {q:'คำใดเป็นอักษรควบไม่แท้ (อ่านไม่ออกเสียงควบ)?', emoji:'✍️', choices:['จริง','กลอง','ครัว','ปลา'], correct:0, explain:'"จริง" เขียน จ + ร แต่อ่านว่า จิง จึงเป็นอักษรควบไม่แท้', tier:2},
      {q:'คำใดเป็นคำที่มีอักษรนำ?', emoji:'📝', choices:['สนาม','สอง','สาม','สี'], correct:0, explain:'"สนาม" ส นำ น อ่านว่า สะ-หนาม จึงเป็นอักษรนำ', tier:2},
      {q:'ประโยค "แมวนอนอยู่ใต้โต๊ะ" คำว่า "ใต้" ทำหน้าที่อะไร?', emoji:'🐱', choices:['บอกตำแหน่ง (บุพบท)','บอกอาการ','แทนชื่อ','เชื่อมประโยค'], correct:0, explain:'"ใต้" เป็นคำบุพบทบอกตำแหน่ง', tier:2},
      {q:'ข้อใดเป็นประโยคที่มีทั้งประธาน กริยา และกรรมครบ?', emoji:'✔️', choices:['น้องกินข้าว','วิ่งเร็วมาก','สวยจังเลย','ในสวน'], correct:0, explain:'"น้อง" ประธาน "กิน" กริยา "ข้าว" กรรม ครบทั้ง 3 ส่วน', tier:2},
      {q:'คำใดสะกดถูกต้อง?', emoji:'🔤', choices:['ปรากฏ','ปรากฎ','ประกฏ','ปรากด'], correct:0, explain:'สะกดถูกคือ "ปรากฏ" (ใช้ ฏ ปฏัก)', tier:2},
      {q:'"เด็กๆ ช่วยกันเก็บขยะ" คำว่า "เด็กๆ" ใช้เครื่องหมายใดและหมายถึงอะไร?', emoji:'♻️', choices:['ไม้ยมก หมายถึงซ้ำคำ (เด็กหลายคน)','ไปยาลน้อย','ไม้ทัณฑฆาต','วรรณยุกต์'], correct:0, explain:'ๆ คือไม้ยมก ใช้ซ้ำคำ ทำให้หมายถึงเด็กหลายคน', tier:3},
      {q:'คำใดเป็น "คำพ้องรูป" (เขียนเหมือนกันแต่อ่านต่างกัน)?', emoji:'🔍', choices:['เพลา','เมือง','ต้นไม้','ดินสอ'], correct:0, explain:'"เพลา" อ่านได้ทั้ง เพลา (แกนล้อ) และ เพ-ลา (เวลา) จึงเป็นคำพ้องรูป', tier:3},
      {q:'คำใดเป็น "คำพ้องเสียง" กับคำว่า "การ"?', emoji:'👂', choices:['กาน','กาล ทุกคำอ่านต่างกัน','กัน','เกาะ'], correct:0, explain:'การ กาน กาล อ่านเหมือนกันว่า กาน แต่เขียนและความหมายต่างกัน', tier:3},
      {q:'"เพราะฝนตกหนัก โรงเรียนจึงหยุด" คำว่า "เพราะ" บอกความสัมพันธ์แบบใด?', emoji:'🌧️', choices:['เหตุ-ผล','ขัดแย้ง','เลือกอย่างใดอย่างหนึ่ง','เพิ่มเติม'], correct:0, explain:'"เพราะ" เป็นคำสันธานบอกเหตุ ส่วน "จึง" บอกผล', tier:3}
    ]
  },
  {
    id:'p4-thai2', name:'ภาษาไทย ป.4 · สำนวน สุภาษิต และคำในบทร้อยกรอง', emoji:'📓', icon:'assets/icons/p4-thai2.svg', color:'#E14E9A', light:'#FCE0EF', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'สำนวน "ตาต่อตา ฟันต่อฟัน" หมายถึงอะไร?', emoji:'😠', choices:['แก้แค้นกันด้วยวิธีเดียวกัน','ไปหาหมอฟัน','มองหน้ากัน','ดูแลฟันให้ดี'], correct:0, explain:'หมายถึง การตอบโต้ด้วยวิธีเดียวกับที่ถูกกระทำ', tier:1},
      {q:'สุภาษิต "ตนเป็นที่พึ่งแห่งตน" สอนเรื่องอะไร?', emoji:'💪', choices:['พึ่งตัวเองก่อนพึ่งผู้อื่น','ขอความช่วยเหลือเสมอ','อยู่คนเดียว','ไม่ต้องช่วยใคร'], correct:0, explain:'สอนให้ช่วยเหลือและพึ่งพาตนเองเป็นอันดับแรก', tier:1},
      {q:'สำนวน "หน้าเนื้อใจเสือ" หมายถึงคนแบบใด?', emoji:'🐯', choices:['ท่าทางดีแต่ใจร้าย','ชอบกินเนื้อ','เลี้ยงเสือ','หน้าตาน่ากลัว'], correct:0, explain:'หมายถึง คนที่ภายนอกดูดีแต่ใจโหดร้าย', tier:1},
      {q:'สุภาษิต "ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น" สอนเรื่องอะไร?', emoji:'🏆', choices:['ความเพียรทำให้สำเร็จ','ต้องเดินทางไกล','หาที่อยู่ใหม่','โชคดีสำคัญที่สุด'], correct:0, explain:'สอนว่าถ้ามีความเพียรพยายาม ย่อมประสบความสำเร็จ', tier:1},
      {q:'สำนวน "มือไม่พายเอาเท้าราน้ำ" หมายถึงอะไร?', emoji:'🛶', choices:['ไม่ช่วยงานแล้วยังขัดขวาง','พายเรือเก่ง','ว่ายน้ำไม่เป็น','ล้างเท้าในน้ำ'], correct:0, explain:'หมายถึง ไม่ช่วยทำงานแล้วยังทำให้งานติดขัด', tier:1},
      {q:'คำพังเพย "กว่าถั่วจะสุกงาก็ไหม้" หมายถึงอะไร?', emoji:'🍳', choices:['ทำงานช้าจนเสียโอกาส','ทำอาหารไม่เป็น','ปลูกถั่วและงา','ไฟไหม้ครัว'], correct:0, explain:'หมายถึง มัวลังเลหรือทำช้าจนเสียการ', tier:1},
      {q:'สำนวน "ปิดทองหลังพระ" หมายถึงอะไร?', emoji:'🛕', choices:['ทำความดีโดยไม่หวังให้ใครเห็น','ปิดทองพระพุทธรูป','ซ่อนของไว้','ทำงานลับๆ ไม่ดี'], correct:0, explain:'หมายถึง ทำความดีโดยไม่ต้องการคำชมหรือชื่อเสียง', tier:1},
      {q:'สุภาษิต "น้ำนิ่งไหลลึก" หมายถึงคนแบบใด?', emoji:'🌊', choices:['เงียบแต่มีความคิดลึกซึ้ง','ว่ายน้ำเก่ง','ชอบอยู่ในน้ำ','พูดมาก'], correct:0, explain:'หมายถึง คนที่ดูเงียบๆ แต่มีความคิดหรือความสามารถลึกซึ้ง', tier:1},
      {q:'"รักยาวให้บั่น รักสั้นให้ต่อ" สอนเรื่องอะไร?', emoji:'💞', choices:['รู้จักผ่อนปรนเพื่อรักษาความสัมพันธ์','ตัดเชือกให้สั้น','ต่อเชือกให้ยาว','เลิกคบเพื่อน'], correct:0, explain:'สอนให้รู้จักลดทิฐิและผ่อนปรนเพื่อให้ความสัมพันธ์ยืนยาว', tier:2},
      {q:'สำนวน "เข็นครกขึ้นภูเขา" หมายถึงอะไร?', emoji:'⛰️', choices:['ทำงานยากลำบากมาก','ยกของเบา','ปีนเขาเล่น','ทำกับข้าว'], correct:0, explain:'หมายถึง ทำงานที่ยากลำบากและต้องใช้ความพยายามสูงมาก', tier:2},
      {q:'สำนวน "ชี้โพรงให้กระรอก" หมายถึงอะไร?', emoji:'🐿️', choices:['บอกทางให้คนคิดไม่ดีทำผิดได้ง่ายขึ้น','เลี้ยงกระรอก','ปลูกต้นไม้','หาโพรงไม้'], correct:0, explain:'หมายถึง บอกช่องทางให้คนที่คิดไม่ซื่อทำสิ่งไม่ดีได้ง่ายขึ้น', tier:2},
      {q:'คำพังเพย "ขว้างงูไม่พ้นคอ" หมายถึงอะไร?', emoji:'🐍', choices:['ทำอะไรแล้วผลร้ายย้อนกลับมาหาตัวเอง','จับงูเก่ง','ขว้างของไกล','กลัวงู'], correct:0, explain:'หมายถึง ทำสิ่งใดแล้วผลเสียย้อนกลับมาที่ตนเอง', tier:2},
      {q:'บทร้อยกรองของไทยที่มี "สัมผัส" หมายถึงอะไร?', emoji:'🎵', choices:['คำที่มีเสียงคล้องจองกัน','คำที่แตะกัน','คำที่เขียนเหมือนกัน','คำที่ยาวเท่ากัน'], correct:0, explain:'สัมผัสคือเสียงคล้องจองระหว่างคำในบทร้อยกรอง', tier:2},
      {q:'"ไก่งามเพราะขน คนงามเพราะแต่ง" คำว่า "ขน" กับ "คน" มีความสัมพันธ์แบบใด?', emoji:'🐔', choices:['สัมผัสสระ (เสียงคล้องจอง)','ความหมายเหมือนกัน','ความหมายตรงข้าม','ไม่สัมพันธ์กัน'], correct:0, explain:'ขน–คน มีเสียงสระเดียวกัน เป็นการสัมผัสให้ไพเราะ', tier:2},
      {q:'สำนวน "ตำข้าวสารกรอกหม้อ" หมายถึงอะไร?', emoji:'🍚', choices:['ทำพอให้เสร็จไปวันๆ ไม่คิดเผื่ออนาคต','หุงข้าวเก่ง','เก็บข้าวไว้เยอะ','ซื้อหม้อใหม่'], correct:0, explain:'หมายถึง ทำเพียงให้พอกินพอใช้ไปวันๆ ไม่วางแผนอนาคต', tier:2},
      {q:'คำใดมีความหมายเหมือนกับ "อุตสาหะ"?', emoji:'💪', choices:['ความเพียร','ความเกียจคร้าน','ความกลัว','ความโกรธ'], correct:0, explain:'อุตสาหะ หมายถึง ความเพียรพยายาม', tier:2},
      {q:'คำใดมีความหมายตรงข้ามกับ "มัธยัสถ์"?', emoji:'💸', choices:['ฟุ่มเฟือย','ประหยัด','ออม','พอเพียง'], correct:0, explain:'มัธยัสถ์ = ประหยัด ตรงข้ามคือ ฟุ่มเฟือย', tier:2},
      {q:'สำนวน "สอนจระเข้ให้ว่ายน้ำ" หมายถึงอะไร?', emoji:'🐊', choices:['สอนสิ่งที่เขาเก่งอยู่แล้ว','เลี้ยงจระเข้','ว่ายน้ำไม่เป็น','กลัวน้ำ'], correct:0, explain:'หมายถึง สอนหรือแนะนำสิ่งที่ผู้อื่นชำนาญอยู่แล้ว', tier:3},
      {q:'คำราชาศัพท์ "เสด็จ" ใช้แทนคำสามัญคำใด?', emoji:'👑', choices:['ไป','กิน','นอน','พูด'], correct:0, explain:'"เสด็จ" เป็นราชาศัพท์ของคำว่า ไป (สำหรับพระมหากษัตริย์และเจ้านาย)', tier:3},
      {q:'คำสุภาพของคำว่า "หมู" ในภาษาทางการคือคำใด?', emoji:'🐷', choices:['สุกร','หมูป่า','หมูสามชั้น','หมูยอ'], correct:0, explain:'คำสุภาพของ หมู คือ สุกร (เช่นเดียวกับ วัว = โค)', tier:3},
      {q:'"อันอ้อยตาลหวานลิ้นแล้วสิ้นซาก" เป็นคำประพันธ์ประเภทใด?', emoji:'🖋️', choices:['กลอนสุภาพ','ร้อยแก้ว','บทความ','จดหมาย'], correct:0, explain:'เป็นบทร้อยกรอง (กลอนสุภาพ) มีสัมผัสคล้องจองตามฉันทลักษณ์', tier:3},
      {q:'สำนวน "ฆ่าช้างเอางา" หมายถึงอะไร?', emoji:'🐘', choices:['ทำลายสิ่งใหญ่เพื่อผลเล็กน้อย','ล่าสัตว์','เลี้ยงช้าง','เก็บงาช้าง'], correct:0, explain:'หมายถึง ทำลายของใหญ่หรือสำคัญเพื่อผลประโยชน์เล็กน้อย', tier:3}
    ]
  },
  {
    id:'p4-thai3', name:'ภาษาไทย ป.4 · อ่านจับใจความและใช้พจนานุกรม', emoji:'📰', icon:'assets/icons/p4-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'"ต้นไม้ในสวนออกดอกบานสะพรั่งหลังฝนตก" เรื่องนี้บอกเวลาใด?', emoji:'🌺', choices:['หลังฝนตก','ก่อนฝนตก','กลางฤดูหนาว','ตอนกลางคืน'], correct:0, explain:'ข้อความบอกว่าดอกไม้บานหลังฝนตก', tier:1},
      {q:'"น้ำผึ้งช่วยแม่ล้างจานทุกวันหลังกินข้าว" น้ำผึ้งช่วยแม่ทำอะไร?', emoji:'🍽️', choices:['ล้างจาน','กวาดบ้าน','ซักผ้า','รดน้ำต้นไม้'], correct:0, explain:'ข้อความบอกว่าช่วยล้างจาน', tier:1},
      {q:'ข้อใดเป็น "ข้อเท็จจริง"?', emoji:'✅', choices:['หนึ่งปีมี 12 เดือน','ฤดูหนาวสบายที่สุด','สีฟ้าสวยที่สุด','อาหารร้านนี้อร่อยที่สุด'], correct:0, explain:'หนึ่งปีมี 12 เดือน เป็นความจริงที่ตรวจสอบได้', tier:1},
      {q:'ข้อใดเป็น "ข้อคิดเห็น"?', emoji:'💭', choices:['หนังเรื่องนี้สนุกมาก','น้ำเดือดที่ 100 องศาเซลเซียส','โลกหมุนรอบตัวเอง','สัปดาห์หนึ่งมี 7 วัน'], correct:0, explain:'"สนุกมาก" เป็นความรู้สึกส่วนตัวของแต่ละคน', tier:1},
      {q:'"เพราะไม่ยอมทบทวนบทเรียน ต้นจึงทำข้อสอบไม่ได้" อะไรคือผล?', emoji:'📝', choices:['ทำข้อสอบไม่ได้','ไม่ทบทวนบทเรียน','ไปโรงเรียน','นอนดึก'], correct:0, explain:'เหตุคือไม่ทบทวน ผลคือทำข้อสอบไม่ได้', tier:1},
      {q:'การใช้พจนานุกรม เราค้นคำตามลำดับใด?', emoji:'📔', choices:['ลำดับพยัญชนะ ก-ฮ','ลำดับความยาวคำ','ลำดับความหมาย','ลำดับที่ชอบ'], correct:0, explain:'พจนานุกรมเรียงคำตามลำดับพยัญชนะ ก-ฮ และสระ', tier:1},
      {q:'คำใดจะอยู่ก่อนในพจนานุกรม?', emoji:'🔤', choices:['กบ','ขวด','งู','จาน'], correct:0, explain:'ก มาก่อน ข ค ง จ ตามลำดับพยัญชนะ "กบ" จึงอยู่ก่อน', tier:1},
      {q:'"ควรล้างมือก่อนกินอาหารทุกครั้ง" ข้อความนี้เป็นข้อความประเภทใด?', emoji:'🧼', choices:['คำแนะนำ','คำถาม','คำสั่งห้าม','การเล่าเรื่อง'], correct:0, explain:'เป็นข้อความให้คำแนะนำเพื่อสุขอนามัยที่ดี', tier:1},
      {q:'"ฝนตกหนักติดต่อกันสามวัน ถนนหลายสายจึงถูกน้ำท่วม" ใจความสำคัญของเรื่องคืออะไร?', emoji:'🌧️', choices:['ฝนตกหนักทำให้ถนนถูกน้ำท่วม','ฝนตกสามวัน','ถนนมีหลายสาย','คนออกจากบ้านไม่ได้'], correct:0, explain:'ใจความสำคัญคือเหตุ (ฝนตกหนัก) และผล (ถนนท่วม)', tier:2},
      {q:'"มดง่ามเก็บอาหารตุนไว้ก่อนหน้าฝน ส่วนตั๊กแตนเอาแต่เล่น" นิทานนี้ให้ข้อคิดใด?', emoji:'🐜', choices:['ควรเตรียมพร้อมและรู้จักออม','ควรเล่นให้สนุก','ควรกินให้อิ่ม','ควรอยู่คนเดียว'], correct:0, explain:'สอนให้เตรียมพร้อมและเก็บออมไว้ใช้ในยามจำเป็น', tier:2},
      {q:'"อากาศวันนี้ร้อนจัด ควรดื่มน้ำมากๆ และหลีกเลี่ยงแดดจ้า" ผู้เขียนต้องการสื่ออะไร?', emoji:'☀️', choices:['เตือนให้ดูแลตัวเองเมื่ออากาศร้อน','เล่าเรื่องสนุก','ขายน้ำดื่ม','บอกเวลา'], correct:0, explain:'ข้อความเตือนและแนะนำวิธีดูแลตัวเองในวันที่อากาศร้อน', tier:2},
      {q:'ในพจนานุกรม คำว่า "กล้วย" กับ "กบ" คำใดอยู่ก่อน?', emoji:'📚', choices:['กบ','กล้วย','อยู่หน้าเดียวกันเสมอ','เรียงไม่ได้'], correct:0, explain:'พยัญชนะตัวแรกเหมือนกัน (ก) จึงดูตัวถัดไป: บ มาก่อน ล จึงเป็น "กบ"', tier:2},
      {q:'"โรงเรียนจัดกิจกรรมปลูกป่าเพื่อลดภาวะโลกร้อน" จุดประสงค์ของกิจกรรมคืออะไร?', emoji:'🌳', choices:['ลดภาวะโลกร้อน','หารายได้','แข่งขันกีฬา','เรียนวิชาศิลปะ'], correct:0, explain:'ข้อความระบุจุดประสงค์ว่าเพื่อลดภาวะโลกร้อน', tier:2},
      {q:'ข้อใดเป็นการ "สรุปความ" ที่ดี?', emoji:'🧾', choices:['เก็บใจความสำคัญให้สั้นและครบถ้วน','คัดลอกทั้งเรื่อง','เขียนความคิดตัวเองแทน','เขียนให้ยาวกว่าเดิม'], correct:0, explain:'การสรุปความคือย่อใจความสำคัญให้สั้น กระชับ และครบถ้วน', tier:2},
      {q:'"ท้องฟ้ามืดครึ้ม ลมพัดแรง นกบินกลับรัง" น่าจะเกิดเหตุการณ์ใดต่อไป?', emoji:'⛈️', choices:['ฝนกำลังจะตก','แดดจะออกจ้า','หิมะจะตก','จะมีสายรุ้งทันที'], correct:0, explain:'สัญญาณเหล่านี้บ่งบอกว่าฝนกำลังจะตก (การคาดคะเน)', tier:2},
      {q:'อ่านฉลากยา "รับประทานครั้งละ 1 เม็ด วันละ 3 ครั้ง หลังอาหาร" หนึ่งวันกินกี่เม็ด?', emoji:'💊', choices:['3 เม็ด','1 เม็ด','6 เม็ด','9 เม็ด'], correct:0, explain:'ครั้งละ 1 เม็ด วันละ 3 ครั้ง จึงกินวันละ 3 เม็ด', tier:2},
      {q:'ป้าย "ห้ามเก็บดอกไม้ในสวนสาธารณะ" เป็นข้อความประเภทใด?', emoji:'🚫', choices:['ข้อห้าม','คำชักชวน','คำอวยพร','การเล่าเรื่อง'], correct:0, explain:'เป็นข้อความบอกข้อห้ามที่ต้องปฏิบัติตาม', tier:2},
      {q:'"ทุกคนในหมู่บ้านช่วยกันขุดลอกคูคลองจนน้ำไหลสะดวก" เรื่องนี้แสดงคุณค่าใด?', emoji:'🤝', choices:['ความสามัคคีร่วมมือกัน','ความเห็นแก่ตัว','การแข่งขัน','ความประหยัด'], correct:0, explain:'การร่วมมือกันของคนในหมู่บ้านแสดงถึงความสามัคคี', tier:3},
      {q:'"หนังสือเล่มนี้ราคา 120 บาท และน่าอ่านที่สุด" ประโยคนี้มีทั้งข้อเท็จจริงและข้อคิดเห็น ส่วนใดเป็นข้อคิดเห็น?', emoji:'🔎', choices:['น่าอ่านที่สุด','ราคา 120 บาท','หนังสือเล่มนี้','ทั้งประโยค'], correct:0, explain:'"น่าอ่านที่สุด" เป็นความรู้สึกส่วนตัว ส่วนราคาเป็นข้อเท็จจริง', tier:3},
      {q:'อ่านตารางเวลารถไฟ: ขบวนแรก 06:30 ขบวนถัดไปทุก 2 ชั่วโมง ขบวนที่ 3 ออกกี่โมง?', emoji:'🚂', choices:['10:30 น.','08:30 น.','12:30 น.','09:30 น.'], correct:0, explain:'ขบวน 1 = 06:30, ขบวน 2 = 08:30, ขบวน 3 = 10:30', tier:3},
      {q:'การอ่านออกเสียงบทร้อยกรองให้ไพเราะ ควรทำอย่างไร?', emoji:'🎙️', choices:['อ่านเป็นจังหวะตามวรรคและเอื้อนเสียงสัมผัส','อ่านเร็วที่สุด','อ่านเสียงดังตลอด','อ่านข้ามคำที่ยาก'], correct:0, explain:'บทร้อยกรองต้องอ่านตามจังหวะวรรคตอนและให้เสียงสัมผัสชัดเจน', tier:3},
      {q:'"แม้จะเหนื่อยแต่เขาก็ไม่ยอมแพ้" คำว่า "แม้...แต่" แสดงความสัมพันธ์แบบใด?', emoji:'💪', choices:['ขัดแย้งกัน','เหตุและผล','ลำดับเวลา','เพิ่มเติมความ'], correct:0, explain:'"แม้...แต่" ใช้เชื่อมความที่ขัดแย้งกัน', tier:3}
    ]
  },
  /* ---------- English ป.4 (คำศัพท์อาชีพ-กิจวัตร / Present Simple-ไวยากรณ์ / อ่านเรื่องและบทสนทนา) ---------- */
  {
    id:'p4-eng1', name:'English ป.4 · Jobs, Food & Daily Life', emoji:'🎓', icon:'assets/icons/p4-eng1.svg', color:'#0FB5AE', light:'#D5F5F2', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'"doctor" แปลว่าอะไร?', emoji:'👩‍⚕️', choices:['หมอ','ครู','ตำรวจ','ชาวนา'], correct:0, explain:'doctor = หมอ', tier:1},
      {q:'"teacher" ทำงานที่ไหน?', emoji:'🏫', choices:['school','hospital','farm','market'], correct:0, explain:'teacher (ครู) ทำงานที่ school (โรงเรียน)', tier:1},
      {q:'"breakfast" คืออาหารมื้อใด?', emoji:'🍳', choices:['มื้อเช้า','มื้อกลางวัน','มื้อเย็น','ของว่าง'], correct:0, explain:'breakfast = อาหารเช้า', tier:1},
      {q:'"I get up at six o\'clock." ประโยคนี้พูดถึงอะไร?', emoji:'⏰', choices:['ตื่นนอนตอนหกโมง','นอนตอนหกโมง','กินข้าวหกโมง','ไปโรงเรียนหกโมง'], correct:0, explain:'get up = ตื่นนอน, at six o\'clock = ตอนหกโมง', tier:1},
      {q:'คำใดแปลว่า "พยาบาล"?', emoji:'👩‍⚕️', choices:['nurse','farmer','driver','cook'], correct:0, explain:'nurse = พยาบาล', tier:1},
      {q:'"vegetables" หมายถึงอะไร?', emoji:'🥦', choices:['ผัก','ผลไม้','เนื้อสัตว์','ขนม'], correct:0, explain:'vegetables = ผัก', tier:1},
      {q:'"He is a farmer." เขาทำอาชีพอะไร?', emoji:'👨‍🌾', choices:['ชาวนา/เกษตรกร','นักบิน','หมอ','ครู'], correct:0, explain:'farmer = ชาวนา เกษตรกร', tier:1},
      {q:'"take a shower" หมายถึงอะไร?', emoji:'🚿', choices:['อาบน้ำ','แปรงฟัน','กินข้าว','นอนหลับ'], correct:0, explain:'take a shower = อาบน้ำ', tier:1},
      {q:'คำใดเป็น "drink" (เครื่องดื่ม)?', emoji:'🥤', choices:['milk','bread','rice','egg'], correct:0, explain:'milk (นม) เป็นเครื่องดื่ม ส่วนที่เหลือเป็นอาหาร', tier:1},
      {q:'"She goes to bed at nine." ประโยคนี้บอกอะไร?', emoji:'🛏️', choices:['เธอเข้านอนตอนสามทุ่ม','เธอตื่นตอนเก้าโมง','เธอกินข้าวตอนเก้าโมง','เธอเรียนตอนเก้าโมง'], correct:0, explain:'go to bed = เข้านอน, at nine = ตอน 9 นาฬิกา (สามทุ่ม)', tier:2},
      {q:'"police officer" มีหน้าที่อะไร?', emoji:'👮', choices:['keeps people safe','teaches students','sells food','flies a plane'], correct:0, explain:'ตำรวจมีหน้าที่ดูแลความปลอดภัยของประชาชน', tier:2},
      {q:'What do you do "in the morning"?', emoji:'🌅', choices:['brush my teeth','go to sleep','watch the moon','close the shop'], correct:0, explain:'ตอนเช้าเราแปรงฟัน (brush my teeth)', tier:2},
      {q:'"My mother cooks dinner every evening." ใครทำอาหารเย็น?', emoji:'👩‍🍳', choices:['my mother','my father','my sister','my teacher'], correct:0, explain:'ประโยคบอกว่า my mother (แม่ของฉัน) ทำอาหารเย็น', tier:2},
      {q:'คำใดเป็นชื่อ "ผลไม้" ทั้งหมด?', emoji:'🍇', choices:['mango, grape, orange','carrot, onion, potato','beef, pork, chicken','milk, water, juice'], correct:0, explain:'mango grape orange เป็นผลไม้ทั้งหมด', tier:2},
      {q:'"How much is it?" เป็นคำถามเกี่ยวกับอะไร?', emoji:'💵', choices:['ราคา','เวลา','สถานที่','ชื่อ'], correct:0, explain:'How much…? ใช้ถามราคา', tier:2},
      {q:'"Where does your father work?" เป็นคำถามเรื่องใด?', emoji:'🏢', choices:['สถานที่ทำงาน','เวลาทำงาน','ชื่อพ่อ','อายุพ่อ'], correct:0, explain:'Where = ที่ไหน จึงถามถึงสถานที่ทำงาน', tier:2},
      {q:'"He wants to be a pilot." เขาอยากเป็นอะไร?', emoji:'✈️', choices:['นักบิน','กัปตันเรือ','ทหาร','คนขับรถ'], correct:0, explain:'pilot = นักบิน', tier:2},
      {q:'"We have lunch at school." เรากินมื้อกลางวันที่ไหน?', emoji:'🍱', choices:['ที่โรงเรียน','ที่บ้าน','ที่ตลาด','ที่โรงพยาบาล'], correct:0, explain:'at school = ที่โรงเรียน', tier:2},
      {q:'"My brother is taller than me." หมายความว่าอย่างไร?', emoji:'📏', choices:['พี่ชายสูงกว่าฉัน','ฉันสูงกว่าพี่ชาย','เราสูงเท่ากัน','พี่ชายอายุมากกว่า'], correct:0, explain:'taller than = สูงกว่า (การเปรียบเทียบขั้นกว่า)', tier:3},
      {q:'Choose the correct sentence.', emoji:'✅', choices:['She always drinks milk.','She always drink milk.','She drink always milk.','Always she milk drinks.'], correct:0, explain:'ประธานเอกพจน์ She ใช้กริยาเติม s: drinks และวาง always ก่อนกริยา', tier:3},
      {q:'"What time do you usually wake up?" คำว่า usually หมายถึงอะไร?', emoji:'🕘', choices:['โดยปกติ/บ่อยครั้ง','ไม่เคย','เพียงครั้งเดียว','เมื่อวาน'], correct:0, explain:'usually = โดยปกติ เป็นคำบอกความถี่', tier:3},
      {q:'"Tom is the tallest boy in class." หมายความว่าอย่างไร?', emoji:'🏆', choices:['ทอมสูงที่สุดในห้อง','ทอมสูงกว่าเพื่อนคนหนึ่ง','ทอมเตี้ยที่สุด','ทอมสูงเท่าเพื่อน'], correct:0, explain:'the tallest = สูงที่สุด (ขั้นสูงสุด)', tier:3}
    ]
  },
  {
    id:'p4-eng2', name:'English ป.4 · Present Simple & Grammar', emoji:'🖋️', icon:'assets/icons/p4-eng2.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'She ___ to school every day.', emoji:'🏫', choices:['goes','go','going','gone'], correct:0, explain:'ประธานเอกพจน์ She ใช้กริยาเติม s → goes', tier:1},
      {q:'They ___ football on Sunday.', emoji:'⚽', choices:['play','plays','playing','played'], correct:0, explain:'ประธานพหูพจน์ They ใช้กริยารูปปกติ → play', tier:1},
      {q:'I ___ a big family.', emoji:'👨‍👩‍👧‍👦', choices:['have','has','having','haves'], correct:0, explain:'ประธาน I ใช้ have', tier:1},
      {q:'He ___ a new bike.', emoji:'🚲', choices:['has','have','haves','having'], correct:0, explain:'ประธานเอกพจน์ He ใช้ has', tier:1},
      {q:'___ she like ice cream?', emoji:'🍦', choices:['Does','Do','Is','Are'], correct:0, explain:'ประธานเอกพจน์ she ใช้ Does ในประโยคคำถาม', tier:1},
      {q:'We ___ not watch TV at night.', emoji:'📺', choices:['do','does','is','are'], correct:0, explain:'ประธาน We ใช้ do not (don\'t)', tier:1},
      {q:'พหูพจน์ของ "box" คือคำใด?', emoji:'📦', choices:['boxes','boxs','boxen','box'], correct:0, explain:'คำลงท้ายด้วย x เติม es → boxes', tier:1},
      {q:'The book is ___ the table.', emoji:'📚', choices:['on','in','under the sky','at home'], correct:0, explain:'หนังสือวางอยู่บนโต๊ะ ใช้ on', tier:1},
      {q:'พหูพจน์ของ "baby" คือคำใด?', emoji:'👶', choices:['babies','babys','babyes','baby'], correct:0, explain:'คำลงท้าย y หน้าเป็นพยัญชนะ เปลี่ยน y เป็น ies → babies', tier:1},
      {q:'My father ___ TV after dinner.', emoji:'📺', choices:['watches','watch','watching','watchs'], correct:0, explain:'กริยาลงท้าย ch เติม es กับประธานเอกพจน์ → watches', tier:2},
      {q:'She ___ English every evening. (study)', emoji:'📖', choices:['studies','studys','study','studied'], correct:0, explain:'study ลงท้าย y หน้าพยัญชนะ เปลี่ยนเป็น ies → studies', tier:2},
      {q:'___ they live in Bangkok?', emoji:'🏙️', choices:['Do','Does','Is','Am'], correct:0, explain:'ประธานพหูพจน์ they ใช้ Do', tier:2},
      {q:'There ___ five books on the desk.', emoji:'📚', choices:['are','is','am','be'], correct:0, explain:'five books เป็นพหูพจน์ ใช้ are', tier:2},
      {q:'He doesn\'t ___ coffee.', emoji:'☕', choices:['drink','drinks','drinking','drank'], correct:0, explain:'หลัง doesn\'t ใช้กริยารูปปกติ (ไม่เติม s)', tier:2},
      {q:'My cat is ___ the box. (แมวอยู่ในกล่อง)', emoji:'🐱', choices:['in','on','under','next'], correct:0, explain:'อยู่ข้างในใช้ in', tier:2},
      {q:'Choose the correct question: "___ is your birthday?"', emoji:'🎂', choices:['When','What time o\'clock','How much','Who'], correct:0, explain:'ถามวันเดือนใช้ When (เมื่อไร)', tier:2},
      {q:'"I go to school ___ Monday."', emoji:'📅', choices:['on','in','at','of'], correct:0, explain:'วันในสัปดาห์ใช้ on → on Monday', tier:2},
      {q:'"We live ___ Thailand."', emoji:'🇹🇭', choices:['in','on','at','to'], correct:0, explain:'ประเทศใช้ in → in Thailand', tier:2},
      {q:'พหูพจน์ของ "leaf" คือคำใด?', emoji:'🍃', choices:['leaves','leafs','leafes','leaf'], correct:0, explain:'คำลงท้าย f/fe เปลี่ยนเป็น ves → leaves', tier:3},
      {q:'"She is reading a book now." ประโยคนี้เป็น tense ใด?', emoji:'📖', choices:['Present Continuous (กำลังทำอยู่)','Present Simple','Past Simple','Future'], correct:0, explain:'is + V-ing แสดงการกระทำที่กำลังเกิดขึ้นตอนนี้', tier:3},
      {q:'"He ___ to the park yesterday."', emoji:'🌳', choices:['went','goes','go','going'], correct:0, explain:'yesterday เป็นอดีต จึงใช้ went (รูปอดีตของ go)', tier:3},
      {q:'"There are ___ apples in the basket." (ใช้กับคำนามนับได้)', emoji:'🍎', choices:['many','much','a little','a lot of water'], correct:0, explain:'คำนามนับได้พหูพจน์ใช้ many', tier:3}
    ]
  },
  {
    id:'p4-eng3', name:'English ป.4 · Reading & Conversation', emoji:'🗞️', icon:'assets/icons/p4-eng3.svg', color:'#0A7A75', light:'#D5F5F2', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'Nan has two cats and one dog. How many pets does she have?', emoji:'🐈', choices:['three','two','one','four'], correct:0, explain:'2 cats + 1 dog = 3 pets = three', tier:1},
      {q:'"Can I have some water, please?" ผู้พูดต้องการอะไร?', emoji:'💧', choices:['ขอน้ำ','ขอขนม','ขอหนังสือ','ขอความช่วยเหลือเรื่องการบ้าน'], correct:0, explain:'some water = น้ำ (พูดขออย่างสุภาพ)', tier:1},
      {q:'A: "How are you?" B: "___"', emoji:'😊', choices:['I\'m fine, thank you.','I am ten.','It is a dog.','On Monday.'], correct:0, explain:'How are you? ตอบว่า I\'m fine, thank you.', tier:1},
      {q:'"The library is next to the school." ห้องสมุดอยู่ที่ไหน?', emoji:'📚', choices:['ข้างๆ โรงเรียน','ในโรงเรียน','ตรงข้ามตลาด','ไกลจากเมือง'], correct:0, explain:'next to = ข้างๆ / ติดกับ', tier:1},
      {q:'A: "What\'s your favourite subject?" B: "___"', emoji:'🎨', choices:['Art.','Yes, I do.','At home.','It\'s five baht.'], correct:0, explain:'ถามวิชาที่ชอบ ตอบชื่อวิชา เช่น Art', tier:1},
      {q:'"It is a quarter past three." ตรงกับเวลาใด?', emoji:'🕒', choices:['3:15 น.','3:45 น.','2:15 น.','4:15 น.'], correct:0, explain:'a quarter past three = สามโมงสิบห้านาที (3:15)', tier:1},
      {q:'"First, wash the rice. Then, cook it. Finally, eat." ขั้นตอนสุดท้ายคืออะไร?', emoji:'🍚', choices:['eat','cook','wash the rice','buy the rice'], correct:0, explain:'Finally บอกขั้นตอนสุดท้ายคือ eat', tier:1},
      {q:'A: "Excuse me, where is the post office?" คำถามนี้ถามเรื่องใด?', emoji:'📮', choices:['ทาง/สถานที่','เวลา','ราคา','ชื่อ'], correct:0, explain:'where = ที่ไหน เป็นการถามเส้นทางหรือสถานที่', tier:1},
      {q:'Ben studies from Monday to Friday. Does Ben study on Saturday?', emoji:'📅', choices:['No, he doesn\'t.','Yes, he does.','Every day.','Only Saturday.'], correct:0, explain:'เขาเรียนจันทร์ถึงศุกร์ จึงไม่เรียนวันเสาร์', tier:2},
      {q:'"It is a quarter to seven." ตรงกับเวลาใด?', emoji:'🕕', choices:['6:45 น.','7:15 น.','7:45 น.','6:15 น.'], correct:0, explain:'a quarter to seven = อีก 15 นาทีจะเจ็ดโมง คือ 6:45', tier:2},
      {q:'Read: "Ann is 10. Her brother is 12." Who is older?', emoji:'👧', choices:['Her brother','Ann','They are the same','We don\'t know'], correct:0, explain:'พี่ชายอายุ 12 มากกว่า Ann ที่อายุ 10', tier:2},
      {q:'A: "Would you like some cake?" B: "___"', emoji:'🍰', choices:['Yes, please.','I am fine, thanks for asking me now.','It is Monday.','He is a doctor.'], correct:0, explain:'คำถามชวนกิน ตอบรับสุภาพว่า Yes, please.', tier:2},
      {q:'Read: "The shop opens at 9 a.m. and closes at 6 p.m." ร้านเปิดกี่ชั่วโมงต่อวัน?', emoji:'🏪', choices:['9 hours','6 hours','12 hours','3 hours'], correct:0, explain:'ตั้งแต่ 9 โมงเช้าถึง 6 โมงเย็น = 9 ชั่วโมง', tier:2},
      {q:'"Turn left at the corner, then go straight." ข้อความนี้บอกอะไร?', emoji:'🧭', choices:['บอกเส้นทาง','บอกราคา','บอกเวลา','บอกอากาศ'], correct:0, explain:'turn left / go straight เป็นการบอกทาง', tier:2},
      {q:'Read: "Mali likes fruit. She eats an apple and a banana every day." How many fruits does she eat a day?', emoji:'🍌', choices:['two','one','three','none'], correct:0, explain:'apple 1 + banana 1 = 2 ผลต่อวัน', tier:2},
      {q:'A: "Whose bag is this?" B: "___"', emoji:'🎒', choices:['It\'s mine.','It is on Monday.','I am ten years old.','Yes, I can.'], correct:0, explain:'Whose…? ถามความเป็นเจ้าของ ตอบว่า It\'s mine. (ของฉัน)', tier:2},
      {q:'Read: "It is raining. Take your umbrella." คำแนะนำคืออะไร?', emoji:'☔', choices:['ให้เอาร่มไปด้วย','ให้อยู่บ้าน','ให้ใส่หมวก','ให้รีบวิ่ง'], correct:0, explain:'Take your umbrella = เอาร่มไปด้วย', tier:2},
      {q:'Read: "The zoo is open every day except Monday." When is the zoo closed?', emoji:'🦁', choices:['On Monday','On Sunday','Every day','On Friday'], correct:0, explain:'except Monday = ยกเว้นวันจันทร์ แปลว่าปิดวันจันทร์', tier:3},
      {q:'Read: "Ben saved 50 baht a week for 4 weeks." How much money does he have?', emoji:'💰', choices:['200 baht','150 baht','54 baht','100 baht'], correct:0, explain:'50 × 4 = 200 baht', tier:3},
      {q:'A: "I\'m sorry I\'m late." B: "___"', emoji:'⏰', choices:['That\'s all right.','You are welcome to eat.','It is a pencil.','How much is it?'], correct:0, explain:'เมื่อมีคนขอโทษ ตอบว่า That\'s all right. (ไม่เป็นไร)', tier:3},
      {q:'Read: "Tim goes swimming twice a week." How often does Tim swim?', emoji:'🏊', choices:['Two times a week','Every day','Once a month','Never'], correct:0, explain:'twice a week = สัปดาห์ละ 2 ครั้ง', tier:3},
      {q:'Which sentence is a question?', emoji:'❓', choices:['Do you like milk?','I like milk.','She likes milk very much.','They are drinking milk.'], correct:0, explain:'ประโยคคำถามขึ้นต้นด้วย Do และลงท้ายด้วยเครื่องหมาย ?', tier:3}
    ]
  },
  /* ---------- สังคมศึกษา ป.4 (ภูมิศาสตร์-แผนที่ / ประวัติศาสตร์สุโขทัย-หน้าที่พลเมือง-เศรษฐศาสตร์) ---------- */
  {
    id:'p4-social1', name:'สังคม ป.4 · แผนที่และภูมิศาสตร์ไทย', emoji:'🧭', icon:'assets/icons/p4-social1.svg', color:'#F6A609', light:'#FEEFC9', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'ประเทศไทยแบ่งออกเป็นกี่ภูมิภาค (ตามภูมิศาสตร์)?', emoji:'🗺️', choices:['6 ภาค','4 ภาค','3 ภาค','8 ภาค'], correct:0, explain:'แบ่งเป็น 6 ภาค: เหนือ กลาง อีสาน ตะวันออก ตะวันตก และใต้', tier:1},
      {q:'เข็มทิศใช้บอกสิ่งใด?', emoji:'🧭', choices:['ทิศทาง','เวลา','อุณหภูมิ','ความสูง'], correct:0, explain:'เข็มทิศบอกทิศทาง เข็มจะชี้ทิศเหนือเสมอ', tier:1},
      {q:'บนแผนที่ ด้านบนของแผนที่โดยทั่วไปคือทิศใด?', emoji:'⬆️', choices:['ทิศเหนือ','ทิศใต้','ทิศตะวันออก','ทิศตะวันตก'], correct:0, explain:'แผนที่ทั่วไปกำหนดให้ด้านบนเป็นทิศเหนือ', tier:1},
      {q:'"มาตราส่วน" บนแผนที่บอกอะไร?', emoji:'📏', choices:['อัตราส่วนระยะในแผนที่กับระยะจริง','ชื่อเมือง','จำนวนประชากร','อุณหภูมิ'], correct:0, explain:'มาตราส่วนบอกว่าระยะ 1 หน่วยในแผนที่เท่ากับระยะจริงเท่าไร', tier:1},
      {q:'ภาคใดของไทยมีภูเขาสูงและอากาศหนาวเย็นที่สุด?', emoji:'🏔️', choices:['ภาคเหนือ','ภาคใต้','ภาคกลาง','ภาคตะวันออก'], correct:0, explain:'ภาคเหนือมีภูเขาสูง เช่น ดอยอินทนนท์ อากาศหนาวเย็น', tier:1},
      {q:'แม่น้ำสายใดไหลผ่านกรุงเทพมหานคร?', emoji:'🌊', choices:['แม่น้ำเจ้าพระยา','แม่น้ำโขง','แม่น้ำปิง','แม่น้ำมูล'], correct:0, explain:'แม่น้ำเจ้าพระยาไหลผ่านกรุงเทพฯ ลงสู่อ่าวไทย', tier:1},
      {q:'ภาคกลางของไทยเหมาะกับการทำอาชีพใดมากที่สุด?', emoji:'🌾', choices:['ทำนาปลูกข้าว','ทำเหมืองแร่','ประมงน้ำลึกอย่างเดียว','ปลูกยางพาราอย่างเดียว'], correct:0, explain:'ภาคกลางเป็นที่ราบลุ่มดินดี เหมาะกับการทำนา', tier:1},
      {q:'สัญลักษณ์รูป ✈️ บนแผนที่หมายถึงสถานที่ใด?', emoji:'✈️', choices:['สนามบิน','โรงเรียน','วัด','ตลาด'], correct:0, explain:'สัญลักษณ์เครื่องบินบนแผนที่หมายถึงสนามบิน', tier:1},
      {q:'"ลูกโลก" ต่างจากแผนที่อย่างไร?', emoji:'🌏', choices:['ลูกโลกเป็นทรงกลมเหมือนโลกจริง','ลูกโลกเป็นแผ่นแบน','แผนที่เป็นทรงกลม','ไม่ต่างกันเลย'], correct:0, explain:'ลูกโลกจำลองรูปทรงกลมของโลกจริง ส่วนแผนที่เป็นแผ่นแบน', tier:2},
      {q:'ภาคใต้ของไทยมีลักษณะภูมิประเทศแบบใดเป็นหลัก?', emoji:'🏝️', choices:['คาบสมุทรขนาบด้วยทะเลสองฝั่ง','ที่ราบสูงกว้างใหญ่','ทะเลทราย','ภูเขาหิมะ'], correct:0, explain:'ภาคใต้เป็นคาบสมุทร มีทะเลทั้งฝั่งอ่าวไทยและอันดามัน', tier:2},
      {q:'ภาคตะวันออกเฉียงเหนือ (อีสาน) มีลักษณะภูมิประเทศเด่นคืออะไร?', emoji:'🏜️', choices:['ที่ราบสูงโคราช','ที่ราบลุ่มน้ำท่วมถึง','เกาะจำนวนมาก','ภูเขาไฟ'], correct:0, explain:'ภาคอีสานตั้งอยู่บนที่ราบสูงโคราช', tier:2},
      {q:'ประเทศใดมีพรมแดนติดกับไทยทางทิศตะวันตก?', emoji:'🗺️', choices:['เมียนมา','ลาว','กัมพูชา','เวียดนาม'], correct:0, explain:'ทิศตะวันตกของไทยติดกับประเทศเมียนมา', tier:2},
      {q:'ทรัพยากรใดของภาคใต้ที่สำคัญต่อเศรษฐกิจ?', emoji:'🌴', choices:['ยางพาราและการประมง','ข้าวนาปรังเท่านั้น','ถ่านหินเท่านั้น','องุ่น'], correct:0, explain:'ภาคใต้มีสวนยางพารา ปาล์มน้ำมัน และการประมงเป็นรายได้หลัก', tier:2},
      {q:'เส้นที่ลากรอบโลกในแนวนอนแบ่งซีกโลกเหนือ-ใต้ เรียกว่าอะไร?', emoji:'🌐', choices:['เส้นศูนย์สูตร','เส้นเมริเดียน','เส้นขอบฟ้า','เส้นทางรถไฟ'], correct:0, explain:'เส้นศูนย์สูตรแบ่งโลกเป็นซีกเหนือและซีกใต้', tier:2},
      {q:'ถ้าอยู่ที่จุด A แล้วเดินไปทางทิศตรงข้ามกับทิศตะวันออก จะเดินไปทางทิศใด?', emoji:'➡️', choices:['ทิศตะวันตก','ทิศเหนือ','ทิศใต้','ทิศตะวันออกเฉียงเหนือ'], correct:0, explain:'ทิศตรงข้ามกับตะวันออกคือตะวันตก', tier:2},
      {q:'ฤดูฝนของไทยเกิดจากลมชนิดใดพัดผ่าน?', emoji:'🌧️', choices:['ลมมรสุมตะวันตกเฉียงใต้','ลมหนาวจากไซบีเรีย','ลมทะเลทราย','ลมสงบ'], correct:0, explain:'ลมมรสุมตะวันตกเฉียงใต้พัดพาความชื้นจากทะเลทำให้เกิดฝน', tier:2},
      {q:'แผนที่แสดงความสูงต่ำของพื้นที่เรียกว่าแผนที่ประเภทใด?', emoji:'⛰️', choices:['แผนที่ภูมิประเทศ','แผนที่การเมือง','แผนที่ถนน','แผนที่อากาศ'], correct:0, explain:'แผนที่ภูมิประเทศแสดงความสูงต่ำ ภูเขา แม่น้ำ', tier:2},
      {q:'จังหวัดที่อยู่เหนือสุดของประเทศไทยคือจังหวัดใด?', emoji:'📍', choices:['เชียงราย','เชียงใหม่','แม่ฮ่องสอน','น่าน'], correct:0, explain:'อำเภอแม่สาย จังหวัดเชียงราย เป็นจุดเหนือสุดของไทย', tier:3},
      {q:'พิกัดภูมิศาสตร์ใช้ค่าอะไรบอกตำแหน่งบนโลก?', emoji:'🧭', choices:['ละติจูดและลองจิจูด','ความสูงและน้ำหนัก','อุณหภูมิและความชื้น','เวลาและระยะทาง'], correct:0, explain:'ละติจูด (เส้นรุ้ง) คู่กับลองจิจูด (เส้นแวง) ใช้ระบุตำแหน่งบนโลก', tier:3},
      {q:'ทำไมภาคเหนือจึงหนาวกว่าภาคใต้?', emoji:'❄️', choices:['อยู่ไกลเส้นศูนย์สูตรและมีภูเขาสูง','อยู่ใกล้ทะเลมากกว่า','มีฝนตกมากกว่า','มีเกาะเยอะกว่า'], correct:0, explain:'ยิ่งห่างเส้นศูนย์สูตรและยิ่งสูงจากระดับน้ำทะเล อากาศยิ่งเย็น', tier:3},
      {q:'ปัญหาน้ำท่วมในเมืองใหญ่มีสาเหตุสำคัญจากอะไร?', emoji:'🌊', choices:['ทางระบายน้ำอุดตันและพื้นที่ซึมน้ำน้อยลง','คนใช้น้ำน้อยเกินไป','มีต้นไม้มากเกินไป','แดดแรงเกินไป'], correct:0, explain:'เมืองมีพื้นคอนกรีตมาก น้ำซึมลงดินไม่ได้ ประกอบกับท่อระบายน้ำอุดตัน', tier:3}
    ]
  },
  {
    id:'p4-social2', name:'สังคม ป.4 · ประวัติศาสตร์ พลเมือง และเศรษฐกิจ', emoji:'🏺', icon:'assets/icons/p4-social2.svg', color:'#E5893B', light:'#FBEAD5', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'อาณาจักรใดเป็นราชธานีแห่งแรกของไทยตามที่เรียนในประวัติศาสตร์?', emoji:'🏯', choices:['สุโขทัย','อยุธยา','ธนบุรี','รัตนโกสินทร์'], correct:0, explain:'สุโขทัยถือเป็นราชธานีแห่งแรกของไทย', tier:1},
      {q:'พ่อขุนรามคำแหงมหาราชทรงประดิษฐ์สิ่งใดที่สำคัญมาก?', emoji:'📜', choices:['ลายสือไทย (ตัวอักษรไทย)','เรือสำเภา','ปืนใหญ่','นาฬิกา'], correct:0, explain:'พ่อขุนรามคำแหงทรงประดิษฐ์ลายสือไทย ต้นแบบตัวอักษรไทยปัจจุบัน', tier:1},
      {q:'ราชธานีถัดจากสุโขทัยคืออาณาจักรใด?', emoji:'🏰', choices:['อยุธยา','ธนบุรี','ล้านนา','รัตนโกสินทร์'], correct:0, explain:'ลำดับคือ สุโขทัย → อยุธยา → ธนบุรี → รัตนโกสินทร์', tier:1},
      {q:'"ผู้ผลิต" ในทางเศรษฐศาสตร์หมายถึงใคร?', emoji:'🏭', choices:['ผู้สร้างสินค้าหรือบริการ','ผู้ซื้อของ','ผู้เก็บภาษี','ผู้ขับรถ'], correct:0, explain:'ผู้ผลิตคือผู้สร้างสินค้าหรือบริการออกมาให้ผู้บริโภคใช้', tier:1},
      {q:'"ผู้บริโภค" หมายถึงใคร?', emoji:'🛒', choices:['ผู้ซื้อและใช้สินค้า','ผู้ผลิตสินค้า','เจ้าของโรงงาน','ชาวนา'], correct:0, explain:'ผู้บริโภคคือผู้ซื้อสินค้าหรือบริการไปใช้', tier:1},
      {q:'เมื่อรายได้มีจำกัด เราควรซื้อสิ่งใดก่อน?', emoji:'🧺', choices:['สิ่งจำเป็นก่อนสิ่งที่อยากได้','ของเล่นราคาแพง','ของตามโฆษณา','ของที่เพื่อนมี'], correct:0, explain:'ควรจัดลำดับความจำเป็นก่อนความต้องการ', tier:1},
      {q:'สิทธิพื้นฐานของเด็กไทยทุกคนคือข้อใด?', emoji:'🧒', choices:['ได้รับการศึกษาและการดูแล','ได้รถยนต์ส่วนตัว','ได้เงินเดือน','ได้ทำงานหนัก'], correct:0, explain:'เด็กทุกคนมีสิทธิได้รับการศึกษา อาหาร ที่อยู่ และความปลอดภัย', tier:1},
      {q:'การเลือกตั้งในระบอบประชาธิปไตยคือการทำอะไร?', emoji:'🗳️', choices:['ให้ประชาชนเลือกตัวแทนของตน','ให้คนเดียวตัดสินใจ','แข่งกีฬา','สอบวัดความรู้'], correct:0, explain:'การเลือกตั้งคือการที่ประชาชนออกเสียงเลือกตัวแทนไปทำหน้าที่แทนตน', tier:1},
      {q:'"ภาษี" ที่ประชาชนจ่ายให้รัฐนำไปใช้ทำอะไร?', emoji:'🏛️', choices:['พัฒนาประเทศ เช่น ถนน โรงเรียน โรงพยาบาล','แจกให้คนรวย','เก็บไว้เฉยๆ','ซื้อของเล่น'], correct:0, explain:'ภาษีถูกนำไปพัฒนาสาธารณูปโภคและบริการสาธารณะ', tier:2},
      {q:'สินค้าที่ไทยส่งไปขายต่างประเทศเรียกว่าอะไร?', emoji:'🚢', choices:['สินค้าส่งออก','สินค้านำเข้า','สินค้าท้องถิ่น','สินค้ามือสอง'], correct:0, explain:'สินค้าที่ส่งไปขายต่างประเทศคือสินค้าส่งออก', tier:2},
      {q:'อาณาจักรอยุธยาเสียกรุงครั้งที่ 2 แล้วใครกอบกู้เอกราชและตั้งกรุงธนบุรี?', emoji:'⚔️', choices:['สมเด็จพระเจ้าตากสินมหาราช','พ่อขุนรามคำแหง','พระนเรศวร','พระเจ้าอู่ทอง'], correct:0, explain:'สมเด็จพระเจ้าตากสินมหาราชทรงกอบกู้เอกราชและสถาปนากรุงธนบุรี', tier:2},
      {q:'สมเด็จพระนเรศวรมหาราชมีวีรกรรมสำคัญเรื่องใด?', emoji:'🐘', choices:['ประกาศอิสรภาพและทำยุทธหัตถี','ประดิษฐ์ตัวอักษรไทย','สร้างกรุงเทพฯ','แต่งวรรณคดี'], correct:0, explain:'พระนเรศวรทรงประกาศอิสรภาพจากพม่าและทำยุทธหัตถีชนะ', tier:2},
      {q:'"หลักฐานทางประวัติศาสตร์" ประเภทใดเป็นหลักฐานชั้นต้น?', emoji:'📜', choices:['ศิลาจารึกและโบราณวัตถุ','หนังสือเรียนที่เขียนใหม่','นิทานเล่าต่อกันมา','ภาพวาดจินตนาการ'], correct:0, explain:'หลักฐานชั้นต้นคือสิ่งที่เกิดในยุคนั้นจริง เช่น ศิลาจารึก โบราณวัตถุ', tier:2},
      {q:'การออมเงินกับธนาคารได้ผลตอบแทนเรียกว่าอะไร?', emoji:'🏦', choices:['ดอกเบี้ย','ภาษี','ค่าปรับ','เงินทอน'], correct:0, explain:'เงินที่ธนาคารจ่ายเพิ่มให้ผู้ฝากเรียกว่าดอกเบี้ย', tier:2},
      {q:'"ปรัชญาเศรษฐกิจพอเพียง" เน้นเรื่องใด?', emoji:'🌾', choices:['พอประมาณ มีเหตุผล มีภูมิคุ้มกัน','ใช้เงินให้หมดเร็วที่สุด','กู้เงินมาลงทุนมากๆ','แข่งขันกับเพื่อนบ้าน'], correct:0, explain:'หลัก 3 ห่วงคือ ความพอประมาณ ความมีเหตุผล และการมีภูมิคุ้มกันที่ดี', tier:2},
      {q:'พลเมืองดีในระบอบประชาธิปไตยควรทำสิ่งใด?', emoji:'🤝', choices:['เคารพกฎหมายและเสียงส่วนใหญ่ พร้อมรับฟังเสียงส่วนน้อย','ทำตามใจตนเอง','ไม่สนใจส่วนรวม','บังคับให้คนอื่นคิดเหมือนตน'], correct:0, explain:'พลเมืองดีต้องเคารพกฎหมาย เคารพเสียงส่วนใหญ่ และรับฟังเสียงส่วนน้อย', tier:2},
      {q:'วัฒนธรรมท้องถิ่นควรได้รับการปฏิบัติอย่างไร?', emoji:'🎎', choices:['อนุรักษ์และสืบทอด','ทิ้งให้หายไป','ล้อเลียน','ห้ามพูดถึง'], correct:0, explain:'วัฒนธรรมท้องถิ่นเป็นมรดกที่ควรอนุรักษ์และสืบทอด', tier:2},
      {q:'ศิลาจารึกหลักที่ 1 เป็นหลักฐานสมัยใด และบอกเรื่องอะไร?', emoji:'🗿', choices:['สมัยสุโขทัย บอกความเป็นอยู่และการปกครอง','สมัยอยุธยา บอกการค้า','สมัยธนบุรี บอกสงคราม','สมัยปัจจุบัน บอกกฎหมาย'], correct:0, explain:'ศิลาจารึกหลักที่ 1 สมัยสุโขทัย บันทึกความเป็นอยู่ การปกครองแบบพ่อปกครองลูก', tier:3},
      {q:'การปกครองสมัยสุโขทัยเรียกว่าแบบใด?', emoji:'👑', choices:['พ่อปกครองลูก','ประชาธิปไตยเต็มรูปแบบ','สาธารณรัฐ','คณะกรรมการหมู่บ้าน'], correct:0, explain:'สุโขทัยปกครองแบบพ่อปกครองลูก กษัตริย์ดูแลราษฎรอย่างใกล้ชิด', tier:3},
      {q:'ถ้าสินค้าชนิดหนึ่งมีน้อยแต่คนต้องการมาก ราคาจะเป็นอย่างไร?', emoji:'📈', choices:['ราคาสูงขึ้น','ราคาลดลง','ราคาเท่าเดิมเสมอ','แจกฟรี'], correct:0, explain:'เมื่อความต้องการมากแต่ของมีน้อย ราคามักสูงขึ้น (อุปสงค์-อุปทาน)', tier:3},
      {q:'ประเทศไทยเปลี่ยนการปกครองเป็นระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุขเมื่อ พ.ศ. ใด?', emoji:'🏛️', choices:['พ.ศ. 2475','พ.ศ. 2325','พ.ศ. 2500','พ.ศ. 2540'], correct:0, explain:'เปลี่ยนแปลงการปกครองเมื่อ พ.ศ. 2475', tier:3}
    ]
  },
  /* ---------- วิทยาศาสตร์ ป.4 (สิ่งมีชีวิตและการจำแนก / แรง มวล-น้ำหนัก แสง ดวงจันทร์) ---------- */
  {
    id:'p4-sci1', name:'วิทยาศาสตร์ ป.4 · สิ่งมีชีวิตและการจำแนก', emoji:'🔭', icon:'assets/icons/p4-sci1.svg', color:'#2FA36B', light:'#D9F2E4', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'สัตว์กลุ่มใดมีกระดูกสันหลัง?', emoji:'🐟', choices:['ปลา','แมงมุม','หอยทาก','ผีเสื้อ'], correct:0, explain:'ปลาเป็นสัตว์มีกระดูกสันหลัง ส่วนแมงมุม หอย แมลง ไม่มี', tier:1},
      {q:'สัตว์มีกระดูกสันหลังแบ่งเป็นกี่กลุ่มใหญ่?', emoji:'🦴', choices:['5 กลุ่ม','3 กลุ่ม','7 กลุ่ม','2 กลุ่ม'], correct:0, explain:'ปลา สัตว์สะเทินน้ำสะเทินบก สัตว์เลื้อยคลาน นก และสัตว์เลี้ยงลูกด้วยนม', tier:1},
      {q:'พืชกลุ่มใดสืบพันธุ์ด้วยสปอร์?', emoji:'🌿', choices:['เฟิร์นและมอส','กุหลาบ','มะม่วง','ทานตะวัน'], correct:0, explain:'เฟิร์นและมอสเป็นพืชไม่มีดอก สืบพันธุ์ด้วยสปอร์', tier:1},
      {q:'ส่วนใดของดอกที่เจริญไปเป็นผล?', emoji:'🌸', choices:['รังไข่','กลีบดอก','เกสรตัวผู้','ก้านดอก'], correct:0, explain:'หลังการปฏิสนธิ รังไข่จะเจริญกลายเป็นผล', tier:1},
      {q:'สัตว์ในข้อใดเป็นสัตว์เลี้ยงลูกด้วยนม?', emoji:'🐬', choices:['โลมา','จระเข้','นกอินทรี','กบ'], correct:0, explain:'โลมาหายใจด้วยปอดและเลี้ยงลูกด้วยนม แม้อาศัยในน้ำ', tier:1},
      {q:'สิ่งมีชีวิตกลุ่มใดสร้างอาหารเองได้?', emoji:'🌱', choices:['พืชสีเขียว','สัตว์กินพืช','สัตว์กินเนื้อ','เห็ดรา'], correct:0, explain:'พืชสีเขียวสังเคราะห์แสงสร้างอาหารเองได้', tier:1},
      {q:'"ผู้ผลิต" ในห่วงโซ่อาหารคือสิ่งใด?', emoji:'🌾', choices:['พืช','สัตว์กินพืช','สัตว์กินเนื้อ','ผู้ย่อยสลาย'], correct:0, explain:'พืชเป็นผู้ผลิตเพราะสร้างอาหารเองได้ เป็นจุดเริ่มของห่วงโซ่อาหาร', tier:1},
      {q:'สัตว์ชนิดใดจัดเป็นสัตว์เลื้อยคลาน?', emoji:'🦎', choices:['จิ้งจก','กบ','ปลาทู','นกพิราบ'], correct:0, explain:'จิ้งจกมีเกล็ด วางไข่ เป็นสัตว์เลื้อยคลาน', tier:1},
      {q:'ใบไม้ที่มีสีเขียวเพราะมีสารใด?', emoji:'🍃', choices:['คลอโรฟิลล์','น้ำตาล','แป้ง','เกลือแร่'], correct:0, explain:'คลอโรฟิลล์ทำให้ใบมีสีเขียวและใช้ในการสังเคราะห์แสง', tier:2},
      {q:'ห่วงโซ่อาหาร: หญ้า → ตั๊กแตน → กบ → งู สัตว์ใดเป็นผู้บริโภคลำดับที่ 1?', emoji:'🦗', choices:['ตั๊กแตน','กบ','งู','หญ้า'], correct:0, explain:'ผู้บริโภคลำดับที่ 1 คือสัตว์ที่กินพืชโดยตรง คือตั๊กแตน', tier:2},
      {q:'"ผู้ย่อยสลาย" ในระบบนิเวศคือสิ่งใด?', emoji:'🍄', choices:['เห็ดราและแบคทีเรีย','เสือ','ต้นไม้','นก'], correct:0, explain:'เห็ดราและแบคทีเรียย่อยซากพืชซากสัตว์ให้กลับเป็นธาตุอาหารในดิน', tier:2},
      {q:'พืชใบเลี้ยงเดี่ยวมีลักษณะเส้นใบแบบใด?', emoji:'🌾', choices:['เส้นใบขนาน','เส้นใบร่างแห','ไม่มีเส้นใบ','เส้นใบเป็นวงกลม'], correct:0, explain:'พืชใบเลี้ยงเดี่ยว เช่น ข้าว หญ้า มีเส้นใบขนานกัน', tier:2},
      {q:'สัตว์ที่ตัวอ่อนอยู่ในน้ำหายใจด้วยเหงือก โตขึ้นขึ้นบกหายใจด้วยปอด คือกลุ่มใด?', emoji:'🐸', choices:['สัตว์สะเทินน้ำสะเทินบก','สัตว์เลื้อยคลาน','นก','ปลา'], correct:0, explain:'กบและคางคกเป็นสัตว์สะเทินน้ำสะเทินบก', tier:2},
      {q:'การจำแนกสิ่งมีชีวิตใช้สิ่งใดเป็นเกณฑ์?', emoji:'🔬', choices:['ลักษณะที่เหมือนและต่างกัน','สีที่ชอบ','ราคา','ชื่อเรียก'], correct:0, explain:'นักวิทยาศาสตร์ใช้ลักษณะร่วมและลักษณะต่างในการจัดกลุ่มสิ่งมีชีวิต', tier:2},
      {q:'ถ้าในระบบนิเวศไม่มีผู้ย่อยสลายเลย จะเกิดอะไรขึ้น?', emoji:'♻️', choices:['ซากพืชซากสัตว์กองสะสม ธาตุอาหารไม่กลับสู่ดิน','พืชโตเร็วขึ้น','สัตว์เพิ่มจำนวน','ไม่มีผลอะไร'], correct:0, explain:'ผู้ย่อยสลายทำให้ธาตุอาหารหมุนเวียนกลับสู่ดิน ถ้าไม่มีระบบจะเสียสมดุล', tier:2},
      {q:'ส่วนใดของพืชทำหน้าที่ลำเลียงน้ำจากรากไปสู่ใบ?', emoji:'🌳', choices:['ลำต้น','ดอก','ผล','เมล็ด'], correct:0, explain:'ลำต้นมีท่อลำเลียงน้ำและอาหารไปเลี้ยงส่วนต่างๆ', tier:2},
      {q:'นกมีลักษณะใดที่ช่วยให้บินได้ดี?', emoji:'🦅', choices:['กระดูกกลวงและมีขนปีก','ขนหนาเป็นชั้น','เกล็ดแข็ง','ครีบ'], correct:0, explain:'กระดูกกลวงทำให้ตัวเบา และขนปีกช่วยพยุงตัวในอากาศ', tier:2},
      {q:'แมลงมีขากี่ขา?', emoji:'🐝', choices:['6 ขา','8 ขา','4 ขา','10 ขา'], correct:0, explain:'แมลงมี 6 ขา ส่วนแมงมุมมี 8 ขา (จึงไม่ใช่แมลง)', tier:3},
      {q:'ทำไมแมงมุมจึง "ไม่ใช่" แมลง?', emoji:'🕷️', choices:['มี 8 ขาและลำตัว 2 ส่วน','ตัวเล็กเกินไป','ไม่มีปีก','อยู่บนบก'], correct:0, explain:'แมลงมี 6 ขา ลำตัว 3 ส่วน ส่วนแมงมุมมี 8 ขา ลำตัว 2 ส่วน', tier:3},
      {q:'สายใยอาหารต่างจากห่วงโซ่อาหารอย่างไร?', emoji:'🕸️', choices:['สายใยอาหารคือห่วงโซ่หลายสายเชื่อมโยงกัน','สายใยอาหารสั้นกว่า','ห่วงโซ่อาหารมีแต่พืช','ไม่ต่างกัน'], correct:0, explain:'สายใยอาหารคือห่วงโซ่อาหารหลายสายที่เชื่อมโยงกันในระบบนิเวศ', tier:3},
      {q:'พืชใบเลี้ยงคู่กับใบเลี้ยงเดี่ยว ต่างกันที่จำนวนใดในเมล็ด?', emoji:'🌱', choices:['จำนวนใบเลี้ยงในเมล็ด (2 กับ 1)','จำนวนราก','จำนวนดอก','จำนวนผล'], correct:0, explain:'พืชใบเลี้ยงคู่มีใบเลี้ยง 2 ใบ ใบเลี้ยงเดี่ยวมี 1 ใบ', tier:3}
    ]
  },
  {
    id:'p4-sci2', name:'วิทยาศาสตร์ ป.4 · แรง มวล แสง และดวงจันทร์', emoji:'⚛️', icon:'assets/icons/p4-sci2.svg', color:'#3FA9C9', light:'#D9F0F8', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'เครื่องมือใดใช้วัด "มวล" ของวัตถุ?', emoji:'⚖️', choices:['เครื่องชั่ง','ไม้บรรทัด','นาฬิกา','เทอร์โมมิเตอร์'], correct:0, explain:'มวลวัดด้วยเครื่องชั่ง มีหน่วยเป็นกรัม/กิโลกรัม', tier:1},
      {q:'"น้ำหนัก" ของวัตถุเกิดจากแรงชนิดใด?', emoji:'🍎', choices:['แรงโน้มถ่วงของโลก','แรงลม','แรงแม่เหล็ก','แรงเสียดทาน'], correct:0, explain:'น้ำหนักคือแรงที่โลกดึงดูดวัตถุ', tier:1},
      {q:'แสงเดินทางเป็นแนวใด?', emoji:'🔦', choices:['เส้นตรง','เส้นโค้ง','ซิกแซก','วงกลม'], correct:0, explain:'แสงเดินทางเป็นเส้นตรง จึงเกิดเงาเมื่อมีวัตถุบัง', tier:1},
      {q:'วัตถุที่แสงผ่านได้บางส่วนเรียกว่าอะไร?', emoji:'🌫️', choices:['โปร่งแสง','โปร่งใส','ทึบแสง','สะท้อนแสง'], correct:0, explain:'เช่น กระดาษไข กระจกฝ้า แสงผ่านได้บางส่วนจึงเรียกโปร่งแสง', tier:1},
      {q:'ดวงจันทร์มีแสงสว่างได้เพราะอะไร?', emoji:'🌙', choices:['สะท้อนแสงจากดวงอาทิตย์','ผลิตแสงเอง','มีไฟอยู่ข้างใน','สะท้อนแสงจากโลก'], correct:0, explain:'ดวงจันทร์ไม่มีแสงในตัวเอง แต่สะท้อนแสงจากดวงอาทิตย์', tier:1},
      {q:'"ตัวกลางของแสง" ที่แสงผ่านได้ทั้งหมดคือข้อใด?', emoji:'🪟', choices:['กระจกใส','กำแพงอิฐ','กระดาษแข็ง','ไม้กระดาน'], correct:0, explain:'กระจกใสเป็นตัวกลางโปร่งใส แสงผ่านได้เกือบทั้งหมด', tier:1},
      {q:'แรงชนิดใดทำให้วัตถุที่กำลังเคลื่อนที่ค่อยๆ ช้าลงและหยุด?', emoji:'🛑', choices:['แรงเสียดทาน','แรงแม่เหล็ก','แรงลอยตัว','แรงไฟฟ้า'], correct:0, explain:'แรงเสียดทานระหว่างผิวสัมผัสทำให้วัตถุช้าลงจนหยุด', tier:1},
      {q:'ข้างขึ้น-ข้างแรม เกิดจากอะไร?', emoji:'🌗', choices:['ดวงจันทร์โคจรรอบโลก ทำให้เห็นส่วนสว่างต่างกัน','ดวงจันทร์เปลี่ยนขนาด','เมฆบังดวงจันทร์','โลกหยุดหมุน'], correct:0, explain:'ตำแหน่งของดวงจันทร์ที่โคจรรอบโลกทำให้เรามองเห็นด้านสว่างมากน้อยต่างกัน', tier:1},
      {q:'มวล 1 กิโลกรัม เท่ากับกี่กรัม?', emoji:'🧮', choices:['1,000 กรัม','100 กรัม','10 กรัม','10,000 กรัม'], correct:0, explain:'1 กิโลกรัม = 1,000 กรัม', tier:2},
      {q:'ถ้านำวัตถุชิ้นเดิมไปชั่งบนดวงจันทร์ ผลจะเป็นอย่างไร?', emoji:'🌕', choices:['มวลเท่าเดิม แต่น้ำหนักน้อยลง','ทั้งมวลและน้ำหนักลดลง','มวลเพิ่มขึ้น','ไม่มีอะไรเปลี่ยน'], correct:0, explain:'มวลเป็นปริมาณเนื้อสารจึงคงที่ ส่วนน้ำหนักขึ้นกับแรงโน้มถ่วงซึ่งดวงจันทร์น้อยกว่าโลก', tier:2},
      {q:'เมื่อแสงตกกระทบกระจกเงาจะเกิดปรากฏการณ์ใด?', emoji:'🪞', choices:['การสะท้อนของแสง','การหักเหจนหายไป','แสงถูกดูดกลืนหมด','แสงเปลี่ยนเป็นเสียง'], correct:0, explain:'กระจกเงาสะท้อนแสงกลับ ทำให้เห็นภาพของตัวเอง', tier:2},
      {q:'เหตุใดหลอดดูดในแก้วน้ำจึงดูเหมือนหักงอ?', emoji:'🥤', choices:['แสงหักเหเมื่อผ่านน้ำกับอากาศ','หลอดหักจริง','น้ำทำให้หลอดงอ','แสงสะท้อนจากก้นแก้ว'], correct:0, explain:'แสงเปลี่ยนทิศเมื่อเดินทางผ่านตัวกลางต่างชนิด เรียกว่าการหักเหของแสง', tier:2},
      {q:'เงาจะยาวที่สุดในช่วงเวลาใดของวัน?', emoji:'🌅', choices:['ตอนเช้าตรู่หรือเย็นใกล้ค่ำ','ตอนเที่ยงวัน','ตอนกลางคืน','เงายาวเท่ากันทั้งวัน'], correct:0, explain:'เมื่อดวงอาทิตย์อยู่ต่ำใกล้ขอบฟ้า เงาจะทอดยาวที่สุด', tier:2},
      {q:'แรงชนิดใดเป็น "แรงไม่สัมผัส"?', emoji:'🧲', choices:['แรงแม่เหล็กและแรงโน้มถ่วง','แรงดันประตู','แรงดึงเชือก','แรงเสียดทาน'], correct:0, explain:'แรงแม่เหล็กและแรงโน้มถ่วงออกแรงได้โดยไม่ต้องสัมผัสวัตถุ', tier:2},
      {q:'พื้นผิวแบบใดทำให้เกิดแรงเสียดทานน้อยที่สุด?', emoji:'🧊', choices:['พื้นน้ำแข็งลื่น','พื้นทราย','พื้นหญ้า','พื้นยางมะตอย'], correct:0, explain:'ผิวยิ่งลื่นเรียบ แรงเสียดทานยิ่งน้อย', tier:2},
      {q:'ดวงจันทร์โคจรรอบโลกครบ 1 รอบใช้เวลาประมาณเท่าใด?', emoji:'🗓️', choices:['ประมาณ 1 เดือน','ประมาณ 1 สัปดาห์','ประมาณ 1 ปี','ประมาณ 1 วัน'], correct:0, explain:'ดวงจันทร์โคจรรอบโลกประมาณ 29-30 วัน จึงเห็นข้างขึ้นข้างแรมครบรอบใน 1 เดือน', tier:2},
      {q:'ทำไมนักกีฬาจึงใส่รองเท้าที่มีดอกยาง?', emoji:'👟', choices:['เพิ่มแรงเสียดทานกันลื่น','ลดน้ำหนักตัว','ทำให้สวยงาม','ลดแรงโน้มถ่วง'], correct:0, explain:'ดอกยางเพิ่มแรงเสียดทานกับพื้น ทำให้ไม่ลื่นล้ม', tier:2},
      {q:'ปรากฏการณ์ "สุริยุปราคา" เกิดจากอะไร?', emoji:'🌑', choices:['ดวงจันทร์บังดวงอาทิตย์เมื่อมองจากโลก','โลกบังดวงจันทร์','ดวงอาทิตย์ดับ','เมฆหนาบัง'], correct:0, explain:'เมื่อดวงจันทร์เคลื่อนมาอยู่ระหว่างโลกกับดวงอาทิตย์ จะบังแสงเกิดสุริยุปราคา', tier:3},
      {q:'ปรากฏการณ์ "จันทรุปราคา" เกิดจากอะไร?', emoji:'🌒', choices:['เงาของโลกบังดวงจันทร์','ดวงจันทร์บังดวงอาทิตย์','ดวงจันทร์หายไป','ดาวหางบัง'], correct:0, explain:'เมื่อโลกอยู่ระหว่างดวงอาทิตย์กับดวงจันทร์ เงาโลกจะทาบดวงจันทร์', tier:3},
      {q:'แสงขาวจากดวงอาทิตย์เมื่อผ่านปริซึมจะเกิดอะไร?', emoji:'🌈', choices:['แยกออกเป็นแถบสีรุ้ง','หายไปหมด','กลายเป็นสีดำ','เปลี่ยนเป็นเสียง'], correct:0, explain:'แสงขาวประกอบด้วยแสงหลายสี เมื่อผ่านปริซึมจะแยกเป็นแถบสีรุ้ง', tier:3},
      {q:'ถ้าไม่มีแรงโน้มถ่วงของโลก จะเกิดอะไรขึ้นกับสิ่งของบนพื้น?', emoji:'🚀', choices:['ลอยขึ้นไปในอากาศ','จมลงดิน','ร้อนขึ้น','เปลี่ยนสี'], correct:0, explain:'แรงโน้มถ่วงคือแรงที่ดึงวัตถุเข้าหาโลก ถ้าไม่มีวัตถุจะลอย', tier:3}
    ]
  },
  /* ---------- เชาวน์ ป.4 (ตรรกะ-แบบรูปเลข / มิติสัมพันธ์-การให้เหตุผล) ---------- */
  {
    id:'p4-iq1', name:'เชาวน์ ป.4 · แบบรูปและการให้เหตุผล', emoji:'♟️', icon:'assets/icons/p4-iq1.svg', color:'#2FB673', light:'#D6F3E4', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'เติมเลขต่อไป: 3, 6, 12, 24, ▢', emoji:'🔢', choices:['48','36','30','60'], correct:0, explain:'คูณ 2 ทุกครั้ง ตัวต่อไปคือ 48', tier:1},
      {q:'เติมเลขต่อไป: 100, 90, 81, 73, ▢', emoji:'📉', choices:['66','65','64','70'], correct:0, explain:'ลดทีละ 10, 9, 8, 7 → 73 - 7 = 66', tier:1},
      {q:'เติมเลขต่อไป: 1, 4, 9, 16, 25, ▢', emoji:'🟦', choices:['36','30','35','49'], correct:0, explain:'เป็นจำนวนยกกำลังสอง 6 × 6 = 36', tier:1},
      {q:'สิ่งใดไม่เข้าพวก?', emoji:'🧩', choices:['ไม้บรรทัด','สามเหลี่ยม','วงกลม','สี่เหลี่ยม'], correct:0, explain:'ไม้บรรทัดเป็นอุปกรณ์ ส่วนที่เหลือเป็นรูปเรขาคณิต', tier:1},
      {q:'ถ้า A = 1, B = 2, C = 3 แล้ว E = ?', emoji:'🔤', choices:['5','4','6','3'], correct:0, explain:'E เป็นตัวอักษรลำดับที่ 5', tier:1},
      {q:'เติมเลขต่อไป: 2, 5, 10, 17, ▢', emoji:'🧮', choices:['26','24','20','28'], correct:0, explain:'เพิ่มทีละ 3, 5, 7, 9 → 17 + 9 = 26', tier:1},
      {q:'นาฬิกาบอกเวลา 15:00 น. ตรงกับเวลาใดในระบบ 12 ชั่วโมง?', emoji:'🕒', choices:['บ่าย 3 โมง','ตี 3','5 โมงเย็น','เที่ยงคืน'], correct:0, explain:'15:00 = 15 - 12 = บ่าย 3 โมง', tier:1},
      {q:'ถ้าวันนี้เป็นวันพุธ อีก 10 วันเป็นวันอะไร?', emoji:'📅', choices:['วันเสาร์','วันศุกร์','วันอาทิตย์','วันพุธ'], correct:0, explain:'10 ÷ 7 เหลือเศษ 3 นับจากพุธไป 3 วัน = เสาร์', tier:2},
      {q:'พี่มีเงินเป็น 3 เท่าของน้อง น้องมี 45 บาท พี่มีเงินเท่าไร?', emoji:'💰', choices:['135 บาท','90 บาท','48 บาท','15 บาท'], correct:0, explain:'45 × 3 = 135 บาท', tier:2},
      {q:'ในกล่องมีลูกแก้วแดง 5 ลูก ฟ้า 3 ลูก เขียว 2 ลูก หยิบ 1 ครั้ง มีโอกาสได้สีใดมากที่สุด?', emoji:'🔴', choices:['สีแดง','สีฟ้า','สีเขียว','เท่ากันหมด'], correct:0, explain:'สีแดงมีมากที่สุด (5 ลูก) โอกาสจึงมากที่สุด', tier:2},
      {q:'เติมเลขต่อไป: 1, 1, 2, 3, 5, 8, ▢', emoji:'🌀', choices:['13','11','10','16'], correct:0, explain:'แต่ละตัวเกิดจากบวกสองตัวก่อนหน้า 5 + 8 = 13 (ลำดับฟีโบนักชี)', tier:2},
      {q:'ถ้ารถ 1 คันบรรทุกได้ 8 กล่อง ต้องขนกล่อง 50 กล่อง ต้องวิ่งอย่างน้อยกี่เที่ยว?', emoji:'🚚', choices:['7 เที่ยว','6 เที่ยว','8 เที่ยว','5 เที่ยว'], correct:0, explain:'50 ÷ 8 = 6 เศษ 2 จึงต้องวิ่งเพิ่มอีก 1 เที่ยว รวม 7 เที่ยว', tier:2},
      {q:'สมชายสูงกว่าสมหญิง สมหญิงสูงกว่าสมศรี ใครเตี้ยที่สุด?', emoji:'📏', choices:['สมศรี','สมชาย','สมหญิง','สูงเท่ากัน'], correct:0, explain:'เรียงได้ สมชาย > สมหญิง > สมศรี จึงสมศรีเตี้ยที่สุด', tier:2},
      {q:'ถ้า 5 คนทำงานเสร็จใน 10 วัน แล้ว 10 คนทำงานเดียวกันจะใช้เวลากี่วัน (ทำงานเร็วเท่ากัน)?', emoji:'👷', choices:['5 วัน','20 วัน','10 วัน','2 วัน'], correct:0, explain:'คนเพิ่มเป็น 2 เท่า เวลาจึงลดลงครึ่งหนึ่ง = 5 วัน', tier:2},
      {q:'กระดาษพับครึ่ง 2 ครั้ง แล้วคลี่ออก จะได้กี่ส่วน?', emoji:'📄', choices:['4 ส่วน','2 ส่วน','3 ส่วน','8 ส่วน'], correct:0, explain:'พับครึ่ง 1 ครั้งได้ 2 ส่วน พับอีกครั้งได้ 4 ส่วน', tier:2},
      {q:'เติมเลขต่อไป: 64, 32, 16, 8, ▢', emoji:'➗', choices:['4','6','2','10'], correct:0, explain:'หารด้วย 2 ทุกครั้ง 8 ÷ 2 = 4', tier:2},
      {q:'ในห้องมีเก้าอี้ 4 ขา 12 ตัว และโต๊ะ 4 ขา 3 ตัว รวมมีขาทั้งหมดกี่ขา?', emoji:'🪑', choices:['60 ขา','48 ขา','15 ขา','54 ขา'], correct:0, explain:'(12 + 3) × 4 = 15 × 4 = 60 ขา', tier:2},
      {q:'ลูกบาศก์ 1 ลูกมีกี่หน้า?', emoji:'🎲', choices:['6 หน้า','4 หน้า','8 หน้า','12 หน้า'], correct:0, explain:'ลูกบาศก์มี 6 หน้า 12 ขอบ 8 มุม', tier:3},
      {q:'ถ้าเลข 3 ตัวบวกกันได้ 30 และเลขทั้งสามเท่ากัน เลขแต่ละตัวคือเท่าไร?', emoji:'🧠', choices:['10','15','3','30'], correct:0, explain:'30 ÷ 3 = 10', tier:3},
      {q:'นาฬิกาเดินช้าไป 5 นาทีต่อวัน ผ่านไป 6 วันจะช้าไปกี่นาที?', emoji:'⏰', choices:['30 นาที','11 นาที','25 นาที','60 นาที'], correct:0, explain:'5 × 6 = 30 นาที', tier:3},
      {q:'มีเหรียญ 10 บาท และ 5 บาท รวม 8 เหรียญ เป็นเงิน 65 บาท มีเหรียญ 10 บาทกี่เหรียญ?', emoji:'🪙', choices:['5 เหรียญ','3 เหรียญ','4 เหรียญ','6 เหรียญ'], correct:0, explain:'ถ้าเป็น 5 บาททั้ง 8 เหรียญได้ 40 บาท ขาดอีก 25 บาท เหรียญ 10 เพิ่มทีละ 5 บาท จึงมี 5 เหรียญ', tier:3},
      {q:'รูปสี่เหลี่ยมจัตุรัสด้านละ 4 ซม. ถ้าเพิ่มด้านเป็น 2 เท่า พื้นที่จะเป็นกี่เท่า?', emoji:'🟦', choices:['4 เท่า','2 เท่า','8 เท่า','เท่าเดิม'], correct:0, explain:'ด้าน 4 → 8 พื้นที่จาก 16 เป็น 64 ตร.ซม. คือ 4 เท่า', tier:3}
    ]
  },
  {
    id:'p4-iq2', name:'เชาวน์ ป.4 · มิติสัมพันธ์และการวิเคราะห์', emoji:'🧿', icon:'assets/icons/p4-iq2.svg', color:'#1F9C60', light:'#D6F3E4', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'มือ คู่กับ ถุงมือ แล้ว เท้า คู่กับอะไร?', emoji:'🧤', choices:['ถุงเท้า','หมวก','แว่นตา','เข็มขัด'], correct:0, explain:'ถุงมือใส่กับมือ ถุงเท้าใส่กับเท้า', tier:1},
      {q:'หนังสือ คู่กับ อ่าน แล้ว เพลง คู่กับอะไร?', emoji:'🎵', choices:['ฟัง','ดื่ม','เขียนแผนที่','ขับรถ'], correct:0, explain:'หนังสือใช้อ่าน เพลงใช้ฟัง', tier:1},
      {q:'ถ้าหันหน้าไปทางทิศตะวันออก แล้วหันขวา 1 ครั้ง จะหันไปทิศใด?', emoji:'🧭', choices:['ทิศใต้','ทิศเหนือ','ทิศตะวันตก','ทิศตะวันออก'], correct:0, explain:'จากตะวันออกหันขวา (ตามเข็มนาฬิกา) จะเป็นทิศใต้', tier:1},
      {q:'1 ชั่วโมง 30 นาที เท่ากับกี่นาที?', emoji:'⏱️', choices:['90 นาที','130 นาที','60 นาที','120 นาที'], correct:0, explain:'60 + 30 = 90 นาที', tier:1},
      {q:'ตัวอักษร "b" เมื่อมองในกระจกเงาจะดูเหมือนตัวใด?', emoji:'🪞', choices:['d','p','q','b'], correct:0, explain:'กระจกกลับซ้าย-ขวา b จึงดูเหมือน d', tier:1},
      {q:'ลูกบาศก์กองซ้อนกัน 3 ชั้น ชั้นละ 4 ก้อน รวมมีกี่ก้อน?', emoji:'🧱', choices:['12 ก้อน','7 ก้อน','9 ก้อน','16 ก้อน'], correct:0, explain:'3 × 4 = 12 ก้อน', tier:1},
      {q:'ถ้าวันนี้วันอาทิตย์ เมื่อวานคือวันอะไร?', emoji:'📆', choices:['วันเสาร์','วันจันทร์','วันศุกร์','วันอังคาร'], correct:0, explain:'ก่อนวันอาทิตย์คือวันเสาร์', tier:1},
      {q:'ครู คู่กับ โรงเรียน แล้ว นักบิน คู่กับอะไร?', emoji:'✈️', choices:['เครื่องบิน','โรงพยาบาล','ตลาด','นา'], correct:0, explain:'นักบินทำงานกับเครื่องบิน', tier:1},
      {q:'กล่องทรงลูกบาศก์ถ้าคลี่ออกจะได้รูปแบนที่มีสี่เหลี่ยมกี่รูป?', emoji:'📦', choices:['6 รูป','4 รูป','8 รูป','12 รูป'], correct:0, explain:'ลูกบาศก์มี 6 หน้า คลี่ออกจึงได้สี่เหลี่ยม 6 รูป', tier:2},
      {q:'เข็มนาฬิกาชี้ 3 นาฬิกาตรง เข็มสั้นกับเข็มยาวทำมุมกี่องศา?', emoji:'🕒', choices:['90 องศา','180 องศา','45 องศา','30 องศา'], correct:0, explain:'หน้าปัด 12 ช่อง ช่องละ 30 องศา ห่างกัน 3 ช่อง = 90 องศา (มุมฉาก)', tier:2},
      {q:'กระดาษพับครึ่งแล้วเจาะ 2 รู เมื่อคลี่ออกจะมีกี่รู?', emoji:'📄', choices:['4 รู','2 รู','3 รู','8 รู'], correct:0, explain:'พับครึ่งเจาะทะลุ 2 รู คลี่ออกได้ 4 รู', tier:2},
      {q:'รถออกเวลา 08:45 น. ใช้เวลาเดินทาง 1 ชั่วโมง 30 นาที จะถึงกี่โมง?', emoji:'🚌', choices:['10:15 น.','10:45 น.','09:15 น.','10:00 น.'], correct:0, explain:'08:45 + 1 ชม. = 09:45 แล้ว + 30 นาที = 10:15 น.', tier:2},
      {q:'ถ้าหมุนรูปสามเหลี่ยมไป 360 องศา ผลจะเป็นอย่างไร?', emoji:'🔺', choices:['กลับมาเหมือนเดิม','กลับหัว','หายไป','ใหญ่ขึ้น'], correct:0, explain:'หมุนครบ 360 องศาคือหมุนครบ 1 รอบ กลับมาตำแหน่งเดิม', tier:2},
      {q:'บันได 5 ขั้น เดินขึ้นทีละ 2 ขั้นสลับ 1 ขั้น จากขั้น 0 จะเหยียบขั้นใดบ้างจนถึงขั้น 5?', emoji:'🪜', choices:['2, 3, 5','1, 2, 3','2, 4, 5','1, 3, 5'], correct:0, explain:'0 +2 = 2, +1 = 3, +2 = 5 จึงเหยียบขั้น 2, 3 และ 5', tier:2},
      {q:'ภาพสะท้อนในน้ำของภูเขาจะมีลักษณะอย่างไร?', emoji:'🏞️', choices:['กลับหัวลง','เหมือนเดิมทุกอย่าง','หมุน 90 องศา','เล็กลงครึ่งหนึ่ง'], correct:0, explain:'ภาพสะท้อนผิวน้ำจะกลับหัวลง (สะท้อนแนวนอน)', tier:2},
      {q:'มีลูกบอล 3 สี สลับกันเรียง แดง-ฟ้า-เขียว ซ้ำไปเรื่อยๆ ลูกที่ 10 เป็นสีอะไร?', emoji:'🎨', choices:['สีแดง','สีฟ้า','สีเขียว','สีเหลือง'], correct:0, explain:'10 ÷ 3 = 3 เศษ 1 เศษ 1 ตรงกับสีแรกคือแดง', tier:2},
      {q:'ถ้าใส่น้ำ 250 มิลลิลิตร ลงแก้ว 4 ใบ จะใช้น้ำทั้งหมดกี่ลิตร?', emoji:'🥤', choices:['1 ลิตร','4 ลิตร','2.5 ลิตร','0.5 ลิตร'], correct:0, explain:'250 × 4 = 1,000 มิลลิลิตร = 1 ลิตร', tier:2},
      {q:'มองกล่องลูกบาศก์จากด้านบน จะเห็นเป็นรูปอะไร?', emoji:'⬜', choices:['สี่เหลี่ยมจัตุรัส','สามเหลี่ยม','วงกลม','หกเหลี่ยม'], correct:0, explain:'มองลูกบาศก์จากด้านบนเห็นหน้าเดียวเป็นสี่เหลี่ยมจัตุรัส', tier:3},
      {q:'เชือกยาว 12 เมตร ตัดเป็นท่อนละ 1.5 เมตร ได้กี่ท่อน?', emoji:'🧵', choices:['8 ท่อน','6 ท่อน','10 ท่อน','12 ท่อน'], correct:0, explain:'12 ÷ 1.5 = 8 ท่อน', tier:3},
      {q:'ในการแข่งขัน 8 คน แข่งแบบแพ้คัดออก ต้องแข่งกี่นัดจึงได้ผู้ชนะ?', emoji:'🏆', choices:['7 นัด','8 นัด','4 นัด','3 นัด'], correct:0, explain:'แพ้คัดออก ผู้แพ้ 7 คนต้องแพ้คนละ 1 นัด จึงแข่ง 7 นัด', tier:3},
      {q:'นาฬิกาบอกเวลา 4:30 น. เข็มสั้นอยู่ระหว่างเลขใด?', emoji:'🕟', choices:['ระหว่าง 4 กับ 5','ตรงเลข 4 พอดี','ตรงเลข 5 พอดี','ระหว่าง 5 กับ 6'], correct:0, explain:'เวลาผ่านไปครึ่งชั่วโมง เข็มสั้นจึงเลื่อนไปครึ่งทางระหว่าง 4 กับ 5', tier:3}
    ]
  },
  /* ---------- ดนตรี ป.4 (เครื่องดนตรี-วงดนตรี / โน้ตและจังหวะ) ---------- */
  {
    id:'p4-music1', name:'ดนตรี ป.4 · วงดนตรีและบทเพลง', emoji:'🎸', icon:'assets/icons/p4-music1.svg', color:'#4C8DF0', light:'#DEEAFC', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'วงดนตรีไทยที่มีระนาดเอก ฆ้องวง ปี่ และกลองทัด เรียกว่าวงอะไร?', emoji:'🥁', choices:['วงปี่พาทย์','วงเครื่องสาย','วงมโหรี','วงสตริง'], correct:0, explain:'วงปี่พาทย์ประกอบด้วยเครื่องตีและเครื่องเป่าเป็นหลัก', tier:1},
      {q:'วงดนตรีไทยที่มีซอด้วง ซออู้ จะเข้ และขลุ่ย เรียกว่าวงอะไร?', emoji:'🎻', choices:['วงเครื่องสาย','วงปี่พาทย์','วงโยธวาทิต','วงลูกทุ่ง'], correct:0, explain:'วงเครื่องสายใช้เครื่องสีและเครื่องดีดเป็นหลัก', tier:1},
      {q:'เครื่องดนตรีใดเป็นเครื่อง "ตี" ของไทย?', emoji:'🪘', choices:['ระนาดเอก','ซออู้','ขลุ่ย','จะเข้'], correct:0, explain:'ระนาดเอกใช้ไม้ตี เป็นเครื่องตี', tier:1},
      {q:'เครื่องดนตรีสากลใดเป็นเครื่องเป่าทองเหลือง?', emoji:'🎺', choices:['ทรัมเป็ต','ไวโอลิน','กลองชุด','เปียโน'], correct:0, explain:'ทรัมเป็ตทำจากทองเหลืองและใช้เป่า', tier:1},
      {q:'"เพลงชาติไทย" ควรร้องด้วยท่าทางอย่างไร?', emoji:'🇹🇭', choices:['ยืนตรงด้วยความเคารพ','นั่งเล่นโทรศัพท์','วิ่งเล่น','นอนฟัง'], correct:0, explain:'ขณะเคารพธงชาติและร้องเพลงชาติ ต้องยืนตรงแสดงความเคารพ', tier:1},
      {q:'เครื่องดนตรีใดมีสายและใช้คันชักสี?', emoji:'🎻', choices:['ไวโอลิน','กีตาร์','ฟลุต','กลอง'], correct:0, explain:'ไวโอลินใช้คันชักสีที่สาย', tier:1},
      {q:'"ขิม" เล่นด้วยวิธีใด?', emoji:'🪕', choices:['ตีด้วยไม้ตีขิม','เป่า','สี','เขย่า'], correct:0, explain:'ขิมเป็นเครื่องสายที่ใช้ไม้ตีที่สาย', tier:1},
      {q:'เพลงพื้นบ้านของภาคอีสานที่ใช้แคนบรรเลงเรียกว่าอะไร?', emoji:'🪈', choices:['หมอลำ','ลิเก','เพลงฉ่อย','ลำตัด'], correct:0, explain:'หมอลำเป็นเพลงพื้นบ้านอีสาน มักใช้แคนบรรเลงประกอบ', tier:2},
      {q:'"วงโยธวาทิต" มักใช้บรรเลงในโอกาสใด?', emoji:'🎺', choices:['เดินสวนสนามและงานพิธี','กล่อมเด็กนอน','งานสวดมนต์เงียบ','ฟังในห้องสมุด'], correct:0, explain:'วงโยธวาทิตเสียงดังกังวาน เหมาะกับการเดินแถวและงานพิธี', tier:2},
      {q:'เครื่องดนตรีใด "ไม่ใช่" เครื่องดนตรีไทย?', emoji:'🎹', choices:['เปียโน','ระนาด','ซอด้วง','ฉิ่ง'], correct:0, explain:'เปียโนเป็นเครื่องดนตรีสากล', tier:2},
      {q:'"ฉิ่ง" มีหน้าที่อะไรในวงดนตรีไทย?', emoji:'🔔', choices:['กำกับจังหวะ','บรรเลงทำนองหลัก','ร้องนำ','ให้เสียงเบส'], correct:0, explain:'ฉิ่งเป็นเครื่องกำกับจังหวะให้วงเล่นพร้อมกัน', tier:2},
      {q:'เพลงที่ใช้ประกอบการรำวงมาตรฐานเป็นเพลงประเภทใด?', emoji:'💃', choices:['เพลงไทยเดิม/เพลงพื้นบ้าน','เพลงร็อก','เพลงแร็ป','เพลงคลาสสิกตะวันตก'], correct:0, explain:'รำวงมาตรฐานใช้เพลงไทยเดิมและเพลงพื้นบ้าน', tier:2},
      {q:'ถ้าต้องการเสียงทุ้มต่ำที่สุดในวงสตริง ควรใช้เครื่องดนตรีใด?', emoji:'🎸', choices:['กีตาร์เบส','กีตาร์โปร่ง','ฟลุต','ไวโอลิน'], correct:0, explain:'กีตาร์เบสให้เสียงต่ำที่สุดในวง', tier:2},
      {q:'การขับร้องประสานเสียงหมายถึงอะไร?', emoji:'🎤', choices:['ร้องหลายแนวเสียงพร้อมกันอย่างกลมกลืน','ร้องคนเดียว','ร้องแข่งกัน','พูดพร้อมกัน'], correct:0, explain:'การประสานเสียงคือร้องหลายแนวเสียงพร้อมกันให้กลมกลืน', tier:2},
      {q:'เครื่องดนตรีใดใช้ "เขย่า" ให้เกิดเสียง?', emoji:'🪇', choices:['มาราคัส','กลอง','ขลุ่ย','ซอ'], correct:0, explain:'มาราคัสเป็นเครื่องเขย่าให้เกิดจังหวะ', tier:2},
      {q:'ดนตรีมีบทบาทสำคัญอย่างไรในพิธีกรรมไทย?', emoji:'🛕', choices:['สร้างบรรยากาศและความศักดิ์สิทธิ์','ทำให้เสียงดังรบกวน','ใช้แข่งขันกัน','ไม่มีบทบาท'], correct:0, explain:'ดนตรีไทยใช้ประกอบพิธีเพื่อสร้างบรรยากาศและความศักดิ์สิทธิ์', tier:2},
      {q:'"ปี่พาทย์ไม้แข็ง" กับ "ปี่พาทย์ไม้นวม" ต่างกันอย่างไร?', emoji:'🥢', choices:['ชนิดไม้ตีระนาดทำให้เสียงต่างกัน','จำนวนคนเล่น','สีของเครื่องดนตรี','ราคาเครื่องดนตรี'], correct:0, explain:'ไม้แข็งให้เสียงกังวานดัง ไม้นวมให้เสียงนุ่มนวลกว่า', tier:3},
      {q:'"ซออู้" ให้เสียงต่างจาก "ซอด้วง" อย่างไร?', emoji:'🎻', choices:['ซออู้เสียงทุ้มนุ่ม ซอด้วงเสียงแหลมกว่า','ซออู้เสียงแหลมกว่า','เสียงเหมือนกันทุกอย่าง','ซออู้ไม่มีเสียง'], correct:0, explain:'ซออู้กระบอกใหญ่ให้เสียงทุ้ม ส่วนซอด้วงกระบอกเล็กให้เสียงแหลมสูง', tier:3},
      {q:'การฟังเพลงอย่างมีมารยาทควรทำอย่างไรในการแสดงดนตรี?', emoji:'👏', choices:['ตั้งใจฟังและปรบมือเมื่อจบเพลง','ส่งเสียงดังตลอดการแสดง','ลุกเดินไปมา','เปิดเพลงอื่นแข่ง'], correct:0, explain:'ผู้ฟังที่ดีตั้งใจฟังอย่างสงบและปรบมือให้กำลังใจเมื่อจบการแสดง', tier:3},
      {q:'ดนตรีสามารถถ่ายทอดอารมณ์ได้อย่างไร?', emoji:'💫', choices:['ผ่านจังหวะ ทำนอง และความดัง-เบา','ผ่านสีของเครื่องดนตรี','ผ่านราคาเครื่องดนตรี','ผ่านจำนวนผู้ฟัง'], correct:0, explain:'จังหวะช้า-เร็ว ทำนองสูง-ต่ำ และความดัง-เบา ช่วยสื่ออารมณ์เพลง', tier:3}
    ]
  },
  {
    id:'p4-music2', name:'ดนตรี ป.4 · โน้ตสากลและจังหวะ', emoji:'🪈', icon:'assets/icons/p4-music2.svg', color:'#2F6BC4', light:'#DEEAFC', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'โน้ตสากล C ตรงกับโน้ตไทยตัวใด?', emoji:'🎼', choices:['โด','เร','มี','ฟา'], correct:0, explain:'C = โด', tier:1},
      {q:'โน้ตสากล G ตรงกับโน้ตไทยตัวใด?', emoji:'🎼', choices:['ซอล','ลา','ฟา','ที'], correct:0, explain:'G = ซอล', tier:1},
      {q:'บรรทัด 5 เส้นในการเขียนโน้ตสากลเรียกว่าอะไร?', emoji:'🎵', choices:['บรรทัดห้าเส้น (staff)','ตารางโน้ต','กราฟเสียง','ปฏิทินเพลง'], correct:0, explain:'โน้ตสากลเขียนบนบรรทัดห้าเส้น เรียกว่า staff', tier:1},
      {q:'เรียงโน้ตจากเสียงต่ำไปสูงข้อใดถูกต้อง?', emoji:'📈', choices:['โด เร มี ฟา ซอล','ซอล ฟา มี เร โด','มี โด ซอล เร','ที ลา ซอล ฟา'], correct:0, explain:'ลำดับเสียงจากต่ำไปสูงคือ โด เร มี ฟา ซอล ลา ที', tier:1},
      {q:'ตัวโน้ตที่มีความยาว 1 จังหวะ (ในอัตรา 4/4) คือตัวใด?', emoji:'♩', choices:['ตัวดำ','ตัวกลม','ตัวขาว','ตัวเขบ็ต 1 ชั้น'], correct:0, explain:'ตัวดำ (♩) ยาว 1 จังหวะ ตัวขาว 2 จังหวะ ตัวกลม 4 จังหวะ', tier:1},
      {q:'ตัวโน้ตตัวกลมมีความยาวกี่จังหวะ (อัตรา 4/4)?', emoji:'🎶', choices:['4 จังหวะ','2 จังหวะ','1 จังหวะ','ครึ่งจังหวะ'], correct:0, explain:'ตัวกลมยาว 4 จังหวะเต็มห้อง', tier:1},
      {q:'เครื่องหมาย "ตัวหยุด" ในโน้ตเพลงหมายถึงอะไร?', emoji:'🤫', choices:['ให้เงียบตามความยาวที่กำหนด','ให้เล่นดังขึ้น','ให้เล่นเร็วขึ้น','ให้จบเพลง'], correct:0, explain:'ตัวหยุดบอกให้หยุดเสียงตามความยาวจังหวะที่กำหนด', tier:1},
      {q:'อัตราจังหวะ 4/4 หมายถึงอะไร?', emoji:'🔢', choices:['หนึ่งห้องมี 4 จังหวะ ตัวดำเป็น 1 จังหวะ','เล่น 4 รอบ','มี 4 เครื่องดนตรี','เพลงยาว 4 นาที'], correct:0, explain:'เลขบน = จำนวนจังหวะต่อห้อง เลขล่าง = ตัวโน้ตที่นับเป็น 1 จังหวะ', tier:2},
      {q:'ตัวขาว 1 ตัว เท่ากับตัวดำกี่ตัว?', emoji:'🎹', choices:['2 ตัว','4 ตัว','1 ตัว','8 ตัว'], correct:0, explain:'ตัวขาว 2 จังหวะ ตัวดำ 1 จังหวะ จึงเท่ากับตัวดำ 2 ตัว', tier:2},
      {q:'ในห้องเพลงอัตรา 4/4 มีตัวดำ 2 ตัวแล้ว ต้องเติมตัวโน้ตยาวเท่าไรจึงครบห้อง?', emoji:'🧮', choices:['ตัวขาว 1 ตัว (2 จังหวะ)','ตัวกลม 1 ตัว','ตัวดำ 3 ตัว','ไม่ต้องเติม'], correct:0, explain:'2 จังหวะแล้ว ต้องเติมอีก 2 จังหวะ คือตัวขาว 1 ตัว', tier:2},
      {q:'เครื่องหมาย "#" (ชาร์ป) หน้าตัวโน้ตหมายถึงอะไร?', emoji:'🎼', choices:['ทำให้เสียงสูงขึ้นครึ่งเสียง','ทำให้เสียงต่ำลง','ให้เล่นดังขึ้น','ให้หยุดเล่น'], correct:0, explain:'ชาร์ปทำให้โน้ตนั้นสูงขึ้นครึ่งเสียง', tier:2},
      {q:'เครื่องหมาย "♭" (แฟลต) หมายถึงอะไร?', emoji:'🎵', choices:['ทำให้เสียงต่ำลงครึ่งเสียง','ทำให้เสียงสูงขึ้น','เล่นเบาลง','เล่นเร็วขึ้น'], correct:0, explain:'แฟลตทำให้โน้ตนั้นต่ำลงครึ่งเสียง', tier:2},
      {q:'คำว่า "Tempo" ในดนตรีหมายถึงอะไร?', emoji:'⏱️', choices:['ความช้า-เร็วของเพลง','ความดัง-เบา','ชื่อเพลง','จำนวนผู้เล่น'], correct:0, explain:'Tempo คืออัตราความเร็วของจังหวะเพลง', tier:2},
      {q:'สัญลักษณ์ "f" (forte) ในโน้ตเพลงหมายถึงอะไร?', emoji:'🔊', choices:['เล่นดัง','เล่นเบา','เล่นเร็ว','เล่นช้า'], correct:0, explain:'forte (f) = เล่นดัง ส่วน piano (p) = เล่นเบา', tier:2},
      {q:'ในเปียโน คีย์ขาวถัดจากโดไปทางขวาคือโน้ตใด?', emoji:'🎹', choices:['เร','ที','ลา','ซอล'], correct:0, explain:'ลำดับคีย์ขาวคือ โด เร มี ฟา ซอล ลา ที', tier:2},
      {q:'ถ้าเพลงมีเครื่องหมายซ้ำ (repeat) หมายถึงอะไร?', emoji:'🔁', choices:['ให้เล่นช่วงนั้นซ้ำอีกครั้ง','ให้จบเพลง','ให้เล่นเบาลง','ให้เปลี่ยนเพลง'], correct:0, explain:'เครื่องหมายซ้ำบอกให้กลับไปเล่นช่วงเดิมอีกรอบ', tier:2},
      {q:'โน้ตเขบ็ต 1 ชั้น (♪) ยาวกี่จังหวะ?', emoji:'🎶', choices:['ครึ่งจังหวะ','1 จังหวะ','2 จังหวะ','4 จังหวะ'], correct:0, explain:'เขบ็ต 1 ชั้นยาวครึ่งจังหวะ (ครึ่งหนึ่งของตัวดำ)', tier:3},
      {q:'อัตราจังหวะ 3/4 มักใช้กับเพลงประเภทใด?', emoji:'💃', choices:['เพลงวอลซ์ (จังหวะสามช่า)','เพลงมาร์ช','เพลงแร็ป','เพลงกล่อมเด็กเท่านั้น'], correct:0, explain:'3/4 คือหนึ่งห้องมี 3 จังหวะ เป็นจังหวะของเพลงวอลซ์', tier:3},
      {q:'"กุญแจซอล (Treble clef)" ใช้กับเสียงระดับใด?', emoji:'🎼', choices:['เสียงสูง','เสียงต่ำ','ไม่เกี่ยวกับระดับเสียง','เฉพาะกลอง'], correct:0, explain:'กุญแจซอลใช้บันทึกโน้ตในช่วงเสียงสูง', tier:3},
      {q:'ถ้าเพลงเดิมเล่นด้วย tempo ที่เร็วขึ้นมาก อารมณ์เพลงจะเปลี่ยนอย่างไร?', emoji:'⚡', choices:['ตื่นเต้นเร้าใจขึ้น','เศร้าลง','เงียบลง','ไม่เปลี่ยนเลย'], correct:0, explain:'จังหวะเร็วทำให้เพลงรู้สึกตื่นเต้นและมีพลังมากขึ้น', tier:3}
    ]
  },
  /* ---------- ศิลปะ ป.4 (ทัศนธาตุ-วรรณะสี / งานทัศนศิลป์และศิลปะไทย) ---------- */
  {
    id:'p4-art1', name:'ศิลปะ ป.4 · ทัศนธาตุและวรรณะสี', emoji:'🎬', icon:'assets/icons/p4-art1.svg', color:'#FF7A45', light:'#FFE4D6', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'"ทัศนธาตุ" หมายถึงอะไร?', emoji:'🎨', choices:['ส่วนประกอบพื้นฐานของงานศิลปะ เช่น จุด เส้น สี','ชื่อสีชนิดหนึ่ง','เครื่องมือวาดภาพ','ชื่อจิตรกร'], correct:0, explain:'ทัศนธาตุคือองค์ประกอบพื้นฐาน เช่น จุด เส้น รูปร่าง สี พื้นผิว น้ำหนัก และพื้นที่ว่าง', tier:1},
      {q:'สีในกลุ่ม "วรรณะร้อน" คือกลุ่มใด?', emoji:'🔥', choices:['แดง ส้ม เหลือง','ฟ้า น้ำเงิน เขียว','ดำ ขาว เทา','ม่วง คราม น้ำเงิน'], correct:0, explain:'สีวรรณะร้อนได้แก่ แดง ส้ม เหลือง ให้ความรู้สึกอบอุ่นตื่นเต้น', tier:1},
      {q:'สีในกลุ่ม "วรรณะเย็น" คือกลุ่มใด?', emoji:'❄️', choices:['เขียว ฟ้า น้ำเงิน','แดง ส้ม เหลือง','น้ำตาล ครีม ทอง','ชมพู แดง ส้ม'], correct:0, explain:'สีวรรณะเย็นได้แก่ เขียว ฟ้า น้ำเงิน ม่วง ให้ความรู้สึกสงบเย็นสบาย', tier:1},
      {q:'สีคู่ตรงข้ามของสีเหลืองในวงจรสีคือสีใด?', emoji:'🟣', choices:['สีม่วง','สีเขียว','สีส้ม','สีแดง'], correct:0, explain:'ในวงจรสี สีเหลืองอยู่ตรงข้ามกับสีม่วง', tier:1},
      {q:'"น้ำหนักของสี" (อ่อน-เข้ม) ช่วยให้ภาพเป็นอย่างไร?', emoji:'🌗', choices:['ดูมีมิติ ตื้น-ลึก','ดูแบนราบ','ดูเล็กลง','ไม่มีผล'], correct:0, explain:'การไล่น้ำหนักอ่อน-เข้มทำให้ภาพดูมีมิติและปริมาตร', tier:1},
      {q:'สีขั้นที่ 2 (สีขั้นกลาง) เกิดจากอะไร?', emoji:'🎨', choices:['ผสมแม่สี 2 สีเข้าด้วยกัน','ผสมสีขาว','ผสมสีดำ','ไม่ผสมอะไรเลย'], correct:0, explain:'สีส้ม เขียว ม่วง เกิดจากการผสมแม่สี 2 สี', tier:1},
      {q:'การจัดวางภาพให้สองข้างเท่ากันเรียกว่าอะไร?', emoji:'⚖️', choices:['สมดุลแบบสมมาตร','จุดเด่น','ลวดลาย','พื้นผิว'], correct:0, explain:'สองข้างเหมือนกันเป็นสมดุลแบบสมมาตร', tier:1},
      {q:'"พื้นผิว" (texture) ในงานศิลปะหมายถึงอะไร?', emoji:'🪵', choices:['ลักษณะผิวของวัตถุ เช่น เรียบ ขรุขระ','สีของวัตถุ','ขนาดของวัตถุ','ราคาของวัตถุ'], correct:0, explain:'พื้นผิวคือความรู้สึกของผิววัตถุ เช่น เรียบ หยาบ นุ่ม แข็ง', tier:1},
      {q:'ถ้าอยากให้ภาพดูโดดเด่นตรงกลาง ควรทำอย่างไร?', emoji:'🎯', choices:['ใช้สีตัดกันหรือขนาดต่างจากส่วนอื่น','ระบายสีเดียวทั้งภาพ','ทำทุกส่วนให้เหมือนกัน','ปล่อยให้ว่างทั้งภาพ'], correct:0, explain:'ความต่างของสีหรือขนาดจะดึงสายตาให้เกิดจุดเด่น', tier:2},
      {q:'สีที่อยู่ติดกันในวงจรสี เมื่อใช้ร่วมกันจะให้ความรู้สึกอย่างไร?', emoji:'🌈', choices:['กลมกลืนสบายตา','ตัดกันรุนแรง','มืดลง','ไม่เห็นสี'], correct:0, explain:'สีข้างเคียงกันในวงจรสีเรียกว่าสีกลมกลืน ให้ความรู้สึกนุ่มนวลสบายตา', tier:2},
      {q:'ภาพวาดที่แสดงทิวทัศน์ธรรมชาติ เช่น ภูเขา ทะเล เรียกว่าภาพประเภทใด?', emoji:'🏞️', choices:['ภาพทิวทัศน์','ภาพเหมือนบุคคล','ภาพหุ่นนิ่ง','ภาพนามธรรม'], correct:0, explain:'ภาพทิวทัศน์ (landscape) แสดงธรรมชาติหรือสถานที่', tier:2},
      {q:'ภาพวาดผลไม้ แจกัน ที่จัดวางไว้นิ่งๆ เรียกว่าภาพประเภทใด?', emoji:'🍎', choices:['ภาพหุ่นนิ่ง','ภาพทิวทัศน์','ภาพเหมือน','ภาพการ์ตูน'], correct:0, explain:'ภาพหุ่นนิ่ง (still life) วาดจากวัตถุที่จัดวางไว้', tier:2},
      {q:'การวาดภาพให้เห็นระยะใกล้-ไกลใช้หลักการใด?', emoji:'📐', choices:['ของใกล้ใหญ่และชัด ของไกลเล็กและจาง','วาดทุกอย่างเท่ากัน','วาดของไกลใหญ่กว่า','ระบายสีเดียวหมด'], correct:0, explain:'หลักทัศนียภาพ (perspective) ทำให้ภาพมีระยะใกล้-ไกล', tier:2},
      {q:'สีเอกรงค์ (monochrome) หมายถึงอะไร?', emoji:'🖤', choices:['ใช้สีเดียวไล่อ่อน-เข้ม','ใช้ทุกสีในวงจรสี','ใช้สีตรงข้ามเท่านั้น','ไม่ใช้สีเลย'], correct:0, explain:'เอกรงค์คือใช้สีเดียวแต่ไล่ระดับความอ่อน-เข้ม', tier:2},
      {q:'ลายไทย เช่น ลายกนก มักพบในงานศิลปะประเภทใด?', emoji:'🛕', choices:['จิตรกรรมฝาผนังและงานประณีตศิลป์ไทย','ภาพถ่ายสมัยใหม่','ภาพการ์ตูนญี่ปุ่น','ภาพกราฟิกคอมพิวเตอร์เท่านั้น'], correct:0, explain:'ลายกนกเป็นลายไทยที่พบในจิตรกรรมฝาผนังและงานประณีตศิลป์', tier:2},
      {q:'การใช้สีวรรณะเย็นทั้งภาพจะให้ความรู้สึกอย่างไร?', emoji:'🌊', choices:['สงบ เย็นสบาย','ร้อนแรง ตื่นเต้น','สับสนวุ่นวาย','โกรธ'], correct:0, explain:'สีวรรณะเย็นให้ความรู้สึกสงบ ผ่อนคลาย', tier:2},
      {q:'"จุด" ในทัศนธาตุ เมื่อนำมาเรียงต่อกันจะเกิดสิ่งใด?', emoji:'⚫', choices:['เส้น','สี','เสียง','กลิ่น'], correct:0, explain:'จุดหลายจุดเรียงต่อกันทำให้เกิดเส้น', tier:3},
      {q:'ภาพที่ไม่แสดงรูปทรงของจริง แต่ใช้สีและเส้นสื่ออารมณ์ เรียกว่าภาพประเภทใด?', emoji:'🌀', choices:['ภาพนามธรรม','ภาพเหมือน','ภาพทิวทัศน์','ภาพหุ่นนิ่ง'], correct:0, explain:'ภาพนามธรรม (abstract) ใช้เส้น สี รูปทรง สื่ออารมณ์โดยไม่วาดของจริง', tier:3},
      {q:'ศิลปินไทยผู้สร้างสรรค์งานจิตรกรรมไทยร่วมสมัยที่มีชื่อเสียงคือใคร?', emoji:'🖼️', choices:['เฉลิมชัย โฆษิตพิพัฒน์','ลีโอนาร์โด ดา วินชี','แวนโก๊ะ','ปิกัสโซ'], correct:0, explain:'เฉลิมชัย โฆษิตพิพัฒน์ เป็นศิลปินไทยผู้สร้างวัดร่องขุ่นและงานจิตรกรรมไทยร่วมสมัย', tier:3},
      {q:'การใช้สีคู่ตรงข้ามในภาพเดียวกันควรทำอย่างไรจึงจะสวย?', emoji:'🎨', choices:['ใช้สีหนึ่งเป็นหลักและอีกสีเป็นจุดเน้นเล็กๆ','ใช้ปริมาณเท่ากันทั้งภาพ','ใช้สลับกันทุกตาราง','ไม่ควรใช้เลย'], correct:0, explain:'ให้สีหนึ่งเป็นสีหลักและใช้สีตรงข้ามเป็นจุดเน้น จะทำให้ภาพเด่นโดยไม่ขัดตา', tier:3}
    ]
  },
  {
    id:'p4-art2', name:'ศิลปะ ป.4 · งานสร้างสรรค์และศิลปะพื้นบ้าน', emoji:'🪡', icon:'assets/icons/p4-art2.svg', color:'#D9542F', light:'#FFE4D6', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'งานปั้นดินเผาเป็นงานศิลปะประเภทใด?', emoji:'🏺', choices:['ประติมากรรม (3 มิติ)','จิตรกรรม','ภาพพิมพ์','ดนตรี'], correct:0, explain:'งานปั้นเป็นงานประติมากรรมมี 3 มิติ (กว้าง ยาว หนา)', tier:1},
      {q:'"จิตรกรรม" หมายถึงงานประเภทใด?', emoji:'🖌️', choices:['งานวาดและระบายสี','งานปั้น','งานแกะสลัก','งานทอผ้า'], correct:0, explain:'จิตรกรรมคืองานวาดเส้นและระบายสีบนพื้นระนาบ', tier:1},
      {q:'ผ้าไหมมัดหมี่เป็นงานศิลปะพื้นบ้านของภาคใด?', emoji:'🧵', choices:['ภาคตะวันออกเฉียงเหนือ','ภาคใต้','ภาคตะวันออก','ภาคกลาง'], correct:0, explain:'ผ้าไหมมัดหมี่เป็นงานหัตถกรรมเด่นของภาคอีสาน', tier:1},
      {q:'"ภาพพิมพ์" เกิดจากวิธีการใด?', emoji:'🖨️', choices:['สร้างแม่พิมพ์แล้วกดพิมพ์ลงบนวัสดุ','ปั้นด้วยมือ','วาดด้วยดินสอโดยตรง','ถ่ายรูป'], correct:0, explain:'ภาพพิมพ์คือการทำแม่พิมพ์แล้วกดถ่ายทอดภาพลงบนกระดาษหรือผ้า', tier:1},
      {q:'เครื่องจักสานทำจากวัสดุใดเป็นหลัก?', emoji:'🧺', choices:['ไม้ไผ่และหวาย','เหล็ก','พลาสติกใส','แก้ว'], correct:0, explain:'เครื่องจักสานไทยนิยมใช้ไม้ไผ่ หวาย และใบลาน', tier:1},
      {q:'"หัวโขน" เป็นงานศิลปะที่ใช้ในการแสดงประเภทใด?', emoji:'🎭', choices:['โขน','ลิเก','หมอลำ','ละครเวทีสากล'], correct:0, explain:'หัวโขนใช้สวมในการแสดงโขน ซึ่งเป็นนาฏศิลป์ชั้นสูงของไทย', tier:1},
      {q:'ก่อนลงมือทำงานศิลปะ ควรทำสิ่งใดก่อน?', emoji:'📝', choices:['วางแผนและร่างภาพคร่าวๆ','ระบายสีเลย','ทิ้งไว้ก่อน','ลอกงานเพื่อน'], correct:0, explain:'การร่างและวางแผนช่วยให้งานออกมาตรงตามที่คิด', tier:1},
      {q:'"งานปะติด (collage)" ใช้เทคนิคใด?', emoji:'✂️', choices:['ตัดวัสดุหลายชนิดมาติดประกอบเป็นภาพ','ปั้นดิน','เป่าแก้ว','สลักไม้'], correct:0, explain:'งานปะติดคือการตัดกระดาษหรือวัสดุมาติดประกอบกันเป็นภาพ', tier:2},
      {q:'การนำวัสดุเหลือใช้มาสร้างงานศิลปะมีข้อดีอย่างไร?', emoji:'♻️', choices:['ประหยัดและช่วยลดขยะ','สิ้นเปลืองกว่าเดิม','ทำให้งานเสียหาย','ไม่มีข้อดี'], correct:0, explain:'ช่วยลดขยะ ประหยัดค่าใช้จ่าย และฝึกความคิดสร้างสรรค์', tier:2},
      {q:'ร่มบ่อสร้างเป็นงานหัตถกรรมของจังหวัดใด?', emoji:'☂️', choices:['เชียงใหม่','ภูเก็ต','ขอนแก่น','ชลบุรี'], correct:0, explain:'ร่มบ่อสร้างเป็นงานหัตถกรรมขึ้นชื่อของอำเภอสันกำแพง จังหวัดเชียงใหม่', tier:2},
      {q:'เบญจรงค์เป็นงานศิลปะประเภทใด?', emoji:'🫖', choices:['เครื่องเคลือบดินเผาลายห้าสี','ผ้าทอมือ','งานแกะสลักไม้','ภาพวาดสีน้ำ'], correct:0, explain:'เบญจรงค์คือเครื่องถ้วยเคลือบเขียนลายด้วยสีหลัก 5 สี', tier:2},
      {q:'การแกะสลักผักผลไม้เป็นงานศิลปะไทยประเภทใด?', emoji:'🥕', choices:['งานประณีตศิลป์','งานภาพพิมพ์','งานสถาปัตยกรรม','งานดนตรี'], correct:0, explain:'การแกะสลักผักผลไม้เป็นงานประณีตศิลป์ที่ต้องใช้ความละเอียดอ่อน', tier:2},
      {q:'ถ้าต้องการทำงานศิลปะให้คงทน ควรเลือกวัสดุอย่างไร?', emoji:'🧰', choices:['เลือกวัสดุที่แข็งแรงเหมาะกับงาน','เลือกที่ถูกที่สุดเสมอ','เลือกที่บางที่สุด','ไม่ต้องเลือก'], correct:0, explain:'ควรเลือกวัสดุให้เหมาะกับลักษณะงานและความคงทนที่ต้องการ', tier:2},
      {q:'ในการทำงานกลุ่มด้านศิลปะ สิ่งใดสำคัญที่สุด?', emoji:'🤝', choices:['แบ่งหน้าที่และรับฟังความคิดเห็นกัน','ทำคนเดียวทั้งหมด','แข่งกันทำ','ไม่ต้องคุยกัน'], correct:0, explain:'งานกลุ่มต้องแบ่งงานและรับฟังความคิดเห็นซึ่งกันและกัน', tier:2},
      {q:'จิตรกรรมฝาผนังไทยมักเล่าเรื่องเกี่ยวกับอะไร?', emoji:'🛕', choices:['พุทธประวัติและวรรณคดี','การ์ตูนสมัยใหม่','โฆษณาสินค้า','สูตรอาหาร'], correct:0, explain:'จิตรกรรมฝาผนังตามวัดมักเล่าพุทธประวัติ ชาดก และวรรณคดีไทย', tier:2},
      {q:'ศิลปะ "โมบาย" ที่แขวนหมุนได้ เน้นเรื่องใดเป็นพิเศษ?', emoji:'🎐', choices:['ความสมดุลของน้ำหนัก','ความหนาของสี','เสียงดัง','กลิ่นหอม'], correct:0, explain:'โมบายต้องจัดน้ำหนักสองข้างให้สมดุลจึงจะแขวนสวย', tier:2},
      {q:'ทำไมงานหัตถกรรมพื้นบ้านจึงควรได้รับการอนุรักษ์?', emoji:'🏛️', choices:['เป็นภูมิปัญญาและเอกลักษณ์ของท้องถิ่น','เพราะทำง่าย','เพราะราคาถูก','เพราะไม่มีใครทำ'], correct:0, explain:'งานหัตถกรรมสะท้อนภูมิปัญญาและเอกลักษณ์ทางวัฒนธรรมที่ควรสืบทอด', tier:3},
      {q:'"ศิลปะสื่อผสม" หมายถึงอะไร?', emoji:'🎨', choices:['ผลงานที่ใช้วัสดุและเทคนิคหลายอย่างร่วมกัน','ใช้สีเดียว','ใช้กระดาษเท่านั้น','ใช้ดินสออย่างเดียว'], correct:0, explain:'สื่อผสม (mixed media) คือใช้วัสดุ/เทคนิคหลายชนิดในงานชิ้นเดียว', tier:3},
      {q:'การวิจารณ์งานศิลปะอย่างสร้างสรรค์ควรทำอย่างไร?', emoji:'💬', choices:['ชมจุดเด่นและเสนอแนะจุดที่พัฒนาได้อย่างสุภาพ','บอกว่าไม่สวยอย่างเดียว','ไม่พูดอะไรเลย','ล้อเลียนผลงาน'], correct:0, explain:'การวิจารณ์ที่ดีคือชี้จุดเด่นและให้ข้อเสนอแนะอย่างสร้างสรรค์', tier:3},
      {q:'ถ้าจะจัดนิทรรศการผลงานศิลปะในห้องเรียน สิ่งใดควรคำนึงถึง?', emoji:'🖼️', choices:['การจัดวางให้ผู้ชมเดินดูได้สะดวกและมองเห็นชัด','ติดผลงานซ้อนกันให้ประหยัดที่','ปิดไฟให้มืด','วางกองไว้บนพื้น'], correct:0, explain:'การจัดแสดงต้องคำนึงถึงระยะการมอง แสงสว่าง และทางเดินของผู้ชม', tier:3}
    ]
  },
  /* ---------- ธรรมชาติ ป.4 (ทรัพยากร-สิ่งแวดล้อม / ระบบสุริยะและปรากฏการณ์ท้องฟ้า) ---------- */
  {
    id:'p4-nature1', name:'ธรรมชาติ ป.4 · ทรัพยากรและระบบนิเวศ', emoji:'🍀', icon:'assets/icons/p4-nature1.svg', color:'#6FBF3B', light:'#E6F6D8', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'ทรัพยากรใดจัดเป็น "ทรัพยากรที่ใช้แล้วหมดไป"?', emoji:'⛽', choices:['น้ำมันปิโตรเลียม','แสงแดด','ลม','น้ำในวัฏจักร'], correct:0, explain:'น้ำมัน ถ่านหิน แร่ธาตุ ใช้แล้วหมดไป ต่างจากแสงแดดและลมที่ใช้ไม่หมด', tier:1},
      {q:'"ระบบนิเวศ" หมายถึงอะไร?', emoji:'🌳', choices:['ความสัมพันธ์ของสิ่งมีชีวิตกับสิ่งแวดล้อม','ชื่อของป่าชนิดหนึ่ง','เครื่องมือวัดอากาศ','กลุ่มของสัตว์เท่านั้น'], correct:0, explain:'ระบบนิเวศคือความสัมพันธ์ระหว่างสิ่งมีชีวิตด้วยกันและกับสิ่งแวดล้อม', tier:1},
      {q:'ป่าไม้มีประโยชน์ต่อคนอย่างไร?', emoji:'🌲', choices:['ให้อากาศบริสุทธิ์ ต้นน้ำ และที่อยู่ของสัตว์','ทำให้โลกร้อนขึ้น','ทำให้ฝนไม่ตก','ทำให้ดินเสีย'], correct:0, explain:'ป่าไม้ผลิตออกซิเจน เป็นต้นน้ำ และเป็นที่อยู่ของสัตว์ป่า', tier:1},
      {q:'"3R" ในการลดขยะประกอบด้วยอะไรบ้าง?', emoji:'♻️', choices:['ลดใช้ ใช้ซ้ำ นำกลับมาใช้ใหม่','วิ่ง อ่าน เขียน','ดิน น้ำ ลม','แดง เขียว ฟ้า'], correct:0, explain:'Reduce (ลดใช้) Reuse (ใช้ซ้ำ) Recycle (แปรรูปใช้ใหม่)', tier:1},
      {q:'ขยะประเภทใดควรแยกไปทำ "ปุ๋ยหมัก"?', emoji:'🥬', choices:['เศษอาหารและใบไม้','ขวดแก้ว','ถ่านไฟฉาย','ถุงพลาสติก'], correct:0, explain:'ขยะอินทรีย์ย่อยสลายได้ นำไปทำปุ๋ยหมักได้', tier:1},
      {q:'ขยะประเภทใดเป็น "ขยะอันตราย" ที่ต้องแยกทิ้งเป็นพิเศษ?', emoji:'🔋', choices:['ถ่านไฟฉายและหลอดไฟ','กระดาษ','เศษผัก','ขวดน้ำพลาสติก'], correct:0, explain:'ถ่านไฟฉาย หลอดไฟ ยาหมดอายุ มีสารพิษ ต้องแยกทิ้งเฉพาะ', tier:1},
      {q:'พลังงานสะอาดจากดวงอาทิตย์เรียกว่าอะไร?', emoji:'☀️', choices:['พลังงานแสงอาทิตย์','พลังงานถ่านหิน','พลังงานนิวเคลียร์','พลังงานน้ำมัน'], correct:0, explain:'พลังงานแสงอาทิตย์เป็นพลังงานหมุนเวียนที่สะอาด', tier:1},
      {q:'การตัดไม้ทำลายป่าส่งผลอย่างไร?', emoji:'🪓', choices:['เกิดน้ำท่วม ดินถล่ม และสัตว์ไร้ที่อยู่','ฝนตกมากขึ้น','อากาศดีขึ้น','ดินอุดมสมบูรณ์ขึ้น'], correct:0, explain:'ไม่มีรากไม้ยึดดิน ทำให้ดินถล่ม น้ำท่วม และสัตว์สูญเสียที่อยู่', tier:1},
      {q:'"ภาวะโลกร้อน" มีสาเหตุหลักจากอะไร?', emoji:'🌡️', choices:['แก๊สเรือนกระจกจากการเผาไหม้เชื้อเพลิง','การปลูกต้นไม้','ฝนตกหนัก','ลมพัดแรง'], correct:0, explain:'คาร์บอนไดออกไซด์จากรถยนต์และโรงงานสะสมในบรรยากาศทำให้โลกร้อนขึ้น', tier:2},
      {q:'ป่าชายเลนมีความสำคัญอย่างไร?', emoji:'🌊', choices:['เป็นแหล่งอนุบาลสัตว์น้ำและช่วยลดความแรงคลื่น','ทำให้น้ำเค็มขึ้น','ทำให้ปลาหายไป','ไม่มีประโยชน์'], correct:0, explain:'ป่าชายเลนเป็นที่อนุบาลสัตว์น้ำวัยอ่อนและช่วยป้องกันการกัดเซาะชายฝั่ง', tier:2},
      {q:'น้ำเสียจากบ้านเรือนควรจัดการอย่างไรก่อนปล่อยลงแหล่งน้ำ?', emoji:'🚰', choices:['ผ่านการบำบัดก่อน','ปล่อยลงคลองเลย','เทลงดินโดยตรง','เก็บไว้ในบ้าน'], correct:0, explain:'ต้องบำบัดน้ำเสียก่อนปล่อย เพื่อไม่ให้แหล่งน้ำเน่าเสีย', tier:2},
      {q:'ปะการังฟอกขาวเกิดจากสาเหตุใดเป็นหลัก?', emoji:'🪸', choices:['น้ำทะเลอุ่นขึ้นผิดปกติ','น้ำทะเลเย็นลง','ปลาว่ายมากเกินไป','ฝนตกหนัก'], correct:0, explain:'อุณหภูมิน้ำทะเลที่สูงขึ้นทำให้สาหร่ายในปะการังหลุดออก ปะการังจึงฟอกขาว', tier:2},
      {q:'"สัตว์ป่าสงวน" ของไทย เช่น สมเสร็จ ควรได้รับการปฏิบัติอย่างไร?', emoji:'🦏', choices:['ห้ามล่าและช่วยกันอนุรักษ์ถิ่นที่อยู่','จับมาเลี้ยงในบ้าน','ล่าเพื่อขาย','ปล่อยในเมือง'], correct:0, explain:'สัตว์ป่าสงวนได้รับการคุ้มครองตามกฎหมาย ห้ามล่าและต้องรักษาถิ่นอาศัย', tier:2},
      {q:'การใช้ถุงผ้าแทนถุงพลาสติกช่วยเรื่องใดมากที่สุด?', emoji:'👜', choices:['ลดขยะพลาสติกที่ย่อยสลายยาก','ลดค่าไฟ','ทำให้ของหนักขึ้น','เพิ่มขยะ'], correct:0, explain:'ถุงพลาสติกใช้เวลาย่อยสลายหลายร้อยปี การใช้ถุงผ้าซ้ำได้จึงช่วยลดขยะ', tier:2},
      {q:'"มลพิษทางอากาศ" ในเมืองใหญ่มักมาจากอะไร?', emoji:'🏭', choices:['ควันรถยนต์และโรงงาน','กลิ่นดอกไม้','ไอน้ำจากทะเล','เสียงนกร้อง'], correct:0, explain:'ควันจากท่อไอเสียและโรงงานเป็นแหล่งมลพิษหลักในเมือง', tier:2},
      {q:'ฝุ่น PM2.5 เป็นอันตรายต่อระบบใดของร่างกายมากที่สุด?', emoji:'😷', choices:['ระบบทางเดินหายใจ','ระบบย่อยอาหาร','ระบบกระดูก','ระบบขับถ่าย'], correct:0, explain:'ฝุ่นขนาดเล็กเข้าสู่ปอดได้ลึก จึงกระทบระบบทางเดินหายใจ', tier:2},
      {q:'การปลูกป่าทดแทนช่วยแก้ปัญหาใด?', emoji:'🌱', choices:['ลดโลกร้อนและฟื้นฟูระบบนิเวศ','เพิ่มขยะ','ทำให้ดินเสีย','ทำให้แล้งขึ้น'], correct:0, explain:'ต้นไม้ดูดซับคาร์บอนไดออกไซด์และฟื้นฟูที่อยู่ของสัตว์', tier:2},
      {q:'"ห่วงโซ่อาหาร" ในทะเลจะเกิดอะไรขึ้นถ้าแพลงก์ตอนลดลงมาก?', emoji:'🐟', choices:['สัตว์น้ำที่กินแพลงก์ตอนลดลงตามไปด้วย','ปลาจะเพิ่มขึ้น','ไม่มีผลกระทบ','น้ำจะใสขึ้นและปลาเยอะขึ้น'], correct:0, explain:'แพลงก์ตอนเป็นฐานของห่วงโซ่อาหารในทะเล ถ้าลดลงสัตว์ลำดับถัดไปย่อมลดตาม', tier:3},
      {q:'"รอยเท้าคาร์บอน" (carbon footprint) หมายถึงอะไร?', emoji:'👣', choices:['ปริมาณแก๊สเรือนกระจกที่เกิดจากกิจกรรมของเรา','รอยเท้าบนดิน','ปริมาณขยะในบ้าน','จำนวนต้นไม้ที่ปลูก'], correct:0, explain:'คือปริมาณแก๊สเรือนกระจกที่ปล่อยออกมาจากกิจกรรมต่างๆ ของคนเรา', tier:3},
      {q:'พลังงานหมุนเวียนข้อใดไม่ถูกต้อง?', emoji:'⚡', choices:['ถ่านหิน','ลม','แสงอาทิตย์','น้ำ'], correct:0, explain:'ถ่านหินเป็นเชื้อเพลิงฟอสซิลที่ใช้แล้วหมดไป ไม่ใช่พลังงานหมุนเวียน', tier:3},
      {q:'ถ้าทุกบ้านลดการใช้ไฟฟ้าลง 10% จะส่งผลดีอย่างไรต่อสิ่งแวดล้อม?', emoji:'💡', choices:['ลดการเผาเชื้อเพลิงผลิตไฟฟ้าและลดแก๊สเรือนกระจก','ทำให้ไฟฟ้าแพงขึ้น','ทำให้โลกร้อนขึ้น','ไม่มีผลใดๆ'], correct:0, explain:'ไฟฟ้าส่วนใหญ่ผลิตจากเชื้อเพลิงฟอสซิล ใช้น้อยลงจึงลดการปล่อยแก๊สเรือนกระจก', tier:3}
    ]
  },
  {
    id:'p4-nature2', name:'ธรรมชาติ ป.4 · ระบบสุริยะและท้องฟ้า', emoji:'🪐', icon:'assets/icons/p4-nature2.svg', color:'#4F9E2F', light:'#E6F6D8', grade:'p4', poolPick:10, isNew:true,
    questions:[
      {q:'ระบบสุริยะมีดาวเคราะห์กี่ดวง?', emoji:'🪐', choices:['8 ดวง','9 ดวง','7 ดวง','12 ดวง'], correct:0, explain:'ปัจจุบันระบบสุริยะมีดาวเคราะห์ 8 ดวง (พลูโตถูกจัดเป็นดาวเคราะห์แคระ)', tier:1},
      {q:'ดาวเคราะห์ดวงใดอยู่ใกล้ดวงอาทิตย์ที่สุด?', emoji:'☀️', choices:['ดาวพุธ','โลก','ดาวศุกร์','ดาวอังคาร'], correct:0, explain:'ลำดับจากดวงอาทิตย์: พุธ ศุกร์ โลก อังคาร…', tier:1},
      {q:'โลกเป็นดาวเคราะห์ลำดับที่เท่าไรจากดวงอาทิตย์?', emoji:'🌍', choices:['ลำดับที่ 3','ลำดับที่ 1','ลำดับที่ 5','ลำดับที่ 2'], correct:0, explain:'พุธ (1) ศุกร์ (2) โลก (3)', tier:1},
      {q:'ดาวเคราะห์ดวงใดใหญ่ที่สุดในระบบสุริยะ?', emoji:'🟠', choices:['ดาวพฤหัสบดี','โลก','ดาวอังคาร','ดาวพุธ'], correct:0, explain:'ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุด', tier:1},
      {q:'ดาวเคราะห์ดวงใดมีวงแหวนสวยงามเห็นได้ชัด?', emoji:'💫', choices:['ดาวเสาร์','โลก','ดาวพุธ','ดาวศุกร์'], correct:0, explain:'ดาวเสาร์มีวงแหวนที่เห็นชัดเจนที่สุด', tier:1},
      {q:'ดวงอาทิตย์จัดเป็นดาวประเภทใด?', emoji:'⭐', choices:['ดาวฤกษ์','ดาวเคราะห์','ดาวบริวาร','ดาวหาง'], correct:0, explain:'ดวงอาทิตย์เป็นดาวฤกษ์ที่ส่องแสงได้ด้วยตัวเอง', tier:1},
      {q:'"ดาวบริวาร" ของโลกคือดวงใด?', emoji:'🌙', choices:['ดวงจันทร์','ดาวอังคาร','ดาวศุกร์','ดวงอาทิตย์'], correct:0, explain:'ดวงจันทร์เป็นดาวบริวารดวงเดียวของโลก', tier:1},
      {q:'โลกหมุนรอบตัวเอง 1 รอบใช้เวลาประมาณเท่าใด?', emoji:'🔄', choices:['24 ชั่วโมง','1 เดือน','1 ปี','7 วัน'], correct:0, explain:'โลกหมุนรอบตัวเอง 1 รอบ ≈ 24 ชั่วโมง ทำให้เกิดกลางวันกลางคืน', tier:1},
      {q:'โลกโคจรรอบดวงอาทิตย์ 1 รอบใช้เวลาประมาณเท่าใด?', emoji:'🗓️', choices:['1 ปี','1 เดือน','24 ชั่วโมง','10 ปี'], correct:0, explain:'โลกโคจรรอบดวงอาทิตย์ประมาณ 365 วัน = 1 ปี', tier:2},
      {q:'การเกิดฤดูกาลบนโลกเกิดจากอะไร?', emoji:'🍂', choices:['แกนโลกเอียงขณะโคจรรอบดวงอาทิตย์','ดวงอาทิตย์เคลื่อนที่','ดวงจันทร์บัง','เมฆหนา'], correct:0, explain:'แกนโลกเอียง 23.5 องศา ทำให้แต่ละซีกโลกได้รับแสงต่างกันตามช่วงปี', tier:2},
      {q:'"กลุ่มดาว" ที่คนไทยเรียกว่าดาวจระเข้ ตรงกับกลุ่มดาวสากลใด?', emoji:'✨', choices:['กลุ่มดาวหมีใหญ่','กลุ่มดาวนายพราน','กลุ่มดาวลูกไก่','กลุ่มดาวแมงป่อง'], correct:0, explain:'ดาวจระเข้ของไทยคือส่วนหนึ่งของกลุ่มดาวหมีใหญ่ (Big Dipper)', tier:2},
      {q:'ดาวเหนือมีประโยชน์อย่างไรกับคนสมัยก่อน?', emoji:'🌟', choices:['ใช้บอกทิศเหนือในการเดินทาง','ใช้บอกเวลาอาหาร','ใช้ทำนายฝน','ใช้นับเงิน'], correct:0, explain:'ดาวเหนืออยู่ตรงทิศเหนือเกือบตลอดเวลา จึงใช้นำทางได้', tier:2},
      {q:'ดาวตก (ผีพุ่งไต้) แท้จริงคืออะไร?', emoji:'☄️', choices:['สะเก็ดดาวเสียดสีกับบรรยากาศจนลุกไหม้','ดาวฤกษ์ตกลงมา','ดาวเคราะห์ระเบิด','เครื่องบิน'], correct:0, explain:'สะเก็ดดาวขนาดเล็กพุ่งเข้าสู่บรรยากาศโลกแล้วเสียดสีจนลุกไหม้เป็นแสง', tier:2},
      {q:'ทำไมเราจึงมองไม่เห็นดาวในเวลากลางวัน?', emoji:'🌞', choices:['แสงอาทิตย์สว่างกลบแสงดาว','ดาวหายไปตอนกลางวัน','ดาวดับตอนกลางวัน','เมฆบังทุกวัน'], correct:0, explain:'ดาวยังอยู่แต่แสงอาทิตย์สว่างมากจนกลบแสงดาว', tier:2},
      {q:'ดาวเคราะห์ดวงใดถูกเรียกว่า "ดาวเคราะห์แดง"?', emoji:'🔴', choices:['ดาวอังคาร','ดาวศุกร์','ดาวพุธ','ดาวเนปจูน'], correct:0, explain:'ดาวอังคารมีพื้นผิวสีแดงจากสนิมเหล็ก จึงเรียกว่าดาวเคราะห์แดง', tier:2},
      {q:'กล้องโทรทรรศน์ใช้ประโยชน์อย่างไร?', emoji:'🔭', choices:['ส่องดูวัตถุท้องฟ้าที่อยู่ไกลให้เห็นชัดขึ้น','ดูสิ่งเล็กมากๆ','วัดอุณหภูมิ','ฟังเสียงดาว'], correct:0, explain:'กล้องโทรทรรศน์ช่วยรวมแสงทำให้เห็นดาวและดวงจันทร์ชัดขึ้น', tier:2},
      {q:'"ดาวเคราะห์" ต่างจาก "ดาวฤกษ์" อย่างไร?', emoji:'🌌', choices:['ดาวเคราะห์ไม่มีแสงในตัวเอง ต้องสะท้อนแสงดาวฤกษ์','ดาวเคราะห์ร้อนกว่า','ดาวฤกษ์เล็กกว่าเสมอ','ไม่ต่างกัน'], correct:0, explain:'ดาวฤกษ์ผลิตแสงเอง ส่วนดาวเคราะห์สะท้อนแสงจากดาวฤกษ์', tier:2},
      {q:'ทำไมดาวพฤหัสบดีจึงไม่มีพื้นผิวแข็งให้ยืนได้?', emoji:'🌀', choices:['เป็นดาวเคราะห์แก๊สขนาดใหญ่','อยู่ไกลเกินไป','ร้อนเกินไป','เล็กเกินไป'], correct:0, explain:'ดาวพฤหัสบดีเป็นดาวเคราะห์แก๊ส ประกอบด้วยไฮโดรเจนและฮีเลียมเป็นหลัก', tier:3},
      {q:'หนึ่งปีบนดาวอังคารยาวกว่าหนึ่งปีบนโลกเพราะอะไร?', emoji:'🚀', choices:['วงโคจรอยู่ไกลดวงอาทิตย์กว่าโลก','หมุนช้ากว่า','ใหญ่กว่าโลก','มีดวงจันทร์ 2 ดวง'], correct:0, explain:'ดาวอังคารอยู่ไกลกว่า วงโคจรยาวกว่า จึงใช้เวลาโคจรรอบดวงอาทิตย์นานกว่า', tier:3},
      {q:'"ทางช้างเผือก" คืออะไร?', emoji:'🌌', choices:['กาแล็กซีที่ระบบสุริยะของเราอยู่','ดาวฤกษ์ดวงหนึ่ง','เมฆบนท้องฟ้า','ดาวหางขนาดใหญ่'], correct:0, explain:'ทางช้างเผือกคือกาแล็กซีที่มีดาวฤกษ์นับแสนล้านดวง รวมถึงดวงอาทิตย์ของเรา', tier:3},
      {q:'ถ้าโลกไม่มีชั้นบรรยากาศ จะเกิดอะไรขึ้น?', emoji:'🌡️', choices:['ไม่มีอากาศหายใจและอุณหภูมิเปลี่ยนรุนแรงมาก','ฝนตกมากขึ้น','ต้นไม้โตเร็วขึ้น','ไม่มีอะไรเปลี่ยน'], correct:0, explain:'บรรยากาศให้อากาศหายใจ กรองรังสี และช่วยรักษาอุณหภูมิให้พอเหมาะ', tier:3}
    ]
  },
  /* ---------- เกมโต้ตอบ AR ป.4 (ใช้ engine เดิม — ประโยคยาว 5-7 คำ / คิดเลขคูณ-หารเลขใหญ่) ---------- */
  {
    id:'p4-math-ar', name:'คิดเลขเร็ว ป.4', emoji:'⚡', icon:'assets/icons/p4-math-ar.svg', color:'#5E3FE0', light:'#E9E3FF',
    type:'ar', mode:'math', levels:10, mathTiers:[[2,9],[3,12],[6,15]], mathOps:['×','÷'], mathChoices:4, grade:'p4', isNew:true
  },
  {
    id:'p4-thai-sentence', name:'ภาษาไทย ป.4 · ต่อประโยคซับซ้อน', emoji:'🪶', icon:'assets/icons/p4-thai-sentence.svg', color:'#D63D8C', light:'#FCE0EF',
    type:'ar', lang:'th', sentenceLens:[5,6,7], levels:10, grade:'p4', isNew:true
  },
  {
    id:'p4-eng-sentence', name:'English ป.4 · Build Long Sentences', emoji:'✒️', icon:'assets/icons/p4-eng-sentence.svg', color:'#0A7A75', light:'#D5F5F2',
    type:'ar', lang:'en', sentenceLens:[5,6,7], levels:10, grade:'p4', isNew:true
  },
  {
    id:'p4-eng-match', name:'English ป.4 · โยงเส้นคำศัพท์', emoji:'🗃️', icon:'assets/icons/p4-eng-match.svg', color:'#0A8F89', light:'#D5F5F2',
    type:'ar', mode:'match', lang:'en', matchSet:'enAdv', levels:10, grade:'p4', isNew:true
  },

  /* ---------- เกมฟังคำศัพท์ ป.4 (ใช้ listen engine เดิม ไม่มีตัวช่วยเฉลย) ---------- */
  {
    id:'p4-listen-en', name:'ฟังคำอังกฤษ ป.4', emoji:'🎚️', icon:'assets/icons/p4-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', wordLens:[5,6,7], levels:10, grade:'p4', isNew:true
  },
  {
    id:'p4-listen-th', name:'ฟังสะกดคำไทย ป.4', emoji:'🔉', icon:'assets/icons/p4-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[5,6,7], levels:10, grade:'p4', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.4 — ประโยคไทยยาว 7-8 คำ 2 ช่องว่างตั้งแต่ด่านกลาง */
    id:'p4-cloze1', name:'ฟังประโยคเติมคำ ป.4 · 1', emoji:'🔔', icon:'assets/icons/p4-cloze1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en5', clozeBlanks:[1,2,2], clozeDecoys:[4,4,5], levels:10, grade:'p4', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.4 — ประโยคอังกฤษยาว มี tense/คำเชื่อม */
    id:'p4-cloze2', name:'ฟังประโยคเติมคำ ป.4 · 2', emoji:'✉️', icon:'assets/icons/p4-cloze2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en5', clozeBlanks:[2,2,2], clozeDecoys:[4,5,5], levels:10, grade:'p4', isNew:true
  },

  /* ---------- เกมฝึกทักษะ ป.4 (reuse engine เดิม — เปิดโหมดเล่นด้วยมือหน้ากล้องทุกเกมที่เป็นกลไกแตะ) ---------- */
  { id:'p4-fraction', name:'เศษส่วน-ทศนิยม ป.4', emoji:'🍰', icon:'assets/icons/p4-fraction.svg', color:'#E1503A', light:'#FBDBD4', type:'skill', mode:'fraction', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-money', name:'ร้านค้าใหญ่ ป.4', emoji:'💵', icon:'assets/icons/p4-money.svg', color:'#D98E2B', light:'#FBEBCB', type:'skill', mode:'money', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-balance', name:'ตาชั่งมวลและน้ำหนัก', emoji:'⚙️', icon:'assets/icons/p4-balance.svg', color:'#7C8CFF', light:'#E4E8FF', type:'skill', mode:'balance', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-memory', name:'จับคู่โดมิโน ป.4', emoji:'🎴', icon:'assets/icons/p4-memory.svg', color:'#E0764C', light:'#FBE3D4', type:'skill', mode:'memory', levels:3, memoryPairs:[8,12,16], handPlay:true, grade:'p4', isNew:true },
  { id:'p4-timeline', name:'เส้นเวลาประวัติศาสตร์ไทย', emoji:'⌛', icon:'assets/icons/p4-timeline.svg', color:'#B07A2E', light:'#F5E7CE', type:'skill', mode:'timeline', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-coord', name:'อ่านพิกัดแผนที่ ป.4', emoji:'🗼', icon:'assets/icons/p4-coord.svg', color:'#C77D2E', light:'#F6E7CF', type:'skill', mode:'coord', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-world', name:'โลกหมุนและฤดูกาล', emoji:'🌏', icon:'assets/icons/p4-world.svg', color:'#2E86C1', light:'#D6EAF8', type:'skill', mode:'world', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-ef', name:'เชาวน์ ป.4 · นกฮูกสั่ง', emoji:'🦚', icon:'assets/icons/p4-ef.svg', color:'#17A65B', light:'#D6F3E4', type:'skill', mode:'ef', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-vertsort', name:'แยกสัตว์มี-ไม่มีกระดูกสันหลัง', emoji:'🦴', icon:'assets/icons/p4-vertsort.svg', color:'#2FA36B', light:'#D9F2E4', type:'skill', mode:'sort', sortSet:'vertebrate', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-wordsort', name:'แยกชนิดของคำไทย', emoji:'📒', icon:'assets/icons/p4-wordsort.svg', color:'#E14E9A', light:'#FCE0EF', type:'skill', mode:'sort', sortSet:'thaiword', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-anglesort', name:'แยกชนิดของมุม', emoji:'📏', icon:'assets/icons/p4-anglesort.svg', color:'#6A4FE0', light:'#E7E2FC', type:'skill', mode:'sort', sortSet:'angletype', levels:10, handPlay:true, grade:'p4', isNew:true },

  /* ---------- mechanic ใหม่ของ ป.4 (engine ใหม่ 3 แบบ ตรงตัวชี้วัด ค 2.1 / ค 3.1) ---------- */
  { id:'p4-chart', name:'อ่านแผนภูมิแท่ง', emoji:'📊', icon:'assets/icons/p4-chart.svg', color:'#2F8FD6', light:'#D7ECFA', type:'skill', mode:'chart', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-area', name:'พื้นที่ตารางหน่วย', emoji:'🔶', icon:'assets/icons/p4-area.svg', color:'#E0904C', light:'#FBE7D4', type:'skill', mode:'area', levels:10, handPlay:true, grade:'p4', isNew:true },
  { id:'p4-angle', name:'มุมมหัศจรรย์', emoji:'🈷️', icon:'assets/icons/p4-angle.svg', color:'#8E5CD6', light:'#EBE1FA', type:'skill', mode:'angle', levels:10, grade:'p4', isNew:true },

  /* ===================== ระดับชั้น ป.5 (grade:'p5') ===================== */
  /* อิงตัวชี้วัดแกนกลาง ป.5: คณิต = เศษส่วน/ทศนิยม คูณ-หารครบวงจร + ร้อยละ + ปริมาตร-พื้นที่สี่เหลี่ยม,
     ไทย = ชนิดคำ(บุพบท สันธาน อุทาน) ราชาศัพท์ ภาษาถิ่น กาพย์ยานี 11 จับใจความ-ข้อเท็จจริง/ข้อคิดเห็น,
     English = jobs/ordinal, going to, because, reading comprehension,
     สังคม = ภูมิภาคของตนเอง+ละติจูดลองจิจูด, อยุธยา-ธนบุรี, ธนาคาร-สหกรณ์-พอเพียง, ปกครองท้องถิ่น,
     วิทย์ = การปรับตัว-โซ่อาหาร-พันธุกรรม, สสาร-การละลาย-เปลี่ยนแปลงเคมี, แรงลัพธ์-เสียดทาน-เสียง, วัฏจักรน้ำ-ดาว
     ทุกหมวด quiz ใช้คลัง 24 ข้อ (tier 1/2/3 = 9/9/6) + poolPick:10 — tier 3 = เนื้อหาเร่ง ป.6 เท่านั้น */

  /* ---------- คณิต ป.5 : 4 หมวด ---------- */
  {
    id:'p5-math1', name:'คณิต ป.5 · เศษส่วนและจำนวนคละ', emoji:'🧁', icon:'assets/icons/p5-math1.svg', color:'#7C5CFC', light:'#E9E3FF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'1/2 + 1/2 เท่ากับเท่าไร?', emoji:'🍰', choices:['1','1/4','2/4','1/2'], correct:0, explain:'ครึ่งหนึ่งบวกอีกครึ่งหนึ่งได้เต็ม 1', tier:1},
      {q:'เศษส่วนใดเท่ากับ 1/2?', emoji:'⚖️', choices:['2/4','1/3','3/4','2/3'], correct:0, explain:'2/4 ตัดทอนด้วย 2 ได้ 1/2', tier:1},
      {q:'3/5 + 1/5 เท่ากับเท่าไร?', emoji:'➕', choices:['4/5','4/10','3/10','2/5'], correct:0, explain:'ตัวส่วนเท่ากัน บวกเฉพาะตัวเศษ 3+1 = 4 ได้ 4/5', tier:1},
      {q:'7/8 − 3/8 เท่ากับเท่าไร?', emoji:'➖', choices:['1/2','4/16','10/8','3/8'], correct:0, explain:'7/8 − 3/8 = 4/8 ตัดทอนได้ 1/2', tier:1},
      {q:'จำนวนคละ 2 1/3 เขียนเป็นเศษเกินได้เป็นข้อใด?', emoji:'🔢', choices:['7/3','5/3','6/3','2/3'], correct:0, explain:'2 × 3 = 6 บวกเศษ 1 ได้ 7 ส่วน 3', tier:1},
      {q:'1/4 ของ 12 เท่ากับเท่าไร?', emoji:'🍕', choices:['3','4','6','8'], correct:0, explain:'แบ่ง 12 เป็น 4 ส่วนเท่าๆ กัน ได้ส่วนละ 3', tier:1},
      {q:'เศษส่วนใดมีค่ามากที่สุด?', emoji:'📊', choices:['3/4','1/2','2/5','1/4'], correct:0, explain:'3/4 = 0.75 มากที่สุดในกลุ่มนี้', tier:1},
      {q:'2/3 เขียนเป็นเศษส่วนที่มีตัวส่วนเป็น 9 ได้เป็นข้อใด?', emoji:'🔁', choices:['6/9','3/9','4/9','9/9'], correct:0, explain:'คูณทั้งเศษและส่วนด้วย 3 ได้ 6/9', tier:1},
      {q:'5/6 − 1/6 เท่ากับเท่าไร?', emoji:'➖', choices:['2/3','4/12','6/6','1/6'], correct:0, explain:'5/6 − 1/6 = 4/6 ตัดทอนได้ 2/3', tier:1},
      {q:'1/2 + 1/3 เท่ากับเท่าไร?', emoji:'🧮', choices:['5/6','2/5','1/5','2/6'], correct:0, explain:'ทำส่วนให้เท่ากันเป็น 6 ได้ 3/6 + 2/6 = 5/6', tier:2},
      {q:'3/4 − 1/2 เท่ากับเท่าไร?', emoji:'➖', choices:['1/4','2/2','1/2','2/4'], correct:0, explain:'1/2 = 2/4 ดังนั้น 3/4 − 2/4 = 1/4', tier:2},
      {q:'1/2 × 2/3 เท่ากับเท่าไร?', emoji:'✖️', choices:['1/3','2/5','3/4','1/6'], correct:0, explain:'คูณเศษกับเศษ ส่วนกับส่วน ได้ 2/6 ตัดทอนเป็น 1/3', tier:2},
      {q:'2/5 × 10 เท่ากับเท่าไร?', emoji:'✖️', choices:['4','5','20','2'], correct:0, explain:'2/5 ของ 10 คือ 10 ÷ 5 × 2 = 4', tier:2},
      {q:'1 1/2 + 2 1/4 เท่ากับเท่าไร?', emoji:'➕', choices:['3 3/4','3 1/4','3 2/6','4 1/4'], correct:0, explain:'จำนวนเต็ม 1+2 = 3 เศษส่วน 2/4 + 1/4 = 3/4 รวมเป็น 3 3/4', tier:2},
      {q:'3/4 ÷ 1/2 เท่ากับเท่าไร?', emoji:'➗', choices:['1 1/2','3/8','2/3','1/4'], correct:0, explain:'หารเศษส่วนให้กลับตัวหารแล้วคูณ 3/4 × 2/1 = 6/4 = 1 1/2', tier:2},
      {q:'ค.ร.น. (ตัวคูณร่วมน้อย) ของ 4 กับ 6 คือเท่าไร?', emoji:'🔢', choices:['12','24','10','6'], correct:0, explain:'พหุคูณของ 4 คือ 4, 8, 12 ของ 6 คือ 6, 12 จำนวนน้อยที่สุดที่ตรงกันคือ 12', tier:2},
      {q:'2 1/5 − 1 3/5 เท่ากับเท่าไร?', emoji:'➖', choices:['3/5','1 2/5','2/5','1 3/5'], correct:0, explain:'แปลงเป็นเศษเกิน 11/5 − 8/5 = 3/5', tier:2},
      {q:'3/8 × 4 เท่ากับเท่าไร?', emoji:'✖️', choices:['1 1/2','3/32','12/32','2/3'], correct:0, explain:'3/8 × 4 = 12/8 ตัดทอนได้ 3/2 = 1 1/2', tier:2},
      {q:'แม่มีเค้ก 3/4 ถาด แบ่งให้ลูก 2 คนเท่าๆ กัน ลูกได้คนละเท่าไร?', emoji:'🎂', choices:['3/8 ถาด','1/2 ถาด','3/2 ถาด','1/4 ถาด'], correct:0, explain:'3/4 ÷ 2 = 3/4 × 1/2 = 3/8 ถาด', tier:3},
      {q:'น้ำ 2 1/2 ลิตร แบ่งใส่ขวดละ 1/2 ลิตร ได้กี่ขวด?', emoji:'🥤', choices:['5 ขวด','4 ขวด','2 ขวด','10 ขวด'], correct:0, explain:'5/2 ÷ 1/2 = 5/2 × 2/1 = 5 ขวด', tier:3},
      {q:'เชือกยาว 5/6 เมตร ตัดออกไป 1/3 เมตร เหลือเชือกยาวเท่าไร?', emoji:'🪢', choices:['1/2 เมตร','4/3 เมตร','4/6 เมตร','1/6 เมตร'], correct:0, explain:'1/3 = 2/6 ดังนั้น 5/6 − 2/6 = 3/6 = 1/2 เมตร', tier:3},
      {q:'2/3 ของ 4/5 เท่ากับเท่าไร?', emoji:'✖️', choices:['8/15','6/15','2/15','8/5'], correct:0, explain:'2/3 × 4/5 = 8/15', tier:3},
      {q:'พี่อ่านหนังสือไป 1/3 ของเล่ม น้องอ่านไป 1/4 ของเล่ม รวมกันอ่านไปเท่าไรของเล่ม?', emoji:'📚', choices:['7/12','2/7','5/12','1/12'], correct:0, explain:'ทำส่วนเป็น 12 ได้ 4/12 + 3/12 = 7/12', tier:3},
      {q:'ผลไม้ 20 ผล ขายไปแล้ว 3/5 ของทั้งหมด เหลือกี่ผล?', emoji:'🍎', choices:['8 ผล','12 ผล','5 ผล','15 ผล'], correct:0, explain:'ขายไป 12 ผล เหลือ 20 − 12 = 8 ผล', tier:3}
    ]
  },
  {
    id:'p5-math2', name:'คณิต ป.5 · ทศนิยมและการแปลงหน่วย', emoji:'💠', icon:'assets/icons/p5-math2.svg', color:'#5E3FE0', light:'#E9E3FF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'0.5 เท่ากับเศษส่วนใด?', emoji:'🔢', choices:['1/2','1/5','5/10 ส่วน 2','1/4'], correct:0, explain:'0.5 คือครึ่งหนึ่ง เท่ากับ 1/2', tier:1},
      {q:'3/10 เขียนเป็นทศนิยมได้เป็นเท่าไร?', emoji:'🔁', choices:['0.3','0.03','3.10','0.13'], correct:0, explain:'ตัวส่วนเป็น 10 จึงเป็นทศนิยม 1 ตำแหน่ง = 0.3', tier:1},
      {q:'2.5 + 1.5 เท่ากับเท่าไร?', emoji:'➕', choices:['4','3.5','4.5','3'], correct:0, explain:'2.5 + 1.5 = 4 พอดี', tier:1},
      {q:'25/100 เขียนเป็นทศนิยมได้เป็นเท่าไร?', emoji:'💯', choices:['0.25','2.5','0.025','25.0'], correct:0, explain:'ตัวส่วนเป็น 100 จึงเป็นทศนิยม 2 ตำแหน่ง = 0.25', tier:1},
      {q:'ทศนิยมใดมีค่ามากที่สุด?', emoji:'📊', choices:['0.9','0.09','0.19','0.5'], correct:0, explain:'0.9 = เก้าในสิบ มากที่สุดในกลุ่มนี้', tier:1},
      {q:'1.2 × 10 เท่ากับเท่าไร?', emoji:'✖️', choices:['12','1.20','120','0.12'], correct:0, explain:'คูณ 10 ให้เลื่อนจุดทศนิยมไปขวา 1 ตำแหน่ง ได้ 12', tier:1},
      {q:'250 เซนติเมตร เท่ากับกี่เมตร?', emoji:'📏', choices:['2.5 เมตร','25 เมตร','0.25 เมตร','2.05 เมตร'], correct:0, explain:'100 ซม. = 1 ม. ดังนั้น 250 ÷ 100 = 2.5 เมตร', tier:1},
      {q:'0.75 เท่ากับเศษส่วนใด?', emoji:'🍕', choices:['3/4','7/5','1/4','3/5'], correct:0, explain:'0.75 = 75/100 ตัดทอนได้ 3/4', tier:1},
      {q:'4.6 − 1.2 เท่ากับเท่าไร?', emoji:'➖', choices:['3.4','3.6','5.8','2.4'], correct:0, explain:'4.6 − 1.2 = 3.4', tier:1},
      {q:'2.5 × 4 เท่ากับเท่าไร?', emoji:'✖️', choices:['10','8.5','9','12.5'], correct:0, explain:'2.5 × 4 = 10 พอดี', tier:2},
      {q:'1.25 × 2 เท่ากับเท่าไร?', emoji:'✖️', choices:['2.5','2.25','1.50','3.25'], correct:0, explain:'1.25 + 1.25 = 2.5', tier:2},
      {q:'7.5 ÷ 5 เท่ากับเท่าไร?', emoji:'➗', choices:['1.5','2.5','0.15','3.5'], correct:0, explain:'7.5 ÷ 5 = 1.5', tier:2},
      {q:'1,500 กรัม เท่ากับกี่กิโลกรัม?', emoji:'⚖️', choices:['1.5 กก.','15 กก.','0.15 กก.','150 กก.'], correct:0, explain:'1,000 กรัม = 1 กิโลกรัม ดังนั้น 1,500 กรัม = 1.5 กก.', tier:2},
      {q:'3.6 ÷ 4 เท่ากับเท่าไร?', emoji:'➗', choices:['0.9','1.4','0.09','1.2'], correct:0, explain:'36 ÷ 4 = 9 จึงได้ 0.9', tier:2},
      {q:'0.4 × 0.5 เท่ากับเท่าไร?', emoji:'✖️', choices:['0.2','0.9','2.0','0.02'], correct:0, explain:'4 × 5 = 20 แล้วใส่ทศนิยม 2 ตำแหน่ง ได้ 0.20 = 0.2', tier:2},
      {q:'2 กิโลเมตร 500 เมตร เขียนเป็นทศนิยมได้กี่กิโลเมตร?', emoji:'🚗', choices:['2.5 กม.','2.05 กม.','25 กม.','2.500 กม. เท่ากับ 25'], correct:0, explain:'500 เมตร = 0.5 กม. รวมเป็น 2.5 กม.', tier:2},
      {q:'12.5 + 7.75 เท่ากับเท่าไร?', emoji:'➕', choices:['20.25','19.25','20.75','19.75'], correct:0, explain:'12.50 + 7.75 = 20.25', tier:2},
      {q:'45 มิลลิเมตร เท่ากับกี่เซนติเมตร?', emoji:'📐', choices:['4.5 ซม.','45 ซม.','0.45 ซม.','450 ซม.'], correct:0, explain:'10 มม. = 1 ซม. ดังนั้น 45 ÷ 10 = 4.5 ซม.', tier:2},
      {q:'ซื้อของ 3 ชิ้น ชิ้นละ 12.50 บาท จ่ายเงิน 50 บาท ได้เงินทอนเท่าไร?', emoji:'💵', choices:['12.50 บาท','15.00 บาท','10.50 บาท','37.50 บาท'], correct:0, explain:'ราคารวม 37.50 บาท เงินทอน 50 − 37.50 = 12.50 บาท', tier:3},
      {q:'น้ำมัน 2.5 ลิตร ราคาลิตรละ 32 บาท ต้องจ่ายเท่าไร?', emoji:'⛽', choices:['80 บาท','75 บาท','64 บาท','96 บาท'], correct:0, explain:'32 × 2.5 = 80 บาท', tier:3},
      {q:'เชือกยาว 4.8 เมตร ตัดเป็นท่อนละ 0.6 เมตร ได้กี่ท่อน?', emoji:'✂️', choices:['8 ท่อน','6 ท่อน','12 ท่อน','4 ท่อน'], correct:0, explain:'4.8 ÷ 0.6 = 48 ÷ 6 = 8 ท่อน', tier:3},
      {q:'กล่อง 6 กล่อง หนักกล่องละ 1.25 กิโลกรัม รวมหนักเท่าไร?', emoji:'📦', choices:['7.5 กก.','6.25 กก.','8.5 กก.','7.25 กก.'], correct:0, explain:'1.25 × 6 = 7.5 กิโลกรัม', tier:3},
      {q:'0.125 เท่ากับเศษส่วนใด?', emoji:'🔢', choices:['1/8','1/4','1/2','1/125'], correct:0, explain:'0.125 = 125/1000 ตัดทอนได้ 1/8', tier:3},
      {q:'ระยะทาง 1.2 กิโลเมตร เดินไปแล้ว 850 เมตร เหลืออีกกี่เมตร?', emoji:'🚶', choices:['350 เมตร','250 เมตร','450 เมตร','1,150 เมตร'], correct:0, explain:'1.2 กม. = 1,200 เมตร เหลือ 1,200 − 850 = 350 เมตร', tier:3}
    ]
  },
  {
    id:'p5-math3', name:'คณิต ป.5 · ร้อยละและบัญญัติไตรยางศ์', emoji:'💹', icon:'assets/icons/p5-math3.svg', color:'#4A2FC0', light:'#E9E3FF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'50% ของ 100 เท่ากับเท่าไร?', emoji:'💯', choices:['50','25','100','5'], correct:0, explain:'50% คือครึ่งหนึ่ง ครึ่งหนึ่งของ 100 คือ 50', tier:1},
      {q:'10% ของ 200 เท่ากับเท่าไร?', emoji:'🔢', choices:['20','10','2','100'], correct:0, explain:'10% คือ 1 ใน 10 ส่วน 200 ÷ 10 = 20', tier:1},
      {q:'25% เท่ากับเศษส่วนใด?', emoji:'🍕', choices:['1/4','1/2','2/5','1/25'], correct:0, explain:'25/100 ตัดทอนได้ 1/4', tier:1},
      {q:'100% ของ 45 เท่ากับเท่าไร?', emoji:'✅', choices:['45','100','4.5','145'], correct:0, explain:'100% คือทั้งหมด จึงเท่ากับ 45 เท่าเดิม', tier:1},
      {q:'แถบสีเติมไว้ 60% หมายถึงเติมกี่ส่วนจาก 100 ส่วน?', emoji:'📊', choices:['60 ส่วน','6 ส่วน','40 ส่วน','16 ส่วน'], correct:0, explain:'ร้อยละ 60 คือ 60 ส่วนจาก 100 ส่วน', tier:1},
      {q:'20% ของ 50 เท่ากับเท่าไร?', emoji:'🔢', choices:['10','20','5','25'], correct:0, explain:'50 ÷ 100 × 20 = 10', tier:1},
      {q:'ปากกา 3 ด้าม ราคา 30 บาท ด้ามละกี่บาท?', emoji:'🖊️', choices:['10 บาท','15 บาท','9 บาท','30 บาท'], correct:0, explain:'30 ÷ 3 = 10 บาทต่อด้าม', tier:1},
      {q:'1% ของ 300 เท่ากับเท่าไร?', emoji:'🔢', choices:['3','30','1','13'], correct:0, explain:'300 ÷ 100 = 3', tier:1},
      {q:'75% เท่ากับทศนิยมใด?', emoji:'💠', choices:['0.75','7.5','0.075','75.0'], correct:0, explain:'75% = 75/100 = 0.75', tier:1},
      {q:'ของราคา 100 บาท ลด 20% เหลือกี่บาท?', emoji:'🏷️', choices:['80 บาท','20 บาท','120 บาท','60 บาท'], correct:0, explain:'ลด 20 บาท เหลือ 100 − 20 = 80 บาท', tier:2},
      {q:'ปากกา 3 ด้าม ราคา 30 บาท ถ้าซื้อ 5 ด้าม ต้องจ่ายเท่าไร?', emoji:'🖊️', choices:['50 บาท','45 บาท','60 บาท','35 บาท'], correct:0, explain:'ด้ามละ 10 บาท 5 ด้ามเป็น 50 บาท', tier:2},
      {q:'นักเรียน 40 คน มาเรียน 90% คิดเป็นกี่คน?', emoji:'🧒', choices:['36 คน','34 คน','30 คน','38 คน'], correct:0, explain:'40 ÷ 100 × 90 = 36 คน', tier:2},
      {q:'15% ของ 200 เท่ากับเท่าไร?', emoji:'🔢', choices:['30','15','20','35'], correct:0, explain:'200 ÷ 100 × 15 = 30', tier:2},
      {q:'ดินสอ 4 แท่ง ราคา 24 บาท ถ้าซื้อ 7 แท่ง ต้องจ่ายเท่าไร?', emoji:'✏️', choices:['42 บาท','36 บาท','48 บาท','40 บาท'], correct:0, explain:'แท่งละ 6 บาท 7 แท่งเป็น 42 บาท', tier:2},
      {q:'ของราคา 250 บาท ลด 10% เหลือกี่บาท?', emoji:'🏷️', choices:['225 บาท','240 บาท','200 บาท','230 บาท'], correct:0, explain:'ลด 25 บาท เหลือ 250 − 25 = 225 บาท', tier:2},
      {q:'คะแนนเต็ม 50 คะแนน ได้ 40 คะแนน คิดเป็นร้อยละเท่าไร?', emoji:'📝', choices:['80','40','75','90'], correct:0, explain:'40 ÷ 50 × 100 = ร้อยละ 80', tier:2},
      {q:'รถวิ่ง 120 กิโลเมตร ใช้น้ำมัน 8 ลิตร ถ้าวิ่ง 300 กิโลเมตร ใช้น้ำมันกี่ลิตร?', emoji:'🚗', choices:['20 ลิตร','16 ลิตร','24 ลิตร','30 ลิตร'], correct:0, explain:'วิ่งได้ 15 กม. ต่อ 1 ลิตร ดังนั้น 300 ÷ 15 = 20 ลิตร', tier:2},
      {q:'5% ของ 1,000 เท่ากับเท่าไร?', emoji:'🔢', choices:['50','5','500','15'], correct:0, explain:'1,000 ÷ 100 × 5 = 50', tier:2},
      {q:'ฝากเงิน 2,000 บาท ได้ดอกเบี้ยร้อยละ 2 ต่อปี ครบ 1 ปีได้ดอกเบี้ยกี่บาท?', emoji:'🏦', choices:['40 บาท','20 บาท','200 บาท','400 บาท'], correct:0, explain:'2,000 ÷ 100 × 2 = 40 บาท', tier:3},
      {q:'เสื้อราคา 400 บาท ลด 25% เหลือราคาเท่าไร?', emoji:'👕', choices:['300 บาท','375 บาท','325 บาท','280 บาท'], correct:0, explain:'ลด 100 บาท เหลือ 400 − 100 = 300 บาท', tier:3},
      {q:'ขนม 12 ชิ้น ราคา 96 บาท ถ้าซื้อ 20 ชิ้น ต้องจ่ายเท่าไร?', emoji:'🍬', choices:['160 บาท','150 บาท','180 บาท','120 บาท'], correct:0, explain:'ชิ้นละ 8 บาท 20 ชิ้นเป็น 160 บาท', tier:3},
      {q:'นักเรียน 200 คน ชอบเล่นกีฬา 35% คิดเป็นกี่คน?', emoji:'⚽', choices:['70 คน','65 คน','35 คน','75 คน'], correct:0, explain:'200 ÷ 100 × 35 = 70 คน', tier:3},
      {q:'ของราคา 800 บาท ลด 15% ลดไปกี่บาท?', emoji:'🏷️', choices:['120 บาท','80 บาท','150 บาท','115 บาท'], correct:0, explain:'800 ÷ 100 × 15 = 120 บาท', tier:3},
      {q:'ร้านลดราคา 20% ลูกค้าจ่ายจริง 240 บาท ราคาเดิมเท่าไร?', emoji:'🛒', choices:['300 บาท','280 บาท','260 บาท','320 บาท'], correct:0, explain:'จ่าย 80% ของราคาเดิม ดังนั้นราคาเดิม = 240 ÷ 80 × 100 = 300 บาท', tier:3}
    ]
  },
  {
    id:'p5-math4', name:'คณิต ป.5 · ปริมาตร พื้นที่ และรูปสี่เหลี่ยม', emoji:'📦', icon:'assets/icons/p5-math4.svg', color:'#3A24A0', light:'#E9E3FF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ปริมาตรของกล่องทรงสี่เหลี่ยมหาได้อย่างไร?', emoji:'📦', choices:['กว้าง × ยาว × สูง','กว้าง + ยาว + สูง','กว้าง × ยาว','ยาว × สูง'], correct:0, explain:'ปริมาตรทรงสี่เหลี่ยมมุมฉาก = กว้าง × ยาว × สูง', tier:1},
      {q:'กล่องกว้าง 2 ซม. ยาว 3 ซม. สูง 4 ซม. มีปริมาตรเท่าไร?', emoji:'🧊', choices:['24 ลบ.ซม.','9 ลบ.ซม.','12 ลบ.ซม.','20 ลบ.ซม.'], correct:0, explain:'2 × 3 × 4 = 24 ลูกบาศก์เซนติเมตร', tier:1},
      {q:'1 ลิตร เท่ากับกี่มิลลิลิตร?', emoji:'🥤', choices:['1,000 มล.','100 มล.','10 มล.','10,000 มล.'], correct:0, explain:'1 ลิตร = 1,000 มิลลิลิตร', tier:1},
      {q:'รูปสี่เหลี่ยมจัตุรัสมีด้านยาวเท่ากันกี่ด้าน?', emoji:'⬜', choices:['4 ด้าน','2 ด้าน','3 ด้าน','ไม่มีด้านเท่ากัน'], correct:0, explain:'สี่เหลี่ยมจัตุรัสมีด้านยาวเท่ากันทั้ง 4 ด้าน และมีมุมฉากทุกมุม', tier:1},
      {q:'พื้นที่ของรูปสี่เหลี่ยมผืนผ้าหาได้อย่างไร?', emoji:'📐', choices:['กว้าง × ยาว','กว้าง + ยาว','ด้าน × 4','ฐาน ÷ สูง'], correct:0, explain:'พื้นที่สี่เหลี่ยมผืนผ้า = ความกว้าง × ความยาว', tier:1},
      {q:'สี่เหลี่ยมผืนผ้ากว้าง 5 ซม. ยาว 8 ซม. มีพื้นที่เท่าไร?', emoji:'📏', choices:['40 ตร.ซม.','13 ตร.ซม.','26 ตร.ซม.','45 ตร.ซม.'], correct:0, explain:'5 × 8 = 40 ตารางเซนติเมตร', tier:1},
      {q:'สี่เหลี่ยมจัตุรัสด้านยาว 6 ซม. มีความยาวรอบรูปเท่าไร?', emoji:'🔲', choices:['24 ซม.','36 ซม.','12 ซม.','18 ซม.'], correct:0, explain:'รอบรูป = 6 × 4 = 24 เซนติเมตร', tier:1},
      {q:'1 ลูกบาศก์เซนติเมตร เท่ากับกี่มิลลิลิตร?', emoji:'💧', choices:['1 มล.','10 มล.','100 มล.','1,000 มล.'], correct:0, explain:'1 ลบ.ซม. จุน้ำได้ 1 มิลลิลิตรพอดี', tier:1},
      {q:'รูปใดมีด้านขนานกัน 2 คู่?', emoji:'🔷', choices:['สี่เหลี่ยมด้านขนาน','สามเหลี่ยม','สี่เหลี่ยมคางหมู','วงกลม'], correct:0, explain:'สี่เหลี่ยมด้านขนานมีด้านตรงข้ามขนานกันทั้ง 2 คู่', tier:1},
      {q:'พื้นที่ของรูปสี่เหลี่ยมด้านขนานหาได้อย่างไร?', emoji:'📐', choices:['ฐาน × สูง','ฐาน + สูง','ด้าน × ด้าน','ฐาน × สูง ÷ 2'], correct:0, explain:'พื้นที่สี่เหลี่ยมด้านขนาน = ความยาวฐาน × ความสูง', tier:2},
      {q:'สี่เหลี่ยมด้านขนานฐานยาว 10 ซม. สูง 6 ซม. มีพื้นที่เท่าไร?', emoji:'🔷', choices:['60 ตร.ซม.','30 ตร.ซม.','16 ตร.ซม.','32 ตร.ซม.'], correct:0, explain:'10 × 6 = 60 ตารางเซนติเมตร', tier:2},
      {q:'ลูกบาศก์กว้าง ยาว สูง ด้านละ 5 ซม. มีปริมาตรเท่าไร?', emoji:'🧊', choices:['125 ลบ.ซม.','25 ลบ.ซม.','15 ลบ.ซม.','75 ลบ.ซม.'], correct:0, explain:'5 × 5 × 5 = 125 ลูกบาศก์เซนติเมตร', tier:2},
      {q:'รูปสี่เหลี่ยมคางหมูมีด้านขนานกันกี่คู่?', emoji:'🔻', choices:['1 คู่','2 คู่','3 คู่','ไม่มีด้านขนาน'], correct:0, explain:'สี่เหลี่ยมคางหมูมีด้านขนานเพียง 1 คู่', tier:2},
      {q:'รูปสี่เหลี่ยมขนมเปียกปูนมีสมบัติใด?', emoji:'🔶', choices:['ด้านทั้งสี่ยาวเท่ากันแต่มุมไม่เป็นมุมฉาก','ด้านทั้งสี่ยาวเท่ากันและมีมุมฉาก','มีด้านขนาน 1 คู่','ไม่มีด้านใดขนานกัน'], correct:0, explain:'ขนมเปียกปูนมีด้านเท่ากันทั้ง 4 ด้าน แต่มุมไม่เป็นมุมฉาก (ถ้ามุมฉากจะกลายเป็นจัตุรัส)', tier:2},
      {q:'ภาชนะจุน้ำได้ 2,000 มิลลิลิตร เท่ากับกี่ลิตร?', emoji:'🪣', choices:['2 ลิตร','20 ลิตร','0.2 ลิตร','200 ลิตร'], correct:0, explain:'2,000 ÷ 1,000 = 2 ลิตร', tier:2},
      {q:'ปริซึมสี่เหลี่ยมมุมฉากมีหน้าทั้งหมดกี่หน้า?', emoji:'📦', choices:['6 หน้า','4 หน้า','8 หน้า','5 หน้า'], correct:0, explain:'กล่องสี่เหลี่ยมมี 6 หน้า คือ บน ล่าง และด้านข้าง 4 ด้าน', tier:2},
      {q:'ขนมเปียกปูนฐานยาว 8 ซม. สูง 5 ซม. มีพื้นที่เท่าไร?', emoji:'🔶', choices:['40 ตร.ซม.','26 ตร.ซม.','20 ตร.ซม.','13 ตร.ซม.'], correct:0, explain:'พื้นที่ = ฐาน × สูง = 8 × 5 = 40 ตารางเซนติเมตร', tier:2},
      {q:'สี่เหลี่ยมผืนผ้ากว้าง 4 ซม. มีพื้นที่ 36 ตร.ซม. ยาวเท่าไร?', emoji:'📏', choices:['9 ซม.','8 ซม.','32 ซม.','12 ซม.'], correct:0, explain:'ความยาว = พื้นที่ ÷ ความกว้าง = 36 ÷ 4 = 9 เซนติเมตร', tier:2},
      {q:'ตู้ปลากว้าง 40 ซม. ยาว 50 ซม. สูง 30 ซม. จุน้ำได้กี่ลิตร?', emoji:'🐠', choices:['60 ลิตร','6 ลิตร','600 ลิตร','120 ลิตร'], correct:0, explain:'ปริมาตร 40 × 50 × 30 = 60,000 ลบ.ซม. = 60,000 มล. = 60 ลิตร', tier:3},
      {q:'กล่องมีปริมาตร 72 ลบ.ซม. ฐานกว้าง 3 ซม. ยาว 4 ซม. สูงเท่าไร?', emoji:'📦', choices:['6 ซม.','8 ซม.','12 ซม.','5 ซม.'], correct:0, explain:'ฐาน 3 × 4 = 12 ดังนั้นความสูง = 72 ÷ 12 = 6 เซนติเมตร', tier:3},
      {q:'สนามกว้าง 20 เมตร ยาว 35 เมตร ล้อมรั้วรอบสนามยาวกี่เมตร?', emoji:'🏟️', choices:['110 เมตร','700 เมตร','55 เมตร','140 เมตร'], correct:0, explain:'รอบรูป = (20 + 35) × 2 = 110 เมตร', tier:3},
      {q:'ปริซึมสามเหลี่ยมมีหน้าทั้งหมดกี่หน้า?', emoji:'🔺', choices:['5 หน้า','3 หน้า','6 หน้า','4 หน้า'], correct:0, explain:'มีหน้าสามเหลี่ยม 2 หน้า และหน้าสี่เหลี่ยมข้าง 3 หน้า รวม 5 หน้า', tier:3},
      {q:'ที่ดินรูปสี่เหลี่ยมด้านขนานฐาน 25 เมตร สูง 12 เมตร มีพื้นที่กี่ตารางเมตร?', emoji:'🏞️', choices:['300 ตร.ม.','37 ตร.ม.','150 ตร.ม.','74 ตร.ม.'], correct:0, explain:'25 × 12 = 300 ตารางเมตร', tier:3},
      {q:'นม 1 กล่อง จุ 250 มิลลิลิตร ซื้อ 8 กล่อง รวมกี่ลิตร?', emoji:'🥛', choices:['2 ลิตร','2.5 ลิตร','1.5 ลิตร','20 ลิตร'], correct:0, explain:'250 × 8 = 2,000 มล. = 2 ลิตร', tier:3}
    ]
  },
  /* ---------- ภาษาไทย ป.5 : 4 หมวด ---------- */
  {
    id:'p5-thai1', name:'ภาษาไทย ป.5 · ชนิดของคำและส่วนของประโยค', emoji:'📙', icon:'assets/icons/p5-thai1.svg', color:'#EF5DA8', light:'#FCE0EF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'คำใดเป็นคำอุทาน?', emoji:'❗', choices:['โอ๊ย','วิ่ง','โต๊ะ','สวย'], correct:0, explain:'คำอุทานใช้เปล่งออกมาแสดงอารมณ์ความรู้สึก เช่น โอ๊ย โอ้โฮ อุ๊ย', tier:1},
      {q:'คำว่า "และ" เป็นคำชนิดใด?', emoji:'🔗', choices:['คำสันธาน','คำบุพบท','คำอุทาน','คำนาม'], correct:0, explain:'"และ" ใช้เชื่อมคำหรือประโยคเข้าด้วยกัน จึงเป็นคำสันธาน', tier:1},
      {q:'คำว่า "ใน" เป็นคำชนิดใด?', emoji:'📍', choices:['คำบุพบท','คำสันธาน','คำกริยา','คำอุทาน'], correct:0, explain:'"ใน" นำหน้าคำนามเพื่อบอกตำแหน่ง จึงเป็นคำบุพบท', tier:1},
      {q:'คำสันธานทำหน้าที่อะไร?', emoji:'🔗', choices:['เชื่อมคำหรือประโยคเข้าด้วยกัน','บอกอาการของประธาน','เรียกชื่อสิ่งต่างๆ','แสดงอารมณ์ของผู้พูด'], correct:0, explain:'คำสันธาน เช่น และ แต่ หรือ เพราะ ใช้เชื่อมข้อความให้ต่อเนื่องกัน', tier:1},
      {q:'คำบุพบททำหน้าที่อะไร?', emoji:'🧭', choices:['นำหน้าคำนามเพื่อบอกความสัมพันธ์ เช่น สถานที่หรือเวลา','เชื่อมประโยคสองประโยค','แสดงความรู้สึกตกใจ','บอกจำนวนของสิ่งของ'], correct:0, explain:'คำบุพบท เช่น ใน บน ใต้ กับ แก่ นำหน้าคำนามเพื่อบอกความสัมพันธ์', tier:1},
      {q:'"แมวนอนอยู่ใต้โต๊ะ" คำใดเป็นคำบุพบท?', emoji:'🐱', choices:['ใต้','แมว','นอน','โต๊ะ'], correct:0, explain:'"ใต้" นำหน้าคำนาม "โต๊ะ" เพื่อบอกตำแหน่ง จึงเป็นคำบุพบท', tier:1},
      {q:'ประโยคหนึ่งประกอบด้วยส่วนสำคัญใดบ้าง?', emoji:'✂️', choices:['ภาคประธานและภาคแสดง','คำนามและคำอุทาน','คำถามและคำตอบ','พยัญชนะและสระ'], correct:0, explain:'ประโยคต้องมีภาคประธาน (ใคร/อะไร) และภาคแสดง (ทำอะไร)', tier:1},
      {q:'"นกบิน" คำว่า "นก" ทำหน้าที่ใดในประโยค?', emoji:'🐦', choices:['ภาคประธาน','ภาคแสดง','คำบุพบท','คำสันธาน'], correct:0, explain:'"นก" คือผู้ทำกริยา จึงเป็นภาคประธานของประโยค', tier:1},
      {q:'คำใดเป็นคำสันธาน?', emoji:'🔗', choices:['แต่','ใต้','โอ๊ย','ปลา'], correct:0, explain:'"แต่" ใช้เชื่อมข้อความที่ขัดแย้งกัน จึงเป็นคำสันธาน', tier:1},
      {q:'"ฉันชอบอ่านหนังสือแต่พี่ชอบเล่นกีฬา" คำสันธานคือคำใด?', emoji:'📚', choices:['แต่','ชอบ','พี่','กีฬา'], correct:0, explain:'"แต่" เชื่อมสองประโยคที่มีใจความขัดแย้งกัน', tier:2},
      {q:'"โอ้โฮ! ปลาตัวใหญ่จัง" คำอุทานคือคำใด?', emoji:'🐟', choices:['โอ้โฮ','ปลา','ใหญ่','จัง'], correct:0, explain:'"โอ้โฮ" เปล่งออกมาแสดงความประหลาดใจ จึงเป็นคำอุทาน', tier:2},
      {q:'"เขาเดินไปโรงเรียนกับเพื่อน" คำบุพบทคือคำใด?', emoji:'🚶', choices:['กับ','เดิน','โรงเรียน','เพื่อน'], correct:0, explain:'"กับ" นำหน้าคำนาม "เพื่อน" เพื่อบอกความสัมพันธ์', tier:2},
      {q:'"น้องกินข้าว" ภาคแสดงคือส่วนใด?', emoji:'🍚', choices:['กินข้าว','น้อง','ข้าว','น้องกิน'], correct:0, explain:'ภาคแสดงคือส่วนที่บอกว่าประธานทำอะไร คือ "กินข้าว"', tier:2},
      {q:'คำสันธานในข้อใดใช้แสดงสาเหตุ?', emoji:'💭', choices:['เพราะ','หรือ','และ','กับ'], correct:0, explain:'"เพราะ" ใช้เชื่อมประโยคเพื่อบอกสาเหตุ', tier:2},
      {q:'เครื่องหมายใดมักเขียนท้ายคำอุทาน?', emoji:'❗', choices:['เครื่องหมายอัศเจรีย์ (!)','เครื่องหมายปรัศนี (?)','เครื่องหมายไปยาลน้อย (ฯ)','เครื่องหมายไม้ยมก (ๆ)'], correct:0, explain:'คำอุทานแสดงอารมณ์แรง จึงนิยมใช้เครื่องหมายอัศเจรีย์กำกับ', tier:2},
      {q:'"หนังสือวางอยู่บนโต๊ะ" คำว่า "บน" เป็นคำชนิดใด?', emoji:'📖', choices:['คำบุพบท','คำสันธาน','คำอุทาน','คำกริยา'], correct:0, explain:'"บน" นำหน้าคำนามเพื่อบอกตำแหน่ง จึงเป็นคำบุพบท', tier:2},
      {q:'ข้อใดใช้คำสันธานได้ถูกต้อง?', emoji:'✅', choices:['ฝนตกหนักจึงน้ำท่วม','ฝนตกหนักและน้ำท่วมแต่','ฝนตกหนักเพราะ','ฝนตกหนักใต้น้ำท่วม'], correct:0, explain:'"จึง" เชื่อมประโยคแสดงผลที่เกิดจากสาเหตุได้ถูกต้อง', tier:2},
      {q:'"แม่ซื้อผลไม้ที่ตลาด" ภาคประธานคือส่วนใด?', emoji:'🛒', choices:['แม่','ซื้อผลไม้','ตลาด','ผลไม้'], correct:0, explain:'"แม่" เป็นผู้ทำกริยา จึงเป็นภาคประธาน', tier:2},
      {q:'"เขาไม่ไปเที่ยวเพราะฝนตก" คำว่า "เพราะ" ทำหน้าที่ใด?', emoji:'🌧️', choices:['เชื่อมประโยคเพื่อบอกสาเหตุ','บอกตำแหน่งของสิ่งของ','แสดงความรู้สึกตกใจ','บอกจำนวน'], correct:0, explain:'"เพราะ" เป็นคำสันธานที่เชื่อมประโยคผลกับประโยคสาเหตุ', tier:3},
      {q:'ข้อใดมีทั้งคำบุพบทและคำสันธานอยู่ในประโยคเดียวกัน?', emoji:'🔍', choices:['น้องนั่งบนเก้าอี้และอ่านหนังสือ','ฉันชอบกินผลไม้','โอ๊ย! เจ็บจัง','นกบินสูงมาก'], correct:0, explain:'"บน" เป็นคำบุพบท และ "และ" เป็นคำสันธาน อยู่ในประโยคเดียวกัน', tier:3},
      {q:'"อุ๊ย! ทำแก้วตกแล้ว" คำอุทานนี้แสดงความรู้สึกใด?', emoji:'😲', choices:['ตกใจ','ดีใจ','โกรธ','ง่วงนอน'], correct:0, explain:'"อุ๊ย" เปล่งออกมาเมื่อตกใจกับเหตุการณ์ที่ไม่ได้ตั้งใจ', tier:3},
      {q:'"นักเรียนที่ขยันย่อมประสบความสำเร็จ" ภาคประธานคือส่วนใด?', emoji:'🎒', choices:['นักเรียนที่ขยัน','ย่อมประสบความสำเร็จ','ความสำเร็จ','ขยัน'], correct:0, explain:'ภาคประธานรวมคำขยายด้วย จึงเป็น "นักเรียนที่ขยัน"', tier:3},
      {q:'คำสันธานคู่ในข้อใดใช้เข้าคู่กันได้ถูกต้อง?', emoji:'🔗', choices:['เพราะ...จึง','และ...ใต้','บน...กับ','โอ๊ย...แต่'], correct:0, explain:'"เพราะ...จึง" เป็นคำสันธานคู่ที่ใช้บอกเหตุและผล', tier:3},
      {q:'"คุณครูสอนหนังสือในห้องเรียนอย่างตั้งใจ" คำบุพบทคือคำใด?', emoji:'👩‍🏫', choices:['ใน','สอน','ตั้งใจ','คุณครู'], correct:0, explain:'"ใน" นำหน้าคำนาม "ห้องเรียน" เพื่อบอกสถานที่', tier:3}
    ]
  },
  {
    id:'p5-thai2', name:'ภาษาไทย ป.5 · คำราชาศัพท์และภาษาถิ่น', emoji:'👑', icon:'assets/icons/p5-thai2.svg', color:'#E14E9A', light:'#FCE0EF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'คำราชาศัพท์ "เสวย" ตรงกับคำสามัญใด?', emoji:'🍽️', choices:['กิน','นอน','เดิน','พูด'], correct:0, explain:'"เสวย" เป็นคำราชาศัพท์ที่หมายถึง กิน หรือ ดื่ม', tier:1},
      {q:'คำราชาศัพท์ "บรรทม" ตรงกับคำสามัญใด?', emoji:'🛏️', choices:['นอน','นั่ง','ยืน','วิ่ง'], correct:0, explain:'"บรรทม" หมายถึง นอน', tier:1},
      {q:'"พระเนตร" หมายถึงอวัยวะใด?', emoji:'👁️', choices:['ตา','หู','มือ','เท้า'], correct:0, explain:'"พระเนตร" เป็นคำราชาศัพท์ของ ตา', tier:1},
      {q:'คำราชาศัพท์ใช้กับบุคคลกลุ่มใด?', emoji:'👑', choices:['พระมหากษัตริย์และพระบรมวงศานุวงศ์','เพื่อนสนิทของเรา','ครูประจำชั้น','พ่อแม่ของเรา'], correct:0, explain:'คำราชาศัพท์เป็นถ้อยคำที่ใช้กับพระมหากษัตริย์และพระบรมวงศานุวงศ์', tier:1},
      {q:'"พระหัตถ์" หมายถึงอวัยวะใด?', emoji:'✋', choices:['มือ','เท้า','ตา','ปาก'], correct:0, explain:'"พระหัตถ์" เป็นคำราชาศัพท์ของ มือ', tier:1},
      {q:'ภาษาถิ่นเหนือ "อู้" ตรงกับคำในภาษาไทยมาตรฐานว่าอะไร?', emoji:'🗣️', choices:['พูด','กิน','เดิน','นอน'], correct:0, explain:'"อู้" เป็นคำภาษาถิ่นเหนือที่แปลว่า พูด', tier:1},
      {q:'"พระบาท" หมายถึงอวัยวะใด?', emoji:'🦶', choices:['เท้า','แขน','ศีรษะ','หลัง'], correct:0, explain:'"พระบาท" เป็นคำราชาศัพท์ของ เท้า', tier:1},
      {q:'ภาษาถิ่นอีสาน "เว้า" ตรงกับคำใด?', emoji:'💬', choices:['พูด','วิ่ง','หัวเราะ','นั่ง'], correct:0, explain:'"เว้า" เป็นคำภาษาถิ่นอีสานที่แปลว่า พูด', tier:1},
      {q:'คำราชาศัพท์ "ตรัส" หมายถึงอะไร?', emoji:'👑', choices:['พูด (ใช้กับพระมหากษัตริย์)','เดิน','กิน','นอน'], correct:0, explain:'"ตรัส" หมายถึง พูด เป็นคำราชาศัพท์', tier:1},
      {q:'"พระกรรณ" หมายถึงอวัยวะใด?', emoji:'👂', choices:['หู','จมูก','ตา','คอ'], correct:0, explain:'"พระกรรณ" เป็นคำราชาศัพท์ของ หู', tier:2},
      {q:'ภาษาถิ่นใต้ "แหลง" ตรงกับคำใด?', emoji:'🗣️', choices:['พูด','กิน','นอน','เล่น'], correct:0, explain:'"แหลง" เป็นคำภาษาถิ่นใต้ที่แปลว่า พูด', tier:2},
      {q:'คำว่า "ถวาย" ใช้ในความหมายใด?', emoji:'🙏', choices:['มอบให้แด่พระมหากษัตริย์หรือพระสงฆ์','ให้เพื่อนยืมของ','ขอสิ่งของจากผู้อื่น','ซื้อของจากตลาด'], correct:0, explain:'"ถวาย" ใช้เมื่อมอบสิ่งของแด่พระมหากษัตริย์หรือพระสงฆ์', tier:2},
      {q:'คำราชาศัพท์ "ประทับ" หมายถึงอะไร?', emoji:'🪑', choices:['นั่งหรืออยู่','กิน','วิ่ง','ร้องเพลง'], correct:0, explain:'"ประทับ" หมายถึง นั่ง หรือ อยู่ ณ ที่ใดที่หนึ่ง', tier:2},
      {q:'ภาษาถิ่นเหนือ "ลำ" มีความหมายว่าอย่างไร?', emoji:'😋', choices:['อร่อย','เหนื่อย','ร้อน','สวย'], correct:0, explain:'"ลำ" เป็นคำภาษาถิ่นเหนือที่แปลว่า อร่อย', tier:2},
      {q:'"พระบรมราโชวาท" หมายถึงอะไร?', emoji:'📜', choices:['คำสั่งสอนของพระมหากษัตริย์','จดหมายของข้าราชการ','บทกลอนของกวี','กฎของโรงเรียน'], correct:0, explain:'"พระบรมราโชวาท" คือคำสั่งสอนที่พระมหากษัตริย์พระราชทาน', tier:2},
      {q:'ภาษาไทยมาตรฐานเหมาะกับการใช้ในโอกาสใด?', emoji:'🏫', choices:['การเรียนการสอน ข่าว และเอกสารราชการ','คุยเล่นกับเพื่อนสนิทเท่านั้น','ใช้ได้เฉพาะในบ้าน','ใช้เฉพาะเวลาโกรธ'], correct:0, explain:'ภาษาไทยมาตรฐานใช้ในสถานการณ์ทางการเพื่อให้ทุกภูมิภาคเข้าใจตรงกัน', tier:2},
      {q:'ภาษาถิ่นอีสาน "แซบ" มีความหมายว่าอย่างไร?', emoji:'😋', choices:['อร่อย','เผ็ด','หวาน','เย็น'], correct:0, explain:'"แซบ" เป็นคำภาษาถิ่นอีสานที่แปลว่า อร่อย', tier:2},
      {q:'คำว่า "สิ้นพระชนม์" ใช้กับบุคคลใด?', emoji:'👑', choices:['พระบรมวงศานุวงศ์ชั้นสูง','เพื่อนร่วมชั้น','ชาวบ้านทั่วไป','สัตว์เลี้ยง'], correct:0, explain:'เป็นคำราชาศัพท์ที่ใช้กับพระบรมวงศานุวงศ์ชั้นสูง', tier:2},
      {q:'คำว่า "พระราชทาน" หมายถึงอะไร?', emoji:'🎁', choices:['พระมหากษัตริย์ทรงมอบให้','ประชาชนถวายของ','ยืมของจากผู้ใหญ่','แลกเปลี่ยนสิ่งของกัน'], correct:0, explain:'"พระราชทาน" คือการที่พระมหากษัตริย์ทรงมอบสิ่งของให้ผู้อื่น', tier:3},
      {q:'ข้อใดใช้คำราชาศัพท์ได้ถูกต้อง?', emoji:'✅', choices:['พระบาทสมเด็จพระเจ้าอยู่หัวเสด็จพระราชดำเนินไปทรงงาน','พระบาทสมเด็จพระเจ้าอยู่หัวเดินไปทำงาน','พระบาทสมเด็จพระเจ้าอยู่หัวกินข้าวแล้ว','พระบาทสมเด็จพระเจ้าอยู่หัวนอนหลับสบาย'], correct:0, explain:'ต้องใช้คำราชาศัพท์ให้ครบทั้งประโยค เช่น เสด็จพระราชดำเนิน ทรงงาน', tier:3},
      {q:'ภาษาถิ่นใต้ "หรอย" มีความหมายว่าอย่างไร?', emoji:'😋', choices:['อร่อย','ร้อน','เหนื่อย','ไกล'], correct:0, explain:'"หรอย" เป็นคำภาษาถิ่นใต้ที่แปลว่า อร่อย', tier:3},
      {q:'คำว่า "ทูล" ใช้ในสถานการณ์ใด?', emoji:'🙇', choices:['พูดกับเจ้านายชั้นสูง','พูดกับเพื่อน','พูดกับน้อง','พูดกับสัตว์เลี้ยง'], correct:0, explain:'"ทูล" เป็นคำราชาศัพท์ที่ใช้เมื่อกราบทูลเจ้านายชั้นสูง', tier:3},
      {q:'ภาษาถิ่นเหนือ "กิ๋นข้าว" ตรงกับข้อความใด?', emoji:'🍚', choices:['กินข้าว','นอนพัก','เดินเล่น','อาบน้ำ'], correct:0, explain:'"กิ๋นข้าว" คือคำถิ่นเหนือที่ตรงกับ กินข้าว ในภาษามาตรฐาน', tier:3},
      {q:'เหตุใดจึงควรเรียนรู้ทั้งภาษาไทยมาตรฐานและภาษาถิ่น?', emoji:'🇹🇭', choices:['สื่อสารได้กว้างขึ้นและเข้าใจวัฒนธรรมท้องถิ่น','เพื่อให้ลืมภาษาถิ่นไปในที่สุด','เพื่อใช้ภาษาถิ่นแทนภาษามาตรฐานทุกที่','เพื่อให้พูดได้เร็วกว่าคนอื่น'], correct:0, explain:'ทั้งสองแบบมีคุณค่า ภาษาถิ่นสะท้อนวัฒนธรรม ส่วนภาษามาตรฐานช่วยให้สื่อสารกันทั่วประเทศ', tier:3}
    ]
  },
  {
    id:'p5-thai3', name:'ภาษาไทย ป.5 · สำนวน สุภาษิต และกาพย์ยานี 11', emoji:'🪷', icon:'assets/icons/p5-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'"น้ำขึ้นให้รีบตัก" หมายความว่าอย่างไร?', emoji:'🪣', choices:['มีโอกาสควรรีบทำทันที','ควรรอให้น้ำลดก่อน','ต้องตักน้ำทุกเช้า','อย่าทำอะไรรีบร้อน'], correct:0, explain:'เปรียบโอกาสเหมือนน้ำขึ้น ถ้าไม่รีบใช้ก็จะผ่านเลยไป', tier:1},
      {q:'กาพย์ยานี 11 หนึ่งบทมีกี่วรรค?', emoji:'📜', choices:['4 วรรค','2 วรรค','6 วรรค','8 วรรค'], correct:0, explain:'กาพย์ยานี 11 หนึ่งบทมี 2 บาท บาทละ 2 วรรค รวมเป็น 4 วรรค', tier:1},
      {q:'กาพย์ยานี 11 วรรคหน้ามีกี่คำ?', emoji:'✍️', choices:['5 คำ','6 คำ','7 คำ','4 คำ'], correct:0, explain:'วรรคหน้า 5 คำ วรรคหลัง 6 คำ รวมบาทละ 11 คำ จึงเรียกยานี 11', tier:1},
      {q:'กาพย์ยานี 11 วรรคหลังมีกี่คำ?', emoji:'✍️', choices:['6 คำ','5 คำ','4 คำ','8 คำ'], correct:0, explain:'วรรคหลังมี 6 คำ เมื่อรวมกับวรรคหน้า 5 คำ จะได้ 11 คำต่อบาท', tier:1},
      {q:'"ตีวัวกระทบคราด" หมายความว่าอย่างไร?', emoji:'🐄', choices:['โกรธคนหนึ่งแต่ไประบายกับอีกคน','ทำงานหนักจนเหนื่อย','ช่วยกันทำงานให้เสร็จเร็ว','ทำของผู้อื่นเสียหาย'], correct:0, explain:'เปรียบการทำร้ายผู้ที่ไม่เกี่ยวข้องเพราะโกรธอีกคน', tier:1},
      {q:'"ปิดทองหลังพระ" หมายความว่าอย่างไร?', emoji:'🛕', choices:['ทำความดีโดยไม่หวังให้ใครเห็น','ทำงานแบบหลบซ่อน','ตกแต่งวัดให้สวยงาม','ทำดีเพื่อให้คนชม'], correct:0, explain:'เหมือนปิดทองด้านหลังองค์พระที่ไม่มีใครมองเห็น แต่ก็ยังทำ', tier:1},
      {q:'"กินน้ำใต้ศอก" หมายความว่าอย่างไร?', emoji:'💧', choices:['ต้องเป็นรองผู้อื่นและได้รับส่วนที่ด้อยกว่า','ดื่มน้ำอย่างรีบร้อน','ได้ของดีที่สุดเสมอ','แบ่งอาหารให้เพื่อน'], correct:0, explain:'เปรียบผู้ที่ต้องยอมรับสิ่งที่เหลือหรือด้อยกว่าผู้อื่น', tier:1},
      {q:'"รักยาวให้บั่น รักสั้นให้ต่อ" สอนเรื่องอะไร?', emoji:'💞', choices:['ถ้าอยากรักกันนานควรตัดความขุ่นข้องหมองใจออกไป','ควรวัดความยาวก่อนตัดผ้า','ควรเลิกคบเพื่อนที่ทำผิด','ควรเก็บความโกรธไว้ในใจ'], correct:0, explain:'สอนให้ตัดเรื่องบาดหมางออก ความสัมพันธ์จึงจะยืนยาว', tier:1},
      {q:'"สุภาษิต" ต่างจาก "สำนวน" อย่างไร?', emoji:'📖', choices:['สุภาษิตมีคำสอนให้ประพฤติดีอยู่ในตัว','สุภาษิตต้องยาวกว่าเสมอ','สำนวนใช้ได้เฉพาะในบทกลอน','สำนวนต้องมีคำคล้องจองเสมอ'], correct:0, explain:'สุภาษิตมุ่งสอนใจให้ทำความดี ส่วนสำนวนเป็นถ้อยคำเปรียบเทียบ', tier:1},
      {q:'"ขี่ช้างจับตั๊กแตน" หมายความว่าอย่างไร?', emoji:'🐘', choices:['ลงทุนมากแต่ได้ผลเล็กน้อย','ทำงานใหญ่ได้สำเร็จ','ใช้ของใหญ่ให้คุ้มค่า','เลี้ยงสัตว์หลายชนิด'], correct:0, explain:'เปรียบการใช้ทรัพยากรมากเกินไปกับงานเล็กๆ', tier:2},
      {q:'"หนีเสือปะจระเข้" หมายความว่าอย่างไร?', emoji:'🐊', choices:['หนีภัยหนึ่งไปเจออีกภัยหนึ่ง','หนีได้อย่างปลอดภัย','กล้าสู้กับสัตว์ร้าย','เลือกทางที่ดีที่สุด'], correct:0, explain:'เปรียบการหลบปัญหาหนึ่งแล้วไปพบปัญหาใหม่ที่ไม่ต่างกัน', tier:2},
      {q:'ในกาพย์ยานี 11 คำสุดท้ายของวรรคหน้าส่งสัมผัสไปยังคำใดของวรรคหลัง?', emoji:'🔗', choices:['คำที่ 3','คำที่ 1','คำที่ 6','คำสุดท้าย'], correct:0, explain:'คำสุดท้ายวรรคหน้าสัมผัสกับคำที่ 3 ของวรรคหลัง', tier:2},
      {q:'"น้ำพึ่งเรือ เสือพึ่งป่า" สอนเรื่องอะไร?', emoji:'🛶', choices:['คนเราต้องพึ่งพาอาศัยซึ่งกันและกัน','ควรอยู่ตัวคนเดียว','ป่าเป็นที่อยู่ของเสือ','เรือต้องอยู่ในน้ำเสมอ'], correct:0, explain:'เปรียบความสัมพันธ์ที่ต่างฝ่ายต่างต้องพึ่งพากัน', tier:2},
      {q:'"ฝนตกไม่ทั่วฟ้า" หมายความว่าอย่างไร?', emoji:'🌦️', choices:['ให้ความช่วยเหลือหรือแบ่งปันได้ไม่ทั่วถึงทุกคน','ฝนตกเฉพาะฤดูฝน','ฟ้ากว้างเกินกว่าฝนจะตกได้','ทุกคนได้รับเท่าเทียมกัน'], correct:0, explain:'เปรียบการดูแลที่ไม่อาจทั่วถึงทุกคนได้', tier:2},
      {q:'"ตำน้ำพริกละลายแม่น้ำ" หมายความว่าอย่างไร?', emoji:'🌊', choices:['ลงทุนไปมากแต่ไม่ได้ประโยชน์','ทำอาหารให้คนหมู่มาก','แบ่งปันของให้ทุกคน','ประหยัดค่าใช้จ่ายได้ดี'], correct:0, explain:'เปรียบการใช้ทรัพย์ลงไปแล้วสูญเปล่าเหมือนน้ำพริกที่ละลายหายไปในแม่น้ำ', tier:2},
      {q:'กาพย์ยานี 11 หนึ่งบาทมีกี่คำ?', emoji:'🔢', choices:['11 คำ','9 คำ','8 คำ','12 คำ'], correct:0, explain:'วรรคหน้า 5 คำ + วรรคหลัง 6 คำ = 11 คำ จึงเรียกว่ายานี 11', tier:2},
      {q:'"เข็นครกขึ้นภูเขา" หมายความว่าอย่างไร?', emoji:'⛰️', choices:['ทำงานที่ยากลำบากเกินกำลัง','ออกกำลังกายบนภูเขา','ทำงานง่ายให้เสร็จเร็ว','ช่วยกันยกของหนัก'], correct:0, explain:'เปรียบงานที่หนักหนาและยากจะสำเร็จ', tier:2},
      {q:'"วัวหายล้อมคอก" หมายความว่าอย่างไร?', emoji:'🐄', choices:['แก้ไขเมื่อเกิดความเสียหายไปแล้ว','ป้องกันไว้ก่อนเกิดเหตุ','เลี้ยงวัวไว้ในคอก','ตามหาของที่หายไป'], correct:0, explain:'เปรียบการเริ่มป้องกันหลังจากเสียหายไปแล้ว ซึ่งสายเกินไป', tier:2},
      {q:'"ชี้โพรงให้กระรอก" หมายความว่าอย่างไร?', emoji:'🐿️', choices:['บอกช่องทางให้คนคิดไม่ดีทำผิดได้ง่ายขึ้น','ช่วยสัตว์หาที่อยู่','สอนเพื่อนให้ทำการบ้าน','ชี้ทางกลับบ้านให้คนหลงทาง'], correct:0, explain:'เปรียบการบอกช่องโหว่ให้ผู้ที่จ้องจะทำผิดอยู่แล้ว', tier:3},
      {q:'"กว่าถั่วจะสุกงาก็ไหม้" หมายความว่าอย่างไร?', emoji:'🔥', choices:['ทำอะไรช้าเกินไปจนเสียหายอีกอย่างหนึ่ง','ทำอาหารพร้อมกันหลายอย่าง','รอคอยแล้วได้ผลดี','ทำงานเร็วจนผิดพลาด'], correct:0, explain:'มัวสนใจสิ่งหนึ่งจนอีกสิ่งเสียหายไปพร้อมกัน', tier:3},
      {q:'"รู้หลบเป็นปีก รู้หลีกเป็นหาง" สอนเรื่องอะไร?', emoji:'🕊️', choices:['รู้จักหลบหลีกอันตรายอย่างชาญฉลาด','ควรสู้ทุกเรื่องไม่ถอย','ควรบินหนีเสมอ','ควรซ่อนตัวตลอดเวลา'], correct:0, explain:'สอนให้รู้จักผ่อนหนักผ่อนเบาและเลี่ยงภัยเป็น', tier:3},
      {q:'"น้ำนิ่งไหลลึก" หมายความว่าอย่างไร?', emoji:'🌊', choices:['คนเงียบขรึมมักมีความคิดลึกซึ้ง','น้ำที่นิ่งจะตื้นเสมอ','คนพูดมากคือคนเก่ง','น้ำลึกจะไหลแรง'], correct:0, explain:'เปรียบคนที่พูดน้อยแต่มีความคิดและความสามารถมาก', tier:3},
      {q:'บทกาพย์ยานี 11 นิยมใช้แต่งเรื่องประเภทใด?', emoji:'📖', choices:['บทพรรณนาและบทเล่าเรื่องที่ต้องการความไพเราะ','เอกสารราชการ','ป้ายประกาศในโรงเรียน','ใบเสร็จรับเงิน'], correct:0, explain:'กาพย์ยานี 11 มีจังหวะไพเราะ เหมาะกับบทพรรณนาและการเล่าเรื่อง', tier:3},
      {q:'เพื่อนเตือนแล้วไม่ฟังจนของเสียหาย เหตุการณ์นี้ตรงกับสำนวนใด?', emoji:'💔', choices:['วัวหายล้อมคอก','น้ำขึ้นให้รีบตัก','ปิดทองหลังพระ','น้ำพึ่งเรือ เสือพึ่งป่า'], correct:0, explain:'มาแก้ไขเมื่อเสียหายไปแล้ว ตรงกับ "วัวหายล้อมคอก"', tier:3}
    ]
  },
  {
    id:'p5-thai4', name:'ภาษาไทย ป.5 · จับใจความและแยกข้อคิดเห็น', emoji:'📄', icon:'assets/icons/p5-thai4.svg', color:'#C22E7E', light:'#FCE0EF', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ข้อใดเป็น "ข้อเท็จจริง"?', emoji:'🔬', choices:['น้ำเดือดที่อุณหภูมิ 100 องศาเซลเซียส','ส้มตำอร่อยที่สุดในโลก','สีฟ้าสวยกว่าสีแดง','วันจันทร์เป็นวันที่น่าเบื่อ'], correct:0, explain:'ข้อเท็จจริงคือสิ่งที่พิสูจน์หรือตรวจสอบได้ว่าจริง', tier:1},
      {q:'ข้อใดเป็น "ข้อคิดเห็น"?', emoji:'💭', choices:['ส้มตำเป็นอาหารที่อร่อยที่สุด','ประเทศไทยอยู่ในทวีปเอเชีย','หนึ่งสัปดาห์มี 7 วัน','ดวงอาทิตย์ให้แสงสว่าง'], correct:0, explain:'"อร่อยที่สุด" เป็นความรู้สึกของผู้พูด จึงเป็นข้อคิดเห็น', tier:1},
      {q:'ข้อเท็จจริงคืออะไร?', emoji:'✅', choices:['เรื่องที่ตรวจสอบหรือพิสูจน์ได้ว่าเป็นจริง','ความรู้สึกส่วนตัวของผู้เขียน','เรื่องที่แต่งขึ้นให้สนุก','คำทำนายอนาคต'], correct:0, explain:'ข้อเท็จจริงต้องพิสูจน์ได้ ไม่ขึ้นกับความรู้สึกของใคร', tier:1},
      {q:'ข้อคิดเห็นคืออะไร?', emoji:'💬', choices:['ความรู้สึกหรือความเชื่อของผู้พูด','ตัวเลขที่วัดได้','เหตุการณ์ที่เกิดขึ้นจริง','กฎของธรรมชาติ'], correct:0, explain:'ข้อคิดเห็นสะท้อนมุมมองของผู้พูด แต่ละคนอาจเห็นต่างกันได้', tier:1},
      {q:'เมื่ออ่านคำแนะนำการใช้สิ่งของ ควรทำสิ่งใดก่อน?', emoji:'📋', choices:['อ่านให้ครบทุกขั้นตอนก่อนลงมือทำ','ลงมือทำก่อนแล้วค่อยอ่าน','ข้ามไปอ่านขั้นตอนสุดท้าย','ให้คนอื่นอ่านแทน'], correct:0, explain:'อ่านครบทุกขั้นตอนก่อนช่วยให้ทำได้ถูกต้องและปลอดภัย', tier:1},
      {q:'"ใจความสำคัญ" ของเรื่องคือส่วนใด?', emoji:'🎯', choices:['เนื้อหาหลักที่เรื่องต้องการบอก','ชื่อผู้แต่งของเรื่อง','คำที่ยาวที่สุดในเรื่อง','ประโยคสุดท้ายของเรื่องเสมอ'], correct:0, explain:'ใจความสำคัญคือแก่นของเรื่อง ตัดออกแล้วเรื่องจะขาดความหมาย', tier:1},
      {q:'"ดวงอาทิตย์ขึ้นทางทิศตะวันออก" เป็นข้อความประเภทใด?', emoji:'🌅', choices:['ข้อเท็จจริง','ข้อคิดเห็น','คำอุทาน','คำถาม'], correct:0, explain:'เป็นเรื่องที่สังเกตและตรวจสอบได้ จึงเป็นข้อเท็จจริง', tier:1},
      {q:'"ภาพยนตร์เรื่องนี้สนุกมาก" เป็นข้อความประเภทใด?', emoji:'🎬', choices:['ข้อคิดเห็น','ข้อเท็จจริง','คำสั่ง','คำขอร้อง'], correct:0, explain:'ความสนุกขึ้นกับความรู้สึกของแต่ละคน จึงเป็นข้อคิดเห็น', tier:1},
      {q:'การย่อความที่ดีควรมีลักษณะอย่างไร?', emoji:'✂️', choices:['เก็บใจความสำคัญไว้และตัดรายละเอียดที่ไม่จำเป็นออก','คัดลอกทุกประโยคมาไว้ทั้งหมด','เพิ่มความคิดเห็นของผู้ย่อลงไปมากๆ','เขียนให้ยาวกว่าเรื่องเดิม'], correct:0, explain:'ย่อความต้องสั้นลงแต่ยังครบใจความสำคัญของเรื่องเดิม', tier:1},
      {q:'"แดงตื่นสายจึงไปโรงเรียนไม่ทัน เขาจึงตั้งนาฬิกาปลุกไว้ตั้งแต่คืนก่อน" ข้อคิดที่ได้คือข้อใด?', emoji:'⏰', choices:['รู้จักแก้ไขข้อผิดพลาดของตนเอง','ควรตื่นสายทุกวัน','โรงเรียนเข้าเรียนสายได้','นาฬิกาปลุกไม่มีประโยชน์'], correct:0, explain:'แดงหาวิธีป้องกันไม่ให้ผิดพลาดซ้ำ จึงเป็นการแก้ไขตนเอง', tier:2},
      {q:'"โรงเรียนนี้มีนักเรียน 500 คน และเป็นโรงเรียนที่ดีที่สุดในจังหวัด" ส่วนใดเป็นข้อคิดเห็น?', emoji:'🏫', choices:['เป็นโรงเรียนที่ดีที่สุดในจังหวัด','มีนักเรียน 500 คน','โรงเรียนนี้','ในจังหวัด'], correct:0, explain:'"ดีที่สุด" เป็นการตัดสินตามความรู้สึก ส่วนจำนวนนักเรียนนับได้จริง', tier:2},
      {q:'คำแนะนำระบุว่า "ต้มน้ำให้เดือดก่อนใส่เส้น" ขั้นตอนแรกคือข้อใด?', emoji:'🍜', choices:['ต้มน้ำให้เดือด','ใส่เส้นลงไป','ปิดเตาแก๊ส','ตักใส่ชาม'], correct:0, explain:'คำว่า "ก่อน" บอกลำดับว่าต้องต้มน้ำให้เดือดเป็นอันดับแรก', tier:2},
      {q:'ข้อความที่มีคำว่า "น่าจะ" "ควร" หรือ "คิดว่า" มักเป็นข้อความประเภทใด?', emoji:'🤔', choices:['ข้อคิดเห็น','ข้อเท็จจริง','คำสั่ง','คำอุทาน'], correct:0, explain:'คำเหล่านี้แสดงการคาดเดาหรือความเห็นของผู้พูด', tier:2},
      {q:'"ฝนตกหนักทำให้ถนนลื่น ควรขับรถให้ช้าลง" ประโยคนี้ให้ข้อมูลแบบใด?', emoji:'🌧️', choices:['ข้อเท็จจริงพร้อมคำแนะนำ','ข้อคิดเห็นล้วนๆ','คำอุทานแสดงความตกใจ','คำถามชวนคิด'], correct:0, explain:'ครึ่งแรกเป็นข้อเท็จจริง ครึ่งหลังเป็นคำแนะนำให้ปฏิบัติ', tier:2},
      {q:'ก่อนอ่านแผนภูมิหรือกราฟ ควรดูส่วนใดก่อน?', emoji:'📊', choices:['ชื่อเรื่องและหน่วยของข้อมูล','สีของแท่งกราฟ','ขนาดของกระดาษ','จำนวนหน้าทั้งหมด'], correct:0, explain:'ชื่อเรื่องและหน่วยบอกว่ากราฟกำลังนำเสนอข้อมูลอะไร', tier:2},
      {q:'"แม่บอกว่าอย่ากินขนมก่อนอาหาร เพราะจะทำให้กินข้าวไม่ลง" เหตุผลคือข้อใด?', emoji:'🍪', choices:['กินขนมก่อนทำให้อิ่มจนกินข้าวไม่ได้','ขนมมีราคาแพง','แม่ไม่ชอบขนม','ขนมทำให้ฟันขาว'], correct:0, explain:'คำว่า "เพราะ" นำหน้าเหตุผลที่แม่บอกไว้ในประโยค', tier:2},
      {q:'การอ่านเพื่อจับใจความควรทำอย่างไร?', emoji:'👀', choices:['อ่านทั้งเรื่องแล้วสรุปว่าใคร ทำอะไร ที่ไหน อย่างไร','อ่านเฉพาะประโยคแรกประโยคเดียว','ท่องจำทุกคำในเรื่อง','ดูแต่ภาพประกอบ'], correct:0, explain:'การตอบคำถามว่าใคร ทำอะไร ที่ไหน ช่วยจับใจความได้ครบถ้วน', tier:2},
      {q:'"เมื่อวานฝนตก 3 ชั่วโมง ฉันคิดว่าพรุ่งนี้ฝนคงตกอีก" ส่วนใดเป็นข้อคิดเห็น?', emoji:'☔', choices:['ฉันคิดว่าพรุ่งนี้ฝนคงตกอีก','เมื่อวานฝนตก','ฝนตก 3 ชั่วโมง','เมื่อวาน'], correct:0, explain:'"ฉันคิดว่า" เป็นการคาดเดา ยังไม่เกิดขึ้นจริง', tier:2},
      {q:'"ต้นไม้ในสวนสาธารณะช่วยลดฝุ่นและให้ร่มเงา เราจึงควรช่วยกันปลูกต้นไม้" ใจความสำคัญคือข้อใด?', emoji:'🌳', choices:['ต้นไม้มีประโยชน์ เราจึงควรช่วยกันปลูก','สวนสาธารณะมีขนาดใหญ่','ฝุ่นเกิดจากรถยนต์','ร่มเงาทำให้อากาศเย็น'], correct:0, explain:'ทั้งย่อหน้าต้องการบอกว่าต้นไม้มีประโยชน์จึงควรปลูกเพิ่ม', tier:3},
      {q:'ฉลากยาระบุว่า "รับประทานหลังอาหารทันที ครั้งละ 1 เม็ด" ถ้ากินข้าวเย็นเสร็จเวลา 18.00 น. ควรกินยาเมื่อใด?', emoji:'💊', choices:['ทันทีหลังกินข้าวเสร็จ','ก่อนกินข้าว 1 ชั่วโมง','ก่อนเข้านอนตอนดึก','ตอนเช้าของวันถัดไป'], correct:0, explain:'ฉลากระบุว่าให้กิน "หลังอาหารทันที" จึงต้องกินหลังมื้อนั้นเลย', tier:3},
      {q:'โฆษณาบอกว่า "กินแล้วเรียนเก่งขึ้นทันที" ควรทำอย่างไร?', emoji:'📺', choices:['ตรวจสอบข้อมูลจากแหล่งที่เชื่อถือได้ก่อนเชื่อ','เชื่อทันทีเพราะโฆษณาบอก','บอกต่อให้เพื่อนทุกคนซื้อ','ซื้อมาลองหลายกล่อง'], correct:0, explain:'คำโฆษณาเกินจริงควรตรวจสอบความน่าเชื่อถือก่อนตัดสินใจ', tier:3},
      {q:'ข้อใดเป็นการสรุปเรื่องที่ดี?', emoji:'📝', choices:['สั้น กระชับ ครบใจความสำคัญ และไม่เติมความเห็นส่วนตัว','ยาวกว่าเรื่องเดิมเพื่อความละเอียด','เลือกเล่าเฉพาะตอนที่ชอบ','ใส่ความคิดเห็นของตัวเองให้มากที่สุด'], correct:0, explain:'การสรุปต้องคงใจความเดิมไว้โดยไม่บิดเบือนด้วยความเห็นของผู้สรุป', tier:3},
      {q:'"เด็กชายเก็บกระเป๋าเงินได้แล้วนำไปคืนเจ้าของ" ข้อคิดที่ได้จากเรื่องนี้คือข้อใด?', emoji:'👜', choices:['ความซื่อสัตย์','ความขยัน','ความกล้าหาญ','ความประหยัด'], correct:0, explain:'การคืนของที่เก็บได้แสดงถึงความซื่อสัตย์', tier:3},
      {q:'อ่านข้อความ "ห้องสมุดเปิด 08.00-16.00 น. ยกเว้นวันหยุดราชการ" ถ้าวันนี้เป็นวันหยุดราชการ จะเกิดอะไรขึ้น?', emoji:'📚', choices:['ห้องสมุดปิด ไม่สามารถเข้าใช้ได้','ห้องสมุดเปิดถึงเที่ยงคืน','ห้องสมุดเปิดเฉพาะตอนเช้า','ห้องสมุดเปิดตามปกติ'], correct:0, explain:'คำว่า "ยกเว้นวันหยุดราชการ" หมายความว่าวันนั้นไม่เปิดให้บริการ', tier:3}
    ]
  },
  /* ---------- English ป.5 : 3 หมวด ---------- */
  {
    id:'p5-eng1', name:'English ป.5 · Jobs & Ordinal Numbers', emoji:'🥇', icon:'assets/icons/p5-eng1.svg', color:'#0FB5AE', light:'#D5F5F2', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'A person who teaches students is a ___.', emoji:'👩‍🏫', choices:['teacher','farmer','pilot','singer'], correct:0, explain:'teacher = ครู ผู้สอนนักเรียน', tier:1},
      {q:'What is the ordinal number for 1?', emoji:'🥇', choices:['first','one','once','oneth'], correct:0, explain:'ลำดับที่ 1 คือ first (1st)', tier:1},
      {q:'A person who helps sick people in a hospital is a ___.', emoji:'👩‍⚕️', choices:['doctor','driver','painter','baker'], correct:0, explain:'doctor = หมอ ทำงานในโรงพยาบาล', tier:1},
      {q:'How do you read "3rd"?', emoji:'🥉', choices:['third','three','threeth','thirdth'], correct:0, explain:'3rd อ่านว่า third แปลว่าลำดับที่สาม', tier:1},
      {q:'Who cooks food in a restaurant?', emoji:'👨‍🍳', choices:['a cook','a nurse','a pilot','a farmer'], correct:0, explain:'cook (หรือ chef) คือคนทำอาหารในร้านอาหาร', tier:1},
      {q:'How do you read "2nd"?', emoji:'🥈', choices:['second','two','twoth','secondth'], correct:0, explain:'2nd อ่านว่า second แปลว่าลำดับที่สอง', tier:1},
      {q:'A person who flies an airplane is a ___.', emoji:'✈️', choices:['pilot','police officer','dentist','waiter'], correct:0, explain:'pilot = นักบิน', tier:1},
      {q:'Complete: "I am ___ engineer."', emoji:'👷', choices:['an','a','the','some'], correct:0, explain:'engineer ขึ้นต้นด้วยเสียงสระ จึงใช้ an', tier:1},
      {q:'What is the ordinal number for 5?', emoji:'🖐️', choices:['fifth','five','fiveth','fifteen'], correct:0, explain:'ลำดับที่ 5 คือ fifth (5th)', tier:1},
      {q:'A person who grows rice and vegetables is a ___.', emoji:'👨‍🌾', choices:['farmer','driver','dentist','singer'], correct:0, explain:'farmer = ชาวนา ชาวสวน', tier:2},
      {q:'How do you read "12th"?', emoji:'🔢', choices:['twelfth','twelveth','twelve','twoth'], correct:0, explain:'12th อ่านว่า twelfth', tier:2},
      {q:'Somchai finished number 4 in the race. He is the ___.', emoji:'🏃', choices:['fourth','four','fourty','fourteen'], correct:0, explain:'ลำดับที่ 4 คือ fourth', tier:2},
      {q:'A person who puts out fires is a ___.', emoji:'🚒', choices:['firefighter','fisherman','farmer','photographer'], correct:0, explain:'firefighter = นักดับเพลิง', tier:2},
      {q:'How do you read "9th"?', emoji:'🔢', choices:['ninth','nineth','nine','ninety'], correct:0, explain:'9th อ่านว่า ninth (ตัด e ออก)', tier:2},
      {q:'Which question asks about someone’s job?', emoji:'❓', choices:['What do you do?','How old are you?','Where do you live?','What time is it?'], correct:0, explain:'"What do you do?" คือการถามว่าทำงานอะไร', tier:2},
      {q:'How do you read "20th"?', emoji:'🔢', choices:['twentieth','twentyth','twenty','twelveth'], correct:0, explain:'20th อ่านว่า twentieth', tier:2},
      {q:'A person who cuts hair is a ___.', emoji:'💇', choices:['hairdresser','librarian','farmer','pilot'], correct:0, explain:'hairdresser (หรือ barber) = ช่างตัดผม', tier:2},
      {q:'How do you write the ordinal number for 3?', emoji:'✏️', choices:['3rd','3th','3nd','3st'], correct:0, explain:'ลำดับที่ 3 เขียนว่า 3rd', tier:2},
      {q:'Complete: "My birthday is on the ___ of May." (21)', emoji:'🎂', choices:['twenty-first','twenty-one','twentyth-first','twenty-oneth'], correct:0, explain:'21st อ่านว่า twenty-first', tier:3},
      {q:'A person who designs buildings is an ___.', emoji:'🏗️', choices:['architect','actor','athlete','author'], correct:0, explain:'architect = สถาปนิก ผู้ออกแบบอาคาร', tier:3},
      {q:'Which sentence is correct?', emoji:'✅', choices:['She is a nurse. She works in a hospital.','She is a nurse. She work in a hospital.','She a nurse. She works in hospital.','She is nurse. She working in a hospital.'], correct:0, explain:'ประธานเอกพจน์ She ต้องใช้ works และ a nurse ต้องมี article', tier:3},
      {q:'Complete: "August is the ___ month of the year."', emoji:'📅', choices:['eighth','eight','eighteenth','eightth'], correct:0, explain:'สิงหาคมเป็นเดือนที่ 8 คือ eighth', tier:3},
      {q:'A person who repairs cars is a ___.', emoji:'🔧', choices:['mechanic','musician','manager','model'], correct:0, explain:'mechanic = ช่างซ่อมรถ', tier:3},
      {q:'In a race with 8 runners, the last runner is the ___.', emoji:'🏁', choices:['eighth','eight','eighteenth','last one'], correct:0, explain:'คนสุดท้ายจากทั้งหมด 8 คน คือลำดับที่ 8 = eighth', tier:3}
    ]
  },
  {
    id:'p5-eng2', name:'English ป.5 · Going to & Because', emoji:'✍️', icon:'assets/icons/p5-eng2.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'Complete: "I ___ going to visit my grandma tomorrow."', emoji:'👵', choices:['am','is','are','be'], correct:0, explain:'ประธาน I ใช้ am เสมอ', tier:1},
      {q:'Complete: "They are going to ___ football."', emoji:'⚽', choices:['play','plays','played','playing'], correct:0, explain:'หลัง going to ใช้กริยาช่องที่ 1 เสมอ', tier:1},
      {q:'Complete: "I like ice cream ___ it is sweet."', emoji:'🍦', choices:['because','but','or','so that'], correct:0, explain:'because ใช้บอกเหตุผล', tier:1},
      {q:'Which word joins two sentences together?', emoji:'🔗', choices:['and','very','pretty','quickly'], correct:0, explain:'and เป็นคำเชื่อมประโยคเข้าด้วยกัน', tier:1},
      {q:'Complete: "She ___ going to school by bus tomorrow."', emoji:'🚌', choices:['is','am','are','be'], correct:0, explain:'ประธาน She ใช้ is', tier:1},
      {q:'"Are you going to study tonight?" — "Yes, I ___."', emoji:'📚', choices:['am','is','are','do'], correct:0, explain:'ตอบรับคำถาม Are you...? ด้วย Yes, I am.', tier:1},
      {q:'Complete: "It is raining, ___ we stay at home."', emoji:'🌧️', choices:['so','because','but','or'], correct:0, explain:'so ใช้บอกผลที่ตามมา', tier:1},
      {q:'Complete: "I want to sleep ___ I am tired."', emoji:'😴', choices:['because','and','or','so'], correct:0, explain:'because นำหน้าเหตุผลว่าทำไมอยากนอน', tier:1},
      {q:'Which one is a compound sentence?', emoji:'🔗', choices:['I like cats and my sister likes dogs.','I like cats.','My sister likes dogs.','Very cute cats.'], correct:0, explain:'ประโยคผสมมีสองประโยคเชื่อมด้วยคำเชื่อม เช่น and', tier:1},
      {q:'Complete: "We are going to ___ a movie this weekend."', emoji:'🎬', choices:['watch','watches','watched','watching'], correct:0, explain:'หลัง going to ใช้กริยารูปเดิม (watch)', tier:2},
      {q:'Complete: "He is going to buy a book, ___ he has no money."', emoji:'📕', choices:['but','and','because','so'], correct:0, explain:'but ใช้เชื่อมข้อความที่ขัดแย้งกัน', tier:2},
      {q:'Which question is correct?', emoji:'❓', choices:['Is she going to come tomorrow?','Is she going come tomorrow?','She is going to come tomorrow?','Does she going to come tomorrow?'], correct:0, explain:'คำถามรูป going to ให้เอา verb to be ขึ้นต้นประโยค', tier:2},
      {q:'Complete: "I am happy ___ I got a good grade."', emoji:'😄', choices:['because','but','or','after'], correct:0, explain:'because นำหน้าเหตุผลของความรู้สึก', tier:2},
      {q:'Make it negative: "They ___ going to play outside."', emoji:'🚫', choices:['are not','do not','is not','not are'], correct:0, explain:'ประธาน They ใช้ are not (aren’t) going to', tier:2},
      {q:'Complete: "Do you want tea ___ coffee?"', emoji:'☕', choices:['or','and','but','because'], correct:0, explain:'or ใช้ให้เลือกอย่างใดอย่างหนึ่ง', tier:2},
      {q:'Complete: "She is going to be a doctor ___ she loves helping people."', emoji:'👩‍⚕️', choices:['because','but','or','so'], correct:0, explain:'because อธิบายเหตุผลที่อยากเป็นหมอ', tier:2},
      {q:'Which sentence talks about the future?', emoji:'🔮', choices:['I am going to visit Chiang Mai next month.','I visited Chiang Mai last year.','I live in Chiang Mai.','I liked Chiang Mai.'], correct:0, explain:'going to + next month บอกแผนการในอนาคต', tier:2},
      {q:'Complete: "My mother cooks dinner ___ my father washes the dishes."', emoji:'🍽️', choices:['and','because','but','or'], correct:0, explain:'and เชื่อมสองเหตุการณ์ที่เกิดคู่กัน', tier:2},
      {q:'Complete: "What are you going to do ___ Sunday?"', emoji:'📅', choices:['on','in','at','of'], correct:0, explain:'ใช้ on กับวันในสัปดาห์ เช่น on Sunday', tier:3},
      {q:'Complete: "I could not go to school ___ I was sick."', emoji:'🤒', choices:['because','so','and','or'], correct:0, explain:'because บอกสาเหตุที่ไปโรงเรียนไม่ได้', tier:3},
      {q:'Join these sentences: "It was hot. We went swimming."', emoji:'🏊', choices:['It was hot, so we went swimming.','It was hot, because we went swimming.','It was hot or we went swimming.','It was hot but we went swimming.'], correct:0, explain:'ร้อนเป็นสาเหตุ ว่ายน้ำเป็นผล จึงใช้ so', tier:3},
      {q:'Complete: "They are not going to ___ late today."', emoji:'⏰', choices:['be','are','being','been'], correct:0, explain:'หลัง going to ใช้กริยารูปเดิมเสมอ คือ be', tier:3},
      {q:'Which is a correct answer to "Why do you like English?"', emoji:'💬', choices:['Because it is fun.','Yes, I do.','I am fine, thank you.','At school.'], correct:0, explain:'คำถาม Why ต้องตอบด้วยเหตุผล ขึ้นต้นด้วย Because', tier:3},
      {q:'Complete: "First, wash your hands. ___, dry them with a towel."', emoji:'🧼', choices:['Then','Because','But','So'], correct:0, explain:'Then ใช้บอกลำดับขั้นตอนถัดไป', tier:3}
    ]
  },
  {
    id:'p5-eng3', name:'English ป.5 · Reading Comprehension', emoji:'📑', icon:'assets/icons/p5-eng3.svg', color:'#0A7A75', light:'#D5F5F2', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'"Anna is 11 years old. She likes reading books." How old is Anna?', emoji:'👧', choices:['11 years old','10 years old','12 years old','1 year old'], correct:0, explain:'ประโยคแรกบอกว่า Anna is 11 years old.', tier:1},
      {q:'"Anna is 11 years old. She likes reading books." What does Anna like?', emoji:'📚', choices:['reading books','playing football','cooking food','riding a bike'], correct:0, explain:'She likes reading books. = ชอบอ่านหนังสือ', tier:1},
      {q:'"The market opens at 6 a.m. and closes at 5 p.m." When does the market open?', emoji:'🏪', choices:['at 6 a.m.','at 5 p.m.','at 6 p.m.','at 5 a.m.'], correct:0, explain:'opens at 6 a.m. = เปิดเวลา 6 โมงเช้า', tier:1},
      {q:'"Tom goes to school by bicycle." How does Tom go to school?', emoji:'🚲', choices:['by bicycle','by bus','by car','on foot'], correct:0, explain:'by bicycle = โดยจักรยาน', tier:1},
      {q:'"It is Monday. Ben has a music class today." What day is it?', emoji:'📅', choices:['Monday','Sunday','Friday','Saturday'], correct:0, explain:'ประโยคแรกบอกว่า It is Monday.', tier:1},
      {q:'"Mali lives in Chiang Mai with her family." Where does Mali live?', emoji:'🏠', choices:['in Chiang Mai','in Bangkok','in Phuket','in Khon Kaen'], correct:0, explain:'lives in Chiang Mai = อาศัยอยู่เชียงใหม่', tier:1},
      {q:'"The cat is sleeping under the table." Where is the cat?', emoji:'🐱', choices:['under the table','on the table','in the box','behind the door'], correct:0, explain:'under the table = ใต้โต๊ะ', tier:1},
      {q:'"Dad cooks breakfast every morning." Who cooks breakfast?', emoji:'🍳', choices:['Dad','Mom','Grandma','The teacher'], correct:0, explain:'Dad cooks breakfast. = พ่อเป็นคนทำอาหารเช้า', tier:1},
      {q:'"The library is next to the school." What is next to the school?', emoji:'📖', choices:['the library','the hospital','the market','the park'], correct:0, explain:'next to = อยู่ติดกับ ดังนั้นห้องสมุดอยู่ติดโรงเรียน', tier:1},
      {q:'"Nid woke up late. She missed the school bus, so her mother drove her to school." Why did her mother drive her?', emoji:'🚗', choices:['Because Nid missed the school bus.','Because the school was closed.','Because Nid was sick.','Because it was a holiday.'], correct:0, explain:'so เชื่อมเหตุ (พลาดรถโรงเรียน) กับผล (แม่ขับรถไปส่ง)', tier:2},
      {q:'"We will have a picnic on Saturday if it does not rain." When is the picnic?', emoji:'🧺', choices:['on Saturday','on Sunday','on Monday','every day'], correct:0, explain:'on Saturday = วันเสาร์ (ถ้าฝนไม่ตก)', tier:2},
      {q:'"Peter has three pets: two cats and one dog." How many cats does Peter have?', emoji:'🐈', choices:['two','one','three','four'], correct:0, explain:'two cats = แมวสองตัว', tier:2},
      {q:'"The shop is closed on Sunday." Can you buy things there on Sunday?', emoji:'🛍️', choices:['No, the shop is closed.','Yes, all day.','Yes, only in the morning.','Yes, only in the evening.'], correct:0, explain:'closed on Sunday = วันอาทิตย์ร้านปิด', tier:2},
      {q:'"Sara likes math best, but she thinks science is difficult." Which subject does Sara like best?', emoji:'🔢', choices:['math','science','English','art'], correct:0, explain:'likes math best = ชอบคณิตศาสตร์มากที่สุด', tier:2},
      {q:'"First, put the bread on the plate. Then, spread the butter." What do you do first?', emoji:'🍞', choices:['Put the bread on the plate.','Spread the butter.','Eat the bread.','Wash the plate.'], correct:0, explain:'First = อันดับแรก คือวางขนมปังบนจาน', tier:2},
      {q:'"The train leaves at 9:30 and arrives at 11:00." How long is the trip?', emoji:'🚆', choices:['one hour and a half','one hour','two hours','thirty minutes'], correct:0, explain:'จาก 9:30 ถึง 11:00 คือ 1 ชั่วโมง 30 นาที', tier:2},
      {q:'"Tim was happy because he won the running race." Why was Tim happy?', emoji:'🏆', choices:['Because he won the race.','Because he was tired.','Because he was late.','Because it was raining.'], correct:0, explain:'because he won the running race = เพราะชนะการแข่งวิ่ง', tier:2},
      {q:'"Please be quiet in the library." Where should you be quiet?', emoji:'🤫', choices:['in the library','in the playground','on the bus','at the market'], correct:0, explain:'in the library = ในห้องสมุด', tier:2},
      {q:'"Ken studies English every evening. He wants to travel abroad next year." Why does Ken study English?', emoji:'🌏', choices:['Because he wants to travel abroad.','Because he likes to sleep late.','Because his friend told him to.','Because he lives abroad now.'], correct:0, explain:'ประโยคที่สองบอกเหตุผล คืออยากไปเที่ยวต่างประเทศ', tier:3},
      {q:'"The weather report says it will be cold and windy tomorrow." What should you bring tomorrow?', emoji:'🧥', choices:['a warm jacket','a swimming suit','a fan','sunglasses only'], correct:0, explain:'อากาศหนาวและลมแรง จึงควรเตรียมเสื้อกันหนาว', tier:3},
      {q:'"Mina has 50 baht. She buys a pen for 20 baht." How much money does she have left?', emoji:'💰', choices:['30 baht','20 baht','70 baht','50 baht'], correct:0, explain:'50 − 20 = 30 baht', tier:3},
      {q:'"Class starts at 8:00. Ann arrives at 8:15." Is Ann late?', emoji:'⏰', choices:['Yes, she is 15 minutes late.','No, she is early.','No, she is on time.','Yes, she is one hour late.'], correct:0, explain:'มาถึง 8:15 ทั้งที่เริ่มเรียน 8:00 จึงสาย 15 นาที', tier:3},
      {q:'"Do not run near the swimming pool because the floor is wet." Why should you not run?', emoji:'🏊', choices:['Because the wet floor is slippery.','Because running is not fun.','Because the pool is closed.','Because it is too hot.'], correct:0, explain:'because the floor is wet = พื้นเปียกจึงลื่นและอันตราย', tier:3},
      {q:'"My grandfather was a farmer. Now he is a teacher." What is his job now?', emoji:'👴', choices:['He is a teacher.','He is a farmer.','He is a doctor.','He is a driver.'], correct:0, explain:'Now he is a teacher. = ปัจจุบันเป็นครู', tier:3}
    ]
  },
  /* ---------- สังคมศึกษา ป.5 : 4 หมวด ---------- */
  {
    id:'p5-social1', name:'สังคม ป.5 · ภูมิภาคของไทยและพิกัดภูมิศาสตร์', emoji:'🌐', icon:'assets/icons/p5-social1.svg', color:'#F6A609', light:'#FEEFC9', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'เส้นสมมติที่ลากรอบโลกในแนวขนานกับเส้นศูนย์สูตรเรียกว่าอะไร?', emoji:'🌐', choices:['เส้นละติจูด','เส้นลองจิจูด','เส้นทางรถไฟ','เส้นแบ่งเขตจังหวัด'], correct:0, explain:'เส้นละติจูดลากในแนวนอน ขนานกับเส้นศูนย์สูตร บอกตำแหน่งเหนือ-ใต้', tier:1},
      {q:'เส้นสมมติที่ลากจากขั้วโลกเหนือไปขั้วโลกใต้เรียกว่าอะไร?', emoji:'🧭', choices:['เส้นลองจิจูด','เส้นละติจูด','เส้นศูนย์สูตร','เส้นแบ่งเวลา'], correct:0, explain:'เส้นลองจิจูดลากในแนวตั้ง บอกตำแหน่งตะวันออก-ตะวันตก', tier:1},
      {q:'เส้นศูนย์สูตรมีค่าละติจูดเท่าไร?', emoji:'0️⃣', choices:['0 องศา','90 องศา','180 องศา','45 องศา'], correct:0, explain:'เส้นศูนย์สูตรเป็นเส้นละติจูด 0 องศา แบ่งโลกเป็นซีกเหนือกับซีกใต้', tier:1},
      {q:'จังหวัดใดอยู่ในภาคเหนือของประเทศไทย?', emoji:'⛰️', choices:['เชียงใหม่','สงขลา','ชลบุรี','ขอนแก่น'], correct:0, explain:'เชียงใหม่เป็นจังหวัดในภาคเหนือ', tier:1},
      {q:'แม่น้ำสายใดเป็นแม่น้ำสำคัญของภาคกลาง?', emoji:'🏞️', choices:['แม่น้ำเจ้าพระยา','แม่น้ำโขง','แม่น้ำตาปี','แม่น้ำวัง'], correct:0, explain:'แม่น้ำเจ้าพระยาไหลผ่านที่ราบภาคกลาง เป็นแหล่งน้ำสำคัญของการเกษตร', tier:1},
      {q:'ภาคใดของไทยมีทะเลขนาบทั้งสองด้าน?', emoji:'🏝️', choices:['ภาคใต้','ภาคเหนือ','ภาคกลาง','ภาคตะวันออกเฉียงเหนือ'], correct:0, explain:'ภาคใต้มีอ่าวไทยทางตะวันออกและทะเลอันดามันทางตะวันตก', tier:1},
      {q:'เข็มทิศใช้บอกสิ่งใด?', emoji:'🧭', choices:['ทิศทาง','อุณหภูมิ','ความสูง','เวลา'], correct:0, explain:'เข็มทิศชี้ทิศเหนือ ช่วยให้รู้ทิศทางในการเดินทาง', tier:1},
      {q:'สัญลักษณ์สีน้ำเงินในแผนที่มักหมายถึงอะไร?', emoji:'🗺️', choices:['แหล่งน้ำ','ภูเขา','ป่าไม้','ถนน'], correct:0, explain:'ในแผนที่นิยมใช้สีน้ำเงินแทนแม่น้ำ ทะเลสาบ และทะเล', tier:1},
      {q:'ภูเขาที่สูงที่สุดในประเทศไทยคือภูเขาใด?', emoji:'🏔️', choices:['ดอยอินทนนท์','ภูกระดึง','เขาใหญ่','ดอยสุเทพ'], correct:0, explain:'ดอยอินทนนท์ จังหวัดเชียงใหม่ เป็นยอดเขาที่สูงที่สุดของไทย', tier:1},
      {q:'ที่ราบสูงโคราชอยู่ในภาคใดของประเทศไทย?', emoji:'🌾', choices:['ภาคตะวันออกเฉียงเหนือ','ภาคใต้','ภาคเหนือ','ภาคตะวันตก'], correct:0, explain:'ที่ราบสูงโคราชเป็นลักษณะเด่นของภาคอีสาน', tier:2},
      {q:'ประเทศไทยตั้งอยู่ในเขตละติจูดประมาณเท่าใด?', emoji:'🌐', choices:['ประมาณ 5-20 องศาเหนือ','ประมาณ 40-50 องศาเหนือ','ประมาณ 5-20 องศาใต้','ประมาณ 60-70 องศาเหนือ'], correct:0, explain:'ไทยอยู่เหนือเส้นศูนย์สูตรในเขตร้อน ประมาณละติจูด 5-20 องศาเหนือ', tier:2},
      {q:'ลักษณะภูมิประเทศของภาคเหนือส่วนใหญ่เป็นแบบใด?', emoji:'⛰️', choices:['ภูเขาสูงสลับหุบเขา','ที่ราบลุ่มกว้างใหญ่','ทะเลทราย','เกาะจำนวนมาก'], correct:0, explain:'ภาคเหนือมีเทือกเขาสูงสลับกับหุบเขาและแอ่งที่ราบระหว่างภูเขา', tier:2},
      {q:'แม่น้ำโขงเป็นพรมแดนธรรมชาติระหว่างไทยกับประเทศใด?', emoji:'🌊', choices:['ลาว','มาเลเซีย','อินเดีย','เวียดนาม'], correct:0, explain:'แม่น้ำโขงกั้นพรมแดนไทยกับลาวเป็นระยะทางยาว', tier:2},
      {q:'ภาคกลางเหมาะกับการทำอาชีพใดมากที่สุด?', emoji:'🌾', choices:['ทำนาปลูกข้าว','ทำเหมืองแร่บนภูเขา','ประมงน้ำลึก','ปลูกพืชเมืองหนาว'], correct:0, explain:'ภาคกลางเป็นที่ราบลุ่มน้ำท่วมถึง ดินอุดม เหมาะกับการทำนา', tier:2},
      {q:'มาตราส่วนในแผนที่บอกอะไร?', emoji:'📏', choices:['อัตราส่วนระยะในแผนที่กับระยะจริง','ทิศเหนือของแผนที่','ความสูงของภูเขา','จำนวนประชากร'], correct:0, explain:'มาตราส่วนช่วยคำนวณระยะทางจริงจากระยะที่วัดได้บนแผนที่', tier:2},
      {q:'จังหวัดใดในภาคตะวันออกเป็นแหล่งอุตสาหกรรมและท่าเรือสำคัญ?', emoji:'🚢', choices:['ระยอง','น่าน','สุรินทร์','แม่ฮ่องสอน'], correct:0, explain:'ระยองและชลบุรีเป็นเขตอุตสาหกรรมและท่าเรือสำคัญของภาคตะวันออก', tier:2},
      {q:'เส้นลองจิจูด 0 องศาผ่านเมืองใด?', emoji:'🕰️', choices:['กรีนิช ประเทศอังกฤษ','ปารีส ประเทศฝรั่งเศส','โตเกียว ประเทศญี่ปุ่น','กรุงเทพมหานคร'], correct:0, explain:'เส้นลองจิจูด 0 องศา (เส้นเมริเดียนแรก) ผ่านเมืองกรีนิช', tier:2},
      {q:'ทิศทางใดอยู่ตรงข้ามกับทิศตะวันออก?', emoji:'🧭', choices:['ทิศตะวันตก','ทิศเหนือ','ทิศใต้','ทิศตะวันออกเฉียงใต้'], correct:0, explain:'ทิศตะวันออกตรงข้ามกับทิศตะวันตกเสมอ', tier:2},
      {q:'ภูมิประเทศแบบภูเขาสูงส่งผลต่อการดำเนินชีวิตของคนอย่างไร?', emoji:'🌿', choices:['นิยมปลูกพืชเมืองหนาวและทำนาขั้นบันได','ทำประมงน้ำลึกเป็นหลัก','ปลูกข้าวได้ปีละหลายครั้งมากกว่าที่ราบ','ไม่สามารถอยู่อาศัยได้เลย'], correct:0, explain:'พื้นที่สูงอากาศเย็นและลาดชัน จึงปลูกพืชเมืองหนาวและทำนาขั้นบันได', tier:3},
      {q:'เหตุใดภาคใต้จึงมีฝนตกชุกเกือบตลอดปี?', emoji:'🌧️', choices:['อยู่ใกล้ทะเลและรับลมมรสุมทั้งสองด้าน','อยู่บนภูเขาสูงที่สุดของประเทศ','อยู่ไกลจากทะเลมากที่สุด','มีทะเลทรายอยู่ใกล้เคียง'], correct:0, explain:'ภาคใต้เป็นคาบสมุทรแคบ ได้รับอิทธิพลลมมรสุมทั้งฝั่งอ่าวไทยและอันดามัน', tier:3},
      {q:'การตัดไม้ทำลายป่าบนภูเขาทำให้เกิดปัญหาใดตามมา?', emoji:'🪓', choices:['ดินถล่มและน้ำท่วมฉับพลัน','อากาศเย็นลงมาก','ฝนตกมากขึ้นทุกปี','ดินอุดมสมบูรณ์ขึ้น'], correct:0, explain:'ไม่มีรากไม้ยึดดินและชะลอน้ำ จึงเกิดดินถล่มและน้ำหลากได้ง่าย', tier:3},
      {q:'ถ้าอ่านพิกัดได้ว่า 13 องศาเหนือ 100 องศาตะวันออก จะเป็นตำแหน่งใกล้จังหวัดใด?', emoji:'📍', choices:['กรุงเทพมหานคร','เชียงราย','นราธิวาส','อุบลราชธานี'], correct:0, explain:'พิกัดนี้อยู่บริเวณภาคกลางตอนล่างซึ่งเป็นที่ตั้งของกรุงเทพมหานคร', tier:3},
      {q:'เหตุใดภาคตะวันออกเฉียงเหนือจึงต้องสร้างแหล่งเก็บน้ำจำนวนมาก?', emoji:'💧', choices:['ดินเป็นดินทรายไม่อุ้มน้ำและฝนตกไม่สม่ำเสมอ','มีฝนตกมากที่สุดในประเทศ','อยู่ติดทะเลจึงขาดน้ำจืด','พื้นที่เป็นภูเขาสูงชันทั้งหมด'], correct:0, explain:'ดินอีสานส่วนใหญ่เป็นดินทรายเก็บน้ำได้น้อย จึงต้องมีอ่างเก็บน้ำและสระน้ำ', tier:3},
      {q:'การย้ายถิ่นเข้ามาอยู่ในเมืองใหญ่จำนวนมากทำให้เกิดผลใด?', emoji:'🏙️', choices:['เมืองแออัดและใช้ทรัพยากรมากขึ้น','เมืองเงียบสงบลง','พื้นที่ป่าในเมืองเพิ่มขึ้น','ค่าครองชีพลดลงทันที'], correct:0, explain:'คนหนาแน่นทำให้ที่อยู่อาศัย น้ำ ไฟ และการจราจรต้องรองรับมากขึ้น', tier:3}
    ]
  },
  {
    id:'p5-social2', name:'สังคม ป.5 · อยุธยาและธนบุรี', emoji:'🏯', icon:'assets/icons/p5-social2.svg', color:'#E5893B', light:'#FEEFC9', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ผู้สถาปนากรุงศรีอยุธยาคือใคร?', emoji:'👑', choices:['สมเด็จพระรามาธิบดีที่ 1 (พระเจ้าอู่ทอง)','สมเด็จพระนเรศวรมหาราช','พ่อขุนรามคำแหงมหาราช','พระเจ้าตากสินมหาราช'], correct:0, explain:'สมเด็จพระรามาธิบดีที่ 1 ทรงสถาปนากรุงศรีอยุธยาเป็นราชธานี', tier:1},
      {q:'อาณาจักรใดเกิดขึ้นก่อนอาณาจักรอยุธยา?', emoji:'🏛️', choices:['สุโขทัย','ธนบุรี','รัตนโกสินทร์','ล้านนาสมัยปัจจุบัน'], correct:0, explain:'ลำดับคือ สุโขทัย → อยุธยา → ธนบุรี → รัตนโกสินทร์', tier:1},
      {q:'ใครเป็นผู้กอบกู้เอกราชหลังเสียกรุงศรีอยุธยาครั้งที่ 2?', emoji:'⚔️', choices:['พระเจ้าตากสินมหาราช','สมเด็จพระนารายณ์มหาราช','พ่อขุนศรีอินทราทิตย์','สมเด็จพระเจ้าอู่ทอง'], correct:0, explain:'สมเด็จพระเจ้าตากสินมหาราชทรงรวบรวมไพร่พลกอบกู้เอกราชและตั้งกรุงธนบุรี', tier:1},
      {q:'ราชธานีของอาณาจักรธนบุรีคือเมืองใด?', emoji:'🏯', choices:['กรุงธนบุรี','กรุงศรีอยุธยา','เมืองสุโขทัย','เมืองเชียงใหม่'], correct:0, explain:'พระเจ้าตากสินทรงย้ายราชธานีมาตั้งที่กรุงธนบุรีริมแม่น้ำเจ้าพระยา', tier:1},
      {q:'วีรกรรมสำคัญของสมเด็จพระนเรศวรมหาราชคือข้อใด?', emoji:'🐘', choices:['ประกาศอิสรภาพจากพม่า','สร้างพระบรมมหาราชวัง','ประดิษฐ์อักษรไทย','สร้างเมืองสุโขทัย'], correct:0, explain:'พระองค์ทรงประกาศอิสรภาพและทำยุทธหัตถีจนได้รับชัยชนะ', tier:1},
      {q:'กรุงศรีอยุธยาตั้งอยู่ริมแม่น้ำสายใดเป็นหลัก?', emoji:'🌊', choices:['เจ้าพระยา','โขง','ปิง','ตาปี'], correct:0, explain:'อยุธยาตั้งอยู่บริเวณที่แม่น้ำเจ้าพระยา ป่าสัก และลพบุรีมาบรรจบกัน', tier:1},
      {q:'ข้อใดเรียงลำดับอาณาจักรของไทยได้ถูกต้อง?', emoji:'⏳', choices:['สุโขทัย → อยุธยา → ธนบุรี → รัตนโกสินทร์','อยุธยา → สุโขทัย → ธนบุรี → รัตนโกสินทร์','ธนบุรี → อยุธยา → สุโขทัย → รัตนโกสินทร์','รัตนโกสินทร์ → ธนบุรี → อยุธยา → สุโขทัย'], correct:0, explain:'สุโขทัยเก่าแก่ที่สุด ต่อด้วยอยุธยา ธนบุรี และรัตนโกสินทร์ตามลำดับ', tier:1},
      {q:'หลักฐานทางประวัติศาสตร์ประเภทลายลักษณ์อักษรได้แก่ข้อใด?', emoji:'📜', choices:['พงศาวดารและศิลาจารึก','เครื่องปั้นดินเผา','กำแพงเมือง','เครื่องมือหิน'], correct:0, explain:'หลักฐานลายลักษณ์อักษรคือสิ่งที่มีตัวหนังสือบันทึกไว้ เช่น จารึกและพงศาวดาร', tier:1},
      {q:'อยุธยาเป็นราชธานีของไทยยาวนานประมาณกี่ปี?', emoji:'🗓️', choices:['ประมาณ 417 ปี','ประมาณ 100 ปี','ประมาณ 700 ปี','ประมาณ 50 ปี'], correct:0, explain:'อยุธยาเป็นราชธานีตั้งแต่ พ.ศ. 1893 ถึง 2310 รวมประมาณ 417 ปี', tier:1},
      {q:'กรุงศรีอยุธยารุ่งเรืองอย่างมากในด้านใด?', emoji:'⛵', choices:['การค้ากับต่างชาติ','การทำเหมืองแร่บนภูเขา','การเลี้ยงสัตว์ในทะเลทราย','การปลูกพืชเมืองหนาว'], correct:0, explain:'อยุธยาเป็นเมืองท่าที่ค้าขายกับจีน อินเดีย เปอร์เซีย และชาติตะวันตก', tier:2},
      {q:'เหตุใดอยุธยาจึงเหมาะเป็นเมืองท่าค้าขาย?', emoji:'🚢', choices:['ตั้งอยู่ใกล้ปากแม่น้ำ เรือสินค้าเข้าถึงได้สะดวก','ตั้งอยู่บนภูเขาสูงมองเห็นข้าศึกได้ไกล','อยู่กลางทะเลทรายที่กองคาราวานผ่าน','อยู่ติดชายแดนประเทศจีน'], correct:0, explain:'เรือสำเภาแล่นจากทะเลเข้ามาตามแม่น้ำเจ้าพระยาถึงอยุธยาได้', tier:2},
      {q:'วัดสำคัญที่ตั้งอยู่ในเขตพระราชวังหลวงของอยุธยาคือวัดใด?', emoji:'🛕', choices:['วัดพระศรีสรรเพชญ์','วัดพระธาตุดอยสุเทพ','วัดพระมหาธาตุ สุโขทัย','วัดอรุณราชวราราม'], correct:0, explain:'วัดพระศรีสรรเพชญ์เป็นวัดในเขตพระราชวังหลวงกรุงศรีอยุธยา', tier:2},
      {q:'อิทธิพลของอารยธรรมอินเดียที่ไทยรับมาคือข้อใด?', emoji:'🕉️', choices:['ศาสนาพุทธ ศาสนาพราหมณ์ และภาษาบาลี-สันสกฤต','การใช้ตะเกียบกินอาหาร','การต่อเรือสำเภา','การทำเส้นก๋วยเตี๋ยว'], correct:0, explain:'ไทยรับศาสนา ภาษา และพิธีกรรมหลายอย่างจากอินเดีย', tier:2},
      {q:'อิทธิพลจากจีนที่เห็นได้ชัดในสังคมไทยคือข้อใด?', emoji:'🥢', choices:['อาหารประเภทก๋วยเตี๋ยวและการค้าทางเรือสำเภา','การใช้ภาษาบาลีในพิธีสงฆ์','การสร้างเจดีย์ทรงลังกา','การแต่งกายด้วยผ้าซิ่นล้านนา'], correct:0, explain:'ชาวจีนนำอาหารและการค้าทางเรือสำเภาเข้ามาตั้งแต่สมัยอยุธยา', tier:2},
      {q:'สมเด็จพระนารายณ์มหาราชทรงมีชื่อเสียงด้านใด?', emoji:'🤝', choices:['การเจริญสัมพันธไมตรีกับต่างชาติ','การประดิษฐ์ตัวอักษรไทย','การสร้างกรุงธนบุรี','การขุดคลองสุเอซ'], correct:0, explain:'รัชสมัยของพระองค์มีการส่งคณะทูตไปฝรั่งเศสและรับทูตต่างชาติ', tier:2},
      {q:'"ข้อเท็จจริง" ทางประวัติศาสตร์ต่างจากความคิดเห็นอย่างไร?', emoji:'🔍', choices:['ข้อเท็จจริงมีหลักฐานยืนยันตรวจสอบได้','ข้อเท็จจริงต้องเป็นเรื่องเก่าแก่ที่สุด','ข้อเท็จจริงคือเรื่องที่คนส่วนใหญ่เชื่อ','ข้อเท็จจริงต้องอยู่ในหนังสือเรียนเท่านั้น'], correct:0, explain:'ข้อเท็จจริงต้องมีหลักฐานสนับสนุน ส่วนความคิดเห็นเป็นการตีความ', tier:2},
      {q:'ภูมิปัญญาไทยสมัยอยุธยาที่โดดเด่นคือข้อใด?', emoji:'🏺', choices:['การต่อเรือ เครื่องปั้นดินเผา และสถาปัตยกรรมวัด','การผลิตรถยนต์','การสร้างทางรถไฟ','การทำเหมืองถ่านหิน'], correct:0, explain:'ช่างฝีมือสมัยอยุธยาเชี่ยวชาญงานไม้ งานปั้น และงานก่อสร้างวัดวาอาราม', tier:2},
      {q:'ข้อใดเป็นข้อเท็จจริงทางประวัติศาสตร์?', emoji:'📚', choices:['กรุงศรีอยุธยาเสียแก่พม่าครั้งที่ 2 ใน พ.ศ. 2310','อยุธยาเป็นเมืองที่สวยที่สุดในโลก','คนสมัยอยุธยามีความสุขกว่าคนสมัยนี้','อาหารสมัยอยุธยาอร่อยกว่าปัจจุบัน'], correct:0, explain:'ปีที่เสียกรุงมีหลักฐานบันทึกไว้ ส่วนข้ออื่นเป็นความคิดเห็น', tier:2},
      {q:'เหตุใดกรุงธนบุรีจึงเป็นราชธานีในช่วงเวลาสั้นๆ?', emoji:'⏳', choices:['เป็นช่วงฟื้นฟูบ้านเมืองหลังสงคราม ต่อมาย้ายราชธานีไปกรุงเทพฯ','เพราะถูกน้ำท่วมทั้งเมือง','เพราะไม่มีผู้คนอาศัยอยู่','เพราะอยู่ไกลจากแม่น้ำเกินไป'], correct:0, explain:'ธนบุรีเป็นราชธานีราว 15 ปี ในช่วงฟื้นฟูประเทศ ก่อนสถาปนากรุงรัตนโกสินทร์', tier:3},
      {q:'การค้ากับต่างชาติทำให้อยุธยาได้รับสิ่งใด?', emoji:'💰', choices:['ความมั่งคั่งและการแลกเปลี่ยนวัฒนธรรมใหม่ๆ','ความยากจนและสงครามทุกปี','การสูญเสียภาษาไทยทั้งหมด','การหยุดทำการเกษตร'], correct:0, explain:'การค้านำรายได้ สินค้า และวัฒนธรรมจากหลายชาติเข้าสู่อยุธยา', tier:3},
      {q:'ถ้าต้องการศึกษาความเป็นมาของท้องถิ่นตนเอง ควรทำอย่างไร?', emoji:'🔎', choices:['สอบถามผู้สูงอายุ ค้นเอกสารเก่า และสำรวจโบราณสถานในพื้นที่','เชื่อข่าวลือที่ได้ยินมา','ดูจากภาพยนตร์เพียงอย่างเดียว','เดาจากชื่อหมู่บ้าน'], correct:0, explain:'การใช้หลักฐานหลายแหล่งประกอบกันทำให้ได้ข้อมูลที่น่าเชื่อถือ', tier:3},
      {q:'เหตุใดจึงควรอนุรักษ์โบราณสถานในจังหวัดพระนครศรีอยุธยา?', emoji:'🏛️', choices:['เป็นมรดกทางประวัติศาสตร์ที่ช่วยให้คนรุ่นหลังเรียนรู้อดีต','เพื่อใช้เป็นที่จอดรถ','เพราะเป็นอาคารใหม่ที่ทันสมัย','เพื่อรื้อไปสร้างบ้านจัดสรร'], correct:0, explain:'โบราณสถานเป็นหลักฐานของอดีตที่มีคุณค่าทางประวัติศาสตร์และวัฒนธรรม', tier:3},
      {q:'อาหารไทยข้อใดสะท้อนอิทธิพลวัฒนธรรมต่างชาติ?', emoji:'🍜', choices:['ก๋วยเตี๋ยวจากจีนและแกงกะหรี่จากอินเดีย','ข้าวเหนียวมะม่วงจากยุโรป','ส้มตำจากญี่ปุ่น','น้ำพริกกะปิจากอเมริกา'], correct:0, explain:'ก๋วยเตี๋ยวมาจากจีน ส่วนเครื่องแกงกะหรี่ได้อิทธิพลจากอินเดีย', tier:3},
      {q:'เพราะเหตุใดพระเจ้าตากสินจึงเลือกกรุงธนบุรีเป็นราชธานี?', emoji:'⛵', choices:['อยู่ใกล้ทะเล เดินทางและค้าขายสะดวก และป้องกันข้าศึกได้ง่ายกว่า','เพราะมีภูเขาล้อมรอบทุกด้าน','เพราะอยู่ไกลจากแม่น้ำมากที่สุด','เพราะเป็นเมืองที่ใหญ่ที่สุดในเวลานั้น'], correct:0, explain:'ธนบุรีอยู่ใกล้ปากแม่น้ำ สะดวกต่อการค้าและการลำเลียงกำลังทางเรือ', tier:3}
    ]
  },
  {
    id:'p5-social3', name:'สังคม ป.5 · ธนาคาร สหกรณ์ และพอเพียง', emoji:'🏦', icon:'assets/icons/p5-social3.svg', color:'#D2762B', light:'#FEEFC9', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ปัจจัยการผลิตสินค้าและบริการประกอบด้วยอะไรบ้าง?', emoji:'🏭', choices:['ที่ดิน แรงงาน ทุน และผู้ประกอบการ','ที่ดิน น้ำ ลม ไฟ','เงิน ทอง เพชร นาก','ครู นักเรียน โรงเรียน ห้องสมุด'], correct:0, explain:'ปัจจัยการผลิตมี 4 อย่าง คือ ที่ดิน แรงงาน ทุน และผู้ประกอบการ', tier:1},
      {q:'หน้าที่หลักของธนาคารคือข้อใด?', emoji:'🏦', choices:['รับฝากเงินและให้กู้ยืมเงิน','ผลิตสินค้าขายเอง','สอนหนังสือให้เด็ก','รักษาคนป่วย'], correct:0, explain:'ธนาคารรับฝากเงินจากผู้ออม แล้วนำไปให้ผู้ต้องการกู้ยืม', tier:1},
      {q:'ดอกเบี้ยเงินฝากคืออะไร?', emoji:'🪙', choices:['เงินที่ธนาคารจ่ายเพิ่มให้ผู้ฝากเงิน','เงินที่เราต้องจ่ายให้ธนาคาร','ค่าธรรมเนียมการเปิดบัญชี','เงินที่ใช้ซื้อของในร้าน'], correct:0, explain:'เมื่อเราฝากเงิน ธนาคารจะจ่ายดอกเบี้ยเป็นผลตอบแทนให้', tier:1},
      {q:'สหกรณ์จัดตั้งขึ้นเพื่อจุดประสงค์ใด?', emoji:'🤝', choices:['ช่วยเหลือสมาชิกให้ได้ประโยชน์ร่วมกัน','หากำไรให้เจ้าของคนเดียว','แข่งขันกับโรงเรียนอื่น','เก็บภาษีจากประชาชน'], correct:0, explain:'สหกรณ์เกิดจากการรวมตัวของสมาชิกเพื่อช่วยเหลือกันทางเศรษฐกิจ', tier:1},
      {q:'หลักปรัชญาเศรษฐกิจพอเพียงเน้นเรื่องใด?', emoji:'🌾', choices:['ความพอประมาณ มีเหตุผล และมีภูมิคุ้มกันที่ดี','ใช้เงินให้หมดทุกเดือน','กู้เงินให้มากที่สุด','ซื้อของแพงเพื่อให้ดูดี'], correct:0, explain:'เศรษฐกิจพอเพียงมี 3 ห่วง คือ พอประมาณ มีเหตุผล และมีภูมิคุ้มกัน', tier:1},
      {q:'"แรงงาน" ในปัจจัยการผลิตหมายถึงอะไร?', emoji:'👷', choices:['กำลังคนที่ใช้ในการทำงานผลิตสินค้า','เครื่องจักรในโรงงาน','ที่ดินที่ใช้สร้างโรงงาน','เงินทุนของเจ้าของกิจการ'], correct:0, explain:'แรงงานคือกำลังกายและกำลังความคิดของคนที่ใช้ในการผลิต', tier:1},
      {q:'การออมเงินมีประโยชน์อย่างไร?', emoji:'🐷', choices:['มีเงินสำรองไว้ใช้ยามจำเป็น','ทำให้ของราคาถูกลง','ทำให้ไม่ต้องทำงาน','ทำให้ได้ของฟรีจากร้านค้า'], correct:0, explain:'การออมช่วยให้มีเงินไว้ใช้ในยามฉุกเฉินหรือเพื่อเป้าหมายในอนาคต', tier:1},
      {q:'ผลเสียของการกู้ยืมเงินเกินความจำเป็นคือข้อใด?', emoji:'⚠️', choices:['เป็นหนี้สินจนใช้คืนไม่ไหว','ได้ดอกเบี้ยเพิ่มขึ้น','มีเงินออมมากขึ้น','ไม่ต้องจ่ายเงินคืน'], correct:0, explain:'ยิ่งกู้มากยิ่งต้องจ่ายดอกเบี้ยมาก จนอาจกลายเป็นภาระหนี้สิน', tier:1},
      {q:'"ทุน" ในปัจจัยการผลิตหมายถึงอะไร?', emoji:'💵', choices:['เงินและเครื่องมือเครื่องจักรที่ใช้ในการผลิต','จำนวนคนงานในโรงงาน','พื้นที่ทำการเกษตร','ชื่อเสียงของสินค้า'], correct:0, explain:'ทุนหมายถึงเงินและอุปกรณ์ที่นำมาใช้ผลิตสินค้าและบริการ', tier:1},
      {q:'ดอกเบี้ยเงินกู้ต่างจากดอกเบี้ยเงินฝากอย่างไร?', emoji:'🧾', choices:['ดอกเบี้ยเงินกู้เป็นเงินที่เราต้องจ่ายเพิ่มให้ธนาคาร','ดอกเบี้ยเงินกู้คือเงินที่ธนาคารให้เราฟรี','ทั้งสองอย่างเหมือนกันทุกประการ','ดอกเบี้ยเงินกู้ไม่ต้องจ่ายคืน'], correct:0, explain:'ฝากเงิน = ได้ดอกเบี้ย, กู้เงิน = ต้องจ่ายดอกเบี้ย', tier:2},
      {q:'สหกรณ์ในโรงเรียนช่วยนักเรียนอย่างไร?', emoji:'🏫', choices:['ซื้อของราคายุติธรรมและฝึกนิสัยการออม','ให้ของฟรีทุกวัน','ช่วยทำการบ้านให้','จัดสอบแทนคุณครู'], correct:0, explain:'สหกรณ์โรงเรียนฝึกให้นักเรียนรู้จักการออม การค้าขาย และการทำงานร่วมกัน', tier:2},
      {q:'ฝากเงิน 1,000 บาท ได้ดอกเบี้ยร้อยละ 2 ต่อปี ครบ 1 ปีได้ดอกเบี้ยกี่บาท?', emoji:'🪙', choices:['20 บาท','10 บาท','200 บาท','2 บาท'], correct:0, explain:'1,000 ÷ 100 × 2 = 20 บาท', tier:2},
      {q:'ข้อใดเป็นการดำเนินชีวิตตามหลักเศรษฐกิจพอเพียง?', emoji:'🌱', choices:['ซื้อของเท่าที่จำเป็นและเก็บออมส่วนที่เหลือ','ซื้อของทุกอย่างที่เพื่อนมี','กู้เงินมาซื้อของเล่นราคาแพง','ใช้เงินให้หมดทุกเดือน'], correct:0, explain:'ความพอประมาณคือใช้จ่ายตามความจำเป็นและมีเงินออมเผื่ออนาคต', tier:2},
      {q:'"เงินปันผล" ของสหกรณ์คืออะไร?', emoji:'💰', choices:['ส่วนแบ่งผลกำไรที่คืนให้สมาชิก','ค่าปรับเมื่อทำผิดกฎ','ภาษีที่ต้องจ่ายให้รัฐ','ค่าสมัครสมาชิกแรกเข้า'], correct:0, explain:'เมื่อสหกรณ์มีกำไร จะแบ่งคืนให้สมาชิกตามสัดส่วนที่ร่วมดำเนินการ', tier:2},
      {q:'ผู้ประกอบการมีหน้าที่อะไร?', emoji:'👔', choices:['นำที่ดิน แรงงาน และทุนมารวมกันเพื่อผลิตสินค้า','ทำงานในโรงงานตามคำสั่ง','เก็บภาษีจากร้านค้า','ตรวจสอบบัญชีของธนาคาร'], correct:0, explain:'ผู้ประกอบการเป็นผู้ตัดสินใจและจัดการปัจจัยการผลิตให้เกิดสินค้าและบริการ', tier:2},
      {q:'การกู้ยืมเงินแบบใดถือว่ามีประโยชน์?', emoji:'📈', choices:['กู้เพื่อลงทุนที่สร้างรายได้เพิ่มในอนาคต','กู้เพื่อซื้อของฟุ่มเฟือย','กู้เพื่อไปเที่ยวให้เท่าเพื่อน','กู้เพื่อนำไปเสี่ยงโชค'], correct:0, explain:'การกู้เพื่อลงทุนที่ให้ผลตอบแทนคุ้มค่ากว่าดอกเบี้ยถือว่าเป็นหนี้ที่มีประโยชน์', tier:2},
      {q:'ที่ดินจัดเป็นปัจจัยการผลิตประเภทใด?', emoji:'🌍', choices:['ทรัพยากรธรรมชาติที่ใช้ในการผลิต','แรงงานที่ใช้ทำงาน','เงินทุนหมุนเวียน','ค่าจ้างของลูกจ้าง'], correct:0, explain:'ที่ดินและทรัพยากรธรรมชาติเป็นฐานของการผลิตทุกชนิด', tier:2},
      {q:'การจดบันทึกรายรับ-รายจ่ายมีประโยชน์อย่างไร?', emoji:'📔', choices:['ทำให้รู้ว่าเงินหมดไปกับอะไรและวางแผนใช้เงินได้','ทำให้มีเงินเพิ่มขึ้นทันที','ทำให้ไม่ต้องจ่ายภาษี','ทำให้ของราคาถูกลง'], correct:0, explain:'บัญชีรายรับ-รายจ่ายช่วยให้เห็นพฤติกรรมการใช้เงินและปรับปรุงได้', tier:2},
      {q:'ร้านค้าสหกรณ์ต่างจากร้านค้าทั่วไปอย่างไร?', emoji:'🛒', choices:['สมาชิกเป็นเจ้าของร่วมกันและได้รับเงินปันผล','ขายของแพงกว่าร้านทั่วไปเสมอ','ไม่ต้องจ่ายเงินเมื่อซื้อของ','มีเจ้าของเพียงคนเดียวที่ได้กำไร'], correct:0, explain:'สหกรณ์เป็นของสมาชิกทุกคน กำไรจึงถูกแบ่งคืนเป็นเงินปันผล', tier:3},
      {q:'ฝากเงิน 5,000 บาท ดอกเบี้ยร้อยละ 3 ต่อปี ครบ 1 ปีจะมีเงินรวมเท่าไร?', emoji:'🏦', choices:['5,150 บาท','5,300 บาท','5,030 บาท','5,500 บาท'], correct:0, explain:'ดอกเบี้ย = 5,000 ÷ 100 × 3 = 150 บาท รวมเป็น 5,150 บาท', tier:3},
      {q:'"มีภูมิคุ้มกันที่ดี" ตามหลักเศรษฐกิจพอเพียงหมายถึงอะไร?', emoji:'🛡️', choices:['เตรียมพร้อมรับความเปลี่ยนแปลงที่อาจเกิดขึ้นในอนาคต','มีร่างกายแข็งแรงไม่เป็นหวัด','มีเงินมากที่สุดในหมู่บ้าน','ไม่ต้องวางแผนอะไรเลย'], correct:0, explain:'ภูมิคุ้มกันคือการเตรียมตัวและมีเงินออมเผื่อเหตุไม่คาดฝัน', tier:3},
      {q:'ครอบครัวมีรายได้เดือนละ 15,000 บาท จ่ายไป 14,500 บาท ควรทำอย่างไร?', emoji:'📉', choices:['ลดรายจ่ายที่ไม่จำเป็นเพื่อให้มีเงินออมมากขึ้น','กู้เงินมาใช้เพิ่ม','ใช้ให้หมดทั้ง 15,000 บาท','ซื้อของราคาแพงขึ้นกว่าเดิม'], correct:0, explain:'เหลือเงินออมเพียง 500 บาท ควรทบทวนรายจ่ายที่ไม่จำเป็นออก', tier:3},
      {q:'ข้อใดเป็นผลดีของการฝากเงินไว้กับธนาคาร?', emoji:'🔒', choices:['ปลอดภัยกว่าเก็บไว้เองและยังได้ดอกเบี้ย','ได้ของแถมทุกครั้งที่ฝาก','ไม่ต้องจ่ายค่าอะไรเลยตลอดชีวิต','ธนาคารจะเพิ่มเงินให้เป็นสองเท่า'], correct:0, explain:'ธนาคารช่วยเก็บรักษาเงินอย่างปลอดภัยและจ่ายดอกเบี้ยเป็นผลตอบแทน', tier:3},
      {q:'เหตุใดจึงควรเปรียบเทียบราคาและคุณภาพก่อนซื้อของ?', emoji:'🔍', choices:['เพื่อใช้เงินอย่างคุ้มค่าที่สุด','เพื่อให้ใช้เวลานานขึ้น','เพื่อให้ร้านค้าลดราคาให้','เพื่อจะได้ซื้อของหลายชิ้น'], correct:0, explain:'การเปรียบเทียบก่อนซื้อช่วยให้ได้ของดีในราคาที่เหมาะสม', tier:3}
    ]
  },
  {
    id:'p5-social4', name:'สังคม ป.5 · พลเมืองดีและการปกครองท้องถิ่น', emoji:'🏢', icon:'assets/icons/p5-social4.svg', color:'#B9631F', light:'#FEEFC9', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'"อบต." ย่อมาจากอะไร?', emoji:'🏢', choices:['องค์การบริหารส่วนตำบล','องค์กรบริหารเทศบาล','องค์การบริการต่างจังหวัด','องค์กรบำรุงถนนตำบล'], correct:0, explain:'อบต. คือองค์การบริหารส่วนตำบล ดูแลพื้นที่ระดับตำบล', tier:1},
      {q:'ผู้บริหารสูงสุดของเทศบาลคือใคร?', emoji:'🧑‍💼', choices:['นายกเทศมนตรี','ผู้ว่าราชการจังหวัด','กำนัน','ปลัดอำเภอ'], correct:0, explain:'เทศบาลมีนายกเทศมนตรีเป็นผู้บริหารสูงสุด', tier:1},
      {q:'องค์การบริหารส่วนจังหวัด (อบจ.) ดูแลพื้นที่ระดับใด?', emoji:'🗺️', choices:['ระดับจังหวัด','ระดับหมู่บ้าน','ระดับประเทศ','ระดับทวีป'], correct:0, explain:'อบจ. ดูแลงานที่ครอบคลุมทั้งจังหวัด', tier:1},
      {q:'ผู้บริหารท้องถิ่นเข้าสู่ตำแหน่งด้วยวิธีใด?', emoji:'🗳️', choices:['ประชาชนในท้องถิ่นเลือกตั้ง','ผู้ว่าราชการแต่งตั้งเอง','สืบทอดจากพ่อแม่','จับฉลากเลือก'], correct:0, explain:'ผู้บริหารท้องถิ่นมาจากการเลือกตั้งของประชาชนในพื้นที่', tier:1},
      {q:'ข้อใดเป็นสิทธิพื้นฐานที่เด็กทุกคนควรได้รับ?', emoji:'🎒', choices:['สิทธิที่จะได้รับการศึกษา','สิทธิที่จะไม่ทำการบ้านเลย','สิทธิที่จะขับรถยนต์','สิทธิที่จะไม่เชื่อฟังใครเลย'], correct:0, explain:'การศึกษาเป็นสิทธิขั้นพื้นฐานของเด็กทุกคนตามอนุสัญญาว่าด้วยสิทธิเด็ก', tier:1},
      {q:'หน้าที่ของพลเมืองดีคือข้อใด?', emoji:'🤝', choices:['เคารพกฎหมายและช่วยเหลือส่วนรวม','ทำตามใจตนเองทุกเรื่อง','หลีกเลี่ยงการเสียภาษี','ไม่สนใจปัญหาของชุมชน'], correct:0, explain:'พลเมืองดีต้องรู้จักหน้าที่ เคารพกติกา และร่วมพัฒนาสังคม', tier:1},
      {q:'ถ้าถูกละเมิดสิทธิ ควรทำอย่างไร?', emoji:'🆘', choices:['บอกผู้ใหญ่ที่ไว้ใจได้หรือแจ้งเจ้าหน้าที่','เก็บไว้คนเดียวไม่บอกใคร','แก้แค้นด้วยตนเอง','ย้ายโรงเรียนทันที'], correct:0, explain:'การบอกผู้ใหญ่หรือเจ้าหน้าที่ช่วยให้ได้รับการคุ้มครองอย่างถูกวิธี', tier:1},
      {q:'ข้อใดเป็นภูมิปัญญาท้องถิ่นของไทย?', emoji:'🧺', choices:['การจักสาน การทอผ้า และยาสมุนไพร','การผลิตโทรศัพท์มือถือ','การสร้างจรวดอวกาศ','การเขียนโปรแกรมคอมพิวเตอร์'], correct:0, explain:'ภูมิปัญญาท้องถิ่นคือความรู้ที่สืบทอดกันมาในชุมชน เช่น งานหัตถกรรมและสมุนไพร', tier:1},
      {q:'วัฒนธรรมไทยข้อใดแสดงถึงความเคารพ?', emoji:'🙏', choices:['การไหว้ผู้ใหญ่','การกอดคอเพื่อน','การชี้นิ้วใส่ผู้อื่น','การพูดเสียงดังใส่กัน'], correct:0, explain:'การไหว้เป็นเอกลักษณ์ไทยที่แสดงความเคารพและอ่อนน้อม', tier:1},
      {q:'อบต. มีหน้าที่ดูแลเรื่องใดในตำบล?', emoji:'🛣️', choices:['ถนน น้ำประปา ไฟฟ้าสาธารณะ และการเก็บขยะ','การออกกฎหมายระดับประเทศ','การบริหารกองทัพ','การกำหนดหลักสูตรของทุกโรงเรียนในประเทศ'], correct:0, explain:'อบต. รับผิดชอบบริการสาธารณะพื้นฐานในเขตตำบลของตน', tier:2},
      {q:'เหตุใดประเทศไทยจึงต้องมีการปกครองส่วนท้องถิ่น?', emoji:'🏘️', choices:['เพราะคนในพื้นที่รู้ปัญหาและความต้องการของตนเองดีที่สุด','เพราะรัฐบาลกลางไม่มีงบประมาณ','เพราะกฎหมายบังคับให้ทุกบ้านต้องมี','เพราะต้องการเพิ่มจำนวนข้าราชการ'], correct:0, explain:'ท้องถิ่นแก้ปัญหาได้ตรงจุดและรวดเร็วกว่ารอส่วนกลางเพียงอย่างเดียว', tier:2},
      {q:'"สถานภาพ" หมายถึงอะไร?', emoji:'🧍', choices:['ตำแหน่งหรือฐานะของบุคคลในสังคม','ความสูงและน้ำหนักของคน','จำนวนเงินที่มีในบัญชี','สถานที่ที่เราอาศัยอยู่'], correct:0, explain:'สถานภาพ เช่น การเป็นนักเรียน เป็นลูก เป็นพลเมืองของประเทศ', tier:2},
      {q:'"บทบาท" หมายถึงอะไร?', emoji:'🎭', choices:['การปฏิบัติตนตามหน้าที่ของสถานภาพที่มี','การแสดงละครบนเวที','การแต่งกายตามสมัยนิยม','การเปลี่ยนชื่อของตนเอง'], correct:0, explain:'มีสถานภาพเป็นนักเรียน บทบาทคือตั้งใจเรียนและปฏิบัติตามระเบียบ', tier:2},
      {q:'การอนุรักษ์ภูมิปัญญาท้องถิ่นทำได้อย่างไร?', emoji:'🧵', choices:['เรียนรู้ ฝึกทำ และเผยแพร่ให้คนรุ่นหลัง','เก็บไว้เป็นความลับไม่บอกใคร','เลิกใช้แล้วซื้อของนำเข้าแทน','ทิ้งของเก่าทั้งหมด'], correct:0, explain:'การสืบทอดและเผยแพร่ทำให้ภูมิปัญญาไม่สูญหายไปกับกาลเวลา', tier:2},
      {q:'ประโยชน์ที่ชุมชนได้รับจากองค์กรปกครองส่วนท้องถิ่นคือข้อใด?', emoji:'🚰', choices:['ได้รับบริการสาธารณะที่ตรงกับความต้องการของพื้นที่','ได้รับเงินสดทุกเดือนทุกครัวเรือน','ไม่ต้องเสียภาษีอีกต่อไป','ได้ที่ดินฟรีทุกคน'], correct:0, explain:'ท้องถิ่นจัดบริการ เช่น ประปา ถนน ขยะ ให้ตรงกับปัญหาของชุมชน', tier:2},
      {q:'เสรีภาพต่างจากการทำตามใจตนเองอย่างไร?', emoji:'⚖️', choices:['เสรีภาพต้องไม่ละเมิดสิทธิของผู้อื่น','เสรีภาพคือการทำอะไรก็ได้ทุกอย่าง','เสรีภาพใช้ได้เฉพาะผู้ใหญ่','เสรีภาพหมายถึงไม่ต้องทำตามกฎใดๆ'], correct:0, explain:'เสรีภาพมีขอบเขต คือต้องไม่ทำให้ผู้อื่นเดือดร้อนหรือเสียสิทธิ', tier:2},
      {q:'นักเรียนมีหน้าที่ใดในโรงเรียน?', emoji:'📚', choices:['ตั้งใจเรียนและปฏิบัติตามระเบียบของโรงเรียน','สั่งการให้ครูทำตามที่ต้องการ','เลือกวิชาที่จะสอบเอง','กำหนดเวลาเปิดปิดโรงเรียน'], correct:0, explain:'หน้าที่ของนักเรียนคือเรียนรู้และอยู่ร่วมกับผู้อื่นตามกติกา', tier:2},
      {q:'งบประมาณขององค์กรปกครองส่วนท้องถิ่นมาจากที่ใด?', emoji:'💴', choices:['ภาษีที่จัดเก็บได้และเงินอุดหนุนจากรัฐบาล','เงินบริจาคของนายกเทศมนตรีเท่านั้น','การขายที่ดินของประชาชน','การกู้ยืมจากต่างประเทศทั้งหมด'], correct:0, explain:'รายได้หลักมาจากภาษีท้องถิ่นและเงินอุดหนุนจากรัฐบาลกลาง', tier:2},
      {q:'ถ้าถนนในหมู่บ้านชำรุดเป็นหลุมบ่อ ควรแจ้งหน่วยงานใด?', emoji:'🚧', choices:['อบต. หรือเทศบาลในพื้นที่','กระทรวงศึกษาธิการ','โรงพยาบาลประจำจังหวัด','สถานีโทรทัศน์'], correct:0, explain:'การดูแลถนนในพื้นที่เป็นหน้าที่ขององค์กรปกครองส่วนท้องถิ่น', tier:3},
      {q:'ประชาชนมีส่วนร่วมกับท้องถิ่นได้อย่างไร?', emoji:'🗳️', choices:['ไปใช้สิทธิเลือกตั้งและเข้าร่วมประชุมประชาคม','รอให้ผู้อื่นตัดสินใจแทนทุกเรื่อง','วิจารณ์อย่างเดียวโดยไม่เข้าร่วม','ย้ายออกจากพื้นที่'], correct:0, explain:'การเลือกตั้งและการเข้าร่วมประชาคมคือช่องทางแสดงความเห็นที่มีผลจริง', tier:3},
      {q:'เห็นเพื่อนถูกรังแกที่โรงเรียน ควรทำอย่างไร?', emoji:'🛡️', choices:['บอกครูและไม่ร่วมรังแกด้วย','ยืนดูเฉยๆ แล้วเดินหนี','ถ่ายคลิปไปแชร์ให้เพื่อนดู','ช่วยเพื่อนอีกฝ่ายรังแกต่อ'], correct:0, explain:'การบอกครูช่วยหยุดการละเมิดสิทธิและปกป้องเพื่อนได้อย่างปลอดภัย', tier:3},
      {q:'เหตุใดจึงควรอนุรักษ์วัฒนธรรมไทย?', emoji:'🇹🇭', choices:['เป็นเอกลักษณ์ที่สร้างความภาคภูมิใจและความสามัคคี','เพื่อไม่ให้ชาติอื่นเข้ามาเที่ยว','เพื่อให้ทุกคนแต่งชุดไทยตลอดเวลา','เพื่อห้ามเรียนรู้วัฒนธรรมอื่น'], correct:0, explain:'วัฒนธรรมเป็นรากเหง้าที่หล่อหลอมสังคมและสร้างความภูมิใจร่วมกัน', tier:3},
      {q:'ข้อใดเป็นการใช้สิทธิของตนอย่างถูกต้อง?', emoji:'💬', choices:['แสดงความคิดเห็นด้วยเหตุผลโดยไม่ดูหมิ่นผู้อื่น','พูดให้ร้ายคนที่เห็นต่าง','เขียนข้อความหยาบคายลงในอินเทอร์เน็ต','ขัดขวางไม่ให้คนอื่นพูด'], correct:0, explain:'สิทธิในการแสดงออกต้องใช้ควบคู่กับความรับผิดชอบและการเคารพผู้อื่น', tier:3},
      {q:'ชุมชนมีปัญหาขยะล้น ควรเริ่มแก้ไขอย่างไร?', emoji:'🗑️', choices:['ร่วมกันคัดแยกขยะและแจ้งหน่วยงานท้องถิ่นให้จัดเก็บ','เผาขยะในบ้านทุกวัน','ทิ้งขยะลงแม่น้ำ','ย้ายบ้านหนีไปที่อื่น'], correct:0, explain:'การคัดแยกช่วยลดปริมาณขยะ และท้องถิ่นมีหน้าที่จัดเก็บและกำจัดอย่างถูกวิธี', tier:3}
    ]
  },
  /* ---------- วิทยาศาสตร์ ป.5 : 4 หมวด ---------- */
  {
    id:'p5-sci1', name:'วิทยาศาสตร์ ป.5 · การปรับตัว โซ่อาหาร และพันธุกรรม', emoji:'🦎', icon:'assets/icons/p5-sci1.svg', color:'#2FA36B', light:'#D9F2E4', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ผักตบชวาลอยน้ำได้เพราะมีลักษณะพิเศษใด?', emoji:'🪷', choices:['ก้านใบพองมีช่องอากาศอยู่ภายใน','ใบหนักกว่าน้ำมาก','รากยาวหยั่งถึงก้นบ่อ','ลำต้นเป็นเหล็ก'], correct:0, explain:'ก้านใบผักตบชวาพองและมีช่องอากาศ ทำให้ลอยน้ำได้', tier:1},
      {q:'ต้นโกงกางมีรากค้ำจุนเพื่ออะไร?', emoji:'🌳', choices:['ยึดลำต้นให้มั่นคงในดินเลนอ่อน','เก็บน้ำหวานไว้ในราก','ใช้จับปลาเป็นอาหาร','ป้องกันแสงแดด'], correct:0, explain:'ดินเลนป่าชายเลนอ่อนตัว รากค้ำจุนช่วยพยุงลำต้นไม่ให้ล้ม', tier:1},
      {q:'ปลามีครีบไว้เพื่ออะไร?', emoji:'🐟', choices:['ช่วยในการว่ายน้ำและทรงตัว','ใช้หายใจใต้น้ำ','ใช้เคี้ยวอาหาร','ใช้มองเห็นในที่มืด'], correct:0, explain:'ครีบช่วยให้ปลาเคลื่อนที่และทรงตัวในน้ำได้ดี ส่วนการหายใจใช้เหงือก', tier:1},
      {q:'ผู้ผลิตในโซ่อาหารคือสิ่งมีชีวิตกลุ่มใด?', emoji:'🌱', choices:['พืชที่สร้างอาหารเองได้','สัตว์กินพืช','สัตว์กินเนื้อ','เห็ดรา'], correct:0, explain:'พืชสร้างอาหารเองได้จากแสงแดด จึงเป็นผู้ผลิตของโซ่อาหาร', tier:1},
      {q:'ผู้บริโภคลำดับที่ 1 ในโซ่อาหารคือสัตว์ประเภทใด?', emoji:'🐰', choices:['สัตว์ที่กินพืชเป็นอาหาร','สัตว์ที่กินสัตว์อื่น','พืชที่สร้างอาหารเอง','สิ่งไม่มีชีวิต'], correct:0, explain:'สัตว์ที่กินพืชโดยตรงเป็นผู้บริโภคลำดับที่ 1', tier:1},
      {q:'ลักษณะใดถ่ายทอดจากพ่อแม่สู่ลูกได้?', emoji:'🧬', choices:['ลักยิ้ม','รอยแผลจากการหกล้ม','ผมที่เพิ่งไปตัดมา','รอยสักบนแขน'], correct:0, explain:'ลักยิ้มเป็นลักษณะทางพันธุกรรม ส่วนแผลหรือรอยสักเกิดภายหลังจึงไม่ถ่ายทอด', tier:1},
      {q:'ลักษณะใดไม่ใช่ลักษณะทางพันธุกรรม?', emoji:'🩹', choices:['รอยแผลเป็นจากอุบัติเหตุ','สีของดวงตา','ลักษณะติ่งหู','ความสามารถในการห่อลิ้น'], correct:0, explain:'รอยแผลเกิดจากเหตุการณ์ภายหลัง ไม่ได้ถ่ายทอดทางพันธุกรรม', tier:1},
      {q:'อูฐมีหนอกไว้เพื่ออะไร?', emoji:'🐪', choices:['สะสมไขมันไว้เป็นอาหารสำรอง','เก็บน้ำไว้ดื่มโดยตรง','ใช้บังแดดให้หลัง','ใช้ป้องกันตัวจากศัตรู'], correct:0, explain:'หนอกอูฐสะสมไขมัน ใช้เป็นพลังงานยามขาดแคลนอาหารในทะเลทราย', tier:1},
      {q:'โซ่อาหารเริ่มต้นจากสิ่งมีชีวิตกลุ่มใดเสมอ?', emoji:'🌿', choices:['ผู้ผลิต','ผู้บริโภคลำดับที่ 2','ผู้ล่าสูงสุด','สัตว์กินเนื้อ'], correct:0, explain:'พลังงานในโซ่อาหารเริ่มจากพืชซึ่งเป็นผู้ผลิตเสมอ', tier:1},
      {q:'"หญ้า → กระต่าย → งู" กระต่ายทำหน้าที่ใดในโซ่อาหารนี้?', emoji:'🐇', choices:['ผู้บริโภคลำดับที่ 1','ผู้ผลิต','ผู้บริโภคลำดับที่ 2','ผู้ย่อยสลาย'], correct:0, explain:'กระต่ายกินหญ้าซึ่งเป็นผู้ผลิต จึงเป็นผู้บริโภคลำดับที่ 1', tier:2},
      {q:'ต้นกระบองเพชรมีใบเปลี่ยนเป็นหนามเพื่ออะไร?', emoji:'🌵', choices:['ลดการสูญเสียน้ำและป้องกันตัว','ช่วยให้ดูดน้ำได้เร็วขึ้น','ใช้สังเคราะห์แสงแทนลำต้น','ใช้ดักจับแมลงเป็นอาหาร'], correct:0, explain:'ใบที่เล็กเป็นหนามช่วยลดการคายน้ำในทะเลทรายและป้องกันสัตว์มากิน', tier:2},
      {q:'ถ้าผู้ผลิตในโซ่อาหารหมดไป จะเกิดอะไรขึ้น?', emoji:'⚠️', choices:['ผู้บริโภคขาดอาหารและมีจำนวนลดลง','ผู้บริโภคเพิ่มจำนวนมากขึ้น','ไม่มีผลกระทบใดๆ','สัตว์ทุกชนิดกลายเป็นผู้ผลิตแทน'], correct:0, explain:'พลังงานทั้งหมดมาจากผู้ผลิต เมื่อหายไปสิ่งมีชีวิตลำดับถัดไปจึงขาดอาหาร', tier:2},
      {q:'หมีขั้วโลกมีขนหนาและไขมันใต้ผิวหนังเพื่ออะไร?', emoji:'🐻‍❄️', choices:['รักษาความอบอุ่นของร่างกายในที่หนาวจัด','ช่วยให้ว่ายน้ำได้เร็วขึ้น','ทำให้ตัวเบาลง','ใช้พรางตัวจากศัตรู'], correct:0, explain:'ขนหนาและไขมันเป็นฉนวนกันความหนาวในเขตขั้วโลก', tier:2},
      {q:'ลักษณะทางพันธุกรรมของพืชได้แก่ข้อใด?', emoji:'🌸', choices:['สีของดอกและรูปร่างของใบ','จำนวนใบที่ถูกเด็ดออก','รอยที่เกิดจากแมลงกัด','ความสูงที่เกิดจากการตัดแต่ง'], correct:0, explain:'สีดอกและรูปร่างใบเป็นลักษณะที่ถ่ายทอดจากต้นแม่สู่ต้นลูก', tier:2},
      {q:'ข้อใดเป็นความสัมพันธ์ระหว่างสิ่งมีชีวิตกับสิ่งไม่มีชีวิต?', emoji:'☀️', choices:['พืชใช้แสงแดด น้ำ และอากาศในการเจริญเติบโต','นกกินหนอน','เสือล่ากวาง','ผึ้งช่วยผสมเกสรดอกไม้'], correct:0, explain:'แสงแดด น้ำ และอากาศเป็นสิ่งไม่มีชีวิตที่พืชต้องใช้', tier:2},
      {q:'นกที่กินเมล็ดพืชเป็นอาหารมักมีจะงอยปากลักษณะใด?', emoji:'🐦', choices:['สั้น หนา และแข็งแรง','ยาวเรียวเหมือนหลอด','แบนกว้างเหมือนช้อน','งุ้มแหลมเหมือนตะขอ'], correct:0, explain:'ปากสั้นหนาช่วยขบเมล็ดแข็งให้แตกได้ง่าย', tier:2},
      {q:'ความสามารถในการห่อลิ้นได้เป็นลักษณะแบบใด?', emoji:'👅', choices:['ลักษณะทางพันธุกรรมที่ได้รับจากพ่อแม่','ทักษะที่ต้องฝึกจึงจะทำได้','ลักษณะที่เกิดจากอาหารที่กิน','ลักษณะที่เปลี่ยนตามอายุ'], correct:0, explain:'การห่อลิ้นเป็นลักษณะที่ถ่ายทอดทางพันธุกรรม', tier:2},
      {q:'ผู้บริโภคลำดับสุดท้ายในโซ่อาหารมักเป็นสัตว์ประเภทใด?', emoji:'🦅', choices:['ผู้ล่าที่ไม่มีสัตว์อื่นล่าต่อ','สัตว์กินพืชขนาดเล็ก','พืชที่มีดอกสวยงาม','แมลงที่ตัวเล็กที่สุด'], correct:0, explain:'ปลายโซ่อาหารคือผู้ล่าสูงสุดที่ไม่ถูกสัตว์อื่นล่ากินต่อ', tier:2},
      {q:'"ข้าว → ตั๊กแตน → กบ → งู" งูเป็นผู้บริโภคลำดับที่เท่าไร?', emoji:'🐍', choices:['ลำดับที่ 3','ลำดับที่ 1','ลำดับที่ 2','เป็นผู้ผลิต'], correct:0, explain:'ตั๊กแตนลำดับ 1 กบลำดับ 2 และงูเป็นลำดับที่ 3', tier:3},
      {q:'ลูกแมวมีสีขนคล้ายแม่แมวเพราะเหตุใด?', emoji:'🐈', choices:['ได้รับการถ่ายทอดลักษณะทางพันธุกรรมจากพ่อแม่','กินอาหารชนิดเดียวกับแม่','อยู่ในบ้านหลังเดียวกัน','เลียนแบบสีขนของแม่'], correct:0, explain:'สีขนเป็นลักษณะทางพันธุกรรมที่ถ่ายทอดจากพ่อแม่สู่ลูก', tier:3},
      {q:'ถ้าจำนวนงูในทุ่งนาลดลงมาก จะเกิดผลใดตามมา?', emoji:'🐀', choices:['หนูเพิ่มจำนวนมากขึ้นและกัดกินต้นข้าวเสียหาย','ข้าวจะโตเร็วขึ้นกว่าเดิม','ตั๊กแตนจะหายไปทั้งหมด','ไม่มีอะไรเปลี่ยนแปลง'], correct:0, explain:'งูเป็นผู้ล่าหนู เมื่องูลดลงหนูจึงเพิ่มจำนวนและทำลายต้นข้าว', tier:3},
      {q:'ต้นบัวมีก้านยาวและใบลอยอยู่ที่ผิวน้ำ เป็นการปรับตัวเพื่ออะไร?', emoji:'🪷', choices:['ให้ใบได้รับแสงแดดที่ผิวน้ำเพื่อสร้างอาหาร','เพื่อให้ปลาเข้ามาอาศัย','เพื่อให้ดูดน้ำได้มากขึ้น','เพื่อป้องกันลมพายุ'], correct:0, explain:'ใบที่ลอยผิวน้ำได้รับแสงแดดเต็มที่สำหรับการสร้างอาหาร', tier:3},
      {q:'เหตุใดสิ่งมีชีวิตต่างชนิดกันจึงมีโครงสร้างร่างกายต่างกัน?', emoji:'🔬', choices:['เพราะปรับตัวให้เหมาะกับแหล่งที่อยู่และการดำรงชีวิตของตน','เพราะเลือกรูปร่างเองได้','เพราะกินอาหารต่างเวลากัน','เพราะมีอายุต่างกัน'], correct:0, explain:'โครงสร้างที่เหมาะกับสภาพแวดล้อมช่วยให้สิ่งมีชีวิตอยู่รอดได้', tier:3},
      {q:'พี่น้องที่เกิดจากพ่อแม่เดียวกันแต่หน้าตาไม่เหมือนกัน เพราะเหตุใด?', emoji:'👨‍👩‍👧‍👦', choices:['ได้รับลักษณะจากพ่อและแม่ในสัดส่วนที่ต่างกัน','เพราะเกิดคนละปี','เพราะกินอาหารต่างกัน','เพราะเรียนคนละโรงเรียน'], correct:0, explain:'ลูกแต่ละคนได้รับการผสมผสานลักษณะจากพ่อแม่ไม่เหมือนกัน', tier:3}
    ]
  },
  {
    id:'p5-sci2', name:'วิทยาศาสตร์ ป.5 · สสาร การละลาย และการเปลี่ยนแปลง', emoji:'🧊', icon:'assets/icons/p5-sci2.svg', color:'#3FA9C9', light:'#D9F0F8', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'น้ำแข็งเปลี่ยนเป็นน้ำเรียกว่าอะไร?', emoji:'🧊', choices:['การหลอมเหลว','การควบแน่น','การระเหิด','การแข็งตัว'], correct:0, explain:'ของแข็งได้รับความร้อนแล้วกลายเป็นของเหลว เรียกว่าการหลอมเหลว', tier:1},
      {q:'น้ำเปลี่ยนเป็นไอน้ำเรียกว่าอะไร?', emoji:'♨️', choices:['การกลายเป็นไอ','การแข็งตัว','การควบแน่น','การหลอมเหลว'], correct:0, explain:'ของเหลวได้รับความร้อนจนกลายเป็นแก๊ส เรียกว่าการกลายเป็นไอ', tier:1},
      {q:'ไอน้ำเปลี่ยนกลับเป็นหยดน้ำเรียกว่าอะไร?', emoji:'💧', choices:['การควบแน่น','การระเหย','การหลอมเหลว','การระเหิด'], correct:0, explain:'แก๊สเย็นลงจนกลายเป็นของเหลว เรียกว่าการควบแน่น', tier:1},
      {q:'น้ำเปลี่ยนเป็นน้ำแข็งเรียกว่าอะไร?', emoji:'❄️', choices:['การแข็งตัว','การหลอมเหลว','การกลายเป็นไอ','การละลาย'], correct:0, explain:'ของเหลวเย็นลงจนกลายเป็นของแข็ง เรียกว่าการแข็งตัว', tier:1},
      {q:'เมื่อใส่เกลือลงในน้ำแล้วคนจนเกลือหายไป เรียกปรากฏการณ์นี้ว่าอะไร?', emoji:'🧂', choices:['การละลาย','การหลอมเหลว','การระเหิด','การเผาไหม้'], correct:0, explain:'เกลือกระจายตัวในน้ำจนเป็นเนื้อเดียวกัน เรียกว่าการละลาย', tier:1},
      {q:'สารละลายเกิดจากอะไร?', emoji:'🥤', choices:['ตัวละลายผสมกับตัวทำละลายจนเป็นเนื้อเดียวกัน','ของแข็งสองชนิดวางซ้อนกัน','น้ำกับน้ำมันแยกชั้นกัน','ทรายตกตะกอนอยู่ก้นแก้ว'], correct:0, explain:'สารละลายต้องผสมกันจนกลายเป็นเนื้อเดียว มองไม่เห็นตัวละลายแยกออกมา', tier:1},
      {q:'ข้อใดเป็นการเปลี่ยนแปลงที่ผันกลับได้?', emoji:'🔄', choices:['น้ำแข็งละลายเป็นน้ำ','กระดาษถูกเผาเป็นเถ้า','ไข่ดิบทอดเป็นไข่ดาว','เหล็กเป็นสนิม'], correct:0, explain:'น้ำแข็งละลายแล้วนำไปแช่แข็งกลับเป็นน้ำแข็งได้อีก', tier:1},
      {q:'ข้อใดเป็นการเปลี่ยนแปลงที่ผันกลับไม่ได้?', emoji:'🔥', choices:['การเผากระดาษจนเป็นเถ้า','น้ำกลายเป็นน้ำแข็ง','เทียนไขหลอมเหลวแล้วแข็งตัวใหม่','น้ำตาลละลายในน้ำ'], correct:0, explain:'เถ้าที่เกิดจากการเผาไม่สามารถกลับมาเป็นกระดาษได้อีก', tier:1},
      {q:'ลูกเหม็นที่ค่อยๆ เล็กลงจนหายไปโดยไม่กลายเป็นของเหลว เกิดจากกระบวนการใด?', emoji:'💨', choices:['การระเหิด','การหลอมเหลว','การควบแน่น','การละลาย'], correct:0, explain:'การระเหิดคือของแข็งเปลี่ยนเป็นแก๊สโดยไม่ผ่านสถานะของเหลว', tier:1},
      {q:'ข้อใดเป็นสัญญาณว่าเกิดการเปลี่ยนแปลงทางเคมี?', emoji:'⚗️', choices:['มีฟองแก๊ส มีตะกอน สีหรือกลิ่นเปลี่ยนไป','สารเปลี่ยนรูปร่างแต่ยังเป็นสารเดิม','น้ำแข็งเปลี่ยนเป็นน้ำ','น้ำตาลละลายหายไปในน้ำ'], correct:0, explain:'การเกิดฟองแก๊ส ตะกอน หรือสี/กลิ่นเปลี่ยน บ่งบอกว่ามีสารใหม่เกิดขึ้น', tier:2},
      {q:'ผสมเบกกิ้งโซดากับน้ำส้มสายชูแล้วเกิดฟองฟู่ แสดงว่าเกิดอะไรขึ้น?', emoji:'🫧', choices:['การเปลี่ยนแปลงทางเคมี เพราะมีแก๊สใหม่เกิดขึ้น','การหลอมเหลวธรรมดา','การละลายแบบผันกลับได้','การควบแน่นของไอน้ำ'], correct:0, explain:'ฟองแก๊สที่เกิดขึ้นเป็นสารใหม่ จึงเป็นการเปลี่ยนแปลงทางเคมี', tier:2},
      {q:'เหล็กเป็นสนิมเป็นการเปลี่ยนแปลงแบบใด?', emoji:'🔩', choices:['การเปลี่ยนแปลงทางเคมีที่ผันกลับไม่ได้','การเปลี่ยนสถานะที่ผันกลับได้','การละลายในน้ำ','การระเหิด'], correct:0, explain:'สนิมเป็นสารใหม่ที่เกิดจากเหล็กทำปฏิกิริยากับออกซิเจนและความชื้น', tier:2},
      {q:'น้ำตาลละลายในน้ำเป็นการเปลี่ยนแปลงแบบใด?', emoji:'🍬', choices:['การเปลี่ยนแปลงทางกายภาพที่ผันกลับได้','การเปลี่ยนแปลงทางเคมี','การเผาไหม้','การเกิดสนิม'], correct:0, explain:'น้ำตาลยังเป็นน้ำตาลอยู่ ระเหยน้ำออกก็ได้น้ำตาลกลับคืนมา', tier:2},
      {q:'ปัจจัยใดช่วยให้น้ำตาลละลายในน้ำได้เร็วขึ้น?', emoji:'🥄', choices:['คนให้ทั่วและใช้น้ำอุ่น','ใช้น้ำเย็นจัดและตั้งทิ้งไว้เฉยๆ','ใส่น้ำตาลก้อนใหญ่ที่สุด','ปิดฝาไว้ไม่ให้แสงเข้า'], correct:0, explain:'ความร้อนและการคนช่วยให้อนุภาคเคลื่อนที่และกระจายตัวเร็วขึ้น', tier:2},
      {q:'ไข่ดิบเมื่อนำไปทอดจนสุก เป็นการเปลี่ยนแปลงแบบใด?', emoji:'🍳', choices:['การเปลี่ยนแปลงทางเคมีที่ผันกลับไม่ได้','การเปลี่ยนสถานะที่ผันกลับได้','การละลาย','การระเหิด'], correct:0, explain:'ไข่สุกแล้วไม่สามารถทำให้กลับเป็นไข่ดิบได้อีก', tier:2},
      {q:'เทียนไขที่หลอมเหลวแล้วเย็นลงจนแข็งตัวใหม่ได้ แสดงว่าเป็นการเปลี่ยนแปลงแบบใด?', emoji:'🕯️', choices:['ผันกลับได้ เพราะยังเป็นเทียนไขเหมือนเดิม','ผันกลับไม่ได้ เพราะเกิดสารใหม่','เป็นการเผาไหม้','เป็นการเกิดสนิม'], correct:0, explain:'สถานะเปลี่ยนไปมาได้แต่สารยังเป็นเทียนไขชนิดเดิม', tier:2},
      {q:'เมื่อทำให้สสารร้อนขึ้น อนุภาคภายในจะเป็นอย่างไร?', emoji:'🌡️', choices:['เคลื่อนที่เร็วขึ้นและอยู่ห่างกันมากขึ้น','หยุดนิ่งสนิท','เคลื่อนที่ช้าลงและชิดกันมากขึ้น','หายไปจากสสาร'], correct:0, explain:'ความร้อนเพิ่มพลังงานให้อนุภาค ทำให้สั่นและเคลื่อนที่เร็วขึ้น', tier:2},
      {q:'สารใดไม่ละลายน้ำ?', emoji:'🫗', choices:['น้ำมันพืช','เกลือแกง','น้ำตาลทราย','ผงน้ำหวาน'], correct:0, explain:'น้ำมันไม่ละลายน้ำ จึงลอยแยกชั้นอยู่ด้านบน', tier:2},
      {q:'เพราะเหตุใดจึงมีหยดน้ำเกาะอยู่ที่ผิวนอกของแก้วน้ำเย็น?', emoji:'🥛', choices:['ไอน้ำในอากาศควบแน่นเมื่อกระทบผิวแก้วที่เย็น','น้ำในแก้วซึมผ่านแก้วออกมา','แก้วละลายกลายเป็นน้ำ','น้ำแข็งระเหิดออกมานอกแก้ว'], correct:0, explain:'อากาศรอบแก้วเย็นลงจนไอน้ำควบแน่นเป็นหยดน้ำเกาะผิวแก้ว', tier:3},
      {q:'ถ้าต้องการแยกเกลือออกจากน้ำเกลือ ควรทำอย่างไร?', emoji:'☀️', choices:['ให้ความร้อนจนน้ำระเหยไปหมด เหลือเกลืออยู่','แช่แข็งน้ำเกลือทั้งหมด','เทน้ำเกลือผ่านกระดาษกรอง','เขย่าแรงๆ ให้แยกชั้น'], correct:0, explain:'น้ำระเหยได้แต่เกลือไม่ระเหย จึงเหลือผลึกเกลืออยู่ (เหมือนการทำนาเกลือ)', tier:3},
      {q:'นมที่ทิ้งไว้จนบูดมีกลิ่นเปรี้ยว เป็นการเปลี่ยนแปลงประเภทใด?', emoji:'🥛', choices:['การเปลี่ยนแปลงทางเคมีที่ผันกลับไม่ได้','การเปลี่ยนสถานะที่ผันกลับได้','การละลายธรรมดา','การควบแน่น'], correct:0, explain:'นมบูดเกิดสารใหม่ที่มีกลิ่นและรสต่างจากเดิม และทำให้กลับเป็นนมดีไม่ได้', tier:3},
      {q:'เหตุใดเสื้อผ้าที่ตากกลางแดดจึงแห้งเร็วกว่าตากในร่ม?', emoji:'👕', choices:['ความร้อนจากแสงแดดทำให้น้ำระเหยเร็วขึ้น','แสงแดดดูดน้ำเข้าไปในตัวเอง','ในร่มมีน้ำมากกว่ากลางแจ้ง','เสื้อผ้าดูดกลืนน้ำกลับเมื่ออยู่ในร่ม'], correct:0, explain:'ความร้อนเพิ่มพลังงานให้โมเลกุลน้ำ ทำให้ระเหยออกจากผ้าได้เร็วขึ้น', tier:3},
      {q:'ผสมน้ำกับทรายแล้วตั้งทิ้งไว้สักครู่ จะสังเกตเห็นอะไร?', emoji:'🏖️', choices:['ทรายตกตะกอนแยกชั้นอยู่ก้นภาชนะ เพราะไม่ละลายน้ำ','ทรายละลายหายไปหมด','น้ำกลายเป็นทรายทั้งหมด','เกิดฟองแก๊สจำนวนมาก'], correct:0, explain:'ทรายไม่ละลายน้ำ จึงตกตะกอนแยกออกจากน้ำอย่างชัดเจน', tier:3},
      {q:'ข้อใดเป็นการเปลี่ยนแปลงทางเคมีทั้งหมด?', emoji:'⚗️', choices:['เผาไม้ เหล็กเป็นสนิม และนมบูด','น้ำแข็งละลาย น้ำเดือด และเกลือละลาย','ตัดกระดาษ ฉีกผ้า และทุบหิน','น้ำค้างเกาะใบไม้ และไอน้ำจับกระจก'], correct:0, explain:'ทั้งสามอย่างเกิดสารใหม่ที่ย้อนกลับไม่ได้ จึงเป็นการเปลี่ยนแปลงทางเคมี', tier:3}
    ]
  },
  {
    id:'p5-sci3', name:'วิทยาศาสตร์ ป.5 · แรงลัพธ์ แรงเสียดทาน และเสียง', emoji:'💨', icon:'assets/icons/p5-sci3.svg', color:'#2E86C1', light:'#D6EAF8', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'"แรงลัพธ์" หมายถึงอะไร?', emoji:'➡️', choices:['ผลรวมของแรงทุกแรงที่กระทำต่อวัตถุ','แรงที่มากที่สุดเพียงแรงเดียว','แรงที่เกิดจากแม่เหล็กเท่านั้น','น้ำหนักของวัตถุ'], correct:0, explain:'แรงลัพธ์คือผลรวมของแรงทั้งหมดที่กระทำต่อวัตถุในขณะนั้น', tier:1},
      {q:'ถ้าแรงสองแรงมีขนาดเท่ากันแต่ทิศตรงข้ามกัน แรงลัพธ์เป็นเท่าไร?', emoji:'⚖️', choices:['เป็นศูนย์ วัตถุจึงอยู่นิ่ง','เท่ากับแรงทั้งสองรวมกัน','เท่ากับแรงใดแรงหนึ่ง','มากกว่าแรงทั้งสองรวมกัน'], correct:0, explain:'แรงหักล้างกันหมด แรงลัพธ์เป็นศูนย์ วัตถุจึงไม่เคลื่อนที่', tier:1},
      {q:'แรงเสียดทานเกิดขึ้นเมื่อใด?', emoji:'🧱', choices:['เมื่อผิวสัมผัสสองผิวถูกันขณะเคลื่อนที่','เมื่อวัตถุลอยอยู่ในอากาศเท่านั้น','เมื่อวัตถุอยู่ในสุญญากาศ','เมื่อไม่มีวัตถุใดสัมผัสกัน'], correct:0, explain:'แรงเสียดทานเกิดที่ผิวสัมผัสและต้านการเคลื่อนที่ของวัตถุ', tier:1},
      {q:'พื้นผิวใดมีแรงเสียดทานน้อยที่สุด?', emoji:'🧊', choices:['พื้นน้ำแข็ง','พื้นพรม','พื้นทราย','พื้นหญ้า'], correct:0, explain:'ผิวน้ำแข็งลื่นมาก แรงเสียดทานจึงน้อยที่สุด', tier:1},
      {q:'เครื่องมือใดใช้วัดขนาดของแรง?', emoji:'🪝', choices:['เครื่องชั่งสปริง','เทอร์โมมิเตอร์','ไม้บรรทัด','นาฬิกาจับเวลา'], correct:0, explain:'เครื่องชั่งสปริงใช้วัดแรงในหน่วยนิวตัน', tier:1},
      {q:'เสียงเกิดจากอะไร?', emoji:'🔔', choices:['การสั่นของวัตถุ','การเปล่งแสงของวัตถุ','การเปลี่ยนสีของวัตถุ','การหลอมเหลวของวัตถุ'], correct:0, explain:'เมื่อวัตถุสั่น จะทำให้ตัวกลางสั่นตามและเดินทางมาถึงหูเราเป็นเสียง', tier:1},
      {q:'เสียงเดินทางผ่านตัวกลางใดได้บ้าง?', emoji:'🌊', choices:['ของแข็ง ของเหลว และอากาศ','อากาศเท่านั้น','ของแข็งเท่านั้น','เดินทางได้แม้ไม่มีตัวกลาง'], correct:0, explain:'เสียงต้องอาศัยตัวกลางในการเดินทาง จะเป็นของแข็ง ของเหลว หรือแก๊สก็ได้', tier:1},
      {q:'เสียงสูงหรือเสียงต่ำขึ้นอยู่กับสิ่งใด?', emoji:'🎵', choices:['ความถี่ของการสั่น','สีของวัตถุที่สั่น','น้ำหนักของผู้ฟัง','เวลาที่ฟังเสียง'], correct:0, explain:'สั่นถี่มากได้เสียงสูง สั่นถี่น้อยได้เสียงต่ำ', tier:1},
      {q:'ชักเย่อโดยฝั่งซ้ายออกแรง 50 นิวตัน ฝั่งขวาออกแรง 30 นิวตัน ผลเป็นอย่างไร?', emoji:'🪢', choices:['เชือกเคลื่อนไปทางซ้าย ด้วยแรงลัพธ์ 20 นิวตัน','เชือกเคลื่อนไปทางขวา ด้วยแรงลัพธ์ 20 นิวตัน','เชือกอยู่นิ่ง','เชือกเคลื่อนไปทางซ้าย ด้วยแรงลัพธ์ 80 นิวตัน'], correct:0, explain:'แรงตรงข้ามให้นำมาลบกัน 50 − 30 = 20 นิวตัน ไปทางฝั่งที่แรงมากกว่า', tier:1},
      {q:'ถ้าวัตถุสั่นด้วยความถี่สูงขึ้น เสียงที่ได้ยินจะเป็นอย่างไร?', emoji:'📈', choices:['เสียงสูงขึ้น','เสียงต่ำลง','เสียงเบาลง','ไม่มีเสียง'], correct:0, explain:'ความถี่สูง = สั่นเร็ว = เสียงแหลมสูง', tier:2},
      {q:'ความดังหรือค่อยของเสียงขึ้นอยู่กับสิ่งใด?', emoji:'🔊', choices:['พลังงานของการสั่น','สีของวัตถุ','อุณหภูมิของห้อง','ความยาวของสายไฟ'], correct:0, explain:'ยิ่งเคาะหรือดีดแรง พลังงานการสั่นยิ่งมาก เสียงจึงดังขึ้น', tier:2},
      {q:'แรงเสียดทานมีประโยชน์อย่างไร?', emoji:'👟', choices:['ช่วยให้เดินไม่ลื่นและช่วยให้รถเบรกหยุดได้','ทำให้วัตถุเคลื่อนที่ได้เร็วขึ้นเสมอ','ทำให้เสียงดังขึ้น','ทำให้วัตถุลอยได้'], correct:0, explain:'แรงเสียดทานช่วยยึดเกาะ ทำให้เดินและหยุดรถได้อย่างปลอดภัย', tier:2},
      {q:'เหตุใดพื้นที่เปียกน้ำจึงลื่นกว่าพื้นแห้ง?', emoji:'💧', choices:['เพราะน้ำทำให้แรงเสียดทานลดลง','เพราะน้ำเพิ่มแรงเสียดทาน','เพราะน้ำทำให้พื้นแข็งขึ้น','เพราะน้ำทำให้เกิดแรงแม่เหล็ก'], correct:0, explain:'ฟิล์มน้ำคั่นระหว่างผิวสัมผัส ทำให้แรงเสียดทานลดลงจึงลื่น', tier:2},
      {q:'เสียงเดินทางในตัวกลางใดได้เร็วที่สุด?', emoji:'🧱', choices:['ของแข็ง','ของเหลว','อากาศ','สุญญากาศ'], correct:0, explain:'อนุภาคของแข็งอยู่ชิดกันมาก จึงส่งต่อการสั่นได้เร็วที่สุด', tier:2},
      {q:'หน่วยที่ใช้วัดระดับความดังของเสียงคืออะไร?', emoji:'📢', choices:['เดซิเบล','นิวตัน','องศาเซลเซียส','กิโลกรัม'], correct:0, explain:'ระดับความดังของเสียงวัดเป็นเดซิเบล (dB)', tier:2},
      {q:'ในอวกาศที่ไม่มีอากาศ เราจะได้ยินเสียงหรือไม่?', emoji:'🚀', choices:['ไม่ได้ยิน เพราะไม่มีตัวกลางให้เสียงเดินทาง','ได้ยินชัดกว่าบนโลก','ได้ยินเฉพาะเสียงสูง','ได้ยินเฉพาะตอนกลางวัน'], correct:0, explain:'เสียงต้องอาศัยตัวกลาง เมื่อไม่มีอากาศจึงไม่มีเสียงเดินทางมาถึงหู', tier:2},
      {q:'สายกีตาร์เส้นเล็กและขึงตึงจะให้เสียงแบบใด?', emoji:'🎸', choices:['เสียงสูง เพราะสั่นด้วยความถี่สูง','เสียงต่ำ เพราะสั่นช้า','ไม่มีเสียงเลย','เสียงเท่ากับสายใหญ่ทุกประการ'], correct:0, explain:'สายเล็กและตึงสั่นเร็ว ความถี่สูง จึงได้เสียงสูง', tier:2},
      {q:'วิธีใดช่วยลดแรงเสียดทาน?', emoji:'⚙️', choices:['หยอดน้ำมันหล่อลื่นหรือใส่ล้อ','ใช้พื้นผิวที่ขรุขระมากขึ้น','เพิ่มน้ำหนักกดลงบนวัตถุ','ใช้ยางที่มีดอกลึกขึ้น'], correct:0, explain:'น้ำมันหล่อลื่นและล้อช่วยลดการเสียดสีระหว่างผิวสัมผัส', tier:2},
      {q:'รถเข็นถูกผลักไปข้างหน้าด้วยแรง 40 นิวตัน และมีแรงเสียดทานต้าน 15 นิวตัน แรงลัพธ์เป็นเท่าไร?', emoji:'🛒', choices:['25 นิวตัน ไปข้างหน้า','55 นิวตัน ไปข้างหน้า','15 นิวตัน ไปข้างหลัง','เป็นศูนย์'], correct:0, explain:'แรงเสียดทานมีทิศตรงข้าม จึงนำมาลบกัน 40 − 15 = 25 นิวตัน', tier:3},
      {q:'ถ้าต้องอยู่ในบริเวณที่มีเสียงดังมากเป็นเวลานาน ควรทำอย่างไร?', emoji:'🎧', choices:['ใส่ที่ครอบหูป้องกันเสียงหรือหลีกเลี่ยงบริเวณนั้น','เปิดเพลงให้ดังกว่าเดิมกลบเสียง','ยืนใกล้แหล่งกำเนิดเสียงมากขึ้น','ตะโกนแข่งกับเสียงนั้น'], correct:0, explain:'เสียงดังเกินไปทำลายประสาทหู จึงควรป้องกันหรือหลีกเลี่ยง', tier:3},
      {q:'เหตุใดยางรถยนต์จึงต้องมีดอกยาง?', emoji:'🛞', choices:['เพื่อเพิ่มแรงเสียดทานไม่ให้ลื่นไถลบนถนน','เพื่อให้รถวิ่งเงียบขึ้น','เพื่อให้ยางเบาลง','เพื่อให้ยางดูสวยงาม'], correct:0, explain:'ดอกยางช่วยรีดน้ำและเพิ่มการยึดเกาะถนน ทำให้ปลอดภัยขึ้น', tier:3},
      {q:'เคาะโต๊ะแล้วเอาหูแนบโต๊ะฟัง จะได้ยินเสียงชัดกว่าฟังผ่านอากาศ เพราะเหตุใด?', emoji:'👂', choices:['ของแข็งนำเสียงได้ดีกว่าอากาศ','อากาศดูดกลืนเสียงทั้งหมด','โต๊ะสร้างเสียงขึ้นมาเอง','หูได้ยินเฉพาะเสียงจากของแข็ง'], correct:0, explain:'อนุภาคในของแข็งอยู่ชิดกัน จึงส่งผ่านการสั่นได้ดีกว่าอากาศ', tier:3},
      {q:'คนสองคนดึงเชือกไปทางเดียวกันด้วยแรง 30 และ 20 นิวตัน แรงลัพธ์เป็นเท่าไร?', emoji:'🤝', choices:['50 นิวตัน ในทิศเดียวกัน','10 นิวตัน ในทิศเดียวกัน','เป็นศูนย์','25 นิวตัน ในทิศตรงข้าม'], correct:0, explain:'แรงทิศเดียวกันให้นำมาบวกกัน 30 + 20 = 50 นิวตัน', tier:3},
      {q:'มลพิษทางเสียงส่งผลต่อคนอย่างไร?', emoji:'😣', choices:['รบกวนการพักผ่อนและทำให้การได้ยินเสื่อมลง','ทำให้มองเห็นได้ชัดขึ้น','ทำให้ร่างกายแข็งแรงขึ้น','ไม่มีผลใดๆ ต่อร่างกาย'], correct:0, explain:'เสียงดังต่อเนื่องรบกวนการนอนหลับ สมาธิ และทำลายประสาทรับเสียง', tier:3}
    ]
  },
  {
    id:'p5-sci4', name:'วิทยาศาสตร์ ป.5 · วัฏจักรน้ำ เมฆฝน และดวงดาว', emoji:'⛅', icon:'assets/icons/p5-sci4.svg', color:'#1F8FA3', light:'#D9F0F8', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ดาวฤกษ์ต่างจากดาวเคราะห์อย่างไร?', emoji:'⭐', choices:['ดาวฤกษ์มีแสงสว่างในตัวเอง ส่วนดาวเคราะห์สะท้อนแสง','ดาวฤกษ์เล็กกว่าดาวเคราะห์เสมอ','ดาวเคราะห์ร้อนกว่าดาวฤกษ์','ดาวฤกษ์โคจรรอบดาวเคราะห์'], correct:0, explain:'ดาวฤกษ์เป็นแหล่งกำเนิดแสง ส่วนดาวเคราะห์สว่างเพราะสะท้อนแสงจากดาวฤกษ์', tier:1},
      {q:'ดวงอาทิตย์จัดเป็นดาวประเภทใด?', emoji:'☀️', choices:['ดาวฤกษ์','ดาวเคราะห์','ดาวบริวาร','ดาวหาง'], correct:0, explain:'ดวงอาทิตย์มีแสงในตัวเอง จึงเป็นดาวฤกษ์ที่อยู่ใกล้โลกที่สุด', tier:1},
      {q:'โลกของเราจัดเป็นดาวประเภทใด?', emoji:'🌍', choices:['ดาวเคราะห์','ดาวฤกษ์','ดาวหาง','กลุ่มดาว'], correct:0, explain:'โลกโคจรรอบดวงอาทิตย์และไม่มีแสงในตัวเอง จึงเป็นดาวเคราะห์', tier:1},
      {q:'น้ำบนโลกส่วนใหญ่เป็นน้ำประเภทใด?', emoji:'🌊', choices:['น้ำเค็มในมหาสมุทร ประมาณร้อยละ 97.5','น้ำจืดในแม่น้ำ ประมาณร้อยละ 90','น้ำแข็งบนภูเขา ประมาณร้อยละ 80','ไอน้ำในอากาศ ประมาณร้อยละ 60'], correct:0, explain:'น้ำบนโลกเกือบทั้งหมดเป็นน้ำเค็ม มีน้ำจืดเพียงประมาณร้อยละ 2.5', tier:1},
      {q:'ขั้นตอนแรกของวัฏจักรน้ำคืออะไร?', emoji:'♨️', choices:['น้ำจากแหล่งน้ำระเหยขึ้นสู่อากาศ','ฝนตกลงมาจากเมฆ','น้ำไหลลงสู่ทะเล','น้ำแข็งละลายบนภูเขา'], correct:0, explain:'ความร้อนจากดวงอาทิตย์ทำให้น้ำระเหยกลายเป็นไอลอยขึ้นไป', tier:1},
      {q:'เมฆเกิดขึ้นได้อย่างไร?', emoji:'☁️', choices:['ไอน้ำลอยสูงขึ้นแล้วเย็นลงจนควบแน่นเป็นละอองน้ำเล็กๆ','ควันจากรถยนต์ลอยขึ้นไปรวมกัน','ฝุ่นจากพื้นดินปลิวขึ้นไป','แสงอาทิตย์สะท้อนกับอากาศ'], correct:0, explain:'ไอน้ำที่ลอยสูงขึ้นเจออากาศเย็นจึงควบแน่นเป็นละอองน้ำรวมกันเป็นเมฆ', tier:1},
      {q:'น้ำค้างมักเกิดขึ้นในช่วงเวลาใด?', emoji:'💧', choices:['กลางคืนถึงเช้ามืดที่อากาศเย็น','เที่ยงวันที่แดดจัด','บ่ายที่อากาศร้อนที่สุด','ตอนที่ลมแรงที่สุด'], correct:0, explain:'อากาศเย็นตอนกลางคืนทำให้ไอน้ำควบแน่นเป็นหยดน้ำเกาะบนใบไม้', tier:1},
      {q:'ฝนเกิดขึ้นได้อย่างไร?', emoji:'🌧️', choices:['ละอองน้ำในเมฆรวมตัวจนมีน้ำหนักมากแล้วตกลงมา','เมฆแตกออกเป็นชิ้นเล็กๆ','ลมพัดน้ำจากทะเลขึ้นฟ้า','ดวงอาทิตย์ผลักน้ำลงมา'], correct:0, explain:'เมื่อละอองน้ำในเมฆรวมกันจนหนักเกินกว่าอากาศจะพยุงไว้ ก็จะตกลงมาเป็นฝน', tier:1},
      {q:'แผนที่ดาวใช้ประโยชน์อย่างไร?', emoji:'🌌', choices:['ใช้ระบุตำแหน่งและเส้นทางขึ้น-ตกของกลุ่มดาวบนท้องฟ้า','ใช้บอกเวลาที่แน่นอนแทนนาฬิกา','ใช้พยากรณ์ราคาสินค้า','ใช้วัดความลึกของทะเล'], correct:0, explain:'แผนที่ดาวช่วยให้เราหาตำแหน่งกลุ่มดาวในแต่ละช่วงเวลาของปีได้', tier:1},
      {q:'หมอกต่างจากเมฆอย่างไร?', emoji:'🌫️', choices:['หมอกคือเมฆที่เกิดใกล้ผิวพื้น','หมอกเกิดจากควันไฟเท่านั้น','หมอกไม่มีน้ำเป็นส่วนประกอบ','หมอกเกิดเฉพาะกลางวันที่ร้อนจัด'], correct:0, explain:'ทั้งคู่คือละอองน้ำที่ควบแน่น ต่างกันที่ระดับความสูงที่เกิด', tier:2},
      {q:'ลูกเห็บเกิดขึ้นได้อย่างไร?', emoji:'🧊', choices:['หยดน้ำถูกกระแสอากาศพัดขึ้นลงในเมฆจนแข็งเป็นก้อนน้ำแข็ง','น้ำแข็งจากขั้วโลกปลิวมาตามลม','ฝนตกลงมาแล้วแข็งตัวบนพื้น','ไอน้ำจับตัวกับฝุ่นบนพื้นดิน'], correct:0, explain:'หยดน้ำถูกพัดขึ้นลงในเมฆฝนฟ้าคะนองซ้ำๆ จนกลายเป็นก้อนน้ำแข็งที่หนักพอจะตกลงมา', tier:2},
      {q:'หิมะเกิดขึ้นในสภาพอากาศแบบใด?', emoji:'❄️', choices:['อากาศเย็นจัดจนไอน้ำกลายเป็นผลึกน้ำแข็งโดยตรง','อากาศร้อนจัดในฤดูร้อน','อากาศแห้งไม่มีความชื้นเลย','อากาศที่มีลมแรงเท่านั้น'], correct:0, explain:'เมื่ออุณหภูมิต่ำกว่าจุดเยือกแข็ง ไอน้ำจะกลายเป็นผลึกน้ำแข็งตกลงมาเป็นหิมะ', tier:2},
      {q:'เหตุใดเราจึงต้องใช้น้ำอย่างประหยัด?', emoji:'🚰', choices:['เพราะน้ำจืดที่มนุษย์ใช้ได้จริงมีปริมาณน้อยมาก','เพราะน้ำบนโลกกำลังจะหายไปหมดในปีหน้า','เพราะน้ำทะเลนำมาดื่มได้ทันที','เพราะฝนไม่เคยตกอีกเลย'], correct:0, explain:'น้ำจืดมีเพียงประมาณร้อยละ 2.5 และส่วนใหญ่เป็นน้ำแข็งขั้วโลกที่นำมาใช้ยาก', tier:2},
      {q:'ดวงจันทร์สว่างในเวลากลางคืนได้อย่างไร?', emoji:'🌕', choices:['สะท้อนแสงจากดวงอาทิตย์','เผาไหม้แก๊สในตัวเอง','สะท้อนแสงจากไฟบนโลก','เรืองแสงเหมือนหิ่งห้อย'], correct:0, explain:'ดวงจันทร์ไม่มีแสงในตัวเอง แต่สะท้อนแสงอาทิตย์มายังโลก', tier:2},
      {q:'น้ำค้างแข็งเกิดขึ้นเมื่อใด?', emoji:'🥶', choices:['เมื่ออุณหภูมิลดต่ำกว่าจุดเยือกแข็ง','เมื่ออากาศร้อนจัดตอนกลางวัน','เมื่อฝนตกหนักติดต่อกัน','เมื่อลมพัดแรงมาก'], correct:0, explain:'ไอน้ำเปลี่ยนเป็นผลึกน้ำแข็งเกาะบนพื้นผิวเมื่ออุณหภูมิต่ำกว่า 0 องศาเซลเซียส', tier:2},
      {q:'หลังฝนตก น้ำส่วนใหญ่ไหลไปที่ใด?', emoji:'🏞️', choices:['ไหลลงสู่แม่น้ำ ลำคลอง และทะเล แล้วระเหยขึ้นไปใหม่','หายไปในอากาศทันที','ไหลออกนอกโลก','ถูกดูดกลับขึ้นไปเป็นเมฆโดยตรง'], correct:0, explain:'น้ำไหลลงสู่แหล่งน้ำและบางส่วนซึมลงดิน แล้วระเหยกลับขึ้นไปหมุนเวียนต่อ', tier:2},
      {q:'ดาวที่เรามองเห็นระยิบระยับบนท้องฟ้ายามค่ำคืนส่วนใหญ่เป็นดาวประเภทใด?', emoji:'✨', choices:['ดาวฤกษ์','ดาวเคราะห์','ดาวบริวารของโลก','ดาวเทียม'], correct:0, explain:'จุดแสงส่วนใหญ่บนท้องฟ้าคือดาวฤกษ์ที่อยู่ไกลมากและมีแสงในตัวเอง', tier:2},
      {q:'เพราะเหตุใดจึงมองเห็นกลุ่มดาวเปลี่ยนตำแหน่งไปในรอบปี?', emoji:'🔄', choices:['เพราะโลกโคจรรอบดวงอาทิตย์','เพราะกลุ่มดาวเคลื่อนที่มาหาโลก','เพราะดวงจันทร์บังกลุ่มดาว','เพราะบรรยากาศโลกหนาขึ้น'], correct:0, explain:'เมื่อโลกโคจรไปในตำแหน่งต่างๆ เราจึงเห็นท้องฟ้ากลางคืนคนละด้านของอวกาศ', tier:2},
      {q:'ข้อใดเรียงลำดับวัฏจักรน้ำได้ถูกต้อง?', emoji:'🔄', choices:['ระเหย → ควบแน่นเป็นเมฆ → ฝนตก → ไหลลงแหล่งน้ำ','ฝนตก → ระเหย → ไหลลงแหล่งน้ำ → ควบแน่น','ควบแน่น → ระเหย → ฝนตก → ไหลลงแหล่งน้ำ','ไหลลงแหล่งน้ำ → ฝนตก → ควบแน่น → ระเหย'], correct:0, explain:'น้ำระเหยขึ้นไป ควบแน่นเป็นเมฆ ตกลงมาเป็นฝน แล้วไหลกลับสู่แหล่งน้ำ หมุนเวียนไม่สิ้นสุด', tier:3},
      {q:'ถ้าตัดต้นไม้จำนวนมากในพื้นที่หนึ่ง จะกระทบวัฏจักรน้ำอย่างไร?', emoji:'🪓', choices:['ความชื้นจากการคายน้ำของพืชลดลง ฝนในพื้นที่อาจน้อยลง','ฝนจะตกมากขึ้นกว่าเดิมทุกปี','น้ำในดินจะเพิ่มขึ้นอย่างมาก','วัฏจักรน้ำจะหยุดทำงานทันที'], correct:0, explain:'พืชคายน้ำสู่บรรยากาศ เมื่อป่าลดลงความชื้นในอากาศจึงลดตามไปด้วย', tier:3},
      {q:'เหตุใดบริเวณใกล้ทะเลจึงมีความชื้นในอากาศสูง?', emoji:'🏖️', choices:['เพราะน้ำทะเลระเหยขึ้นสู่อากาศเป็นปริมาณมาก','เพราะทะเลเย็นกว่าพื้นดินเสมอ','เพราะไม่มีลมพัดผ่านทะเล','เพราะทะเลมีเกลือมาก'], correct:0, explain:'พื้นที่ผิวน้ำกว้างทำให้มีการระเหยมาก อากาศแถบชายฝั่งจึงชื้น', tier:3},
      {q:'ฝน หิมะ และลูกเห็บ ต่างกันอย่างไร?', emoji:'🌨️', choices:['ต่างกันที่อุณหภูมิและสถานะของน้ำที่ตกลงมา','ต่างกันที่สีของเมฆเท่านั้น','ต่างกันที่ความเร็วลมเท่านั้น','ต่างกันที่ช่วงเวลาของวัน'], correct:0, explain:'ฝนเป็นของเหลว หิมะเป็นผลึกน้ำแข็ง ส่วนลูกเห็บเป็นก้อนน้ำแข็งแข็งตัวซ้ำหลายชั้น', tier:3},
      {q:'แนวทางใดเป็นการใช้น้ำอย่างประหยัดที่ทำได้จริงในบ้าน?', emoji:'💧', choices:['ปิดก๊อกขณะแปรงฟันและนำน้ำล้างผักไปรดต้นไม้','เปิดน้ำทิ้งไว้ตลอดเวลาที่ล้างจาน','อาบน้ำนานที่สุดเท่าที่จะทำได้','ล้างรถทุกวันด้วยสายยาง'], correct:0, explain:'การปิดก๊อกเมื่อไม่ใช้และนำน้ำกลับมาใช้ซ้ำช่วยลดการใช้น้ำได้จริง', tier:3},
      {q:'เพราะเหตุใดน้ำในโลกจึงไม่หมดไป แม้จะมีการใช้ทุกวัน?', emoji:'♻️', choices:['เพราะน้ำหมุนเวียนอยู่ในวัฏจักรน้ำตลอดเวลา','เพราะมีคนสร้างน้ำขึ้นใหม่ทุกวัน','เพราะน้ำตกลงมาจากอวกาศเสมอ','เพราะน้ำเพิ่มจำนวนขึ้นเองในทะเล'], correct:0, explain:'น้ำเปลี่ยนสถานะและหมุนเวียนไปมา แต่ปริมาณรวมบนโลกแทบไม่เปลี่ยนแปลง', tier:3}
    ]
  },
  /* ---------- เชาวน์ / ดนตรี / ศิลปะ / ธรรมชาติ ป.5 : 5 หมวด ---------- */
  {
    id:'p5-iq1', name:'เชาวน์ ป.5 · ตรรกะและการให้เหตุผล', emoji:'🪄', icon:'assets/icons/p5-iq1.svg', color:'#2FB673', light:'#D6F3E4', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'เลขถัดไปคืออะไร: 2, 4, 8, 16, ▢', emoji:'🔢', choices:['32','20','24','18'], correct:0, explain:'แต่ละจำนวนคูณด้วย 2 ดังนั้น 16 × 2 = 32', tier:1},
      {q:'เลขถัดไปคืออะไร: 3, 6, 9, 12, ▢', emoji:'➕', choices:['15','13','16','18'], correct:0, explain:'เพิ่มทีละ 3 ดังนั้น 12 + 3 = 15', tier:1},
      {q:'ถ้าวันนี้เป็นวันอังคาร อีก 3 วันจะเป็นวันอะไร?', emoji:'📅', choices:['วันศุกร์','วันพฤหัสบดี','วันเสาร์','วันพุธ'], correct:0, explain:'พุธ พฤหัสบดี ศุกร์ นับไป 3 วันได้วันศุกร์', tier:1},
      {q:'ทุกคนในห้องนี้ใส่เสื้อสีขาว แดงอยู่ในห้องนี้ แดงใส่เสื้อสีอะไร?', emoji:'👕', choices:['สีขาว','สีแดง','สีดำ','บอกไม่ได้'], correct:0, explain:'ถ้าทุกคนในห้องใส่สีขาว และแดงอยู่ในห้อง แดงจึงต้องใส่สีขาวด้วย', tier:1},
      {q:'เลขถัดไปคืออะไร: 1, 4, 9, 16, ▢', emoji:'🔷', choices:['25','20','24','18'], correct:0, explain:'เป็นเลขยกกำลังสอง 1×1, 2×2, 3×3, 4×4 ถัดไปคือ 5×5 = 25', tier:1},
      {q:'รูปแบบถัดไปคืออะไร: A B A B A ▢', emoji:'🔁', choices:['B','A','C','D'], correct:0, explain:'สลับ A กับ B ไปเรื่อยๆ ถัดจาก A คือ B', tier:1},
      {q:'เลขถัดไปคืออะไร: 100, 90, 80, ▢', emoji:'📉', choices:['70','75','60','85'], correct:0, explain:'ลดลงทีละ 10 ดังนั้น 80 − 10 = 70', tier:1},
      {q:'ข้อใดไม่เข้าพวก?', emoji:'🔍', choices:['รถยนต์','แมว','สุนัข','ช้าง'], correct:0, explain:'แมว สุนัข ช้าง เป็นสัตว์ ส่วนรถยนต์เป็นสิ่งไม่มีชีวิต', tier:1},
      {q:'ถ้าเด็ก 5 คน กินขนม 5 ชิ้น ใน 5 นาที เด็ก 1 คนกินขนม 1 ชิ้นใช้เวลากี่นาที?', emoji:'🍬', choices:['5 นาที','1 นาที','25 นาที','10 นาที'], correct:0, explain:'ทุกคนกินพร้อมกัน คนละ 1 ชิ้นใน 5 นาที ดังนั้น 1 คนก็ใช้ 5 นาทีเท่าเดิม', tier:1},
      {q:'เลขถัดไปคืออะไร: 1, 1, 2, 3, 5, 8, ▢', emoji:'🌀', choices:['13','11','10','16'], correct:0, explain:'แต่ละจำนวนเกิดจากผลบวกของสองจำนวนก่อนหน้า 5 + 8 = 13', tier:2},
      {q:'ถ้า A มากกว่า B และ B มากกว่า C ข้อใดถูกต้อง?', emoji:'⚖️', choices:['A มากกว่า C','C มากกว่า A','A เท่ากับ C','บอกไม่ได้เลย'], correct:0, explain:'เมื่อ A > B และ B > C จึงสรุปได้ว่า A > C', tier:2},
      {q:'เลขถัดไปคืออะไร: 2, 3, 5, 7, 11, ▢', emoji:'🔢', choices:['13','12','14','15'], correct:0, explain:'เป็นลำดับจำนวนเฉพาะ ถัดจาก 11 คือ 13', tier:2},
      {q:'เวลา 3 นาฬิกาตรง เข็มสั้นกับเข็มยาวทำมุมกันกี่องศา?', emoji:'🕒', choices:['90 องศา','180 องศา','45 องศา','120 องศา'], correct:0, explain:'เข็มยาวชี้ 12 เข็มสั้นชี้ 3 ห่างกัน 3 ช่อง ช่องละ 30 องศา = 90 องศา', tier:2},
      {q:'ในตารางซูโดกุ 4×4 แถวหนึ่งมีเลข 1, 2, 3 อยู่แล้ว ช่องว่างต้องเป็นเลขใด?', emoji:'🧩', choices:['4','1','2','3'], correct:0, explain:'แต่ละแถวต้องมีเลข 1-4 ครบโดยไม่ซ้ำ จึงเหลือเลข 4', tier:2},
      {q:'พ่ออายุมากกว่าลูก 25 ปี ถ้าลูกอายุ 10 ปี พ่ออายุเท่าไร?', emoji:'👨‍👦', choices:['35 ปี','25 ปี','15 ปี','45 ปี'], correct:0, explain:'10 + 25 = 35 ปี', tier:2},
      {q:'เลขถัดไปคืออะไร: 5, 10, 20, 40, ▢', emoji:'✖️', choices:['80','60','50','100'], correct:0, explain:'คูณด้วย 2 ทุกครั้ง 40 × 2 = 80', tier:2},
      {q:'"ถ้าฝนตก แล้วถนนจะเปียก" วันนี้ถนนไม่เปียก สรุปได้ว่าอย่างไร?', emoji:'🌂', choices:['วันนี้ฝนไม่ตก','วันนี้ฝนตก','ถนนกำลังจะเปียก','สรุปไม่ได้เลย'], correct:0, explain:'ถ้าฝนตกถนนต้องเปียก เมื่อถนนไม่เปียกจึงแปลว่าฝนไม่ตก', tier:2},
      {q:'ในกล่องมีลูกบอลสีแดง 3 ลูก สีน้ำเงิน 2 ลูก หยิบขึ้นมา 1 ลูกโดยไม่มอง โอกาสเป็นอย่างไร?', emoji:'🎱', choices:['มีโอกาสได้สีแดงมากกว่าสีน้ำเงิน','มีโอกาสได้สีน้ำเงินมากกว่า','มีโอกาสเท่ากันพอดี','ไม่มีโอกาสได้สีแดงเลย'], correct:0, explain:'สีแดงมี 3 ลูกจาก 5 ลูก มากกว่าสีน้ำเงินที่มี 2 ลูก', tier:2},
      {q:'เลขถัดไปคืออะไร: 3, 7, 15, 31, ▢', emoji:'🔢', choices:['63','47','62','58'], correct:0, explain:'แต่ละจำนวนคูณ 2 แล้วบวก 1 ดังนั้น 31 × 2 + 1 = 63', tier:3},
      {q:'โปรแกรมกำหนดว่า "ถ้าจำนวนหารด้วย 2 ลงตัว ให้แสดงคำว่า คู่" ถ้าใส่เลข 7 จะได้ผลอย่างไร?', emoji:'🤖', choices:['ไม่แสดงคำว่า คู่ เพราะ 7 หารด้วย 2 ไม่ลงตัว','แสดงคำว่า คู่','โปรแกรมจะหยุดทำงาน','แสดงเลข 2'], correct:0, explain:'7 ÷ 2 เหลือเศษ 1 เงื่อนไขจึงเป็นเท็จ โปรแกรมจึงไม่แสดงคำว่า คู่', tier:3},
      {q:'มีคน 3 คน จับมือทักทายกันครบทุกคู่ จะจับมือทั้งหมดกี่ครั้ง?', emoji:'🤝', choices:['3 ครั้ง','6 ครั้ง','2 ครั้ง','9 ครั้ง'], correct:0, explain:'คู่ที่เป็นไปได้คือ A-B, A-C, B-C รวม 3 ครั้ง', tier:3},
      {q:'เลขถัดไปคืออะไร: 1, 2, 6, 24, ▢', emoji:'🧮', choices:['120','48','96','72'], correct:0, explain:'คูณด้วย 2, 3, 4 ตามลำดับ ถัดไปคูณ 5 ได้ 24 × 5 = 120', tier:3},
      {q:'แหล่งข้อมูลใดน่าเชื่อถือที่สุดสำหรับการทำรายงาน?', emoji:'🔎', choices:['เว็บไซต์ของหน่วยงานราชการหรือหนังสือวิชาการ','ข้อความที่เพื่อนส่งต่อกันมา','ข้อความลูกโซ่ในแชท','โพสต์ที่ไม่ระบุแหล่งที่มา'], correct:0, explain:'ข้อมูลจากหน่วยงานทางการมีการตรวจสอบและอ้างอิงแหล่งที่มาชัดเจน', tier:3},
      {q:'เลข 4 หลักคือ 3 ▢ 7 5 ถ้าผลบวกของทุกหลักเท่ากับ 20 หลักที่หายไปคือเลขใด?', emoji:'❓', choices:['5','4','6','3'], correct:0, explain:'3 + 7 + 5 = 15 ต้องการรวม 20 จึงขาดอีก 5', tier:3}
    ]
  },
  {
    id:'p5-iq2', name:'เชาวน์ ป.5 · มิติสัมพันธ์และการอ่านข้อมูล', emoji:'🪞', icon:'assets/icons/p5-iq2.svg', color:'#1F9C60', light:'#D6F3E4', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ลูกบาศก์มีหน้าทั้งหมดกี่หน้า?', emoji:'🧊', choices:['6 หน้า','4 หน้า','8 หน้า','12 หน้า'], correct:0, explain:'ลูกบาศก์มี 6 หน้า แต่ละหน้าเป็นสี่เหลี่ยมจัตุรัสเท่ากัน', tier:1},
      {q:'ถ้าคลี่กล่องทรงสี่เหลี่ยมออกเป็นแผ่นแบน จะได้รูปสี่เหลี่ยมกี่ชิ้น?', emoji:'📦', choices:['6 ชิ้น','4 ชิ้น','8 ชิ้น','5 ชิ้น'], correct:0, explain:'กล่องมี 6 หน้า เมื่อคลี่ออกจึงได้ 6 ชิ้น', tier:1},
      {q:'พีระมิดฐานสี่เหลี่ยมมีหน้าทั้งหมดกี่หน้า?', emoji:'🔺', choices:['5 หน้า','4 หน้า','6 หน้า','8 หน้า'], correct:0, explain:'มีฐานสี่เหลี่ยม 1 หน้า และหน้าสามเหลี่ยมข้าง 4 หน้า รวม 5 หน้า', tier:1},
      {q:'เงาของลูกบอลทรงกลมที่ทอดลงบนพื้นเป็นรูปใด?', emoji:'⚽', choices:['วงกลม','สี่เหลี่ยม','สามเหลี่ยม','ดาว'], correct:0, explain:'ทรงกลมมองจากทุกด้านเป็นวงกลม เงาจึงเป็นวงกลม', tier:1},
      {q:'หน้าตัดของทรงกระบอกเมื่อตัดขวางเป็นรูปใด?', emoji:'🥫', choices:['วงกลม','สี่เหลี่ยมผืนผ้า','สามเหลี่ยม','หกเหลี่ยม'], correct:0, explain:'ตัดขวางทรงกระบอกจะได้หน้าตัดเป็นวงกลมเสมอ', tier:1},
      {q:'แผนภูมิแท่งเหมาะกับการแสดงข้อมูลแบบใด?', emoji:'📊', choices:['เปรียบเทียบปริมาณของแต่ละกลุ่ม','บอกทิศทางบนแผนที่','วัดอุณหภูมิร่างกาย','บอกเวลาของนาฬิกา'], correct:0, explain:'ความสูงของแท่งช่วยเปรียบเทียบปริมาณระหว่างกลุ่มได้ชัดเจน', tier:1},
      {q:'กราฟเส้นเหมาะกับข้อมูลแบบใดมากที่สุด?', emoji:'📈', choices:['การเปลี่ยนแปลงของข้อมูลตามเวลา','การบอกตำแหน่งบนแผนที่','การนับจำนวนสัตว์เลี้ยง','การวัดน้ำหนักครั้งเดียว'], correct:0, explain:'กราฟเส้นแสดงแนวโน้มการขึ้นลงตามช่วงเวลาได้ดี', tier:1},
      {q:'ภาพที่เห็นในกระจกเงาจะมีลักษณะอย่างไร?', emoji:'🪞', choices:['กลับด้านซ้าย-ขวา','กลับหัวกลับหาง','เล็กลงครึ่งหนึ่ง','เปลี่ยนเป็นสีตรงข้าม'], correct:0, explain:'กระจกเงาสะท้อนภาพให้กลับด้านซ้าย-ขวา', tier:1},
      {q:'ลูกบาศก์มีจุดยอด (มุม) ทั้งหมดกี่จุด?', emoji:'🔷', choices:['8 จุด','6 จุด','12 จุด','4 จุด'], correct:0, explain:'ลูกบาศก์มีจุดยอด 8 จุด ขอบ 12 ขอบ และหน้า 6 หน้า', tier:1},
      {q:'ลูกบาศก์ขนาด 2×2×2 ประกอบด้วยลูกบาศก์หน่วยเล็กกี่ก้อน?', emoji:'🧊', choices:['8 ก้อน','6 ก้อน','4 ก้อน','12 ก้อน'], correct:0, explain:'2 × 2 × 2 = 8 ก้อน', tier:2},
      {q:'ลูกบาศก์ขนาด 3×3×3 ประกอบด้วยลูกบาศก์หน่วยเล็กกี่ก้อน?', emoji:'📦', choices:['27 ก้อน','9 ก้อน','18 ก้อน','36 ก้อน'], correct:0, explain:'3 × 3 × 3 = 27 ก้อน', tier:2},
      {q:'พับกระดาษครึ่งหนึ่งสองครั้งแล้วคลี่ออก จะเห็นรอยพับแบ่งกระดาษเป็นกี่ช่อง?', emoji:'📄', choices:['4 ช่อง','2 ช่อง','6 ช่อง','8 ช่อง'], correct:0, explain:'พับครั้งแรกได้ 2 ช่อง พับอีกครั้งได้ 4 ช่อง', tier:2},
      {q:'กราฟอุณหภูมิ: จันทร์ 28°C อังคาร 31°C พุธ 29°C วันใดร้อนที่สุด?', emoji:'🌡️', choices:['วันอังคาร','วันจันทร์','วันพุธ','ร้อนเท่ากันทุกวัน'], correct:0, explain:'31 องศาเซลเซียสเป็นค่าที่สูงที่สุดในสามวันนี้', tier:2},
      {q:'ปริซึมสามเหลี่ยมมีขอบ (สัน) ทั้งหมดกี่ขอบ?', emoji:'📐', choices:['9 ขอบ','6 ขอบ','12 ขอบ','5 ขอบ'], correct:0, explain:'มีขอบของสามเหลี่ยมสองหน้า 3+3 และขอบเชื่อมอีก 3 รวม 9 ขอบ', tier:2},
      {q:'ตัวอักษร N เมื่อหมุน 180 องศา จะได้ตัวอักษรใด?', emoji:'🔄', choices:['N เหมือนเดิม','Z','M','W'], correct:0, explain:'ตัว N หมุนครึ่งรอบแล้วยังคงเป็นตัว N', tier:2},
      {q:'ข้อมูลชุดหนึ่งคือ 4, 6, 8, 10 ผลรวมเท่ากับเท่าไร?', emoji:'🧮', choices:['28','24','30','26'], correct:0, explain:'4 + 6 + 8 + 10 = 28', tier:2},
      {q:'ในแผนภูมิแท่ง แท่ง A สูงเป็น 2 เท่าของแท่ง B ถ้า B มีค่า 15 แท่ง A มีค่าเท่าไร?', emoji:'📊', choices:['30','17','7.5','25'], correct:0, explain:'15 × 2 = 30', tier:2},
      {q:'มองกล่องทรงสี่เหลี่ยมจากด้านบนตรงๆ จะเห็นเป็นรูปใด?', emoji:'👁️', choices:['สี่เหลี่ยม','วงกลม','สามเหลี่ยม','ห้าเหลี่ยม'], correct:0, explain:'มองจากด้านบนจะเห็นหน้าบนของกล่องซึ่งเป็นสี่เหลี่ยม', tier:2},
      {q:'ลูกเต๋ามีแต้มหน้าตรงข้ามรวมกันได้ 7 เสมอ ถ้าหน้าบนเป็นแต้ม 2 หน้าล่างเป็นแต้มเท่าไร?', emoji:'🎲', choices:['5','6','4','3'], correct:0, explain:'7 − 2 = 5 จึงเป็นแต้ม 5', tier:3},
      {q:'กล่องขนาด 4×3×2 ประกอบด้วยลูกบาศก์หน่วยกี่ก้อน?', emoji:'📦', choices:['24 ก้อน','9 ก้อน','12 ก้อน','18 ก้อน'], correct:0, explain:'4 × 3 × 2 = 24 ก้อน', tier:3},
      {q:'กราฟเส้นแสดงน้ำหนักของเด็กคนหนึ่งเพิ่มขึ้นทุกเดือน แปลความหมายได้อย่างไร?', emoji:'📈', choices:['เด็กมีน้ำหนักเพิ่มขึ้นอย่างต่อเนื่อง','เด็กมีน้ำหนักลดลง','น้ำหนักคงที่ตลอด','ข้อมูลผิดพลาด'], correct:0, explain:'เส้นกราฟที่ไต่ขึ้นเรื่อยๆ แสดงว่าค่าเพิ่มขึ้นต่อเนื่อง', tier:3},
      {q:'คะแนนสอบ 4 ครั้งคือ 10, 20, 30, 40 ค่าเฉลี่ยเท่ากับเท่าไร?', emoji:'📝', choices:['25','30','20','35'], correct:0, explain:'ผลรวม 100 หารด้วยจำนวนครั้ง 4 ได้ 25', tier:3},
      {q:'ปริซึมสี่เหลี่ยมมุมฉาก (กล่อง) มีขอบทั้งหมดกี่ขอบ?', emoji:'📐', choices:['12 ขอบ','8 ขอบ','6 ขอบ','16 ขอบ'], correct:0, explain:'กล่องมีขอบยาว 4 ขอบ กว้าง 4 ขอบ และสูง 4 ขอบ รวม 12 ขอบ', tier:3},
      {q:'ถ้าพับรูปคลี่รูปหนึ่งแล้วได้ลูกบาศก์พอดี รูปคลี่นั้นต้องมีสี่เหลี่ยมจัตุรัสกี่รูป?', emoji:'🧩', choices:['6 รูป','4 รูป','5 รูป','8 รูป'], correct:0, explain:'ลูกบาศก์มี 6 หน้า รูปคลี่จึงต้องมีสี่เหลี่ยมจัตุรัส 6 รูปพอดี', tier:3}
    ]
  },
  {
    id:'p5-music1', name:'ดนตรี ป.5 · โน้ต จังหวะ และวงดนตรี', emoji:'🪇', icon:'assets/icons/p5-music1.svg', color:'#4C8DF0', light:'#DEEAFC', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'เครื่องดนตรีไทยชนิดใดเป็นเครื่องสาย?', emoji:'🎻', choices:['ซอด้วง','ขลุ่ย','ฉิ่ง','กลองทัด'], correct:0, explain:'ซอด้วงใช้คันชักสีสาย จึงเป็นเครื่องสาย', tier:1},
      {q:'ในอัตราจังหวะ 4/4 โน้ตตัวดำ 1 ตัวมีค่ากี่จังหวะ?', emoji:'♩', choices:['1 จังหวะ','2 จังหวะ','4 จังหวะ','ครึ่งจังหวะ'], correct:0, explain:'โน้ตตัวดำมีค่า 1 จังหวะในอัตรา 4/4', tier:1},
      {q:'โน้ตตัวขาวมีค่ากี่จังหวะในอัตรา 4/4?', emoji:'🎼', choices:['2 จังหวะ','1 จังหวะ','4 จังหวะ','3 จังหวะ'], correct:0, explain:'โน้ตตัวขาวมีค่าเท่ากับโน้ตตัวดำ 2 ตัว คือ 2 จังหวะ', tier:1},
      {q:'โน้ตตัวกลมมีค่ากี่จังหวะในอัตรา 4/4?', emoji:'⭕', choices:['4 จังหวะ','2 จังหวะ','1 จังหวะ','8 จังหวะ'], correct:0, explain:'โน้ตตัวกลมยาวเต็มห้อง คือ 4 จังหวะ', tier:1},
      {q:'เครื่องดนตรีไทยชนิดใดเป็นเครื่องเป่า?', emoji:'🪈', choices:['ขลุ่ย','ระนาด','ซออู้','จะเข้'], correct:0, explain:'ขลุ่ยใช้ลมเป่าให้เกิดเสียง จึงเป็นเครื่องเป่า', tier:1},
      {q:'บันไดเสียง C เมเจอร์ เริ่มต้นที่โน้ตตัวใด?', emoji:'🎹', choices:['โด (C)','เร (D)','มี (E)','ซอล (G)'], correct:0, explain:'บันไดเสียง C เมเจอร์เริ่มจากโน้ตโด แล้วไล่ขึ้นไป', tier:1},
      {q:'เครื่องดนตรีไทยชนิดใดเป็นเครื่องตี?', emoji:'🪘', choices:['ระนาดเอก','ขลุ่ย','ซอด้วง','ปี่ใน'], correct:0, explain:'ระนาดเอกใช้ไม้ตีลงบนลูกระนาด จึงเป็นเครื่องตี', tier:1},
      {q:'เครื่องหมายประจำจังหวะ 4/4 หมายความว่าอย่างไร?', emoji:'🔢', choices:['หนึ่งห้องเพลงมี 4 จังหวะ','เพลงยาว 4 นาที','ใช้เครื่องดนตรี 4 ชิ้น','ต้องเล่นซ้ำ 4 รอบ'], correct:0, explain:'เลขบนบอกจำนวนจังหวะในหนึ่งห้อง คือ 4 จังหวะ', tier:1},
      {q:'ระดับความดัง-ค่อยของเสียงดนตรีเรียกว่าอะไร?', emoji:'🔊', choices:['ระดับความดัง (dynamics)','ทำนอง','จังหวะ','คีย์'], correct:0, explain:'dynamics คือการกำหนดว่าช่วงใดควรเล่นดังหรือค่อย', tier:1},
      {q:'วงปี่พาทย์ประกอบด้วยเครื่องดนตรีประเภทใดเป็นหลัก?', emoji:'🥁', choices:['เครื่องตีและเครื่องเป่า','เครื่องสายเท่านั้น','เครื่องไฟฟ้า','เครื่องเป่าทองเหลืองแบบสากล'], correct:0, explain:'วงปี่พาทย์มีระนาด ฆ้องวง กลอง และปี่เป็นหลัก', tier:2},
      {q:'วงเครื่องสายไทยมีเครื่องดนตรีใดเป็นหลัก?', emoji:'🪕', choices:['ซอด้วง ซออู้ และจะเข้','ระนาดและฆ้องวง','กลองชุดและกีตาร์ไฟฟ้า','ทรัมเป็ตและทรอมโบน'], correct:0, explain:'วงเครื่องสายไทยใช้เครื่องสายเป็นแกนหลัก เช่น ซอและจะเข้', tier:2},
      {q:'โน้ตสากลเรียงจากเสียงต่ำไปสูงคือข้อใด?', emoji:'🎶', choices:['โด เร มี ฟา ซอล ลา ที','ที ลา ซอล ฟา มี เร โด','โด มี เร ฟา ลา ซอล ที','ฟา โด เร มี ที ลา ซอล'], correct:0, explain:'ลำดับเสียงจากต่ำไปสูงคือ โด เร มี ฟา ซอล ลา ที แล้วขึ้นโดสูง', tier:2},
      {q:'เครื่องหมาย # (ชาร์ป) ทำให้เสียงเป็นอย่างไร?', emoji:'⬆️', choices:['สูงขึ้นครึ่งเสียง','ต่ำลงครึ่งเสียง','ดังขึ้นเป็นสองเท่า','ยาวขึ้นหนึ่งจังหวะ'], correct:0, explain:'ชาร์ปยกระดับเสียงของโน้ตนั้นขึ้นครึ่งเสียง', tier:2},
      {q:'เครื่องหมาย ♭ (แฟลต) ทำให้เสียงเป็นอย่างไร?', emoji:'⬇️', choices:['ต่ำลงครึ่งเสียง','สูงขึ้นครึ่งเสียง','เบาลงครึ่งหนึ่ง','สั้นลงครึ่งจังหวะ'], correct:0, explain:'แฟลตลดระดับเสียงของโน้ตนั้นลงครึ่งเสียง', tier:2},
      {q:'เครื่องดนตรีใดในวงออร์เคสตราจัดเป็นเครื่องสาย?', emoji:'🎻', choices:['ไวโอลิน','ทรัมเป็ต','ฟลุต','กลองทิมปานี'], correct:0, explain:'ไวโอลินใช้คันชักสีสาย จึงเป็นเครื่องสายของวงออร์เคสตรา', tier:2},
      {q:'อัตราจังหวะ 3/4 นิยมใช้กับเพลงประเภทใด?', emoji:'💃', choices:['เพลงวอลซ์','เพลงมาร์ช','เพลงร็อก','เพลงแร็ป'], correct:0, explain:'จังหวะ 3 ใน 1 ห้องให้ความรู้สึกหมุนวนเหมาะกับเพลงวอลซ์', tier:2},
      {q:'"ตัวหยุด" ในโน้ตดนตรีหมายถึงอะไร?', emoji:'🤫', choices:['ช่วงที่ไม่ต้องบรรเลงเสียงตามค่าที่กำหนด','จุดจบของเพลง','สัญลักษณ์ให้เล่นดังขึ้น','คำสั่งให้เล่นซ้ำ'], correct:0, explain:'ตัวหยุดกำหนดความเงียบให้มีความยาวตามค่าของมัน', tier:2},
      {q:'ขณะบรรเลงเพลงชาติไทย ควรปฏิบัติตนอย่างไร?', emoji:'🇹🇭', choices:['ยืนตรงแสดงความเคารพ','นั่งคุยกันตามปกติ','เดินผ่านไปเฉยๆ','ปรบมือให้จังหวะ'], correct:0, explain:'การยืนตรงเป็นการแสดงความเคารพต่อชาติ', tier:2},
      {q:'ในอัตรา 4/4 ถ้าห้องหนึ่งมีโน้ตตัวขาว 1 ตัวแล้ว ต้องเติมโน้ตตัวดำอีกกี่ตัวจึงจะครบห้อง?', emoji:'🎼', choices:['2 ตัว','1 ตัว','4 ตัว','3 ตัว'], correct:0, explain:'ตัวขาว 2 จังหวะ ยังขาดอีก 2 จังหวะ จึงเติมตัวดำ 2 ตัว', tier:3},
      {q:'บันไดเสียงเมเจอร์มีกี่เสียงก่อนจะกลับมาซ้ำที่โน้ตเดิม?', emoji:'🎹', choices:['7 เสียง','5 เสียง','8 เสียง','12 เสียง'], correct:0, explain:'มี 7 เสียงคือ โด เร มี ฟา ซอล ลา ที แล้วจึงกลับมาที่โดอีกครั้ง', tier:3},
      {q:'ระนาดเอกกับระนาดทุ้มแตกต่างกันอย่างไร?', emoji:'🪘', choices:['ระนาดเอกให้เสียงสูงและกระชับกว่าระนาดทุ้ม','ระนาดเอกเป็นเครื่องเป่า','ระนาดทุ้มมีสายให้ดีด','ทั้งสองให้เสียงเหมือนกันทุกประการ'], correct:0, explain:'ระนาดเอกเสียงสูงสดใส ส่วนระนาดทุ้มเสียงต่ำนุ่มกว่า', tier:3},
      {q:'เพลงที่มีจังหวะเร็วมักให้ความรู้สึกอย่างไร?', emoji:'⚡', choices:['คึกคัก สนุกสนาน ตื่นเต้น','เศร้าและเงียบสงบ','ง่วงนอน','น่ากลัวเสมอ'], correct:0, explain:'อัตราความเร็วของจังหวะมีผลต่ออารมณ์ของเพลงโดยตรง', tier:3},
      {q:'เหตุใดจึงควรอนุรักษ์ดนตรีไทย?', emoji:'🛕', choices:['เป็นมรดกทางวัฒนธรรมที่แสดงเอกลักษณ์ของชาติ','เพราะเล่นง่ายกว่าดนตรีสากล','เพราะเสียงดังกว่าเครื่องดนตรีอื่น','เพราะใช้เวลาฝึกน้อยที่สุด'], correct:0, explain:'ดนตรีไทยสืบทอดกันมายาวนานและเป็นเอกลักษณ์ของวัฒนธรรมไทย', tier:3},
      {q:'ถ้าเล่นเพลงเดียวกันแต่เปลี่ยนความดัง-ค่อยไปจากเดิม จะเกิดผลอย่างไร?', emoji:'🎚', choices:['อารมณ์และความรู้สึกของเพลงเปลี่ยนไป','ทำนองเปลี่ยนเป็นเพลงใหม่','จังหวะจะเร็วขึ้นเอง','เพลงจะสั้นลง'], correct:0, explain:'ทำนองยังเหมือนเดิม แต่ dynamics ทำให้อารมณ์เพลงต่างออกไป', tier:3}
    ]
  },
  {
    id:'p5-art1', name:'ศิลปะ ป.5 · วรรณะสี แสงเงา และงานพื้นบ้าน', emoji:'🪅', icon:'assets/icons/p5-art1.svg', color:'#FF7A45', light:'#FFE4D6', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'แม่สี (สีขั้นที่ 1) ได้แก่สีอะไรบ้าง?', emoji:'🎨', choices:['แดง เหลือง น้ำเงิน','เขียว ส้ม ม่วง','ดำ ขาว เทา','ชมพู ฟ้า น้ำตาล'], correct:0, explain:'แม่สีคือสีที่ผสมจากสีอื่นไม่ได้ ได้แก่ แดง เหลือง น้ำเงิน', tier:1},
      {q:'สีแดงผสมกับสีเหลืองจะได้สีใด?', emoji:'🟠', choices:['สีส้ม','สีเขียว','สีม่วง','สีน้ำตาล'], correct:0, explain:'แดง + เหลือง = ส้ม เป็นสีขั้นที่ 2', tier:1},
      {q:'สีน้ำเงินผสมกับสีเหลืองจะได้สีใด?', emoji:'🟢', choices:['สีเขียว','สีม่วง','สีส้ม','สีเทา'], correct:0, explain:'น้ำเงิน + เหลือง = เขียว', tier:1},
      {q:'กลุ่มสีวรรณะร้อนได้แก่สีใด?', emoji:'🔥', choices:['แดง ส้ม เหลือง','น้ำเงิน เขียว ม่วง','ดำ ขาว เทา','ฟ้า คราม น้ำเงิน'], correct:0, explain:'สีวรรณะร้อนให้ความรู้สึกอบอุ่นและตื่นตัว', tier:1},
      {q:'กลุ่มสีวรรณะเย็นได้แก่สีใด?', emoji:'❄️', choices:['น้ำเงิน เขียว ม่วง','แดง ส้ม เหลือง','แดง ชมพู ส้ม','เหลือง ทอง ส้ม'], correct:0, explain:'สีวรรณะเย็นให้ความรู้สึกสงบ เย็นสบาย', tier:1},
      {q:'ทัศนธาตุพื้นฐานในงานศิลปะได้แก่อะไรบ้าง?', emoji:'🖌️', choices:['จุด เส้น รูปร่าง สี และพื้นผิว','เสียง จังหวะ ทำนอง','ตัวเลข สมการ กราฟ','กลิ่น รส สัมผัส'], correct:0, explain:'ทัศนธาตุคือองค์ประกอบพื้นฐานที่ใช้สร้างงานทัศนศิลป์', tier:1},
      {q:'เส้นแนวนอนให้ความรู้สึกอย่างไร?', emoji:'➖', choices:['สงบ ราบเรียบ','ตื่นเต้น เคลื่อนไหวเร็ว','สับสน วุ่นวาย','น่ากลัว'], correct:0, explain:'เส้นแนวนอนชวนให้นึกถึงเส้นขอบฟ้าที่สงบนิ่ง', tier:1},
      {q:'เส้นแนวตั้งให้ความรู้สึกอย่างไร?', emoji:'📏', choices:['มั่นคง สง่างาม','อ่อนโยน นุ่มนวล','สับสน','เคลื่อนที่เร็ว'], correct:0, explain:'เส้นแนวตั้งให้ความรู้สึกแข็งแรงและสง่า เหมือนเสาหรือต้นไม้ใหญ่', tier:1},
      {q:'สีที่อยู่ตรงข้ามกับสีแดงในวงจรสีคือสีใด?', emoji:'🟩', choices:['สีเขียว','สีส้ม','สีเหลือง','สีน้ำเงิน'], correct:0, explain:'สีคู่ตรงข้ามของแดงคือเขียว เมื่ออยู่ด้วยกันจะตัดกันชัดเจน', tier:1},
      {q:'เส้นทแยงหรือเส้นเฉียงให้ความรู้สึกอย่างไร?', emoji:'📐', choices:['เคลื่อนไหว ไม่หยุดนิ่ง','สงบนิ่งที่สุด','หนักแน่นมั่นคง','เงียบเหงา'], correct:0, explain:'เส้นเฉียงทำให้ภาพดูมีการเคลื่อนไหวและพลัง', tier:2},
      {q:'การใส่แสงและเงาในภาพวาดช่วยให้ภาพเป็นอย่างไร?', emoji:'🌗', choices:['ดูมีมิติและสมจริงมากขึ้น','ดูแบนราบลง','เปลี่ยนเป็นภาพขาวดำ','เล็กลงกว่าเดิม'], correct:0, explain:'แสงเงาทำให้เห็นความตื้นลึกและปริมาตรของวัตถุ', tier:2},
      {q:'ภาพทิวทัศน์คือภาพประเภทใด?', emoji:'🏞️', choices:['ภาพธรรมชาติหรือสถานที่','ภาพใบหน้าคน','ภาพผลไม้บนโต๊ะ','ภาพลายเส้นเรขาคณิต'], correct:0, explain:'ภาพทิวทัศน์แสดงภูมิประเทศ เช่น ภูเขา ทะเล ท้องนา', tier:2},
      {q:'ภาพวาดใบหน้าหรือรูปคนเรียกว่าภาพประเภทใด?', emoji:'🖼️', choices:['ภาพคนเหมือน','ภาพหุ่นนิ่ง','ภาพทิวทัศน์','ภาพนามธรรม'], correct:0, explain:'ภาพคนเหมือน (portrait) เน้นถ่ายทอดลักษณะและอารมณ์ของบุคคล', tier:2},
      {q:'"จุดสนใจ" ของภาพควรมีลักษณะอย่างไร?', emoji:'🎯', choices:['ดึงดูดสายตาให้มองเห็นเป็นอันดับแรก','กลมกลืนจนมองไม่เห็น','อยู่มุมภาพเสมอ','ต้องมีขนาดเล็กที่สุด'], correct:0, explain:'จุดสนใจคือส่วนที่ศิลปินต้องการให้ผู้ชมมองเห็นก่อน', tier:2},
      {q:'งานปั้นดินเหนียวเป็นงานศิลปะประเภทใด?', emoji:'🏺', choices:['ประติมากรรม','จิตรกรรม','ภาพพิมพ์','สถาปัตยกรรม'], correct:0, explain:'งานที่มีสามมิติจับต้องได้รอบด้านจัดเป็นประติมากรรม', tier:2},
      {q:'สีขั้นที่ 2 เกิดขึ้นได้อย่างไร?', emoji:'🎨', choices:['ผสมแม่สี 2 สีเข้าด้วยกัน','ผสมสีดำกับสีขาว','ใช้แม่สีเพียงสีเดียว','ผสมแม่สีทั้ง 3 สี'], correct:0, explain:'ส้ม เขียว ม่วง เกิดจากการผสมแม่สีสองสีเข้าด้วยกัน', tier:2},
      {q:'ผ้าบาติกเป็นงานหัตถกรรมพื้นบ้านที่โดดเด่นของภาคใด?', emoji:'🧵', choices:['ภาคใต้','ภาคเหนือ','ภาคอีสาน','ภาคกลาง'], correct:0, explain:'ผ้าบาติกหรือผ้าปาเต๊ะเป็นงานผ้าเขียนเทียนที่เด่นในภาคใต้', tier:2},
      {q:'"ความสมดุล" ในงานศิลปะหมายถึงอะไร?', emoji:'⚖️', choices:['การจัดวางให้ภาพไม่หนักไปข้างใดข้างหนึ่ง','การใช้สีเพียงสีเดียว','การวาดให้เหมือนจริงทุกรายละเอียด','การใช้กระดาษขนาดใหญ่'], correct:0, explain:'ความสมดุลทำให้ภาพดูมั่นคงและสบายตา', tier:2},
      {q:'ถ้าต้องการให้ภาพให้ความรู้สึกอบอุ่น ควรเลือกใช้สีกลุ่มใด?', emoji:'🌇', choices:['สีวรรณะร้อน','สีวรรณะเย็น','สีเทาทั้งภาพ','สีดำล้วน'], correct:0, explain:'สีแดง ส้ม เหลือง ให้ความรู้สึกอบอุ่นเหมือนแสงแดดและไฟ', tier:3},
      {q:'ถ้าต้องการวาดให้วัตถุดูอยู่ไกล ควรทำอย่างไร?', emoji:'⛰️', choices:['วาดให้เล็กลงและใช้สีจางลง','วาดให้ใหญ่และสีเข้มขึ้น','วาดไว้ด้านล่างสุดของภาพ','วาดด้วยเส้นหนาที่สุด'], correct:0, explain:'วัตถุที่อยู่ไกลจะดูเล็กลงและสีจางลงตามหลักทัศนียภาพ', tier:3},
      {q:'เครื่องปั้นดินเผาด่านเกวียนเป็นภูมิปัญญาของจังหวัดใด?', emoji:'🏺', choices:['นครราชสีมา','เชียงใหม่','ภูเก็ต','ลพบุรี'], correct:0, explain:'ด่านเกวียนเป็นแหล่งเครื่องปั้นดินเผาชื่อดังของจังหวัดนครราชสีมา', tier:3},
      {q:'งานจิตรกรรมฝาผนังไทยมักพบได้ที่ใด?', emoji:'🛕', choices:['ภายในโบสถ์และวิหารของวัด','บนถนนในเมือง','ในห้องเรียนคณิตศาสตร์','บนเรือประมง'], correct:0, explain:'จิตรกรรมฝาผนังไทยเขียนเล่าเรื่องพุทธประวัติและวรรณคดีในโบสถ์วิหาร', tier:3},
      {q:'ถ้าผสมสีหลายๆ สีเข้าด้วยกันจนหมด จะได้ผลอย่างไร?', emoji:'⚫', choices:['ได้สีคล้ำหม่นออกไปทางเทาหรือน้ำตาลดำ','ได้สีขาวสว่าง','ได้สีแดงสด','ได้สีทอง'], correct:0, explain:'การผสมสีจำนวนมากทำให้สีหม่นลงและคล้ำขึ้นเรื่อยๆ', tier:3},
      {q:'ประโยชน์ของการวาดภาพระบายสีคือข้อใด?', emoji:'🖍️', choices:['ฝึกสมาธิ จินตนาการ และการสังเกต','ทำให้เรียนเก่งขึ้นทันที','ทำให้ร่างกายแข็งแรง','ทำให้ความจำดีขึ้นทันที'], correct:0, explain:'งานศิลปะช่วยพัฒนาสมาธิ ความคิดสร้างสรรค์ และทักษะการสังเกต', tier:3}
    ]
  },
  {
    id:'p5-nature1', name:'ธรรมชาติ ป.5 · ระบบนิเวศและการอนุรักษ์', emoji:'🌿', icon:'assets/icons/p5-nature1.svg', color:'#6FBF3B', light:'#E6F6D8', grade:'p5', poolPick:10, isNew:true,
    questions:[
      {q:'ทรัพยากรใดเป็นทรัพยากรที่ใช้แล้วหมดไป?', emoji:'⛽', choices:['น้ำมันปิโตรเลียม','ป่าไม้','แสงอาทิตย์','ลม'], correct:0, explain:'น้ำมันใช้เวลาสะสมหลายล้านปี ใช้แล้วหมดไปและสร้างทดแทนไม่ทัน', tier:1},
      {q:'ทรัพยากรใดสามารถเกิดทดแทนขึ้นใหม่ได้ถ้าดูแลดี?', emoji:'🌳', choices:['ป่าไม้','ถ่านหิน','ก๊าซธรรมชาติ','แร่ทองคำ'], correct:0, explain:'ป่าไม้ปลูกทดแทนได้ถ้ามีการจัดการอย่างเหมาะสม', tier:1},
      {q:'หลัก 3R ประกอบด้วยอะไรบ้าง?', emoji:'♻️', choices:['ลดการใช้ ใช้ซ้ำ และนำกลับมาใช้ใหม่','วิ่ง อ่าน เขียน','ปลูก ตัด เผา','ซื้อ ใช้ ทิ้ง'], correct:0, explain:'3R คือ Reduce (ลด) Reuse (ใช้ซ้ำ) และ Recycle (แปรรูปใช้ใหม่)', tier:1},
      {q:'ขยะประเภทใดควรทิ้งลงถังขยะสำหรับขยะย่อยสลายได้?', emoji:'🥬', choices:['เศษอาหารและเปลือกผลไม้','ขวดแก้ว','ถุงพลาสติก','กระป๋องอลูมิเนียม'], correct:0, explain:'เศษอาหารย่อยสลายได้ตามธรรมชาติและนำไปทำปุ๋ยหมักได้', tier:1},
      {q:'การกระทำใดช่วยลดภาวะโลกร้อนได้?', emoji:'🌱', choices:['ปลูกต้นไม้เพิ่มขึ้น','เผาขยะกลางแจ้ง','เปิดแอร์ทิ้งไว้ทั้งวัน','ใช้ถุงพลาสติกทุกครั้ง'], correct:0, explain:'ต้นไม้ดูดซับคาร์บอนไดออกไซด์ซึ่งเป็นแก๊สเรือนกระจกหลัก', tier:1},
      {q:'ข้อใดเป็นแหล่งพลังงานสะอาด?', emoji:'☀️', choices:['พลังงานแสงอาทิตย์','ถ่านหิน','น้ำมันดีเซล','ก๊าซจากการเผาขยะพลาสติก'], correct:0, explain:'พลังงานแสงอาทิตย์ใช้ได้ไม่หมดและไม่ปล่อยมลพิษขณะผลิตไฟฟ้า', tier:1},
      {q:'ป่าไม้มีประโยชน์อย่างไร?', emoji:'🌲', choices:['ให้ออกซิเจน ดูดซับน้ำ และเป็นที่อยู่ของสัตว์ป่า','ทำให้อากาศร้อนขึ้น','ทำให้ดินพังทลายเร็วขึ้น','ทำให้ฝนไม่ตกเลย'], correct:0, explain:'ป่าไม้ช่วยรักษาสมดุลของระบบนิเวศในหลายด้านพร้อมกัน', tier:1},
      {q:'มลพิษทางน้ำมักเกิดจากสาเหตุใด?', emoji:'🏭', choices:['การทิ้งขยะและปล่อยน้ำเสียลงแหล่งน้ำ','การปลูกต้นไม้ริมน้ำ','การอนุรักษ์ปลาในแม่น้ำ','การเก็บขยะออกจากคลอง'], correct:0, explain:'น้ำเสียจากบ้านเรือนและโรงงานที่ไม่บำบัดทำให้แหล่งน้ำเน่าเสีย', tier:1},
      {q:'PM2.5 คืออะไร?', emoji:'😷', choices:['ฝุ่นละอองขนาดเล็กมากที่เป็นอันตรายต่อปอด','ชื่อของแก๊สหุงต้ม','ชนิดของน้ำดื่ม','เครื่องวัดอุณหภูมิ'], correct:0, explain:'PM2.5 เล็กจนเข้าสู่ถุงลมปอดได้ จึงเป็นอันตรายต่อระบบหายใจ', tier:1},
      {q:'ระบบนิเวศประกอบด้วยอะไรบ้าง?', emoji:'🌏', choices:['สิ่งมีชีวิตและสิ่งไม่มีชีวิตที่สัมพันธ์กันในบริเวณหนึ่ง','สัตว์เพียงอย่างเดียว','พืชเพียงอย่างเดียว','หินและดินเท่านั้น'], correct:0, explain:'ระบบนิเวศคือความสัมพันธ์ของสิ่งมีชีวิตกับสิ่งแวดล้อมรอบตัว', tier:2},
      {q:'ถ้าป่าถูกทำลายไปมาก สัตว์ป่าจะเป็นอย่างไร?', emoji:'🦌', choices:['สูญเสียที่อยู่อาศัยและมีจำนวนลดลง','เพิ่มจำนวนขึ้นอย่างรวดเร็ว','ย้ายไปอยู่ในทะเลได้','ไม่ได้รับผลกระทบเลย'], correct:0, explain:'ป่าเป็นทั้งที่อยู่และแหล่งอาหาร เมื่อถูกทำลายสัตว์จึงอยู่ไม่ได้', tier:2},
      {q:'ปะการังฟอกขาวมีสาเหตุหลักจากอะไร?', emoji:'🪸', choices:['อุณหภูมิน้ำทะเลสูงขึ้น','น้ำทะเลเย็นลงมาก','มีปลามากเกินไป','คลื่นลมสงบเกินไป'], correct:0, explain:'น้ำทะเลอุ่นขึ้นทำให้สาหร่ายที่อยู่ร่วมกับปะการังหลุดออก ปะการังจึงขาวและตายได้', tier:2},
      {q:'การใช้ถุงผ้าแทนถุงพลาสติกช่วยเรื่องใด?', emoji:'👜', choices:['ลดปริมาณขยะพลาสติก','ทำให้ของราคาถูกลง','ทำให้อาหารอร่อยขึ้น','ทำให้เดินเร็วขึ้น'], correct:0, explain:'ถุงผ้าใช้ซ้ำได้หลายครั้ง จึงลดขยะพลาสติกที่ย่อยสลายยาก', tier:2},
      {q:'ขยะพลาสติกใช้เวลาย่อยสลายตามธรรมชาตินานเพียงใด?', emoji:'🥤', choices:['หลายร้อยปี','ประมาณ 1 สัปดาห์','ประมาณ 1 เดือน','ย่อยสลายทันที'], correct:0, explain:'พลาสติกย่อยสลายช้ามาก จึงสะสมในสิ่งแวดล้อมเป็นเวลานาน', tier:2},
      {q:'น้ำเสียจากบ้านเรือนควรจัดการอย่างไร?', emoji:'🚱', choices:['บำบัดให้สะอาดก่อนปล่อยลงแหล่งน้ำ','ปล่อยลงคลองทันที','เทลงดินข้างบ้าน','เก็บไว้ในถังจนล้น'], correct:0, explain:'การบำบัดก่อนปล่อยช่วยไม่ให้แหล่งน้ำสาธารณะเน่าเสีย', tier:2},
      {q:'ภาวะโลกร้อนเกิดจากแก๊สชนิดใดเป็นหลัก?', emoji:'🌡️', choices:['คาร์บอนไดออกไซด์','ออกซิเจน','ไนโตรเจนในอากาศ','ไอน้ำจากทะเลเท่านั้น'], correct:0, explain:'คาร์บอนไดออกไซด์จากการเผาเชื้อเพลิงเป็นแก๊สเรือนกระจกหลัก', tier:2},
      {q:'การอนุรักษ์ดินไม่ให้พังทลายทำได้อย่างไร?', emoji:'⛰️', choices:['ปลูกพืชคลุมดินและทำนาขั้นบันไดบนพื้นที่ลาดชัน','ไถดินทิ้งไว้โล่งๆ','ตัดต้นไม้บนภูเขาให้หมด','เผาหญ้าบนพื้นที่ลาด'], correct:0, explain:'รากพืชและขั้นบันไดช่วยชะลอน้ำและยึดหน้าดินไว้', tier:2},
      {q:'เหตุใดจึงควรคัดแยกขยะก่อนทิ้ง?', emoji:'🗑️', choices:['ทำให้นำไปรีไซเคิลได้ง่ายและลดปริมาณขยะที่ต้องกำจัด','ทำให้ถังขยะสวยขึ้น','ทำให้ขยะมีน้ำหนักน้อยลง','ทำให้ขยะหายไปเอง'], correct:0, explain:'ขยะที่แยกแล้วนำกลับไปใช้ใหม่ได้ ลดภาระการฝังกลบและเผา', tier:2},
      {q:'ถ้าทุกบ้านช่วยกันปิดไฟดวงที่ไม่ใช้ จะเกิดผลดีอย่างไร?', emoji:'💡', choices:['ลดการใช้พลังงานและลดการปล่อยแก๊สเรือนกระจก','ทำให้บ้านมืดจนอยู่ไม่ได้','ทำให้ค่าไฟแพงขึ้น','ทำให้หลอดไฟเสียเร็วขึ้น'], correct:0, explain:'ไฟฟ้าส่วนใหญ่ผลิตจากเชื้อเพลิง การประหยัดไฟจึงลดการปล่อยคาร์บอน', tier:3},
      {q:'เหตุใดการเผาป่าจึงเป็นปัญหาใหญ่?', emoji:'🔥', choices:['ทำลายที่อยู่ของสัตว์ เกิดฝุ่นควัน และเพิ่มภาวะโลกร้อน','ช่วยให้ดินอุดมสมบูรณ์ถาวร','ทำให้ฝนตกมากขึ้น','ทำให้อากาศสะอาดขึ้น'], correct:0, explain:'ไฟป่าปล่อยคาร์บอนและฝุ่น PM2.5 พร้อมทำลายระบบนิเวศทั้งผืน', tier:3},
      {q:'น้ำท่วมขังในเมืองมักมีสาเหตุจากอะไร?', emoji:'🌊', choices:['ขยะอุดตันท่อระบายน้ำและพื้นที่ซึมน้ำลดลง','มีต้นไม้ในเมืองมากเกินไป','ท่อระบายน้ำใหญ่เกินความจำเป็น','ฝนตกน้อยเกินไป'], correct:0, explain:'เมื่อพื้นที่ถูกปูด้วยคอนกรีตและท่ออุดตัน น้ำจึงระบายไม่ทัน', tier:3},
      {q:'การเลือกซื้อสินค้าที่มีบรรจุภัณฑ์น้อยช่วยเรื่องใด?', emoji:'📦', choices:['ลดขยะตั้งแต่ต้นทาง','ทำให้สินค้าราคาแพงขึ้น','ทำให้สินค้าเสียเร็วขึ้นเสมอ','ทำให้ขนส่งยากขึ้น'], correct:0, explain:'บรรจุภัณฑ์น้อยลง = ขยะที่ต้องกำจัดน้อยลงตามหลัก Reduce', tier:3},
      {q:'ถ้าสัตว์ผู้ล่าหายไปจากระบบนิเวศ จะเกิดอะไรขึ้น?', emoji:'🐍', choices:['สัตว์ที่เป็นเหยื่อเพิ่มจำนวนมากจนระบบนิเวศเสียสมดุล','ทุกอย่างยังคงเหมือนเดิม','พืชจะหายไปทันที','สัตว์เหยื่อจะลดจำนวนลง'], correct:0, explain:'ผู้ล่าช่วยควบคุมจำนวนเหยื่อ เมื่อหายไปเหยื่อจะเพิ่มจนกระทบพืชและอาหาร', tier:3},
      {q:'"การใช้ทรัพยากรอย่างยั่งยืน" หมายถึงอะไร?', emoji:'🌏', choices:['ใช้อย่างพอดีและรักษาไว้ให้คนรุ่นหลังได้ใช้ต่อ','ใช้ให้หมดเร็วที่สุด','เก็บไว้โดยไม่ใช้เลย','ใช้เฉพาะของนำเข้าจากต่างประเทศ'], correct:0, explain:'ความยั่งยืนคือใช้ประโยชน์วันนี้โดยไม่ทำลายโอกาสของคนรุ่นต่อไป', tier:3}
    ]
  },
  /* ---------- เกม AR ป.5 (ประโยคยาว 6-8 คำ / คิดเลขเร็วเศษส่วน-ร้อยละ) ---------- */
  {
    id:'p5-math-ar', name:'คิดเลขเร็ว ป.5', emoji:'🚀', icon:'assets/icons/p5-math-ar.svg', color:'#5E3FE0', light:'#E9E3FF',
    type:'ar', mode:'math', levels:10, mathTiers:[[3,12],[6,20],[8,25]], mathOps:['×','÷'], mathChoices:4, grade:'p5', isNew:true
  },
  {
    id:'p5-thai-sentence', name:'ภาษาไทย ป.5 · ต่อประโยคยาว', emoji:'🖇️', icon:'assets/icons/p5-thai-sentence.svg', color:'#D63D8C', light:'#FCE0EF',
    type:'ar', lang:'th', sentenceLens:[6,7,8], levels:10, grade:'p5', isNew:true
  },
  {
    id:'p5-eng-sentence', name:'English ป.5 · Long Sentences', emoji:'🗒️', icon:'assets/icons/p5-eng-sentence.svg', color:'#0A7A75', light:'#D5F5F2',
    type:'ar', lang:'en', sentenceLens:[6,7,8], levels:10, grade:'p5', isNew:true
  },
  {
    id:'p5-eng-match', name:'English ป.5 · โยงเส้นคำศัพท์', emoji:'📇', icon:'assets/icons/p5-eng-match.svg', color:'#0A8F89', light:'#D5F5F2',
    type:'ar', mode:'match', lang:'en', matchSet:'enAdv2', levels:10, grade:'p5', isNew:true
  },

  /* ---------- เกมฟัง ป.5 (คำยาว 6-8 ตัวอักษร / ประโยคเติมคำ 2-3 ช่อง) ---------- */
  {
    id:'p5-listen-en', name:'ฟังคำอังกฤษ ป.5', emoji:'🦻', icon:'assets/icons/p5-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', wordLens:[6,7,8], levels:10, grade:'p5', isNew:true
  },
  {
    id:'p5-listen-th', name:'ฟังสะกดคำไทย ป.5', emoji:'💭', icon:'assets/icons/p5-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[6,7,8], levels:10, grade:'p5', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.5 — ประโยคอังกฤษยาว 8-9 คำ มีคำเชื่อมและ tense หลากหลาย */
    id:'p5-cloze1', name:'ฟังประโยคเติมคำ ป.5 · 1', emoji:'📬', icon:'assets/icons/p5-cloze1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en6', clozeBlanks:[2,2,3], clozeDecoys:[4,5,5], levels:10, grade:'p5', isNew:true
  },
  {
    id:'p5-cloze2', name:'ฟังประโยคเติมคำ ป.5 · 2', emoji:'📤', icon:'assets/icons/p5-cloze2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en6', clozeBlanks:[3,3,3], clozeDecoys:[5,5,6], levels:10, grade:'p5', isNew:true
  },

  /* ---------- เกมฝึกทักษะ ป.5 (reuse engine เดิม + คลังข้อมูลใหม่ของ ป.5) ---------- */
  { id:'p5-fraction', name:'เศษส่วน-ทศนิยม ป.5', emoji:'🥮', icon:'assets/icons/p5-fraction.svg', color:'#E1503A', light:'#FBDBD4', type:'skill', mode:'fraction', hard:'p5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-money', name:'ธนาคารของหนู ป.5', emoji:'🏧', icon:'assets/icons/p5-money.svg', color:'#D98E2B', light:'#FBEBCB', type:'skill', mode:'money', hard:'p5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-balance', name:'ตาชั่งแรงและมวล ป.5', emoji:'⚓', icon:'assets/icons/p5-balance.svg', color:'#7C8CFF', light:'#E4E8FF', type:'skill', mode:'balance', hard:'p5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-memory', name:'จับคู่โดมิโน ป.5', emoji:'🎫', icon:'assets/icons/p5-memory.svg', color:'#E0764C', light:'#FBE3D4', type:'skill', mode:'memory', levels:3, memoryPairs:[12,14,16], handPlay:true, grade:'p5', isNew:true },
  { id:'p5-timeline', name:'เส้นเวลาอยุธยา-ธนบุรี', emoji:'🏰', icon:'assets/icons/p5-timeline.svg', color:'#B07A2E', light:'#F5E7CE', type:'skill', mode:'timeline', timelineTag:'p5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-coord', name:'พิกัดภูมิศาสตร์ ป.5', emoji:'🗾', icon:'assets/icons/p5-coord.svg', color:'#C77D2E', light:'#F6E7CF', type:'skill', mode:'coord', hard:'p5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-world', name:'โลกและวัฏจักรน้ำ ป.5', emoji:'🌍', icon:'assets/icons/p5-world.svg', color:'#2E86C1', light:'#D6EAF8', type:'skill', mode:'world', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-ef', name:'เชาวน์ ป.5 · นกฮูกสั่ง', emoji:'🦩', icon:'assets/icons/p5-ef.svg', color:'#17A65B', light:'#D6F3E4', type:'skill', mode:'ef', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-sci', name:'สารนี้ละลายน้ำไหม?', emoji:'🫙', icon:'assets/icons/p5-sci.svg', color:'#3FA9C9', light:'#D9F0F8', type:'skill', mode:'science', sciSet:'p5soluble', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-code', name:'เขียนโปรแกรมพาหุ่นยนต์ ป.5', emoji:'💻', icon:'assets/icons/p5-code.svg', color:'#1B6E77', light:'#D3EBEE', type:'skill', mode:'code', codeSet:'p5a', codeLoop:true, codeCond:true, levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-revsort', name:'แยกการเปลี่ยนแปลงผันกลับได้', emoji:'♻️', icon:'assets/icons/p5-revsort.svg', color:'#3FA9C9', light:'#D9F0F8', type:'skill', mode:'sort', sortSet:'reversible', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-quadsort', name:'จำแนกรูปสี่เหลี่ยม', emoji:'🔲', icon:'assets/icons/p5-quadsort.svg', color:'#6A4FE0', light:'#E7E2FC', type:'skill', mode:'sort', sortSet:'quadrilateral', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-wordsort', name:'แยกบุพบท สันธาน อุทาน', emoji:'📋', icon:'assets/icons/p5-wordsort.svg', color:'#E14E9A', light:'#FCE0EF', type:'skill', mode:'sort', sortSet:'wordtype5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-chart', name:'อ่านแผนภูมิและกราฟ ป.5', emoji:'📈', icon:'assets/icons/p5-chart.svg', color:'#2F8FD6', light:'#D7ECFA', type:'skill', mode:'chart', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-area', name:'พื้นที่และปริมาตร ป.5', emoji:'🟧', icon:'assets/icons/p5-area.svg', color:'#E0904C', light:'#FBE7D4', type:'skill', mode:'area', hard:'p5', levels:10, handPlay:true, grade:'p5', isNew:true },
  { id:'p5-angle', name:'มุมและเส้นขนาน ป.5', emoji:'🔺', icon:'assets/icons/p5-angle.svg', color:'#8E5CD6', light:'#EBE1FA', type:'skill', mode:'angle', hard:'p5', levels:10, grade:'p5', isNew:true },


  /* ===================== ระดับชั้น ป.6 (grade:'p6') ===================== */
  /* อิงตัวชี้วัดแกนกลาง ป.6 จาก research/curriculum/ป6/ — ชั้นสูงสุดของประถม เนื้อหารวบยอด + แนวคิดใหม่
     คณิต = อัตราส่วน, ห.ร.ม./ค.ร.น., ปริมาตรทรงประกอบ, พื้นที่วงกลม, มุมภายในรูปหลายเหลี่ยม, แผนภูมิวงกลม
     ไทย = ชนิดประโยค (สามัญ/รวม/ซ้อน), กลอนสุภาพ, ระดับภาษา, คำหลายความหมาย, กลวิธีโน้มน้าวใจ
     English = reading เต็มเรื่อง + Why/How, directions, จำนวนถึง 1,000, adjectives
     สังคม = รัตนโกสินทร์, ประเทศเพื่อนบ้าน, ผู้ผลิต-ผู้บริโภค-ธนาคาร-รัฐบาล, กฎหมาย-ประชาธิปไตย
     วิทย์ = สารอาหาร-ระบบย่อยอาหาร, การแยกสาร-แรงไฟฟ้า, วงจรไฟฟ้า-เงามืดเงามัว, อุปราคา-อวกาศ, หิน-มรสุม-ภัยธรรมชาติ
     ทุกหมวด quiz คลัง 24 ข้อ (tier 9/9/6) poolPick:10 — tier 3 = เนื้อหาเชื่อมต่อ ม.1 เท่านั้น */

  /* ---------- คณิต ป.6 : 5 หมวด ---------- */
  {
    id:'p6-math1', name:'คณิต ป.6 · เศษส่วน ทศนิยม และการเรียงลำดับ', emoji:'📌', icon:'assets/icons/p6-math1.svg', color:'#7C5CFC', light:'#E9E3FF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'1/2 กับ 1/3 จำนวนใดมากกว่ากัน?', emoji:'⚖️', choices:['1/2','1/3','เท่ากัน','เปรียบเทียบไม่ได้'], correct:0, explain:'ทำส่วนให้เท่ากันเป็น 6 ได้ 3/6 กับ 2/6 ดังนั้น 1/2 มากกว่า', tier:1},
      {q:'เรียง 1/2, 1/4, 3/4 จากน้อยไปมากได้อย่างไร?', emoji:'📈', choices:['1/4, 1/2, 3/4','1/2, 1/4, 3/4','3/4, 1/2, 1/4','1/4, 3/4, 1/2'], correct:0, explain:'ตัวส่วน 4 เท่ากันหมดได้ 1/4, 2/4, 3/4 จึงเรียงได้ 1/4 → 1/2 → 3/4', tier:1},
      {q:'0.5 กับ 0.45 จำนวนใดมากกว่า?', emoji:'🔢', choices:['0.5','0.45','เท่ากัน','บอกไม่ได้'], correct:0, explain:'เทียบทศนิยมตำแหน่งเดียวกัน 0.50 มากกว่า 0.45', tier:1},
      {q:'2/3 เท่ากับเศษส่วนใดที่มีตัวส่วนเป็น 9?', emoji:'🔁', choices:['6/9','3/9','4/9','2/9'], correct:0, explain:'คูณทั้งเศษและส่วนด้วย 3 ได้ 6/9', tier:1},
      {q:'ค.ร.น. ของ 3 กับ 4 คือเท่าไร?', emoji:'🧮', choices:['12','7','6','24'], correct:0, explain:'พหุคูณร่วมที่น้อยที่สุดของ 3 และ 4 คือ 12', tier:1},
      {q:'1/2 + 1/4 เท่ากับเท่าไร?', emoji:'➕', choices:['3/4','2/6','1/6','2/4'], correct:0, explain:'ทำส่วนเป็น 4 ได้ 2/4 + 1/4 = 3/4', tier:1},
      {q:'0.25 เท่ากับเศษส่วนใด?', emoji:'🍕', choices:['1/4','1/2','2/5','1/25'], correct:0, explain:'0.25 = 25/100 ตัดทอนได้ 1/4', tier:1},
      {q:'จำนวนคละ 1 3/4 เขียนเป็นเศษเกินได้เป็นข้อใด?', emoji:'🔢', choices:['7/4','4/7','5/4','3/4'], correct:0, explain:'1 × 4 = 4 บวกเศษ 3 ได้ 7 ส่วน 4', tier:1},
      {q:'3/5 เขียนเป็นทศนิยมได้เท่าไร?', emoji:'💠', choices:['0.6','0.35','0.53','1.6'], correct:0, explain:'3 ÷ 5 = 0.6', tier:1},
      {q:'เรียง 2/3, 3/4, 5/6 จากน้อยไปมากได้อย่างไร?', emoji:'📊', choices:['2/3, 3/4, 5/6','5/6, 3/4, 2/3','3/4, 2/3, 5/6','2/3, 5/6, 3/4'], correct:0, explain:'ใช้ ค.ร.น. 12 ได้ 8/12, 9/12, 10/12 จึงเรียงตามนี้', tier:2},
      {q:'7.2 ÷ 0.8 เท่ากับเท่าไร?', emoji:'➗', choices:['9','8','0.9','7.2'], correct:0, explain:'คูณทั้งสองจำนวนด้วย 10 ได้ 72 ÷ 8 = 9', tier:2},
      {q:'3/4 ÷ 2/5 เท่ากับเท่าไร?', emoji:'➗', choices:['1 7/8','6/20','8/15','3/10'], correct:0, explain:'กลับตัวหารแล้วคูณ 3/4 × 5/2 = 15/8 = 1 7/8', tier:2},
      {q:'0.125 × 8 เท่ากับเท่าไร?', emoji:'✖️', choices:['1','0.8','8.125','1.25'], correct:0, explain:'0.125 คือ 1/8 เมื่อคูณ 8 จึงได้ 1 พอดี', tier:2},
      {q:'เรียง 0.7, 0.07, 0.77 จากมากไปน้อยได้อย่างไร?', emoji:'📉', choices:['0.77, 0.7, 0.07','0.7, 0.77, 0.07','0.07, 0.7, 0.77','0.77, 0.07, 0.7'], correct:0, explain:'เทียบเป็น 0.77, 0.70, 0.07 จึงเรียงจากมากไปน้อยได้ตามนี้', tier:2},
      {q:'2 1/2 × 1 1/5 เท่ากับเท่าไร?', emoji:'✖️', choices:['3','2 1/10','3 1/2','2 3/5'], correct:0, explain:'แปลงเป็นเศษเกิน 5/2 × 6/5 = 30/10 = 3', tier:2},
      {q:'1/2 + 1/3 − 1/6 เท่ากับเท่าไร?', emoji:'🧮', choices:['2/3','1/6','5/6','1/2'], correct:0, explain:'ทำส่วนเป็น 6 ได้ 3/6 + 2/6 − 1/6 = 4/6 = 2/3', tier:2},
      {q:'4.5 ÷ 1.5 เท่ากับเท่าไร?', emoji:'➗', choices:['3','2.5','0.3','30'], correct:0, explain:'45 ÷ 15 = 3', tier:2},
      {q:'เศษส่วนใดมีค่าอยู่ระหว่าง 1/2 กับ 3/4?', emoji:'🔍', choices:['5/8','1/4','7/8','1/3'], correct:0, explain:'เทียบเป็น 4/8, 5/8, 6/8 จะเห็นว่า 5/8 อยู่ตรงกลางพอดี', tier:2},
      {q:'อัตราแลกเปลี่ยน 1 ดอลลาร์ = 35 บาท ถ้ามี 20 ดอลลาร์ แลกได้กี่บาท?', emoji:'💵', choices:['700 บาท','550 บาท','350 บาท','1,750 บาท'], correct:0, explain:'35 × 20 = 700 บาท', tier:3},
      {q:'เชือกยาว 3/4 เมตร ตัดเป็นท่อนละ 1/8 เมตร ได้กี่ท่อน?', emoji:'✂️', choices:['6 ท่อน','4 ท่อน','8 ท่อน','3 ท่อน'], correct:0, explain:'3/4 ÷ 1/8 = 3/4 × 8/1 = 6 ท่อน', tier:3},
      {q:'(1/2 + 1/3) × 6 เท่ากับเท่าไร?', emoji:'🧮', choices:['5','6','3','4'], correct:0, explain:'ในวงเล็บได้ 5/6 แล้วคูณ 6 ได้ 5', tier:3},
      {q:'น้ำ 2.5 ลิตร แบ่งใส่แก้วละ 0.25 ลิตร ได้กี่แก้ว?', emoji:'🥤', choices:['10 แก้ว','5 แก้ว','25 แก้ว','8 แก้ว'], correct:0, explain:'2.5 ÷ 0.25 = 250 ÷ 25 = 10 แก้ว', tier:3},
      {q:'เรียง 3/8, 0.4, 1/3 จากน้อยไปมากได้อย่างไร?', emoji:'📈', choices:['1/3, 3/8, 0.4','3/8, 1/3, 0.4','0.4, 3/8, 1/3','1/3, 0.4, 3/8'], correct:0, explain:'แปลงเป็นทศนิยม 0.333, 0.375, 0.4 จึงเรียงได้ 1/3 → 3/8 → 0.4', tier:3},
      {q:'อัตราแลกเปลี่ยน 1 ดอลลาร์ = 35 บาท ของราคา 1,750 บาท คิดเป็นกี่ดอลลาร์?', emoji:'🏦', choices:['50 ดอลลาร์','35 ดอลลาร์','70 ดอลลาร์','40 ดอลลาร์'], correct:0, explain:'1,750 ÷ 35 = 50 ดอลลาร์', tier:3}
    ]
  },
  {
    id:'p6-math2', name:'คณิต ป.6 · อัตราส่วน', emoji:'📎', icon:'assets/icons/p6-math2.svg', color:'#5E3FE0', light:'#E9E3FF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'มีแมว 3 ตัว สุนัข 2 ตัว อัตราส่วนของแมวต่อสุนัขเป็นเท่าไร?', emoji:'🐱', choices:['3 : 2','2 : 3','3 : 5','5 : 2'], correct:0, explain:'เขียนตามลำดับที่ถามคือ แมว 3 ต่อ สุนัข 2 จึงเป็น 3 : 2', tier:1},
      {q:'อัตราส่วนใดเท่ากับ 1 : 2?', emoji:'🔁', choices:['2 : 4','2 : 1','1 : 3','3 : 2'], correct:0, explain:'2 : 4 เมื่อหารทั้งสองข้างด้วย 2 จะได้ 1 : 2', tier:1},
      {q:'อัตราส่วน 2 : 4 เขียนอย่างต่ำได้เป็นเท่าไร?', emoji:'✂️', choices:['1 : 2','2 : 2','4 : 2','1 : 4'], correct:0, explain:'หารด้วย ห.ร.ม. คือ 2 ได้ 1 : 2', tier:1},
      {q:'อัตราส่วน 6 : 9 เขียนอย่างต่ำได้เป็นเท่าไร?', emoji:'🧮', choices:['2 : 3','3 : 2','6 : 3','1 : 3'], correct:0, explain:'หารทั้งสองข้างด้วย 3 ได้ 2 : 3', tier:1},
      {q:'อัตราส่วน 10 : 15 เขียนอย่างต่ำได้เป็นเท่าไร?', emoji:'🔢', choices:['2 : 3','5 : 3','10 : 5','1 : 5'], correct:0, explain:'หารทั้งสองข้างด้วย 5 ได้ 2 : 3', tier:1},
      {q:'มีผลไม้ 12 ผล เป็นแอปเปิ้ล 4 ผล ส้ม 8 ผล อัตราส่วนแอปเปิ้ลต่อส้มอย่างต่ำคือเท่าไร?', emoji:'🍎', choices:['1 : 2','4 : 8','2 : 1','1 : 3'], correct:0, explain:'4 : 8 หารด้วย 4 ได้ 1 : 2', tier:1},
      {q:'อัตราส่วน 3 : 4 เขียนเป็นเศษส่วนได้เป็นข้อใด?', emoji:'🍰', choices:['3/4','4/3','3/7','7/3'], correct:0, explain:'อัตราส่วน a : b เขียนเป็นเศษส่วนได้เป็น a/b', tier:1},
      {q:'อัตราส่วนใดไม่เท่ากับ 2 : 3?', emoji:'🚫', choices:['3 : 2','4 : 6','6 : 9','10 : 15'], correct:0, explain:'3 : 2 สลับลำดับ จึงมีค่าไม่เท่ากับ 2 : 3', tier:1},
      {q:'ดินสอ 4 แท่ง ปากกา 8 ด้าม อัตราส่วนดินสอต่อปากกาอย่างต่ำเป็นเท่าไร?', emoji:'✏️', choices:['1 : 2','2 : 1','4 : 8','1 : 4'], correct:0, explain:'4 : 8 หารด้วย 4 ได้ 1 : 2', tier:1},
      {q:'2 : 3 = 8 : ▢ จำนวนที่หายไปคือเท่าไร?', emoji:'❓', choices:['12','9','6','16'], correct:0, explain:'8 เป็น 4 เท่าของ 2 ดังนั้นอีกข้างต้องเป็น 3 × 4 = 12', tier:2},
      {q:'4 : 5 = ▢ : 20 จำนวนที่หายไปคือเท่าไร?', emoji:'❓', choices:['16','15','25','10'], correct:0, explain:'20 เป็น 4 เท่าของ 5 ดังนั้นอีกข้างคือ 4 × 4 = 16', tier:2},
      {q:'สูตรน้ำหวานใช้น้ำ 3 ส่วน ต่อน้ำเชื่อม 1 ส่วน ถ้าใช้น้ำ 9 แก้ว ต้องใช้น้ำเชื่อมกี่แก้ว?', emoji:'🥤', choices:['3 แก้ว','1 แก้ว','9 แก้ว','6 แก้ว'], correct:0, explain:'น้ำ 9 แก้วเป็น 3 เท่าของ 3 ส่วน น้ำเชื่อมจึงเป็น 1 × 3 = 3 แก้ว', tier:2},
      {q:'อัตราส่วน 15 : 25 เขียนอย่างต่ำได้เป็นเท่าไร?', emoji:'🧮', choices:['3 : 5','5 : 3','15 : 5','1 : 5'], correct:0, explain:'หารทั้งสองข้างด้วย 5 ได้ 3 : 5', tier:2},
      {q:'ห้องหนึ่งมีชาย 20 คน หญิง 30 คน อัตราส่วนชายต่อหญิงอย่างต่ำคือเท่าไร?', emoji:'👥', choices:['2 : 3','3 : 2','20 : 30','1 : 2'], correct:0, explain:'20 : 30 หารด้วย 10 ได้ 2 : 3', tier:2},
      {q:'1 : 4 = 5 : ▢ จำนวนที่หายไปคือเท่าไร?', emoji:'❓', choices:['20','9','16','25'], correct:0, explain:'5 เป็น 5 เท่าของ 1 ดังนั้นอีกข้างคือ 4 × 5 = 20', tier:2},
      {q:'แบ่งเงิน 100 บาท ตามอัตราส่วน 2 : 3 คนแรกได้กี่บาท?', emoji:'💰', choices:['40 บาท','60 บาท','50 บาท','20 บาท'], correct:0, explain:'รวม 5 ส่วน ส่วนละ 20 บาท คนแรกได้ 2 ส่วน = 40 บาท', tier:2},
      {q:'อัตราส่วน 7 : 21 เขียนอย่างต่ำได้เป็นเท่าไร?', emoji:'🔢', choices:['1 : 3','3 : 1','7 : 3','1 : 7'], correct:0, explain:'หารทั้งสองข้างด้วย 7 ได้ 1 : 3', tier:2},
      {q:'รูปสองรูปมีอัตราส่วนความยาวด้าน 1 : 3 ถ้ารูปเล็กด้านยาว 4 ซม. รูปใหญ่ด้านยาวเท่าไร?', emoji:'📐', choices:['12 ซม.','7 ซม.','4 ซม.','9 ซม.'], correct:0, explain:'รูปใหญ่เป็น 3 เท่า จึงยาว 4 × 3 = 12 เซนติเมตร', tier:2},
      {q:'แบ่งขนม 45 ชิ้นตามอัตราส่วน 4 : 5 คนที่ได้มากกว่าได้กี่ชิ้น?', emoji:'🍬', choices:['25 ชิ้น','20 ชิ้น','24 ชิ้น','30 ชิ้น'], correct:0, explain:'รวม 9 ส่วน ส่วนละ 5 ชิ้น คนที่ได้ 5 ส่วนจึงได้ 25 ชิ้น', tier:3},
      {q:'ผสมปูน 1 ส่วน ต่อทราย 3 ส่วน ถ้าใช้ทราย 12 ถัง ต้องใช้ปูนกี่ถัง?', emoji:'🏗️', choices:['4 ถัง','3 ถัง','12 ถัง','6 ถัง'], correct:0, explain:'ทราย 12 ถังเป็น 4 เท่าของ 3 ส่วน ปูนจึงเป็น 1 × 4 = 4 ถัง', tier:3},
      {q:'ที่ดินมีอัตราส่วนความยาวต่อความกว้าง 5 : 3 ถ้ากว้าง 9 เมตร จะยาวกี่เมตร?', emoji:'🏞️', choices:['15 เมตร','12 เมตร','18 เมตร','27 เมตร'], correct:0, explain:'9 เป็น 3 เท่าของ 3 ดังนั้นความยาว = 5 × 3 = 15 เมตร', tier:3},
      {q:'แผนที่มาตราส่วน 1 : 100,000 วัดระยะบนแผนที่ได้ 3 เซนติเมตร ระยะจริงกี่กิโลเมตร?', emoji:'🗺️', choices:['3 กิโลเมตร','30 กิโลเมตร','0.3 กิโลเมตร','300 กิโลเมตร'], correct:0, explain:'3 ซม. × 100,000 = 300,000 ซม. = 3,000 เมตร = 3 กิโลเมตร', tier:3},
      {q:'ผสมน้ำผลไม้ต่อน้ำเปล่า 2 : 5 ถ้าใช้น้ำผลไม้ 6 ลิตร จะได้เครื่องดื่มรวมกี่ลิตร?', emoji:'🧃', choices:['21 ลิตร','15 ลิตร','11 ลิตร','30 ลิตร'], correct:0, explain:'น้ำผลไม้ 6 ลิตรเป็น 3 เท่าของ 2 ส่วน น้ำเปล่าจึงเป็น 15 ลิตร รวม 21 ลิตร', tier:3},
      {q:'เลี้ยงไก่ต่อเป็ดในอัตราส่วน 3 : 2 มีสัตว์ทั้งหมด 45 ตัว มีไก่กี่ตัว?', emoji:'🐔', choices:['27 ตัว','18 ตัว','25 ตัว','30 ตัว'], correct:0, explain:'รวม 5 ส่วน ส่วนละ 9 ตัว ไก่ 3 ส่วนจึงเป็น 27 ตัว', tier:3}
    ]
  },
  {
    id:'p6-math3', name:'คณิต ป.6 · ห.ร.ม. และ ค.ร.น.', emoji:'🔱', icon:'assets/icons/p6-math3.svg', color:'#4A2FC0', light:'#E9E3FF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'ตัวประกอบทั้งหมดของ 12 มีกี่ตัว?', emoji:'🔢', choices:['6 ตัว','4 ตัว','12 ตัว','3 ตัว'], correct:0, explain:'ตัวประกอบของ 12 คือ 1, 2, 3, 4, 6, 12 รวม 6 ตัว', tier:1},
      {q:'ห.ร.ม. ของ 8 กับ 12 คือเท่าไร?', emoji:'🧮', choices:['4','2','8','24'], correct:0, explain:'ตัวหารร่วมของ 8 และ 12 คือ 1, 2, 4 ตัวที่มากที่สุดคือ 4', tier:1},
      {q:'ค.ร.น. ของ 4 กับ 6 คือเท่าไร?', emoji:'🔁', choices:['12','24','6','2'], correct:0, explain:'พหุคูณร่วมที่น้อยที่สุดของ 4 และ 6 คือ 12', tier:1},
      {q:'"จำนวนเฉพาะ" หมายถึงจำนวนแบบใด?', emoji:'⭐', choices:['จำนวนที่มีตัวประกอบเพียง 1 กับตัวมันเอง','จำนวนที่หารด้วย 2 ลงตัว','จำนวนที่มีตัวประกอบมากที่สุด','จำนวนที่เป็นเลขคี่ทุกจำนวน'], correct:0, explain:'จำนวนเฉพาะมีตัวประกอบแค่ 1 กับตัวมันเอง เช่น 2, 3, 5, 7', tier:1},
      {q:'ข้อใดเป็นจำนวนเฉพาะ?', emoji:'🔍', choices:['13','15','21','9'], correct:0, explain:'13 หารลงตัวเฉพาะ 1 กับ 13 ส่วนข้ออื่นมีตัวประกอบอื่นด้วย', tier:1},
      {q:'ห.ร.ม. ของ 6 กับ 9 คือเท่าไร?', emoji:'🧮', choices:['3','2','9','18'], correct:0, explain:'ตัวหารร่วมของ 6 และ 9 คือ 1, 3 ตัวมากที่สุดคือ 3', tier:1},
      {q:'ค.ร.น. ของ 3 กับ 5 คือเท่าไร?', emoji:'🔁', choices:['15','8','5','30'], correct:0, explain:'3 และ 5 ไม่มีตัวประกอบร่วม ค.ร.น. จึงเป็น 3 × 5 = 15', tier:1},
      {q:'แยกตัวประกอบเฉพาะของ 12 ได้เป็นข้อใด?', emoji:'✂️', choices:['2 × 2 × 3','2 × 6','3 × 4','2 × 3 × 3'], correct:0, explain:'12 = 2 × 6 = 2 × 2 × 3 ซึ่งทุกตัวเป็นจำนวนเฉพาะ', tier:1},
      {q:'ห.ร.ม. ของ 10 กับ 15 คือเท่าไร?', emoji:'🔢', choices:['5','10','3','30'], correct:0, explain:'ตัวหารร่วมของ 10 และ 15 คือ 1, 5 ตัวมากที่สุดคือ 5', tier:1},
      {q:'ห.ร.ม. ของ 12, 18 และ 24 คือเท่าไร?', emoji:'🧮', choices:['6','4','12','2'], correct:0, explain:'ตัวหารร่วมของทั้งสามจำนวนคือ 1, 2, 3, 6 ตัวมากที่สุดคือ 6', tier:2},
      {q:'ค.ร.น. ของ 4, 6 และ 8 คือเท่าไร?', emoji:'🔁', choices:['24','12','48','16'], correct:0, explain:'พหุคูณร่วมที่น้อยที่สุดที่ทั้ง 4, 6, 8 หารลงตัวคือ 24', tier:2},
      {q:'แยกตัวประกอบเฉพาะของ 36 ได้เป็นข้อใด?', emoji:'✂️', choices:['2 × 2 × 3 × 3','4 × 9','6 × 6','2 × 18'], correct:0, explain:'36 = 4 × 9 = (2 × 2) × (3 × 3) ซึ่งเป็นจำนวนเฉพาะทั้งหมด', tier:2},
      {q:'ห.ร.ม. ของ 16 กับ 24 คือเท่าไร?', emoji:'🔢', choices:['8','4','16','48'], correct:0, explain:'ตัวหารร่วมมากที่สุดของ 16 และ 24 คือ 8', tier:2},
      {q:'ค.ร.น. ของ 6 กับ 8 คือเท่าไร?', emoji:'🔁', choices:['24','48','14','12'], correct:0, explain:'พหุคูณของ 6 คือ 6, 12, 18, 24 และของ 8 คือ 8, 16, 24 ตรงกันครั้งแรกที่ 24', tier:2},
      {q:'ระฆังลูกแรกดังทุก 4 นาที ลูกที่สองดังทุก 6 นาที ถ้าดังพร้อมกันตอนนี้ จะดังพร้อมกันอีกครั้งในกี่นาที?', emoji:'🔔', choices:['12 นาที','10 นาที','24 นาที','6 นาที'], correct:0, explain:'ใช้ ค.ร.น. ของ 4 และ 6 คือ 12 นาที', tier:2},
      {q:'ห.ร.ม. ของ 20 กับ 30 คือเท่าไร?', emoji:'🧮', choices:['10','5','20','60'], correct:0, explain:'ตัวหารร่วมมากที่สุดของ 20 และ 30 คือ 10', tier:2},
      {q:'ค.ร.น. ของ 5, 10 และ 15 คือเท่าไร?', emoji:'🔁', choices:['30','60','15','45'], correct:0, explain:'30 หารด้วย 5, 10 และ 15 ลงตัวทั้งหมด และเป็นจำนวนน้อยที่สุดที่ทำได้', tier:2},
      {q:'ถ้า ห.ร.ม. ของสองจำนวนเท่ากับ 1 แสดงว่าอย่างไร?', emoji:'⭐', choices:['สองจำนวนนั้นไม่มีตัวประกอบร่วมอื่นนอกจาก 1','สองจำนวนนั้นเท่ากัน','สองจำนวนนั้นเป็นจำนวนคู่ทั้งคู่','หาค.ร.น. ไม่ได้'], correct:0, explain:'เช่น 8 กับ 9 มีตัวหารร่วมแค่ 1 เท่านั้น', tier:2},
      {q:'เชือกยาว 24 เมตร และ 36 เมตร ตัดเป็นท่อนยาวเท่ากันให้ยาวที่สุด จะได้ท่อนละกี่เมตร?', emoji:'✂️', choices:['12 เมตร','6 เมตร','24 เมตร','4 เมตร'], correct:0, explain:'ใช้ ห.ร.ม. ของ 24 และ 36 คือ 12 เมตร', tier:3},
      {q:'รถสองสายออกจากท่าทุก 15 นาที และทุก 20 นาที ถ้าออกพร้อมกันตอนนี้ จะออกพร้อมกันอีกครั้งในกี่นาที?', emoji:'🚌', choices:['60 นาที','35 นาที','30 นาที','300 นาที'], correct:0, explain:'ใช้ ค.ร.น. ของ 15 และ 20 คือ 60 นาที', tier:3},
      {q:'ริบบิ้นยาว 18 ซม. และ 30 ซม. ตัดเป็นชิ้นยาวเท่ากันให้ยาวที่สุด ได้ชิ้นละกี่เซนติเมตร?', emoji:'🎀', choices:['6 ซม.','3 ซม.','9 ซม.','12 ซม.'], correct:0, explain:'ห.ร.ม. ของ 18 และ 30 คือ 6 เซนติเมตร', tier:3},
      {q:'ค.ร.น. ของ 9, 12 และ 18 คือเท่าไร?', emoji:'🔁', choices:['36','72','54','108'], correct:0, explain:'36 หารด้วย 9, 12 และ 18 ลงตัวทั้งหมด และน้อยที่สุด', tier:3},
      {q:'ห.ร.ม. ของ 45 กับ 60 คือเท่าไร?', emoji:'🧮', choices:['15','5','9','30'], correct:0, explain:'45 = 3 × 3 × 5 และ 60 = 2 × 2 × 3 × 5 ตัวประกอบร่วมคือ 3 × 5 = 15', tier:3},
      {q:'ลูกอม 36 เม็ด และช็อกโกแลต 48 ชิ้น แบ่งใส่ถุงให้แต่ละถุงได้เท่ากันทั้งสองอย่าง จะแบ่งได้มากที่สุดกี่ถุง?', emoji:'🍫', choices:['12 ถุง','6 ถุง','9 ถุง','24 ถุง'], correct:0, explain:'ใช้ ห.ร.ม. ของ 36 และ 48 คือ 12 ถุง', tier:3}
    ]
  },
  {
    id:'p6-math4', name:'คณิต ป.6 · ร้อยละและโจทย์หลายขั้นตอน', emoji:'💼', icon:'assets/icons/p6-math4.svg', color:'#3A24A0', light:'#E9E3FF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'20% ของ 250 เท่ากับเท่าไร?', emoji:'💯', choices:['50','25','20','75'], correct:0, explain:'250 ÷ 100 × 20 = 50', tier:1},
      {q:'ของราคา 500 บาท ลด 10% เหลือกี่บาท?', emoji:'🏷️', choices:['450 บาท','490 บาท','400 บาท','550 บาท'], correct:0, explain:'ลด 50 บาท เหลือ 500 − 50 = 450 บาท', tier:1},
      {q:'30% เท่ากับเศษส่วนใด?', emoji:'🍕', choices:['3/10','1/3','3/100','30/10'], correct:0, explain:'30/100 ตัดทอนได้ 3/10', tier:1},
      {q:'ได้คะแนน 45 จากคะแนนเต็ม 50 คิดเป็นร้อยละเท่าไร?', emoji:'📝', choices:['90','45','85','95'], correct:0, explain:'45 ÷ 50 × 100 = ร้อยละ 90', tier:1},
      {q:'5% ของ 400 เท่ากับเท่าไร?', emoji:'🔢', choices:['20','40','5','50'], correct:0, explain:'400 ÷ 100 × 5 = 20', tier:1},
      {q:'ของราคา 200 บาท ขึ้นราคา 10% เป็นกี่บาท?', emoji:'📈', choices:['220 บาท','210 บาท','180 บาท','300 บาท'], correct:0, explain:'เพิ่ม 20 บาท เป็น 200 + 20 = 220 บาท', tier:1},
      {q:'ครึ่งหนึ่งของทั้งหมดคิดเป็นร้อยละเท่าไร?', emoji:'⚖️', choices:['50','25','100','5'], correct:0, explain:'ครึ่งหนึ่ง = 1/2 = 50/100 = ร้อยละ 50', tier:1},
      {q:'25% ของ 80 เท่ากับเท่าไร?', emoji:'🧮', choices:['20','25','40','16'], correct:0, explain:'80 ÷ 4 = 20', tier:1},
      {q:'0.6 คิดเป็นร้อยละเท่าไร?', emoji:'💠', choices:['60','6','0.6','600'], correct:0, explain:'0.6 = 60/100 = ร้อยละ 60', tier:1},
      {q:'ของราคา 800 บาท ลด 25% เหลือกี่บาท?', emoji:'🏷️', choices:['600 บาท','775 บาท','640 บาท','700 บาท'], correct:0, explain:'ลด 200 บาท เหลือ 800 − 200 = 600 บาท', tier:2},
      {q:'ฝากเงิน 4,000 บาท ดอกเบี้ยร้อยละ 2 ต่อปี ครบ 1 ปีได้ดอกเบี้ยกี่บาท?', emoji:'🏦', choices:['80 บาท','40 บาท','200 บาท','800 บาท'], correct:0, explain:'4,000 ÷ 100 × 2 = 80 บาท', tier:2},
      {q:'ของราคา 1,000 บาท ลด 10% แล้วลดอีก 10% จากราคาที่ลดแล้ว เหลือกี่บาท?', emoji:'🛍️', choices:['810 บาท','800 บาท','900 บาท','780 บาท'], correct:0, explain:'ลดรอบแรกเหลือ 900 บาท ลดอีก 10% ของ 900 คือ 90 บาท จึงเหลือ 810 บาท', tier:2},
      {q:'นักเรียน 250 คน มาเรียน 96% คิดเป็นกี่คน?', emoji:'🧒', choices:['240 คน','246 คน','230 คน','225 คน'], correct:0, explain:'250 ÷ 100 × 96 = 240 คน', tier:2},
      {q:'ทุน 300 บาท ขายได้ 360 บาท ได้กำไรร้อยละเท่าไร?', emoji:'💰', choices:['20','60','30','16'], correct:0, explain:'กำไร 60 บาท คิดเป็น 60 ÷ 300 × 100 = ร้อยละ 20', tier:2},
      {q:'ของราคา 250 บาท บวกภาษี 7% ต้องจ่ายกี่บาท?', emoji:'🧾', choices:['267.50 บาท','257 บาท','275 บาท','262.50 บาท'], correct:0, explain:'ภาษี 250 ÷ 100 × 7 = 17.50 บาท รวมเป็น 267.50 บาท', tier:2},
      {q:'40% ของจำนวนหนึ่งเท่ากับ 60 จำนวนนั้นคือเท่าไร?', emoji:'❓', choices:['150','100','240','24'], correct:0, explain:'60 ÷ 40 × 100 = 150', tier:2},
      {q:'ของลดราคา 15% แล้วจ่ายจริง 425 บาท ราคาเดิมเท่าไร?', emoji:'🏷️', choices:['500 บาท','440 บาท','475 บาท','510 บาท'], correct:0, explain:'จ่าย 85% ของราคาเดิม ดังนั้น 425 ÷ 85 × 100 = 500 บาท', tier:2},
      {q:'ประชากร 2,000 คน เพิ่มขึ้น 5% เป็นกี่คน?', emoji:'👥', choices:['2,100 คน','2,050 คน','2,500 คน','2,005 คน'], correct:0, explain:'เพิ่ม 100 คน รวมเป็น 2,100 คน', tier:2},
      {q:'ซื้อของราคา 1,200 บาท ลด 20% แล้วบวกภาษี 7% ต้องจ่ายจริงกี่บาท?', emoji:'🧾', choices:['1,027.20 บาท','960 บาท','1,104 บาท','1,140 บาท'], correct:0, explain:'ลดเหลือ 960 บาท บวกภาษี 67.20 บาท รวม 1,027.20 บาท', tier:3},
      {q:'ทุน 500 บาท ขายขาดทุน 10% ขายได้กี่บาท?', emoji:'📉', choices:['450 บาท','490 บาท','550 บาท','400 บาท'], correct:0, explain:'ขาดทุน 50 บาท จึงขายได้ 500 − 50 = 450 บาท', tier:3},
      {q:'ฝาก 10,000 บาท ดอกเบี้ยร้อยละ 3 ต่อปี ฝาก 2 ปี ได้ดอกเบี้ยรวมกี่บาท (ดอกเบี้ยคิดจากเงินต้น)?', emoji:'🏦', choices:['600 บาท','300 บาท','900 บาท','1,200 บาท'], correct:0, explain:'ปีละ 300 บาท สองปีจึงได้ 600 บาท', tier:3},
      {q:'ของราคา 900 บาท ถ้าลด 10% สองรอบ จะต่างจากลดครั้งเดียว 20% อยู่กี่บาท?', emoji:'🤔', choices:['9 บาท','0 บาท','18 บาท','90 บาท'], correct:0, explain:'ลดสองรอบเหลือ 729 บาท ลดครั้งเดียวเหลือ 720 บาท ต่างกัน 9 บาท', tier:3},
      {q:'นักเรียน 400 คน เป็นชาย 60% มีนักเรียนหญิงกี่คน?', emoji:'👧', choices:['160 คน','240 คน','200 คน','140 คน'], correct:0, explain:'ชาย 240 คน หญิงจึงเป็น 400 − 240 = 160 คน', tier:3},
      {q:'ร้านขึ้นราคา 20% แล้วลดราคา 20% จากราคาใหม่ ราคาสุดท้ายเป็นอย่างไรเมื่อเทียบกับราคาเดิม?', emoji:'🔄', choices:['ต่ำกว่าราคาเดิมเล็กน้อย','เท่ากับราคาเดิมพอดี','สูงกว่าราคาเดิม','ต่ำกว่าราคาเดิมครึ่งหนึ่ง'], correct:0, explain:'เช่นราคา 100 → ขึ้นเป็น 120 → ลด 20% เหลือ 96 บาท จึงต่ำกว่าเดิม', tier:3}
    ]
  },
  {
    id:'p6-math5', name:'คณิต ป.6 · ปริมาตร พื้นที่ และวงกลม', emoji:'🪟', icon:'assets/icons/p6-math5.svg', color:'#2C1A80', light:'#E9E3FF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'พื้นที่ของวงกลมหาได้จากสูตรใด?', emoji:'⭕', choices:['π × รัศมี × รัศมี','2 × π × รัศมี','π × เส้นผ่านศูนย์กลาง','รัศมี × 4'], correct:0, explain:'พื้นที่วงกลม = πr² คือ π คูณรัศมียกกำลังสอง', tier:1},
      {q:'ความยาวรอบวงกลมหาได้จากสูตรใด?', emoji:'🔄', choices:['2 × π × รัศมี','π × รัศมี × รัศมี','รัศมี × รัศมี','π ÷ รัศมี'], correct:0, explain:'ความยาวรอบวงกลม = 2πr หรือ π × เส้นผ่านศูนย์กลาง', tier:1},
      {q:'วงกลมรัศมี 7 ซม. มีพื้นที่เท่าไร (ใช้ π = 22/7)?', emoji:'⭕', choices:['154 ตร.ซม.','44 ตร.ซม.','49 ตร.ซม.','22 ตร.ซม.'], correct:0, explain:'22/7 × 7 × 7 = 154 ตารางเซนติเมตร', tier:1},
      {q:'วงกลมเส้นผ่านศูนย์กลาง 14 ซม. มีรัศมีเท่าไร?', emoji:'📏', choices:['7 ซม.','14 ซม.','28 ซม.','3.5 ซม.'], correct:0, explain:'รัศมีเป็นครึ่งหนึ่งของเส้นผ่านศูนย์กลาง คือ 7 เซนติเมตร', tier:1},
      {q:'ผลรวมของมุมภายในรูปสามเหลี่ยมเท่ากับกี่องศา?', emoji:'🔺', choices:['180 องศา','360 องศา','90 องศา','270 องศา'], correct:0, explain:'มุมภายในสามเหลี่ยมรวมกันได้ 180 องศาเสมอ', tier:1},
      {q:'ผลรวมของมุมภายในรูปสี่เหลี่ยมเท่ากับกี่องศา?', emoji:'🔲', choices:['360 องศา','180 องศา','540 องศา','90 องศา'], correct:0, explain:'สี่เหลี่ยมแบ่งเป็นสามเหลี่ยม 2 รูป จึงได้ 180 × 2 = 360 องศา', tier:1},
      {q:'กล่องกว้าง 2 ซม. ยาว 3 ซม. สูง 5 ซม. มีปริมาตรเท่าไร?', emoji:'📦', choices:['30 ลบ.ซม.','10 ลบ.ซม.','25 ลบ.ซม.','15 ลบ.ซม.'], correct:0, explain:'2 × 3 × 5 = 30 ลูกบาศก์เซนติเมตร', tier:1},
      {q:'รูปคลี่ของลูกบาศก์ประกอบด้วยสี่เหลี่ยมจัตุรัสกี่รูป?', emoji:'🧩', choices:['6 รูป','4 รูป','8 รูป','5 รูป'], correct:0, explain:'ลูกบาศก์มี 6 หน้า รูปคลี่จึงมีสี่เหลี่ยมจัตุรัส 6 รูป', tier:1},
      {q:'ทรงกระบอกมีหน้าตัดเป็นรูปวงกลมกี่หน้า?', emoji:'🥫', choices:['2 หน้า','1 หน้า','3 หน้า','ไม่มีเลย'], correct:0, explain:'ทรงกระบอกมีฐานวงกลมทั้งด้านบนและด้านล่าง รวม 2 หน้า', tier:1},
      {q:'วงกลมรัศมี 10 ซม. มีความยาวรอบรูปเท่าไร (ใช้ π = 3.14)?', emoji:'🔄', choices:['62.8 ซม.','31.4 ซม.','314 ซม.','100 ซม.'], correct:0, explain:'2 × 3.14 × 10 = 62.8 เซนติเมตร', tier:2},
      {q:'ผลรวมของมุมภายในรูปห้าเหลี่ยมเท่ากับกี่องศา?', emoji:'⬠', choices:['540 องศา','360 องศา','720 องศา','450 องศา'], correct:0, explain:'แบ่งเป็นสามเหลี่ยม 3 รูป จึงได้ 180 × 3 = 540 องศา', tier:2},
      {q:'รูปทรงตัว L ประกอบจากกล่อง 2 ก้อน ก้อนแรก 2×2×3 ก้อนที่สอง 2×2×2 มีปริมาตรรวมเท่าไร?', emoji:'📦', choices:['20 ลบ.ซม.','12 ลบ.ซม.','24 ลบ.ซม.','8 ลบ.ซม.'], correct:0, explain:'12 + 8 = 20 ลูกบาศก์เซนติเมตร', tier:2},
      {q:'วงกลมเส้นผ่านศูนย์กลาง 20 ซม. มีพื้นที่เท่าไร (ใช้ π = 3.14)?', emoji:'⭕', choices:['314 ตร.ซม.','628 ตร.ซม.','1,256 ตร.ซม.','62.8 ตร.ซม.'], correct:0, explain:'รัศมี 10 ซม. พื้นที่ = 3.14 × 10 × 10 = 314 ตารางเซนติเมตร', tier:2},
      {q:'กรวยมีหน้าตัดที่เป็นรูปวงกลมกี่หน้า?', emoji:'🍦', choices:['1 หน้า','2 หน้า','3 หน้า','ไม่มีเลย'], correct:0, explain:'กรวยมีฐานวงกลมเพียงหน้าเดียว ส่วนด้านข้างเป็นผิวโค้ง', tier:2},
      {q:'ผลรวมของมุมภายในรูปหกเหลี่ยมเท่ากับกี่องศา?', emoji:'🔷', choices:['720 องศา','540 องศา','900 องศา','600 องศา'], correct:0, explain:'แบ่งเป็นสามเหลี่ยม 4 รูป จึงได้ 180 × 4 = 720 องศา', tier:2},
      {q:'พีระมิดฐานสี่เหลี่ยมมีหน้าที่เป็นรูปสามเหลี่ยมกี่หน้า?', emoji:'🔺', choices:['4 หน้า','3 หน้า','5 หน้า','2 หน้า'], correct:0, explain:'มีฐานสี่เหลี่ยม 1 หน้า และหน้าสามเหลี่ยมข้าง 4 หน้า', tier:2},
      {q:'สามเหลี่ยมรูปหนึ่งมีมุม 90 องศา และ 40 องศา มุมที่สามกี่องศา?', emoji:'📐', choices:['50 องศา','60 องศา','40 องศา','130 องศา'], correct:0, explain:'180 − 90 − 40 = 50 องศา', tier:2},
      {q:'รูปคลี่ที่มีวงกลม 2 วง กับสี่เหลี่ยมผืนผ้า 1 รูป พับได้เป็นรูปทรงใด?', emoji:'🥫', choices:['ทรงกระบอก','กรวย','ลูกบาศก์','พีระมิด'], correct:0, explain:'วงกลมสองวงเป็นฐานบน-ล่าง ส่วนสี่เหลี่ยมม้วนเป็นผิวข้างของทรงกระบอก', tier:2},
      {q:'รูปสี่เหลี่ยมมีมุม 100, 80 และ 90 องศา มุมที่สี่กี่องศา?', emoji:'📐', choices:['90 องศา','80 องศา','100 องศา','120 องศา'], correct:0, explain:'360 − (100 + 80 + 90) = 90 องศา', tier:3},
      {q:'วงกลมรัศมี 7 ซม. มีพื้นที่ 154 ตร.ซม. ถ้าเพิ่มรัศมีเป็น 14 ซม. พื้นที่จะเป็นกี่เท่าของเดิม?', emoji:'⭕', choices:['4 เท่า','2 เท่า','3 เท่า','8 เท่า'], correct:0, explain:'พื้นที่แปรตามรัศมียกกำลังสอง รัศมี 2 เท่าจึงได้พื้นที่ 4 เท่า', tier:3},
      {q:'รูปทรงประกอบจากลูกบาศก์ 3 ก้อน ก้อนละ 2×2×2 ซม. มีปริมาตรรวมเท่าไร?', emoji:'🧊', choices:['24 ลบ.ซม.','8 ลบ.ซม.','12 ลบ.ซม.','48 ลบ.ซม.'], correct:0, explain:'ก้อนละ 8 ลบ.ซม. สามก้อนรวม 24 ลูกบาศก์เซนติเมตร', tier:3},
      {q:'สระน้ำกว้าง 5 ม. ยาว 4 ม. ลึก 2 ม. จุน้ำได้กี่ลิตร?', emoji:'🏊', choices:['40,000 ลิตร','40 ลิตร','4,000 ลิตร','400 ลิตร'], correct:0, explain:'ปริมาตร 40 ลบ.ม. และ 1 ลบ.ม. = 1,000 ลิตร จึงได้ 40,000 ลิตร', tier:3},
      {q:'ล้อรถรัศมี 35 ซม. หมุนครบ 1 รอบ จะเคลื่อนที่ไปได้กี่เซนติเมตร (ใช้ π = 22/7)?', emoji:'🛞', choices:['220 ซม.','110 ซม.','70 ซม.','385 ซม.'], correct:0, explain:'ระยะทางเท่ากับความยาวรอบวง = 2 × 22/7 × 35 = 220 เซนติเมตร', tier:3},
      {q:'ผลรวมของมุมภายในรูป n เหลี่ยม หาได้จากสูตรใด?', emoji:'🧮', choices:['(n − 2) × 180 องศา','n × 180 องศา','360 ÷ n องศา','n × 90 องศา'], correct:0, explain:'แบ่งรูป n เหลี่ยมได้เป็นสามเหลี่ยม (n − 2) รูป แต่ละรูป 180 องศา', tier:3}
    ]
  },
  /* ---------- ภาษาไทย ป.6 : 4 หมวด ---------- */
  {
    id:'p6-thai1', name:'ภาษาไทย ป.6 · ชนิดของคำและชนิดของประโยค', emoji:'📁', icon:'assets/icons/p6-thai1.svg', color:'#EF5DA8', light:'#FCE0EF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'"ประโยคสามัญ" มีลักษณะอย่างไร?', emoji:'📖', choices:['มีใจความเดียว มีประธานและกริยาชุดเดียว','มีสองใจความเชื่อมกัน','มีประโยคย่อยขยายอยู่ข้างใน','ไม่มีภาคแสดง'], correct:0, explain:'ประโยคสามัญคือประโยคความเดียว เช่น "นกบิน"', tier:1},
      {q:'"ฉันกินข้าวและน้องดูโทรทัศน์" เป็นประโยคชนิดใด?', emoji:'🔗', choices:['ประโยครวม','ประโยคสามัญ','ประโยคซ้อน','กลุ่มคำ'], correct:0, explain:'มีสองใจความที่เท่าเทียมกันเชื่อมด้วย "และ" จึงเป็นประโยครวม', tier:1},
      {q:'คำใดเป็นคำสรรพนาม?', emoji:'🧍', choices:['เขา','วิ่ง','สวย','โต๊ะ'], correct:0, explain:'คำสรรพนามใช้แทนคำนาม เช่น ฉัน เธอ เขา มัน', tier:1},
      {q:'คำใดเป็นคำวิเศษณ์?', emoji:'✨', choices:['สวย','นก','กิน','เขา'], correct:0, explain:'คำวิเศษณ์ใช้ขยายคำนามหรือคำกริยาให้ชัดขึ้น', tier:1},
      {q:'คำว่า "นก" เป็นคำชนิดใด?', emoji:'🐦', choices:['คำนาม','คำกริยา','คำวิเศษณ์','คำอุทาน'], correct:0, explain:'คำนามใช้เรียกชื่อคน สัตว์ สิ่งของ สถานที่', tier:1},
      {q:'คำว่า "วิ่ง" เป็นคำชนิดใด?', emoji:'🏃', choices:['คำกริยา','คำนาม','คำบุพบท','คำสรรพนาม'], correct:0, explain:'คำกริยาบอกอาการหรือการกระทำของประธาน', tier:1},
      {q:'คำเชื่อมที่ใช้ในประโยครวมได้แก่ข้อใด?', emoji:'🔗', choices:['และ แต่ หรือ','ใน บน ใต้','โอ๊ย อุ๊ย','ฉัน เธอ เขา'], correct:0, explain:'คำสันธานเหล่านี้ใช้เชื่อมประโยคที่มีใจความเท่าเทียมกัน', tier:1},
      {q:'"ประโยคซ้อน" มีลักษณะอย่างไร?', emoji:'📚', choices:['มีประโยคย่อยทำหน้าที่ขยายส่วนใดส่วนหนึ่งของประโยคหลัก','มีสองใจความเท่าเทียมกัน','มีแต่ภาคประธานไม่มีภาคแสดง','เป็นเพียงกลุ่มคำ'], correct:0, explain:'เช่น "คนที่ขยันย่อมสำเร็จ" มีประโยคย่อย "ที่ขยัน" ขยายคำว่า "คน"', tier:1},
      {q:'คำว่า "โอ๊ย" เป็นคำชนิดใด?', emoji:'❗', choices:['คำอุทาน','คำนาม','คำกริยา','คำบุพบท'], correct:0, explain:'คำอุทานใช้เปล่งแสดงอารมณ์ความรู้สึก', tier:1},
      {q:'"คนที่ขยันย่อมประสบความสำเร็จ" เป็นประโยคชนิดใด?', emoji:'🏆', choices:['ประโยคซ้อน','ประโยครวม','ประโยคสามัญ','กลุ่มคำ'], correct:0, explain:'"ที่ขยัน" เป็นประโยคย่อยที่ขยายคำว่า "คน" จึงเป็นประโยคซ้อน', tier:2},
      {q:'"แม่ทำกับข้าว" กับ "พ่ออ่านหนังสือ" เมื่อเชื่อมด้วยคำว่า "และ" จะกลายเป็นประโยคชนิดใด?', emoji:'🔗', choices:['ประโยครวม','ประโยคซ้อน','ประโยคสามัญ','คำอุทาน'], correct:0, explain:'สองใจความเท่าเทียมกันเชื่อมด้วยคำสันธาน จึงเป็นประโยครวม', tier:2},
      {q:'ในประโยค "เด็กชายเตะลูกบอล" คำนามคือคำใดบ้าง?', emoji:'⚽', choices:['เด็กชาย และ ลูกบอล','เตะ เท่านั้น','เด็กชาย เท่านั้น','ไม่มีคำนามเลย'], correct:0, explain:'ทั้งผู้กระทำและสิ่งที่ถูกกระทำเป็นคำนาม', tier:2},
      {q:'คำว่า "อย่างรวดเร็ว" ทำหน้าที่ขยายคำชนิดใด?', emoji:'💨', choices:['คำกริยา','คำนาม','คำอุทาน','คำบุพบท'], correct:0, explain:'เป็นคำวิเศษณ์ที่บอกลักษณะของการกระทำ เช่น "วิ่งอย่างรวดเร็ว"', tier:2},
      {q:'คำสรรพนามใช้แทนคำชนิดใด?', emoji:'🔄', choices:['คำนาม','คำกริยา','คำวิเศษณ์','คำอุทาน'], correct:0, explain:'ใช้แทนคำนามเพื่อไม่ต้องเอ่ยชื่อซ้ำ เช่น "สมชายมาแล้ว เขาเหนื่อยมาก"', tier:2},
      {q:'ข้อใดเป็นกลุ่มคำ (วลี) ไม่ใช่ประโยค?', emoji:'🔍', choices:['บ้านหลังใหญ่สีขาว','นกบินสูง','ฝนตกหนัก','แม่ทำอาหาร'], correct:0, explain:'กลุ่มคำไม่มีภาคแสดง จึงยังไม่เป็นประโยคที่สมบูรณ์', tier:2},
      {q:'"ครูสอนนักเรียนที่ตั้งใจเรียน" ประโยคย่อยคือส่วนใด?', emoji:'👩‍🏫', choices:['ที่ตั้งใจเรียน','ครูสอน','นักเรียน','ครูสอนนักเรียน'], correct:0, explain:'"ที่ตั้งใจเรียน" ทำหน้าที่ขยายคำว่า "นักเรียน"', tier:2},
      {q:'ประโยครวมต่างจากประโยคซ้อนอย่างไร?', emoji:'⚖️', choices:['ประโยครวมมีใจความเท่าเทียมกัน ส่วนประโยคซ้อนมีประโยคหลักกับประโยคย่อย','ประโยครวมสั้นกว่าเสมอ','ประโยคซ้อนไม่มีคำเชื่อม','ทั้งสองแบบเหมือนกันทุกประการ'], correct:0, explain:'ประโยครวม = ใจความคู่ขนาน, ประโยคซ้อน = มีประโยคย่อยไปขยายส่วนใดส่วนหนึ่ง', tier:2},
      {q:'"เพราะฝนตกหนัก ถนนจึงลื่น" เป็นประโยคชนิดใด?', emoji:'🌧️', choices:['ประโยครวมที่แสดงเหตุและผล','ประโยคสามัญ','กลุ่มคำ','คำอุทาน'], correct:0, explain:'สองใจความเชื่อมด้วยคำสันธานคู่ "เพราะ...จึง" จึงเป็นประโยครวม', tier:2},
      {q:'"หนังสือที่วางอยู่บนโต๊ะเป็นของฉัน" ประโยคหลักคือข้อใด?', emoji:'📕', choices:['หนังสือเป็นของฉัน','ที่วางอยู่บนโต๊ะ','วางอยู่บนโต๊ะ','บนโต๊ะ'], correct:0, explain:'ตัดประโยคย่อย "ที่วางอยู่บนโต๊ะ" ออก ยังเหลือใจความสมบูรณ์', tier:3},
      {q:'คำว่า "ที่" ในประโยคซ้อนทำหน้าที่อะไร?', emoji:'🔗', choices:['เชื่อมประโยคย่อยเข้ากับคำที่ถูกขยาย','บอกตำแหน่งของสิ่งของ','แสดงอารมณ์','บอกจำนวน'], correct:0, explain:'"ที่" นำหน้าประโยคย่อยที่ทำหน้าที่ขยายคำนามข้างหน้า', tier:3},
      {q:'ข้อใดเป็นประโยคซ้อน?', emoji:'🔎', choices:['ฉันเห็นนกที่บินอยู่บนฟ้า','ฉันกินข้าวและดื่มน้ำ','ฝนตกหนักมาก','แม่ไปตลาด'], correct:0, explain:'"ที่บินอยู่บนฟ้า" เป็นประโยคย่อยขยายคำว่า "นก"', tier:3},
      {q:'ประโยค "พ่อไปตลาดแต่แม่อยู่บ้าน" มีกี่ใจความ?', emoji:'🔢', choices:['2 ใจความ','1 ใจความ','3 ใจความ','ไม่มีใจความ'], correct:0, explain:'มีใจความว่าพ่อไปตลาด และแม่อยู่บ้าน เชื่อมด้วย "แต่"', tier:3},
      {q:'ในประโยค "เขาวิ่งเร็วมาก" คำวิเศษณ์คือส่วนใด?', emoji:'🏃', choices:['เร็วมาก','เขา','วิ่ง','เขาวิ่ง'], correct:0, explain:'"เร็วมาก" ขยายกริยา "วิ่ง" ให้เห็นลักษณะชัดขึ้น', tier:3},
      {q:'เหตุใดจึงควรรู้จักชนิดของประโยค?', emoji:'✍️', choices:['ช่วยให้เขียนสื่อสารได้ชัดเจนและอ่านจับใจความได้ถูกต้อง','ช่วยให้เขียนได้ยาวขึ้น','ช่วยให้พูดเร็วขึ้น','ช่วยให้จำคำศัพท์ได้มากขึ้น'], correct:0, explain:'เข้าใจโครงสร้างประโยคทำให้สื่อสารตรงความหมายและตีความงานเขียนได้ดีขึ้น', tier:3}
    ]
  },
  {
    id:'p6-thai2', name:'ภาษาไทย ป.6 · สำนวนและคำหลายความหมาย', emoji:'📂', icon:'assets/icons/p6-thai2.svg', color:'#E14E9A', light:'#FCE0EF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'"ขนมผสมน้ำยา" หมายความว่าอย่างไร?', emoji:'🍜', choices:['พอๆ กัน ไม่มีใครดีกว่าใคร','อร่อยกว่าปกติ','ทำอาหารเก่ง','ผสมของหลายอย่างเข้าด้วยกัน'], correct:0, explain:'ใช้เปรียบสองฝ่ายที่พอกัน ไม่มีใครเหนือกว่า', tier:1},
      {q:'คำว่า "ขัน" ในประโยค "เรื่องนี้น่าขันจริงๆ" หมายถึงอะไร?', emoji:'😄', choices:['น่าขบขัน','ภาชนะตักน้ำ','ทำให้แน่น','เสียงไก่'], correct:0, explain:'คำเดียวกันมีหลายความหมาย ต้องดูบริบทของประโยค', tier:1},
      {q:'คำว่า "ขัน" ในประโยค "ตักน้ำใส่ขัน" หมายถึงอะไร?', emoji:'🪣', choices:['ภาชนะสำหรับตักน้ำ','น่าขบขัน','หมุนให้แน่น','ร้องเสียงดัง'], correct:0, explain:'บริบทเรื่องน้ำบอกว่าเป็นภาชนะ ไม่ใช่ความขบขัน', tier:1},
      {q:'"ใจดีเหมือนแม่พระ" เป็นการใช้ภาษาแบบใด?', emoji:'💞', choices:['คำเปรียบเทียบ','คำอุทาน','คำราชาศัพท์','คำภาษาถิ่น'], correct:0, explain:'มีคำว่า "เหมือน" เชื่อมสิ่งที่ถูกเปรียบกับสิ่งที่นำมาเปรียบ', tier:1},
      {q:'"กบในกะลาครอบ" หมายความว่าอย่างไร?', emoji:'🐸', choices:['คนที่มีความรู้แคบ ไม่รู้เรื่องภายนอก','คนที่ชอบอยู่ในน้ำ','คนที่เก็บของเก่ง','คนที่ชอบกระโดด'], correct:0, explain:'เปรียบคนที่รู้เห็นแต่โลกแคบๆ ของตนเอง', tier:1},
      {q:'"ปากหวาน" หมายความว่าอย่างไร?', emoji:'🍬', choices:['พูดจาไพเราะน่าฟัง','ชอบกินของหวาน','พูดไม่ชัด','กินเก่ง'], correct:0, explain:'ใช้ชมคนที่พูดจาอ่อนหวานน่าฟัง', tier:1},
      {q:'"หัวหมอ" หมายความว่าอย่างไร?', emoji:'🤓', choices:['ชอบใช้เล่ห์เหลี่ยมโต้เถียง','เรียนเก่งที่สุดในห้อง','อยากเป็นหมอ','ปวดหัวบ่อย'], correct:0, explain:'ใช้เรียกคนที่ชอบเถียงเอาชนะด้วยเล่ห์เหลี่ยม', tier:1},
      {q:'คำว่า "ตา" มีความหมายได้หลายอย่าง ข้อใดถูกต้อง?', emoji:'👁️', choices:['เป็นได้ทั้งอวัยวะสำหรับมองและพ่อของแม่','เป็นได้เฉพาะอวัยวะเท่านั้น','เป็นได้เฉพาะญาติผู้ใหญ่','ไม่มีความหมายอื่นเลย'], correct:0, explain:'คำหลายความหมายต้องดูบริบทว่าหมายถึงอะไร', tier:1},
      {q:'"เร็วราวกับสายฟ้า" คำใดเป็นคำเชื่อมการเปรียบเทียบ?', emoji:'⚡', choices:['ราวกับ','เร็ว','สายฟ้า','เป็น'], correct:0, explain:'คำว่า เหมือน ดั่ง ราวกับ ประดุจ ใช้เชื่อมการเปรียบเทียบ', tier:1},
      {q:'"ชักใบให้เรือเสีย" หมายความว่าอย่างไร?', emoji:'⛵', choices:['พูดหรือทำให้เรื่องเขวออกนอกทาง','ซ่อมเรือให้ใช้ได้','ช่วยให้งานเดินหน้า','แล่นเรือได้เร็วขึ้น'], correct:0, explain:'ใช้กับคนที่พูดสอดจนเรื่องเสียหายหรือหลุดประเด็น', tier:2},
      {q:'คำว่า "ขา" ใน "ขาโต๊ะ" ต่างจาก "ขาคน" อย่างไร?', emoji:'🪑', choices:['เป็นคำเดียวกันแต่ขยายความหมายมาใช้กับสิ่งของ','เป็นคนละคำที่เขียนบังเอิญเหมือนกัน','ขาโต๊ะเป็นคำผิด','ขาคนเป็นคำเปรียบเทียบ'], correct:0, explain:'ภาษาไทยนำคำเรียกอวัยวะมาใช้กับส่วนของสิ่งของที่ทำหน้าที่คล้ายกัน', tier:2},
      {q:'"น้ำท่วมปาก" หมายความว่าอย่างไร?', emoji:'🤐', choices:['มีเรื่องอยากพูดแต่พูดออกมาไม่ได้','ดื่มน้ำมากเกินไป','พูดมากจนน่ารำคาญ','ร้องไห้หนักมาก'], correct:0, explain:'ใช้กับคนที่รู้เรื่องแต่พูดไม่ได้เพราะมีข้อจำกัดบางอย่าง', tier:2},
      {q:'"หน้าเนื้อใจเสือ" หมายความว่าอย่างไร?', emoji:'🐯', choices:['ภายนอกดูใจดีแต่ใจร้าย','หน้าตาดุแต่ใจดี','ชอบกินเนื้อ','กล้าหาญมาก'], correct:0, explain:'เปรียบคนที่ท่าทางอ่อนโยนแต่จิตใจโหดร้าย', tier:2},
      {q:'คำว่า "กัน" ในคำว่า "กันแดด" หมายถึงอะไร?', emoji:'☂️', choices:['ป้องกัน','พวกเรา','ตัดออก','แบ่งครึ่ง'], correct:0, explain:'"กัน" ในที่นี้หมายถึงป้องกันไม่ให้แดดกระทบ', tier:2},
      {q:'"ดินพอกหางหมู" หมายความว่าอย่างไร?', emoji:'🐷', choices:['ปล่อยงานคั่งค้างจนสะสมมากขึ้นเรื่อยๆ','เลี้ยงหมูให้อ้วน','ทำงานเร็วจนเสร็จก่อนกำหนด','ทำสวนเก่ง'], correct:0, explain:'เปรียบงานที่ผัดวันประกันพรุ่งจนพอกพูนเหมือนดินติดหางหมู', tier:2},
      {q:'"เข้าเมืองตาหลิ่วต้องหลิ่วตาตาม" สอนเรื่องอะไร?', emoji:'🏘️', choices:['ปรับตัวให้เข้ากับที่ที่เราไปอยู่','ต้องทำตาหลิ่วให้เป็น','อย่าเดินทางไปไหนไกล','ทำตามใจตนเองเสมอ'], correct:0, explain:'สอนให้รู้จักปรับตัวตามธรรมเนียมของถิ่นที่เราไปอยู่', tier:2},
      {q:'คำเปรียบเทียบต่างจากสำนวนอย่างไร?', emoji:'📖', choices:['คำเปรียบเทียบมักมีคำว่า เหมือน ดั่ง ราวกับ ให้เห็นชัด','สำนวนต้องยาวกว่าเสมอ','คำเปรียบเทียบใช้ได้เฉพาะในกลอน','สำนวนไม่มีความหมายแฝง'], correct:0, explain:'สำนวนมีความหมายเชิงเปรียบในตัวโดยไม่ต้องมีคำเชื่อม', tier:2},
      {q:'"ขี่ช้างจับตั๊กแตน" หมายความว่าอย่างไร?', emoji:'🐘', choices:['ลงทุนลงแรงมากแต่ได้ผลเล็กน้อย','จับสัตว์เก่ง','ทำงานใหญ่ให้สำเร็จ','เลี้ยงสัตว์หลายชนิด'], correct:0, explain:'เปรียบการใช้ทรัพยากรเกินความจำเป็นกับงานเล็กๆ', tier:2},
      {q:'"รักพี่เสียดายน้อง" หมายความว่าอย่างไร?', emoji:'🤔', choices:['ตัดสินใจเลือกไม่ได้เพราะอยากได้ทั้งสองอย่าง','รักพี่น้องมาก','เสียใจที่ต้องจากกัน','ทะเลาะกับพี่น้อง'], correct:0, explain:'ใช้กับสถานการณ์ที่ต้องเลือกแต่ตัดใจไม่ได้ทั้งคู่', tier:3},
      {q:'"ตกกระไดพลอยโจน" หมายความว่าอย่างไร?', emoji:'🪜', choices:['จำใจทำตามเหตุการณ์ที่เกิดขึ้นแล้ว','ตกบันไดบาดเจ็บ','กระโดดเก่ง','วางแผนล่วงหน้าอย่างดี'], correct:0, explain:'เมื่อพลาดไปแล้วก็เลยทำต่อให้เข้ากับสถานการณ์', tier:3},
      {q:'"ปลาหมอตายเพราะปาก" สอนเรื่องอะไร?', emoji:'🐟', choices:['พูดพล่อยจนเกิดโทษแก่ตัวเอง','ปลาชอบกินเหยื่อ','ต้องกินให้น้อยลง','พูดมากทำให้เสียงแหบ'], correct:0, explain:'เตือนให้ระวังคำพูดที่อาจนำภัยมาสู่ตนเอง', tier:3},
      {q:'"เหยียบเรือสองแคม" หมายความว่าอย่างไร?', emoji:'⛵', choices:['ทำตัวเข้าข้างทั้งสองฝ่ายเพื่อประโยชน์ตน','ขึ้นเรือสองลำพร้อมกัน','ช่วยงานสองอย่างพร้อมกัน','เดินทางไกลสองครั้ง'], correct:0, explain:'เปรียบคนที่ไม่เลือกข้างชัดเจนเพื่อรักษาผลประโยชน์ของตัวเอง', tier:3},
      {q:'เหตุใดจึงต้องพิจารณาบริบทเมื่อพบคำที่มีหลายความหมาย?', emoji:'🔍', choices:['เพราะความหมายเปลี่ยนไปตามประโยคที่แวดล้อมอยู่','เพราะคำเหล่านั้นสะกดผิด','เพราะเป็นคำที่ใช้ไม่ได้ในภาษาเขียน','เพราะทุกคำมีความหมายเดียวเสมอ'], correct:0, explain:'เช่น "ขัน" อาจเป็นภาชนะหรือความขบขัน ต้องดูประโยคประกอบ', tier:3},
      {q:'"น้ำขุ่นไว้ใน น้ำใสไว้นอก" สอนเรื่องอะไร?', emoji:'💧', choices:['เก็บความไม่พอใจไว้ข้างในและแสดงท่าทีที่ดีต่อกัน','ต้องกรองน้ำก่อนดื่ม','อย่าเก็บความลับไว้','พูดตรงๆ ทุกเรื่อง'], correct:0, explain:'สอนให้รักษาความสัมพันธ์ด้วยการไม่แสดงอารมณ์ขุ่นมัวออกมาให้เสียใจกัน', tier:3}
    ]
  },
  {
    id:'p6-thai3', name:'ภาษาไทย ป.6 · กลอนสุภาพและระดับภาษา', emoji:'🗄️', icon:'assets/icons/p6-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'กลอนสุภาพ (กลอนแปด) วรรคหนึ่งมีกี่คำ?', emoji:'✍️', choices:['8 คำ','6 คำ','11 คำ','4 คำ'], correct:0, explain:'กลอนแปดมีวรรคละ 8 คำ จึงเรียกว่ากลอนแปด', tier:1},
      {q:'กลอนสุภาพหนึ่งบทมีกี่วรรค?', emoji:'📜', choices:['4 วรรค','2 วรรค','6 วรรค','8 วรรค'], correct:0, explain:'หนึ่งบทมี 2 บาท บาทละ 2 วรรค รวมเป็น 4 วรรค', tier:1},
      {q:'ภาษาระดับทางการเหมาะใช้ในโอกาสใด?', emoji:'🏛️', choices:['การประชุมและเอกสารราชการ','คุยเล่นกับเพื่อนสนิท','ส่งข้อความหาน้อง','ตะโกนเรียกเพื่อน'], correct:0, explain:'ภาษาทางการใช้ในสถานการณ์ที่เป็นพิธีการหรือเอกสารราชการ', tier:1},
      {q:'คำสุภาพของคำว่า "กิน" คือคำใด?', emoji:'🍽️', choices:['รับประทาน','แดก','ยัด','ฟาด'], correct:0, explain:'"รับประทาน" เป็นคำสุภาพที่ใช้ได้ทุกโอกาส', tier:1},
      {q:'คำสุภาพของคำว่า "หมา" คือคำใด?', emoji:'🐶', choices:['สุนัข','หมาน้อย','เจ้าตูบ','หมาใหญ่'], correct:0, explain:'"สุนัข" เป็นคำสุภาพที่ใช้ในภาษาเขียนและภาษาทางการ', tier:1},
      {q:'"สัมผัส" ในบทกลอนหมายถึงอะไร?', emoji:'🔗', choices:['เสียงคล้องจองกันตามตำแหน่งที่กำหนด','การแตะต้องด้วยมือ','จำนวนคำในวรรค','ชื่อของผู้แต่ง'], correct:0, explain:'สัมผัสคือความคล้องจองของเสียงที่ทำให้กลอนไพเราะ', tier:1},
      {q:'ภาษาปาก (ภาษาพูด) เหมาะใช้ในโอกาสใด?', emoji:'💬', choices:['พูดคุยกับคนสนิทในชีวิตประจำวัน','เขียนจดหมายราชการ','เขียนรายงานวิชาการ','กล่าวรายงานในพิธี'], correct:0, explain:'ภาษาปากใช้ในบรรยากาศไม่เป็นทางการเท่านั้น', tier:1},
      {q:'คำสุภาพของคำว่า "หัว" คือคำใด?', emoji:'🧍', choices:['ศีรษะ','กบาล','หัวโขน','หัวใจ'], correct:0, explain:'"ศีรษะ" เป็นคำสุภาพของ "หัว"', tier:1},
      {q:'บทอาขยานมีประโยชน์อย่างไร?', emoji:'📖', choices:['ฝึกความจำและซึมซับความไพเราะของภาษา','ทำให้เขียนเร็วขึ้น','ช่วยให้คำนวณเก่งขึ้น','ทำให้พูดเสียงดังขึ้น'], correct:0, explain:'การท่องบทอาขยานช่วยจดจำถ้อยคำงดงามและจังหวะของภาษาไทย', tier:1},
      {q:'กลอนสุภาพหนึ่งบทมีทั้งหมดกี่คำ?', emoji:'🔢', choices:['ประมาณ 32 คำ','ประมาณ 16 คำ','ประมาณ 44 คำ','ประมาณ 8 คำ'], correct:0, explain:'4 วรรค วรรคละ 8 คำ รวมประมาณ 32 คำ', tier:2},
      {q:'ภาษาระดับกึ่งทางการเหมาะใช้เมื่อใด?', emoji:'🧑‍🏫', choices:['พูดกับครูหรือผู้ใหญ่ที่ไม่สนิทมาก','เขียนกฎหมาย','คุยเล่นกับเพื่อนซี้','ตะโกนข้ามสนาม'], correct:0, explain:'กึ่งทางการอยู่ระหว่างภาษาพูดกับภาษาทางการ สุภาพแต่ไม่แข็งเกินไป', tier:2},
      {q:'คำว่า "เยอะแยะ" ถ้าเขียนในภาษาทางการควรใช้คำใด?', emoji:'📝', choices:['จำนวนมาก','เยอะมาก','เพียบเลย','ล้นหลามสุดๆ'], correct:0, explain:'ภาษาทางการเลี่ยงคำภาษาปาก ใช้ "จำนวนมาก" แทน', tier:2},
      {q:'การเขียนจดหมายถึงหน่วยงานราชการควรใช้ภาษาระดับใด?', emoji:'📮', choices:['ภาษาทางการ','ภาษาปาก','ภาษาถิ่น','ภาษาคำคะนอง'], correct:0, explain:'เอกสารราชการต้องใช้ภาษาทางการเพื่อความสุภาพและชัดเจน', tier:2},
      {q:'คำสุภาพของคำว่า "ตาย" ที่ใช้กับคนทั่วไปคือคำใด?', emoji:'🕯️', choices:['เสียชีวิต','สิ้นพระชนม์','มรณภาพ','ล้มหายตายจาก'], correct:0, explain:'"เสียชีวิต" ใช้กับบุคคลทั่วไป ส่วนคำอื่นใช้กับพระสงฆ์หรือเจ้านาย', tier:2},
      {q:'ข้อความใดเหมาะกับการเขียนรายงานวิชาการมากที่สุด?', emoji:'🔬', choices:['ผลการทดลองแสดงให้เห็นว่าพืชเจริญเติบโตได้ดีขึ้น','ต้นไม้โตปรี๊ดเลยอ่ะ','โตขึ้นเยอะมากกกก','งอกไวสุดๆ ไปเลย'], correct:0, explain:'รายงานวิชาการใช้ภาษาทางการ กระชับ และเป็นกลาง', tier:2},
      {q:'"ขอประทานโทษ" เหมาะใช้กับบุคคลใด?', emoji:'🙇', choices:['ผู้ใหญ่หรือในโอกาสที่เป็นทางการ','เพื่อนสนิท','น้องเล็กในบ้าน','สัตว์เลี้ยง'], correct:0, explain:'เป็นคำขอโทษระดับสุภาพมาก ใช้กับผู้ใหญ่หรือโอกาสทางการ', tier:2},
      {q:'ในกลอนสุภาพ คำสุดท้ายของวรรคที่ 2 ส่งสัมผัสไปยังคำสุดท้ายของวรรคใด?', emoji:'🔗', choices:['วรรคที่ 3','วรรคที่ 1','วรรคที่ 4','ไม่ส่งสัมผัสเลย'], correct:0, explain:'กลอนสุภาพส่งสัมผัสจากท้ายวรรคที่ 2 ไปยังท้ายวรรคที่ 3', tier:2},
      {q:'บทกลอนสุภาพนิยมใช้แต่งงานประเภทใด?', emoji:'📚', choices:['นิทานคำกลอนและบทพรรณนา','ใบเสร็จรับเงิน','ประกาศราชการ','ตารางเรียน'], correct:0, explain:'กลอนสุภาพไพเราะและเล่าเรื่องได้ยาว จึงนิยมใช้แต่งนิทานคำกลอน', tier:2},
      {q:'"เดินทางไกลใจมุ่งหมาย ไปให้ถึงจุด▢..." ควรเติมคำใดจึงจะรับสัมผัสได้ถูกต้อง?', emoji:'✍️', choices:['ปลาย','ทาง','ฝัน','ไกล'], correct:0, explain:'คำว่า "ปลาย" รับสัมผัสสระกับคำว่า "หมาย" ได้พอดี', tier:3},
      {q:'ภาษาที่ใช้ในการรายงานข่าวทางโทรทัศน์เป็นภาษาระดับใด?', emoji:'📺', choices:['ทางการหรือกึ่งทางการ','ภาษาปากล้วนๆ','ภาษาถิ่นเท่านั้น','ภาษาคำคะนอง'], correct:0, explain:'ข่าวต้องน่าเชื่อถือและเข้าใจง่าย จึงใช้ภาษาทางการหรือกึ่งทางการ', tier:3},
      {q:'ข้อใดใช้ระดับภาษาไม่เหมาะกับสถานการณ์?', emoji:'🚫', choices:['นักเรียนพูดกับครูว่า "เฮ้ย ครู มานี่ดิ"','นักเรียนพูดกับครูว่า "ขออนุญาตครับ/ค่ะ"','พูดกับเพื่อนว่า "ไปกินข้าวกัน"','เขียนรายงานว่า "ผลการทดลองพบว่า..."'], correct:0, explain:'พูดกับครูต้องใช้ภาษาสุภาพ ไม่ใช่ภาษาปากแบบพูดกับเพื่อน', tier:3},
      {q:'เหตุใดจึงต้องเลือกระดับภาษาให้เหมาะกับบุคคลและโอกาส?', emoji:'🤝', choices:['เพื่อแสดงความเคารพและสื่อสารได้เหมาะสม','เพื่อให้พูดได้ยาวขึ้น','เพื่อให้ดูฉลาดกว่าคนอื่น','เพื่อให้จำคำได้มากขึ้น'], correct:0, explain:'การใช้ภาษาถูกกาลเทศะสะท้อนมารยาทและทำให้การสื่อสารราบรื่น', tier:3},
      {q:'คำว่า "ท้อง" ในความหมายการตั้งครรภ์ มีคำสุภาพว่าอย่างไร?', emoji:'🤰', choices:['ตั้งครรภ์','พุง','ไส้','กระเพาะ'], correct:0, explain:'"ตั้งครรภ์" เป็นคำสุภาพที่ใช้ในภาษาเขียนและภาษาทางการ', tier:3},
      {q:'การแต่งกลอนให้ไพเราะควรคำนึงถึงสิ่งใดมากที่สุด?', emoji:'🎵', choices:['จำนวนคำในวรรคและตำแหน่งสัมผัสให้ถูกฉันทลักษณ์','ใช้คำยากให้มากที่สุด','เขียนให้ยาวที่สุด','ใช้คำภาษาอังกฤษปนให้เท่'], correct:0, explain:'ฉันทลักษณ์ที่ถูกต้องคือหัวใจของความไพเราะในกลอนไทย', tier:3}
    ]
  },
  {
    id:'p6-thai4', name:'ภาษาไทย ป.6 · อ่านวิเคราะห์และรู้ทันการโน้มน้าว', emoji:'📡', icon:'assets/icons/p6-thai4.svg', color:'#C22E7E', light:'#FCE0EF', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'ข้อความโฆษณาส่วนใหญ่มีจุดประสงค์ใด?', emoji:'📺', choices:['ชักชวนให้ผู้อ่านซื้อสินค้าหรือบริการ','ให้ความรู้ทางวิชาการอย่างเป็นกลาง','บันทึกเหตุการณ์ประวัติศาสตร์','สอนวิธีทำการบ้าน'], correct:0, explain:'โฆษณาเป็นงานเขียนเชิงโน้มน้าวใจเพื่อการขายเป็นหลัก', tier:1},
      {q:'"ครีมนี้ใช้แล้วขาวขึ้นภายใน 3 วัน" เป็นข้อความลักษณะใด?', emoji:'⚠️', choices:['คำโฆษณาที่อาจเกินจริง ควรตรวจสอบก่อนเชื่อ','ข้อเท็จจริงที่พิสูจน์แล้ว','กฎทางวิทยาศาสตร์','คำสั่งที่ต้องปฏิบัติตาม'], correct:0, explain:'คำกล่าวอ้างผลลัพธ์รวดเร็วเกินจริงเป็นสัญญาณของโฆษณาชวนเชื่อ', tier:1},
      {q:'ข้อใดเป็นข้อเท็จจริง?', emoji:'🔬', choices:['น้ำเดือดที่อุณหภูมิ 100 องศาเซลเซียส','อาหารร้านนี้อร่อยที่สุดในโลก','สีฟ้าสวยกว่าสีเขียว','วันจันทร์เป็นวันที่แย่ที่สุด'], correct:0, explain:'ข้อเท็จจริงตรวจสอบได้ ส่วนข้ออื่นเป็นความรู้สึกส่วนตัว', tier:1},
      {q:'ข้อใดเป็นข้อคิดเห็น?', emoji:'💭', choices:['ภาพยนตร์เรื่องนี้สนุกที่สุดเท่าที่เคยดูมา','หนึ่งปีมี 12 เดือน','ประเทศไทยอยู่ในทวีปเอเชีย','น้ำแข็งละลายกลายเป็นน้ำ'], correct:0, explain:'"สนุกที่สุด" เป็นการตัดสินตามความรู้สึกของผู้พูด', tier:1},
      {q:'การโน้มน้าวใจโดยบอกว่า "ใครๆ ก็ใช้กันทั้งนั้น" เป็นกลวิธีแบบใด?', emoji:'👥', choices:['อ้างว่าคนส่วนใหญ่ทำตาม','ให้เหตุผลเชิงวิทยาศาสตร์','แสดงหลักฐานตัวเลข','อธิบายขั้นตอนการใช้'], correct:0, explain:'เป็นการชวนเชื่อโดยอาศัยความรู้สึกว่าต้องทำตามคนหมู่มาก', tier:1},
      {q:'ก่อนเชื่อข้อมูลที่อ่านจากอินเทอร์เน็ต ควรทำสิ่งใด?', emoji:'🔎', choices:['ตรวจสอบแหล่งที่มาและเทียบกับแหล่งอื่น','เชื่อทันทีถ้ามีคนแชร์เยอะ','ดูเฉพาะภาพประกอบ','เชื่อถ้าเขียนด้วยตัวอักษรใหญ่'], correct:0, explain:'ความน่าเชื่อถือขึ้นกับแหล่งที่มา ไม่ใช่จำนวนการแชร์', tier:1},
      {q:'"ใจความสำคัญ" ของย่อหน้าหมายถึงอะไร?', emoji:'🎯', choices:['ประเด็นหลักที่ย่อหน้านั้นต้องการบอก','ประโยคที่ยาวที่สุด','ประโยคสุดท้ายเสมอ','คำที่สะกดยากที่สุด'], correct:0, explain:'ใจความสำคัญคือแก่นของย่อหน้า ส่วนที่เหลือเป็นรายละเอียดขยาย', tier:1},
      {q:'"ข้อมูลสนับสนุน" ในบทความหมายถึงอะไร?', emoji:'📊', choices:['ตัวเลขหรือตัวอย่างที่นำมายืนยันความคิดเห็น','ชื่อผู้เขียนบทความ','ภาพประกอบที่สวยงาม','จำนวนหน้าของบทความ'], correct:0, explain:'ข้อมูลสนับสนุนช่วยให้ความคิดเห็นมีน้ำหนักน่าเชื่อถือ', tier:1},
      {q:'ข้อความ "ด่วน! เหลือเพียง 3 ชิ้นสุดท้าย" ใช้กลวิธีโน้มน้าวแบบใด?', emoji:'⏰', choices:['เร่งเร้าให้รีบตัดสินใจ','ให้ข้อมูลครบถ้วนรอบด้าน','เปรียบเทียบราคาอย่างเป็นธรรม','อธิบายส่วนประกอบของสินค้า'], correct:0, explain:'การสร้างความรู้สึกว่าของจะหมดทำให้ผู้ซื้อรีบตัดสินใจโดยไม่ทันคิด', tier:1},
      {q:'"ร้านนี้ขายดีที่สุดในย่านนี้ เพราะมีลูกค้าต่อคิวยาวทุกวัน" ส่วนใดเป็นข้อมูลสนับสนุน?', emoji:'🏪', choices:['มีลูกค้าต่อคิวยาวทุกวัน','ร้านนี้ขายดีที่สุด','ในย่านนี้','เพราะ'], correct:0, explain:'ข้อความหลังคำว่า "เพราะ" คือหลักฐานที่นำมาสนับสนุนความคิดเห็น', tier:2},
      {q:'โฆษณาที่ใช้ดารามีชื่อเสียงมาพูดแนะนำสินค้า เป็นกลวิธีใด?', emoji:'🌟', choices:['อ้างบุคคลที่มีชื่อเสียงให้ดูน่าเชื่อถือ','แสดงผลการทดลองทางวิทยาศาสตร์','เปรียบเทียบราคากับร้านอื่น','อธิบายวิธีใช้อย่างละเอียด'], correct:0, explain:'ความชื่นชอบตัวบุคคลถูกใช้แทนเหตุผลเกี่ยวกับตัวสินค้า', tier:2},
      {q:'"กินผักดีต่อสุขภาพ เพราะมีวิตามินและใยอาหาร" ประโยคนี้มีลักษณะอย่างไร?', emoji:'🥦', choices:['เป็นความคิดเห็นที่มีเหตุผลสนับสนุน','เป็นคำโฆษณาเกินจริง','เป็นคำสั่งให้ปฏิบัติตาม','เป็นข้อความชวนเชื่อ'], correct:0, explain:'มีข้อสรุปพร้อมเหตุผลที่ตรวจสอบได้ จึงน่าเชื่อถือกว่าคำกล่าวลอยๆ', tier:2},
      {q:'เมื่ออ่านบทความ ควรตั้งคำถามใดเป็นอันดับแรก?', emoji:'❓', choices:['ผู้เขียนต้องการบอกอะไรกับเรา','บทความนี้ยาวกี่หน้า','ใช้ตัวอักษรแบบไหน','มีภาพประกอบกี่ภาพ'], correct:0, explain:'การจับจุดประสงค์ของผู้เขียนช่วยให้เข้าใจสารทั้งหมดได้เร็วขึ้น', tier:2},
      {q:'ข้อความชวนเชื่อมักมีลักษณะอย่างไร?', emoji:'📣', choices:['ใช้ถ้อยคำกระตุ้นอารมณ์มากกว่าให้เหตุผล','อ้างอิงงานวิจัยอย่างละเอียด','บอกทั้งข้อดีและข้อเสีย','ใช้ตัวเลขที่ตรวจสอบได้'], correct:0, explain:'การเร้าอารมณ์ทำให้ผู้อ่านตัดสินใจโดยไม่ใช้เหตุผล', tier:2},
      {q:'ถ้าข้อมูลจากสองแหล่งขัดแย้งกัน ควรทำอย่างไร?', emoji:'⚖️', choices:['หาแหล่งข้อมูลเพิ่มและพิจารณาความน่าเชื่อถือของแต่ละแหล่ง','เชื่อแหล่งที่อ่านเจอก่อน','เชื่อแหล่งที่มีสีสันสวยกว่า','เลิกอ่านทั้งสองแหล่ง'], correct:0, explain:'การเทียบหลายแหล่งช่วยให้เห็นว่าข้อมูลใดมีหลักฐานหนักแน่นกว่า', tier:2},
      {q:'"เหตุ" กับ "ผล" ในเรื่องที่อ่านต่างกันอย่างไร?', emoji:'🔄', choices:['เหตุคือสาเหตุที่ทำให้เกิด ส่วนผลคือสิ่งที่เกิดตามมา','เหตุอยู่ท้ายเรื่องเสมอ','ผลคือชื่อของตัวละคร','ทั้งสองอย่างเหมือนกัน'], correct:0, explain:'การแยกเหตุกับผลช่วยให้เข้าใจความเชื่อมโยงของเหตุการณ์', tier:2},
      {q:'"การอ่านเชิงวิเคราะห์" หมายถึงอะไร?', emoji:'🧠', choices:['อ่านแล้วแยกแยะข้อเท็จจริง เหตุผล และความคิดเห็นออกจากกัน','อ่านให้เร็วที่สุด','อ่านออกเสียงให้ดัง','อ่านซ้ำหลายรอบจนจำได้'], correct:0, explain:'การวิเคราะห์คือการพิจารณาส่วนประกอบของเรื่องอย่างมีเหตุผล', tier:2},
      {q:'ข้อความ "โปรดใช้สะพานลอยเพื่อความปลอดภัย" มีจุดประสงค์ใด?', emoji:'🚸', choices:['ให้คำแนะนำเพื่อความปลอดภัย','ขายสินค้า','เล่าเรื่องสนุก','บันทึกประวัติศาสตร์'], correct:0, explain:'เป็นข้อความเชิงแนะนำให้ปฏิบัติเพื่อประโยชน์ของผู้อ่านเอง', tier:2},
      {q:'บทความกล่าวว่า "โรงเรียนควรมีสวนผัก เพราะเด็กได้เรียนรู้และมีอาหารกลางวันที่ปลอดภัย" ความคิดเห็นหลักคือข้อใด?', emoji:'🌱', choices:['โรงเรียนควรมีสวนผัก','เด็กได้เรียนรู้','อาหารกลางวันปลอดภัย','โรงเรียนมีพื้นที่ว่าง'], correct:0, explain:'ส่วนที่ตามหลัง "เพราะ" เป็นเหตุผลสนับสนุนข้อเสนอหลัก', tier:3},
      {q:'เห็นโฆษณา "ลด 90% วันนี้วันเดียว!" ควรตรวจสอบสิ่งใดก่อน?', emoji:'🏷️', choices:['ราคาเดิมที่แท้จริงและเงื่อนไขของโปรโมชัน','สีของป้ายโฆษณา','จำนวนคนที่กดถูกใจ','ขนาดของตัวอักษร'], correct:0, explain:'ส่วนลดที่สูงผิดปกติมักมีเงื่อนไขแฝงหรือราคาเดิมที่ถูกตั้งไว้สูงเกินจริง', tier:3},
      {q:'ข้อความใดมีความสมเหตุสมผลมากที่สุด?', emoji:'✅', choices:['ออกกำลังกายสม่ำเสมอช่วยให้ร่างกายแข็งแรงขึ้น','ดื่มน้ำนี้แล้วสอบได้ที่หนึ่งแน่นอน','ใส่เสื้อสีแดงแล้วจะโชคดีทุกวัน','นอนดึกทำให้เรียนเก่งขึ้น'], correct:0, explain:'ข้อความแรกมีเหตุผลรองรับและตรวจสอบได้ ส่วนข้ออื่นเป็นความเชื่อที่ไม่มีหลักฐาน', tier:3},
      {q:'อ่านเรื่อง "เด็กชายเก็บกระเป๋าเงินได้แล้วนำไปคืนเจ้าของ" แล้วนำข้อคิดไปใช้ในชีวิตจริงได้อย่างไร?', emoji:'👜', choices:['ซื่อสัตย์แม้ในเวลาที่ไม่มีใครเห็น','เก็บของที่พบไว้ใช้เอง','รีบเดินหนีเมื่อพบของตก','บอกให้เพื่อนเก็บแทน'], correct:0, explain:'ข้อคิดเรื่องความซื่อสัตย์นำไปใช้ได้ทุกสถานการณ์ในชีวิตประจำวัน', tier:3},
      {q:'ข้อใดเป็นการสรุปบทความที่ดี?', emoji:'📝', choices:['เก็บใจความหลักและเหตุผลสำคัญไว้ โดยไม่เติมความเห็นใหม่ของผู้สรุป','เล่าเฉพาะตอนที่ตนเองชอบ','เขียนให้ยาวกว่าบทความเดิม','ใส่ความคิดเห็นส่วนตัวให้มากที่สุด'], correct:0, explain:'การสรุปที่ดีต้องซื่อตรงต่อสารเดิมของผู้เขียน', tier:3},
      {q:'เหตุใดจึงต้องรู้เท่าทันสื่อโฆษณา?', emoji:'🛡️', choices:['เพื่อตัดสินใจด้วยเหตุผล ไม่ใช่ตามอารมณ์ที่ถูกกระตุ้น','เพื่อจะได้ไม่ต้องดูโฆษณาเลย','เพื่อจะได้ซื้อของได้มากขึ้น','เพื่อจะได้จำเพลงโฆษณาได้'], correct:0, explain:'การรู้เท่าทันช่วยให้เราเลือกซื้อสิ่งที่จำเป็นจริงและไม่ถูกหลอก', tier:3}
    ]
  },
  /* ---------- English ป.6 : 3 หมวด ---------- */
  {
    id:'p6-eng1', name:'English ป.6 · Reading with Why & How', emoji:'🗝️', icon:'assets/icons/p6-eng1.svg', color:'#0FB5AE', light:'#D5F5F2', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'"Tom studies hard because he wants to be a doctor." Why does Tom study hard?', emoji:'👨‍⚕️', choices:['Because he wants to be a doctor.','Because he likes sports.','Because his teacher is kind.','Because he is tired.'], correct:0, explain:'because นำหน้าเหตุผล คือเขาอยากเป็นหมอ', tier:1},
      {q:'"Lisa goes to school by bus every morning." How does Lisa go to school?', emoji:'🚌', choices:['By bus.','By car.','On foot.','By train.'], correct:0, explain:'How ถามวิธีการ คำตอบคือ by bus', tier:1},
      {q:'"The children are happy because it is a holiday." Why are the children happy?', emoji:'🎉', choices:['Because it is a holiday.','Because they are hungry.','Because it is raining.','Because they lost a game.'], correct:0, explain:'เหตุผลอยู่หลัง because คือเป็นวันหยุด', tier:1},
      {q:'"Mother makes soup with vegetables and chicken." How does Mother make the soup?', emoji:'🍲', choices:['With vegetables and chicken.','With rice and eggs.','With fruit and milk.','With bread only.'], correct:0, explain:'ประโยคบอกส่วนผสมไว้ชัดเจนหลังคำว่า with', tier:1},
      {q:'"We cannot swim today because the water is too cold." Why can they not swim?', emoji:'🏊', choices:['Because the water is too cold.','Because the pool is closed.','Because they are sick.','Because it is dark.'], correct:0, explain:'เหตุผลคือน้ำเย็นเกินไป', tier:1},
      {q:'"Ben cleans his room every Sunday." When does Ben clean his room?', emoji:'🧹', choices:['Every Sunday.','Every Monday.','Every night.','Never.'], correct:0, explain:'ประโยคระบุเวลาไว้ว่า every Sunday', tier:1},
      {q:'"The bird builds its nest with small sticks." How does the bird build its nest?', emoji:'🪺', choices:['With small sticks.','With paper.','With stones.','With water.'], correct:0, explain:'with small sticks บอกวิธี/วัสดุที่ใช้สร้างรัง', tier:1},
      {q:'"Anna is sad because she lost her pencil case." Why is Anna sad?', emoji:'😢', choices:['Because she lost her pencil case.','Because she is hungry.','Because she is late.','Because she has homework.'], correct:0, explain:'เหตุผลที่เศร้าคือทำกล่องดินสอหาย', tier:1},
      {q:'"Dad opens the door with a key." How does Dad open the door?', emoji:'🗝️', choices:['With a key.','With his foot.','With a hammer.','With a rope.'], correct:0, explain:'with a key บอกเครื่องมือที่ใช้', tier:1},
      {q:'"The plants died because nobody watered them for two weeks." Why did the plants die?', emoji:'🥀', choices:['Because nobody watered them.','Because it rained too much.','Because they were too old.','Because it was sunny.'], correct:0, explain:'ไม่มีใครรดน้ำเป็นเวลาสองสัปดาห์ ต้นไม้จึงตาย', tier:2},
      {q:'"Sara saves money every week so she can buy a new bike." Why does Sara save money?', emoji:'🚲', choices:['So she can buy a new bike.','Because she lost her money.','So she can buy a book.','Because her bike is new.'], correct:0, explain:'so (that) นำหน้าจุดประสงค์ คือเพื่อซื้อจักรยานใหม่', tier:2},
      {q:'"You can make orange juice by squeezing fresh oranges." How can you make the juice?', emoji:'🍊', choices:['By squeezing fresh oranges.','By boiling water.','By mixing milk and sugar.','By freezing apples.'], correct:0, explain:'by + V-ing บอกวิธีการทำ', tier:2},
      {q:'"The match was cancelled because of the heavy rain." Why was the match cancelled?', emoji:'⚽', choices:['Because of the heavy rain.','Because the players were late.','Because the field was new.','Because nobody came.'], correct:0, explain:'because of + คำนาม ใช้บอกสาเหตุเช่นเดียวกับ because', tier:2},
      {q:'"Kim learns English by watching cartoons and reading comics." How does Kim learn English?', emoji:'📺', choices:['By watching cartoons and reading comics.','By sleeping early.','By playing football.','By cooking dinner.'], correct:0, explain:'by + V-ing สองกิจกรรมที่เขาใช้เรียนภาษาอังกฤษ', tier:2},
      {q:'"Grandpa walks slowly because his legs hurt." Why does Grandpa walk slowly?', emoji:'👴', choices:['Because his legs hurt.','Because he is in a hurry.','Because the road is short.','Because he is happy.'], correct:0, explain:'เหตุผลอยู่หลัง because คือขาเจ็บ', tier:2},
      {q:'"Please turn off the lights before you leave the room." What should you do before leaving?', emoji:'💡', choices:['Turn off the lights.','Open the window.','Turn on the fan.','Close the book.'], correct:0, explain:'ประโยคขอร้องบอกให้ปิดไฟก่อนออกจากห้อง', tier:2},
      {q:'"Nan was late because the bus broke down on the way." Why was Nan late?', emoji:'🚏', choices:['Because the bus broke down.','Because she woke up early.','Because she walked fast.','Because school started later.'], correct:0, explain:'รถบัสเสียระหว่างทางจึงทำให้มาสาย', tier:2},
      {q:'"Sam keeps his room clean by tidying it every day." How does Sam keep his room clean?', emoji:'🧽', choices:['By tidying it every day.','By closing the door.','By moving to a new room.','By asking his friend.'], correct:0, explain:'by tidying it every day บอกวิธีที่เขาใช้', tier:2},
      {q:'"Many animals in the forest are in danger because people cut down too many trees." Why are the animals in danger?', emoji:'🌳', choices:['Because people cut down too many trees.','Because the forest is too big.','Because there is too much rain.','Because animals eat too much.'], correct:0, explain:'การตัดไม้ทำลายที่อยู่อาศัยของสัตว์ จึงทำให้สัตว์เสี่ยงอันตราย', tier:3},
      {q:'"We can save water by turning off the tap while brushing our teeth." How can we save water?', emoji:'🚰', choices:['By turning off the tap while brushing our teeth.','By taking longer showers.','By washing the car every day.','By leaving the tap open.'], correct:0, explain:'by + V-ing บอกวิธีประหยัดน้ำที่ทำได้จริง', tier:3},
      {q:'"The library was quiet because everyone was reading." Why was the library quiet?', emoji:'📚', choices:['Because everyone was reading.','Because it was closed.','Because the lights were off.','Because nobody was there.'], correct:0, explain:'ทุกคนกำลังอ่านหนังสือ ห้องสมุดจึงเงียบ', tier:3},
      {q:'"You can find the meaning of a new word by looking it up in a dictionary." How can you find the meaning?', emoji:'📔', choices:['By looking it up in a dictionary.','By guessing the spelling.','By asking a stranger on the street.','By writing it again.'], correct:0, explain:'ใช้พจนานุกรมค้นหาความหมายเป็นวิธีที่ถูกต้อง', tier:3},
      {q:'"Peter did not join the trip because he had a fever." Why did Peter not join the trip?', emoji:'🤒', choices:['Because he had a fever.','Because the trip was cancelled.','Because he did not like it.','Because the bus was full.'], correct:0, explain:'เขามีไข้จึงไม่ได้ไปทัศนศึกษา', tier:3},
      {q:'"The cake tastes good because Mom used fresh milk and real butter." Why does the cake taste good?', emoji:'🎂', choices:['Because Mom used fresh milk and real butter.','Because it is very big.','Because it is very cold.','Because it took a long time.'], correct:0, explain:'เหตุผลคือใช้วัตถุดิบสดและเนยแท้', tier:3}
    ]
  },
  {
    id:'p6-eng2', name:'English ป.6 · Directions & Big Numbers', emoji:'🚦', icon:'assets/icons/p6-eng2.svg', color:'#0A8F89', light:'#D5F5F2', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'What does "Turn left" mean?', emoji:'⬅️', choices:['เลี้ยวซ้าย','เลี้ยวขวา','ตรงไป','กลับรถ'], correct:0, explain:'left = ซ้าย, turn = เลี้ยว', tier:1},
      {q:'What does "Go straight" mean?', emoji:'⬆️', choices:['ตรงไปข้างหน้า','เลี้ยวซ้าย','หยุด','ถอยหลัง'], correct:0, explain:'go straight = เดินหรือขับตรงไป', tier:1},
      {q:'How do you say "500" in English?', emoji:'🔢', choices:['five hundred','five thousand','fifty','five hundreds'], correct:0, explain:'500 = five hundred (ไม่เติม s)', tier:1},
      {q:'How do you say "1,000" in English?', emoji:'🔢', choices:['one thousand','one hundred','ten hundred','one million'], correct:0, explain:'1,000 = one thousand', tier:1},
      {q:'What does "Turn right at the corner" mean?', emoji:'➡️', choices:['เลี้ยวขวาตรงหัวมุม','เลี้ยวซ้ายตรงหัวมุม','ตรงไปจนสุดถนน','ข้ามถนนตรงทางม้าลาย'], correct:0, explain:'right = ขวา, at the corner = ตรงหัวมุม', tier:1},
      {q:'How do you say "250" in English?', emoji:'🔢', choices:['two hundred and fifty','twenty-five','two hundred five','twenty-five hundred'], correct:0, explain:'250 = two hundred and fifty', tier:1},
      {q:'What does "It is next to the bank" mean?', emoji:'🏦', choices:['อยู่ติดกับธนาคาร','อยู่ตรงข้ามธนาคาร','อยู่ไกลจากธนาคาร','อยู่ในธนาคาร'], correct:0, explain:'next to = อยู่ถัดไป/ติดกับ', tier:1},
      {q:'What does "opposite the school" mean?', emoji:'🏫', choices:['อยู่ตรงข้ามโรงเรียน','อยู่ข้างในโรงเรียน','อยู่หลังโรงเรียน','อยู่ใต้โรงเรียน'], correct:0, explain:'opposite = ตรงข้าม', tier:1},
      {q:'How do you say "700" in English?', emoji:'🔢', choices:['seven hundred','seventy','seven thousand','seventeen'], correct:0, explain:'700 = seven hundred', tier:1},
      {q:'"Go straight and turn left at the traffic light." What should you do first?', emoji:'🚦', choices:['Go straight.','Turn left.','Stop at the light.','Turn right.'], correct:0, explain:'คำสั่งแรกคือ go straight แล้วจึงเลี้ยวซ้าย', tier:2},
      {q:'How do you say "365" in English?', emoji:'📅', choices:['three hundred and sixty-five','three hundred and fifty-six','thirty-six five','three sixty five hundred'], correct:0, explain:'365 = three hundred and sixty-five', tier:2},
      {q:'Which sentence asks for directions?', emoji:'❓', choices:['Excuse me, how can I get to the post office?','What time is it now?','How old are you?','What is your favourite colour?'], correct:0, explain:'How can I get to...? เป็นการถามทาง', tier:2},
      {q:'"The hospital is between the market and the park." Where is the hospital?', emoji:'🏥', choices:['อยู่ระหว่างตลาดกับสวนสาธารณะ','อยู่หลังตลาด','อยู่ในสวนสาธารณะ','อยู่ไกลจากทั้งสองแห่ง'], correct:0, explain:'between A and B = อยู่ระหว่าง A กับ B', tier:2},
      {q:'How do you say "1,200" in English?', emoji:'🔢', choices:['one thousand two hundred','twelve hundred thousand','one hundred twenty','twelve thousand'], correct:0, explain:'1,200 = one thousand two hundred (หรือ twelve hundred)', tier:2},
      {q:'What does "Walk past the bakery" mean?', emoji:'🥐', choices:['เดินผ่านร้านเบเกอรี่ไป','เดินเข้าไปในร้านเบเกอรี่','หยุดที่ร้านเบเกอรี่','เลี้ยวเข้าร้านเบเกอรี่'], correct:0, explain:'walk past = เดินเลยผ่านไป', tier:2},
      {q:'"Take the second turning on your right." Which turning should you take?', emoji:'🛣️', choices:['The second one on the right.','The first one on the right.','The second one on the left.','The last one on the left.'], correct:0, explain:'second = ที่สอง, on your right = ทางขวามือ', tier:2},
      {q:'How do you say "840" in English?', emoji:'🔢', choices:['eight hundred and forty','eighty-four','eight hundred and fourteen','eight forty hundred'], correct:0, explain:'840 = eight hundred and forty', tier:2},
      {q:'What does "It is on the corner of Main Street" mean?', emoji:'🏙️', choices:['อยู่ตรงหัวมุมถนนเมน','อยู่กลางถนนเมน','อยู่ใต้ถนนเมน','อยู่ไกลจากถนนเมน'], correct:0, explain:'on the corner of = ตรงหัวมุมของถนนนั้น', tier:2},
      {q:'"Go straight for two blocks, then turn right. The library is on your left." Where is the library?', emoji:'📚', choices:['On the left after turning right.','On the right after two blocks.','Straight ahead only.','Behind the school.'], correct:0, explain:'ทำตามลำดับ: ตรงไป 2 ช่วงตึก → เลี้ยวขวา → ห้องสมุดอยู่ทางซ้าย', tier:3},
      {q:'How do you say "999" in English?', emoji:'🔢', choices:['nine hundred and ninety-nine','ninety-nine nine','nine hundred and nineteen','nine thousand ninety-nine'], correct:0, explain:'999 = nine hundred and ninety-nine', tier:3},
      {q:'Which is the polite way to ask a stranger for directions?', emoji:'🙋', choices:['Excuse me, could you tell me the way to the station, please?','Hey! Where station?','Tell me now.','Station. Go.'], correct:0, explain:'ใช้ Excuse me และ could you...please? เพื่อความสุภาพ', tier:3},
      {q:'"The museum is 350 metres from here." How far is the museum?', emoji:'🏛️', choices:['Three hundred and fifty metres.','Thirty-five metres.','Three thousand five hundred metres.','Fifty-three metres.'], correct:0, explain:'350 = three hundred and fifty', tier:3},
      {q:'"Turn left, walk past the bank, and it is next to the cafe." Which is the last clue about the place?', emoji:'☕', choices:['It is next to the cafe.','Turn left.','Walk past the bank.','It is far away.'], correct:0, explain:'ประโยคสุดท้ายบอกตำแหน่งสุดท้ายว่าอยู่ติดกับร้านกาแฟ', tier:3},
      {q:'You are at the school. The park is behind the school. How do you get there?', emoji:'🏞️', choices:['Go around to the back of the school.','Go into the school building.','Turn left at the market.','Cross the river first.'], correct:0, explain:'behind the school = อยู่ด้านหลังโรงเรียน จึงต้องเดินอ้อมไปด้านหลัง', tier:3}
    ]
  },
  {
    id:'p6-eng3', name:'English ป.6 · Adjectives & Polite Words', emoji:'🪁', icon:'assets/icons/p6-eng3.svg', color:'#0A7A75', light:'#D5F5F2', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'Which word means "สวยงาม"?', emoji:'🌸', choices:['beautiful','ugly','loud','angry'], correct:0, explain:'beautiful = สวยงาม', tier:1},
      {q:'Which word means "เสียงดัง"?', emoji:'🔊', choices:['loud','quiet','soft','small'], correct:0, explain:'loud = เสียงดัง', tier:1},
      {q:'Someone bumps into you by accident and says sorry. What do you reply?', emoji:'🙂', choices:["That's O.K.",'Go away.','You are bad.','No, thank you.'], correct:0, explain:"That's O.K. หรือ Never mind. ใช้ตอบรับคำขอโทษ", tier:1},
      {q:'Which word is the opposite of "beautiful"?', emoji:'🔄', choices:['ugly','pretty','lovely','nice'], correct:0, explain:'ugly = น่าเกลียด ตรงข้ามกับ beautiful', tier:1},
      {q:'How do you politely get a stranger\'s attention?', emoji:'🙋', choices:['Excuse me.','Hey you!','Come here now.','Listen to me!'], correct:0, explain:'Excuse me. เป็นวิธีสุภาพในการเรียกความสนใจ', tier:1},
      {q:'Which word means "เงียบ"?', emoji:'🤫', choices:['quiet','noisy','loud','fast'], correct:0, explain:'quiet = เงียบ', tier:1},
      {q:'Your friend is sad. Which sentence comforts him best?', emoji:'🤗', choices:["Don't worry. I am here for you.",'That is your problem.','You are so slow.','I do not care.'], correct:0, explain:"Don't worry. ใช้ปลอบใจเพื่อน", tier:1},
      {q:'Which word means "อร่อย"?', emoji:'😋', choices:['delicious','terrible','boring','heavy'], correct:0, explain:'delicious = อร่อย', tier:1},
      {q:'How do you politely ask someone to repeat?', emoji:'👂', choices:['Pardon? Could you say that again, please?','What? Say again!','I do not understand you.','Speak louder now.'], correct:0, explain:'Pardon? กับ please ทำให้คำขอสุภาพขึ้น', tier:1},
      {q:'"The film was so ___ that I fell asleep." Which word fits best?', emoji:'😴', choices:['boring','exciting','delicious','loud'], correct:0, explain:'boring = น่าเบื่อ จึงทำให้หลับ', tier:2},
      {q:'"This soup is too ___ . I need some water." Which word fits best?', emoji:'🌶️', choices:['spicy','sweet','quiet','tall'], correct:0, explain:'spicy = เผ็ด จึงต้องดื่มน้ำ', tier:2},
      {q:'Which sentence is the most polite request?', emoji:'🙏', choices:['Could you help me, please?','Help me.','You must help me.','Help now!'], correct:0, explain:'Could you...please? เป็นคำขอร้องที่สุภาพที่สุด', tier:2},
      {q:'"My little brother is very ___ . He never sits still." Which word fits best?', emoji:'🏃', choices:['active','lazy','quiet','sleepy'], correct:0, explain:'active = กระฉับกระเฉง ไม่อยู่นิ่ง', tier:2},
      {q:'Someone gives you a present. What do you say?', emoji:'🎁', choices:['Thank you very much!','Give me more.','I do not like it.','Take it back.'], correct:0, explain:'แสดงความขอบคุณเมื่อได้รับของขวัญ', tier:2},
      {q:'"The box is very ___ . I cannot lift it alone." Which word fits best?', emoji:'📦', choices:['heavy','light','soft','sweet'], correct:0, explain:'heavy = หนัก จึงยกคนเดียวไม่ไหว', tier:2},
      {q:'Which reply politely refuses help?', emoji:'🙂', choices:["No, thank you. I can do it myself.",'No! Go away.','I do not want you here.','Stop talking to me.'], correct:0, explain:'ปฏิเสธอย่างสุภาพด้วย No, thank you.', tier:2},
      {q:'"Your handwriting is very ___ . I can read every word." Which word fits best?', emoji:'✍️', choices:['neat','messy','loud','angry'], correct:0, explain:'neat = เรียบร้อย อ่านง่าย', tier:2},
      {q:'Which word describes a person who helps others?', emoji:'💞', choices:['kind','selfish','rude','lazy'], correct:0, explain:'kind = ใจดี ชอบช่วยเหลือผู้อื่น', tier:2},
      {q:'"I am sorry I broke your cup." Which is the kindest reply?', emoji:'🍵', choices:["Never mind. It was an accident.",'You always break things.','Buy me a new one right now.','I will never forgive you.'], correct:0, explain:'Never mind. แสดงความเข้าใจและให้อภัย', tier:3},
      {q:'"The music at the party was so ___ that we could not talk." Which word fits best?', emoji:'🎵', choices:['loud','quiet','soft','slow'], correct:0, explain:'เสียงดังมากจนคุยกันไม่ได้ จึงใช้ loud', tier:3},
      {q:'Which sentence uses an adjective correctly?', emoji:'✅', choices:['She is a careful driver.','She drives careful.','She is careful driver.','She drive carefully person.'], correct:0, explain:'careful เป็นคำคุณศัพท์ขยายคำนาม driver และต้องมี a นำหน้า', tier:3},
      {q:'You want to enter the teacher\'s room. What do you say first?', emoji:'🚪', choices:['Excuse me, may I come in, please?','I am coming in.','Open the door for me.','Move, please.'], correct:0, explain:'ขออนุญาตอย่างสุภาพด้วย may I...please?', tier:3},
      {q:'"The homework was ___ , so I finished it in ten minutes." Which word fits best?', emoji:'📝', choices:['easy','difficult','heavy','spicy'], correct:0, explain:'ทำเสร็จใน 10 นาทีแสดงว่าง่าย จึงใช้ easy', tier:3},
      {q:'Which pair shows opposite adjectives?', emoji:'🔄', choices:['good – bad','kind – nice','happy – glad','big – large'], correct:0, explain:'good กับ bad มีความหมายตรงข้ามกัน ส่วนคู่อื่นความหมายใกล้เคียงกัน', tier:3}
    ]
  },
  /* ---------- สังคมศึกษา ป.6 : 4 หมวด ---------- */
  {
    id:'p6-social1', name:'สังคม ป.6 · รัตนโกสินทร์และบุคคลสำคัญ', emoji:'⚱️', icon:'assets/icons/p6-social1.svg', color:'#F6A609', light:'#FEEFC9', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'ผู้สถาปนากรุงรัตนโกสินทร์คือใคร?', emoji:'👑', choices:['พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช (รัชกาลที่ 1)','สมเด็จพระเจ้าตากสินมหาราช','สมเด็จพระนเรศวรมหาราช','พ่อขุนรามคำแหงมหาราช'], correct:0, explain:'รัชกาลที่ 1 ทรงสถาปนากรุงรัตนโกสินทร์เป็นราชธานีใน พ.ศ. 2325', tier:1},
      {q:'ราชธานีก่อนกรุงรัตนโกสินทร์คือเมืองใด?', emoji:'🏯', choices:['กรุงธนบุรี','กรุงศรีอยุธยา','เมืองสุโขทัย','เมืองเชียงใหม่'], correct:0, explain:'ลำดับคือ อยุธยา → ธนบุรี → รัตนโกสินทร์', tier:1},
      {q:'รัชกาลที่ 5 ทรงมีพระราชกรณียกิจสำคัญข้อใด?', emoji:'⛓️', choices:['การเลิกทาสและปฏิรูปการปกครอง','การสถาปนากรุงศรีอยุธยา','การประกาศอิสรภาพจากพม่า','การสร้างเมืองสุโขทัย'], correct:0, explain:'พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวทรงเลิกทาสและปฏิรูปประเทศให้ทันสมัย', tier:1},
      {q:'พระบรมมหาราชวังตั้งอยู่ที่จังหวัดใด?', emoji:'🏛️', choices:['กรุงเทพมหานคร','พระนครศรีอยุธยา','นครปฐม','สุโขทัย'], correct:0, explain:'สร้างขึ้นพร้อมการสถาปนากรุงรัตนโกสินทร์ที่กรุงเทพมหานคร', tier:1},
      {q:'"วิธีการทางประวัติศาสตร์" เริ่มต้นด้วยขั้นตอนใด?', emoji:'🔎', choices:['ตั้งคำถามหรือประเด็นที่ต้องการศึกษา','สรุปผลทันที','เล่าเรื่องให้เพื่อนฟัง','วาดภาพเหตุการณ์'], correct:0, explain:'เริ่มจากตั้งคำถาม แล้วจึงรวบรวมหลักฐาน ตรวจสอบ ตีความ และสรุป', tier:1},
      {q:'หลักฐานทางประวัติศาสตร์ข้อใดเป็นลายลักษณ์อักษร?', emoji:'📜', choices:['พระราชหัตถเลขาและกฎหมายเก่า','เครื่องปั้นดินเผา','กำแพงเมือง','เครื่องมือหิน'], correct:0, explain:'หลักฐานลายลักษณ์อักษรคือสิ่งที่บันทึกด้วยตัวหนังสือ', tier:1},
      {q:'กรุงรัตนโกสินทร์สถาปนาขึ้นในปีพุทธศักราชใด?', emoji:'📅', choices:['พ.ศ. 2325','พ.ศ. 2112','พ.ศ. 2310','พ.ศ. 2475'], correct:0, explain:'รัชกาลที่ 1 ทรงสถาปนากรุงรัตนโกสินทร์ใน พ.ศ. 2325', tier:1},
      {q:'ภูมิปัญญาไทยสมัยรัตนโกสินทร์ที่โดดเด่นคือข้อใด?', emoji:'🎭', choices:['วรรณคดี การช่างสิบหมู่ และนาฏศิลป์','การผลิตรถยนต์','การสร้างดาวเทียม','การทำเหมืองถ่านหิน'], correct:0, explain:'งานช่างฝีมือ วรรณคดี และนาฏศิลป์เจริญรุ่งเรืองมากในสมัยรัตนโกสินทร์', tier:1},
      {q:'"ข้อเท็จจริง" ทางประวัติศาสตร์ต่างจากความคิดเห็นอย่างไร?', emoji:'⚖️', choices:['ข้อเท็จจริงมีหลักฐานตรวจสอบยืนยันได้','ข้อเท็จจริงต้องเป็นเรื่องเก่าที่สุด','ข้อเท็จจริงคือสิ่งที่คนส่วนใหญ่เชื่อ','ข้อเท็จจริงต้องอยู่ในหนังสือเรียนเท่านั้น'], correct:0, explain:'ความคิดเห็นเป็นการตีความ ส่วนข้อเท็จจริงต้องมีหลักฐานรองรับ', tier:1},
      {q:'เหตุใดรัชกาลที่ 5 จึงทรงปฏิรูปการปกครองเป็นระบบกระทรวง?', emoji:'🏢', choices:['เพื่อให้การบริหารประเทศเป็นระเบียบและทันสมัยขึ้น','เพื่อลดจำนวนข้าราชการ','เพื่อย้ายเมืองหลวง','เพื่อยกเลิกการเก็บภาษี'], correct:0, explain:'การจัดตั้งกระทรวงทำให้งานราชการมีหน้าที่ชัดเจนและมีประสิทธิภาพ', tier:2},
      {q:'การเสด็จประพาสยุโรปของรัชกาลที่ 5 มีผลอย่างไรต่อประเทศไทย?', emoji:'🚢', choices:['ช่วยสร้างความสัมพันธ์กับต่างชาติและนำความรู้มาพัฒนาประเทศ','ทำให้เสียดินแดนทั้งหมด','ทำให้ประเทศปิดตัวจากโลกภายนอก','ทำให้ยกเลิกการค้าขาย'], correct:0, explain:'การเจริญสัมพันธไมตรีช่วยรักษาเอกราชและนำวิทยาการใหม่เข้ามา', tier:2},
      {q:'ปัจจัยใดส่งเสริมความเจริญทางเศรษฐกิจของไทยสมัยรัตนโกสินทร์ตอนต้น?', emoji:'⛵', choices:['การค้าทางเรือสำเภากับจีนและชาติตะวันตก','การทำเหมืองแร่บนภูเขาสูง','การเลี้ยงสัตว์ในทะเลทราย','การส่งออกรถยนต์'], correct:0, explain:'การค้าสำเภาเป็นรายได้สำคัญของราชสำนักในช่วงต้นรัตนโกสินทร์', tier:2},
      {q:'พระราชหัตถเลขาคือหลักฐานประเภทใด?', emoji:'✉️', choices:['จดหมายที่พระมหากษัตริย์ทรงเขียน ใช้เป็นหลักฐานชั้นต้น','หนังสือเรียนที่แต่งขึ้นภายหลัง','ภาพวาดของศิลปิน','คำบอกเล่าของชาวบ้าน'], correct:0, explain:'เป็นหลักฐานชั้นต้นที่บันทึกโดยผู้อยู่ในเหตุการณ์โดยตรง', tier:2},
      {q:'ข้อใดคือลำดับสมัยของไทยที่ถูกต้อง?', emoji:'⏳', choices:['สุโขทัย → อยุธยา → ธนบุรี → รัตนโกสินทร์','อยุธยา → สุโขทัย → รัตนโกสินทร์ → ธนบุรี','ธนบุรี → รัตนโกสินทร์ → อยุธยา → สุโขทัย','รัตนโกสินทร์ → สุโขทัย → อยุธยา → ธนบุรี'], correct:0, explain:'เรียงตามเวลาจากเก่าสุดไปใหม่สุด', tier:2},
      {q:'การศึกษาประวัติศาสตร์ควรใช้หลักฐานอย่างไร?', emoji:'📚', choices:['ใช้หลายแหล่งประกอบกันและตรวจสอบความน่าเชื่อถือ','ใช้แหล่งเดียวที่หาง่ายที่สุด','เชื่อคำบอกเล่าโดยไม่ต้องตรวจสอบ','เลือกเฉพาะหลักฐานที่ตรงกับความเชื่อของตน'], correct:0, explain:'การเทียบหลายหลักฐานช่วยให้เข้าใจอดีตได้ใกล้เคียงความจริงมากที่สุด', tier:2},
      {q:'วรรณคดีเรื่องรามเกียรติ์ฉบับสมบูรณ์พระราชนิพนธ์ในรัชกาลใด?', emoji:'📖', choices:['รัชกาลที่ 1','รัชกาลที่ 5','รัชกาลที่ 9','รัชกาลที่ 3'], correct:0, explain:'รัชกาลที่ 1 ทรงพระราชนิพนธ์บทละครเรื่องรามเกียรติ์ฉบับสมบูรณ์', tier:2},
      {q:'การเลิกทาสในสมัยรัชกาลที่ 5 ส่งผลอย่างไรต่อสังคมไทย?', emoji:'🤝', choices:['ผู้คนมีอิสระในการทำงานและมีสิทธิเท่าเทียมกันมากขึ้น','ทำให้ประชาชนยากจนลงทั้งประเทศ','ทำให้ต้องย้ายเมืองหลวง','ทำให้ยกเลิกการศึกษา'], correct:0, explain:'การเลิกทาสเป็นก้าวสำคัญสู่ความเสมอภาคของคนในสังคมไทย', tier:2},
      {q:'เหตุใดจึงควรอนุรักษ์โบราณสถานในกรุงรัตนโกสินทร์?', emoji:'🛕', choices:['เป็นมรดกทางวัฒนธรรมที่บอกเล่าประวัติศาสตร์ให้คนรุ่นหลัง','เพื่อใช้เป็นที่จอดรถ','เพราะเป็นอาคารที่สร้างใหม่','เพื่อรื้อไปสร้างห้างสรรพสินค้า'], correct:0, explain:'โบราณสถานเป็นหลักฐานที่มีชีวิตของอดีตและเป็นแหล่งเรียนรู้', tier:2},
      {q:'ถ้าพบหลักฐานสองชิ้นที่เล่าเหตุการณ์เดียวกันแต่ขัดแย้งกัน ควรทำอย่างไร?', emoji:'🤔', choices:['ตรวจสอบที่มาและช่วงเวลาของหลักฐานทั้งสองก่อนสรุป','เชื่อชิ้นที่เก่ากว่าเสมอ','เชื่อชิ้นที่อ่านง่ายกว่า','ทิ้งหลักฐานทั้งสองชิ้น'], correct:0, explain:'ต้องวิเคราะห์ว่าใครบันทึก บันทึกเมื่อใด และมีจุดประสงค์อย่างไร', tier:3},
      {q:'เหตุใดการตั้งกรุงรัตนโกสินทร์จึงเลือกฝั่งตะวันออกของแม่น้ำเจ้าพระยา?', emoji:'🗺️', choices:['มีชัยภูมิป้องกันข้าศึกได้ดีและมีพื้นที่ขยายเมืองได้','เพราะอยู่ใกล้ภูเขามากที่สุด','เพราะไม่มีแม่น้ำไหลผ่าน','เพราะอยู่ไกลจากทะเลที่สุด'], correct:0, explain:'ฝั่งตะวันออกมีแม่น้ำเป็นปราการธรรมชาติและมีที่ราบให้ขยายเมืองได้', tier:3},
      {q:'ข้อใดเป็นข้อเท็จจริงทางประวัติศาสตร์?', emoji:'✅', choices:['กรุงรัตนโกสินทร์สถาปนาขึ้นใน พ.ศ. 2325','สมัยรัตนโกสินทร์เป็นยุคที่มีความสุขที่สุด','คนสมัยก่อนเก่งกว่าคนสมัยนี้','อาหารสมัยรัตนโกสินทร์อร่อยที่สุด'], correct:0, explain:'ปีที่สถาปนามีหลักฐานบันทึกชัดเจน ส่วนข้ออื่นเป็นความคิดเห็น', tier:3},
      {q:'การรับวัฒนธรรมตะวันตกในสมัยรัชกาลที่ 5 ควรมองอย่างไร?', emoji:'⚖️', choices:['รับสิ่งที่เป็นประโยชน์มาปรับใช้ พร้อมรักษาวัฒนธรรมไทยไว้','ต้องรับทุกอย่างโดยไม่เลือก','ต้องปฏิเสธทั้งหมด','ไม่มีผลต่อสังคมไทยเลย'], correct:0, explain:'การเลือกรับอย่างมีวิจารณญาณช่วยให้ประเทศพัฒนาโดยไม่สูญเสียเอกลักษณ์', tier:3},
      {q:'ถ้าต้องการศึกษาชีวิตคนธรรมดาในอดีต ควรใช้หลักฐานประเภทใดเป็นหลัก?', emoji:'🏘️', choices:['ภาพถ่ายเก่า ข้าวของเครื่องใช้ และคำบอกเล่าของผู้สูงอายุ','กฎหมายของราชสำนักเท่านั้น','พงศาวดารเรื่องสงครามเท่านั้น','แผนที่ทางทหารเท่านั้น'], correct:0, explain:'หลักฐานในชีวิตประจำวันสะท้อนความเป็นอยู่ของสามัญชนได้ดีที่สุด', tier:3},
      {q:'เหตุใดจึงกล่าวว่า "ประวัติศาสตร์ช่วยให้เราเข้าใจปัจจุบัน"?', emoji:'💡', choices:['เพราะเหตุการณ์ในอดีตส่งผลต่อสังคมและวัฒนธรรมที่เราอยู่ทุกวันนี้','เพราะอดีตกับปัจจุบันไม่เกี่ยวข้องกันเลย','เพราะประวัติศาสตร์ทำนายอนาคตได้แม่นยำ','เพราะทุกอย่างในอดีตจะเกิดซ้ำเหมือนเดิม'], correct:0, explain:'รากของกฎหมาย ประเพณี และเมืองที่เราอยู่ล้วนมาจากเหตุการณ์ในอดีต', tier:3}
    ]
  },
  {
    id:'p6-social2', name:'สังคม ป.6 · ประเทศเพื่อนบ้านและภูมิศาสตร์ไทย', emoji:'🗻', icon:'assets/icons/p6-social2.svg', color:'#E5893B', light:'#FEEFC9', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'ประเทศใดมีพรมแดนติดกับประเทศไทยทางทิศตะวันออก?', emoji:'🗺️', choices:['ลาวและกัมพูชา','มาเลเซีย','เมียนมา','เวียดนาม'], correct:0, explain:'ทิศตะวันออกของไทยติดกับลาวและกัมพูชา', tier:1},
      {q:'ประเทศใดมีพรมแดนติดกับประเทศไทยทางทิศใต้?', emoji:'🏝️', choices:['มาเลเซีย','ลาว','เมียนมา','กัมพูชา'], correct:0, explain:'ทิศใต้ของไทยติดกับประเทศมาเลเซีย', tier:1},
      {q:'แม่น้ำสายใดกั้นพรมแดนไทยกับลาวเป็นระยะทางยาว?', emoji:'🌊', choices:['แม่น้ำโขง','แม่น้ำเจ้าพระยา','แม่น้ำตาปี','แม่น้ำแม่กลอง'], correct:0, explain:'แม่น้ำโขงเป็นพรมแดนธรรมชาติระหว่างไทยกับลาว', tier:1},
      {q:'เครื่องมือทางภูมิศาสตร์ข้อใดใช้บอกทิศทาง?', emoji:'🧭', choices:['เข็มทิศ','เทอร์โมมิเตอร์','เครื่องชั่ง','นาฬิกา'], correct:0, explain:'เข็มทิศชี้ทิศเหนือเสมอ จึงใช้บอกทิศทางได้', tier:1},
      {q:'ภาคใดของไทยมีลักษณะเป็นที่ราบสูง?', emoji:'🌾', choices:['ภาคตะวันออกเฉียงเหนือ','ภาคกลาง','ภาคใต้','ภาคตะวันออก'], correct:0, explain:'ภาคอีสานตั้งอยู่บนที่ราบสูงโคราช', tier:1},
      {q:'ภูมิภาคใดของไทยเกิดน้ำท่วมซ้ำซากมากที่สุดในฤดูฝน?', emoji:'🌊', choices:['ภาคกลางซึ่งเป็นที่ราบลุ่มแม่น้ำ','ภาคเหนือบนยอดดอย','ทะเลทรายภาคตะวันตก','เกาะกลางมหาสมุทร'], correct:0, explain:'ที่ราบลุ่มภาคกลางรับน้ำจากแม่น้ำหลายสาย จึงเกิดน้ำท่วมได้ง่าย', tier:1},
      {q:'ภาพถ่ายทางอากาศมีประโยชน์อย่างไรทางภูมิศาสตร์?', emoji:'🛩️', choices:['ช่วยให้เห็นลักษณะพื้นที่จริงจากมุมสูงเพื่อวางแผนพัฒนา','ใช้บอกเวลาที่แน่นอน','ใช้วัดน้ำหนักของวัตถุ','ใช้ฟังเสียงใต้ดิน'], correct:0, explain:'ภาพถ่ายทางอากาศและดาวเทียมช่วยสำรวจการใช้ที่ดินและติดตามการเปลี่ยนแปลง', tier:1},
      {q:'ประเทศเมียนมาอยู่ทางทิศใดของประเทศไทย?', emoji:'🧭', choices:['ทิศตะวันตกและทิศเหนือ','ทิศใต้','ทิศตะวันออก','ทิศตะวันออกเฉียงใต้'], correct:0, explain:'เมียนมามีพรมแดนติดไทยทางทิศตะวันตกยาวลงมาถึงภาคใต้ตอนบน', tier:1},
      {q:'ข้อใดคือการรักษาสภาพแวดล้อมในภูมิภาค?', emoji:'🌱', choices:['ปลูกป่าทดแทนและคัดแยกขยะ','ทิ้งน้ำเสียลงแม่น้ำ','เผาป่าเพื่อทำไร่','ถมคลองเพื่อสร้างถนน'], correct:0, explain:'การปลูกป่าและจัดการขยะช่วยฟื้นฟูสิ่งแวดล้อมของชุมชน', tier:1},
      {q:'ลักษณะทางกายภาพแบบใดทำให้ภาคใต้มีอาชีพประมงและสวนยางเป็นหลัก?', emoji:'🌴', choices:['เป็นคาบสมุทรติดทะเลสองด้านและมีฝนตกชุก','เป็นที่ราบสูงแห้งแล้ง','เป็นภูเขาหิมะ','เป็นทะเลทรายกว้าง'], correct:0, explain:'ชายฝั่งยาวเอื้อต่อการประมง ส่วนฝนชุกเหมาะกับยางพารา', tier:2},
      {q:'ประเทศเพื่อนบ้านใดไม่มีทางออกสู่ทะเล?', emoji:'🚢', choices:['ลาว','มาเลเซีย','เมียนมา','กัมพูชา'], correct:0, explain:'ลาวเป็นประเทศที่ไม่มีพื้นที่ติดทะเล จึงต้องอาศัยเส้นทางผ่านประเทศอื่น', tier:2},
      {q:'แผ่นดินไหวในประเทศไทยมักรู้สึกได้ชัดในภูมิภาคใด?', emoji:'🏔️', choices:['ภาคเหนือซึ่งมีแนวรอยเลื่อนพาดผ่าน','ภาคกลางตอนล่าง','เกาะในอ่าวไทย','ที่ราบชายฝั่งตะวันออก'], correct:0, explain:'ภาคเหนือมีรอยเลื่อนมีพลังหลายแนว จึงเกิดแผ่นดินไหวขนาดเล็กได้บ่อยกว่า', tier:2},
      {q:'การย้ายถิ่นเข้าสู่เมืองใหญ่มีสาเหตุหลักจากอะไร?', emoji:'🏙️', choices:['ต้องการงานและรายได้ที่ดีกว่าในถิ่นเดิม','ต้องการอากาศบริสุทธิ์กว่า','ต้องการพื้นที่เกษตรมากขึ้น','ต้องการหนีน้ำท่วมเท่านั้น'], correct:0, explain:'โอกาสทางเศรษฐกิจเป็นแรงจูงใจสำคัญที่ทำให้คนย้ายเข้าเมือง', tier:2},
      {q:'สภาพแวดล้อมทางธรรมชาติมีอิทธิพลต่อวัฒนธรรมอย่างไร?', emoji:'🏘️', choices:['ทำให้เกิดอาหาร ที่อยู่อาศัย และประเพณีที่สอดคล้องกับพื้นที่นั้น','ไม่มีผลใดๆ ต่อวัฒนธรรม','ทำให้ทุกภูมิภาคมีวัฒนธรรมเหมือนกัน','ทำให้คนเลิกทำอาชีพดั้งเดิม'], correct:0, explain:'เช่น ภาคกลางทำนาจึงมีประเพณีเกี่ยวกับข้าว ภาคใต้ติดทะเลจึงมีอาหารทะเลเป็นหลัก', tier:2},
      {q:'ประเทศกัมพูชามีมรดกโลกที่มีชื่อเสียงคือข้อใด?', emoji:'🛕', choices:['ปราสาทนครวัด','กำแพงเมืองจีน','ทัชมาฮาล','พีระมิดกีซา'], correct:0, explain:'ปราสาทนครวัดเป็นมรดกโลกและสัญลักษณ์ของประเทศกัมพูชา', tier:2},
      {q:'พายุหมุนเขตร้อนมักส่งผลกระทบต่อภูมิภาคใดของไทยมากที่สุด?', emoji:'🌀', choices:['ภาคใต้ฝั่งอ่าวไทยและภาคตะวันออก','ภาคเหนือตอนบนเท่านั้น','ที่ราบสูงภาคอีสานเท่านั้น','ไม่มีภูมิภาคใดได้รับผลกระทบ'], correct:0, explain:'พายุที่ก่อตัวในทะเลจีนใต้มักเข้าสู่ชายฝั่งภาคใต้และภาคตะวันออก', tier:2},
      {q:'การใช้แผนที่ร่วมกับมาตราส่วนมีประโยชน์อย่างไร?', emoji:'📏', choices:['คำนวณระยะทางจริงจากระยะที่วัดได้บนแผนที่','บอกอุณหภูมิของพื้นที่','บอกจำนวนประชากรที่แน่นอน','บอกชนิดของพืชในพื้นที่'], correct:0, explain:'มาตราส่วนคืออัตราส่วนระหว่างระยะบนแผนที่กับระยะจริง', tier:2},
      {q:'ข้อใดสะท้อนผลจากการทำลายสภาพแวดล้อมในภูมิภาค?', emoji:'🏭', choices:['ป่าต้นน้ำถูกตัดจนเกิดน้ำหลากและดินถล่มในฤดูฝน','มีแหล่งน้ำสะอาดเพิ่มขึ้น','อากาศบริสุทธิ์ขึ้นทุกปี','สัตว์ป่ามีจำนวนมากขึ้น'], correct:0, explain:'การทำลายป่าต้นน้ำทำให้ระบบธรรมชาติที่ชะลอน้ำหายไป', tier:2},
      {q:'เหตุใดชุมชนริมแม่น้ำในอดีตจึงนิยมสร้างบ้านใต้ถุนสูง?', emoji:'🏠', choices:['เพื่อป้องกันน้ำท่วมและใช้พื้นที่ใต้ถุนทำกิจกรรม','เพื่อให้บ้านดูสวยงามเท่านั้น','เพื่อกันหิมะตก','เพื่อให้มองเห็นภูเขาได้ชัด'], correct:0, explain:'สภาพแวดล้อมริมน้ำหล่อหลอมรูปแบบบ้านเรือนให้เหมาะกับน้ำท่วมตามฤดูกาล', tier:3},
      {q:'ถ้าจังหวัดหนึ่งมีโรงงานเพิ่มขึ้นมากอย่างรวดเร็ว น่าจะเกิดผลใดตามมา?', emoji:'🏭', choices:['มีงานมากขึ้นแต่ต้องระวังมลพิษทางน้ำและอากาศ','ประชากรลดลงทันที','ป่าไม้เพิ่มขึ้นเอง','แม่น้ำสะอาดขึ้นกว่าเดิม'], correct:0, explain:'การพัฒนาอุตสาหกรรมมีทั้งผลดีทางเศรษฐกิจและผลกระทบต่อสิ่งแวดล้อม', tier:3},
      {q:'เหตุใดประเทศไทยจึงมีวัฒนธรรมคล้ายคลึงกับประเทศเพื่อนบ้านหลายอย่าง?', emoji:'🤝', choices:['เพราะอยู่ในภูมิภาคเดียวกันและมีการติดต่อแลกเปลี่ยนกันมายาวนาน','เพราะใช้ภาษาเดียวกันทุกประเทศ','เพราะเคยเป็นประเทศเดียวกันมาก่อน','เพราะไม่เคยติดต่อกันเลย'], correct:0, explain:'การค้า ศาสนา และการเดินทางทำให้เกิดการแลกเปลี่ยนวัฒนธรรมระหว่างกัน', tier:3},
      {q:'พื้นที่ชายฝั่งถูกกัดเซาะมีสาเหตุสำคัญจากอะไร?', emoji:'🌊', choices:['คลื่นลมแรงร่วมกับการทำลายป่าชายเลนและสิ่งก่อสร้างริมทะเล','ฝนตกน้อยเกินไป','อากาศเย็นจัด','การปลูกป่าชายเลนเพิ่ม'], correct:0, explain:'ป่าชายเลนช่วยลดแรงคลื่น เมื่อถูกทำลายชายฝั่งจึงถูกกัดเซาะเร็วขึ้น', tier:3},
      {q:'การวางแผนใช้ที่ดินที่ดีควรคำนึงถึงสิ่งใด?', emoji:'🗺️', choices:['ลักษณะทางกายภาพของพื้นที่และผลกระทบต่อสิ่งแวดล้อม','ความสวยงามของแผนที่','จำนวนถนนที่มีอยู่แล้วเท่านั้น','ราคาที่ดินเพียงอย่างเดียว'], correct:0, explain:'พื้นที่ลุ่มต่ำ พื้นที่ลาดชัน และป่าต้นน้ำต้องใช้ประโยชน์ให้เหมาะกับสภาพจริง', tier:3},
      {q:'ข้อใดเป็นแนวคิดรักษาสภาพแวดล้อมในภูมิภาคที่ทำได้จริง?', emoji:'♻️', choices:['ร่วมกันปลูกป่าชุมชน คัดแยกขยะ และลดใช้พลาสติกครั้งเดียว','ย้ายโรงงานทั้งหมดไปภูมิภาคอื่น','ห้ามคนเข้าป่าโดยเด็ดขาดตลอดไป','หยุดใช้ทรัพยากรทุกชนิด'], correct:0, explain:'แนวทางที่ทุกคนมีส่วนร่วมได้จริงยั่งยืนกว่ามาตรการสุดโต่ง', tier:3}
    ]
  },
  {
    id:'p6-social3', name:'สังคม ป.6 · ผู้ผลิต ผู้บริโภค และระบบเศรษฐกิจ', emoji:'🏗️', icon:'assets/icons/p6-social3.svg', color:'#D2762B', light:'#FEEFC9', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'"ผู้ผลิต" ในระบบเศรษฐกิจหมายถึงใคร?', emoji:'🏭', choices:['ผู้ที่ผลิตสินค้าและบริการออกสู่ตลาด','ผู้ที่ซื้อสินค้าไปใช้','ผู้ที่เก็บภาษี','ผู้ที่ให้กู้ยืมเงินเท่านั้น'], correct:0, explain:'ผู้ผลิตคือผู้สร้างสินค้าและบริการเพื่อตอบสนองความต้องการของผู้บริโภค', tier:1},
      {q:'"ผู้บริโภค" หมายถึงใคร?', emoji:'🛒', choices:['ผู้ที่ซื้อสินค้าและบริการไปใช้','ผู้ที่ผลิตสินค้า','ผู้ที่ออกกฎหมาย','ผู้ที่พิมพ์ธนบัตร'], correct:0, explain:'ผู้บริโภคคือผู้ใช้สินค้าและบริการที่ผู้ผลิตสร้างขึ้น', tier:1},
      {q:'ธนาคารมีบทบาทสำคัญอย่างไรในระบบเศรษฐกิจ?', emoji:'🏦', choices:['รับฝากเงินและให้กู้ยืมเพื่อหมุนเวียนเงินในระบบ','ผลิตสินค้าขายเอง','ออกกฎหมายเก็บภาษี','แจกเงินให้ประชาชนฟรี'], correct:0, explain:'ธนาคารเป็นตัวกลางนำเงินออมไปสู่ผู้ที่ต้องการลงทุน', tier:1},
      {q:'รัฐบาลมีบทบาทใดในระบบเศรษฐกิจ?', emoji:'🏛️', choices:['เก็บภาษีและจัดบริการสาธารณะให้ประชาชน','ผลิตสินค้าทุกชนิดเอง','ห้ามประชาชนซื้อขาย','กำหนดราคาสินค้าทุกอย่าง'], correct:0, explain:'รัฐบาลใช้ภาษีมาสร้างถนน โรงเรียน โรงพยาบาล และบริการอื่นๆ', tier:1},
      {q:'"ผู้ผลิตที่มีความรับผิดชอบ" มีลักษณะอย่างไร?', emoji:'♻️', choices:['ผลิตสินค้าที่ปลอดภัยและคำนึงถึงสิ่งแวดล้อม','ผลิตให้ได้มากที่สุดโดยไม่สนใจคุณภาพ','ปล่อยน้ำเสียลงแม่น้ำเพื่อลดต้นทุน','โฆษณาเกินจริงเพื่อให้ขายดี'], correct:0, explain:'ความรับผิดชอบครอบคลุมทั้งคุณภาพสินค้า ผู้บริโภค และสิ่งแวดล้อม', tier:1},
      {q:'"ผู้บริโภคที่รู้เท่าทัน" ควรทำสิ่งใด?', emoji:'🔍', choices:['อ่านฉลากและเปรียบเทียบราคาก่อนตัดสินใจซื้อ','ซื้อทุกอย่างที่โฆษณาบอก','ซื้อของที่แพงที่สุดเสมอ','ซื้อตามเพื่อนโดยไม่ต้องคิด'], correct:0, explain:'การตรวจสอบข้อมูลก่อนซื้อช่วยให้ได้ของที่คุ้มค่าและปลอดภัย', tier:1},
      {q:'ภาษีที่ประชาชนจ่ายให้รัฐนำไปใช้ทำอะไร?', emoji:'🛣️', choices:['สร้างถนน โรงเรียน โรงพยาบาล และบริการสาธารณะ','ให้ข้าราชการใช้ส่วนตัว','ซื้อสินค้าให้ร้านค้าเอกชน','เก็บไว้เฉยๆ ไม่ใช้เลย'], correct:0, explain:'ภาษีคือรายได้หลักที่รัฐนำมาพัฒนาประเทศเพื่อประโยชน์ส่วนรวม', tier:1},
      {q:'"การใช้ทรัพยากรอย่างยั่งยืน" หมายถึงอะไร?', emoji:'🌱', choices:['ใช้อย่างพอดีและรักษาไว้ให้คนรุ่นหลังได้ใช้ต่อ','ใช้ให้หมดเร็วที่สุด','เก็บไว้โดยไม่ใช้เลย','นำเข้าจากต่างประเทศทั้งหมด'], correct:0, explain:'ความยั่งยืนคือใช้ประโยชน์วันนี้โดยไม่ทำลายโอกาสของอนาคต', tier:1},
      {q:'เงินฝากของประชาชนในธนาคารถูกนำไปใช้อย่างไร?', emoji:'💰', choices:['ให้ผู้อื่นกู้ยืมไปลงทุนและคิดดอกเบี้ย','เก็บไว้ในตู้เซฟเฉยๆ ทั้งหมด','แจกให้ลูกค้ารายอื่น','ส่งคืนรัฐบาลทั้งหมด'], correct:0, explain:'ธนาคารนำเงินฝากไปปล่อยกู้ ทำให้เงินหมุนเวียนในระบบเศรษฐกิจ', tier:1},
      {q:'ความสัมพันธ์ระหว่างผู้ผลิตกับผู้บริโภคเป็นอย่างไร?', emoji:'🔄', choices:['ผู้ผลิตสร้างสินค้าตามความต้องการ ผู้บริโภคจ่ายเงินซื้อ ทำให้เกิดการหมุนเวียน','ทั้งสองฝ่ายไม่เกี่ยวข้องกันเลย','ผู้บริโภคเป็นผู้กำหนดราคาทั้งหมด','ผู้ผลิตต้องแจกสินค้าฟรี'], correct:0, explain:'ทั้งสองฝ่ายพึ่งพากัน ความต้องการของผู้บริโภคกำหนดสิ่งที่ผู้ผลิตสร้าง', tier:2},
      {q:'ถ้าผู้ผลิตลดต้นทุนด้วยการใช้วัตถุดิบคุณภาพต่ำ จะเกิดผลอย่างไร?', emoji:'⚠️', choices:['ผู้บริโภคอาจได้รับอันตรายและเสียความเชื่อมั่นในสินค้า','ผู้บริโภคจะพอใจมากขึ้น','สินค้าจะมีคุณภาพดีขึ้น','ไม่มีผลกระทบใดๆ'], correct:0, explain:'การลดต้นทุนโดยไม่รับผิดชอบทำลายทั้งผู้บริโภคและชื่อเสียงของกิจการ', tier:2},
      {q:'"ฉลากสินค้า" บอกข้อมูลสำคัญอะไรแก่ผู้บริโภค?', emoji:'🏷️', choices:['ส่วนประกอบ วันหมดอายุ และวิธีใช้','ชื่อของคนขาย','จำนวนคนที่เคยซื้อ','สีที่ขายดีที่สุด'], correct:0, explain:'ฉลากช่วยให้ตัดสินใจซื้อได้อย่างปลอดภัยและเหมาะสม', tier:2},
      {q:'ถ้ารัฐบาลลงทุนสร้างถนนและรถไฟฟ้าเพิ่ม จะส่งผลอย่างไร?', emoji:'🚇', choices:['การเดินทางและขนส่งสินค้าสะดวกขึ้น เศรษฐกิจขยายตัว','สินค้าจะแพงขึ้นทันทีทุกชนิด','ประชาชนจะเดินทางน้อยลง','ธนาคารจะปิดตัวลง'], correct:0, explain:'โครงสร้างพื้นฐานที่ดีช่วยลดต้นทุนขนส่งและกระตุ้นเศรษฐกิจ', tier:2},
      {q:'เมื่อสินค้าชนิดหนึ่งขาดตลาดแต่คนต้องการมาก มักเกิดอะไรขึ้น?', emoji:'📈', choices:['ราคาสินค้ามีแนวโน้มสูงขึ้น','ราคาสินค้าลดลงทันที','ผู้ผลิตหยุดผลิตทั้งหมด','ไม่มีการเปลี่ยนแปลงใดๆ'], correct:0, explain:'เมื่อของน้อยแต่ความต้องการมาก ราคามักปรับสูงขึ้นตามกลไกตลาด', tier:2},
      {q:'ข้อใดเป็นพฤติกรรมของผู้บริโภคที่ไม่รู้เท่าทัน?', emoji:'🚫', choices:['ซื้อสินค้าทันทีเพราะเห็นคำว่า "ลดสุดท้าย" โดยไม่ตรวจสอบ','เปรียบเทียบราคาหลายร้านก่อนซื้อ','อ่านวันหมดอายุก่อนหยิบ','ซื้อเฉพาะของที่จำเป็น'], correct:0, explain:'คำโฆษณาเร่งเร้ามักทำให้ตัดสินใจโดยไม่ใช้เหตุผล', tier:2},
      {q:'สหกรณ์แตกต่างจากบริษัทเอกชนอย่างไร?', emoji:'🤝', choices:['สมาชิกเป็นเจ้าของร่วมกันและแบ่งผลประโยชน์กัน','มีเจ้าของคนเดียวที่ได้กำไรทั้งหมด','ไม่ต้องทำบัญชี','ไม่มีสมาชิก'], correct:0, explain:'สหกรณ์ยึดหลักช่วยเหลือตนเองและช่วยเหลือซึ่งกันและกันของสมาชิก', tier:2},
      {q:'การออมเงินมีความสำคัญต่อระบบเศรษฐกิจอย่างไร?', emoji:'🐷', choices:['เงินออมกลายเป็นแหล่งทุนให้ผู้อื่นกู้ไปลงทุนต่อ','ทำให้เงินหายไปจากระบบ','ทำให้สินค้าราคาสูงขึ้น','ไม่มีผลต่อระบบเศรษฐกิจ'], correct:0, explain:'เงินออมที่ฝากธนาคารถูกนำไปปล่อยกู้ ทำให้เกิดการลงทุนและการจ้างงาน', tier:2},
      {q:'ถ้าผู้บริโภคเลือกซื้อสินค้าที่เป็นมิตรกับสิ่งแวดล้อมมากขึ้น จะเกิดผลใด?', emoji:'🌍', choices:['ผู้ผลิตจะปรับตัวผลิตสินค้าที่รักษาสิ่งแวดล้อมมากขึ้น','ผู้ผลิตจะเลิกผลิตสินค้าทั้งหมด','ราคาสินค้าทุกชนิดจะเป็นศูนย์','ไม่มีผลต่อผู้ผลิตเลย'], correct:0, explain:'พลังของผู้บริโภคมีผลต่อทิศทางการผลิตของตลาด', tier:2},
      {q:'ถ้าครอบครัวมีรายจ่ายมากกว่ารายรับทุกเดือน ควรทำอย่างไรเป็นอันดับแรก?', emoji:'📉', choices:['จดบันทึกรายรับรายจ่ายเพื่อหาว่าตัดรายจ่ายใดได้บ้าง','กู้เงินมาใช้เพิ่มทันที','ซื้อของที่แพงขึ้นเพื่อความคุ้มค่า','เลิกทำงานเพื่อประหยัดค่าเดินทาง'], correct:0, explain:'ต้องเห็นภาพการใช้เงินก่อนจึงจะวางแผนแก้ปัญหาได้ตรงจุด', tier:3},
      {q:'เหตุใดผู้ผลิตจึงควรวางแผนก่อนผลิตสินค้า?', emoji:'📋', choices:['เพื่อให้ผลิตตรงกับความต้องการและไม่สิ้นเปลืองทรัพยากร','เพื่อให้ผลิตได้มากที่สุดโดยไม่สนใจตลาด','เพื่อให้ราคาสินค้าสูงที่สุด','เพื่อลดจำนวนพนักงานให้เหลือน้อยที่สุด'], correct:0, explain:'การวางแผนช่วยลดของเหลือทิ้งและใช้ทรัพยากรอย่างคุ้มค่า', tier:3},
      {q:'ถ้ารัฐบาลขึ้นภาษีสินค้าฟุ่มเฟือย น่าจะมีจุดประสงค์ใด?', emoji:'🧾', choices:['ลดการบริโภคสินค้าที่ไม่จำเป็นและเพิ่มรายได้ให้รัฐ','ทำให้ประชาชนซื้อของมากขึ้น','ทำให้ผู้ผลิตเลิกกิจการ','ทำให้สินค้าราคาถูกลง'], correct:0, explain:'ภาษีเป็นเครื่องมือหนึ่งที่รัฐใช้ปรับพฤติกรรมการบริโภคและหารายได้', tier:3},
      {q:'การกู้ยืมเงินแบบใดถือว่ามีเหตุผลที่สุด?', emoji:'📈', choices:['กู้เพื่อลงทุนที่คาดว่าจะสร้างรายได้มากกว่าดอกเบี้ยที่ต้องจ่าย','กู้เพื่อซื้อของฟุ่มเฟือยตามเพื่อน','กู้เพื่อนำไปเสี่ยงโชค','กู้ให้มากที่สุดเท่าที่ธนาคารให้'], correct:0, explain:'หนี้ที่ดีต้องสร้างรายได้หรือคุณค่ามากกว่าต้นทุนดอกเบี้ย', tier:3},
      {q:'"เศรษฐกิจหมุนเวียน" ในความหมายง่ายๆ คืออะไร?', emoji:'🔄', choices:['ใช้ทรัพยากรซ้ำและนำกลับมาใช้ใหม่เพื่อลดของเสีย','ใช้ของใหม่ทุกครั้งเพื่อความสะอาด','ผลิตให้มากที่สุดเท่าที่ทำได้','ทิ้งของทันทีเมื่อใช้เสร็จ'], correct:0, explain:'แนวคิดนี้เน้นใช้ซ้ำ ซ่อมแซม และรีไซเคิลเพื่อให้ทรัพยากรอยู่ในระบบนานที่สุด', tier:3},
      {q:'ถ้าทุกคนในชุมชนเลือกซื้อสินค้าจากผู้ผลิตในท้องถิ่น จะเกิดผลดีอย่างไร?', emoji:'🏘️', choices:['เงินหมุนเวียนอยู่ในชุมชนและคนในพื้นที่มีรายได้เพิ่ม','สินค้าจะหมดจากชุมชนทันที','ผู้ผลิตท้องถิ่นจะเลิกกิจการ','ราคาสินค้าจะสูงขึ้นตลอดไป'], correct:0, explain:'การอุดหนุนผู้ผลิตท้องถิ่นช่วยสร้างงานและรายได้หมุนเวียนในชุมชน', tier:3}
    ]
  },
  {
    id:'p6-social4', name:'สังคม ป.6 · กฎหมาย พลเมือง และประชาธิปไตย', emoji:'🧳', icon:'assets/icons/p6-social4.svg', color:'#B9631F', light:'#FEEFC9', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'กฎหมายจราจรมีขึ้นเพื่ออะไร?', emoji:'🚦', choices:['ความปลอดภัยและความเป็นระเบียบของผู้ใช้ถนนทุกคน','เพื่อเก็บค่าปรับให้ได้มากที่สุด','เพื่อให้รถวิ่งช้าลงเท่านั้น','เพื่อห้ามคนเดินถนน'], correct:0, explain:'กฎจราจรช่วยให้ทุกคนใช้ถนนร่วมกันได้อย่างปลอดภัย', tier:1},
      {q:'การเลือกตั้งในระบอบประชาธิปไตยมีความสำคัญอย่างไร?', emoji:'🗳️', choices:['ประชาชนได้เลือกผู้แทนไปทำหน้าที่แทนตน','ทำให้ทุกคนได้เป็นผู้นำ','ทำให้ไม่ต้องเสียภาษี','ทำให้กฎหมายหมดอายุ'], correct:0, explain:'การออกเสียงเลือกตั้งคือการใช้อำนาจของประชาชนผ่านผู้แทน', tier:1},
      {q:'"มารยาทไทย" ที่แสดงความเคารพต่อผู้ใหญ่คือข้อใด?', emoji:'🙏', choices:['การไหว้และการกล่าวคำสุภาพ','การชี้นิ้วใส่','การพูดเสียงดังใส่','การเดินผ่านโดยไม่สนใจ'], correct:0, explain:'การไหว้เป็นเอกลักษณ์ของมารยาทไทยที่แสดงความอ่อนน้อม', tier:1},
      {q:'องค์กรปกครองส่วนท้องถิ่นต่างจากรัฐบาลกลางอย่างไร?', emoji:'🏢', choices:['ท้องถิ่นดูแลพื้นที่ของตนเอง ส่วนรัฐบาลกลางดูแลทั้งประเทศ','ท้องถิ่นดูแลทั้งประเทศ','ทั้งสองทำหน้าที่เหมือนกันทุกอย่าง','รัฐบาลกลางดูแลเฉพาะหมู่บ้าน'], correct:0, explain:'ท้องถิ่นแก้ปัญหาใกล้ตัว ส่วนรัฐบาลกลางกำหนดนโยบายระดับประเทศ', tier:1},
      {q:'กฎหมายทะเบียนราษฎรเกี่ยวข้องกับเรื่องใด?', emoji:'📋', choices:['การแจ้งเกิด แจ้งตาย และย้ายที่อยู่','การขับรถบนถนน','การซื้อขายสินค้า','การเข้าเรียนมหาวิทยาลัย'], correct:0, explain:'ทะเบียนราษฎรคือการบันทึกข้อมูลประชากรของรัฐ', tier:1},
      {q:'พลเมืองดีในระบอบประชาธิปไตยควรทำอย่างไรเมื่อเห็นต่างจากผู้อื่น?', emoji:'💬', choices:['รับฟังและแสดงเหตุผลอย่างสุภาพ','ตะโกนใส่จนอีกฝ่ายเงียบ','ไม่พูดคุยกับคนที่เห็นต่างอีกเลย','บังคับให้ทุกคนคิดเหมือนตน'], correct:0, explain:'ประชาธิปไตยตั้งอยู่บนการรับฟังและเคารพความเห็นที่แตกต่าง', tier:1},
      {q:'การเปลี่ยนแปลงของวัฒนธรรมตามกาลเวลาเป็นเรื่องอย่างไร?', emoji:'🔄', choices:['เป็นเรื่องปกติ แต่ควรรักษาสิ่งที่ดีงามไว้','เป็นเรื่องผิดที่ต้องหยุดทันที','ไม่เคยเกิดขึ้นเลย','ทำให้วัฒนธรรมหายไปทั้งหมดเสมอ'], correct:0, explain:'วัฒนธรรมปรับตัวตามยุคสมัยได้ แต่คุณค่าที่ดีควรได้รับการสืบทอด', tier:1},
      {q:'ข้อใดคือการมีส่วนร่วมทางประชาธิปไตยของนักเรียน?', emoji:'🧒', choices:['เลือกตั้งประธานนักเรียนและร่วมเสนอความเห็นในห้องเรียน','ไม่สนใจกิจกรรมใดๆ ของโรงเรียน','ให้ครูตัดสินใจแทนทุกเรื่อง','ปล่อยให้เพื่อนทำงานคนเดียว'], correct:0, explain:'การเลือกตั้งและการแสดงความเห็นในโรงเรียนคือการฝึกวิถีประชาธิปไตย', tier:1},
      {q:'กฎหมายยาเสพติดมีขึ้นเพื่ออะไร?', emoji:'🚫', choices:['ปกป้องสุขภาพของประชาชนและความปลอดภัยของสังคม','เพิ่มรายได้ให้ผู้ค้า','จำกัดการเดินทางของประชาชน','ควบคุมราคาสินค้า'], correct:0, explain:'ยาเสพติดทำลายทั้งสุขภาพและความสงบเรียบร้อยของสังคม', tier:1},
      {q:'เหตุใดกฎหมายจึงต้องบังคับใช้กับทุกคนเสมอกัน?', emoji:'⚖️', choices:['เพื่อความยุติธรรมและความเท่าเทียมในสังคม','เพื่อให้จำกฎได้ง่ายขึ้น','เพื่อให้ตำรวจทำงานน้อยลง','เพื่อให้คนรวยได้เปรียบ'], correct:0, explain:'หลักนิติธรรมกำหนดว่าทุกคนอยู่ภายใต้กฎหมายเดียวกัน', tier:2},
      {q:'ถ้าเห็นคนทิ้งขยะลงคลองในชุมชน ควรทำอย่างไร?', emoji:'🗑️', choices:['แจ้งหน่วยงานท้องถิ่นและช่วยกันรณรงค์ไม่ให้ทิ้งขยะ','ทิ้งตามเพราะคนอื่นก็ทำ','ถ่ายคลิปไปล้อเลียนในอินเทอร์เน็ต','เดินหนีโดยไม่ทำอะไรเลย'], correct:0, explain:'การแจ้งหน่วยงานและร่วมรณรงค์เป็นการแก้ปัญหาอย่างสร้างสรรค์', tier:2},
      {q:'"สิทธิ" ต่างจาก "หน้าที่" อย่างไร?', emoji:'📑', choices:['สิทธิคือสิ่งที่เราพึงได้รับ ส่วนหน้าที่คือสิ่งที่เราต้องทำ','สิทธิและหน้าที่คือสิ่งเดียวกัน','สิทธิใช้ได้เฉพาะผู้ใหญ่','หน้าที่มีเฉพาะข้าราชการ'], correct:0, explain:'ทั้งสองอย่างมาคู่กันเสมอในการอยู่ร่วมกันในสังคม', tier:2},
      {q:'องค์กรปกครองส่วนท้องถิ่นรับผิดชอบเรื่องใด?', emoji:'🚰', choices:['ถนน น้ำประปา ขยะ และบริการสาธารณะในพื้นที่','การป้องกันประเทศ','การพิมพ์ธนบัตร','การกำหนดนโยบายต่างประเทศ'], correct:0, explain:'ภารกิจระดับชาติเป็นของรัฐบาลกลาง ส่วนท้องถิ่นดูแลบริการใกล้ตัวประชาชน', tier:2},
      {q:'การใช้สิทธิเลือกตั้งอย่างมีคุณภาพควรทำอย่างไร?', emoji:'🔎', choices:['ศึกษานโยบายและประวัติของผู้สมัครก่อนตัดสินใจ','เลือกตามคนที่ให้ของ','เลือกเพราะชื่อจำง่าย','ไม่ไปใช้สิทธิเลย'], correct:0, explain:'การตัดสินใจบนข้อมูลทำให้ได้ผู้แทนที่ทำงานเพื่อส่วนรวมจริง', tier:2},
      {q:'วัฒนธรรมไทยข้อใดที่ควรธำรงรักษาไว้?', emoji:'🇹🇭', choices:['ความมีน้ำใจ เอื้อเฟื้อ และความกตัญญู','การพูดจาไม่สุภาพ','การทิ้งขยะไม่เป็นที่','การไม่เคารพกติกา'], correct:0, explain:'ค่านิยมที่ดีงามคือสิ่งที่ควรสืบทอดสู่คนรุ่นต่อไป', tier:2},
      {q:'ถ้าเพื่อนชวนทำสิ่งที่ผิดกฎหมาย ควรทำอย่างไร?', emoji:'🛡️', choices:['ปฏิเสธอย่างหนักแน่นและอธิบายเหตุผล','ทำตามเพราะกลัวเสียเพื่อน','ทำแล้วบอกว่าเพื่อนชวน','เงียบไว้แล้วทำตาม'], correct:0, explain:'การปฏิเสธอย่างมีเหตุผลคือการรักษาทั้งตนเองและเพื่อน', tier:2},
      {q:'ข้อใดแสดงถึงการเคารพสิทธิของผู้อื่นในโรงเรียน?', emoji:'🤝', choices:['ไม่หยิบของเพื่อนโดยไม่ขออนุญาต','อ่านสมุดบันทึกส่วนตัวของเพื่อน','แซวเรื่องรูปร่างของเพื่อน','แย่งที่นั่งของคนอื่น'], correct:0, explain:'การขออนุญาตก่อนคือการเคารพสิทธิในทรัพย์สินของผู้อื่น', tier:2},
      {q:'"ประชาธิปไตย" ให้ความสำคัญกับสิ่งใดมากที่สุด?', emoji:'👥', choices:['การมีส่วนร่วมของประชาชนและการเคารพเสียงส่วนใหญ่พร้อมคุ้มครองเสียงส่วนน้อย','การตัดสินใจของคนเพียงคนเดียว','การไม่ต้องมีกฎหมาย','การให้ทุกคนทำตามใจตนเอง'], correct:0, explain:'เสียงข้างมากตัดสิน แต่ต้องไม่ละเมิดสิทธิของเสียงข้างน้อย', tier:2},
      {q:'เหตุใดการเสียภาษีจึงเป็นหน้าที่ของพลเมือง?', emoji:'🧾', choices:['เพราะภาษีเป็นเงินที่รัฐนำไปสร้างบริการสาธารณะให้ทุกคน','เพราะเป็นการลงโทษคนทำงาน','เพราะรัฐบาลนำไปใช้ส่วนตัว','เพราะทำให้สินค้าถูกลง'], correct:0, explain:'ถนน โรงเรียน โรงพยาบาลที่เราใช้ล้วนมาจากเงินภาษี', tier:3},
      {q:'ถ้าชุมชนต้องการสวนสาธารณะแต่งบประมาณมีจำกัด ควรตัดสินใจอย่างไรตามวิถีประชาธิปไตย?', emoji:'🏞️', choices:['จัดประชาคมให้คนในชุมชนร่วมแสดงความเห็นและลงมติ','ให้ผู้ใหญ่บ้านตัดสินใจคนเดียว','ทำตามที่คนเสียงดังที่สุดบอก','ไม่ต้องทำอะไรเลย'], correct:0, explain:'การมีส่วนร่วมทำให้การตัดสินใจสะท้อนความต้องการของส่วนรวมจริง', tier:3},
      {q:'การเปรียบเทียบบทบาทของรัฐบาลกับท้องถิ่นในการแก้ปัญหาน้ำท่วม ควรเป็นอย่างไร?', emoji:'🌊', choices:['ท้องถิ่นดูแลการระบายน้ำในพื้นที่ ส่วนรัฐบาลวางระบบใหญ่ระดับประเทศ','ท้องถิ่นต้องแก้ปัญหาทั้งประเทศเอง','รัฐบาลต้องลงมาลอกท่อทุกซอย','ปล่อยให้ประชาชนแก้กันเอง'], correct:0, explain:'สองระดับทำงานเสริมกัน ท้องถิ่นแก้ใกล้ตัว รัฐบาลวางโครงสร้างใหญ่', tier:3},
      {q:'ข้อใดคือการใช้เสรีภาพในการแสดงความเห็นอย่างถูกต้อง?', emoji:'💬', choices:['วิจารณ์ด้วยเหตุผลโดยไม่ใส่ร้ายหรือดูหมิ่นผู้อื่น','โพสต์ข้อความหยาบคายโจมตีบุคคล','แชร์ข่าวที่ยังไม่ตรวจสอบ','ข่มขู่คนที่เห็นต่าง'], correct:0, explain:'เสรีภาพต้องมาพร้อมความรับผิดชอบและไม่ละเมิดสิทธิผู้อื่น', tier:3},
      {q:'เหตุใดสังคมจึงต้องมีทั้งกฎหมายและจริยธรรม?', emoji:'⚖️', choices:['กฎหมายกำหนดขั้นต่ำที่ต้องทำ ส่วนจริยธรรมทำให้อยู่ร่วมกันอย่างดีงาม','กฎหมายกับจริยธรรมคือสิ่งเดียวกัน','จริยธรรมสำคัญกว่ากฎหมายเสมอ','มีกฎหมายอย่างเดียวก็เพียงพอ'], correct:0, explain:'บางเรื่องกฎหมายไม่ได้บังคับ แต่จริยธรรมทำให้สังคมน่าอยู่ขึ้น', tier:3},
      {q:'การธำรงรักษาวัฒนธรรมไทยในยุคปัจจุบันควรทำอย่างไร?', emoji:'🎎', choices:['เรียนรู้ ปฏิบัติ และเผยแพร่อย่างสร้างสรรค์ให้เข้ากับยุคสมัย','ห้ามรับวัฒนธรรมอื่นโดยเด็ดขาด','เก็บไว้ในพิพิธภัณฑ์อย่างเดียว','เลิกใช้ในชีวิตประจำวัน'], correct:0, explain:'วัฒนธรรมมีชีวิตต่อได้เมื่อคนรุ่นใหม่นำไปใช้และต่อยอดอย่างสร้างสรรค์', tier:3}
    ]
  },
  /* ---------- วิทยาศาสตร์ ป.6 : 5 หมวด ---------- */
  {
    id:'p6-sci1', name:'วิทยาศาสตร์ ป.6 · สารอาหารและระบบย่อยอาหาร', emoji:'🩺', icon:'assets/icons/p6-sci1.svg', color:'#2FA36B', light:'#D9F2E4', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'สารอาหารมีทั้งหมดกี่ประเภท?', emoji:'🍽️', choices:['6 ประเภท','4 ประเภท','5 ประเภท','3 ประเภท'], correct:0, explain:'ได้แก่ คาร์โบไฮเดรต โปรตีน ไขมัน เกลือแร่ วิตามิน และน้ำ', tier:1},
      {q:'สารอาหารใดให้พลังงานแก่ร่างกาย?', emoji:'⚡', choices:['คาร์โบไฮเดรต โปรตีน และไขมัน','วิตามิน เกลือแร่ และน้ำ','น้ำเพียงอย่างเดียว','วิตามินเพียงอย่างเดียว'], correct:0, explain:'สามชนิดแรกให้พลังงาน ส่วนวิตามิน เกลือแร่ และน้ำช่วยให้ร่างกายทำงานปกติ', tier:1},
      {q:'ข้าวและขนมปังให้สารอาหารประเภทใดเป็นหลัก?', emoji:'🍚', choices:['คาร์โบไฮเดรต','โปรตีน','ไขมัน','วิตามิน'], correct:0, explain:'อาหารจำพวกแป้งให้คาร์โบไฮเดรตซึ่งเป็นแหล่งพลังงานหลัก', tier:1},
      {q:'เนื้อสัตว์ ไข่ และถั่วให้สารอาหารประเภทใดเป็นหลัก?', emoji:'🥚', choices:['โปรตีน','คาร์โบไฮเดรต','วิตามิน','น้ำ'], correct:0, explain:'โปรตีนช่วยเสริมสร้างและซ่อมแซมส่วนที่สึกหรอของร่างกาย', tier:1},
      {q:'อวัยวะใดเป็นจุดเริ่มต้นของระบบย่อยอาหาร?', emoji:'👄', choices:['ปาก','กระเพาะอาหาร','ลำไส้เล็ก','ตับ'], correct:0, explain:'ปากบดเคี้ยวอาหารและมีน้ำลายช่วยย่อยแป้งเป็นขั้นแรก', tier:1},
      {q:'อาหารเดินทางจากปากไปยังกระเพาะอาหารผ่านอวัยวะใด?', emoji:'🫗', choices:['หลอดอาหาร','ลำไส้ใหญ่','ตับอ่อน','ทวารหนัก'], correct:0, explain:'หลอดอาหารบีบตัวส่งอาหารลงสู่กระเพาะอาหาร', tier:1},
      {q:'ผักและผลไม้ให้สารอาหารประเภทใดเป็นหลัก?', emoji:'🥦', choices:['วิตามินและเกลือแร่','ไขมัน','คาร์โบไฮเดรตอย่างเดียว','โปรตีนอย่างเดียว'], correct:0, explain:'ผักผลไม้อุดมด้วยวิตามิน เกลือแร่ และใยอาหาร', tier:1},
      {q:'อวัยวะใดทำหน้าที่ดูดซึมสารอาหารเข้าสู่กระแสเลือดเป็นหลัก?', emoji:'🩸', choices:['ลำไส้เล็ก','ลำไส้ใหญ่','หลอดอาหาร','ปาก'], correct:0, explain:'ผนังลำไส้เล็กมีส่วนยื่นเล็กๆ จำนวนมากช่วยดูดซึมสารอาหาร', tier:1},
      {q:'น้ำมีความสำคัญต่อร่างกายอย่างไร?', emoji:'💧', choices:['ช่วยลำเลียงสารอาหารและควบคุมอุณหภูมิร่างกาย','ให้พลังงานมากที่สุด','ช่วยสร้างกล้ามเนื้อโดยตรง','ทำให้ร่างกายสะสมไขมัน'], correct:0, explain:'น้ำเป็นตัวกลางของกระบวนการต่างๆ ในร่างกายแม้จะไม่ให้พลังงาน', tier:1},
      {q:'กระเพาะอาหารทำหน้าที่ย่อยสารอาหารประเภทใดเป็นหลัก?', emoji:'🫙', choices:['โปรตีน','คาร์โบไฮเดรต','วิตามิน','เกลือแร่'], correct:0, explain:'กระเพาะอาหารมีกรดและเอนไซม์ที่ย่อยโปรตีนเป็นหลัก', tier:2},
      {q:'ตับมีบทบาทอย่างไรในการย่อยอาหาร?', emoji:'🫀', choices:['สร้างน้ำดีช่วยให้ไขมันแตกตัวเป็นหยดเล็กๆ','ย่อยโปรตีนโดยตรง','ดูดซึมน้ำกลับ','บดเคี้ยวอาหาร'], correct:0, explain:'น้ำดีจากตับช่วยให้ไขมันแตกตัวจนเอนไซม์ย่อยได้ง่ายขึ้น', tier:2},
      {q:'ลำไส้ใหญ่ทำหน้าที่อะไร?', emoji:'💧', choices:['ดูดน้ำกลับและกำจัดกากอาหาร','ย่อยโปรตีน','สร้างน้ำดี','ดูดซึมสารอาหารทั้งหมด'], correct:0, explain:'ลำไส้ใหญ่ดูดน้ำและแร่ธาตุกลับ แล้วส่งกากอาหารออกทางทวารหนัก', tier:2},
      {q:'ข้อใดคือลำดับการเดินทางของอาหารที่ถูกต้อง?', emoji:'➡️', choices:['ปาก → หลอดอาหาร → กระเพาะอาหาร → ลำไส้เล็ก → ลำไส้ใหญ่','ปาก → กระเพาะอาหาร → หลอดอาหาร → ลำไส้ใหญ่ → ลำไส้เล็ก','ปาก → ลำไส้ใหญ่ → ลำไส้เล็ก → กระเพาะอาหาร','ปาก → ลำไส้เล็ก → หลอดอาหาร → กระเพาะอาหาร'], correct:0, explain:'อาหารเคลื่อนจากบนลงล่างตามทางเดินอาหารตามลำดับนี้', tier:2},
      {q:'น้ำลายในปากช่วยย่อยสารอาหารประเภทใด?', emoji:'👅', choices:['แป้ง (คาร์โบไฮเดรต)','โปรตีน','ไขมัน','วิตามิน'], correct:0, explain:'น้ำลายมีเอนไซม์ที่เริ่มย่อยแป้งตั้งแต่ในปาก', tier:2},
      {q:'การกินอาหารครบ 5 หมู่มีประโยชน์อย่างไร?', emoji:'🍱', choices:['ร่างกายได้รับสารอาหารครบถ้วนตามที่ต้องการ','ทำให้อิ่มนานที่สุด','ทำให้ผอมลงทันที','ทำให้ไม่ต้องดื่มน้ำ'], correct:0, explain:'สารอาหารแต่ละชนิดทำหน้าที่ต่างกัน จึงต้องได้รับให้ครบและสมดุล', tier:2},
      {q:'ใยอาหารจากผักผลไม้มีประโยชน์อย่างไร?', emoji:'🥬', choices:['ช่วยให้ระบบขับถ่ายทำงานได้ดี','ให้พลังงานมากที่สุด','สร้างกล้ามเนื้อโดยตรง','ทำให้ร่างกายสูงขึ้น'], correct:0, explain:'ใยอาหารช่วยเพิ่มกากและกระตุ้นการทำงานของลำไส้', tier:2},
      {q:'การเลือกรับประทานอาหารที่ปลอดภัยควรทำอย่างไร?', emoji:'🔍', choices:['ดูวันหมดอายุ ความสะอาด และปรุงสุกใหม่','เลือกที่มีสีสันสดใสที่สุด','เลือกที่ราคาถูกที่สุดเสมอ','เลือกที่มีรสจัดที่สุด'], correct:0, explain:'ความสะอาดและความสดใหม่สำคัญต่อความปลอดภัยของอาหาร', tier:2},
      {q:'ถ้ากินอาหารที่มีไขมันมากเกินไปเป็นประจำ จะเกิดผลอย่างไร?', emoji:'⚠️', choices:['เสี่ยงต่อโรคอ้วนและโรคหัวใจ','ร่างกายแข็งแรงขึ้นทันที','สูงขึ้นเร็วกว่าปกติ','ไม่มีผลใดๆ ต่อร่างกาย'], correct:0, explain:'ไขมันส่วนเกินสะสมในร่างกายและเพิ่มความเสี่ยงต่อโรค', tier:2},
      {q:'เหตุใดจึงควรเคี้ยวอาหารให้ละเอียดก่อนกลืน?', emoji:'😁', choices:['ช่วยให้ย่อยง่ายขึ้นและลดภาระของกระเพาะอาหาร','ทำให้กินได้มากขึ้น','ทำให้อาหารมีรสหวานขึ้น','ทำให้กินได้เร็วขึ้น'], correct:0, explain:'อาหารชิ้นเล็กมีพื้นที่สัมผัสเอนไซม์มากขึ้น จึงย่อยได้ดีขึ้น', tier:3},
      {q:'นักกีฬาที่ต้องใช้พลังงานมากควรเน้นสารอาหารประเภทใด?', emoji:'🏃', choices:['คาร์โบไฮเดรตเป็นแหล่งพลังงานหลัก พร้อมโปรตีนซ่อมแซมกล้ามเนื้อ','วิตามินเพียงอย่างเดียว','น้ำเพียงอย่างเดียว','เกลือแร่เพียงอย่างเดียว'], correct:0, explain:'พลังงานมาจากคาร์โบไฮเดรต ส่วนโปรตีนช่วยฟื้นฟูกล้ามเนื้อหลังออกกำลัง', tier:3},
      {q:'ถ้าดื่มน้ำน้อยเกินไปจะส่งผลต่อระบบย่อยอาหารอย่างไร?', emoji:'🚱', choices:['กากอาหารแข็งและขับถ่ายลำบาก','ย่อยอาหารได้เร็วขึ้น','ดูดซึมสารอาหารได้มากขึ้น','ไม่มีผลใดๆ'], correct:0, explain:'ลำไส้ใหญ่ต้องดูดน้ำกลับมากขึ้น กากอาหารจึงแห้งและแข็ง', tier:3},
      {q:'เหตุใดสารอาหารต้องถูกย่อยให้เล็กลงก่อนร่างกายจะนำไปใช้?', emoji:'🔬', choices:['เพราะโมเลกุลต้องเล็กพอที่จะซึมผ่านผนังลำไส้เข้าสู่เลือดได้','เพราะจะได้มีรสชาติดีขึ้น','เพราะจะได้เก็บไว้ได้นานขึ้น','เพราะจะได้ไม่ต้องเคี้ยว'], correct:0, explain:'การดูดซึมเกิดได้เมื่อสารอาหารมีขนาดเล็กพอผ่านผนังลำไส้เล็ก', tier:3},
      {q:'อาหารกลางวันชุดใดมีสารอาหารครบถ้วนที่สุด?', emoji:'🍛', choices:['ข้าว + ไข่เจียว + ผัดผัก + ผลไม้ + น้ำเปล่า','ขนมกรุบกรอบ + น้ำอัดลม','ข้าวเปล่าอย่างเดียว','ลูกอม + น้ำหวาน'], correct:0, explain:'ชุดแรกมีทั้งคาร์โบไฮเดรต โปรตีน วิตามิน เกลือแร่ และน้ำ', tier:3},
      {q:'การดูแลระบบย่อยอาหารให้ทำงานปกติควรทำอย่างไร?', emoji:'💚', choices:['กินอาหารตรงเวลา เคี้ยวให้ละเอียด ดื่มน้ำพอ และกินผักผลไม้','อดอาหารบ่อยๆ','กินอาหารรสจัดทุกมื้อ','กินเร็วๆ ให้เสร็จไวที่สุด'], correct:0, explain:'พฤติกรรมการกินที่ดีช่วยให้อวัยวะย่อยอาหารทำงานได้อย่างมีประสิทธิภาพ', tier:3}
    ]
  },
  {
    id:'p6-sci2', name:'วิทยาศาสตร์ ป.6 · การแยกสารและแรงไฟฟ้า', emoji:'🥽', icon:'assets/icons/p6-sci2.svg', color:'#3FA9C9', light:'#D9F0F8', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'ถ้าต้องการแยกตะปูเหล็กออกจากทราย ควรใช้วิธีใด?', emoji:'🧲', choices:['ใช้แม่เหล็กดึงดูด','ใช้กระดาษกรอง','ใช้การรินออก','ใช้การตกตะกอน'], correct:0, explain:'เหล็กเป็นสารแม่เหล็ก จึงใช้แม่เหล็กดูดออกได้ง่ายที่สุด', tier:1},
      {q:'ถ้าต้องการแยกกรวดออกจากทรายละเอียด ควรใช้วิธีใด?', emoji:'🪣', choices:['การร่อนด้วยตะแกรง','การใช้แม่เหล็ก','การต้มให้เดือด','การใช้ไฟฟ้า'], correct:0, explain:'ของแข็งขนาดต่างกันแยกได้ด้วยตะแกรงที่มีรูขนาดเหมาะสม', tier:1},
      {q:'ถ้าต้องการแยกเศษใบไม้ออกจากน้ำ ควรใช้วิธีใด?', emoji:'🍃', choices:['การกรอง','การใช้แม่เหล็ก','การร่อน','การขัดถู'], correct:0, explain:'การกรองแยกของแข็งที่ไม่ละลายออกจากของเหลวได้ดี', tier:1},
      {q:'น้ำโคลนที่ตั้งทิ้งไว้นานๆ จะเกิดอะไรขึ้น?', emoji:'🫙', choices:['ดินตกตะกอนอยู่ก้นภาชนะ','ดินละลายหายไปหมด','น้ำระเหยไปทั้งหมดทันที','ดินลอยขึ้นผิวน้ำ'], correct:0, explain:'อนุภาคที่หนักกว่าน้ำจะค่อยๆ ตกลงสู่ก้นภาชนะ เรียกว่าการตกตะกอน', tier:1},
      {q:'การ "รินออก" เหมาะกับการแยกสารแบบใด?', emoji:'🫗', choices:['ของแข็งที่ตกตะกอนแล้วกับของเหลวใสด้านบน','ของแข็งสองชนิดที่ขนาดเท่ากัน','สารที่ละลายน้ำหมดแล้ว','โลหะกับแม่เหล็ก'], correct:0, explain:'เมื่อตะกอนนอนก้นแล้ว จึงค่อยๆ รินของเหลวใสออกมา', tier:1},
      {q:'แรงไฟฟ้าเกิดขึ้นได้อย่างไร?', emoji:'⚡', choices:['เมื่อวัตถุถูกขัดถูจนเกิดประจุไฟฟ้า','เมื่อวัตถุเปียกน้ำ','เมื่อวัตถุถูกทำให้เย็นลง','เมื่อวัตถุถูกทุบให้แตก'], correct:0, explain:'การขัดถูทำให้ประจุถ่ายเทระหว่างวัตถุ จึงเกิดแรงไฟฟ้า', tier:1},
      {q:'ประจุไฟฟ้าชนิดเดียวกันจะมีผลต่อกันอย่างไร?', emoji:'🔁', choices:['ผลักกัน','ดึงดูดกัน','ไม่มีผลต่อกัน','ระเบิดทันที'], correct:0, explain:'ประจุชนิดเดียวกันผลักกัน ประจุต่างชนิดกันดึงดูดกัน', tier:1},
      {q:'ประจุไฟฟ้าต่างชนิดกันจะมีผลต่อกันอย่างไร?', emoji:'🧲', choices:['ดึงดูดกัน','ผลักกัน','หายไปทั้งคู่','กลายเป็นแม่เหล็กถาวร'], correct:0, explain:'ประจุบวกกับประจุลบดึงดูดเข้าหากัน', tier:1},
      {q:'แรงไฟฟ้าจัดเป็นแรงประเภทใด?', emoji:'✨', choices:['แรงไม่สัมผัส','แรงสัมผัสเท่านั้น','แรงเสียดทาน','แรงพยุง'], correct:0, explain:'แรงไฟฟ้าออกฤทธิ์ได้แม้วัตถุไม่แตะกัน จึงเป็นแรงไม่สัมผัส', tier:1},
      {q:'ลูกโป่งที่ถูกับผมแล้วนำไปจ่อผนัง จะเกิดอะไรขึ้น?', emoji:'🎈', choices:['ลูกโป่งติดผนังเพราะแรงไฟฟ้า','ลูกโป่งแตกทันที','ลูกโป่งลอยขึ้นเพดาน','ไม่มีอะไรเกิดขึ้น'], correct:0, explain:'การขัดถูทำให้ลูกโป่งมีประจุ จึงดึงดูดกับผนังที่มีประจุตรงข้าม', tier:2},
      {q:'ถ้าต้องการแยกเกลือออกจากน้ำเกลือ ควรใช้วิธีใด?', emoji:'☀️', choices:['ระเหยน้ำออกด้วยความร้อนหรือแสงแดด','ใช้กระดาษกรอง','ใช้แม่เหล็กดูด','ใช้ตะแกรงร่อน'], correct:0, explain:'เกลือละลายน้ำจึงกรองไม่ได้ ต้องระเหยน้ำออกเหลือผลึกเกลือ', tier:2},
      {q:'เหตุใดจึงกรองน้ำเกลือแล้วยังได้น้ำเค็มอยู่?', emoji:'🧂', choices:['เพราะเกลือละลายเป็นเนื้อเดียวกับน้ำ กระดาษกรองจึงแยกไม่ได้','เพราะกระดาษกรองบางเกินไป','เพราะน้ำเค็มหนักเกินไป','เพราะเกลือเป็นสารแม่เหล็ก'], correct:0, explain:'การกรองแยกได้เฉพาะของแข็งที่ไม่ละลายเท่านั้น', tier:2},
      {q:'ในการแยกสารผสมระหว่างผงตะไบเหล็กกับผงกำมะถัน ควรใช้วิธีใด?', emoji:'🔩', choices:['ใช้แม่เหล็กดูดผงตะไบเหล็กออก','ใช้ตะแกรงร่อน','ใช้การตกตะกอน','ใช้การรินออก'], correct:0, explain:'เหล็กถูกแม่เหล็กดูด ส่วนกำมะถันไม่ถูกดูด จึงแยกได้', tier:2},
      {q:'การหยิบเปลือกถั่วออกจากเมล็ดถั่วด้วยมือเรียกว่าวิธีใด?', emoji:'🤏', choices:['การหยิบออก','การกรอง','การตกตะกอน','การระเหย'], correct:0, explain:'ใช้กับสารผสมที่มองเห็นและหยิบแยกได้ง่ายด้วยมือ', tier:2},
      {q:'เมื่อถูไม้บรรทัดพลาสติกกับผ้าแล้วนำไปใกล้เศษกระดาษเล็กๆ จะเกิดอะไรขึ้น?', emoji:'📏', choices:['เศษกระดาษถูกดูดขึ้นมาติดไม้บรรทัด','เศษกระดาษกระเด็นออกไปไกล','เศษกระดาษไหม้','ไม่มีอะไรเกิดขึ้น'], correct:0, explain:'ไม้บรรทัดที่มีประจุดึงดูดเศษกระดาษที่เป็นกลางได้', tier:2},
      {q:'เหตุใดในวันที่อากาศชื้นมาก การทดลองไฟฟ้าสถิตจึงเห็นผลไม่ชัด?', emoji:'💧', choices:['เพราะความชื้นทำให้ประจุถ่ายเทออกจากวัตถุได้ง่าย','เพราะอากาศชื้นทำให้วัตถุหนักขึ้น','เพราะความชื้นทำให้เกิดแม่เหล็ก','เพราะอากาศชื้นทำให้วัตถุเย็นลง'], correct:0, explain:'ไอน้ำในอากาศช่วยนำประจุออกไป ทำให้ประจุสะสมบนวัตถุได้น้อย', tier:2},
      {q:'ข้อใดเป็นการใช้ความรู้เรื่องการแยกสารในชีวิตประจำวัน?', emoji:'🏠', choices:['ใช้กระชอนกรองเศษอาหารออกจากน้ำแกง','ใช้ไฟฟ้าแยกน้ำออกจากอากาศ','ใช้แม่เหล็กแยกน้ำตาลออกจากน้ำ','ใช้ตะแกรงแยกเกลือที่ละลายแล้ว'], correct:0, explain:'การกรองด้วยกระชอนคือการแยกของแข็งไม่ละลายออกจากของเหลว', tier:2},
      {q:'การเลือกวิธีแยกสารควรพิจารณาสิ่งใดเป็นหลัก?', emoji:'🤔', choices:['สมบัติของสารแต่ละชนิดในสารผสมนั้น','สีของภาชนะที่ใช้','เวลาที่สะดวก','ราคาของอุปกรณ์เท่านั้น'], correct:0, explain:'ต้องดูว่าสารละลายน้ำหรือไม่ ถูกแม่เหล็กดูดหรือไม่ ขนาดต่างกันหรือไม่', tier:2},
      {q:'มีสารผสมของทราย เกลือ และตะปูเหล็ก ควรแยกด้วยลำดับใดจึงเหมาะสมที่สุด?', emoji:'🧪', choices:['ใช้แม่เหล็กดูดตะปู → เติมน้ำให้เกลือละลาย → กรองทราย → ระเหยน้ำได้เกลือ','เติมน้ำก่อนแล้วใช้แม่เหล็ก','ระเหยน้ำก่อนเป็นอันดับแรก','ร่อนด้วยตะแกรงเพียงอย่างเดียว'], correct:0, explain:'แยกสารแม่เหล็กก่อน แล้วอาศัยการละลายเพื่อแยกเกลือออกจากทราย', tier:3},
      {q:'เหตุใดการขัดถูจึงทำให้เกิดประจุไฟฟ้าบนวัตถุ?', emoji:'⚡', choices:['เพราะประจุลบบางส่วนถ่ายเทจากวัตถุหนึ่งไปยังอีกวัตถุหนึ่ง','เพราะวัตถุร้อนขึ้นจนเกิดไฟ','เพราะวัตถุเปลี่ยนสี','เพราะวัตถุมีน้ำหนักเพิ่มขึ้น'], correct:0, explain:'การถ่ายเทประจุทำให้วัตถุหนึ่งมีประจุบวก อีกวัตถุมีประจุลบ', tier:3},
      {q:'ถ้านำลูกโป่งสองลูกที่ถูกับผมมาแขวนใกล้กัน จะเกิดอะไรขึ้น?', emoji:'🎈', choices:['ลูกโป่งผลักกันออกจากกัน เพราะมีประจุชนิดเดียวกัน','ลูกโป่งดูดติดกันแน่น','ลูกโป่งแตกทั้งสองลูก','ลูกโป่งเปลี่ยนสี'], correct:0, explain:'ทั้งสองลูกได้ประจุชนิดเดียวกันจากการถูกับผม จึงผลักกัน', tier:3},
      {q:'น้ำประปาที่เราใช้ผ่านกระบวนการใดมาก่อน?', emoji:'🚰', choices:['ตกตะกอน กรอง และฆ่าเชื้อ','ใช้แม่เหล็กดูดสิ่งสกปรก','ระเหยแล้วควบแน่นใหม่ทั้งหมด','ร่อนด้วยตะแกรงอย่างเดียว'], correct:0, explain:'โรงกรองน้ำใช้การตกตะกอนและการกรองร่วมกับการฆ่าเชื้อโรค', tier:3},
      {q:'เพราะเหตุใดจึงไม่ควรใช้การกรองเพื่อแยกน้ำตาลออกจากน้ำหวาน?', emoji:'🥤', choices:['เพราะน้ำตาลละลายเป็นเนื้อเดียวกับน้ำแล้ว','เพราะน้ำตาลหนักเกินไป','เพราะน้ำตาลเป็นสารแม่เหล็ก','เพราะกระดาษกรองละลายน้ำ'], correct:0, explain:'สารที่ละลายแล้วต้องใช้การระเหยหรือการตกผลึกจึงจะแยกได้', tier:3},
      {q:'ความรู้เรื่องไฟฟ้าสถิตนำไปใช้ประโยชน์ในข้อใด?', emoji:'🏭', choices:['เครื่องดักฝุ่นไฟฟ้าสถิตในโรงงานและเครื่องพ่นสี','การต้มน้ำให้เดือดเร็วขึ้น','การถนอมอาหารด้วยความเย็น','การวัดความยาวของวัตถุ'], correct:0, explain:'ประจุไฟฟ้าถูกใช้ดึงดูดฝุ่นละอองและทำให้ละอองสีเกาะติดชิ้นงานสม่ำเสมอ', tier:3}
    ]
  },
  {
    id:'p6-sci3', name:'วิทยาศาสตร์ ป.6 · วงจรไฟฟ้าและเงามืดเงามัว', emoji:'🔌', icon:'assets/icons/p6-sci3.svg', color:'#2E86C1', light:'#D6EAF8', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'วงจรไฟฟ้าอย่างง่ายประกอบด้วยส่วนใดบ้าง?', emoji:'🔋', choices:['แหล่งกำเนิดไฟฟ้า สายไฟ และเครื่องใช้ไฟฟ้า','แค่หลอดไฟอย่างเดียว','แค่สายไฟกับสวิตช์','แค่ถ่านไฟฉายอย่างเดียว'], correct:0, explain:'ต้องมีครบทั้งสามส่วนไฟฟ้าจึงจะไหลครบวงจรได้', tier:1},
      {q:'หน้าที่ของถ่านไฟฉายในวงจรไฟฟ้าคืออะไร?', emoji:'🔋', choices:['เป็นแหล่งกำเนิดพลังงานไฟฟ้า','เปลี่ยนไฟฟ้าเป็นแสง','นำไฟฟ้าจากจุดหนึ่งไปอีกจุด','ตัดกระแสไฟฟ้า'], correct:0, explain:'เซลล์ไฟฟ้าหรือถ่านไฟฉายทำหน้าที่จ่ายพลังงานให้วงจร', tier:1},
      {q:'หน้าที่ของสายไฟในวงจรคืออะไร?', emoji:'🔌', choices:['นำกระแสไฟฟ้าจากแหล่งกำเนิดไปยังเครื่องใช้ไฟฟ้า','เปลี่ยนไฟฟ้าเป็นความร้อน','เก็บพลังงานไว้ใช้','สร้างกระแสไฟฟ้า'], correct:0, explain:'สายไฟเป็นตัวนำที่ให้กระแสไฟฟ้าไหลผ่าน', tier:1},
      {q:'ถ้าวงจรไฟฟ้าขาดตอน จะเกิดอะไรขึ้น?', emoji:'💡', choices:['กระแสไฟฟ้าไหลไม่ได้ หลอดไฟจึงไม่สว่าง','หลอดไฟจะสว่างขึ้นกว่าเดิม','ถ่านไฟฉายจะเก็บพลังงานมากขึ้น','สายไฟจะยาวขึ้น'], correct:0, explain:'วงจรต้องครบรอบกระแสไฟฟ้าจึงจะไหลได้', tier:1},
      {q:'เงามืดเกิดขึ้นเมื่อใด?', emoji:'🌑', choices:['เมื่อไม่มีแสงตกลงบนบริเวณนั้นเลย','เมื่อมีแสงตกลงเต็มที่','เมื่อวัตถุโปร่งใส','เมื่อไม่มีวัตถุมากั้นแสง'], correct:0, explain:'วัตถุทึบแสงกั้นแสงจนเกิดบริเวณที่ไม่มีแสงตกถึงเลย', tier:1},
      {q:'เงามัวคือบริเวณแบบใด?', emoji:'🌗', choices:['บริเวณที่มีแสงตกลงเพียงบางส่วน','บริเวณที่ไม่มีแสงเลย','บริเวณที่สว่างที่สุด','บริเวณที่ไม่มีวัตถุกั้น'], correct:0, explain:'เงามัวเป็นบริเวณกึ่งกลางที่ได้รับแสงบางส่วนจากแหล่งกำเนิดแสง', tier:1},
      {q:'วัตถุแบบใดทำให้เกิดเงาได้ชัดที่สุด?', emoji:'⬛', choices:['วัตถุทึบแสง','วัตถุโปร่งใส','วัตถุโปร่งแสง','อากาศ'], correct:0, explain:'วัตถุทึบแสงกั้นแสงได้ทั้งหมด จึงเกิดเงาชัดเจน', tier:1},
      {q:'ในบ้านเรือนทั่วไป หลอดไฟถูกต่อแบบใด?', emoji:'🏠', choices:['แบบขนาน','แบบอนุกรมทั้งหมด','ต่อสลับกันไปมา','ไม่ได้ต่อกับวงจรใดเลย'], correct:0, explain:'ต่อแบบขนานทำให้ปิด-เปิดแต่ละดวงได้อิสระ ดวงอื่นยังสว่างอยู่', tier:1},
      {q:'สวิตช์ไฟทำหน้าที่อะไรในวงจร?', emoji:'🔘', choices:['เปิด-ปิดทางเดินของกระแสไฟฟ้า','สร้างกระแสไฟฟ้า','เปลี่ยนไฟฟ้าเป็นแสง','เก็บพลังงานไว้'], correct:0, explain:'สวิตช์ทำให้วงจรครบรอบหรือขาดตอนตามที่เราต้องการ', tier:1},
      {q:'ถ้าต่อหลอดไฟแบบอนุกรม 3 ดวง แล้วถอดออก 1 ดวง จะเกิดอะไรขึ้น?', emoji:'💡', choices:['หลอดที่เหลือดับหมด เพราะวงจรขาด','หลอดที่เหลือสว่างขึ้นกว่าเดิม','หลอดที่เหลือสว่างเท่าเดิม','หลอดที่ถอดออกยังสว่างอยู่'], correct:0, explain:'วงจรอนุกรมมีทางเดินไฟทางเดียว ถอดดวงใดดวงหนึ่งวงจรจึงขาด', tier:2},
      {q:'ถ้าต่อหลอดไฟแบบขนาน 3 ดวง แล้วถอดออก 1 ดวง จะเกิดอะไรขึ้น?', emoji:'💡', choices:['หลอดที่เหลือยังสว่างอยู่','หลอดที่เหลือดับหมด','หลอดที่เหลือสว่างสลับกัน','วงจรจะไหม้'], correct:0, explain:'วงจรขนานมีทางเดินไฟหลายทาง ดวงอื่นจึงยังครบวงจร', tier:2},
      {q:'การต่อเซลล์ไฟฟ้าแบบอนุกรมหลายก้อนมีผลอย่างไร?', emoji:'🔋', choices:['ได้แรงดันไฟฟ้ารวมสูงขึ้น หลอดไฟจึงสว่างขึ้น','ทำให้ไฟดับ','ทำให้ถ่านใช้ได้นานขึ้นเป็นสองเท่า','ไม่มีผลต่อความสว่าง'], correct:0, explain:'ถ่านที่ต่ออนุกรมจะรวมแรงดันกัน ไฟฉายจึงสว่างกว่าใช้ถ่านก้อนเดียว', tier:2},
      {q:'ไฟฉายใช้หลักการต่อเซลล์ไฟฟ้าแบบใด?', emoji:'🔦', choices:['แบบอนุกรมเพื่อเพิ่มแรงดันไฟฟ้า','แบบขนานเพื่อลดแรงดัน','ไม่ได้ต่อกันเลย','ต่อสลับขั้วทุกก้อน'], correct:0, explain:'ถ่านในไฟฉายวางเรียงต่อกันแบบอนุกรมเพื่อให้ได้แรงดันมากพอ', tier:2},
      {q:'ถ้าเลื่อนวัตถุเข้าใกล้แหล่งกำเนิดแสงมากขึ้น เงาที่เกิดบนฉากจะเป็นอย่างไร?', emoji:'🔦', choices:['เงามีขนาดใหญ่ขึ้น','เงาเล็กลง','เงาหายไป','เงาเปลี่ยนเป็นสีขาว'], correct:0, explain:'ยิ่งวัตถุใกล้แหล่งกำเนิดแสง เงาบนฉากยิ่งขยายใหญ่ขึ้น', tier:2},
      {q:'เหตุใดจึงเกิดทั้งเงามืดและเงามัวพร้อมกันได้?', emoji:'🌗', choices:['เพราะแหล่งกำเนิดแสงมีขนาดใหญ่ ไม่ใช่จุดเล็กจุดเดียว','เพราะวัตถุโปร่งใส','เพราะฉากรับเงาเป็นสีขาว','เพราะแสงเดินทางเป็นเส้นโค้ง'], correct:0, explain:'แหล่งกำเนิดแสงที่มีขนาดทำให้บางบริเวณได้รับแสงเพียงบางส่วน จึงเป็นเงามัว', tier:2},
      {q:'แผนภาพรังสีของแสงแสดงสิ่งใด?', emoji:'📐', choices:['ทิศทางการเดินทางของแสงเป็นเส้นตรงจากแหล่งกำเนิด','ความร้อนของแสง','สีของแสง','เสียงที่เกิดจากแสง'], correct:0, explain:'แสงเดินทางเป็นเส้นตรง จึงเขียนเป็นเส้นรังสีบอกทิศทางได้', tier:2},
      {q:'ข้อดีของการต่อหลอดไฟแบบขนานในบ้านคืออะไร?', emoji:'🏡', choices:['ควบคุมเปิด-ปิดแต่ละดวงได้อิสระ ดวงหนึ่งเสียดวงอื่นยังใช้ได้','ประหยัดสายไฟมากที่สุด','ทำให้ไฟสว่างน้อยลง','ทำให้ต้องเปลี่ยนหลอดพร้อมกันทุกดวง'], correct:0, explain:'ความเป็นอิสระของแต่ละดวงคือข้อได้เปรียบหลักของวงจรขนาน', tier:2},
      {q:'ข้อจำกัดของวงจรอนุกรมคืออะไร?', emoji:'⚠️', choices:['ถ้าจุดใดจุดหนึ่งขาด อุปกรณ์ทั้งหมดจะหยุดทำงาน','ใช้สายไฟมากเกินไป','ควบคุมแต่ละดวงแยกกันได้','ทำให้ไฟบ้านสว่างเกินไป'], correct:0, explain:'ทางเดินไฟมีทางเดียว จุดขาดจุดเดียวจึงทำให้ทั้งวงจรหยุดทำงาน', tier:2},
      {q:'ไฟประดับต้นคริสต์มาสแบบเก่าที่ดับทั้งเส้นเมื่อหลอดเดียวขาด ต่อแบบใด?', emoji:'🎄', choices:['แบบอนุกรม','แบบขนาน','แบบผสม','ไม่ได้ต่อเป็นวงจร'], correct:0, explain:'อาการดับทั้งเส้นเป็นลักษณะเฉพาะของวงจรอนุกรม', tier:3},
      {q:'ถ้าต้องการให้หลอดไฟสว่างขึ้นโดยใช้อุปกรณ์เดิม ควรทำอย่างไร?', emoji:'🔆', choices:['ต่อเซลล์ไฟฟ้าเพิ่มแบบอนุกรม','ถอดสายไฟออกหนึ่งเส้น','ต่อหลอดไฟเพิ่มแบบอนุกรม','ใช้สายไฟที่สั้นที่สุดเท่านั้น'], correct:0, explain:'การเพิ่มแรงดันด้วยการต่อถ่านอนุกรมทำให้กระแสไหลมากขึ้นและหลอดสว่างขึ้น', tier:3},
      {q:'ในการเกิดสุริยุปราคา ผู้ที่อยู่ในบริเวณเงามืดของดวงจันทร์จะเห็นอะไร?', emoji:'🌑', choices:['สุริยุปราคาเต็มดวง','สุริยุปราคาบางส่วน','ไม่เห็นอะไรผิดปกติ','จันทรุปราคา'], correct:0, explain:'เงามืดคือบริเวณที่ดวงอาทิตย์ถูกบังทั้งดวง จึงเห็นเป็นคราสเต็มดวง', tier:3},
      {q:'เหตุใดเงาในตอนเที่ยงวันจึงสั้นกว่าเงาในตอนเย็น?', emoji:'☀️', choices:['เพราะดวงอาทิตย์อยู่สูงเกือบตรงศีรษะ แสงจึงตกเกือบตั้งฉาก','เพราะตอนเที่ยงแสงอ่อนกว่า','เพราะตอนเย็นวัตถุสูงขึ้น','เพราะตอนเที่ยงไม่มีเงาเลย'], correct:0, explain:'มุมของแสงที่ตกกระทบเป็นตัวกำหนดความยาวของเงา', tier:3},
      {q:'ถ้าต่อหลอดไฟ 2 ดวงแบบขนานกับถ่าน 1 ก้อน เทียบกับต่อแบบอนุกรม ผลต่างคืออะไร?', emoji:'⚖️', choices:['แบบขนานหลอดจะสว่างกว่าแบบอนุกรม','แบบอนุกรมสว่างกว่าเสมอ','สว่างเท่ากันทั้งสองแบบ','แบบขนานจะไม่ติดเลย'], correct:0, explain:'ในวงจรขนานแต่ละหลอดได้รับแรงดันเต็มจากถ่าน จึงสว่างกว่าแบบอนุกรมที่ต้องแบ่งแรงดันกัน', tier:3},
      {q:'ความรู้เรื่องวงจรไฟฟ้านำไปใช้ในชีวิตประจำวันอย่างไร?', emoji:'🏠', choices:['ช่วยให้เข้าใจการใช้ไฟอย่างปลอดภัยและแก้ปัญหาเบื้องต้นได้','ช่วยให้คำนวณเลขได้เร็วขึ้น','ช่วยให้ปลูกต้นไม้ได้ดีขึ้น','ช่วยให้อ่านแผนที่ได้แม่นขึ้น'], correct:0, explain:'เข้าใจวงจรทำให้รู้ว่าทำไมไฟดับ ควรปิดสวิตช์เมื่อใด และใช้ไฟอย่างปลอดภัย', tier:3}
    ]
  },
  {
    id:'p6-sci4', name:'วิทยาศาสตร์ ป.6 · อุปราคาและเทคโนโลยีอวกาศ', emoji:'🛰️', icon:'assets/icons/p6-sci4.svg', color:'#1F8FA3', light:'#D9F0F8', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'สุริยุปราคาเกิดขึ้นเมื่อใด?', emoji:'🌑', choices:['เมื่อดวงจันทร์เคลื่อนมาบังดวงอาทิตย์','เมื่อโลกบังดวงจันทร์','เมื่อดวงอาทิตย์ดับลง','เมื่อดวงจันทร์หายไป'], correct:0, explain:'ดวงจันทร์อยู่ระหว่างดวงอาทิตย์กับโลก จึงบังแสงอาทิตย์', tier:1},
      {q:'จันทรุปราคาเกิดขึ้นเมื่อใด?', emoji:'🌕', choices:['เมื่อดวงจันทร์เคลื่อนเข้าไปในเงาของโลก','เมื่อดวงจันทร์บังดวงอาทิตย์','เมื่อดวงจันทร์ชนกับโลก','เมื่อดวงอาทิตย์เข้าไปในเงาโลก'], correct:0, explain:'โลกอยู่ระหว่างดวงอาทิตย์กับดวงจันทร์ เงาโลกจึงทาบลงบนดวงจันทร์', tier:1},
      {q:'ในการเกิดสุริยุปราคา วัตถุใดอยู่ตรงกลาง?', emoji:'🌚', choices:['ดวงจันทร์','โลก','ดวงอาทิตย์','ดาวอังคาร'], correct:0, explain:'เรียงเป็น ดวงอาทิตย์ – ดวงจันทร์ – โลก', tier:1},
      {q:'ในการเกิดจันทรุปราคา วัตถุใดอยู่ตรงกลาง?', emoji:'🌍', choices:['โลก','ดวงจันทร์','ดวงอาทิตย์','ดาวศุกร์'], correct:0, explain:'เรียงเป็น ดวงอาทิตย์ – โลก – ดวงจันทร์', tier:1},
      {q:'ดาวเทียมสื่อสารมีประโยชน์อย่างไร?', emoji:'📡', choices:['ส่งสัญญาณโทรทัศน์ โทรศัพท์ และอินเทอร์เน็ตข้ามระยะไกล','ใช้วัดน้ำหนักของวัตถุ','ใช้ผลิตอาหาร','ใช้ขุดแร่ใต้ดิน'], correct:0, explain:'ดาวเทียมสื่อสารทำให้ติดต่อกันได้ทั่วโลกอย่างรวดเร็ว', tier:1},
      {q:'ดาวเทียมอุตุนิยมวิทยาใช้ทำอะไร?', emoji:'🌦️', choices:['ติดตามเมฆและพยากรณ์อากาศ','ถ่ายภาพใต้ทะเลลึก','วัดความแข็งของหิน','นับจำนวนประชากร'], correct:0, explain:'ภาพจากดาวเทียมช่วยให้เห็นการเคลื่อนตัวของเมฆและพายุล่วงหน้า', tier:1},
      {q:'สุริยุปราคามีกี่ชนิดหลักๆ?', emoji:'🔆', choices:['เต็มดวง บางส่วน และวงแหวน','เต็มดวงอย่างเดียว','สองชนิดคือเช้ากับเย็น','ไม่มีการแบ่งชนิด'], correct:0, explain:'ขึ้นอยู่กับตำแหน่งผู้สังเกตและระยะห่างของดวงจันทร์', tier:1},
      {q:'เหตุใดจึงห้ามมองดวงอาทิตย์ด้วยตาเปล่าขณะเกิดสุริยุปราคา?', emoji:'🕶️', choices:['เพราะแสงจ้าทำลายจอตาจนตาบอดได้','เพราะจะทำให้ตัวร้อนขึ้น','เพราะจะมองไม่เห็นอะไรเลย','เพราะจะทำให้ง่วงนอน'], correct:0, explain:'ต้องใช้แว่นกรองแสงเฉพาะสำหรับดูดวงอาทิตย์เท่านั้น', tier:1},
      {q:'เทคโนโลยีอวกาศถูกนำมาใช้ในชีวิตประจำวันอย่างไร?', emoji:'⌚', choices:['อุปกรณ์วัดชีพจร หมวกนิรภัย และวัสดุน้ำหนักเบา','การปลูกข้าวในนา','การเลี้ยงปลาในบ่อ','การทอผ้าด้วยมือ'], correct:0, explain:'เทคโนโลยีที่พัฒนาเพื่ออวกาศถูกต่อยอดมาใช้กับสินค้าในชีวิตประจำวัน', tier:1},
      {q:'เหตุใดสุริยุปราคาจึงไม่เกิดขึ้นทุกเดือน ทั้งที่ดวงจันทร์โคจรรอบโลกทุกเดือน?', emoji:'🌘', choices:['เพราะระนาบวงโคจรของดวงจันทร์เอียงเล็กน้อย ไม่ได้อยู่แนวเดียวกันทุกครั้ง','เพราะดวงจันทร์หยุดโคจรบางเดือน','เพราะโลกหมุนเร็วเกินไป','เพราะดวงอาทิตย์เปลี่ยนตำแหน่ง'], correct:0, explain:'ทั้งสามดวงต้องเรียงเกือบเป็นเส้นตรงพอดีจึงจะเกิดคราสได้', tier:2},
      {q:'จันทรุปราคาเต็มดวงมักทำให้ดวงจันทร์มีสีใด?', emoji:'🔴', choices:['สีแดงอิฐ','สีเขียว','สีฟ้าสด','สีขาวจ้ากว่าเดิม'], correct:0, explain:'แสงอาทิตย์หักเหผ่านบรรยากาศโลก ทำให้ดวงจันทร์ปรากฏเป็นสีแดง', tier:2},
      {q:'จันทรุปราคาสามารถมองด้วยตาเปล่าได้หรือไม่?', emoji:'👀', choices:['ได้ เพราะเป็นแสงสะท้อนที่ไม่จ้าเหมือนดวงอาทิตย์','ไม่ได้เด็ดขาด','ได้เฉพาะตอนกลางวัน','ได้เฉพาะเมื่อใช้กล้องโทรทรรศน์'], correct:0, explain:'จันทรุปราคาปลอดภัยต่อสายตา ต่างจากสุริยุปราคา', tier:2},
      {q:'ดาวเทียมสำรวจทรัพยากรมีประโยชน์อย่างไร?', emoji:'🗺️', choices:['ติดตามการใช้ที่ดิน ป่าไม้ และแหล่งน้ำจากมุมสูง','ใช้ส่งจดหมายถึงกัน','ใช้ผลิตกระแสไฟฟ้าให้บ้านเรือน','ใช้เป็นยานพาหนะโดยสาร'], correct:0, explain:'ภาพจากดาวเทียมช่วยวางแผนจัดการทรัพยากรของประเทศ', tier:2},
      {q:'กล้องโทรทรรศน์มีประโยชน์ทางดาราศาสตร์อย่างไร?', emoji:'🔭', choices:['ช่วยให้มองเห็นวัตถุท้องฟ้าที่อยู่ไกลได้ชัดขึ้น','ทำให้ดาวเข้ามาใกล้โลก','ทำให้กลางคืนสว่างขึ้น','ใช้วัดน้ำหนักของดาว'], correct:0, explain:'กล้องโทรทรรศน์รวมแสงจากวัตถุไกลทำให้เห็นรายละเอียดมากขึ้น', tier:2},
      {q:'เหตุใดนักบินอวกาศจึงต้องสวมชุดพิเศษเมื่อออกนอกยาน?', emoji:'👨‍🚀', choices:['เพราะในอวกาศไม่มีอากาศหายใจและมีอุณหภูมิรุนแรง','เพราะในอวกาศมีลมแรงมาก','เพราะในอวกาศมีฝนตก','เพราะต้องการให้ดูสวยงาม'], correct:0, explain:'ชุดอวกาศให้ออกซิเจน ควบคุมอุณหภูมิ และป้องกันรังสี', tier:2},
      {q:'ข้อใดคือความแตกต่างสำคัญระหว่างสุริยุปราคากับจันทรุปราคา?', emoji:'⚖️', choices:['สุริยุปราคาดวงจันทร์บังดวงอาทิตย์ ส่วนจันทรุปราคาโลกบังแสงที่ส่องดวงจันทร์','ทั้งสองอย่างเหมือนกันทุกประการ','สุริยุปราคาเกิดตอนกลางคืน','จันทรุปราคาเกิดตอนกลางวันเสมอ'], correct:0, explain:'ต่างกันที่ว่าอะไรอยู่ตรงกลางและใครถูกบัง', tier:2},
      {q:'สุริยุปราคาวงแหวนเกิดขึ้นเพราะเหตุใด?', emoji:'💍', choices:['ดวงจันทร์อยู่ไกลโลกจึงบังดวงอาทิตย์ไม่มิด เหลือขอบสว่างเป็นวงแหวน','ดวงอาทิตย์ขยายใหญ่ขึ้น','โลกเอียงมากผิดปกติ','ดวงจันทร์แตกออกเป็นวง'], correct:0, explain:'เมื่อดวงจันทร์อยู่ไกล ขนาดปรากฏจะเล็กกว่าดวงอาทิตย์เล็กน้อย', tier:2},
      {q:'ดาวเทียมโคจรรอบโลกอยู่ได้เพราะอะไร?', emoji:'🛰️', choices:['ความเร็วของดาวเทียมสมดุลกับแรงโน้มถ่วงของโลก','ดาวเทียมเบามากจึงลอยได้','มีเชือกยึดไว้กับโลก','ในอวกาศไม่มีแรงใดๆ เลย'], correct:0, explain:'ดาวเทียมตกลงสู่โลกตลอดเวลาแต่เคลื่อนที่ไปข้างหน้าเร็วพอจนโคจรวนรอบโลกได้', tier:3},
      {q:'ถ้าอยู่ในบริเวณเงามัวของดวงจันทร์ขณะเกิดสุริยุปราคา จะเห็นปรากฏการณ์แบบใด?', emoji:'🌒', choices:['สุริยุปราคาบางส่วน','สุริยุปราคาเต็มดวง','จันทรุปราคา','ไม่เห็นอะไรเลย'], correct:0, explain:'เงามัวคือบริเวณที่ดวงอาทิตย์ถูกบังเพียงบางส่วน', tier:3},
      {q:'เหตุใดภาพถ่ายจากดาวเทียมจึงช่วยเตือนภัยพิบัติได้?', emoji:'🌀', choices:['เห็นการก่อตัวและเส้นทางของพายุล่วงหน้าจากมุมสูง','ทำให้พายุอ่อนกำลังลง','ทำให้ฝนหยุดตก','ทำให้แผ่นดินไหวหายไป'], correct:0, explain:'การเฝ้าติดตามจากอวกาศทำให้แจ้งเตือนประชาชนได้ทันเวลา', tier:3},
      {q:'ความรู้เรื่องอุปราคาแสดงให้เห็นว่าแสงมีสมบัติอย่างไร?', emoji:'📏', choices:['แสงเดินทางเป็นเส้นตรง จึงเกิดเงาเมื่อมีวัตถุมากั้น','แสงเดินทางเป็นเส้นโค้งเสมอ','แสงเดินทางได้เฉพาะในน้ำ','แสงไม่ทำให้เกิดเงา'], correct:0, explain:'การเกิดคราสเป็นตัวอย่างชัดเจนของการเดินทางเป็นเส้นตรงของแสง', tier:3},
      {q:'เหตุใดจึงกล่าวว่าเทคโนโลยีอวกาศให้ประโยชน์เกินกว่าการสำรวจดวงดาว?', emoji:'💡', choices:['เพราะวัสดุและอุปกรณ์ที่พัฒนาขึ้นถูกนำมาใช้ในการแพทย์ กีฬา และชีวิตประจำวัน','เพราะทำให้ค่าไฟถูกลง','เพราะทำให้อากาศเย็นลง','เพราะทำให้ดวงดาวสว่างขึ้น'], correct:0, explain:'เช่น วัสดุกันกระแทก อุปกรณ์ตรวจวัดสุขภาพ และระบบกรองน้ำ', tier:3},
      {q:'ถ้าต้องการดูสุริยุปราคาอย่างปลอดภัย ควรทำอย่างไร?', emoji:'🕶️', choices:['ใช้แว่นกรองแสงสำหรับดูดวงอาทิตย์โดยเฉพาะ หรือดูภาพฉายผ่านรูเข็ม','ใช้แว่นกันแดดธรรมดา','มองผ่านฟิล์มเอกซเรย์','มองด้วยตาเปล่าช่วงสั้นๆ'], correct:0, explain:'อุปกรณ์ทั่วไปกรองรังสีอันตรายไม่ได้ ต้องใช้แว่นที่ผลิตมาเพื่อการนี้เท่านั้น', tier:3}
    ]
  },
  {
    id:'p6-sci5', name:'วิทยาศาสตร์ ป.6 · หิน ลมมรสุม และภัยธรรมชาติ', emoji:'🏔️', icon:'assets/icons/p6-sci5.svg', color:'#8E6E3C', light:'#F3EADA', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'หินอัคนีเกิดจากอะไร?', emoji:'🌋', choices:['หินหนืดหรือลาวาเย็นตัวและแข็งตัว','การทับถมของตะกอน','ความร้อนและความดันที่เปลี่ยนหินเดิม','การกัดเซาะของน้ำ'], correct:0, explain:'อัคนีแปลว่าไฟ หินชนิดนี้จึงเกิดจากหินหลอมเหลวที่เย็นตัวลง', tier:1},
      {q:'หินตะกอนเกิดจากอะไร?', emoji:'🏜️', choices:['การทับถมและอัดแน่นของตะกอนเป็นเวลานาน','ลาวาเย็นตัว','ความดันสูงใต้เปลือกโลกเท่านั้น','การระเบิดของภูเขาไฟ'], correct:0, explain:'เศษหิน ทราย และซากสิ่งมีชีวิตทับถมกันจนกลายเป็นหินตะกอน', tier:1},
      {q:'หินแปรเกิดจากอะไร?', emoji:'🪨', choices:['หินเดิมถูกความร้อนและความดันสูงจนเปลี่ยนลักษณะ','ลาวาไหลออกมาเย็นตัว','ตะกอนทับถมกันในทะเล','น้ำกัดเซาะภูเขา'], correct:0, explain:'หินแปรคือหินที่ "แปรสภาพ" จากหินเดิมด้วยความร้อนและความดัน', tier:1},
      {q:'ซากดึกดำบรรพ์ (ฟอสซิล) คืออะไร?', emoji:'🦕', choices:['ร่องรอยหรือซากของสิ่งมีชีวิตในอดีตที่ถูกเก็บรักษาไว้ในหิน','ก้อนหินที่มีรูปร่างแปลก','แร่ธาตุที่มีสีสวยงาม','ดินที่มีอายุมาก'], correct:0, explain:'ฟอสซิลช่วยให้เราคาดคะเนสภาพแวดล้อมในอดีตได้', tier:1},
      {q:'ลมบกเกิดขึ้นในช่วงเวลาใด?', emoji:'🌃', choices:['กลางคืน เมื่อพื้นดินเย็นเร็วกว่าน้ำทะเล','กลางวันที่แดดจัด','ตอนเที่ยงวันพอดี','เฉพาะฤดูหนาว'], correct:0, explain:'กลางคืนพื้นดินเย็นกว่าน้ำ อากาศจึงเคลื่อนจากบกออกสู่ทะเล', tier:1},
      {q:'ลมทะเลเกิดขึ้นในช่วงเวลาใด?', emoji:'🏖️', choices:['กลางวัน เมื่อพื้นดินร้อนเร็วกว่าน้ำทะเล','กลางดึกเท่านั้น','เฉพาะเวลาฝนตก','เฉพาะฤดูหนาว'], correct:0, explain:'กลางวันพื้นดินร้อนกว่า อากาศจึงเคลื่อนจากทะเลเข้าสู่ฝั่ง', tier:1},
      {q:'ประเทศไทยมีกี่ฤดูตามอิทธิพลของลมมรสุม?', emoji:'🗓️', choices:['3 ฤดู','2 ฤดู','4 ฤดู','5 ฤดู'], correct:0, explain:'ไทยมีฤดูร้อน ฤดูฝน และฤดูหนาว ตามการเปลี่ยนของลมมรสุม', tier:1},
      {q:'ปรากฏการณ์เรือนกระจกคืออะไร?', emoji:'🌡️', choices:['แก๊สในบรรยากาศกักเก็บความร้อนไว้ทำให้โลกอุ่นขึ้น','การที่โลกเย็นลงเรื่อยๆ','การที่ฝนตกหนักผิดปกติ','การที่แผ่นดินไหวบ่อยขึ้น'], correct:0, explain:'แก๊สเรือนกระจกทำหน้าที่คล้ายกระจกที่กักความร้อนไว้ในเรือนเพาะชำ', tier:1},
      {q:'เมื่อรู้สึกถึงแผ่นดินไหวขณะอยู่ในอาคาร ควรทำอย่างไร?', emoji:'⚠️', choices:['หมอบลง หาที่กำบังใต้โต๊ะแข็งแรง และยึดจับไว้','วิ่งขึ้นชั้นบนสุดทันที','ยืนใกล้หน้าต่างกระจก','ใช้ลิฟต์ลงมาให้เร็วที่สุด'], correct:0, explain:'หลัก "หมอบ ป้อง เกาะ" ช่วยป้องกันของหล่นใส่ระหว่างแผ่นดินไหว', tier:1},
      {q:'วัฏจักรหินหมายถึงอะไร?', emoji:'🔄', choices:['การเปลี่ยนแปลงหมุนเวียนระหว่างหินอัคนี หินตะกอน และหินแปร','การที่หินเคลื่อนที่ไปมาบนพื้นโลก','การนำหินไปใช้ก่อสร้าง','การที่หินมีสีเปลี่ยนไปตามฤดู'], correct:0, explain:'หินชนิดหนึ่งสามารถเปลี่ยนเป็นอีกชนิดได้ด้วยกระบวนการทางธรณีวิทยา', tier:2},
      {q:'มรสุมตะวันตกเฉียงใต้ทำให้ประเทศไทยเกิดฤดูใด?', emoji:'🌧️', choices:['ฤดูฝน','ฤดูหนาว','ฤดูร้อน','ฤดูใบไม้ร่วง'], correct:0, explain:'ลมพัดจากมหาสมุทรอินเดียนำความชื้นเข้าสู่ประเทศไทย', tier:2},
      {q:'มรสุมตะวันออกเฉียงเหนือทำให้ประเทศไทยเกิดฤดูใด?', emoji:'❄️', choices:['ฤดูหนาว','ฤดูฝน','ฤดูร้อน','ฤดูใบไม้ผลิ'], correct:0, explain:'ลมหนาวและแห้งจากประเทศจีนพัดลงมาปกคลุมประเทศไทย', tier:2},
      {q:'การพบซากดึกดำบรรพ์ของหอยทะเลบนภูเขาบอกอะไรเรา?', emoji:'🐚', choices:['บริเวณนั้นเคยเป็นทะเลมาก่อน','หอยเดินขึ้นไปบนภูเขา','มีคนนำหอยไปวางไว้','ภูเขาสร้างหอยขึ้นมาเอง'], correct:0, explain:'ฟอสซิลบอกสภาพแวดล้อมในอดีตของพื้นที่นั้น', tier:2},
      {q:'หินปูนถูกนำไปใช้ประโยชน์ในด้านใดมากที่สุด?', emoji:'🏗️', choices:['ผลิตปูนซีเมนต์สำหรับงานก่อสร้าง','ทำเครื่องประดับราคาแพง','ใช้เป็นเชื้อเพลิงรถยนต์','ใช้ทำเสื้อผ้า'], correct:0, explain:'หินปูนเป็นวัตถุดิบหลักของอุตสาหกรรมปูนซีเมนต์', tier:2},
      {q:'ดินถล่มมักเกิดในบริเวณใด?', emoji:'⛰️', choices:['พื้นที่ลาดชันที่ป่าถูกทำลายและมีฝนตกหนัก','ที่ราบลุ่มริมทะเล','ทะเลทรายแห้งแล้ง','กลางมหาสมุทร'], correct:0, explain:'ไม่มีรากไม้ยึดดินบนที่ลาดชัน เมื่อดินอุ้มน้ำมากจึงไถลลงมา', tier:2},
      {q:'สึนามิมีสาเหตุหลักจากอะไร?', emoji:'🌊', choices:['แผ่นดินไหวใต้ทะเลที่ทำให้น้ำทะเลเคลื่อนตัวรุนแรง','ฝนตกหนักติดต่อกันหลายวัน','ลมมรสุมพัดแรง','น้ำแข็งขั้วโลกละลาย'], correct:0, explain:'การยกตัวของพื้นทะเลจากแผ่นดินไหวผลักมวลน้ำมหาศาลจนเกิดคลื่นยักษ์', tier:2},
      {q:'แก๊สชนิดใดเป็นแก๊สเรือนกระจกที่สำคัญที่สุดจากกิจกรรมของมนุษย์?', emoji:'🏭', choices:['คาร์บอนไดออกไซด์','ออกซิเจน','ไนโตรเจน','ฮีเลียม'], correct:0, explain:'การเผาเชื้อเพลิงฟอสซิลปล่อยคาร์บอนไดออกไซด์ออกมาจำนวนมาก', tier:2},
      {q:'การกัดเซาะชายฝั่งส่งผลกระทบอย่างไร?', emoji:'🏝️', choices:['พื้นที่ชายฝั่งหายไปและบ้านเรือนริมทะเลเสียหาย','ชายหาดกว้างขึ้น','น้ำทะเลสะอาดขึ้น','ปลาเพิ่มจำนวนมากขึ้น'], correct:0, explain:'แผ่นดินริมทะเลถูกคลื่นพัดพาไป ทำให้ที่อยู่อาศัยและถนนเสียหาย', tier:2},
      {q:'เหตุใดช่วงเปลี่ยนมรสุมจึงเป็นฤดูร้อนของประเทศไทย?', emoji:'☀️', choices:['เพราะลมมรสุมอ่อนกำลังลง แดดจึงแผดเผาพื้นดินได้เต็มที่','เพราะดวงอาทิตย์เข้าใกล้โลกมากที่สุด','เพราะโลกหยุดหมุนชั่วคราว','เพราะฝนตกหนักที่สุด'], correct:0, explain:'ช่วงรอยต่อระหว่างมรสุมทั้งสอง ลมอ่อนและความชื้นน้อย อุณหภูมิจึงสูงขึ้น', tier:3},
      {q:'ถ้าหินแปรถูกความร้อนสูงจนหลอมเหลวแล้วเย็นตัวลง จะกลายเป็นหินชนิดใด?', emoji:'🌋', choices:['หินอัคนี','หินตะกอนเสมอ','ยังเป็นหินแปรเหมือนเดิม','กลายเป็นดินทั้งหมด'], correct:0, explain:'เมื่อหลอมเหลวเป็นหินหนืดแล้วเย็นตัว จะได้หินอัคนีตามวัฏจักรหิน', tier:3},
      {q:'แนวทางใดช่วยลดแก๊สเรือนกระจกได้จริงในชีวิตประจำวัน?', emoji:'🚲', choices:['ใช้ขนส่งสาธารณะหรือจักรยาน ปิดไฟที่ไม่ใช้ และลดขยะ','เปิดแอร์ตลอดทั้งวัน','เผาขยะในที่โล่ง','ใช้ถุงพลาสติกให้มากขึ้น'], correct:0, explain:'การลดการเผาเชื้อเพลิงและลดขยะช่วยลดการปล่อยคาร์บอนโดยตรง', tier:3},
      {q:'ก่อนเกิดสึนามิ สัญญาณเตือนตามธรรมชาติที่สังเกตได้คืออะไร?', emoji:'🚨', choices:['น้ำทะเลลดลงผิดปกติอย่างรวดเร็วหลังแผ่นดินไหว','ท้องฟ้ามืดสนิททันที','อากาศร้อนจัดผิดปกติ','นกบินวนเป็นวงกลม'], correct:0, explain:'น้ำทะเลที่ลดลงฮวบฮาบเป็นสัญญาณให้รีบอพยพขึ้นที่สูงทันที', tier:3},
      {q:'เหตุใดพื้นที่ที่มีป่าชายเลนหนาแน่นจึงเสียหายจากคลื่นน้อยกว่า?', emoji:'🌳', choices:['รากไม้ช่วยชะลอความแรงของคลื่นและยึดตะกอนดินไว้','เพราะป่าชายเลนสูงกว่าคลื่น','เพราะน้ำทะเลไม่เข้าป่าชายเลน','เพราะป่าชายเลนดูดน้ำทะเลได้ทั้งหมด'], correct:0, explain:'ป่าชายเลนเป็นแนวกันชนธรรมชาติที่ลดพลังงานของคลื่นก่อนถึงฝั่ง', tier:3},
      {q:'การเฝ้าระวังภัยธรรมชาติที่ดีควรทำอย่างไร?', emoji:'📻', choices:['ติดตามประกาศเตือนจากหน่วยงานทางการและซักซ้อมแผนอพยพ','เชื่อข่าวลือที่แชร์กันในแชท','รอจนเกิดเหตุแล้วค่อยคิด','ย้ายออกจากประเทศ'], correct:0, explain:'ข้อมูลจากหน่วยงานทางการและการซ้อมล่วงหน้าช่วยลดความสูญเสียได้มากที่สุด', tier:3}
    ]
  },
  /* ---------- เชาวน์ / ศิลปะ ป.6 : 3 หมวด ---------- */
  {
    id:'p6-iq1', name:'เชาวน์ ป.6 · ตรรกะและการคิดเชิงคำนวณ', emoji:'🧰', icon:'assets/icons/p6-iq1.svg', color:'#2FB673', light:'#D6F3E4', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'เลขถัดไปคืออะไร: 1, 4, 9, 16, 25, ▢', emoji:'🔢', choices:['36','30','35','49'], correct:0, explain:'เป็นเลขยกกำลังสอง ตัวถัดไปคือ 6 × 6 = 36', tier:1},
      {q:'เลขถัดไปคืออะไร: 2, 6, 12, 20, ▢', emoji:'🧮', choices:['30','28','24','32'], correct:0, explain:'ผลต่างเพิ่มทีละ 2 คือ 4, 6, 8 ถัดไปบวก 10 ได้ 30', tier:1},
      {q:'ถ้าทายเลข 1-100 โดยถามว่า "มากกว่า 50 ไหม" เป็นวิธีคิดแบบใด?', emoji:'✂️', choices:['แบ่งครึ่งเพื่อตัดตัวเลือกลงทีละครึ่ง','สุ่มเดาไปเรื่อยๆ','นับทีละหนึ่งจาก 1','ถามคนอื่นให้บอกคำตอบ'], correct:0, explain:'การแบ่งครึ่งทำให้จำนวนที่ต้องเดาลดลงอย่างรวดเร็ว', tier:1},
      {q:'ในโปรแกรม "ถ้าเลขหารด้วย 2 ลงตัว ให้พิมพ์ คู่ ไม่เช่นนั้นพิมพ์ คี่" ถ้าใส่เลข 9 จะได้ผลใด?', emoji:'🤖', choices:['พิมพ์ว่า คี่','พิมพ์ว่า คู่','ไม่พิมพ์อะไรเลย','โปรแกรมหยุดทำงาน'], correct:0, explain:'9 หารด้วย 2 ไม่ลงตัว เงื่อนไขเป็นเท็จ จึงทำคำสั่งในส่วน "ไม่เช่นนั้น"', tier:1},
      {q:'"การทำซ้ำ" ในการเขียนโปรแกรมมีประโยชน์อย่างไร?', emoji:'🔁', choices:['ทำให้เขียนคำสั่งสั้นลงเมื่อต้องทำสิ่งเดิมหลายครั้ง','ทำให้โปรแกรมทำงานผิดพลาด','ทำให้ต้องเขียนคำสั่งยาวขึ้น','ทำให้ลบโปรแกรมได้ง่าย'], correct:0, explain:'ลูปช่วยรวมคำสั่งที่ซ้ำกันให้เหลือชุดเดียว', tier:1},
      {q:'ถ้า A > B และ B > C แล้ว C กับ A เป็นอย่างไร?', emoji:'⚖️', choices:['C น้อยกว่า A','C มากกว่า A','C เท่ากับ A','สรุปไม่ได้'], correct:0, explain:'ความสัมพันธ์ถ่ายทอดได้ ดังนั้น A > C หรือ C < A', tier:1},
      {q:'ข้อใดคือ "ตัวแปร" ในการเขียนโปรแกรม?', emoji:'📦', choices:['กล่องเก็บค่าที่เปลี่ยนแปลงได้ระหว่างโปรแกรมทำงาน','คำสั่งให้หยุดโปรแกรม','ชื่อของโปรแกรม','ข้อผิดพลาดของโปรแกรม'], correct:0, explain:'ตัวแปรใช้เก็บข้อมูล เช่น คะแนน จำนวนรอบ หรือชื่อผู้เล่น', tier:1},
      {q:'รหัสผ่านข้อใดปลอดภัยที่สุด?', emoji:'🔐', choices:['Kx7#pQ2m','123456','password','aaaaaa'], correct:0, explain:'รหัสที่ยาว ผสมตัวพิมพ์ ตัวเลข และสัญลักษณ์ เดาได้ยากที่สุด', tier:1},
      {q:'เลขถัดไปคืออะไร: 3, 6, 12, 24, ▢', emoji:'✖️', choices:['48','36','30','42'], correct:0, explain:'คูณด้วย 2 ทุกครั้ง 24 × 2 = 48', tier:1},
      {q:'ถ้าทายเลข 1-100 ด้วยวิธีแบ่งครึ่ง อย่างมากต้องถามกี่ครั้งจึงจะได้คำตอบ?', emoji:'🎯', choices:['ประมาณ 7 ครั้ง','ประมาณ 50 ครั้ง','ประมาณ 100 ครั้ง','ประมาณ 2 ครั้ง'], correct:0, explain:'แต่ละครั้งตัดครึ่ง 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 ประมาณ 7 ครั้ง', tier:2},
      {q:'โปรแกรมสั่งว่า "ทำซ้ำ 4 ครั้ง: เดินหน้า 2 ช่อง แล้วเลี้ยวขวา" ตัวละครจะเดินเป็นรูปอะไร?', emoji:'🔲', choices:['สี่เหลี่ยมจัตุรัส','สามเหลี่ยม','วงกลม','เส้นตรง'], correct:0, explain:'เดินหน้าแล้วเลี้ยวขวา 4 ครั้งเท่ากันจะได้รูปสี่เหลี่ยมจัตุรัส', tier:2},
      {q:'เลขถัดไปคืออะไร: 1, 1, 2, 3, 5, 8, 13, ▢', emoji:'🌀', choices:['21','18','20','26'], correct:0, explain:'บวกสองจำนวนก่อนหน้า 8 + 13 = 21', tier:2},
      {q:'"ข้อผิดพลาดของโปรแกรม" (bug) ควรแก้อย่างไร?', emoji:'🐞', choices:['ไล่ตรวจทีละขั้นตอนเพื่อหาจุดที่ผลลัพธ์เริ่มผิด','ลบโปรแกรมแล้วเลิกทำ','เดาสุ่มแก้ไปเรื่อยๆ','เพิ่มคำสั่งให้มากที่สุด'], correct:0, explain:'การไล่ตรวจทีละขั้น (debug) ช่วยระบุจุดผิดได้ตรงจุด', tier:2},
      {q:'ถ้าโปรแกรมสั่ง "ถ้าคะแนน ≥ 50 ให้แสดงว่า ผ่าน" ใส่คะแนน 50 จะได้ผลใด?', emoji:'📝', choices:['แสดงว่า ผ่าน เพราะเงื่อนไขรวมค่าที่เท่ากับ 50 ด้วย','ไม่แสดงอะไร','แสดงว่า ไม่ผ่าน','โปรแกรมค้าง'], correct:0, explain:'เครื่องหมาย ≥ หมายถึงมากกว่าหรือเท่ากับ', tier:2},
      {q:'มีคน 4 คนจับมือทักทายกันครบทุกคู่ จะจับมือทั้งหมดกี่ครั้ง?', emoji:'🤝', choices:['6 ครั้ง','4 ครั้ง','8 ครั้ง','12 ครั้ง'], correct:0, explain:'คู่ที่เป็นไปได้คือ AB, AC, AD, BC, BD, CD รวม 6 ครั้ง', tier:2},
      {q:'ข้อใดเป็นการใช้อินเทอร์เน็ตอย่างปลอดภัย?', emoji:'🛡️', choices:['ไม่บอกรหัสผ่านให้ใคร และไม่คลิกลิงก์แปลกจากคนไม่รู้จัก','บอกรหัสผ่านให้เพื่อนสนิททุกคน','คลิกลิงก์ทุกอันที่ส่งมา','ใช้รหัสผ่านเดียวกันทุกเว็บไซต์'], correct:0, explain:'การรักษารหัสผ่านและระวังลิงก์แปลกปลอมช่วยป้องกันการถูกขโมยข้อมูล', tier:2},
      {q:'ถ้าต้องการให้ตัวละครเดินเป็นรูปสามเหลี่ยมด้านเท่า ควรเลี้ยวครั้งละกี่องศา?', emoji:'🔺', choices:['120 องศา','90 องศา','60 องศา','45 องศา'], correct:0, explain:'มุมที่ต้องหมุนรวมกันครบ 360 องศาใน 3 ครั้ง จึงเลี้ยวครั้งละ 120 องศา', tier:2},
      {q:'เลขถัดไปคืออะไร: 100, 50, 25, ▢', emoji:'📉', choices:['12.5','20','15','5'], correct:0, explain:'หารด้วย 2 ทุกครั้ง 25 ÷ 2 = 12.5', tier:2},
      {q:'ถ้าโปรแกรมทำซ้ำ 3 ครั้ง โดยแต่ละรอบบวกคะแนนเพิ่ม 5 เริ่มจาก 0 คะแนนสุดท้ายเป็นเท่าไร?', emoji:'🧮', choices:['15','5','8','10'], correct:0, explain:'0 + 5 + 5 + 5 = 15', tier:3},
      {q:'มีลูกบอล 8 ลูก มี 1 ลูกที่หนักกว่าลูกอื่น ใช้ตาชั่งสองแขนอย่างน้อยกี่ครั้งจึงหาเจอแน่นอน?', emoji:'⚖️', choices:['2 ครั้ง','3 ครั้ง','4 ครั้ง','7 ครั้ง'], correct:0, explain:'แบ่งเป็นกลุ่มละ 3, 3, 2 ชั่งครั้งแรกเทียบกลุ่มละ 3 แล้วชั่งอีกครั้งภายในกลุ่มที่หนักกว่า', tier:3},
      {q:'ข้อใดคือประโยชน์ของการเขียนผังงาน (flowchart) ก่อนเขียนโปรแกรม?', emoji:'📋', choices:['ช่วยให้เห็นลำดับขั้นตอนและเงื่อนไขทั้งหมดก่อนลงมือเขียนจริง','ทำให้โปรแกรมทำงานเร็วขึ้น','ทำให้ไม่ต้องทดสอบโปรแกรม','ทำให้โปรแกรมสวยงามขึ้น'], correct:0, explain:'การวางแผนก่อนช่วยลดข้อผิดพลาดและทำให้แก้ไขง่ายขึ้น', tier:3},
      {q:'ถ้าเงื่อนไขคือ "ถ้าฝนตกและมีร่ม ให้ออกไปข้างนอก" วันนี้ฝนตกแต่ไม่มีร่ม ผลเป็นอย่างไร?', emoji:'☔', choices:['ไม่ออกไปข้างนอก เพราะเงื่อนไขไม่ครบทั้งสองข้อ','ออกไปข้างนอก','ออกไปครึ่งทาง','สรุปไม่ได้'], correct:0, explain:'คำว่า "และ" บังคับให้ต้องเป็นจริงทั้งสองเงื่อนไข', tier:3},
      {q:'เลขถัดไปคืออะไร: 2, 3, 5, 9, 17, ▢', emoji:'🔢', choices:['33','25','29','34'], correct:0, explain:'แต่ละจำนวนคูณ 2 แล้วลบ 1 ดังนั้น 17 × 2 − 1 = 33', tier:3},
      {q:'เหตุใดจึงควรตั้งรหัสผ่านต่างกันในแต่ละเว็บไซต์?', emoji:'🔑', choices:['ถ้าเว็บหนึ่งถูกเจาะ บัญชีอื่นจะยังปลอดภัยอยู่','เพื่อให้จำได้ง่ายขึ้น','เพื่อให้เข้าเว็บได้เร็วขึ้น','เพื่อให้เว็บไซต์ทำงานดีขึ้น'], correct:0, explain:'การใช้รหัสซ้ำทำให้ผู้ไม่หวังดีเข้าถึงได้ทุกบัญชีเมื่อรู้รหัสเดียว', tier:3}
    ]
  },
  {
    id:'p6-iq2', name:'เชาวน์ ป.6 · มิติสัมพันธ์และแผนภูมิวงกลม', emoji:'🪆', icon:'assets/icons/p6-iq2.svg', color:'#1F9C60', light:'#D6F3E4', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'แผนภูมิวงกลมใช้แสดงข้อมูลแบบใด?', emoji:'🥧', choices:['สัดส่วนของแต่ละส่วนเทียบกับทั้งหมด','การเปลี่ยนแปลงตามเวลา','ตำแหน่งบนแผนที่','อุณหภูมิของอากาศ'], correct:0, explain:'วงกลมทั้งวงแทน 100% แต่ละชิ้นคือสัดส่วนของส่วนนั้น', tier:1},
      {q:'แผนภูมิวงกลมทั้งวงคิดเป็นร้อยละเท่าไร?', emoji:'💯', choices:['100','50','360','10'], correct:0, explain:'ทั้งวงคือข้อมูลทั้งหมด เท่ากับร้อยละ 100', tier:1},
      {q:'ครึ่งวงกลมในแผนภูมิวงกลมคิดเป็นร้อยละเท่าไร?', emoji:'🌗', choices:['50','25','75','100'], correct:0, explain:'ครึ่งหนึ่งของทั้งหมดคือร้อยละ 50', tier:1},
      {q:'ลูกบาศก์มีหน้า ขอบ และจุดยอดอย่างละกี่ส่วน?', emoji:'🧊', choices:['6 หน้า 12 ขอบ 8 จุดยอด','4 หน้า 8 ขอบ 6 จุดยอด','8 หน้า 6 ขอบ 12 จุดยอด','6 หน้า 8 ขอบ 12 จุดยอด'], correct:0, explain:'ลูกบาศก์มี 6 หน้า 12 ขอบ และ 8 จุดยอด', tier:1},
      {q:'มองทรงกระบอกจากด้านบนตรงๆ จะเห็นเป็นรูปใด?', emoji:'🥫', choices:['วงกลม','สี่เหลี่ยมผืนผ้า','สามเหลี่ยม','วงรีเสมอ'], correct:0, explain:'ด้านบนของทรงกระบอกคือหน้าตัดวงกลม', tier:1},
      {q:'มองทรงกระบอกจากด้านข้างตรงๆ จะเห็นเป็นรูปใด?', emoji:'🥫', choices:['สี่เหลี่ยมผืนผ้า','วงกลม','สามเหลี่ยม','ห้าเหลี่ยม'], correct:0, explain:'ผิวข้างของทรงกระบอกเมื่อมองตรงๆ จะเห็นเป็นสี่เหลี่ยมผืนผ้า', tier:1},
      {q:'ในแผนภูมิวงกลม ถ้าส่วน A กินพื้นที่ 1 ใน 4 ของวง คิดเป็นร้อยละเท่าไร?', emoji:'🍰', choices:['25','40','50','75'], correct:0, explain:'1/4 ของ 100 คือร้อยละ 25', tier:1},
      {q:'พีระมิดฐานสี่เหลี่ยมมีจุดยอดทั้งหมดกี่จุด?', emoji:'🔺', choices:['5 จุด','4 จุด','6 จุด','8 จุด'], correct:0, explain:'มีจุดยอดที่ฐาน 4 จุด และยอดแหลมด้านบนอีก 1 จุด', tier:1},
      {q:'ภาพในกระจกเงามีลักษณะอย่างไร?', emoji:'🪞', choices:['กลับด้านซ้าย-ขวา','กลับหัวกลับหาง','เล็กลงครึ่งหนึ่ง','เปลี่ยนเป็นสีตรงข้าม'], correct:0, explain:'กระจกเงาสะท้อนภาพให้สลับซ้าย-ขวา', tier:1},
      {q:'ในแผนภูมิวงกลมของนักเรียน 200 คน ถ้าส่วน "ชอบกีฬา" เป็นร้อยละ 40 คิดเป็นกี่คน?', emoji:'⚽', choices:['80 คน','40 คน','120 คน','60 คน'], correct:0, explain:'200 ÷ 100 × 40 = 80 คน', tier:2},
      {q:'ในแผนภูมิวงกลม ส่วนที่กินมุมที่จุดศูนย์กลาง 90 องศา คิดเป็นร้อยละเท่าไร?', emoji:'📐', choices:['25','50','90','30'], correct:0, explain:'90 ÷ 360 × 100 = ร้อยละ 25', tier:2},
      {q:'ถ้าแผนภูมิวงกลมมี 3 ส่วน คือ 50%, 30% และส่วนที่เหลือ ส่วนที่เหลือเป็นร้อยละเท่าไร?', emoji:'🥧', choices:['20','25','30','10'], correct:0, explain:'100 − 50 − 30 = ร้อยละ 20', tier:2},
      {q:'ลูกบาศก์ขนาด 3×3×3 ประกอบจากลูกบาศก์หน่วยกี่ก้อน?', emoji:'📦', choices:['27 ก้อน','9 ก้อน','18 ก้อน','12 ก้อน'], correct:0, explain:'3 × 3 × 3 = 27 ก้อน', tier:2},
      {q:'ถ้าทาสีลูกบาศก์ 3×3×3 ทั้งภายนอกแล้วแยกออกเป็นก้อนเล็ก ก้อนที่อยู่ตรงกลางสุดถูกทาสีกี่หน้า?', emoji:'🎨', choices:['0 หน้า','1 หน้า','2 หน้า','3 หน้า'], correct:0, explain:'ก้อนใจกลางถูกล้อมด้วยก้อนอื่นทุกด้าน จึงไม่โดนสีเลย', tier:2},
      {q:'ในแผนภูมิวงกลม ส่วนที่ใหญ่ที่สุดหมายถึงอะไร?', emoji:'📊', choices:['กลุ่มที่มีสัดส่วนมากที่สุดของข้อมูลทั้งหมด','กลุ่มที่มีค่าน้อยที่สุด','กลุ่มที่สำคัญน้อยที่สุด','กลุ่มที่มีสีสวยที่สุด'], correct:0, explain:'ขนาดของชิ้นแปรตามสัดส่วนของข้อมูลโดยตรง', tier:2},
      {q:'รูปคลี่ที่มีสามเหลี่ยม 4 รูปกับสี่เหลี่ยมจัตุรัส 1 รูป พับได้เป็นรูปทรงใด?', emoji:'🔺', choices:['พีระมิดฐานสี่เหลี่ยม','ลูกบาศก์','ทรงกระบอก','กรวย'], correct:0, explain:'ฐานสี่เหลี่ยม 1 รูปกับหน้าข้างสามเหลี่ยม 4 รูป คือพีระมิดฐานสี่เหลี่ยม', tier:2},
      {q:'ตัวอักษรใดเมื่อสะท้อนในกระจกแล้วยังเหมือนเดิม?', emoji:'🪞', choices:['A','F','G','R'], correct:0, explain:'ตัว A มีความสมมาตรซ้าย-ขวา จึงสะท้อนแล้วเหมือนเดิม', tier:2},
      {q:'มองพีระมิดฐานสี่เหลี่ยมจากด้านบนตรงๆ จะเห็นเป็นรูปใด?', emoji:'👁️', choices:['สี่เหลี่ยมที่มีเส้นทแยงมุมจากมุมมาบรรจบตรงกลาง','วงกลม','สามเหลี่ยมเดี่ยว','เส้นตรง'], correct:0, explain:'จะเห็นฐานสี่เหลี่ยมพร้อมสันที่ลากจากมุมทั้งสี่ไปยังยอด', tier:2},
      {q:'ในแผนภูมิวงกลมของค่าใช้จ่ายรวม 3,000 บาท ถ้าค่าอาหารเป็นร้อยละ 35 คิดเป็นกี่บาท?', emoji:'💰', choices:['1,050 บาท','350 บาท','1,500 บาท','900 บาท'], correct:0, explain:'3,000 ÷ 100 × 35 = 1,050 บาท', tier:3},
      {q:'ถ้าส่วนหนึ่งของแผนภูมิวงกลมคิดเป็นร้อยละ 20 จะกินมุมที่จุดศูนย์กลางกี่องศา?', emoji:'📐', choices:['72 องศา','20 องศา','36 องศา','90 องศา'], correct:0, explain:'360 ÷ 100 × 20 = 72 องศา', tier:3},
      {q:'ลูกบาศก์ 3×3×3 ที่ทาสีภายนอกทั้งหมด มีก้อนเล็กที่ถูกทาสี 3 หน้ากี่ก้อน?', emoji:'🧊', choices:['8 ก้อน','12 ก้อน','6 ก้อน','4 ก้อน'], correct:0, explain:'ก้อนที่อยู่ตรงมุมทั้ง 8 มุมจะเห็นสามหน้าพอดี', tier:3},
      {q:'ข้อมูลชุดหนึ่งมี 4 กลุ่ม เท่ากันทุกกลุ่ม แต่ละกลุ่มจะกินมุมกี่องศาในแผนภูมิวงกลม?', emoji:'🥧', choices:['90 องศา','45 องศา','120 องศา','60 องศา'], correct:0, explain:'360 ÷ 4 = 90 องศา', tier:3},
      {q:'เหตุใดจึงไม่ควรใช้แผนภูมิวงกลมเมื่อมีกลุ่มข้อมูลจำนวนมากเกินไป?', emoji:'🤔', choices:['เพราะชิ้นเล็กๆ จำนวนมากทำให้เปรียบเทียบได้ยาก','เพราะวาดไม่ได้','เพราะสีไม่พอใช้','เพราะต้องใช้เวลานานมาก'], correct:0, explain:'เมื่อชิ้นเล็กและใกล้เคียงกัน สายตาจะแยกความต่างได้ยาก ควรใช้แผนภูมิแท่งแทน', tier:3},
      {q:'ถ้ามองวัตถุชิ้นหนึ่งจากด้านหน้าเห็นสี่เหลี่ยม จากด้านบนเห็นวงกลม วัตถุนั้นน่าจะเป็นรูปทรงใด?', emoji:'🥫', choices:['ทรงกระบอก','ลูกบาศก์','ทรงกลม','พีระมิด'], correct:0, explain:'ทรงกระบอกมองด้านบนเป็นวงกลม มองด้านข้างเป็นสี่เหลี่ยมผืนผ้า', tier:3}
    ]
  },
  {
    id:'p6-art1', name:'ศิลปะ ป.6 · องค์ประกอบศิลป์และงานสร้างสรรค์', emoji:'🧶', icon:'assets/icons/p6-art1.svg', color:'#FF7A45', light:'#FFE4D6', grade:'p6', poolPick:10, isNew:true,
    questions:[
      {q:'"จังหวะ" ในงานทัศนศิลป์หมายถึงอะไร?', emoji:'🔁', choices:['การซ้ำของรูปร่างหรือสีอย่างมีระเบียบ','ความเร็วในการวาดภาพ','ขนาดของกระดาษ','จำนวนสีที่ใช้'], correct:0, explain:'การซ้ำอย่างมีแบบแผนทำให้ภาพมีจังหวะและน่าสนใจ', tier:1},
      {q:'สีคู่ตรงข้ามในวงจรสีให้ผลอย่างไรเมื่ออยู่ด้วยกัน?', emoji:'🎨', choices:['ตัดกันชัดเจน สะดุดตา','กลมกลืนจนแยกไม่ออก','ทำให้ภาพดูจืด','ทำให้ภาพเป็นขาวดำ'], correct:0, explain:'สีคู่ตรงข้าม เช่น แดง-เขียว ทำให้เกิดความตัดกันสูง', tier:1},
      {q:'"ความกลมกลืน" ในงานศิลปะเกิดจากอะไร?', emoji:'🌈', choices:['การใช้สีหรือรูปร่างที่เข้ากันเป็นชุดเดียวกัน','การใช้สีที่ตัดกันรุนแรงที่สุด','การวาดให้รกที่สุด','การใช้กระดาษหลายขนาด'], correct:0, explain:'องค์ประกอบที่คล้ายกันทำให้ภาพดูเป็นอันหนึ่งอันเดียว', tier:1},
      {q:'"จุดเด่น" ของภาพควรมีลักษณะอย่างไร?', emoji:'🎯', choices:['ดึงดูดสายตาให้มองเห็นก่อนส่วนอื่น','กลมกลืนจนมองไม่เห็น','อยู่มุมล่างซ้ายเสมอ','มีขนาดเล็กที่สุดในภาพ'], correct:0, explain:'จุดเด่นคือส่วนที่ศิลปินต้องการสื่อเป็นอันดับแรก', tier:1},
      {q:'ทัศนธาตุใดทำให้ภาพดูมีระยะใกล้-ไกล?', emoji:'⛰️', choices:['ขนาดและน้ำหนักสีของวัตถุ','จำนวนกรอบรูป','ชื่อของภาพ','ราคาของสี'], correct:0, explain:'วัตถุไกลจะเล็กลงและสีจางลงตามหลักทัศนียภาพ', tier:1},
      {q:'งานประติมากรรมต่างจากงานจิตรกรรมอย่างไร?', emoji:'🏺', choices:['ประติมากรรมเป็นงานสามมิติที่มองได้รอบด้าน','ประติมากรรมใช้สีมากกว่า','จิตรกรรมต้องปั้นด้วยดิน','ทั้งสองอย่างเหมือนกัน'], correct:0, explain:'จิตรกรรมอยู่บนระนาบสองมิติ ส่วนประติมากรรมมีปริมาตรจริง', tier:1},
      {q:'ลายไทยเป็นเอกลักษณ์ของงานศิลปะประเภทใด?', emoji:'🛕', choices:['ศิลปะไทยประเพณีที่พบในวัดและวรรณคดี','ศิลปะสมัยใหม่จากยุโรป','ภาพถ่ายขาวดำ','ศิลปะดิจิทัล'], correct:0, explain:'ลายกนกและลายไทยเป็นงานประณีตศิลป์ที่สืบทอดกันมายาวนาน', tier:1},
      {q:'แสงและเงาในภาพช่วยเรื่องใด?', emoji:'🌗', choices:['ทำให้วัตถุดูมีปริมาตรและสมจริง','ทำให้ภาพเป็นสีเดียว','ทำให้ภาพแบนลง','ทำให้ภาพเล็กลง'], correct:0, explain:'ความต่างของค่าน้ำหนักแสงเงาสร้างมิติให้ภาพ', tier:1},
      {q:'"ความสมดุล" แบบสองข้างเท่ากันเรียกว่าอะไร?', emoji:'⚖️', choices:['สมดุลแบบสมมาตร','สมดุลแบบอสมมาตร','ความขัดแย้ง','จังหวะ'], correct:0, explain:'สมมาตรคือซ้าย-ขวาเหมือนกัน ให้ความรู้สึกมั่นคงเป็นทางการ', tier:1},
      {q:'สมดุลแบบอสมมาตรมีลักษณะอย่างไร?', emoji:'🎭', choices:['สองข้างไม่เหมือนกันแต่ยังให้ความรู้สึกสมดุล','สองข้างเหมือนกันทุกประการ','ไม่มีความสมดุลเลย','ใช้สีเดียวทั้งภาพ'], correct:0, explain:'ใช้ขนาด สี หรือระยะห่างช่วยถ่วงน้ำหนักให้ภาพดูสมดุล', tier:2},
      {q:'ถ้าต้องการให้ภาพให้ความรู้สึกสงบเยือกเย็น ควรใช้สีกลุ่มใด?', emoji:'❄️', choices:['สีวรรณะเย็น เช่น ฟ้า น้ำเงิน เขียว','สีวรรณะร้อน เช่น แดง ส้ม','สีดำล้วน','สีทองทั้งภาพ'], correct:0, explain:'สีวรรณะเย็นให้ความรู้สึกสงบและผ่อนคลาย', tier:2},
      {q:'"เอกภาพ" ในงานศิลปะหมายถึงอะไร?', emoji:'🧩', choices:['ทุกส่วนของภาพประสานกันเป็นเรื่องเดียวกัน','การใช้สีให้มากที่สุด','การวาดวัตถุชิ้นเดียวเท่านั้น','การใช้กรอบรูปสีทอง'], correct:0, explain:'เอกภาพทำให้ภาพไม่กระจัดกระจายและสื่อสารได้ชัดเจน', tier:2},
      {q:'งานภาพพิมพ์ (printmaking) มีลักษณะเด่นอย่างไร?', emoji:'🖨️', choices:['สร้างแม่พิมพ์แล้วพิมพ์ซ้ำได้หลายชิ้น','ต้องวาดใหม่ทุกครั้ง','ใช้ได้เฉพาะสีดำ','ต้องปั้นด้วยดินเหนียว'], correct:0, explain:'แม่พิมพ์หนึ่งอันสามารถพิมพ์ผลงานได้หลายชิ้น', tier:2},
      {q:'ศิลปะพื้นบ้านของไทยข้อใดใช้ไม้ไผ่เป็นวัสดุหลัก?', emoji:'🧺', choices:['เครื่องจักสาน','ผ้าบาติก','เครื่องเบญจรงค์','ภาพเขียนสีน้ำ'], correct:0, explain:'เครื่องจักสานใช้ไม้ไผ่หรือหวายสานเป็นภาชนะและของใช้', tier:2},
      {q:'การใช้ "พื้นที่ว่าง" ในภาพมีประโยชน์อย่างไร?', emoji:'⬜', choices:['ช่วยให้จุดเด่นโดดเด่นขึ้นและภาพดูไม่อึดอัด','ทำให้ภาพดูไม่เสร็จ','ทำให้เปลืองกระดาษ','ไม่มีประโยชน์ใดๆ'], correct:0, explain:'ที่ว่างช่วยพักสายตาและเน้นสิ่งที่ต้องการสื่อ', tier:2},
      {q:'ภาพหุ่นนิ่ง (still life) คือภาพประเภทใด?', emoji:'🍎', choices:['ภาพสิ่งของที่จัดวางไว้ เช่น ผลไม้ แจกัน','ภาพคนกำลังเคลื่อนไหว','ภาพทิวทัศน์ภูเขา','ภาพเหตุการณ์ประวัติศาสตร์'], correct:0, explain:'หุ่นนิ่งคือการวาดสิ่งของที่ไม่เคลื่อนไหวโดยเน้นแสงเงาและองค์ประกอบ', tier:2},
      {q:'เครื่องเบญจรงค์เป็นงานศิลปะประเภทใด?', emoji:'🏺', choices:['เครื่องปั้นดินเผาเคลือบเขียนลายหลายสี','งานทอผ้าไหม','งานแกะสลักไม้','งานภาพพิมพ์'], correct:0, explain:'เบญจรงค์หมายถึงห้าสี เป็นงานเขียนลายบนเครื่องปั้นดินเผา', tier:2},
      {q:'การจัดองค์ประกอบภาพให้จุดเด่นอยู่ค่อนไปทางด้านใดด้านหนึ่งมีผลอย่างไร?', emoji:'🖼️', choices:['ทำให้ภาพดูมีชีวิตชีวาและน่าสนใจกว่าวางไว้กลางภาพเสมอ','ทำให้ภาพผิดหลักการเสมอ','ทำให้ภาพดูแบน','ทำให้ภาพเล็กลง'], correct:0, explain:'การวางจุดเด่นเยื้องศูนย์กลางช่วยสร้างความน่าสนใจให้ภาพ', tier:3},
      {q:'ถ้าต้องการสื่ออารมณ์ตื่นเต้นในภาพ ควรใช้เส้นแบบใด?', emoji:'⚡', choices:['เส้นเฉียงและเส้นหักมุม','เส้นแนวนอนเรียบ','เส้นตรงแนวตั้งเท่านั้น','ไม่ใช้เส้นเลย'], correct:0, explain:'เส้นเฉียงให้ความรู้สึกเคลื่อนไหวและไม่หยุดนิ่ง', tier:3},
      {q:'เหตุใดงานศิลปะพื้นบ้านจึงมีคุณค่าควรอนุรักษ์?', emoji:'🇹🇭', choices:['สะท้อนภูมิปัญญาและวิถีชีวิตของท้องถิ่นที่สืบทอดกันมา','เพราะทำง่ายกว่างานศิลปะสมัยใหม่','เพราะมีราคาแพงที่สุด','เพราะใช้เวลาน้อยที่สุด'], correct:0, explain:'งานพื้นบ้านเก็บรักษาความรู้และเอกลักษณ์ของชุมชนไว้', tier:3},
      {q:'ถ้าวาดภาพถนนที่ทอดยาวไปสู่ระยะไกล ควรวาดอย่างไร?', emoji:'🛣️', choices:['ให้เส้นขอบถนนสอบเข้าหากันไปยังจุดรวมสายตา','ให้ขอบถนนขนานกันตลอด','ให้ถนนกว้างขึ้นเรื่อยๆ','ให้ถนนเป็นสีเดียวกันทั้งหมด'], correct:0, explain:'หลักทัศนียภาพระบุว่าเส้นขนานจะดูสอบเข้าหากันที่จุดรวมสายตา', tier:3},
      {q:'การวิจารณ์งานศิลปะอย่างสร้างสรรค์ควรทำอย่างไร?', emoji:'💬', choices:['บอกทั้งจุดเด่นและข้อเสนอแนะโดยใช้เหตุผล','บอกแต่ข้อเสียให้มากที่สุด','ชมอย่างเดียวโดยไม่ดูรายละเอียด','วิจารณ์ตัวผู้วาดแทนตัวผลงาน'], correct:0, explain:'การวิจารณ์ที่ดีมองที่ผลงานและช่วยให้ผู้สร้างพัฒนาต่อได้', tier:3},
      {q:'ผลงานศิลปะชิ้นเดียวกันอาจถูกตีความต่างกันได้เพราะเหตุใด?', emoji:'👀', choices:['เพราะผู้ชมแต่ละคนมีประสบการณ์และมุมมองต่างกัน','เพราะภาพเปลี่ยนรูปได้เอง','เพราะสีเปลี่ยนไปตามเวลา','เพราะศิลปินเปลี่ยนใจตลอด'], correct:0, explain:'ศิลปะเปิดพื้นที่ให้ผู้ชมตีความตามประสบการณ์ของตนเอง', tier:3}
    ]
  },
  /* ---------- เกม AR ป.6 (ประโยคยาว 7-9 คำ) ---------- */
  {
    id:'p6-math-ar', name:'คิดเลขเร็ว ป.6', emoji:'🔋', icon:'assets/icons/p6-math-ar.svg', color:'#5E3FE0', light:'#E9E3FF',
    type:'ar', mode:'math', levels:10, mathTiers:[[4,15],[8,25],[12,40]], mathOps:['×','÷'], mathChoices:4, grade:'p6', isNew:true
  },
  {
    id:'p6-thai-sentence', name:'ภาษาไทย ป.6 · ต่อประโยคซับซ้อน', emoji:'🪝', icon:'assets/icons/p6-thai-sentence.svg', color:'#D63D8C', light:'#FCE0EF',
    type:'ar', lang:'th', sentenceLens:[7,8,9], levels:10, grade:'p6', isNew:true
  },
  {
    id:'p6-eng-sentence', name:'English ป.6 · Complex Sentences', emoji:'🎽', icon:'assets/icons/p6-eng-sentence.svg', color:'#0A7A75', light:'#D5F5F2',
    type:'ar', lang:'en', sentenceLens:[7,8,9], levels:10, grade:'p6', isNew:true
  },
  {
    id:'p6-eng-match', name:'English ป.6 · โยงเส้นคำศัพท์', emoji:'⛓️', icon:'assets/icons/p6-eng-match.svg', color:'#0A8F89', light:'#D5F5F2',
    type:'ar', mode:'match', lang:'en', matchSet:'enPro', levels:10, grade:'p6', isNew:true
  },

  /* ---------- เกมฟัง ป.6 (คำยาว 7-9 ตัวอักษร / ประโยคเติมคำ 3 ช่อง) ---------- */
  {
    id:'p6-listen-en', name:'ฟังคำอังกฤษ ป.6', emoji:'🛎️', icon:'assets/icons/p6-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', wordLens:[7,8,9], levels:10, grade:'p6', isNew:true
  },
  {
    id:'p6-listen-th', name:'ฟังสะกดคำไทย ป.6', emoji:'🪔', icon:'assets/icons/p6-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', wordLens:[7,8,9], levels:10, grade:'p6', isNew:true
  },
  {
    /* ฟังประโยคเติมคำ ป.6 — ประโยคอังกฤษยาว มีคำถาม Why/How และคำบอกทิศทาง */
    id:'p6-cloze1', name:'ฟังประโยคเติมคำ ป.6 · 1', emoji:'🪩', icon:'assets/icons/p6-cloze1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en7', clozeBlanks:[2,3,3], clozeDecoys:[5,5,6], levels:10, grade:'p6', isNew:true
  },
  {
    id:'p6-cloze2', name:'ฟังประโยคเติมคำ ป.6 · 2', emoji:'🎰', icon:'assets/icons/p6-cloze2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en7', clozeBlanks:[3,3,4], clozeDecoys:[5,6,6], levels:10, grade:'p6', isNew:true
  },

  /* ---------- เกมฝึกทักษะ ป.6 (reuse engine เดิม + คลังใหม่ของ ป.6) ---------- */
  { id:'p6-fraction', name:'เศษส่วน-อัตราส่วน ป.6', emoji:'🥥', icon:'assets/icons/p6-fraction.svg', color:'#E1503A', light:'#FBDBD4', type:'skill', mode:'fraction', hard:'p6', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-money', name:'ร้านค้าและส่วนลด ป.6', emoji:'🫘', icon:'assets/icons/p6-money.svg', color:'#D98E2B', light:'#FBEBCB', type:'skill', mode:'money', hard:'p6', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-balance', name:'ตาชั่งสมดุล ป.6', emoji:'🔧', icon:'assets/icons/p6-balance.svg', color:'#7C8CFF', light:'#E4E8FF', type:'skill', mode:'balance', hard:'p6', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-memory', name:'จับคู่โดมิโน ป.6', emoji:'🧅', icon:'assets/icons/p6-memory.svg', color:'#E0764C', light:'#FBE3D4', type:'skill', mode:'memory', levels:3, memoryPairs:[12,14,16], handPlay:true, grade:'p6', isNew:true },
  { id:'p6-timeline', name:'เส้นเวลารัตนโกสินทร์', emoji:'🕌', icon:'assets/icons/p6-timeline.svg', color:'#B07A2E', light:'#F5E7CE', type:'skill', mode:'timeline', timelineTag:'p6', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-coord', name:'พิกัดแผนที่ประเทศไทย', emoji:'🚁', icon:'assets/icons/p6-coord.svg', color:'#C77D2E', light:'#F6E7CF', type:'skill', mode:'coord', hard:'p6', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-chart', name:'อ่านแผนภูมิและสถิติ ป.6', emoji:'🪛', icon:'assets/icons/p6-chart.svg', color:'#2F8FD6', light:'#D7ECFA', type:'skill', mode:'chart', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-area', name:'พื้นที่และปริมาตร ป.6', emoji:'🧱', icon:'assets/icons/p6-area.svg', color:'#E0904C', light:'#FBE7D4', type:'skill', mode:'area', hard:'p6', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-angle', name:'มุมภายในรูปหลายเหลี่ยม', emoji:'🛴', icon:'assets/icons/p6-angle.svg', color:'#8E5CD6', light:'#EBE1FA', type:'skill', mode:'angle', hard:'p6', levels:10, grade:'p6', isNew:true },
  { id:'p6-code', name:'เขียนโปรแกรมมีเงื่อนไข ป.6', emoji:'🛠️', icon:'assets/icons/p6-code.svg', color:'#1B6E77', light:'#D3EBEE', type:'skill', mode:'code', codeSet:'p6a', codeLoop:true, codeCond:true, levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-sci', name:'แม่เหล็กแยกสารได้ไหม?', emoji:'🧴', icon:'assets/icons/p6-sci.svg', color:'#3FA9C9', light:'#D9F0F8', type:'skill', mode:'science', sciSet:'p6magnet', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-foodsort', name:'แยกสารอาหารให้พลังงาน', emoji:'🫒', icon:'assets/icons/p6-foodsort.svg', color:'#2FA36B', light:'#D9F2E4', type:'skill', mode:'sort', sortSet:'nutrient', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-trisort', name:'จำแนกรูปสามเหลี่ยม', emoji:'🕳️', icon:'assets/icons/p6-trisort.svg', color:'#6A4FE0', light:'#E7E2FC', type:'skill', mode:'sort', sortSet:'triangle', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-ef', name:'เชาวน์ ป.6 · นกฮูกสั่ง', emoji:'🪸', icon:'assets/icons/p6-ef.svg', color:'#17A65B', light:'#D6F3E4', type:'skill', mode:'ef', levels:10, handPlay:true, grade:'p6', isNew:true },
  { id:'p6-world', name:'โลก ฤดูกาล และมรสุม', emoji:'🧯', icon:'assets/icons/p6-world.svg', color:'#2E86C1', light:'#D6EAF8', type:'skill', mode:'world', levels:10, handPlay:true, grade:'p6', isNew:true },

  /* ---------- เกมใหม่จาก IDEA.md (mechanic หมุน/สลับตำแหน่ง) — ป.5-6 ---------- */
  { id:'p5-mirror', name:'กระจกวิเศษ ป.5', emoji:'🚿', icon:'assets/icons/p5-mirror.svg', color:'#C94FB6', light:'#F7DFF3', type:'skill', mode:'mirror', levels:10, grade:'p5', isNew:true },
  { id:'p5-order', name:'เรียงลำดับวิเศษ ป.5', emoji:'🧹', icon:'assets/icons/p5-order.svg', color:'#4A9EDF', light:'#DCEEFB', type:'skill', mode:'order', orderTag:'p5', levels:10, grade:'p5', isNew:true },
  { id:'p6-circuit', name:'ต่อวงจรไฟฟ้า ป.6', emoji:'🕯️', icon:'assets/icons/p6-circuit.svg', color:'#2E86C1', light:'#D6EAF8', type:'skill', mode:'circuit', levels:10, grade:'p6', isNew:true },
  { id:'p6-tangram', name:'แท็งแกรมวิเศษ ป.6', emoji:'🪵', icon:'assets/icons/p6-tangram.svg', color:'#8E5CD6', light:'#EBE1FA', type:'skill', mode:'tangram', levels:10, grade:'p6', isNew:true },
  { id:'p6-mirror', name:'กระจกวิเศษ ป.6', emoji:'🛁', icon:'assets/icons/p6-mirror.svg', color:'#C94FB6', light:'#F7DFF3', type:'skill', mode:'mirror', levels:10, grade:'p6', isNew:true },
  { id:'p6-order', name:'เรียงลำดับวิเศษ ป.6', emoji:'🧻', icon:'assets/icons/p6-order.svg', color:'#4A9EDF', light:'#DCEEFB', type:'skill', mode:'order', orderTag:'p6', levels:10, grade:'p6', isNew:true },

  /* ---------- เกมฟังประโยคเติมคำ (cloze) — ชั้นละ 2 เกม ไล่ระดับ ---------- */
  {
    id:'cloze-th1', name:'ฟังประโยคเติมคำ 1', emoji:'🔕', icon:'assets/icons/cloze-th1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en1', clozeBlanks:[1,1,1], clozeDecoys:[2,2,3], levels:10, isNew:true
  },
  {
    id:'cloze-th2', name:'ฟังประโยคเติมคำ 2', emoji:'💬', icon:'assets/icons/cloze-th2.svg', color:'#E0603F', light:'#FBDBD2',
    type:'listen', mode:'cloze', lang:'en', clozeSet:'en1', clozeBlanks:[1,1,2], clozeDecoys:[3,3,4], levels:10, isNew:true
  },
];


/* ============================= เกมใหม่ ป.5-6 (จาก IDEA.md) ============================= */
/* --- ต่อวงจรไฟฟ้า: เก็บด่านเป็น "เส้นทาง" ของช่องที่ต่อกัน (ช่องแรก = ถ่านไฟฉาย, ช่องสุดท้าย = หลอดไฟ)
   engine คำนวณชนิดชิ้น/ทิศที่เปิดจากเพื่อนบ้านเองใน renderCircuitLevel จึงไม่มีด่านที่แก้ไม่ได้
   decoys = ชิ้นหลอกที่หมุนได้แต่ไม่ได้อยู่บนเส้นทาง [r, c, หน้ากากทิศเริ่มต้น] --- */
const CIRCUIT_LEVELS = [
  { size:3, path:[[1,0],[1,1],[1,2]] },
  { size:3, path:[[2,0],[1,0],[1,1],[1,2]] },
  { size:3, path:[[2,0],[2,1],[1,1],[0,1],[0,2]] },
  { size:4, path:[[3,0],[3,1],[2,1],[2,2],[1,2],[1,3]] },
  { size:4, path:[[3,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,3]], decoys:[[0,0,10]] },
  { size:4, path:[[0,0],[1,0],[1,1],[1,2],[2,2],[3,2],[3,3]], decoys:[[3,0,10],[0,3,10]] },
  { size:5, path:[[4,0],[4,1],[3,1],[3,2],[2,2],[2,3],[1,3],[1,4]], decoys:[[0,0,10]] },
  { size:5, path:[[4,2],[3,2],[3,1],[2,1],[2,2],[2,3],[1,3],[0,3]], decoys:[[0,0,10],[4,4,10]] },
  { size:5, path:[[4,0],[3,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,3],[0,4],[1,4]], decoys:[[4,4,10],[3,3,3]] },
  { size:5, path:[[4,4],[4,3],[3,3],[3,2],[2,2],[2,1],[1,1],[1,0],[0,0]], decoys:[[0,4,10],[4,0,10]] }
];

/* --- แท็งแกรม: เงาบนเวที 280x280 px — slot = [x, y, ขนาด, ชนิดชิ้น, มุมที่ถูกต้อง(องศา)]
   ชนิดชิ้น: tri (สามเหลี่ยมมุมฉาก), tri2 (สามเหลี่ยมกลับด้าน), sq (สี่เหลี่ยม), par (สี่เหลี่ยมด้านขนาน) --- */
const TANGRAM_FIGURES = [
  { name:'บ้านหลังน้อย', emoji:'\u{1F3E0}', slots:[[100,150,80,'sq',0],[60,70,80,'tri',270],[140,70,80,'tri2',0]] },
  { name:'เรือใบ', emoji:'\u{26F5}', slots:[[110,40,90,'tri',0],[60,150,160,'par',0],[30,60,60,'tri2',90]] },
  { name:'ธง', emoji:'\u{1F6A9}', slots:[[60,50,90,'tri2',0],[60,150,90,'sq',0],[160,150,80,'tri',180]] },
  { name:'จรวด', emoji:'\u{1F680}', slots:[[100,30,80,'tri',315],[100,110,80,'sq',0],[40,190,70,'tri',0],[160,190,70,'tri2',0]] },
  { name:'ปลาน้อย', emoji:'\u{1F41F}', slots:[[40,100,90,'tri',90],[130,100,90,'sq',45],[30,20,70,'tri2',180],[150,190,70,'par',180]] },
  { name:'ต้นไม้', emoji:'\u{1F333}', slots:[[95,20,90,'tri',270],[95,100,90,'tri2',90],[120,190,50,'sq',0]] },
  { name:'ดาวตก', emoji:'\u{1F320}', slots:[[110,30,80,'tri',45],[110,110,80,'tri2',225],[20,150,90,'par',0],[170,180,70,'tri',135]] },
  { name:'ภูเขา', emoji:'\u{26F0}', slots:[[30,110,110,'tri',0],[140,110,110,'tri2',0],[100,30,80,'tri',270],[20,220,240,'sq',0]] },
  { name:'ว่าว', emoji:'\u{1FA81}', slots:[[100,30,80,'tri',270],[100,110,80,'tri2',90],[30,110,60,'tri',180],[180,110,60,'tri2',270],[110,200,60,'par',0]] },
  { name:'หุ่นยนต์', emoji:'\u{1F916}', slots:[[100,20,80,'sq',0],[80,100,120,'sq',0],[20,110,60,'tri',90],[200,110,60,'tri2',270],[110,220,60,'par',0]] }
];

/* --- กระจกวิเศษ: rows คือ "ครึ่งซ้าย" ของภาพ (0 = ช่องว่าง, 1..n = สีที่ index-1 ใน colors)
   engine จะสร้างฝั่งขวาแบบสะท้อนซ้าย-ขวาให้เอง ผู้เล่นต้องระบายให้ตรง --- */
const MIRROR_PICS = [
  { name:'หัวใจ', emoji:'\u{2764}\u{FE0F}', colors:['#FF6B8A'], rows:[
    [0,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1],[0,0,1,1],[0,0,0,1]] },
  { name:'ผีเสื้อ', emoji:'\u{1F98B}', colors:['#FF8AC5','#7C5CFC'], rows:[
    [1,1,0,2],[1,1,1,2],[0,1,1,2],[0,1,1,2],[1,1,1,2],[1,1,0,2]] },
  { name:'ต้นคริสต์มาส', emoji:'\u{1F384}', colors:['#3FA96B','#B5793C'], rows:[
    [0,0,0,1],[0,0,1,1],[0,1,1,1],[0,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,2]] },
  { name:'ดาวดวงน้อย', emoji:'\u{2B50}', colors:['#FFC53D'], rows:[
    [0,0,0,1],[0,0,1,1],[1,1,1,1],[0,1,1,1],[0,1,1,0],[1,1,0,0]] },
  { name:'ดอกไม้', emoji:'\u{1F338}', colors:['#FF7AA8','#FFD93D','#4CAF50'], rows:[
    [0,1,1,0],[1,1,1,2],[1,1,2,2],[0,1,1,2],[0,0,3,3],[0,0,0,3],[0,0,3,3]] },
  { name:'บ้านหลังน้อย', emoji:'\u{1F3E0}', colors:['#E8734C','#5E8FD8','#8D6E4B'], rows:[
    [0,0,0,1],[0,0,1,1],[0,1,1,1],[1,1,1,1],[2,2,2,2],[2,3,3,2],[2,3,3,2]] }
];

/* --- เรียงลำดับวิเศษ: ชุดการ์ดเรียงจาก "ตัวแรกสุด" ไป "ตัวท้ายสุด" ตาม prompt
   tag = ชั้นที่ใช้ชุดนี้ (p5 / p6) ต้องมีครบทุกขนาด 3, 4, 5 ใบต่อ tag --- */
const ORDER_SETS = [
  /* ===== ป.5 ===== */
  { tag:'p5', prompt:'เรียงเศษส่วนจากน้อยไปมาก', items:[{e:'\u{1F950}',l:'1/4'},{e:'\u{1F370}',l:'1/2'},{e:'\u{1F382}',l:'3/4'}] },
  { tag:'p5', prompt:'เรียงขั้นตอนของวัฏจักรน้ำ', items:[{e:'\u{2668}\u{FE0F}',l:'น้ำระเหย'},{e:'\u{2601}\u{FE0F}',l:'ควบแน่นเป็นเมฆ'},{e:'\u{1F327}\u{FE0F}',l:'ฝนตก'}] },
  { tag:'p5', prompt:'เรียงทศนิยมจากน้อยไปมาก', items:[{e:'\u{1F539}',l:'0.25'},{e:'\u{1F537}',l:'0.5'},{e:'\u{1F535}',l:'0.75'}] },
  { tag:'p5', prompt:'เรียงร้อยละจากน้อยไปมาก', items:[{e:'\u{1F95A}',l:'10%'},{e:'\u{1F34E}',l:'25%'},{e:'\u{1F349}',l:'50%'},{e:'\u{1F383}',l:'75%'}] },
  { tag:'p5', prompt:'เรียงลำดับเหตุการณ์ในโซ่อาหาร', items:[{e:'\u{1F33E}',l:'ต้นข้าว'},{e:'\u{1F997}',l:'ตั๊กแตน'},{e:'\u{1F438}',l:'กบ'},{e:'\u{1F40D}',l:'งู'}] },
  { tag:'p5', prompt:'เรียงหน่วยความยาวจากสั้นไปยาว', items:[{e:'\u{1F4CF}',l:'1 มิลลิเมตร'},{e:'\u{1F4D0}',l:'1 เซนติเมตร'},{e:'\u{1F9CD}',l:'1 เมตร'},{e:'\u{1F6E3}\u{FE0F}',l:'1 กิโลเมตร'}] },
  { tag:'p5', prompt:'เรียงอาณาจักรไทยจากเก่าไปใหม่', items:[{e:'\u{1F3EF}',l:'สุโขทัย'},{e:'\u{1F3F0}',l:'อยุธยา'},{e:'\u{1F3D8}\u{FE0F}',l:'ธนบุรี'},{e:'\u{1F3D9}\u{FE0F}',l:'รัตนโกสินทร์'},{e:'\u{1F1F9}\u{1F1ED}',l:'ปัจจุบัน'}] },
  { tag:'p5', prompt:'เรียงขั้นตอนการฝากเงินธนาคาร', items:[{e:'\u{1F437}',l:'เก็บออม'},{e:'\u{1F3E6}',l:'ไปธนาคาร'},{e:'\u{1F4DD}',l:'กรอกใบฝาก'},{e:'\u{1F4B0}',l:'ฝากเข้าบัญชี'},{e:'\u{1FA99}',l:'ได้ดอกเบี้ย'}] },
  { tag:'p5', prompt:'เรียงจำนวนจากน้อยไปมาก', items:[{e:'1\u{FE0F}\u{20E3}',l:'1/2'},{e:'2\u{FE0F}\u{20E3}',l:'0.6'},{e:'3\u{FE0F}\u{20E3}',l:'70%'},{e:'4\u{FE0F}\u{20E3}',l:'3/4'},{e:'5\u{FE0F}\u{20E3}',l:'0.9'}] },
  /* ===== ป.6 ===== */
  { tag:'p6', prompt:'เรียงลำดับการเดินทางของอาหาร', items:[{e:'\u{1F444}',l:'ปาก'},{e:'\u{1FAD9}',l:'กระเพาะอาหาร'},{e:'\u{1FA78}',l:'ลำไส้เล็ก'}] },
  { tag:'p6', prompt:'เรียงอัตราส่วนจากน้อยไปมาก', items:[{e:'\u{1F539}',l:'1 : 4'},{e:'\u{1F537}',l:'1 : 2'},{e:'\u{1F535}',l:'3 : 4'}] },
  { tag:'p6', prompt:'เรียงขั้นตอนการเกิดเงามืด', items:[{e:'\u{1F526}',l:'แสงส่องออกมา'},{e:'\u{1F9F1}',l:'วัตถุทึบแสงกั้น'},{e:'\u{1F311}',l:'เกิดเงาบนฉาก'}] },
  { tag:'p6', prompt:'เรียงเศษส่วนจากน้อยไปมาก', items:[{e:'\u{1F950}',l:'1/3'},{e:'\u{1F956}',l:'2/5'},{e:'\u{1F370}',l:'1/2'},{e:'\u{1F382}',l:'5/6'}] },
  { tag:'p6', prompt:'เรียงลำดับกระแสไฟฟ้าในวงจร', items:[{e:'\u{1F50B}',l:'ถ่านไฟฉาย'},{e:'\u{1F50C}',l:'สายไฟ'},{e:'\u{1F518}',l:'สวิตช์'},{e:'\u{1F4A1}',l:'หลอดไฟสว่าง'}] },
  { tag:'p6', prompt:'เรียงหน่วยความจุจากน้อยไปมาก', items:[{e:'\u{1F4A7}',l:'1 มิลลิลิตร'},{e:'\u{1F944}',l:'100 มิลลิลิตร'},{e:'\u{1F95B}',l:'1 ลิตร'},{e:'\u{1FAA3}',l:'10 ลิตร'}] },
  { tag:'p6', prompt:'เรียงเหตุการณ์สมัยรัตนโกสินทร์จากเก่าไปใหม่', items:[{e:'\u{1F451}',l:'สถาปนากรุงเทพฯ'},{e:'\u{26D3}\u{FE0F}',l:'เลิกทาส'},{e:'\u{1F686}',l:'มีรถไฟสายแรก'},{e:'\u{1F5F3}\u{FE0F}',l:'เปลี่ยนการปกครอง'},{e:'\u{1F3D9}\u{FE0F}',l:'ปัจจุบัน'}] },
  { tag:'p6', prompt:'เรียงลำดับทางเดินอาหารทั้งระบบ', items:[{e:'\u{1F444}',l:'ปาก'},{e:'\u{1FAC1}',l:'หลอดอาหาร'},{e:'\u{1FAD9}',l:'กระเพาะอาหาร'},{e:'\u{1FA78}',l:'ลำไส้เล็ก'},{e:'\u{1F6BD}',l:'ลำไส้ใหญ่'}] },
  { tag:'p6', prompt:'เรียงขั้นตอนวิธีการทางประวัติศาสตร์', items:[{e:'\u{2753}',l:'ตั้งคำถาม'},{e:'\u{1F4DC}',l:'รวบรวมหลักฐาน'},{e:'\u{1F50E}',l:'ตรวจสอบ'},{e:'\u{1F4A1}',l:'ตีความ'},{e:'\u{2705}',l:'สรุปผล'}] }
];

/* ============================= ระดับชั้น (GRADES) ============================= */
/* ระดับชั้นเป็นมิติจัดกลุ่มหมวด — หมวดที่ไม่มี cat.grade ถือเป็น 'prep-p1' (ของเดิมทั้งหมด)
   available:false = ยังไม่มีเนื้อหา (โชว์ในแถบเลือกชั้นแบบ "เร็วๆ นี้")
   minAge/maxAge ใช้ default ระดับชั้นตามอายุเด็ก (ดู defaultGradeForAge ใน app.js) */
/* icon = สเตจการเติบโตของนกฮูก: ไข่ (เตรียม ป.1) → ฟักออก → โตขึ้นเรื่อยๆ จนเต็มวัย (ป.6) */
const GRADES = [
  { id:'prep-p1', name:'เตรียมสอบ ป.1', short:'เตรียม ป.1', emoji:'🥚', icon:'assets/icons/grade-egg.svg',  minAge:0,  maxAge:5,  available:true  },
  { id:'p1',      name:'ประถมศึกษาปีที่ 1', short:'ป.1', emoji:'🐣', icon:'assets/icons/grade-owl1.svg', minAge:6,  maxAge:6,  available:true  },
  { id:'p2',      name:'ประถมศึกษาปีที่ 2', short:'ป.2', emoji:'🐤', icon:'assets/icons/grade-owl2.svg', minAge:7,  maxAge:7,  available:true  },
  { id:'p3',      name:'ประถมศึกษาปีที่ 3', short:'ป.3', emoji:'🦉', icon:'assets/icons/grade-owl3.svg', minAge:8,  maxAge:8,  available:true  },
  { id:'p4',      name:'ประถมศึกษาปีที่ 4', short:'ป.4', emoji:'🦉', icon:'assets/icons/grade-owl4.svg', minAge:9,  maxAge:9,  available:true  },
  { id:'p5',      name:'ประถมศึกษาปีที่ 5', short:'ป.5', emoji:'🦉', icon:'assets/icons/grade-owl5.svg', minAge:10, maxAge:10, available:true  },
  { id:'p6',      name:'ประถมศึกษาปีที่ 6', short:'ป.6', emoji:'🦉', icon:'assets/icons/grade-owl6.svg', minAge:11, maxAge:99, available:true  }
];

/* ============================= EF (เกม "นกฮูกสั่ง") ============================= */
/* คลังหมวดของ + ชื่อ ใช้สร้างกติกา "แตะเฉพาะ [หมวด]" ในเกมฝึก executive function (ดู startEfGame ใน app.js) */
const EF_CATEGORIES = {
  fruit:   { name:'ผลไม้',     items:['🍎','🍌','🍇','🍓','🍊','🍉','🍑','🥝','🍒','🍍'] },
  animal:  { name:'สัตว์บก',    items:['🐶','🐱','🐰','🐸','🐵','🦁','🐯','🐷','🐨','🐮'] },
  vehicle: { name:'ยานพาหนะ',  items:['🚗','🚌','🚲','✈️','🚂','🚀','🚁','⛵','🚜','🛵'] },
  food:    { name:'ของกิน',     items:['🍕','🍔','🍟','🍩','🍪','🍰','🌭','🍿','🍦','🍭'] },
  bug:     { name:'แมลง',       items:['🐝','🐞','🦋','🐜','🦗','🕷️','🐛','🦟'] },
  sea:     { name:'สัตว์น้ำ',   items:['🐟','🐠','🐬','🐙','🦀','🦐','🐳','🦈'] }
};

/* ============================= ROBOT LEVELS (เกม "เรียงคำสั่งหุ่นยนต์") ============================= */
/* กริด size×size (r=แถวจากบน, c=คอลัมน์จากซ้าย), dir 0=ขึ้น 1=ขวา 2=ลง 3=ซ้าย
   walls = ช่องที่เดินผ่านไม่ได้ (ต้องอ้อม) — ทุกด่านมีทางไปถึงเป้าเสมอ (ไล่ยากจากตรง→เลี้ยว→อ้อมกำแพง) */
const ROBOT_LEVELS = [
  { size:4, start:{r:3,c:0,dir:0}, goal:{r:0,c:0}, walls:[] },
  { size:4, start:{r:3,c:0,dir:1}, goal:{r:3,c:3}, walls:[] },
  { size:4, start:{r:3,c:3,dir:0}, goal:{r:0,c:3}, walls:[] },
  { size:4, start:{r:3,c:0,dir:0}, goal:{r:0,c:3}, walls:[] },
  { size:4, start:{r:3,c:3,dir:0}, goal:{r:0,c:0}, walls:[] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:4}, walls:[] },
  { size:5, start:{r:4,c:0,dir:1}, goal:{r:0,c:2}, walls:[] },
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:0}, walls:[[2,2]] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:0}, walls:[[2,0],[2,1]] },
  { size:5, start:{r:4,c:0,dir:1}, goal:{r:0,c:4}, walls:[[2,2],[3,3]] }
];
/* code2 — กลาง (5×5-6×6, กำแพงมากขึ้น ต้องอ้อม) */
const ROBOT_LEVELS2 = [
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:4}, walls:[[2,0],[2,1],[2,2]] },
  { size:5, start:{r:4,c:0,dir:1}, goal:{r:0,c:0}, walls:[[3,1],[2,1],[1,1]] },
  { size:5, start:{r:4,c:4,dir:3}, goal:{r:0,c:0}, walls:[[2,1],[2,2],[2,3]] },
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:2}, walls:[[3,1],[3,2],[1,2],[1,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,1],[3,2],[3,3],[3,4]] },
  { size:6, start:{r:5,c:0,dir:1}, goal:{r:0,c:0}, walls:[[4,1],[3,1],[2,1],[1,1]] },
  { size:6, start:{r:5,c:5,dir:0}, goal:{r:0,c:0}, walls:[[2,2],[2,3],[3,2],[3,3]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:4}, walls:[[3,1],[3,2],[3,3],[1,3],[1,4]] }
];
/* code3 — ยาก (6×6 คล้ายเขาวงกต ทางยาว) */
const ROBOT_LEVELS3 = [
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[1,1],[2,1],[3,1],[3,2],[3,3],[1,3],[1,4]] },
  { size:6, start:{r:5,c:0,dir:1}, goal:{r:0,c:0}, walls:[[4,1],[3,1],[2,1],[2,2],[2,3],[0,3],[1,3]] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:0,c:5}, walls:[[4,4],[3,4],[2,4],[2,3],[2,2],[4,2],[4,1]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:5,c:5}, walls:[[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[3,3],[3,4]] },
  { size:6, start:{r:0,c:0,dir:2}, goal:{r:5,c:5}, walls:[[1,1],[2,1],[3,1],[3,2],[3,3],[1,4],[2,4],[4,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[2,1],[2,2],[2,3],[4,3],[4,4],[0,4]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:3}, walls:[[3,1],[3,2],[3,3],[3,4],[1,1],[1,2],[1,3]] },
  { size:6, start:{r:5,c:5,dir:0}, goal:{r:0,c:0}, walls:[[4,4],[4,3],[2,1],[2,2],[3,4],[1,3],[1,4],[3,0]] }
];
/* ---- ROBOT LEVELS ป.2 (มีบัตร "ทำซ้ำ N รอบ" — เส้นทางเป็นแพทเทิร์นซ้ำ แก้ด้วย loop ได้กระชับกว่า) ----
   ไม่มีกำแพง เพื่อให้แพทเทิร์นซ้ำเดินได้ต่อเนื่อง (เดินตรง = ทำซ้ำ [เดินหน้า], บันได = ทำซ้ำ [หน้า-เลี้ยว-หน้า-เลี้ยว]) */
/* ป.2 coding (พาแมววนซ้ำ) — สิ่งกีดขวาง (พุ่มไม้) ที่ขอบ/กลางทาง ค่อยๆ เพิ่มจาก 0→4 อัน ให้เดินเลี้ยวหลบ
   ทุกด่าน BFS ยืนยันมีทางถึงบ้าน (path 3-10 ช่อง) */
const ROBOT_LEVELS_P2A = [
  { size:4, start:{r:3,c:0,dir:0}, goal:{r:0,c:0}, walls:[] },
  { size:4, start:{r:3,c:0,dir:0}, goal:{r:0,c:3}, walls:[] },
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:2}, walls:[[2,2]] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:4,c:4}, walls:[[4,2]] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:0}, walls:[[2,0]] },
  { size:5, start:{r:4,c:1,dir:0}, goal:{r:0,c:1}, walls:[[2,1]] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:4}, walls:[[2,2]] },
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:2}, walls:[[3,2],[1,2]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:0}, walls:[[3,0],[3,1]] }
];
const ROBOT_LEVELS_P2B = [
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:4}, walls:[[2,2]] },
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:2}, walls:[[3,2],[1,2]] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:4,c:4}, walls:[[3,2],[4,2]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,2],[3,3]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:2}, walls:[[4,2],[2,2]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:0}, walls:[[3,0],[3,1],[1,1]] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:0,c:0}, walls:[[5,2],[3,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[2,3],[3,4]] }
];
const ROBOT_LEVELS_P2C = [
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,2],[3,3]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:2}, walls:[[4,2],[2,2]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:5,c:5}, walls:[[5,2],[5,3],[4,4]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:0}, walls:[[3,0],[3,1],[1,1]] },
  { size:6, start:{r:0,c:0,dir:2}, goal:{r:5,c:5}, walls:[[2,2],[3,3],[4,1]] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:0,c:0}, walls:[[5,2],[3,2],[1,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[2,2],[2,4]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[3,3],[1,4],[2,0]] }
];
/* ป.3 coding (พาหุ่นยนต์ ป.3 + ทำซ้ำ) — กำแพงเยอะขึ้น (2→6 อัน) ต้องคิด route อ้อม บางด่านต้องเริ่มออกทางอื่นก่อน
   ทุกด่าน BFS ยืนยันมีทางถึงบ้าน (path 6-12 ช่อง) */
const ROBOT_LEVELS_P3A = [
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:2}, walls:[[3,2],[1,2]] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:4}, walls:[[2,1],[2,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,2],[3,3]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:2}, walls:[[4,2],[2,2],[3,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:0}, walls:[[4,0],[4,1]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:5,c:5}, walls:[[5,2],[4,2],[3,3]] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:0,c:0}, walls:[[5,2],[3,2],[3,4]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[2,2],[3,4]] },
  { size:6, start:{r:0,c:0,dir:2}, goal:{r:5,c:5}, walls:[[2,2],[2,3],[4,1]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[3,3],[1,2],[2,4]] }
];
const ROBOT_LEVELS_P3B = [
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[2,2],[3,4]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:0}, walls:[[4,0],[4,1],[2,1]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:3}, walls:[[4,2],[3,3],[2,2],[1,3]] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:0,c:0}, walls:[[5,3],[3,2],[3,4],[1,1]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:6}, walls:[[4,2],[4,3],[2,4]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:0}, walls:[[5,0],[5,1],[3,1],[3,2]] },
  { size:7, start:{r:6,c:3,dir:0}, goal:{r:0,c:3}, walls:[[5,3],[4,2],[3,4],[2,3]] },
  { size:7, start:{r:0,c:0,dir:2}, goal:{r:6,c:6}, walls:[[2,2],[3,3],[4,4],[1,4]] }
];
/* ป.3 coding แบบเงื่อนไข (if-then) — ใช้บัตร "ถ้าเจอกำแพงให้เลี้ยว" เดินตามขอบ/กำแพงจนถึงบ้าน
   เป้าหมายอยู่บนขอบเสมอ และเดินตามกำแพงตามเข็มนาฬิกา (เจอกำแพงหันขวา) ถึงได้ภายใน ~10 จังหวะ
   (ทดสอบด้วยการจำลอง ifwall แล้ว — ดู applyCodeCommand ใน app.js) */
const ROBOT_LEVELS_P3IF = [
  { size:4, start:{r:3,c:3,dir:3}, goal:{r:3,c:0}, walls:[] },
  { size:4, start:{r:3,c:0,dir:0}, goal:{r:0,c:3}, walls:[] },
  { size:4, start:{r:0,c:0,dir:1}, goal:{r:3,c:3}, walls:[] },
  { size:4, start:{r:0,c:3,dir:2}, goal:{r:3,c:0}, walls:[] },
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:4}, walls:[] },
  { size:5, start:{r:0,c:4,dir:2}, goal:{r:4,c:0}, walls:[] },
  { size:5, start:{r:4,c:4,dir:3}, goal:{r:0,c:0}, walls:[] },
  { size:5, start:{r:0,c:0,dir:1}, goal:{r:4,c:4}, walls:[] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:3}, walls:[] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:1,c:0}, walls:[] }
];
/* ป.3 ระดับยากสุด — กำแพง 4-6 อัน หลายด่านต้องเดินอ้อมไกล/เริ่มออกทางตรงข้ามก่อน (BFS ยืนยัน path 9-12 ช่อง) */
const ROBOT_LEVELS_P3C = [
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:0}, walls:[[4,0],[4,1],[2,1],[2,0]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:6}, walls:[[4,1],[4,2],[2,4],[2,5]] },
  { size:7, start:{r:6,c:3,dir:0}, goal:{r:0,c:3}, walls:[[5,3],[4,2],[4,4],[2,3],[1,2]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:0}, walls:[[5,0],[5,1],[3,1],[3,2],[1,0]] },
  { size:7, start:{r:6,c:6,dir:3}, goal:{r:0,c:0}, walls:[[6,3],[4,4],[4,2],[2,3],[2,1]] },
  { size:7, start:{r:0,c:0,dir:2}, goal:{r:6,c:6}, walls:[[2,1],[2,2],[4,4],[4,5],[3,3]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:6}, walls:[[5,1],[3,1],[3,2],[3,3],[1,4]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:6}, walls:[[4,0],[4,1],[4,2],[2,4],[2,5],[2,6]] }
];


/* ป.5 — ตาราง 6-8 ช่อง กำแพงหลายจุด ใช้ร่วมกับปุ่มวนซ้ำและเงื่อนไข "ถ้าเจอกำแพง" */
const ROBOT_LEVELS_P5A = [
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,0],[3,1],[1,4],[1,5]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:6}, walls:[[5,1],[4,2],[3,3],[2,4],[1,5]] },
  { size:7, start:{r:6,c:3,dir:0}, goal:{r:0,c:3}, walls:[[5,3],[4,3],[3,2],[3,4],[1,3]] },
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:6,c:6}, walls:[[6,3],[5,3],[4,3],[3,3]] },
  { size:8, start:{r:7,c:0,dir:0}, goal:{r:0,c:7}, walls:[[6,1],[6,2],[4,4],[4,5],[2,2],[2,3]] },
  { size:8, start:{r:7,c:7,dir:0}, goal:{r:0,c:0}, walls:[[6,6],[5,5],[4,4],[3,3],[2,2],[1,1]] },
  { size:8, start:{r:7,c:0,dir:0}, goal:{r:0,c:0}, walls:[[6,0],[6,1],[4,2],[4,3],[2,0],[2,1]] },
  { size:8, start:{r:0,c:0,dir:0}, goal:{r:7,c:7}, walls:[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]] },
  { size:8, start:{r:7,c:3,dir:0}, goal:{r:0,c:4}, walls:[[6,3],[6,4],[5,2],[5,5],[3,3],[3,4],[1,2],[1,5]] },
  { size:8, start:{r:7,c:0,dir:0}, goal:{r:0,c:7}, walls:[[6,1],[5,3],[4,5],[3,2],[2,4],[1,6],[6,6],[2,0]] }
];


/* ป.6 — ตาราง 7-9 ช่อง กำแพงซับซ้อนขึ้น ใช้ลูปร่วมกับเงื่อนไข "ถ้าเจอกำแพง" */
const ROBOT_LEVELS_P6A = [
  { size:7, start:{r:6,c:0,dir:0}, goal:{r:0,c:6}, walls:[[5,1],[4,1],[3,3],[2,3],[1,5]] },
  { size:7, start:{r:6,c:6,dir:0}, goal:{r:0,c:0}, walls:[[5,5],[4,4],[3,3],[2,2],[1,1]] },
  { size:8, start:{r:7,c:0,dir:0}, goal:{r:0,c:7}, walls:[[6,1],[6,2],[4,3],[4,4],[2,5],[2,6]] },
  { size:8, start:{r:7,c:3,dir:0}, goal:{r:0,c:4}, walls:[[6,3],[6,4],[5,2],[5,5],[3,3],[3,4],[1,2],[1,5]] },
  { size:8, start:{r:0,c:0,dir:0}, goal:{r:7,c:7}, walls:[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[1,3],[3,1]] },
  { size:9, start:{r:8,c:0,dir:0}, goal:{r:0,c:8}, walls:[[7,1],[6,2],[5,3],[4,4],[3,5],[2,6],[1,7]] },
  { size:9, start:{r:8,c:4,dir:0}, goal:{r:0,c:4}, walls:[[7,4],[6,3],[6,5],[4,4],[3,3],[3,5],[1,4]] },
  { size:9, start:{r:8,c:0,dir:0}, goal:{r:8,c:8}, walls:[[8,3],[7,3],[6,3],[5,3],[8,6],[7,6],[6,6],[5,6]] },
  { size:9, start:{r:8,c:8,dir:0}, goal:{r:0,c:0}, walls:[[7,7],[7,6],[5,5],[5,4],[3,3],[3,2],[1,1],[1,0]] },
  { size:9, start:{r:8,c:0,dir:0}, goal:{r:0,c:8}, walls:[[7,1],[7,2],[5,4],[5,5],[3,1],[3,2],[1,6],[1,7],[6,7]] }
];

/* ============================= SCIENCE PREDICT-CHECK (นักวิทย์ทายผล — Phase 1.4)
   เด็ก "ทายก่อน" ว่าจะเกิดอะไร (ลอย/จม, แม่เหล็กดูด/ไม่ดูด ฯลฯ) แล้วดู "ผลจริง" เฉลย + เหตุผลสั้นๆ
   แต่ละ kind มีชุดตัวเลือกคงที่ + รูปแบบเวที (water = ถังน้ำ, box = กล่องทดลอง)
   แต่ละข้อ: { kind, obj(emoji ของทดลอง), q(คำถาม), ans(key คำตอบถูก), why(เหตุผลสั้น) } */
const SCIENCE_KINDS = {
  float:    { stage:'water', choices:[{k:'float',e:'🎈',l:'ลอย'},{k:'sink',e:'⚓',l:'จม'}] },
  magnet:   { stage:'box',   choices:[{k:'yes',e:'🧲',l:'ดูดติด'},{k:'no',e:'🍃',l:'ไม่ติด'}] },
  living:   { stage:'box',   choices:[{k:'yes',e:'🌱',l:'มีชีวิต'},{k:'no',e:'🧊',l:'ไม่มีชีวิต'}] },
  hotcold:  { stage:'box',   choices:[{k:'hot',e:'🔥',l:'ร้อน'},{k:'cold',e:'❄️',l:'เย็น'}] },
  daynight: { stage:'box',   choices:[{k:'day',e:'🌞',l:'กลางวัน'},{k:'night',e:'🌙',l:'กลางคืน'}] },
  melt:     { stage:'box',   choices:[{k:'yes',e:'💧',l:'ละลาย'},{k:'no',e:'🧱',l:'ไม่ละลาย'}] },
  absorb:   { stage:'box',   choices:[{k:'yes',e:'💧',l:'ดูดซับน้ำ'},{k:'no',e:'🚫',l:'ไม่ดูดซับ'}] }
};
/* เกม 1: ลอยหรือจม (float/sink) — เวทีถังน้ำ ของลอยขึ้น/จมลงจริง */
const SCIENCE_FLOAT = [
  { kind:'float', obj:'🍎', q:'แอปเปิลจะลอยหรือจมน้ำ?', ans:'float', why:'แอปเปิลมีอากาศข้างใน จึงลอยน้ำได้' },
  { kind:'float', obj:'🍌', q:'กล้วยจะลอยหรือจมน้ำ?', ans:'float', why:'กล้วยเบากว่าน้ำ จึงลอย' },
  { kind:'float', obj:'🦆', q:'เป็ดยางจะลอยหรือจมน้ำ?', ans:'float', why:'เป็ดยางกลวงมีอากาศ จึงลอย' },
  { kind:'float', obj:'🍂', q:'ใบไม้จะลอยหรือจมน้ำ?', ans:'float', why:'ใบไม้บางเบา ลอยบนผิวน้ำ' },
  { kind:'float', obj:'🪵', q:'ท่อนไม้จะลอยหรือจมน้ำ?', ans:'float', why:'ไม้เบากว่าน้ำ จึงลอย' },
  { kind:'float', obj:'🧽', q:'ฟองน้ำจะลอยหรือจมน้ำ?', ans:'float', why:'ฟองน้ำมีรูอากาศเยอะ จึงลอย' },
  { kind:'float', obj:'⛵', q:'เรือจะลอยหรือจมน้ำ?', ans:'float', why:'เรือออกแบบมาให้ลอยน้ำได้' },
  { kind:'float', obj:'🪶', q:'ขนนกจะลอยหรือจมน้ำ?', ans:'float', why:'ขนนกเบามาก จึงลอยน้ำ' },
  { kind:'float', obj:'🍊', q:'ส้มจะลอยหรือจมน้ำ?', ans:'float', why:'เปลือกส้มมีอากาศ จึงลอย' },
  { kind:'float', obj:'🎈', q:'ลูกโป่งจะลอยหรือจมน้ำ?', ans:'float', why:'ลูกโป่งมีอากาศ จึงลอยน้ำ' },
  { kind:'float', obj:'🧊', q:'น้ำแข็งจะลอยหรือจมน้ำ?', ans:'float', why:'น้ำแข็งเบากว่าน้ำนิดหน่อย จึงลอย' },
  { kind:'float', obj:'🏀', q:'ลูกบอลจะลอยหรือจมน้ำ?', ans:'float', why:'ลูกบอลมีอากาศข้างใน จึงลอย' },
  { kind:'float', obj:'🧴', q:'ขวดพลาสติกเปล่าจะลอยหรือจม?', ans:'float', why:'ขวดเปล่ามีอากาศ จึงลอย' },
  { kind:'float', obj:'🪨', q:'ก้อนหินจะลอยหรือจมน้ำ?', ans:'sink', why:'หินหนักกว่าน้ำ จึงจมลง' },
  { kind:'float', obj:'🔑', q:'กุญแจจะลอยหรือจมน้ำ?', ans:'sink', why:'กุญแจเป็นโลหะหนัก จึงจม' },
  { kind:'float', obj:'🥄', q:'ช้อนโลหะจะลอยหรือจมน้ำ?', ans:'sink', why:'ช้อนโลหะหนัก จึงจมลง' },
  { kind:'float', obj:'🪙', q:'เหรียญจะลอยหรือจมน้ำ?', ans:'sink', why:'เหรียญโลหะหนัก จึงจม' },
  { kind:'float', obj:'🔩', q:'น็อตจะลอยหรือจมน้ำ?', ans:'sink', why:'น็อตเหล็กหนัก จึงจมลง' },
  { kind:'float', obj:'🧱', q:'ก้อนอิฐจะลอยหรือจมน้ำ?', ans:'sink', why:'อิฐหนักมาก จึงจมลง' },
  { kind:'float', obj:'⚓', q:'สมอเรือจะลอยหรือจมน้ำ?', ans:'sink', why:'สมอทำจากเหล็กหนัก จึงจม' },
  { kind:'float', obj:'🔨', q:'ค้อนจะลอยหรือจมน้ำ?', ans:'sink', why:'หัวค้อนเป็นเหล็กหนัก จึงจม' },
  { kind:'float', obj:'✂️', q:'กรรไกรจะลอยหรือจมน้ำ?', ans:'sink', why:'กรรไกรโลหะหนัก จึงจมลง' },
  { kind:'float', obj:'🍶', q:'ขวดที่เต็มไปด้วยน้ำจะลอยหรือจม?', ans:'sink', why:'ขวดที่มีน้ำเต็มหนัก จึงจม' }
];
/* เกม 2: วิทยาศาสตร์รอบตัว — แม่เหล็ก / ร้อน-เย็น / กลางวัน-คืน / ละลาย / สิ่งมีชีวิต (เวทีกล่องทดลอง) */
const SCIENCE_MIX = [
  { kind:'magnet', obj:'🔑', q:'แม่เหล็กจะดูดกุญแจติดไหม?', ans:'yes', why:'กุญแจเป็นเหล็ก แม่เหล็กดูดติด' },
  { kind:'magnet', obj:'📎', q:'แม่เหล็กจะดูดคลิปหนีบติดไหม?', ans:'yes', why:'คลิปทำจากเหล็ก แม่เหล็กดูดติด' },
  { kind:'magnet', obj:'🔩', q:'แม่เหล็กจะดูดน็อตติดไหม?', ans:'yes', why:'น็อตเป็นเหล็ก แม่เหล็กดูดติด' },
  { kind:'magnet', obj:'🥄', q:'แม่เหล็กจะดูดช้อนโลหะติดไหม?', ans:'yes', why:'ช้อนโลหะบางชนิดถูกแม่เหล็กดูดติด' },
  { kind:'magnet', obj:'🍎', q:'แม่เหล็กจะดูดแอปเปิลติดไหม?', ans:'no', why:'ผลไม้ไม่ใช่โลหะ แม่เหล็กไม่ดูด' },
  { kind:'magnet', obj:'✏️', q:'แม่เหล็กจะดูดดินสอไม้ติดไหม?', ans:'no', why:'ดินสอทำจากไม้ แม่เหล็กไม่ดูด' },
  { kind:'magnet', obj:'🧸', q:'แม่เหล็กจะดูดตุ๊กตาผ้าติดไหม?', ans:'no', why:'ตุ๊กตาเป็นผ้า แม่เหล็กไม่ดูด' },
  { kind:'magnet', obj:'📕', q:'แม่เหล็กจะดูดหนังสือติดไหม?', ans:'no', why:'หนังสือเป็นกระดาษ แม่เหล็กไม่ดูด' },
  { kind:'hotcold', obj:'🔥', q:'ไฟร้อนหรือเย็น?', ans:'hot', why:'ไฟให้ความร้อน จึงร้อน' },
  { kind:'hotcold', obj:'☕', q:'กาแฟเพิ่งชงร้อนหรือเย็น?', ans:'hot', why:'เครื่องดื่มเพิ่งชงเสร็จจะร้อน' },
  { kind:'hotcold', obj:'🍜', q:'บะหมี่เพิ่งต้มร้อนหรือเย็น?', ans:'hot', why:'อาหารเพิ่งต้มเสร็จจะร้อน' },
  { kind:'hotcold', obj:'🌋', q:'ลาวาภูเขาไฟร้อนหรือเย็น?', ans:'hot', why:'ลาวาร้อนจัดมาก' },
  { kind:'hotcold', obj:'🧊', q:'น้ำแข็งร้อนหรือเย็น?', ans:'cold', why:'น้ำแข็งเย็นมาก' },
  { kind:'hotcold', obj:'🍦', q:'ไอศกรีมร้อนหรือเย็น?', ans:'cold', why:'ไอศกรีมแช่แข็ง จึงเย็น' },
  { kind:'hotcold', obj:'❄️', q:'หิมะร้อนหรือเย็น?', ans:'cold', why:'หิมะเย็นจัด' },
  { kind:'daynight', obj:'🌞', q:'เห็นพระอาทิตย์บนฟ้า ตอนนี้กลางวันหรือกลางคืน?', ans:'day', why:'พระอาทิตย์ขึ้น = กลางวัน' },
  { kind:'daynight', obj:'🐓', q:'ไก่ขันกุ๊กกู๋ ตอนนี้กลางวันหรือกลางคืน?', ans:'day', why:'ไก่ขันตอนเช้า = กลางวัน' },
  { kind:'daynight', obj:'🌙', q:'เห็นพระจันทร์บนฟ้า ตอนนี้กลางวันหรือกลางคืน?', ans:'night', why:'พระจันทร์ขึ้น = กลางคืน' },
  { kind:'daynight', obj:'⭐', q:'เห็นดาวเต็มฟ้า ตอนนี้กลางวันหรือกลางคืน?', ans:'night', why:'ดาวเห็นชัดตอนกลางคืน' },
  { kind:'daynight', obj:'🦉', q:'นกฮูกตื่นออกหากิน ตอนนี้กลางวันหรือกลางคืน?', ans:'night', why:'นกฮูกออกหากินตอนกลางคืน' },
  { kind:'melt', obj:'🍦', q:'วางไอศกรีมกลางแดด จะละลายไหม?', ans:'yes', why:'ความร้อนทำให้ไอศกรีมละลาย' },
  { kind:'melt', obj:'🧊', q:'วางน้ำแข็งกลางแดด จะละลายไหม?', ans:'yes', why:'น้ำแข็งเจอความร้อนจะละลายเป็นน้ำ' },
  { kind:'melt', obj:'🍫', q:'วางช็อกโกแลตกลางแดด จะละลายไหม?', ans:'yes', why:'ช็อกโกแลตเจอความร้อนจะละลาย' },
  { kind:'melt', obj:'🕯️', q:'จุดเทียน ขี้ผึ้งจะละลายไหม?', ans:'yes', why:'ความร้อนจากไฟทำให้เทียนละลาย' },
  { kind:'melt', obj:'🪨', q:'วางก้อนหินกลางแดด จะละลายไหม?', ans:'no', why:'ก้อนหินแข็ง แดดธรรมดาไม่ทำให้ละลาย' },
  { kind:'melt', obj:'🥄', q:'วางช้อนโลหะกลางแดด จะละลายไหม?', ans:'no', why:'ช้อนโลหะไม่ละลายด้วยแดดธรรมดา' },
  { kind:'living', obj:'🐶', q:'สุนัขเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'สุนัขกินอาหาร หายใจ เคลื่อนไหวได้' },
  { kind:'living', obj:'🌳', q:'ต้นไม้เป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ต้นไม้เติบโตและต้องการน้ำ แสง' },
  { kind:'living', obj:'🦋', q:'ผีเสื้อเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ผีเสื้อบินได้ กินอาหาร เป็นสิ่งมีชีวิต' },
  { kind:'living', obj:'🐟', q:'ปลาเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ปลาว่ายน้ำ หายใจ เป็นสิ่งมีชีวิต' },
  { kind:'living', obj:'🪑', q:'เก้าอี้เป็นสิ่งมีชีวิตไหม?', ans:'no', why:'เก้าอี้ไม่กิน ไม่โต ไม่มีชีวิต' },
  { kind:'living', obj:'🚗', q:'รถยนต์เป็นสิ่งมีชีวิตไหม?', ans:'no', why:'รถเป็นเครื่องจักร ไม่มีชีวิต' },
  { kind:'living', obj:'📱', q:'โทรศัพท์เป็นสิ่งมีชีวิตไหม?', ans:'no', why:'โทรศัพท์เป็นสิ่งของ ไม่มีชีวิต' }
];
/* เกม ป.2: มีชีวิต/ไม่มีชีวิต (ว 1.3) — จำแนกสิ่งมีชีวิตกับสิ่งไม่มีชีวิต */
const SCIENCE_LIVING_P2 = [
  { kind:'living', obj:'🐱', q:'แมวเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'แมวกินอาหาร หายใจ เคลื่อนไหวได้ จึงมีชีวิต' },
  { kind:'living', obj:'🌻', q:'ดอกทานตะวันเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ต้นไม้เติบโตและต้องการน้ำ แสง จึงมีชีวิต' },
  { kind:'living', obj:'🐛', q:'หนอนเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'หนอนกินอาหารและเคลื่อนไหวได้ จึงมีชีวิต' },
  { kind:'living', obj:'🐔', q:'ไก่เป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ไก่กินอาหาร ออกไข่ มีลูก จึงมีชีวิต' },
  { kind:'living', obj:'🌱', q:'ต้นกล้าเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ต้นกล้าเติบโตขึ้นได้ จึงมีชีวิต' },
  { kind:'living', obj:'🐸', q:'กบเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'กบกินอาหารและกระโดดได้ จึงมีชีวิต' },
  { kind:'living', obj:'🐝', q:'ผึ้งเป็นสิ่งมีชีวิตไหม?', ans:'yes', why:'ผึ้งบินและหาอาหาร จึงมีชีวิต' },
  { kind:'living', obj:'🪨', q:'ก้อนหินเป็นสิ่งมีชีวิตไหม?', ans:'no', why:'ก้อนหินไม่กิน ไม่โต ไม่มีชีวิต' },
  { kind:'living', obj:'🧸', q:'ตุ๊กตาหมีเป็นสิ่งมีชีวิตไหม?', ans:'no', why:'ตุ๊กตาเป็นของเล่น ไม่มีชีวิต' },
  { kind:'living', obj:'⚽', q:'ลูกบอลเป็นสิ่งมีชีวิตไหม?', ans:'no', why:'ลูกบอลเป็นสิ่งของ ไม่มีชีวิต' },
  { kind:'living', obj:'🍽️', q:'จานข้าวเป็นสิ่งมีชีวิตไหม?', ans:'no', why:'จานเป็นภาชนะ ไม่มีชีวิต' },
  { kind:'living', obj:'🧊', q:'ก้อนน้ำแข็งเป็นสิ่งมีชีวิตไหม?', ans:'no', why:'น้ำแข็งไม่กิน ไม่โต ไม่มีชีวิต' }
];
/* เกม ป.2: วัสดุดูดซับน้ำ (ว 2.1) — ทายว่าวัสดุดูดซับน้ำได้ไหม */
const SCIENCE_ABSORB_P2 = [
  { kind:'absorb', obj:'🧻', q:'กระดาษทิชชู่จะดูดซับน้ำไหม?', ans:'yes', why:'ทิชชู่ดูดซับน้ำได้ดี จึงใช้ซับน้ำ' },
  { kind:'absorb', obj:'🧽', q:'ฟองน้ำจะดูดซับน้ำไหม?', ans:'yes', why:'ฟองน้ำมีรูพรุน ดูดซับน้ำได้มาก' },
  { kind:'absorb', obj:'👕', q:'เสื้อผ้าจะดูดซับน้ำไหม?', ans:'yes', why:'ผ้าดูดซับน้ำได้ จึงใช้เช็ดตัว' },
  { kind:'absorb', obj:'🧦', q:'ถุงเท้าผ้าจะดูดซับน้ำไหม?', ans:'yes', why:'ถุงเท้าทำจากผ้า ดูดซับน้ำได้' },
  { kind:'absorb', obj:'📄', q:'กระดาษจะดูดซับน้ำไหม?', ans:'yes', why:'กระดาษดูดซับน้ำได้ (จะเปียกยุ่ย)' },
  { kind:'absorb', obj:'🍞', q:'ขนมปังจะดูดซับน้ำไหม?', ans:'yes', why:'ขนมปังมีรูพรุน ดูดซับน้ำได้' },
  { kind:'absorb', obj:'🪨', q:'ก้อนหินจะดูดซับน้ำไหม?', ans:'no', why:'หินแข็งตัน น้ำซึมเข้าไม่ได้' },
  { kind:'absorb', obj:'🥤', q:'แก้วพลาสติกจะดูดซับน้ำไหม?', ans:'no', why:'พลาสติกไม่ดูดซับน้ำ' },
  { kind:'absorb', obj:'🪟', q:'กระจกจะดูดซับน้ำไหม?', ans:'no', why:'กระจกผิวเรียบตัน น้ำไม่ซึม' },
  { kind:'absorb', obj:'🧴', q:'ขวดพลาสติกจะดูดซับน้ำไหม?', ans:'no', why:'พลาสติกไม่ดูดซับน้ำ' },
  { kind:'absorb', obj:'☂️', q:'ผ้าร่มกันฝนจะดูดซับน้ำไหม?', ans:'no', why:'ผ้าร่มเคลือบกันน้ำ จึงไม่ดูดซับ' },
  { kind:'absorb', obj:'🪙', q:'เหรียญโลหะจะดูดซับน้ำไหม?', ans:'no', why:'โลหะตันแข็ง น้ำซึมเข้าไม่ได้' }
];
/* ป.5 — การละลายของสารในน้ำ (ว 2.1): สารบางชนิดละลายเป็นสารละลาย บางชนิดไม่ละลาย */
const SCIENCE_SOLUBLE_P5 = [
  { kind:'melt', obj:'🧂', q:'เกลือแกงจะละลายในน้ำไหม?', ans:'yes', why:'เกลือละลายน้ำได้ดี กลายเป็นน้ำเกลือที่เป็นเนื้อเดียวกัน' },
  { kind:'melt', obj:'🍬', q:'น้ำตาลทรายจะละลายในน้ำไหม?', ans:'yes', why:'น้ำตาลละลายน้ำได้ ยิ่งคนและใช้น้ำอุ่นยิ่งละลายเร็ว' },
  { kind:'melt', obj:'☕', q:'ผงกาแฟจะละลายในน้ำร้อนไหม?', ans:'yes', why:'ผงกาแฟสำเร็จรูปละลายน้ำได้ กลายเป็นสารละลายสีน้ำตาล' },
  { kind:'melt', obj:'🧁', q:'ผงฟูจะละลายในน้ำไหม?', ans:'yes', why:'ผงฟูละลายน้ำได้และอาจมีฟองแก๊สเกิดขึ้นด้วย' },
  { kind:'melt', obj:'🥤', q:'ผงน้ำหวานจะละลายในน้ำไหม?', ans:'yes', why:'ผงน้ำหวานละลายจนน้ำเปลี่ยนสีและรสเป็นเนื้อเดียวกัน' },
  { kind:'melt', obj:'🥛', q:'นมผงจะละลายในน้ำอุ่นไหม?', ans:'yes', why:'นมผงถูกทำมาให้ละลายน้ำได้ จึงชงดื่มได้' },
  { kind:'melt', obj:'🏖️', q:'ทรายจะละลายในน้ำไหม?', ans:'no', why:'ทรายไม่ละลายน้ำ จะตกตะกอนอยู่ก้นภาชนะ' },
  { kind:'melt', obj:'🫗', q:'น้ำมันพืชจะละลายในน้ำไหม?', ans:'no', why:'น้ำมันไม่ละลายน้ำ จึงลอยแยกชั้นอยู่ด้านบน' },
  { kind:'melt', obj:'🪨', q:'ก้อนหินจะละลายในน้ำไหม?', ans:'no', why:'หินไม่ละลายน้ำ ยังคงเป็นก้อนเหมือนเดิม' },
  { kind:'melt', obj:'🖍️', q:'ชอล์กจะละลายในน้ำไหม?', ans:'no', why:'ชอล์กไม่ละลาย เพียงแตกเป็นผงขุ่นแล้วตกตะกอน' },
  { kind:'melt', obj:'🧴', q:'ชิ้นพลาสติกจะละลายในน้ำไหม?', ans:'no', why:'พลาสติกไม่ละลายน้ำ จึงเป็นขยะที่ตกค้างได้นาน' },
  { kind:'melt', obj:'🔩', q:'ตะปูเหล็กจะละลายในน้ำไหม?', ans:'no', why:'เหล็กไม่ละลายน้ำ แต่ถ้าแช่นานจะเกิดสนิมได้' },
  { kind:'melt', obj:'🍫', q:'ผงโกโก้จะละลายในน้ำอุ่นไหม?', ans:'yes', why:'ผงโกโก้ละลายน้ำอุ่นได้ กลายเป็นเครื่องดื่มเนื้อเดียวกัน' },
  { kind:'melt', obj:'🍯', q:'น้ำผึ้งจะละลายในน้ำไหม?', ans:'yes', why:'น้ำผึ้งผสมกับน้ำจนเป็นเนื้อเดียวกันได้' },
  { kind:'melt', obj:'💊', q:'ยาผงชนิดละลายน้ำจะละลายไหม?', ans:'yes', why:'ยาผงชนิดนี้ถูกทำมาให้ละลายน้ำก่อนดื่ม' },
  { kind:'melt', obj:'🧃', q:'ผงเกลือแร่จะละลายในน้ำไหม?', ans:'yes', why:'ผงเกลือแร่ละลายน้ำได้ จึงใช้ชงดื่มเวลาเสียเหงื่อมาก' },
  { kind:'melt', obj:'🪵', q:'ชิ้นไม้จะละลายในน้ำไหม?', ans:'no', why:'ไม้ไม่ละลายน้ำ ได้แต่ลอยหรืออมน้ำไว้เท่านั้น' },
  { kind:'melt', obj:'🧽', q:'ยางลบจะละลายในน้ำไหม?', ans:'no', why:'ยางลบไม่ละลายน้ำ ยังคงรูปเดิมทุกอย่าง' },
  { kind:'melt', obj:'🍃', q:'ใบไม้จะละลายในน้ำไหม?', ans:'no', why:'ใบไม้ไม่ละลาย เพียงแต่เปียกน้ำและจมหรือลอยอยู่' },
  { kind:'melt', obj:'🪙', q:'เหรียญบาทจะละลายในน้ำไหม?', ans:'no', why:'เหรียญเป็นโลหะแข็ง ไม่ละลายน้ำ' }
];
/* ป.6 — การแยกสารด้วยแม่เหล็ก (ว 2.1): แยกได้เฉพาะสารที่เป็นสารแม่เหล็กเท่านั้น */
const SCIENCE_MAGNET_P6 = [
  { kind:'magnet', obj:'🔩', q:'ใช้แม่เหล็กแยกตะปูเหล็กออกจากทรายได้ไหม?', ans:'yes', why:'ตะปูทำจากเหล็กซึ่งเป็นสารแม่เหล็ก จึงถูกดูดออกมาได้' },
  { kind:'magnet', obj:'📎', q:'ใช้แม่เหล็กแยกคลิปหนีบกระดาษออกจากเศษกระดาษได้ไหม?', ans:'yes', why:'คลิปทำจากลวดเหล็ก แม่เหล็กจึงดูดขึ้นมาได้' },
  { kind:'magnet', obj:'🔪', q:'ใช้แม่เหล็กแยกเข็มเย็บผ้าออกจากกองด้ายได้ไหม?', ans:'yes', why:'เข็มเป็นเหล็ก แม่เหล็กจึงดูดออกจากด้ายได้ง่าย' },
  { kind:'magnet', obj:'🗝️', q:'ใช้แม่เหล็กแยกกุญแจเหล็กออกจากเมล็ดถั่วได้ไหม?', ans:'yes', why:'กุญแจที่ทำจากเหล็กถูกแม่เหล็กดูดติด' },
  { kind:'magnet', obj:'🪙', q:'ใช้แม่เหล็กแยกเหรียญบางชนิดที่มีเหล็กผสมออกมาได้ไหม?', ans:'yes', why:'เหรียญที่มีเหล็กเป็นส่วนผสมจะถูกแม่เหล็กดูดได้' },
  { kind:'magnet', obj:'🔧', q:'ใช้แม่เหล็กแยกน็อตและสกรูออกจากขี้เลื่อยได้ไหม?', ans:'yes', why:'น็อตและสกรูส่วนใหญ่ทำจากเหล็ก จึงถูกดูดออกได้' },
  { kind:'magnet', obj:'🧵', q:'ใช้แม่เหล็กแยกด้ายออกจากผ้าได้ไหม?', ans:'no', why:'ด้ายและผ้าไม่ใช่สารแม่เหล็ก ต้องใช้วิธีหยิบออกแทน' },
  { kind:'magnet', obj:'🪨', q:'ใช้แม่เหล็กแยกก้อนกรวดออกจากทรายได้ไหม?', ans:'no', why:'กรวดไม่ใช่สารแม่เหล็ก ควรใช้การร่อนด้วยตะแกรงแทน' },
  { kind:'magnet', obj:'🧂', q:'ใช้แม่เหล็กแยกเกลือที่ละลายในน้ำออกมาได้ไหม?', ans:'no', why:'เกลือละลายน้ำและไม่ใช่สารแม่เหล็ก ต้องใช้การระเหย' },
  { kind:'magnet', obj:'🍃', q:'ใช้แม่เหล็กแยกเศษใบไม้ออกจากน้ำได้ไหม?', ans:'no', why:'ใบไม้ไม่ถูกแม่เหล็กดูด ควรใช้การกรองแทน' },
  { kind:'magnet', obj:'🧴', q:'ใช้แม่เหล็กแยกชิ้นพลาสติกออกจากกองทรายได้ไหม?', ans:'no', why:'พลาสติกไม่ใช่สารแม่เหล็ก จึงต้องหยิบหรือร่อนออก' },
  { kind:'magnet', obj:'🪵', q:'ใช้แม่เหล็กแยกเศษไม้ออกจากเศษหินได้ไหม?', ans:'no', why:'ทั้งไม้และหินไม่ใช่สารแม่เหล็ก แม่เหล็กจึงช่วยไม่ได้' }
];
const SCIENCE_POOLS = { sci1: SCIENCE_FLOAT, sci2: SCIENCE_MIX, p2living: SCIENCE_LIVING_P2, p2absorb: SCIENCE_ABSORB_P2, p5soluble: SCIENCE_SOLUBLE_P5, p6magnet: SCIENCE_MAGNET_P6 };

/* ============================= LISTEN WORDS (เกมฟังคำศัพท์ 1/2) ============================= */
/* คำศัพท์ภาษาอังกฤษ 3 ตัวอักษร ทุกคำมีตัวอักษรไม่ซ้ำกันเอง (ง่ายต่อการสุ่มการ์ดตัวหลอกไม่ให้ปนกับตัวอักษรของคำตอบ) */
/* คลังคำอังกฤษของเกมฟังคำศัพท์ — แบ่งบัคเก็ตตามจำนวนตัวอักษร (3-7) เพื่อไล่ความยากตามระดับชั้น
   ผ่าน cat.wordLens (เช่น ป.4 ใช้ [5,6,7]) — ดู listenWordLen() ใน app.js
   *** กติกาคลังคำ: ตัวอักษรในคำเดียวกันห้ามซ้ำกันเอง *** เพราะ engine ใช้ตัวอักษรเป็น key ของการ์ด (listenGame.cardEls) */
const LISTEN_WORDS = {
  3: [
    'cat','dog','sun','pen','cup','hat','bag','box','bed','bus',
    'car','fan','jar','key','log','map','net','owl','pig','top',
    'van','web','ant','arm','bat','cow','fox','gum','hen','kit',
    'lip','red','wet','zip','mud','nut','oil','pot','rat','sit',
    'ten','wig','yes','leg','ear','ice','sky','sea','toe','cap',
    'jet','bun','mop','saw','tub'
  ],
  4: [
    'bird','fish','star','boat','milk','cake','lion','frog','duck','bear',
    'hand','lamp','ring','sand','snow','rain','wind','gold','farm','corn',
    'salt','soup','desk','sock','road','mask','wolf','coin','ship','wing',
    'nest','cold','warm','fire','lake','gift','drum','harp','pear','rice'
  ],
  5: [
    'plant','water','bread','tiger','horse','bench','cloud','grape','light','night',
    'stone','chair','table','mouse','snake','whale','beach','train','brush','stamp',
    'sword','plane','shirt','dance','fruit','north','world','month','sugar','tulip',
    'bland','crown','field','glove','heart','juice','knife','maple','pilot','shelf'
  ],
  6: [
    'garden','orange','monkey','pencil','jacket','silver','basket','flower','dragon','forest',
    'market','planet','rocket','castle','guitar','hunter','island','jungle','muscle','number',
    'parent','branch','spider','winter','yogurt','bridge','candle','donkey','shrimp','fabric'
  ],
  7: [
    'dolphin','rainbow','blanket','kitchen','picture','leopard','thunder','holiday','journey','machine',
    'monster','pyramid','subject','crystal','ostrich','panther','organic','uniform','brownie','antique'
  ],
  /* 8 ตัวอักษร (ป.5) — ตัวอักษรในคำเดียวกันไม่ซ้ำกันเองตามกติกาคลังคำ */
  8: [
    'dinosaur','hospital','computer','sandwich','birthday','keyboard','triangle','daughter','dolphins','children',
    'painters','pictures','sunlight','machines','campsite','flamingo','chimneys','pyramids','thunders','clothing'
  ],
  /* 9 ตัวอักษร (ป.6) — ตัวอักษรในคำเดียวกันไม่ซ้ำกันเองตามกติกาคลังคำ */
  9: [
    'moustache','blueprint','microwave','wonderful','duplicate','gymnastic','lifeguard','birthdays','cupboards','keyboards'
  ]
};


/* ============================= CLOZE SENTENCES (เกม "ฟังประโยค เติมคำในช่องว่าง") =============================
   เครื่องอ่านออกเสียง "ทั้งประโยค" แต่บนจอเว้นช่องว่าง 1-2 ช่อง ให้เด็กเลือกการ์ดคำมาเติม
   โครงสร้าง: t = โทเคนของประโยค (แยกคำ), b = index ของคำที่เว้นเป็นช่องว่างได้, e = emoji ประกอบ
   ตัวหลอกสุ่มจากคำที่เว้นได้ของประโยคอื่นในชุดเดียวกัน (ชนิดคำใกล้เคียงกัน จึงเป็นตัวหลอกที่ดี)
   ชุดไล่ระดับ: thA (เตรียม ป.1) → thB (ป.1) → thC (ป.2) → thD (ป.3) → thE (ป.4)
                enA (ป.2) → enB (ป.3) → enC (ป.4) */
const CLOZE_SETS = {
  /* ---- en1 (เตรียม ป.1): 3-4 คำ คำศัพท์พื้นฐานที่สุด ---- */
  en1: { lang:'en', items:[
    { t:['The','cat','is','big'], b:[1,3], e:'🐱' },
    { t:['I','see','a','dog'], b:[1,3], e:'🐶' },
    { t:['The','sun','is','hot'], b:[1,3], e:'☀️' },
    { t:['The','ball','is','round'], b:[1,3], e:'⚽' },
    { t:['I','like','red','apples'], b:[2,3], e:'🍎' },
    { t:['The','dog','can','run'], b:[1,3], e:'🐕' },
    { t:['She','has','a','book'], b:[1,3], e:'📕' },
    { t:['We','go','to','school'], b:[1,3], e:'🏫' },
    { t:['Birds','can','fly','high'], b:[0,2], e:'🐦' },
    { t:['My','mother','cooks','rice'], b:[1,3], e:'🍚' },
    { t:['The','fish','swims','fast'], b:[1,2], e:'🐟' },
    { t:['I','drink','cold','milk'], b:[1,3], e:'🥛' },
    { t:['He','plays','with','friends'], b:[1,3], e:'🧒' },
    { t:['The','flower','is','pretty'], b:[1,3], e:'🌸' },
    { t:['The','bird','can','sing'], b:[1,3], e:'🐤' },
    { t:['I','have','two','pens'], b:[2,3], e:'🖊️' },
    { t:['We','eat','fresh','fruit'], b:[1,3], e:'🍇' },
    { t:['My','father','likes','coffee'], b:[1,3], e:'☕' },
    { t:['The','baby','is','happy'], b:[1,3], e:'👶' },
    { t:['Cats','drink','warm','milk'], b:[0,2], e:'🐈' },
    { t:['She','wears','a','hat'], b:[1,3], e:'🧢' },
    { t:['The','tree','is','tall'], b:[1,3], e:'🌳' },
    { t:['I','can','ride','bikes'], b:[2,3], e:'🚲' },
    { t:['The','box','is','heavy'], b:[1,3], e:'📦' },
    { t:['We','play','after','school'], b:[1,3], e:'🎒' },
    { t:['The','moon','is','bright'], b:[1,3], e:'🌙' },
    { t:['I','wash','my','hands'], b:[1,3], e:'🧼' },
    { t:['The','frog','can','jump'], b:[1,3], e:'🐸' },
    { t:['My','bag','is','blue'], b:[1,3], e:'🎒' },
    { t:['We','love','our','teacher'], b:[1,3], e:'👩‍🏫' }
  ]},
  /* ---- en2 (ป.1): 4-5 คำ เริ่มมีคำขยาย ---- */
  en2: { lang:'en', items:[
    { t:['The','little','cat','drinks','milk'], b:[1,2,4], e:'🐱' },
    { t:['My','sister','reads','a','book'], b:[1,2,4], e:'📖' },
    { t:['We','plant','trees','every','year'], b:[1,2,4], e:'🌱' },
    { t:['The','red','bird','sings','sweetly'], b:[1,3,4], e:'🐦' },
    { t:['I','eat','rice','and','eggs'], b:[1,2,4], e:'🍚' },
    { t:['The','big','elephant','eats','grass'], b:[1,2,4], e:'🐘' },
    { t:['She','draws','a','pretty','picture'], b:[1,3,4], e:'🎨' },
    { t:['We','walk','to','the','park'], b:[1,4], e:'🌳' },
    { t:['My','father','drives','a','car'], b:[1,2,4], e:'🚗' },
    { t:['The','baby','sleeps','in','bed'], b:[1,2,4], e:'👶' },
    { t:['Birds','build','nests','on','trees'], b:[1,2,4], e:'🪺' },
    { t:['I','wear','a','warm','coat'], b:[1,3,4], e:'🧥' },
    { t:['The','dog','runs','very','fast'], b:[1,2,3], e:'🐕' },
    { t:['We','wash','our','hands','first'], b:[1,3,4], e:'🧼' },
    { t:['My','friend','has','three','cats'], b:[1,3,4], e:'🐈' },
    { t:['The','fish','swim','in','water'], b:[1,2,4], e:'🐟' },
    { t:['She','helps','her','mother','cook'], b:[1,3,4], e:'👩‍🍳' },
    { t:['I','ride','my','new','bike'], b:[1,3,4], e:'🚲' },
    { t:['The','farmer','feeds','his','ducks'], b:[1,2,4], e:'🦆' },
    { t:['We','sing','songs','at','school'], b:[1,2,4], e:'🎵' },
    { t:['The','sun','gives','us','light'], b:[1,2,4], e:'☀️' },
    { t:['My','teacher','teaches','us','English'], b:[1,2,4], e:'👩‍🏫' },
    { t:['The','monkey','climbs','tall','trees'], b:[1,2,4], e:'🐒' },
    { t:['I','brush','my','teeth','daily'], b:[1,3,4], e:'🪥' },
    { t:['We','watch','the','bright','moon'], b:[1,3,4], e:'🌙' },
    { t:['The','rabbit','eats','fresh','carrots'], b:[1,3,4], e:'🐰' },
    { t:['She','plays','with','her','doll'], b:[1,4], e:'🧸' },
    { t:['My','brother','likes','ice','cream'], b:[1,2,4], e:'🍦' },
    { t:['The','rain','makes','plants','grow'], b:[1,3,4], e:'🌧️' },
    { t:['We','keep','our','room','clean'], b:[1,3,4], e:'🧹' }
  ]},
  /* ---- en3 (ป.2): 5-6 คำ มีบุพบทและคำบอกเวลา ---- */
  en3: { lang:'en', items:[
    { t:['The','cat','sleeps','under','the','table'], b:[2,3,5], e:'🐱' },
    { t:['We','plant','trees','in','the','garden'], b:[1,2,5], e:'🌱' },
    { t:['My','father','drives','a','blue','car'], b:[2,4,5], e:'🚗' },
    { t:['The','boy','reads','a','story','book'], b:[2,4,5], e:'📖' },
    { t:['Birds','build','nests','on','tall','trees'], b:[1,2,5], e:'🪺' },
    { t:['She','goes','to','school','every','day'], b:[1,3,5], e:'🎒' },
    { t:['The','baby','is','sleeping','in','bed'], b:[3,5], e:'👶' },
    { t:['I','wash','my','hands','before','lunch'], b:[1,3,5], e:'🧼' },
    { t:['Farmers','grow','rice','in','big','fields'], b:[1,2,5], e:'🌾' },
    { t:['The','rain','makes','the','road','wet'], b:[2,4,5], e:'🌧️' },
    { t:['My','sister','likes','sweet','cakes','today'], b:[2,3,4], e:'🍰' },
    { t:['We','must','turn','off','the','lights'], b:[2,3,5], e:'💡' },
    { t:['The','boy','runs','in','the','park'], b:[2,5], e:'🏃' },
    { t:['My','mother','buys','food','at','market'], b:[2,3,5], e:'🛒' },
    { t:['We','clean','our','classroom','every','Friday'], b:[1,3,5], e:'🧹' },
    { t:['The','moon','shines','in','the','sky'], b:[2,5], e:'🌙' },
    { t:['Ann','writes','a','letter','to','grandma'], b:[1,3,5], e:'✉️' },
    { t:['Fish','live','in','clean','river','water'], b:[1,3,4], e:'🐟' },
    { t:['He','feeds','his','dog','every','morning'], b:[1,3,5], e:'🐶' },
    { t:['They','ride','a','bus','to','school'], b:[1,3,5], e:'🚌' },
    { t:['The','flowers','need','water','and','sun'], b:[2,3,5], e:'🌷' },
    { t:['We','wear','warm','clothes','in','winter'], b:[2,3,5], e:'🧥' },
    { t:['My','uncle','works','on','a','farm'], b:[2,5], e:'🚜' },
    { t:['Children','love','to','play','with','friends'], b:[1,3,5], e:'🧒' },
    { t:['The','teacher','writes','on','the','board'], b:[2,5], e:'👩‍🏫' },
    { t:['We','eat','lunch','at','noon','together'], b:[2,4,5], e:'🍱' },
    { t:['The','ducks','swim','across','the','pond'], b:[2,3,5], e:'🦆' },
    { t:['My','grandmother','tells','us','funny','stories'], b:[2,4,5], e:'👵' },
    { t:['Students','line','up','before','the','flag'], b:[1,3,5], e:'🏫' },
    { t:['We','buy','fresh','fruit','every','weekend'], b:[2,3,5], e:'🍎' }
  ]},
  /* ---- en4 (ป.3): 6-7 คำ มีคำเชื่อมและคำวิเศษณ์ ---- */
  en4: { lang:'en', items:[
    { t:['The','farmer','waters','his','plants','every','morning'], b:[2,4,6], e:'🌱' },
    { t:['Students','must','listen','when','the','teacher','speaks'], b:[2,5,6], e:'👂' },
    { t:['We','put','our','rubbish','in','the','bin'], b:[1,3,6], e:'🗑️' },
    { t:['My','mother','cooks','dinner','for','the','family'], b:[2,3,6], e:'🍲' },
    { t:['Butterflies','fly','around','the','pretty','red','flowers'], b:[2,4,6], e:'🦋' },
    { t:['The','children','play','football','after','school','together'], b:[2,3,5], e:'⚽' },
    { t:['We','should','drink','eight','glasses','of','water'], b:[2,3,6], e:'💧' },
    { t:['My','brother','rides','his','bicycle','to','school'], b:[2,4,6], e:'🚲' },
    { t:['The','doctor','helps','sick','people','at','hospital'], b:[2,3,6], e:'🏥' },
    { t:['Elephants','use','their','trunks','to','drink','water'], b:[1,3,6], e:'🐘' },
    { t:['We','turn','off','the','fan','before','leaving'], b:[2,4,6], e:'🌀' },
    { t:['The','postman','brings','letters','to','our','house'], b:[2,3,6], e:'📮' },
    { t:['Plants','need','water','and','sunlight','to','grow'], b:[2,4,6], e:'🌿' },
    { t:['My','family','visits','grandmother','every','Sunday','afternoon'], b:[2,3,5], e:'👵' },
    { t:['The','moon','appears','in','the','night','sky'], b:[2,5,6], e:'🌙' },
    { t:['We','learn','new','English','words','every','week'], b:[2,4,6], e:'📚' },
    { t:['The','little','puppy','follows','the','boy','everywhere'], b:[2,3,6], e:'🐶' },
    { t:['Fishermen','catch','fish','in','the','deep','sea'], b:[1,2,6], e:'🎣' },
    { t:['We','wash','fruit','before','we','eat','it'], b:[1,2,5], e:'🍎' },
    { t:['The','bus','stops','in','front','of','school'], b:[2,4,6], e:'🚌' },
    { t:['Bees','collect','sweet','nectar','from','many','flowers'], b:[1,3,6], e:'🐝' },
    { t:['My','sister','practises','the','piano','every','evening'], b:[2,4,6], e:'🎹' },
    { t:['We','always','say','thank','you','to','helpers'], b:[2,3,6], e:'🙏' },
    { t:['The','gardener','plants','trees','near','the','pond'], b:[2,3,6], e:'🌳' },
    { t:['Children','should','sleep','early','on','school','nights'], b:[2,3,6], e:'😴' },
    { t:['We','wear','helmets','when','we','ride','bicycles'], b:[2,5,6], e:'🪖' },
    { t:['The','shop','sells','fresh','bread','every','morning'], b:[2,4,6], e:'🍞' },
    { t:['Ducks','swim','happily','across','the','village','pond'], b:[1,2,6], e:'🦆' },
    { t:['My','father','reads','the','newspaper','after','breakfast'], b:[2,4,6], e:'📰' },
    { t:['We','keep','our','classroom','clean','and','tidy'], b:[1,3,6], e:'🧹' }
  ]},
  /* ---- en5 (ป.4): 7-9 คำ มี tense/เหตุผล/คำเชื่อมซับซ้อน ---- */
  en5: { lang:'en', items:[
    { t:['Recycling','helps','us','save','trees','and','clean','water'], b:[1,4,6], e:'♻️' },
    { t:['The','earth','moves','around','the','sun','every','year'], b:[2,3,7], e:'🌍' },
    { t:['Students','must','listen','carefully','when','teachers','are','speaking'], b:[2,3,7], e:'👂' },
    { t:['Elephants','are','the','largest','animals','living','on','land'], b:[3,4,7], e:'🐘' },
    { t:['We','should','eat','vegetables','because','they','are','healthy'], b:[3,4,7], e:'🥦' },
    { t:['Rain','forests','give','fresh','air','to','the','world'], b:[3,4,7], e:'🌴' },
    { t:['My','sister','wants','to','become','a','doctor','someday'], b:[2,4,6], e:'👩‍⚕️' },
    { t:['Reading','books','every','night','makes','us','more','clever'], b:[3,4,7], e:'📖' },
    { t:['The','farmer','waters','his','plants','before','the','sunrise'], b:[2,4,7], e:'🌅' },
    { t:['Butterflies','help','flowers','by','moving','pollen','between','them'], b:[2,4,5], e:'🦋' },
    { t:['We','turn','off','computers','when','we','finish','working'], b:[3,6,7], e:'💻' },
    { t:['Honest','people','always','tell','the','truth','to','others'], b:[2,3,5], e:'🤝' },
    { t:['The','teacher','takes','students','to','the','museum','tomorrow'], b:[2,6,7], e:'🏛️' },
    { t:['Children','should','put','rubbish','in','the','bin','always'], b:[2,3,6], e:'🗑️' },
    { t:['A','big','whale','swims','slowly','in','deep','water'], b:[2,4,6], e:'🐋' },
    { t:['My','brother','is','much','taller','than','me','now'], b:[4,5,7], e:'📏' },
    { t:['We','use','solar','energy','because','it','is','clean'], b:[2,3,7], e:'☀️' },
    { t:['The','moon','goes','around','the','earth','every','month'], b:[2,3,7], e:'🌙' },
    { t:['Doctors','help','sick','people','at','the','city','hospital'], b:[1,2,7], e:'🏥' },
    { t:['She','studies','English','every','evening','at','her','home'], b:[1,2,4], e:'📚' },
    { t:['Plants','need','water','and','sunlight','to','grow','well'], b:[2,4,6], e:'🌱' },
    { t:['The','farmer','sells','fresh','fruit','at','the','market'], b:[2,3,7], e:'🍎' },
    { t:['We','can','save','water','by','closing','the','tap'], b:[2,3,5], e:'🚰' },
    { t:['Scientists','use','microscopes','to','study','very','small','things'], b:[2,4,6], e:'🔬' },
    { t:['People','should','protect','wild','animals','and','their','forests'], b:[2,3,7], e:'🦁' },
    { t:['The','rainbow','appears','after','the','rain','stops','falling'], b:[1,3,6], e:'🌈' },
    { t:['We','must','cross','the','road','at','the','crossing'], b:[2,4,7], e:'🚸' },
    { t:['My','father','drives','carefully','because','the','road','is','wet'], b:[3,6,8], e:'🚗' },
    { t:['Bees','make','honey','from','the','nectar','of','flowers'], b:[2,5,7], e:'🍯' },
    { t:['Everyone','in','the','village','helps','clean','the','canal'], b:[3,5,7], e:'🧹' }
  ]},
  /* en6 (ป.5) — ประโยคผสม 8-9 คำ มีคำเชื่อม because/and/but, going to และลำดับที่ (ordinal) */
  en6:{ lang:'en', items:[
    {t:['My','sister','is','going','to','become','a','nurse'], b:[1,5,7], e:'👩‍⚕️'},
    {t:['We','cannot','play','outside','because','the','rain','is','heavy'], b:[2,4,6,8], e:'🌧️'},
    {t:['The','first','runner','crossed','the','finish','line','very','quickly'], b:[1,3,6,8], e:'🏁'},
    {t:['Farmers','wake','up','early','and','harvest','rice','in','December'], b:[0,3,5,8], e:'🌾'},
    {t:['My','father','is','a','pilot','and','he','flies','airplanes'], b:[1,4,7,8], e:'✈️'},
    {t:['I','like','science','because','experiments','are','always','very','interesting'], b:[2,4,8], e:'🔬'},
    {t:['She','is','going','to','visit','her','grandmother','on','Sunday'], b:[4,6,8], e:'👵'},
    {t:['The','second','month','of','the','year','is','called','February'], b:[1,2,8], e:'📅'},
    {t:['Water','changes','into','ice','when','the','temperature','becomes','cold'], b:[0,3,8], e:'🧊'},
    {t:['Students','must','recycle','paper','because','it','saves','many','trees'], b:[0,2,8], e:'♻️'},
    {t:['The','doctor','works','in','a','hospital','and','helps','people'], b:[1,5,8], e:'👨‍⚕️'},
    {t:['My','brother','is','going','to','buy','a','new','bicycle'], b:[1,5,8], e:'🚲'},
    {t:['We','planted','trees','because','forests','give','us','clean','air'], b:[1,4,8], e:'🌳'},
    {t:['The','third','planet','from','the','sun','is','our','earth'], b:[1,2,8], e:'🌍'},
    {t:['Firefighters','are','brave','because','they','save','people','from','fire'], b:[0,2,8], e:'🚒'},
    {t:['Mother','cooks','dinner','while','father','washes','the','dirty','dishes'], b:[1,4,8], e:'🍽️'},
    {t:['I','finished','my','homework','and','then','I','played','football'], b:[1,3,8], e:'⚽'},
    {t:['Teachers','explain','lessons','because','students','need','to','understand','them'], b:[0,2,7], e:'👩‍🏫'},
    {t:['She','was','the','fourth','student','to','answer','the','question'], b:[3,4,8], e:'🙋'},
    {t:['The','market','opens','early','but','it','closes','before','sunset'], b:[1,3,8], e:'🏪'},
    {t:['Elephants','are','large','animals','and','they','live','in','forests'], b:[0,2,8], e:'🐘'},
    {t:['We','should','save','electricity','because','power','comes','from','fuel'], b:[2,3,8], e:'💡'},
    {t:['My','mother','is','going','to','plant','flowers','this','weekend'], b:[1,6,8], e:'🌷'},
    {t:['The','fifth','day','of','the','school','week','is','Friday'], b:[1,2,8], e:'🗓️'},
    {t:['Nurses','help','patients','because','caring','is','their','important','duty'], b:[0,2,8], e:'🏥'},
    {t:['Rain','falls','when','clouds','become','heavy','with','water','drops'], b:[0,3,8], e:'☁️'},
    {t:['He','is','going','to','study','English','at','the','library'], b:[4,5,8], e:'📚'},
    {t:['Bees','make','honey','and','they','help','flowers','grow','well'], b:[0,2,6], e:'🐝'},
    {t:['The','engineer','designs','bridges','and','buildings','for','the','city'], b:[1,3,8], e:'👷'},
    {t:['I','was','late','because','the','bus','arrived','very','slowly'], b:[2,5,8], e:'🚌'}
  ]},
  /* en7 (ป.6) — ประโยค 9-10 คำ มีคำถามเชิงเหตุผล คำบอกทิศทาง และคำเชื่อมหลายชนิด */
  en7:{ lang:'en', items:[
    {t:['Students','help','plant','new','trees','in','the','school','field'], b:[0,2,4,7], e:'🌳'},
    {t:['We','should','separate','our','rubbish','before','we','throw','it','away'], b:[2,4,7,9], e:'♻️'},
    {t:['The','teacher','explains','electric','circuits','to','the','students','carefully'], b:[1,2,4,8], e:'🔌'},
    {t:['Scientists','use','a','telescope','to','watch','the','stars','tonight'], b:[0,3,5,7], e:'🔭'},
    {t:['Farmers','harvest','rice','in','the','fields','after','rainy','season'], b:[0,1,5,7], e:'🌾'},
    {t:['The','monsoon','winds','bring','heavy','rain','to','our','country'], b:[1,3,4,8], e:'🌧️'},
    {t:['My','brother','reads','his','books','every','night','before','sleeping'], b:[1,2,4,8], e:'📚'},
    {t:['Children','clean','their','classroom','before','they','go','home','daily'], b:[0,1,3,7], e:'🧹'},
    {t:['Turn','left','at','the','corner','and','walk','past','the','bank'], b:[0,1,6,9], e:'🚦'},
    {t:['The','library','is','next','to','the','museum','on','Main','Street'], b:[1,3,6,8], e:'📖'},
    {t:['We','cannot','go','outside','because','the','storm','is','very','strong'], b:[3,4,6,9], e:'⛈️'},
    {t:['The','doctor','told','him','to','rest','and','drink','more','water'], b:[1,5,7,9], e:'👩‍⚕️'},
    {t:['Recycling','paper','saves','many','trees','and','protects','our','forests'], b:[0,2,4,8], e:'🌲'},
    {t:['The','sun','gives','light','and','heat','to','every','living','thing'], b:[1,3,5,8], e:'☀️'},
    {t:['She','practises','the','piano','because','she','wants','to','improve'], b:[1,3,4,8], e:'🎹'},
    {t:['The','museum','opens','at','nine','and','closes','at','five'], b:[1,2,4,8], e:'🏛️'},
    {t:['Please','look','up','the','meaning','in','your','dictionary','first'], b:[1,4,7,8], e:'📔'},
    {t:['Electricity','flows','through','the','wires','to','light','the','bulb'], b:[0,1,4,8], e:'💡'},
    {t:['We','planted','flowers','around','the','pond','last','Saturday','morning'], b:[1,2,5,7], e:'🌷'},
    {t:['The','museum','guide','explained','how','ancient','people','made','tools'], b:[2,3,5,8], e:'🪨'},
    {t:['Heavy','rain','caused','the','river','to','rise','very','quickly'], b:[1,2,4,8], e:'🌊'},
    {t:['My','father','repairs','old','bicycles','in','his','small','workshop'], b:[1,2,4,8], e:'🚲'},
    {t:['The','earth','moves','around','the','sun','once','every','year'], b:[1,2,5,8], e:'🌍'},
    {t:['Go','straight','for','two','blocks','then','turn','right','again'], b:[1,3,6,7], e:'🗺️'},
    {t:['Everyone','must','wear','a','helmet','when','riding','a','motorcycle'], b:[2,4,6,8], e:'🪖'},
    {t:['The','farmer','uses','a','magnet','to','collect','the','nails'], b:[1,4,6,8], e:'🧲'},
    {t:['Plants','need','sunlight','water','and','air','to','grow','well'], b:[0,2,3,7], e:'🌱'},
    {t:['We','visited','the','old','temple','during','our','school','trip'], b:[1,4,5,8], e:'🛕'},
    {t:['The','moon','reflects','sunlight','so','we','can','see','it'], b:[1,2,3,7], e:'🌕'},
    {t:['Always','check','the','label','before','you','buy','any','food'], b:[1,3,4,8], e:'🏷️'}
  ]}
};

/* ============================= LISTEN WORDS TH (เกมฟังคำไทย 1/2) ============================= */
/* คำศัพท์ไทย 3-5 ตัวอักษร แต่ละคำตัวอักษรไม่ซ้ำกันเอง แบ่งบัคเก็ตตามความยาวเหมือน AR_SENTENCES[lang][wordCount] เพื่อไล่ความยากตามด่าน (ดู listenThaiWordLen ใน app.js) แต่ละคำมี e = emoji สำรองไว้โชว์แทนเสียงถ้าเบราว์เซอร์ไม่รองรับเสียงพูดภาษาไทย */
const LISTEN_WORDS_TH = {
  3: [
    {w:'หมา', e:'🐶'}, {w:'แมว', e:'🐱'}, {w:'หมู', e:'🐷'}, {w:'หนู', e:'🐭'}, {w:'ไก่', e:'🐔'},
    {w:'ลิง', e:'🐒'}, {w:'ปลา', e:'🐟'}, {w:'หมี', e:'🐻'}, {w:'ม้า', e:'🐴'}, {w:'แพะ', e:'🐐'},
    {w:'แกะ', e:'🐑'}, {w:'หอย', e:'🐚'}, {w:'ยุง', e:'🦟'}, {w:'ส้ม', e:'🍊'}, {w:'ขนม', e:'🍬'},
    {w:'ไข่', e:'🥚'}, {w:'น้ำ', e:'💧'}, {w:'ร่ม', e:'☂️'}, {w:'จาน', e:'🍽️'}, {w:'ดาว', e:'⭐'},
    {w:'เมฆ', e:'☁️'}, {w:'บอล', e:'⚽'}, {w:'ปาก', e:'👄'}, {w:'มือ', e:'✋'}
  ],
  4: [
    {w:'เป็ด', e:'🦆'}, {w:'เสือ', e:'🐯'}, {w:'ช้าง', e:'🐘'}, {w:'กวาง', e:'🦌'}, {w:'ผึ้ง', e:'🐝'},
    {w:'เต่า', e:'🐢'}, {w:'ควาย', e:'🐃'}, {w:'กุ้ง', e:'🦐'}, {w:'ข้าว', e:'🍚'}, {w:'เค้ก', e:'🎂'},
    {w:'สมุด', e:'📓'}, {w:'หมวก', e:'🧢'}, {w:'แก้ว', e:'🥛'}, {w:'ช้อน', e:'🥄'}, {w:'รถไฟ', e:'🚂'},
    {w:'เรือ', e:'⛵'}, {w:'จรวด', e:'🚀'}, {w:'บ้าน', e:'🏠'}, {w:'หิมะ', e:'❄️'}, {w:'จมูก', e:'👃'},
    {w:'เท้า', e:'🦶'}
  ],
  5: [
    {w:'สิงโต', e:'🦁'}, {w:'ยีราฟ', e:'🦒'}, {w:'นกยูง', e:'🦚'}, {w:'กล้วย', e:'🍌'}, {w:'องุ่น', e:'🍇'},
    {w:'แตงโม', e:'🍉'}, {w:'มะนาว', e:'🍋'}, {w:'ดินสอ', e:'✏️'}, {w:'เสื้อ', e:'👕'}, {w:'ใบไม้', e:'🍃'},
    {w:'ยางลบ', e:'🧽'}, {w:'หัวใจ', e:'💛'}, {w:'ลูกอม', e:'🍬'}, {w:'เตียง', e:'🛏️'}, {w:'โคมไฟ', e:'🏮'},
    {w:'พัดลม', e:'🌀'}
  ],
  /* 6 ตัวอักษร — ใช้กับ ป.3 ขึ้นไป */
  6: [
    {w:'ดอกไม้', e:'🌸'}, {w:'ปลาทอง', e:'🐠'}, {w:'ขนมปัง', e:'🍞'}, {w:'กระดาษ', e:'📄'}, {w:'ผ้าห่ม', e:'🛌'},
    {w:'ตะกร้า', e:'🧺'}, {w:'เสือดำ', e:'🐆'}, {w:'ไข่มุก', e:'🦪'}, {w:'เตารีด', e:'🧷'}, {w:'น้ำตาล', e:'🍯'}
  ],
  /* 7 ตัวอักษร — ใช้กับ ป.4 (คำยาวและมีสระผสม) */
  7: [
    {w:'จักรยาน', e:'🚲'}, {w:'ผีเสื้อ', e:'🦋'}, {w:'กระต่าย', e:'🐰'}, {w:'ทุเรียน', e:'🥭'}, {w:'สับปะรด', e:'🍍'},
    {w:'กระเป๋า', e:'🎒'}, {w:'ลูกโป่ง', e:'🎈'}, {w:'มะพร้าว', e:'🥥'}, {w:'น้ำแข็ง', e:'🧊'}, {w:'แปรงฟัน', e:'🪥'}
  ],
  /* 8 ตัวอักษร (ป.5) — ตัวอักษร/สระ/วรรณยุกต์ในคำเดียวกันไม่ซ้ำกันเอง */
  8: [
    {w:'บันไดลิง', e:'🪜'}, {w:'กระเทียม', e:'🧄'}, {w:'สมุดโน้ต', e:'📒'}, {w:'แม่เหล็ก', e:'🧲'}, {w:'หมอนข้าง', e:'🛏️'},
    {w:'ห้องสมุด', e:'📚'}, {w:'ไข่เจียว', e:'🍳'}, {w:'ส้มตำไทย', e:'🥗'}, {w:'ดาวเทียม', e:'🛰️'}, {w:'ดินสอไม้', e:'✏️'}
  ],
  /* 9 ตัวอักษร (ป.6) */
  9: [
    {w:'ช้างเผือก', e:'🐘'}, {w:'แปรงสีฟัน', e:'🪥'}, {w:'หิมะสีขาว', e:'❄️'}, {w:'แตงโมหวาน', e:'🍉'}, {w:'กุญแจบ้าน', e:'🗝️'},
    {w:'โต๊ะเรียน', e:'🪑'}, {w:'ลูกโป่งสี', e:'🎈'}, {w:'ปลาทูนึ่ง', e:'🐟'}, {w:'ไข่ต้มสุก', e:'🥚'}, {w:'ส้มโอหวาน', e:'🍊'}
  ]
};

/* คลังตัวอักษรไทย (พยัญชนะ+สระ+วรรณยุกต์ที่พบบ่อย) ไว้สุ่มเป็นตัวหลอกในเกมฟังคำไทย กรองตัวที่ซ้ำกับคำตอบออกก่อนสุ่มเสมอ */
const THAI_DECOY_CHARS = [
  'ก','ข','ค','ง','จ','ฉ','ช','ซ','ญ','ด','ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว','ศ','ส','ห','อ','ฮ',
  'า','ะ','ิ','ี','ึ','ื','ุ','ู','เ','แ','โ','ใ','ไ','ำ','ั','่','้','๊','๋','็','์'
];

/* ============================= ANIMAL MATCH PAIRS (emoji <-> English word) ============================= */
/* ใช้กับเกม skill-animals: ซ้าย=รูปสัตว์ emoji, ขวา=คำศัพท์ภาษาอังกฤษ — มี 16 คู่เพื่อ shuffle หยิบ 4/8/12 ต่อด่าน */
const ANIMAL_MATCH_PAIRS = [
  {e:'🐱', w:'CAT'},     {e:'🐶', w:'DOG'},      {e:'🐰', w:'RABBIT'},  {e:'🐻', w:'BEAR'},
  {e:'🦁', w:'LION'},    {e:'🐯', w:'TIGER'},     {e:'🐸', w:'FROG'},    {e:'🐮', w:'COW'},
  {e:'🐷', w:'PIG'},     {e:'🐔', w:'CHICKEN'},   {e:'🐟', w:'FISH'},    {e:'🐦', w:'BIRD'},
  {e:'🐘', w:'ELEPHANT'},{e:'🐧', w:'PENGUIN'},   {e:'🦊', w:'FOX'},     {e:'🐨', w:'KOALA'},
];

/* ============================= AR MATCH DATA (symbol <-> word pairs) ============================= */
const AR_MATCH_ITEMS = {
  th:[
    {e:'☁️',w:'เมฆ'}, {e:'🌞',w:'พระอาทิตย์'}, {e:'🌙',w:'พระจันทร์'}, {e:'⭐',w:'ดาว'},
    {e:'🌧️',w:'ฝน'}, {e:'🌈',w:'รุ้ง'}, {e:'🔥',w:'ไฟ'}, {e:'💧',w:'น้ำ'},
    {e:'🌳',w:'ต้นไม้'}, {e:'🌸',w:'ดอกไม้'}, {e:'🍎',w:'แอปเปิ้ล'}, {e:'🍌',w:'กล้วย'},
    {e:'🐱',w:'แมว'}, {e:'🐶',w:'หมา'}, {e:'🐘',w:'ช้าง'}, {e:'🦁',w:'สิงโต'},
    {e:'🐟',w:'ปลา'}, {e:'🐦',w:'นก'}, {e:'🚗',w:'รถยนต์'}, {e:'✈️',w:'เครื่องบิน'},
    {e:'🚲',w:'จักรยาน'}, {e:'⛵',w:'เรือ'}, {e:'🏠',w:'บ้าน'}, {e:'📚',w:'หนังสือ'},
    {e:'✏️',w:'ดินสอ'}, {e:'🧍',w:'คน'}, {e:'⚽',w:'ลูกบอล'}, {e:'🎈',w:'ลูกโป่ง'},
    {e:'🕐',w:'นาฬิกา'}, {e:'👦',w:'เด็กผู้ชาย'},
    {e:'🍊',w:'ส้ม'}, {e:'🍇',w:'องุ่น'}, {e:'🍓',w:'สตรอว์เบอร์รี'}, {e:'🥕',w:'แครอท'},
    {e:'🐔',w:'ไก่'}, {e:'🐷',w:'หมู'}, {e:'🐮',w:'วัว'}, {e:'🐰',w:'กระต่าย'},
    {e:'🦋',w:'ผีเสื้อ'}, {e:'🐝',w:'ผึ้ง'}, {e:'✋',w:'มือ'}, {e:'👁️',w:'ตา'},
    {e:'👂',w:'หู'}, {e:'👃',w:'จมูก'}, {e:'👄',w:'ปาก'}, {e:'🔺',w:'สามเหลี่ยม'},
    {e:'⬜',w:'สี่เหลี่ยม'}, {e:'⭕',w:'วงกลม'}, {e:'🧸',w:'ตุ๊กตาหมี'}, {e:'⛄',w:'หิมะ'},
    {e:'🌊',w:'คลื่น'}, {e:'🍞',w:'ขนมปัง'}, {e:'🥛',w:'นม'}, {e:'🧦',w:'ถุงเท้า'},
    {e:'👕',w:'เสื้อ'}, {e:'🎂',w:'เค้ก'}, {e:'🚪',w:'ประตู'}, {e:'🪟',w:'หน้าต่าง'},
    {e:'🛏️',w:'เตียง'}
  ],
  en:[
    {e:'☁️',w:'Cloud'}, {e:'🌞',w:'Sun'}, {e:'🌙',w:'Moon'}, {e:'⭐',w:'Star'},
    {e:'🌧️',w:'Rain'}, {e:'🌈',w:'Rainbow'}, {e:'🔥',w:'Fire'}, {e:'💧',w:'Water'},
    {e:'🌳',w:'Tree'}, {e:'🌸',w:'Flower'}, {e:'🍎',w:'Apple'}, {e:'🍌',w:'Banana'},
    {e:'🐱',w:'Cat'}, {e:'🐶',w:'Dog'}, {e:'🐘',w:'Elephant'}, {e:'🦁',w:'Lion'},
    {e:'🐟',w:'Fish'}, {e:'🐦',w:'Bird'}, {e:'🚗',w:'Car'}, {e:'✈️',w:'Airplane'},
    {e:'🚲',w:'Bicycle'}, {e:'⛵',w:'Boat'}, {e:'🏠',w:'House'}, {e:'📚',w:'Book'},
    {e:'✏️',w:'Pencil'}, {e:'🧍',w:'Person'}, {e:'⚽',w:'Ball'}, {e:'🎈',w:'Balloon'},
    {e:'🕐',w:'Clock'}, {e:'👦',w:'Boy'},
    {e:'🍊',w:'Orange'}, {e:'🍇',w:'Grape'}, {e:'🍓',w:'Strawberry'}, {e:'🥕',w:'Carrot'},
    {e:'🐔',w:'Chicken'}, {e:'🐷',w:'Pig'}, {e:'🐮',w:'Cow'}, {e:'🐰',w:'Rabbit'},
    {e:'🦋',w:'Butterfly'}, {e:'🐝',w:'Bee'}, {e:'✋',w:'Hand'}, {e:'👁️',w:'Eye'},
    {e:'👂',w:'Ear'}, {e:'👃',w:'Nose'}, {e:'👄',w:'Mouth'}, {e:'🔺',w:'Triangle'},
    {e:'⬜',w:'Square'}, {e:'⭕',w:'Circle'}, {e:'🧸',w:'Teddy Bear'}, {e:'⛄',w:'Snow'},
    {e:'🌊',w:'Wave'}, {e:'🍞',w:'Bread'}, {e:'🥛',w:'Milk'}, {e:'🧦',w:'Sock'},
    {e:'👕',w:'Shirt'}, {e:'🎂',w:'Cake'}, {e:'🚪',w:'Door'}, {e:'🪟',w:'Window'},
    {e:'🛏️',w:'Bed'}
  ],
  /* คำศัพท์ยากขึ้นสำหรับ ป.4 (คำยาว 6-10 ตัวอักษร) — เลือกใช้ผ่าน cat.matchSet:'enAdv' */
  enAdv:[
    {e:'🦋',w:'Butterfly'}, {e:'☂️',w:'Umbrella'}, {e:'⛰️',w:'Mountain'}, {e:'🏥',w:'Hospital'},
    {e:'💻',w:'Computer'}, {e:'🦕',w:'Dinosaur'}, {e:'🍍',w:'Pineapple'}, {e:'🐊',w:'Crocodile'},
    {e:'🌋',w:'Volcano'}, {e:'🔬',w:'Microscope'}, {e:'🎺',w:'Trumpet'}, {e:'🧲',w:'Magnet'},
    {e:'🪐',w:'Planet'}, {e:'🌉',w:'Bridge'}, {e:'🚁',w:'Helicopter'}, {e:'🦒',w:'Giraffe'},
    {e:'🧑‍🚀',w:'Astronaut'}, {e:'📚',w:'Library'}, {e:'🥥',w:'Coconut'}, {e:'🐧',w:'Penguin'},
    {e:'⚓',w:'Anchor'}, {e:'🏰',w:'Castle'}, {e:'🌪️',w:'Tornado'}, {e:'🧊',w:'Iceberg'},
    {e:'🪃',w:'Boomerang'}, {e:'🐙',w:'Octopus'}, {e:'🎻',w:'Violin'}, {e:'🗺️',w:'Continent'},
    {e:'🧭',w:'Compass'}, {e:'🏛️',w:'Museum'}
  ],
  /* ป.5 — คำศัพท์ยาวขึ้นตามวงคำศัพท์สะสม 750-950 คำ */
  enAdv2: [
    {e:'👨‍🚀', w:'Astronaut'}, {e:'🔭', w:'Telescope'}, {e:'🚁', w:'Helicopter'}, {e:'🚑', w:'Ambulance'},
    {e:'📔', w:'Dictionary'}, {e:'📅', w:'Calendar'}, {e:'✈️', w:'Airport'}, {e:'🌋', w:'Volcano'},
    {e:'🦘', w:'Kangaroo'}, {e:'🐧', w:'Penguin'}, {e:'🐙', w:'Octopus'}, {e:'🐟', w:'Goldfish'},
    {e:'🍓', w:'Strawberry'}, {e:'🍉', w:'Watermelon'}, {e:'🌻', w:'Sunflower'}, {e:'🍄', w:'Mushroom'},
    {e:'⛄', w:'Snowman'}, {e:'🌈', w:'Rainbow'}, {e:'🏝️', w:'Island'}, {e:'🏜️', w:'Desert'},
    {e:'🏥', w:'Hospital'}, {e:'🔬', w:'Laboratory'}, {e:'🎪', w:'Circus'}, {e:'🏭', w:'Factory'},
    {e:'🛒', w:'Supermarket'}, {e:'🎫', w:'Ticket'}, {e:'🧭', w:'Compass'}, {e:'🏔️', w:'Mountain'},
    {e:'🐫', w:'Camel'}, {e:'🦊', w:'Fox'}
  ],
  /* ป.6 — วงคำศัพท์สะสม 1,050-1,200 คำ เน้นคำวิชาการและสิ่งแวดล้อม */
  enPro: [
    {e:'🔬', w:'Microscope'}, {e:'🧪', w:'Experiment'}, {e:'🌋', w:'Eruption'}, {e:'🌊', w:'Tsunami'},
    {e:'🗺️', w:'Geography'}, {e:'🏛️', w:'Government'}, {e:'💱', w:'Exchange'}, {e:'🧮', w:'Calculator'},
    {e:'📚', w:'Encyclopedia'}, {e:'🎭', w:'Theatre'}, {e:'🏆', w:'Champion'}, {e:'🎨', w:'Painting'},
    {e:'🏗️', w:'Construction'}, {e:'🚒', w:'Emergency'}, {e:'📡', w:'Satellite'}, {e:'🧲', w:'Magnetic'},
    {e:'💡', w:'Electricity'}, {e:'🌡️', w:'Temperature'}, {e:'🌲', w:'Environment'}, {e:'♻️', w:'Recycling'},
    {e:'🌍', w:'Pollution'}, {e:'🐘', w:'Endangered'}, {e:'🧬', w:'Inherited'}, {e:'🩸', w:'Circulation'},
    {e:'🥗', w:'Nutrition'}, {e:'🏃', w:'Exercise'}, {e:'📊', w:'Statistics'}, {e:'🗳️', w:'Election'},
    {e:'🤝', w:'Cooperation'}, {e:'🎓', w:'Graduation'}
  ]
};

/* ============================= AR SENTENCE DATA ============================= */
const AR_SENTENCES = {
  th:{
    3:[
      [{w:'แมว',e:'🐱'},{w:'กิน',e:'🍽️'},{w:'ปลา',e:'🐟'}],
      [{w:'หมา',e:'🐶'},{w:'ดื่ม',e:'🥤'},{w:'น้ำ',e:'💧'}],
      [{w:'นก',e:'🐦'},{w:'กิน',e:'🍽️'},{w:'หนอน',e:'🐛'}],
      [{w:'ไก่',e:'🐔'},{w:'กิน',e:'🍽️'},{w:'ข้าว',e:'🍚'}],
      [{w:'เด็ก',e:'🧒'},{w:'กิน',e:'🍽️'},{w:'ขนม',e:'🍪'}],
      [{w:'ผึ้ง',e:'🐝'},{w:'บิน',e:'💨'},{w:'สูง',e:'⬆️'}],
      [{w:'ผีเสื้อ',e:'🦋'},{w:'บิน',e:'💨'},{w:'สวย',e:'✨'}],
      [{w:'หมี',e:'🐻'},{w:'กิน',e:'🍽️'},{w:'น้ำผึ้ง',e:'🍯'}],
      [{w:'กบ',e:'🐸'},{w:'กระโดด',e:'⬆️'},{w:'สูง',e:'⬆️'}],
      [{w:'ปู',e:'🦀'},{w:'เดิน',e:'🚶'},{w:'ช้า',e:'🐢'}],
      [{w:'เต่า',e:'🐢'},{w:'ว่าย',e:'🏊'},{w:'น้ำ',e:'💧'}],
      [{w:'ลิง',e:'🐒'},{w:'ปีน',e:'🧗'},{w:'ต้นไม้',e:'🌳'}],
      [{w:'วัว',e:'🐄'},{w:'กิน',e:'🍽️'},{w:'หญ้า',e:'🌾'}],
      [{w:'เป็ด',e:'🦆'},{w:'ว่าย',e:'🏊'},{w:'น้ำ',e:'💧'}],
      [{w:'ม้า',e:'🐴'},{w:'วิ่ง',e:'🏃'},{w:'เร็ว',e:'💨'}],
      [{w:'แกะ',e:'🐑'},{w:'กิน',e:'🍽️'},{w:'หญ้า',e:'🌾'}],
      [{w:'นกฮูก',e:'🦉'},{w:'นอน',e:'😴'},{w:'กลางวัน',e:'☀️'}],
      [{w:'ปลาหมึก',e:'🦑'},{w:'ว่าย',e:'🏊'},{w:'เก่ง',e:'🌟'}],
      [{w:'งู',e:'🐍'},{w:'เลื้อย',e:'〰️'},{w:'ช้า',e:'🐢'}],
      [{w:'หนู',e:'🐭'},{w:'วิ่ง',e:'🏃'},{w:'หนี',e:'💨'}]
    ],
    4:[
      [{w:'แมว',e:'🐱'},{w:'กิน',e:'🍽️'},{w:'ปลา',e:'🐟'},{w:'อร่อย',e:'😋'}],
      [{w:'น้อง',e:'🧒'},{w:'ดื่ม',e:'🥤'},{w:'นม',e:'🥛'},{w:'อุ่น',e:'♨️'}],
      [{w:'หมา',e:'🐶'},{w:'วิ่ง',e:'🏃'},{w:'เร็ว',e:'💨'},{w:'มาก',e:'❗'}],
      [{w:'ผีเสื้อ',e:'🦋'},{w:'บิน',e:'💨'},{w:'ไป',e:'➡️'},{w:'สวน',e:'🌷'}],
      [{w:'แม่',e:'👩'},{w:'ทำ',e:'👩‍🍳'},{w:'อาหาร',e:'🍲'},{w:'อร่อย',e:'😋'}],
      [{w:'พ่อ',e:'👨'},{w:'ขับ',e:'🚗'},{w:'รถ',e:'🚙'},{w:'ไป',e:'➡️'}],
      [{w:'เด็ก',e:'🧒'},{w:'เล่น',e:'🎈'},{w:'ว่าว',e:'🪁'},{w:'สนุก',e:'😄'}],
      [{w:'ยาย',e:'👵'},{w:'ปลูก',e:'🌱'},{w:'ดอกไม้',e:'🌷'},{w:'สวย',e:'✨'}],
      [{w:'ปลาวาฬ',e:'🐋'},{w:'ว่าย',e:'🏊'},{w:'ใน',e:'📍'},{w:'ทะเล',e:'🌊'}],
      [{w:'ผึ้ง',e:'🐝'},{w:'บิน',e:'💨'},{w:'หา',e:'🔍'},{w:'ดอกไม้',e:'🌷'}],
      [{w:'น้อง',e:'🧒'},{w:'อ่าน',e:'📖'},{w:'หนังสือ',e:'📚'},{w:'เก่ง',e:'🌟'}],
      [{w:'ไก่',e:'🐔'},{w:'ออก',e:'➡️'},{w:'ไข่',e:'🥚'},{w:'ทุกวัน',e:'📅'}],
      [{w:'วัว',e:'🐄'},{w:'กิน',e:'🍽️'},{w:'หญ้า',e:'🌾'},{w:'อิ่ม',e:'😋'}],
      [{w:'น้อง',e:'🧒'},{w:'วาด',e:'🎨'},{w:'รูป',e:'🖼️'},{w:'สวย',e:'✨'}],
      [{w:'ม้า',e:'🐴'},{w:'วิ่ง',e:'🏃'},{w:'ไป',e:'➡️'},{w:'ทุ่ง',e:'🌾'}],
      [{w:'พี่',e:'🧑'},{w:'ล้าง',e:'🧼'},{w:'จาน',e:'🍽️'},{w:'สะอาด',e:'✨'}],
      [{w:'นกฮูก',e:'🦉'},{w:'บิน',e:'💨'},{w:'ตอน',e:'⏱️'},{w:'กลางคืน',e:'🌙'}],
      [{w:'เด็ก',e:'🧒'},{w:'ปั่น',e:'🚲'},{w:'จักรยาน',e:'🚲'},{w:'สนุก',e:'😄'}],
      [{w:'หนู',e:'🐭'},{w:'ซ่อน',e:'🙈'},{w:'ใน',e:'📍'},{w:'รู',e:'🕳️'}],
      [{w:'ครู',e:'👩‍🏫'},{w:'แจก',e:'🤲'},{w:'ขนม',e:'🍪'},{w:'ให้',e:'💛'}]
    ],
    5:[
      [{w:'น้อง',e:'🧒'},{w:'กิน',e:'🍽️'},{w:'ข้าว',e:'🍚'},{w:'กับ',e:'➕'},{w:'ไข่',e:'🍳'}],
      [{w:'แมว',e:'🐱'},{w:'นอน',e:'😴'},{w:'บน',e:'⬆️'},{w:'เตียง',e:'🛏️'},{w:'นุ่ม',e:'☁️'}],
      [{w:'เด็ก',e:'🧒'},{w:'เล่น',e:'🎈'},{w:'บอล',e:'⚽'},{w:'ใน',e:'📍'},{w:'สวน',e:'🌳'}],
      [{w:'หมา',e:'🐶'},{w:'คาบ',e:'🦴'},{w:'ลูกบอล',e:'🎾'},{w:'มา',e:'➡️'},{w:'ให้',e:'🤲'}],
      [{w:'ปลา',e:'🐟'},{w:'ว่าย',e:'🏊'},{w:'อยู่',e:'📍'},{w:'ใน',e:'📍'},{w:'บ่อ',e:'💧'}],
      [{w:'นก',e:'🐦'},{w:'ร้อง',e:'🎵'},{w:'เพลง',e:'🎶'},{w:'บน',e:'⬆️'},{w:'ต้นไม้',e:'🌳'}],
      [{w:'คุณครู',e:'👩‍🏫'},{w:'สอน',e:'📖'},{w:'หนังสือ',e:'📚'},{w:'ใน',e:'📍'},{w:'ห้อง',e:'🏫'}],
      [{w:'ผีเสื้อ',e:'🦋'},{w:'บิน',e:'💨'},{w:'ไป',e:'➡️'},{w:'มา',e:'⬅️'},{w:'สวย',e:'✨'}],
      [{w:'พ่อ',e:'👨'},{w:'ปลูก',e:'🌱'},{w:'ต้นไม้',e:'🌳'},{w:'ใน',e:'📍'},{w:'สวน',e:'🌳'}],
      [{w:'เด็ก',e:'🧒'},{w:'ล้าง',e:'🧼'},{w:'มือ',e:'🤚'},{w:'ก่อน',e:'⏱️'},{w:'กิน',e:'🍽️'}],
      [{w:'แม่',e:'👩'},{w:'ซัก',e:'🧺'},{w:'ผ้า',e:'👕'},{w:'ทุก',e:'🔁'},{w:'วัน',e:'📅'}],
      [{w:'หมา',e:'🐶'},{w:'นอน',e:'😴'},{w:'อยู่',e:'📍'},{w:'ใต้',e:'⬇️'},{w:'โต๊ะ',e:'🪑'}],
      [{w:'น้อง',e:'🧒'},{w:'ปั่น',e:'🚲'},{w:'จักรยาน',e:'🚲'},{w:'ไป',e:'➡️'},{w:'โรงเรียน',e:'🏫'}],
      [{w:'วัว',e:'🐄'},{w:'ยืน',e:'🧍'},{w:'อยู่',e:'📍'},{w:'ใน',e:'📍'},{w:'ทุ่ง',e:'🌾'}],
      [{w:'พี่',e:'🧑'},{w:'ช่วย',e:'🤝'},{w:'แม่',e:'👩'},{w:'ล้าง',e:'🧼'},{w:'จาน',e:'🍽️'}],
      [{w:'ยาย',e:'👵'},{w:'เล่า',e:'💬'},{w:'นิทาน',e:'📖'},{w:'ให้',e:'💛'},{w:'ฟัง',e:'👂'}],
      [{w:'นกฮูก',e:'🦉'},{w:'จับ',e:'🤚'},{w:'หนู',e:'🐭'},{w:'ตอน',e:'⏱️'},{w:'กลางคืน',e:'🌙'}],
      [{w:'เด็ก',e:'🧒'},{w:'วาด',e:'🎨'},{w:'รูป',e:'🖼️'},{w:'บน',e:'⬆️'},{w:'กระดาษ',e:'📄'}],
      [{w:'ปู',e:'🦀'},{w:'เดิน',e:'🚶'},{w:'อยู่',e:'📍'},{w:'บน',e:'⬆️'},{w:'หาดทราย',e:'🏖️'}],
      [{w:'ครู',e:'👩‍🏫'},{w:'ชม',e:'👏'},{w:'เด็ก',e:'🧒'},{w:'ที่',e:'➕'},{w:'ตั้งใจ',e:'🌟'}]
    ],
    /* 6 คำ — ใช้กับระดับ ป.3 ขึ้นไป (cat.sentenceLens) ประโยคยาวขึ้น มีคำขยาย/คำบุพบทมากขึ้น */
    6:[
      [{w:'แมว',e:'🐱'},{w:'ขน',e:'🧶'},{w:'นุ่ม',e:'☁️'},{w:'นอน',e:'😴'},{w:'ใต้',e:'⬇️'},{w:'โต๊ะ',e:'🪑'}],
      [{w:'เด็ก',e:'🧒'},{w:'ช่วย',e:'🤝'},{w:'กัน',e:'➕'},{w:'ปลูก',e:'🌱'},{w:'ต้นไม้',e:'🌳'},{w:'ในสวน',e:'🏡'}],
      [{w:'คุณครู',e:'👩‍🏫'},{w:'พา',e:'🚶'},{w:'นักเรียน',e:'🎒'},{w:'ไป',e:'➡️'},{w:'เที่ยว',e:'🎉'},{w:'สวนสัตว์',e:'🦁'}],
      [{w:'ฉัน',e:'🧒'},{w:'ช่วย',e:'🤝'},{w:'แม่',e:'👩'},{w:'ล้าง',e:'🧼'},{w:'จาน',e:'🍽️'},{w:'ทุกวัน',e:'📅'}],
      [{w:'นก',e:'🐦'},{w:'ตัวเล็ก',e:'🐣'},{w:'สร้าง',e:'🔨'},{w:'รัง',e:'🪺'},{w:'บน',e:'⬆️'},{w:'ต้นไม้',e:'🌳'}],
      [{w:'พ่อ',e:'👨'},{w:'ขับ',e:'🚗'},{w:'รถ',e:'🚙'},{w:'พา',e:'🤝'},{w:'เรา',e:'👨‍👩‍👧'},{w:'ไปทะเล',e:'🌊'}],
      [{w:'ผีเสื้อ',e:'🦋'},{w:'สีสวย',e:'🌈'},{w:'บิน',e:'💨'},{w:'อยู่',e:'📍'},{w:'เหนือ',e:'⬆️'},{w:'ดอกไม้',e:'🌷'}],
      [{w:'น้อง',e:'🧒'},{w:'อ่าน',e:'📖'},{w:'หนังสือ',e:'📚'},{w:'นิทาน',e:'🐉'},{w:'ก่อน',e:'⏱️'},{w:'นอน',e:'😴'}],
      [{w:'ชาวนา',e:'👨‍🌾'},{w:'ปลูก',e:'🌱'},{w:'ข้าว',e:'🌾'},{w:'อยู่',e:'📍'},{w:'ใน',e:'📍'},{w:'ทุ่งนา',e:'🏞️'}],
      [{w:'เรา',e:'👨‍👩‍👧'},{w:'ควร',e:'👍'},{w:'ทิ้ง',e:'🫳'},{w:'ขยะ',e:'🗑️'},{w:'ลง',e:'⬇️'},{w:'ถัง',e:'🪣'}],
      [{w:'ปลาวาฬ',e:'🐋'},{w:'ตัวใหญ่',e:'🫧'},{w:'ว่าย',e:'🏊'},{w:'อยู่',e:'📍'},{w:'ใน',e:'📍'},{w:'ทะเลลึก',e:'🌊'}],
      [{w:'หมา',e:'🐶'},{w:'วิ่ง',e:'🏃'},{w:'ไล่',e:'💨'},{w:'ลูกบอล',e:'⚽'},{w:'ใน',e:'📍'},{w:'สนาม',e:'🏟️'}],
      [{w:'ยาย',e:'👵'},{w:'ทำ',e:'👩‍🍳'},{w:'ขนม',e:'🍡'},{w:'อร่อย',e:'😋'},{w:'ให้',e:'🤲'},{w:'หลาน',e:'🧒'}],
      [{w:'พระอาทิตย์',e:'🌞'},{w:'ขึ้น',e:'⬆️'},{w:'ตอน',e:'⏱️'},{w:'เช้า',e:'🌅'},{w:'ทุก',e:'🔁'},{w:'วัน',e:'📅'}],
      [{w:'เด็กๆ',e:'🧒'},{w:'เล่น',e:'🪁'},{w:'ว่าว',e:'🪁'},{w:'กัน',e:'➕'},{w:'ที่',e:'📍'},{w:'ทุ่งนา',e:'🌾'}],
      [{w:'ฝน',e:'🌧️'},{w:'ตก',e:'💧'},{w:'หนัก',e:'❗'},{w:'ทำให้',e:'➡️'},{w:'ถนน',e:'🛣️'},{w:'เปียก',e:'💦'}]
    ]    ,
    /* 7 คำ — ใช้กับระดับ ป.4 ขึ้นไป (ประโยคซับซ้อน มีคำขยายและคำเชื่อม) */
    7:[
      [{w:'คุณครู',e:'👩‍🏫'},{w:'พา',e:'🚶'},{w:'นักเรียน',e:'🎒'},{w:'ไป',e:'➡️'},{w:'ทัศนศึกษา',e:'🎉'},{w:'ที่',e:'📍'},{w:'พิพิธภัณฑ์',e:'🏛️'}],
      [{w:'ชาวนา',e:'👨‍🌾'},{w:'ตื่น',e:'⏰'},{w:'แต่เช้า',e:'🌅'},{w:'ไป',e:'➡️'},{w:'เกี่ยวข้าว',e:'🌾'},{w:'ใน',e:'📍'},{w:'ทุ่งนา',e:'🏞️'}],
      [{w:'เด็กๆ',e:'🧒'},{w:'ช่วยกัน',e:'🤝'},{w:'เก็บ',e:'🫳'},{w:'ขยะ',e:'🗑️'},{w:'บน',e:'⬆️'},{w:'ชายหาด',e:'🏖️'},{w:'จนสะอาด',e:'✨'}],
      [{w:'แม่',e:'👩'},{w:'ทำ',e:'👩‍🍳'},{w:'อาหาร',e:'🍲'},{w:'อร่อย',e:'😋'},{w:'ให้',e:'🤲'},{w:'ทุกคน',e:'👨‍👩‍👧'},{w:'กิน',e:'🍽️'}],
      [{w:'นก',e:'🐦'},{w:'ตัวเล็ก',e:'🐣'},{w:'บิน',e:'💨'},{w:'กลับ',e:'🔙'},{w:'รัง',e:'🪺'},{w:'ตอน',e:'⏱️'},{w:'พระอาทิตย์ตก',e:'🌇'}],
      [{w:'พ่อ',e:'👨'},{w:'ปลูก',e:'🌱'},{w:'ต้นไม้',e:'🌳'},{w:'หลายต้น',e:'🔢'},{w:'ไว้',e:'📍'},{w:'รอบ',e:'🔄'},{w:'บ้าน',e:'🏠'}],
      [{w:'ฝนตก',e:'🌧️'},{w:'หนัก',e:'❗'},{w:'ทำให้',e:'➡️'},{w:'น้ำ',e:'💧'},{w:'ท่วม',e:'🌊'},{w:'ถนน',e:'🛣️'},{w:'หลายสาย',e:'🔢'}],
      [{w:'นักเรียน',e:'🎒'},{w:'ทุกคน',e:'👨‍👩‍👧'},{w:'ตั้งใจ',e:'🌟'},{w:'อ่าน',e:'📖'},{w:'หนังสือ',e:'📚'},{w:'ก่อน',e:'⏱️'},{w:'สอบ',e:'📝'}],
      [{w:'ผีเสื้อ',e:'🦋'},{w:'สีสวย',e:'🌈'},{w:'บิน',e:'💨'},{w:'วน',e:'🔄'},{w:'อยู่',e:'📍'},{w:'เหนือ',e:'⬆️'},{w:'ดอกไม้',e:'🌷'}],
      [{w:'เรา',e:'👨‍👩‍👧'},{w:'ควร',e:'👍'},{w:'ปิด',e:'🔌'},{w:'ไฟ',e:'💡'},{w:'ทุกครั้ง',e:'🔁'},{w:'เมื่อ',e:'⏱️'},{w:'ไม่ใช้',e:'🚫'}],
      [{w:'ยาย',e:'👵'},{w:'เล่า',e:'💬'},{w:'นิทาน',e:'📖'},{w:'สนุก',e:'😄'},{w:'ให้',e:'🤲'},{w:'หลาน',e:'🧒'},{w:'ฟัง',e:'👂'}],
      [{w:'ปลาวาฬ',e:'🐋'},{w:'ตัวใหญ่',e:'🫧'},{w:'ว่าย',e:'🏊'},{w:'อยู่',e:'📍'},{w:'ใน',e:'📍'},{w:'ทะเล',e:'🌊'},{w:'ลึก',e:'⬇️'}]
    ],
    /* 8 คำ (ป.5) */
    8:[
      [{w:'คุณครู',e:'👩‍🏫'},{w:'พา',e:'🚶'},{w:'นักเรียน',e:'🎒'},{w:'ไป',e:'➡️'},{w:'ทัศนศึกษา',e:'🎉'},{w:'ที่',e:'📍'},{w:'พิพิธภัณฑ์',e:'🏛️'},{w:'แห่งชาติ',e:'🇹🇭'}],
      [{w:'ชาวนา',e:'👨‍🌾'},{w:'ตื่น',e:'⏰'},{w:'แต่เช้า',e:'🌅'},{w:'ออกไป',e:'➡️'},{w:'เกี่ยวข้าว',e:'🌾'},{w:'ใน',e:'📍'},{w:'ทุ่งนา',e:'🌿'},{w:'กว้าง',e:'↔️'}],
      [{w:'คุณแม่',e:'👩'},{w:'ซื้อ',e:'🛒'},{w:'ผลไม้',e:'🍎'},{w:'สด',e:'✨'},{w:'จาก',e:'➡️'},{w:'ตลาด',e:'🏪'},{w:'ใกล้',e:'📍'},{w:'บ้าน',e:'🏠'}],
      [{w:'เด็กๆ',e:'🧒'},{w:'ช่วยกัน',e:'🤝'},{w:'เก็บ',e:'🤚'},{w:'ขยะ',e:'🗑️'},{w:'ใน',e:'📍'},{w:'สวน',e:'🌳'},{w:'สาธารณะ',e:'🏞️'},{w:'ทุกวัน',e:'🗓️'}],
      [{w:'นักวิทยาศาสตร์',e:'👨‍🔬'},{w:'ใช้',e:'🤚'},{w:'กล้อง',e:'🔬'},{w:'จุลทรรศน์',e:'🔍'},{w:'ส่อง',e:'👁️'},{w:'ดู',e:'👀'},{w:'เซลล์',e:'🧫'},{w:'พืช',e:'🌿'}],
      [{w:'พี่ชาย',e:'👦'},{w:'ขี่',e:'🚴'},{w:'จักรยาน',e:'🚲'},{w:'ไป',e:'➡️'},{w:'โรงเรียน',e:'🏫'},{w:'กับ',e:'🤝'},{w:'เพื่อน',e:'🧑‍🤝‍🧑'},{w:'ทุกเช้า',e:'🌅'}],
      [{w:'ชาวประมง',e:'🎣'},{w:'ออก',e:'➡️'},{w:'เรือ',e:'⛵'},{w:'ไป',e:'🌊'},{w:'จับ',e:'🤚'},{w:'ปลา',e:'🐟'},{w:'ตั้งแต่',e:'⏱️'},{w:'เช้ามืด',e:'🌃'}],
      [{w:'คุณยาย',e:'👵'},{w:'เล่า',e:'💬'},{w:'นิทาน',e:'📖'},{w:'สนุก',e:'😄'},{w:'ให้',e:'🤲'},{w:'หลาน',e:'🧒'},{w:'ฟัง',e:'👂'},{w:'ก่อนนอน',e:'🛏️'}],
      [{w:'นักเรียน',e:'🎒'},{w:'ทุกคน',e:'👥'},{w:'ยืน',e:'🧍'},{w:'ตรง',e:'⬆️'},{w:'เคารพ',e:'🙏'},{w:'ธงชาติ',e:'🇹🇭'},{w:'หน้า',e:'📍'},{w:'เสาธง',e:'🏳️'}],
      [{w:'ฝน',e:'🌧️'},{w:'ตก',e:'⬇️'},{w:'หนัก',e:'💧'},{w:'ทำให้',e:'➡️'},{w:'ถนน',e:'🛣️'},{w:'ใน',e:'📍'},{w:'เมือง',e:'🏙️'},{w:'ลื่น',e:'⚠️'}],
      [{w:'ต้นไม้',e:'🌳'},{w:'ใหญ่',e:'📏'},{w:'ให้',e:'🤲'},{w:'ร่มเงา',e:'🌲'},{w:'แก่',e:'➡️'},{w:'คน',e:'🧍'},{w:'ที่',e:'📍'},{w:'เดินผ่าน',e:'🚶'}],
      [{w:'เรา',e:'👨‍👩‍👧'},{w:'ควร',e:'👍'},{w:'ประหยัด',e:'💰'},{w:'น้ำ',e:'💧'},{w:'และ',e:'➕'},{w:'ไฟฟ้า',e:'💡'},{w:'ทุก',e:'🔁'},{w:'วัน',e:'🗓️'}]
    ],
    /* 9 คำ (ป.6) */
    9:[
      [{w:'นักเรียน',e:'🎒'},{w:'ทุกคน',e:'👥'},{w:'ช่วยกัน',e:'🤝'},{w:'ปลูก',e:'🌱'},{w:'ต้นไม้',e:'🌳'},{w:'ใน',e:'📍'},{w:'สนาม',e:'🏟️'},{w:'หน้า',e:'➡️'},{w:'โรงเรียน',e:'🏫'}],
      [{w:'คุณแม่',e:'👩'},{w:'พา',e:'🚶'},{w:'น้อง',e:'🧒'},{w:'ไป',e:'➡️'},{w:'ตรวจ',e:'🩺'},{w:'สุขภาพ',e:'💚'},{w:'ที่',e:'📍'},{w:'โรงพยาบาล',e:'🏥'},{w:'ใกล้บ้าน',e:'🏠'}],
      [{w:'ชาวประมง',e:'🎣'},{w:'ออก',e:'➡️'},{w:'เรือ',e:'⛵'},{w:'ไป',e:'🌊'},{w:'จับ',e:'🤚'},{w:'ปลา',e:'🐟'},{w:'ตั้งแต่',e:'⏱️'},{w:'ก่อน',e:'⬅️'},{w:'พระอาทิตย์ขึ้น',e:'🌅'}],
      [{w:'คุณครู',e:'👩‍🏫'},{w:'อธิบาย',e:'💬'},{w:'เรื่อง',e:'📖'},{w:'วงจร',e:'🔌'},{w:'ไฟฟ้า',e:'💡'},{w:'ให้',e:'🤲'},{w:'นักเรียน',e:'🎒'},{w:'ฟัง',e:'👂'},{w:'อย่างละเอียด',e:'🔍'}],
      [{w:'เรา',e:'👨‍👩‍👧'},{w:'ควร',e:'👍'},{w:'แยก',e:'✂️'},{w:'ขยะ',e:'🗑️'},{w:'ก่อน',e:'⬅️'},{w:'ทิ้ง',e:'⬇️'},{w:'เพื่อ',e:'➡️'},{w:'ช่วย',e:'🤝'},{w:'โลก',e:'🌍'}],
      [{w:'พี่ชาย',e:'👦'},{w:'อ่าน',e:'📖'},{w:'หนังสือ',e:'📚'},{w:'เตรียม',e:'📝'},{w:'สอบ',e:'📋'},{w:'ทุก',e:'🔁'},{w:'คืน',e:'🌙'},{w:'ก่อน',e:'⬅️'},{w:'นอน',e:'🛏️'}],
      [{w:'ลม',e:'💨'},{w:'มรสุม',e:'🌬️'},{w:'พัด',e:'➡️'},{w:'นำ',e:'🤚'},{w:'ฝน',e:'🌧️'},{w:'มา',e:'⬅️'},{w:'สู่',e:'📍'},{w:'ประเทศ',e:'🗺️'},{w:'ไทย',e:'🇹🇭'}],
      [{w:'นักวิทยาศาสตร์',e:'👨‍🔬'},{w:'ใช้',e:'🤚'},{w:'กล้อง',e:'🔭'},{w:'โทรทรรศน์',e:'🔭'},{w:'ส่อง',e:'👁️'},{w:'ดู',e:'👀'},{w:'ดาว',e:'⭐'},{w:'บน',e:'⬆️'},{w:'ท้องฟ้า',e:'🌌'}],
      [{w:'ชาวนา',e:'👨‍🌾'},{w:'เก็บ',e:'🤚'},{w:'เกี่ยว',e:'🌾'},{w:'ข้าว',e:'🍚'},{w:'ใน',e:'📍'},{w:'ทุ่ง',e:'🌿'},{w:'หลัง',e:'➡️'},{w:'ฤดู',e:'🗓️'},{w:'ฝน',e:'🌧️'}],
      [{w:'เด็กๆ',e:'🧒'},{w:'ช่วยกัน',e:'🤝'},{w:'ทำความสะอาด',e:'🧹'},{w:'ห้องเรียน',e:'🏫'},{w:'ก่อน',e:'⬅️'},{w:'กลับ',e:'🔙'},{w:'บ้าน',e:'🏠'},{w:'ทุก',e:'🔁'},{w:'วัน',e:'🗓️'}],
      [{w:'คุณยาย',e:'👵'},{w:'เล่า',e:'💬'},{w:'เรื่อง',e:'📖'},{w:'สมัย',e:'⏳'},{w:'ก่อน',e:'⬅️'},{w:'ให้',e:'🤲'},{w:'หลาน',e:'🧒'},{w:'ฟัง',e:'👂'},{w:'อย่างสนุก',e:'😄'}],
      [{w:'รัฐบาล',e:'🏛️'},{w:'สร้าง',e:'👷'},{w:'ถนน',e:'🛣️'},{w:'และ',e:'➕'},{w:'สะพาน',e:'🌉'},{w:'เพื่อ',e:'➡️'},{w:'ให้',e:'🤲'},{w:'เดินทาง',e:'🚌'},{w:'สะดวก',e:'👍'}]
    ]
  },
  en:{
    3:[
      [{w:'Cat',e:'🐱'},{w:'eats',e:'🍽️'},{w:'fish',e:'🐟'}],
      [{w:'Dog',e:'🐶'},{w:'drinks',e:'🥤'},{w:'water',e:'💧'}],
      [{w:'Bird',e:'🐦'},{w:'eats',e:'🍽️'},{w:'worm',e:'🐛'}],
      [{w:'I',e:'🧒'},{w:'like',e:'❤️'},{w:'cake',e:'🍰'}],
      [{w:'Sun',e:'☀️'},{w:'is',e:'➡️'},{w:'hot',e:'🔥'}],
      [{w:'Fish',e:'🐟'},{w:'can',e:'✅'},{w:'swim',e:'🏊'}],
      [{w:'Bee',e:'🐝'},{w:'likes',e:'❤️'},{w:'flowers',e:'🌷'}],
      [{w:'Frog',e:'🐸'},{w:'can',e:'✅'},{w:'jump',e:'⬆️'}],
      [{w:'Monkey',e:'🐒'},{w:'climbs',e:'🧗'},{w:'trees',e:'🌳'}],
      [{w:'Turtle',e:'🐢'},{w:'walks',e:'🚶'},{w:'slow',e:'🐢'}],
      [{w:'Kids',e:'🧒'},{w:'fly',e:'💨'},{w:'kites',e:'🪁'}],
      [{w:'Bear',e:'🐻'},{w:'loves',e:'❤️'},{w:'honey',e:'🍯'}],
      [{w:'Cow',e:'🐄'},{w:'eats',e:'🍽️'},{w:'grass',e:'🌾'}],
      [{w:'Duck',e:'🦆'},{w:'can',e:'✅'},{w:'swim',e:'🏊'}],
      [{w:'Horse',e:'🐴'},{w:'runs',e:'🏃'},{w:'fast',e:'💨'}],
      [{w:'Sheep',e:'🐑'},{w:'eats',e:'🍽️'},{w:'grass',e:'🌾'}],
      [{w:'Owl',e:'🦉'},{w:'sleeps',e:'😴'},{w:'daytime',e:'☀️'}],
      [{w:'Squid',e:'🦑'},{w:'swims',e:'🏊'},{w:'well',e:'🌟'}],
      [{w:'Snake',e:'🐍'},{w:'moves',e:'〰️'},{w:'slowly',e:'🐢'}],
      [{w:'Mouse',e:'🐭'},{w:'runs',e:'🏃'},{w:'away',e:'💨'}]
    ],
    4:[
      [{w:'Cat',e:'🐱'},{w:'eats',e:'🍽️'},{w:'fish',e:'🐟'},{w:'fast',e:'💨'}],
      [{w:'I',e:'🧒'},{w:'drink',e:'🥤'},{w:'milk',e:'🥛'},{w:'daily',e:'📅'}],
      [{w:'Dog',e:'🐶'},{w:'runs',e:'🏃'},{w:'very',e:'❗'},{w:'fast',e:'💨'}],
      [{w:'Bird',e:'🐦'},{w:'flies',e:'💨'},{w:'so',e:'➡️'},{w:'high',e:'⬆️'}],
      [{w:'Mom',e:'👩'},{w:'cooks',e:'👩‍🍳'},{w:'good',e:'😋'},{w:'food',e:'🍲'}],
      [{w:'Dad',e:'👨'},{w:'drives',e:'🚗'},{w:'a',e:'➕'},{w:'car',e:'🚙'}],
      [{w:'Bees',e:'🐝'},{w:'fly',e:'💨'},{w:'to',e:'➡️'},{w:'flowers',e:'🌷'}],
      [{w:'Grandma',e:'👵'},{w:'waters',e:'💧'},{w:'the',e:'➕'},{w:'plant',e:'🌱'}],
      [{w:'Whale',e:'🐋'},{w:'swims',e:'🏊'},{w:'in',e:'📍'},{w:'sea',e:'🌊'}],
      [{w:'Hens',e:'🐔'},{w:'lay',e:'➡️'},{w:'eggs',e:'🥚'},{w:'daily',e:'📅'}],
      [{w:'I',e:'🧒'},{w:'read',e:'📖'},{w:'books',e:'📚'},{w:'daily',e:'📅'}],
      [{w:'Kids',e:'🧒'},{w:'wash',e:'🧼'},{w:'their',e:'➕'},{w:'hands',e:'🤚'}],
      [{w:'Cow',e:'🐄'},{w:'eats',e:'🍽️'},{w:'grass',e:'🌾'},{w:'happily',e:'😋'}],
      [{w:'I',e:'🧒'},{w:'draw',e:'🎨'},{w:'a',e:'➕'},{w:'picture',e:'🖼️'}],
      [{w:'Horse',e:'🐴'},{w:'runs',e:'🏃'},{w:'to',e:'➡️'},{w:'field',e:'🌾'}],
      [{w:'Sister',e:'🧑'},{w:'washes',e:'🧼'},{w:'the',e:'➕'},{w:'plates',e:'🍽️'}],
      [{w:'Owl',e:'🦉'},{w:'flies',e:'💨'},{w:'at',e:'⏱️'},{w:'night',e:'🌙'}],
      [{w:'Kids',e:'🧒'},{w:'ride',e:'🚲'},{w:'their',e:'➕'},{w:'bikes',e:'🚲'}],
      [{w:'Mouse',e:'🐭'},{w:'hides',e:'🙈'},{w:'in',e:'📍'},{w:'hole',e:'🕳️'}],
      [{w:'Teacher',e:'👩‍🏫'},{w:'gives',e:'🤲'},{w:'us',e:'🧒'},{w:'candy',e:'🍪'}]
    ],
    5:[
      [{w:'I',e:'🧒'},{w:'eat',e:'🍽️'},{w:'rice',e:'🍚'},{w:'and',e:'➕'},{w:'egg',e:'🍳'}],
      [{w:'Cat',e:'🐱'},{w:'sleeps',e:'😴'},{w:'on',e:'⬆️'},{w:'soft',e:'☁️'},{w:'bed',e:'🛏️'}],
      [{w:'Kids',e:'🧒'},{w:'play',e:'🎈'},{w:'ball',e:'⚽'},{w:'in',e:'📍'},{w:'park',e:'🌳'}],
      [{w:'Dog',e:'🐶'},{w:'brings',e:'🤲'},{w:'the',e:'➕'},{w:'ball',e:'🎾'},{w:'back',e:'➡️'}],
      [{w:'Fish',e:'🐟'},{w:'swim',e:'🏊'},{w:'in',e:'📍'},{w:'the',e:'➕'},{w:'pond',e:'💧'}],
      [{w:'Bird',e:'🐦'},{w:'sings',e:'🎵'},{w:'on',e:'⬆️'},{w:'a',e:'➕'},{w:'tree',e:'🌳'}],
      [{w:'The',e:'➕'},{w:'teacher',e:'👩‍🏫'},{w:'teaches',e:'📖'},{w:'us',e:'🧒'},{w:'kindly',e:'💛'}],
      [{w:'Butterflies',e:'🦋'},{w:'fly',e:'💨'},{w:'around',e:'🔄'},{w:'the',e:'➕'},{w:'flowers',e:'🌷'}],
      [{w:'Dad',e:'👨'},{w:'plants',e:'🌱'},{w:'a',e:'➕'},{w:'tree',e:'🌳'},{w:'today',e:'📅'}],
      [{w:'Mom',e:'👩'},{w:'washes',e:'🧺'},{w:'clothes',e:'👕'},{w:'every',e:'🔁'},{w:'day',e:'📅'}],
      [{w:'The',e:'➕'},{w:'dog',e:'🐶'},{w:'sleeps',e:'😴'},{w:'under',e:'⬇️'},{w:'table',e:'🪑'}],
      [{w:'I',e:'🧒'},{w:'wash',e:'🧼'},{w:'my',e:'➕'},{w:'hands',e:'🤚'},{w:'first',e:'⏱️'}],
      [{w:'I',e:'🧒'},{w:'ride',e:'🚲'},{w:'my',e:'➕'},{w:'bike',e:'🚲'},{w:'fast',e:'💨'}],
      [{w:'The',e:'➕'},{w:'cow',e:'🐄'},{w:'eats',e:'🍽️'},{w:'green',e:'💚'},{w:'grass',e:'🌾'}],
      [{w:'My',e:'➕'},{w:'sister',e:'🧑'},{w:'helps',e:'🤝'},{w:'wash',e:'🧼'},{w:'dishes',e:'🍽️'}],
      [{w:'Grandma',e:'👵'},{w:'tells',e:'💬'},{w:'us',e:'🧒'},{w:'a',e:'➕'},{w:'story',e:'📖'}],
      [{w:'The',e:'➕'},{w:'owl',e:'🦉'},{w:'catches',e:'🤚'},{w:'a',e:'➕'},{w:'mouse',e:'🐭'}],
      [{w:'I',e:'🧒'},{w:'draw',e:'🎨'},{w:'a',e:'➕'},{w:'nice',e:'✨'},{w:'picture',e:'🖼️'}],
      [{w:'The',e:'➕'},{w:'crab',e:'🦀'},{w:'walks',e:'🚶'},{w:'on',e:'⬆️'},{w:'beach',e:'🏖️'}],
      [{w:'The',e:'➕'},{w:'teacher',e:'👩‍🏫'},{w:'praises',e:'👏'},{w:'good',e:'🌟'},{w:'kids',e:'🧒'}]
    ],
    /* 6 words — used by ป.3 and up (cat.sentenceLens) */
    6:[
      [{w:'The',e:'➕'},{w:'soft',e:'☁️'},{w:'cat',e:'🐱'},{w:'sleeps',e:'😴'},{w:'under',e:'⬇️'},{w:'table',e:'🪑'}],
      [{w:'We',e:'👨‍👩‍👧'},{w:'plant',e:'🌱'},{w:'small',e:'🐣'},{w:'trees',e:'🌳'},{w:'in',e:'📍'},{w:'garden',e:'🏡'}],
      [{w:'My',e:'➕'},{w:'mother',e:'👩'},{w:'cooks',e:'👩‍🍳'},{w:'dinner',e:'🍲'},{w:'every',e:'🔁'},{w:'evening',e:'🌆'}],
      [{w:'Little',e:'🐣'},{w:'birds',e:'🐦'},{w:'build',e:'🔨'},{w:'nests',e:'🪺'},{w:'on',e:'⬆️'},{w:'trees',e:'🌳'}],
      [{w:'The',e:'➕'},{w:'teacher',e:'👩‍🏫'},{w:'reads',e:'📖'},{w:'us',e:'🧒'},{w:'a',e:'➕'},{w:'story',e:'📚'}],
      [{w:'I',e:'🧒'},{w:'brush',e:'🪥'},{w:'my',e:'➕'},{w:'teeth',e:'🦷'},{w:'before',e:'⏱️'},{w:'bed',e:'🛏️'}],
      [{w:'Dad',e:'👨'},{w:'drives',e:'🚗'},{w:'us',e:'👨‍👩‍👧'},{w:'to',e:'➡️'},{w:'the',e:'➕'},{w:'beach',e:'🏖️'}],
      [{w:'Butterflies',e:'🦋'},{w:'fly',e:'💨'},{w:'over',e:'⬆️'},{w:'the',e:'➕'},{w:'pretty',e:'✨'},{w:'flowers',e:'🌷'}],
      [{w:'Farmers',e:'👨‍🌾'},{w:'grow',e:'🌱'},{w:'rice',e:'🌾'},{w:'in',e:'📍'},{w:'big',e:'❗'},{w:'fields',e:'🏞️'}],
      [{w:'We',e:'👨‍👩‍👧'},{w:'must',e:'👍'},{w:'put',e:'🫳'},{w:'rubbish',e:'🗑️'},{w:'in',e:'📍'},{w:'bins',e:'🪣'}],
      [{w:'A',e:'➕'},{w:'big',e:'🫧'},{w:'whale',e:'🐋'},{w:'swims',e:'🏊'},{w:'in',e:'📍'},{w:'ocean',e:'🌊'}],
      [{w:'The',e:'➕'},{w:'happy',e:'😄'},{w:'dog',e:'🐶'},{w:'runs',e:'🏃'},{w:'after',e:'💨'},{w:'ball',e:'⚽'}],
      [{w:'Grandma',e:'👵'},{w:'makes',e:'👩‍🍳'},{w:'sweet',e:'🍯'},{w:'cakes',e:'🍰'},{w:'for',e:'🤲'},{w:'us',e:'🧒'}],
      [{w:'The',e:'➕'},{w:'sun',e:'🌞'},{w:'rises',e:'⬆️'},{w:'early',e:'🌅'},{w:'every',e:'🔁'},{w:'morning',e:'📅'}],
      [{w:'Children',e:'🧒'},{w:'fly',e:'🪁'},{w:'kites',e:'🪁'},{w:'in',e:'📍'},{w:'the',e:'➕'},{w:'field',e:'🌾'}],
      [{w:'Heavy',e:'❗'},{w:'rain',e:'🌧️'},{w:'makes',e:'➡️'},{w:'the',e:'➕'},{w:'road',e:'🛣️'},{w:'wet',e:'💦'}]
    ]    ,
    /* 7 words — used by ป.4 and up */
    7:[
      [{w:'The',e:'➕'},{w:'teacher',e:'👩‍🏫'},{w:'takes',e:'🚶'},{w:'students',e:'🎒'},{w:'to',e:'➡️'},{w:'the',e:'➕'},{w:'museum',e:'🏛️'}],
      [{w:'Farmers',e:'👨‍🌾'},{w:'wake',e:'⏰'},{w:'up',e:'⬆️'},{w:'early',e:'🌅'},{w:'to',e:'➡️'},{w:'grow',e:'🌱'},{w:'rice',e:'🌾'}],
      [{w:'Children',e:'🧒'},{w:'help',e:'🤝'},{w:'clean',e:'✨'},{w:'the',e:'➕'},{w:'beach',e:'🏖️'},{w:'every',e:'🔁'},{w:'week',e:'📅'}],
      [{w:'My',e:'➕'},{w:'mother',e:'👩'},{w:'cooks',e:'👩‍🍳'},{w:'a',e:'➕'},{w:'nice',e:'😋'},{w:'meal',e:'🍲'},{w:'today',e:'📅'}],
      [{w:'Small',e:'🐣'},{w:'birds',e:'🐦'},{w:'fly',e:'💨'},{w:'back',e:'🔙'},{w:'home',e:'🪺'},{w:'before',e:'⏱️'},{w:'sunset',e:'🌇'}],
      [{w:'Dad',e:'👨'},{w:'plants',e:'🌱'},{w:'many',e:'🔢'},{w:'trees',e:'🌳'},{w:'around',e:'🔄'},{w:'our',e:'➕'},{w:'house',e:'🏠'}],
      [{w:'Heavy',e:'❗'},{w:'rain',e:'🌧️'},{w:'makes',e:'➡️'},{w:'water',e:'💧'},{w:'cover',e:'🌊'},{w:'many',e:'🔢'},{w:'roads',e:'🛣️'}],
      [{w:'All',e:'👨‍👩‍👧'},{w:'students',e:'🎒'},{w:'read',e:'📖'},{w:'their',e:'➕'},{w:'books',e:'📚'},{w:'before',e:'⏱️'},{w:'exams',e:'📝'}],
      [{w:'Pretty',e:'🌈'},{w:'butterflies',e:'🦋'},{w:'fly',e:'💨'},{w:'around',e:'🔄'},{w:'the',e:'➕'},{w:'red',e:'🌷'},{w:'flowers',e:'🌸'}],
      [{w:'We',e:'👨‍👩‍👧'},{w:'must',e:'👍'},{w:'turn',e:'🔌'},{w:'off',e:'🚫'},{w:'the',e:'➕'},{w:'lights',e:'💡'},{w:'always',e:'🔁'}],
      [{w:'Grandma',e:'👵'},{w:'tells',e:'💬'},{w:'funny',e:'😄'},{w:'stories',e:'📖'},{w:'to',e:'➡️'},{w:'her',e:'➕'},{w:'grandchildren',e:'🧒'}],
      [{w:'A',e:'➕'},{w:'huge',e:'🫧'},{w:'whale',e:'🐋'},{w:'swims',e:'🏊'},{w:'in',e:'📍'},{w:'deep',e:'⬇️'},{w:'water',e:'🌊'}]
    ],
    /* 8 words (ป.5) */
    8:[
      [{w:'The',e:'➕'},{w:'teacher',e:'👩‍🏫'},{w:'takes',e:'🚶'},{w:'students',e:'🎒'},{w:'to',e:'➡️'},{w:'the',e:'➕'},{w:'national',e:'🇹🇭'},{w:'museum',e:'🏛️'}],
      [{w:'My',e:'👤'},{w:'mother',e:'👩'},{w:'buys',e:'🛒'},{w:'fresh',e:'✨'},{w:'fruit',e:'🍎'},{w:'from',e:'➡️'},{w:'the',e:'➕'},{w:'market',e:'🏪'}],
      [{w:'Children',e:'🧒'},{w:'help',e:'🤝'},{w:'clean',e:'🧹'},{w:'the',e:'➕'},{w:'park',e:'🌳'},{w:'every',e:'🔁'},{w:'Saturday',e:'🗓️'},{w:'morning',e:'🌅'}],
      [{w:'Scientists',e:'👨‍🔬'},{w:'use',e:'🤚'},{w:'a',e:'➕'},{w:'microscope',e:'🔬'},{w:'to',e:'➡️'},{w:'study',e:'👀'},{w:'plant',e:'🌿'},{w:'cells',e:'🧫'}],
      [{w:'My',e:'👤'},{w:'brother',e:'👦'},{w:'rides',e:'🚴'},{w:'his',e:'👤'},{w:'bicycle',e:'🚲'},{w:'to',e:'➡️'},{w:'school',e:'🏫'},{w:'daily',e:'🌅'}],
      [{w:'Fishermen',e:'🎣'},{w:'go',e:'➡️'},{w:'out',e:'⛵'},{w:'to',e:'🌊'},{w:'catch',e:'🤚'},{w:'fish',e:'🐟'},{w:'before',e:'⏱️'},{w:'sunrise',e:'🌃'}],
      [{w:'Grandmother',e:'👵'},{w:'tells',e:'💬'},{w:'us',e:'🧒'},{w:'a',e:'➕'},{w:'funny',e:'😄'},{w:'story',e:'📖'},{w:'every',e:'🔁'},{w:'night',e:'🌙'}],
      [{w:'Students',e:'🎒'},{w:'stand',e:'🧍'},{w:'up',e:'⬆️'},{w:'to',e:'➡️'},{w:'respect',e:'🙏'},{w:'the',e:'➕'},{w:'national',e:'🇹🇭'},{w:'flag',e:'🏳️'}],
      [{w:'Heavy',e:'💧'},{w:'rain',e:'🌧️'},{w:'makes',e:'➡️'},{w:'the',e:'➕'},{w:'city',e:'🏙️'},{w:'roads',e:'🛣️'},{w:'very',e:'❗'},{w:'slippery',e:'⚠️'}],
      [{w:'Big',e:'📏'},{w:'trees',e:'🌳'},{w:'give',e:'🤲'},{w:'shade',e:'🌲'},{w:'to',e:'➡️'},{w:'people',e:'👥'},{w:'walking',e:'🚶'},{w:'outside',e:'🏞️'}],
      [{w:'We',e:'👨‍👩‍👧'},{w:'should',e:'👍'},{w:'save',e:'💰'},{w:'water',e:'💧'},{w:'and',e:'➕'},{w:'electricity',e:'💡'},{w:'every',e:'🔁'},{w:'day',e:'🗓️'}],
      [{w:'Farmers',e:'👨‍🌾'},{w:'wake',e:'⏰'},{w:'up',e:'🌅'},{w:'early',e:'🌆'},{w:'to',e:'➡️'},{w:'harvest',e:'🌾'},{w:'rice',e:'🍚'},{w:'fields',e:'🌿'}]
    ],
    /* 9 words (ป.6) */
    9:[
      [{w:'Students',e:'🎒'},{w:'help',e:'🤝'},{w:'plant',e:'🌱'},{w:'new',e:'✨'},{w:'trees',e:'🌳'},{w:'in',e:'📍'},{w:'the',e:'➕'},{w:'school',e:'🏫'},{w:'field',e:'🏟️'}],
      [{w:'My',e:'👤'},{w:'mother',e:'👩'},{w:'takes',e:'🚶'},{w:'my',e:'👤'},{w:'sister',e:'🧒'},{w:'to',e:'➡️'},{w:'the',e:'➕'},{w:'hospital',e:'🏥'},{w:'today',e:'🗓️'}],
      [{w:'Fishermen',e:'🎣'},{w:'sail',e:'⛵'},{w:'out',e:'➡️'},{w:'to',e:'🌊'},{w:'catch',e:'🤚'},{w:'fish',e:'🐟'},{w:'before',e:'⏱️'},{w:'the',e:'➕'},{w:'sunrise',e:'🌅'}],
      [{w:'The',e:'➕'},{w:'teacher',e:'👩‍🏫'},{w:'explains',e:'💬'},{w:'electric',e:'💡'},{w:'circuits',e:'🔌'},{w:'to',e:'➡️'},{w:'the',e:'➕'},{w:'students',e:'🎒'},{w:'carefully',e:'🔍'}],
      [{w:'We',e:'👨‍👩‍👧'},{w:'should',e:'👍'},{w:'separate',e:'✂️'},{w:'our',e:'🤚'},{w:'rubbish',e:'🗑️'},{w:'before',e:'⬅️'},{w:'we',e:'👥'},{w:'throw',e:'⬇️'},{w:'it',e:'📦'}],
      [{w:'My',e:'👤'},{w:'brother',e:'👦'},{w:'reads',e:'📖'},{w:'his',e:'👤'},{w:'books',e:'📚'},{w:'every',e:'🔁'},{w:'night',e:'🌙'},{w:'before',e:'⬅️'},{w:'sleeping',e:'🛏️'}],
      [{w:'The',e:'➕'},{w:'monsoon',e:'🌬️'},{w:'winds',e:'💨'},{w:'bring',e:'🤚'},{w:'heavy',e:'⬇️'},{w:'rain',e:'🌧️'},{w:'to',e:'➡️'},{w:'our',e:'👥'},{w:'country',e:'🇹🇭'}],
      [{w:'Scientists',e:'👨‍🔬'},{w:'use',e:'🤚'},{w:'a',e:'➕'},{w:'telescope',e:'🔭'},{w:'to',e:'➡️'},{w:'watch',e:'👀'},{w:'the',e:'➕'},{w:'stars',e:'⭐'},{w:'tonight',e:'🌌'}],
      [{w:'Farmers',e:'👨‍🌾'},{w:'harvest',e:'🌾'},{w:'rice',e:'🍚'},{w:'in',e:'📍'},{w:'the',e:'➕'},{w:'fields',e:'🌿'},{w:'after',e:'➡️'},{w:'rainy',e:'🌧️'},{w:'season',e:'🗓️'}],
      [{w:'Children',e:'🧒'},{w:'clean',e:'🧹'},{w:'their',e:'👥'},{w:'classroom',e:'🏫'},{w:'before',e:'⬅️'},{w:'they',e:'👥'},{w:'go',e:'➡️'},{w:'home',e:'🏠'},{w:'daily',e:'🔁'}],
      [{w:'Grandmother',e:'👵'},{w:'tells',e:'💬'},{w:'us',e:'🧒'},{w:'stories',e:'📖'},{w:'about',e:'📍'},{w:'the',e:'➕'},{w:'old',e:'⏳'},{w:'days',e:'🗓️'},{w:'tonight',e:'🌙'}],
      [{w:'The',e:'➕'},{w:'government',e:'🏛️'},{w:'builds',e:'👷'},{w:'roads',e:'🛣️'},{w:'and',e:'➕'},{w:'bridges',e:'🌉'},{w:'for',e:'➡️'},{w:'easier',e:'👍'},{w:'travel',e:'🚌'}]
    ]
  }
};

/* ============================= AR COUNT DATA (pick-and-count game: "หยิบให้ครบ") ============================= */
/* q: คำถามให้เด็กอ่าน, targetKey/targetEmoji/targetCount: ของที่ต้องหยิบและจำนวน, items: ของทั้งหมดที่กระจายบนจอ (เป้าหมาย + ของหลอก) */
const AR_COUNT_QUESTIONS = {
  easy:[
    { q:'หยิบแอปเปิ้ล 2 ลูก', targetKey:'apple', targetEmoji:'🍎', targetCount:2,
      items:[ {key:'apple', emoji:'🍎', count:2}, {key:'banana', emoji:'🍌', count:5} ] },
    { q:'หยิบดาว 3 ดวง', targetKey:'star', targetEmoji:'⭐', targetCount:3,
      items:[ {key:'star', emoji:'⭐', count:3}, {key:'moon', emoji:'🌙', count:4} ] },
    { q:'หยิบหมา 2 ตัว', targetKey:'dog', targetEmoji:'🐶', targetCount:2,
      items:[ {key:'dog', emoji:'🐶', count:2}, {key:'cat', emoji:'🐱', count:5} ] },
    { q:'หยิบส้ม 3 ลูก', targetKey:'orange', targetEmoji:'🍊', targetCount:3,
      items:[ {key:'orange', emoji:'🍊', count:3}, {key:'grape', emoji:'🍇', count:4} ] },
    { q:'หยิบไก่ 2 ตัว', targetKey:'chicken', targetEmoji:'🐔', targetCount:2,
      items:[ {key:'chicken', emoji:'🐔', count:2}, {key:'pig', emoji:'🐷', count:5} ] },
    { q:'หยิบดินสอ 3 แท่ง', targetKey:'pencil', targetEmoji:'✏️', targetCount:3,
      items:[ {key:'pencil', emoji:'✏️', count:3}, {key:'book', emoji:'📚', count:4} ] },
    { q:'หยิบผีเสื้อ 2 ตัว', targetKey:'butterfly', targetEmoji:'🦋', targetCount:2,
      items:[ {key:'butterfly', emoji:'🦋', count:2}, {key:'bee', emoji:'🐝', count:5} ] },
    { q:'หยิบรถ 3 คัน', targetKey:'car', targetEmoji:'🚗', targetCount:3,
      items:[ {key:'car', emoji:'🚗', count:3}, {key:'bicycle', emoji:'🚲', count:4} ] },
    { q:'หยิบดอกไม้ 2 ดอก', targetKey:'flower', targetEmoji:'🌸', targetCount:2,
      items:[ {key:'flower', emoji:'🌸', count:2}, {key:'tree', emoji:'🌳', count:5} ] },
    { q:'หยิบวงกลม 3 รูป', targetKey:'circle', targetEmoji:'⭕', targetCount:3,
      items:[ {key:'circle', emoji:'⭕', count:3}, {key:'triangle', emoji:'🔺', count:4} ] }
  ],
  medium:[
    { q:'หยิบส้มให้ครบ 4 ลูก', targetKey:'orange', targetEmoji:'🍊', targetCount:4,
      items:[ {key:'orange', emoji:'🍊', count:4}, {key:'apple', emoji:'🍎', count:3}, {key:'grape', emoji:'🍇', count:3} ] },
    { q:'หยิบดินสอให้ครบ 3 แท่ง', targetKey:'pencil', targetEmoji:'✏️', targetCount:3,
      items:[ {key:'pencil', emoji:'✏️', count:3}, {key:'book', emoji:'📚', count:3}, {key:'ball', emoji:'⚽', count:3} ] },
    { q:'หยิบดอกไม้ให้ครบ 4 ดอก', targetKey:'flower', targetEmoji:'🌸', targetCount:4,
      items:[ {key:'flower', emoji:'🌸', count:4}, {key:'tree', emoji:'🌳', count:3}, {key:'butterfly', emoji:'🦋', count:3} ] },
    { q:'หยิบแมวให้ครบ 3 ตัว', targetKey:'cat', targetEmoji:'🐱', targetCount:3,
      items:[ {key:'cat', emoji:'🐱', count:3}, {key:'dog', emoji:'🐶', count:3}, {key:'rabbit', emoji:'🐰', count:3} ] },
    { q:'หยิบหนังสือให้ครบ 3 เล่ม', targetKey:'book', targetEmoji:'📚', targetCount:3,
      items:[ {key:'book', emoji:'📚', count:3}, {key:'pencil', emoji:'✏️', count:3}, {key:'ball', emoji:'⚽', count:3} ] },
    { q:'หยิบดาวให้ครบ 4 ดวง', targetKey:'star', targetEmoji:'⭐', targetCount:4,
      items:[ {key:'star', emoji:'⭐', count:4}, {key:'moon', emoji:'🌙', count:3}, {key:'sun', emoji:'🌞', count:3} ] },
    { q:'หยิบเป็ดให้ครบ 3 ตัว', targetKey:'duck', targetEmoji:'🦆', targetCount:3,
      items:[ {key:'duck', emoji:'🦆', count:3}, {key:'chicken', emoji:'🐔', count:3}, {key:'pig', emoji:'🐷', count:3} ] },
    { q:'หยิบรถให้ครบ 4 คัน', targetKey:'car', targetEmoji:'🚗', targetCount:4,
      items:[ {key:'car', emoji:'🚗', count:4}, {key:'bicycle', emoji:'🚲', count:3}, {key:'boat', emoji:'⛵', count:3} ] },
    { q:'หยิบกล้วยให้ครบ 3 ลูก', targetKey:'banana', targetEmoji:'🍌', targetCount:3,
      items:[ {key:'banana', emoji:'🍌', count:3}, {key:'apple', emoji:'🍎', count:3}, {key:'orange', emoji:'🍊', count:3} ] },
    { q:'หยิบสามเหลี่ยมให้ครบ 4 รูป', targetKey:'triangle', targetEmoji:'🔺', targetCount:4,
      items:[ {key:'triangle', emoji:'🔺', count:4}, {key:'circle', emoji:'⭕', count:3}, {key:'square', emoji:'⬜', count:3} ] }
  ],
  hard:[
    { q:'ช่วยหยิบไก่ให้ครบ 5 ตัวหน่อย', targetKey:'chicken', targetEmoji:'🐔', targetCount:5,
      items:[ {key:'chicken', emoji:'🐔', count:5}, {key:'pig', emoji:'🐷', count:3}, {key:'cow', emoji:'🐮', count:3} ] },
    { q:'ช่วยหยิบแอปเปิ้ลให้ครบ 5 ลูกหน่อย', targetKey:'apple', targetEmoji:'🍎', targetCount:5,
      items:[ {key:'apple', emoji:'🍎', count:5}, {key:'banana', emoji:'🍌', count:3}, {key:'orange', emoji:'🍊', count:3} ] },
    { q:'ช่วยหยิบลูกบอลให้ครบ 4 ลูกหน่อย', targetKey:'ball', targetEmoji:'⚽', targetCount:4,
      items:[ {key:'ball', emoji:'⚽', count:4}, {key:'balloon', emoji:'🎈', count:4}, {key:'book', emoji:'📚', count:3} ] },
    { q:'ช่วยหยิบดาวให้ครบ 6 ดวงหน่อย', targetKey:'star', targetEmoji:'⭐', targetCount:6,
      items:[ {key:'star', emoji:'⭐', count:6}, {key:'moon', emoji:'🌙', count:3}, {key:'sun', emoji:'🌞', count:2} ] },
    { q:'ช่วยหยิบหมาให้ครบ 5 ตัวหน่อย', targetKey:'dog', targetEmoji:'🐶', targetCount:5,
      items:[ {key:'dog', emoji:'🐶', count:5}, {key:'cat', emoji:'🐱', count:3}, {key:'rabbit', emoji:'🐰', count:3} ] },
    { q:'ช่วยหยิบรถให้ครบ 5 คันหน่อย', targetKey:'car', targetEmoji:'🚗', targetCount:5,
      items:[ {key:'car', emoji:'🚗', count:5}, {key:'bicycle', emoji:'🚲', count:3}, {key:'boat', emoji:'⛵', count:3} ] },
    { q:'ช่วยหยิบดอกไม้ให้ครบ 6 ดอกหน่อย', targetKey:'flower', targetEmoji:'🌸', targetCount:6,
      items:[ {key:'flower', emoji:'🌸', count:6}, {key:'tree', emoji:'🌳', count:3}, {key:'butterfly', emoji:'🦋', count:2} ] },
    { q:'ช่วยหยิบดินสอให้ครบ 5 แท่งหน่อย', targetKey:'pencil', targetEmoji:'✏️', targetCount:5,
      items:[ {key:'pencil', emoji:'✏️', count:5}, {key:'book', emoji:'📚', count:3}, {key:'ball', emoji:'⚽', count:3} ] },
    { q:'ช่วยหยิบเป็ดให้ครบ 4 ตัวหน่อย', targetKey:'duck', targetEmoji:'🦆', targetCount:4,
      items:[ {key:'duck', emoji:'🦆', count:4}, {key:'fish', emoji:'🐟', count:3}, {key:'frog', emoji:'🐸', count:3} ] },
    { q:'ช่วยหยิบวงกลมให้ครบ 5 รูปหน่อย', targetKey:'circle', targetEmoji:'⭕', targetCount:5,
      items:[ {key:'circle', emoji:'⭕', count:5}, {key:'triangle', emoji:'🔺', count:3}, {key:'square', emoji:'⬜', count:3} ] }
  ]
};

const CAT_REQUIRES = { thai2:'thai', iq2:'iq1', iq3:'iq2', iq4:'iq3', listen2:'listen1', 'listen-th2':'listen-th1', 'skill-shadow2':'skill-shadow', 'skill-shadow3':'skill-shadow2', 'ar-math2':'ar-math', 'ar-math3':'ar-math2', 'skill-mix2':'skill-mix', 'skill-music2':'skill-music', 'skill-music3':'skill-music2', 'write-dots2':'write-dots1', 'skill-clock2':'skill-clock1', 'skill-clock3':'skill-clock2', 'skill-clock4':'skill-clock3',
  /* ป.1: level ไล่ลำดับต่อวิชา (level 2/3 ล็อกจนกว่าจะผ่าน level ก่อน) */
  'p1-thai2':'p1-thai1', 'p1-thai3':'p1-thai2',
  'p1-math2':'p1-math1', 'p1-eng2':'p1-eng1', 'p1-iq2':'p1-iq1', 'p1-iq3':'p1-iq2',
  'p1-music2':'p1-music1', 'p1-art2':'p1-art1', 'p1-nature2':'p1-nature1',
  'p1-emotion':'p1-manners', 'p1-clock2':'p1-clock1',
  'p1-math3':'p1-math2', 'p1-eng3':'p1-eng2',
  'p1-clock3':'p1-clock2', 'p1-clock4':'p1-clock3',
  'p1-shadow2':'p1-shadow', 'p1-shadow3':'p1-shadow2',
  'p1-piano2':'p1-piano', 'p1-piano3':'p1-piano2',
  'p1-code2':'p1-code', 'p1-code3':'p1-code2',
  'p1-sci2':'p1-sci1',
  'p1-colormix2':'p1-colormix',
  /* ป.2: ล็อกลำดับ level ต่อวิชา + เกมฝึกทักษะไล่ลำดับ */
  'p2-thai2':'p2-thai1', 'p2-thai3':'p2-thai2',
  'p2-math2':'p2-math1', 'p2-math3':'p2-math2',
  'p2-eng2':'p2-eng1', 'p2-eng3':'p2-eng2',
  'p2-iq2':'p2-iq1', 'p2-iq3':'p2-iq2',
  'p2-music2':'p2-music1', 'p2-art2':'p2-art1', 'p2-nature2':'p2-nature1',
  'p2-code2':'p2-code1', 'p2-code3':'p2-code2',
  'p2-sci2':'p2-sci1',
  /* ป.3: ล็อกลำดับ level ต่อวิชา + เกมฝึกทักษะไล่ลำดับ */
  'p3-math2':'p3-math1', 'p3-math3':'p3-math2',
  'p3-thai2':'p3-thai1', 'p3-thai3':'p3-thai2',
  'p3-eng2':'p3-eng1', 'p3-eng3':'p3-eng2',
  'p3-social2':'p3-social1', 'p3-iq2':'p3-iq1',
  'p3-sci2':'p3-sci1', 'p3-iq3':'p3-iq2',
  'p3-code2':'p3-code1', 'p3-code3':'p3-code2', 'p3-code4':'p3-code3',
  'p3-music2':'p3-music1', 'p3-art2':'p3-art1', 'p3-nature2':'p3-nature1',
  /* ---- ป.4 ---- */
  'p4-math2':'p4-math1', 'p4-math3':'p4-math2',
  'p4-thai2':'p4-thai1', 'p4-thai3':'p4-thai2',
  'p4-eng2':'p4-eng1', 'p4-eng3':'p4-eng2',
  'p4-social2':'p4-social1', 'p4-sci2':'p4-sci1', 'p4-iq2':'p4-iq1',
  'p4-music2':'p4-music1', 'p4-art2':'p4-art1', 'p4-nature2':'p4-nature1',
  'p4-listen-th':'p4-listen-en', 'p4-area':'p4-chart', 'p4-angle':'p4-anglesort',
  /* ---- ป.5: ล็อกลำดับ level ต่อวิชา + เกมฝึกทักษะไล่จากง่ายไปยาก ---- */
  'p5-math2':'p5-math1', 'p5-math3':'p5-math2', 'p5-math4':'p5-math3',
  'p5-thai2':'p5-thai1', 'p5-thai3':'p5-thai2', 'p5-thai4':'p5-thai3',
  'p5-eng2':'p5-eng1', 'p5-eng3':'p5-eng2',
  'p5-social2':'p5-social1', 'p5-social3':'p5-social2', 'p5-social4':'p5-social3',
  'p5-sci2':'p5-sci1', 'p5-sci3':'p5-sci2', 'p5-sci4':'p5-sci3',
  'p5-iq2':'p5-iq1',
  'p5-thai-sentence':'p5-math-ar', 'p5-eng-sentence':'p5-thai-sentence', 'p5-eng-match':'p5-eng-sentence',
  'p5-listen-th':'p5-listen-en', 'p5-cloze1':'p5-listen-th', 'p5-cloze2':'p5-cloze1',
  'p5-order':'p5-memory', 'p5-mirror':'p5-order', 'p5-sci':'p5-mirror', 'p5-revsort':'p5-sci', 'p5-quadsort':'p5-revsort',
  'p5-wordsort':'p5-quadsort', 'p5-timeline':'p5-wordsort', 'p5-world':'p5-timeline', 'p5-ef':'p5-world', 'p5-coord':'p5-ef',
  'p5-chart':'p5-coord', 'p5-fraction':'p5-chart', 'p5-money':'p5-fraction', 'p5-balance':'p5-money', 'p5-area':'p5-balance',
  'p5-angle':'p5-area', 'p5-code':'p5-angle',
  /* ---- ป.6: ล็อกลำดับ level ต่อวิชา + เกมฝึกทักษะไล่จากง่ายไปยาก ---- */
  'p6-math2':'p6-math1', 'p6-math3':'p6-math2', 'p6-math4':'p6-math3', 'p6-math5':'p6-math4',
  'p6-thai2':'p6-thai1', 'p6-thai3':'p6-thai2', 'p6-thai4':'p6-thai3',
  'p6-eng2':'p6-eng1', 'p6-eng3':'p6-eng2',
  'p6-social2':'p6-social1', 'p6-social3':'p6-social2', 'p6-social4':'p6-social3',
  'p6-sci2':'p6-sci1', 'p6-sci3':'p6-sci2', 'p6-sci4':'p6-sci3', 'p6-sci5':'p6-sci4',
  'p6-iq2':'p6-iq1',
  'p6-thai-sentence':'p6-math-ar', 'p6-eng-sentence':'p6-thai-sentence', 'p6-eng-match':'p6-eng-sentence',
  'p6-listen-th':'p6-listen-en', 'p6-cloze1':'p6-listen-th', 'p6-cloze2':'p6-cloze1',
  'p6-order':'p6-memory', 'p6-mirror':'p6-order', 'p6-sci':'p6-mirror', 'p6-foodsort':'p6-sci', 'p6-trisort':'p6-foodsort',
  'p6-timeline':'p6-trisort', 'p6-world':'p6-timeline', 'p6-ef':'p6-world', 'p6-coord':'p6-ef', 'p6-chart':'p6-coord',
  'p6-fraction':'p6-chart', 'p6-money':'p6-fraction', 'p6-balance':'p6-money', 'p6-area':'p6-balance', 'p6-angle':'p6-area',
  'p6-tangram':'p6-angle', 'p6-circuit':'p6-tangram', 'p6-code':'p6-circuit',
  /* ---- เกมฟังประโยคเติมคำ: เกม 2 ของแต่ละชั้นปลดล็อกหลังผ่านเกม 1 ---- */
  'cloze-th2':'cloze-th1', 'p1-cloze2':'p1-cloze1', 'p2-cloze2':'p2-cloze1', 'p3-cloze2':'p3-cloze1', 'p4-cloze2':'p4-cloze1' };

/* ============ เกมเส้นเวลา (skill-timeline / p3-timeline) ============
   TIMELINE_SETS: ชุดเหตุการณ์เรียงตามลำดับเวลา index 0 = เก่า/ก่อนสุด → ท้าย = ใหม่/หลังสุด
   items แต่ละชุด emoji ไม่ซ้ำกันภายในชุด (กันแยกบัตรไม่ออก) — เกมสุ่มชุดตามจำนวนบัตรของด่าน
   ด่าน 1-3 = 3 บัตร, 4-7 = 4 บัตร, 8-10 = 5 บัตร (ดู timelineSize/startTimelineGame ใน app.js) */
const TIMELINE_SETS = [
  /* --- 3 บัตร (ง่าย) --- */
  { theme:'ช่วงเวลาในหนึ่งวัน', items:[{e:'🌅',l:'เช้า'},{e:'🌞',l:'เที่ยง'},{e:'🌆',l:'เย็น'}] },
  { theme:'การเติบโตของต้นไม้', items:[{e:'🌰',l:'เมล็ด'},{e:'🌱',l:'ต้นกล้า'},{e:'🌳',l:'ต้นไม้ใหญ่'}] },
  { theme:'วัยของคน', items:[{e:'👶',l:'ทารก'},{e:'🧒',l:'เด็ก'},{e:'🧓',l:'ผู้สูงอายุ'}] },
  { theme:'ทำกับข้าว', items:[{e:'🛒',l:'ซื้อของ'},{e:'🍳',l:'ทำอาหาร'},{e:'🍽️',l:'กินข้าว'}] },
  { theme:'กิจวัตรตอนเช้า', items:[{e:'⏰',l:'ตื่นนอน'},{e:'🪥',l:'แปรงฟัน'},{e:'🏫',l:'ไปโรงเรียน'}] },
  { theme:'วงจรชีวิตผีเสื้อ', items:[{e:'🥚',l:'ไข่'},{e:'🐛',l:'หนอน'},{e:'🦋',l:'ผีเสื้อ'}] },
  /* --- 4 บัตร (กลาง) --- */
  { theme:'หนึ่งวัน เช้าถึงค่ำ', items:[{e:'🌅',l:'เช้า'},{e:'🌞',l:'เที่ยง'},{e:'🌆',l:'เย็น'},{e:'🌙',l:'กลางคืน'}] },
  { theme:'วัยของคน', items:[{e:'👶',l:'ทารก'},{e:'🧒',l:'เด็ก'},{e:'🧑',l:'ผู้ใหญ่'},{e:'🧓',l:'ผู้สูงอายุ'}] },
  { theme:'การเดินทาง', items:[{e:'🚶',l:'เดินเท้า'},{e:'🐎',l:'ขี่ม้า'},{e:'🚗',l:'รถยนต์'},{e:'✈️',l:'เครื่องบิน'}] },
  { theme:'การสื่อสาร', items:[{e:'📜',l:'จดหมาย'},{e:'☎️',l:'โทรศัพท์บ้าน'},{e:'📱',l:'มือถือ'},{e:'💻',l:'คอมพิวเตอร์'}] },
  { theme:'อาณาจักรไทย', items:[{e:'🏯',l:'สุโขทัย'},{e:'🏰',l:'อยุธยา'},{e:'🏘️',l:'ธนบุรี'},{e:'🏙️',l:'รัตนโกสินทร์'}] },
  { theme:'การปลูกข้าว', items:[{e:'🌾',l:'หว่านข้าว'},{e:'🌱',l:'ต้นกล้า'},{e:'👨‍🌾',l:'เกี่ยวข้าว'},{e:'🍚',l:'หุงข้าว'}] },
  /* --- 5 บัตร (ยาก) --- */
  { theme:'กิจวัตรทั้งวัน', items:[{e:'⏰',l:'ตื่นนอน'},{e:'🪥',l:'แปรงฟัน'},{e:'🍳',l:'กินข้าวเช้า'},{e:'🏫',l:'ไปโรงเรียน'},{e:'🌙',l:'เข้านอน'}] },
  { theme:'วัยของคน', items:[{e:'👶',l:'ทารก'},{e:'🧒',l:'เด็ก'},{e:'🧑',l:'วัยรุ่น'},{e:'🧔',l:'ผู้ใหญ่'},{e:'🧓',l:'ผู้สูงอายุ'}] },
  { theme:'การเติบโตของพืช', items:[{e:'🌰',l:'เมล็ด'},{e:'🌱',l:'ต้นกล้า'},{e:'🌿',l:'ต้นโต'},{e:'🌸',l:'ออกดอก'},{e:'🍎',l:'ติดผล'}] },
  { theme:'วิวัฒนาการการเดินทาง', items:[{e:'🚶',l:'เดินเท้า'},{e:'🐎',l:'ม้า'},{e:'⛵',l:'เรือใบ'},{e:'🚗',l:'รถยนต์'},{e:'✈️',l:'เครื่องบิน'}] },
  { theme:'ทำเค้ก', items:[{e:'🥚',l:'ตอกไข่'},{e:'🥣',l:'ผสมแป้ง'},{e:'🎂',l:'อบเค้ก'},{e:'🍽️',l:'จัดใส่จาน'},{e:'😋',l:'ชิม'}] },
  { theme:'อาณาจักรไทยถึงปัจจุบัน', items:[{e:'🏯',l:'สุโขทัย'},{e:'🏰',l:'อยุธยา'},{e:'🏘️',l:'ธนบุรี'},{e:'🏙️',l:'รัตนโกสินทร์'},{e:'🇹🇭',l:'ปัจจุบัน'}] },

  /* ===== ป.5 (tag:'p5') — ประวัติศาสตร์อยุธยา-ธนบุรี และกระบวนการทางวิทยาศาสตร์ ป.5 ===== */
  { tag:'p5', theme:'อาณาจักรของไทย', items:[{e:'🏯', l:'สุโขทัย'}, {e:'🏰', l:'อยุธยา'}, {e:'🏘️', l:'ธนบุรี'}] },
  { tag:'p5', theme:'วัฏจักรน้ำ', items:[{e:'♨️', l:'น้ำระเหย'}, {e:'☁️', l:'ควบแน่นเป็นเมฆ'}, {e:'🌧️', l:'ฝนตก'}] },
  { tag:'p5', theme:'การเปลี่ยนสถานะของน้ำ', items:[{e:'🧊', l:'น้ำแข็ง'}, {e:'💧', l:'น้ำ'}, {e:'🌫️', l:'ไอน้ำ'}] },
  { tag:'p5', theme:'ยุคสมัยของไทย', items:[{e:'🏯', l:'สุโขทัย'}, {e:'🏰', l:'อยุธยา'}, {e:'🏘️', l:'ธนบุรี'}, {e:'🏙️', l:'รัตนโกสินทร์'}] },
  { tag:'p5', theme:'วัฏจักรน้ำเต็มรอบ', items:[{e:'♨️', l:'ระเหย'}, {e:'☁️', l:'เกิดเมฆ'}, {e:'🌧️', l:'ฝนตก'}, {e:'🏞️', l:'ไหลลงแม่น้ำ'}] },
  { tag:'p5', theme:'โซ่อาหารในนาข้าว', items:[{e:'🌾', l:'ต้นข้าว'}, {e:'🦗', l:'ตั๊กแตน'}, {e:'🐸', l:'กบ'}, {e:'🐍', l:'งู'}] },
  { tag:'p5', theme:'เหตุการณ์สำคัญสมัยอยุธยา', items:[{e:'👑', l:'สถาปนากรุงศรีอยุธยา'}, {e:'🐘', l:'พระนเรศวรกู้เอกราช'}, {e:'🤝', l:'พระนารายณ์เจริญสัมพันธไมตรี'}, {e:'⚔️', l:'เสียกรุงครั้งที่ 2'}, {e:'🏘️', l:'ตั้งกรุงธนบุรี'}] },
  { tag:'p5', theme:'ขั้นตอนการฝากเงินธนาคาร', items:[{e:'💵', l:'เก็บออมเงิน'}, {e:'🏦', l:'ไปธนาคาร'}, {e:'📝', l:'กรอกใบฝาก'}, {e:'💰', l:'ฝากเงินเข้าบัญชี'}, {e:'🪙', l:'ได้ดอกเบี้ย'}] },
  { tag:'p5', theme:'วัฏจักรน้ำและการนำไปใช้', items:[{e:'☀️', l:'แดดส่อง'}, {e:'♨️', l:'น้ำระเหย'}, {e:'☁️', l:'เกิดเมฆ'}, {e:'🌧️', l:'ฝนตก'}, {e:'🚰', l:'คนนำน้ำไปใช้'}] },
  { tag:'p5', theme:'เสียงเดินทางถึงหูเรา', items:[{e:'🥁', l:'วัตถุสั่น'}, {e:'💨', l:'ตัวกลางสั่นต่อ'}, {e:'👂', l:'หูได้ยินเสียง'}] },
  { tag:'p5', theme:'โซ่อาหารในสวน', items:[{e:'🍃', l:'ใบไม้'}, {e:'🐛', l:'หนอน'}, {e:'🐦', l:'นก'}] },
  { tag:'p5', theme:'เหตุการณ์สำคัญกรุงศรีอยุธยา', items:[{e:'👑', l:'พระเจ้าอู่ทองตั้งกรุง'}, {e:'🐘', l:'พระนเรศวรกู้เอกราช'}, {e:'⚔️', l:'เสียกรุงครั้งที่ 2'}, {e:'🏘️', l:'พระเจ้าตากตั้งกรุงธนบุรี'}] },
  { tag:'p5', theme:'การเดินทางของน้ำประปา', items:[{e:'🏞️', l:'แหล่งน้ำดิบ'}, {e:'🏭', l:'โรงกรองน้ำ'}, {e:'🛣️', l:'ท่อส่งน้ำ'}, {e:'🚰', l:'ก๊อกน้ำในบ้าน'}] },
  { tag:'p5', theme:'ดาวเคราะห์เรียงจากดวงอาทิตย์', items:[{e:'☀️', l:'ดวงอาทิตย์'}, {e:'🌑', l:'ดาวพุธ'}, {e:'🌝', l:'ดาวศุกร์'}, {e:'🌍', l:'โลก'}, {e:'🔴', l:'ดาวอังคาร'}] },
  { tag:'p5', theme:'วิธีการทางวิทยาศาสตร์', items:[{e:'❓', l:'ตั้งคำถาม'}, {e:'💭', l:'ตั้งสมมติฐาน'}, {e:'🧪', l:'ทดลอง'}, {e:'📊', l:'เก็บข้อมูล'}, {e:'✅', l:'สรุปผล'}] },

  /* ===== ป.6 (tag:'p6') — รัตนโกสินทร์ ระบบร่างกาย วัฏจักรหิน และวงจรไฟฟ้า ===== */
  { tag:'p6', theme:'ยุคสมัยของไทย', items:[{e:'🏯', l:'อยุธยา'}, {e:'🏘️', l:'ธนบุรี'}, {e:'🏙️', l:'รัตนโกสินทร์'}] },
  { tag:'p6', theme:'วัฏจักรหิน', items:[{e:'🌋', l:'หินอัคนี'}, {e:'🏜️', l:'หินตะกอน'}, {e:'🪨', l:'หินแปร'}] },
  { tag:'p6', theme:'การเกิดเงา', items:[{e:'🔦', l:'แหล่งกำเนิดแสง'}, {e:'🧱', l:'วัตถุทึบแสง'}, {e:'🌑', l:'เงาบนฉาก'}] },
  { tag:'p6', theme:'ขั้นตอนการแยกสาร', items:[{e:'🧪', l:'สารผสม'}, {e:'🧲', l:'เลือกวิธีแยก'}, {e:'✨', l:'ได้สารบริสุทธิ์'}] },
  { tag:'p6', theme:'การเดินทางของกระแสไฟฟ้า', items:[{e:'🔋', l:'ถ่านไฟฉาย'}, {e:'🔌', l:'สายไฟ'}, {e:'💡', l:'หลอดไฟสว่าง'}] },
  { tag:'p6', theme:'ทางเดินอาหารตอนต้น', items:[{e:'👄', l:'ปาก'}, {e:'🫁', l:'หลอดอาหาร'}, {e:'🫙', l:'กระเพาะอาหาร'}, {e:'🩸', l:'ลำไส้เล็ก'}] },
  { tag:'p6', theme:'อาณาจักรไทยถึงปัจจุบัน', items:[{e:'🏯', l:'สุโขทัย'}, {e:'🏰', l:'อยุธยา'}, {e:'🏘️', l:'ธนบุรี'}, {e:'🏙️', l:'รัตนโกสินทร์'}] },
  { tag:'p6', theme:'การเกิดสุริยุปราคา', items:[{e:'☀️', l:'ดวงอาทิตย์ส่องแสง'}, {e:'🌑', l:'ดวงจันทร์เคลื่อนมาบัง'}, {e:'🌍', l:'เงาทาบลงบนโลก'}, {e:'🕶️', l:'คนบนโลกเห็นคราส'}] },
  { tag:'p6', theme:'การเกิดฝนจากมรสุม', items:[{e:'🌊', l:'ลมพัดผ่านทะเล'}, {e:'💨', l:'พาไอน้ำเข้าฝั่ง'}, {e:'☁️', l:'ก่อตัวเป็นเมฆ'}, {e:'🌧️', l:'ฝนตกลงมา'}] },
  { tag:'p6', theme:'ขั้นตอนการรีไซเคิล', items:[{e:'🗑️', l:'ทิ้งขยะ'}, {e:'♻️', l:'คัดแยก'}, {e:'🏭', l:'เข้าโรงงาน'}, {e:'📦', l:'ได้ของใหม่'}] },
  { tag:'p6', theme:'ทางเดินอาหารทั้งระบบ', items:[{e:'👄', l:'ปาก'}, {e:'🫁', l:'หลอดอาหาร'}, {e:'🫙', l:'กระเพาะอาหาร'}, {e:'🩸', l:'ลำไส้เล็ก'}, {e:'🚽', l:'ลำไส้ใหญ่'}] },
  { tag:'p6', theme:'วิธีการทางประวัติศาสตร์', items:[{e:'❓', l:'ตั้งคำถาม'}, {e:'📜', l:'รวบรวมหลักฐาน'}, {e:'🔎', l:'ตรวจสอบหลักฐาน'}, {e:'💡', l:'ตีความ'}, {e:'✅', l:'สรุปผล'}] },
  { tag:'p6', theme:'ขั้นตอนการซื้อของอย่างรู้เท่าทัน', items:[{e:'📝', l:'สำรวจความจำเป็น'}, {e:'🏷️', l:'อ่านฉลาก'}, {e:'💱', l:'เปรียบเทียบราคา'}, {e:'🛒', l:'ตัดสินใจซื้อ'}, {e:'🧾', l:'เก็บใบเสร็จ'}] },
  { tag:'p6', theme:'วัฏจักรหินแบบเต็ม', items:[{e:'🌋', l:'หินหนืด'}, {e:'🪨', l:'หินอัคนี'}, {e:'🏜️', l:'ตะกอนทับถม'}, {e:'🗿', l:'หินตะกอน'}, {e:'🔥', l:'หินแปร'}] },
  { tag:'p6', theme:'การเตรียมรับมือภัยธรรมชาติ', items:[{e:'📡', l:'ติดตามข่าวเตือน'}, {e:'🎒', l:'เตรียมของจำเป็น'}, {e:'🗺️', l:'รู้เส้นทางอพยพ'}, {e:'🏃', l:'อพยพขึ้นที่สูง'}, {e:'📞', l:'แจ้งเจ้าหน้าที่'}] }
];

/* ============ เกมจัดหมวดหมู่ลงตะกร้า (sort engine — Phase 3.4) ============
   ใช้ร่วมกัน 2 เกม: นักสืบแม่เหล็ก (magnet) + จัดหมวดหมู่คำอังกฤษ (engword)
   แต่ละ pool: bins = ตะกร้า (k=คีย์, l=ป้าย), items = ของ (มี k ตรงกับตะกร้าที่ถูก)
   item แบบ emoji ใช้ {e,n} (n=ชื่อไทยกำกับ) / แบบคำ ใช้ {t}
   เกมสุ่ม N ของต่อด่าน (ด่าน 1-3=4, 4-7=5, 8-10=6) ครอบคลุมทุกตะกร้าที่ใช้ (ดู startSortGame) */
const SORT_POOLS = {
  magnet: {
    prompt:'แม่เหล็กดูดของชิ้นไหนได้? แยกลงตะกร้าให้ถูกนะ',
    bins:[{k:'yes',l:'🧲 ดูดได้'},{k:'no',l:'🚫 ดูดไม่ได้'}],
    items:[
      {e:'🔩',n:'น็อต',k:'yes'},{e:'🔑',n:'กุญแจเหล็ก',k:'yes'},{e:'📎',n:'คลิปหนีบ',k:'yes'},
      {e:'🔧',n:'ประแจ',k:'yes'},{e:'🔨',n:'ค้อน',k:'yes'},{e:'⚙️',n:'เฟือง',k:'yes'},
      {e:'🖇️',n:'ลวดเสียบ',k:'yes'},{e:'🔗',n:'โซ่เหล็ก',k:'yes'},{e:'✂️',n:'กรรไกร',k:'yes'},
      {e:'🧷',n:'เข็มกลัด',k:'yes'},{e:'🪝',n:'ตะขอเหล็ก',k:'yes'},
      {e:'🍎',n:'แอปเปิล',k:'no'},{e:'✏️',n:'ดินสอไม้',k:'no'},{e:'📄',n:'กระดาษ',k:'no'},
      {e:'🧊',n:'น้ำแข็ง',k:'no'},{e:'🎈',n:'ลูกโป่ง',k:'no'},{e:'🧸',n:'ตุ๊กตา',k:'no'},
      {e:'🪵',n:'ท่อนไม้',k:'no'},{e:'🧶',n:'ไหมพรม',k:'no'},{e:'🪨',n:'ก้อนหิน',k:'no'},
      {e:'🥤',n:'แก้วพลาสติก',k:'no'},{e:'🧽',n:'ฟองน้ำ',k:'no'},{e:'🌿',n:'ใบไม้',k:'no'},
      {e:'👕',n:'เสื้อผ้า',k:'no'},{e:'⚽',n:'ลูกบอลยาง',k:'no'},{e:'🍌',n:'กล้วย',k:'no'}
    ]
  },
  engword: {
    prompt:'ลากคำภาษาอังกฤษใส่ตะกร้าตามหมวดหมู่ให้ถูก',
    bins:[{k:'people',l:'👤 คน (People)'},{k:'animal',l:'🐾 สัตว์ (Animals)'},{k:'thing',l:'📦 สิ่งของ (Things)'}],
    items:[
      {t:'mother',k:'people'},{t:'father',k:'people'},{t:'teacher',k:'people'},{t:'doctor',k:'people'},
      {t:'boy',k:'people'},{t:'girl',k:'people'},{t:'baby',k:'people'},{t:'nurse',k:'people'},
      {t:'friend',k:'people'},{t:'farmer',k:'people'},
      {t:'cat',k:'animal'},{t:'dog',k:'animal'},{t:'bird',k:'animal'},{t:'fish',k:'animal'},
      {t:'lion',k:'animal'},{t:'cow',k:'animal'},{t:'pig',k:'animal'},{t:'duck',k:'animal'},
      {t:'tiger',k:'animal'},{t:'bear',k:'animal'},
      {t:'pen',k:'thing'},{t:'book',k:'thing'},{t:'ball',k:'thing'},{t:'cup',k:'thing'},
      {t:'bag',k:'thing'},{t:'chair',k:'thing'},{t:'box',k:'thing'},{t:'key',k:'thing'},
      {t:'desk',k:'thing'},{t:'doll',k:'thing'}
    ]
  },
  /* ป.2 — แยกสัตว์ตามที่อยู่ (บก/น้ำ/ปีก) */
  landsea: {
    prompt:'สัตว์แต่ละตัวอยู่ที่ไหน? ลากใส่ตะกร้าให้ถูกนะ',
    bins:[{k:'land',l:'🌳 สัตว์บก'},{k:'water',l:'🌊 สัตว์น้ำ'},{k:'air',l:'☁️ สัตว์ปีก'}],
    items:[
      {e:'🐶',n:'หมา',k:'land'},{e:'🐱',n:'แมว',k:'land'},{e:'🐘',n:'ช้าง',k:'land'},{e:'🦁',n:'สิงโต',k:'land'},
      {e:'🐰',n:'กระต่าย',k:'land'},{e:'🐴',n:'ม้า',k:'land'},{e:'🐮',n:'วัว',k:'land'},{e:'🐷',n:'หมู',k:'land'},
      {e:'🦒',n:'ยีราฟ',k:'land'},{e:'🐒',n:'ลิง',k:'land'},
      {e:'🐟',n:'ปลา',k:'water'},{e:'🐠',n:'ปลาการ์ตูน',k:'water'},{e:'🐬',n:'โลมา',k:'water'},{e:'🐙',n:'ปลาหมึก',k:'water'},
      {e:'🦀',n:'ปู',k:'water'},{e:'🦐',n:'กุ้ง',k:'water'},{e:'🐳',n:'วาฬ',k:'water'},{e:'🦈',n:'ฉลาม',k:'water'},
      {e:'🐦',n:'นก',k:'air'},{e:'🦅',n:'อินทรี',k:'air'},{e:'🦆',n:'เป็ด',k:'air'},{e:'🦉',n:'นกฮูก',k:'air'},
      {e:'🦜',n:'นกแก้ว',k:'air'},{e:'🕊️',n:'นกพิราบ',k:'air'},{e:'🦢',n:'หงส์',k:'air'},{e:'🐔',n:'ไก่',k:'air'}
    ]
  },
  /* ป.3 — แยกเลขคู่/เลขคี่ */
  evenodd: {
    prompt:'ลากตัวเลขใส่ตะกร้าให้ถูก เลขคู่หรือเลขคี่?',
    bins:[{k:'even',l:'2️⃣ เลขคู่'},{k:'odd',l:'1️⃣ เลขคี่'}],
    items:[
      {t:'2',k:'even'},{t:'4',k:'even'},{t:'6',k:'even'},{t:'8',k:'even'},{t:'10',k:'even'},{t:'12',k:'even'},
      {t:'14',k:'even'},{t:'16',k:'even'},{t:'18',k:'even'},{t:'20',k:'even'},{t:'24',k:'even'},{t:'30',k:'even'},
      {t:'36',k:'even'},{t:'42',k:'even'},{t:'48',k:'even'},{t:'50',k:'even'},
      {t:'1',k:'odd'},{t:'3',k:'odd'},{t:'5',k:'odd'},{t:'7',k:'odd'},{t:'9',k:'odd'},{t:'11',k:'odd'},
      {t:'13',k:'odd'},{t:'15',k:'odd'},{t:'17',k:'odd'},{t:'19',k:'odd'},{t:'21',k:'odd'},{t:'25',k:'odd'},
      {t:'33',k:'odd'},{t:'45',k:'odd'},{t:'49',k:'odd'},{t:'51',k:'odd'}
    ]
  },
  /* ป.3 — แยกสิ่งมีชีวิต/ไม่มีชีวิต (วิทยาศาสตร์) */
  living: {
    prompt:'สิ่งไหนมีชีวิต สิ่งไหนไม่มีชีวิต? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'alive',l:'🌱 มีชีวิต'},{k:'nonlife',l:'🪨 ไม่มีชีวิต'}],
    items:[
      {e:'🐶',n:'หมา',k:'alive'},{e:'🌳',n:'ต้นไม้',k:'alive'},{e:'🐟',n:'ปลา',k:'alive'},{e:'🐝',n:'ผึ้ง',k:'alive'},
      {e:'🌻',n:'ดอกไม้',k:'alive'},{e:'🦋',n:'ผีเสื้อ',k:'alive'},{e:'🐈',n:'แมว',k:'alive'},{e:'🌵',n:'กระบองเพชร',k:'alive'},
      {e:'🐛',n:'หนอน',k:'alive'},{e:'🐤',n:'ลูกไก่',k:'alive'},{e:'🐸',n:'กบ',k:'alive'},{e:'🦎',n:'จิ้งจก',k:'alive'},
      {e:'🪨',n:'ก้อนหิน',k:'nonlife'},{e:'🚗',n:'รถยนต์',k:'nonlife'},{e:'💧',n:'หยดน้ำ',k:'nonlife'},{e:'⛰️',n:'ภูเขา',k:'nonlife'},
      {e:'🪑',n:'เก้าอี้',k:'nonlife'},{e:'📱',n:'มือถือ',k:'nonlife'},{e:'☁️',n:'เมฆ',k:'nonlife'},{e:'🧸',n:'ตุ๊กตา',k:'nonlife'},
      {e:'⚽',n:'ลูกบอล',k:'nonlife'},{e:'🥄',n:'ช้อน',k:'nonlife'},{e:'🏠',n:'บ้าน',k:'nonlife'},{e:'✏️',n:'ดินสอ',k:'nonlife'}
    ]
  },
  /* ป.3 — แยกพยัญชนะ/สระ (ภาษาไทย) */
  thaichar: {
    prompt:'ตัวอักษรนี้เป็นพยัญชนะหรือสระ? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'cons',l:'พยัญชนะ (ก ข ค)'},{k:'vowel',l:'สระ (า เ แ)'}],
    items:[
      {t:'ก',k:'cons'},{t:'ข',k:'cons'},{t:'ค',k:'cons'},{t:'ง',k:'cons'},{t:'จ',k:'cons'},{t:'ช',k:'cons'},
      {t:'ด',k:'cons'},{t:'ต',k:'cons'},{t:'ท',k:'cons'},{t:'น',k:'cons'},{t:'บ',k:'cons'},{t:'ป',k:'cons'},
      {t:'พ',k:'cons'},{t:'ม',k:'cons'},{t:'ย',k:'cons'},{t:'ร',k:'cons'},{t:'ล',k:'cons'},{t:'ว',k:'cons'},
      {t:'ส',k:'cons'},{t:'ห',k:'cons'},
      {t:'า',k:'vowel'},{t:'เ',k:'vowel'},{t:'แ',k:'vowel'},{t:'โ',k:'vowel'},{t:'ใ',k:'vowel'},
      {t:'ไ',k:'vowel'},{t:'ำ',k:'vowel'},{t:'ะ',k:'vowel'}
    ]
  },
  /* ---- ป.4: แยกสัตว์มีกระดูกสันหลัง / ไม่มีกระดูกสันหลัง (ว 1.3 ป.4) ---- */
  vertebrate: {
    prompt:'สัตว์ตัวไหนมีกระดูกสันหลัง? แยกลงตะกร้าให้ถูกนะ',
    bins:[{k:'yes',l:'🦴 มีกระดูกสันหลัง'},{k:'no',l:'🪲 ไม่มีกระดูกสันหลัง'}],
    items:[
      {e:'🐟',n:'ปลา',k:'yes'},{e:'🐸',n:'กบ',k:'yes'},{e:'🐍',n:'งู',k:'yes'},{e:'🦎',n:'จิ้งจก',k:'yes'},
      {e:'🐦',n:'นก',k:'yes'},{e:'🐘',n:'ช้าง',k:'yes'},{e:'🐱',n:'แมว',k:'yes'},{e:'🐬',n:'โลมา',k:'yes'},
      {e:'🐢',n:'เต่า',k:'yes'},{e:'🦅',n:'นกอินทรี',k:'yes'},{e:'🐄',n:'วัว',k:'yes'},{e:'🐧',n:'เพนกวิน',k:'yes'},
      {e:'🐝',n:'ผึ้ง',k:'no'},{e:'🐜',n:'มด',k:'no'},{e:'🦋',n:'ผีเสื้อ',k:'no'},{e:'🕷️',n:'แมงมุม',k:'no'},
      {e:'🐌',n:'หอยทาก',k:'no'},{e:'🦐',n:'กุ้ง',k:'no'},{e:'🦀',n:'ปู',k:'no'},{e:'🐙',n:'ปลาหมึกยักษ์',k:'no'},
      {e:'🪱',n:'ไส้เดือน',k:'no'},{e:'🦂',n:'แมงป่อง',k:'no'},{e:'🪲',n:'ด้วง',k:'no'},{e:'🦗',n:'ตั๊กแตน',k:'no'}
    ]
  },
  /* ---- ป.4: แยกชนิดของคำไทย (ท 4.1 ป.4 — คำนาม/คำกริยา/คำวิเศษณ์) ---- */
  thaiword: {
    prompt:'คำนี้เป็นคำชนิดใด? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'noun',l:'📕 คำนาม'},{k:'verb',l:'🏃 คำกริยา'},{k:'adj',l:'✨ คำวิเศษณ์'}],
    items:[
      {t:'โรงเรียน',k:'noun'},{t:'ดินสอ',k:'noun'},{t:'แมว',k:'noun'},{t:'ต้นไม้',k:'noun'},
      {t:'คุณครู',k:'noun'},{t:'หนังสือ',k:'noun'},{t:'บ้าน',k:'noun'},{t:'ดอกไม้',k:'noun'},
      {t:'วิ่ง',k:'verb'},{t:'กิน',k:'verb'},{t:'อ่าน',k:'verb'},{t:'เขียน',k:'verb'},
      {t:'นอน',k:'verb'},{t:'ว่ายน้ำ',k:'verb'},{t:'ร้องเพลง',k:'verb'},{t:'กระโดด',k:'verb'},
      {t:'สวย',k:'adj'},{t:'เร็ว',k:'adj'},{t:'ใหญ่',k:'adj'},{t:'ขยัน',k:'adj'},
      {t:'สูง',k:'adj'},{t:'ร้อน',k:'adj'},{t:'อร่อย',k:'adj'},{t:'ใจดี',k:'adj'}
    ]
  },
  /* ---- ป.4: แยกชนิดของมุม (ค 2.1 ป.4) ---- */
  angletype: {
    prompt:'มุมนี้เป็นมุมชนิดใด? แยกลงตะกร้าให้ถูก',
    bins:[{k:'acute',l:'📐 มุมแหลม (< 90°)'},{k:'right',l:'🔲 มุมฉาก (90°)'},{k:'obtuse',l:'🔺 มุมป้าน (> 90°)'}],
    items:[
      {t:'30°',k:'acute'},{t:'45°',k:'acute'},{t:'60°',k:'acute'},{t:'15°',k:'acute'},
      {t:'75°',k:'acute'},{t:'80°',k:'acute'},{t:'25°',k:'acute'},{t:'50°',k:'acute'},
      {t:'90°',k:'right'},{t:'มุมฉาก',k:'right'},{t:'เข็มนาฬิกา 3:00',k:'right'},{t:'มุมกระดาษ A4',k:'right'},
      {t:'100°',k:'obtuse'},{t:'120°',k:'obtuse'},{t:'135°',k:'obtuse'},{t:'150°',k:'obtuse'},
      {t:'170°',k:'obtuse'},{t:'110°',k:'obtuse'},{t:'160°',k:'obtuse'},{t:'145°',k:'obtuse'}
    ]
  },

  /* ===== ป.5: การเปลี่ยนแปลงที่ผันกลับได้ / ผันกลับไม่ได้ (ว 2.1) ===== */
  reversible: {
    prompt:'การเปลี่ยนแปลงนี้ย้อนกลับเป็นเหมือนเดิมได้ไหม? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'yes', l:'♻️ ผันกลับได้'}, {k:'no', l:'🔥 ผันกลับไม่ได้'}],
    items:[
      {e:'🧊', n:'น้ำแข็งละลาย', k:'yes'},
      {e:'♨️', n:'น้ำเดือดเป็นไอ', k:'yes'},
      {e:'🧂', n:'เกลือละลายน้ำ', k:'yes'},
      {e:'🍬', n:'น้ำตาลละลายน้ำ', k:'yes'},
      {e:'🕯️', n:'เทียนไขหลอมเหลว', k:'yes'},
      {e:'💧', n:'ไอน้ำควบแน่น', k:'yes'},
      {e:'❄️', n:'น้ำแข็งตัวในช่องแช่', k:'yes'},
      {e:'🧊', n:'ช็อกโกแลตละลายแล้วแช่เย็นใหม่', k:'yes'},
      {e:'🔥', n:'เผากระดาษเป็นเถ้า', k:'no'},
      {e:'🍳', n:'ทอดไข่จนสุก', k:'no'},
      {e:'🔩', n:'เหล็กเป็นสนิม', k:'no'},
      {e:'🥛', n:'นมบูดเปรี้ยว', k:'no'},
      {e:'🍞', n:'ปิ้งขนมปังจนไหม้', k:'no'},
      {e:'🍌', n:'ผลไม้เน่าเสีย', k:'no'},
      {e:'🧨', n:'จุดพลุระเบิด', k:'no'},
      {e:'🎂', n:'อบเค้กจากแป้งดิบ', k:'no'}
    ]
  },

  /* ===== ป.5: จำแนกรูปสี่เหลี่ยมจากสมบัติของรูป (ค 2.2) ===== */
  quadrilateral: {
    prompt:'รูปสี่เหลี่ยมนี้มีด้านขนานกี่คู่? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'two', l:'🔷 ขนาน 2 คู่'}, {k:'one', l:'🔻 ขนาน 1 คู่'}, {k:'none', l:'⬜ ไม่มีด้านขนาน'}],
    items:[
      {t:'สี่เหลี่ยมจัตุรัส', k:'two'},
      {t:'สี่เหลี่ยมผืนผ้า', k:'two'},
      {t:'สี่เหลี่ยมด้านขนาน', k:'two'},
      {t:'สี่เหลี่ยมขนมเปียกปูน', k:'two'},
      {t:'ด้านตรงข้ามขนานกัน 2 คู่', k:'two'},
      {t:'มีมุมฉาก 4 มุม ด้านเท่ากันหมด', k:'two'},
      {t:'สี่เหลี่ยมคางหมู', k:'one'},
      {t:'มีด้านขนานเพียงคู่เดียว', k:'one'},
      {t:'สี่เหลี่ยมคางหมูหน้าจั่ว', k:'one'},
      {t:'ฐานบนสั้นกว่าฐานล่างและขนานกัน', k:'one'},
      {t:'สี่เหลี่ยมรูปว่าว', k:'none'},
      {t:'สี่เหลี่ยมด้านไม่เท่า', k:'none'},
      {t:'ไม่มีด้านคู่ใดขนานกันเลย', k:'none'},
      {t:'ด้านทั้งสี่ยาวไม่เท่ากันและเอียงทุกด้าน', k:'none'},
      {t:'ด้านตรงข้ามยาวเท่ากันและขนานกันทุกคู่', k:'two'},
      {t:'มีมุมฉาก 4 มุม แต่ด้านกว้างไม่เท่าด้านยาว', k:'two'},
      {t:'สี่เหลี่ยมคางหมูมุมฉาก', k:'one'},
      {t:'มีด้านขนานคู่เดียว ส่วนด้านข้างยาวไม่เท่ากัน', k:'one'},
      {t:'ด้านที่อยู่ติดกันยาวเท่ากันสองคู่ (รูปว่าว)', k:'none'},
      {t:'ด้านทั้งสี่ยาวต่างกันหมดทุกด้าน', k:'none'}
    ]
  },

  /* ===== ป.5: ชนิดของคำ - บุพบท สันธาน อุทาน (ท 4.1) ===== */
  wordtype5: {
    prompt:'คำนี้เป็นคำชนิดใด? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'prep', l:'📍 คำบุพบท'}, {k:'conj', l:'🔗 คำสันธาน'}, {k:'excl', l:'❗ คำอุทาน'}],
    items:[
      {t:'ใน', k:'prep'}, {t:'บน', k:'prep'}, {t:'ใต้', k:'prep'}, {t:'กับ', k:'prep'},
      {t:'แก่', k:'prep'}, {t:'ของ', k:'prep'}, {t:'ตั้งแต่', k:'prep'}, {t:'ระหว่าง', k:'prep'},
      {t:'และ', k:'conj'}, {t:'แต่', k:'conj'}, {t:'หรือ', k:'conj'}, {t:'เพราะ', k:'conj'},
      {t:'จึง', k:'conj'}, {t:'ถ้า', k:'conj'}, {t:'ดังนั้น', k:'conj'}, {t:'เมื่อ', k:'conj'},
      {t:'โอ๊ย', k:'excl'}, {t:'โอ้โฮ', k:'excl'}, {t:'อุ๊ย', k:'excl'}, {t:'ว้าย', k:'excl'},
      {t:'เอ๊ะ', k:'excl'}, {t:'ไชโย', k:'excl'}, {t:'อ๋อ', k:'excl'}, {t:'ว้าว', k:'excl'}
    ]
  },

  /* ===== ป.6: สารอาหารให้พลังงาน / ไม่ให้พลังงาน (ว 1.2) ===== */
  nutrient: {
    prompt:'สารอาหารนี้ให้พลังงานแก่ร่างกายไหม? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'yes', l:'⚡ ให้พลังงาน'}, {k:'no', l:'💚 ไม่ให้พลังงาน'}],
    items:[
      {e:'🍚', n:'ข้าว (คาร์โบไฮเดรต)', k:'yes'},
      {e:'🍞', n:'ขนมปัง (คาร์โบไฮเดรต)', k:'yes'},
      {e:'🍝', n:'เส้นก๋วยเตี๋ยว (คาร์โบไฮเดรต)', k:'yes'},
      {e:'🥚', n:'ไข่ (โปรตีน)', k:'yes'},
      {e:'🍗', n:'เนื้อไก่ (โปรตีน)', k:'yes'},
      {e:'🫘', n:'ถั่ว (โปรตีน)', k:'yes'},
      {e:'🧈', n:'เนย (ไขมัน)', k:'yes'},
      {e:'🫒', n:'น้ำมันพืช (ไขมัน)', k:'yes'},
      {e:'🍊', n:'วิตามินซีจากส้ม', k:'no'},
      {e:'🥕', n:'วิตามินเอจากแครอท', k:'no'},
      {e:'🥛', n:'แคลเซียมจากนม', k:'no'},
      {e:'🧂', n:'เกลือแร่จากเกลือ', k:'no'},
      {e:'💧', n:'น้ำดื่ม', k:'no'},
      {e:'🥬', n:'ใยอาหารจากผักใบเขียว', k:'no'}
    ]
  },

  /* ===== ป.6: จำแนกรูปสามเหลี่ยมจากสมบัติของรูป (ค 2.2) ===== */
  triangle: {
    prompt:'สามเหลี่ยมนี้เป็นชนิดใด? ลากใส่ตะกร้าให้ถูก',
    bins:[{k:'equi', l:'🔺 ด้านเท่า'}, {k:'iso', l:'📐 หน้าจั่ว'}, {k:'right', l:'🔲 มุมฉาก'}],
    items:[
      {t:'ด้านยาว 5, 5, 5 ซม.', k:'equi'},
      {t:'มุมภายในเท่ากันทั้งสามมุม มุมละ 60°', k:'equi'},
      {t:'ด้านยาว 8, 8, 8 ซม.', k:'equi'},
      {t:'ด้านเท่ากันทุกด้านและมุมเท่ากันทุกมุม', k:'equi'},
      {t:'ด้านยาว 6, 6, 4 ซม.', k:'iso'},
      {t:'มีด้านยาวเท่ากันเพียง 2 ด้าน', k:'iso'},
      {t:'มุมที่ฐานสองมุมเท่ากัน', k:'iso'},
      {t:'ด้านยาว 7, 7, 10 ซม.', k:'iso'},
      {t:'มีมุมหนึ่งเท่ากับ 90°', k:'right'},
      {t:'ด้านยาว 3, 4, 5 ซม.', k:'right'},
      {t:'มุมภายในคือ 90°, 60°, 30°', k:'right'},
      {t:'มีมุมฉากหนึ่งมุมและด้านตรงข้ามมุมฉากยาวที่สุด', k:'right'}
    ]
  }
};

/* จำนวนคู่ (pairs) ต่อด่านของเกม skill-memory (จับคู่ตัวเลขกับจุด), index 0 = ด่าน 1 */
const MEMORY_LEVEL_PAIRS = [4, 8, 12];

/* ============ เกมผสมสี (skill-mix / skill-mix2) ============
   MIX_COLORS: กระปุกสีทั้งหมดที่หยอดลงหม้อได้ (id → ชื่อไทย + ค่าสี)
   MIX_RECIPES: สูตรผสม 2 สี → สีผลลัพธ์, tier 1-3 ไล่ความยากตามด่าน (ผสมสี 1)
   MIX_TWOSTEP: สูตรผสม 3 สี 2 จังหวะ (ผสมสี 2 ด่าน 6-10) — steps คือลำดับหยอด, mid คือสีกลางทางโชว์ในหม้อ */
const MIX_COLORS = {
  red:    {n:'สีแดง',    c:'#E53935'},
  yellow: {n:'สีเหลือง', c:'#FDD835'},
  blue:   {n:'สีน้ำเงิน', c:'#1E63C4'},
  white:  {n:'สีขาว',    c:'#FDFDFD'},
  black:  {n:'สีดำ',     c:'#3B3B3B'},
  green:  {n:'สีเขียว',  c:'#43A047'},
  purple: {n:'สีม่วง',   c:'#8E44AD'},
  orange: {n:'สีส้ม',    c:'#FB8C00'}
};
const MIX_RECIPES = [
  {mix:['red','yellow'],   out:{n:'สีส้ม',       c:'#FB8C00'}, tier:1},
  {mix:['yellow','blue'],  out:{n:'สีเขียว',     c:'#43A047'}, tier:1},
  {mix:['red','blue'],     out:{n:'สีม่วง',      c:'#8E44AD'}, tier:1},
  {mix:['red','white'],    out:{n:'สีชมพู',      c:'#F48FB1'}, tier:2},
  {mix:['blue','white'],   out:{n:'สีฟ้า',       c:'#64B5F6'}, tier:2},
  {mix:['white','black'],  out:{n:'สีเทา',       c:'#9E9E9E'}, tier:2},
  {mix:['red','green'],    out:{n:'สีน้ำตาล',    c:'#8D6E63'}, tier:3},
  {mix:['green','white'],  out:{n:'สีเขียวอ่อน', c:'#A5D6A7'}, tier:3},
  {mix:['purple','white'], out:{n:'สีม่วงอ่อน',  c:'#CE93D8'}, tier:3},
  {mix:['orange','white'], out:{n:'สีส้มอ่อน',   c:'#FFCC80'}, tier:3},
  {mix:['red','black'],    out:{n:'สีแดงเข้ม',   c:'#8E1B1B'}, tier:3},
  {mix:['blue','black'],   out:{n:'สีกรมท่า',    c:'#16325C'}, tier:3}
];
const MIX_TWOSTEP = [
  {steps:['red','yellow','white'],  mid:{n:'สีส้ม',   c:'#FB8C00'}, out:{n:'สีส้มอ่อน',   c:'#FFCC80'}},
  {steps:['yellow','blue','white'], mid:{n:'สีเขียว', c:'#43A047'}, out:{n:'สีเขียวอ่อน', c:'#A5D6A7'}},
  {steps:['red','blue','white'],    mid:{n:'สีม่วง',  c:'#8E44AD'}, out:{n:'สีม่วงอ่อน',  c:'#CE93D8'}},
  {steps:['yellow','blue','red'],   mid:{n:'สีเขียว', c:'#43A047'}, out:{n:'สีน้ำตาล',    c:'#8D6E63'}},
  {steps:['yellow','blue','black'], mid:{n:'สีเขียว', c:'#43A047'}, out:{n:'สีเขียวเข้ม', c:'#1B5E20'}}
];

/* เกมทายเงา (skill-shadow): คลังโจทย์ {e:emoji, n:ชื่อไทย, s:รูปทรงเงา} แบ่ง 3 กลุ่ม
   s = shape tag ไว้เลือกตัวหลอกที่เงา/รูปทรงใกล้เคียงกับคำตอบก่อน (ถ้าไม่พอค่อยเติมสุ่มจากกลุ่มเดียวกัน)
   แต่ละกลุ่มมีของเกิน 15 ด่านรวมกันมากพอให้สุ่มเล่นซ้ำไม่ซ้ำเดิม */
const SHADOW_ITEMS = {
  animals: [
    {e:'🐘', n:'ช้าง', s:'big4'}, {e:'🦒', n:'ยีราฟ', s:'big4'},
    {e:'🦁', n:'สิงโต', s:'face'}, {e:'🐰', n:'กระต่าย', s:'face'}, {e:'🐸', n:'กบ', s:'face'},
    {e:'🐈', n:'แมว', s:'pet4'}, {e:'🐕', n:'หมา', s:'pet4'},
    {e:'🐢', n:'เต่า', s:'low'}, {e:'🐊', n:'จระเข้', s:'low'},
    {e:'🦆', n:'เป็ด', s:'bird'}, {e:'🐓', n:'ไก่', s:'bird'}, {e:'🦉', n:'นกฮูก', s:'bird'}, {e:'🦩', n:'นกฟลามิงโก', s:'bird'},
    {e:'🐟', n:'ปลา', s:'sea'}, {e:'🦈', n:'ฉลาม', s:'sea'}, {e:'🐙', n:'ปลาหมึก', s:'sea'}, {e:'🦀', n:'ปู', s:'sea'},
    {e:'🦋', n:'ผีเสื้อ', s:'wing'}
  ],
  fruits: [
    {e:'🍎', n:'แอปเปิ้ล', s:'round'}, {e:'🍉', n:'แตงโม', s:'round'}, {e:'🍒', n:'เชอร์รี', s:'round'},
    {e:'🍐', n:'ลูกแพร์', s:'round'}, {e:'🍓', n:'สตรอว์เบอร์รี', s:'round'}, {e:'🍄', n:'เห็ด', s:'round'}, {e:'🍇', n:'องุ่น', s:'round'},
    {e:'🍌', n:'กล้วย', s:'long'}, {e:'🥕', n:'แครอท', s:'long'}, {e:'🌽', n:'ข้าวโพด', s:'long'},
    {e:'🍍', n:'สับปะรด', s:'crown'}, {e:'🥦', n:'บรอกโคลี', s:'crown'}
  ],
  objects: [
    {e:'✈️', n:'เครื่องบิน', s:'fly'}, {e:'🚀', n:'จรวด', s:'fly'}, {e:'🪁', n:'ว่าว', s:'fly'},
    {e:'🚗', n:'รถยนต์', s:'road'}, {e:'🚲', n:'จักรยาน', s:'road'}, {e:'🛴', n:'สกู๊ตเตอร์', s:'road'},
    {e:'⚽', n:'ลูกบอล', s:'round'}, {e:'⏰', n:'นาฬิกาปลุก', s:'round'},
    {e:'☂️', n:'ร่ม', s:'dome'}, {e:'🎩', n:'หมวก', s:'dome'},
    {e:'🔑', n:'กุญแจ', s:'hand'}, {e:'✂️', n:'กรรไกร', s:'hand'},
    {e:'👟', n:'รองเท้า', s:'wear'}, {e:'🧸', n:'ตุ๊กตาหมี', s:'toy'}, {e:'🎸', n:'กีตาร์', s:'stick'}
  ]
};

/* ============================= เกมดนตรี (skill-music) — เปียโน ============================= */
/* คีย์ขาว 15 คีย์ = 2 ช่วงเสียง (โด-โด) โน้ตไทย ด ร ม ฟ ซ ล ท + โน้ตอังกฤษ C D E F G A B
   แต่ละโน้ตมีสีประจำ (ไล่สายรุ้ง โน้ตชื่อเดียวกันสีเดียวกันทุกช่วงเสียง) freq = ความถี่จริง (equal temperament)
   โจทย์ทุก level อ้างอิงคีย์ด้วย index ในอาเรย์นี้ (0-14) — โจทย์ใช้เฉพาะคีย์ขาว */
const MUSIC_WHITE_KEYS = [
  {th:'ด', en:'C', freq:261.63, color:'#F94144'},
  {th:'ร', en:'D', freq:293.66, color:'#F8961E'},
  {th:'ม', en:'E', freq:329.63, color:'#F9C74F'},
  {th:'ฟ', en:'F', freq:349.23, color:'#90BE6D'},
  {th:'ซ', en:'G', freq:392.00, color:'#43AA8B'},
  {th:'ล', en:'A', freq:440.00, color:'#4D96FF'},
  {th:'ท', en:'B', freq:493.88, color:'#9D4EDD'},
  {th:'ด', en:'C', freq:523.25, color:'#F94144'},
  {th:'ร', en:'D', freq:587.33, color:'#F8961E'},
  {th:'ม', en:'E', freq:659.25, color:'#F9C74F'},
  {th:'ฟ', en:'F', freq:698.46, color:'#90BE6D'},
  {th:'ซ', en:'G', freq:783.99, color:'#43AA8B'},
  {th:'ล', en:'A', freq:880.00, color:'#4D96FF'},
  {th:'ท', en:'B', freq:987.77, color:'#9D4EDD'},
  {th:'ด', en:'C', freq:1046.50, color:'#F94144'}
];
/* คีย์ดำ 10 คีย์ (เสียงครึ่งเสียง/ชาร์ป) กดได้มีเสียงจริง แต่โจทย์ไม่เคยใช้
   after = index คีย์ขาวที่คีย์ดำนี้แทรกอยู่ทางขวา (ไม่มีคีย์ดำหลัง ม/ท คือ index 2,6,9,13,14) */
const MUSIC_BLACK_KEYS = [
  {after:0, freq:277.18}, {after:1, freq:311.13},
  {after:3, freq:369.99}, {after:4, freq:415.30}, {after:5, freq:466.16},
  {after:7, freq:554.37}, {after:8, freq:622.25},
  {after:10, freq:739.99}, {after:11, freq:830.61}, {after:12, freq:932.33}
];
/* Level 1 (คีย์มีตัวโน้ตกำกับ) และ Level 3 (คีย์ไม่มีตัวโน้ต หาคีย์เอง) สุ่มโจทย์สดทุกครั้ง
   ไล่ความยากตามด่าน: ด่าน 1-3 = 1 โน้ต, 4-7 = 2 โน้ต, 8-10 = 3 โน้ต (ดู randMusicTarget ใน app.js)
   การเช็คคำตอบเทียบด้วย "ชื่อโน้ต" (ด/ร/ม...) ไม่ผูก octave กดคีย์ชื่อเดียวกัน octave ไหนก็ถือว่าถูก */
/* Level 2: เกมความจำสะสม (Simon) คีย์ยังมีตัวโน้ตกำกับ ด่าน n ให้กดโน้ตตัวที่ 1..n เรียงตามลำดับ
   เปิดเผยเฉพาะโน้ตตัวใหม่ของด่านนั้น ตัวก่อนหน้าต้องจำเอง — สุ่ม 1 เพลงจาก 10 เพลงจริงต่อการเล่น (เล่นซ้ำได้เพลงใหม่)
   notes เก็บทำนอง "เต็มเพลง" (ใช้ในเปียโนของหนู modal เลือกเพลงเล่นจนจบ)
   *** Level 2 ใช้แค่ 7 โน้ตแรกเท่านั้น *** (renderMusicLevel slice(0, level) ด่านสูงสุดตาม cat.levels = 7)
   ดังนั้นโน้ตช่วงต้นของทุกเพลงต้องคงไว้เหมือนเดิม (index คีย์ขาว 0-14 = ด ร ม ฟ ซ ล ท ด ร ม ฟ ซ ล ท ด)
   beats = ความยาวโน้ตแต่ละตัวเป็น "จังหวะ" (1 = ตัวดำ) ยาวเท่ากับ notes เป๊ะ — ใช้ตอนกดฟังเพลง
   (playMusicSequence) ให้ทำนองถูกจังหวะจริง ไม่ใช่เล่นทุกตัวยาวเท่ากัน */
const MUSIC_LEVEL2_SONGS = [
  { name:'ดาวน้อย 🌟',          notes:[0,0,4,4,5,5,4, 3,3,2,2,1,1,0, 4,4,3,3,2,2,1, 4,4,3,3,2,2,1, 0,0,4,4,5,5,4, 3,3,2,2,1,1,0],
    beats:[1,1,1,1,1,1,2, 1,1,1,1,1,1,2, 1,1,1,1,1,1,2, 1,1,1,1,1,1,2, 1,1,1,1,1,1,2, 1,1,1,1,1,1,2] }, /* Twinkle Twinkle */
  { name:'แกะน้อยของแมรี่ 🐑',   notes:[2,1,0,1,2,2,2, 1,1,1, 2,4,4, 2,1,0,1,2,2,2,2, 1,1,2,1,0],
    beats:[1,1,1,1,1,1,2, 1,1,2, 1,1,2, 1,1,1,1,1,1,1,1, 1,1,1,1,4] }, /* Mary Had a Little Lamb */
  { name:'เพลงแห่งความสุข 😊',   notes:[2,2,3,4,4,3,2,1, 0,0,1,2,2,1,1, 2,2,3,4,4,3,2,1, 0,0,1,2,1,0,0],
    beats:[1,1,1,1,1,1,1,1, 1,1,1,1,1.5,0.5,2, 1,1,1,1,1,1,1,1, 1,1,1,1,1.5,0.5,2] }, /* Ode to Joy */
  { name:'ลุงมากมีฟาร์ม 🚜',     notes:[0,0,0,4,5,5,4, 2,2,1,1,0, 4,0,0,0, 4,5,5,4, 2,2,1,1,0],
    beats:[1,1,1,1,1,1,2, 1,1,1,1,2, 1,1,1,1, 1,1,1,2, 1,1,1,1,2] }, /* Old MacDonald */
  { name:'พายเรือน้อย 🚣',       notes:[0,0,0,1,2, 2,1,2,3,4, 7,7,7,4,4,4,2,2,2,0,0,0, 4,3,2,1,0],
    beats:[1,1,0.7,0.3,1, 0.7,0.3,0.7,0.3,2, 0.34,0.33,0.33,0.34,0.33,0.33,0.34,0.33,0.33,0.34,0.33,0.33, 0.7,0.3,0.7,0.3,2] }, /* Row Your Boat */
  { name:'สะพานลอนดอน 🌉',       notes:[4,5,4,3,2,3,4, 1,2,3, 2,3,4, 4,5,4,3,2,3,4, 1,4,2,0],
    beats:[1.5,0.5,1,1,1,1,2, 1,1,2, 1,1,2, 1.5,0.5,1,1,1,1,2, 1,1,1,2] }, /* London Bridge */
  { name:'ขนมปังปิ้ง 🍞',        notes:[2,1,0, 2,1,0, 0,0,0,0, 1,1,1,1, 2,1,0],
    beats:[1,1,2, 1,1,2, 0.5,0.5,0.5,0.5, 0.5,0.5,0.5,0.5, 1,1,2] }, /* Hot Cross Buns */
  { name:'จิงเกิ้ลเบล 🔔',       notes:[2,2,2,2,2,2,2,4,0,1, 2, 3,3,3,3, 3,2,2,2, 2,1,1,2, 1,4],
    beats:[1,1,2, 1,1,2, 1,1,1.5,0.5, 4, 1,1,1.5,0.5, 1,1,1,1, 1,1,1,1, 2,2] }, /* Jingle Bells */
  { name:'พี่จอห์นหลับ 😴',      notes:[0,1,2,0, 0,1,2,0, 2,3,4, 2,3,4, 4,5,4,3,2,0, 4,5,4,3,2,0, 0,4,0, 0,4,0],
    beats:[1,1,1,1, 1,1,1,1, 1,1,2, 1,1,2, 0.5,0.5,0.5,0.5,1,1, 0.5,0.5,0.5,0.5,1,1, 1,1,2, 1,1,2] }, /* Frère Jacques */
  { name:'สุขสันต์วันเกิด 🎂',   notes:[4,4,5,4,7,6, 4,4,5,4,8,7, 4,4,11,9,7,6,5, 10,10,9,7,8,7],
    beats:[0.75,0.25,1,1,1,2, 0.75,0.25,1,1,1,2, 0.75,0.25,1,1,1,1,2, 0.75,0.25,1,1,1,3] }  /* Happy Birthday */
];

/* ============================= CONNECT-DOTS SHAPES (เกมลากเส้นต่อจุด 1/2) =============================
   พิกัดจุดอยู่ในระบบ 0-100 ทั้งแกน x/y (สัมพันธ์กับกระดานสี่เหลี่ยมจัตุรัส .dots-stage — SVG viewBox 0 0 100 100)
   แต่ละรูปคือเส้นต่อเนื่องเส้นเดียว (single stroke) ลากจุด 1 → N แล้วระบบปิดเส้นกลับจุด 1 ให้อัตโนมัติ
   easy = ลากเส้นต่อจุด 1 (5-7 จุด), hard = ลากเส้นต่อจุด 2 (10-13 จุด) — อย่างละ 30 รูป
   แต่ละรอบเล่นสุ่มมา 10 รูป (ดู startDotsGame: shuffle แล้ว slice ตาม cat.levels) เล่นซ้ำเจอรูปไม่ซ้ำรอบเดิม
   ข้อควรระวัง: จุดที่ติดกันต้องห่างกัน ≥ 12 หน่วย และจุดใดๆ ห่างกัน ≥ 10 หน่วย
   ไม่งั้นวงรับสัมผัส (hit radius) จะซ้อนกันจนกดพลาดง่าย */
const DOTS_SHAPES = {
  easy: [
    { name:'ดาว',          e:'⭐', pts:[[50,10],[73,86],[12,40],[88,40],[27,86]] },
    { name:'บ้าน',         e:'🏠', pts:[[50,12],[86,42],[86,88],[14,88],[14,42]] },
    { name:'เพชร',         e:'💎', pts:[[32,16],[68,16],[88,40],[50,90],[12,40]] },
    { name:'ปลา',          e:'🐟', pts:[[10,52],[40,28],[68,44],[92,24],[92,80],[68,60],[40,76]] },
    { name:'ภูเขา',        e:'⛰️', pts:[[6,86],[32,26],[50,54],[70,16],[94,86]] },
    { name:'เรือใบ',       e:'⛵', pts:[[50,4],[78,54],[94,62],[74,88],[26,88],[6,62],[22,54]] },
    { name:'หัวใจ',        e:'❤️', pts:[[50,88],[10,42],[26,14],[50,30],[74,14],[90,42]] },
    { name:'ต้นคริสต์มาส', e:'🎄', pts:[[50,8],[80,44],[64,44],[90,84],[10,84],[36,44],[20,44]] },
    { name:'ลูกศร',        e:'➡️', pts:[[8,38],[56,38],[56,16],[92,50],[56,84],[56,62],[8,62]] },
    { name:'เต็นท์',       e:'⛺', pts:[[50,12],[92,86],[62,86],[50,58],[38,86],[8,86]] },
    { name:'พระจันทร์เสี้ยว', e:'🌙', pts:[[58,6],[20,28],[20,72],[58,94],[40,72],[34,50],[40,28]] },
    { name:'ธง',           e:'🚩', pts:[[20,88],[20,8],[80,20],[56,30],[80,42],[20,54]] },
    { name:'พิซซ่า',       e:'🍕', pts:[[50,90],[12,22],[32,8],[50,14],[68,8],[88,22]] },
    { name:'แตงโม',        e:'🍉', pts:[[8,30],[92,30],[78,58],[50,70],[22,58]] },
    { name:'โบว์',         e:'🎀', pts:[[12,16],[46,40],[80,16],[80,84],[46,60],[12,84]] },
    { name:'ระฆัง',        e:'🔔', pts:[[50,8],[70,26],[74,56],[88,72],[12,72],[26,56],[30,26]] },
    { name:'สายฟ้า',       e:'⚡', pts:[[60,6],[20,54],[44,56],[38,92],[80,40],[54,38]] },
    { name:'แครอท',        e:'🥕', pts:[[24,12],[62,20],[54,48],[38,90],[18,44]] },
    { name:'ชีส',          e:'🧀', pts:[[8,72],[60,24],[92,36],[92,72],[50,88]] },
    { name:'รองเท้าบู๊ต',  e:'👢', pts:[[30,8],[58,8],[58,54],[88,70],[88,88],[30,88]] },
    { name:'แก้วนม',       e:'🥛', pts:[[24,10],[76,10],[70,50],[66,90],[34,90],[30,50]] },
    { name:'ถุงเท้า',      e:'🧦', pts:[[38,6],[64,6],[64,48],[86,62],[74,88],[30,64]] },
    { name:'ดอกทิวลิป',    e:'🌷', pts:[[18,20],[36,42],[50,14],[64,42],[82,20],[64,86],[36,86]] },
    { name:'ซองจดหมาย',    e:'✉️', pts:[[8,36],[50,8],[92,36],[92,84],[8,84]] },
    { name:'กางเกง',       e:'👖', pts:[[30,10],[70,10],[78,88],[58,88],[50,48],[42,88],[22,88]] },
    { name:'ดินสอ',        e:'✏️', pts:[[10,36],[64,36],[90,50],[64,64],[10,64]] },
    { name:'หยดน้ำ',       e:'💧', pts:[[50,6],[74,44],[70,74],[50,88],[30,74],[26,44]] },
    { name:'เมฆ',          e:'☁️', pts:[[12,62],[16,40],[34,26],[58,24],[78,32],[90,48],[86,64]] },
    { name:'คัพเค้ก',      e:'🧁', pts:[[26,40],[38,18],[50,30],[62,18],[74,40],[64,88],[36,88]] },
    { name:'ขนมปัง',       e:'🍞', pts:[[22,36],[30,18],[50,12],[70,18],[78,36],[78,88],[22,88]] }
  ],
  hard: [
    { name:'จรวด',       e:'🚀', pts:[[50,4],[64,24],[64,58],[88,86],[58,74],[50,88],[42,74],[12,86],[36,58],[36,24]] },
    { name:'ผีเสื้อ',    e:'🦋', pts:[[50,30],[80,10],[94,34],[66,46],[90,64],[74,86],[50,66],[26,86],[10,64],[34,46],[6,34],[20,10]] },
    { name:'ปราสาท',     e:'🏰', pts:[[10,88],[10,32],[24,32],[24,16],[38,16],[38,32],[62,32],[62,16],[76,16],[76,32],[90,32],[90,88]] },
    { name:'รถยนต์',     e:'🚗', pts:[[6,66],[10,48],[28,44],[38,26],[66,26],[76,44],[92,48],[94,66],[64,66],[36,66]] },
    { name:'มงกุฎ',      e:'👑', pts:[[10,80],[10,34],[28,52],[38,18],[50,44],[62,18],[72,52],[90,34],[90,80],[50,80]] },
    { name:'แมว',        e:'🐱', pts:[[12,62],[12,28],[22,8],[36,24],[50,28],[64,24],[78,8],[88,28],[88,62],[68,84],[32,84]] },
    { name:'เครื่องบิน', e:'✈️', pts:[[50,6],[58,30],[92,52],[58,46],[58,72],[74,88],[50,82],[26,88],[42,72],[42,46],[8,52],[42,30]] },
    { name:'เห็ด',       e:'🍄', pts:[[14,46],[16,26],[36,10],[64,10],[84,26],[86,46],[64,46],[68,84],[32,84],[36,46]] },
    { name:'วาฬ',        e:'🐳', pts:[[8,48],[20,30],[44,24],[66,30],[76,44],[92,22],[96,50],[84,56],[64,66],[36,68],[14,60]] },
    { name:'ไอศกรีม',    e:'🍦', pts:[[26,32],[34,12],[44,24],[50,4],[56,24],[66,12],[74,32],[70,48],[50,92],[30,48]] },
    { name:'ถ้วยรางวัล', e:'🏆', pts:[[26,10],[74,10],[70,44],[56,58],[56,74],[72,88],[28,88],[44,74],[44,58],[30,44]] },
    { name:'กระบองเพชร', e:'🌵', pts:[[40,90],[40,56],[16,56],[16,40],[40,40],[40,12],[60,12],[60,26],[84,26],[84,42],[60,42],[60,90]] },
    { name:'อมยิ้ม',     e:'🍭', pts:[[50,4],[78,16],[84,42],[74,52],[62,58],[58,90],[42,90],[38,58],[26,52],[16,42],[22,16]] },
    { name:'เต่า',       e:'🐢', pts:[[16,54],[28,32],[50,24],[72,32],[84,54],[94,44],[96,60],[84,66],[74,82],[60,66],[40,66],[30,82],[20,66]] },
    { name:'เสื้อยืด',   e:'👕', pts:[[36,10],[64,10],[90,28],[80,46],[66,38],[66,88],[34,88],[34,38],[20,46],[10,28]] },
    { name:'ดอกไม้',     e:'🌸', pts:[[50,7],[65,31],[93,38],[75,60],[76,88],[50,78],[24,88],[25,60],[7,38],[35,31]] },
    { name:'หอคอย',      e:'🗼', pts:[[50,4],[58,32],[66,60],[84,90],[64,90],[58,72],[42,72],[36,90],[16,90],[34,60],[42,32]] },
    { name:'กระดูก',     e:'🦴', pts:[[14,26],[30,36],[70,36],[86,26],[94,42],[86,58],[70,50],[30,50],[14,58],[6,42]] },
    { name:'ฟัน',        e:'🦷', pts:[[20,40],[26,18],[42,10],[58,10],[74,18],[80,40],[72,60],[66,88],[56,62],[44,62],[34,88],[28,60]] },
    { name:'รถไฟ',       e:'🚂', pts:[[10,82],[10,40],[26,40],[26,22],[42,22],[42,40],[60,40],[60,28],[74,28],[74,40],[90,40],[90,82]] },
    { name:'ค้อน',       e:'🔨', pts:[[18,12],[64,12],[78,20],[78,32],[56,40],[56,84],[50,96],[42,84],[42,40],[18,40]] },
    { name:'เก้าอี้',    e:'🪑', pts:[[24,6],[38,6],[38,40],[76,40],[76,90],[62,90],[62,54],[38,54],[38,90],[24,90]] },
    { name:'ฟักทอง',     e:'🎃', pts:[[44,4],[58,4],[58,18],[78,24],[92,44],[88,68],[68,86],[32,86],[12,68],[8,44],[22,24],[44,18]] },
    { name:'กระต่าย',    e:'🐰', pts:[[24,86],[14,58],[20,40],[26,12],[38,12],[42,38],[58,38],[62,12],[74,12],[80,40],[86,58],[76,86]] },
    { name:'เป็ด',       e:'🦆', pts:[[10,46],[30,34],[52,38],[56,14],[70,6],[84,12],[86,26],[96,34],[84,38],[84,52],[70,68],[40,70],[18,60]] },
    { name:'ถุงมือ',     e:'🧤', pts:[[30,88],[24,50],[12,42],[16,28],[30,34],[32,16],[48,8],[66,12],[74,28],[72,50],[66,88]] },
    { name:'แปรงสีฟัน',  e:'🪥', pts:[[6,54],[6,30],[13,16],[19,30],[26,16],[33,30],[33,42],[80,42],[94,48],[80,54]] },
    { name:'นกฮูก',      e:'🦉', pts:[[30,22],[18,6],[38,14],[62,14],[82,6],[70,22],[78,42],[74,68],[56,84],[44,84],[26,68],[22,42]] },
    { name:'ขวดนม',      e:'🍼', pts:[[44,4],[56,4],[58,16],[70,16],[70,28],[78,38],[78,88],[22,88],[22,38],[30,28],[30,16],[42,16]] },
    { name:'กล่องของขวัญ', e:'🎁', pts:[[50,26],[34,10],[22,18],[34,26],[14,26],[14,88],[86,88],[86,26],[66,26],[78,18],[66,10]] }
  ]
};
