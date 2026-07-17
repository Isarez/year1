/* ==========================================================================
   โหมดคุณครู — เกมฟังคำศัพท์ สะกดคำ (mechanic 'listen')
   port มาจาก engine listen ของหน้าหลัก (js/app.js) แบบคง id/class เดิมทั้งหมด
   (listen-view/listen-slot/listen-card ฯลฯ ใช้สไตล์จาก css/style.css ตรงๆ)
   โหลดหลัง teacher.js (ใช้ games/lastPlay/showView/playClick/playCorrect/playWrong/
   playCongrats/showToast/shuffleArray/escapeHtml/CARD_COLORS ร่วมกัน)

   ต่างจากหน้าเด็กที่ตั้งใจ: คำของครูเป็นคำอิสระ มีตัวอักษรซ้ำในคำได้ (เช่น book)
   จึงเก็บการ์ดที่วางในช่องเป็น element ตรงๆ (filled[pos] = cardEl) แทนการ map
   ด้วยตัวอักษรแบบหน้าเด็กซึ่งการันตีตัวอักษรไม่ซ้ำจากคลังคำที่คัดมาแล้ว
   — อย่า "sync กลับ" ให้เหมือน app.js
   ========================================================================== */

let listenGame = null; // {gameId, pool, level, totalLevels, mistakes, hint, noThaiVoice, word, letters, hintPositions, filled, checking}

/* ตัวอักษรลวงภาษาไทย (ชุดเดียวกับ THAI_DECOY_CHARS ใน js/data.js — teacher ไม่ได้โหลด data.js) */
const LISTEN_TH_DECOYS = [
  'ก','ข','ค','ง','จ','ฉ','ช','ซ','ญ','ด','ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว','ศ','ส','ห','อ','ฮ',
  'า','ะ','ิ','ี','ึ','ื','ุ','ู','เ','แ','โ','ใ','ไ','ำ','ั','่','้','๊','๋','็','์'
];
const LISTEN_EN_DECOYS = 'abcdefghijklmnopqrstuvwxyz'.split('');

function isThaiWord(w){ return /[฀-๿]/.test(w); }

