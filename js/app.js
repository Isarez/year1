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
function totalStarsForChild(childId){
  try{
    const p = JSON.parse(localStorage.getItem('p1quiz_progress_'+childId) || '{}');
    return Object.values(p).reduce((s,v)=>s+(v&&v.stars||0), 0);
  }catch(e){ return 0; }
}

function selectChild(id){
  activeChild = children.find(c=>c.id===id) || null;
  if(activeChild){
    try{ localStorage.setItem('p1quiz_active_child', id); }catch(e){}
    loadProgressForChild();
    enterHome();
  }
}

/* ห้ามใช้ชื่อซ้ำกับเด็กที่มีอยู่แล้วใน localStorage (ไม่สนตัวพิมพ์เล็ก/ใหญ่) — ถ้าซ้ำ แจ้งเตือนให้เปลี่ยนชื่อใหม่ และไม่บันทึกลง storage เลย */
function addChild(name){
  name = name.trim();
  if(!name) return;
  if(children.some(c=>c.name.toLowerCase()===name.toLowerCase())){
    showToast('⚠️','ชื่อ "'+name+'" มีอยู่แล้วนะ ลองเปลี่ยนชื่อใหม่ดูสิ');
    const input = document.getElementById('child-name-input');
    if(input){ input.focus(); input.select(); }
    return;
  }
  const id = 'child_'+Date.now();
  const emoji = selectedEmoji;
  children.push({id, name, emoji});
  saveChildren();
  activeChild = {id, name, emoji};
  try{ localStorage.setItem('p1quiz_active_child', id); }catch(e){}
  progress = {};
  enterHome();
}

function enterHome(){
  $('child-select-view').hidden = true;
  $('owl-widget').hidden = false;
  $('clear-btn').hidden = false;
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
    $('brand-sub').textContent = 'สวัสดี '+activeChild.name+' 👋';
  } else {
    chipGroup.hidden = true;
    $('brand-sub').textContent = 'เก็บสติกเกอร์ให้ครบทุกหมวด!';
  }
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
      const stars = totalStarsForChild(child.id);
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
      const cstars = document.createElement('div');
      cstars.className = 'cstars';
      cstars.textContent = stars ? '⭐'.repeat(Math.min(stars,12)) : 'ยังไม่เคยทำ ✨';
      cinfo.appendChild(cname);
      cinfo.appendChild(cstars);
      const arrow = document.createElement('span');
      arrow.style.cssText = 'font-size:20px;color:var(--ink-soft)';
      arrow.textContent = '▶';
      card.appendChild(avSpan);
      card.appendChild(cinfo);
      card.appendChild(arrow);
      card.addEventListener('click', ()=>{ playClick(); selectChild(child.id); });
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
    addNewBtn.hidden = false;
  }
  $('child-name-input').value = '';
  selectedEmoji = CHILD_AVATARS[0];
  initEmojiPicker();
  $('child-select-view').hidden = false;
  $('clear-btn').hidden = true;
  homeView.hidden = true;
  $('owl-widget').hidden = true;
  $('free-piano-btn').hidden = true;
}

/* child-select submit */
function handleChildSubmit(){
  const input = document.getElementById('child-name-input');
  const name = input.value.trim();
  if(!name){ input.focus(); return; }
  playClick();
  addChild(name);
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
  document.getElementById('child-submit-btn').addEventListener('click', handleChildSubmit);
  document.getElementById('child-name-input').addEventListener('keydown', e=>{ if(e.key==='Enter') handleChildSubmit(); });
  document.getElementById('child-add-new-btn').addEventListener('click', ()=>{
    playClick();
    selectedEmoji = CHILD_AVATARS[0];
    document.getElementById('child-name-input').value = '';
    document.getElementById('child-add-new-btn').hidden = true;
    document.getElementById('child-add-form').hidden = false;
    initEmojiPicker();
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
function playCorrect(){ playTone(523.25,.15,'sine',0,.14); playTone(659.25,.18,'sine',.12,.14); playTone(783.99,.24,'sine',.24,.14); }
function playWrong(){ playTone(190,.28,'sawtooth',0,.07); }
function playWin(){ playTone(523.25,.14,'sine',0,.13); playTone(659.25,.14,'sine',.13,.13); playTone(783.99,.14,'sine',.26,.13); playTone(1046.5,.3,'sine',.39,.15); }
function playClick(){ playTone(659.25,.08,'sine',0,.12); playTone(1318.5,.05,'sine',0,.04); }
/* แฟนแฟร์แสดงความยินดีตอนจบเกม (จังหวะเดียวกับพลุ) — โทน C major เดียวกับ playCorrect */
function playCongrats(){
  playTone(523.25,.16,'sine',0,.13);
  playTone(659.25,.16,'sine',.14,.13);
  playTone(783.99,.16,'sine',.28,.13);
  playTone(1046.5,.22,'sine',.42,.15);
  playTone(1318.5,.55,'sine',.64,.11);
  playTone(1046.5,.55,'sine',.64,.10);
  playTone(783.99,.55,'sine',.64,.08);
}

/* ============================= BACKGROUND MUSIC ============================= */
let musicOn = true;
try{ musicOn = localStorage.getItem('p1quiz_music') !== 'off'; }catch(e){}
let musicGain=null, musicSchedulerId=null, musicNoteIndex=0, musicNextTime=0, musicTrackIdx=0;
/* เพลงพื้นหลัง 5 เพลง (C major ทั้งหมด — โทนเดียวกับ playCorrect) เล่นวนต่อกันเป็น playlist */
const MUSIC_TRACKS = [
{ bpm:128, notes:[ /* เพลง 1 — เพลงโรงเรียนสนุกๆ (เพลงเดิม) */
  [523.25,.5],[659.25,.5],[783.99,.5],[659.25,.5],
  [880.00,.5],[783.99,.25],[659.25,.25],[523.25,1],
  [587.33,.25],[659.25,.25],[587.33,.25],[523.25,.25],
  [659.25,.5],[783.99,.5],[659.25,.75],[null,.25],
  [523.25,.25],[523.25,.25],[659.25,.25],[783.99,.25],
  [880.00,.5],[783.99,.25],[659.25,.25],
  [783.99,.5],[659.25,.25],[523.25,.25],[587.33,.5],[null,.5],
  [880.00,.5],[783.99,.5],[659.25,.5],[587.33,.5],
  [523.25,.5],[659.25,.25],[523.25,.25],[392.00,.5],[null,.5],
  [523.25,.25],[659.25,.25],[523.25,.25],[783.99,.25],
  [659.25,.5],[523.25,.25],[659.25,.25],[880.00,.75],[null,.25],
  [1046.5,.25],[880.00,.25],[783.99,.25],[659.25,.25],
  [523.25,.5],[659.25,.5],[783.99,.5],[659.25,.5],
  [523.25,.25],[659.25,.25],[783.99,.25],[880.00,.25],
  [783.99,.5],[659.25,.25],[523.25,.25],[587.33,.5],[659.25,.5],
  [523.25,.5],[659.25,.5],[783.99,.5],[523.25,.5],
  [523.25,1.5],[null,.5]
]},
{ bpm:112, notes:[ /* เพลง 2 — แมวเหมียวเดินเล่น (นุ่มๆ ก้าวช้าๆ) */
  [659.25,.5],[783.99,.5],[880.00,.5],[783.99,.5],
  [659.25,.5],[587.33,.5],[523.25,1],
  [587.33,.5],[659.25,.5],[698.46,.5],[659.25,.5],
  [587.33,.5],[523.25,.5],[587.33,1],
  [659.25,.5],[783.99,.5],[880.00,.5],[1046.5,.5],
  [987.77,.5],[880.00,.5],[783.99,1],
  [880.00,.5],[783.99,.5],[659.25,.5],[587.33,.5],
  [523.25,1.5],[null,.5]
]},
{ bpm:132, notes:[ /* เพลง 3 — กระโดดโลดเต้น (จังหวะสนุก dotted) */
  [523.25,.75],[659.25,.25],[783.99,.75],[880.00,.25],
  [1046.5,.5],[880.00,.5],[783.99,1],
  [587.33,.75],[698.46,.25],[880.00,.75],[698.46,.25],
  [659.25,.5],[587.33,.5],[523.25,1],
  [783.99,.75],[880.00,.25],[1046.5,.75],[880.00,.25],
  [783.99,.5],[659.25,.5],[587.33,1],
  [523.25,.25],[587.33,.25],[659.25,.25],[698.46,.25],
  [783.99,.5],[880.00,.5],[1046.5,1],[null,1]
]},
{ bpm:104, notes:[ /* เพลง 4 — ลมเย็นยามเย็น (สงบ ผ่อนคลาย) */
  [783.99,1],[659.25,1],
  [698.46,.5],[659.25,.5],[587.33,1],
  [523.25,.5],[587.33,.5],[659.25,1],
  [587.33,1],[null,.5],[392.00,.5],
  [440.00,.5],[493.88,.5],[523.25,1],
  [659.25,.5],[587.33,.5],[523.25,1],
  [493.88,.5],[440.00,.5],[392.00,1.5],[null,.5],
  [523.25,1],[659.25,1],[783.99,2],[null,1]
]},
{ bpm:120, notes:[ /* เพลง 5 — เดินทางผจญภัย (มาร์ชสดใส) */
  [392.00,.5],[523.25,.5],[659.25,.5],[523.25,.5],
  [392.00,.5],[523.25,.5],[659.25,1],
  [440.00,.5],[587.33,.5],[698.46,.5],[587.33,.5],
  [440.00,.5],[587.33,.5],[698.46,1],
  [783.99,.5],[698.46,.5],[659.25,.5],[587.33,.5],
  [659.25,.25],[698.46,.25],[783.99,.5],[880.00,1],
  [783.99,.5],[659.25,.5],[587.33,.5],[523.25,.5],
  [587.33,.5],[493.88,.5],[523.25,1.5],[null,.5]
]}
];
function ensureMusicGain(){
  ensureAudio();
  if(audioCtx && !musicGain){
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.0001;
    musicGain.connect(audioCtx.destination);
  }
}
function scheduleMusicNote(freq, startTime, dur){
  if(freq==null) return;
  const tail = 0.12;
  const osc = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.exponentialRampToValueAtTime(0.9, startTime+0.06);
  noteGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35+tail);
  osc.connect(noteGain).connect(musicGain);
  osc.start(startTime); osc.stop(startTime+dur+tail);

  const subOsc = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(freq/2, startTime);
  subGain.gain.setValueAtTime(0.0001, startTime);
  subGain.gain.exponentialRampToValueAtTime(0.35, startTime+0.05);
  subGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35+tail);
  subOsc.connect(subGain).connect(musicGain);
  subOsc.start(startTime); subOsc.stop(startTime+dur+tail);
}
function musicScheduler(){
  if(!musicOn || !audioCtx) return;
  while(musicNextTime < audioCtx.currentTime + 1.0){
    const track = MUSIC_TRACKS[musicTrackIdx];
    const beat = 60/track.bpm;
    const [freq, beats] = track.notes[musicNoteIndex];
    const dur = beats*beat;
    scheduleMusicNote(freq, musicNextTime, dur);
    musicNextTime += dur;
    musicNoteIndex++;
    if(musicNoteIndex >= track.notes.length){
      /* จบเพลง — พัก 2 จังหวะแล้วต่อเพลงถัดไปวนเป็น playlist */
      musicNoteIndex = 0;
      musicTrackIdx = (musicTrackIdx+1) % MUSIC_TRACKS.length;
      musicNextTime += beat*2;
    }
  }
}
function startMusic(){
  ensureMusicGain();
  if(!audioCtx) return;
  if(audioCtx.state==='suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(musicGain.gain.value, now);
  musicGain.gain.linearRampToValueAtTime(0.025, now+0.4);
  musicNextTime = now + 0.1;
  musicNoteIndex = 0;
  if(musicSchedulerId) clearInterval(musicSchedulerId);
  musicScheduler();
  musicSchedulerId = setInterval(musicScheduler, 250);
}
function stopMusic(){
  if(musicGain && audioCtx){
    const now = audioCtx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.linearRampToValueAtTime(0.0001, now+0.4);
  }
  if(musicSchedulerId){ clearInterval(musicSchedulerId); musicSchedulerId=null; }
}
function refreshMusicBtn(){ musicBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_MUSIC+'</span><span class="mute-stripe"></span></span>'; musicBtn.classList.toggle('muted', !musicOn); musicBtn.dataset.tooltip = musicOn ? 'ปิดเพลงพื้นหลัง' : 'เปิดเพลงพื้นหลัง'; }

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
const homeView = $('home-view'), quizView = $('quiz-view'), resultView = $('result-view'), arView = $('ar-view'), memoryView = $('memory-view'), listenView = $('listen-view'), shadowView = $('shadow-view'), mixView = $('mix-view'), musicView = $('music-view'), dotsView = $('dots-view');
const mascot = $('mascot');
let lastGameType = 'quiz', lastCatId = null;
let memoryGame = null;

function mascotHappy(){ mascot.classList.remove('oops'); mascot.classList.remove('happy'); void mascot.offsetWidth; mascot.classList.add('happy'); }
function mascotOops(){ mascot.classList.remove('happy'); mascot.classList.remove('oops'); void mascot.offsetWidth; mascot.classList.add('oops'); }

function openOverlay(id){
  const el = $(id);
  el.hidden = false;
  requestAnimationFrame(()=> requestAnimationFrame(()=> el.classList.add('show')));
}
function closeOverlay(id){
  const el = $(id);
  el.classList.remove('show');
  setTimeout(()=>{ el.hidden = true; }, 300);
}

function saveProgress(){
  try{ localStorage.setItem(progressKey(), JSON.stringify(progress)); }catch(e){}
}
function catById(id){ return CATS.find(c=>c.id===id); }
function stickerCount(){ return Object.values(progress).filter(p=>p && p.unlocked).length; }
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
function updateTally(){ $('tally-text').textContent = stickerCount()+'/'+CATS.length; }

/* wire child-select events now that $ is available */
wireChildSelectEvents();
$('switch-child-btn').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  document.body.classList.remove('dots-open');
  homeView.hidden = true; quizView.hidden = true; resultView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true;
  renderChildSelect();
});

/* ============================= HOME RENDER ============================= */
function renderHome(){
  resumeBgMusicAfterMusicGame(); // กลับมาหน้าหลัก = เล่นเพลงพื้นหลังต่อ (เผื่อออกจากเกมดนตรีทางอื่น)
  document.body.classList.remove('music-open');
  document.body.classList.remove('dots-open');
  updateFreePianoBtn();
  const name = activeChild ? activeChild.name : 'นักสู้ตัวน้อย';
  $('hero-greeting').textContent = 'สวัสดีจ้า '+name+'! 🎉';
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
  CATS.forEach(cat=>{
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
    const total = (cat.type==='ar' || cat.type==='skill' || cat.type==='listen' || cat.type==='write') ? cat.levels : cat.questions.length;
    card.innerHTML =
      (cat.isNew ? '<div class="cat-new-badge">NEW ✨</div>' : '')+
      (cat.cardTag ? '<div class="cat-card-tag">'+cat.cardTag+'</div>' : '')+
      '<div class="cat-sticker'+(unlocked?' unlocked':'')+'">'+(unlocked?(cat.icon?'<img src="'+cat.icon+'" class="cat-sticker-icon" alt="">':cat.emoji):'🔒')+'</div>'+
      '<div class="cat-emoji">'+(locked?'🔒':(cat.icon?'<img src="'+cat.icon+'" class="cat-icon-img" alt="'+cat.name+'">':cat.emoji))+'</div>'+
      '<div class="cat-name">'+cat.name+'</div>'+
      '<div class="cat-meta">'+(cat.type==='ar' ? total+' ด่าน 🖐️' : cat.type==='skill' ? total+' ด่าน 🧠' : cat.type==='listen' ? total+' ด่าน 🎧' : cat.type==='write' ? total+' ด่าน ✍️' : total+' ข้อ')+'</div>'+
      (isLocked
        ? '<div class="cat-lock-msg">🔐 ผ่าน '+catById(reqId).name+' ก่อนนะ</div>'
        : isDeviceLocked
          ? '<div class="cat-lock-msg">🖥️ เล่นได้บนแท็บเล็ต/คอมพิวเตอร์เท่านั้นนะ</div>'
          : (p ? '<div class="cat-progress">ทำแล้ว '+p.best+'/'+total+' '+'⭐'.repeat(p.stars)+'</div>'
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
      else if(cat.type==='skill') startMemoryGame(cat.id);
      else if(cat.type==='listen') startListenGame(cat.id);
      else if(cat.type==='write') startDotsGame(cat.id);
      else startQuiz(cat.id);
    });
    (cat.type==='skill' ? gridSkill : (cat.type==='ar' ? gridInteractive : (cat.type==='listen' ? gridListen : (cat.type==='write' ? gridWrite : grid)))).appendChild(card);
  });
  updateTally();
}

/* ============================= QUIZ FLOW ============================= */
function shuffleChoices(q){
  const idxs = q.choices.map((_,i)=>i);
  for(let i=idxs.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [idxs[i],idxs[j]] = [idxs[j],idxs[i]];
  }
  return { ...q, choices: idxs.map(i=>q.choices[i]), correct: idxs.indexOf(q.correct) };
}

function startQuiz(catId){
  stopARGame();
  lastGameType = 'quiz'; lastCatId = catId;
  const cat = catById(catId);
  state = { catId:catId, qIndex:0, score:0, wrong:[], answered:false, questions: cat.questions.map(shuffleChoices) };
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = false; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  quizView.querySelectorAll('.progress-fill, .next-btn').forEach(el=>{ el.style.setProperty('--cat-color', cat.color); });
  setCatLabel('quiz-cat-label', cat);
  renderQuestion();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

function renderQuestion(){
  const cat = catById(state.catId);
  const total = state.questions.length;
  const q = state.questions[state.qIndex];
  state.answered = false;

  $('q-counter').textContent = (state.qIndex+1)+'/'+total;
  $('progress-fill').style.width = ((state.qIndex)/total*100)+'%';
  $('progress-fill').style.background = cat.color;

  if(q.img){
    $('q-emoji').innerHTML = '<img src="'+q.img+'" alt="" style="max-width:100%;border-radius:12px;display:block;margin:0 auto;">';
  } else {
    $('q-emoji').textContent = q.emoji||'';
  }
  $('q-text').textContent = q.q;

  const grid = $('choice-grid');
  grid.innerHTML = '';
  q.choices.forEach((choiceText, idx)=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.style.setProperty('--cat-light', cat.light);
    btn.textContent = choiceText;
    btn.addEventListener('click', ()=> selectAnswer(idx, btn, cat, q));
    grid.appendChild(btn);
  });

  const fb = $('feedback');
  fb.className = 'feedback';
  $('fb-text').textContent = '';
  $('fb-face').textContent = '';

  const nb = $('next-btn');
  nb.className = 'next-btn';
  nb.style.setProperty('--cat-color', cat.color);
  nb.textContent = (state.qIndex === total-1) ? 'ดูผลคะแนน 🎉' : 'ข้อต่อไป ➜';
}

function selectAnswer(idx, btnEl, cat, q){
  if(state.answered) return;
  state.answered = true;
  const isCorrect = idx === q.correct;
  const buttons = Array.from($('choice-grid').children);

  buttons.forEach((b,i)=>{
    b.disabled = true;
    if(i === q.correct) b.classList.add('correct');
    if(i === idx && !isCorrect) b.classList.add('wrong');
    if(i !== idx && i !== q.correct) b.classList.add('dim');
  });

  const fb = $('feedback');
  if(isCorrect){
    state.score++;
    fb.classList.add('ok');
    $('fb-face').textContent = '🎉';
    $('fb-text').textContent = 'เก่งมาก! '+q.explain;
    playCorrect();
    mascotHappy();
    burstFromElement(btnEl, 34);
    showOwlMsg('correct');
  } else {
    state.wrong.push({q:q.q, correctText:q.choices[q.correct], explain:q.explain});
    fb.classList.add('ng');
    $('fb-face').textContent = '💪';
    $('fb-text').textContent = 'ไม่เป็นไรนะ! '+q.explain;
    playWrong();
    mascotOops();
    showOwlMsg('wrong');
  }
  requestAnimationFrame(()=> fb.classList.add('show'));
  requestAnimationFrame(()=> $('next-btn').classList.add('show'));
}

