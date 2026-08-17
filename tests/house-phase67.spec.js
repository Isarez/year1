/* ============================================================
   เฟส 6 (แล็บ STEM + coding) และ เฟส 7 (กลไกกลุ่ม B + D) + ทายเสียงที่ตกค้างจากเฟส 5

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. คลังตั้งต้นของทุกกลไกใหม่ต้องมี **≥ 40 รายการ** (ผู้ใช้สั่ง 2026-08-12)
     2. ของชิ้นเดียวห้ามอยู่ 2 ถังในคลังเดียวกัน (เด็กวางถูกก็ยังถูกนับว่าผิด = ลงโทษเด็ก)
     3. งานของตึกแล็บ/ร้านดนตรีต้องไม่หลุดไปให้ชาวบ้านทั่วไป (แล็บคือ "จุดเดียวในเมือง" ตามข้อ 30)
     4. เกมที่มีหมวดเฉพาะชั้นสูง (วงจรไฟฟ้า ป.6 · แท็งแกรม ป.5-6) ห้ามถูกแจกให้เด็กชั้นเล็ก
     5. เกมตะกร้าต้อง **มีชุดคำตอบที่เป็นไปได้เสมอ** (ห้ามมี dead end)
     6. มินิเกมที่เล่าเรื่องในบ้านยังต้องเป็นของเควสต์ครอบครัวล้วน (ดู tests/house-family-games.spec.js)
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p67a', name: 'มะลิ', emoji: '🐨', birthDate: '2019-03-20', grade: 'p3' };
async function house(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;   /* 🎓 ปิดบทเรียนสอนเล่น (เฟส 15) — ฟองนกฮูกจะบังจุดที่เทสสั่งแตะ */
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_p67a', JSON.stringify({ v:1, mapV: 3,
      char:{gender:0,hair:0,hairC:0,eyes:1,eyeC:0,shirt:5,bottom:0,shoes:0} }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  /* ⚠ ต้องรอ __houseDbg.ready() เสมอ ห้ามรอแค่ mode()==='world' (hMode มีค่า 'world' ตั้งแต่โหลดไฟล์) */
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  return errs;
}

/* กลไกใหม่ทั้งหมดของเฟส 6-7 + ตัวตกค้างจากเฟส 5 */
const NEW_MECHS = [
  'sinkfloat','magnet','states','habitat','plantgrow','measure','codeorder','codedebug',   /* เฟส 6 เขียนใหม่ */
  'shapebuild','circuit','robot','codeloop','codecond',                                    /* เฟส 6 ยืม engine */
  'soundguess',                                                                            /* เฟส 5 ตกค้าง */
  /* ⚠ 2026-08-16: `changeback`/`stockshelf` เปลี่ยนเป็นงาน Action ที่ร้านสะดวกซื้อแล้ว (ข้อ 55)
       ⇒ ออกจากชุดนี้ เพราะ gen() คืนงานเดิน ไม่ใช่กระดานให้ตอบในการ์ด
       เทสของมันอยู่ที่ tests/house-action-ab.spec.js */
  'payexact','recipeseq','traffic','deliver',                                   /* เฟส 7 กลุ่ม B */
  'spotdiff','flashcount','dressorder','findhidden',                                        /* เฟส 7 กลุ่ม D */
];

