/* ================================================================================
   เกมฝึกคิด: จับคู่โดมิโน (memory), ทายเงา (shadow),
   นกฮูกสั่ง (ef — executive function), นักวิทย์ทายผล (science predict-check ใช้กล้อง)
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= MEMORY MATCHING GAME (จับคู่โดมิโน) ============================= */
function startMemoryGame(catId){
  stopARGame();
  lastGameType = 'memory'; lastCatId = catId;
  const cat = catById(catId);
  memoryGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, matchedCount:0, totalPairs:0, openNumber:null, openDot:null, locked:false };
  showOnlyView(memoryView);
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
  4:['tl','tr','bl','br'], 5:['tl','tr','c','bl','br'], 6:['tl','ml','bl','tr','mr','br'],
  /* 7-8 จุด/ครึ่ง (สำหรับค่าโดมิโนถึง 16 = 8+8 ในเกมโดมิโน ป.2) — ใช้แถวกลาง tc/bc เพิ่ม */
  7:['tl','tr','ml','c','mr','bl','br'], 8:['tl','tc','tr','ml','mr','bl','bc','br']
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
  if(!memoryGame) return;
  /* 🛟 การ์ดเควสต์ถูกปิดกลางคัน = `stop()` ล้าง state ทิ้งไปแล้ว แต่ setTimeout เลื่อนด่าน
     ที่ตั้งไว้ก่อนหน้ายังยิงตามมา ⇒ ต้องกันไว้ ไม่งั้นอ่าน property ของ null แล้วพัง */
  const cat = catById(memoryGame.catId);
  const pairCount = (cat.memoryPairs || MEMORY_LEVEL_PAIRS)[memoryGame.level-1];
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

  /* pool = 1..maxVal (maxVal = จำนวนคู่มากสุดของหมวดนี้) — โดมิโน ป.2 ถึง 16 คู่ (ค่า 1-16) */
  const pairsArr = cat.memoryPairs || MEMORY_LEVEL_PAIRS;
  const maxVal = Math.max.apply(null, pairsArr);
  const pool = Array.from({length:maxVal}, (_,i)=>i+1);
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
  if(!memoryGame) return;
  /* 🛟 ผลลัพธ์มาถึงหลังการ์ดถูกปิดไปแล้ว (setTimeout ค้าง) ⇒ state ถูกล้างแล้ว จบเงียบๆ */
  /* ⭐ ส่งผลกลับโฮสต์ก่อนเสมอ ถ้ากำลังถูกยืมไปเล่นในการ์ดเควสต์ (ดู reportGameResult ใน js/app-core.js) */
  if(reportGameResult(memoryGame.catId, memoryGame.mistakes | 0, memoryGame.totalLevels, 'จับคู่')) return;
  const cat = catById(memoryGame.catId);
  const totalLevels = memoryGame.totalLevels;
  showOnlyView(resultView);

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
  showOnlyView(homeView);
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
  showOnlyView(shadowView);
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
  if(!shadowGame) return;
  /* 🛟 การ์ดเควสต์ถูกปิดกลางคัน = `stop()` ล้าง state ทิ้งไปแล้ว แต่ setTimeout เลื่อนด่าน
     ที่ตั้งไว้ก่อนหน้ายังยิงตามมา ⇒ ต้องกันไว้ ไม่งั้นอ่าน property ของ null แล้วพัง
     (บั๊กจริงที่จับได้ตอนรีวิว 2026-08-17: ตอบข้อแล้วปิดการ์ดทันที เกมทายเงา throw) */
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
  /* 🔒 **เกมทายเงาต้องใช้ emoji ล้วนทั้งเกม ห้ามใช้ไอคอน SVG** (ผู้ใช้สั่ง 2026-08-22)
     เคยแปลงเฉพาะ "ตัวเงา" เป็น SVG (รอบไอคอน 2026-08-20) แต่ **ปุ่มคำตอบยังเป็น emoji**
     เพราะข้อความบนปุ่มคือเฉลยที่ระบบใช้เทียบคำตอบ (ห้ามแตะ)
     ⇒ เงาเป็นทรงหนึ่ง คำตอบเป็นอีกทรงหนึ่ง เด็กเทียบไม่ได้ = เกมพัง
     ⚠ กติกาไอคอนของโปรเจกต์ (อะไรที่ต้องมีไอคอนให้วาด SVG) **ยกเว้นเกมนี้**
       เพราะที่นี่ "รูปคำถาม" กับ "รูปคำตอบ" ต้องเป็นของชุดเดียวกันเป๊ะเท่านั้นถึงจะเล่นได้ */
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
  if(!shadowGame) return;
  /* 🛟 การ์ดเควสต์ถูกปิดกลางคัน = `stop()` ล้าง state ทิ้งไปแล้ว แต่ setTimeout เลื่อนด่าน
     ที่ตั้งไว้ก่อนหน้ายังยิงตามมา ⇒ ต้องกันไว้ ไม่งั้นอ่าน property ของ null แล้วพัง */
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
  /* 🔒 emoji ล้วนเช่นกัน — เหตุผลเดียวกับด่านเงาเดี่ยว (ดูหมายเหตุที่ renderShadowLevel) */
  prompt.innerHTML = ansItems.map(x=>'<span class="sp-i"></span>').join('');
  ansItems.forEach((x, i)=>{ prompt.children[i].textContent = x.e; });
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
  if(!shadowGame) return;
  /* 🛟 ผลลัพธ์มาถึงหลังการ์ดถูกปิดไปแล้ว (setTimeout ค้าง) ⇒ state ถูกล้างแล้ว จบเงียบๆ */
  /* ⭐ ส่งผลกลับโฮสต์ก่อนเสมอ ถ้ากำลังถูกยืมไปเล่นในการ์ดเควสต์ (ดู reportGameResult ใน js/app-core.js) */
  if(reportGameResult(shadowGame.catId, shadowGame.mistakes, shadowGame.totalLevels, 'ทายเงา')) return;
  const cat = catById(shadowGame.catId);
  const mistakes = shadowGame.mistakes;
  const totalLevels = shadowGame.totalLevels;
  showOnlyView(resultView);

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
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= EF GAME ("นกฮูกสั่ง" — Phase 1.2 executive function)
   ฝึก inhibitory control (แตะเฉพาะของที่ตรงกติกา ห้ามแตะของอื่น) + cognitive flexibility (กติกาสลับกลางเกมที่ด่าน 6)
   + มีตัวจับเวลาต่อด่าน (หมดเวลานับเป็น "ไม่แตะ") — mechanic ใหม่ reuse ได้กับชั้น/วิชาอื่นผ่าน EF_CATEGORIES ============================= */
