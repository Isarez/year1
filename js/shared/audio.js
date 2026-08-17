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
/* โน้ตที่ถูกนัดหมายไว้ล่วงหน้า (มากสุด ~1 วินาที) — ต้องเก็บไว้เพื่อ **สั่งหยุดได้จริง**
   ⚠ `stopMusic()` แบบเดิมหรี่แค่ระดับเสียงรวม แต่โน้ตที่นัดไว้แล้วยังดังต่อ ⇒ พอเปิดเพลงใหม่
     ระดับเสียงถูกดันกลับขึ้นมา **เพลงเก่ากับเพลงใหม่จึงดังทับกัน** (ผู้ใช้แจ้ง 2026-08-16) */
let musicNodes = [];
function killMusicNodes(){
  const now = audioCtx ? audioCtx.currentTime : 0;
  musicNodes.forEach(n=>{ try{ n.stop(now); }catch(e){} });
  musicNodes = [];
}
function scheduleMusicNote(freq, startTime, dur, opt){
  if(freq==null) return;
  opt = opt || {};
  const gMul = (opt.gain == null) ? 1 : opt.gain;
  const withSub = (opt.sub == null) ? true : !!opt.sub;
  const atk = opt.atk || 0.06;
  const tail = 0.12;
  /* 🎹 **โอเวอร์โทนของเครื่องดนตรี** (ทำจริงเมื่อ 2026-08-17)
     🐞 บั๊กที่ซ่อนอยู่นานมาก: ตาราง `MUSIC_VOICES` มี `parts` (โอเวอร์โทน) / `rel` / `tilt` มาตั้งแต่
        เฟส 14 และ **เทสวัดความดังก็คิดสูตรจาก `parts` มาตลอด** — แต่ตัวสังเคราะห์เสียงตรงนี้
        สร้าง sine ลูกเดียวที่ความถี่พื้นแล้วจบ ไม่เคยอ่าน `parts` เลย
        ⇒ ทุกเสียง (ระนาด/ระฆัง/ขลุ่ย/กีตาร์) ออกมาเป็น **sine เปล่าเหมือนกันหมด** ต่างแค่เวลาขึ้นเสียง
        นี่คือเหตุผลที่เพลงฟังจืดและ "ไม่เหมือนเครื่องดนตรีอะไรเลย" มาตลอด
     ⇒ ตอนนี้ไล่สร้างทุกโอเวอร์โทนจริงตาม `parts` = [[อัตราส่วนความถี่, ความดัง], …]
     ⚠ **ความดังต่อโอเวอร์โทน = p[1] × gain** ตรงตามสูตรที่เทสใช้คิดพีค (`house-phase14`)
       ของเดิมใช้ 0.9 คงที่ ซึ่งบังเอิญเท่ากับความดังพื้นของระนาดพอดี ⇒ ค่าเดิมไม่เพี้ยน
     ⚠ ไม่ส่ง `parts` มา (เพลงหน้าหลัก) = **พฤติกรรมเดิมเป๊ะ** ห้ามเปลี่ยน */
  const parts = (opt.parts && opt.parts.length) ? opt.parts : [[1, 0.9]];
  /* หรี่โน้ตสูงกันแสบหู — สูตรเดียวกับที่เทสคาดไว้ (อ้างอิง G4 = 392 Hz) */
  const tilt = opt.tilt ? Math.max(.35, 1 - opt.tilt * Math.max(0, Math.log2(freq / 392))) : 1;
  /* หางเสียง: เครื่องที่ปล่อยยาว (เปียโน/ขลุ่ย) ต้องค้างนานกว่าเครื่องตีสั้น */
  const rel = opt.rel || 0.32;
  for(let i = 0; i < parts.length; i++){
    const ratio = parts[i][0], amp = parts[i][1];
    const f = freq * ratio;
    if(f > 12000) continue;                     /* พ้นย่านที่ได้ยิน — ไม่ต้องเปลืองออสซิลเลเตอร์ */
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, startTime);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp*gMul*tilt), startTime+atk);
    /* โอเวอร์โทนสูงจางเร็วกว่าเสียงพื้นเสมอ — นี่คือสิ่งที่ทำให้หูแยกออกว่าเป็นเครื่องอะไร */
    const dec = rel / (1 + i*0.6);
    noteGain.gain.setTargetAtTime(0.0001, startTime+dur*0.6, dur*0.35*dec/0.32 + tail);
    osc.connect(noteGain).connect(musicGain);
    osc.start(startTime); osc.stop(startTime+dur+tail);
    musicNodes.push(osc);
  }
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
  musicNodes.push(subOsc);
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
    /* กำลังเล่นอยู่ → **ปิดของเก่าให้เงียบสนิทก่อน** แล้วค่อยเริ่มชุดใหม่ */
    stopMusic(true);
    startMusic();
  }
}
/* เล่นเพลงเดียวแบบเจาะจง (หน้าทดสอบเพลงในเมนูตั้งค่า) — คืนค่าเป็นตัวมันเองเพื่อ chain ได้ */
/* เล่นเพลงเดียวแบบเจาะจง (หน้าทดสอบเพลง)
   ⚠ **ต้องปิดเพลงพื้นหลังให้เงียบสนิทก่อนเสมอ** แล้วค่อยเปิดเพลงที่เลือก (ผู้ใช้สั่ง 2026-08-16)
     ไม่งั้นโน้ตของเพลงเดิมที่นัดไว้ล่วงหน้าจะดังทับเพลงใหม่ ~1 วินาที */
