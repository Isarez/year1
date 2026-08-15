/* ================================================================================
   เกม AR ที่ใช้กล้อง + MediaPipe Hands: ต่อประโยค/คณิตด้วยมือ, มือการ์ตูน,
   และโหมด "เล่นด้วยมือ" (handPlay) ที่เกมทักษะอื่นยืมไปใช้
   รวม lazy-load ของโหมดบ้านของหนู (three.min.js + house.js)
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

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
let arResCount = 0, arSawHand = false, arWatchdog = null;   /* ยามเฝ้า "กล้องติดแต่ไม่เจอมือ" */
let arLandmarks = null;        // latest hand landmarks from onResults
let arHandSmooth = null;       // landmark (พิกัด pixel) ผ่าน temporal smoothing แล้ว — ลด jitter ให้มือ/cursor ขยับนุ่มขึ้น
let arWasPinching = false;
let arDraggingCard = null, arDragSource = null; // 'hand' | 'mouse'
let arDragLineFrom = null;     // {side, key, x, y, el} anchor dot for match-mode line drag
let _mpLoadPromise = null;


function loadScriptOnce(src){
  return new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = src;
    if(/^https?:/.test(src)) s.crossOrigin = 'anonymous';   /* ไฟล์ในโปรเจคไม่ต้องใส่ (พังบน file://) */
    s.onload = ()=>resolve();
    s.onerror = ()=>reject(new Error('โหลดสคริปต์ไม่สำเร็จ: '+src));
    document.head.appendChild(s);
  });
}
function loadMediaPipeScripts(){
  if(window.Hands && window.Camera) return Promise.resolve();
  if(_mpLoadPromise) return _mpLoadPromise;
  _mpLoadPromise = loadScriptOnce('js/vendor/mediapipe/hands/hands.js'+(window.APP_ASSET_VER||''))
    .then(()=>loadScriptOnce('js/vendor/mediapipe/camera_utils/camera_utils.js'+(window.APP_ASSET_VER||'')))
    .then(()=>{ if(!window.Hands || !window.Camera) throw new Error('ไม่พบ MediaPipe Hands/Camera'); });
  return _mpLoadPromise;
}

/* ⚠ **Hands ตัวเดียวใช้ทั้งแอป — ห้ามสร้างใหม่ทุกครั้งที่เปิดกล้อง**
   บั๊กจริงที่ผู้ใช้เจอ 2026-08-11: ปิดการ์ดคำถาม (= ปิดกล้อง) แล้วเปิดใหม่ มือไม่ขึ้น "บางที"
     รอบ 1 ได้ผลลัพธ์ปกติ · รอบ 2 ได้ 0 · รอบ 3 กลับมาปกติ
   สาเหตุ: ตัวเก่าถูกทิ้งด้วย `hpHands = null` เฉยๆ (ไม่ได้ close()) ระบบไฟล์ในหน่วยความจำของ wasm
     ยังไม่ถูกคืน ตัวใหม่จึงอ่านไฟล์โมเดลไม่เจอ →
     "LocalFileContentsCalculator failed: Failed to read file …" แล้ว abort ทั้งกราฟ
   ⇒ สร้างครั้งเดียวแล้วใช้ซ้ำตลอด · `onResults` ตั้งทับได้ (mediapipe เก็บ callback ตัวเดียว)
     ⇒ ฝั่งที่เลิกใช้แค่ตั้ง `arHands/hpHands = null` ของตัวเองได้ตามเดิม ไม่กระทบตัวจริง
   ⚠ เกม AR กับโหมดมือไม่มีทางเปิดพร้อมกัน (คนละ view) จึงใช้ตัวเดียวกันได้ปลอดภัย */
let _mpSolution = null;
function getHandsSolution(){
  if(_mpSolution) return _mpSolution;
  _mpSolution = new Hands({ locateFile:(f)=>'js/vendor/mediapipe/hands/'+f });
  _mpSolution.setOptions({ maxNumHands:1, modelComplexity:0, minDetectionConfidence:0.6, minTrackingConfidence:0.5 });
  return _mpSolution;
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
  /* ความยาวประโยคไล่ตามด่าน — cat.sentenceLens ปรับได้ต่อระดับชั้น (ป.1-2 = 3/4/5 คำ, ป.3 = 4/5/6 คำ) */
  const lens = cat.sentenceLens || [3,4,5];
  const wordCount = level<=3 ? lens[0] : (level<=6 ? lens[1] : lens[2]);
  const pool = AR_SENTENCES[cat.lang][wordCount];
  if(!arGame.usedSentenceIdx[wordCount]) arGame.usedSentenceIdx[wordCount] = new Set();
  const sentence = pool[pickNoRepeatIdx(arGame.usedSentenceIdx[wordCount], pool.length)];
  renderSlotsAndCards(sentence);
  showARHint(isMobileViewport()
    ? (cat.lang==='th' ? '👆 แตะคำแล้วลากไปเรียงในช่องให้ถูกลำดับนะ!' : '👆 Tap a word card and drag it into the right box!')
    : (cat.lang==='th' ? '✋ จีบนิ้วหยิบคำ แล้วลากไปเรียงในช่องให้ถูกลำดับนะ!' : '✋ Pinch a word card and drag it into the right box!'));
}



