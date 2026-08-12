/* ============================================================
   บ้านของหนู — คลังเฟอร์นิเจอร์/ของตกแต่ง (เฟส 3)
   สร้างด้วยโค้ด (procedural, primitives) สไตล์ blocky/voxel + toon เดียวกับตัวละคร/สัตว์
   ไฟล์นี้ประกาศ global HOUSE_FURNITURE(kit) คืน catalog ให้ js/house.js เรียกใช้
   (โหลดหลัง app.js ก่อน house.js — ไม่แตะ DOM/ตัวแปร app เอง มีแค่ factory เดียว)

   แต่ละชิ้น (item):
     id      รหัสไม่ซ้ำ (ผูก save/inventory)
     name    ชื่อไทยโชว์ในกล่องเลือก
     cat     หมวด (ผูกแท็บในกล่อง edit)
     scope   'in' | 'out'  (โชว์เฉพาะฉากที่ตรงกัน)
     emoji   ไอคอนย่อในกล่องเลือก
     fw, fd  ขนาดฐาน (ช่อง) ตอน rot 0  (กว้างแกน x × ลึกแกน z) ค่าปริยาย 1×1
     block   บล็อกทางเดินไหม (ปริยาย true; พรม/ทางเดิน = false เดินผ่านได้)
     colors  พาเลตต์สี (ถ้ามี) — ชิ้นเดียวเลือกได้หลายสี, index 0 = ปริยาย
     action  ชนิด interaction ('sit'|'sleep'|'bounce'|'spin'|'toggle') ปริยาย 'bounce'
     leafy   แตะแล้วมีใบไม้ร่วง (ต้นไม้/พุ่ม) · leafyTall = ต้นสูง ใบร่วงจากที่สูงและเยอะกว่า
     flat    เป็น "พื้น" ไม่ใช่ของเล่น (แผ่นทางเดิน) — แตะแล้วเดินไปตรงนั้นเหมือนแตะพื้นปกติ
     sit     {dz,dx,ry,sy} จุดที่เด็กไปยืน/นั่งสัมพัทธ์กับชิ้น (สำหรับ action sit/sleep)
     build(g, col, k)  ใส่ meshes ลง group g (หันหน้าไป +z, กึ่งกลางที่ origin,
                        ขนาดพอดี fw×fd ช่อง ช่องละ 1 หน่วย)
   ============================================================ */
