/* ================================================================================
   เกมเขียนโปรแกรมพาหุ่นยนต์ (code) — เรียงบล็อกคำสั่ง + loop + เงื่อนไข
   รวมตัวละครหุ่นยนต์ voxel และกระดานกริดแบบ isometric
   ต้องโหลดหลัง js/app-core.js
   ================================================================================ */

/* ============================= CODE GAME ("เรียงคำสั่งหุ่นยนต์" — Phase 1.3 coding mechanic)
   เรียงบัตรคำสั่ง (เดินหน้า/เลี้ยวซ้าย-ขวา) เป็นลำดับ แล้วกด "เล่น" ให้หุ่นยนต์เดินบนกริดไปเก็บดาว
   engine เก็บ program เป็น array แบน (เผื่อขยาย loop/เงื่อนไข/parameter ให้ ป.2-6 ในอนาคต) ============================= */
let codeGame = null;
let codeTimer = null;
const CODE_DIRS = [{dr:-1,dc:0},{dr:0,dc:1},{dr:1,dc:0},{dr:0,dc:-1}]; // 0=ขึ้น 1=ขวา 2=ลง 3=ซ้าย
const CODE_CMD = { forward:{ lbl:'เดินหน้า' }, left:{ lbl:'หันซ้าย' }, right:{ lbl:'หันขวา' }, ifwall:{ lbl:'ถ้าเจอกำแพงให้เลี้ยว' } };
/* ---- SVG ไอคอนปุ่มคำสั่ง (toon สวยงาม แทน emoji) ---- */
const CMD_ICON = {
  forward:'<svg viewBox="0 0 32 32"><path d="M16 4 L27 16 H21 V27 H11 V16 H5 Z" fill="#3B9E5B" stroke="#276b3d" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 8 L22 14 H18.5" fill="none" stroke="#c8f0d4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  left:'<svg viewBox="0 0 32 32"><path d="M20 27 Q10 27 10 15" fill="none" stroke="#E8934A" stroke-width="4.4" stroke-linecap="round"/><path d="M4 16 L10 8 L16 16 Z" fill="#E8934A" stroke="#bf6f28" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  right:'<svg viewBox="0 0 32 32"><path d="M12 27 Q22 27 22 15" fill="none" stroke="#E8934A" stroke-width="4.4" stroke-linecap="round"/><path d="M28 16 L22 8 L16 16 Z" fill="#E8934A" stroke="#bf6f28" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  ifwall:'<svg viewBox="0 0 32 32"><circle cx="10.5" cy="18" r="8" fill="#6cbf80" stroke="#3f8f57" stroke-width="2"/><circle cx="7.5" cy="15.5" r="2.4" fill="#a6e0ae"/><path d="M16 22 Q26 22 26 13" fill="none" stroke="#E8934A" stroke-width="3.4" stroke-linecap="round"/><path d="M30 14 L26 7.5 L22 14 Z" fill="#E8934A" stroke="#bf6f28" stroke-width="1.9" stroke-linejoin="round"/></svg>'
};
/* ---- ตัวละครหุ่นยนต์ voxel 3D (ประกอบจากบล็อกลูกบาศก์ isometric แบบเดียวกับพื้น — สไตล์ "บ้านของหนู") หัน 4 ทิศ + เดินได้ ---- */
const ROBOT_VB = 52;
/* บล็อกลูกบาศก์ isometric: top(x, y-hh)..., ด้านข้างลง H — 3 เฉด cel-shading + เส้นขอบหนา */
/* ตัวละครแมวส้ม (voxel/toon มน) — mode: front(หันหน้า/ลง) / side(มองข้างไปขวา) / back(หันหลัง/ขึ้น) */
function buildRobot(mode){
  const F='#f4a860', FL='#ffe6c4', OUT='#b06d2e', INNER='#ffb3c1', NOSE='#ff8fa3', EYE='#3a4a40', ST='#e0913f';
  let s='';
  // หาง
  s += '<path d="M38 47 Q51 44 47 31 Q45 25 39 28" fill="none" stroke="#e89a4e" stroke-width="7" stroke-linecap="round"/>';
  // ขาหน้า 2 ข้าง (ไว้ทำ animation เดิน)
  s += '<g class="rb-legL"><ellipse cx="20" cy="52" rx="5.2" ry="3.8" fill="'+FL+'" stroke="'+OUT+'" stroke-width="2"/></g>';
  s += '<g class="rb-legR"><ellipse cx="32" cy="52" rx="5.2" ry="3.8" fill="'+FL+'" stroke="'+OUT+'" stroke-width="2"/></g>';
  // ลำตัว
  s += '<ellipse cx="26" cy="40" rx="13.5" ry="12.5" fill="'+F+'" stroke="'+OUT+'" stroke-width="2.4"/>';
  if(mode!=='back') s += '<ellipse cx="26" cy="43" rx="7" ry="8" fill="'+FL+'"/>';  // ท้องขาว
  // หัว
  s += '<circle cx="26" cy="17" r="14" fill="'+F+'" stroke="'+OUT+'" stroke-width="2.4"/>';
  // หูสองข้าง
  s += '<path d="M15 9 L10 -2 L23 6 Z" fill="'+F+'" stroke="'+OUT+'" stroke-width="2" stroke-linejoin="round"/>';
  s += '<path d="M37 9 L42 -2 L29 6 Z" fill="'+F+'" stroke="'+OUT+'" stroke-width="2" stroke-linejoin="round"/>';
  if(mode!=='back'){
    s += '<path d="M16.5 6.5 L14 0.5 L20.5 5 Z" fill="'+INNER+'"/><path d="M35.5 6.5 L38 0.5 L31.5 5 Z" fill="'+INNER+'"/>'; // หูใน
    s += '<ellipse cx="26" cy="22" rx="8.5" ry="6.5" fill="'+FL+'"/>';  // ปาก
    const ex = (mode==='side') ? 4 : 0;
    s += '<circle cx="'+(20+ex)+'" cy="16" r="3.1" fill="'+EYE+'"/><circle cx="'+(32+ex-(mode==='side'?4:0))+'" cy="16" r="3.1" fill="'+EYE+'"/>';
    s += '<circle cx="'+(21+ex)+'" cy="15" r="1" fill="#fff"/><circle cx="'+(33+ex-(mode==='side'?4:0))+'" cy="15" r="1" fill="#fff"/>';
    s += '<path d="M23.5 21 L28.5 21 L26 24 Z" fill="'+NOSE+'" stroke="'+OUT+'" stroke-width="0.8" stroke-linejoin="round"/>'; // จมูก
    s += '<path d="M26 24 Q23 27 20.5 24.5 M26 24 Q29 27 31.5 24.5" fill="none" stroke="'+OUT+'" stroke-width="1.3" stroke-linecap="round"/>'; // ปากยิ้ม
    s += '<path d="M17 21 H7 M17 24 H8 M35 21 H45 M35 24 H44" stroke="'+OUT+'" stroke-width="1" stroke-linecap="round" opacity="0.65"/>'; // หนวด
    s += '<circle cx="15" cy="21" r="2.2" fill="'+NOSE+'" opacity="0.45"/><circle cx="37" cy="21" r="2.2" fill="'+NOSE+'" opacity="0.45"/>'; // แก้ม
    s += '<path d="M22 5 v4 M26 4 v4 M30 5 v4" stroke="'+ST+'" stroke-width="1.7" stroke-linecap="round" opacity="0.5"/>'; // ลายหัว
  } else {
    s += '<path d="M20 8 v6 M26 6 v7 M32 8 v6" stroke="'+ST+'" stroke-width="1.9" stroke-linecap="round" opacity="0.5"/>'; // ลายหลังหัว
    s += '<path d="M19 34 h14 M20 40 h12 M21 45 h10" stroke="'+ST+'" stroke-width="2" stroke-linecap="round" opacity="0.5"/>'; // ลายหลังตัว
  }
  return s;
}
/* ตัวชี้ทิศเป็น "ปลา" (เข้ากับแมว) หัวปลาชี้ไปทิศที่แมวหัน (มองจากบน: dir 0=↑ 1=→ 2=↓ 3=←) */
function facingArrow(dir){
  const P = [[26,-4,-90],[52,30,0],[26,62,90],[0,30,180]][dir];  // [x, y, มุมหมุน] — ปลาชี้ขวาเป็นค่าตั้งต้น
  return '<g transform="translate('+P[0]+','+P[1]+') rotate('+P[2]+')" class="rb-arrow">'+
    '<path d="M-8 0 L-13.5 -4.5 L-13.5 4.5 Z" fill="#7fc9e6" stroke="#3f8fb0" stroke-width="1.6" stroke-linejoin="round"/>'+  // หางปลา
    '<ellipse cx="-1" cy="0" rx="7.5" ry="5.2" fill="#8fd3ec" stroke="#3f8fb0" stroke-width="1.6"/>'+                          // ตัวปลา
    '<circle cx="3.5" cy="-1.4" r="1.3" fill="#22384a"/>'+                                                                     // ตา
    '<path d="M-3 -1 q2 1 4 0" fill="none" stroke="#3f8fb0" stroke-width="0.9" stroke-linecap="round" opacity="0.6"/>'+        // เหงือก
    '</g>';
}
function robotSvg(dir){
  const mode = dir===0 ? 'back' : (dir===2 ? 'front' : 'side');
  const flip = (dir===3);  // ซ้าย = มองข้างแบบกลับด้านของขวา
  const g = flip ? '<g transform="translate('+ROBOT_VB+',0) scale(-1,1)">'+buildRobot(mode)+'</g>' : buildRobot(mode);
  return '<svg class="cchar-svg" viewBox="0 0 '+ROBOT_VB+' 60">'+g+facingArrow(dir)+'</svg>';
}
/* ---- จุดหมาย: บ้านแมว (วางที่ช่องเป้าหมาย ฐานที่ y=0) ---- */
const GOAL_CHAR =
  '<ellipse cx="0" cy="2" rx="18" ry="5" fill="#000" opacity="0.10"/>'+                                         // เงา
  '<rect x="-15" y="-19" width="30" height="21" rx="5" fill="#f0d3a8" stroke="#b98a52" stroke-width="2.4"/>'+   // ตัวบ้าน
  '<path d="M-19 -17 L0 -33 L19 -17 Z" fill="#ef7a52" stroke="#c8542f" stroke-width="2.4" stroke-linejoin="round"/>'+ // หลังคา
  '<circle cx="0" cy="-16" r="2.4" fill="#ffe08a" stroke="#c8542f" stroke-width="1.4"/>'+                        // ป้ายกลมบนหลังคา
  '<path d="M-15 -2 h30" stroke="#b98a52" stroke-width="1.6"/>'+
  '<circle cx="0" cy="-5" r="8.5" fill="#4a3528"/>'+                                                            // ประตูกลม (ทางเข้าแมว)
  '<circle cx="0" cy="-5" r="8.5" fill="none" stroke="#b98a52" stroke-width="2"/>'+
  '<path d="M-11 -19 l4 -3 M11 -19 l-4 -3" stroke="#c8542f" stroke-width="0" />'+
  '<circle cx="0" cy="-9.5" r="2" fill="#fff" opacity="0.85"/><circle cx="-2.6" cy="-11.6" r="1" fill="#fff" opacity="0.85"/><circle cx="2.6" cy="-11.6" r="1" fill="#fff" opacity="0.85"/><circle cx="-4.2" cy="-9.5" r="0.9" fill="#fff" opacity="0.85"/><circle cx="4.2" cy="-9.5" r="0.9" fill="#fff" opacity="0.85"/>'; // รอยเท้าแมวเหนือประตู
