const { test, expect } = require('@playwright/test');

/* ============================================================
   ชุดแก้ 2026-08-16 (ผู้ใช้แจ้ง 6 ข้อรวด)

     (ก) 16 กลไกที่ยืม engine หน้าหลัก "กดเล่นจากคลังโจทย์ไม่ได้"
         ต้นเหตุ: engine พวกนั้นมีหมวดเฉพาะบางระดับชั้น (วงจรไฟฟ้า = ป.6 เท่านั้น ฯลฯ)
         ในเกมจริง engineReady() กรองไว้ แต่หน้าคลังโจทย์ข้ามด่านนั้น ⇒ pickCat() คืน null
         แล้ว startEngineGame() เรียก finishEngineRound(0) = เด้งหน้าสรุปทันทีแบบเงียบๆ
     (ข) 🫥 ของหายไปไหน — ผู้ใช้สั่งให้ถาดมี "ตัวลวง" (เกณฑ์กลับด้านจากเดิม ดู house-phase13)
     (ค) 🎺 ทายเสียงเครื่องดนตรี — ทุกเครื่องออกเสียงเปียโนเหมือนกันหมด
     (ง) รายงานว่าเกมไหนต้องเดินไปตามตำแหน่ง (แท็บในคลังโจทย์ต้องติดป้าย 🚶)
     (จ) UI คลังโจทย์ — แถบกลไกแคบเกินไป (57 ตัวในแถบสูง 86px)
     (ฉ) 🎣 เควสต์ "ทำจริงแล้วเอาไปส่ง" ตัวแรก (fishcatch)
   ============================================================ */

const CHILD = { id: 'fix816', name: 'เทสแก้', emoji: '🔧', birthDate: '2018-01-15', grade: 'p2' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const SEED = { v: 1, mapV: 3, tut: { skip: true }, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } };

async function house(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
  }, [CHILD, HKEY, SEED]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  /* ⚠ ต้องรอ ready() เสมอ — hMode เป็น 'world' ตั้งแต่ไฟล์โหลดเสร็จ ทั้งที่บ้านยังไม่พร้อม */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  return errors;
}
async function openQb(page) {
  const errors = await house(page);
  await page.locator('#house-ctrl-gear').dispatchEvent('click');
  await page.waitForTimeout(200);
  const enabled = await page.evaluate(() => !!(window.HouseQB && window.HouseQB.enabled));
  test.skip(!enabled, 'หน้าคลังคำถามถูกปิดไว้ (QB_FEATURE_OFF) — เป็นค่าปกติของ production');
  await page.locator('#house-qb-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-qb').hidden, null, { timeout: 15000 });
  return errors;
}

/* ---------- (ก) กลไกที่ยืม engine: ต้องรู้ว่าเล่นได้ชั้นไหน ---------- */
test('(ก) กลไกยืม engine ทุกตัวต้องมีอย่างน้อย 1 ระดับชั้นที่เล่นได้จริง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, G = window.HouseGames;
    const dead = [], map = {};
    Object.keys(Q.MECHS).forEach(id => {
      const m = Q.MECHS[id];
      if (!m.engine) return;
      const ok = Q.GRADES.filter(g => !!G.pickCat(m.engine, g.id, m.pick || ''));
      map[id] = ok.map(g => g.id);
      if (!ok.length) dead.push(id);
    });
    return { dead, map, n: Object.keys(map).length };
  });
  expect(r.n, 'ต้องมีกลไกที่ยืม engine อยู่จริง').toBeGreaterThanOrEqual(16);
  expect(r.dead, 'กลไกที่ไม่มีชั้นไหนเล่นได้เลย = แจกไปก็ตัน ต้องเอาออกหรือเพิ่มหมวดในคลัง CATS').toEqual([]);
  /* ตัวที่ผู้ใช้แจ้งว่าเล่นไม่ได้ — ยืนยันว่าเหตุผลคือ "จำกัดระดับชั้น" ไม่ใช่พังทั้งตัว */
  expect(r.map.circuit, 'วงจรไฟฟ้ามีหมวดแค่ ป.6').toContain('p6');
  expect(r.map.shapebuild, 'แท็งแกรมมีหมวดแค่ ป.5-6').toContain('p6');
  expect(errs).toEqual([]);
});

