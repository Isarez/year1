/* ============================================================
   👋 เพื่อนบ้านที่จำเด็กได้ (Neighbour Memory) — เฟส 18 ของโหมด "บ้านของหนู"
   (ข้อ 57.3 ของ QUEST-DESIGN.md · ผู้ใช้อนุมัติแผน 2026-08-17)

   ปัญหาที่แก้: NPC แจกงานแบบสุ่มทุกวัน ไม่มีใครจำได้ว่าเด็กเคยช่วยอะไร
   ⇒ รู้สึกเป็น "เครื่องแจกงาน" ไม่ใช่เพื่อนบ้าน

   🔒 กติกาที่ล็อกไว้ (ห้ามย้อนโดยไม่ถามผู้ใช้)
   - **ห้ามมีค่าความสนิทที่ "ลดลง"** เมื่อไม่ได้เล่นหลายวัน — เด็กหายไปเที่ยวแล้วกลับมา
     เจอเพื่อนบ้านงอน = ลงโทษ (กติกาเหล็กข้อ 2)
   - **ห้ามล็อกเนื้อหาไว้หลังความสนิท** — ความสนิทเปลี่ยนแค่ "คำทัก" เท่านั้น
     งาน/ร้าน/ของทุกอย่างยังทำได้เหมือนเดิมตั้งแต่วันแรก (กติกาเหล็กข้อ 1 ห้ามมี dead end)
   - **เก็บเฉพาะคนที่เคยช่วยจริง** ไม่ seed ทั้งเมือง (NPC 69 คน · save ต้องไม่บวมฟรีๆ)
   - ความถนัด = **เพิ่มโอกาส ไม่ใช่ล็อก** — ล็อกเมื่อไหร่เด็กจะเจอโจทย์แบบเดิมทุกวัน

   📁 ไฟล์นี้ **ไม่แตะ DOM/WebGL เลย** (แบบเดียวกับ js/house-quests.js / js/house-pet-care.js)
      ฝั่งหน้าจอเรียกผ่าน `window.HouseNeighbour` เท่านั้น
   ============================================================ */
