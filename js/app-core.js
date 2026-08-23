/* ================================================================================
   นกฮูกสนุกคิด — แกนกลางของแอป (โหลดเป็นไฟล์แรกของชุด app)
   state ทั้งหมด, โปรไฟล์เด็ก, ระดับชั้น/อายุ, เสียง+เพลงพื้นหลัง, confetti,
   helper ที่ทุก engine ใช้ร่วมกัน (showOnlyView, beginSkillGame, finishP2Game ฯลฯ)
   และการ render หน้าเลือกหมวด
   ต้องโหลดหลัง js/data.js + js/owl-messages.js และก่อนไฟล์เกมทุกไฟล์
   ================================================================================ */

window.APP_ASSET_VER = '?v=3.2.4';   /* cache-buster ของไฟล์ที่โหลดแบบ lazy (mediapipe/three/house) — ต้องตรงกับไฟล์ version
                                        ⚠️ ตัวนี้อยู่นอก index.html คำสั่ง sed ที่แก้ ?v= ตอน release จับไม่ถึง ต้องแก้มือทุกครั้ง
                                        ⚠️ **ระหว่างพัฒนาโหมดบ้านต้องปั๊มเลขนี้ทุกครั้งที่แก้ js/house*.js ด้วย**
                                           ไฟล์ชุดนั้นโหลดแบบ lazy พร้อม ?v= นี้ ถ้าไม่ปั๊ม เบราว์เซอร์จะเสิร์ฟไฟล์เก่าจาก cache
                                           แล้วเห็นเป็นว่า "แก้แล้วไม่มีอะไรเปลี่ยน" (เจอมาแล้ว 2026-08-08 ตอนเปิดขายสีของเครื่องแต่ง)
                                           ตอน release ค่อยเปลี่ยนเป็นเลขเวอร์ชันจริงตาม checklist */
/* ============================= STATE ============================= */
let progress = {};
let soundOn = true;
try{ soundOn = localStorage.getItem('p1quiz_sound') !== 'off'; }catch(e){}
let state = { catId:null, qIndex:0, score:0, wrong:[], answered:false };
let pendingSticker = null;

/* ============================= HEADER SVG ICONS ============================= */
const SVG_MOON     = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7BA7E0" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#C8DEFF"/></svg>';
const SVG_SUN      = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E8A020" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#FFD040"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const SVG_MUSIC    = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6C5CE7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" fill="#DCD2FB"/><circle cx="6" cy="18" r="3" fill="#C7B3FF"/><circle cx="18" cy="16" r="3" fill="#C7B3FF"/></svg>';
const SVG_SPEAKER  = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4881C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#FFDF8E"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M18.7 5.3a9.5 9.5 0 0 1 0 13.4" opacity=".55"/></svg>';
const SVG_EXPAND   = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2E8F63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
const SVG_COMPRESS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2E8F63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>';
const SVG_PENCIL   = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C0527A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="#FFD6E8"/><path d="M15 5l4 4" stroke-width="1.4"/></svg>';

/* ============================= CHILDREN ============================= */
const CHILD_AVATARS = [
  '🐶','🐱','🐰','🐻','🐼','🦊',
  '🐸','🐧','🦄','🦋','🦕','🐙',
  '🦁','🐯','🐨','🐹','🦔','🦦',
  '🌟','🌈','🚀','🎈','🍦','🎀',
  '🐷','🐮','🐵','🐔','🦉','🦖',
  '🐬','🐳','🦈','🐞','🐝','🦜',
  '🐺','🦝','🦥','🐿️','🦩','🐢',
  '🍭','🍩','🍪','🧁','⚽','🎨'
];
let selectedEmoji = CHILD_AVATARS[0];

let children = [];
let activeChild = null;

/* ===================== ระดับชั้น + อายุ ===================== */
let selectedGrade = 'prep-p1';   // ระดับชั้นที่กำลังดูอยู่ในหน้าหลัก
let selectedDob = null;          // {d,m,y(ค.ศ.)} วันเกิดที่เลือกในฟอร์มสร้างโปรไฟล์
const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function gradeById(id){ return GRADES.find(g=>g.id===id) || GRADES[0]; }
/* หมวดที่ไม่มี cat.grade = ของเดิมทั้งหมด ถือเป็นระดับ 'prep-p1' */
function catsForGrade(gid){ return CATS.filter(c=>(c.grade||'prep-p1')===gid); }

/* อายุ (ปี ทศนิยม) คำนวณจากวันเกิด — เผื่อโปรไฟล์เก่าที่เก็บ age ไว้ (fallback) */
function childAgeYears(child){
  if(!child) return null;
  if(child.birthDate){
    const p = child.birthDate.split('-').map(Number);
    const b = new Date(p[0], (p[1]||1)-1, p[2]||1);
    const ms = Date.now() - b.getTime();
    return ms>0 ? ms/(365.25*24*3600*1000) : 0;
  }
  return (typeof child.age==='number') ? child.age : null;
}

/* index ระดับชั้นสูงสุดที่ "อายุ" ปลดล็อก (ปลดชั้นต่ำกว่าทั้งหมดด้วย)
   5-6ปี→ป.1(1), 6-7→ป.2(2), 7-8→ป.3(3)... >11→ป.6(6) — อ่านขอบบนของช่วง = อายุเต็มปี */
function ageTopIndex(age){
  if(age==null) return 1;
  if(age < 5) return 0;
  return Math.max(1, Math.min(GRADES.length-1, Math.floor(age)-5));
}
/* index ระดับชั้นที่ "ควรเปิดดู" ตามอายุ (ชั้นที่เด็กกำลังเรียนจริง) */
function ageDefaultIndex(age){
  if(age==null) return 0;
  if(age < 6) return 0;
  return Math.min(GRADES.length-1, Math.floor(age)-5);
}
/* สัดส่วนดาวที่เก็บได้ของระดับชั้น (0-1) — ใช้เช็คเงื่อนไข >80% ปลดชั้นถัดไป */
function gradeStarPct(gid){
  const cats = catsForGrade(gid);
  if(!cats.length) return 0;
  let earned = 0;
  cats.forEach(c=>{ earned += (progress[c.id] && progress[c.id].stars) ? progress[c.id].stars : 0; });
  return earned / (cats.length*3);
}
/* index ระดับชั้นสูงสุดที่ปลดล็อกจริง = อายุ + ต่อยอดถ้าเก็บดาว >80% ของชั้นบนสุด (ไล่ต่อได้เรื่อยๆ) */
function unlockedTopIndex(child){
  let top = ageTopIndex(childAgeYears(child));
  while(top < GRADES.length-1 && gradeStarPct(GRADES[top].id) > 0.8) top++;
  return top;
}

