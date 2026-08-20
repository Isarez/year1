/* ================================================================================
   ส่วน UI รอบนอกของแอป (โหลดเป็นไฟล์สุดท้ายของชุด app)
   ปุ่มเสียง/เพลง/เต็มจอ, toast, สมุดสติกเกอร์, modal, ย้ายข้อมูลเข้า-ออก, ล้างข้อมูล,
   รายละเอียดการอัพเดท, ธีมกลางวัน-กลางคืน, พื้นหลังลอย (ลูกโป่ง/เมฆ/ประกาย)
   **บรรทัดสุดท้ายคือ INIT** ที่เรียกใช้ฟังก์ชันจากทุกไฟล์ จึงต้องโหลดไฟล์นี้ท้ายสุดเสมอ
   ================================================================================ */

/* ============================= SOUND TOGGLE ============================= */
const soundBtn = $('sound-toggle');
refreshSoundBtn();
soundBtn.addEventListener('click', ()=>{
  soundOn = !soundOn;
  try{ localStorage.setItem('p1quiz_sound', soundOn?'on':'off'); }catch(e){}
  refreshSoundBtn();
  if(soundOn) playClick();
});

/* ============================= MUSIC TOGGLE ============================= */
const musicBtn = $('music-toggle');
refreshMusicBtn();
musicBtn.addEventListener('click', ()=>{
  musicOn = !musicOn;
  try{ localStorage.setItem('p1quiz_music', musicOn?'on':'off'); }catch(e){}
  refreshMusicBtn();
  if(musicOn){ startMusic(); } else { stopMusic(); }
});
if(musicOn){
  const resumeMusicOnce = ()=>{ startMusic(); document.removeEventListener('click', resumeMusicOnce); };
  document.addEventListener('click', resumeMusicOnce, {once:true});
}

/* ============================= FULLSCREEN TOGGLE ============================= */
const fsBtns = [$('fullscreen-toggle'), $('ar-fullscreen-toggle'), $('sci-fullscreen-toggle'), $('house-fullscreen-toggle')];
function refreshFsBtn(){
  const label = document.fullscreenElement ? 'ออกจากเต็มหน้าจอ' : 'เต็มหน้าจอ';
  fsBtns.forEach(btn=>{
    /* ปุ่มในโหมดบ้านเป็นแคปซูล "ไอคอน + ข้อความ" — เขียนทับเฉพาะช่องไอคอน ไม่งั้นป้ายข้อความหาย */
    const ic = btn.querySelector('.hc-ic'), lb = btn.querySelector('.hc-label');
    (ic || btn).innerHTML = document.fullscreenElement ? SVG_COMPRESS : SVG_EXPAND;
    if(lb) lb.textContent = label;
    btn.setAttribute('aria-label', label);
    btn.dataset.tooltip = label;
  });
}
fsBtns.forEach(btn=> btn.addEventListener('click', ()=>{
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  }else{
    document.exitFullscreen && document.exitFullscreen();
  }
}));
document.addEventListener('fullscreenchange', refreshFsBtn);
refreshFsBtn();

/* ============================= TOAST ============================= */
let _toastTimer = null;

/* ============================= STICKER BOOK ============================= */
function renderStickerBook(stampCatId){
  const grid = $('sb-grid');
  grid.innerHTML = '';
  catsForGrade(selectedGrade).forEach((cat, i)=>{
    const p = progress[cat.id];
    const isEarned = p && p.unlocked;
    const isNew = cat.id === stampCatId;
    const slot = document.createElement('div');
    slot.id = 'sb-slot-'+cat.id;
    slot.className = 'sb-slot'+(isEarned?' earned':'')+(isNew?' stamping':'');
    slot.style.setProperty('--shine-delay', (i*0.4)+'s');
    if(isEarned){
      slot.innerHTML =
        '<div class="slot-sticker"><div class="slot-shine"></div>'+
        (cat.icon
          ? '<img src="'+cat.icon+'" class="slot-icon-img" alt="'+cat.name+'">'
          : '<span class="slot-emoji">'+cat.emoji+'</span>')+
        '</div>'+
        '<span class="slot-name">'+cat.name+'</span>';
    } else {
      slot.innerHTML =
        '<span class="slot-empty">🔒</span>'+
        '<span class="slot-name" style="opacity:.4">'+cat.name+'</span>';
    }
    grid.appendChild(slot);
  });
}