function robotLevelsFor(cat){
  if(cat.codeSet==='p3a') return ROBOT_LEVELS_P3A;
  if(cat.codeSet==='p3b') return ROBOT_LEVELS_P3B;
  if(cat.codeSet==='p3c') return ROBOT_LEVELS_P3C;
  if(cat.codeSet==='p3if') return ROBOT_LEVELS_P3IF;
  if(cat.codeSet==='p5a') return ROBOT_LEVELS_P5A;
  if(cat.codeSet==='p6a') return ROBOT_LEVELS_P6A;
  if(cat.codeSet==='p2a') return ROBOT_LEVELS_P2A;
  if(cat.codeSet==='p2b') return ROBOT_LEVELS_P2B;
  if(cat.codeSet==='p2c') return ROBOT_LEVELS_P2C;
  if(cat.codeSet==='code3') return ROBOT_LEVELS3;
  if(cat.codeSet==='code2') return ROBOT_LEVELS2;
  return ROBOT_LEVELS;
}

function startCodeGame(catId){
  stopARGame();
  clearTimeout(codeTimer); codeTimer = null;
  lastGameType = 'code'; lastCatId = catId;
  const cat = catById(catId);
  codeGame = { catId, level:1, mistakes:0, totalLevels:cat.levels, set:robotLevelsFor(cat), program:[], running:false, robot:null, lv:null, loop:!!cat.codeLoop, cond:!!cat.codeCond, repeat:1, repeatMax:(cat.codeCond?10:6) };
  const repRow = $('code-repeat-row'); if(repRow) repRow.hidden = !cat.codeLoop;
  codeView.querySelectorAll('.code-cmd-cond').forEach(b=>{ b.hidden = !cat.codeCond; });
  showOnlyView(codeView);
  document.documentElement.style.setProperty('--cat-color', cat.color);
  codeView.querySelectorAll('.progress-fill').forEach(el=>el.style.setProperty('--cat-color', cat.color));
  setCatLabel('code-cat-label', cat);
  renderCodeLevel();
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(()=>showOwlMsg('start'), 600);
}

