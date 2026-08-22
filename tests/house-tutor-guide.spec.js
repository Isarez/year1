/* ============================================================
   🎓 บทเรียนสอนเล่น — ลูกศรบอกทาง · บอกจุดที่ต้องแตะ · ทัวร์ร้านค้า (2026-08-21)

   ผู้ใช้สั่ง 3 ข้อ:
     ① เดินไปที่ต่างๆ ต้องมี **ลูกศรบอกทาง** (วงแหวนที่ปลายทางไม่พอ เพราะร้านอยู่นอกจอ)
     ② ถึงแล้วต้องบอกว่า **ให้แตะตรงไหน**
     ③ **พาเดินไปทีละร้าน** บอกว่าขายอะไร อยู่ตรงไหนของเมือง และ
        **แตะตัวร้านหรือแตะคนขายก็เปิดได้เหมือนกัน**
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id:'tg1', name:'น้องเรียน', emoji:'🦉', birthDate:'2019-05-02', grade:'p1' };

async function house(page){
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({ v:1, mapV:4, worldSeeded:true,
      char:{gender:0, hair:0, hairC:0, eyes:1, eyeC:0, shirt:5, bottom:0, shoes:0} }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('.h2-mode-house, .h2-create').first().click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 90000 });
  await page.waitForTimeout(800);
  return errs;
}

test('TG1: บททัวร์ร้านค้าครบทุกร้าน · ทุกขั้นเดินมีข้อความ "ถึงแล้วแตะตรงไหน" · ทุกขั้นมีคำอธิบาย', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseTutorSteps;
    const tour = S.chapters.filter(c => c.id.indexOf('cshop') === 0);
    const lots = [];
    const noArrive = [], noNote = [];
    S.chapters.forEach(c => c.steps.forEach((s, i) => {
      if(s.k === 'goto' && !s.arrive) noArrive.push(c.id + '#' + i);
      if(s.k !== 'grant' && !s.note)  noNote.push(c.id + '#' + i);
    }));
    /* ร้านที่ทัวร์พาไป — ดูจากขั้น await ที่รอให้เปิดร้าน (ขั้นละร้าน) */
    tour.forEach(c => c.steps.forEach(s => {
      if(s.k === 'await' && s.at){ const t = s.at(); if(t) lots.push(s.text); }
    }));
    return {
      chapters: S.chapters.map(c => c.id),
      tourN: tour.length,
      shops: lots.length,
      noArrive, noNote,
    };
  });
  expect(r.tourN, 'ต้องมีบททัวร์ร้านค้า').toBeGreaterThan(0);
  expect(r.shops, 'ต้องพาไปครบ 7 ร้าน').toBe(7);
  expect(r.noArrive, 'ขั้นเดินทุกขั้นต้องบอกว่าถึงแล้วให้แตะตรงไหน').toEqual([]);
  expect(r.noNote, 'ทุกขั้นต้องมีคำอธิบายประกอบ').toEqual([]);
  /* ทัวร์ต้องมาก่อนบทปลูกผัก/ตกปลา — เด็กควรรู้จักเมืองก่อน */
  expect(r.chapters.indexOf('cshop1')).toBeLessThan(r.chapters.indexOf('c2'));
  expect(errs).toEqual([]);
});

test('TG2: ลูกศรบอกทาง — ใช้ลูกศรตัวเดียวกับเกมเก็บของ (โคจรรอบตัวเด็ก) ไม่ใช่ลูกศรบนหัว', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => {
    window.HouseTutor.begin('cshop1');
    window.HouseTutor.force(); window.HouseTutor.force();   /* ข้าม 2 ขั้นพูดล้วน */
  });
  await page.waitForTimeout(1500);
  const far = await page.evaluate(() => {
    const el = document.getElementById('house-qarrow');
    const b = el && !el.hidden ? el.getBoundingClientRect() : null;
    const c = window.__houseDbg.charScreen ? window.__houseDbg.charScreen() : null;
    return { step: window.HouseTutor.state(), shown: !!b,
             box: b ? {x:Math.round(b.left + b.width/2), y:Math.round(b.top + b.height/2)} : null,
             goal: window.__houseDbg.guideGoal() };
  });
  expect(far.step.k, 'ต้องอยู่ขั้นเดิน').toBe('goto');
  expect(far.shown, 'อยู่ไกลต้องมีลูกศรนำทาง').toBe(true);
  expect(far.goal, 'บทเรียนต้องสั่งเป้าหมายให้ลูกศรได้').not.toBeNull();

  /* 🔒 ต้องไม่มีลูกศร 3 มิติลอยเหนือหัวเด็กอีกแล้ว (ผู้ใช้สั่งให้เอาออก 2026-08-21) */
  const src = await (await page.request.get('/js/house.js')).text();
  expect(src, 'ห้ามมีลูกศร 3 มิติกลับมา').not.toContain('function guideMake(');
  expect(src, 'ต้องใช้ลูกศรโคจรรอบตัวเด็กตัวเดิม').toContain('QARROW_R');

  /* วาร์ปไปยืนติดร้าน → ลูกศรต้องหายไป */
  await page.evaluate(() => {
    const w = window.HouseWorld, g = w.lotDoor('mall-furniture');
    const n = w.nearWalkable(g.x, g.z);
    window.__houseDbg.tp(n.x, n.z);
  });
  await page.waitForTimeout(1200);
  const near = await page.evaluate(() => {
    const el = document.getElementById('house-qarrow');
    return !!(el && !el.hidden);
  });
  expect(near, 'ใกล้ถึงแล้วต้องไม่มีลูกศร').toBe(false);
  expect(errs).toEqual([]);
});

