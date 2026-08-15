/* ============================================================
   เฟส 12.1 — ของเล่นสัตว์เลี้ยง (ข้อ 50 ของ QUEST-DESIGN.md)
   🪢 เชือกดึง · 🪶 ไม้ล่อขนนก · 🥏 จานร่อน · 🧸 ตุ๊กตาผ้า · 🫧 ฟองสบู่ · 🛟 ห่วงกระโดด · 🛝 สไลเดอร์

   ⚠ กติกาที่ชุดนี้คุมไว้ (ห้ามลดหย่อนโดยไม่ถามผู้ใช้):
     1. **ทุกชิ้นต้องมีท่าเล่นของตัวเอง** — ผู้ใช้สั่งไว้ตรงๆ ห้ามให้ทุกชิ้นวิ่งท่าลูกบอลเส้นเดียวกัน
     2. **แต้มความสุขต้องมาจาก gain ของชิ้นนั้นจริงๆ** ไม่ใช่ BALL_GAIN ที่ฮาร์ดโค้ดไว้
        (เฟส 12 ทิ้ง PETCARE.toyPlayed() ไว้แต่ไม่มีใครเรียกเลยสักจุด)
     3. **ไม่ให้เหรียญสักบาท** — ของเล่นเป็น money sink ล้วน จ่ายเป็นความสุขอย่างเดียว
     4. **ห้ามมี dead end** — ของเล่นที่หา spec ไม่เจอต้องถอยไปเล่นท่าลูกบอล ไม่ใช่เงียบไปเฉยๆ
     5. **ของในฉากต้องถูกเก็บกวาดตอนจบท่า** ไม่ค้างข้ามรอบการเล่น
     6. **ท่าเด็กห้ามล้ำเพดาน** — เอนไม่เกิน .26 rad (ไม่งั้นเห็นเป็นล้มคว่ำ) · แขนไม่เลย 2.0 rad
        (กล้อง isometric มองลงจากบนหัว มือที่สูงกว่านั้นหลบหลังหัวจนมองไม่เห็น)
     7. **ราคาต้องไล่ขึ้นตามคุณค่า** และของแถมฟรีต้องยังฟรีอยู่
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'p121', name: 'ปั้นหยา', emoji: '🐰', birthDate: '2019-03-02', grade: 'p2' };

/* เด็กที่มีน้องอยู่แล้ว + ปลดล็อกของเล่นครบทุกชิ้น (ซื้อทีละชิ้นในเทสช้าและไม่ได้ทดสอบอะไรเพิ่ม) */
async function house(page, unlockAll) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(c => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({
      v: 1, mapV: 4, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 },
      pet: { type: 'dog', color: 0, name: 'ปุยฝ้าย' },
    }));
  }, CHILD);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HousePetCare && !!window.HouseShop, null, { timeout: 30000 });
  if (unlockAll) {
    /* ซื้อผ่าน buyToy() เส้นเดียวกับที่เด็กกดในร้านจริง (ไม่ใช้ทางลัด devUnlockAll)
       ⇒ ได้ทดสอบทางจ่ายเงิน/เช็คสิทธิ์ไปด้วยในตัว */
    await page.evaluate(() => {
      const S = window.HouseShop;
      window.OwlCoins.set(99999);
      S.PET_TOYS.forEach(t => { if (!t.free && !S.ownsToy(t.id)) S.buyToy(t.id); });
    });
  }
  return errs;
}

/* รอให้ท่าปัจจุบันเล่นจบ
   ⚠ **วัดจริงแล้วเครื่องเทสวาดได้ ~3 fps** (WebGL ซอฟต์แวร์) + engine clamp dt ที่ 50ms/เฟรม
     ⇒ ท่ายาว 4.5 วิ "ในเกม" กินนาฬิกาจริงราว 30 วิ · ปล่อยให้เดินเองครบทั้ง 8 ชิ้น = 4 นาที/เทส
   ⇒ ปล่อยให้เดินเองช่วงต้น (ได้เห็นว่าของถูกสร้างจริง) แล้ว **กรอไปใกล้จบ** ให้ช่วงจ่ายความสุข
     + เก็บกวาดของทำงานตามปกติ · ห้ามนอนรอเป็นวินาทีเด็ดขาด เทสจะแดงแบบสุ่มบนเครื่องที่ช้ากว่า */
async function waitActEnd(page) {
  await page.evaluate(() => {
    const D = window.__houseDbg, dur = D.petActDur();
    if (dur > 0) D.petActSeek(Math.max(0, dur - 0.3));
  });
  await page.waitForFunction(() => !window.__houseDbg.petAct(), null, { timeout: 40000 });
}

/* ---------------------------------------------------------------- */

