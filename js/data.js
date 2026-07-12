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
    id:'ar-thai', name:'ต่อประโยค (ไทย)', emoji:'🖐️', icon:'assets/icons/sentence-th.svg', color:'#F17FA8', light:'#FDE1EC',
    type:'ar', lang:'th', levels:10
  },
  {
    id:'ar-eng', name:'ต่อประโยค (Eng)', emoji:'🤟', icon:'assets/icons/sentence-en.svg', color:'#3EC6C6', light:'#D8F6F6',
    type:'ar', lang:'en', levels:10
  },
  {
    id:'ar-math', name:'คิดเลข', emoji:'🧮', icon:'assets/icons/count.svg', color:'#FFB020', light:'#FFF1D6',
    type:'ar', mode:'math', levels:10
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
    type:'skill', mode:'shadow', overlap:2, levels:15, isNew:true
  },
  {
    id:'skill-shadow3', name:'ทายเงา 3', emoji:'🎭', icon:'assets/icons/shadow-3.svg', color:'#B25D7E', light:'#F9E3EC',
    type:'skill', mode:'shadow', overlap:3, levels:15, isNew:true
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

const CAT_REQUIRES = { thai2:'thai', iq2:'iq1', iq3:'iq2', iq4:'iq3', listen2:'listen1', 'listen-th2':'listen-th1', 'skill-shadow2':'skill-shadow', 'skill-shadow3':'skill-shadow2' };

/* จำนวนคู่ (pairs) ต่อด่านของเกม skill-memory (จับคู่ตัวเลขกับจุด), index 0 = ด่าน 1 */
const MEMORY_LEVEL_PAIRS = [4, 8, 12];

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