let efGame = null;
let efTimer = null;
/* 🏠 ปิดตัวจับเวลาตอนถูก mount ไปเล่นในโหมดบ้าน (กติกาเหล็กข้อ 2: ห้ามกดดัน/ลงโทษ)
   ตั้ง/ล้างที่ js/house-games.js จุดเดียว — หน้าหลักไม่เคยแตะค่านี้ จับเวลาเหมือนเดิมทุกประการ */
let EF_NO_TIMER = false;
window.setEfNoTimer = v => { EF_NO_TIMER = !!v; if(!v) return; clearTimeout(efTimer); efTimer = null; };
const EF_ROUND_MS = 4500;   // เวลาต่อด่าน
const EF_SWITCH_AT = 6;     // ด่านที่กติกาเปลี่ยน (cognitive flexibility)
/* ป.5-6: เวลาสั้นลง เปลี่ยนกติกาเร็วขึ้น และ ป.6 มีกติกาปฏิเสธ ("แตะทุกอย่างที่ไม่ใช่ ...")
   ซึ่งต้องยับยั้งความเคยชินมากกว่าเดิม (inhibitory control ระดับสูงขึ้น) */
function efRoundMs(hard){ return hard==='p6' ? 2600 : (hard==='p5' ? 3300 : EF_ROUND_MS); }
/* ✋ **เปิดกล้องเล่นด้วยท่ามือ = ต้องยืดเวลาต่อด่าน** (ผู้ใช้แจ้ง 2026-08-17)
   ตอบด้วยท่าต้อง "ค้างท่าไว้ 2 วินาที" (HP_POSE_MS ใน js/games-ar.js) ⇒ เวลาด่านที่เหลือให้คิด
   เหลือแค่ 2.5 วิ สำหรับ ป.1-4 และ **ติดลบ** สำหรับ ป.6 (ด่านสั้น 2.6 วิ สั้นกว่าเวลาค้างท่า)
   ⇒ ถ้าไม่ยืด เด็กจะแบมือค้างจนหมดเวลาทุกด่านโดยไม่มีทางตอบทัน = ท่ามือ "ใช้ไม่ได้จริง"
   ⚠ ยืดเฉพาะตอนกล้องติดจริง — เล่นด้วยนิ้วยังจับเวลาเท่าเดิมทุกประการ (กติกาเดิมของหน้าหลัก) */
function efHandBonusMs(){ return (window.isHandPoseLive && window.isHandPoseLive()) ? 3000 : 0; }
function efSwitchAt(hard){ return hard==='p6' ? 4 : (hard==='p5' ? 5 : EF_SWITCH_AT); }
function efNegateFrom(hard){ return hard==='p6' ? 7 : (hard==='p5' ? 9 : 99); }

