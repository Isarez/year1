/* ============================= STATE ============================= */
let progress = {};
let soundOn = true;
try{ soundOn = localStorage.getItem('p1quiz_sound') !== 'off'; }catch(e){}
let state = { catId:null, qIndex:0, score:0, wrong:[], answered:false };
let pendingSticker = null;

/* ============================= CHILDREN ============================= */
const CHILD_AVATARS = [
  '🐶','🐱','🐰','🐻','🐼','🦊',
  '🐸','🐧','🦄','🦋','🦕','🐙',
  '🦁','🐯','🐨','🐹','🦔','🦦',
  '🌟','🌈','🚀','🎈','🍦','🎀'
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

function addChild(name){
  name = name.trim();
  if(!name) return;
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
  homeView.hidden = false;
  updateHeaderChild();
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('welcome'), 700);
}

function updateHeaderChild(){
  const switchBtn = $('switch-child-btn');
  if(activeChild){
    $('header-child-emoji').textContent = activeChild.emoji || '👤';
    $('header-child-name').textContent = activeChild.name;
    switchBtn.hidden = false;
    $('brand-sub').textContent = 'สวัสดี '+activeChild.name+' 👋';
  } else {
    switchBtn.hidden = true;
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
      cstars.textContent = stars ? '⭐'.repeat(Math.min(stars,15)) : 'ยังไม่เคยทำ ✨';
      cinfo.appendChild(cname);
      cinfo.appendChild(cstars);
      const arrow = document.createElement('span');
      arrow.style.cssText = 'font-size:20px;color:var(--ink-soft)';
      arrow.textContent = '▶';
      card.appendChild(avSpan);
      card.appendChild(cinfo);
      card.appendChild(arrow);
      card.addEventListener('click', ()=>{ playClick(); selectChild(child.id); });
      listEl.appendChild(card);
    });
    addForm.hidden = true;
    addNewBtn.hidden = false;
  }
  $('child-name-input').value = '';
  selectedEmoji = CHILD_AVATARS[0];
  initEmojiPicker();
  $('child-select-view').hidden = false;
  homeView.hidden = true;
  $('owl-widget').hidden = true;
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
function playClick(){ playTone(420,.05,'square',0,.04); }

/* ============================= BACKGROUND MUSIC ============================= */
let musicOn = true;
try{ musicOn = localStorage.getItem('p1quiz_music') !== 'off'; }catch(e){}
let musicGain=null, musicSchedulerId=null, musicNoteIndex=0, musicNextTime=0;
const BPM = 128;
const BEAT = 60/BPM;
/* bouncy C-major melody — upbeat school-song feel */
const MUSIC_MELODY = [
  /* phrase 1 — happy climb */
  [523.25,.5],[659.25,.5],[783.99,.5],[659.25,.5],
  [880.00,.5],[783.99,.25],[659.25,.25],[523.25,1],
  /* phrase 2 — call-response */
  [587.33,.25],[659.25,.25],[587.33,.25],[523.25,.25],
  [659.25,.5],[783.99,.5],[659.25,.75],[null,.25],
  /* phrase 3 — bounce pattern */
  [523.25,.25],[523.25,.25],[659.25,.25],[783.99,.25],
  [880.00,.5],[783.99,.25],[659.25,.25],
  [783.99,.5],[659.25,.25],[523.25,.25],[587.33,.5],[null,.5],
  /* phrase 4 — skip down */
  [880.00,.5],[783.99,.5],[659.25,.5],[587.33,.5],
  [523.25,.5],[659.25,.25],[523.25,.25],[392.00,.5],[null,.5],
  /* phrase 5 — energetic jumps */
  [523.25,.25],[659.25,.25],[523.25,.25],[783.99,.25],
  [659.25,.5],[523.25,.25],[659.25,.25],[880.00,.75],[null,.25],
  /* phrase 6 — cascade down */
  [1046.5,.25],[880.00,.25],[783.99,.25],[659.25,.25],
  [523.25,.5],[659.25,.5],[783.99,.5],[659.25,.5],
  /* phrase 7 — playful staccato */
  [523.25,.25],[659.25,.25],[783.99,.25],[880.00,.25],
  [783.99,.5],[659.25,.25],[523.25,.25],[587.33,.5],[659.25,.5],
  /* phrase 8 — round off */
  [523.25,.5],[659.25,.5],[783.99,.5],[523.25,.5],
  [523.25,1.5],[null,.5]
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
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.exponentialRampToValueAtTime(0.9, startTime+0.035);
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
    const [freq, beats] = MUSIC_MELODY[musicNoteIndex];
    const dur = beats*BEAT;
    scheduleMusicNote(freq, musicNextTime, dur);
    musicNextTime += dur;
    musicNoteIndex = (musicNoteIndex+1) % MUSIC_MELODY.length;
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
function refreshMusicBtn(){ musicBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">🎵</span><span class="mute-stripe"></span></span>'; musicBtn.classList.toggle('muted', !musicOn); musicBtn.dataset.tooltip = musicOn ? 'ปิดเพลงพื้นหลัง' : 'เปิดเพลงพื้นหลัง'; }

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
const homeView = $('home-view'), quizView = $('quiz-view'), resultView = $('result-view'), arView = $('ar-view');
const mascot = $('mascot');
let lastGameType = 'quiz', lastCatId = null;

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
function updateTally(){ $('tally-text').textContent = stickerCount()+'/'+CATS.length; }

/* wire child-select events now that $ is available */
wireChildSelectEvents();
$('switch-child-btn').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  homeView.hidden = true; quizView.hidden = true; resultView.hidden = true; arView.hidden = true;
  renderChildSelect();
});

