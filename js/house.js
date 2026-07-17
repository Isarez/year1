/* ============================================================
   บ้านของหนู (My House) — เฟส 1: สร้างตัวละคร 3D + แผนที่นอกบ้าน + เข้าบ้าน
   ใช้ Three.js (self-host js/vendor/three.min.js, โหลดก่อไฟล์นี้ใน index.html)
   สไตล์ blocky/voxel + MeshToonMaterial กล้อง isometric fixed-angle
   canvas โปร่งใส ให้เห็นท้องฟ้ากลางวัน/กลางคืนของธีมแอปจริงด้านหลัง
   ข้อมูลเก็บ localStorage key p1quiz_house_<childId> (ผูกต่อเด็กแต่ละคน
   สลับเด็กแล้วโหลดตัวละคร/บ้านของคนนั้นใหม่เสมอ) และแนบไปกับ export/import ใน app.js
   ไฟล์นี้โหลดหลัง app.js — ใช้ตัวแปร global ของ app.js ($, playClick, showToast,
   activeChild, homeView, houseView, isMobileViewport, isNightMode)
   ============================================================ */
(function(){
'use strict';
if(typeof THREE === 'undefined') return; /* vendor โหลดไม่สำเร็จ → ปิดฟีเจอร์เงียบๆ ปุ่มจะ toast แจ้งแทน */

const HOUSE_KEY = id => 'p1quiz_house_' + id;

/* ---------- ตัวเลือกตัวละคร (สร้างตัวละคร) ---------- */
const H_SKIN = 0xffd9b3;
const H_HAIR_COLORS = [0x3b2a1a,0x6b4423,0xa5692a,0xe8c05c,0xf28c28,0xd94f30,0xf48fb1,0x9b59b6,0x5aa7e8,0x58c473];
const H_EYE_COLORS  = [0x33261d,0x6b4423,0x3a79d8,0x3f9d5a,0x8e5bc0,0xe56aa4,0x7a8894,0xd8a520];
const H_SHIRT_COLORS  = [0xef5350,0xffa726,0xffd54f,0x9ccc65,0x4db6ac,0x42a5f5,0x7986cb,0xba68c8,0xf06292,0x8d6e63,
  /* แบบ 2 สี (ท่อนบนสี a / ท่อนล่างสี b) */
  {a:0xef5350,b:0xffffff},{a:0x42a5f5,b:0xffd54f},{a:0x66bb6a,b:0xffffff},{a:0x9575cd,b:0xf06292},{a:0x26a69a,b:0xffa726}];
const H_BOTTOM_COLORS = [0x3f5aa8,0x6d4c41,0x455a64,0x00897b,0xc62828,0xf48fb1,0x9575cd,0x558b2f,0xffb74d,0x263238,
  /* แบบ 2 สี (กางเกงท่อนบน a / ท่อนล่าง b, กระโปรงตัว a / ชายกระโปรง b) */
  {a:0x3f5aa8,b:0xffffff},{a:0xf48fb1,b:0xffffff},{a:0xc62828,b:0x3f5aa8},{a:0x558b2f,b:0xffd54f},{a:0x7e57c2,b:0xffffff}];
const H_SHOE_COLORS   = [0xffffff,0x333333,0xef5350,0x42a5f5,0xffca28,0x66bb6a,0xab47bc,0x8d6e63];
const H_HAIR_N = 6, H_EYE_N = 8;

const H_DEFAULT_CHAR = {gender:0, hair:0, hairC:0, eyes:1, eyeC:0, shirt:5, bottom:0, shoes:0};

const H_ROWS = [
  {key:'gender', label:'หนูเป็น...', type:'text', options:['👦 เด็กชาย','👧 เด็กหญิง']},
  {key:'hair',   label:'ทรงผม',      type:'num',  n:H_HAIR_N},
  {key:'hairC',  label:'สีผม',       type:'color', colors:H_HAIR_COLORS},
  {key:'eyes',   label:'ดวงตา',      type:'num',  n:H_EYE_N},
  {key:'eyeC',   label:'สีตา',       type:'color', colors:H_EYE_COLORS},
  {key:'shirt',  label:'สีเสื้อ',     type:'color', colors:H_SHIRT_COLORS},
  {key:'bottom', label:'สีกางเกง/กระโปรง', type:'color', colors:H_BOTTOM_COLORS},
  {key:'shoes',  label:'สีรองเท้า',   type:'color', colors:H_SHOE_COLORS},
];
/* ไอคอน SVG แบนๆ พาสเทลขอบมน ชุดเดียวกับธีมไอคอนหมวดในแอป (แทน emoji ระบบเดิมที่ไม่เข้ากับ template) */
const H_ROW_ICONS = {
  gender: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#ffe0b3" stroke="#e59a5b" stroke-width="2"/><circle cx="9" cy="11" r="1.3" fill="#6b4a2b"/><circle cx="15" cy="11" r="1.3" fill="#6b4a2b"/><path d="M9 14.6 Q12 17 15 14.6" fill="none" stroke="#c9573f" stroke-width="1.8" stroke-linecap="round"/></svg>',
  hair:   '<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="5" rx="2.2" fill="#c8a2f0" stroke="#8e5bc0" stroke-width="1.8"/><line x1="7" y1="10.5" x2="7" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/><line x1="10.5" y1="10.5" x2="10.5" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/><line x1="14" y1="10.5" x2="14" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/><line x1="17.5" y1="10.5" x2="17.5" y2="17.5" stroke="#8e5bc0" stroke-width="1.8" stroke-linecap="round"/></svg>',
  hairC:  '<svg viewBox="0 0 24 24"><path d="M12 3 C 8.5 8.5, 6.5 11.5, 6.5 14.5 a5.5 5.5 0 0 0 11 0 c0-3-2-6-5.5-11.5 z" fill="#ffb27d" stroke="#f07a3e" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="10" cy="13.5" rx="1.4" ry="2.1" fill="#fff" opacity=".55"/></svg>',
  eyes:   '<svg viewBox="0 0 24 24"><path d="M3 12 Q12 5 21 12 Q12 19 3 12 z" fill="#dff1fb" stroke="#5b9fc9" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.4" fill="#3a79d8"/><circle cx="12" cy="12" r="1.5" fill="#1c2b4a"/><circle cx="13.4" cy="10.7" r=".8" fill="#fff"/></svg>',
  eyeC:   '<svg viewBox="0 0 24 24"><path d="M12 3 C 8.5 8.5, 6.5 11.5, 6.5 14.5 a5.5 5.5 0 0 0 11 0 c0-3-2-6-5.5-11.5 z" fill="#8fbef0" stroke="#3a79d8" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="10" cy="13.5" rx="1.4" ry="2.1" fill="#fff" opacity=".55"/></svg>',
  shirt:  '<svg viewBox="0 0 24 24"><path d="M8.5 4 L4 7 L6 10.2 L8 9 V20 H16 V9 L18 10.2 L20 7 L15.5 4 Q12 6.8 8.5 4 z" fill="#7ec0f5" stroke="#3a86c9" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  bottom: '<svg viewBox="0 0 24 24"><path d="M6.5 4 H17.5 L16.6 20 H13 L12 10.5 L11 20 H7.4 z" fill="#7f8fd6" stroke="#4a5aa8" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  shoes:  '<svg viewBox="0 0 24 24"><path d="M3 15.5 V11.5 Q3 9.5 5 9.5 L8 9.5 L11 12.5 L18 14.2 Q21 14.8 21 17 V18.5 H3 z" fill="#ffd24d" stroke="#d99a1f" stroke-width="1.8" stroke-linejoin="round"/><line x1="8" y1="11" x2="9.6" y2="12.6" stroke="#d99a1f" stroke-width="1.5" stroke-linecap="round"/><line x1="10.2" y1="12" x2="11.8" y2="13.6" stroke="#d99a1f" stroke-width="1.5" stroke-linecap="round"/></svg>',
};

/* ---------- แผนที่นอกบ้าน (grid) ----------
   ค่า tile: 0 = หญ้าเดินได้, 1 = น้ำ (คลอง), 2 = สะพานเดินได้, 3 = ถูกบล็อก (ต้นไม้/บ้าน) */
const OUT_W = 18, OUT_D = 14;
const RIVER_X = [11,12];
const BRIDGE_Z = [6,7];
const HOUSE_FOOT = {x0:2, x1:5, z0:2, z1:4};
const DOOR_TILE = {x:4, z:5};          /* ช่องหญ้าหน้าประตูบ้าน */
const SPAWN_TILE = {x:7, z:8};
const TREES = [[1,9],[3,11],[8,2],[9,11],[15,3],[16,10],[14,1],[6,12],[16,5],[1,4]];
const FLOWERS = [[7,4],[9,8],[2,7],[15,7],[13,3],[5,10],[14,9],[6,1]];

/* ห้องในบ้าน (เฟส 1: ห้องเดียวโล่งๆ เฟส 2 ค่อยแบ่งหลายห้อง) */
const IN_W = 8, IN_D = 6;
const IN_DOOR_TILE = {x:3, z:0};

/* ---------- state ---------- */
let hInit = false;
let renderer, camera, raycaster, groundPlane;
let scene, worldGroup, interiorGroup, creatorGroup, charGroup = null;
let hemiLight, dirLight;
let houseOpen = false, rafId = null, lastT = 0;
let hMode = 'world';                 /* 'creator' | 'world' */
let hScene = 'out';                  /* 'out' | 'in' */
let hZoom = 1, camTarget = new THREE.Vector3();
let loadedChildId = null;
let outGrid = null, inGrid = null;
let houseClickables = [], interiorDoorMesh = null;
let hintTimer = null;

const hChar = {                       /* สถานะตัวละครในฉาก */
  cfg: null, tile: {x:SPAWN_TILE.x, z:SPAWN_TILE.z},
  path: [], seg: 0, segT: 0, segFrom: null, walking: false,
  targetRotY: Math.PI, pendingEnter: false, pendingExit: false,
};
const creatorState = {dragging:false, lastX:0, rotY:0, rotTarget:0, fromWorld:false};

/* ---------- data ---------- */
function loadHouseData(){
  if(!activeChild) return null;
  try{ return JSON.parse(localStorage.getItem(HOUSE_KEY(activeChild.id)) || 'null'); }catch(e){ return null; }
}
function saveHouseData(patch){
  if(!activeChild) return;
  const cur = loadHouseData() || {v:1};
  Object.assign(cur, patch);
  try{ localStorage.setItem(HOUSE_KEY(activeChild.id), JSON.stringify(cur)); }catch(e){}
}

/* ---------- โทน/วัสดุ ---------- */
let gradientMap = null;
const matCache = new Map();
function toonMat(hex){
  if(matCache.has(hex)) return matCache.get(hex);
  if(!gradientMap){
    const data = new Uint8Array([120, 180, 228]); /* โทนสูงสุดไม่ชน 255 กันสีซีด/ไฮไลต์ขาวจ้า */
    gradientMap = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.needsUpdate = true;
  }
  const m = new THREE.MeshToonMaterial({color: hex, gradientMap});
  matCache.set(hex, m);
  return m;
}
/* วัสดุผิวนุ่ม: ไล่โทนสว่างกว่า toon ปกติ เพื่อให้เงาบนใบหน้า/ผิวตัวละครนุ่มลง ไม่เข้มเป็นหย่อม */
let softGradientMap = null;
function softMat(hex){
  const key = 'soft_' + hex;
  if(matCache.has(key)) return matCache.get(key);
  if(!softGradientMap){
    const data = new Uint8Array([196, 222, 240]); /* min สูงกว่า toon ปกติ (120) → ด้านมืดสว่างขึ้น เงานุ่ม */
    softGradientMap = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
    softGradientMap.minFilter = THREE.NearestFilter;
    softGradientMap.magFilter = THREE.NearestFilter;
    softGradientMap.needsUpdate = true;
  }
  const m = new THREE.MeshToonMaterial({color: hex, gradientMap: softGradientMap});
  matCache.set(key, m);
  return m;
}
/* กล่องขอบมน (ลบเหลี่ยมคมให้ดู friendly กับเด็ก) — BoxGeometry แบ่ง segment
   แล้วดันจุดยอดให้โค้งรอบกล่องใน (clamp + normalize) พร้อมตั้ง normal ตามทิศโค้ง
   ให้แสง toon ไล่นุ่มตามขอบ — r ไม่ระบุ = อัตโนมัติตามสัดส่วนด้านสั้นสุด (cap .08) */
function roundedBoxGeo(w,h,d,r){
  if(r == null) r = Math.min(Math.min(w,h,d)*.3, .12);
  r = Math.min(r, w/2, h/2, d/2);
  const geo = new THREE.BoxGeometry(w,h,d,2,2,2);
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const hw = w/2-r, hh = h/2-r, hd = d/2-r;
  const v = new THREE.Vector3(), c = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    c.set(Math.max(-hw,Math.min(hw,v.x)), Math.max(-hh,Math.min(hh,v.y)), Math.max(-hd,Math.min(hd,v.z)));
    v.sub(c).normalize();
    nor.setXYZ(i, v.x, v.y, v.z);
    pos.setXYZ(i, c.x+v.x*r, c.y+v.y*r, c.z+v.z*r);
  }
  return geo;
}
function box(w,h,d,hex,r){
  const m = new THREE.Mesh(roundedBoxGeo(w,h,d,r), toonMat(hex));
  m.castShadow = hShadows; return m;
}
function sphere(r,hex,seg){
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg||14, seg||12), toonMat(hex));
  m.castShadow = hShadows; return m;
}
let hShadows = false;