test('เฟส 6-7: กลไกใหม่ทุกตัวลงทะเบียนครบใน MECHS + มีแท็บในหน้าคลังคำถาม', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(mechs => {
    const q = window.HouseQuests;
    const missing = mechs.filter(m => !q.MECHS[m]);
    /* หน้าคลังคำถามเป็นเครื่องมือเทส อาจถูกปิดด้วย QB_ENABLED=false ตอน deploy — ข้ามได้ */
    const tabs = window.HouseQB && window.HouseQB.MECH_TABS
      ? window.HouseQB.MECH_TABS.map(t => t.id) : null;
    return { missing, noTab: tabs ? mechs.filter(m => tabs.indexOf(m) < 0) : [] };
  }, NEW_MECHS);
  expect(r.missing, 'กลไกที่ยังไม่ได้ลงทะเบียนใน MECHS').toEqual([]);
  expect(r.noTab, 'กลไกที่ยังไม่มีแท็บใน MECH_TABS ของหน้าคลังคำถาม').toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 6-7: คลังตั้งต้นทุกกลไกใหม่ ≥ 40 รายการ (ผู้ใช้สั่ง 2026-08-12)', async ({ page }) => {
  const errs = await house(page);
  const pools = await page.evaluate(() => {
    const q = window.HouseQuests;
    const binCount = k => q.STEM_SETS[k].bins.reduce((a, b) => a + b.items.length, 0);
    return {
      sinkfloat: binCount('sinkfloat'), magnet: binCount('magnet'),
      states: binCount('states'),       habitat: binCount('habitat'),
      plantgrow: q.GROW_SETS.length,    measure: q.MEASURE_ITEMS.length,
      codeorder: q.CODE_TASKS.length,   codedebug: q.CODE_TASKS.length,
      soundguess: q.SOUND_MOTIFS.length + q.SOUND_SONGS.length,
      payexact: q.PRICED_GOODS.length,  changeback: q.PRICED_GOODS.length,
      stockshelf: q.PRICED_GOODS.length, recipeseq: q.RECIPE_SETS.length,
      traffic: q.TRAFFIC_CARDS.length,  deliver: q.DELIVER_ITEMS.length * q.HIDDEN_ZONES.length,
      spotdiff: q.SPOT_SCENES.length,   dressorder: q.DRESS_ITEMS.length,
      findhidden: q.HIDDEN_ITEMS.length,
    };
  });
  console.log('คลังตั้งต้น: ' + JSON.stringify(pools));
  Object.keys(pools).forEach(k => {
    expect(pools[k], 'คลังของ ' + k + ' ต้องมีอย่างน้อย 40 รายการ').toBeGreaterThanOrEqual(40);
  });
  expect(errs).toEqual([]);
});

