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
    /* เฟส 6 — แล็บ STEM + coding (ข้อ 30/30.1 ของ QUEST-DESIGN.md)
       ⚠ tangram มีแค่ ป.5-6 · circuit มีแค่ ป.6 ⇒ `pickCat()` ด้านล่างกันไม่ให้เด็กชั้นต่ำเจอเอง */
    tangram:  {name:'ต่อรูปทรง',     emoji:'🧩'},
    circuit:  {name:'ต่อวงจรไฟฟ้า',  emoji:'💡'},
    code:     {name:'พาหุ่นยนต์',    emoji:'🤖'},
  };

  function allowed(){ return Object.keys(ALLOW).filter(id => OG() && OG().has(id)); }

  /* ตัวกรองหมวดย่อยของเกมเดียวกัน — ใช้กับ `code` ที่ engine ตัวเดียวเล่นได้ 3 แบบ
     (แล็บแจกเป็น 3 งานคนละแบบ: เดินตามคำสั่ง · วนซ้ำ · มีเงื่อนไข) */
  const PICKS = {
    plain: c => !c.codeLoop && !c.codeCond,
    loop:  c => !!c.codeLoop && !c.codeCond,
    cond:  c => !!c.codeCond,
  };

  /* หา category ของหน้าหลักที่ใช้ engine นี้ และเหมาะกับระดับชั้นเด็กที่สุด
     ⚠ **ห้ามคืนหมวดที่ระดับชั้นสูงกว่าเด็กเด็ดขาด** — เกมอย่างวงจรไฟฟ้า/แท็งแกรมมีแต่หมวด ป.5-6
       ของเดิม fallback เป็น `all` ⇒ เด็ก ป.1 จะโดนโจทย์ ป.6 เข้าให้ (ผิดกติกาความยากตามชั้น)
       ลำดับที่ใช้: ชั้นตัวเอง → ชั้นที่ต่ำกว่าที่ใกล้สุด → หมวดไม่ระบุชั้น → **ไม่มีก็คืน null**
       (คืน null = `engineReady()` เป็น false ⇒ เควสต์ถอยไป quiz ให้เอง ไม่มี dead end)
     ⚠ โจทย์ท้าทาย (chal) ส่ง gradeId ของชั้นถัดไปมาอยู่แล้ว จึงได้หมวดชั้นสูงกว่าโดยตั้งใจทางนั้น */
  function pickCat(gameId, gradeId, pickKind){
    if(typeof CATS === 'undefined') return null;
    const f = PICKS[pickKind];
    const all = CATS.filter(c => c.mode === gameId && (!f || f(c)));
    if(!all.length) return null;
    const gr = (typeof GRADES !== 'undefined') ? GRADES.map(g => g.id) : ['prep-p1'];
    const gi = Math.max(0, gr.indexOf(gradeId || 'prep-p1'));
    for(let i = gi; i >= 0; i--){
      const pool = all.filter(c => (c.grade || 'prep-p1') === gr[i]);
      if(pool.length) return pool[Math.floor(Math.random() * pool.length)];
    }
    const free = all.filter(c => !c.grade);
    return free.length ? free[Math.floor(Math.random() * free.length)] : null;
  }

  /* เปิดเกมในการ์ดเควสต์ — opts = {gameId, gradeId, onDone(result), title}
     คืน true ถ้าเปิดได้จริง */
  function play(opts){
    opts = opts || {};
    const ui = UI(), og = OG();
    if(!ui || !og || !ALLOW[opts.gameId] || !og.has(opts.gameId)) return false;
    const cat = pickCat(opts.gameId, opts.gradeId || 'prep-p1', opts.pick);
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
