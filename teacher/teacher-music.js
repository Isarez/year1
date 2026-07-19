/* ==========================================================================
   โหมดคุณครู — เกมดนตรี (mechanic 'music')
   port เปียโน/เสียง/การเล่นจาก skill-music ของหน้าหลัก (js/app.js) แบบคง id/class เดิม
   (music-view/music-piano/music-key/music-note-bubble ฯลฯ ใช้สไตล์จาก css/style.css ตรงๆ)
   โหลดหลัง teacher.js (ใช้ games/lastPlay/showView/musicView/playClick/playWrong/
   showToast/escapeHtml/CARD_COLORS/showTeacherSkillResult และ ensureAudio/audioCtx ร่วมกัน)

   teacher ไม่โหลด data.js จึงต้อง copy MUSIC_WHITE_KEYS/MUSIC_BLACK_KEYS มาไว้ที่นี่
   ต่างจากหน้าเด็ก (3 โหมด สุ่มโจทย์/Simon) ตรงที่ครูแต่งทำนองเอง — 1 ทำนอง = 1 ด่าน
   เล่นแบบโหมด 1 หน้าเด็ก: โชว์โน้ต + ฟังทำนอง แล้วเด็กกดคีย์ตามลำดับ (เทียบชื่อโน้ตไม่สน octave)
   ========================================================================== */

/* คีย์ขาว 15 คีย์ = 2 ช่วงเสียง (โด-โด) — โน้ตไทย/อังกฤษ + สีประจำ + freq จริง (copy จาก data.js) */
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
/* คีย์ดำ 10 คีย์ (กดมีเสียงจริง แต่โจทย์/ทำนองครูใช้เฉพาะคีย์ขาว) */
const MUSIC_BLACK_KEYS = [
  {after:0, freq:277.18}, {after:1, freq:311.13},
  {after:3, freq:369.99}, {after:4, freq:415.30}, {after:5, freq:466.16},
  {after:7, freq:554.37}, {after:8, freq:622.25},
  {after:10, freq:739.99}, {after:11, freq:830.61}, {after:12, freq:932.33}
];

let musicNotation = (localStorage.getItem('p1quiz_music_notation')==='en') ? 'en' : 'th';
function musicKeyLabel(k){ return musicNotation==='en' ? k.en : k.th; }
/* เทียบชื่อโน้ตแบบไม่สน octave (ด ที่ index 0/7/14 ถือว่าเหมือนกัน) */
function sameNote(a, b){ return MUSIC_WHITE_KEYS[a].th === MUSIC_WHITE_KEYS[b].th; }

let teacherMusicGame = null; // {gameId, melodies, level, totalLevels, mistakes, target:[whiteIdx], pos, locked}

function pianoWhiteEl(i){ return $('music-piano').querySelector('.music-white[data-white="'+i+'"]'); }
function flashKey(key){ if(!key) return; key.classList.add('pressed'); setTimeout(()=>key.classList.remove('pressed'), 200); }

/* เสียงโน้ตเปียโนแบบนุ่มใส — port ตรงจาก playPianoNote (js/app.js) */
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

/* เล่นทำนองตามจังหวะ (กดฟังซ้ำ = เริ่มใหม่ ไม่เล่นทับ) — port จาก playMusicSequence/stopMusicSequence */
let musicSeqTimers = [];
function stopMusicSequence(){ musicSeqTimers.forEach(clearTimeout); musicSeqTimers = []; }
function playMusicSequence(seq, noFlash){
  stopMusicSequence();
  if(!seq || !seq.length) return;
  const BEAT_MS = 500;
  let at = 0;
  seq.forEach((wi,i)=>{
    musicSeqTimers.push(setTimeout(()=>{
      playPianoNote(MUSIC_WHITE_KEYS[wi].freq, Math.min(1.6, BEAT_MS/1000*0.95));
      if(!noFlash) flashKey(pianoWhiteEl(wi));
    }, at));
    at += BEAT_MS;
  });
}

/* วาดคีย์เปียโน — port ตรงจาก renderPianoKeys (js/app.js) */
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

