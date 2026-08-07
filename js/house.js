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
  H_SKIN, H_HAIR_COLORS, H_EYE_COLORS, H_SHIRT_COLORS, H_BOTTOM_COLORS, H_SHOE_COLORS, H_ACC_COLORS,
  H_PATTERN_N, H_HAT_N, H_GLASS_N, H_BAG_N, H_HOLD_N,
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
  BOAT_SPOTS, BEACH_RACKS, FISH_RACKS, ANIMAL_PENS, FARM_ANIMALS, FARM_PROPS, FIXED_PLANTS,
  SHOP_PETS, PET_PEN_PROPS, FOOD_SIGN,
  PLAYGROUND, PLAY_SIGN, PLAY_GATE, PLAY_ITEMS, inPlayground, isPlayItemTile, isPlayFenceTile,
  POND_DUCKS, POND_PIER, FISHER_TILE, PLAZA2, STAGE, BANNER_POLES,
  BENCH_SPOTS, CART_SPOTS, SCHOOL_BOX, SCHOOL_LOT, SCHOOL_GATE, SCHOOL_FLAG,
  MARKET, inMarket, MARKET_SIGNS, MARKET_BUNTING,
  CARPENTER_PROPS, CARPENTER_YARD, CARPENTER_ROAM, CAMP, CAMP_TENTS, CAMP_FIRE, CAMP_PROPS,
  FLOWER_BEDS, FLOWER_FIELD, FLOWER_FIELD_PATH,
  SUNFLOWER_FIELDS,
  FIELD_ROW_COLORS, FLOWER_MEADOW, FLOWER_WEST, FOOD_DECK, FOOD_FLOWER_COL, MEADOW_TRAILS, POOL, POOL_DECK, POOL_PROPS,
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
  if(inMarket(x, z)) return true;               /* ลานตลาด: ของฉากสุ่ม (ต้นไม้/พุ่ม/เห็ด) ห้ามงอกแทรกกลางตลาด */
  return hit(BENCH_SPOTS) || hit(CART_SPOTS) || hit(FARM_PROPS) || hit(BANNER_POLES) || hit(FISH_RACKS)
      || hit(NPC_STAND) || isQuestBoardTile(x, z) || inFlowerBed(x, z) || hit(CARPENTER_PROPS)
      || inPool(x, z) || hit(POOL_PROPS)
      || (x===SCHOOL_FLAG.x && z===SCHOOL_FLAG.z) || isSchoolFenceTile(x, z)
      || (x>=STAGE.x0 && x<=STAGE.x1 && z>=STAGE.z0 && z<=STAGE.z1)
      || isLampTile(x, z) || isHedgeTile(x, z)   /* เสาไฟ/แนวพุ่มไม้จองช่องไว้ ของฉากสุ่มห้ามงอกทับ */
      || hit(CAMP_PROPS) || (x===CAMP_FIRE.x && z===CAMP_FIRE.z);
}

/* ---------- ที่นั่งของฉากตายตัว (ม้านั่ง + เก้าอี้ผ้าใบชายหาด) ----------
   ของพวกนี้ถูก merge geometry รวมกับฉากไปแล้ว (ไม่มี group ของตัวเอง) จึงเก็บแค่ "ช่อง + ทิศ" ไว้
   แตะแล้วสร้าง group จำลอง {position, rotation, userData} ส่งให้ startSit ที่ใช้แค่ 3 ค่านี้ */
const seatMap = new Map();
const SEAT_ITEMS = {
  bench: {id:'scene-bench', name:'ม้านั่ง',      sit:{sy:.56, dz:-.06}},
  deck:  {id:'scene-deck',  name:'เก้าอี้ผ้าใบ', sit:{sy:.58, dz:.16, lean:-.36, legBend:-.5}},   /* dz บวก = นั่งค่อนมาทางหน้าเก้าอี้ ไม่งั้นพอเอนแล้วหลังทะลุพนัก */
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
let creatorKeyLight, creatorFillLight, creatorGlow;   /* ไฟส่องตัวละคร/สัตว์เลี้ยงบนแท่น (สว่างเฉพาะกลางคืน) */
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
  let dirty = false;
  if(d && (d.mapV || 1) < MAP_V){ d = migrateHouseMap(d); dirty = true; }
  /* เฟส 1 เศรษฐกิจ: ของที่เด็กวางไว้/ใส่อยู่แล้วต้องนับเป็น "ซื้อแล้ว" ทั้งหมด ห้ามหายหลังอัปเดต
     (ทำครั้งเดียวต่อเด็ก แล้วปั๊ม econVer — ครั้งถัดๆ ไป SHOP.migrate คืน false ทันที) */
  if(d && SHOP && SHOP.migrate(d)) dirty = true;
  if(dirty){
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

/* ร้านค้า/เศรษฐกิจเฟส 1 (js/house-shop.js โหลดก่อนไฟล์นี้) — ตารางราคา + คลังสิทธิ์ + migration + หน้าร้าน
   ไฟล์นั้นไม่แตะ localStorage เอง ใช้ load/save ที่ส่งไปให้ตรงนี้ (ข้อมูลจึงอยู่ก้อนเดียวกับบ้าน export ตามไปเอง) */
const SHOP = (typeof window.HOUSE_SHOP === 'function')
  ? window.HOUSE_SHOP({
      FURN, H_ROWS, H_DEFAULT_CHAR,
      load: loadHouseData, save: saveHouseData,
      childId: ()=> (activeChild ? activeChild.id : ''),
      onChange: onShopChange,
    })
  : null;
/* ซื้อของเสร็จ → กล่องเลือกของ/หน้าแต่งตัวที่เปิดค้างอยู่ต้องปลดล็อกตามทันที */
function onShopChange(){
  if(editMode) renderEditItems();
  if(hMode === 'creator' && creatorCfg) buildCreatorRows(creatorCfg);
}

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
/* หัวใจแบนๆ (พู่ 2 ลูก + ปลายแหลม) — ใช้ทั้งลายเสื้อและแว่นหัวใจ */
function chHeart(s, col){
  const g = new THREE.Group();
  [-1,1].forEach(k=>{ const lb = sphere(s*.52, col, 10); lb.scale.z = .3; lb.position.set(k*s*.4, s*.3, 0); g.add(lb); });
  const tip = cone(s*.78, s*1.05, col, 12); tip.rotation.z = Math.PI; tip.scale.z = .3; tip.position.y = -s*.16; g.add(tip);
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
  }
}
/* ---------- ทรงผมประจำหมวก ----------
   ⚠ ผู้ใช้แจ้ง 2026-08-04: หมวกที่ครอบหัวจริง (แก๊ป/ไหมพรม/ฟาง) เดิมมีผมทรงที่เลือกทะลุออกมาทุกใบ
     เพราะเปลือกผม (hairShell) สูง .5+ กว้าง .8-.86 ใหญ่กว่าตัวหมวก
     ⇒ หมวก 3 แบบนี้ให้ **ซ่อนทรงผมที่เลือก** แล้ววาดผมชุดนี้แทน (โผล่เฉพาะขอบหมวก: หน้าม้า/ข้างหู/ท้ายทอย)
       **ต้องใช้สีผมที่เด็กเลือกเสมอ ห้าม hardcode สี** ส่วนหมวกที่เป็นที่คาดผม/มงกุฎ/หมวกปาร์ตี้
       ไม่ครอบหัว จึงยังโชว์ทรงผมที่เลือกได้ตามปกติ */
const HAT_COVER_HAIR = new Set([1,2,3]);
function addHatHair(head, style, c, girl){
  /* หมวกอ้างอิงค่านี้แทนเปลือกผม → สวมพอดีหัวจริง ไม่ลอยสูงเหมือนตอนมีผมหนาอยู่ข้างใต้ */
  head.userData._hairTop = .46; head.userData._hairW = .70;
  /* เปลือกผม "ชิ้นเดียวต่อเนื่อง" คลุมข้าง+ท้ายทอยรอบเดียวจบ
     (เดิมแยกเป็นก้อนท้ายทอย + ก้อนข้างหู มองแล้วขาดเป็นช่วงๆ ไม่ต่อกัน — ผู้ใช้แจ้ง 2026-08-04)
     ลึกแค่ z +.24 เพื่อไม่ให้ล้ำมาบังหน้า (หน้าอยู่ z .33) */
  const shell = box(.76,.46,.7, c, .22); shell.position.set(0,.02,-.05); head.add(shell);
  if(style === 2){                                   /* ไหมพรม: โผล่หน้าผากนิดเดียว */
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
      /* มงกุฎ "วางบนหัว" ไม่ใช่ห่วงคาดรอบผม (ผู้ใช้แจ้ง 2026-08-04) → วงเล็กกว่าหัว ตั้งอยู่บนยอด */
      const CR = R*.62;
      const ring = cyl(CR,CR,.12, col, 16); ring.position.y = HT+.02; head.add(ring);
      const rim = torus(CR,.028, petShade(col,.82), 16); rim.rotation.x = Math.PI/2; rim.position.y = HT-.04; head.add(rim);
      for(let i=0;i<6;i++){
        const a = i/6*Math.PI*2, sx = Math.cos(a)*CR, sz = Math.sin(a)*CR;
        const sp = cone(.06,.17, col, 6); sp.position.set(sx, HT+.16, sz); head.add(sp);
        const gm = sphere(.032, 0xff5c8a, 8); gm.position.set(sx*1.03, HT+.25, sz*1.03); head.add(gm);
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
      [-1,1].forEach(s=>{ const h = chHeart(.145, 0xff8fb0); h.position.set(EX*s, EY, Z); head.add(h);
        const rim = torus(.135,.02, col, 16); rim.position.set(EX*s, EY, Z-.01); head.add(rim); });
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
  skull.castShadow = hShadows; head.add(skull);
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
  if(inMarket(x, z)) return true;                          /* ลานตลาดรถเข็นหน้าโรงเรียน (ปูหินเต็มบล็อก) */
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
  if(inBox(FOOD_DECK, x, z)) return false;                      /* ลานโต๊ะหน้าร้านอาหาร — ต้องโล่ง เดินนั่งได้ */
  /* ทุ่งดอกทานตะวัน = แปลงที่จัดไว้แล้ว ห้ามต้นไม้/พุ่มสุ่มงอกแทรก (ถ้าปล่อยให้งอก ช่องนั้นจะเสียทานตะวันไป
     1 ต้นเพราะทุ่งข้ามช่องที่ถูกจองไปแล้ว — และการ ban ต้นนั้นทีหลังจะทำให้ป่าเด้งไปงอกช่องข้างๆ ในแปลงแทน) */
  if(SUNFLOWER_FIELDS.some(f => inBox(f, x, z))) return false;
  if(inBox(CAMP, x, z)) return false;                           /* ลานตั้งแคมป์ต้องโล่ง (ต้นไม้ล้อมอยู่รอบนอกกรอบแล้ว) */
  if(inBox(FOOD_FLOWER_COL, x, z)) return false;                /* แถวข้างลาน เอาไว้ปลูกดอกไม้ล้วน ไม่เอาต้นไม้ */
  if(penAt(x, z)) return false;                                 /* คอกสัตว์ในฟาร์ม (รวมรั้ว) */
  if(inPlayground(x, z)) return false;                          /* สนามเด็กเล่น — พื้นสนามต้องโล่ง ไม่ให้ต้นไม้/พุ่มสุ่มงอกกลางสนาม */
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
   (เดิมกันแค่ 3 ช่องกลางประตู ต้นไม้เยื้องไปข้างๆ ยังบังหน้าร้านอยู่ — ผู้ใช้แจ้งเรื่องหน้าร้านล็อต shop-mart) */
function inLotFrontStrip(x, z){
  for(let i=0; i<VILLAGE_LOTS.length; i++){
    const l = VILLAGE_LOTS[i];
    /* ล็อตที่หันหน้าไป +x (face:'x' — เฟอร์นิเจอร์มอลล์) แถบหน้าร้านอยู่คอลัมน์ x1+1..x1+2 แทน */
    if(l.face === 'x'){
      if(z>=l.z0-1 && z<=l.z1+1 && x>=l.x1+1 && x<=l.x1+2) return true;
    } else if(x>=l.x0-1 && x<=l.x1+1 && z>=l.z1+1 && z<=l.z1+2) return true;
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
const WILD_BAN = new Set(['54,22', '11,19', '3,31', '4,31', '5,31', '7,29', '6,32', '3,35', '4,35', '5,39', '5,40', '8,49', '9,49', '34,61', '35,60',
  /* ทุ่งโล่งฝั่งตะวันออกของตึกแล็บ — ถอนต้นสน 2 ต้น (26,47 / 27,47) กับพุ่มเล็ก (27,48) ออกตามคำขอผู้ใช้
     (2026-08-03) เปิดที่ให้แนวพุ่มไม้จัดสวน x27 กับทุ่งทานตะวัน x25-26 ลงแทน */
  '26,47', '27,47', '27,48']);
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
  const put = (id, x, z, gate, fixed) => {
    const k = x+','+z;
    if(taken.has(k) || WILD_BAN.has(k)) return false;
    if(!(gate ? gate(x, z) : wildPlantable(x, z, WILD_TALL.includes(id)))) return false;
    taken.add(k);
    list.push({id, x, z, rot:(x*7+z*13)%4, col:(x+z)%4, fixed:!!fixed});
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
  /* ช่องที่ผู้ใช้เลือกเอง: ข้ามกติกาเว้นระยะถนน/อาคาร แต่ยังห้ามทับถนน ล็อตอาคาร และผืนน้ำ */
  FIXED_PLANTS.forEach(([x,z,kind])=>put(kind, x, z, (px, pz)=>
    !isVillageRoadTile(px, pz) && !isPlazaTile(px, pz) && !lotAt(px, pz, 0) &&
    !isPondTile(px, pz) && !isSeaTile(px, pz) && !isCanalTile(px, pz), true));
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
  /* ของที่ผู้ใช้เลือกช่องเอง (fixed) ข้ามตัวกรองกติกาป่าเสมอ — ไม่งั้นต้นที่สั่งให้ปลูกริมสถานีตำรวจ
     จะโดนข้อ "ห่างอาคาร 4 ช่อง" ตัดทิ้งเงียบๆ (เคยเจอกับต้นไม้ x61,z46 มาแล้ว) */
  wildLayoutCache = relieveWildPinch(list)
    .filter(r => !WILD_BAN.has(r.x+','+r.z))
    .filter(r => r.fixed || !WILD_TALL.includes(r.id) || wildPlantable(r.x, r.z, true) || villageEdgePlantable(r.x, r.z));
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
        .map(([nx, nz])=>owner.get(nx+','+nz)).filter(r=>r && !dead.has(r) && !r.fixed);   /* ของที่ผู้ใช้เลือกเองห้ามถอน */
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
SIGN_ICONS.push('🎠');                     /* ป้ายสนามเด็กเล่นกลางเมือง */
SIGN_ICONS.push('🍢');                     /* ป้ายตลาดรถเข็นหน้าโรงเรียน */
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

/* ==================== สนามเด็กเล่นกลางเมือง ====================
   เครื่องเล่นทุกชิ้นเป็นกลุ่มของตัวเอง **ไม่ merge รวมกับฉากตายตัว** เพราะต้องขยับได้ทุกเฟรม
   ชิ้นที่ "นั่งเล่นได้จริง" ฝัง userData ไว้ให้ระบบนั่งของเฟอร์นิเจอร์ (startSit) ใช้ต่อได้เลย:
     swingPiv/swingSeat = แกนแกว่ง + จุดที่เด็กนั่ง (ชิงช้า/กระดานหก/ม้าโยก — item.rock)
     spinPiv/spinSeat   = แกนหมุน + จุดที่เด็กนั่ง (ม้าหมุน — item.spinRide)
   ที่นั่งอยู่สูงจากพื้นเท่าไร ตัวเด็กจะไปอยู่ที่ "ความสูงที่นั่ง − 0.4" เสมอ (จุดกำเนิดตัวละคร = ฝ่าเท้า) */
const PLAY_POST = 0xfdfbf5, PLAY_BAR = 0x7fc4e8;      /* เสาครีม + ราวฟ้า ให้เข้าชุดกับรั้ว/ซุ้มในเมือง */

/* ชิงช้า 2 ที่นั่ง — เด็กนั่งที่นั่งซ้าย (ที่นั่งขวาไกวตามลมของมันเอง)
   ขาตั้งทรงตัว A เอียงในแนว z แกนเดียว (ยอดชนคานบน ปลายล่างถ่างออก) ไม่หมุนหลายแกนซ้อนกัน */
function buildSwingSet(){
  const g = new THREE.Group();
  const H = 1.72, spread = .58, legLen = Math.hypot(H, spread), lean = Math.asin(spread/legLen);
  [-1,1].forEach(sx=>{
    [-1,1].forEach(sz=>{
      const leg = cyl(.075,.085, legLen, PLAY_POST, 10);
      leg.position.set(sx*1.05, H/2, sz*spread/2);
      leg.rotation.x = -sz*lean; g.add(leg);
    });
  });
  const bar = cyl(.09,.09,2.46, PLAY_BAR, 10); bar.rotation.z = Math.PI/2; bar.position.y = H; g.add(bar);
  [-1,1].forEach(sx=>{ const cap = sphere(.13, 0xef8fa5, 10); cap.position.set(sx*1.24, H, 0); g.add(cap); });
  const seats = [];
  [-1,1].forEach((sx,i)=>{
    const piv = new THREE.Group(); piv.position.set(sx*.5, H - .06, 0); g.add(piv);
    [-1,1].forEach(sd2=>{      /* โซ่ 2 เส้นเกาะขอบซ้าย-ขวาของที่นั่ง (เดิมไปอยู่หน้า-หลัง ดูไม่เหมือนชิงช้า) */
      const rope = box(.05,1.02,.05, 0xd8dee3,.02); rope.position.set(sd2*.22,-.51,0); piv.add(rope);
    });
    const seat = box(.5,.09,.36, i ? 0xffd54f : 0xef8354, .04); seat.position.y = -1.02; piv.add(seat);
    const back = box(.5,.22,.06, i ? 0xffd54f : 0xef8354, .03); back.position.set(0,-.9,-.16); piv.add(back);
    const anc = new THREE.Object3D(); anc.position.set(0,-.96,0); piv.add(anc);
    seats.push({piv, anc});
  });
  g.userData.swingPiv = seats[0].piv;  g.userData.swingSeat = seats[0].anc;
  g.userData.playPivs = seats.map(s=>s.piv);           /* ใช้ไกวเบาๆ ตอนไม่มีใครเล่น */
  return g;
}

/* สไลเดอร์: บันไดด้านหลัง (-z) → ชานบน → รางลื่นลาดลงมาทางหน้า (+z)
   ทุกชิ้นเอียงรอบแกน x แกนเดียว และคำนวณมุมจากจุดต้น-ปลายจริง ให้ต่อกันพอดีไม่ลอย */
function buildSlide(){
  const g = new THREE.Group();
  const H = 1.24, dz = -.62;                            /* ความสูงชาน + ตำแหน่ง z ของชาน */
  const deck = box(.94,.12,.94, 0xffd54f,.04); deck.position.set(0,H,dz); g.add(deck);
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>{
    const p = cyl(.07,.07,H, PLAY_POST,10); p.position.set(sx*.34, H/2, dz + sz*.34); g.add(p);
  }));
  [-1,1].forEach(sx=>{                                  /* ราวกันตกซ้าย-ขวา + ลูกกลมยอดเสา */
    const rail = box(.07,.5,.94, PLAY_BAR,.03); rail.position.set(sx*.44, H+.31, dz); g.add(rail);
    const cap = sphere(.1, 0xef8fa5,10); cap.position.set(sx*.44, H+.58, dz); g.add(cap);
  });
  /* บันได: จากพื้นที่ z = dz-.95 ขึ้นไปจรดขอบหลังชาน */
  const lz = .82, lLen = Math.hypot(H, lz), lAng = Math.asin(lz/lLen);
  [-1,1].forEach(sx=>{
    const rail = cyl(.055,.055,lLen, PLAY_BAR,8);
    rail.position.set(sx*.3, H/2, dz - .12 - lz/2); rail.rotation.x = lAng; g.add(rail);
  });
  for(let i=1;i<=4;i++){
    const t = i/5, st = box(.66,.07,.16, 0xef8fa5,.03);
    st.position.set(0, t*H, dz - .12 - lz*(1-t)); st.rotation.x = lAng; g.add(st);
  }
  /* รางลื่น: จากขอบหน้าชาน (y=H) ลาดลงไปจบที่พื้นด้านหน้า */
  const sz0 = dz + .4, sz1 = dz + 2.12, sy1 = .12;
  const sLen = Math.hypot(H - sy1, sz1 - sz0), sAng = Math.asin((H - sy1)/sLen);
  const laneY = (H + sy1)/2, laneZ = (sz0 + sz1)/2;
  const lane = box(.74,.1,sLen, 0x7fc4e8,.05); lane.rotation.x = sAng; lane.position.set(0, laneY, laneZ); g.add(lane);
  [-1,1].forEach(sx=>{
    const sr = box(.09,.26,sLen, 0xfdfbf5,.03); sr.rotation.x = sAng; sr.position.set(sx*.41, laneY+.12, laneZ); g.add(sr);
  });
  const run = box(.74,.1,.6, 0x7fc4e8,.04); run.position.set(0, sy1, sz1 + .26); g.add(run);
  const pole = cyl(.04,.04,.55, PLAY_POST,8); pole.position.set(0, H+.5, dz); g.add(pole);
  const flag = new THREE.Group(); flag.position.set(0, H+.72, dz);
  const cloth = box(.34,.22,.04, 0xef8fa5,.02); cloth.position.x = .19; flag.add(cloth);
  g.add(flag); g.userData.playFlag = flag;
  return g;
}

/* ม้าหมุน: จานหมุน 4 ที่นั่ง มีพนัก+ราวจับ — เด็กขึ้นไปนั่งหมุนไปด้วยกันได้
   ที่นั่ง/พนัก/ราวหันออกนอกวงทุกตัว (rot = 90° − มุมของที่นั่ง) */
function buildCarousel(){
  const g = new THREE.Group();
  const base = cyl(1.34,1.4,.16, 0xe8dcc8,20); base.position.y = .08; g.add(base);
  const piv = new THREE.Group(); piv.position.y = .16; g.add(piv);
  const disc = cyl(1.24,1.24,.12, 0xfdfbf5,20); disc.position.y = .06; piv.add(disc);
  const ring = torus(1.2,.07, PLAY_BAR,20); ring.rotation.x = Math.PI/2; ring.position.y = .12; piv.add(ring);
  const pole = cyl(.1,.1,1.15, PLAY_POST,10); pole.position.y = .68; piv.add(pole);
  const knob = sphere(.17, 0xef8fa5,10); knob.position.y = 1.3; piv.add(knob);
  const cols = [0xef8354,0xffd54f,0x8fd694,0xef8fa5];
  let anc = null;
  for(let i=0;i<4;i++){
    const a = i*Math.PI/2, rot = Math.PI/2 - a;          /* หันหน้าออกนอกวง */
    const cx = Math.cos(a)*.74, cz = Math.sin(a)*.74;
    const seat = box(.5,.12,.44, cols[i],.05); seat.position.set(cx,.3,cz); seat.rotation.y = rot; piv.add(seat);
    const back = box(.5,.36,.1, cols[i],.04);
    back.position.set(Math.cos(a)*1.02,.52,Math.sin(a)*1.02); back.rotation.y = rot; piv.add(back);
    const bar = box(.42,.07,.07, PLAY_BAR,.03);
    bar.position.set(Math.cos(a)*.34,.6,Math.sin(a)*.34); bar.rotation.y = rot; piv.add(bar);
    const post = cyl(.05,.05,.5, PLAY_BAR,8); post.position.set(Math.cos(a)*.34,.36,Math.sin(a)*.34); piv.add(post);
    if(!i){ anc = new THREE.Object3D(); anc.position.set(cx,.42,cz); piv.add(anc); }
  }
  g.userData.spinPiv = piv; g.userData.spinSeat = anc;
  return g;
}

/* กระดานหก: ฐานทรงตัว A + กระดานกระดกรอบแกน x (เด็กนั่งปลายด้าน +z)
   เบาะกันกระแทกใต้ปลายทั้งสองข้างอยู่ "กับพื้น" ไม่ได้ติดไปกับกระดาน */
function buildSeesaw(){
  const g = new THREE.Group();
  const fh = .8, foot = .36;
  /* ขาฐาน 2 ข้าง: ปลายล่างถ่างออก ยอดชนแกนหมุนพอดี (คำนวณมุมจากจุดต้น-ปลายจริง ไม่ใช่เดามุม) */
  const legLen = Math.hypot(fh, foot), legAng = Math.asin(foot/legLen);
  [-1,1].forEach(sz=>{
    const leg = box(.32, legLen, .18, PLAY_POST,.06);
    leg.position.set(0, fh/2, sz*foot/2); leg.rotation.x = -sz*legAng; g.add(leg);
  });
  const hub = cyl(.14,.14,.5, 0xef8fa5,12); hub.rotation.z = Math.PI/2; hub.position.y = fh; g.add(hub);
  /* เบาะทรายรองใต้ปลายกระดาน (สีทราย ไม่ใช่เขียว — เขียวแบนๆ ดูเป็นแอ่งน้ำ) */
  [-1,1].forEach(sz=>{
    const pad = cyl(.26,.3,.12, 0xf0dcae,14); pad.position.set(0,.06,sz*1.0); g.add(pad);
    const rim = torus(.28,.04, 0xd9a86c,14); rim.rotation.x = Math.PI/2; rim.position.set(0,.12,sz*1.0); g.add(rim);
  });
  const piv = new THREE.Group(); piv.position.y = fh; g.add(piv);
  const plank = box(.44,.11,2.0, 0xffd54f,.04); piv.add(plank);
  [-1,1].forEach(sz=>{
    const c = sz>0 ? 0xef8354 : 0x7fc4e8;
    const seat = box(.46,.1,.42, c,.04); seat.position.set(0,.11,sz*.8); piv.add(seat);
    const back = box(.46,.3,.09, c,.03); back.position.set(0,.3,sz*1.0); piv.add(back);
    const post = cyl(.05,.05,.44, PLAY_BAR,8); post.position.set(0,.32,sz*.46); piv.add(post);
    const grip = box(.36,.06,.06, PLAY_BAR,.02); grip.position.set(0,.52,sz*.46); piv.add(grip);
  });
  const anc = new THREE.Object3D(); anc.position.set(0,.2,.8); piv.add(anc);
  g.userData.swingPiv = piv; g.userData.swingSeat = anc; g.userData.playPivs = [piv];
  return g;
}

/* ม้าโยกสปริง: ฐาน + สปริง + ตัวสัตว์ (เป็ดเหลือง / ม้าชมพู) หันหน้าไป +z โยกหน้า-หลัง */
function buildSpringRider(variant){
  const g = new THREE.Group();
  const duck = variant === 'duck';
  const c = duck ? 0xffd54f : 0xef8fa5, acc = duck ? 0xef8354 : 0xfdfbf5;
  const plate = cyl(.38,.42,.1, 0xe8dcc8,14); plate.position.y = .05; g.add(plate);
  for(let i=0;i<3;i++){
    const ring = torus(.13,.05, 0xd8dee3,10); ring.rotation.x = Math.PI/2; ring.position.y = .16 + i*.1; g.add(ring);
  }
  const piv = new THREE.Group(); piv.position.y = .46; g.add(piv);
  const body = box(.44,.36,.9, c,.16); body.position.y = .2; piv.add(body);
  const neck = box(.26,.34,.26, c,.1); neck.position.set(0,.44,.28); piv.add(neck);
  if(duck){
    const head = sphere(.23, c,12); head.position.set(0,.6,.42); piv.add(head);
    const bill = box(.26,.09,.26, acc,.03); bill.position.set(0,.52,.62); piv.add(bill);
    [-1,1].forEach(sd=>{ const wing = box(.08,.22,.42, acc,.07); wing.position.set(sd*.24,.22,.02); piv.add(wing); });
    const tail = box(.26,.2,.18, c,.07); tail.position.set(0,.34,-.46); piv.add(tail);
  }else{
    /* ม้า: คอตั้งเฉียงไปข้างหน้า + หัวยาวไปทาง +z + หูแหลม + แผงคอเรียงบนสันคอ */
    const head = box(.24,.26,.4, c,.09); head.position.set(0,.72,.5); head.rotation.x = -.2; piv.add(head);
    const muz = box(.2,.16,.16, acc,.06); muz.position.set(0,.66,.7); piv.add(muz);
    [-1,1].forEach(sd=>{ const ear = cone(.07,.18, c,8); ear.position.set(sd*.1,.92,.4); piv.add(ear); });
    for(let i=0;i<4;i++){
      const mane = box(.1,.2,.12, acc,.04); mane.position.set(0,.8-i*.11,.34-i*.11); mane.rotation.x = -.2; piv.add(mane);
    }
    const tail = box(.12,.4,.14, acc,.05); tail.rotation.x = .45; tail.position.set(0,.3,-.46); piv.add(tail);
  }
  [-1,1].forEach(sd=>{
    const eye = sphere(.045, 0x4a3b32,8); eye.position.set(sd*.12, duck ? .62 : .74, duck ? .58 : .62); piv.add(eye);
    const hd = cyl(.035,.035,.26, PLAY_BAR,8); hd.rotation.z = Math.PI/2; hd.position.set(sd*.13,.46,.14); piv.add(hd);
  });
  const anc = new THREE.Object3D(); anc.position.set(0,.44,0); piv.add(anc);
  g.userData.swingPiv = piv; g.userData.swingSeat = anc; g.userData.playPivs = [piv];
  return g;
}

/* บ่อทราย 2×2 ช่อง: ขอบไม้ + ทราย + ถัง พลั่ว ปราสาททราย (ปราสาทเด้งตอนเด็กมาเล่น) */
function buildSandbox(){
  const g = new THREE.Group();
  const sand = box(1.92,.12,1.92, 0xf0dcae,.04); sand.position.y = .07; g.add(sand);
  [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx,dz])=>{
    const rim = box(dx ? .22 : 2.1, .22, dz ? .22 : 2.1, 0xd9a86c,.06);
    rim.position.set(dx*.96, .12, dz*.96); g.add(rim);
  });
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{
    const cap = sphere(.15, 0xef8fa5,10); cap.scale.y = .8; cap.position.set(sx*.96,.26,sz*.96); g.add(cap);
  });
  const castle = new THREE.Group(); castle.position.set(.42,.13,-.3); g.add(castle);
  const keep = box(.44,.34,.44, 0xe8cd96,.05); keep.position.y = .17; castle.add(keep);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{
    const tw = cyl(.1,.11,.42, 0xe8cd96,10); tw.position.set(sx*.22,.21,sz*.22); castle.add(tw);
    const tp = cone(.13,.18, 0xef8354,10); tp.position.set(sx*.22,.5,sz*.22); castle.add(tp);
  });
  g.userData.playBounce = castle;
  const bucket = cyl(.16,.12,.2, 0x7fc4e8,12); bucket.position.set(-.5,.22,.34); g.add(bucket);
  const handle = torus(.16,.02, 0x5aa9e6,10); handle.position.set(-.5,.34,.34); g.add(handle);
  const shaft = cyl(.03,.03,.5, 0xef8fa5,8); shaft.rotation.z = .9; shaft.position.set(-.06,.3,.5); g.add(shaft);
  const scoop = box(.16,.04,.2, 0xffd54f,.03); scoop.rotation.z = .9; scoop.position.set(.16,.14,.5); g.add(scoop);
  return g;
}

/* พื้นยางกันกระแทกทั้งสนาม: แผ่นสลับ 2 เฉดพาสเทล (คนละโทนกับหญ้า เห็นชัดว่าเป็นสนามเด็กเล่น) */
function buildPlayFloor(w, d){
  const g = new THREE.Group();
  for(let z=0; z<d; z++) for(let x=0; x<w; x++){
    const t = box(.98,.06,.98, ((x>>1)+(z>>1))%2 ? 0xa8ddf0 : 0xffd4e0, .02);   /* บล็อก 2×2 ช่อง ลายไม่ถี่จนลายตา */
    t.position.set(x - (w-1)/2, .03, z - (d-1)/2); g.add(t);
  }
  return g;
}

/* รั้วรอบสนามเด็กเล่น: เสาครีม + ราวฟ้า + ยอดเสาลูกกลมเหลือง (คนละแบบกับรั้วคอกสัตว์/รั้วโรงเรียน) */
function buildPlayFencePiece(alongX, alongZ){
  const g = new THREE.Group();
  const post = box(.16,.92,.16, PLAY_POST,.05); post.position.y = .46; g.add(post);
  const cap = sphere(.11, 0xffd54f, 10); cap.position.y = .96; g.add(cap);
  [.36,.68].forEach(y=>{
    if(alongX){ const r = box(1.02,.1,.08, PLAY_BAR,.03); r.position.set(.5,y,0); g.add(r); }
    if(alongZ){ const r = box(.08,.1,1.02, PLAY_BAR,.03); r.position.set(0,y,.5); g.add(r); }
  });
  [.3,.5,.7].forEach(f=>{
    if(alongX){ const s2 = box(.07,.5,.06, PLAY_POST,.02); s2.position.set(f,.52,0); g.add(s2); }
    if(alongZ){ const s2 = box(.06,.5,.07, PLAY_POST,.02); s2.position.set(0,.52,f); g.add(s2); }
  });
  return g;
}
/* เสาประตูสนาม 2 ต้นขนาบทางเข้า (ทางเดียวของสนาม หันออกทางโรงพยาบาล) — ไม่มีคานพาด เดินเข้าได้ */
function buildPlayGate(){
  const g = new THREE.Group();
  [-1,1].forEach(sd=>{
    const p = box(.26,1.34,.26, PLAY_POST,.08); p.position.set(sd*1.0,.67,0); g.add(p);
    const c = sphere(.15, 0xffd54f,10); c.position.set(sd*1.0,1.42,0); g.add(c);
    const b = box(.46,.34,.09, 0xef8fa5,.05); b.position.set(sd*1.0,1.0,.16); g.add(b);
  });
  return g;
}

/* ป้ายสนามเด็กเล่นข้างประตู (ป้ายรูปม้าหมุนบนเสาคู่ — ตั้งตรง ไม่เอียง) */
function buildPlaySign(){
  const g = new THREE.Group();
  [-1,1].forEach(sd=>{ const p = cyl(.07,.07,1.1, PLAY_POST,10); p.position.set(sd*.34,.55,0); g.add(p);
    const c = sphere(.1, 0xef8fa5,10); c.position.set(sd*.34,1.14,0); g.add(c); });
  const board = box(1.0,.72,.1, 0xfdfbf5,.06); board.position.set(0,.94,.02); g.add(board);
  const sg = signPlane('🎠', .56); sg.position.set(0,.94,.09); g.add(sg);
  const bar = box(.9,.09,.06, PLAY_BAR,.03); bar.position.set(0,.52,.02); g.add(bar);
  return g;
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
  const flagP = new THREE.Group(); flagP.position.set(-bw/2-.5, 2.2, dz-.2);   /* จุดหมุนอยู่ที่เสา */
  const flag = box(.5,.34,.04,0x5aa9e6,.02); flag.position.x = -.33;            /* เว้นให้พ้นตัวเสา ไม่ทะลุ */
  flagP.add(flag); fxTag(flagP,'flag'); g.add(flagP);
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
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;      /* ล็อต 7×4 ช่อง */
  /* ล็อตขยายแล้ว: ตัวอาคารกินฝั่งตะวันตกของล็อต ที่เหลือฝั่งตะวันออกเป็น "ลานจอดรถสายตรวจ"
     (ของทุกชิ้นของตัวอาคารอยู่ในกลุ่มย่อย b → เลื่อนทั้งอาคารทีเดียว) */
  const bw = Math.min(w-.6, 4.6), bd = d-.7, fh = 1.16, bh = fh*2;
  const b = new THREE.Group(); b.position.x = -(w/2) + bw/2 + .35; g.add(b);
  const dz = bd/2;
  const body = box(bw, bh, bd, lot.wall, .07); body.castShadow = hShadows; body.position.y = bh/2; b.add(body);
  const base = box(bw+.1,.42,bd+.1, lot.roof,.04); base.position.y = .21; b.add(base);              /* ฐานน้ำเงิน */
  const band = box(bw+.06,.15,bd+.06, lot.roof,.03); band.position.y = fh; b.add(band);             /* คาดแบ่งชั้น */
  const top = box(bw+.04,.1,bd+.04,0xe8eef5,.03); top.position.y = bh-.02; b.add(top);
  const para = box(bw+.22,.22,bd+.22, lot.roof,.05); para.position.y = bh+.09; b.add(para);
  const winAt = (x, y)=>{
    const wf = box(.56,.62,.06,0xffffff,.03); wf.position.set(x, y, dz+.02); b.add(wf);
    const wi = box(.42,.48,.09,0xaadcf5,.02); wi.position.set(x, y, dz+.03); b.add(wi);
    const sl = box(.62,.07,.12, lot.roof,.02); sl.position.set(x, y-.36, dz+.06); b.add(sl);
  };
  [-1,1].forEach(s=> winAt(s*bw*.32, .95));            /* ชั้นล่างเว้นกลางไว้ทำประตู */
  [-1,1].forEach(s=> winAt(s*bw*.32, 1.86));           /* ชั้นบนเว้นกลางไว้ติดโล่ดาว */
  /* ประตูบานคู่ + มุขกันสาด 2 เสา + บันได */
  const dr = box(.9,1.08,.12, 0x2f4f8f,.03); dr.position.set(0,.54,dz+.03); b.add(dr);
  const dsp = box(.05,1.08,.15,0xf3e7d6); dsp.position.set(0,.54,dz+.06); b.add(dsp);
  [-1,1].forEach(s=>{ const kn = sphere(.045,0xffd54f,8); kn.position.set(s*.15,.52,dz+.11); b.add(kn); });
  const cvp = box(1.8,.13,.8, lot.roof,.05); cvp.position.set(0,1.42,dz+.36); b.add(cvp);
  [-1,1].forEach(s=>{
    const ps = cyl(.075,.075,1.36,0xf7f3ee,10); ps.position.set(s*.76,.68,dz+.66); b.add(ps);
    const lm = sphere(.1,0xfff2b0,10); lm.position.set(s*.76,1.5,dz+.66); b.add(lm);                /* โคมไฟข้างประตู */
  });
  const step = box(1.6,.1,.5,0xe8dcc8,.02); step.position.set(0,.05,dz+.42); b.add(step);
  /* โล่ดาวใหญ่กลางผนังชั้น 2 */
  const shd = cyl(.34,.34,.07, 0xffd54f, 5); shd.rotation.x = Math.PI/2; shd.position.set(0,1.9,dz+.04); b.add(shd);
  const shi = cyl(.25,.25,.08, 0xf7f3ee, 5); shi.rotation.x = Math.PI/2; shi.rotation.y = Math.PI/5; shi.position.set(0,1.9,dz+.08); b.add(shi);
  const shc = cyl(.12,.12,.09, lot.roof, 5); shc.rotation.x = Math.PI/2; shc.position.set(0,1.9,dz+.11); b.add(shc);
  /* ไฟสัญญาณแดง-น้ำเงินบนหลังคา */
  const bar = box(.8,.14,.32,0xf7f3ee,.04); bar.position.set(0, bh+.28, dz*.4); b.add(bar);
  [[-.2,0xe4574a],[.2,0x5aa9e6]].forEach(p=>{
    const lp = sphere(.12,p[1],10); lp.scale.y = .8; lp.position.set(p[0], bh+.38, dz*.4); b.add(lp);
  });
  /* เสาธงข้างอาคาร */
  const pole = cyl(.045,.045,2.2,0xdfe6ea,8); pole.position.set(-bw/2-.42,1.1,dz-.3); b.add(pole);
  const flagP = new THREE.Group(); flagP.position.set(-bw/2-.42, 2.02, dz-.3);
  const flag = box(.44,.3,.04,0x5aa9e6,.02); flag.position.x = -.3;
  flagP.add(flag); fxTag(flagP,'flag'); b.add(flagP);
  const knb = sphere(.06,0xffd54f,8); knb.position.set(-bw/2-.42,2.24,dz-.3); b.add(knb);
  /* กรวยจราจร 2 อันหน้าสถานี */
  [-1,1].forEach(s=>{
    const cb = box(.3,.05,.3,0xf7f3ee,.02); cb.position.set(s*bw*.36,.03,dz+.62); b.add(cb);
    const cn = cone(.13,.42,0xef8354,10); cn.position.set(s*bw*.36,.26,dz+.62); b.add(cn);
    const rg = cyl(.11,.115,.07,0xfffaf0,10); rg.position.set(s*bw*.36,.26,dz+.62); b.add(rg);
  });
  /* ป้ายสถานีบนดาดฟ้า */
  const sbf = box(1.4,.74,.06, lot.roof,.05); sbf.position.set(0, bh+.52, dz+.02); b.add(sbf);
  const sbg = box(1.28,.62,.1,0xfffaf0,.05); sbg.position.set(0, bh+.52, dz+.06); b.add(sbg);
  const sg = signPlane(lot.icon,.54); sg.position.set(0, bh+.52, dz+.13); b.add(sg);
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  /* ---- ลานจอดรถสายตรวจฝั่งตะวันออกของล็อต ---- */
  const px = (w/2) - 1.15, pd = Math.min(d-.8, 3.2);
  const apron = box(2.0, .07, pd, 0xdfe4ea, .03); apron.position.set(px, .035, -.1); g.add(apron);
  for(let i=0;i<3;i++){                                 /* เส้นตีช่องจอด */
    const ln = box(1.7,.03,.09, 0xfdfbf5,.01); ln.position.set(px, .075, -.1 + (i-1)*(pd/3)); g.add(ln);
  }
  const car = new THREE.Group(); car.position.set(px, 0, -.1); car.rotation.y = .1; g.add(car);
  const cbody = box(.86,.34,1.72, 0xfdfbf5,.12); cbody.position.y = .38; car.add(cbody);
  const cband = box(.9,.16,1.0, lot.roof,.06); cband.position.set(0,.34,0); car.add(cband);
  const cabin = box(.74,.3,.86, 0xbfe8f7,.1); cabin.position.set(0,.68,-.08); car.add(cabin);
  const cbar = box(.5,.1,.16, 0xf7f3ee,.04); cbar.position.set(0,.87,-.08); car.add(cbar);
  [[-.13,0xe4574a],[.13,0x5aa9e6]].forEach(([ox,c])=>{
    const lp = sphere(.08,c,8); lp.scale.y = .8; lp.position.set(ox,.9,-.08); car.add(lp);
  });
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sz])=>{
    const wh = cyl(.19,.19,.14, 0x4a4a4a,12); wh.rotation.z = Math.PI/2;
    wh.position.set(sx*.44,.19,sz*.56); car.add(wh);
  });
  [-1,1].forEach(sz=>{ const lt = box(.6,.1,.08, sz>0 ? 0xfff2b0 : 0xe4574a,.03);
    lt.position.set(0,.42,sz*.87); car.add(lt); });
  const star = cyl(.13,.13,.05, 0xffd54f,5); star.rotation.y = .3; star.rotation.z = Math.PI/2;
  star.position.set(.44,.42,0); car.add(star);
  return g;
}
/* ---------- ตึกแล็บวิทยาศาสตร์ (kind 'lab' — ล็อต 6×5 ช่อง เหนือตลาดรถเข็น) ----------
   ตึกขาว 2 ชั้นหลังคาแบน + โดมดูดาวมีกล้องโทรทรรศน์โผล่ + ขวดทดลองยักษ์เดือดปุดๆ บนดาดฟ้า
   (บทพูดของ ดร.ต้น กับพี่ผู้ช่วยแล็บ พูดถึงโดมกับขวดบนหลังคาไว้ ต้องมีของจริงให้เด็กมองเห็น)
   หน้าตึกหันไป +z (เข้าหากล้องไอโซ + หันออกถนนคนเดินของตลาด) ⇒ ของตกแต่งที่อยากให้เห็นต้องอยู่ฝั่ง +z เท่านั้น
   ใช้โทนขาว-ฟ้าของล็อต ตัดด้วยน้ำยาทดลองสีลูกกวาด (เขียว/ชมพู/เหลือง/ม่วง) ให้ดูสนุกไม่ใช่ตึกทำงานจริงจัง */
