/* ================================================================================
   เกมแบบคำถาม-คำตอบ (quiz) — ใช้ร่วมกันทุกหมวดที่มี cat.questions
   รวมหน้าสรุปผล/ดาว ที่เกมอื่นเรียกใช้ต่อผ่าน finishP2Game
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= QUIZ FLOW ============================= */
/* นับจำนวน "ตัว emoji จริง" ในสตริง (1️⃣/❤️ ประกอบจากหลาย code point ใช้ length ตรงๆ ไม่ได้)
   ใช้แยกการ์ดแพทเทิร์นเดี่ยว vs หลายตัว (เช่น '🍎🍎🍎') เพื่อย่อฟอนต์ให้พอดีการ์ด */
function graphemeLen(str){
  if(window.Intl && Intl.Segmenter){
    return [...new Intl.Segmenter('th',{granularity:'grapheme'}).segment(str)].length;
  }
  return Array.from(str.replace(/[\uFE0F\u20E3]/g,'')).length;
}

function shuffleChoices(q){
  const idxs = q.choices.map((_,i)=>i);
  for(let i=idxs.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [idxs[i],idxs[j]] = [idxs[j],idxs[i]];
  }
  return { ...q, choices: idxs.map(i=>q.choices[i]), correct: idxs.indexOf(q.correct) };
}

/* หมวดที่มี poolPick: สุ่มโจทย์จากคลังมาแค่ N ข้อต่อรอบ — ถ้าโจทย์มี tier ให้เกลี่ยจำนวนต่อ tier
   แล้วเรียงง่าย→ยากเสมอ (เศษที่หารไม่ลงตัวเติมให้ tier ง่ายก่อน) */
function pickQuizQuestions(cat){
  if(!cat.poolPick) return cat.questions;
  const tiers = [...new Set(cat.questions.map(q=>q.tier||1))].sort((a,b)=>a-b);
  if(tiers.length<=1) return shuffleArray(cat.questions.slice()).slice(0, cat.poolPick);
  const per = Math.floor(cat.poolPick / tiers.length);
  let extra = cat.poolPick - per*tiers.length;
  const out = [];
  tiers.forEach(t=>{
    const n = per + (extra>0 ? 1 : 0); if(extra>0) extra--;
    out.push(...shuffleArray(cat.questions.filter(q=>(q.tier||1)===t)).slice(0, n));
  });
  return out;
}

function startQuiz(catId){
  stopARGame();
  lastGameType = 'quiz'; lastCatId = catId;
  const cat = catById(catId);
  state = { catId:catId, qIndex:0, score:0, wrong:[], answered:false, questions: pickQuizQuestions(cat).map(shuffleChoices) };
  showOnlyView(quizView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  quizView.querySelectorAll('.progress-fill, .next-btn').forEach(el=>{ el.style.setProperty('--cat-color', cat.color); });
  setCatLabel('quiz-cat-label', cat);
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

  if(q.pattern){
    $('q-emoji').innerHTML = '<div class="pattern-row">'+
      q.pattern.map(p=>{
        const OI = window.OwlIcons;
        const body = (OI && OI.hasEmoji(p)) ? OI.text(p, 30) : p;
        return '<span class="pat-tile'+(graphemeLen(p)>1?' pat-multi':'')+'">'+body+'</span>';
      }).join('')+
      '<span class="pat-tile pat-missing">?</span></div>';
  } else if(q.img){
    $('q-emoji').innerHTML = '<img src="'+q.img+'" alt="" style="max-width:100%;border-radius:12px;display:block;margin:0 auto;">';
  } else {
    /* 🎨 รูปประกอบโจทย์: emoji ตัวไหนมีไอคอน SVG ให้ใช้รูปวาด (ผู้ใช้สั่ง — emoji ข้าม OS ได้คนละรูป)
       ⚠ **ไม่แตะข้อความบนปุ่มตัวเลือก** เพราะข้อความนั้นคือเฉลยที่ระบบใช้เทียบคำตอบ */
    const OI = window.OwlIcons;
    if(OI && OI.hasEmoji(q.emoji || '')) $('q-emoji').innerHTML = OI.text(q.emoji, 46);
    else $('q-emoji').textContent = q.emoji||'';
  }
  $('q-text').textContent = q.q;

  const grid = $('choice-grid');
  grid.innerHTML = '';
  q.choices.forEach((choiceText, idx)=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if(q.pattern){
      btn.classList.add('choice-emoji');
      if(graphemeLen(choiceText)>1) btn.classList.add('choice-emoji-multi');
    }
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
    state.wrong.push({q: q.pattern ? q.pattern.join(' ')+' ❓' : q.q, correctText:q.choices[q.correct], explain:q.explain});
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

  showOnlyView(resultView);

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
    setStickerEarned(cat);
    pendingSticker = cat.id;
    setTimeout(()=>{ burstCenterTop(40); playCongrats(); }, 250);
    setTimeout(()=>showOwlMsg('sticker'), 400);
  } else {
    stickerBlock.hidden = true;
    if(state.score === total){ setTimeout(()=>showOwlMsg('perfect'), 400); }
    if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); }, 250);
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
  if(lastGameType==='ar'){ startARGame(lastCatId); }
  else if(lastGameType==='memory'){ startMemoryGame(lastCatId); }
  else if(lastGameType==='listen'){ startListenGame(lastCatId); }
  else if(lastGameType==='shadow'){ startShadowGame(lastCatId); }
  else if(lastGameType==='mix'){ startMixGame(lastCatId); }
  else if(lastGameType==='music'){ startMusicGame(lastCatId); }
  else if(lastGameType==='dots'){ startDotsGame(lastCatId); }
  else if(lastGameType==='clock'){ startClockGame(lastCatId); }
  else if(lastGameType==='ef'){ startEfGame(lastCatId); }
  else if(lastGameType==='code'){ startCodeGame(lastCatId); }
  else if(lastGameType==='science'){ startScienceGame(lastCatId); }
  else if(lastGameType==='money'){ startMoneyGame(lastCatId); }
  else if(lastGameType==='fraction'){ startFractionGame(lastCatId); }
  else if(lastGameType==='balance'){ startBalanceGame(lastCatId); }
  else if(lastGameType==='calendar'){ startCalendarGame(lastCatId); }
  else if(lastGameType==='timeline'){ startTimelineGame(lastCatId); }
  else if(lastGameType==='sort'){ startSortGame(lastCatId); }
  else if(lastGameType==='world'){ startWorldGame(lastCatId); }
  else if(lastGameType==='coord'){ startCoordGame(lastCatId); }
  else if(lastGameType==='chart'){ startChartGame(lastCatId); }
  else if(lastGameType==='area'){ startAreaGame(lastCatId); }
  else if(lastGameType==='angle'){ startAngleGame(lastCatId); }
  else if(lastGameType==='cloze'){ startClozeGame(lastCatId); }
  else if(lastGameType==='circuit'){ startCircuitGame(lastCatId); }
  else if(lastGameType==='tangram'){ startTangramGame(lastCatId); }
  else if(lastGameType==='mirror'){ startMirrorGame(lastCatId); }
  else if(lastGameType==='order'){ startOrderGame(lastCatId); }
  else { startQuiz(state.catId); }
  if(lastCatId) mountHandPlay(catById(lastCatId));
});
$('home-btn').addEventListener('click', ()=>{
  playClick();
  stopARGame();
  showOnlyView(homeView);
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
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});
