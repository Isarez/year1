/* ================================================================================
   ยูทิลิตี้ UI ที่ใช้ร่วมกันทั้งสองหน้า (toast, ธีมกลางวัน-กลางคืน, overlay, สุ่มอาเรย์)
   ================================================================================ */

function showToast(emoji, msg){
  $('toast-emoji').textContent = emoji;
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
