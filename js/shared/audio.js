/* ================================================================================
   เสียง/เพลงพื้นหลังที่หน้าเด็กกับโหมดครูใช้ร่วมกัน
   ต้องมี ensureAudio() / playTone() / soundOn / musicOn / MUSIC_TRACKS ของหน้านั้นๆ อยู่ก่อน (เรียกตอน runtime)
   ================================================================================ */

function playCorrect(){ playTone(523.25,.15,'sine',0,.14); playTone(659.25,.18,'sine',.12,.14); playTone(783.99,.24,'sine',.24,.14); }

function playWrong(){ playTone(190,.28,'sawtooth',0,.07); }

function playClick(){ playTone(659.25,.08,'sine',0,.12); playTone(1318.5,.05,'sine',0,.04); }

/* แฟนแฟร์แสดงความยินดีตอนจบเกม (จังหวะเดียวกับพลุ) — โทน C major เดียวกับ playCorrect */
function playCongrats(){
  playTone(523.25,.16,'sine',0,.13);
  playTone(659.25,.16,'sine',.14,.13);
  playTone(783.99,.16,'sine',.28,.13);
  playTone(1046.5,.22,'sine',.42,.15);
  playTone(1318.5,.55,'sine',.64,.11);
  playTone(1046.5,.55,'sine',.64,.10);
  playTone(783.99,.55,'sine',.64,.08);
}

function ensureMusicGain(){
  ensureAudio();
  if(audioCtx && !musicGain){
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.0001;
    musicGain.connect(audioCtx.destination);
  }
}

/* opt (เพิ่ม 2026-08-16 สำหรับเพลง 3 ชั้นของโหมดบ้าน · เว้นไว้ = พฤติกรรมเดิมเป๊ะ)
     gain = ตัวคูณความดังของชั้นนั้น · sub = ใส่เสียงต่ำ 1 อ็อกเทฟไหม (ชั้นคอร์ดไม่ใส่ จะขุ่น)
     atk  = เวลาขึ้นเสียง (ชั้นคอร์ดขึ้นช้ากว่า จะได้ไม่แย่งความสนใจจากทำนอง)
   ⚠ **หน้าครูใช้ไฟล์นี้ร่วม** — พารามิเตอร์ทั้งหมดเป็น optional เท่านั้น ห้ามเปลี่ยนค่าเริ่มต้น */
function scheduleMusicNote(freq, startTime, dur, opt){
  if(freq==null) return;
  opt = opt || {};
  const gMul = (opt.gain == null) ? 1 : opt.gain;
  const withSub = (opt.sub == null) ? true : !!opt.sub;
  const atk = opt.atk || 0.06;
  const tail = 0.12;
  const osc = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.9*gMul), startTime+atk);
  noteGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35+tail);
  osc.connect(noteGain).connect(musicGain);
  osc.start(startTime); osc.stop(startTime+dur+tail);
  if(!withSub) return;

  const subOsc = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(freq/2, startTime);
  subGain.gain.setValueAtTime(0.0001, startTime);
  subGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.35*gMul), startTime+0.05);
  subGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35+tail);
  subOsc.connect(subGain).connect(musicGain);
  subOsc.start(startTime); subOsc.stop(startTime+dur+tail);
}

/* ============================================================
   🎵 playlist ที่สลับได้ (เพิ่ม 2026-08-16 · เฟส 14)

   เดิมทั้งแอปมี playlist เดียวคือ `MUSIC_TRACKS` ของหน้าหลัก โหมดบ้านจึงได้ยินเพลงหน้าทำโจทย์
   ตอนนี้สลับได้ผ่าน `setMusicPlaylist(list)` — ส่ง `null` = กลับไปใช้ชุดเดิมของหน้านั้น

   ⚠ **ต้อง idempotent** — `enterHouseGame()` ถูกเรียกซ้ำได้ ถ้าสลับแล้วรีสตาร์ตทุกครั้ง
     เพลงจะเริ่มใหม่รัวๆ (กับดักเดียวกับ `mountHandPlayHouse()`)
   ⚠ **หน้าครูไม่เคยเรียกตัวนี้** ⇒ `musicList()` คืน MUSIC_TRACKS เหมือนเดิมทุกประการ
   ============================================================ */