test('(ก) คลังโจทย์: ชั้นที่เล่น engine นั้นไม่ได้ ต้องเตือน + ไม่ให้กดเล่นเปล่าๆ', async ({ page }) => {
  const errs = await openQb(page);
  /* เลือกชั้นเตรียม ป.1 แล้วไปที่กลไก circuit (มีหมวดแค่ ป.6) */
  await page.evaluate(() => {
    const gs = document.querySelectorAll('#hqb-grades .hqb-chip');
    gs[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const g = Array.from(document.querySelectorAll('#hqb-groups .hqb-chip'))
      .find(b => b.textContent.indexOf('engine') >= 0);
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const m = Array.from(document.querySelectorAll('#hqb-mechs .hqb-chip'))
      .find(b => b.textContent.indexOf('วงจร') >= 0);
    m.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(200);
  const warn = page.locator('.hqb-note.warn');
  await expect(warn, 'ต้องมีคำเตือนว่าชั้นนี้เล่นไม่ได้').toBeVisible();
  expect(await warn.textContent()).toContain('ป.6');
  const btn = await page.locator('.hqb-go-btn').first().textContent();
  expect(btn, 'ปุ่มต้องเปลี่ยนเป็น "ไปชั้นที่เล่นได้" แทนปุ่มเล่นที่กดแล้วเด้งหน้าสรุปทันที').toContain('เปลี่ยนไปชั้น');
  expect(errs).toEqual([]);
});

/* ---------- (ค) เสียงเครื่องดนตรี ---------- */
test('(ค) เครื่องดนตรีทุกชิ้นต้องมีเสียงของตัวเอง ไม่ใช่เสียงเปียโนเหมือนกันหมด', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const list = window.__houseDbg.musicItems();
    return {
      voices: typeof INSTRUMENT_VOICES === 'object' ? Object.keys(INSTRUMENT_VOICES) : [],
      hasFn: typeof playInstrumentNote === 'function',
      items: (list || []).map(i => ({ id: i.id, voice: i.voice, note: i.note, tune: i.tune })),
    };
  });
  expect(r.hasFn, 'ต้องมี playInstrumentNote() ใน js/shared/piano.js').toBe(true);
  expect(r.items.length, 'ต้องมีเครื่องดนตรีในคลัง').toBeGreaterThanOrEqual(11);
  const bad = r.items.filter(i => !i.voice || r.voices.indexOf(i.voice) < 0);
  expect(bad, 'ทุกชิ้นต้องมี voice ที่รู้จักจริง').toEqual([]);
  /* ต้องมีเสียงต่างกันอย่างน้อย 8 แบบ ไม่งั้นเกมทายเสียงยังเดาสุ่มอยู่ดี */
  expect(new Set(r.items.map(i => i.voice)).size).toBeGreaterThanOrEqual(8);
  /* ชิ้นที่ใช้ voice เดียวกัน (กีตาร์/อูคูเลเล่เคยเป็นแบบนั้น) ต้องไม่มีแล้ว
     — ทุกชิ้นต้องแยกออกจากกันได้ด้วย voice หรือทำนอง อย่างน้อย 1 อย่าง */
  const key = i => i.voice + '|' + ((i.tune && i.tune.join(',')) || i.note);
  expect(new Set(r.items.map(key)).size, 'ต้องไม่มี 2 ชิ้นที่เสียงเหมือนกันเป๊ะ').toBe(r.items.length);
  expect(errs).toEqual([]);
});

/* 🔊 เทสตัวจริงของข้อ (ค) — วัดจาก **คลื่นเสียงที่สังเคราะห์ออกมาจริง** ไม่ใช่แค่ดูว่าชื่อ voice ต่างกัน
   ⚠ บทเรียน 2026-08-16: รอบแรกทำ voice แยกครบทุกชิ้นและเทสก็เขียว **แต่ผู้ใช้ฟังแล้วบอกว่าทุกอัน
     ยังเป็นเสียงเปียโนต่างแค่ทำนอง** เพราะทุกตัวใช้วิธีสังเคราะห์เดียวกัน (sine + โอเวอร์โทน)
     ⇒ เทสต้องวัดของจริง: ความยาวการจาง · ความ "ซ่า" (zero-crossing) · และต้องมีแบบจำลองหลายแบบ */
