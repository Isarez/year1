/* ============================================================
   🎨 คลังไอคอน SVG ของ Owlkids — **แกนกลาง** (โหลดทั้งหน้าเด็กและหน้าครู)
   (เฟส C ของ ICON-PLAN.md · ผู้ใช้สั่ง "อะไรที่ต้องมีไอคอน ให้วาดเป็น SVG เสมอ")

   ทำไมต้องแยกไฟล์นี้ออกมา:
     คลังไอคอนเดิมอยู่ใน `js/house-icons.js` ซึ่ง **โหลดแบบ lazy ตอนเข้าโหมดบ้านเท่านั้น**
     ⇒ หน้าหลัก (เลือกหมวด/เล่นเกม/สมุดสติกเกอร์) เรียกใช้ไม่ได้เลย
     ⇒ ย้าย "แกน" (helper + ทะเบียน + ตัวเรียกใช้) มาไว้ที่นี่ แล้วให้แต่ละหน้าโหลด
       **แพ็กไอคอน** ของตัวเองต่อท้าย (โหมดบ้าน / หน้าหลัก / คลังโจทย์)

   🔒 กติกา
   - ไฟล์นี้เก็บ **แต่รูปกับตัวช่วยวาด** ไม่มี logic เกม ไม่แตะ DOM/state
   - **ไม่มีไอคอน = ต้องถอยไปใช้ emoji เดิมเสมอ ห้ามพัง** (`htmlOr`)
   - ทุกไอคอนเป็น **viewBox 64×64 · fill แบน + เส้นขอบมนสีเข้มกว่าตัว**
   - ⚠ `window.HouseIcons` = ชื่อเดิมที่โค้ดโหมดบ้านเรียกอยู่หลายสิบจุด **ต้องใช้ได้เหมือนเดิม**
   ============================================================ */
