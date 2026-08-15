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

/* ================================================================================
   🎺 เสียงประจำเครื่องดนตรี (เขียนใหม่ทั้งหมด 2026-08-16 รอบ 2)

   ทำไมต้องเขียนใหม่: รอบแรกใช้ "sine + โอเวอร์โทน" เหมือนกันทุกเครื่อง ต่างแค่ตัวเลข
   ⇒ **ทุกชิ้นยังฟังเป็นตระกูลเสียงเปียโนอยู่ดี ต่างกันแค่ทำนอง** เด็กแยกไม่ออก (ผู้ใช้แจ้ง)
   รอบนี้เปลี่ยนไปใช้ **แบบจำลองการเกิดเสียงจริงของเครื่องแต่ละประเภท** ซึ่งคนละวิธีกันคนละตัว:

     🪕 สายดีด (กีตาร์/อูคูเลเล่)  → Karplus-Strong: ยิงเสียงซ่าเข้าท่อหน่วงเวลาแล้ววนกลับ
                                     = แบบจำลองสายสั่นจริง ได้เสียง "ดีดสาย" ที่ไม่มีทางฟังเป็นเปียโน
     🔔 โลหะ (ฉิ่ง/ระฆังลม)        → โอเวอร์โทน **ไม่ลงตัว** (2.76 / 5.40 / 8.93 / 13.3) และแต่ละตัว
                                     **จางคนละอัตรา** (ตัวสูงหายก่อน) = ลักษณะเฉพาะของโลหะที่หูจับได้ทันที
     🥢 ไม้ (กรับ)                 → เสียงซ่าผ่านตัวกรองเรโซแนนซ์ จางใน 0.09 วิ = "ต๊อก" ไม่มีระดับเสียงชัด
     🪘 เขย่า (แทมบูริน)           → เสียงซ่าย่านสูง + ลูกพรวนโลหะหลายตัวไม่ลงตัว
     🎼 ระนาด                      → โอเวอร์โทนแบบแท่งไม้ (1 : 3.0 : 6.0) + เสียงหัวไม้ตีกระทบ
     🪈 ขลุ่ย                      → sine + **เสียงลมจริง** (เสียงซ่ากรองย่าน) + ขึ้นเสียงช้า + สั่นเสียง
     🎹 คีย์บอร์ดไฟฟ้า             → FM (คลื่นหนึ่งไปกวนความถี่อีกคลื่น) = เสียงไฟฟ้าแบบ Rhodes
     🎁 กล่องดนตรี                 → ฟันหวีเหล็กสั้นๆ ใสมาก จางเร็ว
     🎹 เปียโน                     → โอเวอร์โทนเพี้ยนขึ้นเล็กน้อยตามความจริง + เสียงค้อนกระทบ

   ⚠ **ตัวเดียวกันนี้ต้องถูกใช้ทั้งตอนแตะเครื่องที่บ้านและตอนเล่นเกมทาย** — เด็กจำเสียงได้เพราะ
     เคยเล่นเองที่บ้าน ถ้า 2 ที่เสียงคนละแบบ เกมทายจะไม่ยุติธรรม
   ⚠ ไม่โหลดไฟล์เสียงเพิ่มแม้แต่ไฟล์เดียว — สังเคราะห์คลื่นเองใน JS แล้วยัดลง AudioBuffer
     (ทำแบบต่อสาย oscillator ไม่ได้ เพราะ Karplus-Strong ต้องคำนวณทีละ sample)
   ⚠ **หน้าครูไม่ได้ใช้ไฟล์ส่วนนี้เลย** — เพิ่มแบบต่อท้ายล้วน ของเดิมไม่ถูกแตะแม้แต่บรรทัดเดียว
   ================================================================================ */

