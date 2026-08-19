/* ============================================================
   🧩 แพ็กไอคอน "คลังโจทย์" — เฟส D+E ของ ICON-PLAN.md
   โหลดคู่กับหน้าหลัก (ต่อจาก js/shared/icons.js) แล้วลงทะเบียนเข้าแกนกลาง

   🔑 หลักการเดียวกับแพ็กอื่น: **ทรงร่วม + สี** ไม่ได้วาดทีละตัว
      (สี×ทรง 30+ ตัว · ลูกศร 8 ทิศ · เครื่องหมายคณิต · ผลไม้ทรงกลม 8 ชนิด สร้างจากโรงงานเดียว)

   🔒 ขอบเขตที่ตั้งใจ (ตัดสินใจ 2026-08-20 · บันทึกเหตุผลไว้ใน ICON-PLAN.md)
   - แปลง emoji เป็นไอคอนเฉพาะจุดที่ **emoji คือ "ของที่เด็กต้องดูแล้วรู้ว่าคืออะไร"**
     (รูปประกอบโจทย์ · เงาปริศนา · ของบนป้ายเลือกข้าง · ของในเกมนกฮูกสั่ง)
   - **ไม่แตะข้อความบนปุ่มตัวเลือก** — ข้อความนั้นคือ "เฉลย" ที่ระบบใช้เทียบคำตอบ
     เปลี่ยนเป็นรูปแล้วความถูกต้องของเกมจะไปผูกกับว่ามีไอคอนครบหรือไม่ = แลกไม่คุ้ม
   - emoji ที่ยังไม่มีไอคอน **ยังแสดงเป็น emoji เหมือนเดิม** (`OwlIcons.text` ปล่อยผ่าน)
   ============================================================ */