(function(){
  'use strict';

  window.HOUSE_FURNITURE = function(k){
    const T = k.THREE;
    const box = k.box, ball = k.ball, cyl = k.cyl, cone = k.cone, torus = k.torus;
    const mat = k.mat, shade = k.shade;

    /* พาเลตต์สีร่วม */
    const WOOD   = [0xc98d4e, 0xe0b878, 0x9c6238, 0xd7a86e, 0xb5835a];
    const FABRIC = [0xef9a9a, 0xffcc80, 0xa5d6a7, 0x90caf9, 0xce93d8, 0xf48fb1, 0xb0bec5, 0xfff59d];
    const SOFT   = [0x90caf9, 0xf48fb1, 0xa5d6a7, 0xffcc80, 0xce93d8, 0xffab91];
    const BRIGHT = [0xef5350, 0xffa726, 0xffd54f, 0x66bb6a, 0x42a5f5, 0xab47bc, 0xf06292, 0x26c6da];
    const GREEN  = [0x66bb6a, 0x4caf50, 0x81c784, 0x9ccc65];
    const PLASTIC= [0xff7043, 0x42a5f5, 0xffca28, 0x66bb6a, 0xab47bc, 0xec407a];

    /* helper: ขาเฟอร์นิเจอร์ 4 ขา */
    function legs(g, w, d, h, hex, r){
      r = r || .04;
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{
        const L = cyl(r, r, h, hex, 8);
        L.position.set(sx*w, h/2, sz*d);
        g.add(L);
      });
    }
    /* helper: หมอน/เบาะ box มน */
    function cushion(w,h,d,hex){ return box(w,h,d,hex, Math.min(w,h,d)*.4); }

    const items = [
      /* ============ ในบ้าน — ที่นั่ง ============ */
      { id:'chair', name:'เก้าอี้', cat:'seat', scope:'in', emoji:'🪑', colors:WOOD,
        action:'sit', sit:{sy:.55},
        build(g,col,k){
          const seat = box(.6,.1,.6,col,.05); seat.position.y=.5; g.add(seat);
          legs(g,.24,.24,.5,shade(col,.8));
          const back = box(.6,.55,.1,col,.05); back.position.set(0,.78,-.25); g.add(back);
        } },
      { id:'stool', name:'ม้านั่งเตี้ย', cat:'seat', scope:'in', emoji:'🟤', colors:PLASTIC,
        action:'sit', sit:{sy:.46},
        build(g,col){
          const seat = cyl(.28,.3,.12,col,16); seat.position.y=.4; g.add(seat);
          legs(g,.2,.2,.4,shade(col,.78),.035);
        } },
      { id:'sofa', name:'โซฟา', cat:'seat', scope:'in', emoji:'🛋️', fw:2, fd:1, colors:SOFT,
        action:'sit', sit:{sy:.55},
        build(g,col){
          const base = box(1.8,.35,.85,col,.12); base.position.y=.3; g.add(base);
          const back = box(1.8,.55,.2,col,.1); back.position.set(0,.62,-.32); g.add(back);
          [-1,1].forEach(s=>{ const arm=box(.2,.4,.85,shade(col,1.08),.09); arm.position.set(s*.8,.5,0); g.add(arm); });
          [-.45,.45].forEach(x=>{ const c=cushion(.75,.16,.7,shade(col,1.12)); c.position.set(x,.5,.04); g.add(c); });
        } },
      { id:'armchair', name:'เก้าอี้นวม', cat:'seat', scope:'in', emoji:'💺', colors:SOFT,
        action:'sit', sit:{sy:.55},
        build(g,col){
          const base=box(.85,.35,.8,col,.12); base.position.y=.3; g.add(base);
          const back=box(.85,.55,.18,col,.1); back.position.set(0,.62,-.3); g.add(back);
          [-1,1].forEach(s=>{ const arm=box(.16,.38,.8,shade(col,1.08),.08); arm.position.set(s*.38,.5,0); g.add(arm); });
          const cu=cushion(.7,.16,.66,shade(col,1.12)); cu.position.set(0,.5,.04); g.add(cu);
        } },
      { id:'beanbag', name:'เก้าอี้ถุงถั่ว', cat:'seat', scope:'in', emoji:'🫘', colors:BRIGHT,
        action:'sit', sit:{sy:.42},
        build(g,col){
          const b=ball(.42,col,12); b.scale.set(1,.72,1); b.position.y=.32; g.add(b);
          const top=ball(.3,shade(col,1.1),12); top.scale.set(1,.6,1); top.position.y=.5; g.add(top);
        } },

      /* ============ ในบ้าน — โต๊ะ ============ */
      { id:'table', top:.78, name:'โต๊ะอาหาร', cat:'table', scope:'in', emoji:'🍽️', fw:2, fd:2, colors:WOOD,
        build(g,col){
          const top=box(1.7,.12,1.7,col,.05); top.position.y=.72; g.add(top);
          legs(g,.72,.72,.72,shade(col,.82),.06);
        } },
      { id:'coffee-table', top:.45, name:'โต๊ะกลาง', cat:'table', scope:'in', emoji:'🪵', colors:WOOD,
        build(g,col){
          const top=box(.9,.1,.6,col,.05); top.position.y=.4; g.add(top);
          legs(g,.36,.22,.4,shade(col,.82),.045);
          const shelf=box(.8,.05,.5,shade(col,.9)); shelf.position.y=.16; g.add(shelf);
        } },
      { id:'desk', top:.8, name:'โต๊ะเขียนหนังสือ', cat:'table', scope:'in', emoji:'✏️', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const top=box(1.5,.1,.7,col,.04); top.position.y=.75; g.add(top);
          const side=box(.5,.75,.65,shade(col,.9),.04); side.position.set(-.5,.37,0); g.add(side);
          [[.6,-1],[.6,1]].forEach(([x,sz])=>{ const L=cyl(.05,.05,.75,shade(col,.82),8); L.position.set(x,.37,sz*.28); g.add(L); });
          const dr=box(.44,.5,.55,shade(col,1.08),.03); dr.position.set(-.5,.5,.02); g.add(dr);
        } },
      { id:'side-table', top:.55, name:'โต๊ะข้างเตียง', cat:'table', scope:'in', emoji:'🛎️', colors:WOOD,
        build(g,col){
          const top=box(.5,.09,.5,col,.04); top.position.y=.5; g.add(top);
          const body=box(.42,.42,.42,shade(col,1.05),.04); body.position.y=.26; g.add(body);
          const dr=box(.36,.14,.02,shade(col,.85)); dr.position.set(0,.3,.22); g.add(dr);
          const kn=ball(.03,0xffd54f,8); kn.position.set(0,.3,.24); g.add(kn);
        } },

      /* ============ ในบ้าน — ห้องนอน ============ */
      { id:'bed', name:'เตียงนอน', cat:'bed', scope:'in', emoji:'🛏️', fw:2, fd:2, colors:SOFT,
        action:'sleep', sit:{dz:-.3, ry:0, sy:.55, sleepOff:.75},   /* เลื่อนตัวไปทางปลายเตียง หัวมาพักบนหมอน ขาใกล้ปลายเตียง */
        build(g,col){
          const frame=box(1.7,.3,1.9,shade(0xc98d4e,.95),.06); frame.position.y=.2; g.add(frame);
          const mat_=box(1.55,.22,1.7,0xfdfdf8,.06); mat_.position.set(0,.42,.05); g.add(mat_);
          const blanket=box(1.55,.14,1.05,col,.06); blanket.position.set(0,.5,.35); g.add(blanket);
          const pillow=cushion(1.3,.16,.4,0xffffff); pillow.position.set(0,.5,-.6); g.add(pillow);
          const head=box(1.7,.6,.14,shade(0xc98d4e,.88),.05); head.position.set(0,.5,-.9); g.add(head);
        } },
      /* เตียงเดี่ยว — ทรงเดียวกับ 'bed' เป๊ะ แค่แคบลงเหลือ 1 ช่อง (นอนได้จริงเหมือนกัน)
         ⚠ id ยังเป็น 'crib' ตามเดิม ห้ามเปลี่ยน — ผูกกับ save/สิทธิ์ของเด็กที่มีอยู่แล้ว
         (เดิมเป็น "เตียงเด็ก" มีซี่กรงแบบเตียงเด็กอ่อน ผู้ใช้ขอเปลี่ยนเป็นเตียงปกติเมื่อ 2026-08-07) */
      { id:'crib', name:'เตียงเดี่ยว', cat:'bed', scope:'in', emoji:'🛌', fw:1, fd:2, colors:SOFT,
        action:'sleep', sit:{dz:-.3, ry:0, sy:.55, sleepOff:.75},
        build(g,col){
          const frame=box(.85,.3,1.9,shade(0xc98d4e,.95),.06); frame.position.y=.2; g.add(frame);
          const mat_=box(.72,.22,1.7,0xfdfdf8,.06); mat_.position.set(0,.42,.05); g.add(mat_);
          const blanket=box(.72,.14,1.05,col,.06); blanket.position.set(0,.5,.35); g.add(blanket);
          const pillow=cushion(.58,.16,.4,0xffffff); pillow.position.set(0,.5,-.6); g.add(pillow);
          const head=box(.85,.6,.14,shade(0xc98d4e,.88),.05); head.position.set(0,.5,-.9); g.add(head);
        } },
      { id:'wardrobe', wall:true, name:'ตู้เสื้อผ้า', cat:'bed', scope:'in', emoji:'🚪', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const body=box(1.5,1.9,.6,col,.05); body.position.y=.95; g.add(body);
          [-1,1].forEach(s=>{ const dr=box(.68,1.7,.04,shade(col,1.08),.03); dr.position.set(s*.38,.95,.31); g.add(dr);
            const kn=ball(.04,0xffd54f,8); kn.position.set(s*.08,.95,.34); g.add(kn); });
        } },
      { id:'nightstand', wall:true, top:.6, name:'ตู้หัวเตียง', cat:'bed', scope:'in', emoji:'💡', colors:WOOD,
        build(g,col){
          const body=box(.5,.6,.45,col,.04); body.position.y=.3; g.add(body);
          [.42,.18].forEach(y=>{ const dr=box(.42,.16,.02,shade(col,1.1)); dr.position.set(0,y,.24); g.add(dr);
            const kn=ball(.03,0xffd54f,8); kn.position.set(0,y,.26); g.add(kn); });
        } },

      /* ============ ในบ้าน — ครัว ============ */
      { id:'fridge', wall:true, name:'ตู้เย็น', cat:'kitchen', scope:'in', emoji:'🧊', colors:[0xeceff1,0xef9a9a,0x90caf9,0xa5d6a7,0xffcc80],
        action:'toggle',
        build(g,col){
          const body=box(.7,1.7,.7,col,.06); body.position.y=.85; g.add(body);
          const line=box(.72,.03,.72,shade(col,.8)); line.position.y=1.05; g.add(line);
          [1.35,.6].forEach(y=>{ const h=box(.04,.28,.04,0xb0bec5); h.position.set(.28,y,.37); g.add(h); });
        } },
      { id:'stove', wall:true, name:'เตา', cat:'kitchen', scope:'in', emoji:'🍳', colors:[0xeceff1,0x455a64,0xef9a9a],
        action:'toggle',
        build(g,col){
          const body=box(.7,.85,.65,col,.05); body.position.y=.42; g.add(body);
          const top=box(.72,.06,.67,shade(col,.85)); top.position.y=.87; g.add(top);
          [[-.15,-.12],[.15,-.12],[-.15,.15],[.15,.15]].forEach(([x,z])=>{ const b=cyl(.09,.09,.03,0x37474f,12); b.position.set(x,.91,z); g.add(b); });
          const oven=box(.5,.4,.02,0x263238,.03); oven.position.set(0,.4,.34); g.add(oven);
        } },
      { id:'sink', wall:true, name:'อ่างล้างจาน', cat:'kitchen', scope:'in', emoji:'🚰', colors:WOOD,
        build(g,col){
          const body=box(.8,.8,.6,col,.04); body.position.y=.4; g.add(body);
          const top=box(.84,.08,.64,0xeceff1); top.position.y=.82; g.add(top);
          const basin=box(.5,.12,.4,0xb0bec5,.04); basin.position.set(0,.8,0); g.add(basin);
          const tap=cyl(.03,.03,.28,0xcfd8dc,8); tap.position.set(0,.98,-.2); g.add(tap);
          const spout=box(.03,.03,.16,0xcfd8dc); spout.position.set(0,1.1,-.12); g.add(spout);
        } },
      { id:'counter', wall:true, top:.92, name:'เคาน์เตอร์ครัว', cat:'kitchen', scope:'in', emoji:'🧑‍🍳', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const body=box(1.5,.85,.6,col,.04); body.position.y=.42; g.add(body);
          const top=box(1.54,.09,.64,0xd7ccc8); top.position.y=.88; g.add(top);
          [-.5,0,.5].forEach(x=>{ const dr=box(.44,.5,.02,shade(col,1.08),.02); dr.position.set(x,.5,.31); g.add(dr);
            const kn=ball(.03,0xb0bec5,8); kn.position.set(x,.62,.33); g.add(kn); });
        } },

      /* ============ ในบ้าน — ห้องน้ำ ============ */
      { id:'toilet', name:'ชักโครก', cat:'bath', scope:'in', emoji:'🚽', colors:[0xfdfdf8,0xe1f5fe],
        action:'sit', sit:{sy:.5},
        build(g,col){
          const bowl=cyl(.24,.2,.35,col,16); bowl.position.y=.3; g.add(bowl);
          const seat=torus(.2,.06,0xffffff,10); seat.rotation.x=Math.PI/2; seat.position.y=.48; g.add(seat);
          const tank=box(.4,.4,.16,col,.04); tank.position.set(0,.6,-.28); g.add(tank);
          const btn=ball(.03,0xb0bec5,8); btn.position.set(0,.82,-.28); g.add(btn);
        } },
      { id:'bathtub', name:'อ่างอาบน้ำ', cat:'bath', scope:'in', emoji:'🛁', fw:2, fd:1, colors:[0xfdfdf8,0x90caf9,0xf48fb1],
        build(g,col){
          const body=box(1.6,.5,.75,col,.2); body.position.y=.35; g.add(body);
          const inner=box(1.3,.3,.5,0xb3e5fc,.15); inner.position.set(0,.45,0); g.add(inner);
          const tap=cyl(.03,.03,.2,0xcfd8dc,8); tap.position.set(-.7,.6,0); g.add(tap);
        } },
      { id:'bath-sink', wall:true, name:'อ่างล้างหน้า', cat:'bath', scope:'in', emoji:'🪥', colors:[0xfdfdf8,0xe1f5fe],
        build(g,col){
          const stand=cyl(.12,.14,.6,col,12); stand.position.y=.3; g.add(stand);
          const basin=cyl(.28,.18,.2,col,16); basin.position.y=.68; g.add(basin);
          const inner=cyl(.2,.12,.1,0xb3e5fc,16); inner.position.y=.74; g.add(inner);
          const mirror=box(.4,.5,.04,0xb3e5fc,.03); mirror.position.set(0,1.25,-.16); g.add(mirror);
          const frame=box(.46,.56,.02,shade(0xc98d4e,.9)); frame.position.set(0,1.25,-.18); g.add(frame);
        } },
      { id:'shower', wall:true, name:'ฝักบัว', cat:'bath', scope:'in', emoji:'🚿', colors:[0xb3e5fc,0xc8e6c9,0xffe0b2],
        action:'toggle',
        build(g,col){
          const tray=box(.8,.1,.8,0xeceff1,.04); tray.position.y=.05; g.add(tray);
          [[-1,-1],[-1,1]].forEach(([sx,sz])=>{ const w=box(.06,1.8,.8,col,.02); w.position.set(sx*.37,.9,0); g.add(w); });
          const back=box(.8,1.8,.06,col,.02); back.position.set(0,.9,-.37); g.add(back);
          const pipe=cyl(.02,.02,.4,0xcfd8dc,8); pipe.position.set(0,1.6,-.3); g.add(pipe);
          const head=cyl(.09,.06,.06,0xcfd8dc,12); head.position.set(0,1.4,-.18); g.add(head);
        } },

      /* ============ ในบ้าน — ตกแต่ง ============ */
      { id:'plant', stack:true, name:'ต้นไม้กระถาง', cat:'decor', scope:'in', emoji:'🪴', colors:[0xe57373,0xff8a65,0xba68c8,0x4db6ac],
        build(g,col){
          const pot=cyl(.2,.15,.28,col,14); pot.position.y=.14; g.add(pot);
          const soil=cyl(.18,.18,.04,0x6d4c41,14); soil.position.y=.28; g.add(soil);
          [[.0,.55,.0,.26],[.14,.42,.05,.2],[-.13,.46,.06,.18],[.05,.66,-.08,.16]].forEach(([x,y,z,r])=>{
            const leaf=ball(r,0x66bb6a,8); leaf.scale.set(.7,1.3,.7); leaf.position.set(x,y,z); g.add(leaf); });
        } },
      { id:'floor-lamp', name:'โคมไฟตั้งพื้น', cat:'decor', scope:'in', emoji:'🛋️', colors:[0xfff59d,0xffcc80,0xf48fb1,0x90caf9],
        action:'toggle', light:{y:1.4, color:0xfff2c0, dist:4.2, intensity:1.0},
        build(g,col){
          const base=cyl(.18,.2,.05,0x9e9e9e,16); base.position.y=.03; g.add(base);
          const pole=cyl(.03,.03,1.3,0xb0bec5,8); pole.position.y=.7; g.add(pole);
          const shade_=cyl(.26,.18,.32,col,16); shade_.position.y=1.4; shade_.userData.bulb=true; g.add(shade_);
        } },
      { id:'table-lamp', stack:true, name:'โคมไฟตั้งโต๊ะ', cat:'decor', scope:'in', emoji:'💡', colors:[0xfff59d,0xffcc80,0xf48fb1,0x90caf9],
        action:'toggle', light:{y:.42, color:0xfff2c0, dist:2.6, intensity:.7},
        build(g,col){
          const base=cyl(.12,.14,.06,0x9e9e9e,14); base.position.y=.03; g.add(base);
          const pole=cyl(.02,.02,.3,0xb0bec5,8); pole.position.y=.2; g.add(pole);
          const shade_=cyl(.18,.12,.2,col,14); shade_.position.y=.42; shade_.userData.bulb=true; g.add(shade_);
        } },
      { id:'tv', wall:true, name:'โทรทัศน์', cat:'decor', scope:'in', emoji:'📺', fw:2, fd:1, colors:WOOD,
        action:'toggle',
        build(g,col){
          const stand=box(1.4,.4,.45,col,.04); stand.position.y=.2; g.add(stand);
          const screen=box(1.1,.66,.08,0x263238,.03); screen.position.set(0,.85,-.02); g.add(screen);
          const disp=box(1.0,.56,.02,0x4dd0e1,.02); disp.position.set(0,.85,.04); g.add(disp);
        } },
      { id:'bookshelf', name:'ชั้นหนังสือ', cat:'decor', scope:'in', emoji:'📚', colors:WOOD, wall:true,
        build(g,col){
          const W=.9, H=1.6, D=.36, t=.05;
          /* หลังตู้ + ข้าง 2 ด้าน (เปิดหน้าไป +z) */
          const back=box(W,H,t,shade(col,.88)); back.position.set(0,H/2,-D/2+t/2); g.add(back);
          [-1,1].forEach(s=>{ const side=box(t,H,D,col,.02); side.position.set(s*(W/2-t/2),H/2,0); g.add(side); });
          /* แผ่นชั้น 4 ระดับ (บน/กลาง 2/ล่าง) แบ่งเป็น 3 ช่อง */
          const lv=[.06,.56,1.06,1.56];
          lv.forEach(y=>{ const sh=box(W-2*t,t,D-t,shade(col,1.06)); sh.position.set(0,y,t/2); g.add(sh); });
          /* หนังสือวางตั้งในแต่ละช่อง */
          const bc=[0xef5350,0xffa726,0xffd54f,0x66bb6a,0x42a5f5,0xab47bc,0xf06292,0x26c6da];
          for(let li=0; li<3; li++){
            const baseY=lv[li]+t/2, gap=(lv[li+1]-lv[li])-t;
            let x=-W/2+t+.04, idx=li*3;
            while(x < W/2-t-.07){
              const bw=.06+(idx%3)*.018, bh=Math.min(.42,gap*.9)*(.82+(idx%4)*.05);
              const bk=box(bw,bh,D*.6,bc[idx%bc.length]);
              bk.position.set(x+bw/2, baseY+bh/2, .04);
              if(idx%6===5){ bk.rotation.z=.2; bk.position.x+=.02; }
              g.add(bk); x+=bw+.012; idx++;
            }
          }
        } },
      { id:'wall-clock', wall:true, name:'นาฬิกาแขวน', cat:'decor', scope:'in', emoji:'🕐', block:false, colors:[0xffd54f,0xef9a9a,0x90caf9],
        build(g,col,k){
          const face=cyl(.28,.28,.08,0xfffde7,20); face.rotation.x=Math.PI/2; face.position.y=1.4; g.add(face);
          const rim=torus(.28,.04,col,20); rim.position.y=1.4; g.add(rim);
          for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; const tk=ball(.018,0x90a4ae,5);
            tk.position.set(Math.cos(a)*.21,1.4+Math.sin(a)*.21,.05); g.add(tk); }
          const hm=new k.THREE.Group(); hm.position.set(0,1.4,.05); g.add(hm);      /* เข็มยาว — เดินจริง */
          hm.userData.anim={kind:'spin', axis:'z', sp:-.12};
          const hmB=box(.03,.17,.02,0x37474f); hmB.position.y=.085; hm.add(hmB);
          const hh=new k.THREE.Group(); hh.position.set(0,1.4,.055); g.add(hh);     /* เข็มสั้น — เดินช้ากว่า 12 เท่า */
          hh.userData.anim={kind:'spin', axis:'z', sp:-.01};
          const hhB=box(.035,.11,.02,0x546e7a); hhB.position.y=.055; hh.add(hhB);
          const pin=ball(.03,0xffd54f,8); pin.position.set(0,1.4,.07); g.add(pin);
        } },
      { id:'toy-box', name:'กล่องของเล่น', cat:'decor', scope:'in', emoji:'🧸', colors:BRIGHT,
        build(g,col){
          const body=box(.7,.5,.5,col,.05); body.position.y=.25; g.add(body);
          const lid=box(.74,.1,.54,shade(col,1.1),.05); lid.position.y=.55; g.add(lid);
          const bear=ball(.12,0xa1887f,10); bear.position.set(0,.72,0); g.add(bear);
          [-1,1].forEach(s=>{ const ear=ball(.05,0xa1887f,8); ear.position.set(s*.08,.82,0); g.add(ear); });
        } },
      { id:'rug', name:'พรมกลม', cat:'decor', scope:'in', emoji:'🟣', block:false, fw:2, fd:2, colors:FABRIC,
        build(g,col){
          const r1=cyl(.9,.9,.03,col,24); r1.position.y=.02; g.add(r1);
          const r2=cyl(.62,.62,.04,shade(col,1.12),24); r2.position.y=.03; g.add(r2);
        } },

      /* ============ นอกบ้าน — สวน/ต้นไม้ ============ */
      { id:'tree-round', leafy:true, leafyTall:true, name:'ต้นไม้กลม', cat:'garden', scope:'out', emoji:'🌳', colors:GREEN,
        build(g,col){
          const trunk=cyl(.14,.18,1.0,0x9c6238,8); trunk.position.y=.5; g.add(trunk);
          const f1=ball(.6,col,12); f1.position.y=1.3; g.add(f1);
          const f2=ball(.4,shade(col,1.1),10); f2.position.set(.35,1.1,.2); g.add(f2);
          const f3=ball(.35,shade(col,.9),10); f3.position.set(-.32,1.15,-.16); g.add(f3);
        } },
      /* ต้นไม้ใหญ่แบบในฉาก (สูงสุ่มตามพิกัด + ดอกขาว) — ใช้กับต้นไม้เดิมในสนามที่ย้ายได้ */
      { id:'tree', leafy:true, leafyTall:true, name:'ต้นไม้ใหญ่', cat:'garden', scope:'out', emoji:'🌴', colors:GREEN,
        build(g,col,k,rec){
          const rnd = rec ? (((rec.x*73 + rec.z*151 + 37)%100)/100) : .5;
          const th = .8+rnd*.95, fs = .85+rnd*.3;
          const trunk=cyl(.13,.17,th,0x9c6238,8); trunk.position.y=th/2; g.add(trunk);
          const f1=ball(.56*fs,col,12); f1.position.y=th+.42*fs; g.add(f1);
          const f2=ball(.4*fs,shade(col,1.08),10); f2.position.set(.32*fs,th+.16,.2*fs); g.add(f2);
          const f3=ball(.33*fs,shade(col,.92),10); f3.position.set(-.3*fs,th+.22,-.16*fs); g.add(f3);
          const b1=ball(.07,0xffffff,6); b1.position.set(.22*fs,th+.86*fs,.3*fs); g.add(b1);
          const b2=ball(.055,0xffffff,6); b2.position.set(-.32*fs,th+.56*fs,.34*fs); g.add(b2);
        } },
      { id:'pine', leafy:true, leafyTall:true, name:'ต้นสน', cat:'garden', scope:'out', emoji:'🌲', colors:[0x388e3c,0x2e7d32,0x43a047],
        build(g,col){
          const trunk=cyl(.12,.15,.5,0x795548,8); trunk.position.y=.25; g.add(trunk);
          [[.7,.6,.55],[.55,1.05,.45],[.4,1.45,.35]].forEach(([r,y,h])=>{ const c=cone(r,h*1.6,col,10); c.position.y=y; g.add(c); });
        } },
      { id:'bush', leafy:true, name:'พุ่มไม้', cat:'garden', scope:'out', emoji:'🌿', colors:GREEN,
        build(g,col){
          [[0,.28,0,.34],[.28,.24,.05,.26],[-.26,.26,-.04,.24],[.05,.36,-.2,.22]].forEach(([x,y,z,r])=>{
            const b=ball(r,col,10); b.scale.set(1,.85,1); b.position.set(x,y,z); g.add(b); });
        } },
      { id:'flowerbed', name:'แปลงดอกไม้', cat:'garden', scope:'out', emoji:'🌷', colors:[0xf48fb1,0xffd54f,0xba68c8,0xff8a65],
        build(g,col){
          const soil=box(.85,.18,.85,0x795548,.04); soil.position.y=.09; g.add(soil);
          const grid=[[-.24,-.24],[.24,-.24],[0,0],[-.24,.24],[.24,.24]];
          grid.forEach(([x,z],i)=>{ const stem=cyl(.02,.02,.22,0x66bb6a,6); stem.position.set(x,.3,z); g.add(stem);
            const bl=ball(.09,i%2?col:shade(col,1.15),8); bl.position.set(x,.44,z); g.add(bl);
            const ct=ball(.04,0xfff59d,6); ct.position.set(x,.46,z); g.add(ct); });
        } },
      { id:'mushroom', name:'เห็ดยักษ์', cat:'garden', scope:'out', emoji:'🍄', colors:[0xef5350,0xffca28,0x8d6e63,0xba68c8],
        action:'bounce',
        build(g,col){
          const stem=cyl(.13,.16,.4,0xfff8e1,12); stem.position.y=.2; g.add(stem);
          const cap=ball(.32,col,14); cap.scale.set(1,.62,1); cap.position.y=.46; g.add(cap);
          [[.14,.52,.1],[-.16,.5,-.06],[.02,.56,-.16],[-.1,.53,.15]].forEach(([x,y,z])=>{ const d=ball(.05,0xffffff,8); d.position.set(x,y,z); g.add(d); });
        } },
      { id:'topiary', leafy:true, name:'พุ่มตัดกลม', cat:'garden', scope:'out', emoji:'🎍', colors:GREEN,
        build(g,col){
          const pot=cyl(.22,.17,.28,0xd7a86e,14); pot.position.y=.14; g.add(pot);
          const b1=ball(.28,col,12); b1.position.y=.6; g.add(b1);
          const b2=ball(.22,shade(col,1.1),12); b2.position.y=.95; g.add(b2);
        } },

      /* ============ นอกบ้าน — เครื่องเล่น ============ */
      { id:'swing', name:'ชิงช้า', cat:'play', scope:'out', emoji:'🎡', fw:2, fd:1, colors:PLASTIC,
        action:'sit', sit:{sy:.5}, rock:true,
        build(g,col,k){
          const T = k.THREE;
          /* โครง (อยู่กับที่) */
          [-1,1].forEach(s=>{ const bar=cyl(.05,.05,1.9,col,8); bar.position.set(s*.75,.9,0); bar.rotation.z=s*.28; g.add(bar); });
          const top=cyl(.05,.05,1.5,col,8); top.rotation.z=Math.PI/2; top.position.y=1.65; g.add(top);
          /* ส่วนที่โยกได้: เชือก+ที่นั่ง ห้อยจาก pivot ที่คานบน (y=1.65) */
          const piv = new T.Group(); piv.position.set(0,1.65,0); piv.userData.swingPivot = true; g.add(piv);
          [-1,1].forEach(s=>{ const rope=cyl(.015,.015,1.1,0x8d6e63,6); rope.position.set(s*.22,1.0-1.65,0); piv.add(rope); });
          const seat=box(.6,.06,.24,0xffca28,.03); seat.position.set(0,.45-1.65,0); piv.add(seat);
          const anc = new T.Group(); anc.position.set(0,.45-1.65,0); anc.userData.swingSeat = true; piv.add(anc);
        } },
      { id:'slide', name:'สไลเดอร์', cat:'play', scope:'out', emoji:'🛝', fw:1, fd:2, colors:PLASTIC,
        /* แตะแล้วเด็กปีนขึ้นชานแล้วลื่นลงจริง (ใช้ท่าเดียวกับสไลเดอร์ในสนามเด็กเล่น)
           slide = จุดขึ้น/จุดลงในพิกัดของชิ้นเอง — ดู startSlideRide ใน js/house.js */
        action:'slide', slide:{climbZ:-.62, climbY:1.02, botZ:1.15, botY:.02},
        build(g,col){
          const platY = .95;
          /* ชานบันไดด้านบน (ฝั่ง -z) */
          const plat = box(.62,.1,.55,col,.05); plat.position.set(0,platY,-.62); g.add(plat);
          /* เสาขาชาน 4 ต้น */
          [[-.24,-.85],[.24,-.85],[-.24,-.42],[.24,-.42]].forEach(([x,z])=>{
            const L=cyl(.045,.045,platY,shade(col,.8),8); L.position.set(x,platY/2,z); g.add(L); });
          /* บันไดปีน: รางข้าง 2 + ขั้น 3 (ฝั่ง -z สุด) */
          [-1,1].forEach(s=>{ const r=cyl(.032,.032,.95,0xffd54f,8); r.position.set(s*.24,.5,-.92); g.add(r); });
          for(let i=0;i<3;i++){ const rung=cyl(.028,.028,.5,shade(0xffd54f,.9),8); rung.rotation.z=Math.PI/2; rung.position.set(0,.28+i*.3,-.92); g.add(rung); }
          /* รางลื่นเอียงลง: ปลายสูงอยู่ฝั่งชาน (-z) ลาดลงไปพื้นฝั่ง +z */
          const slide=box(.5,.07,1.6,0x42a5f5,.06); slide.position.set(0,.52,.2); slide.rotation.x=.62; g.add(slide);
          [-1,1].forEach(s=>{ const rail=box(.06,.17,1.6,shade(0x42a5f5,.82),.04); rail.position.set(s*.27,.63,.2); rail.rotation.x=.62; g.add(rail); });
          /* ขอบล่างสุดของราง (ที่ปลายพื้น) */
          const lip=box(.5,.06,.28,0x42a5f5,.05); lip.position.set(0,.06,.98); g.add(lip);
        } },
      { id:'sandbox', name:'บ่อทราย', cat:'play', scope:'out', emoji:'🏖️', fw:2, fd:2, colors:[0xffd54f,0x8d6e63,0x4db6ac],
        action:'bounce',
        build(g,col){
          const sand=box(1.7,.14,1.7,0xffe082,.04); sand.position.y=.1; g.add(sand);
          [[-1,0],[1,0],[0,-1],[0,1]].forEach(([sx,sz])=>{ const w=box(sx?.14:1.85,.24,sz?1.85:.14,col,.04); w.position.set(sx*.9,.14,sz*.9); g.add(w); });
          const pail=cyl(.12,.09,.16,0xef5350,12); pail.position.set(.4,.24,.4); g.add(pail);
        } },
      { id:'seesaw', name:'ไม้กระดก', cat:'play', scope:'out', emoji:'🎢', fw:2, fd:1, colors:PLASTIC,
        action:'bounce',
        build(g,col){
          const pivot=cyl(.12,.16,.4,shade(col,.8),12); pivot.position.y=.2; g.add(pivot);
          const plank=box(1.8,.1,.28,col,.04); plank.position.y=.42; plank.rotation.z=.12; g.add(plank);
          [-1,1].forEach(s=>{ const h=cyl(.03,.03,.2,0xffd54f,8); h.position.set(s*.7,.55,0); g.add(h); });
        } },
      { id:'trampoline', name:'แทรมโพลีน', cat:'play', scope:'out', emoji:'🤸', fw:2, fd:2, colors:[0x42a5f5,0x66bb6a,0xef5350],
        action:'bounce',
        build(g,col){
          /* ⚠ torus() คืนวงที่ "ตั้งฉาก" (TorusGeometry อยู่บนระนาบ XY) ⇒ ห่วงที่ต้องวางแบน
             ต้อง rotation.x=Math.PI/2 เสมอ — เดิมลืมใส่ ขอบแทรมโพลีนเลยตั้งขึ้นเหมือนล้อรถคาเบาะ */
          const ring=torus(.75,.08,col,20); ring.rotation.x=Math.PI/2; ring.position.y=.5; g.add(ring);
          const mat_=cyl(.7,.7,.04,0x37474f,24); mat_.position.y=.5; g.add(mat_);
          for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; const L=cyl(.04,.04,.5,shade(col,.8),8); L.position.set(Math.cos(a)*.7,.25,Math.sin(a)*.7); g.add(L); }
        } },

      /* ============ นอกบ้าน — ที่นั่งสนาม ============ */
      { id:'bench', name:'ม้านั่งสวน', cat:'seatout', scope:'out', emoji:'🪑', fw:2, fd:1, colors:WOOD,
        action:'sit', sit:{sy:.52},
        build(g,col){
          const seat=box(1.5,.1,.5,col,.04); seat.position.y=.48; g.add(seat);
          const back=box(1.5,.4,.08,col,.03); back.position.set(0,.72,-.2); g.add(back);
          [-1,1].forEach(s=>{ const L=box(.1,.48,.44,shade(col,.8),.03); L.position.set(s*.68,.24,0); g.add(L); });
        } },
      { id:'picnic', name:'โต๊ะปิกนิก', cat:'seatout', scope:'out', emoji:'⛱️', fw:2, fd:2, colors:WOOD,
        action:'sit', sit:{dz:.62, ry:Math.PI, sy:.46},
        build(g,col){
          const top=box(1.4,.1,.7,col,.04); top.position.y=.72; g.add(top);
          [-1,1].forEach(s=>{ const leg=box(.1,.72,.7,shade(col,.82),.03); leg.position.set(s*.5,.36,0); leg.rotation.z=s*.1; g.add(leg);
            const bench=box(1.5,.08,.28,shade(col,1.05),.03); bench.position.set(0,.42,s*.62); g.add(bench); });
        } },
      { id:'garden-stool', name:'ตอไม้นั่ง', cat:'seatout', scope:'out', emoji:'🪵', colors:[0xa1887f,0x8d6e63,0xbcaaa4],
        action:'sit', sit:{sy:.46},
        build(g,col){
          const trunk=cyl(.28,.3,.42,col,14); trunk.position.y=.21; g.add(trunk);
          const top=cyl(.29,.29,.04,shade(col,1.15),14); top.position.y=.44; g.add(top);
          const ring=torus(.18,.015,shade(col,.8),16); ring.rotation.x=Math.PI/2; ring.position.y=.46; g.add(ring);
        } },

      /* ============ นอกบ้าน — ตกแต่งสนาม ============ */
      { id:'lamp-post', name:'เสาไฟ', cat:'decorout', scope:'out', emoji:'🏮', colors:[0x37474f,0x5d4037,0x1b5e20],
        action:'toggle', light:{y:1.85, color:0xfff2b0, dist:5.5, intensity:1.2},
        build(g,col){
          const base=cyl(.16,.2,.14,col,12); base.position.y=.07; g.add(base);
          const pole=cyl(.05,.05,1.7,col,8); pole.position.y=.9; g.add(pole);
          const lamp=box(.28,.32,.28,0xfff59d,.06); lamp.position.y=1.85; lamp.userData.bulb=true; g.add(lamp);
          const cap=cone(.22,.14,col,4); cap.position.y=2.06; g.add(cap);
        } },
      /* น้ำพุ — เพิ่มน้ำพุ่งจริง (2026-08-03): ลำน้ำยืด-หดตลอดเวลา + หยดน้ำเด้ง 4 หยดรอบจาน + ผิวน้ำในอ่างกระเพื่อม
         ชิ้นที่ติด `userData.anim` จะถูก collectDecorAnim เก็บไปขยับใน updateDecorAnimParts (js/house.js) */
      { id:'fountain', name:'น้ำพุ', cat:'decorout', scope:'out', emoji:'⛲', fw:2, fd:2, colors:[0xb0bec5,0xd7ccc8,0x90a4ae],
        build(g,col){
          const basin=cyl(.85,.9,.34,col,20); basin.position.y=.17; g.add(basin);
          /* ขอบอ่างเป็น "วงแหวน" ไม่ใช่แผ่นกลมทึบ — ของเดิมเป็นแผ่นปิดเต็มหน้าตัด น้ำในอ่างเลยจมหายไปทั้งอ่าง */
          const rim=torus(.86,.07,shade(col,1.12),20); rim.rotation.x=Math.PI/2; rim.position.y=.34; g.add(rim);
          const water=cyl(.82,.82,.06,0x4dd0e1,20); water.position.y=.35;
          water.userData.anim={kind:'pulse', sp:.5, amp:.02, ph:0}; g.add(water);
          const pillar=cyl(.14,.2,.5,col,14); pillar.position.y=.6; g.add(pillar);
          const dish=cyl(.36,.3,.1,col,16); dish.position.y=.9; g.add(dish);
          const dishRim=torus(.34,.035,shade(col,1.12),16); dishRim.rotation.x=Math.PI/2; dishRim.position.y=.95; g.add(dishRim);
          const dishW=cyl(.3,.3,.05,0x4dd0e1,16); dishW.position.y=.955; g.add(dishW);
          /* สายน้ำ + ลูกกลมยอดต้อง ph เท่ากัน (ph:0) ไม่งั้น collectDecorAnim() แจกเฟสให้คนละค่า
             แล้วลูกกลมจะเด้งสวนทางกับสายน้ำ — ระยะ amp ตั้งให้ยอดสายน้ำจมอยู่ในลูกกลมตลอด */
          const jet=cyl(.05,.09,.5,0x7fd8e8,10); jet.position.y=1.24;
          jet.userData.anim={kind:'jet', sp:1, ph:0}; g.add(jet);
          const cap=ball(.1,0x9ae4f0,10); cap.position.y=1.36;
          cap.userData.anim={kind:'drop', sp:1, amp:.2, ph:0}; g.add(cap);
          [[.5,0],[-.5,0],[0,.5],[0,-.5]].forEach(([x,z],i)=>{      /* หยดน้ำโปรยจากขอบจานลงอ่าง */
            const d=ball(.06,0x9ae4f0,8); d.position.set(x,.66,z);
            d.userData.anim={kind:'drop', sp:1.3, amp:.22, ph:i*1.5}; g.add(d);
          });
        } },
      { id:'mailbox', name:'ตู้จดหมาย', cat:'decorout', scope:'out', emoji:'📪', colors:[0xef5350,0x42a5f5,0x66bb6a,0xffca28],
        build(g,col){
          const post=cyl(.05,.05,.7,0x8d6e63,8); post.position.y=.35; g.add(post);
          const boxm=box(.34,.28,.5,col,.08); boxm.position.set(0,.78,0); g.add(boxm);
          const flag=box(.03,.14,.1,0xffffff); flag.position.set(.18,.8,0); g.add(flag);
        } },
      { id:'birdhouse', name:'บ้านนก', cat:'decorout', scope:'out', emoji:'🐦', colors:[0xef9a9a,0x90caf9,0xa5d6a7,0xffcc80],
        action:'bounce',
        build(g,col){
          const post=cyl(.05,.06,1.2,0x8d6e63,8); post.position.y=.6; g.add(post);
          const body=box(.32,.34,.32,col,.04); body.position.y=1.35; g.add(body);
          const roof=cone(.32,.24,shade(col,.75),4); roof.rotation.y=Math.PI/4; roof.position.y=1.62; g.add(roof);
          const hole=cyl(.06,.06,.05,0x4e342e,10); hole.rotation.x=Math.PI/2; hole.position.set(0,1.35,.16); g.add(hole);
          const perch=cyl(.015,.015,.12,0x8d6e63,6); perch.rotation.x=Math.PI/2; perch.position.set(0,1.28,.24); g.add(perch);
        } },
      { id:'fence-seg', name:'รั้วไม้', cat:'decorout', scope:'out', emoji:'🚧', colors:[0xfdf1da,0xd7a86e,0xffffff,0xa5d6a7],
        build(g,col){
          /* เสาที่ขอบช่องทั้ง 2 ด้าน (±.5) + ราวยาวเต็มช่อง → วางต่อกันเป็นรั้วยาวไม่มีรอยขาด */
          [-.5,.5].forEach(px=>{ const post=box(.13,.62,.13,col,.05); post.position.set(px,.31,0); g.add(post);
            const cap=ball(.075, shade(col,.9),8); cap.position.set(px,.64,0); g.add(cap); });
          [.2,.44].forEach(y=>{ const rail=box(1.0,.08,.09, shade(col,.98),.04); rail.position.set(0,y,0); g.add(rail); });
        } },
      { id:'fence-corner', name:'มุมรั้ว', cat:'decorout', scope:'out', emoji:'🔲', colors:[0xfdf1da,0xd7a86e,0xffffff,0xa5d6a7],
        build(g,col){
          /* มุมรูปตัว L (rot 0 = ราวไป +x และ +z) เสากลาง + เสาปลายขอบ 2 ด้าน → ต่อกับรั้วตรงได้เนียน */
          const postAt=(x,z)=>{ const p=box(.13,.62,.13,col,.05); p.position.set(x,.31,z); g.add(p);
            const cap=ball(.075, shade(col,.9),8); cap.position.set(x,.64,z); g.add(cap); };
          postAt(0,0); postAt(.5,0); postAt(0,.5);
          [.2,.44].forEach(y=>{
            const rx=box(.5,.08,.09, shade(col,.98),.04); rx.position.set(.25,y,0); g.add(rx);   /* ครึ่งราวไป +x */
            const rz=box(.09,.08,.5, shade(col,.98),.04); rz.position.set(0,y,.25); g.add(rz);   /* ครึ่งราวไป +z */
          });
        } },
      /* action:'pethouse' — แตะแล้วสั่งสัตว์เลี้ยงเข้าไปนอนรอในบ้าน / แตะอีกครั้งเรียกออกมาเดินตาม (js/house.js) */
      { id:'pet-house', name:'บ้านสัตว์เลี้ยง', cat:'decorout', scope:'out', emoji:'🏠', action:'pethouse', colors:[0xe9bd80,0xef9a9a,0x90caf9,0xa5d6a7],
        build(g,col){
          const base=box(1.05,.75,.95, col, .08); base.position.y=.38; g.add(base);
          const RISE=.4, HALF=.66, DEP=1.1, roof=0xef8354;
          const len=Math.hypot(HALF,RISE), ang=Math.atan2(RISE,HALF);
          [1,-1].forEach(s=>{ const p=box(len,.12,DEP, roof, .04); p.rotation.z=-s*ang; p.position.set(s*HALF/2,.75+RISE/2,0); g.add(p); });
          const ridge=box(.13,.13,DEP+.04, 0xffe4c4, .05); ridge.position.set(0,.75+RISE,0); g.add(ridge);
          const doorH=cyl(.2,.2,.12,0x6d4530,16); doorH.rotation.x=Math.PI/2; doorH.position.set(0,.4,.48); g.add(doorH);
          const doorB=box(.4,.28,.12, 0x6d4530, .03); doorB.position.set(0,.22,.48); g.add(doorB);
        } },
      { id:'path', flat:true, name:'แผ่นทางเดิน', cat:'decorout', scope:'out', emoji:'🟫', block:false, colors:[0xe3ddd0,0xd8c9a8,0xcbb891,0xbca77e],
        build(g,col,k,rec){
          /* ขนาด+เอียงแบบแผ่นหินในฉาก (0.6×0.6 เอียงสลับ ±.35) */
          const tilt = rec ? (((rec.x+rec.z)%2) ? .35 : -.35) : .2;
          const s=box(.6,.07,.6,col,.03); s.position.y=.04; s.rotation.y=tilt; g.add(s);
        } },
      { id:'pond', name:'บ่อน้ำ', cat:'decorout', scope:'out', emoji:'🦆', block:false, fw:2, fd:2, colors:[0x4dd0e1,0x4fc3f7,0x81d4fa],
        build(g,col){
          const water=cyl(.85,.85,.06,col,24); water.position.y=.03;
          water.userData.anim={kind:'pulse', sp:.45, amp:.015}; g.add(water);   /* ผิวน้ำกระเพื่อมช้าๆ */
          const rim=torus(.85,.07,0x9e9e9e,24); rim.rotation.x=Math.PI/2; rim.position.y=.05; g.add(rim);   /* ขอบบ่อวางแบน (ลืม rotation.x เหมือนแทรมโพลีน) */
          const lily=cyl(.14,.14,.02,0x66bb6a,10); lily.position.set(.3,.07,.2);
          lily.userData.anim={kind:'bob', sp:.7, amp:.03}; g.add(lily);
          const flower=ball(.06,0xf48fb1,8); flower.position.set(.3,.1,.2);
          flower.userData.anim={kind:'bob', sp:.7, amp:.03}; g.add(flower);
        } },
      { id:'balloon', name:'ลูกโป่ง', cat:'decorout', scope:'out', emoji:'🎈', colors:BRIGHT,
        action:'bounce',
        build(g,col){
          const str=cyl(.008,.008,1.1,0x9e9e9e,4); str.position.y=.55; g.add(str);
          const b=ball(.28,col,14); b.scale.set(1,1.2,1); b.position.y=1.35; g.add(b);
          const knot=cone(.05,.08,shade(col,.85),6); knot.position.y=1.12; g.add(knot);
        } },
      { id:'gnome', name:'ตุ๊กตาคนแคระ', cat:'decorout', scope:'out', emoji:'🧙', colors:[0xef5350,0x42a5f5,0x66bb6a,0xffca28],
        action:'bounce',
        /* เดิมเป็นกรวย+ลูกกลม ไม่มีหน้าตา มองไกลๆ เหมือนหยดสีแดง (ปรับ 2026-08-03)
           ของใหม่: มีตา แก้มชมพู แขนสองข้าง รองเท้า เข็มขัด และหนวดเครายาวถึงอก */
        build(g,col){
          const boots=box(.3,.1,.22,shade(0x6d4c41,1),.04); boots.position.y=.05; g.add(boots);
          const body=cone(.26,.52,col,12); body.position.y=.3; g.add(body);
          const belt=cyl(.2,.22,.07,shade(col,.6),12); belt.position.y=.32; g.add(belt);
          const buckle=box(.09,.08,.04,0xffd54f,.02); buckle.position.set(0,.32,.19); g.add(buckle);
          [-1,1].forEach(s=>{ const arm=cyl(.05,.055,.24,col,7); arm.rotation.z=s*.85;
            arm.position.set(s*.22,.44,.06); g.add(arm);
            const hand=ball(.055,0xffd9b3,7); hand.position.set(s*.3,.35,.08); g.add(hand); });
          const head=ball(.17,0xffd9b3,12); head.position.y=.68; g.add(head);
          [-1,1].forEach(s=>{ const eye=ball(.028,0x3a2f28,7); eye.position.set(s*.07,.72,.15); g.add(eye);
            const ch=ball(.04,0xffb3a0,7); ch.scale.z=.5; ch.position.set(s*.12,.66,.13); g.add(ch); });
          const nose=ball(.05,0xffb27d,8); nose.position.set(0,.68,.17); g.add(nose);
          const beard=cone(.15,.34,0xfbf7f0,10); beard.rotation.x=Math.PI; beard.position.set(0,.52,.09); g.add(beard);
          const mous=ball(.07,0xfbf7f0,7); mous.scale.set(1.5,.6,.7); mous.position.set(0,.63,.15); g.add(mous);
          const hat=cone(.2,.46,shade(col,.75),12); hat.position.y=.98; g.add(hat);
          const brim=cyl(.19,.19,.05,shade(col,.75),12); brim.position.y=.79; g.add(brim);
        } },
      { id:'stone-path', flat:true, name:'ทางเดินหิน', cat:'decorout', scope:'out', emoji:'🪨', block:false, colors:[0xbcaaa4,0x90a4ae,0xd7ccc8],
        build(g,col){
          [[-.22,-.2,.2],[.2,.18,.19],[-.05,.22,.22],[.24,-.18,.17],[-.24,.24,.16]].forEach(([x,z,r])=>{
            const s=cyl(r,r,.06,col,10); s.scale.set(1,1,1.2); s.position.set(x,.03,z); g.add(s); });
        } },

      /* ============================================================
         ชุดเพิ่มเติม (+30 ในบ้าน / +30 นอกบ้าน)
         ============================================================ */

      /* ============ ในบ้าน — ที่นั่ง (เพิ่ม) ============ */
      { id:'kids-chair', name:'เก้าอี้เด็ก', cat:'seat', scope:'in', emoji:'🧒', colors:PLASTIC,
        action:'sit', sit:{sy:.4},
        build(g,col){
          const seat=box(.42,.08,.42,col,.05); seat.position.y=.36; g.add(seat);
          legs(g,.16,.16,.36,shade(col,.85),.03);
          const back=box(.42,.34,.08,col,.05); back.position.set(0,.58,-.17); g.add(back);
          const heart=ball(.06,shade(col,1.2),8); heart.position.set(0,.72,-.13); g.add(heart);
        } },
      { id:'rocking-chair', name:'เก้าอี้โยก', cat:'seat', scope:'in', emoji:'🎀', colors:WOOD,
        action:'sit', sit:{sy:.5},
        build(g,col){
          const seat=box(.56,.1,.54,col,.05); seat.position.y=.46; g.add(seat);
          const back=box(.56,.5,.08,col,.05); back.position.set(0,.72,-.23); g.add(back);
          [-1,1].forEach(s=>{ const arm=box(.08,.26,.5,shade(col,1.08),.04); arm.position.set(s*.28,.56,0); g.add(arm); });
          [-1,1].forEach(s=>{ const run=torus(.4,.03,shade(col,.8),16); run.rotation.y=Math.PI/2; run.scale.set(1,.5,1); run.position.set(s*.24,.1,0); g.add(run); });
        } },
      { id:'floor-cushion', name:'เบาะรองนั่ง', cat:'seat', scope:'in', emoji:'🟧', colors:FABRIC,
        action:'sit', sit:{sy:.22},
        build(g,col){
          const c=cushion(.62,.18,.62,col); c.position.y=.1; g.add(c);
          const btn=ball(.03,shade(col,.8),8); btn.position.set(0,.2,0); g.add(btn);
        } },
      { id:'highchair', name:'เก้าอี้สูงเด็ก', cat:'seat', scope:'in', emoji:'🍼', colors:PLASTIC,
        action:'sit', sit:{sy:.72},
        build(g,col){
          const seat=box(.4,.08,.4,col,.05); seat.position.y=.7; g.add(seat);
          const back=box(.4,.34,.08,col,.05); back.position.set(0,.9,-.16); g.add(back);
          const tray=box(.44,.05,.2,shade(col,1.15),.04); tray.position.set(0,.72,.24); g.add(tray);
          legs(g,.18,.18,.7,shade(col,.8),.035);
          [-1,1].forEach(s=>{ const bar=cyl(.02,.02,.36,shade(col,.8),6); bar.rotation.z=Math.PI/2; bar.position.set(0,.35,s*.18); g.add(bar); });
        } },
      { id:'egg-chair', name:'เก้าอี้ไข่', cat:'seat', scope:'in', emoji:'🥚', colors:SOFT,
        action:'sit', sit:{sy:.5},
        build(g,col){
          const shell=ball(.44,col,16); shell.scale.set(1,1.15,1); shell.position.y=.6; g.add(shell);
          const cu=cushion(.5,.14,.4,shade(col,1.15)); cu.position.set(0,.46,.12); g.add(cu);
          const stand=cyl(.06,.14,.4,shade(col,.7),12); stand.position.y=.2; g.add(stand);
          const base=cyl(.22,.22,.05,shade(col,.7),16); base.position.y=.03; g.add(base);
        } },

      /* ============ ในบ้าน — โต๊ะ (เพิ่ม) ============ */
      { id:'dining-table', name:'โต๊ะกินข้าว', cat:'table', scope:'in', emoji:'🍴', fw:2, fd:2, top:.78, colors:WOOD,
        build(g,col){
          const top=box(1.7,.12,1.5,col,.05); top.position.y=.72; g.add(top);
          legs(g,.72,.62,.72,shade(col,.82),.06);
          const runner=box(.1,.06,1.2,shade(col,.82),.03); runner.position.y=.4; g.add(runner);
        } },
      { id:'round-table', name:'โต๊ะกลม', cat:'table', scope:'in', emoji:'⚪', fw:2, fd:2, top:.74, colors:WOOD,
        build(g,col){
          const top=cyl(.82,.82,.1,col,24); top.position.y=.72; g.add(top);
          const post=cyl(.1,.12,.66,shade(col,.82),12); post.position.y=.36; g.add(post);
          const base=cyl(.4,.44,.06,shade(col,.82),20); base.position.y=.05; g.add(base);
        } },
      { id:'tv-stand', wall:true, name:'ชั้นวางทีวี', cat:'table', scope:'in', emoji:'🗄️', fw:2, fd:1, top:.5, colors:WOOD,
        build(g,col){
          const body=box(1.5,.44,.5,col,.04); body.position.y=.24; g.add(body);
          const top=box(1.54,.06,.54,shade(col,1.06)); top.position.y=.49; g.add(top);
          [-.38,.38].forEach(x=>{ const dr=box(.62,.28,.02,shade(col,1.1),.02); dr.position.set(x,.24,.26); g.add(dr);
            const kn=box(.1,.03,.03,0xb0bec5); kn.position.set(x,.24,.28); g.add(kn); });
        } },
      { id:'bar-table', name:'โต๊ะบาร์สูง', cat:'table', scope:'in', emoji:'🍸', top:1.0, colors:WOOD,
        build(g,col){
          const top=cyl(.42,.42,.08,col,20); top.position.y=.98; g.add(top);
          const post=cyl(.06,.06,.94,shade(col,.8),10); post.position.y=.5; g.add(post);
          const foot=cyl(.34,.34,.04,shade(col,.8),20); foot.position.y=.03; g.add(foot);
          const ring=torus(.2,.02,0xb0bec5,16); ring.rotation.x=Math.PI/2; ring.position.y=.35; g.add(ring);
        } },
      { id:'console-table', wall:true, name:'โต๊ะวางของ', cat:'table', scope:'in', emoji:'🗃️', fw:2, fd:1, top:.76, colors:WOOD,
        build(g,col){
          const top=box(1.5,.08,.5,col,.04); top.position.y=.74; g.add(top);
          const shelf=box(1.4,.05,.44,shade(col,1.06)); shelf.position.y=.3; g.add(shelf);
          [[-.66,-.18],[.66,-.18],[-.66,.18],[.66,.18]].forEach(([x,z])=>{ const L=cyl(.04,.04,.72,shade(col,.82),8); L.position.set(x,.36,z); g.add(L); });
        } },

      /* ============ ในบ้าน — ห้องนอน (เพิ่ม) ============ */
      { id:'bunk-bed', name:'เตียงสองชั้น', cat:'bed', scope:'in', emoji:'🪜', fw:2, fd:2, colors:SOFT,
        build(g,col){
          [.3,1.25].forEach(by=>{ const frame=box(1.6,.16,1.8,shade(0xc98d4e,.95),.05); frame.position.y=by; g.add(frame);
            const mat_=box(1.46,.14,1.66,0xfdfdf8,.05); mat_.position.set(0,by+.14,0); g.add(mat_);
            const pillow=cushion(1.2,.14,.36,shade(col,1.1)); pillow.position.set(0,by+.16,-.6); g.add(pillow); });
          [[-.76,-.86],[.76,-.86],[-.76,.86],[.76,.86]].forEach(([x,z])=>{ const post=box(.1,1.6,.1,shade(0xc98d4e,.85),.04); post.position.set(x,.8,z); g.add(post); });
          for(let i=0;i<3;i++){ const rung=cyl(.028,.028,.5,0xffd54f,8); rung.rotation.z=Math.PI/2; rung.position.set(.76,.5+i*.28,.86); g.add(rung); }
        } },
      { id:'cradle', name:'เปลเด็กไกว', cat:'bed', scope:'in', emoji:'🧷', colors:SOFT,
        action:'bounce',
        build(g,col){
          const body=box(.8,.34,.56,col,.14); body.position.y=.5; g.add(body);
          const mat_=cushion(.66,.12,.44,0xfdfdf8); mat_.position.set(0,.62,0); g.add(mat_);
          const hood=ball(.34,shade(col,1.1),12); hood.scale.set(1,.7,.7); hood.position.set(0,.62,-.24); g.add(hood);
          [-1,1].forEach(s=>{ const run=torus(.34,.03,shade(col,.8),16); run.rotation.y=Math.PI/2; run.scale.set(1,.5,1); run.position.set(s*.34,.16,0); g.add(run); });
        } },
      { id:'dresser', wall:true, name:'ตู้ลิ้นชัก', cat:'bed', scope:'in', emoji:'🧦', fw:2, fd:1, top:.92, colors:WOOD,
        build(g,col){
          const body=box(1.4,.9,.55,col,.04); body.position.y=.46; g.add(body);
          const top=box(1.44,.06,.6,shade(col,1.06)); top.position.y=.92; g.add(top);
          [.24,.5,.76].forEach(y=>{ [-1,1].forEach(s=>{ const dr=box(.62,.2,.02,shade(col,1.1),.02); dr.position.set(s*.35,y,.28); g.add(dr);
            const kn=ball(.03,0xffd54f,8); kn.position.set(s*.35,y,.3); g.add(kn); }); });
        } },
      { id:'vanity', wall:true, name:'โต๊ะเครื่องแป้ง', cat:'bed', scope:'in', emoji:'🪞', top:.75, colors:WOOD,
        build(g,col){
          const top=box(.9,.08,.5,col,.03); top.position.y=.74; g.add(top);
          legs(g,.4,.2,.72,shade(col,.82),.035);
          const drawer=box(.86,.16,.44,shade(col,1.06),.02); drawer.position.set(0,.62,.04); g.add(drawer);
          [-1,1].forEach(s=>{ const kn=ball(.03,0xffd54f,8); kn.position.set(s*.2,.62,.27); g.add(kn); });
          /* กระจก: ตั้งขึ้นด้านหลัง หันหน้าออก (+z) — disc ต้องหมุน x=90° ให้ตั้ง ไม่งั้นนอนราบหงายขึ้น */
          [-1,1].forEach(s=>{ const postM=cyl(.03,.03,.52,shade(col,.85),8); postM.position.set(s*.26,1.04,-.18); g.add(postM); });
          const frame=torus(.28,.045,shade(col,1.05),22); frame.position.set(0,1.3,-.16); g.add(frame);
          const glass=cyl(.25,.25,.02,0xb3e5fc,22); glass.rotation.x=Math.PI/2; glass.position.set(0,1.3,-.15); g.add(glass);
          const shine=box(.06,.3,.01,0xe1f5fe,.02); shine.position.set(-.08,1.34,-.13); shine.rotation.z=.3; g.add(shine);
          const stool=box(.34,.09,.3,shade(col,1.1),.03); stool.position.set(0,.42,.4); g.add(stool);
        } },
      { id:'coat-rack', wall:true, name:'ราวแขวนเสื้อ', cat:'bed', scope:'in', emoji:'🧥', colors:WOOD,
        build(g,col){
          const pole=cyl(.05,.05,1.7,col,10); pole.position.y=.9; g.add(pole);
          const base=cyl(.22,.26,.06,shade(col,.8),16); base.position.y=.04; g.add(base);
          [0,1,2,3].forEach(i=>{ const a=i/4*Math.PI*2; const hook=cyl(.02,.02,.18,shade(col,1.1),6); hook.rotation.z=Math.PI/2; hook.position.set(Math.cos(a)*.14,1.62,Math.sin(a)*.14); g.add(hook); });
          const coat=box(.36,.5,.12,0x90caf9,.1); coat.position.set(.2,1.2,0); g.add(coat);
        } },

      /* ============ ในบ้าน — ครัว (เพิ่ม) ============ */
      { id:'microwave', stack:true, name:'ไมโครเวฟ', cat:'kitchen', scope:'in', emoji:'🥡', colors:[0xeceff1,0xef9a9a,0x90caf9],
        action:'toggle',
        build(g,col){
          const body=box(.6,.4,.5,col,.05); body.position.y=.22; g.add(body);
          const door=box(.42,.32,.02,0x37474f,.03); door.position.set(-.06,.22,.26); g.add(door);
          const panel=box(.1,.32,.02,shade(col,.9),.02); panel.position.set(.24,.22,.26); g.add(panel);
          const btn=ball(.02,0xef5350,8); btn.position.set(.24,.3,.28); g.add(btn);
        } },
      { id:'kitchen-island', name:'เกาะครัว', cat:'kitchen', scope:'in', emoji:'🥘', fw:2, fd:2, top:.92, colors:WOOD,
        build(g,col){
          const body=box(1.5,.85,1.2,col,.04); body.position.y=.42; g.add(body);
          const top=box(1.56,.09,1.26,0xeceff1); top.position.y=.9; g.add(top);
          [-.4,0,.4].forEach(x=>{ const dr=box(.4,.5,.02,shade(col,1.08),.02); dr.position.set(x,.5,.61); g.add(dr);
            const kn=ball(.03,0xb0bec5,8); kn.position.set(x,.62,.63); g.add(kn); });
        } },
      { id:'water-cooler', wall:true, name:'ตู้กดน้ำ', cat:'kitchen', scope:'in', emoji:'💧', colors:[0xeceff1,0x90caf9],
        action:'toggle',
        build(g,col){
          const body=box(.5,1.0,.5,col,.05); body.position.y=.5; g.add(body);
          const bottle=cyl(.2,.22,.4,0xb3e5fc,14); bottle.position.y=1.2; g.add(bottle);
          const tap1=box(.06,.08,.06,0xef5350); tap1.position.set(-.1,.66,.27); g.add(tap1);
          const tap2=box(.06,.08,.06,0x42a5f5); tap2.position.set(.1,.66,.27); g.add(tap2);
        } },
      { id:'cupboard', wall:true, name:'ตู้ถ้วยชาม', cat:'kitchen', scope:'in', emoji:'🫖', fw:2, fd:1, top:1.6, colors:WOOD,
        build(g,col){
          const body=box(1.4,1.7,.5,col,.04); body.position.y=.85; g.add(body);
          [-1,1].forEach(s=>{ const dr=box(.62,1.5,.03,shade(col,1.08),.02); dr.position.set(s*.35,.85,.26); g.add(dr);
            const gl=box(.5,.7,.01,0xb3e5fc,.02); gl.position.set(s*.35,1.2,.28); g.add(gl);
            const kn=ball(.03,0xffd54f,8); kn.position.set(s*.08,.85,.29); g.add(kn); });
        } },
      { id:'rice-cooker', stack:true, name:'หม้อหุงข้าว', cat:'kitchen', scope:'in', emoji:'🍚', colors:[0xeceff1,0xef9a9a,0xffcc80],
        action:'toggle',
        build(g,col){
          const body=cyl(.26,.28,.34,col,18); body.position.y=.19; g.add(body);
          const lid=cyl(.27,.27,.06,shade(col,.92),18); lid.position.y=.39; g.add(lid);
          const knob=ball(.04,0xb0bec5,8); knob.position.y=.44; g.add(knob);
          const light=ball(.02,0xef5350,8); light.position.set(0,.16,.28); g.add(light);
        } },

      /* ============ ในบ้าน — ห้องน้ำ (เพิ่ม) ============ */
      { id:'bath-cabinet', wall:true, name:'ตู้ยาห้องน้ำ', cat:'bath', scope:'in', emoji:'🧴', colors:[0xeceff1,0x90caf9,0xa5d6a7],
        build(g,col){
          const body=box(.5,.6,.22,col,.04); body.position.y=1.2; g.add(body);
          const mir=box(.42,.5,.02,0xb3e5fc,.03); mir.position.set(0,1.2,.12); g.add(mir);
          const shelf=box(.5,.05,.24,shade(col,.9)); shelf.position.y=.86; g.add(shelf);
          const bottle=cyl(.04,.04,.14,0xef9a9a,10); bottle.position.set(-.14,.95,.02); g.add(bottle);
          const cup=cyl(.05,.04,.1,0xffcc80,10); cup.position.set(.14,.93,.02); g.add(cup);
        } },
      { id:'washer', wall:true, name:'เครื่องซักผ้า', cat:'bath', scope:'in', emoji:'🧺', colors:[0xeceff1,0x90caf9],
        action:'spin',
        build(g,col){
          const body=box(.62,.8,.6,col,.05); body.position.y=.42; g.add(body);
          const door=cyl(.2,.2,.04,0x37474f,18); door.rotation.x=Math.PI/2; door.position.set(0,.42,.31); g.add(door);
          const glass=cyl(.15,.15,.03,0xb3e5fc,18); glass.rotation.x=Math.PI/2; glass.position.set(0,.42,.33); g.add(glass);
          const panel=box(.5,.1,.02,shade(col,.9),.02); panel.position.set(0,.74,.28); g.add(panel);
          [-.15,0,.15].forEach(x=>{ const b=ball(.02,0x42a5f5,8); b.position.set(x,.74,.3); g.add(b); });
        } },
      { id:'towel-rack', wall:true, name:'ราวผ้าเช็ดตัว', cat:'bath', scope:'in', emoji:'🧻', colors:[0xcfd8dc,0xb0bec5],
        build(g,col){
          [-1,1].forEach(s=>{ const arm=cyl(.02,.02,.14,col,8); arm.rotation.x=Math.PI/2; arm.position.set(s*.35,1.0,-.06); g.add(arm); });
          const bar=cyl(.02,.02,.76,col,8); bar.rotation.z=Math.PI/2; bar.position.set(0,1.0,0); g.add(bar);
          const towel=box(.5,.5,.06,0x90caf9,.05); towel.position.set(0,.78,.02); g.add(towel);
        } },
      { id:'bath-mat', name:'พรมเช็ดเท้า', cat:'bath', scope:'in', emoji:'🟦', block:false, fw:1, fd:1, colors:FABRIC,
        build(g,col){
          const m=box(.72,.04,.5,col,.06); m.position.y=.02; g.add(m);
          const m2=box(.56,.05,.36,shade(col,1.12),.05); m2.position.y=.03; g.add(m2);
        } },
      { id:'kids-potty', name:'กระโถนเด็ก', cat:'bath', scope:'in', emoji:'🚼', colors:[0xef9a9a,0x90caf9,0xa5d6a7,0xffcc80],
        build(g,col){
          const base=cyl(.24,.26,.2,col,16); base.position.y=.1; g.add(base);
          const seat=torus(.2,.05,shade(col,1.15),14); seat.rotation.x=Math.PI/2; seat.position.y=.22; g.add(seat);
          const back=box(.4,.24,.06,shade(col,1.1),.04); back.position.set(0,.32,-.2); g.add(back);
          const ear=ball(.05,shade(col,1.1),8); ear.position.set(0,.44,-.2); g.add(ear);
        } },

      /* ============ ในบ้าน — ตกแต่ง (เพิ่ม) ============ */
      { id:'wall-picture', wall:true, name:'กรอบรูปติดผนัง', cat:'decor', scope:'in', emoji:'🖼️', colors:[0xffd54f,0xef9a9a,0x90caf9,0xa5d6a7],
        build(g,col){
          const frame=box(.6,.5,.05,col,.03); frame.position.y=1.4; g.add(frame);
          const pic=box(.5,.4,.02,0xb3e5fc,.02); pic.position.set(0,1.4,.03); g.add(pic);
          const sun=ball(.08,0xffd54f,10); sun.position.set(.12,1.5,.05); g.add(sun);
          const hill=box(.5,.14,.01,0xa5d6a7,.04); hill.position.set(0,1.28,.05); g.add(hill);
        } },
      { id:'aquarium', name:'ตู้ปลา', cat:'decor', scope:'in', emoji:'🐠', top:.9, colors:[0xb3e5fc,0x90caf9],
        action:'bounce',
        build(g,col){
          const stand=box(.9,.5,.4,shade(0xc98d4e,.9),.04); stand.position.y=.25; g.add(stand);
          const glass=box(.86,.5,.38,col,.03); glass.position.y=.76; g.add(glass);
          const water=box(.8,.4,.32,0x4dd0e1,.02); water.position.y=.74; g.add(water);
          const fish=ball(.06,0xff8a65,8); fish.scale.set(1.4,1,.6); fish.position.set(-.1,.78,.1);
          fish.userData.anim={kind:'bob', sp:1.3, amp:.06}; g.add(fish);           /* ปลาว่ายขึ้นลงในตู้ */
          const fish2=ball(.05,0xffd54f,8); fish2.scale.set(1.4,1,.6); fish2.position.set(.16,.68,0);
          fish2.userData.anim={kind:'bob', sp:1.7, amp:.05, ph:2.4}; g.add(fish2);
          [[-.28,.66],[.3,.8],[.02,.6]].forEach(([x,y],i)=>{ const bb=ball(.025,0xe0f7fa,6);
            bb.position.set(x,y,.05); bb.userData.anim={kind:'bob', sp:2.4, amp:.12, ph:i*1.9}; g.add(bb); });
        } },
      { id:'piano', wall:true, name:'เปียโน', cat:'decor', scope:'in', emoji:'🎹', fw:2, fd:1, colors:[0x37474f,0x8d4e2a,0xef9a9a],
        action:'bounce',
        build(g,col){
          const body=box(1.4,1.1,.5,col,.04); body.position.y=.72; g.add(body);
          const kb=box(1.3,.12,.24,0xfdfdf8,.02); kb.position.set(0,.74,.3); g.add(kb);
          for(let i=0;i<9;i++){ const bk=box(.04,.08,.12,0x263238); bk.position.set(-.55+i*.135,.8,.26); g.add(bk); }
          const top=box(1.44,.08,.54,shade(col,1.1)); top.position.y=1.28; g.add(top);
          const stool=box(.4,.34,.3,shade(0xc98d4e,.95),.04); stool.position.set(0,.17,.62); g.add(stool);
        } },
      { id:'big-teddy', name:'ตุ๊กตาหมีใหญ่', cat:'decor', scope:'in', emoji:'🐻', colors:[0xa1887f,0xd7a86e,0xef9a9a,0x8d6e63],
        action:'bounce',
        build(g,col){
          const body=ball(.34,col,12); body.scale.set(1,1.1,.9); body.position.y=.5; g.add(body);
          const tummy=ball(.2,shade(col,1.15),10); tummy.position.set(0,.46,.24); g.add(tummy);
          const head=ball(.26,col,12); head.position.y=.98; g.add(head);
          [-1,1].forEach(s=>{ const ear=ball(.1,col,8); ear.position.set(s*.18,1.16,0); g.add(ear);
            const arm=ball(.11,col,8); arm.scale.set(1,1.4,1); arm.position.set(s*.34,.56,.06); g.add(arm);
            const leg=ball(.13,col,8); leg.position.set(s*.16,.2,.06); g.add(leg); });
          const snout=ball(.1,shade(col,1.15),8); snout.position.set(0,.92,.24); g.add(snout);
          const nose=ball(.04,0x37474f,8); nose.position.set(0,.94,.33); g.add(nose);
          [-1,1].forEach(s=>{ const eye=ball(.03,0x37474f,8); eye.position.set(s*.09,1.02,.24); g.add(eye); });
        } },
      { id:'globe', stack:true, name:'ลูกโลกหมุน', cat:'decor', scope:'in', emoji:'🌐', colors:[0x42a5f5,0x66bb6a],
        action:'spin',
        build(g,col,k){
          const gl=new k.THREE.Group(); gl.position.y=.5; g.add(gl);               /* ลูกโลกหมุนเองช้าๆ */
          gl.userData.anim={kind:'spin', axis:'y', sp:.35};
          const globe=ball(.24,col,16); gl.add(globe);
          const land=ball(.1,0x66bb6a,8); land.scale.set(1.2,1,.6); land.position.set(.08,.05,.18); gl.add(land);
          const land2=ball(.08,0x66bb6a,8); land2.scale.set(1,1.3,.6); land2.position.set(-.12,-.04,-.14); gl.add(land2);
          const ring=torus(.28,.02,0xffd54f,20); ring.rotation.x=.4; ring.position.y=.5; g.add(ring);
          const base=cyl(.08,.12,.16,shade(0xc98d4e,.9),12); base.position.y=.12; g.add(base);
        } },

      /* ============ นอกบ้าน — สวน/ต้นไม้ (เพิ่ม) ============ */
      /* ทานตะวัน — ทรงเดียวกับต้นในทุ่งดอกทานตะวันบนแผนที่เป๊ะ (buildSunflower ใน js/house.js)
         กลีบเป็นลูกกลมแบน 10 กลีบรอบจานเมล็ด + ใบใหญ่ 2 ใบ + จานหลังสีเขียว · ต้นตกแต่งวาง 2 ต้นสูงไม่เท่ากัน
         ⚠ ถ้าแก้ทรงในทุ่ง ให้แก้ที่นี่ตามด้วย ไม่งั้นต้นที่เด็กปลูกเองจะหน้าตาไม่เหมือนทุ่งข้างๆ */
      { id:'sunflower', name:'ทานตะวัน', cat:'garden', scope:'out', emoji:'🌻', colors:[0xffd54f,0xffb300],
        build(g,col,k){
          const T=k.THREE;
          const stalk=(h,px,pz,petal)=>{
            const stem=cyl(.035,.05,h,0x5aa74e,7); stem.position.set(px,h/2,pz); g.add(stem);
            [-1,1].forEach((sd,i)=>{ const lf=ball(.14,0x6fbf73,7); lf.scale.set(1.5,.28,.85);
              lf.position.set(px+sd*.14,h*(.42+i*.16),pz); lf.rotation.z=-sd*.5; g.add(lf); });
            const head=new T.Group(); head.position.set(px,h+.06,pz+.04); g.add(head);
            for(let p=0;p<10;p++){ const a=p*Math.PI*2/10; const pt=ball(.14,petal,6);
              pt.scale.set(.62,.62,.3); pt.position.set(Math.cos(a)*.24,Math.sin(a)*.24,0); head.add(pt); }
            const disc=cyl(.19,.19,.07,0x8d5a2b,12); disc.rotation.x=Math.PI/2; head.add(disc);
            const seed=cyl(.13,.13,.09,0x6b4423,10); seed.rotation.x=Math.PI/2; head.add(seed);
            const back=cyl(.21,.21,.05,0x6fbf73,12); back.rotation.x=Math.PI/2; back.position.z=-.06; head.add(back);
          };
          stalk(1.15,-.13,-.05,col);
          stalk(.82,.17,.12,shade(col,.92));
        } },
      { id:'cactus', name:'กระบองเพชร', cat:'garden', scope:'out', emoji:'🌵', colors:[0x66bb6a,0x4caf50,0x81c784],
        build(g,col){
          const pot=cyl(.2,.16,.24,0xd7a86e,14); pot.position.y=.12; g.add(pot);
          const body=cyl(.16,.18,.7,col,12); body.position.y=.55; g.add(body);
          const top=ball(.16,col,10); top.position.y=.9; g.add(top);
          [-1,1].forEach(s=>{ const arm=cyl(.07,.08,.24,col,10); arm.rotation.z=Math.PI/2; arm.position.set(s*.18,.62,0); g.add(arm);
            const up=cyl(.07,.08,.22,col,10); up.position.set(s*.28,.74,0); g.add(up); });
          const fl=ball(.06,0xf48fb1,8); fl.position.y=1.02; g.add(fl);
        } },
      { id:'flower-arch', leafy:true, leafyTall:true, name:'ซุ้มดอกไม้', cat:'garden', scope:'out', emoji:'🌸', fw:2, fd:1, colors:[0xf48fb1,0xce93d8,0xffb3c1],
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.06,1.2,0xffffff,10); post.position.set(s*.62,.6,0); g.add(post); });
          const ring=torus(.62,.07,0x81c784,24); ring.position.set(0,1.55,0); g.add(ring);
          const petals=[0xf06292,0xffd54f,0xba68c8,0xff8a65];
          for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; const fl=ball(.1,petals[i%petals.length],8); fl.position.set(Math.cos(a)*.62,1.55+Math.sin(a)*.62,.02); g.add(fl);
            const leaf=ball(.05,0x66bb6a,6); leaf.scale.set(1.4,.5,1); leaf.position.set(Math.cos(a)*.62,1.55+Math.sin(a)*.62,-.04); g.add(leaf); }
        } },
      /* ต้นมะพร้าว — ทรงเดียวกับต้นมะพร้าวริมหาดบนแผนที่ (buildPalm ใน js/house.js)
         ลำต้นโค้งทำจากท่อนซ้อน + วงปล้อง · ทางใบ 7 ทาง ทางละ 3 ท่อน "ลู่ลง" (ห้ามวางแบนระนาบเดียว
         ไม่งั้นกล้องไอโซจะเห็นเป็นจานกลมแบนเหมือนดอกไม้) · ยอดอ่อนกลางพุ่ม + พวงมะพร้าว 3 ลูก */
      { id:'palm-tall', leafy:true, leafyTall:true, name:'ต้นมะพร้าว', cat:'garden', scope:'out', emoji:'🥥', colors:[0x5cb85c,0x66bb6a,0x4caf50],
        build(g,col,k){
          const T=k.THREE, SEG=5, H=2.0, lean=.42;
          let tx=0, ty=0;
          for(let i=0;i<SEG;i++){
            const t=i/SEG, t2=(i+1)/SEG, y0=H*t, y1=H*t2, x0=lean*t*t, x1=lean*t2*t2;
            const len=Math.hypot(x1-x0,y1-y0);
            const sg=cyl(.1-i*.011,.14-i*.011,len+.04,i%2?0xcf9f68:0xc4914f,9);
            sg.position.set((x0+x1)/2,(y0+y1)/2,0); sg.rotation.z=-Math.atan2(x1-x0,y1-y0); g.add(sg);
            if(i%2===0){ const rg=cyl(.12-i*.011,.12-i*.011,.05,0xb98446,9);
              rg.position.set(x0+(x1-x0)*.4,y0+(y1-y0)*.4,0); rg.rotation.z=sg.rotation.z; g.add(rg); }
            tx=x1; ty=y1;
          }
          const crown=ball(.15,0xb98446,8); crown.position.set(tx,ty+.04,0); g.add(crown);
          for(let i=0;i<7;i++){
            const fr=new T.Group(); fr.position.set(tx,ty+.06+(i%2?.06:-.03),0); fr.rotation.y=-(i/7*Math.PI*2+.3); g.add(fr);
            [[.26,.5,.26,-.05,-.16],[.7,.42,.21,-.26,-.5],[1.0,.32,.13,-.64,-.95]].forEach(([r,len,wid,dy,tilt])=>{
              const lf=box(len,.06,wid,col,.03); lf.position.set(r,dy,0); lf.rotation.z=tilt; fr.add(lf); });
            const rib=box(.92,.045,.055,shade(col,.82),.02); rib.position.set(.48,-.18,0); rib.rotation.z=-.36; fr.add(rib);
          }
          const bud=cone(.09,.44,shade(col,1.1),7); bud.position.set(tx,ty+.3,0); bud.rotation.z=-.2; g.add(bud);
          [[.15,-.09,.05],[-.05,-.13,.15],[.05,-.18,-.11]].forEach(([x,y,z])=>{
            const co=ball(.1,0x8d6e63,8); co.scale.y=.92; co.position.set(tx+x,ty+y,z); g.add(co); });
        } },
      { id:'hedge', leafy:true, name:'พุ่มรั้วเขียว', cat:'garden', scope:'out', emoji:'🍃', fw:2, fd:1, colors:GREEN,
        build(g,col){
          const body=box(1.6,.6,.5,col,.14); body.position.y=.35; g.add(body);
          [-.5,0,.5].forEach(x=>{ const b=ball(.32,shade(col,1.08),10); b.scale.set(1,.7,1); b.position.set(x,.62,0); g.add(b); });
        } },
      { id:'tulip-pot', stack:true, name:'กระถางทิวลิป', cat:'garden', scope:'out', emoji:'🌼', colors:[0xf48fb1,0xffd54f,0xef5350,0xba68c8],
        build(g,col){
          const pot=cyl(.22,.16,.26,0xd7a86e,14); pot.position.y=.13; g.add(pot);
          const soil=cyl(.2,.2,.03,0x6d4c41,14); soil.position.y=.27; g.add(soil);
          [[-.1,-.05],[.1,-.05],[0,.1]].forEach(([x,z])=>{ const stem=cyl(.02,.02,.26,0x66bb6a,6); stem.position.set(x,.4,z); g.add(stem);
            const fl=ball(.08,col,8); fl.scale.set(1,1.3,1); fl.position.set(x,.56,z); g.add(fl); });
        } },
      { id:'rose-bush', leafy:true, name:'พุ่มกุหลาบ', cat:'garden', scope:'out', emoji:'🌹', colors:GREEN,
        build(g,col){
          const bush=ball(.4,col,12); bush.scale.set(1,.8,1); bush.position.y=.36; g.add(bush);
          [[.2,.5,.1],[-.2,.46,-.1],[0,.6,.2],[.14,.52,-.2],[-.16,.56,.14]].forEach(([x,y,z])=>{ const rose=ball(.08,0xef5350,8); rose.position.set(x,y,z); g.add(rose); });
        } },
      /* พุ่มโคลเวอร์ — เดิมเป็นจานแบนโรยเม็ดกลมเล็ก มองมุมไอโซแล้วเหมือนแพนเค้ก (ปรับ 2026-08-03)
         ของใหม่: เนินหญ้าเตี้ย + ก้านโคลเวอร์ยกสูงคนละระดับ ใบ 3 แฉกต่อก้าน + ดอกโคลเวอร์ขาว 2 ดอก */
      { id:'clover-patch', name:'พุ่มโคลเวอร์', cat:'garden', scope:'out', emoji:'☘️', block:false, colors:[0x66bb6a,0x4caf50,0x81c784],
        build(g,col){
          const mound=ball(.44,shade(col,.9),12); mound.scale.set(1,.32,1); mound.position.y=.04; g.add(mound);
          [[-.22,-.16,.3],[.18,-.12,.24],[.04,.2,.34],[-.16,.2,.2],[.26,.14,.27],[-.02,-.02,.4]].forEach(([x,z,h])=>{
            const stem=cyl(.022,.028,h,shade(col,.85),5); stem.position.set(x,h/2,z); g.add(stem);
            for(let j=0;j<3;j++){ const a=j/3*Math.PI*2+.4;
              const leaf=ball(.1,shade(col,1.12),7); leaf.scale.set(1,.32,.85);
              leaf.position.set(x+Math.cos(a)*.09,h+.02,z+Math.sin(a)*.09); g.add(leaf); }
          });
          [[-.3,.1,.34],[.24,-.24,.28]].forEach(([x,z,h])=>{        /* ดอกโคลเวอร์ขาวชมพู */
            const stem=cyl(.02,.024,h,shade(col,.8),5); stem.position.set(x,h/2,z); g.add(stem);
            const fl=ball(.075,0xfbf7f0,8); fl.scale.y=1.2; fl.position.set(x,h+.06,z); g.add(fl);
            const tip=ball(.05,0xf8bbd0,7); tip.position.set(x,h+.12,z); g.add(tip);
          });
        } },

      /* ============ นอกบ้าน — เครื่องเล่น (เพิ่ม) ============ */
      { id:'monkey-bars', name:'ราวโหน', cat:'play', scope:'out', emoji:'🐒', fw:2, fd:1, colors:PLASTIC,
        build(g,col){
          [[-.7,-.35],[.7,-.35],[-.7,.35],[.7,.35]].forEach(([x,z])=>{ const post=cyl(.06,.06,1.5,col,8); post.position.set(x,.75,z); g.add(post); });
          [-1,1].forEach(s=>{ const rail=cyl(.05,.05,1.5,shade(col,.85),8); rail.rotation.x=Math.PI/2; rail.position.set(s*.7,1.5,0); g.add(rail); });
          for(let i=0;i<5;i++){ const rung=cyl(.03,.03,1.4,0xffd54f,8); rung.rotation.z=Math.PI/2; rung.position.set(0,1.5,-.35+i*.175); g.add(rung); }
        } },
      { id:'spring-rider', name:'ม้าโยกสปริง', cat:'play', scope:'out', emoji:'🐴', colors:PLASTIC,
        action:'sit', sit:{sy:.7}, rock:true,
        build(g,col,k){
          const T=k.THREE;
          const spring=cyl(.06,.06,.4,0x9e9e9e,10); spring.position.y=.2; g.add(spring);
          const base=cyl(.28,.32,.06,shade(col,.7),16); base.position.y=.03; g.add(base);
          const piv=new T.Group(); piv.position.set(0,.4,0); piv.userData.swingPivot=true; g.add(piv);
          const body=box(.7,.28,.3,col,.12); body.position.set(0,.28,0); piv.add(body);
          const head=box(.24,.3,.24,col,.1); head.position.set(0,.5,.32); piv.add(head);
          const ear=cone(.06,.12,shade(col,.85),6); ear.position.set(0,.68,.28); piv.add(ear);
          const eye=ball(.03,0x37474f,8); eye.position.set(.09,.52,.44); piv.add(eye);
          const handle=cyl(.02,.02,.24,0xffd54f,8); handle.rotation.z=Math.PI/2; handle.position.set(0,.5,.14); piv.add(handle);
          const anc=new T.Group(); anc.position.set(0,.5,0); anc.userData.swingSeat=true; piv.add(anc);
        } },
      { id:'kiddie-pool', name:'สระเด็ก', cat:'play', scope:'out', emoji:'🏊', block:false, fw:2, fd:2, colors:[0x4dd0e1,0x81d4fa],
        build(g,col){
          const ring=torus(.85,.14,shade(col,1.1),24); ring.rotation.x=Math.PI/2; ring.position.y=.14; g.add(ring);
          const water=cyl(.82,.82,.14,col,24); water.position.y=.1;
          water.userData.anim={kind:'pulse', sp:.6, amp:.012}; g.add(water);
          const ball1=ball(.1,0xef5350,10); ball1.position.set(.3,.24,.2);
          ball1.userData.anim={kind:'bob', sp:1.2, amp:.05}; g.add(ball1);          /* ลูกบอลลอยน้ำ */
          const ball2=ball(.09,0xffd54f,10); ball2.position.set(-.28,.22,-.1);
          ball2.userData.anim={kind:'bob', sp:1.5, amp:.05, ph:2.2}; g.add(ball2);
        } },
      { id:'basketball-hoop', wall:true, name:'แป้นบาส', cat:'play', scope:'out', emoji:'🏀', colors:PLASTIC,
        build(g,col){
          const pole=cyl(.06,.07,1.9,col,10); pole.position.y=.95; g.add(pole);
          const base=cyl(.24,.28,.1,shade(col,.7),16); base.position.y=.05; g.add(base);
          const board=box(.6,.44,.05,0xfdfdf8,.03); board.position.set(0,1.9,.12); g.add(board);
          const rim=torus(.16,.025,0xff7043,16); rim.rotation.x=Math.PI/2; rim.position.set(0,1.7,.24); g.add(rim);
          const net=cyl(.14,.08,.2,0xeceff1,12); net.position.set(0,1.6,.24); g.add(net);
        } },
      { id:'soccer-goal', name:'ประตูฟุตบอล', cat:'play', scope:'out', emoji:'⚽', fw:2, fd:1, colors:[0xfdfdf8,0xeceff1],
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.05,.05,1.0,col,8); post.position.set(s*.75,.5,0); g.add(post); });
          const cross=cyl(.05,.05,1.6,col,8); cross.rotation.z=Math.PI/2; cross.position.set(0,1.0,0); g.add(cross);
          const net=box(1.5,.9,.02,0xeceff1,.02); net.position.set(0,.5,-.24); net.rotation.x=.3; g.add(net);
          const bl=ball(.12,col,10); bl.position.set(.4,.12,.4); g.add(bl);
        } },
      /* ว่าว — เดิมตัวว่าวเล็กมากและลอยลอยอยู่เฉยๆ ไม่มีที่ยึด (ปรับ 2026-08-03)
         ของใหม่: ตัวว่าวใหญ่ขึ้นเท่าตัว มีคานไม้กากบาท ผ้าสองสี หางยาวมีโบว์ 5 อัน และหลอดเก็บสายวางที่พื้น */
      { id:'kite', name:'ว่าว', cat:'play', scope:'out', emoji:'🪁', colors:BRIGHT,
        build(g,col,k){
          const T=k.THREE, air=new T.Group(); g.add(air);      /* ตัวว่าว+หาง ลอยไหวตามลมทั้งชุด */
          air.userData.anim={kind:'bob', sp:.9, amp:.12};
          const spool=cyl(.09,.09,.16,0xc98d4e,10); spool.rotation.z=Math.PI/2; spool.position.set(-.3,.09,0); g.add(spool);
          [-1,1].forEach(s=>{ const cap=cyl(.13,.13,.03,shade(0xc98d4e,.8),10); cap.rotation.z=Math.PI/2;
            cap.position.set(-.3+s*.09,.09,0); g.add(cap); });
          const str=cyl(.012,.012,1.55,0xfbf7f0,4); str.position.set(.05,.78,0); str.rotation.z=.42; g.add(str);
          const kx=.52, ky=1.62;
          const kite=box(.62,.62,.04,col,.03); kite.position.set(kx,ky,0); kite.rotation.z=Math.PI/4; air.add(kite);
          const half=box(.6,.3,.05,shade(col,1.18),.02); half.position.set(kx,ky,.02); half.rotation.z=Math.PI/4; air.add(half);
          [0,1].forEach(i=>{ const bar=box(.86,.04,.05,0xc98d4e,.02);
            bar.position.set(kx,ky,.05); bar.rotation.z=Math.PI/4+i*Math.PI/2; air.add(bar); });
          for(let i=0;i<5;i++){                       /* หางว่าว: เชือกเฉียงลง + โบว์สลับสี */
            const t=(i+1)/5;
            const bow=ball(.07,i%2?0xffd54f:0xef5350,8); bow.scale.set(1.4,.7,.7);
            bow.position.set(kx-.44*t-.06, ky-.5-.34*i, 0); air.add(bow);
            const tie=cyl(.012,.012,.3,0xfbf7f0,4); tie.rotation.z=.5;
            tie.position.set(kx-.44*t+.05, ky-.34-.34*i, 0); air.add(tie);
          }
        } },
      { id:'playhouse', name:'บ้านของเล่น', cat:'play', scope:'out', emoji:'🛖', fw:2, fd:2, colors:[0xffcc80,0xef9a9a,0x90caf9,0xa5d6a7],
        build(g,col){
          const body=box(1.3,1.0,1.2,col,.05); body.position.y=.5; g.add(body);
          const roof=cone(1.05,.7,shade(col,.75),4); roof.rotation.y=Math.PI/4; roof.position.y=1.35; g.add(roof);
          const door=box(.4,.6,.04,shade(0xc98d4e,.9),.03); door.position.set(0,.3,.61); g.add(door);
          const win=box(.3,.3,.04,0xb3e5fc,.03); win.position.set(-.4,.6,.61); g.add(win);
          const win2=box(.3,.3,.04,0xb3e5fc,.03); win2.position.set(.4,.6,.61); g.add(win2);
        } },

      /* ============ นอกบ้าน — ที่นั่งสนาม (เพิ่ม) ============ */
      { id:'hammock', name:'เปลญวน', cat:'seatout', scope:'out', emoji:'💤', fw:2, fd:1, colors:FABRIC,
        action:'sit', sit:{sy:.5},
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.07,1.1,0x8d6e63,8); post.position.set(s*.85,.55,0); post.rotation.z=s*.16; g.add(post); });
          const bed=box(1.4,.14,.5,col,.18); bed.position.y=.42; g.add(bed);
          const p=cushion(.4,.12,.4,shade(col,1.12)); p.position.set(-.4,.5,0); g.add(p);
        } },
      { id:'garden-swing', name:'ชิงช้านั่งเล่น', cat:'seatout', scope:'out', emoji:'💺', fw:2, fd:1, colors:PLASTIC,
        action:'sit', sit:{sy:.55}, rock:true,
        build(g,col,k){
          const T=k.THREE;
          [-1,1].forEach(s=>{ const bar=cyl(.05,.05,2.0,col,8); bar.position.set(s*.8,.95,0); bar.rotation.z=s*.24; g.add(bar); });
          const top=cyl(.05,.05,1.5,col,8); top.rotation.z=Math.PI/2; top.position.y=1.75; g.add(top);
          const roof=box(1.5,.06,.7,shade(col,1.1),.03); roof.position.y=1.82; g.add(roof);
          const piv=new T.Group(); piv.position.set(0,1.75,0); piv.userData.swingPivot=true; g.add(piv);
          [-1,1].forEach(s=>{ const chain=cyl(.02,.02,1.1,0x9e9e9e,6); chain.position.set(s*.5,1.15-1.75,0); piv.add(chain); });
          const seat=box(1.2,.1,.4,0xffca28,.04); seat.position.set(0,.6-1.75,0); piv.add(seat);
          const back=box(1.2,.4,.08,0xffca28,.04); back.position.set(0,.8-1.75,-.16); piv.add(back);
          const anc=new T.Group(); anc.position.set(0,.6-1.75,0); anc.userData.swingSeat=true; piv.add(anc);
        } },
      { id:'sun-lounger', name:'เก้าอี้ผ้าใบ', cat:'seatout', scope:'out', emoji:'😎', fw:1, fd:2, colors:BRIGHT,
        /* ท่านั่ง (ไม่ใช่นอน): ก้นอยู่กลางเบาะ (ไม่ทับพนักพิง) ขาเหยียดตามเบาะ (legBend น้อย) หลังเอนพิงพนัก (lean) */
        action:'sit', sit:{sy:.5, dz:-.08, lean:-0.6, legBend:-0.55},
        build(g,col){
          const seat=box(.62,.1,1.4,col,.05); seat.position.set(0,.36,.1); g.add(seat);
          const stripe=box(.5,.03,1.2,shade(col,1.2)); stripe.position.set(0,.42,.1); g.add(stripe);
          legs(g,.26,.55,.36,shade(col,.7),.03);
          /* พนักพิงเอนแบบเก้าอี้นั่ง ~35° บานพับที่ปลายหัว (-z) — ให้หลังเอนพิงพอดี */
          const back=box(.62,.78,.08,col,.05); back.position.set(0,.62,-.6); back.rotation.x=-0.62; g.add(back);
          const bstripe=box(.5,.68,.03,shade(col,1.2)); bstripe.position.set(0,.63,-.56); bstripe.rotation.x=-0.62; g.add(bstripe);
          /* หมอนพิง: เอียงแนบหน้าพนักพิง (มุมเดียวกัน) วางบนผิวพนักช่วงบน ไม่ลอย */
          const pillow=cushion(.5,.14,.22,shade(col,1.1)); pillow.position.set(0,.82,-.66); pillow.rotation.x=-0.62; g.add(pillow);
        } },
      { id:'log-bench', name:'ม้านั่งท่อนไม้', cat:'seatout', scope:'out', emoji:'🪓', fw:2, fd:1, colors:[0x9c6238,0xc98d4e,0xa1887f],
        action:'sit', sit:{sy:.45},
        build(g,col){
          const log=cyl(.24,.24,1.5,col,14); log.rotation.z=Math.PI/2; log.position.y=.32; g.add(log);
          const flat=box(1.5,.04,.4,shade(col,1.1)); flat.position.y=.44; g.add(flat);
          [-1,1].forEach(s=>{ const leg=cyl(.1,.12,.24,shade(col,.8),10); leg.position.set(s*.5,.12,0); g.add(leg); });
        } },

      /* ============ นอกบ้าน — ตกแต่งสนาม (เพิ่ม) ============ */
      { id:'bbq-grill', name:'เตาปิ้งย่าง', cat:'decorout', scope:'out', emoji:'🍖', colors:[0x37474f,0xef5350,0x455a64],
        action:'toggle',
        build(g,col){
          const bowl=cyl(.3,.24,.24,col,16); bowl.position.y=.7; g.add(bowl);
          const grill=cyl(.28,.28,.03,0xb0bec5,16); grill.position.y=.82; g.add(grill);
          const lid=ball(.3,shade(col,.8),14); lid.scale.set(1,.6,1); lid.position.y=.86; g.add(lid);
          legs(g,.2,.2,.6,0x37474f,.03);
          const ember=ball(.05,0xff7043,8); ember.position.set(0,.78,0); g.add(ember);
        } },
      { id:'scarecrow', name:'หุ่นไล่กา', cat:'decorout', scope:'out', emoji:'🧑‍🌾', colors:[0xef5350,0x42a5f5,0x66bb6a,0xffca28],
        build(g,col){
          const pole=cyl(.05,.05,1.6,0x8d6e63,8); pole.position.y=.8; g.add(pole);
          const arms=cyl(.04,.04,1.2,0x8d6e63,8); arms.rotation.z=Math.PI/2; arms.position.y=1.1; g.add(arms);
          const body=box(.5,.6,.3,col,.1); body.position.y=1.0; g.add(body);
          const head=ball(.2,0xffe0b2,12); head.position.y=1.5; g.add(head);
          const hat=cone(.28,.3,0xd7a86e,12); hat.position.y=1.66; g.add(hat);
          const brim=cyl(.32,.32,.03,0xd7a86e,14); brim.position.y=1.56; g.add(brim);
          [-1,1].forEach(s=>{ const eye=box(.04,.06,.02,0x37474f); eye.position.set(s*.07,1.52,.19); g.add(eye); });
          const straw=cone(.05,.14,0xffd54f,6); straw.rotation.z=Math.PI/2; straw.position.set(.62,1.1,0); g.add(straw);
        } },
      /* กังหันลม — เดิมใบพัดกางอยู่ในระนาบแนวนอน (หมุนแล้วเหมือนพัดลมเพดานเล็กๆ) มองมุมไอโซแทบไม่เห็นใบ
         ของใหม่ (2026-08-03): ใบพัดกังหันกระดาษ 6 กลีบ "ตั้งฉากกับเสา" หันหน้าเข้าหากล้อง (ระนาบ XY)
         หมุนเองตลอดเวลา (anim spin) + ดุมกลาง + หมุดสีทอง + ใบไม้ประดับที่โคนเสา */
      { id:'windmill', name:'กังหันลม', cat:'decorout', scope:'out', emoji:'🌬️', colors:BRIGHT,
        action:'spin',
        build(g,col,k){
          const T=k.THREE;
          const pole=cyl(.035,.05,1.3,0x9c6238,8); pole.position.y=.65; g.add(pole);
          [-1,1].forEach(s=>{ const lf=ball(.12,0x66bb6a,7); lf.scale.set(1.5,.35,.9);
            lf.position.set(s*.11,.3+s*.08,0); lf.rotation.z=-s*.5; g.add(lf); });
          const fan=new T.Group(); fan.position.set(0,1.32,.09); g.add(fan);
          fan.userData.anim={kind:'spin', axis:'z', sp:1.9};
          for(let i=0;i<6;i++){
            const a=i/6*Math.PI*2;
            const c=[col,shade(col,1.25),0xfbf7f0][i%3];
            const pt=box(.34,.22,.03,c,.05);                 /* กลีบใบพัด (ระนาบ XY = หันหน้าเข้ากล้อง) */
            pt.position.set(Math.cos(a)*.2,Math.sin(a)*.2,0); pt.rotation.z=a+.5; fan.add(pt);
            const tip=ball(.05,shade(c,.85),7); tip.position.set(Math.cos(a)*.36,Math.sin(a)*.36,.02); fan.add(tip);
          }
          const hub=cyl(.07,.07,.08,0xffd54f,12); hub.rotation.x=Math.PI/2; hub.position.set(0,1.32,.14); g.add(hub);
        } },
      { id:'well', name:'บ่อน้ำโบราณ', cat:'decorout', scope:'out', emoji:'🪣', fw:2, fd:2, colors:[0x90a4ae,0xbcaaa4,0xa1887f],
        build(g,col){
          const wall=cyl(.5,.5,.5,col,18); wall.position.y=.25; g.add(wall);
          const rim=torus(.5,.06,shade(col,1.1),18); rim.rotation.x=Math.PI/2; rim.position.y=.5; g.add(rim);
          const water=cyl(.42,.42,.02,0x4dd0e1,18); water.position.y=.36; g.add(water);
          [-1,1].forEach(s=>{ const post=cyl(.05,.05,1.0,0x8d6e63,8); post.position.set(s*.42,1.0,0); g.add(post); });
          const roof=cone(.7,.4,0xef5350,4); roof.rotation.y=Math.PI/4; roof.position.y=1.7; g.add(roof);
          const bar=cyl(.04,.04,.9,0x8d6e63,8); bar.rotation.z=Math.PI/2; bar.position.y=1.45; g.add(bar);
          const bucket=cyl(.1,.08,.14,0x8d6e63,10); bucket.position.set(0,1.2,.1); g.add(bucket);
        } },
      { id:'statue', name:'รูปปั้น', cat:'decorout', scope:'out', emoji:'🗿', colors:[0xbcaaa4,0xd7ccc8,0xa1887f],
        build(g,col){
          const base=box(.5,.3,.5,shade(col,.85),.03); base.position.y=.15; g.add(base);
          const body=cyl(.2,.26,.7,col,12); body.position.y=.65; g.add(body);
          const head=ball(.22,col,12); head.scale.set(.9,1.1,1); head.position.y=1.1; g.add(head);
          [-1,1].forEach(s=>{ const eye=box(.06,.1,.02,shade(col,.6)); eye.position.set(s*.09,1.12,.19); g.add(eye); });
          const nose=box(.06,.18,.1,shade(col,.9)); nose.position.set(0,1.02,.2); g.add(nose);
        } },
      /* เสาธง — เปลี่ยนเป็น **ธงชาติไทย** พร้อมสะบัดจริง (2026-08-03 ตามคำขอผู้ใช้)
         ธงไตรรงค์ = 5 แถบ แดง-ขาว-น้ำเงิน-ขาว-แดง สัดส่วนความสูง 1:1:2:1:1 (แถบน้ำเงินหนาเป็น 2 เท่า)
         ผ้าธงอยู่ในกลุ่มย่อยที่ "จุดหมุนติดเสา" แล้วติดธง anim wave → สะบัดชุดเดียวกับธงในเมือง */
      { id:'flag-pole', name:'เสาธงไทย', cat:'decorout', scope:'out', emoji:'🇹🇭', colors:[0xcfd8dc,0xb0bec5],
        action:'bounce',
        build(g,col,k){
          const T=k.THREE;
          const pole=cyl(.04,.05,2.2,col,10); pole.position.y=1.1; g.add(pole);
          const base=cyl(.18,.22,.1,shade(col,.8),14); base.position.y=.05; g.add(base);
          const ring=cyl(.06,.06,.05,shade(col,.7),10); ring.position.y=1.86; g.add(ring);
          const top=ball(.07,0xffd54f,10); top.position.y=2.24; g.add(top);
          const cloth=new T.Group(); cloth.position.set(.02,1.98,0); g.add(cloth);
          cloth.userData.anim={kind:'wave'};
          const W=.62, H=.42, unit=H/6;                     /* 6 ส่วน: 1 แดง / 1 ขาว / 2 น้ำเงิน / 1 ขาว / 1 แดง */
          [[0xa51931,unit,2.5],[0xf4f5f8,unit,1.5],[0x2d2a4a,unit*2,0],[0xf4f5f8,unit,-1.5],[0xa51931,unit,-2.5]]
            .forEach(([c,h,off])=>{
              const st=box(W,h,.025,c,.008); st.position.set(W/2, off*unit, 0); cloth.add(st);
            });
        } },
      { id:'bird-bath', name:'อ่างน้ำนก', cat:'decorout', scope:'out', emoji:'🕊️', colors:[0xd7ccc8,0x90a4ae,0xbcaaa4],
        build(g,col,k){
          const base=cyl(.24,.3,.08,col,16); base.position.y=.04; g.add(base);
          const stand=cyl(.1,.16,.68,col,12); stand.position.y=.42; g.add(stand);
          const basin=cyl(.36,.24,.14,shade(col,1.1),18); basin.position.y=.83; g.add(basin);
          /* ขอบอ่างเป็นวงแหวน + ผิวน้ำโผล่พ้นปากอ่าง — ของเดิมวางผิวน้ำไว้ "ข้างใน" เนื้ออ่างตัน มองไม่เห็นน้ำเลย */
          const rim=torus(.34,.045,shade(col,1.2),18); rim.rotation.x=Math.PI/2; rim.position.y=.9; g.add(rim);
          const water=cyl(.31,.31,.05,0x4dd0e1,18); water.position.y=.91;
          water.userData.anim={kind:'pulse', sp:.8, amp:.03, ph:0}; g.add(water);  /* น้ำกระเพื่อมตอนนกเล่นน้ำ */
          /* นกตัวจิ๋ว "ลงเล่นในอ่าง" — ตัวอยู่กลางอ่าง ท้องจมใต้ผิวน้ำนิดหน่อย (ของเดิมเกาะขอบอ่างที่ x=.34
             ตัวเลยไปค้างครึ่งตัวนอกอ่างเหมือนกำลังจะตก) และเปลี่ยนเป็นโทนส้มปะการังให้ตัดกับน้ำสีฟ้าเทอร์ควอยซ์
             ทั้งตัวอยู่ใน group เดียว แล้วขยับที่ group — ถ้าติด anim แยกทีละชิ้น collectDecorAnim()
             จะแจกเฟสให้คนละค่า หัว/ปาก/หาง/ปีกจะเด้งสวนทางกันจนนกหลุดเป็นชิ้นๆ */
          const bd=new k.THREE.Group(); bd.position.set(.03,.96,0); g.add(bd);
          bd.userData.anim={kind:'bob', sp:1.8, amp:.04, ph:0};                    /* amp น้อยกว่าเดิม ตัวนกจะได้ไม่ลอยพ้นน้ำ */
          const body=ball(.1,0xef6c5a,12); bd.add(body);
          const head=ball(.065,0xff8f78,10); head.position.set(.07,.08,0); bd.add(head);
          const beak=cone(.03,.07,0xffca28,6); beak.rotation.z=-Math.PI/2; beak.position.set(.14,.08,0); bd.add(beak);
          [.05,-.05].forEach(z=>{                                                  /* ตาสองข้าง เด็กหมุนของแล้วยังเห็นหน้านกอยู่ */
            const eye=ball(.019,0x4e342e,6); eye.position.set(.11,.105,z); bd.add(eye);
          });
          const tail=cone(.05,.11,0xef6c5a,6); tail.rotation.z=Math.PI/2; tail.position.set(-.11,.05,0); bd.add(tail);
          const wing=ball(.062,0xffd5c2,8); wing.scale.set(1.25,.55,.9); wing.position.set(-.01,.02,.075); bd.add(wing);
        } },
      { id:'wheelbarrow', name:'รถเข็นสวน', cat:'decorout', scope:'out', emoji:'🛒', fw:2, fd:1, colors:[0xef5350,0x42a5f5,0x66bb6a],
        build(g,col){
          const tray=box(.8,.34,.6,col,.06); tray.position.set(0,.5,.1); tray.rotation.x=-.12; g.add(tray);
          const wheel=cyl(.2,.2,.1,0x37474f,16); wheel.rotation.z=Math.PI/2; wheel.position.set(0,.2,.6); g.add(wheel);
          [-1,1].forEach(s=>{ const handle=cyl(.03,.03,1.0,0x8d6e63,8); handle.rotation.x=Math.PI/2.4; handle.position.set(s*.3,.42,-.4); g.add(handle);
            const leg=cyl(.03,.03,.3,0x9e9e9e,8); leg.position.set(s*.3,.15,-.2); g.add(leg); });
          const soil=box(.7,.1,.5,0x6d4c41,.04); soil.position.set(0,.62,.1); soil.rotation.x=-.12; g.add(soil);
          const sprout=ball(.06,0x66bb6a,8); sprout.position.set(0,.72,.1); g.add(sprout);
        } },
      { id:'string-lights', name:'ไฟประดับสวน', cat:'decorout', scope:'out', emoji:'✨', fw:2, fd:1, colors:BRIGHT,
        action:'toggle', light:{y:1.3, color:0xfff0d0, dist:4.5, intensity:.8},
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.04,.04,1.6,0x8d6e63,8); post.position.set(s*.8,.8,0); g.add(post); });
          for(let i=0;i<=8;i++){ const t=i/8; const x=-.8+t*1.6; const y=1.5-Math.sin(t*Math.PI)*.4; const bulb=ball(.06,[0xef5350,0xffd54f,0x66bb6a,0x42a5f5,0xf06292][i%5],8); bulb.position.set(x,y,0); bulb.userData.bulb=true;
        bulb.userData.anim={kind:'pulse', sp:.8, amp:.2, ph:i*.9}; g.add(bulb); }   /* หลอดไฟเต้นสลับกันเป็นระลอก */
        } },
      { id:'wooden-bridge', name:'สะพานไม้', cat:'decorout', scope:'out', emoji:'🌉', block:false, fw:2, fd:1, colors:WOOD,
        build(g,col){
          for(let i=0;i<7;i++){ const t=i/6; const x=-.75+t*1.5; const y=.12+Math.sin(t*Math.PI)*.18; const plank=box(.2,.06,.7,col,.02); plank.position.set(x,y,0); plank.rotation.z=Math.cos(t*Math.PI)*.3; g.add(plank); }
          [-1,1].forEach(s=>{ for(let i=0;i<7;i++){ const t=i/6; const x=-.75+t*1.5; const y=.12+Math.sin(t*Math.PI)*.18; const rail=ball(.04,shade(col,.8),6); rail.position.set(x,y+.28,s*.34); g.add(rail); } });
        } },
      { id:'campfire', name:'กองไฟ', cat:'decorout', scope:'out', emoji:'🔥', colors:[0xff7043,0xef5350,0xffa726],
        action:'toggle', light:{y:.5, color:0xff7a2a, dist:5, intensity:1.5, alwaysOn:true, flicker:true},
        build(g,col){
          for(let i=0;i<4;i++){ const a=i/4*Math.PI*2; const logL=cyl(.05,.06,.5,0x8d6e63,8); logL.rotation.z=Math.PI/2.4; logL.rotation.y=a; logL.position.set(Math.cos(a)*.14,.1,Math.sin(a)*.14); g.add(logL); }
          for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const st=ball(.07,0x90a4ae,8); st.scale.set(1,.7,1); st.position.set(Math.cos(a)*.3,.05,Math.sin(a)*.3); g.add(st); }
          [[0,.3],[.08,.5],[-.08,.44]].forEach(([x,h],i)=>{ const fl=cone(.14,h*.7,col,8); fl.position.set(x,h*.6,0);
            fl.userData.bulb=true; fl.userData.anim={kind:'flame', ph:i*2.1}; g.add(fl); });
        } },

      /* ============================================================
         เฟส 8 — ขยายคลัง 116 → 180 ชิ้น (ข้อ 27 ของ QUEST-DESIGN.md)
         ⚠ ของใหม่ทุกชิ้นต้อง: มี id ไม่ซ้ำ · อยู่ในหมวดที่มีร้านขายอยู่แล้ว ·
           มีราคาใน FURN_TIER ของ js/house-shop.js (ไม่ใส่ = ระดับ 2 อัตโนมัติ แต่ควรใส่ให้ตรงขนาด)
         ⚠ `torus()` คืนวงที่ "ตั้งฉาก" (ระนาบ XY) ⇒ ห่วงที่ต้องวางแบนต้องใส่ rotation.x = PI/2 เองเสมอ
         ============================================================ */

      /* ============ ในบ้าน — ที่นั่ง (เฟส 8 · +6) ============ */
      { id:'love-seat', name:'โซฟาสองที่นั่ง', cat:'seat', scope:'in', emoji:'🛏', fw:2, fd:1, colors:FABRIC,
        action:'sit', sit:{sy:.5},
        build(g,col){
          const base=cushion(1.5,.34,.72,col); base.position.y=.28; g.add(base);
          const back=cushion(1.5,.5,.16,shade(col,.92)); back.position.set(0,.66,-.3); g.add(back);
          [-1,1].forEach(s=>{ const arm=cushion(.18,.34,.72,shade(col,1.08)); arm.position.set(s*.66,.56,0); g.add(arm); });
          [-.38,.38].forEach(x=>{ const p=cushion(.5,.12,.5,shade(col,1.15)); p.position.set(x,.5,.04); g.add(p); });
          legs(g,.6,.28,.12,0x8d6e63,.04);
        } },
      { id:'papasan', name:'เก้าอี้กลมนุ่ม', cat:'seat', scope:'in', emoji:'🧶', colors:SOFT,
        action:'sit', sit:{sy:.42},
        build(g,col){
          const bowl=ball(.46,col,16); bowl.scale.set(1,.55,1); bowl.position.y=.42; g.add(bowl);
          const rim=torus(.44,.05,shade(col,.82),16); rim.rotation.x=Math.PI/2; rim.position.y=.5; g.add(rim);
          const stand=cyl(.3,.34,.3,shade(col,.7),12); stand.position.y=.15; g.add(stand);
        } },
      { id:'stool-round', name:'สตูลกลมนุ่ม', cat:'seat', scope:'in', emoji:'🔵', colors:FABRIC,
        action:'sit', sit:{sy:.4},
        build(g,col){
          const top=cyl(.26,.26,.14,col,16); top.position.y=.38; g.add(top);
          const skirt=cyl(.24,.26,.3,shade(col,.9),16); skirt.position.y=.16; g.add(skirt);
          const btn=ball(.04,shade(col,1.2),8); btn.position.y=.45; g.add(btn);
        } },
      { id:'floor-sofa', name:'โซฟาญี่ปุ่น', cat:'seat', scope:'in', emoji:'🟩', fw:2, fd:1, colors:FABRIC,
        action:'sit', sit:{sy:.26},
        build(g,col){
          const seat=cushion(1.4,.2,.7,col); seat.position.y=.12; g.add(seat);
          const back=cushion(1.4,.42,.14,shade(col,.9)); back.position.set(0,.32,-.3); g.add(back);
          [-.36,.36].forEach(x=>{ const p=cushion(.42,.1,.42,shade(col,1.15)); p.position.set(x,.26,.02); g.add(p); });
        } },
      { id:'swing-chair', name:'เก้าอี้แขวน', cat:'seat', scope:'in', emoji:'🪺', colors:SOFT,
        action:'sit', sit:{sy:.55},
        build(g,col){
          const rope=cyl(.02,.02,.7,0xbcaaa4,6); rope.position.y=1.42; g.add(rope);
          const shell=ball(.42,col,16); shell.scale.set(1,.9,1); shell.position.y=.72; g.add(shell);
          const rim=torus(.4,.045,shade(col,.85),16); rim.rotation.x=Math.PI/2; rim.position.y=.96; g.add(rim);
          const cu=cushion(.46,.14,.36,shade(col,1.15)); cu.position.set(0,.6,.08); g.add(cu);
        } },
      { id:'pouf', name:'พูฟถักนุ่ม', cat:'seat', scope:'in', emoji:'🧵', colors:FABRIC,
        action:'sit', sit:{sy:.28},
        build(g,col){
          const body=cyl(.28,.3,.26,col,16); body.position.y=.13; g.add(body);
          for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; const rib=cyl(.015,.015,.26,shade(col,.86),6);
            rib.position.set(Math.cos(a)*.29,.13,Math.sin(a)*.29); g.add(rib); }
          const top=cyl(.28,.28,.05,shade(col,1.1),16); top.position.y=.28; g.add(top);
        } },

      /* ============ ในบ้าน — โต๊ะ (เฟส 8 · +6) ============ */
      { id:'study-desk', top:.76, name:'โต๊ะเรียน', cat:'table', scope:'in', emoji:'📔', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const top=box(1.5,.1,.7,col,.04); top.position.y=.72; g.add(top);
          legs(g,.66,.28,.72,shade(col,.82),.05);
          const shelf=box(1.4,.06,.2,shade(col,1.08),.03); shelf.position.set(0,1.02,-.24); g.add(shelf);
          [-1,1].forEach(s=>{ const side=box(.06,.3,.2,shade(col,1.08),.03); side.position.set(s*.7,.88,-.24); g.add(side); });
          const bk=box(.1,.24,.16,BRIGHT[4],.02); bk.position.set(-.5,1.16,-.24); g.add(bk);
        } },
      { id:'art-table', top:.6, name:'โต๊ะวาดรูป', cat:'table', scope:'in', emoji:'🎨', fw:2, fd:1, colors:PLASTIC,
        build(g,col){
          const top=box(1.3,.08,.66,col,.05); top.position.y=.56; top.rotation.x=-.12; g.add(top);
          legs(g,.56,.26,.56,shade(col,.82),.05);
          const tray=box(1.3,.05,.12,shade(col,1.15),.03); tray.position.set(0,.48,.3); g.add(tray);
          [-.3,0,.3].forEach((x,i)=>{ const pen=cyl(.03,.03,.16,BRIGHT[i*2],8); pen.rotation.z=Math.PI/2;
            pen.position.set(x,.54,.3); g.add(pen); });
        } },
      { id:'round-coffee', top:.42, name:'โต๊ะกาแฟกลม', cat:'table', scope:'in', emoji:'☕', colors:WOOD,
        build(g,col){
          const top=cyl(.44,.44,.08,col,20); top.position.y=.4; g.add(top);
          const post=cyl(.07,.09,.34,shade(col,.82),10); post.position.y=.2; g.add(post);
          const base=cyl(.26,.26,.05,shade(col,.82),16); base.position.y=.03; g.add(base);
        } },
      { id:'nest-tables', top:.46, name:'โต๊ะซ้อนคู่', cat:'table', scope:'in', emoji:'🪆', colors:WOOD,
        build(g,col){
          const t1=box(.5,.06,.5,col,.03); t1.position.set(-.12,.44,0); g.add(t1);
          legs(g,.2,.2,.44,shade(col,.82),.035);
          const t2=box(.42,.06,.42,shade(col,1.12),.03); t2.position.set(.26,.3,.1); g.add(t2);
          [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{ const L=cyl(.03,.03,.3,shade(col,.86),6);
            L.position.set(.26+sx*.16,.15,.1+sz*.16); g.add(L); });
        } },
      { id:'craft-cart', top:.7, name:'รถเข็นของ', cat:'table', scope:'in', emoji:'🧰', colors:PLASTIC,
        build(g,col){
          [0,.34,.66].forEach((y,i)=>{ const sh=box(.6,.05,.44,i?shade(col,1.05):col,.03); sh.position.y=y+.16; g.add(sh); });
          [-1,1].forEach(s=>{ const bar=cyl(.025,.025,.7,shade(col,.8),8); bar.position.set(s*.28,.42,0); g.add(bar); });
          const handle=cyl(.02,.02,.5,shade(col,.8),8); handle.rotation.z=Math.PI/2; handle.position.set(0,.9,-.2); g.add(handle);
          [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{ const w=torus(.05,.02,0x546e7a,10);
            w.position.set(sx*.26,.06,sz*.18); g.add(w); });
        } },
      { id:'kids-table', top:.44, name:'โต๊ะเด็กเล็ก', cat:'table', scope:'in', emoji:'🔶', fw:2, fd:2, colors:PLASTIC,
        build(g,col){
          const top=cyl(.6,.6,.08,col,20); top.position.y=.42; g.add(top);
          legs(g,.36,.36,.42,shade(col,.85),.05);
          const star=ball(.07,shade(col,1.25),8); star.scale.set(1,.4,1); star.position.y=.47; g.add(star);
        } },

      /* ============ ในบ้าน — ห้องนอน (เฟส 8 · +6) ============ */
      { id:'day-bed', name:'เตียงเดย์เบด', cat:'bed', scope:'in', emoji:'🟨', fw:2, fd:1, colors:FABRIC,
        action:'sleep', sit:{sy:.44},
        build(g,col){
          const base=box(1.6,.3,.76,shade(col,.8),.05); base.position.y=.2; g.add(base);
          const mat=cushion(1.5,.2,.7,col); mat.position.y=.44; g.add(mat);
          const back=box(1.6,.4,.1,shade(col,.85),.04); back.position.set(0,.7,-.36); g.add(back);
          const pil=cushion(.44,.14,.3,shade(col,1.2)); pil.position.set(-.5,.58,-.16); g.add(pil);
        } },
      { id:'hammock-in', name:'เปลญวนในบ้าน', cat:'bed', scope:'in', emoji:'🪢', fw:2, fd:1, colors:FABRIC,
        action:'sleep', sit:{sy:.5},
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.07,1.1,0x8d6e63,10); post.position.set(s*.78,.55,0); g.add(post);
            const foot=box(.24,.08,.5,0x8d6e63,.03); foot.position.set(s*.78,.04,0); g.add(foot); });
          for(let i=0;i<9;i++){ const t=i/8; const x=-.7+t*1.4; const y=.9-Math.sin(t*Math.PI)*.42;
            const strip=box(.16,.05,.56,col,.02); strip.position.set(x,y,0); g.add(strip); }
        } },
      { id:'toy-chest-bed', name:'ตู้ลิ้นชักเตี้ย', cat:'bed', scope:'in', emoji:'🧳', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const body=box(1.3,.6,.5,col,.04); body.position.y=.32; g.add(body);
          [0,1].forEach(r=>[-1,1].forEach(s=>{ const dr=box(.58,.22,.04,shade(col,1.12),.02);
            dr.position.set(s*.32,.2+r*.26,.26); g.add(dr);
            const kn=ball(.035,shade(col,.7),8); kn.position.set(s*.32,.2+r*.26,.3); g.add(kn); }));
          legs(g,.58,.2,.06,shade(col,.8),.04);
        } },
      { id:'dress-mirror', name:'กระจกยืน', cat:'bed', scope:'in', emoji:'💠', colors:WOOD,
        build(g,col){
          const frame=torus(.3,.05,col,20); frame.scale.set(1,1.4,1); frame.position.y=.95; g.add(frame);
          const glass=cyl(.28,.28,.03,0xd6ecf5,20); glass.rotation.x=Math.PI/2; glass.scale.set(1,1,1.4); glass.position.y=.95; g.add(glass);
          const post=cyl(.04,.05,.6,shade(col,.82),8); post.position.y=.3; g.add(post);
          const base=cyl(.2,.22,.06,shade(col,.82),16); base.position.y=.03; g.add(base);
        } },
      { id:'canopy-bed', name:'เตียงมีผ้าคลุม', cat:'bed', scope:'in', emoji:'🏰', fw:2, fd:2, colors:FABRIC,
        action:'sleep', sit:{sy:.48},
        build(g,col){
          const base=box(1.5,.3,1.7,0x8d6e63,.05); base.position.y=.2; g.add(base);
          const mat=cushion(1.42,.22,1.6,col); mat.position.y=.46; g.add(mat);
          const pil=cushion(.5,.16,.34,shade(col,1.2)); pil.position.set(0,.6,-.6); g.add(pil);
          [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{ const p=cyl(.045,.045,1.5,0x8d6e63,8);
            p.position.set(sx*.7,.75,sz*.8); g.add(p); });
          const roof=box(1.5,.06,1.7,shade(col,1.1),.03); roof.position.y=1.5; g.add(roof);
          [-1,1].forEach(s=>{ const drape=box(.06,.7,1.5,shade(col,1.18),.03); drape.position.set(s*.7,1.1,0); g.add(drape); });
        } },
      { id:'night-light', name:'โคมไฟดวงจันทร์', cat:'bed', scope:'in', emoji:'🌙', colors:[0xfff59d,0xb3e5fc,0xf8bbd0],
        action:'toggle', light:{y:.5, color:0xfff2c0, dist:3, intensity:.7},
        build(g,col){
          const moon=ball(.2,col,16); moon.position.y=.5; moon.userData.bulb=true; g.add(moon);
          const bite=ball(.13,0xfffdf7,12); bite.position.set(.13,.56,.06); g.add(bite);
          const post=cyl(.03,.04,.34,0xbcaaa4,8); post.position.y=.17; g.add(post);
          const base=cyl(.14,.15,.05,0xbcaaa4,14); base.position.y=.025; g.add(base);
        } },

      /* ============ ในบ้าน — ครัว (เฟส 8 · +8) ============ */
      { id:'blender', top:.5, name:'เครื่องปั่น', cat:'kitchen', scope:'in', emoji:'🥤', colors:PLASTIC,
        action:'toggle',
        build(g,col){
          const base=box(.24,.18,.24,col,.04); base.position.y=.1; g.add(base);
          const jar=cyl(.13,.11,.34,0xd6ecf5,14); jar.position.y=.36; g.add(jar);
          const lid=cyl(.14,.14,.05,shade(col,.8),14); lid.position.y=.55; g.add(lid);
          const btn=ball(.03,0xef5350,8); btn.position.set(0,.14,.13); g.add(btn);
        } },
      { id:'toaster', top:.42, name:'เครื่องปิ้งขนมปัง', cat:'kitchen', scope:'in', emoji:'🍞', colors:[0xef5350,0x90caf9,0xfff59d],
        build(g,col){
          const body=box(.34,.24,.22,col,.06); body.position.y=.14; g.add(body);
          [-1,1].forEach(s=>{ const slot=box(.1,.03,.14,0x455a64,.01); slot.position.set(s*.08,.27,0); g.add(slot); });
          const lever=cyl(.02,.02,.1,shade(col,.7),8); lever.rotation.z=Math.PI/2; lever.position.set(.19,.18,0); g.add(lever);
          const bread=box(.09,.1,.12,0xffcc80,.02); bread.position.set(-.08,.32,0); g.add(bread);
        } },
      { id:'spice-rack', wall:true, name:'ชั้นเครื่องเทศ', cat:'kitchen', scope:'in', emoji:'🧂', colors:WOOD,
        build(g,col){
          const sh=box(.6,.05,.16,col,.02); sh.position.y=1.1; g.add(sh);
          const sh2=box(.6,.05,.16,col,.02); sh2.position.y=.82; g.add(sh2);
          [-1,1].forEach(s=>{ const side=box(.05,.36,.16,shade(col,.85),.02); side.position.set(s*.3,.96,0); g.add(side); });
          [1.1,.82].forEach((y,r)=>{ for(let i=0;i<4;i++){ const j=cyl(.035,.035,.13,BRIGHT[(i+r*2)%BRIGHT.length],10);
            j.position.set(-.2+i*.14,y+.09,0); g.add(j); } });
        } },
      { id:'kettle-set', top:.4, name:'กาต้มน้ำ', cat:'kitchen', scope:'in', emoji:'♨️', colors:PLASTIC,
        build(g,col){
          const body=cyl(.16,.14,.26,col,14); body.position.y=.15; g.add(body);
          const lid=cyl(.14,.12,.05,shade(col,.8),14); lid.position.y=.3; g.add(lid);
          const kn=ball(.03,shade(col,.7),8); kn.position.y=.35; g.add(kn);
          const sp=cyl(.03,.05,.18,shade(col,.85),8); sp.rotation.z=-.9; sp.position.set(.17,.22,0); g.add(sp);
          const hd=torus(.09,.02,shade(col,.7),12); hd.position.set(-.16,.22,0); g.add(hd);
        } },
      { id:'dish-rack', top:.36, name:'ที่คว่ำจาน', cat:'kitchen', scope:'in', emoji:'🥄', colors:[0xb0bec5,0x90caf9],
        build(g,col){
          const tray=box(.5,.05,.34,col,.03); tray.position.y=.03; g.add(tray);
          for(let i=0;i<5;i++){ const bar=cyl(.012,.012,.24,shade(col,.85),6); bar.position.set(-.16+i*.08,.17,0); g.add(bar); }
          [-.14,0,.14].forEach((x,i)=>{ const plate=cyl(.11,.11,.02,0xfffdf7,14); plate.rotation.z=Math.PI/2;
            plate.position.set(x,.19,0); g.add(plate); });
        } },
      { id:'trash-bin', name:'ถังขยะแยก', cat:'kitchen', scope:'in', emoji:'🗑️', colors:[0x66bb6a,0x42a5f5,0xffca28],
        action:'toggle',
        build(g,col){
          const body=cyl(.2,.17,.5,col,14); body.position.y=.25; g.add(body);
          const lid=cyl(.21,.21,.05,shade(col,.75),14); lid.position.y=.53; g.add(lid);
          const kn=cyl(.03,.03,.05,shade(col,.6),8); kn.position.y=.58; g.add(kn);
          const sign=box(.1,.1,.01,0xfffdf7,.01); sign.position.set(0,.3,.18); g.add(sign);
        } },
      { id:'pot-shelf', wall:true, name:'ชั้นแขวนหม้อ', cat:'kitchen', scope:'in', emoji:'🍲', colors:WOOD,
        build(g,col){
          const bar=cyl(.025,.025,.9,shade(col,.8),8); bar.rotation.z=Math.PI/2; bar.position.y=1.25; g.add(bar);
          [[-.28,.16],[0,.2],[.28,.15]].forEach(([x,r],i)=>{ const hook=cyl(.012,.012,.14,0x9e9e9e,6);
            hook.position.set(x,1.17,0); g.add(hook);
            const pot=cyl(r,r*.85,r*1.1,BRIGHT[i*3%BRIGHT.length],12); pot.position.set(x,1.02-r*.3,0); g.add(pot); });
        } },
      { id:'fruit-bowl', top:.3, name:'ชามผลไม้', cat:'kitchen', scope:'in', emoji:'🍎', colors:[0xfffdf7,0xffcc80],
        build(g,col){
          const bowl=ball(.2,col,16); bowl.scale.set(1,.5,1); bowl.position.y=.1; g.add(bowl);
          [[0,0,0xef5350],[.09,.04,0xffca28],[-.08,.03,0x66bb6a],[.02,.1,0xab47bc]].forEach(([x,z,c])=>{
            const f=ball(.07,c,10); f.position.set(x,.17,z); g.add(f); });
        } },

      /* ============ ในบ้าน — ห้องน้ำ (เฟส 8 · +5) ============ */
      { id:'duck-tub', name:'อ่างเป็ดยาง', cat:'bath', scope:'in', emoji:'🐤', fw:2, fd:1, colors:[0xfff59d,0x90caf9,0xf8bbd0],
        action:'bounce',
        build(g,col){
          const tub=box(1.2,.4,.7,shade(col,1.15),.16); tub.position.y=.22; g.add(tub);
          const water=box(1.08,.06,.6,0x81d4fa,.06); water.position.y=.42; g.add(water);
          const body=ball(.15,0xffee58,12); body.scale.set(1.2,1,1); body.position.set(.2,.5,0); g.add(body);
          const head=ball(.09,0xffee58,10); head.position.set(.33,.62,0); g.add(head);
          const beak=cone(.05,.08,0xff9800,8); beak.rotation.z=-Math.PI/2; beak.position.set(.42,.61,0); g.add(beak);
          legs(g,.5,.28,.06,shade(col,.7),.04);
        } },
      { id:'towel-shelf', wall:true, name:'ชั้นผ้าเช็ดตัว', cat:'bath', scope:'in', emoji:'🧖', colors:WOOD,
        build(g,col){
          const sh=box(.66,.06,.24,col,.02); sh.position.y=1.2; g.add(sh);
          [-1,1].forEach(s=>{ const br=box(.05,.2,.22,shade(col,.85),.02); br.position.set(s*.3,1.1,0); g.add(br); });
          [[-.18,0xef9a9a],[0,0x90caf9],[.18,0xa5d6a7]].forEach(([x,c])=>{ const t=cyl(.09,.09,.2,c,12);
            t.rotation.z=Math.PI/2; t.position.set(x,1.32,0); g.add(t); });
          const bar=cyl(.02,.02,.6,shade(col,.8),8); bar.rotation.z=Math.PI/2; bar.position.y=1.0; g.add(bar);
          const hang=box(.16,.28,.03,0xf8bbd0,.02); hang.position.set(-.14,.86,0); g.add(hang);
        } },
      { id:'flower-mirror', wall:true, name:'กระจกดอกไม้', cat:'bath', scope:'in', emoji:'💮', colors:[0xf8bbd0,0xfff59d,0xb3e5fc],
        build(g,col){
          const glass=cyl(.24,.24,.03,0xd6ecf5,20); glass.rotation.x=Math.PI/2; glass.position.y=1.3; g.add(glass);
          for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; const pet=ball(.09,col,10); pet.scale.set(1,.6,1);
            pet.position.set(Math.cos(a)*.26,1.3+Math.sin(a)*.26,.02); g.add(pet); }
        } },
      { id:'bath-toys', name:'กล่องของเล่นอาบน้ำ', cat:'bath', scope:'in', emoji:'🛟', colors:PLASTIC,
        build(g,col){
          const bin=box(.42,.3,.3,col,.05); bin.position.y=.16; g.add(bin);
          const duck=ball(.08,0xffee58,10); duck.position.set(-.1,.36,0); g.add(duck);
          const bk=ball(.06,0xef5350,10); bk.position.set(.06,.34,.05); g.add(bk);
          const bt=cyl(.05,.05,.12,0x66bb6a,10); bt.position.set(.14,.36,-.04); g.add(bt);
        } },
      { id:'step-stool', name:'บันไดเด็กล้างมือ', cat:'bath', scope:'in', emoji:'🔺', colors:PLASTIC,
        action:'sit', sit:{sy:.3},
        build(g,col){
          const top=box(.44,.06,.3,col,.03); top.position.y=.3; g.add(top);
          const mid=box(.44,.06,.26,shade(col,1.1),.03); mid.position.set(0,.16,.12); g.add(mid);
          [-1,1].forEach(s=>{ const side=box(.05,.3,.34,shade(col,.85),.02); side.position.set(s*.22,.15,0); g.add(side); });
        } },

      /* ============ ในบ้าน — ตกแต่ง (เฟส 8 · +10) ============ */
      { id:'star-mobile', name:'โมบายดาว', cat:'decor', scope:'in', emoji:'⭐', colors:[0xfff59d,0xb3e5fc,0xf8bbd0],
        action:'spin',
        build(g,col){
          const hub=ball(.06,shade(col,.8),10); hub.position.y=1.5; g.add(hub);
          for(let i=0;i<4;i++){ const a=i/4*Math.PI*2; const r=.26;
            const str=cyl(.008,.008,.3,0xbcaaa4,6); str.position.set(Math.cos(a)*r,1.35,Math.sin(a)*r); g.add(str);
            const st=ball(.09,i%2?col:shade(col,1.2),8); st.scale.set(1,1,.4);
            st.position.set(Math.cos(a)*r,1.16,Math.sin(a)*r); g.add(st); }
          const bar=cyl(.015,.015,.54,0xbcaaa4,6); bar.rotation.z=Math.PI/2; bar.position.y=1.44; g.add(bar);
          const bar2=cyl(.015,.015,.54,0xbcaaa4,6); bar2.rotation.x=Math.PI/2; bar2.position.y=1.44; g.add(bar2);
        } },
      { id:'chalkboard', wall:true, name:'กระดานดำ', cat:'decor', scope:'in', emoji:'🖍️', colors:WOOD,
        build(g,col){
          const frame=box(.9,.7,.06,col,.03); frame.position.y=1.1; g.add(frame);
          const board=box(.78,.58,.03,0x37474f,.02); board.position.set(0,1.1,.04); g.add(board);
          const tray=box(.9,.05,.1,shade(col,.85),.02); tray.position.set(0,.74,.06); g.add(tray);
          [-.2,0,.2].forEach((x,i)=>{ const ch=cyl(.02,.02,.1,[0xfffdf7,0xffee58,0xf48fb1][i],8);
            ch.rotation.z=Math.PI/2; ch.position.set(x,.79,.08); g.add(ch); });
        } },
      { id:'toy-shelf', name:'ชั้นเก็บของเล่น', cat:'decor', scope:'in', emoji:'🧩', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const back=box(1.3,1.0,.06,col,.03); back.position.set(0,.5,-.2); g.add(back);
          [.28,.66].forEach(y=>{ const sh=box(1.3,.06,.42,shade(col,1.08),.03); sh.position.set(0,y,0); g.add(sh); });
          [-1,1].forEach(s=>{ const side=box(.06,1.0,.42,shade(col,.9),.03); side.position.set(s*.62,.5,0); g.add(side); });
          [[-.38,.42,0],[0,.42,2],[.38,.42,4],[-.38,.8,1],[.38,.8,3]].forEach(([x,y,c])=>{
            const bin=box(.32,.22,.3,BRIGHT[c%BRIGHT.length],.04); bin.position.set(x,y,0); g.add(bin); });
        } },
      { id:'growth-chart', wall:true, name:'ที่วัดส่วนสูง', cat:'decor', scope:'in', emoji:'📏', colors:[0xffcc80,0xa5d6a7,0x90caf9],
        build(g,col){
          const board=box(.18,1.6,.04,col,.02); board.position.y=.9; g.add(board);
          for(let i=0;i<8;i++){ const t=box(i%2?.08:.13,.02,.02,0x6d4c41,.01);
            t.position.set(i%2?-.03:0,.3+i*.18,.03); g.add(t); }
          const giraffe=ball(.08,0xffca28,10); giraffe.position.set(0,1.76,.02); g.add(giraffe);
        } },
      { id:'beanbag-frog', name:'ตุ๊กตากบยักษ์', cat:'decor', scope:'in', emoji:'🐸', colors:[0x66bb6a,0x81c784],
        action:'bounce',
        build(g,col){
          const body=ball(.34,col,16); body.scale.set(1,.85,1); body.position.y=.3; g.add(body);
          [-1,1].forEach(s=>{ const eye=ball(.11,shade(col,1.15),10); eye.position.set(s*.15,.6,.06); g.add(eye);
            const pup=ball(.05,0x2b2b2b,8); pup.position.set(s*.15,.61,.15); g.add(pup); });
          const mouth=box(.26,.03,.02,0x2b2b2b,.01); mouth.position.set(0,.36,.33); g.add(mouth);
          [-1,1].forEach(s=>{ const leg=ball(.12,shade(col,.9),10); leg.scale.set(1.3,.6,1);
            leg.position.set(s*.3,.1,.14); g.add(leg); });
        } },
      { id:'wall-shelf-cloud', wall:true, name:'ชั้นเมฆลอย', cat:'decor', scope:'in', emoji:'☁️', colors:[0xfffdf7,0xb3e5fc,0xf8bbd0],
        build(g,col){
          [[-.2,0,.14],[0,.04,.18],[.2,0,.14]].forEach(([x,y,r])=>{ const p=ball(r,col,12);
            p.scale.set(1.2,.8,.8); p.position.set(x,1.2+y,0); g.add(p); });
          const sh=box(.62,.05,.2,shade(col,.9),.02); sh.position.y=1.1; g.add(sh);
          const bk=box(.08,.16,.1,BRIGHT[5],.02); bk.position.set(-.16,1.2,0); g.add(bk);
          const tt=ball(.08,0xffcc80,10); tt.position.set(.14,1.2,0); g.add(tt);
        } },
      { id:'floor-globe-big', name:'ลูกโลกตั้งพื้น', cat:'decor', scope:'in', emoji:'🌍', colors:[0x42a5f5,0x66bb6a],
        action:'spin',
        build(g,col){
          const gl=ball(.26,col,18); gl.position.y=.7; g.add(gl);
          [[.1,.72,.2],[-.14,.66,.14],[.06,.86,.1]].forEach(([x,y,r])=>{ const land=ball(r*.6,0x66bb6a,10);
            land.scale.set(1,.7,.4); land.position.set(x,y,.2); g.add(land); });
          const ring=torus(.3,.02,0xffca28,20); ring.rotation.z=.4; ring.position.y=.7; g.add(ring);
          const post=cyl(.04,.05,.44,0x8d6e63,8); post.position.y=.22; g.add(post);
          const base=cyl(.18,.2,.06,0x8d6e63,16); base.position.y=.03; g.add(base);
        } },
      { id:'reading-nook', name:'มุมอ่านหนังสือ', cat:'decor', scope:'in', emoji:'📖', fw:2, fd:1, colors:FABRIC,
        action:'sit', sit:{sy:.3},
        build(g,col){
          const rug=cyl(.6,.6,.03,shade(col,1.1),20); rug.position.y=.015; g.add(rug);
          const cu=cushion(.6,.2,.5,col); cu.position.set(-.2,.12,0); g.add(cu);
          const p1=cushion(.3,.24,.14,shade(col,1.2)); p1.position.set(-.2,.3,-.2); g.add(p1);
          const stack=[0,1,2].map(i=>{ const b=box(.24,.06,.18,BRIGHT[(i*2)%BRIGHT.length],.02);
            b.position.set(.42,.04+i*.07,0); b.rotation.y=i*.2; g.add(b); return b; });
          const lamp=ball(.1,0xfff59d,10); lamp.position.set(.5,.5,-.1); g.add(lamp);
        } },
      { id:'pet-bed-in', name:'ที่นอนสัตว์เลี้ยง', cat:'decor', scope:'in', emoji:'🐾', colors:SOFT,
        build(g,col){
          const base=cyl(.32,.34,.14,col,18); base.position.y=.07; g.add(base);
          const rim=torus(.31,.07,shade(col,.88),18); rim.rotation.x=Math.PI/2; rim.position.y=.14; g.add(rim);
          const pad=cyl(.24,.24,.05,shade(col,1.18),16); pad.position.y=.15; g.add(pad);
          const paw=ball(.05,shade(col,.8),8); paw.scale.set(1,.4,1); paw.position.y=.18; g.add(paw);
        } },
      { id:'photo-wall', wall:true, name:'ผนังรูปครอบครัว', cat:'decor', scope:'in', emoji:'📸', colors:WOOD,
        build(g,col){
          [[-.26,1.34,.2,.16],[.0,1.42,.16,.2],[.26,1.3,.22,.18],[-.14,1.02,.18,.14],[.18,1.0,.2,.16]]
            .forEach(([x,y,w,h],i)=>{
              const f=box(w,h,.04,i%2?col:shade(col,1.12),.02); f.position.set(x,y,0); g.add(f);
              const ph=box(w-.05,h-.05,.02,[0xb3e5fc,0xfff59d,0xf8bbd0,0xa5d6a7,0xffcc80][i],.01);
              ph.position.set(x,y,.03); g.add(ph); });
        } },

      /* ============ นอกบ้าน — สวน (เฟส 8 · +8) ============ */
      { id:'greenhouse-mini', name:'เรือนกระจกจิ๋ว', cat:'garden', scope:'out', emoji:'🏡', fw:2, fd:2, colors:[0xb3e5fc,0xc8e6c9],
        build(g,col){
          const base=box(1.5,.16,1.5,0x8d6e63,.04); base.position.y=.08; g.add(base);
          const glass=box(1.4,.9,1.4,col,.06); glass.position.y=.6; g.add(glass);
          const roof=cone(1.1,.5,shade(col,.9),4); roof.rotation.y=Math.PI/4; roof.position.y=1.28; g.add(roof);
          [-1,1].forEach(s=>[-1,1].forEach(t=>{ const post=cyl(.03,.03,.9,0x8d6e63,6);
            post.position.set(s*.68,.6,t*.68); g.add(post); }));
          [[-.4,.3],[.4,-.3]].forEach(([x,z])=>{ const pot=cyl(.12,.1,.16,0xd7a86e,10); pot.position.set(x,.24,z); g.add(pot);
            const pl=ball(.14,0x66bb6a,10); pl.scale.set(1,1.2,1); pl.position.set(x,.42,z); g.add(pl); });
        } },
      { id:'lotus-pond', name:'บ่อบัว', cat:'garden', scope:'out', emoji:'🪷', fw:2, fd:2, block:false, colors:[0x4fc3f7,0x81d4fa],
        build(g,col){
          const water=cyl(.78,.78,.1,col,22); water.position.y=.05; g.add(water);
          const rim=torus(.78,.08,0x9e9e9e,22); rim.rotation.x=Math.PI/2; rim.position.y=.06; g.add(rim);
          [[-.3,.2],[.28,-.18],[.1,.34]].forEach(([x,z])=>{ const pad=cyl(.16,.16,.02,0x66bb6a,14);
            pad.position.set(x,.11,z); g.add(pad); });
          [[-.3,.2,0xf8bbd0],[.28,-.18,0xfffdf7]].forEach(([x,z,c])=>{
            for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const pet=ball(.05,c,8); pet.scale.set(1,.5,1.6);
              pet.position.set(x+Math.cos(a)*.06,.15,z+Math.sin(a)*.06); pet.rotation.y=a; g.add(pet); } });
        } },
      { id:'garden-arch-vine', name:'ซุ้มไม้เลื้อย', cat:'garden', scope:'out', emoji:'🍀', fw:2, fd:1, block:false, colors:GREEN,
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.06,1.6,0x8d6e63,8); post.position.set(s*.62,.8,0); g.add(post); });
          const top=torus(.62,.06,0x8d6e63,20,Math.PI); top.position.y=1.6; g.add(top);
          for(let i=0;i<12;i++){ const t=i/11; const a=Math.PI*t;
            const lf=ball(.1,i%2?col:shade(col,1.15),8); lf.scale.set(1,.5,1);
            lf.position.set(Math.cos(a)*.62,1.6+Math.sin(a)*.62,0); g.add(lf); }
        } },
      { id:'veggie-plot', name:'แปลงผัก', cat:'garden', scope:'out', emoji:'🥕', fw:2, fd:1, colors:[0x8d6e63,0xa1887f],
        build(g,col){
          const soil=box(1.4,.16,.66,col,.03); soil.position.y=.08; g.add(soil);
          [-1,1].forEach(s=>{ const edge=box(1.5,.1,.06,0x8d6e63,.02); edge.position.set(0,.1,s*.34); g.add(edge); });
          [[-.45,0xff7043,'carrot'],[0,0x66bb6a,'lettuce'],[.45,0xef5350,'tomato']].forEach(([x,c],i)=>{
            const top=ball(.13,0x66bb6a,10); top.scale.set(1,1.3,1); top.position.set(x,.28,0); g.add(top);
            const fruit=ball(.08,c,10); fruit.position.set(x+.1,.24,.12); g.add(fruit); });
        } },
      { id:'wind-spinner', name:'กังหันลม', cat:'garden', scope:'out', emoji:'🌈', colors:BRIGHT,
        action:'spin',
        build(g,col){
          const post=cyl(.04,.05,1.2,0xbcaaa4,8); post.position.y=.6; g.add(post);
          const hub=ball(.06,shade(col,.8),10); hub.position.y=1.24; g.add(hub);
          for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const bl=box(.26,.12,.02,
            i%2?col:shade(col,1.2),.03); bl.position.set(Math.cos(a)*.2,1.24+Math.sin(a)*.2,.03);
            bl.rotation.z=a; g.add(bl); }
        } },
      { id:'bird-nest-box', name:'รังนก', cat:'garden', scope:'out', emoji:'🪹', colors:WOOD,
        build(g,col){
          const post=cyl(.05,.06,1.1,shade(col,.8),8); post.position.y=.55; g.add(post);
          const nest=ball(.2,0xa1887f,12); nest.scale.set(1,.6,1); nest.position.y=1.16; g.add(nest);
          const hole=ball(.14,0x6d4c41,10); hole.scale.set(1,.5,1); hole.position.y=1.22; g.add(hole);
          [[-.05,.02],[.05,-.03]].forEach(([x,z])=>{ const egg=ball(.05,0xfffdf7,8);
            egg.scale.set(1,1.2,1); egg.position.set(x,1.24,z); g.add(egg); });
        } },
      { id:'berry-bush', name:'พุ่มเบอร์รี', cat:'garden', scope:'out', emoji:'🫐', leafy:true, colors:GREEN,
        build(g,col){
          [[0,.28,.3],[-.2,.22,.24],[.2,.24,.26]].forEach(([x,y,r])=>{ const b=ball(r,col,12);
            b.position.set(x,y,0); g.add(b); });
          for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; const be=ball(.05,i%2?0x5c6bc0:0xab47bc,8);
            be.position.set(Math.cos(a)*.26,.28+Math.sin(a*2)*.12,Math.sin(a)*.2); g.add(be); }
        } },
      { id:'stepping-log', name:'ตอไม้นั่งเล่น', cat:'garden', scope:'out', emoji:'🍂', colors:WOOD,
        action:'sit', sit:{sy:.36},
        build(g,col){
          const trunk=cyl(.24,.26,.36,col,14); trunk.position.y=.18; g.add(trunk);
          const top=cyl(.24,.24,.03,shade(col,1.2),14); top.position.y=.37; g.add(top);
          for(let i=1;i<4;i++){ const ring=torus(.06*i,.008,shade(col,1.05),14);
            ring.rotation.x=Math.PI/2; ring.position.y=.385; g.add(ring); }
          const mush=ball(.07,0xef5350,8); mush.scale.set(1,.6,1); mush.position.set(.2,.42,.1); g.add(mush);
        } },

      /* ============ นอกบ้าน — เครื่องเล่น (เฟส 8 · +5) ============ */
      { id:'tree-house', name:'บ้านต้นไม้', cat:'play', scope:'out', emoji:'🏚️', fw:2, fd:2, colors:WOOD,
        build(g,col){
          const trunk=cyl(.2,.26,1.3,0x8d6e63,12); trunk.position.y=.65; g.add(trunk);
          const leaf=ball(.6,0x66bb6a,14); leaf.position.y=1.9; g.add(leaf);
          const floor=box(1.2,.1,1.2,col,.04); floor.position.y=1.2; g.add(floor);
          const wall=box(.9,.6,.9,shade(col,1.1),.05); wall.position.y=1.55; g.add(wall);
          const roof=cone(.85,.45,0xef5350,4); roof.rotation.y=Math.PI/4; roof.position.y=2.05; g.add(roof);
          for(let i=0;i<5;i++){ const r=box(.36,.05,.1,shade(col,.85),.02);
            r.position.set(0,.2+i*.22,.62); g.add(r); }
        } },
      { id:'jungle-net', name:'ตาข่ายปีนป่าย', cat:'play', scope:'out', emoji:'🕸️', fw:2, fd:1, colors:[0xff7043,0x42a5f5],
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.07,1.4,shade(col,.8),8); post.position.set(s*.68,.7,0); g.add(post); });
          const topBar=cyl(.05,.05,1.4,shade(col,.8),8); topBar.rotation.z=Math.PI/2; topBar.position.y=1.4; g.add(topBar);
          for(let i=0;i<5;i++){ const rope=cyl(.02,.02,1.3,col,6); rope.position.set(-.55+i*.28,.72,0); g.add(rope); }
          for(let j=0;j<4;j++){ const cross=cyl(.02,.02,1.2,col,6); cross.rotation.z=Math.PI/2;
            cross.position.set(0,.35+j*.3,0); g.add(cross); }
        } },
      { id:'balance-beam', name:'คานทรงตัว', cat:'play', scope:'out', emoji:'➖', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const beam=box(1.7,.14,.24,col,.05); beam.position.y=.34; g.add(beam);
          [-1,1].forEach(s=>{ const sup=box(.16,.28,.4,shade(col,.82),.03); sup.position.set(s*.7,.14,0); g.add(sup); });
          for(let i=0;i<5;i++){ const dot=ball(.03,BRIGHT[i%BRIGHT.length],8); dot.position.set(-.6+i*.3,.42,0); g.add(dot); }
        } },
      { id:'mini-maze', name:'เขาวงกตเตี้ย', cat:'play', scope:'out', emoji:'🌀', fw:2, fd:2, colors:GREEN,
        build(g,col){
          const base=box(1.6,.06,1.6,0x9ccc65,.03); base.position.y=.03; g.add(base);
          const seg=(x,z,w,d)=>{ const h=box(w,.4,d,col,.04); h.position.set(x,.23,z); g.add(h); };
          seg(0,-.6,1.5,.14); seg(-.68,0,.14,1.1); seg(.2,-.2,.9,.14);
          seg(.68,.3,.14,.9); seg(-.2,.5,.9,.14);
          const flag=cyl(.02,.02,.3,0xbcaaa4,6); flag.position.set(.1,.2,.1); g.add(flag);
          const fl=box(.16,.1,.02,0xef5350,.01); fl.position.set(.18,.32,.1); g.add(fl);
        } },
      { id:'water-table', name:'โต๊ะเล่นน้ำ', cat:'play', scope:'out', emoji:'💦', fw:2, fd:1, colors:PLASTIC,
        build(g,col){
          const tub=box(1.2,.24,.66,col,.06); tub.position.y=.56; g.add(tub);
          const water=box(1.1,.06,.58,0x4fc3f7,.04); water.position.y=.66; g.add(water);
          legs(g,.5,.26,.46,shade(col,.85),.05);
          [[-.3,.7,0xffee58],[.1,.72,0xef5350],[.34,.7,0x66bb6a]].forEach(([x,y,c])=>{
            const toy=ball(.08,c,10); toy.position.set(x,y,0); g.add(toy); });
        } },

      /* ============ นอกบ้าน — ที่นั่งสนาม (เฟส 8 · +4) ============ */
      { id:'canvas-chair', name:'เก้าอี้ผ้าใบ', cat:'seatout', scope:'out', emoji:'⛺', colors:FABRIC,
        action:'sit', sit:{sy:.44},
        build(g,col){
          const seat=box(.5,.06,.46,col,.03); seat.position.y=.4; seat.rotation.x=.08; g.add(seat);
          const back=box(.5,.5,.06,col,.03); back.position.set(0,.66,-.22); back.rotation.x=.16; g.add(back);
          [-1,1].forEach(s=>{ [[-.2,.55],[.2,.55]].forEach(([z,h])=>{ const L=cyl(.025,.025,h,0x8d6e63,8);
            L.position.set(s*.24,h/2,z); L.rotation.x=z<0?-.2:.2; g.add(L); }); });
        } },
      { id:'picnic-set', name:'ชุดปิกนิก', cat:'seatout', scope:'out', emoji:'🍉', fw:2, fd:2, block:false, colors:FABRIC,
        action:'sit', sit:{sy:.1},
        build(g,col){
          const mat=box(1.5,.04,1.5,col,.05); mat.position.y=.02; g.add(mat);
          for(let i=0;i<4;i++) for(let j=0;j<4;j++){ if((i+j)%2) continue;
            const sq=box(.34,.01,.34,shade(col,1.2),.02); sq.position.set(-.56+i*.38,.045,-.56+j*.38); g.add(sq); }
          const basket=box(.34,.22,.26,0xd7a86e,.05); basket.position.set(-.3,.14,-.3); g.add(basket);
          const hd=torus(.14,.02,0xd7a86e,12); hd.position.set(-.3,.3,-.3); g.add(hd);
          [[.3,.2,0xef5350],[.16,.4,0x66bb6a]].forEach(([x,z,c])=>{ const f=ball(.08,c,10);
            f.position.set(x,.1,z); g.add(f); });
        } },
      { id:'swing-bench', name:'ม้านั่งชิงช้า', cat:'seatout', scope:'out', emoji:'⛩️', fw:2, fd:1, colors:WOOD,
        action:'sit', sit:{sy:.5},
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.07,1.7,shade(col,.8),8); post.position.set(s*.8,.85,0); g.add(post); });
          const bar=cyl(.05,.05,1.7,shade(col,.8),8); bar.rotation.z=Math.PI/2; bar.position.y=1.7; g.add(bar);
          const roof=box(1.7,.06,.7,0xef5350,.03); roof.position.y=1.76; g.add(roof);
          [-1,1].forEach(s=>{ const ch=cyl(.015,.015,.85,0x9e9e9e,6); ch.position.set(s*.6,1.25,0); g.add(ch); });
          const seat=box(1.2,.08,.5,col,.04); seat.position.y=.82; g.add(seat);
          const back=box(1.2,.4,.06,col,.03); back.position.set(0,1.04,-.22); g.add(back);
        } },
      { id:'tree-bench', name:'ม้านั่งรอบต้นไม้', cat:'seatout', scope:'out', emoji:'🎋', fw:2, fd:2, colors:WOOD,
        action:'sit', sit:{sy:.44},
        build(g,col){
          const trunk=cyl(.18,.22,1.5,0x8d6e63,12); trunk.position.y=.75; g.add(trunk);
          const leaf=ball(.66,0x66bb6a,14); leaf.position.y=1.9; g.add(leaf);
          for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const seg=box(.42,.08,.26,col,.03);
            seg.position.set(Math.cos(a)*.52,.42,Math.sin(a)*.52); seg.rotation.y=-a; g.add(seg);
            const L=cyl(.03,.03,.4,shade(col,.8),6); L.position.set(Math.cos(a)*.6,.2,Math.sin(a)*.6); g.add(L); }
        } },

      /* ============ นอกบ้าน — ตกแต่งสวน (เฟส 8 · +6) ============ */
      { id:'house-sign', name:'ป้ายชื่อบ้าน', cat:'decorout', scope:'out', emoji:'🪧', colors:WOOD,
        build(g,col){
          const post=cyl(.05,.06,.9,shade(col,.8),8); post.position.y=.45; g.add(post);
          const board=box(.62,.28,.05,col,.04); board.position.y=.95; g.add(board);
          const heart=ball(.07,0xef5350,10); heart.scale.set(1,1,.4); heart.position.set(-.2,.95,.04); g.add(heart);
          [0,1,2].forEach(i=>{ const w=box(.08,.03,.02,shade(col,.6),.01); w.position.set(0+i*.12,.95,.04); g.add(w); });
        } },
      { id:'garden-lantern', name:'โคมไฟญี่ปุ่น', cat:'decorout', scope:'out', emoji:'🕯️', colors:[0xef5350,0xffca28,0xfffdf7],
        action:'toggle', light:{y:.7, color:0xffb74d, dist:4, intensity:.9},
        build(g,col){
          const base=cyl(.18,.2,.1,0x9e9e9e,12); base.position.y=.05; g.add(base);
          const post=cyl(.05,.05,.4,0x9e9e9e,8); post.position.y=.28; g.add(post);
          const body=cyl(.16,.16,.28,col,14); body.position.y=.62; body.userData.bulb=true; g.add(body);
          const roof=cone(.24,.14,0x546e7a,8); roof.position.y=.84; g.add(roof);
          const top=ball(.04,0x546e7a,8); top.position.y=.93; g.add(top);
        } },
      { id:'stone-lantern-row', name:'ไฟราวประดับ', cat:'decorout', scope:'out', emoji:'🎆', fw:2, fd:1, block:false,
        colors:[0xfff59d,0xb3e5fc,0xf8bbd0],
        action:'toggle', light:{y:.6, color:0xfff2c0, dist:4.5, intensity:.8},
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.03,.04,.9,0xbcaaa4,6); post.position.set(s*.72,.45,0); g.add(post); });
          for(let i=0;i<7;i++){ const t=i/6; const x=-.72+t*1.44; const y=.86-Math.sin(t*Math.PI)*.16;
            const bulb=ball(.06,col,8); bulb.position.set(x,y,0); bulb.userData.bulb=true; g.add(bulb); }
        } },
      { id:'garden-cart', name:'รถเข็นดอกไม้', cat:'decorout', scope:'out', emoji:'💐', fw:2, fd:1, colors:WOOD,
        build(g,col){
          const body=box(.9,.34,.5,col,.05); body.position.y=.34; g.add(body);
          [-1,1].forEach(s=>{ const w=torus(.22,.05,shade(col,.7),16); w.position.set(s*.5,.22,0); g.add(w);
            for(let i=0;i<6;i++){ const a=i/6*Math.PI; const sp=cyl(.015,.015,.4,shade(col,.85),6);
              sp.rotation.z=a; sp.position.set(s*.5,.22,0); g.add(sp); } });
          const handle=cyl(.03,.03,.5,shade(col,.8),8); handle.rotation.z=.4; handle.position.set(-.62,.5,0); g.add(handle);
          [[-.24,0xef5350],[0,0xffca28],[.24,0xab47bc]].forEach(([x,c])=>{
            const fl=ball(.11,c,10); fl.position.set(x,.58,0); g.add(fl);
            const st=cyl(.02,.02,.16,0x66bb6a,6); st.position.set(x,.5,0); g.add(st); });
        } },
      { id:'sun-dial', name:'นาฬิกาแดด', cat:'decorout', scope:'out', emoji:'🌞', colors:[0x9e9e9e,0xbcaaa4],
        build(g,col){
          const base=cyl(.2,.24,.14,col,16); base.position.y=.07; g.add(base);
          const post=cyl(.08,.1,.5,col,12); post.position.y=.38; g.add(post);
          const face=cyl(.3,.3,.05,shade(col,1.2),20); face.position.y=.66; g.add(face);
          const gn=box(.03,.24,.24,0xffca28,.02); gn.position.set(0,.78,0); gn.rotation.x=-.5; g.add(gn);
          for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; const t=box(.03,.02,.06,shade(col,.7),.01);
            t.position.set(Math.cos(a)*.22,.69,Math.sin(a)*.22); t.rotation.y=-a; g.add(t); }
        } },
      { id:'garden-gnome-family', name:'ครอบครัวคนแคระ', cat:'decorout', scope:'out', emoji:'👨‍👩‍👦', colors:[0xef5350,0x42a5f5,0x66bb6a],
        action:'bounce',
        build(g,col){
          [[-.18,.9,col],[.16,.75,shade(col,1.2)],[.02,.6,shade(col,.8)]].forEach(([x,sc,c],i)=>{
            const body=cone(.13*sc,.3*sc,c,10); body.position.set(x,.15*sc,i*.06); g.add(body);
            const head=ball(.09*sc,0xffe0b2,10); head.position.set(x,.34*sc,i*.06); g.add(head);
            const hat=cone(.1*sc,.24*sc,c,10); hat.position.set(x,.5*sc,i*.06); g.add(hat);
            const beard=ball(.07*sc,0xfffdf7,8); beard.scale.set(1,1.2,.6);
            beard.position.set(x,.28*sc,i*.06+.06*sc); g.add(beard); });
        } },
    ];

    /* หมวดหมู่ (แท็บในกล่อง edit) — แยกฉาก in/out */
    const cats = {
      in: [
        {id:'seat',    label:'ที่นั่ง',   emoji:'🛋️'},
        {id:'table',   label:'โต๊ะ',      emoji:'🍽️'},
        {id:'bed',     label:'ห้องนอน',   emoji:'🛏️'},
        {id:'kitchen', label:'ครัว',      emoji:'🍳'},
        {id:'bath',    label:'ห้องน้ำ',   emoji:'🛁'},
        {id:'decor',   label:'ตกแต่ง',    emoji:'🪴'},
      ],
      out: [
        {id:'garden',   label:'ต้นไม้',    emoji:'🌳'},
        {id:'play',     label:'เครื่องเล่น', emoji:'🛝'},
        {id:'seatout',  label:'ที่นั่ง',    emoji:'🪑'},
        {id:'decorout', label:'ตกแต่งสวน',  emoji:'⛲'},
      ],
    };

    const byId = {};
    items.forEach(it=>{ byId[it.id] = it; });
    return {items, byId, cats};
  };
})();