function HOUSE_NEIGHBOUR(kit){
  const K = kit || {};
  const load = K.load || (()=>({}));
  const save = K.save || (()=>{});
  const dayKey = K.dayKey || (()=>'');

  const NB_V = 1;
  /* ขั้นความสนิท — วัดจาก "จำนวนงานที่เคยช่วยคนนี้" เท่านั้น (ไม่มีทางลดลง)
     ⚠ ตัวเลขนี้ตั้งให้ถึงขั้น 1 ได้ตั้งแต่งานแรก เด็กจะได้เห็นผลทันทีในวันแรกที่เล่น */
  const LV = [0, 1, 3, 7];          /* งานที่ต้องช่วย: ขั้น 1 = 1 · ขั้น 2 = 3 · ขั้น 3 = 7 */
  const LV_MAX = 3;

  let B = null;

  function blank(){ return {v:NB_V, who:{}}; }
  function sync(){
    const d = load() || {};
    let b = d.npc;
    let dirty = false;
    if(!b || typeof b !== 'object' || (b.v | 0) !== NB_V){ b = blank(); dirty = true; }
    if(!b.who || typeof b.who !== 'object'){ b.who = {}; dirty = true; }
    B = b;
    if(dirty) persist();
    return b;
  }
  function persist(){ if(B) save({npc: B}); }
  function state(){ return B || sync(); }
  function rec(id){ const s = state(); return (id && s.who[id]) || null; }

  /* ---------- จดว่าเด็กช่วยคนนี้ 1 งาน ----------
     เรียกจาก `finishQuest()` ใน js/house.js ตอนเควสต์จบจริงเท่านั้น
     ⚠ ห้ามเรียกตอน "รับงาน" — รับแล้วไม่ทำก็จะนับ กลายเป็นสนิทโดยไม่ได้ช่วยอะไร */
  function onQuestDone(npcId, mech){
    if(!npcId) return null;
    const s = state();
    const r = s.who[npcId] || {n:0, d:'', m:{}};
    const before = levelOf(r.n | 0);
    r.n = (r.n | 0) + 1;
    r.d = dayKey();
    if(mech){ r.m = r.m || {}; r.m[mech] = (r.m[mech] | 0) + 1; }
    s.who[npcId] = r;
    persist();
    const after = levelOf(r.n);
    return {n: r.n, level: after, levelUp: after > before};
  }
  function levelOf(n){
    let lv = 0;
    for(let i = 1; i <= LV_MAX; i++) if((n | 0) >= LV[i]) lv = i;
    return lv;
  }
  function level(npcId){ const r = rec(npcId); return r ? levelOf(r.n) : 0; }
  function doneCount(npcId){ const r = rec(npcId); return r ? (r.n | 0) : 0; }
  function knownIds(){ return Object.keys(state().who); }

  /* ---------- 💬 คำทักที่ "จำได้ว่าเด็กเคยช่วย" ----------
     คืน null = ยังไม่เคยช่วยคนนี้เลย ⇒ ใช้บทพูดปกติของ NPC เหมือนเดิม
     ⚠ ข้อความต้องเป็นคำขอบคุณ/ทักทายล้วน **ห้ามมีคำต่อว่า/เร่ง** แม้เด็กจะหายไปนาน */
  const L1 = [
    'ขอบใจที่เคยมาช่วยนะ 😊',
    'สวัสดีจ้ะ! คราวก่อนหนูช่วยได้ดีมากเลย',
    'ดีใจที่เจอกันอีกนะ 💗',
  ];
  const L2 = [
    'มาอีกแล้วเหรอ ดีใจจัง! หนูช่วยป้า/ลุงมาหลายครั้งแล้วนะ',
    'เห็นหน้าหนูแล้วสดใสเลย ขอบใจที่แวะมาบ่อยๆ นะ 🌼',
    'หนูเป็นเด็กขยันจริงๆ ช่วยงานมาตั้งหลายครั้งแล้ว',
  ];
  const L3 = [
    'นี่มันเพื่อนคนเก่งของเรานี่เอง! 🌟',
    'ถ้ามีงานยากๆ เราคิดถึงหนูเป็นคนแรกเลยนะ',
    'หนูช่วยเรามาเยอะมาก ขอบใจจากใจจริงๆ นะ 💛',
  ];
  function greeting(npcId){
    const r = rec(npcId);
    if(!r || !(r.n | 0)) return null;
    const lv = levelOf(r.n);
    const pool = lv >= 3 ? L3 : (lv === 2 ? L2 : L1);
    /* วนข้อความไปเรื่อยๆ ตามจำนวนครั้งที่ช่วย ⇒ ไม่ซ้ำประโยคเดิมทุกครั้งที่คุย */
    return pool[(r.n + (r.t | 0)) % pool.length];
  }
  /* หมุนประโยคทักทายเวลาคุยซ้ำในวันเดียวกัน (ไม่บันทึกลง save — เป็นค่าชั่วคราวในหน่วยความจำ) */
  function bumpTalk(npcId){ const r = rec(npcId); if(r) r.t = (r.t | 0) + 1; }

  /* ---------- 🎯 งานที่เด็ก "ถนัด" ----------
     สเปกข้อ 57.3: ช่วยคนเดิมบ่อยๆ → เขาจะขอเป็นงานที่เด็กถนัด
     ⚠ **เพิ่มโอกาส ไม่ใช่ล็อก** — คืนกลไกที่เด็กทำให้คนนี้บ่อยที่สุด ให้ตัวสุ่มหยิบไปใช้
       ตามสัดส่วนที่กำหนดใน js/house-quests.js (ไม่ใช่ทุกวัน)
     ⚠ ต้องสนิทถึงขั้น 2 ก่อน (ช่วยมาแล้ว ≥3 งาน) ไม่งั้นงานแรกๆ ที่บังเอิญซ้ำกัน
       จะกลายเป็น "งานประจำ" ของคนนั้นทันที เด็กจะเจอแบบเดิมตั้งแต่วันที่สอง */
  function favMech(npcId){
    const r = rec(npcId);
    if(!r || levelOf(r.n) < 2 || !r.m) return '';
    let best = '', bn = 0;
    Object.keys(r.m).forEach(k=>{ const n = r.m[k] | 0; if(n > bn){ bn = n; best = k; } });
    return bn >= 2 ? best : '';
  }
  /* กลไกที่เด็กทำบ่อยที่สุด "ทั้งเมือง" (เผื่อใช้กับคนที่ยังไม่เคยเจอกัน) */
  function topMechs(n){
    const s = state(), tot = {};
    Object.keys(s.who).forEach(id=>{
      const m = s.who[id].m || {};
      Object.keys(m).forEach(k=>{ tot[k] = (tot[k] | 0) + (m[k] | 0); });
    });
    return Object.keys(tot).sort((a, b) => tot[b] - tot[a]).slice(0, n || 3);
  }

  return {
    onQuestDone, level, doneCount, greeting, bumpTalk, favMech, topMechs,
    knownIds, state, sync,
    LV, LV_MAX, levelOf,
  };
}
if(typeof window !== 'undefined') window.HOUSE_NEIGHBOUR = HOUSE_NEIGHBOUR;
