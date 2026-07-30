/* ================================================================================
   เกมฝึกเขียน: ลากเส้นต่อจุด (dots)
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= CONNECT DOTS GAME (เกมลากเส้นต่อจุด 1/2 — เกมฝึกเขียน) ============================= */
/* mechanic: จุดวงกลมมีตัวเลขกำกับกระจายบนกระดานจัตุรัส แตะจุดที่ 1 แล้วลากต่อไปทีละจุดตามลำดับเลข
   (แตะทีละจุดเรียงลำดับเฉยๆ ก็ได้ ไม่บังคับต้องลากรวด — เผื่อเด็กเล็กที่ยังลากยาวไม่ถนัด)
   ต่อครบทุกจุดระบบปิดเส้นกลับจุดที่ 1 ให้อัตโนมัติ แล้วเฉลยรูปจริง (เติมสี + emoji + ชื่อรูป)
   ลาก/แตะโดนจุดผิดลำดับ = นับ mistake เส้นชั่วคราวแฟลชสีแดงเด้งหาย ให้เริ่มลากจากจุดล่าสุดใหม่
   พิกัดจุดใช้ระบบ 0-100 ตรงกับ viewBox ของ #dots-svg เพราะ .dots-stage เป็นจัตุรัสเสมอ (aspect-ratio 1/1) */
let dotsGame = null; // {catId, level, mistakes, totalLevels, queue, shape, connected, els, dragging, locked}

const DOTS_HIT_R = 9;        // ระยะ (หน่วย viewBox) ที่ถือว่าแตะโดนจุดเป้าหมาย
const DOTS_WRONG_R = 6.5;    // ระยะที่ถือว่าลากไปโดนจุดผิด (แคบกว่า กันโดนลูกหลงตอนลากผ่านใกล้ๆ)

