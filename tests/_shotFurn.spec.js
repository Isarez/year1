const { test } = require('@playwright/test');
const CHILD = { id: 'furnrev', name: 'ของ', emoji: '🪑', birthDate: '2018-06-01', grade: 'p3' };
const CHAR = { gender: 0, hair: 0, hairC: 0, eyes: 1, eyeC: 0, shirt: 5, bottom: 0, shoes: 0 };
/* โฟลเดอร์ผลลัพธ์อยู่ใน repo ⇒ รันได้ทุกเครื่อง (test-results/ ถูก ignore อยู่แล้ว) */
const DIR = require('path').join(__dirname, '..', 'test-results', 'shots') + '/';
require('fs').mkdirSync(DIR, { recursive: true });
const ONLY = (process.env.FURN_ONLY || '').split(',').filter(Boolean);
const OUT = process.env.FURN_OUT || 'furn';
test('furnsheet', async ({ page }) => {
  test.setTimeout(600000);
  await page.addInitScript(([c, ch]) => {
    localStorage.setItem('p1quiz_children', JSON.stringify([c]));
    localStorage.setItem('p1quiz_active_child', c.id);
    localStorage.setItem('p1quiz_music', 'off');
    localStorage.setItem('p1quiz_house_' + c.id, JSON.stringify({ v: 1, mapV: 4, char: ch, tut: { skip: true } }));
  }, [CHILD, CHAR]);
  await page.goto('/');
  await page.locator('#child-select-view .child-card').first().click();
  await page.locator('#landing-house').click();
  await page.waitForFunction(() => window.__houseDbg && window.__houseDbg.ready(), null, { timeout: 30000 });

  const ids = await page.evaluate(o => {
    const list = window.__houseDbg.furn().items.map(i => ({ id: i.id, n: i.name, cat: i.cat, scope: i.scope }));
    return o.length ? list.filter(x => o.includes(x.id)) : list;
  }, ONLY);
  console.log('items:', ids.length);

  // เตรียม renderer เดี่ยว แล้วเรนเดอร์ทีละชิ้นเป็น dataURL
  await page.evaluate(() => {
    const T = window.THREE;
    const cv = document.createElement('canvas');
    cv.width = 300; cv.height = 300;
    const rd = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, preserveDrawingBuffer: true });
    rd.setPixelRatio(1); rd.setSize(300, 300, false);
    const sc = new T.Scene(); sc.background = new T.Color(0xfff8ec);
    sc.add(new T.AmbientLight(0xffffff, .85));
    const dl = new T.DirectionalLight(0xffffff, .75); dl.position.set(4, 8, 6); sc.add(dl);
    const dl2 = new T.DirectionalLight(0xffffff, .35); dl2.position.set(-5, 3, -4); sc.add(dl2);
    const cam = new T.PerspectiveCamera(32, 1, .01, 100);
    const grid = new T.GridHelper(4, 8, 0xd8c8a8, 0xe8dcc4); sc.add(grid);
    window.__furnShot = (id, ang) => {
      const g = window.__houseDbg.buildFurn(id);
      sc.add(g);
      const bb = new T.Box3().setFromObject(g);
      const size = bb.getSize(new T.Vector3()), ctr = bb.getCenter(new T.Vector3());
      const r = Math.max(size.x, size.y, size.z, .2);
      const a = ang == null ? Math.PI * .22 : ang;
      cam.position.set(ctr.x + Math.sin(a) * r * 2.9, ctr.y + r * 1.5, ctr.z + Math.cos(a) * r * 2.9);
      cam.lookAt(ctr);
      grid.position.set(ctr.x, bb.min.y - .002, ctr.z);
      rd.render(sc, cam);
      const url = cv.toDataURL('image/png');
      sc.remove(g);
      return url;
    };
  });

  const per = 18;
  for (let p0 = 0; p0 * per < ids.length; p0++) {
    const slice = ids.slice(p0 * per, p0 * per + per);
    await page.evaluate(([list, ANG]) => {
      const old = document.getElementById('furn-sheet'); if (old) old.remove();
      const wrap = document.createElement('div');
      wrap.id = 'furn-sheet';
      wrap.style.cssText = 'position:fixed;inset:0;background:#FFF8EC;z-index:99999;overflow:hidden;padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start';
      list.forEach(it => {
        const d = document.createElement('div');
        d.style.cssText = 'width:200px;display:flex;flex-direction:column;align-items:center;font:700 13px sans-serif;color:#5b4a35;background:#fff;border-radius:12px;padding:4px';
        const im = document.createElement('img');
        im.src = window.__furnShot(it.id, ANG);
        im.style.cssText = 'width:190px;height:190px;display:block';
        d.appendChild(im);
        const s = document.createElement('span'); s.textContent = it.n + '  (' + it.id + ')';
        s.style.cssText = 'font-size:12px;padding:2px 0 4px';
        d.appendChild(s);
        wrap.appendChild(d);
      });
      document.body.appendChild(wrap);
    }, [slice, Number(process.env.FURN_ANG || 0.22)]);
    await page.waitForTimeout(200);
    await page.screenshot({ path: DIR + OUT + '-' + String(p0).padStart(2, '0') + '.png' });
  }
});
