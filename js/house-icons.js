/* ============================================================
   🎨 คลังไอคอน SVG ของโหมดบ้าน — แทน emoji ในจุดที่เป็น "ไอคอนของระบบ/ไอเทม"
   (ผู้ใช้สั่ง 2026-08-18: emoji แสดงผลไม่เหมือนกันข้าม OS · บางเครื่องไม่มี glyph เลย)

   🔒 กติกา
   - ไฟล์นี้เก็บ **แต่รูป** ไม่มี logic เกม ไม่แตะ DOM/state ⇒ ใครก็เรียกได้
   - **อารมณ์/ท่าทางในฟองคำพูดยังใช้ emoji ได้** (ผู้ใช้อนุญาต) — ที่ต้องเป็น SVG คือ
     ไอคอนของ "ของ/ปุ่ม/สถานะ" ที่เด็กต้องดูแล้วรู้ว่าคืออะไร
   - ทุกไอคอนเป็น **viewBox 64×64 · fill แบน + เส้นขอบมนสีเข้มกว่าตัว** ให้เข้าชุดกับ
     `assets/icons/*.svg` ของหน้าหลัก (สีสด ทรงมน อ่านออกที่ 24-30px)
   - **ไม่มีไอคอน = ต้องถอยไปใช้ emoji เดิมเสมอ ห้ามพัง** (ตัวเรียกทุกที่ผ่าน `HouseIcons.html()`
     ซึ่งคืนค่าว่างเมื่อไม่รู้จัก id — ฝั่งเรียกเป็นคนตัดสินใจ fallback)
   - ⚠ **ไอคอนต้องต่างกันที่ "เงารวม" ไม่ใช่รายละเอียดเล็ก** (บทเรียนไอคอนทรงผมเฟส 8)
     ⇒ ปลา 48 ชนิดใช้ **ทรงร่วม ~23 ทรง + สีประจำตัว** ไม่ใช่วาดใหม่ทีละตัวให้คล้ายกันหมด
   ============================================================ */
