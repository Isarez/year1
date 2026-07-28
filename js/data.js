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
  { id:'p5',      name:'ประถมศึกษาปีที่ 5', short:'ป.5', emoji:'🦉', icon:'assets/icons/grade-owl5.svg', minAge:10, maxAge:10, available:false },
  { id:'p6',      name:'ประถมศึกษาปีที่ 6', short:'ป.6', emoji:'🦉', icon:'assets/icons/grade-owl6.svg', minAge:11, maxAge:99, available:false }
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
const SCIENCE_POOLS = { sci1: SCIENCE_FLOAT, sci2: SCIENCE_MIX, p2living: SCIENCE_LIVING_P2, p2absorb: SCIENCE_ABSORB_P2 };

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
  ]
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
  'p4-listen-th':'p4-listen-en', 'p4-area':'p4-chart', 'p4-angle':'p4-anglesort' };

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
  { theme:'อาณาจักรไทยถึงปัจจุบัน', items:[{e:'🏯',l:'สุโขทัย'},{e:'🏰',l:'อยุธยา'},{e:'🏘️',l:'ธนบุรี'},{e:'🏙️',l:'รัตนโกสินทร์'},{e:'🇹🇭',l:'ปัจจุบัน'}] }
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