test('TG2b: กดข้ามบทเรียน → ลูกศรต้องหายไปด้วย', async ({ page }) => {
  await house(page);
  await page.evaluate(() => {
    window.HouseTutor.begin('cshop1');
    window.HouseTutor.force(); window.HouseTutor.force();
  });
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => !document.getElementById('house-qarrow').hidden),
    'ก่อนข้ามต้องมีลูกศร').toBe(true);
  await page.evaluate(() => window.HouseTutor.skipAll());
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => ({
    arrow: !document.getElementById('house-qarrow').hidden,
    goal: window.__houseDbg.guideGoal(),
    say: !document.getElementById('house-tut-say').hidden,
  }));
  expect(r.arrow, 'ข้ามบทเรียนแล้วลูกศรต้องหาย').toBe(false);
  expect(r.goal, 'เป้าหมายของบทเรียนต้องถูกล้าง').toBeNull();
});

test('TG3: ถึงร้านแล้วต้องเด้งข้อความบอกว่าแตะตรงไหน แล้วไปขั้น "เปิดร้าน"', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => {
    window.HouseTutor.begin('cshop1');
    window.HouseTutor.force(); window.HouseTutor.force();
  });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const w = window.HouseWorld, g = w.lotDoor('mall-furniture');
    const n = w.nearWalkable(g.x, g.z);
    window.__houseDbg.tp(n.x, n.z);
  });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    toast: (document.getElementById('toast-msg') || {}).textContent || '',
    step: window.HouseTutor.state(),
    text: (window.HouseTutor.stepNow() || {}).text,
  }));
  expect(r.toast, 'ต้องบอกว่าแตะที่ตัวร้านหรือแตะคนขายก็ได้').toContain('แตะ');
  expect(r.toast).toContain('คนขาย');
  expect(r.step.k, 'ขั้นถัดไปคือให้เปิดร้านดู').toBe('await');
  expect(r.text).toContain('เปิด');
  expect(errs).toEqual([]);
});

test('TG4: ขั้น "เปิดร้าน" ผ่านได้ทั้งแตะตัวร้านและแตะคนขาย (ไม่ผูกกับวัตถุชิ้นเดียว)', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => {
    window.HouseTutor.begin('cshop1');
    window.HouseTutor.force(); window.HouseTutor.force(); window.HouseTutor.force();
  });
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => window.HouseTutor.state());
  expect(before.k, 'ต้องอยู่ขั้นรอเปิดร้าน').toBe('await');
  /* เปิดร้านผ่าน API เดียวกับที่ทั้งการแตะตัวร้านและแตะคนขายเรียกใช้ */
  await page.evaluate(() => window.HouseShop.open('mall-furniture'));
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => window.HouseTutor.state());
  expect(after.i, 'เปิดร้านแล้วต้องไปขั้นถัดไป').toBeGreaterThan(before.i);
  expect(errs).toEqual([]);
});

