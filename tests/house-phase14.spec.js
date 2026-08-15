const { test, expect } = require('@playwright/test');

/* ============================================================
   เฟส 14 — เพลงพื้นหลังธีมฟาร์มของโหมดบ้าน (ข้อ 48 ของ QUEST-DESIGN.md)
   + งาน Action จริงชุดที่ 2 + การปิด findsound + การถอด fishmath (คำสั่งผู้ใช้ 2026-08-16)

   จุดที่ต้องไม่พัง:
     1) เข้าเมือง = สลับมาเพลงฟาร์ม · ออกจากเมือง = คืนชุดเดิมของหน้าหลัก (ห้ามค้าง)
     2) สเปกเพลง: 4 เพลง · ~60-75 วิ · 3 ชั้น · sine ล้วน · คีย์ C/F/Am
     3) master ยังเป็น 0.025 (ห้ามดังขึ้น)
     4) หน้าครูใช้ shared/audio.js ร่วม ⇒ ของเดิมต้องไม่เปลี่ยนพฤติกรรม
   ============================================================ */

const CHILD = { id: 'ph14', name: 'เทส14', emoji: '🎵', birthDate: '2018-01-15', grade: 'p3' };
const HKEY = 'p1quiz_house_' + CHILD.id;
const SEED = { v: 1, mapV: 3, char: { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 } };

async function house(page, music) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(([child, hkey, seed, mus]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([child]));
    localStorage.setItem('p1quiz_active_child', child.id);
    localStorage.setItem('p1quiz_music', mus ? 'on' : 'off');
    localStorage.setItem(hkey, JSON.stringify(seed));
  }, [CHILD, HKEY, SEED, !!music]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready && window.__houseDbg.ready(),
    null, { timeout: 30000 });
  return errors;
}

test('🎵 เพลงธีมฟาร์ม: 4 เพลง · ยาว 60-75 วิ · ครบ 3 ชั้น', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const M = window.HouseMusic;
    if (!M) return { missing: true };
    return {
      n: M.TRACKS.length,
      secs: M.seconds(),
      names: M.names(),
      layers: M.TRACKS.map(t => Object.keys(t.layers).sort().join(',')),
      bpm: M.TRACKS.map(t => t.bpm),
    };
  });
  expect(r.missing, 'js/house-music.js ต้องถูกโหลดพร้อมชุดบ้าน').toBeUndefined();
  expect(r.n, 'สเปกกำหนด 4 เพลง').toBe(4);
  r.secs.forEach((s, i) => {
    expect(s, 'เพลง "' + r.names[i] + '" ต้องยาว 60-75 วินาที').toBeGreaterThanOrEqual(58);
    expect(s, 'เพลง "' + r.names[i] + '" ต้องยาว 60-75 วินาที').toBeLessThanOrEqual(78);
  });
  r.layers.forEach((l, i) => expect(l, 'เพลงที่ ' + (i + 1) + ' ต้องมีครบ 3 ชั้น').toBe('bass,chord,lead'));
  /* ทุกเพลงต้องมีจังหวะไม่เท่ากัน ไม่งั้นฟังเป็นเพลงเดียวกันเปลี่ยนทำนอง */
  expect(new Set(r.bpm).size, 'จังหวะของ 4 เพลงต้องไม่ซ้ำกันหมด').toBeGreaterThanOrEqual(3);
  expect(errs).toEqual([]);
});

test('🎵 โน้ตทุกตัวอยู่ในคีย์ C major / F major / A minor และทำนองอยู่ช่วง C4-C6', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const M = window.HouseMusic;
    /* คีย์ที่อนุญาต: C major/A minor = โน้ตขาวล้วน · F major = ขาว + Bb */
    const ok = new Set([130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 233.08, 246.94,
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 493.88,
      523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]);
    const bad = [], outOfRange = [];
    M.TRACKS.forEach((t, ti) => {
      ['lead', 'bass', 'chord'].forEach(k => {
        t.layers[k].forEach(step => {
          const fs = Array.isArray(step[0]) ? step[0] : [step[0]];
          fs.forEach(f => {
            if (f == null) return;
            if (!ok.has(f)) bad.push(ti + ':' + k + ':' + f);
            if (k === 'lead' && (f < 261 || f > 1047)) outOfRange.push(ti + ':' + f);
          });
        });
      });
    });
    return { bad, outOfRange };
  });
  expect(r.bad, 'มีโน้ตนอกคีย์ C major / F major / A minor').toEqual([]);
  expect(r.outOfRange, 'ทำนองต้องอยู่ช่วง C4-C6').toEqual([]);
  expect(errs).toEqual([]);
});