test('เฟส 6: ของชิ้นเดียวห้ามอยู่ 2 ถังในคลังเดียวกัน', async ({ page }) => {
  const errs = await house(page);
  const dup = await page.evaluate(() => {
    const q = window.HouseQuests, out = [];
    Object.keys(q.STEM_SETS).forEach(k => {
      const seen = {};
      q.STEM_SETS[k].bins.forEach(b => b.items.forEach(e => {
        if (seen[e]) out.push(k + ':' + e + ' (' + seen[e] + ' + ' + b.id + ')');
        seen[e] = b.id;
      }));
    });
    return out;
  });
  expect(dup, 'ของที่อยู่ 2 ถังพร้อมกัน').toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 6-7: gen() ทุกกลไกใหม่ × ทุกชั้น — ตอบได้จริง ไม่ซ้ำ ไม่มี dead end', async ({ page }) => {
  test.setTimeout(90000);
  const errs = await house(page);
  const bad = await page.evaluate(mechs => {
    const q = window.HouseQuests, out = [];
    q.GRADES.forEach(g => {
      const eng = window.HOUSE_QUESTS({
        load: () => ({}), save: () => {}, childId: () => 'k', gradeId: () => g.id,
        dayKey: () => '2026-8-12',
        npcDefs: window.__houseDbg.npcDefs ? window.__houseDbg.npcDefs() : [],
        petFoods: () => (window.HousePetCare ? window.HousePetCare.FOOD : []),
        hasIndoorSeat: () => true,
        hasGame: (id, gid, pick) => !!(window.OwlGames && window.OwlGames.has(id)
          && window.HouseGames && window.HouseGames.ALLOW[id]
          && window.HouseGames.pickCat(id, gid || 'prep-p1', pick)),
      });
      eng.sync();
      mechs.forEach(m => {
        if (!eng.MECHS[m]) return;
        for (let t = 0; t < 6; t++) {
          const spec = { src:'npc', key:'k'+t, npc:'npc-lab1', mech:m, fam:'A', chal:false };
          let run;
          try { run = eng.buildRun(spec); }
          catch (e) { out.push(g.id + '/' + m + ': throw ' + e.message); break; }
          if (!run.items || !run.items.length) { out.push(g.id + '/' + m + ': ว่าง'); break; }
          /* ⚠ 2 กลุ่มนี้ **ยกเว้นกติกาขั้นต่ำ MIN_Q โดยตั้งใจ** ห้ามไปบังคับให้มี 5 ข้อ:
             - งานเดิน (walk): "ไปให้ถึงแล้วทำ" ชิ้นเดียวจบ (ผู้ใช้อนุมัติตั้งแต่เฟส 4B)
             - เกมที่ยืม engine หน้าหลัก (engine): 1 เควสต์ = 1 รอบเกม 10 ด่านของ engine เดิม (เฟส 5) */
          const skipMinQ = run.items.every(x => x.kind === 'walk' || x.kind === 'engine');
          if (!skipMinQ && run.items.length < eng.MIN_Q)
            out.push(g.id + '/' + m + ': สั้นไป ' + run.items.length);
          const sigs = run.items.map(eng.itemSig);
          if (new Set(sigs).size !== sigs.length) out.push(g.id + '/' + m + ': มีโจทย์ซ้ำในเควสต์เดียว');
          run.items.forEach((it, i) => {
            if (it.kind === 'sort' && it.basket) {
              /* เกมตะกร้าไม่ได้ใช้ของทุกชิ้น ⇒ ไล่หาว่ามีชุดคำตอบที่ผ่านได้จริงไหม (กัน dead end) */
              const n = it.tiles.length;
              let solvable = false;
              for (let mask = 0; mask < (1 << n) && !solvable; mask++) {
                const placed = {};
                for (let b = 0; b < n; b++) if (mask & (1 << b)) placed[it.tiles[b].k] = 'basket';
                if (eng.MECHS[m].verify(it, placed).ok) solvable = true;
              }
              if (!solvable) out.push(g.id + '/' + m + ': ข้อ ' + i + ' ไม่มีคำตอบที่เป็นไปได้ (dead end)');
            } else if (it.kind === 'sort') {
              const placed = {}; it.tiles.forEach(t => placed[t.k] = t.bin);
              if (!eng.MECHS[m].verify(it, placed).ok)
                out.push(g.id + '/' + m + ': ข้อ ' + i + ' วางถูกแล้วยังถูกนับว่าผิด');
            } else if (it.kind === 'walk') {
              if (it.target === 'npc' && !it.toNpc) out.push(g.id + '/' + m + ': งานเดินไม่มีปลายทาง');
              if (it.target === 'zone' && !it.zone) out.push(g.id + '/' + m + ': งานเดินไม่มีย่านปลายทาง');
            } else if (it.kind === 'engine') {
              /* เกมที่ยืมมา: การ์ดใบนี้เป็นแค่หน้าชวนเล่น ตัวเกมจริงอยู่ที่ engine ของหน้าหลัก */
              if (!it.game) out.push(g.id + '/' + m + ': ไม่ได้บอกว่าจะเล่นเกมไหน');
              if (!it.go)   out.push(g.id + '/' + m + ': ไม่มีปุ่มเริ่มเล่น');
            } else if (it.kind === 'coinpay') {
              /* 💰 จ่ายเงินให้พอดี: เด็ก **แตะเหรียญเอง** ไม่มีปุ่มตัวเลือกให้กด (ผู้ใช้สั่งเปลี่ยน 2026-08-16)
                 ⇒ ยกเว้นกติกา choices แต่ต้องมีราคากับชุดเหรียญที่จ่ายได้จริงเสมอ */
              if (!(it.price > 0)) out.push(g.id + '/' + m + ': ข้อ ' + i + ' ไม่มีราคา');
              if (!it.units || !it.units.length) out.push(g.id + '/' + m + ': ข้อ ' + i + ' ไม่มีเหรียญให้จ่าย');
            } else {
              if (!it.choices || it.choices.length < 2) out.push(g.id + '/' + m + ': ข้อ ' + i + ' ตัวเลือกน้อยไป');
              if (it.correct == null || it.correct < 0 || it.correct >= (it.choices || []).length)
                out.push(g.id + '/' + m + ': ข้อ ' + i + ' เฉลยอยู่นอกช่วงตัวเลือก');
              if (new Set(it.choices).size !== it.choices.length)
                out.push(g.id + '/' + m + ': ข้อ ' + i + ' มีตัวเลือกซ้ำ');
            }
          });
        }
      });
    });
    return [...new Set(out)];
  }, NEW_MECHS);
  expect(bad).toEqual([]);
  expect(errs).toEqual([]);
});