function renderCodeLevel(){
  const g = codeGame;
  const lv = g.set[(g.level-1) % g.set.length];
  g.lv = lv;
  g.robot = { r:lv.start.r, c:lv.start.c, dir:lv.start.dir };
  g.program = [];
  g.running = false;
  g.repeat = 1; updateRepeatLabel();
  $('code-level-counter').textContent = g.level+'/'+g.totalLevels;
  $('code-progress-fill').style.width = ((g.level-1)/g.totalLevels*100)+'%';
  $('code-hint').textContent = g.cond
    ? 'ใส่บัตร "🌳 ถ้าเจอกำแพงให้เลี้ยว" แล้วตั้งทำซ้ำเยอะๆ แมวจะเดินเลี้ยวเองจนถึงบ้าน!'
    : g.loop
      ? 'เรียงบัตร แล้วตั้ง "🔁 ทำซ้ำ" ให้แมวเดินซ้ำหลายรอบ จนถึงบ้าน!'
      : 'เรียงบัตรคำสั่งให้แมวเดินกลับบ้าน แล้วกด "เล่น"!';
  $('code-run-btn').disabled = false;
  setCodeControlsDisabled(false);
  drawIsoBoard();
  renderCodeProgram();
}

/* ---------- กระดานกริดแบน (มองจากบน) — ธีมพาสเทลปัจจุบัน: ช่องมนลายหมากรุก + พุ่มไม้ + เพื่อน ---------- */
function isoMetrics(N){
  const CELL=62, PAD=12, TOP=26;   // TOP = เผื่อพื้นที่หัวตัวละครที่โผล่เหนือช่องบนสุด
  const vbW = N*CELL + 2*PAD;
  const vbH = N*CELL + 2*PAD + TOP;
  return {CELL, PAD, TOP, vbW, vbH, N};
}
function isoCenter(m,r,c){ return { x: m.PAD + c*m.CELL + m.CELL/2, y: m.TOP + m.PAD + r*m.CELL + m.CELL/2 }; }