/* ============================= HOME RENDER ============================= */
function renderHome(){
  const name = activeChild ? activeChild.name : 'นักสู้ตัวน้อย';
  $('hero-greeting').textContent = 'สวัสดีจ้า '+name+'! 🎉';
  const grid = $('cat-grid');
  const gridInteractive = $('cat-grid-interactive');
  grid.innerHTML = '';
  gridInteractive.innerHTML = '';
  CATS.forEach(cat=>{
    const p = progress[cat.id];
    const unlocked = p && p.unlocked;
    const reqId = CAT_REQUIRES[cat.id];
    const isLocked = !!reqId && !(progress[reqId] && progress[reqId].unlocked);
    const card = document.createElement('button');
    card.className = 'cat-card'+(isLocked?' cat-locked':'');
    card.style.setProperty('--cat-light', isLocked?'#EEEEEE':cat.light);
    const total = cat.type==='ar' ? cat.levels : cat.questions.length;
    card.innerHTML =
      (cat.isNew ? '<div class="cat-new-badge">NEW ✨</div>' : '')+
      '<div class="cat-sticker'+(unlocked?' unlocked':'')+'">'+(unlocked?cat.emoji:'🔒')+'</div>'+
      '<div class="cat-emoji">'+(isLocked?'🔒':cat.emoji)+'</div>'+
      '<div class="cat-name">'+cat.name+'</div>'+
      '<div class="cat-meta">'+(cat.type==='ar' ? total+' ด่าน 🖐️' : total+' ข้อ')+'</div>'+
      (isLocked
        ? '<div class="cat-lock-msg">🔐 ผ่าน '+catById(reqId).name+' ก่อนนะ</div>'
        : (p ? '<div class="cat-progress">ทำแล้ว '+p.best+'/'+total+' '+'⭐'.repeat(p.stars)+'</div>'
              : '<div class="cat-progress cat-progress-new">ยังไม่เคยทำ ✨</div>'));
    card.addEventListener('click', ()=>{
      if(isLocked){
        showToast('🔐','ต้องผ่าน '+catById(reqId).name+' ก่อนนะ!');
        showOwlMsg('locked');
        return;
      }
      playClick();
      if(cat.type==='ar') startARGame(cat.id); else startQuiz(cat.id);
    });
    (cat.type==='ar' ? gridInteractive : grid).appendChild(card);
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
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = false; arView.hidden = true;
  document.documentElement.style.setProperty('--cat-color', cat.color);
  quizView.querySelectorAll('.progress-fill, .next-btn').forEach(el=>{ el.style.setProperty('--cat-color', cat.color); });
  $('quiz-cat-label').textContent = cat.emoji+' '+cat.name;
  $('quiz-cat-label').style.color = cat.color;
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
    $('sticker-earned').textContent = cat.emoji;
    pendingSticker = cat.id;
    setTimeout(()=>burstCenterTop(40), 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(state.score === total){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>burstCenterTop(50), 250);
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
  if(lastGameType==='ar'){ startARGame(lastCatId); } else { startQuiz(state.catId); }
});
$('home-btn').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  resultView.hidden = true; quizView.hidden = true; arView.hidden = true; homeView.hidden = false;
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

function buildLevel(catId){
  const cat = catById(catId);
  $('ar-math-problem').hidden = true;
  $('ar-slot-row').hidden = false;
  $('ar-match-wrap').hidden = true;
  if(cat.mode==='math'){ buildMathLevel(cat); return; }
  if(cat.mode==='match'){ buildMatchLevel(cat); return; }
  const level = arGame.level;
  const wordCount = level<=3 ? 3 : (level<=6 ? 4 : 5);
  const pool = AR_SENTENCES[cat.lang][wordCount];
  const sentence = pool[Math.floor(Math.random()*pool.length)];
  renderSlotsAndCards(sentence);
  showARHint(isMobileViewport()
    ? (cat.lang==='th' ? '👆 แตะคำแล้วลากไปเรียงในช่องให้ถูกลำดับนะ!' : '👆 Tap a word card and drag it into the right box!')
    : (cat.lang==='th' ? '✋ จีบนิ้วหยิบคำ แล้วลากไปเรียงในช่องให้ถูกลำดับนะ!' : '✋ Pinch a word card and drag it into the right box!'));
}

/* scatter position in a safe zone away from screen edges (hand tracking loses the hand near frame edges), spread across `n` horizontal slices */
function scatterPosition(pos, n){
  const safeLeft = 18, safeWidth = 64;   // keep horizontal center within 18%-82%
  const safeTop = 42, safeHeight = 34;   // keep vertical center within 42%-76%
  const slotW = safeWidth/n;
  const left = (safeLeft + slotW*pos + Math.random()*slotW*0.3).toFixed(1)+'%';
  /* zig-zag rows (alternate near-top/near-bottom of the safe band) so bigger cards don't overlap each other */
  const rowH = safeHeight/2;
  const top = (safeTop + (pos%2)*rowH + Math.random()*rowH).toFixed(1)+'%';
  return { left, top };
}
function placeCardAtScatterPos(card, pos, n){
  const { left, top } = scatterPosition(pos, n);
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
  const twoDigit = level>=6; // levels 1-5: single-digit numbers, levels 6-10: two-digit numbers
  let a, b;
  const op = Math.random()<0.5 ? '+' : '-';
  if(twoDigit){ a = Math.floor(Math.random()*90)+10; b = Math.floor(Math.random()*90)+10; }
  else { a = Math.floor(Math.random()*9)+1; b = Math.floor(Math.random()*9)+1; }
  if(op==='-' && b>a){ const t=a; a=b; b=t; } // avoid negative answers
  const answer = op==='+' ? a+b : a-b;
  renderMathPuzzle(a, b, op, answer);
  showARHint(isMobileViewport()
    ? '👆 แตะการ์ดคำตอบที่ถูกต้อง แล้วลากไปใส่ในช่องนะ!'
    : '✋ จีบนิ้วหยิบการ์ดคำตอบที่ถูกต้อง แล้วลากไปใส่ในช่องนะ!');
}

function renderMathPuzzle(a, b, op, answer){
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

  /* build 3 unique non-negative choices: the correct answer + 2 nearby distractors */
  const choices = new Set([answer]);
  let guard = 0;
  while(choices.size<3 && guard<50){
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
  const items = shuffleArray(AR_MATCH_ITEMS.slice()).slice(0, n);
  renderMatchPairs(items);
  showARHint(isMobileViewport()
    ? '👆 แตะจุดวงกลมแล้วลากเส้นไปยังคำตอบที่ตรงกันนะ!'
    : '✋ แตะจุดวงกลมแล้วลากเส้นไปยังคำตอบที่ตรงกัน (จีบนิ้วถ้าอยากยกเลิก)');
}

function renderMatchPairs(items){
  const svg = $('ar-match-svg');
  svg.innerHTML = '';
  const leftCol = $('ar-match-left');
  const rightCol = $('ar-match-right');
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';

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

function showARHint(text){ $('ar-hint').textContent = text; }

/* ---- drag & drop (shared by hand-pinch and mouse/touch pointer events) ---- */
function wireCardDrag(card){
  card.addEventListener('pointerdown', e=>{
    if(card.classList.contains('placed') || arDraggingCard) return;
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

function startDragCard(card, source){
  arDraggingCard = card;
  arDragSource = source;
  card.classList.add('dragging');
  playClick();
}
function moveDraggingCardTo(x,y){
  if(!arDraggingCard) return;
  arDraggingCard.style.left = x+'px';
  arDraggingCard.style.top = y+'px';
}
function attemptDrop(card, x, y){
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
  else { returnCardToPool(card); }
  arDraggingCard = null; arDragSource = null;
}
function placeCardInSlot(card, slot){
  slot.innerHTML = '';
  card.classList.add('placed');
  slot.appendChild(card);
  slot.classList.add('filled');
  playClick();
  checkSlotsComplete();
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
  showARHint('🤔 ยังไม่ตรงกันนะ ลองโยงเส้นใหม่ดูสิ!');
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
  const slots = Array.from($('ar-slot-row').children);
  slots.forEach(s=>s.classList.add('wrong-flash'));
  const cat = catById(arGame.catId);
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

function levelSuccess(){
  playCorrect();
  mascotHappy();
  burstCenterTop(30);
  showOwlMsg('correct');
  const cat = catById(arGame.catId);
  showARHint(cat.mode==='math'
    ? '🎉 เก่งมาก! คำนวณถูกต้อง!'
    : cat.mode==='match'
      ? '🎉 เก่งมาก! โยงเส้นถูกต้องหมดเลย!'
      : (cat.lang==='th' ? '🎉 เก่งมาก! ต่อประโยคถูกต้อง!' : '🎉 Great job! Sentence is correct!'));
  $('ar-progress-fill').style.width = (arGame.level/arGame.totalLevels*100)+'%';
  setTimeout(()=>{
    if(arGame.level >= arGame.totalLevels){ finishARGame(); }
    else { arGame.level++; renderARLevel(); }
  }, 1300);
}

/* ---- hand tracking (MediaPipe Hands) ---- */
function drawHandSkeleton(ctx, lm, w, h){
  const pts = lm.map(p=>({x:(1-p.x)*w, y:p.y*h}));
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  HAND_CONNECTIONS.forEach(([a,b])=>{
    ctx.beginPath(); ctx.moveTo(pts[a].x,pts[a].y); ctx.lineTo(pts[b].x,pts[b].y); ctx.stroke();
  });
  pts.forEach((p,i)=>{
    ctx.beginPath();
    ctx.fillStyle = (i===4) ? '#FF6161' : (i===8) ? '#33B7EE' : '#FFC53D';
    ctx.arc(p.x, p.y, (i===4||i===8) ? 7 : 5, 0, Math.PI*2);
    ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
  });
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

  const hoverCard = hoveredEl && hoveredEl.closest && hoveredEl.closest('.ar-card:not(.placed)');
  const hoverSlot = hoveredEl && hoveredEl.closest && hoveredEl.closest('.ar-slot:not(.filled)');

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
    drawHandSkeleton(ctx, arLandmarks, canvas.width, canvas.height);
    const idx = arLandmarks[8], thumb = arLandmarks[4];
    const ix = (1-idx.x)*canvas.width,   iy = idx.y*canvas.height;
    const tx = (1-thumb.x)*canvas.width, ty = thumb.y*canvas.height;
    const dx = ix-tx, dy = iy-ty;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const pinching = dist < Math.max(28, canvas.width*0.07);

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width/canvas.width, scaleY = rect.height/canvas.height;
    const pageX = rect.left + ix*scaleX, pageY = rect.top + iy*scaleY;
    updateArCursor(pageX, pageY, pinching);
  } else {
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
  stopARGame();
  lastGameType = 'ar'; lastCatId = catId;
  arGame = { catId, level:1, mistakes:0, totalLevels: catById(catId).levels };
  document.body.classList.add('ar-open');
  if(isMobileViewport()) document.body.classList.add('ar-mobile-nocam');
  homeView.hidden = true; resultView.hidden = true; quizView.hidden = true; arView.hidden = false;
  const cat = catById(catId);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  arView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  $('ar-cat-label').textContent = cat.emoji+' '+cat.name;
  $('ar-cat-label').style.color = cat.color;
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
    $('sticker-earned').textContent = cat.emoji;
    pendingSticker = cat.id;
    setTimeout(()=>burstCenterTop(40), 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>burstCenterTop(50), 250);
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

/* ============================= SOUND TOGGLE ============================= */
const soundBtn = $('sound-toggle');
function refreshSoundBtn(){ soundBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">🔊</span><span class="mute-stripe"></span></span>'; soundBtn.classList.toggle('muted', !soundOn); soundBtn.dataset.tooltip = soundOn ? 'ปิดเสียง' : 'เปิดเสียง'; }
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
    btn.textContent = document.fullscreenElement ? '⤡' : '⛶';
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
        '<div class="slot-shine"></div>'+
        '<span class="slot-emoji">'+cat.emoji+'</span>'+
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

/* ============================= BUY ME A MILK ============================= */
$('install-toggle').addEventListener('click', ()=>{ playClick(); openOverlay('install-modal'); });
$('install-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('install-modal'); });
$('install-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('install-modal'); });
$('bmm-btn').addEventListener('click', ()=>{ playClick(); openOverlay('qr-modal'); });
$('qr-close-btn').addEventListener('click', ()=>{ playClick(); closeOverlay('qr-modal'); });
$('qr-modal-backdrop').addEventListener('click', ()=>{ closeOverlay('qr-modal'); });

/* ============================= DAY / NIGHT THEME ============================= */
const bgDecorEl = $('bg-decor');
function isNightMode(){ return document.body.classList.contains('night-mode'); }
function refreshThemeBtn(){
  const night = isNightMode();
  themeBtn.textContent = night ? '☀️' : '🌙';
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

/* ============================= INIT ============================= */
loadChildren();
renderChildSelect();