let musicPlaylist = null;
let musicLayerT = null;      /* เวลานัดหมายของแต่ละชั้น (เพลงหลายชั้นเท่านั้น) */
function musicList(){
  return (musicPlaylist && musicPlaylist.length) ? musicPlaylist
       : (typeof MUSIC_TRACKS !== 'undefined' ? MUSIC_TRACKS : []);
}
function setMusicPlaylist(list){
  const next = (list && list.length) ? list : null;
  if(next === musicPlaylist) return;                 /* ชุดเดิม = ไม่ต้องทำอะไร (idempotent) */
  musicPlaylist = next;
  musicTrackIdx = 0; musicNoteIndex = 0; musicLayerT = null;
  if(musicOn && musicSchedulerId){
    /* กำลังเล่นอยู่ → เริ่มชุดใหม่ทันที (startMusic รีเซ็ตตัวชี้ให้เอง) */
    stopMusic();
    startMusic();
  }
}
/* เล่นเพลงเดียวแบบเจาะจง (หน้าทดสอบเพลงในเมนูตั้งค่า) — คืนค่าเป็นตัวมันเองเพื่อ chain ได้ */
function playMusicTrack(list, idx){
  setMusicPlaylist(list);
  musicTrackIdx = (idx | 0) % Math.max(1, musicList().length);
  musicNoteIndex = 0; musicLayerT = null;
  stopMusic(); startMusic();
}
/* ---- เพลงหลายชั้น: ทำนองเป็นตัวตัดสินว่าเพลงจบ · เบส/คอร์ดวนซ้ำอยู่ภายในเพลง ---- */
const MUSIC_LAYER_MIX = {lead:{gain:1, sub:true, atk:.06},
                         bass:{gain:.55, sub:false, atk:.07},
                         chord:{gain:.30, sub:false, atk:.13}};
function musicSchedulerLayered(track){
  const beat = 60 / track.bpm;
  const horizon = audioCtx.currentTime + 1.0;
  if(!musicLayerT) musicLayerT = {lead:musicNextTime, bass:musicNextTime, chord:musicNextTime, i:{bass:0, chord:0}};
  /* ชั้นเบส/คอร์ด — วนซ้ำไปเรื่อยๆ จนกว่าทำนองจะจบเพลง */
  ['bass', 'chord'].forEach(k=>{
    const seq = track.layers[k];
    if(!seq || !seq.length) return;
    const mix = MUSIC_LAYER_MIX[k];
    while(musicLayerT[k] < horizon){
      const step = seq[musicLayerT.i[k] % seq.length];
      const dur = step[1] * beat;
      const notes = Array.isArray(step[0]) ? step[0] : [step[0]];
      notes.forEach(f => scheduleMusicNote(f, musicLayerT[k], dur, mix));
      musicLayerT[k] += dur;
      musicLayerT.i[k]++;
    }
  });
  /* ชั้นทำนอง — จบแล้วขึ้นเพลงถัดไป (พัก 2 จังหวะเหมือน playlist เดิม) */
  const lead = track.layers.lead || [];
  while(musicLayerT.lead < horizon){
    const step = lead[musicNoteIndex];
    if(!step) break;
    const dur = step[1] * beat;
    scheduleMusicNote(step[0], musicLayerT.lead, dur, MUSIC_LAYER_MIX.lead);
    musicLayerT.lead += dur;
    musicNoteIndex++;
    if(musicNoteIndex >= lead.length){
      musicNoteIndex = 0;
      musicTrackIdx = (musicTrackIdx + 1) % musicList().length;
      musicNextTime = musicLayerT.lead + beat * 2;
      musicLayerT = null;                  /* เพลงใหม่ = เริ่มนับชั้นใหม่หมด */
      return;
    }
  }
  musicNextTime = musicLayerT ? musicLayerT.lead : musicNextTime;
}
function musicScheduler(){
  if(!musicOn || !audioCtx) return;
  const list = musicList();
  if(!list.length) return;
  if(musicTrackIdx >= list.length) musicTrackIdx = 0;
  if(list[musicTrackIdx] && list[musicTrackIdx].layers){
    musicSchedulerLayered(list[musicTrackIdx]);
    return;
  }
  while(musicNextTime < audioCtx.currentTime + 1.0){
    const track = list[musicTrackIdx];
    const beat = 60/track.bpm;
    const [freq, beats] = track.notes[musicNoteIndex];
    const dur = beats*beat;
    scheduleMusicNote(freq, musicNextTime, dur);
    musicNextTime += dur;
    musicNoteIndex++;
    if(musicNoteIndex >= track.notes.length){
      /* จบเพลง — พัก 2 จังหวะแล้วต่อเพลงถัดไปวนเป็น playlist */
      musicNoteIndex = 0;
      musicTrackIdx = (musicTrackIdx+1) % list.length;
      musicNextTime += beat*2;
    }
  }
}

function startMusic(){
  ensureMusicGain();
  if(!audioCtx) return;
  if(audioCtx.state==='suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(musicGain.gain.value, now);
  musicGain.gain.linearRampToValueAtTime(0.025, now+0.4);
  musicNextTime = now + 0.1;
  musicNoteIndex = 0;
  musicLayerT = null;
  if(musicSchedulerId) clearInterval(musicSchedulerId);
  musicScheduler();
  musicSchedulerId = setInterval(musicScheduler, 250);
}

function stopMusic(){
  if(musicGain && audioCtx){
    const now = audioCtx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.linearRampToValueAtTime(0.0001, now+0.4);
  }
  if(musicSchedulerId){ clearInterval(musicSchedulerId); musicSchedulerId=null; }
}

function refreshMusicBtn(){ musicBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_MUSIC+'</span><span class="mute-stripe"></span></span>'; musicBtn.classList.toggle('muted', !musicOn); musicBtn.dataset.tooltip = musicOn ? 'ปิดเพลงพื้นหลัง' : 'เปิดเพลงพื้นหลัง'; }