/* พุ่มไม้มนนุ่ม (แทนกำแพง) — วางเต็มช่อง */
function drawBush(cx, cy){
  return '<ellipse cx="'+cx+'" cy="'+(cy+16)+'" rx="21" ry="6.5" fill="#000" opacity="0.08"/>'+
    '<circle cx="'+(cx-10)+'" cy="'+(cy+4)+'" r="13" fill="#6cbf80"/>'+
    '<circle cx="'+(cx+10)+'" cy="'+(cy+4)+'" r="13" fill="#5fb173"/>'+
    '<circle cx="'+cx+'" cy="'+(cy-6)+'" r="14.5" fill="#7ecb8f"/>'+
    '<ellipse cx="'+(cx-6)+'" cy="'+(cy-9)+'" rx="6" ry="4" fill="#a6e0ae"/>'+
    '<circle cx="'+(cx+7)+'" cy="'+(cy-1)+'" r="2.2" fill="#fff" opacity="0.45"/>';
}

function drawIsoBoard(){
  const g = codeGame, lv = g.lv, N = lv.size;
  const m = isoMetrics(N);
  g.iso = m;
  const svg = $('code-iso-svg');
  svg.setAttribute('viewBox', '0 0 '+m.vbW+' '+m.vbH);
  $('code-iso-stage').style.setProperty('--iso-aspect', m.vbW+' / '+m.vbH);
  const wallSet = new Set((lv.walls||[]).map(w=>w[0]+','+w[1]));
  const CELL=m.CELL, GAP=6, R=13;
  /* กรอบกระดานมนๆ */
  const bx=m.PAD-5, by=m.TOP+m.PAD-5, bw=N*CELL+10;
  let out = '<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bw+'" rx="20" fill="#d3ecdb" stroke="#a9d8ba" stroke-width="3.5"/>';
  let goalChar = '';
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      const ct = isoCenter(m, r, c), cx = ct.x, cy = ct.y;
      const isWall = wallSet.has(r+','+c);
      const isGoal = (lv.goal.r===r && lv.goal.c===c);
      const tx = cx-CELL/2+GAP/2, ty = cy-CELL/2+GAP/2, tw = CELL-GAP;
      const fill = isGoal ? '#ffe6a0' : (((r+c)%2===0) ? '#c3ebcf' : '#aadcb8');
      const stroke = isGoal ? '#eac766' : '#94cfa7';
      out += '<rect x="'+tx+'" y="'+ty+'" width="'+tw+'" height="'+tw+'" rx="'+R+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.6"/>';
      if(isGoal){
        out += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(tw*0.36)+'" fill="#fff3c4" opacity="0.7"/>';
        goalChar = '<g transform="translate('+cx+','+(cy+4)+')"><g class="code-goal-char">'+GOAL_CHAR+'</g></g>';
      }
      if(isWall) out += drawBush(cx, cy);
    }
  }
  svg.innerHTML = out + goalChar;
  codeMoveChar(false);
}

