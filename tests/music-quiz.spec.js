/* ============================================================
   🎹 เพลงพื้นหลังของหน้าทำโจทย์ (เขียนใหม่ทั้งชุด 2026-08-20 · js/music-quiz.js)

   สิ่งที่ชุดนี้คุม:
     ① 6 เพลง · เพลงละ ~85-105 วิ · เล่นวนต่อกัน
     ② **เป็นเพลงหลายชั้นทุกเพลง** ⇒ วิ่งผ่าน musicSchedulerLayered() ซึ่งใช้
        MUSIC_LAYER_MIX ตัวเดียวกับโหมดบ้าน = **ความดังเท่าโหมดบ้าน** (สิ่งที่ผู้ใช้สั่ง)
     ③ ลูปเบส/คอร์ดต้องหารความยาวทำนองลงตัว ไม่งั้นวนรอบสองแล้วคอร์ดเลื่อนไม่ตรงทำนอง
     ④ อยู่ในคีย์ C major / F major / A minor เท่านั้น (playCorrect = C-E-G ดังทับตลอด)
     ⑤ เปียโนทุกชั้น · **หน้าครูต้องไม่กระทบ** (มี MUSIC_TRACKS ชุดของตัวเอง)
   ============================================================ */
const { test, expect } = require('@playwright/test');

async function app(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(()=>{
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id:'mq1', name:'เพลง', emoji:'🎹', birthDate:'2018-06-01', grade:'p1' }]));
    localStorage.setItem('p1quiz_music', 'on');
  });
  await page.goto('/');
  await page.waitForFunction(()=> !!window.QUIZ_MUSIC, null, { timeout:20000 });
  return errs;
}

test('MQ1: 6 เพลง · ยาวเพลงละ 85-105 วิ · ลูปเบส/คอร์ดตรงกับทำนอง', async ({ page }) => {
  const errs = await app(page);
  const r = await page.evaluate(()=>{
    const Q = window.QUIZ_MUSIC;
    return {
      n: Q.TRACKS.length,
      names: Q.names(),
      secs: Q.seconds(),
      beats: Q.beats(),
      sameAsPlaylist: window.MUSIC_TRACKS === Q.TRACKS ||
                      JSON.stringify(MUSIC_TRACKS.map(t=>t.name)) === JSON.stringify(Q.names()),
    };
  });
  expect(r.n, 'ต้องมี 6 เพลง').toBe(6);
  expect(new Set(r.names).size, 'ชื่อเพลงห้ามซ้ำ').toBe(6);
  r.secs.forEach((s, i) => {
    expect(s, r.names[i] + ' สั้นเกินไป').toBeGreaterThan(85);
    expect(s, r.names[i] + ' ยาวเกินไป').toBeLessThan(105);
  });
  r.beats.forEach((b, i) => {
    expect(b.lead % b.bass, r.names[i] + ': ลูปเบสไม่ลงตัวกับทำนอง').toBe(0);
    expect(b.lead % b.chord, r.names[i] + ': ลูปคอร์ดไม่ลงตัวกับทำนอง').toBe(0);
  });
  expect(r.sameAsPlaylist, 'หน้าทำโจทย์ต้องใช้เพลงชุดนี้จริง').toBe(true);
  expect(errs).toEqual([]);
});

test('MQ2: ทุกเพลงเป็นแบบหลายชั้น (⇒ ความดังใช้ตารางเดียวกับโหมดบ้าน) และเป็นเปียโนทุกชั้น', async ({ page }) => {
  await app(page);
  const bad = await page.evaluate(()=>{
    const out = [];
    window.QUIZ_MUSIC.TRACKS.forEach(t=>{
      if(!t.layers || !t.layers.lead || !t.layers.bass || !t.layers.chord)
        out.push(t.name + ': ชั้นไม่ครบ');
      const v = t.voices || {};
      if(v.lead !== 'piano' || v.bass !== 'piano' || v.chord !== 'pianoCh')
        out.push(t.name + ': เสียงไม่ใช่เปียโน');
      if(t.bpm < 100 || t.bpm > 126) out.push(t.name + ': bpm ' + t.bpm + ' นอกช่วง 100-126');
      if(t.notes) out.push(t.name + ': ยังมีชั้นเดียวแบบเก่าค้างอยู่');
    });
    return out;
  });
  expect(bad, 'เพลงชั้นเดียวจะใช้ MUSIC_MAIN_GAIN ซึ่งดังกว่าโหมดบ้าน').toEqual([]);
});

test('MQ3: ทุกโน้ตอยู่ในคีย์ C major / F major / A minor', async ({ page }) => {
  await app(page);
  const bad = await page.evaluate(()=>{
    /* ความถี่ที่อนุญาต = โน้ตขาวทั้งหมด + Bb (สำหรับ F major) */
    const WHITE = [130.81,146.83,164.81,174.61,196.00,220.00,246.94,
                   261.63,293.66,329.63,349.23,392.00,440.00,493.88,
                   523.25,587.33,659.25,698.46,783.99,880.00,987.77,1046.50];
    const BFLAT = [233.08, 466.16, 932.33];
    const ok = f => f == null || WHITE.some(w=>Math.abs(w-f)<.01) || BFLAT.some(w=>Math.abs(w-f)<.01);
    const out = [];
    window.QUIZ_MUSIC.TRACKS.forEach(t=>{
      ['lead','bass','chord'].forEach(k=>{
        (t.layers[k]||[]).forEach(st=>{
          const fs = Array.isArray(st[0]) ? st[0] : [st[0]];
          fs.forEach(f=>{ if(!ok(f)) out.push(t.name + '/' + k + ': ' + f); });
        });
      });
      /* ทำนองต้องอยู่ช่วง C4-C6 */
      (t.layers.lead||[]).forEach(st=>{
        const f = st[0];
        if(f != null && (f < 261 || f > 1047)) out.push(t.name + '/lead นอกช่วง C4-C6: ' + f);
      });
    });
    return out;
  });
  expect(bad).toEqual([]);
});

test('MQ4: เปิดเพลงจริงแล้วเดินหน้าได้ ไม่มี error · หน้าครูยังใช้เพลงชุดของตัวเอง', async ({ page }) => {
  const errs = await app(page);
  const r = await page.evaluate(async ()=>{
    /* AudioContext ต้องถูกปลุกด้วยการกดก่อน — เรียกผ่านทางเดินโค้ดจริง */
    document.body.click();
    if(typeof ensureAudio === 'function') ensureAudio();
    if(typeof startMusic === 'function') startMusic();
    await new Promise(r=>setTimeout(r, 900));
    return { on: typeof musicOn !== 'undefined' ? musicOn : null,
             idx: typeof musicTrackIdx !== 'undefined' ? musicTrackIdx : null,
             layered: !!(musicList()[0] && musicList()[0].layers) };
  });
  expect(r.layered, 'ตัวจัดตารางต้องเป็นเส้นหลายชั้น').toBe(true);
  expect(errs).toEqual([]);

  /* หน้าครูมี MUSIC_TRACKS ของตัวเอง ต้องไม่ถูกแตะ */
  const t = await page.request.get('/teacher/teacher.js');
  expect((await t.text()).includes('const MUSIC_TRACKS = ['),
    'หน้าครูต้องยังมีเพลงชุดของตัวเอง').toBe(true);
});