/* ---------- ตัวช่วยระดับ sample ---------- */
/* ตัวกรองเรโซแนนซ์ (state-variable) — ใช้ปั้นเสียงซ่าให้กลายเป็น "ไม้" หรือ "ลม" */
function svBand(src, sr, fc, q){
  const n = src.length, out = new Float32Array(n);
  const f = 2 * Math.sin(Math.PI * Math.min(fc, sr * .45) / sr);
  const damp = 1 / Math.max(.5, q);
  let low = 0, band = 0;
  for(let i = 0; i < n; i++){
    const high = src[i] - low - damp * band;
    band += f * high;
    low  += f * band;
    out[i] = band;
  }
  return out;
}
function noiseBuf(n){
  const a = new Float32Array(n);
  for(let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1;
  return a;
}
/* ผลรวมโอเวอร์โทน — parts = [[อัตราส่วนความถี่, ความดัง, วินาทีที่จางหมด], …]
   ⚠ **หัวใจของเสียงโลหะคือแต่ละโอเวอร์โทนจางคนละอัตรา** ไม่ใช่แค่ความถี่ไม่ลงตัว
     ถ้าจางพร้อมกันหมดจะฟังเป็นออร์แกน ไม่ใช่ระฆัง */
function addPartials(out, sr, freq, parts, vib){
  const n = out.length;
  for(let p = 0; p < parts.length; p++){
    const r = parts[p][0], amp = parts[p][1], dec = parts[p][2];
    const w  = 2 * Math.PI * freq * r / sr;
    const ph = Math.random() * Math.PI * 2;
    const k  = Math.exp(-1 / Math.max(.01, dec * sr));
    let env = amp, ang = ph;
    for(let i = 0; i < n; i++){
      /* สั่นเสียง (ขลุ่ย) — ขยับความถี่นิดเดียว ±0.4% ไม่งั้นเพี้ยนจนฟังเป็นคนละโน้ต */
      ang += vib ? w * (1 + .004 * Math.sin(2 * Math.PI * vib * i / sr)) : w;
      out[i] += env * Math.sin(ang);
      env *= k;
    }
  }
}
/* ซองเสียงแบบขึ้นช้า-ค้าง-ปล่อย (เครื่องเป่า/คีย์บอร์ดที่ลากเสียงได้) */
function applyAdsr(buf, sr, atk, hold, rel){
  const n = buf.length, a = Math.max(1, atk * sr), h = hold * sr;
  for(let i = 0; i < n; i++){
    let g = 1;
    if(i < a) g = i / a;
    else if(i > a + h){
      const t = (i - a - h) / Math.max(1, rel * sr);
      g = t >= 1 ? 0 : (1 - t) * (1 - t);
    }
    buf[i] *= g;
  }
}
function fadeTail(buf, sr, ms){
  const n = buf.length, f = Math.min(n, Math.round(sr * ms / 1000));
  for(let i = 0; i < f; i++) buf[n - 1 - i] *= i / f;
}
function normalize(buf, peak){
  let m = 0;
  for(let i = 0; i < buf.length; i++){ const v = buf[i] < 0 ? -buf[i] : buf[i]; if(v > m) m = v; }
  if(m < 1e-6) return;
  const g = peak / m;
  for(let i = 0; i < buf.length; i++) buf[i] *= g;
}

/* ---------- แบบจำลองรายเครื่อง ----------
   คืน Float32Array ที่ยังไม่ปรับความดัง (ตัวเรียกเป็นคน normalize) */

/* 🪕 สายดีด — Karplus-Strong
   ยิงเสียงซ่าความยาวเท่ากับ 1 คาบของโน้ตเข้าไปในท่อวน แล้วให้มันวนกลับพร้อมเฉลี่ยกับตัวก่อนหน้า
   (= การสูญเสียพลังงานของสายจริง ความถี่สูงหายก่อนเสมอ) — นี่คือเหตุผลที่ฟังเป็น "สาย" ไม่ใช่ "เปียโน" */
function genPluck(sr, freq, dur, bright, damp){
  const n = Math.floor(sr * dur), out = new Float32Array(n);
  const N = Math.max(2, Math.round(sr / freq));
  const line = new Float32Array(N);
  /* หัวดีด: เสียงซ่าที่กรองความสูงออกบางส่วน — สายไนลอน (อูคูเลเล่) นุ่มกว่าสายเหล็ก */
  let lp = 0;
  for(let i = 0; i < N; i++){ const x = Math.random() * 2 - 1; lp += bright * (x - lp); line[i] = lp; }
  let idx = 0;
  for(let i = 0; i < n; i++){
    out[i] = line[idx];
    line[idx] = damp * .5 * (line[idx] + line[(idx + 1) % N]);
    idx = (idx + 1) % N;
  }
  fadeTail(out, sr, 40);
  return out;
}
/* 🥢 ไม้เคาะ — เสียงซ่าผ่านตัวกรองเรโซแนนซ์แคบๆ ที่ย่านสูง แล้วจางใน ~0.09 วิ
   ⚠ ห้ามใส่โน้ตชัดๆ ลงไป — กรับจริงไม่มีระดับเสียง ใส่แล้วจะกลายเป็นระนาดทันที */
function genWood(sr, freq, dur){
  const n = Math.floor(sr * dur);
  const body = svBand(noiseBuf(n), sr, Math.min(3000, freq * 6), 9);
  const out = new Float32Array(n);
  const k = Math.exp(-1 / (.028 * sr));
  let env = 1;
  for(let i = 0; i < n; i++){ out[i] = body[i] * env; env *= k; }
  addPartials(out, sr, freq * 2, [[1, .18, .05]], 0);   /* เนื้อไม้บางๆ ให้รู้ว่าเคาะอะไรอยู่ */
  fadeTail(out, sr, 20);
  return out;
}
/* 🪘 เขย่า — เสียงซ่าย่านสูง (หนังกลอง) + ลูกพรวนโลหะไม่ลงตัวหลายตัว */
function genShake(sr, freq, dur){
  const n = Math.floor(sr * dur);
  const hiss = svBand(noiseBuf(n), sr, 6200, 1.1);
  const out = new Float32Array(n);
  const k = Math.exp(-1 / (.055 * sr));
  let env = 1;
  for(let i = 0; i < n; i++){ out[i] = hiss[i] * env * 1.1; env *= k; }
  addPartials(out, sr, freq, [[7.3, .16, .30], [9.7, .13, .26], [12.1, .10, .20], [15.4, .07, .15]], 0);
  fadeTail(out, sr, 30);
  return out;
}
/* 🎼 แท่งไม้ตี (ระนาด) — โอเวอร์โทน 1 : 3.0 : 6.0 ตามฟิสิกส์ของแท่งไม้ + เสียงหัวไม้กระทบ */
function genBar(sr, freq, dur){
  const n = Math.floor(sr * dur), out = new Float32Array(n);
  addPartials(out, sr, freq, [[1, 1, .32], [3.0, .40, .12], [6.0, .16, .06]], 0);
  const click = svBand(noiseBuf(Math.round(sr * .006)), sr, 3200, 2.5);
  for(let i = 0; i < click.length; i++) out[i] += click[i] * .5 * (1 - i / click.length);
  fadeTail(out, sr, 25);
  return out;
}
/* 🪈 เครื่องเป่า — sine + **เสียงลมจริง** ที่ค้างอยู่ตลอดโน้ต + ลมพุ่งตอนเริ่ม (chiff)
   ⚠ เสียงลมคือตัวที่ทำให้แยกออกจากเปียโนได้ ไม่ใช่ซองเสียง — ถอดออกแล้วกลับไปเหมือนเดิมทันที */
function genWind(sr, freq, dur){
  const n = Math.floor(sr * dur), out = new Float32Array(n);
  addPartials(out, sr, freq, [[1, 1, 9], [2, .10, 9], [3, .04, 9]], 5.2);
  const air = svBand(noiseBuf(n), sr, freq * 2.2, 1.6);
  for(let i = 0; i < n; i++) out[i] += air[i] * .16;
  const ch = Math.round(sr * .05);
  for(let i = 0; i < ch && i < n; i++) out[i] += air[i] * .5 * (1 - i / ch);
  applyAdsr(out, sr, .085, dur * .5, dur * .4);
  return out;
}
/* 🎹 คีย์บอร์ดไฟฟ้า — FM: เอาคลื่นหนึ่งไปกวนเฟสของอีกคลื่น แล้วลดความแรงลงเรื่อยๆ
   ได้เสียง "ติ๊ง" แบบไฟฟ้า (Rhodes) ที่ไม่มีทางเกิดจากการบวกโอเวอร์โทนธรรมดา */
function genFm(sr, freq, dur){
  const n = Math.floor(sr * dur), out = new Float32Array(n);
  const w = 2 * Math.PI * freq / sr;
  /* ⚠ ความแรงของการกวน (idx) ต้องสูงพอ ไม่งั้นออกมาเป็น sine เฉยๆ = ฟังเหมือนเปียโนอีก
     5.2 คือจุดที่ได้ขอบเสียง "ไฟฟ้า" ชัดโดยยังไม่แสบหู (ลองแล้วต่ำกว่า 4 แยกจากเปียโนไม่ออก) */
  const kI = Math.exp(-1 / (.30 * sr)), kA = Math.exp(-1 / (dur * .42 * sr));
  let idx = 5.2, amp = 1;
  for(let i = 0; i < n; i++){
    out[i] = amp * Math.sin(w * i + idx * Math.sin(2 * w * i));
    idx *= kI; amp *= kA;
  }
  fadeTail(out, sr, 40);
  return out;
}

/* ---------- ตารางเสียง ----------
   `kind` บอกว่าใช้แบบจำลองไหน · เครื่องที่ใช้แบบจำลองเดียวกันต้องตั้งค่าให้ต่างกันพอฟังออก
   ⚠ **ห้ามมี 2 ชิ้นที่ค่าเหมือนกันเป๊ะ** — เกมทายเสียงจะมีตัวเลือกที่แยกไม่ได้ (มีเทสจับ) */
const INSTRUMENT_VOICES = {
  /* เปียโน — โอเวอร์โทนเพี้ยนขึ้นทีละนิดตามความจริงของสายเปียโน + เสียงค้อนกระทบ */
  piano: {kind:'metal', dur:1.7, vol:.20, hit:{f:1400, q:1.2, a:.12, ms:8},
          parts:[[1,1,1.3],[2.001,.42,.95],[3.005,.22,.7],[4.012,.11,.5],[5.02,.05,.32]]},
  /* ฉิ่ง — โลหะใบเล็กมาก **เสียงสูงกว่าโน้ตที่กดหลายเท่า** (oct 4) โอเวอร์โทนไม่ลงตัว */
  bell:  {kind:'metal', oct:4, dur:1.6, vol:.13, hit:{f:6400, q:1.6, a:.40, ms:5},
          parts:[[1,1,1.0],[2.76,.62,.75],[5.40,.40,.5],[8.93,.24,.3]]},
  /* ระฆังลม — ท่อโลหะยาว เสียงสูง กังวานนานกว่าฉิ่งเท่าตัว */
  chime: {kind:'metal', oct:2, dur:3.2, vol:.12, hit:{f:7200, q:2, a:.22, ms:4},
          parts:[[1,1,3.0],[2.76,.48,2.3],[5.40,.28,1.5],[8.93,.14,.85],[13.34,.07,.45]]},
  /* กล่องดนตรี — ฟันหวีเหล็กสั้น **เสียงสูงใสมาก** จางเร็ว โอเวอร์โทนเกือบลงตัว */
  box:   {kind:'metal', oct:2, dur:1.1, vol:.15, hit:{f:5200, q:2.4, a:.30, ms:4},
          parts:[[1,1,.8],[2.0,.34,.5],[3.92,.19,.3],[6.21,.09,.18]]},
  /* ระนาด — แท่งไม้ตี เสียงสูงกว่าเปียโน 1 ช่วงเสียงตามจริง */
  xylo:  {kind:'bar',   oct:2, dur:.55, vol:.20},
  wood:  {kind:'wood',  dur:.16, vol:.24},
  shake: {kind:'shake', dur:.55, vol:.17},
  /* ขลุ่ย — ช่วงเสียงจริงอยู่สูงกว่าเปียโน 1 ช่วงเสียง */
  flute: {kind:'wind',  oct:2, dur:1.1, vol:.18},
  /* กีตาร์ — สายเหล็กตัวใหญ่: หัวดีด**ทึบ** (bright ต่ำ) กังวานยาว */
  pluck: {kind:'pluck', dur:1.7, vol:.19, bright:.30, damp:.9965},
  /* อูคูเลเล่ — ตัวเล็กเสียงสูง: หัวดีด**สว่างกว่า** และหยุดเร็วกว่ามาก */
  uke:   {kind:'pluck', oct:2, dur:.8, vol:.17, bright:.62, damp:.9885},
  keys:  {kind:'fm',    dur:1.5, vol:.16},
};

/* ---------- ตัวเล่นจริง ----------
   สร้างคลื่นเองแล้วยัดลง AudioBuffer — เก็บไว้ใช้ซ้ำ (voice+ความถี่) เพราะเด็กกดคีย์เดิมซ้ำบ่อย
   ⚠ เพดานแคชต้องมี ไม่งั้นเล่นเปียโนไปเรื่อยๆ แล้วกินหน่วยความจำสะสม (บัฟเฟอร์ละ ~130-560 KB) */
const INSTRUMENT_CACHE = {};
let instrumentCacheKeys = [];
const INSTRUMENT_CACHE_MAX = 16;
function instrumentBuffer(voice, freq){
  const v = INSTRUMENT_VOICES[voice] || INSTRUMENT_VOICES.piano;
  const key = voice + '|' + Math.round(freq);
  if(INSTRUMENT_CACHE[key]) return INSTRUMENT_CACHE[key];
  const sr = audioCtx.sampleRate;
  /* ⚠ เครื่องดนตรีจริงไม่ได้อยู่ช่วงเสียงเดียวกันทั้งหมด — ฉิ่ง/ระนาด/ขลุ่ย/อูคูเลเล่/กล่องดนตรี
     เสียงสูงกว่าเปียโนอยู่แล้วโดยธรรมชาติ ถ้าบังคับให้ทุกชิ้นอยู่โน้ตเดียวกันเป๊ะ
     จะฟังเป็น "เครื่องเดียวกันเปลี่ยนสี" ไม่ใช่คนละเครื่อง */
  freq = freq * (v.oct || 1);
  let data;
  if(v.kind === 'pluck')      data = genPluck(sr, freq, v.dur, v.bright, v.damp);
  else if(v.kind === 'wood')  data = genWood(sr, freq, v.dur);
  else if(v.kind === 'shake') data = genShake(sr, freq, v.dur);
  else if(v.kind === 'bar')   data = genBar(sr, freq, v.dur);
  else if(v.kind === 'wind')  data = genWind(sr, freq, v.dur);
  else if(v.kind === 'fm')    data = genFm(sr, freq, v.dur);
  else{
    data = new Float32Array(Math.floor(sr * v.dur));
    addPartials(data, sr, freq, v.parts, 0);
    if(v.hit){
      /* เสียงกระทบตอนเริ่ม (ค้อน/ไม้ตี) — สั้นมากแต่เป็นตัวบอกว่า "ตีอะไรอยู่" */
      const hn = Math.round(sr * v.hit.ms / 1000);
      const h = svBand(noiseBuf(hn), sr, v.hit.f, v.hit.q);
      for(let i = 0; i < hn && i < data.length; i++) data[i] += h[i] * v.hit.a * (1 - i / hn);
    }
    fadeTail(data, sr, 40);
  }
  normalize(data, 1);
  const buf = audioCtx.createBuffer(1, data.length, sr);
  buf.getChannelData(0).set(data);
  INSTRUMENT_CACHE[key] = buf;
  instrumentCacheKeys.push(key);
  while(instrumentCacheKeys.length > INSTRUMENT_CACHE_MAX)
    delete INSTRUMENT_CACHE[instrumentCacheKeys.shift()];
  return buf;
}
/* เล่น 1 โน้ตด้วยเสียงของเครื่องนั้น — `dur` เป็นแค่คำใบ้ (ความยาวจริงมาจากตัวเครื่อง
   เพราะกรับสั้น 0.16 วิ ส่วนระฆังลมยาว 3.2 วิ ตามธรรมชาติของมันเอง) */
function playInstrumentNote(freq, dur, voice){
  const v = INSTRUMENT_VOICES[voice] ? voice : 'piano';
  ensureAudio();
  if(!audioCtx) return;
  if(audioCtx.state === 'suspended') audioCtx.resume();
  let buf;
  try{ buf = instrumentBuffer(v, freq); }catch(e){ return; }
  const src = audioCtx.createBufferSource();
  const g = audioCtx.createGain();
  src.buffer = buf;
  g.gain.value = INSTRUMENT_VOICES[v].vol;
  src.connect(g).connect(audioCtx.destination);
  src.start(audioCtx.currentTime);
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