function openStickerBook(stampCatId){
  $('sb-sub').textContent = (activeChild ? '📖 ของ '+activeChild.name : '📖 สมุดสติกเกอร์')+' • '+gradeById(selectedGrade).short;
  renderStickerBook(stampCatId);
  openOverlay('sticker-book');
  if(stampCatId){
    setTimeout(()=>{ playWin(); }, 1000);
    setTimeout(()=>{
      const slot = $('sb-slot-'+stampCatId);
      if(slot) burstFromElement(slot, 55);
    }, 1100);
  }
}

function closeStickerBook(){
  closeOverlay('sticker-book');
}

$('sb-close-btn').addEventListener('click', ()=>{ playClick(); closeStickerBook(); });
$('sb-x-btn').addEventListener('click', ()=>{ playClick(); closeStickerBook(); });
$('sticker-book').addEventListener('click', e=>{ if(e.target===$('sticker-book')) closeStickerBook(); });
$('sticker-tally-btn').addEventListener('click', ()=>{ playClick(); openStickerBook(null); });


let _owlTimer = null;
function showOwlMsg(type){
  const pool = OWL_MSGS[type];
  if(!pool) return;
  const msg = pool[Math.floor(Math.random()*pool.length)];
  const bubble = $('owl-speech');
  bubble.textContent = msg;
  bubble.classList.remove('visible');
  void bubble.offsetWidth;
  bubble.classList.add('visible');
  clearTimeout(_owlTimer);
  _owlTimer = setTimeout(()=>bubble.classList.remove('visible'), 3200);
}

$('mascot').addEventListener('click', ()=>{ playClick(); showOwlMsg('cheer'); });

/* ============================= MODAL ============================= */
let modalConfirmCallback = null;
function showModal(icon, title, body, confirmLabel, onConfirm){
  $('modal-icon').textContent = icon;
  $('modal-title').textContent = title;
  $('modal-body').textContent = body;
  $('modal-confirm-btn').textContent = confirmLabel;
  modalConfirmCallback = onConfirm;
  openOverlay('confirm-modal');
}
function closeModal(){ closeOverlay('confirm-modal'); modalConfirmCallback = null; }
$('modal-cancel-btn').addEventListener('click', ()=>{ playClick(); closeModal(); });
$('modal-backdrop').addEventListener('click', closeModal);
$('modal-confirm-btn').addEventListener('click', ()=>{
  const cb = modalConfirmCallback;
  closeModal();
  if(cb) cb();
});

/* ============================= DATA TRANSFER (export / import) ============================= */