/* ---- AR math mode: random 1-2 digit addition/subtraction, pick the 1 correct answer card out of 3 ---- */
function buildMathLevel(cat){
  const level = arGame.level;
  /* mathTiers: [[min,max] ด่าน 1-3, [min,max] ด่าน 4-7, [min,max] ด่าน 8-10] ไล่ตามความยากของแต่ละหมวด */
  const tier = level<=3 ? cat.mathTiers[0] : (level<=7 ? cat.mathTiers[1] : cat.mathTiers[2]);
  const [lo, hi] = tier;
  /* mathOps: ชุดเครื่องหมายที่หมวดนี้ใช้ (default บวก-ลบ) — ป.2 เพิ่ม ×/÷ (calculation engine)
     กรณี ×/÷ ให้ [lo,hi] = ช่วงของ "ตัวประกอบ/ผลหาร" (ไม่ใช่ตัวตั้ง) เพื่อคุมความยากตามสูตรคูณ */
  const ops = cat.mathOps || ['+','-'];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a, b, answer;
  if(op==='×'){
    a = Math.floor(Math.random()*(hi-lo+1))+lo;
    b = Math.floor(Math.random()*(hi-lo+1))+lo;
    answer = a*b;
  } else if(op==='÷'){
    /* สร้างการหารลงตัวเสมอ (เกมลากคำตอบเดียว): ผลหาร q, ตัวหาร d, ตัวตั้ง = q×d */
    const q = Math.floor(Math.random()*(hi-lo+1))+lo;
    const d = Math.floor(Math.random()*(Math.max(2,hi)-2+1))+2;
    answer = q; b = d; a = q*d;
  } else {
    a = Math.floor(Math.random()*(hi-lo+1))+lo;
    b = Math.floor(Math.random()*(hi-lo+1))+lo;
    if(op==='-' && b>a){ const t=a; a=b; b=t; } // avoid negative answers
    answer = op==='+' ? a+b : a-b;
  }
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
  const pool = AR_MATCH_ITEMS[cat.matchSet || cat.lang || 'th'];  /* cat.matchSet = คลังคำศัพท์ยากของชั้นสูง (เช่น 'enAdv' ของ ป.4) */
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
/* กันการ์ดหลุดออกนอกจอ — จำกัดจุดศูนย์กลางการ์ด (จุดอ้างอิงตอน dragging คือ left/top จริงเพราะใช้ translate(-50%,-50%))
   ไม่ให้เกินขอบจอ โดยเผื่อระยะครึ่งความกว้าง/สูงของการ์ดเองไว้เสมอ */
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


function matchMistakeFlash(dotA, dotB){
  arGame.mistakes++;
  playWrong();
  mascotOops();
  [dotA, dotB].forEach(d=>{ d.classList.add('wrong-flash'); setTimeout(()=>d.classList.remove('wrong-flash'), 450); });
  const cat = catById(arGame.catId);
  showARHint(cat.lang==='th' ? '🤔 ยังไม่ตรงกันนะ ลองโยงเส้นใหม่ดูสิ!' : '🤔 Not a match — try connecting a different line!');
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

    arHands = getHandsSolution();
    /* ยามเฝ้าแบบเดียวกับโหมดมือ — กันอาการ "กล้องติดแต่ไม่เจอมือ" เงียบๆ (ดู startHandWatchdog)
       เกม AR ยังลากด้วยนิ้ว/เมาส์ได้อยู่แล้ว จึงแค่บอกให้รู้ ไม่ต้องปิดกล้องทิ้ง */
    arResCount = 0; arSawHand = false;
    arHands.onResults(res=>{
      arResCount++;
      arLandmarks = (res.multiHandLandmarks && res.multiHandLandmarks[0]) || null;
      if(arLandmarks) arSawHand = true;
    });

    arCamera = new Camera(video, {
      onFrame: async ()=>{ if(arHands){ await arHands.send({ image:video }); } },
      width:480, height:360
    });
    await arCamera.start();

    arActive = true;
    $('ar-cursor').classList.add('active');
    arRafId = requestAnimationFrame(arDrawLoop);
    if(arWatchdog) clearTimeout(arWatchdog);
    arWatchdog = setTimeout(()=>{
      if(!arActive) return;
      if(arResCount === 0){
        console.warn('AR: MediaPipe ไม่คายผลลัพธ์เลย (โมเดลโหลดไม่ครบหรือเครื่องไม่รองรับ)');
        showToast('🖐️','เครื่องนี้ยังใช้มือหน้ากล้องไม่ได้ ลากด้วยนิ้วหรือเมาส์ได้เลยนะ!');
      } else if(!arSawHand){
        showToast('🖐️','ยกมือขึ้นให้เห็นทั้งฝ่ามือ ห่างกล้องสักหนึ่งช่วงแขน ในที่สว่างนะ!');
      }
    }, 7000);
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



/* ============================= HAND PLAY (โหมดกล้องสำหรับ "เกมแบบแตะ" ของ ป.3)
   เกมที่ตั้ง cat.handPlay:true จะมีปุ่มกล้องเพิ่มในแถบหัวเกม กดแล้วเล่นด้วยมือหน้ากล้องได้:
   ปลายนิ้วชี้ = เคอร์เซอร์, "จีบนิ้ว" (โป้ง+ชี้) = แตะ 1 ครั้ง
   - ไม่แตะ logic ของเกมเลย แค่ยิง .click() ใส่ปุ่ม/ช่องที่ปลายนิ้วชี้อยู่ (เกมกลุ่มนี้เป็นกลไกแตะล้วนทั้งหมด)
   - ต่างจาก ar-view ตรงที่ "ไม่โชว์ภาพจากกล้อง" เป็นพื้นหลัง (จะบังกระดานเกม) วาดแค่มือการ์ตูนทับหน้าจอ
   - default = ปิด (ไม่ขอสิทธิ์กล้องเอง) เด็กกดปุ่มเองถึงจะเปิด, ไม่แสดงบนมือถือ (จอเล็กเกินไป) ============================= */
const HP_CLICK_SEL = 'button:not([disabled]), .sort-bin, .coord-cell, .memory-card, [data-hp-click]';
/* ⚠ ของบางชิ้นฟัง **pointerdown** ไม่ได้ฟัง click ⇒ ยิง .click() ใส่แล้วเงียบสนิท
   (คีย์เปียโนของเกมดนตรี — ผู้ใช้แจ้ง 2026-08-12 ว่าชี้ค้างแล้วกดคีย์ไม่ได้)
   ของกลุ่มนี้ต้องยิง pointerdown+pointerup จริงแทน · เพิ่มของใหม่ให้เติมที่ลิสต์นี้ที่เดียว */
const HP_POINTER_SEL = '.music-key, [data-hp-pointer]';
function hpFire(el){
  if(!el) return;
  if(el.matches && el.matches(HP_POINTER_SEL)){
    const r = el.getBoundingClientRect();
    const o = {bubbles:true, cancelable:true, clientX:r.left+r.width/2, clientY:r.top+r.height/2,
               pointerId:1, pointerType:'touch', isPrimary:true};
    el.dispatchEvent(new PointerEvent('pointerdown', o));
    el.dispatchEvent(new PointerEvent('pointerup', o));
    return;
  }
  el.click();
}
let hpBtn = null, hpActive = false, hpStream = null, hpCamera = null, hpHands = null, hpLandmarks = null,
    hpRaf = null, hpSmooth = null, hpWasPinching = false, hpResizeHandler = null, hpHoverEl = null, hpClickAt = 0,
    hpHintShown = false, hpResCount = 0, hpSawHand = false, hpWatchdog = null;

/* view ที่กำลังเปิดอยู่ (section ใน <main> ที่ไม่ hidden และมีแถบหัวเกม) — ใช้หาที่ติดปุ่มกล้อง */
function hpVisibleView(){
  /* ⚠ ต้องรวม section ที่อยู่ "นอก <main>" ด้วย — #house-view กับ #ar-view วางไว้นอก main
     เพราะเรื่อง stacking context (ดูคอมเมนต์ใน index.html) ถ้าเลือกแค่ 'main > section'
     โหมดบ้านจะติดปุ่มกล้องไม่ได้เลย (เจอตอนต่อโหมดมือเข้าโหมดบ้าน 2026-08-11) */
  const all = Array.from(document.querySelectorAll('main > section, body > section'));
  return all.find(s=>!s.hidden && s.querySelector('.quiz-top')) || null;
}
function hpEnsureBtn(){
  if(hpBtn) return hpBtn;
  hpBtn = document.createElement('button');
  hpBtn.className = 'back-btn hp-toggle muted';
  hpBtn.id = 'handplay-toggle';
  hpBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph lens-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="22" height="22"><circle cx="16" cy="16" r="14" fill="#3A4A5C"/><circle cx="16" cy="16" r="11" fill="#6FA8DC"/><circle cx="16" cy="16" r="7.5" fill="#2B4F73"/><circle cx="16" cy="16" r="3.6" fill="#16232F"/><path d="M16 5 L19 9 L13 9 Z" fill="#8FC1EA" opacity=".8"/><circle cx="12" cy="12" r="1.8" fill="#DDEFFF" opacity=".85"/></svg></span><span class="mute-stripe"></span></span>';
  hpBtn.addEventListener('click', ()=>{ playClick(); toggleHandPlay(); });
  return hpBtn;
}
function hpRefreshBtn(){
  if(!hpBtn) return;
  const label = hpActive ? 'ปิดโหมดมือ' : 'เล่นด้วยมือ (เปิดกล้อง)';
  hpBtn.classList.toggle('muted', !hpActive);
  hpBtn.setAttribute('aria-label', label);
  hpBtn.dataset.tooltip = label;
}
/* เรียกทุกครั้งที่เข้าเกม — ติดปุ่มกล้องให้เฉพาะหมวดที่รองรับ (นอกนั้นถอดออก+ปิดกล้องให้เรียบร้อย) */
/* โหมดบ้านไม่มี "cat" — เรียกตัวนี้แทน (ใช้ทางเดียวกันทุกอย่าง ต่างแค่ไม่ต้องเช็ค cat.handPlay)
   ⚠ โหมดบ้านเป็นกลไก "แตะ" ทั้งหมดอยู่แล้ว (ปุ่มตัวเลือก/กล่องของ/ถัง) จึงยิง .click() ได้ตรงๆ
     ส่วนการเดินในโลก 3D ใช้ pointer event ไม่ใช่ click — จีบนิ้วสั่งเดินไม่ได้ ตั้งใจให้เป็นแบบนั้น
     (โหมดมือมีไว้เล่นโจทย์ ไม่ได้มีไว้บังคับตัวละคร) */
function mountHandPlayHouse(){
  if(isMobileViewport()){ unmountHandPlay(); return; }
  const view = document.getElementById('house-view');
  if(!view || view.hidden){ unmountHandPlay(); return; }
  const top = view.querySelector('.quiz-top');
  if(!top){ unmountHandPlay(); return; }
  /* ⚠ ต้องเรียกซ้ำได้โดย "ไม่ปิดกล้องที่เปิดอยู่" — qzShow() ในโหมดบ้านถูกเรียกทุกครั้งที่เปลี่ยนข้อ
     (8 จุด: รับงาน → เริ่มเล่น → ข้อถัดไป → หน้าสรุป) ถ้า unmount ทุกรอบแบบ mountHandPlay()
     เด็กจะเปิดกล้องแล้วมือหายทันทีที่ตอบข้อแรก (บั๊กจริงที่ผู้ใช้เจอ 2026-08-11) */
  setHandDwellMode(true);          /* โหมดบ้าน = ชี้ค้าง 3 วิ (ไม่ต้องจีบนิ้ว) */
  if(hpBtn && hpBtn.parentNode === top){ hpRefreshBtn(); return; }
  top.appendChild(hpEnsureBtn());
  hpRefreshBtn();
}
function mountHandPlay(cat){
  unmountHandPlay();
  setHandDwellMode(false);         /* เกมหน้าหลักยังใช้ท่าเดิม (จีบนิ้ว) ตามที่ล็อกไว้ใน CLAUDE.md */
  if(!cat || !cat.handPlay || isMobileViewport()) return;
  const view = hpVisibleView();
  if(!view) return;
  const top = view.querySelector('.quiz-top');
  if(!top) return;
  top.appendChild(hpEnsureBtn());
  hpRefreshBtn();
  if(!hpHintShown){
    hpHintShown = true;
    setTimeout(()=>showToast('🖐️','เกมนี้เล่นด้วยมือหน้ากล้องได้นะ กดปุ่มกล้องมุมขวาบนเลย!'), 1200);
  }
}
function unmountHandPlay(){
  stopHandPlay();
  if(hpBtn && hpBtn.parentNode) hpBtn.parentNode.removeChild(hpBtn);
}
function toggleHandPlay(){
  if(hpActive){ stopHandPlay(); hpRefreshBtn(); showToast('📷','ปิดกล้องแล้ว แตะหน้าจอเล่นต่อได้เลย!'); }
  else startHandPlay();
}
/* บอกโหมดบ้านว่ากล้องเปิดอยู่อยู่ไหม
   ⚠ **ไม่หรี่ลูปวาด 3D แล้ว** (ส่ง false เสมอ) — ลองหรี่เหลือ 20-30fps ตอนกล้องเปิดแล้ว
     ผู้ใช้แจ้งว่า "โลกกระตุก" 2026-08-12 · ตัวการจริงคือ inference ของ MediaPipe ที่บล็อก main thread
     ซึ่งแก้ที่ "ส่งเข้าโมเดลเว้นเฟรม" ตรงกล้องแทน (ดู onFrame ใน startHandPlay)
     คงฟังก์ชันนี้ไว้เป็นจุดต่อ เผื่อวันหลังเจอเครื่องช้าจริงๆ ที่ต้องหรี่
   ⚠ ถ้าจะเปิดหรี่กลับ ต้องเรียก "หลัง" hpActive ถูกตั้งค่าจริง — startHandPlay() เป็น async */
function hpFrameHint(){
  if(window.HouseFrameHint) window.HouseFrameHint(false);
}
function hpSetHover(el){
  if(hpHoverEl === el) return;
  if(hpHoverEl && hpHoverEl.classList) hpHoverEl.classList.remove('hp-hover');
  hpHoverEl = el;
  if(hpHoverEl && hpHoverEl.classList) hpHoverEl.classList.add('hp-hover');
}
/* ---- "ชี้ค้าง" (dwell) — ตอบโดยไม่ต้องจีบนิ้ว (ผู้ใช้สั่ง 2026-08-12) ----
   เอานิ้วชี้ค้างบนปุ่มครบ HP_DWELL_MS แล้วนับเป็นการกดหนึ่งครั้ง
   ระหว่างนับ ปุ่มจะมี "แถบเขียวไล่จากซ้ายไปขวา" ด้วยความเร็วคงที่ (linear) ดู .hp-dwell ใน css/style.css
   ⚠ **ตัวบอกความคืบหน้าต้องวาดอยู่ "ในกรอบปุ่ม" เท่านั้น** (outline-offset ติดลบ / pseudo inset:0)
     ของเดิมวาดล้นออกนอกปุ่ม 7px แล้วโผล่พ้นขอบการ์ดออกไปในโลก 3D (ผู้ใช้แจ้ง 2026-08-12)
   ⚠ **ใช้เฉพาะโหมดบ้าน** (hpDwellOn) — เกม ป.3 กับ ar-match ในหน้าหลักยังใช้ท่าเดิม
     (CLAUDE.md ล็อกไว้ว่าห้ามเปลี่ยนท่ามือของเกมพวกนั้นโดยไม่ถามผู้ใช้)
   ⚠ **จีบนิ้วยังใช้ได้เหมือนเดิม** เป็นทางลัดของเด็กที่ทำเป็น ไม่ได้เอาออก
   ⚠ ขยับนิ้วออกนอกปุ่ม = เริ่มนับใหม่ · สั่นเล็กน้อยไม่นับว่าออก (เป้าเดิม = นับต่อ) */
const HP_DWELL_MS = 1500;
let hpDwellOn = false, hpDwellEl = null, hpDwellAt = 0;
function setHandDwellMode(on){
  hpDwellOn = !!on;
  if(!hpDwellOn) hpDwellClear();
}
function hpDwellClear(){
  if(hpDwellEl){
    hpDwellEl.classList.remove('hp-dwell');
    hpDwellEl.style.removeProperty('--hp-dwell-p');
  }
  hpDwellEl = null; hpDwellAt = 0;
}
function hpDwellTick(target){
  if(!hpDwellOn || !target){ hpDwellClear(); return false; }
  if(target !== hpDwellEl){
    hpDwellClear();
    hpDwellEl = target; hpDwellAt = Date.now();
    target.classList.add('hp-dwell');
  }
  const p = Math.min(1, (Date.now() - hpDwellAt) / HP_DWELL_MS);
  hpDwellEl.style.setProperty('--hp-dwell-p', p.toFixed(3));
  if(p >= 1){
    const el = hpDwellEl;
    hpDwellClear();
    hpClickAt = Date.now();
    hpFire(el);
    return true;
  }
  return false;
}
function updateHandCursor(pageX, pageY, pinching){
  const cur = $('hp-cursor');
  cur.style.left = pageX+'px';
  cur.style.top = pageY+'px';
  cur.classList.add('active');
  cur.classList.remove('hover','grabbed');
  const hovered = document.elementFromPoint(pageX, pageY);
  const target = (hovered && hovered.closest) ? hovered.closest(HP_CLICK_SEL) : null;
  hpSetHover(target);
  if(target) cur.classList.add('hover');
  if(pinching && !hpWasPinching && target && Date.now()-hpClickAt > 450){
    hpClickAt = Date.now();
    cur.classList.add('grabbed');
    hpDwellClear();
    hpFire(target);
  } else if(!pinching && Date.now()-hpClickAt > 450){
    if(hpDwellTick(target)) cur.classList.add('grabbed');
  } else if(pinching){
    hpDwellClear();          /* กำลังจีบนิ้วอยู่ = ไม่ต้องนับถอยหลังซ้อน */
  }
  hpWasPinching = pinching;
}
function hpDrawLoop(){
  if(!hpActive) return;
  /* ออกจากเกมทางไหนก็ตาม (จบเกมไปหน้าผล/กดย้อนกลับ) view ที่ปุ่มติดอยู่จะถูกซ่อน → ปิดกล้องเองอัตโนมัติ */
  const host = hpBtn && hpBtn.closest('section');
  if(!host || host.hidden){ unmountHandPlay(); return; }
  const canvas = $('hp-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(hpLandmarks){
    /* temporal smoothing จุดเดียวเหมือน arDrawLoop — มือที่วาดกับเคอร์เซอร์ตรงกันเสมอ */
    const raw = hpLandmarks.map(p=>({x:(1-p.x)*canvas.width, y:p.y*canvas.height}));
    if(!hpSmooth || hpSmooth.length !== raw.length) hpSmooth = raw;
    else hpSmooth = hpSmooth.map((p,i)=>({x:p.x+(raw[i].x-p.x)*0.5, y:p.y+(raw[i].y-p.y)*0.5}));
    const pts = hpSmooth;
    drawCartoonHand(ctx, pts);
    const ix = pts[8].x, iy = pts[8].y, tx = pts[4].x, ty = pts[4].y;
    const pinching = Math.sqrt((ix-tx)*(ix-tx)+(iy-ty)*(iy-ty)) < Math.max(28, canvas.width*0.07);
    const rect = canvas.getBoundingClientRect();
    updateHandCursor(rect.left + ix*rect.width/canvas.width, rect.top + iy*rect.height/canvas.height, pinching);
  } else {
    hpSmooth = null;
    hpSetHover(null);
    hpDwellClear();          /* มือหลุดออกนอกกล้อง = เริ่มนับใหม่รอบหน้า */
    $('hp-cursor').classList.remove('active');
    hpWasPinching = false;
  }
  hpRaf = requestAnimationFrame(hpDrawLoop);
}
async function startHandPlay(){
  if(isMobileViewport()) return;
  try{
    await loadMediaPipeScripts();
    const layer = $('hp-layer');
    layer.hidden = false;
    const video = $('hp-video');
    hpStream = await navigator.mediaDevices.getUserMedia({ video:{ width:480, height:360, facingMode:'user' }, audio:false });
    video.srcObject = hpStream;
    await video.play().catch(()=>{});
    const canvas = $('hp-canvas');
    hpResizeHandler = ()=>{ canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    hpResizeHandler();
    window.addEventListener('resize', hpResizeHandler);
    hpHands = getHandsSolution();
    hpResCount = 0; hpSawHand = false;
    hpHands.onResults(res=>{
      hpResCount++;
      hpLandmarks = (res.multiHandLandmarks && res.multiHandLandmarks[0]) || null;
      if(hpLandmarks) hpSawHand = true;
    });
    /* ⚠ **ต้นเหตุจริงที่โลก 3D กระตุกตอนเปิดกล้อง คือ "การประมวลผลมือ" ไม่ใช่การวาดฉาก**
       hands.send() ทำ inference บน main thread เฟรมละ ~10-20 ms ⇒ rAF ของโลกโดนบล็อกเป็นช่วงๆ
       การไปหรี่ลูปวาดจึงไม่ช่วย (ยิ่งกระตุกกว่าเดิม — ผู้ใช้แจ้ง 2026-08-12)
       ⇒ ส่งเข้าโมเดล "เว้นเฟรม" แทน งานหนักลดครึ่ง เคอร์เซอร์มือยังลื่นพอ (~15 ครั้ง/วินาที)
         ซึ่งเหลือเฟือสำหรับกลไก "ชี้ค้าง" ที่ไม่ต้องการความแม่นระดับเฟรมแบบตอนจีบนิ้ว */
    let sendOdd = false;
    hpCamera = new Camera(video, { onFrame: async ()=>{
      sendOdd = !sendOdd;
      if(sendOdd) return;
      if(hpHands){ await hpHands.send({ image:video }); }
    }, width:480, height:360 });
    await hpCamera.start();
    hpActive = true;
    hpRaf = requestAnimationFrame(hpDrawLoop);
    /* ⚠ โหมดชี้ค้าง **ไม่ได้ตัดการจีบนิ้วทิ้ง** — ต้องบอกเด็กว่าทำได้ทั้ง 2 ทาง (ผู้ใช้สั่ง 2026-08-12) */
    showToast('✋', hpDwellOn
      ? 'ยกมือขึ้นหน้ากล้อง ชี้ค้างที่คำตอบจนเส้นเขียวเต็ม = ตอบ · หรือ "จีบนิ้ว" ตอบทันทีก็ได้!'
      : 'ยกมือขึ้นหน้ากล้อง แล้ว "จีบนิ้ว" เพื่อแตะได้เลย!');
    startHandWatchdog();
  }catch(err){
    console.warn('hand play unavailable:', err);
    stopHandPlay();
    showToast('📷','เปิดกล้องไม่ได้ ไม่เป็นไรนะ แตะหน้าจอเล่นได้ตามปกติ!');
  }
  hpRefreshBtn();
  hpFrameHint();
}
/* ⚠ ยามเฝ้า "เปิดกล้องแล้วมือไม่ขึ้น" — อาการนี้เคยเงียบสนิทมาก่อน (ไฟล์โมเดลหายไปจาก repo
   ตั้งแต่ 2026-07-30 ถึง 2026-08-11 กล้องติดแต่ไม่เคยเจอมือเลย ไม่มีอะไรบอกเด็ก/ผู้ปกครองเลย)
   ⇒ แยก 2 กรณีให้ชัด: โมเดลไม่ทำงานเลย (บอกแล้วปิดกล้องคืนให้) vs โมเดลทำงานแต่ยังไม่เห็นมือ (สอนวิธียกมือ) */
function startHandWatchdog(){
  clearHandWatchdog();
  hpWatchdog = setTimeout(()=>{
    if(!hpActive) return;
    if(hpResCount === 0){
      console.warn('hand play: MediaPipe ไม่คายผลลัพธ์เลย (โมเดลโหลดไม่ครบหรือเครื่องไม่รองรับ)');
      showToast('📷','เครื่องนี้ยังใช้โหมดมือไม่ได้ ไม่เป็นไรนะ แตะหน้าจอเล่นได้ตามปกติ!');
      stopHandPlay();
    } else if(!hpSawHand){
      showToast('🖐️','ยกมือขึ้นให้เห็นทั้งฝ่ามือ ห่างกล้องสักหนึ่งช่วงแขน ในที่สว่างนะ!');
    }
  }, 7000);
}
function clearHandWatchdog(){ if(hpWatchdog){ clearTimeout(hpWatchdog); hpWatchdog = null; } }
function stopHandPlay(){
  clearHandWatchdog();
  hpDwellClear();
  hpActive = false;
  hpLandmarks = null;
  hpSmooth = null;
  hpWasPinching = false;
  if(hpRaf){ cancelAnimationFrame(hpRaf); hpRaf = null; }
  if(hpCamera){ try{ hpCamera.stop(); }catch(e){} hpCamera = null; }
  if(hpStream){ hpStream.getTracks().forEach(t=>t.stop()); hpStream = null; }
  if(hpResizeHandler){ window.removeEventListener('resize', hpResizeHandler); hpResizeHandler = null; }
  hpHands = null;
  hpSetHover(null);
  const layer = $('hp-layer');
  if(layer) layer.hidden = true;
  const cur = $('hp-cursor');
  if(cur) cur.classList.remove('active');
  hpRefreshBtn();
  hpFrameHint();
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
  showOnlyView(arView);
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
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

$('ar-camera-toggle').addEventListener('click', ()=>{
  playClick();
  toggleARCamera();
});


/* ============================= LAZY LOAD: โหมดบ้านของหนู (3D) =============================
   three.min.js + house-map.js + house-furniture.js + house.js รวม ~1.2 MB ที่เด็กส่วนใหญ่ไม่ได้ใช้ทุกครั้ง
   จึงโหลดเมื่อจำเป็นเท่านั้น 2 กรณี:
     1) กดปุ่มเข้าบ้าน — โหลดแล้วเปิดบ้านต่อทันที (โชว์ม่านโหลดระหว่างดาวน์โหลด)
     2) เด็กคนนี้ "มีบ้านอยู่แล้ว" — โหลดเงียบๆ ตอนว่างเพื่อให้เพื่อนซี้หน้าหลักโผล่มาเหมือนเดิม
   ใช้ createElement('script') (ไม่ใช่ dynamic import) จึงทำงานบน file:// ได้ตามหลักการของโปรเจค */
let housePromise = null;

/* ม่านโหลด #house-loading อยู่ใน index.html ตลอด (ไม่ได้มากับ house.js) หน้านี้จึงเปิดเองได้
   ตั้งแต่ "เริ่มดาวน์โหลด" ซึ่งเป็นช่วงที่นานที่สุด — พอ house.js โหลดเสร็จมันจะรับช่วงเดินหลอด
   ต่อจาก 22% ไปเองใน startHouseGame() ตัวเลขที่นี่จึงหยุดแค่ราวๆ 20% */
function houseCurtain(pct, msg){
  const el = $('house-loading'), bar = $('house-loading-bar'), tx = $('house-loading-text');
  if(!el) return;
  el.classList.remove('done');
  el.hidden = false;
  if(bar) bar.style.width = Math.round(pct*100) + '%';
  if(msg && tx) tx.textContent = msg;
}
function houseCurtainHide(){
  const el = $('house-loading');
  if(el) el.hidden = true;       /* ใช้เฉพาะตอนโหลดไม่สำเร็จ (house.js ยังไม่มา จึงไม่ต้องเฟด) */
}

/* curtain=true → เดินหลอดความคืบหน้าระหว่างดาวน์โหลดให้เด็กเห็นว่ากำลังทำงานอยู่ */
function loadHouseMode(curtain){
  if(housePromise) return housePromise;
  const v = (window.APP_ASSET_VER || '');
  const step = (pct, msg) => { if(curtain) houseCurtain(pct, msg); };
  step(.05, 'กำลังเตรียมบ้านของหนู…');
  housePromise = loadScriptOnce('js/vendor/three.min.js'+v)
    .then(()=>{ step(.12, 'โหลดเครื่องมือสร้างเมือง…'); return loadScriptOnce('js/house-map.js'+v); })
    .then(()=>loadScriptOnce('js/house-furniture.js'+v))
    .then(()=>loadScriptOnce('js/house-shop.js'+v))
    /* คลังโจทย์ต้องมาก่อน engine เควสต์เสมอ (house-quests.js throw ทันทีถ้าไม่มี) */
    .then(()=>loadScriptOnce('js/house-quest-data.js'+v))
    .then(()=>loadScriptOnce('js/house-quests.js'+v))
    .then(()=>loadScriptOnce('js/house-pet-care.js'+v))
    .then(()=>loadScriptOnce('js/house-family.js'+v))
    /* ของเล่นสัตว์เลี้ยง (เฟส 12.1) — ต้องมาก่อน house.js (house.js เรียก HOUSE_PET_TOYS ตอนโหลด) */
    .then(()=>loadScriptOnce('js/house-pet-toys.js'+v))
    /* ตัวละคร/ของแต่งตัว — ต้องมาก่อน house.js (house.js เรียก HOUSE_AVATAR ตอนโหลด) */
    .then(()=>loadScriptOnce('js/house-avatar.js'+v))
    /* โมเดลตึก/ร้านค้า — ต้องมาก่อน house.js (house.js เรียก HOUSE_MODELS ตอนโหลด) */
    .then(()=>loadScriptOnce('js/house-models.js'+v))
    .then(()=>{ step(.16, 'ขนเฟอร์นิเจอร์เข้าบ้าน…');   return loadScriptOnce('js/house.js'+v); })
    /* สะพานไปหา engine เกมของหน้าหลัก (เฟส 5) — ต้องมาหลัง house.js เพราะใช้ window.HouseQuestUI */
    .then(()=>loadScriptOnce('js/house-games.js'+v))
    /* มินิเกมกลุ่ม A ที่เล่นในโลก 3D (เฟส 11) — ต้องมาหลัง house.js เพราะใช้ window.HouseWorld */
    .then(()=>loadScriptOnce('js/house-play.js'+v))
    /* หน้าคลังคำถาม (เมนูเฟือง) — ต้องมาหลัง house.js เพราะเรียก window.HouseQuestUI ตอนกดเล่น */
    .then(()=>loadScriptOnce('js/house-qbrowse.js'+v))
    /* หน้าปรับค่าต่างๆ (เครื่องมือเทส) — ต้องมาหลัง house.js เช่นกัน เพราะเรียก window.HousePetCare/HouseShop */
    .then(()=>loadScriptOnce('js/house-devtools.js'+v))
    .then(()=>{ step(.20, 'กำลังปลุกเมืองให้ตื่น…'); })
    .catch(err=>{ housePromise = null; throw err; });
  return housePromise;
}
function childHasHouse(){
  if(!activeChild) return false;
  try{ return !!localStorage.getItem('p1quiz_house_'+activeChild.id); }catch(e){ return false; }
}
/* โหลดตอนว่าง (ไม่แย่ง first paint) ถ้าเด็กคนนี้มีบ้านอยู่แล้ว — เบื้องหลัง ไม่ต้องมีม่าน */
function preloadHouseIfOwned(){
  if(housePromise || !childHasHouse()) return;
  const go = ()=>loadHouseMode(false).then(()=>{ if(window.houseBuddyRefresh) window.houseBuddyRefresh(); }).catch(()=>{});
  if(window.requestIdleCallback) requestIdleCallback(go, { timeout:2500 }); else setTimeout(go, 1200);
}
/* ปุ่มเข้าบ้าน: ครั้งแรกโหลดสคริปต์ก่อนแล้วเปิดบ้าน ครั้งต่อไป house.js จัดการเอง */
(function wireHouseEntry(){
  const btn = $('house-entry-btn');
  if(!btn) return;
  const onFirstClick = (e)=>{
    if(window.startHouseGame){ btn.removeEventListener('click', onFirstClick); return; }
    e.stopImmediatePropagation();
    btn.disabled = true;
    loadHouseMode(true).then(()=>{
      btn.disabled = false;
      btn.removeEventListener('click', onFirstClick);
      /* startHouseGame() เห็นม่านเปิดค้างอยู่แล้ว จะเดินหลอดต่อและปิดม่านให้เองตอนฉากพร้อม */
      if(window.startHouseGame) window.startHouseGame();
      else houseCurtainHide();
    }).catch(()=>{
      btn.disabled = false;
      houseCurtainHide();
      showToast('\u{1F614}','เปิดบ้าน 3D ไม่ได้ ลองเช็คการเชื่อมต่อแล้วลองใหม่นะ');
    });
  };
  btn.addEventListener('click', onFirstClick);
})();