/* ระดับชั้นที่ควรเลือกให้เด็ก = ชั้นที่มีเนื้อหา (available) สูงสุดที่ปลดล็อกแล้ว
   (จำชั้นที่เด็กเลือกล่าสุดถ้ายังปลดล็อก+มีเนื้อหา ไม่งั้นใช้ชั้นตามอายุ) */
function resolveGradeForChild(child){
  if(!child) return 'prep-p1';
  const top = unlockedTopIndex(child);
  if(child.grade){
    const gi = GRADES.findIndex(g=>g.id===child.grade);
    if(gi>=0 && gi<=top && GRADES[gi].available) return child.grade;
  }
  const def = Math.min(ageDefaultIndex(childAgeYears(child)), top);
  for(let i=def; i>=0; i--){ if(GRADES[i].available) return GRADES[i].id; }
  return 'prep-p1';
}

function loadChildren(){
  try{ children = JSON.parse(localStorage.getItem('p1quiz_children') || '[]'); }catch(e){ children = []; }
}
function saveChildren(){
  try{ localStorage.setItem('p1quiz_children', JSON.stringify(children)); }catch(e){}
}
function progressKey(){ return 'p1quiz_progress_'+(activeChild ? activeChild.id : 'guest'); }
function loadProgressForChild(){
  try{ progress = JSON.parse(localStorage.getItem(progressKey()) || '{}'); }catch(e){ progress = {}; }
}
/* ตั้งเด็กคนนี้เป็นคนเล่นปัจจุบัน **โดยยังไม่เข้าโหมดไหน**
   คืน 'ok' = พร้อมไปต่อ · 'age' = เปิด popup ถามวันเกิดแล้ว · 'none' = ไม่เจอเด็กคนนี้
   ⚠ แยกออกมาจาก selectChild() เพื่อให้หน้าแรกแบบรวมร่าง (js/app-home2.js) เรียกใช้ได้
     โดยไม่ต้องเข้าหน้าหมวดทันที — **ห้ามให้ฟังก์ชันนี้พาไปหน้าไหนเอง** */
function activateChild(id){
  activeChild = children.find(c=>c.id===id) || null;
  if(!activeChild) return 'none';
  try{ localStorage.setItem('p1quiz_active_child', id); }catch(e){}
  loadProgressForChild();
  /* โปรไฟล์ที่ยังไม่เคยใส่วันเกิด (รวมโปรไฟล์เก่าที่มีแต่อายุ) → ถามวันเกิดก่อน (popup) แล้วค่อยเข้าหน้าหลัก */
  if(!activeChild.birthDate){ openAgeModal(); return 'age'; }
  selectedGrade = resolveGradeForChild(activeChild);
  return 'ok';
}
function selectChild(id){
  if(activateChild(id) === 'ok') enterHome();
}

/* ห้ามใช้ชื่อซ้ำกับเด็กที่มีอยู่แล้วใน localStorage (ไม่สนตัวพิมพ์เล็ก/ใหญ่) — ถ้าซ้ำ แจ้งเตือนให้เปลี่ยนชื่อใหม่ และไม่บันทึกลง storage เลย */
/* mode = 'house' | 'quiz' | undefined — หน้าแรกแบบรวมร่างเลือกโหมดตั้งแต่ตอนสร้างโปรไฟล์
   (หน้านั้นไม่มีหน้าเลือกโหมดคั่นแล้ว) · undefined = ทางเดิม ไปตามเส้น enterHome() */
/* 📦 เพดานจำนวนโปรไฟล์เด็ก (ผู้ใช้กำหนด 2026-08-20)
   ที่มา: localStorage มี ~5,242,880 ตัวอักษร · เด็ก 1 คนแบบเต็มเพดาน (รูป 15 ใบที่ 900px
   + โจทย์ครบทุกหมวด + ของครบ) ≈ 300,000 ⇒ 10 คน ≈ 3.0 MB ราว 57% ของโควตา เหลือที่ว่างพอ
   🔒 **แก้เลขนี้ต้องคำนวณใหม่ทุกครั้ง** คู่กับ PHOTO_MAX/PHOTO_W ใน js/house-play.js */
const MAX_CHILDREN = 10;
function addChild(name, mode){
  name = name.trim();
  if(!name) return;
  if(children.length >= MAX_CHILDREN){
    showToast('👨‍👩‍👧‍👦','เพิ่มได้สูงสุด '+MAX_CHILDREN+' คนนะ ถ้าอยากเพิ่มคนใหม่ ลบคนที่ไม่ได้เล่นแล้วออกก่อน');
    return;
  }
  if(children.some(c=>c.name.toLowerCase()===name.toLowerCase())){
    showToast('⚠️','ชื่อ "'+name+'" มีอยู่แล้วนะ ลองเปลี่ยนชื่อใหม่ดูสิ');
    const input = document.getElementById('child-name-input');
    if(input){ input.focus(); input.select(); }
    return;
  }
  const id = 'child_'+Date.now();
  const emoji = selectedEmoji;
  const birthDate = dobToStr(selectedDob);
  const child = {id, name, emoji, birthDate};
  child.grade = resolveGradeForChild(child);
  children.push(child);
  saveChildren();
  activeChild = child;
  try{ localStorage.setItem('p1quiz_active_child', id); }catch(e){}
  progress = {};
  selectedGrade = child.grade;
  if(!mode && window.OwlHome2 && OwlHome2.on()) mode = 'quiz';
  if(mode && window.OwlLanding && OwlLanding.go){ OwlLanding.go(mode); return; }
  enterHome();
}

/* เข้าแอปหลังเลือกเด็ก
   📌 เคยแวะ "หน้าเลือกทาง" ก่อน — หน้านั้นถูกถอดออกทั้งหน้าแล้ว 2026-08-21
      (เลือกโหมดได้ในหน้าเลือกเด็กเลย ดู js/app-home2.js) ⇒ เหลือทางเดียวตรงเข้าหน้าหมวด */
function enterHome(){ enterHomeReal(); }
function enterHomeReal(){
  $('child-select-view').hidden = true;
  $('owl-widget').hidden = false;
  $('clear-btn').hidden = false;
  $('reload-btn').hidden = true;      /* ปุ่มโหลดใหม่มีเฉพาะหน้าเลือกเด็ก */
  homeView.hidden = false;
  updateHeaderChild();
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('welcome'), 700);
}

function updateHeaderChild(){
  const chipGroup = $('child-chip-group');
  if(activeChild){
    $('header-child-emoji').textContent = activeChild.emoji || '👤';
    $('header-child-name').textContent = activeChild.name;
    chipGroup.hidden = false;
  } else {
    chipGroup.hidden = true;
  }
  /* 📌 บรรทัดคำทักใต้ชื่อแอป (#brand-sub) ถูกถอดออกจาก header แล้ว (ผู้ใช้สั่ง 2026-08-20)
     ⇒ ไม่ต้องอัปเดตข้อความอีก · **ห้ามเอากลับมาโดยไม่ถามผู้ใช้** */
  /* โหมดบ้านมี chip ชื่อเด็กชุด proxy ของตัวเอง (header ถูกซ่อน) — sync ให้ตรงกันเสมอ
     house.js โหลดแบบ lazy จึงต้องเช็คก่อนเรียก */
  if(window.houseSyncChild) window.houseSyncChild();
}

