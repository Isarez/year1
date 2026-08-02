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

function scheduleMusicNote(freq, startTime, dur){
  if(freq==null) return;
  const tail = 0.12;
  const osc = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.exponentialRampToValueAtTime(0.9, startTime+0.06);
  noteGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35+tail);
  osc.connect(noteGain).connect(musicGain);
  osc.start(startTime); osc.stop(startTime+dur+tail);

  const subOsc = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(freq/2, startTime);
  subGain.gain.setValueAtTime(0.0001, startTime);
  subGain.gain.exponentialRampToValueAtTime(0.35, startTime+0.05);
  subGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35+tail);
  subOsc.connect(subGain).connect(musicGain);
  subOsc.start(startTime); subOsc.stop(startTime+dur+tail);
}

function musicScheduler(){
  if(!musicOn || !audioCtx) return;
  while(musicNextTime < audioCtx.currentTime + 1.0){
    const track = MUSIC_TRACKS[musicTrackIdx];
    const beat = 60/track.bpm;
    const [freq, beats] = track.notes[musicNoteIndex];
    const dur = beats*beat;
    scheduleMusicNote(freq, musicNextTime, dur);
    musicNextTime += dur;
    musicNoteIndex++;
    if(musicNoteIndex >= track.notes.length){
      /* จบเพลง — พัก 2 จังหวะแล้วต่อเพลงถัดไปวนเป็น playlist */
      musicNoteIndex = 0;
      musicTrackIdx = (musicTrackIdx+1) % MUSIC_TRACKS.length;
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
