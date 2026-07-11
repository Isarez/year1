/* ============================================================
   โหมดคุณครู (Teacher Mode) — เฟส 1
   หน้าแยกจากแอปหลัก (owlkids.net/teacher) ใช้ธีม/CSS ร่วมกับหน้าหลัก
   แต่ JS แยกของตัวเองทั้งหมด (js/app.js ผูกกับ DOM ของ index.html แน่นเกินกว่าจะ reuse)
   ข้อมูลทั้งหมดเก็บ localStorage: owlkids_teacher_profile / owlkids_teacher_games
   ============================================================ */

function $(id){ return document.getElementById(id); }

/* ---------- storage ---------- */
const LS_PROFILE = 'owlkids_teacher_profile';
const LS_GAMES   = 'owlkids_teacher_games';

let profile = null;   // {name, school, avatar}
let games   = [];     // [{id,title,grade,mechanic,logo,questionCount,shuffle,published,questions:[{q,answers:[..],correct}],createdAt,updatedAt}]

function loadData(){
  try{ profile = JSON.parse(localStorage.getItem(LS_PROFILE)) || null; }catch(e){ profile = null; }
  try{ games = JSON.parse(localStorage.getItem(LS_GAMES)) || []; }catch(e){ games = []; }
  if(!Array.isArray(games)) games = [];
  /* migration: mechanic 'ar-order' (หยิบการ์ดเรียงคำ) ถูกยุบรวมกับ 'ar-sentence' แล้ว (mechanic เดียวกัน)
     แปลงข้อมูลเก่า {cards:[...]} → {sentence:'...'} */
  games.forEach(g=>{
    if(g.mechanic === 'ar-order'){
      g.mechanic = 'ar-sentence';
      g.questions = g.questions.map(q=> q.cards ? {sentence:q.cards.join(' ')} : q);
    }
  });
}
function saveProfile(){ try{ localStorage.setItem(LS_PROFILE, JSON.stringify(profile)); }catch(e){} }
function saveGames(){ try{ localStorage.setItem(LS_GAMES, JSON.stringify(games)); }catch(e){} }

/* ---------- grades ---------- */
const GRADES = [
  {id:'k1', name:'อนุบาล 1'}, {id:'k2', name:'อนุบาล 2'}, {id:'k3', name:'อนุบาล 3'},
  {id:'p1', name:'ประถม 1'}, {id:'p2', name:'ประถม 2'}, {id:'p3', name:'ประถม 3'},
  {id:'p4', name:'ประถม 4'}, {id:'p5', name:'ประถม 5'}, {id:'p6', name:'ประถม 6'}
];
function gradeName(id){ const g = GRADES.find(x=>x.id===id); return g ? g.name : id; }

/* ---------- mechanics (เฟส 2: เปิด quiz + AR ครบ 4 รูปแบบ — จับคู่ความจำ/ฟังคำศัพท์ยัง "เร็วๆ นี้")
   icon = SVG หัว section บนหน้า home (ชุดเดียวกับหน้าหลัก), form = รูปแบบฟอร์มใส่โจทย์ ---------- */
const MECHANICS = [
  {id:'quiz',        name:'ถาม-ตอบปรนัย', emoji:'📝', enabled:true,  form:'choices',  icon:'../assets/icons/section-quiz.svg'},
  {id:'ar-pick',     name:'AR หยิบการ์ดคำตอบที่ถูกต้อง', emoji:'🖐️', enabled:true,  form:'choices',  icon:'../assets/icons/section-ar.svg'},
  {id:'ar-sentence', name:'AR หยิบการ์ดเรียงลำดับ', emoji:'🔤', enabled:true,  form:'sentence', icon:'../assets/icons/section-ar.svg'},
  {id:'ar-connect',  name:'AR โยงเส้น', emoji:'🪢', enabled:true,  form:'pairs',    icon:'../assets/icons/section-ar.svg'},
  {id:'match',       name:'จับคู่ความจำ', emoji:'🎴', enabled:false, form:'choices',  icon:'../assets/icons/section-skill.svg'},
  {id:'listen',      name:'ฟังคำศัพท์', emoji:'🎧', enabled:false, form:'choices',  icon:'../assets/icons/section-listen.svg'}
];
function mechById(id){ return MECHANICS.find(m=>m.id===id) || MECHANICS[0]; }

/* ---------- logos (SVG เตรียมไว้ ธีมเดียวกับ icon เกมหน้าหลัก) ---------- */
const LOGOS = [
  't-star','t-book','t-pencil','t-rocket','t-flower','t-ball','t-apple','t-music','t-puzzle','t-crown','t-rainbow','t-heart',
  't-sun','t-car','t-boat','t-tree','t-fish','t-cake','t-gift','t-planet','t-drum','t-butterfly','t-icecream','t-robot'
].map(n=>'../assets/icons/teacher/'+n+'.svg');
/* สีการ์ดหมุนเวียนตามลำดับเกม (โทนเดียวกับหมวดหน้าหลัก) */
const CARD_COLORS = [
  ['#4FA9E8','#DCF0FB'], ['#F2765E','#FDE1DA'], ['#3A9A6E','#D8F3DC'], ['#9B7DE0','#EAE4F7'],
  ['#FFB020','#FFF1D6'], ['#E0764C','#FBE3D4'], ['#2FAE86','#D8F3EA'], ['#FF6FB5','#FFE3F0']
];

/* ---------- avatars (ชุดเดียวกับหน้าหลัก) ---------- */
const AVATARS = [
  '🐶','🐱','🐰','🐻','🐼','🦊',
  '🐸','🐧','🦄','🦋','🦕','🐙',
  '🦁','🐯','🐨','🐹','🦔','🦦',
  '🌟','🌈','🚀','🎈','🍦','🎀',
  '🐷','🐮','🐵','🐔','🦉','🦖',
  '🐬','🐳','🦈','🐞','🐝','🦜',
  '🐺','🦝','🦥','🐿️','🦩','🐢',
  '🍭','🍩','🍪','🧁','⚽','🎨'
];

/* ---------- เสียง (procedural Web Audio ชุดเดียวกับหน้าหลัก — key เปิด/ปิดใช้ร่วมกัน) ---------- */
let soundOn = true;
try{ soundOn = localStorage.getItem('p1quiz_sound') !== 'off'; }catch(e){}
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
  }
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
}
function playTone(freq, dur, type, delay, vol){
  if(!soundOn) return;
  ensureAudio(); if(!audioCtx) return;
  const t = audioCtx.currentTime + (delay||0);
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  osc.connect(g).connect(audioCtx.destination);
  osc.start(t); osc.stop(t+dur+0.05);
}
function playCorrect(){ playTone(523.25,.15,'sine',0,.14); playTone(659.25,.18,'sine',.12,.14); playTone(783.99,.24,'sine',.24,.14); }
function playWrong(){ playTone(190,.28,'sawtooth',0,.07); }
function playClick(){ playTone(659.25,.08,'sine',0,.12); playTone(1318.5,.05,'sine',0,.04); }
function playCongrats(){
  playTone(523.25,.16,'sine',0,.13); playTone(659.25,.16,'sine',.14,.13);
  playTone(783.99,.16,'sine',.28,.13); playTone(1046.5,.22,'sine',.42,.15);
  playTone(1318.5,.55,'sine',.64,.11); playTone(1046.5,.55,'sine',.64,.10); playTone(783.99,.55,'sine',.64,.08);
}