test('เฟส 12.1A: คลังของเล่น — 8 ชิ้น (ฟรี 1 + ซื้อ 7) ราคาไล่ขึ้น · gain อยู่ในกรอบ 6-10', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => window.HouseShop.PET_TOYS.map(t => ({
    id: t.id, price: t.price, gain: t.gain | 0, free: !!t.free, emoji: t.emoji, name: t.name, sub: t.sub,
  })));

  expect(r.length, 'ของเล่นต้องครบ 8 ชิ้น').toBe(8);
  expect(r.filter(t => t.free).length, 'ของแถมฟรีต้องมี 1 ชิ้น (ลูกบอล)').toBe(1);
  expect(r[0].id).toBe('ball');
  expect(r[0].price).toBe(0);

  /* id / emoji / ชื่อ ห้ามซ้ำ — ซ้ำแล้วเด็กแยกไม่ออกว่ากดชิ้นไหน */
  ['id', 'emoji', 'name'].forEach(k => {
    expect(new Set(r.map(t => t[k])).size, k + ' ห้ามซ้ำ').toBe(r.length);
  });
  /* ทุกชิ้นต้องมีคำอธิบายว่าเล่นยังไง (เด็ก 5 ขวบดูจากรูป+คำสั้นๆ ไม่ได้อ่านยาว) */
  r.forEach(t => expect(t.sub && t.sub.length, t.id + ' ต้องมีคำอธิบาย').toBeGreaterThan(4));

  const paid = r.filter(t => !t.free);
  expect(paid.length).toBe(7);
  paid.forEach(t => {
    expect(t.gain, t.id + ' gain ต้องอยู่ในกรอบ 6-10 ที่ผู้ใช้กำหนด').toBeGreaterThanOrEqual(6);
    expect(t.gain).toBeLessThanOrEqual(10);
  });
  /* ราคาไล่ขึ้นเรื่อยๆ และแต้มความสุขห้ามสวนทางกับราคา (แพงกว่าแล้วได้น้อยกว่า = เด็กเสียเปรียบ) */
  for (let i = 1; i < paid.length; i++) {
    expect(paid[i].price, 'ราคาต้องไล่ขึ้น').toBeGreaterThan(paid[i - 1].price);
    expect(paid[i].gain).toBeGreaterThanOrEqual(paid[i - 1].gain);
  }
  /* 💰 เพดานราคา — ของเล่นไม่คืนเป็นเงิน ถ้าแพงกว่านี้จะไปแย่งงบของแต่งบ้าน
     (รายได้เด็ก ~206-237 🪙/วัน · สัตว์ตัวถูกสุด 250) */
  expect(paid[paid.length - 1].price, 'ชิ้นแพงสุดห้ามเกิน 400').toBeLessThanOrEqual(400);
  const total = paid.reduce((s, t) => s + t.price, 0);
  expect(total, 'ราคารวมทั้งชุดควรอยู่ราว 8-10 วันของรายได้').toBeLessThanOrEqual(2200);
  expect(errs).toEqual([]);
});

test('เฟส 12.1B: ของเล่นที่ซื้อได้ทุกชิ้นต้องมี spec ท่าเล่นของตัวเอง และสร้างโมเดล 3D ได้จริง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const S = window.HouseShop, D = window.__houseDbg;
    const specs = D.petToySpecs();
    const out = { specs, missing: [], built: {}, dur: {}, poses: {} };
    S.PET_TOYS.forEach(t => {
      if (t.id === 'ball') return;                  /* ลูกบอลใช้ท่าเดิมของเฟส 12 ใน house.js */
      if (specs.indexOf(t.id) < 0) { out.missing.push(t.id); return; }
      let n = 0;
      try {
        const g = D.buildPetToy(t.id);
        g.traverse(o => { if (o.isMesh) n++; });
      } catch (e) { n = -1; }
      out.built[t.id] = n;
    });
    return out;
  });

  expect(r.missing, 'ของเล่นที่ซื้อได้ทุกชิ้นต้องมีท่าประจำ ห้ามตกหล่น').toEqual([]);
  Object.keys(r.built).forEach(id => {
    expect(r.built[id], id + ' ต้องสร้างโมเดลได้และมี mesh จริง').toBeGreaterThan(0);
  });
  expect(errs).toEqual([]);
});

