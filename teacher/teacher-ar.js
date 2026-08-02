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




/* ต่างจากโหมดเด็ก (ซ้าย=emoji เสมอ): คู่ของครูเป็นข้อความอิสระทั้งสองฝั่ง — เลือกสไตล์ตามเนื้อหาจริง
   emoji ล้วน → .ar-match-emoji (ตัวใหญ่), มีตัวอักษร/ตัวเลข → .ar-match-word (สไตล์ข้อความเดียวกับฝั่งขวา) */
function matchLabelClass(text){
  return /[\p{L}\p{N}]/u.test(text) ? 'ar-match-word' : 'ar-match-emoji';
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
    row.innerHTML = '<span class="'+matchLabelClass(it.e)+'">'+it.e+'</span><span class="ar-dot" data-side="left" data-key="'+i+'"></span>';
    leftCol.appendChild(row);
  });
  rightOrder.forEach(i=>{
    const it = items[i];
    const row = document.createElement('div');
    row.className = 'ar-match-item';
    row.dataset.key = i;
    row.innerHTML = '<span class="ar-dot" data-side="right" data-key="'+i+'"></span><span class="'+matchLabelClass(it.w)+'">'+it.w+'</span>';
    rightCol.appendChild(row);
  });

  leftCol.querySelectorAll('.ar-dot').forEach(wireMatchDot);
  rightCol.querySelectorAll('.ar-dot').forEach(wireMatchDot);
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
/* กันการ์ดหลุดออกนอกจอ — จำกัดจุดศูนย์กลางการ์ด (จุดอ้างอิงตอน dragging คือ left/top จริงเพราะใช้ translate(-50%,-50%))
   ไม่ให้เกินขอบจอ โดยเผื่อระยะครึ่งความกว้าง/สูงของการ์ดเองไว้เสมอ */
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


function matchMistakeFlash(dotA, dotB){
  arGame.mistakes++;
  playWrong();
  [dotA, dotB].forEach(d=>{ d.classList.add('wrong-flash'); setTimeout(()=>d.classList.remove('wrong-flash'), 450); });
  const cat = arCat();
  showARHint(cat.lang==='th' ? '🤔 ยังไม่ตรงกันนะ ลองโยงเส้นใหม่ดูสิ!' : '🤔 Not a match — try connecting a different line!');
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





/* count mode often has more items on screen than the other AR games (up to ~10), so instead of the
   generic sequential-band scatter (shared with sentence/math/match), lay them out on a grid: each item
   gets its own cell (no two items can ever share space) and only jitters a bit within that cell — this
   also lets it use more of the screen, closer to the left/right/bottom edges, without crowding or overlap */



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
  [setupView, homeView, manageView, builderView, quizView, listenView, memoryView, mixView, musicView, resultView].forEach(x=>{ x.hidden = true; });
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
