/* ================================================================================
   HouseGames — สะพานระหว่าง "การ์ดเควสต์ในโหมดบ้าน" กับ engine เกมของหน้าหลัก

   ใช้ทำอะไร
   ---------
   เฟส 5 (กลไกกลุ่ม C) ไม่ได้เขียนเกมใหม่ แต่ **ยืม engine เดิมมาเล่นในการ์ดเควสต์**
   ตัวกลางคือ `window.OwlGames` (js/owl-games.js) ที่ย้ายทั้งกล่อง view มาวางในกล่องที่ให้
   ไฟล์นี้ทำหน้าที่ประกอบร่าง: เปิดการ์ด → mount เกม → รับผลกลับมาจ่ายเหรียญ/ปิดเควสต์

   ทำไมต้องเป็นไฟล์แยก
   -------------------
   `js/house.js` แตะ 12,800 บรรทัดแล้ว และห่อด้วย IIFE (ไฟล์อื่นแตะภายในไม่ได้)
   ⇒ โค้ดใหม่ของเฟส 5-7 มาอยู่ที่นี่ คุยกับ house.js ผ่าน `window.HouseQuestUI` ประตูเดียว
     (`openCard` / `closeCard` / `makeBtn` / `award`) — เพิ่มประตูใหม่เมื่อจำเป็นจริงๆ เท่านั้น

   ⚠ ข้อควรระวัง
   - ต้องโหลด **หลัง** house.js (games-ar.js คุมลำดับอยู่)
   - engine ที่ยืมมาเป็นเกมยาว 10 ด่าน ⇒ ในเควสต์ให้ถือว่า "1 เควสต์ = 1 รอบเกม"
     ดาวมาจากจำนวนที่พลาด ไม่ใช่จำนวนข้อแบบกลไกอื่น
   ================================================================================ */
(function(){
  'use strict';

  const UI = () => window.HouseQuestUI;
  const OG = () => window.OwlGames;

  /* เกมที่อนุญาตให้โผล่ในโหมดบ้าน + ชื่อที่เด็กอ่านเข้าใจ
     ⚠ ไม่ใช่ทุกเกมที่ลงทะเบียนไว้จะเหมาะกับการ์ดใบเล็ก — เพิ่มทีละตัวหลังลองเล่นจริงเท่านั้น */
  const ALLOW = {
    mix:      {name:'ผสมสี',        emoji:'🎨'},
    memory:   {name:'จับคู่ความจำ',  emoji:'🎴'},
    balance:  {name:'ตาชั่งวิเศษ',   emoji:'⚖️'},
    clock:    {name:'นาฬิกาวิเศษ',   emoji:'🕐'},
    shadow:   {name:'ทายเงา',       emoji:'🫥'},
    sort:     {name:'จัดหมวดหมู่',   emoji:'🗂️'},
    order:    {name:'เรียงลำดับ',    emoji:'🔢'},
    music:    {name:'เล่นตามทำนอง',  emoji:'🎹'},
  };

  function allowed(){ return Object.keys(ALLOW).filter(id => OG() && OG().has(id)); }

  /* หา category ของหน้าหลักที่ใช้ engine นี้ และเหมาะกับระดับชั้นเด็กที่สุด
     ⚠ หมวดของหน้าหลักผูกกับ `cat.grade` — ถ้าชั้นนั้นไม่มี ให้ถอยไปหมวดไม่ระบุชั้น (เตรียม ป.1) */
  function pickCat(gameId, gradeId){
    if(typeof CATS === 'undefined') return null;
    const all = CATS.filter(c => c.mode === gameId);
    if(!all.length) return null;
    const own = all.filter(c => (c.grade || 'prep-p1') === gradeId);
    const pool = own.length ? own : all.filter(c => !c.grade);
    const use = pool.length ? pool : all;
    return use[Math.floor(Math.random() * use.length)];
  }

  /* เปิดเกมในการ์ดเควสต์ — opts = {gameId, gradeId, onDone(result), title}
     คืน true ถ้าเปิดได้จริง */
  function play(opts){
    opts = opts || {};
    const ui = UI(), og = OG();
    if(!ui || !og || !ALLOW[opts.gameId] || !og.has(opts.gameId)) return false;
    const cat = pickCat(opts.gameId, opts.gradeId || 'prep-p1');
    if(!cat) return false;

    const meta = ALLOW[opts.gameId];
    const stage = ui.openCard(opts.title || (meta.emoji + ' ' + meta.name), cat.name || '');
    if(!stage) return false;

    const ok = og.mount(opts.gameId, stage, {
      catId: cat.id,
      onDone: res => {
        /* engine จบเกม → OwlGames ถอด view ออกให้แล้ว การ์ดยังเปิดอยู่ วาดหน้าสรุปทับได้เลย */
        if(typeof opts.onDone === 'function') opts.onDone(res);
        else summary(res, meta);
      },
    });
    if(!ok){ ui.closeCard(); return false; }
    return true;
  }

  /* หน้าสรุปเริ่มต้น (ใช้ตอนเรียกแบบไม่ส่ง onDone มา เช่นเล่นเทสจากหน้าคลังคำถาม) */
  function summary(res, meta){
    const ui = UI();
    const stage = ui.openCard((meta ? meta.emoji + ' ' : '') + 'เล่นจบแล้ว!', '');
    if(!stage) return;
    const s = document.createElement('div');
    s.className = 'hqz-stars';
    s.textContent = '⭐'.repeat(res.stars) + '☆'.repeat(3 - res.stars);
    const g = document.createElement('div');
    g.className = 'hqz-gain';
    g.textContent = res.doneWord + 'ครบ ' + res.totalLevels + ' ด่าน · พลาด ' + res.mistakes + ' ครั้ง';
    stage.appendChild(s); stage.appendChild(g);
    const row = document.createElement('div'); row.className = 'hqz-row';
    row.appendChild(ui.makeBtn('เยี่ยม!', 'hqz-yes', () => ui.closeCard()));
    stage.appendChild(row);
    if(typeof playCongrats === 'function') playCongrats();
  }

  window.HouseGames = {play, allowed, ALLOW, pickCat};
})();