function codeMoveChar(animate){
  const g = codeGame, m = g.iso;
  if(!m) return;
  const ct = isoCenter(m, g.robot.r, g.robot.c);
  const el = $('code-char');
  if(el.dataset.dir !== ''+g.robot.dir){ el.innerHTML = robotSvg(g.robot.dir); el.dataset.dir = g.robot.dir; }
  el.style.width = (ROBOT_VB/m.vbW*100*1.0)+'%';    // ขนาดตัวละครสัมพันธ์กับกริด (แมวตัวเล็กลง)
  if(!animate) el.style.transition = 'none';
  el.style.left = (ct.x/m.vbW*100)+'%';
  el.style.top  = (ct.y/m.vbH*100)+'%';
  if(!animate){ void el.offsetWidth; el.style.transition = ''; }
  if(g.robotBump){
    el.classList.remove('code-bump'); void el.offsetWidth; el.classList.add('code-bump');
    g.robotBump = false;
  }
}

function renderCodeProgram(){
  const g = codeGame;
  const prog = $('code-program');
  prog.innerHTML = '';
  if(g.program.length===0){
    prog.innerHTML = '<span class="code-prog-empty">แตะบัตรคำสั่งด้านล่างเพื่อเรียงลำดับ 👇</span>';
    return;
  }
  g.program.forEach((cmd,i)=>{
    const card = document.createElement('button');
    card.className = 'code-prog-card';
    card.dataset.i = i;
    card.innerHTML = '<span class="cpc-num">'+(i+1)+'</span><span class="cpc-ico">'+CMD_ICON[cmd]+'</span>';
    card.setAttribute('aria-label','ลบคำสั่ง '+CODE_CMD[cmd].lbl);
    card.addEventListener('click', ()=>{ if(g.running) return; playClick(); g.program.splice(i,1); renderCodeProgram(); });
    prog.appendChild(card);
  });
}

function codeAddCommand(cmd){
  const g = codeGame;
  if(!g || g.running) return;
  if(g.program.length >= 24){ showToast('🐱','คำสั่งเยอะพอแล้วนะ ลองกด "เล่น" ดู!'); return; }
  playClick();
  g.program.push(cmd);
  renderCodeProgram();
}

function setCodeControlsDisabled(dis){
  codeView.querySelectorAll('.code-cmd-btn, #code-clear-btn, #code-repeat-btn').forEach(b=>{ b.disabled = dis; });
}

