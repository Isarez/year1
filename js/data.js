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
  }
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

const CAT_REQUIRES = { thai2:'thai', iq2:'iq1', iq3:'iq2', iq4:'iq3', listen2:'listen1', 'listen-th2':'listen-th1', 'skill-shadow2':'skill-shadow', 'skill-shadow3':'skill-shadow2', 'ar-math2':'ar-math', 'ar-math3':'ar-math2', 'skill-mix2':'skill-mix', 'skill-music2':'skill-music', 'skill-music3':'skill-music2', 'write-dots2':'write-dots1', 'skill-clock2':'skill-clock1', 'skill-clock3':'skill-clock2', 'skill-clock4':'skill-clock3' };

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