test('TG5: คำบอกทำเลของร้านต้องคำนวณจากผังจริง ไม่ว่างเปล่า และไม่ซ้ำกันทุกร้าน', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseTutorSteps;
    const tour = S.chapters.filter(c => c.id.indexOf('cshop') === 0);
    const notes = [];
    tour.forEach(c => c.steps.forEach(s => {
      if(s.k === 'goto' && typeof s.note === 'function') notes.push(s.note());
    }));
    return { notes, uniq: new Set(notes).size };
  });
  expect(r.notes.length, 'ต้องมีขั้นเดินครบ 7 ร้าน').toBe(7);
  r.notes.forEach(n => {
    expect(n, 'ต้องบอกทำเลในเมือง').toContain('ของเมือง');
    expect(n.length).toBeGreaterThan(15);
  });
  /* ร้านกระจายอยู่คนละมุมเมือง คำบอกทำเลจึงต้องไม่เหมือนกันหมด */
  expect(r.uniq, 'คำบอกทำเลต้องต่างกันตามร้าน').toBeGreaterThan(3);
});

test('TG6: บทเรียนต้องครอบคลุมของที่เด็กใช้ทุกวันครบ (รีวิว 2026-08-21)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseTutorSteps;
    const els = [], texts = [];
    S.chapters.forEach(c => c.steps.forEach(s => {
      if(s.el) els.push(s.el);
      texts.push(String(s.text || '') + ' ' + String(typeof s.note === 'function' ? '' : (s.note || '')));
    }));
    const all = texts.join(' ');
    return { els, all, chapters: S.chapters.map(c => c.id) };
  });
  /* 🔒 ปุ่ม/ระบบที่ "ไม่รู้แล้วเล่นไม่ได้" — ต้องถูกสอนทุกตัว
     (รีวิวรอบ 2026-08-21 พบว่าเดิมขาด 5 ตัวล่างสุด จึงเพิ่มบท c1b) */
  ['house-coins', 'house-compass', 'house-quest-bar', 'house-play-btn',
   'house-decorate-btn', 'house-parent-btn', 'house-pet-btn',
   'house-edit-btn', 'house-photo-btn', 'house-ctrl-gear'].forEach(id => {
    expect(r.els, 'บทเรียนต้องสอนปุ่ม ' + id).toContain(id);
  });
  /* ระบบที่ต้องถูกพูดถึงอย่างน้อย 1 ครั้ง */
  ['สมุดสะสม', 'ออกจากบ้าน', 'กล้อง', 'ร้านอาหาร', 'ตลาด'].forEach(w => {
    expect(r.all, 'บทเรียนต้องพูดถึง "' + w + '"').toContain(w);
  });
  expect(r.chapters.indexOf('c1b'), 'บทปุ่มต้องมาต่อจากบทแรกทันที')
    .toBe(r.chapters.indexOf('c1') + 1);
  expect(errs).toEqual([]);
});

/* ============================================================
   🎣 ซูมเข้าอัตโนมัติที่จุดตกปลา · 🧭 ลูกศรบอกทางของเควสต์ · 📦 งานส่งของต้องบอกว่าส่งให้ใคร
   (ผู้ใช้สั่ง 2026-08-21)
   ============================================================ */

test('TG7: ยืนจุดตกปลา → ซูมเข้าเองแบบนุ่ม · เดินออก → กลับระยะเดิมเป๊ะ', async ({ page }) => {
  const errs = await house(page);
  const spots = await page.evaluate(() => window.HouseWorld.pondFishSpots().map(s => s.stand));
  expect(spots.length, 'ต้องมีจุดตกปลาในผัง').toBeGreaterThanOrEqual(4);

  /* ตั้งซูมเป็นค่าที่ "ไม่ใช่ค่าเริ่มต้น" เพื่อพิสูจน์ว่าคืนค่าเดิมจริง ไม่ใช่รีเซ็ตเป็น 1 */
  await page.evaluate(() => { window.__houseDbg.tp(21, 37); });
  await page.waitForTimeout(400);
  const base = await page.evaluate(() => window.__houseDbg.zoom());

  for(const st of spots){
    await page.evaluate(s => window.__houseDbg.tp(s.x, s.z), st);
    /* ต้องไล่เข้าแบบนุ่ม ไม่ใช่กระโดดทันทีในเฟรมเดียว */
    await page.waitForTimeout(120);
    const mid = await page.evaluate(() => window.__houseDbg.zoom());
    /* ⏱ เครื่องเทสวาดได้ ~3 fps และช้าลงอีก 2-3 เท่าตอนรันหลายไฟล์พร้อมกัน
       การไล่ค่าซูมกิน ~13 เฟรม ⇒ ต้องเผื่อเวลาเยอะ ไม่งั้นแดงแบบสุ่มเวลาเครื่องโดนแย่ง CPU */
    await page.waitForFunction(() => window.__houseDbg.zoom() > 1.45, null, { timeout: 40000 });
    const zin = await page.evaluate(() => window.__houseDbg.zoom());
    expect(zin, 'จุด ' + st.x + ',' + st.z + ' ต้องซูมเข้า').toBeGreaterThan(1.45);
    expect(mid, 'ห้ามกระโดดถึงค่าปลายทางในเฟรมเดียว').toBeLessThan(zin);

    await page.evaluate(() => window.__houseDbg.tp(21, 37));
    await page.waitForFunction(z => Math.abs(window.__houseDbg.zoom() - z) < .002, base, { timeout: 40000 });
  }
  const back = await page.evaluate(() => window.__houseDbg.zoom());
  expect(Math.abs(back - base), 'เดินออกแล้วต้องกลับระยะเดิมก่อนซูมเข้า').toBeLessThan(.02);
  expect(errs).toEqual([]);
});