function buildScienceLab(lot){
  const g = new THREE.Group();
  const w = lot.x1-lot.x0+1, d = lot.z1-lot.z0+1;      /* ล็อต 6×5 ช่อง */
  const bw = w-.8, bd = d-.9, fh = 1.3, bh = fh*2;
  const dz = bd/2;
  const glass = 0xbfe6f7, cream = 0xfffaf0;
  const LIQ = [0x8fd694, 0xef8fa5, 0xffd54f, 0xb388ff, 0x7fc4e8];   /* สีน้ำยาในขวดทดลอง */
  const body = box(bw, bh, bd, lot.wall, .08); body.position.y = bh/2; g.add(body);
  const band = box(bw+.06,.16,bd+.06, lot.roof,.04); band.position.y = fh; g.add(band);      /* คาดแบ่งชั้น */
  const para = box(bw+.24,.26,bd+.24, lot.roof,.06); para.position.y = bh+.11; g.add(para);  /* ขอบดาดฟ้า */
  const RTOP = bh+.24;                                  /* ระดับพื้นดาดฟ้า — ของบนหลังคาวางจากค่านี้ */
  /* --- หน้าต่างแล็บ: กระจกบานใหญ่ + ขวดทดลองสีๆ ตั้งอยู่ในหน้าต่างให้เห็นจากข้างนอก --- */
  const winAt = (x, y, c1, c2)=>{
    const wf = box(1.06,.86,.06, cream,.03); wf.position.set(x, y, dz+.02); g.add(wf);
    const wi = box(.92,.72,.09, glass,.02);  wi.position.set(x, y, dz+.03); g.add(wi);
    const sl = box(1.12,.08,.14, lot.roof,.02); sl.position.set(x, y-.47, dz+.06); g.add(sl);
    /* ขวดในหน้าต่าง: ฝั่งซ้ายเป็นขวดก้นแบน ฝั่งขวาเป็นหลอดทดลอง (นูนออกมาหน้ากระจกนิดเดียว) */
    const fl = cone(.15,.26, c1, 10); fl.position.set(x-.22, y-.2, dz+.1); g.add(fl);
    const fn = cyl(.045,.045,.16, cream, 8); fn.position.set(x-.22, y-.01, dz+.1); g.add(fn);
    const tb = cyl(.07,.07,.34, c2, 8); tb.position.set(x+.24, y-.16, dz+.1); g.add(tb);
    const tr = box(.34,.05,.1, 0xd8d3c8,.02); tr.position.set(x+.24, y-.33, dz+.1); g.add(tr);
  };
  [-1.75, 1.75].forEach((o,i)=> winAt(o, .95, LIQ[i*2], LIQ[i*2+1]));    /* ชั้นล่าง — เว้นกลางไว้ทำทางเข้า */
  [-1.75, 1.75].forEach((o,i)=> winAt(o, 2.05, LIQ[i+2], LIQ[i]));       /* ชั้นบน — เว้นกลางไว้ติดอะตอม */
  /* --- สัญลักษณ์อะตอมบนผนังชั้น 2 (นิวเคลียส + วงโคจร 3 วง เอียงคนละมุม) --- */
  const abg = box(1.0,1.0,.06, cream,.05); abg.position.set(0, 2.05, dz+.03); g.add(abg);
  [0, Math.PI/3, -Math.PI/3].forEach(rz=>{
    const ring = torus(.36,.038, lot.roof, 18); ring.rotation.z = rz; ring.scale.y = .46;
    ring.position.set(0, 2.05, dz+.07); g.add(ring);
  });
  const nuc = sphere(.13, 0xef8354, 10); nuc.position.set(0, 2.05, dz+.09); g.add(nuc);
  /* --- ทางเข้า: ประตูกระจกบานคู่ + กันสาดสองเสา + พรมเช็ดเท้า --- */
  const dr = box(1.5,1.15,.12, glass,.04); dr.position.set(0,.58,dz+.03); g.add(dr);
  const dfr = box(1.68,1.3,.06, cream,.03); dfr.position.set(0,.65,dz+.01); g.add(dfr);
  const dsp = box(.07,1.15,.15, cream,.02); dsp.position.set(0,.58,dz+.06); g.add(dsp);
  const cvp = box(2.3,.14,.92, lot.roof,.05); cvp.position.set(0,1.52,dz+.42); g.add(cvp);
  [-1,1].forEach(sd=>{ const p = cyl(.08,.08,1.46, cream,10); p.position.set(sd*.98,.73,dz+.8); g.add(p); });
  const mat = box(1.9,.06,.7, 0x7fc4e8,.03); mat.position.set(0,.03,dz+.5); g.add(mat);
  /* --- ป้ายชื่อตึกบนดาดฟ้า (รูปกล้องจุลทรรศน์) --- */
  const sbf = box(1.62,.82,.06, lot.roof,.05); sbf.position.set(0, RTOP+.42, dz+.02); g.add(sbf);
  const sbg = box(1.5,.7,.1, cream,.05);       sbg.position.set(0, RTOP+.42, dz+.06); g.add(sbg);
  const sg = signPlane(lot.icon,.58);          sg.position.set(0, RTOP+.42, dz+.13); g.add(sg);
  /* --- โดมดูดาวมุมดาดฟ้าฝั่ง -x + กล้องโทรทรรศน์โผล่ออกทางช่องเปิด ---
     โดมเป็นทรงกลมวางจุดศูนย์กลางไว้ที่ "ขอบบนของฐาน" พอดี ครึ่งล่างจึงจมอยู่ในฐาน (ฐานรัศมีเท่ากัน) */
  const dmx = -bw*.28, dmz = -bd*.16, DR = .74;
  const drum = cyl(DR, DR, .34, cream, 18); drum.position.set(dmx, RTOP+.17, dmz); g.add(drum);
  const dome = sphere(DR, 0x9ad9f0, 18); dome.scale.y = .78; dome.position.set(dmx, RTOP+.34, dmz); g.add(dome);
  const slit = box(.24,.1,DR*2.02, cream,.03); slit.position.set(dmx, RTOP+.86, dmz); g.add(slit);
  const tele = cyl(.11,.13,.9, 0x4a6fa5, 12);      /* กล้องเอียงชี้ขึ้นฟ้าไปทาง +z ให้กล้องไอโซเห็นตัวกล้องเต็มๆ */
  tele.rotation.x = .95; tele.position.set(dmx, RTOP+.86, dmz+.42); g.add(tele);
  const lens = cyl(.14,.14,.08, 0xfff3c4, 12); lens.rotation.x = .95; lens.position.set(dmx, RTOP+1.15, dmz+.66); g.add(lens);
  /* --- ขวดทดลองยักษ์เดือดปุดๆ บนดาดฟ้าฝั่ง +x (ตัวเอกที่ NPC ชวนเด็กมาดู) --- */
  const flx = bw*.3, flz = -bd*.06;
  const stand = cyl(.34,.38,.12, 0xd8d3c8, 14); stand.position.set(flx, RTOP+.06, flz); g.add(stand);
  const gflask = cone(.44,.78, 0x8fd694, 14); gflask.position.set(flx, RTOP+.51, flz); g.add(gflask);
  const gneck  = cyl(.13,.13,.34, cream, 12);  gneck.position.set(flx, RTOP+1.03, flz); g.add(gneck);
  const glip   = cyl(.17,.17,.08, lot.roof, 12); glip.position.set(flx, RTOP+1.22, flz); g.add(glip);
  [[.0,1.44,.11,0xfffaf0],[-.13,1.66,.09,0x8fd694],[.11,1.86,.13,0xfffaf0],[-.06,2.08,.08,0x8fd694]]
    .forEach(([ox,oy,r,c])=>{                      /* ฟองไอลอยขึ้นจากปากขวด */
      const bb = sphere(r, c, 10); bb.position.set(flx+ox, RTOP+oy, flz); g.add(bb);
    });
  /* --- ผนังข้างฝั่ง +x: ท่อแล็บสีลูกกวาด + ช่องหน้าต่างกลม ---
     ฝั่งนี้คือด้านที่กล้องไอโซเห็นเต็มบาน (เหมือนป้ายยื่นของร้านสะดวกซื้อ) ปล่อยว่างแล้วเป็นผนังขาวโล่งใบใหญ่
     ท่อวางเป็นคู่ "ท่อตั้ง + ข้องอ + ท่อนอน" ให้ดูเหมือนท่อเดินระบบของห้องแล็บจริง */
  const sx = bw/2;
  [[-.95, 0x8fd694],[ .95, 0x7fc4e8]].forEach(([oz,c])=>{
    const up = cyl(.09,.09,1.5, c, 10); up.position.set(sx+.14, 1.25, oz); g.add(up);
    const el = sphere(.12, c, 10);      el.position.set(sx+.14, 2.0, oz); g.add(el);
    const hz = cyl(.09,.09,.5, c, 10);  hz.rotation.x = Math.PI/2; hz.position.set(sx+.14, 2.0, oz+(oz<0?.25:-.25)); g.add(hz);
    const fl2 = cyl(.13,.13,.09, cream, 10); fl2.position.set(sx+.14, .62, oz); g.add(fl2);
  });
  [-.95, .95].forEach((oz,i)=>{                      /* หน้าต่างกลมมีน้ำยาสีอยู่ข้างใน */
    const rim = cyl(.28,.28,.08, cream, 14); rim.rotation.z = Math.PI/2; rim.position.set(sx+.03, .95, oz); g.add(rim);
    const pane = cyl(.21,.21,.1, LIQ[i*3], 14); pane.rotation.z = Math.PI/2; pane.position.set(sx+.06, .95, oz); g.add(pane);
  });
  /* --- ท่อระบายอากาศเล็กๆ ท้ายดาดฟ้า (เติมความเป็นตึกทดลอง ไม่บังของชิ้นเอก) --- */
  [[-.9,-1.5],[.4,-1.6]].forEach(([ox,oz])=>{
    const pipe = cyl(.11,.11,.42, 0xc3ccd2, 10); pipe.position.set(ox, RTOP+.21, oz); g.add(pipe);
    const cap  = cyl(.16,.16,.09, lot.roof, 10);  cap.position.set(ox, RTOP+.46, oz); g.add(cap);
  });
  /* --- ลานหน้าตึก: ทางเดินปูน + กระถางต้นไม้ + ถังเก็บสารเคมีสีลูกกวาดข้างประตู --- */
  const apron = box(bw+.4,.05,1.1, 0xefe7d8,.02); apron.position.set(0,.025,dz+.5); g.add(apron);
  [-1,1].forEach(sd=>{
    const pot = cyl(.24,.2,.32, 0xf3e7d6,12); pot.position.set(sd*2.0,.16,dz+.44); g.add(pot);
    const bs  = sphere(.27,0x6fbf73,10); bs.scale.y = .88; bs.position.set(sd*2.0,.46,dz+.44); g.add(bs);
  });
  [[-2.55,LIQ[0]],[-2.55+.5,LIQ[3]]].forEach(([ox,c],i)=>{     /* ถังสารเคมี 2 ใบ วางชิดขอบซ้ายของลาน */
    const drum2 = cyl(.2,.2,.44, c, 12); drum2.position.set(ox,.22,dz+.32+i*.1); g.add(drum2);
    const lid2  = cyl(.22,.22,.07, cream, 12); lid2.position.set(ox,.47,dz+.32+i*.1); g.add(lid2);
  });
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  return g;
}
/* ---------- ห้างสรรพสินค้าของชุมชนที่ 2 (kind:'mall') ----------
   ใช้ร่วมกัน 2 หลัง: เฟอร์นิเจอร์มอลล์ (mallKind 'furniture') กับแฟชั่นมอลล์ (mallKind 'fashion')
   โครงเดียวกันทั้งคู่: ตึกกระจก 2 ชั้นหลังคาแบน + ขอบดาดฟ้า (fascia) หนาคาดรอบ + ตู้โชว์กระจกเรียงเต็มหน้าร้าน
   + ทางเข้าใหญ่สูง 2 ชั้นตรงกลางมีกันสาด + หน้าต่างริบบิ้นชั้น 2 + ป้ายใหญ่บนดาดฟ้า + ของยักษ์บนหลังคา
   + ธงปลิวมุมดาดฟ้า + ลานหน้าห้างมีของโชว์ กระถางต้นไม้ ม้านั่ง
   ต่างกันแค่: สีแบรนด์ · ของในตู้โชว์ · ของยักษ์บนหลังคา · ของที่ตั้งโชว์บนลานหน้าห้าง
   ⚠ ล็อตที่ติดธง `face:'x'` (เฟอร์นิเจอร์มอลล์ — ผู้ใช้ขอให้หันหน้าไปทางทิศใต้) สร้างในกรอบท้องถิ่น
     "หน้าอยู่ +z" เหมือนอาคารอื่นทุกหลังในแผนที่ แล้วค่อยหมุนทั้งกลุ่ม 90° ตอนท้าย
     (mergeCollect อบ matrixWorld ลงไปใน geometry ให้อยู่แล้ว ของที่ติดธง fx ก็ถูก extractFx แปลงพิกัดให้)
     ⇒ ในฟังก์ชันนี้ "ความกว้างหน้าร้าน" ของหลังนั้นคือด้าน z ของล็อต ส่วน "ความลึก" คือด้าน x */
