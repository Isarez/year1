/* ============================================================
   บ้านของหนู — โมเดลตึก/ร้านค้าในเมือง (แยกออกจาก js/house.js เมื่อ 2026-08-12)

   ทำไมต้องแยก: js/house.js โตเป็น 12,600 บรรทัด โดยเกือบครึ่งเป็นโค้ดวาดโมเดล 3D
   ⇒ แยกส่วนที่ "วาดของชิ้นเดียว จบในตัวเอง" ออกมา ให้ house.js เหลือแต่ระบบเกม
     (ลูปวาด · การเดิน · เควสต์ · ตกแต่ง · สัตว์เลี้ยง)

   ⚠ **ตัวประกอบร่างฉาก (`buildStaticScenery`/`buildWorld`) ไม่ได้ย้ายมาโดยตั้งใจ** —
     วัดแล้วมันเรียกฟังก์ชันอื่นถึง 82 ตัว ถ้าย้ายต้องส่ง context มหาศาลจนอ่านยากกว่าเดิม
     ⇒ ของที่ย้ายมาคือกลุ่มที่ coupling ต่ำจริง (ต้องส่งเข้า kit แค่ 6 อย่าง) เท่านั้น
   ⚠ ประกาศ global HOUSE_MODELS(kit) แบบเดียวกับ house-furniture.js / house-avatar.js
     ⇒ ต้องโหลด **ก่อน** js/house.js เสมอ
   ============================================================ */