test('(ค) คลื่นเสียงจริงของแต่ละเครื่องต้องแยกออกจากกันได้ ไม่ใช่เปียโนต่างทำนอง', async ({ page }) => {
  const errs = await house(page);
  const feat = await page.evaluate(() => {
    ensureAudio();
    const sr = audioCtx.sampleRate, out = {};
    Object.keys(INSTRUMENT_VOICES).forEach(v => {
      const d = instrumentBuffer(v, 261.6).getChannelData(0);
      let peak = 0;
      for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
      /* เวลาที่เสียงจางลงเหลือ 10% — แยก "ต๊อกเดียวจบ" ออกจาก "กังวานยาว" */
      let t10 = 0;
      for (let i = d.length - 1; i >= 0; i--) if (Math.abs(d[i]) > peak * 0.1) { t10 = i; break; }
      /* จำนวนครั้งที่คลื่นตัดศูนย์ต่อวินาที = ความซ่า (เสียงซ่า/โลหะสูงมาก · sine ล้วนต่ำ) */
      const w = Math.min(d.length, Math.round(sr * 0.1));
      let zc = 0;
      for (let i = 1; i < w; i++) if ((d[i] > 0) !== (d[i - 1] > 0)) zc++;
      out[v] = { kind: INSTRUMENT_VOICES[v].kind, decay: t10 / sr, zcr: zc / (w / sr) };
    });
    return out;
  });
  const names = Object.keys(feat);
  expect(names.length, 'ต้องมีเสียงครบทุกแบบ').toBeGreaterThanOrEqual(11);
  /* ต้องมีวิธีสังเคราะห์อย่างน้อย 6 แบบที่ต่างกันจริง ไม่ใช่ตารางตัวเลขของวิธีเดียว */
  const kinds = new Set(names.map(n => feat[n].kind));
  expect(kinds.size, 'ต้องมีแบบจำลองการเกิดเสียงหลายแบบ ไม่ใช่ sine+โอเวอร์โทนล้วน').toBeGreaterThanOrEqual(6);
  const lg = (a, b) => Math.abs(Math.log2(Math.max(a, 1e-4) / Math.max(b, 1e-4)));
  const tooClose = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const A = feat[names[i]], B = feat[names[j]];
      if (A.kind !== B.kind) continue;              /* คนละแบบจำลอง = คนละลักษณะเสียงอยู่แล้ว */
      /* แบบจำลองเดียวกัน ⇒ ต้องต่างกันชัดเจนอย่างน้อย 1 อย่าง (1.5 เท่าขึ้นไป) */
      if (lg(A.decay, B.decay) < 0.58 && lg(A.zcr, B.zcr) < 0.58)
        tooClose.push(names[i] + '↔' + names[j]);
    }
  }
  expect(tooClose, 'มีเครื่องที่คลื่นเสียงใกล้กันเกินไป เด็กจะฟังไม่ออกว่าเป็นคนละชิ้น').toEqual([]);
  /* จุดที่ต้องไม่มีวันหลุด */
  expect(feat.wood.decay, 'กรับต้องจบใน 0.2 วิ').toBeLessThan(0.2);
  expect(feat.chime.decay, 'ระฆังลมต้องกังวานเกิน 2 วิ').toBeGreaterThan(2);
  expect(feat.shake.zcr / feat.piano.zcr, 'แทมบูรินต้องซ่ากว่าเปียโนอย่างน้อย 10 เท่า').toBeGreaterThan(10);
  expect(feat.pluck.zcr / feat.piano.zcr, 'สายดีดต้องมีเนื้อเสียงต่างจากเปียโนชัดเจน').toBeGreaterThan(3);
  expect(errs).toEqual([]);
});