test('เฟส 6: งานแล็บ/ร้านดนตรีไม่หลุดไปชาวบ้านทั่วไป · คนในแล็บได้งานของตัวเองจริง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const labOnly = ['sinkfloat','magnet','states','habitat','plantgrow','measure','codeorder',
                     'codedebug','shapebuild','circuit','robot','codeloop','codecond','soundguess'];
    const rngFor = i => { let h = (i * 2654435761) >>> 0;
      return () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; }; };
    const leak = [];
    for (let i = 0; i < 3000; i++) {
      const m = q.rollWorkMech(rngFor(i), 'npc-mart1');
      if (labOnly.indexOf(m) >= 0) leak.push(m);
    }
    const who = {};
    ['npc-lab1','npc-lab2','npc-lab3','npc-stu1','npc-musicshop'].forEach(id => {
      const s = new Set();
      for (let i = 0; i < 400; i++) s.add(q.rollWorkMech(rngFor(i + 7), id));
      who[id] = [...s];
    });
    return { leak: [...new Set(leak)], who };
  });
  console.log('งานของคนในแล็บ: ' + JSON.stringify(r.who));
  expect(r.leak, 'งานแล็บหลุดไปให้ชาวบ้านทั่วไป').toEqual([]);
  /* ดร.ฟ้า = วิทย์ · ดร.ต้น = วัด/ตวง · พี่ผู้ช่วย = coding · ร้านดนตรี = ทายเสียง */
  expect(r.who['npc-lab1']).toContain('sinkfloat');
  expect(r.who['npc-lab2']).toContain('measure');
  expect(r.who['npc-lab3']).toContain('codeorder');
  expect(r.who['npc-musicshop']).toContain('soundguess');
  /* ทุกคนต้องมี quiz ปนอยู่เสมอ (กติกาข้อ 4: ทุก NPC ต้องตอบคำถามได้) */
  Object.keys(r.who).forEach(id => expect(r.who[id], id + ' ต้องมี quiz ด้วย').toContain('quiz'));
  expect(errs).toEqual([]);
});

test('เฟส 6: เกมที่มีหมวดเฉพาะชั้นสูง ห้ามถูกแจกให้เด็กชั้นเล็ก', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const out = {};
    const mk = gid => window.HOUSE_QUESTS({
      load: () => ({}), save: () => {}, childId: () => 'k', gradeId: () => gid,
      dayKey: () => '2026-8-12', npcDefs: [],
      hasGame: (id, g, pick) => !!(window.OwlGames && window.OwlGames.has(id)
        && window.HouseGames && window.HouseGames.ALLOW[id]
        && window.HouseGames.pickCat(id, g || 'prep-p1', pick)),
    });
    ['prep-p1','p1','p2','p3','p4','p5','p6'].forEach(g => {
      const eng = mk(g);
      out[g] = { circuit: eng.engineReady('circuit', g), shape: eng.engineReady('shapebuild', g),
                 loop: eng.engineReady('codeloop', g),  robot: eng.engineReady('robot', g) };
    });
    return out;
  });
  console.log('พร้อมเล่นตามชั้น: ' + JSON.stringify(r));
  /* 🔌🧩 **ผู้ใช้สั่งเปิดให้เล่นตั้งแต่ ป.1 เมื่อ 2026-08-17** (เดิมวงจรไฟมีแต่ ป.6 · แท็งแกรม ป.5-6)
     ⚠ เกณฑ์เดิมถูก "กลับด้าน" ไม่ได้ลบเทสทิ้ง — กติกาที่ยังต้องคุมคือ
       **ห้ามแจกหมวดที่ชั้นสูงกว่าเด็ก** ซึ่งตอนนี้ผ่านได้เพราะมีหมวดของทุกชั้นจริงๆ
       (ไม่ได้แก้ด้วยการผ่อนกฎ `pickCat` ให้ข้ามชั้น — ข้อนั้นยังห้ามเหมือนเดิม)
     ⚠ ระดับเตรียม ป.1 ยังไม่มีหมวด 2 ตัวนี้ ⇒ ต้องยังไม่ถูกแจก */
  expect(r['prep-p1'].circuit).toBe(false);
  expect(r['p1'].circuit).toBe(true);
  expect(r['p5'].circuit).toBe(true);
  expect(r['p6'].circuit).toBe(true);
  expect(r['prep-p1'].shape).toBe(false);
  expect(r['p1'].shape).toBe(true);
  expect(r['p2'].shape).toBe(true);
  expect(r['p5'].shape).toBe(true);
  /* คำสั่งวนซ้ำเริ่มมีที่ ป.2 — เด็กเล็กกว่านั้นต้องได้ชุดเดินตามคำสั่งธรรมดาแทน */
  expect(r['p1'].loop).toBe(false);
  expect(r['p2'].loop).toBe(true);
  /* ⚠ หมวดหุ่นยนต์ที่ง่ายที่สุดในคลังคือของ ป.1 ⇒ **เด็กระดับเตรียม ป.1 จะไม่ถูกแจกงาน coding เลย**
     ถูกต้องแล้วตามกฎ "ห้ามแจกหมวดที่ชั้นสูงกว่าเด็ก" — ถ้าอยากให้เด็ก 5 ขวบได้เล่นด้วย
     ต้องไปเพิ่มหมวด code ของระดับเตรียม ป.1 ในคลัง CATS ก่อน ไม่ใช่มาผ่อนกฎตรงนี้ */
  expect(r['prep-p1'].robot).toBe(false);
  expect(r['p1'].robot).toBe(true);
  expect(errs).toEqual([]);
});