/* ---- loop (ทำซ้ำ N รอบ) — Phase 2.2 ป.2 ---- */
function updateRepeatLabel(){ const el = $('code-repeat-n'); if(el) el.textContent = (codeGame && codeGame.repeat) || 1; }
function codeCycleRepeat(){
  const g = codeGame; if(!g || g.running) return;
  playClick();
  g.repeat = ((g.repeat||1) % (g.repeatMax||6)) + 1;  // วน 1→2→…→max→1 (max=10 สำหรับบัตรเงื่อนไขที่เดินตามกำแพงยาว)
  updateRepeatLabel();
}

function codeRun(){
  const g = codeGame;
  if(!g || g.running) return;
  if(g.program.length===0){ showToast('🐱','เรียงบัตรคำสั่งก่อนนะ แล้วค่อยกดเล่น!'); return; }
  g.running = true;
  $('code-run-btn').disabled = true;
  setCodeControlsDisabled(true);
  $('code-char').classList.add('walking');
  $('code-hint').textContent = 'แมวกำลังเดินตามคำสั่ง...';
  /* ขยายโปรแกรมตามจำนวนรอบ (loop) — highlight การ์ดต้นฉบับด้วย index modulo */
  const times = g.loop ? (g.repeat || 1) : 1;
  const baseLen = g.program.length;
  const full = [];
  for(let k=0;k<times;k++) full.push(...g.program);
  let i = 0;
  const step = ()=>{
    if(i >= full.length){ codeCheckResult(); return; }
    const cmd = full[i];
    codeHighlightProgCard(i % baseLen);
    i++;
    applyCodeCommand(cmd);
    codeMoveChar(true);
    /* ถึงบ้านแล้วหยุดทันที (สำคัญกับบัตรเงื่อนไข+ทำซ้ำ ที่ตั้งรอบเผื่อไว้เยอะ) */
    if(g.robot.r===g.lv.goal.r && g.robot.c===g.lv.goal.c){ codeTimer = setTimeout(codeCheckResult, 430); return; }
    codeTimer = setTimeout(step, 560);
  };
  codeTimer = setTimeout(step, 350);
}

function applyCodeCommand(cmd){
  const g = codeGame, lv = g.lv;
  if(cmd==='left'){ g.robot.dir = (g.robot.dir+3)%4; }
  else if(cmd==='right'){ g.robot.dir = (g.robot.dir+1)%4; }
  else if(cmd==='forward'){
    const d = CODE_DIRS[g.robot.dir];
    const nr = g.robot.r + d.dr, nc = g.robot.c + d.dc;
    const wallSet = new Set((lv.walls||[]).map(w=>w[0]+','+w[1]));
    if(nr>=0 && nc>=0 && nr<lv.size && nc<lv.size && !wallSet.has(nr+','+nc)){ g.robot.r = nr; g.robot.c = nc; }
    else { g.robotBump = true; playClick(); }
  }
  else if(cmd==='ifwall'){
    /* บัตรเงื่อนไข (if-then-else): ถ้าข้างหน้ามีกำแพง/ขอบ → หันขวา, ไม่งั้น → เดินหน้า */
    const d = CODE_DIRS[g.robot.dir];
    const nr = g.robot.r + d.dr, nc = g.robot.c + d.dc;
    const wallSet = new Set((lv.walls||[]).map(w=>w[0]+','+w[1]));
    const blocked = !(nr>=0 && nc>=0 && nr<lv.size && nc<lv.size && !wallSet.has(nr+','+nc));
    if(blocked){ g.robot.dir = (g.robot.dir+1)%4; }
    else { g.robot.r = nr; g.robot.c = nc; }
  }
}

function codeHighlightProgCard(i){
  $('code-program').querySelectorAll('.code-prog-card').forEach(c=>c.classList.toggle('active', +c.dataset.i===i));
}
function codeClearProgHighlight(){
  $('code-program').querySelectorAll('.code-prog-card').forEach(c=>c.classList.remove('active'));
}