function owkHash(str){
  let h = 5381;
  for(let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return 'OWK1_' + (h >>> 0).toString(16).padStart(8, '0');
}

function exportChildData(){
  if(!activeChild){ showToast('⚠️','เลือกเด็กก่อนนะ'); return; }
  const prog = JSON.parse(localStorage.getItem('p1quiz_progress_'+activeChild.id) || '{}');
  const payload = {v:1, child:{id:activeChild.id, name:activeChild.name, emoji:activeChild.emoji||'🧒', age:activeChild.age, birthDate:activeChild.birthDate}, progress:prog};
  const body = JSON.stringify(payload);
  const sig = owkHash(body);
  /* house = ข้อมูล "บ้านของหนู" (ตัวละคร/ของแต่งบ้าน) แนบไปนอก sig เดิม เพื่อให้ไฟล์ export ใหม่
     ยังนำเข้าในแอปเวอร์ชันเก่าได้ (เวอร์ชันเก่า verify sig จาก {v,child,progress} แล้วมองข้าม field เกิน) */
  let house = null;
  try{ house = JSON.parse(localStorage.getItem('p1quiz_house_'+activeChild.id) || 'null'); }catch(e){}
  const full = JSON.stringify(house ? {v:payload.v, child:payload.child, progress:payload.progress, house, sig} : {v:payload.v, child:payload.child, progress:payload.progress, sig});
  const bytes = new TextEncoder().encode(full);
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
  const b64 = btoa(binary);
  const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)+Date.now().toString(36);
  const blob = new Blob([b64], {type:'application/octet-stream'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'owlkids_data_'+uuid;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  hideClearModal();
  showToast('📤','ดาวน์โหลดข้อมูลของ '+activeChild.name+' แล้ว!');
}

let pendingImport = null;

function showImportConflictModal(importedChild, progress, conflictChild, house){
  pendingImport = {child: importedChild, progress, house: house||null, conflictChildId: conflictChild.id};
  $('import-conflict-title').textContent = 'มีเด็กชื่อ "'+conflictChild.name+'" อยู่แล้ว';
  $('import-rename-form').hidden = true;
  $('import-rename-input').value = importedChild.name;
  $('import-replace-btn').hidden = false;
  $('import-rename-btn').hidden = false;
  $('import-rename-confirm-btn').hidden = true;
  openOverlay('import-conflict-modal');
}
function hideImportConflictModal(){ closeOverlay('import-conflict-modal'); pendingImport = null; }

function importChildData(file){
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const binary = atob(e.target.result.trim());
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      const jsonStr = new TextDecoder().decode(bytes);
      const obj = JSON.parse(jsonStr);
      const {v, child, progress, house, sig} = obj;
      if(!sig || !child || !child.id || !child.name){
        showToast('❌','ไฟล์ไม่ถูกต้อง ไม่สามารถนำเข้าได้'); return;
      }
      const body = JSON.stringify({v, child:{id:child.id, name:child.name, emoji:child.emoji||'🧒', age:child.age, birthDate:child.birthDate}, progress:progress||{}});
      if(owkHash(body) !== sig){
        showToast('❌','ไฟล์ไม่ถูกต้อง ไม่สามารถนำเข้าได้'); return;
      }
      const conflictChild = children.find(c => c.id === child.id || c.name.toLowerCase() === child.name.toLowerCase());
      if(conflictChild){
        showImportConflictModal(child, progress||{}, conflictChild, house);
        return;
      }
      children.push({id:child.id, name:child.name, emoji:child.emoji||'🧒', age:child.age, birthDate:child.birthDate});
      saveChildren();
      if(progress) try{ localStorage.setItem('p1quiz_progress_'+child.id, JSON.stringify(progress)); }catch(er){}
      if(house) try{ localStorage.setItem('p1quiz_house_'+child.id, JSON.stringify(house)); }catch(er){}
      renderChildSelect();
      showToast('📥','นำเข้าข้อมูลของ '+child.name+' เรียบร้อย! 🎉');
    }catch(err){
      showToast('❌','ไฟล์ไม่ถูกต้อง ไม่สามารถนำเข้าได้');
    }
  };
  reader.readAsText(file);
}

/* ============================= CLEAR DATA ============================= */
function showClearModal(){
  const name = activeChild ? (activeChild.emoji+' '+activeChild.name) : null;
  $('clear-child-info').textContent = name
    ? name+' — เลือกว่าต้องการทำอะไร'
    : 'เลือกว่าต้องการทำอะไร';
  openOverlay('clear-modal');
}
function hideClearModal(){ closeOverlay('clear-modal'); }

$('clear-modal-backdrop').addEventListener('click', hideClearModal);
$('clear-cancel-btn').addEventListener('click', ()=>{ playClick(); hideClearModal(); });
$('export-child-btn').addEventListener('click', ()=>{ playClick(); exportChildData(); });

$('import-conflict-backdrop').addEventListener('click', hideImportConflictModal);
$('import-conflict-cancel-btn').addEventListener('click', ()=>{ playClick(); hideImportConflictModal(); });