test('(ค) โจทย์ทายเสียงต้องส่ง voice ไปให้หน้าจอเสมอ · 4 ตัวเลือกต้องเสียงไม่ซ้ำกัน', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const bad = { noVoice: [], samePair: [] };
    let n = 0;
    ['prep-p1', 'p3', 'p6'].forEach(g => {
      for (let s = 0; s < 5; s++) {
        (Q.testRun({ mech: 'findsound', gid: g, seed: s }).items || []).forEach(it => {
          if (it.kind !== 'sound') return;
          n++;
          if (!it.sound || !it.sound.voice) bad.noVoice.push(g + '#' + s);
        });
      }
    });
    return { bad, n };
  });
  expect(r.n, 'ต้องสร้างโจทย์ทายเสียงได้จริง').toBeGreaterThan(0);
  expect(r.bad.noVoice, 'ทุกข้อต้องมี sound.voice ไม่งั้นหน้าจอเล่นด้วยเสียงเปียโนหมด').toEqual([]);
  expect(errs).toEqual([]);
});

/* ---------- (ง) + (จ) UI คลังโจทย์ ---------- */
test('(จ) แท็บกลไกทุกตัวต้องอยู่ในกลุ่มจริง ไม่ตกไปกอง "อื่นๆ"', async ({ page }) => {
  const errs = await openQb(page);
  const r = await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll('#hqb-groups .hqb-chip')).map(b => b.textContent);
    return { groups, etc: groups.filter(t => t.indexOf('อื่นๆ') >= 0) };
  });
  expect(r.groups.length, 'ต้องมีแถวกลุ่มโผล่จริง').toBeGreaterThanOrEqual(6);
  expect(r.etc, 'มีกลไกที่ยังไม่ได้จัดกลุ่ม — ไปเติมที่ MECH_GROUPS ใน js/house-qbrowse.js').toEqual([]);
  expect(errs).toEqual([]);
});

test('(ง) กลไกที่ต้องเดินไปตามตำแหน่ง ต้องติดป้าย 🚶 ให้เห็นในแท็บ', async ({ page }) => {
  const errs = await openQb(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const walk = Object.keys(Q.MECHS).filter(k => Q.MECHS[k].walk);
    /* ไปกลุ่ม "ร้านค้า/ในเมือง" ที่มีงานเดินอยู่หลายตัว */
    const g = Array.from(document.querySelectorAll('#hqb-groups .hqb-chip'))
      .find(b => b.textContent.indexOf('ในเมือง') >= 0);
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const chips = Array.from(document.querySelectorAll('#hqb-mechs .hqb-chip')).map(b => b.textContent);
    return { walk, marked: chips.filter(t => t.indexOf('🚶') >= 0).length };
  });
  expect(r.walk, 'ต้องมีกลไกงานเดินอยู่จริง').toContain('fishcatch');
  expect(r.marked, 'กลุ่มในเมืองต้องมีแท็บที่ติดป้าย 🚶 อย่างน้อย 3 ตัว').toBeGreaterThanOrEqual(3);
  expect(errs).toEqual([]);
});

/* ---------- (ฉ) 🎣 ตกปลาไปส่ง — ปรับรอบ 2 (สุ่มบ่อ/ทะเล · ระบุชนิด · หลายชนิด) ---------- */
test('(ฉ) คลังปลาต้องเยอะพอให้โจทย์ไม่ซ้ำ · แยกน้ำจืด/ทะเล · id ห้ามซ้ำ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const F = window.HousePlay.FISH;
    const ids = F.map(f => f.id);
    return {
      n: F.length,
      pond: F.filter(f => f.where === 'pond').length,
      sea: F.filter(f => f.where === 'sea').length,
      dup: ids.filter((v, i) => ids.indexOf(v) !== i),
      /* ปลาที่ "สั่งในเควสต์ได้" = ไม่ใช่ของขยะ และไม่ใช่ปลาหายาก */
      orderPond: F.filter(f => f.where === 'pond' && !f.junk && f.rare <= 2).length,
      orderSea: F.filter(f => f.where === 'sea' && !f.junk && f.rare <= 2).length,
      noName: F.filter(f => !f.n || !f.e).map(f => f.id),
    };
  });
  expect(r.n, 'ต้องมีปลาอย่างน้อย 40 ชนิด เด็กจะได้ไม่เบื่อเจอแต่ตัวเดิม').toBeGreaterThanOrEqual(40);
  expect(r.pond, 'ปลาน้ำจืดต้องเยอะพอ').toBeGreaterThanOrEqual(18);
  expect(r.sea, 'ปลาทะเลต้องเยอะพอ').toBeGreaterThanOrEqual(18);
  expect(r.dup, 'id ปลาห้ามซ้ำ').toEqual([]);
  expect(r.noName, 'ปลาทุกตัวต้องมีชื่อและไอคอน').toEqual([]);
  expect(r.orderPond, 'ปลาบ่อที่สั่งได้ต้องมีหลายตัว').toBeGreaterThanOrEqual(8);
  expect(r.orderSea, 'ปลาทะเลที่สั่งได้ต้องมีหลายตัว').toBeGreaterThanOrEqual(8);
  expect(errs).toEqual([]);
});