function codeCheckResult(){
  const g = codeGame, lv = g.lv;
  $('code-char').classList.remove('walking');
  const win = g.robot.r===lv.goal.r && g.robot.c===lv.goal.c;
  if(win){
    playCorrect(); mascotHappy(); showOwlMsg('correct');
    $('code-hint').textContent = 'เก่งมาก! แมวกลับถึงบ้านแล้ว!';
    $('code-progress-fill').style.width = (g.level/g.totalLevels*100)+'%';
    setTimeout(()=>{
      if(g.level >= g.totalLevels){ finishCodeGame(); }
      else { g.level++; renderCodeLevel(); }
    }, 1300);
  } else {
    g.mistakes++;
    playWrong(); showOwlMsg('wrong');
    $('code-hint').textContent = 'ยังไม่ถึงบ้านเลย ลองแก้คำสั่งแล้วกดเล่นใหม่นะ!';
    setTimeout(()=>{
      g.robot = { r:lv.start.r, c:lv.start.c, dir:lv.start.dir };
      g.running = false;
      $('code-run-btn').disabled = false;
      setCodeControlsDisabled(false);
      codeClearProgHighlight();
      codeMoveChar(true);
    }, 1400);
  }
}

function finishCodeGame(){
  clearTimeout(codeTimer); codeTimer = null;
  const cat = catById(codeGame.catId);
  const mistakes = codeGame.mistakes;
  const totalLevels = codeGame.totalLevels;
  showOnlyView(resultView);
  const stars = mistakes===0 ? 3 : (mistakes<=4 ? 2 : 1);
  const prev = progress[cat.id];
  const wasUnlocked = prev && prev.unlocked;
  const newlyUnlocked = !wasUnlocked && stars>=2;
  progress[cat.id] = { best: prev ? Math.max(prev.best, totalLevels) : totalLevels, stars: prev ? Math.max(prev.stars, stars) : stars, unlocked: wasUnlocked || stars>=2 };
  saveProgress();
  const cname = activeChild ? activeChild.name+' ' : '';
  $('result-emoji').textContent = stars===3 ? '🏆' : stars===2 ? '🎉' : '💪';
  $('result-title').textContent = stars===3 ? cname+'สุดยอดโปรแกรมเมอร์!' : stars===2 ? cname+'เก่งมากเลย!' : 'ทำได้ดีแล้วนะ '+cname+'!';
  const starsRow = $('stars-row'); starsRow.innerHTML = '';
  for(let i=0;i<3;i++){ const s=document.createElement('span'); s.textContent='⭐'; starsRow.appendChild(s); }
  Array.from(starsRow.children).forEach((s,i)=>{ setTimeout(()=>{ if(i<stars) s.classList.add('lit'); }, 200+i*220); });
  $('score-line').textContent = 'พาแมวกลับบ้านครบ '+totalLevels+' ด่าน! (พลาด '+mistakes+' ครั้ง)';
  $('score-sub').textContent = stars===3 ? cname+'สั่งให้แมวเดินเป๊ะทุกด่านเลย!' : stars===2 ? 'เก่งขึ้นทุกวันเลยนะ '+cname+'!' : 'ไม่เป็นไรนะ ลองอีกครั้งเก็บดาวเพิ่ม!';
  const stickerBlock = $('sticker-block');
  if(newlyUnlocked){ stickerBlock.hidden=false; setStickerEarned(cat); pendingSticker=cat.id; setTimeout(()=>{ burstCenterTop(40); playCongrats(); },250); setTimeout(()=>showOwlMsg('sticker'),400); }
  else { stickerBlock.hidden=true; if(mistakes===0){ setTimeout(()=>showOwlMsg('perfect'),400);} if(stars>=2) setTimeout(()=>{ burstCenterTop(50); playCongrats(); },250); }
  $('review-wrap').hidden = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

codeView.querySelectorAll('.code-cmd-btn').forEach(btn=>{
  const ico = btn.querySelector('.ccmd-ico');
  if(ico) ico.innerHTML = CMD_ICON[btn.dataset.cmd] || '';
  btn.addEventListener('click', ()=> codeAddCommand(btn.dataset.cmd));
});
(function(){ const rb = $('code-repeat-btn'); if(rb) rb.addEventListener('click', codeCycleRepeat); })();
$('code-run-btn').addEventListener('click', ()=>{ playClick(); codeRun(); });
$('code-clear-btn').addEventListener('click', ()=>{
  const g = codeGame; if(!g || g.running) return;
  playClick(); g.program = []; renderCodeProgram();
});
$('code-back').addEventListener('click', ()=>{
  playClick(); clearTimeout(codeTimer); codeTimer=null;
  showOnlyView(homeView);
  renderHome();
  window.scrollTo({top:0, behavior:'smooth'});
});
