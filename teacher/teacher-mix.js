/* ==========================================================================
   โหมดคุณครู — เกมผสมสี (mechanic 'mix')
   port หม้อ/กระปุก/effect จาก skill-mix ของหน้าหลัก (js/app.js) แบบคง id/class เดิม
   (mix-view/mix-jar/mix-pot/mix-chip ฯลฯ ใช้สไตล์จาก css/style.css ตรงๆ)
   โหลดหลัง teacher.js (ใช้ games/lastPlay/showView/mixView/playClick/playCorrect/
   playWrong/showToast/shuffleArray/escapeHtml/CARD_COLORS/showTeacherSkillResult ร่วมกัน)

   ต่างจากหน้าเด็ก (สูตรสีตายตัวตามหลักจริง + โหมด 2 จังหวะ) ตรงที่ครูกำหนดเองทั้ง
   สีที่ต้องผสม (2-3 สี) และ "สีผลลัพธ์" — ตอนถูกจึงโชว์สีที่ครูตั้งตรงๆ ไม่คำนวณผสม RGB
   (ระหว่างหยอดโชว์สีเฉลี่ยเป็นตัวอย่างเท่านั้น) และตัดโหมด 2 จังหวะออก ทุกสูตรเป็น flat set
   ========================================================================== */

let teacherMixGame = null; // {gameId, queue, level, totalLevels, mistakes, decoyPool, jars:[{c,n}], pours:[jarIdx], locked}

/* เฉลี่ยค่าสี RGB ของสีที่หยอดแล้ว ใช้โชว์สีในหม้อระหว่างผสม/ตอนตอบผิด (ให้เห็นผลลัพธ์เป็นตัวอย่าง) */
function mixHexAvgHex(hexes){
  let r=0, g=0, b=0;
  hexes.forEach(hex=>{
    const h = hex.replace('#','');
    r += parseInt(h.slice(0,2),16); g += parseInt(h.slice(2,4),16); b += parseInt(h.slice(4,6),16);
  });
  const n = hexes.length || 1;
  const to2 = v => Math.round(v/n).toString(16).padStart(2,'0');
  return '#'+to2(r)+to2(g)+to2(b);
}

function startTeacherMix(gameId){
  const game = games.find(g=>g.id===gameId);
  if(!game) return;
  lastPlay = { type:'mix', gameId };
  let pool = game.questions.slice();
  if(game.shuffle) shuffleArray(pool);
  const queue = pool.slice(0, Math.min(game.questionCount, pool.length));

  /* คลังสีหลอก: สีทั้งหมด (ผสม+ผลลัพธ์) จากทุกสูตรของเกม แยกไม่ซ้ำด้วย hex */
  const seen = new Set();
  const decoyPool = [];
  game.questions.forEach(q=>{
    (q.ingredients||[]).concat([q.result]).forEach(col=>{
      const key = col.c.toLowerCase();
      if(!seen.has(key)){ seen.add(key); decoyPool.push({c:col.c, n:col.n}); }
    });
  });

  teacherMixGame = { gameId, queue, level:1, totalLevels:queue.length, mistakes:0,
    decoyPool, jars:[], pours:[], locked:false };

  const idx = games.indexOf(game);
  const [color] = CARD_COLORS[idx % CARD_COLORS.length];
  document.documentElement.style.setProperty('--cat-color', color);
  mixView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', color));
  $('mix-cat-label').innerHTML = '<img src="'+game.logo+'" alt="" style="width:24px;height:24px;vertical-align:-6px;margin-right:6px;">'+escapeHtml(game.title);
  showView(mixView);
  renderTeacherMixLevel();
}