test('TG8: เด็กปรับซูมเองระหว่างอยู่บนท่า = ระบบอัตโนมัติต้องหยุดคุมทันที', async ({ page }) => {
  await house(page);
  const st = await page.evaluate(() => window.HouseWorld.pondFishSpots()[0].stand);
  await page.evaluate(s => window.__houseDbg.tp(s.x, s.z), st);
  await page.waitForFunction(() => window.__houseDbg.zoom() > 1.45, null, { timeout: 40000 });
  /* หมุนล้อเมาส์ = คนสั่งเอง ⇒ ต้องปล่อยการควบคุม */
  await page.mouse.move(400, 400);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => ({ z: window.__houseDbg.zoom(), fz: window.__houseDbg.fishZoom() }));
  expect(r.fz.want, 'ต้องเลิกไล่ค่าอัตโนมัติ').toBe(0);
  expect(r.z, 'ค่าที่คนตั้งต้องคงอยู่ ไม่ถูกดึงกลับ').toBeLessThan(1.5);
});

test('TG9: งานส่งของต้องบอกว่าส่งให้ใคร ที่ไหน (ทั้งบนการ์ดและแถบคำใบ้)', async ({ page }) => {
  const errs = await house(page);
  /* 🐞 บั๊กจริงที่ผู้ใช้แจ้ง 2026-08-21: การ์ดขึ้นว่า "ช่วยเอากระเป๋าไปส่งให้หน่อยได้ไหม?"
     แล้วจบ — ไม่บอกว่าส่งให้ใคร · ตัวกลไกไม่รู้จักผังเมือง ส่งมาแค่ `toNpc`
     แล้วเขียนคอมเมนต์ว่า "หน้าจอต่อท้ายชื่อ+สถานที่" **แต่ฝั่งหน้าจอไม่เคยทำ** */
  const mech = await page.evaluate(() => {
    const Q = window.HouseQuests, dbg = window.__houseDbg;
    const def = dbg.npcDefs()[0];
    const it = Q.testRun ? null : null;
    return { hasDeliver: !!(Q.mechList ? Q.mechList().indexOf('deliver') >= 0 : true) };
  });
  expect(mech.hasDeliver).toBe(true);
  const src = await (await page.request.get('/js/house.js')).text();
  expect(src, 'การ์ดรับงานต้องบอกว่าส่งให้ใคร').toContain("'ส่งให้ ' + info.name + ' ที่ ' + info.place");
  expect(src, 'แถบคำใบ้ต้องเติมชื่อคนปลายทาง').toContain("walkQuest.target === 'npc' && walkQuest.toNpc");
  expect(errs).toEqual([]);
});

test('TG10: ลูกศรบอกทางใช้กับเควสต์ที่ต้องเดินด้วย (ไม่ใช่เฉพาะบทเรียน)', async ({ page }) => {
  const errs = await house(page);
  /* ลูกศรตัวเดียวกับบทเรียน — ตรวจว่ามันรู้จักเป้าหมายของเควสต์เดินครบทุกแบบ */
  const src = await (await page.request.get('/js/house.js')).text();
  expect(src, 'ลูกศรต้องรู้จักเป้าหมายของเควสต์เดิน').toContain('function questGuideTile()');
  expect(src, 'ต้องรองรับงานส่งของ').toContain("walkQuest.target === 'npc') return npc()");
  expect(src, 'ต้องรองรับงานไปร้านสะดวกซื้อ').toContain("walkQuest.target === 'mart'");
  expect(src, 'ต้องรองรับงานตกปลาแล้วเอาไปส่ง').toContain("walkQuest.target === 'catch'");
  expect(src, 'บทเรียนต้องสั่งทับเป้าหมายได้').toContain('if(guideForce) return goTo(guideForce)');
  expect(errs).toEqual([]);
});

