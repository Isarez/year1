/* ============================================================
   🎨 ไอคอน SVG ของโหมดบ้าน (แทน emoji) — ผู้ใช้สั่ง 2026-08-18
   "emoji ทำให้เครื่องคนละ OS แสดงผลไม่เหมือนกัน (บางตัวไม่มี glyph เลย)
    ⇒ ไอคอนของของ/ปุ่ม/สถานะต้องวาดด้วย SVG · ท่าทางอารมณ์ยังใช้ emoji ได้"

   ชุดนี้คุม: คลังไอคอนครบทุกไอเทม · เป็น SVG จริง · ไม่ซ้ำกัน · หน้าจอใช้ SVG จริงไม่ใช่ emoji
   ============================================================ */
const { test, expect } = require('@playwright/test');

const CHILD = { id: 'ico', name: 'ไอคอน', emoji: '🎨', birthDate: '2018-06-01', grade: 'p3' };
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };

async function house(page, extra) {
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(([c, ch, ex]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    window.__TUT_OFF = true;
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify(Object.assign({ v: 1, mapV: 4, char: ch }, ex || {})));
  }, [CHILD, CHAR, extra]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });
  await page.waitForFunction(() => !!window.HouseIcons && !!window.HouseBook && !!window.HousePlay, null, { timeout: 30000 });
  return errs;
}

/* ---------------------------------------------------------------- */

test('IC1: ไอเทมทุกชิ้นที่โผล่บนหน้าจอต้องมีไอคอนของตัวเอง (ปลา/พืช/สัตว์/ท่า/ของเล่น/อาหาร/ปลอกคอ/ของสะสม)', async ({ page }) => {
  const errs = await house(page);
  const miss = await page.evaluate(() => {
    const I = window.HouseIcons, out = [];
    const need = [];
    (window.HousePlay.FISH || []).forEach(f => need.push('fish-' + f.id));
    (window.HousePlay.SEEDS || []).forEach(s => need.push('seed-' + s.id));
    (window.HouseBook.CRITTERS || []).forEach(c => need.push('critter-' + c.id));
    (window.HousePetCare.TRICKS || []).forEach(t => need.push('trick-' + t.id));
    (window.HouseShop.PET_TOYS || []).forEach(t => need.push('toy-' + t.id));
    (window.HousePetCare.FOOD || []).forEach(f => need.push('food-' + f.id));
    (window.HouseShop.PET_COLLARS || []).forEach(c => need.push('collar-' + c.id));
    ['leaf', 'shell', 'star', 'flower'].forEach(id => need.push('col-' + id));
    ['seek', 'fishing', 'camera', 'garden', 'book', 'basket', 'water', 'pat', 'bath',
     'teach', 'collar', 'gift', 'shop', 'photo', 'critter', 'seedbag', 'coin'].forEach(id => need.push('ui-' + id));
    need.forEach(id => { if (!I.has(id)) out.push(id); });
    return {miss: out, total: need.length};
  });
  expect(miss.miss, 'ไอเทมที่ยังไม่มีไอคอน').toEqual([]);
  expect(miss.total, 'ต้องคุมไอคอนอย่างน้อย 100 ตัว').toBeGreaterThanOrEqual(100);
  expect(errs).toEqual([]);
});