function buildMall(lot){
  const g = new THREE.Group();
  const faceX = lot.face === 'x';
  const along = faceX ? (lot.z1-lot.z0+1) : (lot.x1-lot.x0+1);   /* ด้านหน้าร้าน (กว้าง) */
  const deep  = faceX ? (lot.x1-lot.x0+1) : (lot.z1-lot.z0+1);   /* ความลึกอาคาร */
  const fash = lot.mallKind === 'fashion';
  /* ตัวตึกตื้นกว่าล็อตพอสมควร (deep-2.2) โดยตั้งใจ — ที่เหลือหน้าอาคารคือ "ลานหน้าห้าง"
     ของโชว์/กระถาง/เสากันสาดทั้งหมดต้องอยู่ในกรอบล็อต (ครึ่งลึก = deep/2) เพราะช่องนอกล็อตเด็กเดินทะลุได้จริง
     ถ้าวางเลยออกไป เด็กจะเดินทะลุโซฟา/หุ่นลองชุดกลางทางเท้า (ร้านสะดวกซื้อ/ตึกแล็บก็คุมกติกาเดียวกัน) */
  const bw = along - .6, bd = deep - 2.2, fh = 1.6, bh = fh*2, fz = bd/2;
  const brand = lot.roof, cream = 0xfffaf0, glass = 0xd5f0fb, gold = 0xffd54f;
  const accent = fash ? 0xb388ff : 0x8fd694;      /* สีคู่แบรนด์: แฟชั่น = ลาเวนเดอร์ / เฟอร์นิเจอร์ = เขียวมิ้นต์ */
  const wood = 0xc98d4e;
  /* --- ฐาน + ตัวตึก + คิ้วคั่นชั้น --- */
  const base = box(bw+.26,.24,bd+.26, 0xe6ddce,.05); base.position.y = .12; g.add(base);
  const body = box(bw, bh, bd, lot.wall,.12); body.position.y = bh/2; g.add(body);
  const band = box(bw+.1,.2,bd+.1, brand,.05); band.position.y = fh; g.add(band);
  const bandL = box(bw+.14,.07,bd+.14, cream,.03); bandL.position.y = fh+.15; g.add(bandL);
  /* --- ขอบดาดฟ้าหนาๆ (fascia) คาดรอบตึก + คิ้ว 2 สี + พื้นดาดฟ้า (แคบกว่า fascia เสมอ) --- */
  const fascia = box(bw+.3,.56,bd+.3, brand,.08); fascia.position.y = bh+.28; g.add(fascia);
  const st1 = box(bw+.34,.12,bd+.34, cream,.03);  st1.position.y = bh+.07; g.add(st1);
  const st2 = box(bw+.34,.1,bd+.34, accent,.03);  st2.position.y = bh+.21; g.add(st2);
  /* พื้นดาดฟ้าต้อง "แคบกว่า fascia แต่ผิวบนสูงกว่าขอบ fascia นิดเดียว" — มองมุมไอโซจะเห็นแถบสีแบรนด์
     ตีกรอบรอบดาดฟ้าสีเทา (ถ้าตั้งต่ำกว่าขอบ fascia ดาดฟ้าจะจมหาย เหลือแต่ฝากล่องสีแบรนด์ใบโตทั้งหลังคา) */
  const deck = box(bw+.04,.12,bd+.04, 0xdcd5c6,.03); deck.position.y = bh+.51; g.add(deck);
  const RTOP = bh + .57;                            /* ระดับพื้นดาดฟ้า — ของบนหลังคาวางจากค่านี้ */
  /* --- เสาตกแต่ง 4 มุมตึก (ตีกรอบแนวกระจกให้ดูเป็นหน้าห้าง ไม่ใช่กล่องเปล่า) --- */
  [-1,1].forEach(sx2=>[-1,1].forEach(sz2=>{
    const pil = box(.3, bh, .3, brand,.06);
    pil.position.set(sx2*(bw/2-.14), bh/2, sz2*(bd/2-.14)); g.add(pil);
  }));
  /* ---------- ตู้โชว์กระจกชั้นล่าง ----------
     แบ่งหน้าร้านเป็น: ตู้โชว์ n ช่อง | ทางเข้าใหญ่ตรงกลาง | ตู้โชว์ n ช่อง (สมมาตร)
     ของในตู้เปลี่ยนไปตามช่อง ให้เดินผ่านแล้วเห็นของไม่ซ้ำกันเลยสักบาน */
  const dW = Math.min(1.8, bw*.24), inner = dW/2 + .18;
  const sideW = bw/2 - inner - .2, nBay = Math.max(2, Math.round(sideW/1.5)), bwid = sideW/nBay;
  /* ของโชว์ในตู้ (วางบนแท่นสูง .23) — เฟอร์นิเจอร์: โซฟา/โคมไฟ/เตียง/ตู้ · แฟชั่น: หุ่นลองชุด 4 แบบ */
  const DISP = [0xef8fa5, 0x7fc4e8, gold, 0x8fd694, 0xb388ff, 0xef8354];
  const putDisplay = (idx, x, y, z)=>{
    const c = DISP[idx % DISP.length], c2 = DISP[(idx+3) % DISP.length];
    if(!fash){
      if(idx % 4 === 0){                              /* โซฟาตัวเล็ก */
        const st = box(.52,.13,.26, c,.05); st.position.set(x, y+.14, z); g.add(st);
        const bk = box(.52,.22,.09, c,.04); bk.position.set(x, y+.3, z-.1); g.add(bk);
        [-1,1].forEach(sd=>{ const am = box(.09,.16,.26, c2,.03); am.position.set(x+sd*.22, y+.25, z); g.add(am); });
      }else if(idx % 4 === 1){                        /* โคมไฟตั้งพื้น */
        const pl = cyl(.03,.045,.5, wood,8); pl.position.set(x, y+.25, z); g.add(pl);
        const sh = cone(.2,.24, 0xfff3c4,12);         sh.position.set(x, y+.6, z); g.add(sh);
        const bl = sphere(.07, gold, 8);              bl.position.set(x, y+.44, z); g.add(bl);
      }else if(idx % 4 === 2){                        /* เตียงนอนพร้อมหมอน */
        const bs = box(.54,.12,.3, cream,.04); bs.position.set(x, y+.13, z); g.add(bs);
        const bl2 = box(.54,.09,.19, c,.03);   bl2.position.set(x, y+.23, z+.05); g.add(bl2);
        const pw = box(.2,.09,.12, cream,.04); pw.position.set(x, y+.24, z-.1); g.add(pw);
        const hb = box(.54,.24,.06, wood,.04); hb.position.set(x, y+.3, z-.12); g.add(hb);
      }else{                                          /* ตู้เก็บของ 2 บาน */
        const cb = box(.42,.56,.24, wood,.05); cb.position.set(x, y+.28, z); g.add(cb);
        [-1,1].forEach(sd=>{
          const dr2 = box(.17,.46,.05, c,.03); dr2.position.set(x+sd*.1, y+.28, z+.13); g.add(dr2);
          const kn = sphere(.03, gold, 6);     kn.position.set(x+sd*.02, y+.28, z+.17); g.add(kn);
        });
      }
    }else{                                            /* หุ่นลองชุด (ไม่มีหน้าตา — เป็นหุ่นโชว์เสื้อผ้า) */
      const st2b = cyl(.13,.15,.05, 0xd8d3c8,12); st2b.position.set(x, y+.03, z); g.add(st2b);
      const pl2  = cyl(.035,.035,.16, 0xd8d3c8,8); pl2.position.set(x, y+.13, z); g.add(pl2);
      if(idx % 4 === 1){                              /* ชุดเสื้อ+กระโปรงบาน */
        const sk = cone(.24,.34, c,12); sk.position.set(x, y+.38, z); g.add(sk);
        const tp = box(.24,.22,.16, c2,.06); tp.position.set(x, y+.63, z); g.add(tp);
      }else{                                          /* ชุดกระโปรงยาวชิ้นเดียว */
        const dr3 = cone(.27,.62, c,12); dr3.position.set(x, y+.5, z); g.add(dr3);
        const wb = cyl(.13,.13,.07, c2,10); wb.position.set(x, y+.62, z); g.add(wb);
      }
      const nk = cyl(.05,.05,.1, 0xf0e4d4,8); nk.position.set(x, y+.8, z); g.add(nk);
      const hd = sphere(.1, 0xf0e4d4,12);     hd.position.set(x, y+.92, z); g.add(hd);
      if(idx % 4 === 2){                              /* ใส่หมวกปีกกว้าง */
        const hb2 = cyl(.2,.2,.03, c2,12);  hb2.position.set(x, y+1.0, z); g.add(hb2);
        const hc  = cyl(.1,.11,.1, c2,10);  hc.position.set(x, y+1.05, z); g.add(hc);
      }
      if(idx % 4 === 3){                              /* ถือกระเป๋าใบเล็ก */
        const bg = box(.15,.14,.07, c2,.04); bg.position.set(x+.24, y+.5, z+.05); g.add(bg);
        const hn = torus(.06,.017, c2, 10);  hn.position.set(x+.24, y+.6, z+.05); g.add(hn);
      }
    }
  };
  let bayIdx = 0;
  [-1,1].forEach(sd=>{
    for(let i=0;i<nBay;i++){
      const x = sd*(inner + bwid*(i+.5));
      const fr = box(bwid-.06, 1.24, .1, cream,.04);  fr.position.set(x, .9, fz+.02); g.add(fr);
      const gl = box(bwid-.22, 1.06, .08, glass,.03); gl.position.set(x, .92, fz+.06); g.add(gl);
      const mu = box(.07, 1.06, .06, cream,.02);      mu.position.set(x, .92, fz+.1); g.add(mu);
      /* แท่นวางของโชว์ยื่นออกมาจากผนัง — ของในตู้ต้องอยู่ "หน้ากระจก" เสมอ (ผนังกับกระจกเป็นกล่องทึบ
         ถ้าวางลึกกว่าผิวหน้ากระจกที่ fz+.10 ของจะจมหายเข้าไปในตึกทั้งชิ้น) */
      const sl = box(bwid, .22, .5, brand,.05); sl.position.set(x, .13, fz+.19); g.add(sl);
      const lp = box(bwid-.3,.06,.1, gold,.02); lp.position.set(x, 1.44, fz+.13); g.add(lp);   /* ไฟส่องตู้โชว์ */
      putDisplay(bayIdx++, x, .24, fz+.27);
    }
  });
  /* ---------- ทางเข้าใหญ่ตรงกลาง (สูงคร่อม 2 ชั้น) ---------- */
  const pfr = box(dW+.5, 2.55, .16, brand,.06);  pfr.position.set(0, 1.28, fz+.02); g.add(pfr);
  const pin = box(dW+.24, 2.35, .1, cream,.05);  pin.position.set(0, 1.24, fz+.07); g.add(pin);
  const tr  = box(dW, .92, .07, glass,.03);      tr.position.set(0, 1.82, fz+.11); g.add(tr);
  const trm = box(dW, .09, .06, brand,.02);      trm.position.set(0, 1.3, fz+.12); g.add(trm);
  [-1,1].forEach(sd=>{                            /* ประตูกระจกบานคู่ + มือจับยาว */
    const lf = box(dW/2-.09, 1.16, .08, glass,.03); lf.position.set(sd*(dW/4), .64, fz+.11); g.add(lf);
    const hb3 = cyl(.03,.03,.6, 0xb8c2c8, 8);       hb3.position.set(sd*.09, .64, fz+.16); g.add(hb3);
  });
  /* กันสาดใหญ่หน้าทางเข้า + เสารับ 2 ต้น + ไฟใต้กันสาด */
  const cnp = box(dW+1.7,.18,.98, brand,.06);  cnp.position.set(0, 2.6, fz+.5); g.add(cnp);
  const cnl = box(dW+1.5,.09,.82, accent,.03); cnl.position.set(0, 2.48, fz+.48); g.add(cnl);
  [-1,1].forEach(sd=>{
    const ps = cyl(.08,.08,2.5, cream,10); ps.position.set(sd*(dW/2+.72), 1.25, fz+.84); g.add(ps);
  });
  [-1,0,1].forEach(o=>{
    const dl = cyl(.09,.09,.07, 0xfff3c4,10); dl.position.set(o*(dW/2+.3), 2.44, fz+.42); g.add(dl);
  });
  /* ---------- ชั้น 2: หน้าต่างริบบิ้นยาวตลอดหน้าตึก ---------- */
  const ry = fh + .78;
  const rfr = box(bw*.94, 1.06, .06, cream,.04); rfr.position.set(0, ry, fz+.02); g.add(rfr);
  const rgl = box(bw*.9, .9, .08, glass,.03);    rgl.position.set(0, ry, fz+.05); g.add(rgl);
  const nMul = Math.max(3, Math.round(bw/1.1));
  for(let i=1;i<nMul;i++){
    const mx = -bw*.45 + bw*.9*i/nMul;
    const ml = box(.09,.9,.05, cream,.02); ml.position.set(mx, ry, fz+.1); g.add(ml);
  }
  const rsl = box(bw*.96,.14,.26, brand,.04); rsl.position.set(0, ry-.6, fz+.08); g.add(rsl);
  /* กระถางดอกไม้เรียงบนคิ้วชั้น 2 (เติมสีให้ผนังชั้นบนไม่โล่ง) */
  const nPot = Math.max(2, Math.round(bw/2.4));
  for(let i=0;i<nPot;i++){
    const px = -bw*.36 + bw*.72*(nPot===1 ? .5 : i/(nPot-1));
    const pt = box(.3,.16,.18, 0xf3e7d6,.04); pt.position.set(px, ry-.44, fz+.16); g.add(pt);
    const fl = sphere(.13, DISP[i % DISP.length], 8); fl.scale.y = .8;
    fl.position.set(px, ry-.3, fz+.16); g.add(fl);
  }
  /* ---------- ป้ายใหญ่บนดาดฟ้า (รูปสินค้า + บรรทัดชื่อห้างจำลอง + หลอดไฟรอบป้าย) ---------- */
  const sbW = Math.min(bw*.62, 4.4);
  const sfr = box(sbW+.16, 1.06, .1, brand,.06); sfr.position.set(0, RTOP+.62, fz+.01); g.add(sfr);
  const sbg = box(sbW, .9, .12, cream,.05);      sbg.position.set(0, RTOP+.62, fz+.05); g.add(sbg);
  const sg = signPlane(lot.icon, .62); sg.position.set(-sbW*.3, RTOP+.62, fz+.13); g.add(sg);
  [[.24,.9,0x8f6231],[.1,.66,0xd9c7a5]].forEach(([oy,lw,c])=>{
    const ln = box(lw*(sbW/2.6),.13,.04, c,.02); ln.position.set(sbW*.16, RTOP+.62+oy-.2, fz+.13); g.add(ln);
  });
  for(let i=0;i<6;i++){                            /* หลอดไฟกลมเรียงบนขอบป้าย */
    const bx2 = -sbW/2 + sbW*i/5;
    const bl3 = sphere(.06, gold, 8); bl3.position.set(bx2, RTOP+1.15, fz+.08); g.add(bl3);
  }
  /* เสาป้ายรับใต้แผ่นป้าย (ให้ป้ายดูตั้งอยู่บนดาดฟ้าจริง ไม่ลอย) */
  [-1,1].forEach(sd=>{
    const sp = box(.12,.42,.12, 0xd8d3c8,.03); sp.position.set(sd*sbW*.32, RTOP+.05, fz-.02); g.add(sp);
  });
  /* ---------- ของยักษ์บนดาดฟ้า (มองไกลๆ ก็รู้ว่าห้างนี้ขายอะไร) ---------- */
  /* สีของยักษ์ต้อง **ไม่ใช่สีแบรนด์** (สีเดียวกับขอบดาดฟ้า) ไม่งั้นจะกลืนหายไปกับหลังคาทั้งชิ้น */
  const ex = -bw*.3, ez = -bd*.06, emb = fash ? accent : 0xef8354;
  if(!fash){                                       /* โซฟายักษ์ */
    const gs = box(1.5,.36,.72, emb,.12);  gs.position.set(ex, RTOP+.34, ez); g.add(gs);
    const gb = box(1.5,.62,.22, emb,.1);   gb.position.set(ex, RTOP+.72, ez-.26); g.add(gb);
    [-1,1].forEach(sd=>{ const ga = box(.24,.46,.72, 0xf2c185,.09); ga.position.set(ex+sd*.63, RTOP+.6, ez); g.add(ga); });
    [[-.5,-.24],[.5,-.24],[-.5,.24],[.5,.24]].forEach(([ox,oz])=>{
      const lg2 = cyl(.08,.08,.3, wood,8); lg2.position.set(ex+ox, RTOP+.15, ez+oz); g.add(lg2);
    });
    [[-.42,accent],[.42,gold]].forEach(([ox,c])=>{ /* หมอนอิง 2 ใบ */
      const cu = box(.34,.3,.12, c,.06); cu.rotation.z = ox<0 ? .18 : -.18;
      cu.position.set(ex+ox, RTOP+.66, ez-.1); g.add(cu);
    });
  }else{                                           /* ไม้แขวนชุดกระโปรงยักษ์ + หมวก */
    const hk = torus(.16,.035, 0xd8d3c8,12); hk.position.set(ex, RTOP+1.42, ez); g.add(hk);
    const hbar = box(1.1,.09,.09, 0xd8d3c8,.03);  hbar.position.set(ex, RTOP+1.18, ez); g.add(hbar);
    const gd = cone(.66,1.1, emb,14);             gd.position.set(ex, RTOP+.58, ez); g.add(gd);
    const gw = cyl(.3,.3,.12, gold,14);           gw.position.set(ex, RTOP+.96, ez); g.add(gw);
    const gc = box(.5,.26,.3, emb,.08);           gc.position.set(ex, RTOP+1.12, ez); g.add(gc);
    [-1,1].forEach(sd=>{ const sh2 = box(.2,.16,.24, emb,.06); sh2.position.set(ex+sd*.34, RTOP+1.1, ez); g.add(sh2); });
    const hbr = cyl(.36,.36,.05, gold,14);   hbr.position.set(ex+1.0, RTOP+.16, ez+.1); g.add(hbr);   /* หมวกปีกกว้างยักษ์ */
    const hcr = cyl(.18,.2,.22, gold,12);    hcr.position.set(ex+1.0, RTOP+.28, ez+.1); g.add(hcr);
    const hbd = cyl(.19,.19,.06, accent,12); hbd.position.set(ex+1.0, RTOP+.22, ez+.1); g.add(hbd);
  }
  /* คอมเพรสเซอร์แอร์ท้ายดาดฟ้า (ตึกจริงต้องมี — เติมความเป็นห้าง) */
  [[bw*.3,-bd*.2],[bw*.42,bd*.12]].forEach(([ox,oz])=>{
    const ac = box(.56,.32,.44, 0xc3ccd2,.05); ac.position.set(ox, RTOP+.16, oz); g.add(ac);
    const fn = cyl(.14,.14,.05, 0x9fabb3,12);  fn.position.set(ox, RTOP+.34, oz); g.add(fn);
  });
  /* ธงปลิวมุมดาดฟ้าฝั่งหน้าร้าน (fxTag 'flag' — extractFx ดึงออกไปแกว่งเองตอน merge ฉาก) */
  [-1,1].forEach((sd,i)=>{
    const po = cyl(.045,.045,.95, cream,6); po.position.set(sd*(bw/2-.2), RTOP+.48, fz-.15); g.add(po);
    const fp = new THREE.Group(); fp.position.set(sd*(bw/2-.2), RTOP+.86, fz-.15);
    const fl2 = box(.42,.28,.04, [accent, gold][i],.02); fl2.position.x = sd*.28;
    fp.add(fl2); fxTag(fp,'flag',{ph:i*1.9}); g.add(fp);
  });
  /* ---------- ป้ายยื่นข้างอาคารทั้ง 2 ฝั่ง ----------
     ทำทั้งซ้าย-ขวาเพราะหลังที่หมุน 90° (face:'x') ด้านที่กล้องไอโซเห็นเป็นคนละฝั่งกับหลังปกติ */
  [-1,1].forEach(sd=>{
    const bx3 = sd*(bw/2), bz = fz-.7;
    const arm = box(.3,.1,.12, 0xd8dee3,.03); arm.position.set(bx3+sd*.1, 2.5, bz); g.add(arm);
    const bfr = box(.14,.9,1.0, brand,.06);   bfr.position.set(bx3+sd*.2, 1.96, bz); g.add(bfr);
    const bfc = box(.08,.74,.84, cream,.05);  bfc.position.set(bx3+sd*.28, 1.96, bz); g.add(bfc);
    [1,-1].forEach(f=>{
      const bsg = signPlane(lot.icon, .52); bsg.rotation.y = f*Math.PI/2;
      bsg.position.set(bx3 + sd*(f>0 ? .33 : .23), 1.96, bz); g.add(bsg);
    });
  });
  /* ---------- ลานหน้าห้าง (อยู่ในกรอบล็อตทั้งหมด) ---------- */
  const apron = box(bw+.5,.05,1.3, 0xefe7d8,.02); apron.position.set(0,.025, fz+.62); g.add(apron);
  const mat2 = box(dW+.3,.05,.56, accent,.02);    mat2.position.set(0,.06, fz+.34); g.add(mat2);
  /* กระถางต้นไม้ใหญ่ขนาบทางเข้า */
  [-1,1].forEach(sd=>{
    const px = sd*(dW/2+1.15);
    const pot = cyl(.26,.22,.4, 0xf3e7d6,12); pot.position.set(px,.2, fz+.42); g.add(pot);
    const bs2 = sphere(.32, 0x6fbf73,10); bs2.scale.y = .95; bs2.position.set(px,.62, fz+.42); g.add(bs2);
    const bs3 = sphere(.22, 0x8fd694,10); bs3.position.set(px+sd*.12,.88, fz+.42); g.add(bs3);
  });
  /* ของโชว์บนลาน — วางเป็น "แถวนอก" (พ้นเสากันสาดที่ z = fz+1.1 ออกมา) จะได้ไม่ชนกับ
     กระถางแถวในที่อยู่ชิดประตู และไม่บังกระจกหน้าร้านบนจอ */
  const front = fz + .75;
  if(!fash){
    const sx1 = -bw*.4;                                 /* โซฟาโชว์ตัวใหญ่ริมซ้ายสุดของลาน */
    const so = box(1.1,.24,.54, 0xef8354,.09);  so.position.set(sx1,.33, front); g.add(so);
    const sb = box(1.1,.44,.18, 0xef8354,.07);  sb.position.set(sx1,.6, front-.2); g.add(sb);
    [-1,1].forEach(sd=>{ const am = box(.18,.3,.54, 0xf2a184,.06); am.position.set(sx1+sd*.46,.54, front); g.add(am); });
    [-1,1].forEach(sd=>[-1,1].forEach(sz2=>{ const lg3 = cyl(.05,.05,.22, wood,6);
      lg3.position.set(sx1+sd*.44,.11, front+sz2*.2); g.add(lg3); }));
    [[-.3,gold],[.3,accent]].forEach(([ox,c])=>{        /* หมอนอิง 2 ใบบนโซฟา */
      const cu = box(.26,.24,.1, c,.05); cu.rotation.z = ox<0 ? .2 : -.2; cu.position.set(sx1+ox,.56, front-.12); g.add(cu);
    });
    const lx = bw*.36;                                  /* โคมไฟตั้งพื้น + เก้าอี้ไม้ซ้อนริมขวา */
    const lp2 = cyl(.05,.07,1.1, wood,8);   lp2.position.set(lx,.55, front); g.add(lp2);
    const sh3 = cone(.3,.34, 0xfff3c4,12);  sh3.position.set(lx,1.24, front); g.add(sh3);
    [0,1].forEach(i=>{
      const se = box(.38,.08,.38, wood,.03);     se.position.set(bw*.24,.36+i*.22, front+.06); g.add(se);
      const bk2 = box(.38,.3,.07, 0xb4763a,.03); bk2.position.set(bw*.24,.54+i*.22, front-.1); g.add(bk2);
    });
    /* ม้านั่งพักเท้า (เฉพาะหลังยาว มีที่ว่างพอ) */
    const bx4 = -bw*.24;
    const se2 = box(.9,.1,.34, wood,.04);  se2.position.set(bx4,.34, front); g.add(se2);
    const bk3 = box(.9,.3,.08, wood,.04);  bk3.position.set(bx4,.54, front-.15); g.add(bk3);
    [-1,1].forEach(s2=>{ const lg4 = cyl(.05,.05,.3, 0xd8d3c8,6); lg4.position.set(bx4+s2*.34,.15, front); g.add(lg4); });
  }else{
    [[-bw*.38,0],[bw*.38,3]].forEach(([mx,ix])=>{       /* หุ่นลองชุด 2 ตัวตั้งโชว์ริมลานทั้ง 2 ฝั่ง */
      const bs4 = cyl(.16,.19,.06, 0xd8d3c8,12); bs4.position.set(mx,.04, front); g.add(bs4);
      const pl3 = cyl(.04,.04,.2, 0xd8d3c8,8);   pl3.position.set(mx,.16, front); g.add(pl3);
      const dr4 = cone(.34,.78, DISP[ix],14);    dr4.position.set(mx,.62, front); g.add(dr4);
      const wb2 = cyl(.17,.17,.09, DISP[ix+1],12); wb2.position.set(mx,.78, front); g.add(wb2);
      const nk2 = cyl(.06,.06,.12, 0xf0e4d4,8);  nk2.position.set(mx,1.06, front); g.add(nk2);
      const hd2 = sphere(.12, 0xf0e4d4,12);      hd2.position.set(mx,1.24, front); g.add(hd2);
    });
    [-1,1].forEach((sd,i)=>{                            /* แผงวางหมวก/กระเป๋า/รองเท้า ขนาบทางเข้า */
      const cx2 = sd*(dW/2+.32);
      const cr = box(.5,.42,.36, wood,.05);  cr.position.set(cx2,.21, front); g.add(cr);
      const tp2 = box(.54,.07,.4, cream,.03); tp2.position.set(cx2,.45, front); g.add(tp2);
      if(i){
        const hb4 = cyl(.17,.17,.04, DISP[1],12); hb4.position.set(cx2,.51, front); g.add(hb4);
        const hc2 = cyl(.09,.1,.14, DISP[1],10);  hc2.position.set(cx2,.56, front); g.add(hc2);
      }else{
        const bg2 = box(.24,.2,.12, DISP[4],.05); bg2.position.set(cx2,.59, front); g.add(bg2);
        const hn2 = torus(.08,.02, DISP[4],10);   hn2.position.set(cx2,.73, front); g.add(hn2);
      }
    });
  }
  g.position.set(outWX((lot.x0+lot.x1)/2), 0, outWZ((lot.z0+lot.z1)/2));
  if(faceX) g.rotation.y = Math.PI/2;                   /* หน้าร้านหันไป +x (ทิศใต้) */
  return g;
}
function buildLotBuilding(lot){
  if(lot.shopKind==='food') return buildRestaurant(lot);
  if(lot.shopKind==='pet')  return buildPetShop(lot);
  if(lot.shopKind==='mart') return buildMinimart(lot);     /* ร้านสะดวกซื้อ — ตึกหลังคาแบน ไม่ใช้ทรงบ้าน */
  if(lot.shopKind==='music') return buildMusicShop(lot);   /* ร้านเครื่องดนตรี — ตึก 2 ชั้นหลังคาแบน */
  if(lot.kind==='mall') return buildMall(lot);
  if(lot.kind==='lab') return buildScienceLab(lot);
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
    const flagP = new THREE.Group(); flagP.position.set(px, bh+1.62, 0);
    const flag = box(.4,.26,.04, [0xff8fb3,0xffd54f,0x7fc4e8][i], .02); flag.position.x = .28;
    flagP.add(flag); fxTag(flagP,'flag',{ph:i*2.1}); g.add(flagP);
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
  const hH = box(.05,.15,.03, 0x4a4a4a, .01); hH.position.set(0, bh + 1.23, .4); fxTag(hH,'clockH'); g.add(hH);
  const hM = box(.19,.045,.03, 0x4a4a4a, .01); hM.position.set(.08, bh + 1.16, .4); fxTag(hM,'clockM'); g.add(hM);
  const twR = cone(.78, .74, lot.roof, 4); twR.rotation.y = Math.PI/4; twR.position.set(0, bh + 1.94, -.1); g.add(twR);
  const fpole = cyl(.04,.04,.7, 0xf7f3ee, 6); fpole.position.set(0, bh + 2.62, -.1); g.add(fpole);
  const flagP = new THREE.Group(); flagP.position.set(0, bh + 2.86, -.1);
  const flag = box(.42,.28,.04, 0x6f86c9, .02); flag.position.x = .27;
  flagP.add(flag); fxTag(flagP,'flag'); g.add(flagP);
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

/* จุดให้ผีเสื้อไปตอม — เอาเฉพาะ "ทุ่งดอกไม้" เท่านั้น (flowerSet รวมดอกไม้ริมถนน/รอบอาคาร
   ทั่วเมืองด้วย ถ้าเอาหมดผีเสื้อจะบินพล่านทั้งแผนที่) แต่ละทุ่งมีเพดานจำนวนของตัวเอง:
   ทุ่งใหญ่ 2 ผืนได้เต็มฝูง ส่วนทุ่งรอบลานน้ำพุเป็นสวนกลางเมือง เอาแค่ 3 ตัวพอไม่ให้รก */
function inField(x, z, b){ return x>=b.x0 && x<=b.x1 && z>=b.z0 && z<=b.z1; }
function butterflyZones(){
  /* ทุ่งรอบลานน้ำพุแบ่งเป็น 4 มุม มุมละ 1 ตัว — ผีเสื้อจะได้กระจายรอบลาน
     ไม่ไปกระจุกอยู่มุมเดียวกันหมด (ทุ่งใหญ่ 2 ผืนไม่ต้องแบ่ง พื้นที่กว้างพออยู่แล้ว) */
  const py = PLAZA_YARD, mx = (py.x0 + py.x1) >> 1, mz = (py.z0 + py.z1) >> 1;
  const fw = FLOWER_WEST, w3 = Math.round((fw.x1 - fw.x0)/3);
  return [ {box:FLOWER_FIELD, max:BUTTERFLY_MAX}, {box:FLOWER_MEADOW, max:BUTTERFLY_MAX},
           /* ทุ่งขอบใต้เป็นแถบยาวตามแกน x — แบ่ง 3 ท่อน ท่อนละ 1 ตัว จะได้กระจายตลอดแนว */
           {box:{x0:fw.x0,          x1:fw.x0+w3,   z0:fw.z0, z1:fw.z1}, max:1},
           {box:{x0:fw.x0+w3+1,     x1:fw.x0+w3*2, z0:fw.z0, z1:fw.z1}, max:1},
           {box:{x0:fw.x0+w3*2+1,   x1:fw.x1,      z0:fw.z0, z1:fw.z1}, max:1},
           {box:{x0:py.x0, x1:mx,     z0:py.z0, z1:mz    }, max:1},
           {box:{x0:mx+1,   x1:py.x1, z0:py.z0, z1:mz    }, max:1},
           {box:{x0:py.x0,  x1:mx,    z0:mz+1,  z1:py.z1 }, max:1},
           {box:{x0:mx+1,   x1:py.x1, z0:mz+1,  z1:py.z1 }, max:1} ];
}
function butterflySpots(){
  if(!bflySpots){
    const zones = butterflyZones();
    bflySpots = [];
    flowerSet.forEach(k=>{
      const p = k.split(','), x = +p[0], z = +p[1];
      const zi = zones.findIndex(zn => inField(x, z, zn.box));
      if(zi >= 0) bflySpots.push({x, z, zi});
    });
  }
  return bflySpots;
}
/* สุ่มดอกไม้ที่อยู่ในระยะรอบตัวเด็ก (สุ่มไม่กี่ครั้ง ไม่ไล่ทั้งอาเรย์ทุกครั้ง)
   - ข้ามทุ่งที่ผีเสื้อเต็มเพดานแล้ว
   - เว้นระยะจากผีเสื้อตัวอื่นอย่างน้อย BFLY_MIN_GAP ให้กระจายกันทั่วทุ่ง ไม่กระจุกอยู่กอเดียว
     (ถ้าสุ่มไม่เจอที่ห่างพอจริงๆ ก็เอาจุดที่ห่างที่สุดเท่าที่สุ่มเจอ ดีกว่าไม่ได้ที่เลย) */
const BFLY_MIN_GAP = 5;
function pickFlowerNear(cx, cz, rad, self){
  const arr = butterflySpots();
  if(!arr.length) return null;
  const zones = butterflyZones();
  const used = zones.map(()=>0);
  for(let i=0; i<butterflies.length; i++){
    const h = butterflies[i].home;
    if(h && used[h.zi] != null) used[h.zi]++;
  }
  let best = null, bestGap = -1;
  for(let i=0; i<28; i++){
    const s = arr[(Math.random()*arr.length)|0];
    if(used[s.zi] >= zones[s.zi].max) continue;
    const wx = outWX(s.x), wz = outWZ(s.z);
    if(Math.hypot(wx-cx, wz-cz) >= rad) continue;
    let gap = Infinity;                                  /* ห่างจากตัวที่ใกล้ที่สุดเท่าไร */
    for(let k=0; k<butterflies.length; k++){
      const b = butterflies[k];
      if(b === self) continue;
      const h = b.next || b.home;
      if(!h) continue;
      gap = Math.min(gap, Math.hypot(wx-h.x, wz-h.z));
    }
    if(gap >= BFLY_MIN_GAP) return {x:wx, z:wz, zi:s.zi};
    if(gap > bestGap){ bestGap = gap; best = {x:wx, z:wz, zi:s.zi}; }
  }
  return best;
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
      const spot = pickFlowerNear(cx, cz, 13, b);
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
      const spot = pickFlowerNear(cx, cz, 12, b);
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

/* ---------- ชิ้นส่วนของตกแต่งที่ "ขยับเองตลอดเวลา" (ธงสะบัด / กังหันหมุน / น้ำพุพุ่ง / ไฟกะพริบ) ----------
   คลังเฟอร์นิเจอร์ติดธงไว้ที่ตัวชิ้นส่วนเลย: `o.userData.anim = {kind, ...}` (ดู js/house-furniture.js)
   ⚠ ชิ้นไหนมี userData ติดอยู่ mergeDecorGroup จะไม่ยุบรวมทั้งกลุ่มให้เอง (ดูเงื่อนไขในฟังก์ชันนั้น)
      ⇒ ของที่ใส่ anim จะกิน draw call มากกว่าปกติเล็กน้อย ใส่เฉพาะชิ้นที่คุ้มจริงๆ
   ⚠ ห้ามขยับด้วยการแก้ "สี/material" เด็ดขาด — material ถูกแคชรวมตามสี (toonMat) แก้ทีเดียวเพี้ยนทั้งเมือง
      ใช้ได้แค่ตำแหน่ง/หมุน/สเกลเท่านั้น
   ค่าเริ่มต้น (base) ของแต่ละชิ้นถูกจดไว้ตอนสร้าง แล้วแกว่งรอบค่านั้นด้วยสูตร sin ล้วนๆ */
function collectDecorAnim(g){
  const parts = [];
  g.traverse(o=>{
    const a = o.userData && o.userData.anim;
    if(!a || o === g) return;
    a.brx = o.rotation.x; a.bry = o.rotation.y; a.brz = o.rotation.z;
    a.by = o.position.y;
    a.sx = o.scale.x; a.sy = o.scale.y; a.sz = o.scale.z;
    if(a.ph == null) a.ph = parts.length * 1.7;
    parts.push(o);
  });
  return parts.length ? parts : null;
}
function updateDecorAnimParts(g, s, ph0){
  const list = g.userData.animParts;
  for(let i=0; i<list.length; i++){
    const o = list[i], a = o.userData.anim, ph = ph0 + a.ph, sp = a.sp || 1;
    switch(a.kind){
      case 'spin':                                   /* หมุนรอบแกนตัวเอง (ใบพัดกังหัน/ลูกโลก) */
        o.rotation[a.axis || 'z'] = (a.axis === 'y' ? a.bry : a.axis === 'x' ? a.brx : a.brz) + s*sp;
        break;
      case 'wave':                                   /* ผ้าธงสะบัด — ชุดเดียวกับธงในเมือง (updateSceneryFx 'flag') */
        o.rotation.y = a.bry + Math.sin(s*2.1 + ph)*.3;
        o.rotation.z = a.brz + Math.sin(s*3.2 + ph)*.1;
        o.scale.x = a.sx * (1 + Math.sin(s*4.1 + ph)*.09);
        break;
      case 'jet': {                                  /* สายน้ำพุ่งขึ้น-ตกลง */
        const k = 1 + Math.sin(s*3.1*sp + ph)*.2;
        o.scale.set(a.sx, a.sy*k, a.sz);
        o.position.y = a.by + (k-1)*.24;
        break;
      }
      case 'drop': {                                 /* หยดน้ำ/ฟองน้ำเด้งขึ้นลง */
        o.position.y = a.by + (Math.sin(s*3.1*sp + ph)*.5 + .5)*(a.amp || .3);
        break;
      }
      case 'pulse': {                                /* ดวงไฟ/ผิวน้ำเต้นเบาๆ */
        const k = 1 + Math.sin(s*(sp*3) + ph)*(a.amp || .22);
        o.scale.set(a.sx*k, a.sy*k, a.sz*k);
        break;
      }
      case 'flame': {                                /* เปลวไฟวูบวาบ */
        const k = 1 + Math.sin(s*9 + ph)*.16 + Math.sin(s*13.7 + ph*2)*.09;
        o.scale.set(a.sx*k, a.sy*(1 + (k-1)*1.8), a.sz*k);
        o.rotation.z = a.brz + Math.sin(s*7 + ph)*.13;
        break;
      }
      case 'bob':                                    /* ลอยขึ้นลงเบาๆ (ว่าว/นก) */
        o.position.y = a.by + Math.sin(s*1.5*sp + ph)*(a.amp || .1);
        o.rotation.z = a.brz + Math.sin(s*1.1*sp + ph)*.1;
        break;
    }
  }
}
/* ---------- ของตกแต่งไหวตามลม ----------
   ต้นไม้/พุ่มที่เด็กปลูกเอง และลูกโป่ง เป็น group เดี่ยว (ไม่ได้ merge รวมฉาก) จึงขยับได้
   ไล่รายชื่อใหม่ทุก ~1 วิ เอาเฉพาะชิ้นที่อยู่ใกล้ตัวเด็ก แล้วค่อยขยับทีละเฟรม */
let windList = [], windScanT = 0;
function updateDecorWind(t, dt){
  if(!charGroup) return;
  windScanT -= dt;
  if(windScanT <= 0){
    windScanT = 1;
    windList = [];
    const cx = charGroup.position.x, cz = charGroup.position.z;
    const list = decorGroups[hScene] || [];       /* ในบ้านก็ต้องขยับด้วย (ตู้ปลา/นาฬิกา ฯลฯ ที่ติดธง anim) */
    for(let i=0; i<list.length; i++){
      const g = list[i], d = g.userData.deco;
      if(!d || (!d.item.leafy && d.item.id !== 'balloon' && !d.item.rock && !g.userData.animParts)) continue;
      if(Math.hypot(g.position.x-cx, g.position.z-cz) > 20) continue;
      if(g.userData.windPh == null){
        g.userData.windPh = (g.position.x*1.7 + g.position.z*2.3) % 6.28;   /* เฟสคงที่ต่อชิ้น ไม่ไหวพร้อมกันทั้งสวน */
        g.userData.windBaseY = g.position.y;
        g.userData.windBalloon = d.item.id === 'balloon';
        g.userData.windSwing = !!d.item.rock;      /* ชิงช้า: แกว่งที่ pivot ไม่ใช่เอนทั้งตัว */
        g.userData.windLeafy = !!d.item.leafy;     /* เอนไหวทั้งต้นได้เฉพาะต้นไม้/พุ่ม — ของอย่างน้ำพุ/เสาธงห้ามเอียง */
      }
      windList.push(g);
    }
  }
  const s = t*.001;
  for(let i=0; i<windList.length; i++){
    const g = windList[i], ph = g.userData.windPh;
    if(g.userData.animParts) updateDecorAnimParts(g, s, ph);   /* ธง/กังหัน/น้ำพุ/ไฟ — ขยับเฉพาะชิ้นส่วนข้างใน */   /* ธง/กังหัน/น้ำพุ/ไฟ — ขยับเฉพาะชิ้นส่วนข้างใน */
    if(g.userData.windSwing){                         /* ชิงช้า: ไกวเบาๆ ตามลมตอนไม่มีใครนั่ง */
      const piv = g.userData.swingPiv;
      if(piv && !(sitState && sitState.group === g)) piv.rotation.x = Math.sin(s*1.15 + ph)*.07;
    }else if(g.userData.windBalloon){                 /* ลูกโป่ง: ลอยขึ้นลง + เอียงตามลม */
      g.position.y = g.userData.windBaseY + .09 + Math.sin(s*1.25 + ph)*.09;
      g.rotation.z = Math.sin(s*.9 + ph)*.1;
      g.rotation.x = Math.cos(s*.75 + ph)*.07;
    }else if(g.userData.windLeafy){                   /* ต้นไม้/พุ่ม: เอนไหวเบาๆ */
      g.rotation.z = Math.sin(s*.8 + ph)*.028;
      g.rotation.x = Math.sin(s*.62 + ph*1.3)*.02;
    }
  }
}

/* ============================================================
   ของในฉากที่ขยับได้ (ธง ควัน เรือ ปลาตากแห้ง หุ่นไล่กา เข็มนาฬิกา ผิวน้ำ)
   ฉากตายตัวถูก merge เป็นก้อนใหญ่เพื่อลด draw call → ชิ้นที่ต้องขยับจึงถูก "ดึงออก"
   ก่อน merge แล้วย้ายมาอยู่กลุ่ม sceneryFx ในพิกัดโลก (three.js cull ให้เองเมื่ออยู่นอกจอ)
   ทุกชิ้นขยับด้วยสูตร sin ล้วนๆ ไม่มีการสร้าง/ทิ้ง object ระหว่างเล่น
   ============================================================ */
let sceneryFx = null, fxProps = [];
function fxTag(o, kind, opts){ o.userData.fx = Object.assign({kind}, opts||{}); return o; }
function registerFx(o){
  const f = o.userData.fx;
  if(f.ph == null) f.ph = Math.abs(o.position.x*1.7 + o.position.z*2.3) % 6.28;
  f.by = o.position.y; f.brx = o.rotation.x; f.bry = o.rotation.y; f.brz = o.rotation.z;
  f.bsx = o.scale.x; f.bsy = o.scale.y;
  sceneryFx.add(o); fxProps.push(o);
}
/* ดึงชิ้นที่ติดธง fx ออกจากกลุ่ม (คงตำแหน่ง/หมุนเดิมโดยแปลงเป็นพิกัดโลก) ก่อนเอากลุ่มไป merge */
function extractFx(g){
  if(!sceneryFx) return;
  const found = [];
  g.updateMatrixWorld(true);
  g.traverse(o=>{ if(o !== g && o.userData.fx) found.push(o); });
  found.forEach(o=>{
    const m = o.matrixWorld.clone();
    o.parent.remove(o);
    m.decompose(o.position, o.quaternion, o.scale);
    o.rotation.setFromQuaternion(o.quaternion);
    registerFx(o);
  });
}
function mergeCollectFx(g, parts, key){ extractFx(g); mergeCollect(g, parts, key); }
/* prop ทั้งชิ้นที่ต้องขยับทั้งก้อน (เรือ/หุ่นไล่กา) — ยุบชิ้นส่วนภายในให้เหลือน้อย mesh แล้วไม่ merge รวมฉาก */
function addFxProp(g, kind, opts){
  /* ⚠ mergeCollect อบ matrixWorld ลงไปใน geometry — ถ้า merge ตอนกลุ่มถูกวางตำแหน่งไว้แล้ว
     ตำแหน่งจะถูกนับซ้ำสองรอบ (ของกระเด็นไปไกลเป็นเท่าตัวจนหายจากแผนที่ — เคยทำเรือหายมาแล้ว)
     จึงต้องย้ายกลับไปที่จุดกำเนิดก่อน merge แล้วค่อยคืนตำแหน่งเดิม */
  const p = g.position.clone(), q = g.quaternion.clone();
  g.position.set(0,0,0); g.quaternion.identity(); g.updateMatrixWorld(true);
  mergeDecorGroup(g);
  g.position.copy(p); g.quaternion.copy(q); g.updateMatrixWorld(true);
  fxTag(g, kind, opts); registerFx(g);
}
function updateSceneryFx(t, dt){
  if(!sceneryFx || hScene !== 'out') return;
  const s = t*.001;
  for(let i=0; i<fxProps.length; i++){
    const o = fxProps[i], f = o.userData.fx, ph = f.ph;
    switch(f.kind){
      case 'flag':                                   /* ธงผืนสี่เหลี่ยม: สะบัดรอบเสา + ผ้าย่นเป็นระลอก */
        o.rotation.y = f.bry + Math.sin(s*2.1 + ph)*.3;
        o.rotation.z = f.brz + Math.sin(s*3.2 + ph)*.1;
        o.scale.x = f.bsx * (1 + Math.sin(s*4.1 + ph)*.09);
        break;
      case 'banner':                                 /* ธงราวสามเหลี่ยม: ปลิวขึ้นลงเบาๆ */
        o.rotation.z = f.brz + Math.sin(s*2.6 + ph)*.34;
        o.rotation.y = f.bry + Math.sin(s*1.7 + ph)*.2;
        break;
      case 'fire':                                   /* เปลวไฟกองแคมป์: วูบวาบ + เอนตามลม */
        o.scale.y = f.bsy * (1 + Math.sin(s*9 + ph)*.22 + Math.sin(s*13.7 + ph*2)*.1);
        o.scale.x = f.bsx * (1 + Math.sin(s*11 + ph)*.12);
        o.rotation.z = f.brz + Math.sin(s*7 + ph)*.14;
        break;
      case 'smoke': {                                /* ควันปล่องไฟ: ลอยขึ้น พองตัว แล้ววนกลับ */
        const k = ((s*.28 + ph) % 1);
        o.position.y = f.by + k*1.7;
        const sc = .45 + k*1.5;
        o.scale.setScalar(sc * (k > .82 ? (1-k)/.18 : 1));   /* ย่อหายตอนใกล้สุดทาง แทนการหายวับ */
        o.position.x = f.bx0 != null ? f.bx0 : (f.bx0 = o.position.x);
        o.position.x += Math.sin(s*.9 + ph)*.12*k;           /* เอนตามลมยิ่งสูงยิ่งเอน */
        break;
      }
      case 'boat':                                   /* เรือ: โคลงตามคลื่น */
        o.position.y = f.by + Math.sin(s*1.05 + ph)*.055;
        o.rotation.z = f.brz + Math.sin(s*.85 + ph)*.05;
        o.rotation.x = f.brx + Math.sin(s*1.25 + ph*1.3)*.035;
        break;
      case 'fish':                                   /* ปลาตากแห้ง: แกว่งบนราว */
        o.rotation.z = f.brz + Math.sin(s*2.3 + ph)*.26;
        break;
      case 'scare':                                  /* หุ่นไล่กา: โยกตามลม */
        o.rotation.z = f.brz + Math.sin(s*1.15 + ph)*.07;
        o.rotation.y = f.bry + Math.sin(s*.6 + ph)*.09;
        break;
      case 'ducky': {                                /* เป็ดประจำบ่อ: ว่ายไปหาจุดหมายทีละจุดในบ่อ */
        if(f.tx == null || Math.hypot(f.tx-o.position.x, f.tz-o.position.z) < .3){
          const p2 = randPondPoint();                /* ถึงแล้ว → สุ่มจุดใหม่ในบ่อ (เลี่ยงใบบัว) */
          f.tx = p2.x; f.tz = p2.z;
          f.wait = .6 + Math.random()*1.4;           /* แวะลอยนิ่งแป๊บนึงก่อนไปต่อ ดูเป็นธรรมชาติ */
        }
        if(f.wait > 0){ f.wait -= dt; }
        else {
          const dx2 = f.tx - o.position.x, dz2 = f.tz - o.position.z;
          const d2 = Math.hypot(dx2, dz2) || 1;
          o.position.x += dx2/d2 * f.sp * dt;
          o.position.z += dz2/d2 * f.sp * dt;
          let want = Math.atan2(dx2, dz2), cur = o.rotation.y;   /* ค่อยๆ หันหัวไปทางที่ว่าย */
          while(want - cur > Math.PI) want -= Math.PI*2;
          while(want - cur < -Math.PI) want += Math.PI*2;
          o.rotation.y = cur + (want-cur) * Math.min(1, dt*2.5);
        }
        o.position.y = f.by + Math.sin(s*1.7 + f.ph)*.03;         /* ลอยขึ้นลงตามคลื่น */
        o.rotation.z = Math.sin(s*1.3 + f.ph)*.05;
        break;
      }
      case 'water':                                  /* ผิวน้ำ: ยกตัวขึ้นลงช้าๆ เหมือนคลื่นใหญ่ */
        o.position.y = f.by + Math.sin(s*.55 + ph)*.014;
        break;
      case 'ripple': {                               /* วงคลื่นบนบ่อน้ำ */
        const k = ((s*.32 + ph) % 1);
        const sc = .5 + k*2.2;
        o.scale.set(sc, sc, 1);
        o.material.opacity = (1-k)*.32;
        break;
      }
      case 'foam': {                                 /* ฟองคลื่นซัดเข้าหาฝั่งแล้วจางหาย */
        const k = ((s*.3 + f.ph) % 1);
        o.position.z = f.z0 + (1 - k)*1.1;
        o.material.opacity = Math.sin(k*Math.PI)*.34;
        o.scale.x = .85 + Math.sin(k*Math.PI)*.3;
        break;
      }
      case 'clockH': o.rotation.z = f.brz - s*.0087; break;   /* เข็มสั้น: 1 รอบ ~12 นาทีจริง */
      case 'clockM': o.rotation.z = f.brz - s*.105;  break;   /* เข็มยาว: 1 รอบ ~1 นาที */
    }
  }
}

/* ---------- ของเล่นลอยน้ำในสระ + ผิวน้ำกระเพื่อม ----------
   สระถูกแยกออกจากก้อน merge เพื่อให้ขยับได้ (เหมือนน้ำพุ) */
let poolFx = null;
function addPoolFloats(g, w, d){
  const u = { floats: [] };
  g.traverse(o=>{ if(o.isMesh && o.geometry && Math.abs(o.position.y - .26) < .01) u.water = o; });  /* แผ่นน้ำ */
  const ring = torus(.34, .11, 0xff8a65, 14);       /* ห่วงยางลอยน้ำ */
  ring.rotation.x = Math.PI/2; ring.position.set(-w*.2, .34, d*.1); g.add(ring);
  u.floats.push({m:ring, ph:0, rx:w*.22, rz:d*.22, spin:.5});
  const ball = sphere(.24, 0xffd54f, 10);           /* ลูกบอลชายหาด */
  ball.position.set(w*.22, .38, -d*.12); g.add(ball);
  u.floats.push({m:ball, ph:2.1, rx:w*.2, rz:d*.18, spin:1.1});
  g.userData.poolFx = u;
}
function updatePoolFx(t, dt){
  if(!poolFx || hScene !== 'out' || !charGroup) return;
  const near = Math.hypot(charGroup.position.x - poolFx.position.x, charGroup.position.z - poolFx.position.z) < 24;
  if(poolFx.visible !== near) poolFx.visible = near;
  if(!near) return;
  const u = poolFx.userData.poolFx, s = t*.001;
  if(u.water) u.water.position.y = .26 + Math.sin(s*1.3)*.012;      /* ผิวน้ำขยับเบาๆ */
  for(let i=0; i<u.floats.length; i++){
    const f = u.floats[i];
    f.m.position.x = Math.sin(s*.32 + f.ph)*f.rx;                   /* ลอยวนช้าๆ ในสระ */
    f.m.position.z = Math.cos(s*.26 + f.ph*1.3)*f.rz;
    f.m.position.y = .34 + Math.sin(s*1.5 + f.ph)*.035;             /* ขึ้นลงตามคลื่น */
    f.m.rotation.y += dt*f.spin*.5;
    f.m.rotation.z = Math.sin(s*1.1 + f.ph)*.12;                    /* โคลงตามน้ำ */
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
/* ---------- ทุ่งดอกทานตะวัน (ข้างห้าง ชุมชนที่ 2) ----------
   ต้นสูงกว่าดอกไม้ทุ่งอื่นมาก (~1.1-1.4) จึงวางแค่ 3 ต้นต่อช่อง ไม่งั้นจะทึบจนบังตัวห้างบนจอ
   จานดอกหันหน้าไป +z (ทิศที่กล้องไอโซมอง) ทุกต้น เด็กจึงเห็น "หน้ายิ้ม" ของดอกทานตะวันเสมอ */
function buildSunflower(h, seed){
  const g = new THREE.Group();
  const petal = seed % 2 ? 0xffc93c : 0xffd54f;
  const stem = cyl(.035,.05,h, 0x5aa74e, 6); stem.position.y = h/2; g.add(stem);
  [-1,1].forEach((sd,i)=>{                          /* ใบ 2 ใบ คนละระดับ */
    const lf = sphere(.15, 0x6fbf73, 6); lf.scale.set(1.5,.28,.85);
    lf.position.set(sd*.15, h*(.4 + i*.16), 0); lf.rotation.z = -sd*.5; g.add(lf);
  });
  const head = new THREE.Group(); head.position.set(0, h + .06, .04); g.add(head);
  for(let p=0; p<10; p++){                          /* กลีบดอกเรียงรอบจาน */
    const a = p*Math.PI*2/10;
    const pt = sphere(.14, petal, 5); pt.scale.set(.62,.62,.3);
    pt.position.set(Math.cos(a)*.24, Math.sin(a)*.24, 0); head.add(pt);
  }
  const disc = cyl(.19,.19,.07, 0x8d5a2b, 12); disc.rotation.x = Math.PI/2; head.add(disc);
  const seedC = cyl(.13,.13,.09, 0x6b4423, 10);     seedC.rotation.x = Math.PI/2; head.add(seedC);
  const back = cyl(.21,.21,.05, 0x6fbf73, 12); back.rotation.x = Math.PI/2; back.position.z = -.06; head.add(back);
  return g;
}
function buildSunflowers(x, z){
  const g = new THREE.Group();
  const rnd = fieldRnd(x, z);
  for(let k=0; k<3; k++){
    const fx = (rnd()-.5)*.78, fz = (rnd()-.5)*.7;
    const sf = buildSunflower(1.05 + rnd()*.35, (x + z + k) & 3);
    sf.position.set(fx, 0, fz); sf.rotation.y = (rnd()-.5)*.5; g.add(sf);
  }
  const tuft = sphere(.19, 0x8fd06c, 5); tuft.scale.set(1,.42,1);
  tuft.position.set((rnd()-.5)*.7, .04, (rnd()-.5)*.7); g.add(tuft);
  return g;
}
function buildFieldPath(x, z){                      /* ทางเดินดินกลางทุ่ง + ก้อนหินเล็กๆ ข้างทาง */
  const g = new THREE.Group();
  const rnd = fieldRnd(x, z);
  const road = box(1.02,.07,.84, 0xd0b483,.06); road.position.y = .035; g.add(road);
  /* ก้อนหินกลมโรยบนทาง สีกลืนไปกับพื้นทางดิน (เข้มกว่าเล็กน้อยพอให้เห็นเป็นลาย) + รับเงาได้ */
  for(let k=0; k<3; k++){
    const st = cyl(.13,.15,.05, 0xc5a370, 7);
    st.receiveShadow = hShadows;
    st.position.set((rnd()-.5)*.8, .07, (rnd()-.5)*.6); g.add(st);
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
/* ---------- ต้นมะพร้าวริมหาด ----------
   เดิมเป็นเสาตรงท่อนเดียว + ใบแผ่นแบน 6 แผ่นกางเป็นดาว มองแล้วไม่เหมือนมะพร้าว (ผู้ใช้แจ้ง 2026-08-03)
   ของใหม่: ลำต้นโค้งทำจากท่อนซ้อนไล่ขนาด + วงปล้องรอบต้น, ทางใบ 7 ทาง ทางละ 3 ท่อน "ลู่ลงเป็นโค้ง"
   (ปลายทางใบเล็กและต่ำลงเรื่อยๆ) + ก้านทางใบ, มะพร้าวเป็นพวง 3 ลูกใต้ยอด */
function buildPalm(){
  const g = new THREE.Group();
  const SEG = 6, H = 2.35, lean = .55;                 /* lean = ยอดเอนออกจากโคนไปทาง +x กี่หน่วย */
  let tx = 0, ty = 0;
  for(let i=0; i<SEG; i++){
    const t = i/SEG, t2 = (i+1)/SEG;
    const y0 = H*t, y1 = H*t2;
    const x0 = lean*t*t, x1 = lean*t2*t2;              /* โค้งแบบพาราโบลา โคนตั้งตรง ยอดเอน */
    const len = Math.hypot(x1-x0, y1-y0);
    const sg = cyl(.115 - i*.011, .155 - i*.011, len + .04, i%2 ? 0xcf9f68 : 0xc4914f, 9);
    sg.position.set((x0+x1)/2, (y0+y1)/2, 0);
    sg.rotation.z = -Math.atan2(x1-x0, y1-y0);
    sg.castShadow = hShadows; g.add(sg);
    if(i%2 === 0){                                     /* วงปล้องรอบลำต้น */
      const rg = cyl(.135 - i*.011, .135 - i*.011, .05, 0xb98446, 9);
      rg.position.set(x0 + (x1-x0)*.4, y0 + (y1-y0)*.4, 0); rg.rotation.z = sg.rotation.z; g.add(rg);
    }
    tx = x1; ty = y1;
  }
  const crown = sphere(.17, 0xb98446, 8); crown.position.set(tx, ty + .04, 0); g.add(crown);
  /* ทางใบ: กลุ่มละ 1 ทาง หมุนรอบยอดต้น แล้วในกลุ่มวางท่อนใบเรียงออกไปตามแกน +x
     **ต้องให้ปลายทางใบ "ลู่ลง" ชัดๆ (dy ติดลบมากขึ้นเรื่อยๆ + เอียง tilt แรงขึ้น)**
     ถ้าวางแบนระนาบเดียวกันหมด กล้องไอโซจะเห็นเป็นจานกลมแบนๆ เหมือนดอกไม้ ไม่ใช่ต้นมะพร้าว (เคยพลาดมาแล้ว) */
  const FR = 7;
  for(let i=0; i<FR; i++){
    const fr = new THREE.Group();
    fr.position.set(tx, ty + .06 + (i%2 ? .07 : -.03), 0);   /* สลับสูง-ต่ำ ทางใบจะได้ไม่เรียงเป็นจานเดียวกันเป๊ะ */
    fr.rotation.y = -(i/FR*Math.PI*2 + .3);
    g.add(fr);
    /* ใบเป็น "ก้อนกลมแบน" (ทรงกลมบีบแบน) ไล่เล็กลงตามปลายทางใบ — ชุดเดียวกับพุ่มใบของต้นไม้อื่นทั้งแผนที่
       (เดิมเป็นแผ่นไม้กระดานบางๆ ดูเป็นคนละธีมกับต้นไม้ต้นอื่น — ผู้ใช้แจ้ง 2026-08-03) */
    [[.30,.30,.20,-.04,0x6fbf73],[.72,.25,.15,-.24,0x5cb85c],[1.06,.18,.10,-.60,0x4fa85c]].forEach(([r,rad,thin,dy,c],k)=>{
      const lf = sphere(rad, c, 8);
      lf.scale.set(1.9, thin/rad*1.1, 1.15);
      lf.position.set(r, dy, 0); lf.rotation.z = -.18 - k*.34; fr.add(lf);
    });
    const rib = cyl(.035,.05,1.16, 0x4a9c4a, 6);       /* ก้านทางใบ (โค้งลงตามใบ) */
    rib.rotation.z = Math.PI/2 - .34; rib.position.set(.54, -.2, 0); fr.add(rib);
  }
  const bud = cone(.1,.5, 0x6fbf73, 7); bud.position.set(tx, ty + .34, 0); bud.rotation.z = -.2; g.add(bud);  /* ยอดอ่อนกลางพุ่ม กันยอดแบน */
  [[.17,-.1,.05],[-.05,-.14,.17],[.06,-.2,-.12]].forEach(([ox,oy,oz])=>{   /* พวงมะพร้าวใต้ยอด */
    const co = sphere(.115, 0x8d6e63, 8); co.scale.y = .92;
    co.position.set(tx + ox, ty + oy, oz); g.add(co);
  });
  return g;
}
/* ---------- ที่เก็บเรือแคนูริมหาด (มีเรือเก็บอยู่ 2 ลำ) ----------
   ชั้นวางไม้ 2 ชั้น (ขาทรงตัว A 2 ชุด + คานยาว) + เรือแคนู 2 ลำวางคว่ำอยู่บนชั้น
   หันตัวเรือตามแกน x ของกลุ่ม แล้วให้คนเรียกหมุน 45° ทีหลัง เรือจะได้ขวางจอพอดี (กล้องไอโซมองจาก +x,+z) */
/* เรือแคนู 1 ลำ (วางตามแกน x) — กล้องไอโซมองจากด้านบน ⇒ **ห้ามเอาแผ่นขอบเรือกว้างคลุมทับหลังคาเรือ**
   ไม่งั้นจะเห็นเป็นแผ่นไม้สีขาวแบนๆ แผ่นเดียว (เคยพลาดมาแล้ว) ต้องโชว์ตัวถังสี + ร่องกลางเรือสีเข้ม
   + ราวขอบเรียวข้างละเส้น จึงจะอ่านออกว่าเป็นเรือ */
function buildCanoe(col, len){
  const g = new THREE.Group();
  const hull = box(len, .3, .38, col, .14); g.add(hull);
  const cav  = box(len*.76, .12, .2, petShade(col,.62), .05); cav.position.y = .13; g.add(cav);
  [-1,1].forEach(s=>{
    const rail = box(len*.92, .07, .06, 0xfffaf0, .025); rail.position.set(0,.15,s*.16); g.add(rail);
    /* หัว-ท้ายเรือ: กรวยต้อง "ชี้ออกนอกลำ" ทั้งสองข้าง และเชิดขึ้นนิดหน่อย
       ⚠ หมุนรอบแกน z ด้วย +90° จะได้ปลายชี้ไป -x (ทิ่มเข้าในลำเรือ) ⇒ ต้องเป็น -s*(…) เท่านั้น
       (ของเดิม s*Math.PI/2 ทำให้หัวเรือข้างหนึ่งกลับด้าน ดูเหมือนเรือหัวท้ายผิด) */
    const tip = cone(.2, .46, col, 9); tip.rotation.z = -s*(Math.PI/2 - .22);
    tip.position.set(s*(len/2 + .16), .05, 0); tip.scale.set(1,1,.9); g.add(tip);
    const lip = cyl(.055,.055,.16, 0xfffaf0, 8); lip.rotation.z = Math.PI/2;   /* ปลอกปลายหัวเรือ */
    lip.position.set(s*(len/2 + .3), .11, 0); g.add(lip);
  });
  [-.22,.22].forEach(ox=>{                       /* ที่นั่งพาดกลางลำ */
    const st = box(.13,.06,.3, 0xd9a86c,.02); st.position.set(ox,.14,0); g.add(st);
  });
  return g;
}
function buildCanoeRack(){
  const g = new THREE.Group();
  const wood = 0xc98d4e, dark = 0xa9784f;
  [-1,1].forEach(s=>{                           /* ขาทรงตัว A 2 ชุด */
    [-1,1].forEach(d=>{
      const lg = cyl(.055,.07,1.15, wood, 7);
      lg.position.set(s*.52, .55, d*.3); lg.rotation.x = -d*.28; g.add(lg);
    });
    const tie = box(.09,.09,.62, dark,.03); tie.position.set(s*.52,.42,0); g.add(tie);
  });
  [-1,1].forEach(d=>{                            /* คานพาดยาว 2 เส้น */
    const bar = box(1.5,.09,.1, dark,.04); bar.position.set(0,1.06,d*.24); g.add(bar);
  });
  const c1 = buildCanoe(0xef8354, 1.5); c1.position.set(0, 1.28, 0); g.add(c1);
  const c2 = buildCanoe(0x7fc4e8, 1.34); c2.position.set(.06, .5, .04); c2.rotation.z = .05; g.add(c2);
  [-1,1].forEach(s=>{                            /* ไม้พายพิงชั้น */
    const pd = cyl(.03,.03,1.1, 0xd9a86c, 6); pd.rotation.z = s*.34;
    pd.position.set(s*.78, .55, -.34); g.add(pd);
    const bl = box(.1,.3,.05, 0xffd54f,.02); bl.position.set(s*(.78 + .19), .04, -.34); g.add(bl);
  });
  return g;
}
/* ---------- ราวแขวนห่วงยางริมหาด (มีห่วงยางแขวนอยู่) ---------- */
function buildRingRack(){
  const g = new THREE.Group();
  const wood = 0xc98d4e, dark = 0xa9784f;
  [-1,1].forEach(s=>{
    const post = cyl(.075,.095,1.5, wood, 8); post.position.set(s*.58,.75,0); g.add(post);
    const cap  = sphere(.1, 0xffd54f, 8);     cap.position.set(s*.58,1.54,0); g.add(cap);
    const ft   = box(.26,.1,.4, dark,.04);    ft.position.set(s*.58,.05,0); g.add(ft);
  });
  const bar = box(1.36,.1,.1, dark,.04); bar.position.y = 1.36; g.add(bar);
  /* ห่วงยาง 3 ห่วง แขวนคนละระดับ (แดง-ขาว / ฟ้า / เหลือง) — ห่วงตั้งระนาบ XY หันหน้าเข้าหากล้อง */
  [[-.42,.86,0xe4574a,.3],[.02,.74,0x7fc4e8,.27],[.44,.9,0xffd54f,.24]].forEach(([ox,oy,c,r])=>{
    const rope = cyl(.018,.018,1.36-oy-r, 0xfbf7f0, 5); rope.position.set(ox, (1.36+oy+r)/2, 0); g.add(rope);
    const rg = torus(r,.075, c, 14); rg.position.set(ox, oy, 0); g.add(rg);
    for(let k=0;k<4;k++){                        /* แถบขาวคาดห่วง */
      const a = k*Math.PI/2 + Math.PI/4;
      const wp = box(.13,.13,.17, 0xfbf7f0,.03);
      wp.position.set(ox + Math.cos(a)*r, oy + Math.sin(a)*r, 0); g.add(wp);
    }
  });
  const box2 = box(.62,.34,.42, 0x8fd694,.06); box2.position.set(0,.17,.42); g.add(box2);   /* ลังเก็บของข้างราว */
  const lid  = box(.66,.08,.46, 0x6fbf73,.03); lid.position.set(0,.38,.42); g.add(lid);
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
  BEACH_RACKS.forEach(([x, off, kind])=>{           /* ชั้นวางเรือแคนู / ราวห่วงยาง (ชนิดมากับข้อมูลเลย) */
    const z = seaEdgeZ(x) + off;
    if(z>=0 && z<OUT_D && isSandTile(x, z)) out.push([x, z, kind]);
  });
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
  const tone = {fruit:0xef8354, ice:0x7fc4e8, noodle:0xe4574a, balloon:0xb388ff,
                meatball:0xe4574a, sausage:0xef8354, tokyo:0xffc857, snack:0x5aa9e6,
                smoothie:0xb388ff, popcorn:0xe36f5c, cotton:0xef8fa5, toy:0x6fbf73,
                milk:0x9ad9f0, shave:0xffd54f}[kind] || 0xef8354;
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
  /* ---- รถเข็นของตลาดหน้าโรงเรียน ----
     ของทุกชิ้นต้องสูงไม่เกิน ~1.45 (กันสาดอยู่ y 1.6) ยกเว้นลูกโป่งที่ตั้งใจให้ลอยทะลุขึ้นไป */
  }else if(kind==='meatball' || kind==='sausage'){     /* ลูกชิ้นปิ้ง / ไส้กรอกย่าง — เตาถ่านมีไม้เรียงย่าง */
    const grill = box(.86,.16,.44, 0x5b4a42,.04); grill.position.set(-.14,.9,0); g.add(grill);
    const coal  = box(.72,.05,.32, 0xef6a58,.02); coal.position.set(-.14,.99,0); g.add(coal);
    [-.28,-.14,0].forEach((ox,i)=>{
      const sk = cyl(.018,.018,.52, 0xe8d9b8, 6); sk.rotation.x = Math.PI/2;
      sk.position.set(ox+.06,1.05,0); g.add(sk);
      [-.14,0,.14].forEach(oz=>{
        if(kind==='meatball'){ const bl = sphere(.065,0xd2a86a,8); bl.position.set(ox+.06,1.06,oz); g.add(bl); }
        else { const ss = cyl(.055,.055,.16, 0xe0714f, 8); ss.rotation.x = Math.PI/2; ss.position.set(ox+.06,1.06,oz*1.05); g.add(ss); }
      });
    });
    const cup = cyl(.11,.09,.2, 0xfffaf0,10); cup.position.set(.42,.98,0); g.add(cup);   /* ถ้วยน้ำจิ้ม */
    const sauce = cyl(.09,.09,.04, kind==='meatball' ? 0xe4574a : 0xffc857,10); sauce.position.set(.42,1.09,0); g.add(sauce);
  }else if(kind==='tokyo'){                            /* ขนมโตเกียว — กระทะกลมแบน + ม้วนเรียง */
    const pan = cyl(.3,.3,.07, 0xb8c2c8,16); pan.position.set(-.2,.88,0); g.add(pan);
    const oil = cyl(.26,.26,.03, 0xe8d9b8,16); oil.position.set(-.2,.93,0); g.add(oil);
    [-.14,0,.14].forEach((oz,i)=>{
      const rl = cyl(.055,.055,.3, [0xf2d5a8,0xecc07a,0xf7e3c8][i], 8); rl.rotation.z = Math.PI/2;
      rl.position.set(-.2,.98,oz); g.add(rl);
    });
    const jug = cyl(.12,.13,.24, 0xfffaf0,10); jug.position.set(.36,1.0,0); g.add(jug);
    const bat = cyl(.1,.1,.04, 0xffe9a8,10); bat.position.set(.36,1.11,0); g.add(bat);
  }else if(kind==='snack'){                            /* ขนมขบเคี้ยว — ราวแขวนถุงขนมสีสด */
    [-1,1].forEach(s=>{ const po = cyl(.028,.028,.56, 0xd8dee3,6); po.position.set(s*.44,1.14,-.24); g.add(po); });
    const bar = cyl(.025,.025,.9, 0xd8dee3,6); bar.rotation.z = Math.PI/2; bar.position.set(0,1.4,-.24); g.add(bar);
    [[-.32,0xef8354],[-.11,0xffd54f],[.11,0x8fd694],[.32,0xef8fa5]].forEach(([ox,c])=>{
      const bg = box(.17,.24,.06, c,.03); bg.position.set(ox,1.24,-.24); g.add(bg);
      const cl = box(.17,.05,.06, 0xfffaf0,.02); cl.position.set(ox,1.37,-.24); g.add(cl);
    });
    const jar = cyl(.14,.14,.26, 0xd5f0fb,12); jar.position.set(.3,1.0,.14); g.add(jar);   /* โหลขนมบนรถ */
    [[.26,1.0],[.34,1.06],[.3,.94]].forEach(([ox,oy])=>{
      const cd = sphere(.05,0xffc857,8); cd.position.set(ox,oy,.14); g.add(cd);
    });
  }else if(kind==='smoothie'){                         /* น้ำปั่น — เครื่องปั่น + แก้วมีหลอด */
    const bl2 = cyl(.13,.11,.3, 0xd5f0fb,12); bl2.position.set(-.34,1.0,0); g.add(bl2);
    const juice = cyl(.11,.1,.16, 0xff8fb3,12); juice.position.set(-.34,.95,0); g.add(juice);
    const lid2 = cyl(.14,.14,.06, 0xb388ff,12); lid2.position.set(-.34,1.18,0); g.add(lid2);
    [[.06,0xffb3c6],[.3,0xffd54f]].forEach(([ox,c],i)=>{
      const cu = cyl(.085,.065,.22, 0xfffaf0,10); cu.position.set(ox,.96,i?.1:-.1); g.add(cu);
      const dr = cyl(.075,.075,.14, c,10); dr.position.set(ox,.94,i?.1:-.1); g.add(dr);
      const sw = cyl(.016,.016,.24, 0xef8354,6); sw.rotation.z = .3; sw.position.set(ox+.05,1.16,i?.1:-.1); g.add(sw);
    });
    [[-.04,0xe4574a],[.42,0x8fd06c]].forEach(([ox,c])=>{ const fr = sphere(.09,c,8); fr.position.set(ox,.92,.24); g.add(fr); });
  }else if(kind==='popcorn'){                          /* ป๊อปคอร์น — ตู้คั่วกระจก + ถังลายทาง */
    const mc = box(.46,.44,.4, 0xe4574a,.05); mc.position.set(-.3,1.04,0); g.add(mc);
    const gl2 = box(.34,.3,.06, 0xd5f0fb,.03); gl2.position.set(-.3,1.06,.2); g.add(gl2);
    const rf = box(.52,.08,.46, 0xffd54f,.03); rf.position.set(-.3,1.3,0); g.add(rf);
    [[-.36,1.4,.06],[-.24,1.44,.05],[-.3,1.5,.045]].forEach(([ox,oy,r])=>{
      const pc = sphere(r,0xfff3b0,8); pc.position.set(ox,oy,0); g.add(pc);
    });
    const bkt = cyl(.15,.12,.26, 0xfffaf0,12); bkt.position.set(.36,1.0,0); g.add(bkt);
    const stp = cyl(.155,.13,.09, 0xe4574a,12); stp.position.set(.36,1.0,0); g.add(stp);
    [[.3,1.18],[.42,1.2],[.36,1.26]].forEach(([ox,oy])=>{
      const pc = sphere(.055,0xfff3b0,8); pc.position.set(ox,oy,0); g.add(pc);
    });
  }else if(kind==='cotton'){                           /* สายไหม — หม้อปั่น + ไม้สายไหมปักเรียง */
    const drum = cyl(.24,.24,.18, 0xd8dee3,14); drum.position.set(-.3,.94,0); g.add(drum);
    const hole = cyl(.15,.15,.05, 0xf0e4ff,12); hole.position.set(-.3,1.05,0); g.add(hole);
    [[.06,0xff8fb3],[.26,0x9fd8f5],[.46,0xffd54f]].forEach(([ox,c],i)=>{
      const st2 = cyl(.018,.018,.3, 0xe8d9b8,6); st2.position.set(ox,.98,i%2?.12:-.12); g.add(st2);
      const cc = sphere(.15,c,10); cc.scale.set(1,1.15,1); cc.position.set(ox,1.24,i%2?.12:-.12); g.add(cc);
      const cc2 = sphere(.1,c,8); cc2.position.set(ox+.07,1.34,i%2?.12:-.12); g.add(cc2);
    });
  }else if(kind==='toy'){                              /* ของเล่น — ชั้นวาง 2 ชั้น + กังหันลม + ตุ๊กตาหมี */
    [0,1].forEach(i=>{
      const sh = box(.92,.06,.34, 0xc98d4e,.02); sh.position.set(0,.94+i*.32,-.08); g.add(sh);
    });
    [-1,1].forEach(s=>{ const po = cyl(.03,.03,.5, 0xb4763a,6); po.position.set(s*.44,1.1,-.08); g.add(po); });
    const ball = sphere(.11,0xef8354,10); ball.position.set(-.32,1.08,-.08); g.add(ball);
    [0,1].forEach(i=>{ const bk = box(.14,.14,.14,[0x7fc4e8,0xffd54f][i],.03); bk.position.set(.3,1.04+i*.15,-.08); g.add(bk); });
    const bear = sphere(.11,0xd9a86c,10); bear.position.set(-.02,1.4,-.08); g.add(bear);
    const bhd = sphere(.085,0xe8b46a,10); bhd.position.set(-.02,1.56,-.08); g.add(bhd);
    [-1,1].forEach(s=>{ const er = sphere(.04,0xd9a86c,7); er.position.set(-.02+s*.07,1.63,-.08); g.add(er); });
    const wst = cyl(.018,.018,.44, 0xe8d9b8,6); wst.position.set(.42,1.2,.2); g.add(wst);   /* กังหันลม */
    [0,1,2,3].forEach(i=>{
      const bd3 = box(.12,.12,.02, [0xff8fb3,0xffd54f,0x7fc4e8,0x8fd694][i],.02);
      bd3.position.set(.42 + Math.cos(i*Math.PI/2)*.1, 1.42 + Math.sin(i*Math.PI/2)*.1, .21); g.add(bd3);
    });
  }else if(kind==='milk'){                             /* นมเย็น — ถังนมสเตนเลส + ขวดนมเรียง + ลังแช่ */
    const can = cyl(.17,.21,.32, 0xc9d6de,12); can.position.set(-.34,1.0,0); g.add(can);
    const nk  = cyl(.1,.12,.1, 0xb4c3cc,10);   nk.position.set(-.34,1.2,0); g.add(nk);
    const lid3= cyl(.13,.13,.05, 0x8fa3ad,10); lid3.position.set(-.34,1.27,0); g.add(lid3);
    [[.02,-.11],[.14,.06],[.3,-.06]].forEach(([ox,oz],i)=>{
      const bt = cyl(.075,.08,.26, 0xfbf7f0,10); bt.position.set(ox,.97,oz); g.add(bt);
      const cp = cyl(.05,.05,.06, [0x7fc4e8,0xef8fa5,0xffd54f][i],8); cp.position.set(ox,1.13,oz); g.add(cp);
    });
    const crate = box(.34,.2,.4, 0x7fc4e8,.04); crate.position.set(.46,.94,.12); g.add(crate);
  }else if(kind==='shave'){                            /* น้ำแข็งไส — ก้อนน้ำแข็ง + เครื่องไส + ถ้วยราดน้ำหวาน */
    const mach = box(.36,.42,.34, 0xd8dee3,.05); mach.position.set(-.36,1.05,0); g.add(mach);
    const iceB = box(.24,.2,.22, 0xd5f0fb,.04);  iceB.position.set(-.36,1.36,0); g.add(iceB);
    const crank= cyl(.03,.03,.24, 0x8f6231,6); crank.rotation.z = Math.PI/2; crank.position.set(-.1,1.24,0); g.add(crank);
    const knob = sphere(.06,0xe4574a,8); knob.position.set(.02,1.24,0); g.add(knob);
    [[.12,-.12,0xff8fb3],[.3,.08,0x8fd694]].forEach(([ox,oz,c])=>{     /* ถ้วยน้ำแข็งไสพูนราดน้ำหวาน */
      const bw2 = cyl(.13,.09,.12, 0xfffaf0,12); bw2.position.set(ox,.92,oz); g.add(bw2);
      const mound = sphere(.13,0xf2fbff,10); mound.scale.y = .8; mound.position.set(ox,1.03,oz); g.add(mound);
      const syr = sphere(.09,c,8); syr.scale.y = .5; syr.position.set(ox,1.09,oz); g.add(syr);
    });
    [[.44,-.14,0xe4574a],[.5,.04,0x8fd694],[.44,.2,0xffd54f]].forEach(([ox,oz,c])=>{   /* ขวดน้ำหวาน */
      const bo = cyl(.05,.055,.22, c,8); bo.position.set(ox,.95,oz); g.add(bo);
      const cp = cyl(.03,.03,.05, 0xfffaf0,6); cp.position.set(ox,1.09,oz); g.add(cp);
    });
  }else{                                               /* รถเข็นลูกโป่ง */
    const str = cyl(.03,.03,.7,0xf7f3ee,6); str.position.set(.3,1.5,0); g.add(str);
    [[0,1.95,0xff8fb3],[.24,2.06,0xffd54f],[-.2,2.1,0x7fc4e8],[.06,2.26,0xb388ff]].forEach(p=>{
      const bl = sphere(.2,p[2],12); bl.scale.set(1,1.16,1); bl.position.set(.3+p[0],p[1],0); g.add(bl);
    });
  }
  return g;
}
/* ป้ายตลาดหน้าโรงเรียน (ตั้งมุมทางเข้าตลาด) — ทรงเดียวกับป้ายสนามเด็กเล่น แต่สีตลาด + มีธงเล็กบนยอด */
function buildMarketSign(){
  const g = new THREE.Group();
  [-1,1].forEach(sd=>{
    const p = cyl(.07,.07,1.1, 0xb4763a,10); p.position.set(sd*.34,.55,0); g.add(p);
    const c = sphere(.1, 0xffc857,10); c.position.set(sd*.34,1.14,0); g.add(c);
  });
  const board = box(1.0,.72,.1, 0xfdfbf5,.06); board.position.set(0,.94,.02); g.add(board);
  const frame = box(1.1,.82,.06, 0xe4574a,.05); frame.position.set(0,.94,-.02); g.add(frame);
  const sg = signPlane('🍢', .52); sg.position.set(0,.94,.09); g.add(sg);
  const bar = box(.9,.09,.06, 0x6fbf73,.03); bar.position.set(0,.52,.02); g.add(bar);
  for(let i=0;i<5;i++){                                /* ธงราวเล็กบนหัวป้าย */
    const fl = cone(.07,.14,[0xff8fb3,0xffd54f,0x7fc4e8,0x8fd694,0xb388ff][i],4);
    fl.rotation.x = Math.PI; fl.position.set(-.34+i*.17, 1.36, .02); g.add(fl);
  }
  return g;
}
/* เสาธงราวของตลาด: เสาสูง 2 ต้นขึงเชือกธงสามเหลี่ยมข้ามลาน (ห่างกัน span ช่อง)
   ต้นซ้าย (withRope) เป็นคนถือเชือก+ธงทั้งเส้น ต้นขวาเป็นแค่เสาเปล่ารับปลายเชือก
   ธงอยู่สูง ~2 หน่วย = เหนือกันสาดรถเข็น (1.6) จึงไม่ทับของบนรถ */
function buildMarketBunting(withRope, span){
  const g = new THREE.Group();
  const post = cyl(.055,.055,2.3, 0xf7f3ee,8); post.position.y = 1.15; g.add(post);
  const cap = sphere(.09, 0xffc857, 8); cap.position.y = 2.38; g.add(cap);
  if(!withRope) return g;
  /* ธงถี่ (ครึ่งช่องต่อผืน) และผืนใหญ่พอ — เคยทำผืนเล็ก/ห่างช่องละผืน มองมุมไอโซแล้วเห็นแต่เชือกขึงพาดยาว
     เหมือนสายไฟลอยอยู่กลางจอ ไม่รู้ว่าคืออะไร */
  const n = span * 2 - 1;
  const rope = box(span,.05,.05, 0xc98d4e,.02); rope.position.set(span/2, 2.26, 0); g.add(rope);
  const cols = [0xff8fb3,0xffd54f,0x7fc4e8,0x8fd694,0xb388ff,0xef8354];
  for(let i=0;i<n;i++){
    const fl = cone(.17,.38, cols[i%cols.length], 4);
    fl.rotation.x = Math.PI; fl.rotation.y = Math.PI/4;        /* หันหน้าธงออกด้านข้าง (ทิศที่กล้องมอง) */
    fl.position.set((i+1)*span/(n+1), 2.03, 0); g.add(fl);   /* สูงพ้นหัวคน+กันสาดรถเข็น ไม่พาดหน้าตัวละคร */
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
  /* ห่อทั้งผืนไว้ในกลุ่มที่จุดหมุนอยู่ "ที่เสา" ธงจึงสะบัดรอบเสาได้ทั้งผืนพร้อมกัน
     (ถ้าติดธง fx ทีละแถบ แต่ละแถบจะหมุนรอบตัวเองจนธงฉีกออกจากกัน) */
  const cloth = new THREE.Group();
  let fy = 3.35;
  STRIPES.forEach(([c,h])=>{
    const st = box(.86, h, .04, c, .01);
    st.position.set(.58, fy - h/2, 0);   /* เว้นจากเสา (รัศมี .075) ให้พ้น ไม่ทะลุตอนสะบัด */
    cloth.add(st); fy -= h;
  });
  fxTag(cloth, 'flag'); g.add(cloth);
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
  [[.0,2.9,.16],[.12,3.18,.13],[-.08,3.42,.1]].forEach(([ox,y,r],i)=>{   /* ควันลอยจากปล่องไฟ */
    const sm = sphere(r, 0xf4f1ea, 8);
    sm.material = sm.material.clone(); sm.material.transparent = true; sm.material.opacity = .78;
    sm.position.set(bw*.28+ox, y, -bd*.18);
    fxTag(sm, 'smoke', {ph: i/3}); g.add(sm);
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
/* ---------- ลานตั้งแคมป์กลางป่า (เต็นท์ / กองไฟ / ของในแคมป์) ----------
   เต็นท์แคมป์ปิ้ง "ขนาด 2 คนนอน": ผ้าใบหักมุม 2 ท่อนต่อด้าน (ทรงระฆังนิดๆ ไม่ใช่สามเหลี่ยมแบนแผ่นเดียว)
   + สันบน + หน้าจั่วมีช่องประตูโค้ง + ผ้าประตูม้วนรัด 2 ข้าง + เชือกยึด 4 เส้นลงสมอบก
   ⚠ กติกาที่ผู้ใช้แจ้งไว้ (2026-08-04) ห้ามย้อนโดยไม่ถามก่อน:
     1. **ห้ามทำใหญ่ขึ้น** — ต้องเป็นเต็นท์ 2 คนนอนที่เตี้ยกว่าหัวชาวเมือง (ชาวเมืองสูง ~1.5)
        เคยทำ W1.62×L1.72×H1.02 แล้วมองมุมไอโซเหมือน "ผ้าใบขึงแผ่นใหญ่/แผงลอย" ไม่ใช่เต็นท์
     2. **ประตูต้องอยู่ที่หน้าจั่วด้าน +z ไม่ใช่บนผืนหลังคา** (สันทอดตามแกน z) หน้าเต็นท์จะได้หันเข้าหา
        กองไฟ (z มากกว่า) และหันเข้ากล้องไอโซพอดี
     3. **ห้ามใส่กันสาดแผ่นใหญ่/เสาสีครีมหน้าเต็นท์** — เคยทำแล้วกลายเป็นแผงลอยขายของ */
const TENT_COLORS = [
  {wall:0xe4574a, trim:0xfbf7f0},   /* แดงส้ม */
  {wall:0x5aa9e6, trim:0xfff3c4},   /* ฟ้า */
  {wall:0x8fd694, trim:0xfbf7f0},   /* เขียวมิ้นต์ */
];
function buildTent(idx){
  const g = new THREE.Group();
  const c = TENT_COLORS[idx % TENT_COLORS.length];
  const W = 1.14, L = 1.5, H = .86;                /* กว้างฐาน(x) × ยาวตามสัน(z) × สูง — เต็นท์ 2 คนนอน */
  const W1 = W*.68, HK = H*.44;                    /* จุดหักผ้าใบ (ช่วงบนชัน ช่วงล่างผายออก = ผ้าใบตึงจริง) */
  const dark = 0x3d3129, fz = L/2, bz = -L/2;
  /* ครึ่งความกว้างของหน้าจั่วที่ความสูง y — ใช้ทั้งวาดกรอบจั่ว/ผนังจั่ว/ประตู ให้ทุกชิ้นอยู่ในเงาผ้าใบพอดี
     (ถ้าคิดความกว้างมั่วๆ มุมบนของแถบจะโผล่พ้นแนวผ้าใบ กลายเป็นขอบหยักบันไดตามสัน) */
  const halfW = y => y >= HK ? (W1/2)*(H-y)/(H-HK) : W1/2 + (W/2 - W1/2)*(HK-y)/HK;
  /* แผ่นผ้าใบ 1 ท่อน: ลากจาก (x0,y0) ไป (x1,y1) บนหน้าตัด แล้วยืดตามแนว z ยาว dep */
  const panel = (x0,y0,x1,y1, dep, th, col) => {
    const dx = x1-x0, dy = y1-y0;
    const m = box(Math.hypot(dx,dy) + .05, th, dep, col, .035);
    m.rotation.z = Math.atan2(dy, dx);
    m.position.set((x0+x1)/2, (y0+y1)/2, 0);
    return m;
  };
  [-1,1].forEach(s=>{                              /* ผ้าใบ 2 ด้าน ด้านละ 2 ท่อน (บนชัน + ล่างผาย) */
    [[0,H, s*W1/2,HK], [s*W1/2,HK, s*W/2,0]].forEach(([x0,y0,x1,y1])=>{
      const pn = panel(x0,y0,x1,y1, L, .1, c.wall);
      pn.castShadow = hShadows; g.add(pn);
    });
    const hem = box(.11,.07,L+.05, c.trim, .03);   /* ขลิบชายผ้าใบติดพื้น */
    hem.position.set(s*(W/2 - .02), .04, 0); g.add(hem);
  });
  const ridge = cyl(.04,.04,L+.2, 0xc98d4e, 8);    /* เสาสันเต็นท์ (โผล่พ้นหัวท้ายไว้ผูกเชือก) */
  ridge.rotation.x = Math.PI/2; ridge.position.y = H - .02; g.add(ridge);
  /* ผนังหน้าจั่ว: ก่อเป็นแถบซ้อนชั้นไล่แคบลงตาม halfW (ทรงสามเหลี่ยมแบบก้อนๆ เข้าธีมของเล่นไม้ในเกม) */
  const gableBars = (zz, col, y0, y1, n, wScale, dep) => {
    for(let i=0;i<n;i++){
      const a = y0 + (y1-y0)*i/n, b = y0 + (y1-y0)*(i+1)/n;
      const wd = 2*halfW(b)*wScale - .04;
      if(wd < .06) continue;
      const bar = box(wd, (b-a) + .02, dep, col, .03);
      bar.position.set(0, (a+b)/2, zz); g.add(bar);
    }
  };
  gableBars(bz + .03, petShade(c.wall,.9), 0, H, 6, 1, .08);      /* ท้ายเต็นท์: ปิดทึบทั้งบาน */
  const vent = cyl(.11,.11,.05, 0x4a5560, 10);                    /* ช่องระบายอากาศกลม */
  vent.rotation.x = Math.PI/2; vent.position.set(0,.42,bz-.02); g.add(vent);
  const vrim = torus(.13,.025, c.trim, 12); vrim.position.set(0,.42,bz-.03); g.add(vrim);
  gableBars(fz - .03, petShade(c.wall,.88), 0, H, 6, 1, .08);     /* หน้าเต็นท์: ผ้าใบเต็มบาน... */
  gableBars(fz + .02, dark, 0, H*.62, 5, .6, .06);                /* ...แล้วแปะช่องประตูมืดทับ = ประตูเปิด */
  [-1,1].forEach(s=>{                                             /* ขอบจั่วหน้าเป็นตัว Λ ตีกรอบให้อ่านออกว่าเป็นเต็นท์ */
    [[0,H, s*W1/2,HK], [s*W1/2,HK, s*W/2,0]].forEach(([x0,y0,x1,y1])=>{
      const eg = panel(x0,y0,x1,y1, .1, .1, petShade(c.wall,.78));
      eg.position.z = fz - .02; g.add(eg);
    });
  });
  const zip = box(.04, H*.55, .05, c.trim, .02);                  /* ซิปกลางประตู */
  zip.position.set(0, H*.3, fz + .06); g.add(zip);
  [-1,1].forEach(s=>{                                             /* ผ้าประตูม้วนรัดเก็บไว้ 2 ข้าง (บางๆ ไม่ใช่เสา) */
    const roll = cyl(.05,.05,H*.42, petShade(c.wall,.86), 7);
    roll.position.set(s*(W*.21), H*.27, fz + .07); g.add(roll);
    const tie = cyl(.058,.058,.045, c.trim, 7);
    tie.position.set(s*(W*.21), H*.44, fz + .08); g.add(tie);
  });
  const mat3 = box(W*.52, .045, .26, 0xd9a86c, .02);              /* พรมเช็ดเท้าหน้าประตู */
  mat3.position.set(0,.025, fz + .2); g.add(mat3);
  /* เชือกยึดเต็นท์ 4 เส้น จากปลายสันลงสมอบก — รายละเอียดนี้แหละที่ทำให้เด็กอ่านออกทันทีว่า "เต็นท์" */
  const UP = new THREE.Vector3(0,1,0);
  [-1,1].forEach(s=>[[fz + .1, 1],[bz - .1, -1]].forEach(([rz, d])=>{
    const px = s*(W/2 + .24), pz = rz + d*.28;
    const dir = new THREE.Vector3(px - 0, -H + .06, pz - rz);
    const rope = cyl(.012,.012, dir.length(), 0xe0cfae, 5);
    rope.position.set(px/2, (H + .06)/2, (rz + pz)/2);
    rope.quaternion.setFromUnitVectors(UP, dir.clone().normalize());
    g.add(rope);
    const peg = cyl(.03,.03,.18, 0x8d6e63, 5); peg.rotation.z = s*.32;
    peg.position.set(px, .06, pz); g.add(peg);
  }));
  return g;
}
/* กองไฟกลางแคมป์: ก้อนหินล้อม + ฟืนไขว้ + เปลวไฟ 3 ชั้น (ติดธง fx 'fire' = วูบวาบ)
   + ขาตั้ง 3 ขาแขวนหม้อซุป + ควันลอย (fx 'smoke' ชุดเดียวกับปล่องไฟบ้าน) */
function buildCampFire(){
  const g = new THREE.Group();
  for(let i=0;i<7;i++){                              /* วงหินล้อมกองไฟ */
    const a = i/7*Math.PI*2;
    const st = sphere(.15, i%2 ? 0x9fabb3 : 0xb9c2c8, 7); st.scale.y = .7;
    st.position.set(Math.cos(a)*.52, .06, Math.sin(a)*.52); g.add(st);
  }
  [0,1,2].forEach(i=>{                               /* ฟืนไขว้กัน */
    const lg = cyl(.075,.09,.9, i%2 ? 0xa9784f : 0x8d6e63, 7);
    lg.rotation.z = Math.PI/2 - .35; lg.rotation.y = i*1.05;
    lg.position.set(0,.16,0); g.add(lg);
  });
  const em = sphere(.22, 0xef8354, 10); em.scale.y = .45; em.position.y = .13; g.add(em);
  [[0,.34,.3,0xffd54f],[.06,.52,.24,0xef8354],[-.05,.68,.17,0xffe08a]].forEach(([ox,y,r,c],i)=>{
    const fl = cone(r, r*2.1, c, 8); fl.position.set(ox, y, 0);
    fxTag(fl, 'fire', {ph:i*2.1}); g.add(fl);        /* เปลวไฟวูบวาบ (ดู updateSceneryFx kind 'fire') */
  });
  [0,1,2].forEach(i=>{                               /* ควันลอยขึ้นจากกองไฟ — เริ่มเหนือฝาหม้อ ไม่งั้นควันจะโผล่ออกมาจากในหม้อ */
    const sm = sphere(.13, 0xe8e4dc, 8);
    sm.position.set(.02, 1.45 + i*.3, 0);
    fxTag(sm, 'smoke', {ph:i*2.1}); g.add(sm);
  });
  [0,1,2].forEach(i=>{                               /* ขาตั้งหม้อ 3 ขา */
    const a = i/3*Math.PI*2 + .5;
    const lg = cyl(.045,.055,1.5, 0x8d6e63, 6);
    lg.position.set(Math.cos(a)*.34, .72, Math.sin(a)*.34);
    lg.rotation.z = -Math.cos(a)*.44; lg.rotation.x = Math.sin(a)*.44; g.add(lg);
  });
  const hook = cyl(.02,.02,.3, 0x6f8290, 5); hook.position.y = 1.24; g.add(hook);
  const pot = cyl(.28,.24,.32, 0x4a5560, 12); pot.position.y = .95; g.add(pot);
  const lid = cyl(.3,.3,.06, 0x6f8290, 12); lid.position.y = 1.13; g.add(lid);
  const knob = sphere(.055, 0xffd54f, 7); knob.position.y = 1.19; g.add(knob);
  const hd = torus(.26,.025, 0x6f8290, 12); hd.rotation.y = Math.PI/2; hd.position.y = 1.06; g.add(hd);
  return g;
}
function buildCampProp(kind){
  const g = new THREE.Group();
  if(kind === 'log'){                                /* ท่อนไม้นั่งข้างกองไฟ */
    const lg = cyl(.24,.24,1.0, 0xa9784f, 10); lg.rotation.z = Math.PI/2; lg.position.y = .24; g.add(lg);
    [-1,1].forEach(s=>{ const ring = cyl(.245,.245,.05, 0xd9a86c, 10);
      ring.rotation.z = Math.PI/2; ring.position.set(s*.5,.24,0); g.add(ring); });
    [-1,1].forEach(s=>{ const bs = box(.16,.14,.3, 0x8d6e63,.04); bs.position.set(s*.3,.07,0); g.add(bs); });
  }else if(kind === 'wood'){                         /* กองฟืนซ้อน */
    [[0,.13,-.16],[0,.13,.16],[0,.39,0]].forEach(([x,y,z])=>{
      const lg = cyl(.14,.14,.9, 0xa9784f, 8); lg.rotation.z = Math.PI/2; lg.position.set(x,y,z); g.add(lg);
      const rg = cyl(.145,.145,.05, 0xd9a86c, 8); rg.rotation.z = Math.PI/2; rg.position.set(.45,y,z); g.add(rg);
    });
    const axe = cyl(.035,.035,.62, 0xc98d4e, 6); axe.rotation.z = .5; axe.position.set(-.4,.44,.3); g.add(axe);
    const bl = box(.22,.2,.06, 0xc3ccd2,.03); bl.rotation.z = .5; bl.position.set(-.53,.68,.3); g.add(bl);
  }else if(kind === 'gear'){                         /* เป้เดินป่า + ลังเสบียง + ม้วนที่นอน */
    const bag = box(.46,.6,.36, 0x6fbf73,.1); bag.position.set(-.16,.32,0); g.add(bag);
    const lidb = box(.44,.16,.34, 0x4fa85c,.06); lidb.position.set(-.16,.66,0); g.add(lidb);
    [-1,1].forEach(s=>{ const st = box(.09,.4,.06, 0x4a3b32,.02); st.position.set(-.16+s*.14,.42,-.2); g.add(st); });
    const crate = box(.5,.34,.44, 0xc98d4e,.05); crate.position.set(.4,.17,.12); g.add(crate);
    const clid = box(.52,.06,.46, 0xd9a86c,.03); clid.position.set(.4,.37,.12); g.add(clid);
    const roll = cyl(.16,.16,.62, 0xef8fa5, 10); roll.rotation.z = Math.PI/2; roll.position.set(.36,.52,.12); g.add(roll);
    const cap2 = cyl(.165,.165,.05, 0xfbf7f0, 10); cap2.rotation.z = Math.PI/2; cap2.position.set(.64,.52,.12); g.add(cap2);
  }else{                                             /* lantern: เสาไม้แขวนตะเกียง */
    const post = cyl(.06,.08,1.5, 0x8d6e63, 7); post.position.y = .75; g.add(post);
    const arm = box(.46,.07,.07, 0x8d6e63,.03); arm.position.set(.2,1.46,0); g.add(arm);
    const rope = cyl(.015,.015,.18, 0xf0e4d4, 5); rope.position.set(.38,1.36,0); g.add(rope);
    const cap3 = cone(.16,.14, 0x4a5560, 8); cap3.position.set(.38,1.24,0); g.add(cap3);
    const glass = sphere(.13, 0xfff3c4, 10); glass.position.set(.38,1.08,0); g.add(glass);
    const base2 = cyl(.11,.11,.05, 0x4a5560, 8); base2.position.set(.38,.96,0); g.add(base2);
    const bs = cyl(.2,.24,.1, 0x8d6e63, 8); bs.position.y = .05; g.add(bs);
  }
  return g;
}
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
      fish.position.set(px,by-.3,0); fish.scale.set(.62,1.25,.5); fxTag(fish,'fish',{ph:i*1.1}); g.add(fish);
      const tail = box(.14,.16,.05, i%2 ? 0xe8c9a0 : 0xf2b93f,.03); tail.position.set(px,by-.5,0);
      fxTag(tail,'fish',{ph:i*1.1+.25}); g.add(tail);
    });
  });
  return g;
}
/* NPC นั่งตกปลาที่ปลายท่า (นั่งห้อยขา + คันเบ็ด + สายเอ็น + ทุ่นลอยน้ำ) */
function buildFisherNpc(){
  /* ใช้โมเดลเดียวกับชาวบ้านคนอื่นทั้งตัว (เดิมปั้นเองเลยสัดส่วน/หน้าตาไม่เหมือนใคร)
     ยืนอยู่บนไม้กระดานท่า ถือคันเบ็ดยื่นออกไปทางบ่อ */
  const g = new THREE.Group();
  const v = buildVillager({skin:2, shirt:0xffd54f, pants:0x4a6fa5, hair:1, hairC:1, hat:'straw'}, true);
  const rig = v.userData.hRig;
  if(rig){
    rig.legs.forEach(p=>{ p.rotation.x = -1.5; });   /* นั่งห้อยขาออกไปทางบ่อ */
    rig.arms[0].rotation.x = -1.15; rig.arms[0].rotation.z = .18;   /* ยกแขนจับคันเบ็ด */
    rig.arms[1].rotation.x = -.75;  rig.arms[1].rotation.z = -.12;
  }
  v.position.y = -.32;                        /* ลดตัวลงให้สะโพกอยู่ระดับพื้นท่า (ท่าอยู่ .21, สะโพกสูง .53) */
  v.userData.hRig = null;                    /* ไม่ใช่ NPC เดินได้ ไม่ต้องเก็บ rig ไว้ */
  g.add(v);
  /* คันเบ็ดชี้ไปข้างหน้า (+z = ทิศที่ตัวละครหันหน้า) ปลายคันยื่นออกเหนือน้ำ */
  const rod = cyl(.028,.038,2.2,0xc98d4e,6);
  rod.rotation.x = 1.0; rod.position.set(.16,.72,.78); g.add(rod);
  const reel = cyl(.085,.085,.07,0x8fa3ad,10); reel.rotation.z = Math.PI/2; reel.position.set(.16,.4,.2); g.add(reel);
  const line = cyl(.008,.008,1.0,0xfdfbf5,4); line.position.set(.16,.16,1.62); g.add(line);
  const bob = sphere(.075,0xef5f5f,8); bob.position.set(.16,-.32,1.62); g.add(bob);
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
    fl.position.set(.2, 1.9-k*.34, 0); fxTag(fl,'banner',{ph:(i+k)*1.3}); g.add(fl);
  }
  return g;
}

/* ---------- ชาวบ้าน (NPC) ----------
   ทรงการ์ตูนแบนโทนเดียวกับตัวละครเด็ก **หันหน้าไปทาง +z เมื่อ rotation.y = 0**
   (ให้ตรงกับ Math.atan2(dx,dz) ตอนหันหน้ามาหาเด็ก) ประกอบทุกชิ้นไว้ในกลุ่มลูก `b`
   เพื่อย่อขนาดเด็ก/ผู้ใหญ่ได้โดยที่กลุ่มนอกยัง identity (mergeDecorGroup อ่าน matrixWorld) */
const NPC_SKIN = [0xf6e3cc, 0xf0d0a8, 0xe3b189, 0xc98d5e];
/* index 5 = ผมสีส้มสด เพิ่มไว้ให้โบโซ่ (npc-clown) โดยเฉพาะ — ต่อท้ายเท่านั้น ห้ามแทรกกลาง
   เพราะ NPC ทุกคนอ้าง `hairC` เป็นเลข index ของอาเรย์นี้ตรงๆ (แทรกกลางแล้วผมทั้งเมืองเปลี่ยนสียกเมือง) */
const NPC_HAIR = [0x4a3b32, 0x2f2a26, 0x6d4c41, 0x8d6e63, 0xd9d3cc, 0xef8354];
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
  /* ---- เครื่องแบบเพิ่มเติม (ใส่บนตัวเสื้อ) ----
     sash   = สายสะพายพาดอกเฉียง + เหรียญตรา → ท่านนายกเทศมนตรี (เด็กเห็นแล้วรู้ว่าเป็นคนใหญ่คนโตของเมือง)
     cross  = กากบาทแดงบนอกเสื้อ → หมอ/พยาบาล
     stetho = หูฟังคล้องคอ → หมอ */
  if(lk.sash){
    const sh = box(.14,.68,.05, lk.sashC ?? 0xffd54f, .02);
    sh.rotation.z = .62; sh.position.set(0,.68,.18); core.add(sh);
    const md = cyl(.075,.075,.03, 0xf0c14b, 10); md.rotation.x = Math.PI/2; md.position.set(-.15,.5,.2); core.add(md);
    const rb = box(.09,.07,.03, 0xe4574a,.01); rb.position.set(-.15,.58,.2); core.add(rb);
  }
  if(lk.cross){
    const c1 = box(.13,.045,.03, 0xe4574a,.01); c1.position.set(.14,.8,.18); core.add(c1);
    const c2 = box(.045,.13,.03, 0xe4574a,.01); c2.position.set(.14,.8,.18); core.add(c2);
  }
  if(lk.stetho){
    /* ตัวละครไม่มีคอ (หัววางบนลำตัวเลย) → ห่วงคล้องคอจะจมหายใต้คาง จึงวาดเป็น "สายรูปตัว V พาดอก"
       + หูฟัง 2 ข้างบนไหล่ + จานฟังบนอกแทน มองมุมไอโซแล้วเห็นครบทั้งเส้น */
    [-1,1].forEach(s=>{
      const ep = sphere(.035, 0x4a5560, 8); ep.position.set(.19*s,.9,.1); core.add(ep);
      const tb = box(.035,.34,.035, 0x4a5560,.015); tb.rotation.z = s*.34;
      tb.position.set(.13*s,.74,.18); core.add(tb);
    });
    const dc = cyl(.06,.06,.035, 0xc9d3d9, 12); dc.rotation.x = Math.PI/2; dc.position.set(0,.57,.19); core.add(dc);
    const dc2 = cyl(.035,.035,.045, 0x4a5560, 10); dc2.rotation.x = Math.PI/2; dc2.position.set(0,.57,.185); core.add(dc2);
  }
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
  } else if(lk.hat === 'top'){
    /* หมวกทรงสูงของท่านนายกฯ — ปีกกว้าง + ทรงกระบอกสูง + ริบบิ้นคาด (คู่กับสายสะพาย sash) */
    const br = cyl(.42,.42,.06, lk.hatC ?? 0x3a3540, 14); br.position.y = .5; head.add(br);
    const cr = cyl(.29,.29,.44, lk.hatC ?? 0x3a3540, 14); cr.position.y = .75; head.add(cr);
    const bn = cyl(.3,.3,.1, lk.hatC2 ?? 0xe4574a, 14);   bn.position.y = .58; head.add(bn);
  } else if(lk.hat === 'nurse'){
    /* หมวกพยาบาลใบเล็กสีขาว มีกากบาทแดงหน้าหมวก */
    const cp = box(.5,.2,.42, 0xfbf7f0, .06); cp.position.set(0,.55,-.04); head.add(cp);
    const c1 = box(.11,.035,.03, 0xe4574a,.01); c1.position.set(0,.56,.18); head.add(c1);
    const c2 = box(.035,.11,.03, 0xe4574a,.01); c2.position.set(0,.56,.18); head.add(c2);
  } else if(lk.hat === 'clown'){
    /* ชุดโบโซ่: หมวกกรวยลายทาง + ปอมปอมบนยอด + ผมฟูกลมสองข้าง + จมูกกลมแดง
       (จมูกรวมไว้ในบล็อกนี้เลย เพราะเป็นชิ้นเดียวกับ "หน้าโบโซ่" — ตั้ง nose:0 ใน NPC_DEFS กันจมูกซ้อน) */
    const hc = lk.hatC ?? 0xb388ff;
    const cn = cone(.26,.5, hc, 10); cn.position.y = .78; head.add(cn);
    [.6,.74,.88].forEach((y,i)=>{                        /* แถบลายรอบหมวก (ไล่เล็กลงตามทรงกรวย) */
      const st = cyl(.235 - i*.06, .21 - i*.06, .06, i%2 ? 0xfbf7f0 : 0xffd54f, 10);
      st.position.y = y; head.add(st);
    });
    const pom = sphere(.11, 0xff8fb3, 8); pom.position.y = 1.06; head.add(pom);
    [-1,1].forEach(s=>{ const pf = sphere(.19, hairC, 8); pf.scale.set(1,.9,.95);
      pf.position.set(.34*s, .3, -.02); head.add(pf); });
    const rn = sphere(.075, 0xef5f5f, 8); rn.position.set(0,-.01,.36); head.add(rn);
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
  } else if(P === 'marsh'){                                /* ไม้ปิ้งมาร์ชแมลโลว์ (เด็กในแคมป์) */
    const st = cyl(.022,.022,.62, 0xd9a86c, 5); st.rotation.z = -.5; st.position.set(.42,.78,.12); hold.add(st);
    [[.62,1.0],[.7,1.12]].forEach(([x,y],i)=>{
      const mm = cyl(.06,.06,.11, i ? 0xfbf7f0 : 0xe8c9a0, 8); mm.rotation.z = -.5;
      mm.position.set(x,y,.12); hold.add(mm);
    });
  } else if(P === 'ring'){                                 /* ห่วงชูชีพ/ห่วงยาง แดง-ขาว (พนักงานสระ/คนเล่นน้ำ) */
    const rg = torus(.17,.055,0xe4574a,14); rg.position.set(.4,.62,.14); hold.add(rg);
    [0,1,2,3].forEach(i=>{
      const a = i*Math.PI/2 + Math.PI/4;
      const wp = box(.09,.09,.13,0xfbf7f0,.02);
      wp.position.set(.4+Math.cos(a)*.17,.62+Math.sin(a)*.17,.14); hold.add(wp);
    });
  } else if(P === 'suitcase'){                             /* กระเป๋าเดินทางของพนักงานโรงแรม */
    const sc = box(.3,.24,.13,0xa9784f,.04); sc.position.set(.36,.44,.12); hold.add(sc);
    const bd2 = box(.32,.05,.15,0xd9a86c,.02); bd2.position.set(.36,.44,.12); hold.add(bd2);
    const hd2 = torus(.06,.018,0x6d4c41,10); hd2.position.set(.36,.58,.12); hold.add(hd2);
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
const pathSet = new Set();         /* ช่องทางเดินในทุ่ง — แตะแล้วเดินเฉยๆ ไม่มีเอฟเฟกต์ */
/* ---------- ผังทุ่งดอกไม้ (คิดที่เดียว ใช้ 2 ที่: ตอนสร้างกริดทางเดิน + ตอนวางของจริง) ----------
   คืนรายการช่องพร้อมชนิด เพื่อให้ "ช่องที่มีดอกไม้" กับ "ช่องที่เดินเหยียบไม่ได้" ตรงกันเป๊ะเสมอ
     'field' = ทุ่ง/สวนดอกไม้ → **บล็อกทางเดิน** (เด็กเดินเหยียบทุ่งดอกไม้ไม่ได้ ต้องเดินอ้อม/ใช้ทางเดินกลางทุ่ง)
     'path'  = ทางเดินดินกลางทุ่ง / ทางเดินในทุ่งหญ้า → เดินได้ตามปกติ
     'sprig' = ดอกไม้กระจุกเล็กริมถนน-ริมอาคารทั่วเมือง → เดินได้ (ถ้าบล็อกจะไปปิดทางเดินริมถนนทั้งเมือง)
   ลำดับการไล่กรอบสำคัญ: กรอบทับกันได้ (ทุ่งใหญ่ทับทุ่งหญ้าใต้แผนที่) ช่องไหนถูกจองแล้วจะข้ามไปเอง */
let fieldPlanCache = null;
/* ช่องที่สั่ง "ห้ามมีดอกไม้" ถาวร (ผู้ใช้ชี้เองว่าดอกนี้เกะกะ) — ทุ่งดอกไม้บล็อกทางเดิน
   ช่องพวกนี้จึงเปิดโล่งให้เดินผ่านได้แทน (คู่ขนานกับ WILD_BAN ของต้นไม้ป่า)
   42,60 = ช่องหน้าประตูโรงแรมพอดี ปิดอยู่ทำให้เดินจากทางเดินกลางทุ่ง (z61) เข้าประตูตรงๆ ไม่ได้ */
const FIELD_BAN = new Set(['42,60']);
function fieldFlowerPlan(grid){
  const out = [], done = new Set();
  const open = (x, z) => {
    if(x<0 || z<0 || x>=OUT_W || z>=OUT_D) return false;
    if(FIELD_BAN.has(x + ',' + z)) return false;
    if(done.has(x + ',' + z)) return false;
    if(grid[z][x]!==0 || isVillageRoadTile(x,z) || isPlazaTile(x,z) || lotAt(x,z,1)) return false;
    if(inPoolDeck(x,z) || isSandTile(x,z) || inHomeZone(x,z)) return false;
    if(inBox(FOOD_DECK, x, z)) return false;                 /* ลานโต๊ะร้านอาหารต้องโล่ง */
    if(inPlayground(x, z)) return false;                     /* ในรั้วสนามเด็กเล่น (รวมช่องประตู) ต้องโล่ง */
    return !VILLAGE_LOTS.some(l=>{ const d = lotDoorTile(l); return d.x===x && d.z===z; });   /* เว้นช่องหน้าประตูบ้าน */
  };
  const put = (x, z, kind, opt) => { done.add(x + ',' + z); out.push({x, z, kind, opt}); };
  for(let z=FLOWER_FIELD.z0; z<=FLOWER_FIELD.z1; z++) for(let x=FLOWER_FIELD.x0; x<=FLOWER_FIELD.x1; x++){
    if(!open(x, z)) continue;
    put(x, z, z === FLOWER_FIELD_PATH ? 'path' : 'field');
  }
  /* ทุ่งดอกทานตะวันทุกผืน — ผืนไหนระบุ `path` ไว้ เว้นแถวนั้นเป็นทางเดินดินเข้ากลางทุ่ง */
  SUNFLOWER_FIELDS.forEach(sf=>{
    for(let z=sf.z0; z<=sf.z1; z++) for(let x=sf.x0; x<=sf.x1; x++){
      if(!open(x, z)) continue;
      put(x, z, z === sf.path ? 'path' : 'sun');
    }
  });
  for(let z=FLOWER_MEADOW.z0; z<=FLOWER_MEADOW.z1; z++) for(let x=FLOWER_MEADOW.x0; x<=FLOWER_MEADOW.x1; x++){
    if(!open(x, z)) continue;
    if(inMeadowTrail(x, z)){ put(x, z, 'path'); continue; }
    /* เว้นช่องเป็นหย่อมๆ ให้เห็นหญ้าโล่งแทรก ดูเป็นทุ่งธรรมชาติ ไม่ใช่พรมดอกไม้ทึบทั้งผืน
       (หย่อมที่เว้นไว้ยังเดินได้ กลายเป็นช่องเดินลัดในทุ่งไปในตัว) */
    if(((x*5 + z*11) % 5) === 0) continue;
    put(x, z, 'field', {base:3, band: (x + z*2) >> 1});
  }
  /* แถวดอกไม้ริมลานร้านอาหาร (x31) — แถวเดียวแคบๆ ข้างลานนั่งกินข้าว ปล่อยให้เดินผ่านได้ */
  for(let z=FOOD_FLOWER_COL.z0; z<=FOOD_FLOWER_COL.z1; z++) for(let x=FOOD_FLOWER_COL.x0; x<=FOOD_FLOWER_COL.x1; x++){
    if(!open(x, z)) continue;
    put(x, z, 'sprig', {base:4, band: (z*2) & 3});
  }
  /* ทุ่งดอกไม้ตีขอบแผนที่ทิศใต้ฝั่งตะวันตก (ต่อแนวกับทุ่งใหญ่ทางตะวันออก) */
  for(let z=FLOWER_WEST.z0; z<=FLOWER_WEST.z1; z++) for(let x=FLOWER_WEST.x0; x<=FLOWER_WEST.x1; x++){
    if(!open(x, z)) continue;
    if(((x*7 + z*3) % 6) === 0) continue;               /* เว้นหย่อมโล่งบ้าง ไม่ให้เป็นพรมทึบยาวทั้งขอบ */
    put(x, z, 'field', {base:3, band: (x*2 + z) & 3});
  }
  /* สวนดอกไม้รอบลานน้ำพุ: ทุกช่องที่เหลือในกรอบ (ข้ามลานหิน/ทางเดินซุ้ม/ของฉากอัตโนมัติอยู่แล้ว) */
  for(let z=PLAZA_YARD.z0; z<=PLAZA_YARD.z1; z++) for(let x=PLAZA_YARD.x0; x<=PLAZA_YARD.x1; x++){
    if(!open(x, z)) continue;
    put(x, z, 'field', {base:3, band: (x + z*3) & 3});
  }
  /* ดอกไม้ริมถนน/ริมลาน/ริมอาคารทั่วชุมชน — กระจุกเล็กๆ ช่องเว้นช่อง ไม่ให้รกจนบังทาง */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(!open(x, z)) continue;
    const edge = nearRoadOrPlaza(x, z, 1) || !!lotAt(x, z, 2);
    if(!edge) continue;
    if(((x*7 + z*13) % 5) !== 0) continue;             /* ~20% ของช่องริมทาง (ลดลงจาก 40% ให้ชุมชนโล่งขึ้น) */
    put(x, z, 'sprig', {base:1, band: x + z});
  }
  return out;
}

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
    mergeCollectFx(g, parts, chunkKeyOf(rec.x, rec.z));
  });
  VILLAGE_LOTS.forEach(lot=>{
    mergeCollectFx(buildLotBuilding(lot), parts, chunkKeyOf(lot.x0, lot.z0));
  });
  mergeCollectFx(buildFountain(), parts, chunkKeyOf(FOUNTAIN.x0, FOUNTAIN.z0));
  /* แปลงผักฟาร์ม: ร่องละ 2 ต้น เยื้องกันเล็กน้อยให้ดูเป็นแถวปลูกจริง */
  FARM_PLOTS.forEach(p=>{
    for(let z=p.z0; z<=p.z1; z++) for(let x=p.x0; x<=p.x1; x++){
      if(!isCropTile(x,z)) continue;
      [-.22,.22].forEach((off,k)=>{
        const cr = buildCrop(p.crop);
        cr.position.set(outWX(x)+off, 0, outWZ(z) + (k ? .18 : -.18));
        cr.rotation.y = ((x*7+z*13+k*5)%4) * Math.PI/2;
        mergeCollectFx(cr, parts, chunkKeyOf(x, z));
      });
    }
  });
  SCARECROW_TILES.forEach(([x,z])=>{
    const sc = buildScarecrow();
    sc.position.set(outWX(x), 0, outWZ(z));
    addFxProp(sc, 'scare');                       /* โยกตามลม จึงไม่รวมกับก้อนฉาก */
  });
  beachPropTiles().forEach(([x,z,kind])=>{
    if(kind==='chair'){                       /* เก้าอี้ผ้าใบ: หันหน้าออกทะเล (-z = rot 2) + นั่งได้ */
      const ch = buildDeckChair((x+z)%2===0);
      ch.position.set(outWX(x), 0, outWZ(z));
      ch.rotation.y = Math.PI;
      addSeatSpot(x, z, 2, 'deck');
      mergeCollectFx(ch, parts, chunkKeyOf(x, z));
      return;
    }
    if(kind==='canoe' || kind==='ring'){       /* ที่เก็บอุปกรณ์ริมหาด — หันขวางจอ (45°) ให้เห็นด้านยาวเต็มๆ */
      const rk = kind==='canoe' ? buildCanoeRack() : buildRingRack();
      rk.position.set(outWX(x), 0, outWZ(z));
      rk.rotation.y = Math.PI/4;
      mergeCollectFx(rk, parts, chunkKeyOf(x, z));
      return;
    }
    const pr = kind==='palm' ? buildPalm() : buildBeachUmbrella();
    pr.position.set(outWX(x), 0, outWZ(z));
    pr.rotation.y = ((x*5+z*11)%4) * Math.PI/2;
    mergeCollectFx(pr, parts, chunkKeyOf(x, z));
  });
  /* เรือในทะเล (ลอยบนผิวน้ำ จมลงไปเล็กน้อยให้เห็นแนวน้ำที่กราบเรือ) + เรือจอดเกยหาด */
  BOAT_SPOTS.forEach(([x,off,kind])=>{
    const z = seaEdgeZ(x) - off;
    if(z < 0 || !isSeaTile(x, z)) return;
    const bt = buildBoat(kind);
    bt.position.set(outWX(x), -.18, outWZ(z));
    bt.rotation.y = ((x*7 + z*5) % 4) * Math.PI/2 + .35;
    addFxProp(bt, 'boat');                        /* โคลงตามคลื่น */
  });
  /* (เรือเกยหาดเอาออกแล้ว — ดูหมายเหตุที่ BEACH_RACKS ใน js/house-map.js) */
  FISH_RACKS.forEach(([x,z,rot])=>{                        /* ราวตากปลาหน้าบ้านชาวประมง */
    const rk = buildFishRack((x+z)%2===0);
    rk.position.set(outWX(x), 0, outWZ(z));
    rk.rotation.y = (rot||0) * Math.PI/2;
    mergeCollectFx(rk, parts, chunkKeyOf(x, z));
  });
  POND_PADS.forEach(([x,z],i)=>{
    const lp = buildLilyPad(i%3===0);
    lp.position.set(outWX(x)+.2, 0, outWZ(z)-.15);
    mergeCollectFx(lp, parts, chunkKeyOf(x, z));
  });
  /* เฟส 7: คอกสัตว์ (รั้ว+สัตว์+ของในฟาร์ม) ทิศตะวันออกสุด
     คอกที่ style==='pet' (คอกข้างร้านสัตว์เลี้ยง) ใช้รั้วเมืองคนละแบบกับรั้วไม้ฟาร์ม */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(!isPenFenceTile(x, z)) continue;
    const pen = penAt(x, z);
    const fp = (pen && pen.style==='pet')
      ? buildPetPenFencePiece(isPenFenceTile(x+1, z), isPenFenceTile(x, z+1))
      : buildPenFencePiece(isPenFenceTile(x+1, z), isPenFenceTile(x, z+1));
    fp.position.set(outWX(x), 0, outWZ(z));
    mergeCollectFx(fp, parts, chunkKeyOf(x, z));
  }
  /* คอกข้างร้านสัตว์เลี้ยง: พื้นกระเบื้อง + ซุ้มประตู + ของในคอก (สัตว์เลี้ยงสร้างใน spawnPenAnimals) */
  ANIMAL_PENS.filter(p => p.style==='pet').forEach(pen=>{
    const iw = pen.x1 - pen.x0 - 1, id = pen.z1 - pen.z0 - 1;      /* พื้นเฉพาะช่องด้านในรั้ว */
    const flr = buildPetPenFloor(iw, id);
    flr.position.set(outWX((pen.x0+pen.x1)/2), 0, outWZ((pen.z0+pen.z1)/2));
    mergeCollectFx(flr, parts, chunkKeyOf(pen.x0, pen.z0));
    if(pen.gate.length >= 2){                                      /* ซุ้มประตูคร่อมช่องประตูทั้งสอง */
      const gx = (pen.gate[0][0] + pen.gate[1][0])/2;
      const arch = buildPetPenGate();
      arch.position.set(outWX(gx), 0, outWZ(pen.gate[0][1]));
      mergeCollectFx(arch, parts, chunkKeyOf(pen.gate[0][0], pen.gate[0][1]));
    }
  });
  /* ---------- สนามเด็กเล่นกลางเมือง: พื้นยาง + ป้าย (merge ได้) / เครื่องเล่นสร้างใน spawnPlayground ---------- */
  {
    const pw = PLAYGROUND.x1 - PLAYGROUND.x0 + 1, pd = PLAYGROUND.z1 - PLAYGROUND.z0 + 1;
    const pf = buildPlayFloor(pw, pd);
    pf.position.set(outWX((PLAYGROUND.x0+PLAYGROUND.x1)/2), 0, outWZ((PLAYGROUND.z0+PLAYGROUND.z1)/2));
    mergeCollectFx(pf, parts, chunkKeyOf(PLAYGROUND.x0, PLAYGROUND.z0));
    const ps = buildPlaySign();                       /* ป้ายตั้งตรงหันหน้าเข้าสนาม ไม่เอียง */
    ps.position.set(outWX(PLAY_SIGN.x), 0, outWZ(PLAY_SIGN.z));
    mergeCollectFx(ps, parts, chunkKeyOf(PLAY_SIGN.x, PLAY_SIGN.z));
    for(let z=PLAYGROUND.z0; z<=PLAYGROUND.z1; z++) for(let x=PLAYGROUND.x0; x<=PLAYGROUND.x1; x++){
      if(!isPlayFenceTile(x, z)) continue;
      const fp = buildPlayFencePiece(isPlayFenceTile(x+1, z), isPlayFenceTile(x, z+1));
      fp.position.set(outWX(x), 0, outWZ(z));
      mergeCollectFx(fp, parts, chunkKeyOf(x, z));
    }
    const gate = buildPlayGate();                     /* เสาประตูคร่อมช่องทางเข้าทั้งสอง */
    gate.position.set(outWX((PLAY_GATE[0][0] + PLAY_GATE[1][0])/2), 0, outWZ(PLAY_GATE[0][1]));
    mergeCollectFx(gate, parts, chunkKeyOf(PLAY_GATE[0][0], PLAY_GATE[0][1]));
  }
  PET_PEN_PROPS.forEach(([x,z,kind])=>{
    const pp = buildPetPenProp(kind);
    pp.position.set(outWX(x), 0, outWZ(z));
    pp.rotation.y = ((x*5 + z*3) % 4) * Math.PI/2;
    mergeCollectFx(pp, parts, chunkKeyOf(x, z));
  });
  /* เขตโรงเรียน: รั้วรอบ box + ซุ้มประตู + เสาธงกลางลานหน้าโรงเรียน */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(!isSchoolFenceTile(x, z)) continue;
    const sf = buildSchoolFencePiece(isSchoolFenceTile(x+1, z), isSchoolFenceTile(x, z+1));
    sf.position.set(outWX(x), 0, outWZ(z));
    mergeCollectFx(sf, parts, chunkKeyOf(x, z));
  }
  const sgate = buildSchoolGate();                         /* คร่อมช่องประตูทั้งสอง (วางกึ่งกลางระหว่างช่อง) */
  sgate.position.set(outWX((SCHOOL_GATE[0][0] + SCHOOL_GATE[1][0])/2), 0, outWZ(SCHOOL_GATE[0][1]));
  mergeCollectFx(sgate, parts, chunkKeyOf(SCHOOL_GATE[0][0], SCHOOL_GATE[0][1]));
  const spole = buildFlagPole();
  spole.position.set(outWX(SCHOOL_FLAG.x), 0, outWZ(SCHOOL_FLAG.z));
  mergeCollectFx(spole, parts, chunkKeyOf(SCHOOL_FLAG.x, SCHOOL_FLAG.z));
  /* ลานช่างไม้: พื้นไม้หน้ากระท่อม + ของในลาน (กองซุง/ไม้แปรรูป/ม้าเลื่อย/ตอไม้) */
  const cy = buildWoodYard(CARPENTER_YARD.x1 - CARPENTER_YARD.x0 + 1, CARPENTER_YARD.z1 - CARPENTER_YARD.z0 + 1);
  cy.position.set(outWX((CARPENTER_YARD.x0 + CARPENTER_YARD.x1)/2), 0, outWZ((CARPENTER_YARD.z0 + CARPENTER_YARD.z1)/2));
  mergeCollectFx(cy, parts, chunkKeyOf(CARPENTER_YARD.x0, CARPENTER_YARD.z0));
  /* ---- ลานตั้งแคมป์กลางป่าทิศเหนือ: เต็นท์ 3 หลัง + กองไฟ + ของในแคมป์ ---- */
  CAMP_TENTS.forEach(([x,z,ci])=>{
    const tn = buildTent(ci);
    tn.position.set(outWX(x), 0, outWZ(z));
    tn.rotation.y = ((x*3 + z) % 3 - 1) * .08;     /* เอียงคนละนิด ดูเหมือนกางเอง ไม่เรียงเป๊ะ */
    mergeCollectFx(tn, parts, chunkKeyOf(x, z));
  });
  const cfire = buildCampFire();
  cfire.position.set(outWX(CAMP_FIRE.x), 0, outWZ(CAMP_FIRE.z));
  mergeCollectFx(cfire, parts, chunkKeyOf(CAMP_FIRE.x, CAMP_FIRE.z));
  CAMP_PROPS.forEach(([x,z,kind])=>{
    const cp = buildCampProp(kind);
    cp.position.set(outWX(x), 0, outWZ(z));
    /* ท่อนไม้นั่ง: หันด้านยาวขวางแนวที่หันเข้ากองไฟ · ของอื่นเอียงคนละนิด */
    cp.rotation.y = kind==='log' ? (Math.abs(x-CAMP_FIRE.x) > Math.abs(z-CAMP_FIRE.z) ? Math.PI/2 : 0) + .12
                                 : ((x*7 + z*5) % 4) * .3;
    mergeCollectFx(cp, parts, chunkKeyOf(x, z));
  });
  CARPENTER_PROPS.forEach(([x,z,kind])=>{
    const cp = buildCarpenterProp(kind);
    cp.position.set(outWX(x), 0, outWZ(z));
    cp.rotation.y = ((x*7 + z*5) % 4) * Math.PI/2 * .25 + .18;   /* หันเอียงคนละนิดให้ดูวางเอง ไม่เรียงเป๊ะ */
    mergeCollectFx(cp, parts, chunkKeyOf(x, z));
  });
  spawnPenAnimals();          /* สัตว์ในคอกเดินไปมาได้ → แยกกลุ่มของตัวเอง ไม่รวมเข้าฉากตายตัว */
  spawnPlayground();          /* เครื่องเล่นในสนามเด็กเล่น (ขยับ/หมุน/ให้เด็กนั่งเล่นได้) */
  spawnNpcs();                /* ชาวบ้าน + กระดานภารกิจ → แยกกลุ่ม (แตะคุยได้/บางคนเดินไปมา) */
  FARM_PROPS.forEach(([x,z,kind])=>{
    const pr = kind==='hay' ? buildHayBale() : kind==='trough' ? buildTrough()
             : kind==='coop' ? buildCoop() : buildWindmill();
    pr.position.set(outWX(x), 0, outWZ(z));
    pr.rotation.y = ((x*5+z*3)%4) * Math.PI/2;
    mergeCollectFx(pr, parts, chunkKeyOf(x, z));
  });
  /* ท่าไม้ + คนตกปลาริมบ่อ (ฝั่งบ้านเด็ก) + เป็ดลอยน้ำ — rot 2 = ยื่น/หันไปทางทิศเหนือ (-x) */
  const pier = buildPier(POND_PIER.len);
  pier.position.set(outWX(POND_PIER.x), 0, outWZ(POND_PIER.z));
  pier.rotation.y = (POND_PIER.rot||0) * Math.PI/2;
  mergeCollectFx(pier, parts, chunkKeyOf(POND_PIER.x, POND_PIER.z));
  /* ลุงตกปลาย้ายไปเป็น NPC เต็มตัวแล้ว (ดู npc-fisher ใน NPC_DEFS) จึงไม่สร้างเป็นฉากตายตัวที่นี่ */
  /* เป็ดประจำบ่อ 2 ตัว — ใช้โมเดลเดียวกับเป็ดที่ว่ายในแหล่งน้ำอื่น (buildCritter) และว่ายเปะปะ
     ไปเรื่อยๆ ในบ่อ (สุ่มจุดหมายทีละจุด ไม่ใช่วนเป็นวงกลม) อยู่ในบ่อตลอด ไม่มีวันหายไป */
  POND_DUCKS.forEach(([x,z])=>{
    const dk = buildCritter('duck');
    delete dk.userData.hCritter;              /* ไม่ใช่สัตว์ป่าในระบบ critter — กันแตะแล้วไปเรียก startleCritter */
    dk.position.set(outWX(x)+.15, WATER_Y + .06, outWZ(z)-.1);
    addFxProp(dk, 'ducky', {sp: .55 + Math.random()*.25});
  });
  /* ลานกิจกรรมก่อนถึงทะเล: เวที + เสาธงราว */
  mergeCollectFx(buildStagePlatform(), parts, chunkKeyOf(STAGE.x0, STAGE.z0));
  BANNER_POLES.forEach(([x,z],i)=>{
    const bp = buildBannerPole(i);
    bp.position.set(outWX(x), 0, outWZ(z));
    mergeCollectFx(bp, parts, chunkKeyOf(x, z));
  });
  /* แนวพุ่มไม้ตีขอบเมือง (ริมแม่น้ำ/ขอบโซน) */
  HEDGE_TILES.forEach(([x,z])=>{
    const hb = buildHedgeBush(x, z);
    hb.position.set(outWX(x), 0, outWZ(z));
    mergeCollectFx(hb, parts, chunkKeyOf(x, z));
  });

  /* ม้านั่งในชุมชน/ลานกิจกรรม + รถเข็นขายของแทรกตามทาง */
  streetLampPos = [];
  lampSpots().forEach(([x,z])=>{                       /* เสาไฟริมทางเดิน (กลางคืนโคมสว่างขึ้นเอง) */
    const lp = buildStreetLamp();
    lp.position.set(outWX(x), 0, outWZ(z));
    streetLampPos.push({x: lp.position.x, z: lp.position.z});   /* จำตำแหน่งไว้ให้ดวงไฟจริงย้ายไปหา */
    mergeCollectFx(lp, parts, chunkKeyOf(x, z));
  });
  BENCH_SPOTS.forEach(([x,z,rot])=>{
    const bn = buildBench();
    bn.position.set(outWX(x), 0, outWZ(z));
    bn.rotation.y = (rot||0) * Math.PI/2;
    addSeatSpot(x, z, rot||0, 'bench');
    mergeCollectFx(bn, parts, chunkKeyOf(x, z));
  });
  CART_SPOTS.forEach(([x,z,rot,kind])=>{
    const ct = buildCart(kind);
    ct.position.set(outWX(x), 0, outWZ(z));
    ct.rotation.y = (rot||0) * Math.PI/2;
    mergeCollectFx(ct, parts, chunkKeyOf(x, z));
  });
  /* ---------- ตลาดรถเข็นหน้าโรงเรียน: ป้ายตลาด + เสาธงราวขึงข้ามทางเดินกลาง ---------- */
  {
    MARKET_SIGNS.forEach(sp=>{
      const ms = buildMarketSign();
      ms.position.set(outWX(sp.x), 0, outWZ(sp.z));
      mergeCollectFx(ms, parts, chunkKeyOf(sp.x, sp.z));
    });
    MARKET_BUNTING.forEach(([x,z,span])=>{                         /* span>0 = ต้นซ้ายที่ถือเชือกธงทั้งเส้น */
      const bt = buildMarketBunting(span > 0, span);
      bt.position.set(outWX(x), 0, outWZ(z));
      mergeCollectFx(bt, parts, chunkKeyOf(x, z));
    });
  }
  FLOWER_BEDS.forEach((b,i)=>{                       /* แปลงดอกไม้หน้าลานกิจกรรม */
    mergeCollectFx(buildFlowerBed(b, i), parts, chunkKeyOf(b.x0, b.z0));
  });
  /* ---------- สระว่ายน้ำของโรงแรม ---------- */
  const pdW = POOL_DECK.x1 - POOL_DECK.x0 + 1, pdD = POOL_DECK.z1 - POOL_DECK.z0 + 1;
  const pdk = buildPoolDeckFloor(pdW, pdD);
  pdk.position.set(outWX((POOL_DECK.x0+POOL_DECK.x1)/2), 0, outWZ((POOL_DECK.z0+POOL_DECK.z1)/2));
  mergeCollectFx(pdk, parts, chunkKeyOf(POOL_DECK.x0, POOL_DECK.z0));
  /* สระว่ายน้ำไม่ merge — ผิวน้ำต้องกระเพื่อมได้ และมีของเล่นลอยน้ำ (ดู updatePoolFx) */
  poolFx = buildPoolWater(POOL.x1-POOL.x0+1, POOL.z1-POOL.z0+1);
  poolFx.position.set(outWX((POOL.x0+POOL.x1)/2), 0, outWZ((POOL.z0+POOL.z1)/2));
  addPoolFloats(poolFx, POOL.x1-POOL.x0+1, POOL.z1-POOL.z0+1);
  worldGroup.add(poolFx);
  POOL_PROPS.forEach(([x,z,kind])=>{
    const pp = buildPoolProp(kind);
    pp.position.set(outWX(x), 0, outWZ(z));
    if(kind === 'chair') pp.rotation.y = Math.PI;      /* เตียงหันหน้าเข้าหาสระ */
    mergeCollectFx(pp, parts, chunkKeyOf(x, z));
  });
  /* ป้ายเมนูสามเหลี่ยมตั้งพื้นหน้าลานร้านอาหาร (ช่องนี้บล็อกใน buildOutGrid — เดินทะลุไม่ได้) */
  {
    const sb = buildSandwichSign();
    sb.position.set(outWX(FOOD_SIGN.x), 0, outWZ(FOOD_SIGN.z));
    sb.rotation.y = FOOD_SIGN.rot;
    mergeCollectFx(sb, parts, chunkKeyOf(FOOD_SIGN.x, FOOD_SIGN.z));
  }
  /* ---------- ซุ้มทางเดินเข้าลานน้ำพุ 3 ทาง ---------- */
  PLAZA_GATES.forEach(gt=>{
    const alongX = gt.axis === 'x';
    const mid = alongX ? (gt.z0+gt.z1)/2 : (gt.x0+gt.x1)/2;      /* กึ่งกลางความกว้างทาง */
    const a0 = alongX ? gt.x0 : gt.z0, a1 = alongX ? gt.x1 : gt.z1;
    for(let a=a0; a<=a1; a++){
      const rib = buildArchRib(a);
      if(alongX) rib.position.set(outWX(a), 0, outWZ(mid));
      else { rib.position.set(outWX(mid), 0, outWZ(a)); rib.rotation.y = Math.PI/2; }
      mergeCollectFx(rib, parts, chunkKeyOf(alongX ? a : gt.x0, alongX ? gt.z0 : a));
    }
  });
  /* ---------- ทุ่งดอกไม้: ผืนหน้าโรงแรม + ผืนใหญ่ริมขอบแผนที่ทิศใต้ + ดอกไม้ริมทางทั่วชุมชน ----------
     ผังทั้งหมดคิดที่ fieldFlowerPlan() ที่เดียว (ใช้ร่วมกับตอนสร้างกริดทางเดิน)
     'field' = ทุ่ง/สวนดอกไม้ (เดินเหยียบไม่ได้) · 'path' = ทางเดินกลางทุ่ง · 'sprig' = ดอกไม้ริมทาง (เดินได้) */
  (fieldPlanCache || fieldFlowerPlan(outGrid)).forEach(f=>{
    const g2 = f.kind==='path' ? buildFieldPath(f.x, f.z)
             : f.kind==='sun'  ? buildSunflowers(f.x, f.z)
             : buildFieldFlowers(f.x, f.z, f.opt);
    g2.position.set(outWX(f.x), 0, outWZ(f.z));
    mergeCollectFx(g2, parts, chunkKeyOf(f.x, f.z));
    if(f.kind==='path') pathSet.add(f.x + ',' + f.z);       /* แตะแล้วเดินเฉยๆ เหมือนถนน */
    else flowerSet.add(f.x + ',' + f.z);                    /* แตะแล้วเด็กเก็บดอกไม้ได้ (อนุภาคกลีบดอก) */
  });
  [FLOWER_FIELD.x0, FLOWER_FIELD.x1].forEach(x=>{    /* ซุ้มดอกไม้หัว-ท้ายทางเดินกลางทุ่ง */
    const ar = buildFlowerArch();
    ar.position.set(outWX(x), 0, outWZ(FLOWER_FIELD_PATH));
    mergeCollectFx(ar, parts, chunkKeyOf(x, FLOWER_FIELD_PATH));
  });
  const fsg = buildFieldSign();
  fsg.position.set(outWX(FLOWER_FIELD.x0 + 1) + .15, 0, outWZ(FLOWER_FIELD_PATH - 1) + .2);
  mergeCollectFx(fsg, parts, chunkKeyOf(FLOWER_FIELD.x0, FLOWER_FIELD.z0));
  flowerTiles().forEach(([x,z],i)=>{
    const fl = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.18,6), toonMat(0x4caf50));
    stem.position.y = .09; fl.add(stem);
    const bl = sphere(.07, [0xff8fb3,0xffd54f,0xb388ff,0xff8a65][i%4], 8); bl.position.y = .2; fl.add(bl);
    fl.position.set(outWX(x)+.22, 0, outWZ(z)-.18);
    mergeCollectFx(fl, parts, chunkKeyOf(x, z));
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
  FISH_RACKS.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  /* ลานแคมป์: เต็นท์กินช่องละ 2 ช่องตามแนว z · กองไฟกับของในแคมป์บล็อกช่องตัวเอง */
  CAMP_TENTS.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  if(grid[CAMP_FIRE.z] && grid[CAMP_FIRE.z][CAMP_FIRE.x]===0) grid[CAMP_FIRE.z][CAMP_FIRE.x] = 3;
  CAMP_PROPS.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  beachPropTiles().forEach(([x,z,kind])=>{
    if((kind==='palm' || kind==='chair' || kind==='canoe' || kind==='ring') && grid[z] && grid[z][x]===0) grid[z][x] = 3;
  });
  /* เฟส 7: รั้ว/ของในคอก + เวที/เสาธง/ม้านั่ง/รถเข็น บล็อกทางเดิน
     (สัตว์ในคอกเดินไปมาได้ จึงไม่บล็อกช่อง / ท่าไม้กับคนตกปลาอยู่บนผืนน้ำที่บล็อกอยู่แล้ว) */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++)
    if(grid[z][x]===0 && (isPenFenceTile(x, z) || isSchoolFenceTile(x, z) || inBox(STAGE, x, z) || inFlowerBed(x, z)
       || inPool(x, z))) grid[z][x] = 3;
  if(grid[SCHOOL_FLAG.z] && grid[SCHOOL_FLAG.z][SCHOOL_FLAG.x]===0) grid[SCHOOL_FLAG.z][SCHOOL_FLAG.x] = 3;   /* เสาธงหน้าโรงเรียน */
  FARM_PROPS.concat(BANNER_POLES, BENCH_SPOTS, CART_SPOTS, CARPENTER_PROPS, POOL_PROPS, PET_PEN_PROPS)
    .forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  /* ป้ายเมนูสามเหลี่ยมหน้าร้านอาหาร: ตัวป้ายตั้งพื้นเต็มช่อง ต้องบล็อกด้วย ไม่งั้นเดินทะลุป้ายได้ */
  if(grid[FOOD_SIGN.z] && grid[FOOD_SIGN.z][FOOD_SIGN.x]===0) grid[FOOD_SIGN.z][FOOD_SIGN.x] = 3;
  /* ตลาดหน้าโรงเรียน: ป้ายตลาด + เสาธงราว บล็อกช่องตัวเอง (รถเข็น/ม้านั่งบล็อกไปแล้วในชุดด้านบน) */
  MARKET_SIGNS.forEach(sp=>{ if(grid[sp.z] && grid[sp.z][sp.x]===0) grid[sp.z][sp.x] = 3; });
  MARKET_BUNTING.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  /* สนามเด็กเล่น: พื้นยางเดินได้ทั้งผืน บล็อกเฉพาะตัวเครื่องเล่นกับป้ายหน้าสนาม */
  PLAY_ITEMS.forEach(it => it.tiles.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; }));
  for(let z=PLAYGROUND.z0; z<=PLAYGROUND.z1; z++) for(let x=PLAYGROUND.x0; x<=PLAYGROUND.x1; x++)
    if(grid[z][x]===0 && isPlayFenceTile(x, z)) grid[z][x] = 3;      /* รั้วรอบสนาม (เว้นช่องประตู) */
  if(grid[PLAY_SIGN.z] && grid[PLAY_SIGN.z][PLAY_SIGN.x]===0) grid[PLAY_SIGN.z][PLAY_SIGN.x] = 3;
  if(!noWild) lampSpots().forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });   /* เสาไฟบล็อกช่องตัวเอง */
  HEDGE_TILES.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });                /* แนวพุ่มไม้เดินทะลุไม่ได้ */
  /* เฟส 8: ชาวบ้านที่ยืนประจำที่ + กระดานภารกิจ บล็อกช่องของตัวเอง
     (ชาวบ้านที่เดินไปมามี roam จึงไม่บล็อก — ดู NPC_TILES) */
  NPC_TILES.forEach(([x,z])=>{ if(grid[z] && grid[z][x]===0) grid[z][x] = 3; });
  for(let i=0; i<(QUEST_BOARD.w||1); i++)                                   /* กระดานภารกิจกว้าง 2 ช่อง บล็อกทั้งสองช่อง */
    if(grid[QUEST_BOARD.z] && grid[QUEST_BOARD.z][QUEST_BOARD.x+i]===0) grid[QUEST_BOARD.z][QUEST_BOARD.x+i] = 3;
  /* ทุ่งดอกไม้/สวนดอกไม้ = เดินเหยียบไม่ได้ (คำขอผู้ใช้ 2026-08-02) — เด็กต้องเดินอ้อมหรือใช้ทางเดินกลางทุ่ง
     คิดผังจาก fieldFlowerPlan() ตัวเดียวกับตอนวางดอกไม้จริง แล้วเก็บ cache ไว้ให้ buildStaticScenery ใช้ต่อ
     (ต้องเก็บผังก่อนค่อยปิดกริด ไม่งั้นช่องแรกๆ ที่ปิดไปจะทำให้ช่องถัดไปหลุดจากผัง)
     ทำก่อนขั้นตอนปิดช่องที่เดินเข้าไม่ถึงด้านล่าง → ถ้าทุ่งไปปิดจนเกิดซอกตัน ซอกนั้นจะถูกปิดตามให้เอง */
  if(!noWild){
    fieldPlanCache = fieldFlowerPlan(grid);
    fieldPlanCache.forEach(f=>{ if((f.kind==='field' || f.kind==='sun') && grid[f.z][f.x]===0) grid[f.z][f.x] = 3; });
  }
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
  sceneryFx = new THREE.Group(); fxProps = [];   /* ของในฉากที่ขยับได้ (ธง/ควัน/เรือ/ผิวน้ำ ฯลฯ) */
  worldGroup.add(sceneryFx);
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
  /* ทึบแสง — เดิมโปร่ง .9 พอผืนน้ำ 2 ผืนซ้อนกันตรงรอยต่อ (คลองส่งน้ำ×แม่น้ำ×บ่อ) สีจะเข้มกว่าที่อื่นเป็นแถบ */
  const waterMat = new THREE.MeshToonMaterial({color:0x6cc6e8, gradientMap});
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(RIVER_X.length, .14, OUT_D), waterMat);
  waterMesh.position.set(outWX((RIVER_X[0]+RIVER_X[RIVER_X.length-1])/2), -.25, 0);
  worldGroup.add(waterMesh);
  /* วงคลื่นในแม่น้ำ — แม่น้ำ/บ่อไม่ขยับผิวน้ำแล้ว (ยกทั้งผืนแล้วเห็นรอยต่อกับตลิ่ง) ใช้วงคลื่นแทน
     แม่น้ำยาวตลอดแผนที่ (68 ช่อง) จึงวางถี่ทุก ~5 ช่องตลอดเส้น เว้นช่วงที่มีสะพานคร่อมอยู่
     สลับซ้าย-ขวาของร่องน้ำและเหลื่อมจังหวะกัน ทั้งสายจะได้กระเพื่อมไม่พร้อมกัน */
  {
    const onBridge = z => BRIDGES.some(bz => z >= bz[0]-1 && z <= bz[bz.length-1]+1);
    let n = 0;
    for(let z=3; z<OUT_D-2; z+=5){
      if(onBridge(z)) continue;
      const rv = new THREE.Mesh(new THREE.RingGeometry(.34, .45, 22),
        new THREE.MeshBasicMaterial({color:0xdff5ff, transparent:true, opacity:.3, depthWrite:false}));
      rv.rotation.x = -Math.PI/2;
      rv.position.set(outWX(RIVER_X[0]) + (n%2 ? .55 : .05), -.16, outWZ(z) + (n%3===0 ? .4 : 0));
      worldGroup.add(rv);
      fxTag(rv, 'ripple', {ph:(n*.29) % 1}); registerFx(rv);
      n++;
    }
  }
  /* บ่อน้ำใหญ่ทิศเหนือ: วงรีแผ่นเดียว (ทำใหญ่กว่าขอบช่องน้ำเล็กน้อย ให้บล็อกหญ้าริมบ่อบังขอบเนียนๆ) */
  const pondGeo = new THREE.CylinderGeometry(1, 1, .14, 40);
  pondGeo.scale(POND.rx + .8, 1, POND.rz + .8);
  const pond = new THREE.Mesh(pondGeo, waterMat);
  pond.position.set(outWX(POND.cx), -.25, outWZ(POND.cz));
  worldGroup.add(pond);
  /* วงคลื่นบนบ่อน้ำ 3 วง ขยายออกแล้วจางหาย ให้ผิวน้ำดูไม่นิ่งสนิท */
  for(let i=0; i<3; i++){
    const rp = new THREE.Mesh(new THREE.RingGeometry(.5, .62, 26),
      new THREE.MeshBasicMaterial({color:0xdff5ff, transparent:true, opacity:.3, depthWrite:false}));
    rp.rotation.x = -Math.PI/2;
    rp.position.set(outWX(POND.cx) + (i-1)*1.6, -.16, outWZ(POND.cz) + (i%2 ? 1.2 : -1.1));
    worldGroup.add(rp);
    fxTag(rp, 'ripple', {ph:i/3}); registerFx(rp);
  }
  /* คลองส่งน้ำจากบ่อ → คลองหลัก (ยืดปลายทั้งสองข้างให้ซ้อนบ่อ/คลองหลัก ไม่เห็นรอยต่อ) */
  const canal = new THREE.Mesh(new THREE.BoxGeometry(CANAL_X1 - CANAL_X0 + 4, .14, CANAL_Z.length), waterMat);
  /* ต่ำกว่าผืนอื่นนิดเดียว กันผิวน้ำซ้อนกันแล้วกะพริบ (z-fighting) ตรงรอยต่อบ่อ/คลองหลัก */
  canal.position.set(outWX((CANAL_X0 + CANAL_X1)/2), -.254, outWZ((CANAL_Z[0] + CANAL_Z[CANAL_Z.length-1])/2));
  worldGroup.add(canal);
  /* วงคลื่นในคลองส่งน้ำ (เหมือนแม่น้ำกับบ่อ — ผิวน้ำไม่ขยับ ใช้วงคลื่นแทน)
     คลองยาวราว 19 ช่อง วางให้ทั่วทั้งเส้นเกือบทุก 2 ช่อง สลับซ้าย-ขวาของร่องน้ำ
     เหลื่อมจังหวะกันทุกวง คลองทั้งเส้นจะได้มีคลื่นกระเพื่อมตลอดเวลา */
  const canalN = 7;                        /* คลองสั้นกว่าแม่น้ำมาก 7 วงกำลังพอดี ไม่แน่นจนดูรก */
  const canalStep = (CANAL_X1 - CANAL_X0 - 2) / (canalN - 1);
  for(let i=0; i<canalN; i++){
    const rc = new THREE.Mesh(new THREE.RingGeometry(.3, .41, 22),
      new THREE.MeshBasicMaterial({color:0xdff5ff, transparent:true, opacity:.3, depthWrite:false}));
    rc.rotation.x = -Math.PI/2;
    rc.position.set(outWX(CANAL_X0 + 1 + i*canalStep + (i%3===0 ? .35 : 0)), -.16,
                    outWZ(CANAL_Z[0] + (i%2 ? .85 : .15)));
    worldGroup.add(rc);
    fxTag(rc, 'ripple', {ph:(i*.37) % 1}); registerFx(rc);
  }
  /* ทะเลมุมตะวันออกเฉียงใต้: ผืนสี่เหลี่ยมใหญ่ใต้ระดับหญ้า — ชายฝั่งจริงเกิดจากบล็อกทราย/หญ้าที่บังไว้ */
  /* กว้าง/ลึกพอดีขอบแผนที่เป๊ะ (ล้นออกไปจะเห็นผืนน้ำลอยพ้นขอบเกาะ) */
  const seaW = OUT_W - VILLAGE_X0, seaD = SEA_MAX_Z + 1;
  const sea = new THREE.Mesh(new THREE.BoxGeometry(seaW, .14, seaD), waterMat);
  sea.position.set(outWX(VILLAGE_X0 - .5 + seaW/2), -.25, outWZ(SEA_MAX_Z + .5 - seaD/2));
  worldGroup.add(sea);
  fxTag(sea, 'water', {ph:1.1}); registerFx(sea);
  /* ฟองคลื่นซัดริมหาด: แถบขาวบางๆ วิ่งเข้าหาฝั่งแล้วจางหาย (วางตามแนวชายฝั่งจริงทีละช่วง) */
  for(let x = VILLAGE_X0 + 2; x < OUT_W - 2; x += 5){
    const ez = seaEdgeZ(x);
    if(ez < 1) continue;
    const foam = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1),
      new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.3, depthWrite:false}));
    foam.rotation.x = -Math.PI/2;
    foam.position.set(outWX(x), -.14, outWZ(ez - .3));
    worldGroup.add(foam);
    fxTag(foam, 'foam', {ph:(x % 5)/5, z0:foam.position.z}); registerFx(foam);
  }
  const dirtBase = new THREE.Mesh(roundedBoxGeo(OUT_W,.6,OUT_D,.1), toonMat(0x9c6b45));
  dirtBase.position.y = -.54; worldGroup.add(dirtBase);

  /* ถนนหินในชุมชน + ลานกลางชุมชน (แผ่นเดียวต่อช่อง instanced — เดินผ่านได้ ไม่บล็อก) */
  const roadTiles = [], plazaTiles = [], soilTiles = [];
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]===1 || outGrid[z][x]===2) continue;   /* ไม่ปูพื้นทับผิวน้ำ/สะพาน */
    if(farmPlotAt(x,z) || isPenSoilTile(x,z)) soilTiles.push([x,z]);
    /* ลานตลาดปูพื้นชุดเดียวกับถนน (คำขอผู้ใช้ 2026-08-03) — ถนนใหญ่ z57-58 ที่พาดผ่านกลางตลาด
       จึงต่อเนื่องเป็นผืนเดียวกับลาน ไม่เห็นรอยต่อโซน (เดิมปูอิฐโทนส้ม ห้ามใส่กลับโดยไม่ถาม) */
    else if(isVillageRoadTile(x,z) || inMarket(x,z)) roadTiles.push([x,z]);
    else if(isPlazaTile(x,z)) plazaTiles.push([x,z]);
  }
  /* โทนถนน/ลานเข้มขึ้นกว่าเดิม (เดิม 0xe8d3a9/0xeadfc8 อ่อนจนกลืนกับหญ้าอ่อนและทราย
     ทำให้แยกไม่ออกว่าตรงไหนเป็นทางเดิน) — ยังอยู่ในโทนพาสเทลอุ่นเหมือนเดิม */
  /* ---- ดีไซน์ถนน: ปูแผ่นหินสองเฉดสลับฟันปลาเหมือนพื้นหญ้า + ขอบทางสีครีมตีเส้นริมถนน ----
     (เดิมเป็นสีเดียวเรียบทั้งเส้น ดูเป็นแถบสีแบนๆ ไม่เข้ากับพื้นหญ้าลายตารางของเมือง) */
  const putTiles = (tiles, color, y)=>{
    if(!tiles.length) return;
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1,.1,1), toonMat(color), tiles.length);
    tiles.forEach(([x,z],i)=>{ m4.makeTranslation(outWX(x), y, outWZ(z)); im.setMatrixAt(i, m4); });
    im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows;
    worldGroup.add(im);
  };
  putTiles(roadTiles.filter(([x,z])=>((x+z)&1)===0), 0xd3b886, -.02);
  putTiles(roadTiles.filter(([x,z])=>((x+z)&1)===1), 0xc7a674, -.02);
  putTiles(plazaTiles.filter(([x,z])=>((x+z)&1)===0), 0xdccaa6, -.02);
  putTiles(plazaTiles.filter(([x,z])=>((x+z)&1)===1), 0xd2bd94, -.02);
  putTiles(soilTiles, 0x9c6b41, -.02);
  /* ขอบทาง (kerb) สีครีม: วางตามด้านของช่องถนนที่ติดกับพื้นหญ้า แยก 2 ชุดตามแนวยาว */
  {
    const isRoadT = (x,z)=> x>=0 && z>=0 && x<OUT_W && z<OUT_D && (isVillageRoadTile(x,z) || isPlazaTile(x,z));
    const kerbX = [], kerbZ = [];
    roadTiles.concat(plazaTiles).forEach(([x,z])=>{
      [[-1,0],[1,0]].forEach(([dx])=>{ if(!isRoadT(x+dx, z)) kerbX.push([outWX(x)+dx*.47, .035, outWZ(z)]); });
      [[0,-1],[0,1]].forEach(([,dz])=>{ if(!isRoadT(x, z+dz)) kerbZ.push([outWX(x), .035, outWZ(z)+dz*.47]); });
    });
    const addKerb = (geo, list)=>{
      if(!list.length) return;
      const im = new THREE.InstancedMesh(geo, toonMat(0xefe3c6), list.length);
      list.forEach((p,i)=>{ m4.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(i, m4); });
      im.instanceMatrix.needsUpdate = true; worldGroup.add(im);
    };
    addKerb(new THREE.BoxGeometry(.1, .12, 1), kerbX);
    addKerb(new THREE.BoxGeometry(1, .12, .1), kerbZ);
  }
  /* ทางเดินทั้งเมืองใช้หน้าตาเดียวกับทางเดินดินในทุ่งดอกไม้: โรยก้อนหินเล็กบนทาง + หญ้าเป็นกอตรงริมทาง
     ทั้งหมดเป็นของตกแต่งนิ่งๆ (instanced เฉยๆ ไม่ใช่ decor ที่กดได้) คลิกทางเดินจึงไม่เกิด effect อะไร
     ตำแหน่งสุ่มจาก fieldRnd(x,z) จึงคงที่ทุกครั้งที่เข้าเกม ไม่กระโดดไปมา */
  /* ลายพื้นถนน: ก้อนหินกลมแบนโรยบนทาง — แยกเป็น 2 ชุดตามเฉดของช่องที่มันวางอยู่
     (พื้นถนนสลับ 2 เฉดฟันปลา) แล้วใช้สีที่ "กลืน" ไปกับช่องนั้นๆ เข้มกว่านิดเดียวพอให้เห็นเป็นลายพื้น
     ไม่ใช่ก้อนกรวดลอยเด่นขึ้นมา + รับเงาได้ เงาต้นไม้/ตัวละครจึงทาบผ่านได้เนียนเหมือนพื้น */
  if(roadTiles.length){
    const stoneA = [], stoneB = [], tufts = [];
    /* ต้องเช็คให้ตรงกับ "ช่องที่ปูพื้นถนนจริง" (roadTiles) ไม่ใช่แค่ isVillageRoadTile —
       ลานตลาดถูกปูเป็นพื้นถนนด้วย ถ้าเช็คแค่ถนน ทุกช่องในตลาดจะนึกว่าตัวเองติดหญ้าทั้ง 4 ด้าน
       แล้วโรยกอหญ้าเขียวเต็มลานไปหมด */
    const isRoad = (x,z)=> x>=0 && z>=0 && x<OUT_W && z<OUT_D && (isVillageRoadTile(x,z) || inMarket(x,z));
    roadTiles.forEach(([x,z])=>{
      const rnd = fieldRnd(x, z);
      const list = ((x+z)&1) === 0 ? stoneA : stoneB;            /* ตามเฉดของช่องที่หินวางอยู่ */
      for(let k=0; k<2; k++) list.push([outWX(x) + (rnd()-.5)*.72, .035, outWZ(z) + (rnd()-.5)*.72]);
      if(inMarket(x, z)) return;                                 /* ในลานตลาดไม่โรยกอหญ้าเลย (คำขอผู้ใช้ 2026-08-03) */
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
      im.instanceMatrix.needsUpdate = true;
      im.receiveShadow = hShadows;                               /* ให้เงาทาบทับก้อนหินได้ */
      worldGroup.add(im);
    };
    const stoneGeo = new THREE.CylinderGeometry(.13,.15,.05,7);
    addInst(stoneGeo, toonMat(0xcbaf7c), stoneA);                /* กลืนกับช่องเฉดอ่อน 0xd3b886 */
    addInst(stoneGeo, toonMat(0xbf9d6b), stoneB);                /* กลืนกับช่องเฉดเข้ม 0xc7a674 */
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
  /* ck/cf = ไฟส่องแท่นหน้าแต่งตัว/เลือกสัตว์เลี้ยง — กลางวันปิดสนิท (ฉากสว่างพออยู่แล้ว)
     กลางคืนเปิดเป็นไฟสปอตอุ่นๆ ไม่งั้นเด็กมองสีเสื้อ/สีขนไม่ออกเลย */
  return night
    ? {hi:.55, di:.5,  ck:.85, cf:.45, hc:new THREE.Color(0x8fa3d9), hg:new THREE.Color(0x39406b), dc:new THREE.Color(0xbcd0ff)}
    : {hi:.62, di:.68, ck:0,    cf:0,  hc:new THREE.Color(0xfff6e0), hg:new THREE.Color(0xcde8b0), dc:new THREE.Color(0xffffff)};
}
function applyCreatorLights(ck, cf){
  if(creatorKeyLight)  creatorKeyLight.intensity  = ck;
  if(creatorFillLight) creatorFillLight.intensity = cf;
  if(creatorGlow){
    creatorGlow.visible = ck > .02;
    creatorGlow.material.opacity = Math.min(.16, ck*.14);   /* จางๆ พอให้เห็นวงไฟ ไม่กลบสีพื้นแท่น */
  }
}
function updateLights(instant){
  const to = lightTargets((typeof isNightMode==='function') && isNightMode());
  refreshLamps();   /* กลางคืน → เปิดไฟโคม/เสาไฟอัตโนมัติ, กลางวัน → ปิด */
  if(instant){
    hemiLight.intensity = to.hi; dirLight.intensity = to.di;
    hemiLight.color.copy(to.hc); hemiLight.groundColor.copy(to.hg); dirLight.color.copy(to.dc);
    applyCreatorLights(to.ck, to.cf);
    lightLerp = null;
    return;
  }
  lightLerp = {k:0, dur:2,
    from:{hi:hemiLight.intensity, di:dirLight.intensity,
          ck:creatorKeyLight ? creatorKeyLight.intensity : to.ck,
          cf:creatorFillLight ? creatorFillLight.intensity : to.cf,
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
  applyCreatorLights(from.ck + (to.ck-from.ck)*e, from.cf + (to.cf-from.cf)*e);
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
  /* ไฟส่องเวที: อยู่ในกลุ่มนี้ จึงติดเฉพาะตอนเปิดหน้าแต่งตัว/เลือกสัตว์เลี้ยง (กลุ่มซ่อน = ไฟดับเอง)
     ความสว่างคุมด้วย lightTargets() — กลางวัน 0, กลางคืนเปิดอุ่นๆ ให้เห็นสีเสื้อ/สีขนชัด */
  creatorKeyLight = new THREE.PointLight(0xfff1c8, 0, 18, 1.05);
  creatorKeyLight.position.set(1.7, 3.5, 3.6);
  creatorGroup.add(creatorKeyLight);
  creatorFillLight = new THREE.PointLight(0xd6e6ff, 0, 16, 1.2);   /* ไฟช่วยด้านตรงข้าม กันครึ่งตัวที่ทึบเป็นเงาดำ */
  creatorFillLight.position.set(-2.4, 1.7, 2.4);
  creatorGroup.add(creatorFillLight);
  /* วงแสงบนแท่น ให้เด็กเห็นว่ามี "ไฟส่อง" จริงๆ ไม่ใช่จู่ๆ ก็สว่าง */
  creatorGlow = new THREE.Mesh(new THREE.CircleGeometry(1.05, 28),
    new THREE.MeshBasicMaterial({color:0xfff3cc, transparent:true, opacity:0, depthWrite:false}));
  creatorGlow.rotation.x = -Math.PI/2; creatorGlow.position.y = .015; creatorGlow.visible = false;
  creatorGroup.add(creatorGlow);
  creatorGroup.visible = false;
  scene.add(creatorGroup);
  /* ไฟเวทีเพิ่งถูกสร้าง — ตั้งค่าให้ตรงธีมปัจจุบันทันที (ไม่เรียก updateLights ทั้งก้อน
     เพราะ refreshLamps() ข้างในจำสถานะกลางวัน/คืนไว้ จะทำให้โคมไฟที่สร้างทีหลังไม่ติดกลางคืน) */
  {
    const t0 = lightTargets((typeof isNightMode==='function') && isNightMode());
    applyCreatorLights(t0.ck, t0.cf);
  }

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
/* เดินไปยังจุดที่แตะบนพื้น (ใช้ทั้งกับพื้นจริงและของที่ทำหน้าที่เป็นพื้น เช่น แผ่นทางเดิน) */
function walkToPoint(pt){
  const gx = Math.round(pt.x + (OUT_W-1)/2), gz = Math.round(pt.z + (OUT_D-1)/2);
  if(gx<0 || gz<0 || gx>=OUT_W || gz>=OUT_D) return;
  const t2 = nearestWalkable(outGrid, OUT_W, OUT_D, gx, gz);
  if(t2) walkTo(t2.x, t2.z, {});
}
function tapStaticScene(pt){
  const gx = Math.round(pt.x + (OUT_W-1)/2), gz = Math.round(pt.z + (OUT_D-1)/2);
  if(gx<0 || gz<0 || gx>=OUT_W || gz>=OUT_D) return;
  if(shakeTreeLeaves(gx, gz)) return;               /* แตะโดนต้นไม้/พุ่ม → ใบไม้ร่วง (ไม่ต้องเดินไป) */
  /* ทางเดินในทุ่ง/ถนน/ลาน = พื้นธรรมดา — เดินไปเฉยๆ ไม่มีเสียง ไม่หันหน้าเข้าหา
     (ถนนในเมืองเป็น instanced mesh ที่ไม่มี tag จึงเป็นแบบนี้อยู่แล้ว แต่ทางเดินในทุ่งถูก merge
      รวมกับฉากตายตัว เลยไปเข้าเงื่อนไข "แตะพุ่มหญ้า" ทำให้มีเสียงและเด็กหันหน้าเข้าหา) */
  if(pathSet.has(gx + ',' + gz) || isVillageRoadTile(gx, gz) || isPlazaTile(gx, gz) || inPlayground(gx, gz)){
    const w = nearestWalkable(outGrid, OUT_W, OUT_D, gx, gz);
    if(w) walkTo(w.x, w.z, {});
    return;
  }
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
  if(SHOP && SHOP.isOpen()){ SHOP.close(); return; }   /* หน้าร้านเปิดอยู่ → แตะนอกกล่อง = ออกจากร้าน */
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
        if(o.userData.hDecor){
          /* แผ่นทางเดินเป็น "พื้น" ไม่ใช่ของเล่น — แตะแล้วเดินไปตรงนั้นเหมือนแตะพื้นปกติ
             (ยกเว้นตอนอยู่โหมดตกแต่ง ยังต้องเลือก/ย้ายแผ่นได้เหมือนเดิม) */
          if(!editMode && o.userData.hDecor.item.flat){ walkToPoint(hits[0].point); return; }
          decorInteract(o); return;
        }
        if(o.userData.hPlay != null){ tapPlayItem(o.userData.hPlay); return; }
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
  slideRide = null;              /* สั่งเดินใหม่ระหว่างเล่นสไลเดอร์ = เลิกเล่นก่อน */
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
    else if(a.type==='play') playAtItem(a.idx);
    else if(a.type==='decor'){
      const g = a.group, item = a.item, act = a.act;
      if(act==='slide') startSlideRide(g, item);
      else if(act==='pethouse') togglePetRest(g);
      else if(act==='sit' || act==='sleep') startSit(g, item, act);
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
      hPet.rest = null; hPet.sitK = 0; hPet.group.rotation.x = 0;   /* ที่นอนรออยู่หน้าบ้านสัตว์เลี้ยงเป็นอันจบ ตามเด็กเข้าฉากใหม่ */
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
  const keepScroll = wrap.scrollTop;    /* สร้างแถวใหม่ตอนใส่/ถอดของ — อย่าให้กระโดดกลับไปบนสุด */
  wrap.innerHTML = '';
  H_ROWS.forEach((row, ri)=>{
    /* แถวสีของเครื่องแต่ง (ธง needs) — ซ่อนทั้งแถวถ้ายังไม่ได้ใส่ชิ้นนั้น หรือยังไม่มีชิ้นนั้น
       (เลือกสีหมวกทั้งที่ไม่ได้ใส่หมวกไม่มีความหมาย พอเลือกใส่แล้วแถวสีจะโผล่มาเอง) */
    if(row.needs && !wearsAcc(cfg, row.needs)) return;
    /* เส้นคั่นกลุ่ม (ธง sec ใน H_ROWS) — แยกให้เห็นว่าแถวสีไหนเป็นของชิ้นไหน */
    if(row.sec && ri > 0){
      const sep = document.createElement('div');
      sep.className = 'house-row-sep';
      wrap.appendChild(sep);
    }
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
      }else if(row.type==='num'){
        /* แถวของแต่ง (row.none) — ตัวเลือกแรกคือ "ไม่ใส่" โชว์เป็นเครื่องหมายกากบาท ไม่ใช่เลข 1
           (ไม่งั้นเด็กเลือกแบบที่ 1 แล้วไม่มีอะไรขึ้น นึกว่าแอปเสีย) */
        b.textContent = row.none ? (i===0 ? '✖' : String(i)) : String(i+1);
        if(row.none && i===0){ b.classList.add('house-chip-none'); b.setAttribute('aria-label', row.label+' — ไม่ใส่'); }
      }
      else{ b.textContent = row.options[i]; }
      if(cfg[row.key]===i) b.classList.add('active');
      /* เฟส 1: ชุดที่ยังไม่ได้ซื้อโชว์เป็นชิปจางมีแม่กุญแจ (ไม่ซ่อน) แตะแล้วบอกราคา + ที่ซื้อ */
      const locked = SHOP ? !SHOP.ownsFit(row.key, i) : false;
      if(locked) b.classList.add('house-chip-lock');
      b.addEventListener('click', ()=>{
        if(typeof playClick==='function') playClick();
        if(locked){
          if(typeof showToast==='function')
            showToast('👗', 'แบบนี้ยังไม่มีนะ ราคา '+SHOP.priceFit(row.key, i)+' เหรียญ ไปซื้อได้ที่ห้างแฟชั่นในเมือง!');
          return;
        }
        const was = cfg[row.key];
        cfg[row.key] = i;
        rebuildChar(cfg);
        /* ใส่/ถอดเครื่องแต่งที่มีแถวสีคู่กัน → สร้างรายการใหม่ให้แถวสีโผล่/หายทันที
           (เช็คแค่ตอนข้ามเส้น 0 ↔ ไม่ใช่ 0 จะได้ไม่ต้องวาดใหม่ทุกครั้งที่แค่เปลี่ยนแบบ) */
        if(H_ROWS.some(r=>r.needs===row.key) && (!was !== !i)){ buildCreatorRows(cfg); return; }
        chips.querySelectorAll('.house-chip').forEach(c=>c.classList.remove('active'));
        b.classList.add('active');
      });
      chips.appendChild(b);
    }
    div.appendChild(chips);
    wrap.appendChild(div);
  });
  wrap.scrollTop = keepScroll;
}
/* ใส่เครื่องแต่งชิ้นนี้อยู่จริงไหม — ต้องทั้ง "เลือกไว้ไม่ใช่ ✖ ไม่ใส่" และ "มีสิทธิ์ในชิ้นนั้น"
   (เด็กที่ยังไม่ได้ซื้อหมวกเลยจะเลือกได้แค่ ✖ อยู่แล้ว เงื่อนไขสิทธิ์เป็นตัวกันเคสข้อมูลเพี้ยน) */
function wearsAcc(cfg, key){
  const v = cfg[key];
  if(!v) return false;
  return SHOP ? SHOP.ownsFit(key, v) : true;
}

let creatorCfg = null;
function openCreator(fromWorld){
  if(SHOP) SHOP.close();          /* เปิดหน้าแต่งตัวทับหน้าร้านไม่ได้ (กล่อง bottom-sheet ซ้อนกัน) */
  hMode = 'creator';
  creatorState.fromWorld = fromWorld;
  creatorState.rotY = 0; creatorState.rotTarget = 0;
  const saved = loadHouseData();
  creatorCfg = Object.assign({}, H_DEFAULT_CHAR, (saved && saved.char) || {});
  $('house-creator').hidden = false;
  $('house-rotate-wrap').hidden = false;
  $('house-edit-btn').hidden = true;
  $('house-pet-btn').hidden = true; $('house-decorate-btn').hidden = true; $('house-child-chip').hidden = true;
  $('house-hint').hidden = true;
  /* ไอคอนหัวข้อเป็น SVG ให้เข้าชุด template (เสื้อ = ชุดเดียวกับปุ่มแต่งตัว #house-edit-btn, หน้าเด็ก = ชุด row "หนูเป็น...") */
  const _icChild = '<svg class="house-title-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="#ffe0b3" stroke="#e59a5b" stroke-width="2"/><circle cx="9" cy="11" r="1.3" fill="#6b4a2b"/><circle cx="15" cy="11" r="1.3" fill="#6b4a2b"/><path d="M9 14.6 Q12 17 15 14.6" fill="none" stroke="#c9573f" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const _icDress = '<svg class="house-title-ic" viewBox="0 0 24 24" fill="none" stroke="#C0527A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 3.6L4 6.2L5.9 10.6L8.2 9.6L8.2 20L15.8 20L15.8 9.6L18.1 10.6L20 6.2L14.8 3.6Q12 7.2 9.2 3.6Z" fill="#FFD6E8"/><path d="M12 15.9c-1.8-1.3-2.6-2.1-2.6-3.1 0-.8.65-1.4 1.4-1.4.5 0 .9.25 1.2.65.3-.4.7-.65 1.2-.65.75 0 1.4.6 1.4 1.4 0 1-.8 1.8-2.6 3.1z" fill="#C0527A" stroke="none"/></svg>';
  $('house-creator-title').innerHTML = fromWorld ? (_icDress + ' แก้ไขตัวละครของหนู') : (_icChild + ' สร้างตัวละครของหนู');
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
  exitCreatorToWorld();
  /* ครั้งแรกหลังสร้างตัวละครเสร็จ: ชวนรับเลี้ยงสัตว์ต่อเลย (มีปุ่มข้ามได้ ไม่บังคับ) */
  const d0 = loadHouseData() || {};
  if(!creatorState.fromWorld && !d0.pet && !d0.petPromptSeen){
    saveHouseData({petPromptSeen:true});
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) fadeSwap(()=>openPetPicker()); }, 1200);
  }
}
/* ยกเลิกการแต่งตัว (ปุ่ม ← ตอนกำลังแก้ไขตัวละคร) — ทิ้งชุดที่เพิ่งลอง กลับไปใช้ชุดที่บันทึกไว้เดิม */
function cancelCreator(){
  const saved = loadHouseData();
  creatorCfg = Object.assign({}, H_DEFAULT_CHAR, (saved && saved.char) || {});
  exitCreatorToWorld();
  if(typeof showToast==='function') showToast('↩️', 'ยกเลิกแล้ว ตัวละครกลับเป็นชุดเดิมนะ');
}
function exitCreatorToWorld(){
  hMode = 'world';
  $('house-creator').hidden = true;
  $('house-rotate-wrap').hidden = true;
  $('house-edit-btn').hidden = false;
  $('house-pet-btn').hidden = false; $('house-decorate-btn').hidden = false; $('house-child-chip').hidden = false;
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
  /* ล็อตที่เป็นร้านเปิดขายแล้ว (เฟส 1: ห้างเฟอร์นิเจอร์/ห้างแฟชั่น) — เดินมาถึงหน้าร้านแล้วเปิดร้านเลย
     ไม่ต้องรอทักพนักงานก่อน (เด็กแตะตัวตึกก็ควรเข้าร้านได้) */
  if(SHOP && SHOP.shopForLot(a.lot.id)){ SHOP.open(a.lot.id); return; }
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
/* ช่องที่ "อยู่ข้างๆ" เป้าหมาย (ไม่ใช่ช่องเดียวกับเป้าหมาย) และใกล้เด็กที่สุด
   คนที่เดินไปมา (roam/route) ไม่ได้จองช่องในกริด nearestWalkable จึงคืนช่องเดียวกับตัวเขาเอง
   ทำให้เด็กเดินเข้าไปทับ — ต้องเลือกช่องข้างเคียงเองเสมอ */
function tileBesideTarget(gx, gz){
  const cx = Math.round(charGroup.position.x + (OUT_W-1)/2);
  const cz = Math.round(charGroup.position.z + (OUT_D-1)/2);
  const cand = [];
  [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dz])=>{
    const x = gx+dx, z = gz+dz;
    if(x<0 || z<0 || x>=OUT_W || z>=OUT_D) return;
    if(!isWalk(outGrid, OUT_W, OUT_D, x, z)) return;
    cand.push({x, z, d: Math.hypot(x-cx, z-cz) + (dx && dz ? .35 : 0)});   /* ชอบช่องตรงทิศมากกว่าเฉียง */
  });
  if(!cand.length) return nearestWalkable(outGrid, OUT_W, OUT_D, gx, gz);
  cand.sort((a,b)=>a.d-b.d);
  return cand[0];
}
function tapNpc(def){
  const n = npcs.find(k => k.def === def); if(!n) return;
  n.hold = 14;   /* คนที่เดินไปมา: ยืนรอให้เด็กเดินมาถึงก่อน จะได้ไม่ต้องวิ่งไล่คุย */
  const gx = Math.round(n.g.position.x + (OUT_W-1)/2), gz = Math.round(n.g.position.z + (OUT_D-1)/2);
  const t = tileBesideTarget(gx, gz);
  if(!t) return;
  walkTo(t.x, t.z, {action:{type:'npc', npc:def.id, pos: tileWorld({x:gx, z:gz})}});
}
/* ---------- ชาวบ้านพูดคุย ----------
   หมายเหตุ: เคยให้ชาวบ้านอ่านออกเสียงประโยคด้วย Web Speech แต่โทนเสียงสังเคราะห์ไม่เข้ากับตัวการ์ตูน
   จึงปิดเสียงพูดของ NPC ทั้งหมด เหลือแค่ฟองคำพูดบนหัว (ห้ามใส่เสียงกลับโดยไม่ถามผู้ใช้ก่อน) */