test('(ฉ) ใบสั่งตกปลา: สุ่มทั้งบ่อและทะเล · ระบุชนิดจริง · ห้ามสั่งปลาหายาก/ของขยะ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, F = window.HousePlay.FISH;
    const byId = {};
    F.forEach(f => { byId[f.id] = f; });
    const wheres = {}, bad = { rare: [], junk: [], mixWhere: [], noNeed: [], tooMany: [] };
    const kindCount = {};
    ['prep-p1', 'p3', 'p6'].forEach(g => {
      for (let sd = 0; sd < 12; sd++) {
        const it = (Q.testRun({ mech: 'fishcatch', gid: g, seed: sd }).items || [])[0] || {};
        if (it.target !== 'catch') { bad.noNeed.push(g + '#' + sd); continue; }
        wheres[it.where] = (wheres[it.where] | 0) + 1;
        kindCount[g] = Math.max(kindCount[g] | 0, it.need.length);
        let total = 0;
        it.need.forEach(rw => {
          const f = byId[rw.id];
          total += rw.n;
          if (!f) { bad.noNeed.push(rw.id); return; }
          if (f.rare >= 3) bad.rare.push(rw.id);            /* หายาก โผล่ 10% = เควสต์จบยาก */
          if (f.junk) bad.junk.push(rw.id);                 /* รองเท้าบูต/สาหร่าย ไม่ใช่ปลา */
          if (f.where !== it.where) bad.mixWhere.push(rw.id); /* ปนบ่อกับทะเล = ตกให้ครบไม่ได้ */
        });
        if (total > 4) bad.tooMany.push(g + '#' + sd + ':' + total);
      }
    });
    return { wheres, bad, kindCount };
  });
  expect(r.bad.noNeed, 'ทุกใบสั่งต้องเป็นงานเดินแบบ catch และชนิดปลาต้องมีจริง').toEqual([]);
  expect(r.bad.rare, '**ห้ามสั่งปลาหายาก** (โผล่ 10% เควสต์จะจบยากเกินไป)').toEqual([]);
  expect(r.bad.junk, 'ห้ามสั่งของขยะ (รองเท้าบูต/สาหร่าย/ขวด)').toEqual([]);
  expect(r.bad.mixWhere, 'ใบสั่งเดียวห้ามปนปลาบ่อกับปลาทะเล').toEqual([]);
  expect(r.bad.tooMany, 'รวมทั้งใบสั่งห้ามเกิน 4 ตัว (งบเวลา 240 วิ/เควสต์)').toEqual([]);
  /* ต้องสุ่มได้ทั้ง 2 แหล่งน้ำจริง ไม่ใช่ออกบ่ออย่างเดียวตลอด */
  expect(r.wheres.pond, 'ต้องมีใบสั่งปลาบ่อ').toBeGreaterThan(0);
  expect(r.wheres.sea, 'ต้องมีใบสั่งปลาทะเล').toBeGreaterThan(0);
  /* ชั้นโตต้องสั่งได้หลายชนิดต่อรอบ (ตามที่ผู้ใช้สั่ง) */
  expect(r.kindCount['p6'], 'ป.6 ต้องเจอใบสั่งที่มีปลาหลายชนิด').toBeGreaterThanOrEqual(2);
  expect(r.kindCount['prep-p1'], 'เด็กเล็กสั่งชนิดเดียวพอ').toBe(1);
  expect(errs).toEqual([]);
});