/* ---------- ตัวละคร blocky ---------- */
function disposeGroup(g){
  g.traverse(o=>{ if(o.isMesh && o.geometry) o.geometry.dispose(); });
}

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
  s.castShadow = hShadows; s.position.set(x, y, z); head.add(s);
}
/* ผมข้าง/หาง/แกละ เป็นทรงกระบอกเรียว (โคนใหญ่ปลายเรียว) ผิวโค้งมนรอบตัว ไม่มีหน้าแบน จึงไม่ดูเป็นแผ่น
   sz>1 = แบนหน้า-หลังให้แผ่คลุมข้างหน้าเป็นม่านผม, tilt = เอียงเข้าหาคาง/สะบัดออก */
function hairLock(head, c, o){
  o = o || {};
  const m = new THREE.Mesh(new THREE.CylinderGeometry(o.rt ?? .15, o.rb ?? .09, o.h ?? .55, 14), toonMat(c));
  m.castShadow = hShadows;
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
        hairCap(head,c,{h:.4,y:.2,d:.68,drop:.16});
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
        hairCap(head,c,{h:.44,y:.19});
        { const bun=sphere(.15,c); bun.position.set(0,.34,-.44); head.add(bun); } break;
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
          ring.rotation.x=Math.PI/2; ring.position.set(0,.4,-.02); ring.castShadow=hShadows; head.add(ring); } break;
      case 4: /* ยาวลอนสลวย */
        hairCap(head,c,{h:.5,y:.13,d:.82,w:.86,drop:.13});
        [-1,1].forEach(s=>hairStrand(head,c,.44*s,.02,-.04,4,.16,.22)); break;
      case 5: /* เปียข้างเดี่ยว */
        hairCap(head,c,{h:.5,y:.13,d:.8,w:.84,rz:.14});
        hairStrand(head,c,.4,.04,.12,4,.12,.2); break;
    }
  }
}

function addEyes(head, style, hex){
  const F = .345; /* ยื่นพ้นหน้า (หน้า head หนา .33) กัน z-fight */
  const mk = (fn) => [-1,1].forEach(s=>fn(s));
  switch(style){
    case 0: mk(s=>{ const e = sphere(.05,hex,8); e.position.set(.15*s,.04,F); head.add(e); }); break;      /* จุดกลม */
    case 1: mk(s=>{ const w = sphere(.085,0xffffff,10); w.position.set(.16*s,.04,F); head.add(w);          /* กลมโต */
                    const i = sphere(.045,hex,8); i.position.set(.16*s,.04,F+.055); head.add(i); }); break;
    case 2: mk(s=>{ [[-.03,.5],[.03,-.5]].forEach(p=>{ const b = box(.08,.03,.02,hex);                     /* ยิ้มหยี ∧ */
                    b.position.set(.15*s+p[0]*s,.05+Math.abs(p[0]),F); b.rotation.z = p[1]*s; head.add(b); }); }); break;
    case 3: mk(s=>{ const b = box(.12,.045,.02,hex); b.position.set(.16*s,.04,F); head.add(b); }); break;  /* ตารีนอน */
    case 4: mk(s=>{ const w = sphere(.08,0xffffff,10); w.position.set(.16*s,.03,F); head.add(w);           /* โตมีขนตา */
                    const i = sphere(.042,hex,8); i.position.set(.16*s,.03,F+.05); head.add(i);
                    const l = box(.1,.025,.02,0x33261d); l.position.set(.16*s,.13,F); l.rotation.z = -.25*s; head.add(l); }); break;
    case 5: mk(s=>{ const e = sphere(.05,hex,8); e.scale.set(.7,1.5,.6); e.position.set(.15*s,.05,F); head.add(e); }); break; /* รีตั้ง */
    case 6: mk(s=>{ const t = new THREE.Mesh(new THREE.TorusGeometry(.055,.016,6,10,Math.PI), toonMat(hex));  /* หยีปิดสุข ∩ */
                    t.position.set(.15*s,.03,F); head.add(t); }); break;
    case 7: mk(s=>{ const w = sphere(.095,0xffffff,10); w.position.set(.16*s,.04,F); head.add(w);          /* แบ๊วประกาย */
                    const i = sphere(.055,hex,8); i.position.set(.16*s,.04,F+.055); head.add(i);
                    const h = sphere(.02,0xffffff,6); h.position.set(.19*s,.08,F+.1); head.add(h); }); break;
  }
}

function buildCharacter(cfg){
  const g = new THREE.Group();
  const rig = new THREE.Group(); g.add(rig);
  const girl = cfg.gender === 1;
  /* เสื้อ/กางเกง-กระโปรง รองรับ "แบบ 2 สี" (entry เป็น object {a,b}) — a สีหลัก, b สีท่อนล่าง/ชาย */
  const shirtE = H_SHIRT_COLORS[cfg.shirt] ?? H_SHIRT_COLORS[0];
  const shirt2 = (shirtE && typeof shirtE === 'object') ? shirtE : null;
  const shirtC = shirt2 ? shirt2.a : shirtE;
  const shirtB = shirt2 ? shirt2.b : shirtE;
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
    const shoe = box(.2,.11,.25, shoeC, .045); shoe.position.set(0,-.35,.03); piv.add(shoe);
    rig.add(piv); return piv;
  });
  if(girl){
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.24,.4,.24,10), toonMat(botC));
    skirt.castShadow = hShadows; skirt.position.y = .42; rig.add(skirt);
    if(bot2){                                         /* กระโปรง 2 สี: ตัวกระโปรง a + ชายกระโปรง b */
      const hem = new THREE.Mesh(new THREE.CylinderGeometry(.385,.42,.09,10), toonMat(botB));
      hem.castShadow = hShadows; hem.position.y = .335; rig.add(hem);
    }
  }
  /* ตัว (เสื้อ) — ใช้ทรงเดียวกับแบบสีเดียวเสมอ (กล่องขอบมน) ให้ silhouette เหมือนกัน
     แบบ 2 สี = วางแถบสี b 2 แถบแนบหน้าเสื้อสีหลัก a ให้เห็นเป็นลายทางแนวตั้ง a/b/a/b/a
     โดยตัวเสื้อฐานยังเป็นกล่องขอบมน มุม/ข้างจึงมนเหมือนแบบสีเดียว ไม่เป็นเหลี่ยม */
  {
    const body = box(.52,.5,.32, shirtC); body.position.y = .68; rig.add(body);
    if(shirt2){
      [-.104, .104].forEach(x=>{
        const strip = box(.104,.5,.33, shirtB); /* ขอบมน แนบหน้าเสื้อ (ยื่นราวๆ .005 พอเห็นเป็นทาง ไม่นูน) */
        strip.position.set(x, .68, 0); rig.add(strip);
      });
    }
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
  /* หัว + หน้า — ใช้ softMat กับกะโหลกให้เงาบนใบหน้านุ่มลง (ไม่เข้มเป็นหย่อม) */
  const head = new THREE.Group(); head.position.y = 1.26; rig.add(head);
  const skull = new THREE.Mesh(roundedBoxGeo(.64,.6,.66), softMat(H_SKIN));
  skull.castShadow = hShadows; head.add(skull);
  /* % H_HAIR_N: ตัวละครที่ save ไว้ตอนยังมี 10 ทรง (index 6-9) ให้วนกลับเข้าช่วง 6 ทรงปัจจุบัน ไม่กลายเป็นหัวล้าน */
  addHair(head, girl, (cfg.hair|0) % H_HAIR_N, H_HAIR_COLORS[cfg.hairC] ?? H_HAIR_COLORS[0]);
  addEyes(head, cfg.eyes|0, H_EYE_COLORS[cfg.eyeC] ?? H_EYE_COLORS[0]);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.06,.018,6,10,Math.PI), toonMat(0xc9573f));
  mouth.rotation.z = Math.PI; mouth.position.set(0,-.12,.345); head.add(mouth);
  [-1,1].forEach(s=>{ const ch = sphere(.045,0xffb3a0,8); ch.scale.z = .4; ch.position.set(.24*s,-.08,.34); head.add(ch); });

  g.userData = {rig, legs, arms, head};
  return g;
}