function startDotsGame(catId){
  stopARGame();
  lastGameType = 'dots'; lastCatId = catId;
  const cat = catById(catId);
  dotsGame = {
    catId, level:1, mistakes:0, totalLevels:cat.levels,
    queue: shuffleArray(DOTS_SHAPES[cat.dotsPool].slice()).slice(0, cat.levels),
    shape:null, connected:0, els:[], dragging:false, locked:false
  };
  showOnlyView(dotsView);
  document.body.classList.add('dots-open'); // จอแคบ: ย่อนกฮูกลงมุม กันบังจุดแถวล่างของกระดาน (ดู CSS body.dots-open)
  document.documentElement.style.setProperty('--cat-color', cat.color);
  dotsView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('dots-cat-label', cat);
  wireDotsStage();
  renderDotsLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderDotsLevel(){
  const g = dotsGame;
  g.shape = g.queue[g.level-1];
  g.connected = 0; g.dragging = false; g.locked = false;
  $('dots-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('dots-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';

  const stage = $('dots-stage');
  $('dots-lines').innerHTML = '';
  const fill = $('dots-fill');
  fill.setAttribute('points','');
  fill.classList.remove('show');
  dotsHideTemp();
  $('dots-reveal').hidden = true;
  $('dots-reveal').classList.remove('show');
  stage.querySelectorAll('.dot-pt').forEach(el=>el.remove());

  stage.classList.remove('revealed');
  g.els = g.shape.pts.map((pt, i)=>{
    const d = document.createElement('div');
    d.className = 'dot-pt';
    d.style.left = pt[0]+'%';
    d.style.top = pt[1]+'%';
    d.innerHTML = '<span>'+(i+1)+'</span>';
    stage.appendChild(d);
    return d;
  });
}

function dotsStagePos(e){
  const r = $('dots-stage').getBoundingClientRect();
  return { x:(e.clientX-r.left)/r.width*100, y:(e.clientY-r.top)/r.height*100 };
}
function dotsNearest(x, y){
  /* หาจุดที่ยัง "ไม่ถูกต่อ" ที่ใกล้ตำแหน่งนิ้วที่สุด (จุดที่ต่อแล้วไม่นับ — นิ้วลากผ่านได้ไม่เป็นไร) */
  const g = dotsGame;
  let best = -1, bestDist = Infinity;
  g.shape.pts.forEach((pt, i)=>{
    if(i < g.connected) return;
    const dist = Math.hypot(pt[0]-x, pt[1]-y);
    if(dist < bestDist){ bestDist = dist; best = i; }
  });
  return { idx:best, dist:bestDist };
}
function dotsSvgLine(a, b){
  const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
  ln.setAttribute('x1',a[0]); ln.setAttribute('y1',a[1]);
  ln.setAttribute('x2',b[0]); ln.setAttribute('y2',b[1]);
  ln.setAttribute('class','dots-line');
  return ln;
}
function dotsUpdateTemp(x, y){
  const g = dotsGame;
  const anchor = g.shape.pts[g.connected-1];
  const temp = $('dots-temp');
  /* ระวัง: <line> เป็น SVG element ไม่มี property .hidden (มีเฉพาะ HTMLElement) ต้องจัดการ attribute ตรงๆ */
  temp.removeAttribute('hidden');
  temp.classList.remove('bad');
  temp.setAttribute('x1',anchor[0]); temp.setAttribute('y1',anchor[1]);
  temp.setAttribute('x2',x); temp.setAttribute('y2',y);
}
function dotsHideTemp(){
  const temp = $('dots-temp');
  temp.setAttribute('hidden','');
  temp.classList.remove('bad');
}

function dotsConnect(idx){
  const g = dotsGame;
  const pts = g.shape.pts;
  if(idx > 0) $('dots-lines').appendChild(dotsSvgLine(pts[idx-1], pts[idx]));
  g.connected = idx+1;
  g.els[idx].classList.add('done');
  if(g.connected < pts.length){ playClick(); }
  else { completeDotsLevel(); }
}

function dotsMistake(idx, x, y){
  const g = dotsGame;
  g.mistakes++;
  playWrong(); mascotOops(); showOwlMsg('wrong');
  const el = g.els[idx];
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  setTimeout(()=>el.classList.remove('shake'), 500); // ถอด class หลังจบ animation ไม่งั้นสีแดงค้างถาวรจนถึงตอนเฉลย
  /* เส้นชั่วคราวแฟลชสีแดงชี้ไปจุดที่ผิดแป๊บนึงแล้วหาย = "เส้นเด้งกลับ" ให้เริ่มลากจากจุดล่าสุดใหม่ */
  if(g.connected > 0){
    dotsUpdateTemp(x, y);
    $('dots-temp').classList.add('bad');
    setTimeout(dotsHideTemp, 350);
  }
  g.dragging = false;
}

function completeDotsLevel(){
  const g = dotsGame;
  const pts = g.shape.pts;
  g.locked = true; g.dragging = false;
  dotsHideTemp();
  $('dots-lines').appendChild(dotsSvgLine(pts[pts.length-1], pts[0])); // ปิดเส้นกลับจุดแรกให้อัตโนมัติ
  const fill = $('dots-fill');
  fill.setAttribute('points', pts.map(p=>p[0]+','+p[1]).join(' '));
  fill.classList.add('show');
  $('dots-stage').classList.add('revealed'); // จางจุดตัวเลขลง ไม่ให้บัง emoji เฉลย
  g.els.forEach(el=>el.classList.add('done'));
  const reveal = $('dots-reveal');
  $('dots-reveal-emoji').textContent = g.shape.e;
  $('dots-reveal-name').textContent = g.shape.name+'!';
  reveal.hidden = false;
  requestAnimationFrame(()=> reveal.classList.add('show'));
  playCorrect(); mascotHappy(); showOwlMsg('correct');
  burstFromElement($('dots-stage'), 40);
  $('dots-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    if(dotsGame !== g) return; // เผื่อผู้เล่นกดกลับหน้าหลัก/เริ่มเกมใหม่ระหว่างรอเฉลย
    if(g.level >= g.totalLevels){ finishDotsGame(); }
    else { g.level++; renderDotsLevel(); }
  }, 2000);
}

let dotsStageWired = false;
function wireDotsStage(){
  if(dotsStageWired) return;
  dotsStageWired = true;
  const stage = $('dots-stage');
  stage.addEventListener('pointerdown', e=>{
    /* mechanic แบบลากเท่านั้น: แตะเฉยๆ ไม่ต่อจุด — เริ่มเกมต้องกดที่จุด 1 แล้วลาก,
       ระหว่างเกมกดที่ "จุดล่าสุดที่ต่อแล้ว" (anchor) เพื่อจับเส้นลากต่อ กดที่อื่นเฉยๆ ไม่มีผล */
    const g = dotsGame;
    if(!g || g.locked) return;
    e.preventDefault();
    const pos = dotsStagePos(e);
    if(g.connected === 0){
      const p0 = g.shape.pts[0];
      if(Math.hypot(p0[0]-pos.x, p0[1]-pos.y) <= DOTS_HIT_R){
        dotsConnect(0);
        g.dragging = true;
        try{ stage.setPointerCapture(e.pointerId); }catch(err){}
        dotsUpdateTemp(pos.x, pos.y);
      }
      return;
    }
    const anchor = g.shape.pts[g.connected-1];
    if(Math.hypot(anchor[0]-pos.x, anchor[1]-pos.y) <= DOTS_HIT_R){
      g.dragging = true;
      try{ stage.setPointerCapture(e.pointerId); }catch(err){}
      dotsUpdateTemp(pos.x, pos.y);
    }
  });
  stage.addEventListener('pointermove', e=>{
    const g = dotsGame;
    if(!g || g.locked || !g.dragging) return;
    e.preventDefault();
    const pos = dotsStagePos(e);
    const near = dotsNearest(pos.x, pos.y);
    if(near.idx === g.connected && near.dist <= DOTS_HIT_R){
      dotsConnect(near.idx); // ลากรวดต่อหลายจุดโดยไม่ต้องยกนิ้วได้
      if(!g.locked) dotsUpdateTemp(pos.x, pos.y);
      return;
    }
    if(near.idx >= 0 && near.idx !== g.connected && near.dist <= DOTS_WRONG_R){
      dotsMistake(near.idx, pos.x, pos.y);
      return;
    }
    dotsUpdateTemp(pos.x, pos.y);
  });
  const endDrag = ()=>{
    const g = dotsGame;
    if(!g) return;
    g.dragging = false;
    if(!g.locked) dotsHideTemp();
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
}

function finishDotsGame(){
  const cat = catById(dotsGame.catId);
  const mistakes = dotsGame.mistakes;
  const totalLevels = dotsGame.totalLevels;
  dotsGame = null;
  document.body.classList.remove('dots-open');
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
  $('score-line').textContent = 'ลากเส้นครบ '+totalLevels+' รูป! (พลาด '+mistakes+' ครั้ง)';
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

$('dots-back').addEventListener('click', ()=>{
  playClick();
  dotsGame = null;
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});
