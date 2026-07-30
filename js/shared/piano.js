/* ================================================================================
   คีย์เปียโน/โน้ต ที่ใช้ทั้งเกมดนตรีหน้าเด็กและ mechanic ดนตรีของครู
   ================================================================================ */

function musicKeyLabel(k){ return musicNotation==='en' ? k.en : k.th; }

/* เทียบชื่อโน้ตแบบไม่สนใจ octave (ด ที่ index 0/7/14 ถือว่าเหมือนกัน) */
function sameNote(a, b){ return MUSIC_WHITE_KEYS[a].th === MUSIC_WHITE_KEYS[b].th; }

function pianoWhiteEl(i){ return $('music-piano').querySelector('.music-white[data-white="'+i+'"]'); }

function flashKey(key){ if(!key) return; key.classList.add('pressed'); setTimeout(()=>key.classList.remove('pressed'), 200); }

/* เสียงโน้ตเปียโนแบบนุ่มใส (Web Audio: sine หลัก + โอเวอร์โทนเบา, envelope นุ่ม) */
function playPianoNote(freq, dur){
  ensureAudio();
  if(!audioCtx) return;
  if(audioCtx.state==='suspended') audioCtx.resume();
  const t0 = audioCtx.currentTime; dur = dur || 0.9;
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.2, t0+0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
  master.connect(audioCtx.destination);
  [[1,1],[2,0.16]].forEach(([mult,g])=>{
    const osc = audioCtx.createOscillator(), og = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq*mult; og.gain.value = g;
    osc.connect(og).connect(master);
    osc.start(t0); osc.stop(t0+dur);
  });
}

/* วาดคีย์เปียโนลงใน element ที่ระบุ (ใช้ทั้งเกมดนตรีและ modal เปียโนอิสระ) */
function renderPianoKeys(piano, hideLabels){
  piano.classList.toggle('no-key-labels', !!hideLabels);
  const n = MUSIC_WHITE_KEYS.length;
  let html = '';
  MUSIC_WHITE_KEYS.forEach((k,i)=>{
    html += '<button class="music-key music-white" data-white="'+i+'" style="--key-color:'+k.color+'" aria-label="'+k.th+'">'
         +  '<span class="mk-label">'+musicKeyLabel(k)+'</span></button>';
  });
  MUSIC_BLACK_KEYS.forEach((b,i)=>{
    html += '<button class="music-key music-black" data-black="'+i+'" style="left:'+((b.after+1)*(100/n))+'%" aria-label="คีย์ดำ"></button>';
  });
  piano.innerHTML = html;
}
