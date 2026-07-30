const { test, expect } = require('@playwright/test');
const { openApp } = require('./helpers');

/* กติกาข้อมูลที่ต้องจริงเสมอ — เทสนี้แทนสคริปต์ตรวจที่เคยรันมือ */
test('ข้อมูลหมวดถูกต้องตามกติกาโปรเจค', async ({ page }) => {
  await openApp(page);
  const r = await page.evaluate(() => {
    const problems = [];
    const ids = CATS.map(c => c.id);
    ids.filter((v, i) => ids.indexOf(v) !== i).forEach(d => problems.push('id ซ้ำ: ' + d));
    // emoji ของหมวดต้องไม่ซ้ำ "ภายในระดับชั้นเดียวกัน" (สมุดสติกเกอร์แยกตามชั้น)
    const byGrade = {};
    CATS.forEach(c => { const g = c.grade || 'prep'; (byGrade[g] = byGrade[g] || []).push(c); });
    Object.entries(byGrade).forEach(([g, list]) => {
      const em = list.map(c => c.emoji);
      [...new Set(em.filter((v, i) => em.indexOf(v) !== i))].forEach(d => problems.push(g + ' emoji ซ้ำ: ' + d));
    });
    // ล็อกต้องชี้หมวดที่มีอยู่จริงและไม่เป็นวงจร
    Object.entries(CAT_REQUIRES).forEach(([k, v]) => {
      if (!ids.includes(k)) problems.push('CAT_REQUIRES มี id ที่ไม่มีอยู่: ' + k);
      if (!ids.includes(v)) problems.push(k + ' ต้องการ ' + v + ' ที่ไม่มีอยู่');
      const seen = new Set(); let cur = k, n = 0;
      while (CAT_REQUIRES[cur] && n++ < 60) {
        if (seen.has(cur)) { problems.push('วงจรล็อกที่ ' + k); break; }
        seen.add(cur); cur = CAT_REQUIRES[cur];
      }
    });
    // คลังโจทย์ต้องพอกับ poolPick และมีคำอธิบายครบ
    CATS.filter(c => c.questions).forEach(c => {
      if (c.poolPick && c.questions.length < c.poolPick) problems.push(c.id + ' คลังน้อยกว่า poolPick');
      c.questions.forEach(q => {
        if (new Set(q.choices).size !== q.choices.length) problems.push(c.id + ' ตัวเลือกซ้ำ: ' + q.q.slice(0, 30));
        if (!q.explain) problems.push(c.id + ' ไม่มีคำอธิบาย: ' + q.q.slice(0, 30));
        if (q.correct == null || q.correct < 0 || q.correct >= q.choices.length)
          problems.push(c.id + ' index คำตอบผิด: ' + q.q.slice(0, 30));
      });
    });
    return problems;
  });
  expect(r, r.join('\n')).toEqual([]);
});

test('icon ของทุกหมวดต้องโหลดได้จริง', async ({ page, baseURL }) => {
  await openApp(page);
  const icons = await page.evaluate(() => [...new Set(CATS.map(c => c.icon))]);
  const missing = [];
  for (const ic of icons) {
    const res = await page.request.head(baseURL + '/' + ic);
    if (res.status() !== 200) missing.push(ic + ' → ' + res.status());
  }
  expect(missing, missing.join('\n')).toEqual([]);
});