function renderChildSelect(){
  const listEl = $('child-list');
  const addForm = $('child-add-form');
  const addNewBtn = $('child-add-new-btn');
  const csTitle = $('cs-title');
  const csSub = $('cs-sub');
  listEl.innerHTML = '';

  if(children.length === 0){
    csTitle.textContent = 'สวัสดีจ้า! ใครจะมาเรียน?';
    csSub.textContent = 'ใส่ชื่อก่อนเลยนะ 😊';
    addForm.hidden = false;
    addNewBtn.hidden = true;
  } else {
    csTitle.textContent = 'ใครจะมาเรียนวันนี้?';
    csSub.textContent = 'เลือกชื่อได้เลย 😊';
    children.forEach(child=>{
      const row = document.createElement('div');
      row.className = 'child-row';
      const card = document.createElement('button');
      card.className = 'child-card';
      const avSpan = document.createElement('span');
      avSpan.className = 'cav';
      avSpan.textContent = child.emoji || '🧒';
      const cinfo = document.createElement('div');
      cinfo.className = 'cinfo';
      const cname = document.createElement('div');
      cname.className = 'cname';
      cname.textContent = child.name;
      cinfo.appendChild(cname);
      const ageY = childAgeYears(child);
      if(ageY != null){
        const csub = document.createElement('div');
        csub.className = 'csub';
        csub.textContent = 'อายุ ' + Math.floor(ageY) + ' ปี · ' + gradeById(resolveGradeForChild(child)).short;
        cinfo.appendChild(csub);
      }
      /* ลูกศรท้ายการ์ด — หมุนชี้ลงตอนแถวถูกกาง
         🎨 **ต้องเป็น SVG ห้ามใช้อักขระ `▶`** — U+25B6 มีทั้งร่าง glyph และร่าง emoji สี
            แต่ละ OS เลือกคนละแบบ ขนาดก็ไม่เท่ากัน (ผู้ใช้แจ้ง 2026-08-23 · เทส IM7 ล็อกไว้)
         ⚠ `currentColor` ⇒ เปลี่ยนสีตามธีมจาก CSS ที่เดียว */
      const arrow = document.createElement('span');
      arrow.className = 'cnav';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" '
        + 'stroke="currentColor" stroke-width="2.6" stroke-linecap="round" '
        + 'stroke-linejoin="round"><polyline points="9 5 16 12 9 19"/></svg>';
      card.appendChild(avSpan);
      card.appendChild(cinfo);
      card.appendChild(arrow);
      card.addEventListener('click', ()=>{
        playClick();
        /* หน้าแรกแบบรวมร่าง → กางแถวนี้แทนการข้ามไปหน้าเลือกโหมด */
        if(window.OwlHome2 && OwlHome2.on()){ OwlHome2.toggle(child, row); return; }
        selectChild(child.id);
      });
      const editBtn = document.createElement('button');
      editBtn.className = 'child-edit-btn';
      editBtn.type = 'button';
      editBtn.setAttribute('aria-label','แก้ไข Emoji');
      editBtn.innerHTML = SVG_PENCIL;
      editBtn.addEventListener('click', ()=>{ playClick(); openEditEmojiModal(child.id); });
      row.appendChild(card);
      row.appendChild(editBtn);
      listEl.appendChild(row);
    });
    addForm.hidden = true;
    /* ครบเพดานแล้วซ่อนปุ่มเพิ่ม + บอกเหตุผลไว้ใต้หัวข้อ (ไม่ปล่อยให้กดแล้วเจอ toast อย่างเดียว) */
    addNewBtn.hidden = children.length >= MAX_CHILDREN;
    if(addNewBtn.hidden) csSub.textContent = 'มีครบ ' + MAX_CHILDREN + ' คนแล้ว — ลบคนที่ไม่ได้เล่นออกก่อนถึงจะเพิ่มใหม่ได้';
  }
  /* ปุ่ม "เข้าเมือง" ในฟอร์มสร้างโปรไฟล์มีเฉพาะหน้าแรกแบบรวมร่าง (ไม่งั้นซ้ำกับหน้าเลือกโหมด)
     ปุ่มยกเลิกมีเฉพาะตอนมีเด็กอยู่แล้ว — คนแรกของบ้านยกเลิกไปก็ไม่มีอะไรให้กลับไปดู */
  { const v2 = !!(window.OwlHome2 && OwlHome2.on());
    $('child-submit-house').hidden = !v2;
    $('child-submit-btn').textContent = v2 ? 'เริ่มเรียน' : 'เริ่มเรียนเลย! 🚀';
    $('child-cancel-btn').hidden = children.length === 0; }
  $('child-name-input').value = '';
  selectedEmoji = CHILD_AVATARS[0];
  selectedDob = null;
  initEmojiPicker();
  initDobPicker();
  $('child-select-view').hidden = false;
  if(window.OwlHome2) OwlHome2.reset();       /* ยุบแถวที่กางค้างอยู่ + หยุดลูปวาดตัวละคร */
  $('clear-btn').hidden = true;
  $('reload-btn').hidden = false;     /* กลับมาหน้าเลือกเด็ก → โชว์ปุ่มโหลดใหม่อีกครั้ง */
  /* 🐞 **แถบชื่อเด็กบน header ค้างอยู่หลังกดเปลี่ยนเด็ก** (ผู้ใช้แจ้ง 2026-08-20)
     ต้นเหตุ: ปุ่ม "เปลี่ยนเด็ก" เรียก renderChildSelect() อย่างเดียว ไม่ได้แตะ header เลย
     ⇒ ซ่อนรวมไว้กับกลุ่ม "กลับมาหน้าเลือกเด็ก" ตรงนี้ เพราะทุกทางกลับวิ่งผ่านฟังก์ชันนี้เสมอ
     ⚠ **ไม่แตะ `activeChild`** — แค่คืนสภาพสิ่งที่เห็นบนจอ ไม่ยุ่งกับ state ที่ระบบอื่นอ่านอยู่ */
  { const chipGroup = $('child-chip-group');
    if(chipGroup) chipGroup.hidden = true; }
  homeView.hidden = true;
  $('owl-widget').hidden = true;
  $('free-piano-btn').hidden = true;
}