function renderTeacherMusicNotes(){
  const g = teacherMusicGame, wrap = $('music-notes');
  wrap.innerHTML = '';
  g.target.forEach((wi,i)=>{
    const k = MUSIC_WHITE_KEYS[wi];
    const b = document.createElement('div');
    b.className = 'music-note-bubble';
    b.style.setProperty('--key-color', k.color);
    if(i < g.pos){
      b.classList.add('done');
      b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span><span class="mnb-check">✓</span>';
    } else {
      b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span>';
    }
    if(i===g.pos) b.classList.add('current');
    wrap.appendChild(b);
  });
}

function renderTeacherMusicLevel(){
  const g = teacherMusicGame;
  g.target = g.melodies[g.level-1].notes.slice();
  g.pos = 0; g.locked = false;
  $('music-msg').hidden = true;
  $('music-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('music-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('music-hint').textContent = '🎹 ฟังทำนองแล้วกดคีย์ตามให้ถูกตามลำดับนะ';
  $('music-prompt-label').textContent = 'กดคีย์ตามนี้เลย 👇';
  renderPianoKeys($('music-piano'), false);
  renderTeacherMusicNotes();
  setTimeout(()=>playMusicSequence(g.target, false), 400);
}

function musicPressWhite(wi){
  const g = teacherMusicGame;
  if(!g || g.locked) return;
  if(sameNote(wi, g.target[g.pos])){
    g.pos++;
    renderTeacherMusicNotes();
    if(g.pos >= g.target.length) teacherMusicLevelComplete();
  } else {
    g.mistakes++;
    playWrong();
    const key = pianoWhiteEl(wi);
    if(key){ key.classList.add('key-wrong'); setTimeout(()=>key.classList.remove('key-wrong'), 420); }
    const cur = $('music-notes').children[g.pos];
    if(cur){ cur.classList.add('shake'); setTimeout(()=>cur.classList.remove('shake'), 420); }
  }
}

function teacherMusicLevelComplete(){
  const g = teacherMusicGame;
  g.locked = true;
  playCorrect();
  const msg = $('music-msg');
  msg.textContent = '🎉 เล่นถูกทั้งทำนองเลย เก่งมาก!';
  msg.hidden = false;
  $('music-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    msg.hidden = true;
    if(g.level >= g.totalLevels){ finishTeacherMusic(); }
    else { g.level++; renderTeacherMusicLevel(); }
  }, 1200);
}

function startTeacherMusic(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  lastPlay = { type:'music', gameId };
  let pool = game.questions.slice();
  if(game.shuffle) shuffleArray(pool);
  const melodies = pool.slice(0, Math.min(game.questionCount, pool.length));
  teacherMusicGame = { gameId, melodies, level:1, totalLevels:melodies.length, mistakes:0, target:[], pos:0, locked:false };

  const idx = games.indexOf(game);
  const [color] = CARD_COLORS[idx % CARD_COLORS.length];
  document.documentElement.style.setProperty('--cat-color', color);
  musicView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', color));
  $('music-cat-label').innerHTML = '<img src="'+game.logo+'" alt="" style="width:24px;height:24px;vertical-align:-6px;margin-right:6px;">'+escapeHtml(game.title);
  const nt = $('music-notation-toggle');
  nt.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  nt.setAttribute('aria-pressed', musicNotation==='en');
  showView(musicView);
  renderTeacherMusicLevel();
}

function finishTeacherMusic(){
  const g = teacherMusicGame;
  stopMusicSequence();
  const mistakes = g.mistakes, totalLevels = g.totalLevels;
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  showTeacherSkillResult(stars, 'เล่นดนตรีครบ '+totalLevels+' ทำนอง! (พลาด '+mistakes+' ครั้ง)');
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
$('music-listen-btn').addEventListener('click', ()=>{ if(teacherMusicGame) playMusicSequence(teacherMusicGame.target, false); });
$('music-notation-toggle').addEventListener('click', function(){
  musicNotation = musicNotation==='en' ? 'th' : 'en';
  try{ localStorage.setItem('p1quiz_music_notation', musicNotation); }catch(e){}
  this.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  this.setAttribute('aria-pressed', musicNotation==='en');
  if(teacherMusicGame){ renderPianoKeys($('music-piano'), false); renderTeacherMusicNotes(); }
});
$('music-back').addEventListener('click', ()=>{
  playClick();
  stopMusicSequence();
  teacherMusicGame = null;
  renderTeacherHome();
});