$('next-btn').addEventListener('click', ()=>{
  playClick();
  if(state.qIndex < state.questions.length-1){
    state.qIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz(){
  const cat = catById(state.catId);
  const total = state.questions.length;
  const pct = state.score/total;
  const stars = pct>=0.9 ? 3 : (pct>=0.6 ? 2 : 1);

  quizView.hidden = true; resultView.hidden = false;

  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  const bestScore = prev ? Math.max(prev.best, state.score) : state.score;
  progress[cat.id] = { best:bestScore, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){
    const s = document.createElement('span');
    s.textContent = '⭐';
    starsRow.appendChild(s);
  }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });

  $('score-line').textContent = 'ทำถูก '+state.score+'/'+total+' ข้อ';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไปเลย ทำได้เกือบครบทุกข้อ!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(state.score === total){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }

  const reviewWrap = $('review-wrap');
  const reviewList = $('review-list');
  reviewList.innerHTML = '';
  if(state.wrong.length===0){
    reviewWrap.hidden = true;
  } else {
    reviewWrap.hidden = false;
    state.wrong.forEach(w=>{
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = '<div class="rq">'+w.q+'</div><div class="ra">✅ เฉลย: '+w.correctText+'</div><div class="re">'+w.explain+'</div>';
      reviewList.appendChild(item);
    });
  }

  window.scrollTo({top:0, behavior:'smooth'});
}

$('retry-btn').addEventListener('click', ()=>{
  playClick();
  if(lastGameType==='ar'){ startARGame(lastCatId); }
  else if(lastGameType==='memory'){ startMemoryGame(lastCatId); }
  else if(lastGameType==='listen'){ startListenGame(lastCatId); }
  else if(lastGameType==='shadow'){ startShadowGame(lastCatId); }
  else if(lastGameType==='mix'){ startMixGame(lastCatId); }
  else if(lastGameType==='music'){ startMusicGame(lastCatId); }
  else if(lastGameType==='dots'){ startDotsGame(lastCatId); }
  else { startQuiz(state.catId); }
});
$('home-btn').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
  showOwlMsg('home');
  if(pendingSticker){
    const catId = pendingSticker;
    pendingSticker = null;
    setTimeout(()=>openStickerBook(catId), 350);
  }
});
$('quiz-back').addEventListener('click', ()=>{
  playClick();
  quizView.hidden = true; resultView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= MEMORY MATCHING GAME (จับคู่โดมิโน) ============================= */
function startMemoryGame(catId){
  stopARGame();
  lastGameType = 'memory'; lastCatId = catId;
  const cat = catById(catId);
  memoryGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, matchedCount:0, totalPairs:0, openNumber:null, openDot:null, locked:false };
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = false; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  memoryView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('memory-cat-label', cat);
  $('memory-hint').textContent = cat.mode==='animals'
    ? '🐾 แตะการ์ดรูปสัตว์ 1 ใบ แล้วแตะการ์ดคำ 1 ใบ ให้ตรงกันนะ!'
    : '🎲 แตะการ์ดตัวเลข 1 ใบ แล้วแตะการ์ดโดมิโน 1 ใบ ให้ค่าตรงกันนะ!';
  renderMemoryLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

/* รูปแบบจุดโดมิโน (0-6 จุดต่อครึ่งการ์ด) วางตำแหน่งแบบเดียวกับลูกเต๋า/โดมิโนจริง */
const DOMINO_PIPS = {
  0:[], 1:['c'], 2:['tl','br'], 3:['tl','c','br'],
  4:['tl','tr','bl','br'], 5:['tl','tr','c','bl','br'], 6:['tl','ml','bl','tr','mr','br']
};
function dominoHalfHtml(n){
  return '<div class="domino-half">'+DOMINO_PIPS[n].map(p=>'<span class="domino-pip pip-'+p+'"></span>').join('')+'</div>';
}
function dominoCardHtml(value){
  const top = Math.ceil(value/2);
  const bottom = value - top;
  return '<div class="domino-card">'+dominoHalfHtml(top)+'<div class="domino-divider"></div>'+dominoHalfHtml(bottom)+'</div>';
}

function renderAnimalCards(pairCount){
  const pairs = shuffleArray(ANIMAL_MATCH_PAIRS.slice()).slice(0, pairCount);
  const animalOrder = shuffleArray(pairs.map((_,i)=>i));
  const wordOrder   = shuffleArray(pairs.map((_,i)=>i));
  const animalCol = $('memory-col-dots');
  const wordCol   = $('memory-col-numbers');
  animalCol.innerHTML = '';
  wordCol.innerHTML   = '';

  const pawIcon = '<svg class="memory-card-icon-svg" viewBox="0 0 32 32">'+
    '<ellipse cx="16" cy="22" rx="6.5" ry="4.5"/>'+
    '<ellipse cx="6.5" cy="15" rx="2.8" ry="3.5" transform="rotate(-15 6.5 15)"/>'+
    '<ellipse cx="11" cy="10" rx="2.8" ry="3.5"/>'+
    '<ellipse cx="21" cy="10" rx="2.8" ry="3.5"/>'+
    '<ellipse cx="25.5" cy="15" rx="2.8" ry="3.5" transform="rotate(15 25.5 15)"/>'+
  '</svg>';

  animalOrder.forEach(idx=>{
    const card = document.createElement('button');
    card.className = 'memory-card memory-card-dot card-animals-emoji';
    card.dataset.value = idx;
    card.innerHTML =
      '<div class="memory-card-inner">'+
        '<div class="memory-card-face card-face-hidden"><span class="memory-card-icon">'+pawIcon+'</span></div>'+
        '<div class="memory-card-face card-face-value">'+pairs[idx].e+'</div>'+
      '</div>';
    card.addEventListener('click', ()=>flipCard(card, 'dot', idx));
    animalCol.appendChild(card);
  });

  wordOrder.forEach(idx=>{
    const card = document.createElement('button');
    card.className = 'memory-card memory-card-number card-animals-word';
    card.dataset.value = idx;
    card.innerHTML =
      '<div class="memory-card-inner">'+
        '<div class="memory-card-face card-face-hidden"><span class="memory-card-icon">'+pawIcon+'</span></div>'+
        '<div class="memory-card-face card-face-value card-face-word">'+pairs[idx].w+'</div>'+
      '</div>';
    card.addEventListener('click', ()=>flipCard(card, 'number', idx));
    wordCol.appendChild(card);
  });
}

function renderMemoryLevel(){
  const cat = catById(memoryGame.catId);
  const pairCount = MEMORY_LEVEL_PAIRS[memoryGame.level-1];
  memoryGame.totalPairs = pairCount;
  memoryGame.matchedCount = 0;
  memoryGame.openNumber = null;
  memoryGame.openDot = null;
  memoryGame.locked = false;

  if(cat.mode === 'animals'){
    renderAnimalCards(pairCount);
    $('memory-level-counter').textContent = memoryGame.level+'/'+memoryGame.totalLevels;
    $('memory-progress-fill').style.width = '0%';
    return;
  }

  const pool = [1,2,3,4,5,6,7,8,9,10,11,12];
  const values = shuffleArray(pool.slice()).slice(0, pairCount);
  const numberOrder = shuffleArray(values.slice());
  const dotOrder = shuffleArray(values.slice());

  const numCol = $('memory-col-numbers');
  const dotCol = $('memory-col-dots');
  numCol.innerHTML = '';
  dotCol.innerHTML = '';

  /* ไอคอนหลังการ์ดเป็น SVG เดียวกันทั้งการ์ดตัวเลขและการ์ดจุด (ต่างกันแค่สีพื้นหลังผ่าน CSS) */
  const cardBackIcon = '<svg class="memory-card-icon-svg" viewBox="0 0 24 24"><path d="M12 2 L14.9 8.6 L22 9.3 L16.8 14.1 L18.2 21 L12 17.5 L5.8 21 L7.2 14.1 L2 9.3 L9.1 8.6 Z"/></svg>';

  numberOrder.forEach(value=>{
    const card = document.createElement('button');
    card.className = 'memory-card memory-card-number';
    card.dataset.value = value;
    card.innerHTML =
      '<div class="memory-card-inner">'+
        '<div class="memory-card-face card-face-hidden"><span class="memory-card-icon">'+cardBackIcon+'</span></div>'+
        '<div class="memory-card-face card-face-value">'+value+'</div>'+
      '</div>';
    card.addEventListener('click', ()=>flipCard(card, 'number', value));
    numCol.appendChild(card);
  });

  dotOrder.forEach(value=>{
    const card = document.createElement('button');
    card.className = 'memory-card memory-card-dot';
    card.dataset.value = value;
    card.innerHTML =
      '<div class="memory-card-inner">'+
        '<div class="memory-card-face card-face-hidden"><span class="memory-card-icon">'+cardBackIcon+'</span></div>'+
        '<div class="memory-card-face card-face-value">'+dominoCardHtml(value)+'</div>'+
      '</div>';
    card.addEventListener('click', ()=>flipCard(card, 'dot', value));
    dotCol.appendChild(card);
  });

  $('memory-level-counter').textContent = memoryGame.level+'/'+memoryGame.totalLevels;
  $('memory-progress-fill').style.width = '0%';
}

function flipCard(cardEl, side, value){
  if(cardEl.classList.contains('matched')) return;
  /* ถ้ามีคู่ที่ตอบผิดค้างเปิดอยู่ ให้คว่ำคู่เก่าทันทีตอนคลิกการ์ดใบใหม่ แทนการรอ delay */
  if(memoryGame.locked) resetMismatch();
  if(cardEl.classList.contains('flipped')) return;
  if(side==='number' && memoryGame.openNumber) return;
  if(side==='dot' && memoryGame.openDot) return;

  cardEl.classList.add('flipped');
  playClick();
  if(side==='number') memoryGame.openNumber = { el:cardEl, value };
  else memoryGame.openDot = { el:cardEl, value };

  if(memoryGame.openNumber && memoryGame.openDot){
    if(memoryGame.openNumber.value === memoryGame.openDot.value){ matchSuccess(); }
    else { matchMistake(); }
  }
}

function resetMismatch(){
  if(memoryGame.openNumber) memoryGame.openNumber.el.classList.remove('flipped','mismatch');
  if(memoryGame.openDot) memoryGame.openDot.el.classList.remove('flipped','mismatch');
  memoryGame.openNumber = null;
  memoryGame.openDot = null;
  memoryGame.locked = false;
}

function matchSuccess(){
  memoryGame.openNumber.el.classList.add('matched');
  memoryGame.openDot.el.classList.add('matched');
  memoryGame.matchedCount++;
  $('memory-progress-fill').style.width = (memoryGame.matchedCount/memoryGame.totalPairs*100)+'%';
  memoryGame.openNumber = null;
  memoryGame.openDot = null;
  memoryGame.locked = false;
  if(memoryGame.matchedCount === memoryGame.totalPairs){
    if(memoryGame.level >= memoryGame.totalLevels){ setTimeout(finishMemoryGame, 500); }
    else { memoryGame.level++; setTimeout(renderMemoryLevel, 500); }
  }
}

function matchMistake(){
  memoryGame.mistakes++;
  playWrong();
  mascotOops();
  memoryGame.openNumber.el.classList.add('mismatch');
  memoryGame.openDot.el.classList.add('mismatch');
  memoryGame.locked = true; // ค้างคู่ที่ผิดไว้บนจอ ให้เด็กมีเวลาดูนานเท่าที่ต้องการ จนกว่าจะคลิกการ์ดใบใหม่ (ดู flipCard/resetMismatch)
}

function finishMemoryGame(){
  const cat = catById(memoryGame.catId);
  const totalLevels = memoryGame.totalLevels;
  memoryView.hidden = true; resultView.hidden = false;

  const stars = 3;
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = {
    best: prev ? Math.max(prev.best, totalLevels) : totalLevels,
    stars: prev ? Math.max(prev.stars, stars) : stars,
    unlocked: wasUnlocked || stars>=2
  };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });

  const mistakes = memoryGame.mistakes;
  $('score-line').textContent = 'จับคู่ครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('memory-back').addEventListener('click', ()=>{
  playClick();
  memoryView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* =============================
   SHADOW GUESSING GAME (เกมทายเงา)
   โจทย์เป็นเงาสีดำ (emoji + filter:brightness(0)) ให้เลือกภาพสีปกติที่ตรงกับเงา
   ด่าน 1-5 = 3 ตัวเลือก, 6-10 = 4 ตัวเลือก, 11-15 = 5 ตัวเลือก
   ตัวหลอกสุ่มจากกลุ่มเดียวกับคำตอบ (SHADOW_ITEMS ใน data.js) คำตอบไม่ซ้ำภายใน 1 รอบเล่น
   ============================= */
let shadowGame = null; // {catId, level, mistakes, totalLevels, overlap, usedIdx:{group:Set}, usedCombos:Set, answer, locked}

function startShadowGame(catId){
  stopARGame();
  lastGameType = 'shadow'; lastCatId = catId;
  const cat = catById(catId);
  shadowGame = {
    catId, level:1, mistakes:0, totalLevels:cat.levels,
    overlap: cat.overlap || 1,
    usedIdx:{ animals:new Set(), fruits:new Set(), objects:new Set() },
    usedCombos:new Set(),
    answer:null, locked:false
  };
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = false; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  shadowView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('shadow-cat-label', cat);
  /* ทายเงา 2/3: เงาซ้อนกันหลายชั้น — ตั้ง class ขนาด prompt + ข้อความ hint ตามจำนวนเงาของหมวดนี้ */
  const prompt = $('shadow-prompt');
  prompt.classList.remove('ov2','ov3');
  if(shadowGame.overlap===2) prompt.classList.add('ov2');
  else if(shadowGame.overlap===3) prompt.classList.add('ov3');
  $('shadow-hint').textContent =
    shadowGame.overlap===2 ? '👥 มีเงา 2 อย่างซ้อนกันอยู่! แตะคู่ที่ตรงกับเงาทั้งสองนะ' :
    shadowGame.overlap===3 ? '🎭 มีเงา 3 อย่างซ้อนกันอยู่! แตะชุดที่ตรงกับเงาทั้งสามนะ' :
    '🔦 เงาสีดำนี้คืออะไรเอ่ย? แตะภาพที่ตรงกับเงานะ!';
  renderShadowLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderShadowLevel(){
  const g = shadowGame;
  if(g.overlap > 1){ renderShadowOverlapLevel(); return; }
  const choiceCount = g.level<=5 ? 3 : (g.level<=10 ? 4 : 5);
  const groups = Object.keys(SHADOW_ITEMS);
  const group = groups[Math.floor(Math.random()*groups.length)];
  const pool = SHADOW_ITEMS[group];
  const ansIdx = pickNoRepeatIdx(g.usedIdx[group], pool.length);
  const answer = pool[ansIdx];
  /* ตัวหลอก: เลือกตัวที่ shape tag (s) เดียวกับคำตอบก่อนให้เงาใกล้เคียงกัน ถ้าไม่พอค่อยเติมสุ่มจากกลุ่มเดียวกัน */
  const shapeIdx = [], otherIdx = [];
  pool.forEach((it, i)=>{
    if(i===ansIdx) return;
    (it.s && it.s===answer.s ? shapeIdx : otherIdx).push(i);
  });
  shuffleArray(shapeIdx); shuffleArray(otherIdx);
  const decoyOrder = shapeIdx.concat(otherIdx);
  const choices = [answer];
  for(const i of decoyOrder){
    if(choices.length >= Math.min(choiceCount, pool.length)) break;
    choices.push(pool[i]);
  }
  shuffleArray(choices);
  g.answer = answer; g.locked = false;

  const prompt = $('shadow-prompt');
  prompt.classList.remove('revealed');
  prompt.textContent = answer.e;
  $('shadow-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('shadow-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  const wrap = $('shadow-choices');
  wrap.innerHTML = '';
  g.answerBtn = null;
  choices.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = 'shadow-choice';
    btn.innerHTML = '<span class="shadow-choice-emoji">'+item.e+'</span><span class="shadow-choice-name">'+item.n+'</span>';
    btn.addEventListener('click', ()=>pickShadowChoice(btn, item));
    if(item.e === answer.e) g.answerBtn = btn;
    wrap.appendChild(btn);
  });
}

/* ---- ทายเงา 2/3: โจทย์เป็นเงา 2-3 ชิ้นซ้อนกัน ตัวเลือกเป็นชุด object (คู่/สามชิ้น) ----
   ชุดคำตอบสุ่มผสมจากคลัง SHADOW_ITEMS ทุกกลุ่มรวมกัน (45 ชิ้น = คู่/ชุดผสมได้หลายร้อยแบบ เล่นซ้ำไม่ซ้ำเดิม)
   โดยบังคับ shape tag (s) ในชุดเดียวกันไม่ซ้ำกัน ให้เงาที่ซ้อนยังพอแยกรูปทรงออก
   ตัวหลอก: แทนที่ของจริงทีละ 1/2/3 ชิ้น (คงตำแหน่งเดิม เช่น ชิ้นแรกจริงชิ้นหลังหลอก) โดยตัวแทนเลือก
   shape เดียวกับชิ้นที่ถูกแทนก่อนให้เงาคล้ายของจริง — คีย์ชุด (comboKey) กันโจทย์ซ้ำภายในรอบเล่นเดียวกัน */
function shadowFlatPool(){
  return SHADOW_ITEMS.animals.concat(SHADOW_ITEMS.fruits, SHADOW_ITEMS.objects);
}
function shadowComboKey(items){ return items.map(x=>x.e).sort().join('|'); }
function pickShadowCombo(pool, k, usedCombos){
  /* สุ่มชุด k ชิ้น: e ไม่ซ้ำ + s ไม่ซ้ำกันในชุด, ลองจนกว่าจะได้คีย์ที่ยังไม่เคยใช้ (ลองพอสมควรแล้วค่อยเคลียร์) */
  for(let attempt=0; attempt<60; attempt++){
    const picked = [];
    const usedE = new Set(), usedS = new Set();
    let guard = 0;
    while(picked.length < k && guard++ < 200){
      const it = pool[Math.floor(Math.random()*pool.length)];
      if(usedE.has(it.e) || (it.s && usedS.has(it.s))) continue;
      picked.push(it); usedE.add(it.e); if(it.s) usedS.add(it.s);
    }
    if(picked.length < k) continue;
    const key = shadowComboKey(picked);
    if(!usedCombos.has(key)){ usedCombos.add(key); return picked; }
    if(attempt===40) usedCombos.clear(); /* พูลคีย์ใกล้หมด (เล่นซ้ำนานมาก) เริ่มนับใหม่ */
  }
  return null;
}
function shadowReplaceItem(pool, original, excludeEs){
  /* หาตัวหลอกมาแทน 1 ชิ้น: เงาคล้ายของจริง (s เดียวกัน) ก่อน ถ้าไม่มีค่อยสุ่มตัวอื่น */
  const same = pool.filter(it=>!excludeEs.has(it.e) && it.s && it.s===original.s);
  const rest = pool.filter(it=>!excludeEs.has(it.e) && (!it.s || it.s!==original.s));
  const src = same.length ? same : rest;
  if(!src.length) return null;
  return src[Math.floor(Math.random()*src.length)];
}
function renderShadowOverlapLevel(){
  const g = shadowGame;
  const k = g.overlap;
  const choiceCount = k===2 ? (g.level<=5 ? 3 : (g.level<=10 ? 4 : 5))
                            : (g.level<=7 ? 3 : 4); /* ชุดละ 3 ชิ้นการ์ดกว้าง เกิน 4 ตัวเลือกจะล้นจอ */
  const pool = shadowFlatPool();
  const ansItems = pickShadowCombo(pool, k, g.usedCombos) || pool.slice(0, k);
  const makeChoice = items => ({ e: items.map(x=>x.e).join(''), n: items.map(x=>x.n).join(' + '), items });
  const answer = makeChoice(ansItems);

  /* ตัวหลอกชุดที่ i: แทนของจริง (i%k)+1 ชิ้น โดย "สุ่มตำแหน่ง" ที่ถูกแทนทุกครั้ง
     → ได้คละกันทั้ง ชิ้นแรกจริงชิ้นหลังหลอก / ชิ้นหลังจริงชิ้นแรกหลอก / หลอกทั้งชุด */
  const seenKeys = new Set([shadowComboKey(ansItems)]);
  const choices = [answer];
  let di = 0, guard = 0;
  while(choices.length < choiceCount && guard++ < 40){
    const replaceCount = (di % k) + 1;
    const items = ansItems.slice();
    const excludeEs = new Set(items.map(x=>x.e));
    const positions = shuffleArray(items.map((_,i)=>i)).slice(0, replaceCount);
    let ok = true;
    for(const pos of positions){
      const rep = shadowReplaceItem(pool, ansItems[pos], excludeEs);
      if(!rep){ ok = false; break; }
      items[pos] = rep; excludeEs.add(rep.e);
    }
    di++;
    if(!ok) continue;
    const key = shadowComboKey(items);
    if(seenKeys.has(key)) continue;
    seenKeys.add(key);
    choices.push(makeChoice(items));
  }
  shuffleArray(choices);
  g.answer = answer; g.locked = false;

  const prompt = $('shadow-prompt');
  prompt.classList.remove('revealed');
  prompt.innerHTML = ansItems.map(x=>'<span class="sp-i">'+x.e+'</span>').join('');
  $('shadow-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('shadow-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  const wrap = $('shadow-choices');
  wrap.innerHTML = '';
  g.answerBtn = null;
  choices.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = 'shadow-choice ov'+k;
    btn.innerHTML = '<span class="shadow-choice-emoji multi">'+item.e+'</span><span class="shadow-choice-name">'+item.n+'</span>';
    btn.addEventListener('click', ()=>pickShadowChoice(btn, item));
    if(item.e === answer.e) g.answerBtn = btn;
    wrap.appendChild(btn);
  });
}