function renderTeacherMixLevel(){
  const g = teacherMixGame;
  g.pours = []; g.locked = false;
  const rec = g.queue[g.level-1];

  /* กระปุก = สีในสูตร + สีหลอกจากสูตรอื่น (คัดสีที่ซ้ำกับสูตรออก) */
  const neededSet = new Set(rec.ingredients.map(x=>x.c.toLowerCase()));
  const jarObjs = rec.ingredients.map(x=>({c:x.c, n:x.n}));
  const decoys = shuffleArray(g.decoyPool.filter(d=>!neededSet.has(d.c.toLowerCase())).slice());
  const jarCount = Math.min(rec.ingredients.length + 2, rec.ingredients.length + decoys.length);
  let di = 0;
  while(jarObjs.length < jarCount && di < decoys.length){ jarObjs.push(decoys[di++]); }
  shuffleArray(jarObjs);
  g.jars = jarObjs;

  $('mix-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('mix-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('mix-target-text').innerHTML = 'ช่วยทำ<b>'+escapeHtml(rec.result.n)+'</b>ให้หน่อยนะ!';
  $('mix-target-swatch').style.background = rec.result.c;
  $('mix-msg').hidden = true;
  $('mix-hint').textContent = rec.ingredients.length>2
    ? '🎨 สีนี้ต้องผสมถึง 3 สี! หยอดให้ครบตามสูตรนะ'
    : '🎨 แตะกระปุกสีเพื่อหยอดลงหม้อให้ได้สีที่ต้องการนะ';

  const pot = $('mix-pot');
  pot.classList.remove('stirring','happy','sad');
  const liquid = $('mix-pot-liquid');
  liquid.classList.remove('draining','filled');
  liquid.style.background = '';

  const jarsWrap = $('mix-jars');
  jarsWrap.innerHTML = '';
  g.jars.forEach((col,jarIdx)=>{
    const btn = document.createElement('button');
    btn.className = 'mix-jar';
    btn.dataset.jar = jarIdx;
    btn.innerHTML = '<span class="mix-jar-pot" style="--jc:'+col.c+'"><span class="mix-jar-lid"></span><span class="mix-jar-drip"></span></span><span class="mix-jar-name">'+escapeHtml(col.n)+'</span>';
    btn.addEventListener('click', ()=>pourTeacherJar(jarIdx, btn));
    jarsWrap.appendChild(btn);
  });
  renderTeacherMixChips();
}

/* effect กระปุกลอยไปเทที่ปากหม้อ — port ตรงจาก mixPourEffect (js/app.js) */
function teacherMixPourEffect(colorHex, jarBtn, done){
  const potRim = document.querySelector('#mix-pot .mix-pot-rim');
  const src = jarBtn.querySelector('.mix-jar-pot');
  if(!potRim || !src){ done(); return; }
  const from = src.getBoundingClientRect();
  const to = potRim.getBoundingClientRect();
  const ghost = document.createElement('span');
  ghost.className = 'mix-pour-ghost';
  ghost.style.setProperty('--jc', colorHex);
  ghost.style.left = from.left+'px';
  ghost.style.top = from.top+'px';
  ghost.style.width = from.width+'px';
  ghost.style.height = from.height+'px';
  document.body.appendChild(ghost);
  const dx = (to.left + to.width/2) - (from.left + from.width/2) + from.width*0.7;
  const dy = (to.top - from.height*1.15) - from.top;
  requestAnimationFrame(()=>{ ghost.style.transform = 'translate('+dx+'px,'+dy+'px) rotate(-115deg)'; });
  setTimeout(()=>{ ghost.classList.add('poured'); }, 500);
  setTimeout(()=>{ ghost.remove(); done(); }, 760);
}

function pourTeacherJar(jarIdx, btn){
  const g = teacherMixGame;
  if(!g || g.locked) return;
  if(btn.classList.contains('used')) return;
  playClick();
  btn.classList.add('used');
  g.locked = true; /* กันหยอดซ้อนระหว่าง animation */
  g.pours.push(jarIdx);
  const rec = g.queue[g.level-1];
  teacherMixPourEffect(g.jars[jarIdx].c, btn, ()=>{
    const liquid = $('mix-pot-liquid');
    liquid.style.background = mixHexAvgHex(g.pours.map(i=>g.jars[i].c));
    liquid.classList.add('filled');
    renderTeacherMixChips();
    if(g.pours.length >= rec.ingredients.length){
      const pot = $('mix-pot');
      pot.classList.add('stirring');
      setTimeout(()=>{ pot.classList.remove('stirring'); checkTeacherMix(); }, 950);
      /* คง locked ไว้ระหว่างคน/เช็คผล */
    } else {
      g.locked = false;
    }
  });
}

function renderTeacherMixChips(){
  const g = teacherMixGame;
  const wrap = $('mix-pot-chips');
  wrap.innerHTML = '';
  g.pours.forEach(jarIdx=>{
    const chip = document.createElement('button');
    chip.className = 'mix-chip'+(g.locked ? '' : ' removable');
    chip.style.background = g.jars[jarIdx].c;
    chip.title = g.jars[jarIdx].n;
    if(!g.locked){
      chip.addEventListener('click', ()=>{
        if(g.locked) return;
        playClick();
        const pos = g.pours.indexOf(jarIdx);
        if(pos>=0) g.pours.splice(pos,1);
        const jarBtn = $('mix-jars').querySelector('.mix-jar[data-jar="'+jarIdx+'"]');
        if(jarBtn) jarBtn.classList.remove('used');
        const liquid = $('mix-pot-liquid');
        if(g.pours.length){ liquid.style.background = mixHexAvgHex(g.pours.map(i=>g.jars[i].c)); }
        else { liquid.classList.remove('filled'); liquid.style.background = ''; }
        renderTeacherMixChips();
      });
    }
    wrap.appendChild(chip);
  });
}

function checkTeacherMix(){
  const g = teacherMixGame;
  const rec = g.queue[g.level-1];
  const poured = g.pours.map(i=>g.jars[i].c.toLowerCase()).sort();
  const need = rec.ingredients.map(x=>x.c.toLowerCase()).sort();
  const correct = poured.length===need.length && poured.every((c,k)=>c===need[k]);
  const liquid = $('mix-pot-liquid');
  const pot = $('mix-pot');
  const msg = $('mix-msg');

  if(correct){
    playCorrect();
    liquid.style.background = rec.result.c;
    pot.classList.add('happy');
    msg.textContent = '🎉 ได้'+rec.result.n+'แล้ว เก่งมาก!';
    msg.hidden = false;
    $('mix-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{
      if(g.level >= g.totalLevels){ finishTeacherMix(); }
      else { g.level++; renderTeacherMixLevel(); }
    }, 1500);
  } else {
    g.mistakes++;
    playWrong();
    liquid.style.background = mixHexAvgHex(g.pours.map(i=>g.jars[i].c));
    pot.classList.add('sad');
    msg.textContent = '💧 ยังไม่ใช่'+rec.result.n+'เลย เทออกแล้วลองใหม่นะ!';
    msg.hidden = false;
    setTimeout(()=>{
      liquid.classList.add('draining');
      setTimeout(()=>{
        g.pours = []; g.locked = false;
        liquid.classList.remove('draining','filled');
        liquid.style.background = '';
        pot.classList.remove('sad');
        msg.hidden = true;
        $('mix-jars').querySelectorAll('.mix-jar').forEach(b=>b.classList.remove('used'));
        renderTeacherMixChips();
      }, 550);
    }, 1700);
  }
}

function finishTeacherMix(){
  const g = teacherMixGame;
  const mistakes = g.mistakes, totalLevels = g.totalLevels;
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  showTeacherSkillResult(stars, 'ผสมสีครบ '+totalLevels+' สูตร! (พลาด '+mistakes+' ครั้ง)');
}

$('mix-back').addEventListener('click', ()=>{
  playClick();
  teacherMixGame = null;
  renderTeacherHome();
});