test('เฟส 6: การ์ดโจทย์วาดได้จริง — บีกเกอร์ · รายการคำสั่ง · จัดของลงถัง', async ({ page }) => {
  const errs = await house(page);
  /* ตวง/วัด: มีโหมดบีกเกอร์ปนอยู่ ⇒ เปิดหลายรอบจนเจอ (โจทย์สุ่ม 3 แบบสลับกัน) */
  let sawBeaker = false;
  for (let i = 0; i < 12 && !sawBeaker; i++) {
    await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'measure', title: '🧪 ตวงและวัด' }));
    sawBeaker = await page.locator('.hqz-beaker svg').count() > 0;
    if (!sawBeaker) await page.evaluate(() => window.__houseDbg.closeQuest && window.__houseDbg.closeQuest());
  }
  expect(sawBeaker, 'เปิดโจทย์ตวง/วัดหลายรอบแล้วยังไม่เจอหน้าบีกเกอร์เลย').toBe(true);
  /* บีกเกอร์ต้องมีตัวเลขกำกับขีด ไม่ใช่ขีดเปล่าๆ (ไม่งั้นเด็กอ่านค่าไม่ได้) */
  expect(await page.locator('.hqz-beaker svg text').count()).toBeGreaterThan(1);

  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'codedebug', title: '🐞 หาคำสั่งที่ผิด' }));
  await expect(page.locator('.hqz-code-line').first()).toBeVisible();
  const lines = await page.locator('.hqz-code-line').count();
  expect(lines).toBeGreaterThanOrEqual(3);
  /* เลขบรรทัดต้องมีครบทุกแถว เพราะปุ่มตัวเลือกอ้างถึง "บรรทัดที่ N" */
  expect(await page.locator('.hqz-code-n').count()).toBe(lines);

  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'sinkfloat', title: '🌊 จม หรือ ลอย' }));
  await expect(page.locator('.hqz-sort').first()).toBeVisible();
  expect(await page.locator('.hqz-bin').count()).toBeGreaterThanOrEqual(2);
  expect(errs).toEqual([]);
});