function pickShadowChoice(btn, item){
  const g = shadowGame;
  if(!g || g.locked) return;
  g.locked = true;
  const correct = item.e === g.answer.e;
  if(correct){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    btn.classList.add('correct');
  } else {
    /* ตอบผิด: เฉลยข้อถูกให้ดูแล้วไปด่านต่อไปเลย ไม่ให้เลือกซ้ำ */
    g.mistakes++;
    playWrong(); showOwlMsg('wrong');
    btn.classList.add('wrong');
    if(g.answerBtn) g.answerBtn.classList.add('correct');
  }
  $('shadow-prompt').classList.add('revealed'); /* เฉลยสีจริงของเงาให้เด็กเห็นทุกครั้ง */
  $('shadow-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    if(g.level >= g.totalLevels){ finishShadowGame(); }
    else { g.level++; renderShadowLevel(); }
  }, correct ? 1200 : 1600);
}

function finishShadowGame(){
  const cat = catById(shadowGame.catId);
  const mistakes = shadowGame.mistakes;
  const totalLevels = shadowGame.totalLevels;
  shadowView.hidden = true; resultView.hidden = false;

  /* เกณฑ์ดาวจาก mistakes เดียวกับเกม AR/skill/listen เพื่อความสม่ำเสมอทั้งแอป */
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });
  $('score-line').textContent = 'ทายเงาครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('shadow-back').addEventListener('click', ()=>{
  playClick();
  shadowView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= CONNECT DOTS GAME (เกมลากเส้นต่อจุด 1/2 — เกมฝึกเขียน) ============================= */
/* mechanic: จุดวงกลมมีตัวเลขกำกับกระจายบนกระดานจัตุรัส แตะจุดที่ 1 แล้วลากต่อไปทีละจุดตามลำดับเลข
   (แตะทีละจุดเรียงลำดับเฉยๆ ก็ได้ ไม่บังคับต้องลากรวด — เผื่อเด็กเล็กที่ยังลากยาวไม่ถนัด)
   ต่อครบทุกจุดระบบปิดเส้นกลับจุดที่ 1 ให้อัตโนมัติ แล้วเฉลยรูปจริง (เติมสี + emoji + ชื่อรูป)
   ลาก/แตะโดนจุดผิดลำดับ = นับ mistake เส้นชั่วคราวแฟลชสีแดงเด้งหาย ให้เริ่มลากจากจุดล่าสุดใหม่
   พิกัดจุดใช้ระบบ 0-100 ตรงกับ viewBox ของ #dots-svg เพราะ .dots-stage เป็นจัตุรัสเสมอ (aspect-ratio 1/1) */
let dotsGame = null; // {catId, level, mistakes, totalLevels, queue, shape, connected, els, dragging, locked}

const DOTS_HIT_R = 9;        // ระยะ (หน่วย viewBox) ที่ถือว่าแตะโดนจุดเป้าหมาย
const DOTS_WRONG_R = 6.5;    // ระยะที่ถือว่าลากไปโดนจุดผิด (แคบกว่า กันโดนลูกหลงตอนลากผ่านใกล้ๆ)

function startDotsGame(catId){
  stopARGame();
  lastGameType = 'dots'; lastCatId = catId;
  const cat = catById(catId);
  dotsGame = {
    catId, level:1, mistakes:0, totalLevels:cat.levels,
    queue: shuffleArray(DOTS_SHAPES[cat.dotsPool].slice()).slice(0, cat.levels),
    shape:null, connected:0, els:[], dragging:false, locked:false
  };
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = false;
  document.body.classList.add('dots-open'); // จอแคบ: ย่อนกฮูกลงมุม กันบังจุดแถวล่างของกระดาน (ดู CSS body.dots-open)
  document.documentElement.style.setProperty('--cat-color', cat.color);
  dotsView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('dots-cat-label', cat);
  wireDotsStage();
  renderDotsLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderDotsLevel(){
  const g = dotsGame;
  g.shape = g.queue[g.level-1];
  g.connected = 0; g.dragging = false; g.locked = false;
  $('dots-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('dots-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';

  const stage = $('dots-stage');
  $('dots-lines').innerHTML = '';
  const fill = $('dots-fill');
  fill.setAttribute('points','');
  fill.classList.remove('show');
  dotsHideTemp();
  $('dots-reveal').hidden = true;
  $('dots-reveal').classList.remove('show');
  stage.querySelectorAll('.dot-pt').forEach(el=>el.remove());

  g.els = g.shape.pts.map((pt, i)=>{
    const d = document.createElement('div');
    d.className = 'dot-pt'+(i===0 ? ' next' : '');
    d.style.left = pt[0]+'%';
    d.style.top = pt[1]+'%';
    d.innerHTML = '<span>'+(i+1)+'</span>';
    stage.appendChild(d);
    return d;
  });
}

function dotsStagePos(e){
  const r = $('dots-stage').getBoundingClientRect();
  return { x:(e.clientX-r.left)/r.width*100, y:(e.clientY-r.top)/r.height*100 };
}
function dotsNearest(x, y){
  /* หาจุดที่ยัง "ไม่ถูกต่อ" ที่ใกล้ตำแหน่งนิ้วที่สุด (จุดที่ต่อแล้วไม่นับ — นิ้วลากผ่านได้ไม่เป็นไร) */
  const g = dotsGame;
  let best = -1, bestDist = Infinity;
  g.shape.pts.forEach((pt, i)=>{
    if(i < g.connected) return;
    const dist = Math.hypot(pt[0]-x, pt[1]-y);
    if(dist < bestDist){ bestDist = dist; best = i; }
  });
  return { idx:best, dist:bestDist };
}
function dotsSvgLine(a, b){
  const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
  ln.setAttribute('x1',a[0]); ln.setAttribute('y1',a[1]);
  ln.setAttribute('x2',b[0]); ln.setAttribute('y2',b[1]);
  ln.setAttribute('class','dots-line');
  return ln;
}
function dotsUpdateTemp(x, y){
  const g = dotsGame;
  const anchor = g.shape.pts[g.connected-1];
  const temp = $('dots-temp');
  temp.hidden = false;
  temp.classList.remove('bad');
  temp.setAttribute('x1',anchor[0]); temp.setAttribute('y1',anchor[1]);
  temp.setAttribute('x2',x); temp.setAttribute('y2',y);
}
function dotsHideTemp(){
  const temp = $('dots-temp');
  temp.hidden = true;
  temp.classList.remove('bad');
}

function dotsConnect(idx){
  const g = dotsGame;
  const pts = g.shape.pts;
  if(idx > 0) $('dots-lines').appendChild(dotsSvgLine(pts[idx-1], pts[idx]));
  g.connected = idx+1;
  g.els[idx].classList.remove('next');
  g.els[idx].classList.add('done');
  if(g.connected < pts.length){
    playClick();
    g.els[g.connected].classList.add('next');
  } else {
    completeDotsLevel();
  }
}

function dotsMistake(idx, x, y){
  const g = dotsGame;
  g.mistakes++;
  playWrong(); mascotOops(); showOwlMsg('wrong');
  const el = g.els[idx];
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  setTimeout(()=>el.classList.remove('shake'), 500); // ถอด class หลังจบ animation ไม่งั้นสีแดงค้างถาวรจนถึงตอนเฉลย
  /* เส้นชั่วคราวแฟลชสีแดงชี้ไปจุดที่ผิดแป๊บนึงแล้วหาย = "เส้นเด้งกลับ" ให้เริ่มลากจากจุดล่าสุดใหม่ */
  if(g.connected > 0){
    dotsUpdateTemp(x, y);
    $('dots-temp').classList.add('bad');
    setTimeout(dotsHideTemp, 350);
  }
  g.dragging = false;
}

function completeDotsLevel(){
  const g = dotsGame;
  const pts = g.shape.pts;
  g.locked = true; g.dragging = false;
  dotsHideTemp();
  $('dots-lines').appendChild(dotsSvgLine(pts[pts.length-1], pts[0])); // ปิดเส้นกลับจุดแรกให้อัตโนมัติ
  const fill = $('dots-fill');
  fill.setAttribute('points', pts.map(p=>p[0]+','+p[1]).join(' '));
  fill.classList.add('show');
  g.els.forEach(el=>el.classList.add('done'));
  const reveal = $('dots-reveal');
  $('dots-reveal-emoji').textContent = g.shape.e;
  $('dots-reveal-name').textContent = g.shape.name+'!';
  reveal.hidden = false;
  requestAnimationFrame(()=> reveal.classList.add('show'));
  playCorrect(); mascotHappy(); showOwlMsg('correct');
  burstFromElement($('dots-stage'), 40);
  $('dots-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    if(dotsGame !== g) return; // เผื่อผู้เล่นกดกลับหน้าหลัก/เริ่มเกมใหม่ระหว่างรอเฉลย
    if(g.level >= g.totalLevels){ finishDotsGame(); }
    else { g.level++; renderDotsLevel(); }
  }, 2000);
}

let dotsStageWired = false;
function wireDotsStage(){
  if(dotsStageWired) return;
  dotsStageWired = true;
  const stage = $('dots-stage');
  stage.addEventListener('pointerdown', e=>{
    const g = dotsGame;
    if(!g || g.locked) return;
    e.preventDefault();
    const pos = dotsStagePos(e);
    const near = dotsNearest(pos.x, pos.y);
    if(near.idx < 0 || near.dist > DOTS_HIT_R){
      /* แตะโดนจุดที่ต่อแล้ว (จุดล่าสุด) = จับลากต่อจากจุดนั้นได้ */
      if(g.connected > 0){
        const anchor = g.shape.pts[g.connected-1];
        if(Math.hypot(anchor[0]-pos.x, anchor[1]-pos.y) <= DOTS_HIT_R){
          g.dragging = true;
          try{ stage.setPointerCapture(e.pointerId); }catch(err){}
          dotsUpdateTemp(pos.x, pos.y);
        }
      }
      return;
    }
    if(near.idx === g.connected){
      dotsConnect(near.idx);
      if(!g.locked){
        g.dragging = true;
        try{ stage.setPointerCapture(e.pointerId); }catch(err){}
        dotsUpdateTemp(pos.x, pos.y);
      }
    } else {
      dotsMistake(near.idx, pos.x, pos.y);
    }
  });
  stage.addEventListener('pointermove', e=>{
    const g = dotsGame;
    if(!g || g.locked || !g.dragging) return;
    e.preventDefault();
    const pos = dotsStagePos(e);
    const near = dotsNearest(pos.x, pos.y);
    if(near.idx === g.connected && near.dist <= DOTS_HIT_R){
      dotsConnect(near.idx); // ลากรวดต่อหลายจุดโดยไม่ต้องยกนิ้วได้
      if(!g.locked) dotsUpdateTemp(pos.x, pos.y);
      return;
    }
    if(near.idx >= 0 && near.idx !== g.connected && near.dist <= DOTS_WRONG_R){
      dotsMistake(near.idx, pos.x, pos.y);
      return;
    }
    dotsUpdateTemp(pos.x, pos.y);
  });
  const endDrag = ()=>{
    const g = dotsGame;
    if(!g) return;
    g.dragging = false;
    if(!g.locked) dotsHideTemp();
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
}

function finishDotsGame(){
  const cat = catById(dotsGame.catId);
  const mistakes = dotsGame.mistakes;
  const totalLevels = dotsGame.totalLevels;
  dotsGame = null;
  document.body.classList.remove('dots-open');
  dotsView.hidden = true; resultView.hidden = false;

  /* เกณฑ์ดาวจาก mistakes เดียวกับเกม AR/skill/listen เพื่อความสม่ำเสมอทั้งแอป */
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });
  $('score-line').textContent = 'ลากเส้นครบ '+totalLevels+' รูป! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('dots-back').addEventListener('click', ()=>{
  playClick();
  dotsGame = null;
  dotsView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= COLOR MIXING GAME (เกมผสมสี 1/2 — หม้อผสมสีวิเศษ) ============================= */
/* mechanic: แตะกระปุกสีหยอดลงหม้อ พอครบจำนวนที่ต้องหยอด หม้อคนอัตโนมัติแล้วโชว์ "สีผลลัพธ์จริง" ของคู่ที่เลือก
   (ตอบผิดเด็กได้เห็นว่าคู่นั้นผสมแล้วได้สีอะไรจริงๆ ไม่ใช่แค่บอกว่าผิด) — ผสมสี 1: เลือก 2 สีเองทั้งคู่,
   ผสมสี 2 (mixAdvanced) ด่าน 1-5: หม้อมีสีตั้งต้นให้แล้ว หาสีที่หายไป, ด่าน 6-10: ผสม 3 สี 2 จังหวะ (หม้อโชว์สีกลางทาง) */
let mixGame = null; // {catId, level, mistakes, totalLevels, advanced, queue, entry, jars, pours, prefill, needed, mixedCount, locked}

/* คิวโจทย์ทั้งรอบ: สุ่มลำดับสูตร ถ้าต้องการมากกว่าจำนวนสูตรในกลุ่ม เติมแบบสุ่มโดยไม่ให้ซ้ำติดกัน */
function buildMixQueue(recipes, count){
  const arr = shuffleArray(recipes.slice());
  let guard = 0;
  while(arr.length < count && guard++ < 50){
    const r = recipes[Math.floor(Math.random()*recipes.length)];
    if(r !== arr[arr.length-1]) arr.push(r);
  }
  return arr.slice(0, count);
}

/* ผสมค่าสีแบบเฉลี่ย RGB — ใช้โชว์สีในหม้อของคู่ที่ "ไม่มีในตารางสูตร" (ตอบผิด) ให้เด็กเห็นผลจริงเสมอ */
function mixHexAvg(ids){
  let r = 0, g = 0, b = 0;
  ids.forEach(id=>{
    const hex = MIX_COLORS[id].c;
    r += parseInt(hex.slice(1,3),16); g += parseInt(hex.slice(3,5),16); b += parseInt(hex.slice(5,7),16);
  });
  const n = ids.length;
  const to2 = v => Math.round(v/n).toString(16).padStart(2,'0');
  return '#'+to2(r)+to2(g)+to2(b);
}
function mixKey(ids){ return ids.slice().sort().join('+'); }
function mixLookup(ids){
  if(ids.length !== 2) return null;
  const key = mixKey(ids);
  const rec = MIX_RECIPES.find(r=>mixKey(r.mix)===key);
  return rec ? rec.out : null;
}

function startMixGame(catId){
  stopARGame();
  lastGameType = 'mix'; lastCatId = catId;
  const cat = catById(catId);
  const advanced = !!cat.mixAdvanced;
  let queue;
  if(advanced){
    /* ผสมสี 2: ด่าน 1-5 หาเองทั้ง 2 สี (สูตรยากขึ้น tier 2-3 หลากหลาย), ด่าน 6-10 ผสม 3 สี 2 จังหวะ */
    const hardPool = MIX_RECIPES.filter(r=>r.tier>=2);
    queue = shuffleArray(hardPool.slice()).slice(0,5).map(r=>({kind:'both', recipe:r}))
      .concat(shuffleArray(MIX_TWOSTEP.slice()).map(r=>({kind:'twostep', recipe:r})));
  } else {
    /* ผสมสี 1: หม้อเฉลยสีตั้งต้นให้ 1 สี ให้หา "คู่สี" มาเติม — ไล่ความยากตาม tier, สุ่มสูตร+สุ่มฝั่งที่เฉลยทุกรอบ */
    const tier = t => MIX_RECIPES.filter(r=>r.tier===t);
    queue = buildMixQueue(tier(1),4).concat(buildMixQueue(tier(2),3), buildMixQueue(tier(3),3))
      .map(r=>({kind:'missing', recipe:r}));
  }
  mixGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, advanced, queue,
              entry:null, jars:[], pours:[], prefill:null, needed:[], mixedCount:0, locked:false };
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = false; musicView.hidden = true; dotsView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  mixView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('mix-cat-label', cat);
  renderMixLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderMixLevel(){
  const g = mixGame;
  const entry = g.queue[g.level-1];
  g.entry = entry; g.pours = []; g.mixedCount = 0; g.locked = false;
  const rec = entry.recipe;
  const allIds = Object.keys(MIX_COLORS);

  if(entry.kind==='twostep'){
    g.prefill = null;
    g.needed = rec.steps.slice();
    const jarCount = g.level<=7 ? 4 : 5;
    g.jars = rec.steps.slice();
    const extras = shuffleArray(allIds.filter(id=>!rec.steps.includes(id)));
    while(g.jars.length < jarCount && extras.length) g.jars.push(extras.pop());
    $('mix-hint').textContent = '🌀 สีนี้ต้องผสมถึง 3 สี! ค่อยๆ หยอดทีละสี ดูสีในหม้อเปลี่ยนไปเรื่อยๆ นะ';
  } else if(entry.kind==='missing'){
    /* ผสมสี 1: เฉลยสีตั้งต้นในหม้อ 1 สี (สุ่มฝั่ง) ให้หาคู่สีที่เหลือมาเติม */
    g.prefill = rec.mix[Math.floor(Math.random()*2)];
    g.needed = rec.mix.slice();
    const missing = rec.mix.find(id=>id!==g.prefill);
    const jarCount = g.level<=4 ? 3 : (g.level<=7 ? 4 : 5);
    g.jars = [missing];
    const extras = shuffleArray(allIds.filter(id=>id!==missing && id!==g.prefill));
    while(g.jars.length < jarCount && extras.length) g.jars.push(extras.pop());
    $('mix-hint').textContent = '🔍 ในหม้อมี'+MIX_COLORS[g.prefill].n+'อยู่แล้ว เติมอีกสีเดียวให้กลายเป็น'+rec.out.n+'นะ!';
  } else {
    /* ผสมสี 2 ด่าน 1-5: ไม่เฉลยเลย หาเองทั้ง 2 สี */
    g.prefill = null;
    g.needed = rec.mix.slice();
    const jarCount = g.level<=2 ? 4 : 5;
    g.jars = rec.mix.slice();
    const extras = shuffleArray(allIds.filter(id=>!rec.mix.includes(id)));
    while(g.jars.length < jarCount && extras.length) g.jars.push(extras.pop());
    $('mix-hint').textContent = '🎨 ด่านนี้ต้องหาเองทั้ง 2 สี! เลือกหยอดลงหม้อให้กลายเป็น'+rec.out.n+'นะ';
  }
  shuffleArray(g.jars);

  $('mix-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('mix-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('mix-target-text').innerHTML = 'ช่วยทำ<b>'+rec.out.n+'</b>ให้หน่อยนะ!';
  $('mix-target-swatch').style.background = rec.out.c;
  $('mix-msg').hidden = true;

  const pot = $('mix-pot');
  pot.classList.remove('stirring','happy','sad');
  const liquid = $('mix-pot-liquid');
  liquid.classList.remove('draining');
  if(g.prefill){ liquid.style.background = MIX_COLORS[g.prefill].c; liquid.classList.add('filled'); }
  else { liquid.classList.remove('filled'); }
  renderMixChips();

  const jarsWrap = $('mix-jars');
  jarsWrap.innerHTML = '';
  g.jars.forEach(id=>{
    const col = MIX_COLORS[id];
    const btn = document.createElement('button');
    btn.className = 'mix-jar';
    btn.dataset.color = id;
    btn.innerHTML = '<span class="mix-jar-pot" style="--jc:'+col.c+'"><span class="mix-jar-lid"></span><span class="mix-jar-drip"></span></span><span class="mix-jar-name">'+col.n+'</span>';
    btn.addEventListener('click', ()=>mixPour(id, btn));
    jarsWrap.appendChild(btn);
  });
}

/* แถวจุดสีใต้หม้อ: โชว์สีที่หยอดไปแล้ว (สีตั้งต้นของโหมดหาสีที่หายไปมีแม่กุญแจ ตักออกไม่ได้)
   จุดสีที่เพิ่งหยอดและยังไม่ถูกคนผสม แตะซ้ำเพื่อตักออกได้ */
function renderMixChips(){
  const g = mixGame;
  const wrap = $('mix-pot-chips');
  wrap.innerHTML = '';
  const addChip = (id, removable)=>{
    const chip = document.createElement('button');
    chip.className = 'mix-chip'+(removable ? ' removable' : '');
    chip.style.background = MIX_COLORS[id].c;
    chip.title = MIX_COLORS[id].n;
    if(removable){
      chip.addEventListener('click', ()=>{
        if(g.locked || g.pours.length!==1 || g.mixedCount>0) return;
        playClick();
        g.pours = [];
        $('mix-pot-liquid').classList.remove('filled');
        const jarBtn = $('mix-jars').querySelector('.mix-jar[data-color="'+id+'"]');
        if(jarBtn) jarBtn.classList.remove('used');
        renderMixChips();
      });
    }
    wrap.appendChild(chip);
  };
  if(g.prefill) addChip(g.prefill, false);
  g.pours.forEach(id=>{
    addChip(id, g.pours.length===1 && g.mixedCount===0 && !g.locked);
  });
}

/* effect กระปุกสีลอยไปเทที่ปากหม้อ: clone กระปุกเป็น ghost ตำแหน่ง fixed แล้ว transition ไปเหนือหม้อพร้อมเอียงเท */
function mixPourEffect(colorId, jarBtn, done){
  const potRim = document.querySelector('#mix-pot .mix-pot-rim');
  const src = jarBtn.querySelector('.mix-jar-pot');
  if(!potRim || !src){ done(); return; }
  const from = src.getBoundingClientRect();
  const to = potRim.getBoundingClientRect();
  const ghost = document.createElement('span');
  ghost.className = 'mix-pour-ghost';
  ghost.style.setProperty('--jc', MIX_COLORS[colorId].c);
  ghost.style.left = from.left+'px';
  ghost.style.top = from.top+'px';
  ghost.style.width = from.width+'px';
  ghost.style.height = from.height+'px';
  document.body.appendChild(ghost);
  const dx = (to.left + to.width/2) - (from.left + from.width/2) + from.width*0.7;
  const dy = (to.top - from.height*1.15) - from.top;
  requestAnimationFrame(()=>{ ghost.style.transform = 'translate('+dx+'px,'+dy+'px) rotate(-115deg)'; });
  setTimeout(()=>{ ghost.classList.add('poured'); }, 500);
  setTimeout(()=>{ ghost.remove(); done(); }, 760);
}

function mixPour(colorId, jarBtn){
  const g = mixGame;
  if(!g || g.locked) return;
  if(jarBtn.classList.contains('used')) return;
  playClick();
  jarBtn.classList.add('used');
  g.locked = true; /* ล็อกระหว่าง effect เท กันกดรัว — ปลดเมื่อจบจังหวะที่ไม่ใช่การตัดสินผล */
  g.pours.push(colorId);
  const liquid = $('mix-pot-liquid');
  const potHadContent = !!g.prefill || g.pours.length > 1;
  const totalNeeded = g.needed.length - (g.prefill ? 1 : 0);

  mixPourEffect(colorId, jarBtn, ()=>{
    if(!potHadContent){
      /* สีแรกของหม้อเปล่า: เทลงไปเฉยๆ ยังไม่ต้องคน */
      liquid.style.background = MIX_COLORS[colorId].c;
      liquid.classList.add('filled');
      g.locked = false;
      renderMixChips();
      return;
    }

    /* มีสีในหม้ออยู่แล้ว → คนผสมอัตโนมัติ */
    const isFinal = g.pours.length >= totalNeeded;
    const effective = (g.prefill ? [g.prefill] : []).concat(g.pours);
    const pot = $('mix-pot');
    renderMixChips();
    pot.classList.add('stirring');
    setTimeout(()=>{
      pot.classList.remove('stirring');
      g.mixedCount = g.pours.length;
      if(!isFinal){
        /* จังหวะกลางทางของโหมดผสม 2 ขั้น: โชว์สีกลางทาง (จากตารางสูตรถ้ามี ไม่มีก็เฉลี่ยสี) */
        const mid = mixLookup(effective);
        liquid.style.background = mid ? mid.c : mixHexAvg(effective);
        g.locked = false;
        renderMixChips();
        return;
      }
      finishMixPour(effective);
    }, 950);
  });
}

function finishMixPour(effective){
  const g = mixGame;
  const rec = g.entry.recipe;
  const correct = mixKey(effective) === mixKey(g.needed);
  const liquid = $('mix-pot-liquid');
  const pot = $('mix-pot');
  const resultOut = correct ? rec.out : (mixLookup(effective) || {n:null, c:mixHexAvg(effective)});
  liquid.style.background = resultOut.c;
  const msg = $('mix-msg');

  if(correct){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    pot.classList.add('happy');
    msg.textContent = '🎉 ได้'+rec.out.n+'แล้ว เก่งมาก!';
    msg.hidden = false;
    $('mix-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{
      if(g.level >= g.totalLevels){ finishMixGame(); }
      else { g.level++; renderMixLevel(); }
    }, 1500);
  } else {
    g.mistakes++;
    playWrong(); showOwlMsg('wrong');
    pot.classList.add('sad');
    msg.textContent = resultOut.n
      ? '💧 ได้'+resultOut.n+'แทนแฮะ ยังไม่ใช่'+rec.out.n+' เทออกแล้วลองใหม่นะ!'
      : '💧 ได้สีแปลกๆ แฮะ ยังไม่ใช่'+rec.out.n+' เทออกแล้วลองใหม่นะ!';
    msg.hidden = false;
    setTimeout(()=>{
      liquid.classList.add('draining');
      setTimeout(()=>{
        /* รีเซ็ตหม้อ โจทย์เดิม ให้ลองใหม่ (คงสีตั้งต้นไว้ถ้าเป็นโหมดหาสีที่หายไป) */
        g.pours = []; g.mixedCount = 0; g.locked = false;
        liquid.classList.remove('draining');
        pot.classList.remove('sad');
        if(g.prefill){ liquid.style.background = MIX_COLORS[g.prefill].c; }
        else { liquid.classList.remove('filled'); }
        msg.hidden = true;
        renderMixChips();
        $('mix-jars').querySelectorAll('.mix-jar').forEach(b=>b.classList.remove('used'));
      }, 550);
    }, 1700);
  }
}

function finishMixGame(){
  const cat = catById(mixGame.catId);
  const mistakes = mixGame.mistakes;
  const totalLevels = mixGame.totalLevels;
  mixView.hidden = true; resultView.hidden = false;

  /* เกณฑ์ดาวจาก mistakes เดียวกับเกม AR/skill/listen เพื่อความสม่ำเสมอทั้งแอป */
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });
  $('score-line').textContent = 'ผสมสีครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('mix-back').addEventListener('click', ()=>{
  playClick();
  mixView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= เกมดนตรี (เปียโน) — skill-music 1/2/3 ============================= */
