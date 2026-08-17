/* ================================================================================
   เกมสายศิลป์/ดนตรี: หม้อผสมสีวิเศษ (mix), เกมดนตรีเปียโน (music)
   และ gimmick "เปียโนของหนู" ที่ปลดล็อกเมื่อเล่นเกมดนตรีครบ
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= COLOR MIXING GAME (เกมผสมสี 1/2 — หม้อผสมสีวิเศษ) ============================= */
/* mechanic: แตะกระปุกสีหยอดลงหม้อ พอครบจำนวนที่ต้องหยอด หม้อคนอัตโนมัติแล้วโชว์ "สีผลลัพธ์จริง" ของคู่ที่เลือก
   (ตอบผิดเด็กได้เห็นว่าคู่นั้นผสมแล้วได้สีอะไรจริงๆ ไม่ใช่แค่บอกว่าผิด) — ผสมสี 1: เลือก 2 สีเองทั้งคู่,
   ผสมสี 2 (mixAdvanced) ด่าน 1-5: หม้อมีสีตั้งต้นให้แล้ว หาสีที่หายไป, ด่าน 6-10: ผสม 3 สี 2 จังหวะ (หม้อโชว์สีกลางทาง) */
let mixGame = null; // {catId, level, mistakes, totalLevels, advanced, queue, entry, jars, pours, prefill, needed, mixedCount, locked}

/* คิวโจทย์ทั้งรอบ: สุ่มลำดับสูตร ถ้าต้องการมากกว่าจำนวนสูตรในกลุ่ม เติมแบบสุ่มโดยไม่ให้ซ้ำติดกัน */
function buildMixQueue(recipes, count){
  const arr = shuffleArray(recipes.slice());
  let guard = 0;
  while(arr.length < count && guard++ < 50){
    const r = recipes[Math.floor(Math.random()*recipes.length)];
    if(r !== arr[arr.length-1]) arr.push(r);
  }
  return arr.slice(0, count);
}

/* ผสมค่าสีแบบเฉลี่ย RGB — ใช้โชว์สีในหม้อของคู่ที่ "ไม่มีในตารางสูตร" (ตอบผิด) ให้เด็กเห็นผลจริงเสมอ */
function mixHexAvg(ids){
  let r = 0, g = 0, b = 0;
  ids.forEach(id=>{
    const hex = MIX_COLORS[id].c;
    r += parseInt(hex.slice(1,3),16); g += parseInt(hex.slice(3,5),16); b += parseInt(hex.slice(5,7),16);
  });
  const n = ids.length;
  const to2 = v => Math.round(v/n).toString(16).padStart(2,'0');
  return '#'+to2(r)+to2(g)+to2(b);
}
function mixKey(ids){ return ids.slice().sort().join('+'); }
function mixLookup(ids){
  if(ids.length !== 2) return null;
  const key = mixKey(ids);
  const rec = MIX_RECIPES.find(r=>mixKey(r.mix)===key);
  return rec ? rec.out : null;
}

