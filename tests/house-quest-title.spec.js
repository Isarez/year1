/* ============================================================
   🏷️ ป้ายชื่อ/ไอคอนของงาน + ตะแกรงกันกลไกใหม่หลุดตาราง

   ⚠️ **ตระกูลบั๊ก "ตัวแปลง state → ข้อความที่เด็กอ่าน แต่รู้จักเคสไม่ครบ"** — เจอแล้ว 2 ตัว
      ทั้งคู่เขียนตอนระบบยังมี 2 กลไก แล้วไม่ได้ตามตอนพูลโตเป็น 65:
        · `questTitle()` ⇒ อีก 63 กลไกถูกป้ายว่า "ตอบคำถาม" ทั้งหมด (v3.2.1)
        · `questIcon()`  ⇒ งานที่ไม่มีเจ้าของได้ ❓ เสมอ (v3.2.2)

   🔑 **เทสที่ดูแค่ค่า `spec.mech` จับบั๊กนี้ไม่ได้** — ตัวสุ่มถูกต้องมาตลอด ผิดที่ป้ายชื่อ
      ต้องอ่าน **ข้อความบนจอจริง** ⇒ ชุดนี้จึงไล่ตรวจทุกตารางที่ต้องเติมเมื่อมีกลไกใหม่
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'qtitle', name: 'ป้ายงาน', emoji: '🏷️', birthDate: '2018-06-01', grade: 'p3' };
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };

async function house(page) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript(([c, ch]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id,
      JSON.stringify({ v: 1, mapV: 4, char: ch, tut: { skip: true } }));
  }, [CHILD, CHAR]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('.h2-mode-house, #landing-house').first().click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 60000 });
  return errs;
}

test('QT1: ทุกกลไกต้องมีชื่อไทยของตัวเอง ห้ามตกไปใช้ป้ายเริ่มต้น', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const M = window.HouseQuests.MECHS;
    const noName = [], dup = {};
    Object.keys(M).forEach(id => {
      const n = M[id] && M[id].name;
      if (!n || !String(n).trim()) noName.push(id);
      else (dup[n] = dup[n] || []).push(id);
    });
    return { total: Object.keys(M).length, noName,
             shared: Object.keys(dup).filter(n => dup[n].length > 2).map(n => n + ':' + dup[n].join('/')) };
  });
  expect(r.total, 'ต้องมีกลไกอยู่จริงหลายสิบตัว').toBeGreaterThan(50);
  expect(r.noName, 'กลไกที่ไม่มีชื่อไทยจะโผล่บนจอเป็นป้ายเริ่มต้น').toEqual([]);
  expect(errs).toEqual([]);
});

test('QT2: กระดานเควสต์ — ป้ายบนแถวต้องตรงกับกลไกจริงของแถวนั้น', async ({ page }) => {
  const errs = await house(page);
  await page.evaluate(() => window.__houseDbg.openBoard());
  await expect(page.locator('#house-quest')).toBeVisible();

  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, M = Q.MECHS;
    const rows = Array.from(document.querySelectorAll('.hq-row .hq-txt')).map(e => e.textContent);
    const mechs = [], names = [];
    for (let i = 0; i < 5; i++) {
      const s = Q.specForBoard(i);
      if (!s) continue;
      mechs.push(s.mech);
      names.push((M[s.mech] || {}).name || '');
    }
    return { rows, mechs, names };
  });
  console.log('กลไกจริง : ' + r.mechs.join(', '));
  console.log('ป้ายบนจอ : ' + r.rows.join(' | '));

  expect(r.rows.length, 'กระดานต้องมี 5 แถว').toBe(5);
  /* 🔑 หัวใจของชุดนี้: ป้ายแต่ละแถวต้อง **มีชื่อกลไกของแถวนั้นอยู่จริง** */
  r.rows.forEach((txt, i) => {
    expect(txt, 'แถว ' + (i + 1) + ' (' + r.mechs[i] + ') ต้องขึ้นชื่อเกมของตัวเอง')
      .toContain(r.names[i]);
  });
  /* กันบั๊กเดิมตรงๆ: ถ้ากลไกจริงไม่ใช่ quiz ป้ายห้ามเขียนว่า "ตอบคำถาม" */
  r.rows.forEach((txt, i) => {
    if (r.mechs[i] !== 'quiz')
      expect(txt, 'กลไก ' + r.mechs[i] + ' ห้ามถูกป้ายว่าตอบคำถาม').not.toContain('ตอบคำถาม');
  });
  expect(errs).toEqual([]);
});

test('QT3: ป้ายต้องบอกชื่อคนที่ฝากงานด้วย (เด็กจะได้รู้ว่างานของใคร)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests;
    const s = Q.specForBoard(0);
    const d = window.__houseDbg.npcDefs().find(x => x.id === s.npc);
    return { npc: d ? d.name : '', mech: s.mech };
  });
  await page.evaluate(() => window.__houseDbg.openBoard());
  const first = await page.locator('.hq-row .hq-txt').first().textContent();
  expect(first, 'ป้ายต้องมีชื่อคนที่ฝากงาน').toContain(r.npc);
  expect(errs).toEqual([]);
});