test('TG11: ไล่ตรวจทุกกลไกที่ต้องเดิน — ต้องบอกจุดหมายครบ และ "ทายว่าใคร" ต้องไม่เฉลยชื่อ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const rows = [];
    (Q.MECH_IDS || []).forEach(id => {
      let run = null;
      try { run = Q.testRun({mech:id, gid:'p4', seed:7}); } catch(e){ return; }
      const it = run && run.items && run.items[0];
      if(!it || it.kind !== 'walk') return;
      rows.push({id, target:it.target || '', toNpc:it.toNpc || '', whois:!!it.whois,
                 q:it.q || '', hint:it.hint || ''});
    });
    return rows;
  });
  expect(r.length, 'ต้องมีกลไกแบบเดินหลายตัว').toBeGreaterThanOrEqual(10);

  /* 🎯 งานที่ปลายทางเป็น "ตัวคน" ต้องมีคนปลายทางจริงเสมอ (ไม่งั้นเดินไปหาใครไม่ได้) */
  r.filter(x => x.target === 'npc').forEach(x => {
    expect(x.toNpc, x.id + ': ต้องระบุคนปลายทาง').not.toBe('');
  });

  /* 🐞 บั๊กจริงที่ผู้ใช้แจ้ง 2026-08-21: `deliver` เป็นตัวเดียวที่ข้อความไม่บอกปลายทางเลย
     ⇒ หน้าจอต้องเติมชื่อ+สถานที่ให้ · ส่วน `whois` ตั้งใจไม่บอก (เป็นปริศนา) */
  const del = r.find(x => x.id === 'deliver');
  expect(del, 'ต้องมีกลไกส่งของ').toBeTruthy();
  expect(del.whois, 'งานส่งของไม่ใช่เกมทายคน').toBe(false);

  const src = await (await page.request.get('/js/house.js')).text();
  expect(src, 'ต้องเติมชื่อปลายทางบนการ์ด').toContain("it.toNpc && !it.whois");
  expect(src, 'เกมทายว่าใครต้องไม่ถูกเฉลยในคำใบ้').toContain("walkQuest.toNpc && !walkQuest.whois");
  expect(errs).toEqual([]);
});

test('TG12: แผงวัดเฟรมเรตต้องโผล่เฉพาะเมื่อใส่ ?fps=1 (เด็กต้องไม่มีวันเห็น)', async ({ page }) => {
  await house(page);
  expect(await page.evaluate(() => !!document.getElementById('house-fps')),
    'ไม่ใส่ธงต้องไม่มีแผง').toBe(false);
  /* 🔒 จงใจไม่ผูกกับสวิตช์ DEV_ENABLED — สวิตช์ชุดนั้นต้องเป็น false เสมอตอน deploy
     ถ้าผูกไว้จะวัดบนเครื่องจริงไม่ได้เลย */
  const src = await (await page.request.get('/js/house.js')).text();
  expect(src, 'ต้องเปิดด้วย URL param').toContain("get('fps') === '1'");
  expect(src, 'ต้องแยกเวลา JS ออกจากเวลาส่งวาด').toContain('fpsPanelTick(_fpsDt');
});

/* ============================================================
   🖼️ พรีวิวในร้าน · 🌓 เงาบนเครื่องจอสัมผัส · 🐾 บทเรียนห้ามพาไปร้านเดิมซ้ำ (2026-08-22)
   ============================================================ */

test('TG13: พรีวิวตัวละครต้องหมุนรอบแกนลำตัว ไม่ใช่โคจรรอบกล่องครอบ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const d = window.__houseDbg;
    /* ใส่ของถือ/กระเป๋า/หมวก ที่ยื่นออกไปข้างเดียว — เคสที่ทำให้จุดหมุนเพี้ยน */
    const fit = d.previewOpen({kind:'fit', row:'shirt', i:3});
    const posFit = d.previewPos();
    d.previewOpen({kind:'furn', id:'sofa'});
    const posFurn = d.previewPos();
    return {fit, posFit, posFurn};
  });
  expect(r.fit, 'ต้องเปิดพรีวิวได้').toBe(true);
  /* 🐞 ผู้ใช้แจ้ง 2026-08-22: ของถือ/กระเป๋ายื่นออกข้างเดียว ⇒ กลาง "กล่องครอบ" ไม่ใช่กลางตัว
     พอเอากลางกล่องไปวางที่จุดหมุน ตัวเด็กเลยโคจรรอบที่ว่างข้างตัวแทนที่จะหมุนอยู่กับที่ */
  expect(r.posFit.x, 'ตัวละครต้องอยู่ที่แกนหมุนพอดี (x)').toBe(0);
  expect(r.posFit.z, 'ตัวละครต้องอยู่ที่แกนหมุนพอดี (z)').toBe(0);
  /* ของทั่วไปยังจัดกึ่งกลางจากกล่องครอบเหมือนเดิม (ทรงสมมาตร ไม่มีปัญหานี้) */
  expect(r.posFurn, 'ของตกแต่งต้องยังใช้วิธีเดิม').not.toBeNull();
  expect(errs).toEqual([]);
});