/* ---------- ฉากนอกบ้าน ---------- */
function outWX(gx){ return gx - (OUT_W-1)/2; }
function outWZ(gz){ return gz - (OUT_D-1)/2; }

function buildOutGrid(){
  const grid = [];
  for(let z=0; z<OUT_D; z++){
    const row = [];
    for(let x=0; x<OUT_W; x++){
      let t = 0;
      if(RIVER_X.includes(x)) t = BRIDGE_Z.includes(z) ? 2 : 1;
      if(x>=HOUSE_FOOT.x0 && x<=HOUSE_FOOT.x1 && z>=HOUSE_FOOT.z0 && z<=HOUSE_FOOT.z1) t = 3;
      row.push(t);
    }
    grid.push(row);
  }
  TREES.forEach(([x,z])=>{ grid[z][x] = 3; });
  return grid;
}

function buildWorld(){
  worldGroup = new THREE.Group();
  outGrid = buildOutGrid();

  /* พื้นสไตล์ isometric บล็อกหนา (อ้างอิง house_example/isomatic2d_style_1.png):
     หน้าหญ้าเป็นแผ่นบางด้านบนสลับ 2 เฉด (เขียวอ่อน/เข้ม) + ฐานดินน้ำตาลหนาทั้งผืนให้เห็นขอบข้างเป็นชั้นดิน
     ใช้ BoxGeometry หน้าเรียบ (ไม่ใช่ roundedBox) เพราะ bevel มุมของ roundedBox ทำให้ toon shading
     เกิดเงาสามเหลี่ยมตรงมุมบล็อกทุกช่อง ดูลายตา — หน้าเรียบจะไล่เฉดเรียบทั้งช่อง ไม่มีสามเหลี่ยม */
  const topGeo = new THREE.BoxGeometry(1,.24,1);
  const counts = {g1:0,g2:0};
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]!==1) ((x+z)%2 ? counts.g2++ : counts.g1++);
  }
  const grassMat1 = toonMat(0x8fd06c); /* เขียวอ่อน — เรียกก่อนเพื่อให้ gradientMap ถูกสร้างก่อนใช้กับ waterMat */
  const inst = {
    g1: new THREE.InstancedMesh(topGeo, grassMat1, counts.g1),
    g2: new THREE.InstancedMesh(topGeo, toonMat(0x7cc25a), counts.g2), /* เขียวเข้ม */
  };
  const idx = {g1:0,g2:0};
  const m4 = new THREE.Matrix4();
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]===1) continue;
    const key = (x+z)%2 ? 'g2' : 'g1';
    m4.makeTranslation(outWX(x), -.12, outWZ(z));
    inst[key].setMatrixAt(idx[key]++, m4);
  }
  Object.values(inst).forEach(im=>{ im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows; worldGroup.add(im); });
  /* น้ำเป็นผืนเดียวยาวตลอดคลอง (เดิมเป็นบล็อกต่อช่อง เห็นรอยต่อเป็นตารางไม่เหมือนน้ำ) */
  const waterMat = new THREE.MeshToonMaterial({color:0x6cc6e8, gradientMap, transparent:true, opacity:.9});
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(RIVER_X.length, .14, OUT_D), waterMat);
  waterMesh.position.set(outWX(11.5), -.25, 0);
  worldGroup.add(waterMesh);
  const dirtBase = new THREE.Mesh(roundedBoxGeo(OUT_W,.6,OUT_D,.1), toonMat(0x9c6b45));
  dirtBase.position.y = -.54; worldGroup.add(dirtBase);

  /* ทางเดินหินหน้าประตูบ้าน */
  [[4,5],[4,6],[4,7]].forEach(([x,z],i)=>{
    const s = new THREE.Mesh(roundedBoxGeo(.6,.07,.6,.03), toonMat(0xe3ddd0));
    s.rotation.y = .35*(i%2 ? 1 : -1);
    s.position.set(outWX(x), .04, outWZ(z));
    s.receiveShadow = hShadows;
    worldGroup.add(s);
  });

  /* สะพานไม้ข้ามคลอง */
  const bridge = new THREE.Group();
  const deck = box(2.6,.14,2.2,0xc98d4e); deck.position.set(0,.05,0); deck.receiveShadow = hShadows; bridge.add(deck);
  [-1,1].forEach(s=>{
    const rail = box(2.6,.12,.1,0xa96f35); rail.position.set(0,.42,1.02*s); bridge.add(rail);
    [-1.15,0,1.15].forEach(px=>{ const post = box(.1,.4,.1,0xa96f35); post.position.set(px,.2,1.02*s); bridge.add(post); });
  });
  bridge.position.set(outWX(11.5), 0, outWZ(6.5));
  worldGroup.add(bridge);

  /* บ้าน */
  const house = new THREE.Group();
  const base = box(3.4,1.6,2.6,0xfff2dc); base.position.y = .8; house.add(base);
  /* หลังคาจั่ว (gable/A-frame) — ทรงสามเหลี่ยมแบบบ้านการ์ตูน (อ้างอิงภาพ house_example)
     2 หน้าลาดเอียงคนละมุม flatShading จับแสงต่างกันเอง หน้าหนึ่งสว่างหน้าหนึ่งเงา = เห็นมิติชัด
     ไม่แบนเป็นก้อนเดียวเหมือนปิรามิดเดิม + หน้าจั่วสามเหลี่ยมสีผนัง (หน้า/หลัง) + สันครีมพาดยอด */
  const ROOF_TOP_Y = 1.6;                              /* ระดับที่หลังคาวางบนผนัง */
  const RISE = 1.02, HALF = 1.9, DEP = 2.9;            /* สูงหลังคา, ครึ่งกว้าง(รวมชายคายื่นข้าง), ลึก(รวมยื่นหน้า-หลัง) */
  const roofMat = new THREE.MeshToonMaterial({color:0xef8354, gradientMap});
  const slopeLen = Math.hypot(HALF, RISE), slopeAng = Math.atan2(RISE, HALF);
  [1,-1].forEach(s=>{                                  /* 2 หน้าลาด: ขวา(+x) / ซ้าย(-x) */
    const plane = new THREE.Mesh(roundedBoxGeo(slopeLen, .18, DEP, .06), roofMat);
    plane.castShadow = hShadows;
    plane.rotation.z = -s*slopeAng;
    plane.position.set(s*HALF/2, ROOF_TOP_Y + RISE/2, 0);
    house.add(plane);
  });
  /* หน้าจั่วสามเหลี่ยม (ผนังต่อขึ้นเป็นสามเหลี่ยม) หน้า+หลัง สีเดียวกับผนังบ้าน ซุกใต้หน้าลาดพอดี */
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-1.7, 0); gableShape.lineTo(1.7, 0); gableShape.lineTo(0, RISE); gableShape.closePath();
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, {depth:.12, bevelEnabled:false});
  [1.18, -1.30].forEach(z=>{
    const gable = new THREE.Mesh(gableGeo, toonMat(0xfff2dc));
    gable.position.set(0, ROOF_TOP_Y, z); house.add(gable);
  });
  /* สันหลังคา (ridge) แท่งครีมขอบมนพาดตามยอด */
  const ridge = new THREE.Mesh(roundedBoxGeo(.16, .16, DEP + .05, .06), toonMat(0xffe4c4));
  ridge.castShadow = hShadows; ridge.position.set(0, ROOF_TOP_Y + RISE, 0); house.add(ridge);
  const door = box(.76,1.14,.1,0x9c6238); door.position.set(.5,.57,1.32); house.add(door);
  const knob = sphere(.05,0xffd54f,8); knob.position.set(.78,.55,1.4); house.add(knob);
  const win1 = box(.62,.62,.1,0xaadcf5); win1.position.set(-.8,.95,1.32); house.add(win1);
  const winf = box(.74,.74,.06,0xffffff); winf.position.set(-.8,.95,1.3); house.add(winf);
  const win2 = box(.1,.62,.62,0xaadcf5); win2.position.set(1.72,.95,0); house.add(win2);
  house.position.set(outWX(3.5), 0, outWZ(3));
  house.userData.hHouse = true;
  worldGroup.add(house);
  houseClickables = [];
  house.traverse(o=>{ if(o.isMesh) houseClickables.push(o); });

  /* ต้นไม้ */
  TREES.forEach(([x,z],i)=>{
    const tr = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,.55,8), toonMat(0x9c6238));
    trunk.castShadow = hShadows; trunk.position.y = .27; tr.add(trunk);
    const f1 = sphere(.5,(i%3===1)?0x5cbf6e:0x4caf50); f1.position.y = .9; tr.add(f1);
    const f2 = sphere(.36,0x66c878); f2.position.set(.3,.68,.18); tr.add(f2);
    const f3 = sphere(.3,0x58b862); f3.position.set(-.28,.72,-.14); tr.add(f3);
    /* ดอกไม้ขาวแต้มบนพุ่ม (แบบต้นไม้ในภาพอ้างอิง) */
    if(i%2===0){
      const b1 = sphere(.07,0xffffff,6); b1.position.set(.2,1.28,.28); tr.add(b1);
      const b2 = sphere(.055,0xffffff,6); b2.position.set(-.3,1.05,.3); tr.add(b2);
    }
    tr.position.set(outWX(x), 0, outWZ(z));
    tr.rotation.y = (x*7+z*13)%6;
    tr.userData.hTree = {tile:{x,z}};
    worldGroup.add(tr);
  });

  /* ดอกไม้เล็กๆ (ไม่บล็อกทางเดิน) */
  FLOWERS.forEach(([x,z],i)=>{
    const fl = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.18,6), toonMat(0x4caf50));
    stem.position.y = .09; fl.add(stem);
    const bl = sphere(.07,[0xff8fb3,0xffd54f,0xb388ff,0xff8a65][i%4],8); bl.position.y = .2; fl.add(bl);
    fl.position.set(outWX(x)+.22, 0, outWZ(z)-.18);
    fl.userData.hFlower = {tile:{x,z}};
    worldGroup.add(fl);
  });

  collectEdgeTiles();
  scene.add(worldGroup);
}

/* ---------- ฉากในบ้าน ---------- */
function inWX(gx){ return gx - (IN_W-1)/2; }
function inWZ(gz){ return gz - (IN_D-1)/2; }

