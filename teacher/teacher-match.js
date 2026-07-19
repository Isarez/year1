/* ==========================================================================
   โหมดคุณครู — เกมจับคู่ความจำ (mechanic 'match')
   port กลไกเปิดการ์ดจับคู่จาก skill-memory ของหน้าหลัก (js/app.js) แบบคง id/class เดิม
   (memory-view/memory-board/memory-col/memory-card ฯลฯ ใช้สไตล์จาก css/style.css ตรงๆ)
   โหลดหลัง teacher.js (ใช้ games/lastPlay/showView/memoryView/playClick/playCorrect/
   playWrong/showToast/shuffleArray/escapeHtml/CARD_COLORS/showTeacherSkillResult ร่วมกัน)

   ต่างจากหน้าเด็ก (จับคู่ตัวเลข↔จุดโดมิโน) ตรงที่คู่ของครูเป็นข้อความอิสระ ซ้าย↔ขวา
   หน้าการ์ดจึงโชว์ข้อความ/emoji ของครูแทนโดมิโน จับคู่กันด้วย "index ของคู่" (pairIdx)
   ========================================================================== */

let matchGame = null; // {gameId, pairs, mistakes, matchedCount, totalPairs, openLeft, openRight, locked}

const MATCH_BACK_ICON = '<svg class="memory-card-icon-svg" viewBox="0 0 24 24"><path d="M12 2 L14.9 8.6 L22 9.3 L16.8 14.1 L18.2 21 L12 17.5 L5.8 21 L7.2 14.1 L2 9.3 L9.1 8.6 Z"/></svg>';

/* ข้อความที่มีตัวอักษร/ตัวเลข → ใช้ฟอนต์เล็ก (card-face-word), emoji ล้วน → ตัวใหญ่ (card-face-value) */
function matchIsText(s){ return /[ก-๙a-zA-Z0-9]/.test(s); }

function startTeacherMatch(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  lastPlay = { type:'match', gameId };
  let pool = game.questions.slice();
  if(game.shuffle) shuffleArray(pool);
  pool = pool.slice(0, Math.min(game.questionCount, pool.length));
  matchGame = { gameId, pairs:pool, mistakes:0, matchedCount:0, totalPairs:pool.length,
    openLeft:null, openRight:null, locked:false };

  const idx = games.indexOf(game);
  const [color] = CARD_COLORS[idx % CARD_COLORS.length];
  document.documentElement.style.setProperty('--cat-color', color);
  memoryView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', color));
  $('memory-cat-label').innerHTML = '<img src="'+game.logo+'" alt="" style="width:24px;height:24px;vertical-align:-6px;margin-right:6px;">'+escapeHtml(game.title);
  $('memory-hint').textContent = '🎴 แตะการ์ดฝั่งซ้าย 1 ใบ แล้วแตะฝั่งขวา 1 ใบ ให้เป็นคู่กันนะ!';
  showView(memoryView);
  renderMatchBoard();
}

function renderMatchBoard(){
  const g = matchGame;
  g.matchedCount = 0; g.openLeft = null; g.openRight = null; g.locked = false;

  /* สลับตำแหน่งฝั่งซ้าย/ขวาแยกกันอิสระ ไม่ให้ตำแหน่งบอกใบ้คู่กัน */
  const leftOrder  = shuffleArray(g.pairs.map((_,i)=>i));
  const rightOrder = shuffleArray(g.pairs.map((_,i)=>i));

  const leftCol  = $('memory-col-dots');     /* ฝั่งซ้าย */
  const rightCol = $('memory-col-numbers');  /* ฝั่งขวา */
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';

  function makeCard(pairIdx, text, side){
    const card = document.createElement('button');
    card.className = 'memory-card '+(side==='left' ? 'memory-card-dot' : 'memory-card-number');
    card.dataset.idx = pairIdx;
    const faceCls = matchIsText(text) ? 'card-face-value card-face-word' : 'card-face-value';
    card.innerHTML =
      '<div class="memory-card-inner">'+
        '<div class="memory-card-face card-face-hidden"><span class="memory-card-icon">'+MATCH_BACK_ICON+'</span></div>'+
        '<div class="memory-card-face '+faceCls+'">'+escapeHtml(text)+'</div>'+
      '</div>';
    card.addEventListener('click', ()=>flipMatchCard(card, side, pairIdx));
    return card;
  }
  leftOrder.forEach(i=> leftCol.appendChild(makeCard(i, g.pairs[i].left, 'left')));
  rightOrder.forEach(i=> rightCol.appendChild(makeCard(i, g.pairs[i].right, 'right')));

  $('memory-level-counter').textContent = '0/'+g.totalPairs;
  $('memory-progress-fill').style.width = '0%';
}

function flipMatchCard(cardEl, side, pairIdx){
  const g = matchGame;
  if(!g) return;
  if(cardEl.classList.contains('matched')) return;
  if(g.locked){ resetMatchMismatch(); }
  if(cardEl.classList.contains('flipped')) return;
  if(side==='left'  && g.openLeft)  return;
  if(side==='right' && g.openRight) return;
  playClick();
  cardEl.classList.add('flipped');
  if(side==='left') g.openLeft = { el:cardEl, idx:pairIdx };
  else g.openRight = { el:cardEl, idx:pairIdx };

  if(g.openLeft && g.openRight){
    if(g.openLeft.idx === g.openRight.idx) matchPairSuccess();
    else matchPairMismatch();
  }
}

function resetMatchMismatch(){
  const g = matchGame;
  if(g.openLeft)  g.openLeft.el.classList.remove('flipped','mismatch');
  if(g.openRight) g.openRight.el.classList.remove('flipped','mismatch');
  g.openLeft = null; g.openRight = null; g.locked = false;
}

function matchPairSuccess(){
  const g = matchGame;
  playCorrect();
  g.openLeft.el.classList.add('matched');
  g.openRight.el.classList.add('matched');
  g.matchedCount++;
  $('memory-level-counter').textContent = g.matchedCount+'/'+g.totalPairs;
  $('memory-progress-fill').style.width = (g.matchedCount/g.totalPairs*100)+'%';
  g.openLeft = null; g.openRight = null; g.locked = false;
  if(g.matchedCount >= g.totalPairs){ setTimeout(finishTeacherMatch, 550); }
}

function matchPairMismatch(){
  const g = matchGame;
  g.mistakes++;
  playWrong();
  g.openLeft.el.classList.add('mismatch');
  g.openRight.el.classList.add('mismatch');
  g.locked = true; /* คว่ำกลับตอนแตะการ์ดใบใหม่ (ไม่มี timer เหมือนหน้าเด็ก) */
}

function finishTeacherMatch(){
  const g = matchGame;
  const mistakes = g.mistakes, totalPairs = g.totalPairs;
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  showTeacherSkillResult(stars, 'จับคู่ครบ '+totalPairs+' คู่! (พลาด '+mistakes+' ครั้ง)');
}

$('memory-back').addEventListener('click', ()=>{
  playClick();
  matchGame = null;
  renderTeacherHome();
});