$('import-replace-btn').addEventListener('click', ()=>{
  if(!pendingImport) return;
  playClick();
  const {child, progress, house, conflictChildId} = pendingImport;
  const existing = children.find(c => c.id === conflictChildId);
  if(existing){ existing.emoji = child.emoji || existing.emoji; saveChildren(); }
  try{ localStorage.setItem('p1quiz_progress_'+conflictChildId, JSON.stringify(progress||{})); }catch(e){}
  if(house) try{ localStorage.setItem('p1quiz_house_'+conflictChildId, JSON.stringify(house)); }catch(e){}
  hideImportConflictModal();
  renderChildSelect();
  showToast('✅','อัปเดตข้อมูลของ '+(existing ? existing.name : child.name)+' แล้ว!');
});

$('import-rename-btn').addEventListener('click', ()=>{
  playClick();
  $('import-replace-btn').hidden = true;
  $('import-rename-btn').hidden = true;
  $('import-rename-form').hidden = false;
  $('import-rename-confirm-btn').hidden = false;
  $('import-rename-input').focus();
  $('import-rename-input').select();
});

$('import-rename-confirm-btn').addEventListener('click', ()=>{
  if(!pendingImport) return;
  const newName = $('import-rename-input').value.trim();
  if(!newName){ showToast('⚠️','ใส่ชื่อก่อนนะ'); return; }
  if(children.some(c => c.name.toLowerCase() === newName.toLowerCase())){
    showToast('⚠️','ชื่อ "'+newName+'" มีอยู่แล้ว ลองเปลี่ยนชื่อใหม่ดูสิ'); return;
  }
  playClick();
  const {child, progress, house} = pendingImport;
  const newId = 'child_'+Date.now();
  children.push({id:newId, name:newName, emoji:child.emoji||'🧒', age:child.age, birthDate:child.birthDate});
  saveChildren();
  if(progress) try{ localStorage.setItem('p1quiz_progress_'+newId, JSON.stringify(progress)); }catch(e){}
  if(house) try{ localStorage.setItem('p1quiz_house_'+newId, JSON.stringify(house)); }catch(e){}
  hideImportConflictModal();
  renderChildSelect();
  showToast('📥','นำเข้าข้อมูลเป็น "'+newName+'" เรียบร้อย! 🎉');
});

$('import-rename-input').addEventListener('keydown', e=>{ if(e.key==='Enter') $('import-rename-confirm-btn').click(); });

$('reset-progress-btn').addEventListener('click', ()=>{
  hideClearModal(); playClick();
  const label = activeChild ? activeChild.name+': ' : '';
  showModal('🔄','รีเซ็ตคะแนน / ดาว?',
    label+'ดาวและคะแนนทั้งหมดจะถูกรีเซ็ต แต่ยังคงชื่อเด็กไว้',
    'รีเซ็ตเลย 🔄',
    ()=>{
      if(activeChild){
        localStorage.removeItem(progressKey());
      } else {
        Object.keys(localStorage).filter(k=>k.startsWith('p1quiz_progress_')).forEach(k=>localStorage.removeItem(k));
      }
      location.reload();
    }
  );
});

$('delete-child-btn').addEventListener('click', ()=>{
  hideClearModal(); playClick();
  if(!activeChild){
    showModal('🗑️','ล้างข้อมูลทั้งหมด?',
      'ข้อมูลเด็กและดาวทั้งหมดจะถูกลบออก ไม่สามารถกู้คืนได้',
      'ล้างทั้งหมด 🗑️',
      ()=>{ Object.keys(localStorage).filter(k=>k.startsWith('p1quiz_')).forEach(k=>localStorage.removeItem(k)); location.reload(); }
    );
    return;
  }
  const name = activeChild.name;
  showModal('🗑️','ลบ '+name+' ออก?',
    'ข้อมูลชื่อและดาวของ '+name+' จะถูกลบออกทั้งหมด',
    'ลบเด็กออก 🗑️',
    ()=>{
      localStorage.removeItem(progressKey());
      try{ localStorage.removeItem('p1quiz_house_'+activeChild.id); }catch(e){}
      children = children.filter(c=>c.id!==activeChild.id);
      saveChildren();
      try{ localStorage.removeItem('p1quiz_active_child'); }catch(e){}
      location.reload();
    }
  );
});

