/* ================================================================================
   เกมสายคณิต/การวัด — engine ที่จบด้วย finishP2Game เหมือนกันหมด
     ร้านค้านกฮูก (money) · พิซซ่าเศษส่วน (fraction) · ตาชั่งวิเศษ (balance)
     ปฏิทินวิเศษ (calendar) · เส้นเวลา (timeline) · จัดหมวดหมู่ (sort)
     โลกหมุน (world) · ขุมทรัพย์พิกัด (coord)
     อ่านแผนภูมิแท่ง (chart) · พื้นที่ตารางหน่วย (area) · มุมมหัศจรรย์ (angle)
     นาฬิกาวิเศษ (clock)
     ต่อวงจรไฟฟ้า (circuit) · แท็งแกรม (tangram) · กระจกวิเศษ (mirror) · เรียงลำดับ (order)
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= P2 ENGINE ใหม่ (IDEA + Phase 2.2): ร้านค้า(เงิน)/เศษส่วน/ตาชั่ง/ปฏิทิน
   ทุกเกมเป็น type:'skill' mode ใหม่ ใช้ view แยกของตัวเอง กลไกแตะ (ไม่ลากซับซ้อน) ดาวเกณฑ์ mistakes เดิม ============================= */
function p2rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function p2pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function p2GoHome(){
  showOnlyView(homeView);
  renderHome(); window.scrollTo({top:0, behavior:'smooth'});
}
/* result/ดาว ร่วมกัน (pattern เดียวกับ finishScienceGame) */
function finishP2Game(catId, mistakes, totalLevels, doneWord){
  /* ⭐ ตะเข็บเดียวของ "สัญญา Mount" — engine ทุกตัวจบเกมผ่านฟังก์ชันนี้ (25 จุดเรียก)
     ถ้าเกมกำลังถูก mount อยู่ในโฮสต์อื่น (เช่นการ์ดเควสต์ในโหมดบ้าน) ให้ส่งผลกลับโฮสต์
     แล้วจบตรงนี้ — ห้ามเด้งหน้าสรุป/แจกสติกเกอร์ของหน้าหลักทับ (ดู js/owl-games.js) */
  if(window.OwlGames && OwlGames.handleFinish(catId, mistakes, totalLevels, doneWord)) return;
  const cat = catById(catId);
  /* 🛟 **ผลลัพธ์มาถึงตอนที่ไม่มีโฮสต์รับแล้ว** — เด็กปิดการ์ดเควสต์ไปก่อน หรือ engine ที่มี
     ตัวจับเวลา/อนิเมชันยิงผลออกมาหลังถูก unmount ไปแล้ว
     ⚠ ของเดิมสั่ง `showOnlyView(resultView)` **ก่อน** จะรู้ว่า `cat` เป็น undefined
       ⇒ หน้าสรุปของหน้าหลักถูกเปิดค้างไว้ใน `<main>` ซึ่งอยู่ **หลังฉากเมือง**
         (`#house-view` z-index 70) เด็กเห็นเป็น "popup หลุดไปอยู่หลังเมือง"
         แล้วโค้ดบรรทัดถัดไปก็ throw ที่ `cat.id` ตามมาอีก (ผู้ใช้แจ้ง 2026-08-17)
     ⇒ ไม่มีหมวดจริง หรือกำลังอยู่ในโหมดบ้าน = **จบเงียบๆ ห้ามเปิดหน้าสรุปของหน้าหลัก** */
  if(!cat || document.body.classList.contains('house-open')) return;
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
  $('score-line').textContent = doneWord+'ครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'ไม่พลาดเลย!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'!' : 'ลองอีกครั้งเก็บดาวเพิ่มนะ!';
  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){ stickerBlock.hidden=false; setStickerEarned(cat); pendingSticker=cat.id; setTimeout(()=>{ burstCenterTop(40); playCongrats(); },250); setTimeout(()=>showOwlMsg('sticker'),400); }
  else { stickerBlock.hidden=true; if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'),400);} if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); },250); }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ---------------- 1) ร้านค้านกฮูก (เงิน/ทอนเงิน) ---------------- */
let moneyGame = null;
const MONEY_ITEMS = [ {e:'🍎',n:'แอปเปิล'},{e:'🍌',n:'กล้วย'},{e:'🍞',n:'ขนมปัง'},{e:'🍭',n:'อมยิ้ม'},{e:'🥤',n:'น้ำ'},{e:'🍪',n:'คุกกี้'},{e:'🧃',n:'น้ำกล่อง'},{e:'✏️',n:'ดินสอ'},{e:'📒',n:'สมุด'},{e:'🎈',n:'ลูกโป่ง'},{e:'🍩',n:'โดนัท'},{e:'🧸',n:'ตุ๊กตา'} ];
const MONEY_CUSTOMERS = ['🐰','🐻','🐱','🐶','🐼','🦊','🐨','🐯'];
function moneyLevelConfig(level, hard){
  /* 🪙 **เหรียญในเกมมีแค่ 4 แบบ: 1 · 2 · 5 · 10** (ผู้ใช้สั่ง 2026-08-17)
     ทั้งแอปใช้หน้าตาเหรียญชุดเดียวกัน (`.hqz-coinface` cv1/cv2/cv5/cv10) ⇒ เหรียญ 20/50/100
     ไม่มีหน้าตารองรับ และเด็กที่เพิ่งเรียนจากเกมจ่ายเงิน/ทอนเงินจะเจอเหรียญคนละชุดแล้วสับสน
     ⚠ **ตัดเหรียญออกแล้วต้องลดช่วงราคาลงด้วย** — ทอน 300 บาทด้วยเหรียญ 10 = ต้องหยิบ 30 เหรียญ
       เด็กหยิบไม่ไหวและการ์ดวางไม่พอ ⇒ คุมให้ทอนได้ภายใน ~8 เหรียญทุกระดับ
     💵 "เงินที่ลูกค้าจ่ายมา" (`bills`) ยังเป็นหลักสิบ/ร้อยได้ เพราะโชว์เป็น **ตัวเลขในฟองคำพูด**
       ไม่ได้วาดเป็นเหรียญ (ธนบัตร 20/50/100 มีจริงอยู่แล้ว) */
  if(hard==='p6'){
    /* ป.6: ราคาหลักสิบ ทอนจากธนบัตร และมีโจทย์ส่วนลดร้อยละ */
    if(level<=3) return { coins:[1,2,5,10], mode:'pay', priceMin:24, priceMax:60, step:1, discount:[10,20] };
    if(level<=7) return { coins:[1,2,5,10], mode:'change', bills:[50,100], priceMin:20, priceMax:60, step:1, discount:[10,20,25] };
    return { coins:[1,2,5,10], mode:'change', bills:[100], priceMin:55, priceMax:95, step:1, discount:[20,25,50] };
  }
  if(hard==='p5'){
    /* ป.5: ราคาหลักสิบ เริ่มมีส่วนลดร้อยละอย่างง่าย */
    if(level<=3) return { coins:[1,2,5,10], mode:'pay', priceMin:16, priceMax:45, step:1 };
    if(level<=7) return { coins:[1,2,5,10], mode:'change', bills:[50], priceMin:14, priceMax:45, step:1, discount:[10,50] };
    return { coins:[1,2,5,10], mode:'change', bills:[50,100], priceMin:30, priceMax:80, step:1, discount:[10,20,25] };
  }
  if(level<=3) return { coins:[1,2,5], mode:'pay', priceMin:2, priceMax:10 };
  if(level<=7) return { coins:[1,2,5,10], mode:'pay', priceMin:11, priceMax:30 };
  return { coins:[1,2,5,10], mode:'change', bills:[20,50], priceMin:11, priceMax:45 };
}
function startMoneyGame(catId){
  const cat = beginSkillGame(catId, 'money', moneyView, 'money-cat-label');
  moneyGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), tray:[], locked:false };
  renderMoneyLevel();
  endSkillGameStart();
}
function renderMoneyLevel(){
  const g = moneyGame; const cfg = moneyLevelConfig(g.level, g.hard);
  const item = p2pick(MONEY_ITEMS), cust = p2pick(MONEY_CUSTOMERS);
  let price = p2rand(cfg.priceMin, cfg.priceMax), given=0, target;
  if(cfg.step) price = Math.max(cfg.step, Math.round(price/cfg.step)*cfg.step);
  /* ป.5-6: บางด่านมีส่วนลดร้อยละ ต้องคิดราคาหลังลดก่อนจ่าย/ทอน */
  let disc = 0;
  if(cfg.discount && Math.random() < 0.6){
    const ok = cfg.discount.filter(d=>(price*d)%100===0);
    if(ok.length){ disc = p2pick(ok); price = price - price*disc/100; }
  }
  g.disc = disc; g.full = disc ? Math.round(price*100/(100-disc)) : price;
  if(cfg.mode==='change'){
    const bills = cfg.bills.filter(b=>b>price);
    given = bills.length ? p2pick(bills) : (Math.floor(price/10)*10+20);
    target = given - price;
  } else target = price;
  g.cfg=cfg; g.item=item; g.price=price; g.target=target; g.given=given; g.mode=cfg.mode; g.tray=[]; g.locked=false;
  $('money-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('money-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  const priceLine = g.disc
    ? 'ราคาป้าย <s>'+g.full+' บาท</s> <b>ลด '+g.disc+'%</b> เหลือ <b>'+price+' บาท</b>'
    : 'ราคา <b>'+price+' บาท</b>';
  const bubble = cfg.mode==='change'
    ? '<div class="money-bubble">อยากได้ '+item.e+' '+priceLine+'<br><span class="money-give">หนูจ่ายด้วยเงิน '+given+' บาท ช่วยทอนหน่อย</span></div>'
    : '<div class="money-bubble">อยากได้ '+item.e+'<br>'+priceLine+'</div>';
  $('money-customer').innerHTML = '<div class="money-cust-face">'+cust+'</div>'+bubble;
  $('money-hint').textContent = cfg.mode==='change' ? 'หยิบเหรียญ "ทอน" ให้พอดี แล้วกดจ่ายเงิน!' : 'หยิบเหรียญใส่ถาดให้ครบราคา แล้วกดจ่ายเงิน!';
  renderMoneyCoins(); renderMoneyTray();
}
/* 💰 **เหรียญต้องเป็นชุดเดียวกับเกมจ่ายเงิน/ทอนเงินของโหมดบ้าน** (ผู้ใช้สั่ง 2026-08-17)
   ดีไซน์ที่ผู้ใช้กำหนดไว้: 1 = เงินเล็ก · 2 = ทองเล็ก · 5 = เงินใหญ่ · 10 = เงินใหญ่วงในทอง
   ⚠ ใช้คลาส `.hqz-coinface` ชุดเดิม **ห้ามเขียนหน้าตาเหรียญชุดที่ 2** ไม่งั้นเด็กเจอเหรียญ
     คนละแบบระหว่างเกม แล้วนับผิด (คลาสนี้เป็น global ไม่ได้ผูกกับโหมดบ้าน)
   ⚠ เลขต้องอยู่ใน element ของตัวเอง (`.hqz-cn`) จะได้ทับชั้นในของเหรียญ 10 ได้ */
function coinFace(v){
  const cls = [1,2,5,10].indexOf(v) >= 0 ? v : 1;
  return '<span class="hqz-coinface cv'+cls+'"><span class="hqz-cn">'+v+'</span></span>';
}
function renderMoneyCoins(){
  const g = moneyGame, wrap = $('money-coins'); wrap.innerHTML='';
  g.cfg.coins.forEach(v=>{
    const b = document.createElement('button'); b.className='money-coin-btn';
    b.innerHTML = coinFace(v)+'<span class="money-coin-lbl">บาท</span>';
    b.addEventListener('click', ()=>{ if(g.locked) return; playClick(); g.tray.push(v); renderMoneyTray(); });
    wrap.appendChild(b);
  });
}
function moneyTotal(){ return moneyGame.tray.reduce((a,b)=>a+b,0); }
function renderMoneyTray(){
  const g = moneyGame, tray = $('money-tray'); tray.innerHTML='';
  if(g.tray.length===0){ tray.innerHTML='<span class="money-tray-empty">แตะเหรียญด้านล่างใส่ถาดนะ 👇</span>'; }
  g.tray.forEach((v,i)=>{
    const c = document.createElement('button'); c.className='money-tray-coin'; c.innerHTML=coinFace(v);
    c.addEventListener('click', ()=>{ if(g.locked) return; playClick(); g.tray.splice(i,1); renderMoneyTray(); });
    tray.appendChild(c);
  });
  $('money-total').textContent = 'รวม '+moneyTotal()+' บาท';
}
function moneyPay(){
  const g = moneyGame; if(g.locked) return;
  const total = moneyTotal();
  if(total===g.target){
    g.locked=true; playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('money-hint').textContent = 'เยี่ยม! พอดีเป๊ะเลย 🎉';
    $('money-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'ขายของ'); else { g.level++; renderMoneyLevel(); } }, 1300);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('money-hint').textContent = total>g.target ? 'เยอะไปนิดนะ ลองเอาเหรียญออกบ้าง' : 'ยังไม่พอนะ เติมเหรียญอีกหน่อย';
    showToast('🪙','ต้องการ '+g.target+' บาท · ตอนนี้ '+total+' บาท');
  }
}
$('money-pay').addEventListener('click', ()=>{ playClick(); moneyPay(); });
$('money-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 2) พิซซ่าเศษส่วน ---------------- */
let fractionGame = null;
const FRACTION_FOODS = [ {name:'พิซซ่า', crust:'#E8A33A', fill:'#FFD98A', topping:'#E1503A'}, {name:'เค้ก', crust:'#C97BB0', fill:'#FBE0F0', topping:'#E1503A'}, {name:'แตงโม', crust:'#3B9E5B', fill:'#FF6F7D', topping:'#2B2B2B'} ];
function fractionLevelConfig(level, hard){
  if(hard==='p6') return { sliceOpts: level<=3 ? [8,10] : (level<=7 ? [10,12] : [12,16]) };
  if(hard==='p5') return { sliceOpts: level<=3 ? [6,8] : (level<=7 ? [8,10] : [10,12]) };
  if(level<=3) return { sliceOpts:[2,4] };
  if(level<=7) return { sliceOpts:[4,6] };
  return { sliceOpts:[6,8] };
}
/* โจทย์ของ ป.5 = เศษส่วนตัวส่วนต่างกัน (a/b ของทั้งหมด) / ป.6 = ร้อยละและอัตราส่วน
   ทุกโจทย์ถูกเลือกให้ "จำนวนชิ้นคำตอบ" เป็นจำนวนเต็มเสมอ */
const FRACTION_HARD_P5 = [ [1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[1,6],[5,6],[3,8],[5,8],[1,2] ];
const FRACTION_HARD_P6 = [ 10,20,25,50,75 ];
const FRACTION_RATIOS  = [ [1,2],[1,3],[2,3],[1,4],[3,4],[2,5] ];
function fractionHardQuestion(slices, hard){
  if(hard==='p6'){
    const pick = Math.random();
    if(pick < 0.5){
      const ok = FRACTION_HARD_P6.filter(p=>(slices*p)%100===0);
      if(ok.length){ const p = p2pick(ok); return { target: slices*p/100, q:'แตะให้ได้ '+p+'% ของทั้งหมด ('+slices+' ชิ้น)' }; }
    } else {
      const ok = FRACTION_RATIOS.filter(r=>slices%(r[0]+r[1])===0);
      if(ok.length){ const r = p2pick(ok); const unit = slices/(r[0]+r[1]);
        return { target: unit*r[0], q:'แบ่งเป็นอัตราส่วน '+r[0]+' : '+r[1]+' — แตะส่วนแรกให้ถูกจำนวน' }; }
    }
  }
  const ok = FRACTION_HARD_P5.filter(f=>(slices*f[0])%f[1]===0 && slices*f[0]/f[1] < slices);
  if(!ok.length) return null;
  const f = p2pick(ok);
  return { target: slices*f[0]/f[1], q:'แตะให้ได้ '+f[0]+'/'+f[1]+' ของทั้งหมด ('+slices+' ชิ้น)' };
}
function startFractionGame(catId){
  const cat = beginSkillGame(catId, 'fraction', fractionView, 'fraction-cat-label');
  fractionGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), locked:false };
  renderFractionLevel();
  endSkillGameStart();
}
function renderFractionLevel(){
  const g = fractionGame, cfg = fractionLevelConfig(g.level, g.hard);
  const slices = p2pick(cfg.sliceOpts);
  const food = p2pick(FRACTION_FOODS);
  if(g.hard){
    const hq = fractionHardQuestion(slices, g.hard);
    if(hq){
      g.slices=slices; g.food=food; g.target=hq.target; g.selected=new Set(); g.locked=false;
      $('fraction-level-counter').textContent = g.level+'/'+g.totalLevels;
      $('fraction-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
      $('fraction-q').textContent = hq.q;
      $('fraction-hint').textContent = 'แตะชิ้นที่ต้องการ (แตะซ้ำเพื่อยกเลิก) แล้วกดตรวจคำตอบ';
      drawFractionFood();
      return;
    }
  }
  const kinds = ['count'];
  if(slices%2===0) kinds.push('half');
  if(slices%4===0) kinds.push('quarter');
  const kind = p2pick(kinds);
  let target, qtext;
  if(kind==='half'){ target = slices/2; qtext = 'แตะ'+food.name+'ให้ได้ "ครึ่งหนึ่ง" 🍕'; }
  else if(kind==='quarter'){ target = slices/4; qtext = 'แตะให้ได้ "หนึ่งในสี่" (¼)'; }
  else { target = p2rand(1, slices-1); qtext = 'แตะให้ได้ '+target+' ชิ้น จาก '+slices+' ชิ้น'; }
  g.slices=slices; g.food=food; g.target=target; g.selected=new Set(); g.locked=false;
  $('fraction-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('fraction-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('fraction-q').textContent = qtext;
  $('fraction-hint').textContent = 'แตะชิ้นที่ต้องการ (แตะซ้ำเพื่อยกเลิก) แล้วกดตรวจคำตอบ';
  drawFractionFood();
}
function drawFractionFood(){
  const g = fractionGame, N = g.slices, f = g.food;
  const cx=110, cy=110, r=100;
  let paths='';
  for(let i=0;i<N;i++){
    const a0 = (i/N)*Math.PI*2 - Math.PI/2, a1 = ((i+1)/N)*Math.PI*2 - Math.PI/2;
    const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const large = (a1-a0)>Math.PI?1:0;
    const sel = g.selected.has(i);
    const mid=(a0+a1)/2, tx=cx+r*0.55*Math.cos(mid), ty=cy+r*0.55*Math.sin(mid);
    paths += '<path class="frac-slice'+(sel?' sel':'')+'" data-i="'+i+'" d="M'+cx+' '+cy+' L'+x0+' '+y0+' A'+r+' '+r+' 0 '+large+' 1 '+x1+' '+y1+' Z" fill="'+(sel?'var(--cat-color)':f.fill)+'" stroke="'+f.crust+'" stroke-width="3"/>';
    if(N<=8) paths += '<circle cx="'+tx+'" cy="'+ty+'" r="6" fill="'+(sel?'#fff':f.topping)+'"/>';
  }
  const svg = '<svg viewBox="0 0 220 220" class="frac-svg">'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+4)+'" fill="'+f.crust+'"/>'+paths+'</svg>';
  const el = $('fraction-food'); el.innerHTML = svg;
  el.querySelectorAll('.frac-slice').forEach(p=>{
    p.addEventListener('click', ()=>{
      if(g.locked) return; playClick();
      const i = +p.dataset.i;
      if(g.selected.has(i)) g.selected.delete(i); else g.selected.add(i);
      drawFractionFood();
    });
  });
}
function fractionCheck(){
  const g = fractionGame; if(g.locked) return;
  if(g.selected.size===g.target){
    g.locked=true; playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('fraction-hint').textContent = 'ถูกต้อง! เก่งมาก 🎉';
    $('fraction-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'ตอบเศษส่วน'); else { g.level++; renderFractionLevel(); } }, 1300);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('fraction-hint').textContent = g.selected.size>g.target ? 'เลือกเยอะไปนิดนะ ลองแตะออกบ้าง' : 'ยังไม่ครบนะ เลือกเพิ่มอีกหน่อย';
    showToast('🍕','ต้องการ '+g.target+' ชิ้น · เลือกแล้ว '+g.selected.size+' ชิ้น');
  }
}
$('fraction-check').addEventListener('click', ()=>{ playClick(); fractionCheck(); });
$('fraction-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 3) ตาชั่งวิเศษ ---------------- */
let balanceGame = null;
function startBalanceGame(catId){
  const cat = beginSkillGame(catId, 'balance', balanceView, 'balance-cat-label');
  balanceGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), locked:false };
  renderBalanceLevel();
  endSkillGameStart();
}
function balanceMakeQuestion(level, hard){
  if(hard==='p6'){
    /* ป.6: สมการสองขั้นตอน / อัตราส่วน / เปรียบเทียบเศษส่วนกับทศนิยม */
    const kind = level<=3 ? 'mul2' : (level<=7 ? 'two' : 'mix');
    if(kind==='mul2'){
      const m = p2rand(3,9), x = p2rand(3,12), c = m*x;
      const set = new Set([x]); let gd=0;
      while(set.size<4 && gd++<40){ const d = x + p2rand(-3,3); if(d>0) set.add(d); }
      const ch = shuffleArray(Array.from(set));
      return { type:'eq', a:m, c, miss:x, q:'เติมเลขให้ตาชั่งสมดุล: '+m+' × ❓ = '+c, choices: ch.map(String), ans: ch.indexOf(x) };
    }
    if(kind==='two'){
      const m = p2rand(2,6), b = p2rand(2,15), x = p2rand(2,12), c = m*x + b;
      const set = new Set([x]); let gd=0;
      while(set.size<4 && gd++<40){ const d = x + p2rand(-3,3); if(d>0) set.add(d); }
      const ch = shuffleArray(Array.from(set));
      return { type:'eq', a:m, c, miss:x, q:'เติมเลขให้สมดุล: '+m+' × ❓ + '+b+' = '+c, choices: ch.map(String), ans: ch.indexOf(x) };
    }
    const pairs = [['3/4','0.7'],['1/2','0.5'],['2/5','0.45'],['5/8','0.6'],['3/5','0.55'],['7/10','0.75']];
    const pr = p2pick(pairs);
    const val = { '3/4':0.75, '1/2':0.5, '2/5':0.4, '5/8':0.625, '3/5':0.6, '7/10':0.7 }[pr[0]];
    const rv = parseFloat(pr[1]);
    return { type:'nums', left:pr[0], right:pr[1], q:'ค่าไหน "มากกว่า" กัน?', choices:['⬅️ ซ้าย','ขวา ➡️','เท่ากัน ⚖️'], ans: val>rv?0:(rv>val?1:2) };
  }
  if(hard==='p5'){
    /* ป.5: คูณ-หารในสมการ และเปรียบเทียบเศษส่วนตัวส่วนต่างกัน */
    const kind = level<=3 ? 'mul' : (level<=7 ? 'div' : 'frac');
    if(kind==='mul'){
      const m = p2rand(2,9), x = p2rand(2,9), c = m*x;
      const set = new Set([x]); let gd=0;
      while(set.size<4 && gd++<40){ const d = x + p2rand(-2,2); if(d>0) set.add(d); }
      const ch = shuffleArray(Array.from(set));
      return { type:'eq', a:m, c, miss:x, q:'เติมเลขให้ตาชั่งสมดุล: '+m+' × ❓ = '+c, choices: ch.map(String), ans: ch.indexOf(x) };
    }
    if(kind==='div'){
      const x = p2rand(2,9), d = p2rand(2,6), a = x*d;
      const set = new Set([x]); let gd=0;
      while(set.size<4 && gd++<40){ const q2 = x + p2rand(-2,2); if(q2>0) set.add(q2); }
      const ch = shuffleArray(Array.from(set));
      return { type:'eq', a, c:d, miss:x, q:'เติมเลขให้ตาชั่งสมดุล: '+a+' ÷ ❓ = '+d, choices: ch.map(String), ans: ch.indexOf(x) };
    }
    const fr = [['1/2','1/3'],['2/3','3/4'],['3/5','1/2'],['5/6','4/5'],['1/4','2/5'],['3/8','1/2']];
    const pr = p2pick(fr);
    const v = t => { const p = t.split('/'); return parseInt(p[0])/parseInt(p[1]); };
    return { type:'nums', left:pr[0], right:pr[1], q:'เศษส่วนไหน "มากกว่า" กัน?', choices:['⬅️ ซ้าย','ขวา ➡️','เท่ากัน ⚖️'], ans: v(pr[0])>v(pr[1])?0:(v(pr[1])>v(pr[0])?1:2) };
  }
  if(level<=4){
    let a=p2rand(1,6), b=p2rand(1,6); if(a===b) b = b<6?b+1:b-1;
    const item = p2pick(['🍎','🍊','🍋','🍓','🫐','🍒']);
    return { type:'items', item, left:a, right:b, q:'ตาชั่งข้างไหนหนักกว่ากัน?', choices:['⬅️ ซ้าย','ขวา ➡️','เท่ากัน ⚖️'], ans: a>b?0:(b>a?1:2) };
  }
  if(level<=7){
    let a=p2rand(1,9), b=p2rand(1,9); if(a===b) b = b<9?b+1:b-1;
    return { type:'nums', left:a, right:b, q:'ตัวเลขข้างไหน "มากกว่า"?', choices:['⬅️ ซ้าย','ขวา ➡️','เท่ากัน ⚖️'], ans: a>b?0:(b>a?1:2) };
  }
  const a=p2rand(1,9), miss=p2rand(1,9), c=a+miss;
  const set=new Set([miss]); let guard=0;
  while(set.size<3 && guard<30){ guard++; const d=miss+p2rand(-2,2); if(d>=0) set.add(d); }
  const choices = shuffleArray(Array.from(set));
  return { type:'eq', a, c, miss, q:'เติมเลขให้ตาชั่งสมดุล: '+a+' + ❓ = '+c, choices: choices.map(String), ans: choices.indexOf(miss) };
}
function balancePanHtml(content){ return '<div class="bal-pan-content">'+content+'</div>'; }
function renderBalanceLevel(){
  const g = balanceGame; const Q = balanceMakeQuestion(g.level, g.hard);
  g.q = Q; g.locked=false;
  $('balance-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('balance-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('balance-q').textContent = Q.q;
  $('balance-hint').textContent = 'ดูตาชั่งแล้วแตะคำตอบที่ถูกนะ';
  let leftC, rightC;
  if(Q.type==='items'){ leftC = Q.item.repeat(Q.left); rightC = Q.item.repeat(Q.right); }
  else if(Q.type==='nums'){ leftC = '<span class="bal-num">'+Q.left+'</span>'; rightC = '<span class="bal-num">'+Q.right+'</span>'; }
  else { leftC = '<span class="bal-num">'+Q.a+'</span>'; rightC = '<span class="bal-num">'+Q.c+'</span>'; }
  drawBalanceScene(leftC, rightC, 'level');
  const wrap = $('balance-choices'); wrap.innerHTML='';
  Q.choices.forEach((ch,i)=>{
    const b = document.createElement('button'); b.className='bal-choice-btn'; b.textContent=ch;
    b.addEventListener('click', ()=>{ if(g.locked) return; playClick(); balanceAnswer(i); });
    wrap.appendChild(b);
  });
}
function drawBalanceScene(leftC, rightC, tilt){
  $('balance-scene').innerHTML =
    '<div class="bal-scale bal-'+tilt+'">'+
      '<div class="bal-beam">'+
        '<div class="bal-arm bal-arm-l"><div class="bal-string"></div><div class="bal-pan">'+balancePanHtml(leftC)+'</div></div>'+
        '<div class="bal-arm bal-arm-r"><div class="bal-string"></div><div class="bal-pan">'+balancePanHtml(rightC)+'</div></div>'+
      '</div>'+
      '<div class="bal-post"></div><div class="bal-base"></div>'+
    '</div>';
}
function balanceAnswer(i){
  const g = balanceGame, Q = g.q; if(g.locked) return;
  g.locked=true;
  const btns = $('balance-choices').querySelectorAll('.bal-choice-btn');
  const correct = i===Q.ans;
  btns[Q.ans].classList.add('correct');
  if(!correct) btns[i].classList.add('wrong');
  /* เอียงตาชั่งเฉลย */
  let tilt='level';
  if(Q.type==='items'||Q.type==='nums'){ tilt = Q.ans===0?'left':(Q.ans===1?'right':'level'); }
  const scale = $('balance-scene').querySelector('.bal-scale');
  if(scale){ scale.classList.remove('bal-level','bal-left','bal-right'); scale.classList.add('bal-'+tilt); }
  if(correct){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('balance-hint').textContent = 'ถูกต้อง! 🎉';
    $('balance-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'ชั่งน้ำหนัก'); else { g.level++; renderBalanceLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('balance-hint').textContent = 'ยังไม่ถูกนะ ดูเฉลยแล้วลองข้อต่อไป!';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'ชั่งน้ำหนัก'); else { g.level++; renderBalanceLevel(); } }, 1700);
  }
}
$('balance-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 4) ปฏิทินวิเศษ ---------------- */
let calendarGame = null;
const TH_DOW = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const TH_DOW_SHORT = ['อา','จ','อ','พ','พฤ','ศ','ส'];
const TH_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
function startCalendarGame(catId){
  const cat = beginSkillGame(catId, 'calendar', calendarView, 'calendar-cat-label');
  calendarGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, locked:false };
  renderCalendarLevel();
  endSkillGameStart();
}
function renderCalendarLevel(){
  const g = calendarGame, level = g.level;
  const daysIn = p2pick([28,30,31]);
  const startDow = p2rand(0,6);
  const month = p2pick(TH_MONTHS);
  let q, ansVal, choices, highlight=0;
  if(level<=4){
    const date = p2rand(1, daysIn);
    const dow = (startDow + date - 1) % 7;
    q = 'วันที่ '+date+' ตรงกับวันอะไร?';
    ansVal = TH_DOW[dow]; highlight = date;
    const set=new Set([ansVal]); while(set.size<4){ set.add(TH_DOW[p2rand(0,6)]); }
    choices = shuffleArray(Array.from(set));
  } else if(level<=7){
    const date = p2rand(1, Math.max(1,daysIn-5)); const add = p2rand(1,5);
    const dow = (startDow+date-1)%7, dow2=(startDow+date-1+add)%7;
    q = 'วันที่ '+date+' เป็นวัน'+TH_DOW[dow]+' อีก '+add+' วันเป็นวันอะไร?';
    ansVal = TH_DOW[dow2]; highlight = date;
    const set=new Set([ansVal]); while(set.size<4){ set.add(TH_DOW[p2rand(0,6)]); }
    choices = shuffleArray(Array.from(set));
  } else {
    const type = p2pick(['count','which']);
    if(type==='count'){
      q = 'ปฏิทินเดือนนี้มีทั้งหมดกี่วัน?';
      ansVal = String(daysIn);
      const set=new Set([String(daysIn),'28','30','31']);
      choices = shuffleArray(Array.from(set)).slice(0,4);
      if(!choices.includes(String(daysIn))) choices[0]=String(daysIn);
    } else {
      const targetDow = p2rand(0,6);
      let firstDate = ((targetDow - startDow + 7)%7) + 1;
      if(firstDate>daysIn) firstDate -= 7;
      if(firstDate<1) firstDate += 7;
      q = 'วัน'+TH_DOW[targetDow]+'แรกของเดือนคือวันที่เท่าไร?';
      ansVal = String(firstDate);
      const set=new Set([String(firstDate)]); while(set.size<4){ const d=firstDate+p2rand(-3,7); if(d>=1&&d<=daysIn) set.add(String(d)); }
      choices = shuffleArray(Array.from(set)).slice(0,4);
      if(!choices.includes(String(firstDate))) choices[0]=String(firstDate);
    }
  }
  g.ansVal = ansVal; g.locked=false;
  $('calendar-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('calendar-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('calendar-month').textContent = '📅 เดือน'+month;
  $('calendar-q').textContent = q;
  $('calendar-hint').textContent = 'ดูปฏิทินให้ดี แล้วแตะคำตอบนะ';
  drawCalendarGrid(daysIn, startDow, highlight);
  const wrap = $('calendar-choices'); wrap.innerHTML='';
  choices.forEach(ch=>{
    const b = document.createElement('button'); b.className='cal-choice-btn'; b.textContent=ch;
    b.addEventListener('click', ()=>{ if(g.locked) return; playClick(); calendarAnswer(ch, b); });
    wrap.appendChild(b);
  });
}
function drawCalendarGrid(daysIn, startDow, highlight){
  let html='';
  TH_DOW_SHORT.forEach((d,i)=>{ html += '<div class="cal-head'+(i===0||i===6?' cal-wend':'')+'">'+d+'</div>'; });
  for(let i=0;i<startDow;i++) html += '<div class="cal-cell cal-blank"></div>';
  for(let d=1; d<=daysIn; d++){
    const col = (startDow+d-1)%7;
    const cls = 'cal-cell'+((col===0||col===6)?' cal-wend':'')+(d===highlight?' cal-hl':'');
    html += '<div class="'+cls+'">'+d+'</div>';
  }
  $('calendar-grid').innerHTML = html;
}
function calendarAnswer(val, btn){
  const g = calendarGame; if(g.locked) return;
  g.locked=true;
  const correct = val===g.ansVal;
  const btns = $('calendar-choices').querySelectorAll('.cal-choice-btn');
  btns.forEach(b=>{ if(b.textContent===g.ansVal) b.classList.add('correct'); });
  if(!correct) btn.classList.add('wrong');
  if(correct){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('calendar-hint').textContent = 'ถูกต้อง! 🎉';
    $('calendar-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'อ่านปฏิทิน'); else { g.level++; renderCalendarLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('calendar-hint').textContent = 'ยังไม่ถูกนะ ดูเฉลยแล้วลองข้อต่อไป!';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'อ่านปฏิทิน'); else { g.level++; renderCalendarLevel(); } }, 1700);
  }
}
$('calendar-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 5) เส้นเวลามหัศจรรย์ (Phase 3.3 — timeline engine)
   แตะบัตรเหตุการณ์แล้วแตะช่องบนเส้นเวลาเพื่อวางเรียงจาก "ก่อน → หลัง" (ซ้าย→ขวา)
   วางครบทุกช่องระบบตรวจอัตโนมัติ ถูก = ผ่าน, ผิด = บัตรที่ผิดเด้งกลับถาด (นับ 1 พลาด) ให้แก้ต่อ
   ด่าน 1-3 = 3 บัตร, 4-7 = 4 บัตร, 8-10 = 5 บัตร (ต้นสายที่ ป.4-6 ใช้ต่อ) ---------------- */
let timelineGame = null;
function timelineSize(level, max){ const s = level<=3 ? 3 : (level<=7 ? 4 : 5); return Math.min(s, max||5); }
function startTimelineGame(catId){
  const cat = beginSkillGame(catId, 'timeline', timelineView, 'timeline-cat-label');
  timelineGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, used:new Set(), maxSize:(cat.timelineMax||5), tag:(cat.timelineTag||null), locked:false };
  renderTimelineLevel();
  endSkillGameStart();
}
/* tag: หมวดที่ระบุ cat.timelineTag จะสุ่มเฉพาะชุดที่ติด tag เดียวกัน (เช่น 'p5' = ชุดประวัติศาสตร์/วิทย์ ป.5)
   ส่วนหมวดที่ไม่ระบุ tag จะสุ่มเฉพาะชุดพื้นฐานที่ไม่มี tag เหมือนเดิม */
function pickTimelineSet(size, used, tag){
  const want = tag || null;
  const idxs = TIMELINE_SETS.map((s,i)=>i).filter(i=>TIMELINE_SETS[i].items.length===size && (TIMELINE_SETS[i].tag||null)===want);
  let avail = idxs.filter(i=>!used.has(i));
  if(avail.length===0){ idxs.forEach(i=>used.delete(i)); avail = idxs.slice(); }
  const pick = avail[Math.floor(Math.random()*avail.length)];
  used.add(pick);
  return TIMELINE_SETS[pick];
}
function renderTimelineLevel(){
  const g = timelineGame;
  const size = timelineSize(g.level, g.maxSize);
  const set = pickTimelineSet(size, g.used, g.tag);
  g.set = set;
  g.order = set.items.map((it,i)=>({ e:it.e, l:it.l, ord:i }));
  g.slots = new Array(size).fill(null);
  g.tray = shuffleArray(g.order.slice());
  /* กันบัตรเรียงถูกอยู่แล้วตั้งแต่แรก (ถาดที่สับแล้วบังเอิญตรงลำดับ) */
  if(g.tray.every((c,i)=>c.ord===i) && size>1){ const t=g.tray[0]; g.tray[0]=g.tray[size-1]; g.tray[size-1]=t; }
  g.sel = null; g.locked = false;
  $('timeline-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('timeline-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('timeline-theme').innerHTML = '📜 เรียงให้ถูก: <b>'+set.theme+'</b> (เก่า → ใหม่)';
  $('timeline-hint').textContent = 'ลากบัตรไปวางบนเส้นเวลา (หรือแตะบัตรแล้วแตะช่องก็ได้) เรียงจากก่อนไปหลังนะ';
  renderTimelineBoard();
}
/* 🖐️ ลากบัตรเส้นเวลาไปวางบนช่อง (ผู้ใช้สั่ง 2026-08-17)
   ⚠ **เพิ่มทางลาก ไม่ได้แทนที่การแตะ** — โหมดเล่นด้วยมือหน้ากล้องใช้การ "คลิก" อย่างเดียว
     ถ้าเปลี่ยนเป็นลากอย่างเดียว เด็กที่เล่นด้วยมือจะเล่นเกมนี้ไม่ได้เลย
   ⚠ ขยับไม่ถึง TL_DRAG_MIN px = นับเป็น "แตะ" ปล่อยให้ handler เดิมทำงานต่อ
   ⚠ หา "ช่องที่ปล่อย" ด้วย `elementFromPoint` **ห้ามใช้ mouseover ของช่อง** — ghost ที่ลอยตามนิ้ว
     จะบังช่องไว้ทั้งหมด (ghost ตั้ง pointer-events:none แล้วแต่ยังต้องหาจากพิกัดจริงอยู่ดี) */
const TL_DRAG_MIN = 6;
function tlStartDrag(ev, card, fromSlot){
  const g = timelineGame;
  if(!g || g.locked || ev.button > 0) return;
  const src = ev.currentTarget;
  const x0 = ev.clientX, y0 = ev.clientY;
  let ghost = null, moved = false, over = null;
  const clearOver = ()=>{ if(over) over.classList.remove('tl-over'); over = null; };
  const move = e=>{
    if(!moved && Math.abs(e.clientX-x0) + Math.abs(e.clientY-y0) < TL_DRAG_MIN) return;
    if(!moved){
      moved = true;
      g.dragging = true;
      ghost = src.cloneNode(true);
      ghost.className = 'tl-card tl-drag-ghost';
      const r = src.getBoundingClientRect();
      ghost.style.width = r.width+'px'; ghost.style.height = r.height+'px';
      document.body.appendChild(ghost);
      src.classList.add('tl-dragging');
    }
    ghost.style.left = (e.clientX - 40)+'px';
    ghost.style.top  = (e.clientY - 34)+'px';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const slot = el && el.closest ? el.closest('.tl-slot') : null;
    if(slot !== over){ clearOver(); if(slot && !slot.classList.contains('tl-filled')) { over = slot; over.classList.add('tl-over'); } }
  };
  const up = e=>{
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    if(ghost) ghost.remove();
    src.classList.remove('tl-dragging');
    clearOver();
    if(!moved) return;                       /* ไม่ได้ลาก = ปล่อยให้ click เดิมทำงาน */
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const slot = el && el.closest ? el.closest('.tl-slot') : null;
    const idx = slot ? Array.prototype.indexOf.call(slot.parentNode.querySelectorAll('.tl-slot'), slot) : -1;
    if(idx >= 0 && !g.slots[idx]){
      playClick();
      if(fromSlot != null) g.slots[fromSlot] = null;
      else g.tray = g.tray.filter(c=>c!==card);
      g.slots[idx] = card;
      g.sel = null;
      renderTimelineBoard();
      maybeCheckTimeline();
    }else if(fromSlot != null && !slot){
      /* ลากออกนอกเส้นเวลา = เอากลับลงถาด (ทางถอยที่เด็กเดาได้เอง) */
      playClick();
      g.slots[fromSlot] = null; g.tray.push(card); g.sel = null;
      renderTimelineBoard();
    }
    /* กัน click ที่ตามหลัง pointerup ไปสลับ selection ทับผลของการลาก */
    setTimeout(()=>{ g.dragging = false; }, 0);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
}
function renderTimelineBoard(){
  const g = timelineGame;
  /* เส้นเวลา (ช่องวาง) */
  const slots = $('timeline-slots'); slots.innerHTML='';
  g.slots.forEach((card, i)=>{
    const slot = document.createElement('div');
    slot.className = 'tl-slot'+(card?' tl-filled':'');
    slot.innerHTML = '<div class="tl-slot-num">'+(i+1)+'</div>'+
      (card ? '<div class="tl-card tl-card-placed"><div class="tl-card-e">'+card.e+'</div><div class="tl-card-l">'+card.l+'</div></div>'
            : '<div class="tl-slot-empty">'+(i===0?'⭐ ก่อน':(i===g.slots.length-1?'ใหม่ 🏁':'▢'))+'</div>');
    if(card){
      const ce = slot.querySelector('.tl-card');
      if(ce) ce.addEventListener('pointerdown', ev=>tlStartDrag(ev, card, i));
    }
    slot.addEventListener('click', ()=>{
      if(g.locked || g.dragging) return;
      if(card){ playClick(); g.tray.push(card); g.slots[i]=null; g.sel=null; renderTimelineBoard(); }
      else if(g.sel){ playClick(); g.slots[i]=g.sel; g.tray = g.tray.filter(c=>c!==g.sel); g.sel=null; renderTimelineBoard(); maybeCheckTimeline(); }
    });
    slots.appendChild(slot);
    if(i < g.slots.length-1){ const ar=document.createElement('div'); ar.className='tl-arrow'; ar.textContent='➡️'; slots.appendChild(ar); }
  });
  /* ถาดบัตร */
  const tray = $('timeline-tray'); tray.innerHTML='';
  if(g.tray.length===0){ tray.innerHTML='<span class="tl-tray-empty">วางครบแล้ว กำลังตรวจ… 🔎</span>'; }
  g.tray.forEach(card=>{
    const b = document.createElement('button');
    b.className = 'tl-card tl-card-tray'+(g.sel===card?' tl-selected':'');
    b.innerHTML = '<div class="tl-card-e">'+card.e+'</div><div class="tl-card-l">'+card.l+'</div>';
    b.addEventListener('pointerdown', ev=>tlStartDrag(ev, card, null));
    b.addEventListener('click', ()=>{ if(g.locked || g.dragging) return; playClick(); g.sel = (g.sel===card?null:card); renderTimelineBoard(); });
    tray.appendChild(b);
  });
}
function maybeCheckTimeline(){
  const g = timelineGame;
  if(g.tray.length>0 || g.slots.some(s=>!s)) return;
  g.locked = true;
  const wrong = [];
  g.slots.forEach((card,i)=>{ if(card.ord!==i) wrong.push(i); });
  const slotEls = $('timeline-slots').querySelectorAll('.tl-slot');
  if(wrong.length===0){
    slotEls.forEach(el=>el.classList.add('tl-correct'));
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('timeline-hint').textContent = 'เรียงถูกหมดเลย! 🎉';
    $('timeline-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'เรียงเส้นเวลา'); else { g.level++; renderTimelineLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    wrong.forEach(i=>{ if(slotEls[i]) slotEls[i].classList.add('tl-wrong'); });
    $('timeline-hint').textContent = 'ยังมีบางใบสลับที่กันนะ ลองใหม่อีกครั้ง!';
    setTimeout(()=>{
      /* เด้งเฉพาะใบที่ผิดกลับถาด ใบที่ถูกตำแหน่งค้างไว้ */
      wrong.forEach(i=>{ g.tray.push(g.slots[i]); g.slots[i]=null; });
      g.sel=null; g.locked=false; renderTimelineBoard();
    }, 1500);
  }
}
$('timeline-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 6) จัดหมวดหมู่ลงตะกร้า (Phase 3.4 — sort engine)
   แตะของแล้วแตะตะกร้าให้ถูกประเภท จัดครบทุกชิ้นระบบตรวจอัตโนมัติ
   ถูก = ผ่าน, ผิด = เฉพาะชิ้นที่ผิดสั่นแดงแล้วเด้งกลับถาด (นับ 1 พลาด) ให้แก้ต่อ
   ใช้ร่วมกัน: นักสืบแม่เหล็ก (magnet) + จัดหมวดหมู่คำอังกฤษ (engword) ผ่าน cat.sortSet ---------------- */
let sortGame = null;
function sortItemCount(level){ return level<=3 ? 4 : (level<=7 ? 5 : 6); }
function startSortGame(catId){
  const cat = beginSkillGame(catId, 'sort', sortView, 'sort-cat-label');
  sortGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, pool:SORT_POOLS[cat.sortSet], sel:null, locked:false };
  renderSortLevel();
  endSkillGameStart();
}
function renderSortLevel(){
  const g = sortGame, pool = g.pool, n = sortItemCount(g.level), bins = pool.bins;
  const byBin = {}; bins.forEach(b=>byBin[b.k] = shuffleArray(pool.items.filter(it=>it.k===b.k)));
  const chosen = [];
  bins.forEach(b=>{ if(chosen.length<n && byBin[b.k].length) chosen.push(byBin[b.k].shift()); }); /* คุมให้ครบทุกตะกร้าก่อน */
  const rest = shuffleArray(bins.flatMap(b=>byBin[b.k]));
  while(chosen.length<n && rest.length) chosen.push(rest.shift());
  g.bins = bins;
  g.items = shuffleArray(chosen).map(it=>Object.assign({ bin:null, _wrong:false }, it));
  g.sel = null; g.locked = false;
  $('sort-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('sort-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('sort-prompt').textContent = pool.prompt;
  $('sort-hint').textContent = 'แตะของ แล้วแตะตะกร้าที่ถูกต้องนะ';
  renderSortBoard();
}
function sortChipInner(it){ return it.e ? '<span class="sort-e">'+it.e+'</span>'+(it.n?'<span class="sort-n">'+it.n+'</span>':'') : '<span class="sort-t">'+it.t+'</span>'; }
function renderSortBoard(){
  const g = sortGame;
  const binsWrap = $('sort-bins'); binsWrap.innerHTML=''; binsWrap.style.setProperty('--bin-count', g.bins.length);
  g.bins.forEach(bin=>{
    const el = document.createElement('div'); el.className='sort-bin';
    el.innerHTML = '<div class="sort-bin-label">'+bin.l+'</div>';
    const itemsBox = document.createElement('div'); itemsBox.className='sort-bin-items';
    g.items.filter(it=>it.bin===bin.k).forEach(it=>{
      const c = document.createElement('button'); c.className='sort-chip sort-chip-placed'+(it._wrong?' sort-wrong':'');
      c.innerHTML = sortChipInner(it);
      c.addEventListener('click', (e)=>{ if(g.locked) return; e.stopPropagation(); playClick(); it.bin=null; g.sel=null; renderSortBoard(); });
      itemsBox.appendChild(c);
    });
    el.appendChild(itemsBox);
    el.addEventListener('click', ()=>{ if(g.locked||!g.sel) return; playClick(); g.sel.bin=bin.k; g.sel=null; renderSortBoard(); maybeCheckSort(); });
    binsWrap.appendChild(el);
  });
  const tray = $('sort-tray'); tray.innerHTML='';
  const trayItems = g.items.filter(it=>it.bin===null);
  if(trayItems.length===0){ tray.innerHTML='<span class="sort-tray-empty">จัดครบแล้ว กำลังตรวจ… 🔎</span>'; }
  trayItems.forEach(it=>{
    const b = document.createElement('button'); b.className='sort-chip sort-chip-tray'+(g.sel===it?' sort-selected':'');
    b.innerHTML = sortChipInner(it);
    b.addEventListener('click', ()=>{ if(g.locked) return; playClick(); g.sel=(g.sel===it?null:it); renderSortBoard(); });
    tray.appendChild(b);
  });
}
function maybeCheckSort(){
  const g = sortGame;
  if(g.items.some(it=>it.bin===null)) return;
  g.locked = true;
  const wrong = g.items.filter(it=>it.bin!==it.k);
  if(wrong.length===0){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('sort-bins').querySelectorAll('.sort-bin').forEach(el=>el.classList.add('sort-bin-correct'));
    $('sort-hint').textContent = 'จัดถูกหมดเลย! 🎉';
    $('sort-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'จัดหมวดหมู่'); else { g.level++; renderSortLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    wrong.forEach(it=>it._wrong=true); renderSortBoard();
    $('sort-hint').textContent = 'มีบางชิ้นผิดตะกร้านะ ลองใหม่อีกครั้ง!';
    setTimeout(()=>{ wrong.forEach(it=>{ it.bin=null; it._wrong=false; }); g.sel=null; g.locked=false; renderSortBoard(); }, 1500);
  }
}
$('sort-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 7) โลกหมุน กลางวัน-กลางคืน (Phase 3.4b — world engine)
   ดวงอาทิตย์อยู่ทางซ้าย ฝั่งซ้ายของโลก (หันเข้าหาดวงอาทิตย์) = กลางวัน, ฝั่งขวา = กลางคืน
   กดปุ่มหมุนโลกให้ "บ้าน" ไปอยู่ฝั่งที่โจทย์บอก แล้วกดตรวจคำตอบ — สอนเรื่องโลกหมุนรอบตัวเอง ---------------- */
let worldGame = null;
function worldIsDay(a){ return Math.cos(a*Math.PI/180) < 0; } /* ซ้าย(ตะวันตก, หันเข้าดวงอาทิตย์) = กลางวัน */
function startWorldGame(catId){
  const cat = beginSkillGame(catId, 'world', worldView, 'world-cat-label');
  worldGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), angle:0, target:'day', zone:null, locked:false };
  renderWorldLevel();
  endSkillGameStart();
}
/* ป.5-6: ไม่ใช่แค่กลางวัน/กลางคืน แต่ต้องหมุนให้ตรง "ช่วงเวลา" ทั้ง 4 ช่วง
   ดวงอาทิตย์อยู่ทางซ้าย → มุม 180° = เที่ยงวัน, 0° = เที่ยงคืน, 90° = เย็น (กำลังหมุนออกจากแดด), 270° = เช้า */
const WORLD_ZONES = [
  { k:'noon',     deg:180, name:'เที่ยงวัน ☀️',  hint:'ให้บ้านหันเข้าหาดวงอาทิตย์เต็มที่' },
  { k:'sunset',   deg:90,  name:'ตอนเย็น 🌇',   hint:'ให้บ้านอยู่ขอบพอดี กำลังจะหมุนพ้นแสงอาทิตย์' },
  { k:'midnight', deg:0,   name:'เที่ยงคืน 🌙', hint:'ให้บ้านอยู่ฝั่งตรงข้ามดวงอาทิตย์พอดี' },
  { k:'sunrise',  deg:270, name:'ตอนเช้ามืด 🌅', hint:'ให้บ้านอยู่ขอบพอดี กำลังจะหมุนเข้าหาแสงอาทิตย์' }
];
function worldZoneOf(angle){
  const a = ((angle % 360) + 360) % 360;
  let best = WORLD_ZONES[0], bd = 999;
  WORLD_ZONES.forEach(z=>{ let d = Math.abs(a - z.deg); if(d>180) d = 360-d; if(d < bd){ bd = d; best = z; } });
  return best.k;
}
function renderWorldLevel(){
  const g = worldGame;
  if(g.hard){
    /* ป.5 ยอมคลาดเคลื่อนได้ 1 ช่อง (30°) ป.6 ต้องตรงช่วงเวลาพอดีขึ้น */
    const z = p2pick(WORLD_ZONES);
    g.zone = z.k; g.target = (z.k==='noon') ? 'day' : (z.k==='midnight' ? 'night' : 'edge');
    let a = Math.floor(Math.random()*12)*30;
    while(worldZoneOf(a) === z.k) a = (a + 90) % 360;
    g.angle = a; g.locked = false;
    $('world-level-counter').textContent = g.level+'/'+g.totalLevels;
    $('world-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
    $('world-target').innerHTML = 'หมุนโลกให้บ้านของเราเป็นตอน <b>'+z.name+'</b>';
    $('world-hint').textContent = z.hint;
    positionWorldMarker();
    return;
  }
  g.target = Math.random()<0.5 ? 'day' : 'night';
  /* สุ่มมุมเริ่มเป็นทวีคูณ 30 ที่ "ยังไม่ตรง" กับเป้า เพื่อให้ต้องหมุนจริง */
  let a = Math.floor(Math.random()*12)*30;
  if((worldIsDay(a) ? 'day':'night') === g.target) a = (a+180)%360;
  g.angle = a; g.locked = false;
  $('world-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('world-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('world-target').innerHTML = 'หมุนโลกให้บ้านของเราเป็นตอน <b>'+(g.target==='day'?'กลางวัน ☀️':'กลางคืน 🌙')+'</b>';
  $('world-hint').textContent = 'ฝั่งที่หันเข้าหาดวงอาทิตย์คือกลางวันนะ';
  positionWorldMarker();
}
function positionWorldMarker(){
  const g = worldGame, a = g.angle*Math.PI/180;
  const mk = $('world-marker');
  mk.style.left = (50 + 38*Math.cos(a)) + '%';
  mk.style.top  = (50 - 38*Math.sin(a)) + '%';
  const day = worldIsDay(g.angle);
  $('world-state').innerHTML = 'ตอนนี้บ้านอยู่ฝั่ง '+(day?'<span class="ws-day">กลางวัน ☀️</span>':'<span class="ws-night">กลางคืน 🌙</span>');
}
function rotateWorld(delta){
  const g = worldGame; if(g.locked) return;
  playClick();
  g.angle = (g.angle + delta + 360) % 360;
  positionWorldMarker();
}
function checkWorld(){
  const g = worldGame; if(g.locked) return;
  const day = worldIsDay(g.angle);
  const correct = g.hard ? (worldZoneOf(g.angle) === g.zone) : ((g.target==='day') === day);
  if(correct){
    g.locked = true; playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('world-hint').textContent = 'ถูกต้อง! เก่งมากเลย 🎉';
    $('world-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    $('world-globe').classList.add('world-correct');
    setTimeout(()=>{ $('world-globe').classList.remove('world-correct'); if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'หมุนโลก'); else { g.level++; renderWorldLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('world-hint').textContent = 'ยังไม่ถูกนะ ลองหมุนโลกอีกนิด แล้วตรวจใหม่!';
    $('world-globe').classList.add('world-shake');
    setTimeout(()=>$('world-globe').classList.remove('world-shake'), 450);
  }
}
$('world-rot-left').addEventListener('click', ()=>rotateWorld(30));
$('world-rot-right').addEventListener('click', ()=>rotateWorld(-30));
$('world-check').addEventListener('click', ()=>{ if(!worldGame||worldGame.locked) return; playClick(); checkWorld(); });
$('world-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 8) ขุมทรัพย์พิกัด (coord engine)
   อ่านพิกัดตาราง: คอลัมน์เป็นตัวอักษร A-B-C หัวตาราง, แถวเป็นเลข 1-2-3 ด้านซ้าย
   โจทย์ "สมบัติอยู่ที่ช่อง B แถว 3" → แตะช่องให้ถูก เจอสมบัติ 💰 / แตะผิดเจอปู 🦀 (นับพลาด ให้ลองใหม่)
   ด่าน 1-3 = 3×3, 4-6 = 4×4, 7-10 = 5×5 — พื้นฐานการอ่านตาราง/กราฟ ---------------- */
let coordGame = null;
const COORD_COLS = ['A','B','C','D','E','F'];
function coordSize(level, hard){
  if(hard==='p6') return level<=3 ? 6 : (level<=6 ? 7 : 8);
  if(hard==='p5') return level<=3 ? 5 : (level<=6 ? 6 : 7);
  return level<=3 ? 3 : (level<=6 ? 4 : 5);
}
function startCoordGame(catId){
  const cat = beginSkillGame(catId, 'coord', coordView, 'coord-cat-label');
  coordGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), locked:false };
  renderCoordLevel();
  endSkillGameStart();
}
function renderCoordLevel(){
  const g = coordGame, n = coordSize(g.level, g.hard);
  g.size = n; g.target = { r:p2rand(0,n-1), c:p2rand(0,n-1) }; g.locked = false;
  $('coord-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('coord-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('coord-q').innerHTML = '🏴‍☠️ สมบัติซ่อนอยู่ที่ช่อง <b>'+COORD_COLS[g.target.c]+' แถว '+(g.target.r+1)+'</b><br>แตะช่องนั้นเพื่อขุดสมบัติ!';
  $('coord-hint').textContent = 'ดูตัวอักษรบนหัวตาราง (คอลัมน์) กับเลขด้านซ้าย (แถว) นะ';
  renderCoordGrid();
}
function renderCoordGrid(){
  const g = coordGame, n = g.size, grid = $('coord-grid'); grid.innerHTML='';
  grid.style.gridTemplateColumns = 'minmax(26px,0.55fr) repeat('+n+',minmax(0,1fr))';
  const head=(txt,cls)=>{ const d=document.createElement('div'); d.className='coord-head '+(cls||''); d.textContent=txt; return d; };
  grid.appendChild(head('🧭','coord-corner'));
  for(let c=0;c<n;c++) grid.appendChild(head(COORD_COLS[c]));
  for(let r=0;r<n;r++){
    grid.appendChild(head(r+1));
    for(let c=0;c<n;c++){
      const el=document.createElement('button'); el.className='coord-cell'; el.dataset.r=r; el.dataset.c=c;
      el.addEventListener('click', ()=>coordTap(r,c,el));
      grid.appendChild(el);
    }
  }
}
function coordTap(r,c,el){
  const g = coordGame; if(g.locked) return; playClick();
  if(r===g.target.r && c===g.target.c){
    g.locked=true; el.classList.add('coord-found'); el.textContent='💰';
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('coord-hint').textContent = 'เจอสมบัติแล้ว! 🎉';
    $('coord-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'ขุดสมบัติ'); else { g.level++; renderCoordLevel(); } }, 1300);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    el.classList.add('coord-miss'); el.textContent = p2pick(['🦀','🌊','🐚','🪨']);
    $('coord-hint').textContent = 'ยังไม่ใช่ช่องนี้นะ ลองอ่านพิกัดอีกครั้ง!';
    setTimeout(()=>{ el.classList.remove('coord-miss'); el.textContent=''; }, 950);
  }
}
$('coord-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });




/* ============================= เกม ป.4 — engine ใหม่ 3 แบบ =============================
   1) chart  : อ่านแผนภูมิแท่ง (ค 3.1 ป.4) — ดูกราฟแล้วตอบคำถาม 4 ตัวเลือก
   2) area   : พื้นที่ตารางหน่วย (ค 2.1 ป.4) — แตะระบายช่องให้ได้พื้นที่/รูปตามโจทย์ แล้วกดตรวจ
   3) angle  : มุม (ค 2.1 ป.4) — ลากแขนมุมให้ได้องศาตามโจทย์ (snap 5°) แล้วกดตรวจ
   ทั้ง 3 เกมใช้ผลลัพธ์/ดาวร่วมกับ finishP2Game (เกณฑ์ mistakes 0→3, ≤4→2, else→1) เหมือนเกมทักษะอื่น
   ============================================================================ */

/* ---------------- 1) อ่านแผนภูมิแท่ง ---------------- */
let chartGame = null;
const CHART_SETS = [
  { title:'ผลไม้ที่เพื่อนๆ ชอบ (คน)', unit:'คน', items:[{e:'🍎',n:'แอปเปิล'},{e:'🍌',n:'กล้วย'},{e:'🍇',n:'องุ่น'},{e:'🍊',n:'ส้ม'},{e:'🍉',n:'แตงโม'}] },
  { title:'กีฬาที่นักเรียนเล่น (คน)', unit:'คน', items:[{e:'⚽',n:'ฟุตบอล'},{e:'🏀',n:'บาส'},{e:'🏸',n:'แบด'},{e:'🏓',n:'ปิงปอง'},{e:'🏊',n:'ว่ายน้ำ'}] },
  { title:'สัตว์เลี้ยงในหมู่บ้าน (ตัว)', unit:'ตัว', items:[{e:'🐶',n:'สุนัข'},{e:'🐱',n:'แมว'},{e:'🐰',n:'กระต่าย'},{e:'🐦',n:'นก'},{e:'🐢',n:'เต่า'}] },
  { title:'หนังสือที่ยืมแต่ละวัน (เล่ม)', unit:'เล่ม', items:[{e:'📕',n:'จันทร์'},{e:'📗',n:'อังคาร'},{e:'📘',n:'พุธ'},{e:'📙',n:'พฤหัส'},{e:'📓',n:'ศุกร์'}] },
  { title:'ต้นไม้ที่ปลูกแต่ละห้อง (ต้น)', unit:'ต้น', items:[{e:'🌳',n:'ป.4/1'},{e:'🌴',n:'ป.4/2'},{e:'🌲',n:'ป.4/3'},{e:'🌵',n:'ป.4/4'},{e:'🪴',n:'ป.4/5'}] }
];
function chartBarCount(level, hard){
  if(hard==='p6') return level<=3 ? 5 : (level<=7 ? 6 : 7);
  if(hard==='p5') return level<=3 ? 4 : (level<=7 ? 5 : 6);
  return level<=3 ? 3 : (level<=7 ? 4 : 5);
}
/* ค่าของแท่ง: เด็กเล็กใช้ 1-10, ป.5 ใช้เลขสองหลัก, ป.6 ใช้พหุคูณของ 5 เพื่อให้คิดเฉลี่ย/เท่าตัวได้ลงตัว */
function chartValuePool(hard){
  if(hard==='p6') return [10,15,20,25,30,35,40,45,50,60];
  if(hard==='p5') return [4,6,8,10,12,14,16,18,20,24];
  return [1,2,3,4,5,6,7,8,9,10];
}
function startChartGame(catId){
  const cat = beginSkillGame(catId, 'chart', chartView, 'chart-cat-label');
  chartGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), locked:false };
  renderChartLevel();
  endSkillGameStart();
}
function renderChartLevel(){
  const g = chartGame, n = chartBarCount(g.level, g.hard);
  const set = p2pick(CHART_SETS);
  const items = shuffleArray(set.items.slice()).slice(0, n);
  /* ค่าของแต่ละแท่งไม่ซ้ำกัน เพื่อให้ "มากที่สุด/น้อยที่สุด" มีคำตอบเดียวเสมอ */
  const pool = shuffleArray(chartValuePool(g.hard).slice()).slice(0, n);
  g.data = items.map((it,i)=>({ ...it, v:pool[i] }));
  g.unit = set.unit;
  g.locked = false;
  $('chart-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('chart-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('chart-title').textContent = '📊 '+set.title;
  $('chart-hint').textContent = 'อ่านความสูงของแท่งแล้วเลือกคำตอบนะ';
  const max = Math.max(...g.data.map(d=>d.v));
  $('chart-plot').innerHTML = g.data.map(d=>
    '<div class="chart-bar-wrap">'+
      '<div class="chart-bar-val">'+d.v+'</div>'+
      '<div class="chart-bar" style="height:'+Math.round(d.v/max*160)+'px"></div>'+
      '<div class="chart-bar-label">'+d.e+'</div>'+
      '<div class="chart-bar-name">'+d.n+'</div>'+
    '</div>').join('');
  buildChartQuestion();
}
function buildChartQuestion(){
  const g = chartGame, d = g.data;
  const sorted = d.slice().sort((a,b)=>b.v-a.v);
  let kinds;
  if(g.hard==='p6') kinds = g.level<=3 ? ['diff','total','more','rank'] : (g.level<=7 ? ['total','avg','rank','sumtop'] : ['avg','twice','sumtop','diff']);
  else if(g.hard==='p5') kinds = g.level<=3 ? ['max','min','value','diff'] : (g.level<=7 ? ['diff','total','more','rank'] : ['total','rank','sumtop','diff']);
  else kinds = g.level<=3 ? ['max','min','value'] : (g.level<=7 ? ['max','min','value','total'] : ['diff','total','more','value']);
  let kind = p2pick(kinds);
  const sum = d.reduce((a,x)=>a+x.v,0);
  /* กันโจทย์ที่คำตอบไม่ลงตัว: ค่าเฉลี่ยต้องหารลงตัว, "กี่เท่า" ต้องหารลงตัวและมากกว่า 1 เท่า */
  if(kind==='avg' && sum % d.length !== 0) kind = 'total';
  if(kind==='twice' && !(sorted[0].v % sorted[sorted.length-1].v === 0 && sorted[0].v !== sorted[sorted.length-1].v)) kind = 'diff';
  let q, ans;
  if(kind==='max'){ q='อะไรมีจำนวนมากที่สุด?'; ans=sorted[0].n; }
  else if(kind==='min'){ q='อะไรมีจำนวนน้อยที่สุด?'; ans=sorted[sorted.length-1].n; }
  else if(kind==='value'){ const pick=p2pick(d); q=pick.n+' '+pick.e+' มีเท่าไร?'; ans=pick.v+' '+g.unit; }
  else if(kind==='total'){ q='ทั้งหมดรวมกันได้เท่าไร?'; ans=d.reduce((a,x)=>a+x.v,0)+' '+g.unit; }
  else if(kind==='diff'){ q=sorted[0].n+' มากกว่า '+sorted[sorted.length-1].n+' อยู่เท่าไร?'; ans=(sorted[0].v-sorted[sorted.length-1].v)+' '+g.unit; }
  else if(kind==='avg'){ q='ทั้งหมดเฉลี่ยแล้วได้เท่าไรต่อหนึ่งอย่าง?'; ans=(sum/d.length)+' '+g.unit; }
  else if(kind==='twice'){ const hi=sorted[0], lo=sorted[sorted.length-1]; q=hi.n+' เป็นกี่เท่าของ '+lo.n+'?'; ans=(hi.v/lo.v)+' เท่า'; }
  else if(kind==='rank'){ const nth = Math.min(2, sorted.length-1); q='อะไรมีจำนวนมากเป็นอันดับที่ '+(nth+1)+'?'; ans=sorted[nth].n; }
  else if(kind==='sumtop'){ q='สองอันดับที่มากที่สุดรวมกันได้เท่าไร?'; ans=(sorted[0].v+sorted[1].v)+' '+g.unit; }
  else { const a=d[0], b=d[1]; q=a.n+' กับ '+b.n+' รวมกันได้เท่าไร?'; ans=(a.v+b.v)+' '+g.unit; }
  /* ตัวเลือกลวง: ชื่อรายการอื่น (สำหรับคำถามแบบชื่อ) หรือจำนวนใกล้เคียง (สำหรับคำถามแบบตัวเลข) */
  let choices;
  if(kind==='max' || kind==='min' || kind==='rank'){
    choices = shuffleArray(d.map(x=>x.n)).slice(0,4);
    if(!choices.includes(ans)){ choices[0]=ans; }
  } else if(kind==='twice'){
    const num = parseInt(ans,10);
    const set = new Set([num]); let guard=0;
    while(set.size<4 && guard++<40){ const v = num + p2rand(1,3)*(Math.random()<0.5?-1:1); if(v>1) set.add(v); }
    choices = shuffleArray([...set]).map(v=>v+' เท่า');
  } else {
    const num = parseInt(ans,10);
    const set = new Set([num]);
    let guard=0;
    while(set.size<4 && guard++<40){
      const delta = p2rand(1,4) * (Math.random()<0.5?-1:1);
      const v = num+delta;
      if(v>0) set.add(v);
    }
    choices = shuffleArray([...set]).map(v=>v+' '+g.unit);
  }
  g.answer = ans;
  $('chart-q').textContent = q;
  const box = $('chart-choices'); box.innerHTML='';
  shuffleArray(choices).forEach(c=>{
    const b=document.createElement('button'); b.className='chart-choice'; b.textContent=c;
    b.addEventListener('click', ()=>chartAnswer(b, c));
    box.appendChild(b);
  });
}
function chartAnswer(btn, choice){
  const g = chartGame; if(g.locked) return;
  playClick();
  if(choice===g.answer){
    g.locked=true; btn.classList.add('correct');
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('chart-hint').textContent = 'อ่านกราฟเก่งมาก! 🎉';
    $('chart-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'อ่านแผนภูมิ'); else { g.level++; renderChartLevel(); } }, 1200);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    btn.classList.add('wrong');
    $('chart-hint').textContent = 'ยังไม่ใช่นะ ลองดูความสูงของแท่งอีกครั้ง';
    setTimeout(()=>btn.classList.remove('wrong'), 500);
  }
}
$('chart-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 2) พื้นที่ตารางหน่วย ---------------- */
let areaGame = null;
function startAreaGame(catId){
  const cat = beginSkillGame(catId, 'area', areaView, 'area-cat-label');
  areaGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), locked:false, on:new Set() };
  renderAreaLevel();
  endSkillGameStart();
}
function renderAreaLevel(){
  const g = areaGame;
  /* ป.5-6 ใช้กริดใหญ่ขึ้นและเข้าโหมดสี่เหลี่ยมผืนผ้าเร็วกว่า (ป.6 เป็นสี่เหลี่ยมตั้งแต่ด่านแรก) */
  const n = g.hard==='p6' ? (g.level<=4 ? 7 : 8) : (g.hard==='p5' ? (g.level<=4 ? 6 : 7) : (g.level<=4 ? 5 : 6));
  const freeUntil = g.hard==='p6' ? 0 : (g.hard==='p5' ? 2 : 4);
  g.size = n; g.on.clear(); g.locked=false;
  /* ด่านต้น = ระบายให้ได้พื้นที่ตามจำนวน (รูปอิสระ), ด่านหลัง = ต้องเป็นสี่เหลี่ยมผืนผ้าตามกว้าง×ยาว */
  if(g.level<=freeUntil){
    g.mode='count'; g.target = p2rand(g.hard?8:4, Math.min(g.hard?24:12, n*n-4));
    $('area-q').innerHTML = '🎨 ระบายสีให้ได้พื้นที่ <b>'+g.target+' ตารางหน่วย</b>';
    $('area-hint').textContent = 'แตะช่องเพื่อระบายสี แตะซ้ำเพื่อลบ แล้วกดตรวจคำตอบ';
  } else {
    g.mode='rect';
    g.w = p2rand(g.hard?3:2, n-1); g.h = p2rand(g.hard?3:2, n-1);
    g.target = g.w*g.h;
    $('area-q').innerHTML = '🟧 ระบายเป็นสี่เหลี่ยมผืนผ้า <b>กว้าง '+g.w+' ยาว '+g.h+'</b> ช่อง (พื้นที่ '+g.target+' ตารางหน่วย)';
    $('area-hint').textContent = 'ระบายให้ต่อกันเป็นสี่เหลี่ยมผืนผ้าตามขนาดที่โจทย์บอก';
  }
  $('area-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('area-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  renderAreaGrid();
  updateAreaTally();
}
function renderAreaGrid(){
  const g = areaGame, grid = $('area-grid');
  grid.style.gridTemplateColumns = 'repeat('+g.size+', minmax(0, auto))';
  grid.innerHTML='';
  for(let r=0;r<g.size;r++){
    for(let c=0;c<g.size;c++){
      const b=document.createElement('button');
      b.className='area-cell'+(g.on.has(r+'-'+c)?' on':'');
      b.dataset.r=r; b.dataset.c=c;
      b.addEventListener('click', ()=>areaToggle(r,c,b));
      grid.appendChild(b);
    }
  }
}
function areaToggle(r,c,el){
  const g = areaGame; if(g.locked) return;
  const k = r+'-'+c;
  if(g.on.has(k)){ g.on.delete(k); el.classList.remove('on'); }
  else { g.on.add(k); el.classList.add('on'); }
  playClick();
  updateAreaTally();
}
function updateAreaTally(){
  const g = areaGame;
  $('area-tally').textContent = 'ระบายแล้ว '+g.on.size+' ตารางหน่วย (ต้องการ '+g.target+')';
}
function areaIsRectangle(){
  const g = areaGame;
  if(g.on.size===0) return false;
  const cells = [...g.on].map(k=>k.split('-').map(Number));
  const rs = cells.map(c=>c[0]), cs = cells.map(c=>c[1]);
  const r0=Math.min(...rs), r1=Math.max(...rs), c0=Math.min(...cs), c1=Math.max(...cs);
  const h = r1-r0+1, w = c1-c0+1;
  if(h*w !== g.on.size) return false;                 /* ต้องเต็มกรอบพอดี ไม่มีรู */
  return (w===g.w && h===g.h) || (w===g.h && h===g.w); /* วางแนวไหนก็ได้ */
}
function areaCheck(){
  const g = areaGame; if(g.locked) return;
  playClick();
  const ok = g.mode==='count' ? (g.on.size===g.target) : areaIsRectangle();
  if(ok){
    g.locked=true;
    $('area-grid').querySelectorAll('.area-cell.on').forEach(el=>el.classList.add('good'));
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('area-hint').textContent = 'พื้นที่ถูกต้องเลย! 🎉';
    $('area-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'หาพื้นที่'); else { g.level++; renderAreaLevel(); } }, 1300);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('area-grid').querySelectorAll('.area-cell.on').forEach(el=>el.classList.add('bad'));
    $('area-hint').textContent = g.mode==='count'
      ? 'จำนวนช่องยังไม่ตรงกับโจทย์นะ ลองนับใหม่'
      : 'ยังไม่เป็นสี่เหลี่ยมผืนผ้าตามขนาดที่โจทย์บอกนะ';
    setTimeout(()=>$('area-grid').querySelectorAll('.area-cell.bad').forEach(el=>el.classList.remove('bad')), 600);
  }
}
$('area-check').addEventListener('click', areaCheck);
$('area-clear').addEventListener('click', ()=>{ const g=areaGame; if(!g||g.locked) return; playClick(); g.on.clear(); renderAreaGrid(); updateAreaTally(); });
$('area-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 3) มุมมหัศจรรย์ ----------------
   ลากจุดจับที่ปลายแขนมุม (snap ทีละ 5°) ให้ได้องศาตามโจทย์ แล้วกดตรวจ — ยอมรับคลาดเคลื่อน ±2° */
let angleGame = null;
const ANGLE_TARGETS = [[30,45,60,90],[30,45,60,90,120,135],[15,25,40,75,105,150,165]];
/* ป.5-6: มุมละเอียดขึ้นทีละ 5 องศา และมีมุมป้าน/มุมกลับให้ประมาณค่าแม่นขึ้น */
const ANGLE_TARGETS_P5 = [[35,50,65,80],[25,55,70,95,110,130],[15,40,85,105,125,145,160]];
const ANGLE_TARGETS_P6 = [[35,55,75,95],[25,65,85,115,140,155],[20,50,70,100,130,170,175]];
function angleName(deg){ return deg<90 ? 'มุมแหลม' : (deg===90 ? 'มุมฉาก' : (deg<180 ? 'มุมป้าน' : 'มุมตรง')); }
function startAngleGame(catId){
  stopARGame();
  lastGameType='angle'; lastCatId=catId;
  const cat = catById(catId);
  angleGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, hard:(cat.hard||null), deg:0, locked:false };
  showOnlyView(angleView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  angleView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('angle-cat-label', cat);
  buildAngleGuides();
  renderAngleLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}
/* เส้นไกด์ทุก 15° ช่วยให้เด็กกะองศาได้ */
function buildAngleGuides(){
  let out='';
  for(let a=0; a<=180; a+=15){
    const rad = a*Math.PI/180;
    out += '<line class="angle-guide" x1="100" y1="150" x2="'+(100+92*Math.cos(rad)).toFixed(1)+'" y2="'+(150-92*Math.sin(rad)).toFixed(1)+'"/>';
  }
  $('angle-guides').innerHTML = out;
}
function renderAngleLevel(){
  const g = angleGame;
  const band = g.level<=3 ? 0 : (g.level<=7 ? 1 : 2);
  const bank = g.hard==='p6' ? ANGLE_TARGETS_P6 : (g.hard==='p5' ? ANGLE_TARGETS_P5 : ANGLE_TARGETS);
  g.target = p2pick(bank[band]);
  g.deg = 0; g.locked = false;
  $('angle-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('angle-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('angle-q').innerHTML = '📐 ลากให้เป็นมุม <b>'+g.target+' องศา</b> ('+angleName(g.target)+')';
  $('angle-hint').textContent = 'ลากจุดวงกลมสีขาวไปรอบๆ แล้วกดตรวจคำตอบ';
  updateAngleArm();
}
function updateAngleArm(){
  const g = angleGame, rad = g.deg*Math.PI/180;
  const x = 100 + 85*Math.cos(rad), y = 150 - 85*Math.sin(rad);
  $('angle-arm-move').setAttribute('x2', x.toFixed(1));
  $('angle-arm-move').setAttribute('y2', y.toFixed(1));
  $('angle-handle').setAttribute('cx', x.toFixed(1));
  $('angle-handle').setAttribute('cy', y.toFixed(1));
  /* ส่วนโค้งแสดงขนาดมุม */
  const r = 38, large = g.deg>180 ? 1 : 0;
  const ex = 100 + r*Math.cos(rad), ey = 150 - r*Math.sin(rad);
  $('angle-arc').setAttribute('d', g.deg<=0 ? '' : 'M 100 150 L '+(100+r)+' 150 A '+r+' '+r+' 0 '+large+' 0 '+ex.toFixed(1)+' '+ey.toFixed(1)+' Z');
  $('angle-readout').textContent = g.deg+'°';
}
function angleFromEvent(e){
  const svg = $('angle-svg'), rect = svg.getBoundingClientRect();
  const px = (e.clientX-rect.left)/rect.width*200, py = (e.clientY-rect.top)/rect.height*200;
  let deg = Math.atan2(150-py, px-100)*180/Math.PI;
  if(deg<0) deg = 0;
  if(deg>180) deg = 180;
  return Math.round(deg/5)*5;   /* snap ทีละ 5 องศา */
}
(function wireAngleDrag(){
  const svg = $('angle-svg');
  if(!svg) return;
  let dragging=false;
  const move = e=>{ if(!dragging || !angleGame || angleGame.locked) return; angleGame.deg = angleFromEvent(e); updateAngleArm(); e.preventDefault(); };
  svg.addEventListener('pointerdown', e=>{ if(!angleGame || angleGame.locked) return; dragging=true; svg.setPointerCapture(e.pointerId); angleGame.deg = angleFromEvent(e); updateAngleArm(); });
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', ()=>{ dragging=false; });
  svg.addEventListener('pointercancel', ()=>{ dragging=false; });
})();
function angleCheck(){
  const g = angleGame; if(!g || g.locked) return;
  playClick();
  if(Math.abs(g.deg-g.target)<=2){
    g.locked=true; playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('angle-hint').textContent = 'ตรงเป๊ะเลย! เป็น'+angleName(g.target)+' 🎉';
    $('angle-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'สร้างมุม'); else { g.level++; renderAngleLevel(); } }, 1300);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    const diff = g.deg-g.target;
    $('angle-hint').textContent = diff>0 ? 'มุมกว้างเกินไปนิดนึง ลองหมุนกลับลงมา' : 'มุมยังแคบไปหน่อย ลองกางออกอีกนิด';
  }
}
$('angle-check').addEventListener('click', angleCheck);
$('angle-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });


/* ============================= CLOCK GAME (นาฬิกาวิเศษ 1/2/3 — ลากหมุนเข็มนาฬิกา) ============================= */
/* clockMode 1: ด่าน 1-5 ชั่วโมงตรง, 6-10 "x โมงครึ่ง"
   clockMode 2: ด่าน 1-5 นาทีหาร 5 ลงตัว, 6-10 นาทีใดๆ (snap เข็ม 1 นาที + ปุ่ม ±1 นาที)
   clockMode 3: โชว์เวลาตั้งต้นบนหน้าปัด โจทย์ "อีก N ชั่วโมงจะเป็นกี่โมง?" (N สุ่ม 1-3) — ด่าน 1-6 ตั้งต้นชั่วโมงตรง, 7-10 มีนาทีหาร 5 ลงตัวติดมาด้วย
   clockMode 4: เหมือน mode 3 แต่ offset มีนาทีด้วย "อีก N ชั่วโมง M นาที" (M หาร 5 ลงตัว, นาทีรวมเกิน 60 ทดชั่วโมงเพิ่ม) — ด่าน 1-6 ตั้งต้นชั่วโมงตรง, 7-10 ตั้งต้นมีนาทีหาร 5
   กรอบนาฬิกาสุ่ม 1 จาก CLOCK_FRAMES ทุกครั้งที่เข้าเกม (ตกแต่งรอบหน้าปัด + สี bezel ผ่าน CSS class .frame-*) */
let clockGame = null; // {catId, mode, level, totalLevels, mistakes, h, m, target:{h,m}, startTime, offsetH, snap, used:Set, locked, drag, angles:{hour,minute}}
const CLOCK_FRAMES = ['owl','cat','flower','sun','bear'];
const CLOCK_NUM_COLORS = ['#E4574F','#E0813F','#D9A821','#7CB342','#2FAE86','#3EC6C6','#4A9EDF','#5B6EE8','#7E57C2','#B25D9E','#E45788','#E4574F'];

function clockTimeText(h, m){
  if(m===0) return h+' โมง';
  if(m===30) return h+' โมงครึ่ง';
  return h+' โมง '+m+' นาที';
}

/* อ่านโจทย์ด้วยเสียงพูดไทย — เรียก cancel()+speak() ตรงๆ ใน user gesture (ห้ามหน่วง setTimeout ไม่งั้น iOS Safari บล็อกเสียง — ดู speakListenWord) */
function speakClockText(text){
  try{
    const synth = window.speechSynthesis; if(!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'th-TH'; u.rate = 0.85;
    const voice = pickThaiVoice(); if(voice) u.voice = voice;
    synth.cancel();
    primeSpeechOnce();
    synth.speak(u);
  }catch(e){}
}

/* สร้างหน้าปัดนาฬิกาลง #clock-svg (ครั้งเดียวตอนเข้าเกม): ขีดนาที 60 ขีด, เลข 1-12 สีพาสเทลไล่โทน, หน้ายิ้ม, เข็ม 2 เข็ม (มี hit area โปร่งใสกว้างให้นิ้วเด็กจับง่าย) */
function buildClockFace(){
  const svg = $('clock-svg');
  let s = '';
  s += '<circle cx="120" cy="120" r="114" class="clock-bezel"/>';
  s += '<circle cx="120" cy="120" r="103" class="clock-face-bg"/>';
  for(let i=0;i<60;i++){
    const a = i*6*Math.PI/180;
    const major = i%5===0;
    const r1 = major?90:95, r2 = 99;
    s += '<line x1="'+(120+r1*Math.sin(a)).toFixed(1)+'" y1="'+(120-r1*Math.cos(a)).toFixed(1)+'" x2="'+(120+r2*Math.sin(a)).toFixed(1)+'" y2="'+(120-r2*Math.cos(a)).toFixed(1)+'" class="'+(major?'clock-tick-major':'clock-tick-minor')+'"/>';
  }
  for(let n=1;n<=12;n++){
    const a = n*30*Math.PI/180;
    s += '<text x="'+(120+76*Math.sin(a)).toFixed(1)+'" y="'+(120-76*Math.cos(a)+8).toFixed(1)+'" class="clock-num" fill="'+CLOCK_NUM_COLORS[n-1]+'">'+n+'</text>';
  }
  /* หน้ายิ้มใต้จุดหมุน — สลับอารมณ์ผ่าน class บน svg (.happy/.sad) เหมือนหม้อผสมสี */
  s += '<g class="clock-face-emote">'
    +  '<circle cx="106" cy="146" r="4.2" class="cfe-eye"/><circle cx="134" cy="146" r="4.2" class="cfe-eye"/>'
    +  '<circle cx="99" cy="155" r="4.5" class="cfe-cheek"/><circle cx="141" cy="155" r="4.5" class="cfe-cheek"/>'
    +  '<path d="M111 156 Q120 163 129 156" class="cfe-mouth cfe-mouth-smile"/>'
    +  '<path d="M111 161 Q120 154 129 161" class="cfe-mouth cfe-mouth-sad"/>'
    +  '<path d="M108 154 Q120 168 132 154" class="cfe-mouth cfe-mouth-grin"/>'
    +  '</g>';
  /* เข็มยาววาดก่อน เข็มสั้นวาดทีหลัง = เข็มสั้นอยู่หน้าเสมอ (ตอนซ้อนกันเด็กยังเห็น/จับเข็มสั้นได้) */
  s += '<g class="clock-hand-g clock-minute-g" id="clock-minute-g">'
    +  '<line x1="120" y1="134" x2="120" y2="36" class="clock-hand-grab"/>'
    +  '<line x1="120" y1="130" x2="120" y2="40" class="clock-hand clock-hand-minute"/>'
    +  '<circle cx="120" cy="36" r="6" class="clock-hand-tip clock-hand-tip-minute"/>'
    +  '</g>';
  s += '<g class="clock-hand-g clock-hour-g" id="clock-hour-g">'
    +  '<line x1="120" y1="132" x2="120" y2="74" class="clock-hand-grab"/>'
    +  '<line x1="120" y1="128" x2="120" y2="78" class="clock-hand clock-hand-hour"/>'
    +  '<circle cx="120" cy="74" r="7" class="clock-hand-tip clock-hand-tip-hour"/>'
    +  '</g>';
  s += '<circle cx="120" cy="120" r="9" class="clock-cap"/><circle cx="120" cy="120" r="3.5" class="clock-cap-dot"/>';
  svg.innerHTML = s;
}

/* ตกแต่งกรอบตามแบบสุ่ม — inject span ให้ CSS จัดตำแหน่ง/วาดต่อ */
function buildClockDecor(frame){
  const d = $('clock-frame-decor');
  if(!d) return;
  /* ไม่ส่งธีมมา = ขอบวงกลมเปล่าๆ (ค่าปริยายตั้งแต่ 2026-08-17) */
  if(!frame){ d.innerHTML = ''; return; }
  if(frame==='owl') d.innerHTML = '<span class="d-owl-ear l"></span><span class="d-owl-ear r"></span><span class="d-owl-beak"></span>';
  else if(frame==='cat') d.innerHTML = '<span class="d-cat-ear l"></span><span class="d-cat-ear r"></span><span class="d-whisker l w1"></span><span class="d-whisker l w2"></span><span class="d-whisker r w1"></span><span class="d-whisker r w2"></span>';
  else if(frame==='flower') d.innerHTML = [0,1,2,3,4,5,6,7].map(i=>'<span class="d-petal" style="--i:'+i+'"></span>').join('');
  else if(frame==='sun') d.innerHTML = [0,1,2,3,4,5,6,7,8,9,10,11].map(i=>'<span class="d-ray" style="--i:'+i+'"></span>').join('');
  else d.innerHTML = '<span class="d-bear-ear l"></span><span class="d-bear-ear r"></span>';
}

/* หมุนเข็มด้วยมุมสะสม (เลือกทางหมุนที่ใกล้สุดเสมอ) กันเข็มตีกลับยาวข้ามหน้าปัดตอนค่า mod 360 กระโดด เช่น 59→0 นาที */
function rotateClockHand(which, targetDeg, noAnim){
  const g = which==='hour' ? $('clock-hour-g') : $('clock-minute-g');
  const cur = clockGame.angles[which];
  const delta = ((targetDeg - (cur%360+360)%360) + 540) % 360 - 180;
  clockGame.angles[which] = cur + delta;
  if(noAnim) g.classList.add('dragging');
  g.style.transform = 'rotate('+clockGame.angles[which]+'deg)';
  if(noAnim) requestAnimationFrame(()=>{ requestAnimationFrame(()=>g.classList.remove('dragging')); });
}

function updateClockHands(noAnim){
  const g = clockGame;
  rotateClockHand('hour', (g.h%12)*30 + g.m*0.5, noAnim);
  rotateClockHand('minute', g.m*6, noAnim);
  $('clock-digital').textContent = g.h+':'+String(g.m).padStart(2,'0');
}

function clockBumpHour(dir){ clockGame.h = dir>0 ? (clockGame.h===12?1:clockGame.h+1) : (clockGame.h===1?12:clockGame.h-1); }

/* ปรับนาทีทีละ 1 (ปุ่ม ±1 นาที) — ข้ามเลข 12 แล้วชั่วโมงขยับตามจริง */
function clockNudgeMinute(dir){
  if(!clockGame || clockGame.locked) return;
  playTone(1150,.04,'sine',0,.06);
  let m = clockGame.m + dir;
  if(m>59){ m = 0; clockBumpHour(1); }
  if(m<0){ m = 59; clockBumpHour(-1); }
  clockGame.m = m;
  updateClockHands();
}

function clockPointerAngle(e){
  const rect = $('clock-svg').getBoundingClientRect();
  const a = Math.atan2(e.clientX-(rect.left+rect.width/2), (rect.top+rect.height/2)-e.clientY)*180/Math.PI;
  return (a+360)%360;
}

function clockDragStart(e){
  if(!clockGame || clockGame.locked) return;
  /* เริ่มลากได้เฉพาะเมื่อจับโดนตัวเข็มจริงๆ (hit area โปร่งใสของเข็ม) — คลิกหน้าปัด/ที่อื่นไม่มีผล
     เข็มสั้นวาดอยู่หน้า จึงชนะเสมอตอนสองเข็มซ้อนกัน ส่วนเข็มยาวจับที่ปลายส่วนที่ยื่นออกมาได้ */
  const handG = e.target.closest ? e.target.closest('.clock-hand-g') : null;
  if(!handG) return;
  const a = clockPointerAngle(e);
  clockGame.drag = handG.id==='clock-hour-g' ? 'hour' : 'minute';
  /* ลากแบบ relative: จำมุมนิ้ว+ค่าเวลาตอนเริ่มจับ แล้วขยับเข็มตามมุมที่นิ้ว "หมุนไปจริง" เท่านั้น
     (แตะเฉยๆ delta = 0 เข็มนิ่งสนิท ไม่กระโดดไปหานิ้ว — browser ยิง pointermove หลัง down เสมอ) */
  clockGame.lastA = a; clockGame.dragAccum = 0;
  clockGame.dragStartH = clockGame.h; clockGame.dragStartM = clockGame.m;
  $('clock-hour-g').classList.toggle('active', clockGame.drag==='hour');
  $('clock-minute-g').classList.toggle('active', clockGame.drag==='minute');
  e.preventDefault();
}
function clockDragMove(e){
  const g = clockGame;
  if(!g || !g.drag) return;
  const a = clockPointerAngle(e);
  let d = a - g.lastA; d = ((d+540)%360)-180;
  g.dragAccum += d; g.lastA = a;
  if(g.drag==='minute'){
    let m = Math.round((g.dragStartM + g.dragAccum/6)/g.snap)*g.snap;
    m = ((m%60)+60)%60;
    if(m!==g.m){
      /* ลากข้ามเลข 12: 50+นาที → 0-9 = หมุนไปข้างหน้า (ชั่วโมง+1), กลับทางก็ลดชั่วโมง */
      if(g.m>=45 && m<=15) clockBumpHour(1);
      else if(g.m<=15 && m>=45) clockBumpHour(-1);
      g.m = m;
      playTone(1150,.03,'sine',0,.05);
      updateClockHands(true);
    }
  } else {
    let h = ((Math.round(g.dragStartH + g.dragAccum/30)-1)%12+12)%12+1;
    if(h!==g.h){
      g.h = h;
      playTone(880,.04,'sine',0,.06);
      updateClockHands(true);
    }
  }
}
function clockDragEnd(){
  if(!clockGame) return;
  clockGame.drag = null;
  $('clock-hour-g').classList.remove('active');
  $('clock-minute-g').classList.remove('active');
}

function randClockInt(min,max){ return min + Math.floor(Math.random()*(max-min+1)); }

/* สุ่มโจทย์ตาม mode/ด่าน (กันซ้ำในรอบด้วย used Set) แล้วตั้งเข็มไปเวลาเริ่มต้น */
function newClockLevel(){
  const g = clockGame;
  const stage = g.level;
  let target = null, start = {h:12,m:0}, offsetH = 0, offsetM = 0;
  for(let tries=0; tries<80; tries++){
    if(g.mode===1){
      target = { h:randClockInt(1,12), m: stage<=5 ? 0 : 30 };
    } else if(g.mode===2){
      target = { h:randClockInt(1,12), m: stage<=5 ? randClockInt(1,11)*5 : randClockInt(1,59) };
    } else {
      offsetH = randClockInt(1,3);
      offsetM = g.mode===4 ? randClockInt(1,11)*5 : 0;
      start = { h:randClockInt(1,12), m: stage<=6 ? 0 : randClockInt(1,11)*5 };
      const sumM = start.m + offsetM;
      target = { h:((start.h-1+offsetH+(sumM>=60?1:0))%12)+1, m:sumM%60 };
    }
    const key = target.h+':'+target.m+(g.mode>=3?('@'+start.h+':'+start.m):'');
    if(!g.used.has(key) && !(target.h===start.h && target.m===start.m)){ g.used.add(key); break; }
  }
  g.target = target; g.startTime = start; g.offsetH = offsetH; g.offsetM = offsetM;
  g.h = start.h; g.m = start.m; g.locked = false; g.drag = null;
  g.snap = (g.mode===2 && stage>=6) ? 1 : 5;
  $('clock-nudge').hidden = g.snap!==1;
  $('clock-level-counter').textContent = stage+'/'+g.totalLevels;
  $('clock-progress-fill').style.width = ((stage-1)/g.totalLevels*100)+'%';
  $('clock-msg').hidden = true;
  const svg = $('clock-svg');
  svg.classList.remove('happy','sad');
  if(g.mode>=3){
    const offText = offsetH+' ชั่วโมง'+(g.mode===4 ? ' '+offsetM+' นาที' : '');
    $('clock-start-chip').hidden = false;
    $('clock-start-chip').textContent = '🕐 ตอนนี้เวลา '+clockTimeText(start.h,start.m);
    $('clock-task-text').innerHTML = 'อีก <b>'+offText+'</b> จะเป็นกี่โมง? หมุนเข็มเลย!';
    g.speakText = 'ตอนนี้เวลา '+clockTimeText(start.h,start.m)+' อีก '+offText+' จะเป็นกี่โมง';
  } else {
    $('clock-start-chip').hidden = true;
    $('clock-task-text').innerHTML = 'หมุนเข็มให้เป็น <b>'+clockTimeText(target.h,target.m)+'</b>';
    g.speakText = 'หมุนเข็มนาฬิกาให้เป็น '+clockTimeText(target.h,target.m);
  }
  updateClockHands(true);
  setTimeout(()=>speakClockText(g.speakText), 350);
}

function checkClockAnswer(){
  const g = clockGame;
  if(!g || g.locked) return;
  const svg = $('clock-svg'), msg = $('clock-msg');
  if(g.h===g.target.h && g.m===g.target.m){
    g.locked = true;
    svg.classList.remove('sad'); svg.classList.add('happy');
    msg.hidden = false; msg.className = 'clock-msg ok';
    msg.textContent = '🎉 เก่งมาก! '+clockTimeText(g.target.h,g.target.m)+'พอดีเลย!';
    playCorrect(); mascotHappy();
    burstFromElement($('clock-frame'), 30);
    showOwlMsg('correct');
    setTimeout(()=>{
      if(g.level >= g.totalLevels){ finishClockGame(); }
      else { g.level++; newClockLevel(); }
    }, 1500);
  } else {
    g.mistakes++;
    svg.classList.remove('happy'); svg.classList.add('sad');
    msg.hidden = false; msg.className = 'clock-msg ng';
    msg.textContent = '💪 ยังไม่ตรงนะ ดูเข็มอีกทีแล้วลองใหม่!';
    $('clock-frame').classList.add('shake');
    setTimeout(()=>$('clock-frame').classList.remove('shake'), 500);
    playWrong(); mascotOops();
    showOwlMsg('wrong');
    setTimeout(()=>{ svg.classList.remove('sad'); }, 1400);
  }
}

function startClockGame(catId){
  lastGameType = 'clock'; lastCatId = catId;
  const cat = catById(catId);
  clockGame = { catId, mode:cat.clockMode, level:1, totalLevels:cat.levels, mistakes:0, h:12, m:0, target:null, startTime:null, offsetH:0, snap:5, used:new Set(), locked:false, drag:null, angles:{hour:0, minute:0} };
  showOnlyView(clockView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  clockView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('clock-cat-label', cat);
  /* 🕐 **เอาธีมกรอบนาฬิกาออก ให้เหลือขอบวงกลมเฉยๆ** (ผู้ใช้สั่ง 2026-08-17)
     หูนกฮูก/หูแมว/กลีบดอก/แฉกพระอาทิตย์ รอบหน้าปัดดึงสายตาออกจากเข็มซึ่งเป็นตัวโจทย์จริง
     ⚠ **ไม่ลบ CLOCK_FRAMES/buildClockDecor ทิ้ง** — เก็บโค้ดไว้เผื่อผู้ใช้อยากได้กลับ
       แค่ไม่เรียกใช้ และล้างของตกแต่งที่อาจค้างจากรอบก่อน */
  $('clock-frame').className = 'clock-frame';
  buildClockDecor(null);
  buildClockFace();
  newClockLevel();
  window.scrollTo({top:0, behavior:'smooth'});
}

function finishClockGame(){
  const cat = catById(clockGame.catId);
  const mistakes = clockGame.mistakes, totalLevels = clockGame.totalLevels;
  try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(e){}
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
  for(let i=0;i<3;i++){ const s = document.createElement('span'); s.textContent = '⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });
  $('score-line').textContent = 'หมุนนาฬิกาถูกครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
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

$('clock-svg').addEventListener('pointerdown', clockDragStart);
window.addEventListener('pointermove', e=>{ if(clockGame && clockGame.drag && !clockView.hidden) clockDragMove(e); });
window.addEventListener('pointerup', clockDragEnd);
window.addEventListener('pointercancel', clockDragEnd);
$('clock-submit').addEventListener('click', ()=>{ playClick(); checkClockAnswer(); });
$('clock-speak-btn').addEventListener('click', ()=>{ playClick(); if(clockGame) speakClockText(clockGame.speakText); });
$('clock-nudge-minus').addEventListener('click', ()=>clockNudgeMinute(-1));
$('clock-nudge-plus').addEventListener('click', ()=>clockNudgeMinute(1));
$('clock-back').addEventListener('click', ()=>{
  playClick();
  try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(e){}
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});


/* ================================================================================================
   เกมใหม่ของ ป.5-6 (นำ mechanic จาก IDEA.md มาทำจริง) — 4 engine ที่มี "การหมุน/สลับตำแหน่ง"
   1) circuit  ต่อวงจรไฟฟ้า  — แตะชิ้นท่อไฟหมุนทีละ 90° ให้กระแสไหลจากถ่านถึงหลอดไฟ (ว 2.3 ป.6)
   2) tangram  แท็งแกรมวิเศษ — แตะเลือกชิ้น หมุนทีละ 45° แล้วแตะเงาที่ต้องการวาง (ค 2.2)
   3) mirror   กระจกวิเศษ    — ระบายฝั่งขวาให้สมมาตรกับฝั่งซ้าย (การสะท้อน/ความสมมาตร)
   4) order    เรียงลำดับวิเศษ — แตะสลับตำแหน่งการ์ดให้เรียงถูกตามโจทย์
   ทุกเกมจบด้วย finishP2Game (ดาวเกณฑ์ mistakes เดิม 0→3, ≤4→2, else→1) เหมือนเกมทักษะอื่น
   ================================================================================================ */

/* ---------------- 1) ต่อวงจรไฟฟ้า (circuit) ----------------
   ชิ้นในตารางเก็บเป็น "หน้ากากทิศที่เปิด" 4 บิต: 1=บน 2=ขวา 4=ล่าง 8=ซ้าย
   หมุน 90° ตามเข็ม = เลื่อนบิตไปทางซ้าย 1 (บน→ขวา→ล่าง→ซ้าย→บน)
   ด่านเก็บเป็น "เส้นทาง" (path) ของช่อง แล้วคำนวณชนิดชิ้นจากเพื่อนบ้านให้อัตโนมัติ
   จึงไม่มีทางสร้างด่านที่แก้ไม่ได้ — ผู้เล่นแค่หมุนให้ตรงกับคำตอบ */
let circuitGame = null;
const CIRCUIT_DIRS = [[-1,0,1],[0,1,2],[1,0,4],[0,-1,8]]; /* dr, dc, bit */
function circuitRot(mask, times){ let m = mask; for(let i=0;i<((times%4)+4)%4;i++) m = ((m<<1)|(m>>3)) & 15; return m; }
function circuitMaskTo(from, to){ /* บิตของทิศจาก from ไป to */
  const dr = to[0]-from[0], dc = to[1]-from[1];
  const d = CIRCUIT_DIRS.find(x=>x[0]===dr && x[1]===dc);
  return d ? d[2] : 0;
}
function startCircuitGame(catId){
  const cat = beginSkillGame(catId, 'circuit', circuitView, 'circuit-cat-label');
  circuitGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, used:new Set(), locked:false, maxSize:(cat.circuitMax||0) };
  renderCircuitLevel();
  endSkillGameStart();
}
function pickCircuitLevel(used){
  /* 🔌 **เปิดให้เด็กเล่นได้ตั้งแต่ ป.1** (ผู้ใช้สั่ง 2026-08-17)
     ⚠ ชั้นเล็กต้องได้เฉพาะกระดานเล็ก — `cat.circuitMax` คุมขนาดสูงสุดของกระดาน
       ไม่ใส่มา = ได้ทุกด่านเหมือนเดิม (ป.5-6) */
  const cap = (circuitGame && circuitGame.maxSize) || 99;
  const fits = i => CIRCUIT_LEVELS[i].size <= cap;
  let avail = CIRCUIT_LEVELS.map((l,i)=>i).filter(i=>!used.has(i) && fits(i));
  if(!avail.length){ used.clear(); avail = CIRCUIT_LEVELS.map((l,i)=>i).filter(fits); }
  const pick = avail[Math.floor(Math.random()*avail.length)];
  used.add(pick);
  return CIRCUIT_LEVELS[pick];
}
function renderCircuitLevel(){
  const g = circuitGame;
  const lv = pickCircuitLevel(g.used);
  const size = lv.size, path = lv.path;
  const cells = {};
  path.forEach((p, i)=>{
    let mask = 0;
    if(i>0) mask |= circuitMaskTo(p, path[i-1]);
    if(i<path.length-1) mask |= circuitMaskTo(p, path[i+1]);
    const node = i===0 ? 'battery' : (i===path.length-1 ? 'bulb' : null);
    cells[p[0]+','+p[1]] = { r:p[0], c:p[1], sol:mask, node:node, rot:0, fixed:!!node };
  });
  (lv.decoys||[]).forEach(d=>{
    const key = d[0]+','+d[1];
    if(cells[key]) return;
    cells[key] = { r:d[0], c:d[1], sol:(d[2]||10), node:null, rot:0, fixed:false };
  });
  /* สุ่มมุมเริ่มต้นของชิ้นที่หมุนได้ (กันไม่ให้ถูกตั้งแต่แรก) */
  const rotatable = Object.values(cells).filter(c=>!c.fixed);
  do { rotatable.forEach(c=>{ c.rot = Math.floor(Math.random()*4); });
  } while(rotatable.length && rotatable.every(c=>c.rot===0));
  g.size = size; g.cells = cells; g.locked = false;
  $('circuit-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('circuit-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('circuit-hint').textContent = 'แตะชิ้นสายไฟเพื่อหมุน ให้ไฟวิ่งจากถ่านไปถึงหลอดไฟ';
  renderCircuitGrid();
}
function circuitPieceSvg(mask, live){
  const col = live ? '#F5A623' : 'var(--cat-color,#2E86C1)';
  let d = '';
  if(mask & 1) d += 'M50 50 L50 2 ';
  if(mask & 2) d += 'M50 50 L98 50 ';
  if(mask & 4) d += 'M50 50 L50 98 ';
  if(mask & 8) d += 'M50 50 L2 50 ';
  return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="'+d+'" stroke="'+col+'" stroke-width="14" stroke-linecap="round" fill="none"/>'+
         '<circle cx="50" cy="50" r="9" fill="'+col+'"/></svg>';
}
function circuitLiveSet(){
  /* BFS จากถ่านไฟฉาย ผ่านช่องที่ "เปิดหากัน" ทั้งสองฝั่ง */
  const g = circuitGame, live = new Set();
  const start = Object.values(g.cells).find(c=>c.node==='battery');
  if(!start) return live;
  const key = c => c.r+','+c.c;
  const q = [start]; live.add(key(start));
  while(q.length){
    const cur = q.shift();
    const curMask = circuitRot(cur.sol, cur.rot);
    CIRCUIT_DIRS.forEach(([dr,dc,bit])=>{
      if(!(curMask & bit)) return;
      const nb = g.cells[(cur.r+dr)+','+(cur.c+dc)];
      if(!nb || live.has(key(nb))) return;
      const back = circuitMaskTo([nb.r,nb.c], [cur.r,cur.c]);
      if(!(circuitRot(nb.sol, nb.rot) & back)) return;
      live.add(key(nb)); q.push(nb);
    });
  }
  return live;
}
function renderCircuitGrid(){
  const g = circuitGame, grid = $('circuit-grid');
  const live = circuitLiveSet();
  const cc = g.size >= 5 ? 50 : 58;
  grid.style.gridTemplateColumns = 'repeat('+g.size+', '+cc+'px)';
  grid.style.setProperty('--cc', cc+'px');
  grid.innerHTML = '';
  for(let r=0;r<g.size;r++) for(let c=0;c<g.size;c++){
    const cell = g.cells[r+','+c];
    const btn = document.createElement('button');
    btn.type='button';
    btn.className = 'circuit-cell'+(cell&&cell.fixed?' circuit-fixed':'')+(cell&&live.has(r+','+c)?' circuit-live':'');
    btn.style.setProperty('--cc', cc+'px');
    if(!cell){ btn.disabled = true; btn.style.visibility='hidden'; }
    else if(cell.node){
      btn.innerHTML = '<span class="circuit-node">'+(cell.node==='battery'?'🔋':(live.has(r+','+c)?'💡':'🔅'))+'</span>';
      btn.disabled = true;
    } else {
      btn.innerHTML = circuitPieceSvg(circuitRot(cell.sol, cell.rot), live.has(r+','+c));
      btn.addEventListener('click', ()=>{ if(g.locked) return; playClick(); cell.rot=(cell.rot+1)%4; renderCircuitGrid(); });
    }
    grid.appendChild(btn);
  }
}
function checkCircuit(){
  const g = circuitGame;
  if(g.locked) return;
  const live = circuitLiveSet();
  const bulb = Object.values(g.cells).find(c=>c.node==='bulb');
  const ok = bulb && live.has(bulb.r+','+bulb.c);
  if(ok){
    g.locked = true;
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('circuit-hint').textContent = 'ไฟติดแล้ว! วงจรครบรอบพอดี 💡';
    $('circuit-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    renderCircuitGrid();
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'ต่อวงจรไฟฟ้า'); else { g.level++; renderCircuitLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    $('circuit-hint').textContent = 'สายไฟยังขาดอยู่ ลองหมุนชิ้นที่ยังไม่ต่อกันดูนะ';
    renderCircuitGrid();
  }
}
$('circuit-check').addEventListener('click', ()=>{ playClick(); checkCircuit(); });
$('circuit-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 2) แท็งแกรมวิเศษ (tangram) ----------------
   เงาโครงร่างวางไว้บนเวที แต่ละเงาต้องการชิ้นชนิดใดชนิดหนึ่งที่หมุนมาให้ตรงมุม
   ผู้เล่น: แตะชิ้นในถาดเพื่อเลือก → กดปุ่มหมุน 45° → แตะเงาที่ต้องการวาง
   (ปรับจาก IDEA.md ที่เขียนว่า "ลากไปวาง" เป็น "แตะวาง" ให้เข้ากับ mechanic แตะของเกมอื่นในแอป) */
let tangramGame = null;
const TG_SHAPES = {
  tri:  '<polygon points="4,92 92,92 4,4"/>',
  tri2: '<polygon points="4,4 92,4 92,92"/>',
  sq:   '<rect x="8" y="8" width="80" height="80" rx="6"/>',
  par:  '<polygon points="10,70 60,70 86,26 36,26"/>'
};
function tangramSvg(type, colorFill, colorStroke, rot){
  return '<svg class="tg-shape" viewBox="0 0 96 96" aria-hidden="true" style="transform:rotate('+rot+'deg)">'+
         '<g fill="'+colorFill+'" stroke="'+colorStroke+'" stroke-width="5" stroke-linejoin="round">'+TG_SHAPES[type]+'</g></svg>';
}
function startTangramGame(catId){
  const cat = beginSkillGame(catId, 'tangram', tangramView, 'tangram-cat-label');
  tangramGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, used:new Set(), sel:null, locked:false, color:cat.color, maxPieces:(cat.tangramMax||0) };
  renderTangramLevel();
  endSkillGameStart();
}
function renderTangramLevel(){
  const g = tangramGame;
  /* 🧩 **เปิดให้เด็กเล่นได้ตั้งแต่ ป.1** (ผู้ใช้สั่ง 2026-08-17)
     ⚠ ชั้นเล็กต้องได้เฉพาะรูปที่ใช้ชิ้นน้อย — `cat.tangramMax` คุมจำนวนชิ้นสูงสุด
       ไม่ใส่มา = ได้ทุกรูปเหมือนเดิม (ป.5-6) */
  const capP = g.maxPieces || 99;
  const fitP = i => TANGRAM_FIGURES[i].slots.length <= capP;
  let avail = TANGRAM_FIGURES.map((f,i)=>i).filter(i=>!g.used.has(i) && fitP(i));
  if(!avail.length){ g.used.clear(); avail = TANGRAM_FIGURES.map((f,i)=>i).filter(fitP); }
  const idx = avail[Math.floor(Math.random()*avail.length)];
  g.used.add(idx);
  const fig = TANGRAM_FIGURES[idx];
  g.fig = fig;
  g.slots = fig.slots.map((s,i)=>({ i, x:s[0], y:s[1], w:s[2], type:s[3], rot:s[4], filled:false }));
  /* ชิ้นในถาด = ชิ้นที่ต้องใช้ทั้งหมด สุ่มมุมเริ่มต้นไม่ให้ตรงคำตอบตั้งแต่แรก */
  /* ⚠ **ชิ้นในถาดต้องพกขนาดของช่องที่มันใช้ไปด้วย** (ผู้ใช้แจ้ง 2026-08-17)
     ของเดิมถาดวาดขนาดเดียวหมด (74px) ⇒ รูปที่มีสามเหลี่ยม 2 ขนาด เด็กเห็นเป็นชิ้นเหมือนกันเป๊ะ
     แล้วงงว่าทำไมวางไม่ลง — ต้องเห็นด้วยตาว่าชิ้นไหนใหญ่ ชิ้นไหนเล็ก */
  g.pieces = g.slots.map((s,i)=>{
    let r; do { r = Math.floor(Math.random()*8)*45; } while(r===s.rot);
    return { i, type:s.type, rot:r, w:s.w, used:false };
  });
  g.pieces = shuffleArray(g.pieces);
  g.sel = null; g.locked = false;
  $('tangram-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('tangram-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('tangram-title').textContent = 'ต่อให้เป็นรูป "'+fig.name+'" '+fig.emoji;
  $('tangram-hint').textContent = 'แตะเลือกชิ้น กดปุ่มหมุนให้ตรงมุม แล้วแตะเงาที่จะวาง';
  renderTangramBoard();
}
function renderTangramBoard(){
  const g = tangramGame;
  const stage = $('tangram-stage'); stage.innerHTML = '';
  const light = mixHexColor(g.color, '#ffffff', 0.55), dark = mixHexColor(g.color, '#000000', 0.3);
  g.slots.forEach(s=>{
    const b = document.createElement('button');
    b.type='button';
    b.className = 'tangram-slot '+(s.filled?'tg-filled':'tg-empty');
    b.style.left = s.x+'px'; b.style.top = s.y+'px'; b.style.width = s.w+'px'; b.style.height = s.w+'px';
    b.innerHTML = tangramSvg(s.type, s.filled?g.color:'#9AA6B8', s.filled?dark:'#7c8797', s.rot);
    b.addEventListener('click', ()=>{
      if(g.locked || s.filled || g.sel===null) return;
      const p = g.pieces[g.sel];
      playClick();
      /* ต้องตรงทั้ง **ชนิด · มุม · ขนาด** — ขนาดเพิ่มเข้ามา 2026-08-17 พร้อมกับที่ถาดวาดตามขนาดจริง */
      if(p.type===s.type && p.w===s.w && ((p.rot%360)+360)%360 === s.rot){
        p.used = true; s.filled = true; g.sel = null;
        playCorrect();
        renderTangramBoard();
        if(g.slots.every(x=>x.filled)) tangramWin();
      } else {
        g.mistakes++; playWrong(); showOwlMsg('wrong');
        $('tangram-hint').textContent = (p.type===s.type && p.w!==s.w)
          ? 'ชิ้นนี้ขนาดไม่พอดีกับเงานะ ลองชิ้นที่ใหญ่/เล็กกว่านี้ดู'
          : 'ยังไม่พอดีนะ ลองหมุนชิ้นให้ตรงมุมของเงาดูอีกที';
        b.classList.add('oc-bad'); setTimeout(()=>b.classList.remove('oc-bad'), 340);
      }
    });
    stage.appendChild(b);
  });
  const tray = $('tangram-tray'); tray.innerHTML = '';
  g.pieces.forEach((p, i)=>{
    if(p.used) return;
    const b = document.createElement('button');
    b.type='button';
    b.className = 'tangram-piece'+(g.sel===i?' tg-sel':'');
    /* ขนาดปุ่มไล่ตามขนาดช่องจริง (ช่อง 50-120px → ปุ่ม 54-84px) — เล็กสุดยังเกิน 44px ที่นิ้วเด็กต้องการ */
    { const px = Math.round(38 + (p.w || 80) * 0.38);
      b.style.width = px + 'px'; b.style.height = px + 'px'; }
    b.innerHTML = tangramSvg(p.type, light, dark, p.rot);
    b.addEventListener('click', ()=>{ if(g.locked) return; playClick(); g.sel = (g.sel===i? null : i); renderTangramBoard(); });
    tray.appendChild(b);
  });
}
function tangramWin(){
  const g = tangramGame;
  g.locked = true;
  mascotHappy(); showOwlMsg('correct');
  $('tangram-hint').textContent = 'ต่อครบเป็นรูป'+g.fig.name+'แล้ว! 🎉';
  $('tangram-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'แท็งแกรม'); else { g.level++; renderTangramLevel(); } }, 1400);
}
$('tangram-rot').addEventListener('click', ()=>{
  const g = tangramGame;
  if(!g || g.locked || g.sel===null) return;
  playClick();
  g.pieces[g.sel].rot = (g.pieces[g.sel].rot + 45) % 360;
  renderTangramBoard();
});
$('tangram-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 3) กระจกวิเศษ (mirror) ----------------
   ฝั่งซ้ายระบายไว้แล้ว ผู้เล่นเลือกสีแล้วแตะช่องฝั่งขวาให้สะท้อนตรงกัน
   แตะผิดสี/ผิดช่อง = ช่องสั่น + นับ mistake (ไม่เฉลยว่าช่องไหนถูก) */
let mirrorGame = null;
function startMirrorGame(catId){
  const cat = beginSkillGame(catId, 'mirror', mirrorView, 'mirror-cat-label');
  mirrorGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, used:new Set(), locked:false };
  renderMirrorLevel();
  endSkillGameStart();
}
function renderMirrorLevel(){
  const g = mirrorGame;
  let avail = MIRROR_PICS.map((p,i)=>i).filter(i=>!g.used.has(i));
  if(!avail.length){ g.used.clear(); avail = MIRROR_PICS.map((p,i)=>i); }
  const idx = avail[Math.floor(Math.random()*avail.length)];
  g.used.add(idx);
  const pic = MIRROR_PICS[idx];
  g.pic = pic;
  g.half = pic.rows[0].length;              /* จำนวนคอลัมน์ของครึ่งซ้าย */
  g.right = pic.rows.map(row=>row.map(()=>0)); /* 0 = ยังไม่ระบาย */
  g.sel = 1;                                 /* สีที่เลือกอยู่ (index ใน pic.colors, เริ่มที่สีแรก) */
  g.locked = false;
  $('mirror-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('mirror-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('mirror-title').textContent = 'ระบายฝั่งขวาให้เหมือนส่องกระจก — '+pic.name+' '+pic.emoji;
  $('mirror-hint').textContent = 'เลือกสีด้านล่าง แล้วแตะช่องฝั่งขวาให้สมมาตรกับฝั่งซ้าย';
  renderMirrorBoard();
}
function renderMirrorBoard(){
  const g = mirrorGame, pic = g.pic;
  const rows = pic.rows.length, half = g.half;
  const cell = rows > 8 ? 24 : 30;
  const grid = $('mirror-grid');
  grid.style.gridTemplateColumns = 'repeat('+half+', '+cell+'px) 8px repeat('+half+', '+cell+'px)';
  grid.style.setProperty('--mc', cell+'px');
  grid.innerHTML = '';
  for(let r=0;r<rows;r++){
    for(let c=0;c<half;c++){
      const v = pic.rows[r][c];
      const b = document.createElement('button');
      b.type='button'; b.className='mirror-cell mr-left'; b.disabled = true;
      b.style.width = cell+'px'; b.style.height = cell+'px';
      if(v) b.style.background = pic.colors[v-1];
      grid.appendChild(b);
    }
    const axis = document.createElement('div');
    axis.className = 'mirror-cell mr-axis'; axis.style.height = cell+'px';
    grid.appendChild(axis);
    for(let c=0;c<half;c++){
      const srcC = half-1-c;                 /* สะท้อนซ้าย-ขวา */
      const want = pic.rows[r][srcC];
      const b = document.createElement('button');
      b.type='button'; b.className='mirror-cell';
      b.style.width = cell+'px'; b.style.height = cell+'px';
      const cur = g.right[r][c];
      if(cur) b.style.background = pic.colors[cur-1];
      b.addEventListener('click', ()=>{
        if(g.locked) return;
        playClick();
        if(g.sel === want && want !== 0){
          g.right[r][c] = g.sel; renderMirrorBoard();
          if(mirrorDone()) mirrorWin();
        } else {
          g.mistakes++; playWrong();
          b.classList.add('mr-bad'); setTimeout(()=>b.classList.remove('mr-bad'), 340);
          $('mirror-hint').textContent = 'ช่องนี้ยังไม่ตรงกับกระจกนะ ลองดูฝั่งซ้ายอีกที';
        }
      });
      grid.appendChild(b);
    }
  }
  const pal = $('mirror-palette'); pal.innerHTML = '';
  pic.colors.forEach((col, i)=>{
    const b = document.createElement('button');
    b.type='button'; b.className='mirror-swatch'+(g.sel===i+1?' mr-sel':'');
    b.style.background = col;
    b.addEventListener('click', ()=>{ if(g.locked) return; playClick(); g.sel = i+1; renderMirrorBoard(); });
    pal.appendChild(b);
  });
}
function mirrorDone(){
  const g = mirrorGame, pic = g.pic, half = g.half;
  for(let r=0;r<pic.rows.length;r++) for(let c=0;c<half;c++){
    const want = pic.rows[r][half-1-c];
    if(want !== 0 && g.right[r][c] !== want) return false;
  }
  return true;
}
function mirrorWin(){
  const g = mirrorGame;
  g.locked = true;
  playCorrect(); mascotHappy(); showOwlMsg('correct');
  $('mirror-hint').textContent = 'สมมาตรพอดีเป๊ะ! สวยมากเลย 🎉';
  $('mirror-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
  setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'กระจกวิเศษ'); else { g.level++; renderMirrorLevel(); } }, 1400);
}
$('mirror-check').addEventListener('click', ()=>{
  playClick();
  if(!mirrorGame || mirrorGame.locked) return;
  if(mirrorDone()) mirrorWin();
  else $('mirror-hint').textContent = 'ยังระบายไม่ครบทุกช่องนะ ลองดูอีกที';
});
$('mirror-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ---------------- 4) เรียงลำดับวิเศษ (order) ----------------
   การ์ด 3-5 ใบวางสลับกันอยู่ ผู้เล่นแตะการ์ด 2 ใบเพื่อสลับตำแหน่งกัน แล้วกดตรวจคำตอบ
   ตอบผิด = การ์ดที่ผิดตำแหน่งสั่นแดง (ไม่เฉลยว่าตำแหน่งถูกคืออะไร) */
let orderGame = null;
function startOrderGame(catId){
  const cat = beginSkillGame(catId, 'order', orderView, 'order-cat-label');
  orderGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, used:new Set(), sel:null, locked:false, tag:(cat.orderTag||null) };
  renderOrderLevel();
  endSkillGameStart();
}
function orderSize(level){ return level<=3 ? 3 : (level<=7 ? 4 : 5); }
function renderOrderLevel(){
  const g = orderGame;
  const size = orderSize(g.level);
  const pool = ORDER_SETS.filter(s=>s.items.length===size && (s.tag||null)===(g.tag||null));
  let avail = pool.map((s,i)=>i).filter(i=>!g.used.has(size+'-'+i));
  if(!avail.length){ pool.forEach((s,i)=>g.used.delete(size+'-'+i)); avail = pool.map((s,i)=>i); }
  const idx = avail[Math.floor(Math.random()*avail.length)];
  g.used.add(size+'-'+idx);
  const set = pool[idx];
  g.set = set;
  g.cards = shuffleArray(set.items.map((it,i)=>({ e:it.e, l:it.l, ord:i })));
  if(g.cards.every((c,i)=>c.ord===i)){ const t=g.cards[0]; g.cards[0]=g.cards[size-1]; g.cards[size-1]=t; }
  g.sel = null; g.locked = false;
  $('order-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('order-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('order-title').textContent = set.prompt;
  $('order-hint').textContent = 'แตะการ์ด 2 ใบเพื่อสลับที่กัน แล้วกดตรวจคำตอบ';
  renderOrderRow();
}
function renderOrderRow(){
  const g = orderGame, row = $('order-row');
  row.innerHTML = '';
  g.cards.forEach((card, i)=>{
    const b = document.createElement('button');
    b.type='button';
    b.className = 'order-card'+(g.sel===i?' oc-sel':'')+(card._bad?' oc-bad':'');
    b.innerHTML = '<span class="oc-e">'+card.e+'</span><span class="oc-l">'+card.l+'</span><span class="order-num">'+(i+1)+'</span>';
    b.addEventListener('click', ()=>{
      if(g.locked) return;
      playClick();
      if(g.sel===null){ g.sel = i; }
      else if(g.sel===i){ g.sel = null; }
      else { const t=g.cards[g.sel]; g.cards[g.sel]=g.cards[i]; g.cards[i]=t; g.sel=null; }
      renderOrderRow();
    });
    row.appendChild(b);
  });
}
function checkOrder(){
  const g = orderGame;
  if(g.locked) return;
  const wrong = g.cards.filter((c,i)=>c.ord!==i);
  if(wrong.length===0){
    g.locked = true;
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('order-hint').textContent = 'เรียงถูกทั้งหมดเลย! 🎉';
    $('order-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{ if(g.level>=g.totalLevels) finishP2Game(g.catId,g.mistakes,g.totalLevels,'เรียงลำดับ'); else { g.level++; renderOrderLevel(); } }, 1400);
  } else {
    g.mistakes++; playWrong(); showOwlMsg('wrong');
    wrong.forEach(c=>c._bad = true); renderOrderRow();
    $('order-hint').textContent = 'ยังมีบางใบผิดตำแหน่งนะ ลองสลับดูอีกที';
    setTimeout(()=>{ g.cards.forEach(c=>c._bad=false); renderOrderRow(); }, 700);
  }
}
$('order-check').addEventListener('click', ()=>{ playClick(); checkOrder(); });
$('order-back').addEventListener('click', ()=>{ playClick(); p2GoHome(); });

/* ตัวช่วยผสมสี (ใช้กับแท็งแกรมเพื่อไล่เฉดจากสีประจำหมวด) */
function mixHexColor(hex, other, t){
  const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const a = p(hex), b = p(other);
  const v = a.map((x,i)=>Math.round(x + (b[i]-x)*t));
  return '#'+v.map(x=>x.toString(16).padStart(2,'0')).join('');
}

/* ============================= ลงทะเบียนกับ OwlGames (สัญญา Mount) =============================
   ให้โฮสต์อื่น (การ์ดเควสต์ในโหมดบ้าน / โหมดครู) หยิบเกมพวกนี้ไปวางในกล่องของตัวเองได้
   ⚠ `stop()` ต้องล้าง state ให้หมด ไม่งั้นเกมเดิมค้างทำงานอยู่หลังปิดการ์ด — ดู js/owl-games.js */
if(window.OwlGames){
  OwlGames.register('money', {name:'ร้านค้านกฮูก', view:'money-view',
    start:o => startMoneyGame(o.catId),
    stop:() => { moneyGame = null; }});
  OwlGames.register('fraction', {name:'พิซซ่าเศษส่วน', view:'fraction-view',
    start:o => startFractionGame(o.catId),
    stop:() => { fractionGame = null; }});
  OwlGames.register('balance', {name:'ตาชั่งวิเศษ', view:'balance-view',
    start:o => startBalanceGame(o.catId),
    stop:() => { balanceGame = null; }});
  OwlGames.register('calendar', {name:'ปฏิทิน', view:'calendar-view',
    start:o => startCalendarGame(o.catId),
    stop:() => { calendarGame = null; }});
  OwlGames.register('timeline', {name:'เส้นเวลา', view:'timeline-view',
    start:o => startTimelineGame(o.catId),
    stop:() => { timelineGame = null; }});
  OwlGames.register('sort', {name:'จัดหมวดหมู่', view:'sort-view',
    start:o => startSortGame(o.catId),
    stop:() => { sortGame = null; }});
  OwlGames.register('world', {name:'หมุนโลก', view:'world-view',
    start:o => startWorldGame(o.catId),
    stop:() => { worldGame = null; }});
  OwlGames.register('coord', {name:'พิกัด', view:'coord-view',
    start:o => startCoordGame(o.catId),
    stop:() => { coordGame = null; }});
  OwlGames.register('chart', {name:'แผนภูมิ', view:'chart-view',
    start:o => startChartGame(o.catId),
    stop:() => { chartGame = null; }});
  OwlGames.register('area', {name:'พื้นที่', view:'area-view',
    start:o => startAreaGame(o.catId),
    stop:() => { areaGame = null; }});
  OwlGames.register('angle', {name:'มุม', view:'angle-view',
    start:o => startAngleGame(o.catId),
    stop:() => { angleGame = null; }});
  OwlGames.register('clock', {name:'นาฬิกาวิเศษ', view:'clock-view',
    start:o => startClockGame(o.catId),
    stop:() => { clockGame = null; }});
  OwlGames.register('tangram', {name:'แทนแกรม', view:'tangram-view',
    start:o => startTangramGame(o.catId),
    stop:() => { tangramGame = null; }});
  OwlGames.register('mirror', {name:'กระจกเงา', view:'mirror-view',
    start:o => startMirrorGame(o.catId),
    stop:() => { mirrorGame = null; }});
  OwlGames.register('order', {name:'เรียงลำดับ', view:'order-view',
    start:o => startOrderGame(o.catId),
    stop:() => { orderGame = null; }});
  /* เฟส 6 — ต่อวงจรไฟฟ้า (แล็บ STEM `circuit-lab`) ⚠ มีหมวดเดียวคือ ป.6
     ⇒ `pickCat()` ใน js/house-games.js จะไม่แจกให้เด็กชั้นต่ำกว่าเอง (ห้ามลดเงื่อนไขนั้น) */
  OwlGames.register('circuit', {name:'ต่อวงจรไฟฟ้า', view:'circuit-view',
    start:o => startCircuitGame(o.catId),
    stop:() => { circuitGame = null; }});
}