/* musicMode 1: คีย์มีตัวโน้ตกำกับ สุ่มโจทย์ 1-3 ตัวเรียงลำดับ (randMusicTarget)
   musicMode 2: เกมความจำสะสม สุ่ม 1 เพลงจาก MUSIC_LEVEL2_SONGS ด่าน n กดโน้ตตัวที่ 1..n เปิดเผยเฉพาะตัวใหม่ ต้องจำตัวเก่าเอง
   musicMode 3: เอาตัวโน้ตกำกับที่คีย์ออก สุ่มโจทย์ เด็กหาคีย์เอง 1-3 ตัว (randMusicTarget)
   เช็คคำตอบด้วยชื่อโน้ต (octave-agnostic) กดคีย์ชื่อเดียวกัน octave ไหนก็ถูก
   คีย์ดำกดได้มีเสียงจริง แต่ไม่เกี่ยวกับโจทย์ (ไม่นับผิด) */
let musicGame = null; // {catId, mode, level, totalLevels, mistakes, target:[whiteIdx], pos, locked, song}
let musicNotation = (localStorage.getItem('p1quiz_music_notation')==='en') ? 'en' : 'th';
let musicPausedBg = false; // จำว่าเกมนี้เป็นคนสั่งพักเพลงพื้นหลังไว้ (จะได้เล่นต่อตอนออก)

function musicKeyLabel(k){ return musicNotation==='en' ? k.en : k.th; }
/* เทียบชื่อโน้ตแบบไม่สนใจ octave (ด ที่ index 0/7/14 ถือว่าเหมือนกัน) */
function sameNote(a, b){ return MUSIC_WHITE_KEYS[a].th === MUSIC_WHITE_KEYS[b].th; }
/* สุ่มโจทย์ Level 1/3: ด่าน 1-3 = 1 โน้ต, 4-7 = 2 โน้ต, 8-10 = 3 โน้ต จากคีย์ ด..ด (index 0-7) ไม่ให้ตัวติดกันซ้ำ */
function randMusicTarget(level){
  const count = level<=3 ? 1 : (level<=7 ? 2 : 3);
  const t = [];
  for(let i=0;i<count;i++){
    let n; do { n = Math.floor(Math.random()*8); } while(i>0 && n===t[i-1]);
    t.push(n);
  }
  return t;
}
/* พักเพลงพื้นหลังตอนอยู่ในเกมดนตรี / เล่นต่อตอนออก (ไม่แตะค่า setting musicOn ของผู้ใช้) */
function pauseBgMusicForMusicGame(){ if(musicOn && !musicPausedBg){ stopMusic(); musicPausedBg = true; } }
function resumeBgMusicAfterMusicGame(){ stopMusicSequence(); /* ออกจากเปียโน/เกมดนตรีทุกทาง = หยุดเพลงตัวอย่างที่ค้าง */ if(musicPausedBg){ musicPausedBg = false; if(musicOn) startMusic(); } }
function pianoWhiteEl(i){ return $('music-piano').querySelector('.music-white[data-white="'+i+'"]'); }
function flashKey(key){ if(!key) return; key.classList.add('pressed'); setTimeout(()=>key.classList.remove('pressed'), 200); }

/* เสียงโน้ตเปียโนแบบนุ่มใส (Web Audio: sine หลัก + โอเวอร์โทนเบา, envelope นุ่ม) */
function playPianoNote(freq, dur){
  ensureAudio();
  if(!audioCtx) return;
  if(audioCtx.state==='suspended') audioCtx.resume();
  const t0 = audioCtx.currentTime; dur = dur || 0.9;
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.2, t0+0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
  master.connect(audioCtx.destination);
  [[1,1],[2,0.16]].forEach(([mult,g])=>{
    const osc = audioCtx.createOscillator(), og = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq*mult; og.gain.value = g;
    osc.connect(og).connect(master);
    osc.start(t0); osc.stop(t0+dur);
  });
}

/* noFlash=true: เล่นแต่เสียง ไม่ไฮไลต์คีย์ (ใช้กับ mode 3 ที่ต้องให้เด็กหาคีย์เอง ไม่เฉลยตำแหน่ง) */
/* เก็บ timer ของเพลงที่กำลังเล่นไว้ยกเลิกได้ — กดฟังซ้ำ = เริ่มใหม่ (ไม่เล่นทับกัน)
   และปิด modal เปียโน/เปลี่ยนเพลงต้องหยุดเพลงที่ค้างอยู่ด้วย stopMusicSequence() */
let musicSeqTimers = [];
function stopMusicSequence(){ musicSeqTimers.forEach(clearTimeout); musicSeqTimers = []; }
function playMusicSequence(seq, noFlash){
  stopMusicSequence();
  if(!seq || !seq.length) return;
  seq.forEach((wi,i)=>{
    musicSeqTimers.push(setTimeout(()=>{
      playPianoNote(MUSIC_WHITE_KEYS[wi].freq, 0.5);
      if(!noFlash) flashKey(pianoWhiteEl(wi));
    }, i*520));
  });
}

/* วาดคีย์เปียโนลงใน element ที่ระบุ (ใช้ทั้งเกมดนตรีและ modal เปียโนอิสระ) */
function renderPianoKeys(piano, hideLabels){
  piano.classList.toggle('no-key-labels', !!hideLabels);
  const n = MUSIC_WHITE_KEYS.length;
  let html = '';
  MUSIC_WHITE_KEYS.forEach((k,i)=>{
    html += '<button class="music-key music-white" data-white="'+i+'" style="--key-color:'+k.color+'" aria-label="'+k.th+'">'
         +  '<span class="mk-label">'+musicKeyLabel(k)+'</span></button>';
  });
  MUSIC_BLACK_KEYS.forEach((b,i)=>{
    html += '<button class="music-key music-black" data-black="'+i+'" style="left:'+((b.after+1)*(100/n))+'%" aria-label="คีย์ดำ"></button>';
  });
  piano.innerHTML = html;
}
function buildPiano(){ renderPianoKeys($('music-piano'), musicGame.mode===3); }

function renderMusicNotes(allDone){
  const g = musicGame, wrap = $('music-notes');
  wrap.innerHTML = '';
  g.target.forEach((wi,i)=>{
    const k = MUSIC_WHITE_KEYS[wi];
    const b = document.createElement('div');
    b.className = 'music-note-bubble';
    const done = allDone || i < g.pos;
    const isNewMemory = g.mode===2 && i === g.target.length-1;
    const hiddenMem = g.mode===2 && !done && !isNewMemory;
    if(done){
      b.classList.add('done'); b.style.setProperty('--key-color', k.color);
      b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span><span class="mnb-check">✓</span>';
    } else if(hiddenMem){
      b.classList.add('mystery'); b.textContent = '?';
    } else {
      b.style.setProperty('--key-color', k.color);
      b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span>';
    }
    if(!done && i===g.pos) b.classList.add('current');
    wrap.appendChild(b);
  });
}

function renderMusicLevel(){
  const g = musicGame;
  g.pos = 0; g.locked = false;
  $('music-msg').hidden = true;
  if(g.mode===2) g.target = g.song.notes.slice(0, g.level);
  else           g.target = randMusicTarget(g.level);
  $('music-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('music-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  const hint = $('music-hint'), plabel = $('music-prompt-label');
  if(g.mode===1){ hint.textContent = '🎹 กดคีย์ตามโน้ตในโจทย์ให้ครบตามลำดับนะ'; plabel.textContent = 'กดคีย์ตามนี้เลย 👇'; }
  else if(g.mode===2){ hint.textContent = '🧠 จำโน้ตให้ได้! กดตั้งแต่ตัวแรกจนถึงตัวใหม่ล่าสุด'; plabel.textContent = 'เพลง '+g.song.name+' — เล่นต่อ เพิ่มโน้ตใหม่!'; }
  else { hint.textContent = '🔍 คีย์ไม่มีตัวโน้ตแล้ว หาคีย์ให้ถูกตามโจทย์นะ'; plabel.textContent = 'หาคีย์ให้ถูก 🔍'; }
  renderMusicNotes();
  if(g.mode===2){
    /* เปิดเผย + เล่นเสียงเฉพาะโน้ตตัวใหม่ล่าสุด (ตัวเก่าต้องจำเอง) */
    setTimeout(()=>{ const ni = g.target[g.target.length-1]; playPianoNote(MUSIC_WHITE_KEYS[ni].freq, 0.8); flashKey(pianoWhiteEl(ni)); }, 450);
  } else {
    /* mode 3: เล่นทำนองแต่ไม่ไฮไลต์คีย์ (ให้เด็กหาคีย์เอง) — mode 1 ไฮไลต์ปกติ */
    setTimeout(()=>playMusicSequence(g.target, g.mode===3), 400);
  }
}

function musicPressWhite(wi){
  const g = musicGame;
  if(!g || g.locked) return;
  if(sameNote(wi, g.target[g.pos])){
    g.pos++;
    renderMusicNotes();
    if(g.pos >= g.target.length) musicLevelComplete();
  } else {
    g.mistakes++;
    playWrong(); showOwlMsg('wrong');
    const key = pianoWhiteEl(wi);
    if(key){ key.classList.add('key-wrong'); setTimeout(()=>key.classList.remove('key-wrong'), 420); }
    const cur = $('music-notes').children[g.pos];
    if(cur){ cur.classList.add('shake'); setTimeout(()=>cur.classList.remove('shake'), 420); }
  }
}

function musicLevelComplete(){
  const g = musicGame;
  g.locked = true;
  playCorrect(); mascotHappy(); showOwlMsg('correct');
  renderMusicNotes(true);
  const msg = $('music-msg');
  msg.textContent = '🎉 เยี่ยมมาก!'; msg.hidden = false;
  $('music-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    msg.hidden = true;
    if(g.level >= g.totalLevels) finishMusicGame();
    else { g.level++; renderMusicLevel(); }
  }, 1200);
}