$('clear-btn').addEventListener('click', ()=>{ playClick(); showClearModal(); });

/* ---------- ปุ่มโหลดเวอร์ชันใหม่ (มีเฉพาะหน้าเลือกเด็ก) ----------
   ปัญหา: แอปที่ Add to Home Screen บน iPad/iPhone เปิดแบบ standalone และโปรเจคนี้ไม่มี service worker
   iOS จึงเสิร์ฟ index.html จาก HTTP cache เดิม เปิดแอปกี่ครั้งก็ยังได้ของเก่าทั้งที่ deploy ใหม่ไปแล้ว
   (ไฟล์ js/css ไม่ใช่ปัญหา เพราะมี ?v= อยู่แล้ว แต่ตัว index.html ที่ชี้ ?v= ใหม่ต่างหากที่ค้าง)
   location.reload() ไม่พอ — ยังหยิบจาก cache เดิมได้ ต้องทำให้ URL "ต่างจากเดิม" เพื่อบังคับ fetch จริง
   ใช้ location.replace เพื่อไม่ให้ปุ่ม back ของเบราว์เซอร์ย้อนกลับมาหน้าเก่าที่ค้าง cache
   ข้อมูลเด็กอยู่ใน localStorage ไม่หายจากการรีโหลด */
async function hardReloadApp(){
  try{
    /* เผื่ออนาคตมี service worker/Cache Storage — เคลียร์ทิ้งก่อน (ตอนนี้ยังไม่มี ไม่มีผลอะไร) */
    if(window.caches && caches.keys){
      const keys = await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
  }catch(e){}
  const base = location.href.split('#')[0].split('?')[0];
  location.replace(base + '?r=' + Date.now());
}
$('reload-btn').addEventListener('click', ()=>{
  playClick();
  showToast('\u{1F504}','กำลังโหลดเวอร์ชันใหม่…');
  setTimeout(hardReloadApp, 350);   /* ให้ toast โผล่ทันก่อนหน้าเปลี่ยน */
});

/* ============================= EDIT EMOJI (สำหรับเด็กที่มีชื่อแล้ว อยากเปลี่ยน avatar)
   เปิดได้ 2 ทาง: ปุ่ม ✏️ คู่กับชื่อเด็กใน header (แก้ activeChild) และปุ่ม ✏️ คู่กับการ์ดเด็กแต่ละคน
   ในหน้าเลือกโปรไฟล์ (แก้เด็กคนไหนก็ได้ ไม่ต้อง select เข้าไปก่อน) — ใช้ editingChildId เก็บว่ากำลังแก้ใคร ============================= */
let editEmojiSelected = null;
let editingChildId = null;
function initEditEmojiPicker(currentEmoji){
  editEmojiSelected = currentEmoji;
  const picker = $('edit-emoji-picker');
  picker.innerHTML = '';
  CHILD_AVATARS.forEach(em=>{
    const btn = document.createElement('button');
    btn.className = 'emo-btn'+(em===editEmojiSelected?' selected':'');
    btn.textContent = em;
    btn.type = 'button';
    btn.addEventListener('click', ()=>{
      editEmojiSelected = em;
      picker.querySelectorAll('.emo-btn').forEach(b=>b.classList.toggle('selected', b.textContent===em));
      playClick();
    });
    picker.appendChild(btn);
  });
}
let editDobSelected = null;
function openEditEmojiModal(childId){
  const child = children.find(c=>c.id===childId);
  if(!child) return;
  editingChildId = childId;
  initEditEmojiPicker(child.emoji);
  $('edit-name-input').value = child.name;
  editDobSelected = child.birthDate ? strToDob(child.birthDate) : null;
  buildDobPicker($('edit-dob-picker'), editDobSelected, dob=>{ editDobSelected = dob; });
  openOverlay('edit-emoji-modal');
}
$('header-edit-emoji-btn').addEventListener('click', ()=>{
  playClick();
  if(activeChild) openEditEmojiModal(activeChild.id);
});
$('edit-emoji-cancel-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('edit-emoji-modal'); });
$('edit-emoji-modal-backdrop').addEventListener('click', ()=> closeOverlay('edit-emoji-modal'));
$('edit-emoji-save-btn').addEventListener('click', ()=>{
  playClick();
  const rec = children.find(c=>c.id===editingChildId);
  if(rec && editEmojiSelected){
    /* แก้ชื่อได้ด้วย — กติกาเดียวกับตอนสร้าง: ห้ามว่าง ห้ามซ้ำกับเด็กคนอื่น (ไม่สนตัวพิมพ์เล็ก/ใหญ่) */
    const newName = $('edit-name-input').value.trim();
    if(!newName){ showToast('✏️','ใส่ชื่อก่อนนะ'); $('edit-name-input').focus(); return; }
    if(children.some(c=>c.id!==editingChildId && c.name.toLowerCase()===newName.toLowerCase())){
      showToast('🚫','ชื่อนี้มีอยู่แล้ว ใช้ชื่ออื่นนะ');
      $('edit-name-input').focus();
      return;
    }
    if(!editDobSelected){ showToast('🎂','เลือกวันเกิดให้ครบด้วยนะ'); return; }
    rec.emoji = editEmojiSelected;
    rec.name = newName;
    rec.birthDate = dobToStr(editDobSelected);
    delete rec.age;
    rec.grade = resolveGradeForChild(rec);
    if(activeChild && activeChild.id===editingChildId){
      activeChild.emoji = editEmojiSelected; activeChild.name = newName;
      activeChild.birthDate = rec.birthDate; delete activeChild.age; activeChild.grade = rec.grade;
      selectedGrade = resolveGradeForChild(activeChild);
    }
    saveChildren();
    updateHeaderChild();
    renderHome();
    if(!$('child-select-view').hidden) renderChildSelect();
    showToast('✅','บันทึกโปรไฟล์แล้วจ้า!');
  }
  closeOverlay('edit-emoji-modal');
});

/* ============================= BUY ME A MILK ============================= */
$('install-toggle').addEventListener('click', ()=>{ playClick(); openOverlay('install-modal'); });
$('install-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('install-modal'); });
$('install-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('install-modal'); });
$('bmm-btn').addEventListener('click', ()=>{ playClick(); openOverlay('qr-modal'); });
fetch('version').then(r=>r.text()).then(t=>{ $('app-version').textContent = t.trim(); }).catch(()=>{});
$('qr-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('qr-modal'); });
$('qr-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('qr-modal'); });

/* ============================= CHANGELOG MODAL ============================= */
/* parse ไฟล์ changelog (เก็บแค่ version ล่าสุด version เดียว เขียนทับทุก release):
   บรรทัดแรก = เลข version, บรรทัดขึ้นต้น "## " = หัวข้อหมวด, บรรทัดขึ้นต้น "- " = รายการย่อยในหมวดล่าสุด */
function parseChangelog(text){
  const lines = text.split('\n').map(l=>l.trim()).filter(l=>l.length);
  if(!lines.length) return null;
  const version = lines[0];
  const categories = [];
  let current = null;
  for(let i=1;i<lines.length;i++){
    const line = lines[i];
    if(line.startsWith('## ')){
      current = {title:line.slice(3), items:[]};
      categories.push(current);
    } else if(line.startsWith('- ') && current){
      current.items.push(line.slice(2));
    }
  }
  return {version, categories};
}
function renderChangelogBody(data){
  const body = $('changelog-body');
  if(!data || !data.categories.length){
    body.innerHTML = '<p>ยังไม่มีข้อมูลอัปเดตนะ</p>';
    return;
  }
  body.innerHTML = `<div class="changelog-version">${data.version}</div>` +
    data.categories.map(cat=>
      `<div class="changelog-cat">${cat.title}</div><ul class="changelog-list">${cat.items.map(it=>`<li>${it}</li>`).join('')}</ul>`
    ).join('');
}
$('changelog-open-btn').addEventListener('click', ()=>{
  playClick();
  fetch('changelog').then(r=>r.text()).then(text=> renderChangelogBody(parseChangelog(text)))
    .catch(()=>{ $('changelog-body').innerHTML = '<p>โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้งนะ</p>'; });
  openOverlay('changelog-modal');
});
$('changelog-x-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('changelog-modal'); });
$('changelog-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('changelog-modal'); });
$('changelog-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('changelog-modal'); });

/* ============================= DAY / NIGHT THEME ============================= */
const bgDecorEl = $('bg-decor');
function refreshThemeBtn(){
  const night = isNightMode();
  themeBtn.innerHTML = night ? SVG_SUN : SVG_MOON;
  themeBtn.dataset.tooltip = night ? 'โหมดกลางวัน' : 'โหมดกลางคืน';
  themeBtn.setAttribute('aria-label', night ? 'สลับเป็นโหมดกลางวัน' : 'สลับเป็นโหมดกลางคืน');
}
const themeBtn = $('theme-toggle');
let nightMode = false;
try{ nightMode = localStorage.getItem('p1quiz_theme') === 'night'; }catch(e){}
setTheme(nightMode, false);
themeBtn.addEventListener('click', ()=>{ playClick(); setTheme(!isNightMode(), true); });

/* ============================= FLOATING BG BALLOONS / STARS ============================= */
const BALLOON_COLORS = ['#FF6B6B','#FF9F43','#FFD93D','#6BCB77','#4D96FF','#9B7DE0','#FF6FB5'];
const STAR_COLORS = ['#FFF7D6','#FFE9A8','#CDE7FF','#FFFFFF','#B9D6FF'];
function spawnFloater(){
  const el = document.createElement('span');
  el.className = 'bg-floater';
  if(isNightMode()){
    const color = STAR_COLORS[Math.floor(Math.random()*STAR_COLORS.length)];
    el.innerHTML = `<svg viewBox="0 0 24 24" width="1em" height="1em">
      <polygon points="12,1 14.7,8.8 23,9.1 16.4,14.2 18.7,22.3 12,17.6 5.3,22.3 7.6,14.2 1,9.1 9.3,8.8" fill="${color}" stroke="rgba(255,255,255,.5)" stroke-width=".4"/>
    </svg>`;
  } else {
    const color = BALLOON_COLORS[Math.floor(Math.random()*BALLOON_COLORS.length)];
    el.innerHTML = `<svg viewBox="0 0 24 34" width="1em" height="1.4em">
      <ellipse cx="12" cy="13" rx="10" ry="12" fill="${color}"/>
      <ellipse cx="8.3" cy="7.5" rx="3.1" ry="4.2" fill="#fff" opacity=".38"/>
      <ellipse cx="12" cy="13" rx="10" ry="12" fill="none" stroke="rgba(0,0,0,.08)" stroke-width=".6"/>
      <polygon points="9.4,24 14.6,24 12,27.8" fill="${color}"/>
      <path d="M12 27.8 Q10.2 30.8 12 34" stroke="#8A7B6C" stroke-width="1" fill="none" stroke-linecap="round"/>
    </svg>`;
  }
  const isLarge = Math.random() < 0.25;
  const size = isLarge ? (46 + Math.random()*26)   // 46-72px, ~25% of spawns
                        : (14 + Math.random()*18); // 14-32px, ~75% of spawns
  const dur  = 9  + Math.random()*8;
  const left = 2  + Math.random()*92;
  const rot  = (Math.random()-0.5)*50;
  const sc   = 0.85 + Math.random()*0.3;
  el.style.cssText = `font-size:${size}px;left:${left}vw;bottom:-60px;animation-duration:${dur}s;--rot:${rot}deg;--sc:${sc};`;
  bgDecorEl.appendChild(el);
  setTimeout(()=>el.remove(), dur*1000+500);
}
for(let i=0;i<10;i++) setTimeout(spawnFloater, i*700);
setInterval(spawnFloater, 1100);

/* ============================= FLOATING CLOUDS (upper half) ============================= */
const CLOUD_SHAPES = [
  `<ellipse cx="34" cy="46" rx="30" ry="21"/>
   <ellipse cx="64" cy="30" rx="34" ry="27"/>
   <ellipse cx="93" cy="46" rx="25" ry="19"/>
   <ellipse cx="60" cy="53" rx="50" ry="17"/>`,
  `<ellipse cx="26" cy="42" rx="22" ry="16"/>
   <ellipse cx="50" cy="24" rx="26" ry="21"/>
   <ellipse cx="78" cy="34" rx="22" ry="18"/>
   <ellipse cx="98" cy="46" rx="18" ry="14"/>
   <ellipse cx="55" cy="50" rx="48" ry="15"/>`,
  `<ellipse cx="30" cy="38" rx="20" ry="19"/>
   <ellipse cx="58" cy="22" rx="24" ry="20"/>
   <ellipse cx="88" cy="40" rx="21" ry="18"/>
   <ellipse cx="60" cy="48" rx="45" ry="14"/>`,
  `<ellipse cx="22" cy="48" rx="18" ry="13"/>
   <ellipse cx="45" cy="34" rx="22" ry="18"/>
   <ellipse cx="70" cy="26" rx="26" ry="22"/>
   <ellipse cx="97" cy="42" rx="20" ry="16"/>
   <ellipse cx="58" cy="55" rx="52" ry="15"/>`
];
function spawnCloud(){
  const el = document.createElement('span');
  el.className = 'bg-cloud';
  const color = isNightMode() ? '#AAB9E8' : '#fff';
  const shape = CLOUD_SHAPES[Math.floor(Math.random()*CLOUD_SHAPES.length)];
  el.innerHTML = `<svg viewBox="0 0 120 70" width="100%" height="100%">
    <g fill="${color}">${shape}</g>
  </svg>`;
  const size = 60 + Math.random()*90;
  const dur  = 24 + Math.random()*20;
  const top  = 6 + Math.random()*40;
  const ltr  = Math.random() < 0.5;
  el.style.cssText = ltr
    ? `width:${size}px;height:${size*0.58}px;top:${top}vh;left:-25vw;animation:driftRightward ${dur}s linear forwards;`
    : `width:${size}px;height:${size*0.58}px;top:${top}vh;left:115vw;animation:driftLeftward ${dur}s linear forwards;`;
  bgDecorEl.appendChild(el);
  setTimeout(()=>el.remove(), dur*1000+500);
}
for(let i=0;i<4;i++) setTimeout(spawnCloud, i*2500);
setInterval(spawnCloud, 7000);

/* ============================= TWINKLING SPARKLES ============================= */
for(let i=0;i<22;i++){
  const el = document.createElement('span');
  el.className = 'bg-twinkle';
  const size = 2 + Math.random()*3;
  const top  = Math.random()*55;
  const left = Math.random()*100;
  const dur  = 2.5 + Math.random()*3;
  const delay = Math.random()*5;
  el.style.cssText = `width:${size}px;height:${size}px;top:${top}vh;left:${left}vw;animation-duration:${dur}s;animation-delay:-${delay}s;`;
  bgDecorEl.appendChild(el);
}

/* ============================= CLICK STAR SPARK ============================= */
(function(){
  const COLORS = ['#FFD700','#FF8C42','#FF6B9D','#A78BFA','#34D399','#60A5FA','#FBBF24'];
  const RAYS = 8;
  document.addEventListener('click', e=>{
    const wrap = document.createElement('div');
    wrap.className = 'click-spark';
    wrap.style.left = e.clientX+'px';
    wrap.style.top  = e.clientY+'px';
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    for(let i=0;i<RAYS;i++){
      const ray = document.createElement('div');
      ray.className = 'click-spark-ray';
      ray.style.setProperty('--a', (i*360/RAYS)+'deg');
      ray.style.background = color;
      ray.style.animationDelay = (i*18)+'ms';
      wrap.appendChild(ray);
    }
    document.body.appendChild(wrap);
    setTimeout(()=>wrap.remove(), 700);
  });
})();


/* ============================= INIT ============================= */
loadChildren();
renderChildSelect();