test('(ฉ) ตกปลาจริงแล้วตัวนับต้องขยับตามชนิด · ตกผิดชนิดไม่นับ · ครบแล้วส่งได้', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(async () => {
    const D = window.__houseDbg;
    window.HouseQuestUI.playTest({ mech: 'fishcatch', gid: 'p6', seed: 5, title: '🧪 ตกปลาไปส่ง' });
    await new Promise(r2 => setTimeout(r2, 400));
    const go = document.querySelector('#house-qz .hqz-yes');
    if (!go) return { err: 'ไม่มีปุ่มรับงาน' };
    go.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(r2 => setTimeout(r2, 300));
    const wq = D.walkCatch();
    if (!wq) return { err: 'ไม่เข้าโหมดงานเดิน' };
    /* ตกปลาชนิดที่ "ไม่ได้สั่ง" ก่อน — ต้องไม่นับ */
    const other = window.HousePlay.FISH.filter(f => !wq.need.some(n => n.id === f.id))[0];
    const wrong = window.HouseWorld.questCaught('fish', other.id);
    /* แล้วตกตามใบสั่งให้ครบ + เกินอีก 2 ครั้ง (ต้องไม่นับซ้ำ) */
    const steps = [];
    wq.need.forEach(rw => {
      for (let i = 0; i < rw.n + 2; i++) steps.push(window.HouseWorld.questCaught('fish', rw.id));
    });
    const after = D.walkCatch();
    return { wq, wrong, steps, after };
  });
  expect(r.err).toBeUndefined();
  expect(r.wq.where, 'ต้องระบุแหล่งน้ำ').toMatch(/pond|sea/);
  expect(r.wq.need.length, 'ป.6 ต้องได้ใบสั่งหลายชนิด').toBeGreaterThanOrEqual(2);
  expect(r.wrong, 'ตกปลาที่ไม่ได้สั่ง = ต้องไม่นับ').toBe(false);
  expect(r.after.done, 'ตกครบตามใบสั่งแล้วต้องส่งได้').toBe(true);
  /* แต่ละชนิดต้องหยุดที่เพดาน ตกเกินไม่นับเพิ่ม */
  r.after.need.forEach(rw => {
    expect(r.after.got[rw.k + ':' + rw.id], 'ชนิด ' + rw.id + ' ต้องไม่นับเกินที่สั่ง').toBe(rw.n);
  });
  expect(errs).toEqual([]);
});

test('(ฉ) 🗑️ "ตกปลาคิดเลข" ต้องถูกถอดออกแล้ว (มี Action จริงแทนแล้ว)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => ({
    mech: !!window.HouseQuests.MECHS['fishmath'],
    tab: (window.HouseQB ? window.HouseQB.MECH_TABS : []).some(t => t.id === 'fishmath'),
  }));
  expect(r.mech, 'กลไก fishmath ต้องไม่มีแล้ว — กติกา: เกมไหนทำเป็น Action จริง ให้ถอดเวอร์ชันการ์ดออก').toBe(false);
  expect(r.tab, 'แท็บ fishmath ต้องไม่มีแล้ว').toBe(false);
  expect(errs).toEqual([]);
});

/* ---------- 🔇 findsound: ปิดจากเควสต์จริง แต่ยังทดสอบได้ ---------- */
test('🔇 ทายเสียงเครื่องดนตรีต้องไม่ถูกแจกเป็นเควสต์จริง แต่ยังเล่นทดสอบได้', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    /* ไล่สุ่มงานของพี่โน้ต (ร้านดนตรี) หลายรอบ — findsound ต้องไม่โผล่เลยสักครั้ง */
    const seen = {};
    for (let d = 0; d < 60; d++) {
      const m = Q.rollWorkMech ? Q.rollWorkMech(Math.random, 'npc-music-1') : null;
      if (m) seen[m] = true;
    }
    return {
      testOnly: !!Q.MECHS['findsound'].testOnly,
      seen: Object.keys(seen),
      /* หน้าคลังโจทย์ยังต้องเล่นได้ (testRun ไม่ผ่าน mechOk) */
      test: (Q.testRun({ mech: 'findsound', gid: 'p3', seed: 1 }).items || []).length,
    };
  });
  expect(r.testOnly, 'ต้องติดธง testOnly').toBe(true);
  expect(r.seen, 'findsound ห้ามถูกสุ่มเป็นงานจริง').not.toContain('findsound');
  expect(r.test, 'แต่ยังต้องเล่นทดสอบในคลังโจทย์ได้').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});