function startMusicGame(catId){
  lastGameType = 'music'; lastCatId = catId;
  const cat = catById(catId);
  musicGame = { catId, mode:cat.musicMode, level:1, totalLevels:cat.levels, mistakes:0, target:[], pos:0, locked:false, song:null };
  if(cat.musicMode===2) musicGame.song = MUSIC_LEVEL2_SONGS[Math.floor(Math.random()*MUSIC_LEVEL2_SONGS.length)];
  pauseBgMusicForMusicGame();
  document.body.classList.add('music-open'); // ซ่อนปุ่มมุมล่าง (ติดตั้ง/เปียโน) ไม่ให้ทับคีย์
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = false; dotsView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  musicView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('music-cat-label', cat);
  const nt = $('music-notation-toggle');
  nt.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  nt.setAttribute('aria-pressed', musicNotation==='en');
  buildPiano();
  renderMusicLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function finishMusicGame(){
  const cat = catById(musicGame.catId);
  const mistakes = musicGame.mistakes, totalLevels = musicGame.totalLevels;
  resumeBgMusicAfterMusicGame();
  document.body.classList.remove('music-open');
  const wasAllDone = musicAllDone();
  musicView.hidden = true; resultView.hidden = false;
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();
  const freePianoJustUnlocked = !wasAllDone && musicAllDone(); // เพิ่งเล่นเกมดนตรีครบทั้ง 3 เกม
  if(freePianoJustUnlocked){ setTimeout(()=>showToast('🎹','ปลดล็อกเปียโนของหนูแล้ว! กดปุ่มมุมล่างซ้ายเล่นได้เลย'), 1800); }
  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row'); starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });
  $('score-line').textContent = 'เล่นดนตรีครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';
  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false; setStickerEarned(cat); pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('music-piano').addEventListener('pointerdown', e=>{
  const key = e.target.closest('.music-key');
  if(!key) return;
  e.preventDefault();
  if(key.classList.contains('music-black')){
    playPianoNote(MUSIC_BLACK_KEYS[+key.dataset.black].freq, 0.7);
    flashKey(key);
    return;
  }
  const wi = +key.dataset.white;
  playPianoNote(MUSIC_WHITE_KEYS[wi].freq, 0.9);
  flashKey(key);
  musicPressWhite(wi);
});
$('music-listen-btn').addEventListener('click', ()=>{ if(musicGame) playMusicSequence(musicGame.target, musicGame.mode===3); });
$('music-notation-toggle').addEventListener('click', function(){
  musicNotation = musicNotation==='en' ? 'th' : 'en';
  localStorage.setItem('p1quiz_music_notation', musicNotation);
  this.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  this.setAttribute('aria-pressed', musicNotation==='en');
  if(musicGame){ buildPiano(); renderMusicNotes(); }
});
$('music-back').addEventListener('click', ()=>{
  playClick();
  resumeBgMusicAfterMusicGame();
  document.body.classList.remove('music-open');
  musicView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ===== gimmick: เปียโนของหนู (ปลดล็อกเมื่อเล่นเกมดนตรีครบทั้ง 3 เกม) ===== */
const MUSIC_CAT_IDS = ['skill-music','skill-music2','skill-music3'];
function musicAllDone(){ return MUSIC_CAT_IDS.every(id => progress[id] && progress[id].stars>=1); }
function updateFreePianoBtn(){ const b = $('free-piano-btn'); if(b) b.hidden = !(activeChild && musicAllDone()); }

let freePiano = { song:null, pos:0 };

function renderFreePianoSongs(){
  const wrap = $('fp-songs');
  let html = '<select class="fp-song-select" id="fp-song-select" aria-label="เลือกเพลง">';
  html += '<option value="-1"'+(freePiano.song?'':' selected')+'>🎹 เล่นอิสระ</option>';
  MUSIC_LEVEL2_SONGS.forEach((s,i)=>{
    html += '<option value="'+i+'"'+(freePiano.song===s?' selected':'')+'>'+s.name+'</option>';
  });
  html += '</select>';
  wrap.innerHTML = html;
}
function renderFreePianoNotes(){
  const wrap = $('fp-notes');
  if(!freePiano.song){ wrap.innerHTML = '<div class="fp-hint-free">กดคีย์เล่นได้เลย ทุกคีย์มีเสียงจริง! 🎶</div>'; return; }
  wrap.innerHTML = '';
  freePiano.song.notes.forEach((wi,i)=>{
    const k = MUSIC_WHITE_KEYS[wi];
    const b = document.createElement('div');
    b.className = 'music-note-bubble'+(i<freePiano.pos?' done':'')+((i===freePiano.pos)?' current':'');
    b.style.setProperty('--key-color', k.color);
    if(i<freePiano.pos) b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span><span class="mnb-check">✓</span>';
    else b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span>';
    wrap.appendChild(b);
  });
}
function selectFreeSong(idx){
  stopMusicSequence(); /* เปลี่ยนเพลงระหว่างเพลงเดิมยังเล่นค้าง ต้องหยุดก่อน */
  freePiano.song = idx<0 ? null : MUSIC_LEVEL2_SONGS[idx];
  freePiano.pos = 0;
  renderFreePianoSongs();
  renderFreePianoNotes();
}
function openFreePiano(){
  playClick();
  pauseBgMusicForMusicGame();
  document.documentElement.style.setProperty('--cat-color', '#C86FB0');
  freePiano = { song:null, pos:0 };
  renderPianoKeys($('fp-piano'), false);
  renderFreePianoSongs();
  renderFreePianoNotes();
  $('fp-notation').textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  openOverlay('free-piano-modal');
}
function closeFreePiano(){ stopMusicSequence(); resumeBgMusicAfterMusicGame(); closeOverlay('free-piano-modal'); }

$('free-piano-btn').addEventListener('click', openFreePiano);
$('free-piano-x').addEventListener('click', ()=>{ playClick(); closeFreePiano(); });
$('free-piano-backdrop').addEventListener('click', closeFreePiano);
$('fp-songs').addEventListener('change', e=>{
  const sel = e.target.closest('.fp-song-select'); if(!sel) return;
  playClick(); selectFreeSong(+sel.value);
});
$('fp-listen').addEventListener('click', ()=>{ if(freePiano.song) playMusicSequence(freePiano.song.notes); });
$('fp-notation').addEventListener('click', function(){
  musicNotation = musicNotation==='en' ? 'th' : 'en';
  localStorage.setItem('p1quiz_music_notation', musicNotation);
  this.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  renderPianoKeys($('fp-piano'), false);
  renderFreePianoNotes();
});
$('fp-piano').addEventListener('pointerdown', e=>{
  const key = e.target.closest('.music-key'); if(!key) return;
  e.preventDefault();
  if(key.classList.contains('music-black')){ playPianoNote(MUSIC_BLACK_KEYS[+key.dataset.black].freq, 0.7); flashKey(key); return; }
  const wi = +key.dataset.white;
  playPianoNote(MUSIC_WHITE_KEYS[wi].freq, 0.9);
  flashKey(key);
  // โหมดเล่นตามเพลง: กดถูกตัวถัดไป (เทียบชื่อโน้ต) แล้วเดินหน้าไฮไลต์ กดผิดไม่เป็นไร (เล่นอิสระ)
  if(freePiano.song && sameNote(wi, freePiano.song.notes[freePiano.pos])){
    freePiano.pos++;
    if(freePiano.pos >= freePiano.song.notes.length){
      renderFreePianoNotes();
      mascotHappy(); playCorrect();
      setTimeout(()=>{ freePiano.pos = 0; renderFreePianoNotes(); }, 900);
    } else {
      renderFreePianoNotes();
    }
  }
});

/* ============================= LISTEN WORD-SPELLING GAME (เกมฟังคำศัพท์ 1/2) ============================= */
/* mode:'hint' (ฟังคำศัพท์ 1) เฉลยบางตัวอักษรให้ในช่องคำตอบ (ด่าน 1-5 เฉลย 2 ตัว, ด่าน 6-10 เฉลย 1 ตัว)
   mode:'nohint' (ฟังคำศัพท์ 2) ไม่เฉลยเลย เด็กหาและเรียงตัวอักษรเองทั้งหมดทุกด่าน */
let listenGame = null; // {catId, level, mistakes, totalLevels, word, letters, hintPositions, filled, cardEls, usedWordIdx, noThaiVoice, symbol}

/* หา voice ภาษาไทยที่ติดตั้งไว้ในเบราว์เซอร์ (ถ้ามี) เพื่อ set ให้ utterance ใช้ตรงๆ แทนการพึ่ง lang อย่างเดียว
   (บาง browser เลือก voice ผิดถ้าไม่ได้ set .voice ให้ชัดเจน) */
function pickThaiVoice(){
  if(!window.speechSynthesis) return null;
  return speechSynthesis.getVoices().find(v=>v.lang && v.lang.toLowerCase().startsWith('th')) || null;
}

/* เช็คว่าเบราว์เซอร์นี้มีเสียงพูดภาษาไทยติดตั้งไว้ไหม (บาง browser โหลด voice list แบบ async ผ่าน event 'voiceschanged')
   ใช้แค่ตัดสินใจว่าจะโชว์รูปคำใบ้เสริมไหม ไม่ได้ใช้ปิดกั้นการพยายามพูดจริง (กันกรณี detect พลาดแล้วเสียงไม่ออกทั้งที่มี voice) */
function hasThaiVoiceSupport(){
  return new Promise(resolve=>{
    if(!window.speechSynthesis){ resolve(false); return; }
    const check = ()=> speechSynthesis.getVoices().some(v=>v.lang && v.lang.toLowerCase().startsWith('th'));
    if(speechSynthesis.getVoices().length){ resolve(check()); return; }
    let done = false;
    const finish = ()=>{ if(done) return; done = true; resolve(check()); };
    speechSynthesis.addEventListener('voiceschanged', finish, {once:true});
    setTimeout(finish, 1000);
  });
}

/* ไล่ความยากคำไทยตามด่าน: ด่าน 1-4 คำ 3 ตัวอักษร, 5-8 คำ 4 ตัวอักษร, 9-10 คำ 5 ตัวอักษร */
function listenThaiWordLen(level){
  if(level<=4) return 3;
  if(level<=8) return 4;
  return 5;
}

/* จำนวนตัวอักษรที่เฉลยให้ (เฉพาะ mode 'hint' คือ ฟังคำไทย 1) ลดลงทุกครึ่งของแต่ละช่วงความยาวคำ */
function listenThaiHintCount(cat, level){
  if(cat.mode!=='hint') return 0;
  if(level<=2) return 2;
  if(level<=4) return 1;
  if(level<=6) return 2;
  if(level<=8) return 1;
  return level<=9 ? 2 : 1;
}

async function startListenGame(catId){
  stopARGame();
  lastGameType = 'listen'; lastCatId = catId;
  const cat = catById(catId);
  listenGame = {
    catId, level:1, mistakes:0, totalLevels:cat.levels, noThaiVoice:false,
    usedWordIdx: cat.lang==='th' ? {3:new Set(), 4:new Set(), 5:new Set()} : new Set()
  };
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = true; memoryView.hidden = true; listenView.hidden = false; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  listenView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('listen-cat-label', cat);
  if(cat.lang==='th'){
    listenGame.noThaiVoice = !(await hasThaiVoiceSupport());
    if(listenGame.noThaiVoice) showToast('🔇','เบราว์เซอร์นี้ไม่รองรับเสียงพูดภาษาไทย ระบบจะโชว์รูปคำใบ้แทนนะ');
  }
  renderListenLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

function speakListenWord(word){
  if(!window.speechSynthesis){ showToast('🔇','เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง'); return; }
  speechSynthesis.cancel(); // ตัดเสียงเดิมที่ค้างอยู่ก่อนพูดคำใหม่ กันเสียงซ้อนกันตอนกดรัวๆ
  const cat = listenGame ? catById(listenGame.catId) : null;
  const u = new SpeechSynthesisUtterance(word);
  if(cat && cat.lang==='th'){
    const voice = pickThaiVoice();
    if(voice) u.voice = voice; // set voice ตรงๆ แทนพึ่ง lang อย่างเดียว บาง browser เลือก voice ผิด/ไม่พูดถ้าไม่ set
    u.lang = 'th-TH';
  } else {
    u.lang = 'en-US';
  }
  u.rate = 0.85;
  // Chrome มีบั๊กที่ speak() ทันทีหลัง cancel() บางทีเงียบเฉยๆ ต้องรอ event loop รอบถัดไปก่อนค่อยพูด
  setTimeout(()=> speechSynthesis.speak(u), 30);
}

function renderListenLevel(){
  const cat = catById(listenGame.catId);
  if(cat.lang==='th') prepareListenLevelTh(cat);
  else prepareListenLevelEn(cat);
}

function prepareListenLevelEn(cat){
  const level = listenGame.level;
  const idx = pickNoRepeatIdx(listenGame.usedWordIdx, LISTEN_WORDS.length);
  const word = LISTEN_WORDS[idx];
  const letters = word.split('');

  /* เฉลยตัวอักษร: เฉพาะ mode 'hint' (ฟังคำศัพท์ 1) เท่านั้น — เลือกตำแหน่งเฉลยแบบสุ่ม ไม่ตายตัวว่าต้องเป็นตัวแรก/ท้าย */
  let hintCount = 0;
  if(cat.mode==='hint') hintCount = level<=5 ? 2 : 1;
  const positions = shuffleArray(letters.map((_,i)=>i));
  const hintPositions = positions.slice(0, hintCount);
  const findPositions = positions.slice(hintCount);

  /* จำนวนตัวอักษรหลอกเพิ่มตามความยากของด่าน — เกมฟังคำศัพท์ 2 (mode 'nohint') จำกัดการ์ดรวมไว้ไม่เกิน 5 ใบเสมอ
     (ไม่เฉลยเลย ต้องหาครบ 3 ตัวอยู่แล้ว ถ้าการ์ดเยอะเกินไปจะยากเกินไปสำหรับเด็ก 5 ขวบ) */
  const neededLetters = findPositions.map(p=>letters[p]);
  let decoyCount = level<=3 ? 2 : (level<=6 ? 3 : 4);
  if(cat.mode==='nohint') decoyCount = Math.min(decoyCount, 5-neededLetters.length);
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c=>!letters.includes(c));
  shuffleArray(alphabet);
  const decoys = alphabet.slice(0, decoyCount);

  listenGame.symbol = null;
  finalizeListenLevel(cat, word, letters, hintPositions, neededLetters, decoys);
}

function prepareListenLevelTh(cat){
  const level = listenGame.level;
  const wordLen = listenThaiWordLen(level);
  const pool = LISTEN_WORDS_TH[wordLen];
  const idx = pickNoRepeatIdx(listenGame.usedWordIdx[wordLen], pool.length);
  const entry = pool[idx];
  const word = entry.w;
  const letters = word.split('');

  const hintCount = listenThaiHintCount(cat, level);
  const positions = shuffleArray(letters.map((_,i)=>i));
  const hintPositions = positions.slice(0, hintCount);
  const findPositions = positions.slice(hintCount);
  const neededLetters = findPositions.map(p=>letters[p]);

  let decoyCount = wordLen<=3 ? 2 : (wordLen<=4 ? 3 : 4);
  if(cat.mode==='nohint'){
    const cap = wordLen<=3 ? 5 : (wordLen<=4 ? 6 : 7);
    decoyCount = Math.max(0, Math.min(decoyCount, cap-letters.length));
  }
  const decoyPool = THAI_DECOY_CHARS.filter(c=>!letters.includes(c));
  shuffleArray(decoyPool);
  const decoys = decoyPool.slice(0, decoyCount);

  listenGame.symbol = entry.e;
  finalizeListenLevel(cat, word, letters, hintPositions, neededLetters, decoys);
}

function finalizeListenLevel(cat, word, letters, hintPositions, neededLetters, decoys){
  const level = listenGame.level;
  const cardLetters = shuffleArray([...neededLetters, ...decoys]);

  listenGame.word = word;
  listenGame.letters = letters;
  listenGame.hintPositions = hintPositions;
  listenGame.filled = {};   // ตำแหน่ง -> ตัวอักษรที่เด็กเลือกเอง (ไม่รวมตำแหน่งเฉลย)
  listenGame.cardEls = {};  // ตัวอักษร -> การ์ด element (ตัวอักษรในด่านเดียวกันไม่ซ้ำกันเอง จึงใช้เป็น key ได้)

  const slotsEl = $('listen-slots');
  slotsEl.innerHTML = '';
  letters.forEach((letter, pos)=>{
    const slot = document.createElement('div');
    const isHint = hintPositions.includes(pos);
    slot.className = 'listen-slot'+(isHint ? ' hint' : ' empty');
    slot.dataset.pos = pos;
    if(isHint){ slot.textContent = letter; }
    else { slot.addEventListener('click', ()=> undoListenSlot(pos)); }
    slotsEl.appendChild(slot);
  });

  const cardsEl = $('listen-cards');
  cardsEl.innerHTML = '';
  cardLetters.forEach(letter=>{
    const card = document.createElement('button');
    card.className = 'listen-card';
    card.type = 'button';
    card.textContent = letter;
    card.addEventListener('click', ()=> placeListenLetter(letter, card));
    cardsEl.appendChild(card);
    listenGame.cardEls[letter] = card;
  });

  $('listen-level-counter').textContent = level+'/'+listenGame.totalLevels;
  $('listen-progress-fill').style.width = ((level-1)/listenGame.totalLevels*100)+'%';
  $('listen-hint').textContent = '🎧 กดปุ่มฟังคำศัพท์ แล้วเลือกตัวอักษรมาต่อคำให้ถูกนะ!';

  const symbolEl = $('listen-symbol');
  if(cat.lang==='th' && listenGame.noThaiVoice && listenGame.symbol){
    symbolEl.textContent = listenGame.symbol;
    symbolEl.hidden = false;
  } else {
    symbolEl.hidden = true;
  }
}

function placeListenLetter(letter, cardEl){
  if(cardEl.classList.contains('used')) return;
  const slotsEl = $('listen-slots');
  const emptySlot = Array.from(slotsEl.children).find(s=>s.classList.contains('empty') && !s.classList.contains('filled'));
  if(!emptySlot) return;
  const pos = Number(emptySlot.dataset.pos);
  listenGame.filled[pos] = letter;
  emptySlot.textContent = letter;
  emptySlot.classList.add('filled');
  cardEl.classList.add('used');
  playClick();

  const totalFilled = Object.keys(listenGame.filled).length + listenGame.hintPositions.length;
  if(totalFilled === listenGame.letters.length) checkListenAnswer();
}

/* คลิกช่องคำตอบที่เด็กใส่เอง (ไม่ใช่ช่องเฉลย) เพื่อยกเลิก คืนตัวอักษรกลับไปในการ์ด ให้แก้ไขก่อนครบทุกช่อง */
function undoListenSlot(pos){
  if(listenGame.hintPositions.includes(pos)) return;
  const letter = listenGame.filled[pos];
  if(letter === undefined) return;
  delete listenGame.filled[pos];
  const slotsEl = $('listen-slots');
  const slot = Array.from(slotsEl.children).find(s=>Number(s.dataset.pos)===pos);
  slot.textContent = '';
  slot.classList.remove('filled');
  const cardEl = listenGame.cardEls[letter];
  if(cardEl) cardEl.classList.remove('used');
  playClick();
}

function checkListenAnswer(){
  const attempt = listenGame.letters.map((_, pos)=>
    listenGame.hintPositions.includes(pos) ? listenGame.letters[pos] : listenGame.filled[pos]
  );
  if(attempt.join('') === listenGame.word) listenLevelSuccess();
  else listenLevelMistake();
}

function listenLevelMistake(){
  listenGame.mistakes++;
  playWrong();
  mascotOops();
  const slotsEl = $('listen-slots');
  Array.from(slotsEl.children).forEach(s=>s.classList.add('wrong'));
  $('listen-hint').textContent = '🤔 ยังไม่ถูกนะ ลองเลือกตัวอักษรใหม่ดูสิ!';
  setTimeout(()=>{
    Array.from(slotsEl.children).forEach(s=>{
      s.classList.remove('wrong');
      const pos = Number(s.dataset.pos);
      if(listenGame.hintPositions.includes(pos)) return;
      s.textContent = '';
      s.classList.remove('filled');
    });
    Object.values(listenGame.filled).forEach(letter=>{
      const cardEl = listenGame.cardEls[letter];
      if(cardEl) cardEl.classList.remove('used');
    });
    listenGame.filled = {};
  }, 1000);
}

function listenLevelSuccess(){
  playCorrect();
  mascotHappy();
  burstCenterTop(30);
  showOwlMsg('correct');
  $('listen-hint').textContent = '🎉 เก่งมาก! สะกดถูกต้อง!';
  $('listen-progress-fill').style.width = (listenGame.level/listenGame.totalLevels*100)+'%';
  setTimeout(()=>{
    if(listenGame.level >= listenGame.totalLevels){ finishListenGame(); }
    else { listenGame.level++; renderListenLevel(); }
  }, 1300);
}

function finishListenGame(){
  const cat = catById(listenGame.catId);
  const mistakes = listenGame.mistakes;
  const totalLevels = listenGame.totalLevels;
  listenView.hidden = true; resultView.hidden = false;

  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = {
    best: prev ? Math.max(prev.best, totalLevels) : totalLevels,
    stars: prev ? Math.max(prev.stars, stars) : stars,
    unlocked: wasUnlocked || stars>=2
  };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });

  $('score-line').textContent = 'ฟังคำศัพท์ครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('listen-speak-btn').addEventListener('click', ()=>{
  playClick();
  if(listenGame && listenGame.word) speakListenWord(listenGame.word);
});
$('listen-back').addEventListener('click', ()=>{
  playClick();
  if(window.speechSynthesis) speechSynthesis.cancel();
  listenView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= AR SENTENCE-BUILDER GAME ============================= */
const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],
  [0,17]
];

let arGame = null;             // {catId, level, mistakes, totalLevels}
let arActive = false;          // hand-tracking running?
let arHands = null, arCamera = null, arStream = null, arRafId = null, arResizeHandler = null;
let arLandmarks = null;        // latest hand landmarks from onResults
let arHandSmooth = null;       // landmark (พิกัด pixel) ผ่าน temporal smoothing แล้ว — ลด jitter ให้มือ/cursor ขยับนุ่มขึ้น
let arWasPinching = false;
let arDraggingCard = null, arDragSource = null; // 'hand' | 'mouse'
let arDragLineFrom = null;     // {side, key, x, y, el} anchor dot for match-mode line drag
let _mpLoadPromise = null;

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}
function shuffleDomChildren(container){
  const kids = Array.from(container.children);
  shuffleArray(kids).forEach(k=>container.appendChild(k));
}