function startEfGame(catId){
  stopARGame();
  clearTimeout(efTimer); efTimer = null;
  lastGameType = 'ef'; lastCatId = catId;
  const cat = catById(catId);
  const keys = shuffleArray(Object.keys(EF_CATEGORIES).slice());
  efGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), ruleA:keys[0], ruleB:keys[1], curRule:keys[0], negate:false, answered:false };
  showOnlyView(efView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  efView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('ef-cat-label', cat);
  renderEfRound(true);
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

function renderEfRound(first){
  if(!efGame) return;
  /* 🛟 การ์ดเควสต์ถูกปิดกลางคัน = `stop()` ล้าง state ทิ้งไปแล้ว แต่ setTimeout เลื่อนด่าน
     ที่ตั้งไว้ก่อนหน้ายังยิงตามมา ⇒ ต้องกันไว้ ไม่งั้นอ่าน property ของ null แล้วพัง */
  const g = efGame;
  clearTimeout(efTimer);
  g.answered = false;
  const switchAt = efSwitchAt(g.hard);
  const ruleKey = g.level < switchAt ? g.ruleA : g.ruleB;
  const switched = !first && g.level === switchAt;
  g.curRule = ruleKey;
  const ruleCat = EF_CATEGORIES[ruleKey];
  g.negate = g.level >= efNegateFrom(g.hard);
  /* ~55% เป็นรอบที่ "ต้องแตะ" ที่เหลือคือรอบที่ต้องยับยั้งไม่แตะ */
  const shouldTap = Math.random() < 0.55;
  const others = Object.keys(EF_CATEGORIES).filter(k=>k!==ruleKey);
  /* กติกาปกติ: แตะเมื่อของตรงหมวด | กติกาปฏิเสธ: แตะเมื่อของ "ไม่ใช่" หมวดนั้น */
  const fromRule = g.negate ? !shouldTap : shouldTap;
  const fromKey = fromRule ? ruleKey : others[Math.floor(Math.random()*others.length)];
  const pool = EF_CATEGORIES[fromKey].items;
  g.item = pool[Math.floor(Math.random()*pool.length)];
  g.shouldTap = shouldTap;

  $('ef-rule').innerHTML = g.negate
    ? '🦉 นกฮูกสั่ง: แตะทุกอย่างที่ <b>ไม่ใช่'+ruleCat.name+' '+ruleCat.items[0]+'</b>'
    : '🦉 นกฮูกสั่ง: แตะเฉพาะ <b>'+ruleCat.name+' '+ruleCat.items[0]+'</b>';
  const itemEl = $('ef-item');
  /* 🔒 **emoji ล้วน ห้ามใช้ไอคอน SVG** (ผู้ใช้สั่ง 2026-08-22 · เหตุผลเดียวกับเกมทายเงา)
     บรรทัดกติกาข้างบนโชว์ตัวอย่างของหมวดเป็น emoji ("แตะเฉพาะ **ผลไม้ 🍎**")
     ถ้าของกลางจอเป็น SVG แต่ตัวอย่างในกติกาเป็น emoji ⇒ **คนละทรงกัน** เด็กเทียบไม่ได้
     ⇒ ที่ไหนที่ "โจทย์" กับ "คำตอบ/ตัวอย่าง" ต้องเป็นของชุดเดียวกัน ให้ใช้ emoji ทั้งคู่ */
  itemEl.textContent = g.item;
  itemEl.classList.remove('ef-correct','ef-wrong');
  $('ef-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('ef-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('ef-feedback').textContent = '';
  $('ef-tap-btn').disabled = false; $('ef-skip-btn').disabled = false;
  /* ✋ ล้างท่ามือที่ค้างจากด่านก่อน — ไม่งั้นเด็กต้องเอามือออกนอกกล้องก่อนถึงจะตอบด่านใหม่ได้
     (ตัวล็อกกันยิงรัวใน hpPoseTick จะปลดก็ต่อเมื่อ "เปลี่ยนท่า" เท่านั้น) */
  if(window.resetHandPose) window.resetHandPose();

  if(switched){ showToast('🔄','เปลี่ยนกติกาแล้ว! ตอนนี้แตะเฉพาะ '+ruleCat.name+' '+ruleCat.items[0]); flashEfRule(); }
  if(g.negate && g.level === efNegateFrom(g.hard) && !first){ showToast('🙃','กติกาพลิก! ตอนนี้ต้องแตะทุกอย่างที่ไม่ใช่'+ruleCat.name); flashEfRule(); }

  /* ตัวจับเวลา: แถบหดจาก 100% → 0% ตาม EF_ROUND_MS, หมดเวลา = นับเป็น "ไม่แตะ"
     ⚠ **โหมดบ้านปิดตัวจับเวลาทิ้ง** (`EF_NO_TIMER`) — กติกาเหล็กข้อ 2 ของโหมดนั้นห้ามกดดัน/ลงโทษ
       ทำแบบเดียวกับที่เฟส 7 ตัดจับเวลาออกจาก traffic/flashcount · หน้าหลักยังจับเวลาเหมือนเดิมทุกอย่าง */
  const bar = $('ef-timer-fill');
  bar.style.transition = 'none';
  if(EF_NO_TIMER){
    bar.style.width = '100%';          /* ค้างเต็มหลอดไว้ ไม่หด — ไม่ซ่อนทิ้งเพราะ layout จะกระตุก */
    return;
  }
  bar.style.width = '100%'; void bar.offsetWidth;
  const roundMs = efRoundMs(g.hard) + efHandBonusMs();
  bar.style.transition = 'width '+roundMs+'ms linear'; bar.style.width = '0%';
  efTimer = setTimeout(()=>{ if(!g.answered) efAnswer(null); }, roundMs);
}

/* 📷 เด็กกดเปิด/ปิดกล้องกลางด่าน = ตั้งเวลาด่านนี้ใหม่ทันที ไม่ต้องรอด่านหน้า
   (ปุ่มกล้องอยู่ในเกม ⇒ ด่านแรกเริ่มนับไปแล้วเสมอตอนเด็กกดเปิด — ถ้าไม่ตั้งใหม่
    ด่านแรกจะหมดเวลาก่อนค้างท่าครบ 2 วิ ทุกครั้ง) · เรียกจาก js/games-ar.js
   ⚠ ไม่แตะอะไรเลยถ้าด่านนี้ตอบไปแล้ว/ปิดจับเวลาอยู่ (โหมดบ้าน)/ไม่ได้อยู่ในเกม ef */
window.efRefreshTimer = function(){
  const g = efGame;
  if(!g || g.answered || EF_NO_TIMER || !efTimer) return;
  clearTimeout(efTimer); efTimer = null;
  const bar = $('ef-timer-fill');
  bar.style.transition = 'none'; bar.style.width = '100%'; void bar.offsetWidth;
  const roundMs = efRoundMs(g.hard) + efHandBonusMs();
  bar.style.transition = 'width '+roundMs+'ms linear'; bar.style.width = '0%';
  efTimer = setTimeout(()=>{ if(!g.answered) efAnswer(null); }, roundMs);
};

function flashEfRule(){
  const el = $('ef-rule');
  el.classList.remove('ef-rule-flash'); void el.offsetWidth; el.classList.add('ef-rule-flash');
}

/* tapped: true = กด "แตะ", false = กด "ไม่แตะ", null = หมดเวลา (นับเป็นไม่แตะ) */
function efAnswer(tapped){
  const g = efGame;
  if(!g || g.answered) return;
  g.answered = true;
  clearTimeout(efTimer); efTimer = null;
  $('ef-timer-fill').style.transition = 'none';
  $('ef-tap-btn').disabled = true; $('ef-skip-btn').disabled = true;
  const correct = (tapped===true) === g.shouldTap;
  const itemEl = $('ef-item');
  if(correct){
    playCorrect(); mascotHappy();
    itemEl.classList.add('ef-correct');
    $('ef-feedback').textContent = g.shouldTap ? '✅ ถูกต้อง! แตะได้เลย' : '✅ เก่งมาก! อันนี้ไม่ต้องแตะ';
  } else {
    g.mistakes++;
    playWrong();
    itemEl.classList.add('ef-wrong');
    $('ef-feedback').textContent = tapped===null ? '⏰ หมดเวลา! อันนี้ต้องแตะนะ'
      : (g.shouldTap ? '❌ อันนี้ต้องแตะจ้ะ' : '❌ อันนี้ไม่ใช่ ห้ามแตะนะ');
  }
  $('ef-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    if(g.level >= g.totalLevels){ finishEfGame(); }
    else { g.level++; renderEfRound(false); }
  }, correct ? 900 : 1500);
}

function finishEfGame(){
  if(!efGame) return;
  /* 🛟 ผลลัพธ์มาถึงหลังการ์ดถูกปิดไปแล้ว (setTimeout ค้าง) ⇒ state ถูกล้างแล้ว จบเงียบๆ */
  clearTimeout(efTimer); efTimer = null;
  /* ⭐ ส่งผลกลับโฮสต์ก่อนเสมอ (ล้างตัวจับเวลาไปแล้วข้างบน จะได้ไม่มีอะไรค้างทำงานต่อ) */
  if(reportGameResult(efGame.catId, efGame.mistakes, efGame.totalLevels, 'ทำตามนกฮูกสั่ง')) return;
  const cat = catById(efGame.catId);
  const mistakes = efGame.mistakes;
  const totalLevels = efGame.totalLevels;
  showOnlyView(resultView);
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();
  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row'); starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s=document.createElement('span'); s.textContent='⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });
  $('score-line').textContent = 'ทำตามนกฮูกสั่งครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'ตั้งใจฟังกติกาสุดๆ ไม่พลาดเลย!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'!' : 'ไม่เป็นไรนะ ลองอีกครั้งเก็บดาวเพิ่ม!';
  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){ stickerBlock.hidden=false; setStickerEarned(cat); pendingSticker=cat.id; setTimeout(()=>{ burstCenterTop(40); playCongrats(); },250); setTimeout(()=>showOwlMsg('sticker'),400); }
  else { stickerBlock.hidden=true; if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'),400);} if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); },250); }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('ef-tap-btn').addEventListener('click', ()=>{ if(efGame && !efGame.answered){ playClick(); efAnswer(true); } });
$('ef-skip-btn').addEventListener('click', ()=>{ if(efGame && !efGame.answered){ playClick(); efAnswer(false); } });
$('ef-back').addEventListener('click', ()=>{
  playClick(); clearTimeout(efTimer); efTimer=null;
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= SCIENCE PREDICT-CHECK AR ("นักวิทย์ทายผล" — Phase 1.4)
   เด็กทายก่อนว่าจะเกิดอะไร (ลอย/จม, แม่เหล็กดูด/ไม่ดูด ฯลฯ) แล้วดูผลจริง + เหตุผลสั้นๆ
   กลไก AR: แบ่งครึ่งจอ ซ้าย=คำตอบ 1 / ขวา=คำตอบ 2 — "แบมือค้าง" ฝั่งไหนครบ 2 วิ = เลือกข้อนั้น
   ใช้กล้อง+MediaPipe (reuse loadMediaPipeScripts/drawCartoonHand) แยก state จากเกม AR เดิม
   มือถือ/กล้องพัง = fallback แตะฝั่งคำตอบ — engine อ่านคลัง SCIENCE_POOLS/SCIENCE_KINDS ============================= */
let sciGame = null;
let sciTimer = null;
/* กล้อง/มือ ของเกมวิทย์ (แยกจาก arCam/arHands เพื่อไม่ชนกับ ar-view) */
let sciCam = null, sciHands = null, sciStream = null;
let sciLandmarks = null;      // array ของมือ (multiHandLandmarks) — รับได้ 2 มือ
let sciHandedness = null;     // array ของ handedness ('Left'/'Right') คู่กับ sciLandmarks
let sciRaf = null, sciActive = false, sciHandSmooth = [], sciResize = null;
let sciDwell = { side:-1, elapsed:0, last:0 };
const SCI_DWELL_MS = 2000;
const SCI_RING_CIRC = 327;   // 2*pi*52 ปัดเศษ (ต้องตรงกับ r ใน .sci-ring)
/* เราส่ง video ดิบ (ไม่ flip) ให้ MediaPipe แต่วาด/แสดงแบบ mirror (selfie) — MediaPipe ตัดสิน
   handedness โดยสมมติว่าภาพ mirror แล้ว ค่า label จึงต้องสลับเพื่อให้ตรง "มือจริง" ของเด็ก
   (ถ้าทดสอบบนกล้องจริงแล้วซ้าย/ขวากลับด้าน ให้สลับค่าคงที่นี้เป็น false ที่เดียวจบ) */
const SCI_SWAP_HANDEDNESS = true;

function startScienceGame(catId){
  stopARGame();
  clearTimeout(sciTimer); sciTimer = null;
  lastGameType = 'science'; lastCatId = catId;
  const cat = catById(catId);
  const pool = (SCIENCE_POOLS[cat.sciSet] || SCIENCE_FLOAT).slice();
  const items = shuffleArray(pool).slice(0, cat.levels);
  sciGame = { catId, level:1, mistakes:0, totalLevels:items.length, items, answered:false };
  showOnlyView(sciView);
  document.body.classList.add('sci-open');
  document.body.classList.remove('sci-nocam');
  document.documentElement.style.setProperty('--cat-color', cat.color);
  sciView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  sciView.querySelectorAll('.sci-ring-fill').forEach(c=>{ c.style.strokeDasharray = SCI_RING_CIRC; c.style.strokeDashoffset = SCI_RING_CIRC; });
  setCatLabel('sci-cat-label', cat);
  /* โชว์ปุ่มกล้องบนเดสก์ท็อปเสมอ (มือถือซ่อน) ให้แถบบนตรงกับเกม AR อื่น */
  const sciCamBtn = $('sci-camera-toggle'); if(sciCamBtn) sciCamBtn.hidden = isMobileViewport();
  sciActive = false; sciUpdateCamBtn();
  sciResetDwell();
  renderSciRound();
  window.scrollTo({top:0, behavior:'smooth'});
  sciInitCamera();
  setTimeout(()=>showOwlMsg('start'), 600);
}

/* ---- กล้อง/มือ ---- */
async function sciInitCamera(){
  const toggle = $('sci-camera-toggle');
  if(isMobileViewport()){
    document.body.classList.add('sci-nocam');
    $('sci-hint').textContent = '👆 แตะฝั่งคำตอบที่เลือกได้เลย';
    if(toggle) toggle.hidden = true;
    sciActive = false;
    return;
  }
  try{
    await loadMediaPipeScripts();
    const video = $('sci-video');
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ width:480, height:360, facingMode:'user' }, audio:false });
    /* กันกล้องรั่ว: ถ้าเด็กออกจากเกมก่อนกดอนุญาต (view ถูกซ่อนไปแล้ว) ให้ปิด stream ทิ้งเลย */
    if(sciView.hidden){ stream.getTracks().forEach(t=>t.stop()); return; }
    sciStream = stream; video.srcObject = stream; await video.play().catch(()=>{});
    const canvas = $('sci-canvas');
    sciResize = ()=>{ canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    sciResize(); window.addEventListener('resize', sciResize);
    sciHands = new Hands({ locateFile:(f)=>'js/vendor/mediapipe/hands/'+f });
    sciHands.setOptions({ maxNumHands:2, modelComplexity:0, minDetectionConfidence:0.6, minTrackingConfidence:0.5 });
    sciHands.onResults(res=>{
      sciLandmarks = (res.multiHandLandmarks && res.multiHandLandmarks.length) ? res.multiHandLandmarks : null;
      sciHandedness = res.multiHandedness || null;
    });
    sciCam = new Camera(video, { onFrame: async ()=>{ if(sciHands){ await sciHands.send({ image:video }); } }, width:480, height:360 });
    await sciCam.start();
    sciActive = true;
    document.body.classList.remove('sci-nocam');
    $('sci-hint').textContent = '✋ มือซ้าย = ฝั่งซ้าย · 🤚 มือขวา = ฝั่งขวา · แบมือค้าง 2 วิ';
    if(toggle) toggle.hidden = false;
    sciUpdateCamBtn();
    sciRaf = requestAnimationFrame(sciDrawLoop);
  }catch(err){
    console.warn('science AR camera unavailable, tap fallback:', err);
    document.body.classList.add('sci-nocam');
    $('sci-hint').textContent = '👆 แตะฝั่งคำตอบที่เลือกได้เลย';
    /* เดสก์ท็อป: คงปุ่มกล้องไว้ (โชว์สถานะปิด/กดลองเปิดใหม่ได้) เหมือนเกม AR — ซ่อนเฉพาะมือถือ */
    if(toggle) toggle.hidden = isMobileViewport();
    sciActive = false; sciUpdateCamBtn();
  }
}

function sciStopCamera(){
  sciActive = false; sciLandmarks = null; sciHandedness = null; sciHandSmooth = [];
  if(sciRaf){ cancelAnimationFrame(sciRaf); sciRaf = null; }
  if(sciCam){ try{ sciCam.stop(); }catch(e){} sciCam = null; }
  if(sciStream){ sciStream.getTracks().forEach(t=>t.stop()); sciStream = null; }
  if(sciResize){ window.removeEventListener('resize', sciResize); sciResize = null; }
  sciHands = null;
  const cv = $('sci-canvas'); if(cv){ const c = cv.getContext('2d'); if(c) c.clearRect(0,0,cv.width,cv.height); }
  sciResetDwell();
}

function sciUpdateCamBtn(){
  const btn = $('sci-camera-toggle'); if(!btn) return;
  const label = sciActive ? 'ปิดกล้อง' : 'เปิดกล้อง';
  btn.classList.toggle('muted', !sciActive);   // .mute-stripe โผล่ตอนปิด (ธีมเดียวกับปุ่มกล้อง AR)
  btn.setAttribute('aria-label', label);
  btn.dataset.tooltip = label;
}

/* แบมือ = ปลายนิ้ว 8/12/16/20 อยู่เหนือข้อ 6/10/14/18 (y น้อยกว่า) อย่างน้อย 3 นิ้ว */
function sciPalmOpen(pts){
  let ext = 0;
  [[8,6],[12,10],[16,14],[20,18]].forEach(([t,p])=>{ if(pts[t].y < pts[p].y - 8) ext++; });
  return ext >= 3;
}
/* แปลง label ของ MediaPipe เป็น "มือจริง" ของเด็ก ('left'/'right') — สลับตาม SCI_SWAP_HANDEDNESS */
function sciTrueHand(label){
  if(!label) return null;
  const isLeftLabel = label === 'Left';
  const physicalLeft = SCI_SWAP_HANDEDNESS ? !isLeftLabel : isLeftLabel;
  return physicalLeft ? 'left' : 'right';
}

function sciResetDwell(){
  if(sciDwell.side!==-1 || sciDwell.elapsed!==0){ sciDwell.side=-1; sciDwell.elapsed=0; sciUpdateRings(-1,0); }
}
function sciTickDwell(side, open){
  const now = performance.now();
  if(side !== sciDwell.side){ sciDwell.side = side; sciDwell.elapsed = 0; sciDwell.last = now; }
  if(open){ sciDwell.elapsed += now - sciDwell.last; }
  sciDwell.last = now;
  const prog = Math.min(1, sciDwell.elapsed / SCI_DWELL_MS);
  sciUpdateRings(side, prog);
  if(prog >= 1){ sciResetDwell(); sciSelect(side); }
}
function sciUpdateRings(activeSide, prog){
  for(let i=0;i<2;i++){
    const zone = $('sci-zone-'+i); if(!zone) continue;
    const active = (i===activeSide);
    zone.classList.toggle('dwelling', active && prog>0);
    const fill = zone.querySelector('.sci-ring-fill');
    if(fill) fill.style.strokeDashoffset = active ? SCI_RING_CIRC*(1-prog) : SCI_RING_CIRC;
  }
}

function sciDrawLoop(){
  if(!sciActive) return;
  const canvas = $('sci-canvas'); const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const hands = sciLandmarks || [];
  /* zone ที่มี "มือถูกข้าง อยู่ฝั่งถูก" อยู่ (present) และที่แบมือด้วย (open)
     กติกา: มือซ้ายจริงต้องอยู่ฝั่งซ้าย(zone 0), มือขวาจริงต้องอยู่ฝั่งขวา(zone 1) */
  const openZones = [], presentZones = [];
  hands.forEach((lm, hi)=>{
    const raw = lm.map(p=>({ x:(1-p.x)*canvas.width, y:p.y*canvas.height }));
    if(!sciHandSmooth[hi] || sciHandSmooth[hi].length !== raw.length) sciHandSmooth[hi] = raw;
    else sciHandSmooth[hi] = sciHandSmooth[hi].map((p,i)=>({ x:p.x+(raw[i].x-p.x)*0.5, y:p.y+(raw[i].y-p.y)*0.5 }));
    const hpts = sciHandSmooth[hi];
    drawCartoonHand(ctx, hpts);
    if(sciGame && !sciGame.answered){
      const side = hpts[9].x < canvas.width*0.5 ? 0 : 1;         // ฝั่งที่มืออยู่บนจอ (พิกัดกระจก)
      const wantHand = side === 0 ? 'left' : 'right';           // ฝั่งซ้ายอยากได้มือซ้าย, ฝั่งขวาอยากได้มือขวา
      const trueHand = sciTrueHand(sciHandedness && sciHandedness[hi] ? sciHandedness[hi].label : null);
      if(trueHand === wantHand){                                 // มือถูกข้าง + อยู่ฝั่งถูก
        presentZones.push(side);
        if(sciPalmOpen(hpts)) openZones.push(side);
      }
    }
  });
  sciHandSmooth.length = hands.length;   // ตัด smoothing ของมือที่หายไป
  if(sciGame && !sciGame.answered){
    if(openZones.length === 1){ sciTickDwell(openZones[0], true); }
    else if(presentZones.length === 1 && presentZones[0] === sciDwell.side && sciDwell.side !== -1){ sciTickDwell(sciDwell.side, false); }
    else { sciResetDwell(); }
  }
  sciRaf = requestAnimationFrame(sciDrawLoop);
}

/* ---- รอบเกม ---- */
function renderSciRound(){
  if(!sciGame) return;
  /* 🛟 การ์ดเควสต์ถูกปิดกลางคัน = `stop()` ล้าง state ทิ้งไปแล้ว แต่ setTimeout เลื่อนด่าน
     ที่ตั้งไว้ก่อนหน้ายังยิงตามมา ⇒ ต้องกันไว้ ไม่งั้นอ่าน property ของ null แล้วพัง */
  const g = sciGame;
  clearTimeout(sciTimer);
  g.answered = false;
  sciResetDwell();
  const it = g.items[g.level-1];
  const kind = SCIENCE_KINDS[it.kind];
  g.cur = it; g.kind = kind;
  $('sci-question').textContent = it.q;
  $('sci-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('sci-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  const obj = $('sci-obj'); obj.textContent = it.obj; obj.className = 'sci-obj'; obj.setAttribute('data-reveal','');
  const fb = $('sci-feedback'); fb.textContent=''; fb.className='sci-feedback';
  kind.choices.forEach((ch,i)=>{
    const zone = $('sci-zone-'+i);
    zone.disabled = false;
    zone.className = 'sci-zone ' + (i===0?'sci-zone-left':'sci-zone-right');
    zone.dataset.key = ch.k;
    $('sci-zone-'+i+'-emoji').textContent = ch.e;
    $('sci-zone-'+i+'-lbl').textContent = ch.l;
    const chk = zone.querySelector('.sci-zone-check'); if(chk) chk.remove();
    const fill = zone.querySelector('.sci-ring-fill'); if(fill) fill.style.strokeDashoffset = SCI_RING_CIRC;
  });
}

function sciSelect(idx){
  const g = sciGame;
  if(!g || g.answered) return;
  g.answered = true;
  sciResetDwell();
  const it = g.cur, kind = g.kind;
  const correctIdx = kind.choices.findIndex(c=>c.k===it.ans);
  const correct = idx === correctIdx;
  for(let i=0;i<2;i++){
    const zone = $('sci-zone-'+i); zone.disabled = true; zone.classList.remove('dwelling');
    const fill = zone.querySelector('.sci-ring-fill'); if(fill) fill.style.strokeDashoffset = SCI_RING_CIRC;
  }
  const correctZone = $('sci-zone-'+correctIdx);
  correctZone.classList.add('sci-correct');
  const chk = document.createElement('span'); chk.className='sci-zone-check'; chk.textContent='✅'; correctZone.appendChild(chk);
  if(!correct){
    const wz = $('sci-zone-'+idx); wz.classList.add('sci-wrong');
    const x = document.createElement('span'); x.className='sci-zone-check'; x.textContent='❌'; wz.appendChild(x);
  }
  const obj = $('sci-obj'); obj.setAttribute('data-reveal', it.ans);
  if(kind.stage==='water') obj.classList.add(it.ans==='float' ? 'sci-float' : 'sci-sink');
  else obj.classList.add('sci-pop');
  const fb = $('sci-feedback');
  if(correct){
    playCorrect(); mascotHappy();
    fb.className = 'sci-feedback sci-fb-ok show';
    fb.innerHTML = '🎉 ทายถูก! '+it.why;
    burstCenterTop(24);
  } else {
    g.mistakes++;
    playWrong();
    fb.className = 'sci-feedback sci-fb-no show';
    fb.innerHTML = '🔎 ลองดูนะ — '+it.why;
  }
  $('sci-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  clearTimeout(sciTimer);
  sciTimer = setTimeout(()=>{
    if(g.level >= g.totalLevels){ finishScienceGame(); }
    else { g.level++; renderSciRound(); }
  }, correct ? 2000 : 2700);
}

/* ปุ่มโซนซ้าย/ขวา — แตะเลือกได้ (fallback มือถือ/กล้องพัง และเผื่อเดสก์ท็อป) */
[0,1].forEach(i=>{
  const z = $('sci-zone-'+i);
  if(z) z.addEventListener('click', ()=>{ if(sciGame && !sciGame.answered){ playClick(); sciSelect(i); } });
});
$('sci-camera-toggle').addEventListener('click', ()=>{
  playClick();
  if(sciActive){ sciStopCamera(); document.body.classList.add('sci-nocam'); $('sci-hint').textContent='👆 แตะฝั่งคำตอบที่เลือกได้เลย'; sciUpdateCamBtn(); }
  else { sciInitCamera().then(sciUpdateCamBtn); }
});

function finishScienceGame(){
  if(!sciGame) return;
  /* 🛟 ผลลัพธ์มาถึงหลังการ์ดถูกปิดไปแล้ว (setTimeout ค้าง) ⇒ state ถูกล้างแล้ว จบเงียบๆ */
  clearTimeout(sciTimer); sciTimer=null;
  sciStopCamera();
  document.body.classList.remove('sci-open','sci-nocam');
  const cat = catById(sciGame.catId);
  const mistakes = sciGame.mistakes;
  const totalLevels = sciGame.totalLevels;
  showOnlyView(resultView);
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();
  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดนักวิทย์!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row'); starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s=document.createElement('span'); s.textContent='⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });
  $('score-line').textContent = 'ทายผลครบ '+totalLevels+' ข้อ! (ทายพลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'ทายแม่นสุดๆ ไม่พลาดเลย!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'!' : 'ไม่เป็นไรนะ ลองทายอีกครั้งเก็บดาวเพิ่ม!';
  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){ stickerBlock.hidden=false; setStickerEarned(cat); pendingSticker=cat.id; setTimeout(()=>{ burstCenterTop(40); playCongrats(); },250); setTimeout(()=>showOwlMsg('sticker'),400); }
  else { stickerBlock.hidden=true; if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'),400);} if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); },250); }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

$('sci-back').addEventListener('click', ()=>{
  playClick(); clearTimeout(sciTimer); sciTimer=null;
  sciStopCamera();
  document.body.classList.remove('sci-open','sci-nocam');
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= ลงทะเบียนกับ OwlGames (สัญญา Mount) =============================
   ให้โฮสต์อื่น (การ์ดเควสต์ในโหมดบ้าน / โหมดครู) หยิบเกมพวกนี้ไปวางในกล่องของตัวเองได้
   ⚠ `stop()` ต้องล้าง state ให้หมด ไม่งั้นเกมเดิมค้างทำงานอยู่หลังปิดการ์ด — ดู js/owl-games.js */
if(window.OwlGames){
  OwlGames.register('memory', {name:'จับคู่ความจำ', view:'memory-view',
    start:o => startMemoryGame(o.catId),
    stop:() => { memoryGame = null; }});
  OwlGames.register('shadow', {name:'ทายเงา', view:'shadow-view',
    start:o => startShadowGame(o.catId),
    stop:() => { shadowGame = null; }});
  OwlGames.register('ef', {name:'นกฮูกสั่ง', view:'ef-view',
    start:o => startEfGame(o.catId),
    /* ⚠ ต้องล้าง EF_NO_TIMER ที่นี่ **ทางเดียว** — `unmount()` เรียก stop() ให้ทุกทางออก
         (เล่นจบ · เด็กปิดการ์ดกลางเกม · สลับไปเกมอื่น) ถ้าไปล้างที่ callback ตอนจบเกมอย่างเดียว
         เด็กปิดการ์ดหนีจะทำให้หน้าหลักเล่นเกมนี้แบบไม่มีเวลาตามไปด้วย */
    stop:() => { efGame = null; clearTimeout(efTimer); efTimer = null; EF_NO_TIMER = false;
                 const b = document.getElementById('ef-timer-fill'); if(b) b.style.transition = 'none'; }});
  OwlGames.register('science', {name:'นักวิทยาศาสตร์', view:'science-view',
    start:o => startScienceGame(o.catId),
    /* 🐞 **ของเดิมเขียนว่า `scienceGame = null`** ซึ่งเป็นตัวแปรที่ไม่มีอยู่จริง (state ชื่อ `sciGame`)
       ⇒ ในโหมด sloppy มันไปสร้าง global ใหม่เปล่าๆ ส่วน state จริง/ตัวจับเวลา/กล้อง **ไม่เคยถูกล้างเลย**
       (เจอตอนรีวิว 2026-08-17 · ตอนนี้เกมนี้ยังไม่ถูกเปิดให้ยืมไปเล่นในการ์ด จึงยังไม่มีใครเจออาการ
        แต่ถ้าวันหลังเปิด `science` ใน ALLOW ของ js/house-games.js จะกลายเป็นกล้องค้างเปิดทันที)
       ⚠ เกมนี้มีทั้ง timer · ลูป rAF · กล้อง ⇒ ต้องปิดให้ครบทุกอย่าง ไม่ใช่แค่ null state */
    stop:() => { sciGame = null; clearTimeout(sciTimer); sciTimer = null; sciStopCamera();
                 document.body.classList.remove('sci-open', 'sci-nocam'); }});
}