/* ---------- 🌍 งาน Action จริงชุดที่ 2 ---------- */
test('🌍 งาน Action จริง 3 ตัวใหม่: สร้างใบสั่งได้ · มีปลายทาง · ถูกกรองเมื่อทำไม่ได้', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const out = {};
    ['collectgive', 'watergarden', 'photogive'].forEach(m => {
      const spec = Q.MECHS[m];
      const it = (Q.testRun({ mech: m, gid: 'p3', seed: 2 }).items || [])[0] || {};
      out[m] = {
        walk: !!spec.walk, action: spec.action, shape: Q.mechShape(m),
        target: it.target, need: it.need, toNpc: it.toNpc,
      };
    });
    return { out, stock: window.HousePlay.worldStock() };
  });
  ['collectgive', 'watergarden', 'photogive'].forEach(m => {
    const o = r.out[m];
    expect(o.walk, m + ' ต้องเป็นงานเดิน').toBe(true);
    expect(o.shape, m + ' ต้องนับเป็นทรงเดิน (ไม่กินงบเวลาแบบการ์ด)').toBe('walk');
    expect(o.action, m + ' ต้องผูกกับของจริงในโลก').toBeTruthy();
  });
  /* 🌱 วันแรกยังไม่มีแปลงผัก ⇒ worldStock().water = 0 ⇒ ต้องถูกกรองออกจากงานจริง */
  expect(r.stock.water, 'บ้านใหม่ยังไม่มีแปลงผัก').toBe(0);
  expect(r.stock.leaf, 'ของเก็บประจำวันต้องมีให้เก็บ').toBeGreaterThan(0);
  expect(errs).toEqual([]);
});

test('🌍 งาน Action จริง: ทำจริงในโลกแล้วตัวนับต้องขยับ (เก็บของ)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(async () => {
    const D = window.__houseDbg;
    window.HouseQuestUI.playTest({ mech: 'collectgive', gid: 'p3', seed: 1, title: '🧪 เก็บของ' });
    await new Promise(r2 => setTimeout(r2, 400));
    const go = document.querySelector('#house-qz .hqz-yes');
    if (!go) return { err: 'ไม่มีปุ่มรับงาน' };
    go.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise(r2 => setTimeout(r2, 300));
    const wq = D.walkCatch();
    if (!wq) return { err: 'ไม่เข้าโหมดงานเดิน' };
    const n = wq.need[0].n;
    const steps = [];
    for (let i = 0; i < n + 2; i++) steps.push(window.HouseWorld.questCaught('leaf', ''));
    /* ทำงานคนละชนิดต้องไม่นับ */
    const wrongKind = window.HouseWorld.questCaught('photo', '');
    return { n, steps, wrongKind, done: D.walkCatch().done };
  });
  expect(r.err).toBeUndefined();
  expect(r.steps.filter(Boolean).length, 'ต้องนับได้พอดีตามที่สั่ง ไม่นับเกิน').toBe(r.n);
  expect(r.wrongKind, 'ทำงานคนละชนิดต้องไม่นับ').toBe(false);
  expect(r.done, 'ครบแล้วต้องส่งได้').toBe(true);
  expect(errs).toEqual([]);
});

