/* ================================================================================
   ยูทิลิตี้ UI ที่ใช้ร่วมกันทั้งสองหน้า (toast, ธีมกลางวัน-กลางคืน, overlay, สุ่มอาเรย์)
   ================================================================================ */

function showToast(emoji, msg){
  /* 🎨 รับได้ทั้ง emoji และ **ไอคอน SVG** (โหมดบ้านเปลี่ยนมาใช้ SVG แล้ว 2026-08-18
     เพราะ emoji แสดงผลไม่เหมือนกันข้าม OS) — ของเดิมที่ส่ง emoji มายังทำงานเหมือนเดิมทุกประการ
     ⚠ รับ HTML เฉพาะกรณีขึ้นต้นด้วย `<svg` เท่านั้น ที่เหลือยังเป็น textContent (กัน HTML หลุด) */
  const te = $('toast-emoji');
  if(typeof emoji === 'string' && emoji.slice(0, 4) === '<svg') te.innerHTML = emoji;
  else te.textContent = emoji;
  $('toast-msg').textContent = msg;
  const t = $('toast');
  t.classList.remove('visible');
  void t.offsetWidth;
  t.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(()=>t.classList.remove('visible'), 2600);
}

function isNightMode(){ return document.body.classList.contains('night-mode'); }

function setTheme(night, persist){
  document.body.classList.toggle('night-mode', night);
  if(persist){ try{ localStorage.setItem('p1quiz_theme', night?'night':'day'); }catch(e){} }
  refreshThemeBtn();
  bgDecorEl.querySelectorAll('.bg-floater, .bg-cloud').forEach(e=>e.remove());
}

function refreshSoundBtn(){ soundBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_SPEAKER+'</span><span class="mute-stripe"></span></span>'; soundBtn.classList.toggle('muted', !soundOn); soundBtn.dataset.tooltip = soundOn ? 'ปิดเสียง' : 'เปิดเสียง'; }

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function openOverlay(id){
  const el = $(id);
  el.hidden = false;
  requestAnimationFrame(()=> requestAnimationFrame(()=> el.classList.add('show')));
}

function closeOverlay(id){
  const el = $(id);
  el.classList.remove('show');
  setTimeout(()=>{ el.hidden = true; }, 300);
}

/* ================= ป้ายนับผู้เข้าชม (footer) =================
   🔒 **เลือกตัวนับจาก hostname เอง** — production นับของจริง · ที่อื่นลงตัวนับทดสอบ
   เดิมฝัง URL ไว้ใน HTML แล้วต้องสลับ prod/dev ด้วยมือทุกครั้งที่ deploy
   ⇒ ลืมทีเดียวยอด visitor จริงเพี้ยนถาวร (พลาดมาแล้ว 2026-08-23 · `git add -A` ดูดค่า dev เข้า commit)
   ⚠️ ชุดเทสรันบน 127.0.0.1 ⇒ ยิงลงตัวนับทดสอบเสมอ ยอดจริงไม่ขยับไม่ว่าจะรันกี่รอบ
   ⚠️ หน้าครูใช้ไฟล์นี้ร่วม — แยกด้วย `data-count` ที่ตัว <img> ไม่ใช่เช็ค path */
(function(){
  const PROD = /^(owlkids\.net|www\.owlkids\.net|isarez\.github\.io)$/.test(location.hostname);
  const KEY = {
    site:    {prod:'https://owlkids.net',         test:'https://owlkids.net/test'},
    teacher: {prod:'https://owlkids.net/teacher', test:'https://owlkids.net/teacher-test'},
  };
  function paint(){
    document.querySelectorAll('img.visitor-badge[data-count]').forEach(img=>{
      if(img.src) return;                                   /* วาดแล้ว ไม่ยิงซ้ำ */
      const k = KEY[img.dataset.count]; if(!k) return;
      img.src = 'https://hitscounter.dev/api/hit?url=' + encodeURIComponent(PROD ? k.prod : k.test)
              + '&label=visitors&icon=eye&color=' + (img.dataset.color || '%23ffb020');
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
})();