let npcTalk = null;                        /* {n, until} — ฟองคำพูดที่ลอยอยู่ตอนนี้ */
const _npcV = new THREE.Vector3();
function talkToNpc(n){
  const d = n.def;
  /* ลุงตกปลาไม่หันมาหาเด็ก — กำลังจ้องทุ่นอยู่ (คุยไปตกปลาไป) */
  if(!d.fisher) n.faceT = 2.8;             /* คนอื่นหันหน้ามาหาเด็กชั่วครู่ */
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
  /* ตอนแตะเรียกคุย ตั้ง hold ไว้ 14 วิ (ยืนรอให้เด็กเดินมาถึง) — พอคุยจบแล้วต้องปล่อยให้เดินต่อทันที
     ไม่ใช่ยืนแข็งรอจนครบ 14 วิ (นกฮูกมาสคอตเห็นชัดสุดเพราะเดินได้ทั้งแผนที่) */
  n.hold = Math.max(0, (npcTalk.until - performance.now())/1000) + .4;
  questEvent('talk', d.id);
  if(d.job === 'vendor') questEvent('vendor', d.id);
  if(d.board && QUEST_ENABLED) setTimeout(()=>{ if(!questPanelOpen()) openQuestBoard(); }, 700);
  /* พนักงานที่ดูแลร้าน (ธง `shop` ใน NPC_DEFS) — ทักทายเสร็จแล้วเปิดหน้าร้านให้เลย
     หน่วงไว้ให้อ่านฟองคำพูดทันก่อน แล้วค่อยเลื่อนกล่องร้านขึ้นมา */
  if(d.shop && SHOP) setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) SHOP.open(d.shop); }, 900);
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
const CRITTER_MAX = 18;              /* แผนที่ 68×68 กว้างมาก ถ้ามีน้อยกว่านี้จะนานๆ ทีถึงจะเจอสัตว์สักตัว */
const critters = [];
let critterSpawnT = 1;
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
/* จุดสุ่มในน้ำ — เลี่ยงใบบัวในบ่อ (เดิมเป็ด/ปลาไปลอยทับใบบัวจนดูซ้อนกัน) */
function awayFromPads(x, z){
  for(let i=0; i<POND_PADS.length; i++){
    const p = POND_PADS[i];
    if(Math.hypot(x - (outWX(p[0])+.2), z - (outWZ(p[1])-.15)) < .95) return false;
  }
  return true;
}
/* สุ่มจุดในบ่อน้ำ (ในวงรีของบ่อจริง เว้นขอบไว้หน่อย และเลี่ยงใบบัว) — ใช้กับเป็ดประจำบ่อ */
function randPondPoint(){
  let x = 0, z = 0;
  for(let i=0; i<10; i++){
    const a = Math.random()*Math.PI*2, r = Math.sqrt(Math.random())*.72;
    x = outWX(POND.cx) + Math.cos(a)*POND.rx*r;
    z = outWZ(POND.cz) + Math.sin(a)*POND.rz*r;
    if(awayFromPads(x, z)) break;
  }
  return {x, z};
}
function randWaterPoint(region){
  let x = 0, z = 0;
  for(let i=0; i<8; i++){
    x = region.xmin + Math.random()*(region.xmax-region.xmin);
    z = region.zmin + Math.random()*(region.zmax-region.zmin);
    if(awayFromPads(x, z)) break;
  }
  return new THREE.Vector3(x, WATER_Y, z);
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
  /* ถ่วงน้ำหนักให้ นก/เป็ด/ปลา ออกบ่อยกว่าสัตว์บก (ผู้ใช้บอกว่าเจอน้อยเกินไป) */
  const types = ['bird','bird','bird','duck','duck','duck','fish','fish','fish',
                 'rabbit','squirrel','chicken','cat'];
  const type = types[(Math.random()*types.length)|0];
  const domain = CRITTER_DOMAIN[type];
  const g = buildCritter(type);
  const c = {type, domain, group:g, tile:null, path:[], seg:0, segT:0, segFrom:null,
             state:'enter', mode:'line', pauseT:0, legs: 5+((Math.random()*5)|0),   /* อยู่ในฉากนานขึ้นก่อนเดินออก */
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
    /* บ่อน้ำมีเป็ดประจำบ่ออยู่แล้ว 2 ตัว → ในบ่อให้เกิดเฉพาะปลา ส่วนเป็ดไปแม่น้ำ/ทะเลแทน
       (ไม่งั้นเป็ดในบ่อจะแน่นและมีทั้งตัวที่อยู่ถาวรกับตัวที่เดี๋ยวก็ว่ายหายไป ดูสับสน) */
    c.water = (type === 'duck')
      ? (r < .7 ? riverWaterRegion() : seaWaterRegion())
      : (r < .45 ? pondWaterRegion() : (r < .85 ? riverWaterRegion() : seaWaterRegion()));
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
    if(FARM_PROPS.some(p => p[0]===x && p[1]===z)) continue;      /* รางน้ำ/เล้าไก่/ฟาง ไม่เดินทับ */
    if(PET_PEN_PROPS.some(p => p[0]===x && p[1]===z)) continue;   /* บ้านหมา/ชามอาหาร/ตะกร้าของเล่นในคอกร้าน */
    out.push({x, z});
  }
  return out;
}
function spawnPenAnimals(){
  penAnimals = [];
  /* face = มุมชดเชยตามทิศที่ "หน้า" ของโมเดลชี้ตอน rotation.y = 0
     สัตว์ฟาร์ม (buildFarmAnimal) หันหน้าไป +x → 0
     สัตว์เลี้ยง (buildPet) หันหน้าไป +z เหมือนสัตว์น้อยในฉาก → +90°
     ถ้าใส่ผิด ตัวสัตว์จะเดินแบบเอียงข้าง (หน้าไม่ตรงทางที่เดิน) */
  const addPenAnimal = (g, x, z, kind, speed, face)=>{
    mergeDecorGroup(g);
    g.children.forEach(m=>{ m.userData.hStatic = true; });     /* แตะโดนแล้วนับเป็นฉาก ไม่ใช่ของวาง */
    g.position.set(outWX(x), 0, outWZ(z));
    g.rotation.y = ((x*3 + z*7) % 4) * Math.PI/2;
    worldGroup.add(g);
    const pen = penAt(x, z);
    penAnimals.push({ g, kind, tiles: pen ? penInnerTiles(pen) : [], face: face || 0,
      speed, wait: .5 + Math.random()*4, to: null, bob: Math.random()*6.28, ph: Math.random()*6.28 });
  };
  FARM_ANIMALS.forEach(([x,z,kind])=>{
    addPenAnimal(buildFarmAnimal(kind), x, z, kind,
      kind==='chick' ? .62 : (kind==='sheep' ? .4 : .34), 0);
  });
  /* สัตว์เลี้ยงที่เด็กเลี้ยงได้ (โมเดลชุดเดียวกับสัตว์เลี้ยงของหนู) เดินเล่นอยู่ในคอกข้างร้านสัตว์เลี้ยง
     — ล้าง userData.hPet ทิ้งก่อน ไม่งั้นตอนแตะจะถูกนับเป็น "สัตว์เลี้ยงของเด็ก" ทั้งที่เป็นของร้าน */
  SHOP_PETS.forEach(([x,z,type,col])=>{
    const pet = buildPet(type, col||0);
    pet.userData = {};                /* ไม่ใช่สัตว์เลี้ยงของเด็ก — ตัด tag hPet ทิ้ง */
    pet.scale.multiplyScalar(.82);    /* เล็กกว่าสัตว์เลี้ยงของหนู — ตัวของเด็กยังเด่นสุด */
    /* ห่อไว้ในกลุ่มนอกที่ไม่มี transform: mergeDecorGroup อบ scale ลงใน geometry ทีเดียว
       (ถ้า scale อยู่ที่กลุ่มนอกเอง จะโดนคูณซ้ำอีกรอบตอน render) */
    const g = new THREE.Group(); g.add(pet);
    addPenAnimal(g, x, z, type, type==='turtle' ? .22 : (type==='chick' ? .6 : .4), Math.PI/2);
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
      let df = Math.atan2(-dz, dx) + a.face - g.rotation.y;    /* หันหน้าไปทางที่เดิน (บวกมุมชดเชยของโมเดล) */
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

/* ---------- สนามเด็กเล่น: วางเครื่องเล่น + ขยับทุกเฟรม + แตะเล่น ----------
   เครื่องเล่นแยกกลุ่มของตัวเอง (ไม่ merge) ติด userData.hPlay ไว้ให้ handleTap เจอ */
let playItems = [];
const PLAY_SEAT_ITEMS = {                       /* ค่า "ที่นั่ง" ของแต่ละเครื่องเล่น (ส่งต่อให้ startSit) */
  swing:  {id:'play-swing',  name:'ชิงช้า',     rock:true, sit:{sy:.74, dz:0, legBend:-.7}},
  /* ry: 180° = นั่งปลายด้าน +z แล้วหันหน้าเข้าหากลางกระดาน (ไม่ใช่หันหลังให้เพื่อน)
     — ชิ้นที่ใส่ ry แบบนี้ โค้ดเอนตัว (frame) จะกลับเครื่องหมายมุมเอนให้เองด้วย cos(ry) ห้ามไปกลับซ้ำที่ rockLean */
  /* กระดานหก: กระดกช่วงแคบกว่าชิงช้ามาก (rockAmp) แล้วตัวเด็กเอียงตามกระดานเต็มร้อย (rockLean 1) */
  seesaw: {id:'play-seesaw', name:'กระดานหก',   rock:true, rockAmp:.5, rockLean:1, sit:{sy:.96, dz:0, legBend:-.8, ry:Math.PI}},
  /* rockLean 1 = ตัวเด็ก "ติดไปกับตัวสัตว์" ทั้งก้อน (เอียงเท่ากันเป๊ะ)
     ถ้าน้อยกว่า 1 ตัวเด็กจะเอียงไม่เท่าตัวสัตว์ ดูเหมือนเอนไปหลัง/มาหน้าสวนกับม้าโยก */
  spring: {id:'play-spring', name:'ม้าโยก',     rock:true, rockAmp:.7, rockLean:1, sit:{sy:.92, dz:0, legBend:-.9}},
  carousel:{id:'play-carousel', name:'ม้าหมุน', spinRide:true, sit:{sy:.58, dz:0}},
  slide:  {id:'play-slide',  name:'สไลเดอร์',  slideRide:true,
           slide:{climbZ:-.62, climbY:1.32, botZ:1.72, botY:.02}},
};
function buildPlayItem(def){
  if(def.kind==='swing')    return buildSwingSet();
  if(def.kind==='slide')    return buildSlide();
  if(def.kind==='carousel') return buildCarousel();
  if(def.kind==='seesaw')   return buildSeesaw();
  if(def.kind==='spring')   return buildSpringRider(def.variant);
  return buildSandbox();
}
function spawnPlayground(){
  playItems = [];
  PLAY_ITEMS.forEach((def, i)=>{
    const g = buildPlayItem(def);
    let cx = 0, cz = 0;
    def.tiles.forEach(t=>{ cx += t[0]; cz += t[1]; });
    cx /= def.tiles.length; cz /= def.tiles.length;
    g.position.set(outWX(cx), 0, outWZ(cz));
    g.rotation.y = (def.rot||0) * Math.PI/2;
    g.userData.hPlay = i;                       /* แตะโดนลูกชิ้นไหนก็ไล่ ancestor มาเจอ index นี้ */
    worldGroup.add(g);
    playItems.push({def, g, item: PLAY_SEAT_ITEMS[def.kind] || null,
      pivs: g.userData.playPivs || [], spin: g.userData.spinPiv || null,
      flag: g.userData.playFlag || null, bounce: g.userData.playBounce || null,
      boost: 0, ph: i * 1.7});
  });
}
function updatePlayground(dt, t){
  for(let i=0;i<playItems.length;i++){
    const it = playItems[i];
    const riding = !!sitState && sitState.group === it.g;      /* กำลังมีเด็กนั่งเล่นอยู่ */
    if(it.boost > 0) it.boost = Math.max(0, it.boost - dt*.55);
    const k = 1 + it.boost*3;                                  /* แตะแล้วขยับแรงขึ้นชั่วครู่ */
    /* ไกว/กระดก/โยกเบาๆ ตอนไม่มีใครเล่น (ตัวที่เด็กนั่งอยู่ ปล่อยให้โค้ดนั่งขับแทน) */
    for(let p=0;p<it.pivs.length;p++){
      const piv = it.pivs[p];
      if(riding && piv === it.g.userData.swingPiv) continue;
      piv.rotation.x = Math.sin(t*.0013 + it.ph + p*2.2) * .1 * k;
    }
    if(it.spin && !riding) it.spin.rotation.y += dt * (.22 + it.boost*2.2);
    if(it.flag) it.flag.rotation.y = Math.sin(t*.004 + it.ph) * .5;
    if(it.bounce){
      const b = it.boost > 0 ? Math.abs(Math.sin(t*.012)) * .12 * it.boost : 0;
      it.bounce.position.y = .13 + b;
      it.bounce.scale.setScalar(1 + b*.5);
    }
  }
}
/* แตะเครื่องเล่น = เดินไปเล่นจริง (ชิ้นที่นั่งได้ → นั่งเล่น, ชิ้นอื่น → ยืนเล่นข้างๆ) */
function tapPlayItem(i){
  const it = playItems[i]; if(!it) return;
  const st = it.def.stand;
  const stand = isWalk(outGrid, OUT_W, OUT_D, st[0], st[1])
    ? {x:st[0], z:st[1]} : nearestWalkable(outGrid, OUT_W, OUT_D, st[0], st[1]);
  if(!stand) return;
  const pos = it.g.position.clone();
  if(it.item && it.item.slideRide)
    walkTo(stand.x, stand.z, {action:{type:'decor', group:it.g, item:it.item, act:'slide', pos}});
  else if(it.item) walkTo(stand.x, stand.z, {action:{type:'decor', group:it.g, item:it.item, act:'sit', pos}});
  else walkTo(stand.x, stand.z, {action:{type:'play', idx:i, pos}});
}
/* ถึงเครื่องเล่นที่นั่งไม่ได้ (สไลเดอร์/บ่อทราย) → เล่นข้างๆ: เครื่องเล่นขยับแรงขึ้น + ประกายดาว */
function playAtItem(i){
  const it = playItems[i]; if(!it) return;
  it.boost = 1;
  const p = it.g.position, cols = [0xffd54f, 0x7fc4e8, 0xff8fb3, 0x8fd694];
  for(let k=0;k<7;k++){
    spawnParticle(p.x + (Math.random()-.5)*1.5, .5 + Math.random()*.9,
                  p.z + (Math.random()-.5)*1.5, cols[k % cols.length]);
  }
  if(typeof playClick==='function') playClick();
  charBubble(['😊','🎵','⭐','🎉'][(Math.random()*4)|0]);
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
    const g = d.mascot ? buildOwlMascot() : d.fisher ? buildFisherNpc() : buildVillager(d.look || {}, animated);
    if(!animated) mergeDecorGroup(g);
    g.position.set(outWX(d.x), d.y || 0, outWZ(d.z));      /* y = คนที่ยืนอยู่บนของ เช่น ลุงตกปลาบนท่าไม้ */
    g.rotation.y = d.faceRad != null ? d.faceRad : (d.rot || 0) * Math.PI/2;
    g.userData.hNpc = d;
    worldGroup.add(g);
    const n = { g, def: d, home: {x:g.position.x, z:g.position.z}, baseRot: g.rotation.y, baseY: d.y || 0,
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
    if(n.route && !(n.faceT > 0) && !(n.hold > 0)){            /* คนเดินทางไกล: เดินตามเส้นทางจริงไปทีละจุดแวะ */
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
    } else if(n.tiles && n.tiles.length && !(n.faceT > 0) && !(n.hold > 0)){           /* คนที่เดินไปมาในกรอบของตัวเอง */
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
      if(!n.owl) g.position.y = n.baseY + Math.abs(Math.sin(t*.008)) * .06;  /* กระโดดเบาๆ ตอนทักทาย (นกฮูกเด้งเองแล้ว) */
      /* หมดเวลาหันหน้าแล้วต้องปัดเป็น 0 เป๊ะ **ทุกคน** — ถ้าปล่อยให้ค้างเป็นค่าติดลบ (เช่น -0.05)
         ค่านั้นยังเป็น truthy เงื่อนไข !n.faceT ของท่อนเดินจึงเป็นเท็จตลอดไป = คุยจบแล้วยืนแข็งไม่เดินอีกเลย
         (เจอกับมาสคอตนกฮูกชัดสุดเพราะเดินได้ทั้งแผนที่) */
      if(n.faceT <= 0) n.faceT = 0;
    } else {
      /* คนมีข้อต่อแล้ว ตัวเด้งน้อยหน่อย (ขาแกว่งช่วยให้ดูเดินอยู่แล้ว) */
      if(!n.owl) g.position.y = n.baseY + (moving ? Math.abs(Math.sin(n.rig ? n.sw : t*.009)) * (n.rig ? .04 : .05) : 0);
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
    critterSpawnT = 1.8 + Math.random()*2.6;
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
          /* โค้งให้สูงพอข้ามหลังคาบ้าน (บ้าน/ร้านสูงราว 3-4 หน่วย) — เดิมโค้งแค่ .9 เลยบินทะลุตัวอาคาร */
          const far = c.group.position.distanceTo(critterTileV(land));
          critterLine(c, c.group.position.clone(), critterTileV(land), 3, Math.min(4.2, 1.6 + far*.42));
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
              sitK:0, bubbleTimer:null,
              rest:null, restT:0};   /* rest = group ของบ้านสัตว์เลี้ยงที่กำลังนอนรออยู่ (null = เดินตามเด็กปกติ) */

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
  hPet.cfg = null; hPet.rest = null; hPet.sitK = 0;
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
  /* แตะตัวที่โผล่ครึ่งตัวอยู่ในบ้านสัตว์เลี้ยง = เรียกออกมาเดินเล่นต่อ (ไม่ต้องเดินไปแตะตัวบ้าน) */
  if(hPet.rest){ if(typeof playClick==='function') playClick(); petLeaveHouse(); return; }
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

/* ---------- นอนรอในบ้านสัตว์เลี้ยง (แตะบ้านสัตว์เลี้ยง = สลับเข้า/ออก) ---------- */
const PET_REST_IN  = ['ไปนอนรอในบ้านนะ', 'เข้าไปพักก่อนนะ', 'นอนรอแป๊บนึงนะ'];
const PET_REST_OUT = ['ออกมาเดินเล่นกัน!', 'มาเดินเล่นด้วยกันนะ', 'ตื่นแล้ว ไปเที่ยวกัน!'];
function pickOne(a){ return a[(Math.random()*a.length)|0]; }

function togglePetRest(g){
  if(!hPet.group){ charBubble('ยังไม่มีสัตว์เลี้ยงเลย 🐾', true); return; }
  if(hPet.rest) petLeaveHouse(); else petEnterHouse(g);
}
/* พาน้องเข้าไปนอนรอ: จอดตรงประตู (ด้านหน้าโมเดล = +z ของ group) ให้ครึ่งตัวหลังจมอยู่ในบ้าน
   ตัวบ้านเป็นกล่องทึบ ส่วนที่จมจึงถูกบังด้วย depth ของ three.js เองโดยไม่ต้องตัดโมเดล */
function petEnterHouse(g){
  hPet.rest = g; hPet.restT = 2.5;
  hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null;
  hPet.beh = null; hPet.happy = 0; hPet.spin = false;
  /* กล้อง iso มองจากมุม +x/+z เสมอ → ต้องจอดน้องไว้ "ด้านที่กล้องมองเห็น" ไม่งั้นไปอยู่หลังบ้านมองไม่เห็นเลย
     (เด็กหมุนบ้านเองได้ในโหมดตกแต่ง) เลือกด้านที่ใกล้ทางประตูจริงที่สุดใน 2 ด้านที่มองเห็น */
  const rot = g.rotation.y, dx = Math.sin(rot), dz = Math.cos(rot);   /* ทิศประตู = +z ของโมเดล */
  const useX = dx >= dz;
  hPet.group.position.set(g.position.x + (useX ? .52 : 0), 0, g.position.z + (useX ? 0 : .47));
  hPet.group.rotation.set(0, useX ? Math.PI/2 : 0, 0);
  charBubble(pickOne(PET_REST_IN), true);
  setTimeout(()=>{ if(hPet.group && hPet.rest && houseOpen) petBubble('💤'); }, 700);
}
/* เรียกออกมาเดินตามต่อ — เซ็ต tile ให้ตรงกับช่องเดินได้ที่ใกล้ประตูที่สุด path ต่อไปจะได้ไม่วาร์ป */
function petLeaveHouse(quiet){
  if(!hPet.rest) return;
  hPet.rest = null;
  const {grid,W,D} = curGridInfo();
  const p = hPet.group.position;
  const t = nearestWalkable(grid, W, D, Math.round(p.x + (OUT_W-1)/2), Math.round(p.z + (OUT_D-1)/2));
  if(t) hPet.tile = {x:t.x, z:t.z};
  hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null;
  hPet.sitK = 0; hPet.beh = null; hPet.repathT = 0;
  hPet.group.rotation.x = 0;
  if(quiet) return;
  charBubble(pickOne(PET_REST_OUT), true);
  petHappy(.9, false);
  petBubble('❤️');
}
/* อยู่ในบ้าน: นั่งเอนตัว หายใจขึ้นลงช้าๆ แล้วปล่อย 💤 เป็นระยะ (ไม่เดินตามเด็ก) */
function updatePetRest(dt){
  if(!hPet.rest.parent){ petLeaveHouse(true); return; }   /* บ้านถูกย้าย/เก็บระหว่างนอนรอ */
  const u = hPet.group.userData.anim || {}, type = hPet.cfg.type;
  hPet.sitK += (1 - hPet.sitK) * Math.min(1, dt*6);
  if(type==='turtle'){ if(u.head) u.head.scale.setScalar(1 - hPet.sitK*.75); }
  else hPet.group.rotation.x = -.42 * hPet.sitK;
  hPet.group.position.y = hPet.sitK*.04 + Math.sin(hPet.t*1.6)*.015;
  if(u.tail) u.tail.rotation.z = Math.sin(hPet.t*2.2)*.18;
  hPet.restT -= dt;
  if(hPet.restT <= 0){ hPet.restT = 6 + Math.random()*5; petBubble('💤'); }
}

function updatePet(dt){
  if(!hPet.group || hMode!=='world') return;
  hPet.t += dt;
  if(hPet.rest){ updatePetRest(dt); return; }
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
  if(SHOP) SHOP.close();
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
  $('house-pet-btn').hidden = true; $('house-decorate-btn').hidden = true; $('house-child-chip').hidden = true;
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
  $('house-pet-btn').hidden = false; $('house-decorate-btn').hidden = false; $('house-child-chip').hidden = false;
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
/* ---------- ป้ายยอดเงินนกฮูกท้ายแถวปุ่มบน (ต่อจากปุ่มตกแต่งบ้าน) ----------
   ตัวเลขมาจาก window.OwlCoins (js/app-core.js) — เด็กแต่ละคนมียอดของตัวเอง เริ่มที่ 0
   โชว์เฉพาะตอนเดินเล่นในโหมดบ้าน (ไม่โชว์ตอนสร้างตัวละคร/เลือกสัตว์เลี้ยง/โหมดตกแต่ง) */
let coinShownVal = null;
function updateCoinBadge(){
  const el = $('house-coins');
  if(!el) return;
  const show = houseOpen && hMode==='world' && !editMode && charGroup;
  if(!show){ if(!el.hidden){ el.hidden = true; coinShownVal = null; } return; }
  el.hidden = false;
  const n = (window.OwlCoins ? window.OwlCoins.get() : 0);
  if(n === coinShownVal) return;                       /* ค่าเท่าเดิม ไม่ต้องแตะ DOM ทุกเฟรม */
  const first = coinShownVal === null;
  coinShownVal = n;
  const num = $('house-coins-num');
  if(num) num.textContent = n.toLocaleString('th-TH');
  if(!first){                                          /* เด้งหนึ่งครั้งตอนยอดเปลี่ยน (ไม่เด้งตอนเพิ่งเปิดป้าย) */
    el.classList.remove('coin-bump');
    void el.offsetWidth;                               /* บังคับ reflow ให้ animation เล่นซ้ำได้ */
    el.classList.add('coin-bump');
  }
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
  g.userData.animParts = collectDecorAnim(g);   /* ชิ้นส่วนที่ขยับเองตลอด (ธง/กังหัน/น้ำพุ/ไฟกะพริบ) */
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
  /* rot:0 = ประตูหันไปทาง +z ทิศเดียวกับประตูบ้านเด็ก (ทางเดินหน้าบ้านก็ทอดไป +z) และเป็นด้านที่
     กล้อง iso มองเห็น (ของเดิม rot:3 ประตูหันหลังให้กล้อง เด็กไม่เห็นทั้งประตูและตัวที่เข้าไปนอนรอ) */
  seed.push({id:'pet-house', x:PET_HOUSE_TILE.x, z:PET_HOUSE_TILE.z, rot:0, col:0});
  /* แผ่นทางเดินหน้าประตู (ลอดช่องประตูรั้ว) — ย้าย/ลบได้ */
  for(let i=0;i<4;i++) seed.push({id:'path', x:DOOR_TILE.x, z:DOOR_TILE.z+i, rot:0, col:0});
  decor.out = seed.concat(decor.out || []);
  /* เฟส 1: บ้านมาพร้อม "ชุดเฟอร์นิเจอร์มาตรฐาน" วางให้เรียบร้อยตั้งแต่เปิดครั้งแรก
     (เปิดบ้านครั้งแรกต้องเจอบ้านที่อยู่ได้จริง ไม่ใช่ห้องโล่ง) — ย้าย/หมุน/ลบได้ตามปกติ
     ลบแล้วไม่ได้เงินคืน แต่ยังมีสิทธิ์ หยิบกลับมาวางฟรีได้เสมอ
     ⚠ ทำเฉพาะบ้านที่ยังไม่เคย seed เท่านั้น — บ้านของเด็กที่เล่นอยู่แล้วห้ามถูกจัดใหม่ทับ */
  decor.in = starterHomeRecs().concat(decor.in || []);
  saveHouseData({decor, worldSeeded:true});
}
/* ชุดเฟอร์นิเจอร์มาตรฐาน 8 ชิ้น พร้อมตรวจว่าวางลงจริงได้ทุกชิ้น
   (พิกัดใน js/house-shop.js ผูกกับผังห้องปัจจุบัน — ถ้าวันหลังขยับกำแพง/ประตู
    ชิ้นที่วางไม่ลงจะถูกย้ายไปช่องว่างที่ใกล้ที่สุดแทนที่จะหายไปเฉยๆ) */
function starterHomeRecs(){
  if(!SHOP) return [];
  const placed = [];
  SHOP.starterHome().forEach(r=>{
    const item = FURN.byId[r.id]; if(!item) return;
    let x = r.x, z = r.z;
    if(inGridBase && !decorCanPlaceAmong('in', item, {x, z}, r.rot, placed)){
      const alt = findFreeAnchorAmong('in', item, r.rot, placed);
      if(!alt) return;
      x = alt.x; z = alt.z;
    }
    placed.push({id:r.id, x, z, rot:r.rot, col:r.col});
  });
  return placed;
}
/* เวอร์ชันของ decorCanPlace/findFreeAnchor ที่นับชิ้นในลิสต์ที่กำลังจะวางด้วย
   (ตอน seed ยังไม่มี decorGroups ให้เทียบ ต้องกันชิ้นในชุดเดียวกันทับกันเอง) */
function decorCanPlaceAmong(sc, item, anchor, rot, others){
  if(!decorCanPlace(sc, item, anchor, rot)) return false;
  const tiles = footTiles(item, anchor, rot);
  return !others.some(o=>{
    const oi = FURN.byId[o.id]; if(!oi || oi.block===false || item.block===false) return false;
    return footTiles(oi, {x:o.x, z:o.z}, o.rot).some(b=>tiles.some(a=>a.x===b.x && a.z===b.z));
  });
}
function findFreeAnchorAmong(sc, item, rot, others){
  const W = sc==='out' ? OUT_W : IN_W, D = sc==='out' ? OUT_D : IN_D;
  for(let z=0; z<D; z++) for(let x=0; x<W; x++){
    if(decorCanPlaceAmong(sc, item, {x, z}, rot, others)) return {x, z};
  }
  return null;
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
  if(SHOP) SHOP.close();          /* กดตกแต่งบ้านทั้งที่ยืนอยู่ในร้าน → ปิดหน้าร้านก่อน */
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
    /* เฟส 1: ของที่ยังไม่ได้ซื้อ **ยังโชว์อยู่** (สีจาง + ป้ายราคา) ไม่ซ่อน — ให้เด็กเห็นเป้าหมาย
       แตะแล้วบอกว่าไปซื้อได้ที่ไหน ไม่ใช่เงียบเฉยจนนึกว่าแอปเสีย */
    const locked = SHOP ? !SHOP.ownsFurn(it.id) : false;
    b.className = 'he-item' + (locked ? ' he-locked' : '');
    b.innerHTML = '<span class="he-item-emoji">'+it.emoji+'</span><span class="he-item-name">'+it.name+'</span>'
                + (locked ? '<span class="he-item-price"><i class="hs-coin"></i>'+SHOP.priceFurn(it.id)+'</span>' : '');
    b.onclick = locked
      ? ()=>{ if(typeof playClick==='function') playClick();
              if(typeof showToast==='function') showToast('🛋️', it.name+' ยังไม่มีนะ ไปซื้อได้ที่ห้างเฟอร์นิเจอร์ในเมือง!'); }
      : ()=>addDecorItem(it.id);
    wrap.appendChild(b);
  });
  const rb = $('house-reset-home');
  if(rb) rb.hidden = (hScene !== 'in');   /* ปุ่มจัดบ้านกลับแบบเดิม โชว์เฉพาะตอนตกแต่งในบ้าน */
  positionToolbar();   /* จำนวนของต่อหมวดต่างกัน → panel สูงเปลี่ยน → เลื่อน toolbar ตาม */
}
/* ปุ่ม "จัดบ้านกลับแบบเดิม" — วางชุดเฟอร์นิเจอร์มาตรฐานที่หายไปกลับเข้าที่เดิม
   **ไม่ลบของที่เด็กจัดเอง** (กติกาเหล็ก: ห้ามทำข้อมูลเด็กหาย) ชิ้นไหนยังมีอยู่ก็ปล่อยไว้ที่เดิม */
function resetHomeSet(){
  if(typeof playClick==='function') playClick();
  if(!SHOP || hScene!=='in') return;
  const have = new Set(decorGroups.in.map(g=>g.userData.deco.rec.id));
  let added = 0;
  SHOP.starterHome().forEach(r=>{
    if(have.has(r.id)) return;
    const item = FURN.byId[r.id]; if(!item) return;
    const spot = decorCanPlace('in', item, {x:r.x, z:r.z}, r.rot) ? {x:r.x, z:r.z} : findFreeAnchor('in', item, r.rot);
    if(!spot) return;
    const rec = {id:r.id, x:spot.x, z:spot.z, rot:r.rot, col:r.col};
    const g = buildDecorGroup('in', rec);
    if(!g) return;
    interiorGroup.add(g); decorGroups.in.push(g);
    added++;
  });
  if(added){
    rebuildDecorGrid('in'); saveDecor();
    if(typeof showToast==='function') showToast('🏡','จัดของกลับให้แล้ว '+added+' ชิ้น');
  }else{
    if(typeof showToast==='function') showToast('✓','ของชุดเริ่มต้นอยู่ครบแล้วนะ');
  }
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
  /* ม้าหมุน: จานหมุนรอบแกน y พาเด็กหมุนไปด้วย (ตัวตั้งตรง ไม่เอนเหมือนชิงช้า) */
  if(item.spinRide && g.userData.spinPiv && g.userData.spinSeat){
    sitState.spin = {piv:g.userData.spinPiv, anc:g.userData.spinSeat};
  }
  charBubble(act==='sleep' ? '💤' : (Math.random()<.5?'😊':'🎵'));
}
function endSit(){
  if(sitState && sitState.swing) sitState.swing.piv.rotation.x = 0;   /* คืนชิงช้าให้หยุดนิ่ง */
  sitState = null;
  /* ไม่ snap ท่าทันที — ปล่อยให้ loop lerp rotation.x→0 (บรรทัด trx) + position.y→0 (idle) ให้ลุก/ยืนนุ่มนวล */
  const hb = $('house-char-bubble'); if(hb) hb.classList.remove('on');
}
/* ---------- เล่นสไลเดอร์: ปีนขึ้นชาน → ลื่นลงราง → ลงพื้นดีใจ ----------
   ใช้ได้กับทั้งสไลเดอร์ในสนามเด็กเล่นและสไลเดอร์ที่เด็กวางเองในบ้าน (action:'slide' ในคลังเฟอร์นิเจอร์)
   ค่าพิกัดจุดขึ้น/จุดลงเป็น "พิกัดในตัวชิ้น" (แกน z ของชิ้น) แล้วหมุนตามทิศที่วางจริง */
let slideRide = null;
const SLIDE_DEF = {climbZ:-.6, climbY:1.0, botZ:1.1, botY:.02};
function startSlideRide(g, item){
  if(!charGroup) return;
  const cf = Object.assign({}, SLIDE_DEF, item.slide || {});
  const ry = g.rotation.y, cs = Math.cos(ry), sn = Math.sin(ry);
  const at = (lz, y) => new THREE.Vector3(g.position.x + lz*sn, y, g.position.z + lz*cs);
  slideRide = {
    ph: -1, t: 0,                                  /* -1 = เดินอ้อมไปยืนหลังบันไดก่อน แล้วค่อยปีน */
    from: charGroup.position.clone(),
    foot: at(cf.climbZ - .95, 0),                  /* ตีนบันได (ด้านหลังของชิ้น) */
    deck: at(cf.climbZ, cf.climbY),
    top:  at(cf.climbZ + .35, cf.climbY - .3),
    bot:  at(cf.botZ, cf.botY),
    ry,
  };
  hChar.targetRotY = ry;                      /* หันหน้าไปทางปลายราง (+z ของชิ้น) */
  charBubble('🛝');
  if(typeof playClick==='function') playClick();
}
function updateSlideRide(dt, t, u){
  const r = slideRide;
  r.t += dt;
  if(r.ph === -1){                            /* เดินอ้อมไปที่ตีนบันไดด้านหลังก่อน (ไม่ปีนจากด้านข้าง/ด้านหน้า) */
    const k = Math.min(1, r.t/.55), e = k*k*(3-2*k);
    charGroup.position.lerpVectors(r.from, r.foot, e);
    charGroup.position.y = 0;
    if(u){
      const sw = Math.sin(t*.016)*.5;
      u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw;
      u.arms[0].rotation.x = -sw*.8; u.arms[1].rotation.x = sw*.8;
    }
    if(k >= 1){ r.ph = 0; r.t = 0; r.from = charGroup.position.clone(); }
    return;
  }
  if(r.ph === 0){                             /* ปีนบันไดขึ้นชาน (ยกแขนสลับขา) */
    const k = Math.min(1, r.t/.8), e = k*k*(3-2*k);
    charGroup.position.lerpVectors(r.from, r.deck, e);
    charGroup.position.y = r.from.y + (r.deck.y - r.from.y) * e;
    if(u){
      const sw = Math.sin(t*.018)*.5;
      u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw;
      u.arms[0].rotation.x = -1.1 + sw*.3; u.arms[1].rotation.x = -1.1 - sw*.3;
    }
    if(k >= 1){ r.ph = 1; r.t = 0; }
    return;
  }
  if(r.ph === 1){                             /* นั่งลงหัวราง เตรียมลื่น */
    const k = Math.min(1, r.t/.28);
    charGroup.position.lerpVectors(r.deck, r.top, k);
    if(u){ u.legs[0].rotation.x = -1.3; u.legs[1].rotation.x = -1.3;
           u.arms[0].rotation.x = -.4;  u.arms[1].rotation.x = -.4; }
    if(k >= 1){ r.ph = 2; r.t = 0; }
    return;
  }
  if(r.ph === 2){                             /* ลื่นลง (เร่งความเร็วช่วงท้าย) + ประกายดาวตอนถึงพื้น */
    const k = Math.min(1, r.t/.62);
    charGroup.position.lerpVectors(r.top, r.bot, k*k);
    if(u){ u.legs[0].rotation.x = -1.35; u.legs[1].rotation.x = -1.35;
           u.arms[0].rotation.x = -.55;  u.arms[1].rotation.x = -.55; }
    if(k >= 1){
      r.ph = 3; r.t = 0;
      const cols = [0xffd54f,0x7fc4e8,0xff8fb3,0x8fd694];
      for(let i=0;i<7;i++) spawnParticle(r.bot.x + (Math.random()-.5)*.8, .25 + Math.random()*.7,
                                         r.bot.z + (Math.random()-.5)*.8, cols[i % cols.length]);
      charBubble(['🎉','😄','⭐'][(Math.random()*3)|0]);
      questEvent('sit', null);
    }
    return;
  }
  /* จบ: ยืนขึ้นที่ช่องเดินได้ใกล้ปลายราง แล้วคืนการควบคุมให้ระบบเดินปกติ */
  const {grid, W, D} = curGridInfo();
  const gx = Math.round(r.bot.x + (W-1)/2), gz = Math.round(r.bot.z + (D-1)/2);
  const w = isWalk(grid, W, D, gx, gz) ? {x:gx, z:gz} : nearestWalkable(grid, W, D, gx, gz);
  if(w){
    hChar.tile = {x:w.x, z:w.z}; hChar.segFrom = {x:w.x, z:w.z};
    charGroup.position.copy(tileWorld(w));
  }
  slideRide = null;
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
/* say=true → เป็นประโยคไทย ไม่ใช่ emoji เดี่ยว ใส่คลาส .say ให้ย่อฟอนต์+ตัดบรรทัด ฟองจะได้ไม่ยาวล้นจอ */
function charBubble(txt, say){
  const hb = $('house-char-bubble'); if(!hb) return;
  hb.textContent = txt;
  hb.classList.toggle('say', !!say);
  hb.classList.add('on');
  clearTimeout(charBubble._t);
  charBubble._t = setTimeout(()=>hb.classList.remove('on'), say ? 2200 : 1600);
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
    if(slideRide){ updateSlideRide(dt, t, u); }
    else if(gettingUp){
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
          /* ชิงช้าโยก: แกว่ง pivot + ตัวละครแกว่งตามที่นั่ง + เอนตัวตามจังหวะ
             rockAmp = ความกว้างการโยกของชิ้นนั้น (1 = ชิงช้าเต็มสวิง ±29°) */
          const amp = (sitState.item.rockAmp != null) ? sitState.item.rockAmp : 1;
          const ang = Math.sin(t*.003)*0.5*amp;
          sitState.swing.piv.rotation.x = ang;
          /* ตัวเครื่องเล่นกระดกรอบ "แกน x ของตัวชิ้น" แต่ตัวเด็กเอนรอบ "แกน x ของตัวเด็กเอง"
             ถ้าเด็กนั่งหันหลังกลับด้าน (sit.ry = 180° เช่นกระดานหก ที่ต้องหันหน้าเข้าหากลางกระดาน)
             แกนสองอันชี้สวนทางกัน มุมเดียวกันจึงกลายเป็นเอนคนละทาง — เห็นเป็น "ลอยขึ้นแล้วเอนไปหลัง
             ลงต่ำแล้วซบมาหน้า" ต้องคูณ cos(sit.ry) กลับเครื่องหมายให้ตัวเด็กติดไปกับกระดานจริงๆ */
          const _lf = (sitState.item.rockLean != null) ? sitState.item.rockLean : 1;
          const _sr = (sitState.item.sit && sitState.item.sit.ry) || 0;
          const _le = ang * _lf * Math.cos(_sr);
          sitState.swingLean = _le;
          sitState.swing.anc.getWorldPosition(_swingV);
          /* จุดกำเนิดตัวละคร = ฝ่าเท้า ส่วน "สะโพก" อยู่สูงขึ้นมา .4 — เวลาตัวเอน ถ้าลบ .4 ตรงแกน y เฉยๆ
             สะโพกจะเลื่อนหลุดจากเบาะ .4·sin(มุมเอน) มองแล้วเหมือนตัวเด็กหลุดจากที่นั่ง
             จึงต้องลบตามแนว "แกนตั้งของตัวเด็กหลังเอน" (คิดทิศจากหน้าที่เด็กหันจริง) สะโพกจะติดเบาะตลอด */
          const _lsin = 0.4*Math.sin(_le);
          _swingV.x -= _lsin*Math.sin(sitState.ry);
          _swingV.y -= 0.4*Math.cos(_le);
          _swingV.z -= _lsin*Math.cos(sitState.ry);
          charGroup.position.lerp(_swingV, Math.min(1, dt*12));
        }else if(sitState.spin){
          /* ม้าหมุน: หมุนจาน + ตัวเด็กเกาะที่นั่งหมุนตามไปรอบๆ (หันหน้าออกนอกวง) */
          sitState.spin.piv.rotation.y += dt * 1.15;
          sitState.spin.anc.getWorldPosition(_swingV);
          _swingV.y -= 0.4;
          charGroup.position.lerp(_swingV, Math.min(1, dt*12));
          /* พนักพิงของที่นั่งอยู่ "ด้านนอกวง" → เด็กต้องนั่งพิงพนักหันหน้าเข้าหาเสากลาง
             (φ + 90° = หันออกนอกวง, บวก 180° อีกที = หันเข้าใน) */
          hChar.targetRotY = sitState.spin.piv.rotation.y - Math.PI/2;
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
    if(slideRide && slideRide.ph >= 1 && slideRide.ph <= 2) trx = -.3;   /* เอนหลังตอนนั่งลื่นลงราง */
    else if(sitState && sitState.act==='sleep') trx = -(sitState.recline!=null ? sitState.recline : Math.PI/2);
    /* swingLean คิด rockLean + ทิศที่เด็กหันมาแล้วตั้งแต่ตอนวางตัวลงที่นั่ง ใช้เป็นมุมเอนได้เลย */
    else if(sitState && sitState.swing) trx = sitState.swingLean || 0;
    else if(sitState && sitState.act==='sit' && sitState.item.sit && sitState.item.sit.lean!=null) trx = sitState.item.sit.lean;  /* นั่งเอนหลังตามพนักพิง (เก้าอี้ผ้าใบ) */
    if(sitState && sitState.swing) charGroup.rotation.x = trx;
    else charGroup.rotation.x += (trx - charGroup.rotation.x) * Math.min(1, dt*5);   /* เอน/นอน/ลุก ค่อยๆ พลิก (นุ่มขึ้น) */
    /* กล้องตามตัวละคร (ยกเว้นตอนตกแต่ง — ปล่อยให้แพนกล้องอิสระ, กลับหาตัวละครเองตอนออก) */
    if(!editMode) camTarget.lerp(charGroup.position, Math.min(1, dt*4));
    applyCamera();
    updateCritters(dt, t);
    updatePenAnimals(dt, t);
    updatePlayground(dt, t);
    updateNpcs(dt, t);
    updateFountainFx(t, dt);
    updatePoolFx(t, dt);
    updateSceneryFx(t, dt);
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
  updateCoinBadge();
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
  setHouseCtrlOpen(false);        /* เข้าบ้านใหม่ทุกครั้ง เริ่มที่เฟืองพับไว้เสมอ */
  houseSyncChild();
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
    $('house-pet-btn').hidden = false; $('house-decorate-btn').hidden = false; $('house-child-chip').hidden = false;
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
  if(SHOP) SHOP.close();
  if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
  document.body.classList.remove('house-open');
  $('house-char-name').hidden = true;
  $('house-pet-name').hidden = true;
  $('house-compass').hidden = true;
  $('house-child-chip').hidden = true;
  { const cb = $('house-coins'); if(cb){ cb.hidden = true; coinShownVal = null; } }
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
    if(!h || !s) return;
    const ic = h.querySelector('.hc-ic'), lb = h.querySelector('.hc-label');
    (ic || h).innerHTML = s.innerHTML;                          /* เขียนทับเฉพาะช่องไอคอน ป้ายข้อความคงไว้ */
    /* ป้ายข้อความคงที่เกือบทุกปุ่ม (บอกว่าปุ่มนี้คืออะไร) — มีแค่ปุ่มธีมที่ต้องสลับคำ กลางวัน/กลางคืน
       สถานะเปิด/ปิดของเพลงกับเสียงดูจากขีดแดงทับไอคอน + ข้อความจาง ไม่ต้องเปลี่ยนคำ (คำยาวเกินปุ่มบนจอแคบ) */
    if(lb && h.dataset.syncLabel && s.dataset.tooltip) lb.textContent = s.dataset.tooltip;
    h.classList.toggle('muted', s.classList.contains('muted'));      /* คัดมาเฉพาะสถานะปิดเสียง — ก๊อบ className ทั้งก้อนจะลบ class ป้ายทิ้ง */
  });
}
/* ปุ่มเฟือง: พับ/กางแถวปุ่มควบคุม (เริ่มต้นพับไว้ มุมขวาบนจะได้เหลือแค่เฟืองปุ่มเดียว) */
function setHouseCtrlOpen(open){
  const list = $('house-ctrl-list'), gear = $('house-ctrl-gear');
  if(!list || !gear) return;
  list.hidden = !open;
  gear.setAttribute('aria-expanded', open ? 'true' : 'false');
}
$('house-ctrl-gear').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  setHouseCtrlOpen($('house-ctrl-list').hidden);
});

/* ---------- ป้ายชื่อเด็ก (child chip) ในโหมดบ้าน ----------
   proxy ของ #child-chip-group ใน header เหมือนกัน — ก๊อบ emoji/ชื่อจาก chip จริง
   (ไม่อ่าน activeChild ตรงๆ เพื่อให้เพี้ยนไม่ได้ถ้าวันหลังเปลี่ยนรูปแบบชื่อใน header)
   app-core.js เรียกฟังก์ชันนี้ท้าย updateHeaderChild() ทุกครั้ง → แก้ชื่อ/emoji จากในบ้าน
   แล้วป้ายบนหัวตัวละครกับ chip อัปเดตตามทันทีโดยไม่ต้องออกจากบ้าน */
function houseSyncChild(){
  const chip = $('house-child-chip'); if(!chip) return;
  const em = $('header-child-emoji'), nm = $('header-child-name');
  const hasChild = !$('child-chip-group').hidden;
  $('house-child-emoji').textContent = em ? em.textContent : '';
  $('house-child-name').textContent  = nm ? nm.textContent : '';
  if(nm) $('house-char-name').textContent = nm.textContent;
  /* ระหว่างสร้าง/แก้ตัวละคร แผงสัตว์เลี้ยง หรือโหมดตกแต่ง ปุ่มบนถูกซ่อนอยู่ — อย่าแอบโชว์กลับมา */
  chip.hidden = !hasChild || !houseOpen || hMode !== 'world' || editMode;
}
window.houseSyncChild = houseSyncChild;

/* ---------- bind ปุ่ม ---------- */
/* app.js โหลดไฟล์นี้แบบ lazy ตอนกดเข้าบ้านครั้งแรก จึง expose ให้เรียกจากภายนอกได้
   และผูก listener ของตัวเองไว้สำหรับการกดครั้งต่อๆ ไป */
window.startHouseGame = startHouseGame;
/* ร้านค้า/คลังสิทธิ์ — เปิดออกมาให้ไฟล์อื่นเรียกได้ (เฟส 2 เควสต์จะจ่ายเหรียญ/เช็คสิทธิ์ผ่านตัวนี้)
   และให้ชุดเทสเปิดหน้าร้านตรงๆ ได้โดยไม่ต้องพาเด็กเดินข้ามเมืองไปหน้าห้างก่อน */
window.HouseShop = SHOP;
$('house-entry-btn').addEventListener('click', startHouseGame);
$('hq-close').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); closeQuestBoard(); });
$('hq-claim').addEventListener('click', claimQuestReward);
/* ปุ่มกลับ (←): ถ้าเปิดแผงอะไรค้างอยู่ = "ยกเลิก" กลับไปหน้าเกมก่อน ยังไม่ออกจากบ้าน
   ยกเว้นตอนสร้างตัวละครครั้งแรก (ยังไม่มีตัวละคร/โลกให้กลับไป) ให้ออกจากบ้านเหมือนเดิม */