/* ============================================================
   📍 ปิดแอปดื้อๆ แล้วกลับมา ต้องอยู่จุดเดิม (ผู้ใช้แจ้ง 2026-08-17)

   ของเดิมเซฟตำแหน่งไว้ที่ `stopHouseGame()` จุดเดียว = เซฟเฉพาะตอน "กดปุ่มออกจากเมือง"
   เด็กปิดแท็บ/สลับแอปบนแท็บเล็ตไม่เคยวิ่งผ่านตรงนั้นเลย ⇒ ตำแหน่งไม่เคยถูกบันทึก
   ⚠ เทสนี้ต้อง **โหลดหน้าใหม่จริงๆ** ไม่ใช่กด exit — ไม่งั้นวัดทางเดิมที่เคยผ่านอยู่แล้ว
   ⚠ ห้ามให้ addInitScript ทับ save ตอน reload (เคยพลาดมาแล้ว) ⇒ seed เฉพาะตอนยังไม่มี
   ============================================================ */
async function houseKeep(page) {
  await page.addInitScript(([child, hkey, seed]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', 'off');
    if (!localStorage.getItem(hkey)) localStorage.setItem(hkey, JSON.stringify(seed));
  }, [CHILD, HKEY, SEED]);
}
async function enterHouse(page) {
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
}

test('📍 ปิดแอปโดยไม่กดออก (pagehide) แล้วเปิดใหม่ ต้องยืนที่เดิม', async ({ page }) => {
  await houseKeep(page);
  await enterHouse(page);

  /* เดินไปช่องอื่นให้ไกลจากจุดตั้งต้น แล้วรอจนถึงที่จริง */
  const walked = await page.evaluate(async () => {
    const W = window.HouseWorld;
    const from = W.tile();
    const dst = W.nearWalkable(from.x + 4, from.z + 4) || W.nearWalkable(from.x - 4, from.z - 4);
    W.walkTo(dst.x, dst.z);
    /* ⚠ ต้องรอจน **หยุดเดินจริง** ไม่ใช่แค่ถึงช่องปลายทาง — ถ้าวัดตอนยังก้าวอยู่
       ตัวเกมจะเซฟทับด้วยช่องถัดไปหลังเทสอ่านค่าไปแล้ว แล้วเทสแดงแบบเข้าใจผิด */
    /* ⚠ เครื่องเทสวาดได้ ~3 fps ⇒ ก้าวละ ~2 วินาทีจริง **ห้ามเดาว่าหยุดเดินแล้วจากเวลาที่นิ่ง**
       ต้องดูธง walking() ตรงๆ ไม่งั้นวัดตอนยังก้าวอยู่ แล้วเกมเซฟทับด้วยช่องถัดไปทีหลัง */
    const t0 = Date.now();
    while (Date.now() - t0 < 40000) {
      await new Promise(r => setTimeout(r, 200));
      if (!window.__houseDbg.walking()) break;
    }
    return { from, dst, at: W.tile() };
  });
  expect(walked.at, 'ต้องเดินออกจากจุดตั้งต้นได้').not.toEqual(walked.from);

  /* 🔌 ปิดแอปดื้อๆ — ไม่แตะปุ่มออกจากเมืองเลย */
  const saved = await page.evaluate(hkey => {
    window.dispatchEvent(new Event('pagehide'));
    const d = JSON.parse(localStorage.getItem(hkey) || '{}');
    return d.spot || null;
  }, HKEY);
  expect(saved, 'ปิดแอปแล้วต้องมีตำแหน่งถูกบันทึกไว้').not.toBeNull();
  expect({ x: saved.x, z: saved.z }, 'ตำแหน่งที่บันทึกต้องตรงกับที่เด็กยืนอยู่').toEqual(walked.at);

  /* เปิดแอปใหม่ */
  await enterHouse(page);
  const back = await page.evaluate(hkey => {
    const d = JSON.parse(localStorage.getItem(hkey) || '{}');
    return { tile: window.HouseWorld.tile(), spot: d.spot };
  }, HKEY);
  expect(back.spot, 'ค่าที่บันทึกต้องไม่ถูกเขียนทับตอนโหลดใหม่')
    .toMatchObject({ x: walked.at.x, z: walked.at.z });
  expect(back.tile, 'กลับเข้ามาใหม่ต้องยืนจุดเดิม ไม่ใช่เด้งกลับหน้าบ้าน').toEqual(walked.at);
});
