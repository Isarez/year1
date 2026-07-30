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

    arHands = new Hands({ locateFile:(f)=>'js/vendor/mediapipe/hands/'+f });
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

/* ============================= HAND PLAY (โหมดกล้องสำหรับ "เกมแบบแตะ" ของ ป.3)
   เกมที่ตั้ง cat.handPlay:true จะมีปุ่มกล้องเพิ่มในแถบหัวเกม กดแล้วเล่นด้วยมือหน้ากล้องได้:
   ปลายนิ้วชี้ = เคอร์เซอร์, "จีบนิ้ว" (โป้ง+ชี้) = แตะ 1 ครั้ง
   - ไม่แตะ logic ของเกมเลย แค่ยิง .click() ใส่ปุ่ม/ช่องที่ปลายนิ้วชี้อยู่ (เกมกลุ่มนี้เป็นกลไกแตะล้วนทั้งหมด)
   - ต่างจาก ar-view ตรงที่ "ไม่โชว์ภาพจากกล้อง" เป็นพื้นหลัง (จะบังกระดานเกม) วาดแค่มือการ์ตูนทับหน้าจอ
   - default = ปิด (ไม่ขอสิทธิ์กล้องเอง) เด็กกดปุ่มเองถึงจะเปิด, ไม่แสดงบนมือถือ (จอเล็กเกินไป) ============================= */
const HP_CLICK_SEL = 'button:not([disabled]), .sort-bin, .coord-cell, .memory-card, [data-hp-click]';
let hpBtn = null, hpActive = false, hpStream = null, hpCamera = null, hpHands = null, hpLandmarks = null,
    hpRaf = null, hpSmooth = null, hpWasPinching = false, hpResizeHandler = null, hpHoverEl = null, hpClickAt = 0,
    hpHintShown = false;

/* view ที่กำลังเปิดอยู่ (section ใน <main> ที่ไม่ hidden และมีแถบหัวเกม) — ใช้หาที่ติดปุ่มกล้อง */
function hpVisibleView(){
  return Array.from(document.querySelectorAll('main > section'))
    .find(s=>!s.hidden && s.querySelector('.quiz-top')) || null;
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
function mountHandPlay(cat){
  unmountHandPlay();
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
function hpSetHover(el){
  if(hpHoverEl === el) return;
  if(hpHoverEl && hpHoverEl.classList) hpHoverEl.classList.remove('hp-hover');
  hpHoverEl = el;
  if(hpHoverEl && hpHoverEl.classList) hpHoverEl.classList.add('hp-hover');
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
    target.click();
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
    hpHands = new Hands({ locateFile:(f)=>'js/vendor/mediapipe/hands/'+f });
    hpHands.setOptions({ maxNumHands:1, modelComplexity:0, minDetectionConfidence:0.6, minTrackingConfidence:0.5 });
    hpHands.onResults(res=>{ hpLandmarks = (res.multiHandLandmarks && res.multiHandLandmarks[0]) || null; });
    hpCamera = new Camera(video, { onFrame: async ()=>{ if(hpHands){ await hpHands.send({ image:video }); } }, width:480, height:360 });
    await hpCamera.start();
    hpActive = true;
    hpRaf = requestAnimationFrame(hpDrawLoop);
    showToast('✋','ยกมือขึ้นหน้ากล้อง แล้ว "จีบนิ้ว" เพื่อแตะได้เลย!');
  }catch(err){
    console.warn('hand play unavailable:', err);
    stopHandPlay();
    showToast('📷','เปิดกล้องไม่ได้ ไม่เป็นไรนะ แตะหน้าจอเล่นได้ตามปกติ!');
  }
  hpRefreshBtn();
}
function stopHandPlay(){
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
   three.min.js (594 KB) + house.js (140 KB) = 734 KB ที่เด็กส่วนใหญ่ไม่ได้ใช้ทุกครั้ง
   จึงโหลดเมื่อจำเป็นเท่านั้น 2 กรณี:
     1) กดปุ่มเข้าบ้าน — โหลดแล้วเปิดบ้านต่อทันที
     2) เด็กคนนี้ "มีบ้านอยู่แล้ว" — โหลดตอนว่างเพื่อให้เพื่อนซี้หน้าหลักโผล่มาเหมือนเดิม
   ใช้ createElement('script') (ไม่ใช่ dynamic import) จึงทำงานบน file:// ได้ตามหลักการของโปรเจค */
let housePromise = null;
function loadHouseMode(){
  if(housePromise) return housePromise;
  const v = (window.APP_ASSET_VER || '');
  housePromise = loadScriptOnce('js/vendor/three.min.js'+v)
    .then(()=>loadScriptOnce('js/house.js'+v))
    .catch(err=>{ housePromise = null; throw err; });
  return housePromise;
}
function childHasHouse(){
  if(!activeChild) return false;
  try{ return !!localStorage.getItem('p1quiz_house_'+activeChild.id); }catch(e){ return false; }
}
/* โหลดตอนว่าง (ไม่แย่ง first paint) ถ้าเด็กคนนี้มีบ้านอยู่แล้ว */
function preloadHouseIfOwned(){
  if(housePromise || !childHasHouse()) return;
  const go = ()=>loadHouseMode().then(()=>{ if(window.houseBuddyRefresh) window.houseBuddyRefresh(); }).catch(()=>{});
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
    showToast('\u{1F3E1}','กำลังเปิดบ้านของหนู…');
    loadHouseMode().then(()=>{
      btn.disabled = false;
      btn.removeEventListener('click', onFirstClick);
      if(window.startHouseGame) window.startHouseGame();
    }).catch(()=>{
      btn.disabled = false;
      showToast('\u{1F614}','เปิดบ้าน 3D ไม่ได้ ลองเช็คการเชื่อมต่อแล้วลองใหม่นะ');
    });
  };
  btn.addEventListener('click', onFirstClick);
})();