test('เฟส 12.1C: ท่าเด็กของแต่ละชิ้นต้องต่างกันจริง และไม่ล้ำเพดานเอน/ยกแขน', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const D = window.__houseDbg;
    const kinds = D.poseKinds();
    const sig = {}, bad = [];
    kinds.forEach(k => {
      const frames = [];
      for (let i = 0; i <= 10; i++) {
        const p = D.poseAt(k, i / 10);
        frames.push([p.lean, p.legX, p.hop, p.aL, p.aR, p.zL, p.zR].map(v => Math.round(v * 100) / 100).join(','));
        if (Math.abs(p.lean) > 0.261) bad.push(k + ' lean ' + p.lean);
        /* แขนยกไปข้างหน้า = ค่าลบ · เกิน 2.0 rad = มือหลบหลังหัวจนมองไม่เห็น */
        if (p.aL < -2.001 || p.aR < -2.001) bad.push(k + ' arm ' + Math.min(p.aL, p.aR));
        if (!isFinite(p.lean + p.legX + p.hop + p.aL + p.aR + p.zL + p.zR)) bad.push(k + ' NaN');
      }
      sig[k] = frames.join('|');
    });
    return { kinds, sigs: Object.keys(sig).map(k => sig[k]), bad };
  });

  expect(r.kinds.length, 'ต้องมีท่าใหม่ครบ 7 ท่า (ชิ้นละท่า)').toBe(7);
  expect(r.bad, 'ท่าต้องไม่ล้ำเพดานที่ล็อกไว้').toEqual([]);
  expect(new Set(r.sigs).size, 'ท่าทั้ง 7 ต้องไม่ซ้ำกันเลยสักคู่').toBe(r.kinds.length);
  expect(errs).toEqual([]);
});

test('เฟส 12.1D: เล่นครบทุกชิ้นในโลก 3D — ท่าเริ่มจริง ของถูกวางในฉาก แล้วเก็บกวาดตอนจบ', async ({ page }) => {
  const errs = await house(page, true);
  const ids = await page.evaluate(() => window.HouseShop.ownedToys().map(t => t.id));
  expect(ids.length, 'ต้องปลดล็อกของเล่นครบ 8 ชิ้นก่อนเริ่มเทส').toBe(8);

  for (const id of ids) {
    const started = await page.evaluate(i => {
      window.HousePetCare.setHappy(50);            /* กันชนก่อนเพดาน 100 ทุกรอบ */
      return { ok: window.__houseDbg.petPlayToy(i), kind: window.__houseDbg.petAct(),
               arg: window.__houseDbg.petActArg() };
    }, id);
    expect(started.ok, id + ' ต้องเริ่มท่าได้').toBe(true);
    expect(started.arg, id + ' ต้องจำได้ว่าเล่นของชิ้นไหน').toBe(id);
    expect(started.kind, id + ' ต้องเข้าท่าที่ถูกต้อง').toBe(id === 'ball' ? 'ball' : 'toy');

    /* ระหว่างเล่นต้องมีของโผล่ในฉากจริง (ทุกชิ้นสร้าง prop อย่างน้อย 1 ก้อน) */
    const props = await page.evaluate(() => window.__houseDbg.petActProps());
    expect(props, id + ' ต้องมีของในฉากระหว่างเล่น').toBeGreaterThan(0);

    await waitActEnd(page);
    const after = await page.evaluate(() => ({
      act: window.__houseDbg.petAct(), props: window.__houseDbg.petActProps(),
      rest: window.__houseDbg.petRest(),
    }));
    expect(after.act, id + ' เล่นจบแล้วต้องออกจากท่า').toBeFalsy();
    expect(after.props, id + ' ของในฉากต้องถูกเก็บกวาดหมด').toBe(-1);
    expect(after.rest.rest, id + ' เล่นจบแล้วน้องต้องกลับมาเดินตามปกติ').toBe(false);
  }
  expect(errs).toEqual([]);
});

test('เฟส 12.1E: แต้มความสุขต้องมาจาก gain ของชิ้นนั้น ไม่ใช่ค่าลูกบอลที่ฮาร์ดโค้ดไว้', async ({ page }) => {
  const errs = await house(page, true);
  /* เลือกชิ้นที่ gain ต่างจากลูกบอลชัดๆ (สไลเดอร์ 10 เทียบลูกบอล 6) */
  const info = await page.evaluate(() => {
    const t = window.HouseShop.PET_TOYS.filter(x => x.id === 'pet-slide')[0];
    return { gain: t.gain | 0, ball: window.HousePetCare.BALL_GAIN };
  });
  expect(info.gain).not.toBe(info.ball);

  const before = await page.evaluate(() => {
    window.HousePetCare.setHappy(40);
    window.__houseDbg.petPlayToy('pet-slide');
    return window.HousePetCare.happiness();
  });
  await waitActEnd(page);
  const after = await page.evaluate(() => window.HousePetCare.happiness());

  expect(after - before, 'ความสุขต้องขึ้นเท่ากับ gain ของสไลเดอร์พอดี').toBe(info.gain);
  expect(errs).toEqual([]);
});

