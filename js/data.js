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
    type:'listen', mode:'hint', levels:10
  },
  {
    id:'listen2', name:'ฟังคำศัพท์ 2', emoji:'👂', icon:'assets/icons/listen-2.svg', color:'#5B6EE8', light:'#E1E6FD',
    type:'listen', mode:'nohint', levels:10
  },
  {
    id:'listen-th1', name:'ฟังคำไทย 1', emoji:'🗣️', icon:'assets/icons/listen-th1.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'hint', lang:'th', levels:10
  },
  {
    id:'listen-th2', name:'ฟังคำไทย 2', emoji:'🔊', icon:'assets/icons/listen-th2.svg', color:'#2FAE86', light:'#D8F3EA',
    type:'listen', mode:'nohint', lang:'th', levels:10
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
      {q:'จำนวนใดเป็นเลขคี่?', emoji:'🔢', choices:['7','8','10','4'], correct:0, explain:'7 หารด้วย 2 ไม่ลงตัว จึงเป็นเลขคี่', tier:2}
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
      {q:'แบ่งลูกอม 12 เม็ด ให้เพื่อน 3 คน เท่าๆ กัน คนละกี่เม็ด?', emoji:'🍭', choices:['4','3','5','6'], correct:0, explain:'12 แบ่งเป็น 3 กลุ่มเท่าๆ กัน ได้กลุ่มละ 4 เม็ด', tier:2},
      {q:'15 + 4 = ?', emoji:'➕', choices:['19','18','20','14'], correct:0, explain:'15 บวก 4 เท่ากับ 19', tier:1},
      {q:'25 - 5 = ?', emoji:'➖', choices:['20','15','30','22'], correct:0, explain:'25 ลบ 5 เท่ากับ 20', tier:1},
      {q:'7 + 8 = ?', emoji:'➕', choices:['15','14','16','13'], correct:0, explain:'7 บวก 8 เท่ากับ 15', tier:1},
      {q:'มีลูกอม 10 เม็ด กินไป 3 เม็ด เหลือกี่เม็ด?', emoji:'🍬', choices:['7','6','8','13'], correct:0, explain:'10 - 3 = 7 เม็ด', tier:1},
      {q:'34 + 29 = ?', emoji:'➕', choices:['63','62','64','53'], correct:0, explain:'34 บวก 29 เท่ากับ 63', tier:2},
      {q:'71 - 26 = ?', emoji:'➖', choices:['45','44','46','55'], correct:0, explain:'71 ลบ 26 เท่ากับ 45', tier:2},
      {q:'มีไก่ 12 ตัว ซื้อมาเพิ่ม 9 ตัว รวมมีกี่ตัว?', emoji:'🐔', choices:['21','20','22','19'], correct:0, explain:'12 + 9 = 21 ตัว', tier:2},
      {q:'2 × 4 = ? (2 กลุ่ม กลุ่มละ 4)', emoji:'✖️', choices:['8','6','10','12'], correct:0, explain:'2 × 4 = 4 + 4 = 8', tier:2}
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
      {q:'2 × 3 = ? (2 กลุ่ม กลุ่มละ 3)', emoji:'✖️', choices:['6','5','8','4'], correct:0, explain:'2 × 3 = 3 + 3 = 6', tier:1},
      {q:'5 × 2 = ?', emoji:'✖️', choices:['10','7','12','8'], correct:0, explain:'5 × 2 = 5 + 5 = 10', tier:1},
      {q:'นับทีละ 3: 3, 6, 9, ▢', emoji:'👣', choices:['12','10','11','15'], correct:0, explain:'นับเพิ่มทีละ 3 ตัวต่อไปคือ 12', tier:1},
      {q:'รถ 2 คัน คันละ 4 ล้อ รวมมีกี่ล้อ?', emoji:'🚗', choices:['8','6','10','4'], correct:0, explain:'4 + 4 = 8 ล้อ (2 กลุ่ม กลุ่มละ 4)', tier:1},
      {q:'100 - 50 = ?', emoji:'➖', choices:['50','40','60','150'], correct:0, explain:'100 ลบ 50 เท่ากับ 50', tier:1},
      {q:'ครึ่งหนึ่งของ 10 คือเท่าไร?', emoji:'✂️', choices:['5','2','10','15'], correct:0, explain:'10 แบ่งครึ่งได้ 5', tier:1},
      {q:'4 × 3 = ?', emoji:'✖️', choices:['12','7','9','16'], correct:0, explain:'4 × 3 = 4 + 4 + 4 = 12', tier:2},
      {q:'6 × 2 = ?', emoji:'✖️', choices:['12','8','10','14'], correct:0, explain:'6 × 2 = 6 + 6 = 12', tier:2},
      {q:'นับทีละ 100: 100, 200, 300, ▢', emoji:'💯', choices:['400','310','350','500'], correct:0, explain:'นับเพิ่มทีละ 100 ตัวต่อไปคือ 400', tier:2},
      {q:'มีเงิน 20 บาท ซื้อขนม 5 บาท แล้วแม่ให้อีก 10 บาท ตอนนี้มีกี่บาท?', emoji:'💰', choices:['25','15','30','20'], correct:0, explain:'20 - 5 = 15 แล้ว 15 + 10 = 25 บาท', tier:2},
      {q:'45 + 38 = ?', emoji:'➕', choices:['83','73','93','82'], correct:0, explain:'45 บวก 38 เท่ากับ 83', tier:2},
      {q:'แบ่งเค้ก 15 ชิ้น ให้เพื่อน 5 คน เท่าๆ กัน คนละกี่ชิ้น?', emoji:'🍰', choices:['3','2','4','5'], correct:0, explain:'15 แบ่งเป็น 5 กลุ่มเท่าๆ กัน ได้กลุ่มละ 3 ชิ้น', tier:2},
      {q:'3 × 2 = ?', emoji:'✖️', choices:['6','5','8','4'], correct:0, explain:'3 × 2 = 3 + 3 = 6', tier:1},
      {q:'10 × 2 = ?', emoji:'✖️', choices:['20','12','22','10'], correct:0, explain:'10 × 2 = 10 + 10 = 20', tier:1},
      {q:'นับทีละ 4: 4, 8, 12, ▢', emoji:'👣', choices:['16','14','15','20'], correct:0, explain:'นับเพิ่มทีละ 4 ตัวต่อไปคือ 16', tier:1},
      {q:'ครึ่งหนึ่งของ 20 คือเท่าไร?', emoji:'✂️', choices:['10','5','20','15'], correct:0, explain:'20 แบ่งครึ่งได้ 10', tier:1},
      {q:'5 × 3 = ?', emoji:'✖️', choices:['15','12','18','10'], correct:0, explain:'5 × 3 = 5 + 5 + 5 = 15', tier:2},
      {q:'7 × 2 = ?', emoji:'✖️', choices:['14','12','16','9'], correct:0, explain:'7 × 2 = 7 + 7 = 14', tier:2},
      {q:'63 + 28 = ?', emoji:'➕', choices:['91','81','90','92'], correct:0, explain:'63 บวก 28 เท่ากับ 91', tier:2},
      {q:'มีขนม 20 ชิ้น แบ่งใส่ 4 จาน เท่าๆ กัน จานละกี่ชิ้น?', emoji:'🍪', choices:['5','4','6','8'], correct:0, explain:'20 แบ่งเป็น 4 กลุ่มเท่าๆ กัน ได้กลุ่มละ 5 ชิ้น', tier:2}
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
      {q:'พยัญชนะต้นของคำว่า "ขา" คือตัวใด?', emoji:'🦵', choices:['ข','ค','ก','ง'], correct:0, explain:'"ขา" ขึ้นต้นด้วย ข', tier:2}
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
      {q:'เติมคำให้เหมาะสม: "ฉัน ____ หนังสือทุกวัน"', emoji:'📖', choices:['อ่าน','วิ่ง','กระโดด','ว่าย'], correct:0, explain:'"ฉันอ่านหนังสือทุกวัน" ได้ความหมายเหมาะสม', tier:2}
    ]
  },
  {
    id:'p1-thai3', name:'ภาษาไทย ป.1 · อ่านจับใจความ', emoji:'📘', icon:'assets/icons/p1-thai3.svg', color:'#D63D8C', light:'#FCE0EF', grade:'p1', poolPick:10, isNew:true,
    questions:[
      /* Level 3 (เร่ง ป.2) — ควบกล้ำ / อักษรนำ / คล้องจอง / จับใจความ / คำตรงข้าม-เหมือน */
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🐟', choices:['ปลา','ตลาด','มะม่วง','นาฬิกา'], correct:0, explain:'"ปลา" มีอักษรควบ ปล', tier:1},
      {q:'คำใดมีอักษรนำ?', emoji:'🐶', choices:['หมา','มา','ตา','นา'], correct:0, explain:'"หมา" มี ห นำ ม', tier:1},
      {q:'คำใดคล้องจองกับคำว่า "ปลา"?', emoji:'🐟', choices:['มา','ปู','ดี','นก'], correct:0, explain:'"มา" คล้องจองกับ "ปลา"', tier:1},
      {q:'คำใดมีความหมายตรงข้ามกับ "สูง"?', emoji:'📏', choices:['เตี้ย','ใหญ่','ยาว','กว้าง'], correct:0, explain:'ตรงข้ามกับ "สูง" คือ "เตี้ย"', tier:1},
      {q:'อ่าน: "แมวนอนอยู่บนเก้าอี้" — แมวทำอะไร?', emoji:'🐈', choices:['นอน','วิ่ง','กิน','เล่น'], correct:0, explain:'ข้อความบอกว่าแมว "นอน"', tier:1},
      {q:'คำใดมีความหมายตรงข้ามกับ "ร้อน"?', emoji:'❄️', choices:['เย็น','ใหญ่','เร็ว','ดี'], correct:0, explain:'ตรงข้ามกับ "ร้อน" คือ "เย็น"', tier:1},
      {q:'คำใดคล้องจองกับคำว่า "ดาว"?', emoji:'⭐', choices:['หาว','ดี','ปู','มด'], correct:0, explain:'"หาว" คล้องจองกับ "ดาว"', tier:1},
      {q:'คำใดเป็นคำควบกล้ำ (มีอักษรควบ)?', emoji:'🥁', choices:['กลอง','กอง','ของ','กบ'], correct:0, explain:'"กลอง" มีอักษรควบ กล (คำอื่นไม่ควบ)', tier:2},
      {q:'คำใดมีอักษรนำ?', emoji:'🌾', choices:['หญ้า','ย่า','นา','ตา'], correct:0, explain:'"หญ้า" มี ห นำ ญ', tier:2},
      {q:'คำใดคล้องจองกับคำว่า "นก"?', emoji:'🐦', choices:['ยก','นม','นา','โน'], correct:0, explain:'"ยก" คล้องจองกับ "นก" (เสียง -ก เหมือนกัน)', tier:2},
      {q:'คำใดมีความหมายตรงข้ามกับ "กว้าง"?', emoji:'📐', choices:['แคบ','ยาว','สูง','ใหญ่'], correct:0, explain:'ตรงข้ามกับ "กว้าง" คือ "แคบ"', tier:2},
      {q:'อ่าน: "น้องกินข้าวแล้วไปโรงเรียน" — น้องไปที่ไหน?', emoji:'🎒', choices:['โรงเรียน','ตลาด','บ้าน','สวน'], correct:0, explain:'ข้อความบอกว่าน้องไป "โรงเรียน"', tier:2},
      {q:'คำใดมีความหมายเหมือนกับ "ดีใจ"?', emoji:'😊', choices:['ยินดี','เสียใจ','โกรธ','กลัว'], correct:0, explain:'"ยินดี" มีความหมายเหมือน "ดีใจ"', tier:2},
      {q:'คำใดมีความหมายตรงข้ามกับ "เปิด"?', emoji:'🚪', choices:['ปิด','วาง','ถือ','ดึง'], correct:0, explain:'ตรงข้ามกับ "เปิด" คือ "ปิด"', tier:2},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🦌', choices:['กวาง','กาง','ของ','กบ'], correct:0, explain:'"กวาง" มีอักษรควบ กว', tier:1},
      {q:'คำใดมีอักษรนำ?', emoji:'🐭', choices:['หนู','นู','ตู','มู'], correct:0, explain:'"หนู" มี ห นำ น', tier:1},
      {q:'คำใดคล้องจองกับคำว่า "มา"?', emoji:'👁️', choices:['ตา','มี','มู','โม'], correct:0, explain:'"ตา" คล้องจองกับ "มา" (เสียงสระ อา เหมือนกัน)', tier:1},
      {q:'คำใดมีความหมายตรงข้ามกับ "ดี"?', emoji:'👎', choices:['เลว','ใหญ่','ยาว','เร็ว'], correct:0, explain:'ตรงข้ามกับ "ดี" คือ "เลว"', tier:1},
      {q:'คำใดเป็นคำควบกล้ำ?', emoji:'🪁', choices:['ปลาย','ปาย','พาย','ป่าย'], correct:0, explain:'"ปลาย" มีอักษรควบ ปล', tier:2},
      {q:'คำใดมีอักษรนำ?', emoji:'🐻', choices:['หมี','มี','ตี','ดี'], correct:0, explain:'"หมี" มี ห นำ ม', tier:2},
      {q:'อ่าน: "ฝนตกหนักจนน้ำท่วมถนน" — อะไรท่วม?', emoji:'🌊', choices:['ถนน','บ้าน','ต้นไม้','รถ'], correct:0, explain:'ข้อความบอกว่าน้ำท่วม "ถนน"', tier:2},
      {q:'คำใดมีความหมายเหมือนกับ "เร็ว"?', emoji:'⚡', choices:['ไว','ช้า','ดี','ใหญ่'], correct:0, explain:'"ไว" มีความหมายเหมือน "เร็ว"', tier:2}
    ]
  },
  {
    /* mechanic-move: โจทย์ "อ่าน/สะกดคำ" (เช่น กา สะกดอย่างไร) เหมาะกับเกมฟัง — ฟังเสียงคำแล้วเรียงตัวอักษรสะกด
       reuse engine เกมฟังคำไทยเดิม (LISTEN_WORDS_TH คำ 3-5 ตัวอักษรไล่ตามด่าน), mode:'nohint' = ไม่เฉลยตัวอักษร (ท้าทายระดับ ป.1) */
    id:'p1-listen-th', name:'ฟังสะกดคำไทย ป.1', emoji:'🎙️', icon:'assets/icons/p1-listen-th.svg', color:'#F2765E', light:'#FDE1DA',
    type:'listen', mode:'nohint', lang:'th', levels:10, grade:'p1', isNew:true
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
      {q:'"E" is for ____ ?', emoji:'🥚', choices:['Egg','Cat','Ball','Dog'], correct:0, explain:'E is for Egg 🥚', tier:2}
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
      {q:'เลข 11 ภาษาอังกฤษคือคำใด?', emoji:'🔢', choices:['Eleven','Twelve','Ten','Seven'], correct:0, explain:'11 = Eleven', tier:2}
    ]
  },
  {
    /* mechanic-move: ฝึกฟัง-สะกดคำอังกฤษ (listen, mode nohint) — reuse engine เกมฟังคำศัพท์อังกฤษเดิม */
    id:'p1-listen-en', name:'ฟังคำอังกฤษ ป.1', emoji:'📣', icon:'assets/icons/p1-listen-en.svg', color:'#6C5CE7', light:'#E6E1FB',
    type:'listen', mode:'nohint', levels:10, grade:'p1', isNew:true
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
      {q:'"There ____ two cats." เติมคำใด?', emoji:'🐈', choices:['are','is','am','be'], correct:0, explain:'There are two cats (พหูพจน์ใช้ are)', tier:2},
      {q:'"You ____ my friend." เติมคำใด?', emoji:'🧒', choices:['are','am','is','be'], correct:0, explain:'You are my friend (You ใช้ are)', tier:1},
      {q:'"It ____ a dog." เติมคำใด?', emoji:'🐶', choices:['is','am','are','be'], correct:0, explain:'It is a dog (It ใช้ is)', tier:1},
      {q:'What is the opposite of "open"?', emoji:'🚪', choices:['close','run','sit','eat'], correct:0, explain:'ตรงข้ามกับ open (เปิด) คือ close (ปิด)', tier:1},
      {q:'Read: "The sun is hot." Is the sun hot?', emoji:'☀️', choices:['Yes','No','Blue','Cold'], correct:0, explain:'ประโยคบอกว่า sun is hot ดังนั้นตอบ Yes', tier:1},
      {q:'"They ____ playing." เติมคำใด?', emoji:'🧑‍🤝‍🧑', choices:['are','is','am','be'], correct:0, explain:'They are playing (They ใช้ are)', tier:2},
      {q:'What is the opposite of "happy"?', emoji:'😢', choices:['sad','fast','big','new'], correct:0, explain:'ตรงข้ามกับ happy (มีความสุข) คือ sad (เศร้า)', tier:2},
      {q:'Read: "Ann has two pens." How many pens?', emoji:'🖊️', choices:['Two','One','Three','Four'], correct:0, explain:'ประโยคบอกว่า two pens = 2 ด้าม', tier:2},
      {q:'"____ he your brother?" เติมคำใด?', emoji:'👦', choices:['Is','Are','Am','Do'], correct:0, explain:'Is he your brother? (he ใช้ Is)', tier:2}
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
      {q:'เห็นคุณยายถือของหนักมา ควรทำอย่างไร?', emoji:'👵', choices:['ช่วยถือของ','เดินหนี','ทำเป็นไม่เห็น','หัวเราะ'], correct:0, explain:'ควร "ช่วยถือของ" ให้ผู้ใหญ่', tier:3}
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
      {q:'แบบรูปเพิ่มขึ้น: 2, 4, 6, 8, ▢', emoji:'🔢', choices:['10','9','12','7'], correct:0, explain:'เพิ่มทีละ 2 ตัวต่อไปคือ 10', tier:2}
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
      {q:'จัดกลุ่ม: 🐶🐱🌻 — สิ่งใดควรอยู่คนละกลุ่ม?', emoji:'🗂️', choices:['🌻','🐶','🐱','ทุกอย่างกลุ่มเดียว'], correct:0, explain:'🌻 เป็นดอกไม้ ต่างจากสัตว์ 🐶🐱', tier:2}
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
    /* Phase 1.3 — coding mechanic ใหม่ "เรียงคำสั่งหุ่นยนต์": เรียงบัตรคำสั่ง (เดินหน้า/เลี้ยวซ้าย-ขวา) ให้หุ่นยนต์ไปถึงเป้าบนกริด
       ดู startCodeGame ใน app.js (คลังด่าน ROBOT_LEVELS) — ออกแบบ engine เผื่อ loop/เงื่อนไข (ป.2-6) ในอนาคต */
    id:'p1-code', name:'เรียงคำสั่งหุ่นยนต์ 1', emoji:'🤖', icon:'assets/icons/p1-code.svg', color:'#2BB3A3', light:'#D6F5F1',
    type:'skill', mode:'code', codeSet:'code1', levels:10, grade:'p1', isNew:true
  },
  {
    id:'p1-code2', name:'เรียงคำสั่งหุ่นยนต์ 2', emoji:'🦾', icon:'assets/icons/p1-code2.svg', color:'#2596A0', light:'#D6F1F5',
    type:'skill', mode:'code', codeSet:'code2', levels:8, grade:'p1', isNew:true
  },
  {
    id:'p1-code3', name:'เรียงคำสั่งหุ่นยนต์ 3', emoji:'🕹️', icon:'assets/icons/p1-code3.svg', color:'#1F7E88', light:'#D6EDF0',
    type:'skill', mode:'code', codeSet:'code3', levels:8, grade:'p1', isNew:true
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
      {q:'เผลอทำของเล่นของเพื่อนพัง ควรทำอย่างไร?', emoji:'💔', choices:['ขอโทษและรับผิด','โทษคนอื่น','ทำเป็นไม่รู้','หนีไป'], correct:0, explain:'ควร "ขอโทษและรับผิด" อย่างจริงใจ', tier:3}
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
      {q:'เสียงระฆังใหญ่กับกระดิ่งเล็ก อันไหนเสียงต่ำกว่า?', emoji:'🛎️', choices:['ระฆังใหญ่','กระดิ่งเล็ก','เท่ากัน','ไม่มีเสียง'], correct:0, explain:'ระฆังใหญ่เสียงต่ำกว่า (ยิ่งใหญ่ยิ่งเสียงต่ำ)', tier:2}
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
      {q:'โน้ตสากล "C" ตรงกับโน้ตไทยตัวใด?', emoji:'🎵', choices:['โด (ด)','มี (ม)','ซอล (ซ)','ลา (ล)'], correct:0, explain:'C = โด (ด)', tier:2},
      {q:'โน้ตสากล "D" ตรงกับโน้ตไทยตัวใด?', emoji:'🎵', choices:['เร (ร)','โด (ด)','มี (ม)','ฟา (ฟ)'], correct:0, explain:'D = เร (ร)', tier:2},
      {q:'โน้ตไทยตัวที่ 3 ใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ม','ร','ฟ','ซ'], correct:0, explain:'ตัวที่ 3 คือ "ม" (มี)', tier:2},
      {q:'เคาะจังหวะ เร็ว-เร็ว-ช้า สลับกันไป เรียกจังหวะแบบนี้ว่าอะไร?', emoji:'🥁', choices:['จังหวะไม่สม่ำเสมอ','จังหวะเท่ากัน','ไม่มีจังหวะ','เสียงเบา'], correct:0, explain:'เคาะเร็ว-ช้าสลับ = "จังหวะไม่สม่ำเสมอ"', tier:2},
      {q:'"ทำนอง" ที่ร้องซ้ำๆ จำง่ายในเพลง เรียกว่าส่วนใด?', emoji:'🎤', choices:['ท่อนฮุก','ท่ามือ','เสียงต่ำ','จังหวะช้า'], correct:0, explain:'ทำนองที่ร้องซ้ำจำง่าย = "ท่อนฮุก"', tier:2},
      {q:'โน้ตสากล "E" ตรงกับโน้ตไทยตัวใด?', emoji:'🎵', choices:['มี (ม)','เร (ร)','ฟา (ฟ)','ซอล (ซ)'], correct:0, explain:'E = มี (ม)', tier:2},
      {q:'โน้ตไทยตัวที่ 2 ใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ร','ด','ม','ฟ'], correct:0, explain:'ตัวที่ 2 คือ "ร" (เร)', tier:1},
      {q:'เพลงกล่อมเด็กควรมีจังหวะแบบใด?', emoji:'👶', choices:['ช้านุ่มนวล','เร็วแรง','ดังมาก','กระโดดโลดเต้น'], correct:0, explain:'เพลงกล่อมเด็กควร "ช้านุ่มนวล" ให้หลับสบาย', tier:1},
      {q:'โน้ตสากลหลักมีกี่ตัว (C D E F G A B)?', emoji:'🎹', choices:['7 ตัว','5 ตัว','8 ตัว','6 ตัว'], correct:0, explain:'โน้ตสากลหลักมี 7 ตัว: C D E F G A B', tier:1},
      {q:'โน้ตสากล "F" ตรงกับโน้ตไทยตัวใด?', emoji:'🎵', choices:['ฟา (ฟ)','มี (ม)','ซอล (ซ)','เร (ร)'], correct:0, explain:'F = ฟา (ฟ)', tier:2},
      {q:'โน้ตสากล "G" ตรงกับโน้ตไทยตัวใด?', emoji:'🎵', choices:['ซอล (ซ)','ฟา (ฟ)','ลา (ล)','มี (ม)'], correct:0, explain:'G = ซอล (ซ)', tier:2},
      {q:'โน้ตไทยตัวที่ 5 ใน "ด ร ม ฟ ซ ล ท" คือตัวใด?', emoji:'🎼', choices:['ซ','ฟ','ล','ม'], correct:0, explain:'ตัวที่ 5 คือ "ซ" (ซอล)', tier:2}
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
      {q:'ท้องฟ้าตอนพระอาทิตย์ตกเป็นสีโทนใด?', emoji:'🌇', choices:['ส้ม-แดง','เขียวสด','ฟ้าใส','ม่วงเข้ม'], correct:0, explain:'ตอนพระอาทิตย์ตกท้องฟ้าเป็นโทน "ส้ม-แดง"', tier:2}
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
      {q:'เส้นที่วนเป็นก้นหอย เรียกว่าเส้นแบบใด?', emoji:'🌀', choices:['เส้นก้นหอย (วน)','เส้นตรง','เส้นตั้ง','เส้นนอน'], correct:0, explain:'เส้นที่วนเข้าหากลาง = "เส้นก้นหอย/เส้นวน"', tier:2}
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
      {q:'หมีขาว (หมีขั้วโลก) อาศัยอยู่ที่ใด?', emoji:'🐻‍❄️', choices:['ขั้วโลกน้ำแข็ง','ทะเลทราย','ป่าฝนร้อน','ในเมือง'], correct:0, explain:'หมีขาวอยู่ที่ "ขั้วโลกน้ำแข็ง" ที่หนาวเย็น', tier:2}
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
      {q:'เราปลูกต้นไม้มากๆ เพื่ออะไร?', emoji:'🌲', choices:['อากาศดีและมีร่มเงา','ให้บ้านรก','ให้ร้อนขึ้น','ไม่มีประโยชน์'], correct:0, explain:'ปลูกต้นไม้ช่วยให้ "อากาศดีและมีร่มเงา"', tier:2}
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