function buildInterior(){
  interiorGroup = new THREE.Group();
  inGrid = [];
  for(let z=0; z<IN_D; z++){ inGrid.push(new Array(IN_W).fill(0)); }

  /* พื้นห้องสลับ 2 เฉด (อ่อน/เข้ม) เหมือนเดิม — ใช้ BoxGeometry หน้าเรียบ กันเงาสามเหลี่ยมตรงมุมบล็อก */
  const tileGeo = new THREE.BoxGeometry(1,.24,1);
  const im1 = new THREE.InstancedMesh(tileGeo, toonMat(0xe6bc7f), Math.ceil(IN_W*IN_D/2));
  const im2 = new THREE.InstancedMesh(tileGeo, toonMat(0xd9a967), Math.floor(IN_W*IN_D/2));
  const idx = [0,0]; const m4 = new THREE.Matrix4();
  for(let z=0; z<IN_D; z++) for(let x=0; x<IN_W; x++){
    m4.makeTranslation(inWX(x), -.12, inWZ(z));
    if((x+z)%2){ im2.setMatrixAt(idx[1]++, m4); } else { im1.setMatrixAt(idx[0]++, m4); }
  }
  [im1,im2].forEach(im=>{ im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows; interiorGroup.add(im); });
  /* ฐานใต้พื้นห้อง ให้เป็นบล็อกหนาแบบเดียวกับข้างนอก */
  const floorBase = new THREE.Mesh(roundedBoxGeo(IN_W,.5,IN_D,.1), toonMat(0x9c6b45));
  floorBase.position.y = -.49; interiorGroup.add(floorBase);

  /* ผนัง 2 ด้านไกลกล้อง (กล้องมองจาก +x,+z) คือด้าน x ต่ำ และ z ต่ำ
     - ยืดให้ซ้อนกันตรงมุม (แต่ละผนังยาวเกินไปคลุมรอยต่ออีกด้าน) ไม่มีช่องมุมโหว่ = ผนังไม่แยกจากกัน
     - ขอบล่างหยั่งลงต่ำกว่าผิวพื้น (WBOT ติดลบ) + หน้าผนังล้ำเข้าห้องเล็กน้อย ให้ผนังจมติดพื้นสนิท ไม่ลอย */
  const wallC = 0xfbe3c0;
  const WT = .24, WTOP = 2.1, WBOT = -.3, WH = WTOP - WBOT, WY = (WTOP + WBOT)/2;
  const xL = inWX(0) - .5, zB = inWZ(0) - .5;   /* ขอบพื้นด้านซ้าย/หลัง */
  const wallBack = box(IN_W + WT, WH, WT, wallC);
  wallBack.position.set(-WT/2, WY, zB - WT/2 + .04); interiorGroup.add(wallBack);
  const wallLeft = box(WT, WH, IN_D + WT, wallC);
  wallLeft.position.set(xL - WT/2 + .04, WY, -WT/2); interiorGroup.add(wallLeft);
  /* ประตู (บนผนังหลัง) — คลิกเพื่อออกไปนอกบ้าน */
  interiorDoorMesh = box(.8,1.3,.12,0x9c6238);
  interiorDoorMesh.position.set(inWX(IN_DOOR_TILE.x),.65,inWZ(0)-.48); interiorGroup.add(interiorDoorMesh);
  const knob = sphere(.05,0xffd54f,8); knob.position.set(inWX(IN_DOOR_TILE.x)+.28,.62,inWZ(0)-.4); interiorGroup.add(knob);
  /* หน้าต่าง + พรม ให้ห้องไม่โล่งเกินไป (เฟอร์นิเจอร์จริงมาเฟส 3) */
  const win = box(.9,.7,.12,0xaadcf5); win.position.set(inWX(6),1.2,inWZ(0)-.48); interiorGroup.add(win);
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,.05,20), toonMat(0xf48fb1));
  rug.position.set(inWX(4),.03,inWZ(3)); rug.receiveShadow = hShadows; interiorGroup.add(rug);
  const rug2 = new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.06,20), toonMat(0xffc1d8));
  rug2.position.set(inWX(4),.05,inWZ(3)); interiorGroup.add(rug2);

  interiorGroup.visible = false;
  scene.add(interiorGroup);
}

/* ---------- pathfinding (BFS บน grid) ---------- */
function isWalk(grid, W, D, x, z){
  return x>=0 && z>=0 && x<W && z<D && (grid[z][x]===0 || grid[z][x]===2);
}
function nearestWalkable(grid, W, D, tx, tz){
  if(isWalk(grid,W,D,tx,tz)) return {x:tx,z:tz};
  const seen = new Set([tz*W+tx]); const q = [{x:tx,z:tz}];
  while(q.length){
    const c = q.shift();
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=c.x+dx, nz=c.z+dz, k=nz*W+nx;
      if(nx<0||nz<0||nx>=W||nz>=D||seen.has(k)) continue;
      seen.add(k);
      if(isWalk(grid,W,D,nx,nz)) return {x:nx,z:nz};
      q.push({x:nx,z:nz});
    }
  }
  return null;
}
function findPath(grid, W, D, from, to){
  if(from.x===to.x && from.z===to.z) return [];
  const prev = new Map(); const seen = new Set([from.z*W+from.x]);
  const q = [from];
  while(q.length){
    const c = q.shift();
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=c.x+dx, nz=c.z+dz, k=nz*W+nx;
      if(!isWalk(grid,W,D,nx,nz) || seen.has(k)) continue;
      seen.add(k); prev.set(k,c);
      if(nx===to.x && nz===to.z){
        const path = [{x:nx,z:nz}];
        let p = c;
        while(p && !(p.x===from.x && p.z===from.z)){ path.unshift(p); p = prev.get(p.z*W+p.x); }
        return path;
      }
      q.push({x:nx,z:nz});
    }
  }
  return null;
}

/* ---------- กล้อง/แสง/renderer ---------- */
const CAM_DIR = new THREE.Vector3(1,1.15,1).normalize();
function applyCamera(){
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  if(hMode==='creator'){
    if(!isMobileViewport()){
      /* จอใหญ่: แผงตัวเลือกเป็นการ์ดชิดขวา (ดู .house-creator ใน media query ≥768px)
         → จัดตัวละครเต็มตัวกลางพื้นที่ว่างฝั่งซ้าย ด้วย frustum ซ้าย/ขวาไม่สมมาตร */
      const H = 4.2, W = H*aspect;
      const vw = window.innerWidth;
      const panelW = Math.min(400, vw*.44) + 36;      /* กว้างแผง + ระยะขอบขวา/ช่องไฟ */
      const vc = ((vw - panelW)/2) / vw;              /* สัดส่วนแนวนอนที่อยากให้ตัวละครอยู่ */
      camera.left = -vc*W; camera.right = (1-vc)*W;
      camera.top = 2.2; camera.bottom = camera.top - H;
    }else{
      /* มือถือ: แผงเป็น bottom sheet — พื้นที่ว่างจริงคือระหว่างแถบบน (~70px)
         กับขอบแผง (~60vh) จัดเฟรมให้หัวจรดรองเท้าอยู่ในช่องนั้นพอดี ไม่โดนตัด/บัง */
      const H = 6.4;
      camera.top = 1.58; camera.bottom = camera.top - H;
      camera.left = -H*aspect/2; camera.right = H*aspect/2;
    }
    camera.position.set(0, 2.1, 6.2); camera.lookAt(0, .75, 0);
  }else{
    const halfH = 5.2 / hZoom;
    camera.top = halfH; camera.bottom = -halfH;
    camera.left = -halfH*aspect; camera.right = halfH*aspect;
    camera.position.copy(camTarget).addScaledVector(CAM_DIR, 22);
    camera.lookAt(camTarget);
  }
  camera.updateProjectionMatrix();
}
/* แสงเช้า↔กลางคืน: ตอนสลับธีมค่อยๆ เกลี่ยสี/ความสว่าง ~2s (เท่าจังหวะ crossfade
   ท้องฟ้า CSS ของแอปหลัก) — instant ใช้ตอนเพิ่งเข้า view ให้ตรงธีมทันที */
let lightLerp = null;
function lightTargets(night){
  return night
    ? {hi:.55, di:.5,  hc:new THREE.Color(0x8fa3d9), hg:new THREE.Color(0x39406b), dc:new THREE.Color(0xbcd0ff)}
    : {hi:.62, di:.68, hc:new THREE.Color(0xfff6e0), hg:new THREE.Color(0xcde8b0), dc:new THREE.Color(0xffffff)};
}
function updateLights(instant){
  const to = lightTargets((typeof isNightMode==='function') && isNightMode());
  if(instant){
    hemiLight.intensity = to.hi; dirLight.intensity = to.di;
    hemiLight.color.copy(to.hc); hemiLight.groundColor.copy(to.hg); dirLight.color.copy(to.dc);
    lightLerp = null;
    return;
  }
  lightLerp = {k:0, dur:2,
    from:{hi:hemiLight.intensity, di:dirLight.intensity,
          hc:hemiLight.color.clone(), hg:hemiLight.groundColor.clone(), dc:dirLight.color.clone()},
    to};
}
function updateLightLerp(dt){
  if(!lightLerp) return;
  lightLerp.k += dt/lightLerp.dur;
  const k = Math.min(1, lightLerp.k);
  const e = k*k*(3-2*k); /* smoothstep */
  const {from, to} = lightLerp;
  hemiLight.intensity = from.hi + (to.hi-from.hi)*e;
  dirLight.intensity = from.di + (to.di-from.di)*e;
  hemiLight.color.lerpColors(from.hc, to.hc, e);
  hemiLight.groundColor.lerpColors(from.hg, to.hg, e);
  dirLight.color.lerpColors(from.dc, to.dc, e);
  if(k>=1) lightLerp = null;
}
function initThree(){
  if(hInit) return true;
  const canvas = $('house-canvas');
  try{
    renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias: !isMobileViewport()});
  }catch(e){ return false; }
  hShadows = !isMobileViewport();
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, isMobileViewport() ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  if(hShadows){ renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-8,8,5,-5,.1,80);
  raycaster = new THREE.Raycaster();
  groundPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);

  hemiLight = new THREE.HemisphereLight(0xfff6e0, 0xcde8b0, .62);
  scene.add(hemiLight);
  dirLight = new THREE.DirectionalLight(0xffffff, .68);
  dirLight.position.set(6,12,4);
  if(hShadows){
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024,1024);
    const sc = dirLight.shadow.camera;
    sc.left = -12; sc.right = 12; sc.top = 12; sc.bottom = -12; sc.far = 40;
  }
  scene.add(dirLight);

  buildWorld();
  buildInterior();

  /* พื้นที่กลมสำหรับโหมดสร้างตัวละคร */
  creatorGroup = new THREE.Group();
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.45,.22,24), toonMat(0x7cc25a));
  plat.position.y = -.11; plat.receiveShadow = hShadows; creatorGroup.add(plat);
  creatorGroup.visible = false;
  scene.add(creatorGroup);

  /* ธีมกลางวัน/กลางคืนเปลี่ยนได้จากหน้าอื่น — เช็คผ่าน observer ตอน view เปิดอยู่ */
  new MutationObserver(()=>{ if(houseOpen) updateLights(); })
    .observe(document.body, {attributes:true, attributeFilter:['class']});

  window.addEventListener('resize', ()=>{ if(!houseOpen) return; renderer.setSize(window.innerWidth, window.innerHeight); applyCamera(); });
  bindCanvasInput(canvas);
  hInit = true;
  return true;
}