/* child-select submit */
function handleChildSubmit(mode){
  const input = document.getElementById('child-name-input');
  const name = input.value.trim();
  if(!name){ input.focus(); showToast('✏️','ใส่ชื่อก่อนนะ'); return; }
  if(!selectedDob){ showToast('🎂','เลือกวันเกิดให้ครบด้วยนะ จะได้จัดระดับชั้นให้พอดี'); return; }
  playClick();
  addChild(name, mode);
}
function pad2(n){ return (n<10?'0':'')+n; }
/* {d,m,y(ค.ศ.)} → 'YYYY-MM-DD' (ค.ศ.) */
function dobToStr(dob){ return dob ? (dob.y+'-'+pad2(dob.m)+'-'+pad2(dob.d)) : ''; }
function strToDob(str){ if(!str) return null; const p=str.split('-').map(Number); return {y:p[0], m:p[1], d:p[2]}; }

/* ตัวเลือกวัน/เดือน/ปีเกิด (ใช้ทั้งฟอร์มสร้างโปรไฟล์และ popup) — onChange({d,m,y}|null) */
function buildDobPicker(container, current, onChange){
  if(!container) return;
  container.innerHTML = '';
  const curCE = new Date().getFullYear();
  const mkSel = (cls, ph, items, val)=>{
    const s = document.createElement('select');
    s.className = 'dob-select '+cls;
    const o0 = document.createElement('option'); o0.value=''; o0.textContent=ph; o0.disabled=true; o0.selected=!val; s.appendChild(o0);
    items.forEach(it=>{ const o=document.createElement('option'); o.value=it.v; o.textContent=it.t; if(String(it.v)===String(val)) o.selected=true; s.appendChild(o); });
    return s;
  };
  const days = []; for(let d=1;d<=31;d++) days.push({v:d,t:d});
  const mons = THAI_MONTHS.map((nm,i)=>({v:i+1,t:nm}));
  const years = []; for(let ce=curCE-3; ce>=curCE-14; ce--) years.push({v:ce, t:ce});  // แสดงปี ค.ศ. อายุ ~3-14 ปี
  const daySel = mkSel('dob-day','วัน', days, current&&current.d);
  const monSel = mkSel('dob-mon','เดือน', mons, current&&current.m);
  const yearSel = mkSel('dob-year','ปีเกิด (ค.ศ.)', years, current&&current.y);
  const emit = ()=>{ const d=+daySel.value, m=+monSel.value, y=+yearSel.value; onChange((d&&m&&y)?{d,m,y}:null); };
  [daySel,monSel,yearSel].forEach(s=> s.addEventListener('change', ()=>{ playClick(); emit(); }));
  container.append(daySel, monSel, yearSel);
}
function initDobPicker(){
  buildDobPicker(document.getElementById('dob-picker'), selectedDob, dob=>{ selectedDob = dob; });
}

/* ===================== popup ถามวันเกิด (โปรไฟล์เดิมที่ยังไม่เคยใส่) ===================== */
let ageModalDob = null;
function openAgeModal(){
  ageModalDob = null;
  $('age-modal-name').textContent = activeChild ? activeChild.name : '';
  buildDobPicker($('age-modal-picker'), null, dob=>{ ageModalDob = dob; });
  openOverlay('age-modal');
}
function confirmAgeModal(){
  if(!ageModalDob){ showToast('🎂','เลือกวันเกิดให้ครบก่อนนะ'); return; }
  playClick();
  if(activeChild){
    activeChild.birthDate = dobToStr(ageModalDob);
    delete activeChild.age;
    activeChild.grade = resolveGradeForChild(activeChild);
    const idx = children.findIndex(c=>c.id===activeChild.id);
    if(idx>=0){ children[idx].birthDate = activeChild.birthDate; delete children[idx].age; children[idx].grade = activeChild.grade; }
    saveChildren();
    selectedGrade = activeChild.grade;
  }
  closeOverlay('age-modal');
  /* หน้าแรกแบบรวมร่าง: กลับไปกางแถวของเด็กคนนี้ต่อ **ไม่ผ่านหน้าเลือกโหมด** (กำลังเลิกใช้) */
  if(window.OwlHome2 && activeChild && OwlHome2.openFor(activeChild.id)) return;
  enterHome();
}

/* ===================== แถบเลือกระดับชั้นในหน้าหลัก ===================== */
function renderGradeBar(){
  const bar = $('grade-bar');
  if(!bar) return;
  const top = activeChild ? unlockedTopIndex(activeChild) : 1;
  notifyGradeUnlock(top);   // แจ้งเตือนถ้าเก็บดาวจนปลดล็อกชั้นใหม่
  bar.innerHTML = '';
  GRADES.forEach((g, idx)=>{
    const unlocked = idx <= top;
    const playable = unlocked && g.available;     // ปลดล็อก + มีเนื้อหา = เล่นได้
    const soon = unlocked && !g.available;        // ปลดล็อกแล้วแต่ยังไม่มีเนื้อหา
    const locked = !unlocked;                     // ยังไม่ถึงเกณฑ์อายุ/ดาว
    const isSel = g.id===selectedGrade;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'grade-pill'+(isSel&&playable?' active':'')+(playable?'':' soon')+(locked?' locked':'');
    btn.innerHTML =
      '<span class="gp-emoji">'+(g.icon?'<img src="'+g.icon+'" class="gp-owl" alt="" draggable="false">':g.emoji)+'</span>'+
      (locked?'<span class="gp-lock">🔒</span>':'')+
      '<span class="gp-label">'+g.short+'</span>'+
      (playable?'':'<span class="gp-soon">'+(locked?'ล็อกอยู่':'เร็วๆ นี้')+'</span>');
    btn.addEventListener('click', ()=>{
      playClick();
      if(locked){ showToast('🔒', gradeUnlockHint(idx)); return; }
      if(soon){ showToast('🎉','ปลดล็อก '+g.short+' แล้ว! เนื้อหากำลังมาเร็วๆ นี้นะ'); return; }
      if(g.id===selectedGrade) return;
      selectedGrade = g.id;
      if(activeChild){
        activeChild.grade = g.id;
        const i = children.findIndex(c=>c.id===activeChild.id);
        if(i>=0){ children[i].grade = g.id; }
        saveChildren();
      }
      renderHome();
      window.scrollTo({top:0, behavior:'smooth'});
    });
    bar.appendChild(btn);
  });
}
/* คำใบ้วิธีปลดล็อกระดับชั้นที่ยังล็อก */
function gradeUnlockHint(idx){
  const prev = GRADES[idx-1];
  if(prev && catsForGrade(prev.id).length){
    return 'เก็บดาวใน '+prev.short+' ให้ถึง 80% แล้วจะเปิด '+GRADES[idx].short+' ให้เลย!';
  }
  return 'อีกนิดนะ! โตขึ้นอีกหน่อยหรือเก็บดาวให้ครบ จะเปิด '+GRADES[idx].short+' ให้จ้ะ';
}
/* แจ้งเตือนครั้งเดียวเมื่อปลดล็อกชั้นใหม่จากการเก็บดาว (เก็บ unlockNotified ในโปรไฟล์กันแจ้งซ้ำ) */
function notifyGradeUnlock(top){
  if(!activeChild) return;
  const ageTop = ageTopIndex(childAgeYears(activeChild));
  const base = (typeof activeChild.unlockNotified==='number') ? activeChild.unlockNotified : ageTop;
  if(top > base && top > ageTop){
    const g = GRADES[top];
    setTimeout(()=>{ showToast('🎉','เก่งมาก! ปลดล็อก '+g.short+' แล้ว'+(g.available?'':' (เนื้อหากำลังมาเร็วๆ นี้)')); playCongrats && playCongrats(); }, 500);
  }
  if(top !== activeChild.unlockNotified){
    activeChild.unlockNotified = top;
    const i = children.findIndex(c=>c.id===activeChild.id);
    if(i>=0){ children[i].unlockNotified = top; saveChildren(); }
  }
}
function initEmojiPicker(){
  const picker = document.getElementById('emoji-picker');
  if(!picker) return;
  picker.innerHTML = '';
  CHILD_AVATARS.forEach(em=>{
    const btn = document.createElement('button');
    btn.className = 'emo-btn'+(em===selectedEmoji?' selected':'');
    btn.textContent = em;
    btn.type = 'button';
    btn.addEventListener('click', ()=>{
      selectedEmoji = em;
      picker.querySelectorAll('.emo-btn').forEach(b=>b.classList.toggle('selected', b.textContent===em));
      playClick();
    });
    picker.appendChild(btn);
  });
}

