const { test, expect } = require('@playwright/test');

/* โหมด "บ้านของหนู" — ตรวจคลังเฟอร์นิเจอร์ (js/house-furniture.js)
   ไฟล์นั้นเป็น catalog ล้วน (ไม่แตะ DOM/WebGL) จึงทดสอบได้โดยไม่ต้องเปิดฉาก 3D จริง:
   โหลด three.js + คลัง แล้วสร้างทุกชิ้นด้วย kit ปลอมที่ทำจาก THREE ตรงๆ
   จับพวกพิมพ์ชื่อ helper ผิด/ตัวแปรหลุด ที่ปกติจะเจอก็ต่อเมื่อเด็กเปิดกล่องของแล้วกดชิ้นนั้นพอดี */

async function loadCatalog(page) {
  await page.goto('/');
  await page.addScriptTag({ url: '/js/vendor/three.min.js' });
  await page.addScriptTag({ url: '/js/house-furniture.js' });
  return page.evaluate(() => {
    const T = window.THREE;
    const mat = hex => new T.MeshLambertMaterial({ color: hex });
    const mesh = (geo, hex) => new T.Mesh(geo, mat(hex));
    const kit = {
      THREE: T,
      box:   (w, h, d, hex) => mesh(new T.BoxGeometry(w, h, d), hex),
      ball:  (r, hex) => mesh(new T.SphereGeometry(r, 8, 6), hex),
      cyl:   (rt, rb, h, hex, seg) => mesh(new T.CylinderGeometry(rt, rb, h, seg || 8), hex),
      cone:  (r, h, hex, seg) => mesh(new T.ConeGeometry(r, h, seg || 8), hex),
      torus: (r, t, hex) => mesh(new T.TorusGeometry(r, t, 6, 12), hex),
      mat,
      shade: (hex) => hex,
    };
    const cat = window.HOUSE_FURNITURE(kit);
    const items = cat.items;
    const built = items.map(it => {
      const g = new T.Group();
      try {
        it.build(g, (it.colors && it.colors[0]) || 0xffffff, kit);
        let meshes = 0;
        g.traverse(o => { if (o.isMesh) meshes++; });
        return { id: it.id, ok: true, meshes };
      } catch (e) {
        return { id: it.id, ok: false, err: String(e && e.message || e) };
      }
    });
    return {
      cats: { in: cat.cats.in.map(c => c.id), out: cat.cats.out.map(c => c.id) },
      byIdCount: Object.keys(cat.byId).length,
      meta: items.map(it => ({
        id: it.id, name: it.name, cat: it.cat, scope: it.scope, emoji: it.emoji,
        fw: it.fw || 1, fd: it.fd || 1, action: it.action || 'bounce', hasBuild: typeof it.build === 'function',
      })),
      built,
    };
  });
}

test('คลังเฟอร์นิเจอร์: ข้อมูลทุกชิ้นครบและไม่ซ้ำ', async ({ page }) => {
  const { meta, cats, byIdCount } = await loadCatalog(page);
  expect(meta.length).toBeGreaterThanOrEqual(60);

  const ids = meta.map(m => m.id);
  expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);   // id ผูก save/inventory ห้ามซ้ำ

  const bad = meta.filter(m =>
    !m.id || !m.name || !m.cat || !m.emoji || !m.hasBuild ||
    !['in', 'out'].includes(m.scope) ||
    !['sit', 'sleep', 'bounce', 'spin', 'toggle'].includes(m.action) ||
    !(m.fw >= 1 && m.fw <= 4) || !(m.fd >= 1 && m.fd <= 4));
  expect(bad).toEqual([]);

  expect(byIdCount).toBe(meta.length);      // byId ต้องครบทุกชิ้น (id ซ้ำจะทำให้หาย)

  // หมวดของทุกชิ้นต้องมีแท็บรองรับจริงในกล่องเลือกของ ไม่งั้นชิ้นนั้นจะไม่มีทางถูกเห็น
  const orphan = meta.filter(m => !cats[m.scope].includes(m.cat)).map(m => m.id + '/' + m.cat);
  expect(orphan).toEqual([]);

  // ต้องมีของทั้งในบ้านและนอกบ้าน ไม่งั้นแท็บใดแท็บหนึ่งในกล่องของจะว่าง
  expect(meta.filter(m => m.scope === 'in').length).toBeGreaterThan(10);
  expect(meta.filter(m => m.scope === 'out').length).toBeGreaterThan(10);
});

test('คลังเฟอร์นิเจอร์: สร้างได้จริงทุกชิ้น ไม่มีชิ้นว่าง', async ({ page }) => {
  const { built } = await loadCatalog(page);
  expect(built.filter(b => !b.ok)).toEqual([]);              // build() ต้องไม่ throw
  expect(built.filter(b => b.ok && b.meshes === 0)).toEqual([]);  // ต้องมี mesh อย่างน้อย 1 ชิ้น
});

test('เข้าบ้าน 3D แล้วฉากเดินต่อได้ ไม่มี error ตอนรันจริง', async ({ page }) => {
  /* ข้อมูลแผนที่อยู่คนละไฟล์กับ engine (js/house-map.js) — ถ้า export ตกหล่นสักชื่อ
     จะระเบิดตอนสร้างฉาก/ตอนลูป NPC ทำงาน ไม่ใช่ตอนโหลดไฟล์ จึงต้องปล่อยให้ฉากรันจริงสักพัก */
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => {
    localStorage.setItem('p1quiz_children', JSON.stringify([
      { id: 'house-test', name: 'เทสบ้าน', emoji: '🦉', birthDate: '2016-01-15' }]));
    localStorage.setItem('p1quiz_active_child', 'house-test');
    localStorage.setItem('p1quiz_music', 'off');
  });
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#house-entry-btn').dispatchEvent('click');
  await page.waitForFunction(() => !document.getElementById('house-view').hidden, null, { timeout: 30000 });

  await page.waitForTimeout(2000);        // ปล่อยให้ลูปฉาก/ชาวบ้าน/สัตว์เล็กทำงานจริงหลายเฟรม
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.getElementById('house-loading').hidden)).toBe(true);  // ม่านต้องปิดเองแล้ว
});
