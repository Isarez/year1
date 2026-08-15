/* ============================================================
   บ้านของหนู — ของเล่นสัตว์เลี้ยง (เฟส 12.1 · ข้อ 50 ของ QUEST-DESIGN.md)

   ไฟล์นี้ประกาศ global HOUSE_PET_TOYS(kit) คืน {SPECS, pose} ให้ js/house.js เรียกใช้
   (โหลดก่อน house.js — ไม่แตะ DOM/ตัวแปร app เอง มีแค่ factory เดียว แพทเทิร์นเดียวกับ
    house-furniture.js / house-models.js / house-avatar.js)

   ⚠ **ทำไมแยกไฟล์**: js/house.js อยู่ที่ ~12,900 บรรทัดแล้ว กติกาในโปรเจคคือโค้ดใหม่ของ
     เฟส 5+ ต้องไปอยู่ไฟล์ของตัวเอง ไม่ยัดเพิ่มในนั้น

   ---------------------------------------------------------------
   สิ่งที่เฟส 12 ทิ้งไว้แล้วเฟสนี้มาปิด
   ---------------------------------------------------------------
   เฟส 12 วางรางไว้ครบ (แท็บ 🎾 ในร้าน · ownsToy/buyToy/ownedToys · หน้าเมนูเลือกของเล่น
   ในฟองของน้อง · PETCARE.toyPlayed(gain)) แต่ **ของเล่นมีชิ้นเดียวคือลูกบอลแถมฟรี**
   และทุกชิ้นวิ่งผ่าน startPetAct('ball') เส้นเดียวกันหมด ⇒ ซื้อจานร่อนมาก็เห็นเป็นลูกบอล

   เฟสนี้เติมของเล่นซื้อได้ 7 ชิ้น **พร้อมท่าเล่นประจำของใครของมัน** (ผู้ใช้สั่งให้แยกท่า)

   ---------------------------------------------------------------
   โครงของ 1 spec
   ---------------------------------------------------------------
     id      ตรงกับ id ใน PET_TOYS (js/house-shop.js)
     dur     ความยาวท่าทั้งชุด (วินาที)
     pose    ชื่อท่าของ **เด็ก** — ตัวจริงอยู่ในฟังก์ชัน pose() ท้ายไฟล์นี้
     near    ระยะที่น้องมายืนห่างจากเด็ก (ช่อง) ปริยาย 1.0
     build(c)   สร้าง prop ใส่ c.add(obj) — คืนอะไรก็ได้ เก็บไว้ที่ c.a.toy
     update(c)  เรียกทุกเฟรม — ขยับทั้ง prop และตัวน้อง

   c (context) ที่ house.js ส่งมาให้ — **อ่านอย่างเดียว ห้ามแก้ตัว a เอง นอกจาก a.flags/a.toy**
     c.a      petAct  (มี t, dur, arg, dx, dz, faceY, petFrom, petTo, flags, props)
     c.g      group ของน้อง        c.u   userData.anim ของน้อง (head/tail/wings)
     c.T      เวลาในท่านี้ (วิ)     c.dt  เดลต้าเฟรม
     c.cp     ตำแหน่งเด็ก (Vector3 · อ่านอย่างเดียว)
     c.add(o) แขวน object เข้าฉาก + ลงทะเบียนให้ถูกเก็บกวาดตอนจบท่าอัตโนมัติ
     c.bubble / c.puff / c.jingle / c.say / c.ok   เอฟเฟกต์ชุดเดียวกับกิจกรรมอื่นของน้อง

   ---------------------------------------------------------------
   🔒 กติกาที่ต้องรักษา (ถอดจาก skill house-mode + บทเรียนของเฟส 11)
   ---------------------------------------------------------------
   1. **torus() คืนวงที่ "ตั้งฉาก"** (อยู่บนระนาบ XY) ⇒ ห่วงที่ต้องวางแบนต้องหมุน
      rotation.x = PI/2 เอง · ห่วงกระโดดของเฟสนี้ **ตั้งฉากถูกแล้ว** เพราะน้องต้องลอดผ่าน
   2. **ท่าเด็กห้ามเอนเกิน .26 rad** (CH_LEAN_MAX) — rig หมุนรอบฝ่าเท้า เอนกว่านั้นเห็นเป็นล้มคว่ำ
      ความรู้สึก "ก้ม" ต้องมาจากย่อขา (legX) ซึ่ง applyCharPose ชดเชยความสูงสะโพกให้เอง
   3. **แขนห้ามยกเลย ~2.0 rad** — กล้อง isometric มองลงเกือบจากบนหัว มือที่สูงกว่านั้น
      หลบหลังหัวจนมองไม่เห็น ⇒ ท่า "ชู/โชว์" ให้ใช้กางแขนออกข้าง (z) แทน
   4. ของทุกชิ้นต้องถูก **แขวนผ่าน c.add()** เท่านั้น จะได้ถูกเก็บกวาดที่ endPetAct() อัตโนมัติ
      (แขวนเองด้วย scene.add จะค้างในฉากข้ามรอบการเล่น — กับดักเดียวกับของกลุ่ม A เฟส 11)
   5. **ห้ามตั้งเลขเหรียญ/แต้มความสุขในไฟล์นี้** — ค่า gain อยู่ที่ PET_TOYS ใน house-shop.js
      ที่เดียว ไฟล์นี้รู้แค่ว่า "เล่นจบแล้ว" แล้วปล่อยให้ house.js ไปเรียก PETCARE.toyPlayed()
   ============================================================ */