function playMusicTrack(list, idx){
  stopMusic(true);                       /* ① ปิดของเก่าให้เงียบจริงก่อน */
  musicPlaylist = (list && list.length) ? list : null;   /* ② ตั้งชุดตรงๆ ไม่ผ่านตัวที่รีสตาร์ตเอง */
  musicTrackIdx = (idx | 0) % Math.max(1, musicList().length);
  musicNoteIndex = 0; musicLayerT = null;
  if(musicOn) startMusic();              /* ③ ค่อยเปิดเพลงที่เลือก */
}
/* ---- เพลงหลายชั้น: ทำนองเป็นตัวตัดสินว่าเพลงจบ · เบส/คอร์ดวนซ้ำอยู่ภายในเพลง ---- */
/* ============================================================
   🎻 เสียงประจำชั้น (เขียนใหม่ 2026-08-16 รอบ 3)

   ผู้ใช้แจ้ง: **"เพลงมีเครื่องดนตรีเสียงเดียว เสียงคีย์บอร์ดแบบนี้แสบหูเกินไป"**
   🔑 ต้นเหตุ 2 อย่าง:
     ① ทุกชั้นเป็น sine เปล่าเหมือนกันหมด ⇒ ฟังเป็น **เครื่องเดียวเล่น 3 เสียงพร้อมกัน** ไม่ใช่วง
     ② sine ล้วนย่าน 800-1000 Hz **แสบหูที่สุด** และทำนอง 23% อยู่เหนือ A5

   ⇒ รอบนี้ให้แต่ละชั้นมี **โอเวอร์โทนเป็นของตัวเอง = คนละเครื่องดนตรี** + หรี่โน้ตสูงอัตโนมัติ
   ⚠ ยังเป็น **sine ล้วนทุกตัว ไม่มี sawtooth/square ไม่มีกลอง** ตามกติกาเดิม
     (ความเป็น "เครื่องดนตรี" มาจากส่วนผสมโอเวอร์โทน + ซองเสียง ไม่ใช่จากรูปคลื่นแข็งๆ)
   ============================================================ */