(function(){
  'use strict';
  const CORE = window.OwlIcons;
  if(!CORE) return;                       /* ไม่มีแกนกลาง = ไม่ต้องทำอะไร (หน้ายังใช้ emoji ได้ปกติ) */
  const dk = CORE._dk, lt = CORE._lt, eye = CORE._eye, G = CORE._G;
  const R = {};                            /* id → ฟังก์ชันวาด */

  /* ---------- 🎨 โรงงานทรงเรขาคณิต (สี × ทรง) ---------- */
  const COL = {
    red:'#ef4d4d', blue:'#4d8fef', green:'#5fbb5f', yellow:'#ffd23d', orange:'#ff9a3d',
    purple:'#a86fe0', brown:'#a9784a', black:'#4a4a4a', white:'#fdfaf3', pink:'#f48fb1',
  };
  function shapeIcon(kind, c){
    const d = dk(c);
    if(kind === 'circle') return G('<circle cx="32" cy="32" r="23" fill="' + c + '"/>', d);
    if(kind === 'ring')   return '<circle cx="32" cy="32" r="20" fill="none" stroke="' + c + '" stroke-width="9"/>';
    if(kind === 'square') return G('<rect x="10" y="10" width="44" height="44" rx="6" fill="' + c + '"/>', d);
    if(kind === 'tri')    return G('<path d="M32 8 56 52H8z" fill="' + c + '"/>', d);
    if(kind === 'tridown')return G('<path d="M32 56 8 12h48z" fill="' + c + '"/>', d);
    if(kind === 'diamond')return G('<path d="M32 6 56 32 32 58 8 32z" fill="' + c + '"/>', d);
    if(kind === 'heart')  return G('<path d="M32 54C14 42 8 34 8 25c0-7 5-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 7 0 12 5 12 12 0 9-6 17-24 29z" fill="' + c + '"/>', d);
    if(kind === 'star'){
      let p = '';
      for(let i = 0; i < 10; i++){
        const a = -Math.PI/2 + i * Math.PI/5, rad = i % 2 ? 11 : 26;
        p += (i ? 'L' : 'M') + (32 + Math.cos(a) * rad).toFixed(1) + ' ' + (32 + Math.sin(a) * rad).toFixed(1);
      }
      return G('<path d="' + p + 'z" fill="' + c + '"/>', d);
    }
    return '';
  }
  [['circle','🔴','red'],['circle','🔵','blue'],['circle','🟢','green'],['circle','🟡','yellow'],
   ['circle','🟠','orange'],['circle','🟣','purple'],['circle','🟤','brown'],['circle','⚫','black'],
   ['circle','⚪','white'],['square','🟥','red'],['square','🟦','blue'],['square','🟩','green'],
   ['square','🟨','yellow'],['square','⬛','black'],['square','⬜','white'],['tri','🔺','red'],
   ['tridown','🔻','red'],['ring','⭕','red'],['diamond','🔶','orange'],['diamond','🔷','blue'],
   ['heart','❤️','red'],['heart','💛','yellow'],['heart','💚','green'],['heart','💙','blue'],
   ['heart','💜','purple'],['star','⭐','yellow'],['star','🌟','yellow'],
  ].forEach(([k, e, c])=>{ R['q-' + k + '-' + c] = ()=> shapeIcon(k, COL[c]); });

  /* ---------- ➡️ ลูกศร 8 ทิศ (หมุนจากทรงเดียว) ---------- */
  function arrow(deg, c){
    const col = c || '#4d8fef';
    return '<g transform="rotate(' + deg + ' 32 32)">'
         + G('<path d="M6 26h26V14l26 18-26 18V38H6z" fill="' + col + '"/>', dk(col)) + '</g>';
  }
  [['➡️',0],['⬇️',90],['⬅️',180],['⬆️',270],['↗️',-45],['↘️',45],['↙️',135],['↖️',225]]
    .forEach(([e, d])=>{ R['q-arrow-' + d] = ()=> arrow(d); });
  /* 🔁🔄 ลูกศรวน */
  R['q-loop'] = ()=> '<path d="M14 32a18 18 0 1 1 6 13" fill="none" stroke="' + dk('#4d8fef') + '" stroke-width="9" stroke-linecap="round"/>'
                   + '<path d="M14 32a18 18 0 1 1 6 13" fill="none" stroke="#4d8fef" stroke-width="5.5" stroke-linecap="round"/>'
                   + G('<path d="M8 20l12 2-4 12z" fill="#4d8fef"/>', dk('#4d8fef'));

  /* ---------- ➕ เครื่องหมายคณิต ---------- */
  const sym = (path, c, w)=> '<path d="' + path + '" stroke="' + c + '" stroke-width="' + (w || 10)
                           + '" stroke-linecap="round" fill="none"/>';
  R['q-plus']  = ()=> sym('M32 14v36M14 32h36', '#5fbb5f');
  R['q-minus'] = ()=> sym('M14 32h36', '#ef4d4d');
  R['q-times'] = ()=> sym('M17 17l30 30M47 17L17 47', '#a86fe0');
  R['q-divide']= ()=> sym('M14 32h36', '#ff9a3d') + '<g fill="#ff9a3d"><circle cx="32" cy="18" r="5"/><circle cx="32" cy="46" r="5"/></g>';
  R['q-equal'] = ()=> sym('M14 24h36M14 40h36', '#4d8fef');
  R['q-num']   = ()=> G('<rect x="8" y="8" width="48" height="48" rx="9" fill="#cfe0f5"/>', dk('#4d8fef'))
                    + '<g fill="' + dk('#4d8fef', .8) + '" font-family="sans-serif"></g>'
                    + sym('M22 20v24M22 20l-5 4', dk('#4d8fef'), 5)
                    + sym('M36 20h8a4 4 0 0 1 0 10h-6h6a5 5 0 0 1 0 12h-8', dk('#4d8fef'), 5);
  R['q-abc']   = ()=> G('<rect x="8" y="8" width="48" height="48" rx="9" fill="#ffe0b8"/>', dk('#ff9a3d'))
                    + sym('M18 44l7-22 7 22M20 37h10', dk('#ff9a3d'), 4.5)
                    + sym('M40 22v22h6a6 6 0 0 0 0-11h-6h6a5.5 5.5 0 0 0 0-11z', dk('#ff9a3d'), 4.5);

  /* ---------- 🍎 ผลไม้ทรงกลม (สี + ใบ) ---------- */
  function fruit(c, o){
    o = o || {};
    const d = dk(c);
    return G('<path d="M32 18c9 0 18 7 18 19s-8 19-18 19-18-7-18-19 9-19 18-19z" fill="' + c + '"/>', d)
         + '<path d="M32 18V8" stroke="' + dk('#7a5a3a') + '" stroke-width="3.4" stroke-linecap="round"/>'
         + G('<path d="M33 12c6-6 13-5 16-3-2 6-9 9-16 6z" fill="#5fbb5f"/>', dk('#5fbb5f'))
         + (o.spot ? '<g fill="' + lt(c, .45) + '"><circle cx="24" cy="30" r="2.6"/><circle cx="40" cy="36" r="2.2"/></g>' : '');
  }
  [['🍎','#ef4d4d'],['🍊','#ff9a3d'],['🍑','#f9a08a'],['🍏','#8fce5a'],['🍅','#e4574a']]
    .forEach(([e, c], i)=>{ R['q-fruit-' + i] = ()=> fruit(c); });
  R['q-banana'] = ()=> G('<path d="M12 26c0 18 14 28 30 26 6-1 10-4 10-7 0-2-2-3-5-3-14 2-25-7-25-20 0-3-2-5-5-5s-5 3-5 9z" fill="#ffd23d"/>', dk('#ffd23d'));
  R['q-grape']  = ()=> G('<g fill="#a86fe0"><circle cx="32" cy="24" r="8"/><circle cx="22" cy="34" r="8"/>'
                        + '<circle cx="42" cy="34" r="8"/><circle cx="32" cy="42" r="8"/><circle cx="32" cy="54" r="7"/></g>', dk('#a86fe0'))
                      + '<path d="M32 16V8" stroke="' + dk('#7a5a3a') + '" stroke-width="3" stroke-linecap="round"/>';
  R['q-melon']  = ()=> G('<circle cx="32" cy="34" r="22" fill="#5fbb5f"/>', dk('#5fbb5f'))
                      + '<g stroke="' + lt('#5fbb5f', .5) + '" stroke-width="3.4" fill="none"><path d="M20 16c-4 10-4 26 0 36M44 16c4 10 4 26 0 36M10 34h44"/></g>';
  R['q-straw']  = ()=> G('<path d="M32 56c-12-4-20-14-20-24 0-6 4-10 9-10 4 0 8 2 11 5 3-3 7-5 11-5 5 0 9 4 9 10 0 10-8 20-20 24z" fill="#ef4d4d"/>', dk('#ef4d4d'))
                      + '<g fill="#fff8e0"><circle cx="26" cy="34" r="2"/><circle cx="38" cy="34" r="2"/><circle cx="32" cy="44" r="2"/></g>'
                      + G('<path d="M24 18c4-4 12-4 16 0-4 3-12 3-16 0z" fill="#5fbb5f"/>', dk('#5fbb5f'));

  /* ---------- 🌳 ธรรมชาติ ---------- */
  const trunk = '<path d="M32 56V38" stroke="' + dk('#a9784a') + '" stroke-width="8" stroke-linecap="round"/>'
              + '<path d="M32 56V38" stroke="#a9784a" stroke-width="5" stroke-linecap="round"/>';
  R['q-tree']   = ()=> trunk + G('<circle cx="32" cy="26" r="18" fill="#5fbb5f"/>', dk('#5fbb5f'));
  R['q-plant']  = ()=> G('<path d="M32 56V26" stroke="' + dk('#5fbb5f') + '" stroke-width="5" stroke-linecap="round" fill="none"/>'
                        + '<path d="M32 34c-11-2-16-9-16-16 10-2 16 5 16 16zM32 30c11-2 16-9 16-16-10-2-16 5-16 16z" fill="#5fbb5f"/>', dk('#5fbb5f'));
  R['q-leaf']   = ()=> G('<path d="M52 10C24 10 10 26 10 44c0 4 2 8 4 10 16-2 40-14 38-44z" fill="#5fbb5f"/>', dk('#5fbb5f'))
                      + '<path d="M14 54C24 40 36 26 50 14" stroke="' + dk('#5fbb5f', .7) + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  R['q-flower'] = ()=> '<path d="M32 56V36" stroke="' + dk('#5fbb5f') + '" stroke-width="4" stroke-linecap="round"/>'
                      + G('<g fill="#f48fb1"><circle cx="32" cy="14" r="9"/><circle cx="46" cy="24" r="9"/>'
                        + '<circle cx="41" cy="40" r="9"/><circle cx="23" cy="40" r="9"/><circle cx="18" cy="24" r="9"/></g>', dk('#f48fb1'))
                      + G('<circle cx="32" cy="28" r="7" fill="#ffd23d"/>', dk('#ffd23d'));
  R['q-sun']    = ()=> (function(){ let p = '';
      for(let i = 0; i < 8; i++){ const a = i / 8 * Math.PI * 2;
        p += '<path d="M' + (32 + Math.cos(a) * 22).toFixed(1) + ' ' + (32 + Math.sin(a) * 22).toFixed(1)
           + 'L' + (32 + Math.cos(a) * 30).toFixed(1) + ' ' + (32 + Math.sin(a) * 30).toFixed(1) + '"/>'; }
      return '<g stroke="' + dk('#ffd23d') + '" stroke-width="5" stroke-linecap="round">' + p + '</g>'; })()
                      + G('<circle cx="32" cy="32" r="16" fill="#ffd23d"/>', dk('#ffd23d'));
  R['q-moon']   = ()=> G('<path d="M40 8A22 22 0 1 0 40 52A26 26 0 0 1 40 8z" fill="#ffe58a"/>', dk('#ffe58a'));
  R['q-cloud']  = ()=> G('<path d="M16 46c-6 0-11-5-11-11s5-11 11-11c2-8 9-13 17-13s15 5 17 13c6 0 11 5 11 11s-5 11-11 11z" fill="#dff0fa"/>', dk('#9fd8ee'));
  R['q-rain']   = ()=> R['q-cloud']() + '<g stroke="#4d8fef" stroke-width="4" stroke-linecap="round"><path d="M22 50v8M32 52v8M42 50v8"/></g>';
  R['q-drop']   = ()=> G('<path d="M32 6c10 14 16 22 16 30 0 10-7 16-16 16s-16-6-16-16c0-8 6-16 16-30z" fill="#4fb0e0"/>', dk('#4fb0e0'))
                      + '<ellipse cx="25" cy="38" rx="4" ry="6" fill="#fff" opacity=".45"/>';
  R['q-wave']   = ()=> '<g stroke="#4fb0e0" stroke-width="6" stroke-linecap="round" fill="none">'
                      + '<path d="M6 24c8-8 16-8 24 0s16 8 24 0M6 40c8-8 16-8 24 0s16 8 24 0"/></g>';
  R['q-fire']   = ()=> G('<path d="M32 6c10 12 16 18 16 28 0 11-7 18-16 18s-16-7-16-18c0-8 6-16 16-28z" fill="#ff7a3d"/>', dk('#ef4d4d'))
                      + '<path d="M32 26c5 7 8 11 8 16 0 6-4 10-8 10s-8-4-8-10c0-5 3-9 8-16z" fill="#ffd23d"/>';
  R['q-rainbow']= ()=> ['#ef4d4d','#ff9a3d','#ffd23d','#5fbb5f','#4d8fef','#a86fe0'].map((c, i)=>
                      '<path d="M' + (6 + i * 4) + ' 52a' + (26 - i * 4) + ' ' + (26 - i * 4) + ' 0 0 1 ' + (52 - i * 8)
                      + ' 0" fill="none" stroke="' + c + '" stroke-width="4.4"/>').join('');

  /* ---------- 📚 ของใช้ในห้องเรียน ---------- */
  R['q-books']  = ()=> G('<rect x="10" y="18" width="12" height="38" rx="2" fill="#ef4d4d"/>'
                        + '<rect x="24" y="12" width="12" height="44" rx="2" fill="#4d8fef"/>'
                        + '<rect x="38" y="22" width="14" height="34" rx="2" fill="#5fbb5f"/>', dk('#a9784a'));
  R['q-book1']  = ()=> G('<path d="M10 12h20c4 0 6 2 6 6v34H16c-4 0-6-2-6-6z" fill="#ff9a3d"/>'
                        + '<path d="M54 12H34c-4 0-6 2-6 6v34h20c4 0 6-2 6-6z" fill="#ffd23d"/>', dk('#a9784a'));
  R['q-pencil'] = ()=> G('<path d="M14 50l6-14L44 12l10 10-24 24z" fill="#ffd23d"/>'
                        + '<path d="M44 12l10 10 4-4c2-2 2-5 0-7l-3-3c-2-2-5-2-7 0z" fill="#f48fb1"/>'
                        + '<path d="M14 50l-4 6 6-4z" fill="#4a4a4a"/>', dk('#a9784a'));
  R['q-ruler']  = ()=> G('<rect x="6" y="24" width="52" height="16" rx="3" fill="#ffd23d" transform="rotate(-12 32 32)"/>', dk('#ffd23d'))
                      + '<g stroke="' + dk('#ffd23d', .7) + '" stroke-width="2.4" transform="rotate(-12 32 32)"><path d="M16 24v6M26 24v9M36 24v6M46 24v9"/></g>';
  R['q-bag']    = ()=> G('<path d="M12 26c0-6 5-10 20-10s20 4 20 10v24c0 4-3 6-6 6H18c-3 0-6-2-6-6z" fill="#ef4d4d"/>'
                        + '<path d="M22 20c0-6 4-10 10-10s10 4 10 10" fill="none"/>', dk('#ef4d4d'))
                      + G('<rect x="20" y="34" width="24" height="14" rx="3" fill="#ffd23d"/>', dk('#ef4d4d'));
  R['q-note']   = ()=> G('<rect x="12" y="8" width="40" height="48" rx="4" fill="#fdfaf3"/>', dk('#a9784a'))
                      + '<g stroke="#9fc4e8" stroke-width="2.4" stroke-linecap="round"><path d="M20 22h24M20 32h24M20 42h16"/></g>'
                      + '<path d="M20 8v48" stroke="#ef8b7a" stroke-width="2.4"/>';
  R['q-scissors']= ()=> '<g stroke="' + dk('#b9c3cb') + '" stroke-width="5" stroke-linecap="round"><path d="M18 12l26 30M46 12L20 42"/></g>'
                      + G('<circle cx="20" cy="50" r="7" fill="#ef4d4d"/><circle cx="44" cy="50" r="7" fill="#ef4d4d"/>', dk('#ef4d4d'));
  R['q-clock']  = ()=> G('<circle cx="32" cy="34" r="23" fill="#fdfaf3"/>', dk('#a9784a'))
                      + '<path d="M32 34V20M32 34l10 6" stroke="' + dk('#a9784a', .7) + '" stroke-width="3.6" stroke-linecap="round"/>'
                      + '<circle cx="32" cy="34" r="2.6" fill="' + dk('#a9784a', .6) + '"/>';
  R['q-box']    = ()=> G('<path d="M8 22h48v30c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="#c9a06a"/>'
                        + '<rect x="6" y="14" width="52" height="10" rx="3" fill="#e0b878"/>', dk('#a9784a'))
                      + '<path d="M32 24v33" stroke="' + dk('#a9784a', .8) + '" stroke-width="3"/>';
  R['q-glass']  = ()=> '<g stroke="' + dk('#7f8b96') + '" stroke-width="6" stroke-linecap="round"><path d="M40 40l14 14"/></g>'
                      + G('<circle cx="26" cy="26" r="17" fill="#cfe8f5"/>', dk('#7f8b96'));
  R['q-map']    = ()=> G('<path d="M6 16l16-6 20 6 16-6v42l-16 6-20-6-16 6z" fill="#dff0d8"/>', dk('#5fbb5f'))
                      + '<path d="M22 10v42M42 16v42" stroke="' + dk('#5fbb5f', .7) + '" stroke-width="2.6"/>';
  R['q-cal']    = ()=> G('<rect x="8" y="12" width="48" height="44" rx="5" fill="#fdfaf3"/>'
                        + '<path d="M8 17c0-3 2-5 5-5h38c3 0 5 2 5 5v8H8z" fill="#ef4d4d"/>', dk('#a9784a'))
                      + '<g fill="' + dk('#a9784a', .55) + '"><circle cx="20" cy="36" r="3.4"/><circle cx="32" cy="36" r="3.4"/>'
                      + '<circle cx="44" cy="36" r="3.4"/><circle cx="20" cy="47" r="3.4"/><circle cx="32" cy="47" r="3.4"/></g>';
  R['q-bulb']   = ()=> G('<path d="M32 6c10 0 17 8 17 17 0 7-5 11-7 15H22c-2-4-7-8-7-15 0-9 7-17 17-17z" fill="#ffe58a"/>', dk('#ffd23d'))
                      + G('<rect x="24" y="40" width="16" height="12" rx="3" fill="#b9c3cb"/>', dk('#b9c3cb'))
                      + '<path d="M26 56h12" stroke="' + dk('#b9c3cb') + '" stroke-width="3.4" stroke-linecap="round"/>';
  R['q-chart']  = ()=> G('<rect x="8" y="10" width="48" height="44" rx="5" fill="#fdfaf3"/>', dk('#a9784a'))
                      + '<g fill="#4d8fef"><rect x="16" y="32" width="8" height="16" rx="2"/><rect x="28" y="22" width="8" height="26" rx="2"/>'
                      + '<rect x="40" y="27" width="8" height="21" rx="2"/></g>';
  R['q-line']   = ()=> G('<rect x="8" y="10" width="48" height="44" rx="5" fill="#fdfaf3"/>', dk('#a9784a'))
                      + '<path d="M16 44l10-12 10 7 12-17" fill="none" stroke="#ef4d4d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
  R['q-pie']    = ()=> G('<circle cx="32" cy="32" r="22" fill="#ffd23d"/>', dk('#a9784a'))
                      + G('<path d="M32 32V10a22 22 0 0 1 19 11z" fill="#4d8fef"/>', dk('#a9784a'));
  R['q-palette']= ()=> G('<path d="M32 8c14 0 25 9 25 20 0 7-6 9-11 9h-5c-4 0-6 2-6 5 0 4 3 5 3 8s-3 6-8 6C18 56 7 45 7 30 7 17 18 8 32 8z" fill="#f6ead5"/>', dk('#a9784a'))
                      + '<g><circle cx="20" cy="24" r="4.4" fill="#ef4d4d"/><circle cx="30" cy="17" r="4.4" fill="#ffd23d"/>'
                      + '<circle cx="42" cy="19" r="4.4" fill="#4d8fef"/><circle cx="17" cy="37" r="4.4" fill="#5fbb5f"/></g>';

  /* ---------- 🍽️ อาหาร/ของใช้ ---------- */
  R['q-plate']  = ()=> G('<circle cx="32" cy="32" r="23" fill="#fdfaf3"/>', dk('#b9c3cb'))
                      + '<circle cx="32" cy="32" r="13" fill="none" stroke="' + dk('#b9c3cb', .8) + '" stroke-width="2.6"/>';
  R['q-milk']   = ()=> G('<path d="M20 20h24v30c0 4-3 6-7 6h-10c-4 0-7-2-7-6z" fill="#fdfaf3"/>'
                        + '<path d="M24 8h16v12H24z" fill="#dff0fa"/>', dk('#9fd8ee'));
  R['q-juice']  = ()=> G('<path d="M18 18h28l-4 32c-.4 4-3 6-7 6h-6c-4 0-6.6-2-7-6z" fill="#ff9a3d"/>', dk('#ff9a3d'))
                      + '<path d="M40 14l8-8" stroke="' + dk('#ef4d4d') + '" stroke-width="4" stroke-linecap="round"/>';
  R['q-egg']    = ()=> G('<path d="M32 8c11 0 18 16 18 27s-8 19-18 19-18-8-18-19S21 8 32 8z" fill="#fdfaf3"/>', dk('#e0c8a0'));
  R['q-ice']    = ()=> G('<rect x="12" y="12" width="40" height="40" rx="7" fill="#cfe8f5"/>', dk('#9fd8ee'))
                      + '<path d="M20 24h10M20 34h16" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>';
  R['q-rice']   = ()=> G('<path d="M10 30h44c0 13-10 22-22 22s-22-9-22-22z" fill="#fdfaf3"/>'
                        + '<path d="M8 28h48v5H8z" fill="#e0c8a0"/>', dk('#b9c3cb'));
  R['q-cookie'] = ()=> G('<circle cx="32" cy="32" r="22" fill="#d9a86c"/>', dk('#a9784a'))
                      + '<g fill="' + dk('#7a5a3a') + '"><circle cx="24" cy="26" r="3.4"/><circle cx="40" cy="30" r="3.4"/>'
                      + '<circle cx="30" cy="40" r="3.4"/><circle cx="42" cy="42" r="2.8"/></g>';
  R['q-candy']  = ()=> G('<circle cx="32" cy="32" r="14" fill="#f48fb1"/>'
                        + '<path d="M18 32L6 22v20zM46 32l12-10v20z" fill="#f48fb1"/>', dk('#f48fb1'))
                      + '<path d="M26 26c4 4 8 8 12 12" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".7"/>';
  R['q-icecream']=()=> G('<path d="M32 56 18 30h28z" fill="#e0b878"/>', dk('#a9784a'))
                      + G('<circle cx="24" cy="26" r="10" fill="#f48fb1"/><circle cx="40" cy="26" r="10" fill="#fdfaf3"/>'
                        + '<circle cx="32" cy="18" r="10" fill="#ffd23d"/>', dk('#a9784a'));

  /* ---------- 🏠 สถานที่/สิ่งของ ---------- */
  R['q-home']   = ()=> G('<path d="M32 8 58 30H6z" fill="#ef4d4d"/>', dk('#ef4d4d'))
                      + G('<rect x="14" y="30" width="36" height="26" rx="3" fill="#f6ead5"/>', dk('#a9784a'))
                      + G('<rect x="27" y="40" width="12" height="16" rx="2" fill="#a9784a"/>', dk('#a9784a'));
  R['q-school'] = ()=> G('<path d="M32 6 58 20H6z" fill="#4d8fef"/>', dk('#4d8fef'))
                      + G('<rect x="12" y="20" width="40" height="36" rx="3" fill="#f6ead5"/>', dk('#a9784a'))
                      + G('<rect x="26" y="38" width="12" height="18" rx="2" fill="#ef4d4d"/>', dk('#a9784a'));
  R['q-car']    = ()=> G('<path d="M8 40c0-4 3-8 8-9l6-10c1-3 4-5 7-5h14c3 0 6 2 7 5l6 10c5 1 8 5 8 9v6H8z" fill="#ef4d4d"/>', dk('#ef4d4d'))
                      + '<g fill="#cfe8f5" stroke="' + dk('#ef4d4d') + '" stroke-width="2"><rect x="20" y="22" width="10" height="9" rx="2"/><rect x="34" y="22" width="10" height="9" rx="2"/></g>'
                      + G('<circle cx="19" cy="48" r="7" fill="#4a4a4a"/><circle cx="45" cy="48" r="7" fill="#4a4a4a"/>', '#2e2e2e');
  R['q-bus']    = ()=> G('<rect x="6" y="12" width="52" height="34" rx="6" fill="#ffd23d"/>', dk('#ffd23d'))
                      + '<g fill="#cfe8f5" stroke="' + dk('#ffd23d') + '" stroke-width="2"><rect x="12" y="18" width="12" height="10" rx="2"/><rect x="28" y="18" width="12" height="10" rx="2"/><rect x="44" y="18" width="8" height="10" rx="2"/></g>'
                      + G('<circle cx="18" cy="48" r="6.5" fill="#4a4a4a"/><circle cx="46" cy="48" r="6.5" fill="#4a4a4a"/>', '#2e2e2e');
  R['q-bike']   = ()=> '<g stroke="' + dk('#4d8fef') + '" stroke-width="4" fill="none" stroke-linecap="round">'
                      + '<circle cx="16" cy="42" r="12"/><circle cx="48" cy="42" r="12"/>'
                      + '<path d="M16 42l10-18h12l10 18M26 24h14M38 24l-8 18"/></g>';
  R['q-ball']   = ()=> G('<circle cx="32" cy="32" r="22" fill="#fdfaf3"/>', '#4a4a4a')
                      + '<g fill="#4a4a4a"><path d="M32 18l9 6-3 11h-12l-3-11z"/></g>';
  R['q-balloon']= ()=> G('<ellipse cx="32" cy="26" rx="17" ry="20" fill="#ef4d4d"/>'
                        + '<path d="M29 46h6l-3 5z" fill="' + dk('#ef4d4d', .8) + '"/>', dk('#ef4d4d'))
                      + '<path d="M32 51c-5 3 5 6 0 10" stroke="' + dk('#b9c3cb') + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  R['q-coin2']  = ()=> G('<circle cx="32" cy="32" r="22" fill="#ffd23d"/>', dk('#ffd23d'))
                      + '<circle cx="32" cy="32" r="14" fill="none" stroke="' + dk('#ffd23d', .75) + '" stroke-width="3"/>';
  R['q-target'] = ()=> G('<circle cx="32" cy="32" r="24" fill="#ef4d4d"/>', dk('#ef4d4d'))
                      + G('<circle cx="32" cy="32" r="15" fill="#fdfaf3"/>', dk('#ef4d4d'))
                      + G('<circle cx="32" cy="32" r="6" fill="#ef4d4d"/>', dk('#ef4d4d'));
  R['q-scale']  = ()=> '<path d="M32 12v34M14 52h36" stroke="' + dk('#b9c3cb') + '" stroke-width="5" stroke-linecap="round"/>'
                      + '<path d="M10 20h44" stroke="' + dk('#b9c3cb') + '" stroke-width="4" stroke-linecap="round"/>'
                      + G('<path d="M2 22h16l-8 12zM46 22h16l-8 12z" fill="#cfe8f5"/>', dk('#b9c3cb'));
  R['q-magnet'] = ()=> G('<path d="M14 46V30a18 18 0 0 1 36 0v16H38V30a6 6 0 0 0-12 0v16z" fill="#ef4d4d"/>', dk('#ef4d4d'))
                      + G('<rect x="14" y="44" width="12" height="10" fill="#b9c3cb"/><rect x="38" y="44" width="12" height="10" fill="#b9c3cb"/>', dk('#b9c3cb'));

  /* ---------- ลงทะเบียน + แผนที่ emoji ---------- */
  CORE.addAll(R);
  CORE.mapEmoji({
    '🔴':'q-circle-red', '🔵':'q-circle-blue', '🟢':'q-circle-green', '🟡':'q-circle-yellow',
    '🟠':'q-circle-orange', '🟣':'q-circle-purple', '🟤':'q-circle-brown', '⚫':'q-circle-black',
    '⚪':'q-circle-white', '🟥':'q-square-red', '🟦':'q-square-blue', '🟩':'q-square-green',
    '🟨':'q-square-yellow', '⬛':'q-square-black', '⬜':'q-square-white',
    '🔺':'q-tri-red', '🔻':'q-tridown-red', '⭕':'q-ring-red', '🔶':'q-diamond-orange', '🔷':'q-diamond-blue',
    '❤️':'q-heart-red', '💛':'q-heart-yellow', '💚':'q-heart-green', '💙':'q-heart-blue', '💜':'q-heart-purple',
    '⭐':'q-star-yellow', '🌟':'q-star-yellow',
    '➡️':'q-arrow-0', '⬇️':'q-arrow-90', '⬅️':'q-arrow-180', '⬆️':'q-arrow-270',
    '↗️':'q-arrow--45', '↘️':'q-arrow-45', '↙️':'q-arrow-135', '↖️':'q-arrow-225',
    '🔁':'q-loop', '🔄':'q-loop',
    '➕':'q-plus', '➖':'q-minus', '✖️':'q-times', '➗':'q-divide', '🟰':'q-equal',
    '🔢':'q-num', '🔤':'q-abc',
    '🍎':'q-fruit-0', '🍊':'q-fruit-1', '🍑':'q-fruit-2', '🍏':'q-fruit-3', '🍅':'q-fruit-4',
    '🍌':'q-banana', '🍇':'q-grape', '🍉':'q-melon', '🍓':'q-straw',
    '🌳':'q-tree', '🌲':'q-tree', '🌱':'q-plant', '🌿':'q-leaf', '🍃':'q-leaf',
    '🌸':'q-flower', '🌷':'q-flower', '🌼':'q-flower', '🌻':'q-flower',
    '☀️':'q-sun', '🌞':'q-sun', '🌙':'q-moon', '☁️':'q-cloud', '🌧️':'q-rain',
    '💧':'q-drop', '🌊':'q-wave', '🔥':'q-fire', '🌈':'q-rainbow',
    '📚':'q-books', '📖':'q-book1', '📘':'q-book1', '📙':'q-book1', '📗':'q-book1',
    '✏️':'q-pencil', '📏':'q-ruler', '📐':'q-ruler', '🎒':'q-bag', '📝':'q-note',
    '✂️':'q-scissors', '⏰':'q-clock', '🕐':'q-clock', '⏱️':'q-clock',
    '📦':'q-box', '🔍':'q-glass', '🗺️':'q-map', '📅':'q-cal', '🗓️':'q-cal',
    '💡':'q-bulb', '📊':'q-chart', '📈':'q-line', '📉':'q-line', '🥧':'q-pie', '🎨':'q-palette',
    '🍽️':'q-plate', '🥛':'q-milk', '🥤':'q-juice', '🥚':'q-egg', '🧊':'q-ice',
    '🍚':'q-rice', '🍪':'q-cookie', '🍬':'q-candy', '🍦':'q-icecream',
    '🏠':'q-home', '🏡':'q-home', '🏫':'q-school', '🚗':'q-car', '🚌':'q-bus', '🚲':'q-bike',
    '⚽':'q-ball', '🎈':'q-balloon', '🪙':'q-coin2', '💰':'q-coin2', '🎯':'q-target',
    '⚖️':'q-scale', '🧲':'q-magnet',
  });
})();