/* ---------- input บน canvas ---------- */
function bindCanvasInput(canvas){
  const pointers = new Map();
  let pinchDist = 0, downX = 0, downY = 0, downT = 0, moved = false;

  canvas.addEventListener('pointerdown', e=>{
    pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(pointers.size===2){
      const [a,b] = [...pointers.values()];
      pinchDist = Math.hypot(a.x-b.x, a.y-b.y);
    }
    downX = e.clientX; downY = e.clientY; downT = performance.now(); moved = false;
    if(hMode==='creator'){ creatorState.dragging = true; creatorState.lastX = e.clientX; }
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e=>{
    if(!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(Math.hypot(e.clientX-downX, e.clientY-downY) > 10) moved = true;
    if(hMode==='creator' && creatorState.dragging && pointers.size===1){
      creatorState.rotY += (e.clientX - creatorState.lastX) * .012;
      creatorState.rotTarget = creatorState.rotY;
      creatorState.lastX = e.clientX;
    }
    if(pointers.size===2 && hMode==='world'){
      const [a,b] = [...pointers.values()];
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      if(pinchDist>0){ setZoom(hZoom * (d/pinchDist)); }
      pinchDist = d;
    }
  });
  const endPointer = e=>{
    pointers.delete(e.pointerId);
    if(hMode==='creator') creatorState.dragging = false;
    if(pointers.size<2) pinchDist = 0;
    if(hMode==='world' && !moved && pointers.size===0 && performance.now()-downT < 600){
      handleTap(e.clientX, e.clientY);
    }
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', e=>{ pointers.delete(e.pointerId); if(pointers.size<2) pinchDist = 0; });
  canvas.addEventListener('wheel', e=>{
    if(hMode!=='world') return;
    e.preventDefault();
    setZoom(hZoom * (e.deltaY > 0 ? .92 : 1.08));
  }, {passive:false});
}
function setZoom(z){ hZoom = Math.min(1.8, Math.max(.65, z)); applyCamera(); }

function ndcFromClient(cx, cy){
  return new THREE.Vector2((cx/window.innerWidth)*2-1, -(cy/window.innerHeight)*2+1);
}

function handleTap(cx, cy){
  raycaster.setFromCamera(ndcFromClient(cx,cy), camera);
  if(hScene==='out'){
    /* ยิง ray ใส่ของทั้งฉากแล้วไล่หา tag ที่ ancestor: สัตว์ > บ้าน > ต้นไม้ > ดอกไม้
       (ชนพื้น/ฐานดินจะไม่เจอ tag แล้วตกไปคำนวณช่องเดินจากระนาบพื้นด้านล่างแทน) */
    const hits = raycaster.intersectObjects(worldGroup.children, true);
    if(hits.length){
      let o = hits[0].object;
      while(o && o !== worldGroup){
        if(o.userData.hCritter){ startleCritter(o.userData.hCritter); return; }
        if(o.userData.hHouse){ walkTo(DOOR_TILE.x, DOOR_TILE.z, {enter:true}); return; }
        if(o.userData.hTree){
          const t = o.userData.hTree.tile, g = o;
          const adj = nearestWalkable(outGrid, OUT_W, OUT_D, t.x, t.z);
          if(adj) walkTo(adj.x, adj.z, {action:{type:'tree', group:g}});
          return;
        }
        if(o.userData.hFlower){
          const t = o.userData.hFlower.tile, g = o;
          const adj = nearestWalkable(outGrid, OUT_W, OUT_D, t.x, t.z);
          if(adj) walkTo(adj.x, adj.z, {action:{type:'flower', group:g}});
          return;
        }
        o = o.parent;
      }
    }
  }else{
    if(interiorDoorMesh && raycaster.intersectObject(interiorDoorMesh, false).length){
      walkTo(IN_DOOR_TILE.x, IN_DOOR_TILE.z, {exit:true}); return;
    }
  }
  const pt = new THREE.Vector3();
  if(!raycaster.ray.intersectPlane(groundPlane, pt)) return;
  const out = hScene==='out';
  const W = out?OUT_W:IN_W, D = out?OUT_D:IN_D;
  const gx = Math.round(pt.x + (W-1)/2), gz = Math.round(pt.z + (D-1)/2);
  if(gx<0||gz<0||gx>=W||gz>=D) return;
  walkTo(gx, gz, {});
}

function walkTo(gx, gz, opts){
  const out = hScene==='out';
  const grid = out?outGrid:inGrid, W = out?OUT_W:IN_W, D = out?OUT_D:IN_D;
  const target = nearestWalkable(grid, W, D, gx, gz);
  if(!target) return;
  /* ถ้าแตะใหม่ระหว่างกำลังเดิน ให้เดิน segment ปัจจุบันจนสุดช่องก่อนแล้วต่อเส้นทางใหม่จากช่องนั้น
     (คำนวณจากช่องปลายทางของ segment ที่ค้างอยู่ ไม่ใช่ hChar.tile ที่ยังเป็นช่องเก่า) */
  const inFlight = hChar.walking && hChar.path.length > hChar.seg;
  const startTile = inFlight ? hChar.path[hChar.seg] : hChar.tile;
  const path = findPath(grid, W, D, startTile, target);
  if(!path) return;
  if(inFlight){
    hChar.path = [hChar.path[hChar.seg]].concat(path);
    hChar.seg = 0;               /* segT/segFrom เดิมคงไว้ ให้ lerp segment ค้างอยู่จบเนียนๆ */
  }else{
    hChar.path = path; hChar.seg = 0; hChar.segT = 0;
    hChar.segFrom = {x:hChar.tile.x, z:hChar.tile.z};
  }
  hChar.walking = hChar.path.length > 0;
  hChar.pendingEnter = !!opts.enter;
  hChar.pendingExit = !!opts.exit;
  hChar.action = opts.action || null;
  if(!hChar.walking){ finishArrive(); }
}

function finishArrive(){
  if(hChar.pendingEnter){ hChar.pendingEnter = false; switchScene('in'); }
  else if(hChar.pendingExit){ hChar.pendingExit = false; switchScene('out'); }
  else if(hChar.action){
    const a = hChar.action; hChar.action = null;
    /* หันหน้าเข้าหาเป้าก่อนเล่นเอฟเฟกต์ */
    if(charGroup){
      hChar.targetRotY = Math.atan2(a.group.position.x - charGroup.position.x, a.group.position.z - charGroup.position.z);
    }
    if(a.type==='tree') shakeTree(a.group);
    else if(a.type==='flower') bounceFlower(a.group);
  }
}

function tileWorld(t){
  return hScene==='out'
    ? new THREE.Vector3(outWX(t.x), 0, outWZ(t.z))
    : new THREE.Vector3(inWX(t.x), 0, inWZ(t.z));
}

/* fade ขาวคั่นกลางแล้วค่อยสลับ — ใช้กับทุกการสลับฉาก/โหมดให้ transition นุ่มสม่ำเสมอ */
function fadeSwap(apply){
  const fade = $('house-fade');
  fade.classList.add('on');
  setTimeout(()=>{ apply(); setTimeout(()=>fade.classList.remove('on'), 120); }, 520);
}
/* จอขาวทันทีแล้วค่อยๆ เปิด (ใช้ตอนเพิ่งเข้า view) */
function fadeIn(){
  const fade = $('house-fade');
  fade.style.transition = 'none';
  fade.classList.add('on');
  void fade.offsetWidth;             /* force reflow ให้ opacity 1 ติดก่อนคืน transition */
  fade.style.transition = '';
  setTimeout(()=>fade.classList.remove('on'), 220);
}

function switchScene(to){
  fadeSwap(()=>{
    hScene = to;
    worldGroup.visible = (to==='out');
    interiorGroup.visible = (to==='in');
    if(to==='in'){ hChar.tile = {x:IN_DOOR_TILE.x, z:IN_DOOR_TILE.z+1}; hChar.targetRotY = Math.PI/4; }
    else{ hChar.tile = {x:DOOR_TILE.x, z:DOOR_TILE.z+1}; hChar.targetRotY = Math.PI/4; }
    hChar.path = []; hChar.walking = false;
    const p = tileWorld(hChar.tile);
    charGroup.position.copy(p);
    camTarget.copy(p);
    applyCamera();
  });
}

/* ---------- โหมดสร้างตัวละคร ---------- */
function rebuildChar(cfg){
  const oldRot = charGroup ? charGroup.rotation.y : 0;
  const oldPos = charGroup ? charGroup.position.clone() : null;
  if(charGroup){ scene.remove(charGroup); disposeGroup(charGroup); }
  charGroup = buildCharacter(cfg);
  if(oldPos) charGroup.position.copy(oldPos);
  charGroup.rotation.y = oldRot;
  scene.add(charGroup);
}

function buildCreatorRows(cfg){
  const wrap = $('house-creator-rows');
  wrap.innerHTML = '';
  H_ROWS.forEach(row=>{
    const div = document.createElement('div');
    const lab = document.createElement('div');
    lab.className = 'house-row-label';
    lab.innerHTML = (H_ROW_ICONS[row.key] ? '<span class="house-row-ic">'+H_ROW_ICONS[row.key]+'</span>' : '')
                    + '<span>'+row.label+'</span>';
    div.appendChild(lab);
    const chips = document.createElement('div');
    chips.className = 'house-chip-wrap';
    const n = row.type==='color' ? row.colors.length : (row.type==='num' ? row.n : row.options.length);
    for(let i=0;i<n;i++){
      const b = document.createElement('button');
      b.className = 'house-chip' + (row.type==='color' ? ' house-chip-color' : '');
      b.type = 'button';
      if(row.type==='color'){
        const col = row.colors[i];
        if(col && typeof col === 'object'){          /* แบบ 2 สี: สวอตช์แบ่งครึ่งบน/ล่างเส้นคม สะอาดเหมือนชิปสีเดียว */
          const hx = v => '#'+v.toString(16).padStart(6,'0');
          b.style.background = 'linear-gradient('+hx(col.a)+' 0 50%, '+hx(col.b)+' 50% 100%)';
        }else{
          b.style.background = '#'+col.toString(16).padStart(6,'0');
        }
        b.setAttribute('aria-label', row.label+' แบบที่ '+(i+1));
      }else if(row.type==='num'){ b.textContent = i+1; }
      else{ b.textContent = row.options[i]; }
      if(cfg[row.key]===i) b.classList.add('active');
      b.addEventListener('click', ()=>{
        if(typeof playClick==='function') playClick();
        cfg[row.key] = i;
        chips.querySelectorAll('.house-chip').forEach(c=>c.classList.remove('active'));
        b.classList.add('active');
        rebuildChar(cfg);
      });
      chips.appendChild(b);
    }
    div.appendChild(chips);
    wrap.appendChild(div);
  });
}

let creatorCfg = null;
function openCreator(fromWorld){
  hMode = 'creator';
  creatorState.fromWorld = fromWorld;
  creatorState.rotY = 0; creatorState.rotTarget = 0;
  const saved = loadHouseData();
  creatorCfg = Object.assign({}, H_DEFAULT_CHAR, (saved && saved.char) || {});
  $('house-creator').hidden = false;
  $('house-rotate-wrap').hidden = false;
  $('house-edit-btn').hidden = true;
  $('house-hint').hidden = true;
  /* ไอคอนหัวข้อเป็น SVG ให้เข้าชุด template (ดินสอ = ชุดเดียวกับปุ่มแก้ไข, หน้าเด็ก = ชุด row "หนูเป็น...") */
  const _icChild = '<svg class="house-title-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="#ffe0b3" stroke="#e59a5b" stroke-width="2"/><circle cx="9" cy="11" r="1.3" fill="#6b4a2b"/><circle cx="15" cy="11" r="1.3" fill="#6b4a2b"/><path d="M9 14.6 Q12 17 15 14.6" fill="none" stroke="#c9573f" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const _icPencil = '<svg class="house-title-ic" viewBox="0 0 24 24" fill="none" stroke="#C0527A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="#FFD6E8"/><path d="M15 5l4 4" stroke-width="1.4"/></svg>';
  $('house-creator-title').innerHTML = fromWorld ? (_icPencil + ' แก้ไขตัวละครของหนู') : (_icChild + ' สร้างตัวละครของหนู');
  worldGroup.visible = false; interiorGroup.visible = false;
  creatorGroup.visible = true;
  rebuildChar(creatorCfg);
  charGroup.position.set(0,0,0);
  charGroup.rotation.y = 0;
  buildCreatorRows(creatorCfg);   /* สร้างแถวตัวเลือกใหม่ทุกครั้ง ให้ปุ่ม active ตรง cfg ปัจจุบัน */
  applyCamera();
}
function closeCreator(){
  saveHouseData({char: creatorCfg});
  if(typeof showToast==='function') showToast('🎉', 'เก่งมาก! ตัวละครของหนูพร้อมแล้ว');
  hMode = 'world';
  $('house-creator').hidden = true;
  $('house-rotate-wrap').hidden = true;
  $('house-edit-btn').hidden = false;
  creatorGroup.visible = false;
  worldGroup.visible = (hScene==='out'); interiorGroup.visible = (hScene==='in');
  rebuildChar(creatorCfg);
  const p = tileWorld(hChar.tile);
  charGroup.position.copy(p);
  charGroup.rotation.y = hChar.targetRotY;
  camTarget.copy(p);
  applyCamera();
  showHint();
}

function showHint(){
  const hint = $('house-hint');
  hint.hidden = false; hint.classList.remove('fade-out');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(()=>hint.classList.add('fade-out'), 6000);
}

/* ---------- เอฟเฟกต์ interaction (เขย่าต้นไม้/ดอกไม้เด้ง + อนุภาคใบไม้ร่วง) ---------- */
const fxList = [], particles = [];
let particleGeo = null;
function spawnParticle(x, y, z, color){
  if(!particleGeo) particleGeo = new THREE.SphereGeometry(.055, 6, 5);
  const m = new THREE.Mesh(particleGeo, toonMat(color));  /* material แชร์จาก cache — animate ที่ scale ไม่แตะ opacity */
  m.position.set(x, y, z);
  worldGroup.add(m);
  particles.push({m, vx:(Math.random()-.5)*1.1, vy:.6+Math.random()*.7, vz:(Math.random()-.5)*1.1, life:1.1, max:1.1});
}
function shakeTree(g){
  fxList.push({g, t0:performance.now(), dur:900, kind:'shake'});
  for(let i=0; i<5; i++){
    spawnParticle(g.position.x+(Math.random()-.5)*.9, 1.05+Math.random()*.45, g.position.z+(Math.random()-.5)*.9,
                  i%2 ? 0x66c878 : 0xffffff);
  }
  if(typeof playClick==='function') playClick();
}
function bounceFlower(g){
  fxList.push({g, t0:performance.now(), dur:700, kind:'bounce'});
  spawnParticle(g.position.x, .45, g.position.z, 0xffd54f);
  spawnParticle(g.position.x, .5, g.position.z, 0xfff4c2);
  if(typeof playClick==='function') playClick();
}
function updateFx(now, dt){
  for(let i=fxList.length-1; i>=0; i--){
    const f = fxList[i];
    const k = (now - f.t0) / f.dur;
    if(k >= 1){
      if(f.kind==='shake') f.g.rotation.z = 0;
      else f.g.scale.set(1,1,1);
      fxList.splice(i,1); continue;
    }
    if(f.kind==='shake') f.g.rotation.z = Math.sin(k*Math.PI*5)*(1-k)*.14;
    else { const s = 1 + Math.sin(k*Math.PI)*.4; f.g.scale.set(s,s,s); }
  }
  for(let i=particles.length-1; i>=0; i--){
    const p = particles[i];
    p.life -= dt;
    if(p.life <= 0){ worldGroup.remove(p.m); particles.splice(i,1); continue; }
    p.vy -= 3*dt;
    p.m.position.x += p.vx*dt; p.m.position.y += p.vy*dt; p.m.position.z += p.vz*dt;
    if(p.m.position.y < .05) p.m.position.y = .05;
    const s = Math.max(.01, p.life/p.max);
    p.m.scale.set(s,s,s);
  }
}

/* ---------- สัตว์ตัวเล็กเดินเข้า-ออกฉาก (นก/กระต่าย/กระรอก) ให้โลกมีชีวิต ---------- */
const CRITTER_MAX = 4;
const critters = [];
let critterSpawnT = 3;
let outEdgeTiles = null;

function collectEdgeTiles(){
  outEdgeTiles = [];
  for(let x=0; x<OUT_W; x++){
    if(isWalk(outGrid,OUT_W,OUT_D,x,0)) outEdgeTiles.push({x, z:0});
    if(isWalk(outGrid,OUT_W,OUT_D,x,OUT_D-1)) outEdgeTiles.push({x, z:OUT_D-1});
  }
  for(let z=0; z<OUT_D; z++){
    if(isWalk(outGrid,OUT_W,OUT_D,0,z)) outEdgeTiles.push({x:0, z});
    if(isWalk(outGrid,OUT_W,OUT_D,OUT_W-1,z)) outEdgeTiles.push({x:OUT_W-1, z});
  }
}
function edgeOutwardDir(t){
  return {x: t.x===0 ? -1 : (t.x===OUT_W-1 ? 1 : 0), z: t.z===0 ? -1 : (t.z===OUT_D-1 ? 1 : 0)};
}
function randomGrassTile(){
  for(let i=0; i<40; i++){
    const x = (Math.random()*OUT_W)|0, z = (Math.random()*OUT_D)|0;
    if(outGrid[z][x]===0) return {x, z};
  }
  return {x:SPAWN_TILE.x, z:SPAWN_TILE.z};
}

function buildCritter(type){
  const g = new THREE.Group(); const u = {};
  if(type==='rabbit'){
    const c = 0xf7f3ee;
    const body = box(.26,.2,.32,c); body.position.y = .16; g.add(body);
    const head = box(.2,.18,.18,c); head.position.set(0,.32,.16); g.add(head);
    [-1,1].forEach(s=>{
      const ear = box(.055,.2,.05,c); ear.position.set(.055*s,.5,.13); g.add(ear);
      const inner = box(.025,.12,.02,0xf4b8c8); inner.position.set(.055*s,.49,.156); g.add(inner);
    });
    const tail = sphere(.07,0xffffff,8); tail.position.set(0,.18,-.18); g.add(tail);
    const nose = sphere(.025,0xf48fb1,6); nose.position.set(0,.31,.26); g.add(nose);
    [-1,1].forEach(s=>{ const eye = sphere(.02,0x33261d,6); eye.position.set(.06*s,.35,.245); g.add(eye); });
  }else if(type==='bird'){
    const c = [0xe57373,0x64b5f6,0xffd54f][(Math.random()*3)|0];
    const body = sphere(.12,c,10); body.scale.set(1,.95,1.25); body.position.y = .15; g.add(body);
    const head = sphere(.09,c,10); head.position.set(0,.28,.1); g.add(head); u.head = head;
    const beak = new THREE.Mesh(new THREE.ConeGeometry(.03,.09,6), toonMat(0xf5a623));
    beak.castShadow = hShadows; beak.rotation.x = Math.PI/2; beak.position.set(0,.27,.21); g.add(beak);
    u.wings = [-1,1].map(s=>{
      const piv = new THREE.Group(); piv.position.set(.1*s,.18,.02); piv.userData.side = s;
      const w = box(.2,.03,.13,c); w.position.x = .11*s; piv.add(w);
      g.add(piv); return piv;
    });
    const tail = box(.06,.025,.15,c); tail.position.set(0,.16,-.18); g.add(tail);
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x33261d,6); eye.position.set(.05*s,.3,.17); g.add(eye); });
  }else if(type==='squirrel'){
    const c = 0xa1887f;
    const body = box(.2,.18,.26,c); body.position.y = .14; g.add(body);
    const head = box(.16,.14,.14,c); head.position.set(0,.27,.14); g.add(head);
    [-1,1].forEach(s=>{ const ear = box(.04,.07,.03,c); ear.position.set(.05*s,.37,.12); g.add(ear); });
    const tail = box(.08,.32,.08,0x8d6e63); tail.rotation.x = -.55; tail.position.set(0,.28,-.24); g.add(tail); u.tail = tail;
    const nose = sphere(.02,0x5d4037,6); nose.position.set(0,.27,.22); g.add(nose);
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x33261d,6); eye.position.set(.05*s,.3,.2); g.add(eye); });
  }else if(type==='chicken'){
    const c = 0xfdf6ec;
    const body = box(.24,.2,.28,c); body.position.y = .17; g.add(body);
    const head = box(.15,.16,.14,c); head.position.set(0,.36,.12); g.add(head); u.head = head;
    const comb = box(.04,.08,.1,0xe53935); comb.position.set(0,.47,.1); g.add(comb);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(.03,.08,6), toonMat(0xf5a623));
    beak.castShadow = hShadows; beak.rotation.x = Math.PI/2; beak.position.set(0,.35,.22); g.add(beak);
    const wattle = sphere(.025,0xe53935,6); wattle.position.set(0,.29,.19); g.add(wattle);
    const tail = box(.06,.14,.1,0xe8ddc8); tail.rotation.x = .5; tail.position.set(0,.26,-.16); g.add(tail);
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x33261d,6); eye.position.set(.05*s,.38,.18); g.add(eye); });
  }else if(type==='cat'){
    const c = Math.random()<.5 ? 0xffb74d : 0x90a4ae;
    const body = box(.22,.18,.36,c); body.position.y = .15; g.add(body);
    const head = box(.2,.17,.16,c); head.position.set(0,.32,.2); g.add(head);
    [-1,1].forEach(s=>{ const ear = new THREE.Mesh(new THREE.ConeGeometry(.045,.09,4), toonMat(c));
      ear.castShadow = hShadows; ear.position.set(.07*s,.44,.18); g.add(ear); });
    const tail = box(.05,.3,.05,c); tail.rotation.x = -.6; tail.position.set(0,.26,-.3); g.add(tail); u.tail = tail;
    const muzzle = box(.08,.05,.03,0xfff3e0); muzzle.position.set(0,.28,.285); g.add(muzzle);
    const nose = sphere(.016,0xe57373,6); nose.position.set(0,.31,.29); g.add(nose);
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x2e7d32,6); eye.position.set(.06*s,.34,.285); g.add(eye); });
  }else if(type==='duck'){
    const body = sphere(.16,0xfff8e7,10); body.scale.set(1,.75,1.3); body.position.y = .1; g.add(body);
    const head = sphere(.1,0xfff8e7,10); head.position.set(0,.3,.14); g.add(head); u.head = head;
    const beak = box(.09,.03,.1,0xf5a623); beak.position.set(0,.28,.26); g.add(beak);
    const wing = box(.05,.08,.18,0xf3e5c3); wing.position.set(.13,.12,-.02); g.add(wing);
    const wing2 = box(.05,.08,.18,0xf3e5c3); wing2.position.set(-.13,.12,-.02); g.add(wing2);
    const tail = box(.07,.05,.08,0xf3e5c3); tail.rotation.x = .5; tail.position.set(0,.14,-.2); g.add(tail);
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x33261d,6); eye.position.set(.05*s,.33,.21); g.add(eye); });
  }else{ /* fish */
    const c = [0xff8a65,0x4fc3f7,0xffd54f][(Math.random()*3)|0];
    const body = sphere(.11,c,10); body.scale.set(.8,.9,1.6); body.position.y = .05; g.add(body);
    const tailf = new THREE.Mesh(new THREE.ConeGeometry(.07,.14,6), toonMat(c));
    tailf.castShadow = hShadows; tailf.rotation.x = -Math.PI/2; tailf.position.set(0,.05,-.22); g.add(tailf); u.tail = tailf;
    const fin = box(.02,.08,.09,c); fin.position.set(0,.15,0); g.add(fin);
    [-1,1].forEach(s=>{ const eye = sphere(.015,0x33261d,6); eye.position.set(.06*s,.08,.13); g.add(eye); });
  }
  g.userData.hCritter = g;             /* tag ไว้ที่ group — ancestor walk ตอน raycast เจอแน่ */
  g.userData.anim = u;
  return g;
}