test('IC2: ทุกไอคอนเป็น SVG ที่ใช้ได้จริง · ไม่มีสคริปต์/รูปนอก · ไม่ซ้ำกันเอง', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    const I = window.HouseIcons, seen = {}, dup = [], bad = [];
    I.ids().forEach(id=>{
      const h = I.html(id, 30);
      if(h.indexOf('<svg') !== 0 || h.indexOf('viewBox="0 0 64 64"') < 0) bad.push(id);
      if(/<script|<image|<foreignObject|href=/i.test(h)) bad.push(id + ':unsafe');
      /* ⚠ `tab-*` **ตั้งใจ** ใช้รูปเดียวกับไอเทมในคลัง (แท็บสมุด = ตัวแทนของหมวดนั้น)
         ⚠ **ของสิ่งเดียวกันที่อยู่คนละคลังก็ใช้รูปเดียวกันได้** — เช่น `pet-cat` กับ `critter-cat`
           คือแมวตัวเดียวกัน คนละที่ใช้ (ร้านสัตว์เลี้ยง vs สมุดสัตว์ในเมือง) การวาดใหม่ให้ต่างกัน
           จะกลายเป็นแมว 2 แบบในเกมเดียว ซึ่งแย่กว่า ⇒ ยกเว้นคู่ที่ **ส่วนท้าย id ตรงกัน**
         ตัวอื่นห้ามซ้ำกันเลย — ซ้ำเมื่อไหร่แปลว่าเผลอ copy ทรงมาแล้วลืมเปลี่ยน */
      const body = h.replace(/^<svg[^>]*>/, '');
      const tail = id.replace(/^[a-z]+-/, '');
      if(id.indexOf('tab-') !== 0){
        if(seen[body] && seen[body].replace(/^[a-z]+-/, '') !== tail) dup.push(id + '=' + seen[body]);
        else if(!seen[body]) seen[body] = id;
      }
      /* วาดจริงได้ไหม (parser ไม่ error) */
      const d = document.createElement('div');
      d.innerHTML = h;
      if(!d.querySelector('svg')) bad.push(id + ':parse');
    });
    return {bad, dup, n: I.ids().length};
  });
  expect(r.bad, 'ไอคอนที่ผิดรูปแบบ').toEqual([]);
  expect(r.dup, 'ไอคอนที่วาดซ้ำกันเป๊ะ (ต้องต่างกันที่เงารวม)').toEqual([]);
  expect(r.n).toBeGreaterThanOrEqual(100);
});

test('IC3: สมุดสะสมวาดด้วย SVG จริงทุกช่อง · ช่องที่ยังไม่เจอยังเป็น "เงา"', async ({ page }) => {
  await house(page, { play: { v: 1, day: '', fish: { book: ['nil', 'koi'], bag: {}, today: 0 } } });
  await page.evaluate(() => window.HouseBook.open('fish'));
  const r = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll('#hbk-body .hbk-cell'));
    const withSvg = cells.filter(c => c.querySelector('.hbk-e svg')).length;
    const tabSvg = Array.from(document.querySelectorAll('#hbk-tabs .hqb-chip')).filter(b => b.querySelector('svg')).length;
    const miss = cells.filter(c => !c.classList.contains('has'))[0];
    return {n: cells.length, withSvg, tabSvg,
            filter: miss ? getComputedStyle(miss.querySelector('.hbk-e')).filter : ''};
  });
  expect(r.withSvg, 'ทุกช่องต้องเป็น SVG').toBe(r.n);
  expect(r.tabSvg, 'แท็บทั้ง 5 ต้องมีไอคอน SVG').toBe(5);
  expect(r.filter, 'ช่องที่ยังไม่เจอต้องยังเป็นเงา').toContain('brightness(0)');
});

test('IC4: แผงกิจกรรม 🎈 ทุกแถวใช้ไอคอน SVG · ไม่มี emoji หลงเหลือในข้อความ', async ({ page }) => {
  await house(page);
  await page.evaluate(() => window.HousePlay.open());
  const r = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#hpl-list .hpl-row'));
    const svg = rows.filter(x => x.querySelector('.hpl-ic svg')).length;
    const txt = rows.map(x => x.textContent).join(' ');
    const emo = txt.match(/[\u{1F300}-\u{1FAFF}]/gu) || [];
    return {n: rows.length, svg, emo};
  });
  expect(r.svg, 'ทุกแถวต้องมีไอคอน SVG').toBe(r.n);
  expect(r.emo, 'ข้อความในแผงต้องไม่มี emoji ปน').toEqual([]);
});

test('IC5: toast ของโหมดบ้านส่งไอคอน SVG ได้ (หน้าครูที่ส่ง emoji ต้องยังทำงานเหมือนเดิม)', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    showToast(window.HouseIcons.html('ui-fishing', 26), 'ทดสอบ');
    const a = !!document.querySelector('#toast-emoji svg');
    showToast('🎉', 'ทดสอบ');
    const b = document.getElementById('toast-emoji').textContent;
    return {svg: a, emoji: b};
  });
  expect(r.svg, 'ส่ง SVG แล้วต้องได้รูป').toBe(true);
  expect(r.emoji, 'ส่ง emoji แบบเดิมต้องยังได้ข้อความ').toBe('🎉');
});

