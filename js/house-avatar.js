/* ============================================================
   บ้านของหนู — ตัวละครและของแต่งตัว (แยกออกจาก js/house.js เมื่อ 2026-08-12)

   ทำไมต้องแยก: หลังเฟส 8 ขยายของแต่งตัวเป็น 114 แบบ ก้อนนี้โตเป็น ~1,040 บรรทัด
   และจะโตอีกทุกครั้งที่เพิ่มของแต่งตัว ⇒ แยกออกมาให้ js/house.js เหลือแต่ระบบเกม

   ไฟล์นี้วาด "ตัวเด็ก/พ่อแม่" ทั้งตัว: ทรงผม · ดวงตา · ลายเสื้อ · เครื่องหัว · แว่น ·
   ของสะพาย · ของถือ · แบบรองเท้า — **ไม่แตะ DOM/ฉาก/ตัวแปรเกมเลย** รับ cfg เข้า คืน THREE.Group ออก
   (ชาวบ้านในเมือง `buildVillager` ยังอยู่ที่ js/house.js เพราะผูกกับระบบ merge/ป้ายงานของฉาก)

   ⚠ **index ของแบบทุกแถวห้ามขยับ เพิ่มได้แต่ต่อท้าย** — ค่าที่เด็กเลือกเก็บเป็น index ตรงๆ ใน save
     การแทรกกลาง = ตัวละครของเด็กที่เล่นอยู่เปลี่ยนหน้าตาเองทั้งเมือง
   ⚠ ประกาศ global HOUSE_AVATAR(kit) คืนฟังก์ชันวาดให้ js/house.js ดึงไปใช้เป็นชื่อเดิมทุกตัว
     (รูปแบบเดียวกับ js/house-furniture.js) ⇒ ต้องโหลด **ก่อน** js/house.js เสมอ
   ============================================================ */