/* ---------------------------------------------------------------- */

test('QT4: ทุกกลไกต้องมีไอคอนของตัวเอง และตารางไอคอนห้ามมีตัวเกิน', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, ids = Object.keys(Q.MECHS);
    const tblIds = Object.keys(Q.MECH_IC || {});
    return {
      total: ids.length,
      noIcon: ids.filter(k => !Q.mechIcon(k)),
      orphan: tblIds.filter(k => ids.indexOf(k) < 0),
      sample: ids.slice(0, 4).map(k => Q.mechIcon(k) + ' ' + Q.MECHS[k].name),
    };
  });
  console.log('ตัวอย่าง: ' + r.sample.join('  ·  '));
  expect(r.total).toBeGreaterThan(50);
  expect(r.noIcon, 'กลไกที่ไม่มีไอคอนจะได้ ❓ ตอนไม่มีคนฝากงาน').toEqual([]);
  expect(r.orphan, 'ตารางไอคอนมีตัวที่ไม่มีกลไกจริงรองรับ').toEqual([]);
  expect(errs).toEqual([]);
});

test('QT5: กลไกใหม่ห้ามหลุดตารางไหน — ชื่อ · ไอคอน · ทรง · แท็บคลังโจทย์', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, M = Q.MECHS, ids = Object.keys(M);
    const tabs = ((window.HouseQB || {}).MECH_TABS || []).map(t => t.id);
    return {
      ids: ids.length,
      noName: ids.filter(k => !(M[k] && M[k].name)),
      noTab:  tabs.length ? ids.filter(k => tabs.indexOf(k) < 0) : [],
      tabOrphan: tabs.filter(t => ids.indexOf(t) < 0),
      /* ธง walk ต้องตรงกับทรงเสมอ — `whois` เคยตกหล่นจาก WALK_MECHS_SHAPE
         ⇒ ถูกนับเป็นการ์ด คำนวณจำนวนข้อ/งบเวลาผิดมาตลอดตั้งแต่เฟส 13 */
      walkMismatch: ids.filter(k => !!M[k].walk !== (Q.mechShape(k) === 'walk')),
      /* กลไกที่ยืม engine ต้องมีทรง engine (ไม่งั้นคิดจำนวนข้อผิด) */
      engineMismatch: ids.filter(k => !!M[k].engine !== (Q.mechShape(k) === 'engine')),
    };
  });
  expect(r.ids).toBeGreaterThan(50);
  expect(r.noName, 'ไม่มีชื่อ = ป้ายบนกระดานจะขึ้นค่าเริ่มต้น').toEqual([]);
  expect(r.noTab, 'ไม่มีแท็บ = เปิดเล่นทดสอบจากคลังโจทย์ไม่ได้').toEqual([]);
  expect(r.tabOrphan, 'แท็บที่ไม่มีกลไกจริงรองรับ').toEqual([]);
  expect(r.walkMismatch, 'ธง walk ไม่ตรงกับทรง = คำนวณจำนวนข้อ/งบเวลาผิด').toEqual([]);
  expect(r.engineMismatch, 'ธง engine ไม่ตรงกับทรง').toEqual([]);
  expect(errs).toEqual([]);
});

test('QT6: ทุก kind ที่กลไกผลิต ต้องมีตัววาดรองรับ (ไม่งั้นเด็กเจอการ์ดเปล่า)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const Q = window.HouseQuests, M = Q.MECHS;
    const G = ['prep-p1','p1','p2','p3','p4','p5','p6'];
    const kinds = {}, failed = [];
    Object.keys(M).forEach(id => {
      G.forEach(gid => {
        let run = null;
        try { run = Q.testRun({ mech: id, gid: gid, seed: 7 }); } catch (e) { failed.push(id + '@' + gid); return; }
        (run && run.items || []).forEach(it => { if (it && it.kind) kinds[it.kind] = true; });
      });
    });
    return { kinds: Object.keys(kinds).sort(), failed: failed.slice(0, 8) };
  });
  console.log('kind ที่ผลิตจริง: ' + r.kinds.join(', '));
  expect(r.failed, 'สร้างชุดโจทย์ไม่ได้').toEqual([]);
  /* ตัววาดอยู่ที่ renderQuestStep() ใน js/house.js — kind ที่ไม่มีสาขาจะตกไปวาดเป็น
     การ์ด 4 ตัวเลือก ซึ่งของพวกนี้ไม่มีตัวเลือก ⇒ เด็กเจอการ์ดเปล่าตอบไม่ได้
     (เคยพลาดมาแล้วกับ `img` ของหมวดเชาว์ เมื่อ 2026-08-08) */
  const DRAWN = ['beaker','clock','code','coinpay','colornum','engine','flash',
                 'mart','playalong','sort','sound','spot','vanish','walk'];
  const missing = r.kinds.filter(k => DRAWN.indexOf(k) < 0);
  expect(missing, 'kind ใหม่ที่ยังไม่มีตัววาดใน renderQuestStep()').toEqual([]);
  expect(errs).toEqual([]);
});