function wireChildSelectEvents(){
  document.getElementById('child-submit-btn').addEventListener('click', ()=>handleChildSubmit('quiz'));
  document.getElementById('child-submit-house').addEventListener('click', ()=>handleChildSubmit('house'));
  document.getElementById('child-name-input').addEventListener('keydown', e=>{ if(e.key==='Enter') handleChildSubmit('quiz'); });
  /* ⬅ ยกเลิกการเพิ่มเด็ก — กลับไปรายชื่อเดิม (โผล่เฉพาะตอนมีเด็กอยู่แล้ว ไม่งั้นกดแล้วหน้าว่างเปล่า) */
  document.getElementById('child-cancel-btn').addEventListener('click', ()=>{
    playClick();
    renderChildSelect();
  });
  document.getElementById('child-add-new-btn').addEventListener('click', ()=>{
    playClick();
    selectedEmoji = CHILD_AVATARS[0];
    selectedDob = null;
    document.getElementById('child-name-input').value = '';
    document.getElementById('child-add-new-btn').hidden = true;
    document.getElementById('child-add-form').hidden = false;
    initEmojiPicker();
    initDobPicker();
    document.getElementById('child-name-input').focus();
  });
  document.getElementById('child-import-btn').addEventListener('click', ()=>{
    playClick();
    document.getElementById('child-import-input').value = '';
    document.getElementById('child-import-input').click();
  });
  document.getElementById('child-import-input').addEventListener('change', e=>{
    const file = e.target.files[0];
    if(file) importChildData(file);
  });
  const ageConfirm = document.getElementById('age-modal-confirm-btn');
  if(ageConfirm) ageConfirm.addEventListener('click', confirmAgeModal);
}

/* ============================= SOUND ============================= */
let audioCtx=null;
function ensureAudio(){
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  }
}
function playTone(freq,dur,type,delay,vol){
  if(!soundOn || !window.AudioContext && !window.webkitAudioContext) return;
  ensureAudio();
  if(!audioCtx) return;
  const t0 = audioCtx.currentTime + (delay||0);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type||'sine';
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol||0.12, t0+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0+dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t0); osc.stop(t0+dur+0.03);
}
function playWin(){ playTone(523.25,.14,'sine',0,.13); playTone(659.25,.14,'sine',.13,.13); playTone(783.99,.14,'sine',.26,.13); playTone(1046.5,.3,'sine',.39,.15); }

/* ============================= BACKGROUND MUSIC ============================= */
let musicOn = true;
try{ musicOn = localStorage.getItem('p1quiz_music') !== 'off'; }catch(e){}
let musicGain=null, musicSchedulerId=null, musicNoteIndex=0, musicNextTime=0, musicTrackIdx=0;
/* 🎹 เพลงพื้นหลังของหน้าทำโจทย์ — **ย้ายไปอยู่ js/music-quiz.js ทั้งชุดแล้ว (2026-08-20)**
   ของเดิมคือ 5 เพลง "ชั้นเดียว" (ทำนองล้วน) เขียนไว้ตั้งแต่เวอร์ชันแรก
   ⇒ แทนด้วย **6 เพลง 3 ชั้น (ทำนอง+เบส+คอร์ด) เปียโนทุกชั้น เพลงละ ~87-102 วิ**
   ผลพลอยได้ที่ผู้ใช้สั่ง: เพลงแบบหลายชั้นวิ่งผ่าน `musicSchedulerLayered()` ซึ่งใช้
   `MUSIC_LAYER_MIX` ตัวเดียวกับเพลงในโหมดบ้าน ⇒ **ความดังเท่าโหมดบ้านโดยอัตโนมัติ**
   ⚠ ไฟล์เพลงต้องโหลดก่อนไฟล์นี้ (ดู index.html) — ถ้าหายไปจะเงียบ ไม่ throw */
const MUSIC_TRACKS = window.QUIZ_MUSIC_TRACKS || [];

/* ============================= CONFETTI ============================= */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let particles = [];
let confettiRunning = false;
const CONFETTI_COLORS = ['#FF8A5B','#33B7EE','#4CBE84','#FFC53D','#F17FA8','#9B7DE0'];
function spawnConfetti(x, y, count){
  count = count || 36;
  for(let i=0;i<count;i++){
    particles.push({
      x:x, y:y,
      vx:(Math.random()-0.5)*9,
      vy:Math.random()*-10-3,
      size:Math.random()*7+4,
      color:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
      rot:Math.random()*360,
      vr:(Math.random()-0.5)*16,
      life:0,
      maxLife:65+Math.random()*35,
      shape: Math.random()>0.5 ? 'rect':'circle'
    });
  }
  if(!confettiRunning){ confettiRunning = true; requestAnimationFrame(tickConfetti); }
}
function tickConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.vy += 0.28; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot*Math.PI/180);
    ctx.globalAlpha = Math.max(0, 1-p.life/p.maxLife);
    ctx.fillStyle = p.color;
    if(p.shape==='rect'){ ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6); }
    else{ ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  });
  particles = particles.filter(p => p.life < p.maxLife && p.y < canvas.height+60);
  if(particles.length>0){ requestAnimationFrame(tickConfetti); }
  else{ confettiRunning=false; ctx.clearRect(0,0,canvas.width,canvas.height); }
}
function burstFromElement(el, count){
  const r = el.getBoundingClientRect();
  spawnConfetti(r.left+r.width/2, r.top+r.height/2, count);
}
function burstCenterTop(count){
  spawnConfetti(innerWidth/2, innerHeight*0.25, count||90);
  setTimeout(()=>spawnConfetti(innerWidth*0.2, innerHeight*0.2, 40), 120);
  setTimeout(()=>spawnConfetti(innerWidth*0.8, innerHeight*0.2, 40), 220);
}