function loadScriptOnce(src){
  return new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = src; s.crossOrigin = 'anonymous';
    s.onload = ()=>resolve();
    s.onerror = ()=>reject(new Error('โหลดสคริปต์ไม่สำเร็จ: '+src));
    document.head.appendChild(s);
  });
}
function loadMediaPipeScripts(){
  if(window.Hands && window.Camera) return Promise.resolve();
  if(_mpLoadPromise) return _mpLoadPromise;
  _mpLoadPromise = loadScriptOnce('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
    .then(()=>loadScriptOnce('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'))
    .then(()=>{ if(!window.Hands || !window.Camera) throw new Error('ไม่พบ MediaPipe Hands/Camera'); });
  return _mpLoadPromise;
}

/* สุ่ม index ที่ยังไม่เคยใช้ใน usedSet ของรอบนี้ (กันด่านซ้ำ) ถ้าใช้ครบทุกตัวในพูลแล้วค่อยเคลียร์เริ่มใหม่ */
function pickNoRepeatIdx(usedSet, poolLength){
  if(poolLength<=0) return 0;
  if(usedSet.size >= poolLength) usedSet.clear();
  let idx;
  do{ idx = Math.floor(Math.random()*poolLength); } while(usedSet.has(idx));
  usedSet.add(idx);
  return idx;
}

function buildLevel(catId){
  const cat = catById(catId);
  $('ar-math-problem').hidden = true;
  $('ar-slot-row').hidden = false;
  $('ar-match-wrap').hidden = true;
  $('ar-count-question').hidden = true;
  $('ar-count-zone').hidden = true;
  if(cat.mode==='math'){ buildMathLevel(cat); return; }
  if(cat.mode==='match'){ buildMatchLevel(cat); return; }
  if(cat.mode==='count'){ buildCountLevel(cat); return; }
  const level = arGame.level;
  const wordCount = level<=3 ? 3 : (level<=6 ? 4 : 5);
  const pool = AR_SENTENCES[cat.lang][wordCount];
  if(!arGame.usedSentenceIdx[wordCount]) arGame.usedSentenceIdx[wordCount] = new Set();
  const sentence = pool[pickNoRepeatIdx(arGame.usedSentenceIdx[wordCount], pool.length)];
  renderSlotsAndCards(sentence);
  showARHint(isMobileViewport()
    ? (cat.lang==='th' ? '👆 แตะคำแล้วลากไปเรียงในช่องให้ถูกลำดับนะ!' : '👆 Tap a word card and drag it into the right box!')
    : (cat.lang==='th' ? '✋ จีบนิ้วหยิบคำ แล้วลากไปเรียงในช่องให้ถูกลำดับนะ!' : '✋ Pinch a word card and drag it into the right box!'));
}

/* scatter position in a safe zone away from screen edges (hand tracking loses the hand near frame edges), spread across `n` horizontal slices */
/* minTop: optional override to push the top of the safe band lower (e.g. below a tall answer zone) so scattered items don't spawn on top of it */
function scatterPosition(pos, n, minTop){
  const safeLeft = 18, safeWidth = 64;   // keep horizontal center within 18%-82%
  const maxSafeBottom = 76;              // bottom of the safe band never moves, only the top does
  const safeTop = Math.min(Math.max(42, minTop||0), maxSafeBottom-10); // always leave at least a 10%-tall band
  const safeHeight = maxSafeBottom - safeTop;
  const slotW = safeWidth/n;
  const left = (safeLeft + slotW*pos + Math.random()*slotW*0.3).toFixed(1)+'%';
  /* zig-zag rows (alternate near-top/near-bottom of the safe band) so bigger cards don't overlap each other */
  const rowH = safeHeight/2;
  const top = (safeTop + (pos%2)*rowH + Math.random()*rowH).toFixed(1)+'%';
  return { left, top };
}
function placeCardAtScatterPos(card, pos, n, minTop){
  const { left, top } = scatterPosition(pos, n, minTop);
  card.dataset.origLeft = left;
  card.dataset.origTop = top;
  card.style.left = left;
  card.style.top = top;
  card.style.animationDelay = (pos*0.06)+'s';
}

function renderSlotsAndCards(sentence){
  const slotRow = $('ar-slot-row');
  slotRow.innerHTML = '';
  sentence.forEach((_,i)=>{
    const s = document.createElement('div');
    s.className = 'ar-slot';
    s.dataset.slotIndex = i;
    s.innerHTML = '<span class="ar-slot-ph">'+(i+1)+'</span>';
    slotRow.appendChild(s);
  });

  const cardsRow = $('ar-cards-row');
  cardsRow.innerHTML = '';
  const order = shuffleArray(sentence.map((_,i)=>i));
  const n = order.length;
  order.forEach((i, pos)=>{
    const w = sentence[i];
    const card = document.createElement('div');
    card.className = 'ar-card';
    card.dataset.correctIndex = i;
    card.innerHTML = '<span class="ar-card-emoji">'+w.e+'</span><span class="ar-card-word">'+w.w+'</span>';
    placeCardAtScatterPos(card, pos, n);
    wireCardDrag(card);
    cardsRow.appendChild(card);
  });
}

/* ---- AR math mode: random 1-2 digit addition/subtraction, pick the 1 correct answer card out of 3 ---- */
function buildMathLevel(cat){
  const level = arGame.level;
  /* mathTiers: [[min,max] ด่าน 1-3, [min,max] ด่าน 4-7, [min,max] ด่าน 8-10] ไล่ตามความยากของแต่ละหมวด */
  const tier = level<=3 ? cat.mathTiers[0] : (level<=7 ? cat.mathTiers[1] : cat.mathTiers[2]);
  const [lo, hi] = tier;
  let a, b;
  const op = Math.random()<0.5 ? '+' : '-';
  a = Math.floor(Math.random()*(hi-lo+1))+lo;
  b = Math.floor(Math.random()*(hi-lo+1))+lo;
  if(op==='-' && b>a){ const t=a; a=b; b=t; } // avoid negative answers
  const answer = op==='+' ? a+b : a-b;
  renderMathPuzzle(a, b, op, answer, cat.mathChoices || 3);
  showARHint(isMobileViewport()
    ? '👆 แตะการ์ดคำตอบที่ถูกต้อง แล้วลากไปใส่ในช่องนะ!'
    : '✋ จีบนิ้วหยิบการ์ดคำตอบที่ถูกต้อง แล้วลากไปใส่ในช่องนะ!');
}

function renderMathPuzzle(a, b, op, answer, numChoices){
  numChoices = numChoices || 3;
  const problemEl = $('ar-math-problem');
  problemEl.hidden = false;
  problemEl.textContent = a+' '+op+' '+b+' = ?';

  const slotRow = $('ar-slot-row');
  slotRow.innerHTML = '';
  const s = document.createElement('div');
  s.className = 'ar-slot';
  s.dataset.slotIndex = 0;
  s.innerHTML = '<span class="ar-slot-ph">❓</span>';
  slotRow.appendChild(s);

  /* build N unique non-negative choices: the correct answer + nearby distractors */
  const choices = new Set([answer]);
  let guard = 0;
  while(choices.size<numChoices && guard<50){
    guard++;
    const delta = Math.floor(Math.random()*10)-5;
    const val = answer + delta;
    if(delta!==0 && val>=0) choices.add(val);
  }
  const order = shuffleArray(Array.from(choices));

  const cardsRow = $('ar-cards-row');
  cardsRow.innerHTML = '';
  const n = order.length;
  order.forEach((val, pos)=>{
    const card = document.createElement('div');
    card.className = 'ar-card';
    card.dataset.correctIndex = (val===answer) ? 0 : -1;
    card.innerHTML = '<span class="ar-card-word ar-card-num">'+val+'</span>';
    placeCardAtScatterPos(card, pos, n);
    wireCardDrag(card);
    cardsRow.appendChild(card);
  });
}

/* ---- AR match mode: drag a line from a symbol on the left to its matching word on the right ---- */
function buildMatchLevel(cat){
  $('ar-slot-row').hidden = true;
  $('ar-cards-row').innerHTML = '';
  $('ar-match-wrap').hidden = false;
  const level = arGame.level;
  const n = level<=3 ? 3 : (level<=6 ? 4 : 5);
  const pool = AR_MATCH_ITEMS[cat.lang || 'th'];
  /* เลือกคู่ที่ยังไม่เคยออกในรอบนี้ก่อน กันด่านซ้ำ ถ้าเหลือไม่พอสำหรับด่านนี้ค่อยเคลียร์แล้วเริ่มใหม่ */
  let availableIdx = pool.map((_,i)=>i).filter(i=>!arGame.usedMatchKeys.has(i));
  if(availableIdx.length < n){ arGame.usedMatchKeys.clear(); availableIdx = pool.map((_,i)=>i); }
  const chosenIdx = shuffleArray(availableIdx).slice(0, n);
  chosenIdx.forEach(i=>arGame.usedMatchKeys.add(i));
  const items = chosenIdx.map(i=>pool[i]);
  renderMatchPairs(items, n);
  showARHint(isMobileViewport()
    ? (cat.lang==='th' ? '👆 แตะจุดวงกลมแล้วลากเส้นไปยังคำตอบที่ตรงกันนะ!' : '👆 Tap a dot and drag a line to its matching answer!')
    : (cat.lang==='th' ? '✋ แตะจุดวงกลมแล้วลากเส้นไปยังคำตอบที่ตรงกัน (จีบนิ้วถ้าอยากยกเลิก)' : '✋ Tap a dot and drag a line to its match (pinch to cancel)'));
}

function renderMatchPairs(items, n){
  const svg = $('ar-match-svg');
  svg.innerHTML = '';
  const leftCol = $('ar-match-left');
  const rightCol = $('ar-match-right');
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';
  const colGap = n<=3 ? '60px' : n===4 ? '40px' : '26px';
  leftCol.style.gap = colGap;
  rightCol.style.gap = colGap;

  const rightOrder = shuffleArray(items.map((_,i)=>i));

  items.forEach((it, i)=>{
    const row = document.createElement('div');
    row.className = 'ar-match-item';
    row.dataset.key = i;
    row.innerHTML = '<span class="ar-match-emoji">'+it.e+'</span><span class="ar-dot" data-side="left" data-key="'+i+'"></span>';
    leftCol.appendChild(row);
  });
  rightOrder.forEach(i=>{
    const it = items[i];
    const row = document.createElement('div');
    row.className = 'ar-match-item';
    row.dataset.key = i;
    row.innerHTML = '<span class="ar-dot" data-side="right" data-key="'+i+'"></span><span class="ar-match-word">'+it.w+'</span>';
    rightCol.appendChild(row);
  });

  leftCol.querySelectorAll('.ar-dot').forEach(wireMatchDot);
  rightCol.querySelectorAll('.ar-dot').forEach(wireMatchDot);
}

/* ---- AR count mode: read the question, pinch-grab matching symbols into the answer basket (tablet/desktop only) ---- */
function buildCountLevel(cat){
  $('ar-slot-row').hidden = true;
  $('ar-count-question').hidden = false;
  $('ar-count-zone').hidden = false;
  const level = arGame.level;
  const tier = level<=3 ? 'easy' : (level<=6 ? 'medium' : 'hard');
  const pool = AR_COUNT_QUESTIONS[tier];
  if(!arGame.usedCountIdx[tier]) arGame.usedCountIdx[tier] = new Set();
  const idx = pickNoRepeatIdx(arGame.usedCountIdx[tier], pool.length);
  const q = pool[idx];
  arGame.countQuestion = q;
  arGame.zoneCount = 0;
  arGame.zoneLocked = false;
  $('ar-count-question').textContent = q.q;
  scatterCountItems(q); // resets the zone's contents (including the tally line) fresh
  showARHint('✋ จีบนิ้วหยิบของแล้วลากไปใส่ตะกร้าให้ครบตามโจทย์นะ!');
}

/* count mode often has more items on screen than the other AR games (up to ~10), so instead of the
   generic sequential-band scatter (shared with sentence/math/match), lay them out on a grid: each item
   gets its own cell (no two items can ever share space) and only jitters a bit within that cell — this
   also lets it use more of the screen, closer to the left/right/bottom edges, without crowding or overlap */
function scatterCountItems(q){
  const zone = $('ar-count-zone');
  zone.innerHTML = '<div class="ar-count-zone-label">'+
    '<span class="ar-count-zone-ph" id="ar-count-zone-ph">วางของตรงนี้</span>'+
    '<span class="ar-count-tally" id="ar-count-tally">หยิบแล้ว 0 ชิ้น</span>'+
    '</div>';
  const cardsRow = $('ar-cards-row');
  cardsRow.innerHTML = '';
  /* keep scattered items below the answer zone so they never spawn on top of it */
  const zoneRect = zone.getBoundingClientRect();
  const minTopPct = (zoneRect.bottom / window.innerHeight * 100) + 4;
  const flat = [];
  q.items.forEach(item=>{
    for(let i=0;i<item.count;i++) flat.push(item);
  });
  const order = shuffleArray(flat);
  const n = order.length;

  const safeLeft = 8, safeRight = 88;   // keep item centers within 8%-88% horizontally
  const maxSafeBottom = 88;             // bottom of the grid never moves lower than this
  const safeTop = Math.min(Math.max(42, minTopPct), maxSafeBottom-14); // always leave at least a 14%-tall grid
  /* a plain emoji card is ~72px on tablet, ~84px on desktop (see .ar-card-plain / its @media(min-width:1025px)
     override in css/style.css) — pad generously so cells stay comfortably bigger than a card even after jitter */
  const cardPx = window.innerWidth>=1025 ? 84 : 72;
  const minCellW = cardPx + 80, minCellH = cardPx + 70;
  const availPxW = window.innerWidth * (safeRight-safeLeft)/100;
  const availPxH = window.innerHeight * (maxSafeBottom-safeTop)/100;
  const maxColsByWidth = Math.max(1, Math.floor(availPxW/minCellW));
  const maxRowsByHeight = Math.max(1, Math.floor(availPxH/minCellH));
  let cols = Math.max(1, Math.min(Math.ceil(Math.sqrt(n*1.6)), maxColsByWidth));
  if(Math.ceil(n/cols) > maxRowsByHeight){
    /* not enough vertical room for that many rows — trade for more columns instead, up to the width cap */
    cols = Math.min(maxColsByWidth, Math.ceil(n/maxRowsByHeight));
  }
  const rows = Math.ceil(n/cols); // always recomputed from the final `cols` so every item is guaranteed a cell
  const colW = (safeRight-safeLeft)/cols;
  const rowH = (maxSafeBottom-safeTop)/rows;
  /* jitter amplitude is capped by how much room is actually left in the cell beyond the card itself, not a flat
     fraction of the cell — otherwise a jitter that's "20% of a barely-big-enough cell" can still cause overlap */
  const colWpx = colW/100*window.innerWidth, rowHpx = rowH/100*window.innerHeight;
  const jitterXpx = Math.max(0, (colWpx-cardPx)/2*0.5);
  const jitterYpx = Math.max(0, (rowHpx-cardPx)/2*0.5);
  const jitterXpct = jitterXpx/window.innerWidth*100, jitterYpct = jitterYpx/window.innerHeight*100;

  order.forEach((item, pos)=>{
    const card = document.createElement('div');
    card.className = 'ar-card ar-card-plain';
    card.dataset.itemKey = item.key;
    card.innerHTML = '<span class="ar-card-emoji">'+item.emoji+'</span>';
    const col = pos % cols, row = Math.floor(pos/cols);
    const left = (safeLeft + colW*(col+0.5) + (Math.random()-0.5)*2*jitterXpct).toFixed(1)+'%';
    const top = (safeTop + rowH*(row+0.5) + (Math.random()-0.5)*2*jitterYpct).toFixed(1)+'%';
    card.dataset.origLeft = left;
    card.dataset.origTop = top;
    card.style.left = left;
    card.style.top = top;
    card.style.animationDelay = (pos*0.06)+'s';
    wireCardDrag(card);
    cardsRow.appendChild(card);
  });
}

function showARHint(text){ $('ar-hint').textContent = text; }

/* ---- drag & drop (shared by hand-pinch and mouse/touch pointer events) ---- */
function wireCardDrag(card){
  card.addEventListener('pointerdown', e=>{
    if(arDraggingCard) return;
    e.preventDefault();
    startDragCard(card, 'mouse');
  });
}
document.addEventListener('pointermove', e=>{
  if(arDraggingCard && arDragSource==='mouse') moveDraggingCardTo(e.clientX, e.clientY);
  if(arDragLineFrom && arDragSource==='mouse') updateTempLine(e.clientX, e.clientY);
});
document.addEventListener('pointerup', e=>{
  if(arDraggingCard && arDragSource==='mouse') attemptDrop(arDraggingCard, e.clientX, e.clientY);
  if(arDragLineFrom && arDragSource==='mouse') attemptLineDrop(e.clientX, e.clientY);
});
document.addEventListener('pointercancel', ()=>{
  if(arDraggingCard && arDragSource==='mouse'){ returnCardToPool(arDraggingCard); arDraggingCard=null; arDragSource=null; }
  if(arDragLineFrom && arDragSource==='mouse'){ cancelDragLine(); }
});

function liftCardFromSlot(card){
  const slot = card.closest && card.closest('.ar-slot');
  if(!slot) return;
  card.classList.remove('placed');
  slot.classList.remove('filled');
  const cat = arGame && catById(arGame.catId);
  const slotIdx = Array.from(slot.parentElement.children).indexOf(slot);
  slot.innerHTML = '<span class="ar-slot-ph">'+(cat && cat.mode==='math' ? '❓' : (slotIdx+1))+'</span>';
  const r = slot.getBoundingClientRect();
  const layer = $('ar-cards-row');
  layer.appendChild(card);
  card.style.left = (r.left + r.width/2) + 'px';
  card.style.top  = (r.top  + r.height/2) + 'px';
}
function startDragCard(card, source){
  if(card.classList.contains('placed')) liftCardFromSlot(card);
  arDraggingCard = card;
  arDragSource = source;
  card.classList.add('dragging');
  playClick();
}
/* กันการ์ดหลุดออกนอกจอ — จำกัดจุดศูนย์กลางการ์ด (จุดอ้างอิงตอน dragging คือ left/top จริงเพราะใช้ translate(-50%,-50%))
   ไม่ให้เกินขอบจอ โดยเผื่อระยะครึ่งความกว้าง/สูงของการ์ดเองไว้เสมอ */
function clampToViewport(x, y, card){
  const r = card.getBoundingClientRect();
  const halfW = r.width/2, halfH = r.height/2, margin = 6;
  const minX = halfW+margin, maxX = window.innerWidth-halfW-margin;
  const minY = halfH+margin, maxY = window.innerHeight-halfH-margin;
  return {
    x: Math.min(Math.max(x, minX), Math.max(minX,maxX)),
    y: Math.min(Math.max(y, minY), Math.max(minY,maxY)),
  };
}
function moveDraggingCardTo(x,y){
  if(!arDraggingCard) return;
  const p = clampToViewport(x, y, arDraggingCard);
  arDraggingCard.style.left = p.x+'px';
  arDraggingCard.style.top = p.y+'px';
}
function attemptDrop(card, x, y){
  const cat = catById(arGame.catId);
  if(cat.mode==='count'){ attemptCountDrop(card, x, y); return; }
  card.classList.remove('dragging');
  card.style.left = card.dataset.origLeft; card.style.top = card.dataset.origTop;
  const slots = Array.from($('ar-slot-row').children);
  const pad = 34; // generous drop tolerance so little hands don't need pixel-perfect aim
  let target = null, bestDist = Infinity;
  for(const s of slots){
    if(s.classList.contains('filled')) continue;
    const r = s.getBoundingClientRect();
    if(x>=r.left-pad && x<=r.right+pad && y>=r.top-pad && y<=r.bottom+pad){
      const cx = r.left+r.width/2, cy = r.top+r.height/2;
      const d = (x-cx)*(x-cx) + (y-cy)*(y-cy);
      if(d < bestDist){ bestDist = d; target = s; }
    }
  }
  if(target){ placeCardInSlot(card, target); }
  else { leaveCardAtPos(card, x, y); }
  arDraggingCard = null; arDragSource = null;
}
function leaveCardAtPos(card, x, y){
  card.classList.remove('dragging');
  const layer = $('ar-cards-row');
  if(card.parentElement !== layer) layer.appendChild(card);
  /* หลังเอา class dragging ออก การ์ดกลับไปใช้ left/top แบบมุมบนซ้าย (ไม่ใช่จุดกึ่งกลางแบบตอนลาก)
     ต้องกันไม่ให้มุมบนซ้าย/ขวาล่างเกินขอบจอ การ์ดถึงจะไม่โผล่ครึ่งตัวหรือหลุดออกนอกจอ */
  const w = card.offsetWidth, h = card.offsetHeight, margin = 6;
  const maxX = window.innerWidth - w - margin, maxY = window.innerHeight - h - margin;
  const clampedX = Math.min(Math.max(x, margin), Math.max(margin, maxX));
  const clampedY = Math.min(Math.max(y, margin), Math.max(margin, maxY));
  card.style.left = clampedX + 'px';
  card.style.top  = clampedY + 'px';
}
function placeCardInSlot(card, slot){
  slot.innerHTML = '';
  card.classList.add('placed');
  slot.appendChild(card);
  slot.classList.add('filled');
  playClick();
  checkSlotsComplete();
}

/* ---- count mode: drop into the single answer basket (not a fixed per-position slot) ---- */
function attemptCountDrop(card, x, y){
  card.classList.remove('dragging');
  card.style.left = card.dataset.origLeft; card.style.top = card.dataset.origTop;
  const zone = $('ar-count-zone');
  const pad = 34;
  const r = zone.getBoundingClientRect();
  const inside = x>=r.left-pad && x<=r.right+pad && y>=r.top-pad && y<=r.bottom+pad;
  if(inside && !arGame.zoneLocked){ placeItemInZone(card); }
  else { leaveCardAtPos(card, x, y); }
  arDraggingCard = null; arDragSource = null;
}
function placeItemInZone(card){
  const ph = document.getElementById('ar-count-zone-ph');
  if(ph) ph.hidden = true;
  card.classList.add('placed');
  $('ar-count-zone').appendChild(card);
  playClick();
  arGame.zoneCount++;
  updateCountTally();
  checkCountComplete();
}
function updateCountTally(){
  $('ar-count-tally').textContent = 'หยิบแล้ว '+arGame.zoneCount+' ชิ้น';
}
function checkCountComplete(){
  const target = arGame.countQuestion.targetCount;
  if(arGame.zoneCount < target) return;
  arGame.zoneLocked = true;
  const cards = Array.from($('ar-count-zone').querySelectorAll('.ar-card'));
  const correct = cards.every(c=>c.dataset.itemKey===arGame.countQuestion.targetKey);
  if(correct) levelSuccess(); else levelMistake();
}
function returnCardToPool(card){
  card.classList.remove('dragging');
  card.style.left = card.dataset.origLeft; card.style.top = card.dataset.origTop;
}

/* ---- match mode: drag a line from a left dot to a right dot (shared by hand-pinch and mouse/touch) ---- */
function wireMatchDot(dot){
  dot.addEventListener('pointerdown', e=>{
    if(dot.classList.contains('matched') || arDraggingCard || arDragLineFrom) return;
    e.preventDefault();
    startDragLine(dot, 'mouse');
  });
}
function startDragLine(dot, source){
  const r = dot.getBoundingClientRect();
  arDragLineFrom = { side:dot.dataset.side, key:dot.dataset.key, x:r.left+r.width/2, y:r.top+r.height/2, el:dot };
  arDragSource = source;
  dot.classList.add('active-drag');
  playClick();
}
function updateTempLine(x, y){
  if(!arDragLineFrom) return;
  let line = document.getElementById('ar-match-templine');
  if(!line){
    line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.id = 'ar-match-templine';
    line.setAttribute('class', 'ar-match-line');
    line.setAttribute('stroke', '#FFC53D');
    line.setAttribute('stroke-dasharray', '3 9');
    $('ar-match-svg').appendChild(line);
  }
  line.setAttribute('x1', arDragLineFrom.x); line.setAttribute('y1', arDragLineFrom.y);
  line.setAttribute('x2', x); line.setAttribute('y2', y);
}
function clearTempLine(){
  const line = document.getElementById('ar-match-templine');
  if(line) line.remove();
}
function cancelDragLine(){
  clearTempLine();
  if(arDragLineFrom && arDragLineFrom.el) arDragLineFrom.el.classList.remove('active-drag');
  arDragLineFrom = null; arDragSource = null;
}
function attemptLineDrop(x, y){
  clearTempLine();
  const fromDot = arDragLineFrom.el;
  fromDot.classList.remove('active-drag');
  const targetSide = arDragLineFrom.side==='left' ? 'right' : 'left';
  const pad = 34; // generous drop tolerance so little hands don't need pixel-perfect aim
  let target = null, bestDist = Infinity;
  document.querySelectorAll('.ar-dot[data-side="'+targetSide+'"]:not(.matched)').forEach(d=>{
    const r = d.getBoundingClientRect();
    if(x>=r.left-pad && x<=r.right+pad && y>=r.top-pad && y<=r.bottom+pad){
      const cx = r.left+r.width/2, cy = r.top+r.height/2;
      const dist = (x-cx)*(x-cx) + (y-cy)*(y-cy);
      if(dist < bestDist){ bestDist = dist; target = d; }
    }
  });
  arDragLineFrom = null; arDragSource = null;
  if(!target) return;
  if(target.dataset.key === fromDot.dataset.key){ connectMatchPair(fromDot, target); }
  else { matchMistakeFlash(fromDot, target); }
}
function connectMatchPair(dotA, dotB){
  playClick();
  const ra = dotA.getBoundingClientRect(), rb = dotB.getBoundingClientRect();
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('class', 'ar-match-line');
  line.setAttribute('x1', ra.left+ra.width/2); line.setAttribute('y1', ra.top+ra.height/2);
  line.setAttribute('x2', rb.left+rb.width/2); line.setAttribute('y2', rb.top+rb.height/2);
  $('ar-match-svg').appendChild(line);
  [dotA, dotB].forEach(d=>{ d.classList.add('matched'); d.closest('.ar-match-item').classList.add('matched'); });
  const remaining = document.querySelectorAll('#ar-match-left .ar-dot:not(.matched)').length;
  if(remaining===0) setTimeout(levelSuccess, 350);
}
function matchMistakeFlash(dotA, dotB){
  arGame.mistakes++;
  playWrong();
  mascotOops();
  [dotA, dotB].forEach(d=>{ d.classList.add('wrong-flash'); setTimeout(()=>d.classList.remove('wrong-flash'), 450); });
  const cat = catById(arGame.catId);
  showARHint(cat.lang==='th' ? '🤔 ยังไม่ตรงกันนะ ลองโยงเส้นใหม่ดูสิ!' : '🤔 Not a match — try connecting a different line!');
}

function checkSlotsComplete(){
  const slots = Array.from($('ar-slot-row').children);
  if(slots.some(s=>!s.classList.contains('filled'))) return;
  const correct = slots.every((s,i)=>{
    const card = s.querySelector('.ar-card');
    return card && Number(card.dataset.correctIndex)===i;
  });
  if(correct) levelSuccess(); else levelMistake();
}

function levelMistake(){
  arGame.mistakes++;
  playWrong();
  mascotOops();
  const cat = catById(arGame.catId);
  if(cat.mode==='count'){ countLevelMistake(cat); return; }
  const slots = Array.from($('ar-slot-row').children);
  slots.forEach(s=>s.classList.add('wrong-flash'));
  showARHint(cat.mode==='math'
    ? '🤔 ยังไม่ถูกนะ ลองหยิบการ์ดคำตอบใหม่ดูสิ!'
    : (cat.lang==='th' ? '🤔 ยังไม่ถูกนะ ลองสลับคำใหม่ดูสิ!' : '🤔 Not quite right — try again!'));
  setTimeout(()=>{
    const cardsRow = $('ar-cards-row');
    slots.forEach((s,i)=>{
      const card = s.querySelector('.ar-card');
      if(card){ card.classList.remove('placed'); cardsRow.appendChild(card); }
      s.classList.remove('wrong-flash','filled');
      s.innerHTML = '<span class="ar-slot-ph">'+(cat.mode==='math' ? '❓' : (i+1))+'</span>';
    });
    shuffleDomChildren(cardsRow);
  }, 1000);
}

function countLevelMistake(cat){
  $('ar-count-zone').classList.add('wrong-flash');
  showARHint('🤔 ยังไม่ถูกนะ ลองหยิบใหม่ดูสิ!');
  setTimeout(()=>{
    $('ar-count-zone').classList.remove('wrong-flash');
    arGame.zoneCount = 0;
    arGame.zoneLocked = false;
    scatterCountItems(arGame.countQuestion); // resets the zone's contents (including the tally line) fresh
  }, 1000);
}

function levelSuccess(){
  playCorrect();
  mascotHappy();
  burstCenterTop(30);
  showOwlMsg('correct');
  const cat = catById(arGame.catId);
  showARHint(cat.mode==='math'
    ? '🎉 เก่งมาก! คำนวณถูกต้อง!'
    : cat.mode==='match'
      ? (cat.lang==='th' ? '🎉 เก่งมาก! โยงเส้นถูกต้องหมดเลย!' : '🎉 Great job! All lines matched correctly!')
      : cat.mode==='count'
        ? '🎉 เก่งมาก! หยิบของถูกต้องครบเลย!'
        : (cat.lang==='th' ? '🎉 เก่งมาก! ต่อประโยคถูกต้อง!' : '🎉 Great job! Sentence is correct!'));
  $('ar-progress-fill').style.width = (arGame.level/arGame.totalLevels*100)+'%';
  setTimeout(()=>{
    if(arGame.level >= arGame.totalLevels){ finishARGame(); }
    else { arGame.level++; renderARLevel(); }
  }, 1300);
}

/* ---- hand tracking (MediaPipe Hands) — flat cartoon hand, drawn on canvas ----
   มือการ์ตูนแบนสำหรับเด็ก วาดสดจาก landmark จริงทุกเฟรม (ไม่ใช่รูปนิ่ง) นิ้วขยับ/งอตามมือจริง
   รับ pts เป็นพิกัด pixel ที่ผ่าน temporal smoothing มาแล้วจาก arDrawLoop (ลด jitter จาก MediaPipe)
   องค์ประกอบความสวย: เงาสติกเกอร์ใต้มือ (silhouette วาดลง canvas สำรองแล้ว drawImage ด้วย alpha เดียว
   กันเงาซ้อนเข้มเป็นหย่อมตรงรอยต่อรูปทรง), ผิวไล่เฉด radial gradient, ปลอกแขนเสื้อพาสเทลที่ข้อมือ,
   เล็บนิ้วกลาง/นาง/ก้อย (เว้นโป้ง/ชี้ที่มีจุด indicator อยู่), จุด indicator แบบลูกแก้ว + halo เต้นตามเวลา */
let _handShadowCv = null;
function drawCartoonHand(ctx, pts){
  const blen = (a,b)=> Math.hypot(b.x-a.x, b.y-a.y);

  const OUTLINE  = '#E8A67F';
  const NAIL     = '#FFF4EC';
  const CUFF     = '#A5DCF5';
  const CUFF_DK  = '#5FAFD4';
  const handScale = blen(pts[0], pts[9]) || 1;
  const outlineW  = Math.max(1.5, handScale*0.03);

  /* ---- geometry (คำนวณครั้งเดียว ใช้ทั้ง pass เงาและ pass จริง) ---- */
  const palmCenter = {
    x:(pts[0].x+pts[5].x+pts[9].x+pts[13].x+pts[17].x)/5,
    y:(pts[0].y+pts[5].y+pts[9].y+pts[13].y+pts[17].y)/5,
  };
  const bulge = (p, factor)=>({
    x: palmCenter.x + (p.x-palmCenter.x)*factor,
    y: palmCenter.y + (p.y-palmCenter.y)*factor,
  });

  /* โครงฝ่ามือ: ข้อมือแคบกว่าช่วงโคนนิ้ว (สอบลงเล็กน้อย) และไม่ยืดยาวลงล่างเกินไป ให้ได้สัดส่วนมือเด็กป้อมๆ */
  const wLen = blen(pts[5], pts[17]) * 0.62;
  const dx = pts[0].x-pts[9].x, dy = pts[0].y-pts[9].y, r = Math.hypot(dx,dy)||1;
  const wristBase = bulge(pts[0], 1.26);
  const wA = {x:wristBase.x-dy/r*wLen, y:wristBase.y+dx/r*wLen};
  const wB = {x:wristBase.x+dy/r*wLen, y:wristBase.y-dx/r*wLen};
  /* ฝั่งไหนใกล้โคนนิ้วโป้ง (pts[1]) มากกว่า ให้เป็นขอบข้อมือด้านนิ้วโป้ง จะได้แทรกจุดฐานนิ้วโป้งต่อให้เนียน ไม่มีช่องว่าง */
  const wristThumbSide = blen(wA,pts[1]) < blen(wB,pts[1]) ? wA : wB;
  const wristPinkySide = wristThumbSide===wA ? wB : wA;
  const thumbBase = bulge(pts[1], 1.22);
  const palmPts = [wristThumbSide, thumbBase, bulge(pts[5],1.32), bulge(pts[9],1.28), bulge(pts[13],1.32), bulge(pts[17],1.36), wristPinkySide];

  /* ปลอกแขนเสื้อ (cuff) capsule ที่ข้อมือ — จัดให้ tuck ใต้ขอบล่างฝ่ามือพอดี (ขอบบน cuff ซุกใต้ฝ่ามือ
     และความกว้างแคบกว่าฐานฝ่ามือเล็กน้อย) ให้ดูเป็นแขนเสื้อที่มือโผล่ออกมา ไม่ใช่แผ่นลอยแยกชิ้น */
  /* จุดกลาง cuff เลื่อนเข้าหาฝั่งก้อยเล็กน้อย — silhouette ฝ่ามือฝั่งก้อยกว้างกว่าฝั่งโป้ง (bulge 1.36 vs thumbBase 1.22)
     ถ้า center ตรงแกนข้อมือเป๊ะ cuff จะดูเยื้องออกฝั่งโป้งเวลามือเอียง */
  const pinkyDir = {x:(wristPinkySide.x-wristBase.x)/wLen, y:(wristPinkySide.y-wristBase.y)/wLen};
  const cuffC = {
    x:wristBase.x + dx/r*handScale*0.12 + pinkyDir.x*wLen*0.18,
    y:wristBase.y + dy/r*handScale*0.12 + pinkyDir.y*wLen*0.18
  };
  const cuffHalf = wLen*0.52;
  const cuffA = {x:cuffC.x-dy/r*cuffHalf, y:cuffC.y+dx/r*cuffHalf};
  const cuffB = {x:cuffC.x+dy/r*cuffHalf, y:cuffC.y-dx/r*cuffHalf};
  const cuffW = handScale*0.42;

  /* ความหนาโคนนิ้วแต่ละนิ้ว (ใช้ทั้งวาดปลอกคอเชื่อมฝ่ามือ และวาดตัวนิ้วเอง ให้ตรงกันเป๊ะ) */
  const thumbHalf=blen(pts[1],pts[2])*0.48;
  const idxBase=blen(pts[5],pts[6])*0.44, midBase=blen(pts[9],pts[10])*0.46,
        ringBase=blen(pts[13],pts[14])*0.44, pinkyBase=blen(pts[17],pts[18])*0.36;
  const collars = [[1,thumbHalf],[5,idxBase],[9,midBase],[13,ringBase],[17,pinkyBase]];

  /* extend: ยืดปลายนิ้ว (jts สุดท้าย) ออกไปอีกเล็กน้อยตามทิศทางท่อนสุดท้าย ให้นิ้วดูยาวสมส่วนขึ้น (เกินตำแหน่ง landmark จริงนิดหน่อย) */
  const extendTip = (jts, extend)=>{
    if(!extend) return jts;
    const n0 = jts.length;
    const bx=jts[n0-1].x-jts[n0-2].x, by=jts[n0-1].y-jts[n0-2].y, bl=Math.hypot(bx,by)||1;
    return [...jts.slice(0,n0-1), {x:jts[n0-1].x+bx/bl*extend, y:jts[n0-1].y+by/bl*extend}];
  };
  /* 5 นิ้ว — ทรง/ความหนาต่างกันตามสัดส่วนนิ้วจริง, nail = นิ้วที่มีเล็บ (กลาง/นาง/ก้อย) */
  const fingers = [
    {jts:[pts[1],pts[2],pts[3],pts[4]],                                                    base:thumbHalf, tip:blen(pts[1],pts[2])*0.24},              // โป้ง: สั้น ป้อม
    {jts:extendTip([pts[5],pts[6],pts[7],pts[8]],     blen(pts[7],pts[8])*0.48),           base:idxBase,   tip:blen(pts[5],pts[6])*0.22},              // ชี้
    {jts:extendTip([pts[9],pts[10],pts[11],pts[12]],  blen(pts[11],pts[12])*0.48),         base:midBase,   tip:blen(pts[9],pts[10])*0.23,  nail:true}, // กลาง: ยาวสุด หนาสุด
    {jts:extendTip([pts[13],pts[14],pts[15],pts[16]], blen(pts[15],pts[16])*0.48),         base:ringBase,  tip:blen(pts[13],pts[14])*0.22, nail:true}, // นาง
    {jts:extendTip([pts[17],pts[18],pts[19],pts[20]], blen(pts[19],pts[20])*0.30),         base:pinkyBase, tip:blen(pts[17],pts[18])*0.19, nail:true}  // ก้อย: เรียวสุด
  ];

  /* ผิวไล่เฉด: อ่อนสว่างกลางฝ่ามือ → อมส้มขึ้นเล็กน้อยที่ขอบ/ปลายนิ้ว ให้มีมิตินุ่มๆ แบบการ์ตูน */
  const skinGrad = ctx.createRadialGradient(palmCenter.x, palmCenter.y, handScale*0.2, palmCenter.x, palmCenter.y, handScale*1.7);
  skinGrad.addColorStop(0, '#FFE8DB');
  skinGrad.addColorStop(.55, '#FFDDCE');
  skinGrad.addColorStop(1, '#FFCFB8');

  /* ---- path builders (ใช้ร่วมกันทั้ง 2 pass) ---- */
  /* นิ้ว — ทรงสามเหลี่ยมขอบมน ไล่ความอวบจากโคน (กว้าง) ไปปลาย (แคบ) ต่อเนื่อง
     เส้นข้างสองฝั่งใช้ quadraticCurveTo ผ่านจุดกึ่งกลางข้อต่อ ให้ไม่เห็นเหลี่ยมตรงข้อนิ้ว
     ไม่ closePath: fill() ปิดรูปให้เอง แต่ stroke() จะไม่ลากเส้นตัดขวางโคนนิ้วทับบนฝ่ามือ */
  function buildFingerPath(tctx, jts, baseHalf, tipHalf){
    const n = jts.length;
    const L=[], R=[];
    for(let i=0;i<n;i++){
      const seg = i<n-1 ? [jts[i],jts[i+1]] : [jts[i-1],jts[i]];
      const t  = i/(n-1);
      const hw = baseHalf + (tipHalf-baseHalf)*t;
      const ddx=seg[1].x-seg[0].x, ddy=seg[1].y-seg[0].y, rr=Math.hypot(ddx,ddy)||1;
      L.push({x:jts[i].x-ddy/rr*hw, y:jts[i].y+ddx/rr*hw});
      R.push({x:jts[i].x+ddy/rr*hw, y:jts[i].y-ddx/rr*hw});
    }
    tctx.beginPath();
    tctx.moveTo(L[0].x, L[0].y);
    for(let i=1;i<n-1;i++){
      const mx=(L[i].x+L[i+1].x)/2, my=(L[i].y+L[i+1].y)/2;
      tctx.quadraticCurveTo(L[i].x, L[i].y, mx, my);
    }
    tctx.quadraticCurveTo(L[n-1].x, L[n-1].y, jts[n-1].x, jts[n-1].y);
    tctx.quadraticCurveTo(R[n-1].x, R[n-1].y, R[n-2].x, R[n-2].y);
    for(let i=n-2;i>=1;i--){
      const mx=(R[i].x+R[i-1].x)/2, my=(R[i].y+R[i-1].y)/2;
      tctx.quadraticCurveTo(R[i].x, R[i].y, mx, my);
    }
    tctx.lineTo(R[0].x, R[0].y);
  }
  /* ฝ่ามือ — rounded-corner polygon โค้งมนรอบด้าน (ลากโค้งผ่านจุดกึ่งกลางระหว่างแต่ละคู่จุดขอบ) */
  function buildPalmPath(tctx){
    const n = palmPts.length;
    const mid = (a,b)=>({x:(a.x+b.x)/2, y:(a.y+b.y)/2});
    tctx.beginPath();
    const startMid = mid(palmPts[n-1], palmPts[0]);
    tctx.moveTo(startMid.x, startMid.y);
    for(let i=0;i<n;i++){
      const cur = palmPts[i], nxt = palmPts[(i+1)%n];
      const m = mid(cur, nxt);
      tctx.quadraticCurveTo(cur.x, cur.y, m.x, m.y);
    }
    tctx.closePath();
  }

  /* ---- วาดมือทั้งมือ: flat=true วาด silhouette สีเดียว (สำหรับเงา), flat=false วาดจริง (gradient+ขอบ) ---- */
  function paintHand(tctx, flat){
    const skin = flat ? '#7A4828' : skinGrad;
    /* cuff (หลังสุด อยู่ใต้ฝ่ามือ) */
    tctx.beginPath();
    tctx.moveTo(cuffA.x, cuffA.y); tctx.lineTo(cuffB.x, cuffB.y);
    tctx.lineCap = 'round';
    if(flat){
      tctx.lineWidth = cuffW+outlineW*2; tctx.strokeStyle = skin; tctx.stroke();
    } else {
      tctx.lineWidth = cuffW+outlineW*2; tctx.strokeStyle = CUFF_DK; tctx.stroke();
      tctx.lineWidth = cuffW; tctx.strokeStyle = CUFF; tctx.stroke();
    }
    /* ฝ่ามือ */
    buildPalmPath(tctx);
    tctx.fillStyle = skin; tctx.fill();
    if(!flat){ tctx.lineWidth = outlineW; tctx.strokeStyle = OUTLINE; tctx.stroke(); }
    /* ปลอกคอ (collar) วงกลมสีเนื้อทับรอยต่อโคนนิ้วกับฝ่ามือ ปิดรอยหยักเว้าของเส้นขอบฝ่ามือให้เนียนสนิท */
    collars.forEach(([i,half])=>{
      tctx.beginPath();
      tctx.arc(pts[i].x, pts[i].y, half*1.08, 0, Math.PI*2);
      tctx.fillStyle = skin; tctx.fill();
    });
    /* 5 นิ้ว */
    fingers.forEach(f=>{
      buildFingerPath(tctx, f.jts, f.base, f.tip);
      tctx.fillStyle = skin; tctx.fill();
      if(!flat){ tctx.lineWidth = outlineW; tctx.strokeStyle = OUTLINE; tctx.stroke(); }
    });
  }

  /* pass 1: เงาสติกเกอร์ — silhouette ทึบบน canvas สำรอง แล้ววางเยื้องลงขวาด้วย alpha เดียวทั้งก้อน */
  const mainCv = ctx.canvas;
  if(!_handShadowCv) _handShadowCv = document.createElement('canvas');
  if(_handShadowCv.width !== mainCv.width || _handShadowCv.height !== mainCv.height){
    _handShadowCv.width = mainCv.width; _handShadowCv.height = mainCv.height;
  }
  const sctx = _handShadowCv.getContext('2d');
  sctx.clearRect(0, 0, _handShadowCv.width, _handShadowCv.height);
  paintHand(sctx, true);
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.drawImage(_handShadowCv, handScale*0.05, handScale*0.09);
  ctx.restore();

  /* pass 2: มือจริง */
  paintHand(ctx, false);

  /* เล็บ — วงรีสีอ่อนที่ปลายนิ้วกลาง/นาง/ก้อย วางตามทิศปลายนิ้ว เพิ่มความน่ารักแบบการ์ตูน */
  fingers.forEach(f=>{
    if(!f.nail) return;
    const jn = f.jts.length, tipPt = f.jts[jn-1], prev = f.jts[jn-2];
    const ddx = tipPt.x-prev.x, ddy = tipPt.y-prev.y, rr = Math.hypot(ddx,ddy)||1;
    const nx = tipPt.x-ddx/rr*f.tip*1.1, ny = tipPt.y-ddy/rr*f.tip*1.1;
    ctx.beginPath();
    ctx.ellipse(nx, ny, f.tip*0.95, f.tip*0.68, Math.atan2(ddy,ddx), 0, Math.PI*2);
    ctx.fillStyle = NAIL; ctx.fill();
    ctx.lineWidth = Math.max(1, outlineW*0.66); ctx.strokeStyle = 'rgba(232,166,127,.6)'; ctx.stroke();
  });

  /* indicator โป้ง (pinch, แดง) / ชี้ (cursor, ฟ้า) — ลูกแก้วมี highlight + halo โปร่งเต้นตามเวลา */
  const tNow = performance.now()/1000;
  function indicator(p, baseR, color, halo){
    const pulse = 1 + 0.12*Math.sin(tNow*5);
    ctx.beginPath(); ctx.arc(p.x, p.y, baseR*1.7*pulse, 0, Math.PI*2);
    ctx.fillStyle = halo; ctx.fill();
    ctx.beginPath(); ctx.arc(p.x, p.y, baseR, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.beginPath(); ctx.arc(p.x-baseR*0.32, p.y-baseR*0.32, baseR*0.28, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
  }
  indicator(pts[4], blen(pts[3],pts[4])*0.45, '#FF6161', 'rgba(255,97,97,.18)');
  indicator(pts[8], blen(pts[7],pts[8])*0.45, '#33B7EE', 'rgba(51,183,238,.18)');
}

function updateArCursor(pageX, pageY, pinching){
  const cursorEl = $('ar-cursor');
  cursorEl.style.left = pageX+'px';
  cursorEl.style.top = pageY+'px';
  cursorEl.classList.add('active');

  const hoveredEl = document.elementFromPoint(pageX, pageY);
  cursorEl.classList.remove('hover','miss','grabbed');

  const cat = arGame && catById(arGame.catId);
  if(cat && cat.mode==='match'){
    /* touch a dot to start dragging its line right away; pinch fingers together to cancel an active drag */
    const hoverDot = hoveredEl && hoveredEl.closest && hoveredEl.closest('.ar-dot:not(.matched)');
    if(arDragLineFrom && arDragSource==='hand'){
      if(pinching){
        cancelDragLine();
        cursorEl.classList.add('miss');
      } else {
        updateTempLine(pageX, pageY);
        cursorEl.classList.add('grabbed');
        const targetSide = arDragLineFrom.side==='left' ? 'right' : 'left';
        if(hoverDot && hoverDot.dataset.side===targetSide){ attemptLineDrop(pageX, pageY); }
      }
    } else if(pinching){
      cursorEl.classList.add('miss');
    } else if(hoverDot){
      startDragLine(hoverDot, 'hand');
      cursorEl.classList.add('hover');
    }
    arWasPinching = pinching;
    return;
  }

  const hoverCard = hoveredEl && hoveredEl.closest && hoveredEl.closest('.ar-card');
  const hoverSlot = hoveredEl && hoveredEl.closest && (hoveredEl.closest('.ar-slot:not(.filled)') || hoveredEl.closest('.ar-count-zone'));

  if(pinching){
    if(!arWasPinching && !arDraggingCard && hoverCard){ startDragCard(hoverCard, 'hand'); }
    if(arDraggingCard && arDragSource==='hand'){
      moveDraggingCardTo(pageX, pageY);
      cursorEl.classList.add('grabbed');
    } else if(arDraggingCard){
      cursorEl.classList.add('grabbed');
    } else {
      cursorEl.classList.add('miss');
    }
  } else {
    if(arWasPinching && arDraggingCard && arDragSource==='hand'){
      attemptDrop(arDraggingCard, pageX, pageY);
    }
    if(hoverCard || hoverSlot) cursorEl.classList.add('hover');
  }
  arWasPinching = pinching;
}

function arDrawLoop(){
  if(!arActive) return;
  const canvas = $('ar-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(arLandmarks){
    /* temporal smoothing: ขยับจุดเดิมเข้าหาตำแหน่งใหม่ 50% ต่อเฟรม — ทั้งมือที่วาดและ cursor นุ่มขึ้น
       ไม่สั่นตาม jitter ของ MediaPipe (smooth ที่จุดเดียว มือกับ cursor เลยตรงกันเสมอ) */
    const raw = arLandmarks.map(p=>({x:(1-p.x)*canvas.width, y:p.y*canvas.height}));
    if(!arHandSmooth || arHandSmooth.length !== raw.length) arHandSmooth = raw;
    else arHandSmooth = arHandSmooth.map((p,i)=>({x:p.x+(raw[i].x-p.x)*0.5, y:p.y+(raw[i].y-p.y)*0.5}));
    const hpts = arHandSmooth;
    drawCartoonHand(ctx, hpts);
    const ix = hpts[8].x, iy = hpts[8].y;
    const tx = hpts[4].x, ty = hpts[4].y;
    const dx = ix-tx, dy = iy-ty;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const pinching = dist < Math.max(28, canvas.width*0.07);

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width/canvas.width, scaleY = rect.height/canvas.height;
    const pageX = rect.left + ix*scaleX, pageY = rect.top + iy*scaleY;
    updateArCursor(pageX, pageY, pinching);
  } else {
    arHandSmooth = null;
    $('ar-cursor').classList.remove('active');
    arWasPinching = false;
  }
  arRafId = requestAnimationFrame(arDrawLoop);
}

function isMobileViewport(){
  return window.innerWidth < 768;
}

async function initHandTracking(){
  const msgEl = $('ar-camera-msg');
  msgEl.hidden = true;
  if(isMobileViewport()){
    /* mobile phones skip the camera entirely — touch-drag only, no permission prompt. A one-time toast (not a persistent card) avoids overlapping the hint chip. */
    showToast('👆', 'มือถือไม่ใช้กล้อง ลากด้วยนิ้วได้เลย!');
    arActive = false;
    return;
  }
  try{
    await loadMediaPipeScripts();
    const video = $('ar-video');
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ width:480, height:360, facingMode:'user' }, audio:false });
    arStream = stream;
    video.srcObject = stream;
    await video.play().catch(()=>{});

    const canvas = $('ar-canvas');
    arResizeHandler = ()=>{ canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    arResizeHandler();
    window.addEventListener('resize', arResizeHandler);

    arHands = new Hands({ locateFile:(f)=>'https://cdn.jsdelivr.net/npm/@mediapipe/hands/'+f });
    arHands.setOptions({ maxNumHands:1, modelComplexity:0, minDetectionConfidence:0.6, minTrackingConfidence:0.5 });
    arHands.onResults(res=>{ arLandmarks = (res.multiHandLandmarks && res.multiHandLandmarks[0]) || null; });

    arCamera = new Camera(video, {
      onFrame: async ()=>{ if(arHands){ await arHands.send({ image:video }); } },
      width:480, height:360
    });
    await arCamera.start();

    arActive = true;
    $('ar-cursor').classList.add('active');
    arRafId = requestAnimationFrame(arDrawLoop);
  }catch(err){
    console.warn('AR hand tracking unavailable, using mouse/touch fallback:', err);
    $('ar-camera-msg-emoji').textContent = '🖐️🚫';
    $('ar-camera-msg-text').innerHTML = 'ใช้กล้องไม่ได้ ไม่เป็นไรนะ!<br>ใช้นิ้วหรือเมาส์ลากคำได้เลยจ้ะ 👇';
    msgEl.hidden = false;
    arActive = false;
  }
  updateCameraToggleBtn();
}

/* หยุดเฉพาะกล้อง/hand-tracking โดยไม่ออกจากเกม (ต่างจาก stopARGame ที่ออกจากเกมทั้งหมด)
   ใช้กับปุ่มเปิด-ปิดกล้อง ให้เด็กสลับไปลากด้วยนิ้ว/เมาส์ต่อได้เลยโดยไม่ต้องออกจากด่าน */
function stopCameraOnly(){
  arActive = false;
  arLandmarks = null;
  arWasPinching = false;
  if(arRafId){ cancelAnimationFrame(arRafId); arRafId = null; }
  if(arCamera){ try{ arCamera.stop(); }catch(e){} arCamera = null; }
  if(arStream){ arStream.getTracks().forEach(t=>t.stop()); arStream = null; }
  if(arResizeHandler){ window.removeEventListener('resize', arResizeHandler); arResizeHandler = null; }
  arHands = null;
  const cursorEl = $('ar-cursor');
  if(cursorEl) cursorEl.classList.remove('active');
}

function updateCameraToggleBtn(){
  const btn = $('ar-camera-toggle');
  if(!btn) return;
  const label = arActive ? 'ปิดกล้อง' : 'เปิดกล้อง';
  btn.classList.toggle('muted', !arActive);
  btn.setAttribute('aria-label', label);
  btn.dataset.tooltip = label;
}

function toggleARCamera(){
  if(isMobileViewport()) return; // ปุ่มนี้ไม่แสดงบนมือถืออยู่แล้ว กันไว้อีกชั้น
  if(arActive){
    stopCameraOnly();
    updateCameraToggleBtn();
    showToast('📷','ปิดกล้องแล้ว ใช้นิ้ว/เมาส์ลากคำได้เลย!');
  } else {
    initHandTracking().then(updateCameraToggleBtn);
  }
}

function stopARGame(){
  arActive = false;
  arLandmarks = null;
  arWasPinching = false;
  if(arRafId){ cancelAnimationFrame(arRafId); arRafId = null; }
  if(arCamera){ try{ arCamera.stop(); }catch(e){} arCamera = null; }
  if(arStream){ arStream.getTracks().forEach(t=>t.stop()); arStream = null; }
  if(arResizeHandler){ window.removeEventListener('resize', arResizeHandler); arResizeHandler = null; }
  arHands = null;
  if(arDraggingCard){ returnCardToPool(arDraggingCard); arDraggingCard = null; arDragSource = null; }
  if(arDragLineFrom){ cancelDragLine(); }
  const cursorEl = $('ar-cursor');
  if(cursorEl) cursorEl.classList.remove('active');
  document.body.classList.remove('ar-open');
  document.body.classList.remove('ar-mobile-nocam');
}

/* ---- game flow ---- */
function startARGame(catId){
  const startCat = catById(catId);
  if(startCat.desktopOnly && isMobileViewport()){
    showToast('🖥️','เกมนี้เล่นได้บนแท็บเล็ตหรือคอมพิวเตอร์เท่านั้นนะ!');
    return;
  }
  stopARGame();
  lastGameType = 'ar'; lastCatId = catId;
  arGame = { catId, level:1, mistakes:0, totalLevels: catById(catId).levels,
    usedSentenceIdx:{}, usedMatchKeys:new Set(), usedCountIdx:{} }; // กันด่านซ้ำภายในรอบเดียวกัน (สุ่มแบบไม่ซ้ำ)
  document.body.classList.add('ar-open');
  if(isMobileViewport()) document.body.classList.add('ar-mobile-nocam');
  $('ar-camera-toggle').hidden = isMobileViewport(); // มือถือไม่ใช้กล้องเลย ปุ่มนี้จึงไม่มีประโยชน์ ซ่อนไว้
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = false; memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true; dotsView.hidden = true;
  const cat = catById(catId);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  arView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('ar-cat-label', cat);
  renderARLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 500);
  initHandTracking();
}