$('house-back').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(editMode){ exitEditMode(); return; }
  if(hMode==='pet'){ fadeSwap(()=>closePetPicker(null)); return; }
  if(hMode==='creator' && creatorState.fromWorld){ fadeSwap(()=>cancelCreator()); return; }
  stopHouseGame();
});
$('house-edit-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode!=='creator') fadeSwap(()=>openCreator(true));
});
$('house-decorate-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode==='world' && !editMode) enterEditMode();
});
/* ป้ายชื่อเด็ก: กดชื่อ = ออกจากบ้านก่อนแล้วไปหน้าเลือกเด็ก (ปล่อยให้ปุ่มจริงจัดการต่อ
   ถ้าไม่ stop ก่อน ฉาก 3D จะยังวน rAF อยู่เบื้องหลังทั้งที่ view ถูกซ่อนไปแล้ว)
   กดดินสอ = เปิด modal แก้ชื่อ/emoji ตัวเดิม (z-index สูงกว่าโหมดบ้าน ใช้ทับได้เลย) */
$('house-child-btn').addEventListener('click', ()=>{
  stopHouseGame();
  $('switch-child-btn').click();
});
$('house-child-edit-btn').addEventListener('click', ()=> $('header-edit-emoji-btn').click());
$('house-compass').addEventListener('click', compassGoHome);
$('house-edit-done').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); exitEditMode(); });
$('house-edit-rotate').addEventListener('click', rotateSel);
$('house-edit-delete').addEventListener('click', deleteSel);
{ const rb = $('house-reset-home'); if(rb) rb.addEventListener('click', resetHomeSet); }
{ const sc = $('house-shop-close');
  if(sc) sc.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); if(SHOP) SHOP.close(); }); }
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
/* DEBUG-TEMP */ window.__houseDbg = {tp:(x,z)=>{ charGroup.position.set(outWX(x),0,outWZ(z)); }, grid:()=>outGrid};
})();