/* ---------- เพลงพื้นหลัง (procedural playlist 5 เพลง — engine เดียวกับหน้าหลัก, key p1quiz_music ร่วมกัน) ---------- */
let musicOn = true;
try{ musicOn = localStorage.getItem('p1quiz_music') !== 'off'; }catch(e){}
let musicGain=null, musicSchedulerId=null, musicNoteIndex=0, musicNextTime=0, musicTrackIdx=0;
const MUSIC_TRACKS = [
{ bpm:128, notes:[
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
{ bpm:112, notes:[
  [659.25,.5],[783.99,.5],[880.00,.5],[783.99,.5],
  [659.25,.5],[587.33,.5],[523.25,1],
  [587.33,.5],[659.25,.5],[698.46,.5],[659.25,.5],
  [587.33,.5],[523.25,.5],[587.33,1],
  [659.25,.5],[783.99,.5],[880.00,.5],[1046.5,.5],
  [987.77,.5],[880.00,.5],[783.99,1],
  [880.00,.5],[783.99,.5],[659.25,.5],[587.33,.5],
  [523.25,1.5],[null,.5]
]},
{ bpm:132, notes:[
  [523.25,.75],[659.25,.25],[783.99,.75],[880.00,.25],
  [1046.5,.5],[880.00,.5],[783.99,1],
  [587.33,.75],[698.46,.25],[880.00,.75],[698.46,.25],
  [659.25,.5],[587.33,.5],[523.25,1],
  [783.99,.75],[880.00,.25],[1046.5,.75],[880.00,.25],
  [783.99,.5],[659.25,.5],[587.33,1],
  [523.25,.25],[587.33,.25],[659.25,.25],[698.46,.25],
  [783.99,.5],[880.00,.5],[1046.5,1],[null,1]
]},
{ bpm:104, notes:[
  [783.99,1],[659.25,1],
  [698.46,.5],[659.25,.5],[587.33,1],
  [523.25,.5],[587.33,.5],[659.25,1],
  [587.33,1],[null,.5],[392.00,.5],
  [440.00,.5],[493.88,.5],[523.25,1],
  [659.25,.5],[587.33,.5],[523.25,1],
  [493.88,.5],[440.00,.5],[392.00,1.5],[null,.5],
  [523.25,1],[659.25,1],[783.99,2],[null,1]
]},
{ bpm:120, notes:[
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

/* ---------- toast แจ้งเตือน (pattern เดียวกับหน้าหลัก — CSS .toast อยู่ใน style.css แล้ว) ---------- */
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

/* ---------- views ---------- */
const setupView   = $('teacher-setup-view');
const homeView    = $('teacher-home-view');
const manageView  = $('manage-view');
const builderView = $('builder-view');
const quizView    = $('quiz-view');
const resultView  = $('result-view');
function showView(v){
  [setupView, homeView, manageView, builderView, quizView, resultView].forEach(x=>{ x.hidden = (x!==v); });
  const av = $('ar-view');
  if(av) av.hidden = true; /* ar-view จัดการแยกใน startTeacherAR (teacher-ar.js) — ที่นี่แค่กันซ้อน */
  window.scrollTo({top:0, behavior:'smooth'});
}
let lastPlay = null;   // {type:'quiz'|'ar', gameId} — ให้ปุ่ม "ทำอีกครั้ง" รู้ว่าเล่นเกมไหน/engine ไหน

/* ---------- theme (key เดียวกับหน้าหลัก ธีมจะตรงกันทั้งสองหน้า) ---------- */
const SVG_MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7BA7E0" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#C8DEFF"/></svg>';
const SVG_SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E8A020" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#FFD040"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const themeBtn = $('theme-toggle');
const bgDecorEl = $('bg-decor');
function isNightMode(){ return document.body.classList.contains('night-mode'); }
function refreshThemeBtn(){
  themeBtn.innerHTML = isNightMode() ? SVG_SUN : SVG_MOON;
}
function setTheme(night, persist){
  document.body.classList.toggle('night-mode', night);
  if(persist){ try{ localStorage.setItem('p1quiz_theme', night?'night':'day'); }catch(e){} }
  refreshThemeBtn();
  bgDecorEl.querySelectorAll('.bg-floater, .bg-cloud').forEach(e=>e.remove());
}
let nightMode = false;
try{ nightMode = localStorage.getItem('p1quiz_theme') === 'night'; }catch(e){}
setTheme(nightMode, false);
themeBtn.addEventListener('click', ()=>{ playClick(); setTheme(!isNightMode(), true); });

/* ---------- ปุ่ม menu bar ที่เหลือ (ฟังก์ชันเดียวกับหน้าหลัก) ---------- */
const SVG_MUSIC = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6C5CE7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" fill="#DCD2FB"/><circle cx="6" cy="18" r="3" fill="#C7B3FF"/><circle cx="18" cy="16" r="3" fill="#C7B3FF"/></svg>';
const SVG_SPEAKER = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4881C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#FFDF8E"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M18.7 5.3a9.5 9.5 0 0 1 0 13.4" opacity=".55"/></svg>';
const SVG_EXPAND = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2E8F63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
const SVG_COMPRESS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2E8F63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>';

const musicBtn = $('music-toggle');
function refreshMusicBtn(){ musicBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_MUSIC+'</span><span class="mute-stripe"></span></span>'; musicBtn.classList.toggle('muted', !musicOn); musicBtn.dataset.tooltip = musicOn ? 'ปิดเพลงพื้นหลัง' : 'เปิดเพลงพื้นหลัง'; }
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

const soundBtn = $('sound-toggle');
function refreshSoundBtn(){ soundBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_SPEAKER+'</span><span class="mute-stripe"></span></span>'; soundBtn.classList.toggle('muted', !soundOn); soundBtn.dataset.tooltip = soundOn ? 'ปิดเสียง' : 'เปิดเสียง'; }
refreshSoundBtn();
soundBtn.addEventListener('click', ()=>{
  soundOn = !soundOn;
  try{ localStorage.setItem('p1quiz_sound', soundOn?'on':'off'); }catch(e){}
  refreshSoundBtn();
  if(soundOn) playClick();
});

const fsBtn = $('fullscreen-toggle');
function refreshFsBtn(){
  fsBtn.innerHTML = document.fullscreenElement ? SVG_COMPRESS : SVG_EXPAND;
  fsBtn.dataset.tooltip = document.fullscreenElement ? 'ออกจากเต็มหน้าจอ' : 'เต็มหน้าจอ';
}
fsBtn.addEventListener('click', ()=>{
  playClick();
  if(document.fullscreenElement){ document.exitFullscreen(); }
  else if(document.documentElement.requestFullscreen){ document.documentElement.requestFullscreen(); }
});
document.addEventListener('fullscreenchange', refreshFsBtn);
refreshFsBtn();

/* ---------- background decor (ลูกโป่ง/ดาว + เมฆ — ชุดเดียวกับหน้าหลัก) ---------- */
const BALLOON_COLORS = ['#FF6B6B','#FF9F43','#FFD93D','#6BCB77','#4D96FF','#9B7DE0','#FF6FB5'];
const STAR_COLORS = ['#FFF7D6','#FFE9A8','#CDE7FF','#FFFFFF','#B9D6FF'];
function spawnFloater(){
  const el = document.createElement('span');
  el.className = 'bg-floater';
  if(isNightMode()){
    const color = STAR_COLORS[Math.floor(Math.random()*STAR_COLORS.length)];
    el.innerHTML = `<svg viewBox="0 0 24 24" width="1em" height="1em"><polygon points="12,1 14.7,8.8 23,9.1 16.4,14.2 18.7,22.3 12,17.6 5.3,22.3 7.6,14.2 1,9.1 9.3,8.8" fill="${color}" stroke="rgba(255,255,255,.5)" stroke-width=".4"/></svg>`;
  } else {
    const color = BALLOON_COLORS[Math.floor(Math.random()*BALLOON_COLORS.length)];
    el.innerHTML = `<svg viewBox="0 0 24 34" width="1em" height="1.4em"><ellipse cx="12" cy="13" rx="10" ry="12" fill="${color}"/><ellipse cx="8.3" cy="7.5" rx="3.1" ry="4.2" fill="#fff" opacity=".38"/><ellipse cx="12" cy="13" rx="10" ry="12" fill="none" stroke="rgba(0,0,0,.08)" stroke-width=".6"/><polygon points="9.4,24 14.6,24 12,27.8" fill="${color}"/><path d="M12 27.8 Q10.2 30.8 12 34" stroke="#8A7B6C" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`;
  }
  const isLarge = Math.random() < 0.25;
  const size = isLarge ? (46 + Math.random()*26) : (14 + Math.random()*18);
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

const CLOUD_SHAPES = [
  `<ellipse cx="34" cy="46" rx="30" ry="21"/><ellipse cx="64" cy="30" rx="34" ry="27"/><ellipse cx="93" cy="46" rx="25" ry="19"/><ellipse cx="60" cy="53" rx="50" ry="17"/>`,
  `<ellipse cx="26" cy="42" rx="22" ry="16"/><ellipse cx="50" cy="24" rx="26" ry="21"/><ellipse cx="78" cy="34" rx="22" ry="18"/><ellipse cx="98" cy="46" rx="18" ry="14"/><ellipse cx="55" cy="50" rx="48" ry="15"/>`,
  `<ellipse cx="30" cy="38" rx="20" ry="19"/><ellipse cx="58" cy="22" rx="24" ry="20"/><ellipse cx="88" cy="40" rx="21" ry="18"/><ellipse cx="60" cy="48" rx="45" ry="14"/>`,
  `<ellipse cx="22" cy="48" rx="18" ry="13"/><ellipse cx="45" cy="34" rx="22" ry="18"/><ellipse cx="70" cy="26" rx="26" ry="22"/><ellipse cx="97" cy="42" rx="20" ry="16"/><ellipse cx="58" cy="55" rx="52" ry="15"/>`
];
function spawnCloud(){
  const el = document.createElement('span');
  el.className = 'bg-cloud';
  const color = isNightMode() ? '#AAB9E8' : '#fff';
  const shape = CLOUD_SHAPES[Math.floor(Math.random()*CLOUD_SHAPES.length)];
  el.innerHTML = `<svg viewBox="0 0 120 70" width="100%" height="100%"><g fill="${color}">${shape}</g></svg>`;
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

/* ---------- setup flow ---------- */
let selectedAvatar = AVATARS[0];
function renderAvatarPicker(){
  const picker = $('emoji-picker');
  picker.innerHTML = '';
  AVATARS.forEach(em=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'emo-btn'+(em===selectedAvatar?' selected':'');
    b.textContent = em;
    b.addEventListener('click', ()=>{
      playClick();
      selectedAvatar = em;
      picker.querySelectorAll('.emo-btn').forEach(x=>x.classList.toggle('selected', x===b));
    });
    picker.appendChild(b);
  });
}
$('teacher-submit-btn').addEventListener('click', ()=>{
  const name = $('teacher-name-input').value.trim();
  const school = $('school-name-input').value.trim();
  if(!name){ showToast('✏️','ใส่ชื่อคุณครูก่อนนะคะ'); $('teacher-name-input').focus(); return; }
  if(!school){ showToast('🏫','ใส่ชื่อโรงเรียนก่อนนะคะ'); $('school-name-input').focus(); return; }
  playClick();
  profile = { name, school, avatar:selectedAvatar };
  saveProfile();
  renderTeacherHome();
});

/* ---------- teacher home ---------- */
function refreshHeaderChip(){
  if(profile){
    $('teacher-chip-group').hidden = false;
    $('header-teacher-emoji').textContent = profile.avatar;
    $('header-teacher-name').textContent = 'ครู'+profile.name;
  } else {
    $('teacher-chip-group').hidden = true;
  }
  /* ปุ่มจัดการข้อมูลโชว์เฉพาะเมื่อ setup แล้ว (pattern เดียวกับหน้าหลักที่ซ่อนตอน child-select) */
  $('clear-btn').hidden = !profile;
}
let selectedGrade = null;   // ระดับชั้นที่เลือกดูบนหน้า home (เฉพาะชั้นที่มีเกม publish)

function renderTeacherHome(){
  refreshHeaderChip();
  $('teacher-greeting').textContent = profile.avatar+' สวัสดี ครู'+profile.name+'!';
  /* เติมคำว่า "โรงเรียน" นำหน้าเสมอ (ถ้าครูพิมพ์มาแล้วไม่เติมซ้ำ) — icon โรงเรียน SVG สไตล์เดียวกับหน้าหลัก */
  const schoolLabel = profile.school.startsWith('โรงเรียน') ? profile.school : 'โรงเรียน'+profile.school;
  $('teacher-school-line').innerHTML = '<img src="../assets/icons/teacher/school.svg" class="cst-icon" alt=""> '+escapeHtml(schoolLabel)+' — เลือกเกมให้เด็กๆ เล่นได้เลย';
  const published = games.filter(g=>g.published);
  if(!published.length){
    /* ยังไม่มีเกม publish: โชว์ empty state (ถ้ามี draft ค้าง โชว์ปุ่มจัดการโจทย์ให้ไปเผยแพร่ได้) */
    $('teacher-empty').hidden = false;
    $('teacher-game-sections').hidden = true;
    $('teacher-empty-msg').textContent = games.length
      ? 'มีแบบร่างอยู่ '+games.length+' ชุด แต่ยังไม่ได้เผยแพร่ — กด "จัดการโจทย์" เพื่อเผยแพร่ให้เด็กเล่นนะคะ'
      : 'ยังไม่มีโจทย์เลย มาสร้างชุดแรกกันเถอะ!';
    $('teacher-empty-manage-btn').hidden = !games.length;
  } else {
    $('teacher-empty').hidden = true;
    $('teacher-game-sections').hidden = false;
    renderGradeFilter(published);
    renderMechGroups(published);
  }
  showView(homeView);
}
/* ปุ่มเลือกระดับชั้น — โชว์เฉพาะชั้นที่มีเกม publish แล้ว */
function renderGradeFilter(published){
  const grades = GRADES.filter(gr=>published.some(g=>g.grade===gr.id));
  if(!grades.some(gr=>gr.id===selectedGrade)) selectedGrade = grades[0].id;
  const wrap = $('grade-filter');
  wrap.innerHTML = '';
  grades.forEach(gr=>{
    const b = document.createElement('button');
    b.className = 'grade-chip'+(gr.id===selectedGrade?' selected':'');
    b.textContent = '🎓 '+gr.name;
    b.addEventListener('click', ()=>{
      playClick();
      selectedGrade = gr.id;
      renderTeacherHome();
    });
    wrap.appendChild(b);
  });
}
/* column เกมของชั้นที่เลือก จัดกลุ่มเป็น section ตามรูปแบบเกม (mechanic) แบบหน้าหลัก
   หัว section ใช้ icon SVG ชุดเดียวกับหน้าหลัก + fade-in ไล่จังหวะตอนสลับ filter */
function renderMechGroups(published){
  const wrap = $('teacher-mech-groups');
  wrap.innerHTML = '';
  const list = published.filter(g=>g.grade===selectedGrade);
  let seq = 0;
  MECHANICS.forEach(mech=>{
    const games2 = list.filter(g=>g.mechanic===mech.id);
    if(!games2.length) return;
    const title = document.createElement('div');
    title.className = 'teacher-grade-title tg-fade';
    title.style.animationDelay = (seq*0.05)+'s'; seq++;
    title.innerHTML = '<img src="'+mech.icon+'" class="cst-icon" alt=""> '+mech.name;
    wrap.appendChild(title);
    const grid = document.createElement('div');
    grid.className = 'cat-grid';
    games2.forEach(game=>{
      const card = buildGameCard(game);
      card.style.animationDelay = (seq*0.05)+'s'; seq++;
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
  });
}
/* การ์ดเกมบนหน้า home: ไม่มีปุ่มย่อย คลิกทั้งใบ = เข้าเล่นเลย (dispatch ตาม mechanic) */
function buildGameCard(game){
  const idx = games.indexOf(game);
  const [color, light] = CARD_COLORS[idx % CARD_COLORS.length];
  const card = document.createElement('button');
  card.className = 'cat-card settled tg-fade';
  card.style.setProperty('--cat-light', light);
  card.style.setProperty('--cat-color', color);
  card.innerHTML =
    '<div class="cat-emoji"><img src="'+game.logo+'" class="cat-icon-img" alt=""></div>'+
    '<div class="cat-name">'+escapeHtml(game.title)+'</div>'+
    '<div class="cat-meta">'+game.questionCount+' '+(mechById(game.mechanic).form==='pairs' ? 'ด่าน' : 'ข้อ/รอบ')+'</div>';
  card.addEventListener('click', ()=>{ playClick(); playTeacherGame(game.id); });
  return card;
}
/* dispatch เข้าเกมตาม mechanic: quiz → quiz engine, AR ทั้ง 4 แบบ → AR engine (teacher-ar.js) */
function playTeacherGame(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  if(game.mechanic==='quiz') startTeacherQuiz(gameId);
  else startTeacherAR(gameId);
}
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
$('teacher-add-big-btn').addEventListener('click', ()=>{ playClick(); openBuilder(null, 'home'); });
$('teacher-add-btn').addEventListener('click', ()=>{ playClick(); openBuilder(null, 'home'); });
$('teacher-manage-btn').addEventListener('click', ()=>{ playClick(); renderManage(); });
$('teacher-empty-manage-btn').addEventListener('click', ()=>{ playClick(); renderManage(); });

/* ---------- manage view (จัดการโจทย์: ทุกชุดทั้ง draft/published) ---------- */
let manageFilter = 'all';   // 'all' | grade id — filter รายการในหน้าจัดการโจทย์

function renderManage(){
  /* แถว filter: ทั้งหมด + เฉพาะระดับชั้นที่มีโจทย์ */
  const grades = GRADES.filter(gr=>games.some(g=>g.grade===gr.id));
  if(manageFilter!=='all' && !grades.some(gr=>gr.id===manageFilter)) manageFilter = 'all';
  const fWrap = $('manage-filter');
  fWrap.innerHTML = '';
  fWrap.hidden = !games.length;
  if(games.length){
    const mkChip = (id, label)=>{
      const b = document.createElement('button');
      b.className = 'grade-chip'+(manageFilter===id?' selected':'');
      b.textContent = label;
      b.addEventListener('click', ()=>{ playClick(); manageFilter = id; renderManage(); });
      fWrap.appendChild(b);
    };
    mkChip('all', '📚 ทั้งหมด');
    grades.forEach(gr=> mkChip(gr.id, '🎓 '+gr.name));
  }

  const wrap = $('manage-list');
  wrap.innerHTML = '';
  if(!games.length){
    wrap.innerHTML = '<p class="manage-empty">ยังไม่มีชุดโจทย์เลย กดปุ่มด้านบนเพื่อสร้างชุดแรกได้เลยค่ะ</p>';
  }
  /* แยกหัวข้อตามระดับชั้น (ตาม filter ที่เลือก) */
  GRADES.forEach(gr=>{
    if(manageFilter!=='all' && gr.id!==manageFilter) return;
    const list = games.filter(g=>g.grade===gr.id);
    if(!list.length) return;
    const head = document.createElement('div');
    head.className = 'mg-grade-title';
    head.textContent = '🎓 '+gr.name+' ('+list.length+' ชุด)';
    wrap.appendChild(head);
    list.forEach(game=> wrap.appendChild(buildManageRow(game)));
  });
  showView(manageView);
}
function buildManageRow(game){
    const mech = mechById(game.mechanic);
    const row = document.createElement('div');
    row.className = 'mg-item tg-fade';
    row.innerHTML =
      '<img class="mg-logo" src="'+game.logo+'" alt="">'+
      '<div class="mg-info">'+
        '<div class="mg-title">'+escapeHtml(game.title)+' '+(game.published?'<span class="mg-status mg-pub">เผยแพร่แล้ว</span>':'<span class="mg-status mg-draft">แบบร่าง</span>')+'</div>'+
        '<div class="mg-meta">'+mech.emoji+' '+mech.name+' · '+game.questionCount+' ข้อ/รอบ (มี '+game.questions.length+' ข้อ)</div>'+
      '</div>'+
      '<div class="mg-actions">'+
        (game.published?'':'<button class="tg-action-btn tg-pub">🚀 เผยแพร่</button>')+
        '<button class="tg-action-btn tg-edit">✏️ แก้ไข</button>'+
        '<button class="tg-action-btn tg-del">🗑️ ลบ</button>'+
      '</div>';
    const pubBtn = row.querySelector('.tg-pub');
    if(pubBtn) pubBtn.addEventListener('click', ()=>{
      playClick();
      if(game.questions.length < game.questionCount){
        showToast('🚫','เผยแพร่ไม่ได้: มีโจทย์ '+game.questions.length+' ข้อ แต่ตั้งไว้ '+game.questionCount+' ข้อ/รอบ — แก้ไขชุดนี้ก่อนนะคะ');
        return;
      }
      game.published = true; game.updatedAt = Date.now();
      saveGames(); renderManage();
    });
    row.querySelector('.tg-edit').addEventListener('click', ()=>{ playClick(); openBuilder(game.id, 'manage'); });
    row.querySelector('.tg-del').addEventListener('click', ()=>{ playClick(); askDeleteGame(game.id); });
    return row;
}
$('manage-back').addEventListener('click', ()=>{ playClick(); renderTeacherHome(); });
$('manage-add-btn').addEventListener('click', ()=>{ playClick(); openBuilder(null, 'manage'); });

/* ---------- delete confirm modal (ใช้ร่วม: ลบชุดโจทย์จากหน้าจัดการ / ลบข้อโจทย์ในฟอร์ม)
   ต้องเปิด-ปิดผ่าน openOverlay/closeOverlay เสมอ — CSS modal หลักซ่อนด้วย opacity:0
   จนกว่าจะติดคลาส .show การเซ็ต hidden=false เฉยๆ จะได้ modal ล่องหนบังจอ (เคยเป็นบั๊กมาแล้ว) ---------- */
let pendingDelete = null;   // {type:'game', id} | {type:'question', block}
function askDeleteGame(id){
  const game = games.find(g=>g.id===id);
  if(!game) return;
  pendingDelete = {type:'game', id};
  $('confirm-del-title').textContent = 'ลบชุดโจทย์นี้?';
  $('confirm-del-body').textContent = '"'+game.title+'" จะถูกลบถาวร (โจทย์ทั้งหมด '+game.questions.length+' ข้อ) กู้คืนไม่ได้นะคะ';
  openOverlay('confirm-del-modal');
}
function askDeleteQuestion(block, num){
  pendingDelete = {type:'question', block};
  $('confirm-del-title').textContent = 'ลบข้อที่ '+num+'?';
  $('confirm-del-body').textContent = 'โจทย์ข้อนี้จะถูกลบออกจากฟอร์ม กู้คืนไม่ได้นะคะ';
  openOverlay('confirm-del-modal');
}
function closeDelModal(){ closeOverlay('confirm-del-modal'); pendingDelete = null; }
$('confirm-del-cancel').addEventListener('click', ()=>{ playClick(); closeDelModal(); });
$('confirm-del-backdrop').addEventListener('click', ()=>{ closeDelModal(); });
$('confirm-del-ok').addEventListener('click', ()=>{
  playClick();
  if(pendingDelete && pendingDelete.type==='game'){
    games = games.filter(g=>g.id!==pendingDelete.id);
    saveGames();
    closeDelModal();
    renderManage(); /* ลบชุดได้จากหน้าจัดการโจทย์เท่านั้น — กลับไปหน้าเดิม */
  } else if(pendingDelete && pendingDelete.type==='question'){
    pendingDelete.block.remove();
    renumberQuestions();
    closeDelModal();
  } else if(pendingDelete && pendingDelete.type==='teacher'){
    /* ลบคุณครู: ล้างเฉพาะข้อมูลโหมดคุณครู (ไม่แตะข้อมูลเด็ก/ธีมของหน้าหลัก) แล้วกลับหน้า setup */
    try{ localStorage.removeItem(LS_PROFILE); localStorage.removeItem(LS_GAMES); }catch(e){}
    profile = null; games = []; selectedGrade = null; manageFilter = 'all';
    closeDelModal();
    refreshHeaderChip();
    $('teacher-name-input').value = ''; $('school-name-input').value = '';
    showView(setupView);
    showToast('🗑️','ลบข้อมูลคุณครูเรียบร้อยแล้วค่ะ');
  } else {
    closeDelModal();
  }
});

/* ---------- builder ---------- */
let editingGameId = null;   // null = สร้างใหม่
let builderFrom = 'manage'; // เข้าฟอร์มมาจากหน้าไหน ('home' | 'manage') — save/back แล้วกลับหน้านั้น
let selectedLogo = LOGOS[0];
let selectedMechanic = 'quiz';

function renderMechanicPicker(){
  const wrap = $('mechanic-picker');
  wrap.innerHTML = '';
  MECHANICS.forEach(m=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mechanic-chip'+(m.id===selectedMechanic?' selected':'');
    b.disabled = !m.enabled;
    b.innerHTML = m.emoji+' '+m.name+(m.enabled?'':' <span class="mechanic-soon">เร็วๆ นี้</span>');
    if(m.enabled){
      b.addEventListener('click', ()=>{
        playClick();
        if(selectedMechanic === m.id) return;
        selectedMechanic = m.id;
        wrap.querySelectorAll('.mechanic-chip').forEach(x=>x.classList.toggle('selected', x===b));
        /* ฟอร์มโจทย์ล้อตามรูปแบบเกม — สลับ mechanic แล้ว re-render พื้นที่โจทย์ใหม่
           (ถ้ากลับมาเป็น mechanic เดิมของเกมที่กำลังแก้ไข โหลดโจทย์เดิมคืน) */
        renderQuestionArea();
      });
    }
    wrap.appendChild(b);
  });
}
/* วาดพื้นที่ใส่โจทย์ใหม่ทั้งหมดตาม mechanic ปัจจุบัน */
function renderQuestionArea(){
  const game = editingGameId ? games.find(g=>g.id===editingGameId) : null;
  const qWrap = $('b-questions');
  qWrap.innerHTML = '';
  const form = mechById(selectedMechanic).form;
  if(game && game.mechanic===selectedMechanic && game.questions.length){
    game.questions.forEach(q=> qWrap.appendChild(buildQuestionBlock(q)));
  } else {
    qWrap.appendChild(buildQuestionBlock(null));
  }
  renumberQuestions();
  /* ป้ายกำกับ/หมายเหตุปรับตามรูปแบบเกม */
  $('bq-label-sub').textContent =
    form==='choices'  ? '(ติ๊ก ✔ หน้าคำตอบที่ถูก ช่องอื่นเป็นตัวลวง)' :
    form==='sentence' ? '(พิมพ์คำหรือประโยค เว้นวรรคระหว่างการ์ดแต่ละใบ ระบบจะตัดเป็นการ์ดให้เด็กเรียงตามลำดับ)' :
                        '(ใส่คู่ที่ตรงกัน ซ้าย ↔ ขวา ตอนเล่นจะสุ่มมาโยงครั้งละไม่เกิน 4 คู่)';
  $('b-count-note').textContent =
    form==='pairs'
      ? '💡 จำนวนนี้คือจำนวนด่านต่อรอบเล่น — ใส่คู่ได้มากกว่าจำนวนด่าน ระบบจะสุ่มคู่มาให้เล่นไม่ซ้ำ'
      : '💡 ใส่โจทย์มากกว่าจำนวนนี้ได้ ระบบจะสุ่มโจทย์มาให้ตามจำนวนที่เลือกทุกรอบเล่น';
}
function renderLogoPicker(){
  const wrap = $('logo-picker');
  wrap.innerHTML = '';
  LOGOS.forEach(src=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'logo-choice'+(src===selectedLogo?' selected':'');
    b.innerHTML = '<img src="'+src+'" alt="">';
    b.addEventListener('click', ()=>{
      playClick();
      selectedLogo = src;
      wrap.querySelectorAll('.logo-choice').forEach(x=>x.classList.toggle('selected', x===b));
    });
    wrap.appendChild(b);
  });
}

/* บล็อกโจทย์ 1 ข้อในฟอร์ม — dispatch ตามรูปแบบฟอร์มของ mechanic ปัจจุบัน (เก็บข้อมูลผ่าน DOM ตอน save) */
function buildQuestionBlock(qData){
  const form = mechById(selectedMechanic).form;
  if(form==='sentence') return buildSentenceBlock(qData);
  if(form==='pairs')    return buildPairBlock(qData);
  return buildChoicesBlock(qData);
}
/* โครง block ร่วม: หัวเลขข้อ + ปุ่มลบข้อ */
function bqShell(innerHtml){
  const block = document.createElement('div');
  block.className = 'bq-block';
  block.innerHTML =
    '<div class="bq-head"><span class="bq-num"></span><button type="button" class="bq-del-btn">🗑️ ลบข้อนี้</button></div>'+innerHtml;
  block.querySelector('.bq-del-btn').addEventListener('click', ()=>{
    playClick();
    if($('b-questions').children.length <= 1){ showToast('⚠️','ต้องมีโจทย์อย่างน้อย 1 ข้อนะคะ'); return; }
    const num = Array.from($('b-questions').children).indexOf(block)+1;
    askDeleteQuestion(block, num);
  });
  return block;
}
/* ฟอร์มแบบเรียงลำดับ (ar-sentence): 1 ข้อ = 1 ข้อความ เว้นวรรคเป็นการ์ดแต่ละใบ (ใช้ได้ทั้งเรียงคำ/ต่อประโยค) */
function buildSentenceBlock(qData){
  const block = bqShell('<input class="child-name-input bq-q-input bq-sentence-input" type="text" placeholder="เช่น แมว กิน ปลา หรือ 1 2 3 4" maxlength="200">');
  if(qData) block.querySelector('.bq-sentence-input').value = qData.sentence;
  return block;
}
/* ฟอร์มแบบจับคู่ (ar-connect): 1 ข้อ = 1 คู่ ซ้าย↔ขวา */
function buildPairBlock(qData){
  const block = bqShell(
    '<div class="bq-pair-row">'+
      '<input class="child-name-input bq-ans-input bq-pair-left" type="text" placeholder="ฝั่งซ้าย เช่น 🐘 หรือ ช้าง" maxlength="60">'+
      '<span class="bq-pair-arrow">↔</span>'+
      '<input class="child-name-input bq-ans-input bq-pair-right" type="text" placeholder="ฝั่งขวา เช่น elephant" maxlength="60">'+
    '</div>');
  if(qData){
    block.querySelector('.bq-pair-left').value = qData.left;
    block.querySelector('.bq-pair-right').value = qData.right;
  }
  return block;
}
/* ฟอร์มแบบตัวเลือก (quiz / ar-pick): โจทย์ + คำตอบหลายช่อง ติ๊กข้อถูก */
function buildChoicesBlock(qData){
  const block = bqShell(
    '<input class="child-name-input bq-q-input" type="text" placeholder="พิมพ์โจทย์ เช่น 2 + 3 = ?" maxlength="200">'+
    '<div class="bq-answers"></div>'+
    '<button type="button" class="bq-add-ans-btn">＋ เพิ่มคำตอบ</button>');
  const ansWrap = block.querySelector('.bq-answers');
  const radioName = 'bq-correct-'+Math.random().toString(36).slice(2,8);

  function addAnswerRow(text, isCorrect){
    const row = document.createElement('div');
    row.className = 'bq-ans-row';
    row.innerHTML =
      '<input type="radio" name="'+radioName+'" title="คำตอบที่ถูก">'+
      '<input class="child-name-input bq-ans-input" type="text" placeholder="คำตอบ" maxlength="100">'+
      '<button type="button" class="bq-ans-del" title="ลบคำตอบนี้">✕</button>';
    row.querySelector('.bq-ans-input').value = text || '';
    row.querySelector('input[type=radio]').checked = !!isCorrect;
    row.querySelector('.bq-ans-del').addEventListener('click', ()=>{
      playClick();
      if(ansWrap.children.length <= 2){ showToast('⚠️','ต้องมีคำตอบอย่างน้อย 2 ช่องนะคะ'); return; }
      row.remove();
    });
    ansWrap.appendChild(row);
  }
  block.querySelector('.bq-add-ans-btn').addEventListener('click', ()=>{ playClick(); addAnswerRow('', false); });

  if(qData){
    block.querySelector('.bq-q-input').value = qData.q;
    qData.answers.forEach((a,i)=> addAnswerRow(a, i===qData.correct));
  } else {
    addAnswerRow('', true);
    addAnswerRow('', false);
    addAnswerRow('', false);
  }
  return block;
}
function renumberQuestions(){
  Array.from($('b-questions').children).forEach((b,i)=>{
    b.querySelector('.bq-num').textContent = 'ข้อที่ '+(i+1);
  });
}
$('b-add-question').addEventListener('click', ()=>{
  playClick();
  $('b-questions').appendChild(buildQuestionBlock(null));
  renumberQuestions();
});

function openBuilder(gameId, from){
  editingGameId = gameId;
  builderFrom = from || 'manage';
  const game = gameId ? games.find(g=>g.id===gameId) : null;
  $('builder-title-label').textContent = game ? 'แก้ไข: '+game.title : 'สร้างชุดโจทย์ใหม่';
  $('b-grade').value = game ? game.grade : 'p1';
  selectedMechanic = game ? game.mechanic : 'quiz';
  $('b-title').value = game ? game.title : '';
  selectedLogo = game ? game.logo : LOGOS[Math.floor(Math.random()*LOGOS.length)];
  $('b-count').value = game ? game.questionCount : 10;
  $('b-shuffle').checked = game ? !!game.shuffle : true;
  renderMechanicPicker();
  renderLogoPicker();
  renderQuestionArea();
  showView(builderView);
}
function leaveBuilder(){
  if(builderFrom === 'home') renderTeacherHome();
  else renderManage();
}
$('builder-back').addEventListener('click', ()=>{ playClick(); leaveBuilder(); });

/* อ่าน+ตรวจข้อมูลจากฟอร์ม — คืน object หรือ null (พร้อม alert บอกจุดผิด) */
function collectBuilderData(){
  const title = $('b-title').value.trim();
  if(!title){ showToast('✏️','ใส่ชื่อหัวข้อเกมก่อนนะคะ'); $('b-title').focus(); return null; }
  const count = parseInt($('b-count').value, 10);
  if(!count || count < 1){ showToast('⚠️','จำนวนโจทย์ต่อรอบต้องอย่างน้อย 1 ข้อนะคะ'); $('b-count').focus(); return null; }
  const form = mechById(selectedMechanic).form;
  const questions = [];
  const blocks = Array.from($('b-questions').children);
  for(let i=0;i<blocks.length;i++){
    const b = blocks[i];
    if(form==='sentence'){
      const sentence = b.querySelector('.bq-sentence-input').value.trim();
      if(!sentence){ showToast('✏️','ข้อที่ '+(i+1)+' ยังไม่ได้ใส่ประโยคนะคะ'); return null; }
      const words = sentence.split(/\s+/);
      if(words.length < 2){ showToast('⚠️','ข้อที่ '+(i+1)+' ประโยคต้องมีอย่างน้อย 2 คำ (เว้นวรรคระหว่างคำ) นะคะ'); return null; }
      if(words.length > 6){ showToast('⚠️','ข้อที่ '+(i+1)+' ประโยคยาวเกิน 6 คำ จอเด็กวางการ์ดไม่พอนะคะ'); return null; }
      questions.push({ sentence });
    } else if(form==='pairs'){
      const left = b.querySelector('.bq-pair-left').value.trim();
      const right = b.querySelector('.bq-pair-right').value.trim();
      if(!left || !right){ showToast('✏️','คู่ที่ '+(i+1)+' ยังใส่ไม่ครบทั้งสองฝั่งนะคะ'); return null; }
      questions.push({ left, right });
    } else {
      const qText = b.querySelector('.bq-q-input').value.trim();
      const rows = Array.from(b.querySelectorAll('.bq-ans-row'));
      const answers = rows.map(r=>r.querySelector('.bq-ans-input').value.trim());
      const correct = rows.findIndex(r=>r.querySelector('input[type=radio]').checked);
      if(!qText){ showToast('✏️','ข้อที่ '+(i+1)+' ยังไม่ได้ใส่โจทย์นะคะ'); return null; }
      if(answers.some(a=>!a)){ showToast('✏️','ข้อที่ '+(i+1)+' มีช่องคำตอบว่างอยู่นะคะ (ลบช่องที่ไม่ใช้ออกได้)'); return null; }
      if(answers.length < 2){ showToast('⚠️','ข้อที่ '+(i+1)+' ต้องมีคำตอบอย่างน้อย 2 ช่องนะคะ'); return null; }
      if(correct < 0){ showToast('☑️','ข้อที่ '+(i+1)+' ยังไม่ได้ติ๊กคำตอบที่ถูกนะคะ'); return null; }
      questions.push({ q:qText, answers, correct });
    }
  }
  if(!questions.length){ showToast('⚠️','ต้องมีโจทย์อย่างน้อย 1 ข้อนะคะ'); return null; }
  /* ar-connect: ต้องมีอย่างน้อย 2 คู่ถึงจะโยงเส้นได้ */
  if(form==='pairs' && questions.length < 2){ showToast('⚠️','เกมโยงเส้นต้องมีอย่างน้อย 2 คู่นะคะ'); return null; }
  return {
    grade: $('b-grade').value,
    mechanic: selectedMechanic,
    title,
    logo: selectedLogo,
    questionCount: Math.min(count, 50),
    shuffle: $('b-shuffle').checked,
    questions
  };
}
function saveBuilder(publish){
  const data = collectBuilderData();
  if(!data) return;
  /* กติกา publish: ต้องมีโจทย์ในคลังอย่างน้อยเท่าจำนวนโจทย์ต่อรอบ (save draft ได้ตามปกติ) */
  if(publish && data.questions.length < data.questionCount){
    showToast('🚫','เผยแพร่ไม่ได้: มีโจทย์ '+data.questions.length+' ข้อ แต่ตั้งไว้ '+data.questionCount+' ข้อ/รอบ — เพิ่มโจทย์หรือลดจำนวนต่อรอบก่อนนะคะ');
    return;
  }
  if(editingGameId){
    const game = games.find(g=>g.id===editingGameId);
    Object.assign(game, data);
    if(publish) game.published = true;
    game.updatedAt = Date.now();
  } else {
    games.push(Object.assign({
      id: 'tg-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
      published: !!publish,
      createdAt: Date.now(), updatedAt: Date.now()
    }, data));
  }
  saveGames();
  playCorrect();
  /* publish แล้วพากลับหน้า home ให้เห็นเกมโชว์เลย / save draft กลับหน้าที่มา */
  if(publish) renderTeacherHome();
  else leaveBuilder();
}
$('b-cancel').addEventListener('click', ()=>{ playClick(); leaveBuilder(); });
$('b-save-draft').addEventListener('click', ()=>{ playClick(); saveBuilder(false); });

/* ---------- แทรก emoji ลงช่องโจทย์/คำตอบ ----------
   จำช่อง input ตัวหนังสือที่ focus ล่าสุดในฟอร์มโจทย์ แล้วแทรก emoji ที่ตำแหน่ง cursor */
const EMOJI_INSERT_SET = [
  '🐶','🐱','🐰','🐻','🐼','🦊','🐸','🐷','🐮','🐵','🐔','🦉','🦁','🐯','🐘','🦒','🦆','🐟','🦈','🐙','🦀','🐢','🦋','🐝',
  '🍎','🍌','🍇','🍉','🍓','🍍','🍒','🥕','🌽','🍄','🍦','🍰','🧁','🍭',
  '⚽','🏀','🚗','🚲','✈️','🚀','⛵','🎈','🎁','🧸','⭐','🌈','☀️','🌙','☁️','⛄','🌸','🌳','💛','✏️','📚','🎨','🥁','🎵'
];
let lastEmojiTarget = null;
$('b-questions').addEventListener('focusin', (e)=>{
  if(e.target && e.target.matches('input[type="text"]')) lastEmojiTarget = e.target;
});
function renderEmojiPop(){
  const grid = $('emoji-pop-grid');
  grid.innerHTML = '';
  EMOJI_INSERT_SET.forEach(em=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'emoji-pop-btn';
    b.textContent = em;
    b.addEventListener('click', ()=>{
      playClick();
      /* default: ช่องแรกของฟอร์ม ถ้ายังไม่เคย focus ช่องไหน */
      if(!lastEmojiTarget || !document.body.contains(lastEmojiTarget)){
        lastEmojiTarget = $('b-questions').querySelector('input[type="text"]');
      }
      if(!lastEmojiTarget) return;
      const inp = lastEmojiTarget;
      const start = inp.selectionStart ?? inp.value.length;
      const end = inp.selectionEnd ?? inp.value.length;
      inp.value = inp.value.slice(0, start) + em + inp.value.slice(end);
      const pos = start + em.length;
      inp.focus();
      try{ inp.setSelectionRange(pos, pos); }catch(e){}
      lastEmojiTarget = inp;
    });
    grid.appendChild(b);
  });
}
$('b-emoji-btn').addEventListener('click', ()=>{
  playClick();
  const pop = $('emoji-insert-pop');
  pop.hidden = !pop.hidden;
  if(!pop.hidden && !$('emoji-pop-grid').children.length) renderEmojiPop();
});
$('b-publish').addEventListener('click', ()=>{ playClick(); saveBuilder(true); });

/* ---------- quiz play (adapt จาก engine หน้าหลัก — ไม่มีสติกเกอร์) ---------- */
let quiz = null;   // {gameId, qIndex, score, wrong:[], answered, questions:[{q,choices,correct}]}
function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}
/* แปลงโจทย์ {q,answers,correct} → {q,choices,correct} พร้อมสลับตัวเลือกถ้าเปิด shuffle */
function prepareQuestion(qd, shuffleChoices){
  const idxs = qd.answers.map((_,i)=>i);
  if(shuffleChoices) shuffleArray(idxs);
  return {
    q: qd.q,
    choices: idxs.map(i=>qd.answers[i]),
    correct: idxs.indexOf(qd.correct)
  };
}
function startTeacherQuiz(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  lastPlay = { type:'quiz', gameId };
  let pool = game.questions.slice();
  if(game.shuffle) shuffleArray(pool);
  pool = pool.slice(0, Math.min(game.questionCount, pool.length));
  quiz = {
    gameId,
    qIndex: 0, score: 0, wrong: [], answered: false,
    questions: pool.map(qd=>prepareQuestion(qd, game.shuffle))
  };
  const idx = games.indexOf(game);
  const [color, light] = CARD_COLORS[idx % CARD_COLORS.length];
  quiz.color = color; quiz.light = light;
  document.documentElement.style.setProperty('--cat-color', color);
  quizView.querySelectorAll('.progress-fill, .next-btn').forEach(el=>el.style.setProperty('--cat-color', color));
  $('quiz-cat-label').innerHTML = '<img src="'+game.logo+'" class="cat-label-icon" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;">'+escapeHtml(game.title);
  showView(quizView);
  renderQuestion();
}
function renderQuestion(){
  const total = quiz.questions.length;
  const q = quiz.questions[quiz.qIndex];
  quiz.answered = false;
  $('q-counter').textContent = (quiz.qIndex+1)+'/'+total;
  $('progress-fill').style.width = ((quiz.qIndex)/total*100)+'%';
  $('progress-fill').style.background = quiz.color;
  $('q-emoji').textContent = '';
  $('q-text').textContent = q.q;
  const grid = $('choice-grid');
  grid.innerHTML = '';
  q.choices.forEach((choiceText, idx)=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.style.setProperty('--cat-light', quiz.light);
    btn.textContent = choiceText;
    btn.addEventListener('click', ()=> selectAnswer(idx, q));
    grid.appendChild(btn);
  });
  const fb = $('feedback');
  fb.className = 'feedback';
  $('fb-text').textContent = '';
  $('fb-face').textContent = '';
  const nb = $('next-btn');
  nb.className = 'next-btn';
  nb.style.setProperty('--cat-color', quiz.color);
  nb.textContent = (quiz.qIndex === total-1) ? 'ดูคะแนนเลย! 🏁' : 'ข้อต่อไป ➜';
}
function selectAnswer(idx, q){
  if(quiz.answered) return;
  quiz.answered = true;
  const ok = idx === q.correct;
  const buttons = Array.from($('choice-grid').children);
  buttons.forEach((b,i)=>{
    b.disabled = true;
    if(i === q.correct) b.classList.add('correct');
    else if(i === idx) b.classList.add('wrong');
    if(i !== q.correct && i !== idx) b.classList.add('dim');
  });
  const fb = $('feedback');
  if(ok){
    quiz.score++;
    playCorrect();
    fb.classList.add('ok');
    $('fb-face').textContent = '🎉';
    $('fb-text').textContent = 'เก่งมาก! ตอบถูกแล้ว';
  } else {
    quiz.wrong.push({ q:q.q, correctText:q.choices[q.correct] });
    playWrong();
    fb.classList.add('ng');
    $('fb-face').textContent = '💪';
    $('fb-text').textContent = 'ยังไม่ถูกนะ คำตอบคือ "'+q.choices[q.correct]+'"';
  }
  requestAnimationFrame(()=>fb.classList.add('show'));
  requestAnimationFrame(()=>$('next-btn').classList.add('show'));
}
$('next-btn').addEventListener('click', ()=>{
  playClick();
  if(!quiz.answered) return;
  if(quiz.qIndex < quiz.questions.length-1){
    quiz.qIndex++;
    renderQuestion();
  } else {
    finishTeacherQuiz();
  }
});
$('quiz-back').addEventListener('click', ()=>{ playClick(); renderTeacherHome(); });

function finishTeacherQuiz(){
  const total = quiz.questions.length;
  const pct = quiz.score/total;
  const stars = pct>=0.9 ? 3 : (pct>=0.6 ? 2 : 1);
  showView(resultView);
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? 'สุดยอดไปเลย!' : stars===2 ? 'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent='⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });
  $('score-line').textContent = 'ทำถูก '+quiz.score+'/'+total+' ข้อ';
  $('score-sub').textContent = stars===3 ? 'เก่งสุด ๆ ไปเลย ทำได้เกือบครบทุกข้อ!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งได้เสมอ!';
  const wrap = $('review-wrap');
  const list = $('review-list');
  if(quiz.wrong.length){
    wrap.hidden = false;
    list.innerHTML = '';
    quiz.wrong.forEach(w=>{
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = '<div class="rq">'+escapeHtml(w.q)+'</div><div class="ra">✅ '+escapeHtml(w.correctText)+'</div>';
      list.appendChild(item);
    });
  } else {
    wrap.hidden = true;
  }
  if(stars>=2) setTimeout(()=>playCongrats(), 250);
}
$('retry-btn').addEventListener('click', ()=>{
  playClick();
  if(!lastPlay) return;
  if(lastPlay.type==='ar') startTeacherAR(lastPlay.gameId);
  else startTeacherQuiz(lastPlay.gameId);
});
$('home-btn').addEventListener('click', ()=>{ playClick(); renderTeacherHome(); });

/* ---------- จัดการข้อมูล: ย้ายข้อมูล (export/import) + ลบคุณครู ----------
   ย้ายเฉพาะโปรไฟล์คุณครู + โจทย์ทั้งหมด (ไม่แตะข้อมูลเด็กของหน้าหลัก)
   รูปแบบไฟล์: JSON → checksum djb2 prefix OWKT1_ → UTF-8 → Base64 (แนวเดียวกับ export เด็กหน้าหลักที่ใช้ OWK1_) */
function owktHash(str){
  let h = 5381;
  for(let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return 'OWKT1_' + (h >>> 0).toString(16).padStart(8, '0');
}
function exportTeacherData(){
  if(!profile){ showToast('⚠️','ยังไม่มีข้อมูลคุณครูให้ย้ายนะคะ'); return; }
  const payload = {v:1, teacher:profile, games};
  const body = JSON.stringify({v:payload.v, teacher:payload.teacher, games:payload.games});
  const sig = owktHash(body);
  const full = JSON.stringify({v:payload.v, teacher:payload.teacher, games:payload.games, sig});
  const bytes = new TextEncoder().encode(full);
  const binary = Array.from(bytes, b=>String.fromCharCode(b)).join('');
  const b64 = btoa(binary);
  const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)+Date.now().toString(36);
  const blob = new Blob([b64], {type:'application/octet-stream'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'owlkids_teacher_'+uuid;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  showToast('📤','ดาวน์โหลดไฟล์ข้อมูลคุณครูแล้ว เก็บไว้นำเข้าที่อุปกรณ์ใหม่ได้เลยค่ะ');
}
function importTeacherFile(file){
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const binary = atob(String(e.target.result).trim());
      const bytes = Uint8Array.from(binary, c=>c.charCodeAt(0));
      const jsonStr = new TextDecoder().decode(bytes);
      const data = JSON.parse(jsonStr);
      if(!data || !data.teacher || !data.teacher.name || !Array.isArray(data.games)) throw new Error('bad');
      const body = JSON.stringify({v:data.v, teacher:data.teacher, games:data.games});
      if(owktHash(body) !== data.sig) throw new Error('sig');
      profile = data.teacher;
      games = data.games;
      saveProfile(); saveGames();
      showToast('✅','นำเข้าข้อมูลคุณครูสำเร็จแล้วค่ะ');
      renderTeacherHome();
    }catch(err){
      showToast('🚫','ไฟล์ไม่ถูกต้องหรือเสียหาย นำเข้าไม่ได้นะคะ');
    }
  };
  reader.readAsText(file);
}
$('teacher-import-btn').addEventListener('click', ()=>{ playClick(); $('teacher-import-input').click(); });
$('teacher-import-input').addEventListener('change', (e)=>{
  const f = e.target.files && e.target.files[0];
  if(f) importTeacherFile(f);
  e.target.value = '';
});

/* data modal (ปุ่มจัดการข้อมูลใน header — โชว์หลัง setup แล้วเท่านั้น) */
$('clear-btn').addEventListener('click', ()=>{ playClick(); openOverlay('data-modal'); });
$('data-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('data-modal'); });
$('data-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('data-modal'); });
$('data-export-btn').addEventListener('click', ()=>{ playClick(); exportTeacherData(); });
$('data-delete-btn').addEventListener('click', ()=>{
  playClick();
  closeOverlay('data-modal');
  pendingDelete = {type:'teacher'};
  $('confirm-del-title').textContent = 'ลบคุณครู?';
  $('confirm-del-body').textContent = 'โปรไฟล์คุณครูและโจทย์ทั้งหมด '+games.length+' ชุดจะถูกลบถาวร กู้คืนไม่ได้นะคะ';
  setTimeout(()=>openOverlay('confirm-del-modal'), 320);
});

/* ---------- Buy me a Milk (QR modal — id `qr-modal` เดียวกับหน้าหลัก ได้ CSS centering จาก style.css) ---------- */
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
$('bmm-btn').addEventListener('click', ()=>{ playClick(); openOverlay('qr-modal'); });
$('qr-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('qr-modal'); });
$('qr-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('qr-modal'); });

/* ---------- init ---------- */
loadData();
renderAvatarPicker();
fetch('../version').then(r=>r.text()).then(v=>{ $('app-version').textContent = v.trim()+' (teacher)'; }).catch(()=>{});
if(profile){
  renderTeacherHome();
} else {
  showView(setupView);
}