/* หา voice ภาษาไทยที่ติดตั้งไว้ (บาง browser เลือก voice ผิดถ้าไม่ set ให้ชัดเจน) — port จาก app.js */
function pickThaiVoice(){
  if(!window.speechSynthesis) return null;
  return speechSynthesis.getVoices().find(v=>v.lang && v.lang.toLowerCase().startsWith('th')) || null;
}
/* เช็คว่ามีเสียงไทยไหม — ใช้แค่ตัดสินใจโชว์รูปใบ้เสริม ไม่บล็อกการพูดจริง (ตรวจ false negative ได้ง่าย) */
function hasThaiVoiceSupport(){
  return new Promise(resolve=>{
    if(!window.speechSynthesis){ resolve(false); return; }
    const check = ()=> speechSynthesis.getVoices().some(v=>v.lang && v.lang.toLowerCase().startsWith('th'));
    if(speechSynthesis.getVoices().length){ resolve(check()); return; }
    speechSynthesis.addEventListener('voiceschanged', ()=>resolve(check()), {once:true});
    setTimeout(()=>resolve(check()), 1000);
  });
}
/* อ่านออกเสียงคำ — เดาภาษาจากตัวอักษรในคำ (ปุ่ม 🔊 ลองฟังในฟอร์ม builder ก็เรียกตัวนี้) */
function speakTeacherWord(word){
  if(!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  if(isThaiWord(word)){
    const voice = pickThaiVoice();
    if(voice) u.voice = voice; // set voice ตรงๆ แทนพึ่ง lang อย่างเดียว บาง browser เลือก voice ผิด/ไม่พูดถ้าไม่ set
    u.lang = 'th-TH';
  } else {
    u.lang = 'en-US';
  }
  u.rate = 0.85;
  // Chrome มีบั๊กที่ speak() ทันทีหลัง cancel() บางทีเงียบเฉยๆ ต้องรอ event รอบถัดไปก่อนค่อยพูด
  setTimeout(()=> speechSynthesis.speak(u), 30);
}

/* ---- game flow ---- */
async function startTeacherListen(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  lastPlay = { type:'listen', gameId };
  let pool = game.questions.slice();
  if(game.shuffle) shuffleArray(pool);
  pool = pool.slice(0, Math.min(game.questionCount, pool.length));
  listenGame = {
    gameId, pool,
    level:1, totalLevels:pool.length, mistakes:0,
    hint: game.listenHint!==false,
    noThaiVoice:false, checking:false
  };
  const idx = games.indexOf(game);
  const [color] = CARD_COLORS[idx % CARD_COLORS.length];
  document.documentElement.style.setProperty('--cat-color', color);
  listenView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', color));
  $('listen-cat-label').innerHTML = '<img src="'+game.logo+'" alt="" style="width:24px;height:24px;vertical-align:-6px;margin-right:6px;">'+escapeHtml(game.title);
  showView(listenView);
  if(pool.some(q=>isThaiWord(q.w))){
    listenGame.noThaiVoice = !(await hasThaiVoiceSupport());
    if(listenGame && listenGame.noThaiVoice) showToast('🔇','เบราว์เซอร์นี้ไม่รองรับเสียงพูดภาษาไทย ระบบจะโชว์รูปคำใบ้แทนนะ');
  }
  if(!listenGame) return; /* เผื่อกดออกระหว่างรอเช็ค voice */
  renderTeacherListenLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderTeacherListenLevel(){
  const qd = listenGame.pool[listenGame.level-1];
  const word = qd.w;
  const letters = word.split('');
  const thai = isThaiWord(word);

  /* ตำแหน่งเฉลย (ถ้าครูเปิดตัวช่วย) — สุ่มตำแหน่ง ไม่ตายตัวว่าต้องเป็นตัวแรก/ท้าย แบบหน้าเด็ก */
  let hintCount = 0;
  if(listenGame.hint) hintCount = letters.length<=4 ? 1 : (letters.length<=6 ? 2 : 3);
  const positions = shuffleArray(letters.map((_,i)=>i));
  const hintPositions = positions.slice(0, hintCount);
  const neededLetters = positions.slice(hintCount).map(p=>letters[p]);

  /* ตัวอักษรลวง: เพิ่มตามความยาวคำ แต่รวมการ์ดทั้งหมดไม่เกิน 9 ใบ (กันล้นจอเด็ก) */
  let decoyCount = letters.length<=3 ? 2 : (letters.length<=4 ? 3 : 4);
  decoyCount = Math.max(1, Math.min(decoyCount, 9 - neededLetters.length));
  const decoyPool = shuffleArray((thai ? LISTEN_TH_DECOYS : LISTEN_EN_DECOYS).filter(ch=>!letters.includes(ch)));
  const decoys = decoyPool.slice(0, decoyCount);

  listenGame.word = word;
  listenGame.letters = letters;
  listenGame.hintPositions = hintPositions;
  listenGame.filled = {};   // ตำแหน่งช่อง -> การ์ด element ที่เด็กวาง (รองรับตัวอักษรซ้ำในคำ)
  listenGame.checking = false;

  const slotsEl = $('listen-slots');
  slotsEl.innerHTML = '';
  letters.forEach((letter, pos)=>{
    const slot = document.createElement('div');
    const isHint = hintPositions.includes(pos);
    slot.className = 'listen-slot'+(isHint ? ' hint' : ' empty');
    slot.dataset.pos = pos;
    if(isHint){ slot.textContent = letter; }
    else { slot.addEventListener('click', ()=> undoTeacherListenSlot(pos)); }
    slotsEl.appendChild(slot);
  });

  const cardsEl = $('listen-cards');
  cardsEl.innerHTML = '';
  shuffleArray([...neededLetters, ...decoys]).forEach(letter=>{
    const card = document.createElement('button');
    card.className = 'listen-card';
    card.type = 'button';
    card.textContent = letter;
    card.addEventListener('click', ()=> placeTeacherListenLetter(card));
    cardsEl.appendChild(card);
  });

  $('listen-level-counter').textContent = listenGame.level+'/'+listenGame.totalLevels;
  $('listen-progress-fill').style.width = ((listenGame.level-1)/listenGame.totalLevels*100)+'%';
  $('listen-hint').textContent = '🎧 กดปุ่มฟังคำศัพท์ แล้วเลือกตัวอักษรมาต่อคำให้ถูกนะ!';

  /* รูปใบ้จากครู: โชว์เฉพาะตอนเครื่องอ่านออกเสียงคำนี้ไม่ได้ (ไม่มี TTS เลย หรือคำไทยแต่ไม่มีเสียงไทย) */
  const symbolEl = $('listen-symbol');
  if(qd.e && (!window.speechSynthesis || (thai && listenGame.noThaiVoice))){
    symbolEl.textContent = qd.e;
    symbolEl.hidden = false;
  } else {
    symbolEl.hidden = true;
  }
}

function placeTeacherListenLetter(cardEl){
  if(!listenGame || listenGame.checking || cardEl.classList.contains('used')) return;
  const slotsEl = $('listen-slots');
  const emptySlot = Array.from(slotsEl.children).find(s=>s.classList.contains('empty') && !s.classList.contains('filled'));
  if(!emptySlot) return;
  playClick();
  const pos = Number(emptySlot.dataset.pos);
  listenGame.filled[pos] = cardEl;
  emptySlot.textContent = cardEl.textContent;
  emptySlot.classList.add('filled');
  cardEl.classList.add('used');

  /* วางครบทุกช่องที่ต้องหาเอง -> ตรวจคำตอบ */
  if(Object.keys(listenGame.filled).length + listenGame.hintPositions.length >= listenGame.letters.length){
    checkTeacherListenAnswer();
  }
}

function undoTeacherListenSlot(pos){
  if(!listenGame || listenGame.checking) return;
  if(listenGame.hintPositions.includes(pos)) return;
  const cardEl = listenGame.filled[pos];
  if(!cardEl) return;
  playClick();
  delete listenGame.filled[pos];
  const slot = Array.from($('listen-slots').children).find(s=>Number(s.dataset.pos)===pos);
  slot.textContent = '';
  slot.classList.remove('filled');
  cardEl.classList.remove('used');
}

function checkTeacherListenAnswer(){
  const attempt = listenGame.letters.map((_, pos)=>
    listenGame.hintPositions.includes(pos) ? listenGame.letters[pos] : (listenGame.filled[pos] ? listenGame.filled[pos].textContent : '')
  );
  if(attempt.join('') === listenGame.word) teacherListenSuccess();
  else teacherListenMistake();
}

function teacherListenMistake(){
  listenGame.mistakes++;
  listenGame.checking = true;
  playWrong();
  const slotsEl = $('listen-slots');
  Array.from(slotsEl.children).forEach(s=>s.classList.add('wrong'));
  $('listen-hint').textContent = '🤔 ยังไม่ถูกนะ ลองเลือกตัวอักษรใหม่ดูสิ!';
  setTimeout(()=>{
    if(!listenGame) return;
    Array.from(slotsEl.children).forEach(s=>{
      s.classList.remove('wrong');
      const pos = Number(s.dataset.pos);
      if(listenGame.hintPositions.includes(pos)) return;
      s.textContent = '';
      s.classList.remove('filled');
    });
    Object.values(listenGame.filled).forEach(cardEl=> cardEl.classList.remove('used'));
    listenGame.filled = {};
    listenGame.checking = false;
  }, 1000);
}

function teacherListenSuccess(){
  listenGame.checking = true;
  playCorrect();
  $('listen-hint').textContent = '🎉 เก่งมาก! สะกดถูกต้อง!';
  $('listen-progress-fill').style.width = (listenGame.level/listenGame.totalLevels*100)+'%';
  setTimeout(()=>{
    if(!listenGame) return;
    if(listenGame.level >= listenGame.totalLevels){ finishTeacherListen(); }
    else { listenGame.level++; renderTeacherListenLevel(); }
  }, 1300);
}

function finishTeacherListen(){
  const mistakes = listenGame.mistakes;
  const totalLevels = listenGame.totalLevels;
  listenGame = null;
  if(window.speechSynthesis) speechSynthesis.cancel();
  showView(resultView);
  /* เกณฑ์ดาวจาก mistakes เดียวกับเกม AR/ฝึกทักษะหน้าหลัก */
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? 'สุดยอดไปเลย!' : stars===2 ? 'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent='⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });
  $('score-line').textContent = 'ฟังคำศัพท์สะกดคำครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? 'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';
  $('review-wrap').hidden = true;
  if(stars>=2) setTimeout(()=>playCongrats(), 250);
}

$('listen-speak-btn').addEventListener('click', ()=>{
  playClick();
  if(listenGame && listenGame.word) speakTeacherWord(listenGame.word);
});
$('listen-back').addEventListener('click', ()=>{
  playClick();
  listenGame = null;
  if(window.speechSynthesis) speechSynthesis.cancel();
  renderTeacherHome();
});