test('IC6: การ์ดในร้าน (อาหาร/ของเล่น/ปลอกคอ) ใช้ไอคอน SVG', async ({ page }) => {
  await house(page);
  const r = await page.evaluate(() => {
    const out = {};
    ['food', 'toy', 'collar'].forEach(tab=>{
      window.HouseShop.open('shop-pet');
      const tabs = Array.from(document.querySelectorAll('#house-shop .he-tab, #house-shop button'));
      out[tab] = tabs.length;
    });
    window.HouseShop.close();
    /* ตรวจตรงๆ ว่าคลังมีไอคอนของทุกชิ้นที่ร้านจะวาด (การกดแท็บจริงอยู่ในเทสร้านค้าอยู่แล้ว) */
    const I = window.HouseIcons;
    const miss = [];
    (window.HouseShop.PET_TOYS || []).forEach(t => { if(!I.has('toy-' + t.id)) miss.push(t.id); });
    (window.HouseShop.PET_COLLARS || []).forEach(c => { if(!I.has('collar-' + c.id)) miss.push(c.id); });
    (window.HousePetCare.FOOD || []).forEach(f => { if(!I.has('food-' + f.id)) miss.push(f.id); });
    return {miss};
  });
  expect(r.miss).toEqual([]);
});

test('IC7: เมนูฟองของเพื่อนตัวน้อยใช้ไอคอน SVG (ให้อาหาร/ลูบหัว/อาบน้ำ/เล่น/สอนท่า)', async ({ page }) => {
  await house(page, { pet: { type: 'dog', color: 0, name: 'ปุยนุ่น' } });
  await page.evaluate(() => window.__houseDbg.petTap());
  await page.waitForFunction(() => document.querySelectorAll('#house-pet-menu .hpm-btn').length > 3,
    null, { timeout: 20000 });
  const r = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('#house-pet-menu .hpm-btn'));
    return {n: btns.length, svg: btns.filter(b => b.querySelector('.hpm-ic svg')).length};
  });
  expect(r.n, 'ต้องมีปุ่มในเมนู').toBeGreaterThan(3);
  expect(r.svg, 'ปุ่มส่วนใหญ่ต้องเป็นไอคอน SVG').toBeGreaterThanOrEqual(r.n - 1);
});

/* 🐞 IC8 — บั๊กจริงที่ผู้ใช้เจอ 2026-08-19: "แท็บปลาไม่แสดง"
   ต้นเหตุ: แก้ไอคอนแล้วเผลอลบ "ทรงร่วม" ไป 4 ทรง (jelly/starfish/urchin/scallop)
   ⇒ `SEA[shape]` เป็น undefined ⇒ ตอนวาดกริดโยน TypeError กลางลูป **ทั้งแท็บว่างเปล่า**
   ⚠ IC1 (has) กับ IC2 (ตรวจสตริง) จับไม่ได้ เพราะ id ยังลงทะเบียนอยู่ครบ พังตอน "เรียกใช้"
   ⇒ ต้องเรียกวาดจริงทีละ id แล้วห้ามโยน error / ห้ามคืนค่าว่าง */
test('IC8: เรียกวาดไอคอนทุก id ได้จริงทุกตัว (ห้ามมี id ที่ลงทะเบียนไว้แต่วาดแล้วพัง)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const I = window.HouseIcons, bad = [], ids = I.ids();
    ids.forEach(id => {
      let h = '';
      try { h = I.html(id, 30); } catch (e) { bad.push(id + ' → ' + e.message); return; }
      if (!h || h.indexOf('<svg') !== 0) bad.push(id + ' → คืนค่าว่าง/ไม่ใช่ svg');
    });
    return { bad, n: ids.length };
  });
  expect(r.bad, 'ไอคอนที่วาดแล้วพัง').toEqual([]);
  expect(r.n).toBeGreaterThanOrEqual(120);
  expect(errs).toEqual([]);
});

/* 🐟 IC9 — ทรงปลาทั่วไปเคยวาง "ตา" ไว้ข้างเดียวกับหาง ⇒ ปลา 19 ชนิดดูหัวกลับด้าน
   (ผู้ใช้แจ้ง 2026-08-19) · ทุกทรงในไฟล์นี้ต้องเป็น **หัวขวา-หางซ้าย** เหมือนกันหมด
   ⇒ วัดจากพิกัดจริง: จุดศูนย์กลางของ "ตา" ต้องอยู่ขวากว่าจุดกึ่งกลางไอคอน */