(function(){
  'use strict';

  window.HOUSE_MODELS = function(kit){
    const THREE = kit.THREE;
    const box = kit.box, sphere = kit.sphere, cyl = kit.cyl, cone = kit.cone, torus = kit.torus;
    const toonMat = kit.toonMat, softMat = kit.softMat, roundedBoxGeo = kit.roundedBoxGeo;
    const petShade = kit.petShade;   /* ปรับเฉดสี (ใช้กับขนสัตว์ที่ตั้งโชว์หน้าร้านสัตว์เลี้ยง) */
    /* ตัวช่วยของฝั่ง house.js ที่โมเดลพวกนี้ต้องใช้ — รับเป็น reference เรียกตอนวาดจริง */
    const signPlane = kit.signPlane, addSeatSpot = kit.addSeatSpot, fxTag = kit.fxTag;
    const outWX = kit.outWX, outWZ = kit.outWZ;
    const FOOD_DECK = kit.FOOD_DECK;
    /* ⚠ `hShadows` ฝั่ง js/house.js เป็น `let` ที่ตั้งค่าทีหลังตอน initThreeCore (เปิดเงาเฉพาะจอใหญ่)
       ⇒ ต้องรับเป็นฟังก์ชันแล้วอ่านสดทุกครั้ง ถ้ารับเป็นค่าจะได้ false ค้างตลอด = ตึกทั้งเมืองไม่มีเงา
       (พลาดมาแล้ว 2 รอบในวันเดียว — ทั้งตอนแยก house-avatar.js และไฟล์นี้) */
    const hSh = kit.hShadows;

function addRoofGable(g, bw, bd, bh, roofHex, wallHex, rise){
  const HALF = bw/2+.22, DEP = bd+.34;
  const rmat = toonMat(roofHex), slopeLen = Math.hypot(HALF, rise), ang = Math.atan2(rise, HALF);
  [1,-1].forEach(s=>{
    const pl = new THREE.Mesh(roundedBoxGeo(slopeLen, .16, DEP, .05), rmat);
    pl.castShadow = hSh(); pl.rotation.z = -s*ang;
    pl.position.set(s*HALF/2, bh + rise/2, 0); g.add(pl);
  });
  const sh = new THREE.Shape();
  sh.moveTo(-bw/2, 0); sh.lineTo(bw/2, 0); sh.lineTo(0, rise); sh.closePath();
  const gableGeo = new THREE.ExtrudeGeometry(sh, {depth:.1, bevelEnabled:false});
  const wmat = toonMat(wallHex);
  [bd/2-.04, -bd/2-.06].forEach(z=>{ const m = new THREE.Mesh(gableGeo, wmat); m.position.set(0, bh, z); g.add(m); });
}
function addRoofHip(g, bw, bd, bh, roofHex){       /* ปั้นหยา: พีระมิดตัดยอด 4 เหลี่ยม */
  /* หมุน 45° ลงไปใน geometry ก่อน (ไม่ใช่ที่ mesh.rotation) แล้วค่อย scale x/z แยกกัน
     ไม่งั้นต้องใช้ด้านยาวสุดด้านเดียวทั้ง 2 แกน หลังคาจะยื่นคลุมผนังหน้าบ้านจนมองไม่เห็น */
  const geo = new THREE.CylinderGeometry(.14, .707, .92, 4);
  geo.rotateY(Math.PI/4);
  const r = new THREE.Mesh(geo, toonMat(roofHex));
  r.castShadow = hSh(); r.scale.set(bw + .42, 1, bd + .42);
  r.position.y = bh + .46; g.add(r);
  const cap = sphere(.11, roofHex, 8); cap.position.y = bh + .95; g.add(cap);
}
function addChimney(g, bw, bd, bh, rise){
  const ch = box(.3, .74, .3, 0xd08b6a, .04); ch.position.set(bw*.28, bh + rise*.5, -bd*.18); g.add(ch);
  const cap = box(.4, .1, .4, 0xf3e7d6, .03); cap.position.set(bw*.28, bh + rise*.5 + .42, -bd*.18); g.add(cap);
  /* ควันลอยออกจากปล่อง 3 ก้อน เหลื่อมจังหวะกัน (วัสดุ clone เพื่อจางหายได้ทีละก้อน) */
  for(let i=0; i<3; i++){
    const sm = sphere(.15, 0xf4f1ea, 8);
    sm.material = sm.material.clone(); sm.material.transparent = true; sm.material.opacity = .78;
    sm.position.set(bw*.28, bh + rise*.5 + .58, -bd*.18);
    fxTag(sm, 'smoke', {ph: i/3}); g.add(sm);
  }
}
function addWindowPair(g, bw, bd, y, boxed){
  [-1,1].forEach(s=>{
    const wf = box(.58,.58,.06,0xffffff); wf.position.set(s*(bw/2-.52), y, bd/2+.02); g.add(wf);
    const wi = box(.44,.44,.09,0xaadcf5); wi.position.set(s*(bw/2-.52), y, bd/2+.03); g.add(wi);
    if(boxed){                                     /* กระถางดอกไม้ใต้หน้าต่าง */
      const bx = box(.6,.14,.16,0x9c6238,.04); bx.position.set(s*(bw/2-.52), y-.36, bd/2+.1); g.add(bx);
      [-.18,0,.18].forEach((o,i)=>{
        const fl = sphere(.07, [0xff8fb3,0xffd54f,0xb388ff][i], 8);
        fl.position.set(s*(bw/2-.52)+o, y-.24, bd/2+.11); g.add(fl);
      });
    }
  });
}
function addDoor(g, bd, hex){
  const door = box(.62, .98, .1, hex||0x9c6238); door.position.set(0, .49, bd/2+.02); g.add(door);
  const knob = sphere(.05, 0xffd54f, 8); knob.position.set(.19, .48, bd/2+.08); g.add(knob);
}
/* สัญลักษณ์ของยักษ์ตั้งบนหลังคาร้าน — เด็กมองจากมุมไอโซไกลๆ ก็รู้ทันทีว่าร้านนี้ขายอะไร
   (ร้านไอศกรีมมีโคนยักษ์อยู่ก่อนแล้ว จึงทำให้ครบทุกร้านแบบเดียวกัน) */
function addShopEmblem(g, kind, bh){
  if(kind==='ice') return;                          /* มีโคนไอศกรีมยักษ์อยู่แล้ว */
  const y0 = bh + .95;                              /* สันหลังคา */
  const post = cyl(.07,.07,.5,0xf7f3ee,8); post.position.set(0, y0+.2, 0); g.add(post);
  const base = y0 + .5;
  if(kind==='mart'){                                /* ตะกร้าช็อปปิ้งใบโต มีของโผล่พ้นปาก */
    const bk = cyl(.32,.26,.34,0xef8354,14); bk.position.set(0, base+.2, 0); g.add(bk);
    const rim = torus(.32,.045,0xfffaf0,14); rim.rotation.x = Math.PI/2; rim.position.set(0, base+.36, 0); g.add(rim);
    const hd = torus(.22,.035,0xd8dee3,14); hd.position.set(0, base+.42, 0); g.add(hd);   /* หูหิ้วโค้ง */
    [[-.14,.44,.06,0x7fc4e8],[.13,.48,0,0xffd54f],[-.02,.52,-.1,0xff8fb3]].forEach(([ox,oy,oz,c])=>{
      const gd = box(.19,.22,.16,c,.03); gd.position.set(ox, base+oy, oz); g.add(gd);
    });
  } else if(kind==='toy'){                          /* ตุ๊กตาหมียักษ์ */
    const bd2 = sphere(.26,0xd9a86c,12); bd2.position.set(0, base+.24, 0); g.add(bd2);
    const hd = sphere(.22,0xe8b46a,12); hd.position.set(0, base+.62, 0); g.add(hd);
    [-1,1].forEach(s=>{ const ea = sphere(.1,0xd9a86c,10); ea.position.set(s*.18, base+.78, 0); g.add(ea); });
    [-1,1].forEach(s=>{ const ey = sphere(.03,0x3a2f28,8); ey.position.set(s*.08, base+.64, .2); g.add(ey); });
    const mz = sphere(.09,0xf2d5a8,10); mz.position.set(0, base+.56, .18); g.add(mz);
  } else if(kind==='pet'){                          /* รอยเท้าสัตว์ยักษ์ */
    const pw = sphere(.26,0xf2a65a,12); pw.scale.set(1.05,.55,.9); pw.position.set(0, base+.28, 0); g.add(pw);
    [[-.22,.24],[-.08,.36],[.08,.36],[.22,.24]].forEach(([px,pz])=>{
      const toe = sphere(.1,0xf7c08a,10); toe.scale.set(1,.6,1); toe.position.set(px, base+.3, pz); g.add(toe);
    });
  } else if(kind==='furniture'){                    /* เก้าอี้นวมยักษ์ */
    const seat = box(.56,.16,.46,0xef8354,.07); seat.position.set(0, base+.28, 0); g.add(seat);
    const back = box(.56,.34,.14,0xef8354,.06); back.position.set(0, base+.5, -.18); g.add(back);
    [-1,1].forEach(sd=>{ const arm = box(.12,.18,.44,0xf2a184,.05); arm.position.set(sd*.24, base+.42, 0); g.add(arm); });
    [-1,1].forEach(sd=>[-1,1].forEach(sz=>{ const lg = cyl(.045,.045,.2,0x8f6231,6);
      lg.position.set(sd*.22, base+.1, sz*.18); g.add(lg); }));
  } else if(kind==='food'){                         /* ชามก๋วยเตี๋ยวยักษ์ + ตะเกียบ */
    const bowl = cyl(.34,.2,.3,0xfffaf0,14); bowl.position.set(0, base+.2, 0); g.add(bowl);
    const soup = cyl(.3,.3,.05,0xe8b46a,14); soup.position.set(0, base+.34, 0); g.add(soup);
    const rim = torus(.33,.035,0xe4574a,14); rim.rotation.x = Math.PI/2; rim.position.set(0, base+.35, 0); g.add(rim);
    [-1,1].forEach(sd=>{ const ck = cyl(.025,.025,.62,0xd9a86c,6); ck.rotation.z = .3 + sd*.08;
      ck.rotation.x = -.25; ck.position.set(.1 + sd*.05, base+.6, -.06); g.add(ck); });
  } else if(kind==='book'){                         /* หนังสือเปิดกางเล่มโต */
    [-1,1].forEach(s=>{
      const pg = box(.46,.08,.52,0xfffaf0,.02); pg.rotation.z = -s*.3;
      pg.position.set(s*.22, base+.3, 0); g.add(pg);
      const cv = box(.48,.07,.56,0x5aa9e6,.02); cv.rotation.z = -s*.3;
      cv.position.set(s*.23, base+.22, 0); g.add(cv);
    });
  } else if(kind==='fruit'){                        /* แอปเปิ้ลลูกโต */
    const ap = sphere(.32,0xe4574a,14); ap.scale.y = .92; ap.position.set(0, base+.3, 0); g.add(ap);
    const st = cyl(.035,.035,.22,0x8f6231,6); st.position.set(0, base+.66, 0); g.add(st);
    const lf = sphere(.13,0x6fbf73,8); lf.scale.set(1.5,.4,.9); lf.position.set(.15, base+.7, 0); g.add(lf);
  } else if(kind==='veg'){                          /* แครอทหัวโต */
    const cr = cone(.2,.66,0xff9f43,12); cr.rotation.x = Math.PI; cr.position.set(0, base+.33, 0); g.add(cr);
    [[-.12,.1],[0,.16],[.12,.08]].forEach(o=>{
      const lf = cone(.09,.3,0x6fbf73,8); lf.position.set(o[0], base+.72+o[1], 0); g.add(lf);
    });
  } else if(kind==='milk'){                         /* ขวดนมใบโต */
    const bt = cyl(.2,.22,.5,0xfbf7f0,14); bt.position.set(0, base+.26, 0); g.add(bt);
    const nk = cyl(.1,.16,.16,0xfbf7f0,10); nk.position.set(0, base+.58, 0); g.add(nk);
    const cp = cyl(.12,.12,.1,0x7fc4e8,10); cp.position.set(0, base+.7, 0); g.add(cp);
    const bn = box(.34,.16,.34,0x7fc4e8,.03); bn.position.set(0, base+.26, 0); g.add(bn);
  } else if(kind==='flower'){                       /* ดอกไม้ดอกโต */
    const ct = sphere(.14,0xffd54f,10); ct.position.set(0, base+.34, 0); g.add(ct);
    for(let i=0;i<6;i++){
      const a = i/6*Math.PI*2;
      const pt = sphere(.14,0xff8fb3,10); pt.scale.set(1,.55,1);
      pt.position.set(Math.cos(a)*.24, base+.34, Math.sin(a)*.24); g.add(pt);
    }
    const st = cyl(.04,.04,.3,0x6fbf73,6); st.position.set(0, base+.12, 0); g.add(st);
  }
}
/* ของหน้าร้านตามประเภทร้าน — เรียกหลังตัวอาคารเสร็จ (พิกัดอ้างกลางอาคาร ประตูอยู่ +z) */
function addShopFront(g, kind, bw, bd, bh, roofHex){
  const front = bd/2 + .3;
  /* (ร้านสะดวกซื้อ shopKind 'mart' ไม่ผ่านทางนี้ — มี buildMinimart สร้างหน้าร้านของตัวเองครบทั้งหลัง) */
  if(kind==='toy'){                                /* ธงราวเล็ก + ลูกบอล + ตัวต่อ */
    [-1,1].forEach(s=>{ const p = cyl(.04,.04,1.5,0xf7f3ee,6); p.position.set(s*(bw/2-.1),.75,front); g.add(p); });
    for(let i=0;i<5;i++){
      const fl = cone(.12,.22,[0xff8fb3,0xffd54f,0x7fc4e8,0xb388ff,0xff8a65][i],4);
      fl.rotation.x = Math.PI; fl.position.set(-bw/2+.4+i*(bw-.8)/4, 1.34, front); g.add(fl);
    }
    const ball = sphere(.2,0xff8a65,12); ball.position.set(bw*.3,.2,front+.1); g.add(ball);
    [[0,.16],[.02,.44]].forEach((p,i)=>{ const bk = box(.28,.28,.28,[0x7fc4e8,0xffd54f][i],.04); bk.position.set(-bw*.34+p[0],p[1],front+.05); g.add(bk); });
  }else if(kind==='pet'){                           /* บ้านหมาหน้าร้าน + ลูกสัตว์ + ชามอาหาร */
    const hs = box(.62,.5,.56,0xf7c08a,.06); hs.position.set(bw*.28,.25,front); g.add(hs);
    const rf1 = box(.5,.09,.62,0xe07a4a,.03); rf1.rotation.z = .62; rf1.position.set(bw*.28-.16,.62,front); g.add(rf1);
    const rf2 = box(.5,.09,.62,0xe07a4a,.03); rf2.rotation.z = -.62; rf2.position.set(bw*.28+.16,.62,front); g.add(rf2);
    const hole = cyl(.15,.15,.1,0x8d6e63,12); hole.rotation.x = Math.PI/2; hole.position.set(bw*.28,.24,front+.3); g.add(hole);
    const pup = sphere(.16,0xf7e3c8,12); pup.scale.set(1.15,.9,1.3);           /* ลูกหมานั่งอยู่ข้างบ้าน */
    pup.position.set(bw*.28-.62,.16,front+.12); g.add(pup);
    const ph = sphere(.13,0xfff0dc,12); ph.position.set(bw*.28-.62,.34,front+.22); g.add(ph);
    [-1,1].forEach(sd=>{ const ear = sphere(.06,0xe8c9a0,8); ear.scale.set(.8,1.3,.6);
      ear.position.set(bw*.28-.62+sd*.11,.42,front+.2); g.add(ear); });
    [-1,1].forEach(sd=>{ const ey = sphere(.022,0x4a3b32,6); ey.position.set(bw*.28-.62+sd*.05,.36,front+.34); g.add(ey); });
    const nose = sphere(.03,0xb4766a,6); nose.position.set(bw*.28-.62,.31,front+.35); g.add(nose);
    const bowl = cyl(.14,.11,.09,0x7fc4e8,12); bowl.position.set(-bw*.3,.05,front+.1); g.add(bowl);
    const food = cyl(.11,.11,.04,0xd9a86c,12); food.position.set(-bw*.3,.1,front+.1); g.add(food);
  }else if(kind==='furniture'){                     /* โซฟาโชว์หน้าร้าน + โคมไฟตั้งพื้น + เก้าอี้ซ้อน */
    const sofa = box(1.0,.22,.5,0xef8354,.08); sofa.position.set(-bw*.2,.3,front+.05); g.add(sofa);
    const sback = box(1.0,.4,.16,0xef8354,.06); sback.position.set(-bw*.2,.55,front-.15); g.add(sback);
    [-1,1].forEach(sd=>{ const arm = box(.16,.26,.5,0xf2a184,.05); arm.position.set(-bw*.2+sd*.42,.5,front+.05); g.add(arm); });
    [-1,1].forEach(sd=>[-1,1].forEach(sz=>{ const lg = cyl(.05,.05,.2,0x8f6231,6);
      lg.position.set(-bw*.2+sd*.4,.1,front+.05+sz*.18); g.add(lg); }));
    const lampP = cyl(.045,.06,1.0,0xb4763a,8); lampP.position.set(bw*.3,.5,front); g.add(lampP);
    const shade = cone(.26,.3,0xfff3c4,12); shade.position.set(bw*.3,1.12,front); g.add(shade);
    [0,1].forEach(i=>{                                /* เก้าอี้ไม้ซ้อนกัน 2 ตัว */
      const seat = box(.36,.07,.36,0xd9a86c,.03); seat.position.set(bw*.03,.34+i*.2,front+.24); g.add(seat);
      const bk = box(.36,.28,.06,0xc98d4e,.03); bk.position.set(bw*.03,.5+i*.2,front+.08); g.add(bk);
    });
  }else if(kind==='food'){                          /* โต๊ะกินข้าวหน้าร้าน + ร่ม + ชามร้อนๆ + โคมไฟ */
    const tTop = cyl(.36,.36,.07,0xfffaf0,14); tTop.position.set(-bw*.18,.56,front+.16); g.add(tTop);
    const tLeg = cyl(.06,.09,.56,0xc98d4e,8); tLeg.position.set(-bw*.18,.28,front+.16); g.add(tLeg);
    const tBase = cyl(.2,.22,.05,0xb4763a,12); tBase.position.set(-bw*.18,.03,front+.16); g.add(tBase);
    [-1,1].forEach(sd=>{                              /* ม้านั่งกลม 2 ตัว */
      const st3 = cyl(.14,.14,.06,0xef8354,12); st3.position.set(-bw*.18+sd*.56,.34,front+.16); g.add(st3);
      const sl = cyl(.05,.06,.34,0xc98d4e,8); sl.position.set(-bw*.18+sd*.56,.17,front+.16); g.add(sl);
    });
    const bowl2 = cyl(.13,.09,.11,0xfffaf0,12); bowl2.position.set(-bw*.18,.65,front+.16); g.add(bowl2);
    const soup2 = cyl(.11,.11,.03,0xe8b46a,12); soup2.position.set(-bw*.18,.71,front+.16); g.add(soup2);
    [[0,.82,.055],[.05,.92,.045],[-.04,1.0,.035]].forEach(([ox,y,r])=>{      /* ไอร้อนลอยขึ้น */
      const sm = sphere(r,0xf4f1ea,8); sm.position.set(-bw*.18+ox,y,front+.16); g.add(sm);
    });
    const uPole = cyl(.035,.035,1.5,0xb4763a,8); uPole.position.set(-bw*.18,.75,front+.16); g.add(uPole);
    const uTop = cone(.62,.34,0xe4574a,14); uTop.position.set(-bw*.18,1.6,front+.16); g.add(uTop);
    const uTop2 = cone(.66,.14,0xfffaf0,14); uTop2.position.set(-bw*.18,1.48,front+.16); g.add(uTop2);
    const lan = cyl(.13,.13,.24,0xef8354,12); lan.position.set(bw*.34,1.06,front); g.add(lan);
    const lanT = cyl(.05,.05,.16,0x8f6231,8); lanT.position.set(bw*.34,1.24,front); g.add(lanT);
  }else if(kind==='book'){                          /* แท่นหนังสือเปิดกางหน้าร้าน */
    const st = box(.7,.5,.44,0xa9784f,.04); st.position.set(-bw*.26,.25,front); g.add(st);
    [-1,1].forEach(s=>{ const pg = box(.34,.06,.4,0xfffaf0,.02); pg.rotation.z = -s*.22; pg.position.set(-bw*.26+s*.17,.56,front); g.add(pg); });
    [0,1,2].forEach(i=>{ const bk = box(.42,.1,.32,[0x5aa9e6,0xef8354,0x6fbf73][i],.02); bk.position.set(bw*.3,.06+i*.11,front); g.add(bk); });
  }else if(kind==='fruit' || kind==='veg'){         /* ลังผลไม้/ผักหน้าร้าน */
    const isVeg = kind==='veg';
    [-1,1].forEach(s=>{
      const cr = box(.72,.36,.5,0xc98d4e,.04); cr.position.set(s*bw*.28,.18,front); g.add(cr);
      const rim = box(.78,.08,.56,0xb4763a,.03); rim.position.set(s*bw*.28,.38,front); g.add(rim);
      [-.2,.06,.22].forEach((o,i)=>{
        if(isVeg){ const cc = cone(.1,.34,0xff9f43,8); cc.rotation.x = Math.PI; cc.position.set(s*bw*.28+o,.5,front+(i-1)*.12); g.add(cc);
                   const lf = sphere(.09,0x6fbf73,8); lf.position.set(s*bw*.28+o,.66,front+(i-1)*.12); g.add(lf); }
        else { const ap = sphere(.13,[0xe4574a,0xffd54f,0xef8354][i],10); ap.position.set(s*bw*.28+o,.5,front+(i-1)*.12); g.add(ap); }
      });
    });
  }else if(kind==='ice'){                           /* ไอศกรีมโคนยักษ์บนหลังคา */
    const cn = cone(.34,.8,0xe0a860,12); cn.rotation.x = Math.PI; cn.position.set(0,bh+1.0,0); g.add(cn);
    [[0,1.5,0xffb3c6],[.16,1.72,0xfff3b0],[-.14,1.88,0xa8e6cf]].forEach(p=>{
      const sc = sphere(.24,p[2],12); sc.position.set(p[0],bh+p[1]-.1,0); g.add(sc);
    });
  }else if(kind==='flower'){                        /* กระถางดอกไม้ 2 ข้างประตู */
    [-1,1].forEach(s=>{
      const pot = cyl(.2,.16,.28,0xd9784f,10); pot.position.set(s*.62,.14,front); g.add(pot);
      const bush = sphere(.22,0x6fbf73,10); bush.position.set(s*.62,.36,front); g.add(bush);
      [[-.12,.5],[.12,.52],[0,.6]].forEach((o,i)=>{
        const fl = sphere(.08,[0xff8fb3,0xffd54f,0xb388ff][i],8); fl.position.set(s*.62+o[0],o[1],front); g.add(fl);
      });
    });
  }else if(kind==='milk'){                          /* ถังนม 2 ใบ + ถังไม้กวนนม */
    [-1,1].forEach(s=>{
      const can = cyl(.17,.22,.5,0xc9d6de,12); can.position.set(s*bw*.3,.25,front); g.add(can);
      const nk = cyl(.1,.12,.16,0xb4c3cc,10); nk.position.set(s*bw*.3,.56,front); g.add(nk);
      const lid = cyl(.13,.13,.06,0x8fa3ad,10); lid.position.set(s*bw*.3,.66,front); g.add(lid);
    });
    const churn = cyl(.19,.22,.44,0xc98d4e,12); churn.position.set(0,.22,front+.34); g.add(churn);
    const hoop = torus(.2,.025,0x8f6231,12); hoop.rotation.x = Math.PI/2; hoop.position.set(0,.34,front+.34); g.add(hoop);
  }
  addShopEmblem(g, kind, bh);                       /* สัญลักษณ์ยักษ์บนหลังคา — มองไกลๆ ก็รู้ว่าร้านขายอะไร */
  if(kind!=='toy'){                                 /* ร้านของเล่นมีธงราวอยู่แล้ว ไม่ต้องมีกันสาด */
    const n = 6, sw = bw*.86/n;                     /* กันสาดลายทางเหนือประตู */
    for(let i=0;i<n;i++){
      const st = box(sw, .07, .62, i%2 ? 0xffffff : roofHex, .02);
      st.position.set(-bw*.43 + sw*(i+.5), 1.3, bd/2+.28); st.rotation.x = -.34; g.add(st);
    }
  }
}

/* ป้ายเมนูทรงสามเหลี่ยมตั้งพื้น (sandwich board) — กางเป็นตัว A มีกระดานเขียนเมนูทั้ง 2 ด้าน */
function buildSandwichSign(){
  const g = new THREE.Group();
  /* หมุน -sd*.26 = "ยอดชนกัน ฐานถ่างออก" (ทรงตัว A) — ถ้าเป็น +sd จะกลายเป็นตัว V กลับหัว
     สร้างแต่ละด้านเป็นกลุ่มย่อยแล้วเอียงทั้งกลุ่ม กระดาน/กรอบ/บรรทัดเมนูจึงเอียงตามกันเสมอ */
  [-1,1].forEach(sd=>{
    const side = new THREE.Group();
    side.position.set(0, .55, sd*.16);
    side.rotation.x = -sd*.26;
    const board = box(.9, 1.0, .07, 0xfdf6e6, .04); side.add(board);
    const frame = box(.98, 1.08, .04, 0xb4763a, .04); frame.position.z = sd*.03; side.add(frame);
    [.24, .04, -.16].forEach((y,i)=>{               /* บรรทัดเมนู (บรรทัดแรกสีแดง = หัวข้อ) */
      const ln = box(.52 - i*.08, .07, .03, i ? 0xd9c7a5 : 0xe4574a, .02);
      ln.position.set(0, y, sd*.06); side.add(ln);
    });
    g.add(side);
  });
  const hinge = cyl(.05,.05,.86, 0x8f6231, 8); hinge.rotation.z = Math.PI/2; hinge.position.y = 1.05; g.add(hinge);
  [-1,1].forEach(sd=>{                              /* ขาป้าย 2 ข้าง */
    const ft = box(.14,.08,.66, 0x8f6231, .03); ft.position.set(sd*.4, .04, 0); g.add(ft);
  });
  const bowl = cyl(.11,.08,.09,0xfffaf0,10); bowl.position.set(0, 1.16, 0); g.add(bowl);   /* ชามเล็กบนยอดป้าย */
  const soup = cyl(.09,.09,.03,0xe8b46a,10); soup.position.set(0, 1.21, 0); g.add(soup);
  return g;
}

/* ---------- ร้านอาหารหลังใหญ่กลางเมือง ----------
   ตัวอาคารกว้างเต็มล็อต + ลานโต๊ะกินข้าวยื่นออกไปทางหน้าร้าน (นอก lot จึงเดินเข้าไปนั่งได้จริง)
   โต๊ะแต่ละตัวลงทะเบียนเป็น "ที่นั่ง" ด้วย addSeatSpot เด็กจึงแตะแล้วเดินไปนั่งได้เหมือนม้านั่ง */
function buildRestaurant(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const cx = (lot.x0+lot.x1)/2, cz = (lot.z0+lot.z1)/2;
  const bw = w-.4, bd = d-.6, bh = 2.1;
  const body = box(bw, bh, bd, lot.wall, .06); body.position.y = bh/2; g.add(body);
  const band = box(bw+.06, .16, bd+.06, lot.roof, .04); band.position.y = 1.15; g.add(band);   /* คาดกลางลายร้าน */
  addRoofGable(g, bw, bd, bh, lot.roof, lot.wall, 1.0);
  const fz = bd/2;
  addDoor(g, bd, 0x9c6238);
  [-1,1].forEach(sd=>{                                   /* หน้าต่างบานใหญ่ 2 ฝั่งประตู */
    const wf = box(1.0,.9,.08,0xfffaf0,.04); wf.position.set(sd*(bw/2-.85), 1.15, fz+.02); g.add(wf);
    const wi = box(.82,.72,.1,0xaadcf5,.03); wi.position.set(sd*(bw/2-.85), 1.15, fz+.04); g.add(wi);
    const sill = box(1.06,.1,.16,lot.roof,.03); wi.position.z += .0; sill.position.set(sd*(bw/2-.85), .66, fz+.08); g.add(sill);
  });
  /* กันสาดลายทางเต็มหน้าร้าน */
  const n = 8, sw = bw*.94/n;
  for(let i=0;i<n;i++){
    const st = box(sw, .08, .8, i%2 ? 0xfffaf0 : lot.roof, .02);
    st.position.set(-bw*.47 + sw*(i+.5), 1.62, fz+.34); st.rotation.x = -.32; g.add(st);
  }
  const sfr = box(1.5,.9,.1,0xfffaf0,.05); sfr.position.set(0, bh+.55, fz+.06); g.add(sfr);   /* ป้ายร้าน */
  const sg = signPlane(lot.icon, .7); sg.position.set(0, bh+.55, fz+.13); g.add(sg);
  addShopEmblem(g, 'food', bh);
  addChimney(g, bw, bd, bh, 1.0);
  for(let i=0;i<3;i++){                                   /* ควันจากปล่องครัว */
    const sm = sphere(.15, 0xf4f1ea, 8);
    sm.material = sm.material.clone(); sm.material.transparent = true; sm.material.opacity = .78;
    sm.position.set(bw*.28, bh + .5 + .58, -bd*.18);
    fxTag(sm, 'smoke', {ph: i/3}); g.add(sm);
  }

  /* ---- ลานโต๊ะกินข้าวหน้าร้าน (พิกัดช่องจริง → แปลงเป็นพิกัด local ของกลุ่ม) ---- */
  const dz0 = FOOD_DECK.z0, dz1 = FOOD_DECK.z1;               /* ลานยาวถึง z50 ตามผังในแผนที่ */
  const deck = box(w-.2, .06, (dz1-dz0+1) - .2, 0xe9d7b4, .05);
  deck.position.set(0, .03, ((dz0+dz1)/2) - cz); g.add(deck);
  [[lot.x0+1, dz0+1], [lot.x0+2, dz0+3], [lot.x0+1, dz0+5], [lot.x0+2, dz0+7]].forEach(([tx,tz],i)=>{
    const lx = tx - cx, lz = tz - cz;
    const top = cyl(.42,.42,.08,0xfffaf0,14); top.position.set(lx,.62,lz); g.add(top);
    const leg = cyl(.07,.1,.6,0xc98d4e,8);   leg.position.set(lx,.31,lz); g.add(leg);
    const base = cyl(.24,.26,.06,0xb4763a,12); base.position.set(lx,.06,lz); g.add(base);
    const pole = cyl(.04,.04,1.7,0xb4763a,8); pole.position.set(lx,.85,lz); g.add(pole);
    const cap = cone(.85,.4,[0xe4574a,0xffc857,0x7fc4e8][i%3],14); cap.position.set(lx,1.85,lz); g.add(cap);
    const cap2 = cone(.9,.16,0xfffaf0,14); cap2.position.set(lx,1.7,lz); g.add(cap2);
    const bowl = cyl(.12,.09,.1,0xfffaf0,12); bowl.position.set(lx,.71,lz); g.add(bowl);
    const soup = cyl(.1,.1,.03,0xe8b46a,12); soup.position.set(lx,.77,lz); g.add(soup);
    [-1,1].forEach(sd=>{                                  /* ม้านั่ง 2 ตัว/โต๊ะ + ลงทะเบียนเป็นที่นั่ง */
      const sx = lx + sd*.95;
      const seat = cyl(.17,.17,.08,0xef8354,12); seat.position.set(sx,.42,lz); g.add(seat);
      const sl = cyl(.06,.07,.38,0xc98d4e,8);   sl.position.set(sx,.21,lz); g.add(sl);
      addSeatSpot(Math.round(tx + sd), tz, sd>0 ? 3 : 1, 'bench');
    });
  });
  g.position.set(outWX(cx), 0, outWZ(cz));
  return g;
}

/* ---------- ร้านสัตว์เลี้ยง + อาบน้ำตัดขน (หลังใหญ่สุดในแถวร้านค้า) ----------
   ล็อต 7×4 (กินที่ร้านเกมเดิม) แบ่งหน้าร้านเป็น 2 โซนให้เด็กดูออกทันทีว่าร้านนี้ทำอะไร:
     ฝั่งซ้าย  = ตู้โชว์กระจกบานใหญ่ 2 บาน มีลูกหมา/ลูกแมวนั่งอยู่ข้างใน
     ฝั่งขวา  = มุมอาบน้ำตัดขน (อ่างอาบน้ำมีฟองสบู่ + ฝักบัว + โต๊ะตัดขน + ป้ายกรรไกร-หวี)
   คอกสัตว์ย้ายไปอยู่ข้างร้านแล้ว (pen-petshop) ตัวร้านจึงไม่มีโรงเรือนหลังร้านอีกต่อไป */
function buildPetShop(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const cx = (lot.x0+lot.x1)/2, cz = (lot.z0+lot.z1)/2;
  const bw = w-.8, bd = d-1.4, bh = 2.4;                 /* ตัวอาคารกินล็อตเฉพาะครึ่งหลัง ครึ่งหน้าเป็นลานหน้าร้าน */
  /* ตัวอาคาร (พร้อมหลังคา/ประตู/หน้าร้าน) อยู่ในกลุ่มย่อยที่ถอยไปทางหลังล็อต .5 ช่อง
     → เลื่อนทั้งอาคารทีเดียว ไม่ต้องไล่บวก z ให้ของทีละชิ้น */
  const b = new THREE.Group(); b.position.z = -.5; g.add(b);
  const body = box(bw, bh, bd, lot.wall, .06); body.position.y = bh/2; b.add(body);
  const band = box(bw+.06, .18, bd+.06, lot.roof, .04); band.position.y = 1.25; b.add(band);
  addRoofGable(b, bw, bd, bh, lot.roof, lot.wall, 1.0);   /* rise 1.0 เท่านั้น — addShopEmblem วางของบนสันหลังคาที่ bh+.95 */
  const fz = bd/2;
  addDoor(b, bd, 0x9c6238);
  /* ---- ตู้โชว์กระจก 2 บานฝั่งซ้ายของประตู (ลูกหมา 1 + ลูกแมว 1) ---- */
  [[-bw*.34, 'pup'], [-bw*.14, 'kit']].forEach(([px, kind])=>{
    const show = box(1.06,1.2,.12,0xfffaf0,.05); show.position.set(px, 1.1, fz+.02); b.add(show);
    const glass = box(.88,1.0,.1,0xaadcf5,.04); glass.position.set(px, 1.1, fz+.06); b.add(glass);
    const sill = box(1.12,.1,.2,lot.roof,.03); sill.position.set(px, .48, fz+.08); b.add(sill);
    const fur = kind==='pup' ? 0xffd8a8 : 0xf7e3c8;
    const bd2 = sphere(.15,fur,12); bd2.scale.set(1.2,.9,1); bd2.position.set(px, .78, fz+.1); b.add(bd2);
    const hd = sphere(.13,petShade(fur,1.06),12); hd.position.set(px, 1.0, fz+.12); b.add(hd);
    [-1,1].forEach(sd=>{
      const ear = kind==='pup' ? sphere(.055,petShade(fur,.86),8) : cone(.06,.11,petShade(fur,.9),4);
      if(kind==='pup') ear.scale.set(.8,1.35,.6);
      ear.position.set(px+sd*.09, kind==='pup' ? 1.1 : 1.14, fz+.12); b.add(ear);
    });
    [-1,1].forEach(sd=>{ const ey = sphere(.02,0x4a3b32,6); ey.position.set(px+sd*.05, 1.02, fz+.2); b.add(ey); });
    const nose = sphere(.026,0xb4766a,6); nose.position.set(px, .97, fz+.21); b.add(nose);
  });
  /* ---- มุมอาบน้ำตัดขนฝั่งขวาของประตู: หน้าต่างบานใหญ่ + อ่างอาบน้ำมีฟอง + ฝักบัว ---- */
  const wf = box(1.2,1.0,.08,0xfffaf0,.04); wf.position.set(bw*.28, 1.15, fz+.02); b.add(wf);
  const wi = box(1.0,.82,.1,0xbfe8f7,.03); wi.position.set(bw*.28, 1.15, fz+.05); b.add(wi);
  const wsill = box(1.26,.1,.2,lot.roof,.03); wsill.position.set(bw*.28, .58, fz+.08); b.add(wsill);
  const tubX = bw*.28, tubZ = fz + .78;
  const tub = box(.86,.42,.6,0xfdfbf5,.12); tub.position.set(tubX,.28,tubZ); b.add(tub);   /* อ่างอาบน้ำขอบมน */
  const water = box(.72,.08,.46,0x9ad9f0,.04); water.position.set(tubX,.47,tubZ); b.add(water);
  [[-.2,.56,.09],[.02,.62,.12],[.22,.55,.08],[-.05,.74,.07]].forEach(([ox,y,r])=>{        /* ฟองสบู่ลอย */
    const bb = sphere(r,0xffffff,8); bb.position.set(tubX+ox, y, tubZ); b.add(bb);
  });
  const pup2 = sphere(.15,0xf7f0e4,12); pup2.position.set(tubX,.6,tubZ);  b.add(pup2);      /* น้องหมากำลังอาบน้ำ */
  [-1,1].forEach(sd=>{ const ey = sphere(.018,0x4a3b32,6); ey.position.set(tubX+sd*.05,.63,tubZ+.13); b.add(ey); });
  const spipe = cyl(.045,.045,.9,0xd8dee3,8); spipe.position.set(tubX+.62,.45,tubZ-.1); b.add(spipe);
  const sarm  = box(.42,.07,.07,0xd8dee3,.03); sarm.position.set(tubX+.42,.88,tubZ-.1); b.add(sarm);
  const shead = cone(.13,.16,0xbfc7cc,10); shead.rotation.x = Math.PI; shead.position.set(tubX+.24,.8,tubZ-.1); b.add(shead);
  const gx = .9;                                            /* โต๊ะตัดขน — อยู่โซนอาบน้ำฝั่งขวา ไม่ชนบ้านหมาฝั่งซ้าย */
  const gtable = box(.7,.09,.5,0xf7c08a,.04); gtable.position.set(gx,.66,fz+.95); b.add(gtable);
  [-1,1].forEach(sd=>[-1,1].forEach(sz=>{
    const lg = cyl(.045,.045,.62,0xd8dee3,8); lg.position.set(gx+sd*.26,.33,fz+.95+sz*.16); b.add(lg);
  }));
  const comb = box(.24,.05,.14,0xef8fa5,.02); comb.position.set(gx-.16,.73,fz+.95); b.add(comb);
  [-1,1].forEach(sd=>{                                      /* กรรไกรตัดขนวางบนโต๊ะ (ใบมีดไขว้กัน) */
    const bl = box(.26,.03,.05,0xd8dee3,.02); bl.rotation.y = sd*.22;
    bl.position.set(gx+.14,.73,fz+.95); b.add(bl);
    const rg = torus(.05,.018,0xef8fa5,10); rg.rotation.x = Math.PI/2;
    rg.position.set(gx+.28,.73,fz+.95+sd*.05); b.add(rg);
  });
  /* ---- กันสาดลายทางเต็มหน้าร้าน + ป้ายร้าน + ป้ายแขวน "อาบน้ำตัดขน" (รูปฟองสบู่) ---- */
  const n = 9, sw = bw*.96/n;
  for(let i=0;i<n;i++){
    const st = box(sw, .08, .8, i%2 ? 0xfffaf0 : lot.roof, .02);
    st.position.set(-bw*.48 + sw*(i+.5), 1.86, fz+.34); st.rotation.x = -.32; b.add(st);
  }
  /* ป้ายร้านห้อยใต้กันสาดเหนือประตู (ไม่วางบนหน้าจั่ว — มุมกล้องไอโซจะโดนชายคาบังจนมองไม่เห็น) */
  [-1,1].forEach(sd=>{ const hg = cyl(.03,.03,.34,0xb4763a,6); hg.position.set(sd*.5, 1.68, fz+.52); b.add(hg); });
  const sfr = box(1.36,.76,.1,0xfffaf0,.05); sfr.position.set(0, 1.18, fz+.52); b.add(sfr);
  const sg = signPlane(lot.icon, .62); sg.position.set(0, 1.18, fz+.59); b.add(sg);
  const hbar = box(.06,.06,.44,0xb4763a,.02); hbar.position.set(bw*.46, 1.76, fz+.2); b.add(hbar);
  const hsign = box(.5,.4,.06,0xfdfbf5,.06); hsign.position.set(bw*.46, 1.5, fz+.38); b.add(hsign);
  [[-.1,-.04,.07],[.06,.04,.09],[.13,-.08,.05]].forEach(([ox,oy,r])=>{      /* ฟองสบู่บนป้าย = สัญลักษณ์อาบน้ำ */
    const bb = sphere(r,0x9ad9f0,8); bb.position.set(bw*.46+ox, 1.5+oy, fz+.42); b.add(bb);
  });
  addShopEmblem(b, 'pet', bh);
  /* ---- ของบนลานหน้าร้าน: บ้านหมา + ชามอาหาร + กระถางดอกไม้ 2 ใบขนาบทางเข้า ---- */
  const front = fz + .95, hx = -bw*.36;      /* บ้านหมา/ชามอาหารอยู่ฝั่งซ้าย คนละฝั่งกับโซนอาบน้ำตัดขน */
  const hs = box(.66,.52,.58,0xf7c08a,.06); hs.position.set(hx,.26,front); b.add(hs);
  const rf1 = box(.52,.09,.64,0xe07a4a,.03); rf1.rotation.z = .62; rf1.position.set(hx-.16,.64,front); b.add(rf1);
  const rf2 = box(.52,.09,.64,0xe07a4a,.03); rf2.rotation.z = -.62; rf2.position.set(hx+.16,.64,front); b.add(rf2);
  const hole = cyl(.15,.15,.12,0x8d6e63,12); hole.rotation.x = Math.PI/2; hole.position.set(hx,.25,front+.3); b.add(hole);
  const bowl = cyl(.15,.12,.1,0x7fc4e8,12); bowl.position.set(hx+.66,.05,front); b.add(bowl);
  const food = cyl(.12,.12,.04,0xd9a86c,12); food.position.set(hx+.66,.11,front); b.add(food);
  [-1,1].forEach(sd=>{
    const pot = cyl(.19,.15,.26,0xef8fa5,12); pot.position.set(sd*.7,.13,fz+.5); b.add(pot);
    const bush = sphere(.2,0x8fd694,10); bush.scale.y = .8; bush.position.set(sd*.7,.36,fz+.5); b.add(bush);
    [[-.1,.1],[.1,-.06],[0,.14]].forEach(([ox,oz])=>{
      const fl = sphere(.055,[0xffd54f,0xff8fb3,0xfffaf0][(ox+oz)>0?0:1],8);
      fl.position.set(sd*.7+ox,.48,fz+.5+oz); b.add(fl);
    });
  });
  g.position.set(outWX(cx), 0, outWZ(cz));
  return g;
}

/* ---------- ร้านต้นไม้/สวน — ล็อต shop-garden (เพิ่ม 2026-08-08) ----------
   ตั้งบนลานโล่งกลางป่าที่กระท่อมช่างไม้ขยับออกไป จึงทำเป็น **เรือนเพาะชำ** ไม่ใช่ตึกร้าน:
     - ฐานไม้เตี้ย + เสาโครงเขียว + ผนังกระจกใส (เห็นทะลุเป็นเรือนกระจก ไม่ใช่บ้านทึบ)
     - หลังคาจั่วโปร่ง + แถบกระจกพาดตามผืนลาด 2 ฝั่ง
     - หน้าร้าน: ชั้นวางกระถางดอกไม้ 2 ชั้น · ซุ้มไม้เลื้อยคร่อมทางเข้า · ถังรดน้ำ · ถุงดิน · พลั่ว
   สันหลังคาเป็นดอกไม้ยักษ์จาก addShopEmblem('flower') */
function buildGardenShop(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const cx = (lot.x0+lot.x1)/2, cz = (lot.z0+lot.z1)/2;
  const bw = w-.7, bd = d-1.15, bh = 1.85;
  const b = new THREE.Group(); b.position.z = -.45; g.add(b);   /* ถอยตัวเรือนไปหลังล็อต เหลือลานหน้าร้าน */
  const GLASS = 0xd7eef0, FRAME = 0x5aa85c;
  const body = box(bw, bh, bd, GLASS, .04); body.position.y = bh/2; b.add(body);
  const base = box(bw+.1, .46, bd+.1, 0xb98a5a, .05); base.position.y = .23; b.add(base);   /* ฐานไม้กันดิน */
  /* เสาโครงเรือนกระจก — แนวตั้ง 4 ต้นที่มุม + คานคาดกลางผนัง ให้อ่านออกว่าเป็นโครงไม่ใช่กล่องใส */
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>{
    const ps = box(.11, bh, .11, FRAME, .02); ps.position.set(sx*bw/2, bh/2, sz*bd/2); b.add(ps);
  }));
  [1.02, bh-.06].forEach(y=>{
    const rail = box(bw+.06, .09, bd+.06, FRAME, .03); rail.position.y = y; b.add(rail);
  });
  addRoofGable(b, bw, bd, bh, FRAME, GLASS, 1.0);
  /* แถบกระจกพาดผืนหลังคา 2 ฝั่ง — ทำให้หลังคาอ่านเป็น "หลังคากระจก" ไม่ใช่กระเบื้องทึบ */
  [-1,1].forEach(sd=>{
    for(let i=0;i<3;i++){
      const pane = box(.5,.05,bd*.92, GLASS,.02);
      pane.rotation.z = sd*.72;
      pane.position.set(sd*(bw*.13 + i*bw*.15), bh + .78 - i*.26, 0); b.add(pane);
    }
  });
  const fz = bd/2;
  addDoor(b, bd, 0x8f6231);
  /* ---- ซุ้มไม้เลื้อย ----
     ⚠ **ย้ายจากหน้าร้าน (คร่อมทางเข้า) มาไว้ "ด้านข้าง" เมื่อ 2026-08-09 ตามคำขอผู้ใช้**
     เลือกข้าง +x เพราะกล้องไอโซมองจาก (+x,+z) ⇒ เป็นด้านข้างที่เด็กมองเห็น (ข้าง -x จะไปซ่อนหลังตัวเรือน)
     หันซุ้มกลับ 90° (คร่อมตามแกน z) แล้ววางที่ ax=1.98 ซึ่งยัง **อยู่ในกรอบล็อต** (ครึ่งล็อต = 2.0)
     จึงไม่ยื่นไปตั้งคร่อมช่องเดินได้ x26 · ตอนนี้หน้าร้านโล่ง เห็นประตูกับป้ายร้านเต็มๆ */
  const ax = 1.98, az = fz*.35;
  [-1,1].forEach(sd=>{
    const post = cyl(.07,.07,1.5,0xb98a5a,8); post.position.set(ax,.75,az+sd*.72); b.add(post);
  });
  const arch = torus(.72,.07,0xb98a5a,16); arch.rotation.y = Math.PI/2; arch.position.set(ax,1.5,az); b.add(arch);
  for(let i=0;i<7;i++){                                        /* ดอกไม้เลื้อยเกาะซุ้ม */
    const a = Math.PI*(i/6);
    const fl = sphere(.085,[0xff8fb3,0xffd54f,0xfffaf0,0xb388ff][i%4],8);
    fl.position.set(ax, 1.5+Math.sin(a)*.72, az+Math.cos(a)*.72); b.add(fl);
    const lf = sphere(.06,0x8fd694,7); lf.scale.set(1,.6,1.4);
    lf.position.set(ax-.02, 1.5+Math.sin(a+.22)*.72, az+Math.cos(a+.22)*.72); b.add(lf);
  }
  /* ---- ชั้นวางกระถาง 2 ชั้น ขนาบทางเข้าซ้าย-ขวา ---- */
  [-1,1].forEach(sd=>{
    const rx = sd*(bw*.36);
    const leg = box(1.24,.09,.46,0xb98a5a,.03);
    [.34,.72].forEach((y,li)=>{
      const shelf = leg.clone(); shelf.position.set(rx, y, fz+.42); b.add(shelf);
      for(let i=0;i<3;i++){
        const px = rx - .42 + i*.42, py = y + .17;
        const pot = cyl(.13,.1,.19,[0xef8354,0xe0715c,0xd98b5a][i],10); pot.position.set(px, py, fz+.42); b.add(pot);
        const bush = sphere(.14,0x8fd694,9); bush.scale.y = .82; bush.position.set(px, py+.2, fz+.42); b.add(bush);
        const fl = sphere(.07,[0xff8fb3,0xffd54f,0xb388ff,0xfffaf0][(i+li+(sd>0?1:0))%4],8);
        fl.position.set(px, py+.32, fz+.42); b.add(fl);
      }
    });
    [-1,1].forEach(s2=>{ const lg = cyl(.045,.045,.72,0xb98a5a,6); lg.position.set(rx+s2*.55,.36,fz+.42); b.add(lg); });
  });
  /* ---- ของช่างสวนบนลานหน้าร้าน: ถังรดน้ำ · ถุงดิน · พลั่ว · กระถางต้นไม้ใหญ่ ---- */
  const fx = fz + 1.62;                                        /* ของช่างสวนวางออกมาบนลานหน้าร้าน (เดิมอ้างอิงว่า "เลยซุ้ม" — ซุ้มย้ายไปข้างร้านแล้ว) */
  const can = cyl(.19,.16,.28,0x6fbf73,12); can.position.set(-bw*.42,.14,fx); b.add(can);
  const spout = cyl(.045,.045,.42,0x6fbf73,8); spout.rotation.z = -.9; spout.position.set(-bw*.42-.24,.26,fx); b.add(spout);
  const canH = torus(.09,.022,0x4f9c58,10); canH.position.set(-bw*.42,.32,fx); b.add(canH);
  const sack = box(.34,.3,.28,0x8d6e63,.08); sack.position.set(-bw*.42+.6,.15,fx); b.add(sack);
  const soil = sphere(.14,0x5d4b41,9); soil.scale.y = .5; soil.position.set(-bw*.42+.6,.31,fx); b.add(soil);
  const hnd = cyl(.035,.035,.92,0xc98d4e,6); hnd.rotation.z = .3; hnd.position.set(bw*.3,.46,fx); b.add(hnd);
  const blade = box(.17,.22,.05,0x9fb0b8,.03); blade.rotation.z = .3; blade.position.set(bw*.3-.14,.06,fx); b.add(blade);
  [-1,1].forEach(sd=>{                                          /* กระถางต้นไม้ใหญ่ 2 ใบขนาบทางเข้า */
    const pot = cyl(.24,.19,.34,0xd98b5a,12); pot.position.set(sd*1.24,.17,fz+.6); b.add(pot);
    const tr = cyl(.06,.07,.5,0x8d6e63,8); tr.position.set(sd*1.24,.58,fz+.6); b.add(tr);
    [[0,.92,.3],[-.2,.8,.22],[.2,.82,.22]].forEach(([ox,oy,r])=>{
      const lf = sphere(r,0x6fbf73,10); lf.scale.y = .82; lf.position.set(sd*1.24+ox,oy,fz+.6); b.add(lf);
    });
  });
  /* ป้ายร้านห้อยใต้ชายคาเหนือประตู (แบบเดียวกับร้านสัตว์เลี้ยง — บนหน้าจั่วจะโดนชายคาบัง) */
  const sfr = box(1.26,.72,.1,0xfffaf0,.05); sfr.position.set(0, 1.24, fz+.06); b.add(sfr);
  const sfb = box(1.36,.14,.12,FRAME,.04);   sfb.position.set(0, 1.66, fz+.06); b.add(sfb);
  const sg = signPlane(lot.icon, .58); sg.position.set(0, 1.24, fz+.13); b.add(sg);
  addShopEmblem(b, 'flower', bh);
  g.position.set(outWX(cx), 0, outWZ(cz));
  return g;
}

/* ---------- ร้านของเล่น — ล็อต shop-toy (เพิ่ม 2026-08-08) ----------
   ตั้งริมทางเดินหน้าตลาด ทางที่เด็กผ่านบ่อยสุด จึงทำให้ "สดใสสุดในแถว":
     - ตึกหลังคาแบน + กันสาดลายทางสีรุ้งเต็มหน้าร้าน
     - กระจกโชว์บานใหญ่ 2 บาน มีของเล่นตั้งโชว์ข้างใน (ตัวต่อ · ลูกบอล · กังหันลม)
     - ลูกโป่ง 3 ลูกผูกเสาหน้าร้าน + ม้าโยกกับกล่องของเล่นบนทางเท้า
   สันหลังคาเป็นตุ๊กตาหมียักษ์จาก addShopEmblem('toy') */
function buildToyShop(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const cx = (lot.x0+lot.x1)/2, cz = (lot.z0+lot.z1)/2;
  const bw = w-.5, bd = d-2.2, bh = 2.05;         /* ตื้นกว่าล็อต 2 ช่อง → เหลือทางเท้าหน้าร้านวางของเล่น */
  /* เลื่อนตัวอาคารมาชิดหน้าล็อตมากขึ้นเมื่อ 2026-08-09 (เดิม -.85) ตามคำขอผู้ใช้ —
     เดิมเหลือแถบหญ้าหน้าร้านกว้างจนดูเหมือนร้านตั้งอยู่ห่างจากลานทางเดิน */
  const b = new THREE.Group(); b.position.z = -.35; g.add(b);
  const body = box(bw, bh, bd, lot.wall, .05); body.position.y = bh/2; b.add(body);
  /* หลังคาแบน + แถบป้ายหนาคาดรอบ (สัญลักษณ์ร้านค้า ไม่ใช่บ้าน)
     ⚠ ดาดฟ้าต้อง **ไม่ใช่สีขาว** — กล้องไอโซมองลงมาเห็นผืนนี้เต็มๆ ขาวโล้นแล้วอ่านเป็นแผ่นเปล่าใหญ่ๆ
       ใช้สีหลังคาของร้าน + วางตัวต่อสีสดบนดาดฟ้าคู่กับหมี ให้อ่านเป็น "ร้านของเล่น" ตั้งแต่มองไกลๆ */
  const slab = box(bw+.24, .16, bd+.24, lot.roof, .04); slab.position.y = bh+.08; b.add(slab);
  const rim  = box(bw+.34, .1, bd+.34, 0xfdfbf5, .03); rim.position.y = bh+.01; b.add(rim);
  const fascia = box(bw+.16, .5, bd+.16, lot.roof, .05); fascia.position.y = bh-.18; b.add(fascia);
  const fstripe = box(bw+.2, .1, bd+.2, 0xfdfbf5, .03); fstripe.position.y = bh-.4; b.add(fstripe);
  [[-1.1,-.5,0xef5f5f],[-.55,.45,0xffd54f],[1.15,-.35,0x8fd694]].forEach(([ox,oz,c])=>{
    const cb = box(.42,.42,.42,c,.06); cb.position.set(ox, bh+.37, oz); b.add(cb);   /* ตัวต่อยักษ์บนดาดฟ้า */
  });
  const fz = bd/2;
  /* ---- กระจกโชว์ 2 บาน ขนาบประตูกลาง ---- */
  addDoor(b, bd, 0xef8354);
  [-1,1].forEach(sd=>{
    const px = sd*bw*.29;
    const fr = box(1.42,1.3,.1,0xfffaf0,.05); fr.position.set(px, 1.06, fz+.02); b.add(fr);
    const gl = box(1.22,1.12,.08,0xbfe8f7,.03); gl.position.set(px, 1.06, fz+.06); b.add(gl);
    const sill = box(1.48,.12,.24,lot.roof,.03); sill.position.set(px, .42, fz+.1); b.add(sill);
    if(sd < 0){                                   /* บานซ้าย: ตัวต่อไม้ 3 ชั้นสีสด */
      [[0,.62,0xef5f5f],[-.16,.82,0xffd54f],[.14,.82,0x7fc4e8],[0,1.02,0x8fd694]].forEach(([ox,y,c])=>{
        const cb = box(.26,.26,.2,c,.04); cb.position.set(px+ox, y, fz+.14); b.add(cb);
      });
      const ball = sphere(.19,0xff8fb3,12); ball.position.set(px+.42,.66,fz+.16); b.add(ball);
    }else{                                        /* บานขวา: กังหันลม + ลูกข่าง */
      const st = cyl(.03,.03,.72,0xfffaf0,6); st.position.set(px-.1,.82,fz+.14); b.add(st);
      for(let i=0;i<4;i++){
        const pt = box(.28,.16,.03,[0xff8fb3,0xffd54f,0x7fc4e8,0x8fd694][i],.02);
        pt.rotation.z = i*Math.PI/2 + .35;
        pt.position.set(px-.1 + Math.cos(i*Math.PI/2+.35)*.17, 1.18 + Math.sin(i*Math.PI/2+.35)*.17, fz+.16); b.add(pt);
      }
      const top = cone(.17,.26,0xb388ff,10); top.rotation.x = Math.PI; top.position.set(px+.34,.62,fz+.16); b.add(top);
      const tip = cyl(.02,.02,.12,0xfffaf0,6); tip.position.set(px+.34,.79,fz+.16); b.add(tip);
    }
  });
  /* ---- กันสาดลายทางสีรุ้งเต็มหน้าร้าน ---- */
  const RB = [0xef5f5f,0xffa44f,0xffd54f,0x8fd694,0x7fc4e8,0xb388ff];
  const n = 12, sw = (bw+.1)/n;
  for(let i=0;i<n;i++){
    const st = box(sw, .08, .82, RB[i%RB.length], .02);
    st.position.set(-(bw+.1)/2 + sw*(i+.5), 1.92, fz+.36); st.rotation.x = -.34; b.add(st);
  }
  /* ---- ป้ายร้านบนแถบ fascia ---- */
  const sfr = box(1.3,.62,.08,0xfffaf0,.05); sfr.position.set(0, bh-.14, fz+.12); b.add(sfr);
  const sg = signPlane(lot.icon, .54); sg.position.set(0, bh-.14, fz+.18); b.add(sg);
  /* ---- ลูกโป่ง 3 ลูกผูกเสาหน้าร้าน ---- */
  const bpx = -bw*.5 - .12;
  const pole = cyl(.05,.05,1.5,0xfffaf0,8); pole.position.set(bpx,.75,fz+.7); b.add(pole);
  [[0xef5f5f,-.24,1.98,.62],[0xffd54f,.02,2.16,.7],[0x7fc4e8,.26,1.94,.66]].forEach(([c,ox,y,oz])=>{
    const th = cyl(.012,.012,.7,0xf7f3ee,4); th.position.set(bpx+ox*.5, y-.52, fz+oz); b.add(th);
    const bl = sphere(.19,c,12); bl.scale.y = 1.18; bl.position.set(bpx+ox, y, fz+oz); b.add(bl);
    const kn = cone(.05,.09,c,6); kn.position.set(bpx+ox, y-.24, fz+oz); b.add(kn);
  });
  /* ---- ของบนทางเท้า: ม้าโยก + กล่องของเล่นเปิดฝา ---- */
  const hx = bw*.34, hz = fz + 1.05;
  const rock = box(.62,.09,.24,0xef8354,.04); rock.position.set(hx,.13,hz); rock.rotation.z = .06; b.add(rock);
  const hbody = box(.44,.3,.2,0xffd54f,.07); hbody.position.set(hx,.42,hz); b.add(hbody);
  const hhead = box(.24,.26,.18,0xffd54f,.06); hhead.position.set(hx+.24,.66,hz); b.add(hhead);
  const hear = cone(.05,.1,0xef8354,6); hear.position.set(hx+.2,.82,hz); b.add(hear);
  const hey = sphere(.03,0x3a2f28,8); hey.position.set(hx+.3,.68,hz+.09); b.add(hey);
  const mane = box(.08,.24,.16,0xef5f5f,.04); mane.position.set(hx+.12,.66,hz); b.add(mane);
  const bx = -bw*.14, bz = fz + 1.08;
  const boxb = box(.52,.34,.4,0x7fc4e8,.05); boxb.position.set(bx,.17,bz); b.add(boxb);
  const lid = box(.54,.07,.42,0x5aa9e6,.03); lid.rotation.x = -.7; lid.position.set(bx,.44,bz-.2); b.add(lid);
  [[0xff8fb3,-.12,.42],[0xffd54f,.06,.46],[0x8fd694,.16,.4]].forEach(([c,ox,y])=>{
    const tb = sphere(.1,c,9); tb.position.set(bx+ox,y,bz+.04); b.add(tb);
  });
  addShopEmblem(b, 'toy', bh - .45);   /* หลังคาแบน → ลดความสูงให้ฐานหมีไปตกบนขอบ fascia พอดี (แบบ minimart) */
  g.position.set(outWX(cx), 0, outWZ(cz));
  return g;
}

/* ---------- ร้านสะดวกซื้อ (minimart) ของชุมชน — ล็อต shop-mart ----------
   เดิมล็อตนี้เป็น "ร้านขนมปัง" ที่ใช้ทรงบ้านจั่วของ buildLotBuilding แล้วแปะชั้นขนมปังทับหน้าบ้าน
   เด็กมองแล้วเหมือนบ้านหลังหนึ่ง → เปลี่ยนเป็นร้านสะดวกซื้อเต็มตัว มีตึกเป็นของตัวเอง:
     - หลังคาแบน + แถบป้ายหนา (fascia) คาดรอบตัวตึก = สัญลักษณ์เด่นที่สุดของร้านสะดวกซื้อ (ไม่มีหน้าจั่ว/ปล่องไฟ)
     - หน้าร้านเป็นกระจกบานใหญ่เต็มแนวทั้ง 2 ฝั่ง + ประตูกระจกบานเลื่อนคู่ตรงกลาง
     - กันสาดลายทาง + ป้ายร้านบนแถบ fascia + ป้ายยื่นข้างอาคาร
     - ทางเท้าหน้าร้าน: ชั้นวางของกิน/น้ำ ตู้แช่ไอศกรีม ตะกร้าซ้อน พรมเช็ดเท้า กระถางต้นไม้
   ตะกร้าช็อปปิ้งยักษ์บนหลังคามาจาก addShopEmblem('mart') (ส่ง bh ลดลง .45 ให้ฐานไปตกบนขอบ fascia พอดี) */
function buildMinimart(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const bw = w-.4, bd = d-.7, bh = 2.0;          /* ตื้นกว่าบ้านทั่วไป → เหลือทางเท้าหน้าร้านให้วางของ */
  const fz = bd/2;
  const brand = lot.roof, accent = 0x6fbf73;     /* สีแบรนด์ร้าน: ส้ม (จากผัง) + เขียว = แถบคาดสองสีแบบร้านสะดวกซื้อ */
  const base = box(bw+.18,.24,bd+.18, 0xe6ddce,.05); base.position.y = .12; g.add(base);
  const body = box(bw, bh, bd, lot.wall,.06); body.position.y = bh/2; g.add(body);
  /* --- แถบป้ายหนารอบหลังคาแบน (fascia) + คิ้วสองสี --- */
  const fascia = box(bw+.22,.5,bd+.22, brand,.06); fascia.position.y = bh+.25; g.add(fascia);
  const st1 = box(bw+.26,.11,bd+.26, 0xfffaf0,.03); st1.position.y = bh+.06; g.add(st1);
  const st2 = box(bw+.26,.09,bd+.26, accent,.03);   st2.position.y = bh+.19; g.add(st2);
  /* พื้นดาดฟ้า **แคบกว่าแถบ fascia เสมอ** และอยู่ต่ำกว่าขอบบน — มองมุมไอโซจะเห็นแถบสีส้มตีกรอบรอบดาดฟ้า
     (เคยทำเป็นแผ่นขาวกว้างคลุมทับ กลายเป็นฝากล่องขาวใบโต กลืนกับผนัง มองไม่ออกว่าเป็นแถบป้ายร้าน) */
  const deck = box(bw+.02,.12,bd+.02, 0xdcd5c6,.03); deck.position.y = bh+.46; g.add(deck);
  /* --- เสาตกแต่งมุมหน้าร้าน 2 ต้น (ตีกรอบแนวกระจกให้ดูเป็นหน้าร้าน) --- */
  [-1,1].forEach(sd=>{
    const pil = box(.28, bh, .3, brand,.05); pil.position.set(sd*(bw/2-.14), bh/2, fz-.08); g.add(pil);
  });
  /* --- กระจกหน้าร้านบานใหญ่ 2 ฝั่ง (ฝั่งละบานคู่) --- */
  [-1,1].forEach(sd=>{
    const px = sd*1.12;
    const fr = box(1.3, 1.5, .1, 0xfffaf0,.04);  fr.position.set(px, 1.0, fz+.02); g.add(fr);
    const gl = box(1.14, 1.34, .08, 0xd5f0fb,.03); gl.position.set(px, 1.0, fz+.06); g.add(gl);   /* ฟ้าอ่อน — ใต้กันสาดมีเงาทับอยู่แล้ว ถ้าใช้ฟ้าเข้มจะออกมาเป็นสีเทาทึบ */
    const mul = box(.08, 1.34, .06, 0xfffaf0,.02); mul.position.set(px, 1.0, fz+.1); g.add(mul);
    const sill = box(1.36,.14,.22, brand,.04); sill.position.set(px, .27, fz+.08); g.add(sill);
    /* สติกเกอร์วงกลมสีลูกกวาดติดกระจก (ร้านสะดวกซื้อชอบมีป้ายโปรโมชันติดกระจก) */
    [[-.34,1.44,0xffd54f],[.34,1.44,0xff8fb3]].forEach(([ox,oy,c])=>{
      const dot = cyl(.1,.1,.04,c,12); dot.rotation.x = Math.PI/2; dot.position.set(px+ox, oy, fz+.11); g.add(dot);
    });
  });
  /* --- ประตูกระจกบานเลื่อนคู่ตรงกลาง --- */
  const dfr = box(1.14, 1.5, .1, 0xd8dee3,.04); dfr.position.set(0, .75, fz+.02); g.add(dfr);
  [-1,1].forEach(sd=>{
    const leaf = box(.5, 1.34, .08, 0xd5f0fb,.03); leaf.position.set(sd*.27, .69, fz+.07); g.add(leaf);
    const bar  = cyl(.035,.035,1.0, 0xb8c2c8, 8);  bar.position.set(sd*.08, .69, fz+.12); g.add(bar);
  });
  const dtop = box(1.2,.12,.16, accent,.03); dtop.position.set(0, 1.48, fz+.08); g.add(dtop);
  /* --- กันสาดลายทางเต็มหน้าร้าน + ไฟใต้กันสาด --- */
  const n = 10, sw = bw*.96/n;
  for(let i=0;i<n;i++){
    const st = box(sw, .08, .64, i%2 ? 0xfffaf0 : brand, .02);   /* กันสาดตื้น (.64) — ลึกกว่านี้จะคลุมกระจกหน้าร้านจนมองไม่เห็น */
    st.position.set(-bw*.48 + sw*(i+.5), 1.86, fz+.3); st.rotation.x = -.32; g.add(st);
  }
  [-1.1, 0, 1.1].forEach(ox=>{
    const lamp = cyl(.09,.09,.07, 0xfff3c4, 10); lamp.position.set(ox, 1.68, fz+.24); g.add(lamp);
  });
  /* --- ป้ายร้านบนแถบ fascia (แผ่นขาว + รูปสินค้า + บรรทัดชื่อร้านจำลอง) --- */
  const sfr = box(2.5,.44,.08, 0xfffaf0,.05); sfr.position.set(0, bh+.26, fz+.16); g.add(sfr);
  const sg = signPlane(lot.icon, .34); sg.position.set(-.86, bh+.26, fz+.22); g.add(sg);
  /* 2 บรรทัดจำลอง "ชื่อร้าน" — y ต้องอยู่ในช่วงแผ่นป้าย (bh+.04 ถึง bh+.48) ไม่งั้นบรรทัดล่างจะหลุดออกนอกป้าย
     ใช้โทนน้ำตาลอ่อน-เข้ม (ไม่ใช่สีแบรนด์) เพราะบรรทัดสีส้มบนป้ายขาวจะกลืนไปกับแถบ fascia สีเดียวกันที่อยู่หลังป้าย */
  [[.3,.35,.98,0x8f6231],[.16,.17,.72,0xd9c7a5]].forEach(([ox,oy,lw,c])=>{
    const ln = box(lw,.12,.03, c,.02); ln.position.set(ox, bh+oy, fz+.22); g.add(ln);
  });
  /* --- ป้ายยื่นข้างอาคาร (blade sign) ฝั่ง +x = ฝั่งที่กล้องไอโซเห็นเต็มๆ ---
     เดิมเป็นป้ายเสาสูงตั้งบนทางเท้า แต่เสาเรียวๆ มองมุมไอโซแล้วเหมือนป้ายลอยอยู่กลางอากาศ
     เปลี่ยนเป็นป้ายติดผนังยื่นออกด้านข้างแทน — เห็นชัดกว่า ไม่กินที่ทางเท้า และช่วยแก้ผนังข้างที่ว่างโล่ง */
  const bx = bw/2, bz = fz-.55;
  const arm = box(.3,.1,.12, 0xd8dee3,.03); arm.position.set(bx+.1, 2.02, bz); g.add(arm);
  const bfr = box(.14,.78,.9, brand,.06);    bfr.position.set(bx+.2, 1.6, bz); g.add(bfr);
  const bfc = box(.08,.62,.74, 0xfffaf0,.05); bfc.position.set(bx+.28, 1.6, bz); g.add(bfc);
  [1,-1].forEach(sd=>{                       /* รูปสินค้าทั้ง 2 หน้าป้าย (เดินผ่านทางไหนก็เห็น) */
    const bsg = signPlane(lot.icon, .48); bsg.rotation.y = sd*Math.PI/2;
    bsg.position.set(bx + (sd>0 ? .33 : .11), 1.6, bz); g.add(bsg);
  });
  /* --- ของบนหลังคา: คอมเพรสเซอร์แอร์ + ขนมปังยักษ์ --- */
  const ac = box(.6,.34,.48, 0xc3ccd2,.05); ac.position.set(bw*.28, bh+.64, -bd*.16); g.add(ac);
  const fan = cyl(.15,.15,.05, 0x9fabb3, 12); fan.position.set(bw*.28, bh+.83, -bd*.16); g.add(fan);
  addShopEmblem(g, 'mart', bh-.45);
  /* --- ทางเท้าหน้าร้าน ---
     ของชิ้นใหญ่ (ชั้นขนมปัง/ตู้แช่) วาง "หันตามแนว z" ชิดขอบซ้าย-ขวาของทางเท้า ไม่วางขวางกลาง
     ไม่งั้นมุมกล้องไอโซจะบังกระจกหน้าร้านทั้งบาน เหลือแต่หลังคากับกันสาดให้ดู */
  const front = fz + .42;
  /* ลานปูนหน้าร้าน — ของหน้าร้านจะได้ไม่ดูตั้งอยู่บนหญ้า
     บางมาก (.05) เพราะยื่นเลยขอบล็อตไปทับช่องทางเดินหน้าร้านนิดหน่อย เด็กเดินผ่านแล้วต้องไม่เห็นเท้าจม */
  const apron = box(bw+.3,.05,1.05, 0xefe7d8,.02); apron.position.set(0,.025,fz+.42); g.add(apron);
  const mat = box(1.16,.05,.5, brand,.02); mat.position.set(0,.06,front-.02); g.add(mat);
  /* ชั้นวางของริมซ้าย 2 ชั้น: กล่องขนมสีสด (ชั้นบน) + ขวดน้ำ (ชั้นล่าง) = ของที่ร้านสะดวกซื้อขาย */
  const shx = -(bw/2 - .26);
  [0,1].forEach(i=>{
    const shy = .44 + i*.34;                       /* ระดับแผ่นชั้น — ของต้องวางที่ shy+.17 (ครึ่งความสูงของ+ครึ่งความหนาชั้น) ไม่ใช่ค่าคงที่ */
    const sh = box(.44,.09,1.06, 0xd8d3c8,.03); sh.position.set(shx,shy,front+.06); g.add(sh);
    [-.32,0,.32].forEach((o,k)=>{
      const c = [0xef8354,0xffd54f,0x7fc4e8,0xff8fb3,0x8fd694,0xb388ff][(k+i*3)%6];
      if(i){ const bx2 = box(.26,.24,.24, c,.03); bx2.position.set(shx,shy+.17,front+.06+o); g.add(bx2); }
      else { const bt = cyl(.09,.1,.24, c,10); bt.position.set(shx,shy+.17,front+.06+o); g.add(bt);
             const cp = cyl(.055,.055,.06, 0xfffaf0,8); cp.position.set(shx,shy+.32,front+.06+o); g.add(cp); }
    });
  });
  [-1,1].forEach(sd=>{ const lg = cyl(.05,.05,.44, 0xc3ccd2, 8); lg.position.set(shx,.22,front+.06+sd*.44); g.add(lg); });
  /* ตู้แช่ (ฝาบานเลื่อนสีฟ้า + ไอศกรีมโคนเล็กๆ ตั้งบนฝา) — วางฝั่ง **ซ้าย** ของประตูเท่านั้น
     ฝั่งขวาหน้าประตูคือช่องที่พี่นวล (npc-mart, side:1) ยืนประจำอยู่ กล้องไอโซมุมเดียวตายตัว
     ⇒ ของอะไรที่วางตรงนั้นจะโดนตัว NPC บังถาวร ไม่มีวันเห็น (เคยวางไว้แล้วหายทั้งตู้) */
  const cfx = -.86;
  const chest = box(.5,.54,.96, 0xfffaf0,.06); chest.position.set(cfx,.29,front+.04); g.add(chest);
  const lid   = box(.54,.1,1.0, 0x7fc4e8,.04); lid.position.set(cfx,.6,front+.04); g.add(lid);
  const band  = box(.54,.12,1.0, brand,.03);   band.position.set(cfx,.44,front+.04); g.add(band);
  const cs = cone(.11,.24,0xe0a860,10); cs.rotation.x = Math.PI; cs.position.set(cfx,.74,front+.04); g.add(cs);
  [[0,.9,0xffb3c6],[.07,1.0,0xa8e6cf]].forEach(([oz,oy,c])=>{
    const sc = sphere(.11,c,10); sc.position.set(cfx,oy,front+.04+oz); g.add(sc);
  });
  /* ตะกร้าซ้อนข้างประตู + กระถางดอกไม้ริมขวา (คู่กับชั้นขนมปังริมซ้าย ให้หน้าร้านสมดุลกัน) */
  [0,1,2].forEach(i=>{
    const bk = box(.4,.13,.3, [0xef8354,0xffd54f,0x7fc4e8][i],.04);
    bk.position.set(.86,.1+i*.13,front+.1); g.add(bk);
  });
  /* กระถางดอกไม้ย้ายมาอยู่ "ข้างตัวอาคารฝั่ง +x" (ใต้ป้ายยื่น) แทนที่จะอยู่หน้าประตูฝั่งขวา
     เหตุผลเดียวกับตู้แช่: หน้าประตูฝั่งขวามีพี่นวลยืนบังอยู่ ส่วนแถบข้างอาคารฝั่งนี้กล้องเห็นเต็มๆ แต่เดิมโล่งเปล่า */
  const potX = bw/2 + .2, potZ = fz - .45;
  const pot = cyl(.22,.18,.34, 0xd9784f,10); pot.position.set(potX,.17,potZ); g.add(pot);
  const bush = sphere(.26,0x8fd694,10); bush.scale.y = .85; bush.position.set(potX,.5,potZ); g.add(bush);
  [[-.12,.62],[.12,.64],[0,.74]].forEach((o,i)=>{
    const fl = sphere(.08,[0xffd54f,0xff8fb3,0xfffaf0][i],8);
    fl.position.set(potX+o[0],o[1],potZ); g.add(fl);
  });
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}

/* ตัวโน้ตดนตรี (หัวโน้ตเอียง + ก้าน + ธง) ใช้ทั้งบนดาดฟ้าร้านและตกแต่งผนัง — sc = ตัวคูณขนาด */
function musicNote(hex, sc){
  const g = new THREE.Group();
  const head = sphere(.17*sc, hex, 12); head.scale.set(1.25,.85,.55); head.rotation.z = .38; g.add(head);
  const stem = box(.06*sc,.66*sc,.06*sc, hex,.02); stem.position.set(.19*sc,.36*sc,0); g.add(stem);
  const flag = box(.055*sc,.34*sc,.055*sc, hex,.02); flag.rotation.z = -.62;
  flag.position.set(.33*sc,.58*sc,0); g.add(flag);
  return g;
}
/* ---------- ร้านเครื่องดนตรี (shop-music) — ล็อต 7×4 ใหญ่กว่าบ้านทั่วไป ----------
   เดิมล็อตนี้เป็นบ้านหลังคาม่วง (home-6) เปลี่ยนเป็นร้านเมื่อ 2026-08-06 คงโทนม่วงไว้เป็นที่หมายเดิม
   จุดที่ทำให้ "อ่านออกว่าเป็นร้าน" ไม่ใช่บ้าน: ตึก 2 ชั้นหลังคาแบน + แถบป้ายหนาคาดรอบ + กระจกโชว์
   บานใหญ่ 2 บาน + ประตูกระจก + กันสาดลายทาง + ทางเท้าหน้าร้านเป็นลายคีย์เปียโน + กีตาร์ยักษ์กับ
   ตัวโน้ตตั้งบนดาดฟ้า + เครื่องดนตรีจริงตั้งโชว์หน้าร้าน
   ⚠ ของหน้าร้านห้ามวางในช่วง x ≈ +.4 ถึง +1.6 — เป็นช่องที่พี่โน้ต (npc-music, side:1) ยืนประจำ
     กล้องไอโซมุมเดียวตายตัว ของตรงนั้นจะโดนตัว NPC บังถาวร (บทเรียนเดียวกับตู้แช่ร้านสะดวกซื้อ) */
function buildMusicShop(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const bw = w-.6, bd = d-1.2, bh = 2.7;          /* ตื้นกว่าล็อต เหลือทางเท้าหน้าร้านไว้ตั้งเครื่องดนตรี */
  /* เครื่องดนตรีหน้าร้านถอยออกมาสุดขอบล็อต (fz+.62) — วางชิดผนังที่ fz+.35 แล้วกล้องไอโซมุมก้มทำให้
     กลอง/คีย์บอร์ดบังกระจกโชว์ชั้นล่าง แต่ถอยไกลกว่านี้จะล้ำเข้าไปในช่องทางเดินหน้าร้านที่เด็กเดินผ่าน */
  const fz = bd/2, front = fz+.62;
  const brand = lot.roof, gold = 0xffd54f, cream = 0xfffaf0, glass = 0xd5f0fb, dark = 0x3a3140;
  const base = box(bw+.2,.26,bd+.2, 0xe6ddce,.05); base.position.y = .13; g.add(base);
  const body = box(bw, bh, bd, lot.wall,.06); body.position.y = bh/2; g.add(body);
  /* --- แถบป้ายหนารอบหลังคาแบน + คิ้วสองสี (ทรงเดียวกับร้านสะดวกซื้อ ให้ร้านในเมืองเป็นภาษาเดียวกัน) --- */
  const fascia = box(bw+.24,.56,bd+.24, brand,.06); fascia.position.y = bh+.28; g.add(fascia);
  const st1 = box(bw+.28,.11,bd+.28, cream,.03); st1.position.y = bh+.06; g.add(st1);
  const st2 = box(bw+.28,.09,bd+.28, gold,.03);  st2.position.y = bh+.2;  g.add(st2);
  /* ดาดฟ้าโทนม่วงเทา (ไม่ใช่ครีม) — ล็อตนี้ใหญ่ ถ้าดาดฟ้าสีครีมสว่างจะกลายเป็นแผ่นขาวผืนโตกินภาพทั้งหลัง */
  const deck = box(bw-.14,.12,bd-.14, 0xcfc6dd,.03); deck.position.y = bh+.5; g.add(deck);
  const beltY = 1.92;                                    /* คิ้วคั่นชั้น 1/ชั้น 2 */
  const belt = box(bw+.12,.18,bd+.12, brand,.04); belt.position.y = beltY; g.add(belt);
  /* --- ชั้นล่าง: กระจกโชว์ 2 บาน (มีเครื่องดนตรีตั้งอยู่ข้างใน) + ประตูกระจกกลาง --- */
  [-1,1].forEach(sd=>{
    const px = sd*2.0;
    const fr = box(2.16,1.6,.14, cream,.04);  fr.position.set(px, 1.02, fz); g.add(fr);
    const gl = box(1.96,1.4,.09, glass,.03);  gl.position.set(px, 1.02, fz+.06); g.add(gl);
    const sill = box(2.22,.16,.24, brand,.03); sill.position.set(px, .2, fz+.06); g.add(sill);
    if(sd<0){                                            /* บานซ้าย: กีตาร์แขวนโชว์ */
      const gb = sphere(.26, 0xef8354, 12); gb.scale.set(1,1.15,.3); gb.position.set(px, .82, fz+.02); g.add(gb);
      const gb2 = sphere(.19, 0xef8354, 12); gb2.scale.set(1,1.05,.3); gb2.position.set(px, 1.15, fz+.02); g.add(gb2);
      const hole = cyl(.08,.08,.05, 0x8f6231, 12); hole.rotation.x = Math.PI/2; hole.position.set(px, .95, fz+.11); g.add(hole);
      const nk = box(.11,.72,.08, 0xd9a86c,.02); nk.position.set(px, 1.62, fz+.02); g.add(nk);
      const hd = box(.17,.2,.09, 0x8f6231,.02); hd.position.set(px, 2.02, fz+.02); g.add(hd);
    }else{                                               /* บานขวา: กลองใบเล็ก + ตัวโน้ตลอย */
      const dr = cyl(.3,.3,.36, cream, 16); dr.rotation.x = Math.PI/2; dr.position.set(px-.2, .7, fz+.02); g.add(dr);
      const rim = torus(.3,.045, brand, 16); rim.position.set(px-.2, .7, fz+.2); g.add(rim);
      const cy = cyl(.24,.24,.03, gold, 16); cy.rotation.x = .3; cy.position.set(px+.5, 1.12, fz+.02); g.add(cy);
      const cySt = cyl(.03,.03,.55, 0xb8c2c8, 8); cySt.position.set(px+.5, .83, fz+.02); g.add(cySt);
      const nt = musicNote(0xff8fb3, .8); nt.position.set(px+.42, 1.6, fz+.04); nt.rotation.z = -.15; g.add(nt);
    }
  });
  const dfr = box(1.6,1.78,.14, brand,.04); dfr.position.set(0, .89, fz); g.add(dfr);
  [-1,1].forEach(sd=>{
    const leaf = box(.66,1.56,.09, glass,.03); leaf.position.set(sd*.36, .84, fz+.06); g.add(leaf);
    const bar = cyl(.035,.035,.9, 0xb8c2c8, 8); bar.position.set(sd*.1, .84, fz+.12); g.add(bar);
  });
  const dtop = box(1.66,.16,.2, gold,.03); dtop.position.set(0, 1.84, fz+.06); g.add(dtop);
  /* --- กันสาดลายทางม่วง-ครีมพาดหน้าร้าน (ใต้คิ้วคั่นชั้น)
         ⚠ ตื้นแค่ .44 เท่านั้น — กล้องไอโซมองจากมุมสูง กันสาดลึกๆ จะคลุมกระจกโชว์ชั้นล่างหายทั้งแถบ
            (ลองลึก .86 มาแล้ว หน้าร้านเหลือแต่ผ้าใบลายทาง มองไม่เห็นเครื่องดนตรีในตู้เลย) --- */
  const nStr = 14, sw = (bw+.24)/nStr;
  for(let i=0;i<nStr;i++){
    const st = box(sw+.02,.09,.44, i%2 ? cream : brand,.02);
    st.position.set(-(bw+.24)/2 + sw*(i+.5), 1.8, fz+.16); st.rotation.x = -.34; g.add(st);
  }
  const awEdge = box(bw+.3,.12,.1, gold,.03); awEdge.position.set(0, 1.73, fz+.35); g.add(awEdge);
  /* --- ชั้นบน: หน้าต่างสูง 3 บาน คั่นด้วยตัวโน้ตติดผนัง --- */
  [-2.05,0,2.05].forEach(px=>{
    const wf = box(1.16,.78,.1, cream,.04); wf.position.set(px, 2.3, fz); g.add(wf);
    const wg = box(.98,.62,.07, glass,.03); wg.position.set(px, 2.3, fz+.05); g.add(wg);
    const mul = box(.07,.62,.09, cream,.02);  mul.position.set(px, 2.3, fz+.06); g.add(mul);
  });
  [-1.03,1.03].forEach((px,i)=>{
    const nt = musicNote([gold,0xff8fb3][i], .62); nt.position.set(px, 2.18, fz+.05); g.add(nt);
  });
  /* --- ป้ายร้านบนแถบ fascia (แผ่นขาว รูปกีตาร์ 2 บรรทัดจำลองชื่อร้าน) --- */
  const sfr = box(3.5,.46,.08, cream,.05); sfr.position.set(0, bh+.28, fz+.18); g.add(sfr);
  const sg = signPlane(lot.icon, .4); sg.position.set(-1.24, bh+.28, fz+.24); g.add(sg);
  [[.5,.36,1.6,0x6a4aa8],[.32,.16,1.16,0xc9b6e8]].forEach(([ox,oy,lw,c])=>{
    const ln = box(lw,.13,.03, c,.02); ln.position.set(ox, bh+oy, fz+.24); g.add(ln);
  });
  /* --- ผนังด้าน +x (อีกด้านที่กล้องไอโซเห็น) — หน้าต่างชั้นบน + โน้ตวาดผนัง กันหน้าตึกด้านนี้โล่งเป็นแผ่นขาว --- */
  [-.62,.62].forEach(pz=>{
    const sw2 = box(.1,.72,.86, cream,.04); sw2.position.set(bw/2, 2.3, pz); g.add(sw2);
    const sgl = box(.07,.58,.7, glass,.03); sgl.position.set(bw/2+.05, 2.3, pz); g.add(sgl);
  });
  [[1.35,.72,gold,.72],[.85,-.5,0xff8fb3,.58]].forEach(([ny,nz,c,s])=>{
    const nt = musicNote(c, s); nt.rotation.y = Math.PI/2; nt.position.set(bw/2+.05, ny, nz); g.add(nt);
  });
  /* --- ดาดฟ้า: กีตาร์ยักษ์ (ฝั่งซ้าย) + ป้ายบิลบอร์ดตั้งพื้น (ฝั่งขวา) เป็นที่หมายมองเห็นแต่ไกล
         ดาดฟ้าล็อต 7×4 ถ้าปล่อยโล่งจะกลายเป็นแผ่นสีเรียบผืนโตกินภาพทั้งหลัง แต่ของชิ้นเล็กๆ
         (เคยลองช่องแสง+ลำโพงฮอร์น) มองมุมไอโซแล้วอ่านไม่ออกว่าเป็นอะไร กลายเป็นสามเหลี่ยมลอยๆ
         จึงใช้ของชิ้นใหญ่ 2 ชิ้นแทน --- */
  const ry = bh+.56, gux = -2.0;
  const gBody = sphere(.5, 0xef8354, 14); gBody.scale.set(1,1.1,.3);  gBody.position.set(gux, ry+.6, 0); g.add(gBody);
  const gBody2 = sphere(.36, 0xef8354, 14); gBody2.scale.set(1,1.05,.3); gBody2.position.set(gux, ry+1.16, 0); g.add(gBody2);
  const gHole = cyl(.15,.15,.06, 0x8f6231, 14); gHole.rotation.x = Math.PI/2; gHole.position.set(gux, ry+.82, .16); g.add(gHole);
  const gBrg = box(.34,.1,.09, 0x8f6231,.02); gBrg.position.set(gux, ry+.45, .16); g.add(gBrg);
  const gNeck = box(.19,1.1,.14, 0xd9a86c,.03); gNeck.position.set(gux, ry+1.9, .02); g.add(gNeck);
  const gHead = box(.28,.34,.16, 0x8f6231,.03); gHead.position.set(gux, ry+2.58, .02); g.add(gHead);
  [-.05,.05].forEach(ox=>{ const strg = box(.025,1.9,.025, cream,.01); strg.position.set(gux+ox, ry+1.5, .17); g.add(strg); });
  const bbx = 1.3, bbz = -.35;
  [-1.2,1.2].forEach(ox=>{
    const leg = cyl(.075,.075,.8, 0xb8c2c8, 8); leg.position.set(bbx+ox, ry+.4, bbz); g.add(leg);
  });
  const bbFr = box(3.2,1.3,.16, brand,.06); bbFr.position.set(bbx, ry+1.42, bbz); g.add(bbFr);
  const bbPl = box(2.94,1.06,.1, cream,.05); bbPl.position.set(bbx, ry+1.42, bbz+.06); g.add(bbPl);
  const bbSg = signPlane(lot.icon, .7); bbSg.position.set(bbx-.86, ry+1.42, bbz+.13); g.add(bbSg);
  [[.42,.24,1.5,0x6a4aa8],[.28,-.06,1.1,0xc9b6e8]].forEach(([ox,oy,lw,c])=>{
    const ln = box(lw,.16,.03, c,.02); ln.position.set(bbx+ox, ry+1.42+oy, bbz+.13); g.add(ln);
  });
  const bbNt = musicNote(0xff8fb3,.7); bbNt.position.set(bbx+1.16, ry+1.3, bbz+.13); g.add(bbNt);
  /* --- ป้ายยื่นข้างอาคารฝั่ง +x (ฝั่งที่กล้องไอโซเห็นเต็มๆ) --- */
  const bx = bw/2;
  const arm = box(.5,.1,.1, 0xd8dee3,.03); arm.position.set(bx+.14, 2.26, .3); g.add(arm);
  const bfr = box(.16,1.0,1.0, brand,.05);  bfr.position.set(bx+.28, 1.78, .3); g.add(bfr);
  const bfc = box(.1,.84,.84, cream,.05);   bfc.position.set(bx+.36, 1.78, .3); g.add(bfc);
  [1,-1].forEach(sd=>{
    const bsg = signPlane(lot.icon, .56); bsg.rotation.y = sd*Math.PI/2;
    bsg.position.set(bx + (sd>0 ? .43 : .21), 1.78, .3); g.add(bsg);
  });
  /* --- ทางเท้าหน้าร้านเป็นลายคีย์เปียโน (มองมุมไอโซเห็นเต็มผืน อ่านออกทันทีว่าร้านดนตรี) --- */
  const apW = bw+.4, nK = 15, kw = apW/nK, apZ = fz+.72;
  const apron = box(apW,.06,1.2, cream,.02); apron.position.set(0,.03,apZ); g.add(apron);
  const blackPat = [1,1,0,1,1,1,0];
  for(let i=1;i<nK;i++){
    const kx = -apW/2 + i*kw;
    const ln = box(.04,.02,1.14, 0xcfc7dd,.01); ln.position.set(kx,.07,apZ); g.add(ln);
    if(blackPat[(i-1)%7]){ const bk = box(.22,.04,.66, dark,.01); bk.position.set(kx,.08,apZ-.25); g.add(bk); }
  }
  /* --- เครื่องดนตรีตั้งโชว์หน้าร้าน: กลองชุด + คีย์บอร์ด (ฝั่ง -x) / กีตาร์ + ตู้แอมป์ (ฝั่ง +x) --- */
  const dx = -2.65;
  /* ตัวกลองใหญ่เป็นสีม่วงแบรนด์ หน้ากลองครีม — ถ้าทำตัวกลองครีมทั้งใบจะจมหายไปกับพื้นลายคีย์เปียโนสีครีม
     เหลือแต่ขอบกลองลอยเป็นวงเดียวโดดๆ (เจอมาแล้วตอนลองครั้งแรก) */
  const bass = cyl(.44,.44,.52, brand, 18); bass.rotation.x = Math.PI/2; bass.position.set(dx,.46,front); g.add(bass);
  const bHead = cyl(.4,.4,.04, cream, 18); bHead.rotation.x = Math.PI/2; bHead.position.set(dx,.46,front+.27); g.add(bHead);
  const bRim = torus(.44,.055, gold, 18); bRim.position.set(dx,.46,front+.28); g.add(bRim);
  const bLogo = musicNote(brand,.5); bLogo.position.set(dx-.06,.34,front+.31); g.add(bLogo);
  const snare = cyl(.24,.24,.22, gold, 14); snare.position.set(dx+.72,.72,front-.1); g.add(snare);
  const sHead = cyl(.245,.245,.04, cream, 14); sHead.position.set(dx+.72,.84,front-.1); g.add(sHead);
  [-1,1].forEach(sd=>{ const lg = cyl(.03,.03,.62, 0xb8c2c8, 6); lg.position.set(dx+.72+sd*.16,.31,front-.1+sd*.1); g.add(lg); });
  const cym = cyl(.3,.3,.035, gold, 18); cym.rotation.x = .32; cym.position.set(dx-.62,1.12,front-.18); g.add(cym);
  const cySt = cyl(.035,.035,1.1, 0xb8c2c8, 8); cySt.position.set(dx-.62,.55,front-.18); g.add(cySt);
  [-1,1].forEach(sd=>{ const stk = cyl(.028,.028,.5, 0xe8c9a0, 6); stk.rotation.x = Math.PI/2; stk.rotation.z = sd*.22;
    stk.position.set(dx+sd*.12,.86,front+.16); g.add(stk); });
  const kx0 = -.95;
  const kbBody = box(1.4,.16,.44, dark,.04);   kbBody.position.set(kx0,.8,front-.02); g.add(kbBody);
  const kbKeys = box(1.24,.07,.3, cream,.02);  kbKeys.position.set(kx0,.9,front+.04); g.add(kbKeys);
  for(let i=0;i<7;i++){ if(!blackPat[i%7]) continue;
    const bk = box(.07,.04,.16, dark,.01); bk.position.set(kx0-.5+i*.17,.95,front-.02); g.add(bk); }
  [-1,1].forEach(sd=>{
    const lg = cyl(.04,.04,.78, 0xb8c2c8, 8); lg.rotation.z = sd*.16; lg.position.set(kx0+sd*.5,.39,front-.02); g.add(lg);
  });
  const gx = 2.25;
  const gsBody = sphere(.3, 0x7fc4e8, 12); gsBody.scale.set(1,1.15,.32); gsBody.rotation.z = .16; gsBody.position.set(gx,.45,front-.02); g.add(gsBody);
  const gsB2 = sphere(.22, 0x7fc4e8, 12); gsB2.scale.set(1,1.05,.32); gsB2.rotation.z = .16; gsB2.position.set(gx+.07,.82,front-.02); g.add(gsB2);
  const gsHole = cyl(.09,.09,.05, 0x2e6f8f, 12); gsHole.rotation.x = Math.PI/2; gsHole.position.set(gx+.02,.6,front+.08); g.add(gsHole);
  const gsNeck = box(.12,.86,.09, 0xd9a86c,.02); gsNeck.rotation.z = .16; gsNeck.position.set(gx+.2,1.35,front-.02); g.add(gsNeck);
  const gsHead = box(.18,.22,.1, 0x8f6231,.02); gsHead.rotation.z = .16; gsHead.position.set(gx+.28,1.83,front-.02); g.add(gsHead);
  [-1,1].forEach(sd=>{ const lg = cyl(.03,.03,.9, 0xb8c2c8, 6); lg.rotation.x = sd*.2; lg.position.set(gx,.45,front-.02+sd*.14); g.add(lg); });
  const amp = box(.62,.66,.5, dark,.05); amp.position.set(gx+.95,.33,front-.04); g.add(amp);
  const ampSpk = cyl(.19,.19,.05, 0x8d84a0, 14); ampSpk.rotation.x = Math.PI/2; ampSpk.position.set(gx+.95,.3,front+.22); g.add(ampSpk);
  const ampTop = box(.66,.1,.54, brand,.03); ampTop.position.set(gx+.95,.7,front-.04); g.add(ampTop);
  [[-.12,gold],[.12,0xff8fb3]].forEach(([ox,c])=>{
    const kn = cyl(.045,.045,.04, c, 10); kn.rotation.x = Math.PI/2; kn.position.set(gx+.95+ox,.63,front+.2); g.add(kn);
  });
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}

/* ---------- คอกสัตว์เลี้ยงข้างร้าน (pen-petshop) — โล่ง ไม่มีหลังคา ----------
   รั้วคนละแบบกับรั้วไม้ฟาร์ม: เสาครีมขอบมน + ระแนงพาสเทล + ยอดเสาเป็นลูกกลมสีลูกกวาด
   ให้เข้าชุดกับรั้วโรงเรียน/ซุ้มลานน้ำพุในเมือง */
function buildPetPenFencePiece(alongX, alongZ){
  const g = new THREE.Group();
  const post = box(.15,.86,.15, 0xfdfbf5,.05); post.position.y = .43; g.add(post);
  const cap = sphere(.1, 0xef8fa5, 8); cap.position.y = .9; g.add(cap);
  [.34,.64].forEach(y=>{                                   /* ราวนอน 2 ชั้นสีเขียวมิ้นต์ */
    if(alongX){ const r = box(1.02,.09,.07, 0x8fd694,.03); r.position.set(.5,y,0); g.add(r); }
    if(alongZ){ const r = box(.07,.09,1.02, 0x8fd694,.03); r.position.set(0,y,.5); g.add(r); }
  });
  [.28,.5,.72].forEach(f=>{                                /* ระแนงตั้งเตี้ยๆ กันสัตว์ตัวเล็กลอด */
    if(alongX){ const s2 = box(.07,.46,.06, 0xfdfbf5,.02); s2.position.set(f,.5,0); g.add(s2); }
    if(alongZ){ const s2 = box(.06,.46,.07, 0xfdfbf5,.02); s2.position.set(0,.5,f); g.add(s2); }
  });
  return g;
}
/* เสาประตูคอก 2 ต้นขนาบช่องทางเข้า — **ไม่มีคานพาดข้างบน** (คอกต้องโล่ง ไม่มีอะไรคล้ายหลังคา)
   แต่ละต้นมีป้ายรอยเท้าสัตว์ติดอยู่ บอกว่าตรงนี้คือทางเข้าคอก (ไม่บล็อกช่อง เดินเข้าได้) */
function buildPetPenGate(){
  const g = new THREE.Group();
  [-1,1].forEach(sd=>{
    const pl = box(.24,1.16,.24, 0xfdfbf5,.07); pl.position.set(sd*1.0,.58,0); g.add(pl);
    const kb = sphere(.14, 0xef8fa5, 10);       kb.position.set(sd*1.0,1.22,0); g.add(kb);
    const board = box(.5,.38,.08, 0xfdfbf5,.05); board.position.set(sd*1.0,.86,.16); g.add(board);
    const paw = sphere(.1,0xf2a65a,10); paw.scale.set(1.05,.8,.35); paw.position.set(sd*1.0,.82,.22); g.add(paw);
    [[-.085,.1],[-.03,.15],[.03,.15],[.085,.1]].forEach(([px,py])=>{
      const toe = sphere(.035,0xf7c08a,8); toe.scale.set(1,1,.35); toe.position.set(sd*1.0+px,.86+py,.22); g.add(toe);
    });
  });
  return g;
}
/* พื้นคอก: กระเบื้องพาสเทลสลับ 2 เฉด (ให้ต่างจากหญ้า เห็นชัดว่าเป็นคอกที่จัดไว้อย่างดี) */
function buildPetPenFloor(w, d){
  const g = new THREE.Group();
  for(let z=0; z<d; z++) for(let x=0; x<w; x++){
    const t = box(.96,.06,.96, (x+z)%2 ? 0xf6efe2 : 0xeadfcd, .02);
    t.position.set(x - (w-1)/2, .03, z - (d-1)/2); g.add(t);
  }
  return g;
}
/* ของในคอก: บ้านหมา / ชามน้ำ-อาหาร / ตะกร้าของเล่น */
function buildPetPenProp(kind){
  const g = new THREE.Group();
  if(kind==='kennel'){
    const hs = box(.74,.56,.66,0xf7c08a,.07); hs.position.y = .28; g.add(hs);
    const rf1 = box(.58,.1,.72,0xef8fa5,.03); rf1.rotation.z = .62; rf1.position.set(-.18,.69,0); g.add(rf1);
    const rf2 = box(.58,.1,.72,0xef8fa5,.03); rf2.rotation.z = -.62; rf2.position.set(.18,.69,0); g.add(rf2);
    const hole = cyl(.17,.17,.14,0x8d6e63,12); hole.rotation.x = Math.PI/2; hole.position.set(0,.27,.34); g.add(hole);
    const flag = box(.28,.2,.04,0xfdfbf5,.03); flag.position.set(0,.92,0); g.add(flag);
  }else if(kind==='bowls'){
    [[-.24,0x7fc4e8,0x9ad9f0],[.24,0xef8fa5,0xd9a86c]].forEach(([ox,cOut,cIn])=>{
      const bw2 = cyl(.19,.15,.13,cOut,12); bw2.position.set(ox,.07,0); g.add(bw2);
      const inn = cyl(.15,.15,.04,cIn,12);  inn.position.set(ox,.14,0); g.add(inn);
    });
    const mat = box(.86,.03,.5,0xfdfbf5,.02); mat.position.y = .015; g.add(mat);
  }else{                                                   /* toys: ตะกร้าลูกบอล */
    const bk = cyl(.28,.24,.28,0xd9a86c,14); bk.position.y = .14; g.add(bk);
    const rim = torus(.28,.035,0xb4763a,14); rim.rotation.x = Math.PI/2; rim.position.y = .28; g.add(rim);
    [[-.1,.32,0x7fc4e8],[.09,.34,0xffd54f],[0,.44,0xef8fa5]].forEach(([ox,y,c])=>{
      const bl = sphere(.11,c,10); bl.position.set(ox,y,ox*.4); g.add(bl);
    });
    const bone = box(.3,.07,.09,0xfdfbf5,.03); bone.position.set(.3,.04,.28); bone.rotation.y = .4; g.add(bone);
  }
  return g;
}

    return {addChimney, addDoor, addRoofGable, addRoofHip, addShopEmblem, addShopFront, addWindowPair, buildGardenShop, buildMinimart, buildMusicShop, buildPetPenFencePiece, buildPetPenFloor, buildPetPenGate, buildPetPenProp, buildPetShop, buildRestaurant, buildSandwichSign, buildToyShop, musicNote};
  };
})();