test('เฟส 12.1F: ของเล่นไม่จ่ายเหรียญสักบาท (money sink ล้วน)', async ({ page }) => {
  const errs = await house(page, true);
  const c0 = await page.evaluate(() => { window.OwlCoins.set(500); window.HousePetCare.setHappy(40); return window.OwlCoins.get(); });
  await page.evaluate(() => window.__houseDbg.petPlayToy('hoop'));
  await waitActEnd(page);
  const c1 = await page.evaluate(() => window.OwlCoins.get());
  expect(c1, 'เล่นของเล่นแล้วเหรียญต้องไม่ขยับ').toBe(c0);
  expect(errs).toEqual([]);
});

test('เฟส 12.1G: ห้ามมี dead end — ของเล่นที่ไม่มีท่าประจำต้องถอยไปเล่นท่าลูกบอล', async ({ page }) => {
  const errs = await house(page, true);
  const r = await page.evaluate(() => {
    window.HousePetCare.setHappy(40);
    /* จำลองของเล่นที่ยังไม่มีท่า (เช่นไฟล์ท่าโหลดไม่ทัน หรือของใหม่ในอนาคต) */
    const ok = window.__houseDbg.petPlayToy('__ยังไม่มีท่าชิ้นนี้__');
    return { ok, kind: window.__houseDbg.petAct() };
  });
  expect(r.ok, 'ต้องยังเริ่มเล่นได้ ห้ามเงียบไปเฉยๆ').toBe(true);
  expect(r.kind, 'ต้องถอยไปใช้ท่าลูกบอล').toBe('ball');
  await waitActEnd(page);
  expect(errs).toEqual([]);
});

test('เฟส 12.1H: ซื้อของเล่นแล้วต้องโผล่ในเมนูฟองของน้องจริง (ทางเดินที่เด็กใช้จริง)', async ({ page }) => {
  const errs = await house(page, true);
  await page.evaluate(() => { window.HousePetCare.setHappy(80); window.__houseDbg.petTap(); });
  /* หน้าแรกของเมนู: 🤚 ลูบหัว · 🫧 อาบน้ำ · 🎾 เล่นด้วยกัน · 🎪 สอนท่า */
  const btns = page.locator('#house-pet-menu .hpm-btn');
  await expect(btns).not.toHaveCount(0);
  const labels = await btns.allTextContents();
  const playIdx = labels.findIndex(t => t.indexOf('เล่นด้วยกัน') >= 0);
  expect(playIdx, 'ต้องมีปุ่มเล่นด้วยกัน').toBeGreaterThanOrEqual(0);

  await btns.nth(playIdx).click();                 /* มีของเล่นหลายชิ้น = ต้องเข้าหน้าเลือก */
  const toyLabels = await page.locator('#house-pet-menu .hpm-btn').allTextContents();
  const names = await page.evaluate(() => window.HouseShop.ownedToys().map(t => t.name));
  names.forEach(n => {
    expect(toyLabels.join('|'), 'ของเล่นที่ซื้อแล้วต้องโผล่ในเมนู: ' + n).toContain(n);
  });
  expect(errs).toEqual([]);
});

test('เฟส 12.1I: ของเล่นแยกขาดจากคลังเฟอร์นิเจอร์ — ไม่ต้องหาที่วาง ไม่กินเพดานจำนวนของ', async ({ page }) => {
  const errs = await house(page, true);
  const r = await page.evaluate(() => {
    const S = window.HouseShop;
    const furn = new Set((window.__houseDbg.furn().items || []).map(f => f.id));
    return {
      clash: S.PET_TOYS.map(t => t.id).filter(id => furn.has(id)),
      /* ซื้อของเล่นครบทุกชิ้นแล้ว ต้องไม่มี id ไหนหลุดไปอยู่ใน `owned`
         (คือตารางนับ "จำนวนชิ้นของตกแต่งที่วางได้" — ของเล่นไม่ผ่านโหมดตกแต่งเลย) */
      inOwned: S.PET_TOYS.map(t => t.id).filter(id => {
        const d = JSON.parse(localStorage.getItem('p1quiz_house_' + JSON.parse(
          localStorage.getItem('p1quiz_children'))[0].id) || '{}');
        return !!(d.owned && d.owned[id]);
      }),
    };
  });
  expect(r.clash, 'id ของเล่นห้ามชนกับคลังเฟอร์นิเจอร์').toEqual([]);
  expect(r.inOwned, 'ของเล่นห้ามโผล่ในตารางนับชิ้นของเฟอร์นิเจอร์').toEqual([]);
  expect(errs).toEqual([]);
});