function renderARLevel(){
  $('ar-level-counter').textContent = arGame.level+'/'+arGame.totalLevels;
  $('ar-progress-fill').style.width = ((arGame.level-1)/arGame.totalLevels*100)+'%';
  buildLevel(arGame.catId);
}

function finishARGame(){
  const cat = catById(arGame.catId);
  const mistakes = arGame.mistakes;
  const totalLevels = arGame.totalLevels;
  stopARGame();
  arView.hidden = true; resultView.hidden = false;

  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = {
    best: prev ? Math.max(prev.best, totalLevels) : totalLevels,
    stars: prev ? Math.max(prev.stars, stars) : stars,
    unlocked: wasUnlocked || stars>=2
  };
  saveProgress();

  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });

  $('score-line').textContent = 'ต่อประโยคครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';

  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false;
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
  }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('ar-back').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  arView.hidden = true; homeView.hidden = false;
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

$('ar-camera-toggle').addEventListener('click', ()=>{
  playClick();
  toggleARCamera();
});

/* ============================= SOUND TOGGLE ============================= */
const soundBtn = $('sound-toggle');
function refreshSoundBtn(){ soundBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_SPEAKER+'</span><span class="mute-stripe"></span></span>'; soundBtn.classList.toggle('muted', !soundOn); soundBtn.dataset.tooltip = soundOn ? 'ปิดเสียง' : 'เปิดเสียง'; }
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
const fsBtns = [$('fullscreen-toggle'), $('ar-fullscreen-toggle')];
function refreshFsBtn(){
  const label = document.fullscreenElement ? 'ออกจากเต็มหน้าจอ' : 'เต็มหน้าจอ';
  fsBtns.forEach(btn=>{
    btn.innerHTML = document.fullscreenElement ? SVG_COMPRESS : SVG_EXPAND;
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
function showToast(emoji, msg){
  $('toast-emoji').textContent = emoji;
  $('toast-msg').textContent = msg;
  const t = $('toast');
  t.classList.remove('visible');
  void t.offsetWidth;
  t.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(()=>t.classList.remove('visible'), 2600);
}

/* ============================= STICKER BOOK ============================= */
function renderStickerBook(stampCatId){
  const grid = $('sb-grid');
  grid.innerHTML = '';
  CATS.forEach((cat, i)=>{
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
  $('sb-sub').textContent = activeChild ? '📖 ของ '+activeChild.name : '📖 สมุดสติกเกอร์';
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
  const payload = {v:1, child:{id:activeChild.id, name:activeChild.name, emoji:activeChild.emoji||'🧒'}, progress:prog};
  const body = JSON.stringify(payload);
  const sig = owkHash(body);
  const full = JSON.stringify({v:payload.v, child:payload.child, progress:payload.progress, sig});
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

function showImportConflictModal(importedChild, progress, conflictChild){
  pendingImport = {child: importedChild, progress, conflictChildId: conflictChild.id};
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
      const {v, child, progress, sig} = obj;
      if(!sig || !child || !child.id || !child.name){
        showToast('❌','ไฟล์ไม่ถูกต้อง ไม่สามารถนำเข้าได้'); return;
      }
      const body = JSON.stringify({v, child:{id:child.id, name:child.name, emoji:child.emoji||'🧒'}, progress:progress||{}});
      if(owkHash(body) !== sig){
        showToast('❌','ไฟล์ไม่ถูกต้อง ไม่สามารถนำเข้าได้'); return;
      }
      const conflictChild = children.find(c => c.id === child.id || c.name.toLowerCase() === child.name.toLowerCase());
      if(conflictChild){
        showImportConflictModal(child, progress||{}, conflictChild);
        return;
      }
      children.push({id:child.id, name:child.name, emoji:child.emoji||'🧒'});
      saveChildren();
      if(progress) try{ localStorage.setItem('p1quiz_progress_'+child.id, JSON.stringify(progress)); }catch(er){}
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
  const {child, progress, conflictChildId} = pendingImport;
  const existing = children.find(c => c.id === conflictChildId);
  if(existing){ existing.emoji = child.emoji || existing.emoji; saveChildren(); }
  try{ localStorage.setItem('p1quiz_progress_'+conflictChildId, JSON.stringify(progress||{})); }catch(e){}
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
  const {child, progress} = pendingImport;
  const newId = 'child_'+Date.now();
  children.push({id:newId, name:newName, emoji:child.emoji||'🧒'});
  saveChildren();
  if(progress) try{ localStorage.setItem('p1quiz_progress_'+newId, JSON.stringify(progress)); }catch(e){}
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
      children = children.filter(c=>c.id!==activeChild.id);
      saveChildren();
      try{ localStorage.removeItem('p1quiz_active_child'); }catch(e){}
      location.reload();
    }
  );
});

$('clear-btn').addEventListener('click', ()=>{ playClick(); showClearModal(); });

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
function openEditEmojiModal(childId){
  const child = children.find(c=>c.id===childId);
  if(!child) return;
  editingChildId = childId;
  initEditEmojiPicker(child.emoji);
  $('edit-name-input').value = child.name;
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
    rec.emoji = editEmojiSelected;
    rec.name = newName;
    if(activeChild && activeChild.id===editingChildId){ activeChild.emoji = editEmojiSelected; activeChild.name = newName; }
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
function isNightMode(){ return document.body.classList.contains('night-mode'); }
function refreshThemeBtn(){
  const night = isNightMode();
  themeBtn.innerHTML = night ? SVG_SUN : SVG_MOON;
  themeBtn.dataset.tooltip = night ? 'โหมดกลางวัน' : 'โหมดกลางคืน';
  themeBtn.setAttribute('aria-label', night ? 'สลับเป็นโหมดกลางวัน' : 'สลับเป็นโหมดกลางคืน');
}
function setTheme(night, persist){
  document.body.classList.toggle('night-mode', night);
  if(persist){ try{ localStorage.setItem('p1quiz_theme', night?'night':'day'); }catch(e){} }
  refreshThemeBtn();
  bgDecorEl.querySelectorAll('.bg-floater, .bg-cloud').forEach(e=>e.remove());
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