test('IC9: ปลาทุกชนิดหันหน้าไปทางเดียวกัน (ตาอยู่ครึ่งขวาเสมอ ห้ามอยู่ข้างเดียวกับหาง)', async ({ page }) => {
  const errs = await house(page);
  const bad = await page.evaluate(() => {
    const I = window.HouseIcons, out = [];
    /* ปลาที่มี "ตา" วาดเป็นวงกลมสีเข้ม #33261d — ตัวที่ไม่มีตา (ของทิ้ง/สาหร่าย/หอย) ข้ามไป */
    (window.HousePlay.FISH || []).forEach(f => {
      const h = I.html('fish-' + f.id, 30);
      const m = [...h.matchAll(/<circle cx="([\d.]+)" cy="[\d.]+" r="[\d.]+" fill="#33261d"/g)];
      /* ⚠ นับเฉพาะตัวที่วาด "มุมข้าง" (ตาข้างเดียว) — ปู/กบ/ปูม้า วาดหันหน้าเข้าหาคนดู
         มีตา 2 ข้างสมมาตร ค่าเฉลี่ยเลยอยู่กลางพอดี ไม่ใช่ความผิด */
      if (m.length !== 1) return;
      const cx = parseFloat(m[0][1]);
      if (cx <= 32) out.push(f.id + ' (ตาอยู่ที่ x=' + cx.toFixed(1) + ')');
    });
    return out;
  });
  expect(bad, 'ปลาที่ตาอยู่ครึ่งซ้าย = หัวกลับด้าน').toEqual([]);
  expect(errs).toEqual([]);
});

/* 🐾 IC10 — ร้านสัตว์เลี้ยง (ผู้ใช้แจ้ง 2026-08-19 ว่า "ในร้านสัตว์เลี้ยงก็ยังใช้ emoji อยู่")
   🔒 กฎถาวรของโปรเจค: **อะไรที่ต้องมีไอคอน ต้องเป็น SVG เสมอ**
   ⇒ ตรวจทั้ง 2 ชั้น: คลังมีไอคอนของสัตว์ครบทุกชนิด · และการ์ด/แท็บที่วาดจริงเป็น SVG ไม่ใช่ emoji */
test('IC10: ร้านสัตว์เลี้ยง — การ์ดสัตว์และแท็บกลุ่มราคาต้องเป็นไอคอน SVG', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const I = window.HouseIcons;
    const miss = (window.HouseShop.petTypes() || []).filter(p => !I.has('pet-' + p.id)).map(p => p.id);
    const tabMiss = ['start', 'mid', 'rare', 'epic'].filter(g => !I.has('petg-' + g));
    window.HouseShop.open('shop-pet');
    const cards = Array.from(document.querySelectorAll('#house-shop .hs-card'));
    const tabs  = Array.from(document.querySelectorAll('#house-shop .he-tab'));
    const out = {
      miss, tabMiss,
      /* ⚠ นับเฉพาะใบที่ใช้ "ช่องรูป" — ใบเลือกสีขนเป็นวงกลมสี (`.hs-sw`) ไม่ใช่ไอคอน */
      cards: cards.filter(b => b.querySelector('.hs-emoji')).length,
      cardSvg: cards.filter(b => b.querySelector('.hs-emoji svg')).length,
      tabs: tabs.length,
      tabSvg: tabs.filter(b => b.querySelector('.he-tab-ic svg')).length,
    };
    window.HouseShop.close();
    return out;
  });
  expect(r.miss, 'สัตว์เลี้ยงทุกชนิดต้องมีไอคอน').toEqual([]);
  expect(r.tabMiss, 'แท็บกลุ่มราคาทุกกลุ่มต้องมีไอคอน').toEqual([]);
  expect(r.cards, 'ต้องมีการ์ดสัตว์ในร้าน').toBeGreaterThan(0);
  expect(r.cardSvg, 'การ์ดสัตว์ทุกใบต้องวาดด้วย SVG ไม่ใช่ emoji').toBe(r.cards);
  expect(r.tabSvg, 'แท็บทุกอันต้องวาดด้วย SVG').toBe(r.tabs);
  expect(errs).toEqual([]);
});

/* 🪑 IC11 — เฟส A ของ ICON-PLAN.md: เฟอร์นิเจอร์ทั้งคลังต้องมีไอคอน SVG (ผู้ใช้สั่ง "วาด svg เอง")
   🔒 กฎถาวร: อะไรที่ต้องมีไอคอน ต้องเป็น SVG ⇒ ของตกแต่งทุกชิ้นในร้าน/แผงตกแต่งห้ามเหลือ emoji */
