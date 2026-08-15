/* ============================================================
   🎶 หน้า "ฟังเพลงธีม" ของโหมดบ้าน (เฟส 14 · 2026-08-16) — **เครื่องมือเทสเท่านั้น**

   ทำไมต้องมี: ผู้ใช้สั่งให้มีเมนูฟังเพลงธีมที่สร้างขึ้นทั้งหมด **เพื่อทดสอบฟังเท่านั้น**
   (เพลงพวกนี้ปกติเล่นเป็นพื้นหลังตอนเดินในเมือง ฟังทีละเพลงเจาะจงไม่ได้)

   ⚠ กติกาของไฟล์นี้:
     - **อ่านอย่างเดียว** ไม่แตะ state เด็กเลย — ไม่บันทึกอะไร ไม่เปลี่ยนค่า setting เพลง
     - ปิดหน้านี้เมื่อไหร่ **ต้องคืน playlist กลับเป็นชุดฟาร์มปกติ** ไม่งั้นเดินในเมืองแล้วเงียบ
     - เพลงทั้งหมดมาจาก `window.HouseMusic` (js/house-music.js) — ไฟล์นี้ไม่มีโน้ตของตัวเอง

   🔒 **MUSIC_PANEL_ENABLED — เครื่องมือเทส ต้องตั้งเป็น `false` ทุกครั้งที่ deploy**
      (กติกาเดียวกับ `QB_ENABLED` / `DEV_ENABLED` — ไม่ต้องถามผู้ใช้)

   โหลดแบบ lazy ต่อจาก house-music.js ใน js/games-ar.js — เปิดออกมาที่ `window.HouseMusicUI`
   ============================================================ */
(function(){
  'use strict';

  const MUSIC_PANEL_ENABLED = true;

  const $ = id => document.getElementById(id);
  let playingIdx = -1;

  function M(){ return window.HouseMusic || null; }
  function isOpen(){ const e = $('house-mus'); return !!e && !e.hidden; }

  function paint(){
    const m = M(), wrap = $('hmus-list'), sum = $('hmus-sum');
    if(!m || !wrap) return;
    const names = m.names(), secs = m.seconds();
    sum.textContent = names.length + ' เพลง · เล่นวนเรียงตอนอยู่ในเมือง · '
      + '3 ชั้น (ทำนอง + เบส + คอร์ด) · เสียง sine ล้วน ไม่มีกลอง';
    wrap.innerHTML = '';
    names.forEach((nm, i)=>{
      const row = document.createElement('div');
      row.className = 'hmus-row' + (i === playingIdx ? ' on' : '');
      const num = document.createElement('span');
      num.className = 'hmus-n'; num.textContent = String(i + 1);
      const info = document.createElement('div');
      info.className = 'hmus-info';
      const t = document.createElement('div');
      t.className = 'hmus-name'; t.textContent = nm;
      const d = document.createElement('div');
      d.className = 'hmus-meta';
      d.textContent = Math.round(secs[i]) + ' วินาที · ' + m.TRACKS[i].bpm + ' bpm';
      info.appendChild(t); info.appendChild(d);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hmus-play' + (i === playingIdx ? ' on' : '');
      b.textContent = i === playingIdx ? '⏸' : '▶';
      b.setAttribute('aria-label', (i === playingIdx ? 'หยุด' : 'เล่น') + ' ' + nm);
      b.addEventListener('click', ()=>{
        if(typeof playClick === 'function') playClick();
        if(i === playingIdx){ stop(); return; }
        /* ⚠ ปุ่มเพลงพื้นหลังปิดอยู่ = กดเล่นแล้วจะเงียบสนิท ต้องบอกให้รู้ ไม่ใช่ปล่อยให้งง */
        if(typeof musicOn !== 'undefined' && !musicOn){
          if(typeof showToast === 'function')
            showToast('🔇', 'เพลงพื้นหลังปิดอยู่ — เปิดที่เมนู "เพลงพื้นหลัง" ก่อนนะ');
          return;
        }
        playingIdx = i;
        m.preview(i);
        paint();
      });
      row.appendChild(num); row.appendChild(info); row.appendChild(b);
      wrap.appendChild(row);
    });
  }
  /* หยุดฟัง = กลับไปเล่น playlist ฟาร์มตามปกติ (ไม่ใช่เงียบสนิท — เด็กยังอยู่ในเมือง) */
  function stop(){
    playingIdx = -1;
    const m = M();
    if(m){
      if(typeof setMusicPlaylist === 'function') setMusicPlaylist(null);
      m.use();
    }
    paint();
  }
  function open(){
    if(!MUSIC_PANEL_ENABLED || !M()) return;
    playingIdx = -1;
    paint();
    $('house-mus').hidden = false;
  }
  function close(){
    const e = $('house-mus');
    if(e) e.hidden = true;
    stop();                     /* ⚠ ปิดหน้าแล้วต้องคืนเพลงเมืองเสมอ */
  }

  const closeBtn = $('hmus-close');
  if(closeBtn) closeBtn.addEventListener('click', ()=>{
    if(typeof playClick === 'function') playClick();
    close();
  });
  const stopBtn = $('hmus-stop');
  if(stopBtn) stopBtn.addEventListener('click', ()=>{
    if(typeof playClick === 'function') playClick();
    stop();
  });

  /* ปิดอยู่ → ซ่อนปุ่มในเมนูเฟืองทิ้งไปเลย (inline style ชนะ .icon-btn{display:inline-flex} เสมอ
     — แพทเทิร์นเดียวกับ QB_FEATURE_OFF จึงปิดไม่ครึ่งๆ กลางๆ) */
  if(!MUSIC_PANEL_ENABLED){
    const b = $('house-music-btn');
    if(b) b.style.display = 'none';
  }

  window.HouseMusicUI = {open, close, isOpen, paint, enabled: MUSIC_PANEL_ENABLED,
                         playing: ()=> playingIdx};
})();