/* ============================= HELPERS ============================= */
const $ = id => document.getElementById(id);
const homeView = $('home-view'), quizView = $('quiz-view'), resultView = $('result-view'), arView = $('ar-view'), memoryView = $('memory-view'), listenView = $('listen-view'), shadowView = $('shadow-view'), mixView = $('mix-view'), musicView = $('music-view'), dotsView = $('dots-view'), clockView = $('clock-view'), efView = $('ef-view'), codeView = $('code-view'), sciView = $('science-view');
/* ป.2 engine ใหม่ (IDEA + Phase 2.2): ร้านค้า(เงิน) / เศษส่วน / ตาชั่ง / ปฏิทิน */
const moneyView = $('money-view'), fractionView = $('fraction-view'), balanceView = $('balance-view'), calendarView = $('calendar-view'), timelineView = $('timeline-view'), sortView = $('sort-view'), worldView = $('world-view'), coordView = $('coord-view');
const chartView = $('chart-view'), areaView = $('area-view'), angleView = $('angle-view');
const clozeView = $('cloze-view');
const circuitView = $('circuit-view'), tangramView = $('tangram-view'), mirrorView = $('mirror-view'), orderView = $('order-view');
const houseView = $('house-view');   /* บ้านของหนู (3D) — js/house.js ใช้ตัวแปรนี้ */ // เกมฟังประโยคเติมคำ // เกม ป.4 (แผนภูมิแท่ง / พื้นที่ / มุม)

/* ---- ตัวช่วยสลับหน้าจอเกม ----
   showOnlyView(v) = โชว์ view เดียว ซ่อนที่เหลือทั้งหมด (showOnlyView(null) = ซ่อนทุก view)
   *** เพิ่มเกม/view ใหม่ ให้เติมชื่อใน ALL_VIEWS ที่เดียวพอ ***
   ไม่ต้องไล่เติม xxxView.hidden=true ตามจุดสลับหน้าทีละจุดเหมือนเดิมอีกต่อไป */
const ALL_VIEWS = [
  homeView, quizView, resultView, arView, memoryView, listenView, shadowView, mixView, musicView,
  dotsView, clockView, efView, codeView, sciView, moneyView, fractionView, balanceView, calendarView,
  timelineView, sortView, worldView, coordView, chartView, areaView, angleView, clozeView,
  circuitView, tangramView, mirrorView, orderView, houseView
];
function showOnlyView(view){ ALL_VIEWS.forEach(v => { v.hidden = (v !== view); }); }
const mascot = $('mascot');
let lastGameType = 'quiz', lastCatId = null;
let memoryGame = null;

function mascotHappy(){ mascot.classList.remove('oops'); mascot.classList.remove('happy'); void mascot.offsetWidth; mascot.classList.add('happy'); }
function mascotOops(){ mascot.classList.remove('happy'); mascot.classList.remove('oops'); void mascot.offsetWidth; mascot.classList.add('oops'); }


function saveProgress(){
  try{ localStorage.setItem(progressKey(), JSON.stringify(progress)); }catch(e){}
}
/* ---------- เงินนกฮูก (Owl Coin) 🪙 — สกุลเงินในเกมของเด็กแต่ละคน ----------
   เก็บไว้ใน progress ของเด็ก (`progress.coins`) จึงถูกพ่วงไปกับระบบ export/import ย้ายเครื่อง
   และแยกตามเด็กแต่ละคนอัตโนมัติ (progressKey ผูกกับ activeChild อยู่แล้ว)
   **เด็กใหม่/เด็กเก่าที่ยังไม่มีค่า = 0 เสมอ**
   ตอนนี้ยังไม่มีที่ให้หาเงิน/ใช้เงิน — วางระบบไว้ก่อน เวลาจะต่อของจริงให้เรียกผ่าน 4 ฟังก์ชันนี้เท่านั้น
   (ห้ามไปแก้ `progress.coins` ตรงๆ จากที่อื่น จะได้มีจุดเดียวที่บันทึก/ยิง event)
   ทุกครั้งที่ยอดเปลี่ยน จะยิง event `owlcoins` ที่ document พร้อม detail {coins, delta}
   ให้ UI ในอนาคต (ป้ายยอดเงิน/ร้านค้า) มาดักฟังได้เลย
   ไฟล์อื่นที่อยู่ใน IIFE (เช่น js/house.js) เรียกผ่าน `window.OwlCoins` ได้ */
const COIN_MAX = 9999999;
function getCoins(){
  const n = progress && progress.coins;
  return (typeof n === 'number' && isFinite(n) && n > 0) ? Math.floor(n) : 0;
}
function setCoins(n){
  const before = getCoins();
  const val = Math.max(0, Math.min(COIN_MAX, Math.floor(Number(n) || 0)));
  progress.coins = val;
  saveProgress();
  if(val !== before){
    try{ document.dispatchEvent(new CustomEvent('owlcoins', {detail:{coins:val, delta:val-before}})); }catch(e){}
  }
  return val;
}
function addCoins(n){ return setCoins(getCoins() + (Number(n) || 0)); }
/* ตัดเงิน — คืน true ถ้าเงินพอและตัดสำเร็จ, false ถ้าเงินไม่พอ (ยอดไม่เปลี่ยน) */
function spendCoins(n){
  const cost = Math.max(0, Math.floor(Number(n) || 0));
  if(getCoins() < cost) return false;
  setCoins(getCoins() - cost);
  return true;
}
/* 🔒 `set` = ตั้งเงินเท่าไหร่ก็ได้ ⇒ **เปิดเฉพาะตอนรันในเครื่อง** (กติกาเดียวกับเครื่องมือเทสตัวอื่น)
   ⚠️ ต้องกันที่ **จุดนิยาม** ไม่ใช่ไปลบทีหลัง — หน้าแรกโหลดชุดบ้านเบื้องหลังให้เด็กที่มีบ้านอยู่แล้ว
     (`preloadHouseIfOwned`) ตัวลบที่ผูกกับ "ตอนเข้าเมือง" จึงไม่ทันเสมอไป (เจอบน production 2026-08-23) */
