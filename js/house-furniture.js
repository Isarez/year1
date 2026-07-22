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
      { id:'crib', name:'เตียงเด็ก', cat:'bed', scope:'in', emoji:'🧸', fw:1, fd:2, colors:SOFT,
        build(g,col){
          const base=box(.8,.2,1.5,shade(col,1.1),.05); base.position.y=.45; g.add(base);
          const mat_=box(.7,.12,1.4,0xfdfdf8,.05); mat_.position.y=.58; g.add(mat_);
          [-1,1].forEach(s=>{ for(let i=0;i<5;i++){ const bar=cyl(.02,.02,.4,col,6); bar.position.set(s*.38,.6,-.6+i*.3); g.add(bar);} });
          const rail=box(.84,.06,1.54,col,.03); rail.position.y=.82; g.add(rail);
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
        build(g,col){
          const face=cyl(.28,.28,.08,0xfffde7,20); face.rotation.x=Math.PI/2; face.position.y=1.4; g.add(face);
          const rim=torus(.28,.04,col,20); rim.position.y=1.4; g.add(rim);
          const h1=box(.03,.16,.02,0x37474f); h1.position.set(0,1.46,.05); g.add(h1);
          const h2=box(.03,.11,.02,0x37474f); h2.position.set(.06,1.4,.05); h2.rotation.z=-1; g.add(h2);
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
      { id:'tree-round', name:'ต้นไม้กลม', cat:'garden', scope:'out', emoji:'🌳', colors:GREEN,
        build(g,col){
          const trunk=cyl(.14,.18,1.0,0x9c6238,8); trunk.position.y=.5; g.add(trunk);
          const f1=ball(.6,col,12); f1.position.y=1.3; g.add(f1);
          const f2=ball(.4,shade(col,1.1),10); f2.position.set(.35,1.1,.2); g.add(f2);
          const f3=ball(.35,shade(col,.9),10); f3.position.set(-.32,1.15,-.16); g.add(f3);
        } },
      /* ต้นไม้ใหญ่แบบในฉาก (สูงสุ่มตามพิกัด + ดอกขาว) — ใช้กับต้นไม้เดิมในสนามที่ย้ายได้ */
      { id:'tree', name:'ต้นไม้ใหญ่', cat:'garden', scope:'out', emoji:'🌴', colors:GREEN,
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
      { id:'pine', name:'ต้นสน', cat:'garden', scope:'out', emoji:'🌲', colors:[0x388e3c,0x2e7d32,0x43a047],
        build(g,col){
          const trunk=cyl(.12,.15,.5,0x795548,8); trunk.position.y=.25; g.add(trunk);
          [[.7,.6,.55],[.55,1.05,.45],[.4,1.45,.35]].forEach(([r,y,h])=>{ const c=cone(r,h*1.6,col,10); c.position.y=y; g.add(c); });
        } },
      { id:'bush', name:'พุ่มไม้', cat:'garden', scope:'out', emoji:'🌿', colors:GREEN,
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
      { id:'topiary', name:'พุ่มตัดกลม', cat:'garden', scope:'out', emoji:'🎍', colors:GREEN,
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
        action:'bounce',
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
          const ring=torus(.75,.08,col,20); ring.position.y=.5; g.add(ring);
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
      { id:'fountain', name:'น้ำพุ', cat:'decorout', scope:'out', emoji:'⛲', fw:2, fd:2, colors:[0xb0bec5,0xd7ccc8,0x90a4ae],
        build(g,col){
          const basin=cyl(.85,.9,.3,col,20); basin.position.y=.15; g.add(basin);
          const water=cyl(.75,.75,.06,0x4dd0e1,20); water.position.y=.3; g.add(water);
          const pillar=cyl(.15,.2,.5,col,14); pillar.position.y=.55; g.add(pillar);
          const dish=cyl(.35,.32,.08,col,16); dish.position.y=.82; g.add(dish);
          const spout=ball(.1,0x4dd0e1,10); spout.position.y=.95; g.add(spout);
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
      { id:'pet-house', name:'บ้านสัตว์เลี้ยง', cat:'decorout', scope:'out', emoji:'🏠', colors:[0xe9bd80,0xef9a9a,0x90caf9,0xa5d6a7],
        build(g,col){
          const base=box(1.05,.75,.95, col, .08); base.position.y=.38; g.add(base);
          const RISE=.4, HALF=.66, DEP=1.1, roof=0xef8354;
          const len=Math.hypot(HALF,RISE), ang=Math.atan2(RISE,HALF);
          [1,-1].forEach(s=>{ const p=box(len,.12,DEP, roof, .04); p.rotation.z=-s*ang; p.position.set(s*HALF/2,.75+RISE/2,0); g.add(p); });
          const ridge=box(.13,.13,DEP+.04, 0xffe4c4, .05); ridge.position.set(0,.75+RISE,0); g.add(ridge);
          const doorH=cyl(.2,.2,.12,0x6d4530,16); doorH.rotation.x=Math.PI/2; doorH.position.set(0,.4,.48); g.add(doorH);
          const doorB=box(.4,.28,.12, 0x6d4530, .03); doorB.position.set(0,.22,.48); g.add(doorB);
        } },
      { id:'path', name:'แผ่นทางเดิน', cat:'decorout', scope:'out', emoji:'🟫', block:false, colors:[0xe3ddd0,0xd8c9a8,0xcbb891,0xbca77e],
        build(g,col,k,rec){
          /* ขนาด+เอียงแบบแผ่นหินในฉาก (0.6×0.6 เอียงสลับ ±.35) */
          const tilt = rec ? (((rec.x+rec.z)%2) ? .35 : -.35) : .2;
          const s=box(.6,.07,.6,col,.03); s.position.y=.04; s.rotation.y=tilt; g.add(s);
        } },
      { id:'pond', name:'บ่อน้ำ', cat:'decorout', scope:'out', emoji:'🦆', block:false, fw:2, fd:2, colors:[0x4dd0e1,0x4fc3f7,0x81d4fa],
        build(g,col){
          const water=cyl(.85,.85,.06,col,24); water.position.y=.03; g.add(water);
          const rim=torus(.85,.07,0x9e9e9e,24); rim.position.y=.05; g.add(rim);
          const lily=cyl(.14,.14,.02,0x66bb6a,10); lily.position.set(.3,.07,.2); g.add(lily);
          const flower=ball(.06,0xf48fb1,8); flower.position.set(.3,.1,.2); g.add(flower);
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
        build(g,col){
          const body=cone(.24,.5,col,12); body.position.y=.25; g.add(body);
          const head=ball(.15,0xffd9b3,12); head.position.y=.58; g.add(head);
          const beard=cone(.13,.2,0xffffff,10); beard.rotation.x=Math.PI; beard.position.set(0,.5,.08); g.add(beard);
          const hat=cone(.16,.4,shade(col,.8),12); hat.position.y=.82; g.add(hat);
          const nose=ball(.04,0xffb27d,8); nose.position.set(0,.56,.15); g.add(nose);
        } },
      { id:'stone-path', name:'ทางเดินหิน', cat:'decorout', scope:'out', emoji:'🪨', block:false, colors:[0xbcaaa4,0x90a4ae,0xd7ccc8],
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
          const fish=ball(.06,0xff8a65,8); fish.scale.set(1.4,1,.6); fish.position.set(-.1,.78,.1); g.add(fish);
          const fish2=ball(.05,0xffd54f,8); fish2.scale.set(1.4,1,.6); fish2.position.set(.16,.68,0); g.add(fish2);
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
        build(g,col){
          const globe=ball(.24,col,16); globe.position.y=.5; g.add(globe);
          const land=ball(.1,0x66bb6a,8); land.scale.set(1.2,1,.6); land.position.set(.08,.55,.18); g.add(land);
          const ring=torus(.28,.02,0xffd54f,20); ring.rotation.x=.4; ring.position.y=.5; g.add(ring);
          const base=cyl(.08,.12,.16,shade(0xc98d4e,.9),12); base.position.y=.12; g.add(base);
        } },

      /* ============ นอกบ้าน — สวน/ต้นไม้ (เพิ่ม) ============ */
      { id:'sunflower', name:'ทานตะวัน', cat:'garden', scope:'out', emoji:'🌻', colors:[0xffd54f,0xffb300],
        build(g,col){
          const stem=cyl(.04,.05,.9,0x66bb6a,8); stem.position.y=.45; g.add(stem);
          [[.12,.5],[-.14,.7]].forEach(([x,y])=>{ const lf=ball(.1,0x66bb6a,8); lf.scale.set(1.6,.4,1); lf.position.set(x,y,0); g.add(lf); });
          /* หน้าดอกหันไปข้างหน้า (+z): จานเกสร disc ตั้ง (x=90°) + กลีบเรียงเป็นวงในระนาบ XY รอบจาน */
          for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; const p=box(.16,.06,.03,col,.02); p.position.set(Math.cos(a)*.24,1.0+Math.sin(a)*.24,.0); p.rotation.z=a; g.add(p); }
          const center=cyl(.17,.17,.06,0x8d6e63,18); center.rotation.x=Math.PI/2; center.position.set(0,1.0,.04); g.add(center);
          const seeds=cyl(.13,.13,.03,shade(0x8d6e63,.8),16); seeds.rotation.x=Math.PI/2; seeds.position.set(0,1.0,.08); g.add(seeds);
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
      { id:'flower-arch', name:'ซุ้มดอกไม้', cat:'garden', scope:'out', emoji:'🌸', fw:2, fd:1, colors:[0xf48fb1,0xce93d8,0xffb3c1],
        build(g,col){
          [-1,1].forEach(s=>{ const post=cyl(.06,.06,1.2,0xffffff,10); post.position.set(s*.62,.6,0); g.add(post); });
          const ring=torus(.62,.07,0x81c784,24); ring.position.set(0,1.55,0); g.add(ring);
          const petals=[0xf06292,0xffd54f,0xba68c8,0xff8a65];
          for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; const fl=ball(.1,petals[i%petals.length],8); fl.position.set(Math.cos(a)*.62,1.55+Math.sin(a)*.62,.02); g.add(fl);
            const leaf=ball(.05,0x66bb6a,6); leaf.scale.set(1.4,.5,1); leaf.position.set(Math.cos(a)*.62,1.55+Math.sin(a)*.62,-.04); g.add(leaf); }
        } },
      { id:'palm-tall', name:'ต้นมะพร้าว', cat:'garden', scope:'out', emoji:'🥥', colors:[0x66bb6a,0x4caf50],
        build(g,col){
          const trunk=cyl(.1,.16,1.8,0xc98d4e,10); trunk.position.y=.9; trunk.rotation.z=.06; g.add(trunk);
          for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const leaf=box(.7,.05,.2,col,.04); leaf.position.set(Math.cos(a)*.42,1.85,Math.sin(a)*.42); leaf.rotation.y=-a; leaf.rotation.z=.2; g.add(leaf); }
          [[.1,.1],[-.1,.12],[.14,-.08]].forEach(([x,z])=>{ const co=ball(.09,0x8d6e63,8); co.position.set(x,1.72,z); g.add(co); });
        } },
      { id:'hedge', name:'พุ่มรั้วเขียว', cat:'garden', scope:'out', emoji:'🍃', fw:2, fd:1, colors:GREEN,
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
      { id:'rose-bush', name:'พุ่มกุหลาบ', cat:'garden', scope:'out', emoji:'🌹', colors:GREEN,
        build(g,col){
          const bush=ball(.4,col,12); bush.scale.set(1,.8,1); bush.position.y=.36; g.add(bush);
          [[.2,.5,.1],[-.2,.46,-.1],[0,.6,.2],[.14,.52,-.2],[-.16,.56,.14]].forEach(([x,y,z])=>{ const rose=ball(.08,0xef5350,8); rose.position.set(x,y,z); g.add(rose); });
        } },
      { id:'clover-patch', name:'พุ่มโคลเวอร์', cat:'garden', scope:'out', emoji:'☘️', block:false, colors:[0x66bb6a,0x4caf50,0x81c784],
        build(g,col){
          const base=cyl(.42,.42,.04,col,20); base.position.y=.02; g.add(base);
          [[-.2,-.15],[.18,-.1],[.05,.2],[-.15,.18],[.25,.15]].forEach(([x,z])=>{ for(let j=0;j<3;j++){ const a=j/3*Math.PI*2; const leaf=ball(.05,shade(col,1.1),6); leaf.scale.set(1,.5,1); leaf.position.set(x+Math.cos(a)*.05,.08,z+Math.sin(a)*.05); g.add(leaf); } });
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
          const water=cyl(.82,.82,.14,col,24); water.position.y=.1; g.add(water);
          const ball1=ball(.1,0xef5350,10); ball1.position.set(.3,.24,.2); g.add(ball1);
          const ball2=ball(.09,0xffd54f,10); ball2.position.set(-.28,.22,-.1); g.add(ball2);
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
      { id:'kite', name:'ว่าว', cat:'play', scope:'out', emoji:'🪁', colors:BRIGHT,
        build(g,col){
          const str=cyl(.008,.008,1.2,0x9e9e9e,4); str.position.y=.6; str.rotation.z=.2; g.add(str);
          const kite=box(.36,.36,.03,col,.02); kite.position.set(.24,1.4,0); kite.rotation.z=Math.PI/4; g.add(kite);
          const cross1=box(.5,.03,.04,shade(col,.8)); cross1.position.set(.24,1.4,.02); cross1.rotation.z=Math.PI/4; g.add(cross1);
          for(let i=0;i<3;i++){ const bow=ball(.05,i%2?0xffd54f:0xef5350,8); bow.position.set(.24-i*.12,1.14-i*.12,0); g.add(bow); }
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
      { id:'windmill', name:'กังหันลม', cat:'decorout', scope:'out', emoji:'🌬️', colors:BRIGHT,
        action:'spin',
        build(g,col){
          const pole=cyl(.03,.04,1.2,0x66bb6a,8); pole.position.y=.6; g.add(pole);
          const hub=ball(.06,0xffd54f,10); hub.position.y=1.2; g.add(hub);
          for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; const blade=box(.32,.03,.18,i%2?col:shade(col,1.2),.02); blade.position.set(Math.cos(a)*.2,1.2,Math.sin(a)*.2); blade.rotation.y=-a; g.add(blade); }
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
      { id:'flag-pole', name:'เสาธง', cat:'decorout', scope:'out', emoji:'🚩', colors:[0xcfd8dc,0xb0bec5],
        action:'bounce',
        build(g,col){
          const pole=cyl(.04,.05,2.2,col,10); pole.position.y=1.1; g.add(pole);
          const base=cyl(.18,.22,.1,shade(col,.8),14); base.position.y=.05; g.add(base);
          const top=ball(.06,0xffd54f,10); top.position.y=2.2; g.add(top);
          const flag=box(.5,.34,.02,0xef5350,.02); flag.position.set(.27,2.0,0); g.add(flag);
          const star=ball(.05,0xffd54f,8); star.position.set(.27,2.0,.03); g.add(star);
        } },
      { id:'bird-bath', name:'อ่างน้ำนก', cat:'decorout', scope:'out', emoji:'🕊️', colors:[0xd7ccc8,0x90a4ae,0xbcaaa4],
        build(g,col){
          const stand=cyl(.1,.16,.7,col,12); stand.position.y=.35; g.add(stand);
          const base=cyl(.24,.28,.06,col,16); base.position.y=.03; g.add(base);
          const basin=cyl(.34,.28,.12,shade(col,1.1),18); basin.position.y=.76; g.add(basin);
          const water=cyl(.28,.28,.03,0x4dd0e1,18); water.position.y=.8; g.add(water);
          const bird=ball(.08,0xffffff,10); bird.position.set(.2,.86,0); g.add(bird);
          const beak=cone(.03,.06,0xffca28,6); beak.rotation.x=Math.PI/2; beak.position.set(.28,.86,0); g.add(beak);
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
          for(let i=0;i<=8;i++){ const t=i/8; const x=-.8+t*1.6; const y=1.5-Math.sin(t*Math.PI)*.4; const bulb=ball(.06,[0xef5350,0xffd54f,0x66bb6a,0x42a5f5,0xf06292][i%5],8); bulb.position.set(x,y,0); bulb.userData.bulb=true; g.add(bulb); }
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
          [[0,.3],[.08,.5],[-.08,.44]].forEach(([x,h])=>{ const fl=cone(.14,h*.7,col,8); fl.position.set(x,h*.6,0); fl.userData.bulb=true; g.add(fl); });
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