/* ============================= ระดับชั้น (GRADES) ============================= */
/* ระดับชั้นเป็นมิติจัดกลุ่มหมวด — หมวดที่ไม่มี cat.grade ถือเป็น 'prep-p1' (ของเดิมทั้งหมด)
   available:false = ยังไม่มีเนื้อหา (โชว์ในแถบเลือกชั้นแบบ "เร็วๆ นี้")
   minAge/maxAge ใช้ default ระดับชั้นตามอายุเด็ก (ดู defaultGradeForAge ใน app.js) */
const GRADES = [
  { id:'prep-p1', name:'เตรียมสอบ ป.1', short:'เตรียม ป.1', emoji:'🐣', minAge:0,  maxAge:5,  available:true  },
  { id:'p1',      name:'ประถมศึกษาปีที่ 1', short:'ป.1', emoji:'1️⃣', minAge:6,  maxAge:6,  available:true  },
  { id:'p2',      name:'ประถมศึกษาปีที่ 2', short:'ป.2', emoji:'2️⃣', minAge:7,  maxAge:7,  available:false },
  { id:'p3',      name:'ประถมศึกษาปีที่ 3', short:'ป.3', emoji:'3️⃣', minAge:8,  maxAge:8,  available:false },
  { id:'p4',      name:'ประถมศึกษาปีที่ 4', short:'ป.4', emoji:'4️⃣', minAge:9,  maxAge:9,  available:false },
  { id:'p5',      name:'ประถมศึกษาปีที่ 5', short:'ป.5', emoji:'5️⃣', minAge:10, maxAge:10, available:false },
  { id:'p6',      name:'ประถมศึกษาปีที่ 6', short:'ป.6', emoji:'6️⃣', minAge:11, maxAge:99, available:false }
];

