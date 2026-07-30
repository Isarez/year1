/* ================================================================================
   เกมสายฟัง: ฟังประโยคเติมคำ (cloze) และ ฟังคำศัพท์สะกดคำ (listen)
   ทั้งคู่ใช้เสียงอ่านของเครื่อง (speechSynthesis) และมีทางสำรองเป็นรูปใบ้
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= เกม "ฟังประโยค เติมคำในช่องว่าง" (cloze) =============================
   เครื่องอ่านออกเสียง "ทั้งประโยครวมคำที่หายไป" แต่บนจอเว้นช่องว่าง 1-2 ช่อง ให้เด็กเลือกการ์ดคำมาเติม
   - คลังประโยคอยู่ที่ CLOZE_SETS ใน data.js เลือกชุดด้วย cat.clozeSet (ไล่ระดับตามชั้น: thA→thE, enA→enC)
   - จำนวนช่องว่างต่อด่านมาจาก cat.clozeBlanks = [ด่าน 1-4, 5-8, 9-10] (เช่น [1,1,2])
   - ตัวหลอกมาจากคำที่เว้นได้ของประโยคอื่นในชุดเดียวกัน (ชนิดคำใกล้เคียง จึงหลอกได้จริง) จำนวนตาม cat.clozeDecoys
   - เติมครบทุกช่องแล้วตรวจอัตโนมัติ ถูก = ไปด่านต่อไป, ผิด = ช่องที่ผิดสั่นแดงแล้วคืนการ์ด (นับ 1 พลาด)
   ดาว/ผลลัพธ์ใช้ finishP2Game ร่วมกับเกมทักษะอื่น (เกณฑ์ mistakes 0→3, ≤4→2, else→1) */
let clozeGame = null;

function clozeBlankCount(cat, level){
  const b = cat.clozeBlanks || [1,1,2];
  return level<=4 ? b[0] : (level<=8 ? b[1] : b[2]);
}
function clozeDecoyCount(cat, level){
  const d = cat.clozeDecoys || [2,3,3];
  return level<=4 ? d[0] : (level<=8 ? d[1] : d[2]);
}
/* ประโยคเต็มสำหรับอ่านออกเสียง — ภาษาไทยต่อคำติดกัน (ไม่มีเว้นวรรค) เสียงจึงเป็นธรรมชาติกว่า */
function clozeFullText(tokens, lang){ return lang==='th' ? tokens.join('') : tokens.join(' '); }

function speakClozeSentence(){
  if(!clozeGame) return;
  if(!window.speechSynthesis){ showToast('🔇','เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง'); return; }
  const cat = catById(clozeGame.catId);
  const u = new SpeechSynthesisUtterance(clozeFullText(clozeGame.tokens, cat.lang));
  if(cat.lang==='th'){ const v = pickThaiVoice(); if(v) u.voice = v; u.lang = 'th-TH'; }
  else { const v = pickEnglishVoice(); if(v) u.voice = v; u.lang = 'en-US'; }
  u.rate = 0.85;
  /* เรียก cancel()+speak() ตรงๆ ใน user gesture เสมอ (กติกาเดียวกับ speakListenWord — iPad จะเงียบถ้าหน่วง) */
  try{ speechSynthesis.cancel(); }catch(e){}
  primeSpeechOnce();
  speechSynthesis.speak(u);
}

