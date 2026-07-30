/* ============================================================
   บ้านของหนู (My House) — เฟส 2: แผนที่นอกบ้านกว้างขึ้น + ในบ้าน 4 ห้อง + สัตว์เลี้ยง
   (เฟส 1: สร้างตัวละคร 3D + แผนที่นอกบ้าน + เข้าบ้าน)
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
/* ---------- ผังเมือง/ข้อมูลแผนที่ทั้งหมดอยู่ใน js/house-map.js (โหลดก่อนไฟล์นี้เสมอ) ----------
   ดึงกลับมาเป็นตัวแปรชื่อเดิมทุกตัว โค้ดส่วนที่เหลือของไฟล์นี้จึงใช้งานได้เหมือนเดิมทุกบรรทัด */
if(typeof HOUSE_MAP !== 'function') return;   /* แผนที่โหลดไม่สำเร็จ → ปิดโหมดบ้านเงียบๆ เหมือนกรณี THREE */
const {
  H_SKIN, H_HAIR_COLORS, H_EYE_COLORS, H_SHIRT_COLORS, H_BOTTOM_COLORS, H_SHOE_COLORS,
  H_HAIR_N, H_EYE_N, H_DEFAULT_CHAR, H_ROWS, H_ROW_ICONS, NPAD,
  EPAD, EPAD2, EPAD_ALL, OUT_W, OUT_D, sx,
  sz, sRect, sTile, sList, s2z, s2Rect,
  s2Tile, s2List, RIVER_X, BRIDGE_Z, BRIDGE2_Z, FARM_BRIDGE_Z,
  BRIDGES, HOUSE_FOOT, DOOR_TILE, SPAWN_TILE, TREES, FLOWERS,
  YARD, GATE_TILE, PET_HOUSE_TILE, HOUSE_VIEW, HOME_ZONE, HOME_EDGE_Z,
  HOME_EXIT_X, VILLAGE_X0, VILLAGE_ROADS, VILLAGE2_ROADS, PLAZA, FOUNTAIN,
  VILLAGE_LOTS, LOT_BY_ID, WILD_GROVES, WILD_BUSHES, WILD_MUSHROOMS, POND,
  CANAL_Z, CANAL_X0, CANAL_X1, CANAL_BRIDGE_X, FARM_PLOTS, FARM_TRAIL,
  SEA_X0, SEA_SLOPE, SEA_MAX_Z, SEA_BASE_Z, BEACH_W, PALM_SPOTS,
  BOAT_SPOTS, BEACHED_BOAT, FISH_RACKS, ANIMAL_PENS, FARM_ANIMALS, FARM_PROPS,
  POND_DUCKS, POND_PIER, FISHER_TILE, PLAZA2, STAGE, BANNER_POLES,
  BENCH_SPOTS, CART_SPOTS, SCHOOL_BOX, SCHOOL_LOT, SCHOOL_GATE, SCHOOL_FLAG,
  CARPENTER_PROPS, CARPENTER_YARD, CARPENTER_ROAM, FLOWER_BEDS, FLOWER_FIELD, FLOWER_FIELD_PATH,
  FIELD_ROW_COLORS, FLOWER_MEADOW, MEADOW_TRAILS, POOL, POOL_DECK, POOL_PROPS,
  PLAZA_YARD, PLAZA_GATES, NPC_DEFS, FARM_ROAM, NPCS, NPC_TILES,
  NPC_STAND, QUEST_BOARD, LAMP_FIXED, LAMP_SPOTS, LAMP_SET, HEDGE_LINES,
  HEDGE_SET, HEDGE_TILES, isBridgeZ, isFenceTile, inHomeZone, clampHomeTile,
  lotDoorTile, isPondTile, isCanalTile, isCanalBridgeTile, farmPlotAt, isCropTile,
  seaEdgeZ, isSeaTile, isSandTile, isWetSandTile, penAt, isPenFenceTile,
  isPenSoilTile, inSchoolYard, isSchoolFenceTile, inMeadowTrail, inPool, inPoolDeck,
  inPlazaYard, inPlazaGate, inFlowerBed, npcHash, npcFaceVariety, isQuestBoardTile,
  isLampTile, isHedgeTile,
} = HOUSE_MAP({ inBox });

function isSceneryPropTile(x, z){
  const hit = a => a.some(p => p[0]===x && p[1]===z);
  return hit(BENCH_SPOTS) || hit(CART_SPOTS) || hit(FARM_PROPS) || hit(BANNER_POLES) || hit(FISH_RACKS)
      || hit(NPC_STAND) || isQuestBoardTile(x, z) || inFlowerBed(x, z) || hit(CARPENTER_PROPS)
      || inPool(x, z) || hit(POOL_PROPS)
      || (x===SCHOOL_FLAG.x && z===SCHOOL_FLAG.z) || isSchoolFenceTile(x, z)
      || (x>=STAGE.x0 && x<=STAGE.x1 && z>=STAGE.z0 && z<=STAGE.z1)
      || isLampTile(x, z) || isHedgeTile(x, z);   /* เสาไฟ/แนวพุ่มไม้จองช่องไว้ ของฉากสุ่มห้ามงอกทับ */
}

/* ---------- ที่นั่งของฉากตายตัว (ม้านั่ง + เก้าอี้ผ้าใบชายหาด) ----------
   ของพวกนี้ถูก merge geometry รวมกับฉากไปแล้ว (ไม่มี group ของตัวเอง) จึงเก็บแค่ "ช่อง + ทิศ" ไว้
   แตะแล้วสร้าง group จำลอง {position, rotation, userData} ส่งให้ startSit ที่ใช้แค่ 3 ค่านี้ */
const seatMap = new Map();
const SEAT_ITEMS = {
  bench: {id:'scene-bench', name:'ม้านั่ง',      sit:{sy:.56, dz:-.06}},
  deck:  {id:'scene-deck',  name:'เก้าอี้ผ้าใบ', sit:{sy:.54, dz:-.04, lean:-.4, legBend:-.5}},
};
const SEAT_FWD = [[0,1],[1,0],[0,-1],[-1,0]];   /* ทิศ "หน้า" ของที่นั่งตาม rot (local +z) */
function addSeatSpot(x, z, rot, kind){ seatMap.set(x+','+z, {x, z, rot:(rot||0)%4, kind}); }
function seatNear(pt){                          /* หา ที่นั่ง ที่ใกล้จุดที่แตะที่สุด (จุดชนอยู่บนตัวเก้าอี้) */
  let best = null, bd = .95;
  seatMap.forEach(s=>{
    const d = Math.hypot(pt.x - outWX(s.x), pt.z - outWZ(s.z));
    if(d < bd){ bd = d; best = s; }
  });
  return best;
}
function sitOnSeat(s){
  const d = SEAT_FWD[s.rot];
  const f = {x:s.x + d[0], z:s.z + d[1]};
  const stand = isWalk(outGrid, OUT_W, OUT_D, f.x, f.z) ? f : nearestWalkable(outGrid, OUT_W, OUT_D, s.x, s.z);
  if(!stand) return;
  const g = {position:new THREE.Vector3(outWX(s.x), 0, outWZ(s.z)),
             rotation:{y:s.rot * Math.PI/2}, userData:{}};
  walkTo(stand.x, stand.z, {action:{type:'decor', group:g, item:SEAT_ITEMS[s.kind] || SEAT_ITEMS.bench,
    act:'sit', pos:g.position.clone()}});
}

/* ---------- ห้องในบ้าน (20×14 แบ่ง 4 ห้อง ขนาดสมส่วนตามการใช้งาน — กว้างเผื่อเฟอร์นิเจอร์เฟส 3) ----------
   กำแพงกั้นแนวนอนที่ z=7 + แนวตั้ง "คนละแนว" บน/ล่าง (กำแพงเตี้ย .95 มองข้ามได้ ไม่บังตัวละคร)
   ├ ห้องนั่งเล่น (x0-11, z0-6 ใหญ่สุด มีประตูเข้าบ้าน)  ├ ห้องครัว (x13-19, z0-6 กลาง)
   ├ ห้องนอน (x0-13, z8-13 ใหญ่รอง)                    ├ ห้องน้ำ (x15-19, z8-13 เล็กสุด)
   ช่องประตูระหว่างห้อง: แถว z=7 เว้น x 3-4 (นั่งเล่น↔นอน) และ x 16-17 (ครัว↔น้ำ)
   คอลัมน์บน x=12 เว้น z 2-3 (นั่งเล่น↔ครัว), คอลัมน์ล่าง x=14 เว้น z 10-11 (นอน↔น้ำ) */
const IN_W = 20, IN_D = 14;
const IN_DOOR_TILE = {x:4, z:0};
const IN_WALL_ROW = 7;
const IN_COL_TOP = 12, IN_COL_BOT = 14;  /* กำแพงแนวตั้งครึ่งบน/ครึ่งล่าง คนละแนว ให้ขนาดห้องต่างกัน */
const IN_ROW_GAPS = [3,4,16,17];
const IN_COL_TOP_GAPS = [2,3], IN_COL_BOT_GAPS = [10,11];
/* สีพื้นแต่ละห้อง (คู่สลับ checker อ่อน/เข้ม) ให้เด็กแยกห้องออกด้วยสายตา */
const IN_ROOM_FLOORS = {
  living:  [0xe6bc7f, 0xd9a967],   /* ไม้ส้มอบอุ่น (เดิม) */
  kitchen: [0xcfe8f7, 0xb9d9ec],   /* ฟ้าครัวสะอาด */
  bed:     [0xf4c7da, 0xe9aec9],   /* ชมพูห้องนอน */
  bath:    [0xcdeee0, 0xb5e0cd],   /* มินต์ห้องน้ำ */
};
function roomOf(x, z){
  return z <= IN_WALL_ROW ? (x <= IN_COL_TOP ? 'living' : 'kitchen')
                          : (x <= IN_COL_BOT ? 'bed' : 'bath');
}

/* ---------- state ---------- */
let hInit = false;
let hCore = false;                      /* สร้าง renderer/กล้อง/แสงเสร็จแล้ว (ขั้นแรกของ initThree) */
let renderer, camera, raycaster, groundPlane;
let scene, worldGroup, interiorGroup, creatorGroup, charGroup = null;
let hemiLight, dirLight;
let houseOpen = false, rafId = null, lastT = 0;
let hMode = 'world';                 /* 'creator' | 'world' */
let hScene = 'out';                  /* 'out' | 'in' */
let hZoom = 1, camTarget = new THREE.Vector3();
let loadedChildId = null;
let outGrid = null, inGrid = null;
let outGridBase = null, inGridBase = null;   /* กริดพื้นฐาน (ก่อนแสตมป์เฟอร์นิเจอร์) — ใช้ recompute เวลาย้าย/เพิ่ม/ลบของ */
let houseClickables = [], interiorDoorMesh = null;
let hintTimer = null;

/* ---------- เฟส 3: ระบบตกแต่ง ---------- */
let decorGroups = {out:[], in:[]};   /* Three group ที่วางแล้วต่อฉาก (userData.deco = {rec, item, scene}) */
let editMode = false;                /* อยู่ในโหมดตกแต่งไหม */
let editSel = null;                  /* ชิ้นที่เลือกอยู่ (group) */
let editSelRing = null;              /* วงแหวนไฮไลต์ใต้ชิ้นที่เลือก */
let editDrag = null;                 /* {group, moved, lastValid} ระหว่างลากวาง */
let editPan = null;                  /* {prev} ระหว่างแพนกล้องในโหมดตกแต่ง */
let editCat = null;                  /* หมวดที่เปิดในกล่องเลือก */
let sitState = null;                 /* {group,item,act,seat,ry} ตอนตัวละครนั่ง/นอนกับเฟอร์นิเจอร์ */

const hChar = {                       /* สถานะตัวละครในฉาก */
  cfg: null, tile: {x:SPAWN_TILE.x, z:SPAWN_TILE.z},
  path: [], seg: 0, segT: 0, segFrom: null, walking: false,
  targetRotY: Math.PI, pendingEnter: false, pendingExit: false,
};
const creatorState = {dragging:false, lastX:0, rotY:0, rotTarget:0, fromWorld:false};

/* ---------- data ---------- */
/* เวอร์ชันแผนที่: 2 = ขยายทิศเหนือ/ตะวันออก (เลื่อน +NPAD/+EPAD), 3 = ขยายทิศตะวันออกอีกชั้น (เลื่อน +EPAD2)
   ของตกแต่งนอกบ้านที่เด็กวางไว้เก็บเป็น "พิกัดช่อง" → ต้องเลื่อนตามครั้งเดียว ไม่งั้นของจะย้ายที่เอง */
const MAP_V = 3;
function migrateHouseMap(d){
  const from = d.mapV || 1;
  const dx = from < 2 ? NPAD : 0;
  const dz = (from < 2 ? EPAD : 0) + (from < 3 ? EPAD2 : 0);
  if(d.decor && Array.isArray(d.decor.out)) d.decor.out.forEach(r=>{ r.x += dx; r.z += dz; });
  d.mapV = MAP_V;                       /* ของในบ้านไม่ต้องเลื่อน (กริดในบ้านไม่เปลี่ยน) */
  return d;
}
function loadHouseData(){
  if(!activeChild) return null;
  let d = null;
  try{ d = JSON.parse(localStorage.getItem(HOUSE_KEY(activeChild.id)) || 'null'); }catch(e){ return null; }
  if(d && (d.mapV || 1) < MAP_V){
    d = migrateHouseMap(d);
    try{ localStorage.setItem(HOUSE_KEY(activeChild.id), JSON.stringify(d)); }catch(e){}
  }
  return d;
}
function saveHouseData(patch){
  if(!activeChild) return;
  const cur = loadHouseData() || {v:1, mapV:MAP_V};
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
function cyl(rt,rb,h,hex,seg){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||12), toonMat(hex));
  m.castShadow = hShadows; return m;
}
function cone(r,h,hex,seg){
  const m = new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||10), toonMat(hex));
  m.castShadow = hShadows; return m;
}
function torus(r,t,hex,seg){
  const m = new THREE.Mesh(new THREE.TorusGeometry(r,t,8,seg||16), toonMat(hex));
  m.castShadow = hShadows; return m;
}
let hShadows = false;

/* คลังเฟอร์นิเจอร์เฟส 3 (js/house-furniture.js โหลดก่อนไฟล์นี้) — ส่ง kit ทรงเรขาคณิตให้ build */
const FURN = (typeof window.HOUSE_FURNITURE === 'function')
  ? window.HOUSE_FURNITURE({THREE, box, ball:sphere, cyl, cone, torus, mat:toonMat, shade:petShade})
  : {items:[], byId:{}, cats:{in:[], out:[]}};

/* ---------- ตัวละคร blocky ---------- */
/* คืนหน่วยความจำ GPU ให้ครบทั้ง geometry + material + texture
   (เดิมคืนแค่ geometry — แก้ตัวละคร/เข้า-ออกบ้านซ้ำหลายรอบแล้ว material ค้างสะสมบน iPad) */
function disposeMaterial(m){
  if(!m) return;
  ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','alphaMap','aoMap'].forEach(k=>{
    if(m[k] && m[k].dispose) m[k].dispose();
  });
  if(m.dispose) m.dispose();
}
function disposeGroup(g){
  if(!g) return;
  g.traverse(o=>{
    if(!o.isMesh) return;
    if(o.geometry) o.geometry.dispose();
    if(Array.isArray(o.material)) o.material.forEach(disposeMaterial);
    else disposeMaterial(o.material);
  });
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


/* ============================================================
   มาสคอตนกฮูกของแอป (หน้าตาตามโลโก้ Owlkids) — เดินเล่นไปทั่วแผนที่
   ใช้ระบบเดียวกับชาวบ้าน (findPath/roam/แตะคุย) แต่เป็นนก จึงไม่มีขา
   ท่าเดินเป็นการกระโดดหย็องๆ + ขยับปีก แทนการแกว่งขา
   สีเอามาจาก assets/favicon.svg ตรงๆ ให้ตรงกับโลโก้ที่เด็กเห็นในแอป
   ============================================================ */
const OWL_BODY = 0xb66131, OWL_FACE = 0xe69752, OWL_BEAK = 0xfed737, OWL_PUPIL = 0x451700;
function buildOwlMascot(){
  const g = new THREE.Group();
  const piv = new THREE.Group();          /* ทั้งตัวเด้งขึ้นลงที่ pivot นี้ ไม่ยุ่งกับตำแหน่งบนแผนที่ */
  piv.scale.setScalar(1.28);              /* ตัวโตกว่าสัตว์เลี้ยง ให้เห็นชัดว่าเป็นมาสคอตของแอป */
  g.add(piv);
  const u = { wings:[], tufts:[], eyes:[] };

  const body = sphere(.32, OWL_BODY, 16);      /* ตัวกับหัวเป็นก้อนเดียวเหมือนในโลโก้ */
  body.scale.set(1.02, 1.12, .9); body.position.y = .46; piv.add(body);
  /* แผงหน้าสีอ่อน — ต้องล้ำออกมาหน้าลำตัวเล็กน้อย ไม่งั้นจมหายไปในตัว มองไม่เห็นว่าเป็นหน้า */
  const face = sphere(.3, OWL_FACE, 16);
  face.scale.set(1.02, .88, .46); face.position.set(0, .55, .19); piv.add(face);

  [-1, 1].forEach(sd=>{                        /* พู่หูสองข้างบนหัว (โผล่พ้นหัวชัดๆ) */
    const tuft = cone(.1, .24, OWL_BODY, 4);
    tuft.position.set(.19*sd, .88, -.03); tuft.rotation.z = -.38*sd; piv.add(tuft);
    u.tufts.push(tuft);
  });
  [-1, 1].forEach(sd=>{                        /* ตากลมโตสองวง: ขาว + ดำ + ประกาย (จุดเด่นของโลโก้) */
    const w = cyl(.125, .125, .05, 0xffffff, 18);
    w.rotation.x = Math.PI/2; w.position.set(.13*sd, .6, .32); piv.add(w);
    const p = cyl(.062, .062, .035, OWL_PUPIL, 14);
    p.rotation.x = Math.PI/2; p.position.set(.13*sd, .6, .35); piv.add(p);
    const gl = sphere(.023, 0xffffff, 8);
    gl.position.set(.13*sd + .04, .64, .368); piv.add(gl);
    u.eyes.push(w);
  });
  const beak = cone(.07, .15, OWL_BEAK, 3);    /* ปากสามเหลี่ยมเหลืองชี้ลง อยู่หน้าแผงหน้า */
  beak.position.set(0, .45, .34); beak.rotation.x = Math.PI - .3; piv.add(beak);

  u.wings = [-1, 1].map(sd=>{                  /* ปีกหมุนที่ไหล่ กางพ้นลำตัวให้เห็นตอนกระพือ */
    const wp = new THREE.Group();
    wp.position.set(.29*sd, .52, .02); wp.userData.side = sd;
    const w = box(.09, .34, .24, OWL_FACE, .06);
    w.position.set(.05*sd, -.08, 0); wp.add(w);
    piv.add(wp); return wp;
  });
  [-1, 1].forEach(sd=>{                        /* เท้าเหลืองเล็กๆ */
    const f = box(.11, .06, .17, OWL_BEAK, .03);
    f.position.set(.11*sd, .035, .08); piv.add(f);
  });
  const tail = box(.2, .08, .18, OWL_BODY, .05);
  tail.position.set(0, .2, -.3); tail.rotation.x = -.35; piv.add(tail);

  u.piv = piv;
  g.userData.owl = u;
  return g;
}

/* ท่าของมาสคอต — t เป็นมิลลิวินาทีเหมือนที่ updateNpcs ใช้ */
function updateOwlMascot(n, dt, t, moving){
  const u = n.owl, k = Math.min(1, dt*9);
  if(moving){
    n.sw += dt * 7.4;
    const hop = Math.abs(Math.sin(n.sw));
    u.piv.position.y = hop * .13;                          /* กระโดดหย็องๆ ไปข้างหน้า */
    u.piv.rotation.x = -.06 - Math.sin(n.sw*2) * .05;      /* ก้มตัวตอนลงพื้น */
    u.wings.forEach(w=>{ w.rotation.z = (-.25 - hop*.55) * w.userData.side; });
  }else{
    u.piv.position.y += (Math.sin(t*.0026) * .015 - u.piv.position.y) * k;   /* หายใจเบาๆ */
    u.piv.rotation.x += (0 - u.piv.rotation.x) * k;
    const flap = n.faceT > 0 ? (-.5 - Math.abs(Math.sin(t*.012)) * .8) : -.1;
    u.wings.forEach(w=>{ w.rotation.z += (flap * w.userData.side - w.rotation.z) * k; });
  }
  u.tufts.forEach((tf, i)=>{ tf.rotation.z = (-.34 + Math.sin(t*.004 + i) * .07) * (i ? 1 : -1); });
  /* กะพริบตา: หรี่วงตาขาวลงแวบเดียวเป็นระยะ */
  n.blinkT -= dt;
  if(n.blinkT <= 0){ n.blinkT = 2.4 + Math.random()*3.4; n.blinkK = .16; }
  if(n.blinkK > 0){
    n.blinkK -= dt;
    const f = n.blinkK > .08 ? .18 : 1;
    u.eyes.forEach(e=>{ e.scale.y = f; });
  }else u.eyes.forEach(e=>{ e.scale.y = 1; });
}

/* ---------- ฉากนอกบ้าน ---------- */
function outWX(gx){ return gx - (OUT_W-1)/2; }
function outWZ(gz){ return gz - (OUT_D-1)/2; }

/* ---------- ฉากตายตัวนอกกรอบบ้าน (ป่า + หมู่บ้าน NPC) ---------- */
function inBox(b, x, z, m){ m = m || 0; return x>=b.x0-m && x<=b.x1+m && z>=b.z0-m && z<=b.z1+m; }
/* ทางเดินดินฝั่งบ้าน: ออกจากขอบบริเวณบ้านด้านใต้ (HOME_EXIT_X) ลงใต้แล้ววิ่งไปหัวสะพานใต้
   ให้เด็กมองเห็นว่าเดินทางนี้ไปชุมชนได้อีกทาง ไม่ต้องเดาว่าป่าทึบไปต่อได้ไหม */
const HOME_TRAIL = [
  {x0:HOME_EXIT_X[0], x1:HOME_EXIT_X[1], z0:HOME_EDGE_Z, z1:BRIDGE2_Z[1]},
  {x0:HOME_EXIT_X[0], x1:RIVER_X[0]-1, z0:BRIDGE2_Z[0], z1:BRIDGE2_Z[1]},
];
function isVillageRoadTile(x, z){
  if(inBox(FARM_TRAIL, x, z)) return true;                 /* ทางเดินดินเข้าฟาร์มทิศตะวันออก */
  if(x < VILLAGE_X0) return HOME_TRAIL.some(r => inBox(r, x, z)) ||
                            VILLAGE2_ROADS.some(r => inBox(r, x, z));   /* ถนนชุมชนที่ 2 (ตะวันตก) */
  return VILLAGE_ROADS.some(r => inBox(r, x, z));
}
/* ใกล้ถนน/ลานกี่ช่อง — ของสูง (ต้นไม้/มะพร้าว) ต้องเว้นระยะ ไม่ให้พุ่มใบยื่นคลุมถนนหรือบังอาคาร */
function nearRoadTile(x, z, m){
  for(let dz=-m; dz<=m; dz++) for(let dx=-m; dx<=m; dx++)
    if(isVillageRoadTile(x+dx, z+dz)) return true;
  return false;
}
function nearRoadOrPlaza(x, z, m){
  for(let dz=-m; dz<=m; dz++) for(let dx=-m; dx<=m; dx++)
    if(isVillageRoadTile(x+dx, z+dz) || isPlazaTile(x+dx, z+dz)) return true;
  return false;
}
function isPlazaTile(x, z){
  if(inBox(PLAZA2, x, z)) return true;                     /* ลานกิจกรรมริมทางไปชายหาด */
  if(inPlazaGate(x, z)) return true;            /* ทางเดินเข้าลานน้ำพุ 3 ทาง (ปูหินต่อจากลาน) */
  if(inSchoolYard(x, z)) return true;                      /* ลานหน้าโรงเรียน (พื้นในรั้ว รอบตัวอาคาร) */
  return inBox(PLAZA, x, z) && !inBox(FOUNTAIN, x, z);
}
/* ---------- ใบไม้ "ล้ำ" ทับถนนบนจอ (เรื่องมุมกล้อง ไม่ใช่เรื่องช่องกริด) ----------
   กล้อง isometric มองจาก (+x,+z) → ยอดต้นไม้ถูกวาดเฉียงขึ้นไปทาง (-x,-z) บนจอ
   ต้นไม้สูง ~3 หน่วยจึงกินพื้นที่จอเหนือช่องตัวเองไปอีก ~3 ช่องแนวทแยง
   ⇒ ต้นไม้ที่ยืนเยื้องมาทาง (+x,+z) ของถนน/ลาน แม้ห่างหลายช่องและไม่บล็อกทางเดินเลย
     เด็กก็ยัง "เห็นเป็นต้นไม้ตั้งอยู่กลางถนน/กลางลาน" อยู่ดี (ผู้ใช้แจ้งซ้ำหลายรอบ)
   เช็คทิศทางเดียวแบบนี้แทนการเว้นระยะรอบด้านเยอะๆ จะได้ยังมีต้นไม้ริมทางฝั่งที่ไม่บังอยู่ */
const CANOPY_LEAN = 4;
function canopyOverPath(x, z){
  for(let dz=0; dz<=CANOPY_LEAN; dz++) for(let dx=0; dx<=CANOPY_LEAN; dx++){
    const px = x-dx, pz = z-dz;
    if(isVillageRoadTile(px, pz) || isPlazaTile(px, pz)) return true;
    if(dx<=3 && dz<=3 && lotAt(px, pz)) return true;      /* ใบไม้บังตัวบ้าน/ร้านที่อยู่ลึกเข้าไปบนจอ */
  }
  return false;
}
/* ล็อตอาคารที่ครอบช่องนี้ (margin ใช้ตอนหาว่าแตะโดนอาคารไหน — ชายคายื่นเกินล็อตได้) */
function lotAt(x, z, margin){
  for(let i=0; i<VILLAGE_LOTS.length; i++) if(inBox(VILLAGE_LOTS[i], x, z, margin||0)) return VILLAGE_LOTS[i];
  return null;
}
/* ช่องที่ปลูกของฉากตายตัวได้: นอกกรอบบ้าน, ไม่ใช่คลอง, ไม่ทับถนน/ล็อต NPC (เว้นขอบล็อต 1 ช่อง),
   ไม่ปิดปลายสะพานฝั่งหมู่บ้าน และไม่ปิดแถวรอยต่อขอบบริเวณบ้าน
   tall = ของสูงพุ่มกว้าง (ต้นไม้/สน) ต้องเว้นระยะรอบด้านจากถนน/ลาน 3 ช่อง จากอาคาร 4 ช่อง (ช่องว่างระหว่างอาคารคือทางเดินลัดของเด็ก)
   และเพิ่มอีกชั้นคือฝั่งที่ใบไม้ล้ำทับบนจอ (canopyOverPath) เพราะเว้นระยะรอบด้านอย่างเดียวไม่พอ:
   ต้นไม้ที่ห่างถนน 3-4 ช่องแต่ยืนอยู่ฝั่ง (+x,+z) ใบยังคลุมถนนบนจอ เห็นเหมือนต้นไม้ขวางทางอยู่ดี */
function wildPlantable(x, z, tall, plazaPad){
  const pp = (plazaPad == null) ? 2 : plazaPad;   /* ระยะเว้นจากลานกลางชุมชน (ผ่อนเหลือ 0 ได้เฉพาะต้นไม้ประดับ "ริมขอบลาน") */
  if(x<0 || z<0 || x>=OUT_W || z>=OUT_D) return false;
  if(inHomeZone(x, z)) return false;
  if(RIVER_X.includes(x)) return false;
  if(isPondTile(x, z) || isCanalTile(x, z) || isSeaTile(x, z)) return false;   /* ผิวน้ำใหม่ทั้งหมด */
  if(isSandTile(x, z)) return false;                            /* หาดทราย (ต้นมะพร้าววางแยก) */
  if(FARM_PLOTS.some(p => inBox(p, x, z, 1))) return false;     /* แปลงผัก + ขอบแปลง 1 ช่อง (กันต้นไม้ปิดร่องเดิน) */
  if(z===HOME_EDGE_Z) return false;                             /* แถวรอยต่อขอบบริเวณบ้าน เว้นเป็นหญ้าโล่ง */
  if(z===HOME_EDGE_Z+1 && HOME_EXIT_X.includes(x)) return false; /* หน้าทางเดินดินออกจากบ้าน เว้นทางเดิน */
  if(isVillageRoadTile(x, z)) return false;
  if(inBox(PLAZA, x, z, pp) || inBox(PLAZA2, x, z, pp)) return false;  /* ลานกลางชุมชน/ลานกิจกรรม + ขอบลาน (ปกติ 2 ช่อง) */
  if(inPlazaYard(x, z)) return false;                            /* กรอบลานน้ำพุจัดวางเองทั้งหมด ไม่ให้ของสุ่มงอกแทรก */
  if(penAt(x, z)) return false;                                 /* คอกสัตว์ในฟาร์ม (รวมรั้ว) */
  if(isSceneryPropTile(x, z)) return false;                     /* ม้านั่ง/รถเข็น/ของในฟาร์ม/เวที */
  if(lotAt(x, z, 1)) return false;                              /* ล็อตอาคาร + ขอบล็อต 1 ช่อง (ให้เดินรอบได้) */
  if(inPoolDeck(x, z)) return false;                            /* ลานรอบสระว่ายน้ำ ปล่อยโล่งให้เดินเล่นได้ */
  if(isBridgeZ(z) && (x<=VILLAGE_X0+1 || x>=RIVER_X[0]-2)) return false;   /* หัว-ท้ายสะพานทั้งสองฝั่ง */
  if(tall && (nearRoadOrPlaza(x, z, 3) || lotAt(x, z, 4))) return false;   /* ของสูงเว้นระยะถนน/ลาน 3 ช่อง, อาคาร 4 ช่อง (ช่องว่างระหว่างอาคารคือทางที่เด็กเดินลัด ต้นไม้ตรงนั้นดูเป็นของขวางทางเสมอ) */
  if(tall && canopyOverPath(x, z)) return false;                /* ใบไม้ล้ำไปทับถนน/ลาน/อาคารบนจอ (มุมกล้อง) */
  if(nearRoadTile(x, z, 1)) return false;      /* แม้แต่พุ่มเตี้ย/เห็ด ก็ไม่ให้ชิดขอบถนน (มองมุมกล้องแล้วเห็นเป็นของขวางทาง — ขอบลานคุมด้วย pp ด้านบนแล้ว) */
  if(tall && inLotFrontStrip(x, z)) return false;               /* ทางเข้าหน้าประตูบ้าน/ร้าน เว้นโล่ง */
  if(FLOWERS.some(f => f[0]===x && f[1]===z)) return false;      /* ช่องที่จองไว้ปลูกดอกไม้ (ไม่งั้นดอกไม้โดนต้นไม้ทับหายไป) */
  return true;
}
/* แถบโล่งหน้าอาคาร: กว้างเท่าตัวอาคาร (+ข้างละ 1 ช่อง) ยาว 3 ช่องออกมาทางประตู
   กล้อง isometric มองจาก (+x,+z) → ของสูงในแถบนี้บังหน้าร้าน/ขวางทางเข้าพอดี
   (เดิมกันแค่ 3 ช่องกลางประตู ต้นไม้เยื้องไปข้างๆ ยังบังหน้าร้านอยู่ — ผู้ใช้แจ้งเรื่องหน้าร้านขนมปัง) */
function inLotFrontStrip(x, z){
  for(let i=0; i<VILLAGE_LOTS.length; i++){
    const l = VILLAGE_LOTS[i];
    if(x>=l.x0-1 && x<=l.x1+1 && z>=l.z1+1 && z<=l.z1+2) return true;
  }
  return false;
}
/* สุ่มคงที่ (seed เดียว) — ป่า/หมู่บ้านหน้าตาเหมือนกันทุกเครื่องทุกครั้ง ไม่ต้องเก็บใน localStorage */
function wildRandFn(seed){
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
/* ใกล้ผืนน้ำ (แม่น้ำ/บ่อ/คลอง/ทะเล) กี่ช่อง — ใช้เลือกที่ปลูกต้นไม้ริมน้ำ */
function nearWildWater(x, z, m){
  for(let dz=-m; dz<=m; dz++) for(let dx=-m; dx<=m; dx++){
    const nx = x+dx, nz = z+dz;
    if(nx<0 || nz<0 || nx>=OUT_W || nz>=OUT_D) continue;
    if(RIVER_X.includes(nx) || isPondTile(nx, nz) || isCanalTile(nx, nz) || isSeaTile(nx, nz)) return true;
  }
  return false;
}
/* ของฉากตายตัวที่ถือว่า "สูง/พุ่มกว้าง" → ใช้กติกาเว้นระยะจากถนนกับอาคาร (ดู wildPlantable) */
const WILD_TALL = ['tree', 'tree-round', 'pine'];
let wildLayoutCache = null;
/* ช่องที่สั่งถอนต้นไม้ออกถาวร (ผู้ใช้ชี้เองว่าต้นนี้เกะกะ/ไม่สวย) — กันทั้งตอนปลูกและตอนเก็บกวาดคอขวด */
const WILD_BAN = new Set(['11,19', '3,31', '4,31', '5,31', '7,29', '6,32', '3,35', '4,35', '5,39', '5,40', '8,49', '9,49', '34,61', '35,60']);
/* ---------- ต้นไม้ในชุมชน ----------
   กติกาป่า (wildPlantable แบบ tall) เว้นถนน 3 ช่อง + อาคาร 4 ช่อง → ในชุมชนแทบไม่เหลือช่องเลย ชุมชนจึงโล่งไม่มีต้นไม้
   ชุดกติกานี้ผ่อนให้เหลือ ถนน/ลาน 2 ช่อง + อาคาร 2 ช่อง + ใบไม้ล้ำบนจอสั้นลงเหลือ 2 ช่อง
   แต่ยังคงข้อห้ามสำคัญไว้ครบ: ไม่ทับถนน/ลาน/ล็อต/ของฉาก/ดอกไม้ และไม่ยืนหน้าประตูร้าน (inLotFrontStrip) */
const VILLAGE_TREE_AREAS = [
  {x0:VILLAGE_X0, x1:sx(54), z0:sz(2),  z1:sz(38)},    /* ชุมชนข้ามสะพาน */
  {x0:0, x1:VILLAGE_X0-1, z0:s2z(42), z1:OUT_D-1},     /* ชุมชนที่ 2 ทิศตะวันตก */
];
const VILLAGE_CANOPY_LEAN = 2;
function villageCanopyOverPath(x, z){
  for(let dz=0; dz<=VILLAGE_CANOPY_LEAN; dz++) for(let dx=0; dx<=VILLAGE_CANOPY_LEAN; dx++){
    if(!dx && !dz) continue;
    const px = x-dx, pz = z-dz;
    if(isVillageRoadTile(px, pz) || isPlazaTile(px, pz) || lotAt(px, pz, 0)) return true;
  }
  return false;
}
function softPlantable(x, z, plazaPad){
  if(WILD_BAN.has(x+','+z)) return false;
  if(!wildPlantable(x, z, false, plazaPad)) return false;  /* ข้อห้ามพื้นฐานทั้งหมด: ห่างถนน ≥2 ช่อง, ห่างอาคาร ≥2 ช่อง, ไม่ทับน้ำ/ของฉาก/ดอกไม้ */
  if(inLotFrontStrip(x, z)) return false;
  if(villageCanopyOverPath(x, z)) return false;
  return true;
}
function villagePlantable(x, z){          /* ต้นไม้แทรกตามซอกในชุมชน (เว้นขอบลาน 2 ช่องเหมือนเดิม) */
  return VILLAGE_TREE_AREAS.some(a => inBox(a, x, z)) && softPlantable(x, z, 2);
}
/* ต้นไม้ประดับ "ตามแนวขอบ" — ริมลานน้ำพุ / ริมแม่น้ำ / หลังบ้าน: ผ่อน 2 ข้อจากกติกาชุมชน
   (1) เว้นระยะขอบลานเหลือ 0 (แตะขอบลานได้ แต่ห้ามยืนบนลาน) (2) ใบไม้ล้ำคลุมหลังคาบ้าน/ขอบลานบนจอได้
   — แต่ยังห้ามใบล้ำทับ "ถนน" เด็ดขาด และห้ามยืนหน้าประตูร้าน/ชิดถนน/ทับของฉากเหมือนเดิม */
function edgeCanopyOverRoad(x, z){
  for(let dz=0; dz<=VILLAGE_CANOPY_LEAN; dz++) for(let dx=0; dx<=VILLAGE_CANOPY_LEAN; dx++){
    if(!dx && !dz) continue;
    if(isVillageRoadTile(x-dx, z-dz)) return true;
  }
  return false;
}
function villageEdgePlantable(x, z){
  if(WILD_BAN.has(x+','+z)) return false;
  if(!wildPlantable(x, z, false, 0)) return false;
  if(inLotFrontStrip(x, z)) return false;
  if(edgeCanopyOverRoad(x, z)) return false;
  return true;
}
function wildLayout(){
  if(wildLayoutCache) return wildLayoutCache;
  const list = [], taken = new Set();
  const put = (id, x, z, gate) => {
    const k = x+','+z;
    if(taken.has(k) || WILD_BAN.has(k)) return false;
    if(!(gate ? gate(x, z) : wildPlantable(x, z, WILD_TALL.includes(id)))) return false;
    taken.add(k);
    list.push({id, x, z, rot:(x*7+z*13)%4, col:(x+z)%4});
    return true;
  };
  const rnd = wildRandFn(20260725);
  WILD_GROVES.forEach(([cx, cz, n, kind])=>{
    let placed = 0;
    for(let guard=0; placed<n && guard<24; guard++){
      const x = cx + Math.round((rnd()*2-1)*2), z = cz + Math.round((rnd()*2-1)*2);
      if(put(kind, x, z)) placed++;
    }
  });
  WILD_BUSHES.forEach(([x,z])=>put('bush', x, z));
  WILD_MUSHROOMS.forEach(([x,z])=>put('mushroom', x, z));
  /* ---- ต้นไม้เสริมให้แผนที่เขียวขึ้น: ขอบแผนที่ / ริมแม่น้ำ-บ่อน้ำ-คลอง / ทุ่งโล่งที่ไกลบ้าน ----
     ใช้ wildPlantable ตัวเดิมทุกช่อง จึงไม่มีทางไปงอกขวางถนน/ลาน/หน้าร้าน
     ไม่ปลูกติดกับของที่มีอยู่แล้ว (เว้นอย่างน้อย 1 ช่อง) ป่าจะได้โปร่งพอให้เดินลอด ไม่กลายเป็นกำแพงต้นไม้ */
  const EXTRA_KINDS = ['tree-round', 'pine', 'tree-round', 'pine', 'tree'];
  const touching = (x, z) => {
    for(let dz=-1; dz<=1; dz++) for(let dx=-1; dx<=1; dx++) if(taken.has((x+dx)+','+(z+dz))) return true;
    return false;
  };
  /* กระดานจำลองพื้นที่เดินได้ (ยังไม่รวมของฉากป่า) ไว้เช็คก่อนปลูกทุกต้นว่าไม่ปิดทางเดิน
     ถ้าไม่เช็ค แนวต้นไม้ริมขอบแผนที่จะต่อกันเป็นกำแพงจนพื้นที่ริมขอบกลายเป็นซอกตัน เดินเข้าไม่ได้ */
  const workGrid = buildOutGrid(true);
  list.forEach(r => { if(workGrid[r.z] && workGrid[r.z][r.x] === 0) workGrid[r.z][r.x] = 3; });
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    const edge = x<6 || z<6 || x>=OUT_W-6 || z>=OUT_D-6;          /* ขอบแผนที่ — ปลูกหนาสุด ทำเป็นแนวป่ากรอบโลก */
    const bank = nearWildWater(x, z, 2);                          /* ริมน้ำ */
    const open = !lotAt(x, z, 6) && !nearRoadOrPlaza(x, z, 5);     /* ทุ่งโล่งที่ไกลทั้งบ้านและถนน */
    const chance = edge ? .58 : bank ? .42 : open ? .3 : 0;
    if(!chance || rnd() > chance) continue;
    if(touching(x, z)) continue;
    if(workGrid[z][x] !== 0 || !pinchFillSafe(workGrid, x, z)) continue;   /* ปลูกแล้วต้องยังเดินอ้อมได้ */
    if(put(EXTRA_KINDS[(rnd()*EXTRA_KINDS.length)|0], x, z)) workGrid[z][x] = 3;
  }
  /* ---- ต้นไม้ในชุมชน: ตามซอกระหว่างบ้าน/มุมลาน/ริมทางที่ยังว่าง ----
     เว้นระยะกันเองอย่างน้อย 3 ช่อง จะได้ดูเป็นต้นไม้ประดับหมู่บ้าน ไม่ใช่ป่ารกกลางเมือง */
  const VILLAGE_KINDS = ['tree-round', 'tree-round', 'tree', 'pine'];
  const farFrom = (x, z, r) => {
    for(let dz=-r; dz<=r; dz++) for(let dx=-r; dx<=r; dx++) if(taken.has((x+dx)+','+(z+dz))) return false;
    return true;
  };
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(rnd() > .92) continue;
    if(!farFrom(x, z, 1)) continue;
    if(workGrid[z][x] !== 0 || !pinchFillSafe(workGrid, x, z)) continue;
    if(put(VILLAGE_KINDS[(rnd()*VILLAGE_KINDS.length)|0], x, z, villagePlantable)) workGrid[z][x] = 3;
  }
  /* ---- ต้นไม้ประดับตามแนวขอบ: รอบลานน้ำพุ / ริมแม่น้ำ / หลังบ้าน ----
     ปลูกวงนอก 2 ชั้นรอบลาน เพราะ relieveWildPinch จะเก็บกวาดต้นที่ทำทางเดินเหลือช่องเดียวออกอีกที
     ตั้งโอกาสสูงหน่อยได้ ไม่ต้องกลัวรก */
  const EDGE_KINDS = ['tree-round', 'tree-round', 'tree', 'pine'];
  const plantEdge = (x, z, sp) => {
    if(x<0 || z<0 || x>=OUT_W || z>=OUT_D) return false;
    if(!farFrom(x, z, sp)) return false;
    if(workGrid[z][x] !== 0 || !pinchFillSafe(workGrid, x, z)) return false;
    if(!put(EDGE_KINDS[(rnd()*EDGE_KINDS.length)|0], x, z, villageEdgePlantable)) return false;
    workGrid[z][x] = 3;
    return true;
  };
  /* 1) วงรอบลานกิจกรรม (2 ชั้น) — ลานน้ำพุไม่ปลูก จัดวางเองทั้งกรอบ */
  [PLAZA2].forEach(pz => {
    for(let ring=1; ring<=2; ring++){
      for(let z=pz.z0-ring; z<=pz.z1+ring; z++) for(let x=pz.x0-ring; x<=pz.x1+ring; x++){
        if(x>pz.x0-ring && x<pz.x1+ring && z>pz.z0-ring && z<pz.z1+ring) continue;   /* เอาเฉพาะช่องวงนอกสุดของชั้นนั้น */
        if(rnd() > .8) continue;
        plantEdge(x, z, 1);
      }
    }
  });
  /* 2) ริมแม่น้ำสองฝั่ง */
  const bankXs = [RIVER_X[0]-1, RIVER_X[0]-2, RIVER_X[RIVER_X.length-1]+1, RIVER_X[RIVER_X.length-1]+2];
  for(let z=0; z<OUT_D; z++) bankXs.forEach(x => { if(rnd() <= .7) plantEdge(x, z, 1); });
  /* 3) หลังบ้าน/ข้างบ้านในชุมชน (แนวห่างล็อต 2-3 ช่อง) */
  VILLAGE_LOTS.forEach(l => {
    for(let d=2; d<=3; d++){
      for(let x=l.x0-d; x<=l.x1+d; x++){ if(rnd() <= .7) plantEdge(x, l.z0-d, 1); if(rnd() <= .55) plantEdge(x, l.z1+d, 1); }
      for(let z=l.z0-d; z<=l.z1+d; z++){ if(rnd() <= .65) plantEdge(l.x0-d, z, 1); if(rnd() <= .65) plantEdge(l.x1+d, z, 1); }
    }
  });
  /* หมายเหตุ: เคยโรยพุ่ม/เห็ดสุ่มไว้ริมถนนให้ทางไม่โล่งเกินไป แต่พอกติกาใหม่ห้ามของฉากชิดถนนทุกชนิด
     พุ่มพวกนี้ไปกองรวมกันเป็นแถวตรงแนวเดียว ดูไม่เป็นธรรมชาติ จึงเอาออก
     ริมถนนใช้ดอกไม้ (FLOWERS) ตกแต่งแทน — เตี้ยมาก ไม่บังอะไรเลย */
  /* กันพลาดอีกชั้น: ตัดของสูงทุกชิ้นที่ยังละเมิดกติกาออก (เผื่อ relieveWildPinch/โค้ดใหม่ในอนาคตย้ายของ) */
  wildLayoutCache = relieveWildPinch(list)
    .filter(r => !WILD_BAN.has(r.x+','+r.z))
    .filter(r => !WILD_TALL.includes(r.id) || wildPlantable(r.x, r.z, true) || villageEdgePlantable(r.x, r.z));
  return wildLayoutCache;
}
/* ปลูกทับช่องคอขวดได้ไหม: ต้องไม่ตัดขาดทางเดิน — เช็คว่าช่องเดินได้รอบๆ ยังเชื่อมถึงกัน
   โดยไม่ผ่านช่องนี้ (BFS วงแคบ จำกัด 500 ช่อง พอสำหรับทางอ้อมระยะใกล้) */
function pinchFillSafe(grid, x, z){
  const open = [[x-1,z],[x+1,z],[x,z-1],[x,z+1]]
    .filter(([nx, nz])=>nx>=0 && nz>=0 && nx<OUT_W && nz<OUT_D && (grid[nz][nx]===0 || grid[nz][nx]===2));
  if(open.length <= 1) return true;                     /* ปลายตัน ปลูกทับได้เลย */
  const start = open[0], seen = new Set([start[1]*OUT_W + start[0]]), q = [start];
  let found = 1, guard = 0;
  while(q.length && guard++ < 500){
    const [cx, cz] = q.shift();
    for(const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx = cx+dx, nz = cz+dz, k = nz*OUT_W + nx;
      if(nx<0 || nz<0 || nx>=OUT_W || nz>=OUT_D || seen.has(k)) continue;
      if(nx===x && nz===z) continue;                    /* ห้ามผ่านช่องที่กำลังจะปลูก */
      if(!(grid[nz][nx]===0 || grid[nz][nx]===2)) continue;
      seen.add(k); q.push([nx, nz]);
      if(open.some(o=>o[0]===nx && o[1]===nz)) found++;
    }
  }
  return found === open.length;
}
/* เก็บกวาด "คอขวด" ของฉากป่า: ช่องที่เดินได้แต่มีของขนาบ 2 ฝั่งตรงข้าม (ซ้าย-ขวา หรือ หน้า-หลัง)
   ช่องว่างกว้าง 1 แบบนี้เด็กมองว่าต้นไม้ขวางทางเดิน ทั้งที่จริงเดินลอดได้ แก้ 2 ทาง:
   1) ถ้าช่องนั้นปลูกได้ → ปลูกทับให้กลายเป็นพุ่มป่าตัน (ดูเป็นป่าจริง เดินอ้อมโดยไม่ลังเล)
   2) ถ้าปลูกไม่ได้ (ชิดถนน/ลาน/ล็อต) → ถอนต้นที่เป็นต้นเหตุออก
   ทำวนหลายรอบเพราะแก้จุดหนึ่งอาจเกิด/ดับคอขวดจุดอื่นได้ */
function relieveWildPinch(list){
  const base = buildOutGrid(true);                 /* กริดที่ยังไม่รวมของฉากป่า (กัน recursion) */
  const grid = base.map(r=>r.slice()), owner = new Map(), dead = new Set();
  const tilesOf = (rec)=>{
    const item = FURN.byId[rec.id];
    if(!item || item.block===false) return [];
    return footTiles(item, {x:rec.x, z:rec.z}, rec.rot)
      .filter(tl=>tl.x>=0 && tl.z>=0 && tl.x<OUT_W && tl.z<OUT_D);
  };
  list.forEach(rec=>tilesOf(rec).forEach(tl=>{ grid[tl.z][tl.x] = 3; owner.set(tl.x+','+tl.z, rec); }));
  const blockedAt = (x, z) => !(x>=0 && z>=0 && x<OUT_W && z<OUT_D) || grid[z][x] !== 0 && grid[z][x] !== 2;
  for(let pass=0; pass<8; pass++){
    let cut = 0;
    for(let z=1; z<OUT_D-1; z++) for(let x=1; x<OUT_W-1; x++){
      if(blockedAt(x, z)) continue;
      if(!((blockedAt(x-1, z) && blockedAt(x+1, z)) || (blockedAt(x, z-1) && blockedAt(x, z+1)))) continue;
      const near = [[x-1,z],[x+1,z],[x,z-1],[x,z+1]]
        .map(([nx, nz])=>owner.get(nx+','+nz)).filter(r=>r && !dead.has(r));
      if(!near.length) continue;
      const kind = near[0].id;
      if(base[z][x] === 0 && wildPlantable(x, z, WILD_TALL.indexOf(kind) >= 0)
         && !FLOWERS.some(f => f[0]===x && f[1]===z) && pinchFillSafe(grid, x, z)){
        const rec = {id:kind, x, z, rot:(x*7+z*13)%4, col:(x+z)%4};
        list.push(rec); grid[z][x] = 3; owner.set(x+','+z, rec); cut++;
        continue;
      }
      near.forEach(rec=>{
        dead.add(rec); cut++;
        tilesOf(rec).forEach(tl=>{
          if(owner.get(tl.x+','+tl.z) !== rec) return;
          owner.delete(tl.x+','+tl.z); grid[tl.z][tl.x] = base[tl.z][tl.x];
        });
      });
    }
    if(!cut) break;
  }
  return list.filter(rec=>!dead.has(rec));
}

/* ---------- รวม geometry ของฉากตายตัว (ลด draw call) ----------
   three.min.js ที่ self-host ไม่มี BufferGeometryUtils → เขียนตัวรวมเองแบบ index buffer
   จับกลุ่มเป็น "โซนของแผนที่ (chunk) × วัสดุ" ไม่ใช่ก้อนเดียวทั้งแผนที่ เพราะ:
     - frustum culling ยังตัดโซนที่อยู่นอกจอออกได้ (ทั้งตอนวาดจริงและตอนวาดเงา)
     - raycast ตอนแตะจอ จะเช็ค bounding sphere ของโซนก่อน ไม่ต้องไล่สามเหลี่ยมทั้งแผนที่ */
const STATIC_CHUNK = 14;
function chunkKeyOf(x, z){ return Math.floor(x/STATIC_CHUNK) + '_' + Math.floor(z/STATIC_CHUNK); }
/* วัสดุ toon กลางที่อ่านสีจาก vertex color → ชิ้นส่วน toon ทุกสีรวมเป็นก้อนเดียวกันได้
   (ถ้าแยกตามสีวัสดุ โซนหนึ่งจะมี 15-20 ก้อน เพราะต้นไม้/หลังคา/ผนังคนละสีกันหมด) */
let toonVCMat = null;
function toonVertexMat(){
  if(!toonVCMat){ toonMat(0xffffff);   /* ให้ gradientMap ถูกสร้างก่อน */
    toonVCMat = new THREE.MeshToonMaterial({color:0xffffff, vertexColors:true, gradientMap}); }
  return toonVCMat;
}
function mergeMatKey(mat){
  if(mat.userData && mat.userData.noMerge) return 'm|' + mat.uuid;   /* วัสดุที่ต้องคุมเองทีหลัง (เช่น โคมเสาไฟ) ห้ามรวมกับก้อน vertex color */
  if(mat.map) return 'tex|' + mat.uuid;                       /* ป้ายอิโมจิ: ใช้ atlas ร่วมกันอยู่แล้ว */
  /* เฉพาะ toon โทนปกติ (ไม่ใช่ softMat ที่ไล่โทนคนละแบบ) → รวมทุกสีด้วย vertex color */
  if(mat.isMeshToonMaterial && !mat.transparent && mat.gradientMap === gradientMap) return 'vc';
  return 'm|' + mat.uuid;
}
function mergeCollect(obj, parts, zoneKey){
  obj.updateMatrixWorld(true);
  const v = new THREE.Vector3(), nv = new THREE.Vector3(), nm = new THREE.Matrix3();
  obj.traverse(o=>{
    if(!o.isMesh || !o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
    const geo = o.geometry, posA = geo.attributes.position, norA = geo.attributes.normal, uvA = geo.attributes.uv;
    const mk = mergeMatKey(o.material), vc = mk === 'vc';
    const key = zoneKey + '|' + mk;
    let p = parts.get(key);
    if(!p) { p = {mat: vc ? toonVertexMat() : o.material, vc, pos:[], nor:[], uv:[], col:[], idx:[], n:0,
                  needUv: !vc && !!o.material.map}; parts.set(key, p); }
    nm.getNormalMatrix(o.matrixWorld);
    const base = p.n, c = o.material.color;
    for(let i=0; i<posA.count; i++){
      v.fromBufferAttribute(posA, i).applyMatrix4(o.matrixWorld);
      p.pos.push(v.x, v.y, v.z);
      if(norA){ nv.fromBufferAttribute(norA, i).applyMatrix3(nm).normalize(); p.nor.push(nv.x, nv.y, nv.z); }
      else p.nor.push(0,1,0);
      if(vc) p.col.push(c.r, c.g, c.b);
      if(p.needUv) uvA ? p.uv.push(uvA.getX(i), uvA.getY(i)) : p.uv.push(0,0);
    }
    p.n += posA.count;
    if(geo.index){ const ia = geo.index; for(let i=0; i<ia.count; i++) p.idx.push(base + ia.getX(i)); }
    else for(let i=0; i<posA.count; i++) p.idx.push(base + i);
  });
}
function buildMergedMesh(p){
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(p.pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(p.nor, 3));
  if(p.vc) geo.setAttribute('color', new THREE.Float32BufferAttribute(p.col, 3));
  if(p.needUv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(p.uv, 2));
  geo.setIndex(p.n > 65535 ? new THREE.Uint32BufferAttribute(p.idx, 1) : new THREE.Uint16BufferAttribute(p.idx, 1));
  geo.computeBoundingSphere();
  const m = new THREE.Mesh(geo, p.mat);
  m.castShadow = hShadows && !p.mat.map && !p.mat.transparent;   /* ป้ายร้าน (texture โปร่ง) / แสงไฟโปร่งใส ไม่ต้องทิ้งเงา */
  m.receiveShadow = hShadows;
  return m;
}
function flushMergedParts(parts, group){
  parts.forEach(p=>{
    if(!p.n) return;
    const m = buildMergedMesh(p);
    m.matrixAutoUpdate = false; m.updateMatrix();
    m.userData.hStatic = true;                  /* แตะแล้วคำนวณช่องจากจุดที่ ray ชน (ดู tapStaticScene) */
    group.add(m);
  });
}
/* รวมชิ้นส่วนภายในกลุ่มเฟอร์นิเจอร์/ของตกแต่ง 1 ชิ้นให้เหลือ mesh เดียว (พิกัด local เดิม)
   → ยังลาก/หมุน/ยกได้ตามปกติ แค่วาดครั้งเดียวแทนหลายสิบครั้ง (รั้ว/ต้นไม้ชิ้นละ 6 mesh)
   เรียกก่อนตั้งตำแหน่งกลุ่ม (ตอน matrix ยังเป็น identity) เท่านั้น */
function mergeDecorGroup(g){
  let ok = true, meshes = 0;
  g.traverse(o=>{
    if(o !== g && Object.keys(o.userData).length) ok = false;   /* มี marker (บานพับ/หลอดไฟ/จุดหมุน) → ไม่รวม */
    if(o.isMesh){ meshes++; if(!o.material || o.material.map || o.material.transparent) ok = false; }
    else if(o !== g && !o.isGroup && !o.isObject3D) ok = false;
    if(o.isLight || o.isSprite || o.isPoints || o.isLine) ok = false;
  });
  if(!ok || meshes < 2) return;
  const parts = new Map();
  mergeCollect(g, parts, 'd');
  const merged = [];
  parts.forEach(p=>{ if(p.n) merged.push(buildMergedMesh(p)); });
  if(!merged.length) return;
  g.clear();
  merged.forEach(m=>g.add(m));
}

/* ---------- ป้ายร้านค้า: รวมอิโมจิทุกร้านไว้ใน texture แผ่นเดียว (atlas) ----------
   ป้ายทุกอันจึงใช้วัสดุเดียวกัน → รวม geometry ได้ ไม่กิน draw call เพิ่มร้านละอัน */
const SIGN_ICONS = [], SIGN_COLS = 5, SIGN_CELL = 128;
VILLAGE_LOTS.forEach(l=>{ if(l.kind!=='home' && SIGN_ICONS.indexOf(l.icon)<0) SIGN_ICONS.push(l.icon); });
SIGN_ICONS.push('🌷');                     /* ป้ายทุ่งดอกไม้ (ไม่ได้ผูกกับล็อตไหน แต่ใช้ป้าย atlas เดียวกัน) */
let signMat = null;
function signAtlasMat(){
  if(signMat) return signMat;
  const cv = document.createElement('canvas');
  cv.width = cv.height = SIGN_COLS * SIGN_CELL;
  const ctx = cv.getContext('2d');
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '84px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif';
  SIGN_ICONS.forEach((ic, i)=>{
    const c = i % SIGN_COLS, r = (i / SIGN_COLS) | 0;
    ctx.fillText(ic, c*SIGN_CELL + SIGN_CELL/2, r*SIGN_CELL + SIGN_CELL/2 + 4);
  });
  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearFilter;
  signMat = new THREE.MeshBasicMaterial({map:tex, transparent:true, alphaTest:.3, side:THREE.DoubleSide});
  return signMat;
}
function signPlane(icon, size){
  const i = Math.max(0, SIGN_ICONS.indexOf(icon));
  const c = i % SIGN_COLS, r = (i / SIGN_COLS) | 0;
  const geo = new THREE.PlaneGeometry(size, size);
  const uv = geo.attributes.uv;
  for(let k=0; k<uv.count; k++){       /* texture flipY → แถวบนสุดของ canvas อยู่ v สูงสุด */
    uv.setXY(k, (c + uv.getX(k))/SIGN_COLS, (SIGN_COLS-1-r + uv.getY(k))/SIGN_COLS);
  }
  return new THREE.Mesh(geo, signAtlasMat());
}

/* ---------- อาคารในชุมชน (ร้านค้า/บ้าน NPC/โรงเรียน) ----------
/* ---------- อาคารในชุมชน (ร้านค้า / บ้าน NPC / โรงนา / กระท่อม / โรงเรียน) ----------
   ประตูหันไปทางทิศใต้ (+z) เสมอ ให้ช่องหน้าประตู (z1+1) เป็นที่ยืนคุยกับ NPC ในเฟสถัดไป
   หน้าตาแยกตาม lot.kind + lot.style (ทรงบ้าน) + lot.shopKind (ของหน้าร้านตามประเภทร้าน)
     style: gable = จั่ว+ปล่องไฟ | hip = ปั้นหยา+กันสาดหน้าบ้าน | two = สองชั้น+ระเบียง | dormer = จั่ว+หน้าต่างหลังคา
   เพิ่มทรงใหม่ให้บ้าน/ร้านทีหลังได้โดยเพิ่ม case ใน addRoof/addShopFront เท่านั้น */
function addRoofGable(g, bw, bd, bh, roofHex, wallHex, rise){
  const HALF = bw/2+.22, DEP = bd+.34;
  const rmat = toonMat(roofHex), slopeLen = Math.hypot(HALF, rise), ang = Math.atan2(rise, HALF);
  [1,-1].forEach(s=>{
    const pl = new THREE.Mesh(roundedBoxGeo(slopeLen, .16, DEP, .05), rmat);
    pl.castShadow = hShadows; pl.rotation.z = -s*ang;
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
  r.castShadow = hShadows; r.scale.set(bw + .42, 1, bd + .42);
  r.position.y = bh + .46; g.add(r);
  const cap = sphere(.11, roofHex, 8); cap.position.y = bh + .95; g.add(cap);
}
function addChimney(g, bw, bd, bh, rise){
  const ch = box(.3, .74, .3, 0xd08b6a, .04); ch.position.set(bw*.28, bh + rise*.5, -bd*.18); g.add(ch);
  const cap = box(.4, .1, .4, 0xf3e7d6, .03); cap.position.set(bw*.28, bh + rise*.5 + .42, -bd*.18); g.add(cap);
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
  if(kind==='bakery'){                              /* ขนมปังก้อนโต */
    const lf = sphere(.34,0xe0a860,12); lf.scale.set(1.45,.85,.95); lf.position.set(0, base+.28, 0); g.add(lf);
    [-.2,0,.2].forEach(o=>{ const cut = box(.1,.06,.5,0xd8954a,.02); cut.rotation.y = .5;
      cut.position.set(o, base+.5, 0); g.add(cut); });
  } else if(kind==='toy'){                          /* ตุ๊กตาหมียักษ์ */
    const bd2 = sphere(.26,0xd9a86c,12); bd2.position.set(0, base+.24, 0); g.add(bd2);
    const hd = sphere(.22,0xe8b46a,12); hd.position.set(0, base+.62, 0); g.add(hd);
    [-1,1].forEach(s=>{ const ea = sphere(.1,0xd9a86c,10); ea.position.set(s*.18, base+.78, 0); g.add(ea); });
    [-1,1].forEach(s=>{ const ey = sphere(.03,0x3a2f28,8); ey.position.set(s*.08, base+.64, .2); g.add(ey); });
    const mz = sphere(.09,0xf2d5a8,10); mz.position.set(0, base+.56, .18); g.add(mz);
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
  if(kind==='bakery'){                             /* ชั้นวางขนมปังหน้าร้าน */
    const shelf = box(1.5,.12,.4,0xd9a86c,.04); shelf.position.set(-bw*.22,.62,front); g.add(shelf);
    [-.42,0,.42].forEach((o,i)=>{
      const lf = sphere(.17,[0xe0a860,0xd8954a,0xecc07a][i],10);
      lf.scale.set(1.3,.8,.9); lf.position.set(-bw*.22+o,.78,front); g.add(lf);
    });
  }else if(kind==='toy'){                          /* ธงราวเล็ก + ลูกบอล + ตัวต่อ */
    [-1,1].forEach(s=>{ const p = cyl(.04,.04,1.5,0xf7f3ee,6); p.position.set(s*(bw/2-.1),.75,front); g.add(p); });
    for(let i=0;i<5;i++){
      const fl = cone(.12,.22,[0xff8fb3,0xffd54f,0x7fc4e8,0xb388ff,0xff8a65][i],4);
      fl.rotation.x = Math.PI; fl.position.set(-bw/2+.4+i*(bw-.8)/4, 1.34, front); g.add(fl);
    }
    const ball = sphere(.2,0xff8a65,12); ball.position.set(bw*.3,.2,front+.1); g.add(ball);
    [[0,.16],[.02,.44]].forEach((p,i)=>{ const bk = box(.28,.28,.28,[0x7fc4e8,0xffd54f][i],.04); bk.position.set(-bw*.34+p[0],p[1],front+.05); g.add(bk); });
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
/* ตึกเรียน 2 ชั้น หลังคาแบน มีมุขหน้า+หอระฆัง+เสาธง (ต่างจากบ้าน/ร้านชัดเจน ให้เด็กแยกออกทันที) */
function buildSchoolBuilding(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const bw = w-.4, bd = d-.6, bh = 2.7;
  const body = box(bw, bh, bd, lot.wall, .06); body.position.y = bh/2; g.add(body);
  const band = box(bw+.05, .14, bd+.05, lot.roof, .03); band.position.y = 1.42; g.add(band);   /* คาดกลางแบ่งชั้น */
  const para = box(bw+.2, .22, bd+.2, lot.roof, .05); para.position.y = bh + .09; g.add(para); /* ขอบหลังคาแบน */
  const top = box(bw+.02, .1, bd+.02, 0xe8dcc8, .03); top.position.y = bh - .02; g.add(top);
  /* หน้าต่างเรียงเป็นแถว: ชั้นล่าง 2 บาน (เว้นกลางไว้ทำประตู) + ชั้นบน 3 บาน */
  const winAt = (x, y)=>{
    const wf = box(.56,.62,.06,0xffffff,.03); wf.position.set(x, y, bd/2+.02); g.add(wf);
    const wi = box(.42,.48,.09,0xaadcf5,.02); wi.position.set(x, y, bd/2+.03); g.add(wi);
    const sill = box(.62,.07,.12,lot.roof,.02); sill.position.set(x, y-.36, bd/2+.06); g.add(sill);
  };
  [-1,1].forEach(s=> winAt(s*bw*.32, .95));
  [-1,1].forEach(s=> winAt(s*bw*.32, 2.05));   /* ชั้นบนเว้นกลางไว้ติดป้ายโรงเรียน */
  /* มุขหน้า: กันสาด + 2 เสา + บันได 2 ขั้น + ประตูบานคู่ */
  const dz = bd/2;
  const dr = box(.86, 1.1, .12, 0x8f6231, .03); dr.position.set(0, .55, dz+.03); g.add(dr);
  const split = box(.05, 1.1, .14, 0xf3e7d6); split.position.set(0, .55, dz+.06); g.add(split);
  [-1,1].forEach(s=>{ const kn = sphere(.045,0xffd54f,8); kn.position.set(s*.14,.55,dz+.11); g.add(kn); });
  const canopy = box(1.7, .12, .7, lot.roof, .04); canopy.position.set(0, 1.34, dz+.3); g.add(canopy);
  [-1,1].forEach(s=>{ const pil = cyl(.08,.08,1.3,0xf7f3ee,10); pil.position.set(s*.72,.65,dz+.56); g.add(pil); });
  [[.1,1.1],[.02,1.5]].forEach((st,i)=>{
    const stp = box(1.5-i*.3, .1, .5-i*.16, 0xe8dcc8, .02); stp.position.set(0, .05+i*.1, dz+st[1]*.32); g.add(stp);
  });
  /* หอระฆังเล็กบนหลังคา + ระฆัง */
  const tw = box(.78,.92,.78,0xfffaf0,.05); tw.castShadow = hShadows; tw.position.set(0, bh+.66, 0); g.add(tw);
  const twBand = box(.86,.1,.86,lot.roof,.03); twBand.position.set(0, bh+.24, 0); g.add(twBand);
  [[0,.42],[.42,0]].forEach(([ox,oz])=>{                    /* ช่องโปร่งรอบหอระฆัง (เล็กๆ พอเห็นว่าเป็นหอ) */
    [-1,1].forEach(s=>{ const ar = box(ox?.3:.1, .34, oz?.3:.1, 0x6f8698, .03);
      ar.position.set(s*(ox?0:.39), bh+.74, s*(oz?0:.39)); g.add(ar); });
  });
  /* หลังคาหอระฆังใช้สีฟ้าเทา ไม่ใช้ lot.roof เพราะหลังคาตึกก็สีเดียวกัน มองไม่ออกว่าเป็นหอ */
  const twr = cone(.72,.82,0x7f9fd6,4); twr.castShadow = hShadows; twr.rotation.y = Math.PI/4; twr.position.set(0, bh+1.53, 0); g.add(twr);
  const twTip = sphere(.09,0xffd54f,8); twTip.position.set(0, bh+2.0, 0); g.add(twTip);
  const bell = sphere(.17,0xe6b422,10); bell.scale.set(1,.9,1); bell.position.set(0, bh+.7, .41); g.add(bell);
  /* เสาธงข้างอาคาร */
  const pole = cyl(.05,.05,2.4,0xdfe6ea,8); pole.position.set(-bw/2-.5, 1.2, dz-.2); g.add(pole);
  const flag = box(.52,.34,.04,0x5aa9e6,.02); flag.position.set(-bw/2-.78, 2.2, dz-.2); g.add(flag);
  const knob = sphere(.07,0xffd54f,8); knob.position.set(-bw/2-.5, 2.44, dz-.2); g.add(knob);
  /* ป้ายโรงเรียนเหนือประตู */
  const sg = signPlane(lot.icon, .66); sg.position.set(0, 2.05, dz+.06); g.add(sg);
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}
/* ---------- โรงพยาบาลของชุมชน ----------
   ตึกขาว 2 ชั้นหลังคาแบน + กากบาทแดงใหญ่กลางหน้าอาคาร + ลานจอดรถพยาบาลด้านขวา
   ตั้งใจให้เป็นอาคารที่กว้างที่สุดในแถวนี้ เด็กมองปราดเดียวก็รู้ว่าเป็นโรงพยาบาล */
function buildHospital(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;      /* ล็อต 8×5 ช่อง */
  const bw = w*.7, bd = d-.9, fh = 1.3, bh = fh*2;
  const cx = -w*.14, dz = bd/2;                        /* ตัวตึกเยื้องซ้าย เว้นที่ขวาไว้ทำลานจอดรถพยาบาล */
  const body = box(bw, bh, bd, lot.wall, .08); body.castShadow = hShadows;
  body.position.set(cx, bh/2, 0); g.add(body);
  const band = box(bw+.06,.16,bd+.06, lot.roof,.04); band.position.set(cx, fh, 0); g.add(band);     /* คาดแบ่งชั้น */
  const top = box(bw+.04,.1,bd+.04, 0xe8eef5,.03); top.position.set(cx, bh-.02, 0); g.add(top);
  const para = box(bw+.24,.24,bd+.24, lot.roof,.06); para.position.set(cx, bh+.1, 0); g.add(para);  /* ขอบหลังคาแบน */
  const winAt = (x, y)=>{
    const wf = box(.6,.66,.06,0xffffff,.03); wf.position.set(x, y, dz+.02); g.add(wf);
    const wi = box(.46,.5,.09,0xaadcf5,.02); wi.position.set(x, y, dz+.03); g.add(wi);
    const sl = box(.66,.07,.12, lot.roof,.02); sl.position.set(x, y-.38, dz+.06); g.add(sl);
  };
  [-1.85,1.85].forEach(o=> winAt(cx+o, .92));          /* ชั้นล่างเว้นกลางไว้ทำทางเข้า */
  [-1.85,1.85].forEach(o=> winAt(cx+o, 2.0));          /* ชั้นบนเว้นกลางไว้ติดกากบาท */
  /* กากบาทแดงบนผนังชั้น 2 */
  const cbg = box(.92,.92,.06,0xffffff,.05); cbg.position.set(cx, 2.0, dz+.03); g.add(cbg);
  const ch1 = box(.66,.2,.08,0xe4574a,.04); ch1.position.set(cx, 2.0, dz+.06); g.add(ch1);
  const ch2 = box(.2,.66,.08,0xe4574a,.04); ch2.position.set(cx, 2.0, dz+.06); g.add(ch2);
  /* ทางเข้า: ประตูกระจกบานคู่ + กันสาด 2 เสา + พรมทางเข้า */
  const dr = box(1.5,1.15,.12, 0xbfe6f7,.04); dr.position.set(cx,.58,dz+.03); g.add(dr);
  const dsp = box(.06,1.15,.15,0xf7f3ee); dsp.position.set(cx,.58,dz+.06); g.add(dsp);
  const dfr = box(1.68,1.3,.06,0xffffff,.03); dfr.position.set(cx,.65,dz+.01); g.add(dfr);
  const cvp = box(2.2,.14,.9, lot.roof,.05); cvp.position.set(cx,1.5,dz+.42); g.add(cvp);
  [-1,1].forEach(s=>{ const p = cyl(.08,.08,1.44,0xf7f3ee,10); p.position.set(cx+s*.95,.72,dz+.78); g.add(p); });
  const mat = box(1.9,.06,.7, 0x7fc4e8,.03); mat.position.set(cx,.03,dz+.5); g.add(mat);
  /* กระถางต้นไม้ 2 ข้างประตู */
  [-1,1].forEach(s=>{
    const pot = cyl(.24,.2,.3,0xf3e7d6,12); pot.position.set(cx+s*1.7,.15,dz+.42); g.add(pot);
    const bs = sphere(.26,0x6fbf73,10); bs.position.set(cx+s*1.7,.42,dz+.42); g.add(bs);
  });
  /* ป้ายโรงพยาบาลบนดาดฟ้า */
  const sbf = box(1.62,.82,.06, lot.roof,.05); sbf.position.set(cx, bh+.55, dz+.02); g.add(sbf);
  const sbg = box(1.5,.7,.1, 0xffffff,.05); sbg.position.set(cx, bh+.55, dz+.06); g.add(sbg);
  const sg = signPlane(lot.icon,.6); sg.position.set(cx, bh+.55, dz+.13); g.add(sg);
  /* ดาดฟ้า: ลานจอดเฮลิคอปเตอร์ตัว H + ถังเก็บน้ำ */
  const pad = cyl(1,1,.08, 0x8fa3b0, 20); pad.position.set(cx+.6, bh+.26, -.5); g.add(pad);
  const ring = torus(.84,.06,0xffffff,20); ring.rotation.x = Math.PI/2; ring.position.set(cx+.6, bh+.32, -.5); g.add(ring);
  [-1,1].forEach(s=>{ const br = box(.13,.05,.66,0xffffff,.02); br.position.set(cx+.6+s*.25, bh+.32, -.5); g.add(br); });
  const hmid = box(.38,.05,.13,0xffffff,.02); hmid.position.set(cx+.6, bh+.32, -.5); g.add(hmid);
  const tank = cyl(.32,.32,.5,0xf3f7fa,12); tank.position.set(cx-1.9, bh+.5, -1.2); g.add(tank);
  const tcap = cyl(.34,.34,.09,0x7fc4e8,12); tcap.position.set(cx-1.9, bh+.78, -1.2); g.add(tcap);
  /* ลานจอดรถพยาบาล: หลังคาโปร่ง 4 เสา + รถพยาบาลจอดอยู่ */
  const bx = w*.32, bz = -.1;
  const roof2 = box(2.5,.12,3, 0xffffff,.05); roof2.position.set(bx,1.62,bz); g.add(roof2);
  const rstr = box(2.54,.1,.34, 0xe4574a,.03); rstr.position.set(bx,1.62,bz+1.35); g.add(rstr);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{
    const p = cyl(.07,.07,1.56,0xdfe6ea,8); p.position.set(bx+sx*1.06,.78,bz+sz*1.32); g.add(p);
  });
  const van = box(1.1,.7,2, 0xfbfdff,.14); van.castShadow = hShadows; van.position.set(bx,.62,bz); g.add(van);
  const cab = box(1,.5,.72, 0xfbfdff,.12); cab.position.set(bx,.5,bz+1.2); g.add(cab);
  const wsh = box(.86,.32,.06,0xaadcf5,.03); wsh.position.set(bx,.58,bz+1.57); g.add(wsh);
  const vstr = box(1.14,.16,2, 0xe4574a,.04); vstr.position.set(bx,.6,bz); g.add(vstr);
  [-1,1].forEach(s=>{                                   /* กากบาทข้างรถ */
    const h1 = box(.06,.1,.4,0xe4574a,.02); h1.position.set(bx+s*.57,.88,bz-.25); g.add(h1);
    const v1 = box(.06,.4,.1,0xe4574a,.02); v1.position.set(bx+s*.57,.88,bz-.25); g.add(v1);
  });
  const lbar = box(.5,.1,.24,0xf7f3ee,.03); lbar.position.set(bx,1,bz+.5); g.add(lbar);
  [[-.13,0xe4574a],[.13,0x5aa9e6]].forEach(p=>{
    const l = sphere(.09,p[1],10); l.position.set(bx+p[0],1.06,bz+.5); g.add(l);
  });
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sz])=>{
    const wl = cyl(.24,.24,.14,0x3a3f46,12); wl.rotation.z = Math.PI/2;
    wl.position.set(bx+sx*.56,.24,bz+sz*.66); g.add(wl);
  });
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}

/* ---------- สถานีตำรวจของชุมชน ----------
   ตึกขาว-น้ำเงิน 2 ชั้น หลังคาแบน + มุขทางเข้ามีเสา 2 ต้น + โล่ดาวใหญ่ + ไฟสัญญาณแดง-น้ำเงินบนหลังคา
   (เดิมใช้ทรงบ้านธรรมดาแล้วแต่งหน้าเอา ตอนนี้เป็นอาคารเต็มหลังของตัวเอง) */
function buildPoliceStation(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;      /* ล็อต 4×3 ช่อง */
  const bw = w-.6, bd = d-.5, fh = 1.16, bh = fh*2;
  const dz = bd/2;
  const body = box(bw, bh, bd, lot.wall, .07); body.castShadow = hShadows; body.position.y = bh/2; g.add(body);
  const base = box(bw+.1,.42,bd+.1, lot.roof,.04); base.position.y = .21; g.add(base);              /* ฐานน้ำเงิน */
  const band = box(bw+.06,.15,bd+.06, lot.roof,.03); band.position.y = fh; g.add(band);             /* คาดแบ่งชั้น */
  const top = box(bw+.04,.1,bd+.04,0xe8eef5,.03); top.position.y = bh-.02; g.add(top);
  const para = box(bw+.22,.22,bd+.22, lot.roof,.05); para.position.y = bh+.09; g.add(para);
  const winAt = (x, y)=>{
    const wf = box(.56,.62,.06,0xffffff,.03); wf.position.set(x, y, dz+.02); g.add(wf);
    const wi = box(.42,.48,.09,0xaadcf5,.02); wi.position.set(x, y, dz+.03); g.add(wi);
    const sl = box(.62,.07,.12, lot.roof,.02); sl.position.set(x, y-.36, dz+.06); g.add(sl);
  };
  [-1,1].forEach(s=> winAt(s*bw*.32, .95));            /* ชั้นล่างเว้นกลางไว้ทำประตู */
  [-1,1].forEach(s=> winAt(s*bw*.32, 1.86));           /* ชั้นบนเว้นกลางไว้ติดโล่ดาว */
  /* ประตูบานคู่ + มุขกันสาด 2 เสา + บันได */
  const dr = box(.9,1.08,.12, 0x2f4f8f,.03); dr.position.set(0,.54,dz+.03); g.add(dr);
  const dsp = box(.05,1.08,.15,0xf3e7d6); dsp.position.set(0,.54,dz+.06); g.add(dsp);
  [-1,1].forEach(s=>{ const kn = sphere(.045,0xffd54f,8); kn.position.set(s*.15,.52,dz+.11); g.add(kn); });
  const cvp = box(1.8,.13,.8, lot.roof,.05); cvp.position.set(0,1.42,dz+.36); g.add(cvp);
  [-1,1].forEach(s=>{
    const ps = cyl(.075,.075,1.36,0xf7f3ee,10); ps.position.set(s*.76,.68,dz+.66); g.add(ps);
    const lm = sphere(.1,0xfff2b0,10); lm.position.set(s*.76,1.5,dz+.66); g.add(lm);                /* โคมไฟข้างประตู */
  });
  const step = box(1.6,.1,.5,0xe8dcc8,.02); step.position.set(0,.05,dz+.42); g.add(step);
  /* โล่ดาวใหญ่กลางผนังชั้น 2 */
  const shd = cyl(.34,.34,.07, 0xffd54f, 5); shd.rotation.x = Math.PI/2; shd.position.set(0,1.9,dz+.04); g.add(shd);
  const shi = cyl(.25,.25,.08, 0xf7f3ee, 5); shi.rotation.x = Math.PI/2; shi.rotation.y = Math.PI/5; shi.position.set(0,1.9,dz+.08); g.add(shi);
  const shc = cyl(.12,.12,.09, lot.roof, 5); shc.rotation.x = Math.PI/2; shc.position.set(0,1.9,dz+.11); g.add(shc);
  /* ไฟสัญญาณแดง-น้ำเงินบนหลังคา */
  const bar = box(.8,.14,.32,0xf7f3ee,.04); bar.position.set(0, bh+.28, dz*.4); g.add(bar);
  [[-.2,0xe4574a],[.2,0x5aa9e6]].forEach(p=>{
    const lp = sphere(.12,p[1],10); lp.scale.y = .8; lp.position.set(p[0], bh+.38, dz*.4); g.add(lp);
  });
  /* เสาธงข้างอาคาร */
  const pole = cyl(.045,.045,2.2,0xdfe6ea,8); pole.position.set(-bw/2-.42,1.1,dz-.3); g.add(pole);
  const flag = box(.46,.3,.04,0x5aa9e6,.02); flag.position.set(-bw/2-.66,2.02,dz-.3); g.add(flag);
  const knb = sphere(.06,0xffd54f,8); knb.position.set(-bw/2-.42,2.24,dz-.3); g.add(knb);
  /* กรวยจราจร 2 อันหน้าสถานี */
  [-1,1].forEach(s=>{
    const cb = box(.3,.05,.3,0xf7f3ee,.02); cb.position.set(s*bw*.36,.03,dz+.62); g.add(cb);
    const cn = cone(.13,.42,0xef8354,10); cn.position.set(s*bw*.36,.26,dz+.62); g.add(cn);
    const rg = cyl(.11,.115,.07,0xfffaf0,10); rg.position.set(s*bw*.36,.26,dz+.62); g.add(rg);
  });
  /* ป้ายสถานีบนดาดฟ้า */
  const sbf = box(1.4,.74,.06, lot.roof,.05); sbf.position.set(0, bh+.52, dz+.02); g.add(sbf);
  const sbg = box(1.28,.62,.1,0xfffaf0,.05); sbg.position.set(0, bh+.52, dz+.06); g.add(sbg);
  const sg = signPlane(lot.icon,.54); sg.position.set(0, bh+.52, dz+.13); g.add(sg);
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}
function buildLotBuilding(lot){
  if(lot.kind==='school') return buildSchoolBuilding(lot);
  if(lot.kind==='hospital') return buildHospital(lot);
  if(lot.kind==='police') return buildPoliceStation(lot);
  if(lot.kind==='carpenter') return buildCarpenterHut(lot);
  if(lot.kind==='hotel') return buildHotel(lot);
  if(lot.kind==='mayor') return buildMayorHouse(lot);
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const style = lot.style || 'gable';
  const two = lot.kind==='home' && style==='two';
  const hut = lot.kind==='hut';
  const bw = w-.5, bd = d-.35;
  const bh = lot.kind==='barn' ? 1.7 : (two ? 2.4 : (hut ? 1.3 : 1.45));
  const wall = box(bw, bh, bd, lot.wall); wall.position.y = bh/2; g.add(wall);
  if(hut){                                  /* กระท่อมไม้: เห็นแนวซุงเป็นชั้นๆ */
    [.3,.66,1.02].forEach(y=>{ const lg = box(bw+.04,.1,bd+.04,0xb4763a,.05); lg.position.y = y; g.add(lg); });
  }
  const hipRoof = (lot.kind==='home' && style==='hip');
  if(hipRoof) addRoofHip(g, bw, bd, bh, lot.roof);
  else addRoofGable(g, bw, bd, bh, lot.roof, hut ? 0xa9784f : lot.wall, hut ? 1.05 : .95);
  if(lot.kind!=='barn') addDoor(g, bd, hut ? 0x8f6231 : 0x9c6238);   /* โรงนามีประตูบานใหญ่ของตัวเอง */
  addWindowPair(g, bw, bd, two ? .95 : 1, style==='flowerbox' || style==='hip' || hut);
  if(style==='gable' || style==='dormer') addChimney(g, bw, bd, bh, .95);
  if(style==='dormer'){                     /* หน้าต่างหลังคา — สันหลังคาทอดตามแกน z ผืนหลังคาจึงหันไป ±x
                                               ต้องวางออกมาบนผืนลาดด้าน -x ไม่ใช่ใกล้สันหลังคา ไม่งั้นจมอยู่ในหลังคา */
    [-1,1].forEach(sd=>{                    /* ทำทั้ง 2 ผืนลาด กล้องมุมไอโซจะเห็นด้านใดด้านหนึ่งเสมอ */
      const dx = sd*bw*.3, dy = bh + .95*(1 - Math.abs(dx)/(bw/2+.22)) + .1;
      const dm = box(.74,.56,.68,lot.wall,.05); dm.castShadow = hShadows; dm.position.set(dx, dy, 0); g.add(dm);
      const dw = box(.1,.32,.36,0xaadcf5,.02); dw.position.set(dx+sd*.39, dy+.02, 0); g.add(dw);
      const dsl = box(.14,.09,.42,lot.roof,.02); dsl.position.set(dx+sd*.42, dy-.19, 0); g.add(dsl);
      const dr = box(.5,.1,.86,lot.roof,.03); dr.rotation.z = .42; dr.position.set(dx-.16, dy+.34, 0); g.add(dr);
      const dr2 = box(.5,.1,.86,lot.roof,.03); dr2.rotation.z = -.42; dr2.position.set(dx+.2, dy+.34, 0); g.add(dr2);
    });
  }
  if(hipRoof || hut){                       /* กันสาด/ชายคาหน้าประตู + เสา 2 ต้น */
    const cv = box(1.5,.1,.62,lot.roof,.03); cv.position.set(0, 1.34, bd/2+.28); g.add(cv);
    [-1,1].forEach(s=>{ const ps = cyl(.06,.06,1.3,hut?0xa9784f:0xf7f3ee,8); ps.position.set(s*.62,.65,bd/2+.52); g.add(ps); });
  }
  if(two){                                  /* บ้านสองชั้น: ระเบียงหน้าบ้านชั้นบน */
    addWindowPair(g, bw, bd, 1.9, false);
    const sl = box(bw*.8,.1,.62,0xd9a86c,.03); sl.position.set(0, 1.58, bd/2+.26); g.add(sl);
    const rl = box(bw*.8,.07,.07,0xfffaf0,.03); rl.position.set(0, 1.94, bd/2+.54); g.add(rl);
    for(let i=0;i<5;i++){ const bar = box(.06,.36,.06,0xfffaf0,.02); bar.position.set(-bw*.34+i*(bw*.68/4), 1.76, bd/2+.54); g.add(bar); }
  }
  if(hut){                                  /* ของหน้ากระท่อม: ถังไม้ + สวิงตักปลา */
    const brl = cyl(.2,.22,.42,0xa9784f,12); brl.position.set(bw*.34,.21,bd/2+.4); g.add(brl);
    const hoop = torus(.19,.03,0x8f6231,12); hoop.rotation.x = Math.PI/2; hoop.position.set(bw*.34,.36,bd/2+.4); g.add(hoop);
    const rod = cyl(.03,.03,1.5,0xc98d4e,6); rod.rotation.z = .35; rod.position.set(-bw*.36,.75,bd/2+.3); g.add(rod);
    const net = torus(.16,.035,0x9fb6a8,10); net.rotation.x = .5; net.position.set(-bw*.36-.26,1.44,bd/2+.3); g.add(net);
  }
  if(lot.kind==='shop') addShopFront(g, lot.shopKind, bw, bd, bh, lot.roof);
  if(lot.kind==='barn'){                    /* โรงนา: ประตูบานใหญ่กากบาทขาว + ไซโลเก็บข้าวข้างๆ */
    const bigDoor = box(1.5, 1.3, .12, 0xc4573f, .05); bigDoor.position.set(0, .65, bd/2+.04); g.add(bigDoor);
    const split = box(.07, 1.24, .04, 0xf7e6d0, .02); split.position.set(0, .65, bd/2+.11); g.add(split);
    [-1,1].forEach(s=>{                                /* กากบาทขาวบนบานประตู (ไม่ยื่นเกินบาน) */
      const br = box(1.42, .11, .05, 0xf7e6d0, .02); br.position.set(0, .65, bd/2+.11);
      br.rotation.z = s*.72; g.add(br);
      const rail = box(1.44, .1, .05, 0xf7e6d0, .02); rail.position.set(0, .65 + s*.55, bd/2+.11); g.add(rail);
    });
    const silo = cyl(.42, .42, 1.85, 0xefe4cd, 14);
    silo.position.set(bw/2+.62, .92, -bd/4); silo.castShadow = hShadows; g.add(silo);
    const siloCap = sphere(.42, 0xb9c7d2, 12); siloCap.position.set(bw/2+.62, 1.85, -bd/4); g.add(siloCap);
  }
  if(lot.kind!=='home'){                     /* ป้ายรูปหน้าร้าน/โรงนา/กระท่อม */
    const sy = bh + (hipRoof ? .5 : .58);
    let sz = bd/2 + .16;
    if(lot.kind==='shop'){                          /* ร้านค้า: มีแผ่นป้ายพื้นขาว + กรอบสีหลังคา ให้เห็นรูปชัดขึ้น */
      const fr = box(1.06,.9,.08, lot.roof, .04); fr.position.set(0, sy, bd/2 + .12); g.add(fr);
      const fc = box(.88,.72,.06, 0xfffaf0, .03); fc.position.set(0, sy, bd/2 + .16); g.add(fc);
      sz = bd/2 + .21;
    }
    const sg = signPlane(lot.icon, .68);
    /* z ต้องเลยหน้าจั่ว (หน้าจั่วอยู่ที่ bd/2-.04 หนา .1) ไม่งั้นป้ายจมกับผนังจั่วแล้วหาย */
    sg.position.set(0, sy, sz); g.add(sg);
  }
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}


/* ---------- โรงแรมของชุมชน ----------
   ตึก 3 ชั้นทรงจั่ว (สันหลังคาทอดตามแกน z เหมือนอาคารอื่น หน้าจั่วจึงหันออกหน้า +z)
   ชั้นล่าง = ล็อบบี้กระจกใหญ่ + กันสาดทางเข้า + พรมแดง, ชั้น 2-3 = ห้องพักมีระเบียงเรียงเป็นแถว
   หลังคามีธง 3 ผืนกับป้ายโรงแรม ให้ดูเป็นตึกที่สูงเด่นที่สุดในแถวนั้น */
function buildHotel(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const bw = w-.5, bd = d-.35, fh = 1.06, bh = fh*3;      /* 3 ชั้น ชั้นละ fh */
  const body = box(bw, bh, bd, lot.wall); body.position.y = bh/2; body.castShadow = hShadows; g.add(body);
  const base = box(bw+.12, .34, bd+.12, 0xf0e2cd, .05); base.position.y = .17; g.add(base);
  [1,2].forEach(f=>{                                     /* คิ้วคั่นชั้น */
    const bd2 = box(bw+.08, .12, bd+.08, 0xf7c6d8, .04); bd2.position.y = fh*f; g.add(bd2);
  });
  addRoofGable(g, bw, bd, bh, lot.roof, lot.wall, .9);
  const fz = bd/2;
  /* --- ชั้นล่าง: ประตูกระจก 2 บาน + กระจกล็อบบี้ 2 ฝั่ง --- */
  const dr = box(1.02, .96, .12, 0xbfe6f5, .04); dr.position.set(0, .48, fz+.03); g.add(dr);
  const drf = box(1.14, 1.06, .07, 0xc98d4e, .04); drf.position.set(0, .53, fz+.01); g.add(drf);
  const drs = box(.07, .96, .05, 0xfff6e8, .02); drs.position.set(0, .48, fz+.1); g.add(drs);
  [-1,1].forEach(sd=>{
    const gl = box(1.0, .72, .1, 0xbfe6f5, .04); gl.position.set(sd*1.55, .56, fz+.02); g.add(gl);
    const gf = box(1.12, .84, .05, 0xfff6e8, .03); gf.position.set(sd*1.55, .56, fz); g.add(gf);
    const aw = box(1.18, .1, .46, lot.roof, .04); aw.position.set(sd*1.55, 1.02, fz+.2); aw.rotation.x = -.2; g.add(aw);
  });
  /* กันสาดทางเข้า + เสา 2 ต้น + พรมแดง */
  const cv = box(1.9, .16, .96, lot.roof, .05); cv.position.set(0, 1.3, fz+.5); g.add(cv);
  const cvt = box(1.74, .07, .82, 0xfff6e8, .03); cvt.position.set(0, 1.4, fz+.5); g.add(cvt);
  [-1,1].forEach(sd=>{
    const ps = cyl(.09, .1, 1.28, 0xfff6e8, 10); ps.position.set(sd*.78, .64, fz+.88); g.add(ps);
    const pb = cyl(.15, .17, .12, 0xe8dcc8, 10); pb.position.set(sd*.78, .06, fz+.88); g.add(pb);
  });
  const rug = box(.94, .06, 1.5, 0xd6465c, .03); rug.position.set(0, .03, fz+.72); g.add(rug);
  const rugE = box(1.06, .04, 1.62, 0xf0c14b, .02); rugE.position.set(0, .015, fz+.72); g.add(rugE);
  /* กระถางต้นไม้ 2 ข้างทางเข้า */
  [-1,1].forEach(sd=>{
    const pot = cyl(.19, .15, .3, 0xdc8f5a, 10); pot.position.set(sd*1.06, .15, fz+.62); g.add(pot);
    const bush = sphere(.26, 0x6fbf73, 8); bush.scale.set(1,1.2,1); bush.position.set(sd*1.06, .5, fz+.62); g.add(bush);
    const fl = sphere(.07, 0xff8fb3, 6); fl.position.set(sd*1.06+.14, .64, fz+.7); g.add(fl);
  });
  /* --- ชั้น 2-3: ห้องพักเรียงแถว หน้าต่างบานสูง + ระเบียงลูกกรง --- */
  [1,2].forEach(f=>{
    const y = fh*f + .12;
    [-1.5, 0, 1.5].forEach(px=>{
      const wd = box(.62, .68, .1, 0xbfe6f5, .04); wd.position.set(px, y+.44, fz+.02); g.add(wd);
      const wf = box(.74, .8, .05, 0xfff6e8, .03); wf.position.set(px, y+.44, fz); g.add(wf);
      const sl = box(.8, .07, .34, 0xf3e0c8, .03); sl.position.set(px, y+.06, fz+.15); g.add(sl);
      const rl = box(.8, .05, .05, 0xfff6e8, .02); rl.position.set(px, y+.36, fz+.3); g.add(rl);
      for(let k=0;k<4;k++){ const br = box(.045,.3,.045,0xfff6e8,.02); br.position.set(px-.3+k*.2, y+.21, fz+.3); g.add(br); }
    });
    [-1,1].forEach(sd=>{                                 /* หน้าต่างด้านข้างตึก */
      const sw = box(.1, .6, .5, 0xbfe6f5, .04); sw.position.set(sd*(bw/2+.01), y+.42, -.5); g.add(sw);
      const sw2 = box(.1, .6, .5, 0xbfe6f5, .04); sw2.position.set(sd*(bw/2+.01), y+.42, .7); g.add(sw2);
    });
  });
  /* --- หลังคา: ธง 3 ผืน + ป้ายโรงแรมบนหน้าจั่ว --- */
  [-1.3, 0, 1.3].forEach((px,i)=>{
    const pole = cyl(.045,.045,.9, 0xf7f3ee, 6); pole.position.set(px, bh+1.28, 0); g.add(pole);
    const flag = box(.42,.26,.04, [0xff8fb3,0xffd54f,0x7fc4e8][i], .02); flag.position.set(px+.23, bh+1.62, 0); g.add(flag);
  });
  const sfr = box(1.12, .84, .08, 0xfff6e8, .05); sfr.position.set(0, bh+.62, fz+.06); g.add(sfr);
  const sfb = box(.94, .68, .06, lot.roof, .04); sfb.position.set(0, bh+.62, fz+.11); g.add(sfb);
  const sg = signPlane(lot.icon, .62); sg.position.set(0, bh+.62, fz+.16); g.add(sg);
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}

/* ---------- บ้านท่านเทศมนตรี ----------
   คฤหาสน์ 2 ชั้น หลังคาปั้นหยา + มุขเสาสูง 4 ต้นพร้อมหน้าจั่วสามเหลี่ยม + บันไดหน้าบ้าน
   บนหลังคามีหอนาฬิกาเล็กๆ กับธงประจำชุมชน ให้ดูเป็นบ้านที่ใหญ่และเป็นทางการที่สุดในชุมชน */
function buildMayorHouse(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const bw = w-.5, bd = d-.35, bh = 2.5;
  const body = box(bw, bh, bd, lot.wall); body.position.y = bh/2; body.castShadow = hShadows; g.add(body);
  const plinth = box(bw+.16, .3, bd+.16, 0xe6dbc8, .05); plinth.position.y = .15; g.add(plinth);
  const belt = box(bw+.08, .13, bd+.08, 0xe6dbc8, .04); belt.position.y = 1.3; g.add(belt);
  const cor = box(bw+.14, .16, bd+.14, 0xfffaf0, .05); cor.position.y = bh - .04; g.add(cor);
  addRoofHip(g, bw - 1.1, bd - 1.1, bh, lot.roof);   /* ย่อชายคาไม่ให้คลุมมุขเสาหน้าบ้าน */
  const fz = bd/2;
  /* --- มุขเสา: เสากลม 4 ต้น + คานบน + หน้าจั่วสามเหลี่ยม --- */
  const PX = [-1.62, -.56, .56, 1.62], ph = 2.16, pz = fz + .82;
  PX.forEach(px=>{
    const col = cyl(.15, .17, ph, 0xfffaf0, 12); col.position.set(px, ph/2 + .12, pz); col.castShadow = hShadows; g.add(col);
    const cap = box(.42,.13,.42, 0xfffaf0, .03); cap.position.set(px, ph + .16, pz); g.add(cap);
    const bas = box(.44,.14,.44, 0xfffaf0, .03); bas.position.set(px, .1, pz); g.add(bas);
  });
  const arch = box(3.94, .3, .58, 0xfffaf0, .05); arch.position.set(0, ph + .38, pz); g.add(arch);
  const ped = cone(1.5, .78, 0xfffaf0, 4); ped.rotation.y = Math.PI/4; ped.scale.set(1.42,1,.42);
  ped.position.set(0, ph + .9, pz); g.add(ped);
  const pedR = cone(1.56, .5, lot.roof, 4); pedR.rotation.y = Math.PI/4; pedR.scale.set(1.42,1,.5);
  pedR.position.set(0, ph + 1.08, pz); g.add(pedR);
  const emb = sphere(.19, 0xf0c14b, 10); emb.scale.z = .3; emb.position.set(0, ph + .74, pz + .3); g.add(emb);
  /* --- บันไดหน้าบ้าน 3 ขั้น --- */
  for(let k=0;k<3;k++){
    const st = box(3.0 + k*.34, .13, .34, 0xe6dbc8, .03);
    st.position.set(0, .34 - k*.12, fz + .92 + k*.3); g.add(st);
  }
  /* --- ประตูใหญ่ 2 บาน + ไฟข้างประตู --- */
  const door = box(1.0, 1.32, .12, 0x8d5a34, .05); door.position.set(0, .78, fz+.03); g.add(door);
  const dfr = box(1.18, 1.48, .07, 0xfffaf0, .04); dfr.position.set(0, .82, fz+.01); g.add(dfr);
  const dsp = box(.06, 1.32, .05, 0xfffaf0, .02); dsp.position.set(0, .78, fz+.1); g.add(dsp);
  [-1,1].forEach(sd=>{
    const kn = sphere(.06, 0xf0c14b, 8); kn.position.set(sd*.16, .8, fz+.11); g.add(kn);
    const lp = box(.16,.26,.16, 0xfff59d, .04); lp.position.set(sd*.86, 1.42, fz+.08); g.add(lp);
    const lpc = box(.2,.07,.2, 0x6f86c9, .03); lpc.position.set(sd*.86, 1.59, fz+.08); g.add(lpc);
  });
  /* --- ระเบียงชั้นบนเหนือประตู --- */
  const bal = box(2.1, .1, .5, 0xfffaf0, .04); bal.position.set(0, 1.58, fz+.22); g.add(bal);
  const balR = box(2.1, .06, .06, 0xfffaf0, .03); balR.position.set(0, 1.94, fz+.44); g.add(balR);
  for(let k=0;k<8;k++){ const br = cyl(.035,.045,.32,0xfffaf0,6); br.position.set(-.92+k*.264, 1.74, fz+.44); g.add(br); }
  const bdo = box(.56, .78, .1, 0xbfe6f5, .04); bdo.position.set(0, 1.94, fz+.02); g.add(bdo);
  const bdf = box(.68, .9, .05, 0xfffaf0, .03); bdf.position.set(0, 1.94, fz); g.add(bdf);
  /* --- หน้าต่างโค้งสูงชั้นล่าง/ชั้นบน --- */
  [[-1.62,.84],[1.62,.84],[-1.62,1.84],[1.62,1.84]].forEach(([px,py])=>{
    const wd = box(.56, .74, .1, 0xbfe6f5, .04); wd.position.set(px, py, fz+.02); g.add(wd);
    const wf = box(.68, .86, .05, 0xfffaf0, .03); wf.position.set(px, py, fz); g.add(wf);
    const top = cyl(.34, .34, .05, 0xfffaf0, 12); top.rotation.x = Math.PI/2; top.scale.y = .55;
    top.position.set(px, py+.46, fz); g.add(top);
  });
  [-1,1].forEach(sd=>{                                  /* หน้าต่างด้านข้าง */
    [[-.6,.84],[.7,.84],[-.6,1.86],[.7,1.86]].forEach(([pz2,py])=>{
      const sw = box(.1, .66, .48, 0xbfe6f5, .04); sw.position.set(sd*(bw/2+.01), py, pz2); g.add(sw);
    });
  });
  /* --- หอนาฬิกาบนหลังคา + ธง --- */
  const tw = box(.86, .96, .86, 0xfffaf0, .06); tw.position.set(0, bh + 1.1, -.1); g.add(tw);
  const twB = box(1.0, .12, 1.0, 0xfffaf0, .04); twB.position.set(0, bh + .62, -.1); g.add(twB);
  const clockF = cyl(.3, .3, .07, 0xfffaf0, 16); clockF.rotation.x = Math.PI/2; clockF.position.set(0, bh + 1.16, .36); g.add(clockF);
  const clockR = torus(.31, .04, 0xf0c14b, 14); clockR.position.set(0, bh + 1.16, .36); g.add(clockR);
  const hH = box(.05,.15,.03, 0x4a4a4a, .01); hH.position.set(0, bh + 1.23, .4); g.add(hH);
  const hM = box(.19,.045,.03, 0x4a4a4a, .01); hM.position.set(.08, bh + 1.16, .4); g.add(hM);
  const twR = cone(.78, .74, lot.roof, 4); twR.rotation.y = Math.PI/4; twR.position.set(0, bh + 1.94, -.1); g.add(twR);
  const fpole = cyl(.04,.04,.7, 0xf7f3ee, 6); fpole.position.set(0, bh + 2.62, -.1); g.add(fpole);
  const flag = box(.44,.28,.04, 0x6f86c9, .02); flag.position.set(.24, bh + 2.86, -.1); g.add(flag);
  const finial = sphere(.09, 0xf0c14b, 8); finial.position.set(0, bh + 2.98, -.1); g.add(finial);
  /* --- ป้ายบ้านเทศมนตรีข้างประตู --- */
  const spost = cyl(.07, .08, 1.0, 0xfffaf0, 8); spost.position.set(2.16, .5, fz + .34); g.add(spost);
  const sfr = box(.62, .58, .08, lot.roof, .05); sfr.position.set(2.16, 1.2, fz + .34); g.add(sfr);
  const sfb = box(.48, .44, .06, 0xfffaf0, .03); sfb.position.set(2.16, 1.2, fz + .39); g.add(sfb);
  const sg = signPlane(lot.icon, .34); sg.position.set(2.16, 1.2, fz + .43); g.add(sg);
  /* --- พุ่มไม้ตัดแต่งขนาบบันได --- */
  [-1,1].forEach(sd=>{
    const pot = cyl(.24, .2, .34, 0xe6dbc8, 10); pot.position.set(sd*2.24, .17, fz+.9); g.add(pot);
    const c1 = cone(.28, .58, 0x5aa06a, 10); c1.position.set(sd*2.24, .63, fz+.9); g.add(c1);
    const c2 = cone(.2, .42, 0x6fbf73, 10); c2.position.set(sd*2.24, 1.06, fz+.9); g.add(c2);
  });
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}


/* ---------- สระว่ายน้ำของโรงแรม ----------
   ลานกระเบื้องรอบสระ (เดินได้) + ผิวน้ำจมลงไปจากลาน + ขอบสระ + บันไดลงสระ + สไลเดอร์
   ผิวน้ำใช้สีฟ้าอ่อนโทนเดียวกับน้ำพุ/บ่อน้ำในแผนที่ ให้เป็นชุดเดียวกันทั้งแอป */
function buildPoolDeckFloor(w, d){
  const g = new THREE.Group();
  const floor = box(w, .12, d, 0xf3ead9, .05); floor.position.y = .06; g.add(floor);
  for(let i=0; i<w; i++) for(let k=0; k<d; k++){        /* กระเบื้องสลับสีให้เห็นเป็นลานปูกระเบื้อง */
    if((i + k) % 2) continue;
    const t = box(.9, .04, .9, 0xfffaf0, .04); t.position.set(-w/2 + .5 + i, .13, -d/2 + .5 + k); g.add(t);
  }
  return g;
}
function buildPoolWater(w, d){
  const g = new THREE.Group();
  const lip = box(w + .5, .3, d + .5, 0xfffaf0, .08); lip.position.y = .15; g.add(lip);
  const inner = box(w, .26, d, 0x9fd8ee, .06); inner.position.y = .18; g.add(inner);
  const water = box(w - .18, .1, d - .18, 0x5ec4e8, .05); water.position.y = .26; g.add(water);
  const shine = box(w - 1.6, .04, d * .16, 0x9fdcf3, .04); shine.position.set(-.2, .32, -d*.2); g.add(shine);
  const shine2 = box(w - 2.4, .04, d * .12, 0xc4ecfa, .03); shine2.position.set(.5, .32, d*.16); g.add(shine2);
  /* บันไดลงสระ (ราวโค้ง 2 อัน) ที่ขอบด้าน +z */
  [-.55, .55].forEach(px=>{
    const rail = torus(.19, .035, 0xe0e6ea, 12); rail.rotation.y = Math.PI/2;
    rail.position.set(px, .42, d/2 - .06); g.add(rail);
  });
  /* สไลเดอร์เด็กที่ปลายสระ (-z) */
  const tower = cyl(.14, .16, 1.0, 0xf7f3ee, 10); tower.position.set(w/2 - .7, .5, -d/2 - .5); g.add(tower);
  const slide = box(.52, .1, 1.5, 0xffd54f, .06);
  slide.rotation.x = .62; slide.position.set(w/2 - .7, .62, -d/2 + .16); g.add(slide);
  [-1,1].forEach(sd=>{
    const sr = box(.07, .2, 1.5, 0xff8a65, .03); sr.rotation.x = .62;
    sr.position.set(w/2 - .7 + sd*.28, .72, -d/2 + .16); g.add(sr);
  });
  const step = box(.44, .08, .3, 0xffd54f, .03); step.position.set(w/2 - .7, 1.0, -d/2 - .72); g.add(step);
  return g;
}
function buildPoolProp(kind){
  const g = new THREE.Group();
  if(kind === 'chair'){                                  /* เตียงอาบแดด */
    const frame = box(.76,.14,1.16, 0xfffaf0, .06); frame.position.y = .34; g.add(frame);
    [-1,1].forEach(sd=>[-1,1].forEach(sz=>{ const lg = box(.1,.28,.1,0xe0e6ea,.03); lg.position.set(sd*.3,.14,sz*.46); g.add(lg); }));
    const seat = box(.68,.24,.74, 0x7fc4e8, .1); seat.position.set(0,.53,.2); g.add(seat);
    const back1 = box(.68,.34,.24, 0x7fc4e8, .1); back1.position.set(0,.58,-.28); g.add(back1);
    const back2 = box(.68,.44,.22, 0x66b8e0, .1); back2.position.set(0,.68,-.48); g.add(back2);
    const pil = box(.42,.18,.16, 0xfffaf0, .07); pil.position.set(0,.94,-.5); g.add(pil);
    const tw = box(.52,.08,.44, 0xff8fb3, .04); tw.position.set(0,.67,.26); g.add(tw);
  } else if(kind === 'umbrella'){
    const pole = cyl(.05,.05,1.4, 0xfffaf0, 8); pole.position.y = .7; g.add(pole);
    const cap = cone(.66, .38, 0xff8a65, 12); cap.position.y = 1.5; g.add(cap);
    const cap2 = cone(.7, .16, 0xfffaf0, 12); cap2.position.y = 1.34; g.add(cap2);
    const tip = sphere(.07, 0xffd54f, 8); tip.position.y = 1.72; g.add(tip);
    const base = cyl(.24,.28,.14, 0xe0e6ea, 12); base.position.y = .07; g.add(base);
    const tbl = cyl(.3,.28,.06, 0xfffaf0, 12); tbl.position.y = .58; g.add(tbl);
  } else if(kind === 'ring'){                            /* ห่วงชูชีพวางพิงเสา */
    const post = cyl(.06,.06,.9, 0xfffaf0, 8); post.position.y = .45; g.add(post);
    const ring = torus(.3, .1, 0xff5252, 14); ring.position.set(0,.72,.06); g.add(ring);
    [0,1,2,3].forEach(k=>{ const st = box(.16,.11,.05,0xfffaf0,.02);
      st.rotation.z = k*Math.PI/4; st.position.set(Math.cos(k*Math.PI/2)*.3, .72+Math.sin(k*Math.PI/2)*.3, .07); g.add(st); });
  } else {                                               /* palm: ต้นไม้กระถางริมสระ */
    const pot = cyl(.28,.22,.42, 0xdc8f5a, 12); pot.position.y = .21; g.add(pot);
    const rim = cyl(.31,.29,.1, 0xe8a86b, 12); rim.position.y = .4; g.add(rim);
    const tr = cyl(.09,.12,.9, 0xa9784f, 8); tr.position.y = .85; g.add(tr);
    for(let k=0;k<6;k++){
      const lf = box(.9,.08,.28, 0x6fbf73, .06);
      lf.rotation.y = k*Math.PI/3; lf.rotation.z = -.34;
      lf.position.set(Math.cos(k*Math.PI/3)*.42, 1.34, Math.sin(k*Math.PI/3)*.42); g.add(lf);
    }
    const co = sphere(.1, 0x8d6e63, 8); co.position.set(.1, 1.24, .1); g.add(co);
  }
  return g;
}


/* น้ำพุกลางลานชุมชน (จุดนัดพบ — เฟสถัดไปให้ NPC เดินมารวมกันตรงนี้ได้) */
function buildFountain(){
  const g = new THREE.Group();
  /* เฉพาะส่วนหิน — ถูก merge รวมกับฉากตายตัว (ส่วนน้ำที่ขยับได้อยู่ใน buildFountainFx) */
  const basin = cyl(1.15, 1.3, .44, 0xe8dcc8, 20); basin.position.y = .22; g.add(basin);
  const col = cyl(.16, .2, .8, 0xe8dcc8, 12); col.position.y = .85; g.add(col);
  const top = cyl(.52, .1, .16, 0xdcd0bb, 16); top.position.y = 1.3; g.add(top);
  g.position.set(fountainCX(), 0, fountainCZ());
  return g;
}
function fountainCX(){ return outWX((FOUNTAIN.x0+FOUNTAIN.x1)/2); }
function fountainCZ(){ return outWZ((FOUNTAIN.z0+FOUNTAIN.z1)/2); }

/* ============================================================
   ผีเสื้อตอมดอกไม้ (บินได้จริง) + ของตกแต่งไหวตามลม
   ของในทุ่งดอกไม้ถูก merge เป็นก้อนเดียวเพื่อลด draw call → ขยับไม่ได้
   ผีเสื้อจึงแยกออกมาเป็น "ฝูงเล็กๆ ที่วนใช้ซ้ำ" ลอยอยู่เฉพาะรอบตัวเด็ก
   (ไกลออกไปไม่ต้องมี เพราะมองไม่เห็นอยู่แล้ว) จำนวนคงที่ ไม่สร้าง/ทิ้งทุกเฟรม
   ============================================================ */
const BUTTERFLY_MAX = 5;
const BUTTERFLY_PALETTE = [                     /* [ปีกบน, ปีกล่าง] โทนพาสเทลให้เข้ากับธีมเด็ก */
  [0xffb3c9, 0xfff0f5], [0xffd54f, 0xffecb3], [0x9ad7ff, 0xe3f6ff],
  [0xc9a7ff, 0xf0e6ff], [0xff9e7a, 0xffe0d1], [0xa5e8b0, 0xe8f8ea],
];
let butterflies = [];
let bflySpots = null;        /* อาเรย์ช่องดอกไม้ (สแนปช็อตจาก flowerSet ครั้งเดียว) */
let bflyRetargetT = 0;

function buildButterfly(pal){
  const g = new THREE.Group();
  /* ลำตัว+หัว+หนวด สีเดียวกันหมด → merge เหลือ mesh เดียว (ผีเสื้อ 1 ตัวใช้แค่ 5 draw call) */
  const bodyG = new THREE.Group();
  const body = cyl(.022, .032, .22, 0x5d4037, 6);
  body.rotation.x = Math.PI/2; body.position.y = .02; bodyG.add(body);
  const head = sphere(.045, 0x5d4037, 6); head.position.set(0, .035, .12); bodyG.add(head);
  [-1, 1].forEach(sd=>{
    const a2 = cyl(.008, .008, .13, 0x5d4037, 4);
    a2.position.set(.03*sd, .11, .17); a2.rotation.set(-.5, 0, -.35*sd); bodyG.add(a2);
    const tip = sphere(.02, 0x5d4037, 5); tip.position.set(.058*sd, .17, .21); bodyG.add(tip);
  });
  mergeDecorGroup(bodyG); g.add(bodyG);

  const wings = [-1, 1].map(sd=>{
    const wg = new THREE.Group();
    const fore = sphere(.16, pal[0], 6);           /* ปีกคู่หน้า ใหญ่กว่า เอียงไปข้างหน้า */
    fore.scale.set(1.1, .085, .8); fore.position.set(.16*sd, .03, .06); wg.add(fore);
    const hind = sphere(.105, pal[1], 6);          /* ปีกคู่หลัง สีอ่อนกว่า */
    hind.scale.set(1, .085, .82); hind.position.set(.115*sd, .012, -.1); wg.add(hind);
    const dot = sphere(.038, pal[1], 5);           /* จุดบนปีก (สีเดียวกับปีกหลัง → merge รวมได้) */
    dot.scale.set(1, .3, 1); dot.position.set(.2*sd, .06, .08); wg.add(dot);
    mergeDecorGroup(wg);
    const piv = new THREE.Group(); piv.add(wg); piv.userData.side = sd; g.add(piv);
    return piv;
  });
  g.userData.wings = wings;
  g.scale.setScalar(.8);      /* ตัวเล็กๆ พอให้รู้ว่าเป็นผีเสื้อ ไม่ใหญ่จนแย่งสายตาไปจากตัวละคร */
  return g;
}

/* จุดให้ผีเสื้อไปตอม — เอาเฉพาะ "ทุ่งดอกไม้" 2 ผืนใหญ่เท่านั้น
   (flowerSet รวมดอกไม้ริมถนน/รอบลานทั่วเมืองด้วย ถ้าเอาหมดผีเสื้อจะบินพล่านทั้งแผนที่) */
function inField(x, z, b){ return x>=b.x0 && x<=b.x1 && z>=b.z0 && z<=b.z1; }
function butterflySpots(){
  if(!bflySpots) bflySpots = Array.from(flowerSet)
    .map(k=>{ const p = k.split(','); return {x:+p[0], z:+p[1]}; })
    .filter(s2 => inField(s2.x, s2.z, FLOWER_FIELD) || inField(s2.x, s2.z, FLOWER_MEADOW));
  return bflySpots;
}
/* สุ่มดอกไม้ที่อยู่ในระยะรอบตัวเด็ก (สุ่มไม่กี่ครั้ง ไม่ไล่ทั้งอาเรย์ทุกครั้ง) */
function pickFlowerNear(cx, cz, rad){
  const arr = butterflySpots();
  if(!arr.length) return null;
  for(let i=0; i<24; i++){
    const s = arr[(Math.random()*arr.length)|0];
    const wx = outWX(s.x), wz = outWZ(s.z);
    if(Math.hypot(wx-cx, wz-cz) < rad) return {x:wx, z:wz};
  }
  return null;
}
function initButterflies(){
  butterflies = [];
  for(let i=0; i<BUTTERFLY_MAX; i++){
    const g = buildButterfly(BUTTERFLY_PALETTE[i % BUTTERFLY_PALETTE.length]);
    g.visible = false;
    worldGroup.add(g);
    butterflies.push({g, home:null, next:null, blend:1, ph:Math.random()*6.28, rest:0,
                      sp:.85 + Math.random()*.5, hold:Math.random()*4, px:0, pz:0});
  }
}
function updateButterflies(dt, t){
  if(hScene !== 'out' || !butterflies.length || !charGroup) return;
  const cx = charGroup.position.x, cz = charGroup.position.z, s = t*.001;

  /* ทุก ~1.2 วิ: หาบ้านใหม่ให้ตัวที่ยังไม่มี/ที่เด็กเดินหนีไปไกลแล้ว */
  bflyRetargetT -= dt;
  const scan = bflyRetargetT <= 0;
  if(scan) bflyRetargetT = 1.2;

  for(let i=0; i<butterflies.length; i++){
    const b = butterflies[i], g = b.g;
    if(scan && (!b.home || Math.hypot(b.home.x-cx, b.home.z-cz) > 17)){
      const spot = pickFlowerNear(cx, cz, 13);
      if(!spot){ if(g.visible) g.visible = false; b.home = null; continue; }
      b.home = spot; b.next = null; b.blend = 1;
      g.position.set(spot.x, .8, spot.z);
      b.px = spot.x; b.pz = spot.z;
      g.visible = true;
    }
    if(!b.home) continue;

    /* อยู่ตอมดอกเดิมสักพักแล้วค่อยย้ายไปดอกข้างๆ (ค่อยๆ ลอยไป ไม่วาร์ป) */
    b.hold -= dt;
    if(b.rest > 0) b.rest -= dt;
    if(b.hold <= 0 && !b.next){
      const spot = pickFlowerNear(cx, cz, 12);
      if(spot){ b.next = spot; b.blend = 0; b.rest = 0; }
      b.hold = 3.5 + Math.random()*4;
      if(Math.random() < .45) b.rest = 2 + Math.random()*2.5;   /* บางครั้งลงเกาะดอกไม้นิ่งๆ ก่อนบินต่อ */
    }
    let hx = b.home.x, hz = b.home.z;
    if(b.next){
      b.blend = Math.min(1, b.blend + dt*.42);            /* ~2.4 วิ ต่อการย้าย 1 ครั้ง */
      const k = b.blend*b.blend*(3-2*b.blend);            /* ease in-out ให้ออกตัว/ลงจอดนุ่ม */
      hx += (b.next.x - hx)*k; hz += (b.next.z - hz)*k;
      if(b.blend >= 1){ b.home = b.next; b.next = null; }
    }
    /* วนรอบดอกไม้เป็นวงรีเล็กๆ + ย่อ-ยกตัวตามจังหวะกระพือปีก */
    const w = s*b.sp, resting = b.rest > 0 && !b.next;
    const orb = resting ? .06 : .5;                    /* ตอนเกาะดอก แทบไม่ขยับ */
    g.position.x = hx + Math.sin(w*1.05 + b.ph)*orb;
    g.position.z = hz + Math.cos(w*.78 + b.ph*1.4)*orb*.9;
    const yTgt = resting ? .34 : (.72 + Math.sin(w*2.3 + b.ph)*.14 + (b.next ? .12 : 0));
    g.position.y += (yTgt - g.position.y) * Math.min(1, dt*3.2);   /* ร่อนลง/บินขึ้นนุ่มๆ */

    /* หันหัวไปทางที่บิน (คำนวณจากตำแหน่งเฟรมก่อน) */
    const dx = g.position.x - b.px, dz = g.position.z - b.pz;
    if(dx*dx + dz*dz > 1e-6){
      let want = Math.atan2(dx, dz), cur = g.rotation.y;
      while(want - cur > Math.PI) want -= Math.PI*2;
      while(want - cur < -Math.PI) want += Math.PI*2;
      g.rotation.y = cur + (want-cur)*Math.min(1, dt*7);
    }
    b.px = g.position.x; b.pz = g.position.z;
    /* กระพือปีก: เร็วตอนย้ายดอก ช้าลงตอนตอมอยู่กับที่ */
    /* ตอนเกาะดอก: กางปีกเข้า-ออกช้าๆ (ไม่กระพือรัว) เหมือนผีเสื้อจริงตอนพัก */
    const flap = Math.sin(s*(resting ? 1.6 : (b.next ? 21 : 15)) + b.ph);
    const amp = resting ? .55 : (b.next ? 1.1 : .8);
    g.userData.wings[0].rotation.z =  flap*amp;
    g.userData.wings[1].rotation.z = -flap*amp;
    g.rotation.z = flap*.06;                              /* ตัวโคลงตามแรงปีกนิดๆ */
  }
}

/* ---------- ของตกแต่งไหวตามลม ----------
   ต้นไม้/พุ่มที่เด็กปลูกเอง และลูกโป่ง เป็น group เดี่ยว (ไม่ได้ merge รวมฉาก) จึงขยับได้
   ไล่รายชื่อใหม่ทุก ~1 วิ เอาเฉพาะชิ้นที่อยู่ใกล้ตัวเด็ก แล้วค่อยขยับทีละเฟรม */
let windList = [], windScanT = 0;
function updateDecorWind(t, dt){
  if(hScene !== 'out' || !charGroup) return;
  windScanT -= dt;
  if(windScanT <= 0){
    windScanT = 1;
    windList = [];
    const cx = charGroup.position.x, cz = charGroup.position.z;
    for(let i=0; i<decorGroups.out.length; i++){
      const g = decorGroups.out[i], d = g.userData.deco;
      if(!d || (!d.item.leafy && d.item.id !== 'balloon')) continue;
      if(Math.hypot(g.position.x-cx, g.position.z-cz) > 20) continue;
      if(g.userData.windPh == null){
        g.userData.windPh = (g.position.x*1.7 + g.position.z*2.3) % 6.28;   /* เฟสคงที่ต่อชิ้น ไม่ไหวพร้อมกันทั้งสวน */
        g.userData.windBaseY = g.position.y;
        g.userData.windBalloon = d.item.id === 'balloon';
      }
      windList.push(g);
    }
  }
  const s = t*.001;
  for(let i=0; i<windList.length; i++){
    const g = windList[i], ph = g.userData.windPh;
    if(g.userData.windBalloon){                       /* ลูกโป่ง: ลอยขึ้นลง + เอียงตามลม */
      g.position.y = g.userData.windBaseY + .09 + Math.sin(s*1.25 + ph)*.09;
      g.rotation.z = Math.sin(s*.9 + ph)*.1;
      g.rotation.x = Math.cos(s*.75 + ph)*.07;
    }else{                                            /* ต้นไม้/พุ่ม: เอนไหวเบาๆ */
      g.rotation.z = Math.sin(s*.8 + ph)*.028;
      g.rotation.x = Math.sin(s*.62 + ph*1.3)*.02;
    }
  }
}

/* ---------- น้ำของน้ำพุ (ส่วนที่ขยับ) ----------
   แยกออกจากก้อน merge เพราะ geometry ที่รวมแล้วขยับทีละชิ้นไม่ได้
   ทุกชิ้นเป็น object เล็กๆ ที่ "วนใช้ซ้ำ" ไม่ได้สร้าง/ทิ้งทุกเฟรม (กัน GC บนแท็บเล็ต)
   และทั้งกลุ่มถูกซ่อนเมื่อเด็กเดินออกไปไกล จึงไม่กิน draw call ตอนไม่ได้มอง */
const FOUNTAIN_JETS = 14;
function buildFountainFx(){
  const g = new THREE.Group();
  const u = { jets: [], ripples: [] };

  const water = cyl(1.02, 1.02, .12, 0x6cc6e8, 20); water.position.y = .46; g.add(water);
  u.water = water;

  /* ระลอกคลื่นบนผิวน้ำ: วงแหวนบางๆ ขยายออกแล้วจางหาย */
  u.ripples = [0, 1, 2].map(i=>{
    const m = new THREE.Mesh(new THREE.RingGeometry(.3, .38, 26),
      new THREE.MeshBasicMaterial({color: 0xdff5ff, transparent: true, opacity: .5, depthWrite: false}));
    m.rotation.x = -Math.PI/2; m.position.y = .53; m.userData.ph = i/3; g.add(m);
    return m;
  });

  /* สายน้ำที่พุ่งขึ้นจากยอดเสาแล้วโค้งตกลงอ่าง — ลูกกลมเล็กกระจายเป็นวง */
  for(let i=0; i<FOUNTAIN_JETS; i++){
    const d = sphere(.075, 0x9adcf2, 7);
    d.userData.a = (i/FOUNTAIN_JETS) * Math.PI*2;     /* ทิศที่พุ่งออก */
    d.userData.ph = i/FOUNTAIN_JETS;                  /* เหลื่อมจังหวะกัน ไม่ตกพร้อมกันเป็นพรืด */
    g.add(d); u.jets.push(d);
  }
  /* ลำน้ำที่พุ่งขึ้นจากยอดเสา — ทำให้เห็นเป็น "น้ำพุ" ตั้งแต่แวบแรก ไม่ใช่แค่ลูกกลมลอยๆ */
  const jet = cyl(.055, .1, .58, 0x9adcf2, 10); jet.position.y = 1.78; g.add(jet); u.jet = jet;
  /* หยดน้ำใหญ่บนยอด (เต้นขึ้นลงเบาๆ) */
  const top = sphere(.16, 0x9adcf2, 10); top.position.y = 1.52; g.add(top); u.top = top;

  g.position.set(fountainCX(), 0, fountainCZ());
  g.userData.fx = u;
  return g;
}

/* t = มิลลิวินาทีจาก frame() */
function updateFountainFx(t, dt){
  if(!fountainFx) return;
  /* ไกลเกินไปก็ไม่ต้องวาด — ประหยัดทั้ง draw call และงานคำนวณ */
  const near = charGroup
    ? Math.hypot(charGroup.position.x - fountainFx.position.x, charGroup.position.z - fountainFx.position.z) < 22
    : true;
  if(fountainFx.visible !== near) fountainFx.visible = near;
  if(!near) return;

  const u = fountainFx.userData.fx, s = t * .001;
  u.water.position.y = .46 + Math.sin(s*1.5)*.012;             /* ผิวน้ำกระเพื่อมเบาๆ */
  u.top.position.y = 1.52 + Math.sin(s*2.2)*.05;
  const ts = 1 + Math.sin(s*2.2)*.08; u.top.scale.set(ts, 1/ts, ts);   /* หยดน้ำยืด-หดเหมือนน้ำจริง */
  const js = 1 + Math.sin(s*3.1)*.12; u.jet.scale.set(1/js, js, 1/js);  /* ลำน้ำเต้นขึ้นลงตามแรงดัน */
  u.jet.position.y = 1.78 + Math.sin(s*3.1)*.05;

  for(let i=0; i<u.jets.length; i++){
    /* พุ่งขึ้นจากยอดเสาแล้วโค้งตกลงอ่างเป็นวิถีโพรเจกไทล์ (y = 1.6 + 2k - 3.05k² → สูงสุด ~1.93 ตกที่ผิวน้ำ .55)
       ต้องเริ่มเหนือถ้วยบนสุด ไม่งั้นสายน้ำจะวิ่งอยู่ใต้ถ้วยแล้วโดนบัง มองไม่เห็น */
    const d = u.jets[i], k = (s*.5 + d.userData.ph) % 1;
    const r = .04 + k*.86;
    d.position.set(Math.cos(d.userData.a)*r, 1.6 + 2.3*k - 3.4*k*k, Math.sin(d.userData.a)*r);
    const sc = 1 - k*.35; d.scale.setScalar(sc);
  }
  for(let i=0; i<u.ripples.length; i++){
    const m = u.ripples[i], k = (s*.5 + m.userData.ph) % 1;
    const sc = .55 + k*1.5; m.scale.set(sc, sc, 1);
    m.material.opacity = (1-k) * .45;
  }
}

/* ดอกไม้เล็กๆ (ไม่บล็อกทางเดิน) — วางเฉพาะช่องเดินได้ที่ไม่ใช่ถนน/ลาน/ล็อต */
function flowerTiles(){
  return FLOWERS.filter(([x,z]) => x>=0 && z>=0 && x<OUT_W && z<OUT_D &&
    outGrid[z][x]===0 && !isVillageRoadTile(x,z) && !isPlazaTile(x,z) && !lotAt(x,z,1));
}

/* ---------- แปลงดอกไม้หน้าลานกิจกรรม ----------
   กระบะไม้เตี้ยๆ + ดินนูน + ดอกไม้กลีบมนหลากสี (ทรงเดียวกับดอกไม้เล็กในทุ่ง แต่จัดเป็นแปลงให้ดูเป็นสวน)
   สุ่มตำแหน่ง/สีดอกด้วยเลขสุ่มของตัวเอง (ไม่ใช้ rnd ของ wildLayout) แปลงเดิมจะได้หน้าตาเหมือนเดิมทุกครั้ง */
const BED_PETAL_COLORS = [0xff8fb3, 0xffd54f, 0xb388ff, 0xff8a65, 0x9be7ff, 0xfff0f5];
function buildFlowerBed(b, seed){
  const g = new THREE.Group();
  const w = b.x1 - b.x0 + 1, d = b.z1 - b.z0 + 1;
  let st = seed*7919 + 13;
  const rnd = () => (st = (st*1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const frame = box(w-.12, .26, d-.12, 0xe0b487, .07); frame.position.y = .13; g.add(frame);   /* กระบะไม้ */
  const soil  = box(w-.5, .3, d-.5, 0x8d6e63, .06);   soil.position.y = .15;  g.add(soil);     /* ดินนูนขึ้นมาเล็กน้อย */
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{                                          /* ลูกกลมมุมกระบะ */
    const knob = sphere(.085, 0xfff3d6, 8);
    knob.position.set(sx*(w/2-.14), .28, sz*(d/2-.14));
    g.add(knob);
  });
  const n = Math.round(w*d*3);
  for(let k=0; k<n; k++){
    const fx = (rnd()-.5)*(w-.78), fz = (rnd()-.5)*(d-.78);
    const h = .24 + rnd()*.16, top = .3 + h;
    const stem = cyl(.028,.032,h, 0x66bb6a, 5); stem.position.set(fx, .3+h/2, fz); g.add(stem);
    const leaf = sphere(.075, 0x81c784, 6); leaf.scale.set(1,.34,.6);
    leaf.position.set(fx + (k%2 ? .085 : -.085), .3+h*.45, fz); g.add(leaf);
    const c = BED_PETAL_COLORS[(seed*2 + k) % BED_PETAL_COLORS.length];
    for(let p=0; p<5; p++){
      const pt = sphere(.075, c, 6); pt.scale.set(1,.5,1);
      pt.position.set(fx + Math.cos(p*Math.PI*2/5)*.085, top, fz + Math.sin(p*Math.PI*2/5)*.085);
      g.add(pt);
    }
    const core = sphere(.05, 0xfff176, 6); core.position.set(fx, top+.035, fz); g.add(core);
  }
  for(let k=0; k<Math.round(w*d); k++){                                                        /* พุ่มหญ้าเตี้ยแทรกช่องว่าง */
    const tuft = sphere(.16, 0x8fd06c, 7); tuft.scale.set(1,.5,1);
    tuft.position.set((rnd()-.5)*(w-.7), .32, (rnd()-.5)*(d-.7)); g.add(tuft);
  }
  g.position.set(outWX((b.x0+b.x1)/2), 0, outWZ((b.z0+b.z1)/2));
  return g;
}


/* ---------- ทุ่งดอกไม้ใหญ่: ดอกไม้ต่อช่อง / ทางเดินกลางทุ่ง / ซุ้มดอกไม้ / ป้ายทุ่ง ----------
   สุ่มด้วยเลขจากพิกัดช่อง (x,z) ทุ่งจึงหน้าตาเหมือนเดิมทุกครั้งที่เข้าเกม */
function fieldRnd(x, z){
  let st = ((x*73856093) ^ (z*19349663)) & 0x7fffffff;
  return () => (st = (st*1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
}
function buildFieldFlowers(x, z, opt){
  const g = new THREE.Group();
  const o = opt || {};
  const rnd = fieldRnd(x, z);
  const row = FIELD_ROW_COLORS[((o.band == null ? z - FLOWER_FIELD.z0 : o.band) + 8) % FIELD_ROW_COLORS.length];
  const n = (o.base == null ? 6 : o.base) + ((x + z) % 3);   /* 6-8 ดอกต่อช่อง แน่นพอให้เห็นเป็นทุ่ง แต่ไม่หนักเครื่อง */
  for(let k=0; k<n; k++){
    const fx = (rnd()-.5)*.82, fz = (rnd()-.5)*.82;
    const h = .24 + rnd()*.18, top = h + .02;
    const stem = cyl(.022,.026,h, 0x66bb6a, 5); stem.position.set(fx, h/2, fz); g.add(stem);
    const leaf = sphere(.062, 0x81c784, 4); leaf.scale.set(1,.35,.6);
    leaf.position.set(fx + (k%2 ? .075 : -.075), h*.45, fz); g.add(leaf);
    const c = row[k % row.length];
    for(let p=0; p<5; p++){
      const pt = sphere(.072, c, 4); pt.scale.set(1,.5,1);
      pt.position.set(fx + Math.cos(p*Math.PI*2/5)*.082, top, fz + Math.sin(p*Math.PI*2/5)*.082); g.add(pt);
    }
    const core = sphere(.044, 0xfff176, 4); core.position.set(fx, top+.03, fz); g.add(core);
  }
  const tuft = sphere(.17, 0x8fd06c, 5); tuft.scale.set(1,.45,1);
  tuft.position.set((rnd()-.5)*.7, .04, (rnd()-.5)*.7); g.add(tuft);
  /* ผีเสื้อไม่ได้อยู่ในก้อนนี้แล้ว — ย้ายไปเป็นตัวที่บินได้จริง (ดู BUTTERFLIES ท้ายไฟล์)
     ของที่ merge แล้วขยับไม่ได้ ผีเสื้อเดิมจึงเป็นแค่ปีกแข็งค้างกลางอากาศ */
  return g;
}
function buildFieldPath(x, z){                      /* ทางเดินดินกลางทุ่ง + ก้อนหินเล็กๆ ข้างทาง */
  const g = new THREE.Group();
  const rnd = fieldRnd(x, z);
  const road = box(1.02,.07,.84, 0xe8d3a9,.06); road.position.y = .035; g.add(road);
  for(let k=0; k<3; k++){
    const st = cyl(.13,.15,.06, 0xf5ead2, 7);
    st.position.set((rnd()-.5)*.8, .075, (rnd()-.5)*.6); g.add(st);
  }
  [-1,1].forEach(sgn=>{                             /* หญ้าริมทาง */
    const tf = sphere(.15, 0x8fd06c, 7); tf.scale.set(1,.42,1);
    tf.position.set((rnd()-.5)*.7, .04, sgn*.46); g.add(tf);
  });
  return g;
}
/* ---------- ซุ้มทางเดินเข้าลานน้ำพุ ----------
   ซุ้มไม้เลื้อยคร่อมทางเดินกว้าง 2 ช่อง เรียงเป็นซี่ๆ ตลอดความยาวทาง (ของตกแต่งล้วน ไม่บล็อกช่อง)
   1 ชิ้น = 1 ซี่: เสา 2 ต้นคร่อมทาง (ยืนบนเส้นแบ่งช่อง ±1) + คานบน + ค้ำมุม + ใบไม้/ดอกไม้เลื้อย
   ซี่ที่หมุนตามแกน z ใช้ rotation.y = 90° ตอนวาง (ดูใน buildStaticScenery) */
function buildArchRib(seed){
  const g = new THREE.Group();
  const SP = 1;                                    /* ครึ่งความกว้างทาง 2 ช่อง = 1 ช่อง */
  [-1,1].forEach(sgn=>{
    const post = cyl(.09,.1,1.94, 0xfff6e8, 8); post.position.set(0,.97,sgn*SP); g.add(post);
    const base = cyl(.17,.19,.14, 0xe0b487, 8); base.position.set(0,.07,sgn*SP); g.add(base);
    const br = box(.1,.1,.42, 0xfff6e8,.04);       /* ค้ำมุมซุ้ม */
    br.rotation.x = sgn*.8; br.position.set(0,1.78,sgn*(SP-.2)); g.add(br);
    for(let k=0; k<3; k++){                        /* เถาเลื้อยพันเสา */
      const lf = sphere(.11, 0x8fd06c, 6); lf.scale.set(.85,.55,.85);
      lf.position.set((k%2 ? .1 : -.1), .58+k*.42, sgn*SP); g.add(lf);
    }
  });
  const beam = box(.18,.16,2.34, 0xfff6e8,.06); beam.position.y = 2.02; g.add(beam);
  const beam2 = box(.12,.11,2.06, 0xfff6e8,.05); beam2.position.y = 1.84; g.add(beam2);
  for(let k=0; k<11; k++){                         /* ใบไม้/ดอกไม้เลื้อยบนคาน */
    const az = -1.05 + (k/10)*2.1;
    const lf = sphere(.12, 0x8fd06c, 6); lf.scale.set(.9,.6,.9);
    lf.position.set(k%2 ? .09 : -.09, 2.11, az); g.add(lf);
    if(((k + seed) % 2) === 0){
      const c = [0xff8fb3,0xfff0f5,0xffd54f,0xb388ff][(k + seed) % 4];
      for(let p=0; p<5; p++){
        const pt = sphere(.058, c, 6); pt.scale.set(1,.6,1);
        pt.position.set(Math.cos(p*Math.PI*2/5)*.055, 2.2, az + Math.sin(p*Math.PI*2/5)*.055); g.add(pt);
      }
      const cr = sphere(.035, 0xfff176, 6); cr.position.set(0, 2.23, az); g.add(cr);
    }
  }
  return g;
}

function buildFlowerArch(){                         /* ซุ้มดอกไม้คร่อมทางเดินหัว-ท้ายทุ่ง */
  const g = new THREE.Group();
  [-1,1].forEach(sgn=>{
    const post = cyl(.085,.095,1.72, 0xfff6e8, 8); post.position.set(0,.86,sgn*.5); g.add(post);
    const base = cyl(.15,.17,.13, 0xe0b487, 8); base.position.set(0,.065,sgn*.5); g.add(base);
    for(let k=0; k<3; k++){                         /* เถาเลื้อยพันเสา */
      const lf = sphere(.1, 0x8fd06c, 6); lf.scale.set(.85,.55,.85);
      lf.position.set((k%2 ? .09 : -.09), .55+k*.38, sgn*.5); g.add(lf);
    }
  });
  const beam = box(.17,.16,1.26, 0xfff6e8,.06); beam.position.y = 1.76; g.add(beam);
  const beam2 = box(.11,.11,1.02, 0xfff6e8,.05); beam2.position.y = 1.58; g.add(beam2);
  [-1,1].forEach(sgn=>{                             /* ค้ำมุมซุ้ม */
    const br = box(.1,.1,.34, 0xfff6e8,.04); br.rotation.x = sgn*.78; br.position.set(0,1.62,sgn*.44); g.add(br);
  });
  for(let k=0; k<13; k++){                          /* ดอกไม้เลื้อยบนคานซุ้ม */
    const zz = -.58 + (k/12)*1.16;
    const lf = sphere(.11, 0x8fd06c, 6); lf.scale.set(.9,.6,.9);
    lf.position.set(k%2 ? .07 : -.07, 1.8, zz); g.add(lf);
    if(k % 2 === 0){
      const c = [0xff8fb3,0xfff0f5,0xffd54f][k%3], ax = (k%4<2) ? .12 : -.12;
      for(let p=0; p<5; p++){
        const pt = sphere(.045, c, 6); pt.scale.set(1,.6,1);
        pt.position.set(ax, 1.9 + Math.cos(p*Math.PI*2/5)*.055, zz + Math.sin(p*Math.PI*2/5)*.055); g.add(pt);
      }
      const cr = sphere(.028, 0xfff176, 6); cr.position.set(ax + (ax>0?.03:-.03), 1.9, zz); g.add(cr);
    }
  }
  return g;
}
function buildFieldSign(){                          /* ป้ายไม้ 🌷 บอกว่านี่คือทุ่งดอกไม้ */
  const g = new THREE.Group();
  const post = cyl(.07,.07,1.02, 0xc98d4e, 8); post.position.y = .51; g.add(post);
  const fr = box(.88,.6,.06, 0xe8759b,.04); fr.position.set(0,1.14,0); g.add(fr);
  const bd = box(.74,.46,.06, 0xfff6e8,.04); bd.position.set(0,1.14,.04); g.add(bd);
  const ic = signPlane('🌷', .38); ic.position.set(0,1.14,.09); g.add(ic);
  return g;
}

/* ---------- ฉากใหม่: แปลงผักในฟาร์ม / หุ่นไล่กา / มะพร้าว-ร่มชายหาด / ใบบัวในบ่อ ---------- */
function buildCrop(kind){
  const g = new THREE.Group();
  if(kind==='corn'){                       /* ข้าวโพด: ต้นสูง ใบสองข้าง มีฝักเหลือง */
    const st = cyl(.05,.06,.88,0x66a15c,6); st.position.y = .44; g.add(st);
    [0,1,2].forEach(k=>{
      const lf = box(.46,.06,.13,0x7cc25a,.03);
      lf.position.set(k%2 ? .19 : -.19, .34+k*.19, 0); lf.rotation.z = (k%2 ? -1 : 1)*.5; g.add(lf);
    });
    const ear = cyl(.08,.06,.26,0xffd54f,8); ear.position.set(.12,.64,.02); ear.rotation.z = -.3; g.add(ear);
  }else if(kind==='tomato'){               /* มะเขือเทศ: พุ่มกลมมีลูกแดง */
    const st = cyl(.045,.05,.42,0x66a15c,6); st.position.y = .21; g.add(st);
    const bu = sphere(.25,0x6fbf73,10); bu.position.y = .46; bu.scale.set(1,.78,1); g.add(bu);
    [[-.15,.42,.11],[.17,.5,-.08],[.02,.58,.15]].forEach(p=>{
      const to = sphere(.085,0xe4574a,8); to.position.set(p[0],p[1],p[2]); g.add(to);
    });
  }else{                                   /* กะหล่ำ: หัวกลมเตี้ยๆ */
    const b = sphere(.26,0x8fd06c,10); b.position.y = .18; b.scale.set(1,.66,1); g.add(b);
    const c = sphere(.16,0xa8dd82,8); c.position.y = .28; g.add(c);
  }
  return g;
}
function buildScarecrow(){
  const g = new THREE.Group();
  const pole = cyl(.05,.05,1.25,0xa9784f,6); pole.position.y = .62; g.add(pole);
  const arm = box(.92,.08,.08,0xa9784f,.03); arm.position.y = .96; g.add(arm);
  const body = box(.44,.5,.28,0xf5b342,.07); body.position.y = .82; g.add(body);
  const head = sphere(.2,0xf6e3cc,10); head.position.y = 1.26; g.add(head);
  const brim = cyl(.34,.34,.05,0xd8a24a,14); brim.position.y = 1.38; g.add(brim);
  const hat = cyl(.08,.26,.2,0xd8a24a,12); hat.position.y = 1.48; g.add(hat);
  [-1,1].forEach(s=>{ const e = sphere(.032,0x4a3b32,6); e.position.set(s*.07,1.29,.18); g.add(e); });
  const mo = box(.12,.03,.04,0x4a3b32,.01); mo.position.set(0,1.19,.19); g.add(mo);
  return g;
}
function buildPalm(){
  const g = new THREE.Group();
  const h = 2.1;
  const tr = cyl(.13,.21,h,0xcf9f68,8); tr.position.set(.06,h/2,0); tr.rotation.z = .1;
  tr.castShadow = hShadows; g.add(tr);
  for(let i=0;i<6;i++){
    const a = i/6*Math.PI*2;
    const lf = box(1.2,.09,.4,0x5cb85c,.05);
    lf.position.set(.12 + Math.cos(a)*.6, h+.02, Math.sin(a)*.6);
    lf.rotation.y = -a; lf.rotation.z = -.28; g.add(lf);
  }
  [[.2,h-.14,.12],[0,h-.2,-.1]].forEach(p=>{
    const co = sphere(.1,0x8d6e63,8); co.position.set(p[0],p[1],p[2]); g.add(co);
  });
  return g;
}
/* เก้าอี้ผ้าใบชายหาด — นั่งได้จริง (ดู SEAT_ITEMS/seatSpots) หันหน้าไปทาง +z ตอน rot 0 */
function buildDeckChair(alt){
  const g = new THREE.Group();
  const frame = 0xc98d4e, cloth = alt ? 0x7fc4e8 : 0xef8354;
  [-1,1].forEach(s=>{
    const legB = box(.08,.52,.08,frame,.03); legB.position.set(s*.32,.26,-.2); g.add(legB);
    const legF = box(.08,.44,.08,frame,.03); legF.position.set(s*.32,.22,.26); g.add(legF);
    const rail = box(.07,.07,.6,frame,.03);  rail.position.set(s*.32,.46,.04); g.add(rail);
    const bp = box(.07,.66,.07,frame,.03);   bp.position.set(s*.32,.76,-.32); bp.rotation.x = -.42; g.add(bp);
  });
  const seat = box(.58,.07,.6,cloth,.04); seat.position.set(0,.48,.04); seat.rotation.x = .08; g.add(seat);
  const back = box(.58,.6,.07,cloth,.04);  back.position.set(0,.78,-.31); back.rotation.x = -.42; g.add(back);
  [-.18,.18].forEach(px=>{                                   /* ลายทางบนผ้าใบ */
    const st = box(.14,.02,.58,0xfffaf0,.02); st.position.set(px,.52,.04); st.rotation.x = .08; g.add(st);
    const sb = box(.14,.58,.02,0xfffaf0,.02); sb.position.set(px,.78,-.27); sb.rotation.x = -.42; g.add(sb);
  });
  return g;
}
function buildBeachUmbrella(){
  const g = new THREE.Group();
  const pole = cyl(.04,.04,1.15,0xf7f3ee,6); pole.position.y = .57; g.add(pole);
  const canopy = cyl(.06,.78,.34,0xef6a58,14); canopy.position.y = 1.16; g.add(canopy);
  const inner = cyl(.05,.5,.2,0xfff3e0,14); inner.position.y = 1.06; g.add(inner);
  const knob = sphere(.07,0xffd54f,8); knob.position.y = 1.36; g.add(knob);
  return g;
}
function buildLilyPad(withFlower){
  const g = new THREE.Group();
  const pad = cyl(.36,.36,.05,0x5aa06a,14); pad.position.y = -.14; g.add(pad);
  if(withFlower){
    const f = sphere(.11,0xf8a8c0,8); f.position.set(.04,-.06,.04); g.add(f);
    const c = sphere(.05,0xfff6c9,6); c.position.set(.04,-.01,.04); g.add(c);
  }
  return g;
}
const SCARECROW_TILES = s2List([[18,2],[21,6],[18,12]]);        /* ข้างแปลง ไม่ทับแปลงผัก/ทางเดิน/รอบอาคารฟาร์ม */
/* ชุดร่ม + เก้าอี้ผ้าใบริมหาด: ร่ม 1 คัน ขนาบด้วยเก้าอี้ผ้าใบข้างละตัว (นั่งได้จริง หันหน้าออกทะเล)
   [x, ห่างจากขอบน้ำกี่ช่อง] — เลี่ยงช่องที่มีต้นมะพร้าวอยู่แล้ว (PALM_SPOTS) */
const UMBRELLA_SPOTS = [[33,2],[40,2],[47,2],[54,2],[63,2],[37,3],[58,3]];
const BEACH_CHAIRS = [[32,2],[34,2],[41,2],[46,2],[48,2],[53,2],[55,2],[62,2],[64,2],
                      [36,3],[38,3],[57,3],[59,3]];
const POND_PADS = s2List([[3,4],[6,3],[2,9],[7,10],[5,12],[8,6],[4,7]]);
/* ของประดับชายหาด: z คิดจากแนวชายฝั่งจริง (ชายฝั่งเฉียง เลยคำนวณให้ ไม่ต้องลิสต์ z เอง) */
function beachPropTiles(){
  const out = [];
  const add = (list, kind) => list.forEach(p=>{
    const z = seaEdgeZ(p[0]) + p[1];
    if(z>=0 && z<OUT_D && isSandTile(p[0], z)) out.push([p[0], z, kind]);
  });
  add(PALM_SPOTS, 'palm');
  add(UMBRELLA_SPOTS, 'umbrella');
  add(BEACH_CHAIRS, 'chair');
  return out;
}

/* ---------- ฉากเฟส 7: ม้านั่ง / รถเข็นขายของ / ฟาร์มเลี้ยงสัตว์ / ท่าไม้+คนตกปลา / ลานกิจกรรม ---------- */
function buildBench(){
  const g = new THREE.Group();
  const seat = box(1.5,.12,.5,0xd9a86c,.05); seat.position.y = .44; g.add(seat);
  const back = box(1.5,.44,.11,0xc98d4e,.05); back.position.set(0,.7,-.2); g.add(back);
  [-1,1].forEach(s=>{
    const lg = box(.14,.44,.44,0x8f6231,.04); lg.position.set(s*.62,.22,0); g.add(lg);
    const ar = box(.13,.1,.5,0xc98d4e,.04); ar.position.set(s*.68,.56,.02); g.add(ar);
  });
  return g;
}
/* รถเข็นขายของ: ตัวรถ + ล้อ 2 ล้อ + ที่จับ + กันสาดลายทาง + ของขายตามประเภท */
function buildCart(kind){
  const g = new THREE.Group();
  const tone = {fruit:0xef8354, ice:0x7fc4e8, noodle:0xe4574a, balloon:0xb388ff}[kind] || 0xef8354;
  const body = box(1.15,.5,.72,0xf3e7d6,.06); body.position.y = .55; g.add(body);
  const trim = box(1.2,.12,.78,tone,.04); trim.position.y = .78; g.add(trim);
  const base = box(1.0,.1,.6,0xc98d4e,.03); base.position.y = .3; g.add(base);
  [-1,1].forEach(s=>{
    const wh = cyl(.24,.24,.1,0x6d4c41,14); wh.rotation.x = Math.PI/2; wh.position.set(s*.42,.24,.42); g.add(wh);
    const hb = cyl(.07,.07,.11,0xffd54f,8); hb.rotation.x = Math.PI/2; hb.position.set(s*.42,.24,.47); g.add(hb);
  });
  const hd = cyl(.05,.05,.62,0x8f6231,8); hd.rotation.z = -.45; hd.position.set(-.72,.66,0); g.add(hd);
  [-1,1].forEach(s=>{                                  /* เสากันสาด */
    const ps = cyl(.045,.045,.8,0xf7f3ee,8); ps.position.set(s*.48,1.18,0); g.add(ps);
  });
  for(let i=0;i<5;i++){                                /* กันสาดลายทาง */
    const st = box(.25,.08,.86, i%2 ? 0xffffff : tone, .03);
    st.position.set(-.5+i*.25, 1.6, 0); g.add(st);
  }
  if(kind==='fruit'){
    [[-.3,0xe4574a],[0,0xffd54f],[.3,0x8fd06c]].forEach(p=>{
      const fr = sphere(.15,p[1],10); fr.position.set(p[0],.94,0); g.add(fr);
      const fr2 = sphere(.12,p[1],8); fr2.position.set(p[0]+.06,1.14,.06); g.add(fr2);
    });
  }else if(kind==='ice'){
    const tub = cyl(.24,.22,.3,0xfffaf0,12); tub.position.set(-.26,.98,0); g.add(tub);
    [[-.26,1.18,0xffb3c6],[-.12,1.22,0xa8e6cf]].forEach(p=>{ const sc = sphere(.15,p[2],10); sc.position.set(p[0],p[1],0); g.add(sc); });
    const cn = cone(.16,.42,0xe0a860,10); cn.position.set(.34,1.05,0); g.add(cn);
    const scoop = sphere(.16,0xfff3b0,10); scoop.position.set(.34,1.3,0); g.add(scoop);
  }else if(kind==='noodle'){
    const pot = cyl(.26,.24,.32,0xc9d6de,14); pot.position.set(-.2,.99,0); g.add(pot);
    const lid = cyl(.28,.28,.06,0x8fa3ad,14); lid.position.set(-.2,1.17,0); g.add(lid);
    [[-.2,1.32,.11],[-.1,1.46,.09]].forEach(p=>{ const st = sphere(p[2],0xffffff,8); st.position.set(p[0],p[1],0); g.add(st); });
    const bowl = cyl(.19,.13,.16,0xfffaf0,12); bowl.position.set(.34,.94,0); g.add(bowl);
    const nd = cyl(.15,.15,.05,0xffe0a3,12); nd.position.set(.34,1.03,0); g.add(nd);
  }else{                                               /* รถเข็นลูกโป่ง */
    const str = cyl(.03,.03,.7,0xf7f3ee,6); str.position.set(.3,1.5,0); g.add(str);
    [[0,1.95,0xff8fb3],[.24,2.06,0xffd54f],[-.2,2.1,0x7fc4e8],[.06,2.26,0xb388ff]].forEach(p=>{
      const bl = sphere(.2,p[2],12); bl.scale.set(1,1.16,1); bl.position.set(.3+p[0],p[1],0); g.add(bl);
    });
  }
  return g;
}
/* สัตว์ในฟาร์ม (ทรงมนน่ารัก ไม่สมจริงเกินวัย) */
function buildFarmAnimal(kind){
  const g = new THREE.Group();
  const legs = (n, y, r, hex, pts) => pts.forEach(p=>{ const l = cyl(r,r,y,hex,6); l.position.set(p[0],y/2,p[1]); g.add(l); });
  if(kind==='cow' || kind==='pig' || kind==='sheep'){
    const isPig = kind==='pig', isSheep = kind==='sheep';
    const bodyHex = isPig ? 0xf8b6c4 : (isSheep ? 0xfffaf0 : 0xfffaf0);
    const legHex  = isPig ? 0xe89aab : (isSheep ? 0x6d5b54 : 0x6d5b54);
    legs(4,.34,.075,legHex,[[-.24,.16],[.24,.16],[-.24,-.16],[.24,-.16]]);
    if(isSheep){
      [[0,.58,.3],[-.2,.54,.24],[.18,.54,.24]].forEach(p=>{ const w = sphere(p[2],bodyHex,10); w.position.set(p[0],p[1],0); g.add(w); });
      const hd = sphere(.17,0x4a3b32,10); hd.position.set(.4,.56,0); g.add(hd);
      [-1,1].forEach(s=>{ const er = sphere(.08,0x4a3b32,6); er.scale.set(1,.6,1.3); er.position.set(.36,.66,s*.15); g.add(er); });
      [-1,1].forEach(s=>{ const e = sphere(.03,0xfffaf0,6); e.position.set(.53,.6,s*.07); g.add(e); });
    }else{
      const bd = box(.72,.42,.46,bodyHex,.16); bd.position.y = .56; g.add(bd);
      if(!isPig){                                       /* ลายวัวขาว-ดำ (จุดใหญ่ให้เห็นชัดว่าเป็นวัว) */
        [[-.18,.64,.2,.2],[.12,.52,-.24,.17],[-.24,.5,.2,.13]].forEach(p=>{
          const sp = sphere(p[3],0x3f332e,8); sp.scale.set(1,.85,.6); sp.position.set(p[0],p[1],p[2]); g.add(sp);
        });
        const fh = sphere(.13,0x3f332e,8); fh.scale.set(.7,.7,.9); fh.position.set(.5,.76,0); g.add(fh);
      }
      const hd = sphere(.21,bodyHex,10); hd.position.set(.46,.66,0); g.add(hd);
      const mz = cyl(.12,.13,.14,isPig?0xef9aae:0xf6c3ca,10); mz.rotation.z = Math.PI/2; mz.position.set(.66,.6,0); g.add(mz);
      [-1,1].forEach(s=>{
        const er = isPig ? cone(.09,.16,0xef9aae,6) : sphere(.07,bodyHex,6);
        er.position.set(.42,.83,s*.14); g.add(er);
        const e = sphere(.032,0x4a3b32,6); e.position.set(.62,.7,s*.08); g.add(e);
        if(!isPig){ const hn = cone(.05,.12,0xe8dcc8,6); hn.position.set(.36,.88,s*.1); g.add(hn); }
      });
      const tl = cyl(.03,.03,.3,legHex,6); tl.rotation.z = isPig ? 1.3 : .5; tl.position.set(-.4,.6,0); g.add(tl);
      if(isPig){ const cu = torus(.07,.025,legHex,8); cu.rotation.y = Math.PI/2; cu.position.set(-.48,.66,0); g.add(cu); }
    }
  }else if(kind==='chick'){
    const bd = sphere(.2,0xffd54f,10); bd.scale.set(1,.9,1); bd.position.y = .22; g.add(bd);
    const hd = sphere(.14,0xffe082,10); hd.position.set(.1,.44,0); g.add(hd);
    const bk = cone(.06,.12,0xff9f43,6); bk.rotation.z = -Math.PI/2; bk.position.set(.24,.42,0); g.add(bk);
    [-1,1].forEach(s=>{
      const e = sphere(.025,0x4a3b32,6); e.position.set(.2,.48,s*.05); g.add(e);
      const wg = sphere(.1,0xffe082,8); wg.scale.set(.5,.8,1); wg.position.set(-.02,.24,s*.18); g.add(wg);
      const lg = cyl(.02,.02,.12,0xff9f43,6); lg.position.set(s*.06,.06,0); g.add(lg);
    });
    const tail = cone(.1,.16,0xffca28,6); tail.rotation.z = 1.6; tail.position.set(-.22,.3,0); g.add(tail);
  }else{                                                 /* เป็ดในบ่อ (ลอยน้ำ ตัวจมครึ่ง) */
    const bd = sphere(.22,0xfffaf0,12); bd.scale.set(1.2,.8,1); bd.position.y = -.02; g.add(bd);
    const hd = sphere(.14,0xfffaf0,10); hd.position.set(.2,.2,0); g.add(hd);
    const bk = cone(.06,.14,0xff9f43,6); bk.rotation.z = -Math.PI/2; bk.position.set(.34,.18,0); g.add(bk);
    [-1,1].forEach(s=>{ const e = sphere(.025,0x4a3b32,6); e.position.set(.28,.24,s*.05); g.add(e); });
    const tl = cone(.1,.18,0xfffaf0,6); tl.rotation.z = 1.4; tl.position.set(-.26,.04,0); g.add(tl);
  }
  return g;
}
function buildHayBale(){
  const g = new THREE.Group();
  const b = cyl(.34,.34,.62,0xe3bd6a,14); b.rotation.z = Math.PI/2; b.position.y = .34; g.add(b);
  [-1,1].forEach(s=>{ const ring = torus(.3,.03,0xc79f4f,12); ring.rotation.y = Math.PI/2; ring.position.set(s*.2,.34,0); g.add(ring); });
  const top = sphere(.14,0xf0d489,8); top.scale.set(1,.5,1); top.position.set(0,.68,0); g.add(top);
  return g;
}
function buildTrough(){
  const g = new THREE.Group();
  const b = box(.9,.24,.42,0xa9784f,.06); b.position.y = .2; g.add(b);
  const in_ = box(.74,.08,.28,0x8fd06c,.03); in_.position.y = .3; g.add(in_);
  [-1,1].forEach(s=>{ const lg = box(.12,.2,.34,0x8f6231,.03); lg.position.set(s*.34,.1,0); g.add(lg); });
  return g;
}
function buildCoop(){                                    /* เล้าไก่เล็กๆ */
  const g = new THREE.Group();
  const b = box(.9,.6,.8,0xf3e7d6,.07); b.position.y = .34; g.add(b);
  const rf = box(1.06,.12,.96,0xd8624c,.05); rf.position.y = .7; rf.rotation.x = .1; g.add(rf);
  const hole = cyl(.16,.16,.08,0x6d4c41,12); hole.rotation.x = Math.PI/2; hole.position.set(0,.34,.42); g.add(hole);
  const ramp = box(.3,.06,.5,0xc98d4e,.03); ramp.rotation.x = -.5; ramp.position.set(0,.1,.6); g.add(ramp);
  const nest = sphere(.1,0xe3bd6a,8); nest.scale.set(1,.5,1); nest.position.set(.32,.06,.5); g.add(nest);
  return g;
}
function buildWindmill(){                                /* กังหันลมสูบน้ำเข้าฟาร์ม */
  const g = new THREE.Group();
  const tw = cyl(.16,.42,2.3,0xe8dcc8,10); tw.position.y = 1.15; tw.castShadow = hShadows; g.add(tw);
  [.7,1.5].forEach(y=>{ const bd = torus(.28,.035,0xc9b48f,12); bd.rotation.x = Math.PI/2; bd.position.y = y; g.add(bd); });
  const hub = sphere(.14,0x8f6231,10); hub.position.set(0,2.4,.2); g.add(hub);
  for(let i=0;i<4;i++){
    const bl = box(.16,.9,.06,0xfffaf0,.03);
    bl.position.set(Math.sin(i*Math.PI/2)*.5, 2.4 + Math.cos(i*Math.PI/2)*.5, .22);
    bl.rotation.z = -i*Math.PI/2; g.add(bl);
  }
  const cap = cone(.3,.36,0xd8624c,10); cap.position.y = 2.45; g.add(cap);
  return g;
}
/* รั้วคอกสัตว์: เสา + ราวไม้ 2 ชั้น ตามแนวที่รั้วต่อกัน */
function buildPenFencePiece(alongX, alongZ){
  const g = new THREE.Group();
  const post = box(.14,.9,.14,0x9c6238,.04); post.position.y = .45; g.add(post);
  const cap = sphere(.09,0xb4763a,8); cap.position.y = .92; g.add(cap);
  [.34,.66].forEach(y=>{
    if(alongX){ const r = box(1.02,.1,.08,0xc98d4e,.03); r.position.set(.5,y,0); g.add(r); }
    if(alongZ){ const r = box(.08,.1,1.02,0xc98d4e,.03); r.position.set(0,y,.5); g.add(r); }
  });
  return g;
}
/* รั้วโรงเรียน: เสาปูนขาว + ราวไม้ระแนงฟ้าพาสเทล (คนละโทนกับรั้วคอกสัตว์ ให้ดูเป็นรั้วโรงเรียน) */
function buildSchoolFencePiece(alongX, alongZ){
  const g = new THREE.Group();
  const post = box(.16,1.0,.16, 0xfdfbf5,.05); post.position.y = .5; g.add(post);
  const cap  = cone(.13,.2, 0x7fc4e8, 8);      cap.position.y = 1.06; g.add(cap);
  [.42,.76].forEach(y=>{
    if(alongX){ const r = box(1.02,.09,.07, 0x9ad4f0,.03); r.position.set(.5,y,0); g.add(r); }
    if(alongZ){ const r = box(.07,.09,1.02, 0x9ad4f0,.03); r.position.set(0,y,.5); g.add(r); }
  });
  /* ระแนงเล็กๆ คั่นระหว่างราว ให้เห็นเป็นรั้วโปร่ง */
  [.25,.75].forEach(f=>{
    if(alongX){ const s2 = box(.07,.5,.06, 0xfdfbf5,.02); s2.position.set(f,.58,0); g.add(s2); }
    if(alongZ){ const s2 = box(.06,.5,.07, 0xfdfbf5,.02); s2.position.set(0,.58,f); g.add(s2); }
  });
  return g;
}
/* ซุ้มประตูโรงเรียน: เสา 2 ต้นคร่อมช่องประตู + คานโค้ง + ธงเล็กบนยอด (ไม่บล็อกช่อง เด็กเดินลอดได้) */
function buildSchoolGate(){
  const g = new THREE.Group();
  [-1,1].forEach(sd=>{
    const pl = box(.3,2.0,.3, 0xfdfbf5,.07); pl.position.set(sd*1.5,1.0,0); g.add(pl);
    const kb = sphere(.17, 0x7fc4e8, 10);    kb.position.set(sd*1.5,2.12,0); g.add(kb);
  });
  const beam = box(3.3,.24,.26, 0xef8fa5,.08); beam.position.y = 2.0; g.add(beam);
  const arch = box(2.4,.18,.2, 0xffd54f,.07);  arch.position.y = 2.24; g.add(arch);
  for(let i=0;i<5;i++){                                  /* ธงราวเล็กๆ ห้อยใต้คาน */
    const fl = box(.22,.26,.03, [0xef5f5f,0xffd54f,0x7fc4e8,0x9be7a8,0xb388ff][i],.02);
    fl.position.set((i-2)*.55, 1.74, .13); g.add(fl);
  }
  return g;
}
/* เสาธงหน้าโรงเรียน: ฐานปูนกลม + เสาขาว + ธงชาติไทย 5 แถบ */
function buildFlagPole(){
  const g = new THREE.Group();
  const base = cyl(.42,.5,.18, 0xe6e0d2, 12); base.position.y = .09; g.add(base);
  const step = cyl(.3,.36,.14, 0xf6f2e8, 12); step.position.y = .25; g.add(step);
  const pole = cyl(.06,.075,3.2, 0xfdfbf5, 8); pole.position.y = 1.9; g.add(pole);
  const knob = sphere(.11, 0xffd54f, 10); knob.position.y = 3.56; g.add(knob);
  /* ธงชาติไทย: แดง-ขาว-น้ำเงิน-ขาว-แดง (แถบน้ำเงินกลางหนาเป็น 2 เท่า) วางเรียงลงมาจากยอดเสา */
  const STRIPES = [[0xef5f5f,.1],[0xfdfbf5,.1],[0x3f5aa6,.2],[0xfdfbf5,.1],[0xef5f5f,.1]];
  let fy = 3.35;
  STRIPES.forEach(([c,h])=>{
    const st = box(.9, h, .04, c, .01);
    st.position.set(.52, fy - h/2, 0);
    g.add(st); fy -= h;
  });
  return g;
}
/* ---------- กระท่อมช่างไม้ (ป่าทิศเหนือ) ----------
   ตัวกระท่อมเป็นซุงซ้อนชั้น หลังคาจั่วเขียวพาสเทล + ปล่องไฟมีควัน
   ครึ่งซ้ายของด้านหน้าเป็น "เพิงช่างไม้" เปิดโล่ง มีกันสาด โต๊ะช่าง เลื่อย ค้อน และป้ายรูปห้อยอยู่
   ครึ่งขวาเป็นประตูบ้าน มีหน้าต่างกลมบนหน้าจั่ว (สไตล์เดียวกับอาคารอื่นในแผนที่ แค่เป็นไม้ทั้งหลัง) */
function buildCarpenterHut(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;
  const bw = w-.5, bd = d-.35, bh = 1.55, RISE = 1.15;
  const body = box(bw, bh, bd, lot.wall, .06); body.position.y = bh/2; g.add(body);
  [.32,.74,1.16].forEach(y=>{                              /* แนวซุงซ้อนชั้น */
    const lg = box(bw+.06,.13,bd+.06, 0xd2a56f,.05); lg.position.y = y; g.add(lg);
  });
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>{                  /* เสาซุงมุมกระท่อม */
    const cp = cyl(.15,.15,bh, 0xb4763a, 8); cp.position.set(sx*bw/2, bh/2, sz*bd/2); g.add(cp);
  }));
  addRoofGable(g, bw, bd, bh, lot.roof, 0xd8b98a, RISE);
  const ridge = cyl(.11,.11,bd+.5, 0x8f6231, 8);           /* ซุงสันหลังคา */
  ridge.rotation.x = Math.PI/2; ridge.position.y = bh + RISE; g.add(ridge);
  addChimney(g, bw, bd, bh, RISE);
  [[.0,2.9,.16],[.12,3.18,.13],[-.08,3.42,.1]].forEach(([ox,y,r])=>{   /* ควันลอยจากปล่องไฟ */
    const sm = sphere(r, 0xf4f1ea, 8); sm.position.set(bw*.28+ox, y, -bd*.18); g.add(sm);
  });
  const fz = bd/2;                                         /* ระนาบหน้ากระท่อม */
  /* ป้ายรูปเลื่อยบนหน้าจั่ว (ตำแหน่งเดียวกับป้ายร้านอื่นๆ — มุมกล้อง iso มองเห็นชัดสุด) */
  const sgFr = box(1.02,.88,.09, 0xb4763a,.04); sgFr.position.set(0, bh+.56, fz+.08); g.add(sgFr);
  const sgFc = box(.84,.7,.06, 0xf3e2c0,.03); sgFc.position.set(0, bh+.56, fz+.14); g.add(sgFc);
  const sgn = signPlane(lot.icon, .6); sgn.position.set(0, bh+.56, fz+.2); g.add(sgn);
  /* หน้าต่างกลมบนผนังหน้า (ระหว่างเพิงช่างไม้กับประตู) */
  const win = cyl(.19,.19,.06, 0xaadcf5, 12); win.rotation.x = Math.PI/2; win.position.set(.34, .95, fz+.02); g.add(win);
  const wfr = torus(.21,.05, 0xd2a56f, 14); wfr.position.set(.34, .95, fz+.03); g.add(wfr);
  /* ประตูไม้ครึ่งขวา: แผ่นไม้ + ไม้ตีทแยงกากบาท */
  const DX = bw*.28;
  const door = box(.68,1.02,.1, 0x9c6238,.02); door.position.set(DX,.51,fz+.02); g.add(door);
  [-1,1].forEach(s=>{
    const br = box(.78,.09,.04, 0xd2a56f,.02); br.rotation.z = s*.95; br.position.set(DX,.51,fz+.08); g.add(br);
  });
  const knob = sphere(.055, 0xffd54f, 8); knob.position.set(DX+.22,.5,fz+.09); g.add(knob);
  const step = box(.86,.1,.34, 0xd8b98a,.03); step.position.set(DX,.05,fz+.2); g.add(step);
  /* เพิงช่างไม้ครึ่งซ้าย: กันสาด + เสาซุง 2 ต้น */
  const AX = -bw*.26;
  const awn = box(1.9,.13,.66, lot.roof,.05); awn.rotation.x = .12; awn.position.set(AX,1.46,fz+.33); g.add(awn);
  const awnEdge = box(1.94,.09,.1, 0xd8b98a,.03); awnEdge.position.set(AX,1.42,fz+.65); g.add(awnEdge);
  [-1,1].forEach(s=>{
    const ps = cyl(.09,.09,1.44, 0xb4763a, 8); ps.position.set(AX+s*.82,.72,fz+.58); g.add(ps);
  });
  /* โต๊ะช่างใต้กันสาด: หน้าโต๊ะ + ขา + ไม้ที่กำลังเลื่อย + เลื่อย + ค้อน */
  const tbl = box(1.55,.13,.6, 0xd9a86c,.03); tbl.position.set(AX,.66,fz+.4); g.add(tbl);
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>{
    const lgg = box(.11,.6,.11, 0x9c6238,.02); lgg.position.set(AX+sx*.64,.3,fz+.4+sz*.2); g.add(lgg);
  }));
  const plank = box(1.1,.09,.32, 0xe8c79a,.02); plank.rotation.y = .12; plank.position.set(AX-.05,.77,fz+.4); g.add(plank);
  const blade = box(.46,.17,.03, 0xc9d3d9,.01); blade.rotation.z = .38; blade.position.set(AX+.3,.98,fz+.4); g.add(blade);
  const bhand = box(.13,.2,.07, 0x8f6231,.03); bhand.rotation.z = .38; bhand.position.set(AX+.54,1.07,fz+.4); g.add(bhand);
  const hstk = cyl(.032,.032,.3, 0xc98d4e, 6); hstk.rotation.z = Math.PI/2; hstk.position.set(AX-.5,.76,fz+.55); g.add(hstk);
  const hhead = box(.17,.11,.11, 0x8fa3ad,.03); hhead.position.set(AX-.68,.76,fz+.55); g.add(hhead);
  /* ราวแขวนเครื่องมือใต้ชายกันสาด (ตะไบ/สิ่ว/ไม้ฉาก ห้อยเป็นแถว) */
  const rail = cyl(.03,.03,1.5, 0x8f6231, 6); rail.rotation.z = Math.PI/2; rail.position.set(AX,1.3,fz+.58); g.add(rail);
  [[-.5,.3,0xb9c7d2],[-.12,.26,0xc98d4e],[.28,.34,0x8fa3ad]].forEach(([ox,hh,c])=>{
    const tl = box(.09,hh,.05, c,.02); tl.position.set(AX+ox,1.3-hh/2,fz+.58); g.add(tl);
    const hk = torus(.05,.014, 0xb9c7d2, 8); hk.rotation.y = Math.PI/2; hk.position.set(AX+ox,1.3,fz+.58); g.add(hk);
  });
  /* ไม้แปรรูปพิงข้างกระท่อม (ฝั่ง +x) */
  [0,1,2].forEach(i=>{
    const pk = box(.14,1.5,.34, i%2 ? 0xe8c79a : 0xd8b98a,.02);
    pk.rotation.z = -.13; pk.position.set(bw/2+.2+i*.12,.72, -bd*.14+i*.13); g.add(pk);
  });
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}
/* ตอไม้ (ใช้ทั้งชนิด stump และ chop) */
function carpenterStump(g){
  const st = cyl(.36,.4,.5, 0x9c6238, 12); st.position.y = .25; g.add(st);
  const top = cyl(.34,.34,.05, 0xe8c79a, 12); top.position.y = .52; g.add(top);
  const ring = torus(.19,.022, 0xd2a56f, 14); ring.rotation.x = Math.PI/2; ring.position.y = .545; g.add(ring);
}
/* ของในลานช่างไม้: กองซุง / กองไม้แปรรูป / ม้าเลื่อยไม้ / ตอไม้ / ตอไม้ปักขวาน */
function buildCarpenterProp(kind){
  const g = new THREE.Group();
  if(kind === 'logs'){
    const log = (y, z)=>{
      const lg = cyl(.2,.2,.92, 0xb4763a, 10); lg.rotation.z = Math.PI/2; lg.position.set(0,y,z); g.add(lg);
      [-1,1].forEach(s=>{                                  /* หน้าตัดซุงสีอ่อน เห็นวงปี */
        const cap = cyl(.2,.2,.04, 0xe8c79a, 10); cap.rotation.z = Math.PI/2; cap.position.set(s*.47,y,z); g.add(cap);
        const rg = torus(.1,.018, 0xd2a56f, 12); rg.rotation.y = Math.PI/2; rg.position.set(s*.5,y,z); g.add(rg);
      });
    };
    log(.2,-.23); log(.2,.23); log(.56,0);
  } else if(kind === 'planks'){
    for(let i=0;i<6;i++){
      const pk = box(1.0,.08,.44, i%2 ? 0xe8c79a : 0xd8b98a,.02);
      pk.rotation.y = (i%2 ? .05 : -.04); pk.position.set(0,.06+i*.1,0); g.add(pk);
    }
    const rope = box(.07,.62,.48, 0x8d6e63,.02); rope.position.set(.18,.34,0); g.add(rope);
  } else if(kind === 'sawhorse'){
    const beam = box(1.05,.13,.15, 0xc98d4e,.03); beam.position.y = .62; g.add(beam);
    [-1,1].forEach(sx=>[-1,1].forEach(sz=>{
      const lg = box(.09,.7,.09, 0xa9784f,.02);
      lg.rotation.z = sx*.24; lg.rotation.x = -sz*.22; lg.position.set(sx*.36,.33,sz*.2); g.add(lg);
    }));
    const plank = box(1.25,.09,.4, 0xe8c79a,.02); plank.rotation.y = .1; plank.position.y = .73; g.add(plank);
    const blade = box(.44,.17,.03, 0xc9d3d9,.01); blade.rotation.z = .4; blade.position.set(.16,.94,0); g.add(blade);
    const hd = box(.13,.2,.07, 0x8f6231,.03); hd.rotation.z = .4; hd.position.set(.4,1.04,0); g.add(hd);
    const dust = cyl(.3,.34,.07, 0xefd9a8, 10); dust.position.set(-.1,.035,.34); g.add(dust);
  } else if(kind === 'stump'){
    carpenterStump(g);
    [[-.42,.06,.3],[.4,.05,-.28],[.1,.05,.46]].forEach(([x,y,z],i)=>{   /* เศษไม้รอบตอ */
      const ch = box(.2,.06,.1, i%2 ? 0xe8c79a : 0xd2a56f,.02); ch.rotation.y = i*.9; ch.position.set(x,y,z); g.add(ch);
    });
  } else if(kind === 'chop'){
    carpenterStump(g);
    const hnd = cyl(.035,.035,.72, 0xc98d4e, 6); hnd.rotation.z = .5; hnd.position.set(.2,.82,0); g.add(hnd);
    const head = box(.2,.22,.08, 0x8fa3ad,.03); head.rotation.z = .5; head.position.set(.36,1.13,0); g.add(head);
    const edge = cone(.11,.16, 0xdfe6ea, 4); edge.rotation.z = -1.07; edge.position.set(.47,1.18,0); g.add(edge);
    [[-.45,.35],[-.34,-.36]].forEach(([x,z],i)=>{                        /* ท่อนไม้ผ่าครึ่งวางข้างตอ */
      const hf = cyl(.14,.14,.6, 0xb4763a, 10); hf.rotation.z = Math.PI/2; hf.rotation.y = i*.6; hf.position.set(x,.14,z); g.add(hf);
    });
  }
  return g;
}
/* ลานไม้หน้ากระท่อมช่างไม้ (พื้นตกแต่ง ไม่บล็อกทางเดิน) — แผ่นไม้เรียงตามแนว z + คานขอบ */
function buildWoodYard(w, d){
  const g = new THREE.Group();
  const n = Math.round(w*2);                               /* แผ่นละครึ่งช่อง */
  for(let i=0;i<n;i++){
    const pk = box(w/n-.05, .07, d-.12, i%2 ? 0xd9b384 : 0xd0a475,.02);
    pk.position.set(-w/2 + w/n*(i+.5), .035, 0); g.add(pk);
  }
  [-1,1].forEach(s=>{
    const bm = box(w, .09, .12, 0xb4763a,.03); bm.position.set(0,.045,s*(d/2-.06)); g.add(bm);
  });
  return g;
}
function buildPier(len){                                 /* ท่าไม้ยื่นลงบ่อ (ยาวไปทาง +x) */
  const g = new THREE.Group();
  for(let i=0;i<len;i++){
    for(let k=0;k<3;k++){
      const pl = box(.94,.1,.3,k===1?0xd9a86c:0xc98d4e,.03);
      pl.position.set(i, .16, (k-1)*.34); g.add(pl);
    }
    [-1,1].forEach(s=>{ const ps = cyl(.07,.07,.7,0x8f6231,8); ps.position.set(i, -.18, s*.34); g.add(ps); });
  }
  const rail = box(.1,.1,.08,0xb4763a,.03); rail.position.set(len-1+.4,.5,-.34); g.add(rail);
  return g;
}
/* เรือ: sail = เรือใบ (เสา+ใบเรือลายขวาง+ธงยอดเสา), row = เรือประมงลำเล็ก (ที่นั่ง+ไม้พาย+ลังปลา),
   net = เรือประมงกำลังจับปลา (row + เสาค้ำอวน + ผืนอวนหย่อนลงน้ำ + ทุ่นลอย + ปลาในลัง) */
function buildBoat(kind){
  const g = new THREE.Group();
  const hullC = kind === 'sail' ? 0xef8354 : kind === 'net' ? 0x5aa9e6 : 0xf6e3cc;
  const hull = box(1.9,.36,.8,hullC,.16); hull.position.y = -.02; g.add(hull);
  [-1,1].forEach(s=>{                                    /* หัว-ท้ายเรือมนๆ */
    const tip = sphere(.22, hullC, 10); tip.position.set(s*.92,-.02,0); tip.scale.set(.95,.82,.95); g.add(tip);
  });
  const trim = box(1.62,.09,.6,0xfff6ec,.05); trim.position.y = .13; g.add(trim);   /* ขอบกราบเรือสีขาว (เล็กกว่าลำเรือ ให้เห็นสีลำเรือเป็นกรอบ) */
  const deck = box(1.3,.1,.42,0xd9a86c,.04); deck.position.y = .18; g.add(deck);
  if(kind === 'sail'){
    const mast = cyl(.055,.055,1.6,0xc98d4e,8); mast.position.set(-.1,.92,0); g.add(mast);
    const sail = box(.08,1.0,.86,0xfff6ec,.06); sail.position.set(-.04,1.02,.26); g.add(sail);
    const stripe = box(.06,.24,.86,0xf28cae,.04); stripe.position.set(-.005,.84,.26); g.add(stripe);
    const flag = box(.04,.18,.28,0xffd54f,.03); flag.position.set(-.14,1.62,.14); g.add(flag);
  }else{
    [-.42,.42].forEach(px=>{ const st = box(.16,.08,.62,0xc98d4e,.03); st.position.set(px,.23,0); g.add(st); });
    const oar = cyl(.045,.045,1.7,0xd9a86c,6); oar.rotation.x = Math.PI/2;
    oar.position.set(.02,.3,0); g.add(oar);
    [-1,1].forEach(s=>{ const bl = box(.24,.06,.22,0xc98d4e,.03); bl.position.set(.02,.3,s*.9); g.add(bl); });
    const crate = box(.38,.28,.36, kind === 'net' ? 0xef8354 : 0x5aa9e6, .07); crate.position.set(-.6,.32,0); g.add(crate);
    const fish = sphere(.11,0xffd54f,8); fish.position.set(-.6,.5,0); fish.scale.set(1.4,.8,.7); g.add(fish);
  }
  if(kind === 'net'){                                      /* ชุดอวนจับปลาห้อยลงข้างเรือ */
    [-.32,.5].forEach(px=>{ const po = cyl(.05,.05,.8,0xc98d4e,7); po.position.set(px,.6,.3); g.add(po); });
    const boom = cyl(.045,.045,1.0,0xc98d4e,7); boom.rotation.z = Math.PI/2;
    boom.position.set(.09,.96,.46); g.add(boom);
    const net = box(.86,.92,.05,0xd6eee2,.02); net.position.set(.09,.42,.62); g.add(net);
    [-.3,0,.3].forEach(px=>{                               /* ริ้วอวนแนวตั้ง ให้ดูเป็นตาข่ายไม่ใช่ใบเรือ */
      const rib = box(.06,.92,.09,0x8fbfae,.02); rib.position.set(.09+px,.42,.62); g.add(rib);
    });
    [.66,.18].forEach(py=>{ const rb = box(.9,.06,.09,0x8fbfae,.02); rb.position.set(.09,py,.62); g.add(rb); });
    const netEdge = box(.94,.09,.12,0x6fae99,.03); netEdge.position.set(.09,-.06,.62); g.add(netEdge);
    [-.3,.2,.62].forEach((pz,i)=>{                         /* ทุ่นลอยน้ำสีสด */
      const bu = sphere(.13, i%2 ? 0xffd54f : 0xf28cae, 9);
      bu.position.set(.09 + (i-1)*.42, -.05, .95); bu.scale.set(1,.7,1); g.add(bu);
    });
    [[.3,.72],[-.05,.9]].forEach(([px,pz])=>{              /* ปลาในอวน */
      const f = sphere(.1,0xffb74d,8); f.position.set(px,.12,pz); f.scale.set(1.5,.85,.7); g.add(f);
    });
  }
  return g;
}

/* ราวตากปลา: เสาไม้ 2 ต้น + ราวขวาง + ปลาแขวนเรียงกัน (ฉากบ้านชาวประมง) */
function buildFishRack(twoBars){
  const g = new THREE.Group();
  [-.62,.62].forEach(px=>{
    const po = cyl(.07,.08,1.15,0xc98d4e,8); po.position.set(px,.57,0); g.add(po);
    const ft = box(.34,.1,.34,0xd9a86c,.04); ft.position.set(px,.05,0); g.add(ft);
  });
  const bars = twoBars ? [1.06,.72] : [1.06];
  bars.forEach(by=>{
    const bar = cyl(.05,.05,1.5,0xd9a86c,7); bar.rotation.z = Math.PI/2;
    bar.position.set(0,by,0); g.add(bar);
    [-.45,-.15,.15,.45].forEach((px,i)=>{
      const line = cyl(.012,.012,.2,0xbfa88a,5); line.position.set(px,by-.12,0); g.add(line);
      const fish = sphere(.15, i%2 ? 0xf6e3cc : 0xffd54f, 9);
      fish.position.set(px,by-.3,0); fish.scale.set(.62,1.25,.5); g.add(fish);
      const tail = box(.14,.16,.05, i%2 ? 0xe8c9a0 : 0xf2b93f,.03); tail.position.set(px,by-.5,0); g.add(tail);
    });
  });
  return g;
}
/* NPC นั่งตกปลาที่ปลายท่า (นั่งห้อยขา + คันเบ็ด + สายเอ็น + ทุ่นลอยน้ำ) */
function buildFisherNpc(){
  const g = new THREE.Group();
  const hip = box(.34,.22,.3,0x5aa9e6,.08); hip.position.set(0,.42,0); g.add(hip);
  const torso = box(.38,.44,.32,0xffd54f,.1); torso.position.set(-.02,.72,0); g.add(torso);
  [-1,1].forEach(s=>{                                    /* ขาห้อยลงน้ำ */
    const th = box(.14,.13,.34,0x4a6fa5,.05); th.position.set(.16,.44,s*.1); g.add(th);
    const sh = cyl(.06,.06,.34,0xf6c9a8,8); sh.position.set(.3,.24,s*.1); g.add(sh);
    const ft = box(.14,.09,.2,0x6d4c41,.03); ft.position.set(.32,.06,s*.1); g.add(ft);
  });
  const head = sphere(.19,0xf6e3cc,12); head.position.set(-.02,1.08,0); g.add(head);
  [-1,1].forEach(s=>{ const e = sphere(.03,0x4a3b32,6); e.position.set(.14,1.1,s*.07); g.add(e); });
  const sm = box(.1,.03,.03,0x8d5b4c,.01); sm.position.set(.17,1.0,0); g.add(sm);
  const brim = cyl(.32,.32,.05,0xd8a24a,14); brim.position.set(-.02,1.22,0); g.add(brim);
  const crown = cyl(.1,.2,.2,0xd8a24a,12); crown.position.set(-.02,1.32,0); g.add(crown);
  const armL = cyl(.055,.055,.4,0xf6c9a8,8); armL.rotation.z = -.6; armL.position.set(.16,.78,.2); g.add(armL);
  const armR = cyl(.055,.055,.34,0xf6c9a8,8); armR.rotation.z = .4; armR.position.set(-.14,.76,-.18); g.add(armR);
  const rod = cyl(.028,.035,2.2,0xc98d4e,6);             /* คันเบ็ดชี้ออกไปทางบ่อ (+x) */
  rod.rotation.z = -.95; rod.position.set(.78,1.26,.2); g.add(rod);
  const reel = cyl(.09,.09,.07,0x8fa3ad,10); reel.rotation.x = Math.PI/2; reel.position.set(.24,.94,.2); g.add(reel);
  const line = cyl(.012,.012,1.15,0xfffaf0,4);           /* สายเอ็นห้อยลงน้ำ */
  line.position.set(1.66,.62,.2); g.add(line);
  const float = sphere(.1,0xe4574a,10); float.position.set(1.66,.02,.2); g.add(float);
  const ring = torus(.16,.02,0xfffaf0,12); ring.rotation.x = Math.PI/2; ring.position.set(1.66,-.04,.2); g.add(ring);
  const bucket = cyl(.16,.14,.3,0x7fc4e8,12); bucket.position.set(-.5,.15,.3); g.add(bucket);
  const fish = sphere(.1,0x9fd0e8,8); fish.scale.set(1.4,.8,.5); fish.position.set(-.5,.34,.3); g.add(fish);
  return g;
}
/* ลานกิจกรรม: เวทีเล็ก + เสาธงราว (ให้เด็กใช้เป็นที่รวมตัว/จัดงานในเฟสถัดไป) */
function buildStagePlatform(){
  const g = new THREE.Group();
  const w = STAGE.x1-STAGE.x0+1, d = STAGE.z1-STAGE.z0+1;
  const deck = box(w-.1, .3, d-.1, 0xd9a86c, .06); deck.position.y = .15; g.add(deck);
  const edge = box(w+.06, .1, d+.06, 0xc98d4e, .04); edge.position.y = .32; g.add(edge);
  [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(c=>{             /* เสา 4 มุม + หลังคาผ้า */
    const ps = cyl(.07,.07,1.9,0xf7f3ee,8); ps.position.set(c[0]*(w/2-.28), 1.25, c[1]*(d/2-.28)); g.add(ps);
  });
  const canopy = cone(Math.max(w,d)*.78, .6, 0xef6a58, 4);
  canopy.rotation.y = Math.PI/4; canopy.position.y = 2.42; canopy.castShadow = hShadows; g.add(canopy);
  const knob = sphere(.11,0xffd54f,8); knob.position.y = 2.76; g.add(knob);
  const mic = cyl(.035,.035,.8,0x8fa3ad,6); mic.position.set(0,.7,d/2-.5); g.add(mic);
  const micHead = sphere(.08,0x4a3b32,8); micHead.position.set(0,1.12,d/2-.5); g.add(micHead);
  g.position.set(outWX((STAGE.x0+STAGE.x1)/2), 0, outWZ((STAGE.z0+STAGE.z1)/2));
  return g;
}
function buildBannerPole(i){
  const g = new THREE.Group();
  const pole = cyl(.06,.06,2.2,0xf7f3ee,8); pole.position.y = 1.1; g.add(pole);
  const knob = sphere(.09,0xffd54f,8); knob.position.y = 2.26; g.add(knob);
  const cols = [0xff8fb3,0xffd54f,0x7fc4e8,0xb388ff];
  for(let k=0;k<3;k++){                                  /* ธงสามเหลี่ยมเล็ก */
    const fl = cone(.13,.24,cols[(i+k)%4],4);
    fl.rotation.x = Math.PI/2; fl.rotation.z = Math.PI/2;
    fl.position.set(.2, 1.9-k*.34, 0); g.add(fl);
  }
  return g;
}

/* ---------- ชาวบ้าน (NPC) ----------
   ทรงการ์ตูนแบนโทนเดียวกับตัวละครเด็ก **หันหน้าไปทาง +z เมื่อ rotation.y = 0**
   (ให้ตรงกับ Math.atan2(dx,dz) ตอนหันหน้ามาหาเด็ก) ประกอบทุกชิ้นไว้ในกลุ่มลูก `b`
   เพื่อย่อขนาดเด็ก/ผู้ใหญ่ได้โดยที่กลุ่มนอกยัง identity (mergeDecorGroup อ่าน matrixWorld) */
const NPC_SKIN = [0xf6e3cc, 0xf0d0a8, 0xe3b189, 0xc98d5e];
const NPC_HAIR = [0x4a3b32, 0x2f2a26, 0x6d4c41, 0x8d6e63, 0xd9d3cc];
/* สร้างตัวชาวบ้าน — `animated` = คนที่เดินได้ ให้แยกแขน/ขาเป็นกลุ่มย่อยไว้แกว่งตอนเดิน
   (merge ทีละกลุ่ม → คนละ ~5 draw call) ส่วนคนที่ยืนเฉยๆ รวมทุกชิ้นในกลุ่มเดียว (1 draw call) */
function buildVillager(lk, animated){
  const g = new THREE.Group(), b = new THREE.Group();
  g.add(b);
  /* ผู้ใหญ่สูงกว่าเด็กนิดหน่อย แต่ใช้สัดส่วนชิ้นส่วนชุดเดียวกับตัวละครเด็กทั้งหมด */
  b.scale.setScalar(lk.kid ? .82 : 1.06);
  const skin = NPC_SKIN[(lk.skin|0) % NPC_SKIN.length];
  const hairC = NPC_HAIR[(lk.hairC|0) % NPC_HAIR.length];
  const shirt = lk.shirt ?? 0xef8354, pants = lk.pants ?? 0x4a6fa5;
  const shoeC = lk.shoe ?? 0x4a3b32, girl = !!lk.girl;
  const core = new THREE.Group(), legP = [], armP = [];   /* core = ชิ้นที่ไม่ขยับ, legP/armP = จุดหมุนสะโพก/ไหล่ */
  const HIP_Y = .5, SHO_Y = .9;
  /* ---- ลำตัว: ทรง/พิกัดเดียวกับ buildCharacter เป๊ะ (สะโพก-ขา-รองเท้า-กระโปรง-เสื้อ-แขน-หัว) ---- */
  if(!girl){ const hip = box(.5,.22,.31, pants, .09); hip.position.y = .46; core.add(hip); }
  [-1,1].forEach(s=>{
    /* ถ้าเดินได้: ขา+รองเท้าอยู่ในกลุ่มจุดหมุนสะโพก (พิกัดเทียบสะโพก) เพื่อหมุนได้ทั้งท่อน */
    const piv = animated ? new THREE.Group() : null, par = piv || core, dy = animated ? -HIP_Y : 0;
    const leg = box(.18,.42,.18, girl ? skin : pants, .06); leg.position.set(.14*s,.27+dy,0); par.add(leg);
    const shoe = box(.2,.11,.25, shoeC, .045); shoe.position.set(.14*s,.09+dy,.03); par.add(shoe);
    if(piv){ piv.userData.s = s; legP.push(piv); }
  });
  if(girl){
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(.24,.4,.24,10), toonMat(pants));
    sk.castShadow = hShadows; sk.position.y = .42; core.add(sk);
  }
  const body = box(.52,.5,.32, shirt); body.position.y = .68; core.add(body);
  if(lk.apron){ const ap = box(.4,.42,.05,0xfbf7f0,.02); ap.position.set(0,.62,.18); core.add(ap); }
  /* แขน — pivot ที่ไหล่แบบเดียวกับเด็ก (กางออกเล็กน้อย) */
  [-1,1].forEach(s=>{
    const piv = new THREE.Group();
    const arm  = box(.15,.46,.16, shirt, .075); arm.position.y  = -.21; piv.add(arm);
    const hand = box(.12,.1,.14, skin, .045);   hand.position.y = -.46; piv.add(hand);
    if(animated){ piv.userData.s = s; armP.push(piv); }
    else { piv.position.set(.28*s, SHO_Y, 0); piv.rotation.z = .16*s; core.add(piv); }
  });
  /* หัวทรงกล่องมนแบบเดียวกับเด็ก + ตา/ผมชุดเดียวกัน (addEyes/addHair) */
  const head = new THREE.Group(); head.position.y = 1.26; core.add(head);
  /* หัวใช้ toonMat (ไม่ใช่ softMat แบบเด็ก) เพื่อให้ mergeDecorGroup รวมเป็น mesh เดียวต่อ NPC = 1 draw call */
  const skull = new THREE.Mesh(roundedBoxGeo(.64,.6,.66), toonMat(skin));
  skull.castShadow = hShadows; head.add(skull);
  addHair(head, girl, (lk.hair|0) % H_HAIR_N, hairC);
  addEyes(head, lk.eyes == null ? 1 : lk.eyes|0, 0x3a2f28);
  /* ---- หน้าตาหลายแบบ: ปาก / คิ้ว / จมูก / กระ / หนวดเครา (ค่าสุ่มคงที่ต่อคน ดู npcFaceVariety) ---- */
  const lipC = 0xc9573f;
  const fm = (lk.face|0) % 6;
  if(fm === 2){                                            /* อ้าปากกลม (ทำท่าพูด) */
    const mo = sphere(.052, 0x9c3b2e, 8); mo.scale.z = .5; mo.position.set(0,-.13,.34); head.add(mo);
  } else if(fm === 3){                                     /* ปากขีดเล็กๆ นิ่งๆ */
    const mo = box(.1,.022,.03, lipC, .01); mo.position.set(0,-.12,.35); head.add(mo);
  } else {
    const r = fm === 1 ? .085 : fm === 5 ? .075 : .06;     /* ยิ้มโค้ง (กว้างต่างกันตามแบบ) */
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(r,.018,6,10,Math.PI), toonMat(lipC));
    mouth.rotation.z = Math.PI + (fm === 4 ? .28 : 0);
    mouth.position.set(0,-.12,.345); mouth.castShadow = hShadows; head.add(mouth);
    if(fm === 5){                                          /* ยิ้มเห็นฟัน */
      const th = box(.09,.028,.02, 0xfbf7f0, .008); th.position.set(0,-.11,.35); head.add(th);
    }
  }
  const bw = (lk.brow|0) % 4;                              /* คิ้ว: ไม่มี / ตรง / ยกขึ้น / หนา */
  if(bw) [-1,1].forEach(s=>{
    const br = box(bw === 3 ? .17 : .14, bw === 3 ? .045 : .03, .03, hairC, .012);
    br.position.set(.15*s, .17, .34);
    br.rotation.z = bw === 2 ? -.22*s : 0;
    head.add(br);
  });
  const ns = (lk.nose|0) % 3;                              /* จมูก: ไม่มี / กลมเล็ก / เหลี่ยมน้อยๆ */
  if(ns === 1){ const no = sphere(.045, skin, 8); no.position.set(0,-.01,.35); head.add(no); }
  else if(ns === 2){ const no = box(.06,.07,.05, skin, .02); no.position.set(0,-.02,.35); head.add(no); }
  if(lk.freckle) [-1,1].forEach(s=>{                       /* กระที่แก้ม */
    [[-.03,.02],[.03,-.01],[0,-.04]].forEach(o=>{
      const fr = sphere(.014, 0xd98f74, 6); fr.position.set(.22*s+o[0], -.05+o[1], .345); head.add(fr);
    });
  });
  if(lk.beard === 1){                                      /* เคราสั้นรอบคาง */
    const bd = box(.4,.16,.1, hairC, .05); bd.position.set(0,-.24,.29); head.add(bd);
  } else if(lk.beard === 2){                               /* หนวดเหนือปาก */
    const ms = box(.22,.05,.05, hairC, .02); ms.position.set(0,-.05,.35); head.add(ms);
  }
  [-1,1].forEach(s=>{
    const ch = sphere(.045,0xffb3a0,8); ch.scale.z = .5; ch.position.set(.24*s,-.08,.34); head.add(ch);
    if(lk.glasses){ const gl = torus(.075,.016,0x4a3b32,10); gl.position.set(.16*s,.04,.36); head.add(gl); }
  });
  /* หมวก — ผูกไว้กับกลุ่มหัว (พิกัดเทียบหัว: ยอดกะโหลก y .3 แต่ทรงผมสูงถึง ~.42 บางทรงถึง .5)
     ขอบล่างของหมวกทุกใบจึงต้องอยู่ที่ ~.45 ขึ้นไป ให้ "วางทับบนผม" ไม่ใช่จมลงไปในผม
     (ตรวจง่ายๆ: y ของชิ้น − ครึ่งความสูงของชิ้น ต้อง ≥ .44) */
  if(lk.hat === 'cook'){
    const bd = cyl(.22,.22,.15,0xfbf7f0,12); bd.position.y = .55; head.add(bd);
    const pf = sphere(.25,0xfbf7f0,10); pf.position.y = .76; head.add(pf);
  } else if(lk.hat === 'straw'){
    const br = cyl(.45,.45,.05,0xd8a24a,14); br.position.y = .48; head.add(br);   /* ปีกหมวกวางบนผม */
    const cr = cyl(.2,.28,.26,0xe0b45c,12); cr.position.y = .62; head.add(cr);
    const bn = cyl(.29,.29,.05,0xc4573f,12); bn.position.y = .515; head.add(bn);  /* ริบบิ้นคาดหมวก */
  } else if(lk.hat === 'cap'){
    const cp = box(.7,.22,.72, shirt, .1); cp.position.y = .58; head.add(cp);
    const vs = box(.38,.05,.26, shirt, .02); vs.position.set(0,.5,.44); head.add(vs);
  } else if(lk.hat === 'flower'){
    const f1 = sphere(.085,0xff8fb3,8); f1.position.set(.26,.44,.07); head.add(f1);
    const f2 = sphere(.065,0xffd54f,7); f2.position.set(.32,.53,.03); head.add(f2);
  } else if(lk.hat === 'bandana'){
    const bn = box(.7,.16,.72, lk.hatC ?? 0xef5f5f, .07); bn.position.y = .53; head.add(bn);
    const kn = sphere(.075, lk.hatC ?? 0xef5f5f, 7); kn.position.set(0,.53,-.36); head.add(kn);
  } else if(lk.hat === 'police'){
    const cp = box(.72,.24,.74, 0x2f3f66, .1); cp.position.y = .6; head.add(cp);      /* หมวกตำรวจกรมท่า */
    const vs = box(.4,.06,.28, 0x24304f, .02); vs.position.set(0,.5,.46); head.add(vs);
    const bd2 = box(.16,.13,.05, 0xffd54f, .02); bd2.position.set(0,.63,.38); head.add(bd2);   /* ตราหน้าหมวก */
  } else if(lk.hat === 'beanie'){
    const bn = new THREE.Mesh(roundedBoxGeo(.72,.36,.74), toonMat(lk.hatC ?? 0x7fc4e8));
    bn.castShadow = hShadows; bn.position.y = .62; head.add(bn);
    const pf = sphere(.1, 0xfbf7f0, 8); pf.position.y = .85; head.add(pf);
  }
  /* ของที่ถือ (มือขวา = ฝั่ง +x) — รวมไว้ในกลุ่มเดียว เลื่อนลงให้ตรงมือทรงใหม่
     ตัวที่เดินได้: แขวนกลุ่มนี้ไว้กับจุดหมุนไหล่ขวา ของจะได้แกว่งตามมือเวลาเดิน
     ซ้อน 2 ชั้น (เอียงกลับ 0.16 rad → เลื่อนชดเชยตำแหน่งไหล่) พิกัดของทุกชิ้นจึงคงเดิมเป๊ะตอนยืนนิ่ง */
  const holdArm = animated ? armP.find(p => p.userData.s === 1) : null;
  const hold = new THREE.Group();
  if(holdArm){
    const tilt = new THREE.Group(); tilt.rotation.z = -.16;
    hold.position.set(.06 - .28, -.16 - SHO_Y, 0);
    tilt.add(hold); holdArm.add(tilt);
  }else{
    hold.position.set(.06, -.16, 0); core.add(hold);
  }
  const P = lk.prop;
  if(P === 'tray'){
    const tr = box(.32,.05,.24,0xd9a86c,.02); tr.position.set(.36,.66,.14); hold.add(tr);
    [[-.07,.05],[.06,-.04]].forEach(o=>{ const bn = sphere(.062,0xe8b46a,8); bn.position.set(.36+o[0],.72,.14+o[1]); hold.add(bn); });
  } else if(P === 'basket'){
    const bk = cyl(.15,.12,.18,0xc98d4e,10); bk.position.set(.36,.66,.12); hold.add(bk);
    [[0xef5f5f,-.06],[0x6fbf73,.06],[0xffc857,0]].forEach((o,i)=>{
      const fr = sphere(.062,o[0],8); fr.position.set(.36+o[1],.77,.12+(i-1)*.05); hold.add(fr);
    });
  } else if(P === 'book'){
    const bo = box(.18,.23,.06,0xef8354,.02); bo.position.set(.34,.72,.12); bo.rotation.x = -.25; hold.add(bo);
    const pg = box(.15,.2,.03,0xfbf7f0,.01);  pg.position.set(.34,.73,.15); pg.rotation.x = -.25; hold.add(pg);
  } else if(P === 'cone'){
    const cn = cone(.085,.22,0xf2d5a8,8); cn.rotation.z = Math.PI; cn.position.set(.34,.72,.12); hold.add(cn);
    const ic = sphere(.095,0xff8fb3,8);   ic.position.set(.34,.88,.12); hold.add(ic);
  } else if(P === 'bottle'){
    const bt = cyl(.07,.07,.26,0xfbf7f0,8); bt.position.set(.34,.72,.12); hold.add(bt);
    const cp = cyl(.045,.045,.06,0x7fc4e8,6); cp.position.set(.34,.87,.12); hold.add(cp);
  } else if(P === 'bouquet'){
    const st = cyl(.028,.028,.24,0x6fbf73,6); st.position.set(.34,.7,.12); hold.add(st);
    [[0xff8fb3,-.06,0],[0xffd54f,.05,.04],[0xb388ff,0,-.05]].forEach(o=>{
      const fl = sphere(.07,o[0],8); fl.position.set(.34+o[1],.88,.12+o[2]); hold.add(fl);
    });
  } else if(P === 'ball'){
    const bl = sphere(.13,0xef5f5f,10); bl.position.set(.36,.68,.18); hold.add(bl);
  } else if(P === 'hoe'){
    const st = cyl(.035,.035,1.4,0xc98d4e,6); st.rotation.z = .2; st.position.set(.36,.72,.06); hold.add(st);
    const bd = box(.18,.05,.13,0x8fa3ad,.02); bd.position.set(.22,.06,.06); hold.add(bd);
  } else if(P === 'bucket'){
    const bc = cyl(.14,.1,.19,0x8fa3ad,10); bc.position.set(.36,.6,.1); hold.add(bc);
    const hl = torus(.13,.016,0x6f8290,10); hl.rotation.y = Math.PI/2; hl.position.set(.36,.7,.1); hold.add(hl);
  } else if(P === 'fish'){
    const fs = sphere(.1,0x7fc4e8,8); fs.scale.set(1.7,1,.6); fs.position.set(.36,.68,.12); hold.add(fs);
    const tl = cone(.08,.12,0x5aa9e6,6); tl.rotation.z = Math.PI/2; tl.position.set(.2,.68,.12); hold.add(tl);
  } else if(P === 'scroll'){
    const sc = cyl(.05,.05,.3,0xfbf7f0,8); sc.rotation.z = Math.PI/2; sc.position.set(.34,.7,.14); hold.add(sc);
    const rb = cyl(.055,.055,.05,0xef5f5f,6); rb.rotation.z = Math.PI/2; rb.position.set(.34,.7,.14); hold.add(rb);
  } else if(P === 'guitar'){
    const bd = box(.17,.34,.09,0xd8a24a,.06); bd.position.set(.31,.68,.18); bd.rotation.z = -.3; hold.add(bd);
    const nk = box(.05,.34,.05,0x8d5b4c,.02); nk.position.set(.42,.98,.18); nk.rotation.z = -.3; hold.add(nk);
  } else if(P === 'balloon'){
    const th = cyl(.012,.012,.55,0xf7f3ee,4); th.position.set(.34,.92,.08); hold.add(th);
    const b1 = sphere(.15,0xff8fb3,10); b1.position.set(.3,1.32,.06);  hold.add(b1);
    const b2 = sphere(.12,0x7fc4e8,10); b2.position.set(.46,1.42,.12); hold.add(b2);
  } else if(P === 'box'){
    const bx = box(.3,.28,.26,0xc98d4e,.04); bx.position.set(.3,.72,.2); hold.add(bx);
    const tp = box(.32,.04,.28,0xe8b46a,.02); tp.position.set(.3,.87,.2); hold.add(tp);
  } else if(P === 'saw'){                                  /* เลื่อยของช่างไม้: ใบเหล็ก + ฟันเลื่อย + ด้ามไม้ */
    const bl = box(.34,.14,.03,0xc9d3d9,.01); bl.rotation.z = .18; bl.position.set(.44,.72,.12); hold.add(bl);
    for(let i=0;i<5;i++){ const th = cone(.022,.05,0xb4c2cb,4); th.rotation.x = Math.PI; th.position.set(.32+i*.07,.635+i*.013,.12); hold.add(th); }
    const hd = box(.11,.16,.06,0xa9784f,.03); hd.position.set(.25,.7,.12); hold.add(hd);
  } else if(P === 'bowl'){
    const bw = cyl(.16,.09,.14,0xfbf7f0,10); bw.position.set(.36,.66,.12); hold.add(bw);
    const nd = sphere(.12,0xe8b46a,8); nd.scale.y = .5; nd.position.set(.36,.73,.12); hold.add(nd);
  }
  if(animated){
    /* merge ทีละกลุ่มตอน matrix ยังเป็น identity → พิกัดที่ bake คือพิกัดภายในกลุ่มนั้นล้วนๆ
       แล้วค่อยตั้งตำแหน่งจุดหมุน (สะโพก/ไหล่) ทีหลัง — แขนขาจึงยังหมุนได้ทั้งที่รวม mesh แล้ว */
    mergeDecorGroup(core);
    legP.concat(armP).forEach(p => mergeDecorGroup(p));
    legP.forEach(p=>{ p.position.set(0, HIP_Y, 0); b.add(p); });
    armP.forEach(p=>{ p.position.set(.28*p.userData.s, SHO_Y, 0); p.rotation.z = .16*p.userData.s; b.add(p); });
    b.add(core);
    /* holdIdx = แขนข้างที่ถือของ (ถ้ามีของ) — ตอนเดินจะแกว่งแขนข้างนี้เบากว่าอีกข้าง ของที่ถือจะได้ไม่เหวี่ยงจนดูแปลก */
    g.userData.hRig = {legs: legP, arms: armP, holdIdx: (holdArm && lk.prop) ? armP.indexOf(holdArm) : -1};
  } else b.add(core);
  return g;
}

/* ---------- เสาไฟริมทางเดิน ----------
   ให้ "ติด/ดับ" และหน้าตาแสงเหมือนเสาไฟตกแต่งบ้าน (decor `lamp-post`) ทุกอย่าง:
   โคมเป็นแก้วเหลืองพาสเทลสีเดียวกัน กลางคืนเรืองแสง (emissive) กลางวันดับ
   และค่อยๆ fade เข้า-ออกด้วยจังหวะเดียวกับไฟ decor (updateStreetLamps ใช้ค่าเดียวกับ updateLamps)
   ต่างกันแค่ไม่ใส่ PointLight ทีละต้น เพราะเสาไฟฉากมีหลายสิบต้น จะหนักเครื่องเด็ก
   → ใช้วงแสงนวลบนพื้นแทนแสงจริงที่ตกกระทบ
   วัสดุ 2 ชิ้นนี้ใช้ร่วมกันทุกต้นและกันไม่ให้ถูก merge รวม (userData.noMerge) → ปรับทีเดียวติด/ดับทั้งเมือง */
const STREET_BULB = 0xfff59d;              /* สีโคมชุดเดียวกับเสาไฟตกแต่งบ้าน */
const STREET_LIGHT_N = 12;                 /* ดวงไฟจริงมีแค่ 12 ดวง สร้างตอนเข้าฉากครั้งเดียว แล้ววนย้ายไปเสาที่ใกล้เด็กที่สุด
                                              (เสาไฟมี 37 ต้น ถ้าใส่ PointLight ต้นละดวงจะหนักเครื่องเกินไป — ทุกดวงคิดค่าทุกเฟรม
                                              ไม่ว่าจะหรี่ไฟอยู่หรือไม่) เลข 12 มาจากการนับเสาที่อยู่ในรัศมีแสง (18 ช่อง)
                                              จากทุกจุดบนแผนที่: จุดที่เสาแน่นสุดเห็นพร้อมกัน 13 ต้น แต่ 12 ครอบคลุมเกือบทั้งเมือง
                                              แล้ว เพิ่มเกินนี้ไม่มีผลกับภาพแต่เสียเฟรมเรตฟรีๆ */
let streetGlowMat = null;
let streetLampOn = false, streetLampCur = 0;   /* เป้าหมาย (ติด/ดับ) กับความสว่างจริงตอนนี้ 0..1 */
let streetLampPos = [], streetLampLights = [], streetLightT = 0;
function streetGlowMaterial(){
  if(!streetGlowMat){
    streetGlowMat = new THREE.MeshToonMaterial({color: STREET_BULB, emissive: new THREE.Color(0x000000)});
    streetGlowMat.userData.noMerge = true;
  }
  return streetGlowMat;
}
function applyStreetLampGlow(){
  if(streetGlowMat) streetGlowMat.emissive.setHex(STREET_BULB).multiplyScalar(streetLampCur);
}
function refreshStreetLamps(snap){   /* กลางคืนสั่งติด กลางวันสั่งดับ (เรียกจาก refreshLamps ที่เดียวกับไฟ decor) */
  streetLampOn = (typeof isNightMode === 'function') && isNightMode();
  if(snap){ streetLampCur = streetLampOn ? 1 : 0; applyStreetLampGlow(); }
}
/* ไฟจริงของเสาไฟ: จองดวงไฟไว้ตอนเข้าฉากแค่ 6 ดวง (ไม่ผูกกับเสาต้นใดต้นหนึ่ง) แล้วย้ายไปเสาที่ใกล้เด็กที่สุดเป็นระยะ
   หมายเหตุ: ต้องคง visible=true ตลอด แล้วคุมด้วย intensity อย่างเดียว เพราะจำนวนไฟที่ "มองเห็น" เปลี่ยนเมื่อไร
   three.js จะคอมไพล์ shader ของวัสดุทั้งฉากใหม่ทันที (เดินผ่านเสาแล้วเฟรมกระตุก) */
function initStreetLights(parent){
  streetLampLights.forEach(li => { if(li.parent) li.parent.remove(li); });
  streetLampLights = [];
  for(let i=0; i<STREET_LIGHT_N; i++){
    const li = new THREE.PointLight(0xfff2b0, 0, 5.5, 1.6);   /* ค่าเดียวกับเสาไฟ decor เป๊ะ (color/dist/decay ตาม lamp-post ใน house-furniture.js) */
    li.castShadow = false;                 /* เงาจากไฟเสาหนักเกินไป ใช้แค่แสงนวลพอ */
    li.position.set(0, -50, 0);            /* ยังไม่มีเสาที่ใกล้ → ซุกไว้ใต้พื้นแล้วหรี่เป็น 0 */
    li.userData.k = 0; li.userData.post = null; li.userData.want = null;   /* ตัวหรี่ของดวงนี้ / เสาที่อยู่ตอนนี้ / เสาที่จะย้ายไป */
    parent.add(li);
    streetLampLights.push(li);
  }
  streetLightT = 0;
}
/* ย้ายดวงไฟไปเสาต้นใหม่แบบ "ค่อยๆ เฟด" (จังหวะเดียวกับสลับกลางวัน-กลางคืน):
   ดวงไฟแต่ละดวงมีตัวหรี่ของตัวเอง (userData.k 0..1) — จะย้ายตำแหน่งได้ก็ต่อเมื่อหรี่ลงจนมืดสนิทแล้วเท่านั้น
   แล้วค่อยสว่างขึ้นที่เสาต้นใหม่ (เมื่อก่อนกระโดดไปติดเต็มดวงทันที เดินผ่านเสาแล้วเห็นไฟกระพริบ)
   การจับคู่เสาก็ยึดของเดิมไว้ก่อน (ดวงไหนยังอยู่ในกลุ่มเสาที่ใกล้ที่สุด ให้อยู่เสาเดิมต่อ) จะได้ไม่สลับเสากันไปมาโดยไม่จำเป็น */
function updateStreetLights(dt){
  if(!streetLampLights.length) return;
  const lit = streetLampCur > .01;
  streetLightT -= dt;
  if(lit && streetLightT <= 0 && charGroup){
    streetLightT = .18;                    /* เช็คเสาที่ใกล้ที่สุดบ่อยๆ เสาที่เพิ่งเข้าเฟรมจะได้ติดไฟไว */
    const cx = charGroup.position.x, cz = charGroup.position.z;
    const near = streetLampPos
      .map(p => ({p, d:(p.x-cx)*(p.x-cx) + (p.z-cz)*(p.z-cz)}))
      .filter(o => o.d < 324)              /* ในระยะ 18 ช่อง */
      .sort((a, b) => a.d - b.d)
      .slice(0, STREET_LIGHT_N);
    const taken = near.map(() => false);
    streetLampLights.forEach(li => {       /* รอบแรก: ใครยังได้เสาเดิม ให้อยู่ต่อ */
      const cur = li.userData.post;
      const i = cur ? near.findIndex((o, k) => !taken[k] && o.p === cur) : -1;
      li.userData.want = i >= 0 ? (taken[i] = true, cur) : null;
    });
    streetLampLights.forEach(li => {       /* รอบสอง: ที่เหลือรับเสาใหม่ */
      if(li.userData.want) return;
      const i = near.findIndex((o, k) => !taken[k]);
      if(i >= 0){ taken[i] = true; li.userData.want = near[i].p; }
    });
  }
  /* เฟดขึ้นเร็ว (เข้าเฟรมแล้วต้องสว่างทันตา) เฟดลงเร็วกว่าอีกนิด จะได้ปล่อยดวงไฟไปเสาต้นใหม่ได้ไว */
  const rIn = Math.min(1, dt*6), rOut = Math.min(1, dt*9);
  const ccx = charGroup ? charGroup.position.x : 0, ccz = charGroup ? charGroup.position.z : 0;
  streetLampLights.forEach(li => {
    const u = li.userData;
    const tgt = (lit && u.post && u.post === u.want) ? 1 : 0;
    /* เสาเดิมอยู่ไกลจนหลุดเฟรมไปแล้ว → ดับทันทีไม่ต้องรอเฟด (ไม่มีใครเห็นอยู่แล้ว)
       ดวงไฟจะได้ย้ายไปติดเสาต้นที่เพิ่งเข้าเฟรมได้เลย ไม่ต้องรอเฟดดับ+เฟดติดต่อกันจนสว่างช้า */
    if(u.post && u.post !== u.want && ((u.post.x-ccx)*(u.post.x-ccx) + (u.post.z-ccz)*(u.post.z-ccz)) > 400) u.k = 0;
    u.k = (u.k || 0) + (tgt - (u.k || 0)) * (tgt > (u.k || 0) ? rIn : rOut);
    if(Math.abs(tgt - u.k) < .01) u.k = tgt;
    if(u.k <= .01 && u.post !== u.want){   /* มืดสนิทแล้วค่อยย้ายไปเสาต้นใหม่ (ย้ายตอนสว่างอยู่จะเห็นไฟกระโดด) */
      u.post = u.want;
      if(u.post) li.position.set(u.post.x, 1.94, u.post.z);
    }
    li.intensity = 1.2 * streetLampCur * u.k;   /* ความแรงเท่าเสาไฟ decor (intensity 1.2 × ตัวหรี่กลางคืน = 1) */
  });
}
function updateStreetLamps(dt){      /* ค่อยๆ สว่างขึ้น/หรี่ลง อัตราเดียวกับไฟ decor ใน updateLamps */
  const tgt = streetLampOn ? 1 : 0;
  if(Math.abs(tgt - streetLampCur) >= .002){
    streetLampCur += (tgt - streetLampCur) * Math.min(1, dt*1.8);
    applyStreetLampGlow();
  } else if(streetLampCur !== tgt){
    streetLampCur = tgt; applyStreetLampGlow();
  }
  updateStreetLights(dt);
}
/* ---------- พุ่มไม้ในแนวรั้วต้นไม้ ----------
   พุ่มกลมซ้อนกัน 3-4 ก้อน สุ่มแบบคงที่ตามพิกัด (เดิน 2 รอบได้รูปเดิม) + ดอกไม้เล็กแซมเป็นระยะ */
function buildHedgeBush(x, z){
  const g = new THREE.Group();
  const rnd = fieldRnd(x, z);
  const soil = box(.98,.1,.98, 0x7fae5c, .04); soil.position.y = .05; g.add(soil);
  const lobes = [[0,0,.42],[-.26,.12,.3],[.27,-.1,.31],[.05,-.26,.26]];
  lobes.forEach((p,i)=>{
    const bs = sphere(p[2], i%2 ? 0x6fbf73 : 0x8fd06c, 8);
    bs.scale.set(1, .95, 1);
    bs.position.set(p[0] + (rnd()-.5)*.12, .34 + (rnd()-.2)*.1, p[1] + (rnd()-.5)*.12);
    g.add(bs);
  });
  if(((x*5 + z*3) % 4) === 0){                        /* ดอกไม้เล็กแซมพุ่ม ให้แนวรั้วดูมีชีวิต */
    const c = [0xff8fb3, 0xffd54f, 0xffffff][(x + z) % 3];
    for(let k=0; k<3; k++){
      const fl = sphere(.07, c, 6); fl.scale.set(1,.7,1);
      fl.position.set((rnd()-.5)*.62, .55 + rnd()*.14, (rnd()-.5)*.62); g.add(fl);
    }
  }
  return g;
}

function buildStreetLamp(){
  const g = new THREE.Group();
  const base = cyl(.26,.32,.14, 0x8fa3ad, 10); base.position.y = .07; g.add(base);
  const post = cyl(.07,.085,1.72, 0x6d8a96, 8); post.position.y = .93; g.add(post);
  const ring = torus(.12,.03, 0x6d8a96, 10); ring.rotation.x = Math.PI/2; ring.position.y = 1.22; g.add(ring);
  const lip  = torus(.19,.028, 0x4f7f8c, 10); lip.rotation.x = Math.PI/2; lip.position.y = 1.74; g.add(lip);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(.2, 10, 8), streetGlowMaterial());
  glass.position.y = 1.94; g.add(glass);
  const cap = cyl(.09,.28,.2, 0x4f7f8c, 10); cap.position.y = 2.14; g.add(cap);   /* หลังคาโคม */
  const knob = sphere(.06, 0xffd54f, 8); knob.position.y = 2.3; g.add(knob);
  return g;
}
/* พิกัดเสาไฟทั้งเมืองกำหนดเอง (ดู LAMP_SPOTS ด้านบน) — ไม่สุ่ม/ไม่เกลี่ยอัตโนมัติแล้ว */
function lampSpots(){ return LAMP_SPOTS; }
/* ---------- กระดานภารกิจประจำวัน (ตั้งข้างน้ำพุกลางหมู่บ้าน) ----------
   หน้ากระดานหันไปทาง +z เมื่อ rotation.y = 0 (ฝั่งที่กล้อง isometric มองเห็น) */
function buildQuestBoard(){
  const g = new THREE.Group();
  [-1,1].forEach(s=>{                                        /* เสาไม้ 2 ต้น */
    const ps = cyl(.09,.09,1.5,0xc98d4e,8); ps.position.set(s*.62,.75,0); g.add(ps);
    const ft = box(.22,.12,.22,0x8d6e63,.04); ft.position.set(s*.62,.06,0); g.add(ft);
  });
  const frame = box(1.66,1.1,.14,0x9c6238,.07); frame.position.set(0,1.55,0);  g.add(frame);
  const face  = box(1.46,.92,.06,0xf2dcb8,.04); face.position.set(0,1.55,.08); g.add(face);
  [-1,1].forEach(s=>{                                        /* หลังคาจั่วเล็กกันฝน */
    const rf = box(1.0,.09,.5,0xef6a58,.04);
    rf.position.set(s*.42,2.24,0); rf.rotation.z = s*-.42; g.add(rf);
  });
  const ridge = cyl(.07,.07,.42,0xd94f3d,8); ridge.rotation.x = Math.PI/2; ridge.position.set(0,2.42,0); g.add(ridge);
  /* กระดาษภารกิจปักหมุดไว้ 3 ใบ */
  [[-.44,.06,-.05],[.02,-.02,.03],[.46,.04,-.02]].forEach((o,i)=>{
    const pp = box(.36,.46,.02,0xfbf7f0,.01);
    pp.position.set(o[0],1.55+o[1],.12); pp.rotation.z = o[2]; g.add(pp);
    const ln = box(.24,.05,.02,[0x7fc4e8,0xff8fb3,0x6fbf73][i],.01);
    ln.position.set(o[0],1.66+o[1],.14); ln.rotation.z = o[2]; g.add(ln);
    const pin = sphere(.045,0xffd54f,7); pin.position.set(o[0],1.74+o[1],.15); g.add(pin);
  });
  return g;
}
/* ดาวลอยเหนือกระดาน — บอกเด็กว่า "มีภารกิจใหม่" (แยกกลุ่มเพื่อขยับ/ซ่อนได้) */
function buildQuestMark(){
  const g = new THREE.Group();
  const st = sphere(.17,0xffd54f,10); st.scale.set(1,1,.5); g.add(st);
  for(let i=0;i<5;i++){
    const sp = cone(.09,.2,0xffc857,4);
    sp.position.set(Math.sin(i*Math.PI*2/5)*.2, Math.cos(i*Math.PI*2/5)*.2, 0);
    sp.rotation.z = -i*Math.PI*2/5; sp.scale.z = .45; g.add(sp);
  }
  return g;
}

/* สร้างฉากตายตัวทั้งหมด (ป่า/แนวพุ่ม/อาคาร/น้ำพุ/ดอกไม้/สะพาน) แล้วรวมเป็นก้อนต่อโซน */
const flowerSet = new Set();       /* ช่องที่มีดอกไม้ (ใช้เลือกสีอนุภาคตอนแตะ) */
function buildStaticScenery(){
  const parts = new Map();
  flowerSet.clear();
  seatMap.clear();
  wildLayout().forEach(rec=>{
    const item = FURN.byId[rec.id]; if(!item) return;
    const g = new THREE.Group();
    const pal = item.colors || [0x8fd06c];
    try { item.build(g, pal[(rec.col||0) % pal.length], decorKit(), rec); }
    catch(err){ console.error('wild build', rec.id, err); }
    g.position.copy(decorWorldPos('out', item, {x:rec.x, z:rec.z}, rec.rot||0));
    g.rotation.y = (rec.rot||0) * Math.PI/2;
    mergeCollect(g, parts, chunkKeyOf(rec.x, rec.z));
  });
  VILLAGE_LOTS.forEach(lot=>{
    mergeCollect(buildLotBuilding(lot), parts, chunkKeyOf(lot.x0, lot.z0));
  });
  mergeCollect(buildFountain(), parts, chunkKeyOf(FOUNTAIN.x0, FOUNTAIN.z0));
  /* แปลงผักฟาร์ม: ร่องละ 2 ต้น เยื้องกันเล็กน้อยให้ดูเป็นแถวปลูกจริง */
  FARM_PLOTS.forEach(p=>{
    for(let z=p.z0; z<=p.z1; z++) for(let x=p.x0; x<=p.x1; x++){
      if(!isCropTile(x,z)) continue;
      [-.22,.22].forEach((off,k)=>{
        const cr = buildCrop(p.crop);
        cr.position.set(outWX(x)+off, 0, outWZ(z) + (k ? .18 : -.18));
        cr.rotation.y = ((x*7+z*13+k*5)%4) * Math.PI/2;
        mergeCollect(cr, parts, chunkKeyOf(x, z));
      });
    }
  });
  SCARECROW_TILES.forEach(([x,z])=>{
    const sc = buildScarecrow();
    sc.position.set(outWX(x), 0, outWZ(z));
    mergeCollect(sc, parts, chunkKeyOf(x, z));
  });
  beachPropTiles().forEach(([x,z,kind])=>{
    if(kind==='chair'){                       /* เก้าอี้ผ้าใบ: หันหน้าออกทะเล (-z = rot 2) + นั่งได้ */
      const ch = buildDeckChair((x+z)%2===0);
      ch.position.set(outWX(x), 0, outWZ(z));
      ch.rotation.y = Math.PI;
      addSeatSpot(x, z, 2, 'deck');
      mergeCollect(ch, parts, chunkKeyOf(x, z));
      return;
    }
    const pr = kind==='palm' ? buildPalm() : buildBeachUmbrella();
    pr.position.set(outWX(x), 0, outWZ(z));
    pr.rotation.y = ((x*5+z*11)%4) * Math.PI/2;
    mergeCollect(pr, parts, chunkKeyOf(x, z));
  });
  /* เรือในทะเล (ลอยบนผิวน้ำ จมลงไปเล็กน้อยให้เห็นแนวน้ำที่กราบเรือ) + เรือจอดเกยหาด */
  BOAT_SPOTS.forEach(([x,off,kind])=>{
    const z = seaEdgeZ(x) - off;
    if(z < 0 || !isSeaTile(x, z)) return;
    const bt = buildBoat(kind);
    bt.position.set(outWX(x), -.18, outWZ(z));
    bt.rotation.y = ((x*7 + z*5) % 4) * Math.PI/2 + .35;
    mergeCollect(bt, parts, chunkKeyOf(x, z));
  });
  const bboat = buildBoat('row');
  bboat.position.set(outWX(BEACHED_BOAT.x), -.06, outWZ(BEACHED_BOAT.z));
  bboat.rotation.y = (BEACHED_BOAT.rot||0) * Math.PI/2 + .25;
  bboat.rotation.z = .06;                                  /* เอียงนิดๆ เหมือนเรือเกยทราย */
  mergeCollect(bboat, parts, chunkKeyOf(BEACHED_BOAT.x, BEACHED_BOAT.z));
  FISH_RACKS.forEach(([x,z,rot])=>{                        /* ราวตากปลาหน้าบ้านชาวประมง */
    const rk = buildFishRack((x+z)%2===0);
    rk.position.set(outWX(x), 0, outWZ(z));
    rk.rotation.y = (rot||0) * Math.PI/2;
    mergeCollect(rk, parts, chunkKeyOf(x, z));
  });
  POND_PADS.forEach(([x,z],i)=>{
    const lp = buildLilyPad(i%3===0);
    lp.position.set(outWX(x)+.2, 0, outWZ(z)-.15);
    mergeCollect(lp, parts, chunkKeyOf(x, z));
  });
  /* เฟส 7: คอกสัตว์ (รั้ว+สัตว์+ของในฟาร์ม) ทิศตะวันออกสุด */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(!isPenFenceTile(x, z)) continue;
    const fp = buildPenFencePiece(isPenFenceTile(x+1, z), isPenFenceTile(x, z+1));
    fp.position.set(outWX(x), 0, outWZ(z));
    mergeCollect(fp, parts, chunkKeyOf(x, z));
  }
  /* เขตโรงเรียน: รั้วรอบ box + ซุ้มประตู + เสาธงกลางลานหน้าโรงเรียน */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(!isSchoolFenceTile(x, z)) continue;
    const sf = buildSchoolFencePiece(isSchoolFenceTile(x+1, z), isSchoolFenceTile(x, z+1));
    sf.position.set(outWX(x), 0, outWZ(z));
    mergeCollect(sf, parts, chunkKeyOf(x, z));
  }
  const sgate = buildSchoolGate();                         /* คร่อมช่องประตูทั้งสอง (วางกึ่งกลางระหว่างช่อง) */
  sgate.position.set(outWX((SCHOOL_GATE[0][0] + SCHOOL_GATE[1][0])/2), 0, outWZ(SCHOOL_GATE[0][1]));
  mergeCollect(sgate, parts, chunkKeyOf(SCHOOL_GATE[0][0], SCHOOL_GATE[0][1]));
  const spole = buildFlagPole();
  spole.position.set(outWX(SCHOOL_FLAG.x), 0, outWZ(SCHOOL_FLAG.z));
  mergeCollect(spole, parts, chunkKeyOf(SCHOOL_FLAG.x, SCHOOL_FLAG.z));
  /* ลานช่างไม้: พื้นไม้หน้ากระท่อม + ของในลาน (กองซุง/ไม้แปรรูป/ม้าเลื่อย/ตอไม้) */
  const cy = buildWoodYard(CARPENTER_YARD.x1 - CARPENTER_YARD.x0 + 1, CARPENTER_YARD.z1 - CARPENTER_YARD.z0 + 1);
  cy.position.set(outWX((CARPENTER_YARD.x0 + CARPENTER_YARD.x1)/2), 0, outWZ((CARPENTER_YARD.z0 + CARPENTER_YARD.z1)/2));
  mergeCollect(cy, parts, chunkKeyOf(CARPENTER_YARD.x0, CARPENTER_YARD.z0));
  CARPENTER_PROPS.forEach(([x,z,kind])=>{
    const cp = buildCarpenterProp(kind);
    cp.position.set(outWX(x), 0, outWZ(z));
    cp.rotation.y = ((x*7 + z*5) % 4) * Math.PI/2 * .25 + .18;   /* หันเอียงคนละนิดให้ดูวางเอง ไม่เรียงเป๊ะ */
    mergeCollect(cp, parts, chunkKeyOf(x, z));
  });
  spawnPenAnimals();          /* สัตว์ในคอกเดินไปมาได้ → แยกกลุ่มของตัวเอง ไม่รวมเข้าฉากตายตัว */
  spawnNpcs();                /* ชาวบ้าน + กระดานภารกิจ → แยกกลุ่ม (แตะคุยได้/บางคนเดินไปมา) */
  FARM_PROPS.forEach(([x,z,kind])=>{
    const pr = kind==='hay' ? buildHayBale() : kind==='trough' ? buildTrough()
             : kind==='coop' ? buildCoop() : buildWindmill();
    pr.position.set(outWX(x), 0, outWZ(z));
    pr.rotation.y = ((x*5+z*3)%4) * Math.PI/2;
    mergeCollect(pr, parts, chunkKeyOf(x, z));
  });
  /* ท่าไม้ + คนตกปลาริมบ่อ (ฝั่งบ้านเด็ก) + เป็ดลอยน้ำ — rot 2 = ยื่น/หันไปทางทิศเหนือ (-x) */
  const pier = buildPier(POND_PIER.len);
  pier.position.set(outWX(POND_PIER.x), 0, outWZ(POND_PIER.z));
  pier.rotation.y = (POND_PIER.rot||0) * Math.PI/2;
  mergeCollect(pier, parts, chunkKeyOf(POND_PIER.x, POND_PIER.z));
  const fisher = buildFisherNpc();
  fisher.position.set(outWX(FISHER_TILE.x), .16, outWZ(FISHER_TILE.z));
  fisher.rotation.y = (FISHER_TILE.rot||0) * Math.PI/2;
  mergeCollect(fisher, parts, chunkKeyOf(FISHER_TILE.x, FISHER_TILE.z));
  POND_DUCKS.forEach(([x,z],i)=>{
    const dk = buildFarmAnimal('duck');
    dk.position.set(outWX(x)+.15, 0, outWZ(z)-.1);
    dk.rotation.y = i ? 2.2 : -.7;
    mergeCollect(dk, parts, chunkKeyOf(x, z));
  });
  /* ลานกิจกรรมก่อนถึงทะเล: เวที + เสาธงราว */
  mergeCollect(buildStagePlatform(), parts, chunkKeyOf(STAGE.x0, STAGE.z0));
  BANNER_POLES.forEach(([x,z],i)=>{
    const bp = buildBannerPole(i);
    bp.position.set(outWX(x), 0, outWZ(z));
    mergeCollect(bp, parts, chunkKeyOf(x, z));
  });
  /* แนวพุ่มไม้ตีขอบเมือง (ริมแม่น้ำ/ขอบโซน) */
  HEDGE_TILES.forEach(([x,z])=>{
    const hb = buildHedgeBush(x, z);
    hb.position.set(outWX(x), 0, outWZ(z));
    mergeCollect(hb, parts, chunkKeyOf(x, z));
  });

  /* ม้านั่งในชุมชน/ลานกิจกรรม + รถเข็นขายของแทรกตามทาง */
  streetLampPos = [];
  lampSpots().forEach(([x,z])=>{                       /* เสาไฟริมทางเดิน (กลางคืนโคมสว่างขึ้นเอง) */
    const lp = buildStreetLamp();
    lp.position.set(outWX(x), 0, outWZ(z));
    streetLampPos.push({x: lp.position.x, z: lp.position.z});   /* จำตำแหน่งไว้ให้ดวงไฟจริงย้ายไปหา */
    mergeCollect(lp, parts, chunkKeyOf(x, z));
  });
  BENCH_SPOTS.forEach(([x,z,rot])=>{
    const bn = buildBench();
    bn.position.set(outWX(x), 0, outWZ(z));
    bn.rotation.y = (rot||0) * Math.PI/2;
    addSeatSpot(x, z, rot||0, 'bench');
    mergeCollect(bn, parts, chunkKeyOf(x, z));
  });
  CART_SPOTS.forEach(([x,z,rot,kind])=>{
    const ct = buildCart(kind);
    ct.position.set(outWX(x), 0, outWZ(z));
    ct.rotation.y = (rot||0) * Math.PI/2;
    mergeCollect(ct, parts, chunkKeyOf(x, z));
  });
  FLOWER_BEDS.forEach((b,i)=>{                       /* แปลงดอกไม้หน้าลานกิจกรรม */
    mergeCollect(buildFlowerBed(b, i), parts, chunkKeyOf(b.x0, b.z0));
  });
  /* ---------- สระว่ายน้ำของโรงแรม ---------- */
  const pdW = POOL_DECK.x1 - POOL_DECK.x0 + 1, pdD = POOL_DECK.z1 - POOL_DECK.z0 + 1;
  const pdk = buildPoolDeckFloor(pdW, pdD);
  pdk.position.set(outWX((POOL_DECK.x0+POOL_DECK.x1)/2), 0, outWZ((POOL_DECK.z0+POOL_DECK.z1)/2));
  mergeCollect(pdk, parts, chunkKeyOf(POOL_DECK.x0, POOL_DECK.z0));
  const pw = buildPoolWater(POOL.x1-POOL.x0+1, POOL.z1-POOL.z0+1);
  pw.position.set(outWX((POOL.x0+POOL.x1)/2), 0, outWZ((POOL.z0+POOL.z1)/2));
  mergeCollect(pw, parts, chunkKeyOf(POOL.x0, POOL.z0));
  POOL_PROPS.forEach(([x,z,kind])=>{
    const pp = buildPoolProp(kind);
    pp.position.set(outWX(x), 0, outWZ(z));
    if(kind === 'chair') pp.rotation.y = Math.PI;      /* เตียงหันหน้าเข้าหาสระ */
    mergeCollect(pp, parts, chunkKeyOf(x, z));
  });
  /* ---------- ซุ้มทางเดินเข้าลานน้ำพุ 3 ทาง ---------- */
  PLAZA_GATES.forEach(gt=>{
    const alongX = gt.axis === 'x';
    const mid = alongX ? (gt.z0+gt.z1)/2 : (gt.x0+gt.x1)/2;      /* กึ่งกลางความกว้างทาง */
    const a0 = alongX ? gt.x0 : gt.z0, a1 = alongX ? gt.x1 : gt.z1;
    for(let a=a0; a<=a1; a++){
      const rib = buildArchRib(a);
      if(alongX) rib.position.set(outWX(a), 0, outWZ(mid));
      else { rib.position.set(outWX(mid), 0, outWZ(a)); rib.rotation.y = Math.PI/2; }
      mergeCollect(rib, parts, chunkKeyOf(alongX ? a : gt.x0, alongX ? gt.z0 : a));
    }
  });
  /* ---------- ทุ่งดอกไม้: ผืนหน้าโรงแรม + ผืนใหญ่ริมขอบแผนที่ทิศใต้ + ดอกไม้ริมทางทั่วชุมชน ----------
     ทุกช่องเป็นของตกแต่งบนพื้น ไม่บล็อกทางเดิน และข้ามช่องที่มีของอื่นอยู่แล้วเสมอ */
  const fieldDone = new Set();
  const fieldOpen = (x, z) => {
    if(x<0 || z<0 || x>=OUT_W || z>=OUT_D) return false;
    if(fieldDone.has(x + ',' + z)) return false;
    if(outGrid[z][x]!==0 || isVillageRoadTile(x,z) || isPlazaTile(x,z) || lotAt(x,z,1)) return false;
    if(inPoolDeck(x,z) || isSandTile(x,z) || inHomeZone(x,z)) return false;
    return !VILLAGE_LOTS.some(l=>{ const d = lotDoorTile(l); return d.x===x && d.z===z; });   /* เว้นช่องหน้าประตูบ้าน */
  };
  const putField = (x, z, g2, isFlower) => {
    g2.position.set(outWX(x), 0, outWZ(z));
    mergeCollect(g2, parts, chunkKeyOf(x, z));
    fieldDone.add(x + ',' + z);
    if(isFlower) flowerSet.add(x + ',' + z);          /* แตะทุ่งแล้วเด็กเก็บดอกไม้ได้ (อนุภาคกลีบดอก) */
  };
  for(let z=FLOWER_FIELD.z0; z<=FLOWER_FIELD.z1; z++) for(let x=FLOWER_FIELD.x0; x<=FLOWER_FIELD.x1; x++){
    if(!fieldOpen(x, z)) continue;
    const isPath = (z === FLOWER_FIELD_PATH);
    putField(x, z, isPath ? buildFieldPath(x, z) : buildFieldFlowers(x, z), !isPath);
  }
  for(let z=FLOWER_MEADOW.z0; z<=FLOWER_MEADOW.z1; z++) for(let x=FLOWER_MEADOW.x0; x<=FLOWER_MEADOW.x1; x++){
    if(!fieldOpen(x, z)) continue;
    if(inMeadowTrail(x, z)){ putField(x, z, buildFieldPath(x, z), false); continue; }
    /* เว้นช่องเป็นหย่อมๆ ให้เห็นหญ้าโล่งแทรก ดูเป็นทุ่งธรรมชาติ ไม่ใช่พรมดอกไม้ทึบทั้งผืน */
    if(((x*5 + z*11) % 5) === 0) continue;
    putField(x, z, buildFieldFlowers(x, z, {base:3, band: (x + z*2) >> 1}), true);
  }
  /* ทุ่งดอกไม้รอบลานน้ำพุ: ทุกช่องที่เหลือในกรอบ (ข้ามลานหิน/ทางเดินซุ้ม/ของฉากอัตโนมัติอยู่แล้ว) */
  for(let z=PLAZA_YARD.z0; z<=PLAZA_YARD.z1; z++) for(let x=PLAZA_YARD.x0; x<=PLAZA_YARD.x1; x++){
    if(!fieldOpen(x, z)) continue;
    putField(x, z, buildFieldFlowers(x, z, {base:3, band: (x + z*3) & 3}), true);
  }
  /* ดอกไม้ริมถนน/ริมลาน/ริมอาคารทั่วชุมชน — กระจุกเล็กๆ ช่องเว้นช่อง ไม่ให้รกจนบังทาง */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(!fieldOpen(x, z)) continue;
    const edge = nearRoadOrPlaza(x, z, 1) || !!lotAt(x, z, 2);
    if(!edge) continue;
    if(((x*7 + z*13) % 5) !== 0) continue;             /* ~20% ของช่องริมทาง (ลดลงจาก 40% ให้ชุมชนโล่งขึ้น) */
    putField(x, z, buildFieldFlowers(x, z, {base:1, band: x + z}), true);
  }
  [FLOWER_FIELD.x0, FLOWER_FIELD.x1].forEach(x=>{    /* ซุ้มดอกไม้หัว-ท้ายทางเดินกลางทุ่ง */
    const ar = buildFlowerArch();
    ar.position.set(outWX(x), 0, outWZ(FLOWER_FIELD_PATH));
    mergeCollect(ar, parts, chunkKeyOf(x, FLOWER_FIELD_PATH));
  });
  const fsg = buildFieldSign();
  fsg.position.set(outWX(FLOWER_FIELD.x0 + 1) + .15, 0, outWZ(FLOWER_FIELD_PATH - 1) + .2);
  mergeCollect(fsg, parts, chunkKeyOf(FLOWER_FIELD.x0, FLOWER_FIELD.z0));
  flowerTiles().forEach(([x,z],i)=>{
    const fl = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.18,6), toonMat(0x4caf50));
    stem.position.y = .09; fl.add(stem);
    const bl = sphere(.07, [0xff8fb3,0xffd54f,0xb388ff,0xff8a65][i%4], 8); bl.position.y = .2; fl.add(bl);
    fl.position.set(outWX(x)+.22, 0, outWZ(z)-.18);
    mergeCollect(fl, parts, chunkKeyOf(x, z));
    flowerSet.add(x + ',' + z);
  });
  flushMergedParts(parts, worldGroup);
  initStreetLights(worldGroup);                        /* จองดวงไฟจริงตอนเข้าฉากครั้งเดียว */
  refreshStreetLamps(true);      /* เข้าฉากครั้งแรก: ตั้งไฟเสาให้ตรงธีมทันที ไม่ต้อง fade */
}

/* noWild=true → กริดฐานที่ยังไม่รวมของฉากป่า ใช้ตอน relieveWildPinch คำนวณคอขวด (กัน recursion) */
function buildOutGrid(noWild){
  const grid = [];
  for(let z=0; z<OUT_D; z++){
    const row = [];
    for(let x=0; x<OUT_W; x++){
      let t = 0;
      if(isPondTile(x, z) || isSeaTile(x, z)) t = 1;                  /* บ่อน้ำเหนือ + ทะเลใต้-ตะวันออก */
      if(isCanalTile(x, z)) t = isCanalBridgeTile(x, z) ? 2 : 1;      /* คลองส่งน้ำ + สะพานเล็ก */
      if(RIVER_X.includes(x)) t = isBridgeZ(z) ? 2 : 1;
      if(isCropTile(x, z)) t = 3;                                     /* ร่องต้นพืชในแปลงผัก */
      if(x>=HOUSE_FOOT.x0 && x<=HOUSE_FOOT.x1 && z>=HOUSE_FOOT.z0 && z<=HOUSE_FOOT.z1) t = 3;
      if(lotAt(x, z) || inBox(FOUNTAIN, x, z)) t = 3;   /* อาคารในชุมชน + น้ำพุกลางลาน */
      row.push(t);
    }
    grid.push(row);
  }
  /* เฟส 3: ต้นไม้/รั้ว/บ้านสัตว์เลี้ยง ย้ายไปเป็น decor ที่ย้าย/ลบได้ (seed ครั้งแรก) —
     การบล็อกเดินของสิ่งเหล่านี้มาจาก rebuildDecorGrid ไม่ใช่ base grid แล้ว
     เฟส 4: ต้นไม้/พุ่ม/เห็ดนอกกรอบบ้าน + แนวพุ่มขอบบ้าน เป็นฉากตายตัว → บล็อกใน base grid ตรงนี้เลย */
  if(!noWild) wildLayout().forEach(rec=>{
    const item = FURN.byId[rec.id];
    if(!item || item.block===false) return;
    footTiles(item, {x:rec.x, z:rec.z}, rec.rot).forEach(tl=>{
      if(tl.z>=0 && tl.z<OUT_D && tl.x>=0 && tl.x<OUT_W) grid[tl.z][tl.x] = 3;
    });
  });
  /* หุ่นไล่กาในฟาร์ม + ต้นมะพร้าวริมหาด บล็อกทางเดิน (ร่มชายหาดเดินลอดได้ ไม่บล็อก) */
  SCARECROW_TILES.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  if(grid[BEACHED_BOAT.z] && grid[BEACHED_BOAT.z][BEACHED_BOAT.x]===0)
    grid[BEACHED_BOAT.z][BEACHED_BOAT.x] = 3;                    /* เรือเกยหาดบล็อกช่องตัวเอง */
  FISH_RACKS.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  beachPropTiles().forEach(([x,z,kind])=>{
    if((kind==='palm' || kind==='chair') && grid[z] && grid[z][x]===0) grid[z][x] = 3;
  });
  /* เฟส 7: รั้ว/ของในคอก + เวที/เสาธง/ม้านั่ง/รถเข็น บล็อกทางเดิน
     (สัตว์ในคอกเดินไปมาได้ จึงไม่บล็อกช่อง / ท่าไม้กับคนตกปลาอยู่บนผืนน้ำที่บล็อกอยู่แล้ว) */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++)
    if(grid[z][x]===0 && (isPenFenceTile(x, z) || isSchoolFenceTile(x, z) || inBox(STAGE, x, z) || inFlowerBed(x, z)
       || inPool(x, z))) grid[z][x] = 3;
  if(grid[SCHOOL_FLAG.z] && grid[SCHOOL_FLAG.z][SCHOOL_FLAG.x]===0) grid[SCHOOL_FLAG.z][SCHOOL_FLAG.x] = 3;   /* เสาธงหน้าโรงเรียน */
  FARM_PROPS.concat(BANNER_POLES, BENCH_SPOTS, CART_SPOTS, CARPENTER_PROPS, POOL_PROPS)
    .forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  if(!noWild) lampSpots().forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });   /* เสาไฟบล็อกช่องตัวเอง */
  HEDGE_TILES.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });                /* แนวพุ่มไม้เดินทะลุไม่ได้ */
  /* เฟส 8: ชาวบ้านที่ยืนประจำที่ + กระดานภารกิจ บล็อกช่องของตัวเอง
     (ชาวบ้านที่เดินไปมามี roam จึงไม่บล็อก — ดู NPC_TILES) */
  NPC_TILES.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  for(let i=0; i<(QUEST_BOARD.w||1); i++)                                   /* กระดานภารกิจกว้าง 2 ช่อง บล็อกทั้งสองช่อง */
    if(grid[QUEST_BOARD.z] && grid[QUEST_BOARD.z][QUEST_BOARD.x+i]===0) grid[QUEST_BOARD.z][QUEST_BOARD.x+i] = 3;
  /* ปิดช่องหญ้าที่ถูกต้นไม้ล้อมจนเดินเข้าไม่ได้ (เกิดเองได้จากการสุ่มป่า)
     ถ้าปล่อยไว้ เด็กแตะช่องนั้นแล้วตัวละครจะยืนนิ่งเพราะหาทางไม่เจอ
     ปิดเป็น 3 แทน → ระบบจะเลือกช่องข้างเคียงที่เดินถึงให้อัตโนมัติ */
  const seen = grid.map(r=>r.map(()=>false));
  const q = [[SPAWN_TILE.x, SPAWN_TILE.z]];
  seen[SPAWN_TILE.z][SPAWN_TILE.x] = true;
  for(let i=0; i<q.length; i++){
    const [x, z] = q[i];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dz])=>{
      const nx = x+dx, nz = z+dz;
      if(nx<0 || nz<0 || nx>=OUT_W || nz>=OUT_D || seen[nz][nx]) return;
      if(grid[nz][nx] !== 0 && grid[nz][nx] !== 2) return;
      seen[nz][nx] = true; q.push([nx, nz]);
    });
  }
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++)
    if((grid[z][x]===0 || grid[z][x]===2) && !seen[z][x]) grid[z][x] = 3;
  return grid;
}

function buildWorld(){
  worldGroup = new THREE.Group();
  homeZoneFrame = null;         /* กรอบบริเวณบ้านผูกกับ worldGroup ชุดนี้ — สร้างใหม่เมื่อใช้ครั้งแรก */
  outGrid = buildOutGrid();
  outGridBase = cloneGrid(outGrid);

  /* พื้นสไตล์ isometric บล็อกหนา (อ้างอิง house_example/isomatic2d_style_1.png):
     หน้าหญ้าเป็นแผ่นบางด้านบนสลับ 2 เฉด (เขียวอ่อน/เข้ม) + ฐานดินน้ำตาลหนาทั้งผืนให้เห็นขอบข้างเป็นชั้นดิน
     ใช้ BoxGeometry หน้าเรียบ (ไม่ใช่ roundedBox) เพราะ bevel มุมของ roundedBox ทำให้ toon shading
     เกิดเงาสามเหลี่ยมตรงมุมบล็อกทุกช่อง ดูลายตา — หน้าเรียบจะไล่เฉดเรียบทั้งช่อง ไม่มีสามเหลี่ยม */
  const topGeo = new THREE.BoxGeometry(1,.24,1);
  /* ช่องพื้นดินแบ่ง 4 ชนิด: หญ้าสลับ 2 เฉด + หาดทรายสลับ 2 เฉด (แถวติดน้ำเป็นทรายเปียกสีเข้ม) */
  const tileKind = (x,z) => !isSandTile(x,z) ? ((x+z)%2 ? 'g2' : 'g1')
                          : (isWetSandTile(x,z) ? 's3' : ((x+z)%2 ? 's2' : 's1'));
  const counts = {g1:0,g2:0,s1:0,s2:0,s3:0};
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]!==1) counts[tileKind(x,z)]++;
  }
  const grassMat1 = toonMat(0x8fd06c); /* เขียวอ่อน — เรียกก่อนเพื่อให้ gradientMap ถูกสร้างก่อนใช้กับ waterMat */
  const inst = {
    g1: new THREE.InstancedMesh(topGeo, grassMat1, counts.g1),
    g2: new THREE.InstancedMesh(topGeo, toonMat(0x7cc25a), counts.g2), /* เขียวเข้ม */
    s1: new THREE.InstancedMesh(topGeo, toonMat(0xf5e3bb), counts.s1), /* ทรายอ่อน */
    s2: new THREE.InstancedMesh(topGeo, toonMat(0xead2a1), counts.s2), /* ทรายเข้ม */
    s3: new THREE.InstancedMesh(topGeo, toonMat(0xdcc192), counts.s3), /* ทรายเปียกริมน้ำ */
  };
  const idx = {g1:0,g2:0,s1:0,s2:0,s3:0};
  const m4 = new THREE.Matrix4();
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]===1) continue;
    const key = tileKind(x,z);
    m4.makeTranslation(outWX(x), -.12, outWZ(z));
    inst[key].setMatrixAt(idx[key]++, m4);
  }
  Object.values(inst).forEach(im=>{ if(!im.count) return;
    im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows; worldGroup.add(im); });
  /* น้ำเป็นผืนเดียวยาวตลอดคลอง (เดิมเป็นบล็อกต่อช่อง เห็นรอยต่อเป็นตารางไม่เหมือนน้ำ) */
  const waterMat = new THREE.MeshToonMaterial({color:0x6cc6e8, gradientMap, transparent:true, opacity:.9});
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(RIVER_X.length, .14, OUT_D), waterMat);
  waterMesh.position.set(outWX((RIVER_X[0]+RIVER_X[RIVER_X.length-1])/2), -.25, 0);
  worldGroup.add(waterMesh);
  /* บ่อน้ำใหญ่ทิศเหนือ: วงรีแผ่นเดียว (ทำใหญ่กว่าขอบช่องน้ำเล็กน้อย ให้บล็อกหญ้าริมบ่อบังขอบเนียนๆ) */
  const pondGeo = new THREE.CylinderGeometry(1, 1, .14, 40);
  pondGeo.scale(POND.rx + .8, 1, POND.rz + .8);
  const pond = new THREE.Mesh(pondGeo, waterMat);
  pond.position.set(outWX(POND.cx), -.25, outWZ(POND.cz));
  worldGroup.add(pond);
  /* คลองส่งน้ำจากบ่อ → คลองหลัก (ยืดปลายทั้งสองข้างให้ซ้อนบ่อ/คลองหลัก ไม่เห็นรอยต่อ) */
  const canal = new THREE.Mesh(new THREE.BoxGeometry(CANAL_X1 - CANAL_X0 + 4, .14, CANAL_Z.length), waterMat);
  /* ต่ำกว่าผืนอื่นนิดเดียว กันผิวน้ำซ้อนกันแล้วกะพริบ (z-fighting) ตรงรอยต่อบ่อ/คลองหลัก */
  canal.position.set(outWX((CANAL_X0 + CANAL_X1)/2), -.254, outWZ((CANAL_Z[0] + CANAL_Z[CANAL_Z.length-1])/2));
  worldGroup.add(canal);
  /* ทะเลมุมตะวันออกเฉียงใต้: ผืนสี่เหลี่ยมใหญ่ใต้ระดับหญ้า — ชายฝั่งจริงเกิดจากบล็อกทราย/หญ้าที่บังไว้ */
  /* กว้าง/ลึกพอดีขอบแผนที่เป๊ะ (ล้นออกไปจะเห็นผืนน้ำลอยพ้นขอบเกาะ) */
  const seaW = OUT_W - VILLAGE_X0, seaD = SEA_MAX_Z + 1;
  const sea = new THREE.Mesh(new THREE.BoxGeometry(seaW, .14, seaD), waterMat);
  sea.position.set(outWX(VILLAGE_X0 - .5 + seaW/2), -.25, outWZ(SEA_MAX_Z + .5 - seaD/2));
  worldGroup.add(sea);
  const dirtBase = new THREE.Mesh(roundedBoxGeo(OUT_W,.6,OUT_D,.1), toonMat(0x9c6b45));
  dirtBase.position.y = -.54; worldGroup.add(dirtBase);

  /* ถนนหินในชุมชน + ลานกลางชุมชน (แผ่นเดียวต่อช่อง instanced — เดินผ่านได้ ไม่บล็อก) */
  const roadTiles = [], plazaTiles = [], soilTiles = [];
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]===1 || outGrid[z][x]===2) continue;   /* ไม่ปูพื้นทับผิวน้ำ/สะพาน */
    if(farmPlotAt(x,z) || isPenSoilTile(x,z)) soilTiles.push([x,z]);
    else if(isVillageRoadTile(x,z)) roadTiles.push([x,z]);
    else if(isPlazaTile(x,z)) plazaTiles.push([x,z]);
  }
  [[roadTiles, 0xe8d3a9], [plazaTiles, 0xeadfc8], [soilTiles, 0xa9784f]].forEach(([tiles, color])=>{
    if(!tiles.length) return;
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1,.1,1), toonMat(color), tiles.length);
    tiles.forEach(([x,z],i)=>{ m4.makeTranslation(outWX(x), -.02, outWZ(z)); im.setMatrixAt(i, m4); });
    im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows;
    worldGroup.add(im);
  });
  /* ทางเดินทั้งเมืองใช้หน้าตาเดียวกับทางเดินดินในทุ่งดอกไม้: โรยก้อนหินเล็กบนทาง + หญ้าเป็นกอตรงริมทาง
     ทั้งหมดเป็นของตกแต่งนิ่งๆ (instanced เฉยๆ ไม่ใช่ decor ที่กดได้) คลิกทางเดินจึงไม่เกิด effect อะไร
     ตำแหน่งสุ่มจาก fieldRnd(x,z) จึงคงที่ทุกครั้งที่เข้าเกม ไม่กระโดดไปมา */
  if(roadTiles.length){
    const stones = [], tufts = [];
    const isRoad = (x,z)=> x>=0 && z>=0 && x<OUT_W && z<OUT_D && isVillageRoadTile(x,z);
    roadTiles.forEach(([x,z])=>{
      const rnd = fieldRnd(x, z);
      for(let k=0; k<2; k++) stones.push([outWX(x) + (rnd()-.5)*.72, .04, outWZ(z) + (rnd()-.5)*.72]);
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dz])=>{           /* ด้านที่ติดกับพื้นหญ้า = ริมทาง */
        if(isRoad(x+dx, z+dz)) return;
        if(rnd() > .55) return;                                  /* ไม่ต้องมีทุกช่อง จะดูรกเกินไป */
        tufts.push([outWX(x) + dx*.42 + (dz ? (rnd()-.5)*.5 : 0), .04, outWZ(z) + dz*.42 + (dx ? (rnd()-.5)*.5 : 0)]);
      });
    });
    const addInst = (geo, mat, list, sy)=>{
      if(!list.length) return;
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((p,i)=>{ m4.makeTranslation(p[0], p[1], p[2]); if(sy) m4.scale(sy); im.setMatrixAt(i, m4); });
      im.instanceMatrix.needsUpdate = true; worldGroup.add(im);
    };
    addInst(new THREE.CylinderGeometry(.13,.15,.06,7), toonMat(0xf5ead2), stones);
    addInst(new THREE.SphereGeometry(.15,7,5), toonMat(0x8fd06c), tufts, new THREE.Vector3(1,.42,1));
  }

  /* เฟส 3: แผ่นทางเดินหน้าประตู ย้ายไปเป็น decor (seed ใน seedWorldDecor) ที่ย้าย/ลบได้ */

  /* สะพานไม้ข้ามคลอง (2 จุด: เหนือ BRIDGE_Z / ใต้ BRIDGE2_Z) + สะพานเล็กข้ามคลองส่งน้ำในฟาร์ม */
  function makeBridge(){
    const bridge = new THREE.Group();
    const deck = box(2.6,.14,2.2,0xc98d4e); deck.position.set(0,.05,0); deck.receiveShadow = hShadows; bridge.add(deck);
    [-1,1].forEach(s=>{
      const rail = box(2.6,.12,.1,0xa96f35); rail.position.set(0,.42,1.02*s); bridge.add(rail);
      [-1.15,0,1.15].forEach(px=>{ const post = box(.1,.4,.1,0xa96f35); post.position.set(px,.2,1.02*s); bridge.add(post); });
    });
    return bridge;
  }
  BRIDGES.forEach(bz=>{
    const bridge = makeBridge();
    bridge.position.set(outWX((RIVER_X[0]+RIVER_X[RIVER_X.length-1])/2), 0, outWZ((bz[0]+bz[bz.length-1])/2));
    worldGroup.add(bridge);
  });
  const canalBridge = makeBridge();               /* คลองส่งน้ำวิ่งตามแกน x → สะพานหันขวาง 90° */
  canalBridge.rotation.y = Math.PI/2;
  canalBridge.position.set(outWX((CANAL_BRIDGE_X[0]+CANAL_BRIDGE_X[CANAL_BRIDGE_X.length-1])/2), 0,
                           outWZ((CANAL_Z[0]+CANAL_Z[CANAL_Z.length-1])/2));
  worldGroup.add(canalBridge);

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
  house.position.set(outWX((HOUSE_FOOT.x0+HOUSE_FOOT.x1)/2), 0, outWZ((HOUSE_FOOT.z0+HOUSE_FOOT.z1)/2));
  house.userData.hHouse = true;
  worldGroup.add(house);
  houseClickables = [];
  house.traverse(o=>{ if(o.isMesh) houseClickables.push(o); });

  /* เฟส 3: รั้ว/บ้านสัตว์เลี้ยง/ต้นไม้ ย้ายไปเป็น decor ที่ย้าย/ลบได้ (seed ครั้งแรกใน seedWorldDecor)
     — ไม่สร้างตายตัวใน buildWorld อีกต่อไป */

  /* ป่า + ชุมชน (อาคาร/น้ำพุ/ดอกไม้) — ฉากตายตัว รวม geometry เป็นก้อนต่อโซนเพื่อลด draw call
     แตะเล่นได้ผ่าน tapStaticScene (คำนวณช่องจากจุดที่ ray ชน) แต่ย้าย/ลบไม่ได้ */
  buildStaticScenery();

  fountainFx = buildFountainFx();      /* น้ำของน้ำพุ (ขยับได้ จึงไม่รวมกับก้อน merge) */
  worldGroup.add(fountainFx);
  bflySpots = null;                   /* ทุ่งดอกไม้เพิ่งสร้างเสร็จ → สแนปช็อตช่องดอกไม้ใหม่ */
  initButterflies();                  /* ฝูงผีเสื้อที่บินตอมดอกไม้รอบตัวเด็ก */

  collectEdgeTiles();
  scene.add(worldGroup);
}

/* ---------- ฉากในบ้าน ---------- */
function inWX(gx){ return gx - (IN_W-1)/2; }
function inWZ(gz){ return gz - (IN_D-1)/2; }

/* ช่องกำแพงกั้นห้อง (แนวนอน z=IN_WALL_ROW / แนวตั้งครึ่งบน x=IN_COL_TOP ครึ่งล่าง x=IN_COL_BOT เว้นช่องประตู) */
function isInWallTile(x, z){
  if(z===IN_WALL_ROW && !IN_ROW_GAPS.includes(x)) return true;
  if(z<IN_WALL_ROW && x===IN_COL_TOP && !IN_COL_TOP_GAPS.includes(z)) return true;
  if(z>IN_WALL_ROW && x===IN_COL_BOT && !IN_COL_BOT_GAPS.includes(z)) return true;
  return false;
}

function buildInterior(){
  interiorGroup = new THREE.Group();
  inGrid = [];
  for(let z=0; z<IN_D; z++){ inGrid.push(new Array(IN_W).fill(0)); }
  for(let z=0; z<IN_D; z++) for(let x=0; x<IN_W; x++){ if(isInWallTile(x,z)) inGrid[z][x] = 3; }
  inGridBase = cloneGrid(inGrid);

  /* พื้นห้องสลับ 2 เฉด แยกสีตามห้อง (IN_ROOM_FLOORS) ให้เด็กแยกห้องออกด้วยสายตา
     — ใช้ BoxGeometry หน้าเรียบ กันเงาสามเหลี่ยมตรงมุมบล็อก, InstancedMesh คู่อ่อน/เข้มต่อห้อง */
  const tileGeo = new THREE.BoxGeometry(1,.24,1);
  const m4 = new THREE.Matrix4();
  const roomIms = {};
  Object.entries(IN_ROOM_FLOORS).forEach(([rm,[cA,cB]])=>{
    roomIms[rm] = [new THREE.InstancedMesh(tileGeo, toonMat(cA), IN_W*IN_D),
                   new THREE.InstancedMesh(tileGeo, toonMat(cB), IN_W*IN_D), 0, 0];
  });
  for(let z=0; z<IN_D; z++) for(let x=0; x<IN_W; x++){
    m4.makeTranslation(inWX(x), -.12, inWZ(z));
    const r = roomIms[roomOf(x,z)];
    if((x+z)%2){ r[1].setMatrixAt(r[3]++, m4); } else { r[0].setMatrixAt(r[2]++, m4); }
  }
  Object.values(roomIms).forEach(r=>{
    r[0].count = r[2]; r[1].count = r[3];
    [r[0],r[1]].forEach(im=>{ im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows; interiorGroup.add(im); });
  });
  /* ฐานใต้พื้นห้อง ให้เป็นบล็อกหนาแบบเดียวกับข้างนอก */
  const floorBase = new THREE.Mesh(roundedBoxGeo(IN_W,.5,IN_D,.1), toonMat(0x9c6b45));
  floorBase.position.y = -.49; interiorGroup.add(floorBase);

  /* กำแพงกั้นห้องแบบเตี้ย (.95) สไตล์ dollhouse — มองข้ามได้ กล้อง isometric ไม่โดนบังตัวละคร
     รวมช่องติดกันเป็นแท่งเดียวต่อ run ให้ผิวเรียบไม่มีรอยต่อ */
  const partC = 0xfbe3c0, PART_H = 1.15, PART_T = 1.0;   /* ผนังกั้นห้อง = กำแพงจริงเหมือนผนังนอก (สีเดียวกัน เต็มบล็อค) วางของติดผนังได้ */
  const partRuns = [];
  let run = null;                                   /* run แนวนอนบนแถว z=IN_WALL_ROW */
  for(let x=0; x<=IN_W; x++){
    const w = x<IN_W && isInWallTile(x, IN_WALL_ROW);
    if(w && !run) run = {x0:x};
    if(!w && run){ partRuns.push({h:true, x0:run.x0, x1:x-1}); run = null; }
  }
  [IN_COL_TOP, IN_COL_BOT].forEach(cx=>{            /* run แนวตั้ง 2 คอลัมน์ (ครึ่งบน/ครึ่งล่าง) */
    run = null;
    for(let z=0; z<=IN_D; z++){
      const w = z<IN_D && z!==IN_WALL_ROW && isInWallTile(cx, z);
      if(w && !run) run = {z0:z};
      if(!w && run){ partRuns.push({h:false, cx, z0:run.z0, z1:z-1}); run = null; }
    }
  });
  partRuns.forEach(r=>{
    const len = r.h ? (r.x1-r.x0+1) : (r.z1-r.z0+1);
    const wall = box(r.h ? len : PART_T, PART_H, r.h ? PART_T : len, partC, .07);
    wall.position.set(
      r.h ? inWX((r.x0+r.x1)/2) : inWX(r.cx),
      PART_H/2 - .02,
      r.h ? inWZ(IN_WALL_ROW) : inWZ((r.z0+r.z1)/2));
    wall.castShadow = hShadows;
    interiorGroup.add(wall);
  });

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
  /* หน้าต่าง + พรม ให้ห้องไม่โล่งเกินไป (เฟอร์นิเจอร์จริงมาเฟส 3)
     — ผนังหลัง: หน้าต่างห้องนั่งเล่น + ห้องครัว, ผนังซ้าย: หน้าต่างห้องนอน */
  [inWX(6), inWX(16)].forEach(wx=>{
    const win = box(.9,.7,.12,0xaadcf5); win.position.set(wx,1.2,inWZ(0)-.48); interiorGroup.add(win);
  });
  const winBed = box(.12,.7,.9,0xaadcf5); winBed.position.set(inWX(0)-.48,1.2,inWZ(10.5)); interiorGroup.add(winBed);
  /* (เฟส 3) เอาพรมสำเร็จรูปที่ติดมากับบ้านออก — ให้เด็กวาง/ลบพรมเองผ่านโหมดตกแต่ง */

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
/* avoid (optional) = ช่องที่ห้ามเหยียบผ่าน เช่น ช่องที่ตัวเด็กยืนอยู่ตอนหา path ให้สัตว์เลี้ยง */
function findPath(grid, W, D, from, to, avoid){
  if(from.x===to.x && from.z===to.z) return [];
  const prev = new Map(); const seen = new Set([from.z*W+from.x]);
  const q = [from];
  while(q.length){
    const c = q.shift();
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=c.x+dx, nz=c.z+dz, k=nz*W+nx;
      if(!isWalk(grid,W,D,nx,nz) || seen.has(k)) continue;
      if(avoid && nx===avoid.x && nz===avoid.z) continue;
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
const SHADOW_HALF = 12;                 /* ครึ่งกว้างกรอบเงาเริ่มต้น (ปรับตามซูมใน updateShadowCam) */
const LIGHT_DIR = new THREE.Vector3(6,12,4).normalize();   /* ทิศแสงพระอาทิตย์ (คงที่) */
function applyCamera(){
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  if(hMode==='creator' || hMode==='pet'){   /* แผงสัตว์เลี้ยงใช้เฟรมกล้องเดียวกับ creator */
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
    updateShadowCam();
  }
  camera.updateProjectionMatrix();
}
/* กรอบเงาเดินตามกล้อง แทนที่จะเป็นกรอบตายตัวคลุมทั้งแผนที่:
   ของทุกชิ้นที่อยู่ในกรอบเงาจะถูก "วาดซ้ำ" ลง shadow map ทุกเฟรม แผนที่ใหญ่ขึ้นแล้ว
   กรอบตายตัวจึงกลายเป็นตัวถ่วงหลัก (วาดของที่อยู่นอกจอด้วย) — ย่อกรอบให้พอดีสิ่งที่เห็นจริง
   แล้ว snap เป็นช่องจำนวนเต็ม กันเงาสั่นยิบๆ ตอนกล้องขยับทีละนิด */
function updateShadowCam(){
  if(!dirLight || !dirLight.castShadow) return;
  /* คำนวณกรอบให้ "พอดีพื้นที่พื้นดินที่เห็นจริงทั้งจอ" ไม่ใช่เดาจากซูมเฉยๆ
     - แนวนอนของจอ = ทิศ (1,0,-1)/√2 บนพื้น กว้าง halfH*aspect
     - แนวตั้งของจอ = ทิศ (1,0,1)/√2 ยืดตามมุมก้มกล้อง (หาร sin(มุมเงย) = CAM_DIR.y)
     สองแกนนี้เอียง 45° กับแกนโลก → ครึ่งกรอบสี่เหลี่ยมแกนโลกที่คลุมได้ = (a+b)/√2
     บวกเผื่อความสูงของวัตถุ (เงาของต้นไม้ที่อยู่นอกจอนิดหน่อยยังทอดเข้ามาในจอได้) */
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  const halfH = 5.2 / hZoom;
  const half = Math.ceil((halfH*aspect + halfH/CAM_DIR.y) / Math.SQRT2 + 3);
  /* snap ตามขนาด texel ของ shadow map (ไม่ใช่ 1 ช่องตายตัว) กันเงาสั่นยิบๆ ตอนกล้องเลื่อน */
  const texel = (2*half) / dirLight.shadow.mapSize.x;
  const tx = Math.round(camTarget.x/texel)*texel, tz = Math.round(camTarget.z/texel)*texel;
  dirLight.target.position.set(tx, 0, tz);
  dirLight.target.updateMatrixWorld();
  const dist = half + 20;                      /* ถอยไฟออกตามขนาดกรอบ ทิศแสงคงเดิม (6,12,4) */
  dirLight.position.set(tx + LIGHT_DIR.x*dist, LIGHT_DIR.y*dist, tz + LIGHT_DIR.z*dist);
  const sc = dirLight.shadow.camera;
  if(sc.right !== half){
    sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half;
    sc.near = 1; sc.far = 2*dist + 12;         /* ให้ลึกพอคลุมของที่มุมไกลสุดของกรอบ */
    sc.updateProjectionMatrix();
  }
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
  refreshLamps();   /* กลางคืน → เปิดไฟโคม/เสาไฟอัตโนมัติ, กลางวัน → ปิด */
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
/* ขั้นแรกของการเปิดฉาก: renderer + กล้อง + แสง (ยังไม่สร้างโมเดลเมือง)
   แยกเป็นก้อนๆ เพื่อให้ startHouseGame แทรกหน้าจอโหลดคั่นระหว่างแต่ละก้อนได้ */
function initThreeCore(){
  if(hCore) return true;
  const canvas = $('house-canvas');
  try{
    renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias: !isMobileViewport()});
  }catch(e){ return false; }
  hShadows = !isMobileViewport();
  renderer.setClearColor(0x000000, 0);
  /* เพดาน pixel ratio 1.5 ทุกจอ (เดิมเดสก์ท็อป 2) — จอ retina วาดพิกเซลน้อยลง ~44% ภาพลื่นขึ้นชัดเจน
     ฉากเป็นการ์ตูนสีแบน ไม่มีรายละเอียดเล็กๆ จึงแทบไม่เห็นความต่างของความคม */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
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
    /* 1024 พอ (เดิม 2048) — กรอบเงาแคบลงเหลือ ~±12 ช่องตามกล้อง (updateShadowCam) แล้ว
       ความละเอียดต่อช่องยังสูงกว่าเดิมที่คลุมทั้งแผนที่ แต่วาด texel น้อยลง 4 เท่า */
    dirLight.shadow.mapSize.set(1024,1024);
    const sc = dirLight.shadow.camera;
    sc.left = -SHADOW_HALF; sc.right = SHADOW_HALF; sc.top = SHADOW_HALF; sc.bottom = -SHADOW_HALF; sc.far = 60;
    scene.add(dirLight.target);      /* ให้กรอบเงาเลื่อนตามกล้อง (ดู updateShadowCam) */
  }
  scene.add(dirLight);

  hCore = true;
  return true;
}

/* ส่วนท้ายของ initThree — เรียกหลังสร้างฉาก (buildWorld/buildInterior) เสร็จแล้วเท่านั้น */
function initThreeFinish(){
  if(hInit) return;
  /* พื้นที่กลมสำหรับโหมดสร้างตัวละคร */
  creatorGroup = new THREE.Group();
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.45,.22,24), toonMat(0x7cc25a));
  plat.position.y = -.11; plat.receiveShadow = hShadows; creatorGroup.add(plat);
  creatorGroup.visible = false;
  scene.add(creatorGroup);

  /* ธีมกลางวัน/กลางคืนเปลี่ยนได้จากหน้าอื่น — เช็คผ่าน observer ตอน view เปิดอยู่ */
  new MutationObserver(()=>{ if(houseOpen) updateLights(); })
    .observe(document.body, {attributes:true, attributeFilter:['class']});

  window.addEventListener('resize', ()=>{ if(!houseOpen) return; renderer.setSize(window.innerWidth, window.innerHeight); applyCamera(); if(editMode) positionToolbar(); });
  bindCanvasInput($('house-canvas'));
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
    if(hMode==='creator' || hMode==='pet'){ creatorState.dragging = true; creatorState.lastX = e.clientX; }
    if(hMode==='world' && editMode){
      if(pointers.size===2){ editDragCancel(); editPan = null; }   /* เริ่ม pinch → ยกเลิกลาก/แพน */
      else {
        const g = editRaycastDecor(e.clientX, e.clientY);
        if(g){ const r=g.userData.deco.rec; selectDecor(g); editDrag = {group:g, moved:false, lastValid:{x:r.x, z:r.z, rot:r.rot}}; editPan = null; }
        else { editDrag = null; editPanStart(e.clientX, e.clientY); }   /* แตะที่ว่าง → เตรียมแพนกล้อง */
      }
    }
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e=>{
    if(!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(Math.hypot(e.clientX-downX, e.clientY-downY) > 10) moved = true;
    if((hMode==='creator' || hMode==='pet') && creatorState.dragging && pointers.size===1){
      creatorState.rotY += (e.clientX - creatorState.lastX) * .012;
      creatorState.rotTarget = creatorState.rotY;
      creatorState.lastX = e.clientX;
    }
    if(hMode==='world' && editMode && pointers.size===1){
      if(editDrag) editDragMove(e.clientX, e.clientY);
      else if(editPan) editPanMove(e.clientX, e.clientY);
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
    if(hMode==='creator' || hMode==='pet') creatorState.dragging = false;
    if(pointers.size<2) pinchDist = 0;
    if(hMode==='world' && editMode){
      if(editDrag){
        if(editDrag.moved) editDragCommit(); else editDrag = null;
      }else if(!moved && pointers.size===0 && performance.now()-downT < 600){
        if(!editRaycastDecor(e.clientX, e.clientY)) deselectDecor();   /* แตะที่ว่าง → ยกเลิกเลือก */
      }
      editPan = null;
      return;
    }
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
/* เฟส 5: แผนที่ใหญ่ขึ้นอีก แต่จำกัดการซูมออกไว้ที่ .6 (ซูมออกกว่านี้ของจะเล็กจนเด็กแตะพลาด) */
function setZoom(z){ hZoom = Math.min(1.8, Math.max(.85, z)); applyCamera(); }

/* แตะฉากตายตัว (ต้นไม้/พุ่ม/ดอกไม้/อาคารในชุมชน) — geometry ถูกรวมเป็นก้อนต่อโซนแล้ว
   จึงดูว่าแตะโดนอะไรจาก "จุดที่ ray ชน" แล้วแปลงกลับเป็นช่องบนแผนที่ */
function tapStaticScene(pt){
  const gx = Math.round(pt.x + (OUT_W-1)/2), gz = Math.round(pt.z + (OUT_D-1)/2);
  if(gx<0 || gz<0 || gx>=OUT_W || gz>=OUT_D) return;
  if(shakeTreeLeaves(gx, gz)) return;               /* แตะโดนต้นไม้/พุ่ม → ใบไม้ร่วง (ไม่ต้องเดินไป) */
  const seat = seatNear(pt);                        /* ม้านั่ง/เก้าอี้ผ้าใบ → เดินไปนั่งจริง */
  if(seat){ sitOnSeat(seat); return; }
  const lot = lotAt(gx, gz, 1);
  if(lot){
    const d = lotDoorTile(lot);
    const stand = isWalk(outGrid, OUT_W, OUT_D, d.x, d.z) ? d : nearestWalkable(outGrid, OUT_W, OUT_D, d.x, d.z);
    if(stand) walkTo(stand.x, stand.z, {action:{type:'lot', lot,
      pos:new THREE.Vector3(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2))}});
    return;
  }
  const adj = nearestWalkable(outGrid, OUT_W, OUT_D, gx, gz);
  if(adj) walkTo(adj.x, adj.z, {action:{type:'wild', flower:flowerSet.has(gx+','+gz),
    pos:new THREE.Vector3(outWX(gx), 0, outWZ(gz))}});
}

function ndcFromClient(cx, cy){
  return new THREE.Vector2((cx/window.innerWidth)*2-1, -(cy/window.innerHeight)*2+1);
}

function handleTap(cx, cy){
  if(questPanelOpen()){ closeQuestBoard(); return; }   /* แผงภารกิจเปิดอยู่ → แตะจอ = ปิดแผงก่อน */
  raycaster.setFromCamera(ndcFromClient(cx,cy), camera);
  if(hScene==='out'){
    /* ยิง ray ใส่ของทั้งฉากแล้วไล่หา tag ที่ ancestor: สัตว์ > บ้าน > ของตกแต่ง > ฉากตายตัว
       (ชนพื้น/ฐานดินจะไม่เจอ tag แล้วตกไปคำนวณช่องเดินจากระนาบพื้นด้านล่างแทน) */
    const hits = raycaster.intersectObjects(worldGroup.children, true);
    if(hits.length){
      let o = hits[0].object;
      while(o && o !== worldGroup){
        if(o.userData.hPet){ playWithPet(); return; }
        if(o.userData.hCritter){ startleCritter(o.userData.hCritter); return; }
        if(o.userData.hNpc){ tapNpc(o.userData.hNpc); return; }
        if(o.userData.hBoard){ walkToTag(QUEST_BOARD.x, QUEST_BOARD.z, {type:'board'}); return; }
        if(o.userData.hHouse){ walkTo(DOOR_TILE.x, DOOR_TILE.z, {enter:true}); return; }
        if(o.userData.hDecor){ decorInteract(o); return; }
        if(o.userData.hStatic){ tapStaticScene(hits[0].point); return; }
        o = o.parent;
      }
    }
  }else{
    if(hPet.group && raycaster.intersectObject(hPet.group, true).length){ playWithPet(); return; }
    const dg = pickDecorGroup();
    if(dg){ decorInteract(dg); return; }
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
  opts = opts || {};
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
  if(sitState){
    /* ลุกจากที่นั่ง/นอน: สไลด์ออกจากเฟอร์นิเจอร์กลับช่องข้างๆ พร้อมยืดตัวยืนก่อนเริ่มเดิน
       (กันตัวจมทะลุเฟอร์นิเจอร์ที่เกิดจากการดึง y ลงพื้นทันทีขณะยังนอน/เอนอยู่)
       ต้องทำทุกครั้งที่ลุก ไม่ใช่เฉพาะตอนสั่งเดินต่อ — ถ้าลุกอยู่กับที่แล้วข้ามสเต็ปนี้
       ตัวจะถูกดึง y ลงพื้นตรงๆ กลายเป็นจมทะลุม้านั่ง (บั๊กเดิม) */
    if(charGroup){
      hChar.getUpFrom = charGroup.position.clone();
      hChar.getUpTo = tileWorld(hChar.tile);
      hChar.getUpT0 = performance.now();
      hChar.getUpDur = 360;
    }
    endSit();
  }
  if(!hChar.walking){ finishArrive(); }
}

function finishArrive(){
  if(hChar.pendingEnter){ hChar.pendingEnter = false; switchScene('in'); }
  else if(hChar.pendingExit){ hChar.pendingExit = false; switchScene('out'); }
  else if(hChar.action){
    const a = hChar.action; hChar.action = null;
    /* หันหน้าเข้าหาเป้าก่อนเล่นเอฟเฟกต์ (ฉากตายตัวรวม geometry แล้ว ไม่มี group ของตัวเอง → ใช้ a.pos) */
    const ap = a.pos || (a.group && a.group.position);
    if(charGroup && ap){
      hChar.targetRotY = Math.atan2(ap.x - charGroup.position.x, ap.z - charGroup.position.z);
    }
    if(a.type==='wild') rustleWild(a);
    else if(a.type==='lot') greetLot(a);
    else if(a.type==='npc'){ const n = npcs.find(k=>k.def.id===a.npc); if(n) talkToNpc(n); }
    else if(a.type==='board') openQuestBoard();
    else if(a.type==='decor'){
      const g = a.group, item = a.item, act = a.act;
      if(act==='sit' || act==='sleep') startSit(g, item, act);
      else if(act==='toggle') decorToggle(g);
      else if(act==='spin') decorSpin(g);
      else decorBounce(g);
      /* ต้นไม้/พุ่มที่เด็กปลูกเอง: เขย่าแล้วใบร่วงด้วย ให้เหมือนต้นไม้ในป่า
         (ธง leafy/leafyTall อยู่ในคลังเฟอร์นิเจอร์ js/house-furniture.js) */
      if(item.leafy) dropLeaves(g.position, !!item.leafyTall, leafColorOf(item, g.userData.deco.rec.col));
    }
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
    /* สัตว์เลี้ยงตามเข้า/ออกบ้านด้วย: ย้าย group ไปฉากใหม่แล้ววาร์ปมาข้างๆ ตัวเด็ก */
    if(hPet.group){
      petParent().add(hPet.group);
      hPet.tile = tileNearPlayer();
      hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null; hPet.beh = null;
      hPet.group.position.copy(tileWorld(hPet.tile));
      hPet.group.rotation.set(0, hChar.targetRotY, 0);
    }
    updateHomeZoneFrame();     /* กรอบบริเวณบ้านมีเฉพาะฉากนอกบ้าน */
    applyCamera();
  });
}

/* ---------- โหมดสร้างตัวละคร ---------- */
function rebuildChar(cfg){
  const oldRot = charGroup ? charGroup.rotation.y : 0;
  const oldPos = charGroup ? charGroup.position.clone() : null;
  if(charGroup){ scene.remove(charGroup); disposeGroup(charGroup); }
  charGroup = buildCharacter(cfg);
  /* YXZ: yaw (หันหน้าตามเฟอร์นิเจอร์) มาก่อน แล้ว pitch (นอนราบ/เอนโยกชิงช้า) หมุนรอบแกนซ้าย-ขวาของตัวเองเสมอ
     — ไม่งั้น XYZ เดิมทำให้ตอนเฟอร์นิเจอร์หมุนไปทิศอื่น การนอน/โยกเพี้ยนทิศ (นอนกลายเป็นนั่งพิงเอียง) */
  charGroup.rotation.order = 'YXZ';
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
  $('house-pet-btn').hidden = true; $('house-decorate-btn').hidden = true;
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
  $('house-pet-btn').hidden = false; $('house-decorate-btn').hidden = false;
  creatorGroup.visible = false;
  worldGroup.visible = (hScene==='out'); interiorGroup.visible = (hScene==='in');
  rebuildChar(creatorCfg);
  const p = tileWorld(hChar.tile);
  charGroup.position.copy(p);
  charGroup.rotation.y = hChar.targetRotY;
  camTarget.copy(p);
  applyCamera();
  showHint();
  /* ครั้งแรกหลังสร้างตัวละครเสร็จ: ชวนรับเลี้ยงสัตว์ต่อเลย (มีปุ่มข้ามได้ ไม่บังคับ) */
  const d0 = loadHouseData() || {};
  if(!creatorState.fromWorld && !d0.pet && !d0.petPromptSeen){
    saveHouseData({petPromptSeen:true});
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) fadeSwap(()=>openPetPicker()); }, 1200);
  }
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
function spawnParticle(x, y, z, color, parent){
  if(!particleGeo) particleGeo = new THREE.SphereGeometry(.055, 6, 5);
  const m = new THREE.Mesh(particleGeo, toonMat(color));  /* material แชร์จาก cache — animate ที่ scale ไม่แตะ opacity */
  m.position.set(x, y, z);
  const par = parent || worldGroup;       /* หัวใจสัตว์เลี้ยงในบ้านต้องเกาะ interiorGroup */
  par.add(m);
  particles.push({m, parent:par, vx:(Math.random()-.5)*1.1, vy:.6+Math.random()*.7, vz:(Math.random()-.5)*1.1, life:1.1, max:1.1});
}
/* ใบไม้ร่วง: แผ่นบางๆ ร่วงลงช้าๆ ส่ายซ้าย-ขวา หมุนตัวไปด้วย (คนละแบบกับอนุภาคฟุ้งที่พุ่งขึ้นแล้วตก) */
let leafGeo = null;
function spawnLeaf(x, y, z, color){
  if(!leafGeo){ leafGeo = new THREE.SphereGeometry(.09, 6, 5); leafGeo.scale(1, .32, .6); }
  const m = new THREE.Mesh(leafGeo, toonMat(color));
  m.position.set(x, y, z);
  m.rotation.set(Math.random()*3.14, Math.random()*3.14, Math.random()*3.14);
  m.userData.hLeaf = true;                 /* ป้ายไว้ให้เทสนับใบไม้ได้ (แตะโดนใบไม้ = ไม่มี tag ไหนตรง เดินตามปกติ) */
  worldGroup.add(m);
  particles.push({m, parent:worldGroup, leaf:true, t:0,
    vx:(Math.random()-.5)*.5, vy:-(.5+Math.random()*.35), vz:(Math.random()-.5)*.5,
    sway:1.5+Math.random()*1.8, phase:Math.random()*6.28, spin:(Math.random()-.5)*3.4,
    life:2.4+Math.random()*.9, max:2.4});
}
/* ฉากตายตัวถูกรวม geometry เป็นก้อนแล้ว → ขยับตัวมันไม่ได้ ใช้ "อนุภาคฟุ้ง" แทนการเขย่า */
function rustleWild(a){
  const p = a.pos;
  if(a.flower){
    questEvent('flower', Math.round(p.x) + ',' + Math.round(p.z));
    spawnParticle(p.x+.22, .45, p.z-.18, 0xffd54f);
    spawnParticle(p.x+.22, .52, p.z-.18, 0xfff4c2);
    spawnParticle(p.x+.1, .4, p.z-.1, 0xff8fb3);
  }else{
    for(let i=0; i<5; i++){
      spawnParticle(p.x+(Math.random()-.5)*.9, 1.05+Math.random()*.45, p.z+(Math.random()-.5)*.9,
                    i%2 ? 0x66c878 : 0xffffff);
    }
  }
  if(typeof playClick==='function') playClick();
}
/* ---------- แตะต้นไม้: ใบไม้ร่วงเล่นๆ ----------
   ของฉากป่าถูก merge เป็นก้อนเดียวแล้ว หาว่าแตะโดนต้นไหนจาก "ช่อง" ที่ ray ตกลงเอา
   (wildLayout มี cache ตายตัวตลอดเกม จึงทำตารางช่อง→ของ ครั้งเดียวพอ) */
let treeTileMap = null;
function treeTiles(){
  if(treeTileMap) return treeTileMap;
  treeTileMap = new Map();
  wildLayout().forEach(r => treeTileMap.set(r.x + ',' + r.z, r));
  return treeTileMap;
}
/* ของตกแต่งที่ "มีใบไม้" — เขย่าแล้วใบร่วงเหมือนต้นไม้ในป่า
   (เดิมมีแต่ต้นไม้ฉากตายตัวที่ใบร่วง ต้นไม้ที่เด็กปลูกเองแตะแล้วเด้งเฉยๆ ไม่มีใบร่วง
    เด็กเลยงงว่าทำไมกดต้นสนในป่าแล้วมีใบ แต่กดต้นไม้หน้าบ้านแล้วไม่มี — แก้เมื่อ 2026-07-31) */
/* โปรยใบไม้รอบจุดหนึ่ง — ใช้ร่วมกันทั้งต้นไม้ในป่าและต้นไม้ที่เด็กปลูกเอง */
function dropLeaves(p, tall, base){
  for(let i=0; i<(tall ? 9 : 5); i++){
    spawnLeaf(p.x + (Math.random()-.5)*(tall ? 1.5 : .8),
              (tall ? 1.7 + Math.random()*1.1 : .55 + Math.random()*.4),
              p.z + (Math.random()-.5)*(tall ? 1.5 : .8),
              i%3 ? base : 0xffc46b);          /* ใบเขียวสลับใบเหลือง ให้ดูเป็นใบไม้ร่วงจริง */
  }
}
/* สีใบของชิ้นนั้น (ตามสีที่เด็กเลือกไว้) — ไม่มีก็ใช้เขียวมาตรฐาน */
function leafColorOf(item, colIdx){
  const pal = (item && item.colors) || [0x66c878];
  return pal[(colIdx||0) % pal.length];
}
function shakeTreeLeaves(gx, gz){
  const rec = treeTiles().get(gx + ',' + gz);
  if(!rec) return false;
  const item = FURN.byId[rec.id];
  dropLeaves(tileWorld({x:gx, z:gz}), (item && item.leafyTall) || WILD_TALL.includes(rec.id), leafColorOf(item, rec.col));
  if(typeof playClick==='function') playClick();
  return true;
}
/* ไปยืนหน้าอาคารในชุมชน — เฟสถัดไปตรงนี้จะเป็นจุดคุยกับ NPC/รับเควสต์ */
let lotToastAt = 0;
function greetLot(a){
  const p = a.pos;
  for(let i=0; i<4; i++) spawnParticle(p.x+(Math.random()-.5)*1.2, 1.4+Math.random()*.4, p.z+1, 0xfff1a8);
  if(typeof playClick==='function') playClick();
  const now = performance.now();
  if(now - lotToastAt < 2500) return;
  lotToastAt = now;
  if(typeof showToast==='function'){
    const l = a.lot;
    const npc = NPCS.find(n => n.lot === l.id);
    showToast(l.kind==='home' ? '🏠' : (l.kind==='school' ? '🏫' : l.icon),
              npc ? (l.name + ' — ' + npc.name + 'ยืนรออยู่หน้าร้านนะ ไปทักทายกันเลย!')
                  : (l.name + ' — ' + (l.desc || 'เร็วๆ นี้จะมีเพื่อนมาอยู่นะ')));
  }
}

/* ================= ชาวบ้าน: เดินไปคุย + ภารกิจประจำวัน =================
   เดินไปยืนช่องข้างๆ NPC/กระดาน (ตัว NPC บล็อกช่องตัวเองอยู่ → nearestWalkable
   จะคืนช่องข้างเคียงที่เดินถึงให้เอง) แล้วค่อยทักทาย/เปิดกระดานตอนถึงที่ */
function walkToTag(gx, gz, action){
  const t = nearestWalkable(outGrid, OUT_W, OUT_D, gx, gz);
  if(!t) return;
  walkTo(t.x, t.z, {action: Object.assign({pos: tileWorld({x:gx, z:gz})}, action)});
}
function tapNpc(def){
  const n = npcs.find(k => k.def === def); if(!n) return;
  n.hold = 14;   /* คนที่เดินไปมา: ยืนรอให้เด็กเดินมาถึงก่อน จะได้ไม่ต้องวิ่งไล่คุย */
  const gx = Math.round(n.g.position.x + (OUT_W-1)/2), gz = Math.round(n.g.position.z + (OUT_D-1)/2);
  walkToTag(gx, gz, {type:'npc', npc:def.id});
}
/* ---------- ชาวบ้านพูดคุย ----------
   หมายเหตุ: เคยให้ชาวบ้านอ่านออกเสียงประโยคด้วย Web Speech แต่โทนเสียงสังเคราะห์ไม่เข้ากับตัวการ์ตูน
   จึงปิดเสียงพูดของ NPC ทั้งหมด เหลือแค่ฟองคำพูดบนหัว (ห้ามใส่เสียงกลับโดยไม่ถามผู้ใช้ก่อน) */
let npcTalk = null;                        /* {n, until} — ฟองคำพูดที่ลอยอยู่ตอนนี้ */
const _npcV = new THREE.Vector3();
function talkToNpc(n){
  const d = n.def;
  n.faceT = 2.8;                           /* หันหน้ามาหาเด็กชั่วครู่ */
  if(typeof playClick==='function') playClick();
  for(let i=0; i<5; i++)
    spawnParticle(n.g.position.x+(Math.random()-.5)*.9, 1.7+Math.random()*.5,
                  n.g.position.z+.4, i%2 ? 0xfff1a8 : 0xffd54f);
  /* มาสคอตนกฮูกพูดคำให้กำลังใจจากคลังเดียวกับนกฮูกหน้าหลัก (js/owl-messages.js) */
  const say = (d.mascot && typeof OWL_MSGS !== 'undefined' && OWL_MSGS.cheer)
    ? OWL_MSGS.cheer
    : (d.lines || ['สวัสดีจ้ะ!']).concat(d.quest ? [d.quest] : []);
  n.li = (n.li == null ? 0 : (n.li + 1) % say.length);
  const el = $('house-npc-bubble');
  if(el){
    el.innerHTML = '';
    const nm = document.createElement('b'); nm.textContent = (d.icon||'🙂') + ' ' + d.name;
    const tx = document.createElement('span'); tx.textContent = say[n.li];
    el.appendChild(nm); el.appendChild(tx);
    el.classList.add('on');
  }
  /* ประโยคยาวให้ฟองคำพูดค้างนานขึ้น จะได้อ่านทัน */
  npcTalk = {n, until: performance.now() + Math.max(3600, (say[n.li] || '').length * 130)};
  questEvent('talk', d.id);
  if(d.job === 'vendor') questEvent('vendor', d.id);
  if(d.board && QUEST_ENABLED) setTimeout(()=>{ if(!questPanelOpen()) openQuestBoard(); }, 700);
}
function updateNpcLabels(){
  const el = $('house-npc-bubble'); if(!el) return;
  if(!npcTalk || hScene!=='out' || performance.now() > npcTalk.until){
    if(npcTalk){ npcTalk = null; el.classList.remove('on'); }
    return;
  }
  const g = npcTalk.n.g;
  _npcV.set(g.position.x, g.position.y + 2.25, g.position.z).project(camera);
  el.style.left = ((_npcV.x+1)/2*window.innerWidth).toFixed(1) + 'px';
  el.style.top  = ((1-_npcV.y)/2*window.innerHeight).toFixed(1) + 'px';
}

/* ---------- ภารกิจประจำวัน (รับที่กระดานข้างน้ำพุ) ----------
   สุ่ม 3 อย่างต่อวันแบบคงที่ต่อ (เด็กคนนี้ + วันที่นี้) → เปิดกี่ครั้งก็ได้ภารกิจเดิม
   เก็บใน localStorage ก้อนเดียวกับข้อมูลบ้าน (key `quest`) จึง export/import ตามไปด้วย
   **จุดต่อเกม quest ในเฟสถัดไป**: เพิ่มภารกิจชนิดใหม่ที่ QUEST_POOL แล้วเรียก
   questEvent('<kind>', <คีย์กันนับซ้ำ>) จากตรงที่เด็กทำสำเร็จได้เลย */
const QUEST_POOL = [
  {id:'talk3',    icon:'💬',  text:'ทักทายชาวบ้าน 3 คน',           goal:3, kind:'talk'},
  {id:'shop2',    icon:'🛍️', text:'ทักทายแม่ค้าหน้าร้าน 2 คน',    goal:2, kind:'vendor'},
  {id:'sit1',     icon:'🪑',  text:'นั่งพักที่ม้านั่งหรือเก้าอี้',    goal:1, kind:'sit'},
  {id:'pet3',     icon:'🐾',  text:'เล่นกับสัตว์เลี้ยง 3 ครั้ง',     goal:3, kind:'pet'},
  {id:'flower4',  icon:'🌼',  text:'แตะดอกไม้ 4 ดอก',              goal:4, kind:'flower'},
  {id:'critter2', icon:'🦋',  text:'ทักทายสัตว์น้อย 2 ตัว',         goal:2, kind:'critter'},
  {id:'beach',    icon:'🏖️', text:'ไปเที่ยวชายหาด',                goal:1, kind:'zone', zone:'beach'},
  {id:'farm',     icon:'🐄',  text:'ไปดูสัตว์ที่ฟาร์ม',              goal:1, kind:'zone', zone:'farm'},
  {id:'plaza2',   icon:'🎪',  text:'ไปเที่ยวลานกิจกรรม',            goal:1, kind:'zone', zone:'plaza2'},
  {id:'school',   icon:'🏫',  text:'ไปเยี่ยมโรงเรียน',              goal:1, kind:'zone', zone:'school'},
  {id:'pond',     icon:'🎣',  text:'ไปดูบ่อน้ำใหญ่ทางทิศเหนือ',      goal:1, kind:'zone', zone:'pond'},
  {id:'bridge',   icon:'🌉',  text:'เดินข้ามสะพาน',                 goal:1, kind:'zone', zone:'bridge'},
];
const QUEST_BY_ID = {};
QUEST_POOL.forEach(q=>{ QUEST_BY_ID[q.id] = q; });
const QUEST_N = 3;
/* ปิดภารกิจประจำวันไว้ก่อน (กระดานยังตั้งอยู่ แต่ยังไม่มีภารกิจให้ทำ)
   เปิดใช้อีกครั้งได้ด้วยการตั้งเป็น true — โค้ดภารกิจทั้งชุดยังอยู่ครบ */
const QUEST_ENABLED = false;
let quest = null;
function questDayKey(){
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}
function pickDailyQuests(day){
  const s = day + '|' + (activeChild ? activeChild.id : '-');
  let h = 2166136261;
  for(let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  const pool = QUEST_POOL.slice(), out = [];
  for(let k=0; k<QUEST_N && pool.length; k++){
    h = (h * 1103515245 + 12345) >>> 0;
    out.push(pool.splice(h % pool.length, 1)[0].id);
  }
  return out;
}
function initQuest(){
  const data = loadHouseData() || {};
  const q = data.quest || {}, day = questDayKey();
  if(q.d !== day || !(q.ids || []).length){
    quest = {d:day, ids:pickDailyQuests(day), prog:{}, claimed:false, stars:q.stars|0, seen:new Set()};
    saveQuest();
  }else{
    quest = {d:day, ids:q.ids.filter(id=>QUEST_BY_ID[id]), prog:q.prog || {}, claimed:!!q.claimed,
             stars:q.stars|0, seen:new Set(q.seen || [])};
    if(!quest.ids.length){ quest.ids = pickDailyQuests(day); saveQuest(); }
  }
}
function saveQuest(){
  if(!quest) return;
  saveHouseData({quest:{d:quest.d, ids:quest.ids, prog:quest.prog, claimed:quest.claimed,
                        stars:quest.stars, seen:Array.from(quest.seen)}});
}
function questDone(id){ return (quest.prog[id]|0) >= (QUEST_BY_ID[id] ? QUEST_BY_ID[id].goal : 1); }
function questAllDone(){ return !!quest && quest.ids.length > 0 && quest.ids.every(questDone); }
function questAllClaimed(){ return !!quest && !!quest.claimed; }
/* บันทึกความคืบหน้า — key ใช้กันนับซ้ำของชิ้นเดิม (ส่ง null ถ้าให้ทำซ้ำนับได้) */
function questEvent(kind, key){
  if(!QUEST_ENABLED) return;
  if(!quest || quest.claimed) return;
  let changed = false;
  quest.ids.forEach(id=>{
    const q = QUEST_BY_ID[id];
    if(!q || q.kind !== kind || questDone(id)) return;
    if(q.zone && q.zone !== key) return;
    if(key != null){
      const uk = id + ':' + key;
      if(quest.seen.has(uk)) return;
      quest.seen.add(uk);
    }
    quest.prog[id] = (quest.prog[id]|0) + 1;
    changed = true;
    if(questDone(id) && typeof showToast==='function')
      showToast('✅', 'ภารกิจสำเร็จ! ' + q.text + ' — ไปรับดาวที่กระดานได้เลย');
  });
  if(changed){ saveQuest(); renderQuestList(); refreshQuestMark(); }
}
/* โซนบนแผนที่ที่ช่องนี้นับว่า "ไปถึงแล้ว" */
function questZonesAt(x, z){
  const out = [];
  if(isSandTile(x, z)) out.push('beach');
  if(outGrid[z] && outGrid[z][x] === 2) out.push('bridge');
  if(inBox(PLAZA2, x, z)) out.push('plaza2');
  const lt = lotAt(x, z, 1);
  if(lt && lt.id === 'school') out.push('school');
  for(let dz=-2; dz<=2; dz++) for(let dx=-2; dx<=2; dx++){
    if(out.indexOf('farm') < 0 && penAt(x+dx, z+dz)) out.push('farm');
    if(out.indexOf('pond') < 0 && isPondTile(x+dx, z+dz)) out.push('pond');
  }
  return out;
}
let questZoneT = 0;
function checkQuestZone(dt){
  if(!quest || quest.claimed || hScene !== 'out') return;
  questZoneT -= dt;
  if(questZoneT > 0) return;
  questZoneT = .6;
  const x = Math.round(charGroup.position.x + (OUT_W-1)/2), z = Math.round(charGroup.position.z + (OUT_D-1)/2);
  if(x<0 || z<0 || x>=OUT_W || z>=OUT_D) return;
  questZonesAt(x, z).forEach(zn => questEvent('zone', zn));
}
function questPanelOpen(){ const el = $('house-quest'); return !!el && !el.hidden; }
function renderQuestList(){
  const list = $('hq-list'); if(!list || !quest) return;
  list.innerHTML = '';
  quest.ids.forEach(id=>{
    const q = QUEST_BY_ID[id]; if(!q) return;
    const done = questDone(id);
    const row = document.createElement('div');
    row.className = 'hq-row' + (done ? ' done' : '');
    const ic = document.createElement('span'); ic.className = 'hq-ic'; ic.textContent = done ? '✅' : q.icon;
    const tx = document.createElement('span'); tx.className = 'hq-txt'; tx.textContent = q.text;
    const pg = document.createElement('span'); pg.className = 'hq-prog';
    pg.textContent = Math.min(quest.prog[id]|0, q.goal) + '/' + q.goal;
    row.appendChild(ic); row.appendChild(tx); row.appendChild(pg);
    list.appendChild(row);
  });
  const sub = $('hq-sub');
  if(sub) sub.textContent = quest.claimed
    ? 'วันนี้ทำภารกิจครบแล้ว เก่งมาก! พรุ่งนี้มีภารกิจใหม่มาอีกนะ'
    : (questAllDone() ? 'ครบทุกข้อแล้ว! กดรับดาวรางวัลได้เลย'
                      : 'ทำให้ครบทั้ง 3 อย่างวันนี้ แล้วกลับมารับดาวที่กระดานนะ');
  const btn = $('hq-claim');
  if(btn) btn.hidden = !(questAllDone() && !quest.claimed);
  const st = $('hq-stars');
  if(st) st.textContent = '⭐ ดาวสะสม ' + (quest.stars|0) + ' ดวง';
}
function openQuestBoard(){
  if(!QUEST_ENABLED){                                  /* ยังไม่เปิดภารกิจ → บอกให้รอก่อน ไม่เปิดแผง */
    if(typeof playClick==='function') playClick();
    if(typeof showToast==='function') showToast('📜', 'กระดานยังว่างอยู่ เร็วๆ นี้จะมีภารกิจสนุกๆ มาให้ทำนะ!');
    return;
  }
  if(!quest) initQuest();
  renderQuestList();
  const el = $('house-quest'); if(el) el.hidden = false;
  if(typeof playClick==='function') playClick();
}
function closeQuestBoard(){ const el = $('house-quest'); if(el) el.hidden = true; }
function claimQuestReward(){
  if(!quest || quest.claimed || !questAllDone()) return;
  quest.claimed = true;
  quest.stars = (quest.stars|0) + 1;
  saveQuest();
  renderQuestList();
  refreshQuestMark();
  if(questBoardObj) for(let i=0; i<14; i++)
    spawnParticle(questBoardObj.position.x + (Math.random()-.5)*2, 1.8 + Math.random()*1.4,
                  questBoardObj.position.z + .5 + Math.random()*.6,
                  [0xffd54f, 0xff8fb3, 0x7fc4e8, 0xfff1a8][i%4]);
  if(typeof playCongrats==='function') playCongrats();
  else if(typeof playClick==='function') playClick();
  charBubble('⭐');
  if(typeof showToast==='function') showToast('⭐', 'เก่งมาก! ได้ดาวจากภารกิจวันนี้ 1 ดวง');
}
function updateFx(now, dt){
  for(let i=fxList.length-1; i>=0; i--){
    const f = fxList[i];
    const k = (now - f.t0) / f.dur;
    if(k >= 1){
      if(f.kind==='shake') f.g.rotation.z = 0;
      else if(f.kind==='spin'){ if(f.baseRy!=null) f.g.rotation.y = f.baseRy; }
      else f.g.scale.set(1,1,1);
      fxList.splice(i,1); continue;
    }
    if(f.kind==='shake') f.g.rotation.z = Math.sin(k*Math.PI*5)*(1-k)*.14;
    else if(f.kind==='spin'){ if(f.baseRy==null) f.baseRy = f.g.rotation.y; f.g.rotation.y = f.baseRy + k*Math.PI*2; }
    else { const s = 1 + Math.sin(k*Math.PI)*.4; f.g.scale.set(s,s,s); }
  }
  for(let i=particles.length-1; i>=0; i--){
    const p = particles[i];
    p.life -= dt;
    if(p.life <= 0){ (p.parent || worldGroup).remove(p.m); particles.splice(i,1); continue; }
    if(p.leaf){
      p.t += dt;
      p.m.position.x += (p.vx + Math.sin(p.phase + p.t*p.sway)*.6)*dt;
      p.m.position.z += (p.vz + Math.cos(p.phase + p.t*p.sway*.8)*.4)*dt;
      p.m.position.y += p.vy*dt;
      p.m.rotation.z += p.spin*dt; p.m.rotation.x += p.spin*.6*dt;
      if(p.m.position.y <= .06){ p.m.position.y = .06; p.vy = 0; p.spin *= .6; }  /* ถึงพื้นแล้วนอนนิ่ง รอจางหาย */
      const s = Math.min(1, p.life/.7);
      p.m.scale.set(s, s, s);
      continue;
    }
    p.vy -= 3*dt;
    p.m.position.x += p.vx*dt; p.m.position.y += p.vy*dt; p.m.position.z += p.vz*dt;
    if(p.m.position.y < .05) p.m.position.y = .05;
    const s = Math.max(.01, p.life/p.max);
    p.m.scale.set(s,s,s);
  }
}

/* ---------- สัตว์ตัวเล็กเดินเข้า-ออกฉาก (นก/กระต่าย/กระรอก) ให้โลกมีชีวิต ---------- */
const CRITTER_MAX = 8;               /* เฟส 4: แผนที่ 40×30 กว้างขึ้นอีก เพิ่มสัตว์ป่าให้โลกไม่โหวง */
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
/* ---- แหล่งน้ำที่สัตว์น้ำว่ายได้ 3 แบบ: คลองหลัก / บ่อน้ำใหญ่ทิศเหนือ / ทะเลมุมตะวันออกเฉียงใต้ ---- */
function riverWaterRegion(){
  /* ขอบเขตน้ำคำนวณจากตำแหน่งแม่น้ำ/สะพานจริง (อย่า hardcode — แผนที่ขยายแล้วค่าเปลี่ยน)
     แม่น้ำถูกสะพานคั่นเป็นหลายช่วง → สุ่มเลือกช่วงหนึ่งให้ว่ายอยู่ในช่วงนั้น ไม่ลอดใต้สะพาน */
  const wx0 = outWX(RIVER_X[0]) - .35, wx1 = outWX(RIVER_X[RIVER_X.length-1]) + .35;
  const segs = [];   /* [zเริ่ม, zจบ] เป็นช่องกริด */
  let zc = 0;
  BRIDGES.forEach(bz=>{ segs.push([zc, bz[0]-1]); zc = bz[bz.length-1]+1; });
  segs.push([zc, OUT_D-1]);
  const seg = segs[(Math.random()*segs.length)|0];
  const first = seg[0] === 0, last = seg[1] === OUT_D-1;
  return {xmin:wx0, xmax:wx1,
    zmin: outWZ(seg[0]) + (first ? .2 : 1.2),
    zmax: outWZ(seg[1]) - (last ? .2 : 1.2),
    /* ช่วงกลางแม่น้ำไม่มีทางออกนอกจอ ให้โผล่/ดำน้ำหายที่ปลายช่วงแทน */
    exitZ: first ? outWZ(0)-2.5 : (last ? outWZ(OUT_D-1)+2.5 : outWZ(seg[1])-.6)};
}
function pondWaterRegion(){   /* ว่ายวนกลางบ่อ แล้วดำน้ำหายแถวพงกกริมบ่อ */
  return {xmin: outWX(POND.cx - POND.rx*.55), xmax: outWX(POND.cx + POND.rx*.55),
          zmin: outWZ(POND.cz - POND.rz*.55), zmax: outWZ(POND.cz + POND.rz*.55),
          exitZ: outWZ(POND.cz + POND.rz*.8)};
}
function seaWaterRegion(){    /* ทะเลกว้าง — ว่ายเข้ามาจากขอบแผนที่ด้านตะวันออกแล้วออกไปทางเดิม */
  return {xmin: outWX(VILLAGE_X0 + 20), xmax: outWX(OUT_W - 2),
          zmin: outWZ(1), zmax: outWZ(6), exitZ: outWZ(0) - 2.5};
}

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
    const r = Math.random();
    c.water = r < .34 ? pondWaterRegion() : (r < .55 ? seaWaterRegion() : riverWaterRegion());
    const start = new THREE.Vector3(c.water.xmin + Math.random()*(c.water.xmax-c.water.xmin), WATER_Y, c.water.exitZ);
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
  questEvent('critter', null);
  if(typeof playClick==='function') playClick();
  c.startle = .5;                       /* กระโดดตกใจสั้นๆ ก่อนวิ่ง/บิน/ว่ายหนี */
  if(c.type==='fish') c.jump = {k:0};   /* ปลาตกใจ = กระโดดพ้นน้ำ */
  c.state = 'exit';
  critterExitMove(c, true);
}

/* ---------- สัตว์ในคอกฟาร์ม (เดินไปมาในคอกของตัวเอง) ----------
   merge geometry ตัวละ 1 ก้อน (ตัวละ 1 draw call) แล้วขยับทั้งกลุ่ม → ยังลื่นเหมือนของตายตัว */
let penAnimals = [];
function penInnerTiles(pen){
  const out = [];
  for(let x=pen.x0+1; x<=pen.x1-1; x++) for(let z=pen.z0+1; z<=pen.z1-1; z++){
    if(FARM_PROPS.some(p => p[0]===x && p[1]===z)) continue;   /* รางน้ำ/เล้าไก่/ฟาง ไม่เดินทับ */
    out.push({x, z});
  }
  return out;
}
function spawnPenAnimals(){
  penAnimals = [];
  FARM_ANIMALS.forEach(([x,z,kind])=>{
    const g = buildFarmAnimal(kind);
    mergeDecorGroup(g);
    g.children.forEach(m=>{ m.userData.hStatic = true; });     /* แตะโดนแล้วนับเป็นฉาก ไม่ใช่ของวาง */
    g.position.set(outWX(x), 0, outWZ(z));
    g.rotation.y = ((x*3 + z*7) % 4) * Math.PI/2;
    worldGroup.add(g);
    const pen = penAt(x, z);
    penAnimals.push({ g, kind, tiles: pen ? penInnerTiles(pen) : [],
      speed: kind==='chick' ? .62 : (kind==='sheep' ? .4 : .34),
      wait: .5 + Math.random()*4, to: null, bob: Math.random()*6.28, ph: Math.random()*6.28 });
  });
}
function updatePenAnimals(dt, t){
  for(let i=0;i<penAnimals.length;i++){
    const a = penAnimals[i], g = a.g;
    g.rotation.z = Math.sin(t*.0015 + a.ph) * .028;            /* ยืนเคี้ยวหญ้า ส่ายตัวเบาๆ */
    if(a.to){
      const dx = a.to.x - g.position.x, dz = a.to.z - g.position.z;
      const d = Math.hypot(dx, dz);
      if(d < .06){ a.to = null; a.wait = 1.5 + Math.random()*5; g.position.y = 0; continue; }
      const step = Math.min(d, a.speed * dt);
      g.position.x += dx/d * step; g.position.z += dz/d * step;
      let df = Math.atan2(-dz, dx) - g.rotation.y;             /* ตัวสัตว์หันหน้าไป +x ตอน rot 0 */
      while(df >  Math.PI) df -= Math.PI*2;
      while(df < -Math.PI) df += Math.PI*2;
      g.rotation.y += df * Math.min(1, dt*5);
      a.bob += dt * (a.kind==='chick' ? 13 : 8);
      g.position.y = Math.abs(Math.sin(a.bob)) * .07;          /* เดินกระเผาะๆ */
      continue;
    }
    g.position.y = 0;
    a.wait -= dt;
    if(a.wait > 0 || !a.tiles.length) continue;
    for(let k=0;k<8;k++){                                      /* สุ่มจุดใหม่ในคอก เลี่ยงชนตัวอื่น */
      const tl = a.tiles[(Math.random()*a.tiles.length)|0];
      const nx = outWX(tl.x) + (Math.random()-.5)*.5, nz = outWZ(tl.z) + (Math.random()-.5)*.5;
      let clash = false;
      for(let j=0;j<penAnimals.length && !clash;j++){
        if(j===i) continue;
        const o = penAnimals[j], op = o.to || o.g.position;
        if(Math.hypot(nx-op.x, nz-op.z) < .9) clash = true;
      }
      if(!clash || k===7){ a.to = {x:nx, z:nz}; break; }
    }
  }
}

/* ---------- ชาวบ้าน (NPC) + กระดานภารกิจ ----------
   ทุกคน mergeDecorGroup → คนละ 1 draw call (ใส่ได้ ~24 คนโดยเฟรมเรตไม่ตก)
   ตัวกลุ่มติด userData.hNpc ไว้ (ลูกไม่ติด) เพื่อให้ handleTap ไล่ ancestor เจอ */
/* ช่องทั้งหมดที่ "เดินถึงได้จริง" จากจุดเริ่ม (flood fill 4 ทิศบนกริดนอกบ้าน)
   มาสคอตเดินได้ทุกช่องของแผนที่ก็จริง แต่ถ้าสุ่มปลายทางเป็นช่องในรั้วโรงเรียน/ในคอกสัตว์
   ที่เดินเข้าไม่ได้ มันจะหาเส้นทางไม่เจอแล้วยืนรอเป็นพักๆ — กรองออกตั้งแต่แรกทีเดียว */
function reachableTileSet(sx0, sz0){
  const seen = new Set(), q = [[sx0, sz0]];
  seen.add(sx0 + ',' + sz0);
  for(let i=0; i<q.length; i++){
    const [x, z] = q[i];
    for(const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx = x+dx, nz = z+dz, k = nx + ',' + nz;
      if(seen.has(k)) continue;
      if(nx<0 || nz<0 || nx>=OUT_W || nz>=OUT_D) continue;
      if(!isWalk(outGrid, OUT_W, OUT_D, nx, nz)) continue;
      seen.add(k); q.push([nx, nz]);
    }
  }
  return seen;
}

let npcs = [], questBoardObj = null, questMarkObj = null;
let fountainFx = null;      /* กลุ่มน้ำของน้ำพุกลางเมือง (สร้างใน buildWorld) */
function spawnNpcs(){
  npcs = [];
  NPCS.forEach(d=>{
    /* คนที่เดินได้ (roam/route) สร้างแบบมีข้อต่อแขนขา (merge ทีละกลุ่ม ~5 draw call)
       คนที่ยืนประจำที่รวมทุกชิ้นเป็น mesh เดียว = 1 draw call เหมือนเดิม */
    const animated = !!(d.roam || d.route);
    /* มาสคอตนกฮูกใช้โมเดลของตัวเอง (ไม่ใช่คน) แต่ระบบเดิน/คุยใช้ของชาวบ้านทั้งหมด */
    const g = d.mascot ? buildOwlMascot() : buildVillager(d.look || {}, animated);
    if(!animated) mergeDecorGroup(g);
    g.position.set(outWX(d.x), 0, outWZ(d.z));
    g.rotation.y = (d.rot || 0) * Math.PI/2;
    g.userData.hNpc = d;
    worldGroup.add(g);
    const n = { g, def: d, home: {x:g.position.x, z:g.position.z}, baseRot: g.rotation.y,
                ph: Math.random()*6.28, faceT: 0, to: null, wait: 1 + Math.random()*5,
                rig: g.userData.hRig || null, sw: Math.random()*6.28,
                px: g.position.x, pz: g.position.z, stuck: 0,
                speed: d.mascot ? .82 : (d.look && d.look.kid ? .95 : .78) };
    if(d.mascot){ n.owl = g.userData.owl; n.blinkT = 1 + Math.random()*3; n.blinkK = 0; }
    if(d.route){ n.route = d.route; n.rIdx = 1 % d.route.length; n.path = null; n.wait = Math.random()*4; }
    if(d.roam){                                                /* ช่องที่เดินได้ในกรอบเดินเล่น */
      n.tiles = [];
      /* town:true = ไม่มีกรอบ เดินได้ทั่วเมือง → ปลายทางเลือกเฉพาะช่องถนน/ลาน (เครือข่ายเดียวเชื่อมถึงกันทั้งแผนที่
         ถ้าสุ่มทุกช่องที่เดินได้ จะได้ปลายทางกลางป่า/ริมทะเลที่เดินไปแล้วดูเหมือนหลงทาง) */
      /* map:true = เดินได้ทุกช่องที่เดินได้จริงทั้งแผนที่ (มาสคอตนกฮูก — เข้าป่า ริมทะเล ฟาร์ม ได้หมด)
         ต่างจาก town:true ที่จำกัดเฉพาะถนน/ลาน เพราะชาวบ้านเดินกลางป่าแล้วดูเหมือนหลงทาง */
      const full = d.roam.town || d.roam.map;
      const z0 = full ? 0 : d.roam.z0, z1 = full ? OUT_D-1 : d.roam.z1;
      const x0 = full ? 0 : d.roam.x0, x1 = full ? OUT_W-1 : d.roam.x1;
      for(let z=z0; z<=z1; z++) for(let x=x0; x<=x1; x++)
        if(isWalk(outGrid, OUT_W, OUT_D, x, z)
           && !(d.roam.nearShop && isVillageRoadTile(x, z))    /* แม่ค้าเดินอยู่หน้าร้าน ไม่ลงไปกลางถนน */
           && !(d.roam.town && !isVillageRoadTile(x, z) && !isPlazaTile(x, z)))
          n.tiles.push({x, z});
      /* มาสคอต: เก็บเฉพาะช่องที่เดินถึงได้จากจุดที่ยืนอยู่ */
      if(d.roam.map){
        const ok = reachableTileSet(d.x, d.z);
        n.tiles = n.tiles.filter(tl => ok.has(tl.x + ',' + tl.z));
      }
    }
    npcs.push(n);
  });
  /* กระดานภารกิจข้างน้ำพุ */
  questBoardObj = buildQuestBoard();
  mergeDecorGroup(questBoardObj);
  questBoardObj.position.set(outWX(QUEST_BOARD.x + ((QUEST_BOARD.w||1)-1)/2), 0, outWZ(QUEST_BOARD.z));
  questBoardObj.rotation.y = (QUEST_BOARD.rot || 0) * Math.PI/2;
  questBoardObj.userData.hBoard = true;
  worldGroup.add(questBoardObj);
  questMarkObj = buildQuestMark();
  mergeDecorGroup(questMarkObj);
  questMarkObj.position.set(questBoardObj.position.x, 3.3, questBoardObj.position.z);
  questMarkObj.userData.hBoard = true;
  worldGroup.add(questMarkObj);
  refreshQuestMark();
}
/* ดาวเหนือกระดาน: โชว์เมื่อยังมีภารกิจวันนี้ค้างอยู่ / ซ่อนเมื่อรับดาวไปแล้ว */
function refreshQuestMark(){
  if(questMarkObj) questMarkObj.visible = QUEST_ENABLED && !questAllClaimed();
}
/* ขยับ NPC เข้าหาเป้าหมาย n.to พร้อมหันหน้าตามทางเดิน — คืนค่า true ถ้ายังเดินอยู่ */
function stepNpcTo(n, dt){
  const g = n.g, dx = n.to.x - g.position.x, dz = n.to.z - g.position.z, d = Math.hypot(dx, dz);
  if(d < .06){ n.to = null; return false; }
  const st = Math.min(d, n.speed*dt);
  const nx = g.position.x + dx/d*st, nz = g.position.z + dz/d*st;
  /* กันเดินทะลุ: ถ้าก้าวถัดไปตกลงในช่องที่เดินไม่ได้ (ของตกแต่ง/กำแพง/น้ำ) ให้ทิ้งเป้าหมายแล้วหาทางใหม่ */
  if(!isWalk(outGrid, OUT_W, OUT_D, Math.round(nx + (OUT_W-1)/2), Math.round(nz + (OUT_D-1)/2))){
    n.to = null; n.path = null; n.wait = .3 + Math.random()*.6; return false;
  }
  g.position.x = nx; g.position.z = nz;
  let want = Math.atan2(dx, dz), cur = g.rotation.y;      /* หันหน้า (+z) ไปทางที่เดิน */
  while(want - cur > Math.PI) want -= Math.PI*2;
  while(want - cur < -Math.PI) want += Math.PI*2;
  g.rotation.y += (want-cur) * Math.min(1, dt*5);
  return true;
}
/* ---------- กันตัวละครทับกัน ----------
   NPC หลายคนเดินเข้าช่องเดียวกันได้ (roam สุ่มช่อง / route เดินสวนกัน / ยืนคุยกับเด็กพร้อมกัน)
   ทุกเฟรมจึงดันคู่ที่เข้าใกล้กว่า NPC_SEP ให้ห่างออกจากกันเบาๆ แทนที่จะซ้อนทับเป็นตัวเดียว
   — ดันเฉพาะเมื่อช่องปลายทางยังเดินได้ (ไม่ให้ใครถูกดันตกน้ำ/ทะลุกำแพง)
   — คนที่ยืนประจำที่ (ไม่มี route/roam) จำกัดให้ขยับห่างจุดยืนเดิมไม่เกิน NPC_SEP ครึ่งหนึ่ง */
const NPC_SEP = .82, KID_SEP = .78;
function npcNudge(n, dx, dz){
  const x = n.g.position.x + dx, z = n.g.position.z + dz;
  if(!n.route && !n.tiles){                                  /* คนยืนประจำที่: ไม่ให้ลอยห่างจุดเดิม */
    if(Math.hypot(x - n.home.x, z - n.home.z) > NPC_SEP*.5) return false;
  }
  const gx = Math.round(x + (OUT_W-1)/2), gz = Math.round(z + (OUT_D-1)/2);
  if(!isWalk(outGrid, OUT_W, OUT_D, gx, gz)) return false;
  n.g.position.x = x; n.g.position.z = z;
  return true;
}
function separateNpcs(dt){
  const k = Math.min(1, dt*7);
  for(let i=0;i<npcs.length;i++){
    const a = npcs[i];
    for(let j=i+1;j<npcs.length;j++){
      const b = npcs[j];
      let dx = b.g.position.x - a.g.position.x, dz = b.g.position.z - a.g.position.z;
      let d = Math.hypot(dx, dz);
      if(d >= NPC_SEP) continue;
      if(d < 1e-3){ dx = Math.cos(i*2.4); dz = Math.sin(i*2.4); d = 1; }  /* ทับกันสนิท → แยกไปคนละทาง */
      const p = (NPC_SEP - d) * .5 * k, ux = dx/d, uz = dz/d;
      const okA = npcNudge(a, -ux*p, -uz*p), okB = npcNudge(b, ux*p, uz*p);
      /* ถ้าฝั่งไหนถอยไม่ได้ (ติดกำแพง/น้ำ) ให้อีกฝั่งถอยแทนเป็นสองเท่า และถ้าติดทั้งคู่ให้เลี่ยงออกด้านข้าง
         ไม่งั้นสองคนจะดันกันค้างอยู่ที่เดิมจนเดินต่อไม่ได้ */
      if(!okA && okB) npcNudge(b, ux*p, uz*p);
      else if(okA && !okB) npcNudge(a, -ux*p, -uz*p);
      else if(!okA && !okB){ npcNudge(a, -uz*p, ux*p); npcNudge(b, uz*p, -ux*p); }
    }
    /* ไม่ให้ทับตัวเด็กด้วย (ตอนเด็กเดินเข้าไปคุย) — ดันเฉพาะ NPC เด็กไม่ถูกผลัก */
    if(charGroup){
      const dx = a.g.position.x - charGroup.position.x, dz = a.g.position.z - charGroup.position.z;
      const d = Math.hypot(dx, dz);
      if(d < KID_SEP && d > 1e-3) npcNudge(a, dx/d*(KID_SEP-d)*k, dz/d*(KID_SEP-d)*k);
    }
  }
}
/* ช่องเดินได้ที่ใกล้ที่สุดจากพิกัดที่ให้มา (ถ้าช่องนั้นเดินได้อยู่แล้วก็คืนช่องเดิม)
   ใช้กับทั้งช่องที่ชาวบ้านยืนอยู่และช่องปลายทาง — เผื่อช่องนั้นโดนของฉาก/เสาไฟ/ต้นไม้บล็อกทีหลัง
   ถ้าไม่มีตัวช่วยนี้ findPath จะคืนค่าว่างซ้ำๆ ชาวบ้านจะยืนนิ่งนานผิดปกติเหมือนติดค้าง */
function npcWalkTile(x, z, r){
  if(isWalk(outGrid, OUT_W, OUT_D, x, z)) return {x, z};
  const R = r || 3;
  for(let d=1; d<=R; d++)
    for(let dz=-d; dz<=d; dz++) for(let dx=-d; dx<=d; dx++){
      if(Math.max(Math.abs(dx), Math.abs(dz)) !== d) continue;
      if(isWalk(outGrid, OUT_W, OUT_D, x+dx, z+dz)) return {x: x+dx, z: z+dz};
    }
  return null;
}
function updateNpcs(dt, t){
  for(let i=0;i<npcs.length;i++){
    const n = npcs[i], g = n.g;
    g.rotation.z = Math.sin(t*.0016 + n.ph) * .022;            /* ยืนโยกตัวเบาๆ ให้ดูมีชีวิต */
    if(n.hold > 0) n.hold -= dt;                               /* ถูกเด็กเรียกคุย → ยืนรออยู่กับที่ */
    let moving = false;
    if(n.route && !n.faceT && !(n.hold > 0)){                  /* คนเดินทางไกล: เดินตามเส้นทางจริงไปทีละจุดแวะ */
      if(n.to) moving = stepNpcTo(n, dt);
      else if(n.path && n.path.length){
        const tl = n.path.shift();
        n.to = {x: outWX(tl.x), z: outWZ(tl.z)};
      } else {
        n.wait -= dt;
        if(n.wait <= 0){
          const cur = npcWalkTile(Math.round(g.position.x + (OUT_W-1)/2), Math.round(g.position.z + (OUT_D-1)/2));
          const dst = npcWalkTile(n.route[n.rIdx][0], n.route[n.rIdx][1]);
          n.path = (cur && dst) ? (findPath(outGrid, OUT_W, OUT_D, cur, dst) || []) : [];
          n.rIdx = (n.rIdx + 1) % n.route.length;
          if(!n.path.length) n.wait = 2 + Math.random()*3;   /* ไปต่อไม่ได้ → พักแล้วลองจุดถัดไป */
        }
      }
    } else if(n.tiles && n.tiles.length && !n.faceT && !(n.hold > 0)){                 /* คนที่เดินไปมาในกรอบของตัวเอง */
      /* เดินตามเส้นทางจริงทีละช่องเหมือนคนเดินทางไกล (เมื่อก่อนพุ่งตรงไปช่องที่สุ่มได้ เลยเดินทะลุบ้าน/รั้ว/ต้นไม้) */
      if(n.to){
        moving = stepNpcTo(n, dt);
        if(!moving && !(n.path && n.path.length)) n.wait = 1.2 + Math.random()*3.4;   /* พักสั้นลง หมู่บ้านจะได้ดูมีชีวิต ไม่ยืนแข็งนานๆ */   /* ถึงที่หมายแล้ว → ยืนพักก่อนไปที่ใหม่ */
      }
      else if(n.path && n.path.length){
        const tl = n.path.shift();
        const j = n.path.length ? 0 : .4;                      /* เยื้องจากกลางช่องเฉพาะช่องสุดท้าย ไม่ให้ทุกคนยืนตรงกลางช่องเป๊ะ */
        n.to = {x: outWX(tl.x) + (Math.random()-.5)*j, z: outWZ(tl.z) + (Math.random()-.5)*j};
      } else {
        n.wait -= dt;
        if(n.wait <= 0){
          const cur = npcWalkTile(Math.round(g.position.x + (OUT_W-1)/2), Math.round(g.position.z + (OUT_D-1)/2));
          /* สุ่มช่องปลายทางที่ไม่ใช่ช่องที่ยืนอยู่ (ถ้าสุ่มโดนช่องเดิม เส้นทางจะว่าง แล้วยืนรออีกรอบ ดูเหมือนไม่ขยับนานๆ) */
          let spot = n.tiles[(Math.random()*n.tiles.length)|0];
          for(let a=0; a<4 && cur && spot.x===cur.x && spot.z===cur.z; a++) spot = n.tiles[(Math.random()*n.tiles.length)|0];
          const tl = npcWalkTile(spot.x, spot.z);
          n.path = (cur && tl) ? (findPath(outGrid, OUT_W, OUT_D, cur, tl) || []) : [];
          n.wait = n.path.length ? 0 : .6 + Math.random()*1.5;   /* ไปช่องนั้นไม่ได้ → พักแล้วสุ่มช่องใหม่ */
        }
      }
    }
    /* ---- กันเดินชนกันแล้วค้าง: ตั้งใจเดินแต่แทบไม่ขยับติดกันเกิน 1 วินาที (โดนอีกคนดันสวนอยู่)
           → ทิ้งเป้าหมายเดิม พักแป๊บนึงแล้วหาทางใหม่ ---- */
    if(moving){
      const mv = Math.hypot(g.position.x - n.px, g.position.z - n.pz);
      n.stuck = (mv < n.speed*dt*.35) ? n.stuck + dt : 0;
      if(n.stuck > 1){
        n.stuck = 0; n.to = null; n.path = null; n.wait = .4 + Math.random()*.9;
        g.position.x += (Math.random()-.5)*.12; g.position.z += (Math.random()-.5)*.12;
      }
    } else n.stuck = 0;
    n.px = g.position.x; n.pz = g.position.z;
    /* ---- ท่าเดิน: แกว่งขาสลับข้าง แขนแกว่งสวนทาง (สูตรเดียวกับตัวละครเด็ก) ---- */
    if(n.rig){
      const rg = n.rig, k = Math.min(1, dt*8);
      /* แขนข้างที่ถือของ: แกว่งเบากว่าอีกข้าง และไม่เอามาโบกทักทาย (ของจะได้ไม่เหวี่ยงหลุดสายตา) */
      const hi = rg.holdIdx, wave = hi === 1 ? 0 : 1;
      if(n.faceT > 0){                                         /* คุยกับเด็ก → ยกมือทักทายโบกไปมา */
        rg.legs.forEach(p => p.rotation.x += (0 - p.rotation.x) * k);
        rg.arms[1-wave].rotation.x += (0 - rg.arms[1-wave].rotation.x) * k;
        rg.arms[wave].rotation.x += (-2.35 + Math.sin(t*.014)*.3 - rg.arms[wave].rotation.x) * k;
      } else if(moving){
        n.sw += dt * (n.speed * 9.6);                          /* คนเดินเร็วก้าวถี่กว่า */
        const s = Math.sin(n.sw) * .52;
        rg.legs[0].rotation.x = s;    rg.legs[1].rotation.x = -s;
        rg.arms[0].rotation.x = -s*.7 * (hi === 0 ? .42 : 1);
        rg.arms[1].rotation.x =  s*.7 * (hi === 1 ? .42 : 1);
      } else {                                                 /* ยืนเฉยๆ → คลายขากลับตรง แขนแกว่งเบาๆ */
        const idle = Math.sin(t*.0022 + n.ph) * .06;
        rg.legs.forEach(p => p.rotation.x += (0 - p.rotation.x) * k);
        rg.arms[0].rotation.x += ( idle - rg.arms[0].rotation.x) * k;
        rg.arms[1].rotation.x += (-idle - rg.arms[1].rotation.x) * k;
      }
    }
    if(n.owl) updateOwlMascot(n, dt, t, moving);                /* มาสคอตนกฮูก: กระโดด+ขยับปีกแทนแกว่งขา */
    if(n.faceT > 0){                                           /* กำลังคุยกับเด็ก → หันหน้ามาหา */
      n.faceT -= dt;
      const dx = charGroup.position.x - g.position.x, dz = charGroup.position.z - g.position.z;
      let want = Math.atan2(dx, dz), cur = g.rotation.y;
      while(want - cur > Math.PI) want -= Math.PI*2;
      while(want - cur < -Math.PI) want += Math.PI*2;
      g.rotation.y += (want-cur) * Math.min(1, dt*6);
      if(!n.owl) g.position.y = Math.abs(Math.sin(t*.008)) * .06;  /* กระโดดเบาๆ ตอนทักทาย (นกฮูกเด้งเองแล้ว) */
      if(n.faceT <= 0 && !n.tiles) n.faceT = 0;
    } else {
      /* คนมีข้อต่อแล้ว ตัวเด้งน้อยหน่อย (ขาแกว่งช่วยให้ดูเดินอยู่แล้ว) */
      if(!n.owl) g.position.y = moving ? Math.abs(Math.sin(n.rig ? n.sw : t*.009)) * (n.rig ? .04 : .05) : 0;
    }
  }
  separateNpcs(dt);                                            /* ดันคนที่ซ้อนกันให้แยกออก */
  if(questMarkObj && questMarkObj.visible){
    questMarkObj.rotation.y += dt * 1.1;
    questMarkObj.position.y = 3.3 + Math.sin(t*.003) * .14;
  }
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

/* ---------- สัตว์เลี้ยง (เฟส 2) — เลือกเลี้ยง 1 ตัว (ไม่บังคับ) ตั้งชื่อได้ เดินตามตัวละคร
   แตะตัวสัตว์ = เล่นด้วยกัน (กระโดดดีใจ+หัวใจ) ตอนตัวละครหยุด สัตว์จะนั่งคอย/เดินวนใกล้ๆ/
   กระโดดเอง/ส่ง emoji น่ารักๆ สลับกันไป ---------- */
/* แต่ละชนิดมี colors = สีขนที่เลือกได้ (คัดเฉพาะสีที่เหมาะกับสัตว์ชนิดนั้นจริงๆ
   ยกเว้นยูนิคอร์นที่เป็นสัตว์แฟนตาซี ใช้พาสเทลได้อิสระ) — index 0 คือสีดั้งเดิม/default */
const PET_TYPES = [
  {id:'dog',     emoji:'🐶', label:'หมาน้อย',   def:'บราวนี่',  colors:[{c:0xd7a86e,n:'น้ำตาลทอง'},{c:0x8d6e63,n:'ช็อกโกแลต'},{c:0xf3e2c6,n:'ครีม'},{c:0x9aa5ae,n:'เทา'}]},
  {id:'cat',     emoji:'🐱', label:'แมวเหมียว', def:'โมจิ',     colors:[{c:0xffb74d,n:'ส้ม'},{c:0x90a4ae,n:'เทา'},{c:0xfaf3e8,n:'ขาว'},{c:0x5d4b41,n:'น้ำตาลเข้ม'}]},
  {id:'rabbit',  emoji:'🐰', label:'กระต่าย',   def:'ปุยฝ้าย',  colors:[{c:0xf7f3ee,n:'ขาว'},{c:0xcfc4b8,n:'เทา'},{c:0xc4a184,n:'น้ำตาล'},{c:0xf6cdd9,n:'ชมพู'}]},
  {id:'chick',   emoji:'🐥', label:'ลูกเจี๊ยบ',  def:'ไข่หวาน',  colors:[{c:0xffe082,n:'เหลือง'},{c:0xfff6dc,n:'ขาวครีม'},{c:0xffb74d,n:'ส้ม'}]},
  {id:'hamster', emoji:'🐹', label:'แฮมสเตอร์', def:'ข้าวปั้น', colors:[{c:0xffcc80,n:'ส้มครีม'},{c:0xbcaaa4,n:'น้ำตาลเทา'},{c:0xf7ead8,n:'ขาว'}]},
  {id:'turtle',  emoji:'🐢', label:'เต่าน้อย',   def:'เต้าหู้',   colors:[{c:0x66a15c,n:'เขียว'},{c:0x8d6e63,n:'น้ำตาล'},{c:0x4db6ac,n:'เขียวน้ำทะเล'}]},
  {id:'pig',     emoji:'🐷', label:'หมูน้อย',    def:'ชมพู่',    colors:[{c:0xf8a8c0,n:'ชมพู'},{c:0xf5d0b5,n:'ครีม'},{c:0x8a7468,n:'เทาน้ำตาล'}]},
  {id:'sheep',   emoji:'🐑', label:'แกะน้อย',   def:'ปุกปุย',   colors:[{c:0xf5f1e6,n:'ขาว'},{c:0xe8d7b7,n:'ครีม'},{c:0x6f625c,n:'เทาเข้ม'}]},
  {id:'frog',    emoji:'🐸', label:'กบน้อย',    def:'อ๊บอ๊บ',    colors:[{c:0x7cb342,n:'เขียว'},{c:0x4fc3f7,n:'ฟ้า'},{c:0xd4e157,n:'เขียวมะนาว'}]},
  {id:'penguin', emoji:'🐧', label:'เพนกวิน',   def:'พิงกุ',    colors:[{c:0x3d4f5c,n:'กรมท่า'},{c:0x263238,n:'ดำ'},{c:0x7986cb,n:'ม่วงฟ้า'}]},
  {id:'unicorn', emoji:'🦄', label:'ยูนิคอร์น',  def:'สายรุ้ง',   colors:[{c:0xfdfaf2,n:'ขาว'},{c:0xf9c9da,n:'ชมพู'},{c:0xcdbcec,n:'ม่วงอ่อน'},{c:0xbfe3f7,n:'ฟ้าอ่อน'}]},
  {id:'panda',   emoji:'🐼', label:'แพนด้า',    def:'ไผ่หวาน',  colors:[{c:0xf7f3ee,n:'ขาวดำ'},{c:0xe3cfae,n:'น้ำตาลอ่อน'}]},
];
const PET_SPEED = {dog:3.6, cat:3.4, rabbit:3.5, chick:3.1, hamster:3.3, turtle:2.6,
                   pig:3.2, sheep:3.0, frog:3.3, penguin:2.9, unicorn:3.7, panda:2.8};
const PET_SCALE = 1.45;   /* สัตว์เลี้ยงตัวใหญ่กว่าสัตว์ป่าในฉากชัดเจน (โมเดล base ขนาดใกล้กัน) */
const PET_IDLE_EMOJI = ['❤️','⭐','🎵','😊','🦋','💤'];
const hPet = {cfg:null, group:null, tile:null, path:[], seg:0, segT:0, segFrom:null,
              t:0, repathT:0, behT:2.5, beh:null, behK:0, happy:0, happyDur:1, spin:false,
              sitK:0, bubbleTimer:null};

function petTypeInfo(id){ return PET_TYPES.find(p=>p.id===id) || PET_TYPES[0]; }
function curGridInfo(){
  return hScene==='out' ? {grid:outGrid, W:OUT_W, D:OUT_D} : {grid:inGrid, W:IN_W, D:IN_D};
}
function petParent(){ return hScene==='out' ? worldGroup : interiorGroup; }

/* คูณสี rgb ด้วย factor (f<1 เข้มลง, f>1 อ่อนลง) — ใช้ทำสีหู/หาง/เงาขนจากสีขนหลัก
   ให้ทุกสีที่ผู้เล่นเลือกได้ accent ที่เข้ากันอัตโนมัติ */
function petShade(c, f){
  const r = Math.min(255, Math.round(((c>>16)&255)*f)),
        g = Math.min(255, Math.round(((c>>8)&255)*f)),
        b = Math.min(255, Math.round((c&255)*f));
  return (r<<16)|(g<<8)|b;
}
function petColor(type, idx){
  const p = petTypeInfo(type);
  return (p.colors[idx|0] || p.colors[0]).c;
}
/* โมเดลสัตว์เลี้ยงสไตล์เดียวกับ critter (บล็อกมน ไม่มีขา เด้งตามจังหวะ)
   — colIdx = index สีขนใน PET_TYPES[].colors */
function buildPet(type, colIdx){
  const g = new THREE.Group(); const u = {};
  const c = petColor(type, colIdx);
  if(type==='dog'){
    const body = box(.28,.2,.36,c); body.position.y = .16; g.add(body);
    const head = box(.22,.19,.2,c); head.position.set(0,.33,.24); g.add(head);
    const muzzle = box(.1,.07,.05,0xf3e0c2); muzzle.position.set(0,.29,.35); g.add(muzzle);
    const nose = sphere(.022,0x5d4037,6); nose.position.set(0,.315,.37); g.add(nose);
    [-1,1].forEach(s=>{
      const ear = box(.05,.15,.04,petShade(c,.82)); ear.position.set(.105*s,.36,.2); ear.rotation.z = .5*s; g.add(ear);
      const eye = sphere(.02,0x33261d,6); eye.position.set(.06*s,.36,.34); g.add(eye);
    });
    const tail = box(.05,.24,.05,c); tail.rotation.x = -.8; tail.position.set(0,.28,-.2); g.add(tail); u.tail = tail;
  }else if(type==='cat'){
    const body = box(.22,.18,.36,c); body.position.y = .15; g.add(body);
    const head = box(.2,.17,.16,c); head.position.set(0,.32,.2); g.add(head);
    [-1,1].forEach(s=>{ const ear = new THREE.Mesh(new THREE.ConeGeometry(.045,.09,4), toonMat(c));
      ear.castShadow = hShadows; ear.position.set(.07*s,.44,.18); g.add(ear); });
    const tail = box(.05,.3,.05,c); tail.rotation.x = -.6; tail.position.set(0,.26,-.3); g.add(tail); u.tail = tail;
    const muzzle = box(.08,.05,.03,0xfff3e0); muzzle.position.set(0,.28,.285); g.add(muzzle);
    const nose = sphere(.016,0xe57373,6); nose.position.set(0,.31,.29); g.add(nose);
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x2e7d32,6); eye.position.set(.06*s,.34,.285); g.add(eye); });
  }else if(type==='rabbit'){
    const body = box(.26,.2,.32,c); body.position.y = .16; g.add(body);
    const head = box(.2,.18,.18,c); head.position.set(0,.32,.16); g.add(head);
    [-1,1].forEach(s=>{
      const ear = box(.055,.2,.05,c); ear.position.set(.055*s,.5,.13); g.add(ear);
      const inner = box(.025,.12,.02,0xf4b8c8); inner.position.set(.055*s,.49,.156); g.add(inner);
      const eye = sphere(.02,0x33261d,6); eye.position.set(.06*s,.35,.245); g.add(eye);
    });
    const tail = sphere(.07,0xffffff,8); tail.position.set(0,.18,-.18); g.add(tail);
    const nose = sphere(.025,0xf48fb1,6); nose.position.set(0,.31,.26); g.add(nose);
  }else if(type==='chick'){
    const body = sphere(.13,c,10); body.scale.set(1,1.05,1); body.position.y = .15; g.add(body);
    const head = sphere(.1,c,10); head.position.set(0,.32,.05); g.add(head); u.head = head;
    const beak = new THREE.Mesh(new THREE.ConeGeometry(.025,.07,6), toonMat(0xf5a623));
    beak.castShadow = hShadows; beak.rotation.x = Math.PI/2; beak.position.set(0,.31,.16); g.add(beak);
    u.wings = [-1,1].map(s=>{
      const w = box(.04,.09,.12,petShade(c,.92)); w.position.set(.125*s,.16,0); g.add(w); return w;
    });
    [-1,1].forEach(s=>{ const eye = sphere(.018,0x33261d,6); eye.position.set(.05*s,.34,.12); g.add(eye); });
  }else if(type==='hamster'){
    const body = sphere(.16,c,10); body.scale.set(1,.85,1.05); body.position.y = .14; g.add(body);
    [-1,1].forEach(s=>{
      const ear = sphere(.035,petShade(c,.88),6); ear.position.set(.07*s,.28,.05); g.add(ear);
      const cheek = sphere(.045,0xfff3e0,6); cheek.position.set(.078*s,.15,.13); g.add(cheek);
      const eye = sphere(.018,0x33261d,6); eye.position.set(.05*s,.2,.15); g.add(eye);
    });
    const nose = sphere(.018,0xf48fb1,6); nose.position.set(0,.17,.18); g.add(nose);
    const tail = sphere(.03,petShade(c,.88),6); tail.position.set(0,.12,-.16); g.add(tail);
  }else if(type==='turtle'){
    const shell = sphere(.17,c,10); shell.scale.set(1,.62,1.15); shell.position.y = .14; g.add(shell);
    const shellTop = sphere(.12,petShade(c,.76),10); shellTop.scale.set(1,.5,1.1); shellTop.position.y = .2; g.add(shellTop);
    const head = sphere(.07,0x9ccc65,8); head.position.set(0,.13,.24); g.add(head); u.head = head;
    [-1,1].forEach(s=>{ const eye = sphere(.016,0x33261d,6); eye.position.set(.04*s,.16,.29); g.add(eye); });
    [[-.11,.12],[.11,.12],[-.11,-.12],[.11,-.12]].forEach(([lx,lz])=>{
      const leg = box(.06,.05,.08,0x9ccc65); leg.position.set(lx,.04,lz); g.add(leg);
    });
  }else if(type==='pig'){
    const body = box(.3,.22,.36,c); body.position.y = .17; g.add(body);
    const head = box(.24,.2,.16,c); head.position.set(0,.34,.22); g.add(head);
    const snout = box(.11,.08,.05,petShade(c,1.12)); snout.position.set(0,.32,.315); g.add(snout);
    [-1,1].forEach(s=>{
      const nostril = sphere(.012,petShade(c,.6),6); nostril.position.set(.025*s,.32,.345); g.add(nostril);
      const ear = new THREE.Mesh(new THREE.ConeGeometry(.05,.09,4), toonMat(petShade(c,.85)));
      ear.castShadow = hShadows; ear.position.set(.085*s,.47,.2); ear.rotation.z = .25*s; g.add(ear);
      const eye = sphere(.02,0x33261d,6); eye.position.set(.065*s,.38,.305); g.add(eye);
    });
    const tail = sphere(.035,petShade(c,.9),6); tail.position.set(0,.22,-.195); g.add(tail); u.tail = tail;
  }else if(type==='sheep'){
    const body = sphere(.18,c,10); body.scale.set(1,.9,1.15); body.position.y = .18; g.add(body);
    [[-.09,.31,.05],[.09,.31,.05],[0,.33,-.05],[-.08,.29,-.13],[.08,.29,-.13]].forEach(([px,py,pz])=>{
      const puff = sphere(.07,c,8); puff.position.set(px,py,pz); g.add(puff);
    });
    const head = box(.15,.15,.13,0xd9b98c); head.position.set(0,.3,.235); g.add(head); u.head = head;
    [-1,1].forEach(s=>{
      const ear = box(.05,.03,.08,0xcaa87e); ear.position.set(.095*s,.31,.21); g.add(ear);
      const eye = sphere(.018,0x33261d,6); eye.position.set(.045*s,.33,.3); g.add(eye);
    });
    const tail = sphere(.05,c,8); tail.position.set(0,.2,-.21); g.add(tail);
  }else if(type==='frog'){
    const body = sphere(.16,c,10); body.scale.set(1.05,.75,1.1); body.position.y = .13; g.add(body);
    const belly = sphere(.11,0xf3f7dc,8); belly.scale.set(1,.7,.8); belly.position.set(0,.1,.08); g.add(belly);
    [-1,1].forEach(s=>{
      const eb = sphere(.055,c,8); eb.position.set(.08*s,.26,.1); g.add(eb);
      const pupil = sphere(.024,0x33261d,6); pupil.position.set(.08*s,.27,.148); g.add(pupil);
      const cheek = sphere(.02,0xf6a5b6,6); cheek.position.set(.11*s,.13,.15); g.add(cheek);
    });
  }else if(type==='penguin'){
    const body = sphere(.16,c,10); body.scale.set(1,1.25,.95); body.position.y = .2; g.add(body);
    const belly = sphere(.12,0xfdfdf8,10); belly.scale.set(.85,1.05,.6); belly.position.set(0,.17,.09); g.add(belly);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(.03,.08,6), toonMat(0xf5a623));
    beak.castShadow = hShadows; beak.rotation.x = Math.PI/2; beak.position.set(0,.33,.17); g.add(beak);
    u.wings = [-1,1].map(s=>{
      const w = box(.045,.16,.1,petShade(c,.85)); w.position.set(.155*s,.2,0); w.rotation.z = .18*s; g.add(w); return w;
    });
    [-1,1].forEach(s=>{
      const eye = sphere(.02,0xffffff,6); eye.position.set(.05*s,.36,.13); g.add(eye);
      const pupil = sphere(.011,0x33261d,6); pupil.position.set(.05*s,.36,.148); g.add(pupil);
      const foot = box(.06,.03,.09,0xf5a623); foot.position.set(.06*s,.015,.06); g.add(foot);
    });
  }else if(type==='unicorn'){
    const body = box(.26,.2,.4,c); body.position.y = .2; g.add(body);
    const head = box(.16,.18,.16,c); head.position.set(0,.42,.22); g.add(head);
    const muzzle = box(.12,.09,.07,0xf5d2c8); muzzle.position.set(0,.38,.31); g.add(muzzle);
    const horn = new THREE.Mesh(new THREE.ConeGeometry(.028,.13,6), toonMat(0xffd54f));
    horn.castShadow = hShadows; horn.position.set(0,.57,.22); g.add(horn);
    [0xf48fb1,0xba9fe0,0x81d4fa].forEach((mc,i)=>{      /* แผงคอสายรุ้งไล่ติดท้ายทอยหัวลงถึงหลัง */
      const m = box(.055,.12,.09,mc); m.position.set(0,.53-i*.075,.12); g.add(m);
    });
    [-1,1].forEach(s=>{
      const ear = box(.035,.07,.03,c); ear.position.set(.055*s,.53,.18); g.add(ear);
      const eye = sphere(.02,0x33261d,6); eye.position.set(.055*s,.44,.3); g.add(eye);
    });
    const tail = box(.06,.2,.06,0xf48fb1); tail.rotation.x = -.7; tail.position.set(0,.28,-.2); g.add(tail); u.tail = tail;
  }else{ /* panda */
    const body = sphere(.17,c,10); body.scale.set(1,.95,1.1); body.position.y = .17; g.add(body);
    const head = sphere(.13,c,10); head.position.set(0,.38,.1); g.add(head); u.head = head;
    [-1,1].forEach(s=>{
      const ear = sphere(.045,0x3a3a3a,6); ear.position.set(.095*s,.49,.08); g.add(ear);
      const patch = sphere(.035,0x3a3a3a,6); patch.scale.set(1,1.25,.55); patch.position.set(.055*s,.4,.205); g.add(patch);
      const eye = sphere(.014,0xffffff,6); eye.position.set(.055*s,.41,.228); g.add(eye);
      const arm = sphere(.05,0x3a3a3a,6); arm.position.set(.135*s,.2,.08); g.add(arm);
    });
    const nose = sphere(.02,0x3a3a3a,6); nose.position.set(0,.36,.225); g.add(nose);
    const tail = sphere(.04,0x3a3a3a,6); tail.position.set(0,.14,-.195); g.add(tail);
  }
  g.scale.setScalar(PET_SCALE);        /* ตัวใหญ่กว่าสัตว์ป่าในฉาก — ชี้ชัดว่าเป็นสัตว์เลี้ยงของหนู */
  g.userData.hPet = true;              /* tag ที่ group — ancestor walk ตอน raycast เจอแน่ */
  g.userData.anim = u;
  return g;
}

function tileNearPlayer(){
  const {grid,W,D} = curGridInfo();
  const t = hChar.tile;
  for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
    if(isWalk(grid,W,D,t.x+dx,t.z+dz)) return {x:t.x+dx, z:t.z+dz};
  }
  return {x:t.x, z:t.z};
}
function spawnPet(cfg){
  removePetGroup();
  hPet.cfg = cfg;
  hPet.group = buildPet(cfg.type, cfg.color);
  hPet.tile = tileNearPlayer();
  hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null;
  hPet.happy = 0; hPet.spin = false; hPet.sitK = 0; hPet.beh = null;
  hPet.behT = 2 + Math.random()*2; hPet.repathT = 0;
  hPet.group.position.copy(tileWorld(hPet.tile));
  petParent().add(hPet.group);
}
function removePetGroup(){
  if(hPet.group){
    if(hPet.group.parent) hPet.group.parent.remove(hPet.group);
    disposeGroup(hPet.group);
    hPet.group = null;
  }
  hPet.cfg = null;
  const nameEl = $('house-pet-name'), bubEl = $('house-pet-bubble');
  if(nameEl) nameEl.hidden = true;
  if(bubEl) bubEl.classList.remove('on');
}
function petPathTo(target){
  const {grid,W,D} = curGridInfo();
  const t = nearestWalkable(grid, W, D, target.x, target.z);
  if(!t) return false;
  if(t.x===hChar.tile.x && t.z===hChar.tile.z) return false;  /* ห้ามตั้งเป้าไปช่องที่เด็กยืนอยู่ */
  /* กำลังเดินค้างอยู่กลางช่อง: ห้ามรีเซ็ต segment ปัจจุบัน (เดิม repath ทุก .35s แล้ว
     segT=0 ทำให้ตำแหน่งสแนปถอยกลับไปกึ่งกลางช่องล่าสุดทุกครั้ง — ตัวเร็วเดินกระตุก
     ส่วนตัวช้าอย่างเต่า (1 ช่องใช้เวลา > .35s) ไม่เคยเดินจบช่องเลย = ย่ำอยู่กับที่)
     ให้เดินช่องที่ค้างให้จบ แล้วต่อ path ใหม่จากปลายช่องนั้นแทน */
  const midTo = (hPet.path.length && hPet.segT > 0 && hPet.seg < hPet.path.length) ? hPet.path[hPet.seg] : null;
  const startTile = midTo || hPet.tile;
  if(startTile.x===t.x && startTile.z===t.z){
    if(midTo){ hPet.path = [midTo]; hPet.seg = 0; return true; }  /* ช่องค้างคือเป้าหมายพอดี */
    return false;
  }
  const path = findPath(grid, W, D, startTile, t, hChar.tile);  /* เลี่ยงช่องตัวเด็ก ไม่เดินทะลุ/ทับ */
  if(!path || !path.length) return false;
  if(midTo){
    hPet.path = [midTo].concat(path);
    hPet.seg = 0;                       /* segT/segFrom คงเดิม — เดินต่อเนื่องไม่สะดุด */
  }else{
    hPet.path = path; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = {...hPet.tile};
  }
  return true;
}
function petBubble(txt){
  const el = $('house-pet-bubble');
  el.textContent = txt;
  el.classList.remove('on'); void el.offsetWidth;   /* restart pop animation */
  el.classList.add('on');
  clearTimeout(hPet.bubbleTimer);
  hPet.bubbleTimer = setTimeout(()=>el.classList.remove('on'), 1700);
}
function petHappy(dur, spin){
  hPet.happy = dur; hPet.happyDur = dur; hPet.spin = !!spin; hPet.beh = null;
}
/* แตะตัวสัตว์เลี้ยง = เล่นด้วยกัน: หันหน้าเข้าหากัน กระโดดหมุนตัวดีใจ + หัวใจฟุ้ง */
function playWithPet(){
  if(!hPet.group) return;
  questEvent('pet', null);
  if(typeof playClick==='function') playClick();
  hPet.path = [];
  petHappy(1.1, true);
  petBubble(Math.random()<.5 ? '❤️' : '💖');
  if(charGroup){
    hPet.group.rotation.y = Math.atan2(charGroup.position.x-hPet.group.position.x, charGroup.position.z-hPet.group.position.z);
    hChar.targetRotY = Math.atan2(hPet.group.position.x-charGroup.position.x, hPet.group.position.z-charGroup.position.z);
  }
  for(let i=0; i<6; i++){
    spawnParticle(hPet.group.position.x+(Math.random()-.5)*.5, .5+Math.random()*.4,
                  hPet.group.position.z+(Math.random()-.5)*.5, i%2 ? 0xf06292 : 0xff8fb3, petParent());
  }
}

function updatePet(dt){
  if(!hPet.group || hMode!=='world') return;
  hPet.t += dt;
  const u = hPet.group.userData.anim || {};
  const type = hPet.cfg.type;
  let moving = false;

  /* เดินตามตัวละคร: ถ้าเด็กกำลังเดินหรืออยู่ไกลเกิน 2 ช่อง วิ่งไปหาช่องข้างๆ ตัวเด็ก */
  const pTile = hChar.tile;
  const dist = Math.max(Math.abs(pTile.x-hPet.tile.x), Math.abs(pTile.z-hPet.tile.z));
  hPet.repathT -= dt;
  /* dist===0 = เด็กเดินมายืนทับช่องสัตว์พอดี — ให้สัตว์ขยับหลบไปช่องข้างๆ เสมอ */
  const following = hChar.walking || dist > 2 || dist === 0;
  if(following && hPet.repathT <= 0){
    hPet.repathT = .35;
    petPathTo(tileNearPlayer());
    hPet.beh = null;
  }

  if(hPet.path.length && hPet.segT===0 && hPet.path[hPet.seg] &&
     hPet.path[hPet.seg].x===pTile.x && hPet.path[hPet.seg].z===pTile.z){
    hPet.path = [];   /* ช่องถัดไปมีเด็กยืนอยู่ (เด็กเพิ่งเดินมาขวาง path) — หยุดรอ ไม่เดินทับ */
  }
  if(hPet.path.length){
    const from = hPet.segFrom || hPet.tile, to = hPet.path[hPet.seg];
    hPet.segT += dt * (PET_SPEED[type] || 3.3);
    const k = Math.min(1, hPet.segT);
    hPet.group.position.lerpVectors(tileWorld(from), tileWorld(to), k);
    if(from.x!==to.x || from.z!==to.z) hPet.group.rotation.y = Math.atan2(to.x-from.x, to.z-from.z);
    moving = true;
    if(k>=1){
      hPet.segT = 0; hPet.tile = to; hPet.segFrom = to; hPet.seg++;
      if(hPet.seg >= hPet.path.length){ hPet.path = []; hPet.behT = Math.min(hPet.behT, 1.2 + Math.random()*1.5); }
    }
  }else if(!following){
    /* อยู่ใกล้เด็กและเด็กหยุดเดิน: สุ่มพฤติกรรมน่ารักๆ เป็นจังหวะ */
    hPet.behT -= dt;
    if(hPet.behT <= 0){
      const r = Math.random();
      if(r < .3){ hPet.beh = 'sit'; hPet.behK = 2.5 + Math.random()*2; }          /* นั่งคอย */
      else if(r < .55){                                                            /* เดินวนใกล้ๆ ตัวเด็ก */
        hPet.beh = null;
        const {grid,W,D} = curGridInfo();
        for(let i=0; i<8; i++){
          const nx = pTile.x + ((Math.random()*5)|0) - 2, nz = pTile.z + ((Math.random()*5)|0) - 2;
          if((nx!==hPet.tile.x || nz!==hPet.tile.z) && (nx!==pTile.x || nz!==pTile.z) &&
             isWalk(grid,W,D,nx,nz)){ petPathTo({x:nx, z:nz}); break; }
        }
      }
      else if(r < .8){ petHappy(.9, Math.random()<.35); if(Math.random()<.5) petBubble('😊'); } /* กระโดดดีใจ */
      else { hPet.beh = null; petBubble(PET_IDLE_EMOJI[(Math.random()*PET_IDLE_EMOJI.length)|0]); }
      hPet.behT = 3 + Math.random()*3.5;
    }
    if(hPet.beh==='sit'){
      hPet.behK -= dt;
      if(hPet.behK <= 0) hPet.beh = null;
    }
  }

  /* ท่านั่งคอย: เอนตัวตั้งขึ้นนุ่มๆ (เต่า = หดหัวเข้ากระดองแทน น่ารักคนละแบบ) */
  const sitTarget = (hPet.beh==='sit' && !moving) ? 1 : 0;
  hPet.sitK += (sitTarget - hPet.sitK) * Math.min(1, dt*6);
  if(type==='turtle'){
    if(u.head) u.head.scale.setScalar(1 - hPet.sitK*.75);
    hPet.group.rotation.x = 0;
  }else{
    hPet.group.rotation.x = -.42 * hPet.sitK;
  }

  /* เด้งตอนเดินตามชนิด + กระโดดดีใจ (arc เดียวจบ ไม่ค้าง) */
  let y = 0;
  if(moving){
    y = ({dog:.09, cat:.05, rabbit:.14, chick:.07, hamster:.06, turtle:.02,
          pig:.06, sheep:.07, frog:.16, penguin:.04, unicorn:.12, panda:.05})[type] * Math.abs(Math.sin(hPet.t*10));
  }
  /* เพนกวินเดินส่ายตัวซ้ายขวา (waddle) น่ารักสมจริง */
  hPet.group.rotation.z = (type==='penguin' && moving) ? Math.sin(hPet.t*11)*.12 : 0;
  if(hPet.happy > 0){
    hPet.happy -= dt;
    const hk = Math.min(1, 1 - hPet.happy/hPet.happyDur);
    y += Math.sin(hk*Math.PI)*.42;
    if(hPet.spin) hPet.group.rotation.y += dt*9;
    if(hPet.happy <= 0){ hPet.happy = 0; hPet.spin = false; }
  }
  hPet.group.position.y = y + hPet.sitK*.05;
  if(u.tail) u.tail.rotation.z = Math.sin(hPet.t*(moving?12:5))*.3;
  if(u.wings) u.wings.forEach((w,i)=>{ w.rotation.z = (moving || hPet.happy>0) ? Math.sin(hPet.t*18)*.6*(i?1:-1) : 0; });
  if(type==='chick' && u.head && !moving) u.head.rotation.x = Math.max(0, Math.sin(hPet.t*4))*.4; /* จิกพื้นเล่น */
}

/* ป้ายชื่อ + bubble emoji ของสัตว์เลี้ยง (DOM ลอยตามตำแหน่ง 3D แบบเดียวกับชื่อเด็ก) */
const _petV = new THREE.Vector3();
function updatePetLabels(){
  const nameEl = $('house-pet-name'), bubEl = $('house-pet-bubble');
  if(!hPet.group || !houseOpen || hMode!=='world' || editMode){
    nameEl.hidden = true;
    return;
  }
  _petV.set(hPet.group.position.x, hPet.group.position.y + 1.05, hPet.group.position.z).project(camera);  /* สูงขึ้นตาม PET_SCALE (ยูนิคอร์นมีเขาสูงสุด) */
  const px = (_petV.x+1)/2*window.innerWidth, py = (1-_petV.y)/2*window.innerHeight;
  nameEl.style.left = px.toFixed(1)+'px';
  nameEl.style.top = py.toFixed(1)+'px';
  nameEl.textContent = '🐾 ' + hPet.cfg.name;
  nameEl.hidden = false;
  bubEl.style.left = px.toFixed(1)+'px';
  bubEl.style.top = (py-28).toFixed(1)+'px';
}

/* ---------- แผงเลือกสัตว์เลี้ยง (hMode 'pet') — reuse แท่นกลม/กล้อง/ปุ่มหมุนของ creator ---------- */
let petPreview = null, petPickerType = null, petPickerColor = 0, petNameDirty = false;
function rebuildPetPreview(){
  if(petPreview){ scene.remove(petPreview); disposeGroup(petPreview); }
  petPreview = buildPet(petPickerType, petPickerColor);
  petPreview.scale.setScalar(3);          /* สัตว์ตัวจิ๋ว ขยายให้เต็มเฟรมพรีวิวพอๆ ตัวละคร */
  petPreview.rotation.y = creatorState.rotY;
  scene.add(petPreview);
}
function buildPetColorChips(){
  const wrap = $('house-pet-colors');
  wrap.innerHTML = '';
  petTypeInfo(petPickerType).colors.forEach((col,i)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house-chip house-chip-color' + (i===petPickerColor ? ' active' : '');
    b.style.background = '#'+col.c.toString(16).padStart(6,'0');
    b.setAttribute('aria-label', 'สี'+col.n);
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      petPickerColor = i;
      wrap.querySelectorAll('.house-chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      rebuildPetPreview();
    });
    wrap.appendChild(b);
  });
}
function buildPetChips(){
  const wrap = $('house-pet-chips');
  wrap.innerHTML = '';
  PET_TYPES.forEach(p=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house-chip house-pet-chip' + (p.id===petPickerType ? ' active' : '');
    b.innerHTML = '<span class="house-pet-chip-emoji">'+p.emoji+'</span><span class="house-pet-chip-name">'+p.label+'</span>';
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      petPickerType = p.id;
      petPickerColor = 0;                 /* เปลี่ยนชนิด = กลับสีดั้งเดิมของชนิดนั้น */
      wrap.querySelectorAll('.house-chip').forEach(c=>c.classList.remove('active'));
      b.classList.add('active');
      if(!petNameDirty) $('house-pet-name-input').value = p.def;
      buildPetColorChips();
      rebuildPetPreview();
    });
    wrap.appendChild(b);
  });
}
function openPetPicker(){
  if(editMode) return;   /* กันแผงสัตว์เลี้ยงเด้งทับตอนกำลังตกแต่ง */
  hMode = 'pet';
  creatorState.rotY = 0; creatorState.rotTarget = 0;
  const data = loadHouseData() || {};
  petPickerType = (data.pet && data.pet.type) || 'dog';
  petPickerColor = (data.pet && data.pet.color) || 0;   /* save เก่าไม่มี color = 0 (สีดั้งเดิม) */
  petNameDirty = !!data.pet;              /* มีชื่อเดิมอยู่ = อย่าเขียนทับตอนสลับชนิด */
  $('house-pet-name-input').value = data.pet ? data.pet.name : petTypeInfo(petPickerType).def;
  $('house-pet-picker').hidden = false;
  $('house-rotate-wrap').hidden = false;
  $('house-edit-btn').hidden = true;
  $('house-pet-btn').hidden = true; $('house-decorate-btn').hidden = true;
  $('house-hint').hidden = true;
  $('house-pet-remove').hidden = !data.pet;
  $('house-pet-done').textContent = data.pet ? 'บันทึกเลย 💕' : 'รับเลี้ยงเลย 💕';
  worldGroup.visible = false; interiorGroup.visible = false;
  creatorGroup.visible = true;
  if(charGroup) charGroup.visible = false;
  buildPetChips();
  buildPetColorChips();
  rebuildPetPreview();
  applyCamera();
}
function closePetPicker(kind){
  if(kind==='adopt'){
    const name = ($('house-pet-name-input').value || '').trim().slice(0,14) || petTypeInfo(petPickerType).def;
    saveHouseData({pet:{type:petPickerType, name, color:petPickerColor}});
  }else if(kind==='remove'){
    saveHouseData({pet:null});
  }
  hMode = 'world';
  $('house-pet-picker').hidden = true;
  $('house-rotate-wrap').hidden = true;
  $('house-edit-btn').hidden = false;
  $('house-pet-btn').hidden = false; $('house-decorate-btn').hidden = false;
  creatorGroup.visible = false;
  if(petPreview){ scene.remove(petPreview); disposeGroup(petPreview); petPreview = null; }
  worldGroup.visible = (hScene==='out'); interiorGroup.visible = (hScene==='in');
  if(charGroup) charGroup.visible = true;
  const data = loadHouseData() || {};
  if(kind==='adopt'){
    spawnPet(data.pet);
    if(typeof showToast==='function') showToast('🐾', data.pet.name+' มาอยู่กับหนูแล้ว! แตะตัวน้อยๆ เพื่อเล่นด้วยกันนะ');
    setTimeout(()=>{ if(hPet.group && houseOpen) petBubble('❤️'); }, 800);
  }else if(kind==='remove'){
    removePetGroup();
    if(typeof showToast==='function') showToast('🌿', 'ส่งเพื่อนตัวน้อยกลับธรรมชาติแล้ว');
  }
  if(charGroup){ camTarget.copy(charGroup.position); }
  applyCamera();
}

/* ---------- ป้ายชื่อตัวละคร (ชื่อเด็ก) ลอยเหนือหัว ---------- */
const _nameV = new THREE.Vector3();
const _swingV = new THREE.Vector3();   /* ตำแหน่งที่นั่งชิงช้าตอนแกว่ง (reuse) */
function updateNameLabel(){
  const el = $('house-char-name');
  if(!charGroup || !houseOpen || !charGroup.visible){ el.hidden = true; return; }
  _nameV.set(charGroup.position.x, charGroup.position.y + 2.05, charGroup.position.z).project(camera);
  const lx = ((_nameV.x+1)/2*window.innerWidth).toFixed(1)+'px';
  const ty = ((1-_nameV.y)/2*window.innerHeight).toFixed(1)+'px';
  el.style.left = lx; el.style.top = ty;
  el.hidden = false;
  /* ฟองอีโมจิเหนือหัวตอน interaction (นั่ง/เล่นของ) */
  const hb = $('house-char-bubble');
  if(hb && hb.classList.contains('on')){
    _nameV.set(charGroup.position.x, charGroup.position.y + 2.75, charGroup.position.z).project(camera);
    hb.style.left = ((_nameV.x+1)/2*window.innerWidth).toFixed(1)+'px';
    hb.style.top = ((1-_nameV.y)/2*window.innerHeight).toFixed(1)+'px';
  }
}

/* ---------- เข็มทิศ (ชี้ทางกลับบ้าน) ---------- */
const _compV = new THREE.Vector3(), _compV2 = new THREE.Vector3();
function homeSpotV(){   /* กลางตัวบ้าน — จุดที่เข็มชี้ */
  return new THREE.Vector3(outWX((HOUSE_FOOT.x0+HOUSE_FOOT.x1)/2), 1, outWZ((HOUSE_FOOT.z0+HOUSE_FOOT.z1)/2));
}
/* ทิศประจำแผนที่ (ยึดตามนี้ทั้งเกม): หลังบ้าน = ตะวันออก (-z), หน้าบ้าน = ตะวันตก (+z),
   ฝั่งชุมชน = ใต้ (+x), ฝั่งตรงข้ามชุมชนติดตัวบ้าน = เหนือ (-x) */
const COMPASS_DIRS = [['hc-n',-1,0], ['hc-e',0,-1], ['hc-s',1,0], ['hc-w',0,1]];
let compassDialDone = false;
function layoutCompassDial(){
  /* วางตัวอักษรทิศตามมุมจริงบนหน้าจอของแกนโลก (กล้องไอโซเมตริกไม่หมุน จึงคำนวณครั้งเดียวพอ) */
  const o = _compV.set(camTarget.x, 0, camTarget.z).project(camera).clone();
  const R = 21.5;
  COMPASS_DIRS.forEach(([id, dx, dz])=>{
    const el = document.getElementById(id); if(!el) return;
    _compV2.set(camTarget.x + dx*6, 0, camTarget.z + dz*6).project(camera);
    const sx = (_compV2.x - o.x) * window.innerWidth, sy = (o.y - _compV2.y) * window.innerHeight;
    const a = Math.atan2(sx, -sy);
    el.setAttribute('x', (32 + R*Math.sin(a)).toFixed(2));
    el.setAttribute('y', (32 - R*Math.cos(a)).toFixed(2));
  });
  compassDialDone = true;
}
function updateCompass(){
  const btn = $('house-compass');
  if(!btn) return;
  /* โชว์เฉพาะตอนเดินเล่นนอกบ้าน (ไม่โชว์ตอนสร้างตัวละคร/อยู่ในบ้าน/โหมดตกแต่ง) */
  const show = houseOpen && hMode==='world' && hScene==='out' && !editMode && charGroup;
  if(!show){ btn.hidden = true; return; }
  btn.hidden = false;
  if(!compassDialDone) layoutCompassDial();
  /* มุมบนหน้าจอจริง: project ทั้งตัวละครและบ้าน แล้ววัดมุมระหว่างสองจุด
     (กล้องเป็นไอโซเมตริกเอียง 45° — ถ้าใช้มุมในโลกตรงๆ เข็มจะชี้เพี้ยนจากที่ตาเห็น) */
  _compV.copy(charGroup.position).project(camera);
  _compV2.copy(homeSpotV()).project(camera);
  const dx = (_compV2.x - _compV.x) * window.innerWidth;
  const dy = (_compV.y - _compV2.y) * window.innerHeight;   /* y ของจอกลับด้านกับ NDC */
  const deg = Math.atan2(dx, -dy) * 180 / Math.PI;
  const needle = document.getElementById('hc-needle'), home = document.getElementById('hc-home');
  if(needle) needle.setAttribute('transform', 'rotate(' + deg.toFixed(1) + ' 32 32)');
  if(home) home.setAttribute('transform', 'rotate(' + (-deg).toFixed(1) + ' 32 19.2)');
}
/* ป้ายพิกัดมุมขวาล่าง — บอกช่องที่ตัวละครยืนอยู่ (ไว้ดูตำแหน่งตอนทดสอบแผนที่)
   อัปเดตเฉพาะตอนเปลี่ยนช่องจริงๆ ไม่แตะ DOM ทุกเฟรม */
let posChipKey = '';
function updatePosChip(){
  const el = $('house-pos-chip');
  if(!el) return;
  const show = houseOpen && hMode==='world' && !editMode && charGroup && hChar && hChar.tile;
  if(!show){ if(!el.hidden){ el.hidden = true; posChipKey = ''; } return; }
  const key = hScene + ':' + hChar.tile.x + ',' + hChar.tile.z;
  if(key === posChipKey){ el.hidden = false; return; }
  posChipKey = key;
  el.textContent = (hScene==='out' ? '📍 ' : '🏠 ') + 'x' + hChar.tile.x + ' z' + hChar.tile.z;
  el.hidden = false;
}
function compassGoHome(){
  if(typeof playClick==='function') playClick();
  if(hScene!=='out' || !hChar) return;
  /* จุดจอด = ช่องหน้าประตูเว้น 1 ช่อง (ช่องเดียวกับตอนเดินออกมาจากในบ้าน) */
  const t = nearestWalkable(outGrid, OUT_W, OUT_D, DOOR_TILE.x, DOOR_TILE.z + 1);
  if(!t) return;
  if(hChar.tile && hChar.tile.x===t.x && hChar.tile.z===t.z){
    if(typeof showToast==='function') showToast('🏠 หนูอยู่ที่บ้านแล้วนะ');
    return;
  }
  walkTo(t.x, t.z);
  if(typeof showToast==='function') showToast('🏠 กลับบ้านกันเถอะ!');
}

/* ============================================================
   เฟส 3 — ระบบตกแต่งบ้าน (คลังของ + วาง/ลาก/หมุน + interaction)
   ============================================================ */
function cloneGrid(g){ return g.map(r=>r.slice()); }
function decorKit(){ return {THREE, box, ball:sphere, cyl, cone, torus, mat:toonMat, shade:petShade}; }
function itemFootprint(item, rot){ const w=item.fw||1, d=item.fd||1; return (rot%2) ? {w:d, d:w} : {w, d}; }
function footTiles(item, anchor, rot){
  const f = itemFootprint(item, rot), out = [];
  for(let dz=0; dz<f.d; dz++) for(let dx=0; dx<f.w; dx++) out.push({x:anchor.x+dx, z:anchor.z+dz});
  return out;
}
function decorWorldPos(sc, item, anchor, rot){
  const f = itemFootprint(item, rot);
  const cx = anchor.x + (f.w-1)/2, cz = anchor.z + (f.d-1)/2;
  return sc==='out' ? new THREE.Vector3(outWX(cx),0,outWZ(cz)) : new THREE.Vector3(inWX(cx),0,inWZ(cz));
}
/* วางได้ไหม: in-bounds + พื้นเดินได้ (base) + ไม่ทับประตู + ไม่ทับชิ้น block อื่น */
function decorCanPlace(sc, item, anchor, rot, ignoreRec){
  const base = sc==='out' ? outGridBase : inGridBase;
  const W = sc==='out' ? OUT_W : IN_W, D = sc==='out' ? OUT_D : IN_D;
  const tiles = footTiles(item, anchor, rot);
  for(const tl of tiles){
    if(tl.x<0 || tl.z<0 || tl.x>=W || tl.z>=D) return false;
    /* เฟส 4: นอกบ้านวางได้แค่ในกรอบบริเวณบ้าน (ไม่ข้ามคลอง/สะพาน ไม่ล้นไปป่า-หมู่บ้าน NPC) */
    if(sc==='out' && !inHomeZone(tl.x, tl.z)) return false;
    const bv = base[tl.z][tl.x];
    if(bv===1 || bv===3) return false;   /* น้ำ/บล็อก(ต้นไม้/บ้าน/รั้ว/กำแพง) */
    /* ห้ามเฉพาะของที่บล็อกทางเดิน วางทับช่องประตู/ประตูรั้ว — ของเดินผ่านได้ (แผ่นทางเดิน/พรม) วางได้ */
    if(item.block!==false){
      /* ทางเดินหินจากประตูบ้านออกช่องรั้ว ต้องโล่งทั้งแนว ไม่งั้นวางของปิดแล้วออกจากสนามไม่ได้ + บังหน้าบ้าน */
      if(sc==='out' && tl.x===DOOR_TILE.x && tl.z>=DOOR_TILE.z && tl.z<=GATE_TILE.z) return false;
      if(sc==='in'  && tl.x===IN_DOOR_TILE.x && tl.z<=1) return false;
      /* กันปิดทางออกจากบริเวณบ้าน: ช่องแนวพุ่มไปป่า + ปลายสะพานฝั่งบ้าน */
      if(sc==='out' && HOME_EXIT_X.includes(tl.x) && tl.z===HOME_ZONE.z1) return false;
      if(sc==='out' && tl.x===HOME_ZONE.x1 && BRIDGE_Z.includes(tl.z)) return false;
    }
  }
  /* ชิ้น stack (เช่นโคมไฟตั้งโต๊ะ) วางทับของอื่นได้ (ไปนั่งบนผิว) — ข้ามเช็คทับ */
  if(item.block!==false && !item.stack){
    for(const g of decorGroups[sc]){
      const r = g.userData.deco.rec; if(r===ignoreRec) continue;
      const it = g.userData.deco.item; if(it.block===false || it.stack) continue;
      const oth = footTiles(it, {x:r.x,z:r.z}, r.rot);
      for(const a of tiles) for(const b of oth) if(a.x===b.x && a.z===b.z) return false;
    }
  }
  return true;
}
function buildDecorGroup(sc, rec){
  const item = FURN.byId[rec.id]; if(!item) return null;
  const g = new THREE.Group();
  const pal = item.colors || [0xcccccc];
  const col = pal[(rec.col||0) % pal.length];
  try { item.build(g, col, decorKit(), rec); } catch(err){ console.error('decor build', rec.id, err); }
  if(!item.rock && !item.light) mergeDecorGroup(g);   /* ยุบชิ้นส่วนย่อยให้เหลือ mesh เดียว (ยังลาก/หมุนได้เหมือนเดิม) */
  if(item.wall){   /* วัดขอบหลังชิ้น (local -z) ไว้ snap แนบผนังพอดีทุกความลึก */
    const bb = new THREE.Box3().setFromObject(g);
    g.userData.localMinZ = isFinite(bb.min.z) ? bb.min.z : 0;
  }
  applyRecToGroup2(g, sc, item, rec);
  if(item.rock){   /* ชิงช้า: เก็บ pivot + จุดที่นั่ง ไว้ใช้ตอนโยก */
    g.traverse(o=>{ if(o.userData.swingPivot) g.userData.swingPiv = o; if(o.userData.swingSeat) g.userData.swingSeat = o; });
  }
  if(item.light) setupLamp(g, item);   /* โคมไฟ/เสาไฟ/กองไฟ: สร้าง PointLight + หลอดเรืองแสง เปิด/ปิดได้ */
  g.userData.deco = {rec, item, scene:sc};
  g.userData.hDecor = g.userData.deco;
  return g;
}
function applyRecToGroup2(g, sc, item, rec){
  g.position.copy(decorWorldPos(sc, item, {x:rec.x,z:rec.z}, rec.rot||0));
  g.position.y = decorYOffset(sc, item, {x:rec.x,z:rec.z}, rec.rot||0, rec);  /* ยกขึ้นถ้าวางบนของอื่น */
  g.rotation.y = (rec.rot||0) * Math.PI/2;
  if(item.wall){   /* เลื่อนให้ขอบหลัง (local -z) ไปแนบผิวผนัง (ห่างกึ่งกลางช่องขอบ 0.5) — ชิ้นตื้น/ลึกแนบเท่ากัน */
    const ang = (rec.rot||0) * Math.PI/2;
    const sh = -(0.5 + (g.userData.localMinZ || 0));  /* ระยะเลื่อนตามแกน -z local */
    g.position.x += sh * Math.sin(ang);
    g.position.z += sh * Math.cos(ang);
  }
}
function applyRecToGroup(g){ const d=g.userData.deco; applyRecToGroup2(g, d.scene, d.item, d.rec); }

function rebuildDecorGrid(sc){
  const base = sc==='out' ? outGridBase : inGridBase; if(!base) return;
  const live = cloneGrid(base);
  decorGroups[sc].forEach(g=>{
    const {rec, item} = g.userData.deco; if(item.block===false) return;
    footTiles(item, {x:rec.x,z:rec.z}, rec.rot).forEach(tl=>{
      if(tl.z>=0 && tl.z<live.length && tl.x>=0 && tl.x<live[0].length) live[tl.z][tl.x] = 3;
    });
  });
  if(sc==='out') outGrid = live; else inGrid = live;
}
function saveDecor(){
  saveHouseData({decor:{
    out: decorGroups.out.map(g=>g.userData.deco.rec),
    in:  decorGroups.in.map(g=>g.userData.deco.rec),
  }});
}
/* seed ต้นไม้/รั้ว/บ้านสัตว์เลี้ยงเริ่มต้นเป็น decor ที่ย้าย/ลบได้ (ครั้งเดียวต่อเด็ก, ตำแหน่งเดิมเป๊ะ) */
function seedWorldDecor(data){
  data = data || {};
  const decor = data.decor || {out:[], in:[]};
  const seed = [];
  /* กรองต้นไม้ที่ทับตัวบ้าน/รั้วสนาม/แถบหน้าบ้าน ออกก่อน seed (เด็กย้ายมาวางเองทีหลังได้ตามใจ) */
  TREES.filter(([x,z]) => !inBox(HOUSE_VIEW, x, z) && !isFenceTile(x, z) &&
                          !inBox(HOUSE_FOOT, x, z) && !(x===PET_HOUSE_TILE.x && z===PET_HOUSE_TILE.z))
       .forEach(([x,z])=>{ seed.push({id:'tree', x, z, rot:(x*7+z*13)%4, col:(x+z)%4}); });
  /* มุมรั้ว 4 มุม (L หมุนตามมุม: บนซ้าย=0, ล่างซ้าย=1, ล่างขวา=2, บนขวา=3) */
  seed.push({id:'fence-corner', x:YARD.x0, z:YARD.z0, rot:0, col:0});
  seed.push({id:'fence-corner', x:YARD.x0, z:YARD.z1, rot:1, col:0});
  seed.push({id:'fence-corner', x:YARD.x1, z:YARD.z1, rot:2, col:0});
  seed.push({id:'fence-corner', x:YARD.x1, z:YARD.z0, rot:3, col:0});
  /* รั้วตรงระหว่างมุม (ข้ามช่องมุม) — แนวนอนบน/ล่าง (rot 0), แนวตั้งซ้าย/ขวา (rot 1) */
  [YARD.z0, YARD.z1].forEach(fz=>{ for(let x=YARD.x0+1; x<=YARD.x1-1; x++){ if(isFenceTile(x,fz)) seed.push({id:'fence-seg', x, z:fz, rot:0, col:0}); } });
  [YARD.x0, YARD.x1].forEach(fx=>{ for(let z=YARD.z0+1; z<=YARD.z1-1; z++){ if(isFenceTile(fx,z)) seed.push({id:'fence-seg', x:fx, z, rot:1, col:0}); } });
  seed.push({id:'pet-house', x:PET_HOUSE_TILE.x, z:PET_HOUSE_TILE.z, rot:3, col:0});
  /* แผ่นทางเดินหน้าประตู (ลอดช่องประตูรั้ว) — ย้าย/ลบได้ */
  for(let i=0;i<4;i++) seed.push({id:'path', x:DOOR_TILE.x, z:DOOR_TILE.z+i, rot:0, col:0});
  decor.out = seed.concat(decor.out || []);
  decor.in = decor.in || [];
  saveHouseData({decor, worldSeeded:true});
}
function loadDecorForChild(){
  lampAll = []; _lampsNight = null;   /* ล้าง ref ไฟเก่าก่อนสร้างของเด็กคนใหม่ */
  ['out','in'].forEach(sc=>{
    const parent = sc==='out' ? worldGroup : interiorGroup;
    decorGroups[sc].forEach(g=>{ parent.remove(g); disposeGroup(g); });
    decorGroups[sc] = [];
  });
  let data = loadHouseData();
  if(!data || !data.worldSeeded){ seedWorldDecor(data); data = loadHouseData(); }
  const decor = (data && data.decor) || {out:[], in:[]};
  ['out','in'].forEach(sc=>{
    const parent = sc==='out' ? worldGroup : interiorGroup;
    (decor[sc]||[]).forEach(rec=>{
      const g = buildDecorGroup(sc, rec);
      if(g){ parent.add(g); decorGroups[sc].push(g); }
    });
    rebuildDecorGrid(sc);
  });
}
/* หาช่องว่างข้างตัวละครสำหรับวางชิ้นใหม่ (เริ่มวงถัดจากช่องตัวละคร ไม่ทับตัวเด็ก) */
function footHasTile(item, anchor, rot, tx, tz){
  return footTiles(item, anchor, rot).some(t=>t.x===tx && t.z===tz);
}
function findFreeAnchor(sc, item, rot){
  const W = sc==='out'?OUT_W:IN_W, D = sc==='out'?OUT_D:IN_D;
  /* นอกบ้าน: ถ้าเด็กยืนนอกกรอบ (ป่า/หมู่บ้าน) ให้เริ่มหาช่องจากขอบกรอบที่ใกล้ตัวที่สุด
     ไม่ใช่จากตำแหน่งจริง ไม่งั้นของใหม่จะไปโผล่ไกลสุดกรอบแบบสุ่ม */
  const c = sc==='out' ? clampHomeTile(hChar.tile) : hChar.tile;
  for(let r=1; r<Math.max(W,D); r++){       /* r เริ่มที่ 1 → วางข้างตัว ไม่ทับ */
    for(let dz=-r; dz<=r; dz++) for(let dx=-r; dx<=r; dx++){
      if(Math.max(Math.abs(dx),Math.abs(dz))!==r) continue;
      const a = {x:c.x+dx, z:c.z+dz};
      if(footHasTile(item, a, rot, c.x, c.z)) continue;   /* กันฐานของกินช่องที่เด็กยืน */
      if(decorCanPlace(sc, item, a, rot)) return a;
    }
  }
  return null;
}
function searchNear(sc, item, center, rot, ignoreRec, R){
  for(let r=0; r<=R; r++) for(let dz=-r; dz<=r; dz++) for(let dx=-r; dx<=r; dx++){
    if(Math.max(Math.abs(dx),Math.abs(dz))!==r) continue;
    const a = {x:center.x+dx, z:center.z+dz};
    if(decorCanPlace(sc, item, a, rot, ignoreRec)) return a;
  }
  return null;
}

/* ---------- กรอบบริเวณบ้าน (เส้นประ + หมุดมุม) โชว์เฉพาะโหมดตกแต่ง ----------
   ใช้ add/remove เข้า worldGroup (ไม่ใช่ .visible) เพราะ raycaster ของ handleTap ยิงใส่
   worldGroup.children ทั้งก้อน — ถ้าปล่อยไว้แล้วซ่อนด้วย visible เส้นกรอบยังบังของที่แตะได้ */
let homeZoneFrame = null;
function homeZoneFrameGroup(){
  if(homeZoneFrame) return homeZoneFrame;
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({color:0xffb300, transparent:true, opacity:.85});
  const geoH = new THREE.BoxGeometry(.62,.07,.16), geoV = new THREE.BoxGeometry(.16,.07,.62);
  const dash = (geo, x, z)=>{ const m = new THREE.Mesh(geo, mat); m.position.set(x,.05,z); m.renderOrder = 5; g.add(m); };
  const zTop = outWZ(HOME_ZONE.z0)-.5, zBot = outWZ(HOME_ZONE.z1)+.5;
  const xL = outWX(HOME_ZONE.x0)-.5,  xR = outWX(HOME_ZONE.x1)+.5;
  for(let x=HOME_ZONE.x0; x<=HOME_ZONE.x1; x++){ dash(geoH, outWX(x), zTop); dash(geoH, outWX(x), zBot); }
  for(let z=HOME_ZONE.z0; z<=HOME_ZONE.z1; z++){ dash(geoV, xL, outWZ(z)); dash(geoV, xR, outWZ(z)); }
  const pinGeo = new THREE.SphereGeometry(.15,10,8);
  [[xL,zTop],[xR,zTop],[xL,zBot],[xR,zBot]].forEach(([x,z])=>{
    const p = new THREE.Mesh(pinGeo, mat); p.position.set(x,.14,z); p.renderOrder = 5; g.add(p);
  });
  homeZoneFrame = g;
  return g;
}
function updateHomeZoneFrame(){
  const show = editMode && hScene==='out' && houseOpen;
  const g = show ? homeZoneFrameGroup() : homeZoneFrame;
  if(!g) return;
  if(show){ if(worldGroup && g.parent!==worldGroup) worldGroup.add(g); }
  else if(g.parent) g.parent.remove(g);
}
/* เตือนตอนลากของเลยกรอบ (หน่วงไว้ ไม่ให้เด้งซ้ำๆ ระหว่างลาก) */
let _zoneToastAt = 0;
function homeZoneToast(){
  const now = performance.now();
  if(now - _zoneToastAt < 5000) return;
  _zoneToastAt = now;
  if(typeof showToast==='function') showToast('🏡','วางของได้แค่ในกรอบบริเวณบ้านนะ');
}

/* ---------- โหมดตกแต่ง (edit) ---------- */
function enterEditMode(){
  if(hMode!=='world' || !houseOpen) return;
  if(sitState) endSit();
  editMode = true;
  document.body.classList.add('house-edit');
  /* ซ่อนตัวละคร + สัตว์เลี้ยง + ป้ายชื่อ ระหว่างตกแต่ง (ไม่ให้บังของ/สับสน) */
  if(charGroup) charGroup.visible = false;
  if(hPet.group) hPet.group.visible = false;
  const cn = $('house-char-name'); if(cn) cn.hidden = true;
  const pn = $('house-pet-name'); if(pn) pn.hidden = true;
  const first = (FURN.cats[hScene]||[])[0];
  editCat = first ? first.id : null;
  const hint = $('house-hint'); if(hint) hint.hidden = true;
  renderEditTabs(); renderEditItems();
  const p = $('house-edit-panel'); if(p) p.hidden = false;
  const d = $('house-edit-done'); if(d) d.hidden = false;
  deselectDecor();
  updateHomeZoneFrame();
  /* ถ้าเด็กเดินไปเที่ยวนอกกรอบ (ป่า/หมู่บ้าน) แล้วกดตกแต่ง — ดึงกล้องกลับมาที่บ้านก่อน
     ไม่งั้นจะเห็นแต่พื้นที่ที่วางของไม่ได้ */
  if(hScene==='out' && !inHomeZone(hChar.tile.x, hChar.tile.z)){
    camTarget.set(outWX(DOOR_TILE.x), 0, outWZ(DOOR_TILE.z+2));
    applyCamera();
    if(typeof showToast==='function') showToast('🏡','ตกแต่งได้เฉพาะในบริเวณบ้านนะ');
  }else{
    clampCamTarget(); applyCamera();
  }
}
function exitEditMode(){
  editMode = false;
  editPan = null;
  deselectDecor();
  updateHomeZoneFrame();
  document.body.classList.remove('house-edit');
  /* คืนตัวละคร + สัตว์เลี้ยง (ป้ายชื่อโชว์เองผ่าน frame loop) */
  if(charGroup) charGroup.visible = true;
  if(hPet.group) hPet.group.visible = true;
  const p = $('house-edit-panel'); if(p) p.hidden = true;
  const d = $('house-edit-done'); if(d) d.hidden = true;
  const tb = $('house-edit-toolbar'); if(tb) tb.hidden = true;
  saveDecor();
}
function renderEditTabs(){
  const wrap = $('house-edit-tabs'); if(!wrap) return;
  wrap.innerHTML = '';
  (FURN.cats[hScene]||[]).forEach(c=>{
    const b = document.createElement('button');
    b.className = 'he-tab' + (c.id===editCat ? ' active' : '');
    b.innerHTML = '<span class="he-tab-emoji">'+c.emoji+'</span><span>'+c.label+'</span>';
    b.onclick = ()=>{ if(typeof playClick==='function') playClick(); editCat=c.id; renderEditTabs(); renderEditItems(); };
    wrap.appendChild(b);
  });
}
function renderEditItems(){
  const wrap = $('house-edit-items'); if(!wrap) return;
  wrap.innerHTML = '';
  FURN.items.filter(it=>it.scope===hScene && it.cat===editCat).forEach(it=>{
    const b = document.createElement('button');
    b.className = 'he-item';
    b.innerHTML = '<span class="he-item-emoji">'+it.emoji+'</span><span class="he-item-name">'+it.name+'</span>';
    b.onclick = ()=>addDecorItem(it.id);
    wrap.appendChild(b);
  });
  positionToolbar();   /* จำนวนของต่อหมวดต่างกัน → panel สูงเปลี่ยน → เลื่อน toolbar ตาม */
}
/* ความสูงที่วางซ้อน: ชิ้น stack (เช่นโคมไฟตั้งโต๊ะ) ยกขึ้นไปนั่งบนผิวของที่มี top อยู่ใต้ */
function decorYOffset(sc, item, anchor, rot, ignoreRec){
  if(!item.stack) return 0;
  let y = 0;
  const tiles = footTiles(item, anchor, rot);
  for(const g of decorGroups[sc]){
    const r = g.userData.deco.rec; if(r===ignoreRec) continue;
    const it = g.userData.deco.item; if(it.top==null) continue;
    const oth = footTiles(it, {x:r.x,z:r.z}, r.rot);
    if(tiles.some(a=>oth.some(bb=>bb.x===a.x && bb.z===a.z))) y = Math.max(y, it.top);
  }
  return y;
}
/* ---------- แพนกล้อง (โหมดตกแต่ง) ---------- */
function groundPoint(cx, cy){
  raycaster.setFromCamera(ndcFromClient(cx, cy), camera);
  const pt = new THREE.Vector3();
  return raycaster.ray.intersectPlane(groundPlane, pt) ? pt : null;
}
function clampCamTarget(){
  const out = hScene==='out';
  /* โหมดตกแต่งนอกบ้าน: แพนกล้องได้แค่รอบกรอบบริเวณบ้าน (ไม่หลุดไปฝั่งป่า/หมู่บ้านที่วางของไม่ได้) */
  if(out && editMode){
    const m = 3;
    camTarget.x = Math.max(outWX(HOME_ZONE.x0)-m, Math.min(outWX(HOME_ZONE.x1)+m, camTarget.x));
    camTarget.z = Math.max(outWZ(HOME_ZONE.z0)-m, Math.min(outWZ(HOME_ZONE.z1)+m, camTarget.z));
    return;
  }
  const hw = (out?OUT_W:IN_W)/2 + 2, hd = (out?OUT_D:IN_D)/2 + 2;
  camTarget.x = Math.max(-hw, Math.min(hw, camTarget.x));
  camTarget.z = Math.max(-hd, Math.min(hd, camTarget.z));
}
function editPanStart(cx, cy){ const p = groundPoint(cx, cy); editPan = p ? {prev:p} : null; }
function editPanMove(cx, cy){
  if(!editPan) return;
  const cur = groundPoint(cx, cy); if(!cur) return;
  camTarget.x += editPan.prev.x - cur.x;
  camTarget.z += editPan.prev.z - cur.z;
  clampCamTarget(); applyCamera();
  const re = groundPoint(cx, cy); if(re) editPan.prev = re;   /* จับจุดใหม่หลังเลื่อน ให้จุดเดิมอยู่ใต้นิ้ว */
}
function addDecorItem(id){
  if(typeof playClick==='function') playClick();
  const item = FURN.byId[id]; if(!item) return;
  const sc = hScene;
  const anchor = findFreeAnchor(sc, item, 0);
  if(!anchor){ if(typeof showToast==='function') showToast('🪑','ตรงนี้เต็มแล้ว ลองเก็บของอื่นออกก่อนนะ'); return; }
  const rec = {id, x:anchor.x, z:anchor.z, rot:0, col:0};
  const g = buildDecorGroup(sc, rec);
  (sc==='out'?worldGroup:interiorGroup).add(g);
  decorGroups[sc].push(g);
  rebuildDecorGrid(sc); saveDecor();
  selectDecor(g);
  decorBounce(g);
}
function ensureSelRing(){
  if(editSelRing) return;
  editSelRing = new THREE.Mesh(
    new THREE.TorusGeometry(.5,.055,8,26),
    new THREE.MeshBasicMaterial({color:0x33b7ee, transparent:true, opacity:.92}));
  editSelRing.rotation.x = Math.PI/2;
  editSelRing.renderOrder = 6;
  editSelRing.visible = false;
  scene.add(editSelRing);
}
function updateSelRing(){
  if(!editSel || !editSelRing) return;
  const {rec, item} = editSel.userData.deco;
  const f = itemFootprint(item, rec.rot);
  editSelRing.position.copy(editSel.position);
  editSelRing.position.y = .05;
  const s = Math.max(f.w, f.d) * .96 + .1;
  editSelRing.scale.set(s, s, 1);
}
function setSelTint(valid){ if(editSelRing) editSelRing.material.color.setHex(valid ? 0x33b7ee : 0xff5a5a); }
/* วางแถบเครื่องมือให้ลอยชิดขอบบนของกล่อง panel (panel สูงไม่คงที่ตามจำนวนของ) */
function positionToolbar(){
  const tb = $('house-edit-toolbar'), panel = $('house-edit-panel');
  if(!tb || !panel) return;
  const h = panel.hidden ? 0 : panel.offsetHeight;
  tb.style.bottom = (h + 8) + 'px';
}
function selectDecor(g){
  editSel = g;
  ensureSelRing();
  editSelRing.visible = true;
  setSelTint(true);
  updateSelRing();
  renderToolbar();
  const tb = $('house-edit-toolbar'); if(tb) tb.hidden = false;
  positionToolbar();
}
function deselectDecor(){
  editSel = null;
  if(editSelRing) editSelRing.visible = false;
  const tb = $('house-edit-toolbar'); if(tb) tb.hidden = true;
}
function renderToolbar(){
  const cwrap = $('house-edit-colors'); if(!cwrap || !editSel) return;
  cwrap.innerHTML = '';
  const {rec, item} = editSel.userData.deco;
  const pal = item.colors || [];
  pal.forEach((hex,i)=>{
    const b = document.createElement('button');
    b.className = 'he-color' + (i===(rec.col||0) ? ' active' : '');
    b.style.background = '#'+hex.toString(16).padStart(6,'0');
    b.onclick = ()=>recolorSel(i);
    cwrap.appendChild(b);
  });
}
function rebuildSelGroup(){
  const deco = editSel.userData.deco, sc = deco.scene, parent = editSel.parent;
  const idx = decorGroups[sc].indexOf(editSel);
  parent.remove(editSel); disposeGroup(editSel);
  const g = buildDecorGroup(sc, deco.rec);
  parent.add(g);
  if(idx>=0) decorGroups[sc][idx] = g; else decorGroups[sc].push(g);
  editSel = g;
  updateSelRing();
}
function recolorSel(i){
  if(!editSel) return;
  if(typeof playClick==='function') playClick();
  editSel.userData.deco.rec.col = i;
  rebuildSelGroup(); renderToolbar(); saveDecor();
}
function rotateSel(){
  if(!editSel) return;
  if(typeof playClick==='function') playClick();
  const deco = editSel.userData.deco, rec = deco.rec, sc = deco.scene, item = deco.item;
  const nr = (rec.rot+1)%4;
  let anchor = {x:rec.x, z:rec.z};
  if(!decorCanPlace(sc, item, anchor, nr, rec)) anchor = searchNear(sc, item, anchor, nr, rec, 2);
  if(!anchor){ if(typeof showToast==='function') showToast('🔄','หมุนตรงนี้ไม่ได้ ลองย้ายที่ก่อนนะ'); return; }
  rec.rot = nr; rec.x = anchor.x; rec.z = anchor.z;
  applyRecToGroup(editSel);
  updateSelRing(); rebuildDecorGrid(sc); saveDecor();
}
function deleteSel(){
  if(!editSel) return;
  if(typeof playClick==='function') playClick();
  const deco = editSel.userData.deco, sc = deco.scene;
  const idx = decorGroups[sc].indexOf(editSel);
  editSel.parent.remove(editSel); disposeGroup(editSel);
  if(idx>=0) decorGroups[sc].splice(idx,1);
  deselectDecor(); rebuildDecorGrid(sc); saveDecor();
}
/* ---------- ลากวางในโหมด edit ---------- */
function editRaycastDecor(cx, cy){
  raycaster.setFromCamera(ndcFromClient(cx, cy), camera);
  return pickDecorGroup();
}
function pickDecorGroup(){
  const parent = hScene==='out' ? worldGroup : interiorGroup;
  const hits = raycaster.intersectObjects(decorGroups[hScene], true);
  for(const h of hits){ let o = h.object; while(o && o!==parent){ if(o.userData.hDecor) return o; o = o.parent; } }
  return null;
}
function editGroundTile(cx, cy){
  raycaster.setFromCamera(ndcFromClient(cx, cy), camera);
  const pt = new THREE.Vector3();
  if(!raycaster.ray.intersectPlane(groundPlane, pt)) return null;
  const out = hScene==='out';
  const W = out?OUT_W:IN_W, D = out?OUT_D:IN_D;
  return {x:Math.round(pt.x+(W-1)/2), z:Math.round(pt.z+(D-1)/2)};
}
function editDragMove(cx, cy){
  if(!editSel || !editDrag) return;
  const sc = hScene, {rec, item} = editSel.userData.deco;
  const t = editGroundTile(cx, cy); if(!t) return;
  const rot = rec.rot;
  const f = itemFootprint(item, rot);
  const anchor = {x:t.x-Math.floor((f.w-1)/2), z:t.z-Math.floor((f.d-1)/2)};
  const valid = decorCanPlace(sc, item, anchor, rot, rec);
  /* ลากเลยกรอบบริเวณบ้าน: บอกเหตุผลให้เด็กรู้ (แดงเฉยๆ เด็กเดาไม่ออกว่าทำไมวางไม่ได้) */
  if(!valid && sc==='out' && !footTiles(item, anchor, rot).every(t=>inHomeZone(t.x, t.z))) homeZoneToast();
  editSel.position.copy(decorWorldPos(sc, item, anchor, rot));
  editSel.rotation.y = rot * Math.PI/2;
  editSel.position.y = valid ? decorYOffset(sc, item, anchor, rot, rec) : .12;
  updateSelRing(); setSelTint(valid);
  if(valid) editDrag.lastValid = {x:anchor.x, z:anchor.z, rot};
  editDrag.moved = true;
}
function editDragCommit(){
  if(!editSel || !editDrag){ editDrag = null; return; }
  const deco = editSel.userData.deco, rec = deco.rec, sc = deco.scene;
  const a = editDrag.lastValid || {x:rec.x, z:rec.z, rot:rec.rot};
  rec.x = a.x; rec.z = a.z; if(a.rot!=null) rec.rot = a.rot;
  applyRecToGroup(editSel);
  setSelTint(true); updateSelRing();
  rebuildDecorGrid(sc); saveDecor();
  editDrag = null;
}
function editDragCancel(){
  if(editSel && editDrag){ applyRecToGroup(editSel); setSelTint(true); updateSelRing(); }
  editDrag = null;
}
/* ---------- interaction (world mode) ---------- */
function decorInteract(g){
  if(editMode) return;
  const {rec, item, scene:sc} = g.userData.deco;
  const W = sc==='out'?OUT_W:IN_W, D = sc==='out'?OUT_D:IN_D;
  const grid = sc==='out'?outGrid:inGrid;
  const f = itemFootprint(item, rec.rot);
  const cx = Math.round(rec.x+(f.w-1)/2), cz = Math.round(rec.z+(f.d-1)/2);
  const adj = nearestWalkable(grid, W, D, cx, cz);
  if(!adj) return;
  walkTo(adj.x, adj.z, {action:{type:'decor', group:g, item, act:item.action||'bounce'}});
}
function startSit(g, item, act){
  questEvent('sit', null);
  const sit = item.sit || {};
  const ang = g.rotation.y;
  const ry = ang + (sit.ry!=null ? sit.ry : 0);   /* หันหน้าตามด้านหน้าเฟอร์นิเจอร์ (+z ที่ rot 0) */
  const seat = g.position.clone();
  if(act==='sleep'){
    /* นอนบนเตียง/เอนบนเก้าอี้ผ้าใบ: จุดวางเลื่อนไปทางปลาย (+z local) ตัวจะเหยียดยาวไปหาหมอน (-z)
       recline = มุมเอน (เรเดียน) 0=ตั้งตรง, PI/2=ราบเต็ม (เตียง). เก้าอี้ผ้าใบตั้งน้อยกว่าให้เอนตามพนักพิง */
    const off = sit.sleepOff != null ? sit.sleepOff : 0.5;
    seat.x += Math.sin(ang)*off; seat.z += Math.cos(ang)*off;
    seat.y = sit.sleepY != null ? sit.sleepY : 0.58;
  }else{
    /* นั่ง: offset ที่นั่ง (local) หมุนตามทิศชิ้น + ยกสะโพกไปแตะเบาะ */
    const dx = sit.dx||0, dz = sit.dz||0;
    seat.x += dx*Math.cos(ang) + dz*Math.sin(ang);
    seat.z += -dx*Math.sin(ang) + dz*Math.cos(ang);
    seat.y = Math.max(0, (sit.sy!=null ? sit.sy : .5) - 0.4);
  }
  sitState = {group:g, item, act, seat, ry, swingLean:0, recline: sit.recline};
  if(item.rock && g.userData.swingPiv && g.userData.swingSeat){
    sitState.swing = {piv:g.userData.swingPiv, anc:g.userData.swingSeat};
  }
  charBubble(act==='sleep' ? '💤' : (Math.random()<.5?'😊':'🎵'));
}
function endSit(){
  if(sitState && sitState.swing) sitState.swing.piv.rotation.x = 0;   /* คืนชิงช้าให้หยุดนิ่ง */
  sitState = null;
  /* ไม่ snap ท่าทันที — ปล่อยให้ loop lerp rotation.x→0 (บรรทัด trx) + position.y→0 (idle) ให้ลุก/ยืนนุ่มนวล */
  const hb = $('house-char-bubble'); if(hb) hb.classList.remove('on');
}
function decorBounce(g){ fxList.push({g, t0:performance.now(), dur:650, kind:'bounce'}); const p=g.position; spawnParticle(p.x,(g.userData.deco?1.2:.6),p.z,0xfff1a8,g.parent); }
function decorSpin(g){ fxList.push({g, t0:performance.now(), dur:900, kind:'spin'}); }
function decorToggle(g){
  if(g.userData.lamp){   /* โคมไฟ/เสาไฟ: สลับเปิด-ปิดไฟจริง */
    if(g.userData.lamp.alwaysOn){ charBubble('🔥'); return; }  /* กองไฟติดตลอด */
    setLampState(g, !g.userData.lamp.on);
    charBubble(g.userData.lamp.on ? '💡' : '🌙');
    return;
  }
  const p = g.position;
  for(let i=0;i<5;i++) spawnParticle(p.x+(Math.random()-.5)*.6, 1+Math.random()*.8, p.z+(Math.random()-.5)*.6, 0xfff59d, g.parent);
  charBubble('✨');
}
/* ---------- ระบบไฟ decor (โคมไฟ/เสาไฟ/กองไฟ) ---------- */
let lampAll = [];                     /* ไฟทุกดวงในฉาก (อัปเดต fade + กะพริบทุกเฟรม) */
let _lampsNight = null;               /* จำสถานะกลางวัน/คืนล่าสุด สลับไฟอัตโนมัติเมื่อเปลี่ยนจริง */
/* กลางวันฉากสว่างอยู่แล้ว → หรี่ไฟลง (กันแสง over), กลางคืน → เต็มดวง */
function lampDim(){ return ((typeof isNightMode==='function') && isNightMode()) ? {light:1, em:1} : {light:.1, em:.32}; }
function setupLamp(g, item){
  const L = item.light;
  const bulbs = [];
  g.traverse(o=>{ if(o.userData.bulb && o.material){ o.material = o.material.clone(); o.userData.emOn = (o.material.color ? o.material.color.clone() : new THREE.Color(L.color||0xfff2c0)); bulbs.push(o); } });
  const light = new THREE.PointLight(L.color||0xfff2c0, 0, L.dist||4, 1.6);
  light.position.set(L.x||0, L.y!=null?L.y:1, L.z||0);
  light.castShadow = false;
  g.add(light);
  const lamp = { light, bulbs, on:false, intensity:(L.intensity!=null?L.intensity:1),
                 alwaysOn:!!L.alwaysOn, flicker:!!L.flicker, curLight:0, curEm:0 };
  g.userData.lamp = lamp;
  lamp.on = lamp.alwaysOn || ((typeof isNightMode==='function') && isNightMode());
  /* snap ค่าเริ่มต้นตอนเข้าบ้าน (ไม่ fade) แล้วให้ updateLamps ค่อยๆ ปรับตอนสลับโหมด/กด toggle */
  const dim = lampDim();
  lamp.curLight = lamp.on ? lamp.intensity * dim.light : 0;
  lamp.curEm    = lamp.on ? dim.em : 0;
  applyLampVisual(g, 0);
  lampAll.push(g);
}
function setLampState(g, on){   /* แค่ตั้งเป้า — ความสว่างจริง fade เข้าหาเป้าใน updateLamps */
  const lamp = g.userData.lamp; if(lamp) lamp.on = on;
}
function applyLampVisual(g, t){
  const lamp = g.userData.lamp;
  const fL = (lamp.flicker && lamp.on) ? (0.75 + 0.25*Math.sin(t*.012) + 0.12*Math.sin(t*.037)) : 1;
  lamp.light.intensity = lamp.curLight * fL;
  lamp.bulbs.forEach((b,bi)=>{ if(b.material.emissive){
    const fe = (lamp.flicker && lamp.on) ? (0.7 + 0.3*Math.sin(t*.02 + bi)) : 1;
    b.material.emissive.copy(b.userData.emOn).multiplyScalar(lamp.curEm * fe);
  } });
}
function updateLamps(t, dt){   /* fade ความสว่างเข้าหาเป้า (เปิด/ปิด + หรี่กลางวัน/คืน) นุ่มตามธีม + กองไฟกะพริบ */
  const dim = lampDim();
  const kk = Math.min(1, dt*1.8);   /* ~ ตามจังหวะ crossfade ธีม 2 วิ */
  for(let i=lampAll.length-1; i>=0; i--){
    const g = lampAll[i];
    if(!g.parent || !g.userData.lamp){ lampAll.splice(i,1); continue; }
    const lamp = g.userData.lamp;
    const tgtL = lamp.on ? lamp.intensity * dim.light : 0;
    const tgtE = lamp.on ? dim.em : 0;
    lamp.curLight += (tgtL - lamp.curLight) * kk;
    lamp.curEm    += (tgtE - lamp.curEm) * kk;
    applyLampVisual(g, t);
  }
}
function refreshLamps(){   /* เรียกจาก updateLights — สลับเปิด/ปิดตามกลางวัน/คืน (ความสว่างค่อย fade ใน updateLamps) */
  const night = (typeof isNightMode==='function') && isNightMode();
  if(night === _lampsNight) return;
  _lampsNight = night;
  refreshStreetLamps();                 /* เสาไฟริมทางของฉาก (merge แล้ว) — สั่งติด/ดับทั้งชุดทีเดียว */
  ['in','out'].forEach(sc=>{ (decorGroups[sc]||[]).forEach(g=>{
    const lamp = g.userData.lamp; if(!lamp || lamp.alwaysOn) return;
    lamp.on = night;   /* โคม/เสาไฟ: เปิดกลางคืน ปิดกลางวันอัตโนมัติ (fade เอง) */
  }); });
}
function charBubble(txt){
  const hb = $('house-char-bubble'); if(!hb) return;
  hb.textContent = txt; hb.classList.add('on');
  clearTimeout(charBubble._t);
  charBubble._t = setTimeout(()=>hb.classList.remove('on'), 1600);
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

  if(hMode==='creator' || hMode==='pet'){
    /* ไม่มี auto-rotate (ผู้ใช้ขอเอาออก) — หมุนนุ่มๆ เข้าหามุมจากปุ่ม ↺/↻ หรือหมุนตามนิ้วลากตรงๆ */
    if(!creatorState.dragging){
      creatorState.rotY += (creatorState.rotTarget - creatorState.rotY) * Math.min(1, dt*9);
    }
    if(hMode==='pet'){
      if(petPreview){
        petPreview.rotation.y = creatorState.rotY;
        petPreview.position.y = Math.sin(t*.0022)*.04;   /* ลอยหายใจเบาๆ แบบเดียวกับตัวละคร */
      }
    }else if(charGroup){
      charGroup.rotation.y = creatorState.rotY;
      /* ท่ายืนหายใจเบาๆ ให้ดูมีชีวิต */
      if(u){ u.rig.position.y = Math.sin(t*.0022)*.02; u.arms[0].rotation.z = -.16-Math.sin(t*.0022)*.03; u.arms[1].rotation.z = .16+Math.sin(t*.0022)*.03; }
    }
  }else if(charGroup){
    const gettingUp = hChar.getUpT0 && (performance.now() - hChar.getUpT0) < hChar.getUpDur;
    if(gettingUp){
      /* ลุกจากที่นั่ง/นอน: สไลด์ออกจากเฟอร์นิเจอร์กลับช่องข้างๆ + ยืดแขนขากลับท่ายืน
         (rotation.x คืนศูนย์ผ่าน trx ด้านล่างเพราะ sitState=null แล้ว) — ยังไม่เดินจนกว่าจะยืนเสร็จ */
      const gp = (performance.now() - hChar.getUpT0) / hChar.getUpDur;
      const e = gp<.5 ? 2*gp*gp : 1-Math.pow(-2*gp+2,2)/2;   /* easeInOut */
      charGroup.position.lerpVectors(hChar.getUpFrom, hChar.getUpTo, e);
      charGroup.position.y += Math.sin(e*Math.PI) * .3;      /* ยกตัวเป็นเส้นโค้งข้ามที่นั่ง ไม่ลากตรงทะลุม้านั่ง */
      if(u){ ['legs','arms'].forEach(pp=>u[pp].forEach(o=>{ o.rotation.x *= .85; })); u.rig.position.y = 0; }
    }else if(hChar.walking && hChar.path.length){
      hChar.getUpT0 = 0;
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
    }else if(u && sitState){
      hChar.targetRotY = sitState.ry;
      const kk = Math.min(1, dt*10);
      if(sitState.act==='sleep'){
        /* นอนราบ: เหยียดแขนขา (ตัวจะเอนเป็นแนวนอนด้วย rotation.x ด้านล่าง) */
        charGroup.position.lerp(sitState.seat, Math.min(1, dt*8));
        u.legs[0].rotation.x += (-.06 - u.legs[0].rotation.x)*kk;
        u.legs[1].rotation.x += ( .06 - u.legs[1].rotation.x)*kk;
        u.arms[0].rotation.x += (-.12 - u.arms[0].rotation.x)*kk;
        u.arms[1].rotation.x += (-.12 - u.arms[1].rotation.x)*kk;
        u.rig.position.y = 0;
      }else{
        /* นั่ง: งอเข่า แขนวางตัก (legBend ปรับได้ต่อชิ้น เช่นเก้าอี้ผ้าใบงอน้อย ขาเหยียดตามเบาะ) */
        const _lb = (sitState.item.sit && sitState.item.sit.legBend!=null) ? sitState.item.sit.legBend : -1.2;
        u.legs[0].rotation.x += (_lb - u.legs[0].rotation.x)*kk;
        u.legs[1].rotation.x += (_lb - u.legs[1].rotation.x)*kk;
        u.arms[0].rotation.x += (-.35 - u.arms[0].rotation.x)*kk;
        u.arms[1].rotation.x += (-.35 - u.arms[1].rotation.x)*kk;
        u.rig.position.y = Math.sin(t*.0022)*.015;
        if(sitState.swing){
          /* ชิงช้าโยก: แกว่ง pivot + ตัวละครแกว่งตามที่นั่ง + เอนตัวตามจังหวะ */
          const ang = Math.sin(t*.003)*0.5;
          sitState.swing.piv.rotation.x = ang;
          sitState.swingLean = ang;
          sitState.swing.anc.getWorldPosition(_swingV);
          _swingV.y -= 0.4;                         /* ใช้เวกเตอร์เดิมซ้ำ ไม่สร้างใหม่ทุกเฟรม (ลดงาน GC) */
          charGroup.position.lerp(_swingV, Math.min(1, dt*12));
        }else{
          charGroup.position.lerp(sitState.seat, Math.min(1, dt*6));   /* ค่อยๆ เลื่อนลงนั่ง/นอน (นุ่มขึ้น) */
        }
      }
    }else if(u){
      /* idle: โยกเบาๆ แขนขากลับท่ายืน + ลุกจากที่นั่ง/นอนนุ่มๆ (position.y คืนสู่พื้น) */
      hChar.getUpT0 = 0;
      ['legs','arms'].forEach(part=>u[part].forEach(p=>{ p.rotation.x *= .82; }));
      if(charGroup.position.y > 0.001) charGroup.position.y += (0 - charGroup.position.y) * Math.min(1, dt*8);
      else charGroup.position.y = 0;
      u.rig.position.y = Math.sin(t*.0022)*.02;
      u.arms[0].rotation.z = -.16-Math.sin(t*.0022)*.03;
      u.arms[1].rotation.z = .16+Math.sin(t*.0022)*.03;
    }
    /* หมุนตัวนุ่มๆ เข้าหาทิศเดิน */
    let dr = hChar.targetRotY - charGroup.rotation.y;
    while(dr > Math.PI) dr -= Math.PI*2;
    while(dr < -Math.PI) dr += Math.PI*2;
    charGroup.rotation.y += dr * Math.min(1, dt*10);
    /* เอนตัว: นอน = ราบ (-90°), ชิงช้า = เอนตามการแกว่ง, อื่นๆ = ตั้งตรง */
    let trx = 0;
    if(sitState && sitState.act==='sleep') trx = -(sitState.recline!=null ? sitState.recline : Math.PI/2);
    else if(sitState && sitState.swing) trx = sitState.swingLean || 0;
    else if(sitState && sitState.act==='sit' && sitState.item.sit && sitState.item.sit.lean!=null) trx = sitState.item.sit.lean;  /* นั่งเอนหลังตามพนักพิง (เก้าอี้ผ้าใบ) */
    if(sitState && sitState.swing) charGroup.rotation.x = trx;
    else charGroup.rotation.x += (trx - charGroup.rotation.x) * Math.min(1, dt*5);   /* เอน/นอน/ลุก ค่อยๆ พลิก (นุ่มขึ้น) */
    /* กล้องตามตัวละคร (ยกเว้นตอนตกแต่ง — ปล่อยให้แพนกล้องอิสระ, กลับหาตัวละครเองตอนออก) */
    if(!editMode) camTarget.lerp(charGroup.position, Math.min(1, dt*4));
    applyCamera();
    updateCritters(dt, t);
    updatePenAnimals(dt, t);
    updateNpcs(dt, t);
    updateFountainFx(t, dt);
    updateButterflies(dt, t);
    updateDecorWind(t, dt);



    checkQuestZone(dt);
    updateFx(t, dt);
    updatePet(dt);
  }
  updateNameLabel();
  updatePetLabels();
  updateNpcLabels();
  updateCompass();
  updatePosChip();
  updateLamps(t, dt);
  updateStreetLamps(dt);
  renderer.render(scene, camera);
}

/* ---------- หน้าจอโหลด ----------
   เข้าเกมครั้งแรกต้องสร้างโมเดลทั้งเมือง (ถนน/บ้าน/ต้นไม้/ของตกแต่งหลายพันชิ้น) ซึ่งเป็นงานหนักแบบ sync
   ระหว่างนั้นเบราว์เซอร์วาดอะไรไม่ได้เลย จอจะค้าง จึงโชว์หน้าจอโหลดคั่นก่อน แล้วแบ่งงานเป็นก้อนๆ
   ยอมคืนเฟรมให้เบราว์เซอร์วาดระหว่างก้อน หลอดจะได้ขยับจริงและการ์ตูนไม่ค้าง */
let houseLoadHideT = null;
function setHouseLoading(pct, msg){
  const bar = $('house-loading-bar'), tx = $('house-loading-text');
  if(bar) bar.style.width = Math.round(pct*100) + '%';
  if(msg && tx) tx.textContent = msg;
}
function showHouseLoading(){
  const el = $('house-loading');
  if(!el) return;
  clearTimeout(houseLoadHideT);
  const already = !el.hidden;   /* js/games-ar.js เปิดม่านไว้ตั้งแต่ช่วงดาวน์โหลดสคริปต์แล้ว
                                   ถ้ารีเซ็ตหลอดตรงนี้ เด็กจะเห็นหลอดวิ่งถอยหลัง */
  el.classList.remove('done');
  el.hidden = false;
  if(!already) setHouseLoading(.06, 'กำลังปลุกเมืองให้ตื่น…');
}
function hideHouseLoading(){
  const el = $('house-loading');
  if(!el) return;
  el.classList.add('done');                       /* เฟดออก แล้วค่อยซ่อนจริงตอนเฟดจบ */
  houseLoadHideT = setTimeout(()=>{ el.hidden = true; el.classList.remove('done'); }, 420);
}
/* รอให้เบราว์เซอร์ "วาดจริง" 1 เฟรมก่อนทำงานหนักก้อนถัดไป — rAF ชั้นเดียวยังวาดไม่ทัน ต้อง 2 ชั้น */
function afterPaint(fn){ requestAnimationFrame(()=>requestAnimationFrame(fn)); }

/* ---------- เข้า/ออก view ---------- */
let houseLoading = false;
function houseLoadFail(msg, err){
  if(err) console.error(err);
  houseLoading = false;
  hideHouseLoading();
  if(typeof showToast==='function') showToast('😢', msg);
}
function startHouseGame(){
  if(typeof playClick==='function') playClick();
  if(!activeChild){ if(typeof showToast==='function') showToast('🙈','เลือกโปรไฟล์ก่อนนะ'); return; }
  if(houseLoading) return;                        /* กดรัวระหว่างโหลดแล้วสร้างฉากซ้อนกันไม่ได้ */
  if(hInit){ enterHouseGame(); return; }          /* เคยเข้ามาแล้ว ฉากอยู่ในหน่วยความจำ เข้าได้เลย */
  houseLoading = true;
  showHouseLoading();
  /* งานหนักแบ่งเป็น 4 ก้อน คั่นด้วย afterPaint ทุกก้อน เพื่อให้หน้าจอโหลดขยับได้จริงระหว่างสร้างฉาก */
  const steps = [
    ()=>{
      if(!initThreeCore()){ houseLoadFail('อุปกรณ์นี้เปิดบ้าน 3D ไม่ได้'); return false; }
      setHouseLoading(.22, 'กำลังสร้างถนนกับบ้านทั้งเมือง…');
    },
    ()=>{ buildWorld();    setHouseLoading(.66, 'จัดของในบ้านให้เรียบร้อย…'); },
    ()=>{ buildInterior(); setHouseLoading(.88, 'ตามหาตัวละครของหนู…'); },
    ()=>{
      initThreeFinish();
      houseLoading = false;
      enterHouseGame();
      setHouseLoading(1, 'พร้อมแล้ว ไปเที่ยวกันเลย!');
      afterPaint(hideHouseLoading);               /* เปิดม่านหลังเกมวาดเฟรมแรกเสร็จ ไม่เห็นจอว่างคั่น */
    },
  ];
  const run = i => {
    if(i >= steps.length) return;
    try{
      if(steps[i]() === false) return;            /* ก้อนไหนพังก็หยุด พร้อมปิดหน้าจอโหลดไปแล้ว */
    }catch(err){ houseLoadFail('เปิดบ้านไม่สำเร็จ ลองใหม่อีกครั้งนะ', err); return; }
    afterPaint(()=>run(i + 1));
  };
  afterPaint(()=>run(0));
}

function enterHouseGame(){
  /* ซ่อน view อื่นทั้งหมดแล้วโชว์บ้าน — ใช้ helper กลาง showOnlyView() ของ js/app-core.js
     (ครอบคลุมทุก view อัตโนมัติ เพิ่ม view ใหม่ในแอปแล้วไม่ต้องมาไล่เติมที่นี่อีก) */
  if(typeof stopARGame === 'function') stopARGame();          /* ปิดกล้อง AR ที่อาจค้างอยู่ */
  if(typeof unmountHandPlay === 'function') unmountHandPlay();
  showOnlyView(houseView);
  document.body.classList.add('house-open');
  houseOpen = true;
  $('house-char-name').textContent = activeChild.name;
  syncHouseCtrls();
  fadeIn();
  if(!critters.length) critterSpawnT = Math.min(critterSpawnT, 2.5);

  /* บ้านผูกกับเด็กที่เลือกเสมอ — สลับเด็กแล้วต้องโหลดตัวละคร/ตำแหน่งของคนใหม่ */
  const childChanged = loadedChildId !== activeChild.id;
  loadedChildId = activeChild.id;
  initQuest(); refreshQuestMark(); renderQuestList();   /* ภารกิจประจำวันของเด็กคนนี้ (สุ่มใหม่ทุกวัน) */
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
  loadDecorForChild();                    /* โหลดเฟอร์นิเจอร์ที่วางไว้ของเด็กคนนี้ (เฟส 3) */
  if(childChanged) removePetGroup();      /* สัตว์เลี้ยงของเด็กคนก่อนต้องไม่ติดมาฉากเด็กคนใหม่ */
  if(!data || !data.char){
    openCreator(false);
  }else{
    /* กดย้อนกลับค้างไว้ตอนอยู่ใน creator/แผงสัตว์เลี้ยงแล้วเข้าใหม่: เคยปิด worldGroup
       และ rebuild เป็นหน้าตาพรีวิวที่ยังไม่ save — ต้อง restore ฉาก + ตัวละครจากที่ save จริงเสมอ */
    const wasCreator = hMode === 'creator' || hMode === 'pet';
    hMode = 'world';
    $('house-creator').hidden = true;
    $('house-pet-picker').hidden = true;
    $('house-rotate-wrap').hidden = true;
    $('house-edit-btn').hidden = false;
    $('house-pet-btn').hidden = false; $('house-decorate-btn').hidden = false;
    if(petPreview){ scene.remove(petPreview); disposeGroup(petPreview); petPreview = null; }
    creatorGroup.visible = false;
    worldGroup.visible = (hScene==='out'); interiorGroup.visible = (hScene==='in');
    if(childChanged || wasCreator || !charGroup) rebuildChar(data.char);
    charGroup.visible = true;
    const p = tileWorld(hChar.tile);
    charGroup.position.copy(p);
    charGroup.rotation.y = hChar.targetRotY;
    camTarget.copy(p);
    applyCamera();
    showHint();
    /* สัตว์เลี้ยงของเด็กคนปัจจุบัน: ข้อมูลเปลี่ยน = สร้างใหม่ตามที่ save จริง */
    if(data.pet){
      if(!hPet.group || !hPet.cfg || hPet.cfg.type!==data.pet.type || hPet.cfg.name!==data.pet.name
         || (hPet.cfg.color||0)!==(data.pet.color||0)) spawnPet(data.pet);
    }else{
      removePetGroup();
    }
  }
  lastT = performance.now();
  rafId = requestAnimationFrame(frame);
}

function stopHouseGame(){
  if(editMode) exitEditMode();
  if(sitState) endSit();
  houseOpen = false;
  closeQuestBoard();
  if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
  document.body.classList.remove('house-open');
  $('house-char-name').hidden = true;
  $('house-pet-name').hidden = true;
  $('house-compass').hidden = true;
  $('house-pos-chip').hidden = true; posChipKey = '';
  $('house-pet-bubble').classList.remove('on');
  showOnlyView(homeView);
  houseBuddyRefresh();   /* เผื่อเพิ่งแก้ชุด/เปลี่ยนสัตว์เลี้ยงในบ้านมา ให้ตัวจิ๋วหน้าหลักอัปเดตตาม */
}

/* ---------- เพื่อนซี้หน้าหลัก (home buddy) ----------
   ตัวละคร+สัตว์เลี้ยงของเด็ก (จากบ้านของหนู) มายืนให้กำลังใจใน hero หน้าเลือกหมวด
   renderer/scene ขนาดเล็กแยกของตัวเอง บน canvas #house-buddy-canvas โปร่งใส
   แสดงเฉพาะเด็กที่สร้างตัวละครแล้ว — loop หยุดเองเมื่อ homeView ถูกซ่อน
   แล้ว restart ผ่าน window.houseBuddyRefresh() (เรียกจาก renderHome ใน app.js
   และตอนออกจากโหมดบ้าน เผื่อเพิ่งแก้ชุด/เปลี่ยนสัตว์เลี้ยงมา) */
let hbRenderer=null, hbScene=null, hbCam=null, hbChar=null, hbPet=null, hbPetName='';
let hbShadC=null, hbShadP=null;
let hbRaf=null, hbLast=0, hbT=0, hbKey='';
/* เฟรมเรตของเพื่อนซี้หน้าหลัก: ตอน "ขยับแรง" (โบกมือ/กระโดด/สัตว์เด้ง) ปล่อยเต็มจอ 60fps
   ให้ลื่นจริง ส่วนตอนยืนเฉยๆ (หายใจ/เอียงหัว = คลื่นช้ามาก) 24fps ตาแทบแยกไม่ออก
   แต่ประหยัดแบตกว่ามาก (นี่เป็น WebGL context ที่ 2 ที่เปิดค้างอยู่บนหน้าหลัก) */
const HB_IDLE_MS = 1000/24;
/* ease in-out นุ่มๆ (smoothstep) — ใช้แทนการไล่ค่าแบบเส้นตรงที่หัว-ท้ายจังหวะจะกระตุก */
function hbEase(x){ x = x<0 ? 0 : (x>1 ? 1 : x); return x*x*(3-2*x); }
/* ไล่ค่าเข้าหาเป้าหมายแบบไม่ขึ้นกับเฟรมเรต — สลับ 24↔60fps แล้วความเร็วยังเท่าเดิม ไม่กระตุก */
function hbDamp(cur, tgt, lambda, dt){ return cur + (tgt-cur)*(1 - Math.exp(-lambda*dt)); }
let hbWaveT=2, hbWaveK=0, hbHopT=1.6, hbHopK=0, hbJumpK=0, hbMsgT=0, hbSparkT=3;
let hbArmL=0, hbArmR=0, hbHeadZ=0, hbPetHeadZ=0;   /* ค่าปัจจุบันของแขน/หัว ใช้ไล่เข้าหาเป้าแบบนุ่มๆ */
const HB_W=280, HB_H=190, HB_WAVE_DUR=1.6, HB_HOP_DUR=.55;
function hbMsgs(){
  const m = [
    'สู้ๆ นะ! วันนี้ต้องเก่งกว่าเมื่อวานแน่นอน 💪',
    'ค่อยๆ คิด ไม่ต้องรีบนะ 😊',
    'มาทำโจทย์กันเถอะ เก็บดาวให้ครบเลย ⭐',
    'หนูเก่งที่สุดเลย! ✨',
    'ผิดบ้างไม่เป็นไร ลองใหม่ได้เสมอนะ 🌈',
    'เราเป็นกำลังใจให้เสมอเลยนะ 💖',
  ];
  if(hbPetName){
    m.push(hbPetName + ' บอกว่า สู้ๆ นะ! 🐾');
    m.push('ทำโจทย์เสร็จแล้วมาเล่นกับ ' + hbPetName + ' ที่บ้านนะ 🏠');
  }
  return m;
}
function hbInit(){
  if(hbRenderer) return true;
  const canvas = $('house-buddy-canvas');
  if(!canvas) return false;
  try{ hbRenderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true}); }
  catch(e){ return false; }
  hbRenderer.setClearColor(0x000000, 0);
  hbRenderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  hbRenderer.setSize(HB_W, HB_H, false);
  hbScene = new THREE.Scene();
  hbCam = new THREE.OrthographicCamera(-1.55, 1.55, 1.05, -1.05, .1, 30);
  hbCam.position.set(2.0, 1.9, 4.4);
  hbCam.lookAt(0, .8, 0);
  hbScene.add(new THREE.HemisphereLight(0xfff6e0, 0xcde8b0, .8));
  const dl = new THREE.DirectionalLight(0xffffff, .65);
  dl.position.set(3, 6, 5);
  hbScene.add(dl);
  /* เงากลมนุ่มใต้เท้า (ไม่ใช้ shadow map — วงรี alpha ต่ำพอ) */
  const shadMat = new THREE.MeshBasicMaterial({color:0x1d3a1d, transparent:true, opacity:.14, depthWrite:false});
  hbShadC = new THREE.Mesh(new THREE.CircleGeometry(.46, 24), shadMat);
  hbShadC.rotation.x = -Math.PI/2; hbShadC.scale.set(1.15,1,.7); hbShadC.position.y = .01;
  hbScene.add(hbShadC);
  hbShadP = new THREE.Mesh(new THREE.CircleGeometry(.34, 24), shadMat);
  hbShadP.rotation.x = -Math.PI/2; hbShadP.scale.set(1.1,1,.7); hbShadP.position.y = .01;
  hbScene.add(hbShadP);
  return true;
}
function hbShowMsg(){
  const b = $('house-buddy-bubble');
  if(!b) return;
  const list = hbMsgs();
  let msg = list[Math.floor(Math.random()*list.length)];
  if(msg === b.textContent) msg = list[(list.indexOf(msg)+1) % list.length];
  b.textContent = msg;
  b.hidden = false;
  b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';  /* restart pop */
}
function hbSpark(emoji){
  const wrap = $('house-buddy');
  if(!wrap || wrap.hidden) return;
  const s = document.createElement('span');
  s.className = 'hb-float';
  s.textContent = emoji;
  s.style.left = (14 + Math.random()*68) + '%';
  s.style.bottom = (26 + Math.random()*28) + '%';
  wrap.appendChild(s);
  setTimeout(()=>s.remove(), 1200);
}
function hbLoop(now){
  if(homeView.hidden || $('house-buddy').hidden || document.hidden){ hbRaf = null; return; }
  hbRaf = requestAnimationFrame(hbLoop);
  /* กำลังมีท่าใหญ่อยู่ไหม → วาดทุกเฟรม ไม่งั้นจำกัดที่ 24fps */
  const busy = hbWaveK>0 || hbJumpK>0 || hbHopK>0;
  if(!busy && now - hbLast < HB_IDLE_MS) return;
  const dt = Math.min(.05, (now - hbLast)/1000 || .016);
  hbLast = now; hbT += dt;
  const t = hbT;

  if(hbChar){
    const u = hbChar.userData;
    u.rig.position.y = Math.sin(t*2.4)*.03;                       /* หายใจ */
    u.rig.rotation.z = Math.sin(t*.75)*.018;                      /* โยกตัวช้าๆ ให้ดูมีชีวิต */

    hbWaveT -= dt;
    if(hbWaveT<=0 && hbWaveK<=0){ hbWaveK = HB_WAVE_DUR; hbWaveT = 5 + Math.random()*4; }
    const swing = Math.sin(t*2.4)*.03;                            /* แขนแกว่งตามจังหวะหายใจ */
    let armLT = -.16 - swing, armRT = .16 + swing, headT = Math.sin(t*1.1)*.05;
    if(hbWaveK>0){                                                /* โบกมือทักทาย */
      hbWaveK = Math.max(0, hbWaveK - dt);
      /* ยกแขนขึ้น-ลงด้วย ease (เดิมเป็นเส้นตรง หัว-ท้ายจะสะดุด) แล้วค่อยสะบัดมือ */
      const k = hbEase(Math.min((HB_WAVE_DUR-hbWaveK)*2.6, hbWaveK*2.6));
      armRT = (1-k)*armRT + k*(2.35 + Math.sin(t*13)*.38);
      headT += k*.07;                                             /* เอียงหัวเข้าหามือที่โบก */
    }
    /* ไล่เข้าหาเป้าแบบ exponential — ท่าเปลี่ยนกลางคันก็ไหลต่อเนื่อง ไม่กระชาก */
    hbArmL  = hbDamp(hbArmL,  armLT, 16, dt);
    hbArmR  = hbDamp(hbArmR,  armRT, 16, dt);
    hbHeadZ = hbDamp(hbHeadZ, headT, 10, dt);
    u.arms[0].rotation.z = hbArmL;
    u.arms[1].rotation.z = hbArmR;
    u.head.rotation.z = hbHeadZ;

    if(hbJumpK>0){                                                /* กระโดดดีใจตอนแตะ */
      hbJumpK = Math.max(0, hbJumpK - dt*2.4);
      const p = 1 - hbJumpK;                                      /* 0 → 1 ตลอดจังหวะกระโดด */
      hbChar.position.y = Math.sin(p*Math.PI)*.32;
      const sq = Math.sin(p*Math.PI*2)*.07;                       /* ยืดตอนพุ่งขึ้น หดตอนลงพื้น */
      hbChar.scale.set(1-sq, 1+sq, 1-sq);
      if(hbJumpK===0){ hbChar.position.y = 0; hbChar.scale.set(1,1,1); }
    }
  }

  if(hbPet){
    const u = hbPet.userData.anim || {};
    hbHopT -= dt;
    if(hbHopT<=0 && hbHopK<=0){ hbHopT = 1.8 + Math.random()*2.4; hbHopK = HB_HOP_DUR; }
    if(hbHopK>0){                                                 /* เด้งหยองๆ เป็นพักๆ */
      hbHopK = Math.max(0, hbHopK - dt);
      const p = 1 - hbHopK/HB_HOP_DUR;
      hbPet.position.y = Math.sin(p*Math.PI)*.16;
      const sq = Math.sin(p*Math.PI*2)*.09;
      hbPet.scale.set(1-sq, 1+sq, 1-sq);
      hbPet.rotation.x = -Math.sin(p*Math.PI)*.12;                /* เงยหน้าตอนลอย */
      if(hbHopK===0){ hbPet.position.y = 0; hbPet.scale.set(1,1,1); hbPet.rotation.x = 0; }
    }
    if(u.tail) u.tail.rotation.z = Math.sin(t*7)*.3 + Math.sin(t*11.3)*.06;   /* หางสะบัดมีจังหวะรอง */
    if(u.wings) u.wings.forEach(w=>{
      const flap = hbHopK>0 ? Math.sin(t*22)*.6 : Math.sin(t*3)*.1;
      w.rotation.z = hbDamp(w.rotation.z, flap*w.userData.side, 24, dt);      /* ปีกไม่กระตุกตอนเริ่ม/หยุดเด้ง */
    });
    if(u.head){
      hbPetHeadZ = hbDamp(hbPetHeadZ, Math.sin(t*1.4)*.06, 10, dt);
      u.head.rotation.z = hbPetHeadZ;
    }
  }

  hbMsgT -= dt;                                                   /* สลับข้อความให้กำลังใจ */
  if(hbMsgT<=0){ hbShowMsg(); hbMsgT = 8; }
  hbSparkT -= dt;                                                 /* ประกายวิบวับรอบตัว */
  if(hbSparkT<=0){ hbSpark('✨'); hbSparkT = 3.5 + Math.random()*3; }
  hbRenderer.render(hbScene, hbCam);
}
function houseBuddyRefresh(){
  const wrap = $('house-buddy');
  if(!wrap) return;
  let data = null;
  try{
    if(typeof activeChild !== 'undefined' && activeChild)
      data = JSON.parse(localStorage.getItem(HOUSE_KEY(activeChild.id)) || 'null');
  }catch(e){}
  if(!data || !data.char){
    wrap.hidden = true;
    if(hbRaf){ cancelAnimationFrame(hbRaf); hbRaf = null; }
    return;
  }
  if(!hbInit()){ wrap.hidden = true; return; }
  wrap.hidden = false;
  const key = activeChild.id + '|' + JSON.stringify(data.char) + '|' + JSON.stringify(data.pet||null);
  if(key !== hbKey){
    hbKey = key;
    if(hbChar){ hbScene.remove(hbChar); disposeGroup(hbChar); hbChar = null; }
    if(hbPet){ hbScene.remove(hbPet); disposeGroup(hbPet); hbPet = null; }
    hbChar = buildCharacter(data.char);
    hbChar.position.set(data.pet ? -.45 : 0, 0, 0);
    hbChar.rotation.y = data.pet ? .3 : .1;
    hbScene.add(hbChar);
    hbShadC.position.x = hbChar.position.x;
    hbPetName = '';
    if(data.pet){
      hbPet = buildPet(data.pet.type, data.pet.color||0);
      hbPet.position.set(.62, 0, .12);
      hbPet.rotation.y = -.4;
      hbScene.add(hbPet);
      hbPetName = data.pet.name || '';
    }
    hbShadP.visible = !!hbPet;
    if(hbPet) hbShadP.position.set(hbPet.position.x, .01, hbPet.position.z);
    /* สร้างตัวใหม่แล้ว → ล้างค่าที่ค้างจากตัวเก่า ไม่งั้นเฟรมแรกจะเห็นแขน/หัวไหลจากท่าเดิม */
    hbArmL = hbArmR = hbHeadZ = hbPetHeadZ = 0;
    hbWaveK = hbJumpK = hbHopK = 0;
  }
  hbMsgT = .5;                            /* โชว์ข้อความแรกไวๆ หลังกลับเข้าหน้าหลัก */
  if(!hbRaf){ hbLast = performance.now(); hbRaf = requestAnimationFrame(hbLoop); }
}
window.houseBuddyRefresh = houseBuddyRefresh;
/* กลับมาที่แท็บนี้อีกครั้ง → ปลุกลูปเพื่อนซี้ที่หยุดไปตอนแท็บถูกซ่อน */
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden || hbRaf) return;
  const wrap = $('house-buddy');
  if(!wrap || wrap.hidden || homeView.hidden) return;
  hbLast = performance.now();
  hbRaf = requestAnimationFrame(hbLoop);
});
$('house-buddy-canvas').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  hbJumpK = 1; hbWaveK = HB_WAVE_DUR; hbHopK = HB_HOP_DUR;        /* เด้งดีใจกันทั้งคู่ */
  hbShowMsg(); hbMsgT = 8;
  const em = ['💖','⭐','✨','💛','🌟'];
  for(let i=0;i<5;i++) setTimeout(()=>hbSpark(em[Math.floor(Math.random()*em.length)]), i*90);
});

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
/* app.js โหลดไฟล์นี้แบบ lazy ตอนกดเข้าบ้านครั้งแรก จึง expose ให้เรียกจากภายนอกได้
   และผูก listener ของตัวเองไว้สำหรับการกดครั้งต่อๆ ไป */
window.startHouseGame = startHouseGame;
$('house-entry-btn').addEventListener('click', startHouseGame);
$('hq-close').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); closeQuestBoard(); });
$('hq-claim').addEventListener('click', claimQuestReward);
$('house-back').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); if(editMode){ exitEditMode(); return; } stopHouseGame(); });
$('house-edit-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode!=='creator') fadeSwap(()=>openCreator(true));
});
$('house-decorate-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode==='world' && !editMode) enterEditMode();
});
$('house-compass').addEventListener('click', compassGoHome);
$('house-edit-done').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); exitEditMode(); });
$('house-edit-rotate').addEventListener('click', rotateSel);
$('house-edit-delete').addEventListener('click', deleteSel);
$('house-done-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  fadeSwap(()=>closeCreator());
});
$('house-pet-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode==='world') fadeSwap(()=>openPetPicker());
});
$('house-pet-done').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  fadeSwap(()=>closePetPicker('adopt'));
});
$('house-pet-skip').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  fadeSwap(()=>closePetPicker(null));
});
$('house-pet-remove').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  fadeSwap(()=>closePetPicker('remove'));
});
$('house-pet-name-input').addEventListener('input', ()=>{ petNameDirty = true; });
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

/* หน้าหลักเปิดค้างอยู่แล้วตอนไฟล์นี้โหลดเสร็จ (เช่น reload กลางเซสชัน) → โชว์เพื่อนซี้เลย
   กรณีปกติ (เลือกโปรไฟล์เด็กก่อน) renderHome ใน app.js จะเรียกให้เอง */
if(!homeView.hidden) houseBuddyRefresh();
})();