(function(){
  'use strict';

  window.HOUSE_PET_TOYS = function(k){
    const T3    = k.THREE;
    /* ⚠ ขอบวง/ห่วงในไฟล์นี้สร้าง TorusGeometry เองเพราะต้องคุมจำนวนเหลี่ยม/ความหนาเป็นรายชิ้น
       (`k.torus` ตั้งค่าไว้ตายตัว) — ตัวช่วยที่เหลือใช้ของกลางหมด */
    const box   = k.box, ball = k.ball, cyl = k.cyl;
    const mat   = k.mat;

    /* ---------- ตัวช่วยเล็กๆ ---------- */
    const clamp01 = v => v < 0 ? 0 : (v > 1 ? 1 : v);
    const ease    = v => { const x = clamp01(v); return x*x*(3-2*x); };   /* smoothstep */
    const arc     = v => Math.sin(clamp01(v)*Math.PI);                    /* 0→1→0 */

    /* จุดที่ "มือเด็ก" อยู่ — ของที่เด็กถืออยู่ต้องเกาะจุดนี้ ไม่ใช่กลางตัว */
    function handAt(c, fwd, side, up){
      const a = c.a;
      return new T3.Vector3(
        c.cp.x + a.dx*(fwd == null ? .34 : fwd) - a.dz*(side || 0),
        (up == null ? .62 : up),
        c.cp.z + a.dz*(fwd == null ? .34 : fwd) + a.dx*(side || 0));
    }
    /* จุดที่ "ปากน้อง" อยู่ (หน้าตัวน้องตามทิศที่หันอยู่) */
    function muzzleAt(g, dist){
      const d = dist == null ? .34 : dist;
      return new T3.Vector3(g.position.x + Math.sin(g.rotation.y)*d,
                            g.position.y + .34,
                            g.position.z + Math.cos(g.rotation.y)*d);
    }
    /* น้องวิ่งไปหาจุดหนึ่งพร้อมหันหน้าไปทางนั้น + เด้งตัวเป็นจังหวะวิ่ง */
    function runTo(c, from, to, kk){
      const g = c.g;
      g.position.lerpVectors(from, to, ease(kk));
      g.position.y = Math.abs(Math.sin(c.T*17))*.09;
      const ddx = to.x - g.position.x, ddz = to.z - g.position.z;
      if(Math.abs(ddx) + Math.abs(ddz) > .02) g.rotation.y = Math.atan2(ddx, ddz);
    }
    const wag = (c, sp, amp) => { if(c.u && c.u.tail) c.u.tail.rotation.z = Math.sin(c.T*(sp||15))*(amp||.5); };

    /* ================================================================
       1) 🪢 เชือกดึง — เด็กกับน้องคาบคนละปลาย ดึงสู้กันซ้าย-ขวา
       ================================================================ */
    function buildRope(){
      /* เชือกเป็นทรงกระบอกยาว 1 หน่วยตามแกน Y แล้วให้ update() ยืด/หมุนเอาเอง
         (ง่ายและถูกกว่า TubeGeometry มาก และเราต้องการแค่เส้นตรงหย่อนนิดๆ) */
      const g = new T3.Group();
      const core = cyl(.038, .038, 1, 0xd9b380, 7);
      g.add(core);
      /* ปุ่มปลายเชือก 2 ข้าง ให้เด็กเห็นว่าเป็น "ที่จับ" ไม่ใช่ท่อ */
      [.5, -.5].forEach(s=>{
        const knot = ball(.07, 0xc79a63, 8);
        knot.position.y = s;
        g.add(knot);
      });
      g.userData.core = core;
      return g;
    }
    /* วางเชือกให้พาดจากจุด A ไปจุด B พอดี (ยืดตามระยะจริง) */
    function spanRope(rope, A, B){
      const mid = A.clone().add(B).multiplyScalar(.5);
      const d   = B.clone().sub(A);
      const len = Math.max(.2, d.length());
      rope.position.copy(mid);
      rope.scale.set(1, len, 1);
      /* หมุนแกน Y ของเชือกให้ชี้ไปตามเวกเตอร์ A→B */
      rope.quaternion.setFromUnitVectors(new T3.Vector3(0,1,0), d.normalize());
    }

    const ROPE = {
      id:'rope', dur:4.4, pose:'tug', near:1.55,
      build(c){
        const rope = buildRope();
        rope.visible = false;              /* ยังไม่โผล่จนกว่าน้องจะวิ่งมาคาบ */
        c.add(rope);
        c.a.toy = rope;
      },
      update(c){
        const a = c.a, g = c.g, T = c.T, rope = a.toy;
        if(T < .7){
          /* น้องวิ่งเข้ามาคาบปลายเชือก */
          runTo(c, a.petFrom, a.petTo, T/.7);
          if(!a.flags.come){ a.flags.come = true; c.bubble('👀'); }
        }else if(T < 3.4){
          /* ดึงกัน — น้องถอย/ดันสลับไปมา 4 จังหวะ พร้อมส่ายหัวแบบสุนัขคาบของ */
          const k = (T - .7) / 2.7;
          const pull = Math.sin(k*Math.PI*4);                 /* −1 = น้องดันเข้า · +1 = น้องถอย */
          const back = a.petTo.clone().addScaledVector(new T3.Vector3(a.dx, 0, a.dz), pull*.42);
          g.position.set(back.x, Math.abs(Math.sin(T*13))*.035, back.z);
          g.rotation.set(0, a.faceY + Math.sin(T*16)*.13, Math.sin(T*11)*.08);
          if(c.u && c.u.head) c.u.head.rotation.x = .22 + Math.sin(T*15)*.12;
          if(!a.flags.grr && T > 1.0){ a.flags.grr = true; c.bubble('💪'); c.jingle(); }
        }else{
          /* น้องชนะ! ถอยหลังพร้อมเชือก แล้วกระโดดดีใจ */
          const k = clamp01((T - 3.4) / 1.0);
          const back = a.petTo.clone().addScaledVector(new T3.Vector3(a.dx, 0, a.dz), .5 + k*.35);
          g.position.set(back.x, Math.abs(Math.sin((T-3.4)*9))*.28, back.z);
          g.rotation.set(0, a.faceY, 0);
          if(!a.flags.done){
            a.flags.done = true;
            c.bubble('🏆'); c.puff(8, 0xffd54f, .8, .45);
            c.ok('เก่งมาก แรงเยอะเลย! 🪢');
          }
        }
        if(rope){
          rope.visible = T > .55;
          if(rope.visible) spanRope(rope, handAt(c, .40, .10, .60), muzzleAt(g, .30));
        }
        wag(c, 15, .5);
      },
    };

    /* ================================================================
       2) 🪶 ไม้ล่อขนนก — เด็กแกว่งไม้เป็นวง น้องกระโดดตะปบตาม
       ================================================================ */
    function buildWand(){
      const g = new T3.Group();
      const stick = cyl(.022, .026, .74, 0xb98a52, 7);
      stick.rotation.z = Math.PI/2;                  /* ไม้นอนตามแกน x */
      g.add(stick);
      const line = cyl(.008, .008, .34, 0xe6ddc8, 5);
      line.position.set(.37, -.17, 0);
      g.add(line);
      const feather = new T3.Group();
      const quill = box(.05, .2, .05, 0xfdfdf5, .02);
      feather.add(quill);
      [0,1,2].forEach(i=>{
        const v = box(.15, .09, .03, i%2 ? 0xf279ae : 0x7fd4e8, .03);
        v.position.set(0, .045 - i*.06, 0);
        v.rotation.z = (i%2 ? .3 : -.3);
        feather.add(v);
      });
      feather.position.set(.37, -.42, 0);
      g.add(feather);
      g.userData.feather = feather;
      return g;
    }

    const WAND = {
      id:'wand', dur:4.4, pose:'wave', near:1.15,
      build(c){
        const wand = buildWand();
        c.add(wand);
        c.a.toy = wand;
        /* จุดหมุนของขนนก = รอบตัวเด็ก รัศมี 1.25 ช่อง */
        c.a.wandR = 1.25;
      },
      update(c){
        const a = c.a, g = c.g, T = c.T, wand = a.toy;
        /* มุมของขนนก ณ เวลานี้ (แกว่งเป็นวงกลม 1.5 รอบตลอดท่า) */
        const ang = Math.atan2(a.dx, a.dz) + Math.sin(T*2.1)*1.45;
        if(wand){
          wand.position.copy(handAt(c, .26, .06, .70));
          wand.rotation.set(0, ang - Math.PI/2, .34 + Math.sin(T*3.4)*.22);
        }

        if(T < 3.5){
          /* น้องวิ่งตามขนนกแบบตามหลังนิดๆ (ไล่ไม่ทันพอดี = ดูมีชีวิต) */
          const lag  = Math.atan2(a.dx, a.dz) + Math.sin((T-.22)*2.1)*1.45;
          const px = c.cp.x + Math.sin(lag)*(a.wandR + .30);
          const pz = c.cp.z + Math.cos(lag)*(a.wandR + .30);
          const jump = Math.max(0, Math.sin(T*4.4));       /* กระโดดตะปบเป็นจังหวะ */
          g.position.set(px, jump*jump*.34, pz);
          g.rotation.set(-jump*.3, Math.atan2(c.cp.x - px, c.cp.z - pz) + Math.PI, 0);
          if(c.u && c.u.head) c.u.head.rotation.x = -.2 - jump*.25;
          if(!a.flags.play && T > .5){ a.flags.play = true; c.bubble('🐾'); }
          if(!a.flags.mid && T > 1.9){ a.flags.mid = true; c.jingle(); c.puff(4, 0xf279ae, .6, .5); }
        }else{
          /* ตะปบโดน! ขนนกสั่น น้องลงพื้นดีใจ */
          const k = clamp01((T - 3.5) / .9);
          g.position.y = Math.abs(Math.sin((T-3.5)*9))*.26*(1-k*.4);
          g.rotation.x = 0;
          if(wand) wand.rotation.z += Math.sin(T*40)*.06;
          if(!a.flags.done){
            a.flags.done = true;
            c.bubble('🪶'); c.puff(9, 0xf279ae, .8, .5);
            c.ok('ตะปบโดนแล้ว เร็วมาก! 🪶');
          }
        }
        wag(c, 18, .55);
      },
    };

    /* ================================================================
       3) 🥏 จานร่อน — ร่อนเป็นเส้นโค้ง น้องกระโดดงับกลางอากาศ
       ================================================================ */
    function buildDisc(){
      const g = new T3.Group();
      const body = cyl(.19, .19, .035, 0xf0913f, 16);
      g.add(body);
      const rim = new T3.Mesh(new T3.TorusGeometry(.19, .022, 6, 18), mat(0xffd166));
      rim.rotation.x = Math.PI/2;              /* ⚠ torus ตั้งฉากมาโดยปริยาย ต้องหมุนให้แบน */
      g.add(rim);
      const dot = cyl(.07, .07, .045, 0xfdfdf5, 12);
      dot.position.y = .006;
      g.add(dot);
      return g;
    }

    const DISC = {
      id:'disc', dur:4.6, pose:'fling', near:1.3,
      build(c){
        const disc = buildDisc();
        disc.position.copy(handAt(c, .30, -.26, .60));
        c.add(disc);
        c.a.toy = disc;
        /* จุดที่น้อง "งับกลางอากาศ" — จานลอยไปหยุดตรงนี้พอดี */
        c.a.catchAt = new T3.Vector3(c.cp.x + c.a.dx*2.75, 0, c.cp.z + c.a.dz*2.75);
      },
      update(c){
        const a = c.a, g = c.g, T = c.T, disc = a.toy;
        if(disc) disc.rotation.y += c.dt*17;                 /* หมุนรอบตัวตลอดเวลาที่ลอย */

        if(T < .8){
          /* เด็กเหวี่ยงออกข้าง จานลอยเป็นเส้นโค้งช้าๆ */
          if(disc){
            const k = clamp01((T - .26) / .54);
            disc.position.lerpVectors(handAt(c, .30, -.26, .60), a.catchAt.clone().setY(.62), k);
            disc.position.y = .60 + Math.sin(k*Math.PI)*.30;
            disc.rotation.z = .18*Math.sin(k*Math.PI);
          }
          if(!a.flags.eye && T > .3){ a.flags.eye = true; c.bubble('👀'); }
        }else if(T < 2.1){
          /* น้องวิ่งไปจุดงับ */
          runTo(c, a.petFrom, a.catchAt, (T - .8) / 1.3);
          if(disc) disc.position.set(a.catchAt.x, .82, a.catchAt.z);
        }else if(T < 2.7){
          /* กระโดดงับกลางอากาศ — จุดสูงสุดของท่านี้ */
          const k = (T - 2.1) / .6;
          g.position.set(a.catchAt.x, arc(k)*.62, a.catchAt.z);
          g.rotation.set(-arc(k)*.34, a.faceY + Math.PI, 0);
          if(disc){
            disc.position.set(a.catchAt.x, .82 - arc(k)*.12, a.catchAt.z);
            if(k > .45) disc.position.copy(muzzleAt(g, .30));
          }
          if(!a.flags.catch && k > .45){
            a.flags.catch = true;
            c.bubble('🥏'); c.jingle(); c.puff(5, 0xffd166, .7, .6);
          }
        }else if(T < 3.9){
          /* คาบกลับมาหาเด็ก */
          runTo(c, a.catchAt, a.petTo, (T - 2.7) / 1.2);
          if(disc) disc.position.copy(muzzleAt(g, .30));
        }else{
          g.position.set(a.petTo.x, Math.abs(Math.sin((T-3.9)*9))*.28, a.petTo.z);
          g.rotation.set(0, a.faceY, 0);
          if(disc){
            disc.position.y = Math.max(.045, disc.position.y - c.dt*2.4);
            disc.scale.setScalar(Math.max(.001, 1 - clamp01((T - 4.25) / .35)));
          }
          if(!a.flags.done){
            a.flags.done = true;
            c.bubble('❤️'); c.puff(7, 0xf06292, .7, .4);
            c.ok('รับกลางอากาศได้ด้วย เก่งมาก! 🥏');
          }
        }
        wag(c, 16, .5);
      },
    };

    /* ================================================================
       4) 🧸 ตุ๊กตาผ้า — น้องคาบสะบัดหัวไปมาแล้วโยนขึ้นเอง
       ================================================================ */
    function buildPlush(){
      const g = new T3.Group();
      const body = box(.24, .26, .18, 0xf4a9c0, .09);
      g.add(body);
      const head = box(.2, .18, .17, 0xf9c3d4, .08);
      head.position.y = .21;
      g.add(head);
      [-1, 1].forEach(s=>{
        const ear = ball(.058, 0xf4a9c0, 7);
        ear.position.set(.075*s, .30, 0);
        g.add(ear);
        const arm = box(.07, .15, .07, 0xf9c3d4, .03);
        arm.position.set(.15*s, .05, 0);
        arm.rotation.z = .5*s;
        g.add(arm);
        const eye = ball(.021, 0x4a3728, 6);
        eye.position.set(.045*s, .225, .088);
        g.add(eye);
      });
      const nose = ball(.028, 0xe5533d, 6);
      nose.position.set(0, .19, .09);
      g.add(nose);
      return g;
    }

    const PLUSH = {
      id:'plush', dur:4.2, pose:'give', near:1.05,
      build(c){
        const plush = buildPlush();
        plush.position.copy(handAt(c, .40, 0, .58));
        c.add(plush);
        c.a.toy = plush;
      },
      update(c){
        const a = c.a, g = c.g, T = c.T, plush = a.toy;
        if(T < .9){
          /* เด็กยื่นให้ น้องเดินเข้ามารับ */
          runTo(c, a.petFrom, a.petTo, T/.9);
          if(plush) plush.position.copy(handAt(c, .40 + Math.sin(T*4)*.05, 0, .58));
          if(!a.flags.come){ a.flags.come = true; c.bubble('👀'); }
        }else if(T < 2.9){
          /* คาบแล้วสะบัดหัวซ้าย-ขวาแรงๆ แบบหมาเขย่าตุ๊กตา */
          const shake = Math.sin((T - .9)*15);
          g.position.set(a.petTo.x, Math.abs(Math.sin(T*9))*.05, a.petTo.z);
          g.rotation.set(0, a.faceY + shake*.42, shake*.13);
          if(c.u && c.u.head) c.u.head.rotation.x = .18 + Math.sin(T*15)*.16;
          if(plush){
            plush.position.copy(muzzleAt(g, .32));
            plush.rotation.set(.3, g.rotation.y, shake*.7);
          }
          if(!a.flags.shake && T > 1.2){ a.flags.shake = true; c.bubble('🧸'); c.jingle(); }
        }else if(T < 3.7){
          /* โยนตุ๊กตาขึ้นเองแล้วเงยหน้ามอง */
          const k = (T - 2.9) / .8;
          g.position.set(a.petTo.x, 0, a.petTo.z);
          g.rotation.set(-arc(k)*.36, a.faceY, 0);
          if(plush){
            const up = arc(k);
            plush.position.set(a.petTo.x + Math.sin(a.faceY)*.34, .48 + up*.75, a.petTo.z + Math.cos(a.faceY)*.34);
            plush.rotation.x += c.dt*7;
          }
          if(!a.flags.toss){ a.flags.toss = true; c.puff(5, 0xf9c3d4, .6, .8); }
        }else{
          g.position.set(a.petTo.x, Math.abs(Math.sin((T-3.7)*9))*.26, a.petTo.z);
          g.rotation.set(0, a.faceY, 0);
          if(plush){
            plush.position.copy(muzzleAt(g, .3));
            plush.scale.setScalar(Math.max(.001, 1 - clamp01((T - 3.9) / .35)));
          }
          if(!a.flags.done){
            a.flags.done = true;
            c.bubble('❤️'); c.puff(7, 0xf06292, .7, .45);
            c.ok('ชอบตุ๊กตาตัวนี้มากเลย 🧸');
          }
        }
        wag(c, 17, .55);
      },
    };

    /* ================================================================
       5) 🫧 เครื่องเป่าฟองสบู่ — ฟองลอยเป็นแถว น้องวิ่งไล่ตบทีละลูก
          (ของเล่นชิ้นเดียวที่ "ไม่มีการคาบกลับ" — จบด้วยฟองหมดเอง)
       ================================================================ */
    function buildBlower(){
      const g = new T3.Group();
      const body = box(.17, .2, .13, 0x7fd4e8, .05);
      g.add(body);
      const ring = new T3.Mesh(new T3.TorusGeometry(.075, .018, 6, 14), mat(0xfdfdf5));
      ring.position.y = .16;
      g.add(ring);                              /* ห่วงเป่าฟอง — ตั้งฉากถูกแล้ว ไม่ต้องหมุน */
      const grip = cyl(.035, .04, .12, 0xf4c542, 8);
      grip.position.y = -.15;
      g.add(grip);
      return g;
    }
    const BUBBLE_N = 5;

    const BUBBLES = {
      id:'bubbles', dur:4.8, pose:'blow', near:1.2,
      build(c){
        const blower = buildBlower();
        c.add(blower);
        c.a.toy = blower;
        const bs = [];
        for(let i = 0; i < BUBBLE_N; i++){
          const b = ball(.11 + (i%2)*.03, 0xcdeffb, 9);
          b.material.transparent = true;
          b.material.opacity = .68;
          b.visible = false;
          c.add(b);
          bs.push(b);
        }
        c.a.bubbles = bs;
        /* ทิศกระจายของฟองแต่ละลูก (สลับซ้าย-ขวารอบแนวหน้าเด็ก) */
        c.a.bubbleSide = [0, -.55, .55, -.3, .3];
        /* จุดออกตัวของน้องในรอบไล่ถัดไป — เก็บแยกจาก a.petFrom เพราะ endPetAct/สาขาอื่นใช้ค่านั้นอยู่ */
        c.a.bubHome = c.a.petFrom.clone();
      },
      update(c){
        const a = c.a, g = c.g, T = c.T;
        const hand = handAt(c, .28, -.14, .82);
        if(a.toy){ a.toy.position.copy(hand); a.toy.rotation.set(0, Math.atan2(a.dx, a.dz), .2); }

        const GAP = .72;                          /* ระยะห่างเวลาปล่อยฟองแต่ละลูก */
        let target = null;
        (a.bubbles || []).forEach((b, i)=>{
          const t0 = .45 + i*GAP;                 /* ฟองลูกนี้เกิดตอนไหน */
          const life = T - t0;
          if(life < 0 || b.userData.pop){ b.visible = false; return; }   /* ยังไม่เกิด / โดนตบไปแล้ว */
          b.visible = true;
          const side = a.bubbleSide[i] || 0;
          /* ลอยออกหน้าเด็กแล้วสูงขึ้นเรื่อยๆ พร้อมส่ายเบาๆ */
          const fwd = .55 + life*.62;
          b.position.set(hand.x + a.dx*fwd - a.dz*side + Math.sin(life*3 + i)*.07,
                         hand.y + life*.22,
                         hand.z + a.dz*fwd + a.dx*side + Math.cos(life*3 + i)*.07);
          b.scale.setScalar(1 + Math.sin(life*5 + i)*.06);
          /* ลูกที่ "ถึงคิวโดนตบ" คือลูกที่เกิดมาแล้วราว .55 วิ */
          if(life > .5 && life < GAP + .1 && target == null) target = {b, i};
        });

        if(target){
          const b = target.b;
          const to = new T3.Vector3(b.position.x, 0, b.position.z);
          const k = clamp01((T - (.45 + target.i*GAP) - .5) / .55);
          const home = a.bubHome;
          g.position.set(
            home.x + (to.x - home.x)*ease(Math.min(1, k*1.6)),
            arc(k)*Math.max(.2, b.position.y - .28),
            home.z + (to.z - home.z)*ease(Math.min(1, k*1.6)));
          g.rotation.set(-arc(k)*.3, Math.atan2(to.x - g.position.x, to.z - g.position.z) || g.rotation.y, 0);
          home.set(g.position.x, 0, g.position.z);            /* รอบถัดไปออกตัวจากที่ยืนล่าสุด */
          if(k > .62 && !b.userData.pop){
            b.userData.pop = true;
            b.visible = false;
            c.puff(4, 0xcdeffb, .5, b.position.y);
            c.bubble('🫧');
            if(!a.flags.first){ a.flags.first = true; c.jingle(); }
          }
        }else{
          g.position.y = Math.abs(Math.sin(T*8))*.05;
          g.rotation.x = 0;
        }

        if(T > a.dur - .55 && !a.flags.done){
          a.flags.done = true;
          const popped = (a.bubbles || []).filter(b => b.userData.pop).length;
          c.puff(8, 0xcdeffb, .9, .5);
          c.ok(popped >= BUBBLE_N ? 'ตบครบทุกลูกเลย! 🫧' : 'สนุกจังเลย ฟองเยอะมาก 🫧');
        }
        wag(c, 19, .5);
      },
    };

    /* ================================================================
       6) 🛟 ห่วงกระโดด — เด็กถือห่วง น้องวิ่งลอดกลับไป-กลับมา
       ================================================================ */
    function buildHoop(){
      const g = new T3.Group();
      /* ⚠ **ไม่หมุน** — torus ตั้งฉากมาโดยปริยาย ซึ่งคือสิ่งที่ต้องการพอดี (น้องลอดผ่าน) */
      const ring = new T3.Mesh(new T3.TorusGeometry(.42, .05, 8, 22), mat(0xf0913f));
      g.add(ring);
      /* แถบสีสลับให้ดูเป็นห่วงละครสัตว์ เด็กจำได้ว่าเป็นของเล่น ไม่ใช่ยางรถ */
      [0, 1, 2, 3].forEach(i=>{
        const seg = new T3.Mesh(new T3.TorusGeometry(.42, .053, 6, 5, Math.PI/5), mat(0xfdfdf5));
        seg.rotation.z = i*Math.PI/2 + .3;
        g.add(seg);
      });
      const grip = cyl(.035, .035, .16, 0xb98a52, 8);
      grip.position.y = -.5;
      g.add(grip);
      return g;
    }

    const HOOP = {
      id:'hoop', dur:4.6, pose:'hold', near:1.9,
      build(c){
        const hoop = buildHoop();
        hoop.scale.setScalar(.01);
        c.add(hoop);
        c.a.toy = hoop;
        /* ห่วงตั้งอยู่กึ่งกลางระหว่างเด็กกับน้อง เป็นแกนให้วิ่งลอดไป-กลับ */
        c.a.hoopAt = new T3.Vector3(c.cp.x + c.a.dx*1.1, .62, c.cp.z + c.a.dz*1.1);
        c.a.farAt  = new T3.Vector3(c.cp.x + c.a.dx*2.5, 0, c.cp.z + c.a.dz*2.5);
      },
      update(c){
        const a = c.a, g = c.g, T = c.T, hoop = a.toy;
        if(hoop){
          const s = T < .5 ? ease(T/.45) : (T > a.dur - .45 ? Math.max(.001, 1 - (T - (a.dur - .45))/.45) : 1);
          hoop.scale.setScalar(s + .001);
          hoop.position.copy(a.hoopAt);
          hoop.position.y = .62 + Math.sin(T*2.6)*.03;
          hoop.rotation.set(0, Math.atan2(a.dx, a.dz) + Math.PI/2, Math.sin(T*2.2)*.05);
        }

        if(T < .6){
          g.position.copy(a.petFrom);
          g.rotation.set(0, a.faceY, 0);
          if(!a.flags.ready){ a.flags.ready = true; c.bubble('👀'); }
        }else if(T < 4.0){
          /* วิ่งลอด 3 เที่ยว: ไกล→ใกล้→ไกล (สลับทุก ~1.13 วิ) */
          const k = (T - .6) / 3.4;
          const leg = Math.floor(k*3);                  /* 0,1,2 */
          const kk  = (k*3) % 1;
          const A = leg % 2 === 0 ? a.farAt : a.petTo;
          const B = leg % 2 === 0 ? a.petTo : a.farAt;
          if(leg === 0 && kk < .02) g.position.copy(a.petFrom);
          const p = A.clone().lerp(B, ease(kk));
          /* กระโดดสูงสุดตอนอยู่กลางทาง = ตรงห่วงพอดี */
          g.position.set(p.x, arc(kk)*.5 + Math.abs(Math.sin(T*16))*.04, p.z);
          g.rotation.set(-arc(kk)*.26, Math.atan2(B.x - A.x, B.z - A.z), 0);
          if(kk > .45 && a.flags.leg !== leg){
            a.flags.leg = leg;
            c.jingle();
            c.puff(3, 0xffd166, .5, .7);
            if(leg === 0) c.bubble('🛟');
          }
        }else{
          const k = clamp01((T - 4.0)/.6);
          g.position.set(a.petTo.x, Math.abs(Math.sin((T-4.0)*9))*.28, a.petTo.z);
          g.rotation.set(0, a.faceY, 0);
          if(!a.flags.done){
            a.flags.done = true;
            c.bubble('🏆'); c.puff(9, 0xffd54f, .85, .5);
            c.ok('ลอดห่วงได้สวยมาก! 🛟');
          }
          void k;
        }
        wag(c, 18, .55);
      },
    };

    /* ================================================================
       7) 🛝 สไลเดอร์เล็ก — น้องปีนขึ้นแล้วไถลลง 2 รอบ
       ================================================================ */
    function buildSlide(){
      const g = new T3.Group();
      /* รางไถล — แผ่นเอียงจากบนซ้ายลงล่างขวา (ตามแกน z ท้องถิ่น) */
      const ramp = box(.5, .06, 1.35, 0xf4c542, .04);
      ramp.position.set(0, .52, .3);
      ramp.rotation.x = -.62;
      g.add(ramp);
      [-1, 1].forEach(s=>{
        const rail = box(.05, .16, 1.35, 0xf0913f, .03);
        rail.position.set(.26*s, .60, .3);
        rail.rotation.x = -.62;
        g.add(rail);
      });
      /* แท่นบนสุด + ขาตั้ง */
      const top = box(.5, .07, .32, 0xf0913f, .03);
      top.position.set(0, .92, -.42);
      g.add(top);
      [-1, 1].forEach(s=>{
        const leg = cyl(.045, .045, .9, 0x7fd4e8, 8);
        leg.position.set(.2*s, .45, -.5);
        g.add(leg);
      });
      /* บันได 3 ขั้นด้านหลัง */
      [0, 1, 2].forEach(i=>{
        const st = box(.36, .05, .12, 0x7fd4e8, .02);
        st.position.set(0, .26 + i*.26, -.72 - i*.12);
        g.add(st);
      });
      return g;
    }

    const SLIDE = {
      id:'pet-slide', dur:5.0, pose:'cheer', near:1.5,
      build(c){
        const sl = buildSlide();
        const a = c.a;
        sl.position.set(c.cp.x + a.dx*2.0, 0, c.cp.z + a.dz*2.0);
        sl.rotation.y = Math.atan2(-a.dx, -a.dz);       /* หันปลายรางกลับมาทางเด็ก */
        sl.scale.setScalar(.01);
        c.add(sl);
        a.toy = sl;
        /* จุดสำคัญ 3 จุดบนราง (พิกัดโลก) — คำนวณครั้งเดียว ไม่ต้องคิดใหม่ทุกเฟรม */
        const fx = -a.dx, fz = -a.dz;                   /* ทิศ "ลงราง" = จากสไลเดอร์กลับหาเด็ก */
        a.slBack = new T3.Vector3(sl.position.x - fx*.85, 0,    sl.position.z - fz*.85);
        a.slTop  = new T3.Vector3(sl.position.x - fx*.42, .99,  sl.position.z - fz*.42);
        a.slFoot = new T3.Vector3(sl.position.x + fx*.95, .06,  sl.position.z + fz*.95);
        a.slFace = Math.atan2(fx, fz);
      },
      update(c){
        const a = c.a, g = c.g, T = c.T, sl = a.toy;
        if(sl){
          const s = T < .5 ? ease(T/.45) : (T > a.dur - .4 ? Math.max(.001, 1 - (T - (a.dur - .4))/.4) : 1);
          sl.scale.setScalar(s + .001);
        }
        /* 2 รอบ รอบละ 2.0 วิ: เดินอ้อมไปหลังบันได → ปีนขึ้น → ไถลลง */
        const LAP = 2.0, t = Math.max(0, T - .5);
        const lap = Math.min(1, Math.floor(t / LAP));
        const kk  = Math.min(1, (t - lap*LAP) / LAP);

        if(T < .5){
          g.position.copy(a.petFrom);
          g.rotation.set(0, a.faceY, 0);
          if(!a.flags.see){ a.flags.see = true; c.bubble('👀'); }
        }else if(t < LAP*2){
          if(kk < .34){
            /* เดินไปที่บันได */
            const from = lap === 0 ? a.petFrom : a.slFoot;
            runTo(c, from, a.slBack, kk/.34);
          }else if(kk < .56){
            /* ปีนขึ้นแท่น — ตัวเงยขึ้นตามบันได */
            const k = (kk - .34)/.22;
            g.position.lerpVectors(a.slBack, a.slTop, ease(k));
            g.position.y = a.slBack.y + (a.slTop.y - a.slBack.y)*ease(k) + Math.abs(Math.sin(T*20))*.03;
            g.rotation.set(-.4*ease(k), a.slFace, 0);
            if(a.flags.climb !== lap){ a.flags.climb = lap; c.bubble('🛝'); }
          }else{
            /* ไถลลง — เร่งความเร็วช่วงท้ายให้รู้สึกลื่นจริง */
            const k = (kk - .56)/.44;
            const kq = k*k;
            g.position.lerpVectors(a.slTop, a.slFoot, kq);
            g.rotation.set(.5 - kq*.5, a.slFace, Math.sin(k*Math.PI*3)*.1);
            if(k > .8 && a.flags.slid !== lap){
              a.flags.slid = lap;
              c.jingle(); c.puff(5, 0xf4c542, .7, .3);
            }
          }
        }else{
          g.position.set(a.petTo.x, Math.abs(Math.sin((T - .5 - LAP*2)*9))*.28, a.petTo.z);
          g.rotation.set(0, a.faceY, 0);
          if(!a.flags.done){
            a.flags.done = true;
            c.bubble('🎉'); c.puff(10, 0xffd54f, .9, .5);
            c.ok('ไถลสนุกมากเลย! 🛝');
          }
        }
        wag(c, 16, .5);
      },
    };

    /* ---------- ตารางรวม ----------
       ⚠ ลูกบอล ('ball') **ไม่อยู่ในนี้** — ท่าเดิมของเฟส 12 อยู่ใน js/house.js
         และเป็นของแถมฟรีที่เด็กทุกคนมี ไม่ต้องย้ายมา (ย้ายแล้วเสี่ยงพังของที่ใช้งานได้อยู่) */
    const SPECS = {};
    [ROPE, WAND, DISC, PLUSH, BUBBLES, HOOP, SLIDE].forEach(s=>{ SPECS[s.id] = s; });

    /* ================================================================
       ท่าของ "เด็ก" ประจำของเล่นแต่ละชิ้น
       คืน object เดียวกับ charPoseAt() ของ js/house.js: {lean,legX,hop,aL,aR,zL,zR}
       (js/house.js จะหนีบ lean ด้วย CH_LEAN_MAX ให้เองอีกชั้น)

       C = {ARM_Z:[zL,zR]}  ส่งมาจาก house.js เพื่อไม่ต้องรู้ค่าคงที่ซ้ำ 2 ที่
       ================================================================ */
    const POSES = {
      /* 🪢 ดึงเชือก — ย่อขาถ่างหลัง เอนตัวสลับหน้า-หลังตามจังหวะดึง แขน 2 ข้างงอเข้าหาอก */
      tug(pr, C){
        const c = pr < .16 ? pr/.16 : (pr < .9 ? 1 : 1 - (pr-.9)/.1);
        const pull = Math.sin(pr*Math.PI*4);            /* เฟสตรงข้ามกับตัวน้อง = ดูเป็นแรงต้าน */
        return {
          lean: c*(-.10 - pull*.13), legX: c*.26, hop: 0,
          aL: -c*(1.15 + pull*.32), aR: -c*(1.15 + pull*.32),
          zL: C.ARM_Z[0] + c*.24, zR: C.ARM_Z[1] - c*.24,
        };
      },
      /* 🪶 แกว่งไม้ — แขนขวายื่นออกหน้าแล้วกวาดเป็นวง มือซ้ายเท้าเอวเบาๆ */
      wave(pr, C){
        const c = pr < .14 ? pr/.14 : (pr < .92 ? 1 : 1 - (pr-.92)/.08);
        const sw = Math.sin(pr*Math.PI*4.2);
        return {
          lean: c*.06, legX: c*.1, hop: 0,
          aR: -c*(1.28 + sw*.2), aL: -c*.4,
          zR: C.ARM_Z[1] - c*(.30 + sw*.34), zL: C.ARM_Z[0] - c*.42,
        };
      },
      /* 🥏 เหวี่ยงจานร่อน — กางแขนออกข้างแล้วสะบัดขวางลำตัว (คนละท่ากับ 'throw' ที่ขว้างข้ามไหล่) */
      fling(pr, C){
        if(pr < .30){                                    /* กางแขนไปข้างหลัง เตรียมเหวี่ยง */
          const c = pr/.30;
          return {lean:0, legX:c*.08, hop:0, aR:-c*.55, aL:-c*.15,
                  zR: C.ARM_Z[1] + c*.85, zL: C.ARM_Z[0] - c*.2};
        }
        if(pr < .48){                                    /* สะบัดขวางตัวเร็วๆ */
          const c = (pr-.30)/.18;
          return {lean:c*.14, legX:.08, hop:0, aR:-.55 - c*.5, aL:-.15 - c*.25,
                  zR: C.ARM_Z[1] + .85 - c*1.5, zL: C.ARM_Z[0] - .2 + c*.3};
        }
        const c = Math.min(1, (pr-.48)/.4);              /* ค้างท่าชี้ตามจาน */
        return {lean:.14 - c*.12, legX:.08 - c*.04, hop:0,
                aR:-1.05 + c*.45, aL:-.4 + c*.2,
                zR: C.ARM_Z[1] - .65 + c*.4, zL: C.ARM_Z[0] + .1 - c*.1};
      },
      /* 🧸 ยื่นตุ๊กตาให้ — 2 มือประคองยื่นออกหน้า ย่อเข่าลงหาน้อง */
      give(pr, C){
        const c = pr < .18 ? pr/.18 : (pr < .78 ? 1 : 1 - (pr-.78)/.22);
        const off = Math.sin(pr*Math.PI*3)*.1*c;
        return {
          lean: c*.15, legX: c*.28, hop: -c*.08,
          aL: -c*1.42 + off, aR: -c*1.42 + off,
          zL: C.ARM_Z[0] + c*.2, zR: C.ARM_Z[1] - c*.2,
        };
      },
      /* 🫧 เป่าฟอง — ยกมือขวาขึ้นระดับหน้าค้างไว้ ตัวโยกเบาๆ ตามจังหวะเป่า */
      blow(pr, C){
        const c = pr < .12 ? pr/.12 : (pr < .94 ? 1 : 1 - (pr-.94)/.06);
        const puff = Math.sin(pr*Math.PI*7)*.09*c;       /* ขยับเป็นจังหวะ = กำลังเป่าอยู่จริง */
        return {
          lean: -c*.05 + puff, legX: 0, hop: 0,
          aR: -c*1.62 + puff, aL: -c*.3,
          zR: C.ARM_Z[1] - c*.34, zL: C.ARM_Z[0] - c*.1,
        };
      },
      /* 🛟 ถือห่วง — 2 มือยื่นออกหน้าเสมอกัน ยืนนิ่งกว่าท่าอื่น (ต้องถือห่วงให้อยู่กับที่) */
      hold(pr, C){
        const c = pr < .14 ? pr/.14 : (pr < .9 ? 1 : 1 - (pr-.9)/.1);
        const br = Math.sin(pr*Math.PI*2.6)*.05*c;       /* หายใจเบาๆ ไม่ให้ดูเป็นหุ่น */
        return {
          lean: c*.07, legX: c*.12, hop: 0,
          aL: -c*1.5 + br, aR: -c*1.5 + br,
          zL: C.ARM_Z[0] + c*.12, zR: C.ARM_Z[1] - c*.12,
        };
      },
      /* 🛝 เชียร์ — ยืนดูแล้วปรบมือเป็นจังหวะ + เขย่งตอนน้องไถลลง
         ⚠ ใช้วิธี "มือ 2 ข้างชิดเข้ากลาง" (z) เหมือนท่า 'cue' ไม่ยกแขนสูงเกิน 2.0 rad */
      cheer(pr, C){
        const c  = pr < .12 ? pr/.12 : (pr < .94 ? 1 : 1 - (pr-.94)/.06);
        const cl = Math.sin(pr*Math.PI*22);
        return {
          lean: -c*.04, legX: 0, hop: c*Math.max(0, Math.sin(pr*Math.PI*4))*.07,
          aL: -c*1.45, aR: -c*1.45,
          zL: C.ARM_Z[0] + c*(.3 + cl*.14), zR: C.ARM_Z[1] - c*(.3 + cl*.14),
        };
      },
    };

    function pose(kind, pr, C){
      const f = POSES[kind];
      return f ? f(Math.min(1, Math.max(0, pr)), C) : null;
    }

    return {SPECS, pose, POSE_KINDS: Object.keys(POSES)};
  };
})();