const MUSIC_VOICES = {
  /* 🎵 ระนาด/มาริมบา — ไม้ตี โอเวอร์โทนที่ 4 เด่น เสียงอุ่น จางเร็ว (ทำนองหลัก) */
  marimba: {parts:[[1,.9],[4,.16],[9.2,.04]], atk:.012, rel:.32, sub:true},
  /* 🔔 ระฆังราว (กลอกเกนสปีล) — โลหะตีเบาๆ ใส จางปานกลาง */
  glock:   {parts:[[1,.85],[2.7,.22],[5.4,.07]], atk:.005, rel:.28, sub:true},
  /* 🪈 ขลุ่ย — ขึ้นเสียงช้า ค้างยาว ไม่มีเสียงต่ำ (ทำนองของเพลงที่ต้องการความนุ่ม) */
  flute:   {parts:[[1,.85],[2,.14],[3,.05]], atk:.06, rel:.74, sub:false},
  /* 🎸 กีตาร์โปร่ง ดีดทีละสาย — ใช้เป็นเบส ชัดโดยไม่ขุ่น */
  guitar:  {parts:[[1,.9],[2,.28],[3,.10],[4,.04]], atk:.008, rel:.26, sub:false},
  /* 🪕 กีตาร์ตีคอร์ด — ใช้แทนแผ่นเสียงคลอ (pad) ที่ฟังเป็นออร์แกน/คีย์บอร์ด
     ⚠ **ห้ามกลับไปใช้เสียงลากค้าง** — ผู้ใช้สั่ง 2026-08-16 ว่าไม่เอาเสียงคีย์บอร์ดเลย
       เสียงคอร์ดที่ "ลากค้างสม่ำเสมอ" คือสิ่งที่หูตีความว่าเป็นออร์แกนทันที
     `spread` = ดีดไล่สายทีละเส้น ไม่ใช่กดพร้อมกัน — นี่คือตัวที่ทำให้ฟังเป็นกีตาร์จริง */
  strum:   {parts:[[1,.75],[2,.24],[3,.09]], atk:.010, rel:.34, sub:false, spread:.022},
  /* ✨ กระดิ่งเล็ก — ประกายบางๆ โรยเป็นจุดๆ (ชั้นที่ 4 · เบามาก) */
  bells:   {parts:[[2,.5],[4,.16],[5.4,.05]], atk:.004, rel:.22, sub:false},
  /* 🎹 **เปียโน** (ผู้ใช้สั่ง 2026-08-17: ให้เพลงพื้นหลังของโลกเกมสร้างจากเปียโน)
     ⚠ อัตราส่วนโอเวอร์โทน **จงใจไม่ลงตัวเป๊ะ** (2.001 / 3.005 / 4.012 / 5.02)
       ลอกมาจากเสียงเปียโนจริงของเกม (`INSTRUMENT_VOICES.piano` ใน js/shared/piano.js)
       สายเปียโนจริงมีความแข็ง (inharmonicity) ทำให้โอเวอร์โทนเพี้ยนสูงขึ้นทีละนิด
       **ถ้าปัดเป็น 2/3/4/5 ลงตัว จะฟังเป็นออร์แกนทันที** ซึ่งผู้ใช้สั่งห้ามไว้ตั้งแต่เฟส 14
     ⚠ ขึ้นเสียงเร็วมาก (.004 = ค้อนกระทบสาย) แต่ปล่อยยาว (.62) — นี่คือลายเซ็นของเปียโน
     ⚠ ผลรวมความดัง = 1.16 (+sub .35) คุมไว้ให้ใกล้ของเดิม ไม่ให้เพลงดังขึ้น (มีเทสวัดพีค) */
  piano:   {parts:[[1,.82],[2.001,.22],[3.005,.08],[4.012,.03],[5.02,.01]],
            atk:.004, rel:.62, sub:true},
  /* 🎹 เปียโนสำหรับชั้นคอร์ด — ตัวเดียวกันแต่เบากว่า ไม่ใส่เสียงต่ำ (ไม่งั้นคอร์ดขุ่นกวนเบส)
     `spread` น้อยๆ = กดคอร์ดแล้วนิ้วลงไม่พร้อมกันเป๊ะแบบคนจริง (ไม่ใช่การดีดไล่สายแบบกีตาร์) */
  pianoCh: {parts:[[1,.7],[2.001,.18],[3.005,.06]], atk:.006, rel:.5, sub:false, spread:.008},
};
/* ⚠ **เพลงพื้นหลังต้องเบากว่าเสียงกดปุ่มเสมอ** (ผู้ใช้สั่ง 2026-08-16)
   `playClick` พีค 0.12 · `playCorrect` พีค 0.14 · เพลง = master 0.025 × ผลรวมทุกชั้นที่ดังพร้อมกัน
   🔒 ห้ามปรับขึ้นโดยไม่ถามผู้ใช้ · มีเทสวัดผลรวมไว้ที่ tests/house-phase14.spec.js */