function critterLine(c, from, to, speed, arc){
  c.mode = 'line';
  c.line = {a: from.clone(), b: to.clone(), k: 0, dur: Math.max(.25, from.distanceTo(to)/speed), arc: arc||0};
  c.group.rotation.y = Math.atan2(to.x-from.x, to.z-from.z);
}
function critterPathTo(c, toTile){
  const target = nearestWalkable(outGrid, OUT_W, OUT_D, toTile.x, toTile.z);
  const path = target && findPath(outGrid, OUT_W, OUT_D, c.tile, target);
  if(!path || !path.length){ c.mode = 'idle'; c.pauseT = .8; return false; }
  c.mode = 'path'; c.path = path; c.seg = 0; c.segT = 0; c.segFrom = {...c.tile};
  return true;
}
function critterTileV(t){ return new THREE.Vector3(outWX(t.x), 0, outWZ(t.z)); }

/* น้ำในคลอง: world x ∈ [2.0,4.0] (gx 11-12), แบ่งเหนือ/ใต้สะพาน (สัตว์น้ำไม่ลอดใต้สะพาน) */
const WATER_Y = -.13;
function randWaterPoint(region){
  return new THREE.Vector3(region.xmin + Math.random()*(region.xmax-region.xmin), WATER_Y,
                           region.zmin + Math.random()*(region.zmax-region.zmin));
}
const CRITTER_DOMAIN = {rabbit:'land', squirrel:'land', chicken:'land', cat:'land', bird:'air', duck:'water', fish:'water'};