/* ============================= EF (เกม "นกฮูกสั่ง") ============================= */
/* คลังหมวดของ + ชื่อ ใช้สร้างกติกา "แตะเฉพาะ [หมวด]" ในเกมฝึก executive function (ดู startEfGame ใน app.js) */
const EF_CATEGORIES = {
  fruit:   { name:'ผลไม้',     items:['🍎','🍌','🍇','🍓','🍊','🍉','🍑','🥝','🍒','🍍'] },
  animal:  { name:'สัตว์',      items:['🐶','🐱','🐰','🐸','🐵','🦁','🐯','🐷','🐨','🐮'] },
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
  { size:5, start:{r:4,c:0,dir:0}, goal:{r:0,c:0}, walls:[[2,0],[2,1]] },
  { size:5, start:{r:4,c:0,dir:1}, goal:{r:0,c:4}, walls:[[2,2]] },
  { size:5, start:{r:4,c:4,dir:3}, goal:{r:0,c:0}, walls:[[2,2],[2,3]] },
  { size:5, start:{r:4,c:2,dir:0}, goal:{r:0,c:2}, walls:[[2,1],[2,3]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[3,2],[3,3]] },
  { size:6, start:{r:5,c:0,dir:1}, goal:{r:0,c:0}, walls:[[3,0],[3,1],[3,2]] },
  { size:6, start:{r:5,c:5,dir:0}, goal:{r:0,c:0}, walls:[[3,3],[2,3]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:4}, walls:[[3,2],[3,3],[2,4]] }
];
/* code3 — ยาก (6×6 คล้ายเขาวงกต ทางยาว) */
const ROBOT_LEVELS3 = [
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[1,1],[2,1],[3,1],[3,2],[3,3]] },
  { size:6, start:{r:5,c:0,dir:1}, goal:{r:0,c:0}, walls:[[4,1],[3,1],[2,1],[2,2],[2,3]] },
  { size:6, start:{r:5,c:5,dir:3}, goal:{r:0,c:5}, walls:[[4,4],[3,4],[2,4],[2,3],[2,2]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:5,c:5}, walls:[[4,1],[3,1],[2,1],[1,1],[1,2],[1,3]] },
  { size:6, start:{r:0,c:0,dir:2}, goal:{r:5,c:5}, walls:[[1,1],[2,1],[3,1],[3,2],[3,3],[1,4],[2,4]] },
  { size:6, start:{r:5,c:0,dir:0}, goal:{r:0,c:5}, walls:[[4,1],[2,1],[2,2],[2,3],[4,3],[4,4]] },
  { size:6, start:{r:5,c:2,dir:0}, goal:{r:0,c:3}, walls:[[3,2],[3,3],[3,4],[1,1],[1,2],[1,3]] },
  { size:6, start:{r:5,c:5,dir:0}, goal:{r:0,c:0}, walls:[[4,4],[4,3],[2,1],[2,2],[3,4],[1,3]] }
];

/* ============================= LISTEN WORDS (เกมฟังคำศัพท์ 1/2) ============================= */
/* คำศัพท์ภาษาอังกฤษ 3 ตัวอักษร ทุกคำมีตัวอักษรไม่ซ้ำกันเอง (ง่ายต่อการสุ่มการ์ดตัวหลอกไม่ให้ปนกับตัวอักษรของคำตอบ) */
const LISTEN_WORDS = [
  'cat','dog','sun','pen','cup','hat','bag','box','bed','bus',
  'car','fan','jar','key','log','map','net','owl','pig','top',
  'van','web','ant','arm','bat','cow','fox','gum','hen','kit',
  'lip','red','wet','zip','mud','nut','oil','pot','rat','sit',
  'ten','wig','yes','leg','ear','ice','sky','sea','toe','cap',
  'jet','bun','mop','saw','tub'
];

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
    {w:'แตงโม', e:'🍉'}, {w:'มะนาว', e:'🍋'}, {w:'ดินสอ', e:'✏️'}, {w:'เสื้อ', e:'👕'}, {w:'ใบไม้', e:'🍃'}
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
  'p1-code2':'p1-code', 'p1-code3':'p1-code2' };

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