test('TG14: บทเรียนห้ามพาเดินไปที่เดิมซ้ำโดยไม่มีอะไรให้ทำ', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseTutorSteps;
    const trips = {};
    S.chapters.forEach(c => c.steps.forEach((s, i) => {
      if(s.k !== 'goto' || typeof s.at !== 'function') return;
      const t = s.at();
      if(!t) return;
      const nx = c.steps[i + 1] || {};
      /* "มีอะไรให้ทำที่นั่น" = ขั้นถัดไปเป็น action จริง (เปิดร้าน/ซื้อของ/กดปุ่ม)
         ถ้าเดินไปแล้วขั้นถัดไปเป็นแค่คำพูด = เดินไปเปล่าๆ */
      const useful = nx.k === 'await' || nx.k === 'tapUI' || nx.k === 'tapWorld';
      const k = t.x + ',' + t.z;
      (trips[k] = trips[k] || []).push({ch:c.id, useful});
    }));
    /* 🐞 ผู้ใช้แจ้ง 2026-08-22: ทัวร์ร้านค้าพาไปร้านสัตว์แล้ว บท c4 พาไปยืนดูเฉยๆ อีกรอบ
       ⚠ **ไปที่เดิมซ้ำไม่ผิดเสมอไป** — ห้างเฟอร์นิเจอร์ถูกไป 2 รอบ (บท 1 ไปซื้อของ ·
         ทัวร์ไปดูว่าขายอะไร) ทั้ง 2 รอบมีงานให้ทำจริง ถือว่าโอเค
       ⇒ ที่ผิดคือ **ไปซ้ำแล้วรอบนั้นไม่มีอะไรให้ทำเลย** */
    return Object.keys(trips)
      .filter(k => trips[k].length > 1 && trips[k].some(v => !v.useful))
      .map(k => k + ' ← ' + trips[k].map(v => v.ch + (v.useful ? '' : '(ไปเปล่า)')).join(' + '));
  });
  expect(r, 'เดินไปที่เดิมซ้ำโดยไม่มีอะไรให้ทำ').toEqual([]);
});

test('TG15: เครื่องจอสัมผัสต้องใช้เงาแบบเบา แต่ห้ามปิดเงา', async ({ page }) => {
  await house(page);
  const src = await (await page.request.get('/js/house.js')).text();
  /* 🔒 ผู้ใช้ยืนยัน 2026-08-22: **ห้ามปิดเงา** — ลดต้นทุนได้ แต่เงาต้องอยู่ */
  expect(src, 'ต้องยังเปิด shadowMap').toContain('renderer.shadowMap.enabled = true');
  expect(src, 'จอสัมผัสใช้ตัวกรองเงาแบบเบา').toContain("isTouchDevice() ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap");
  /* 🔒 **ห้ามหรี่การอัปเดตเงาเป็นเว้นเฟรมอีก** (ผู้ใช้แจ้ง 2026-08-22: บน iPad จริงเห็นเงากระตุก)
     เงาต้องอัปเดตทุกเฟรมตามค่าเริ่มต้นของ three — ที่ลดต้นทุนได้คือ "ตัวกรองเงา" เท่านั้น */
  expect(src, 'ห้ามปิด autoUpdate ของ shadowMap').not.toContain('shadowMap.autoUpdate = false');
  expect(src, 'ห้ามหรี่เงาเว้นเฟรม').not.toContain('shadowOdd');
  /* iPad กว้าง 810-1024 ⇒ ห้ามตัดสินจากความกว้างจอ */
  expect(src, 'ต้องดูจากความสามารถเครื่อง ไม่ใช่ความกว้างจอ').toContain("matchMedia('(pointer: coarse)')");
});