function startMixGame(catId){
  stopARGame();
  lastGameType = 'mix'; lastCatId = catId;
  const cat = catById(catId);
  const advanced = !!cat.mixAdvanced;
  let queue;
  if(advanced){
    /* ผสมสี 2: ด่าน 1-5 หาเองทั้ง 2 สี (สูตรยากขึ้น tier 2-3 หลากหลาย), ด่าน 6-10 ผสม 3 สี 2 จังหวะ */
    const hardPool = MIX_RECIPES.filter(r=>r.tier>=2);
    queue = shuffleArray(hardPool.slice()).slice(0,5).map(r=>({kind:'both', recipe:r}))
      .concat(shuffleArray(MIX_TWOSTEP.slice()).map(r=>({kind:'twostep', recipe:r})));
  } else {
    /* ผสมสี 1: หม้อเฉลยสีตั้งต้นให้ 1 สี ให้หา "คู่สี" มาเติม — ไล่ความยากตาม tier, สุ่มสูตร+สุ่มฝั่งที่เฉลยทุกรอบ */
    const tier = t => MIX_RECIPES.filter(r=>r.tier===t);
    queue = buildMixQueue(tier(1),4).concat(buildMixQueue(tier(2),3), buildMixQueue(tier(3),3))
      .map(r=>({kind:'missing', recipe:r}));
  }
  mixGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, advanced, queue,
              entry:null, jars:[], pours:[], prefill:null, needed:[], mixedCount:0, locked:false };
  showOnlyView(mixView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  mixView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('mix-cat-label', cat);
  renderMixLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderMixLevel(){
  const g = mixGame;
  const entry = g.queue[g.level-1];
  g.entry = entry; g.pours = []; g.mixedCount = 0; g.locked = false;
  const rec = entry.recipe;
  const allIds = Object.keys(MIX_COLORS);

  if(entry.kind==='twostep'){
    g.prefill = null;
    g.needed = rec.steps.slice();
    const jarCount = g.level<=7 ? 4 : 5;
    g.jars = rec.steps.slice();
    const extras = shuffleArray(allIds.filter(id=>!rec.steps.includes(id)));
    while(g.jars.length < jarCount && extras.length) g.jars.push(extras.pop());
    $('mix-hint').textContent = '🌀 สีนี้ต้องผสมถึง 3 สี! ค่อยๆ หยอดทีละสี ดูสีในหม้อเปลี่ยนไปเรื่อยๆ นะ';
  } else if(entry.kind==='missing'){
    /* ผสมสี 1: เฉลยสีตั้งต้นในหม้อ 1 สี (สุ่มฝั่ง) ให้หาคู่สีที่เหลือมาเติม */
    g.prefill = rec.mix[Math.floor(Math.random()*2)];
    g.needed = rec.mix.slice();
    const missing = rec.mix.find(id=>id!==g.prefill);
    const jarCount = g.level<=4 ? 3 : (g.level<=7 ? 4 : 5);
    g.jars = [missing];
    const extras = shuffleArray(allIds.filter(id=>id!==missing && id!==g.prefill));
    while(g.jars.length < jarCount && extras.length) g.jars.push(extras.pop());
    $('mix-hint').textContent = '🔍 ในหม้อมี'+MIX_COLORS[g.prefill].n+'อยู่แล้ว เติมอีกสีเดียวให้กลายเป็น'+rec.out.n+'นะ!';
  } else {
    /* ผสมสี 2 ด่าน 1-5: ไม่เฉลยเลย หาเองทั้ง 2 สี */
    g.prefill = null;
    g.needed = rec.mix.slice();
    const jarCount = g.level<=2 ? 4 : 5;
    g.jars = rec.mix.slice();
    const extras = shuffleArray(allIds.filter(id=>!rec.mix.includes(id)));
    while(g.jars.length < jarCount && extras.length) g.jars.push(extras.pop());
    $('mix-hint').textContent = '🎨 ด่านนี้ต้องหาเองทั้ง 2 สี! เลือกหยอดลงหม้อให้กลายเป็น'+rec.out.n+'นะ';
  }
  shuffleArray(g.jars);

  $('mix-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('mix-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  /* 🎨 **บอกจำนวนสีที่ต้องผสมตรงข้างเป้าหมายเสมอ** (ผู้ใช้สั่ง 2026-08-17)
     ของเดิมบอกไว้ในแถบคำใบ้อย่างเดียว ซึ่งอยู่คนละที่กับสีเป้าหมาย เด็กมองไม่เห็นพร้อมกัน
     ⚠ ด่านที่มีสีตั้งต้นในหม้ออยู่แล้ว ต้องนับเฉพาะ "สีที่ยังต้องเติม" ไม่ใช่จำนวนสีในสูตร */
  const needN = g.needed.length - (g.prefill != null ? 1 : 0);
  $('mix-target-text').innerHTML = 'ช่วยทำ<b>'+rec.out.n+'</b>ให้หน่อยนะ!'
    + '<span class="mix-need">' + (g.prefill != null ? 'เติมอีก ' : 'ผสม ') + needN + ' สี</span>';
  $('mix-target-swatch').style.background = rec.out.c;
  $('mix-msg').hidden = true;

  const pot = $('mix-pot');
  pot.classList.remove('stirring','happy','sad');
  const liquid = $('mix-pot-liquid');
  liquid.classList.remove('draining');
  if(g.prefill){ liquid.style.background = MIX_COLORS[g.prefill].c; liquid.classList.add('filled'); }
  else { liquid.classList.remove('filled'); }
  renderMixChips();

  const jarsWrap = $('mix-jars');
  jarsWrap.innerHTML = '';
  g.jars.forEach(id=>{
    const col = MIX_COLORS[id];
    const btn = document.createElement('button');
    btn.className = 'mix-jar';
    btn.dataset.color = id;
    btn.innerHTML = '<span class="mix-jar-pot" style="--jc:'+col.c+'"><span class="mix-jar-lid"></span><span class="mix-jar-drip"></span></span><span class="mix-jar-name">'+col.n+'</span>';
    btn.addEventListener('click', ()=>mixPour(id, btn));
    jarsWrap.appendChild(btn);
  });
}

/* แถวจุดสีใต้หม้อ: โชว์สีที่หยอดไปแล้ว (สีตั้งต้นของโหมดหาสีที่หายไปมีแม่กุญแจ ตักออกไม่ได้)
   จุดสีที่เพิ่งหยอดและยังไม่ถูกคนผสม แตะซ้ำเพื่อตักออกได้ */
function renderMixChips(){
  const g = mixGame;
  const wrap = $('mix-pot-chips');
  wrap.innerHTML = '';
  const addChip = (id, removable)=>{
    const chip = document.createElement('button');
    chip.className = 'mix-chip'+(removable ? ' removable' : '');
    chip.style.background = MIX_COLORS[id].c;
    chip.title = MIX_COLORS[id].n;
    if(removable){
      chip.addEventListener('click', ()=>{
        if(g.locked || g.pours.length!==1 || g.mixedCount>0) return;
        playClick();
        g.pours = [];
        $('mix-pot-liquid').classList.remove('filled');
        const jarBtn = $('mix-jars').querySelector('.mix-jar[data-color="'+id+'"]');
        if(jarBtn) jarBtn.classList.remove('used');
        renderMixChips();
      });
    }
    wrap.appendChild(chip);
  };
  if(g.prefill) addChip(g.prefill, false);
  g.pours.forEach(id=>{
    addChip(id, g.pours.length===1 && g.mixedCount===0 && !g.locked);
  });
}

/* effect กระปุกสีลอยไปเทที่ปากหม้อ: clone กระปุกเป็น ghost ตำแหน่ง fixed แล้ว transition ไปเหนือหม้อพร้อมเอียงเท */
function mixPourEffect(colorId, jarBtn, done){
  const potRim = document.querySelector('#mix-pot .mix-pot-rim');
  const src = jarBtn.querySelector('.mix-jar-pot');
  if(!potRim || !src){ done(); return; }
  const from = src.getBoundingClientRect();
  const to = potRim.getBoundingClientRect();
  const ghost = document.createElement('span');
  ghost.className = 'mix-pour-ghost';
  ghost.style.setProperty('--jc', MIX_COLORS[colorId].c);
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

function mixPour(colorId, jarBtn){
  const g = mixGame;
  if(!g || g.locked) return;
  if(jarBtn.classList.contains('used')) return;
  playClick();
  jarBtn.classList.add('used');
  g.locked = true; /* ล็อกระหว่าง effect เท กันกดรัว — ปลดเมื่อจบจังหวะที่ไม่ใช่การตัดสินผล */
  g.pours.push(colorId);
  const liquid = $('mix-pot-liquid');
  const potHadContent = !!g.prefill || g.pours.length > 1;
  const totalNeeded = g.needed.length - (g.prefill ? 1 : 0);

  mixPourEffect(colorId, jarBtn, ()=>{
    if(!potHadContent){
      /* สีแรกของหม้อเปล่า: เทลงไปเฉยๆ ยังไม่ต้องคน */
      liquid.style.background = MIX_COLORS[colorId].c;
      liquid.classList.add('filled');
      g.locked = false;
      renderMixChips();
      return;
    }

    /* มีสีในหม้ออยู่แล้ว → คนผสมอัตโนมัติ */
    const isFinal = g.pours.length >= totalNeeded;
    const effective = (g.prefill ? [g.prefill] : []).concat(g.pours);
    const pot = $('mix-pot');
    renderMixChips();
    pot.classList.add('stirring');
    setTimeout(()=>{
      pot.classList.remove('stirring');
      g.mixedCount = g.pours.length;
      if(!isFinal){
        /* จังหวะกลางทางของโหมดผสม 2 ขั้น: โชว์สีกลางทาง (จากตารางสูตรถ้ามี ไม่มีก็เฉลี่ยสี) */
        const mid = mixLookup(effective);
        liquid.style.background = mid ? mid.c : mixHexAvg(effective);
        g.locked = false;
        renderMixChips();
        return;
      }
      finishMixPour(effective);
    }, 950);
  });
}

function finishMixPour(effective){
  const g = mixGame;
  const rec = g.entry.recipe;
  const correct = mixKey(effective) === mixKey(g.needed);
  const liquid = $('mix-pot-liquid');
  const pot = $('mix-pot');
  const resultOut = correct ? rec.out : (mixLookup(effective) || {n:null, c:mixHexAvg(effective)});
  liquid.style.background = resultOut.c;
  const msg = $('mix-msg');

  if(correct){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    pot.classList.add('happy');
    msg.textContent = '🎉 ได้'+rec.out.n+'แล้ว เก่งมาก!';
    msg.hidden = false;
    $('mix-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{
      if(g.level >= g.totalLevels){ finishMixGame(); }
      else { g.level++; renderMixLevel(); }
    }, 1500);
  } else {
    g.mistakes++;
    playWrong(); showOwlMsg('wrong');
    pot.classList.add('sad');
    msg.textContent = resultOut.n
      ? '💧 ได้'+resultOut.n+'แทนแฮะ ยังไม่ใช่'+rec.out.n+' เทออกแล้วลองใหม่นะ!'
      : '💧 ได้สีแปลกๆ แฮะ ยังไม่ใช่'+rec.out.n+' เทออกแล้วลองใหม่นะ!';
    msg.hidden = false;
    setTimeout(()=>{
      liquid.classList.add('draining');
      setTimeout(()=>{
        /* รีเซ็ตหม้อ โจทย์เดิม ให้ลองใหม่ (คงสีตั้งต้นไว้ถ้าเป็นโหมดหาสีที่หายไป) */
        g.pours = []; g.mixedCount = 0; g.locked = false;
        liquid.classList.remove('draining');
        pot.classList.remove('sad');
        if(g.prefill){ liquid.style.background = MIX_COLORS[g.prefill].c; }
        else { liquid.classList.remove('filled'); }
        msg.hidden = true;
        renderMixChips();
        $('mix-jars').querySelectorAll('.mix-jar').forEach(b=>b.classList.remove('used'));
      }, 550);
    }, 1700);
  }
}

function finishMixGame(){
  const cat = catById(mixGame.catId);
  const mistakes = mixGame.mistakes;
  const totalLevels = mixGame.totalLevels;
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
  $('score-line').textContent = 'ผสมสีครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
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

$('mix-back').addEventListener('click', ()=>{
  playClick();
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ============================= เกมดนตรี (เปียโน) — skill-music 1/2/3 ============================= */
/* musicMode 1: คีย์มีตัวโน้ตกำกับ สุ่มโจทย์ 1-3 ตัวเรียงลำดับ (randMusicTarget)
   musicMode 2: เกมความจำสะสม สุ่ม 1 เพลงจาก MUSIC_LEVEL2_SONGS ด่าน n กดโน้ตตัวที่ 1..n เปิดเผยเฉพาะตัวใหม่ ต้องจำตัวเก่าเอง
   musicMode 3: เอาตัวโน้ตกำกับที่คีย์ออก สุ่มโจทย์ เด็กหาคีย์เอง 1-3 ตัว (randMusicTarget)
   เช็คคำตอบด้วยชื่อโน้ต (octave-agnostic) กดคีย์ชื่อเดียวกัน octave ไหนก็ถูก
   คีย์ดำกดได้มีเสียงจริง แต่ไม่เกี่ยวกับโจทย์ (ไม่นับผิด) */
let musicGame = null; // {catId, mode, level, totalLevels, mistakes, target:[whiteIdx], pos, locked, song}
let musicNotation = (localStorage.getItem('p1quiz_music_notation')==='en') ? 'en' : 'th';
let musicPausedBg = false; // จำว่าเกมนี้เป็นคนสั่งพักเพลงพื้นหลังไว้ (จะได้เล่นต่อตอนออก)

/* สุ่มโจทย์ Level 1/3: ด่าน 1-3 = 1 โน้ต, 4-7 = 2 โน้ต, 8-10 = 3 โน้ต จากคีย์ ด..ด (index 0-7) ไม่ให้ตัวติดกันซ้ำ */
function randMusicTarget(level){
  const count = level<=3 ? 1 : (level<=7 ? 2 : 3);
  const t = [];
  for(let i=0;i<count;i++){
    let n; do { n = Math.floor(Math.random()*8); } while(i>0 && n===t[i-1]);
    t.push(n);
  }
  return t;
}
/* พักเพลงพื้นหลังตอนอยู่ในเกมดนตรี / เล่นต่อตอนออก (ไม่แตะค่า setting musicOn ของผู้ใช้) */
function pauseBgMusicForMusicGame(){ if(musicOn && !musicPausedBg){ stopMusic(); musicPausedBg = true; } }
function resumeBgMusicAfterMusicGame(){ stopMusicSequence(); /* ออกจากเปียโน/เกมดนตรีทุกทาง = หยุดเพลงตัวอย่างที่ค้าง */ if(musicPausedBg){ musicPausedBg = false; if(musicOn) startMusic(); } }


/* noFlash=true: เล่นแต่เสียง ไม่ไฮไลต์คีย์ (ใช้กับ mode 3 ที่ต้องให้เด็กหาคีย์เอง ไม่เฉลยตำแหน่ง) */
/* เก็บ timer ของเพลงที่กำลังเล่นไว้ยกเลิกได้ — กดฟังซ้ำ = เริ่มใหม่ (ไม่เล่นทับกัน)
   และปิด modal เปียโน/เปลี่ยนเพลงต้องหยุดเพลงที่ค้างอยู่ด้วย stopMusicSequence() */
let musicSeqTimers = [];
let musicSeqCleanup = null; /* callback แจ้งผู้เรียกว่าเพลงหยุดแล้ว (จบเองหรือถูกสั่งหยุด) — เรียกครั้งเดียวเสมอ */
function stopMusicSequence(){
  musicSeqTimers.forEach(clearTimeout); musicSeqTimers = [];
  if(musicSeqCleanup){ const fn = musicSeqCleanup; musicSeqCleanup = null; fn(); }
}
function playMusicSequence(seq, noFlash, beats, opts){
  /* beats (optional): ความยาวโน้ตแต่ละตัวเป็นจังหวะ (1 = ตัวดำ) จาก MUSIC_LEVEL2_SONGS.beats
     ทำให้ทำนองเล่นถูกจังหวะจริง — ไม่ส่ง beats = ทุกตัวยาว 1 จังหวะเท่ากัน (โจทย์สุ่ม mode 1/3)
     opts (optional): { onNote(i) เรียกตามจังหวะทุกโน้ตที่เริ่มเล่น, onStop() เรียกครั้งเดียวเมื่อเพลงหยุด
     ไม่ว่าจะเล่นจบเองหรือถูกตัดด้วย stopMusicSequence() จากทางไหนก็ตาม } */
  stopMusicSequence();
  if(!seq || !seq.length) return;
  opts = opts || {};
  musicSeqCleanup = opts.onStop || null;
  const BEAT_MS = 500;
  let at = 0;
  seq.forEach((wi,i)=>{
    const b = (beats && beats[i]) || 1;
    musicSeqTimers.push(setTimeout(()=>{
      playPianoNote(MUSIC_WHITE_KEYS[wi].freq, Math.min(1.6, b*BEAT_MS/1000*0.95));
      if(!noFlash) flashKey(pianoWhiteEl(wi));
      if(opts.onNote) opts.onNote(i);
    }, at));
    at += b*BEAT_MS;
  });
  /* จบเพลงเอง: หยุดผ่านทางเดียวกับการสั่งหยุด เพื่อให้ onStop ทำงานเสมอ (เผื่อโน้ตท้ายกังวานอีกนิดค่อยแจ้ง) */
  musicSeqTimers.push(setTimeout(stopMusicSequence, at + 300));
}

function buildPiano(){ renderPianoKeys($('music-piano'), musicGame.mode===3); }

function renderMusicNotes(allDone){
  const g = musicGame, wrap = $('music-notes');
  wrap.innerHTML = '';
  g.target.forEach((wi,i)=>{
    const k = MUSIC_WHITE_KEYS[wi];
    const b = document.createElement('div');
    b.className = 'music-note-bubble';
    const done = allDone || i < g.pos;
    const isNewMemory = g.mode===2 && i === g.target.length-1;
    const hiddenMem = g.mode===2 && !done && !isNewMemory;
    if(done){
      b.classList.add('done'); b.style.setProperty('--key-color', k.color);
      b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span><span class="mnb-check">✓</span>';
    } else if(hiddenMem){
      b.classList.add('mystery'); b.textContent = '?';
    } else {
      b.style.setProperty('--key-color', k.color);
      b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span>';
    }
    if(!done && i===g.pos) b.classList.add('current');
    wrap.appendChild(b);
  });
}

function renderMusicLevel(){
  const g = musicGame;
  g.pos = 0; g.locked = false;
  $('music-msg').hidden = true;
  if(g.mode===2) g.target = g.song.notes.slice(0, g.level);
  else           g.target = randMusicTarget(g.level);
  $('music-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('music-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  const hint = $('music-hint'), plabel = $('music-prompt-label');
  if(g.mode===1){ hint.textContent = '🎹 กดคีย์ตามโน้ตในโจทย์ให้ครบตามลำดับนะ'; plabel.textContent = 'กดคีย์ตามนี้เลย 👇'; }
  else if(g.mode===2){ hint.textContent = '🧠 จำโน้ตให้ได้! กดตั้งแต่ตัวแรกจนถึงตัวใหม่ล่าสุด'; plabel.textContent = 'เพลง '+g.song.name+' — เล่นต่อ เพิ่มโน้ตใหม่!'; }
  else { hint.textContent = '🔍 คีย์ไม่มีตัวโน้ตแล้ว หาคีย์ให้ถูกตามโจทย์นะ'; plabel.textContent = 'หาคีย์ให้ถูก 🔍'; }
  renderMusicNotes();
  if(g.mode===2){
    /* เปิดเผย + เล่นเสียงเฉพาะโน้ตตัวใหม่ล่าสุด (ตัวเก่าต้องจำเอง) */
    setTimeout(()=>{ const ni = g.target[g.target.length-1]; playPianoNote(MUSIC_WHITE_KEYS[ni].freq, 0.8); flashKey(pianoWhiteEl(ni)); }, 450);
  } else {
    /* mode 3: เล่นทำนองแต่ไม่ไฮไลต์คีย์ (ให้เด็กหาคีย์เอง) — mode 1 ไฮไลต์ปกติ */
    setTimeout(()=>playMusicSequence(g.target, g.mode===3), 400);
  }
}

function musicPressWhite(wi){
  const g = musicGame;
  if(!g || g.locked) return;
  if(sameNote(wi, g.target[g.pos])){
    g.pos++;
    renderMusicNotes();
    if(g.pos >= g.target.length) musicLevelComplete();
  } else {
    g.mistakes++;
    playWrong(); showOwlMsg('wrong');
    const key = pianoWhiteEl(wi);
    if(key){ key.classList.add('key-wrong'); setTimeout(()=>key.classList.remove('key-wrong'), 420); }
    const cur = $('music-notes').children[g.pos];
    if(cur){ cur.classList.add('shake'); setTimeout(()=>cur.classList.remove('shake'), 420); }
  }
}

function musicLevelComplete(){
  const g = musicGame;
  g.locked = true;
  playCorrect(); mascotHappy(); showOwlMsg('correct');
  renderMusicNotes(true);
  const msg = $('music-msg');
  msg.textContent = '🎉 เยี่ยมมาก!'; msg.hidden = false;
  $('music-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{
    msg.hidden = true;
    if(g.level >= g.totalLevels) finishMusicGame();
    else { g.level++; renderMusicLevel(); }
  }, 1200);
}

function startMusicGame(catId){
  lastGameType = 'music'; lastCatId = catId;
  const cat = catById(catId);
  musicGame = { catId, mode:cat.musicMode, level:1, totalLevels:cat.levels, mistakes:0, target:[], pos:0, locked:false, song:null };
  if(cat.musicMode===2) musicGame.song = MUSIC_LEVEL2_SONGS[Math.floor(Math.random()*MUSIC_LEVEL2_SONGS.length)];
  pauseBgMusicForMusicGame();
  document.body.classList.add('music-open'); // ซ่อนปุ่มมุมล่าง (ติดตั้ง/เปียโน) ไม่ให้ทับคีย์
  showOnlyView(musicView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  musicView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('music-cat-label', cat);
  const nt = $('music-notation-toggle');
  nt.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  nt.setAttribute('aria-pressed', musicNotation==='en');
  buildPiano();
  renderMusicLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function finishMusicGame(){
  const cat = catById(musicGame.catId);
  const mistakes = musicGame.mistakes, totalLevels = musicGame.totalLevels;
  resumeBgMusicAfterMusicGame();
  document.body.classList.remove('music-open');
  const wasAllDone = musicAllDone();
  showOnlyView(resultView);
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();
  const freePianoJustUnlocked = !wasAllDone && musicAllDone(); // เพิ่งเล่นเกมดนตรีครบทั้ง 3 เกม
  if(freePianoJustUnlocked){ setTimeout(()=>showToast('🎹','ปลดล็อกเปียโนของหนูแล้ว! กดปุ่มมุมล่างซ้ายเล่นได้เลย'), 1800); }
  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดไปเลย!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row'); starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });
  $('score-line').textContent = 'เล่นดนตรีครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'เก่งสุด ๆ ไม่พลาดเลยสักครั้ง!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'ลองอีกนิดได้เต็มดาว!' : 'ไม่เป็นไรนะ ลองทำอีกครั้งเพื่อเก็บดาวเพิ่ม!';
  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){
    stickerBlock.hidden = false; setStickerEarned(cat); pendingSticker = cat.id;
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

$('music-piano').addEventListener('pointerdown', e=>{
  const key = e.target.closest('.music-key');
  if(!key) return;
  e.preventDefault();
  if(key.classList.contains('music-black')){
    playPianoNote(MUSIC_BLACK_KEYS[+key.dataset.black].freq, 0.7);
    flashKey(key);
    return;
  }
  const wi = +key.dataset.white;
  playPianoNote(MUSIC_WHITE_KEYS[wi].freq, 0.9);
  flashKey(key);
  musicPressWhite(wi);
});
$('music-listen-btn').addEventListener('click', ()=>{ if(musicGame) playMusicSequence(musicGame.target, musicGame.mode===3); });
$('music-notation-toggle').addEventListener('click', function(){
  musicNotation = musicNotation==='en' ? 'th' : 'en';
  localStorage.setItem('p1quiz_music_notation', musicNotation);
  this.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  this.setAttribute('aria-pressed', musicNotation==='en');
  if(musicGame){ buildPiano(); renderMusicNotes(); }
});
$('music-back').addEventListener('click', ()=>{
  playClick();
  resumeBgMusicAfterMusicGame();
  document.body.classList.remove('music-open');
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ===== gimmick: เปียโนของหนู (ปลดล็อกเมื่อเล่นเกมดนตรีครบทั้ง 3 เกม) ===== */
/* จัดกลุ่มเกมดนตรี (mode:'music') ตามระดับชั้น — เผื่อทุกระดับชั้นในอนาคต (คืน cat object) */
function musicGroupsByGrade(){
  const groups = {};
  CATS.forEach(c=>{
    if(c.type==='skill' && c.mode==='music'){
      const g = c.grade || 'prep-p1';
      (groups[g] = groups[g] || []).push(c);
    }
  });
  return groups;
}
/* ปลดล็อกเปียโนเมื่อผ่านเกมดนตรี "ของระดับชั้นใดชั้นหนึ่ง" (ครบชั้นเดียวก็พอ):
   - ผ่านครบทุกเกมในชั้น (แต่ละเกม ≥1 ดาว) หรือ
   - ผ่านเกมดนตรีเกมสุดท้าย (musicMode สูงสุด เช่น "ดนตรี 3") ของชั้นนั้น — เกมสุดท้ายล็อกอยู่หลังเกมก่อนหน้า
     อยู่แล้ว การผ่านได้จึงถือว่าเล่นครบ (robust กับ progress เก่าที่ดาวเกมแรกๆ อาจหาย) */
function musicAllDone(){
  const groups = musicGroupsByGrade();
  return Object.values(groups).some(cats=>{
    if(!cats.length) return false;
    if(cats.every(c => progress[c.id] && progress[c.id].stars>=1)) return true;
    const last = cats.reduce((a,b)=> (b.musicMode||0) > (a.musicMode||0) ? b : a);
    return progress[last.id] && progress[last.id].stars>=1;
  });
}
function updateFreePianoBtn(){ const b = $('free-piano-btn'); if(b) b.hidden = !(activeChild && musicAllDone()); }

let freePiano = { song:null, pos:0 };

function renderFreePianoSongs(){
  const wrap = $('fp-songs');
  let html = '<select class="fp-song-select" id="fp-song-select" aria-label="เลือกเพลง">';
  html += '<option value="-1"'+(freePiano.song?'':' selected')+'>🎹 เล่นอิสระ</option>';
  MUSIC_LEVEL2_SONGS.forEach((s,i)=>{
    html += '<option value="'+i+'"'+(freePiano.song===s?' selected':'')+'>'+s.name+'</option>';
  });
  html += '</select>';
  wrap.innerHTML = html;
}
function renderFreePianoNotes(){
  const wrap = $('fp-notes');
  if(!freePiano.song){ wrap.innerHTML = '<div class="fp-hint-free">กดคีย์เล่นได้เลย ทุกคีย์มีเสียงจริง! 🎶</div>'; return; }
  wrap.innerHTML = '';
  freePiano.song.notes.forEach((wi,i)=>{
    const k = MUSIC_WHITE_KEYS[wi];
    const b = document.createElement('div');
    b.className = 'music-note-bubble'+(i<freePiano.pos?' done':'')+((i===freePiano.pos)?' current':'');
    b.style.setProperty('--key-color', k.color);
    if(i<freePiano.pos) b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span><span class="mnb-check">✓</span>';
    else b.innerHTML = '<span class="mnb-note">'+musicKeyLabel(k)+'</span>';
    wrap.appendChild(b);
  });
}
function selectFreeSong(idx){
  stopMusicSequence(); /* เปลี่ยนเพลงระหว่างเพลงเดิมยังเล่นค้าง ต้องหยุดก่อน */
  freePiano.song = idx<0 ? null : MUSIC_LEVEL2_SONGS[idx];
  freePiano.pos = 0;
  renderFreePianoSongs();
  renderFreePianoNotes();
}
function openFreePiano(){
  playClick();
  pauseBgMusicForMusicGame();
  document.documentElement.style.setProperty('--cat-color', '#C86FB0');
  freePiano = { song:null, pos:0 };
  renderPianoKeys($('fp-piano'), false);
  renderFreePianoSongs();
  renderFreePianoNotes();
  updateFpListenBtn();
  $('fp-notation').textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  openOverlay('free-piano-modal');
}
function closeFreePiano(){ stopMusicSequence(); resumeBgMusicAfterMusicGame(); closeOverlay('free-piano-modal'); }

$('free-piano-btn').addEventListener('click', openFreePiano);
$('free-piano-x').addEventListener('click', ()=>{ playClick(); closeFreePiano(); });
$('free-piano-backdrop').addEventListener('click', closeFreePiano);
$('fp-songs').addEventListener('change', e=>{
  const sel = e.target.closest('.fp-song-select'); if(!sel) return;
  playClick(); selectFreeSong(+sel.value);
});
/* ปุ่มฟังเพลง: กดแล้วตัวโน้ตด้านบนวิ่งไฮไลต์ตามจังหวะ + คีย์เปียโนกดเองตามเพลง
   ระหว่างเล่นปุ่มเปลี่ยนเป็น "หยุดเพลง" กดซ้ำ = หยุดทันที, เล่นจบ/ถูกหยุด = reset ตัวโน้ตกลับจุดเริ่ม */
let fpListening = false;
function updateFpListenBtn(){
  const btn = $('fp-listen');
  btn.textContent = fpListening ? '⏹ หยุดเพลง' : '🔊 ฟังเพลง';
  btn.classList.toggle('listening', fpListening);
}
$('fp-listen').addEventListener('click', ()=>{
  if(!freePiano.song) return;
  playClick();
  if(fpListening){ stopMusicSequence(); return; } /* onStop จะ reset ให้เอง */
  fpListening = true; updateFpListenBtn();
  freePiano.pos = 0; renderFreePianoNotes();
  /* noFlash:true เพราะ flash ในตัว playMusicSequence ชี้เปียโนของเกม (#music-piano)
     ใน modal ต้อง flash คีย์ของ #fp-piano เองใน onNote */
  playMusicSequence(freePiano.song.notes, true, freePiano.song.beats, {
    onNote:(i)=>{
      flashKey($('fp-piano').querySelector('.music-white[data-white="'+freePiano.song.notes[i]+'"]'));
      freePiano.pos = i; renderFreePianoNotes();
    },
    onStop:()=>{ fpListening = false; updateFpListenBtn(); freePiano.pos = 0; renderFreePianoNotes(); }
  });
});
$('fp-notation').addEventListener('click', function(){
  musicNotation = musicNotation==='en' ? 'th' : 'en';
  localStorage.setItem('p1quiz_music_notation', musicNotation);
  this.textContent = 'โน้ต: '+(musicNotation==='en'?'อังกฤษ':'ไทย');
  renderPianoKeys($('fp-piano'), false);
  renderFreePianoNotes();
});
$('fp-piano').addEventListener('pointerdown', e=>{
  const key = e.target.closest('.music-key'); if(!key) return;
  e.preventDefault();
  if(key.classList.contains('music-black')){ playPianoNote(MUSIC_BLACK_KEYS[+key.dataset.black].freq, 0.7); flashKey(key); return; }
  const wi = +key.dataset.white;
  playPianoNote(MUSIC_WHITE_KEYS[wi].freq, 0.9);
  flashKey(key);
  // โหมดเล่นตามเพลง: กดถูกตัวถัดไป (เทียบชื่อโน้ต) แล้วเดินหน้าไฮไลต์ กดผิดไม่เป็นไร (เล่นอิสระ)
  if(freePiano.song && sameNote(wi, freePiano.song.notes[freePiano.pos])){
    freePiano.pos++;
    if(freePiano.pos >= freePiano.song.notes.length){
      renderFreePianoNotes();
      mascotHappy(); playCorrect();
      setTimeout(()=>{ freePiano.pos = 0; renderFreePianoNotes(); }, 900);
    } else {
      renderFreePianoNotes();
    }
  }
});

/* ============================= ลงทะเบียนกับ OwlGames (สัญญา Mount) =============================
   ให้โฮสต์อื่น (การ์ดเควสต์ในโหมดบ้าน / โหมดครู) หยิบเกมพวกนี้ไปวางในกล่องของตัวเองได้
   ⚠ `stop()` ต้องล้าง state ให้หมด ไม่งั้นเกมเดิมค้างทำงานอยู่หลังปิดการ์ด — ดู js/owl-games.js */
if(window.OwlGames){
  OwlGames.register('mix', {name:'ผสมสี', view:'mix-view',
    start:o => startMixGame(o.catId),
    stop:() => { mixGame = null; }});
  OwlGames.register('music', {name:'ดนตรี', view:'music-view',
    start:o => startMusicGame(o.catId),
    stop:() => { musicGame = null; }});
}