test('เฟส 7: การ์ดโจทย์วาดได้จริง — เหรียญ · จับผิดภาพ · นับแว้บเดียว', async ({ page }) => {
  const errs = await house(page);
  /* 💰 จ่ายเงินให้พอดี — **แตะเหรียญเอง ไม่ใช่ลากการ์ด** (ผู้ใช้สั่งเปลี่ยน 2026-08-16)
     เหรียญต้องเป็นเหรียญนกฮูกที่วาดด้วย CSS ไม่ใช่อิโมจิ 🪙 ที่บางเครื่องไม่มี glyph
     และแถวให้เลือกต้องมี **4 แบบเท่านั้น (1/2/5/10)** ตามที่ผู้ใช้ย้ำหลายรอบ */
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'payexact', title: '🧾 จ่ายเงินให้พอดี' }));
  await expect(page.locator('.hqz-pay-pick .hqz-pay-btn').first()).toBeVisible();
  expect(await page.locator('.hqz-pay-pick .hqz-pay-btn').count()).toBe(4);
  expect(await page.locator('.hqz-pay-pick .hqz-coinface').count()).toBe(4);
  const coinText = await page.locator('.hqz-stage, #hqz-stage').first().innerText();
  expect(coinText).not.toContain('🪙');

  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'spotdiff', title: '🔍 จับผิดภาพ' }));
  await expect(page.locator('.hqz-spot-row').first()).toBeVisible();
  expect(await page.locator('.hqz-spot-row').count()).toBe(2);
  /* 2 แถวต้องเรียงตรงคอลัมน์กัน ไม่งั้นเด็กเทียบไม่ได้ */
  const cols = await page.evaluate(() => Array.from(document.querySelectorAll('.hqz-spot-row'))
    .map(r => getComputedStyle(r).gridTemplateColumns));
  expect(cols[0]).toBe(cols[1]);

  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'flashcount', title: '⚡ นับแว้บเดียว' }));
  await expect(page.locator('.hqz-flash')).toBeVisible();
  /* โชว์ของแล้วต้องซ่อนเองแล้วขึ้นตัวเลือก — และห้ามย้อนกลับมาโชว์อีก (ไม่งั้นเป็นการเฉลยฟรี) */
  await expect(page.locator('.hqz-choice').first()).toBeVisible({ timeout: 9000 });
  expect(await page.locator('.hqz-flash').count()).toBe(0);
  expect(errs).toEqual([]);
});

test('เฟส 5 ตกค้าง: ทายเสียงมีปุ่มฟังซ้ำ และกดฟังใหม่ได้ไม่จำกัด', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.HouseQuestUI.playTest({ mech: 'soundguess', title: '👂 ทายเสียง' }));
  const btn = page.locator('.hqz-sound-btn');
  await expect(btn).toBeVisible();
  /* กดซ้ำหลายครั้งต้องไม่พัง และปุ่มต้องยังกดได้อยู่ (ห้ามล็อกหลังฟังครบ N ครั้ง) */
  for (let i = 0; i < 3; i++) { await btn.click(); await page.waitForTimeout(120); }
  await expect(btn).toBeEnabled();
  await expect(page.locator('.hqz-choice').first()).toBeVisible();
  expect(errs).toEqual([]);
});

test('เฟส 6-7: ค่าตอบแทนฐานไม่เปลี่ยน · ต่างกันตามชั้นไม่เกิน 15% · จำนวนข้อไม่มีผลกับเงิน', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const q = window.HouseQuests;
    const npc = [1,2,3].map(s => q.coinsFor('A', s, 1, false));
    const board = [1,2,3].map(s => q.coinsFor('board', s, 1, false));
    const fam = [1,2,3].map(s => q.coinsFor('family', s, 1, false));
    /* ⚠️ เฟส 10 ใส่ตัวคูณระดับชั้นกลับมา (1.00-1.15 · ข้อ 45.8) ⇒ ไม่เท่ากันเป๊ะอีกต่อไป
       แต่ยังต้องต่างกันไม่เกิน 15% และไล่ขึ้นตามชั้นเสมอ **ห้ามลบเทสนี้ทิ้ง** */
    const perTier = [1,2,3,4,5,6].map(t => q.coinsFor('A', 3, t, false));
    return { npc, board, fam, perTier };
  });
  expect(r.npc).toEqual([6, 8, 10]);
  expect(r.board).toEqual([8, 10, 13]);
  expect(r.fam).toEqual([10, 13, 16]);
  expect(Math.max.apply(null, r.perTier) / Math.min.apply(null, r.perTier),
    'ต่างกันได้ไม่เกิน 15%').toBeLessThanOrEqual(1.15 + 1e-9);
  for (let i = 1; i < r.perTier.length; i++)
    expect(r.perTier[i]).toBeGreaterThanOrEqual(r.perTier[i - 1]);
  expect(errs).toEqual([]);
});
