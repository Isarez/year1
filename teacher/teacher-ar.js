/* ============================================================
   โหมดคุณครู — AR engine (เฟส 2)
   port จาก js/app.js (เกม AR หน้าหลัก) โดยคง id/class/CSS เดิมทั้งหมด
   โหลดหลัง teacher.js (ใช้ playClick/playCorrect/playWrong/showToast/showView ฯลฯ ร่วมกัน)
   mechanic → mode: ar-pick→math (หยิบการ์ดคำตอบใส่ช่องเดียว),
   ar-sentence→sentence (เรียงการ์ดใส่ช่องตามลำดับ — ครอบทั้งเรียงคำ/ต่อประโยค), ar-connect→match (โยงเส้น)
   ============================================================ */
let arGame = null;             // {gameId, mech, level, mistakes, totalLevels, usedQIdx:Set, usedMatchKeys:Set, currentQ}
let arActive = false;          // hand-tracking running?
let arHands = null, arCamera = null, arStream = null, arRafId = null, arResizeHandler = null;
let arLandmarks = null;        // latest hand landmarks from onResults
let arHandSmooth = null;       // landmark (พิกัด pixel) ผ่าน temporal smoothing แล้ว — ลด jitter ให้มือ/cursor ขยับนุ่มขึ้น
let arWasPinching = false;
let arDraggingCard = null, arDragSource = null; // 'hand' | 'mouse'
let arDragLineFrom = null;     // {side, key, x, y, el} anchor dot for match-mode line drag
let _mpLoadPromise = null;
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
  const cat = arGame && arCat();
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
  const cat = arCat();
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
  [dotA, dotB].forEach(d=>{ d.classList.add('wrong-flash'); setTimeout(()=>d.classList.remove('wrong-flash'), 450); });
  const cat = arCat();
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
  const cat = arCat();
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
  const cat = arCat();
  showARHint(cat.mode==='math'
    ? '🎉 เก่งมาก! คำนวณถูกต้อง!'
    : cat.mode==='match'
      ? (cat.lang==='th' ? '🎉 เก่งมาก! โยงเส้นถูกต้องหมดเลย!' : '🎉 Great job! All lines matched correctly!')
      : cat.mode==='count'
        ? '🎉 เก่งมาก! หยิบของถูกต้องครบเลย!'
        : (cat.lang==='th' ? '🎉 เก่งมาก! ต่อประโยคถูกต้อง!' : '🎉 Great job! Sentence is correct!'));
  $('ar-progress-fill').style.width = (arGame.level/arGame.totalLevels*100)+'%';
  setTimeout(()=>{
    if(arGame.level >= arGame.totalLevels){ finishTeacherAR(); }
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

  const cat = arGame && arCat();
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


/* ============ glue: ผูก engine เข้ากับข้อมูลชุดโจทย์ของคุณครู ============ */

/* pseudo-cat แทน catById ของหน้าหลัก — mode/lang ที่ engine เดิมใช้ตัดสินพฤติกรรม */
function arCat(){
  const mech = arGame ? arGame.mech : 'ar-pick';
  const mode = mech==='ar-pick' ? 'math' : mech==='ar-connect' ? 'match' : mech==='ar-count' ? 'count' : 'sentence';
  return { mode, lang:'th' };
}
function arGameData(){ return games.find(g=>g.id===arGame.gameId); }
/* หยิบโจทย์ถัดไปจาก pool แบบไม่ซ้ำภายใน 1 รอบเล่น */
function nextArQuestion(){
  const game = arGameData();
  const idx = pickNoRepeatIdx(arGame.usedQIdx, game.questions.length);
  arGame.currentQ = game.questions[idx];
  return arGame.currentQ;
}

function buildLevel(){
  const cat = arCat();
  $('ar-math-problem').hidden = true;
  $('ar-slot-row').hidden = false;
  $('ar-match-wrap').hidden = true;
  $('ar-count-question').hidden = true;
  $('ar-count-zone').hidden = true;
  if(cat.mode==='math'){ buildPickLevel(); return; }
  if(cat.mode==='match'){ buildConnectLevel(); return; }
  if(cat.mode==='count'){ buildTeacherCountLevel(); return; }
  /* sentence: เรียงการ์ดใส่ช่องตามลำดับ (ครอบทั้งเรียงคำและต่อประโยค — mechanic เดียวกัน) */
  const qd = nextArQuestion();
  const words = qd.sentence.trim().split(/\s+/);
  const sentence = words.map(w=>({w, e:''}));
  renderSlotsAndCards(sentence);
  showARHint(isMobileViewport()
    ? '👆 แตะการ์ดแล้วลากไปเรียงในช่องให้ถูกลำดับนะ!'
    : '✋ จีบนิ้วหยิบการ์ด แล้วลากไปเรียงในช่องให้ถูกลำดับนะ!');
}

/* ar-pick: โชว์โจทย์ด้านบน กระจายการ์ดคำตอบ (ถูก 1 + ตัวลวงจากฟอร์ม) ให้หยิบใส่ช่องเดียว */
function buildPickLevel(){
  const qd = nextArQuestion();
  const problemEl = $('ar-math-problem');
  problemEl.hidden = false;
  problemEl.textContent = qd.q;
  const slotRow = $('ar-slot-row');
  slotRow.innerHTML = '';
  const s = document.createElement('div');
  s.className = 'ar-slot';
  s.dataset.slotIndex = 0;
  s.innerHTML = '<span class="ar-slot-ph">❓</span>';
  slotRow.appendChild(s);
  const order = shuffleArray(qd.answers.map((_,i)=>i));
  const cardsRow = $('ar-cards-row');
  cardsRow.innerHTML = '';
  const n = order.length;
  order.forEach((ansIdx, pos)=>{
    const card = document.createElement('div');
    card.className = 'ar-card';
    card.dataset.correctIndex = ansIdx===qd.correct ? 0 : -1;
    card.innerHTML = '<span class="ar-card-word">'+escapeHtml(qd.answers[ansIdx])+'</span>';
    placeCardAtScatterPos(card, pos, n);
    wireCardDrag(card);
    cardsRow.appendChild(card);
  });
  showARHint(isMobileViewport() ? '👆 แตะการ์ดคำตอบที่ถูกต้อง แล้วลากไปใส่ในช่องนะ!' : '✋ จีบนิ้วหยิบการ์ดคำตอบที่ถูกต้อง แล้วลากไปใส่ในช่องนะ!');
}

/* ar-connect: สุ่มคู่จาก pool ครั้งละไม่เกิน 4 คู่ (ไม่ซ้ำจนกว่าจะครบ pool) */
function buildConnectLevel(){
  $('ar-slot-row').hidden = true;
  $('ar-cards-row').innerHTML = '';
  $('ar-match-wrap').hidden = false;
  const game = arGameData();
  const pool = game.questions;
  const n = Math.min(4, pool.length);
  let availableIdx = pool.map((_,i)=>i).filter(i=>!arGame.usedMatchKeys.has(i));
  if(availableIdx.length < n){
    arGame.usedMatchKeys.clear();
    availableIdx = pool.map((_,i)=>i);
  }
  const chosenIdx = shuffleArray(availableIdx).slice(0, n);
  chosenIdx.forEach(i=>arGame.usedMatchKeys.add(i));
  const items = chosenIdx.map(i=>({e:escapeHtml(pool[i].left), w:escapeHtml(pool[i].right)}));
  renderMatchPairs(items, n);
  showARHint(isMobileViewport()
    ? '👆 แตะจุดวงกลมแล้วลากเส้นไปยังคำตอบที่ตรงกันนะ!'
    : '✋ แตะจุดวงกลมแล้วลากเส้นไปยังคำตอบที่ตรงกัน (จีบนิ้วถ้าอยากยกเลิก)');
}

/* ar-count: โจทย์จากฟอร์ม (ของที่ต้องหยิบ+จำนวน / ตัวหลอกหลายชนิด) แปลงเป็นรูปแบบ engine เดิม */
function buildTeacherCountLevel(){
  $('ar-slot-row').hidden = true;
  $('ar-count-question').hidden = false;
  $('ar-count-zone').hidden = false;
  const qd = nextArQuestion();
  const items = [{key:'target', emoji:qd.target.item, count:qd.target.count}]
    .concat((qd.decoys||[]).map((d,i)=>({key:'d'+i, emoji:d.item, count:d.count})));
  arGame.countQuestion = { q:qd.q, targetKey:'target', targetCount:qd.target.count, items };
  arGame.zoneCount = 0;
  arGame.zoneLocked = false;
  $('ar-count-question').textContent = qd.q;
  scatterCountItems(arGame.countQuestion); // resets โซนตะกร้า (รวม tally) ใหม่ทุกครั้ง
  showARHint(isMobileViewport()
    ? '👆 แตะของแล้วลากไปใส่ตะกร้าให้ครบตามโจทย์นะ!'
    : '✋ จีบนิ้วหยิบของแล้วลากไปใส่ตะกร้าให้ครบตามโจทย์นะ!');
}

/* ---- game flow ---- */
function startTeacherAR(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  stopARGame();
  lastPlay = { type:'ar', gameId };
  arGame = {
    gameId, mech: game.mechanic,
    level:1, mistakes:0,
    totalLevels: game.questionCount,
    usedQIdx: new Set(), usedMatchKeys: new Set(), currentQ: null
  };
  document.body.classList.add('ar-open');
  if(isMobileViewport()) document.body.classList.add('ar-mobile-nocam');
  $('ar-camera-toggle').hidden = isMobileViewport();
  const idx = games.indexOf(game);
  const [color] = CARD_COLORS[idx % CARD_COLORS.length];
  document.documentElement.style.setProperty('--cat-color', color);
  const arView = $('ar-view');
  [setupView, homeView, manageView, builderView, quizView, resultView].forEach(x=>{ x.hidden = true; });
  arView.hidden = false;
  arView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', color));
  $('ar-cat-label').innerHTML = '<img src="'+game.logo+'" alt="" style="width:24px;height:24px;vertical-align:-6px;margin-right:6px;">'+escapeHtml(game.title);
  renderARLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  initHandTracking();
}
function renderARLevel(){
  $('ar-level-counter').textContent = arGame.level+'/'+arGame.totalLevels;
  $('ar-progress-fill').style.width = ((arGame.level-1)/arGame.totalLevels*100)+'%';
  buildLevel();
}
function finishTeacherAR(){
  const mistakes = arGame.mistakes;
  const totalLevels = arGame.totalLevels;
  const mechName = (MECHANICS.find(m=>m.id===arGame.mech)||{}).name || '';
  stopARGame();
  $('ar-view').hidden = true;
  showView(resultView);
  /* เกณฑ์ดาวจาก mistakes เดียวกับเกม AR หน้าหลัก */
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? 'สุดยอดไปเลย!' : stars===2 ? 'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ!';
  const starsRow = $('stars-row');
  starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent='⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{
    setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220);
  });
  $('score-line').textContent = 'เล่น'+mechName+'ครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? 'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';
  $('review-wrap').hidden = true;
  if(stars>=2) setTimeout(()=>playCongrats(), 250);
}

$('ar-back').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  $('ar-view').hidden = true;
  renderTeacherHome();
});
$('ar-camera-toggle').addEventListener('click', ()=>{
  playClick();
  if(arActive){ stopCameraOnly(); updateCameraToggleBtn(); }
  else { initHandTracking().then(updateCameraToggleBtn); }
});
/* ปุ่มเต็มจอใน AR view — logic เดียวกับปุ่ม header */
const arFsBtn = $('ar-fullscreen-toggle');
function refreshArFsBtn(){ arFsBtn.innerHTML = document.fullscreenElement ? SVG_COMPRESS : SVG_EXPAND; }
arFsBtn.addEventListener('click', ()=>{
  playClick();
  if(document.fullscreenElement){ document.exitFullscreen(); }
  else if(document.documentElement.requestFullscreen){ document.documentElement.requestFullscreen(); }
});
document.addEventListener('fullscreenchange', refreshArFsBtn);
refreshArFsBtn();