(function(){
  'use strict';
  if(window.OwlIcons) return;                 /* กันโหลดซ้ำ (หน้าครูโหลด shared/* ชุดเดียวกัน) */

  /* ---------- helper วาดรูป (แพ็กทุกไฟล์ใช้ตัวเดียวกันนี้) ---------- */
  /* สีเข้มลง (ใช้ทำเส้นขอบ) — รับ '#rrggbb' คืน '#rrggbb' */
  function dk(hex, k){
    k = k == null ? .62 : k;
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  /* สีจางลง (ผสมขาว) */
  function lt(hex, k){
    k = k == null ? .35 : k;
    const n = parseInt(hex.slice(1), 16);
    const mix = v => Math.round(v + (255 - v) * k);
    return '#' + ((1 << 24) + (mix((n >> 16) & 255) << 16) + (mix((n >> 8) & 255) << 8) + mix(n & 255)).toString(16).slice(1);
  }
  const eye = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 2.6) + '" fill="#33261d"/>'
                         + '<circle cx="' + (x + .9) + '" cy="' + (y - .9) + '" r="' + ((r || 2.6) * .38) + '" fill="#fff"/>';
  const G = (inner, c) => '<g stroke="' + c + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>';

  const REG = {};                              /* id → ฟังก์ชันคืน inner svg */

  function add(id, fn){ REG[id] = fn; }
  function addAll(map){ if(map) Object.keys(map).forEach(k=>{ REG[k] = map[k]; }); }

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
       เบราว์เซอร์จะไม่ยอมโหลดเลย (img.onerror เงียบๆ) */
  function svgUri(id, size){
    const f = REG[id];
    if(!f) return '';
    const s = size || 128;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="' + s
              + '" height="' + s + '">' + f() + '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ============================================================
     🧩 ไอคอน UI กลาง — ย้ายมาจาก `js/house-icons.js` ตอนแยกไฟล์ (เฟส C)
     อยู่ที่นี่เพราะ **ทั้งหน้าหลักและโหมดบ้านต้องใช้** และแกนกลางโหลดทั้ง 2 หน้า
     ⚠ ห้ามย้ายกลับไปไว้ในแพ็กโหมดบ้าน — แพ็กนั้นโหลด lazy หน้าหลักจะเรียกไม่ได้
     ============================================================ */

  function handOpen(sk){
    const d = dk(sk);
    /* เส้นรอบรูปมือทั้งมือใน path เดียว (ผู้ใช้สั่ง 2026-08-19: "วาด path เป็นเส้นเดียว")
       ไล่จากโคนนิ้วชี้ → ขึ้น-ลงทีละนิ้ว (ชี้/กลาง/นาง/ก้อย ปลายมนด้วยส่วนโค้ง A)
       → ขอบนอกฝ่ามือ → ก้นฝ่ามือมน → ขอบในฝ่ามือ → นิ้วโป้งกางออกซ้ายบน → ปิดรูป
       ⚠ ร่องระหว่างนิ้วเป็น "แอ่งมน" (Q) กว้าง 1.6 — ถ้าแคบกว่านี้ เส้นขอบ 2 ฝั่งจะเชื่อมกัน
         เป็นก้อนตันที่ขนาด 26px มองไม่ออกว่าเป็นนิ้ว */
    const path = 'M21.4 40.5'
      + 'L22 21.8A3.3 3.3 0 0 1 28.6 21.8L28.6 33.4Q29.4 35.6 30.2 33.4'
      + 'L30.2 17.8A3.3 3.3 0 0 1 36.8 17.8L36.8 32.4Q37.6 34.6 38.4 32.4'
      + 'L38.4 20.8A3.3 3.3 0 0 1 45 20.8L45 33.4Q45.8 35.6 46.6 33.4'
      + 'L46.6 26.6A3.3 3.3 0 0 1 53.2 26.6L53.2 45'
      + 'C53.2 53.6 46.6 58.4 38 58.4L35 58.4C26.4 58.4 21 53.6 21 46.2'
      + 'C16.8 46.6 11.4 42 9.4 35.2A3.6 3.6 0 0 1 15.6 31'
      + 'C18.6 34.2 21.4 38 21.4 40.5Z';
    return '<path d="' + path + '" fill="' + sk + '" stroke="' + d
         + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
  }
  const UI = {
    /* 🧭 เข็มทิศ — ใช้บนปุ่ม "พาไปเก็บ" ในแผงกิจกรรม (ผู้ใช้สั่งให้เป็น SVG 2026-08-22)
       ⚠ ที่ 20px เห็นแค่ "เงารวม" ⇒ เข็มต้องเป็นสามเหลี่ยมทึบ 2 สีตัดกันชัด
         (แดง = ทิศเหนือ · ขาว = หาง) ห้ามวาดขีดองศาเล็กๆ มองไม่ออกและกลายเป็นขอบสกปรก */
    compass(){ const c = '#f6ead5', d = dk('#8fb8c9'), r = '#e05252', g = '#5b6a75';
      return G('<circle cx="32" cy="32" r="26" fill="' + c + '"/>', d)
           + '<path d="M32 12L41 32H23z" fill="' + r + '" stroke="' + dk(r) + '" stroke-width="2" stroke-linejoin="round"/>'
           + '<path d="M32 52L23 32h18z" fill="' + g + '" stroke="' + dk(g) + '" stroke-width="2" stroke-linejoin="round"/>'; },
    /* 🙈 ซ่อนแอบ — หน้ายิ้มเอามือปิดตา */
    seek(){ const c = '#ffd9a8', d = dk(c), h = '#5b4a42';
      return G('<circle cx="32" cy="34" r="20" fill="' + c + '"/>'
             + '<path d="M12 28c2-10 10-16 20-16s18 6 20 16z" fill="' + h + '"/>', d)
           + '<path d="M8 34c8-6 14-6 20 0M36 34c6-6 12-6 20 0" fill="' + lt(c, .25) + '" stroke="' + d + '" stroke-width="2.6" stroke-linejoin="round"/>'
           + '<path d="M26 46c4 3 8 3 12 0" fill="none" stroke="' + d + '" stroke-width="2.6" stroke-linecap="round"/>'; },
    /* 🎣 ตกปลา — คันเบ็ด + สายเบ็ด + ทุ่น */
    fishing(){ const c = '#a1704a', d = dk(c), f = '#e05252';
      return '<path d="M10 54L44 12" stroke="' + d + '" stroke-width="6" stroke-linecap="round"/>'
           + '<path d="M44 12c8 4 10 12 8 18" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>'
           + '<path d="M52 30v12" stroke="' + dk('#8fb8c9') + '" stroke-width="2.4" stroke-linecap="round"/>'
           + G('<circle cx="52" cy="46" r="8" fill="' + f + '"/>', dk(f))
           + '<path d="M44 46h16" stroke="#fff" stroke-width="3"/>'; },
    /* 📷 กล้องถ่ายรูป */
    camera(){ const c = '#7f8b96', d = dk(c);
      return G('<path d="M8 22h12l4-6h16l4 6h12c3 0 5 2 5 5v22c0 3-2 5-5 5H8c-3 0-5-2-5-5V27c0-3 2-5 5-5z" fill="' + c + '"/>'
             + '<circle cx="32" cy="38" r="12" fill="' + lt(c, .3) + '"/>', d)
           + '<circle cx="32" cy="38" r="6" fill="#4a5560"/><circle cx="29" cy="35" r="2" fill="#fff" opacity=".8"/>'
           + '<circle cx="49" cy="27" r="2.6" fill="#ffd54f"/>'; },
    /* 🌱 แปลงผัก — ต้นกล้าในแปลงดิน */
    garden(){ const g = '#5aa54f', d = dk(g), soil = '#8a6a4a';
      return G('<path d="M6 42h52l-4 14H10z" fill="' + soil + '"/>', dk(soil))
           + G('<path d="M32 42V22M32 26c-8 0-12-6-12-10 8-1 12 4 12 10zM32 30c8 0 12-6 12-10-8-1-12 4-12 10z" fill="' + g + '"/>', d); },
    /* 📔 สมุดสะสม */
    book(){ const c = '#e0a94b', d = dk(c), pg = '#fffaf0';
      return G('<path d="M12 10h30c6 0 10 4 10 10v34H22c-6 0-10-4-10-10z" fill="' + c + '"/>'
             + '<path d="M22 16h24v30H22z" fill="' + pg + '"/>', d)
           + '<path d="M28 24h12M28 32h12M28 40h8" stroke="' + dk(c, .8) + '" stroke-width="2.6" stroke-linecap="round"/>'
           + '<path d="M46 46v10l-5-4-5 4V46z" fill="#e05252" stroke="' + dk('#e05252') + '" stroke-width="2" stroke-linejoin="round"/>'; },
    /* 🧺 ตะกร้าขายของ */
    basket(){ const c = '#d9a86c', d = dk(c);
      return G('<path d="M8 24h48l-6 28c-1 4-3 6-7 6H21c-4 0-6-2-7-6z" fill="' + c + '"/>', d)
           + '<path d="M18 30l4 24M32 30v24M46 30l-4 24" stroke="' + dk(c, .8) + '" stroke-width="2.6" stroke-linecap="round"/>'
           + '<path d="M20 24c0-8 5-12 12-12s12 4 12 12" fill="none" stroke="' + d + '" stroke-width="3.4" stroke-linecap="round"/>'; },
    /* 💧 รดน้ำ */
    water(){ const c = '#4fb0e0', d = dk(c);
      return G('<path d="M32 6c10 14 16 22 16 30 0 9-7 16-16 16s-16-7-16-16c0-8 6-16 16-30z" fill="' + c + '"/>', d)
           + '<path d="M24 38c0 6 4 10 8 11" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".75"/>'; },
    /* 🤚 ลูบหัว */
    /* 🤚 ลูบหัว = มือแบ + เส้นบอกการเคลื่อนไหว (ดู handOpen ข้างบน) */
    pat(){
      return handOpen('#ffd9a8')
           + '<path d="M56 12c2.5 3.5 3.6 7.5 3.4 11M50 6c3 4.5 4.6 9.5 4.6 14" stroke="#f0a34b" stroke-width="3.2" fill="none" stroke-linecap="round"/>'; },
    /* 🫧 อาบน้ำ */
    bath(){ const c = '#8fd7ef', d = dk(c);
      return G('<path d="M6 32h52v10c0 8-6 14-14 14H20c-8 0-14-6-14-14z" fill="' + c + '"/>', d)
           + '<circle cx="22" cy="18" r="7" fill="#fff" stroke="' + d + '" stroke-width="2.4" opacity=".9"/>'
           + '<circle cx="38" cy="12" r="5" fill="#fff" stroke="' + d + '" stroke-width="2.2" opacity=".9"/>'
           + '<circle cx="46" cy="22" r="4" fill="#fff" stroke="' + d + '" stroke-width="2" opacity=".9"/>'; },
    /* 🎪 สอนท่า */
    /* 🎪 สอนท่า = เต็นท์ละครสัตว์ — ⚠ ของเดิมเป็นหลังคาสามเหลี่ยม + กล่องสี่เหลี่ยมลายเส้น
       ดูเป็น "ศาลา/วิหาร" ⇒ ต้องมีหลังคาโค้ง + ประตูเข้า + ธงยอด ถึงจะอ่านออกว่าเป็นเต็นท์ */
    teach(){ const c = '#e0728f', d = dk(c), w = '#fff0f4';
      return '<path d="M32 12V4" stroke="' + d + '" stroke-width="2.6" stroke-linecap="round"/>'
           + G('<path d="M33 3l10 3.4-10 3.4z" fill="#ffd54f"/>', dk('#ffd54f'))
           + G('<path d="M32 11C19 15 9 23 7 31h50c-2-8-12-16-25-20z" fill="' + c + '"/>'
             + '<path d="M8 31h48v17c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="' + w + '"/>', d)
           + '<g fill="' + c + '"><path d="M14 31h8l-3 22h-5c-1 0-2-1-2-2z"/><path d="M29 31h7l-1 22h-6z"/><path d="M42 31h8l2 20c0 1-1 2-2 2h-5z"/></g>'
           + G('<path d="M25 53V41c0-4 3-7 7-7s7 3 7 7v12z" fill="' + dk(c, .45) + '"/>', d); },
    /* 🎀 ปลอกคอ */
    collar(){ const c = '#f06292', d = dk(c);
      return '<path d="M32 52c-14 0-24-10-24-22" fill="none" stroke="' + d + '" stroke-width="11" stroke-linecap="round"/>'
           + '<path d="M32 52c-14 0-24-10-24-22" fill="none" stroke="' + c + '" stroke-width="6.5" stroke-linecap="round"/>'
           + G('<circle cx="36" cy="50" r="8" fill="#ffd54f"/>', dk('#ffd54f'))
           + '<circle cx="36" cy="50" r="2.6" fill="' + dk('#ffd54f', .7) + '"/>'; },
    /* 🎁 ของรางวัล */
    gift(){ const c = '#e05252', d = dk(c), r = '#ffd54f';
      return G('<path d="M8 26h48v8H8z" fill="' + c + '"/><path d="M12 34h40v22H12z" fill="' + lt(c, .18) + '"/>', d)
           + '<path d="M28 26v30h8V26z" fill="' + r + '" stroke="' + dk(r) + '" stroke-width="2.4"/>'
           + G('<path d="M32 26c-8-2-14-6-14-11 0-3 3-5 6-4 4 1 7 7 8 15zM32 26c8-2 14-6 14-11 0-3-3-5-6-4-4 1-7 7-8 15z" fill="' + r + '"/>', dk(r)); },
    /* 🛒 ร้านค้า */
    shop(){ const c = '#f0a14b', d = dk(c);
      return G('<path d="M8 20h48l-4 12H12z" fill="' + c + '"/>'
             + '<path d="M12 32h40v24H12z" fill="' + lt(c, .3) + '"/>', d)
           + '<path d="M26 56V40h12v16z" fill="' + dk(c, .82) + '"/>'
           + '<path d="M8 20l4-10h40l4 10" fill="none" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>'; },
    /* 🖼️ อัลบั้มรูป */
    photo(){ const c = '#7fb6d9', d = dk(c);
      return G('<path d="M8 14h48v36H8z" fill="' + lt(c, .55) + '"/>', d)
           + '<path d="M12 42l12-14 8 9 7-7 13 12z" fill="' + c + '" stroke="' + d + '" stroke-width="2.4" stroke-linejoin="round"/>'
           + '<circle cx="22" cy="24" r="4" fill="#ffd54f" stroke="' + dk('#ffd54f') + '" stroke-width="2"/>'; },
    /* 🐛 แท็บสัตว์ในเมือง (ผีเสื้อ = สื่อ "สัตว์ตัวเล็กในเมือง") */
    critter(){ const c = '#f2a03d', d = dk(c);
      return G('<path d="M30 32C22 18 10 14 6 20s2 18 24 12zM34 32c8-14 20-18 24-12s-2 18-24 12z" fill="' + c + '"/>'
             + '<path d="M30 32C22 46 10 50 6 44s2-18 24-12zM34 32c8 14 20 18 24 12s-2-18-24-12z" fill="' + lt(c, .28) + '"/>', d)
           + '<path d="M32 20v26" stroke="' + dk(c, .7) + '" stroke-width="4" stroke-linecap="round"/>'
           + '<path d="M32 20l-6-8M32 20l6-8" stroke="' + dk(c, .7) + '" stroke-width="2.6" stroke-linecap="round"/>'; },

    /* 🌰 ถุงเมล็ดพันธุ์ (ต่างจากไอคอน "เมล็ดพืช" ที่เป็นอาหารสัตว์) */
    seedbag(){ const c = '#d9b06a', d = dk(c), g = '#5aa54f';
      return G('<path d="M18 24h28c2 8 4 14 4 20 0 7-6 12-18 12s-18-5-18-12c0-6 2-12 4-20z" fill="' + c + '"/>'
             + '<path d="M18 24c2-6 6-10 14-10s12 4 14 10z" fill="' + lt(c, .3) + '"/>', d)
           + '<g fill="' + dk(c, .78) + '"><circle cx="27" cy="40" r="3.4"/><circle cx="37" cy="38" r="3.4"/><circle cx="32" cy="48" r="3"/></g>'
           + '<path d="M32 14c0-6 4-9 8-9-1 5-3 8-8 9z" fill="' + g + '" stroke="' + dk(g) + '" stroke-width="2" stroke-linejoin="round"/>'; },
    /* 🪙 เหรียญ (ใน toast — บนหน้าจอปกติใช้ .hs-coin ของ CSS เหมือนเดิม) */
    coin(){ const c = '#ffcb3d', d = dk(c);
      return G('<circle cx="32" cy="32" r="22" fill="' + c + '"/>', d)
           + '<circle cx="32" cy="32" r="15" fill="' + lt(c, .35) + '" stroke="' + dk(c, .8) + '" stroke-width="2.4"/>'
           + '<path d="M32 22v20M26 27h9a4 4 0 0 1 0 8h-6a4 4 0 0 0 0 8h9" fill="none" stroke="' + dk(c, .68) + '" stroke-width="3.2" stroke-linecap="round"/>'; },
    /* ✅ เสร็จแล้ว / ❗ ยังไม่ทำ — ใช้ในรายการเควสต์กับสมุด */
    check(){ const c = '#5aa54f';
      return G('<circle cx="32" cy="32" r="24" fill="' + c + '"/>', dk(c))
           + '<path d="M20 33l9 9 16-18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'; },
    lock(){ const c = '#b3a58f', d = dk(c);
      return G('<path d="M14 28h36v26H14z" fill="' + c + '"/>', d)
           + '<path d="M22 28v-8c0-6 4-10 10-10s10 4 10 10v8" fill="none" stroke="' + d + '" stroke-width="5" stroke-linecap="round"/>'
           + '<circle cx="32" cy="40" r="4.5" fill="' + dk(c, .7) + '"/>'; },
  };
  /* 👤➕ สร้างตัวละครใหม่ — ใช้บนหน้าแรกแบบรวมร่าง (js/app-home2.js)
     เงาคนแบบเรียบๆ + ป้าย + มุมขวาล่าง (ห้ามใช้ emoji ตามกติกาไอคอนของโปรเจกต์) */
  REG['ui-newchar'] = ()=>{ const c = '#8fb8e0', d = dk(c), g = '#5aa54f';
    return G('<circle cx="28" cy="21" r="11" fill="' + c + '"/>'
           + '<path d="M8 54c0-11 9-19 20-19s20 8 20 19z" fill="' + lt(c, .22) + '"/>', d)
         + G('<circle cx="49" cy="47" r="13" fill="' + g + '"/>', dk(g))
         + '<path d="M49 40v14M42 47h14" fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/>'; };
  Object.keys(UI).forEach(id=>{ REG['ui-' + id] = UI[id]; });
  REG['ui-star'] = ()=>{
    let p2 = '';
    for(let i = 0; i < 10; i++){
      const a = -Math.PI/2 + i * Math.PI/5, rad = i % 2 ? 11 : 26;
      p2 += (i ? 'L' : 'M') + (32 + Math.cos(a) * rad).toFixed(1) + ' ' + (32 + Math.sin(a) * rad).toFixed(1);
    }
    return G('<path d="' + p2 + 'z" fill="#ffd54f"/>', dk('#ffd54f'));
  };
  REG['ui-alert'] = ()=> G('<path d="M32 6c3 0 5 2 5 5l-2 24c-.2 2-1.4 3-3 3s-2.8-1-3-3l-2-24c0-3 2-5 5-5z" fill="#ef5a5a"/>'
                          + '<circle cx="32" cy="50" r="5.4" fill="#ef5a5a"/>', dk('#ef5a5a'));
  REG['ui-board'] = ()=> G('<rect x="12" y="10" width="40" height="46" rx="5" fill="' + '#f6ead5' + '"/>'
                          + '<rect x="24" y="5" width="16" height="9" rx="3" fill="' + '#b9c3cb' + '"/>', dk('#c9a06a'))
                        + '<g stroke="' + dk('#c9a06a', .74) + '" stroke-width="3" stroke-linecap="round">'
                        + '<path d="M20 26h24M20 34h24M20 42h14"/></g>';

  /* ---------- แผนที่ emoji → id ไอคอน (แพ็กคลังโจทย์เติมเข้ามาทีหลัง) ---------- */
  const EMOJI_MAP = {};
  /* ⚠ emoji หลายตัวมี **variation selector U+FE0F** ต่อท้าย (➡️ ⚖️ ✏️ …) ซึ่งมองไม่เห็น
     ถ้าไม่ตัดทิ้งก่อนเทียบ การวนทีละ code point จะไม่มีวันตรงกับคีย์ในตาราง (เจอจริง 2026-08-20) */
  const VS = /\uFE0F/g;
  const ZWJ = '\u200D';
  function mapEmoji(map){ if(map) Object.keys(map).forEach(k=>{ EMOJI_MAP[k.replace(VS, '')] = map[k]; }); }
  const ESC = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'};
  const esc = t => String(t).replace(/[&<>"']/g, c => ESC[c]);
  /* 📝 แปลงข้อความที่มี emoji ปนอยู่ → HTML ที่ emoji ตัวที่มีไอคอนกลายเป็น SVG
     ⚠ **ตัวอักษรอื่นถูก escape ทั้งหมด** ⇒ ปลอดภัยแม้ข้อความมาจากผู้ใช้
     ⚠ emoji ที่ยังไม่มีไอคอน **ปล่อยไว้เป็น emoji เดิม** (กติกาข้อ 1 ห้ามพัง ห้ามหาย) */
  /* แยกข้อความเป็นชิ้นๆ: {e:id ไอคอน} หรือ {t:ข้อความ}
     ⚠ **ห้ามแตะตัวที่อยู่ในลำดับ ZWJ** (👩‍🏫 👨‍👩‍👧) — แทนแค่บางส่วนแล้วรูปจะพัง */
  function parts(str){
    const cp = [...String(str == null ? '' : str)];
    const out = [];
    for(let i = 0; i < cp.length; i++){
      const ch = cp[i];
      if(ch === '\uFE0F') continue;                       /* ตัวปรับรูป มองไม่เห็น ตัดทิ้งได้ */
      const nextVS = cp[i + 1] === '\uFE0F';
      const after  = cp[i + (nextVS ? 2 : 1)];
      const inZwj  = after === ZWJ || cp[i - 1] === ZWJ
                   || (nextVS && cp[i + 2] === ZWJ);
      const id = EMOJI_MAP[ch];
      if(id && REG[id] && !inZwj) out.push({e:id});
      else out.push({t:ch});
    }
    return out;
  }
  function text(str, size){
    const ps = parts(str);
    let out = '', buf = '';
    ps.forEach(p=>{
      if(p.e){
        if(buf){ out += esc(buf); buf = ''; }
        out += '<span class="oi">' + html(p.e, size || 30) + '</span>';
      }else buf += p.t;
    });
    return out + (buf ? esc(buf) : '');
  }
  /* มี emoji ที่แปลงได้อย่างน้อย 1 ตัวไหม — ผู้เรียกใช้ตัดสินว่าจะเปลี่ยนเป็น innerHTML หรือคงเดิม */
  function hasEmoji(str){ return parts(str).some(p => !!p.e); }

  window.OwlIcons = {
    html, htmlOr, svgUri, add, addAll, mapEmoji, text, hasEmoji,
    emojiId: ch => EMOJI_MAP[ch] || '',
    has: id => !!REG[id], ids: ()=> Object.keys(REG),
    _reg: REG, _dk: dk, _lt: lt, _eye: eye, _G: G,
  };
  /* ชื่อเดิมที่โค้ดโหมดบ้านเรียกอยู่ — ต้องชี้ไปที่ตัวเดียวกัน */
  window.HouseIcons = window.OwlIcons;
})();