(function(){
  'use strict';

  window.HOUSE_AVATAR = function(kit){
    const THREE = kit.THREE;
    const box = kit.box, sphere = kit.sphere, cyl = kit.cyl, cone = kit.cone, torus = kit.torus;
    const toonMat = kit.toonMat, softMat = kit.softMat, petShade = kit.petShade;
    const roundedBoxGeo = kit.roundedBoxGeo;
    /* ⚠ `hShadows` ฝั่ง js/house.js เป็น `let` ที่ถูกตั้งค่า **ทีหลัง** ตอน initThreeCore
       (เปิดเงาเฉพาะจอใหญ่) ⇒ ต้องรับเป็นฟังก์ชันแล้วอ่านสดทุกครั้งที่วาด
       ถ้ารับเป็นค่าจะได้ `false` ค้างตลอดกาล = ตัวละครไม่มีเงาทั้งเกมโดยไม่มี error ให้จับ */
    const hSh = kit.hShadows;
    /* คลังสี/จำนวนแบบของแต่ละแถว — ต้นทางคือ js/house-map.js (ห่อ IIFE ⇒ ต้องรับผ่าน kit)
       ⚠ ชื่อต้องตรงกับที่โค้ดข้างล่างใช้เป๊ะ ไม่งั้นจะพังตอนวาดจริงเท่านั้น (syntax check จับไม่ได้) */
    const H_SKIN = kit.H_SKIN, H_HAIR_COLORS = kit.H_HAIR_COLORS, H_EYE_COLORS = kit.H_EYE_COLORS,
          H_SHIRT_COLORS = kit.H_SHIRT_COLORS, H_BOTTOM_COLORS = kit.H_BOTTOM_COLORS,
          H_SHOE_COLORS = kit.H_SHOE_COLORS, H_ACC_COLORS = kit.H_ACC_COLORS,
          H_PATTERN_N = kit.H_PATTERN_N, H_HAT_N = kit.H_HAT_N, H_GLASS_N = kit.H_GLASS_N,
          H_BAG_N = kit.H_BAG_N, H_HOLD_N = kit.H_HOLD_N,
          H_HAIR_N = kit.H_HAIR_N, H_EYE_N = kit.H_EYE_N, H_DEFAULT_CHAR = kit.H_DEFAULT_CHAR;

/* เปลือกผมหลัก: โดมขอบมนครอบหัวเป็นก้อนเดียว — ทุกทรงต่อยอดจากเปลือกนี้แล้วเอาชิ้นเสริม
   (หน้าม้า/หาง/มวย) วางทับสีเดียวกัน ให้ toon shading รวมเป็นผมก้อนเดียว ไม่ใช่บล็อกแปะกัน */
function hairShell(head, c, o){
  o = o || {};
  const d = o.d ?? .76;
  const w = o.w ?? .8, h = o.h + .2 ?? .5, y = o.y ?? .16;
  const m = box(w, h, d, c, o.r ?? .28);
  /* หน้าเปลือกผมต้องไม่ล้ำมาข้างหน้าถึงระดับตา (ตาอยู่ z ~.345) — คุมให้หน้าสุดอยู่ที่ ~.3 เสมอ */
  m.position.set(0, y, o.z ?? (.31 - d/2));
  head.add(m);
  /* จำยอด/ความกว้างเปลือกผมไว้ ให้หน้าม้าอ้างอิงทำให้ "สูงเท่ากัน" และกว้างพอดีเชื่อมเป็นก้อนเดียว */
  head.userData._hairTop = y + h/2;
  head.userData._hairW = w;
  return m;
}
/* หน้าม้า/ไรผมด้านหน้า — แผ่นหน้าผากด้านหน้า (z พ้นหน้าหัว) เต็มจากเหนือคิ้ว (bottom) ขึ้นไป "จรดยอดเปลือกผม" (top เท่ากันเสมอ)
   ทับหน้าเปลือกผมลึก + สีเดียวกัน → toon shading รวมเป็นผมก้อนเดียว smooth ไม่เป็นแผ่นปะติด ไม่มีขั้น/ช่องผิวคั่น
   ขอบล่างมนหนา (r สูง) ให้ไรผมโค้งนุ่มน่ารัก */
function hairBang(head, c, o){
  o = o || {};
  const top = o.top ?? head.userData._hairTop - 0.05 ?? .4;     /* เท่ายอดเปลือกผมเสมอ → บน-หน้าสูงเท่ากัน */
  const bottom = Math.max(.13, o.drop ?? .14);           /* ขอบล่างเหนือตา กันปิดตา (คลุมหน้าผากเต็ม) */
  const H = Math.max(.14, top - bottom);
  const w = o.w ?? ((head.userData._hairW ?? .8) - .22);  /* กว้างพอดีขอบเปลือกผม เชื่อมด้านข้างไม่มีช่อง */
  /* rounding พอประมาณ (มนนุ่มแต่ไม่ม้วนจนหน้าผากโล่ง) — หน้าฟริงจ์เต็มคลุมถึงระดับคิ้ว */
  const m = box(w, H, o.d ?? .16, c, o.r ?? .07);
  m.position.set(o.x ?? 0, (top + bottom)/2, o.z ?? .27);
  if(o.rz) m.rotation.z = o.rz;
  if(o.rx) m.rotation.x = o.rx;
  head.add(m);
  return m;
}
/* เปีย/หางผมเป็นลูกกลมเรียงต่อ (นุ่ม ดูเป็นเส้นผมมากกว่าแท่งบล็อก) */
function hairStrand(head, c, x, y, z, n, r, dy){
  for(let i=0; i<n; i++){
    const b = sphere(r - i*.008, c);
    b.position.set(x, y - i*(dy ?? .19), z);
    head.add(b);
  }
}
function hairSpike(head, c, x, y, z, h){
  const s = new THREE.Mesh(new THREE.ConeGeometry(.085, h ?? .24, 6), toonMat(c));
  s.castShadow = hSh(); s.position.set(x, y, z); head.add(s);
}
/* ผมข้าง/หาง/แกละ เป็นทรงกระบอกเรียว (โคนใหญ่ปลายเรียว) ผิวโค้งมนรอบตัว ไม่มีหน้าแบน จึงไม่ดูเป็นแผ่น
   sz>1 = แบนหน้า-หลังให้แผ่คลุมข้างหน้าเป็นม่านผม, tilt = เอียงเข้าหาคาง/สะบัดออก */
function hairLock(head, c, o){
  o = o || {};
  const m = new THREE.Mesh(new THREE.CylinderGeometry(o.rt ?? .15, o.rb ?? .09, o.h ?? .55, 14), toonMat(c));
  m.castShadow = hSh();
  m.scale.set(o.sx ?? 1, 1, o.sz ?? 1);
  m.position.set(o.x ?? 0, o.y ?? -.05, o.z ?? .02);
  if(o.tilt) m.rotation.z = o.tilt;
  if(o.rx) m.rotation.x = o.rx;
  head.add(m); return m;
}
/* cap ผมพื้นฐาน = เปลือกผม (โดมมน) + หน้าม้า เชื่อมเป็นก้อนเดียว smooth คลุมหน้าผากถึงเหนือตา
   ใช้เป็นฐาน "ทุกทรง" ให้ผมบน-หน้าติดกันสูงเท่ากันเสมอ ไม่เป็นแผ่นปะแยก (fringe:false = ไม่เอาหน้าม้า เช่นโมฮอว์ก/ปอมปาดัวร์) */
function hairCap(head, c, o){
  o = o || {};
  hairShell(head, c, {h:o.h ?? .48, y:o.y ?? .18, d:o.d ?? .78, w:o.w ?? .82, z:o.z, r:o.r});
  if(o.fringe !== false) hairBang(head, c, {w:o.fw, drop:o.drop, z:o.fz, rz:o.rz, x:o.fx, d:o.fd});
}
function addHair(head, girl, style, hex){
  const c = hex;
  if(!girl){
    /* ---- ทรงผมเด็กชาย 6 แบบ (สั้นเป็นหลัก) ---- */
    switch(style){
      case 0: /* แสกข้าง (หน้าม้าเฉียงข้าง) */
        hairCap(head,c,{h:.47,y:.19,rz:.17,fx:-.04}); break;
      case 1: /* สไปก์ตั้ง (หน้าม้าเตี้ย + หนามบน) */
        /* ⚠ ความลึก d ปล่อยเป็นค่าปริยาย (.78) ให้ **ท้ายทอยยาวเท่าเบอร์ 1** (ผู้ใช้แจ้ง 2026-08-09
           ว่าเบอร์ 2 ด้านหลังสั้นกว่าเบอร์ 1) — หน้าผมยึดที่ z=.31 เสมอ เพิ่ม d จึงยืดเฉพาะด้านหลัง */
        hairCap(head,c,{h:.4,y:.2,drop:.16});
        [[-.2,.03],[0,-.04],[.2,.03],[-.1,-.2],[.1,-.2]].forEach(p=>hairSpike(head,c,p[0],.46,p[1])); break;
      case 2: /* บ๊อบเด็ก/หน้าม้าเต็ม */
        hairCap(head,c,{h:.5,y:.16,d:.76,w:.82,drop:.12}); break;
      case 3: /* หยิกฟู (ก้อนกลมรอบหัว) */
        hairCap(head,c,{h:.4,y:.2,d:.7,drop:.15});
        [[0,.45,.13,.16],[.26,.43,.06,.15],[-.26,.43,.06,.15],[.17,.44,-.22,.14],[-.17,.44,-.22,.14],[0,.4,-.32,.14]]
          .forEach(p=>{ const b=sphere(p[3],c); b.position.set(p[0],p[1],p[2]); head.add(b); }); break;
      case 4: /* ผมเรียบมีเส้นชี้ (อาโฮเกะ) น่ารัก */
        hairCap(head,c,{h:.46,y:.19,d:.72,w:.78});
        { [[-.01,.5,.055],[.05,.61,.046],[.13,.67,.037],[.22,.68,.03]]
            .forEach(p=>{ const a=sphere(p[2],c); a.position.set(p[0],p[1],.02); head.add(a); }); } break;
      case 5: /* มัดจุกเล็กด้านหลัง */
        /* ⚠ **ด้านข้างต้องเท่าเบอร์ 1 เป๊ะ** (ผู้ใช้สั่ง 2026-08-18) — ของเดิม {h:.44,y:.19}
           ทำให้เปลือกผมสูง .64 ฐานอยู่ที่ y −.13 คือ **ยาวลงมาคลุมข้างหน้าต่ำกว่าเบอร์ 1 ราว .03**
           เห็นเป็นผมข้างปิดหูหนากว่าทรงสั้นอื่นๆ ทั้งที่ควรเป็นทรงสั้นเหมือนกัน
           ⇒ ใช้ค่า cap ชุดเดียวกับเบอร์ 1 ทุกตัว (h .4 · y .2 · drop .16) ⇒ ฐานข้างอยู่ที่ −.10 เท่ากัน
           ⚠ ที่ยังแยกออกจากเบอร์ 1 ได้คือ **จุกท้ายทอย** (เบอร์ 1 เป็นหนามบน) ไม่ใช่ความยาวข้าง */
        hairCap(head,c,{h:.4,y:.2,drop:.16});
        { const bun=sphere(.15,c); bun.position.set(0,.34,-.44); head.add(bun); } break;
      /* ---- เฟส 8 (+6) ---- ต่อท้ายเสมอ ห้ามแทรกกลาง (index ผูกกับ save ของเด็ก) */
      case 6: /* รองทรงสั้นเกรียน */
        hairCap(head,c,{h:.36,y:.22,d:.68,w:.76,drop:.08}); break;
      case 7: /* แสกกลาง */
        hairCap(head,c,{h:.46,y:.19,fw:.7,drop:.14});
        { const part=box(.05,.1,.16,petShade(c,.9)); part.position.set(0,.34,.28); head.add(part); } break;
      case 8: /* ผมหยิกฟูสูง (อาฟโร) */
        hairCap(head,c,{h:.44,y:.2,d:.74,w:.8,drop:.12});
        [[0,.56,.06,.19],[.3,.46,.02,.16],[-.3,.46,.02,.16],[.2,.52,-.24,.15],[-.2,.52,-.24,.15]]
          .forEach(p=>{ const b=sphere(p[3],c); b.position.set(p[0],p[1],p[2]); head.add(b); }); break;
      case 9: /* ผมม้าหน้าตรง (หน้าม้าหนา) */
        hairCap(head,c,{h:.48,y:.17,d:.76,w:.84,drop:.2,fw:.78}); break;
      /* 🐞 **ผมโผล่มาตรงหน้าผาก** (ผู้ใช้แจ้ง 2026-08-17 — เบอร์ 10 กับ 11)
         ต้นเหตุเดียวกันทั้งคู่: หน้าเปลือกผมอยู่ที่ z .31 ซึ่งชิดผิวหน้า (z .33) มาก
         กะโหลกเป็นกล่อง **ขอบมน** ⇒ ช่วงหน้าผากผิวหน้าโค้งถอยกลับไปต่ำกว่า .33
         มุมหน้า-ล่างของเปลือกผมจึงแทงทะลุออกมาเป็นลิ่มกลางหน้าผาก
         ทรงอื่นไม่เห็นเพราะมีหน้าม้า (z .27 หนา .16 = หน้าสุด .35) บังไว้ให้พอดี
         ⇒ แก้ตรงจุด **ไม่แตะ hairShell** (ทรงอื่นทั้ง 22 ทรงตั้งค่ามาพอดีกับ z .31 แล้ว) */
      case 10: /* ผมกะลา (มัชรูม) คลุมหู */
        /* 🔄 **เปลี่ยนจากโมฮอว์กเป็นทรงกะลา 2026-08-17 (ผู้ใช้สั่ง — ไม่เอาโมฮอว์ก)**
           เลือกทรงกะลาเพราะเป็นทรงเด็กชายไทยคลาสสิก และ **เงารวมไม่ซ้ำใครในชุด**:
             ทรงอื่นจบเหนือหู (เปลือกผมกว้างสุด .86 สูงจบที่ราวคิ้ว) — ใบนี้ผายกว้างและ
             **ลงมาคลุมหูจบเป็นเส้นตรงระดับกราม** ⇒ ดูจาก 32px ก็แยกออก
           ⚠ ปีกผมข้างใช้ `hairLock` (ทรงกระบอกเรียว ผิวโค้งรอบตัว) **ห้ามใช้กล่อง** —
             ผู้ใช้เคยตีกลับ "ผมยาวประบ่า" เพราะปอยข้างเป็นแท่งสี่เหลี่ยม ดูเป็นแผ่นไม่เป็นเส้นผม */
        hairCap(head,c,{h:.50,y:.16,d:.80,w:.86,drop:.12,fw:.80});
        [-1,1].forEach(s=>hairLock(head,c,{x:.40*s,y:-.02,z:-.02,h:.36,rt:.15,rb:.13,sx:.9,sz:1.35}));
        break;
      case 11: /* ผมม้าเฉียงยาว (แสกข้างปัดหน้า) */
        /* 🔄 **เปลี่ยนทรงเป็นรอบที่ 3 · 2026-08-17** — ประวัติที่ผู้ใช้ตีกลับมาแล้ว:
             "ผมยาวประบ่า" (ปอยข้างเป็นแท่งสี่เหลี่ยม ไม่เป็นเส้นผม) →
             "ปอมปาดัวร์" (ก้อนกลมบนหัว เหมือนไอศกรีมโคน) →
             "มัดจุกซามูไร" (ยังไม่สวย)
           ⇒ เลิกทำทรงที่ "เพิ่มก้อนบนหัว" ทั้งหมด เพราะในสไตล์บล็อกนี้ก้อนกลมบนหัวออกมาเป็นลูกบอลเสมอ
             เปลี่ยนมาเล่นที่ **เส้นทแยงบนหน้าผาก** แทน — ปอยผมพาดเฉียงคือลายเส้นที่ไม่มีทรงไหนในชุดมี
             (ทรงอื่นเป็นเส้นแนวนอน/โค้งรอบหัวหมด) ⇒ แยกออกทันทีทั้งบนโมเดลและบนไอคอน 32px */
        hairCap(head,c,{h:.46,y:.18,d:.78,w:.84,drop:.17,fw:.76});
        { /* ปอยหลักพาดเฉียงจากแสกด้านขวาลงมาทางซ้าย */
          const sw = box(.54,.16,.13,c,.06); sw.rotation.z = .30;
          sw.position.set(-.03,.34,.30); head.add(sw);
          /* ปลายปอยตกลงที่ขมับซ้าย — วางนอกแนวดวงตา (ตาอยู่ x ±.16) จะได้ไม่บังตา */
          const tip = box(.16,.24,.12,c,.06); tip.rotation.z = .42;
          tip.position.set(-.33,.25,.27); head.add(tip); }
        break;
    }
  }else{
    /* ---- ทรงผมเด็กหญิง 6 แบบ (ยาว/ตกแต่งมากขึ้น) ---- */
    switch(style){
      case 0: /* หางม้าสูง */
        hairCap(head,c,{h:.46,y:.19,fw:.66});
        { const tie=sphere(.1,c); tie.position.set(0,.42,-.3); head.add(tie); }
        hairLock(head,c,{x:0,y:.12,z:-.46,h:.66,rt:.15,rb:.08,sz:1.1,rx:.26}); break;
      case 1: /* สองแกละ — ตัวเปียคงแบบแท่งขอบมนของ version ก่อน (ตามคำขอ) ไม่ใช้ hairLock ทรงกระบอก */
        hairCap(head,c,{h:.48,y:.17,d:.74,fw:.68});
        [-1,1].forEach(s=>{ const tie=sphere(.1,c); tie.position.set(.42*s,.16,-.04); head.add(tie);
          const p=box(.13,.55,.13,c); p.position.set(.51*s,-.17,-.03); p.rotation.z=.175*s; head.add(p); }); break;
      case 2: /* เปียคู่ */
        hairCap(head,c,{h:.48,y:.17,d:.74,fw:.68});
        [-1,1].forEach(s=>hairStrand(head,c,.44*s,.08,-.04,4,.11)); break;
      case 3: /* มวยผมบนหัว */
        hairCap(head,c,{h:.46,y:.18,fw:.66});
        { const bun=sphere(.19,c); bun.position.set(0,.52,-.02); head.add(bun);
          const ring=new THREE.Mesh(new THREE.TorusGeometry(.15,.045,8,16), toonMat(c));
          ring.rotation.x=Math.PI/2; ring.position.set(0,.4,-.02); ring.castShadow=hSh(); head.add(ring); } break;
      case 4: /* ยาวลอนสลวย */
        hairCap(head,c,{h:.5,y:.13,d:.82,w:.86,drop:.13});
        [-1,1].forEach(s=>hairStrand(head,c,.44*s,.02,-.04,4,.16,.22)); break;
      case 5: /* เปียข้างเดี่ยว */
        hairCap(head,c,{h:.5,y:.13,d:.8,w:.84,rz:.14});
        hairStrand(head,c,.4,.04,.12,4,.12,.2); break;
      /* ---- เฟส 8 (+6) ---- */
      case 6: /* บ๊อบสั้นทันสมัย */
        hairCap(head,c,{h:.5,y:.16,d:.76,w:.84,drop:.16});
        [-1,1].forEach(s=>{ const tip=box(.13,.2,.15,c,.05); tip.position.set(.38*s,-.02,.04); head.add(tip); }); break;
      case 7: /* หางม้าคู่สูง */
        hairCap(head,c,{h:.46,y:.18,fw:.66});
        [-1,1].forEach(s=>{ const tie=sphere(.09,c); tie.position.set(.3*s,.44,-.12); head.add(tie);
          hairLock(head,c,{x:.34*s,y:.24,z:-.3,h:.5,rt:.12,rb:.07,sz:1,rx:.3}); }); break;
      case 8: /* มวยผมคู่ (ดังโงะ) */
        hairCap(head,c,{h:.46,y:.18,fw:.66});
        [-1,1].forEach(s=>{ const bun=sphere(.16,c); bun.position.set(.34*s,.44,-.02); head.add(bun); }); break;
      case 9: /* ผมหยิกยาว */
        hairCap(head,c,{h:.5,y:.14,d:.82,w:.86,drop:.14});
        [-1,1].forEach(s=>{ for(let i=0;i<3;i++){ const cu=sphere(.14-i*.02,c);
          cu.position.set(.4*s,-.02-i*.2,-.04+(i%2?.06:-.06)); head.add(cu); } }); break;
      case 10: /* ผมสั้นซอยมีกิ๊บ */
        hairCap(head,c,{h:.46,y:.18,d:.74,w:.8,drop:.13});
        { const clip=box(.14,.05,.06,0xff6f91,.02); clip.position.set(.26,.32,.24); head.add(clip); } break;
      case 11: /* เปียยาวข้างเดียวพาดหน้า */
        hairCap(head,c,{h:.5,y:.14,d:.8,w:.84,rz:.16});
        hairStrand(head,c,.36,.06,.16,5,.13,.22);
        { const tie=sphere(.07,0xff6f91); tie.position.set(.36,-.42,.12); head.add(tie); } break;
    }
  }
}

/* 👁️ **ลูกตาทรงกลมสีขาวต้อง "ฝังอยู่ในหน้า" ไม่ใช่ลูกปิงปองแปะหน้า** (ผู้ใช้แจ้ง 2026-08-17)
   ผิวหน้าอยู่ที่ z .33 — ของเดิมวางลูกกลม **เต็มใบ** ไว้ที่ z .345 ⇒ ลูกรัศมี .11 ยื่นพ้นหน้าไปถึง .455
     (เกือบครึ่งลูกลอยอยู่นอกหน้า) มองจากมุมเฉียงเห็นเป็นลูกบอลติดกาวชัดเจน
   ⇒ แบนตามแกน z + ดันจุดกึ่งกลางถอยเข้าไปในหัว ⇒ โผล่พ้นผิวหน้าแค่ ~.01-.02 พอเป็นตาโปนน่ารัก
   ⚠ **ห้ามลด r** — ขนาดตาที่เห็น "จากด้านหน้า" คือเอกลักษณ์ของแต่ละแบบ ต้องเท่าเดิมเป๊ะทุกแบบ
     (แก้แค่ความลึก ⇒ หน้าตรงเหมือนเดิม 100% เปลี่ยนเฉพาะมุมเฉียง/ด้านข้าง)
   ⚠ ใช้เฉพาะแบบที่เป็น "ลูกกลมสีขาว" (1/4/7/8/10) ตามที่ผู้ใช้ระบุ — แบบจุด/ขีด/โทรัสไม่ได้โปนอยู่แล้ว */
const EYE_FLAT = .42;      /* แบนแค่ไหนตามแกน z (1 = ลูกกลมเต็มใบแบบเดิม) */
const EYE_Z    = .30;      /* จุดกึ่งกลางลูกตา — ถอยเข้าไปในหัวจากผิวหน้า .33 */
function addEyes(head, style, hex){
  const F = .345; /* ยื่นพ้นหน้า (หน้า head หนา .33) กัน z-fight */
  const mk = (fn) => [-1,1].forEach(s=>fn(s));
  /* ตาขาว — คืนค่า "ผิวหน้าของลูกตา" ให้ตาดำ/ประกาย/ขนตา วางต่อได้พอดีโดยไม่ต้องเดาเลข */
  const white = (x, y, r) => {
    const w = sphere(r, 0xffffff, 12); w.scale.z = EYE_FLAT;
    w.position.set(x, y, EYE_Z); head.add(w);
    return EYE_Z + r*EYE_FLAT;
  };
  /* ตาดำ — แบนเท่าตาขาว แล้ววางให้ผิวหน้าโผล่พ้นตาขาวนิดเดียว (ไม่งั้นจมหายเข้าไปในตาขาว) */
  const pupil = (x, y, r, front) => {
    const i = sphere(r, hex, 10); i.scale.z = EYE_FLAT;
    i.position.set(x, y, front - r*EYE_FLAT*.55); head.add(i);
  };
  switch(style){
    case 0: mk(s=>{ const e = sphere(.05,hex,8); e.position.set(.15*s,.04,F); head.add(e); }); break;      /* จุดกลม */
    case 1: mk(s=>{ const f = white(.16*s,.04,.085); pupil(.16*s,.04,.045,f); }); break;                   /* กลมโต */
    case 2: mk(s=>{ [[-.03,.5],[.03,-.5]].forEach(p=>{ const b = box(.08,.03,.02,hex);                     /* ยิ้มหยี ∧ */
                    b.position.set(.15*s+p[0]*s,.05+Math.abs(p[0]),F); b.rotation.z = p[1]*s; head.add(b); }); }); break;
    case 3: mk(s=>{ const b = box(.12,.045,.02,hex); b.position.set(.16*s,.04,F); head.add(b); }); break;  /* ตารีนอน */
    case 4: mk(s=>{ const f = white(.16*s,.03,.08); pupil(.16*s,.03,.042,f);                              /* โตมีขนตา */
                    const l = box(.1,.025,.02,0x33261d); l.position.set(.16*s,.13,f-.01); l.rotation.z = -.25*s; head.add(l); }); break;
    case 5: mk(s=>{ const e = sphere(.05,hex,8); e.scale.set(.7,1.5,.6); e.position.set(.15*s,.05,F); head.add(e); }); break; /* รีตั้ง */
    case 6: mk(s=>{ const t = new THREE.Mesh(new THREE.TorusGeometry(.055,.016,6,10,Math.PI), toonMat(hex));  /* หยีปิดสุข ∩ */
                    t.position.set(.15*s,.03,F); head.add(t); }); break;
    case 7: mk(s=>{ const f = white(.16*s,.04,.095); pupil(.16*s,.04,.055,f);                             /* แบ๊วประกาย */
                    const h = sphere(.02,0xffffff,6); h.scale.z = EYE_FLAT;
                    h.position.set(.19*s,.08,f+.012); head.add(h); }); break;
    /* ---- เฟส 8 (+4) ---- */
    case 8: mk(s=>{ const f = white(.16*s,.04,.085); pupil(.16*s,.02,.045,f);                             /* ตาง่วง (เปลือกตาตก) */
                    const lid = box(.16,.05,.03,0xffd9b8); lid.position.set(.16*s,.1,f-.005); head.add(lid); }); break;
    /* ตาหัวใจ — ⚠ ของเดิมเป็น "ลูกกลม 2 ลูก + กล่องหมุน 45°" ดูเป็นก้อนสีชมพู ไม่ใช่หัวใจ
       ⇒ ใช้ทรงหัวใจกลาง `chHeart()` ตัวเดียวกับลายเสื้อ/แว่น (ผู้ใช้แจ้ง 2026-08-19) */
    case 9: mk(s=>{ const h = chHeart(.075, 0xff5a7a);
                    h.position.set(.16*s, .06, F + .01); head.add(h); }); break;
    case 10: mk(s=>{ const f = white(.17*s,.04,.11); pupil(.17*s,.04,.062,f);                             /* ตากลมโตมาก */
                     const h = sphere(.026,0xffffff,6); h.scale.z = EYE_FLAT;
                     h.position.set(.21*s,.09,f+.012); head.add(h);
                     const h2 = sphere(.014,0xffffff,6); h2.scale.z = EYE_FLAT;
                     h2.position.set(.13*s,.0,f+.012); head.add(h2); }); break;
    case 11: mk(s=>{ const t = new THREE.Mesh(new THREE.TorusGeometry(.06,.017,6,10,Math.PI), toonMat(hex));/* ตาปิดยิ้ม ∪ */
                     t.rotation.z = Math.PI; t.position.set(.15*s,.05,F); head.add(t);
                     const bl = sphere(.035,0xffb3b3,8); bl.scale.set(1.4,.8,.4);
                     bl.position.set(.19*s,-.06,F); head.add(bl); }); break;
  }
}

/* ============================================================
   ชุดของเด็ก: ลายเสื้อ + ของแต่งตัว (เครื่องหัว / แว่น / ของสะพายหลัง / ของถือ)
   ------------------------------------------------------------
   ⚠ กติกาที่ผู้ใช้ย้ำไว้ (2026-08-04) ห้ามย้อนโดยไม่ถาม:
     **ลายบนชุดต้องเป็นเนื้อเดียวกับชุด ห้ามดูเป็นก้อน object มาแปะทับ**
     ⇒ 1) ลายทุกแบบใช้ทรงกล่องขอบมนชุดเดียวกับตัวเสื้อ ยื่นพ้นผิวเสื้อแค่ ~.005-.01 (แค่พอไม่ z-fight)
       2) ลายที่พันรอบตัว (ทางขวาง/เอี๊ยม/ปกกะลาสี) ต้องพัน "แขนที่ความสูงเดียวกัน" ด้วยเสมอ
          ไม่งั้นแถบจะขาดตอนตรงไหล่ กลายเป็นสติกเกอร์แปะหน้าอกทันที
       3) ลายจุด/ดาว/หัวใจ วางได้เฉพาะกลางหน้าอก-หลัง (|x|<.15) เพราะขอบเสื้อโค้งมน ถ้าไปวางริมจะลอย
   ตัวเลขทรงตัวเสื้อ/แขนด้านล่างต้องตรงกับ buildCharacter เป๊ะ (แก้ที่ไหนต้องแก้ให้ตรงกัน)
   ============================================================ */
const CH_BW = .52, CH_BH = .5, CH_BD = .32, CH_BY = .68;   /* ตัวเสื้อ: กว้าง สูง หนา และความสูงจุดกึ่งกลาง */
const CH_AW = .15, CH_AD = .16, CH_SHO_Y = .9, CH_ARM_T = .16;  /* แขน + ความสูงไหล่ + มุมกางแขน */
/* สีลายบนเสื้อ: เสื้อแบบ 2 สีใช้สีที่สองเลย · เสื้อสีเดียวเลือกสีตัดกันให้อัตโนมัติ
   (เสื้อสว่าง → ลายเข้มลง, เสื้อเข้ม → ลายครีม) ลายจะได้เห็นชัดทุกสีเสื้อโดยไม่ต้องให้เด็กเลือกเอง */
function chPatColor(shirtC, shirtB){
  if(shirtB != null && shirtB !== shirtC) return shirtB;
  const lum = (((shirtC>>16)&255)*.299 + ((shirtC>>8)&255)*.587 + (shirtC&255)*.114) / 255;
  return lum > .62 ? petShade(shirtC, .58) : 0xfff3d0;
}
/* ดาว 6 แฉกแบนๆ (กล่องบางไขว้ 3 อัน) — ใช้ทั้งลายเสื้อ แว่นดาว และหัวไม้กายสิทธิ์ */
function chStar(r, t, col){
  const g = new THREE.Group();
  for(let i=0;i<3;i++){ const b = box(r*2, t, .022, col, .008); b.rotation.z = i*Math.PI/3; g.add(b); }
  return g;
}
/* 💗 หัวใจแบนๆ (พู 2 พู + ปลายแหลมล่าง) — **ทรงหัวใจกลางของทั้งไฟล์**
   ใช้กับ: ลายเสื้อหัวใจ · แว่นหัวใจ · แว่นกันแดดทรงหัวใจ · ตาหัวใจ
   ⚠ สัดส่วนเดิม (พู .52 ที่ y=.3 · กรวย .78×1.05 ที่ y=-.16) **กรวยแคบและสูงเกินไป**
     ปลายแหลมแทบไม่โผล่พ้นพู ⇒ เห็นเป็น "ลูกกลม 2 ลูกติดกัน" ไม่ใช่หัวใจ
     (ผู้ใช้แจ้ง 2026-08-19) — ชุดใหม่ให้กรวยกว้างกว่าพูและลงมาต่ำพอจนเห็นปลายแหลมชัด
   ⚠ **ห้ามวาดหัวใจด้วยทรงอื่นในไฟล์นี้อีก** (เคยมีลูกกลม 2 ลูก + กล่องหมุน 45° อยู่ 2 จุด) */
function chHeart(s, col){
  const g = new THREE.Group();
  [-1,1].forEach(k=>{ const lb = sphere(s*.62, col, 10); lb.scale.z = .3; lb.position.set(k*s*.5, s*.38, 0); g.add(lb); });
  const tip = cone(s*1.12, s*1.5, col, 12); tip.rotation.z = Math.PI; tip.scale.z = .3; tip.position.y = -s*.42; g.add(tip);
  return g;
}
/* แถบพันรอบแขนทั้ง 2 ข้างที่ระดับความสูง y เดียวกับแถบบนลำตัว
   (แขน pivot อยู่ที่ไหล่และเอียง CH_ARM_T → ต้องหารกลับด้วย cos ไม่งั้นแถบเลื่อนต่ำกว่าตัว) */
function chArmBand(arms, y, h, col){
  arms.forEach(piv=>{
    const b = box(CH_AW+.012, h, CH_AD+.012, col, .055);
    b.position.y = (y - CH_SHO_Y)/Math.cos(CH_ARM_T);
    piv.add(b);
  });
}
function addShirtPattern(rig, arms, style, shirtC, shirtB, botC, girl){
  if(!style) return;
  const c = chPatColor(shirtC, shirtB);
  const F = CH_BD/2 + .006, BK = -(CH_BD/2 + .006);
  const face = (mesh, x, y, back)=>{                 /* แปะลายแบนบนหน้าอก/หลัง */
    mesh.position.set(x, y, back ? BK : F);
    if(back) mesh.rotation.y = Math.PI;
    rig.add(mesh); return mesh;
  };
  switch(style){
    case 1:                                          /* ลายทางขวาง — พันรอบตัว+แขน (เสื้อลายทางจริงๆ) */
      [.56, .69, .82].forEach(y=>{
        const b = box(CH_BW+.012, .075, CH_BD+.012, c, .1); b.position.y = y; rig.add(b);
        chArmBand(arms, y, .07, c);
      });
      break;
    case 2:                                          /* ลายจุด */
      [[-.1,.78],[.1,.78],[0,.66],[-.1,.55],[.1,.55]].forEach(([x,y])=>{
        const d = cyl(.042,.042,.02, c, 12); d.rotation.x = Math.PI/2; face(d, x, y);
      });
      [[0,.72],[0,.58]].forEach(([x,y])=>{ const d = cyl(.042,.042,.02, c, 12); d.rotation.x = Math.PI/2; face(d, x, y, true); });
      arms.forEach(piv=>{ const d = cyl(.032,.032,.02, c, 10); d.rotation.x = Math.PI/2;
        d.position.set(0, (.72-CH_SHO_Y)/Math.cos(CH_ARM_T), CH_AD/2+.006); piv.add(d); });
      break;
    case 3:                                          /* ลายดาวโรย */
      face(chStar(.075,.05,c), 0, .74);
      face(chStar(.05,.035,c), -.12, .58); face(chStar(.05,.035,c), .12, .6);
      face(chStar(.06,.04,c), 0, .68, true);
      arms.forEach(piv=>{ const st = chStar(.042,.03,c);
        st.position.set(0, (.7-CH_SHO_Y)/Math.cos(CH_ARM_T), CH_AD/2+.006); piv.add(st); });
      break;
    case 4:                                          /* ลายหัวใจ */
      face(chHeart(.11,c), 0, .72);
      face(chHeart(.06,c), -.13, .56); face(chHeart(.06,c), .13, .56);
      face(chHeart(.08,c), 0, .68, true);
      break;
    case 5: {                                        /* เอี๊ยม (ชุดหมี) — ใช้สีกางเกงจริง จึงต่อเนื่องเป็นชุดเดียวกัน */
      const bib = box(.3, .26, CH_BD+.012, botC, .06); bib.position.y = .58; rig.add(bib);
      [-1,1].forEach(s=>{                            /* สายเอี๊ยมพาดไหล่: หน้า → ข้ามไหล่ → หลัง */
        const fr = box(.07,.26,.02, botC,.02); fr.position.set(.13*s,.78, F); rig.add(fr);
        const ov = box(.075,.06,.2, botC,.025); ov.position.set(.13*s,.905,-.02); rig.add(ov);
        const bk = box(.07,.24,.02, botC,.02); bk.position.set(.13*s,.79, BK); rig.add(bk);
        const bt = cyl(.03,.03,.02, 0xfff3d0, 8); bt.rotation.x = Math.PI/2; bt.position.set(.13*s,.7, F+.012); rig.add(bt);
      });
      break; }
    case 6:                                          /* ลายซิกแซก (พันรอบตัว) */
      [[.62,1],[.74,-1]].forEach(([y,dir])=>{
        for(let i=-2;i<=2;i++){
          const zg = box(.115,.045,CH_BD+.012, c, .02);
          zg.rotation.z = (i%2 ? .6 : -.6)*dir; zg.position.set(i*.1, y, 0); rig.add(zg);
        }
      });
      break;
    case 7: {                                        /* กระเป๋าหน้าอก + ชายเสื้อ (ทรงเสื้อเชิ้ตเด็ก) */
      const hem = box(CH_BW+.012, .07, CH_BD+.012, c, .1); hem.position.y = .55; rig.add(hem);   /* ชายเสื้อ = ขอบบนกางเกงพอดี (สะโพกอยู่ .35-.57) */
      const pk = box(.15,.14,.02, c, .03); face(pk, -.13, .72);
      const fl = box(.155,.05,.025, petShade(c,.88), .02); face(fl, -.13, .8);
      /* สาบเสื้อกลางอก: ต้องเริ่มจากคอ (y .93) แล้ว "จบพอดีขอบบนเข็มขัด" (เข็มขัดอยู่ .55 หนา .07 → ขอบบน .585)
         ⇒ สูง .345 จุดกึ่งกลาง .7575 (ถ้าปล่อยยาวเลยเข็มขัด จะเห็นเป็นเส้นโผล่พ้นเข็มขัดลงไปบนกางเกง) */
      const plc = box(.05, .345, .02, c, .015); face(plc, 0, .7575);
      break; }
    case 8: {                                        /* ปกกะลาสี + โบว์ (ชุดกะลาสีเด็ก) */
      const col2 = chPatColor(shirtC, shirtB);
      const bck = box(.42,.2,.02, col2,.03); bck.position.set(0,.86,BK); rig.add(bck);
      [-1,1].forEach(s=>{
        const fr = box(.1,.24,.02, col2,.02); fr.position.set(.11*s,.85,F); fr.rotation.z = -s*.22; rig.add(fr);
        const sh = box(.11,.06,.19, col2,.025); sh.position.set(.16*s,.905,-.01); rig.add(sh);
      });
      const kn = box(.09,.07,.04, 0xef5350,.02); kn.position.set(0,.79,F+.01); rig.add(kn);
      [-1,1].forEach(s=>{ const tl = box(.05,.13,.03, 0xef5350,.02); tl.position.set(.045*s,.71,F+.008); tl.rotation.z = s*.3; rig.add(tl); });
      break; }
    case 9:                                          /* ลายทางตั้ง (ย้ายมาจากแถว "สีเสื้อ" แบบ 2 สีเดิม) */
      [-.104,.104].forEach(x=>{
        const st = box(.104, CH_BH, CH_BD+.01, c); st.position.set(x, CH_BY, 0); rig.add(st); });
      /* ลายทางตั้งไม่ลงแขน (ผู้ใช้ขอ 2026-08-04) — ต่างจากลายทางขวางที่ต้องพันแขนเพื่อไม่ให้แถบขาดตอน */
      break;
    /* ================= เฟส 8 (+10) =================
       ⚠ กติกาเดิมข้อ 1-3 ยังบังคับอยู่: ลายต้องเป็นเนื้อเดียวกับเสื้อ (กล่องขอบมนยื่นแค่ ~.006)
         ลายที่พันรอบตัวต้องพันแขนที่ความสูงเดียวกันด้วย · ลายเป็นจุดวางได้เฉพาะกลางอก |x|<.15 */
    case 10:                                         /* ตารางสก็อต — เส้นตั้ง+ขวางบางๆ ไขว้กัน */
      [.6,.76].forEach(y=>{ const b = box(CH_BW+.012,.05,CH_BD+.012,c,.08); b.position.y=y; rig.add(b);
        chArmBand(arms, y, .045, c); });
      [-.09,.09].forEach(x=>{ const st = box(.05,CH_BH,CH_BD+.011,c); st.position.set(x,CH_BY,0); rig.add(st); });
      break;
    case 11:                                         /* ดาวกระจายทั้งตัว */
      [[0,.8],[-.13,.7],[.13,.7],[-.07,.58],[.09,.56]].forEach(([x,y],i)=>
        face(chStar(.055-i*.004,.038,c), x, y));
      face(chStar(.06,.04,c), 0, .7, true);
      break;
    case 12:                                         /* หัวใจคู่กลางอก */
      face(chHeart(.09,c), -.07, .72); face(chHeart(.09,c), .07, .72);
      face(chHeart(.07,c), 0, .58);
      break;
    case 13:                                         /* จุดใหญ่ */
      [[-.1,.76],[.1,.62],[0,.5]].forEach(([x,y])=>{
        const d = cyl(.07,.07,.02,c,14); d.rotation.x=Math.PI/2; face(d,x,y); });
      [[0,.7]].forEach(([x,y])=>{ const d = cyl(.07,.07,.02,c,14); d.rotation.x=Math.PI/2; face(d,x,y,true); });
      break;
    case 14:                                         /* แถบเฉียง */
      [[-.06,.5],[.02,.62],[.1,.74]].forEach(([x,y])=>{
        const b = box(.3,.07,.02,c,.02); b.rotation.z = .5; face(b,x,y); });
      break;
    case 15:                                         /* รอยเท้าสัตว์ */
      [[-.09,.74],[.09,.62]].forEach(([x,y])=>{
        const pad = cyl(.045,.045,.02,c,12); pad.rotation.x=Math.PI/2; face(pad,x,y);
        [[-.035,.05],[0,.062],[.035,.05]].forEach(([dx,dy])=>{
          const t = cyl(.017,.017,.02,c,10); t.rotation.x=Math.PI/2; face(t,x+dx,y+dy); }); });
      break;
    case 16: {                                       /* เลข 1 ตัวใหญ่ (เสื้อกีฬา) */
      const bar = box(.06,.26,.02,c,.02); face(bar,.01,.68);
      const foot = box(.16,.05,.02,c,.02); face(foot,.01,.55);
      const tip = box(.07,.05,.02,c,.02); tip.rotation.z=.7; face(tip,-.04,.79);
      break; }
    case 17:                                         /* ดวงดาวเรียงแถว */
      [-.13,0,.13].forEach(x=>face(chStar(.05,.034,c), x, .72));
      chArmBand(arms, .72, .04, c);
      break;
    case 18:                                         /* สายรุ้งพาดอก (3 แถบชิดกัน) */
      [.66,.72,.78].forEach((y,i)=>{ const b = box(CH_BW+.012,.045,CH_BD+.012,
        [0xff6b6b,0xffd93d,0x6bcB77][i],.06); b.position.y=y; rig.add(b);
        chArmBand(arms, y, .04, [0xff6b6b,0xffd93d,0x6bcB77][i]); });
      break;
    case 19: {                                       /* หน้ายิ้มกลางอก */
      const f = cyl(.1,.1,.02,c,16); f.rotation.x=Math.PI/2; face(f,0,.7);
      [-.04,.04].forEach(x=>{ const e = cyl(.014,.014,.02,0x4a3a2a,8); e.rotation.x=Math.PI/2; face(e,x,.735); });
      const m = box(.08,.018,.02,0x4a3a2a,.008); face(m,0,.66);
      break; }
  }
}
/* ---------- ทรงผมประจำหมวก ----------
   ⚠ ผู้ใช้แจ้ง 2026-08-04: หมวกที่ครอบหัวจริง (แก๊ป/ไหมพรม/ฟาง) เดิมมีผมทรงที่เลือกทะลุออกมาทุกใบ
     เพราะเปลือกผม (hairShell) สูง .5+ กว้าง .8-.86 ใหญ่กว่าตัวหมวก
     ⇒ หมวก 3 แบบนี้ให้ **ซ่อนทรงผมที่เลือก** แล้ววาดผมชุดนี้แทน (โผล่เฉพาะขอบหมวก: หน้าม้า/ข้างหู/ท้ายทอย)
       **ต้องใช้สีผมที่เด็กเลือกเสมอ ห้าม hardcode สี** ส่วนหมวกที่เป็นที่คาดผม/มงกุฎ/หมวกปาร์ตี้
       ไม่ครอบหัว จึงยังโชว์ทรงผมที่เลือกได้ตามปกติ */
/* หมวกที่ "ครอบหัวจริง" → ซ่อนทรงผมที่เลือกไว้ แล้วใช้ผมประจำหมวกทรงแนบหัวแทน (ดู addHatHair)
   ⚠ **หมวกที่คลุมทั้งกะโหลกต้องอยู่ในเซ็ตนี้เสมอ** (เพิ่ม 11/12/14/15/17 เมื่อ 2026-08-17)
     เปลือกผมปกติสูงถึง y≈.52 กว้าง .86 ⇒ หมวกที่ครอบหัวจะถูกดันลอยขึ้นไปกองอยู่บนก้อนผม
     เห็นเป็น "ลูกบอลลอยเหนือหัว" แทนที่จะเป็นหมวกที่สวมอยู่ (ผู้ใช้แจ้ง 2026-08-17 ทั้ง 5 ใบ)
     พออยู่ในเซ็ตนี้ ผมใต้หมวกจะเหลือ _hairTop .46 / _hairW .70 ⇒ ตัวเลขหมวกอ้างอิงหัวจริงได้
   ⚠ ผมใต้หมวกเป็นกล่องขอบมน .76 × .70 (r .22) ⇒ **รัศมีนอกสุดของมันคือ ~.43**
     ขอบหมวก/ปีกหมวกที่ต้องปิดขอบผมให้มิดต้องกว้างกว่านี้เสมอ ไม่งั้นมุมผมโผล่ออกมาข้างหมวก */
/* 🔒 **กติกา (ผู้ใช้สั่ง 2026-08-17): ใบไหนที่ผมทะลุออกมา ให้ล็อกผมแบบใบแรกไปเลย**
   ⇒ หมวก/เครื่องหัวที่ตัวมันเอง "กินพื้นที่เดียวกับก้อนผม" (ครอบหัว หรือเป็นวงคาดรอบหัว)
     ต้องอยู่ในเซ็ตนี้ทุกใบ ไม่ต้องไปนั่งไล่ขยับทีละชิ้นให้พ้นผม
   11/12/14/15/17 = หมวกที่คลุมทั้งกะโหลก
   ⚠ **ใบที่ "วางบนผม" ไม่ต้องใส่** (โบว์ 4/13 · หูสัตว์ 6/9/10 · ดอกไม้ 8 · หมวกปาร์ตี้ 7)
     ของพวกนี้ตั้งใจให้เห็นทรงผมเต็มๆ — ใส่เข้าไปแล้วเด็กผู้หญิงติดโบว์จะหัวแบนหมดทรง */
/* ⚠ **16 (มงกุฎดอกไม้) ถูกถอดออกจากเซ็ตนี้ 2026-08-17 ตามที่ผู้ใช้สั่ง** — พวงมาลัยดอกไม้เป็น
     "ของวางบนผม" ไม่ใช่หมวกที่ครอบหัว พอไปล็อกผมด้วยเลยเห็นผมแหว่งเป็นแถบใหญ่รอบหัว
     ⇒ ใบนี้กลับไปใช้ทรงผมปกติ แล้วขยายวงดอกไม้ให้คล้องรอบนอกก้อนผมแทน (ดู case 16)
   ⚠ **5 (มงกุฎ) ถูกถอดออกด้วย 2026-08-18 ตามที่ผู้ใช้สั่ง** — เหตุผลเดียวกันเป๊ะ
     มงกุฎคือของที่ "วางบนหัว" เจ้าหญิงยังต้องเห็นผมสวยๆ ของตัวเองอยู่ พอล็อกผมแล้วทุกทรงหัวเหมือนกันหมด
     ⇒ ใช้ทรงผมปกติ แล้ววางวงมงกุฎนั่งบนยอดผมจริงแทน (ดู case 5)
     ⇒ **ไม่เหลือหมวกทรงวงแหวนในเซ็ตนี้อีกแล้ว** เซ็ต HAT_RING_HAIR จึงถูกลบทิ้งไปพร้อมกัน */
const HAT_COVER_HAIR = new Set([1,2,3,11,12,14,15,17]);
const HAT_HAIR_R = .43;                    /* รัศมีนอกสุดของผมใต้หมวก — ใช้เป็นเกณฑ์ขั้นต่ำของขอบหมวก */
function addHatHair(head, style, c, girl){
  /* หมวกอ้างอิงค่านี้แทนเปลือกผม → สวมพอดีหัวจริง ไม่ลอยสูงเหมือนตอนมีผมหนาอยู่ข้างใต้ */
  head.userData._hairTop = .46; head.userData._hairW = .70;
  /* เปลือกผม "ชิ้นเดียวต่อเนื่อง" คลุมข้าง+ท้ายทอยรอบเดียวจบ
     (เดิมแยกเป็นก้อนท้ายทอย + ก้อนข้างหู มองแล้วขาดเป็นช่วงๆ ไม่ต่อกัน — ผู้ใช้แจ้ง 2026-08-04)
     ลึกแค่ z +.24 เพื่อไม่ให้ล้ำมาบังหน้า (หน้าอยู่ z .33) */
  const shell = box(.76,.46,.7, c, .22); shell.position.set(0,.02,-.05); head.add(shell);
  /* 🩲 **ฝาผมปิดกลางกะโหลก** — เปลือกด้านบนจบที่ y .25 แต่กะโหลกสูงถึง .30
     หมวกที่ครอบหัว (แก๊ป/ไหมพรม/ฟาง) บังส่วนนี้ไว้หมด ปกติจึงไม่มีใครเห็น
     ⚠ **เก็บไว้เป็นราวกันตก** — ถ้าวันหลังมีใครเพิ่มหมวกที่ไม่ปิดยอดหัวเข้าเซ็ตนี้อีก
       กลางหัวจะโล่งเป็นหัวล้านทันที (เคยเจอมาแล้วตอนมงกุฎยังอยู่ในเซ็ต 2026-08-17)
     ⚠ **ต้องเล็กพอที่จะซ่อนอยู่ในหมวกทุกใบของเซ็ตนี้** — รัศมีนอกสุด ~.33
       (หมวกฟางเป็นใบที่คับที่สุด: มงกุฎหมวกรัศมี ~.36 ที่ระดับความสูงนี้) */
  const topCap = box(.62,.30,.62, c, .26); topCap.position.set(0,.16,-.03); head.add(topCap);
  if(style === 2){                                 /* ไหมพรม: โผล่หน้าผากนิดเดียว */
    const bg = box(.5,.08,.14, c, .04); bg.position.set(0,.2,.28); head.add(bg);
  }else{                                             /* แก๊ป/ฟาง: หน้าม้าสั้นใต้ปีกหมวก */
    const bg = box(.56,.1,.16, c, .05); bg.position.set(0,.19,.27); head.add(bg);
  }
  if(style === 3 && girl) [-1,1].forEach(s=>hairStrand(head,c,.32*s,-.1,-.04,3,.12,.16));   /* หมวกฟาง+เด็กหญิง = ผมยาวลงมาถึงบ่า (เด็กชายใส่แล้วดูเป็นเปียผิดเพศ) */
  if(girl) [-1,1].forEach(s=>hairStrand(head,c,.28*s,-.18,-.08,3,.11,.14));
}
/* ---------- เครื่องหัว (index 0 = ไม่ใส่) ----------
   ⚠ ต้องวางหมวก "อ้างอิงยอดผม" ไม่ใช่อ้างอิงกะโหลก — เปลือกผม (hairShell) สูงถึง y≈.52 กว้าง .8-.86
     ซึ่งใหญ่กว่ากะโหลก (.64) ถ้าวางตามกะโหลกหมวกจะจมหายเข้าไปในผม เหลือแต่ปีกโผล่ออกมา (เคยพลาดมาแล้ว)
     hairShell จดค่าไว้ให้ที่ head.userData._hairTop / _hairW แล้ว ใช้ค่านั้นเสมอ */
function addHeadwear(head, style, col){
  if(!style) return;
  const HT = head.userData._hairTop ?? .34;        /* ยอดผม */
  const HW = head.userData._hairW ?? .8;           /* ความกว้างเปลือกผม */
  const R = HW/2 + .05;                            /* รัศมีหมวกที่ครอบผมได้พอดี */
  switch(style){
    case 1: {                                      /* หมวกแก๊ป */
      /* กะโหลก+ผมยาวถึง z -.33 → ทรงหมวกต้องยืดลึกตามแนว z ไม่งั้นด้านหลังหัวโผล่ทะลุหมวกออกมา */
      const crown = sphere(R+.03, col, 16); crown.scale.set(1.02,.62,1.18); crown.position.set(0, HT-.17, -.02); head.add(crown);
      const brim = box(R*1.25,.05,.36, petShade(col,.88), .025); brim.position.set(0, HT-.26, .44); head.add(brim);
      const btn = sphere(.05, petShade(col,.8), 8); btn.position.y = HT+.08; head.add(btn);
      break; }
    case 2: {                                      /* หมวกไหมพรม + ปอมปอม */
      const cap = sphere(R-.02, col, 16); cap.scale.set(1.02,.72,1.12); cap.position.set(0, HT-.14, -.01); head.add(cap);
      const band = cyl(R,R,.1, petShade(col,.84), 16); band.scale.z = 1.1; band.position.set(0, HT-.24, -.01); head.add(band);
      const pom = sphere(.08, 0xfff3d0, 10); pom.position.set(0, HT+.13, -.01); head.add(pom);
      break; }
    case 3: {                                      /* หมวกฟาง (ปีกกว้าง + ริบบิ้นสีของแต่ง) */
      const brim = cyl(R+.16,R+.16,.05, 0xf3d79a, 18); brim.position.y = HT-.26; head.add(brim);
      const crown = cyl(R-.09,R-.02,.28, 0xf8e3ba, 16); crown.position.y = HT-.11; head.add(crown);
      const rib = cyl(R-.005,R-.005,.09, col, 16); rib.position.y = HT-.21; head.add(rib);
      break; }
    case 4: {                                      /* โบว์ใหญ่ข้างหัว */
      const kx = R-.07, ky = HT-.16;
      [-1,1].forEach(s=>{
        const lp = box(.22,.16,.12, col, .065); lp.position.set(kx, ky + s*.14, .06); lp.rotation.z = s*.5; head.add(lp); });
      const kn = sphere(.06, petShade(col,.85), 10); kn.position.set(kx, ky, .08); head.add(kn);
      break; }
    case 5: {                                      /* มงกุฎ */
      /* มงกุฎ "วางบนหัว" ไม่ใช่ห่วงคาดรอบผม (ผู้ใช้แจ้ง 2026-08-04) → วงเล็กกว่าหัว ตั้งอยู่บนยอด
         🔄 **2026-08-18 (ผู้ใช้สั่ง): เลิกล็อกผม กลับไปใช้ทรงผมปกติ** เหมือนมงกุฎดอกไม้ (case 16)
           ⇒ ตอนนี้ HT = ยอดผมจริงของทรงที่เด็กเลือก ไม่ใช่ .46 คงที่แบบตอนล็อกผมอีกแล้ว
             จึงไม่ต้องหักลบ .16 เผื่อส่วนต่างอีก — วางให้จมยอดผมนิดเดียวก็นั่งพอดี
         📐 ทำไม CR = R*.68 ถึงยังใช้ได้กับผมปกติ: เปลือกผมเป็นกล่องขอบมน r .28
            ที่ระดับต่ำกว่ายอด .06 ครึ่งความกว้างของก้อนผม = w/2 - r + √(r² - (r-.06)²) ≈ .29-.32
            ส่วน R*.68 = (HW/2+.05)*.68 ≈ .31 ⇒ วงมงกุฎแนบผิวผมพอดี ไม่ลอยและไม่จมหาย */
      const CR = R*.68, CY = HT-.06;
      const ring = cyl(CR,CR,.12, col, 16); ring.position.y = CY; head.add(ring);
      const rim = torus(CR,.028, petShade(col,.82), 16); rim.rotation.x = Math.PI/2; rim.position.y = CY-.06; head.add(rim);
      for(let i=0;i<6;i++){
        const a = i/6*Math.PI*2, sx = Math.cos(a)*CR, sz = Math.sin(a)*CR;
        const sp = cone(.06,.17, col, 6); sp.position.set(sx, CY+.14, sz); head.add(sp);
        const gm = sphere(.032, 0xff5c8a, 8); gm.position.set(sx*1.03, CY+.23, sz*1.03); head.add(gm);
      }
      break; }
    case 6: {                                      /* ที่คาดผมหูสัตว์ */
      /* ⚠ **ไม่มีที่คาดผม** เหลือเฉพาะหูกระต่ายตั้งบนหัว (ผู้ใช้ขอ 2026-08-04 — ตัวคาดผมทำยังไงก็ดูเป็นห่วงคร่อมหัว)
         โคนหูจึงต้องจมลงในผมนิดหน่อยให้ดูเหมือนงอกออกมาจากหัว ไม่ใช่ลอยอยู่เหนือหัว */
      [-1,1].forEach(s=>{                            /* หูกระต่ายยาว ตั้งเอียงออกข้างเล็กน้อย */
        const ear = box(.15,.5,.11, col, .07); ear.position.set(.2*s, HT+.14, -.02); ear.rotation.z = -s*.17; head.add(ear);
        const inn = box(.075,.34,.06, 0xffc2d1, .035); inn.position.set(.2*s + .014*s, HT+.14, .035); inn.rotation.z = -s*.17; head.add(inn);
      });
      break; }
    case 7: {                                      /* หมวกปาร์ตี้ */
      /* หมวกปาร์ตี้ทรงเล็ก: กรวยเรียวสูง + วงแหวนครีมคาด 3 ชั้น + ปอมบนยอด + ขอบหมวกที่ฐาน
         ฐานกรวยต้องอยู่ "เหนือยอดผม" ไม่งั้นครึ่งล่างจมหายเข้าไปในหัว (ผู้ใช้แจ้ง 2026-08-04) */
      /* ⚠ ทุกชิ้นสีครีม (ขอบหมวก/วงแหวน/ปอม) ต้องวางตาม "แกนจริงของกรวยที่เอียงแล้ว" เสมอ
         กรวยหมุน rotation.z = tilt (บวก) ⇒ แกนขึ้นของมันเอนไป **ทาง -x** คือ u = (-sin tilt, cos tilt)
         ของเดิมเลื่อนวงแหวนไปทาง +sin(tilt) (ผิดทิศตรงข้าม) + ตั้งขอบหมวกด้วยเลขมือ วงครีมจึงไถลหลุด
         ออกนอกตัวกรวยไปกองข้างเดียว (ผู้ใช้แจ้ง 2026-08-05) — คำนวณจากจุดฐานกรวยตรงๆ ห้ามใส่เลขเดา */
      const PR = R*.52, tilt = .2, PH = .42;
      const ux = -Math.sin(tilt), uy = Math.cos(tilt);        /* ทิศ "ขึ้น" ตามแกนกรวยหลังเอียง */
      const cx = -.05, cy = HT+.16;                           /* จุดกึ่งกลางกรวย */
      const bx = cx - ux*PH/2, by = cy - uy*PH/2;             /* จุดกึ่งกลาง "ฐาน" กรวย */
      const onAxis = (o, d)=>{ o.position.set(bx + ux*d, by + uy*d, 0); o.rotation.z = tilt; head.add(o); };
      const hat = cone(PR,PH, col, 14); hat.position.set(cx, cy, 0); hat.rotation.z = tilt; head.add(hat);
      onAxis(cyl(PR+.025,PR+.025,.035, 0xfff3d0, 16), .012);  /* ขอบหมวกที่ฐาน */
      [0,1,2].forEach(i=>{                           /* วงแหวนคาดไล่เล็กขึ้นไปตามกรวย (รัศมีกรวยที่ระดับนั้น + นิดหน่อย) */
        const t = (i+1)/4;
        onAxis(cyl(PR*(1-t)+.012, PR*(1-t)+.012, .03, 0xfff3d0, 14), PH*t);
      });
      onAxis(sphere(.062, 0xfff3d0, 10), PH);                 /* ปอมบนยอดกรวย */
      break; }
    case 8: {                                      /* ที่คาดผมดอกไม้ */
      /* **ไม่มีที่คาดผม** เหลือเฉพาะดอกไม้ติดข้างหัว (ดูหมายเหตุแบบที่ 6) — ใบไม้ 2 ใบช่วยให้ดอกดูติดผมจริง */
      const fx = (R+.02)*.66, fy = HT-.08, fz = .1;
      [-1,1].forEach(s=>{ const lf = sphere(.055, 0x7cc47f, 8); lf.scale.set(1.5,.55,.8);
        lf.position.set(fx - .09, fy - .08*s, fz - .04); lf.rotation.z = s*.5; head.add(lf); });
      for(let i=0;i<5;i++){
        const a = i/5*Math.PI*2, p = sphere(.06, 0xfff3d0, 8);
        p.position.set(fx + Math.cos(a)*.08, fy + Math.sin(a)*.08, fz); head.add(p);
      }
      const ctr = sphere(.045, 0xffd54f, 8); ctr.position.set(fx, fy, fz+.045); head.add(ctr);
      break; }
    /* ================= เฟส 8 (+9) =================
       ⚠ ทุกใบต้องอ้าง HT (ยอดผม) / R (รัศมีครอบผม) เสมอ ห้ามใส่เลขมือ ไม่งั้นหมวกจมหัวหรือลอย */
    /* 🐞 เบอร์ 9 กับ 10 เคยมี `band` (โทรัสคาดรอบหัว) — บนจอเห็นเป็น **ห่วงสีแดงเสียบทะลุหัว**
       เหมือนวงแหวนดาวเสาร์ ไม่ใช่ที่คาดผม (ผู้ใช้แจ้ง 2026-08-17)
       ⚠ นี่คือปัญหาเดียวกับที่เคยตัดที่คาดผมออกจากเบอร์ 6 และ 8 มาแล้ว (2026-08-04)
         **กติกาที่ล็อกไว้: ห้ามมีที่คาดผมในเกมนี้** — หูสัตว์ต้องดู "งอกจากหัว" เอา โคนจมในผม */
    case 9: {                                      /* หูแมว */
      /* กรวยหลายเหลี่ยมบีบแบน = สามเหลี่ยมหูแมวเวลามองจากด้านหน้า
         (ของเดิมใช้กรวย 4 เหลี่ยมหมุน 45° ⇒ เป็นพีระมิดข้าวหลามตัด ไม่เหมือนหูแมว) */
      /* ⚠ **ห้ามบางเกิน** — รอบแรกใช้ scale.z .42 หูออกมาเป็นแผ่นกระดาษซีดๆ (ผู้ใช้แจ้ง 2026-08-17)
         หูแมวต้องหนาพอให้มีปริมาตร และโคนต้องจมในผมลึกๆ ถึงจะดูงอกจากหัวจริง */
      [-1,1].forEach(s=>{
        const ear = cone(.14,.26, col, 16); ear.scale.z = .62;
        ear.position.set(R*.46*s, HT+.02, -.03); ear.rotation.z = -s*.15; head.add(ear);
        const inn = cone(.082,.14, 0xffc0cb, 16); inn.scale.z = .5;
        inn.position.set(R*.46*s, HT-.005, .035); inn.rotation.z = -s*.15; head.add(inn);
      });
      break; }
    case 10: {                                     /* หูหมี */
      /* 🔄 **เปลี่ยนเป็นหูหมี 2026-08-17 (ผู้ใช้สั่ง)** — เดิมเป็นหูกระต่าย ซึ่งซ้ำกับเบอร์ 6
         ที่เป็นหูกระต่ายอยู่แล้ว ลองทำเป็น "หูกระต่ายพับตก" เพื่อแยกจากเบอร์ 6 แล้วก็ยังไม่ผ่าน
         ⇒ เปลี่ยนสัตว์ไปเลย: หูหมี = **แผ่นกลมโค้ง** ซึ่งเงารวมต่างจากทั้งหูแมว (สามเหลี่ยม)
           และหูกระต่าย (แท่งยาว) อย่างสิ้นเชิง เด็กแยกออกตั้งแต่ดูไอคอน
         ⚠ เปลี่ยนโมเดลแล้วต้องเปลี่ยนชื่อในร้าน (FIT_NAMES.hat[10]) ให้ตรงกันเสมอ */
      [-1,1].forEach(s=>{
        const ear = sphere(.14, col, 16); ear.scale.set(1,1,.55);
        ear.position.set(.27*s, HT+.05, -.02); head.add(ear);
        const inn = sphere(.078, petShade(col,1.3), 12); inn.scale.set(1,1,.42);
        inn.position.set(.27*s, HT+.04, .045); head.add(inn);
      });
      break; }
    case 11: {                                     /* หมวกบัณฑิต (mortarboard) */
      /* 🔄 **เปลี่ยนของทั้งชิ้น 2026-08-17 (ผู้ใช้สั่ง: ไม่เอาหมวกกันน็อกแล้ว)**
         ประวัติหมวกกันน็อกที่ลองแล้วไม่ผ่าน 3 รอบ — ลูกกลมกลืนหน้า → โดม+ที่ครอบหูลอย →
         กล่องขอบมน+ช่องระบาย ⇒ ตัวปัญหาคือ "หมวกครอบหัวทรงโค้ง" อะไรก็ตามในสไตล์นี้
         จะกลายเป็นก้อนกลมบนหัวเสมอ แยกจากหมวกใบอื่นไม่ออก
         ⇒ เปลี่ยนเป็น **หมวกบัณฑิต** ซึ่ง:
             1) เงารวมเป็น "แผ่นสี่เหลี่ยมแบน" — ไม่มีหมวกใบไหนในเกมเป็นเหลี่ยม แยกออกทันที
             2) เข้ากับธีมแอป (เว็บเตรียมสอบเข้า ป.1) มากกว่าหมวกกันน็อก
             3) มีพู่ห้อยเป็นจุดสังเกตเพิ่ม เด็กจำได้ง่าย
         ⚠ ฐานหมวกเป็นกล่องขอบมน .76 × .74 (r .22) ⇒ รัศมีนอกสุด ≈ .44 > HAT_HAIR_R (.43)
           ครอบขอบผมใต้หมวกได้มิดพอดี */
      /* ⚠ **กดลงอีก .05 เมื่อ 2026-08-17 (ผู้ใช้สั่ง)** — ค่า D คุมทั้งใบพร้อมกัน อย่าขยับทีละชิ้น
         เพดานล่าง: ฐานหมวกสูง .22 ⇒ ขอบล่าง = HT-.24-.11 = .17 ยังพ้นตาสูงสุด (.15) พอดี */
      const D = -.05;
      const base = box(.76,.22,.74, col,.22); base.position.set(0, HT-.19+D, -.01); head.add(base);
      const crown = box(.62,.16,.60, col,.16); crown.position.set(0, HT-.05+D, -.01); head.add(crown);
      /* กระดานสี่เหลี่ยมแบน — หมุนนิดหน่อยให้เห็นมุมเหลี่ยมชัดจากมุมกล้องหน้าตรง */
      const board = box(.96,.05,.96, petShade(col,.84),.02);
      board.rotation.y = .22; board.position.set(0, HT+.05+D, -.01); head.add(board);
      const btn = sphere(.05, 0xffd54f, 10); btn.position.set(0, HT+.09+D, -.01); head.add(btn);
      /* พู่ห้อย — เชือกพาดจากปุ่มกลางไปมุมกระดานด้านขวา แล้วห้อยลงข้างหน้า */
      const cord = box(.40,.022,.022, 0xffd54f,.01);
      cord.rotation.y = -.42; cord.position.set(.18, HT+.075+D, .14); head.add(cord);
      const tas = cyl(.028,.055,.17, 0xffd54f, 10); tas.position.set(.36, HT-.03+D, .27); head.add(tas);
      break; }
    case 12: {                                     /* หมวกปีกกว้างกันแดด */
      /* 🐞 ของเดิม: ปีกกว้าง R+.34 (โตกว่าหัว 2.5 เท่า) แถมทั้งใบวางที่ HT-.04 ขึ้นไป
         ⇒ ลอยอยู่เหนือหัวเหมือนจานบิน ไม่ได้สวมอยู่ (ผู้ใช้แจ้ง 2026-08-17)
         ⇒ ลดปีกลงเหลือ R+.22 แล้วกดทั้งใบลงมาสวมจริง (ปีกอยู่ระดับ HT-.24) */
      const brim = cyl(R+.18,R+.22,.05, col, 22); brim.position.set(0, HT-.24, -.01); head.add(brim);
      const crown = cyl(R*.84,R*1.08,.30, col, 18); crown.position.set(0, HT-.07, -.01); head.add(crown);
      const band = cyl(R*1.02,R*1.02,.08, petShade(col,.76), 18); band.position.set(0, HT-.19, -.01); head.add(band);
      break; }
    case 13: {                                     /* โบว์ใหญ่บนหัว */
      [-1,1].forEach(s=>{ const w = sphere(.14, col, 10); w.scale.set(1.1,.85,.55);
        w.position.set(.15*s, HT+.1, .02); head.add(w); });
      const kn = sphere(.06, petShade(col,.85), 8); kn.position.set(0,HT+.1,.04); head.add(kn);
      break; }
    case 14: {                                     /* ผ้าโพกหัว */
      /* 🐞 ของเดิมเป็นแผ่นแบนสูงแค่ .16 วางทับก้อนผม ⇒ เห็นเป็น **ไม้กระดานสีแดงพาดหัว**
         แถมผมแทงทะลุขึ้นมาข้างบน (ผู้ใช้แจ้ง 2026-08-17)
         ⇒ ผ้าโพกจริงต้อง "พันรอบหัว + ปิดยอด": วงผ้าหนารอบกะโหลก + โดมปิดข้างบน + ปมข้าง
         ⚠ ใช้กล่องขอบมนไม่ใช่ทรงกระบอก — ผมใต้หมวกเป็นกล่อง ถ้าใช้ทรงกระบอกมุมผมจะโผล่ที่มุม */
      /* ⚠ **รอบที่ 2** — โดมเรียบๆ ทำให้ซ้ำกับหมวกกันน็อก/ไหมพรม (ดูหมายเหตุที่เบอร์ 11)
         ผ้าโพกจะ "อ่านออกว่าเป็นผ้าพัน" ก็ต่อเมื่อเห็น **ชั้นผ้าเหลื่อมกันคนละองศา** เท่านั้น */
      const layer = (w,h,d,y,rz,shade)=>{ const b = box(w,h,d, shade,.16);
        b.position.set(0,y,-.01); b.rotation.z = rz; head.add(b); };
      layer(.88,.17,.82, HT-.22,  .07, col);
      layer(.84,.16,.78, HT-.09, -.08, petShade(col,1.1));
      layer(.72,.15,.68, HT+.02,  .10, col);
      const top = sphere(.25, petShade(col,1.1), 14); top.scale.set(1,.58,1);
      top.position.set(0, HT+.10, -.01); head.add(top);
      const knot = sphere(.09, petShade(col,.8), 12); knot.position.set(R*.88, HT-.16, .14); head.add(knot);
      const tail = box(.08,.26,.07, petShade(col,.8),.03);
      tail.rotation.z = .5; tail.position.set(R*.96, HT-.34, .11); head.add(tail);
      break; }
    case 15: {                                     /* หมวกกัปตัน */
      /* 🐞 ของเดิมวางมงกุฎที่ HT+.08 และปีกที่ HT-.06 ⇒ ทั้งใบลอยอยู่เหนือก้อนผม
         + "สมอ" เป็นลูกกลมเล็กที่มองไม่ออกว่าคืออะไร (ผู้ใช้แจ้ง 2026-08-17)
         ⇒ กดลงมาสวมจริง · ปีกหน้าเอียงลงเป็นกระบังแบบหมวกกัปตัน · เปลี่ยนสมอเป็นดาวทองที่เห็นชัด */
      /* ⚠ **รอบที่ 2** — ทรงกระบอกสูงทำให้ออกมาเหมือนหมวกเฟซสีแดง ซ้ำกับใบอื่น
         หมวกกัปตันของจริงเด่นที่ **ฝาบนแบนกว้างยื่นพ้นตัวหมวก** + แถบดำ + กระบังดำ
         ⇒ ทำตัวหมวกเตี้ยลงแล้วผายออกด้านบน + วางฝาแบนทับ = เงารวมเป็น "จานแบน" ไม่ใช่โดม */
      /* ⚠ **กดทั้งใบลงอีก .07 เมื่อ 2026-08-17** — ของเดิมสูงไปนิด เห็น "รอยแหว่ง" ของผมใต้หมวก
         โผล่ระหว่างขอบหมวกกับไรผม (ผู้ใช้แจ้ง) · แถบคาดต้องกว้างกว่า HAT_HAIR_R เสมอเพื่อปิดรอยนั้น */
      const D = -.07;
      const band  = cyl(R*1.10,R*1.10,.14, petShade(col,.55), 20); band.position.set(0, HT-.20+D, -.01); head.add(band);
      const crown = cyl(R*1.24,R*1.06,.16, col, 20);               crown.position.set(0, HT-.06+D, -.01); head.add(crown);
      const top   = cyl(R*1.26,R*1.26,.035, petShade(col,1.06), 20); top.position.set(0, HT+.02+D, -.01); head.add(top);
      const peak = box(.50,.05,.26, petShade(col,.5),.025);
      peak.rotation.x = -.30; peak.position.set(0, HT-.26+D, R+.10); head.add(peak);
      const badge = chStar(.062,.03, 0xffd54f); badge.position.set(0, HT-.19+D, R*1.06); head.add(badge);
      break; }
    case 16: {                                     /* มงกุฎดอกไม้ (พวงมาลัย) */
      /* 🔄 **รอบที่ 3 · 2026-08-17 (ผู้ใช้สั่ง)** — เลิกล็อกผม กลับไปใช้ทรงผมปกติของเด็ก
         แล้ววางพวงมาลัยคล้องรอบนอกก้อนผม (การล็อกผมทำให้เห็นผมแหว่งเป็นแถบใหญ่รอบหัว)
         ⚠ วงต้องกว้างกว่า **ก้อนผมที่กว้างที่สุดในเกม** — เปลือกผมกว้างสุด w .86 ลึก .82 ขอบมน .28
           ⇒ รัศมีนอกสุด ≈ .47 ⇒ ตั้งวงไว้ที่ .50 เผื่อไว้ทุกทรง ไม่งั้นดอกไม้จมหายในผมบางทรง
         ⚠ ดอกไม้ต้องเม็ดเล็ก (ผู้ใช้แจ้งว่าใหญ่เกินไป) — ใช้ 12 ดอกเล็กให้วงแน่นแทนดอกโตๆ ไม่กี่ดอก */
      const FY = HT-.30, FR = .50;
      for(let i=0;i<12;i++){ const a = i/12*Math.PI*2;
        const fl = sphere(.04, i%2 ? col : petShade(col,1.2), 8);
        fl.position.set(Math.cos(a)*FR, FY, Math.sin(a)*FR); head.add(fl);
        const lf = sphere(.026, 0x7cc47f, 6); lf.scale.set(1.5,.5,.8);
        lf.position.set(Math.cos(a+.26)*FR, FY-.035, Math.sin(a+.26)*FR); head.add(lf); }
      break; }
    case 17: {                                     /* หมวกไหมพรมทรงยาว (slouchy) + ปอมใหญ่ */
      /* 🐞 ของเดิม: ลูกกลม r .51 scale y .9 ที่ HT-.02 ⇒ ขอบล่างถึง y≈.04 = คลุมตาเด็ก
         และหน้าตาซ้ำกับเบอร์ 2 (หมวกไหมพรม+ปอม) แทบทุกประการ (ผู้ใช้แจ้ง 2026-08-17)
         ⇒ ทำเป็นทรง slouchy: ตัวหมวกเตี้ยแนบหัว + ขอบพับหนา + **ปลายหมวกเอนไปข้างหลัง**
           พร้อมปอมใหญ่ที่ปลาย ⇒ เงารวมต่างจากเบอร์ 2 ชัดเจน และไม่บังหน้าอีก */
      /* ⚠ **ย่อลงทั้งใบ 2026-08-17** — ของเดิม (cap r R+.02 · cuff R+.08) โป่งเกินหัวไปมาก
         ผู้ใช้แจ้งว่า "ไซส์ใหญ่เกินไป" ⇒ หมวกไหมพรมต้องแนบหัว ไม่ใช่พองเป็นลูกโป่ง
         ขอบพับยังต้องกว้างกว่า HAT_HAIR_R (.43) เพื่อปิดขอบผมใต้หมวก ⇒ R+.04 คือค่าต่ำสุดที่ยังปิดได้ */
      /* ⚠ **กดลงอีก .06 เมื่อ 2026-08-17 (ผู้ใช้สั่งซ้ำว่ายังสูงไป)**
         เพดานล่างคือ **ขอบล่างตัวหมวกห้ามต่ำกว่า y .17** — ตาสูงสุด (แบบตากลมโตมาก) อยู่ที่ .15
         cap รัศมี .39 บีบแนวตั้ง .62 ⇒ ครึ่งความสูง .242 ⇒ จุดกึ่งกลางต่ำสุดที่ยอมได้คือ .41 = HT-.11 */
      const cap = sphere(R-.01, col, 16); cap.scale.set(1,.62,1.04);
      cap.position.set(0, HT-.10, -.01); head.add(cap);
      const cuff = cyl(R+.03,R+.04,.14, petShade(col,1.15), 20); cuff.scale.z = 1.04;
      cuff.position.set(0, HT-.25, -.01); head.add(cuff);
      /* ⚠ ปลายหมวกต้องเอน "เฉียงไปข้าง" ไม่ใช่ตรงไปข้างหลัง — มุมกล้องในเกมมองจากด้านหน้าเป็นหลัก
         เอนตรงหลังแล้วปอมจะหลบอยู่หลังหัว มองไม่เห็นเลย (พลาดมาแล้วรอบแรก) */
      const tip = cyl(.085,.17,.24, col, 14); tip.rotation.set(.5, 0, -.62);
      tip.position.set(R*.5, HT+.07, -.10); head.add(tip);
      const pom = sphere(.12, petShade(col,1.15), 12);
      pom.position.set(R*.92, HT+.11, -.17); head.add(pom);
      break; }
  }
}
/* ---------- แว่นตา (index 0 = ไม่ใส่) ----------
   ⚠ ตาบางแบบเป็นลูกกลมยื่นถึง z≈.44 → กรอบแว่นต้องอยู่หน้าตา (Z=.42) และเป็น "กรอบโปร่ง" เป็นหลัก
     ไม่งั้นเลนส์ทึบจะกลืนตาหายทั้งดวง (เว้นแบบกันแดด/ว่ายน้ำที่ตั้งใจให้ทึบ) */
function addGlasses(head, style, col){
  if(!style) return;
  const Z = .42, EY = .04, EX = .16;
  const temples = c => [-1,1].forEach(s=>{
    const t = box(.035,.035,.34, c, .015); t.position.set(.3*s, EY+.04, .2); t.rotation.y = -s*.18; head.add(t); });
  switch(style){
    case 1:                                          /* แว่นกลม */
      [-1,1].forEach(s=>{ const rim = torus(.135,.024, col, 18); rim.position.set(EX*s, EY, Z); head.add(rim); });
      { const br = box(.09,.028,.03, col,.012); br.position.set(0, EY+.02, Z); head.add(br); }
      temples(col); break;
    case 2:                                          /* แว่นเหลี่ยม (กรอบเป็นแท่ง 4 ด้าน เห็นตาชัด) */
      [-1,1].forEach(s=>{
        const cx = EX*s;
        [[0,.085,.26,.03],[0,-.085,.26,.03],[-.115,0,.03,.2],[.115,0,.03,.2]].forEach(([dx,dy,w,h])=>{
          const b = box(w,h,.03, col,.012); b.position.set(cx+dx, EY+dy, Z); head.add(b); });
      });
      { const br = box(.09,.03,.03, col,.012); br.position.set(0, EY+.05, Z); head.add(br); }
      temples(col); break;
    case 3:                                          /* แว่นกันแดด */
      [-1,1].forEach(s=>{
        const ln = box(.26,.19,.035, 0x37474f,.06); ln.position.set(EX*s+.01*s, EY, Z); head.add(ln);
        const gl = box(.1,.05,.02, 0x8fb6c9,.02); gl.position.set(EX*s-.05*s, EY+.04, Z+.02); head.add(gl); });
      { const br = box(.1,.05,.035, col,.02); br.position.set(0, EY+.03, Z); head.add(br); }
      temples(col); break;
    case 4:                                          /* แว่นหัวใจ */
      /* ⚠ ขนาดหัวใจ: `chHeart(s)` สูงราว 2.2s **ไม่ใช่ 1.5s** เหมือนสัดส่วนเดิมก่อน 2026-08-19
         ⇒ ใส่เลขเดิม (.145) แล้วเลนส์ใหญ่เกินหน้าเด็ก (ผู้ใช้แจ้ง) — ลดเป็น .10 */
      [-1,1].forEach(s=>{ const h = chHeart(.10, 0xff8fb0); h.position.set(EX*s, EY, Z); head.add(h);
        const rim = torus(.115,.018, col, 16); rim.position.set(EX*s, EY, Z-.01); head.add(rim); });
      { const br = box(.09,.028,.03, col,.012); br.position.set(0, EY+.02, Z); head.add(br); }
      temples(col); break;
    case 5:                                          /* แว่นดาว */
      [-1,1].forEach(s=>{ const st = chStar(.155,.075, col); st.position.set(EX*s, EY, Z); head.add(st);
        const ct = cyl(.055,.055,.03, 0xfff3d0, 12); ct.rotation.x = Math.PI/2; ct.position.set(EX*s, EY, Z+.015); head.add(ct); });
      temples(col); break;
    case 6: {                                        /* แว่นว่ายน้ำ */
      [-1,1].forEach(s=>{
        const cup = cyl(.14,.15,.09, col, 16); cup.rotation.x = Math.PI/2; cup.position.set(EX*s, EY, Z-.03); head.add(cup);
        const lens = cyl(.115,.115,.03, 0x9fdcf5, 16); lens.rotation.x = Math.PI/2; lens.position.set(EX*s, EY, Z+.02); head.add(lens); });
      const br = box(.08,.04,.05, col,.02); br.position.set(0, EY, Z-.03); head.add(br);
      const strap = box(.68,.07,.7, col, .3); strap.position.set(0, EY+.02, .02); head.add(strap);   /* สายรัดรอบหัว */
      break; }
    /* ================= เฟส 8 (+5) ================= */
    case 7: {                                        /* กันแดดทรงหัวใจ */
      /* ⚠ ของเดิมเป็นทรงกระบอก 2 อัน + กล่องหมุน 45° — ไม่ใช่ทรงหัวใจ
         ⇒ ใช้ `chHeart()` ตัวเดียวกับแว่นหัวใจ (ต่างกันที่อันนี้ทึบสีเลนส์ ไม่มีขอบวงแหวน) */
      [-1,1].forEach(s=>{
        const h = chHeart(.105, col); h.position.set(EX*s, EY, Z); head.add(h);
        const gl = box(.045,.026,.02, 0xffffff,.012); gl.position.set(EX*s-.032*s, EY+.035, Z+.02);
        head.add(gl); });
      const br = box(.1,.03,.03, col,.01); br.position.set(0, EY+.02, Z); head.add(br);
      temples(col); break; }
    case 8: {                                        /* แว่นดำน้ำ (บานเดียวเต็มหน้า) */
      const mask = box(.62,.26,.12, col,.09); mask.position.set(0, EY, Z-.04); head.add(mask);
      const lens = box(.5,.16,.04, 0x9fdcf5,.05); lens.position.set(0, EY, Z+.03); head.add(lens);
      const nose = box(.14,.1,.1, col,.04); nose.position.set(0, EY-.16, Z-.02); head.add(nose);
      const strap = box(.7,.06,.7, col,.3); strap.position.set(0, EY+.02, .02); head.add(strap);
      break; }
    case 9: {                                        /* แว่นนักบิน (หยดน้ำ) */
      [-1,1].forEach(s=>{ const l = cyl(.1,.11,.03, 0x8fd6f0, 14); l.rotation.x = Math.PI/2;
        l.scale.set(1,1,.85); l.position.set(EX*s, EY-.01, Z); head.add(l);
        const rim = torus(.105,.016, col, 14); rim.position.set(EX*s, EY-.01, Z+.005); head.add(rim); });
      const br = box(.14,.025,.03, col,.01); br.position.set(0, EY+.04, Z); head.add(br);
      temples(col); break; }
    case 10: {                                       /* แว่นวิทยาศาสตร์ (โกเกิลแล็บ) */
      [-1,1].forEach(s=>{ const cup = cyl(.12,.13,.08, col, 14); cup.rotation.x = Math.PI/2;
        cup.position.set(EX*s, EY, Z-.02); head.add(cup);
        const lens = cyl(.1,.1,.03, 0xd8f3ff, 14); lens.rotation.x = Math.PI/2;
        lens.position.set(EX*s, EY, Z+.03); head.add(lens); });
      const br = box(.1,.05,.05, col,.02); br.position.set(0, EY, Z-.02); head.add(br);
      const strap = box(.66,.06,.68, petShade(col,.8),.3); strap.position.set(0, EY+.02, .02); head.add(strap);
      break; }
    case 11: {                                       /* แว่นตาแมว (cat-eye) — ปลายบนด้านนอกเชิดขึ้น */
      /* 🐞 **เดิมแบบสุดท้ายเหมือนแบบแรกเป๊ะ** (ผู้ใช้แจ้ง 2026-08-17) — ทั้งคู่เป็น torus .135 ที่ตำแหน่ง
         เดียวกัน ต่างกันแค่ขีดไฮไลต์เล็กๆ ซึ่งมองไม่เห็นบนจอจริง = เด็กเลือกแล้วเหมือนไม่ได้เปลี่ยนอะไร
         ⇒ เขียนใหม่เป็นทรงที่ **เงารวมต่างกันชัด**: กรอบรีแนวนอน + ปีกเชิดขึ้นที่หางตาด้านนอก
         ⚠ ยังเป็น "กรอบโปร่ง" ตามกติกาของแถวนี้ — ห้ามใส่เลนส์ทึบ ไม่งั้นตากลืนหายทั้งดวง */
      [-1,1].forEach(s=>{
        const rim = torus(.115,.021, col, 18); rim.scale.set(1.3,.92,1);
        rim.position.set(EX*s, EY, Z); head.add(rim);
        /* ปีกหางตา — ยื่นเฉียงขึ้นออกนอกใบหน้า คือจุดที่ทำให้อ่านออกว่า "ทรงแมว" */
        const wing = box(.1,.045,.03, col,.018); wing.rotation.z = -s*.62;
        wing.position.set(EX*s + .155*s, EY + .085, Z); head.add(wing);
      });
      const br = box(.085,.026,.03, col,.01); br.position.set(0, EY+.01, Z); head.add(br);
      temples(col); break; }
  }
}
/* ---------- ของสะพายหลัง (index 0 = ไม่สะพาย) ---------- */
/* ⚠ เป้ 1-3 **ไม่ใส่สายพาดอก/สายข้ามไหล่** (ผู้ใช้ขอ 2026-08-04) — มุมกล้องในเกมเห็นตัวเด็กจากด้านหน้าเป็นหลัก
   สายพาดอกเลยกลายเป็นเส้นขวางหน้าอกทับลายเสื้อ ดูรกกว่าได้ประโยชน์ ตัวเป้ด้านหลังพอแล้ว */
function addBackpack(rig, style, col){
  if(!style) return;
  switch(style){
    case 1: {                                        /* เป้นักเรียน */
      const bag = box(.42,.44,.2, col,.09); bag.position.set(0,.7,-.27); rig.add(bag);
      const flap = box(.44,.19,.215, petShade(col,.85),.075); flap.position.set(0,.86,-.275); rig.add(flap);
      const bk = box(.1,.07,.05, 0xfff3d0,.02); bk.position.set(0,.75,-.39); rig.add(bk);
      break; }
    case 2: {                                        /* เป้หมี */
      const bag = sphere(.24, col, 16); bag.scale.set(1,1.05,.78); bag.position.set(0,.72,-.28); rig.add(bag);
      [-1,1].forEach(s=>{ const ear = sphere(.085, col, 10); ear.scale.z = .8; ear.position.set(.16*s,.92,-.28); rig.add(ear); });
      const mz = sphere(.1, 0xfff3d0, 12); mz.scale.set(1,.8,.6); mz.position.set(0,.66,-.42); rig.add(mz);
      const ns = sphere(.035, 0x5d4037, 8); ns.position.set(0,.7,-.47); rig.add(ns);
      [-1,1].forEach(s=>{ const ey = sphere(.03, 0x3d2b1f, 8); ey.position.set(.09*s,.79,-.44); rig.add(ey); });
      break; }
    case 3: {                                        /* กระดองเต่า */
      const sh = sphere(.27, col, 16); sh.scale.set(1,.95,.55); sh.position.set(0,.72,-.26); rig.add(sh);
      const rim = torus(.25,.035, petShade(col,.8), 18); rim.position.set(0,.72,-.24); rig.add(rim);
      [[0,.72],[0,.55],[-.14,.64],[.14,.64],[-.13,.85],[.13,.85]].forEach(([x,y])=>{
        const pl = cyl(.055,.055,.03, petShade(col,1.15), 6); pl.rotation.x = Math.PI/2; pl.position.set(x,y,-.4); rig.add(pl); });
      break; }
    case 4:                                          /* ปีกผีเสื้อ — ทรงโค้งมนล้วน (กรวยเหลี่ยมดูแข็ง ผู้ใช้แจ้ง 2026-08-04)
        ปีกข้างละ 2 แผ่น: แผ่นบนใหญ่ทรงหยดน้ำเอียงขึ้น + แผ่นล่างเล็กเอียงลง ต่อกันเป็นปีกผีเสื้อโค้งเดียว */
      [-1,1].forEach(s=>{
        /* ⚠ ปีกแต่ละแผ่นห่อไว้ใน Group ของตัวเอง แล้วค่อยเอาจุดลายใส่ "ในกลุ่มเดียวกับแผ่นปีก"
           → จุดจะเอียง/หมุนตามแผ่นปีกเองอัตโนมัติ (ผู้ใช้แจ้ง 2026-08-05 ว่าจุดไม่เอียงตามปีก)
           ห้ามเอาจุดไปแปะเป็นลูกของ rig ตรงๆ อีก และห้ามใส่จุดเป็นลูกของ "แผ่นปีก" เพราะแผ่นปีกถูก scale
             บางเป็นแผ่น (scale z .08) จุดจะโดนบีบแบนไปด้วย
           ปีกชิ้นบนเอนปลายไปด้านหลัง (หมุนแกน x ติดลบ) กันปลายปีกไปโผล่ชนผมด้านหลังหัว */
        const mkWing = (px,py,pz, rx,ry,rz) => {
          const w = new THREE.Group(); w.position.set(px,py,pz); w.rotation.set(rx,ry,rz); rig.add(w); return w; };
        const wUp = mkWing(.34*s,1.0,-.3, -.38,-s*.2,-s*.5);
        const up = sphere(.26, col, 18); up.scale.set(1,1.22,.08); wUp.add(up);
        const tipW = mkWing(.56*s,1.14,-.36, -.38,-s*.2,-s*.5);
        const tip = sphere(.15, col, 16); tip.scale.set(1,1.15,.08); tipW.add(tip);
        const wLo = mkWing(.33*s,.6,-.27, 0,-s*.2,s*.35);
        const lo = sphere(.2, petShade(col,1.12), 18); lo.scale.set(1,1.1,.08); wLo.add(lo);
        const bd = box(.07,.52,.1, petShade(col,.7), .035); bd.position.set(0,.8,-.25); rig.add(bd);   /* ลำตัวผีเสื้อกลางปีก */
        [[wUp,.02,.06,.055],[wUp,-.04,-.14,.04],[wLo,0,-.02,.045]].forEach(([w,dx,dy,r])=>{
          /* จุดหนา .05 วางกลางแผ่นปีก (z 0) → โผล่ทั้งสองด้านของผืนปีกที่บางมาก มองจากหน้าหรือหลังก็เห็น */
          const dot = cyl(r,r,.05, 0xfff3d0, 12); dot.rotation.x = Math.PI/2;
          dot.position.set(dx*s, dy, 0); w.add(dot); });
      });
      break;
    case 5:                                          /* ปีกนก — ขน 2 ชั้น (ขนปลายปีกยาว + ขนคลุมโคนปีกสั้น)
        **ใช้สีที่เด็กเลือกทั้งปีก** (ห้ามกลับไป hardcode ขาวแบบปีกนางฟ้าเดิม — ผู้ใช้ขอ 2026-08-05)
        ชั้นคลุมใช้เฉดอ่อนกว่าเล็กน้อย ให้เห็นเป็น 2 ชั้นโดยไม่ต้องเพิ่มแถวเลือกสี */
      /* ⚠ ทรงปีกที่ผู้ใช้กำหนด (2026-08-05): ขนทุกเส้น **เริ่มจากจุดโคนเดียวกัน** แล้วกางปลายด้านนอก
         ออกเป็นพัด ⇒ เงาปีกข้างละอันเป็น "สามเหลี่ยม" ปลายแหลมชี้เข้าหาตัว สองข้างจึงเหมือน
         สามเหลี่ยม 2 อันหันเข้าหากัน — ห้ามกลับไปวางขนแบบเรียงขนานเยื้องกันทีละเส้น
         ทำโดยใส่ขนทุกเส้นไว้ใน Group ที่ตั้งอยู่ "จุดโคนปีก" แล้วเลื่อนขนออกไปครึ่งความยาวตามมุมของตัวเอง */
      [-1,1].forEach(s=>{
        const root = new THREE.Group();
        root.position.set(.24*s, .74, -.3);           /* โคนปีกอยู่กลางแผ่นหลัง ไม่ใช่ระดับหัว/ไหล่ (ผู้ใช้แจ้ง 2026-08-05) */
        /* rotation.z = เอียง "ทั้งปีก" ขึ้น (ผู้ใช้ขอ 2026-08-05) — หมุนที่ root ทีเดียว
           ขนทุกเส้นจึงยกขึ้นพร้อมกันโดยรูปพัดไม่เพี้ยน (ถ้าไปลด th ทีละเส้นพัดจะบีบแคบลงแทน)
           เครื่องหมายต้องคูณ s: ปีกขวา (x บวก) หมุนบวกถึงจะยกขึ้น ปีกซ้ายกลับด้าน
           scale ที่ root = ขยายทั้งปีกพร้อมกัน (ทั้งความยาวขนและระยะกางจากโคน) */
        root.rotation.set(-.3, -s*.18, s*.3);        /* เอนไปด้านหลังทั้งปีก กันผมทับ + เอียงขึ้น */
        root.scale.setScalar(1.2);
        rig.add(root);
        /* ขน 1 เส้น: โคนอยู่ที่จุด (0,0) ของ root เสมอ · th = มุมกางจากแนวตั้ง (มากขึ้น = ชี้ลงล่าง)
           **ไล่ขนาดจากบนลงล่าง: เส้นบนสุดยาว/หนาสุด แล้วสั้นและเรียวลงเรื่อยๆ** (ผู้ใช้แจ้ง 2026-08-05) */
        const quill = (th, L, c, w) => {
          const f = sphere(1, c, 14);
          f.scale.set(w, L/2, .028);
          f.position.set(Math.sin(s*th)*L/2, Math.cos(th)*L/2, 0);
          f.rotation.z = -s*th;
          root.add(f);
        };
        /* เส้นบนสุดกางเกือบขนานพื้น (th ~1.3 rad) ไม่ใช่ชี้ขึ้น → ปลายปีกไม่เลยระดับไหล่ขึ้นไปเทียบข้างหัว
           แล้วไล่ลงถึง ~2.35 rad (ชี้ลงเฉียงหลัง) พร้อมสั้น+เรียวลงทุกเส้น */
        for(let i=0;i<6;i++){                        /* ขนปลายปีก 6 เส้น กางเป็นพัดจากบนลงล่าง */
          const t = i/5;
          quill(1.3 + t*1.05, .76 - t*.36, col, .062 - t*.02);
        }
        for(let i=0;i<3;i++){                        /* ขนคลุมโคนปีก สั้นกว่า ซ้อนอยู่ด้านหน้าโคนเดียวกัน */
          const t = i/2;
          const f = sphere(1, petShade(col,1.16), 14);
          const th = 1.4 + t*.75, L = .38 - t*.1;
          f.scale.set(.056 - t*.014, L/2, .026);
          f.position.set(Math.sin(s*th)*L/2, Math.cos(th)*L/2, .03);
          f.rotation.z = -s*th;
          root.add(f);
        }
      });
      break;
    case 6: {                                        /* กระเป๋าสะพายเฉียง
        ⚠ สายต้องพาดจากไหล่ "ฝั่งตรงข้าม" ลงมาหาตัวกระเป๋า (กระเป๋าซ้าย → สายพาดไหล่ขวา)
          รอบแรกสายกับกระเป๋าอยู่ฝั่งเดียวกัน มองแล้วผิดด้านทันที (ผู้ใช้แจ้ง 2026-08-04) */
      /* ⚠ ตัวกระเป๋าต้องอยู่ "หน้าเสื้อ" ไม่ใช่ข้างสะโพก — ข้างสะโพกจะไปทับมือเด็กพอดี (ผู้ใช้แจ้ง 2026-08-04) */
      const bag = box(.28,.24,.13, col,.06); bag.position.set(-.1,.56,.24); rig.add(bag);
      const flap = box(.29,.1,.14, petShade(col,.85),.04); flap.position.set(-.1,.66,.245); rig.add(flap);
      const bt = cyl(.03,.03,.03, 0xfff3d0, 8); bt.rotation.x = Math.PI/2; bt.position.set(-.1,.59,.315); rig.add(bt);
      [.17,-.17].forEach(z=>{                        /* สายพาดเฉียงจากไหล่ขวาลงมาหาตัวกระเป๋าฝั่งซ้าย */
        const st = box(.06,.56,.04, petShade(col,.85),.02);
        st.position.set(.04,.78,z); st.rotation.z = -.55; rig.add(st); });
      const ov = box(.075,.06,.2, petShade(col,.85),.025); ov.position.set(.22,.9,-.02); rig.add(ov);   /* ช่วงข้ามไหล่ */
      break; }
    /* ================= เฟส 8 (+7) =================
       ⚠ ของสะพายอยู่หลังตัว (z ติดลบ) เสมอ และ **ห้ามใส่สายพาดอก** ตามกติกาเดิมด้านบน */
    case 7: {                                        /* เป้ลายสัตว์ (ลายจุดเสือดาว) */
      const bag = box(.42,.44,.2, col,.09); bag.position.set(0,.7,-.27); rig.add(bag);
      [[-.1,.8],[.08,.74],[-.05,.62],[.11,.6],[0,.68]].forEach(([x,y])=>{
        const sp = cyl(.035,.035,.02, petShade(col,.6), 8); sp.rotation.x = Math.PI/2;
        sp.position.set(x,y,-.375); rig.add(sp); });
      const flap = box(.44,.14,.215, petShade(col,.8),.06); flap.position.set(0,.88,-.275); rig.add(flap);
      break; }
    case 8: {                                        /* กระเป๋าคาดอก (สะพายเฉียงมาข้างหน้า) */
      const bag = box(.26,.2,.14, col,.06); bag.position.set(.2,.62,.2); rig.add(bag);
      const flap = box(.27,.09,.15, petShade(col,.82),.04); flap.position.set(.2,.72,.205); rig.add(flap);
      const strap = box(.06,.5,.05, petShade(col,.9),.02); strap.position.set(.06,.86,.06);
      strap.rotation.z = .5; rig.add(strap);
      break; }
    case 9: {                                        /* ถังน้ำสะพายหลัง */
      const t = cyl(.17,.15,.42, col, 14); t.position.set(0,.72,-.3); rig.add(t);
      const lid = cyl(.18,.18,.05, petShade(col,.75), 14); lid.position.set(0,.95,-.3); rig.add(lid);
      const hose = cyl(.02,.02,.3, petShade(col,.85), 8); hose.rotation.z = .8;
      hose.position.set(.2,.78,-.24); rig.add(hose);
      break; }
    case 10: {                                       /* เป้จรวด */
      [-1,1].forEach(s=>{ const body = cyl(.09,.09,.42, col, 12); body.position.set(.13*s,.74,-.3); rig.add(body);
        const nose = cone(.09,.16, petShade(col,.75), 12); nose.position.set(.13*s,1.02,-.3); rig.add(nose);
        const fire = cone(.07,.14, 0xffa726, 10); fire.rotation.z = Math.PI; fire.position.set(.13*s,.46,-.3); rig.add(fire); });
      const link = box(.2,.08,.1, petShade(col,.85),.03); link.position.set(0,.78,-.3); rig.add(link);
      break; }
    case 11: {                                       /* ปีกค้างคาว */
      [-1,1].forEach(s=>{ for(let i=0;i<3;i++){
        const w = sphere(.17-i*.03, col, 12); w.scale.set(1,.9,.08);
        w.position.set((.3+i*.16)*s, .84-i*.1, -.28); w.rotation.z = -s*(.2+i*.15); rig.add(w); } });
      const bd = box(.08,.4,.1, petShade(col,.7),.03); bd.position.set(0,.78,-.26); rig.add(bd);
      break; }
    case 12: {                                       /* เป้ไดโนเสาร์ (มีหนามหลัง) */
      const bag = sphere(.24, col, 16); bag.scale.set(1,1.05,.78); bag.position.set(0,.72,-.28); rig.add(bag);
      [0,1,2].forEach(i=>{ const sp = cone(.06,.12, petShade(col,1.2), 6);
        sp.position.set(0,.92-i*.16,-.33); sp.rotation.x = -.3; rig.add(sp); });
      const tail = cone(.09,.24, col, 8); tail.rotation.x = 1.2; tail.position.set(0,.56,-.42); rig.add(tail);
      break; }
    case 13: {                                       /* กระเป๋าดอกไม้ */
      const bag = box(.34,.32,.18, col,.11); bag.position.set(0,.7,-.27); rig.add(bag);
      for(let i=0;i<5;i++){ const a = i/5*Math.PI*2;
        const p = sphere(.045, 0xfff3d0, 8); p.position.set(Math.cos(a)*.07, .72+Math.sin(a)*.07, -.37); rig.add(p); }
      const ctr = sphere(.035, 0xffd54f, 8); ctr.position.set(0,.72,-.38); rig.add(ctr);
      break; }
  }
}
/* ---------- ของถือ (index 0 = ไม่ถือ) — ผูกกับ pivot แขนขวา ของจึงแกว่งไปกับมือตอนเดิน ---------- */
function addHoldItem(piv, style, col){
  if(!style) return;
  const g = new THREE.Group();
  /* อยู่ที่มือ (มืออยู่ y -.46 ของ pivot) แต่ **หักล้างมุมเอียงของแขนทิ้ง** แล้วเอียงออกนอกตัวอีกนิด
     ⚠ ถ้าปล่อยให้ของเอียงตามแขน (แขนกางออก .16 rad) ปลายของจะชี้เข้าหาตัว ชนลำตัว/หัวเด็กทันที
       (ผู้ใช้แจ้ง 2026-08-04) — ค่านี้คือ -CH_ARM_T แล้วเผื่อออกนอกตัวอีก .12 */
  /* จุดยึด = "กลางฝ่ามือ" เป๊ะ (มืออยู่ (0,-.46,0) ขนาด .12×.1×.14) โคนของทุกชิ้นถูกวาดที่ y=0 ของกลุ่มนี้
     ⇒ โคนของจะจมอยู่ในมือพอดี ดูเป็นการ "กำไว้" จริงๆ
     ⚠ ห้ามเลื่อนจุดยึดออกไปข้างหน้า/ข้างข้างเพื่อกันของชนตัว — การหมุนด้านล่างหมุนรอบจุดนี้อยู่แล้ว
       จุดยึดขยับเมื่อไหร่ ของจะหลุดลอยห่างมือทันที (ผู้ใช้แจ้ง 2026-08-05) */
  g.position.set(0, -.48, .01);
  /* เอียง 2 แกน: แกน z เอียงออกข้าง (หักล้างมุมกางแขน .16 แล้วเผื่ออีก .12)
     + **แกน x เอียงมาข้างหน้า** เพราะของงอกขึ้นจากมือแล้วชนท่อนแขนที่อยู่เหนือมือพอดี (ผู้ใช้แจ้ง 2026-08-04) */
  g.rotation.set(.42, 0, -CH_ARM_T - .12);
  piv.add(g);
  switch(style){
    case 1: {                                        /* ลูกโป่ง — เอียงเชือกออกนอกตัว ไม่งั้นลูกโป่งไปทับหัวพอดี */
      g.rotation.z -= .2;
      /* เชือกต่อจากข้อสั้นๆ เอียงสลับกันเล็กน้อย = ดูอ่อนพลิ้ว (แท่งตรงยาวท่อนเดียวดูแข็งเป็นไม้ — ผู้ใช้แจ้ง 2026-08-04) */
      let px = 0, py = 0;
      [.1,-.13,.09,-.05].forEach(a=>{
        const L = .22, seg = cyl(.009,.009,L+.02, 0xfff3d0, 5);
        seg.rotation.z = a;
        seg.position.set(px - Math.sin(a)*L/2, py + Math.cos(a)*L/2, 0); g.add(seg);
        px -= Math.sin(a)*L; py += Math.cos(a)*L;
      });
      const bl = sphere(.21, col, 14); bl.scale.y = 1.15; bl.position.set(px, py+.22, 0); g.add(bl);
      const kn = cone(.05,.07, petShade(col,.85), 8); kn.rotation.x = Math.PI; kn.position.set(px, py+.03, 0); g.add(kn);
      const sh = sphere(.05, 0xffffff, 8); sh.scale.set(1,1.3,.4); sh.position.set(px-.08, py+.3, .16); g.add(sh);
      break; }
    case 2: {                                        /* ตุ๊กตาหมี */
      const bd = sphere(.13, 0xc79a6b, 12); bd.scale.y = 1.1; bd.position.y = .04; g.add(bd);
      const hd = sphere(.11, 0xc79a6b, 12); hd.position.y = .21; g.add(hd);
      [-1,1].forEach(s=>{ const er = sphere(.045, 0xc79a6b, 8); er.position.set(.08*s,.29,0); g.add(er);
        const ar = sphere(.055, 0xc79a6b, 8); ar.position.set(.13*s,.06,.02); g.add(ar); });
      const mz = sphere(.055, 0xf0dcc0, 10); mz.scale.set(1,.8,.7); mz.position.set(0,.18,.08); g.add(mz);
      const ns = sphere(.022, 0x5d4037, 8); ns.position.set(0,.2,.13); g.add(ns);
      const bow = box(.09,.05,.05, col,.02); bow.position.set(0,.1,.1); g.add(bow);
      break; }
    case 3: {                                        /* ไอศกรีมโคน */
      const cn = cone(.09,.24, 0xe0a55c, 12); cn.rotation.x = Math.PI; cn.position.y = .1; g.add(cn);
      const s1 = sphere(.1, col, 12); s1.position.y = .26; g.add(s1);
      const s2 = sphere(.085, 0xfff3d0, 12); s2.position.set(.02,.4,0); g.add(s2);
      const ch = sphere(.035, 0xef5350, 8); ch.position.set(.02,.5,0); g.add(ch);
      break; }
    case 4: {                                        /* หนังสือ */
      const bk = box(.26,.3,.07, col,.02); bk.rotation.z = .25; bk.position.y = .12; g.add(bk);
      const pg = box(.24,.28,.075, 0xfffdf5,.015); pg.rotation.z = .25; pg.position.set(.02,.12,.005); g.add(pg);
      const sp = box(.05,.3,.08, petShade(col,.82),.02); sp.rotation.z = .25; sp.position.set(-.12,.09,0); g.add(sp);
      break; }
    case 5: {                                        /* ไม้กายสิทธิ์ */
      const st = cyl(.02,.02,.44, 0xfff3d0, 8); st.position.y = .2; g.add(st);
      const star = chStar(.13,.07, col); star.position.y = .48; g.add(star);
      const ct = cyl(.045,.045,.03, 0xfff3d0, 10); ct.rotation.x = Math.PI/2; ct.position.set(0,.48,.02); g.add(ct);
      [[-.16,.36],[.17,.6]].forEach(([x,y])=>{ const sp = chStar(.045,.028, col); sp.position.set(x,y,0); g.add(sp); });
      break; }
    case 6: {                                        /* ลูกบอล */
      const bl = sphere(.16, 0xfffdf5, 14); bl.position.y = .1; g.add(bl);
      [0,1].forEach(i=>{ const bd = torus(.155,.028, col, 18); bd.rotation.y = i*Math.PI/2; bd.position.y = .1; g.add(bd); });
      break; }
    case 7: {                                        /* ช่อดอกไม้ */
      const wrap = cone(.1,.2, 0xfff3d0, 10); wrap.position.y = .06; g.add(wrap);
      [[-.09,.3,0],[.09,.28,.02],[0,.38,-.02]].forEach(([x,y,z],i)=>{
        const stm = cyl(.014,.014,.24, 0x66bb6a, 6); stm.position.set(x*.5,y-.14,z); stm.rotation.z = -x*1.2; g.add(stm);
        const pc = i===1 ? 0xfff3d0 : (i===2 ? 0xffd54f : col);
        for(let k=0;k<5;k++){ const a = k/5*Math.PI*2, p = sphere(.05, pc, 8);
          p.scale.z = .7; p.position.set(x + Math.cos(a)*.06, y + Math.sin(a)*.06, z); g.add(p); }
        const ct = sphere(.032, 0xffd54f, 8); ct.position.set(x,y,z+.03); g.add(ct);
      });
      break; }
    case 8: {                                        /* ร่ม — ผืนร่มกว้าง ต้องเอียงออกนอกตัวเยอะกว่าของชิ้นอื่น ไม่งั้นชนหน้าเด็ก */
      g.rotation.z -= .38; g.position.x += .06;
      const sh = cyl(.016,.016,.72, 0xfff3d0, 8); sh.position.y = .33; g.add(sh);
      const cap = cone(.33,.3, col, 16); cap.position.y = .72; g.add(cap);           /* กรวย = ทรงร่มกางจริง (ทรงกลมแบนดูเป็นอมยิ้ม) */
      for(let i=0;i<4;i++){ const pn = box(.04,.02,.5, 0xfff3d0,.008);
        pn.rotation.set(-.5, i*Math.PI/4 + .4, 0); pn.position.y = .68; g.add(pn); }  /* ก้านร่มพาดตามผืน */
      const tp = sphere(.035, petShade(col,.85), 8); tp.position.y = .89; g.add(tp);
      const hk = torus(.05,.016, 0xfff3d0, 12); hk.rotation.y = Math.PI/2; hk.position.set(0,-.03,.05); g.add(hk);
      break; }
    /* ================= เฟส 8 (+9) =================
       ⚠ ของทุกชิ้นโคนต้องอยู่ที่ y=0 ของกลุ่ม (กลางฝ่ามือ) — ห้ามเลื่อนจุดยึด ให้เอียงด้วย rotation แทน */
    case 9: {                                        /* ตาข่ายจับแมลง */
      const st = cyl(.014,.014,.6, 0xd7a86e, 8); st.position.y = .28; g.add(st);
      const rim = torus(.16,.018, col, 14); rim.rotation.x = Math.PI/2.6; rim.position.y = .62; g.add(rim);
      const net = cone(.15,.24, 0xfff3d0, 12); net.rotation.x = Math.PI; net.position.y = .74; g.add(net);
      break; }
    case 10: {                                       /* กล้องถ่ายรูป */
      const body = box(.26,.18,.14, col,.05); body.position.y = .12; g.add(body);
      const lens = cyl(.07,.07,.09, petShade(col,.7), 14); lens.rotation.x = Math.PI/2;
      lens.position.set(0,.12,.1); g.add(lens);
      const glass = cyl(.045,.045,.02, 0x9fdcf5, 12); glass.rotation.x = Math.PI/2;
      glass.position.set(0,.12,.16); g.add(glass);
      const fl = box(.07,.05,.04, 0xfff3d0,.02); fl.position.set(-.08,.22,.05); g.add(fl);
      break; }
    case 11: {                                       /* ว่าว */
      g.rotation.z -= .3;
      const str = cyl(.008,.008,.5, 0xfff3d0, 6); str.position.y = .24; g.add(str);
      const kite = box(.26,.26,.02, col,.02); kite.rotation.z = Math.PI/4; kite.position.y = .62; g.add(kite);
      [0,1,2].forEach(i=>{ const bow = sphere(.035, petShade(col,1.2), 8);
        bow.position.set(-.04-i*.03, .44-i*.1, .01); g.add(bow); });
      break; }
    case 12: {                                       /* ไม้เทนนิส */
      const h = cyl(.02,.02,.26, 0xd7a86e, 8); h.position.y = .12; g.add(h);
      const rim = torus(.14,.022, col, 16); rim.position.y = .4; g.add(rim);
      const face = cyl(.125,.125,.012, 0xfff3d0, 16); face.rotation.x = Math.PI/2;
      face.scale.set(1,1,.6); face.position.y = .4; g.add(face);
      break; }
    case 13: {                                       /* กระเป๋าเดินทาง (ถือข้างตัว) */
      g.rotation.x -= .35;
      const body = box(.3,.24,.14, col,.05); body.position.y = -.12; g.add(body);
      const hd = torus(.07,.018, petShade(col,.7), 12); hd.position.y = .04; g.add(hd);
      const band = box(.31,.05,.145, petShade(col,.8),.02); band.position.y = -.12; g.add(band);
      break; }
    case 14: {                                       /* ลูกโป่งรูปสัตว์ (หมา) */
      g.rotation.z -= .2;
      const str = cyl(.008,.008,.4, 0xfff3d0, 6); str.position.y = .2; g.add(str);
      const body = sphere(.13, col, 12); body.scale.set(1.3,1,1); body.position.y = .56; g.add(body);
      const head = sphere(.1, col, 12); head.position.set(.13,.72,0); g.add(head);
      [-1,1].forEach(s=>{ const ear = sphere(.045, petShade(col,.85), 8); ear.scale.set(.6,1.3,.6);
        ear.position.set(.15,.8,.05*s); g.add(ear); });
      break; }
    case 15: {                                       /* ไอศกรีมโคน 2 ลูก */
      const cone1 = cone(.075,.2, 0xe6b877, 10); cone1.rotation.x = Math.PI; cone1.position.y = .1; g.add(cone1);
      const s1 = sphere(.085, col, 12); s1.position.y = .24; g.add(s1);
      const s2 = sphere(.07, petShade(col,1.25), 12); s2.position.y = .37; g.add(s2);
      const ch = sphere(.028, 0xef5350, 8); ch.position.y = .45; g.add(ch);
      break; }
    case 16: {                                       /* กีตาร์จิ๋ว (อูคูเลเล่) */
      /* 🎸 **เขียนใหม่ 2026-08-17** — ของเดิมเป็นก้อนกลม 2 ก้อนสีเดียวกัน + แท่งไม้ + รูดำ
         ⇒ เด็กมองเห็นเป็น "อมยิ้มแดงมีก้าน" ไม่ใช่กีตาร์ (ผู้ใช้แจ้งว่าไม่สวยและแปลก)
         สิ่งที่ทำให้ "อ่านออกว่าเป็นกีตาร์" คือ 4 อย่างนี้ ต้องมีครบ:
           1) ลำตัวทรงเลข 8 (บนเล็ก-ล่างใหญ่) **หน้าแบนเรียบเสมอกัน** ไม่ใช่ 2 ก้อนคนละความหนา
           2) คอ + ฟิงเกอร์บอร์ดสีเข้มกว่า + เฟรตขวาง (แท่งไม้เปล่าดูเหมือนก้านอมยิ้ม)
           3) หัวกีตาร์ + ลูกบิด — เป็นส่วนที่บอกว่า "ปลายนี้คือปลายบน"
           4) **สาย 4 เส้นพาดจากสะพานถึงหัว** ← ตัวชี้ขาดที่สุด ของเดิมไม่มีเลย
         ⚠ ผิวหน้าลำตัวถูกล็อกไว้ที่ z .045 ทั้ง 2 ก้อน (scale.z = .045/r) ⇒ ของที่วางบนหน้ากีตาร์
           (รู/สะพาน/สาย) อ้างระนาบเดียวกันได้หมด ไม่ต้องเดาเลขทีละชิ้น */
      /* 🖐️ **ต้องจับที่ "คอ" ไม่ใช่ให้ลำตัวคร่อมมือ** (ผู้ใช้แจ้ง 2026-08-17: กีตาร์ทับมือ มือทะลุ)
         ของทุกชิ้นในแถวนี้โคนอยู่ที่ y=0 = กลางฝ่ามือ แล้วงอกขึ้นบน ⇒ กีตาร์เอาลำตัว (ก้อนใหญ่สุด)
         ไปวางทับฝ่ามือพอดี มือจึงจมอยู่ในลำตัวแล้วโผล่ทะลุออกมาตรงสะพานสาย
         ⇒ กลับด้านการจัดวาง: **คอพาดผ่าน y=0** (มือกำคอ ซึ่งเป็นท่าถือจริง) แล้วลำตัวห้อยลงข้างล่าง
         ⚠ ลำตัวห้อยลง = ต้องย่อขนาดลงด้วย ไม่งั้นก้นกีตาร์ไปกวาดพื้น/ชนขาเด็ก
           (ก้นกีตาร์อยู่ที่ y -.36 ⇒ ในโลกจริงสูงจากพื้นราว .1 พอดีข้างขา) */
      g.rotation.x -= .18; g.rotation.z -= .06;
      const FACE = .034, WOOD = 0xd7a86e, DARK = 0x8a6239, STR = 0xfff3d0;
      const bout = (r, y)=>{ const b = sphere(r, col, 16); b.scale.z = FACE/r; b.position.y = y; g.add(b); };
      bout(.105, -.26);                              /* ลำตัวท่อนล่าง (ใหญ่) — ห้อยใต้มือ */
      bout(.078, -.135);                             /* ลำตัวท่อนบน (เล็ก) = เอวคอด ⇒ ทรงเลข 8 */
      const nk = box(.05,.30,.045, WOOD,.014); nk.position.set(0,.10,.014); g.add(nk);         /* คอ — พาดผ่านฝ่ามือ */
      const fb = box(.045,.28,.014, DARK,.005); fb.position.set(0,.11,FACE+.006); g.add(fb);   /* ฟิงเกอร์บอร์ด */
      [.10,.17,.23].forEach(y=>{ const fr = box(.047,.007,.006, STR,.002);
        fr.position.set(0,y,FACE+.014); g.add(fr); });                                          /* เฟรต */
      const hs = box(.075,.09,.045, DARK,.018); hs.position.set(0,.29,.014); g.add(hs);        /* หัวกีตาร์ */
      [-1,1].forEach(s=>[0,1].forEach(i=>{                                                      /* ลูกบิด 4 ตัว */
        const pg = cyl(.011,.011,.045, STR, 8); pg.rotation.z = Math.PI/2;
        pg.position.set(.048*s, .268+i*.04, .014); g.add(pg); }));
      const hole = cyl(.032,.032,.02, 0x3b2c1f, 12); hole.rotation.x = Math.PI/2;
      hole.position.set(0,-.19,FACE); g.add(hole);                                              /* รูเสียง */
      const ros = torus(.042,.01, petShade(col,.78), 14); ros.position.set(0,-.19,FACE); g.add(ros);
      const br = box(.07,.022,.018, DARK,.007); br.position.set(0,-.325,FACE+.005); g.add(br);  /* สะพานสาย */
      [-.017,-.006,.006,.017].forEach(x=>{                                                      /* สาย 4 เส้น */
        const st = box(.005,.61,.005, STR); st.position.set(x,-.02,FACE+.018); g.add(st); });
      break; }
    case 17: {                                       /* ธงเล็ก */
      const pole = cyl(.012,.012,.66, 0xd7a86e, 8); pole.position.y = .32; g.add(pole);
      const fl = box(.24,.16,.02, col,.02); fl.position.set(.13,.56,0); g.add(fl);
      const st = sphere(.03, 0xffd54f, 8); st.position.y = .67; g.add(st);
      break; }
  }
}

/* ---------- แบบรองเท้า (แถวใหม่เฟส 8 · index 0 = ผ้าใบ ซึ่งเป็นทรงเดิมของเกม) ----------
   ⚠ index 0 ต้องเป็น "ทรงเดิม" เป๊ะเสมอ — เด็กที่เล่นอยู่ก่อนเฟส 8 ไม่มีคีย์ `shoeStyle` ใน save
     จะตกมาที่ 0 เอง ⇒ รองเท้าต้องหน้าตาเหมือนเดิมทุกประการ ไม่งั้นตัวละครเปลี่ยนเองทั้งเมือง
   ⚠ ทุกแบบต้องยึด y = -.35 (ระดับพื้นเท้าเดิม) ไม่งั้นเท้าจมพื้นหรือลอย */
/* 🥾 **ปลอกบูทต้อง "อ้วนกว่าขา" เสมอ ไม่งั้นกางเกงแทงทะลุออกมาเป็นแถบ** (ผู้ใช้แจ้ง 2026-08-17)
   ขาเด็ก (ทั้งกางเกงและขาสีผิว) คือกล่อง .18 × .18 อยู่ที่ z 0 ⇒ ปลอกบูทที่กว้าง .19-.20
   เผื่อไว้แค่ข้างละ .005-.01 ซึ่ง **น้อยกว่าความมนของขอบกล่องเสียอีก** มุมขากางเกงจึงโผล่พ้นบูทออกมา
   (บูทสั้นเบอร์ 1 และบูทกันฝนเบอร์ 4 เป็นแบบนี้ทั้งคู่ — เห็นเป็นรอยสีกางเกงพาดกลางบูท)
   ⇒ กติกา: ปลอกบูท ≥ LEG_W + .06 (เผื่อข้างละ .03) · ขอบปากบูทต้องอ้วนกว่าปลอกอีกชั้น */
const LEG_W = .18;                        /* ต้องตรงกับกล่องขาใน buildCharacter */
const BOOT_W = LEG_W + .06;               /* .24 — ปลอกบูทที่กลืนขากางเกงได้มิด */
function addShoe(piv, style, col, girl){
  const Y = -.35;
  switch(style|0){
    case 1: {                                        /* บูทหุ้มข้อ */
      const sh = box(.2,.11,.25, col,.045); sh.position.set(0,Y,.03); piv.add(sh);
      /* ⚠ ปลอกต้อง **ซ้อนลงมาทับส่วนเท้า** ด้วย ไม่งั้นเหลือช่องแคบๆ ตรงข้อเท้าให้ขากางเกงโผล่ */
      const shaft = box(BOOT_W,.21,BOOT_W, col,.05); shaft.position.set(0,Y+.13,-.01); piv.add(shaft);
      const cuff = box(BOOT_W+.02,.05,BOOT_W+.02, petShade(col,1.2),.03); cuff.position.set(0,Y+.21,-.01); piv.add(cuff);
      break; }
    case 2: {                                        /* รองเท้าแตะ */
      const sole = box(.19,.05,.24, col,.03); sole.position.set(0,Y-.02,.03); piv.add(sole);
      const strap = box(.17,.04,.05, petShade(col,1.25),.02); strap.position.set(0,Y+.03,.08); piv.add(strap);
      break; }
    case 3: {                                        /* รองเท้าเต้น (บัลเลต์) */
      const sh = box(.18,.08,.24, col,.07); sh.position.set(0,Y-.01,.03); piv.add(sh);
      const bow = sphere(.035, petShade(col,1.3), 8); bow.scale.set(1.6,.8,.6);
      bow.position.set(0,Y+.05,.1); piv.add(bow);
      [-1,1].forEach(s=>{ const rb = box(.03,.03,.14, petShade(col,1.3),.01);
        rb.position.set(.07*s,Y+.1,-.02); rb.rotation.x = .3; piv.add(rb); });
      break; }
    case 4: {                                        /* บูทกันฝน (ยาวถึงน่อง) */
      /* ⚠ ปลอกยาวถึงน่อง = ทับขากางเกงเป็นช่วงยาวที่สุดในบรรดารองเท้าทุกแบบ ⇒ ต้องอ้วนที่สุดด้วย */
      const sh = box(.22,.12,.27, col,.05); sh.position.set(0,Y,.03); piv.add(sh);
      const shaft = box(BOOT_W+.01,.33,BOOT_W+.01, col,.06); shaft.position.set(0,Y+.17,-.01); piv.add(shaft);
      const band = box(BOOT_W+.03,.04,BOOT_W+.03, petShade(col,.75),.02); band.position.set(0,Y+.32,-.01); piv.add(band);
      break; }
    case 5: {                                        /* รองเท้าสเก็ต (มีล้อ) */
      /* 🐞 **ล้อจมลงไปในพื้น** (ผู้ใช้แจ้ง 2026-08-17) — รองเท้าทุกแบบยึด "พื้นเท้า" ที่ y = Y-.055
         (ขอบล่างของรองเท้าผ้าใบมาตรฐาน) แต่ใบนี้วางล้อไว้ที่ Y-.10 รัศมี .045 ⇒ ก้นล้ออยู่ที่ Y-.145
         ต่ำกว่าพื้นไป .09 เต็มๆ ⇒ เห็นแค่หลังล้อโผล่พ้นหญ้ามานิดเดียว
         ⇒ ยกทั้งชุดขึ้น .09 ให้ **ก้นล้อแตะระดับพื้นเดียวกับรองเท้าแบบอื่นพอดี**
         ⚠ ของที่มีล้อ/ฐานยื่นต้องคิดจากจุดต่ำสุดของชิ้นเสมอ ไม่ใช่จากกึ่งกลางชิ้น */
      /* 🐞 **รอบที่ 2: ยกรองเท้าขึ้นแล้วเท้าโผล่ออกมาข้างล่างแทน** (ผู้ใช้แจ้ง 2026-08-17)
         ขาเด็กเป็นกล่องยาวจบที่ y -.38 (ค่าตายตัวใน buildCharacter) ⇒ ตัวรองเท้าต้องคลุมถึง -.38 เสมอ
         แต่ถ้าคลุมถึง -.38 แล้วยังต้องมีล้ออยู่ใต้นั้นอีก จะทะลุพื้นทันที
         ⇒ ทางออก: **ยืดตัวบูทให้สูงขึ้นแทนที่จะยกทั้งชิ้น** — บูทกินตั้งแต่ -.40 ขึ้นไปถึงข้อเท้า
           (คลุมปลายขามิด) แล้ววางเฟรม+ล้อไว้ในช่วง -.40 ถึง -.44 ซึ่งเป็นช่องว่างที่ยังไม่จมพื้น
           (พื้นจริงอยู่ที่ piv-local -.44 · รองเท้ามาตรฐานวางก้นไว้ที่ -.405 = ลอยเหนือพื้นเล็กน้อย)
         ⚠ ล้อจึงต้องเล็ก (r .035) — เป็นเพดานที่ความยาวขากับระดับพื้นบังคับไว้ ไม่ใช่ค่าที่เลือกเอง */
      /* 📐 **งบความสูงของใบนี้คำนวณมาแล้ว ห้ามขยับเลขมั่ว** — 3 ค่านี้บีบทุกอย่างไว้หมด:
             ปลายขาเด็ก  y = -.38  (กล่องขาใน buildCharacter · ค่าตายตัว)
             ระดับพื้นจริง y = -.44  (ต่ำกว่านี้ = จมหญ้า)
             ⇒ เหลือช่องใต้ปลายขาแค่ .06 สำหรับ "เฟรม + ล้อ" ทั้งชุด
         ⇒ ล้อจึงต้องรัศมี .025 (Ø.05) เท่านั้น — ไม่ใช่ค่าที่เลือกเพราะสวย แต่เพราะพื้นที่มีเท่านี้
           รอบก่อนใช้ r .05 แล้วล้อจมพื้น · พอยกขึ้นก็กลายเป็นปลายขาโผล่ใต้รองเท้าแทน (ผู้ใช้แจ้ง 2 รอบ)
         ⇒ วิธีที่ลงตัว: ให้ **แผ่นเฟรมเป็นตัวปิดปลายขา** (กว้าง .20 > ขา .18) แล้ววางล้อใต้เฟรมพอดี
           ตัวบูทจึงไม่ต้องยืดลงไปแย่งที่ล้อ */
      const shaft = box(BOOT_W,.20,BOOT_W, col,.06); shaft.position.set(0,Y+.19,-.01); piv.add(shaft);
      const cuff = box(BOOT_W+.02,.045,BOOT_W+.02, petShade(col,1.2),.025);
      cuff.position.set(0,Y+.29,-.01); piv.add(cuff);
      const sh = box(.21,.16,.26, col,.05); sh.position.set(0,Y+.065,.03); piv.add(sh);
      const plate = box(.20,.028,.26, petShade(col,.5),.012); plate.position.set(0,Y-.029,.03); piv.add(plate);
      [-.075,.075].forEach(z=>{ const w = cyl(.025,.025,.05, petShade(col,.4), 12); w.rotation.z = Math.PI/2;
        w.position.set(0,Y-.065,.03+z); piv.add(w);
        const hub = cyl(.011,.011,.056, 0xfff3d0, 10); hub.rotation.z = Math.PI/2;
        hub.position.set(0,Y-.065,.03+z); piv.add(hub); });
      break; }
    case 6: {                                        /* รองเท้าวิ่ง (มีแถบข้าง) */
      const sh = box(.2,.12,.26, col,.05); sh.position.set(0,Y,.03); piv.add(sh);
      const sole = box(.21,.04,.27, 0xfff3d0,.02); sole.position.set(0,Y-.06,.03); piv.add(sole);
      [-1,1].forEach(s=>{ const st = box(.02,.05,.14, petShade(col,1.35),.01);
        st.position.set(.1*s,Y+.01,.04); st.rotation.x = .25; piv.add(st); });
      break; }
    case 7: {                                        /* รองเท้าบูทหิมะ (บุขนหนา) */
      /* 🐞 **ดูไม่ออกว่าเป็นรองเท้าแบบไหน** (ผู้ใช้แจ้ง 2026-08-17) — ของเดิมคือกล่อง 3 ใบซ้อนกัน
         และ "ขนฟู" เป็นสีครีมซึ่ง **กลืนไปกับรองเท้าสีขาว** (สีปริยาย) ⇒ เหลือแค่ก้อนขาวๆ ก้อนเดียว
         ⇒ ต้องอ่านออกด้วย **เงารูปทรง** ไม่ใช่ด้วยสี เพราะเด็กเปลี่ยนสีรองเท้าได้ทุกสี:
             1) ปลอกขนที่ปากบูท **อ้วนกว่าตัวบูทชัดๆ** (เงาป่องออกด้านบน = ขนฟู)
             2) พื้นดอกยางหนาสีเข้ม + ร่องดอกยาง 3 ร่อง (บอกว่าเป็นพื้นกันลื่นหิมะ)
             3) หัวบูทสีเข้มกว่า (toe cap) — ตัดกับตัวบูทเสมอไม่ว่าเด็กเลือกสีอะไร
         ⚠ ปลอกขนต้องกว้างกว่าขา (LEG_W) มากๆ ไม่งั้นกลับไปเป็นกล่องซ้อนกล่องเหมือนเดิม */
      const sole = box(.26,.065,.30, petShade(col,.5),.025); sole.position.set(0,Y-.03,.03); piv.add(sole);
      [-.07,.03,.13].forEach(z=>{ const tr = box(.27,.03,.05, petShade(col,.38),.012);
        tr.position.set(0,Y-.055,z); piv.add(tr); });                       /* ร่องดอกยาง */
      const body = box(.22,.16,.26, col,.05); body.position.set(0,Y+.05,.02); piv.add(body);
      const toe  = box(.225,.085,.13, petShade(col,.62),.035); toe.position.set(0,Y+.02,.10); piv.add(toe);
      const fur  = box(.31,.12,.31, 0xfff3d0,.06); fur.position.set(0,Y+.18,0); piv.add(fur);
      break; }
    default: {                                       /* 0 = ผ้าใบ (ทรงเดิมของเกม ห้ามเปลี่ยน) */
      const sh = box(.2,.11,.25, col,.045); sh.position.set(0,Y,.03); piv.add(sh);
      break; }
  }
}

function buildCharacter(cfg){
  const g = new THREE.Group();
  const rig = new THREE.Group(); g.add(rig);
  const girl = cfg.gender === 1;
  /* กางเกง-กระโปรง ยังรองรับ "แบบ 2 สี" (entry เป็น object {a,b}) — a สีหลัก, b ท่อนล่าง/ชายกระโปรง
     ส่วนเสื้อเป็นสีเดียวล้วนแล้ว (ลายทางตั้งย้ายไปอยู่แถว "ลายเสื้อ") — เผื่อข้อมูลเก่าที่ยังเก็บ object ไว้ ให้หยิบ .a มาใช้ */
  const shirtE = H_SHIRT_COLORS[cfg.shirt] ?? H_SHIRT_COLORS[0];
  const shirtC = (shirtE && typeof shirtE === 'object') ? shirtE.a : shirtE;
  const botE = H_BOTTOM_COLORS[cfg.bottom] ?? H_BOTTOM_COLORS[0];
  const bot2 = (botE && typeof botE === 'object') ? botE : null;
  const botC = bot2 ? bot2.a : botE;
  const botB = bot2 ? bot2.b : botE;
  const shoeC = H_SHOE_COLORS[cfg.shoes] ?? H_SHOE_COLORS[0];

  /* สะโพกกางเกง (เด็กชาย) — บล็อกมนกว้างเชื่อมลำตัวกับขา ให้ขาไม่ดูขาดลอยจากตัว
     (เด็กหญิงไม่ต้อง เพราะกระโปรงคลุมสะโพกเชื่อมให้อยู่แล้ว) */
  if(!girl){
    const hip = box(.5,.22,.31, botC, .09); hip.position.y = .46; rig.add(hip);
  }
  /* ขา (pivot ที่สะโพก y .44 ให้แกว่งได้) — แท่งมนโผล่จากสะโพก ปลายบนซ้อนเข้าสะโพกให้เชื่อมเนียนเหมือนแขน
     เด็กชายเป็นกางเกงถึงเท้า เด็กหญิงเป็นขาสีผิว (กระโปรงคลุมสะโพก) */
  const legs = [-1,1].map(s=>{
    const piv = new THREE.Group(); piv.position.set(.14*s,.44,0);
    if(girl){
      const leg = box(.18,.42,.18, H_SKIN, .06); leg.position.y = -.17; piv.add(leg);
    }else if(bot2){                                   /* กางเกง 2 สี: ท่อนบน a / ท่อนล่าง b */
      const up = box(.18,.26,.18, botC, .06); up.position.y = -.08; piv.add(up);
      const lo = box(.182,.22,.182, botB, .06); lo.position.y = -.3; piv.add(lo);
    }else{
      const leg = box(.18,.42,.18, botC, .06); leg.position.y = -.17; piv.add(leg);
    }
    addShoe(piv, cfg.shoeStyle|0, shoeC, girl);   /* เฟส 8: แบบรองเท้า (0 = ทรงผ้าใบเดิม) */
    rig.add(piv); return piv;
  });
  if(girl){
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.24,.4,.24,10), toonMat(botC));
    skirt.castShadow = hSh(); skirt.position.y = .42; rig.add(skirt);
    if(bot2){                                         /* กระโปรง 2 สี: ตัวกระโปรง a + ชายกระโปรง b */
      const hem = new THREE.Mesh(new THREE.CylinderGeometry(.385,.42,.09,10), toonMat(botB));
      hem.castShadow = hSh(); hem.position.y = .335; rig.add(hem);
    }
  }
  /* ตัว (เสื้อ) — ใช้ทรงเดียวกับแบบสีเดียวเสมอ (กล่องขอบมน) ให้ silhouette เหมือนกัน
     แบบ 2 สี = วางแถบสี b 2 แถบแนบหน้าเสื้อสีหลัก a ให้เห็นเป็นลายทางแนวตั้ง a/b/a/b/a
     โดยตัวเสื้อฐานยังเป็นกล่องขอบมน มุม/ข้างจึงมนเหมือนแบบสีเดียว ไม่เป็นเหลี่ยม */
  {
    const body = box(.52,.5,.32, shirtC); body.position.y = .68; rig.add(body);
  }
  /* แขน (pivot ที่ไหล่) — แขนเป็นแท่งมนแท่งเดียวยาวเท่าลำตัว ปลายบนซ้อนเข้าไหล่ให้เชื่อมเนียน
     (เลิกใช้ลูกกลมที่ไหล่ เพราะดูป่องเป็นก้อนกลมเกินไป ไม่เป็นทรงแขน) */
  const arms = [-1,1].map(s=>{
    const piv = new THREE.Group(); piv.position.set(.28*s,.9,0);
    piv.rotation.z = .16*s;                        /* ไหล่คงที่ แต่ปลายแขนกางออกจากลำตัวเล็กน้อย ให้ท่าดูเป็นธรรมชาติ + ปลายแขนพ้นกระโปรงเด็กหญิง */
    const arm = box(.15,.46,.16, shirtC, .075); arm.position.y = -.21; piv.add(arm);  /* สั้นลงนิด (เดิม .52) กันปลายแขน/มือจมกระโปรง */
    const hand = box(.12,.1,.14, H_SKIN, .045); hand.position.y = -.46; piv.add(hand);
    rig.add(piv); return piv;
  });
  /* ลายเสื้อ + ของสะพายหลัง + ของถือ (ลายต้องมาหลังแขน เพราะลายทางขวางต้องพันแขนด้วย)
     สีของแต่งแยกจานสีของใครของมัน (hatC/glassC/bagC/holdC) — ค่าที่ไม่มีในข้อมูลเก่าถอยไปใช้ค่า default */
  const accOf = (k, d) => H_ACC_COLORS[cfg[k] ?? H_DEFAULT_CHAR[k] ?? d] ?? H_ACC_COLORS[d];
  addShirtPattern(rig, arms, (cfg.pattern|0) % H_PATTERN_N, shirtC, null, botC, girl);
  addBackpack(rig, (cfg.bag|0) % H_BAG_N, accOf('bagC', 0));
  addHoldItem(arms[1], (cfg.hold|0) % H_HOLD_N, accOf('holdC', 2));   /* arms[1] = แขนขวา (s=+1) */
  /* หัว + หน้า — ใช้ softMat กับกะโหลกให้เงาบนใบหน้านุ่มลง (ไม่เข้มเป็นหย่อม) */
  const head = new THREE.Group(); head.position.y = 1.26; rig.add(head);
  const skull = new THREE.Mesh(roundedBoxGeo(.64,.6,.66), softMat(H_SKIN));
  skull.castShadow = hSh(); head.add(skull);
  /* % H_HAIR_N: ตัวละครที่ save ไว้ตอนยังมี 10 ทรง (index 6-9) ให้วนกลับเข้าช่วง 6 ทรงปัจจุบัน ไม่กลายเป็นหัวล้าน
     หมวกที่ครอบหัวจริง (แก๊ป/ไหมพรม/ฟาง) → ซ่อนทรงผมที่เลือกแล้วใช้ "ผมประจำหมวก" แทน (ดู addHatHair) */
  const hatStyle = (cfg.hat|0) % H_HAT_N;
  const hairCol = H_HAIR_COLORS[cfg.hairC] ?? H_HAIR_COLORS[0];
  if(HAT_COVER_HAIR.has(hatStyle)) addHatHair(head, hatStyle, hairCol, girl);
  else addHair(head, girl, (cfg.hair|0) % H_HAIR_N, hairCol);
  addEyes(head, cfg.eyes|0, H_EYE_COLORS[cfg.eyeC] ?? H_EYE_COLORS[0]);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.06,.018,6,10,Math.PI), toonMat(0xc9573f));
  mouth.rotation.z = Math.PI; mouth.position.set(0,-.12,.345); head.add(mouth);
  [-1,1].forEach(s=>{ const ch = sphere(.045,0xffb3a0,8); ch.scale.z = .4; ch.position.set(.24*s,-.08,.34); head.add(ch); });
  addGlasses(head, (cfg.glass|0) % H_GLASS_N, accOf('glassC', 9));   /* แว่นก่อนหมวก: หมวกจะได้ทับขาแว่นตรงขมับ ไม่ใช่แว่นทับหมวก */
  addHeadwear(head, hatStyle, accOf('hatC', 5));

  g.userData = {rig, legs, arms, head};
  return g;
}
    return {hairShell, hairBang, hairStrand, hairSpike, hairLock, hairCap, addHair, addEyes, chStar, chHeart, chArmBand, addShirtPattern, addHatHair, addHeadwear, addGlasses, addBackpack, addHoldItem, addShoe, buildCharacter, HAT_COVER_HAIR,
      CH:{CH_BW, CH_BH, CH_BD, CH_BY, CH_AW, CH_AD, CH_SHO_Y, CH_ARM_T}};
  };
})();