const MUSIC_LAYER_MIX = {
  lead:  {gain:.55, voice:'marimba', tilt:.28},   /* tilt = หรี่โน้ตสูง กันแสบหู */
  bass:  {gain:.24, voice:'guitar',  tilt:0},
  chord: {gain:.12, voice:'strum',   tilt:.18},
  spark: {gain:.07, voice:'bells',   tilt:.35},
};
/* รวมค่าของชั้น + เสียงประจำชั้น (เพลงระบุ `voices:{lead:'musicbox'}` ทับได้รายเพลง) */
function musicLayerOpt(layer, track){
  const mix = MUSIC_LAYER_MIX[layer] || MUSIC_LAYER_MIX.lead;
  const vName = (track && track.voices && track.voices[layer]) || mix.voice;
  const v = MUSIC_VOICES[vName] || MUSIC_VOICES.marimba;
  return {gain:mix.gain, tilt:mix.tilt, parts:v.parts, atk:v.atk, rel:v.rel, sub:v.sub,
          spread:v.spread || 0};
}
function musicSchedulerLayered(track){
  const beat = 60 / track.bpm;
  const horizon = audioCtx.currentTime + 1.0;
  if(!musicLayerT) musicLayerT = {lead:musicNextTime, bass:musicNextTime, chord:musicNextTime,
                                  spark:musicNextTime, i:{bass:0, chord:0, spark:0}};
  /* ชั้นเบส/คอร์ด — วนซ้ำไปเรื่อยๆ จนกว่าทำนองจะจบเพลง */
  ['bass', 'chord', 'spark'].forEach(k=>{
    const seq = track.layers[k];
    if(!seq || !seq.length) return;
    const mix = musicLayerOpt(k, track);
    while(musicLayerT[k] < horizon){
      const step = seq[musicLayerT.i[k] % seq.length];
      const dur = step[1] * beat;
      const notes = Array.isArray(step[0]) ? step[0] : [step[0]];
      /* 🪕 `spread` = ดีดไล่สายทีละเส้น (เสียงต่ำก่อน) — ทำให้คอร์ดฟังเป็น "กีตาร์ตีคอร์ด"
         แทนที่จะเป็น "กดคีย์บอร์ดพร้อมกัน" ซึ่งผู้ใช้ไม่เอา (2026-08-16) */
      notes.forEach((f, ni) => scheduleMusicNote(f, musicLayerT[k] + ni * (mix.spread || 0), dur, mix));
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
    scheduleMusicNote(step[0], musicLayerT.lead, dur, musicLayerOpt('lead', track));
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
  musicNodes = [];
  if(musicSchedulerId) clearInterval(musicSchedulerId);
  musicScheduler();
  musicSchedulerId = setInterval(musicScheduler, 250);
}

/* hard = ตัดโน้ตที่นัดไว้ทิ้งทันที (ใช้ตอนจะเปิดเพลงอื่นต่อ ไม่งั้น 2 เพลงดังทับกัน)
   เว้นไว้ = พฤติกรรมเดิมเป๊ะ (หรี่เสียงลงนุ่มๆ) — **หน้าครูเรียกแบบเดิม ไม่กระทบ** */
function stopMusic(hard){
  if(musicGain && audioCtx){
    const now = audioCtx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.linearRampToValueAtTime(0.0001, now + (hard ? 0.06 : 0.4));
  }
  if(musicSchedulerId){ clearInterval(musicSchedulerId); musicSchedulerId=null; }
  if(hard) killMusicNodes();
}

function refreshMusicBtn(){ musicBtn.innerHTML = '<span class="icon-inner"><span class="icon-glyph">'+SVG_MUSIC+'</span><span class="mute-stripe"></span></span>'; musicBtn.classList.toggle('muted', !musicOn); musicBtn.dataset.tooltip = musicOn ? 'ปิดเพลงพื้นหลัง' : 'เปิดเพลงพื้นหลัง'; }