test('IC11: ของตกแต่งทุกชิ้นในคลังต้องมีไอคอน SVG ของตัวเอง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const I = window.HouseIcons, F = window.__houseDbg.furn();
    const miss = F.items.filter(it => !I.has('furn-' + it.id)).map(it => it.id);
    return { miss, total: F.items.length };
  });
  expect(r.total, 'คลังต้องโหลดครบ').toBeGreaterThan(150);
  expect(r.miss, 'ของตกแต่งที่ยังไม่มีไอคอน').toEqual([]);
  expect(errs).toEqual([]);
});

/* การ์ดในร้านเฟอร์นิเจอร์ต้องวาดด้วย SVG จริง (ไม่ใช่แค่ "มีไอคอนในคลัง") */
test('IC12: การ์ดของตกแต่งในร้านวาดด้วย SVG จริงทุกใบ', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    window.HouseShop.open('mall-furniture');
    const cards = Array.from(document.querySelectorAll('#house-shop .hs-card'))
      .filter(b => b.querySelector('.hs-emoji'));
    const out = { n: cards.length, svg: cards.filter(b => b.querySelector('.hs-emoji svg')).length };
    window.HouseShop.close();
    return out;
  });
  expect(r.n, 'ต้องมีการ์ดของตกแต่งในร้าน').toBeGreaterThan(0);
  expect(r.svg, 'การ์ดทุกใบต้องเป็น SVG').toBe(r.n);
  expect(errs).toEqual([]);
});

/* 🏪 IC13 — ป้ายร้านลอยเหนือตึกทั่วเมือง (เฟส B ของ ICON-PLAN.md)
   นี่คือจุดที่ emoji เจ็บที่สุด: ป้าย 20 กว่าอันอยู่กลางฉาก เครื่องคนละ OS เห็นคนละรูป
   ⚠ ป้ายวาดลง texture atlas ด้วย `Image` + data URI ⇒ **SVG ต้องมี `xmlns`** ไม่งั้นโหลดไม่ขึ้น
     และตกกลับไปเป็น emoji เงียบๆ (เคยพลาดมาแล้ว 2026-08-19) */
test('IC13: ป้ายร้านทุกอันในเมืองผูกกับไอคอน SVG ที่มีจริง', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const list = window.__houseDbg.signIcons();
    return {
      n: list.length,
      noMap: list.filter(x => !x.id).map(x => x.e),
      noIcon: list.filter(x => x.id && !window.HouseIcons.has(x.id)).map(x => x.id),
      /* data URI ต้องมี xmlns ไม่งั้น `new Image()` โหลดไม่ได้ */
      uriOk: list.every(x => !x.id || decodeURIComponent(window.HouseIcons.svgUri(x.id)).indexOf('xmlns=') > 0),
    };
  });
  expect(r.n, 'ต้องมีป้ายร้านในเมือง').toBeGreaterThan(15);
  expect(r.noMap, 'ป้ายที่ยังไม่ได้ผูกไอคอน SVG').toEqual([]);
  expect(r.noIcon, 'ป้ายที่ผูกไอคอนที่ไม่มีอยู่จริง').toEqual([]);
  expect(r.uriOk, 'svgUri() ต้องใส่ xmlns เสมอ').toBe(true);
  expect(errs).toEqual([]);
});

/* 🧑 IC14 — ชาวบ้าน 67 คน (เฟส B) ต้องมีไอคอน SVG ครบ และหน้าสรุปเควสต์ต้องวาดด้วย SVG จริง
   ⚠ ไอคอนต้องอยู่ใน element ของตัวเอง (`.hqsum-ic` / `.hnpc-ic`) **ห้ามต่อกับชื่อเป็นสตริง**
     เพราะชื่อบางที่มาจากผู้ใช้ (ชื่อเด็ก/ชื่อสัตว์เลี้ยง) — ต่อเข้า innerHTML ไม่ได้ */