window.OwlCoins = {get:getCoins, add:addCoins, spend:spendCoins};
if(/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
   || location.protocol === 'file:')
  window.OwlCoins.set = setCoins;

function catById(id){ return CATS.find(c=>c.id===id); }
/* นับสติกเกอร์เฉพาะระดับชั้นที่กำลังดูอยู่ (สติกเกอร์แยกตามระดับชั้น) */
function stickerCount(){ return catsForGrade(selectedGrade).filter(c=>progress[c.id] && progress[c.id].unlocked).length; }
function setStickerEarned(cat){
  const el = $('sticker-earned');
  if(cat.icon){ el.innerHTML = '<img src="'+cat.icon+'" class="sticker-earned-img" alt="'+cat.name+'">'; }
  else { el.textContent = cat.emoji; }
}
function setCatLabel(id, cat){
  const el = $(id);
  el.innerHTML = (cat.icon ? '<img src="'+cat.icon+'" class="cat-label-icon" alt=""> ' : cat.emoji+' ')+cat.name;
  el.style.color = cat.color;
}
function updateTally(){ $('tally-text').textContent = stickerCount()+'/'+catsForGrade(selectedGrade).length; }

/* wire child-select events now that $ is available */
wireChildSelectEvents();
$('switch-child-btn').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  document.body.classList.remove('dots-open');
  showOnlyView(null);
  renderChildSelect();
});

/* ---------- สแคฟโฟลด์กลางของการ "เริ่มเกม" ----------
   เดิมทุก engine เขียน 6 บรรทัดเดียวกันซ้ำ (stopARGame / lastGameType / showOnlyView /
   --cat-color / progress-fill / setCatLabel) รวมกว่า 25 ที่ ทำให้เวลาเพิ่มฟีเจอร์ที่ต้องแตะทุก engine
   (เช่น cat.hard หรือ view ใหม่) มักหลงลืมบางจุด — รวบมาไว้ที่เดียว
   คืนค่า cat เพื่อให้ engine ใช้ต่อได้ทันที */
function beginSkillGame(catId, type, view, labelId){
  stopARGame();
  lastGameType = type; lastCatId = catId;
  const cat = catById(catId);
  showOnlyView(view);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  view.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel(labelId, cat);
  return cat;
}
/* ⭐ **ตะเข็บ Mount สำหรับ engine ที่มีหน้าสรุปผลเป็นของตัวเอง** (ไม่ได้จบผ่าน finishP2Game)
   🐞 บั๊กจริงที่ผู้ใช้แจ้ง 2026-08-17 (เกมทายเงา): เล่นจบในการ์ดเควสต์แล้ว
      **การ์ดไม่ปิด · ไม่รายงานผล · เควสต์ไม่จบ**
   ต้นเหตุ: `js/owl-games.js` ออกแบบให้ทุก engine ส่งผลกลับโฮสต์ผ่าน `OwlGames.handleFinish()`
      ซึ่งถูกเรียกอยู่บรรทัดแรกของ `finishP2Game()` เท่านั้น
      แต่มี engine อีก 6 ตัวที่เขียนหน้าสรุปเองแยกไปเลย (ทายเงา/จับคู่/นกฮูกสั่ง/ผสมสี/ดนตรี/หุ่นยนต์)
      ⇒ ทั้ง 6 ตัวข้ามตะเข็บนี้ไปหมด · โฮสต์ไม่เคยรู้ว่าเกมจบ การ์ดเลยค้าง
      ⇒ ซ้ำร้าย `showOnlyView` ถูกครอบไว้ระหว่าง mount ให้ "แค่โชว์ ไม่ซ่อนใคร"
        หน้าสรุปของหน้าหลักเลยไปเปิดค้างอยู่หลังฉากเมืองแทนที่จะเด้งขึ้นมา

   ⚠ **engine ที่มีหน้าสรุปของตัวเองต้องเรียกตัวนี้เป็นบรรทัดแรกเสมอ** แล้ว `return` ทันทีถ้าได้ true
     (ตัวที่จบด้วย finishP2Game ไม่ต้องเรียก — มีให้อยู่แล้วข้างใน) */
function reportGameResult(catId, mistakes, totalLevels, doneWord){
  return !!(window.OwlGames && OwlGames.handleFinish(catId, mistakes, totalLevels, doneWord));
}