function spawnCritter(){
  if(!outEdgeTiles || !outEdgeTiles.length) return;
  const types = ['rabbit','bird','squirrel','chicken','cat','duck','fish'];
  const type = types[(Math.random()*types.length)|0];
  const domain = CRITTER_DOMAIN[type];
  const g = buildCritter(type);
  const c = {type, domain, group:g, tile:null, path:[], seg:0, segT:0, segFrom:null,
             state:'enter', mode:'line', pauseT:0, legs: 2+((Math.random()*3)|0),
             speed: {squirrel:3.2, rabbit:2.3, bird:2.6, chicken:2, cat:2.4, duck:1.4, fish:2.2}[type],
             t: Math.random()*10};
  if(domain==='air'){
    const land = randomGrassTile();
    const dir = {x: Math.random()<.5 ? -1 : 1, z: Math.random()<.5 ? -1 : 1};
    c.tile = land;
    g.position.set(critterTileV(land).x + dir.x*6, 2.4, critterTileV(land).z + dir.z*4);
    critterLine(c, g.position.clone(), critterTileV(land), 3.2, .3);
  }else if(domain==='water'){
    const north = Math.random() < .5;
    c.water = {xmin:2.15, xmax:3.85, zmin: north ? -6.3 : 1.7, zmax: north ? -1.7 : 6.3, exitZ: north ? -9 : 9};
    const start = new THREE.Vector3(2.15 + Math.random()*1.7, WATER_Y, c.water.exitZ);
    g.position.copy(start);
    critterLine(c, start, randWaterPoint(c.water), c.speed);
  }else{
    const edge = outEdgeTiles[(Math.random()*outEdgeTiles.length)|0];
    const dir = edgeOutwardDir(edge);
    const edgeV = critterTileV(edge);
    c.tile = {...edge};
    g.position.set(edgeV.x + dir.x*1.8, 0, edgeV.z + dir.z*1.8);
    critterLine(c, g.position.clone(), edgeV, c.speed);
  }
  worldGroup.add(g);
  critters.push(c);
}

function removeCritter(c){
  worldGroup.remove(c.group);
  disposeGroup(c.group);
  const i = critters.indexOf(c);
  if(i>=0) critters.splice(i,1);
}

function critterExitMove(c, fast){
  const sp = c.speed * (fast ? 1.7 : 1);
  if(c.domain==='air'){
    const dir = {x: Math.random()<.5 ? -1 : 1, z: Math.random()<.5 ? -1 : 1};
    critterLine(c, c.group.position.clone(),
      new THREE.Vector3(c.group.position.x + dir.x*14, 3, c.group.position.z + dir.z*10), fast ? 4.5 : 3.4, .2);
  }else if(c.domain==='water'){
    critterLine(c, c.group.position.clone(),
      new THREE.Vector3(c.group.position.x, WATER_Y, c.water.exitZ), sp);
  }else{
    const edge = outEdgeTiles[(Math.random()*outEdgeTiles.length)|0];
    c.speed = sp;
    critterPathTo(c, edge);
  }
}

function startleCritter(c0){
  /* c0 คือ group — หา object critter จริง */
  const c = critters.find(k=>k.group===c0);
  if(!c || c.state==='exit') return;
  if(typeof playClick==='function') playClick();
  c.startle = .5;                       /* กระโดดตกใจสั้นๆ ก่อนวิ่ง/บิน/ว่ายหนี */
  if(c.type==='fish') c.jump = {k:0};   /* ปลาตกใจ = กระโดดพ้นน้ำ */
  c.state = 'exit';
  critterExitMove(c, true);
}

function updateCritters(dt, t){
  critterSpawnT -= dt;
  if(critters.length < CRITTER_MAX && critterSpawnT <= 0){
    spawnCritter();
    critterSpawnT = 6 + Math.random()*8;
  }
  for(let i=critters.length-1; i>=0; i--){
    const c = critters[i];
    c.t += dt;
    const u = c.group.userData.anim;
    let moving = false;

    if(c.mode==='line'){
      c.line.k += dt / c.line.dur;
      const k = Math.min(1, c.line.k);
      c.group.position.lerpVectors(c.line.a, c.line.b, k);
      if(c.line.arc){ /* โค้งกลางอากาศ (นกบิน) */
        c.group.position.y = c.line.a.y + (c.line.b.y - c.line.a.y)*k + Math.sin(k*Math.PI)*c.line.arc;
      }
      moving = true;
      if(k>=1){
        if(c.state==='exit'){ removeCritter(c); continue; }
        c.state = 'wander'; c.mode = 'idle'; c.pauseT = 1 + Math.random()*1.6;
      }
    }else if(c.mode==='path'){
      const from = c.segFrom, to = c.path[c.seg];
      c.segT += dt * c.speed;
      const k = Math.min(1, c.segT);
      c.group.position.lerpVectors(critterTileV(from), critterTileV(to), k);
      if(from.x!==to.x || from.z!==to.z) c.group.rotation.y = Math.atan2(to.x-from.x, to.z-from.z);
      moving = true;
      if(k>=1){
        c.segT = 0; c.tile = to; c.segFrom = to; c.seg++;
        if(c.seg >= c.path.length){
          if(c.state==='exit'){
            /* ถึงขอบแล้ว เดินเส้นตรงออกนอกแผนที่ */
            const dir = edgeOutwardDir(c.tile);
            critterLine(c, c.group.position.clone(),
              new THREE.Vector3(c.group.position.x + dir.x*2, 0, c.group.position.z + dir.z*2), c.speed);
          }else{
            c.mode = 'idle'; c.pauseT = 1 + Math.random()*2;
          }
        }
      }
    }else{ /* idle */
      c.pauseT -= dt;
      if(c.pauseT <= 0){
        c.legs--;
        if(c.legs <= 0){
          c.state = 'exit';
          critterExitMove(c, false);
        }else if(c.domain==='air'){
          /* นกขยับที่ด้วยการ "บินข้าม" เสมอ ไม่เดินไถลพื้น (บั๊กเดิม: ใช้ path เดินแบบสัตว์บก) */
          const land = randomGrassTile();
          c.tile = land;
          critterLine(c, c.group.position.clone(), critterTileV(land), 3, .9);
        }else if(c.domain==='water'){
          critterLine(c, c.group.position.clone(), randWaterPoint(c.water), c.speed);
        }else{
          critterPathTo(c, randomGrassTile());
        }
      }
    }

    /* ท่าทางตามชนิด */
    if(c.type==='rabbit'){
      c.group.position.y = moving ? Math.abs(Math.sin(c.t*9))*.16 : 0;
    }else if(c.type==='squirrel'){
      c.group.position.y = moving ? Math.abs(Math.sin(c.t*13))*.07 : 0;
      if(u.tail) u.tail.rotation.x = -.55 + Math.sin(c.t*7)*.15;
    }else if(c.type==='chicken'){
      c.group.position.y = moving ? Math.abs(Math.sin(c.t*11))*.08 : 0;
      if(u.head) u.head.rotation.x = moving ? 0 : Math.max(0, Math.sin(c.t*5))*.5; /* จิกพื้นตอนหยุด */
    }else if(c.type==='cat'){
      c.group.position.y = 0;
      c.group.rotation.z = moving ? Math.sin(c.t*8)*.04 : 0;
      if(u.tail) u.tail.rotation.z = Math.sin(c.t*3)*.25; /* แกว่งหางช้าๆ ตลอด */
    }else if(c.type==='bird'){
      const flying = c.mode==='line';
      if(!flying) c.group.position.y = 0;
      if(u.wings) u.wings.forEach(w=>{ w.rotation.z = flying ? Math.sin(c.t*22)*.7*w.userData.side : 0; });
      if(u.head && !flying) u.head.rotation.x = Math.max(0, Math.sin(c.t*5))*.55; /* จิกพื้น */
    }else if(c.type==='duck'){
      if(c.mode!=='line') c.group.position.y = WATER_Y + Math.sin(c.t*2.6)*.02; /* ลอยตุ๊บป่อง */
      else c.group.position.y += Math.sin(c.t*2.6)*.02;
      if(u.head) u.head.rotation.x = (c.mode==='idle' && Math.sin(c.t*.9)>.55) ? .9 : 0; /* มุดหาปลาเป็นพักๆ */
    }else if(c.type==='fish'){
      if(c.mode!=='line') c.group.position.y = WATER_Y;
      if(u.tail) u.tail.rotation.z = Math.sin(c.t*10)*.4; /* โบกหาง */
      if(!c.jump && c.mode==='line' && Math.random() < dt*.22) c.jump = {k:0}; /* กระโดดพ้นน้ำเป็นครั้งคราว */
      if(c.jump){
        c.jump.k += dt/.9;
        const jk = Math.min(1, c.jump.k);
        c.group.position.y += Math.sin(jk*Math.PI)*.55;
        c.group.rotation.x = -Math.sin(jk*Math.PI)*.8;
        if(jk>=1){ c.jump = null; c.group.rotation.x = 0; }
      }
    }
    if(c.startle){
      c.startle -= dt;
      c.group.position.y += Math.max(0, Math.sin((0.5-c.startle)/0.5*Math.PI))*.3;
      if(c.startle<=0) c.startle = 0;
    }
  }
}