(function(){
  /* 🧩 แกนกลางคลังไอคอน (js/shared/icons.js) — โหลดมาก่อนไฟล์นี้เสมอ
     ไฟล์นี้ยืม helper/ไอคอน UI จากแกนกลางแทนที่จะวาดซ้ำ */
  const CORE = window.OwlIcons || {_reg:{}};
  /* ---------- helper ---------- */
  /* สีเข้มลง (ใช้ทำเส้นขอบ) — รับ '#rrggbb' คืน '#rrggbb' */
  function dk(hex, k){
    k = k == null ? .62 : k;
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function lt(hex, k){
    k = k == null ? .35 : k;
    const n = parseInt(hex.slice(1), 16);
    const mix = v => Math.round(v + (255 - v) * k);
    return '#' + ((1 << 24) + (mix((n >> 16) & 255) << 16) + (mix((n >> 8) & 255) << 8) + mix(n & 255)).toString(16).slice(1);
  }
  const eye = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 2.6) + '" fill="#33261d"/>'
                         + '<circle cx="' + (x + .9) + '" cy="' + (y - .9) + '" r="' + ((r || 2.6) * .38) + '" fill="#fff"/>';
  const G = (inner, c) => '<g stroke="' + c + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>';

  /* ✋ มือเด็กแบบแบมือ — ใช้ทั้งปุ่ม "ลูบหัว" และท่าไฮไฟว์ (ผู้ใช้สั่งให้มือสวยขึ้น 2026-08-19)
     🔑 ของเดิมวาดเป็น path เส้นเดียวไล่ขึ้นลงเป็นฟันปลา ⇒ ที่ 26px เห็นเป็น "ก้อนหยักๆ" ไม่ใช่มือ
     ⚠ ต้องวาด **นิ้วก่อน แล้วทับด้วยฝ่ามือ** — ทุกชิ้นอยู่ใน <g> เดียวกันที่มี fill+stroke
       ชิ้นหลังทับชิ้นหน้าสนิท ⇒ โคนนิ้วไม่มีเส้นตัดกันมั่ว และยังเห็นร่องระหว่างนิ้วชัด */

  /* ============================================================
     🐟 ทรงสัตว์น้ำ — ปลา 48 ชนิดใช้ทรงร่วมกันแล้วเปลี่ยนสี/ลาย
     ============================================================ */
  const SEA = {
    /* ปลาทั่วไป: ลำตัวรี + หางสามเหลี่ยม + ครีบบน
       ⚠ **หัวอยู่ขวา หางอยู่ซ้ายเสมอ** เหมือนทรงอื่นทุกตัวในไฟล์นี้ (whisker/fancy/arowana/eel/flat)
         ของเดิมวางตาไว้ "ข้างเดียวกับหาง" ⇒ ปลา 19 ชนิดที่ใช้ทรงนี้ดูเหมือนหัวกลับด้าน
         (ผู้ใช้แจ้ง 2026-08-19) — เพิ่มปากเล็กๆ ที่หัวด้วย จะได้รู้ทันทีว่าด้านไหนคือหัว */
    fish(c, o){
      o = o || {};
      const d = dk(c);
      let s = G('<path d="M48 32c0 7-7 12.5-15 12.5S18 39 18 32s7-12.5 15-12.5S48 25 48 32z" fill="' + c + '"/>'
              + '<path d="M18 32L7 24v16z" fill="' + lt(c, .18) + '"/>'
              + '<path d="M33 19.5c-2-4.5-5-6.5-5-6.5s-.5 3.5 1 6.8" fill="' + lt(c, .3) + '"/>', d);
      if(o.stripe) s += '<path d="M32 21.5c1.6 3 1.6 18 0 21" stroke="' + lt(c, .55) + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
      if(o.spot)   s += '<circle cx="30" cy="28" r="2.6" fill="' + lt(c, .5) + '"/><circle cx="26" cy="35" r="2" fill="' + lt(c, .5) + '"/>';
      return s + '<path d="M47 35.5c-2 .8-4 1-6 .7" stroke="' + d + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
               + eye(41, 29);
    },
    /* ปลามีหนวด (ปลาดุก/ปลาบู่) */
    whisker(c){
      const d = dk(c);
      return G('<path d="M43 32c0 7-7.5 12-16 12s-15-5-15-12 6.5-12 15-12 16 5 16 12z" fill="' + c + '"/>'
             + '<path d="M12 32L3 25v14z" fill="' + lt(c, .18) + '"/>', d)
           + '<path d="M42 30c4-2 7-2 9-1M42 35c4 1.5 7 2 9 1.4" stroke="' + d + '" stroke-width="2" fill="none" stroke-linecap="round"/>'
           + eye(37, 29);
    },
    /* ปลาหางพลิ้ว (ปลากัด/ปลาทอง/หางนกยูง) */
    fancy(c){
      const d = dk(c);
      return G('<path d="M40 32c0 7-6.5 12-14 12s-13-5-13-12 5.5-12 13-12 14 5 14 12z" fill="' + c + '"/>'
             + '<path d="M13 32C7 24 3 20 3 20s2 8 2 12-2 12-2 12 4-4 10-12z" fill="' + lt(c, .28) + '"/>'
             + '<path d="M26 20c1-6 4-8 4-8s.5 4-.6 8" fill="' + lt(c, .35) + '"/>'
             + '<path d="M27 44c1 5 4 7 4 7s.3-4-.8-7" fill="' + lt(c, .35) + '"/>', d)
           + eye(33, 29);
    },
    /* ปลาปักเป้า (กลม + หนาม)
       ⚠ หนามยาวเท่ากันรอบตัวทำให้ดูเป็น "ดวงอาทิตย์" ⇒ ต้องมีหาง+ครีบ+ปากจู๋ให้รู้ว่าเป็นปลา */
    puffer(c){
      const d = dk(c);
      let sp = '';
      for(let i = 0; i < 9; i++){
        const a = -Math.PI * .78 + i / 9 * Math.PI * 1.9;
        sp += '<path d="M' + (34 + Math.cos(a) * 13).toFixed(1) + ' ' + (32 + Math.sin(a) * 13).toFixed(1)
            + 'L' + (34 + Math.cos(a) * 18.5).toFixed(1) + ' ' + (32 + Math.sin(a) * 18.5).toFixed(1) + '"/>';
      }
      return G('<path d="M20 32L8 24v16z" fill="' + lt(c, .18) + '"/>', d)
           + '<g stroke="' + d + '" stroke-width="2.6" stroke-linecap="round">' + sp + '</g>'
           + G('<circle cx="34" cy="32" r="14" fill="' + c + '"/>', d)
           + G('<path d="M30 44c-2 5-1 8 1 9 3 1 6-2 7-6z" fill="' + lt(c, .25) + '"/>', d)
           + '<circle cx="28" cy="36" r="2.4" fill="' + lt(c, .45) + '"/><circle cx="35" cy="40" r="1.8" fill="' + lt(c, .45) + '"/>'
           + G('<ellipse cx="47" cy="34" rx="3.4" ry="2.8" fill="' + lt(c, .4) + '"/>', d)
           + eye(41, 27);
    },
    /* ปลาแบน (ลิ้นหมา) — นอนราบ ตาอยู่ข้างเดียว */
    flat(c){
      const d = dk(c);
      return G('<path d="M8 36c6-11 20-16 32-13 8 2 14 7 16 11-6 4-16 8-27 8-9 0-16-2-21-6z" fill="' + c + '"/>'
             + '<path d="M8 36c-3 1-5 3-5 3s3 2 6 2z" fill="' + lt(c, .2) + '"/>', d)
           + '<g fill="' + lt(c, .45) + '"><circle cx="24" cy="35" r="3"/><circle cx="33" cy="31" r="2.6"/><circle cx="31" cy="41" r="2.2"/><circle cx="41" cy="36" r="2.4"/></g>'
           + eye(46, 29, 2.6) + eye(52, 31, 2.2);
    },
    /* ปลาไหล / ปลาช่อนยาว */
    eel(c){
      const d = dk(c);
      /* ⚠ ต้องมี "หัว" ที่ปลายเส้นชัดๆ ไม่งั้นดูเป็นแค่เส้นคดสีเขียว (รอบแรกอ่านไม่ออก) */
      return '<path d="M6 44c10 4 12-10 22-12s14 8 24 2" stroke="' + d + '" stroke-width="13" fill="none" stroke-linecap="round"/>'
           + '<path d="M6 44c10 4 12-10 22-12s14 8 24 2" stroke="' + c + '" stroke-width="8.5" fill="none" stroke-linecap="round"/>'
           + G('<ellipse cx="52" cy="32" rx="9" ry="7.5" fill="' + c + '"/>', d)
           + '<path d="M46 36c4 3 9 3 12 0" fill="none" stroke="' + d + '" stroke-width="2.2" stroke-linecap="round"/>'
           + eye(54, 29, 2.4);
    },
    /* ปลาตะพัด (ลำตัวยาวมีเกล็ด) */
    arowana(c){
      const d = dk(c);
      return G('<path d="M6 32c8-9 22-13 36-11 8 1 14 5 16 11-6 6-14 10-24 10-12 0-22-4-28-10z" fill="' + c + '"/>'
             + '<path d="M6 32l-4-8 2 8-2 8z" fill="' + lt(c, .18) + '"/>', d)
           + '<g fill="' + lt(c, .45) + '"><circle cx="22" cy="30" r="2.6"/><circle cx="31" cy="32" r="2.6"/><circle cx="40" cy="31" r="2.6"/></g>'
           + '<path d="M52 27c4-1 7 0 8 1" stroke="' + d + '" stroke-width="2" fill="none" stroke-linecap="round"/>'
           + eye(49, 29);
    },
    /* ลูกอ๊อด */
    tadpole(c){
      const d = dk(c);
      return G('<path d="M26 32c0-7 5-12 11-12s11 5 11 12-5 12-11 12-11-5-11-12z" fill="' + c + '"/>'
             + '<path d="M26 32c-8 0-14 5-19 10 8 0 14-3 19-4z" fill="' + lt(c, .2) + '"/>', d)
           + eye(41, 28);
    },
    frog(c){
      const d = dk(c);
      return G('<ellipse cx="32" cy="40" rx="19" ry="14" fill="' + c + '"/>'
             + '<circle cx="23" cy="24" r="8" fill="' + c + '"/><circle cx="41" cy="24" r="8" fill="' + c + '"/>'
             + '<path d="M14 48c-5 3-8 6-8 6s6 1 10-2M50 48c5 3 8 6 8 6s-6 1-10-2" fill="' + lt(c, .15) + '"/>', d)
           + '<circle cx="23" cy="23" r="3.4" fill="#33261d"/><circle cx="41" cy="23" r="3.4" fill="#33261d"/>'
           + '<circle cx="24" cy="22" r="1.2" fill="#fff"/><circle cx="42" cy="22" r="1.2" fill="#fff"/>'
           + '<path d="M25 43c4 3 10 3 14 0" stroke="' + d + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    },
    /* หอย — ⚠ หนวดต้องงอกจาก "หัว" ที่เป็นก้อนต่อจากตัว ไม่ใช่ก้านลอยอยู่ข้างๆ */
    snail(c, o){
      const d = dk(c), sh = (o && o.shell) || '#c98d4e';
      return G('<path d="M6 48c0-7 5-12 12-12h20c8 0 14 3 16 8 1 2 1 3 0 4z" fill="' + c + '"/>', d)
           + G('<circle cx="26" cy="31" r="15" fill="' + sh + '"/>', dk(sh))
           + '<path d="M26 31a8 8 0 1 1 7-4" stroke="' + dk(sh, .5) + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
           + '<path d="M45 37l3-9M51 38l5-8" stroke="' + d + '" stroke-width="2.6" stroke-linecap="round"/>'
           + '<circle cx="48" cy="26" r="2.6" fill="#33261d"/><circle cx="56" cy="28" r="2.6" fill="#33261d"/>';
    },
    /* กุ้ง — ⚠ รอบก่อนใส่ "ขาเดิน" 3 ขากางออก + ลำตัวเป็นวงรี ⇒ ดูเป็นแมลง
       คราวนี้: ปล้องถี่ · ขาว่ายน้ำสั้นๆ ใต้ท้อง · หางพัด 3 แฉกชัด · กรีแหลมที่หัว */
    shrimp(c){
      const d = dk(c);
      return G('<path d="M22 24c9-4 20-4 26 3 4 6 4 12-1 17-7 5-17 5-25 0z" fill="' + c + '"/>'
             + '<path d="M22 24c-5-5-11-8-15-7 2 4 3 8 3 12s-1 8-3 12c4 1 10-2 15-7z" fill="' + lt(c, .22) + '"/>'
             + '<path d="M10 29c-3-3-6-4-8-4 1 3 1 6 0 9 2 0 5-1 8-3z" fill="' + lt(c, .22) + '"/>', d)
           + '<g stroke="' + dk(c, .8) + '" stroke-width="2.2" fill="none" stroke-linecap="round">'
           + '<path d="M28 23c-1.4 6-1.4 14 0 19M35 23c-1.4 6-1.4 14 0 19M42 25c-1.2 5-1.2 12 0 16"/></g>'
           + '<g stroke="' + d + '" stroke-width="2" fill="none" stroke-linecap="round">'
           + '<path d="M27 43v4M32 44v4M37 44v4M42 43v4"/></g>'
           + '<path d="M50 22c4-5 8-7 11-7" stroke="' + d + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
           + '<path d="M52 28c4-4 8-6 11-6M52 33c4-1 8 1 11 4" stroke="' + d + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
           + eye(47, 28, 2.4);
    },
    crab(c){
      const d = dk(c);
      return G('<ellipse cx="32" cy="34" rx="17" ry="12" fill="' + c + '"/>'
             + '<path d="M15 28c-6-4-10-4-12-2 2 3 6 6 11 7zM49 28c6-4 10-4 12-2-2 3-6 6-11 7z" fill="' + lt(c, .12) + '"/>', d)
           + '<path d="M18 45l-6 7M27 47l-3 8M37 47l3 8M46 45l6 7" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>'
           + eye(26, 28, 2.6) + eye(38, 28, 2.6)
           + '<path d="M26 38c4 3 8 3 12 0" stroke="' + d + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    },
    turtle(c, o){
      const sh = (o && o.shell) || '#8a6a3a';
      return G('<ellipse cx="32" cy="34" rx="18" ry="13" fill="' + sh + '"/>', dk(sh))
           + G('<circle cx="52" cy="30" r="6.5" fill="' + c + '"/>'
             + '<path d="M16 44c-4 3-6 6-6 6s5 1 8-1zM44 44c4 3 6 6 6 6s-5 1-8-1z" fill="' + c + '"/>', dk(c))
           + '<g fill="' + lt(sh, .3) + '"><circle cx="26" cy="31" r="4"/><circle cx="36" cy="33" r="4"/><circle cx="31" cy="40" r="3.4"/></g>'
           + eye(54, 28, 2.2);
    },
    /* ปลาหมึกกล้วย — ⚠ ต้องต่างจาก octopus/jelly ให้ชัด: **ลำตัวแหลม + ครีบสามเหลี่ยม 2 ข้าง**
       ของเดิมเป็นหัวกลม+หนวด ⇒ ดูเหมือนหมึกยักษ์/แมงกะพรุนไปหมด */
    squid(c){
      const d = dk(c);
      return G('<path d="M32 4c5 0 9 7 10 16 1 8 0 14-2 18H24c-2-4-3-10-2-18C23 11 27 4 32 4z" fill="' + c + '"/>'
             + '<path d="M23 14C15 15 9 19 7 23c5 4 11 6 16 5zM41 14c8 1 14 5 16 9-5 4-11 6-16 5z" fill="' + lt(c, .25) + '"/>', d)
           + '<g stroke="' + d + '" stroke-width="2.8" fill="none" stroke-linecap="round">'
           + '<path d="M25 39c-3 7-6 11-9 13M29 40c-2 8-3 12-4 16M35 40c2 8 3 12 4 16M39 39c3 7 6 11 9 13"/></g>'
           + '<path d="M31 40c-2 10-3 15-2 19M33 40c2 10 3 15 2 19" stroke="' + d + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           + eye(28, 30) + eye(37, 30);
    },
    octopus(c){
      const d = dk(c);
      return G('<path d="M32 10c11 0 18 8 18 17 0 6-2 9-4 12H18c-2-3-4-6-4-12 0-9 7-17 18-17z" fill="' + c + '"/>', d)
           + '<path d="M20 39c-4 6-8 8-12 9 4 3 9 2 13-2M28 40c-2 8-4 12-6 15 4 0 7-4 9-9M36 40c2 8 4 12 6 15-4 0-7-4-9-9M44 39c4 6 8 8 12 9-4 3-9 2-13-2" stroke="' + d + '" stroke-width="2.6" fill="' + lt(c, .1) + '" stroke-linecap="round"/>'
           + eye(26, 24, 3) + eye(39, 24, 3);
    },
    /* ม้าน้ำ — ⚠ รอบก่อนคอยาว + หงอน 2 แฉก ⇒ ดูเป็น "ยีราฟ"
       คราวนี้: หัวเล็ก จมูกเรียวชี้ลงขวา · ตัวโค้ง S สั้นลง · หางม้วนกลม · สันหลังเป็นหยัก */
    seahorse(c){
      const d = dk(c);
      const spine = 'M33 24c-7 5-10 12-8 18 1 5 4 8 3 12-1 4-5 6-8 5-3-1-4-4-2-6 2-1 4 0 4 2';
      return '<g fill="' + lt(c, .3) + '" stroke="' + d + '" stroke-width="2.2" stroke-linejoin="round">'
           + '<path d="M24 28l-6-3 1 7zM21 36l-7-2 2 7zM22 44l-7 0 3 6z"/></g>'
           + '<path d="' + spine + '" fill="none" stroke="' + d + '" stroke-width="14" stroke-linecap="round"/>'
           + '<path d="' + spine + '" fill="none" stroke="' + c + '" stroke-width="9.5" stroke-linecap="round"/>'
           + G('<path d="M30 33c6 1 10 4 11 8-5 1-9-1-12-5z" fill="' + lt(c, .3) + '"/>', d)
           + G('<path d="M28 17c0-5 4-9 9-9 4 0 7 2 8 5l10 5c1 .6 1 2.2 0 2.8l-10 3.4c-1 3-4 5-8 5-5 0-9-4-9-8z" fill="' + c + '"/>'
             + '<path d="M31 9c-2-4-1-7 1-8 1 2 1 5 0 6 2-1 4 0 5 2z" fill="' + lt(c, .35) + '"/>', d)
           + eye(37, 15, 2.4);
    },
    jelly(c){
      const d = dk(c);
      return G('<path d="M12 32c0-11 9-19 20-19s20 8 20 19c0 3-1 5-3 5H15c-2 0-3-2-3-5z" fill="' + c + '"/>', d)
           + '<path d="M20 38c-1 8-3 11-5 15M28 39c0 9-1 12-2 16M36 39c0 9 1 12 2 16M44 38c1 8 3 11 5 15" stroke="' + d + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           + '<circle cx="26" cy="26" r="3" fill="' + lt(c, .5) + '"/><circle cx="37" cy="24" r="2.4" fill="' + lt(c, .5) + '"/>';
    },
    starfish(c){
      const d = dk(c);
      let p = '';
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + i / 5 * Math.PI * 2, a2 = a + Math.PI/5;
        p += (i ? 'L' : 'M') + (32 + Math.cos(a) * 24).toFixed(1) + ' ' + (32 + Math.sin(a) * 24).toFixed(1)
           + 'L' + (32 + Math.cos(a2) * 10).toFixed(1) + ' ' + (32 + Math.sin(a2) * 10).toFixed(1);
      }
      return G('<path d="' + p + 'z" fill="' + c + '"/>', d)
           + '<g fill="' + lt(c, .45) + '"><circle cx="32" cy="30" r="2.4"/><circle cx="26" cy="36" r="2"/><circle cx="38" cy="36" r="2"/></g>';
    },
    urchin(c){
      const d = dk(c);
      let sp = '';
      for(let i = 0; i < 12; i++){
        const a = i / 12 * Math.PI * 2;
        sp += '<path d="M' + (32 + Math.cos(a) * 11).toFixed(1) + ' ' + (32 + Math.sin(a) * 11).toFixed(1)
            + 'L' + (32 + Math.cos(a) * 24).toFixed(1) + ' ' + (32 + Math.sin(a) * 24).toFixed(1) + '"/>';
      }
      return '<g stroke="' + d + '" stroke-width="3" stroke-linecap="round">' + sp + '</g>'
           + G('<circle cx="32" cy="32" r="12" fill="' + c + '"/>', d);
    },
    scallop(c){
      const d = dk(c);
      let rib = '';
      for(let i = -2; i <= 2; i++) rib += '<path d="M32 46L' + (32 + i * 9) + ' 20"/>';
      return G('<path d="M32 48c-14 0-24-9-24-18 0-6 5-12 12-12h24c7 0 12 6 12 12 0 9-10 18-24 18z" fill="' + c + '"/>', d)
           + '<g stroke="' + dk(c, .82) + '" stroke-width="2.2" fill="none" stroke-linecap="round">' + rib + '</g>';
    },
    /* หอยสังข์ — 🔑 สร้างจาก "วงกลมไล่ขนาดเรียงตามแนวเกลียว" แล้ววาดเงาทึบใต้ชั้นสี
       ⇒ ได้เงารวมเป็นกรวยหอยที่มีวงเกลียวชัด (เขียนเป็น path ก้อนเดียวมาแล้ว 2 รอบ อ่านไม่ออกทั้งคู่) */
    conch(c){
      const d = dk(c);
      const P = [[23, 43, 17], [35, 31, 13.5], [44, 21, 10], [50, 13, 6.5]];
      let out = '', fil = '', whorl = '';
      P.forEach(([x, y, r], i)=>{
        out += '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 1.5) + '"/>';
        fil += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
        if(i) whorl += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
      });
      return '<g fill="' + d + '">' + out + '</g><g fill="' + c + '">' + fil + '</g>'
           + '<g fill="none" stroke="' + dk(c, .8) + '" stroke-width="2.2">' + whorl + '</g>'
           + G('<ellipse cx="16" cy="47" rx="7.5" ry="10.5" transform="rotate(-34 16 47)" fill="' + lt(c, .5) + '"/>', d);
    },
    /* ---- ของที่ไม่ใช่ปลา (junk ที่ตกได้) ---- */
    boot(){
      const c = '#7d5a3c', d = dk(c);
      return G('<path d="M22 12h12v22c0 4 3 6 8 7l10 3v8H22z" fill="' + c + '"/>'
             + '<path d="M20 52h34v6H20z" fill="' + dk(c, .8) + '"/>', d);
    },
    can(){
      const c = '#b9c3cb', d = dk(c);
      return G('<path d="M20 16h24v32H20z" fill="' + c + '"/><ellipse cx="32" cy="16" rx="12" ry="4.5" fill="' + lt(c, .35) + '"/>', d)
           + '<path d="M23 26h18M23 34h18" stroke="' + dk(c, .78) + '" stroke-width="2.6" stroke-linecap="round"/>';
    },
    bottle(){
      const c = '#8fd3c7', d = dk(c);
      return G('<path d="M27 10h10v9c0 3 7 6 7 13v22c0 4-3 6-7 6H27c-4 0-7-2-7-6V32c0-7 7-10 7-13z" fill="' + c + '"/>', d)
           + '<path d="M24 36h16v10H24z" fill="' + lt(c, .5) + '"/>';
    },
    seaweed(){
      const c = '#5aa54f', d = dk(c);
      return '<g stroke="' + d + '" stroke-width="7" fill="none" stroke-linecap="round">'
           + '<path d="M22 56c-4-10 4-14 0-22s2-14 2-14M42 56c4-10-4-14 0-22s-2-14-2-14"/></g>'
           + '<g stroke="' + c + '" stroke-width="4" fill="none" stroke-linecap="round">'
           + '<path d="M22 56c-4-10 4-14 0-22s2-14 2-14M42 56c4-10-4-14 0-22s-2-14-2-14"/></g>';
    },
  };

  /* ---------- ตารางปลา 48 ชนิด: ทรง + สี ----------
     ⚠ id ต้องตรงกับ `FISH` ใน js/house-play.js เป๊ะ (มีเทสไล่ตรวจว่าครบทุกตัว) */
  const FISH_ICON = {
    /* 🐟 น้ำจืด */
    nil:      ['fish',    '#7a9bb5'],
    carp:     ['fish',    '#c9a35e', {stripe:1}],
    catfish:  ['whisker', '#8a8f95'],
    guppy:    ['fancy',   '#ff8fc4'],
    sew:      ['fish',    '#bcd3e0'],
    climb:    ['fish',    '#8fae62', {stripe:1}],
    sway:     ['fish',    '#9fb6c4'],
    tadpole:  ['tadpole', '#5f6b74'],
    snail:    ['snail',   '#c7b28e', {shell:'#a9763f'}],
    boot:     ['boot',    ''],
    can:      ['can',     ''],
    snake:    ['fish',    '#6f7f5c', {spot:1}],
    shrimp:   ['shrimp',  '#f0a07a'],
    crab:     ['crab',    '#d9764f'],
    feather:  ['fish',    '#a7b8c9', {spot:1}],
    gourami:  ['fish',    '#7f8f70'],
    goby:     ['whisker', '#a58f6d'],
    eel:      ['eel',     '#6b7a5e'],
    betta:    ['fancy',   '#c05ce0'],
    frog:     ['frog',    '#6fbf5a'],
    gold:     ['fancy',   '#ffb02e'],
    koi:      ['fish',    '#ff9a6b', {spot:1}],
    turtle:   ['turtle',  '#7fb36a', {shell:'#8a6a3a'}],
    arowana:  ['arowana', '#d9a441'],
    /* 🌊 ทะเล */
    sardine:  ['fish',    '#9fb9cc'],
    mackerel: ['fish',    '#6f95ad', {stripe:1}],
    anchovy:  ['fish',    '#b8cbd6'],
    seabass:  ['fish',    '#8ea9bb'],
    damsel:   ['fish',    '#4f8ce0', {stripe:1}],
    seashrimp:['shrimp',  '#ff9d8a'],
    scallop:  ['scallop', '#f2c9a0'],
    conch:    ['conch',   '#f0b98d'],
    seaweed:  ['seaweed', ''],
    bottle:   ['bottle',  ''],
    squid:    ['squid',   '#e8a3c4'],
    clown:    ['fish',    '#ff8b34', {stripe:1}],
    puffer:   ['puffer',  '#e8c76b'],
    kingfish: ['fish',    '#8fa8bd'],
    flat:     ['flat',    '#b39b76'],
    bluecrab: ['crab',    '#5d8ed6'],
    butterfly:['fish',    '#ffd45e', {stripe:1}],
    parrot:   ['fish',    '#43c2a8', {spot:1}],
    urchin:   ['urchin',  '#5b4a7a'],
    octopus:  ['octopus', '#e0728f'],
    star:     ['starfish','#ff9d4d'],
    jelly:    ['jelly',   '#b58fe0'],
    seahorse: ['seahorse','#ffb15e'],
    seaturtle:['turtle',  '#5aa6a0', {shell:'#4b7a63'}],
  };

  const REG = {};        /* id → ฟังก์ชันคืน inner svg */
  Object.keys(FISH_ICON).forEach(id=>{
    const [shape, col, opt] = FISH_ICON[id];
    REG['fish-' + id] = ()=> SEA[shape](col, opt);
  });


  /* ============================================================
     🌱 พืชในแปลง · 🐛 สัตว์ในเมือง · 🎪 ท่าของน้อง · 🧸 ของเล่น · 🍖 อาหาร · 🍃 ของสะสม
     ============================================================ */
  const LEAF = (c, d) => '<path d="M32 22c-8-6-16-4-16-4s0 8 6 12 12 2 12 2z" fill="' + c + '" stroke="' + d + '" stroke-width="2.4" stroke-linejoin="round"/>';

  const PLANT = {
    carrot(){ const c = '#f08a3c', d = dk(c), g = '#5aa54f';
      return G('<path d="M32 56l-9-28c-1-3 1-6 4-6h10c3 0 5 3 4 6z" fill="' + c + '"/>', d)
           + G('<path d="M32 22c-2-8-8-12-8-12s-1 8 3 12zM32 22c2-8 8-12 8-12s1 8-3 12zM32 22c0-9 0-13 0-13s4 6 3 13z" fill="' + g + '"/>', dk(g))
           + '<path d="M27 34h10M28 42h8" stroke="' + d + '" stroke-width="2.2" stroke-linecap="round"/>'; },
    lettuce(){ const c = '#7cc46a', d = dk(c);
      return G('<path d="M32 54c-14 0-22-9-22-19 0-4 3-6 6-5-1-5 3-9 8-8 1-5 5-8 8-8s7 3 8 8c5-1 9 3 8 8 3-1 6 1 6 5 0 10-8 19-22 19z" fill="' + c + '"/>', d)
           + '<path d="M32 20c0 12 0 22 0 30M20 30c4 8 8 14 12 18M44 30c-4 8-8 14-12 18" stroke="' + lt(c, .45) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; },
    tomato(){ const c = '#e4574f', d = dk(c), g = '#5aa54f';
      return G('<circle cx="32" cy="38" r="19" fill="' + c + '"/>', d)
           + G('<path d="M32 20c-3-4-8-5-11-4 1 4 4 7 7 8-4 0-7 2-9 4 3 2 8 3 12 1 4 2 9 1 12-1-2-2-5-4-9-4 3-1 6-4 7-8-3-1-8 0-11 4z" fill="' + g + '"/>', dk(g))
           + '<path d="M32 20v6" stroke="' + dk(g) + '" stroke-width="3" stroke-linecap="round"/>'
           + '<ellipse cx="24" cy="32" rx="4" ry="6" fill="#fff" opacity=".28"/>'; },
    corn(){ const c = '#f3c53f', d = dk(c), g = '#6cb356';
      return G('<path d="M32 8c8 0 13 8 13 20s-5 26-13 26-13-14-13-26S24 8 32 8z" fill="' + c + '"/>', d)
           + '<g stroke="' + dk(c, .78) + '" stroke-width="2.2" stroke-linecap="round"><path d="M26 18v30M32 15v34M38 18v30M22 26v18M42 26v18"/></g>'
           + G('<path d="M19 30c-8-4-14-2-14-2s4 10 14 10zM45 30c8-4 14-2 14-2s-4 10-14 10z" fill="' + g + '"/>', dk(g)); },
    pumpkin(){ const c = '#ef8b2c', d = dk(c), g = '#5aa54f';
      return G('<ellipse cx="32" cy="38" rx="22" ry="17" fill="' + c + '"/>', d)
           + '<g stroke="' + dk(c, .8) + '" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M23 24c-3 8-3 20 0 28M41 24c3 8 3 20 0 28M32 21v34"/></g>'
           + '<path d="M32 21v-8" stroke="' + dk(g) + '" stroke-width="4" stroke-linecap="round"/>'
           + '<path d="M32 15c5-4 10-3 12-1-3 3-8 4-12 3z" fill="' + g + '" stroke="' + dk(g) + '" stroke-width="2" stroke-linejoin="round"/>'; },
    melon(){ const c = '#5aa84f', d = dk(c);
      return G('<circle cx="32" cy="34" r="21" fill="' + c + '"/>', d)
           + '<g stroke="' + lt(c, .45) + '" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M22 16c-4 10-4 26 0 36M42 16c4 10 4 26 0 36M11 34h42"/></g>'
           + '<path d="M32 13v-4" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>'; },
  };
  Object.keys(PLANT).forEach(id=>{ REG['seed-' + id] = PLANT[id]; });

  /* 🐛 สัตว์ที่เจอในเมือง (สัตว์ป่า 7 + สัตว์ฟาร์ม 4) — ต้องดูออกจากเงารวม */
  const CRIT = {
    rabbit(){ const c = '#f4efe6', d = '#b9a68d';
      return G('<ellipse cx="32" cy="42" rx="15" ry="12" fill="' + c + '"/><circle cx="32" cy="26" r="10" fill="' + c + '"/>'
             + '<ellipse cx="26" cy="12" rx="4.5" ry="10" fill="' + c + '"/><ellipse cx="38" cy="12" rx="4.5" ry="10" fill="' + c + '"/>'
             + '<circle cx="47" cy="44" r="5" fill="#fff"/>', d)
           + '<ellipse cx="26" cy="12" rx="2" ry="6" fill="#f4b8c8"/><ellipse cx="38" cy="12" rx="2" ry="6" fill="#f4b8c8"/>'
           + eye(27, 26, 2.4) + eye(37, 26, 2.4)
           + '<path d="M32 30l-2 2h4z" fill="#f48fb1"/>'; },
    bird(){ const c = '#64b5f6', d = dk(c);
      return G('<ellipse cx="30" cy="36" rx="16" ry="13" fill="' + c + '"/><circle cx="42" cy="24" r="9" fill="' + c + '"/>'
             + '<path d="M14 34c-6-4-10-4-10-4s2 8 10 10z" fill="' + lt(c, .2) + '"/>', d)
           + '<path d="M50 24l8 3-8 3z" fill="#f5a623" stroke="' + dk('#f5a623') + '" stroke-width="2" stroke-linejoin="round"/>'
           + '<path d="M24 34c6-4 12-2 15 2-5 4-11 4-15-2z" fill="' + lt(c, .35) + '"/>'
           + eye(44, 22, 2.4); },
    squirrel(){ const c = '#c68a5e', d = dk(c);
      return G('<ellipse cx="28" cy="40" rx="13" ry="14" fill="' + c + '"/><circle cx="28" cy="22" r="9" fill="' + c + '"/>'
             + '<path d="M44 50c10-4 14-16 8-26-6-9-14-6-13 2 5 0 8 4 7 10-1 5-5 9-11 10z" fill="' + lt(c, .18) + '"/>'
             + '<circle cx="22" cy="13" r="4" fill="' + c + '"/><circle cx="34" cy="13" r="4" fill="' + c + '"/>', d)
           + eye(24, 22, 2.2) + eye(32, 22, 2.2)
           + '<circle cx="28" cy="27" r="2" fill="#5d4037"/>'; },
    chicken(){ const c = '#fdf6ec', d = '#c9b79a';
      return G('<ellipse cx="30" cy="40" rx="16" ry="13" fill="' + c + '"/><circle cx="42" cy="24" r="9" fill="' + c + '"/>'
             + '<path d="M14 40c-6 0-9 2-9 2s4 6 10 5z" fill="' + lt(c, .1) + '"/>', d)
           + '<path d="M40 12c2-4 6-3 6 0 3-2 6 1 4 4-4 2-8 2-10 0z" fill="#e53935" stroke="' + dk('#e53935') + '" stroke-width="2" stroke-linejoin="round"/>'
           + '<path d="M51 25l7 2-7 3z" fill="#f5a623" stroke="' + dk('#f5a623') + '" stroke-width="2" stroke-linejoin="round"/>'
           + '<path d="M26 53l-3 6M36 53l3 6" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/>'
           + eye(44, 22, 2.4); },
    cat(){ const c = '#ffb74d', d = dk(c);
      return G('<ellipse cx="30" cy="42" rx="15" ry="11" fill="' + c + '"/><circle cx="32" cy="24" r="12" fill="' + c + '"/>'
             + '<path d="M22 14l-2-9 9 4zM42 14l2-9-9 4z" fill="' + c + '"/>'
             + '<path d="M45 44c8-2 12-8 12-14-5 2-7 6-8 9-2 3-4 4-6 5z" fill="' + lt(c, .15) + '"/>', d)
           + eye(27, 24, 2.6) + eye(37, 24, 2.6)
           + '<path d="M32 29l-2 2h4z" fill="#e57373"/>'
           + '<path d="M20 27h-7M20 31h-7M44 27h7M44 31h7" stroke="' + d + '" stroke-width="1.8" stroke-linecap="round"/>'; },
    duck(){ const c = '#fff8e7', d = '#c9bda0';
      return G('<ellipse cx="30" cy="40" rx="17" ry="12" fill="' + c + '"/><circle cx="44" cy="24" r="9" fill="' + c + '"/>'
             + '<path d="M13 38c-6 2-9 5-9 5s5 4 11 2z" fill="' + lt(c, .1) + '"/>', d)
           + '<path d="M52 25c5 0 7 2 7 3s-2 3-7 3z" fill="#f5a623" stroke="' + dk('#f5a623') + '" stroke-width="2" stroke-linejoin="round"/>'
           + eye(45, 22, 2.4); },
    fish(){ return SEA.fish('#5fb8e0'); },
    cow(){ const c = '#fdfdf8', d = '#c3bcae';
      return G('<ellipse cx="30" cy="38" rx="19" ry="14" fill="' + c + '"/><circle cx="47" cy="26" r="10" fill="' + c + '"/>', d)
           + '<g fill="#5b4a42"><ellipse cx="22" cy="34" rx="6" ry="5"/><ellipse cx="35" cy="42" rx="5" ry="4"/></g>'
           + '<path d="M40 18c-3-4-7-4-9-2 2 3 6 4 9 2M54 18c3-4 7-4 9-2-2 3-6 4-9 2" fill="' + c + '" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/>'
           + '<ellipse cx="52" cy="31" rx="6" ry="4.5" fill="#f4b8c8"/>'
           + eye(45, 23, 2.2); },
    sheep(){ const c = '#fdfdf8', d = '#c9c2b4';
      return G('<circle cx="26" cy="36" r="9" fill="' + c + '"/><circle cx="36" cy="32" r="10" fill="' + c + '"/><circle cx="34" cy="44" r="9" fill="' + c + '"/><circle cx="22" cy="46" r="8" fill="' + c + '"/>'
             + '<circle cx="48" cy="30" r="8" fill="#5b4a42"/>', d)
           + '<path d="M42 24c-4-2-7 0-7 2 3 1 6 0 7-2M55 24c4-2 7 0 7 2-3 1-6 0-7-2" fill="#5b4a42"/>'
           + '<circle cx="46" cy="29" r="2" fill="#fff"/><circle cx="52" cy="29" r="2" fill="#fff"/>'; },
    pig(){ const c = '#f7b0bd', d = dk(c);
      return G('<ellipse cx="30" cy="38" rx="18" ry="14" fill="' + c + '"/><circle cx="46" cy="30" r="11" fill="' + c + '"/>'
             + '<path d="M40 20l-2-8 8 4zM54 20l2-8-8 4z" fill="' + c + '"/>', d)
           + '<ellipse cx="52" cy="33" rx="6" ry="5" fill="' + dk(c, .86) + '"/>'
           + '<circle cx="50" cy="33" r="1.4" fill="' + d + '"/><circle cx="54" cy="33" r="1.4" fill="' + d + '"/>'
           + eye(44, 27, 2.2); },
    chick(){ const c = '#ffd75e', d = dk(c);
      return G('<circle cx="30" cy="38" r="15" fill="' + c + '"/><circle cx="40" cy="24" r="10" fill="' + c + '"/>', d)
           + '<path d="M50 24l7 2-7 3z" fill="#f5a623" stroke="' + dk('#f5a623') + '" stroke-width="2" stroke-linejoin="round"/>'
           + '<path d="M26 52l-2 6M34 52l2 6" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/>'
           + eye(42, 22, 2.4); },
  };
  Object.keys(CRIT).forEach(id=>{ REG['critter-' + id] = CRIT[id]; });

  /* 🐾 สัตว์เลี้ยง 12 ชนิด (การ์ดในร้านสัตว์เลี้ยง + หน้า "สัตว์เลี้ยงของหนู")
     🔑 ใช้ทรงร่วมกับสัตว์ในเมืองที่วาดไว้แล้วเท่าที่ทรงตรงกัน (กระต่าย/แมว/ลูกเจี๊ยบ/แกะ/หมู)
        และทรงสัตว์น้ำ (กบ/เต่า) ⇒ วาดใหม่จริงแค่ 5 ตัว (หมา/แฮมสเตอร์/เพนกวิน/ยูนิคอร์น/แพนด้า)
     ⚠ id ต้องตรงกับ `PET_TYPES` ใน js/house.js เป๊ะ */
  const PET = {
    dog(){ const c = '#c9a06a', d = dk(c);
      return G('<ellipse cx="30" cy="42" rx="15" ry="12" fill="' + c + '"/><circle cx="32" cy="24" r="12" fill="' + c + '"/>'
             + '<ellipse cx="20" cy="22" rx="5" ry="9" fill="' + dk(c, .82) + '"/><ellipse cx="44" cy="22" rx="5" ry="9" fill="' + dk(c, .82) + '"/>'
             + '<path d="M45 46c9-2 13-8 12-14-4 3-7 6-9 9-2 3-2 4-3 5z" fill="' + lt(c, .16) + '"/>', d)
           + '<ellipse cx="32" cy="30" rx="7" ry="5.4" fill="' + lt(c, .5) + '"/>'
           + '<ellipse cx="32" cy="28" rx="2.8" ry="2.2" fill="#5b4a42"/>'
           + '<path d="M32 30v3M32 33c-2 2-5 1-6-1M32 33c2 2 5 1 6-1" stroke="' + dk(c, .55) + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
           + eye(27, 22, 2.4) + eye(37, 22, 2.4); },
    cat(){ return CRIT.cat(); },
    rabbit(){ return CRIT.rabbit(); },
    chick(){ return CRIT.chick(); },
    sheep(){ return CRIT.sheep(); },
    pig(){ return CRIT.pig(); },
    frog(){ return SEA.frog('#6fbf5a'); },
    turtle(){ return SEA.turtle('#7fb36a', {shell:'#8a6a3a'}); },
    hamster(){ const c = '#e0b878', d = dk(c);
      return G('<ellipse cx="32" cy="38" rx="19" ry="17" fill="' + c + '"/>'
             + '<circle cx="19" cy="22" r="6" fill="' + c + '"/><circle cx="45" cy="22" r="6" fill="' + c + '"/>', d)
           + '<circle cx="19" cy="22" r="3" fill="#f4b8c8"/><circle cx="45" cy="22" r="3" fill="#f4b8c8"/>'
           + '<ellipse cx="32" cy="46" rx="12" ry="9" fill="' + lt(c, .45) + '"/>'
           + '<ellipse cx="32" cy="36" rx="2.6" ry="2" fill="#5b4a42"/>'
           + '<path d="M32 38v2.5M32 40.5c-2 2-4 1.4-5 0M32 40.5c2 2 4 1.4 5 0" stroke="' + dk(c, .55) + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
           + '<path d="M22 34h-8M22 38h-8M42 34h8M42 38h8" stroke="' + d + '" stroke-width="1.6" stroke-linecap="round"/>'
           + eye(25, 31, 2.6) + eye(39, 31, 2.6); },
    penguin(){ const c = '#3c4a5a', d = dk(c), b = '#f5a623';
      return G('<ellipse cx="32" cy="38" rx="16" ry="20" fill="' + c + '"/>'
             + '<path d="M14 40c-5 4-7 9-6 12 4 0 8-3 10-7zM50 40c5 4 7 9 6 12-4 0-8-3-10-7z" fill="' + lt(c, .12) + '"/>', d)
           + '<ellipse cx="32" cy="42" rx="10.5" ry="14" fill="#fdfdf8"/>'
           + '<path d="M27 22c0-5 2-8 5-8s5 3 5 8c0 4-2 6-5 6s-5-2-5-6z" fill="#fdfdf8"/>'
           + '<path d="M32 30l7 3-7 3-7-3z" fill="' + b + '" stroke="' + dk(b) + '" stroke-width="1.8" stroke-linejoin="round"/>'
           + '<path d="M24 57c-4 2-6 3-6 4s5 1 9-1M40 57c4 2 6 3 6 4s-5 1-9-1" fill="' + b + '" stroke="' + dk(b) + '" stroke-width="1.8" stroke-linejoin="round"/>'
           + eye(27, 25, 2.4) + eye(37, 25, 2.4); },
    /* ⚠ ยูนิคอร์น: **เขาต้องอยู่กลางกระหม่อม แผงคออยู่ด้านหลังหัว** — รอบแรกวางเขาเยื้องไปข้าง
       และแผงคอทับหน้าจนดูเหมือนก้อนสีม่วงบังตา (แก้ 2026-08-19) */
    unicorn(){ const c = '#fdf3fb', d = '#c9a8c4', m = '#b58fe0';
      return G('<path d="M27 13c-9 3-14 11-14 19 0 7 3 12 7 15 1-5 0-9-1-13-1-7 2-14 8-18z" fill="' + m + '"/>', dk(m))
           + G('<ellipse cx="32" cy="43" rx="15" ry="12" fill="' + c + '"/>'
             + '<circle cx="35" cy="26" r="12" fill="' + c + '"/>'
             + '<path d="M28 15l-2-8 7 4z" fill="' + c + '"/>', d)
           + G('<path d="M31 13l2-12 6 10z" fill="#ffd54f"/>', dk('#ffd54f'))
           + '<path d="M32 3l4 7" stroke="' + dk('#ffd54f', .8) + '" stroke-width="1.8" stroke-linecap="round"/>'
           + '<ellipse cx="39" cy="32" rx="6" ry="4.6" fill="#f6dcef"/>'
           + '<ellipse cx="39" cy="31" rx="2.2" ry="1.7" fill="#a8809f"/>'
           + eye(32, 25, 2.4) + eye(42, 25, 2.4); },
    panda(){ const c = '#fdfdf8', d = '#c3bcae', k = '#3a3a3a';
      return G('<ellipse cx="32" cy="40" rx="17" ry="16" fill="' + c + '"/><circle cx="32" cy="22" r="13" fill="' + c + '"/>', d)
           + '<g fill="' + k + '"><circle cx="21" cy="12" r="6"/><circle cx="43" cy="12" r="6"/>'
           + '<ellipse cx="25" cy="21" rx="5" ry="6" transform="rotate(-18 25 21)"/>'
           + '<ellipse cx="39" cy="21" rx="5" ry="6" transform="rotate(18 39 21)"/>'
           + '<ellipse cx="18" cy="42" rx="6" ry="9" transform="rotate(-16 18 42)"/>'
           + '<ellipse cx="46" cy="42" rx="6" ry="9" transform="rotate(16 46 42)"/></g>'
           + '<circle cx="25" cy="21" r="2.2" fill="#fff"/><circle cx="39" cy="21" r="2.2" fill="#fff"/>'
           + '<ellipse cx="32" cy="28" rx="2.8" ry="2.2" fill="' + k + '"/>'
           + '<path d="M32 30v2.5M32 32.5c-2 2-4 1.4-5 0M32 32.5c2 2 4 1.4 5 0" stroke="' + k + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'; },
  };
  Object.keys(PET).forEach(id=>{ REG['pet-' + id] = PET[id]; });

  /* 🏷️ ไอคอนแท็บกลุ่มราคาในร้านสัตว์เลี้ยง (เดิมเป็น emoji 🌱⭐💎👑) */
  const PETTAB = {
    'petg-start'(){ const c = '#7cc46a', d = dk(c);
      return G('<path d="M32 54V30" stroke="' + d + '" stroke-width="4" stroke-linecap="round" fill="none"/>'
             + '<path d="M32 32c-9 2-16-2-18-10 9-2 16 2 18 10z" fill="' + c + '"/>'
             + '<path d="M32 26c2-9 9-13 17-12-1 9-8 14-17 12z" fill="' + lt(c, .25) + '"/>', d); },
    'petg-mid'(){ const c = '#ffd54f', d = dk(c);
      let p2 = '';
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + i / 5 * Math.PI * 2, a2 = a + Math.PI/5;
        p2 += (i ? 'L' : 'M') + (32 + Math.cos(a) * 24).toFixed(1) + ' ' + (32 + Math.sin(a) * 24).toFixed(1)
            + 'L' + (32 + Math.cos(a2) * 10).toFixed(1) + ' ' + (32 + Math.sin(a2) * 10).toFixed(1);
      }
      return G('<path d="' + p2 + 'z" fill="' + c + '"/>', d); },
    'petg-rare'(){ const c = '#5ec8e8', d = dk(c);
      return G('<path d="M20 12h24l12 14-24 26L8 26z" fill="' + c + '"/>', d)
           + '<path d="M20 12l-12 14h48L44 12M32 52l-8-26h16z" fill="none" stroke="' + dk(c, .78) + '" stroke-width="2.2" stroke-linejoin="round"/>'; },
    'petg-epic'(){ const c = '#ffd54f', d = dk(c);
      return G('<path d="M8 44 6 18l12 9 14-15 14 15 12-9-2 26z" fill="' + c + '"/>'
             + '<path d="M8 44h48v8H8z" fill="' + lt(c, .2) + '"/>', d)
           + '<circle cx="32" cy="34" r="3.2" fill="#e05252"/>'
           + '<circle cx="18" cy="36" r="2.6" fill="#4fa3d9"/><circle cx="46" cy="36" r="2.6" fill="#4fa3d9"/>'; },
  };
  Object.keys(PETTAB).forEach(id=>{ REG[id] = PETTAB[id]; });

  /* ============================================================
     🪑 เฟอร์นิเจอร์ (เฟส A ของ ICON-PLAN.md · ผู้ใช้อนุมัติ "วาด SVG เอง" 2026-08-19)
     🔑 หลักการเดียวกับปลา 48 ชนิด: **ทรงร่วมไม่กี่ทรง + สีประจำหมวด** ไม่ได้วาดทีละ 193 ชิ้น
     ⚠ id ต้องตรงกับคลังใน js/house-furniture.js เป๊ะ (มีเทสไล่ตรวจ)
     ⚠ ของทุกชิ้น "วางอยู่บนพื้น" ⇒ วาดให้ก้นชิ้นงานอยู่ราว y=54 เท่ากันหมด จะได้ดูเป็นชุดเดียว
     ============================================================ */
  const FW = {                                  /* จานสีมาตรฐานของเฟอร์นิเจอร์ */
    wood:'#d7a86e', wood2:'#c08a4e', cream:'#f6ead5', fab:'#8fb8e0', fab2:'#f2a7c3',
    green:'#8fc98a', metal:'#b9c3cb', dark:'#5b6b7a', warm:'#f0b26b', white:'#fdfaf3',
  };
  /* ---- ทรงร่วม ---- */
  /* เก้าอี้: พนักพิง + ที่นั่ง + ขา 4 (o.back = สูงพนัก · o.arm = มีที่วางแขน) */
  function fChair(c, o){
    o = o || {};
    const d = dk(c), sd = dk(c, .78);
    let g = G('<path d="M16 ' + (34 - (o.back || 20)) + 'h32v' + (o.back || 20) + 'H16z" fill="' + lt(c, .12) + '"/>'
            + '<path d="M12 34h40v9H12z" fill="' + c + '"/>', d);
    g += '<g stroke="' + sd + '" stroke-width="5" stroke-linecap="round"><path d="M17 43v11M47 43v11"/></g>';
    if(o.arm) g += G('<path d="M10 26h5v10h-5zM49 26h5v10h-5z" fill="' + lt(c, .22) + '"/>', d);
    return g;
  }
  /* โซฟา: ฐานยาว + พนัก + ที่วางแขน 2 ข้าง (o.seats = จำนวนเบาะ) */
  function fSofa(c, o){
    o = o || {};
    const d = dk(c), n = o.seats || 2;
    let cu = '';
    for(let i = 0; i < n; i++){
      const w = 34 / n;
      cu += '<rect x="' + (15 + i * w + 1) + '" y="32" width="' + (w - 2) + '" height="9" rx="3" fill="' + lt(c, .3) + '"/>';
    }
    return G('<path d="M8 30c0-4 3-7 7-7h34c4 0 7 3 7 7v14H8z" fill="' + lt(c, .14) + '"/>'
           + '<path d="M6 34h52v12c0 2-2 4-4 4H10c-2 0-4-2-4-4z" fill="' + c + '"/>'
           + '<path d="M4 30h8v18H4zM52 30h8v18h-8z" fill="' + lt(c, .24) + '"/>', d)
         + cu
         + '<g stroke="' + dk(c, .72) + '" stroke-width="4" stroke-linecap="round"><path d="M10 50v5M54 50v5"/></g>';
  }
  /* ก้อนนุ่ม (ถุงถั่ว/พูฟ/เบาะ) — o.flat = แบนเตี้ย */
  function fPouf(c, o){
    o = o || {};
    const d = dk(c);
    if(o.flat) return G('<rect x="8" y="34" width="48" height="16" rx="7" fill="' + c + '"/>', d)
                     + '<path d="M14 42h36" stroke="' + dk(c, .8) + '" stroke-width="2.4" stroke-linecap="round"/>';
    return G('<path d="M12 48c-2-14 6-24 20-24s22 10 20 24z" fill="' + c + '"/>'
           + '<rect x="8" y="46" width="48" height="8" rx="4" fill="' + lt(c, .18) + '"/>', d)
         + '<path d="M32 25c-6 6-8 14-8 21M32 25c6 6 8 14 8 21" stroke="' + dk(c, .82) + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  }
  /* สตูล/ม้านั่งเตี้ย — o.round = ที่นั่งกลม */
  function fStool(c, o){
    o = o || {};
    const d = dk(c);
    return G((o.round ? '<ellipse cx="32" cy="30" rx="20" ry="8" fill="' + c + '"/>'
                      : '<rect x="12" y="26" width="40" height="9" rx="3" fill="' + c + '"/>'), d)
         + '<g stroke="' + dk(c, .74) + '" stroke-width="5" stroke-linecap="round">'
         + '<path d="M18 34l-3 20M46 34l3 20"/></g>';
  }
  /* โต๊ะ: หน้าโต๊ะ + ขา (o.round = หน้ากลม · o.h = ความสูงขา · o.shelf = มีชั้นล่าง) */
  function fTable(c, o){
    o = o || {};
    const d = dk(c), top = o.top == null ? 24 : o.top;
    let g = G(o.round ? '<ellipse cx="32" cy="' + (top + 4) + '" rx="24" ry="8" fill="' + c + '"/>'
                      : '<rect x="6" y="' + top + '" width="52" height="8" rx="3" fill="' + c + '"/>', d);
    g += '<g stroke="' + dk(c, .74) + '" stroke-width="5" stroke-linecap="round">'
       + '<path d="M14 ' + (top + 8) + 'v' + (52 - top - 8) + 'M50 ' + (top + 8) + 'v' + (52 - top - 8) + '"/></g>';
    if(o.shelf) g += G('<rect x="12" y="' + (top + 16) + '" width="40" height="6" rx="2" fill="' + lt(c, .2) + '"/>', d);
    return g;
  }
  /* ตู้/ชั้นวาง: กล่องตั้ง + ชั้น/บานประตู (o.rows = จำนวนชั้น · o.door = บานคู่) */
  function fCabinet(c, o){
    o = o || {};
    const d = dk(c), y0 = o.y0 == null ? 14 : o.y0, h = 54 - y0;
    let g = G('<rect x="10" y="' + y0 + '" width="44" height="' + h + '" rx="4" fill="' + c + '"/>', d);
    const rows = o.rows || 3;
    if(o.door){
      g += '<path d="M32 ' + (y0 + 3) + 'v' + (h - 6) + '" stroke="' + dk(c, .74) + '" stroke-width="2.6"/>'
         + '<circle cx="28" cy="' + (y0 + h / 2) + '" r="2.2" fill="' + dk(c, .6) + '"/>'
         + '<circle cx="36" cy="' + (y0 + h / 2) + '" r="2.2" fill="' + dk(c, .6) + '"/>';
    }else{
      for(let i = 1; i < rows; i++){
        const y = y0 + h * i / rows;
        g += '<path d="M12 ' + y.toFixed(1) + 'h40" stroke="' + dk(c, .74) + '" stroke-width="2.6" stroke-linecap="round"/>';
      }
    }
    return g;
  }
  const FURN_ICON = {
    /* ---- ที่นั่ง ---- */
    'chair':        ()=> fChair(FW.warm),
    'kids-chair':   ()=> fChair('#ff9a6b', {back:16}),
    /* เก้าอี้สูงเด็ก = ขายาวกางออก + ถาดหน้า (ใช้ทรงเก้าอี้ไม่ได้ เพราะจุดเด่นคือ "สูง") */
    'highchair':    ()=> G('<rect x="20" y="8" width="24" height="17" rx="3" fill="#f2a7c3"/>'
                          + '<rect x="16" y="25" width="32" height="7" rx="3" fill="' + lt('#f2a7c3', .2) + '"/>'
                          + '<rect x="12" y="30" width="40" height="6" rx="3" fill="' + lt('#f2a7c3', .38) + '"/>', dk('#f2a7c3'))
                        + '<g stroke="' + dk('#f2a7c3', .72) + '" stroke-width="5" stroke-linecap="round">'
                        + '<path d="M22 34l-6 20M42 34l6 20M18 46h28"/></g>',
    'rocking-chair':()=> fChair(FW.wood, {arm:1})
                        + '<path d="M8 56c8 4 40 4 48 0" stroke="' + dk(FW.wood, .7) + '" stroke-width="4" fill="none" stroke-linecap="round"/>',
    'armchair':     ()=> fSofa(FW.fab2, {seats:1}),
    'sofa':         ()=> fSofa(FW.fab, {seats:2}),
    'love-seat':    ()=> fSofa('#f4b8c8', {seats:2}),
    'floor-sofa':   ()=> fSofa('#a8d6a0', {seats:2}),
    'stool':        ()=> fStool(FW.wood),
    'stool-round':  ()=> fStool('#8fb8e0', {round:1}),
    'beanbag':      ()=> fPouf('#ef8b7a'),
    'papasan':      ()=> fPouf('#9ed8e8'),
    'pouf':         ()=> fPouf('#e3c7f0'),
    'floor-cushion':()=> fPouf('#ffcf8a', {flat:1}),
    /* ⚠ เก้าอี้ไข่ต้องเห็น "ช่องนั่ง" — ของเดิมเป็นไข่ทึบทั้งใบ ดูเหมือนไม่มีที่นั่ง (ผู้ใช้แจ้ง)
       ⇒ เปลือกไข่ (สว่าง) → ช่องเปิดด้านใน (เข้มกว่า) → เบาะสีอุ่นรองก้นช่อง */
    'egg-chair':    ()=> '<path d="M32 10V2" stroke="' + dk('#9fd8ee', .7) + '" stroke-width="3" stroke-linecap="round"/>'
                        + G('<path d="M32 8c12 0 20 11 20 24 0 12-9 22-20 22s-20-10-20-22c0-13 8-24 20-24z" fill="#eef6fb"/>', dk('#9fd8ee'))
                        + G('<path d="M32 18c8 0 13 7 13 15 0 9-6 15-13 15s-13-6-13-15c0-8 5-15 13-15z" fill="#bfe3f2"/>', dk('#9fd8ee'))
                        + G('<path d="M19 36c0 8 6 12 13 12s13-4 13-12z" fill="#ffca4a"/>', dk('#ffca4a')),
    'swing-chair':  ()=> '<path d="M32 6v16" stroke="#9c8a70" stroke-width="3" stroke-linecap="round"/>'
                        + G('<path d="M14 30c0-6 8-10 18-10s18 4 18 10c0 12-8 20-18 20s-18-8-18-20z" fill="#f6e6c9"/>'
                          + '<rect x="16" y="28" width="32" height="7" rx="3" fill="' + dk('#f6e6c9', .84) + '"/>', dk('#f6e6c9')),
    /* ---- โต๊ะ ---- */
    'table':        ()=> fTable(FW.wood),
    'dining-table': ()=> fTable(FW.wood2),
    'coffee-table': ()=> fTable(FW.wood, {top:32, shelf:1}),
    'round-coffee': ()=> fTable(FW.wood, {top:30, round:1}),
    'round-table':  ()=> fTable(FW.wood2, {round:1}),
    'side-table':   ()=> fTable(FW.wood, {top:28, shelf:1}),
    'kids-table':   ()=> fTable('#ffca4a', {top:30, round:1}),
    'bar-table':    ()=> G('<ellipse cx="32" cy="16" rx="18" ry="6" fill="' + FW.wood + '"/>'
                          + '<ellipse cx="32" cy="50" rx="16" ry="6" fill="' + dk(FW.wood, .8) + '"/>', dk(FW.wood))
                        + '<path d="M32 20v28" stroke="' + dk(FW.wood, .74) + '" stroke-width="6" stroke-linecap="round"/>',
    'desk':         ()=> fTable(FW.wood, {top:22}) + G('<rect x="30" y="30" width="24" height="16" rx="3" fill="' + lt(FW.wood, .18) + '"/>', dk(FW.wood))
                        + '<path d="M34 38h16" stroke="' + dk(FW.wood, .6) + '" stroke-width="2.4" stroke-linecap="round"/>',
    'study-desk':   ()=> fTable('#e8c98a', {top:22}) + G('<rect x="10" y="30" width="22" height="16" rx="3" fill="' + lt('#e8c98a', .18) + '"/>', dk('#e8c98a'))
                        + '<path d="M14 38h14" stroke="' + dk('#e8c98a', .6) + '" stroke-width="2.4" stroke-linecap="round"/>',
    'art-table':    ()=> fTable('#7fc7e0', {top:22})
                        + G('<rect x="20" y="10" width="24" height="14" rx="2" fill="#fffdf7"/>', dk('#7fc7e0'))
                        + '<path d="M25 15h14M25 19h9" stroke="#c9b6a0" stroke-width="2.2" stroke-linecap="round"/>',
    'console-table':()=> fTable(FW.wood2, {top:24, shelf:1}),
    'nest-tables':  ()=> fTable(FW.wood, {top:20}) + fTable(lt(FW.wood, .25), {top:32}),
    'tv-stand':     ()=> fCabinet(FW.wood2, {y0:30, rows:2}),
    'craft-cart':   ()=> fCabinet('#ff9a6b', {y0:16, rows:3})
                        + '<g fill="' + dk('#5b6b7a') + '"><circle cx="18" cy="56" r="4"/><circle cx="46" cy="56" r="4"/></g>',
  };
  /* ---- ทรงร่วมเพิ่ม: เตียง · เครื่องใช้ไฟฟ้าทรงกล่อง · หม้อ/ถ้วย ---- */
  /* เตียง: หัวเตียง + ที่นอน + หมอน (o.deck = ชั้นสอง · o.canopy = เสา 4 มุมมีผ้าคลุม) */
  function fBed(c, o){
    o = o || {};
    const d = dk(c), sh = '#fdfaf3';
    let g = '';
    if(o.canopy) g += G('<rect x="8" y="6" width="48" height="6" rx="2" fill="' + lt(c, .2) + '"/>', d)
                    + '<g stroke="' + dk(c, .74) + '" stroke-width="4" stroke-linecap="round"><path d="M11 12v14M53 12v14"/></g>';
    g += G('<rect x="6" y="' + (o.canopy ? 22 : 16) + '" width="10" height="' + (o.canopy ? 24 : 30) + '" rx="3" fill="' + c + '"/>'
         + '<rect x="10" y="34" width="46" height="12" rx="4" fill="' + sh + '"/>'
         + '<rect x="14" y="28" width="18" height="9" rx="4" fill="' + lt(c, .42) + '"/>', d);
    g += '<g stroke="' + dk(c, .74) + '" stroke-width="4.5" stroke-linecap="round"><path d="M12 46v8M52 46v8"/></g>';
    if(o.deck) g += G('<rect x="10" y="12" width="46" height="9" rx="4" fill="' + sh + '"/>', d)
                  + '<g stroke="' + dk(c, .74) + '" stroke-width="4" stroke-linecap="round"><path d="M13 12v22M53 12v22"/></g>';
    return g;
  }
  /* เครื่องใช้ไฟฟ้าทรงกล่อง (ตู้เย็น/ไมโครเวฟ/เครื่องซักผ้า) — o.win = ช่องกระจกกลม */
  function fBox(c, o){
    o = o || {};
    const d = dk(c), y0 = o.y0 == null ? 12 : o.y0, x0 = o.x0 == null ? 14 : o.x0, w = 64 - x0 * 2;
    let g = G('<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + (54 - y0) + '" rx="5" fill="' + c + '"/>', d);
    if(o.win) g += G('<circle cx="32" cy="' + (y0 + (54 - y0) / 2) + '" r="' + (o.win) + '" fill="#cfe8f5"/>', d);
    if(o.split) g += '<path d="M' + (x0 + 2) + ' ' + o.split + 'h' + (w - 4) + '" stroke="' + dk(c, .72) + '" stroke-width="2.6" stroke-linecap="round"/>';
    if(o.knob) g += '<g fill="' + dk(c, .6) + '"><circle cx="' + (x0 + w - 8) + '" cy="' + (y0 + 8) + '" r="2.4"/></g>';
    return g;
  }
  /* หม้อ/ถ้วย/ถัง — o.lid = ฝา · o.spout = พวยกา */
  function fPot(c, o){
    o = o || {};
    const d = dk(c);
    let g = G('<path d="M14 26h36v18c0 5-4 8-9 8H23c-5 0-9-3-9-8z" fill="' + c + '"/>', d);
    if(o.lid) g += G('<rect x="11" y="20" width="42" height="7" rx="3" fill="' + lt(c, .26) + '"/>', d)
                 + '<circle cx="32" cy="17" r="3.4" fill="' + dk(c, .6) + '"/>';
    if(o.spout) g += G('<path d="M50 30c6 0 9 3 9 7h-9z" fill="' + lt(c, .18) + '"/>', d);
    return g;
  }
  Object.assign(FURN_ICON, {
    /* ---- ห้องนอน ---- */
    'bed':          ()=> fBed('#8fb8e0'),
    'crib':         ()=> fBed('#f2a7c3'),
    'day-bed':      ()=> fBed('#f4b8c8'),
    'bunk-bed':     ()=> fBed(FW.wood, {deck:1}),
    'canopy-bed':   ()=> fBed('#e3c7f0', {canopy:1}),
    'cradle':       ()=> G('<path d="M12 24h40v14c0 6-5 10-12 10H24c-7 0-12-4-12-10z" fill="#bfe3f2"/>'
                          + '<path d="M18 24c2-8 7-12 14-12s12 4 14 12z" fill="' + lt('#bfe3f2', .3) + '"/>', dk('#bfe3f2'))
                        + '<path d="M10 54c8 4 36 4 44 0" stroke="' + dk('#bfe3f2', .7) + '" stroke-width="4" fill="none" stroke-linecap="round"/>',
    'wardrobe':     ()=> fCabinet(FW.wood, {y0:8, door:1}),
    'cupboard':     ()=> fCabinet('#e8c98a', {y0:10, door:1}),
    'dresser':      ()=> fCabinet(FW.wood2, {y0:18, rows:3}),
    'toy-chest-bed':()=> fCabinet('#ffca4a', {y0:28, rows:2}),
    'nightstand':   ()=> fCabinet(FW.wood, {y0:28, rows:2}),
    'vanity':       ()=> fTable(FW.wood, {top:30})
                        + G('<ellipse cx="32" cy="16" rx="13" ry="15" fill="#dff0fa"/>', dk(FW.wood)),
    'dress-mirror': ()=> G('<rect x="18" y="6" width="28" height="42" rx="13" fill="#dff0fa"/>', dk(FW.wood))
                        + '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="4.5" stroke-linecap="round"><path d="M24 48l-4 8M40 48l4 8"/></g>',
    'coat-rack':    ()=> '<path d="M32 8v40" stroke="' + dk(FW.wood, .78) + '" stroke-width="5" stroke-linecap="round"/>'
                        + '<g stroke="' + dk(FW.wood, .68) + '" stroke-width="4" stroke-linecap="round">'
                        + '<path d="M32 14c-7 0-11 3-13 7M32 14c7 0 11 3 13 7M32 48l-10 8M32 48l10 8"/></g>'
                        + G('<circle cx="19" cy="21" r="3.4" fill="' + FW.wood + '"/><circle cx="45" cy="21" r="3.4" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'hammock-in':   ()=> '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="5" stroke-linecap="round"><path d="M10 16v38M54 16v38"/></g>'
                        + G('<path d="M10 20c10 22 34 22 44 0 4 18-8 30-22 30S6 38 10 20z" fill="#f6e6c9"/>', dk('#f6e6c9')),
    /* ⚠ พระจันทร์เสี้ยวต้องเป็น "ส่วนโค้ง 2 เส้นบรรจบกันที่ปลายแหลม 2 ปลาย"
       ของเดิมใช้ arc รัศมีไม่สัมพันธ์กัน เบราว์เซอร์ขยายรัศมีให้เอง ⇒ ได้ทรงคล้ายกลีบ ไม่ใช่จันทร์เสี้ยว
       (ผู้ใช้แจ้ง 2026-08-19) — arc นอก r=22 อ้อมซ้าย · arc ใน r=26 โค้งกลับทางขวา */
    'night-light':  ()=> G('<path d="M40 8A22 22 0 1 0 40 52A26 26 0 0 1 40 8z" fill="#ffe58a"/>', dk('#ffe58a'))
                        + '<g fill="#ffd54f" stroke="' + dk('#ffd54f') + '" stroke-width="1.4">'
                        + '<path d="M52 14l1.6 3.4 3.4 1.6-3.4 1.6L52 24l-1.6-3.4L47 19l3.4-1.6z"/>'
                        + '<path d="M50 34l1.2 2.6 2.6 1.2-2.6 1.2L50 42l-1.2-2.6L46.2 38l2.6-1.2z"/></g>',
    /* ---- ครัว ---- */
    'fridge':       ()=> fBox(FW.white, {y0:8, x0:18, split:26, knob:1}),
    'microwave':    ()=> fBox(FW.metal, {y0:22, x0:8, win:9}),
    'washer':       ()=> fBox(FW.white, {y0:14, x0:14, win:11}),
    'water-cooler': ()=> fBox('#cfe8f5', {y0:22, x0:20})
                        + G('<rect x="22" y="6" width="20" height="18" rx="6" fill="#9fd8ee"/>', dk('#9fd8ee')),
    'stove':        ()=> fBox(FW.white, {y0:22, x0:10, split:34})
                        + '<g fill="' + FW.dark + '"><circle cx="22" cy="28" r="3.4"/><circle cx="42" cy="28" r="3.4"/></g>',
    'counter':      ()=> fCabinet('#e8c98a', {y0:26, rows:2}) + G('<rect x="8" y="22" width="48" height="6" rx="2" fill="' + FW.cream + '"/>', dk('#e8c98a')),
    'kitchen-island':()=> fCabinet('#ffca4a', {y0:28, rows:2}) + G('<rect x="6" y="24" width="52" height="6" rx="2" fill="' + FW.cream + '"/>', dk('#ffca4a')),
    'sink':         ()=> fCabinet(FW.metal, {y0:30, rows:1})
                        + G('<rect x="14" y="24" width="36" height="8" rx="3" fill="' + FW.cream + '"/>', dk(FW.metal))
                        + '<path d="M32 24v-8c0-3 3-5 6-5" stroke="' + dk(FW.metal, .7) + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
    'spice-rack':   ()=> G('<rect x="10" y="34" width="44" height="7" rx="2" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + G('<rect x="16" y="18" width="9" height="16" rx="3" fill="#ef8b7a"/>'
                          + '<rect x="28" y="14" width="9" height="20" rx="3" fill="#8fc98a"/>'
                          + '<rect x="40" y="20" width="9" height="14" rx="3" fill="#ffd166"/>', dk(FW.wood)),
    'pot-shelf':    ()=> '<path d="M8 14h48" stroke="' + dk(FW.metal, .7) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<path d="M14 22h14v12c0 4-3 6-7 6s-7-2-7-6zM36 22h14v12c0 4-3 6-7 6s-7-2-7-6z" fill="#ef8b7a"/>', dk('#ef8b7a')),
    'rice-cooker':  ()=> fPot(FW.white, {lid:1}),
    'kettle-set':   ()=> fPot('#ffb04a', {lid:1, spout:1}),
    'trash-bin':    ()=> fPot('#8fc98a', {lid:1}),
    'blender':      ()=> G('<path d="M22 10h20v24H22z" fill="#dff0fa"/>'
                          + '<rect x="18" y="34" width="28" height="18" rx="5" fill="#ffb04a"/>', dk('#ffb04a'))
                        + '<circle cx="38" cy="43" r="2.6" fill="' + dk('#ffb04a', .6) + '"/>',
    'toaster':      ()=> G('<rect x="12" y="26" width="40" height="24" rx="7" fill="#ef8b7a"/>', dk('#ef8b7a'))
                        + G('<rect x="22" y="14" width="8" height="14" rx="2" fill="#f2c98a"/>'
                          + '<rect x="34" y="14" width="8" height="14" rx="2" fill="#f2c98a"/>', dk('#c9a06a'))
                        + '<circle cx="46" cy="42" r="2.6" fill="' + dk('#ef8b7a', .6) + '"/>',
    'dish-rack':    ()=> G('<rect x="10" y="40" width="44" height="10" rx="3" fill="' + FW.metal + '"/>', dk(FW.metal))
                        + '<g stroke="' + dk(FW.metal, .7) + '" stroke-width="3" stroke-linecap="round">'
                        + '<path d="M18 40V22M28 40V20M38 40V20M48 40V22"/></g>'
                        + G('<ellipse cx="23" cy="21" rx="7" ry="9" fill="' + FW.cream + '"/>'
                          + '<ellipse cx="43" cy="21" rx="7" ry="9" fill="' + FW.cream + '"/>', dk(FW.metal)),
    'fruit-bowl':   ()=> G('<path d="M10 30h44c0 12-10 20-22 20S10 42 10 30z" fill="' + FW.cream + '"/>', dk('#c9a06a'))
                        + G('<circle cx="24" cy="26" r="7" fill="#ef8b7a"/><circle cx="38" cy="24" r="7" fill="#ffca4a"/>'
                          + '<circle cx="32" cy="30" r="6" fill="#8fc98a"/>', dk('#c9a06a')),
  });
  Object.assign(FURN_ICON, {
    /* ---- ห้องน้ำ ---- */
    'toilet':       ()=> G('<path d="M16 14h30v10c0 8-6 14-14 14h-2c-8 0-14-6-14-14z" fill="' + FW.white + '"/>'
                          + '<rect x="24" y="38" width="16" height="8" rx="2" fill="' + lt(FW.white, .1) + '"/>'
                          + '<rect x="14" y="46" width="36" height="8" rx="3" fill="' + FW.white + '"/>', dk(FW.metal))
                        + G('<rect x="42" y="6" width="16" height="14" rx="3" fill="' + FW.white + '"/>', dk(FW.metal)),
    'bathtub':      ()=> G('<path d="M6 26h52v14c0 6-5 10-11 10H17c-6 0-11-4-11-10z" fill="' + FW.white + '"/>'
                          + '<rect x="12" y="22" width="40" height="6" rx="3" fill="#cfe8f5"/>', dk(FW.metal))
                        + '<g stroke="' + dk(FW.metal, .8) + '" stroke-width="4" stroke-linecap="round"><path d="M14 50v5M50 50v5"/></g>'
                        + '<path d="M8 22V14c0-3 3-5 6-5" stroke="' + dk(FW.metal, .8) + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
    'bath-sink':    ()=> G('<path d="M14 26h36v8c0 6-5 10-11 10h-14c-6 0-11-4-11-10z" fill="' + FW.white + '"/>', dk(FW.metal))
                        + '<path d="M32 26v-6c0-3 3-5 6-5" stroke="' + dk(FW.metal, .8) + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
                        + '<path d="M32 44v10" stroke="' + dk(FW.metal, .8) + '" stroke-width="5" stroke-linecap="round"/>',
    'shower':       ()=> '<path d="M32 52V20c0-6 5-10 11-10h5" stroke="' + dk(FW.metal, .8) + '" stroke-width="4" fill="none" stroke-linecap="round"/>'
                        + G('<path d="M22 20h20l-4 8H26z" fill="' + FW.metal + '"/>', dk(FW.metal))
                        + '<g stroke="#7fc7e0" stroke-width="3" stroke-linecap="round"><path d="M26 34v8M32 36v10M38 34v8"/></g>',
    'bath-cabinet': ()=> fCabinet(FW.white, {y0:14, door:1}),
    'towel-rack':   ()=> '<path d="M8 16h48" stroke="' + dk(FW.metal, .7) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<rect x="14" y="20" width="14" height="26" rx="4" fill="#9fd8ee"/>'
                          + '<rect x="34" y="20" width="14" height="22" rx="4" fill="#f2a7c3"/>', dk(FW.metal)),
    'towel-shelf':  ()=> G('<rect x="10" y="16" width="44" height="7" rx="2" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + G('<rect x="14" y="26" width="16" height="12" rx="4" fill="#9fd8ee"/>'
                          + '<rect x="34" y="26" width="16" height="12" rx="4" fill="#f2a7c3"/>', dk(FW.wood)),
    'bath-mat':     ()=> G('<rect x="8" y="26" width="48" height="20" rx="7" fill="#9fd8ee"/>', dk('#9fd8ee'))
                        + '<g stroke="' + dk('#9fd8ee', .78) + '" stroke-width="2.6" stroke-linecap="round"><path d="M16 32v8M26 32v8M38 32v8M48 32v8"/></g>',
    'kids-potty':   ()=> G('<path d="M16 24h32v12c0 6-5 10-11 10h-10c-6 0-11-4-11-10z" fill="#8fc98a"/>'
                          + '<rect x="12" y="18" width="40" height="8" rx="4" fill="' + lt('#8fc98a', .3) + '"/>', dk('#8fc98a')),
    'duck-tub':     ()=> G('<path d="M8 28h48v10c0 6-5 10-11 10H19c-6 0-11-4-11-10z" fill="#9fd8ee"/>', dk('#9fd8ee'))
                        + G('<circle cx="34" cy="20" r="9" fill="#ffd54f"/>'
                          + '<path d="M43 18l7 2-7 3z" fill="#f5a623"/>', dk('#ffd54f'))
                        + eye(37, 17, 2.2),
    'flower-mirror':()=> G('<circle cx="32" cy="30" r="17" fill="#dff0fa"/>', dk('#f2a7c3'))
                        + G('<g fill="#f2a7c3"><circle cx="32" cy="9" r="6"/><circle cx="53" cy="30" r="6"/>'
                          + '<circle cx="32" cy="51" r="6"/><circle cx="11" cy="30" r="6"/></g>', dk('#f2a7c3')),
    'bath-toys':    ()=> G('<path d="M12 30h40v14c0 5-4 8-9 8H21c-5 0-9-3-9-8z" fill="#ffb04a"/>', dk('#ffb04a'))
                        + G('<circle cx="22" cy="22" r="7" fill="#ef8b7a"/><circle cx="36" cy="19" r="8" fill="#8fc98a"/>'
                          + '<circle cx="47" cy="24" r="6" fill="#7fc7e0"/>', dk('#ffb04a')),
    'step-stool':   ()=> G('<path d="M12 40h40v12H12z" fill="#ffca4a"/>'
                          + '<path d="M20 26h32v14H20z" fill="' + lt('#ffca4a', .22) + '"/>', dk('#ffca4a')),
    /* ---- เครื่องดนตรี ---- */
    'piano':        ()=> G('<rect x="8" y="14" width="48" height="22" rx="4" fill="' + FW.dark + '"/>'
                          + '<rect x="8" y="34" width="48" height="12" rx="3" fill="' + FW.white + '"/>', dk(FW.dark))
                        + '<g stroke="' + dk(FW.dark, .9) + '" stroke-width="2"><path d="M16 34v12M24 34v12M32 34v12M40 34v12M48 34v12"/></g>'
                        + '<g fill="' + FW.dark + '"><rect x="18" y="34" width="5" height="7"/><rect x="34" y="34" width="5" height="7"/><rect x="42" y="34" width="5" height="7"/></g>'
                        + '<g stroke="' + dk(FW.dark, .8) + '" stroke-width="4" stroke-linecap="round"><path d="M13 46v8M51 46v8"/></g>',
    'ins-keyboard': ()=> G('<rect x="6" y="24" width="52" height="16" rx="4" fill="#5b8ec9"/>', dk('#5b8ec9'))
                        + '<g fill="' + FW.white + '"><rect x="24" y="28" width="30" height="8" rx="2"/></g>'
                        + '<g fill="' + FW.dark + '"><rect x="28" y="28" width="4" height="5"/><rect x="36" y="28" width="4" height="5"/><rect x="44" y="28" width="4" height="5"/></g>'
                        + '<g stroke="' + dk('#5b8ec9', .8) + '" stroke-width="4" stroke-linecap="round"><path d="M14 40v12M50 40v12"/></g>',
    'ins-guitar':   ()=> G('<path d="M32 24c8 0 13 6 13 14s-6 16-13 16-13-7-13-16 5-14 13-14z" fill="#ffb04a"/>', dk('#ffb04a'))
                        + '<circle cx="32" cy="38" r="6" fill="' + dk('#ffb04a', .55) + '"/>'
                        + '<path d="M32 24V6" stroke="' + dk('#c9a06a', .9) + '" stroke-width="6" stroke-linecap="round"/>'
                        + '<g stroke="' + dk('#ffb04a', .7) + '" stroke-width="1.6"><path d="M29 24v26M32 24v26M35 24v26"/></g>',
    'ins-ukulele':  ()=> G('<path d="M32 28c7 0 11 5 11 12s-5 13-11 13-11-6-11-13 4-12 11-12z" fill="#ffd88a"/>', dk('#ffd88a'))
                        + '<circle cx="32" cy="40" r="5" fill="' + dk('#ffd88a', .55) + '"/>'
                        + '<path d="M32 28V10" stroke="' + dk('#c9a06a', .9) + '" stroke-width="5" stroke-linecap="round"/>',
    'ins-flute':    ()=> '<path d="M12 46L52 14" stroke="' + dk('#ffd88a', .82) + '" stroke-width="11" stroke-linecap="round"/>'
                        + '<path d="M12 46L52 14" stroke="#ffd88a" stroke-width="7" stroke-linecap="round"/>'
                        + '<g fill="' + dk('#8a6a3a') + '"><circle cx="22" cy="38" r="2.2"/><circle cx="30" cy="32" r="2.2"/>'
                        + '<circle cx="38" cy="26" r="2.2"/><circle cx="46" cy="20" r="2.2"/></g>',
    'ins-ranat':    ()=> G('<path d="M8 34h48l-6 14H14z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<g stroke="' + dk('#c9a06a', .9) + '" stroke-width="2.4" stroke-linecap="round">'
                        + '<path d="M14 30h36"/></g>'
                        + '<g fill="#ffd88a" stroke="' + dk('#ffd88a', .7) + '" stroke-width="1.6">'
                        + '<rect x="13" y="22" width="6" height="13" rx="2"/><rect x="21" y="21" width="6" height="15" rx="2"/>'
                        + '<rect x="29" y="20" width="6" height="17" rx="2"/><rect x="37" y="21" width="6" height="15" rx="2"/>'
                        + '<rect x="45" y="22" width="6" height="13" rx="2"/></g>',
    'ins-ching':    ()=> G('<ellipse cx="21" cy="32" rx="13" ry="13" fill="#ffd54f"/>'
                          + '<ellipse cx="43" cy="32" rx="13" ry="13" fill="#ffd54f"/>', dk('#ffd54f'))
                        + '<circle cx="21" cy="32" r="4" fill="' + dk('#ffd54f', .6) + '"/>'
                        + '<circle cx="43" cy="32" r="4" fill="' + dk('#ffd54f', .6) + '"/>',
    'ins-tambourine':()=> G('<circle cx="32" cy="32" r="20" fill="#ef8b7a"/>'
                          + '<circle cx="32" cy="32" r="13" fill="' + FW.cream + '"/>', dk('#ef8b7a'))
                        + '<g fill="#ffd54f" stroke="' + dk('#ffd54f') + '" stroke-width="1.6">'
                        + '<circle cx="32" cy="12" r="4"/><circle cx="52" cy="32" r="4"/><circle cx="32" cy="52" r="4"/><circle cx="12" cy="32" r="4"/></g>',
    'ins-krap':     ()=> G('<rect x="10" y="22" width="44" height="9" rx="4" fill="' + FW.wood + '" transform="rotate(-8 32 26)"/>'
                          + '<rect x="10" y="34" width="44" height="9" rx="4" fill="' + lt(FW.wood, .2) + '" transform="rotate(8 32 38)"/>', dk(FW.wood)),
    'ins-musicbox': ()=> G('<rect x="12" y="28" width="40" height="22" rx="5" fill="#f2a7c3"/>'
                          + '<path d="M12 28l6-10h28l6 10z" fill="' + lt('#f2a7c3', .28) + '"/>', dk('#f2a7c3'))
                        + '<path d="M52 36c5 0 7 2 7 4s-2 4-7 4" stroke="' + dk('#f2a7c3', .7) + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
                        + '<path d="M28 12v-6h8" stroke="#7e57c2" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
                        + '<circle cx="27" cy="13" r="3" fill="#7e57c2"/>',
  });
  /* ---- ทรงร่วมของนอกบ้าน ---- */
  /* ต้นไม้: ลำต้น + ทรงพุ่ม (o.kind: round | tall | pine | palm | bush) */
  function fTree(c, kind){
    const d = dk(c), tr = '#a9784a', td = dk(tr);
    const trunk = '<path d="M32 54V34" stroke="' + td + '" stroke-width="8" stroke-linecap="round"/>'
                + '<path d="M32 54V34" stroke="' + tr + '" stroke-width="5" stroke-linecap="round"/>';
    if(kind === 'pine') return G('<path d="M32 6l14 18H18zM32 20l16 20H16zM32 34l18 20H14z" fill="' + c + '"/>', d)
                             + '<path d="M32 54v-6" stroke="' + td + '" stroke-width="6" stroke-linecap="round"/>';
    if(kind === 'bush') return G('<path d="M8 46c-3-12 4-20 12-20 2-8 10-12 16-8 8-2 14 4 14 12 4 4 4 12 0 16z" fill="' + c + '"/>', d)
                             + '<path d="M20 38c4-4 8-6 12-6M36 42c4-4 8-5 12-5" stroke="' + dk(c, .8) + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    if(kind === 'palm') return trunk
                             + '<g stroke="' + d + '" stroke-width="8" stroke-linecap="round" fill="none">'
                             + '<path d="M32 30C22 26 14 28 8 34M32 30c10-4 18-2 24 4M32 30c-4-8-2-16 2-22M32 30c6-6 14-8 20-4"/></g>'
                             + '<g stroke="' + c + '" stroke-width="4.5" stroke-linecap="round" fill="none">'
                             + '<path d="M32 30C22 26 14 28 8 34M32 30c10-4 18-2 24 4M32 30c-4-8-2-16 2-22M32 30c6-6 14-8 20-4"/></g>';
    if(kind === 'tall') return trunk + G('<circle cx="32" cy="24" r="18" fill="' + c + '"/>', d)
                             + '<circle cx="25" cy="19" r="5" fill="' + lt(c, .3) + '"/>';
    return trunk + G('<circle cx="32" cy="26" r="16" fill="' + c + '"/>', d);
  }
  /* กระถาง/แปลง: กระบะ + ต้น (o.plant = html ที่โผล่เหนือกระบะ) */
  function fBed2(c, plant){
    const d = dk(c);
    return (plant || '') + G('<path d="M8 34h48l-5 18H13z" fill="' + c + '"/>', d);
  }
  /* ม้านั่ง: พนัก + ที่นั่ง + ขา (o.back = มีพนัก) */
  function fBench(c, o){
    o = o || {};
    const d = dk(c);
    let g = '';
    if(o.back) g += G('<rect x="8" y="18" width="48" height="7" rx="3" fill="' + c + '"/>'
                    + '<rect x="8" y="27" width="48" height="6" rx="3" fill="' + lt(c, .18) + '"/>', d);
    g += G('<rect x="6" y="34" width="52" height="8" rx="3" fill="' + c + '"/>', d)
       + '<g stroke="' + dk(c, .74) + '" stroke-width="5" stroke-linecap="round"><path d="M14 42v12M50 42v12"/></g>';
    if(o.back) g += '<g stroke="' + dk(c, .74) + '" stroke-width="4" stroke-linecap="round"><path d="M14 34V20M50 34V20"/></g>';
    return g;
  }
  /* บ้านหลังเล็ก: ตัวบ้าน + หลังคา + ประตู */
  function fHut(c, roof, o){
    o = o || {};
    const d = dk(c), rd = dk(roof);
    return G('<path d="M32 8L58 28H6z" fill="' + roof + '"/>', rd)
         + G('<rect x="12" y="28" width="40" height="26" rx="3" fill="' + c + '"/>', d)
         + G('<path d="M25 54V40c0-4 3-7 7-7s7 3 7 7v14z" fill="' + (o.door || dk(c, .68)) + '"/>', d);
  }
  Object.assign(FURN_ICON, {
    /* ---- ของแต่งในบ้าน ---- */
    'plant':        ()=> G('<path d="M18 32h28l-4 20H22z" fill="#ef8b7a"/>', dk('#ef8b7a'))
                        + G('<path d="M32 32c-10-2-16-8-16-16 10 0 16 6 16 16zM32 32c10-2 16-8 16-16-10 0-16 6-16 16z" fill="#8fc98a"/>', dk('#8fc98a')),
    'tulip-pot':    ()=> G('<path d="M18 34h28l-4 18H22z" fill="#ffca4a"/>', dk('#ffca4a'))
                        + '<g stroke="' + dk('#8fc98a') + '" stroke-width="3" stroke-linecap="round"><path d="M24 34V20M32 34V16M40 34V20"/></g>'
                        + G('<circle cx="24" cy="17" r="5" fill="#f2a7c3"/><circle cx="32" cy="13" r="5" fill="#e3c7f0"/>'
                          + '<circle cx="40" cy="17" r="5" fill="#ef8b7a"/>', dk('#f2a7c3')),
    'floor-lamp':   ()=> G('<path d="M20 10h24l4 16H16z" fill="#ffe58a"/>', dk('#ffe58a'))
                        + '<path d="M32 26v22" stroke="' + dk(FW.metal, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<ellipse cx="32" cy="50" rx="14" ry="5" fill="' + FW.metal + '"/>', dk(FW.metal)),
    'table-lamp':   ()=> G('<path d="M22 16h20l4 14H18z" fill="#ffe58a"/>', dk('#ffe58a'))
                        + '<path d="M32 30v10" stroke="' + dk(FW.metal, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<ellipse cx="32" cy="44" rx="12" ry="5" fill="' + FW.metal + '"/>', dk(FW.metal)),
    'tv':           ()=> G('<rect x="6" y="14" width="52" height="30" rx="4" fill="' + FW.dark + '"/>'
                          + '<rect x="10" y="18" width="44" height="22" rx="2" fill="#7fc7e0"/>', dk(FW.dark))
                        + '<path d="M32 44v6M20 52h24" stroke="' + dk(FW.dark, .8) + '" stroke-width="4" stroke-linecap="round"/>',
    'bookshelf':    ()=> fCabinet(FW.wood, {y0:8, rows:3})
                        + '<g stroke="' + dk('#ef8b7a') + '" stroke-width="1.6">'
                        + '<rect x="14" y="14" width="5" height="10" fill="#ef8b7a"/><rect x="21" y="12" width="5" height="12" fill="#8fb8e0"/>'
                        + '<rect x="28" y="15" width="5" height="9" fill="#8fc98a"/><rect x="14" y="30" width="5" height="10" fill="#ffca4a"/>'
                        + '<rect x="21" y="29" width="5" height="11" fill="#e3c7f0"/></g>',
    'toy-shelf':    ()=> fCabinet('#8fb8e0', {y0:16, rows:2})
                        + '<g stroke="' + dk('#8fb8e0') + '" stroke-width="1.6">'
                        + '<circle cx="20" cy="24" r="4.4" fill="#ef8b7a"/><rect x="30" y="20" width="9" height="9" fill="#ffca4a"/>'
                        + '<circle cx="44" cy="40" r="4.4" fill="#8fc98a"/></g>',
    'wall-clock':   ()=> G('<circle cx="32" cy="32" r="21" fill="' + FW.cream + '"/>', dk(FW.wood))
                        + '<path d="M32 32V19M32 32l10 6" stroke="' + dk(FW.wood, .7) + '" stroke-width="3.4" stroke-linecap="round"/>'
                        + '<circle cx="32" cy="32" r="2.6" fill="' + dk(FW.wood, .6) + '"/>',
    'toy-box':      ()=> G('<rect x="10" y="26" width="44" height="26" rx="5" fill="#ef8b7a"/>'
                          + '<rect x="8" y="20" width="48" height="9" rx="4" fill="' + lt('#ef8b7a', .24) + '"/>', dk('#ef8b7a'))
                        + '<g fill="' + FW.cream + '"><circle cx="22" cy="40" r="4"/><rect x="32" y="36" width="8" height="8" rx="2"/></g>',
    'rug':          ()=> G('<ellipse cx="32" cy="34" rx="26" ry="16" fill="#e3c7f0"/>', dk('#e3c7f0'))
                        + '<ellipse cx="32" cy="34" rx="17" ry="10" fill="none" stroke="' + dk('#e3c7f0', .78) + '" stroke-width="2.6"/>'
                        + '<ellipse cx="32" cy="34" rx="8" ry="5" fill="' + lt('#e3c7f0', .3) + '"/>',
    'wall-picture': ()=> G('<rect x="10" y="14" width="44" height="36" rx="3" fill="' + FW.wood + '"/>'
                          + '<rect x="16" y="20" width="32" height="24" rx="2" fill="#cfe8f5"/>', dk(FW.wood))
                        + '<circle cx="24" cy="27" r="4" fill="#ffd54f"/>'
                        + '<path d="M16 44l10-12 8 8 6-6 8 10z" fill="#8fc98a"/>',
    'photo-wall':   ()=> G('<rect x="8" y="12" width="22" height="18" rx="3" fill="' + FW.wood + '"/>'
                          + '<rect x="34" y="16" width="22" height="18" rx="3" fill="' + lt(FW.wood, .2) + '"/>'
                          + '<rect x="18" y="36" width="26" height="18" rx="3" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'chalkboard':   ()=> G('<rect x="8" y="12" width="48" height="32" rx="4" fill="' + FW.wood + '"/>'
                          + '<rect x="13" y="17" width="38" height="22" rx="2" fill="#4a6b5a"/>', dk(FW.wood))
                        + '<path d="M20 26h20M20 32h12" stroke="' + FW.cream + '" stroke-width="2.4" stroke-linecap="round"/>'
                        + '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="4.5" stroke-linecap="round"><path d="M18 44l-4 10M46 44l4 10"/></g>',
    'growth-chart': ()=> G('<rect x="24" y="6" width="16" height="48" rx="3" fill="' + FW.cream + '"/>', dk(FW.wood))
                        + '<g stroke="' + dk(FW.wood, .7) + '" stroke-width="2.4" stroke-linecap="round">'
                        + '<path d="M28 14h8M28 22h6M28 30h8M28 38h6M28 46h8"/></g>',
    'aquarium':     ()=> G('<rect x="8" y="18" width="48" height="30" rx="4" fill="#bfe3f2"/>', dk(FW.metal))
                        + SEA.fish('#ffb04a') .replace('<g ', '<g transform="translate(6,4) scale(.62)" ')
                        + G('<rect x="8" y="48" width="48" height="6" rx="2" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'aquarium-sea': ()=> G('<rect x="8" y="18" width="48" height="30" rx="4" fill="#9fd8ee"/>', dk(FW.metal))
                        + SEA.fish('#5b8ec9') .replace('<g ', '<g transform="translate(6,4) scale(.62)" ')
                        + G('<rect x="8" y="48" width="48" height="6" rx="2" fill="#8a6a4a"/>', dk('#8a6a4a')),
    /* ⚠ ห้ามยืมทรงหมาจาก PET มาใช้ — ตุ๊กตาหมีมีหูกลมใหญ่บนหัวและตัวป้อม เงารวมคนละแบบ
       (เทส IC2 จับได้ว่าวาดซ้ำกับ pet-dog เป๊ะ) */
    'big-teddy':    ()=> { const c = '#c08a5e', d = dk(c);
      return G('<ellipse cx="32" cy="42" rx="17" ry="14" fill="' + c + '"/>'
             + '<circle cx="32" cy="22" r="13" fill="' + c + '"/>'
             + '<circle cx="20" cy="12" r="6.5" fill="' + c + '"/><circle cx="44" cy="12" r="6.5" fill="' + c + '"/>'
             + '<ellipse cx="13" cy="40" rx="6" ry="8" fill="' + c + '"/><ellipse cx="51" cy="40" rx="6" ry="8" fill="' + c + '"/>', d)
           + '<circle cx="20" cy="12" r="3.2" fill="' + lt(c, .42) + '"/><circle cx="44" cy="12" r="3.2" fill="' + lt(c, .42) + '"/>'
           + '<ellipse cx="32" cy="47" rx="10" ry="7" fill="' + lt(c, .42) + '"/>'
           + '<ellipse cx="32" cy="27" rx="7" ry="5.2" fill="' + lt(c, .48) + '"/>'
           + '<ellipse cx="32" cy="25.5" rx="2.6" ry="2" fill="#5b4a42"/>'
           + '<path d="M32 27.5v2.5M32 30c-2 2-4 1.4-5 0M32 30c2 2 4 1.4 5 0" stroke="' + dk(c, .55) + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
           + eye(27, 20, 2.4) + eye(37, 20, 2.4); },
    'beanbag-frog': ()=> SEA.frog('#8fc98a'),
    'globe':        ()=> G('<circle cx="32" cy="26" r="17" fill="#7fc7e0"/>', dk(FW.metal))
                        + '<path d="M20 20c8 4 16 4 24 0M20 32c8-4 16-4 24 0M32 9v34" stroke="' + dk('#7fc7e0', .78) + '" stroke-width="2.4" fill="none"/>'
                        + G('<path d="M24 46h16l4 8H20z" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'floor-globe-big':()=> G('<circle cx="32" cy="24" r="19" fill="#8fc98a"/>', dk(FW.metal))
                        + '<path d="M18 18c9 5 19 5 28 0M18 30c9-5 19-5 28 0M32 5v38" stroke="' + dk('#8fc98a', .8) + '" stroke-width="2.4" fill="none"/>'
                        + '<path d="M32 44v6" stroke="' + dk(FW.metal, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<ellipse cx="32" cy="52" rx="13" ry="5" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'star-mobile':  ()=> '<path d="M10 10h44" stroke="' + dk(FW.wood, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + '<g stroke="' + dk(FW.wood, .6) + '" stroke-width="2"><path d="M18 10v12M32 10v18M46 10v14"/></g>'
                        + G('<circle cx="18" cy="28" r="6" fill="#ffd54f"/><circle cx="32" cy="34" r="7" fill="#f2a7c3"/>'
                          + '<circle cx="46" cy="30" r="6" fill="#8fb8e0"/>', dk('#ffd54f')),
    'wall-shelf-cloud':()=> G('<path d="M12 34c-4 0-7-3-7-7s3-7 7-7c1-6 6-10 12-10s11 4 12 10c8-2 14 3 14 10 0 4-3 8-8 8z" fill="#dff0fa"/>', dk('#9fd8ee'))
                        + G('<rect x="10" y="34" width="44" height="6" rx="2" fill="' + FW.white + '"/>', dk('#9fd8ee')),
    'reading-nook': ()=> fPouf('#f4b8c8')
                        + G('<rect x="34" y="18" width="18" height="14" rx="2" fill="#8fb8e0"/>', dk('#8fb8e0')),
    'pet-bed-in':   ()=> G('<ellipse cx="32" cy="40" rx="24" ry="13" fill="#f2a7c3"/>'
                          + '<ellipse cx="32" cy="40" rx="16" ry="8" fill="' + lt('#f2a7c3', .35) + '"/>', dk('#f2a7c3'))
                        + '<path d="M22 27c-2-4 1-7 4-6M42 27c2-4-1-7-4-6" stroke="' + dk('#f2a7c3', .8) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
    /* ---- สวน ---- */
    'tree-round':   ()=> fTree('#8fc98a', 'round'),
    'tree':         ()=> fTree('#6fb36a', 'tall'),
    'pine':         ()=> fTree('#4f9a55', 'pine'),
    'palm-tall':    ()=> fTree('#6fb36a', 'palm'),
    'bush':         ()=> fTree('#8fc98a', 'bush'),
    'hedge':        ()=> G('<rect x="6" y="26" width="52" height="24" rx="6" fill="#6fb36a"/>', dk('#6fb36a'))
                        + '<g stroke="' + dk('#6fb36a', .8) + '" stroke-width="2.4" stroke-linecap="round"><path d="M18 30v16M32 28v20M46 30v16"/></g>',
    'topiary':      ()=> '<path d="M32 54V38" stroke="' + dk('#a9784a') + '" stroke-width="7" stroke-linecap="round"/>'
                        + G('<circle cx="32" cy="30" r="11" fill="#6fb36a"/><circle cx="32" cy="15" r="8" fill="#8fc98a"/>', dk('#6fb36a')),
    'clover-patch': ()=> G('<circle cx="20" cy="38" r="11" fill="#8fc98a"/><circle cx="34" cy="32" r="12" fill="#6fb36a"/>'
                          + '<circle cx="46" cy="40" r="10" fill="#8fc98a"/>', dk('#6fb36a')),
    'berry-bush':   ()=> fTree('#6fb36a', 'bush')
                        + '<g fill="#a0507a"><circle cx="22" cy="34" r="3.4"/><circle cx="36" cy="30" r="3.4"/><circle cx="44" cy="38" r="3.4"/></g>',
    'rose-bush':    ()=> fTree('#6fb36a', 'bush')
                        + '<g fill="#ef5a72"><circle cx="24" cy="32" r="4"/><circle cx="38" cy="28" r="4"/><circle cx="44" cy="40" r="4"/></g>',
    'mushroom':     ()=> G('<path d="M8 32c0-13 11-22 24-22s24 9 24 22z" fill="#ef5a5a"/>'
                          + '<path d="M24 32h16v14c0 5-4 8-8 8s-8-3-8-8z" fill="' + FW.cream + '"/>', dk('#ef5a5a'))
                        + '<g fill="' + FW.cream + '"><circle cx="20" cy="22" r="4"/><circle cx="42" cy="20" r="5"/><circle cx="32" cy="15" r="3.4"/></g>',
    'cactus':       ()=> G('<path d="M26 54V22c0-4 3-6 6-6s6 2 6 6v32z" fill="#6fb36a"/>'
                          + '<path d="M26 30h-6c-3 0-5 2-5 5v6c0 3 2 5 5 5h6zM38 24h6c3 0 5 2 5 5v6c0 3-2 5-5 5h-6z" fill="#6fb36a"/>', dk('#6fb36a'))
                        + G('<path d="M20 54h24l-2-6H22z" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'sunflower':    ()=> '<path d="M32 54V28" stroke="' + dk('#6fb36a') + '" stroke-width="5" stroke-linecap="round"/>'
                        + G('<path d="M24 40c-8-2-12-6-12-10 6-2 11 2 12 10zM40 44c8-2 12-6 12-10-6-2-11 2-12 10z" fill="#6fb36a"/>', dk('#6fb36a'))
                        + (function(){ let p2 = ''; for(let i = 0; i < 10; i++){ const a = i / 10 * Math.PI * 2;
                            p2 += '<ellipse cx="' + (32 + Math.cos(a) * 14).toFixed(1) + '" cy="' + (20 + Math.sin(a) * 14).toFixed(1)
                                + '" rx="6" ry="4" transform="rotate(' + (a * 180 / Math.PI).toFixed(0) + ' '
                                + (32 + Math.cos(a) * 14).toFixed(1) + ' ' + (20 + Math.sin(a) * 14).toFixed(1) + ')"/>'; }
                            return G('<g fill="#ffd54f">' + p2 + '</g>', dk('#ffd54f')); })()
                        + G('<circle cx="32" cy="20" r="9" fill="#8a5a2a"/>', dk('#8a5a2a')),
    'flowerbed':    ()=> fBed2('#a9784a', G('<g fill="#f2a7c3"><circle cx="18" cy="24" r="6"/><circle cx="32" cy="20" r="6"/><circle cx="46" cy="24" r="6"/></g>', dk('#f2a7c3'))
                          + '<g stroke="' + dk('#6fb36a') + '" stroke-width="3" stroke-linecap="round"><path d="M18 30v6M32 26v10M46 30v6"/></g>'),
    'veg-plot':     ()=> fBed2('#a9784a', G('<g fill="#8fc98a"><path d="M14 32c0-6 3-10 6-10s6 4 6 10zM26 32c0-8 3-12 6-12s6 4 6 12zM38 32c0-6 3-10 6-10s6 4 6 10z"/></g>', dk('#6fb36a'))),
    'veggie-plot':  ()=> fBed2('#a9784a', G('<g fill="#ff9a4a"><path d="M20 22l4 10-8 0zM32 18l4 14-8 0zM44 22l4 10-8 0z"/></g>', dk('#e07a2a'))),
    'flower-arch':  ()=> '<path d="M12 54V30a20 20 0 0 1 40 0v24" stroke="' + dk('#f2a7c3', .8) + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
                        + '<g fill="#f2a7c3" stroke="' + dk('#f2a7c3') + '" stroke-width="1.6">'
                        + '<circle cx="14" cy="34" r="4"/><circle cx="20" cy="22" r="4"/><circle cx="32" cy="15" r="4.5"/>'
                        + '<circle cx="44" cy="22" r="4"/><circle cx="50" cy="34" r="4"/></g>',
    'garden-arch-vine':()=> '<path d="M12 54V30a20 20 0 0 1 40 0v24" stroke="' + dk('#6fb36a', .8) + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
                        + '<g fill="#8fc98a" stroke="' + dk('#8fc98a') + '" stroke-width="1.6">'
                        + '<circle cx="15" cy="36" r="4"/><circle cx="21" cy="23" r="4"/><circle cx="32" cy="16" r="4.5"/>'
                        + '<circle cx="43" cy="23" r="4"/><circle cx="49" cy="36" r="4"/></g>',
    'greenhouse-mini':()=> fHut('#dff0fa', '#9fd8ee', {door:'#bfe3f2'})
                        + '<g stroke="' + dk('#9fd8ee', .8) + '" stroke-width="2.2"><path d="M22 28v26M42 28v26"/></g>',
    'lotus-pond':   ()=> G('<ellipse cx="32" cy="36" rx="26" ry="16" fill="#7fc7e0"/>', dk('#5b8ec9'))
                        + G('<circle cx="20" cy="34" r="7" fill="#6fb36a"/><circle cx="44" cy="40" r="6" fill="#6fb36a"/>', dk('#6fb36a'))
                        + G('<circle cx="34" cy="30" r="6" fill="#f2a7c3"/>', dk('#f2a7c3')),
    'stepping-log': ()=> G('<ellipse cx="32" cy="28" rx="20" ry="8" fill="' + lt(FW.wood, .25) + '"/>'
                          + '<path d="M12 28v14c0 4 9 8 20 8s20-4 20-8V28z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<ellipse cx="32" cy="28" rx="11" ry="4.4" fill="none" stroke="' + dk(FW.wood, .78) + '" stroke-width="2"/>',
    'wind-spinner': ()=> '<path d="M32 54V28" stroke="' + dk(FW.metal, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + (function(){ let p2 = ''; const cs = ['#ef8b7a', '#ffd54f', '#7fc7e0', '#8fc98a'];
                            for(let i = 0; i < 4; i++){ const a = i / 4 * Math.PI * 2;
                              p2 += '<path d="M32 22L' + (32 + Math.cos(a) * 16).toFixed(1) + ' ' + (22 + Math.sin(a) * 16).toFixed(1)
                                  + 'L' + (32 + Math.cos(a + .8) * 14).toFixed(1) + ' ' + (22 + Math.sin(a + .8) * 14).toFixed(1) + 'z" fill="' + cs[i] + '"/>'; }
                            return G(p2, dk('#ef8b7a')); })()
                        + '<circle cx="32" cy="22" r="3.4" fill="' + dk('#ffd54f', .7) + '"/>',
    'bird-nest-box':()=> '<path d="M32 54V34" stroke="' + dk(FW.wood, .8) + '" stroke-width="6" stroke-linecap="round"/>'
                        + G('<path d="M14 30c0-6 8-10 18-10s18 4 18 10c0 5-8 8-18 8s-18-3-18-8z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + G('<circle cx="26" cy="22" r="4" fill="#cfe8f5"/><circle cx="38" cy="22" r="4" fill="#cfe8f5"/>', dk(FW.wood)),
  });
  Object.assign(FURN_ICON, {
    /* ---- ที่นั่งนอกบ้าน ---- */
    'bench':        ()=> fBench(FW.wood, {back:1}),
    'log-bench':    ()=> G('<rect x="6" y="28" width="52" height="16" rx="8" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<ellipse cx="10" cy="36" rx="4" ry="8" fill="' + lt(FW.wood, .25) + '" stroke="' + dk(FW.wood) + '" stroke-width="2"/>'
                        + '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="5" stroke-linecap="round"><path d="M18 44v10M46 44v10"/></g>',
    'garden-stool': ()=> G('<ellipse cx="32" cy="26" rx="18" ry="7" fill="' + lt(FW.wood, .25) + '"/>'
                          + '<path d="M14 26v18c0 4 8 7 18 7s18-3 18-7V26z" fill="' + FW.wood + '"/>', dk(FW.wood)),
    'picnic':       ()=> fTable(FW.wood, {top:22}) + fBench(lt(FW.wood, .2), {}),
    'picnic-set':   ()=> G('<rect x="8" y="30" width="48" height="20" rx="4" fill="#f4b8c8"/>', dk('#f4b8c8'))
                        + '<g stroke="' + dk('#f4b8c8', .8) + '" stroke-width="2.6"><path d="M8 40h48M24 30v20M40 30v20"/></g>'
                        + G('<circle cx="24" cy="24" r="6" fill="#8fc98a"/><circle cx="40" cy="24" r="6" fill="#ef8b7a"/>', dk('#f4b8c8')),
    'hammock':      ()=> '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="5" stroke-linecap="round"><path d="M8 14v40M56 14v40"/></g>'
                        + G('<path d="M8 20c10 22 38 22 48 0 4 18-10 30-24 30S4 38 8 20z" fill="#f6e6c9"/>', dk('#f6e6c9')),
    'sun-lounger':  ()=> G('<path d="M10 34h44v10H10z" fill="#ef8b7a"/>'
                          + '<path d="M10 34l-2-16 16-2 4 18z" fill="' + lt('#ef8b7a', .2) + '"/>', dk('#ef8b7a'))
                        + '<g stroke="' + dk('#ef8b7a', .74) + '" stroke-width="4" stroke-linecap="round"><path d="M16 44v10M48 44v10"/></g>',
    /* เก้าอี้ผ้าใบ (ทรงผู้กำกับ) — ผ้า 2 ผืน + ขาไขว้ X ⇒ อ่านออกกว่าทรงกรวย */
    'canvas-chair': ()=> G('<rect x="16" y="14" width="32" height="13" rx="2" fill="#8fc98a"/>'
                          + '<rect x="13" y="31" width="38" height="9" rx="2" fill="' + lt('#8fc98a', .2) + '"/>', dk('#8fc98a'))
                        + '<g stroke="' + dk(FW.wood, .8) + '" stroke-width="4.5" stroke-linecap="round">'
                        + '<path d="M17 12v20M47 12v20M17 32l20 22M47 32L27 54"/></g>',
    'garden-swing': ()=> '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="5" stroke-linecap="round">'
                        + '<path d="M32 8L12 54M32 8l20 46M18 20h28"/></g>'
                        + '<g stroke="' + dk(FW.metal, .7) + '" stroke-width="2.6"><path d="M22 20v14M42 20v14"/></g>'
                        + G('<rect x="16" y="34" width="32" height="9" rx="3" fill="#ffca4a"/>', dk('#ffca4a')),
    'swing-bench':  ()=> '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="5" stroke-linecap="round"><path d="M8 10h48M14 10v6M50 10v6"/></g>'
                        + '<g stroke="' + dk(FW.metal, .7) + '" stroke-width="2.6"><path d="M16 16v14M48 16v14"/></g>'
                        + G('<rect x="10" y="30" width="44" height="9" rx="3" fill="' + FW.wood + '"/>'
                          + '<rect x="10" y="20" width="44" height="7" rx="3" fill="' + lt(FW.wood, .2) + '"/>', dk(FW.wood)),
    'tree-bench':   ()=> fTree('#8fc98a', 'round')
                        + G('<path d="M6 40h52v9H6z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="4.5" stroke-linecap="round"><path d="M12 49v5M52 49v5"/></g>',
    /* ---- เครื่องเล่นสนาม ---- */
    'swing':        ()=> '<g stroke="' + dk(FW.metal, .78) + '" stroke-width="5" stroke-linecap="round">'
                        + '<path d="M32 8L10 54M32 8l22 46M12 14h40"/></g>'
                        + '<g stroke="' + dk(FW.metal, .7) + '" stroke-width="2.4"><path d="M24 14v22M40 14v22"/></g>'
                        + G('<rect x="19" y="36" width="26" height="8" rx="3" fill="#ffca4a"/>', dk('#ffca4a')),
    'slide':        ()=> G('<path d="M46 12h10v34c-14 0-24-10-24-22 0-7 6-12 14-12z" fill="#7fc7e0"/>', dk('#7fc7e0'))
                        + '<g stroke="' + dk(FW.metal, .78) + '" stroke-width="4.5" stroke-linecap="round">'
                        + '<path d="M12 20v32M24 20v32M12 26h12M12 34h12M12 42h12M18 14h32"/></g>',
    'sandbox':      ()=> G('<rect x="6" y="28" width="52" height="20" rx="4" fill="' + FW.wood + '"/>'
                          + '<rect x="12" y="32" width="40" height="12" rx="3" fill="#f0d8a0"/>', dk(FW.wood))
                        + G('<path d="M34 32h10v10H34z" fill="#ef8b7a"/>', dk('#ef8b7a')),
    'seesaw':       ()=> G('<path d="M8 36h48l-2 8H10z" fill="#ffca4a" transform="rotate(-10 32 40)"/>', dk('#ffca4a'))
                        + G('<path d="M26 34h12l4 20H22z" fill="#ef8b7a"/>', dk('#ef8b7a')),
    'trampoline':   ()=> G('<ellipse cx="32" cy="28" rx="26" ry="11" fill="' + FW.dark + '"/>'
                          + '<ellipse cx="32" cy="26" rx="21" ry="8" fill="#5b6b7a"/>', dk(FW.metal))
                        + '<g stroke="' + dk(FW.metal, .78) + '" stroke-width="4.5" stroke-linecap="round">'
                        + '<path d="M12 32l-4 20M52 32l4 20M32 36v18"/></g>',
    'monkey-bars':  ()=> '<g stroke="' + dk('#ff9a6b', .8) + '" stroke-width="5" stroke-linecap="round">'
                        + '<path d="M10 16v38M54 16v38M10 16h44"/></g>'
                        + '<g stroke="#ffd54f" stroke-width="4" stroke-linecap="round">'
                        + '<path d="M20 16v8M28 16v8M36 16v8M44 16v8"/></g>',
    'spring-rider': ()=> G('<ellipse cx="32" cy="26" rx="19" ry="12" fill="#ff9a6b"/>'
                          + '<circle cx="47" cy="18" r="8" fill="#ff9a6b"/>', dk('#ff9a6b'))
                        + eye(50, 16, 2.4)
                        + '<path d="M32 38c-4 4-4 10 0 14" stroke="' + dk(FW.metal, .8) + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
                        + G('<ellipse cx="32" cy="53" rx="14" ry="4" fill="' + FW.metal + '"/>', dk(FW.metal)),
    'kiddie-pool':  ()=> G('<ellipse cx="32" cy="34" rx="26" ry="15" fill="#7fc7e0"/>'
                          + '<ellipse cx="32" cy="32" rx="20" ry="10" fill="#bfe3f2"/>', dk('#5b8ec9')),
    'water-table':  ()=> G('<rect x="8" y="24" width="48" height="14" rx="4" fill="#ffca4a"/>'
                          + '<rect x="13" y="21" width="38" height="10" rx="3" fill="#7fc7e0"/>', dk('#ffca4a'))
                        + '<g stroke="' + dk('#ffca4a', .78) + '" stroke-width="5" stroke-linecap="round"><path d="M16 38v16M48 38v16"/></g>',
    'basketball-hoop':()=> '<path d="M32 54V16" stroke="' + dk(FW.metal, .8) + '" stroke-width="5" stroke-linecap="round"/>'
                        + G('<rect x="26" y="8" width="26" height="18" rx="2" fill="' + FW.white + '"/>', dk(FW.metal))
                        + G('<ellipse cx="39" cy="27" rx="8" ry="3" fill="none"/>', '#ef5a5a')
                        + '<path d="M32 28l3 8h8l3-8" stroke="' + FW.cream + '" stroke-width="2" fill="none"/>',
    'soccer-goal':  ()=> G('<path d="M8 20h48v28H8z" fill="none"/>', FW.white)
                        + '<g stroke="' + dk(FW.metal, .7) + '" stroke-width="5" stroke-linecap="round"><path d="M8 20h48M8 20v28M56 20v28"/></g>'
                        + '<g stroke="' + FW.metal + '" stroke-width="1.6"><path d="M18 20v28M30 20v28M42 20v28M8 30h48M8 40h48"/></g>',
    'kite':         ()=> G('<path d="M32 6l16 16-16 20-16-20z" fill="#ef5a5a"/>', dk('#ef5a5a'))
                        + '<path d="M32 6v36M16 22h32" stroke="' + dk('#ef5a5a', .8) + '" stroke-width="2"/>'
                        + '<path d="M32 42c-6 4 6 8 0 12" stroke="' + dk(FW.metal, .8) + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
                        + '<g fill="#ffd54f"><circle cx="29" cy="47" r="3"/><circle cx="34" cy="53" r="3"/></g>',
    'playhouse':    ()=> fHut('#ffe0a0', '#ef8b7a'),
    'tree-house':   ()=> fTree('#6fb36a', 'round')
                        + G('<rect x="14" y="34" width="36" height="18" rx="3" fill="' + FW.wood + '"/>'
                          + '<path d="M32 24l22 12H10z" fill="' + lt(FW.wood, .2) + '"/>', dk(FW.wood))
                        + G('<rect x="27" y="40" width="10" height="12" rx="2" fill="' + dk(FW.wood, .68) + '"/>', dk(FW.wood)),
    'jungle-net':   ()=> '<g stroke="' + dk('#ff9a6b', .8) + '" stroke-width="5" stroke-linecap="round"><path d="M10 12v42M54 12v42M10 12h44"/></g>'
                        + '<g stroke="#ffd54f" stroke-width="3"><path d="M21 14v40M32 14v40M43 14v40M12 24h40M12 34h40M12 44h40"/></g>',
    'balance-beam': ()=> G('<rect x="6" y="28" width="52" height="9" rx="3" fill="#ffca4a"/>', dk('#ffca4a'))
                        + '<g stroke="' + dk('#ffca4a', .78) + '" stroke-width="5" stroke-linecap="round"><path d="M14 37l-4 15M50 37l4 15"/></g>',
    'mini-maze':    ()=> G('<rect x="6" y="14" width="52" height="38" rx="5" fill="#8fc98a"/>', dk('#6fb36a'))
                        + '<g stroke="' + dk('#6fb36a', .8) + '" stroke-width="4" stroke-linecap="round">'
                        + '<path d="M18 14v22M32 24v28M46 14v14M18 44h14M32 36h14"/></g>',
    /* ---- ตกแต่งนอกบ้าน ---- */
    'sell-basket':  ()=> G('<path d="M10 28h44l-5 22c-1 3-3 4-6 4H21c-3 0-5-1-6-4z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<path d="M20 28c0-8 5-12 12-12s12 4 12 12" stroke="' + dk(FW.wood, .74) + '" stroke-width="4" fill="none" stroke-linecap="round"/>'
                        + '<g stroke="' + dk(FW.wood, .7) + '" stroke-width="2.2"><path d="M20 36h24M22 44h20"/></g>',
    'lamp-post':    ()=> '<path d="M32 54V22" stroke="' + dk(FW.dark, .8) + '" stroke-width="5" stroke-linecap="round"/>'
                        + G('<path d="M22 22h20l-4-12H26z" fill="#ffe58a"/>', dk(FW.dark))
                        + G('<ellipse cx="32" cy="54" rx="12" ry="4" fill="' + FW.dark + '"/>', dk(FW.dark)),
    'garden-lantern':()=> '<path d="M32 54V44" stroke="' + dk(FW.dark, .8) + '" stroke-width="5" stroke-linecap="round"/>'
                        + G('<rect x="20" y="22" width="24" height="22" rx="3" fill="#ffb04a"/>'
                          + '<path d="M14 22l18-12 18 12z" fill="' + FW.dark + '"/>', dk(FW.dark))
                        + G('<ellipse cx="32" cy="54" rx="12" ry="4" fill="' + FW.dark + '"/>', dk(FW.dark)),
    'stone-lantern-row':()=> G('<g fill="' + FW.metal + '"><rect x="8" y="30" width="12" height="18" rx="3"/>'
                          + '<rect x="26" y="26" width="12" height="22" rx="3"/><rect x="44" y="30" width="12" height="18" rx="3"/></g>', dk(FW.metal))
                        + '<g fill="#ffe58a" stroke="' + dk('#ffe58a') + '" stroke-width="1.6">'
                        + '<rect x="10" y="34" width="8" height="7" rx="2"/><rect x="28" y="30" width="8" height="7" rx="2"/><rect x="46" y="34" width="8" height="7" rx="2"/></g>',
    'string-lights':()=> '<path d="M6 14c10 14 42 14 52 0" stroke="' + dk(FW.wood, .8) + '" stroke-width="3" fill="none" stroke-linecap="round"/>'
                        + '<g stroke="' + dk('#ffd54f') + '" stroke-width="1.6">'
                        + '<circle cx="14" cy="24" r="5" fill="#ef8b7a"/><circle cx="26" cy="29" r="5" fill="#ffd54f"/>'
                        + '<circle cx="38" cy="29" r="5" fill="#8fc98a"/><circle cx="50" cy="24" r="5" fill="#7fc7e0"/></g>',
    'fountain':     ()=> G('<ellipse cx="32" cy="44" rx="26" ry="10" fill="#7fc7e0"/>', dk('#5b8ec9'))
                        + G('<path d="M24 44V26h16v18z" fill="' + FW.metal + '"/>'
                          + '<ellipse cx="32" cy="26" rx="12" ry="5" fill="' + lt(FW.metal, .3) + '"/>', dk(FW.metal))
                        + '<g stroke="#9fd8ee" stroke-width="3" stroke-linecap="round" fill="none">'
                        + '<path d="M32 22V10M32 14c-6 2-9 6-10 10M32 14c6 2 9 6 10 10"/></g>',
    'bird-bath':    ()=> G('<ellipse cx="32" cy="24" rx="20" ry="8" fill="#bfe3f2"/>'
                          + '<path d="M12 24c0 6 9 10 20 10s20-4 20-10" fill="' + FW.metal + '"/>', dk(FW.metal))
                        + '<path d="M32 34v12" stroke="' + dk(FW.metal, .8) + '" stroke-width="6" stroke-linecap="round"/>'
                        + G('<ellipse cx="32" cy="50" rx="14" ry="5" fill="' + FW.metal + '"/>', dk(FW.metal)),
    'pond':         ()=> G('<ellipse cx="32" cy="34" rx="26" ry="16" fill="#7fc7e0"/>', dk('#5b8ec9'))
                        + '<ellipse cx="24" cy="28" rx="8" ry="4" fill="' + lt('#7fc7e0', .35) + '"/>',
    'well':         ()=> G('<path d="M14 30h36v18c0 3-2 5-5 5H19c-3 0-5-2-5-5z" fill="' + FW.metal + '"/>'
                          + '<ellipse cx="32" cy="30" rx="18" ry="6" fill="#7fc7e0"/>', dk(FW.metal))
                        + G('<path d="M32 6L52 22H12z" fill="#ef8b7a"/>', dk('#ef8b7a'))
                        + '<g stroke="' + dk(FW.wood, .8) + '" stroke-width="4" stroke-linecap="round"><path d="M18 22v8M46 22v8"/></g>',
    'mailbox':      ()=> '<path d="M32 54V32" stroke="' + dk(FW.wood, .8) + '" stroke-width="6" stroke-linecap="round"/>'
                        + G('<path d="M14 14h30c5 0 8 4 8 9s-3 9-8 9H14z" fill="#ef5a5a"/>', dk('#ef5a5a'))
                        + G('<rect x="14" y="18" width="8" height="10" rx="2" fill="' + FW.cream + '"/>', dk('#ef5a5a')),
    'birdhouse':    ()=> '<path d="M32 54V34" stroke="' + dk(FW.wood, .8) + '" stroke-width="6" stroke-linecap="round"/>'
                        + G('<rect x="16" y="18" width="32" height="18" rx="3" fill="' + FW.wood + '"/>'
                          + '<path d="M32 4l20 16H12z" fill="#ef8b7a"/>', dk(FW.wood))
                        + '<circle cx="32" cy="26" r="5" fill="' + dk(FW.wood, .55) + '"/>',
    'pet-house':    ()=> fHut('#ffe0a0', '#ef8b7a', {door:'#8a5a3a'}),
    'fence-seg':    ()=> G('<g fill="' + FW.cream + '"><path d="M10 22h8v32h-8zM28 22h8v32h-8zM46 22h8v32h-8z"/></g>', dk(FW.wood))
                        + G('<g fill="' + lt(FW.cream, .1) + '"><rect x="6" y="28" width="52" height="6" rx="2"/>'
                          + '<rect x="6" y="42" width="52" height="6" rx="2"/></g>', dk(FW.wood)),
    'fence-corner': ()=> G('<g fill="' + FW.cream + '"><path d="M8 24h8v30H8zM28 20h8v34h-8z"/></g>', dk(FW.wood))
                        + G('<g fill="' + lt(FW.cream, .1) + '"><rect x="4" y="30" width="34" height="6" rx="2"/>'
                          + '<rect x="32" y="30" width="28" height="6" rx="2" transform="rotate(20 32 33)"/></g>', dk(FW.wood)),
    'path':         ()=> G('<g fill="' + FW.cream + '"><rect x="8" y="20" width="20" height="16" rx="4"/>'
                          + '<rect x="34" y="20" width="20" height="16" rx="4"/><rect x="8" y="40" width="20" height="14" rx="4"/>'
                          + '<rect x="34" y="40" width="20" height="14" rx="4"/></g>', dk(FW.wood)),
    'stone-path':   ()=> G('<g fill="' + FW.metal + '"><ellipse cx="20" cy="24" rx="12" ry="8"/>'
                          + '<ellipse cx="44" cy="34" rx="12" ry="8"/><ellipse cx="20" cy="46" rx="12" ry="8"/></g>', dk(FW.metal)),
    'wooden-bridge':()=> G('<path d="M6 42c10-14 42-14 52 0v6H6z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<g stroke="' + dk(FW.wood, .74) + '" stroke-width="2.4"><path d="M18 36v12M32 33v15M46 36v12"/></g>'
                        + '<path d="M6 26c10-12 42-12 52 0" stroke="' + dk(FW.wood, .8) + '" stroke-width="4" fill="none" stroke-linecap="round"/>',
    'balloon':      ()=> G('<ellipse cx="32" cy="24" rx="16" ry="19" fill="#ef5a5a"/>'
                          + '<path d="M29 43h6l-3 5z" fill="' + dk('#ef5a5a', .8) + '"/>', dk('#ef5a5a'))
                        + '<path d="M32 48c-5 3 5 6 0 10" stroke="' + dk(FW.metal, .8) + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
    'gnome':        ()=> G('<path d="M32 6l14 22H18z" fill="#ef5a5a"/>', dk('#ef5a5a'))
                        + G('<path d="M18 28h28v10c0 9-6 16-14 16s-14-7-14-16z" fill="#5b8ec9"/>', dk('#5b8ec9'))
                        + '<circle cx="32" cy="32" r="8" fill="#ffd9a8"/>'
                        + '<path d="M24 36c2 8 14 8 16 0z" fill="' + FW.white + '"/>'
                        + eye(29, 31, 2) + eye(35, 31, 2),
    'garden-gnome-family':()=> '<g transform="translate(-11,4) scale(.72)">' + FURN_ICON.gnome() + '</g>'
                        + '<g transform="translate(20,10) scale(.58)">' + FURN_ICON.gnome() + '</g>',
    'scarecrow':    ()=> '<g stroke="' + dk(FW.wood, .8) + '" stroke-width="5" stroke-linecap="round"><path d="M32 54V22M12 28h40"/></g>'
                        + G('<path d="M20 14h24l-4-8H24z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + '<circle cx="32" cy="20" r="9" fill="#f2c98a" stroke="' + dk('#f2c98a') + '" stroke-width="2"/>'
                        + eye(29, 19, 2) + eye(35, 19, 2)
                        + G('<path d="M22 30h20v14H22z" fill="#ef5a5a"/>', dk('#ef5a5a')),
    'statue':       ()=> G('<circle cx="32" cy="18" r="9" fill="' + FW.white + '"/>'
                          + '<path d="M20 30h24v14H20z" fill="' + FW.white + '"/>'
                          + '<rect x="14" y="44" width="36" height="10" rx="3" fill="' + FW.metal + '"/>', dk(FW.metal)),
    'flag-pole':    ()=> '<path d="M18 54V6" stroke="' + dk(FW.metal, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<g><rect x="20" y="8" width="30" height="6" fill="#ef5a5a"/>'
                          + '<rect x="20" y="14" width="30" height="6" fill="' + FW.white + '"/>'
                          + '<rect x="20" y="20" width="30" height="8" fill="#3b4a86"/>'
                          + '<rect x="20" y="28" width="30" height="6" fill="' + FW.white + '"/>'
                          + '<rect x="20" y="34" width="30" height="6" fill="#ef5a5a"/></g>', dk(FW.metal)),
    'sun-dial':     ()=> G('<ellipse cx="32" cy="26" rx="20" ry="8" fill="' + FW.cream + '"/>', dk(FW.metal))
                        + G('<path d="M32 24l8-14 2 14z" fill="#ffd54f"/>', dk('#ffd54f'))
                        + '<path d="M32 30v10" stroke="' + dk(FW.metal, .8) + '" stroke-width="6" stroke-linecap="round"/>'
                        + G('<ellipse cx="32" cy="46" rx="14" ry="6" fill="' + FW.metal + '"/>', dk(FW.metal)),
    'bbq-grill':    ()=> G('<ellipse cx="32" cy="24" rx="20" ry="9" fill="' + FW.dark + '"/>'
                          + '<path d="M12 24c0 8 9 13 20 13s20-5 20-13z" fill="#5b6b7a"/>', dk(FW.dark))
                        + '<g stroke="' + FW.metal + '" stroke-width="2.2"><path d="M18 22h28M20 26h24"/></g>'
                        + '<g stroke="' + dk(FW.dark, .8) + '" stroke-width="4.5" stroke-linecap="round"><path d="M20 36l-6 18M44 36l6 18"/></g>',
    'campfire':     ()=> G('<path d="M32 10c8 10 12 16 12 22 0 8-5 14-12 14s-12-6-12-14c0-6 4-12 12-22z" fill="#ff8a3d"/>', dk('#ff5a2a'))
                        + '<path d="M32 24c4 6 6 9 6 13 0 4-3 7-6 7s-6-3-6-7c0-4 2-7 6-13z" fill="#ffd54f"/>'
                        + '<g stroke="' + dk(FW.wood, .8) + '" stroke-width="6" stroke-linecap="round">'
                        + '<path d="M12 50l40-4M14 46l38 6"/></g>',
    'windmill':     ()=> '<path d="M32 54V22" stroke="' + dk(FW.wood, .8) + '" stroke-width="5" stroke-linecap="round"/>'
                        + (function(){ let p2 = ''; const cs = ['#ef8b7a', '#ffd54f', '#7fc7e0', '#8fc98a'];
                            for(let i = 0; i < 4; i++){ const a = i / 4 * Math.PI * 2 + .4;
                              p2 += '<path d="M32 20L' + (32 + Math.cos(a) * 17).toFixed(1) + ' ' + (20 + Math.sin(a) * 17).toFixed(1)
                                  + 'L' + (32 + Math.cos(a + .7) * 15).toFixed(1) + ' ' + (20 + Math.sin(a + .7) * 15).toFixed(1) + 'z" fill="' + cs[i] + '"/>'; }
                            return G(p2, dk('#ef8b7a')); })()
                        + '<circle cx="32" cy="20" r="3.4" fill="' + dk('#ffd54f', .7) + '"/>',
    'wheelbarrow':  ()=> G('<path d="M12 24h34l-6 18H16z" fill="#ef5a5a"/>', dk('#ef5a5a'))
                        + '<path d="M46 24l10 16" stroke="' + dk(FW.wood, .8) + '" stroke-width="4.5" stroke-linecap="round"/>'
                        + G('<circle cx="24" cy="48" r="7" fill="' + FW.dark + '"/>', dk(FW.dark)),
    'garden-cart':  ()=> G('<path d="M10 26h36l-5 16H15z" fill="' + FW.wood + '"/>', dk(FW.wood))
                        + G('<g fill="#f2a7c3"><circle cx="20" cy="20" r="6"/><circle cx="32" cy="17" r="6"/><circle cx="42" cy="21" r="5"/></g>', dk('#f2a7c3'))
                        + G('<circle cx="19" cy="48" r="6" fill="' + FW.dark + '"/><circle cx="39" cy="48" r="6" fill="' + FW.dark + '"/>', dk(FW.dark)),
    'house-sign':   ()=> '<path d="M22 54V22" stroke="' + dk(FW.wood, .8) + '" stroke-width="6" stroke-linecap="round"/>'
                        + G('<rect x="16" y="14" width="40" height="20" rx="3" fill="' + FW.cream + '"/>', dk(FW.wood))
                        + G('<path d="M24 20c-2-3-6-2-6 1s5 6 6 7c1-1 6-4 6-7s-4-4-6-1z" fill="#ef5a5a"/>', dk('#ef5a5a'))
                        + '<g stroke="' + dk(FW.wood, .7) + '" stroke-width="2.4" stroke-linecap="round"><path d="M34 22h14M34 27h9"/></g>',
    'ins-windchime':()=> '<path d="M12 12h40" stroke="' + dk(FW.wood, .8) + '" stroke-width="4" stroke-linecap="round"/>'
                        + G('<path d="M18 12h28l-6 10H24z" fill="#ef8b7a"/>', dk('#ef8b7a'))
                        + '<g stroke="' + dk(FW.metal, .7) + '" stroke-width="1.6"><path d="M22 22v8M32 22v8M42 22v8"/></g>'
                        + G('<g fill="' + FW.metal + '"><rect x="19" y="30" width="6" height="18" rx="3"/>'
                          + '<rect x="29" y="30" width="6" height="22" rx="3"/><rect x="39" y="30" width="6" height="16" rx="3"/></g>', dk(FW.metal)),
  });
  Object.keys(FURN_ICON).forEach(id=>{ REG['furn-' + id] = FURN_ICON[id]; });

  /* ============================================================
     🏪 ป้ายร้าน/อาคารในเมือง (เฟส B) — โผล่เป็นป้ายลอยเหนือตึกในโลก 3D
     🔑 นี่คือจุดที่ emoji เจ็บที่สุด: ป้าย 20 กว่าอันลอยอยู่กลางเมือง เครื่องคนละ OS เห็นคนละรูป
     ⚠ id ตั้งตาม "ความหมายของป้าย" ไม่ใช่ตาม lot — ป้ายเดียวกันใช้ซ้ำหลายล็อตได้
     ============================================================ */
  const SIGN = {
    'sign-mart'(){ const c = '#7fc7e0', d = dk(c);
      return G('<path d="M8 24h48v26c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="' + FW.cream + '"/>'
             + '<path d="M6 14h52l4 10H2z" fill="' + c + '"/>', d)
           + '<g fill="' + lt(c, .3) + '"><rect x="14" y="30" width="16" height="14" rx="2"/>'
           + '<rect x="34" y="30" width="16" height="14" rx="2"/></g>'
           + '<path d="M14 24v-10M26 24v-10M38 24v-10M50 24v-10" stroke="' + dk(c, .8) + '" stroke-width="2"/>'; },
    'sign-paw'(){ const c = '#f0a35a', d = dk(c);
      return G('<ellipse cx="32" cy="42" rx="15" ry="12" fill="' + c + '"/>'
             + '<ellipse cx="15" cy="26" rx="6.5" ry="8" fill="' + c + '"/>'
             + '<ellipse cx="27" cy="18" rx="6.5" ry="8.5" fill="' + c + '"/>'
             + '<ellipse cx="39" cy="18" rx="6.5" ry="8.5" fill="' + c + '"/>'
             + '<ellipse cx="51" cy="26" rx="6.5" ry="8" fill="' + c + '"/>', d); },
    'sign-hospital'(){ const c = '#ef5a5a', d = dk(c);
      return G('<rect x="10" y="12" width="44" height="42" rx="5" fill="' + FW.white + '"/>', dk(FW.metal))
           + G('<path d="M26 18h12v10h10v12H38v10H26V40H16V28h10z" fill="' + c + '"/>', d); },
    'sign-noodle'(){ const c = '#ef8b7a', d = dk(c);
      return G('<path d="M8 28h48c0 14-11 24-24 24S8 42 8 28z" fill="' + FW.cream + '"/>', dk('#c9a06a'))
           + '<g stroke="#ffd54f" stroke-width="3.4" stroke-linecap="round" fill="none">'
           + '<path d="M18 28c0-8 3-14 6-16M30 28c0-9 2-16 4-18M42 28c0-8-2-14-4-16"/></g>'
           + G('<path d="M44 16l12-6 2 4-12 7z" fill="' + c + '"/>', d); },
    'sign-cityhall'(){ const c = '#e8d4b0', d = dk('#c9a06a');
      return G('<path d="M32 6l26 12H6z" fill="#ef8b7a"/>', dk('#ef8b7a'))
           + G('<rect x="8" y="18" width="48" height="6" rx="2" fill="' + c + '"/>'
             + '<rect x="6" y="46" width="52" height="8" rx="2" fill="' + c + '"/>', d)
           + '<g fill="' + c + '" stroke="' + d + '" stroke-width="2"><rect x="13" y="24" width="8" height="22"/>'
           + '<rect x="28" y="24" width="8" height="22"/><rect x="43" y="24" width="8" height="22"/></g>'; },
    'sign-hotel'(){ const c = '#8fb8e0', d = dk(c);
      return G('<rect x="12" y="10" width="40" height="44" rx="4" fill="' + FW.cream + '"/>', dk('#c9a06a'))
           + '<g fill="' + c + '" stroke="' + d + '" stroke-width="1.8">'
           + '<rect x="18" y="16" width="9" height="9" rx="2"/><rect x="37" y="16" width="9" height="9" rx="2"/>'
           + '<rect x="18" y="30" width="9" height="9" rx="2"/><rect x="37" y="30" width="9" height="9" rx="2"/></g>'
           + G('<rect x="26" y="42" width="12" height="12" rx="2" fill="' + dk('#c9a06a', .8) + '"/>', dk('#c9a06a')); },
    'sign-police'(){ const c = '#5b8ec9', d = dk(c);
      return G('<path d="M32 6l20 8v18c0 12-9 22-20 26-11-4-20-14-20-26V14z" fill="' + c + '"/>', d)
           + G('<path d="M32 18l3.4 7 7.6.6-5.8 5 1.8 7.4L32 34l-7 4 1.8-7.4-5.8-5 7.6-.6z" fill="#ffd54f"/>', dk('#ffd54f')); },
    'sign-rice'(){ const c = '#e8c86a', d = dk(c);
      return '<g stroke="' + dk('#8fc98a') + '" stroke-width="3.4" stroke-linecap="round" fill="none">'
           + '<path d="M20 54c0-14 2-24 6-32M44 54c0-14-2-24-6-32"/></g>'
           + G('<g fill="' + c + '"><ellipse cx="26" cy="12" rx="5" ry="8" transform="rotate(-18 26 12)"/>'
             + '<ellipse cx="38" cy="12" rx="5" ry="8" transform="rotate(18 38 12)"/>'
             + '<ellipse cx="22" cy="26" rx="5" ry="8" transform="rotate(-24 22 26)"/>'
             + '<ellipse cx="42" cy="26" rx="5" ry="8" transform="rotate(24 42 26)"/></g>', d); },
    'sign-school'(){ const c = '#ef5a5a', d = dk(c);
      return G('<path d="M32 6l26 14H6z" fill="' + c + '"/>', d)
           + G('<rect x="10" y="20" width="44" height="34" rx="3" fill="' + FW.cream + '"/>', dk('#c9a06a'))
           + G('<rect x="25" y="34" width="14" height="20" rx="2" fill="' + c + '"/>', d)
           + '<g fill="#7fc7e0" stroke="' + dk('#7fc7e0') + '" stroke-width="1.8">'
           + '<rect x="14" y="26" width="9" height="9" rx="2"/><rect x="41" y="26" width="9" height="9" rx="2"/></g>'
           + '<path d="M32 6V0" stroke="' + d + '" stroke-width="2.4" stroke-linecap="round"/>'; },
    'sign-saw'(){ const c = FW.metal, d = dk(c);
      return G('<path d="M10 20h34l10 10-10 4H10z" fill="' + c + '"/>', d)
           + '<path d="M12 34l4 6 4-6 4 6 4-6 4 6 4-6 4 6 4-6" fill="none" stroke="' + d + '" stroke-width="2.4" stroke-linejoin="round"/>'
           + G('<path d="M6 18h8v18H6c-3 0-5-2-5-5V23c0-3 2-5 5-5z" fill="' + FW.wood + '"/>', dk(FW.wood)); },
    'sign-lab'(){ const c = '#9fd8ee', d = dk(c);
      return G('<path d="M26 8h12v16l14 24c2 4-1 8-5 8H17c-4 0-7-4-5-8l14-24z" fill="' + FW.white + '"/>', dk(FW.metal))
           + '<path d="M20 38h24l6 10c2 3 0 5-3 5H17c-3 0-5-2-3-5z" fill="' + c + '"/>'
           + '<g fill="' + FW.white + '"><circle cx="26" cy="46" r="2.6"/><circle cx="36" cy="49" r="2"/></g>'
           + '<path d="M24 8h16" stroke="' + dk(FW.metal, .8) + '" stroke-width="3.4" stroke-linecap="round"/>'; },
    'sign-dress'(){ const c = '#f2a7c3', d = dk(c);
      return G('<path d="M24 10h16l6 8-8 6 6 26c1 4-2 6-6 6H26c-4 0-7-2-6-6l6-26-8-6z" fill="' + c + '"/>', d)
           + '<path d="M26 34h12" stroke="' + lt(c, .4) + '" stroke-width="3" stroke-linecap="round"/>'; },
    'sign-carousel'(){ const c = '#f2a7c3', d = dk(c);
      return G('<path d="M32 4l24 14H8z" fill="' + c + '"/>', d)
           + '<g stroke="' + dk('#ffd54f', .8) + '" stroke-width="3.4" stroke-linecap="round"><path d="M16 18v26M32 18v26M48 18v26"/></g>'
           + G('<g fill="#ffd54f"><circle cx="16" cy="34" r="6"/><circle cx="32" cy="30" r="7"/><circle cx="48" cy="34" r="6"/></g>', dk('#ffd54f'))
           + G('<rect x="8" y="44" width="48" height="8" rx="3" fill="' + lt(c, .2) + '"/>', d); },
    'sign-owl'(){ const c = '#c9a06a', d = dk(c);
      return G('<ellipse cx="32" cy="34" rx="19" ry="21" fill="' + c + '"/>'
             + '<path d="M14 16l4-10 8 6zM50 16l-4-10-8 6z" fill="' + c + '"/>', d)
           + '<g fill="' + FW.cream + '" stroke="' + d + '" stroke-width="2">'
           + '<circle cx="24" cy="28" r="8"/><circle cx="40" cy="28" r="8"/></g>'
           + '<circle cx="24" cy="28" r="3.4" fill="#33261d"/><circle cx="40" cy="28" r="3.4" fill="#33261d"/>'
           + G('<path d="M32 32l5 6h-10z" fill="#f5a623"/>', dk('#f5a623')); },
    'sign-skewer'(){ const c = '#ef8b7a', d = dk(c);
      return '<g stroke="' + dk(FW.wood, .8) + '" stroke-width="3" stroke-linecap="round"><path d="M20 54V16M44 54V16"/></g>'
           + G('<g fill="' + c + '"><circle cx="20" cy="18" r="7"/><circle cx="20" cy="32" r="7"/>'
             + '<circle cx="44" cy="18" r="7"/><circle cx="44" cy="32" r="7"/></g>', d); },
  };
  Object.keys(SIGN).forEach(id=>{ REG[id] = SIGN[id]; });

  /* ============================================================
     🧑 ชาวบ้าน/NPC 67 คน (เฟส B) — โผล่ในหัวการ์ดเควสต์ · หน้าสรุปงานวันนี้ · ข้อความบอกทาง
     🔑 **ทรงร่วมตัวเดียว** (`npcIcon`) = หัว + ทรงผม + เสื้อ + (หมวก) + (ของถือ)
        ⇒ ทุกคนเป็น "คน" เหมือนกันหมด ต่างกันที่สี/ทรงผม/หมวก/ของถือ **ไม่ได้วาดทีละคน**
     ⚠ ของถือยืมไอคอนที่วาดไว้แล้วมาย่อ ⇒ เพิ่มอาชีพใหม่แทบไม่มีต้นทุน
     ============================================================ */
  const SKIN = ['#ffd9a8', '#f5c99a', '#e8b58a'];
  const NPC_HAIR = {
    short: c => G('<path d="M19 22c0-8 6-13 13-13s13 5 13 13c0-5-5-7-13-7s-13 2-13 7z" fill="' + c + '"/>', dk(c)),
    bob:   c => G('<path d="M18 24c0-9 6-15 14-15s14 6 14 15v8c-2-3-3-8-3-12-3 3-8 4-11 4s-8-1-11-4c0 4-1 9-3 12z" fill="' + c + '"/>', dk(c)),
    bun:   c => G('<circle cx="32" cy="8" r="6" fill="' + c + '"/>'
                + '<path d="M19 23c0-8 6-13 13-13s13 5 13 13c0-5-5-8-13-8s-13 3-13 8z" fill="' + c + '"/>', dk(c)),
    long:  c => G('<path d="M17 26c0-11 7-17 15-17s15 6 15 17v14c-3-2-4-8-4-14-3 3-7 4-11 4s-8-1-11-4c0 6-1 12-4 14z" fill="' + c + '"/>', dk(c)),
    spiky: c => G('<path d="M19 21l3-7 4 5 4-8 4 8 4-5 3 7c0-6-5-11-11-11s-11 5-11 11z" fill="' + c + '"/>', dk(c)),
    old:   c => G('<path d="M18 24c0-9 6-15 14-15s14 6 14 15c-2-4-6-6-14-6s-12 2-14 6z" fill="#e6e0d6"/>', '#b9b0a2'),
    pony:  c => G('<path d="M19 22c0-8 6-13 13-13s13 5 13 13c0-5-5-7-13-7s-13 2-13 7z" fill="' + c + '"/>'
                + '<path d="M45 20c5 2 7 8 6 14-4 0-7-4-8-9z" fill="' + c + '"/>', dk(c)),
  };
  const NPC_HAT = {
    chef:   ()=> G('<path d="M20 14c-4 0-7-3-7-6s3-6 6-5c1-4 5-6 9-4 3-3 8-2 10 2 4-1 8 2 8 6s-3 7-7 7z" fill="' + FW.white + '"/>'
                 + '<rect x="20" y="12" width="24" height="6" rx="2" fill="' + FW.white + '"/>', dk(FW.metal)),
    police: c => G('<path d="M16 16h32v5H16z" fill="' + (c || '#3b5b86') + '"/>'
                 + '<path d="M20 16c0-7 5-11 12-11s12 4 12 11z" fill="' + (c || '#3b5b86') + '"/>', dk(c || '#3b5b86'))
                 + G('<path d="M32 7l2 4 4 .4-3 3 .9 4-3.9-2-3.9 2 .9-4-3-3 4-.4z" fill="#ffd54f"/>', dk('#ffd54f')),
    straw:  ()=> G('<ellipse cx="32" cy="17" rx="24" ry="6" fill="#e8c86a"/>'
                 + '<path d="M22 17c0-7 4-11 10-11s10 4 10 11z" fill="#e8c86a"/>', dk('#e8c86a')),
    party:  c => G('<path d="M32 2l9 16H23z" fill="' + (c || '#ef5a5a') + '"/>', dk(c || '#ef5a5a'))
                 + '<circle cx="32" cy="2" r="3" fill="#ffd54f"/>',
    cap:    c => G('<path d="M19 17c0-8 6-12 13-12s13 4 13 12z" fill="' + (c || '#5b8ec9') + '"/>'
                 + '<path d="M45 15c6 0 10 1 12 3H45z" fill="' + dk(c || '#5b8ec9', .82) + '"/>', dk(c || '#5b8ec9')),
    nurse:  ()=> G('<path d="M18 16h28v5H18z" fill="' + FW.white + '"/>', dk(FW.metal))
                 + G('<path d="M30 6h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#ef5a5a"/>', dk('#ef5a5a')),
    crown:  ()=> G('<path d="M16 18 14 5l9 6 9-9 9 9 9-6-2 13z" fill="#ffd54f"/>', dk('#ffd54f')),
    top:    ()=> G('<rect x="21" y="2" width="22" height="14" rx="2" fill="#3a3a3a"/>'
                 + '<rect x="14" y="15" width="36" height="5" rx="2" fill="#3a3a3a"/>', '#1e1e1e')
                 + '<rect x="21" y="11" width="22" height="4" fill="#ef5a5a"/>',
    goggle: ()=> G('<rect x="16" y="16" width="32" height="9" rx="4" fill="#bfe3f2" opacity=".95"/>', dk('#9fd8ee')),
    sun:    ()=> G('<ellipse cx="32" cy="16" rx="23" ry="6" fill="#ffca4a"/>'
                 + '<path d="M23 16c0-6 4-10 9-10s9 4 9 10z" fill="#ffca4a"/>', dk('#ffca4a')),
    scout:  ()=> G('<path d="M20 16h24v4H20z" fill="#8fc98a"/>'
                 + '<path d="M22 16c0-7 4-11 10-11s10 4 10 11z" fill="#8fc98a"/>', dk('#8fc98a')),
  };
  /* ของถือ — ยืมไอคอนที่วาดไว้แล้วมาย่อวางมุมขวาล่าง (ทับไหล่เหมือนถืออยู่) */
  const hold = (id, sc, dx, dy)=> REG[id]
    ? '<g transform="translate(' + (dx == null ? 32 : dx) + ',' + (dy == null ? 30 : dy) + ') scale(' + (sc || .52) + ')">' + REG[id]() + '</g>'
    : '';
  function npcIcon(o){
    o = o || {};
    const skin = SKIN[o.sk || 0], sd = dk(skin, .72), shirt = o.c || '#8fb8e0';
    return G('<path d="M9 58c0-12 10-20 23-20s23 8 23 20z" fill="' + shirt + '"/>', dk(shirt))
         + G('<rect x="27" y="30" width="10" height="10" rx="3" fill="' + skin + '"/>', sd)
         + G('<circle cx="32" cy="24" r="13" fill="' + skin + '"/>', sd)
         + (NPC_HAIR[o.h || 'short'] || NPC_HAIR.short)(o.hc || '#5b4a42')
         + eye(27, 25, 2.4) + eye(37, 25, 2.4)
         + '<path d="M29 31c2 2 4 2 6 0" stroke="' + sd + '" stroke-width="2" fill="none" stroke-linecap="round"/>'
         + (o.hat ? (NPC_HAT[o.hat] || NPC_HAT.cap)(o.hatC) : '')
         + (o.it ? hold(o.it, o.its, o.itx, o.ity) : '');
  }
  /* ตารางประจำตัว — `h` ทรงผม · `hc` สีผม · `c` สีเสื้อ · `sk` สีผิว · `hat` หมวก · `it` ของถือ */
  const NPC_CFG = {
    'mart':{h:'bob', c:'#7fc7e0', it:'sign-mart', its:.42},
    'pet':{h:'bun', c:'#f0a35a', it:'sign-paw', its:.4},
    'food':{h:'bun', hc:'#7a6a5a', c:'#ef8b7a', hat:'chef', it:'sign-noodle', its:.42},
    'ice':{h:'bob', c:'#bfe3f2', it:'furn-fruit-bowl', its:.4},
    'musicshop':{h:'spiky', c:'#e3c7f0', it:'furn-ins-guitar', its:.42},
    'mall-furn':{h:'short', c:'#a8c8e8', it:'furn-sofa', its:.42},
    'mall-fash':{h:'long', hc:'#4a3a32', c:'#f2a7c3', it:'sign-dress', its:.4},
    'garden':{h:'bun', c:'#8fc98a', hat:'straw', it:'furn-tulip-pot', its:.4},
    'toy':{h:'bob', c:'#ffca4a', it:'sign-carousel', its:.4},
    'cart-fruit':{h:'short', c:'#8fc98a', hat:'straw', it:'furn-fruit-bowl', its:.4},
    'clown':{h:'spiky', hc:'#ef5a5a', c:'#ffd54f', hat:'party', it:'furn-balloon', its:.4},
    'magician':{h:'short', c:'#7e57c2', hat:'top'},
    'cart-noodle':{h:'bun', hc:'#7a6a5a', c:'#ef8b7a', it:'sign-noodle', its:.42},
    'mk-meatball':{h:'bun', hc:'#7a6a5a', c:'#f4b8c8', it:'sign-skewer', its:.42},
    'mk-sausage':{h:'short', hc:'#8a7a6a', c:'#ffb04a', hat:'chef'},
    'mk-tokyo':{h:'short', c:'#ffd54f', hat:'chef'},
    'mk-smoothie':{h:'pony', c:'#8fc98a', it:'furn-blender', its:.42},
    'mk-toy':{h:'bun', hc:'#7a6a5a', c:'#e3c7f0', it:'toy-ball', its:.42},
    'mk-cotton':{h:'bob', c:'#f2a7c3', it:'furn-toy-box', its:.4},
    'milk':{h:'old', c:'#fdfaf3', it:'critter-cow', its:.4},
    'mk-fruit':{h:'bun', hc:'#7a6a5a', c:'#ef5a5a', hat:'straw', it:'furn-fruit-bowl', its:.4},
    'mk-shave':{h:'short', c:'#9fd8ee', it:'furn-blender', its:.42},
    'lab1':{h:'bob', c:'#fdfaf3', it:'sign-lab', its:.4},
    'lab2':{h:'short', c:'#fdfaf3', it:'sign-lab', its:.4},
    'lab3':{h:'spiky', c:'#dff0fa', hat:'goggle'},
    'stu1':{h:'bob', c:'#8fb8e0', it:'ui-book', its:.4},
    'stu2':{h:'spiky', c:'#8fb8e0', it:'ui-book', its:.4},
    'stu3':{h:'bun', c:'#8fb8e0', it:'ui-book', its:.4},
    'stu4':{h:'short', c:'#8fb8e0', it:'ui-book', its:.4},
    'student':{h:'pony', hc:'#4a3a32', c:'#a8c8e8', it:'ui-book', its:.4},
    'headman':{h:'old', c:'#e8c86a', it:'furn-house-sign', its:.4},
    'mayor':{h:'old', c:'#3b5b86', hat:'top'},
    'hotel-pool':{h:'short', c:'#7fc7e0', it:'toy-hoop', its:.42},
    'hotel-bell':{h:'short', c:'#c0527a', it:'sign-hotel', its:.4},
    'doctor':{h:'short', c:'#fdfaf3', hat:'nurse', it:'sign-hospital', its:.38},
    'nurse':{h:'bun', hc:'#7a6a5a', c:'#fdfaf3', hat:'nurse'},
    'granny':{h:'old', sk:1, c:'#e3c7f0'},
    'teacher':{h:'bun', hc:'#4a3a32', c:'#ef8b7a', it:'sign-school', its:.38},
    'farmer':{h:'old', c:'#8fc98a', hat:'straw', it:'sign-rice', its:.4},
    'cowboy':{h:'short', sk:1, c:'#e8c86a', hat:'straw', it:'critter-cow', its:.4},
    'farmgo':{h:'bun', hc:'#7a6a5a', c:'#8fc98a', hat:'straw', it:'food-veg', its:.42},
    'fisher':{h:'old', c:'#7fc7e0', hat:'straw', it:'ui-fishing', its:.42},
    'fisher2':{h:'old', sk:2, c:'#5b8ec9', hat:'straw', it:'fish-nil', its:.42},
    'fisher-kid':{h:'spiky', c:'#9fd8ee', it:'fish-guppy', its:.42},
    'carpenter':{h:'old', sk:1, c:'#c08a5e', hat:'cap', hatC:'#c9a06a', it:'sign-saw', its:.4},
    'hut':{h:'bun', hc:'#7a6a5a', c:'#f4b8c8', it:'furn-chair', its:.4},
    'camp1':{h:'short', c:'#8fc98a', hat:'scout', it:'furn-campfire', its:.4},
    'camp3':{h:'spiky', c:'#8fc98a', hat:'scout'},
    'beach':{h:'short', sk:1, c:'#ffca4a', hat:'sun'},
    'beach-kid':{h:'bob', c:'#ffd54f', it:'furn-sandbox', its:.4},
    'beach-swim':{h:'spiky', sk:1, c:'#9fd8ee', it:'toy-hoop', its:.42},
    'beach-shell':{h:'bun', hc:'#7a6a5a', c:'#bfe3f2', it:'col-shell', its:.42},
    'music':{h:'spiky', hc:'#4a3a32', c:'#e3c7f0', it:'furn-ins-guitar', its:.42},
    'kid1':{h:'bob', c:'#f2a7c3'},
    'play1':{h:'bun', c:'#ffca4a'},
    'play2':{h:'spiky', c:'#8fc98a'},
    'play':{h:'spiky', c:'#ef5a5a', it:'furn-soccer-goal', its:.4},
    'walk1':{h:'pony', c:'#ef5a5a', hat:'cap', hatC:'#ef5a5a'},
    'walk2':{h:'spiky', c:'#7fc7e0'},
    'walk3':{h:'old', c:'#a8c8e8'},
    'walk4':{h:'cap' in NPC_HAT ? 'short' : 'short', c:'#e8c86a', hat:'cap', hatC:'#8fc98a', it:'ui-basket', its:.42},
    'police-town':{h:'short', c:'#3b5b86', hat:'police'},
    'police-station':{h:'short', sk:1, c:'#3b5b86', hat:'police'},
    'post':{h:'short', c:'#ef8b7a', hat:'cap', hatC:'#ef5a5a', it:'furn-mailbox', its:.4},
    'shopper':{h:'bun', hc:'#7a6a5a', c:'#f2a7c3', it:'ui-basket', its:.42},
    'dogwalk':{h:'old', c:'#c08a5e', it:'pet-dog', its:.42},
    'traveler':{h:'short', c:'#8fc98a', hat:'cap', hatC:'#e8c86a', it:'ui-seek', its:.4},
  };
  Object.keys(NPC_CFG).forEach(id=>{ REG['npc-' + id] = ()=> npcIcon(NPC_CFG[id]); });
  /* 👪 พ่อแม่ + กระดานเควสต์ — โผล่ในหน้าสรุปเควสต์แถวเดียวกับชาวบ้าน จึงต้องเป็นชุดเดียวกัน */
  REG['fam-mom'] = ()=> npcIcon({h:'long', hc:'#6b4a3a', c:'#f2a7c3'});
  REG['fam-dad'] = ()=> npcIcon({h:'short', hc:'#4a3a32', c:'#5b8ec9'});
  /* 🦉 นกฮูกมาสคอตเป็น NPC ตัวที่ 68 (id ไม่ได้ขึ้นต้นด้วย npc-) — ใช้รูปเดียวกับป้ายนกฮูก */
  REG['owl-mascot'] = ()=> SIGN['sign-owl']()
    + G('<path d="M18 48c8 5 20 5 28 0l-2 7c-8 4-16 4-24 0z" fill="#ef5a5a"/>', dk('#ef5a5a'));
  /* ⭐❗ ไอคอนของหน้า "เควสต์วันนี้" (ผู้ใช้สั่ง 2026-08-20) */


  /* 🎪 ท่าที่สอนน้อง — วาดเป็น "สัญลักษณ์การเคลื่อนไหว" ให้ต่างกันชัดที่เงารวม */
  const TRICK = (function(){
    /* หัวน้องหมาแบบเดียวกันทุกท่า — ท่าต่างกันที่ "ตัว/ขา/สัญลักษณ์ประกอบ" ⇒ เงารวมต่างกันชัด */
    const C = '#c9a06a', D = dk('#c9a06a');
    function head(x, y, r){
      return G('<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + C + '"/>'
             + '<ellipse cx="' + (x - r * .9) + '" cy="' + (y - r * .5) + '" rx="' + (r * .42) + '" ry="' + (r * .6) + '" fill="' + C + '"/>'
             + '<ellipse cx="' + (x + r * .9) + '" cy="' + (y - r * .5) + '" rx="' + (r * .42) + '" ry="' + (r * .6) + '" fill="' + C + '"/>', D)
           + '<ellipse cx="' + x + '" cy="' + (y + r * .42) + '" rx="' + (r * .5) + '" ry="' + (r * .36) + '" fill="' + lt(C, .45) + '"/>'
           + '<circle cx="' + x + '" cy="' + (y + r * .26) + '" r="' + (r * .17) + '" fill="#5b4a42"/>'
           + eye(x - r * .38, y - r * .1, r * .16) + eye(x + r * .38, y - r * .1, r * .16);
    }
    return {
      /* 🪑 นั่ง — ตัวตั้งตรง ก้นแตะพื้น หางแนบข้าง */
      sit(){ return G('<path d="M24 54c0-8 2-14 4-18 2-4 4-6 4-10h8c0 6 2 10 4 16 1 4 2 8 2 12z" fill="' + C + '"/>'
                    + '<path d="M46 52c8 0 10-6 8-12-3 4-6 5-8 4z" fill="' + lt(C, .2) + '"/>', D)
                  + head(32, 20, 12)
                  + '<path d="M14 56h36" stroke="' + dk('#8a6a4a') + '" stroke-width="4" stroke-linecap="round"/>'; },
      /* 🔄 หมุนตัว — น้องอยู่กลางวงลูกศร */
      spin(){ const a = '#4fa3d9';
        return '<path d="M52 34a20 20 0 1 1-9-16" fill="none" stroke="' + dk(a) + '" stroke-width="8" stroke-linecap="round"/>'
             + '<path d="M52 34a20 20 0 1 1-9-16" fill="none" stroke="' + a + '" stroke-width="4.6" stroke-linecap="round"/>'
             + '<path d="M46 6l7 12-14 2z" fill="' + a + '" stroke="' + dk(a) + '" stroke-width="2.4" stroke-linejoin="round"/>'
             + head(30, 36, 13); },
      /* 🙌 ไฮไฟว์ — อุ้งเท้าน้องแตะฝ่ามือเด็ก */
      /* 🙌 ไฮไฟว์ — มือเด็ก (แบมือชุดเดียวกับปุ่ม "ลูบหัว") + น้องยกขาหน้ามาแตะ */
      high(){
        /* ✋ มือเดียวกับปุ่ม "ลูบหัว" — helper อยู่ในแกนกลางแล้ว ⇒ ยืมรูป ui-pat มาย่อ
           (ไอคอน ui-pat = มือ + เส้นบอกการเคลื่อนไหว · ที่นี่เอาเฉพาะมือพอ ⇒ ตัด path เส้นนั้นออก) */
        const hand = (CORE._reg['ui-pat'] ? CORE._reg['ui-pat']() : '').split('<path d="M56 12')[0];
        return '<g transform="translate(-3,15) scale(.56)">' + hand + '</g>'
             + G('<path d="M34 42c0-4 3-7 7-7h10c4 0 7 3 7 7v14H34z" fill="' + C + '"/>'
               + '<path d="M35 42c-6-5-9-11-8-15 4 1 8 5 11 9z" fill="' + C + '"/>', D)
             + head(45, 23, 12)
             + '<path d="M27 13l-3-6M32 8v-6" stroke="#ffd54f" stroke-width="3.4" stroke-linecap="round"/>'; },
      /* 🤸 กระโดด — น้องลอยเหนือพื้น มีเส้นลมใต้ตัว */
      jump(){ return G('<path d="M20 40c0-6 5-11 12-11s12 5 12 11c0 4-2 7-4 9H24c-2-2-4-5-4-9z" fill="' + C + '"/>'
                     + '<path d="M46 34c8-4 10-10 8-14-4 4-7 6-10 6z" fill="' + lt(C, .2) + '"/>', D)
                   + head(32, 20, 12)
                   + '<path d="M14 56h10M28 56h8M42 56h8" stroke="' + dk('#8fb8c9') + '" stroke-width="4" stroke-linecap="round"/>'; },
      /* 😴 นอนกลิ้ง — น้องนอนหงาย ขาชี้ขึ้น */
      roll(){ return G('<ellipse cx="30" cy="42" rx="20" ry="12" fill="' + C + '"/>', D)
                   + '<path d="M20 32l-3-10M30 30l1-11M40 32l4-10" stroke="' + D + '" stroke-width="4.4" stroke-linecap="round"/>'
                   + head(50, 34, 10)
                   + '<path d="M8 46c-4 2-6 5-6 5s4 2 8 0" fill="' + lt(C, .2) + '" stroke="' + D + '" stroke-width="2.4" stroke-linejoin="round"/>'; },
    };
  })();
  Object.keys(TRICK).forEach(id=>{ REG['trick-' + id] = TRICK[id]; });

  /* 🧸 ของเล่นสัตว์เลี้ยง */
  const TOY = {
    ball(){ const c = '#c6e34d', d = dk(c);
      return G('<circle cx="32" cy="32" r="20" fill="' + c + '"/>', d)
           + '<path d="M14 22c8 4 12 12 12 20M50 22c-8 4-12 12-12 20" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>'; },
    rope(){ const c = '#d9a86c', d = dk(c);
      return '<path d="M12 40c8-14 32-14 40 0" fill="none" stroke="' + d + '" stroke-width="12" stroke-linecap="round"/>'
           + '<path d="M12 40c8-14 32-14 40 0" fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round"/>'
           + '<path d="M8 34l-4 10M56 34l4 10" stroke="' + d + '" stroke-width="4" stroke-linecap="round"/>'; },
    wand(){ const c = '#8d6e63', f = '#f06292';
      return '<path d="M10 54L34 22" stroke="' + dk(c) + '" stroke-width="6" stroke-linecap="round"/>'
           + G('<path d="M34 22c6-10 16-14 20-10s0 14-10 20c-5 3-10 3-12 1s-1-7 2-11z" fill="' + f + '"/>', dk(f))
           + '<path d="M38 20c4 6 6 10 6 12" fill="none" stroke="' + dk(f, .8) + '" stroke-width="2.4" stroke-linecap="round"/>'; },
    disc(){ const c = '#4fc3f7', d = dk(c);
      return G('<ellipse cx="32" cy="34" rx="24" ry="11" fill="' + c + '"/>', d)
           + '<ellipse cx="32" cy="32" rx="13" ry="5.5" fill="' + lt(c, .45) + '" stroke="' + d + '" stroke-width="2.2"/>'; },
    plush(){ const c = '#c9a06a', d = dk(c);
      return G('<circle cx="32" cy="36" r="15" fill="' + c + '"/><circle cx="19" cy="20" r="8" fill="' + c + '"/><circle cx="45" cy="20" r="8" fill="' + c + '"/>', d)
           + '<circle cx="19" cy="20" r="3.6" fill="' + lt(c, .4) + '"/><circle cx="45" cy="20" r="3.6" fill="' + lt(c, .4) + '"/>'
           + eye(26, 33, 2.6) + eye(38, 33, 2.6)
           + '<ellipse cx="32" cy="41" rx="6" ry="4.5" fill="' + lt(c, .45) + '"/>'
           + '<path d="M32 39v4M29 45c2 2 4 2 6 0" fill="none" stroke="' + d + '" stroke-width="2" stroke-linecap="round"/>'; },
    bubbles(){ const c = '#8fd7ef', d = dk(c);
      return G('<circle cx="24" cy="38" r="13" fill="' + c + '" fill-opacity=".75"/>'
             + '<circle cx="44" cy="24" r="9" fill="' + c + '" fill-opacity=".75"/>'
             + '<circle cx="46" cy="45" r="6" fill="' + c + '" fill-opacity=".75"/>', d)
           + '<circle cx="19" cy="33" r="3.4" fill="#fff" opacity=".8"/><circle cx="41" cy="21" r="2.4" fill="#fff" opacity=".8"/>'; },
    hoop(){ const c = '#ff8a65', d = dk(c);
      return '<circle cx="32" cy="32" r="20" fill="none" stroke="' + d + '" stroke-width="12"/>'
           + '<circle cx="32" cy="32" r="20" fill="none" stroke="' + c + '" stroke-width="7"/>'
           + '<path d="M32 12v7M52 32h-7M32 52v-7M12 32h7" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'; },
    'pet-slide'(){ const c = '#ffb74d', d = dk(c), b = '#7bc47f';
      return G('<path d="M14 54c0-16 10-30 26-36l8 4c-16 6-24 18-24 32z" fill="' + c + '"/>', d)
           + '<path d="M44 20v34M50 24v30" stroke="' + dk(b) + '" stroke-width="5" stroke-linecap="round"/>'
           + '<path d="M44 26h6M44 34h6M44 42h6" stroke="' + b + '" stroke-width="4" stroke-linecap="round"/>'; },
  };
  Object.keys(TOY).forEach(id=>{ REG['toy-' + id] = TOY[id]; });

  /* 🍖 อาหารสัตว์เลี้ยง */
  const FOOD = {
    /* 🍖 อาหารเนื้อ = น่องไก่ — ⚠ ปลายกระดูกต้องเป็น "ปุ่มคู่" ไม่งั้นดูเป็นไม้ปิงปอง */
    meat(){ const c = '#d0694a', d = dk(c), b = '#f7ead2', bd = dk(b, .72);
      return G('<path d="M24 41c-7-6-8-18-1-26 8-9 23-9 31-1 7 7 6 19-2 26-9 7-21 6-28 1z" fill="' + c + '"/>', d)
           + '<path d="M26 42L15 53" stroke="' + bd + '" stroke-width="12" stroke-linecap="round"/>'
           + '<path d="M26 42L15 53" stroke="' + b + '" stroke-width="8" stroke-linecap="round"/>'
           + G('<circle cx="11" cy="49" r="5.5" fill="' + b + '"/><circle cx="18" cy="56" r="5.5" fill="' + b + '"/>', bd)
           + '<path d="M31 26c4-2 9-1 12 2" stroke="' + lt(c, .45) + '" stroke-width="3" fill="none" stroke-linecap="round"/>'; },
    /* 🐟 อาหารปลา = **ชามอาหารเม็ด** ไม่ใช่รูปปลา (ไม่งั้นซ้ำกับไอคอนปลาในสมุดสะสม) */
    fish(){ const c = '#7fb6d9', d = dk(c), k = '#e08a4a';
      return G('<path d="M8 30h48c0 12-9 22-24 22S8 42 8 30z" fill="' + c + '"/>', d)
           + '<g fill="' + k + '" stroke="' + dk(k) + '" stroke-width="2"><circle cx="24" cy="26" r="5"/><circle cx="36" cy="24" r="5"/><circle cx="46" cy="28" r="4.5"/></g>'; },
    /* 🥕 ผักสด = แครอท + ใบผัก (ต่างจากไอคอน "เมล็ดแครอท" ที่เป็นหัวเดียวโดดๆ) */
    veg(){ const g = '#7cc46a', o = '#f08a3c';
      return G('<path d="M40 54l-6-20c-1-3 1-5 4-5h6c3 0 5 2 4 5z" fill="' + o + '"/>', dk(o))
           + G('<path d="M42 29c-2-8-6-11-6-11s-2 7 1 11z" fill="' + g + '"/>', dk(g))
           + G('<path d="M26 52c-12 0-20-8-20-16 0-4 3-6 6-5-1-4 3-8 7-7 1-4 4-6 7-6s6 2 7 6c-3 6-4 12-4 16 0 5 1 9 2 12z" fill="' + g + '"/>', dk(g)); },
    seed(){ const c = '#e8c874', d = dk(c);
      return G('<path d="M32 8c4 8 4 16 0 22-4-6-4-14 0-22zM20 20c6 6 8 13 7 20-6-4-9-12-7-20zM44 20c-6 6-8 13-7 20 6-4 9-12 7-20z" fill="' + c + '"/>'
             + '<path d="M18 46h28c2 0 3 2 2 4l-2 6H18z" fill="' + lt(c, .3) + '"/>', d); },
    /* 🌿 หญ้าแห้ง = ฟ่อนหญ้ามัดกลาง — ⚠ ของเดิมเป็นก้อนกลมมีลายตาราง ดูเป็นขนมปัง/แตงโม */
    hay(){ const c = '#d9c169', d = dk(c), r = '#b07a3c';
      const A = [-22, -11, 0, 11, 22];
      let p = '';
      A.forEach(v => { p += '<path d="M' + (32 + v) + ' 7L' + (32 + v * .3) + ' 32L' + (32 + v) + ' 57"/>'; });
      return '<g stroke="' + d + '" stroke-width="8" stroke-linecap="round" fill="none">' + p + '</g>'
           + '<g stroke="' + c + '" stroke-width="4.5" stroke-linecap="round" fill="none">' + p + '</g>'
           + G('<path d="M17 27h30v10H17z" fill="' + r + '"/>', dk(r)); },
    bug(){ const c = '#8a9a5b', d = dk(c);
      return G('<ellipse cx="32" cy="38" rx="13" ry="16" fill="' + c + '"/><circle cx="32" cy="18" r="8" fill="' + c + '"/>', d)
           + '<path d="M24 14l-8-8M40 14l8-8" stroke="' + d + '" stroke-width="2.6" stroke-linecap="round"/>'
           + '<path d="M19 30c-6-2-10-6-12-10M45 30c6-2 10-6 12-10M19 44c-6 2-10 6-12 10M45 44c6 2 10 6 12 10" stroke="' + d + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
           + '<path d="M32 26v26" stroke="' + dk(c, .8) + '" stroke-width="2.4"/>'
           + eye(28, 17, 2) + eye(36, 17, 2); },
    bamboo(){ const c = '#7cb342', d = dk(c);
      return G('<path d="M24 56V14c0-4 2-6 5-6s5 2 5 6v42z" fill="' + c + '"/>', d)
           + '<path d="M24 26h10M24 38h10M24 50h10" stroke="' + d + '" stroke-width="2.6" stroke-linecap="round"/>'
           + G('<path d="M34 22c8-6 16-4 16-4s-2 10-10 12-8-4-6-8zM34 40c8-6 16-4 16-4s-2 10-10 12-8-4-6-8z" fill="' + lt(c, .25) + '"/>', d); },
    magic(){ const cs = ['#f06292','#ffb74d','#ffd54f','#7bc47f','#4fc3f7','#b58fe0'];
      let arcs = '';
      cs.forEach((c, i)=>{ const r = 26 - i * 4;
        arcs += '<path d="M' + (32 - r) + ' 46a' + r + ' ' + r + ' 0 0 1 ' + (r * 2) + ' 0" fill="none" stroke="' + c + '" stroke-width="4"/>'; });
      return arcs + '<path d="M6 46h52" stroke="' + dk('#b58fe0') + '" stroke-width="3" stroke-linecap="round"/>'
           + '<path d="M46 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffe082" stroke="' + dk('#ffb74d') + '" stroke-width="1.8" stroke-linejoin="round"/>'; },
  };
  Object.keys(FOOD).forEach(id=>{ REG['food-' + id] = FOOD[id]; });

  /* 🍃 ของสะสมประจำวัน (4 ธีมตามเดือน) */
  const COLL = {
    leaf(){ const c = '#e08a3c', d = dk(c);
      return G('<path d="M50 12C28 12 12 26 12 44c0 3 1 6 2 8 18 2 38-12 38-32 0-3 0-6-2-8z" fill="' + c + '"/>', d)
           + '<path d="M14 52C24 42 36 30 50 14" stroke="' + dk(c, .78) + '" stroke-width="3" fill="none" stroke-linecap="round"/>'
           + '<path d="M26 42c4-6 6-12 6-18M38 32c2-6 2-10 2-14" stroke="' + dk(c, .78) + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; },
    shell(){ return SEA.scallop('#ffcfa8'); },
    star(){ const c = '#ffd75e', d = dk(c);
      let p = '';
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + i / 5 * Math.PI * 2, a2 = a + Math.PI/5;
        p += (i ? 'L' : 'M') + (32 + Math.cos(a) * 24).toFixed(1) + ' ' + (32 + Math.sin(a) * 24).toFixed(1)
           + 'L' + (32 + Math.cos(a2) * 10.5).toFixed(1) + ' ' + (32 + Math.sin(a2) * 10.5).toFixed(1);
      }
      return G('<path d="' + p + 'z" fill="' + c + '"/>', d); },
    flower(){ const c = '#f79fc4', d = dk(c);
      let pet = '';
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + i / 5 * Math.PI * 2;
        pet += '<ellipse cx="' + (32 + Math.cos(a) * 14).toFixed(1) + '" cy="' + (32 + Math.sin(a) * 14).toFixed(1)
             + '" rx="9" ry="12" transform="rotate(' + (a * 180 / Math.PI + 90).toFixed(1) + ' '
             + (32 + Math.cos(a) * 14).toFixed(1) + ' ' + (32 + Math.sin(a) * 14).toFixed(1) + ')" fill="' + c + '"/>';
      }
      return G(pet, d) + '<circle cx="32" cy="32" r="7" fill="#ffd75e" stroke="' + dk('#ffd75e') + '" stroke-width="2.4"/>'; },
  };
  Object.keys(COLL).forEach(id=>{ REG['col-' + id] = COLL[id]; });


  /* ============================================================
     🎛️ ไอคอนของ UI ในโหมดบ้าน (ปุ่ม/แถว/แท็บ) — กลุ่มที่เด็กเห็นทุกวัน
     ⚠ ต้องอ่านออกที่ 24-28px ⇒ ทรงใหญ่ชิ้นเดียวเป็นหลัก ห้ามใส่รายละเอียดเล็ก
     ============================================================ */
  /* 🧩 ไอคอน UI กลาง (ui-*) ย้ายไป `js/shared/icons.js` แล้ว — แกนกลางโหลดทั้ง 2 หน้า
     ⚠ helper `handOpen()` ก็ย้ายไปด้วย (ไอคอน ui-pat กับ trick-high ใช้ร่วมกัน) */
  /* แท็บของสมุดสะสม — ใช้ตัวแทนจากคลังที่วาดไว้แล้ว ไม่วาดซ้ำ */
  REG['tab-fish']    = ()=> SEA.fish('#5fb8e0');
  REG['tab-crop']    = PLANT.carrot;
  REG['tab-critter'] = ()=> CORE._reg['ui-critter'] ? CORE._reg['ui-critter']() : '';
  REG['tab-trick']   = TRICK.jump;
  REG['tab-photo']   = ()=> CORE._reg['ui-photo'] ? CORE._reg['ui-photo']() : '';


  /* 🎀 ปลอกคอสัตว์เลี้ยง 8 แบบ — โผล่ในเมนูฟองของน้องกับหน้าร้านสัตว์เลี้ยง
     ⚠ ทุกแบบวาดเป็น "สายปลอกคอ + จี้ประจำแบบ" ⇒ รู้ทันทีว่าเป็นปลอกคอ ต่างกันที่จี้ */
  function collarBase(c){
    const d = dk(c);
    return '<path d="M10 24c6 10 16 16 22 16s16-6 22-16" fill="none" stroke="' + d + '" stroke-width="11" stroke-linecap="round"/>'
         + '<path d="M10 24c6 10 16 16 22 16s16-6 22-16" fill="none" stroke="' + c + '" stroke-width="6.5" stroke-linecap="round"/>';
  }
  const COLLAR = {
    classic(){ const c = '#8fb8e0', t = '#e8c874';
      return collarBase(c) + G('<circle cx="32" cy="48" r="10" fill="' + t + '"/>', dk(t))
           + '<circle cx="32" cy="48" r="4" fill="' + dk(t, .72) + '"/>'; },
    /* ⚠ กระดูกต้องเป็นทรงคลาสสิก "แท่งกลาง + ปุ่มคู่ 2 ปลาย" — ของเดิมเป็นก้อนหยักดูเหมือนก้อนเมฆ */
    bone(){ const c = '#f2a03d', t = '#fffaf0';
      return collarBase(c)
           + G('<path d="M20 40c-4 0-7 2.6-7 6 0 1.5.7 2.9 1.8 4-1.1 1.1-1.8 2.5-1.8 4 0 3.4 3 6 7 6 3.4 0 6.2-2 6.8-5h10.4c.6 3 3.4 5 6.8 5 4 0 7-2.6 7-6 0-1.5-.7-2.9-1.8-4 1.1-1.1 1.8-2.5 1.8-4 0-3.4-3-6-7-6-3.4 0-6.2 2-6.8 5H26.8c-.6-3-3.4-5-6.8-5z" fill="' + t + '"/>', dk(t, .78)); },
    bow(){ const c = '#f06292', t = '#ff8fc4';
      return collarBase(c)
           + G('<path d="M32 46c-4-6-10-8-13-5s-1 11 6 11c3 0 6-3 7-6zM32 46c4-6 10-8 13-5s1 11-6 11c-3 0-6-3-7-6z" fill="' + t + '"/>'
             + '<circle cx="32" cy="46" r="4.5" fill="' + dk(t, .88) + '"/>', dk(t)); },
    heart(){ const c = '#e05252', t = '#ff7d8f';
      return collarBase(c)
           + G('<path d="M32 56c-8-6-12-10-12-15 0-4 3-6 6-6 2 0 4 1 6 3 2-2 4-3 6-3 3 0 6 2 6 6 0 5-4 9-12 15z" fill="' + t + '"/>', dk(t)); },
    star(){ const c = '#7bc47f', t = '#ffd54f';
      let p = '';
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + i / 5 * Math.PI * 2, a2 = a + Math.PI/5;
        p += (i ? 'L' : 'M') + (32 + Math.cos(a) * 12).toFixed(1) + ' ' + (46 + Math.sin(a) * 12).toFixed(1)
           + 'L' + (32 + Math.cos(a2) * 5).toFixed(1) + ' ' + (46 + Math.sin(a2) * 5).toFixed(1);
      }
      return collarBase(c) + G('<path d="' + p + 'z" fill="' + t + '"/>', dk(t)); },
    bell(){ const c = '#b58fe0', t = '#ffcb3d';
      return collarBase(c)
           + G('<path d="M32 36c6 0 10 5 10 11v4H22v-4c0-6 4-11 10-11z" fill="' + t + '"/>', dk(t))
           + '<circle cx="32" cy="55" r="3.4" fill="' + dk(t, .7) + '"/>'
           + '<path d="M27 46h10" stroke="' + dk(t, .7) + '" stroke-width="2.2" stroke-linecap="round"/>'; },
    flower(){ const c = '#4fc3a1', t = '#ff9ec4';
      let pet = '';
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + i / 5 * Math.PI * 2;
        pet += '<circle cx="' + (32 + Math.cos(a) * 7).toFixed(1) + '" cy="' + (46 + Math.sin(a) * 7).toFixed(1) + '" r="5" fill="' + t + '"/>';
      }
      return collarBase(c) + G(pet, dk(t)) + '<circle cx="32" cy="46" r="4" fill="#ffd54f" stroke="' + dk('#ffd54f') + '" stroke-width="2"/>'; },
    bandana(){ const c = '#e0728f', t = '#ff8f6b';
      return collarBase(c)
           + G('<path d="M18 40h28l-14 18z" fill="' + t + '"/>', dk(t))
           + '<g fill="' + lt(t, .5) + '"><circle cx="27" cy="45" r="2.2"/><circle cx="37" cy="45" r="2.2"/><circle cx="32" cy="51" r="2.2"/></g>'; },
  };
  Object.keys(COLLAR).forEach(id=>{ REG['collar-' + id] = COLLAR[id]; });

  /* ---------- ประกอบเป็น <svg> ---------- */
  function html(id, size, cls){
    const f = REG[id];
    if(!f) return '';
    const s = size || 28;
    return '<svg class="' + (cls || 'hicon') + '" viewBox="0 0 64 64" width="' + s + '" height="' + s
         + '" aria-hidden="true" focusable="false">' + f() + '</svg>';
  }
  /* 🔁 ตัวช่วยที่ทุกที่ควรใช้: มีไอคอน = ได้ SVG · ไม่มี = ได้ emoji เดิม (ห้ามพัง ห้ามว่างเปล่า)
     ⚠ `emoji` ถูกใส่ลง innerHTML ⇒ ผู้เรียกต้องส่งข้อความสั้นๆ ของตัวเองเท่านั้น ห้ามส่งข้อความจากผู้ใช้ */
  function htmlOr(id, emoji, size, cls){
    return html(id, size, cls) || (emoji == null ? '' : String(emoji));
  }
  /* 🖼 คืนไอคอนเป็น data URI สำหรับโหลดเข้า `new Image()` (เช่นวาดลง canvas/texture ของโลก 3D)
     ⚠ **ต้องมี `xmlns` เสมอ** — SVG ที่ฝังใน HTML ไม่ต้องมีก็ได้ แต่พอเป็นไฟล์เดี่ยวใน data URI
       เบราว์เซอร์จะไม่ยอมโหลดเลย (img.onerror เงียบๆ) ⇒ ป้ายร้านในเมืองเคยขึ้น emoji เดิมทั้งแผ่น */
  function svgUri(id, size){
    const f = REG[id];
    if(!f) return '';
    const s = size || 128;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="' + s
              + '" height="' + s + '">' + f() + '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  /* 📦 ไฟล์นี้เป็น **แพ็กไอคอนของโหมดบ้าน** — ลงทะเบียนเข้าแกนกลาง `js/shared/icons.js`
     (แกนกลางโหลดทั้ง 2 หน้า · แพ็กนี้โหลด lazy ตอนเข้าบ้านเหมือนเดิม)
     ⚠ ถ้าแกนกลางยังไม่ถูกโหลดด้วยเหตุใดก็ตาม **ต้องไม่พัง** ⇒ ถอยไปสร้าง API ของตัวเองเหมือนเดิม */
  if(window.OwlIcons && window.OwlIcons.addAll){
    window.OwlIcons.addAll(REG);
    window.HouseIcons = window.OwlIcons;
  }else{
    window.HouseIcons = {
      html, htmlOr, svgUri, has: id => !!REG[id], ids: ()=> Object.keys(REG),
      add: (id, fn)=>{ REG[id] = fn; },
      _reg: REG, _dk: dk, _lt: lt, _eye: eye, _G: G,
    };
  }
})();