test('🎵 เข้าเมือง = ใช้เพลงฟาร์ม · ออกจากเมือง = คืนชุดเดิมของหน้าหลัก', async ({ page }) => {
  const errs = await house(page, true);
  const r = await page.evaluate(async () => {
    const M = window.HouseMusic;
    const isFarm = () => musicList() === M.TRACKS;
    const inHouse = isFarm();
    /* เรียกซ้ำต้องไม่รีสตาร์ตเพลง (idempotent) */
    const idxBefore = musicTrackIdx, noteBefore = musicNoteIndex;
    M.use(); M.use(); M.use();
    const stable = (musicTrackIdx === idxBefore && musicNoteIndex === noteBefore);
    /* ออกจากบ้านผ่านทางเดินโค้ดจริง */
    window.__houseDbg.exit();
    await new Promise(r2 => setTimeout(r2, 300));
    return { inHouse, stable, afterExitFarm: isFarm(), master: 0.025 };
  });
  expect(r.inHouse, 'อยู่ในเมืองต้องใช้ playlist ฟาร์ม').toBe(true);
  expect(r.stable, 'เรียก use() ซ้ำต้องไม่รีสตาร์ตเพลง (idempotent)').toBe(true);
  expect(r.afterExitFarm, 'ออกจากเมืองแล้วต้องคืน playlist ให้หน้าหลัก').toBe(false);
  expect(errs).toEqual([]);
});

test('🎵 ปิดเพลงไว้ = เข้าเมืองต้องเงียบสนิท · master ต้องยังเป็น 0.025', async ({ page }) => {
  const errs = await house(page, false);
  const r = await page.evaluate(() => ({
    musicOn: musicOn,
    schedulerRunning: !!musicSchedulerId,
    /* startMusic() ตั้ง master ไว้ที่ 0.025 เสมอ — อ่านจากซอร์สจริงกันเผลอปรับขึ้น */
    src: String(startMusic),
  }));
  expect(r.musicOn, 'เทสนี้ตั้งค่าปิดเพลงไว้').toBe(false);
  expect(r.schedulerRunning, 'ปิดเพลงแล้วต้องไม่มี scheduler เดินอยู่').toBe(false);
  expect(r.src, 'master ของเพลงพื้นหลังต้องยังเป็น 0.025 (ห้ามดังขึ้น)').toContain('0.025');
  expect(errs).toEqual([]);
});

test('🎶 หน้าฟังเพลงธีม: เปิดจากเมนูเฟืองได้ · ครบ 4 แถว · ปิดแล้วคืนเพลงเมือง', async ({ page }) => {
  const errs = await house(page, true);
  const enabled = await page.evaluate(() => !!(window.HouseMusicUI && window.HouseMusicUI.enabled));
  test.skip(!enabled, 'หน้าฟังเพลงถูกปิดไว้ (เครื่องมือเทส) — เป็นค่าปกติของ production');
  await page.locator('#house-ctrl-gear').dispatchEvent('click');
  await page.waitForTimeout(200);
  expect(await page.locator('#house-music-btn').isVisible()).toBe(true);
  await page.locator('#house-music-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-mus').hidden, null, { timeout: 8000 });
  await expect(page.locator('#hmus-list .hmus-row')).toHaveCount(4);
  /* กดเล่นเพลงที่ 2 → ต้องสลับไปเพลงนั้นจริง */
  await page.locator('#hmus-list .hmus-row').nth(1).locator('.hmus-play').click();
  await page.waitForTimeout(250);
  const idx = await page.evaluate(() => ({ ui: window.HouseMusicUI.playing(), track: musicTrackIdx }));
  expect(idx.ui, 'แถวที่กดต้องขึ้นสถานะกำลังเล่น').toBe(1);
  expect(idx.track, 'ต้องสลับไปเล่นเพลงที่เลือกจริง').toBe(1);
  /* ปิดหน้า → ต้องกลับไปเล่น playlist ฟาร์มตามปกติ ไม่ค้างอยู่ที่เพลงเดียว */
  await page.locator('#hmus-close').click();
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => ({
    hidden: document.getElementById('house-mus').hidden,
    farm: musicList() === window.HouseMusic.TRACKS,
    ui: window.HouseMusicUI.playing(),
  }));
  expect(after.hidden).toBe(true);
  expect(after.farm, 'ปิดหน้าแล้วต้องคืน playlist ฟาร์ม').toBe(true);
  expect(after.ui).toBe(-1);
  expect(errs).toEqual([]);
});

test('🎵 ของเดิมต้องไม่พัง: playlist หน้าหลักยังเล่นได้ปกติ (หน้าครูใช้ไฟล์นี้ร่วม)', async ({ page }) => {
  const errs = await house(page, true);
  const r = await page.evaluate(async () => {
    setMusicPlaylist(null);                       /* กลับไปชุดหน้าหลัก */
    const list = musicList();
    const plain = list.every(t => !t.layers && Array.isArray(t.notes));
    startMusic();
    await new Promise(r2 => setTimeout(r2, 400));
    return { n: list.length, plain, running: !!musicSchedulerId, advanced: musicNoteIndex > 0 };
  });
  expect(r.n, 'หน้าหลักต้องยังมีเพลงเดิมครบ').toBeGreaterThanOrEqual(5);
  expect(r.plain, 'เพลงหน้าหลักต้องยังเป็นรูปแบบเดิม (notes ชั้นเดียว)').toBe(true);
  expect(r.running).toBe(true);
  expect(r.advanced, 'scheduler ต้องเดินหน้าเล่นเพลงชุดเดิมได้จริง').toBe(true);
  expect(errs).toEqual([]);
});