/* ---------- ป้ายชื่อตัวละคร (ชื่อเด็ก) ลอยเหนือหัว ---------- */
const _nameV = new THREE.Vector3();
function updateNameLabel(){
  const el = $('house-char-name');
  if(!charGroup || !houseOpen){ el.hidden = true; return; }
  _nameV.set(charGroup.position.x, charGroup.position.y + 2.05, charGroup.position.z).project(camera);
  el.style.left = ((_nameV.x+1)/2*window.innerWidth).toFixed(1)+'px';
  el.style.top = ((1-_nameV.y)/2*window.innerHeight).toFixed(1)+'px';
  el.hidden = false;
}

/* ---------- loop ---------- */
const WALK_SPEED = 3;      /* ช่อง/วินาที */
function frame(t){
  if(!houseOpen) return;
  rafId = requestAnimationFrame(frame);
  const dt = Math.min(.05, (t - lastT)/1000 || 0);
  lastT = t;
  updateLightLerp(dt);
  const u = charGroup && charGroup.userData;

  if(hMode==='creator'){
    /* ไม่มี auto-rotate (ผู้ใช้ขอเอาออก) — หมุนนุ่มๆ เข้าหามุมจากปุ่ม ↺/↻ หรือหมุนตามนิ้วลากตรงๆ */
    if(!creatorState.dragging){
      creatorState.rotY += (creatorState.rotTarget - creatorState.rotY) * Math.min(1, dt*9);
    }
    if(charGroup){
      charGroup.rotation.y = creatorState.rotY;
      /* ท่ายืนหายใจเบาๆ ให้ดูมีชีวิต */
      if(u){ u.rig.position.y = Math.sin(t*.0022)*.02; u.arms[0].rotation.z = -.16-Math.sin(t*.0022)*.03; u.arms[1].rotation.z = .16+Math.sin(t*.0022)*.03; }
    }
  }else if(charGroup){
    if(hChar.walking && hChar.path.length){
      const from = hChar.segFrom || hChar.tile;
      const to = hChar.path[hChar.seg];
      hChar.segT += dt*WALK_SPEED;
      const a = tileWorld(from), b = tileWorld(to);
      const k = Math.min(1, hChar.segT);
      charGroup.position.lerpVectors(a, b, k);
      if(from.x!==to.x || from.z!==to.z) hChar.targetRotY = Math.atan2(b.x-a.x, b.z-a.z);
      if(k>=1){
        hChar.segT = 0; hChar.tile = to; hChar.segFrom = to; hChar.seg++;
        if(hChar.seg >= hChar.path.length){
          hChar.path = []; hChar.walking = false;
          finishArrive();
        }
      }
      if(u){
        const sw = Math.sin(t*.014)*.55;
        u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw;
        u.arms[0].rotation.x = -sw*.8; u.arms[1].rotation.x = sw*.8;
        u.rig.position.y = Math.abs(Math.sin(t*.014))*.05;
      }
    }else if(u){
      /* idle: โยกเบาๆ แขนขากลับท่ายืน */
      ['legs','arms'].forEach(part=>u[part].forEach(p=>{ p.rotation.x *= .82; }));
      u.rig.position.y = Math.sin(t*.0022)*.02;
      u.arms[0].rotation.z = -.16-Math.sin(t*.0022)*.03;
      u.arms[1].rotation.z = .16+Math.sin(t*.0022)*.03;
    }
    /* หมุนตัวนุ่มๆ เข้าหาทิศเดิน */
    let dr = hChar.targetRotY - charGroup.rotation.y;
    while(dr > Math.PI) dr -= Math.PI*2;
    while(dr < -Math.PI) dr += Math.PI*2;
    charGroup.rotation.y += dr * Math.min(1, dt*10);
    /* กล้องตามตัวละคร */
    camTarget.lerp(charGroup.position, Math.min(1, dt*4));
    applyCamera();
    updateCritters(dt, t);
    updateFx(t, dt);
  }
  updateNameLabel();
  renderer.render(scene, camera);
}

/* ---------- เข้า/ออก view ---------- */
function startHouseGame(){
  if(typeof playClick==='function') playClick();
  if(!activeChild){ if(typeof showToast==='function') showToast('🙈','เลือกโปรไฟล์ก่อนนะ'); return; }
  if(!initThree()){
    if(typeof showToast==='function') showToast('😢','อุปกรณ์นี้เปิดบ้าน 3D ไม่ได้');
    return;
  }
  /* ซ่อน view อื่นทั้งหมด (pattern เดียวกับ startQuiz/startARGame) */
  homeView.hidden = true; quizView.hidden = true; resultView.hidden = true; arView.hidden = true;
  memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true; musicView.hidden = true;
  houseView.hidden = false;
  document.body.classList.add('house-open');
  houseOpen = true;
  $('house-char-name').textContent = activeChild.name;
  syncHouseCtrls();
  fadeIn();
  if(!critters.length) critterSpawnT = Math.min(critterSpawnT, 2.5);

  /* บ้านผูกกับเด็กที่เลือกเสมอ — สลับเด็กแล้วต้องโหลดตัวละคร/ตำแหน่งของคนใหม่ */
  const childChanged = loadedChildId !== activeChild.id;
  loadedChildId = activeChild.id;
  if(childChanged){
    hScene = 'out';
    worldGroup.visible = true; interiorGroup.visible = false;
    hChar.tile = {x:SPAWN_TILE.x, z:SPAWN_TILE.z};
    hChar.path = []; hChar.walking = false; hChar.pendingEnter = false; hChar.pendingExit = false;
    hChar.targetRotY = Math.PI/4;
  }
  updateLights(true);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const data = loadHouseData();
  if(!data || !data.char){
    openCreator(false);
  }else{
    /* กดย้อนกลับค้างไว้ตอนอยู่ใน creator แล้วเข้าใหม่: openCreator เคยปิด worldGroup
       และ rebuildChar เป็นหน้าตาพรีวิวที่ยังไม่ save — ต้อง restore ฉาก + ตัวละครจากที่ save จริงเสมอ */
    const wasCreator = hMode === 'creator';
    hMode = 'world';
    $('house-creator').hidden = true;
    $('house-rotate-wrap').hidden = true;
    $('house-edit-btn').hidden = false;
    creatorGroup.visible = false;
    worldGroup.visible = (hScene==='out'); interiorGroup.visible = (hScene==='in');
    if(childChanged || wasCreator || !charGroup) rebuildChar(data.char);
    const p = tileWorld(hChar.tile);
    charGroup.position.copy(p);
    charGroup.rotation.y = hChar.targetRotY;
    camTarget.copy(p);
    applyCamera();
    showHint();
  }
  lastT = performance.now();
  rafId = requestAnimationFrame(frame);
}

function stopHouseGame(){
  houseOpen = false;
  if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
  document.body.classList.remove('house-open');
  houseView.hidden = true;
  $('house-char-name').hidden = true;
  homeView.hidden = false;
}

/* ---------- ปุ่มควบคุมธีม/เพลง/เสียงในโหมดบ้าน ----------
   เป็น proxy คลิกปุ่มจริงใน header (ถูกซ่อนด้วย body.house-open) แล้ว mirror icon/class
   กลับมา ให้สถานะตรงกันเสมอโดยไม่ต้อง copy logic — ปุ่มเต็มจอไม่อยู่ในนี้เพราะผูกกับ
   fsBtns array ใน js/app.js ตรงๆ ตามกติกา CLAUDE.md */
const HOUSE_CTRL_PROXY = [
  ['house-theme-toggle','theme-toggle'],
  ['house-music-toggle','music-toggle'],
  ['house-sound-toggle','sound-toggle'],
];
function syncHouseCtrls(){
  HOUSE_CTRL_PROXY.forEach(([hid,sid])=>{
    const h = $(hid), s = $(sid);
    if(h && s){ h.innerHTML = s.innerHTML; h.className = s.className; }
  });
}

/* ---------- bind ปุ่ม ---------- */
$('house-entry-btn').addEventListener('click', startHouseGame);
$('house-back').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); stopHouseGame(); });
$('house-edit-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode!=='creator') fadeSwap(()=>openCreator(true));
});
$('house-done-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  fadeSwap(()=>closeCreator());
});
HOUSE_CTRL_PROXY.forEach(([hid,sid])=>{
  $(hid).addEventListener('click', ()=>{
    $(sid).click();
    setTimeout(syncHouseCtrls, 0);
  });
});
$('house-rot-left').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  creatorState.rotTarget += Math.PI/4;
});
$('house-rot-right').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  creatorState.rotTarget -= Math.PI/4;
});
})();