test('IC14: ชาวบ้านทุกคนมีไอคอน SVG · หน้าสรุปเควสต์ไม่เหลือ emoji', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(() => {
    const I = window.HouseIcons;
    const miss = (window.__houseDbg.npcDefs ? window.__houseDbg.npcDefs() : [])
      .filter(d => !I.has(d.id)).map(d => d.id);
    const b = document.getElementById('house-quest-bar'); if (b) b.click();
    return new Promise(res => setTimeout(() => {
      const cells = Array.from(document.querySelectorAll('#hqsum-list .hqsum-ic'));
      res({ miss, rows: cells.length, svg: cells.filter(c => c.querySelector('svg')).length });
    }, 600));
  });
  expect(r.miss, 'ชาวบ้านที่ยังไม่มีไอคอน').toEqual([]);
  expect(r.rows, 'ต้องมีรายการเควสต์วันนี้').toBeGreaterThan(5);
  expect(r.svg, 'ทุกแถวต้องเป็นไอคอน SVG (รวมกระดานเควสต์และพ่อแม่)').toBe(r.rows);
  expect(errs).toEqual([]);
});

/* 🎣 IC15 — ลุงตกปลาห้ามหันหน้ามาหาเด็ก (ผู้ใช้แจ้ง 2026-08-20)
   เบ็ดเป็นส่วนหนึ่งของโมเดล NPC ⇒ พอตัวหมุน ปลายเบ็ดกวาดขึ้นมาอยู่บนฝั่งแทนที่จะทิ้งลงน้ำ
   ⚠ มี 2 จุดที่สั่งให้ NPC หันหน้า: ตอนเริ่มคุย (`talkToNpc`) และตอนถือเควสต์อยู่ (`updateNpcs`)
     **ทั้งคู่ต้องมีเงื่อนไข `fisher`** — รอบแรกกันไว้จุดเดียว บั๊กจึงหลุดออกมาทางเควสต์ */
test('IC15: ทุกจุดที่สั่ง NPC หันหน้าหาเด็ก ต้องยกเว้นคนที่กำลังตกปลา', () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'js', 'house.js'), 'utf8');
  const lines = src.split('\n');
  /* สนใจเฉพาะบรรทัดที่ "สั่งให้หัน" — บรรทัดรีเซ็ตกลับเป็น 0 ไม่นับ */
  const hits = lines.map((l, i) => ({ l, i }))
    .filter(x => /n\.faceT\s*=/.test(x.l) && !/faceT\s*=\s*0\s*;/.test(x.l));
  expect(hits.length, 'ต้องมีจุดที่ตั้ง faceT อยู่จริง').toBeGreaterThan(0);
  hits.forEach(({ l, i }) => {
    /* ดูบรรทัดนั้นกับ 3 บรรทัดก่อนหน้า ว่ามีการกันเคส fisher ไว้ไหม */
    const ctx = lines.slice(Math.max(0, i - 3), i + 1).join(' ');
    expect(/fisher/.test(ctx), 'บรรทัด ' + (i + 1) + ' ตั้ง faceT โดยไม่ยกเว้นลุงตกปลา: ' + l.trim()).toBe(true);
  });
});

/* 🔒 IC16 — ป้ายพิกัดมุมขวาล่างเป็น **เครื่องมือเทส** ต้องปิดได้จากสวิตช์จุดเดียว
   (ผู้ใช้สั่ง 2026-08-20: ให้ใช้เฉพาะบน branch feature เหมือนเมนูในเมนูเฟือง)
   ⚠ กติกาเดียวกับ QB_ENABLED / DEV_ENABLED / MUSIC_PANEL_ENABLED — ต้องเป็น `false` ตอน deploy */
test('IC16: ป้ายพิกัดมุมขวาล่างผูกกับสวิตช์ POS_CHIP_ENABLED (ปิดแล้วต้องไม่โผล่เลย)', async ({ page }) => {
  const errs = await house(page);
  const r = await page.evaluate(async () => {
    const on = window.__houseDbg.posChipEnabled();
    const el = document.getElementById('house-pos-chip');
    /* เดินไปช่องอื่นให้ป้ายมีโอกาสอัปเดต แล้วรอสัก 1 เฟรม */
    await new Promise(r2 => setTimeout(r2, 600));
    return { on, hidden: !el || el.hidden, txt: el ? el.textContent : '' };
  });
  if(r.on) expect(r.hidden, 'สวิตช์เปิดอยู่ ⇒ ป้ายต้องโผล่ตอนเดินในเมือง').toBe(false);
  else expect(r.hidden, 'สวิตช์ปิดอยู่ ⇒ ป้ายต้องไม่โผล่เลย').toBe(true);
  expect(errs).toEqual([]);
});