async function startClozeGame(catId){
  stopARGame();
  lastGameType = 'cloze'; lastCatId = catId;
  const cat = catById(catId);
  clozeGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, locked:false, usedIdx:new Set() };
  showOnlyView(clozeView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  clozeView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('cloze-cat-label', cat);
  renderClozeLevel();
  await ensureVoicesLoaded();   // รอ voices โหลดก่อน กันเสียงเพี้ยน/ไม่ออกตอนฟังครั้งแรก (กติกาเดียวกับเกมฟังคำ)
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

function renderClozeLevel(){
  const g = clozeGame, cat = catById(g.catId);
  const set = CLOZE_SETS[cat.clozeSet] || CLOZE_SETS.thA;
  const idx = pickNoRepeatIdx(g.usedIdx, set.items.length);
  const item = set.items[idx];
  const nBlank = Math.min(clozeBlankCount(cat, g.level), item.b.length);

  g.tokens = item.t.slice();
  g.blanks = shuffleArray(item.b.slice()).slice(0, nBlank).sort((a,b)=>a-b);
  g.answers = g.blanks.map(i=>g.tokens[i]);
  g.filled = {};      /* ตำแหน่งช่อง -> คำที่เลือก */
  g.filledCard = {};  /* ตำแหน่งช่อง -> การ์ดที่ใช้เติม (เก็บ element ตรงๆ กันคำซ้ำ) */
  g.locked = false;

  /* ตัวหลอก: คำที่เว้นได้ของประโยคอื่นในชุดเดียวกัน (ไม่ซ้ำกับคำเฉลย) */
  const bank = [];
  set.items.forEach((it,i)=>{ if(i!==idx) it.b.forEach(bi=>bank.push(it.t[bi])); });
  const decoyPool = [...new Set(bank)].filter(w=>!g.answers.includes(w));
  const decoys = shuffleArray(decoyPool).slice(0, clozeDecoyCount(cat, g.level));

  $('cloze-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('cloze-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('cloze-emoji').textContent = item.e || '🎧';
  $('cloze-hint').textContent = nBlank>1 ? '🎧 ฟังประโยคแล้วเติมให้ครบทั้ง '+nBlank+' ช่องนะ!' : '🎧 กดฟังประโยค แล้วเลือกคำมาเติมในช่องว่าง';

  /* ประโยคบนจอ: คำปกติ + ช่องว่าง */
  const sent = $('cloze-sentence'); sent.innerHTML='';
  g.tokens.forEach((tok, i)=>{
    if(g.blanks.includes(i)){
      const b=document.createElement('button');
      b.className='cloze-blank'; b.dataset.pos=i; b.textContent='___';
      b.addEventListener('click', ()=>clozeUndo(i));
      sent.appendChild(b);
    } else {
      const w=document.createElement('span'); w.className='cloze-word'; w.textContent=tok; sent.appendChild(w);
    }
  });

  const box = $('cloze-cards'); box.innerHTML='';
  g.cardEls = {};
  shuffleArray([...g.answers, ...decoys]).forEach(word=>{
    const c=document.createElement('button'); c.className='cloze-card'; c.textContent=word;
    c.addEventListener('click', ()=>clozePick(word, c));
    box.appendChild(c);
    g.cardEls[word] = c;
  });

  /* อ่านประโยคให้ฟังอัตโนมัติ 1 ครั้งเมื่อขึ้นด่านใหม่ (กดปุ่มฟังซ้ำได้เสมอ) */
  setTimeout(()=>{ if(clozeGame && !clozeGame.locked) speakClozeSentence(); }, 350);
}

function clozeFirstEmpty(){
  return clozeGame.blanks.find(p=>clozeGame.filled[p]===undefined);
}
function clozePick(word, cardEl){
  const g = clozeGame; if(!g || g.locked) return;
  if(cardEl.classList.contains('used')) return;   /* การ์ดที่ถูกใช้แล้วกดซ้ำไม่ได้ (กันกดรัว/กดผ่านสคริปต์) */
  const pos = clozeFirstEmpty();
  if(pos===undefined) return;
  playClick();
  g.filled[pos] = word;
  g.filledCard[pos] = cardEl;   /* จำ element ตรงๆ ไม่ map ด้วยคำ — คำในการ์ดซ้ำกันได้โดยไม่พัง */
  cardEl.classList.add('used');
  const slot = $('cloze-sentence').querySelector('.cloze-blank[data-pos="'+pos+'"]');
  if(slot){ slot.textContent = word; slot.classList.add('filled'); }
  if(g.blanks.every(p=>g.filled[p]!==undefined)) setTimeout(checkCloze, 250);
}
function clozeUndo(pos){
  const g = clozeGame; if(!g || g.locked) return;
  const word = g.filled[pos];
  if(word===undefined) return;
  playClick();
  delete g.filled[pos];
  const el = g.filledCard[pos] || g.cardEls[word];
  if(el) el.classList.remove('used');
  delete g.filledCard[pos];
  const slot = $('cloze-sentence').querySelector('.cloze-blank[data-pos="'+pos+'"]');
  if(slot){ slot.textContent='___'; slot.classList.remove('filled'); }
}
function checkCloze(){
  const g = clozeGame; if(!g || g.locked) return;
  const wrong = g.blanks.filter((p,i)=>g.filled[p]!==g.answers[i]);
  if(wrong.length===0){
    g.locked = true;
    g.blanks.forEach(p=>{ const s=$('cloze-sentence').querySelector('.cloze-blank[data-pos="'+p+'"]'); if(s) s.classList.add('correct'); });
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('cloze-hint').textContent = 'เติมถูกทุกช่องเลย! 🎉';
    $('cloze-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'เติมประโยค'); else { g.level++; renderClozeLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('cloze-hint').textContent = 'ยังไม่ถูกนะ ลองกดฟังประโยคอีกครั้งแล้วเปลี่ยนคำดู';
    wrong.forEach(p=>{
      const s=$('cloze-sentence').querySelector('.cloze-blank[data-pos="'+p+'"]');
      if(s) s.classList.add('wrong');
    });
    setTimeout(()=>{
      wrong.forEach(p=>{
        const s=$('cloze-sentence').querySelector('.cloze-blank[data-pos="'+p+'"]');
        if(s) s.classList.remove('wrong');
        clozeUndo(p);      /* คืนเฉพาะช่องที่ผิด ช่องที่ถูกค้างไว้ให้ */
      });
    }, 700);
  }
}
$('cloze-speak-btn').addEventListener('click', ()=>{ playClick(); speakClozeSentence(); });
$('cloze-back').addEventListener('click', ()=>{ playClick(); try{ speechSynthesis.cancel(); }catch(e){} p2GoHome(); });


/* ============================= LISTEN WORD-SPELLING GAME (เกมฟังคำศัพท์ 1/2) ============================= */
/* mode:'hint' (ฟังคำศัพท์ 1) เฉลยบางตัวอักษรให้ในช่องคำตอบ (ด่าน 1-5 เฉลย 2 ตัว, ด่าน 6-10 เฉลย 1 ตัว)
   mode:'nohint' (ฟังคำศัพท์ 2) ไม่เฉลยเลย เด็กหาและเรียงตัวอักษรเองทั้งหมดทุกด่าน */
let listenGame = null; // {catId, level, mistakes, totalLevels, word, letters, hintPositions, filled, cardEls, usedWordIdx, noThaiVoice, symbol}

/* หา voice ภาษาไทยที่ติดตั้งไว้ในเบราว์เซอร์ (ถ้ามี) เพื่อ set ให้ utterance ใช้ตรงๆ แทนการพึ่ง lang อย่างเดียว
   (บาง browser เลือก voice ผิดถ้าไม่ได้ set .voice ให้ชัดเจน) */

/* เลือกเสียงพูดภาษาอังกฤษ "มาตรฐาน" — สำคัญ: ต้อง set u.voice ให้คำอังกฤษด้วย ไม่งั้นบางเครื่องเลือกเสียงเพี้ยน
   เช่น macOS มีเสียงตลก/novelty (Albert, Bad News, Bells, Boing, Bubbles...) ที่อาจถูกเลือกเป็นตัวแรก = เสียงอังกฤษเพี้ยน
   หรือบนเครื่อง locale ไทย ระบบอาจอ่านอังกฤษด้วยเสียงไทย — จึงเลือกเสียงคนจริงที่รู้จักก่อน แล้วเลี่ยง novelty */
const EN_NOVELTY_VOICE = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Ralph|Trinoids|Whisper|Zarvox|Wobble|Superstar|Junior|Kathy|Fred|Grandma|Grandpa|Flo|Eddy|Reed|Rocko|Sandy|Shelley|Rishi/i;

/* เช็คว่าเบราว์เซอร์นี้มีเสียงพูดภาษาไทยติดตั้งไว้ไหม (บาง browser โหลด voice list แบบ async ผ่าน event 'voiceschanged')
   ใช้แค่ตัดสินใจว่าจะโชว์รูปคำใบ้เสริมไหม ไม่ได้ใช้ปิดกั้นการพยายามพูดจริง (กันกรณี detect พลาดแล้วเสียงไม่ออกทั้งที่มี voice) */

/* รอให้ list ของ voices โหลดเสร็จ (Chrome/Safari โหลดแบบ async ผ่าน event 'voiceschanged')
   สำคัญ: ต้อง await ก่อนเล่นเกมฟังคำ ไม่งั้น "กดฟังครั้งแรก" ตอน voices ยังว่างจะเลือก voice ไม่ได้ = ตกไปใช้เสียง default (เพี้ยน) */
function ensureVoicesLoaded(){
  return new Promise(resolve=>{
    if(!window.speechSynthesis){ resolve(); return; }
    if(speechSynthesis.getVoices().length){ resolve(); return; }
    let done = false;
    const fin = ()=>{ if(done) return; done = true; resolve(); };
    try{ speechSynthesis.addEventListener('voiceschanged', fin, {once:true}); }catch(e){}
    setTimeout(fin, 1200);
  });
}
/* วอร์มอัพ: เริ่มโหลด voices ตั้งแต่แอปเปิด (ก่อนเด็กจะเข้าเกมฟังคำ) ให้พร้อมตั้งแต่กดฟังครั้งแรก */
(function warmUpVoices(){
  if(!window.speechSynthesis) return;
  try{ speechSynthesis.getVoices(); speechSynthesis.addEventListener('voiceschanged', ()=>{ try{ speechSynthesis.getVoices(); }catch(e){} }); }catch(e){}
})();
/* พูดเสียงเงียบ (volume 0) ครั้งแรกครั้งเดียว เพื่อ "อุ่นเครื่อง" speech engine — กันบั๊กคลาสสิกที่ utterance แรกสุด
   ของทั้งหน้าเว็บมักเมินค่า u.voice แล้วใช้เสียง default (= กดฟังครั้งแรกเพี้ยน) ให้เรียกใน user gesture (หลัง cancel ก่อน speak จริง) */
let _speechPrimed = false;
function primeSpeechOnce(){
  if(_speechPrimed || !window.speechSynthesis) return;
  _speechPrimed = true;
  try{ const p = new SpeechSynthesisUtterance(' '); p.volume = 0; speechSynthesis.speak(p); }catch(e){}
}

/* ไล่ความยากตามด่าน + ตามระดับชั้น — cat.wordLens = [ช่วงด่านต้น, กลาง, ท้าย]
   ค่า default คงพฤติกรรมเดิม (ไทย 3/4/5 ตัวอักษร, อังกฤษ 3 ตัวอักษรทุกด่าน)
   ระดับชั้นสูงขึ้นตั้งค่ายาวขึ้นได้ เช่น ป.4 ไทย [5,6,7] / อังกฤษ [5,6,7] (ดู cat.wordLens ใน data.js) */
function listenWordLen(cat, level){
  const lens = cat.wordLens || (cat.lang==='th' ? [3,4,5] : [3,3,3]);
  return level<=4 ? lens[0] : (level<=8 ? lens[1] : lens[2]);
}

/* จำนวนตัวอักษรที่เฉลยให้ (เฉพาะ mode 'hint' คือ ฟังคำไทย 1) ลดลงทุกครึ่งของแต่ละช่วงความยาวคำ */
function listenThaiHintCount(cat, level, wordLen){
  if(cat.mode!=='hint') return 0;
  const base = (level%4)<=2 ? 2 : 1;                  /* สลับ 2-1 ตัวเหมือนเดิมภายในแต่ละช่วงความยาวคำ */
  const extra = Math.max(0, Math.floor(((wordLen||3)-3)/2)); /* คำยิ่งยาว เฉลยเพิ่มให้ 1 ตัวทุก 2 ตัวอักษรที่เพิ่มขึ้น */
  return Math.min(base+extra, (wordLen||3)-2);        /* เหลือให้เด็กหาอย่างน้อย 2 ตัวเสมอ */
}

async function startListenGame(catId){
  stopARGame();
  lastGameType = 'listen'; lastCatId = catId;
  const cat = catById(catId);
  listenGame = {
    catId, level:1, mistakes:0, totalLevels:cat.levels, noThaiVoice:false,
    usedWordIdx: {}   /* แยก Set ตามความยาวคำ (สร้างเมื่อใช้จริง) กันคำซ้ำภายในรอบเดียว */
  };
  showOnlyView(listenView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  listenView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('listen-cat-label', cat);
  await ensureVoicesLoaded();   // รอ voices โหลดก่อน กันเสียงเพี้ยน/เลือก voice ไม่ได้ตอนกดฟังครั้งแรก (ทั้งไทย/อังกฤษ)
  if(cat.lang==='th'){
    listenGame.noThaiVoice = !pickThaiVoice();   // voices โหลดแล้ว เช็คตรงๆ ได้เลย
    if(listenGame.noThaiVoice) showToast('🔇','เบราว์เซอร์นี้ไม่รองรับเสียงพูดภาษาไทย ระบบจะโชว์รูปคำใบ้แทนนะ');
  }
  renderListenLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

function speakListenWord(word){
  if(!window.speechSynthesis){ showToast('🔇','เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง'); return; }
  const cat = listenGame ? catById(listenGame.catId) : null;
  const u = new SpeechSynthesisUtterance(word);
  if(cat && cat.lang==='th'){
    const voice = pickThaiVoice();
    if(voice) u.voice = voice; // set voice ตรงๆ แทนพึ่ง lang อย่างเดียว บาง browser เลือก voice ผิด/ไม่พูดถ้าไม่ set
    u.lang = 'th-TH';
  } else {
    const voice = pickEnglishVoice();
    if(voice) u.voice = voice; // set voice อังกฤษมาตรฐาน กันเครื่องเลือกเสียง novelty/เสียงไทยอ่านอังกฤษ = เพี้ยน
    u.lang = 'en-US';
  }
  u.rate = 0.85;
  /* สำคัญ: ต้องเรียก cancel()+speak() "ตรงๆ" ในจังหวะที่ผู้ใช้กดปุ่ม (user gesture) ห้ามหน่วงด้วย setTimeout
     เพราะ iOS Safari (iPad — อุปกรณ์หลักของแอป) จะบล็อกเสียงถ้า speak() ไม่ได้อยู่ใน user gesture โดยตรง = กดฟังแล้วเงียบ
     (ของเดิมหน่วง 30ms เพื่อกันบั๊ก Chrome แต่ทำให้ iPad ไม่มีเสียง — ทดสอบแล้ว Chrome เรียกตรงๆ ก็ทำงานปกติ) */
  try{ speechSynthesis.cancel(); }catch(e){}   // ตัดเสียงเดิมที่ค้างก่อนพูดคำใหม่ กันเสียงซ้อนตอนกดรัวๆ
  primeSpeechOnce();                            // อุ่นเครื่องครั้งแรก กันเสียงเพี้ยนตอนกดฟังครั้งแรก
  speechSynthesis.speak(u);
}

function renderListenLevel(){
  const cat = catById(listenGame.catId);
  if(cat.lang==='th') prepareListenLevelTh(cat);
  else prepareListenLevelEn(cat);
}

function prepareListenLevelEn(cat){
  const level = listenGame.level;
  const wordLen = listenWordLen(cat, level);
  const pool = LISTEN_WORDS[wordLen] || LISTEN_WORDS[3];
  if(!listenGame.usedWordIdx[wordLen]) listenGame.usedWordIdx[wordLen] = new Set();
  const idx = pickNoRepeatIdx(listenGame.usedWordIdx[wordLen], pool.length);
  const word = pool[idx];
  const letters = word.split('');

  /* เฉลยตัวอักษร: เฉพาะ mode 'hint' (ฟังคำศัพท์ 1) เท่านั้น — เลือกตำแหน่งเฉลยแบบสุ่ม ไม่ตายตัวว่าต้องเป็นตัวแรก/ท้าย */
  let hintCount = 0;
  if(cat.mode==='hint') hintCount = listenThaiHintCount({mode:'hint'}, level, wordLen);
  const positions = shuffleArray(letters.map((_,i)=>i));
  const hintPositions = positions.slice(0, hintCount);
  const findPositions = positions.slice(hintCount);

  /* จำนวนตัวอักษรหลอกเพิ่มตามความยากของด่าน — เกมฟังคำศัพท์ 2 (mode 'nohint') จำกัดการ์ดรวมไว้ไม่เกิน 5 ใบเสมอ
     (ไม่เฉลยเลย ต้องหาครบ 3 ตัวอยู่แล้ว ถ้าการ์ดเยอะเกินไปจะยากเกินไปสำหรับเด็ก 5 ขวบ) */
  const neededLetters = findPositions.map(p=>letters[p]);
  let decoyCount = level<=3 ? 2 : (level<=6 ? 3 : 4);
  /* จำกัดจำนวนการ์ดรวมไม่ให้ล้นจอ: คำยิ่งยาวยิ่งเหลือที่ให้ตัวหลอกน้อยลง (เพดานรวม 9 ใบ) */
  const capEn = Math.min(9, neededLetters.length + (wordLen<=3 ? 2 : (wordLen<=5 ? 3 : 2)));
  decoyCount = Math.max(0, Math.min(decoyCount, capEn - neededLetters.length));
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c=>!letters.includes(c));
  shuffleArray(alphabet);
  const decoys = alphabet.slice(0, decoyCount);

  listenGame.symbol = null;
  finalizeListenLevel(cat, word, letters, hintPositions, neededLetters, decoys);
}

function prepareListenLevelTh(cat){
  const level = listenGame.level;
  const wordLen = listenWordLen(cat, level);
  const pool = LISTEN_WORDS_TH[wordLen] || LISTEN_WORDS_TH[3];
  if(!listenGame.usedWordIdx[wordLen]) listenGame.usedWordIdx[wordLen] = new Set();
  const idx = pickNoRepeatIdx(listenGame.usedWordIdx[wordLen], pool.length);
  const entry = pool[idx];
  const word = entry.w;
  const letters = word.split('');

  const hintCount = listenThaiHintCount(cat, level, wordLen);
  const positions = shuffleArray(letters.map((_,i)=>i));
  const hintPositions = positions.slice(0, hintCount);
  const findPositions = positions.slice(hintCount);
  const neededLetters = findPositions.map(p=>letters[p]);

  let decoyCount = wordLen<=3 ? 2 : (wordLen<=4 ? 3 : 4);
  {
    /* เพดานการ์ดรวม 9 ใบเสมอ (จอเด็กวางได้พอดี) — คำยาวขึ้นจึงลดตัวหลอกลงอัตโนมัติ */
    const cap = Math.min(9, letters.length + (wordLen<=3 ? 2 : (wordLen<=5 ? 3 : 2)));
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
  showOnlyView(resultView);

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
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});