/* ปิดท้ายการเริ่มเกม: เลื่อนจอขึ้นแล้วให้นกฮูกทักทาย */
function endSkillGameStart(){
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

/* ============================= HOME RENDER ============================= */
function renderHome(){
  unmountHandPlay(); // ออกจากเกมแล้วปิดกล้อง/ถอดปุ่มโหมดมือเสมอ
  /* 🚪 ปุ่มออกจากโหมดทำโจทย์ — ต้องเช็คทุกครั้งที่กลับมาหน้านี้
     (โหมดบ้านเปิด/ปิดได้ระหว่าง branch ⇒ ค่าคงที่ตอนโหลดหน้าเชื่อไม่ได้) */
  if(window.OwlLanding && OwlLanding.refreshQuizExitBtn) OwlLanding.refreshQuizExitBtn();
  resumeBgMusicAfterMusicGame(); // กลับมาหน้าหลัก = เล่นเพลงพื้นหลังต่อ (เผื่อออกจากเกมดนตรีทางอื่น)
  document.body.classList.remove('music-open');
  document.body.classList.remove('dots-open');
  updateFreePianoBtn();
  const name = activeChild ? activeChild.name : 'นักสู้ตัวน้อย';
  $('hero-greeting').textContent = 'สวัสดีจ้า '+name+'! 🎉';
  const heroAge = $('hero-age');
  if(heroAge){
    const ageY = activeChild ? childAgeYears(activeChild) : null;
    if(ageY != null){
      heroAge.textContent = '🎂 อายุ '+Math.floor(ageY)+' ปี · ระดับชั้น '+gradeById(resolveGradeForChild(activeChild)).short;
      heroAge.hidden = false;
    } else heroAge.hidden = true;
  }
  const grid = $('cat-grid');
  const gridInteractive = $('cat-grid-interactive');
  const gridSkill = $('cat-grid-skill');
  const gridListen = $('cat-grid-listen');
  const gridWrite = $('cat-grid-write');
  grid.innerHTML = '';
  gridInteractive.innerHTML = '';
  gridSkill.innerHTML = '';
  gridListen.innerHTML = '';
  gridWrite.innerHTML = '';
  if(!gradeById(selectedGrade).available) selectedGrade = 'prep-p1';
  renderGradeBar();
  catsForGrade(selectedGrade).forEach(cat=>{
    const p = progress[cat.id];
    const unlocked = p && p.unlocked;
    const reqId = CAT_REQUIRES[cat.id];
    const isLocked = !!reqId && !(progress[reqId] && progress[reqId].unlocked);
    const isDeviceLocked = !!cat.desktopOnly && isMobileViewport();
    const locked = isLocked || isDeviceLocked;
    const card = document.createElement('button');
    card.className = 'cat-card'+(locked?' cat-locked':'');
    card.style.setProperty('--cat-light', locked?'#EEEEEE':cat.light);
    card.style.setProperty('--cat-color', locked?'#AAAAAA':cat.color);
    /* ตัวเข้าฉาก (cardIn) ใช้ fill-mode:forwards ค้าง transform:scale(1) ไว้ตลอดไปด้วย
       "animation priority" ซึ่งชนะ transition ของ :hover เสมอ (แม้ animation จะจบไปนานแล้ว)
       ทำให้ hover scale ไม่ขยับเลย — พอ animation จบ เปลี่ยนมาใช้ class ".settled" (ปกติ ไม่ใช่ animation)
       แทนเพื่อคง transform:scale(1) ไว้ ให้ :hover (ซึ่ง specificity สูงกว่า) แข่งขันชนะได้ตามปกติ
       (ห้ามลบ animation ตรงๆ เฉยๆ เพราะจะ fallback กลับไป base style transform:scale(.85) ทันทีเหมือนย่อกลับ) */
    card.addEventListener('animationend', function onCardInEnd(){
      card.classList.add('settled');
      card.style.animation = 'none';
      card.removeEventListener('animationend', onCardInEnd);
    }, {once:true});
    const total = (cat.type==='ar' || cat.type==='skill' || cat.type==='listen' || cat.type==='write') ? cat.levels : (cat.poolPick || cat.questions.length);
    card.innerHTML =
      (cat.isNew ? '<div class="cat-new-badge">NEW ✨</div>' : '')+
      (cat.cardTag ? '<div class="cat-card-tag">'+cat.cardTag+'</div>' : '')+
      '<div class="cat-sticker'+(unlocked?' unlocked':'')+'">'+(unlocked?(cat.icon?'<img src="'+cat.icon+'" class="cat-sticker-icon" alt="">':cat.emoji):'🔒')+'</div>'+
      '<div class="cat-emoji">'+(locked?'🔒':(cat.icon?'<img src="'+cat.icon+'" class="cat-icon-img" alt="'+cat.name+'">':cat.emoji))+'</div>'+
      '<div class="cat-name">'+cat.name+'</div>'+
      /* handPlay = เกมแตะที่เปิดกล้องเล่นด้วยมือได้ (ป.3) — เติม 🖐️ ต่อท้ายให้รู้ตั้งแต่หน้าเลือกหมวด */
      '<div class="cat-meta">'+(cat.type==='ar' ? total+' ด่าน 🖐️' : cat.type==='skill' ? total+' ด่าน 🧠'+(cat.handPlay?'🖐️':'') : cat.type==='listen' ? total+' ด่าน 🎧' : cat.type==='write' ? total+' ด่าน ✍️' : total+' ข้อ')+'</div>'+
      (isLocked
        ? '<div class="cat-lock-msg">🔐 ผ่าน '+catById(reqId).name+' ก่อนนะ</div>'
        : isDeviceLocked
          ? '<div class="cat-lock-msg">🖥️ เล่นได้บนแท็บเล็ต/คอมพิวเตอร์เท่านั้นนะ</div>'
          : (p ? '<div class="cat-progress">ทำแล้ว '+Math.min(p.best, total)+'/'+total+' '+'⭐'.repeat(p.stars)+'</div>' /* clamp กัน best เก่าเกิน total ใหม่ (เช่น เกมดนตรี 2 เคย 10 ด่าน ลดเหลือ 7) */
                : '<div class="cat-progress cat-progress-new">ยังไม่เคยทำ ✨</div>'));
    card.addEventListener('click', ()=>{
      if(isLocked){
        showToast('🔐','ต้องผ่าน '+catById(reqId).name+' ก่อนนะ!');
        showOwlMsg('locked');
        return;
      }
      if(isDeviceLocked){
        showToast('🖥️','เกมนี้เล่นได้บนแท็บเล็ตหรือคอมพิวเตอร์เท่านั้นนะ ลองเปิดจากอุปกรณ์จอใหญ่ขึ้นดูนะ!');
        showOwlMsg('locked');
        return;
      }
      playClick();
      if(cat.type==='ar') startARGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='shadow') startShadowGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='mix') startMixGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='music') startMusicGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='clock') startClockGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='ef') startEfGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='code') startCodeGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='science') startScienceGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='money') startMoneyGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='fraction') startFractionGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='balance') startBalanceGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='calendar') startCalendarGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='timeline') startTimelineGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='sort') startSortGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='world') startWorldGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='coord') startCoordGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='chart') startChartGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='area') startAreaGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='angle') startAngleGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='circuit') startCircuitGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='tangram') startTangramGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='mirror') startMirrorGame(cat.id);
      else if(cat.type==='skill' && cat.mode==='order') startOrderGame(cat.id);
      else if(cat.type==='skill') startMemoryGame(cat.id);
      else if(cat.type==='listen' && cat.mode==='cloze') startClozeGame(cat.id);
      else if(cat.type==='listen') startListenGame(cat.id);
      else if(cat.type==='write') startDotsGame(cat.id);
      else startQuiz(cat.id);
      mountHandPlay(cat); // เกม ป.3 ที่ handPlay:true → ติดปุ่มกล้อง "เล่นด้วยมือ" ในแถบหัวเกม
    });
    /* เกมวิทยาศาสตร์ (predict-check ใช้กล้อง/มือ) จัดไว้ section "การโต้ตอบ (AR)" แม้ type เป็น skill */
    (cat.type==='skill'
      ? (cat.mode==='science' ? gridInteractive : gridSkill)
      : (cat.type==='ar' ? gridInteractive : (cat.type==='listen' ? gridListen : (cat.type==='write' ? gridWrite : grid)))).appendChild(card);
  });
  /* ซ่อนทั้ง section ถ้าระดับชั้นนี้ไม่มีหมวดในกลุ่มนั้นเลย (เช่น ป.1 ยังไม่มีเกม AR/ฟังคำ/ฝึกเขียน) */
  [grid, gridInteractive, gridSkill, gridListen, gridWrite].forEach(g=>{
    const sec = g.closest('.cat-section');
    if(sec) sec.hidden = g.children.length===0;
  });
  updateTally();
  if(window.houseBuddyRefresh) window.houseBuddyRefresh(); // เพื่อนซี้หน้าหลัก (js/house.js โหลดทีหลัง — ครั้งแรกสุด house.js เรียกเองตอนโหลดเสร็จ)
  preloadHouseIfOwned();  // เด็กที่มีบ้านอยู่แล้ว → โหลดโหมดบ้านตอนว่างเพื่อให้เพื่อนซี้โผล่มา
}
