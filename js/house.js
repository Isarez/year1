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
const HM = HOUSE_MAP({ inBox });
const {
  H_SKIN, H_HAIR_COLORS, H_EYE_COLORS, H_SHIRT_COLORS, H_BOTTOM_COLORS, H_SHOE_COLORS, H_ACC_COLORS,
  H_PATTERN_N, H_HAT_N, H_GLASS_N, H_BAG_N, H_HOLD_N,
  H_HAIR_N, H_EYE_N, H_DEFAULT_CHAR, H_DEFAULT_PARENT_DAD, H_DEFAULT_PARENT_MOM, H_ROWS, H_ROW_ICONS, NPAD,
  outfitIcon,   /* เฟส 8C: ไอคอนของแต่ละแบบในหน้าแต่งตัว — อยู่ใน IIFE ของไฟล์นี้ ต้องส่งออกทางนี้เท่านั้น */
  EPAD, EPAD2, EPAD_ALL, OUT_W, OUT_D, sx,
  sz, sRect, sTile, sList, s2z, s2Rect,
  s2Tile, s2List, RIVER_X, BRIDGE_Z, BRIDGE2_Z, FARM_BRIDGE_Z,
  BRIDGES, HOUSE_FOOT, DOOR_TILE, SPAWN_TILE, TREES, FLOWERS,
  YARD, GATE_TILE, GATE_TILES, PET_HOUSE_TILE, HOUSE_VIEW, HOME_ZONE, HOME_EDGE_Z,
  HOME_EXIT_X, VILLAGE_X0, VILLAGE_ROADS, VILLAGE2_ROADS, PLAZA, FOUNTAIN,
  VILLAGE_LOTS, LOT_BY_ID, WILD_GROVES, WILD_BUSHES, WILD_MUSHROOMS, POND,
  CANAL_Z, CANAL_X0, CANAL_X1, CANAL_BRIDGE_X, FARM_PLOTS, FARM_TRAIL,
  SEA_X0, SEA_SLOPE, SEA_MAX_Z, SEA_BASE_Z, BEACH_W, PALM_SPOTS,
  BOAT_SPOTS, BEACH_RACKS, FISH_RACKS, ANIMAL_PENS, FARM_ANIMALS, FARM_PROPS, FIXED_PLANTS,
  SHOP_PETS, PET_PEN_PROPS, FOOD_SIGN, POT_SPOTS,
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
} = HM;

function isSceneryPropTile(x, z){
  const hit = a => a.some(p => p[0]===x && p[1]===z);
  if(inMarket(x, z)) return true;               /* ลานตลาด: ของฉากสุ่ม (ต้นไม้/พุ่ม/เห็ด) ห้ามงอกแทรกกลางตลาด */
  return hit(BENCH_SPOTS) || hit(CART_SPOTS) || hit(FARM_PROPS) || hit(BANNER_POLES) || hit(FISH_RACKS)
      || hit(NPC_STAND) || isQuestBoardTile(x, z) || inFlowerBed(x, z) || hit(CARPENTER_PROPS)
      || inPool(x, z) || hit(POOL_PROPS)
      || (x===SCHOOL_FLAG.x && z===SCHOOL_FLAG.z) || isSchoolFenceTile(x, z)
      || (x>=STAGE.x0 && x<=STAGE.x1 && z>=STAGE.z0 && z<=STAGE.z1)
      || isLampTile(x, z) || isHedgeTile(x, z)   /* เสาไฟ/แนวพุ่มไม้จองช่องไว้ ของฉากสุ่มห้ามงอกทับ */
      || hit(CAMP_PROPS) || hit(POT_SPOTS) || (x===CAMP_FIRE.x && z===CAMP_FIRE.z);
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

/* ---------- ห้องในบ้าน (14×14 แบ่ง 4 ห้อง ขนาดสมส่วนตามการใช้งาน) ----------
   **ย่อจาก 20×14 เมื่อ 2026-08-07** ตามคำขอผู้ใช้ (บ้านเดิมกว้างเกิน เดินข้ามห้องนาน ของดูโล่ง):
   นั่งเล่น/นอน หด 4 คอลัมน์ · ครัว/น้ำ หด 2 คอลัมน์ ⇒ IN_W 20 → 14 (ความลึก IN_D คงเดิม)
   กำแพงกั้นแนวนอนที่ z=7 + แนวตั้ง "คนละแนว" บน/ล่าง (กำแพงสูง 1.15 มองข้ามได้ ไม่บังตัวละคร)
   ├ ห้องนั่งเล่น (x0-7, z0-6 ใหญ่สุด มีประตูเข้าบ้าน)  ├ ห้องครัว (x9-13, z0-6 กลาง)
   ├ ห้องนอน (x0-8, z8-13 ใหญ่รอง)                    ├ ห้องน้ำ (x10-13, z8-13 เล็กสุด)
   ช่องประตูระหว่างห้อง: แถว z=7 เว้น x 3-4 (นั่งเล่น↔นอน) และ x 11-12 (ครัว↔น้ำ)
   คอลัมน์บน x=8 เว้น z 2-3 (นั่งเล่น↔ครัว), คอลัมน์ล่าง x=9 เว้น z 10-11 (นอน↔น้ำ)
   ⚠ แก้เลขพวกนี้ต้องไล่แก้ 3 จุดที่ผูกกันด้วย: ช่องประตูให้ตรงกับห้องที่มันเชื่อม,
     ตำแหน่งหน้าต่างบนผนังใน `buildInterior`, และผัง `STARTER_HOME` ใน js/house-shop.js */
const IN_W = 14, IN_D = 14;
const IN_DOOR_TILE = {x:4, z:0};
const IN_WALL_ROW = 7;
/* กำแพงแนวตั้งครึ่งบน/ครึ่งล่าง คนละแนว ให้ขนาดห้องต่างกัน
   (ครึ่งล่างเลื่อนจาก x=10 → x=9 เมื่อ 2026-08-07 ตามคำขอผู้ใช้ ⇒ ห้องน้ำกว้างขึ้นเป็น 4 คอลัมน์) */
const IN_COL_TOP = 8, IN_COL_BOT = 9;
const IN_ROW_GAPS = [3,4,11,12];
const IN_COL_TOP_GAPS = [2,3], IN_COL_BOT_GAPS = [10,11];
/* สีพื้นแต่ละห้อง (คู่สลับ checker อ่อน/เข้ม) ให้เด็กแยกห้องออกด้วยสายตา
   **ปรับครัว/ห้องน้ำเมื่อ 2026-08-07** — ของเดิม (ฟ้าสด/มินต์สด) สว่างจ้าตัดกับผนังครีม+พื้นไม้
   จนดูไม่เหมือนบ้านหลังเดียวกัน เปลี่ยนเป็นโทนพาสเทลหม่นลง เข้าชุดกับไม้อุ่นของห้องนั่งเล่น */
const IN_ROOM_FLOORS = {
  living:  [0xe6bc7f, 0xd9a967],   /* ไม้ส้มอบอุ่น (เดิม) */
  kitchen: [0xd3dfae, 0xc0cd95],   /* เขียวเซจหม่น (กระเบื้องครัว) */
  bed:     [0xf4c7da, 0xe9aec9],   /* ชมพูห้องนอน (เดิม) */
  bath:    [0xbfd4e0, 0xa9c3d3],   /* ฟ้าเทาหม่น (กระเบื้องห้องน้ำ) */
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
let charAct = null;                  /* {kind,t0,dur} ท่าทางตอนทำกิจกรรม (ปลูก/รดน้ำ/เก็บ/เหวี่ยงเบ็ด) */

const hChar = {                       /* สถานะตัวละครในฉาก */
  cfg: null, tile: {x:SPAWN_TILE.x, z:SPAWN_TILE.z},
  path: [], seg: 0, segT: 0, segFrom: null, walking: false,
  targetRotY: Math.PI, pendingEnter: false, pendingExit: false,
};
const creatorState = {dragging:false, lastX:0, rotY:0, rotTarget:0, fromWorld:false};

/* ---------- data ---------- */
/* เวอร์ชันแผนที่: 2 = ขยายทิศเหนือ/ตะวันออก (เลื่อน +NPAD/+EPAD), 3 = ขยายทิศตะวันออกอีกชั้น (เลื่อน +EPAD2)
   4 = ย่อกรอบบริเวณบ้านเหลือ x13-25/z27-38 + ย้ายรั้วไปล้อมกรอบทั้งผืน (2026-08-09)
   ของตกแต่งนอกบ้านที่เด็กวางไว้เก็บเป็น "พิกัดช่อง" → ต้องเลื่อนตามครั้งเดียว ไม่งั้นของจะย้ายที่เอง */
const MAP_V = 5;
function migrateHouseMap(d){
  const from = d.mapV || 1;
  const dx = from < 2 ? NPAD : 0;
  const dz = (from < 2 ? EPAD : 0) + (from < 3 ? EPAD2 : 0);
  if(d.decor && Array.isArray(d.decor.out)) d.decor.out.forEach(r=>{ r.x += dx; r.z += dz; });
  /* mapV 4: รั้วเป็น decor ที่ seed ครั้งเดียวต่อเด็ก → เด็กที่เล่นอยู่แล้วจะค้างรั้วแนวเก่า (ล้อมแค่สนามรอบบ้าน)
     ⇒ ทิ้งรั้วเก่าทั้งแถวแล้ววางรั้วแนวใหม่ให้ + ดึงของที่ตกนอกกรอบบ้านที่ย่อลงกลับเข้ากรอบ
     (ถ้าปล่อยไว้ ของชิ้นนั้นจะกลายเป็นของที่เด็กย้าย/ลบไม่ได้ เพราะ decorCanPlace ห้ามแตะนอกกรอบ) */
  /* mapV 5 (2026-08-13): แจกแปลงผัก 4 แปลงให้เด็กที่เล่นอยู่ก่อนเฟส 11
     ⚠ เช็คก่อนว่ายังไม่มี — เด็กที่เพิ่งสร้างบ้านหลัง mapV 5 ได้จาก seedWorldDecor ไปแล้ว
       ถ้าไม่เช็คจะได้ 8 แปลงซ้อนกัน */
  if(from < 5 && d.decor && Array.isArray(d.decor.out)){
    if(!d.decor.out.some(r => r && r.id === 'veg-plot'))
      d.decor.out = d.decor.out.concat(vegPlotSeedRecs());
    else if(!d.decor.out.some(r => r && r.id === 'sell-basket'))
      d.decor.out = d.decor.out.concat([{id:'sell-basket', x:17, z:37, rot:0, col:0}]);
  }
  if(from < 4 && d.decor && Array.isArray(d.decor.out)){
    const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));   /* ดึงเข้า "ในรั้ว" (เว้นแถวรั้วไว้ 1 ช่องทุกด้าน) */
    d.decor.out = d.decor.out
      .filter(r => r.id !== 'fence-seg' && r.id !== 'fence-corner')
      .map(r => { r.x = cl(r.x, HOME_ZONE.x0+1, HOME_ZONE.x1-1); r.z = cl(r.z, HOME_ZONE.z0+1, HOME_ZONE.z1-1); return r; });
    d.decor.out = fenceSeedRecs().concat(d.decor.out);
  }
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

/* ⚠ **ของใหม่จาก house-map.js ต้องดึงแบบทนต่อ "cache ผสมรุ่น"** (บั๊กจริง 2026-08-13)
   เบราว์เซอร์อาจถือ house-map.js รุ่นเก่า (ไม่มีของพวกนี้) คู่กับ house.js รุ่นใหม่ ถ้าเรียกตรงๆ
   จะ throw ตั้งแต่เฟรมแรก ⇒ **เด็กเข้าโหมดบ้านไม่ได้เลยทั้งโหมด** ซึ่งแย่กว่าการไม่มีท่าไม้มาก
   ⇒ ไม่มีของใหม่ = ถอยไปใช้ค่าว่าง (ไม่มีท่าเพิ่ม/ไม่มีจุดตกปลาในบ่อ) แต่เมืองยังเข้าได้ปกติ */
const POND_PIERS      = HM.POND_PIERS || [];
const SEA_SPITS       = HM.SEA_SPITS || [];
const isSeaSpitTile   = HM.isSeaSpitTile || function(){ return false; };
const SEA_DECKS       = HM.SEA_DECKS || [];
const isSeaDeckTile   = HM.isSeaDeckTile || function(){ return false; };
const POND_FISH_SPOTS = HM.POND_FISH_SPOTS || [];
const seaFishSpots    = HM.seaFishSpots || function(){ return []; };
const isPierTile      = HM.isPierTile || function(){ return false; };
const isWaterDeckTile = HM.isWaterDeckTile || function(){ return false; };

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

/* ของเล่นสัตว์เลี้ยงเฟส 12.1 (js/house-pet-toys.js โหลดก่อนไฟล์นี้) — โมเดล + ท่าเล่นประจำชิ้น
   ⚠ **ไม่มีไฟล์นี้ก็ต้องไม่พัง** — ของเล่นที่หา spec ไม่เจอจะถอยไปใช้ท่าลูกบอลเดิมให้เอง
     (ดู startPetAct) เด็กยังเล่นได้ตามปกติ แค่ท่าไม่ตรงชิ้น */
const PET_TOYS3D = (typeof window.HOUSE_PET_TOYS === 'function')
  ? window.HOUSE_PET_TOYS({THREE, box, ball:sphere, cyl, cone, torus, mat:toonMat})
  : {SPECS:{}, pose:()=>null, POSE_KINDS:[]};

/* 🪑 ของตกแต่งที่ใช้งานได้จริง เฟส 17 (js/house-usable.js โหลดก่อนไฟล์นี้)
   ⚠ **ไม่มีไฟล์นี้ก็ต้องไม่พัง** — ของทุกชิ้นถอยไปเด้ง (`decorBounce`) เหมือนก่อนเฟส 17
   ⚠ ฟังก์ชันที่ส่งไปเป็น callback ล้วน (ประกาศใต้บรรทัดนี้ทั้งหมด) ⇒ ห่อด้วย arrow กัน TDZ */
const USABLE = (typeof window.HOUSE_USABLE === 'function')
  ? window.HOUSE_USABLE({
      box, ball:sphere,
      charBubble: (t, say)=> charBubble(t, say),
      toast: (ic, m)=>{ if(typeof showToast === 'function') showToast(ic, m); },
      /* อนุภาคฟุ้งรอบของชิ้นนั้น (ชุดเดียวกับที่ decorToggle ใช้) */
      particles: (g, n, col, spread)=>{
        const p = g.position;
        for(let i = 0; i < n; i++)
          spawnParticle(p.x + (Math.random() - .5) * (spread * 3), .9 + Math.random() * .9,
                        p.z + (Math.random() - .5) * (spread * 3), col, g.parent);
      },
      pose: (kind, ms)=>{ charAct = {kind, t0: performance.now(), dur: ms || 900, hold:false}; },
      later: (fn, ms)=> setTimeout(fn, ms),
      isNight: ()=> (typeof isNightMode === 'function') && isNightMode(),
      setNight: (v)=>{ if(typeof setTheme === 'function') setTheme(!!v, true); },
      fade: (fn)=> fadeSwap(fn),
      petDirty: ()=> !!(PETCARE && PETCARE.isDirty && PETCARE.isDirty()),
      /* เพิ่ม/ลบชิ้นส่วนที่มี anim ระหว่างเกม (แถบภาพในจอทีวี) ⇒ ต้องเก็บรายชื่อใหม่ */
      recollectAnim: (g)=>{ g.userData.animParts = collectDecorAnim(g); },
    })
  : null;

/* ร้านค้า/เศรษฐกิจเฟส 1 (js/house-shop.js โหลดก่อนไฟล์นี้) — ตารางราคา + คลังสิทธิ์ + migration + หน้าร้าน
   ไฟล์นั้นไม่แตะ localStorage เอง ใช้ load/save ที่ส่งไปให้ตรงนี้ (ข้อมูลจึงอยู่ก้อนเดียวกับบ้าน export ตามไปเอง) */
const SHOP = (typeof window.HOUSE_SHOP === 'function')
  ? window.HOUSE_SHOP({
      FURN, H_ROWS, H_ROW_ICONS, H_DEFAULT_CHAR,
      load: loadHouseData, save: saveHouseData,
      childId: ()=> (activeChild ? activeChild.id : ''),
      onChange: onShopChange,
      preview: (spec)=>openShopPreview(spec),
      closePreview: ()=>closeShopPreview(),
      /* PET_TYPES ประกาศอยู่ท้ายไฟล์นี้ (หลังบรรทัดนี้มาก) — ต้องส่งเป็นฟังก์ชัน ไม่งั้นชน TDZ */
      petTypes: ()=>PET_TYPES,
      care: ()=>PETCARE,               /* PETCARE ประกาศใต้บรรทัดนี้ — ส่งเป็นฟังก์ชันกัน TDZ เหมือน petTypes */
      onPetBought: (type)=>petBoughtFlow(type),
    })
  : null;
/* เครื่องยนต์เควสต์เฟส 2 (js/house-quests.js โหลดก่อนไฟล์นี้) — กลไก/สุ่มรายวัน/รางวัล/ประตูความพร้อม
   ไฟล์นั้นไม่แตะ DOM/WebGL เลย ป้าย "!" กับหน้าจอเล่นอยู่ในไฟล์นี้ทั้งหมด
   ⚠ เงินจ่ายผ่าน window.OwlCoins ที่ awardQuest() จุดเดียวเท่านั้น (กติกาเหล็กข้อ 5) */
const QUESTS = (typeof window.HOUSE_QUESTS === 'function')
  ? window.HOUSE_QUESTS({
      load: loadHouseData, save: saveHouseData,
      childId: ()=> (activeChild ? activeChild.id : ''),
      gradeId: ()=> (activeChild && activeChild.grade) ? activeChild.grade
                  : (typeof resolveGradeForChild==='function' ? resolveGradeForChild(activeChild) : 'prep-p1'),
      npcDefs: NPC_DEFS,
      dayKey: ()=> questDayKey(),
      /* ตารางอาหารสัตว์ (เกม "เตือนเรื่องสัตว์" เฟส 4B) — ของจริงอยู่ที่ js/house-pet-care.js
         อ่านแบบ lazy เพราะ PETCARE ถูกสร้างทีหลังบรรทัดนี้ (gen() เรียกตอนเล่นจริงซึ่งช้ากว่ามาก) */
      petFoods: ()=> (PETCARE ? PETCARE.FOOD : []),
      /* เควสต์ "ไปนั่งกินข้าวพร้อมหน้า" ต้องมีโต๊ะ/เก้าอี้ในบ้านก่อน ไม่งั้นรับงานแล้วทำไม่ได้ */
      hasIndoorSeat: ()=> hasIndoorSeat(),
      /* เฟส 9 — เครื่องดนตรี: คลังทั้งหมด (สำหรับโจทย์ทายเสียง) + บ้านหลังนี้มีเครื่องแล้วหรือยัง
         ⚠ เควสต์ดนตรีต้องมีเครื่องในบ้านก่อนถึงแจก ไม่งั้นเด็กรับงานแล้วเล่นไม่ได้ (กติกาเหล็กข้อ 1) */
      instruments: ()=> FURN.items.filter(it => it.cat === 'music')
                        .map(it => ({id:it.id, name:it.name, emoji:it.emoji,
                                     note:it.note | 0, tune:it.tune || null,
                                     /* 🎺 เสียงประจำเครื่อง — เกมทายเสียงต้องได้ยินเสียงจริงของชิ้นนั้น
                                        ไม่ใช่เสียงเปียโนเหมือนกันหมด (ผู้ใช้แจ้ง 2026-08-16) */
                                     voice:it.voice || 'piano'})),
      hasInstrument: ()=> hasInstrument(),
      routineCats: ()=> routineCats(),   /* 🕰️ หมวดของในบ้านที่เด็กวางไว้จริง (เควสต์กิจวัตรใช้) */
      /* 👋 เฟส 18 — งานที่เด็กถนัดกับคนคนนี้ (เพิ่มโอกาสเจอ ไม่ล็อก)
         ⚠ NEIGH ประกาศ**ใต้**บล็อกนี้ ⇒ ต้องเรียกแบบ lazy กัน TDZ (แพทเทิร์นเดียวกับ petTypes) */
      favMech: (npcId)=> NEIGH ? NEIGH.favMech(npcId) : '',
      /* 🚪 "วันนี้ยังทำงานแนว Action ได้อีกกี่ครั้ง" — ใช้กันงานตัน (เก็บของหมดแล้ว/ไม่มีแปลงให้รด)
         ⚠ ต้องอ่านจาก js/house-play.js ตัวจริง ไม่ใช่เดาจากของที่ซื้อไว้ */
      worldStock: ()=>{
        const P = window.HousePlay;
        const base = (P && P.worldStock) ? P.worldStock() : {leaf:0, water:0, photo:0};
        /* 🏠 ของในบ้าน — งาน Action ชุด A ต้องมีของจริงก่อนถึงถูกแจก (กันงานตัน)
           ⚠ ดูจาก "ของที่วางไว้จริง" ไม่ใช่ "ของที่ซื้อแล้ว" — ซื้อแล้วเก็บในคลังยังใช้ไม่ได้ */
        const d = loadHouseData() || {};
        base.pet   = d.pet ? 1 : 0;
        base.music = hasInstrument() ? 1 : 0;
        base.trick = (d.pet && PETCARE && PETCARE.learnedTricks
                       && PETCARE.learnedTricks().length < (PETCARE.TRICKS || []).length) ? 1 : 0;
        /* 🕰️ กิจวัตร: นับ "หมวดของในบ้านที่ต่างกัน" ที่เด็กวางไว้จริง — ต้องมีอย่างน้อย 2 หมวด
           ไม่งั้นสั่งให้ไปแตะเตียงแล้วโต๊ะ ทั้งที่บ้านมีแต่โซฟา = ตัน (ผู้ใช้สั่งให้อิงของที่มีจริง) */
        base.routine = routineCats().length;
        return base;
      },
      /* เฟส 5: เกมของหน้าหลักตัวนี้ยืมมาเล่นได้ไหม (ต้องลงทะเบียนกับ OwlGames + อยู่ในรายการ ALLOW)
         เฟส 6 เพิ่มเงื่อนไขที่ 3: **ต้องมีหมวดที่ระดับชั้นเด็กเล่นได้จริงด้วย** — วงจรไฟฟ้ามีแต่ ป.6
         แท็งแกรมมีแต่ ป.5-6 ถ้าไม่เช็ค เด็ก ป.1 จะได้รับงานที่เปิดขึ้นมาแล้วเป็นโจทย์ ป.6 */
      hasGame: (id, gid, pick) => !!(window.OwlGames && OwlGames.has(id)
                        && window.HouseGames && HouseGames.ALLOW[id]
                        && HouseGames.pickCat(id, gid || 'prep-p1', pick)),
    })
  : null;

/* 👋 ความจำของเพื่อนบ้าน เฟส 18 (js/house-neighbour.js โหลดก่อนไฟล์นี้)
   ⚠ **ไม่มีไฟล์นี้ก็ต้องไม่พัง** — NPC จะกลับไปทักแบบเดิมทุกครั้งเหมือนก่อนเฟส 18
   ⚠ ไฟล์นั้นไม่แตะ DOM/WebGL เลย ใช้ load/save ก้อนเดียวกับบ้าน ⇒ export/import พาไปเอง */
const NEIGH = (typeof window.HOUSE_NEIGHBOUR === 'function')
  ? window.HOUSE_NEIGHBOUR({
      load: loadHouseData, save: saveHouseData,
      dayKey: ()=> questDayKey(),
    })
  : null;
/* การดูแลสัตว์เลี้ยงเฟส 3B (js/house-pet-care.js โหลดก่อนไฟล์นี้) — ความหิว/อาหาร/ป่วย/ค่ารักษา
   ไฟล์นั้นไม่แตะ DOM/WebGL เช่นกัน · ชามอาหาร แถบหัวใจ การ์ดคุณหมอ อยู่ในไฟล์นี้ทั้งหมด */
/* พ่อ-แม่ในบ้านเฟส 4A (js/house-family.js) — ชื่อ/หน้าตา/บทพูด · ไม่แตะ DOM/WebGL เช่นกัน */
const FAMILY = (typeof window.HOUSE_FAMILY === 'function')
  ? window.HOUSE_FAMILY({
      load: loadHouseData, save: saveHouseData,
      defaults: {dad: H_DEFAULT_PARENT_DAD, mom: H_DEFAULT_PARENT_MOM},
    })
  : null;
const PETCARE = (typeof window.HOUSE_PET_CARE === 'function')
  ? window.HOUSE_PET_CARE({
      load: loadHouseData, save: saveHouseData,
      dayKey: ()=> questDayKey(),
      /* สถานะเปลี่ยน → บังคับอ่านค่าใหม่ (petCareHud.t) แล้ววาดแถบสถานะสัตว์ใหม่ (petBarKey) */
      onChange: ()=>{ petBarKey = ''; petCareHud.t = 0; },
    })
  : null;

/* ซื้อของเสร็จ → กล่องเลือกของ/หน้าแต่งตัวที่เปิดค้างอยู่ต้องปลดล็อกตามทันที */
function onShopChange(){
  if(editMode) renderEditItems();
  if(hMode === 'creator' && creatorCfg) buildCreatorRows(creatorCfg);
  /* เฟส 12: เปลี่ยนปลอกคอในร้าน = ตัวน้องที่ยืนอยู่ในฉากต้องเปลี่ยนตามทันที (ปลอกคอถูกประกอบใน buildPet) */
  if(typeof restylePet === 'function' && hPet.group) restylePet();
}

/* ---------- พรีวิวสินค้า 3D ในร้าน — "หน้าต่างลอย" ข้างกล่องร้าน ----------
   ⚠ **ไม่สลับโหมด/ไม่ซ่อนโลก** (เดิมเคยทำเป็นโหมดเต็มจอ hMode='shop' แล้วเด็กต้องสลับหน้าไปมา
     ผู้ใช้ขอให้เป็นหน้าต่างลอยแทน เมื่อ 2026-08-07 — ห้ามกลับไปเป็นโหมดเต็มจอโดยไม่ถาม)
   วิธี: ใช้ renderer ตัวเดิม (ไม่เปิด WebGL context ที่ 2 เปลืองหน่วยความจำบนมือถือ) แต่ยิงเรนเดอร์
   รอบที่ 2 ลง "กรอบเล็ก" ด้วย scissor/viewport ให้ตรงกับกล่อง `#house-prev-card` บนจอพอดี
   โมเดลอยู่คนละ scene (prevScene) จึงมีไฟ/พื้นหลังของตัวเอง ไม่ยุ่งกับฉากเมืองที่ยังเดินอยู่ข้างหลัง */
let prevScene = null, prevCam = null, prevHolder = null, prevModel = null;
let prevRotY = 0, prevDrag = null, prevSpin = true;
const PREV_BG = new THREE.Color(0xdff1fb);

function ensurePrevScene(){
  if(prevScene) return;
  prevScene = new THREE.Scene();
  prevCam = new THREE.OrthographicCamera(-2, 2, 2, -2, .1, 60);
  prevCam.position.set(0, 2.1, 6.2);
  prevCam.lookAt(0, .78, 0);
  /* ⚠ ความเข้มไฟต้องเท่ากับฉากเมืองตอนกลางวัน (hemi .62 / dir .68 — ดู lightTargets)
     ไฟแรงกว่านี้ MeshToonMaterial จะไต่ไปสุดขั้นสว่างของ gradientMap แล้วของกลายเป็นสีขาวโพลนทั้งชิ้น */
  prevScene.add(new THREE.HemisphereLight(0xfff6e0, 0xcde8b0, .62));
  const key = new THREE.DirectionalLight(0xffffff, .68);
  key.position.set(3.2, 6, 5);
  prevScene.add(key);
  const fill = new THREE.DirectionalLight(0xd6e6ff, .16);
  fill.position.set(-3, 2.4, 3);
  prevScene.add(fill);
  /* แท่นโชว์กลมสีเขียว ชุดเดียวกับหน้าสร้างตัวละคร ให้เด็กรู้ว่านี่คือ "ของโชว์" ไม่ใช่ของในบ้าน */
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.45, .22, 24), toonMat(0x7cc25a));
  plat.position.y = -.11;
  prevScene.add(plat);
  prevHolder = new THREE.Group();
  prevScene.add(prevHolder);
}
function clearPrevModel(){
  if(prevModel){ prevHolder.remove(prevModel); disposeGroup(prevModel); prevModel = null; }
}
/* ย่อ/ขยาย + จัดกึ่งกลางให้โมเดลพอดีกรอบพรีวิวเสมอ (ของในคลังขนาดต่างกันหลายเท่าตัว) */
/* keepAxis = จัดกึ่งกลางเฉพาะแกน Y (วางก้นแตะแท่น) **ไม่ขยับ X/Z**
   🐞 ใช้กับ "ตัวละคร" เท่านั้น (ผู้ใช้แจ้ง 2026-08-22: จุดหมุนของตัวเด็กในห้างแฟชั่นไม่ถูก)
      ของทั่วไปจัดกึ่งกลางจาก **กล่องครอบ** ได้ เพราะทรงสมมาตรรอบตัวเอง
      แต่ตัวละครมี **ของถือ/กระเป๋า/หมวก ยื่นออกไปข้างเดียว** ⇒ กลางกล่องครอบไม่ใช่กลางตัว
      พอเอากลางกล่องไปวางที่จุดหมุน ตัวเด็กเลย **โคจรรอบจุดที่ว่างข้างตัว** แทนที่จะหมุนอยู่กับที่
      ⇒ ตัวละครถูกสร้างโดยมีแกนกลางลำตัวอยู่ที่ x=0,z=0 อยู่แล้ว ปล่อยไว้ตามนั้นถูกที่สุด */
function fitPreviewModel(g, targetH, keepAxis){
  const bb = new THREE.Box3().setFromObject(g);
  if(!isFinite(bb.min.y)) return;
  const size = new THREE.Vector3(); bb.getSize(size);
  /* ⚠ วัดความกว้างด้วย "เส้นทแยงมุมของฐาน" (hypot x,z) ไม่ใช่ด้านที่ยาวสุด
     — โมเดลหมุนรอบตัวเองตลอด พอหันมุม 45° ด้านที่กว้างจริงคือเส้นทแยง ถ้าคิดแค่ด้านยาวสุด
       ของจะล้นขอบกรอบเป็นช่วงๆ ตอนหมุน (เจอกับโซฟา/เตียงที่ฐานเป็นสี่เหลี่ยมผืนผ้า) */
  const wide = Math.hypot(size.x, size.z);
  const s = targetH / Math.max(.001, Math.max(wide, size.y));
  g.scale.setScalar(Math.max(.4, Math.min(2.6, s)));
  const bb2 = new THREE.Box3().setFromObject(g);
  const c = new THREE.Vector3(); bb2.getCenter(c);
  if(keepAxis) g.position.set(0, -bb2.min.y, 0);
  else g.position.set(-c.x, -bb2.min.y, -c.z);   /* วางก้นโมเดลแตะแท่นพอดี ไม่ลอย/ไม่จม */
}
function savedCharCfg(){
  const saved = loadHouseData() || {};
  return Object.assign({}, H_DEFAULT_CHAR, saved.char || {});
}
function openShopPreview(spec){
  if(!houseOpen || editMode) return false;
  ensurePrevScene();
  clearPrevModel();
  let g = null;
  if(spec.kind === 'fit'){
    const cfg = savedCharCfg();
    cfg[spec.row] = spec.i;
    g = buildCharacter(cfg);          /* ตัวละครแยกก้อนของตัวเอง ไม่แตะ charGroup ที่เดินอยู่ในเมือง */
    fitPreviewModel(g, 2.0, true);   /* ตัวละคร — หมุนรอบแกนลำตัว ไม่ใช่กลางกล่องครอบ */
  }else if(spec.kind === 'pet'){      /* เฟส 3A: ดูตัวจริงของเพื่อนตัวน้อยก่อนซื้อ */
    /* เฟส 12: แท็บปลอกคอส่ง spec.collar มาด้วย ⇒ เห็นน้อง**ใส่ปลอกคออันนั้นจริงๆ** ก่อนจ่ายเงิน
       (ไม่ส่งมา = ใช้ปลอกคอที่น้องใส่อยู่ตอนนี้ตามปกติ) · พรีวิวไม่โชว์รอยเปื้อนเสมอ */
    g = buildPet(spec.type, spec.color | 0,
                 {collar: spec.collar !== undefined ? spec.collar : undefined, dirty: false});
    /* ใช้เป้าหมายเท่าเฟอร์นิเจอร์ — เพดาน scale ใน fitPreviewModel จะทำให้ตัวจิ๋ว (ลูกเจี๊ยบ)
       ดูเล็กกว่าตัวใหญ่ (แพนด้า) จริงๆ ซึ่งเป็นผลพลอยได้ที่ดี ไม่ใช่บั๊ก */
    fitPreviewModel(g, 1.9);
  }else{
    const item = FURN.byId[spec.id]; if(!item) return false;
    g = new THREE.Group();
    const pal = item.colors || [0xcccccc];
    try{ item.build(g, pal[0], decorKit(), null); }
    catch(err){ console.error('preview build', spec.id, err); return false; }
    fitPreviewModel(g, 1.9);
  }
  prevModel = g;
  prevHolder.add(g);
  prevRotY = 0; prevSpin = true;
  const card = $('house-prev-card');
  if(card) card.hidden = false;
  document.body.classList.add('house-preview');
  return true;
}
function closeShopPreview(){
  clearPrevModel();
  const card = $('house-prev-card');
  if(card) card.hidden = true;
  document.body.classList.remove('house-preview');
}
/* เรนเดอร์รอบที่ 2 ลงกรอบของ #house-prev-card — เรียกท้าย frame() หลังวาดฉากเมืองเสร็จ */
function renderPreviewInset(){
  const card = $('house-prev-card');
  if(!card || card.hidden || !prevScene || !prevModel) return;
  const r = card.getBoundingClientRect();
  /* เรนเดอร์ลง "padding box" (ในกรอบขอบ) ไม่ใช่ border box — ขอบทึบของกล่องจะได้ทับมุมสี่เหลี่ยม
     ที่ล้นออกนอกมุมโค้งไว้ (ดูคอมเมนต์ .house-prev-card ใน css/style.css) */
  const cs = getComputedStyle(card);
  const bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
  const bb_ = parseFloat(cs.borderBottomWidth) || 0;
  /* เผื่อขอบเกินไป 1px ทุกด้าน — ปัดเศษพิกัด/pixelRatio ทำให้เหลือเส้นบางๆ ที่โลกด้านหลังลอดออกมา
     (ขอบกล่องหนา 12px จึงยังกลบส่วนที่เกินไว้ได้สบาย ไม่ล้นถึงมุมโค้ง) */
  const w = Math.round(card.clientWidth) + 2, h = Math.round(card.clientHeight) + 2;
  if(w < 8 || h < 8) return;
  const x = Math.round(r.left + bl) - 1;
  const y = Math.round(window.innerHeight - (r.bottom - bb_)) - 1;   /* WebGL นับแกน y จากขอบล่างจอ */
  const aspect = w / h;
  const H = 3.9;                                          /* ความสูงกรอบในหน่วยโลก (เล็กลง = โมเดลใหญ่ขึ้น) */
  prevCam.top = 2.3; prevCam.bottom = prevCam.top - H;
  prevCam.left = -H*aspect/2; prevCam.right = H*aspect/2;
  prevCam.updateProjectionMatrix();
  const oldClear = renderer.getClearColor(new THREE.Color());
  const oldAlpha = renderer.getClearAlpha();
  renderer.setScissorTest(true);
  renderer.setViewport(x, y, w, h);
  renderer.setScissor(x, y, w, h);
  renderer.setClearColor(PREV_BG, 1);
  renderer.clear(true, true, false);
  renderer.render(prevScene, prevCam);
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setClearColor(oldClear, oldAlpha);
}
/* ลากบนกรอบพรีวิวเพื่อหมุนดูเอง (ปล่อยแล้วกลับไปหมุนอัตโนมัติ) */
function bindPrevCardDrag(){
  const card = $('house-prev-card');
  if(!card || card._bound) return;
  card._bound = true;
  card.addEventListener('pointerdown', e=>{
    prevDrag = {x:e.clientX}; prevSpin = false;
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener('pointermove', e=>{
    if(!prevDrag) return;
    prevRotY += (e.clientX - prevDrag.x) * .012;
    prevDrag.x = e.clientX;
  });
  const up = ()=>{ prevDrag = null; prevSpin = true; };
  card.addEventListener('pointerup', up);
  card.addEventListener('pointercancel', up);
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

/* ---------- ตัวละคร/ของแต่งตัว (แยกไปอยู่ js/house-avatar.js เมื่อ 2026-08-12) ----------
   ดึงกลับมาเป็นชื่อเดิมทุกตัว ⇒ โค้ดส่วนที่เหลือของไฟล์นี้เรียกใช้ได้เหมือนเดิมทุกประการ
   ⚠ `hShadows` ส่งเป็นค่า ณ ตอนสร้าง — ไฟล์นั้นใช้แค่ตอนตั้ง castShadow ของ mesh ที่วาดใหม่
     ซึ่งเกิดหลัง initThreeCore() ตั้งค่านิ่งแล้วเสมอ */
if(typeof window.HOUSE_AVATAR !== 'function')
  throw new Error('house-avatar.js ต้องถูกโหลดก่อน house.js');
const AVATAR = window.HOUSE_AVATAR({
  THREE, box, sphere, cyl, cone, torus, toonMat, softMat, petShade, roundedBoxGeo,
  hShadows: ()=> hShadows,     /* ⚠ ส่งเป็นฟังก์ชัน — ค่าจริงถูกตั้งทีหลังตอน initThreeCore */
  /* คลังสี/จำนวนแบบมาจาก js/house-map.js ซึ่งห่อ IIFE ⇒ ไฟล์อื่นมองไม่เห็นเอง ต้องส่งต่อให้ */
  H_SKIN, H_HAIR_COLORS, H_EYE_COLORS, H_SHIRT_COLORS, H_BOTTOM_COLORS, H_SHOE_COLORS, H_ACC_COLORS,
  H_PATTERN_N, H_HAT_N, H_GLASS_N, H_BAG_N, H_HOLD_N, H_HAIR_N, H_EYE_N, H_DEFAULT_CHAR,
});
const {hairShell, hairBang, hairStrand, hairSpike, hairLock, hairCap, addHair, addEyes,
       chStar, chHeart, chArmBand, addShirtPattern, addHatHair, addHeadwear, addGlasses,
       addBackpack, addHoldItem, addShoe, buildCharacter, HAT_COVER_HAIR} = AVATAR;
const {CH_BW, CH_BH, CH_BD, CH_BY, CH_AW, CH_AD, CH_SHO_Y, CH_ARM_T} = AVATAR.CH;



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
/* ⚠ เพิ่มทางเดินรอบบริเวณบ้าน 3 เส้นเมื่อ 2026-08-09 ตามคำขอผู้ใช้ (พร้อมกับย่อกรอบบ้านเหลือ x13-25/z27-38
   แล้วเอารั้วไปล้อมกรอบทั้งผืน) — ทั้ง 3 เส้นต่อกันเป็นทางเดินเลียบรั้วบ้านฝั่งตะวันออก+ใต้:
     A. x19-27 / z40-41  ทางเดินขวางใต้บ้าน — ต่อกับทางเดินดินเดิม (x19-20) ที่ทอดลงไปหาสะพานใต้
                          และตรงกับช่องรั้ว x19-20/z38 ที่เปิดไว้
     B. x26-27 / z25-39  ทางเดินเลียบรั้วฝั่งตะวันออก — ผ่านหน้าช่องรั้ว x25/z35-36 แล้วต่อขึ้นไปหาหัวสะพานเหนือ
     C. x21-25 / z25-26  ทางเดินขวางเหนือบ้าน — เชื่อม B เข้ากับทางเดินดินไปฟาร์ม (FARM_TRAIL x19-20)
   ⇒ เดินออกจากบ้านไปได้ครบทั้ง 3 ทาง (ฟาร์ม / สะพานเหนือเข้าเมือง / สะพานใต้ไปชุมชนที่ 2) โดยไม่ต้องลุยป่า
   ของฉากที่เคยอยู่บนแนวนี้ถูกเอาออกไปแล้ว (ดอกไม้ 27,30 · แนวพุ่ม 27,25 · ต้นไม้ seed นอกกรอบบ้าน)
   ส่วนต้นไม้ป่าไม่ต้องไล่เอง — wildPlantable ตัดช่องถนนทิ้งอยู่แล้ว */
const HOME_TRAIL = [
  {x0:HOME_EXIT_X[0], x1:HOME_EXIT_X[1], z0:HOME_EDGE_Z, z1:BRIDGE2_Z[1]},
  {x0:HOME_EXIT_X[0], x1:RIVER_X[0]-1, z0:BRIDGE2_Z[0], z1:BRIDGE2_Z[1]},
  {x0:HOME_EXIT_X[0], x1:RIVER_X[0]-1, z0:HOME_ZONE.z1+2, z1:HOME_ZONE.z1+3},   /* A */
  {x0:HOME_ZONE.x1+1, x1:RIVER_X[0]-1, z0:HOME_ZONE.z0-2, z1:HOME_ZONE.z1+1},   /* B */
  {x0:HOME_ZONE.x1-4, x1:HOME_ZONE.x1, z0:HOME_ZONE.z0-2, z1:HOME_ZONE.z0-1},   /* C */
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
  '26,47', '27,47', '27,48',
  /* ผู้ใช้ชี้เองว่า 2 ต้นนี้เกะกะ (2026-08-09) — 27,42 คือหัวมุมต่อกับทางเดินใหม่ x19-27/z40-41
     (แนวพุ่ม x27 ถอยไปเริ่ม z43 แล้ว) · 17,45 คือต้นที่ยืนอยู่กลางทุ่งใต้บริเวณบ้าน */
  '27,42', '17,45',
  /* ต้นไม้ในชุมชนที่ 2 ที่ผู้ใช้ชี้เองว่าเกะกะ (2026-08-22) — ชุดเดียวกับ 34,61 / 35,60 ข้างบน */
  '35,61', '33,65', '43,65', '45,65']);
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
/* ล้างค่าชั่วคราวที่ใช้ระหว่างประกอบร่างตัวละครออกจาก userData ของลูกทุกตัว
   (`_hairTop`/`_hairW` ที่ hairShell จดไว้ให้หมวก/หน้าม้าอ้างอิง) — ต้องเรียกก่อน mergeDecorGroup เสมอ
   เพราะตัว merge ยกเลิกทั้งก้อนทันทีที่เจอ userData บนลูก (กติกาเดิม: กันไปโดนบานพับ/หลอดไฟ/จุดหมุน) */
function clearBuildScratch(g){
  g.traverse(o=>{
    if(o.userData && o.userData._hairTop !== undefined){
      delete o.userData._hairTop; delete o.userData._hairW;
    }
  });
}
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
/* 🎨 ป้ายร้าน: emoji → ไอคอน SVG (เฟส B ของ ICON-PLAN.md · ผู้ใช้สั่ง 2026-08-19)
   ป้ายพวกนี้ลอยอยู่เหนือตึกทั่วเมือง = จุดที่ "emoji ข้าม OS ได้คนละรูป" เจ็บที่สุด
   ⚠ ป้ายที่ยังไม่มีไอคอน (หรือ HouseIcons โหลดไม่ทัน) **ต้องได้ emoji เดิมเสมอ** */
const SIGN_SVG = {
  '🏪':'sign-mart', '🐾':'sign-paw', '🏥':'sign-hospital', '🍜':'sign-noodle',
  '🏛️':'sign-cityhall', '🏨':'sign-hotel', '🚓':'sign-police', '🌾':'sign-rice',
  '🏫':'sign-school', '🪚':'sign-saw', '🔬':'sign-lab', '👗':'sign-dress',
  '🎠':'sign-carousel', '🦉':'sign-owl', '🍢':'sign-skewer',
  '🎸':'furn-ins-guitar', '🐄':'critter-cow', '🐮':'critter-cow',
  '🎣':'ui-fishing', '🌷':'furn-tulip-pot', '🐟':'fish-nil', '🛋️':'furn-sofa',
};
function signAtlasMat(){
  if(signMat) return signMat;
  const cv = document.createElement('canvas');
  cv.width = cv.height = SIGN_COLS * SIGN_CELL;
  const ctx = cv.getContext('2d');
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '84px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif';
  const cell = i => ({x:(i % SIGN_COLS) * SIGN_CELL, y:((i / SIGN_COLS) | 0) * SIGN_CELL});
  /* ① วาด emoji ลงไปก่อนทั้งแผ่น — ป้ายจะไม่ว่างระหว่างรอรูป SVG โหลด */
  SIGN_ICONS.forEach((ic, i)=>{
    const p = cell(i);
    ctx.fillText(ic, p.x + SIGN_CELL/2, p.y + SIGN_CELL/2 + 4);
  });
  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearFilter;
  signMat = new THREE.MeshBasicMaterial({map:tex, transparent:true, alphaTest:.3, side:THREE.DoubleSide});
  /* ② ช่องไหนมีไอคอน SVG ให้โหลดเป็นรูปแล้ววาดทับ (async — เสร็จเมื่อไหร่ค่อยสั่งอัปเดต texture)
     ⚠ ต้องล้างช่องก่อนวาดทับ ไม่งั้น emoji เดิมจะทะลุออกมาตามขอบไอคอน */
  if(window.HouseIcons){
    SIGN_ICONS.forEach((ic, i)=>{
      const id = SIGN_SVG[ic];
      if(!id || !window.HouseIcons.has(id)) return;
      const img = new Image();
      img.onload = ()=>{
        const p = cell(i), pad = 6;
        ctx.clearRect(p.x, p.y, SIGN_CELL, SIGN_CELL);
        ctx.drawImage(img, p.x + pad, p.y + pad, SIGN_CELL - pad*2, SIGN_CELL - pad*2);
        tex.needsUpdate = true;
      };
      img.src = window.HouseIcons.svgUri(id, SIGN_CELL - 12);   /* ⚠ ต้องผ่าน svgUri() — ต้องมี xmlns */
    });
  }
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
/* ---------- โมเดลตึก/ร้านค้าในเมือง (แยกไปอยู่ js/house-models.js เมื่อ 2026-08-12) ----------
   ดึงกลับมาเป็นชื่อเดิมทุกตัว ⇒ โค้ดส่วนที่เหลือของไฟล์นี้เรียกใช้ได้เหมือนเดิมทุกบรรทัด
   ⚠ ส่งตัวช่วยแบบ arrow เพราะบางตัว (`fxTag`) ประกาศอยู่ท้ายไฟล์นี้ — ห่อไว้ให้ชัดว่า
     เรียกตอน runtime ไม่ใช่ผูกค่า ณ ตอนโหลด */
if(typeof window.HOUSE_MODELS !== 'function')
  throw new Error('house-models.js ต้องถูกโหลดก่อน house.js');
const MODELS = window.HOUSE_MODELS({
  THREE, box, sphere, cyl, cone, torus, toonMat, softMat, roundedBoxGeo, petShade,
  signPlane: (i, s)=> signPlane(i, s),
  addSeatSpot: (x, z, r, k)=> addSeatSpot(x, z, r, k),
  fxTag: (o, k, o2)=> fxTag(o, k, o2),
  outWX: g=> outWX(g), outWZ: g=> outWZ(g),
  FOOD_DECK,
  hShadows: ()=> hShadows,     /* ⚠ ฟังก์ชัน ไม่ใช่ค่า — ตั้งทีหลังตอน initThreeCore */
});
const {addChimney, addDoor, addRoofGable, addRoofHip, addShopEmblem, addShopFront, addWindowPair, buildGardenShop, buildMinimart, buildMusicShop, buildPetPenFencePiece, buildPetPenFloor, buildPetPenGate, buildPetPenProp, buildPetShop, buildRestaurant, buildSandwichSign, buildToyShop, musicNote} = MODELS;

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
  if(lot.shopKind==='garden') return buildGardenShop(lot); /* ร้านต้นไม้ — เรือนกระจกเพาะชำ */
  if(lot.shopKind==='toy')   return buildToyShop(lot);     /* ร้านของเล่น — ตึกหลังคาแบน กันสาดสีรุ้ง */
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
    a.bx = o.position.x; a.by = o.position.y; a.bz = o.position.z;
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
      case 'swim': {                                 /* 🐠 ปลาว่ายไปมาในตู้ปลา (เฟส 17 รอบแก้)
                                                        ⚠ ต้องกลับหัวตอนเปลี่ยนทิศ ไม่งั้นเห็นเป็นปลาถอยหลัง */
        const w = Math.sin(s*sp + ph);
        o.position.x = a.bx + w*(a.amp || .18);
        o.position.y = a.by + Math.sin(s*sp*1.9 + ph)*.025;
        o.rotation.y = a.bry + (Math.cos(s*sp + ph) >= 0 ? 0 : Math.PI);
        o.rotation.z = a.brz + Math.sin(s*sp*2.4 + ph)*.12;
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
    if(g.userData.animParts){
      /* 🐠 เฟส 17: ตู้ปลาที่เพิ่งให้อาหาร ปลาว่ายเร็วขึ้นชั่วครู่
         ⚠ เร่งด้วย "เวลาชดเชยสะสม" ไม่ใช่คูณ s ตรงๆ — คูณตรงๆ เฟสจะกระโดด ปลาวาร์ปตำแหน่ง */
      if(USABLE && USABLE.tickBoost && g.userData.tankBoost)
        g.userData.animShift = (g.userData.animShift || 0) + USABLE.tickBoost(g, dt);
      updateDecorAnimParts(g, s + (g.userData.animShift || 0), ph);   /* ธง/กังหัน/น้ำพุ/ไฟ — ขยับเฉพาะชิ้นส่วนข้างใน */
    }
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
/* กระถางต้นไม้ตั้งพื้น (POT_SPOTS) — กระถางดินเผาปากบาน + พุ่มใบ 3 ก้อน + ดอกไม้แซม
   สี/ทรงสุ่มจากพิกัดช่อง จึงคงที่ทุกครั้งที่เข้าเกม (ไม่กระโดดไปมา) และกระถางแต่ละใบไม่เหมือนกันเป๊ะ */
function buildPotPlant(x, z){
  const g = new THREE.Group();
  const k = (x*7 + z*13) % 4;
  const potC = [0xd98b5a, 0xef8354, 0xe0715c, 0xc98d4e][k];
  const flC  = [0xff8fb3, 0xffd54f, 0xb388ff, 0xfffaf0][(x + z) % 4];
  const pot = cyl(.3,.22,.42, potC, 12); pot.position.y = .21; g.add(pot);
  const rim = cyl(.33,.33,.09, potC, 12); rim.position.y = .4;  g.add(rim);
  const soil= cyl(.27,.27,.05, 0x5d4b41, 12); soil.position.y = .44; g.add(soil);
  [[0,.68,.28],[-.19,.58,.2],[.19,.6,.2]].forEach(([ox,oy,r])=>{
    const lf = sphere(r, 0x6fbf73, 10); lf.scale.y = .84; lf.position.set(ox, oy, 0); g.add(lf);
  });
  [[-.12,.78,.05],[.14,.74,.11],[0,.9,-.08]].forEach(([ox,oy,oz])=>{
    const fl = sphere(.075, flC, 8); fl.position.set(ox, oy, oz); g.add(fl);
  });
  return g;
}
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
/* ⚠ **ห้ามวางใบบัวทับจุดตกปลา** (ผู้ใช้แจ้ง 2026-08-14 ว่าดอกบัวทับทุ่น)
   ⚠ พิกัดที่นี่เป็น "ก่อนเลื่อน" ต้อง +EPAD2 (10) บนแกน z ถึงจะเทียบกับ POND_FISH_SPOTS ได้
   ทุ่นอยู่ที่ (7,20) กับ (7,15) ⇒ ห้ามมีใบบัวที่ [7,10] และ [7,5] (ของเดิมมี [7,10] ทับพอดี
   ย้ายออกไปที่ [9,12] แล้ว) — **เพิ่ม/ย้ายใบบัวเมื่อไหร่ต้องเช็คซ้ำทุกครั้ง** */
const POND_PADS = s2List([[3,4],[6,3],[2,9],[9,12],[5,12],[8,6],[4,7]]);
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
                milk:0x9ad9f0, shave:0xffd54f, magic:0x7e57c2}[kind] || 0xef8354;
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
  }else if(kind==='magic'){                            /* รถเข็นนักมายากล — หมวกทรงสูงมีกระต่ายโผล่ + ไม้กายสิทธิ์ + ไพ่ + ดาว
                                                          (เพิ่ม 2026-08-09 พร้อม npc-magician ที่ลานหน้าร้านของเล่น) */
    const brim = cyl(.28,.28,.05, 0x3a3540,14); brim.position.set(-.3,.86,0); g.add(brim);
    const crown= cyl(.19,.19,.34, 0x3a3540,14); crown.position.set(-.3,1.05,0); g.add(crown);
    const band = cyl(.2,.2,.08, 0xb388ff,14);   band.position.set(-.3,.93,0); g.add(band);
    const rb   = sphere(.11,0xfbf7f0,10); rb.position.set(-.3,1.28,0); g.add(rb);            /* หัวกระต่ายโผล่ปากหมวก */
    [-1,1].forEach(s=>{ const er = cyl(.035,.045,.2, 0xfbf7f0,8); er.position.set(-.3+s*.07,1.44,0); g.add(er); });
    [-1,1].forEach(s=>{ const ey = sphere(.02,0x3a3540,6); ey.position.set(-.3+s*.045,1.3,.1); g.add(ey); });
    const wand = cyl(.022,.022,.36, 0x3a3540,6); wand.rotation.z = -.55; wand.position.set(.12,1.06,-.06); g.add(wand);
    const wtip = cyl(.028,.028,.07, 0xfbf7f0,6); wtip.rotation.z = -.55; wtip.position.set(.2,1.19,-.06); g.add(wtip);
    [[.3,-.1,0xe4574a],[.4,.06,0xfbf7f0]].forEach(([ox,oz,c])=>{                             /* ไพ่วางเรียงบนรถ */
      const cd = box(.16,.02,.12, c,.01); cd.rotation.y = (ox-.3)*3; cd.position.set(ox,.92,oz); g.add(cd);
    });
    [[.06,1.4,.11],[.36,1.34,.085],[.24,1.5,.07]].forEach(([ox,oy,r])=>{                     /* ดาววิบวับลอยเหนือรถ */
      const stq = box(r,r,.03, 0xffd54f,.01); stq.rotation.z = .78; stq.position.set(ox,oy,.06); g.add(stq);
      const st2 = box(r,r,.03, 0xffd54f,.01); st2.position.set(ox,oy,.06); g.add(st2);
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
/* ============ แผ่นไม้ปูบนน้ำ (ท่าน้ำในบ่อ + ท่าน้ำทะเล) ============
   ⚠⚠ **กติกา 3 ข้อที่ทำให้ของนี้แก้ผิดซ้ำๆ มาหลายรอบ — ห้ามย้อนทุกข้อ (2026-08-14)**
   ① **แผ่นไม้คือ "ตัวพื้น" เอง** ผิวบนอยู่ระดับพื้น (y≈0) เท่ากับหญ้า ⇒ `groundY` ของช่องท่า
      เป็น 0 เหมือนพื้นปกติ ตัวเด็ก/รอยเท้าจุดหมาย/ทุ่นตกปลา จึงวางถูกที่เองโดยไม่ต้องมีเคสพิเศษ
   ② **ปูได้เฉพาะช่องที่เป็นน้ำจริง** (`isWaterDeckTile`) — ปูบนดินเมื่อไหร่จะเห็นเป็น
      "แผ่นไม้วางบนสนามหญ้า" ทันที เพราะบล็อกหญ้าผิวบนอยู่ที่ y=0 เท่ากันเป๊ะ
   ③ **ปูทีละช่องตามกริดจริง ห้ามสร้างเป็นแถบยาวแล้วหมุนเอา** — ของเดิมสร้าง `buildPier(len)`
      ที่ยาวไปทาง +x แล้วหมุน 90° ให้เป็นแนว z **แต่หมุนแล้ว +x กลายเป็น −z** ⇒ ท่าน้ำทะเล
      ถูกวาดเหลื่อมออกไปกลางทะเล 3 ช่อง คนละที่กับช่องที่เดินได้จริง (บั๊กที่ผู้ใช้เจอ)
   ⇒ ตอนนี้แผ่นไม้กับช่องเดินได้มาจากลิสต์เดียวกัน เหลื่อมกันไม่ได้อีกแล้ว */
const DECK_Y = -.03;                       /* กลางแผ่น (หนา .1) ⇒ ผิวบน .02 ≈ ระดับพื้นหญ้า */
/* พื้นไม้ 1 ช่อง — `alongZ` = แนวยาวของท่าไปทางแกน z (ไม้ปูขวางแนวเดิน เหมือนสะพานไม้จริง)
   เสาค้ำใส่เฉพาะ "ด้านที่ติดน้ำ" (ด้านที่ต่อกับช่องท่าด้วยกันไม่ต้องมีเสาคั่นกลางท่า) */
function buildDeckTile(x, z, alongZ){
  const g = new THREE.Group();
  for(let k=0;k<3;k++){
    const c = k===1 ? 0xd9a86c : 0xc98d4e;
    const pl = alongZ ? box(.3,.1,.98,c,.03) : box(.98,.1,.3,c,.03);
    pl.position.set(alongZ ? (k-1)*.335 : 0, DECK_Y, alongZ ? 0 : (k-1)*.335);
    g.add(pl);
  }
  [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dz])=>{
    if(isWaterDeckTile(x+dx, z+dz)) return;
    const ps = cyl(.07,.07,.8,0x8f6231,8);
    ps.position.set(dx*.42, DECK_Y-.44, dz*.42); g.add(ps);
  });
  return g;
}
/* ทุกช่องที่ต้องปูไม้ + แนวไม้ของช่องนั้น — คืน [[x, z, alongZ], ...]
   ⚠ อ่านจากผังชุดเดียวกับ `isWaterDeckTile` เท่านั้น **ห้ามเดาพิกัด/ห้ามคำนวณความยาวเอง** */
function waterDeckTiles(){
  const out = [], seen = new Set();
  const add = (x, z, alongZ) => {
    const k = x + ',' + z;
    if(seen.has(k) || !isWaterDeckTile(x, z)) return;
    seen.add(k); out.push([x, z, alongZ]);
  };
  /* ท่าในบ่อยื่นไปทาง −x เสมอ (กติกาเดียวกับ `isPierTile` — ช่องคือ p.x ถอยหลังไป len ช่อง)
     ⚠ ถ้าจะทำท่าแนว z ต้องแก้ `isPierTile` ให้รู้จักก่อน ไม่ใช่แก้แค่ตรงนี้ */
  POND_PIERS.forEach(p=>{ for(let i=0; i<p.len; i++) add(p.x - i, p.z, false); });
  /* ท่าน้ำทะเล: กรอบสี่เหลี่ยม ยาวตามแกน z (ยื่นจากหาดออกไปในทะเล) */
  SEA_DECKS.forEach(d=>{
    for(let x=d.x0; x<=d.x1; x++) for(let z=d.z0; z<=d.z1; z++) add(x, z, true);
  });
  return out;
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
  } else if(P === 'wand'){                                 /* ไม้กายสิทธิ์ปลายขาว + ดาวเล็กที่ปลาย (พี่มายากล) */
    const wd = cyl(.024,.024,.34,0x3a3540,6); wd.rotation.z = -.5; wd.position.set(.36,.74,.12); hold.add(wd);
    const tp = cyl(.03,.03,.08,0xfbf7f0,6);  tp.rotation.z = -.5; tp.position.set(.28,.9,.12); hold.add(tp);
    [0,1].forEach(i=>{ const st = box(.1,.1,.025,0xffd54f,.01); st.rotation.z = i ? .78 : 0;
      st.position.set(.25,.96,.12); hold.add(st); });
  }
  /* ⚠ ต้องล้าง "ค่าชั่วคราวตอนสร้าง" ทิ้งก่อน merge เสมอ —
     hairShell/addHatHair จด `_hairTop`/`_hairW` ไว้บน head.userData ให้หน้าม้ากับหมวกอ้างอิงตอนประกอบร่าง
     แต่ `mergeDecorGroup()` **ยกเลิกการรวมทันทีที่เจอ userData บนลูกตัวใดตัวหนึ่ง** (กันไปโดนบานพับ/หลอดไฟ)
     ⇒ ที่ผ่านมา NPC ที่มีผม (คือเกือบทุกคน) ไม่เคยถูก merge เลย กลายเป็นคนละ ~27-42 draw call
       ทั้งที่คอมเมนต์ในโค้ดเขียนว่ารวมเหลือคนละ 1 — เจอตอนไล่หาเหตุเฟรมเรตตกที่ตลาด 2026-08-09
     **ห้ามเอาบรรทัดนี้ออก และถ้าเพิ่มค่าชั่วคราวใหม่ตอนสร้างตัวละคร ต้องมาล้างที่นี่ด้วย**
     ⚠ ต้องล้างที่ `core` ไม่ใช่ `g` — ตรงจุดนี้ core ยังไม่ถูก add เข้า b/g (เพิ่งไปต่อในบล็อกข้างล่าง)
       traverse จาก g จะไปไม่ถึงหัวเลย (พลาดมาแล้วรอบแรก) */
  clearBuildScratch(core);
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
  /* ⭐ ดาวลอยเหนือกระดานเควสต์ — เดิมเป็น "ลูกกลมแบน + กรวย 5 อันแปะรอบ"
     แฉกไม่ต่อเนื่องกับตัวดาว มองเห็นเป็นก้อนกลมมีหนาม (ผู้ใช้แจ้ง 2026-08-20)
     ⇒ วาดเส้นรอบรูปดาว 5 แฉกจริงแล้ว extrude + ลบเหลี่ยม (bevel) ให้ดูนุ่มเข้าธีม */
  /* ⚠ **แกน y ของโลก 3D ชี้ขึ้น** (ต่างจาก SVG ที่ y ชี้ลง) ⇒ มุมเริ่ม −π/2 จะได้แฉกชี้ลง
     = ดาวกลับหัว (ผู้ใช้แจ้ง 2026-08-20) ⇒ ต้องเริ่มที่ +π/2 */
  const R = .27, r = .12;
  const sh = new THREE.Shape();
  for(let i = 0; i < 10; i++){
    const a = Math.PI/2 + i * Math.PI/5, rad = i % 2 ? r : R;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    if(i) sh.lineTo(x, y); else sh.moveTo(x, y);
  }
  sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, {depth:.05, bevelEnabled:true,
                                             bevelThickness:.022, bevelSize:.022, bevelSegments:2});
  geo.translate(0, 0, -.045);
  const st = new THREE.Mesh(geo, toonMat(0xffd54f));
  st.castShadow = hShadows;
  g.add(st);
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
  POT_SPOTS.forEach(([x,z])=>{                       /* กระถางต้นไม้ตั้งพื้นตามซอกข้างร้าน */
    const pt = buildPotPlant(x, z);
    pt.position.set(outWX(x), 0, outWZ(z));
    mergeCollectFx(pt, parts, chunkKeyOf(x, z));
  });
  /* ท่าน้ำทั้งหมด (ในบ่อ + ในทะเล) — **ปูทีละช่องจากผังเดียวกับกริดเดินได้**
     ⚠ ห้ามกลับไปสร้างเป็นแถบยาวแล้วหมุน (หมุนแล้ว +x → −z ทำให้ท่าทะเลเหลื่อมไป 3 ช่อง)
     ⚠ ช่องริมฝั่งที่เป็นดินจะไม่อยู่ในลิสต์นี้ = ไม่มีแผ่นไม้วางบนหญ้าอีกต่อไป */
  waterDeckTiles().forEach(([x, z, alongZ])=>{
    const dk = buildDeckTile(x, z, alongZ);
    dk.position.set(outWX(x), 0, outWZ(z));
    mergeCollectFx(dk, parts, chunkKeyOf(x, z));
  });
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
      /* พื้นไม้ของท่าเดินได้ (ค่า 2 เหมือนสะพาน — ระบบเดิน/หาเส้นทางรู้จักค่านี้อยู่แล้ว)
         ⚠ ต้องมาหลังบรรทัดน้ำเสมอ ไม่งั้นถูกทับกลับเป็นน้ำ */
      if(isPierTile(x, z)) t = 2;
      /* สันทรายยื่นลงทะเล — เดินได้เหมือนหาด (ค่า 0) ⇒ ตัววาดพื้นจะปูทรายให้เองตาม isSandTile */
      /* ⚠ **ทะเลไม่มีสันทรายแล้ว** (ผู้ใช้สั่งลบทิ้งแล้วเริ่มใหม่ 2026-08-14)
         เหลือแค่พื้นไม้ที่ปูบนน้ำช่วง x51-52 / z12-15 ซึ่ง "เดินได้" เหมือนพื้นปกติ */
      if(isSeaDeckTile(x, z)) t = 0;
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
  FARM_PROPS.concat(BANNER_POLES, BENCH_SPOTS, CART_SPOTS, CARPENTER_PROPS, POOL_PROPS, PET_PEN_PROPS, POT_SPOTS)
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
  /* ⚠⚠ **ช่องท่าไม้ที่ปูบนน้ำห้ามมีบล็อกพื้นอยู่ข้างใต้** (ผู้ใช้แจ้งซ้ำหลายรอบ 2026-08-14)
     ช่องท่าเดินได้จึงมีค่ากริดเป็น 2 (ท่าในบ่อ) กับ 0 (พื้นไม้ทะเล) **ไม่ใช่ 1**
     ตัวกรองเดิมข้ามแค่ `!== 1` ⇒ ปูบล็อกหญ้าลงไปเต็มๆ ทั้งกลางบ่อและกลางทะเล
     ผลคือแผ่นไม้ดู "วางบนสนามหญ้า" และทะเลมีลิ้นหญ้าเขียวยื่นออกไป — นี่คือต้นเหตุจริง
     ⇒ ใช้ isWaterDeckTile ตัวเดียวกับตอนวาดแผ่นไม้ (ดู js/house-map.js) ทั้ง 2 ลูปด้านล่าง */
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    if(outGrid[z][x]!==1 && !isWaterDeckTile(x,z)) counts[tileKind(x,z)]++;
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
    if(outGrid[z][x]===1 || isWaterDeckTile(x,z)) continue;
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
  [inWX(6), inWX(11)].forEach(wx=>{         /* x6 = ห้องนั่งเล่น (x0-7), x11 = ห้องครัว (x9-13) */
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
      /* avoid = ช่องที่ห้ามเดินผ่าน — ส่งเป็นช่องเดียว {x,z} หรือฟังก์ชัน (x,z)=>bool ก็ได้
         (ชาวบ้านส่งฟังก์ชันมากันไม่ให้เดินเข้าบริเวณบ้านเด็ก ดู npcNoHome) */
      if(avoid && (typeof avoid === 'function' ? avoid(nx, nz) : (nx===avoid.x && nz===avoid.z))) continue;
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
/* 📱 "เครื่องจอสัมผัส" — ใช้แทน `isMobileViewport()` (ที่ดูแค่ `innerWidth < 768`)
   ⚠ iPad แนวตั้งกว้าง 810-1024 px ⇒ **ถูกนับเป็นเดสก์ท็อป** ทั้งที่เป็นเครื่องเป้าหมายจริงของแอป
     ต้องดูจาก "ความสามารถของเครื่อง" ไม่ใช่ความกว้างจอ */
function isTouchDevice(){
  try{
    if(window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
    return (navigator.maxTouchPoints || 0) > 0;
  }catch(e){ return false; }
}
function applyCamera(){
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  if(hMode==='creator' || hMode==='pet'){   /* แผงสัตว์เลี้ยงใช้เฟรมกล้องเดียวกับ creator */
    if(!isMobileViewport()){
      /* จอใหญ่: แผงตัวเลือกเป็นการ์ดชิดขวา (ดู .house-creator ใน media query ≥768px)
         → จัดตัวละครเต็มตัวกลางพื้นที่ว่างฝั่งซ้าย ด้วย frustum ซ้าย/ขวาไม่สมมาตร
         */
      const H = 4.2, W = H*aspect;
      const vw = window.innerWidth;
      const panelW = Math.min(400, vw*.44) + 36;      /* กว้างแผง + ระยะขอบขวา/ช่องไฟ */
      const vc = ((vw - panelW)/2) / vw;              /* สัดส่วนแนวนอนที่อยากให้ตัวละครอยู่ */
      camera.left = -vc*W; camera.right = (1-vc)*W;
      camera.top = 2.2; camera.bottom = camera.top - H;
    }else{
      /* มือถือ: แผงเป็น bottom sheet — พื้นที่ว่างจริงคือระหว่างแถบบน (~70px)
         กับขอบแผง (~60vh) จัดเฟรมให้หัวจรดรองเท้าอยู่ในช่องนั้นพอดี ไม่โดนตัด/บัง
         */
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
  if(hShadows){
    renderer.shadowMap.enabled = true;
    /* 📊 จูนจากตัวเลขที่วัดบน iPad จริง (2026-08-22): JS 0.3-0.6 ms · ส่งวาด 2.6 ms
       แต่เฟรมจริง 25-33 ms ⇒ **~90% เป็นงานฝั่ง GPU** และ **fps เท่ากันหมดทั้งหน้าบ้านโล่งๆ
       กับกลางตลาดที่ของแน่น** ⇒ ตัวถ่วงไม่ใช่จำนวนของ/สามเหลี่ยม/draw call
       แต่เป็น **งานต่อพิกเซล** (shadow map + ตัวกรองเงา + fill rate)

       ⇒ บนเครื่องจอสัมผัส (แท็บเล็ตเด็ก = เครื่องเป้าหมาย) ใช้ `PCFShadowMap` แทน `PCFSoftShadowMap`
         soft สุ่ม texture หลายจุดต่อ 1 พิกเซลที่อยู่ในเงา ⇒ แพงกว่ามาก
         ขอบเงาคมขึ้นนิดเดียว ฉากเป็นสีแบนการ์ตูนอยู่แล้วแทบดูไม่ออก
       🔒 **เดสก์ท็อปยังได้ของเดิมทุกอย่าง** (มีกำลังเหลือ ไม่มีเหตุผลต้องลดคุณภาพ)
       🔒 **ห้ามปิดเงา** — ผู้ใช้ยืนยัน 2026-08-22 ว่าไม่ต้องการให้เงาหายไป */
    renderer.shadowMap.type = isTouchDevice() ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    /* 🕐 **เงาต้องอัปเดตทุกเฟรมเสมอ — ห้ามหรี่เป็นเว้นเฟรมอีก** (ผู้ใช้แจ้ง 2026-08-22)
       เคยลองตั้ง `autoUpdate = false` แล้วสั่ง `needsUpdate` เว้นเฟรมเพื่อลดงาน GPU ครึ่งหนึ่ง
       คิดว่าเงาตามช้า 1 เฟรมจะมองไม่ออก — **แต่บน iPad จริงเห็นเป็นเงากระตุกชัดเจน**
       (เงาอยู่นิ่ง 1 เฟรมแล้วกระโดดตามตัว สลับกันไปตลอดเวลาที่เดิน = สะดุดตากว่าเฟรมเรตที่ได้คืนมา)
       ⇒ คืนเป็นค่าเริ่มต้นของ three (อัปเดตทุกเฟรม) · ส่วนที่ยังเก็บไว้คือ **ตัวกรองเงาแบบเบา**
         (`PCFShadowMap` บนเครื่องจอสัมผัส) ซึ่งลดงานต่อพิกเซลโดยไม่ทำให้จังหวะเงาเปลี่ยน */
  }

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
  bindPrevCardDrag();
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
      if(pinchDist>0){ fishZoomWant = 0; fishZoomBase = 0; fishZoomOff = true; setZoom(hZoom * (d/pinchDist)); }
      pinchDist = d;
    }
  });
  /* ---------- hover: วางเมาส์บนชาวบ้าน = เคอร์เซอร์เปลี่ยนเป็นฟองคำพูด ----------
     บอกเด็ก(และผู้ปกครองที่เล่นด้วย)ว่า "คนนี้คุยได้" โดยไม่ต้องลองกดมั่ว
     ⚠ ทำงานเฉพาะเมาส์/trackpad — จอสัมผัสไม่มี hover และ pointermove ของนิ้วจะยิงรัวมาก
     ⚠ **raycast ใส่เฉพาะตัว NPC ไม่ใช่ทั้งฉาก** + throttle 90ms ไม่งั้นกินเฟรมเรตตอนลากเมาส์ */
  let hoverT = 0, hoverTimer = 0, hoverX = 0, hoverY = 0, hoverTalk = false;
  function setTalkHover(on){
    on = !!on;
    if(hoverTalk === on) return;
    hoverTalk = on;
    canvas.classList.toggle('house-talk-hover', on);
  }
  /* ตัวที่ "คุยได้" = ชาวบ้านในเมือง (ฉากนอก) + พ่อแม่ในบ้าน (ฉากใน) */
  function talkTargets(){
    if(hScene === 'in') return Object.keys(parentObjs).map(w=>parentObjs[w].g).filter(Boolean);
    return npcs.map(n=>n.g);
  }
  function npcUnderPointer(cx, cy){
    const gs = talkTargets();
    if(!gs.length) return false;
    raycaster.setFromCamera(ndcFromClient(cx, cy), camera);
    return raycaster.intersectObjects(gs, true).length > 0;
  }
  function hoverCheck(){
    hoverT = performance.now();
    setTalkHover(houseOpen && hMode === 'world' && !editMode
      && !document.body.classList.contains('house-photo')
                 && npcUnderPointer(hoverX, hoverY));
  }
  canvas.addEventListener('pointermove', e=>{
    if(e.pointerType === 'touch') return;
    if(pointers.size) return;                    /* กำลังลาก/กดค้างอยู่ ไม่ต้องเช็ค hover */
    hoverX = e.clientX; hoverY = e.clientY;
    const wait = 90 - (performance.now() - hoverT);
    if(wait <= 0){ hoverCheck(); return; }
    /* ⚠ ต้องมี trailing edge ด้วย — ถ้า throttle ทิ้ง event สุดท้ายไป แล้วผู้ใช้หยุดเมาส์ค้างบนตัว NPC พอดี
       จะไม่มี event ตามมาอีกเลย เคอร์เซอร์ก็ไม่เปลี่ยนทั้งที่ชี้อยู่บนตัวคน (เจอตอนเขียนเทส 2026-08-09) */
    if(!hoverTimer) hoverTimer = setTimeout(()=>{ hoverTimer = 0; hoverCheck(); }, wait);
  });
  canvas.addEventListener('pointerleave', ()=>{
    if(hoverTimer){ clearTimeout(hoverTimer); hoverTimer = 0; }
    setTalkHover(false);
  });
  window.__houseTalkHover = ()=> hoverTalk;      /* จุดต่อชุดเทส */
  /* จุดต่อชุดเทส: "พิกัดจอนี้มีตัวที่คุยได้อยู่ไหม" — เช็คเรขาคณิตล้วน ไม่ผ่าน throttle/สถานะ hover
     ⚠ เทสที่ต้องการ "ที่ว่าง" ต้องหาผ่านตัวนี้ **ห้าม hardcode พิกัด** เพราะแต่ละขนาดจอมุมกล้องต่างกัน
       จุดที่ว่างบนจอ desktop อาจมีคนยืนอยู่พอดีบนจอ tablet (เทสแดงแบบนี้มาแล้ว 2026-08-10) */
  window.__houseTalkAt = (cx, cy)=> npcUnderPointer(cx, cy);
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
    fishZoomWant = 0; fishZoomBase = 0; fishZoomOff = true;   /* คนปรับเอง = เลิกคุมอัตโนมัติ */
    setZoom(hZoom * (e.deltaY > 0 ? .92 : 1.08));
  }, {passive:false});
}
/* เฟส 5: แผนที่ใหญ่ขึ้นอีก แต่จำกัดการซูมออกไว้ที่ .6 (ซูมออกกว่านี้ของจะเล็กจนเด็กแตะพลาด) */
function setZoom(z){ hZoom = Math.min(1.8, Math.max(.85, z)); applyCamera(); }

/* ================= 📊 แผงวัดเฟรมเรต (เครื่องมือวัดบนเครื่องจริง · 2026-08-22) =================
   ⚠ **เปิดด้วย URL `?fps=1` เท่านั้น** — จงใจไม่ผูกกับสวิตช์ `DEV_ENABLED`
     เพราะสวิตช์ชุดนั้นต้องเป็น `false` เสมอตอน deploy ⇒ ถ้าผูกไว้ จะวัดบนเครื่องจริงไม่ได้เลย
     ส่วนแบบนี้เด็กไม่มีวันเห็น (ต้องพิมพ์ต่อท้าย URL เอง) และไม่ต้องแก้โค้ดก่อน/หลัง deploy

   ทำไมต้องแยก "เวลา JS" ออกจาก "เวลาเรนเดอร์": เครื่องเทส headless เรนเดอร์ด้วย CPU
   (SwiftShader) วัดแทน iPad ไม่ได้เลย ⇒ ต้องรู้ให้ได้ว่าคอขวดอยู่ที่ GPU (เงา/สามเหลี่ยม)
   หรือที่ CPU (งาน JS ต่อเฟรม) **ก่อน** จะลงมือแก้ ไม่งั้นเดาผิดทางเสียเวลาทั้งวัน
   ⚠ `renderer.render()` เป็น **asynchronous** — ตัวเลข "เรนเดอร์" ที่วัดได้คือเวลาที่ใช้
     ส่งคำสั่งลง GPU ไม่ใช่เวลาที่ GPU วาดเสร็จจริง · ถ้า JS+เรนเดอร์รวมกันน้อยกว่าคาบเฟรมมาก
     แต่ fps ยังต่ำ = **คอขวดอยู่ที่ GPU** (นี่คือวิธีอ่านผลของแผงนี้) */
const FPS_PANEL = (function(){
  try{ return new URLSearchParams(location.search).get('fps') === '1'; }catch(e){ return false; }
})();
let fpsEl = null, fpsT = 0, fpsJs = 0, fpsRen = 0, fpsN = 0;
const fpsLog = [];
function fpsPanelTick(dtMs, jsMs, renMs){
  if(!FPS_PANEL) return;
  if(!fpsEl){
    fpsEl = document.createElement('div');
    fpsEl.id = 'house-fps';
    fpsEl.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;'
      + 'background:rgba(20,12,4,.82);color:#FFE9B8;font:600 12px/1.5 ui-monospace,monospace;'
      + 'padding:7px 10px;border-radius:10px;white-space:pre;';
    document.body.appendChild(fpsEl);
  }
  fpsLog.push(dtMs); if(fpsLog.length > 60) fpsLog.shift();
  fpsJs += jsMs; fpsRen += renMs; fpsN++;
  fpsT += dtMs;
  if(fpsT < 500) return;                       /* อัปเดตข้อความวินาทีละ 2 ครั้งพอ (กันแผงเองกินเฟรม) */
  fpsT = 0;
  const srt = fpsLog.slice().sort((a, b) => a - b);
  const med = srt[srt.length >> 1] || 1;
  const p95 = srt[Math.min(srt.length - 1, Math.floor(srt.length * .95))] || 1;
  const inf = renderer ? renderer.info.render : {calls:0, triangles:0};
  const dpr = renderer ? renderer.getPixelRatio() : 0;
  fpsEl.textContent =
      'fps ' + (1000 / med).toFixed(0) + '  (แย่สุด ' + (1000 / p95).toFixed(0) + ')\n'
    + 'เฟรม ' + med.toFixed(1) + ' ms\n'
    + 'JS ' + (fpsJs / fpsN).toFixed(1) + ' ms · ส่งวาด ' + (fpsRen / fpsN).toFixed(1) + ' ms\n'
    + 'draw ' + inf.calls + ' · ' + (inf.triangles / 1000).toFixed(0) + 'K tri\n'
    + (hShadows ? 'เงา ON' : 'เงา OFF') + ' · dpr ' + dpr + ' · ' + window.innerWidth + 'px';
  fpsJs = 0; fpsRen = 0; fpsN = 0;
}

/* ================= 🧭 เป้าหมายของลูกศรนำทาง (ผู้ใช้สั่ง 2026-08-21) =================
   🔒 **ลูกศรมีแบบเดียวในเกม = ลูกศร 2 มิติที่โคจรรอบตัวเด็ก (`#house-qarrow`)**
      ของเดิมทำไว้ให้เควสต์เก็บของตั้งแต่ 2026-08-16 แล้ว — รอบนี้เอามาใช้กับ
      **บทเรียนสอนเล่นและเควสต์ที่ต้องเดินทุกแบบ**
   ❌ เคยลองทำลูกศร 3 มิติลอยเหนือหัวเด็ก ผู้ใช้สั่งให้เอาออก (2026-08-21) —
      **ห้ามทำกลับมาอีก** ตัวโคจรรอบตัวเด็กอ่านง่ายกว่าและไม่ชนป้ายชื่อเหนือหัว

   ที่นี่มีแค่ "ตอนนี้ควรชี้ไปช่องไหน" ส่วนการวาดอยู่ที่ `updateQuestArrow()` */
let guideForce = null;                  /* บทเรียนสั่งเป้าหมายเองได้ — มาก่อนเควสต์เสมอ */
/* 🍃 นำทางไปเก็บของประจำวัน — **เปิดจากปุ่มในแผงกิจกรรมเท่านั้น** (ผู้ใช้สั่ง 2026-08-22)
   กติกาเดิม (2026-08-16) ห้ามให้กิจกรรมรายวันโชว์ลูกศรเอง เพราะกิจกรรมเปิดค้างทั้งวัน
   ⇒ ลูกศรจะรบกวนเด็กที่แค่อยากเดินเล่น · ทางนี้ไม่ขัดข้อนั้นเพราะ **เด็กกดเปิดเอง กดปิดเองได้**
   และดับเองอัตโนมัติเมื่อเก็บครบ */
let guideCol = false;
/* เป้าหมายของเควสต์ที่กำลังทำอยู่ (null = ไม่มี/ปลายทางเป็นพื้นที่กว้าง ไม่ใช่จุดเดียว) */
function questGuideTile(){
  if(!walkQuest) return null;
  const npc = () => { const n = NPCS.find(v => v.id === walkQuest.toNpc); return n ? {x:n.x, z:n.z} : null; };
  if(walkQuest.target === 'npc') return npc();
  if(walkQuest.target === 'mart'){
    if(walkQuest.leg !== 1) return npc();
    const l = LOT_BY_ID['shop-mart']; const d = l ? lotDoorTile(l) : null;
    return d ? {x:d.x, z:d.z} : null;
  }
  if(walkQuest.target === 'catch'){
    if(catchDone()) return npc();
    /* ยังทำไม่ครบ → ชี้ไปจุดตกปลาของแหล่งน้ำที่สั่งไว้ (งานเก็บของมีตัวเลือกของตัวเองด้านล่าง) */
    if(walkQuest.need.some(r => r.k === 'fish')){
      const sea = walkQuest.where === 'sea';
      const sp = POND_FISH_SPOTS.concat(seaFishSpots()).filter(x => !!x.sea === sea)[0];
      return sp ? sp.stand : null;
    }
  }
  return null;
}

/* ================= 🎣 ซูมเข้าอัตโนมัติตอนยืนจุดตกปลา (ผู้ใช้สั่ง 2026-08-21) =================
   ทุ่นอยู่ห่างจากช่องที่ยืน 2 ช่อง ⇒ ที่ซูมปกติทุ่นเล็กมาก เด็กแตะพลาดบ่อย
   ⇒ ก้าวขึ้นท่าเมื่อไหร่ กล้องค่อยๆ ซูมเข้า · เดินออกไปก็ค่อยๆ ซูมกลับ **ระยะเดิมก่อนซูมเข้า**

   🔒 กติกา
   - **จำระยะเดิมไว้ตอนเริ่มซูมเข้า** แล้วคืนค่านั้นเป๊ะ — เด็กอาจตั้งซูมเองไว้ก่อนแล้ว
     (`hZoom` เปลี่ยนได้จากล้อเมาส์/นิ้วหนีบ) การรีเซ็ตเป็น 1 จะกลืนค่าที่เด็กตั้งไว้
   - **เด็กปรับซูมเองระหว่างอยู่บนท่า = ยกเลิกระบบอัตโนมัติทันที** (ให้คนชนะเครื่องเสมอ)
   - ไล่ค่าแบบไม่ขึ้นกับเฟรมเรต (`1 - exp(-k·dt)`) เครื่องช้า/เร็วได้ความเร็วเท่ากัน
   - เช็คจาก **`pondFishSpots()` ของจริง ห้ามเขียนพิกัดตายตัวที่นี่** (ผังย้ายจุดตกปลามาแล้ว)
     นับ "อยู่บนท่า" = ยืนทับช่องนั้นหรือช่องข้างเคียง 1 ช่อง (ท่าไม้ยาวกว่า 1 ช่อง) */
const FISH_ZOOM = 1.55;               /* เพดานคือ 1.8 — เผื่อให้เด็กหนีบนิ้วซูมต่อได้อีก */
let fishZoomBase = 0;                 /* ระยะซูมก่อนเข้าโหมดตกปลา (0 = ยังไม่ได้ซูมเข้า) */
let fishZoomWant = 0;                 /* ระยะที่กำลังไล่เข้าหา (0 = ไม่ได้คุมอยู่) */
/* 🖐️ เด็กปรับซูมเองระหว่างยืนบนท่า = ยกให้คนคุมจนกว่าจะเดินออกจากท่า
   ⚠ ล้างแค่ base/want ไม่พอ — เฟรมถัดไปจะเห็นว่า "ยืนบนท่าแต่ยังไม่ได้ซูม" แล้วซูมเข้าใหม่ทันที
     (คนหมุนล้อออก เครื่องดึงกลับเข้า = แย่งกันไปมา) จึงต้องมีธงแยกที่อยู่จนกว่าจะออกจากท่า */
let fishZoomOff = false;
function nearFishStand(){
  const t = hChar && hChar.tile; if(!t || hScene !== 'out') return false;
  const list = POND_FISH_SPOTS.concat(seaFishSpots());
  for(let i = 0; i < list.length; i++){
    const st = list[i].stand;
    if(Math.abs(st.x - t.x) <= 1 && Math.abs(st.z - t.z) <= 1) return true;
  }
  return false;
}
function updateFishZoom(dt){
  const on = nearFishStand();
  if(!on) fishZoomOff = false;                 /* ออกจากท่าแล้ว = ระบบกลับมาทำงานรอบหน้าได้ */
  if(on && fishZoomOff) return;                /* คนสั่งเองอยู่ ไม่ต้องไปยุ่ง */
  if(on && !fishZoomBase){                     /* ก้าวขึ้นท่า → จำระยะเดิมแล้วเริ่มซูมเข้า */
    fishZoomBase = hZoom;
    fishZoomWant = Math.max(hZoom, FISH_ZOOM); /* ซูมอยู่ใกล้กว่านั้นแล้วก็ไม่ต้องถอยออก */
  }else if(!on && fishZoomBase){               /* เดินออก → กลับระยะเดิมเป๊ะ */
    fishZoomWant = fishZoomBase;
    fishZoomBase = 0;
  }
  if(!fishZoomWant) return;
  const d = fishZoomWant - hZoom;
  if(Math.abs(d) < .004){
    /* 🐞 **ต้องลงล็อกให้ตรงเป๊ะ ห้ามปล่อยค่าเศษค้างไว้** — การไล่ค่าแบบ exponential
       ไม่มีวันถึงเป้าพอดี ถ้าหยุดตรงนี้เฉยๆ เศษที่เหลือจะกลายเป็น "ระยะเดิม" ของรอบถัดไป
       ⇒ เข้า-ออกท่าซ้ำๆ แล้วซูมค่อยๆ ไหลขึ้นเรื่อยๆ (วัดจริง: 1.000 → 1.015 → 1.022 → 1.032) */
    setZoom(fishZoomWant);
    if(!on) fishZoomWant = 0;                  /* ถึงแล้วและออกมาแล้ว = ปล่อยการควบคุมคืนให้เด็ก */
    return;
  }
  setZoom(hZoom + d * (1 - Math.exp(-4.5 * dt)));
}

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
  /* ⚠ **ท่าไม้ต้องเป็น "พื้นเดินได้ธรรมดา"** (ผู้ใช้สั่ง 2026-08-14) — เดิมแตะแล้วติด effect
     ของฉาก (เขย่าหญ้า/ทักทายล็อต) ซึ่งไม่เข้ากับพื้นไม้ ⇒ เดินไปเฉยๆ พอ
     ต้องเช็คก่อนทุกสาขา เพราะท่าอยู่บนผิวน้ำที่มีตรรกะของตัวเองอยู่แล้ว */
  {
    const g0 = Math.round(pt.x + (OUT_W-1)/2), gz0 = Math.round(pt.z + (OUT_D-1)/2);
    if(isPierTile(g0, gz0) || isSeaDeckTile(g0, gz0)){ walkTo(g0, gz0, {}); return; }
  }
  const gx = Math.round(pt.x + (OUT_W-1)/2), gz = Math.round(pt.z + (OUT_D-1)/2);
  if(gx<0 || gz<0 || gx>=OUT_W || gz>=OUT_D) return;
  if(shakeTreeLeaves(gx, gz)) return;               /* แตะโดนต้นไม้/พุ่ม → ใบไม้ร่วง (ไม่ต้องเดินไป) */
  /* ⚠ ต้องเช็ค "ช่องนี้เป็นที่นั่ง" **ก่อน** บล็อกถนน/ลานข้างล่างเสมอ (แก้เมื่อ 2026-08-09)
     ม้านั่งในเมืองเกือบทุกตัวตั้งอยู่บนลานน้ำพุ/ลานกิจกรรม/ริมถนน ⇒ ช่องของมันเข้าเงื่อนไข
     isVillageRoadTile/isPlazaTile ด้วย พอบล็อกนั้น return ทิ้งก่อน โค้ด seatNear ข้างล่างจึงไม่เคยถูกเรียก
     ผลคือ **แตะม้านั่งในเมืองแล้วเด็กเดินไปเฉยๆ นั่งไม่ได้เลย** (ม้านั่งในสวน/ริมทุ่งที่อยู่บนหญ้ายังนั่งได้ปกติ) */
  const seatHere = seatMap.get(gx + ',' + gz);
  if(seatHere){ sitOnSeat(seatHere); return; }
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
  /* ⚠ **โหมดถ่ายรูป = ห้ามคุย/เล่น/เดิน** (ผู้ใช้สั่ง 2026-08-14) — ต้องออกจากโหมดก่อน
     ทำที่นี่จุดเดียวเพราะทุกการแตะฉากวิ่งผ่านฟังก์ชันนี้ทั้งหมด */
  if(document.body.classList.contains('house-photo')) return;
  /* กำลังเล่นกิจกรรมกับสัตว์เลี้ยงอยู่ (เฟส 12) = รอให้ท่าจบก่อน ไม่งั้นเด็กสั่งเดินกลางท่าแล้วภาพขาด */
  if(petAct) return;
  /* ---- แตะพื้นที่นอกกล่อง = ปิดกล่องที่เปิดอยู่ (ผู้ใช้สั่ง 2026-08-09) ----
     กล่องพวกนี้เป็น "การ์ดลอย" ไม่ได้คลุมทั้งจอ ⇒ แตะนอกกล่องจะตกมาถึง canvas เสมอ
     จัดการที่นี่จุดเดียวได้เลย ไม่ต้องทำ backdrop ให้แต่ละกล่อง (และไม่บังโลก 3D ด้วย)
     ⚠ ต้อง `return` ทุกกรณี ไม่งั้นเด็กปิดกล่องแล้วตัวละครเดินตามไปด้วยในคลิกเดียว */
  if(questPanelOpen()){ closeQuestBoard(); return; }   /* แผงภารกิจเปิดอยู่ → แตะจอ = ปิดแผงก่อน */
  if(questSummaryOpen()){ closeQuestSummary(); return; }
  if(window.HouseDev && window.HouseDev.isOpen()){ window.HouseDev.close(); return; }
  if(window.HouseQB && window.HouseQB.isOpen()){ window.HouseQB.close(); return; }
  if(questPlayOpen()){ closeQuestPanel(); return; }    /* การ์ดเควสต์/การ์ดคุยพ่อแม่ */
  if(SHOP && SHOP.isOpen()){ SHOP.close(); return; }   /* หน้าร้านเปิดอยู่ → แตะนอกกล่อง = ออกจากร้าน */
  if(window.HousePlay && window.HousePlay.isOpen()){ window.HousePlay.close(); return; }   /* แผงเล่นในเมือง (เฟส 11) */
  if(window.HouseBook && window.HouseBook.isOpen()){ window.HouseBook.close(); return; }   /* สมุดสะสม (เฟส 16) */
  if(petMenuOn){ closePetMenu(); return; }             /* เมนูฟองของสัตว์เลี้ยง (เฟส 12) */
  raycaster.setFromCamera(ndcFromClient(cx,cy), camera);
  /* 🎣 **กำลังตกปลาอยู่ = แตะอย่างอื่นในโลกไม่ได้เลย** (ผู้ใช้สั่ง 2026-08-14)
     ของเดิมเดินหนีไปได้ทั้งที่เบ็ดยังอยู่ในน้ำ ⇒ เห็นทุ่นลอยอยู่คนละมุมกับตัวเด็ก
     ⚠ **ยกเว้นการแตะ "ทุ่น"** เพราะนั่นคือทางดึงเบ็ดในโลก 3D (อีกทางคือปุ่ม "ดึง!" ในแผง)
     ⚠ ไม่มีทางค้าง: ปลาหนีเองใน 1.6 วิถ้าไม่ดึง แล้ว `fishState` เคลียร์ตัวเองที่ tick() */
  /* 🙈 อินโทรซ่อนแอบ — แตะอะไรก็ไม่ได้จนกว่าจะนับจบ (เพื่อนกำลังวิ่งไปแอบตามเส้นทางที่คิดจาก
     ตำแหน่งเด็กตอนเริ่ม · เดินหนีระหว่างนี้ = ทุกคนวิ่งไปรวมที่ช่องเปล่า + ท่าตีกัน) */
  if(seekIntroNow()){
    showToast('🙈', 'หลับตานับก่อนนะ เดี๋ยวค่อยออกไปตามหาเพื่อน!');
    return;
  }
  if(fishingNow()){
    const fh = raycaster.intersectObjects(worldGroup.children, true);
    for(let i = 0; i < fh.length; i++){
      let o = fh[i].object;
      while(o && o !== worldGroup){
        if(o.userData.hPick && window.HousePlay.tapPick(o.userData.hPick)) return;
        o = o.parent;
      }
    }
    showToast('🎣', 'กำลังตกปลาอยู่นะ แตะที่ทุ่นเพื่อดึงเบ็ดก่อน แล้วค่อยไปเดินเล่นต่อ');
    return;
  }
  if(hScene==='out'){
    /* ยิง ray ใส่ของทั้งฉากแล้วไล่หา tag ที่ ancestor: สัตว์ > บ้าน > ของตกแต่ง > ฉากตายตัว
       (ชนพื้น/ฐานดินจะไม่เจอ tag แล้วตกไปคำนวณช่องเดินจากระนาบพื้นด้านล่างแทน) */
    const hits = raycaster.intersectObjects(worldGroup.children, true);
    if(hits.length){
      let o = hits[0].object;
      while(o && o !== worldGroup){
        /* เฟส 11: ของของมินิเกมกลุ่ม A (ของสะสม/ทุ่นตกปลา/แปลงผัก) — เช็คก่อนใครเพราะเป็นของ
           ชิ้นเล็กที่วางบนพื้น ถ้าไปอยู่ท้ายแถวจะถูกของฉากที่ใหญ่กว่าบังจนแตะไม่โดน */
        if(o.userData.hPick && window.HousePlay){
          if(window.HousePlay.tapPick(o.userData.hPick)) return;
        }
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
        /* 📔 เฟส 16: แตะสัตว์ในคอกฟาร์ม = จดลงสมุดสะสม แล้ว **ไม่ return** ให้เดินไปหาต่อตามปกติ */
        if(o.userData.hFarm && window.HouseBook) window.HouseBook.mark('critter', o.userData.hFarm);
        if(o.userData.hStatic){ tapStaticScene(hits[0].point); return; }
        o = o.parent;
      }
    }
  }else{
    if(hPet.group && raycaster.intersectObject(hPet.group, true).length){ playWithPet(); return; }
    /* พ่อ-แม่ (เฟส 4A) — เช็คก่อนของตกแต่ง เพราะยืนอยู่บนพื้นห้องที่มีเฟอร์นิเจอร์รอบตัว */
    { const gs = Object.keys(parentObjs).map(w=>parentObjs[w].g).filter(Boolean);
      if(gs.length){
        const ph = raycaster.intersectObjects(gs, true);
        if(ph.length){
          let o = ph[0].object;
          while(o){ if(o.userData && o.userData.hParent){ walkToParent(o.userData.hParent); return; } o = o.parent; }
        }
      } }
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

/* 🎣 กำลังตกปลาอยู่ไหม — เช็คผ่านประตูสาธารณะของ js/house-play.js (house.js ไม่รู้จัก state ข้างใน) */
function fishingNow(){ return !!(window.HousePlay && window.HousePlay.fishState && window.HousePlay.fishState()); }
/* 🙈 กำลังเล่นอินโทรซ่อนแอบอยู่ไหม (เพื่อนวิ่งมารวม → คุย → นับถอยหลัง → วิ่งไปแอบ)
   ⚠ **ช่วงนี้เด็กต้องเดินไม่ได้** (ผู้ใช้แจ้ง 2026-08-16) — เพื่อนคำนวณเส้นทางจาก
     "ช่องที่เด็กยืนตอนเริ่ม" ถ้าเด็กเดินหนีระหว่างนั้น ทุกคนจะวิ่งไปรวมที่ช่องเปล่า
     และท่านั่งยองจะตีกับท่าเดินจนภาพเพี้ยนทั้งฉาก */
function seekIntroNow(){
  return !!(window.HousePlay && window.HousePlay.seekIntroActive && window.HousePlay.seekIntroActive());
}
function walkTo(gx, gz, opts){
  opts = opts || {};
  /* 🎣 **ตกปลาอยู่ = เดินไม่ได้** — กันที่นี่เพราะเป็นทางเดียวที่ทุกอย่างวิ่งผ่าน
     (แตะพื้น · แตะชาวบ้าน · ปุ่มเข็มทิศกลับบ้าน · เควสต์สั่งเดิน) `handleTap` กันไว้อีกชั้นเพื่อ
     ให้ได้ toast อธิบาย ส่วนตรงนี้เป็นตะแกรงสุดท้ายกันทางที่ไม่ผ่าน handleTap */
  if(fishingNow()) return;
  if(seekIntroNow()) return;      /* 🙈 อินโทรซ่อนแอบ — ห้ามขยับจนกว่าจะนับจบ */
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
  if(hChar.walking) showWalkMark(hChar.path, startTile);
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
    if(a.type==='play2'){ if(window.HousePlay) window.HousePlay.arrive(a.pick); }
    else if(a.type==='wild') rustleWild(a);
    else if(a.type==='lot') greetLot(a);
    else if(a.type==='npc'){ const n = npcs.find(k=>k.def.id===a.npc); if(n) talkToNpc(n); }
    else if(a.type==='parent'){ tapParent(a.who); }
    else if(a.type==='board') openQuestBoard();
    else if(a.type==='play') playAtItem(a.idx);
    else if(a.type==='decor'){
      const g = a.group, item = a.item, act = a.act;
      /* 🕰️ เควสต์ "ทำกิจวัตรจริง" นับตรงนี้ — เด็กแตะของชิ้นไหนในบ้านก็แจ้งหมวดของชิ้นนั้นไป
         ⚠ ต้องอยู่**ก่อน**การกระทำจริง เพราะบางอย่าง (นั่ง/นอน) หน่วงเวลาก่อนทำงาน */
      questCaught('use', item.cat || '');
      if(act==='slide') startSlideRide(g, item);
      else if(act==='pethouse') togglePetRest(g);
      else if(act==='sit' || act==='sleep') startSit(g, item, act);
      else if(act==='toggle') decorToggle(g);
      else if(act==='spin') decorSpin(g);
      else if(act==='music') playInstrument(g, item);   /* เฟส 9: เครื่องดนตรี — แตะแล้วมีเสียงจริง */
      /* 🗑️ `act==='tank'` (แตะตู้ปลา → เปิด popup) **ถูกยกเลิกทั้งระบบ 2026-08-17 (ผู้ใช้สั่ง)**
         popup ไม่เหมือนตู้ปลาจริง ไอคอน/อนิเมชันปลาไม่สวย ⇒ ปลาที่ตกได้ย้ายไปสมุดสะสม (เฟส 16)
         ตอนนี้ตู้ปลาตกลงมาที่ `decorBounce` เหมือนของตกแต่งชิ้นอื่น — แตะแล้วเด้ง ไม่เงียบ */
      else if(act==='basket'){ if(window.HousePlay) window.HousePlay.basketOpen(); }
      /* 🪑 เฟส 17 — ของตกแต่งที่ใช้งานได้จริง (ตัวทำงานอยู่ใน js/house-usable.js)
         ⚠ ไม่มีไฟล์นั้น/ไม่รู้จักชิ้นนี้ = ตกไปเด้งเหมือนเดิม **ห้ามเงียบ** */
      else if(act==='tv'   && USABLE){ if(!USABLE.tvToggle(g)) decorBounce(g); }
      else if(act==='tank' && USABLE){ USABLE.tankFeed(g); decorBounce(g); }
      else if(act==='wash' && USABLE){ USABLE.washUp(g); }
      else if(act==='read' && USABLE){ USABLE.readBook(g); }
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

/* ---------- รอยเท้าบอกจุดหมาย (ผู้ใช้สั่ง 2026-08-13) ----------
   แตะพื้น/แตะของให้เดิน = ปักรอยเท้าคู่หนึ่งไว้ที่ "ช่องที่ตัวละครจะไปหยุดจริง"
   หันไปทางเดียวกับที่ตัวละครจะเดินเข้ามา เด็กจะได้รู้ล่วงหน้าว่าจะไปหยุดตรงไหน
   ⚠ แขวนไว้กับ `scene` ไม่ใช่ `worldGroup` เพราะ
     ① `buildWorld()` สร้าง worldGroup ใหม่ทั้งก้อน (รอยเท้าจะหลุด/ถูก dispose ไปด้วย)
     ② raycast ของ `handleTap()` ยิงใส่ `worldGroup.children` ⇒ อยู่นอกก้อนนี้จึงไม่มีวันบังการแตะพื้น
   การซ่อน/โชว์คุมเองทุกเฟรมที่ `updateWalkMark()` (ตามสถานะเดินจริง ไม่ต้องไปแก้ทุกจุดที่หยุดเดิน) */
let walkMark = null, walkMarkMat = null, walkMarkT0 = 0;

/* รอยเท้าคนจริง 1 ข้าง (เท้าขวา ปลายเท้าชี้ขึ้น) วาดเป็น SVG — นิ้วโป้ง 5 นิ้ว + ฝ่าเท้า + เว้าอุ้งเท้า + ส้น
   ใช้พิกัดในกรอบ 136×190 จุดกึ่งกลางรูปอยู่ที่ (68,95) — ตัวเรียกเลื่อน/ย่อ/พลิกซ้าย-ขวาเอง
   ⚠ ผู้ใช้สั่ง 2026-08-13: **ห้ามใส่วงกลม/กรอบรอบรอยเท้า และห้ามทำให้เด่น** — ให้เป็นเงาจางกลืนกับพื้น
     แค่พอให้เด็กเห็นว่าตัวละครจะไปหยุดช่องไหน */
const WALK_MARK_FOOT =
  '<ellipse cx="41" cy="27" rx="11" ry="13"/>' +      /* นิ้วโป้ง (อยู่ด้านในของเท้า) */
  '<ellipse cx="61" cy="22" rx="8.5" ry="10"/>' +
  '<ellipse cx="77" cy="27" rx="7.5" ry="9"/>' +
  '<ellipse cx="90" cy="36" rx="6.5" ry="7.5"/>' +
  '<ellipse cx="100" cy="47" rx="5.5" ry="6.5"/>' +   /* นิ้วก้อย */
  '<ellipse cx="66" cy="68" rx="33" ry="26"/>' +      /* ฝ่าเท้าส่วนหน้า */
  '<path d="M58 84 C50 106 48 128 52 148 L84 150 C92 124 96 100 94 80 Z"/>' +   /* คอดตรงอุ้งเท้า */
  '<ellipse cx="66" cy="152" rx="24" ry="27"/>';      /* ส้นเท้า */

function walkMarkObj(){
  if(walkMark) return walkMark;
  /* ⚠ `opacity` ต้องอยู่ที่ <g> ก้อนเดียว ไม่ใช่รายชิ้น — ไม่งั้นตรงที่รูปทรงซ้อนกัน (นิ้ว/ฝ่าเท้า/ส้น)
       จะเข้มเป็นสองเท่าจนเห็นรอยต่อ กลายเป็นรอยเท้าด่างๆ แทนที่จะเป็นเงาเรียบชิ้นเดียว */
  const foot = (tf)=> '<g transform="'+tf+' translate(-68,-95)">'+WALK_MARK_FOOT+'</g>';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">'
    + '<g fill="#24190f" opacity=".28">'
    + foot('translate(88,150) rotate(-7) scale(-.85,.85)')     /* เท้าซ้าย (พลิกกลับด้าน) อยู่หลัง */
    + foot('translate(168,104) rotate(7) scale(.85,.85)')      /* เท้าขวา ก้าวนำไปข้างหน้า */
    + '</g></svg>';
  const tex = new THREE.TextureLoader().load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  tex.minFilter = THREE.LinearFilter;
  walkMarkMat = new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false, opacity:1});
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(.9, .9), walkMarkMat);   /* พอดีในช่องเดียว (1 ช่อง = 1 หน่วย) */
  plane.rotation.x = -Math.PI/2;        /* วางราบกับพื้น — ด้านบนของภาพชี้ไปทาง −z */
  plane.renderOrder = 6;
  /* ห่อ group อีกชั้นเพื่อหมุนทิศ: ตั้ง rotation.y ที่ตัว mesh ตรงๆ จะไปหมุนรอบแกนตั้งฉากของภาพแทน */
  const g = new THREE.Group();
  g.add(plane);
  g.raycast = ()=>{};                   /* กันไว้อีกชั้น ห้ามกินการแตะจอไม่ว่ากรณีใด */
  plane.raycast = ()=>{};
  g.visible = false;
  scene.add(g);
  walkMark = g;
  return g;
}

/* ความสูงที่ต้องวางรอยเท้า — ของบนพื้นแต่ละแบบสูงไม่เท่ากัน วางต่ำไปคือถูกทับ/จมหาย
   ⚠ ทั้ง 2 เคสนี้เป็นบั๊กจริงที่ผู้ใช้เจอ 2026-08-13 ห้ามลดตัวเลขลงมาโดยไม่เช็คของพวกนี้ก่อน */
function walkMarkY(t){
  /* สะพานไม้: แผ่นพื้นหนา .14 วางที่ y=.05 ⇒ ผิวบน .12 — วางต่ำกว่านี้รอยเท้าจะอยู่ "ใต้สะพาน" มองไม่เห็นเลย */
  if(hScene === 'out' && outGrid && outGrid[t.z] && outGrid[t.z][t.x] === 2) return .16;
  /* พื้นถนน: ก้อนหินกลมแบนที่โรยเป็นลายพื้น (CylinderGeometry สูง .05 วางที่ y=.035) ⇒ ผิวบน .06
     ของเดิมวางที่ .05 ลายหินเลยโผล่ทับรอยเท้าเป็นวงๆ */
  return .10;
}

function showWalkMark(path, startTile){
  if(!scene || hMode !== 'world') return;
  const to = path[path.length-1];
  if(!to) return;
  const from = path.length > 1 ? path[path.length-2] : startTile;
  const g = walkMarkObj();
  const p = tileWorld(to);
  g.position.set(p.x, walkMarkY(to), p.z);
  /* ทิศเดียวกับที่ตัวละครจะหันตอนก้าวเข้าช่องสุดท้าย (+PI เพราะรอยเท้าในภาพชี้ไปทาง −z) */
  const a = tileWorld(from), b = tileWorld(to);
  if(a.x!==b.x || a.z!==b.z) g.rotation.y = Math.atan2(b.x-a.x, b.z-a.z) + Math.PI;
  g.visible = true;
  walkMarkT0 = performance.now();
}

function updateWalkMark(t){
  if(!walkMark) return;
  if(hMode !== 'world' || !hChar.walking || !hChar.path.length){
    if(walkMark.visible) walkMark.visible = false;
    return;
  }
  walkMark.visible = true;
  /* จางเข้ามาเฉยๆ ไม่มีเต้น/ไม่มีวงเรืองแสง — ผู้ใช้สั่งให้กลืนไปกับพื้น ไม่ให้แย่งสายตาจากเมือง */
  const e = Math.min(1, (t - walkMarkT0)/220);
  walkMark.scale.setScalar(.88 + .12*e);
  if(walkMarkMat) walkMarkMat.opacity = e;
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
    if(to==='in'){ hChar.tile = {x:IN_DOOR_TILE.x, z:IN_DOOR_TILE.z+1}; hChar.targetRotY = Math.PI/4; buildParents(); }
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
    if(window.HousePlay) window.HousePlay.onScene(to);   /* มินิเกมกลุ่ม A อยู่ฉากนอกบ้านเท่านั้น */
    if(window.HouseTutor) window.HouseTutor.onScene(to); /* วงแหวนบอกจุดหมายต้องวาดใหม่ทุกครั้งที่เปลี่ยนฉาก */
    applyCamera();
  });
}

/* ---------- โหมดสร้างตัวละคร ---------- */
let charCfgNow = null;      /* หน้าตาที่ใช้สร้างตัวเด็กในฉากล่าสุด (ชุดเทสตรวจว่าไม่โดนของพ่อแม่ทับ) */
function rebuildChar(cfg){
  charCfgNow = cfg;
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
    /* ⚠ แต่งตัวให้พ่อ/แม่ = **ปิดแถวเลือกเพศ** (ผู้ใช้สั่ง 2026-08-09) — เพศถูกกำหนดจากแท็บพ่อ/แม่แล้ว
       ถ้าปล่อยให้เลือกได้ เด็กจะสลับ "คุณแม่" เป็นเด็กชายได้ ซึ่งขัดกับแท็บที่เลือกอยู่ */
    if(row.key === 'gender' && creatorWho !== 'child') return;
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
        /* ⚠ ตั้งเป็น longhand (backgroundImage/backgroundColor) ห้ามใช้ shorthand `background`
           — shorthand จะรีเซ็ต `background-clip` กลับเป็น border-box ทับ CSS ของชิปที่ล็อกอยู่
             ทำให้สีเต็มๆ โผล่ตามช่องว่างของขอบเส้นประเป็นวงประสีสด (บั๊กเดิม 2026-08-07) */
        if(col && typeof col === 'object'){          /* แบบ 2 สี: สวอตช์แบ่งครึ่งบน/ล่างเส้นคม สะอาดเหมือนชิปสีเดียว */
          const hx = v => '#'+v.toString(16).padStart(6,'0');
          b.style.backgroundImage = 'linear-gradient('+hx(col.a)+' 0 50%, '+hx(col.b)+' 50% 100%)';
        }else{
          b.style.backgroundColor = '#'+col.toString(16).padStart(6,'0');
        }
        b.setAttribute('aria-label', row.label+' แบบที่ '+(i+1));
      }else if(row.type==='num'){
        /* แถวของแต่ง (row.none) — ตัวเลือกแรกคือ "ไม่ใส่" โชว์เป็นเครื่องหมายกากบาท ไม่ใช่เลข 1
           (ไม่งั้นเด็กเลือกแบบที่ 1 แล้วไม่มีอะไรขึ้น นึกว่าแอปเสีย) */
        /* เฟส 8C: วาด **รูปของชิ้นนั้นจริงๆ** แทนปุ่มตัวเลข (ข้อ 29 ของ QUEST-DESIGN.md)
           เด็ก 5 ขวบอ่านเลข 7 แล้วไม่มีทางรู้ว่าเป็นหมวกอะไร ⇒ ต้องดูออกด้วยตา
           ⚠ ถ้าแถวไหนยังไม่มีไอคอน `outfitIcon` คืนค่าว่าง → ถอยไปใช้ตัวเลขแบบเดิม ไม่พัง */
        /* ⚠ ต้องส่งเพศไปด้วย — ทรงผมชาย/หญิงที่ index เดียวกันเป็นคนละทรงกันสนิท
           (ผู้ใช้แจ้ง 2026-08-17: เลือกเด็กผู้หญิงแล้วไอคอนทรงผมไม่เปลี่ยนตาม) */
        const ico = (typeof outfitIcon === 'function')
          ? outfitIcon(row.key, i, (cfg.gender | 0) === 1) : '';
        if(ico && !(row.none && i===0)){
          b.classList.add('house-chip-ico');
          b.innerHTML = ico;
          b.setAttribute('aria-label', row.label+' แบบที่ '+(row.none ? i : i+1));
        }else{
          b.textContent = row.none ? (i===0 ? '✖' : String(i)) : String(i+1);
        }
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
            showToast('👗', 'แบบนี้ยังไม่มีนะ ราคา '+SHOP.priceFit(row.key, i)+' บาท ไปซื้อได้ที่ห้างแฟชั่นในเมือง!');
          return;
        }
        const was = cfg[row.key];
        cfg[row.key] = i;
        rebuildChar(cfg);
        /* 🚻 เปลี่ยนเพศ = **ไอคอนทรงผมทั้งแถวต้องวาดใหม่** (ทรงชาย/หญิงคนละชุดกัน)
           ⚠ ถ้าไม่วาดใหม่ เด็กผู้หญิงจะเห็นรูปทรงผมชายค้างอยู่ แล้วกดเลือกได้ทรงที่ไม่ตรงกับรูป */
        if(row.key === 'gender' && was !== i){ buildCreatorRows(cfg); return; }
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

/* เก็บฟองคำพูด/ป้ายลอยทั้งหมดทิ้งทันที — เรียกก่อนสลับไปหน้าที่ไม่ใช่ฉากเมือง
   (ไม่งั้นฟองที่ค้างอยู่จะลอยทับหน้าแต่งตัว/หน้าเลือกสัตว์ก่อนจะหมดเวลาเอง) */
function clearFloatLabels(){
  parentTalk = null; npcTalk = null;
  ['house-npc-bubble','house-char-bubble','house-pet-bubble'].forEach(id=>{
    const el = $(id); if(el) el.classList.remove('on');
  });
  const nm = $('house-char-name'); if(nm) nm.hidden = true;
  const pn = $('house-pet-name');  if(pn) pn.hidden = true;
}
let creatorCfg = null;
/* 'child' = แต่งตัวเด็กเอง · 'dad'/'mom' = แต่งตัวให้พ่อแม่ (เฟส 4A ใช้หน้าเดียวกันทั้งหมด)
   ⚠ ตัวแปรนี้ต้องถูกตั้งทุกครั้งที่เปิดหน้าแต่งตัว ไม่งั้นกดบันทึกแล้วเขียนทับตัวละครผิดคน */
let creatorWho = 'child';
function openCreator(fromWorld, who){
  if(SHOP) SHOP.close();
  closeQuestPanel(); closeQuestBoard();          /* เปิดหน้าแต่งตัวทับหน้าร้านไม่ได้ (กล่อง bottom-sheet ซ้อนกัน) */
  hMode = 'creator';
  creatorState.fromWorld = fromWorld;
  creatorState.rotY = 0; creatorState.rotTarget = 0;
  clearFloatLabels();
  creatorWho = (who === 'dad' || who === 'mom') ? who : 'child';
  const saved = loadHouseData();
  creatorCfg = creatorWho === 'child'
    ? Object.assign({}, H_DEFAULT_CHAR, (saved && saved.char) || {})
    : Object.assign({}, FAMILY.one(creatorWho).char, {gender: creatorWho === 'mom' ? 1 : 0});
  $('house-creator').hidden = false;
  $('house-rotate-wrap').hidden = false;
  $('house-edit-btn').hidden = true;
  refreshChromeBtns();
  $('house-pet-btn').hidden = true; $('house-decorate-btn').hidden = true; $('house-child-chip').hidden = true;
  $('house-hint').hidden = true;
  /* ไอคอนหัวข้อเป็น SVG ให้เข้าชุด template (เสื้อ = ชุดเดียวกับปุ่มแต่งตัว #house-edit-btn, หน้าเด็ก = ชุด row "หนูเป็น...") */
  const _icChild = '<svg class="house-title-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="#ffe0b3" stroke="#e59a5b" stroke-width="2"/><circle cx="9" cy="11" r="1.3" fill="#6b4a2b"/><circle cx="15" cy="11" r="1.3" fill="#6b4a2b"/><path d="M9 14.6 Q12 17 15 14.6" fill="none" stroke="#c9573f" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const _icDress = '<svg class="house-title-ic" viewBox="0 0 24 24" fill="none" stroke="#C0527A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.2 3.6L4 6.2L5.9 10.6L8.2 9.6L8.2 20L15.8 20L15.8 9.6L18.1 10.6L20 6.2L14.8 3.6Q12 7.2 9.2 3.6Z" fill="#FFD6E8"/><path d="M12 15.9c-1.8-1.3-2.6-2.1-2.6-3.1 0-.8.65-1.4 1.4-1.4.5 0 .9.25 1.2.65.3-.4.7-.65 1.2-.65.75 0 1.4.6 1.4 1.4 0 1-.8 1.8-2.6 3.1z" fill="#C0527A" stroke="none"/></svg>';
  const _par = creatorWho !== 'child' ? FAMILY.one(creatorWho) : null;
  renderCreatorTabs();
  $('house-creator-title').innerHTML = _par ? (_icDress + ' แต่งตัวให้' + _par.name)
                                    : fromWorld ? (_icDress + ' แก้ไขตัวละครของหนู')
                                                : (_icChild + ' สร้างตัวละครของหนู');
  /* แถวตั้งชื่อ — โผล่เฉพาะตอนแต่งตัวให้พ่อแม่ (ชื่อเด็กแก้ที่ป้ายชื่อบนหัวจออยู่แล้ว) */
  { const nw = $('house-creator-name-row'), ni = $('house-creator-name');
    if(nw) nw.hidden = !_par;
    if(ni && _par) ni.value = _par.name; }
  worldGroup.visible = false; interiorGroup.visible = false;
  creatorGroup.visible = true;
  rebuildChar(creatorCfg);
  charGroup.position.set(0,0,0);
  charGroup.rotation.y = 0;
  buildCreatorRows(creatorCfg);   /* สร้างแถวตัวเลือกใหม่ทุกครั้ง ให้ปุ่ม active ตรง cfg ปัจจุบัน */
  applyCamera();
}
/* แท็บ 👨 คุณพ่อ / 👩 คุณแม่ ในหน้าแต่งตัว — โผล่เฉพาะตอนแต่งตัวให้พ่อแม่
   สลับแท็บ = บันทึกของคนเดิมก่อน แล้วโหลดของอีกคนมาแทน (ไม่งั้นที่แต่งค้างไว้หาย) */
function renderCreatorTabs(){
  const wrap = $('house-creator-tabs');
  if(!wrap) return;
  wrap.hidden = (creatorWho === 'child');
  if(wrap.hidden) return;
  wrap.innerHTML = '';
  FAMILY.WHO.forEach(w=>{
    const p = FAMILY.one(w);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'he-tab' + (w === creatorWho ? ' active' : '');
    b.innerHTML = '<span class="he-tab-emoji">' + p.icon + '</span><span>' + p.name + '</span>';
    b.onclick = ()=>{
      if(w === creatorWho) return;
      if(typeof playClick==='function') playClick();
      const nm = $('house-creator-name');
      FAMILY.setParent(creatorWho, {name: nm ? nm.value : '', char: creatorCfg});   /* เก็บของคนเดิมไว้ก่อน */
      creatorWho = w;
      creatorCfg = Object.assign({}, FAMILY.one(w).char, {gender: w === 'mom' ? 1 : 0});
      const p2 = FAMILY.one(w);
      if(nm) nm.value = p2.name;
      const ttl = $('house-creator-title');
      if(ttl) ttl.textContent = '✏️ แต่งตัวให้' + p2.name;
      renderCreatorTabs();
      buildCreatorRows(creatorCfg);
      rebuildChar(creatorCfg);
      charGroup.position.set(0,0,0);
      charGroup.rotation.y = 0;
    };
    wrap.appendChild(b);
  });
}
function closeCreator(){
  if(creatorWho !== 'child'){
    /* แต่งตัวให้พ่อแม่ — บันทึกลง data.parents ไม่ใช่ data.char ของเด็ก */
    const nm = $('house-creator-name');
    FAMILY.setParent(creatorWho, {name: nm ? nm.value : '', char: creatorCfg});
    const p = FAMILY.one(creatorWho);
    if(typeof showToast==='function') showToast('🎉', p.name + 'เปลี่ยนลุคใหม่แล้ว!');
    exitCreatorToWorld();
    buildParents();                 /* สร้างตัวใหม่ในบ้านให้ตรงกับที่เพิ่งแก้ */
    return;
  }
  saveHouseData({char: creatorCfg});
  if(typeof showToast==='function') showToast('🎉', 'เก่งมาก! ตัวละครของหนูพร้อมแล้ว');
  exitCreatorToWorld();
  /* ครั้งแรกหลังสร้างตัวละครเสร็จ: บอกทางไปหาเพื่อนตัวน้อย
     ⚠ เฟส 3A เปลี่ยนจาก "เปิดหน้าเลือกสัตว์ให้เลย" เป็นแค่บอกทาง — เพราะสัตว์ต้องซื้อแล้ว
       เด็กใหม่มี 0 เหรียญ ถ้าเด้งหน้าเลือกสัตว์ที่ล็อกทั้งหน้าให้ดู = เจอทางตันตั้งแต่นาทีแรก */
  const d0 = loadHouseData() || {};
  if(!creatorState.fromWorld && !d0.pet && !d0.petPromptSeen){
    saveHouseData({petPromptSeen:true});
    setTimeout(()=>{
      if(houseOpen && hMode==='world' && !editMode && typeof showToast==='function')
        showToast('🐾', 'อยากมีเพื่อนตัวน้อยไหม? ทำภารกิจเก็บเงินแล้วไปเลือกซื้อที่ร้านสัตว์เลี้ยงกลางเมืองได้เลย!');
    }, 1400);
  }
}
/* ยกเลิกการแต่งตัว (ปุ่ม ← ตอนกำลังแก้ไขตัวละคร) — ทิ้งชุดที่เพิ่งลอง กลับไปใช้ชุดที่บันทึกไว้เดิม */
function cancelCreator(){
  if(creatorWho !== 'child'){        /* ยกเลิกตอนแต่งตัวให้พ่อแม่ = ไม่บันทึกอะไรเลย */
    /* ⚠ **ห้ามตั้ง creatorWho='child' ตรงนี้** — exitCreatorToWorld() ต้องเห็นว่ายังอยู่โหมดพ่อแม่
       ถึงจะคืน creatorCfg ของเด็กให้ก่อน rebuildChar ไม่งั้นตัวเด็กกลายเป็นพ่อ/แม่ (บั๊กจริง 2026-08-09) */
    exitCreatorToWorld();
    if(typeof showToast==='function') showToast('↩️', 'ยกเลิกแล้ว ยังเป็นชุดเดิมนะ');
    return;
  }
  const saved = loadHouseData();
  creatorCfg = Object.assign({}, H_DEFAULT_CHAR, (saved && saved.char) || {});
  exitCreatorToWorld();
  if(typeof showToast==='function') showToast('↩️', 'ยกเลิกแล้ว ตัวละครกลับเป็นชุดเดิมนะ');
}
function exitCreatorToWorld(){
  hMode = 'world';
  /* ⚠ **บั๊กที่เคยเจอ 2026-08-09**: ตอนออกจากหน้าแต่งตัวพ่อ/แม่ `creatorCfg` ยังเป็นหน้าตาของพ่อแม่อยู่
     ถ้าเอาไป rebuildChar ตรงๆ **ตัวเด็กจะกลายเป็นพ่อ/แม่ทันที** (โดนทั้งตอนบันทึกและตอนยกเลิก)
     ⇒ ออกจากโหมดพ่อแม่เมื่อไหร่ ต้องดึง char ของเด็กจาก save กลับมาใช้เสมอ */
  if(creatorWho !== 'child'){
    const saved = loadHouseData() || {};
    creatorCfg = Object.assign({}, H_DEFAULT_CHAR, saved.char || {});
  }
  creatorWho = 'child';
  $('house-creator').hidden = true;
  $('house-rotate-wrap').hidden = true;
  $('house-edit-btn').hidden = false;
  refreshChromeBtns();
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
  /* ล็อตที่เป็นร้านเปิดขายแล้ว (เฟส 1: ห้างเฟอร์นิเจอร์/ห้างแฟชั่น · เฟส 3A: ร้านสัตว์เลี้ยง)
     — เดินมาถึงหน้าร้านแล้วเปิดร้านเลย
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
  /* ⚠ ใช้กริดของ "ฉากที่ยืนอยู่ตอนนี้" — เดิม hardcode OUT_* ไว้ พอเอามาใช้ในบ้านจะคำนวณผิดฉาก
     (เฟส 4A ต้องใช้ตอนเด็กเดินไปหาพ่อแม่ในบ้าน) */
  const out = hScene === 'out';
  const grid = out ? outGrid : inGrid, W = out ? OUT_W : IN_W, D = out ? OUT_D : IN_D;
  const cx = Math.round(charGroup.position.x + (W-1)/2);
  const cz = Math.round(charGroup.position.z + (D-1)/2);
  const cand = [];
  [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dz])=>{
    const x = gx+dx, z = gz+dz;
    if(x<0 || z<0 || x>=W || z>=D) return;
    if(!isWalk(grid, W, D, x, z)) return;
    cand.push({x, z, d: Math.hypot(x-cx, z-cz) + (dx && dz ? .35 : 0)});   /* ชอบช่องตรงทิศมากกว่าเฉียง */
  });
  if(!cand.length) return nearestWalkable(grid, W, D, gx, gz);
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
  /* 👋 เฟส 18: เคยช่วยคนนี้มาก่อน = ทักถึงเรื่องที่เคยช่วยก่อนเข้าบทปกติ
     ⚠ **ไม่ทับบทของนกฮูกมาสคอต** (คลังคำให้กำลังใจของหน้าหลัก) และไม่ทับบทเชิญรับงาน */
  let memLine = '';
  if(NEIGH && !d.mascot){
    memLine = NEIGH.greeting(d.id) || '';
    if(memLine) NEIGH.bumpTalk(d.id);
  }
  showTalkBubble($('house-npc-bubble'), d.id, d.icon || '🙂', d.name,
                 memLine ? (memLine + ' ' + say[n.li]) : say[n.li]);
  /* ประโยคยาวให้ฟองคำพูดค้างนานขึ้น จะได้อ่านทัน */
  npcTalk = {n, until: performance.now()
             + Math.max(3600, ((memLine ? memLine + ' ' : '') + (say[n.li] || '')).length * 130)};
  /* ตอนแตะเรียกคุย ตั้ง hold ไว้ 14 วิ (ยืนรอให้เด็กเดินมาถึง) — พอคุยจบแล้วต้องปล่อยให้เดินต่อทันที
     ไม่ใช่ยืนแข็งรอจนครบ 14 วิ (นกฮูกมาสคอตเห็นชัดสุดเพราะเดินได้ทั้งแผนที่) */
  n.hold = Math.max(0, (npcTalk.until - performance.now())/1000) + .4;
  questEvent('talk', d.id);
  if(d.job === 'vendor') questEvent('vendor', d.id);
  if(d.board) setTimeout(()=>{ if(!questPanelOpen() && !questPlayOpen()) openQuestBoard(); }, 700);
  /* งานวันนี้ของคนนี้ (ป้าย "!" เหนือหัว) — ทักทายจบแล้วยื่นงานให้เด็กกดรับเอง
     ถ้ามีงานค้างอยู่ จะยังไม่เปิดหน้าร้านให้ (กล่องซ้อนกันแล้วเด็กงง) คุยอีกรอบหลังทำงานเสร็จค่อยเปิดร้าน */
  /* เฟส 3B — คุณหมอ/พยาบาลมาก่อนงานประจำวัน: สัตว์ป่วยคือเรื่องด่วนที่สุดที่เด็กมาโรงพยาบาล
     (ถ้าปล่อยให้การ์ดรับงานเด้งก่อน เด็กจะหาทางรักษาน้องไม่เจอ) */
  /* ⚠ หน่วงสั้นๆ พอให้ฟองคำพูดโผล่ก่อนการ์ดเลื่อนขึ้นมาเท่านั้น — **ห้ามยาวกว่านี้**
     ผู้ใช้แจ้ง 2026-08-09 ว่าเดิม 900ms รู้สึกอืด เด็กแตะแล้วนึกว่าเกมค้าง */
  if(PETCARE && (d.id === 'npc-doctor' || d.id === 'npc-nurse') && PETCARE.isSick()){
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode && !questPlayOpen()) offerCure(d); }, 280);
    return;
  }
  /* เฟส 7 — งาน "ส่งของถึงมือ": เดินมาถึงตัวคนที่ต้องส่งแล้ว = จบงานทันที
     ⚠ ต้องมาก่อนการเช็คงานประจำวันของคนนี้ ไม่งั้นถ้าเขามีงานของตัวเองด้วย
       การ์ดรับงานใหม่จะเด้งทับ แล้วของที่ถืออยู่ก็ส่งไม่ได้ (เด็กงงว่าทำไมทำไม่จบสักที) */
  if(walkQuest && walkQuest.target === 'npc' && walkQuest.toNpc === d.id){
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) walkQuestArrive('npc'); }, 320);
    return;
  }
  /* 🎣 งาน "ตกปลาไปส่ง" (2026-08-16): มาถึงตัวคนที่สั่งงานแล้ว — ครบแล้วจบงาน ยังไม่ครบก็บอกยอด
     ⚠ ต้อง `return` ทั้ง 2 ทาง ไม่งั้นการ์ดรับงานใหม่ของคนคนเดียวกันจะเด้งทับงานที่ทำค้างอยู่ */
  if(walkQuest && walkQuest.target === 'mart' && walkQuest.toNpc === d.id){
    if(catchDone()){
      setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) walkQuestArrive('mart'); }, 320);
    }else if(typeof showToast === 'function'){
      showToast('🏪', 'ยังไม่ได้ทำที่ร้านเลยนะ ไปที่ร้านสะดวกซื้อก่อน');
    }
    return;
  }
  if(walkQuest && walkQuest.target === 'catch' && walkQuest.toNpc === d.id){
    if(catchDone()){
      setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) walkQuestArrive('catch'); }, 320);
    }else if(typeof showToast === 'function'){
      const rest = walkQuest.need.filter(r => catchGot(r) < r.n)
                     .map(r => r.e + ' ' + r.name + ' อีก ' + (r.n - catchGot(r))).join(' · ');
      showToast('📋', 'ยังไม่ครบนะ — ' + rest);
    }
    return;
  }
  /* 🔒 งานของ "คนคนนี้" ที่เด็กรับไปแล้วและกำลังทำค้างอยู่ — ห้ามยื่นงานใหม่ทับเด็ดขาด
     (ผู้ใช้เจอ 2026-08-22: รับงานนับเป็ดในบ่อจากลุงตกปลา แล้วลุงตกปลาถามใหม่เป็นเกมผสมสี)
     3 สาขาข้างบนดักเฉพาะงานที่ **ปลายทางคือตัวเขาเอง** (`toNpc`) — งานที่ให้ไปทำที่อื่น
     (นับของในย่าน · ไปนั่งโต๊ะ · ไปหาของที่หาย) ไม่มีใครดักเลย จึงหล่นมาถึงบรรทัดยื่นงานใหม่
     ⇒ ตรงนี้ทวนคำสั่งเดิมให้ฟังแทน แล้วออกไป */
  if(walkQuest && walkQuest.run && walkQuest.run.spec && walkQuest.run.spec.npc === d.id){
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) walkHint(); }, 320);
    return;
  }
  const spec = QUESTS ? QUESTS.specForNpc(d.id) : null;
  if(spec && (!spec.done || canRedoQuest(spec))){
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode && !questPlayOpen()) offerQuest(spec); }, 280);
    return;
  }
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

/* ============================================================
   เฟส 2 — กระดานเควสต์ 5 ชุด/วัน + หน้าจอเล่นเควสต์
   โควตากระดานแยกจากเควสต์ NPC เด็ดขาด (ข้อ 19) ⇒ ทำกระดานครบแล้วยังเดินคุย NPC ต่อได้
   ============================================================ */
function npcDefById(id){ return NPC_DEFS.find(d => d.id === id) || null; }
/* ชื่อเรียกเควสต์ให้เด็กอ่าน — บอกว่า "ทำอะไร ให้ใคร" ไม่ใช้ศัพท์เทคนิค */
function questTitle(spec){
  const d = npcDefById(spec.npc);
  const who = d ? d.name : 'ชาวเมือง';
  return (spec.mech === 'count' ? 'นับของให้' : 'ตอบคำถามให้') + who;
}
function questIcon(spec){
  const d = npcDefById(spec.npc);
  return (d && d.icon) || (spec.mech === 'count' ? '🔢' : '❓');
}
/* id ไอคอน SVG ของงานชุดนั้น — งานจากกระดานไม่มี NPC เจ้าของ ⇒ ใช้ไอคอนกระดาน */
function questIcoId(spec){
  const d = npcDefById(spec.npc);
  return (d && d.id) || 'ui-board';
}
function renderQuestList(){
  const list = $('hq-list');
  if(!list || !QUESTS) return;
  /* หัวข้อกระดานเขียนไว้ใน index.html เป็น emoji (ตอนโหลดหน้ายังไม่มี HouseIcons)
     ⇒ พอเปิดกระดานจริงค่อยเปลี่ยนเป็นไอคอน SVG ทับ (แพทเทิร์นเดียวกับหน้าเควสต์วันนี้) */
  {
    const hd = document.querySelector('#house-quest .house-creator-title');
    if(hd && !hd.querySelector('svg'))
      hd.innerHTML = '<span class="hqs-ic">' + hIcon('ui-board', '📋', 24) + '</span><span>กระดานเควสต์วันนี้</span>';
  }
  const st = QUESTS.state();
  list.innerHTML = '';
  for(let i=0; i<QUESTS.BOARD_N; i++){
    const spec = QUESTS.specForBoard(i);
    if(!spec) continue;
    const row = document.createElement(spec.done ? 'div' : 'button');
    row.className = 'hq-row' + (spec.done ? ' done' : ' hq-go');
    const ic = document.createElement('span'); ic.className = 'hq-ic';
    /* 🎨 ไอคอนแถวเป็น SVG (ผู้ใช้สั่ง 2026-08-20) — เสร็จแล้วใช้เครื่องหมายถูก · ยังไม่เสร็จใช้รูปคนที่สั่งงาน */
    ic.innerHTML = spec.done ? hIcon('ui-check', '✅', 26)
                             : hIcon(questIcoId(spec), questIcon(spec), 26);
    const tx = document.createElement('span'); tx.className = 'hq-txt'; tx.textContent = questTitle(spec);
    const pg = document.createElement('span'); pg.className = 'hq-prog';
    pg.textContent = spec.done ? 'เสร็จ' : 'เล่นเลย';
    row.appendChild(ic); row.appendChild(tx); row.appendChild(pg);
    if(!spec.done) row.addEventListener('click', ()=>{ closeQuestBoard(); startQuest(spec); });
    list.appendChild(row);
  }
  const left = QUESTS.boardLeft();
  const sub = $('hq-sub');
  /* โบนัสครบ 5 ชุดกลับมาแล้ว (10 🪙) — แต่ข้อความยังต้องไม่กดดันว่า "ต้องทำให้ครบ" (กติกาเหล็กข้อ 2) */
  if(sub) sub.textContent = left
    ? ('เหลืออีก ' + left + ' ชุด ทำได้เท่าไหร่ก็เก่งแล้วนะ')
    : (QUESTS.boardBonusReady() ? 'ครบ 5 ชุดแล้ว! กดรับโบนัสได้เลย'
                                : 'วันนี้ทำครบทุกชุดแล้ว เก่งมาก! พรุ่งนี้มีงานใหม่มาอีกนะ');
  const btn = $('hq-claim');
  if(btn){
    btn.hidden = !QUESTS.boardBonusReady();
    btn.innerHTML = 'รับโบนัสครบ 5 ชุด <i class="hs-coin"></i>' + QUESTS.BOARD_BONUS;
  }
  const stEl = $('hq-stars');
  if(stEl){
    stEl.innerHTML = '<span class="hqs-ic">' + hIcon('ui-star', '⭐', 18) + '</span>';
    stEl.appendChild(document.createTextNode(' ดาวสะสม ' + (st.stars | 0) + ' ดวง'));
  }
}
function openQuestBoard(){
  if(!QUESTS){
    if(typeof playClick==='function') playClick();
    if(typeof showToast==='function') showToast('📜', 'กระดานยังว่างอยู่ เร็วๆ นี้จะมีภารกิจสนุกๆ มาให้ทำนะ!');
    return;
  }
  closeQuestPanel();
  renderQuestList();
  const el = $('house-quest'); if(el) el.hidden = false;
  if(typeof playClick==='function') playClick();
}
function closeQuestBoard(){ const el = $('house-quest'); if(el) el.hidden = true; }
/* โบนัสทำกระดานครบ 5 ชุด (10 🪙 · ผู้ใช้สั่งเอากลับมา 2026-08-09) — ไม่มีบทลงโทษถ้าวันก่อนทำไม่ครบ */
function claimQuestReward(){
  if(!QUESTS || !QUESTS.boardBonusReady()) return;
  const got = QUESTS.boardClaim();
  if(!got) return;
  awardCoins(got);
  renderQuestList();
  refreshQuestMark();
  questBarKey = '';
  if(questBoardObj) for(let i=0; i<12; i++)
    spawnParticle(questBoardObj.position.x + (Math.random()-.5)*2, 1.8 + Math.random()*1.4,
                  questBoardObj.position.z + .5 + Math.random()*.6,
                  [0xffd54f, 0xff8fb3, 0x7fc4e8, 0xfff1a8][i%4]);
  if(typeof playCongrats==='function') playCongrats();
  charBubble('⭐');
  if(typeof showToast==='function') showToast('⭐', 'เก่งมาก! ทำครบทั้ง 5 ชุด ได้โบนัส ' + got + ' บาท');
}

/* ---------- จ่ายเหรียญ: จุดเดียวในโหมดบ้านที่แตะ window.OwlCoins (กติกาเหล็กข้อ 5) ---------- */
/* ============================================================
   💸 เงินที่เด็กจ่ายไป "เพื่อทำเควสต์" — ต้องได้คืนตอนจบงาน (ผู้ใช้สั่ง 2026-08-16)

   ทำไม: เควสต์แนวใหม่บางตัวให้เด็ก **ไปซื้อของจริงที่ร้าน** แล้วเอาไปส่ง
   ถ้าไม่คืนเงิน เด็กจะ "ขาดทุน" จากการทำงาน = ยิ่งขยันยิ่งจน ซึ่งขัดกับทั้งเกม
   ⇒ ตอนจบเควสต์จ่าย **ค่าตอบแทนปกติ + เงินที่จ่ายไปในเควสต์นั้น**

   ⚠ นับเฉพาะตอนมีเควสต์ที่ต้องซื้อของค้างอยู่จริง (`walkQuest.buy`) — ซื้อของแต่งบ้านเล่นๆ
     ระหว่างทำเควสต์ต้องไม่ถูกคืนเงิน ไม่งั้นกลายเป็นช่องโกงเงินไม่จำกัด
   ============================================================ */
function questSpend(n){
  n = Math.max(0, Math.round(Number(n) || 0));
  if(!n || !walkQuest || !walkQuest.buy) return 0;
  walkQuest.spent = (walkQuest.spent | 0) + n;
  return n;
}
function awardCoins(n){
  n = Math.max(0, Math.round(Number(n) || 0));
  if(!n) return 0;
  if(window.OwlCoins) window.OwlCoins.add(n);
  if(charGroup) for(let i=0; i<9; i++)
    spawnParticle(charGroup.position.x + (Math.random()-.5)*1.1, 1.5 + Math.random()*1.3,
                  charGroup.position.z + (Math.random()-.5)*.8, i%2 ? 0xffd54f : 0xfff1a8);
  return n;
}

/* ---------- หน้าจอเล่นเควสต์ (การ์ดครีมมนๆ ลอยกลางจอ ยังเห็นเมืองข้างหลัง) ---------- */
let qRun = null;                 /* รอบเล่นปัจจุบัน (null = ไม่ได้เล่นอยู่) */
let qLock = false;               /* กันกดรัวระหว่างเอฟเฟกต์เฉลย */
let qzOnClose = null;            /* งานที่ต้องทำตอนปิดการ์ด (หน้าคลังคำถามใช้กลับเข้าตารางของตัวเอง) */
/* id ของ NPC ที่กำลังยื่นงาน/คุมงานอยู่ — ระหว่างนี้เขาต้อง **ยืนอยู่กับเด็ก ไม่เดินหนี**
   (ผู้ใช้แจ้ง 2026-08-09: รับงานแล้วคนออกโจทย์เดินจากไป เด็กงงว่าคุยกับใครอยู่)
   updateNpcs() อ่านค่านี้แล้วตรึง n.hold/n.faceT ให้คนนั้นทุกเฟรม */
let qzNpcId = null;
function questPlayOpen(){ const el = $('house-qz'); return !!el && !el.hidden; }
function closeQuestPanel(){
  const el = $('house-qz'); if(el) el.hidden = true;
  if(typeof unmountHandPlay === 'function') unmountHandPlay();   /* ปิดการ์ด = ปิดกล้อง/ถอดปุ่ม */
  qRun = null; qLock = false; qzNpcId = null;   /* ปล่อยให้คนออกโจทย์เดินต่อได้ตามปกติ */
  if(window.OwlGames) OwlGames.unmount();   /* ปิดกลางเกมที่ยืมมา → คืน view กลับหน้าหลักให้เรียบร้อย */
  stopHouseTune();                          /* ปิดกลางเสียงเครื่องดนตรี → ตัดโน้ตที่ยังรอเล่นทิ้ง */
  /* ปิดการ์ดกลางลาก → เก็บ ghost ทิ้ง ไม่งั้นค้างลอยอยู่บนจอตลอด */
  if(shelfDrag){ if(shelfDrag.ghost.parentNode) shelfDrag.ghost.parentNode.removeChild(shelfDrag.ghost);
                 shelfDrag = null; }
  /* ปิดกลางกระดานมินิเกม → ถอด listener ลาก-วางที่ผูกไว้ที่ window ทิ้งด้วย ไม่งั้นค้างสะสม */
  if(qSortOff){ qSortOff(); qSortOff = null; }
  if(qDrag){ const b = qDrag.b; qDrag = null;
             if(b){ b.classList.remove('drag'); b.style.left = b.style.top = b.style.width = b.style.height = '';
                    if(b.parentNode === document.body) b.parentNode.removeChild(b); } }
  const cb = qzOnClose; qzOnClose = null;
  if(cb) cb();
}
function qzShow(){
  const el = $('house-qz'); if(el) el.hidden = false;
  /* โหมดมือ (เล่นด้วยมือหน้ากล้อง) — ใช้ระบบเดียวกับเกมหน้าหลักทั้งดุ้น ดู js/games-ar.js
     ปุ่มกล้องไปติดที่แถบบนของโหมดบ้าน กดเองถึงจะเปิดกล้อง (ไม่ขอสิทธิ์เอง) */
  if(typeof mountHandPlayHouse === 'function') mountHandPlayHouse();
}
function qzStage(){
  const el = $('hqz-stage');
  if(el){
    el.innerHTML = '';
    /* 🕐 เลย์เอาต์ 2 คอลัมน์ของการ์ดนาฬิกา **ต้องถอดทุกครั้งที่ล้างเวที**
       ไม่งั้นข้อถัดไปที่ไม่มีหน้าปัดจะถูกจัดเป็น 2 คอลัมน์ค้าง (โจทย์ไปอยู่ขวา อิโมจิไปอยู่ซ้าย
       — เห็นจากภาพจริงตอนเทส 2026-08-17) */
    el.classList.remove('hqz-split');
  }
  return el;
}
function qzHead(spec, sub){
  const who = $('hqz-who');
  /* spec.title มีเฉพาะรอบทดสอบจากหน้าคลังคำถาม (ไม่มี NPC เจ้าของงาน) */
  const nd = npcDefById(spec.npc);
  if(who){
    if(spec.title) who.textContent = spec.title;
    else setIconName(who, nd ? nd.id : '', questIcon(spec), nd ? nd.name : 'กระดานเควสต์');
  }
  const s = $('hqz-sub');
  if(s) s.textContent = sub || '';
}
function qzBtn(label, cls, fn){
  const b = document.createElement('button');
  b.className = 'hqz-btn ' + (cls || '');
  b.textContent = label;
  b.addEventListener('click', fn);
  return b;
}
/* 1) การ์ดชวนรับงาน — เด็กต้องกดรับเอง ไม่ลากเข้าเกมเงียบๆ */
/* 🔒 งานชุดนี้เด็ก "รับไปแล้วและกำลังเดินไปทำอยู่" หรือเปล่า (บั๊กที่ผู้ใช้เจอ 2026-08-22)
   กดซ้ำที่กระดาน / แตะตัวคนสั่งงาน / แตะพ่อแม่ ต้องไม่สร้างรอบใหม่ทับของเดิม
   ไม่งั้นของที่เก็บมาแล้ว · ปลาที่ตกได้ · ขาที่เดินไปร้านมาแล้ว หายหมด เริ่มนับหนึ่งใหม่
   ⇒ ทวนคำสั่งเดิมให้ฟังแทน (`walkHint()`) แล้วคืน true ให้ผู้เรียกออกไปเลย */
function questInFlight(spec){
  if(!spec || spec.test) return false;
  if(!walkQuest || !walkQuest.run || !walkQuest.run.spec) return false;
  if(walkQuest.run.spec.key !== spec.key) return false;
  closeQuestBoard();
  walkHint();
  return true;
}
/* 🔁 เควสต์ของชาวบ้านที่ทำเสร็จไปแล้ว "เล่นซ้ำได้" (ผู้ใช้สั่ง 2026-08-22)
   เผื่อเด็กอยากกลับไปเก็บดาวให้ครบ 3 ดวง — ได้ดาวมากกว่าเดิมถึงจะได้เงิน (ส่วนต่าง)
   ⚠ เฉพาะงานของ **ชาวบ้าน** เท่านั้น กระดาน/ครอบครัวเป็นงานหลักประจำวัน ยังทำได้วันละครั้ง */
function canRedoQuest(spec){ return !!(spec && spec.done && spec.src === 'npc' && !spec.test); }
function offerQuest(spec){
  if(!QUESTS || !spec) return;
  const redo = canRedoQuest(spec);
  if(spec.done && !redo) return;
  if(questInFlight(spec)) return;
  if(hMode !== 'world' || editMode) return;   /* กำลังแต่งตัว/เลือกสัตว์/ตกแต่งบ้านอยู่ → ไม่เด้งงานทับ */
  if(window.HouseQB && window.HouseQB.isOpen()) return;   /* เปิดหน้าคลังคำถามอยู่ → ไม่เด้งงานจริงทับหน้าเทส */
  closeQuestSummary();                                   /* กำลังดูรายการเควสต์อยู่ → ปิดก่อน ไม่ให้กล่องซ้อนกัน */
  qzNpcId = spec.test ? null : (spec.npc || null);   /* คนออกโจทย์ต้องยืนรออยู่กับเด็กจนกว่าจะเล่นจบ */
  closeQuestBoard();
  const d = npcDefById(spec.npc);
  qzShow();
  qzHead(spec, redo ? 'งานที่ทำไปแล้ว · เล่นซ้ำได้'
                    : (spec.src === 'board' ? 'งานจากกระดานเควสต์' : 'งานวันนี้'));
  const st = qzStage(); if(!st) return;
  const line = document.createElement('div');
  line.className = 'hqz-line';
  const got = spec.stars | 0;
  line.textContent = redo
    ? (got >= 3
        ? 'งานนี้หนูทำได้ครบ 3 ดาวแล้ว! อยากเล่นสนุกอีกรอบก็ได้นะ (รอบนี้ไม่มีเงินเพิ่มแล้ว)'
        : 'งานนี้หนูทำไปแล้วได้ ' + got + ' ดาว — ลองอีกรอบไหม? ถ้าได้ดาวมากกว่าเดิม จะได้เงินเพิ่มด้วยนะ')
    : ((d && d.quest) ? d.quest : 'มาช่วยทำงานให้หน่อยได้ไหมจ๊ะ');
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn(redo ? 'เล่นอีกรอบ 🔁' : 'รับงาน! 💪', 'hqz-yes',
    ()=>{ if(typeof playClick==='function') playClick(); startQuest(spec); }));
  /* ⚠ คนที่ดูแลร้าน: ปกติ "ทำงานเสร็จแล้ว = แตะแล้วเข้าร้าน" ⇒ พอมีการ์ดเล่นซ้ำมาคั่น
     ปุ่มที่สองต้องพาเข้าร้านให้ ไม่งั้นเด็กเข้าร้านนั้นไม่ได้อีกเลย */
  const toShop = redo && d && d.shop && SHOP;
  row.appendChild(qzBtn(toShop ? 'เข้าร้าน 🛒' : 'ไว้ก่อน', 'hqz-no', ()=>{
    if(typeof playClick==='function') playClick();
    closeQuestPanel();
    if(toShop) setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode) SHOP.open(d.shop); }, 200);
  }));
  st.appendChild(line); st.appendChild(row);
  if(typeof playClick==='function') playClick();
}
/* 2) ประตูเช็คความพร้อม — ถามก่อนทุกครั้ง ไม่โผล่มาเงียบๆ (ข้อ 24) */
function offerChallenge(then){
  qzShow();
  const who = $('hqz-who'); if(who) who.textContent = '🌟 ท้าทายไหม?';
  const s = $('hqz-sub'); if(s) s.textContent = 'หนูเก่งขึ้นมากเลย!';
  const st = qzStage(); if(!st) return;
  const line = document.createElement('div');
  line.className = 'hqz-line';
  line.textContent = 'อยากลองข้อที่ยากขึ้นอีกนิดไหม? ถ้ายังไม่พร้อมก็ไม่เป็นไรเลยนะ ทำข้อเดิมต่อได้';
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn('ลองเลย! 🌟', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    QUESTS.chalAccept(true);
    if(typeof showToast==='function') showToast('🌟', 'เปิดโจทย์ท้าทายแล้ว! ได้เงินมากขึ้นด้วยนะ');
    then();
  }));
  row.appendChild(qzBtn('ยังไม่พร้อม', 'hqz-no', ()=>{
    if(typeof playClick==='function') playClick();
    QUESTS.chalAccept(false);
    then();
  }));
  st.appendChild(line); st.appendChild(row);
}
/* 3) เริ่มเล่นจริง */
function startQuest(spec){
  if(!QUESTS || !spec) return;
  if(QUESTS.chalReady()){ offerChallenge(()=>startQuest(spec)); return; }
  qRun = QUESTS.buildRun(spec);
  qLock = false; qMemShown = {}; qFlashDone = {};
  qzShow();
  renderQuestStep();
}
function renderQuestStep(){
  if(!qRun) return;
  const spec = qRun.spec;
  qzHead(spec, (qRun.chal ? '🌟 โจทย์ท้าทาย · ' : '') + 'ข้อ ' + (qRun.idx+1) + ' จาก ' + qRun.items.length);
  /* จุดบอกความคืบหน้าด้านบน */
  const dots = $('hqz-dots');
  if(dots){
    dots.innerHTML = '';
    for(let i=0; i<qRun.items.length; i++){
      const b = document.createElement('i');
      b.className = 'hqz-dot' + (i < qRun.idx ? ' on' : (i === qRun.idx ? ' now' : ''));
      dots.appendChild(b);
    }
  }
  const st = qzStage(); if(!st) return;
  const it = qRun.items[qRun.idx];
  /* เฟส 4B: มินิเกมครอบครัวไม่ใช่โจทย์ 4 ตัวเลือก ⇒ แยกทางวาดตั้งแต่ตรงนี้
     **เพิ่มมินิเกมใหม่ให้มาต่อแถวที่นี่** (ตัวที่ไม่มี `it.kind` = โจทย์ตอบคำถามแบบเดิม) */
  if(it.kind === 'walk'){ renderWalkStep(st, it); return; }
  if(it.kind === 'engine'){ renderEngineStep(st, it); return; }
  if(it.kind === 'mart'){ renderMartStep(st, it); return; }   /* 🏪 ชุด B: งานที่ต้องไปทำที่ร้าน */
  if(it.kind === 'coinpay'){ renderCoinPay(st, it); return; } /* 💰 จ่ายเงินให้พอดี — แตะเหรียญตรงๆ */
  if(it.kind === 'sort'){
    /* เกมจำรายการของ: โชว์รายการก่อน แล้วค่อยให้หยิบ */
    if(it.memory && !qMemShown[qRun.idx]){ renderMemoryList(st, it); return; }
    renderSortStep(st, it); return;
  }
  if(it.kind === 'clock') renderClockFace(st, it);   /* วาดหน้าปัดแล้วไปต่อทางโจทย์ 4 ตัวเลือกปกติ */
  if(it.kind === 'beaker') renderBeaker(st, it);     /* เฟส 6: บีกเกอร์ตวงน้ำ — ก็เป็นโจทย์ 4 ตัวเลือกเหมือนกัน */
  if(it.kind === 'code') renderCodeLines(st, it);    /* เฟส 6: รายการคำสั่งหุ่นยนต์ (หาบรรทัดที่ผิด) */
  if(it.kind === 'sound') renderSoundPlay(st, it);   /* เฟส 5 ตกค้าง: ทายเสียง — ปุ่มฟังซ้ำได้ไม่จำกัด */
  if(it.kind === 'playalong'){ renderPlayAlong(st, it); return; }   /* เฟส 9: ฟังทำนองแล้วกดตาม */
  if(it.kind === 'spot') renderSpotRows(st, it);     /* เฟส 7: จับผิดภาพ — 2 แถวเทียบกัน */
  if(it.kind === 'flash'){                           /* เฟส 7: นับแว้บเดียว — โชว์ของแล้วซ่อน */
    if(!qFlashDone[qRun.idx]){ renderFlashShow(st, it); return; }
  }
  if(it.kind === 'vanish'){                          /* เฟส 13: ของหายไปไหน — แตะของตรงๆ */
    if(!qFlashDone[qRun.idx]){ renderVanishShow(st, it); return; }
    renderVanishPick(st, it); return;
  }
  if(it.kind === 'colornum'){ renderColorNum(st, it); return; }   /* เฟส 13: ระบายสีตามเลข */
  /* ---- ส่วนหัวโจทย์มี 4 แบบตามชนิดข้อมูลในคลัง CATS — ห้ามตกแบบใดแบบหนึ่ง ---- */
  if(it.show){                                   /* โจทย์นับของ: แถวอิโมจิให้เด็กนับจริง */
    const sh = document.createElement('div'); sh.className = 'hqz-show'; sh.textContent = it.show;
    st.appendChild(sh);
  }else if(it.img){                              /* โจทย์ภาพล้วน — หมวดเชาว์ iq1-iq4 (q.q เป็นค่าว่าง รูปคือโจทย์ทั้งหมด) */
    const im = document.createElement('img');
    im.className = 'hqz-img'; im.src = it.img; im.alt = 'โจทย์เชาว์ปัญญา';
    st.appendChild(im);
  }else if(it.pattern){                          /* เติมแพทเทิร์น: การ์ดอิโมจิ + ช่อง ? (ใช้ class ชุดเดียวกับหน้าหลัก) */
    const row = document.createElement('div'); row.className = 'pattern-row';
    it.pattern.forEach(p=>{
      const t = document.createElement('span');
      t.className = 'pat-tile' + (Array.from(p).length > 1 ? ' pat-multi' : '');
      t.textContent = p; row.appendChild(t);
    });
    const miss = document.createElement('span');
    miss.className = 'pat-tile pat-missing'; miss.textContent = '?';
    row.appendChild(miss);
    st.appendChild(row);
  }else if(it.emoji){
    const em = document.createElement('div'); em.className = 'hqz-emoji';
    /* บังคับให้วาดเป็นอิโมจิสี — สัญลักษณ์อย่าง ✖ ✔ ➕ ถ้าไม่เติม VS16 เบราว์เซอร์วาดเป็นตัวอักษรดำทึบ
       ดูแข็งไม่เข้ากับธีมเด็ก 5 ขวบ (เติมกับอิโมจิที่สีอยู่แล้วไม่มีผลอะไร) */
    em.textContent = (Array.from(it.emoji).length === 1 && it.emoji.indexOf('\uFE0F') < 0)
                     ? it.emoji + '\uFE0F' : it.emoji;
    st.appendChild(em);
  }
  /* โจทย์ภาพไม่มีข้อความ (q.q ว่าง) — ใส่คำสั่งสั้นๆ แทน ไม่งั้นเด็กเห็นแค่รูปเปล่าๆ ไม่รู้ว่าต้องทำอะไร */
  const qText = it.q || (it.img ? 'ดูรูปแล้วเลือกข้อที่ถูกต้อง' : (it.pattern ? 'ช่อง ? ควรเป็นอะไร?' : ''));
  if(qText){
    const q = document.createElement('div'); q.className = 'hqz-q'; q.textContent = qText;
    st.appendChild(q);
  }
  /* ตัวเลือกที่เป็นอิโมจิ (เติมแพทเทิร์น) ต้องตัวใหญ่กว่าตัวเลือกข้อความ ไม่งั้นเด็กมองไม่ออกว่าเป็นรูปอะไร */
  /* 3 ตัวเลือกสั้นๆ (ก/ข/ค ของโจทย์ภาพ) วางเรียงแถวเดียว 3 ช่อง ไม่ใช่ 2+1 ที่ดูเบี้ยว */
  const wrap = document.createElement('div');
  wrap.className = 'hqz-choices' + (it.choices.length === 3 ? ' hqz-ch3' : '');
  it.choices.forEach((c, i)=>{
    const b = document.createElement('button');
    b.className = 'hqz-choice'
      + (it.pattern ? (Array.from(c).length > 1 ? ' hqz-ch-emoji hqz-ch-multi' : ' hqz-ch-emoji') : '');
    b.textContent = c;
    b.addEventListener('click', ()=>answerQuest(i, b));
    wrap.appendChild(b);
  });
  st.appendChild(wrap);
}
/* ================= เฟส 4B — กระดาน "จัดของลงถัง" =================
   ท่าเล่น = **ลากของไปวางในถัง (drag & drop)** ผู้ใช้สั่งเปลี่ยนจาก "แตะ → แตะ" เมื่อ 2026-08-10
   ⚠ ใช้ pointer event เขียนเอง **ห้ามใช้ HTML5 drag-and-drop** (`draggable`/`dragstart`) เด็ดขาด —
     API นั้นไม่ทำงานบนจอสัมผัส ซึ่งคือเครื่องหลักที่เด็กเล่น (iPad)
   ⚠ ตัวที่ลากต้อง `pointer-events:none` ระหว่างลาก ไม่งั้น `elementFromPoint()` เจอแต่ตัวมันเอง
     เลยไม่มีวันรู้ว่าปล่อยลงถังไหน
   ⚠ ยังเก็บทาง "แตะเลือก → แตะถัง" ไว้เป็นทางสำรอง (ขยับไม่ถึง 6px = นับเป็นแตะ) —
     เด็กที่ลากไม่ไหวต้องมีทางไปต่อเสมอ (กติกาเหล็กข้อ 1 ห้ามมี dead end)
   วางครบทุกชิ้นเมื่อไหร่ = ตรวจให้เอง ไม่ต้องมีปุ่ม "ส่งคำตอบ" ให้เด็กหาว่ากดตรงไหน */
/* ================= เฟส 5: ข้อที่เป็น "เกมของหน้าหลัก" =================
   ยืม engine เดิมมาวางในเวทีของการ์ดเควสต์ผ่าน window.OwlGames (ดู js/owl-games.js)
   ⚠ ต้องมีหน้าชวนเล่นคั่นก่อน 1 จังหวะ — engine บางตัวเริ่มเล่นทันทีที่ mount
     ถ้าโผล่มาแล้วเริ่มจับเวลา/นับพลาดเลย เด็กจะงงว่าเกิดอะไรขึ้น
   ⚠ ดาวของข้อนี้มาจาก "จำนวนที่พลาด" ที่ engine คืนมา ไม่ใช่ run.wrong ที่นับเอง
     ⇒ ยัด mistakes ใส่ run.wrong ก่อนปิดเควสต์ เกณฑ์ดาวเดิม (starsOf) จึงใช้ได้ตรงๆ */
function renderEngineStep(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = it.q;
  st.appendChild(line);
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn(it.go || 'เล่นเลย!', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    startEngineGame(it);
  }));
  st.appendChild(row);
}
function startEngineGame(it){
  if(!window.OwlGames || !window.HouseGames){ finishEngineRound(0); return; }
  const gid = it.game;
  /* `it.pick` = หมวดย่อยของเกมเดียวกัน (เฟส 6: code เล่นได้ 3 แบบ plain/loop/cond) */
  const cat = HouseGames.pickCat(gid, qRun && qRun.gid ? qRun.gid : 'prep-p1', it.pick || '');
  const stage = qzStage();
  /* ⚠ ไม่มีหมวดที่ชั้นนี้เล่นได้ → ต้องไม่เงียบ ในเกมจริง `engineReady()` กรองไว้แล้วจึงไม่มีทางมาถึง
     แต่หน้าคลังคำถามข้ามด่านนั้นได้ ⇒ เคยกลายเป็น "กดเล่นแล้วเด้งหน้าสรุปทันที" หาสาเหตุไม่เจอ
     (ผู้ใช้แจ้ง 2026-08-16) — ปล่อยให้จบชุดเหมือนเดิม (ห้ามค้างเป็น dead end) แต่บอกเหตุผลด้วย */
  if(!cat && typeof showToast === 'function')
    showToast('⚠️', 'เกมนี้ยังไม่มีชุดโจทย์สำหรับระดับชั้นนี้');
  if(!cat || !stage){ finishEngineRound(0); return; }
  const dots = $('hqz-dots'); if(dots) dots.innerHTML = '';
  const sub = $('hqz-sub'); if(sub) sub.textContent = cat.name || '';
  const ok = OwlGames.mount(gid, stage, {
    catId: cat.id,
    onDone: res => finishEngineRound(res ? res.mistakes : 0),
  });
  if(!ok) finishEngineRound(0);
}
/* engine จบรอบแล้ว → บันทึกจำนวนพลาดเข้ารอบเล่น แล้วปิดเควสต์ตามทางปกติ */
function finishEngineRound(mistakes){
  if(!qRun) return;
  qRun.wrong = Math.max(0, mistakes | 0);
  const r = QUESTS.submit(qRun, true);
  qLock = false;
  if(r.done) finishQuest();
  else renderQuestStep();
}

/* ================= เควสต์ที่ต้อง "เดินไปทำ" (เฟส 4B) =================
   family-time = ไปนั่งที่โต๊ะในบ้าน · shopping-list = เดินไปตลาดแล้วซื้อของตามที่แม่สั่ง
   ⚠ รับงานแล้ว **การ์ดต้องปิด** ให้เด็กเดินได้ ⇒ เก็บรอบเล่นไว้ที่ walkQuest แล้วค่อยเปิดกลับ
     ตอนไปถึง (closeQuestPanel() ล้าง qRun ทิ้งเสมอ จึงต้องเก็บไว้ก่อนเรียก) */
let walkQuest = null;          /* {run, target:'table'|'market'} */
/* บ้านหลังนี้มีโต๊ะ/เก้าอี้ในบ้านไหม — อ่านจากของที่เด็กวางไว้จริง (ไม่นับของนอกบ้าน) */
/* เฟส 9 — บ้านหลังนี้มีเครื่องดนตรีวางอยู่ไหม (นับทั้งในบ้านและนอกบ้าน — ระฆังลมแขวนนอกบ้าน)
   ⚠ ต้องดูจาก "ของที่วางไว้จริง" ไม่ใช่ "ของที่ซื้อแล้ว" — ซื้อแล้วเก็บไว้ในคลังยังเล่นไม่ได้ */
/* 🕰️ หมวดของในบ้านที่ "แตะใช้งานได้" และเด็กวางไว้จริง — เควสต์กิจวัตรสั่งได้เฉพาะหมวดพวกนี้
   ⚠ **ผู้ใช้สั่ง 2026-08-16: ต้องอิงจากของที่เด็กมีจริง ไม่มีของ = ไม่แจกงาน**
   ⚠ ดูเฉพาะของใน `dec.in` (ในบ้าน) เพราะกิจวัตรทำในบ้านทั้งหมด */
const ROUTINE_CATS = ['bed', 'bath', 'table', 'seat', 'kitchen'];
function routineCats(){
  const d = loadHouseData() || {};
  const list = (d.decor || {}).in || [];
  const out = [];
  list.forEach(rec=>{
    const it = FURN.byId[rec.id];
    if(it && ROUTINE_CATS.indexOf(it.cat) >= 0 && out.indexOf(it.cat) < 0) out.push(it.cat);
  });
  return out;
}
function hasInstrument(){
  const d = loadHouseData() || {};
  const dec = d.decor || {};
  return ['in','out'].some(sc => (dec[sc] || []).some(rec => {
    const it = FURN.byId[rec.id];
    return it && it.cat === 'music';
  }));
}
function hasIndoorSeat(){
  const d = loadHouseData() || {};
  const list = (d.decor && d.decor.in) || [];
  return list.some(rec=>{
    const it = FURN.byId[rec.id];
    return it && (it.cat === 'table' || it.cat === 'seat');
  });
}
/* การ์ดรับงานเดิน: บอกงาน (+ รายการของถ้ามี) แล้วปิดการ์ดให้เด็กออกไปเดิน */
function renderWalkStep(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = it.q;
  st.appendChild(line);
  /* 🐞 **งานส่งของไม่เคยบอกว่าให้ส่งให้ใคร** (ผู้ใช้แจ้ง 2026-08-21)
     ตัวกลไก (`js/house-quests.js`) ไม่รู้จักผังเมือง จึงส่งมาแค่ `toNpc` แล้วเขียนคอมเมนต์ว่า
     "หน้าจอต่อท้ายด้วยชื่อคน + สถานที่" — **แต่ฝั่งหน้าจอไม่เคยทำจริง**
     ⇒ เด็กได้การ์ดว่า "ช่วยเอากระเป๋าไปส่งให้หน่อยได้ไหม?" แล้วไม่รู้ว่าส่งให้ใคร
     ⚠ ต้องบอกทั้ง **ชื่อ + สถานที่** เพราะเมืองกว้าง 56×42 ช่อง รู้แต่ชื่อก็ยังหาไม่เจอ */
  /* ⚠ **ยกเว้นเกม "ทายว่าใคร" (`whois`)** — โจทย์คือดูเงาแล้วเดาเองว่าเป็นใคร
     บอกชื่อตรงนี้ = เฉลยให้ฟรี เกมหมดความหมายทันที */
  if(it.target === 'npc' && it.toNpc && !it.whois){
    const info = questItemInfo({src:'npc', id: it.toNpc});
    const who = document.createElement('div'); who.className = 'hqz-line hqz-line-to';
    setIconName(who, info.ico, info.icon, 'ส่งให้ ' + info.name + ' ที่ ' + info.place);
    st.appendChild(who);
  }
  if(it.list && it.list.length){
    const row = document.createElement('div'); row.className = 'hqz-tray hqz-memlist';
    it.list.forEach(x=>{
      const b = document.createElement('div'); b.className = 'hqz-tile hqz-tile-lab';
      const em = document.createElement('span'); em.className = 'hqz-tile-em'; em.textContent = x.e;
      const tx = document.createElement('span'); tx.className = 'hqz-tile-tx'; tx.textContent = x.label;
      b.appendChild(em); b.appendChild(tx);
      row.appendChild(b);
    });
    st.appendChild(row);
  }
  if(it.whois) st.appendChild(buildNpcShadow(it.toNpc));   /* เฟส 13: เงาดำของคนที่ต้องไปหา */
  const row2 = document.createElement('div'); row2.className = 'hqz-row';
  row2.appendChild(qzBtn(it.go || 'ไปเลย!', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    const run = qRun;
    /* `toNpc` = ปลายทางของงานส่งของ (เฟส 7) — เก็บไว้ที่นี่เพราะ closeQuestPanel() ล้าง qRun ทิ้ง */
    walkQuest = {run: run, target: it.target, toNpc: it.toNpc || '', zone: it.zone || '',
                 whois: !!it.whois,      /* เกมทายว่าใคร — คำใบ้ห้ามเอ่ยชื่อคนปลายทาง */
                 /* 🎣 งานแบบ "ทำจริงแล้วค่อยเอาไปส่ง" — `need` เป็น **ใบสั่งรายชนิด**
                    [{id, e, name, n}] · `got` = {ชนิด: ที่ได้แล้ว} · `where` = บ่อ/ทะเล */
                 where: it.where || '', need: (it.need && it.need.length) ? it.need : [], got: {},
                 /* 🏪 งาน 2 ขาของชุด B — leg 1 = เดินไปร้าน · leg 2 = ทำเสร็จแล้วเดินกลับไปส่ง
                    `buy` = งานนี้ต้องใช้เงินซื้อของจริง ⇒ คืนเงินให้ตอนจบ (ผู้ใช้สั่ง) */
                 leg: it.target === 'mart' ? 1 : 0, buy: !!it.buy, spent: 0};
    closeQuestPanel();                       /* ⚠ ล้าง qRun ทิ้ง จึงต้องคว้า run ไว้ก่อนบรรทัดนี้ */
    walkHint();
  }));
  st.appendChild(row2);
}
/* ================= เฟส 13: 🎨 ระบายสีตามเลข (ข้อ 52) =================
   เลือกสีจากจาน → แตะช่องที่มี "เลขตรงกับสีที่ถืออยู่" → ช่องนั้นเปลี่ยนสี
   🔒 **ไม่มีคำว่าผิด** — แตะช่องที่เลขไม่ตรง = ไม่มีอะไรเกิดขึ้น ไม่นับพลาด ไม่มีเสียงดุ
      (กติกาเหล็กข้อ 2) ⇒ เด็กระบายจนครบได้เสมอ ไม่มีทางตัน
   🎁 ระบายครบ = ปลดล็อก "กรอบรูปติดผนัง" ให้เอาไปแขวนในบ้านจริง (ผ่าน SHOP.grantFree)
   ⚠ กริดสูงสุด 8×8 — ใหญ่กว่านี้ช่องเล็กจนนิ้วเด็กแตะไม่โดนในการ์ดใบเล็ก */
function renderColorNum(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = it.q;
  st.appendChild(line);

  let cur = it.palette[0];
  const board = document.createElement('div');
  board.className = 'hqz-art';
  board.style.gridTemplateColumns = 'repeat(' + it.w + ', 1fr)';
  const byXY = {};
  it.cells.forEach(c => { byXY[c.x + ',' + c.y] = c; });
  let done = 0;
  for(let y = 0; y < it.h; y++){
    for(let x = 0; x < it.w; x++){
      const c = byXY[x + ',' + y];
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'hqz-artcell' + (c ? '' : ' blank');
      if(!c){ cell.disabled = true; board.appendChild(cell); continue; }
      cell.textContent = String(c.n);
      cell.dataset.hpClick = '1';                 /* โหมดมือ: ชี้ค้างแล้วต้องระบายได้ด้วย */
      cell.addEventListener('click', ()=>{
        if(cell.classList.contains('filled')) return;
        /* เลขไม่ตรงสีที่ถืออยู่ = เงียบๆ ไม่มีอะไรเกิดขึ้น **ห้ามนับว่าผิด** */
        if(c.n !== cur.n){ cell.classList.add('nope'); setTimeout(()=>cell.classList.remove('nope'), 260); return; }
        cell.classList.add('filled');
        cell.style.background = cur.c;
        cell.style.borderColor = cur.c;
        cell.textContent = '';
        if(typeof playClick === 'function') playClick();
        done++;
        if(done >= it.cells.length){
          /* ระบายครบ → ปลดล็อกกรอบรูปให้เอาไปแขวนที่บ้าน แล้วส่งคำตอบตามทางเดิม */
          if(window.HouseShop && HouseShop.grantFree) HouseShop.grantFree(['wall-picture']);
          if(typeof showToast === 'function') showToast('🖼️', 'ได้กรอบรูปใหม่! เอาไปแขวนที่บ้านได้เลย');
          submitQuestPayload(done);
        }
      });
      board.appendChild(cell);
    }
  }
  st.appendChild(board);

  /* จานสี — ปุ่มกลมสีจริง มีเลขกำกับ เด็กจับคู่เลขกับช่องบนภาพได้เอง */
  const pal = document.createElement('div'); pal.className = 'hqz-palette';
  it.palette.forEach((pcol, i)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hqz-pal' + (i === 0 ? ' on' : '');
    b.style.background = pcol.c;
    b.textContent = String(pcol.n);
    b.dataset.hpClick = '1';
    b.addEventListener('click', ()=>{
      cur = pcol;
      Array.prototype.forEach.call(pal.children, e => e.classList.remove('on'));
      b.classList.add('on');
      if(typeof playClick === 'function') playClick();
    });
    pal.appendChild(b);
  });
  st.appendChild(pal);
}
/* ================= เฟส 13: 🕵️ ทายว่าใคร — เงาดำของชาวบ้าน (ข้อ 52) =================
   วาดจาก `look` จริงของคนนั้นใน NPC_DEFS ⇒ **ไม่ต้องวาดอาร์ตใหม่แม้แต่ชิ้นเดียว**
   และเงาของแต่ละคนต่างกันจริงเพราะทรงผม/หมวก/ของถือ/ผ้ากันเปื้อนไม่เหมือนกัน

   ⚠ **ต้องต่างกันที่ "เงารวม" ไม่ใช่รายละเอียดเล็ก** — เงาเป็นสีดำล้วน สีเสื้อ/สีผมช่วยไม่ได้เลย
     ⇒ ตัวแปรที่ใช้จริงมีแค่ ทรงผม · หมวก · ของถือ · ผ้ากันเปื้อน · เด็กหญิง/ชาย (บทเรียนไอคอนเฟส 8)
   ⚠ ห้ามใส่ชื่อคนลงในภาพหรือ alt (เฉลยทันที) */
function npcDefById(id){
  for(let i = 0; i < NPC_DEFS.length; i++) if(NPC_DEFS[i].id === id) return NPC_DEFS[i];
  return null;
}
function buildNpcShadow(npcId){
  const wrap = document.createElement('div');
  wrap.className = 'hqz-shadow-wrap';
  const def = npcDefById(npcId) || {};
  const lk = def.look || {};
  const p = [];
  /* ---- ทรงผม (ตัวแยกเงาที่ชัดที่สุด) ---- */
  const hair = lk.hair | 0;
  if(lk.girl || hair === 1)      p.push('<path d="M50 26c-16 0-24 11-24 24 0 12 3 22 6 30h8c-4-10-5-20-5-28 0-9 6-16 15-16s15 7 15 16c0 8-1 18-5 28h8c3-8 6-18 6-30 0-13-8-24-24-24z"/>');
  else if(hair === 2)            p.push('<path d="M28 46c0-14 10-22 22-22s22 8 22 22c0 4-1 7-2 9-3-8-10-13-20-13s-17 5-20 13c-1-2-2-5-2-9z"/><path d="M24 44c4-4 8 2 6 8-3 8-8 6-8 0z"/>');
  else                           p.push('<path d="M28 48c0-14 10-24 22-24s22 10 22 24c0 3-1 6-2 8-3-9-10-14-20-14s-17 5-20 14c-1-2-2-5-2-8z"/>');
  /* ---- หมวก ---- */
  if(lk.hat === 'cap')    p.push('<path d="M26 40c0-13 11-20 24-20s24 7 24 20H26z"/><path d="M70 40h18c2 0 3 3 0 4H70z"/>');
  else if(lk.hat === 'straw') p.push('<ellipse cx="50" cy="38" rx="34" ry="8"/><path d="M30 38c0-12 9-19 20-19s20 7 20 19H30z"/>');
  else if(lk.hat)         p.push('<path d="M28 38c0-12 10-19 22-19s22 7 22 19H28z"/>');
  /* ---- หัว + ลำตัว + ขา (ทุกคนเหมือนกัน — ตัวยืนพื้นฐาน) ---- */
  p.push('<circle cx="50" cy="52" r="17"/>');
  p.push('<path d="M34 76h32c6 0 10 5 10 11v33H24V87c0-6 4-11 10-11z"/>');
  p.push('<rect x="34" y="120" width="12" height="26" rx="5"/><rect x="54" y="120" width="12" height="26" rx="5"/>');
  /* ---- ผ้ากันเปื้อน (พ่อค้าแม่ค้า) — เปลี่ยนเงาช่วงลำตัวให้ต่างออกไป ---- */
  if(lk.apron) p.push('<path d="M40 84h20v34H40z"/>');
  /* ---- ของถือ (ตัวแยกเงาอันดับ 2) ---- */
  if(lk.prop === 'basket')      p.push('<path d="M76 96h20l-3 20H79z"/><path d="M79 96c0-7 4-11 7-11s7 4 7 11" fill="none" stroke="currentColor" stroke-width="3"/>');
  else if(lk.prop === 'broom')  p.push('<rect x="80" y="60" width="4" height="52" rx="2"/><path d="M74 112h16l4 14H70z"/>');
  else if(lk.prop === 'book')   p.push('<path d="M74 92h22v20H74z"/>');
  else if(lk.prop)              p.push('<circle cx="84" cy="100" r="10"/>');
  const svg = '<svg viewBox="0 0 110 150" class="hqz-shadow" aria-hidden="true">' + p.join('') + '</svg>';
  wrap.innerHTML = svg + '<div class="hqz-shadow-q">?</div>';
  return wrap;
}
/* ป้ายบอกว่าตอนนี้ต้องไปไหน — ใช้แถบคำใบ้เดิมของโหมดบ้าน ไม่สร้าง UI ใหม่ให้เด็กงง */
function walkHint(){
  if(!walkQuest) return;
  const it = walkQuest.run.items[walkQuest.run.idx];
  let msg = (it && it.hint) ? it.hint : 'ไปทำงานที่คุณแม่ฝากไว้กันนะ';
  /* 🎣 งาน "ทำจริงแล้วเอาไปส่ง" มี 2 ช่วง — คำใบ้ต้องเปลี่ยนตามช่วงที่อยู่ ไม่งั้นเด็กตกครบแล้ว
     ยังไม่รู้ว่าต้องเดินกลับไปหาใคร (ป้ายเดิมค้างว่า "ไปตกปลา" = ตกไปเรื่อยๆ ไม่มีวันจบ) */
  if(walkQuest.target === 'mart'){
    if(walkQuest.leg === 1){
      msg = 'ไปที่ 🏪 ร้านสะดวกซื้อก่อนนะ — ' + ((it && it.hint) || 'มีงานรออยู่ที่นั่น');
    }else{
      msg = 'ทำที่ร้านเสร็จแล้ว! เอากลับไปส่งที่';
      const info = questItemInfo({src:'npc', id: walkQuest.toNpc});
      msg += ' ' + info.icon + ' ' + info.name + ' ที่ ' + info.place;
    }
    const h3 = $('house-hint');
    if(h3){ h3.textContent = '📋 ' + msg; showHint(); }
    if(typeof showToast==='function') showToast('🏪', msg);
    return;
  }
  if(walkQuest.target === 'catch'){
    if(!catchDone()){
      /* ⚠ ตกปลาต้องบอก **แหล่งน้ำ** ด้วยเสมอ — ปลาบ่อกับปลาทะเลคนละชุดกันสนิท
         เด็กยืนตกผิดที่จะไม่มีวันได้ตัวที่สั่ง แล้วไม่รู้เลยว่าทำไม */
      const where = walkQuest.where
        ? ('ไปตกปลาที่' + (walkQuest.where === 'sea' ? 'ริมทะเล' : 'บ่อน้ำใหญ่') + ' — ')
        : ((it && it.hint) ? it.hint + ' — ' : '');
      msg = where + walkQuest.need.map(r =>
        r.e + ' ' + r.name + ' ' + Math.min(r.n, catchGot(r)) + '/' + r.n).join(' · ');
    }else{
      msg = 'ทำครบแล้ว! เอาไปส่งที่';
      const info = questItemInfo({src:'npc', id: walkQuest.toNpc});
      msg += ' ' + info.icon + ' ' + info.name + ' ที่ ' + info.place;
      const h2 = $('house-hint');
      if(h2){ h2.textContent = '📋 ' + msg; showHint(); }
      if(typeof showToast==='function') showToast('✅', msg);
      return;
    }
  }
  /* 🎯 งานส่งของ/งานที่ต้องไปหาคน — คำใบ้ต้องบอก **ชื่อคน + สถานที่** เสมอ
     (กลไกส่งมาแค่ "เอากระเป๋าไปส่งให้" ปลายเปิด ตัวเติมอยู่ฝั่งนี้ที่เดียว) */
  if(walkQuest.target === 'npc' && walkQuest.toNpc && !walkQuest.whois){
    const info = questItemInfo({src:'npc', id: walkQuest.toNpc});
    msg = msg.replace(/\s*$/, '') + ' ' + info.name + ' ที่ ' + info.place;
  }
  const hint = $('house-hint');
  if(hint){ hint.textContent = '📋 ' + msg; showHint(); }
  if(typeof showToast==='function') showToast('📋', msg);
}
/* 🎣 ตกปลาได้ 1 ตัว — js/house-play.js เรียกผ่าน `HouseWorld.questCaught('fish')` ตอนดึงเบ็ดติดปลา
   ⚠ **ห้ามผูกกับ `questEvent()`** — ตัวนั้นเป็นภารกิจรายวันบนกระดาน คนละระบบกับเควสต์ของ NPC
     (เคยคิดจะใช้ร่วมกัน แต่ questEvent มีตัวกันนับซ้ำรายชิ้น ซึ่งจะทำให้ตกปลาชนิดเดิม 2 ตัว
      นับได้แค่ตัวเดียว = เควสต์ไม่มีวันจบ) */
function questCaught(kind, id){
  if(!walkQuest || walkQuest.target !== 'catch') return false;
  /* ใบสั่ง 1 แถว = {k: ชนิดงาน, id: ชนิดย่อย (ปลา) หรือ '' , n: จำนวน}
     ⚠ **แถวที่ `id` ว่าง = อะไรก็ได้ในงานชนิดนั้น** (เก็บของ/รดน้ำ/ถ่ายรูป ไม่มีชนิดย่อย) */
  const row = walkQuest.need.filter(r => (r.k || 'fish') === kind && (!r.id || r.id === id))[0];
  /* ทำได้ของที่ไม่ได้สั่ง = ไม่นับ แต่ **ห้ามดุ ห้ามหักอะไร** — ของชิ้นนั้นยังเข้าถังเด็กตามปกติ */
  if(!row) return false;
  const key = row.k + ':' + (row.id || '');
  if((walkQuest.got[key] | 0) >= row.n) return false;     /* แถวนี้ครบแล้ว ทำเพิ่มไม่นับซ้ำ */
  walkQuest.got[key] = (walkQuest.got[key] | 0) + 1;
  walkHint();
  return true;
}
/* จำนวนที่ทำได้แล้วของใบสั่งแถวหนึ่ง */
function catchGot(r){ return walkQuest ? (walkQuest.got[r.k + ':' + (r.id || '')] | 0) : 0; }
/* ใบสั่งครบทุกชนิดหรือยัง */
function catchDone(){
  if(!walkQuest || !walkQuest.need.length) return false;
  return walkQuest.need.every(r => catchGot(r) >= r.n);
}
/* ไปถึงเป้าหมายแล้ว → เปิดรอบเล่นกลับมาทำต่อ (ตลาดมีกระดานซื้อของต่อ · โต๊ะจบเลย) */
/* เรียกทุกครั้งที่ตัวละครก้าวถึงช่องใหม่ในฉากนอกบ้าน — ถึงตลาดแล้วเปิดกระดานซื้อของให้เลย */
function walkQuestTileCheck(){
  if(!walkQuest) return;
  if(hScene !== 'out' || hMode !== 'world' || editMode) return;
  /* เฟส 7 — "หาของที่หาย": เดินถึงย่านที่บอกไว้ = เจอของ
     ⚠ ใช้ questZonesAt() ตัวเดียวกับภารกิจเดินสำรวจของเก่า ⇒ ชื่อย่านต้องตรงกับที่ฟังก์ชันนั้นรู้จัก
       (js/house-quests.js มีคอมเมนต์เตือนไว้ที่ HIDDEN_ZONES แล้ว) */
  if(walkQuest.target === 'zone'){
    if(questZonesAt(hChar.tile.x, hChar.tile.z).indexOf(walkQuest.zone) >= 0) walkQuestArrive('zone');
    return;
  }
  /* 🏪 ชุด B (2026-08-16) — งานที่ต้อง "ไปทำที่ร้านสะดวกซื้อ" แล้วค่อยเอากลับไปส่ง
     ⚠ เป็นงาน **2 ขา**: ขา 1 เดินไปที่ร้าน → เปิดกระดานทำงานตรงนั้น · ขา 2 เดินกลับไปหาคนสั่ง
       ⇒ ต่างจาก `market` ที่จบตรงตลาดเลย · ตัวจำว่าอยู่ขาไหนคือ `walkQuest.leg` */
  if(walkQuest.target === 'mart'){
    if(walkQuest.leg === 1 && atMartLot(hChar.tile.x, hChar.tile.z)) openMartBoard();
    return;
  }
  if(walkQuest.target !== 'market') return;
  if(inMarket(hChar.tile.x, hChar.tile.z)) walkQuestArrive('market');
}
/* ยืนอยู่ที่ร้านสะดวกซื้อหรือยัง (เผื่อขอบล็อต 1 ช่อง เด็กไม่ต้องยืนตรงเป๊ะ) */
function atMartLot(x, z){
  const lt = lotAt(x, z, 1);
  return !!(lt && lt.id === 'shop-mart');
}
/* ถึงร้านแล้ว → เปิดกระดานทำงานที่ร้าน (ยังไม่จบเควสต์ ต้องเอากลับไปส่งอีกที) */
function openMartBoard(){
  if(!walkQuest || walkQuest.leg !== 1) return;
  walkQuest.leg = 2;
  const run = walkQuest.run;
  qRun = run; qLock = false;
  qzShow();
  renderQuestStep();
}
/* กระดานที่ร้านทำเสร็จแล้ว → ปิดการ์ด ให้เด็กเดินกลับไปหาคนที่สั่งงาน (ขา 2)
   ⚠ **ห้ามจบเควสต์ตรงนี้** — ผู้ใช้กำหนดรูปแบบไว้ว่า "รับคำสั่ง → ไปทำ → กลับมาส่งงาน" */
function martBoardDone(){
  if(!walkQuest || walkQuest.target !== 'mart') return;
  walkQuest.need.forEach(r => { walkQuest.got[r.k + ':' + (r.id || '')] = r.n; });
  closeQuestPanel();
  walkHint();
}
function walkQuestArrive(target){
  if(!walkQuest || walkQuest.target !== target) return false;
  const run = walkQuest.run;
  run.spent = walkQuest.spent | 0;      /* 💸 ส่งยอดที่จ่ายไประหว่างงานต่อให้ตอนจบเควสต์คืนเงิน */
  walkQuest = null;
  qRun = run; qLock = false;
  const r = QUESTS.submit(qRun, true);
  if(r.done){ qzShow(); finishQuest(); return true; }
  qzShow();
  renderQuestStep();
  return true;
}
/* หน้าปัดนาฬิกาการ์ตูน (เกม "ตื่นให้ตรงเวลา") — วาดเป็น SVG ให้เข้าธีมเด็ก 5 ขวบ
   เข็มสั้น = ชั่วโมง (เดินตามนาทีด้วย) · เข็มยาว = นาที · ตัวเลข 12/3/6/9 ตัวใหญ่อ่านง่าย */
function renderClockFace(st, it){
  const h = it.clock.h % 12, m = it.clock.m;
  const ha = (h + m / 60) * 30 - 90, ma = m * 6 - 90;
  const R = 78, C = 92;
  const hand = (ang, len, w, col) => {
    const x = C + Math.cos(ang * Math.PI / 180) * len, y = C + Math.sin(ang * Math.PI / 180) * len;
    return '<line x1="' + C + '" y1="' + C + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"'
         + ' stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  };
  let ticks = '';
  for(let i = 0; i < 12; i++){
    const a = i * 30 - 90;
    const x = C + Math.cos(a * Math.PI / 180) * (R - 11), y = C + Math.sin(a * Math.PI / 180) * (R - 11);
    ticks += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.4" fill="#E0B072"/>';
  }
  let nums = '';
  [[12, 0], [3, 90], [6, 180], [9, 270]].forEach(([n, a])=>{
    const x = C + Math.cos((a - 90) * Math.PI / 180) * (R - 27);
    const y = C + Math.sin((a - 90) * Math.PI / 180) * (R - 27);
    nums += '<text x="' + x.toFixed(1) + '" y="' + (y + 8).toFixed(1) + '" text-anchor="middle"'
          + ' font-size="21" font-weight="900" fill="#8A5A2B">' + n + '</text>';
  });
  const wrap = document.createElement('div');
  wrap.className = 'hqz-clock';
  wrap.innerHTML = '<svg viewBox="0 0 184 184" role="img" aria-label="หน้าปัดนาฬิกา">'
    + '<circle cx="' + C + '" cy="' + C + '" r="' + R + '" fill="#FFF6E6" stroke="#F0C58A" stroke-width="7"/>'
    + ticks + nums
    /* ⚠ วาดเข็มยาว (นาที) ก่อน แล้วค่อยเข็มสั้น (ชั่วโมง) — **เข็มสั้นต้องอยู่หน้า**
       กติกาเดียวกับเกมนาฬิกาวิเศษในหน้าหลัก จะได้อ่านนาฬิกาแบบเดียวกันทั้งแอป */
    + hand(ma, 60, 6, '#8A5A2B') + hand(ha, 40, 9, '#E07A3F')
    + '<circle cx="' + C + '" cy="' + C + '" r="7" fill="#8A5A2B"/></svg>';
  st.appendChild(wrap);
  /* 🕐 **แบ่งครึ่งการ์ด: หน้าปัดซ้าย · โจทย์+ตัวเลือกขวา** (ผู้ใช้สั่ง 2026-08-17)
     ของเดิมเรียงลงมาเป็นคอลัมน์เดียว หน้าปัดเลยถูกบีบให้เล็ก (196px) เพื่อเผื่อที่ให้ตัวเลือกด้านล่าง
     ⚠ ติดคลาสจาก JS **ห้ามใช้ `:has()` ใน CSS** — แท็บเล็ตรุ่นเก่าที่เป็นเครื่องเป้าหมายยังไม่รองรับ
     ⚠ `qzStageClear()` ต้องถอดคลาสนี้ออกด้วย ไม่งั้นข้อถัดไปที่ไม่มีนาฬิกาจะโดนจัดเป็น 2 คอลัมน์ค้าง */
  st.classList.add('hqz-split');
}
/* ================= เฟส 6: บีกเกอร์ตวงน้ำ (แล็บ measure-lab) =================
   วาดเป็น SVG อ่านออกในโค้ด (ไม่ใช่ base64) แบบเดียวกับหน้าปัดนาฬิกา
   ⚠ **ต้องมีตัวเลขกำกับขีดจริง** ไม่ใช่ขีดเปล่าๆ — โจทย์คือ "อ่านค่าจากขีด" ถ้าไม่มีเลขบอก
     เด็กต้องนับขีดเอาเองซึ่งกลายเป็นโจทย์คนละข้อ (และชั้นเล็กนับไม่ทัน)
   ⚠ ระดับน้ำวัดจาก **ก้นบีกเกอร์ขึ้นบน** — วาดกลับหัวแล้วโจทย์ผิดทั้งข้อโดยไม่มี error ให้จับ */
function renderBeaker(st, it){
  const b = it.beaker || {val:0, max:100, step:10};
  const W = 150, H = 190, X0 = 30, Y0 = 22, BW = 84, BH = 148;   /* กรอบแก้ว */
  const p = Math.max(0, Math.min(1, b.val / b.max));
  const wy = Y0 + BH * (1 - p);                                   /* ผิวน้ำ */
  let ticks = '';
  const nTick = Math.round(b.max / b.step);
  const every = nTick > 10 ? Math.ceil(nTick / 10) : 1;           /* ขีดเยอะไปก็เขียนเลขห่างขึ้น */
  for(let i = 1; i <= nTick; i++){
    const y = Y0 + BH * (1 - i / nTick);
    const long = (i % every === 0);
    ticks += '<line x1="' + X0 + '" y1="' + y.toFixed(1) + '" x2="' + (X0 + (long ? 20 : 11))
           + '" y2="' + y.toFixed(1) + '" stroke="#9BC7DE" stroke-width="2.4" stroke-linecap="round"/>';
    if(long)
      ticks += '<text x="' + (X0 + BW + 7) + '" y="' + (y + 5).toFixed(1) + '" font-size="13"'
             + ' font-weight="800" fill="#5C86A0">' + (i * b.step) + '</text>';
  }
  const wrap = document.createElement('div');
  wrap.className = 'hqz-beaker';
  wrap.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="บีกเกอร์ตวงน้ำ">'
    + '<clipPath id="hqz-bk-clip"><rect x="' + X0 + '" y="' + Y0 + '" width="' + BW + '" height="' + BH
    + '" rx="9"/></clipPath>'
    /* น้ำ (ตัดด้วย clip ให้อยู่ในแก้วเสมอ) + ผิวน้ำเข้มกว่านิดหน่อยให้เห็นระดับชัด */
    + '<g clip-path="url(#hqz-bk-clip)">'
    + '<rect x="' + X0 + '" y="' + wy.toFixed(1) + '" width="' + BW + '" height="' + (Y0 + BH - wy).toFixed(1)
    + '" fill="#7FD1F0"/>'
    + '<rect x="' + X0 + '" y="' + wy.toFixed(1) + '" width="' + BW + '" height="5" fill="#4FB8DE"/></g>'
    + '<rect x="' + X0 + '" y="' + Y0 + '" width="' + BW + '" height="' + BH
    + '" rx="9" fill="none" stroke="#8AB6CC" stroke-width="4"/>'
    + ticks + '</svg>';
  st.appendChild(wrap);
}
/* ================= เฟส 9: เล่นตามทำนอง (play-along) =================
   ฟังทำนองแล้วกดปุ่มโน้ตตามลำดับ — ปุ่มใช้สีประจำโน้ตชุดเดียวกับเปียโนของหน้าหลัก
   (MUSIC_WHITE_KEYS มีฟิลด์ `color` อยู่แล้ว) เด็กจะได้จำสีเดียวกันทั้งแอป
   ⚠ กดผิด = **เริ่มกดใหม่ข้อนั้นเฉยๆ ไม่มีบทลงโทษอื่น** (กติกาเหล็กข้อ 2)
   ⚠ ปุ่มฟังซ้ำได้ไม่จำกัดเสมอ */
function renderPlayAlong(st, it){
  const q = document.createElement('div'); q.className = 'hqz-q'; q.textContent = it.q;
  st.appendChild(q);

  const row = document.createElement('div'); row.className = 'hqz-row';
  const listen = qzBtn('🔊 ฟังอีกครั้ง', 'hqz-no', ()=> play());
  listen.dataset.hpClick = '1';
  row.appendChild(listen);
  st.appendChild(row);

  const keys = document.createElement('div'); keys.className = 'hqz-keys';
  const got = [];
  const btns = [];
  for(let i = 0; i < it.keys; i++){
    const k = (typeof MUSIC_WHITE_KEYS !== 'undefined') ? MUSIC_WHITE_KEYS[i] : null;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hqz-key';
    b.dataset.hpClick = '1';
    if(k) b.style.background = '#' + k.color.toString(16).padStart(6, '0');
    b.textContent = k ? k.th : String(i + 1);
    b.addEventListener('click', ()=>{
      if(qLock) return;
      if(k && typeof playPianoNote === 'function') playPianoNote(k.freq, .5);
      b.classList.add('on');
      setTimeout(()=> b.classList.remove('on'), 180);
      got.push(i);
      /* กดผิดตั้งแต่ตัวแรกก็บอกทันที ไม่ต้องรอกดจนครบ (เด็กจะได้ไม่งงว่าพลาดตรงไหน) */
      const at = got.length - 1;
      if(got[at] !== it.seq[at]){
        got.length = 0;
        dots.querySelectorAll('.hqz-kdot').forEach(d=>d.classList.remove('on'));
        b.classList.add('bad');
        setTimeout(()=> b.classList.remove('bad'), 400);
        answerQuest(-1, b);        /* นับพลาด 1 ครั้งผ่านทางเดิม (ดาวลด แต่เล่นต่อได้) */
        return;
      }
      const d = dots.children[at]; if(d) d.classList.add('on');
      if(got.length === it.seq.length) submitQuestPayload(got.slice());
    });
    btns.push(b); keys.appendChild(b);
  }
  /* จุดบอกว่ากดถูกไปกี่ตัวแล้ว — เด็กเห็นความคืบหน้าโดยไม่ต้องนับเอง */
  const dots = document.createElement('div'); dots.className = 'hqz-kdots';
  it.seq.forEach(()=>{ const d = document.createElement('i'); d.className = 'hqz-kdot'; dots.appendChild(d); });
  st.appendChild(dots);
  st.appendChild(keys);

  let playing = false;
  function play(){
    if(playing || typeof playMusicSequence !== 'function') return;
    playing = true;
    /* ⚠ noFlash = true เสมอ — ไม่มีเปียโนของหน้าหลักอยู่บนจอในโหมดบ้าน */
    playMusicSequence(it.sound.seq, true, null, {
      onNote: i => { const b = btns[it.sound.seq[i]]; if(b){ b.classList.add('on');
        setTimeout(()=> b.classList.remove('on'), 200); } },
      onStop: ()=>{ playing = false; },
    });
  }
  setTimeout(()=>{ if(qRun && qRun.items[qRun.idx] === it) play(); }, 300);
}
/* ================= เฟส 7: จับผิดภาพ (spot-diff) =================
   2 แถวจากฉากเดียวกัน ต่างกัน 1 ชิ้น — เด็กเลือกจากปุ่มตัวเลือกว่าชิ้นไหนหายไปจากแถวล่าง
   ⚠ แถวต้อง **เรียงตรงคอลัมน์กัน** เด็กถึงจะเทียบได้ (ใช้ grid คอลัมน์เท่ากันทั้งสองแถว)
     ถ้าปล่อยเป็น flex-wrap ธรรมดา ของจะเลื่อนไม่ตรงกันแล้วเทียบไม่ได้เลย */
function renderSpotRows(st, it){
  const box = document.createElement('div');
  box.className = 'hqz-spot';
  const n = Math.max(it.rows[0].length, it.rows[1].length);
  it.rows.forEach((row, ri)=>{
    const r = document.createElement('div');
    r.className = 'hqz-spot-row';
    r.style.gridTemplateColumns = 'repeat(' + n + ', minmax(0, 1fr))';
    row.forEach(e=>{
      const c = document.createElement('span'); c.className = 'hqz-spot-cell'; c.textContent = e;
      r.appendChild(c);
    });
    box.appendChild(r);
    if(ri === 0){
      const div = document.createElement('div'); div.className = 'hqz-spot-div';
      box.appendChild(div);
    }
  });
  st.appendChild(box);
}
/* ================= เฟส 7: นับแว้บเดียว (flash-count) =================
   หน้าแรกโชว์ของกระจาย 2-3 วิ แล้วไปหน้าถามเอง (ทางเดียวกับ renderMemoryList ของเกมจำรายการ)
   ⚠ **ห้ามให้ย้อนกลับมาดูซ้ำ** — ตัวกลไกคือการจำภาพ แต่ **ตอบช้าแค่ไหนก็ได้** ไม่มีจับเวลาตอบ
   ⚠ ต้องจำว่าโชว์ไปแล้วด้วย `qFlashDone` ไม่งั้นตอบผิดแล้ว renderQuestStep() วาดใหม่
     จะย้อนไปโชว์ของอีกรอบ = เฉลยให้ฟรี */
/* ================= ⏳ เลขนับถอยหลังของเกมความจำ (2026-08-16 · ผู้ใช้สั่ง) =================
   เกมที่ต้อง "จำแล้วของจะหาย" (นับแว้บเดียว · ของหายไปไหน · ทำตามสูตร · จำของที่แม่สั่ง)
   เดิม**ไม่บอกเลยว่ามีเวลาดูกี่วินาที** ⇒ เด็กยังดูไม่ทันของก็หายไปแล้ว รู้สึกเหมือนถูกแกล้ง
   ⇒ โชว์เลขนับถอยหลังตัวใหญ่ระหว่างที่ยังดูได้ **เด็กจะได้รู้ว่าเหลือเวลาอีกเท่าไร**

   ⚠ **นี่ไม่ใช่ "จับเวลาตอบ"** ซึ่งกติกาเหล็กข้อ 2 ห้ามไว้ — เป็นแค่การบอกล่วงหน้าว่า
     ของจะหายเมื่อไร (ของมันหายอยู่แล้วตั้งแต่แรก แค่เดิมไม่บอก) ตอบช้าแค่ไหนก็ยังไม่มีโทษ
   ⚠ คืนฟังก์ชันยกเลิกไว้ให้เสมอ — ปิดการ์ดกลางนับถอยหลังแล้วต้องหยุด ไม่งั้นตัวจับเวลาค้าง */
function attachCountdown(st, ms, onEnd){
  const wrap = document.createElement('div');
  wrap.className = 'hqz-count';
  const ring = document.createElement('span'); ring.className = 'hqz-count-ring';
  const num = document.createElement('span'); num.className = 'hqz-count-n';
  wrap.appendChild(ring); wrap.appendChild(num);
  st.appendChild(wrap);
  const total = Math.max(1000, ms | 0);
  const t0 = Date.now();
  let raf = 0, tid = 0, dead = false;
  const paint = ()=>{
    if(dead) return;
    const left = Math.max(0, total - (Date.now() - t0));
    num.textContent = String(Math.ceil(left / 1000));
    wrap.style.setProperty('--p', (1 - left / total).toFixed(3));
    if(left <= 0) return;
    raf = requestAnimationFrame(paint);
  };
  paint();
  tid = setTimeout(()=>{ if(!dead){ dead = true; cancelAnimationFrame(raf); onEnd(); } }, total);
  return ()=>{ dead = true; cancelAnimationFrame(raf); clearTimeout(tid); };
}
let qFlashDone = {};
function renderFlashShow(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = 'ดูให้ดีนะ เดี๋ยวจะถาม!';
  const show = document.createElement('div'); show.className = 'hqz-show hqz-flash';
  show.textContent = it.flash.cells.join('');
  st.appendChild(line); st.appendChild(show);
  let done = false, cancel = null;
  const go = ()=>{
    if(done) return;
    done = true;
    if(cancel) cancel();
    qFlashDone[qRun.idx] = 1;
    renderQuestStep();
  };
  cancel = attachCountdown(st, it.flash.showFor || 2600, go);
}
/* ================= เฟส 13: 🫥 ของหายไปไหน (ข้อ 52) =================
   2 จังหวะ: โชว์ของครบบนโต๊ะ → ผ้าคลุมลงมา → เปิดออกมามีช่องว่าง 1 ช่อง
   เด็กตอบด้วยการ **แตะตัวของบนถาดตรงๆ** ไม่ใช่กดตัวเลือกที่เป็นข้อความ

   ⚠ ใช้ `qFlashDone` จำว่าโชว์ไปแล้ว — กับดักเดียวกับ `flashcount`:
     ตอบผิดแล้ว renderQuestStep() วาดใหม่ ถ้าไม่จำจะย้อนไปโชว์ของอีกรอบ = **เฉลยให้ฟรี**
   ⚠ ของบนถาดต้องเป็นชุดเดิมทั้งหมด ไม่มีตัวลวง (ดูเหตุผลที่ vanishMech ใน js/house-quests.js) */
function renderVanishShow(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = 'ดูของบนโต๊ะให้ดีนะ เดี๋ยวนกฮูกจะเอาผ้าคลุม!';
  const tray = document.createElement('div'); tray.className = 'hqz-vanish-tray';
  it.before.forEach(e=>{
    const t = document.createElement('span'); t.className = 'hqz-vtile'; t.textContent = e;
    tray.appendChild(t);
  });
  st.appendChild(line); st.appendChild(tray);
  let done = false, cancel = null;
  const go = ()=>{
    if(done) return;
    done = true;
    if(cancel) cancel();
    qFlashDone[qRun.idx] = 1;
    renderQuestStep();
  };
  /* ผ้าคลุมลงมาให้เห็นชัดๆ ก่อนเปลี่ยนหน้า — เด็กจะได้รู้ว่า "ตอนนี้แหละที่ของหาย" */
  cancel = attachCountdown(st, it.showFor || 2600,
    ()=>{ tray.classList.add('covered'); setTimeout(go, 620); });
}
function renderVanishPick(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = it.q;
  st.appendChild(line);
  /* โต๊ะหลังเปิดผ้า — ช่องที่ของหายไปเป็นช่องว่างเส้นประ ให้เด็กเห็นว่าตรงนี้เคยมีของ */
  const tray = document.createElement('div'); tray.className = 'hqz-vanish-tray';
  it.after.forEach(e=>{
    const t = document.createElement('span');
    t.className = 'hqz-vtile' + (e ? '' : ' gap');
    t.textContent = e || '';
    tray.appendChild(t);
  });
  st.appendChild(tray);
  const pickLine = document.createElement('div'); pickLine.className = 'hqz-sub';
  pickLine.textContent = 'แตะของชิ้นที่หายไป';
  st.appendChild(pickLine);
  /* ถาดของให้แตะ — เป็น <button> จริงเพื่อให้โหมดมือ (ชี้ค้าง) ใช้ได้เหมือนตัวเลือกอื่น */
  const pick = document.createElement('div'); pick.className = 'hqz-vanish-pick';
  it.choices.forEach((e, i)=>{
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hqz-vtile hqz-vpick';
    b.textContent = e;
    b.addEventListener('click', ()=>answerQuest(i, b));
    pick.appendChild(b);
  });
  st.appendChild(pick);
}
/* ================= 🪙 หน้าเหรียญ (2026-08-16 · ผู้ใช้สั่ง) =================
   เกมที่เกี่ยวกับเงินทุกเกมต้องใช้ **เหรียญนกฮูกของเกม** ไม่ใช่อิโมจิ 🪙
   ⚠ กติกาเดิมของโปรเจค: **ห้ามใช้อิโมจิ 🪙** บางเครื่องไม่มี glyph แล้วขึ้นเป็นกล่องเทา
   ⚠ **ตัวเลขต้องอยู่บนตัวเหรียญ** — เดิมวาดเหรียญกับเลขแยกกัน เด็กอ่านเป็น "วงกลม + เลข"
     ไม่ใช่ "เหรียญห้า" ⇒ จำหน้าเหรียญไม่ได้ */
function coinFace(v){
  const c = document.createElement('span');
  /* คลาส cv1/cv2/cv5/cv10 คุมทั้งขนาดและสีตามดีไซน์ที่ผู้ใช้กำหนด
     ⚠ เหรียญที่ไม่ใช่ 1/2/5/10 (ไม่ควรมี) ตกมาที่หน้าตาของเหรียญ 1 */
  c.className = 'hqz-coinface cv' + ([1,2,5,10].indexOf(v) >= 0 ? v : 1);
  const n = document.createElement('span');
  n.className = 'hqz-cn'; n.textContent = String(v);   /* ต้องเป็น element จะได้ทับชั้นในของเหรียญ 10 */
  c.appendChild(n);
  return c;
}
/* 💵 ธนบัตร 20 เขียว · 50 ฟ้า · 100 แดง — ชุดเดียวกับหน้าหลัก (คลาส `.money-bill` เป็น global)
   ⚠ **ห้ามวาดธนบัตรเป็นวงกลม** ต้องเป็นสี่เหลี่ยม ไม่งั้นเด็กนับปนกับเหรียญ */
function billFace(v){
  const b = document.createElement('span');
  b.className = 'money-bill ' + (v >= 100 ? 'b100' : (v >= 50 ? 'b50' : 'b20'));
  const n = document.createElement('span');
  n.className = 'mb-n'; n.textContent = String(v);
  b.appendChild(n);
  return b;
}
function isBillVal(v){ return v === 20 || v === 50 || v === 100; }
function moneyFaceEl(v){ return isBillVal(v) ? billFace(v) : coinFace(v); }
/* แตกจำนวนเงินเป็นแบงก์+เหรียญ (ใหญ่ไปเล็ก) — ใช้โชว์ตัวเลือกของเกมทอนเงิน
   ⚠ ต้องเรียงจากใหญ่ไปเล็กเสมอ เด็กจะได้นับง่าย (100,50,10,5 ไม่ใช่ 5,100,10,50)
   ⚠ **ต้องมีแบงก์ 20/50/100 ด้วย** (ผู้ใช้สั่ง 2026-08-17) ไม่งั้นเงินทอน 80 บาท
     กลายเป็นเหรียญ 10 แปดเหรียญ เด็กนับไม่ไหวและกองยาวจนล้นการ์ด */
const COIN_FACES = [100, 50, 20, 10, 5, 2, 1];
function coinBreak(n){
  const out = [];
  let left = Math.max(0, n | 0), guard = 0;
  while(left > 0 && guard++ < 40){
    const u = COIN_FACES.filter(c => c <= left)[0];
    if(!u) break;
    out.push(u); left -= u;
  }
  return out;
}
/* แถวเงินจากจำนวนเงิน (แบงก์ + เหรียญ) */
function coinRow(n, size){
  const row = document.createElement('div');
  row.className = 'hqz-coinrow' + (size ? ' ' + size : '');
  coinBreak(n).forEach(v => row.appendChild(moneyFaceEl(v)));
  return row;
}
/* 🗑️ แถบตัวอย่าง "เหรียญแต่ละแบบราคาเท่าไหร่" ถูกถอดออก 2026-08-16 (ผู้ใช้สั่ง)
   — เกมจ่ายเงินมีแถวเลือกเหรียญที่โชว์ค่าบนหน้าเหรียญอยู่แล้ว ใส่เพิ่มกลายเป็นเหรียญ 8 อันบนจอ
   — เกมทอนเงินก็ไม่ต้องมี เด็กดูจากหน้าเหรียญในตัวเลือกได้เลย
   🔒 **ห้ามใส่กลับ** ทั้ง 2 เกม เว้นแต่ผู้ใช้สั่งใหม่

/* ================= 💰 จ่ายเงินให้พอดี — แตะที่เหรียญได้เลย (2026-08-16) =================
   ผู้ใช้สั่ง: **"ให้มีเหรียญ 4 แบบให้เด็กเลือกเองว่าจะจ่ายด้วยเหรียญอะไรได้บ้าง
   และไม่ต้องมีกรอบคำตอบ ให้หยิบที่เหรียญได้เลย"**

   ⇒ ไม่มีถาด ไม่มีถังให้ลาก — แตะเหรียญ 1/2/5/10 เพื่อหยิบใส่ · แตะเหรียญที่จ่ายแล้วเพื่อเอาคืน
   ⚠ **ทุกวิธีที่รวมได้พอดีถือว่าถูกหมด** (จ่าย 6 ด้วย 5+1 หรือ 2+2+2 ก็ถูกทั้งคู่)
   ⚠ จ่ายเกินไม่ใช่ "ผิด" — แค่ยังกดยืนยันไม่ได้ เอาเหรียญออกแล้วลองใหม่ (กติกาเหล็กข้อ 2) */
function renderCoinPay(st, it){
  const paid = it._paid || (it._paid = []);
  const q = document.createElement('div'); q.className = 'hqz-q'; q.textContent = it.q;
  st.appendChild(q);
  /* ⚠ **ห้ามใส่แถบ "เหรียญของเรา" ที่นี่** (ผู้ใช้สั่งย้ำ 2026-08-16) —
     แถวเลือกเหรียญข้างล่างโชว์ค่าบนหน้าเหรียญอยู่แล้ว ใส่แถบตัวอย่างเพิ่มจะกลายเป็น
     **เหรียญ 8 อันบนจอ** เด็กนึกว่ามีเหรียญมากกว่า 4 แบบ
     ⇒ เกมนี้ต้องเห็นเหรียญ **4 อันเท่านั้น** · แถบตัวอย่างมีเฉพาะเกมทอนเงิน (ที่ไม่มีแถวเลือก) */
  const wrap = document.createElement('div'); wrap.className = 'hqz-pay';
  const repaint = ()=>{ qzStageClear(); renderCoinPay(qzStage(), it); };

  /* --- เหรียญ 4 แบบให้เลือก (แตะเพื่อหยิบใส่) --- */
  const pick = document.createElement('div'); pick.className = 'hqz-pay-pick';
  (it.units || [1,2,5,10]).forEach(u=>{
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hqz-pay-btn';
    b.dataset.hpClick = '1';
    b.setAttribute('aria-label', 'หยิบเหรียญ ' + u);
    b.appendChild(moneyFaceEl(u));
    b.addEventListener('click', ()=>{
      if(qLock) return;
      if(typeof playClick==='function') playClick();
      paid.push(u);
      repaint();
    });
    pick.appendChild(b);
  });
  wrap.appendChild(pick);

  /* --- เหรียญที่จ่ายไปแล้ว (แตะเพื่อเอาคืน) --- */
  const bag = document.createElement('div'); bag.className = 'hqz-pay-paid';
  if(!paid.length){
    const e = document.createElement('span'); e.className = 'hqz-pay-empty';
    e.textContent = 'แตะเหรียญข้างบนเพื่อหยิบมาจ่าย';
    bag.appendChild(e);
  }else{
    paid.forEach((u, i)=>{
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'hqz-pay-btn';
      b.dataset.hpClick = '1';
      b.setAttribute('aria-label', 'เอาเหรียญ ' + u + ' คืน');
      b.appendChild(moneyFaceEl(u));
      b.addEventListener('click', ()=>{
        if(qLock) return;
        if(typeof playClick==='function') playClick();
        paid.splice(i, 1);
        repaint();
      });
      bag.appendChild(b);
    });
  }
  wrap.appendChild(bag);

  const sum = paid.reduce((a, c) => a + c, 0);
  const tot = document.createElement('div');
  tot.className = 'hqz-pay-sum' + (sum === it.price ? ' ok' : '');
  tot.textContent = 'จ่ายแล้ว ' + sum + ' / ต้องจ่าย ' + it.price + ' บาท';
  wrap.appendChild(tot);
  st.appendChild(wrap);

  const row = document.createElement('div'); row.className = 'hqz-row';
  if(paid.length){
    row.appendChild(qzBtn('เอาคืนหมด', 'hqz-no', ()=>{
      if(typeof playClick==='function') playClick();
      it._paid = []; repaint();
    }));
  }
  row.appendChild(qzBtn('จ่ายเลย!', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    if(sum !== it.price){
      /* ⚠ ยังไม่พอดี = **ไม่นับว่าผิด** แค่บอกให้ลองใหม่ (กติกาเหล็กข้อ 2) */
      if(typeof showToast==='function')
        showToast('💰', sum < it.price ? 'ยังไม่พอนะ ใส่อีกนิด' : 'เกินไปนิดนึง เอาออกบ้างสิ');
      return;
    }
    it._paid = [];
    submitQuestPayload(paid.slice());
  }));
  st.appendChild(row);
}

/* ================= 🏪 ชุด B (2026-08-16): งานที่ต้อง "ไปทำที่ร้านสะดวกซื้อ" =================
   รูปแบบที่ผู้ใช้กำหนด: **รับคำสั่ง → เดินไปทำที่ร้านจริง → เดินกลับมาส่งงาน**
   ⇒ การ์ดใบเดียวกันวาด 2 หน้า ขึ้นกับว่าอยู่ขาไหน (`walkQuest.leg`)
       ขา 1 (ยังไม่ได้รับงาน / ยังไม่ถึงร้าน) → การ์ดรับงานปกติ
       ขา 2 (ยืนอยู่ที่ร้านแล้ว)             → กระดานทำงานจริง

   🔒 กติกาที่ต้องผ่าน (เหมือนทุกเกมในโหมดนี้):
     - ไม่มีจับเวลา ไม่มีคำว่าแพ้ · หยิบผิดแค่เอาออกได้ ไม่นับพลาด
     - **เงินที่จ่ายไปต้องได้คืนตอนจบเควสต์** (ผู้ใช้สั่ง) — ผ่าน `questSpend()`
     - ⚠ เงินไม่พอต้องไม่ตัน: ปุ่มจ่ายจะบอกให้ไปหาเงินก่อน แล้วกลับมาทำต่อได้ */
function renderMartStep(st, it){
  /* ยังไม่ได้ออกเดิน หรือยังไม่ถึงร้าน → การ์ดรับงานเดิม */
  if(!walkQuest || walkQuest.leg !== 2){ renderWalkStep(st, it); return; }
  if(it.job === 'shelf')  return renderMartShelf(st, it);
  if(it.job === 'change') return renderMartChange(st, it);
  return renderMartShop(st, it);
}
/* ---------- 🛒 หยิบของตามรายการ แล้วจ่ายเงิน ---------- */
function renderMartShop(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = 'หยิบของให้ครบตามรายการ แล้วกดจ่ายเงินนะ';
  st.appendChild(line);
  const picked = it._picked || (it._picked = {});
  const paint = ()=>{ qzStageClear(); renderMartShop(qzStage(), it); };

  /* รายการที่สั่ง — ติ๊กเองเมื่อหยิบครบ */
  const list = document.createElement('div'); list.className = 'hqz-tray hqz-memlist';
  it.want.forEach(w=>{
    const b = document.createElement('div');
    const got = (picked[w.k] | 0);
    b.className = 'hqz-tile hqz-tile-lab' + (got >= w.n ? ' ok' : '');
    b.innerHTML = '<span class="hqz-tile-em">' + w.e + '</span>'
                + '<span class="hqz-tile-tx">' + w.name + ' ' + Math.min(got, w.n) + '/' + w.n + '</span>';
    list.appendChild(b);
  });
  st.appendChild(list);

  /* ชั้นวางของในร้าน — แตะเพื่อหยิบ แตะซ้ำที่ตะกร้าเพื่อเอาออก */
  const shelf = document.createElement('div'); shelf.className = 'hqz-tray hqz-mart-shelf';
  it.shelf.forEach(g=>{
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hqz-tile hqz-tile-lab hqz-mart-item';
    b.dataset.hpClick = '1';
    b.innerHTML = '<span class="hqz-tile-em">' + g.e + '</span>'
                + '<span class="hqz-tile-tx">' + g.name + '</span>'
                + '<span class="hqz-mart-price">' + g.price + ' บาท</span>';
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      picked[g.k] = (picked[g.k] | 0) + 1;
      paint();
    });
    shelf.appendChild(b);
  });
  st.appendChild(shelf);

  /* ตะกร้า + ยอดรวม */
  const keys = Object.keys(picked).filter(k => picked[k] > 0);
  const total = keys.reduce((a, k)=>{
    const g = it.shelf.filter(x => x.k === k)[0];
    return a + (g ? g.price * picked[k] : 0);
  }, 0);
  const bag = document.createElement('div'); bag.className = 'hqz-mart-bag';
  bag.textContent = keys.length ? 'ในตะกร้า: ' + keys.map(k=>{
    const g = it.shelf.filter(x => x.k === k)[0];
    return (g ? g.e + ' ×' + picked[k] : '');
  }).join('  ') + '   รวม ' + total + ' บาท' : 'ตะกร้ายังว่างอยู่';
  st.appendChild(bag);

  const row = document.createElement('div'); row.className = 'hqz-row';
  if(keys.length){
    row.appendChild(qzBtn('เอาออกทั้งหมด', 'hqz-no', ()=>{
      if(typeof playClick==='function') playClick();
      it._picked = {}; paint();
    }));
  }
  const done = it.want.every(w => (picked[w.k] | 0) >= w.n)
            && it.want.reduce((a, w) => a + w.n, 0) === keys.reduce((a, k) => a + picked[k], 0);
  row.appendChild(qzBtn('จ่ายเงิน ' + total + ' บาท', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    if(!done){
      if(typeof showToast==='function') showToast('🛒', 'ของยังไม่ตรงรายการนะ ลองดูอีกที');
      return;
    }
    /* ⚠ เงินไม่พอ = ไม่ตัน แค่บอกให้ไปหาเงินก่อนแล้วกลับมาทำต่อ */
    if(!window.OwlCoins || window.OwlCoins.get() < total){
      if(typeof showToast==='function') showToast('💰', 'เงินยังไม่พอ ไปหาเงินเพิ่มแล้วกลับมาได้เลย');
      return;
    }
    window.OwlCoins.spend(total);
    questSpend(total);                 /* 💸 จดไว้คืนตอนจบเควสต์ */
    if(typeof playCorrect==='function') playCorrect();
    if(typeof showToast==='function') showToast('🛒', 'ซื้อครบแล้ว! เอาไปส่งได้เลย');
    martBoardDone();
  }));
  st.appendChild(row);
}
/* ---------- 💵 ทอนเงิน — ซื้อของจริงแล้วเลือกว่าต้องได้ทอนเท่าไร ----------
   ⚠ **ตัวเลือกเป็นกองเหรียญ ไม่ใช่ตัวเลข** (ผู้ใช้สั่ง 2026-08-16) — เด็กต้องนับเอง
     ถ้าเขียนเป็น "8 เหรียญ" เด็กแค่จำเลขจากโจทย์ ไม่ได้ฝึกนับเงินจริง
   ⚠ ต้องมี **แถบตัวอย่างบอกว่าเหรียญแต่ละแบบราคาเท่าไหร่** ให้ดูเทียบได้ตลอด */
function renderMartChange(st, it){
  /* ⚠ **โจทย์ต้องตัวใหญ่** (ผู้ใช้แจ้ง 2026-08-16 ว่าเล็กเกินไปมองยาก) —
     เกมนี้เด็กต้องอ่านราคาแล้วคิดลบในหัว ถ้าอ่านราคาไม่ชัดตั้งแต่แรกก็จบ */
  const line = document.createElement('div'); line.className = 'hqz-q hqz-change-q';
  line.textContent = it.q2;
  st.appendChild(line);

  /* ของที่ซื้อ + ราคา — ราคาต้องเด่นที่สุดในบรรทัด (เป็นตัวเลขที่เด็กต้องเอาไปคิด) */
  const row = document.createElement('div'); row.className = 'hqz-change-item';
  const em = document.createElement('span'); em.className = 'hqz-change-em'; em.textContent = it.item.e;
  const nm = document.createElement('span'); nm.className = 'hqz-change-nm'; nm.textContent = it.item.name;
  const pr = document.createElement('span'); pr.className = 'hqz-change-pr';
  pr.textContent = 'ราคา ' + it.item.price + ' บาท';
  row.appendChild(em); row.appendChild(nm); row.appendChild(pr);
  st.appendChild(row);

  const lbl = document.createElement('div'); lbl.className = 'hqz-change-lbl';
  lbl.textContent = 'จ่ายไป';
  st.appendChild(lbl);
  st.appendChild(coinRow(it.paid, 'sm'));

  const tray = document.createElement('div'); tray.className = 'hqz-tray';
  it.choices.forEach((amount, i)=>{
    const b = document.createElement('button');
    /* ⚠ **กรอบต้องเท่ากันทุกอัน** (ผู้ใช้สั่ง 2026-08-16) — จำนวนเหรียญแต่ละกองไม่เท่ากัน
       ถ้าปล่อยให้กรอบยืดตามเนื้อใน กองที่เหรียญเยอะจะกล่องใหญ่กว่า = **ใบ้คำตอบให้เด็ก** */
    b.type = 'button'; b.className = 'hqz-tile hqz-change-opt';
    b.dataset.hpClick = '1';
    b.setAttribute('aria-label', 'ทอน ' + amount + ' บาท');
    /* ⚠ **ห้ามย่อเหรียญในตัวเลือก** — ผู้ใช้แจ้ง 2026-08-16 ว่าย่อแล้วมองไม่เห็นเลย
       ตัวเลือกคือของที่เด็กต้องนับ ต้องใหญ่ที่สุดในการ์ด ไม่ใช่เล็กที่สุด */
    b.appendChild(coinRow(amount));         /* ไม่มีตัวเลขกำกับ — เด็กต้องนับเอง */
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      if(i !== it.correct){
        if(typeof playWrong==='function') playWrong();
        if(typeof showToast==='function') showToast('💵', 'ลองนับใหม่อีกทีนะ');
        return;                        /* ⚠ ตอบผิดไม่นับพลาด ไม่มีบทลงโทษ (กติกาเหล็กข้อ 2) */
      }
      if(typeof playCorrect==='function') playCorrect();
      /* จ่ายเงินจริงตามราคาของ แล้วได้ทอนกลับ ⇒ สุทธิเสียเท่าราคาของ */
      if(window.OwlCoins && window.OwlCoins.get() >= it.item.price){
        window.OwlCoins.spend(it.item.price);
        questSpend(it.item.price);
      }
      martBoardDone();
    });
    tray.appendChild(b);
  });
  st.appendChild(tray);
}
/* ---------- 🏪 จัดของขึ้นชั้น — แตะของ แล้วแตะชั้นที่ถูก ---------- */
function renderMartShelf(st, it){
  const placed = it._placed || (it._placed = {});
  const sel = it._sel;
  const paint = ()=>{ qzStageClear(); renderMartShelf(qzStage(), it); };
  const leftN = Math.ceil(it.bins.length / 2);        /* ชั้นซ้ายได้เศษ (2 ใบเมื่อมี 3 ชั้น) */

  const q = document.createElement('div'); q.className = 'hqz-q';
  q.textContent = sel ? 'แตะชั้นที่ของชิ้นนี้ควรอยู่' : 'แตะของที่จะจัด แล้วแตะชั้นที่ถูกหมวด';
  st.appendChild(q);

  /* --- ชั้นวางจริง: ชั้นอยู่ซ้าย-ขวา · ของที่ต้องจัดอยู่ตรงกลาง --- */
  const wrap = document.createElement('div'); wrap.className = 'hqz-shelfwrap';
  const cols = [document.createElement('div'), document.createElement('div')];
  cols[0].className = 'hqz-shelfcol left';
  cols[1].className = 'hqz-shelfcol right';

  it.bins.forEach((bin, bi)=>{
    const mine = it.tiles.filter(t => placed[t.k] === bin.id);
    const sh = document.createElement('button');
    sh.type = 'button';
    sh.className = 'hqz-shelf' + (sel ? ' pickable' : '');
    sh.dataset.hpClick = '1';
    sh.setAttribute('aria-label', bin.name);
    /* ป้ายชื่อชั้น — แขวนอยู่บนหัวชั้น บอกว่าชั้นนี้สำหรับอะไร */
    const tag = document.createElement('span'); tag.className = 'hqz-shelf-tag';
    const te = document.createElement('span'); te.className = 'hqz-shelf-tag-e'; te.textContent = bin.e;
    const tn = document.createElement('span'); tn.className = 'hqz-shelf-tag-n'; tn.textContent = bin.name;
    tag.appendChild(te); tag.appendChild(tn);
    sh.appendChild(tag);
    /* ตัวชั้น 2 แผ่น — ของที่วางแล้วไปเรียงอยู่บนแผ่น */
    const body = document.createElement('span'); body.className = 'hqz-shelf-body';
    [0, 1].forEach(row=>{
      const bd = document.createElement('span'); bd.className = 'hqz-shelf-board';
      const goods = document.createElement('span'); goods.className = 'hqz-shelf-goods';
      mine.filter((_, i) => i % 2 === row).forEach(t=>{
        const g = document.createElement('span'); g.className = 'hqz-shelf-item';
        g.textContent = t.e;
        goods.appendChild(g);
      });
      bd.appendChild(goods);
      body.appendChild(bd);
    });
    sh.appendChild(body);
    sh.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      if(!it._sel) return;
      const t = it.tiles.filter(x => x.k === it._sel)[0];
      if(!t) return;
      if(t.bin !== bin.id){
        if(typeof playWrong==='function') playWrong();
        if(typeof showToast==='function') showToast('🏪', 'ชั้นนี้ไม่ใช่ของชิ้นนี้นะ ลองชั้นอื่นดู');
        return;                                /* ⚠ วางผิดไม่นับพลาด แค่ไม่ยอมรับ */
      }
      placed[t.k] = bin.id;
      it._sel = null;
      if(typeof playCorrect==='function') playCorrect();
      if(it.tiles.every(x => placed[x.k])){
        if(typeof showToast==='function') showToast('🏪', 'จัดครบแล้ว! กลับไปบอกได้เลย');
        martBoardDone();
        return;
      }
      paint();
    });
    cols[bi < leftN ? 0 : 1].appendChild(sh);
  });

  /* --- ลังของตรงกลาง --- */
  const mid = document.createElement('div'); mid.className = 'hqz-shelfmid';
  const crate = document.createElement('div'); crate.className = 'hqz-crate';
  const rest = it.tiles.filter(t => !placed[t.k]);
  if(!rest.length){
    const e = document.createElement('div'); e.className = 'hqz-crate-empty'; e.textContent = 'จัดครบแล้ว!';
    crate.appendChild(e);
  }
  rest.forEach(t=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hqz-crate-it' + (sel === t.k ? ' sel' : '');
    b.dataset.hpClick = '1';
    b.setAttribute('aria-label', t.name);
    const em = document.createElement('span'); em.className = 'hqz-crate-em'; em.textContent = t.e;
    const nm = document.createElement('span'); nm.className = 'hqz-crate-nm'; nm.textContent = t.name;
    b.appendChild(em); b.appendChild(nm);
    /* 🖐️ **ลากวาง** (ผู้ใช้สั่ง 2026-08-16) — จับของแล้วลากไปปล่อยบนชั้น
       ⚠ **ยังเก็บ "แตะเลือกแล้วแตะชั้น" ไว้ด้วย** เพราะโหมดเล่นด้วยมือหน้ากล้องใช้ `click`
         ลากด้วยนิ้วชี้ในอากาศไม่ได้ ⇒ ถ้าตัดทิ้งเกมนี้จะเล่นด้วยมือไม่ได้เลย */
    b.addEventListener('click', ()=>{
      if(b.dataset.dragged === '1'){ b.dataset.dragged = ''; return; }   /* ลากจบแล้ว ไม่ต้องนับเป็นแตะ */
      if(typeof playClick==='function') playClick();
      it._sel = (sel === t.k) ? null : t.k;
      paint();
    });
    b.addEventListener('pointerdown', ev => startShelfDrag(ev, b, t, it, paint));
    crate.appendChild(b);
  });
  const lab = document.createElement('div'); lab.className = 'hqz-crate-lab';
  lab.textContent = 'ของที่ยังไม่ได้จัด ' + rest.length + '/' + it.tiles.length;
  mid.appendChild(crate); mid.appendChild(lab);

  wrap.appendChild(cols[0]); wrap.appendChild(mid); wrap.appendChild(cols[1]);
  st.appendChild(wrap);
}
/* ---------- 🖐️ ลากของไปวางบนชั้น (เกมจัดชั้นวาง) ----------
   ใช้ pointer event ตรงๆ ไม่พึ่ง HTML5 drag-and-drop (ซึ่งบนแท็บเล็ตใช้ไม่ได้)
   ⚠ ต้อง `setPointerCapture` ไม่งั้นลากออกนอกปุ่มแล้ว event หลุด
   ⚠ ตัวลากเป็น ghost ที่ `position:fixed` บน body — **ห้ามย้ายปุ่มจริง** ไม่งั้น layout เด้ง */
let shelfDrag = null;
function startShelfDrag(ev, btn, tile, it, paint){
  if(shelfDrag || ev.button > 0) return;
  const ghost = document.createElement('div');
  ghost.className = 'hqz-drag-ghost';
  ghost.innerHTML = '<span class="hqz-crate-em">' + tile.e + '</span>'
                  + '<span class="hqz-crate-nm">' + tile.name + '</span>';
  ghost.style.left = ev.clientX + 'px';
  ghost.style.top  = ev.clientY + 'px';
  document.body.appendChild(ghost);
  btn.classList.add('dragging');
  shelfDrag = {ghost, btn, tile, it, paint, moved:false, over:null};
  try{ btn.setPointerCapture(ev.pointerId); }catch(e){}
  const move = e2 =>{
    if(!shelfDrag) return;
    shelfDrag.moved = true;
    ghost.style.left = e2.clientX + 'px';
    ghost.style.top  = e2.clientY + 'px';
    ghost.style.display = 'none';
    const el = document.elementFromPoint(e2.clientX, e2.clientY);
    ghost.style.display = '';
    const sh = el && el.closest ? el.closest('.hqz-shelf') : null;
    if(sh !== shelfDrag.over){
      if(shelfDrag.over) shelfDrag.over.classList.remove('over');
      if(sh) sh.classList.add('over');
      shelfDrag.over = sh;
    }
  };
  const up = e2 =>{
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    document.removeEventListener('pointercancel', up);
    if(!shelfDrag) return;
    const d = shelfDrag; shelfDrag = null;
    if(d.over) d.over.classList.remove('over');
    d.btn.classList.remove('dragging');
    if(d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
    if(d.moved) d.btn.dataset.dragged = '1';      /* กัน click ที่ตามมาหลังปล่อยนิ้ว */
    if(!d.over || !d.moved){ if(d.moved) d.paint(); return; }
    /* ปล่อยบนชั้นแล้ว — ใช้ทางเดินเดียวกับการแตะเลือก (ตรวจถูก/ผิดที่เดียว) */
    d.it._sel = d.tile.k;
    d.over.dispatchEvent(new MouseEvent('click', {bubbles:true}));
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
  document.addEventListener('pointercancel', up);
}
/* ล้างเนื้อในการ์ดแล้ววาดใหม่ (กระดานร้านค้าวาดใหม่ทุกครั้งที่แตะ) */
function qzStageClear(){ const st = qzStage();
  if(!st) return;
  st.innerHTML = '';
  st.classList.remove('hqz-split');   /* 🕐 เลย์เอาต์ 2 คอลัมน์ของนาฬิกา ห้ามค้างไปข้อถัดไป */
}

/* ================= เฟส 5 ตกค้าง: ทายเสียง (sound-guess) =================
   ใช้ `playMusicSequence()` ของหน้าหลักตรงๆ (js/games-art.js) ไม่โหลดไฟล์เสียงเพิ่ม
   ⚠ **ต้องส่ง noFlash = true เสมอ** — ฟังก์ชันนั้นจะไปสั่ง flash คีย์เปียโนผ่าน `$('music-piano')`
     ซึ่งในโหมดบ้านไม่มีอยู่บนจอ (เกมเปียโนไม่ได้ถูก mount) ⇒ ปล่อยไว้จะพังทั้งการ์ด
   ⚠ กดฟังซ้ำได้ไม่จำกัด (กติกาเหล็กข้อ 2: ห้ามลงโทษเด็ก — ฟังรอบเดียวไม่ทันคือเรื่องปกติ) */
function renderSoundPlay(st, it){
  const wrap = document.createElement('div');
  wrap.className = 'hqz-sound';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'hqz-sound-btn';
  btn.dataset.hpClick = '1';                 /* โหมดมือ: ต้องชี้ค้างที่ปุ่มนี้ได้ด้วย */
  btn.innerHTML = '<span class="hqz-sound-ic">🔊</span><span>ฟังอีกครั้ง</span>';
  let playing = false;
  const play = ()=>{
    if(playing) return;
    playing = true;
    btn.classList.add('on');
    const done = ()=>{ playing = false; btn.classList.remove('on'); };
    /* 🎺 ข้อที่ระบุ `voice` มา = "ทายเสียงเครื่องดนตรี" ⇒ ต้องเล่นด้วยเสียงของเครื่องนั้นจริง
       ข้ออื่น (ทายเพลง/เสียงสูงต่ำ/นับโน้ต) ยังใช้เสียงเปียโนเดิมของหน้าหลักเหมือนเดิม */
    if(it.sound.voice && typeof playHouseTune === 'function'){
      playHouseTune(it.sound.seq, it.sound.voice, done);
      return;
    }
    if(typeof playMusicSequence !== 'function'){ done(); return; }
    playMusicSequence(it.sound.seq, true, it.sound.beats && it.sound.beats.length ? it.sound.beats : null,
      {onStop: done});
  };
  btn.addEventListener('click', play);
  wrap.appendChild(btn);
  st.appendChild(wrap);
  /* เล่นให้ฟังรอบแรกอัตโนมัติ — เด็กอ่านโจทย์ไม่ออกก็ยังรู้ว่าต้องฟัง
     หน่วงนิดหน่อยให้การ์ดวาดเสร็จก่อน ไม่งั้นเสียงมาก่อนภาพ */
  setTimeout(()=>{ if(qRun && qRun.items[qRun.idx] === it) play(); }, 260);
}
/* ================= เฟส 6: รายการคำสั่งหุ่นยนต์ (แล็บ code-debug) =================
   วาดเป็นแถวมีเลขบรรทัดกำกับ เพราะตัวเลือกอ้างถึง "บรรทัดที่ N" ตรงๆ
   ⚠ เลขบรรทัดต้องเห็นชัดเท่ากับตัวคำสั่ง ไม่ใช่เลขจางๆ — เด็กต้องจับคู่เลขกับปุ่มตัวเลือกให้ได้ */
function renderCodeLines(st, it){
  const box = document.createElement('div');
  box.className = 'hqz-code';
  (it.lines || []).forEach(ln=>{
    const row = document.createElement('div'); row.className = 'hqz-code-line';
    const n = document.createElement('span'); n.className = 'hqz-code-n'; n.textContent = ln.n;
    const e = document.createElement('span'); e.className = 'hqz-code-e'; e.textContent = ln.e;
    const t = document.createElement('span'); t.className = 'hqz-code-t'; t.textContent = ln.t;
    row.appendChild(n); row.appendChild(e); row.appendChild(t);
    box.appendChild(row);
  });
  st.appendChild(box);
}
/* เกมจำรายการของ: หน้าแรกโชว์ของที่ต้องซื้อ กดปุ่ม (หรือหมดเวลา) แล้วค่อยไปหน้าหยิบของ */
let qMemShown = {};
function renderMemoryList(st, it){
  const line = document.createElement('div'); line.className = 'hqz-line';
  line.textContent = 'คุณแม่สั่งของ ' + it.list.length + ' อย่าง จำให้ได้นะ';
  const row = document.createElement('div'); row.className = 'hqz-tray hqz-memlist';
  it.list.forEach(x=>{
    const b = document.createElement('div'); b.className = 'hqz-tile hqz-tile-lab';
    b.innerHTML = '<span class="hqz-tile-em"></span><span class="hqz-tile-tx"></span>';
    b.querySelector('.hqz-tile-em').textContent = x.e;
    b.querySelector('.hqz-tile-tx').textContent = x.label;
    row.appendChild(b);
  });
  const btn = qzBtn('จำได้แล้ว! 👍', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    go();
  });
  const brow = document.createElement('div'); brow.className = 'hqz-row'; brow.appendChild(btn);
  st.appendChild(line); st.appendChild(row); st.appendChild(brow);
  let done = false, cancel = null;
  function go(){
    if(done) return;
    done = true;
    if(cancel) cancel();
    qMemShown[qRun.idx] = 1;
    renderQuestStep();
  }
  /* หมดเวลาแล้วไปต่อเอง — เด็กที่ยังอ่านปุ่มไม่ออกก็ไม่ค้างอยู่หน้านี้
     ⏳ โชว์เลขนับถอยหลังด้วย เด็กจะได้รู้ว่าเหลือเวลาจำอีกกี่วินาที (ผู้ใช้สั่ง 2026-08-16) */
  cancel = attachCountdown(st, it.showFor || 4000, go);
}
let qSortSel = '';          /* ชิ้นที่กำลังเลือกอยู่ด้วยการแตะ (key) */
let qSortPut = null;        /* {tileKey: binId} ของกระดานนี้ */
let qDrag = null;           /* สถานะการลากที่ทำอยู่ */
function renderSortStep(st, it){
  qSortSel = ''; qSortPut = {}; qDrag = null;
  const q = document.createElement('div'); q.className = 'hqz-q'; q.textContent = it.q;
  st.appendChild(q);

  const wrap = document.createElement('div'); wrap.className = 'hqz-sort';
  const tray = document.createElement('div'); tray.className = 'hqz-tray';
  const bins = document.createElement('div');
  bins.className = 'hqz-bins'
    + (it.layout === 'slots' ? ' hqz-slots' : '')
    + (it.basket ? ' hqz-basket' : '')
    + (!it.layout && !it.basket && it.bins.length >= 4 ? ' hqz-bins4' : '');
  const tiles = {};
  /* ยอดรวมในตะกร้า (เกมใช้เงินให้พอ) — ต้องเห็นสดๆ ระหว่างเลือก ไม่ใช่รู้ตอนตรวจ */
  const totalEl = document.createElement('div');
  totalEl.className = 'hqz-total';
  totalEl.hidden = !(it.budget != null);
  function paintTotal(){
    if(it.budget == null) return;
    const inb = it.tiles.filter(t => qSortPut[t.k] === 'basket');
    const sum = inb.reduce((a, t) => a + t.price, 0);
    totalEl.innerHTML = '';
    totalEl.appendChild(document.createTextNode('ในตะกร้า ' + inb.length + '/' + it.need
                                                + ' อย่าง · รวม '));
    const ic = document.createElement('i'); ic.className = 'hs-coin';
    totalEl.appendChild(ic);
    totalEl.appendChild(document.createTextNode(sum + ' / ' + it.budget));
    totalEl.classList.toggle('over', sum > it.budget);
  }

  /* ปล่อยของลงที่ตรงพิกัดนี้ — คืน true ถ้าลงถังสำเร็จ */
  function dropAt(b, cx, cy){
    const under = document.elementFromPoint(cx, cy);
    const bin = under && under.closest ? under.closest('.hqz-bin') : null;
    if(bin && bin.dataset.bin){
      qSortPut[b.dataset.k] = bin.dataset.bin;
      b.classList.add('in');
      bin.querySelector('.hqz-bin-slot').appendChild(b);
      paintTotal();
      return true;
    }
    delete qSortPut[b.dataset.k];      /* ปล่อยนอกถัง = กลับลงถาด (เอาของออกจากถังก็ทางนี้) */
    b.classList.remove('in');
    tray.appendChild(b);
    paintTotal();
    return false;
  }
  function clearOver(){
    Array.from(bins.querySelectorAll('.hqz-bin.over')).forEach(e=>e.classList.remove('over'));
  }
  /* 🎩 หมวกวาดเป็น SVG ตามสีที่โจทย์สั่ง — **ห้ามใช้อิโมจิ** (ผู้ใช้สั่ง 2026-08-16)
     อิโมจิหมวกมีสีตายตัว (🧢 ฟ้าเสมอ · ⛑️ ขาว-แดงเสมอ) ⇒ สั่ง "หมวกแดง" แล้วโชว์หมวกฟ้า
     เด็กเลือกถูกไม่ได้เลย · เป็นกับดักเดียวกับที่โปรเจคเจอมาแล้วกับเหรียญ/ป้ายลอย
     ⚠ เพิ่มสีใหม่ในคลัง DRESS_ITEMS ต้องมาเติมที่ตารางนี้ด้วย ไม่งั้นตกมาที่สีเทา */
  const DRESS_COLORS = {
    'แดง':'#E4574A', 'เหลือง':'#F3C53F', 'ดำ':'#4A4A4A', 'ทอง':'#E8B33C',
    'ส้ม':'#EF8B2C', 'เขียว':'#5AA84F', 'ฟ้า':'#5BB8E8', 'ชมพู':'#F49AC1',
    'ขาว':'#FFFFFF', 'น้ำเงิน':'#3F6FD8', 'ม่วง':'#A47BD4', 'น้ำตาล':'#A9784A', 'ใส':'#DDEAF2',
  };
  function hatIcon(colorName){
    const col = DRESS_COLORS[colorName] || '#B9B9B9';
    const el = document.createElement('span');
    el.className = 'hqz-hat';
    /* ทรงแก๊ป: โดม + ปีกหน้า — เงารวมอ่านออกว่าเป็นหมวกแม้ย่อเหลือ 30px */
    el.innerHTML = '<svg viewBox="0 0 48 40" aria-hidden="true">'
      + '<path d="M6 30 Q6 10 24 10 Q42 10 42 30 Z" fill="' + col + '" stroke="rgba(0,0,0,.34)" stroke-width="2.4" stroke-linejoin="round"/>'
      + '<path d="M4 30 Q24 26 44 30 Q44 34 40 34 L8 34 Q4 34 4 30 Z" fill="' + col + '" stroke="rgba(0,0,0,.34)" stroke-width="2.4" stroke-linejoin="round"/>'
      + '<path d="M24 10 Q30 16 30 30" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>'
      + '</svg>';
    return el;
  }
  function tile(t){
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hqz-tile'; b.dataset.k = t.k;
    if(t.hat){
      /* หมวก — วาดรูปตามสีที่สั่ง แล้วมีชื่อกำกับใต้ภาพเหมือนของชิ้นอื่น */
      b.classList.add('hqz-tile-lab');
      b.appendChild(hatIcon(t.hat));
      const tx = document.createElement('span'); tx.className = 'hqz-tile-tx';
      tx.textContent = t.label;
      b.appendChild(tx);
    }else if(t.coin != null){
      /* เฟส 7: ชิ้นที่เป็น "เหรียญ" (เกมจ่ายเงินให้พอดี) — วาดด้วยรูปเหรียญของเกม + ตัวเลข
         ⚠ ห้ามใช้อิโมจิ 🪙 (บางเครื่องไม่มี glyph) กติกาเดียวกับราคาสินค้าในร้าน */
      b.classList.add('hqz-tile-coin');
      b.appendChild(coinFace(t.coin));
    }else if(t.label || t.price != null){
      /* ของที่มีชื่อ/ราคากำกับ (เรียงขั้นตอน · อาหารสัตว์ · ซื้อของ) — เด็กต้องอ่านได้ว่าคืออะไร */
      b.classList.add('hqz-tile-lab');
      const em = document.createElement('span'); em.className = 'hqz-tile-em'; em.textContent = t.e;
      const tx = document.createElement('span'); tx.className = 'hqz-tile-tx';
      tx.textContent = t.label;
      b.appendChild(em); b.appendChild(tx);
      if(t.price != null){
        /* ราคาโชว์เป็น "เหรียญ" ชุดเดียวกับทั้งเกม — ห้ามใช้ ฿ หรือ emoji 🪙
           (เด็ก 5 ขวบยังอ่านสัญลักษณ์เงินไม่ออก · 🪙 บางเครื่องไม่มี glyph) */
        const pr = document.createElement('span'); pr.className = 'hqz-tile-pr';
        const ic = document.createElement('i'); ic.className = 'hs-coin';
        pr.appendChild(ic);
        pr.appendChild(document.createTextNode(String(t.price)));
        b.appendChild(pr);
      }
    }else{
      b.textContent = t.e;
    }
    b.addEventListener('pointerdown', e=>{
      if(qLock) return;
      e.preventDefault();
      qDrag = {b, id:e.pointerId, x0:e.clientX, y0:e.clientY, on:false};
    });
    return b;
  }
  it.tiles.forEach(t=>{ const b = tile(t); tiles[t.k] = b; tray.appendChild(b); });

  it.bins.forEach(bn=>{
    const box = document.createElement('div'); box.className = 'hqz-bin'; box.dataset.bin = bn.id;
    box.dataset.hpClick = '1';        /* โหมดมือ: ถังไม่ใช่ <button> ต้องติดธงให้จีบนิ้วคลิกโดน */
    const head = document.createElement('div'); head.className = 'hqz-bin-head';
    const ic = document.createElement('span'); ic.className = 'hqz-bin-ic'; ic.textContent = bn.emoji;
    const nm = document.createElement('span'); nm.className = 'hqz-bin-name'; nm.textContent = bn.name;
    head.appendChild(ic); head.appendChild(nm);
    const slot = document.createElement('div'); slot.className = 'hqz-bin-slot';
    box.appendChild(head); box.appendChild(slot);
    /* ทางสำรอง: แตะเลือกของไว้แล้วมาแตะถัง */
    box.addEventListener('click', ()=>{
      if(qLock || !qSortSel) return;
      const b = tiles[qSortSel];
      if(!b) return;
      qSortPut[qSortSel] = bn.id;
      b.classList.remove('sel'); b.classList.add('in');
      slot.appendChild(b);
      qSortSel = '';
      paintTotal();
      if(typeof playClick==='function') playClick();
      afterPlace();
    });
    bins.appendChild(box);
  });
  wrap.appendChild(tray); wrap.appendChild(bins);
  if(it.budget != null) wrap.appendChild(totalEl);
  st.appendChild(wrap);
  paintTotal();
  /* ⚠ เกมตะกร้า (ซื้อของ/จำของ) **ไม่ได้ใช้ของทุกชิ้น** ⇒ ไม่มีจังหวะ "ถาดว่าง" ให้ตรวจอัตโนมัติ
     ต้องมีปุ่มยืนยันของตัวเอง (เกมจัดของ/เรียงลำดับยังตรวจให้เองเหมือนเดิม ไม่ต้องกดอะไร) */
  if(it.basket){
    const row = document.createElement('div'); row.className = 'hqz-row';
    row.appendChild(qzBtn('เสร็จแล้ว! 🧺', 'hqz-yes', ()=>{
      if(qLock) return;
      if(typeof playClick==='function') playClick();
      checkSortBoard(it, tray, tiles);
    }));
    st.appendChild(row);
  }

  function afterPlace(){
    if(it.basket) return;                       /* เกมตะกร้ารอให้เด็กกดปุ่มเอง */
    if(!tray.querySelector('.hqz-tile')) checkSortBoard(it, tray, tiles);
  }
  /* ---- ตัวลากจริง: ฟังที่ window เพราะตัวที่ลากถูกถอดออกจากผังชั่วคราว ---- */
  function onMove(e){
    if(!qDrag || e.pointerId !== qDrag.id) return;
    const b = qDrag.b;
    if(!qDrag.on){
      if(Math.hypot(e.clientX - qDrag.x0, e.clientY - qDrag.y0) < 6) return;   /* ยังไม่ถือว่าลาก */
      qDrag.on = true;
      const r = b.getBoundingClientRect();
      qDrag.w = r.width; qDrag.h = r.height;
      qSortSel = ''; b.classList.remove('sel');
      b.classList.add('drag');
      b.style.width = r.width + 'px'; b.style.height = r.height + 'px';
      document.body.appendChild(b);
    }
    b.style.left = (e.clientX - qDrag.w / 2) + 'px';
    b.style.top  = (e.clientY - qDrag.h / 2) + 'px';
    clearOver();
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const bin = under && under.closest ? under.closest('.hqz-bin') : null;
    if(bin) bin.classList.add('over');
  }
  function onUp(e){
    if(!qDrag || e.pointerId !== qDrag.id) return;
    const d = qDrag; qDrag = null;
    const b = d.b;
    clearOver();
    if(!d.on){                                  /* ขยับไม่ถึง 6px = แตะ (ทางสำรอง) */
      if(typeof playClick==='function') playClick();
      if(qSortPut[b.dataset.k]){                /* ของที่อยู่ในถัง → แตะแล้วเอากลับถาด */
        delete qSortPut[b.dataset.k];
        b.classList.remove('in'); tray.appendChild(b);
        paintTotal();
        return;
      }
      const on = qSortSel === b.dataset.k;
      Array.from(wrap.querySelectorAll('.hqz-tile.sel')).forEach(x=>x.classList.remove('sel'));
      qSortSel = on ? '' : b.dataset.k;
      if(!on) b.classList.add('sel');
      return;
    }
    b.classList.remove('drag');
    b.style.left = b.style.top = b.style.width = b.style.height = '';
    const ok = dropAt(b, e.clientX, e.clientY);
    if(typeof playClick==='function') playClick();
    if(ok) afterPlace();
  }
  /* ผูก listener ใหม่ทุกกระดาน แล้วเก็บตัวถอดไว้ที่ตัว wrapper — กระดานถัดไปวาดทับได้เลยไม่ค้าง */
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  qSortOff = ()=>{
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  };
}
let qSortOff = null;
/* วางครบแล้ว → ตรวจ · ผิดเฉพาะชิ้นที่ผิดเด้งกลับถาด ชิ้นที่ถูกอยู่ในถังต่อไป (ไม่ต้องเริ่มใหม่หมด) */
/* ส่งคำตอบของกลไกที่ไม่ใช่ "4 ตัวเลือก" และไม่ใช่ "ลากลงถัง" (เฟส 9: เล่นตามทำนอง)
   ⚠ ใช้ทางเดียวกับ checkSortBoard เป๊ะ (ล็อกกันกดซ้ำ → submit → เสียงถูก/ผิด → ข้อถัดไป)
     เพิ่มกลไกใหม่ที่ส่งคำตอบเป็นก้อนเดียวให้เรียกตัวนี้ ไม่ต้องเขียนทางส่งใหม่อีก */
function submitQuestPayload(payload){
  if(!qRun || qLock) return;
  qLock = true;
  const r = QUESTS.submit(qRun, payload);
  if(!r.ok){
    if(typeof playWrong==='function') playWrong();
    setTimeout(()=>{ qLock = false; renderQuestStep(); }, 620);
    return;
  }
  if(typeof playCorrect==='function') playCorrect();
  setTimeout(()=>{
    qLock = false;
    if(r.done) finishQuest(); else renderQuestStep();
  }, 620);
}
function checkSortBoard(it, tray, tiles){
  if(!qRun || qLock) return;
  qLock = true;
  const r = QUESTS.submit(qRun, qSortPut);
  if(!r.ok){
    if(typeof playWrong==='function') playWrong();
    (r.bad || []).forEach(k=>{
      const b = tiles[k]; if(!b) return;
      delete qSortPut[k];
      b.classList.remove('in'); b.classList.add('bad');
      tray.appendChild(b);
      setTimeout(()=>b.classList.remove('bad'), 640);
    });
    setTimeout(()=>{ qLock = false; }, 660);
    return;
  }
  if(typeof playCorrect==='function') playCorrect();
  Object.keys(tiles).forEach(k=>{ if(tiles[k]) tiles[k].classList.add('right'); });
  setTimeout(()=>{
    qLock = false;
    if(qSortOff){ qSortOff(); qSortOff = null; }
    if(r.done) finishQuest(); else renderQuestStep();
  }, 620);
}
function answerQuest(i, btn){
  if(!qRun || qLock) return;
  const r = QUESTS.answer(qRun, i);
  if(!r.ok){
    /* ตอบผิด = ไม่มีคำว่าแพ้ แค่สั่นแล้วลองใหม่ได้ไม่จำกัด (กติกาเหล็กข้อ 2) */
    btn.classList.add('wrong');
    if(typeof playWrong==='function') playWrong();
    setTimeout(()=>btn.classList.remove('wrong'), 620);
    return;
  }
  qLock = true;
  btn.classList.add('right');
  if(typeof playCorrect==='function') playCorrect();
  setTimeout(()=>{
    qLock = false;
    if(r.done) finishQuest();
    else renderQuestStep();
  }, 480);
}
/* รอบทดสอบจากหน้าคลังคำถาม — ใช้เส้นทางวาด/ตอบเดียวกับของจริงทุกอย่าง
   ต่างกันแค่ตอนจบ: **ไม่จ่ายเหรียญ ไม่เรียก QUESTS.finish() ไม่แตะ state** (จะได้เทสกี่รอบก็ได้) */
function finishTestQuest(run){
  qRun = null;
  const stars = QUESTS.starsOf(run);
  qzHead(run.spec, 'จบชุดทดสอบแล้ว');
  const dots = $('hqz-dots'); if(dots) dots.innerHTML = '';
  const st = qzStage(); if(!st) return;
  const sEl = document.createElement('div');
  sEl.className = 'hqz-stars';
  sEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  const gain = document.createElement('div');
  gain.className = 'hqz-gain';
  gain.textContent = run.items.length + ' ข้อ · ตอบผิด ' + run.wrong + ' ข้อ';
  const tag = document.createElement('div');
  tag.className = 'hqz-chal';
  tag.textContent = '🧪 โหมดทดสอบ — ไม่ได้เงิน ไม่นับเป็นเควสต์ของวันนี้';
  st.appendChild(sEl); st.appendChild(gain); st.appendChild(tag);
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn('สุ่มใหม่ 🔁', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    playTestRun(run.opt);                       /* ไม่ส่ง onClose → ตัวเดิมยังอยู่ กลับไปตารางได้เหมือนเดิม */
  }));
  row.appendChild(qzBtn('กลับไปที่ตาราง', 'hqz-no', ()=>{
    if(typeof playClick==='function') playClick();
    closeQuestPanel();
  }));
  st.appendChild(row);
  if(typeof playCongrats==='function') playCongrats();
}
/* เปิดรอบทดสอบ — onClose ปล่อยว่างไว้ = คงตัวเดิม (ใช้ตอนกด "สุ่มใหม่") */
function playTestRun(opt, onClose){
  if(!QUESTS) return;
  if(onClose !== undefined) qzOnClose = onClose;
  qRun = QUESTS.testRun(opt);
  qLock = false; qMemShown = {}; qFlashDone = {};
  qzShow();
  renderQuestStep();
}
function finishQuest(){
  if(!qRun) return;
  if(qRun.spec && qRun.spec.test){ finishTestQuest(qRun); return; }
  const run = qRun, res = QUESTS.finish(run);
  qRun = null;
  /* 👋 เฟส 18: จดลงความจำของเพื่อนบ้าน — **นับตอนงานจบจริงเท่านั้น** ไม่ใช่ตอนรับงาน */
  const nb = (NEIGH && run.spec && run.spec.npc)
    ? NEIGH.onQuestDone(run.spec.npc, run.spec.mech) : null;
  /* 💸 คืนเงินที่จ่ายไปเพื่อทำเควสต์นี้ (ถ้ามี) — ทบกับค่าตอบแทนปกติ ไม่ใช่แทนที่ */
  const back = run.spent | 0;
  awardCoins(res.coins + back);
  if(back > 0 && typeof showToast === 'function')
    showToast('💰', 'ได้ค่าตอบแทน ' + res.coins + ' บาท + คืนค่าของที่ซื้อ ' + back + ' บาท');
  /* ติดค้าง "ทำงานแทนค่ารักษา" อยู่ → งานนี้ถือว่าใช้หนี้ครบ น้องหายป่วยทันที (ข้อ 18.4) */
  const cured = PETCARE ? PETCARE.questDone() : false;
  refreshNpcMarks();
  refreshParentMark();          /* เควสต์ครอบครัวจบ → ป้ายเหนือหัวพ่อ/แม่เปลี่ยนเป็น ✓ */
  questBarKey = '';             /* บังคับให้แถบสรุปวาดตัวเลขใหม่ */
  renderQuestSummary();
  refreshQuestMark();
  qzHead(run.spec, 'เก่งมาก!');
  const dots = $('hqz-dots'); if(dots) dots.innerHTML = '';
  const st = qzStage(); if(!st) return;
  const stars = document.createElement('div');
  stars.className = 'hqz-stars';
  stars.textContent = '⭐'.repeat(res.stars) + '☆'.repeat(3 - res.stars);
  const gain = document.createElement('div');
  gain.className = 'hqz-gain';
  gain.textContent = '+ ' + res.coins + ' บาท';
  st.appendChild(stars); st.appendChild(gain);
  /* 🔁 รอบเล่นซ้ำ — บอกให้ชัดว่าทำไมได้เงินเท่านี้ ไม่งั้นเด็กนึกว่าระบบลืมจ่าย
     🔒 โทนต้องไม่ดุ: ทำได้ไม่ดีกว่าเดิมก็ยังชม และดาวเดิมไม่หายไปไหน */
  if(res.redo){
    const tag = document.createElement('div'); tag.className = 'hqz-chal';
    tag.textContent = res.better
      ? '🔁 เล่นซ้ำ · เก่งขึ้นจาก ' + res.prevStars + ' ดาว เป็น ' + res.stars + ' ดาว! ได้เงินส่วนต่างเพิ่มเลย'
      : '🔁 เล่นซ้ำ · รอบนี้ยังไม่มากกว่าเดิม (' + res.prevStars + ' ดาว) เลยยังไม่มีเงินเพิ่ม — ดาวเดิมยังอยู่ครบนะ';
    st.appendChild(tag);
  }
  if(res.chal){
    const tag = document.createElement('div'); tag.className = 'hqz-chal';
    tag.textContent = '🌟 โจทย์ท้าทาย ได้เงินเพิ่มพิเศษ';
    st.appendChild(tag);
  }
  if(cured){
    const tag = document.createElement('div'); tag.className = 'hqz-chal';
    const nm = ((loadHouseData() || {}).pet || {}).name || 'เพื่อนตัวน้อย';
    tag.textContent = '🩺 ขอบคุณที่ช่วยงานนะ ' + nm + ' หายป่วยแล้ว!';
    st.appendChild(tag);
    curedCelebrate(nm);
  }
  /* 👋 เฟส 18: สนิทขึ้นขั้น = บอกให้เด็กรู้ (เป็นคำชมล้วน **ไม่มีของรางวัล ไม่มีการล็อกอะไร**
     ความสนิทเปลี่ยนแค่คำทักของคนนั้น เด็กที่ไม่สนใจก็ไม่เสียอะไรเลย) */
  if(nb && nb.levelUp){
    const tag = document.createElement('div'); tag.className = 'hqz-chal';
    const who = (NPC_DEFS.find(x => x.id === run.spec.npc) || {}).name || 'เพื่อนบ้าน';
    tag.textContent = nb.level >= 3 ? '💛 ' + who + 'นับหนูเป็นเพื่อนคนสำคัญแล้ว!'
                    : nb.level === 2 ? '🌼 ' + who + 'เริ่มสนิทกับหนูแล้วนะ'
                                     : '😊 ' + who + 'จำหนูได้แล้ว!';
    st.appendChild(tag);
  }
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn('เยี่ยม!', 'hqz-yes', ()=>{ if(typeof playClick==='function') playClick(); closeQuestPanel(); }));
  st.appendChild(row);
  if(typeof playCongrats==='function') playCongrats();
  charBubble('🪙');
  for(let i=0; i<12; i++)
    spawnParticle(charGroup.position.x + (Math.random()-.5)*1.6, 1.6 + Math.random()*1.6,
                  charGroup.position.z + (Math.random()-.5)*1.2,
                  [0xffd54f, 0xff8fb3, 0x7fc4e8, 0xfff1a8][i%4]);
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
  /* 📔 เฟส 16: จดลงสมุดสะสม (ชนิดใหม่จะขึ้น toast ให้เอง) */
  if(window.HouseBook) window.HouseBook.mark('critter', c.type);
  if(typeof playClick==='function') playClick();
  c.startle = .5;                       /* กระโดดตกใจสั้นๆ ก่อนวิ่ง/บิน/ว่ายหนี */
  if(c.type==='fish') c.jump = {k:0};   /* ปลาตกใจ = กระโดดพ้นน้ำ */
  c.state = 'exit';
  critterExitMove(c, true);
}

/* ---------- สัตว์ในคอกฟาร์ม (เดินไปมาในคอกของตัวเอง) ----------
   merge geometry ตัวละ 1 ก้อน (ตัวละ 1 draw call) แล้วขยับทั้งกลุ่ม → ยังลื่นเหมือนของตายตัว */
let penAnimals = [];
/* ชนิดสัตว์ฟาร์มที่จดลงสมุดสะสมได้ (เฟส 16) — ต้องตรงกับ CRITTERS ใน js/house-book.js */
const FARM_BOOK_KINDS = {cow:1, sheep:1, pig:1, chick:1};
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
    /* ⚠ ตั้ง userData **หลัง** merge เสมอ — ตั้งก่อนแล้ว mergeDecorGroup จะยกเลิกการรวมทั้งก้อน
       (บั๊กเดิมของผมชาวบ้านเมื่อ 2026-08-09 ทำให้ NPC ทุกคนไม่เคยถูก merge เลย) */
    g.children.forEach(m=>{
      m.userData.hStatic = true;                               /* แตะโดนแล้วนับเป็นฉาก ไม่ใช่ของวาง */
      /* 📔 เฟส 16: สัตว์ในคอกฟาร์มจดลงสมุดสะสมได้ — **เฉพาะ 4 ชนิดของฟาร์มจริง**
         (สัตว์ในคอกร้านสัตว์เลี้ยงใช้ฟังก์ชันเดียวกันนี้ และ kind ของมันชนกับ 'cat' ของสัตว์ป่า) */
      if(FARM_BOOK_KINDS[kind]) m.userData.hFarm = kind;
    });
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
           && !inHomeZone(x, z)                                /* ห้ามเข้าบริเวณบ้านเด็ก (ดู npcNoHome) */
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
  buildNpcMarks();
}
/* ดาวเหนือกระดาน: โชว์เมื่อกระดานยังมีงานค้างวันนี้ (เฟส 2 = กระดาน 5 ชุด/วัน) */
function refreshQuestMark(){
  if(!questMarkObj) return;
  questMarkObj.visible = !!QUESTS && (QUESTS.boardLeft() > 0 || QUESTS.boardBonusReady());
}

/* ---------- ป้าย "!" / "✓" ลอยเหนือหัว NPC ที่มีงานวันนี้ (ข้อ 10 ของแผนแม่บท) ----------
   วันหนึ่งมีแค่ ~8 คนที่มีงาน (ข้อ 7) เด็กจึงต้องเดินสำรวจว่าวันนี้ใครติดป้าย
   ทำเป็นแผ่นภาพวาดจาก canvas เอง (ไม่ยัดเข้า SIGN_ICONS atlas ที่เต็มพอดี 5×5 อยู่แล้ว)
   วัสดุใช้ร่วมกันทุกป้าย → เพิ่มแค่ draw call ละใบ ไม่กระทบเฟรมเรต */
const npcMarkMats = {};
function npcMarkMat(kind){
  if(npcMarkMats[kind]) return npcMarkMats[kind];
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const c = cv.getContext('2d');
  const gold = kind === 'done' ? '#8fd18f' : '#ffc73a';
  const edge = kind === 'done' ? '#4f9e5a' : '#e09400';
  c.beginPath(); c.arc(64, 64, 52, 0, Math.PI*2);
  c.fillStyle = gold; c.fill();
  c.lineWidth = 9; c.strokeStyle = edge; c.stroke();
  c.strokeStyle = '#fffdf5'; c.lineCap = 'round'; c.lineJoin = 'round';
  if(kind === 'done'){
    c.lineWidth = 14;
    c.beginPath(); c.moveTo(40, 66); c.lineTo(57, 84); c.lineTo(90, 44); c.stroke();
  }else{
    c.lineWidth = 16;
    c.beginPath(); c.moveTo(64, 34); c.lineTo(64, 74); c.stroke();
    c.beginPath(); c.arc(64, 94, 8.5, 0, Math.PI*2); c.fillStyle = '#fffdf5'; c.fill();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearFilter;
  npcMarkMats[kind] = new THREE.MeshBasicMaterial({map:tex, transparent:true, alphaTest:.25, depthWrite:false});
  return npcMarkMats[kind];
}
let npcMarks = [];                     /* [{n, open, done}] — ป้าย 2 ใบต่อคน สลับโชว์ตามสถานะ */
const NPC_MARK_GEO = { g:null };
function buildNpcMarks(){
  npcMarks.forEach(m=>{ worldGroup.remove(m.open); worldGroup.remove(m.done); });
  npcMarks = [];
  if(!QUESTS) return;
  if(!NPC_MARK_GEO.g) NPC_MARK_GEO.g = new THREE.PlaneGeometry(.74, .74);
  QUESTS.state().npcIds.forEach(id=>{
    const n = npcs.find(k => k.def.id === id);
    if(!n) return;
    const open = new THREE.Mesh(NPC_MARK_GEO.g, npcMarkMat('open'));
    const done = new THREE.Mesh(NPC_MARK_GEO.g, npcMarkMat('done'));
    open.renderOrder = done.renderOrder = 5;
    worldGroup.add(open); worldGroup.add(done);
    npcMarks.push({n, open, done, ph: Math.random()*6.28});
  });
  refreshNpcMarks();
}
/* เรียกทุกครั้งที่สถานะเควสต์เปลี่ยน (ทำเสร็จ/ขึ้นวันใหม่) */
function refreshNpcMarks(){
  if(!QUESTS) return;
  npcMarks.forEach(m=>{
    const st = QUESTS.npcStatus(m.n.def.id);
    m.open.visible = st === 'open';
    m.done.visible = st === 'done';
  });
}
/* ป้ายลอยเหนือหัวเจ้าของ หันเข้าหากล้องเสมอ + เด้งขึ้นลงเบาๆ ให้สะดุดตาจากไกล */
function updateNpcMarks(t){
  if(!npcMarks.length) return;
  const show = hScene === 'out' && !editMode;
  for(let i=0; i<npcMarks.length; i++){
    const m = npcMarks[i], g = m.n.g;
    const y = 2.9 + Math.sin(t*.003 + m.ph)*.1;   /* สูงพ้นหัว/หลังคารถเข็น มองเห็นจากอีกฝั่งถนน */
    m.open.position.set(g.position.x, y, g.position.z);
    m.done.position.set(g.position.x, y, g.position.z);
    m.open.rotation.copy(camera.rotation);
    m.done.rotation.copy(camera.rotation);
    if(!show){ m.open.visible = false; m.done.visible = false; }
  }
  if(show) refreshNpcMarks();
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
  if(inHomeZone(gx, gz)) return false;                       /* ห้ามถูกดันเข้าไปในบริเวณบ้านเด็ก */
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
/* ⚠ **ชาวบ้านห้ามเดินเข้าบริเวณบ้านเด็ก** (คำขอผู้ใช้ 2026-08-09) — บ้านของเด็กเป็นพื้นที่ส่วนตัว
   กันไว้ 4 จุดให้ครบ ไม่งั้นยังหลุดเข้าไปได้ทางใดทางหนึ่ง: กรอบเดินเล่น (n.tiles) · ปลายทาง (npcWalkTile)
   · เส้นทางที่เดินผ่าน (findPath avoid) · การถูกดันตอนเบียดกัน (npcNudge)
   เช็คจาก inHomeZone อย่างเดียว จึงเลื่อนตามกรอบบ้านเองอัตโนมัติถ้าวันหลังย่อ/ขยายกรอบอีก */
const npcNoHome = (x, z) => inHomeZone(x, z);
function npcWalkTile(x, z, r){
  const ok = (px, pz) => isWalk(outGrid, OUT_W, OUT_D, px, pz) && !inHomeZone(px, pz);
  if(ok(x, z)) return {x, z};
  const R = r || 3;
  for(let d=1; d<=R; d++)
    for(let dz=-d; dz<=d; dz++) for(let dx=-d; dx<=d; dx++){
      if(Math.max(Math.abs(dx), Math.abs(dz)) !== d) continue;
      if(ok(x+dx, z+dz)) return {x: x+dx, z: z+dz};
    }
  return null;
}
function updateNpcs(dt, t){
  for(let i=0;i<npcs.length;i++){
    const n = npcs[i], g = n.g;
    g.rotation.z = Math.sin(t*.0016 + n.ph) * .022;            /* ยืนโยกตัวเบาๆ ให้ดูมีชีวิต */
    /* คนที่กำลังยื่นงาน/คุมงานให้เด็กอยู่ → ตรึงไว้ให้ยืนหันหน้าหาเด็กตลอดรอบเล่น ไม่เดินหนี */
    /* ⚠ ลุงตกปลา **ห้ามหันหน้ามาหาเด็ก** — เบ็ดเป็นส่วนหนึ่งของตัวโมเดล พอหันตัวแล้วปลายเบ็ด
       กวาดขึ้นมาอยู่บนฝั่งแทนที่จะทิ้งลงน้ำ (ผู้ใช้แจ้ง 2026-08-20)
       `talkToNpc()` กันไว้แล้วด้วย `!d.fisher` แต่จุดนี้ (ตอนถือเควสต์อยู่) ตกหล่นไป */
    if(qzNpcId && n.def.id === qzNpcId){
      n.hold = 1;
      if(!n.def.fisher) n.faceT = Math.max(n.faceT || 0, .5);
    }
    /* 🎺 เฟส 13 — วงดนตรีข้างถนน: เด็กเล่นเครื่องดนตรี → คนแถวนั้นหยุดเดินแล้วเต้นตาม
       **ไม่มีโจทย์ ไม่มีคะแนน ไม่มีจบเกม** เล่นจนพอใจแล้วเดินจากไปได้เลย (ข้อ 52.2)
       ใช้ `hold` ตัวเดิมกันไม่ให้เดินหนี แล้วบวกท่าโยกทับ ⇒ ไม่ต้องแตะระบบเดินเลย */
    if(n.dance > 0){
      n.dance -= dt;
      n.hold = Math.max(n.hold || 0, .3);
      const bob = Math.sin(t * .012 + n.ph * 3);
      g.position.y = Math.abs(bob) * .12;                      /* กระโดดเบาๆ ตามจังหวะ */
      g.rotation.z = bob * .16;                                /* โยกตัวซ้ายขวา */
      const u = g.userData;
      if(u && u.arms){                                          /* ยกมือโบกตามจังหวะ */
        u.arms[0].rotation.z = -1.1 - bob * .35;
        u.arms[1].rotation.z =  1.1 + bob * .35;
      }
      if(n.dance <= 0){                                         /* หมดเพลง — คืนท่าเดิมให้เรียบร้อย */
        g.position.y = 0;
        if(u && u.arms){ u.arms[0].rotation.z = 0; u.arms[1].rotation.z = 0; }
      }
    }
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
          n.path = (cur && dst) ? (findPath(outGrid, OUT_W, OUT_D, cur, dst, npcNoHome) || []) : [];
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
          n.path = (cur && tl) ? (findPath(outGrid, OUT_W, OUT_D, cur, tl, npcNoHome) || []) : [];
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
/* 🐾 ชนิดสัตว์เลี้ยง — **สีขนย้ายไป js/shared/char-colors.js แล้ว** (2026-08-17)
   เหตุผลเดียวกับจานสีตัวละคร: หน้า landing ต้องวาดสัตว์เลี้ยงของเด็กแต่ไฟล์นี้ lazy-load
   ⚠ ห้ามเขียนสีกลับมาไว้ที่นี่ — มีแหล่งเดียวเท่านั้น ไม่งั้นสีในเมืองกับในหน้า landing เพี้ยนกัน
   ⚠ fallback กันเคส "cache ผสมรุ่น" (index.html เก่ายังไม่มี script ตัวใหม่) — ยอมได้สีเดียว
     ดีกว่าหน้าเลือกสัตว์พังทั้งหน้าเพราะอ่าน property ของ undefined */
const PET_TYPES = [
  {id:'dog',     emoji:'🐶', label:'หมาน้อย',   def:'บราวนี่'},
  {id:'cat',     emoji:'🐱', label:'แมวเหมียว', def:'โมจิ'},
  {id:'rabbit',  emoji:'🐰', label:'กระต่าย',   def:'ปุยฝ้าย'},
  {id:'chick',   emoji:'🐥', label:'ลูกเจี๊ยบ',  def:'ไข่หวาน'},
  {id:'hamster', emoji:'🐹', label:'แฮมสเตอร์', def:'ข้าวปั้น'},
  {id:'turtle',  emoji:'🐢', label:'เต่าน้อย',   def:'เต้าหู้'},
  {id:'pig',     emoji:'🐷', label:'หมูน้อย',    def:'ชมพู่'},
  {id:'sheep',   emoji:'🐑', label:'แกะน้อย',   def:'ปุกปุย'},
  {id:'frog',    emoji:'🐸', label:'กบน้อย',    def:'อ๊บอ๊บ'},
  {id:'penguin', emoji:'🐧', label:'เพนกวิน',   def:'พิงกุ'},
  {id:'unicorn', emoji:'🦄', label:'ยูนิคอร์น',  def:'สายรุ้ง'},
  {id:'panda',   emoji:'🐼', label:'แพนด้า',    def:'ไผ่หวาน'},
].map(p => Object.assign(p, {
  colors: ((window.OWL_PET_COLORS || {})[p.id]) || [{c:0xd7a86e, n:'สีปกติ'}],
}));
const PET_SPEED = {dog:3.6, cat:3.4, rabbit:3.5, chick:3.1, hamster:3.3, turtle:2.6,
                   pig:3.2, sheep:3.0, frog:3.3, penguin:2.9, unicorn:3.7, panda:2.8};
const PET_SCALE = 1.45;   /* สัตว์เลี้ยงตัวใหญ่กว่าสัตว์ป่าในฉากชัดเจน (โมเดล base ขนาดใกล้กัน) */
const PET_IDLE_EMOJI = ['❤️','⭐','🎵','😊','🦋','💤'];
const hPet = {cfg:null, group:null, tile:null, path:[], seg:0, segT:0, segFrom:null,
              t:0, repathT:0, behT:2.5, beh:null, behK:0, happy:0, happyDur:1, spin:false,
              sitK:0, bubbleTimer:null,
              rest:null, restT:0,   /* rest = group ของบ้านสัตว์เลี้ยงที่กำลังนอนรออยู่ (null = เดินตามเด็กปกติ) */
              restLonely:false, show:null};   /* เฟส 12: งีบเพราะเหงา (เรียกออกมาไม่ได้) · ท่าที่กำลังโชว์เอง */

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
/* ---------- ปลอกคอ (เฟส 12 · ผู้ใช้สั่งเอากลับมา 2026-08-14) ----------
   ⚠ ตารางนี้กู้มาจาก commit 4b17532 ที่เคยลบปลอกคอทิ้ง — วัดจากสรีระของโมเดลแต่ละชนิดจริง
     `y` ความสูงช่วงคอ · `z` เยื้องไปทางหัว · `r` รัศมีวง · `tilt` เอียงวงให้แนบคอ (ยกด้านหลังพ้นตัว)
   ⚠ **ค่าพวกนี้อยู่ใน "พิกัดก่อนคูณ PET_SCALE"** เพราะ addPetCollar ถูกเรียกใน buildPet
     ก่อนบรรทัด g.scale.setScalar(PET_SCALE) — เอาไปใช้ที่อื่นต้องคูณเอง */
const PET_COLLAR_FIT = {
  dog:    {y:.225, z:.2,   r:.12,  tilt:.3},
  cat:    {y:.215, z:.17,  r:.11,  tilt:.28},
  rabbit: {y:.215, z:.13,  r:.11,  tilt:.28},
  /* 🐤 ตัวเป็นลูกกลม r .13 (บน y .2865) · หัวลูกกลม r .1 ที่ y .32 (ล่าง y .22)
     ⇒ คอจริงอยู่ราว y .25 · ของเดิม y=.21 คือ **กลางลำตัว** ปลอกคอเลยไปคาดอกแทนคอ
       (ผู้ใช้แจ้ง 2026-08-17) · คอลูกเจี๊ยบเป็นแนวตั้งปกติ จึงยังใช้วงนอนราบได้ */
  /* ⚠ **tilt ต้องเท่ากับความเอียงของคอจริง** (ผู้ใช้แจ้ง 2026-08-17 ว่าปลอกคอไม่เอียงตามคอ)
     คอลูกเจี๊ยบพุ่งจากกลางตัว (0,.15,0) ไปกลางหัว (0,.32,.05) ⇒ เอียงไปข้างหน้า
     atan(.05/.17) ≈ .29 rad · ของเดิม .05 = เกือบราบ วงเลยตัดขวางคอแทนที่จะตั้งฉากกับคอ
     (ค่านี้อยู่ในช่วงเดียวกับหมา .3 / แมว .28 ซึ่งคอเอียงหน้าเหมือนกัน) */
  chick:  {y:.25,  z:.045, r:.098, tilt:.29},
  hamster:{y:.13,  z:.02,  r:.14,  tilt:.38},
  /* 🐢 หัวเป็นทรงกลม r=.07 อยู่ที่ (0,.13,.24) ยื่นออกมาจากกระดองที่จบราว z=.196
     ⇒ คอคือช่องแคบๆ ระหว่าง z .17-.20 · ของเดิม z=.24 คือ **กลางหัวพอดี** ปลอกคอเลยรัดหน้า
       เหมือนผ้าปิดปาก (เห็นจากภาพจริง 2026-08-17)
     🔁 **คอเต่าเป็นแนวนอน** (หัวยื่นไปข้างหน้า ไม่ได้ตั้งอยู่บนตัว) ⇒ ต้องใช้ axis:'z'
       วงปลอกคอแบบนอนราบจะกลายเป็นแถบเฉียงพาดแก้มแทนที่จะรัดคอ (ผู้ใช้แจ้ง 2026-08-17) */
  turtle: {y:.13, z:.185, r:.072, tilt:0, axis:'z'},
  pig:    {y:.245, z:.18,  r:.14,  tilt:.3},
  /* 🐑 หัวเป็นกล่อง .15×.15×.13 อยู่ที่ (0,.30,.235) ⇒ ฐานหัวอยู่ y=.225 · หลังหัว z=.17
     ของเดิม y=.20 ต่ำกว่าฐานหัว และ z=.235 คือกลางหัว ⇒ ห่วงไปคล้องปากลอยอยู่ข้างหน้า
     🔁 เหมือนเต่า: **หัวแกะยื่นไปข้างหน้าจากพวงขนแกะ** ไม่ได้ตั้งอยู่บนตัว ⇒ axis:'z'
       ต้องกว้างกว่าเส้นทแยงหน้าตัดหัว (.106) นิดหน่อยถึงจะคล้องคอได้ไม่กินเนื้อหัว */
  /* ⚠ รัศมีต้อง **แค่พอดีหน้าตัดหัว** (กล่อง .15×.15 ขอบมน ⇒ เส้นทแยง ≈ .09)
     ใหญ่กว่านี้วงจะกลายเป็น "กรอบรูปล้อมหน้า" แทนที่จะเป็นปลอกคอ (ลองใช้ .115 แล้วเป็นแบบนั้น)
     และต้องดันไปหลังหัว (z .17 = ด้านหลังสุดของหัว) วงจะได้ซ่อนอยู่หลังหัวเหลือโผล่แค่ขอบ */
  sheep:  {y:.275, z:.172, r:.097, tilt:-.15, axis:'z'},
  frog:   {y:.12,  z:.02,  r:.15,  tilt:.25},
  penguin:{y:.27,  z:.03,  r:.12,  tilt:.18},
  unicorn:{y:.3,   z:.21,  r:.095, tilt:.3},
  /* 🐼 หัวเป็นทรงกลม r=.13 อยู่ที่ (0,.38,.10) ⇒ ฐานหัว y=.25 · ที่ y=.27 หน้าตัดหัวกว้างแค่ ~.069
     ของเดิม r=.13 = **เท่ารัศมีหัวเต็มๆ** ⇒ ห่วงกลายเป็นสายสะพายพาดอกแทนที่จะรัดคอ */
  panda:  {y:.27,  z:.10,  r:.09,  tilt:.18},
};
/* จี้/ของห้อยหน้าปลอกคอของแต่ละแบบ — วาดไว้ที่ตำแหน่ง (0,0,0) แล้วให้ addPetCollar ย้ายไปห้อยเอง
   ⚠ **ทุกแบบต้องต่างกันที่ "เงารวม" ไม่ใช่รายละเอียดเล็ก** — เห็นบนจอจริงแค่ ~20px
     (บทเรียนเดียวกับไอคอนของแต่งตัวเฟส 8 ที่วาดคล้ายกันจนแยกไม่ออก) */
function collarCharm(style, col){
  const gold = 0xffd54f;
  const gg = new THREE.Group();
  if(style === 'bone'){
    const b = box(.055,.018,.016, 0xfff6e0); gg.add(b);
    [-1,1].forEach(s=>{ [-1,1].forEach(t=>{
      const k = sphere(.014, 0xfff6e0, 6); k.position.set(.028*s, .011*t, 0); gg.add(k); }); });
  }else if(style === 'bow'){
    [-1,1].forEach(s=>{
      const w = box(.038,.032,.014, col); w.position.set(.026*s, 0, 0); w.rotation.z = .35*s; gg.add(w);
    });
    const knot = sphere(.014, petShade(col,.85), 6); gg.add(knot);
  }else if(style === 'heart'){
    /* หัวใจ = พูกลม 2 พู + ปลายแหลมล่าง · **แบนตามแนว Z** ให้เห็นเป็นหัวใจจากด้านหน้า
       (ของเดิมพูกลมไม่ได้แบน + ก้อนติดกันจนดูเป็นเม็ดกลม 2 เม็ดกับกรวย) */
    const HC = 0xf2557f, HR = .022;
    [-1,1].forEach(s=>{ const l = sphere(HR*.62, HC, 8); l.scale.set(1,1,.5);
      l.position.set(HR*.5*s, HR*.38, 0); gg.add(l); });
    const tip = new THREE.Mesh(new THREE.ConeGeometry(HR*1.12, HR*1.5, 10), toonMat(HC));
    tip.castShadow = hShadows; tip.rotation.x = Math.PI; tip.scale.set(1,1,.5);
    tip.position.y = -HR*.42; gg.add(tip);
  }else if(style === 'star'){
    const st = new THREE.Mesh(new THREE.ConeGeometry(.028,.02,5), toonMat(gold));
    st.castShadow = hShadows; st.rotation.x = -Math.PI/2; gg.add(st);
    const st2 = new THREE.Mesh(new THREE.ConeGeometry(.028,.02,5), toonMat(gold));
    st2.castShadow = hShadows; st2.rotation.x = Math.PI/2; gg.add(st2);
  }else if(style === 'bell'){
    const b = sphere(.026, gold, 8); b.scale.set(1,.9,1); gg.add(b);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(.02,.006,6,12), toonMat(petShade(gold,.8)));
    lip.castShadow = hShadows; lip.rotation.x = Math.PI/2; lip.position.y = -.016; gg.add(lip);
    const dot = sphere(.008, 0x8d6e00, 6); dot.position.y = -.026; gg.add(dot);
  }else if(style === 'flower'){
    const mid = sphere(.014, 0xffe082, 7); gg.add(mid);
    for(let i=0;i<5;i++){
      const p = sphere(.015, col, 7); p.scale.set(1,.6,1);
      p.position.set(Math.cos(i/5*Math.PI*2)*.026, 0, Math.sin(i/5*Math.PI*2)*.026);
      gg.add(p);
    }
  }else if(style === 'bandana'){
    const t = new THREE.Mesh(new THREE.ConeGeometry(.05,.075,3), toonMat(col));
    t.castShadow = hShadows; t.rotation.x = Math.PI; t.position.y = -.03; gg.add(t);
  }else{                                    /* classic — เหรียญกลมทองแบบเดิมของ commit 4b17532 */
    const tag = sphere(.021, gold, 8); gg.add(tag);
  }
  return gg;
}
/* ใส่ปลอกคอให้โมเดลน้อง · `cl` = {s:แบบ, c:index สีจาก HouseShop.COLLAR_COLORS}
   คืน mesh วงปลอกคอ (เก็บไว้ที่ u.collar เผื่ออนิเมชันกระดิ่งสั่นตอนน้องวิ่ง) */
function addPetCollar(g, type, cl){
  const o = PET_COLLAR_FIT[type] || PET_COLLAR_FIT.dog;
  const S = window.HouseShop;
  const cols = (S && S.COLLAR_COLORS) || [{c:0xe5533d}];
  const style = (cl && cl.s) || 'classic';
  const col = (cols[(cl && cl.c) | 0] || cols[0]).c;
  /* ผ้าพันคอไม่ใช่ "วงแหวน" — ใช้ทรงกรวยคว่ำครอบรอบคอแทน ไม่งั้นดูเหมือนปลอกคอธรรมดาติดผ้า */
  const band = style === 'bandana'
    ? new THREE.Mesh(new THREE.TorusGeometry(o.r, .026, 6, 16), toonMat(col))
    : new THREE.Mesh(new THREE.TorusGeometry(o.r, .017, 8, 18), toonMat(col));
  /* 🧭 **แกนของคอไม่เหมือนกันทุกตัว** (แก้ 2026-08-17)
       axis ปริยาย = 'y' — คอตั้งขึ้น หัวอยู่บนตัว (หมา/แมว/ลูกเจี๊ยบ/แพนด้า…)
         ⇒ วงปลอกคอต้อง **นอนราบ** = หมุน x ไป PI/2
       axis:'z' — คอเป็นแนวนอน หัวยื่นไปข้างหน้า (เต่า/แกะ)
         ⇒ วงปลอกคอต้อง **ตั้งหันหน้าเข้าหากล้อง** = ไม่ต้องหมุน (torus อยู่ระนาบ XY อยู่แล้ว)
     ⚠ ถ้าใช้วงนอนราบกับคอแนวนอน จะได้แถบเฉียงพาดแก้มแทนที่จะเป็นปลอกคอ — บั๊กเดิมของเต่ากับแกะ
     ⚠ จี้ต้องห้อย "ใต้วง" ตามแกนที่ใช้จริงด้วย ไม่งั้นจี้ไปโผล่กลางหน้า */
  const zAxis = o.axis === 'z';
  band.rotation.x = zAxis ? (o.tilt || 0) : Math.PI/2 + (o.tilt || 0);
  band.position.set(0, o.y, o.z || 0);
  band.castShadow = hShadows;
  g.add(band);
  const charm = collarCharm(style, col);
  if(zAxis) charm.position.set(0, o.y - o.r - .018, (o.z || 0) + .025);
  else      charm.position.set(0, o.y - Math.sin(o.tilt || 0) * o.r - .03, (o.z || 0) + o.r * .92);
  g.add(charm);
  return {band, charm, style};
}
/* ---------- ตัวเปื้อน (เฟส 12) ----------
   ไม่ได้อาบน้ำติดกัน 2 วันเล่น ⇒ รอยโคลนน้ำตาล 5 จุด + ไอเหม็นเทา 2 เส้นลอยเหนือหัว
   ⚠ **ห้ามผูกกับความป่วย/บทลงโทษใดๆ** (กติกาเหล็กข้อ 2) — ผลเดียวคือความสุขลดเร็วขึ้น
     และเป็น "คำใบ้ทางสายตา" ให้เด็กรู้ว่าถึงเวลาอาบน้ำแล้ว */
function addPetDirt(g){
  /* 🐞 ผู้ใช้แจ้ง 2026-08-22: "รอยเปื้อนเห็นไม่ชัด"
     ของเดิม: จุด r=.038 สี 0x8d6e4e — เล็กมากและเป็นสีน้ำตาลที่**ใกล้เคียงสีขนของน้องหลายตัว**
     (หมา/แฮมสเตอร์/กระต่ายสีน้ำตาล) ⇒ กลืนไปกับตัวจนแทบมองไม่เห็นบนจอแท็บเล็ต
     ⇒ แก้ 3 ทาง: จุดใหญ่ขึ้น · สีเข้มขึ้นมากให้ตัดกับขนทุกสี · เพิ่มจุดและกระจายให้ทั่วตัว
        แล้วทำ **ไอเหม็นลอยขึ้น-จางหาย** ให้ตาจับความเคลื่อนไหวได้แต่ไกล (ดู updatePetDirt) */
  const spots = [];
  const at = [[.09,.2,.08],[-.1,.15,-.05],[.04,.31,.16],[-.07,.26,.12],[.11,.12,-.12],
              [-.02,.36,-.09],[.13,.27,.02]];
  at.forEach(p=>{
    const s = sphere(.058, 0x5C3D24, 7);     /* โคลนเข้ม ตัดกับขนทุกสีในเกม */
    s.scale.set(1, .34, 1);
    s.position.set(p[0], p[1], p[2]);
    s.castShadow = false;
    g.add(s); spots.push(s);
  });
  const stink = new THREE.Group();
  /* ไอเหม็น 3 เส้น ใหญ่ขึ้นและเยื้องกันเป็นชั้น — ลอยขึ้นแล้วจางหายวนไป */
  [-1, 1, 0].forEach((k, i)=>{
    const w = new THREE.Mesh(new THREE.TorusGeometry(.055, .013, 5, 12, Math.PI),
                             new THREE.MeshToonMaterial({color:0x9DB58A, transparent:true, opacity:.9}));
    w.castShadow = false;
    w.position.set(.085 * k, .52, .04);
    w.rotation.z = .45 * k;
    w.userData.ph = i / 3;                   /* เหลื่อมเฟสกัน ไม่ลอยพร้อมกันเป็นก้อนเดียว */
    stink.add(w);
  });
  g.add(stink);
  return {spots, stink};
}
/* ไอเหม็นลอยขึ้นแล้วจางหาย — เรียกทุกเฟรมจาก frame()
   ⚠ ต้องทำงานแม้ตอนน้องกำลังเล่นของเล่นอยู่ (petAct ยึดการควบคุมตัวน้องไว้) จึงเรียกแยกต่างหาก
     ไม่ได้ฝังไว้ใน updatePet() */
let petDirtT = 0;
function updatePetDirt(dt){
  const u = hPet.group && hPet.group.userData && hPet.group.userData.anim;
  if(!u || !u.dirt || !u.dirt.stink) return;
  petDirtT += dt;
  u.dirt.stink.children.forEach(w=>{
    const p = (petDirtT * .55 + w.userData.ph) % 1;      /* 0→1 แล้ววนใหม่ */
    w.position.y = .52 + p * .34;
    w.scale.setScalar(.7 + p * .7);
    w.material.opacity = .9 * (1 - p) * (p < .12 ? p / .12 : 1);   /* โผล่นุ่มๆ แล้วจางหาย */
  });
}

/* โมเดลสัตว์เลี้ยงสไตล์เดียวกับ critter (บล็อกมน ไม่มีขา เด้งตามจังหวะ)
   — colIdx = index สีขนใน PET_TYPES[].colors
   — opt.collar {s,c} / opt.dirty — ไม่ส่งมาก็อ่านจาก PETCARE ให้เอง (พรีวิวในร้านส่งค่าเองได้) */
function buildPet(type, colIdx, opt){
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
  /* ---------- เฟส 12: ปลอกคอ + รอยเปื้อน (ต้องใส่ก่อน setScalar เพราะตารางเป็นพิกัดก่อนย่อ) ---------- */
  const o12 = opt || {};
  const cl = o12.collar !== undefined ? o12.collar
                                      : (PETCARE && PETCARE.collar ? PETCARE.collar() : null);
  if(cl) u.collar = addPetCollar(g, type, cl);
  const mucky = o12.dirty !== undefined ? o12.dirty
                                        : !!(PETCARE && PETCARE.isDirty && PETCARE.isDirty());
  if(mucky) u.dirt = addPetDirt(g);
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
  /* ป่วยอยู่ = ออกมาเล่นไม่ไหว ต้องพาไปหาหมอก่อน (ข้อ 18.4) — บอกทางทุกครั้งที่แตะ ไม่ปล่อยให้เด็กงง */
  if(PETCARE && PETCARE.isSick()){
    if(typeof playClick==='function') playClick();
    petBubble('🤒');
    charBubble('พาหนูไปหาคุณหมอที่โรงพยาบาลที 🏥', true);
    return;
  }
  /* แตะตัวที่โผล่ครึ่งตัวอยู่ในบ้านสัตว์เลี้ยง = เรียกออกมาเดินเล่นต่อ (ไม่ต้องเดินไปแตะตัวบ้าน) */
  /* แตะตัวที่นอนอยู่ในบ้านสัตว์ "เพราะเด็กสั่งให้เข้าไปเอง" = เรียกออกมาเดินเล่นต่อทันที
     แต่ถ้าเข้าไปเพราะ **เหงา** (ความสุข < 25%) เรียกไม่ออก ต้องลูบหัว/อาบน้ำให้อารมณ์ดีก่อน
     ⇒ เปิดเมนูให้เลือกแทน จะได้ไม่กลายเป็นทางตัน (กติกาเหล็กข้อ 1) */
  if(hPet.rest && !hPet.restLonely){
    if(typeof playClick==='function') playClick();
    petLeaveHouse();
    return;
  }
  questEvent('pet', null);
  openPetMenu();
}

/* ==================== เมนูฟองเลือกกิจกรรม (เฟส 12) ====================
   ปุ่มทั้งหมดกดได้เสมอ — กดตัวที่ยังไม่พร้อมจะ "บอกวิธีทำให้พร้อม" ไม่ใช่เงียบหรือดุ
   (กติกาเหล็กข้อ 1 + 2: ไม่มีทางตัน · ไม่ลงโทษเด็ก) */
let petMenuOn = false, petMenuPage = 'main';
function petMenuEls(){
  return {box:$('house-pet-menu'), grid:$('hpm-grid'), title:$('hpm-title'), note:$('hpm-note')};
}
function closePetMenu(){
  const el = $('house-pet-menu');
  if(el) el.hidden = true;
  petMenuOn = false; petMenuPage = 'main';
}
function openPetMenu(page){
  if(!hPet.group) return;
  petMenuPage = page || 'main';
  petMenuOn = true;
  if(typeof playClick==='function') playClick();
  renderPetMenu();
  updatePetLabels();
}
function hpmBtn(ic, lb, opt){
  const o = opt || {};
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'hpm-btn' + (o.off ? ' off' : '') + (o.done ? ' done' : '');
  b.setAttribute('data-hp-click', '1');       /* โหมดเล่นด้วยมือยิง pointerdown ไม่ใช่ click */
  b.innerHTML = '<span class="hpm-ic">' + ic + '</span><span class="hpm-lb">' + lb + '</span>';
  if(o.pips !== undefined){
    const p = document.createElement('span');
    p.className = 'hpm-pips';
    for(let i=0;i<o.pipMax;i++) p.innerHTML += '<i class="' + (i < o.pips ? 'on' : '') + '"></i>';
    b.appendChild(p);
  }
  b.onclick = o.run;
  return b;
}
function petMenuNote(txt){
  const n = $('hpm-note');
  if(!n) return;
  n.textContent = txt || '';
  n.hidden = !txt;
}
function renderPetMenu(){
  const e = petMenuEls();
  if(!e.box || !e.grid) return;
  e.box.hidden = false;
  e.grid.innerHTML = '';
  petMenuNote('');
  const home = petAtHome();
  const lonely = !!(hPet.rest && hPet.restLonely);
  const name = hPet.cfg ? hPet.cfg.name : 'น้อง';

  if(petMenuPage === 'trick'){
    e.title.textContent = 'สอนท่าอะไรดี?';
    const list = (PETCARE && PETCARE.TRICKS) || [];
    const need = (PETCARE && PETCARE.TRICK_NEED) || 5;
    list.forEach(tk=>{
      const pr = PETCARE ? PETCARE.trickProg(tk.id) : 0;
      const got = PETCARE ? PETCARE.trickLearned(tk.id) : false;
      e.grid.appendChild(hpmBtn(hIcon('trick-' + tk.id, tk.emoji, 26), got ? tk.name + ' ✓' : tk.name, {
        pips: Math.min(need, pr), pipMax: need, done: got,
        run: ()=>{ closePetMenu(); startPetAct('trick', tk.id); },
      }));
    });
    petMenuNote('สอนซ้ำ ' + need + ' ครั้ง แล้ว' + name + 'จะทำท่านั้นเองได้เลย ⭐');
    return;
  }
  if(petMenuPage === 'toy'){
    e.title.textContent = 'เล่นอะไรกับ' + name + 'ดี?';
    const toys = (SHOP && SHOP.ownedToys) ? SHOP.ownedToys() : [];
    toys.forEach(t=>{
      e.grid.appendChild(hpmBtn(hIcon('toy-' + t.id, t.emoji, 26), t.name, {
        /* เฟส 12.1 — แต่ละชิ้นมีท่าของตัวเอง · ลูกบอลยังใช้ท่าเดิมของเฟส 12 */
        run: ()=>{ closePetMenu(); startPetAct(t.id === 'ball' ? 'ball' : 'toy', t.id); },
      }));
    });
    petMenuNote('อยากเล่นแบบอื่นอีก? ไปดูของเล่นใหม่ๆ ที่ร้านสัตว์เลี้ยงได้เลย 🐾');
    return;
  }

  /* 🎀 หน้า "ปลอกคอ/สีปลอกคอ" ถูกย้ายออกจากเมนูฟองแล้ว (ผู้ใช้สั่ง 2026-08-19)
     ⇒ เปลี่ยนปลอกคอได้ที่ **เมนูสัตว์เลี้ยงมุมขวาบน** (ปุ่ม 🐾 `#house-pet-btn`) ที่เดียว
       ซึ่งโผล่เฉพาะตอนอยู่ในบริเวณบ้าน — หน้านั้นมีแถวปลอกคอ + แถวสีอยู่แล้ว
       (`buildPetCollarChips()`) และเห็นตัวน้องตัวใหญ่หมุนดูได้ เลือกง่ายกว่าปุ่มเล็กๆ ในฟอง
     ⚠ **ห้ามเอาปุ่มปลอกคอกลับเข้าเมนูฟอง** — ทางเปลี่ยนปลอกคอต้องมีจุดเดียว */

  e.title.textContent = 'อยากทำอะไรกับ' + name + '?';
  /* 🍽️ ให้อาหาร — ย้ายมาจากแถบสถานะ (ผู้ใช้สั่ง 2026-08-15)
     ⚠ อยู่ **ปุ่มแรก** เพราะเป็นเรื่องที่เร่งด่วนที่สุด (น้องหิว/ป่วยรอไม่ได้)
     ⚠ ป้ายบนปุ่มบอก **จำนวนมื้อที่เหลือ** ด้วย เด็กจะได้รู้ว่าต้องไปซื้อเพิ่มหรือยัง
       โดยไม่ต้องไปอ่านที่แถบสถานะอีกรอบ
     ⚠ อิ่มอยู่/ป่วยอยู่ **ยังกดได้เสมอ** — `feedNow()` เป็นคนอธิบายเหตุผลน่ารักๆ เอง
       (กติกาเหล็กข้อ 2: ห้ามกดแล้วเงียบ ห้ามดุ) */
  {
    const fid  = PETCARE ? PETCARE.foodForPet(hPet.cfg ? hPet.cfg.type : '') : '';
    const food = PETCARE ? PETCARE.FOOD.filter(x => x.id === fid)[0] : null;
    const left = (PETCARE && fid) ? PETCARE.meals(fid) : 0;
    const sick = petCareHud.sick;
    e.grid.appendChild(hpmBtn(food ? hIcon('food-' + food.id, food.emoji, 26) : hIcon('food-meat', '🍖', 26),
      sick ? 'พาไปหาหมอ' : (left > 0 ? 'ให้อาหาร ×' + left : 'อาหารหมดแล้ว'), {
      done: !sick && petCareHud.full >= 100,       /* อิ่มเต็มแล้ว = ติ๊กถูก ไม่ใช่ปิดปุ่ม */
      run: ()=>{
        closePetMenu();
        if(!sick && left <= 0){
          /* อาหารหมด **ห้ามเงียบ** ต้องบอกทางไปต่อ (ร้านสัตว์เลี้ยงมีแท็บอาหาร) */
          if(typeof showToast === 'function')
            showToast(food ? food.emoji : '🍖', 'อาหารหมดแล้ว — ไปซื้อเพิ่มที่ร้านสัตว์เลี้ยงได้เลยนะ');
          return;
        }
        feedNow();
      },
    }));
  }
  /* 🤚 ลูบหัว — ทำได้ทุกที่ ทุกเวลา แม้น้องกำลังงีบอยู่ (ผู้ใช้สั่ง 2026-08-14) */
  e.grid.appendChild(hpmBtn(hIcon('ui-pat', '🤚', 26), 'ลูบหัว', {
    run: ()=>{ closePetMenu(); startPetAct('pat'); },
  }));
  const bathed = PETCARE ? PETCARE.bathedToday() : false;
  e.grid.appendChild(hpmBtn(hIcon('ui-bath', '🫧', 26), bathed ? 'อาบแล้ว ✓' : 'อาบน้ำ', {
    off: bathed || !home, done: bathed,
    run: ()=>{
      if(bathed){ petMenuNote('วันนี้อาบน้ำให้' + name + 'แล้ว พรุ่งนี้มาอาบใหม่นะ 🫧'); return; }
      if(!home){ petMenuNote('ออกไปที่สนามหน้าบ้านกันนะ แล้วค่อยอาบน้ำให้' + name + ' 🏡'); return; }
      closePetMenu(); startPetAct('bath');
    },
  }));
  e.grid.appendChild(hpmBtn(hIcon('toy-ball', '🎾', 26), 'เล่นด้วยกัน', {
    off: !home || lonely,
    run: ()=>{
      if(lonely){ petMenuNote(name + 'ยังไม่ค่อยมีแรงเล่น ลองลูบหัวหรืออาบน้ำให้ก่อนนะ 💗'); return; }
      if(!home){ petMenuNote('ออกไปที่สนามหน้าบ้านกันนะ ที่นั่นกว้างพอให้เล่นได้ 🏡'); return; }
      const toys = (SHOP && SHOP.ownedToys) ? SHOP.ownedToys() : [];
      if(toys.length > 1){ openPetMenu('toy'); return; }
      /* มีของเล่นชิ้นเดียว = ข้ามหน้าเลือกไปเล่นเลย (ปกติคือลูกบอลแถมฟรี แต่ไม่ฮาร์ดโค้ดไว้
         เผื่อวันหลังของแถมเปลี่ยนชิ้น จะได้ไม่เล่นผิดของแบบเงียบๆ) */
      const only = toys[0] || {id:'ball'};
      closePetMenu(); startPetAct(only.id === 'ball' ? 'ball' : 'toy', only.id);
    },
  }));
  e.grid.appendChild(hpmBtn(hIcon('ui-teach', '🎪', 26), 'สอนท่า', {
    off: !home || lonely,
    run: ()=>{
      if(lonely){ petMenuNote(name + 'กำลังงีบอยู่ ลองลูบหัวหรืออาบน้ำให้ก่อนนะ 💗'); return; }
      if(!home){ petMenuNote('ออกไปที่สนามหน้าบ้านกันนะ แล้วมาฝึกท่าใหม่ๆ กัน 🏡'); return; }
      openPetMenu('trick');
    },
  }));
  if(lonely) petMenuNote(name + 'กำลังงีบอยู่ในบ้าน ลูบหัวหรืออาบน้ำให้ก่อน เดี๋ยว' + name + 'ก็ออกมาเองนะ 💗');
  else if(!home) petMenuNote('กลับไปที่สนามหน้าบ้านก่อนนะ แล้วจะเล่นกับ' + name + 'ได้ทุกอย่างเลย 🏡');
}

/* ---------- นอนรอในบ้านสัตว์เลี้ยง (แตะบ้านสัตว์เลี้ยง = สลับเข้า/ออก) ---------- */
const PET_REST_IN  = ['ไปนอนรอในบ้านนะ', 'เข้าไปพักก่อนนะ', 'นอนรอแป๊บนึงนะ'];
const PET_REST_OUT = ['ออกมาเดินเล่นกัน!', 'มาเดินเล่นด้วยกันนะ', 'ตื่นแล้ว ไปเที่ยวกัน!'];
function pickOne(a){ return a[(Math.random()*a.length)|0]; }

function togglePetRest(g){
  if(!hPet.group){ charBubble('ยังไม่มีสัตว์เลี้ยงเลย 🐾', true); return; }
  if(PETCARE && PETCARE.isSick()){
    petBubble('🤒');
    charBubble('น้องไม่สบาย พาไปหาคุณหมอที่โรงพยาบาลนะ 🏥', true);
    return;
  }
  if(hPet.rest) petLeaveHouse(); else petEnterHouse(g);
}
/* พาน้องเข้าไปนอนรอ: จอดตรงประตู (ด้านหน้าโมเดล = +z ของ group) ให้ครึ่งตัวหลังจมอยู่ในบ้าน
   ตัวบ้านเป็นกล่องทึบ ส่วนที่จมจึงถูกบังด้วย depth ของ three.js เองโดยไม่ต้องตัดโมเดล */
function petEnterHouse(g){
  hPet.rest = g; hPet.restT = 2.5; hPet.show = null;
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
  hPet.restLonely = false;                 /* ออกมาแล้วไม่ใช่ "งีบเพราะเหงา" อีกต่อไป (เฟส 12) */
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
  if(feedAnim) return;             /* กำลังเล่นอนิเมชันป้อนอาหาร — updateFeedAnim() คุมน้องอยู่ ห้ามแย่ง */
  if(petAct) return;               /* กำลังทำกิจกรรมเฟส 12 — updatePetAct() คุมอยู่ (กับดักเดียวกัน) */
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
      else {
        hPet.beh = null;
        /* เรียนท่าจบแล้ว = น้องหยิบมาโชว์เองบ้างโดยไม่ต้องสั่ง (รางวัลของการฝึกจนครบ · เฟส 12) */
        const got = (PETCARE && PETCARE.learnedTricks) ? PETCARE.learnedTricks() : [];
        if(got.length && Math.random() < .45){
          hPet.show = {id: got[(Math.random()*got.length)|0], t:0, dur:1.6, baseY: hPet.group.rotation.y};
          petBubble('✨');
        }else petBubble(PET_IDLE_EMOJI[(Math.random()*PET_IDLE_EMOJI.length)|0]);
      }
      hPet.behT = 3 + Math.random()*3.5;
    }
    if(hPet.beh==='sit'){
      hPet.behK -= dt;
      if(hPet.behK <= 0) hPet.beh = null;
    }
  }
  /* กำลังโชว์ท่าเอง = ยึดท่าทั้งตัวจนจบ (ถ้าเด็กเดินหนีระหว่างนั้นให้เลิกโชว์แล้ววิ่งตามทันที) */
  if(hPet.show){
    hPet.show.t += dt;
    const k = hPet.show.t / hPet.show.dur;
    if(k >= 1 || moving || following){
      hPet.show = null;
      hPet.group.rotation.set(0, hPet.group.rotation.y, 0);
      hPet.group.position.y = 0;
    }else{
      petTrickAnim(hPet.show.id, k, hPet.group, u, hPet.show.baseY);
      return;
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
  refreshPetBar();
  refreshQuestBar();
  refreshBackBtn();
  refreshParentBtn();
  refreshHomeBtns();
  if(!hPet.group || !houseOpen || hMode!=='world' || editMode){
    nameEl.hidden = true;
    if(petMenuOn) closePetMenu();
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
  /* แถบความอิ่มเป็น "หัวใจ" ไม่ใช่ตัวเลข — เด็ก 5 ขวบอ่านเปอร์เซ็นต์ไม่รู้เรื่อง (ข้อ 18.3)
     โชว์เฉพาะตอนเริ่มหิว (< LOW_AT) เพื่อไม่ให้รกจอตอนน้องสบายดี */
  nameEl.textContent = '🐾 ' + hPet.cfg.name + petCareHud.hearts;
  /* เมนูฟองลอยเหนือหัวน้อง — ยึดขอบจอไว้ไม่ให้ปุ่มหลุดออกนอกจอเวลาน้องอยู่ริมภาพ */
  if(petMenuOn){
    const m = $('house-pet-menu');
    if(m && !m.hidden){
      const w = m.offsetWidth || 240, h = m.offsetHeight || 90;
      const mx = Math.min(window.innerWidth - w/2 - 8, Math.max(w/2 + 8, px));
      const my = Math.min(window.innerHeight - 8, Math.max(h + 8, py - 38));
      m.style.left = mx.toFixed(1)+'px';
      m.style.top  = my.toFixed(1)+'px';
    }
  }
}
/* ---------- เฟส 3B: ความหิว · อาหาร · ป่วย · คุณหมอ (ข้อ 18.2-18.4) ---------- */
/* ⚠ PETCARE.* ทุกตัวอ่าน localStorage + JSON.parse ⇒ **ห้ามเรียกทุกเฟรม** เก็บผลไว้ที่นี่แล้ว
   ให้ลูปวาดภาพอ่านจากตัวแปรแทน (คำนวณใหม่ทุก ~1 วิ ก็ทันตาเด็กเหลือเฟือ) */
const petCareHud = {hearts:'', sick:false, full:100, happy:100, dirty:false, t:0};
let petMoanT = 0;
function updatePetCare(dt){
  if(!PETCARE || !hPet.group || hMode !== 'world' || editMode) return;
  petCareHud.t -= dt;
  if(petCareHud.t <= 0){
    petCareHud.t = 1;
    const sick = PETCARE.isSick();
    petCareHud.sick = sick;
    petCareHud.full = PETCARE.fullness();
    /* ⚠ ความสุข/ความเลอะต้องอ่านผ่านแคชวินาทีละครั้งเหมือนความอิ่ม **ห้ามให้ petBarPaint() ไปเรียก
       PETCARE.happiness() ตรงๆ ทุกเฟรม** — ตัวอ่านของ pet-care วิ่งผ่าน sync() ซึ่ง JSON.parse
       ทั้งก้อน save แล้วเขียนกลับได้ด้วย (เช่น สร้างสถานะใหม่ให้สัตว์ที่เพิ่งถูกปล่อยคืน) */
    petCareHud.happy = PETCARE.happiness();
    petCareHud.dirty = PETCARE.isDirty();
    if(sick) petCareHud.hearts = '  🤒';
    else if(petCareHud.full >= PETCARE.LOW_AT) petCareHud.hearts = '';
    else{
      const n = Math.ceil(petCareHud.full / (PETCARE.FULL_MAX / 3));   /* 3 ดวง: เต็ม/ครึ่ง/ว่าง */
      petCareHud.hearts = '  ' + '❤️'.repeat(n) + '🤍'.repeat(3 - n);
    }
  }
  /* น้องบ่นเป็นระยะตอนหิว/ป่วย — คำเตือนล่วงหน้าก่อนป่วยจริง (ห้ามให้เด็กงงว่าอยู่ๆ ก็ป่วย) */
  petMoanT -= dt;
  if(petMoanT > 0) return;
  petMoanT = 12 + Math.random()*8;
  if(petCareHud.sick) petBubble('🤒');
  else if(petCareHud.hearts) petBubble(Math.random()<.5 ? '😢' : '🍽️');
}
/* สัตว์ป่วย = นอนในบ้านสัตว์ ออกมาไม่ได้ (ข้อ 18.4) — ใช้กลไก hPet.rest เดิมแต่ล็อกไว้ ปลุกไม่ตื่น */
function petHouseGroup(){
  const list = decorGroups.out || [];
  for(let i=0; i<list.length; i++){
    const d = list[i].userData && list[i].userData.deco;
    if(d && d.rec && d.rec.id === 'pet-house') return list[i];
  }
  return null;
}
function syncPetSick(){
  if(!PETCARE || !hPet.group || hScene !== 'out' || feedAnim) return;
  if(!petCareHud.sick || hPet.rest) return;   /* สบายดี หรือนอนอยู่แล้ว */
  const g = petHouseGroup();
  if(g) petEnterHouse(g);
}
/* ---------- ให้อาหาร: กดปุ่มเดียวจบ (ผู้ใช้สั่งเอา popup ออก 2026-08-09) ----------
   เดิมเปิดการ์ดให้เลือกชนิดอาหารก่อน แต่สัตว์แต่ละตัวกินได้ชนิดเดียวอยู่แล้ว การ์ดจึงมีของใบเดียว
   = คลิกเปล่าเพิ่มมาขั้นนึงโดยไม่ได้อะไร ⇒ กดปุ่มในแถบสถานะแล้วป้อนเลย
   (บทเรียน "สัตว์ตัวไหนกินอะไร" ย้ายไปสอนที่การ์ดอาหารในร้านแทน ซึ่งเห็นครบทุกชนิดพร้อมกัน) */
function feedNow(){
  if(!PETCARE || editMode || hMode !== 'world') return;
  if(typeof playClick==='function') playClick();
  const d = loadHouseData() || {};
  if(!d.pet){ charBubble('ยังไม่มีเพื่อนตัวน้อยเลย 🐾', true); return; }
  const fid = PETCARE.foodForPet(d.pet.type);
  const f = PETCARE.FOOD.filter(x => x.id === fid)[0];
  if(!f) return;
  const r = PETCARE.feed(f.id);
  if(r && r.ok) questCaught('pet', 'feed');   /* 🐾 เควสต์ "ดูแลน้อง" นับตรงนี้ */
  if(r.ok){
    petCareHud.t = 0;               /* บังคับคำนวณใหม่เฟรมถัดไป — หลอดในแถบจะได้ขยับทันตา ไม่รอครบวินาที */
    petBarKey = '';                 /* จำนวนมื้อคงเหลือในแถบต้องอัปเดตด้วย */
    startFeedAnim(f);
    return;
  }
  /* ทุกกรณีที่ให้ไม่ได้ **ห้ามหักของ ห้ามดุ** แค่บอกเหตุผลน่ารักๆ (กติกาเหล็กข้อ 2) */
  if(r.reason === 'stuffed'){
    /* อิ่มอยู่แล้ว → ให้ตัวน้องเป็นคนบอกเอง (เด็กอ่านจากฟองเหนือหัวน้องเข้าใจกว่า toast มุมจอ) */
    petBubble('😊');
    charBubble(d.pet.name + 'อิ่มอยู่แล้ว ยังไม่หิวนะ 😊', true);
    if(typeof showToast==='function') showToast('😊', d.pet.name + 'อิ่มอยู่ ไม่ต้องให้อาหารตอนนี้ก็ได้');
  }else if(r.reason === 'sick'){
    petBubble('🤒');
    if(typeof showToast==='function') showToast('🤒', 'น้องไม่สบาย ต้องไปหาคุณหมอก่อนนะ');
  }else if(r.reason === 'empty'){
    if(typeof showToast==='function') showToast('🛒', f.name + 'หมดแล้ว ไปซื้อเพิ่มที่ร้านสัตว์เลี้ยง 🐾 กลางเมืองนะ');
  }
}
/* ---------- อนิเมชันป้อนอาหาร (เฟส 3B · ผู้ใช้สั่งเพิ่ม 2026-08-09) ----------
   4 ช่วงต่อกัน ~2.6 วิ: เด็กหันหาน้อง+ยื่นชาม → น้องวิ่งมาหา → ก้มกินหัวโยกๆ → ดีใจกระโดด
   ⚠ ระหว่างเล่นอนิเมชัน **updatePet() ต้องหยุดคุมน้อง** ไม่งั้นระบบเดินเล่นปกติจะแย่งลากน้องกลับไป
     และตอนจบต้อง sync hPet.tile ให้ตรงช่องที่ยืนจริง ไม่งั้นก้าวต่อไปจะวาร์ปกลับช่องเดิม */
let feedAnim = null;
function buildFoodBowl(color){
  const g = new THREE.Group();
  const bowl = cyl(.13, .09, .07, 0xfff3d6, 12); bowl.position.y = .035; g.add(bowl);
  const food = sphere(.075, color, 10); food.position.y = .085; food.scale.y = .62; g.add(food);
  return g;
}
function startFeedAnim(f){
  if(!charGroup || !hPet.group || hMode !== 'world' || editMode) return;
  if(feedAnim) endFeedAnim();
  if(hPet.rest) petLeaveHouse(true);                 /* นอนอยู่ในบ้านสัตว์ → ออกมากินก่อน */
  hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null;
  hPet.beh = null; hPet.happy = 0; hPet.spin = false; hPet.sitK = 0;
  const cp = charGroup.position, pp = hPet.group.position;
  const dx = pp.x - cp.x, dz = pp.z - cp.z, d = Math.max(.001, Math.hypot(dx, dz));
  /* น้องมายืนกินและวางชามบนเส้นตรงระหว่างเด็กกับน้อง
     ⚠ ระยะต้องห่างพอให้เห็น **เด็ก → ชาม → น้อง** แยกกันชัด — เคยตั้งไว้ .52/.92 แล้วตัวน้องบังชามมิด
       (ตัวสัตว์ยาว ~.36 หน่วย) ต้องเว้นช่องว่างระหว่างชามกับน้องอย่างน้อย ~.5 หน่วย */
  const petTo = new THREE.Vector3(cp.x + dx/d*1.38, 0, cp.z + dz/d*1.38);
  const bowlAt = new THREE.Vector3(cp.x + dx/d*.78, 0, cp.z + dz/d*.78);
  hChar.targetRotY = Math.atan2(dx, dz);
  const bowl = buildFoodBowl(f.color || 0xd0694a);
  bowl.position.set(cp.x, .78, cp.z);                /* เริ่มที่ระดับมือเด็ก แล้วค่อยวางลงพื้น */
  petParent().add(bowl);
  feedAnim = {t:0, food:f, bowl, bowlFrom: bowl.position.clone(), bowlTo: bowlAt,
              petFrom: pp.clone(), petTo, ate:false, joy:false};
}
function endFeedAnim(){
  if(!feedAnim) return;
  const b = feedAnim.bowl;
  if(b){ if(b.parent) b.parent.remove(b); disposeGroup(b); }
  if(hPet.group){
    const {grid, W, D} = curGridInfo();
    const p = hPet.group.position;
    const t = nearestWalkable(grid, W, D, Math.round(p.x + (OUT_W-1)/2), Math.round(p.z + (OUT_D-1)/2));
    if(t) hPet.tile = {x:t.x, z:t.z};
    hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null; hPet.repathT = 0;
    hPet.group.rotation.x = 0; hPet.group.position.y = 0;
  }
  feedAnim = null;
}
function updateFeedAnim(dt, u){
  const a = feedAnim;
  if(!hPet.group || !charGroup){ endFeedAnim(); return; }
  a.t += dt;
  const T2 = 1.15, T3 = 2.0, T4 = 2.6;               /* วิ่งมาถึง → กินเสร็จ → จบ */
  /* --- เด็ก: ยื่นแขนทั้งสองข้างไปข้างหน้า แล้วค่อยลดลงตอนท้าย --- */
  if(u){
    const up = a.t < T3 ? Math.min(1, a.t/.45) : Math.max(0, 1 - (a.t-T3)/.45);
    u.arms[0].rotation.x = -1.15*up; u.arms[1].rotation.x = -1.15*up;
    u.arms[0].rotation.z = -.16; u.arms[1].rotation.z = .16;
    u.rig.position.y = 0;
  }
  /* --- ชาม: จากมือเด็กลอยลงไปวางที่พื้นตรงกลาง --- */
  if(a.bowl){
    const k = Math.min(1, a.t/T2), e = k*k*(3-2*k);
    a.bowl.position.lerpVectors(a.bowlFrom, a.bowlTo, e);
    a.bowl.position.y = a.bowlFrom.y * (1-e) + .02;
    if(a.t > T4 - .3) a.bowl.scale.setScalar(Math.max(.001, (T4 - a.t)/.3));   /* ยุบหายตอนจบ */
  }
  /* --- น้อง: วิ่งเข้ามาหาชาม แล้วก้มกิน --- */
  const g = hPet.group;
  const pk = Math.min(1, Math.max(0, (a.t - .15)/(T2 - .15))), pe = pk*pk*(3-2*pk);
  g.position.lerpVectors(a.petFrom, a.petTo, pe);
  g.position.y = pk < 1 ? Math.abs(Math.sin(a.t*16))*.07 : 0;               /* เด้งหยองๆ ตอนวิ่ง */
  g.rotation.y = Math.atan2(charGroup.position.x - g.position.x, charGroup.position.z - g.position.z);
  const anim = g.userData.anim || {};
  if(a.t >= T2 && a.t < T3){
    /* ก้มกิน: ทั้งตัวก้มลง + หัวโยกขึ้นลงเป็นจังหวะเคี้ยว + หางกระดิก */
    g.rotation.x = .34 * Math.min(1, (a.t - T2)/.18);
    if(anim.head) anim.head.rotation.x = Math.sin(a.t*17)*.28;
    if(anim.tail) anim.tail.rotation.z = Math.sin(a.t*13)*.5;
    if(!a.ate && a.t >= T2 + .25){
      a.ate = true;
      petBubble('😋');
      for(let i=0; i<7; i++)
        spawnParticle(a.bowlTo.x + (Math.random()-.5)*.45, .25 + Math.random()*.45,
                      a.bowlTo.z + (Math.random()-.5)*.45, i%2 ? 0xffd54f : 0xfff1a8, petParent());
    }
  }else if(a.t >= T3){
    /* กินเสร็จ: เงยหน้าขึ้นแล้วกระโดดดีใจ + หัวใจฟุ้ง */
    g.rotation.x = Math.max(0, .34 * (1 - (a.t - T3)/.2));
    if(anim.head) anim.head.rotation.x = 0;
    g.position.y = Math.abs(Math.sin((a.t - T3)*11))*.16;
    if(!a.joy){
      a.joy = true;
      petBubble('❤️');
      for(let i=0; i<8; i++)
        spawnParticle(g.position.x + (Math.random()-.5)*.6, .45 + Math.random()*.5,
                      g.position.z + (Math.random()-.5)*.6, i%2 ? 0xf06292 : 0xff8fb3, petParent());
    }
  }
  if(a.t >= T4){ endFeedAnim(); petHappy(.7, false); }
}
/* ==================== เฟส 12: กิจกรรมกับเพื่อนตัวน้อย (ข้อ 48) ====================
   แตะตัวน้อง → เมนูฟองเหนือหัว → เลือกกิจกรรม
   🤚 ลูบหัว (ทำได้ทุกที่) · 🫧 อาบน้ำ · 🎾 เล่นด้วยกัน · 🎪 สอนท่า (3 อย่างหลังเฉพาะบริเวณบ้าน)
   ⚠ **ทุกกิจกรรมไม่ให้เหรียญสักบาท** (ผู้ใช้สั่ง 2026-08-14) รางวัลคือ "ค่าความสุข" ซึ่งมีผลจริง
     กับพฤติกรรมน้อง (ต่ำกว่า 25% = ไปนอนในบ้านสัตว์ ไม่เดินตามเด็กจนกว่าจะหายเหงา)
   ⚠ ระหว่างเล่น **updatePet() ต้องหยุดคุมน้อง** (กับดักเดียวกับ feedAnim) และตอนจบต้อง sync
     hPet.tile ให้ตรงช่องที่ยืนจริง ไม่งั้นก้าวต่อไปจะวาร์ปกลับช่องเดิม */
const PET_ACTS = {
  pat:   {dur:1.9, pose:'pat',   home:false},
  bath:  {dur:4.0, pose:'scrub', home:true},
  ball:  {dur:4.2, pose:'throw', home:true},
  trick: {dur:3.6, pose:'cue',   home:true},
};
let petAct = null;
/* "บริเวณบ้าน" = ในรั้วสนามหน้าบ้าน (HOME_ZONE = YARD เป๊ะๆ ตั้งแต่ 2026-08-09)
   อยู่ในตัวบ้านไม่นับ — กิจกรรมทุกอย่างต้องใช้ที่โล่งกลางสนาม (อ่างอาบน้ำ/โยนบอล) */
function petAtHome(){
  return hScene === 'out' && !!hChar.tile && inBox(HOME_ZONE, hChar.tile.x, hChar.tile.z);
}
/* กระดิ่งบนปลอกคอดังตอนน้องกระโดด/วิ่งเข้ามาหา — เสียงเดียวกับเปียโนของหนู ไม่โหลดไฟล์เสียงเพิ่ม
   ⚠ ห้ามดังทุกก้าวที่น้องเดิน จะกลายเป็นเสียงรบกวนตลอดเวลา (ดังเฉพาะจังหวะที่ "มีอะไรเกิดขึ้น") */
let petBellT = 0;
function petJingle(){
  const u = hPet.group && hPet.group.userData.anim;
  if(!u || !u.collar || u.collar.style !== 'bell') return;
  const now = performance.now();
  if(now - petBellT < 260) return;
  petBellT = now;
  if(typeof playPianoNote === 'function') playPianoNote(1568, .16);
}
/* สร้างตัวน้องใหม่ทั้งตัวโดยคงตำแหน่ง/ทิศทางเดิม — ใช้ตอนเปลี่ยนปลอกคอหรืออาบน้ำเสร็จ
   (ปลอกคอ/รอยเปื้อนถูกประกอบเข้าโมเดลใน buildPet ⇒ เปลี่ยนแล้วต้องประกอบใหม่ ไม่มีทางลัด) */
function restylePet(){
  if(!hPet.group || !hPet.cfg) return;
  const old = hPet.group, par = old.parent || petParent();
  const g = buildPet(hPet.cfg.type, hPet.cfg.color);
  g.position.copy(old.position);
  g.rotation.copy(old.rotation);
  par.add(g);
  if(old.parent) old.parent.remove(old);
  disposeGroup(old);
  hPet.group = g;
}
/* ลูกบอลของน้อง — เขียวมะนาวมีเส้นโค้งขาวรอบตัวแบบลูกเทนนิส (เด็กจำได้ทันทีว่าเป็นลูกบอล) */
function buildPetBall(){
  const g = new THREE.Group();
  g.add(sphere(.085, 0xd7ea52, 10));
  [1,-1].forEach(s=>{
    const ln = new THREE.Mesh(new THREE.TorusGeometry(.086, .009, 5, 16, Math.PI*1.1), toonMat(0xfdfdf5));
    ln.rotation.set(Math.PI/2, 0, .9*s);
    ln.position.x = .012*s;
    g.add(ln);
  });
  return g;
}
/* อ่างอาบน้ำ + ฟองสบู่ — ทรงมนสีฟ้าพาสเทลเข้าชุดกับของตกแต่งในเกม */
function buildPetTub(){
  const g = new THREE.Group();
  const tub = cyl(.42, .38, .26, 0x8fd6f2, 14); tub.position.y = .13; g.add(tub);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.42, .035, 7, 18), toonMat(0xfdfdf5));
  rim.rotation.x = Math.PI/2; rim.position.y = .26; g.add(rim);
  const water = cyl(.37, .37, .02, 0xcdeffb, 14); water.position.y = .235; g.add(water);
  const foam = [];
  for(let i=0;i<7;i++){
    const b = sphere(.06 + Math.random()*.05, 0xfdfdf5, 7);
    b.position.set(Math.cos(i/7*Math.PI*2)*.26, .25 + Math.random()*.05, Math.sin(i/7*Math.PI*2)*.26);
    g.add(b); foam.push(b);
  }
  g.userData.foam = foam;
  return g;
}
/* ท่าโชว์ของน้อง (ใช้ทั้งตอนกำลังสอน และตอนโชว์เองหลังเรียนจบแล้ว) — k = 0..1 */
function petTrickAnim(id, k, g, u, baseY){
  const kk = Math.min(1, Math.max(0, k));
  const ease = Math.sin(kk*Math.PI);
  g.rotation.set(0, baseY, 0);
  g.position.y = 0;
  if(id === 'spin'){
    g.rotation.y = baseY + kk*Math.PI*4;              /* หมุน 2 รอบเต็มพอดี ไม่ค้างเอียง */
    g.position.y = ease*.06;
  }else if(id === 'jump'){
    g.position.y = Math.abs(Math.sin(kk*Math.PI*2.6))*.46;
    g.rotation.x = -.14*ease;
  }else if(id === 'high'){
    g.rotation.x = -.66*ease;                          /* ตั้งตัวขึ้นแตะมือเด็ก */
    g.position.y = ease*.2;
  }else if(id === 'roll'){
    /* 🛠 แก้ 2026-08-15 (ผู้ใช้แจ้งว่าท่านอนกลิ้งเพี้ยน)
       ของเดิมใส่ **pitch (`rotation.x`) พร้อมกับ roll (`rotation.z`)** ⇒ euler XYZ เอา 2 แกนมาผสมกัน
       เห็นเป็นตัวตีลังกามั่วๆ ไม่ใช่ "นอนกลิ้ง"
       ⇒ กลิ้งรอบแกนหน้า-หลังของตัวเอง (`rotation.z`) **แกนเดียวล้วน** ไม่มี pitch เลย
       ⚠ จุดหมุนอยู่ที่ฝ่าเท้า (y=0) ⇒ ตอนตะแคง 90°/270° ลำตัวจะจมพื้น
         ต้องยกตัวขึ้นชดเชยตามระยะครึ่งความกว้างลำตัว ไม่งั้นเห็นครึ่งตัวหายไปในดิน */
    const rollA = kk*Math.PI*2;
    g.rotation.set(0, baseY, rollA);
    /* 🛠 แก้รอบ 2 (ผู้ใช้แจ้งว่ายังทะลุพื้น — และเดาถูกว่า "จุดหมุนผิด")
       **จุดหมุนของโมเดลสัตว์อยู่ที่ฝ่าเท้า (y = 0)** ตัวทั้งตัวอยู่เหนือจุดนั้น
       ⇒ พอหมุนรอบแกนหน้า-หลังไปถึง 180° ลำตัวจะชี้ลง **จมอยู่ใต้ดินทั้งตัว**
       สูตรเดิม `|sin|` ยกตัวสูงสุดตอน 90° แต่ตอน 180° ยกได้ 0 ⇒ จมเต็มๆ พอดี

       วิธีที่ถูก: ชดเชยให้ **กลางลำตัวอยู่ที่ความสูงเดิมตลอดการหมุน**
       จุดกลางลำตัวอยู่สูง `PET_BODY_MID` จากฝ่าเท้า ⇒ ต้องยกตัวขึ้น
       `mid × (1 − cos θ)` : 0° → 0 · 90° → mid · 180° → 2×mid (หงายท้องโดยหลังแตะพื้นพอดี) */
    const PET_BODY_MID = .26;
    g.position.y = PET_BODY_MID * (1 - Math.cos(rollA));
  }else{                                               /* sit — นั่งเอนตัวขึ้นแล้วค้าง */
    g.rotation.x = -.5*Math.min(1, kk*3);
  }
  if(u && u.tail) u.tail.rotation.z = Math.sin(kk*34)*.55;
  if(u && u.wings) u.wings.forEach((w,i)=>{ w.rotation.z = Math.sin(kk*40)*.6*(i?1:-1); });
}
function petTrickInfo(id){
  const list = (PETCARE && PETCARE.TRICKS) || [];
  for(let i=0;i<list.length;i++) if(list[i].id === id) return list[i];
  return null;
}
/* คืน spec ท่าเล่นของของเล่นชิ้นนั้น (null = ไม่มีท่าประจำ ให้ถอยไปใช้ท่าลูกบอล) */
function petToySpec(id){
  return (PET_TOYS3D.SPECS && PET_TOYS3D.SPECS[id]) || null;
}
/* ข้อมูลของเล่นจากคลังร้าน — **แต้มความสุขอยู่ที่ PET_TOYS ใน js/house-shop.js ที่เดียว**
   ไฟล์ท่าเล่นไม่รู้จักตัวเลขนี้เลย (กติกาเดียวกับที่ห้ามตั้งเลขเหรียญนอก coinsFor) */
function petToyInfo(id){
  const list = (SHOP && SHOP.PET_TOYS) || [];
  for(let i = 0; i < list.length; i++) if(list[i].id === id) return list[i];
  return null;
}
/* context ที่ส่งให้ spec ของเล่นใช้ — ห่อของภายในของ house.js ไว้ให้ไฟล์ท่าเล่นเรียกได้เท่าที่จำเป็น */
function petToyCtx(dt){
  const a = petAct, g = hPet.group;
  return {
    a, g, u: (g && g.userData.anim) || {}, T: a.t, dt: dt || 0,
    cp: charGroup.position,
    /* ⚠ ของทุกชิ้นต้องเข้าทางนี้เท่านั้น จะได้ถูกเก็บกวาดที่ endPetAct() อัตโนมัติ */
    add(o){ petParent().add(o); a.props.push(o); },
    bubble: petBubble,
    puff: petPuff,
    jingle: petJingle,
    /* จบท่า = จ่ายความสุขตามค่า gain ของ "ชิ้นนั้น" (จุดเดียวที่ toyPlayed ถูกเรียก)
       เต็มโควตาความสุขวันนี้แล้วยังเล่นได้เรื่อยๆ แค่ไม่ได้แต้มเพิ่ม — ห้ามห้ามไม่ให้เล่น */
    ok(txt){
      const info = petToyInfo(a.arg);
      petJingle();
      const r = PETCARE ? PETCARE.toyPlayed(info ? (info.gain | 0) : null) : null;
      if(r) questCaught('pet', 'play');
      if(typeof playCorrect === 'function') playCorrect();
      charBubble(r && r.gain > 0 ? txt : ('สนุกจังเลย ' + (info ? info.emoji : '😊')), true);
    },
  };
}
/* ---------- เริ่มกิจกรรม ---------- */
function startPetAct(kind, arg){
  /* เฟส 12.1: kind 'toy' = ของเล่นที่มีท่าประจำของตัวเอง (dur/pose/ระยะยืน มาจาก spec ของชิ้นนั้น)
     หา spec ไม่เจอด้วยเหตุผลใดก็ตาม (ไฟล์ยังโหลดไม่เสร็จ / ของเล่นใหม่ที่ยังไม่มีท่า)
     ⇒ **ถอยไปเล่นท่าลูกบอลเดิม ห้ามเงียบไม่ทำอะไร** เด็กกดปุ่มแล้วต้องมีอะไรเกิดขึ้นเสมอ */
  let toySpec = null;
  if(kind === 'toy'){
    toySpec = petToySpec(arg);
    if(!toySpec){ kind = 'ball'; }
  }
  const spec = toySpec
    ? {dur: toySpec.dur, pose: toySpec.pose, home: true}
    : PET_ACTS[kind];
  if(!spec || petAct || feedAnim) return false;
  if(!hPet.group || !charGroup || hMode !== 'world' || editMode) return false;
  if(hPet.rest) petLeaveHouse(true);        /* นอนอยู่ในบ้านสัตว์ → ออกมาเล่นก่อน */
  hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null;
  hPet.beh = null; hPet.happy = 0; hPet.spin = false; hPet.sitK = 0; hPet.show = null;
  const cp = charGroup.position, pp = hPet.group.position;
  let dx = pp.x - cp.x, dz = pp.z - cp.z;
  let d = Math.hypot(dx, dz);
  if(d < .05){ dx = Math.sin(hChar.targetRotY || 0); dz = Math.cos(hChar.targetRotY || 0); d = 1; }
  dx /= d; dz /= d;
  const near = toySpec ? (toySpec.near || 1.0) : (kind === 'ball' ? 1.3 : 1.0);
  hChar.targetRotY = Math.atan2(dx, dz);    /* เด็กหันหาน้องเสมอก่อนเริ่มท่า */
  petAct = {kind, t:0, dur:spec.dur, arg: arg || null, dx, dz,
            faceY: Math.atan2(-dx, -dz),    /* ทิศที่น้องหันกลับมามองเด็ก */
            petFrom: pp.clone(),
            petTo: new THREE.Vector3(cp.x + dx*near, 0, cp.z + dz*near),
            props:[], flags:{}, toySpec};
  charAct = {kind: spec.pose, t0: performance.now(), dur: spec.dur*1000, hold:false};
  if(typeof playClick === 'function') playClick();
  if(toySpec){
    toySpec.build(petToyCtx(0));
  }else if(kind === 'ball'){
    const ball = buildPetBall();
    ball.position.set(cp.x, .62, cp.z);
    petParent().add(ball);
    petAct.ball = ball;
    petAct.props.push(ball);
    petAct.ballTo = new THREE.Vector3(cp.x + dx*3.1, .085, cp.z + dz*3.1);
  }else if(kind === 'bath'){
    const tub = buildPetTub();
    tub.position.set(cp.x + dx*1.1, 0, cp.z + dz*1.1);
    tub.scale.setScalar(.01);
    petParent().add(tub);
    petAct.tub = tub;
    petAct.props.push(tub);
    petAct.petTo.set(tub.position.x, 0, tub.position.z);
  }
  return true;
}
function endPetAct(){
  if(!petAct) return;
  petAct.props.forEach(o=>{ if(o.parent) o.parent.remove(o); disposeGroup(o); });
  if(hPet.group){
    const gi = curGridInfo();
    const p = hPet.group.position;
    const t = nearestWalkable(gi.grid, gi.W, gi.D,
                              Math.round(p.x + (gi.W-1)/2), Math.round(p.z + (gi.D-1)/2));
    if(t) hPet.tile = {x:t.x, z:t.z};
    hPet.path = []; hPet.seg = 0; hPet.segT = 0; hPet.segFrom = null; hPet.repathT = 0;
    hPet.group.rotation.set(0, hPet.group.rotation.y, 0);
    hPet.group.position.y = 0;
    hPet.group.scale.setScalar(PET_SCALE);
  }
  petAct = null;
  petCareHud.t = 0; petBarKey = '';       /* หลอดความสุขต้องขยับทันตา ไม่รอครบวินาที */
  syncPetMood();                          /* ความสุขขึ้นแล้วอาจถึงเวลาออกมาเดินเล่นพอดี */
}
/* ปุยฟองสบู่/ประกายฟุ้งรอบตัวน้อง */
function petPuff(n, color, spread, high){
  if(!hPet.group) return;
  const p = hPet.group.position;
  for(let i=0;i<n;i++)
    spawnParticle(p.x + (Math.random()-.5)*spread, (high||.35) + Math.random()*.45,
                  p.z + (Math.random()-.5)*spread, color, petParent());
}
/* บันทึกผลการสอน + คำชม — **ห้ามมีคำว่า "ยังไม่ได้/ผิด"** ความคืบหน้าไม่มีวันถอยหลัง (กติกาเหล็กข้อ 2) */
function finishTeach(id){
  if(!PETCARE) return;
  const r = PETCARE.teach(id);
  if(r && r.ok) questCaught('pet', 'trick');   /* 🐕 เควสต์ "สอนท่าให้น้อง" */
  if(!r.ok) return;
  const tk = petTrickInfo(id);
  petJingle();
  if(typeof playCorrect === 'function') playCorrect();
  if(r.justLearned){
    /* 📔 เฟส 16: ท่าที่น้องทำเองได้แล้ว = จดลงสมุดสะสม **ถาวร**
       (ปล่อยน้องคืนแล้ว `data.care` ถูกล้าง ถ้าไม่จดไว้ที่สมุด ของสะสมของเด็กจะหาย) */
    if(window.HouseBook) window.HouseBook.mark('trick', id);
    petBubble('🏆');
    petPuff(14, 0xffd54f, .9, .5);
    charBubble((hPet.cfg ? hPet.cfg.name : 'น้อง') + 'ทำท่า "' + (tk ? tk.name : '') + '" เองได้แล้ว! 🏆', true);
    if(typeof showToast === 'function')
      showToast('🏆', 'เก่งมาก! ต่อไปน้องจะทำท่า' + (tk ? tk.name : '') + 'ให้ดูเองบ้างนะ');
  }else{
    petBubble('⭐');
    petPuff(6, 0xfff3a8, .7, .45);
    charBubble('เยี่ยม! อีก ' + Math.max(0, r.need - r.prog) + ' ครั้งก็ทำเองได้แล้ว ⭐', true);
  }
}
function updatePetAct(dt){
  const a = petAct;
  if(!a) return;
  if(!hPet.group || hMode !== 'world' || editMode){ endPetAct(); return; }
  a.t += dt;
  const g = hPet.group, u = g.userData.anim || {}, T = a.t;
  g.rotation.set(0, a.faceY, 0);
  g.position.y = 0;

  if(a.kind === 'pat'){
    /* 0-.5 น้องเดินเข้ามาหา · .5-1.5 หัวโยกรับการลูบ + หัวใจฟุ้ง · 1.5-1.9 กระโดดดีใจ */
    const k = Math.min(1, T/.5), e = k*k*(3-2*k);
    g.position.lerpVectors(a.petFrom, a.petTo, e);
    if(k < 1) g.position.y = Math.abs(Math.sin(T*15))*.05;
    if(T >= .5 && T < 1.5){
      if(u.head) u.head.rotation.x = Math.sin(T*11)*.2;
      g.rotation.z = Math.sin(T*7)*.07;
      g.position.y = Math.abs(Math.sin(T*6))*.03;
      if(!a.flags.h1 && T > .7){ a.flags.h1 = true; petBubble('💗'); petPuff(4, 0xf06292, .5); }
      if(!a.flags.h2 && T > 1.15){ a.flags.h2 = true; petPuff(4, 0xff8fb3, .55); }
    }
    if(u.tail) u.tail.rotation.z = Math.sin(T*(T>=.5?16:11))*.42;
    if(T >= 1.5){
      g.position.y = Math.abs(Math.sin((T-1.5)*9))*.26;
      if(!a.flags.done){
        a.flags.done = true;
        petJingle();
        const r = PETCARE ? PETCARE.pat() : null;
        if(r) questCaught('pet', 'pat');
        if(typeof playCorrect === 'function') playCorrect();
        /* ลูบครบโควตาวันนี้แล้วยังลูบได้เรื่อยๆ **แค่ไม่ได้ค่าความสุขเพิ่ม** ห้ามห้ามไม่ให้ลูบ */
        charBubble(r && r.capped ? 'ชอบมากเลยยย 💗' : 'น่ารักที่สุดเลย 💗', true);
      }
    }
  }else if(a.kind === 'bath'){
    /* 0-.5 อ่างผุดขึ้น · .35-1.1 น้องลงอ่าง · 1.1-2.9 ถูตัวฟองฟุ้ง · 2.9-3.5 สะบัดตัว · 3.5-4.0 ขึ้นจากอ่างแวววาว */
    const tub = a.tub;
    if(tub){
      const s = T < .5 ? Math.min(1, T/.4) : (T > 3.5 ? Math.max(.001, 1 - (T-3.5)/.5) : 1);
      tub.scale.setScalar(s*s*(3-2*s) + .001);
      (tub.userData.foam || []).forEach((f,i)=>{ f.position.y = .25 + Math.sin(T*3 + i)*.03; });
    }
    if(T < 1.1){
      const k = Math.min(1, Math.max(0, (T-.35)/.75)), e = k*k*(3-2*k);
      g.position.lerpVectors(a.petFrom, a.petTo, e);
      g.position.y = k < 1 ? Math.abs(Math.sin(T*15))*.06 : .12;
    }else if(T < 2.9){
      g.position.set(a.petTo.x, .12 + Math.abs(Math.sin(T*5))*.03, a.petTo.z);
      g.rotation.z = Math.sin(T*8)*.1;                    /* ตัวโยกไปมาตอนถูกถู */
      if(u.head) u.head.rotation.x = Math.sin(T*9)*.16;
      if(!a.flags.b || T > a.flags.b){
        a.flags.b = T + .16;
        petPuff(2, Math.random() < .5 ? 0xffffff : 0xcdeffb, .8, .45);
      }
      if(!a.flags.say){ a.flags.say = true; petBubble('🫧'); }
    }else if(T < 3.5){
      /* สะบัดขนไล่น้ำ — หมุนตัวซ้ายขวาเร็วๆ แล้วละอองน้ำกระเด็นรอบตัว */
      g.position.set(a.petTo.x, .12, a.petTo.z);
      g.rotation.y = a.faceY + Math.sin((T-2.9)*40)*.34;
      if(!a.flags.shake){
        a.flags.shake = true;
        petPuff(12, 0xcdeffb, 1.1, .3);
        const r = PETCARE ? PETCARE.bath() : {ok:false};
        if(r && r.ok) questCaught('pet', 'bath');
        if(r.ok){
          restylePet();                                   /* รอยเปื้อนหายทันตา */
          if(typeof playCorrect === 'function') playCorrect();
        }
      }
    }else{
      const k = Math.min(1, (T-3.5)/.5), e = k*k*(3-2*k);
      g.position.lerpVectors(a.petTo, a.petFrom, e*.55);
      g.position.y = Math.abs(Math.sin(k*Math.PI))*.22;
      if(!a.flags.done){
        a.flags.done = true;
        petBubble('✨'); petJingle();
        petPuff(9, 0xfff3a8, .8, .5);
        charBubble('สะอาดเอี่ยมเลย ✨', true);
      }
    }
    if(u.tail) u.tail.rotation.z = Math.sin(T*14)*.4;
  }else if(a.kind === 'ball'){
    /* 0-.75 เด็กเหวี่ยงแขน บอลลอยเป็นวง · .75-2.15 น้องวิ่งไปเก็บ · 2.15-3.45 คาบกลับมา · 3.45-4.2 วางลงแล้วดีใจ */
    const ball = a.ball;
    if(T < .75){
      if(ball){
        const k = Math.min(1, Math.max(0, (T-.22)/.53));
        ball.position.lerpVectors(new THREE.Vector3(charGroup.position.x, .62, charGroup.position.z), a.ballTo, k);
        ball.position.y = .62 + Math.sin(k*Math.PI)*.85 - k*.535;
        ball.rotation.x -= dt*11;
        if(k > 0 && !a.flags.thrown){ a.flags.thrown = true; petBubble('👀'); }
      }
    }else if(T < 2.15){
      const k = Math.min(1, (T-.75)/1.4), e = k*k*(3-2*k);
      g.position.lerpVectors(a.petFrom, new THREE.Vector3(a.ballTo.x, 0, a.ballTo.z), e);
      g.position.y = Math.abs(Math.sin(T*17))*.09;
      g.rotation.y = Math.atan2(a.ballTo.x - g.position.x, a.ballTo.z - g.position.z);
      if(ball && k >= 1) ball.position.set(a.ballTo.x, .085, a.ballTo.z);
      if(k >= 1 && !a.flags.grab){
        a.flags.grab = true; petBubble('🎾'); petJingle();
        if(u.head) u.head.rotation.x = .4;
      }
    }else if(T < 3.45){
      const k = Math.min(1, (T-2.15)/1.3), e = k*k*(3-2*k);
      const from = new THREE.Vector3(a.ballTo.x, 0, a.ballTo.z);
      g.position.lerpVectors(from, a.petTo, e);
      g.position.y = Math.abs(Math.sin(T*17))*.09;
      g.rotation.y = Math.atan2(a.petTo.x - g.position.x, a.petTo.z - g.position.z);
      if(ball){                                    /* บอลลอยอยู่ตรงปากน้อง (คาบกลับมา) */
        ball.position.set(g.position.x + Math.sin(g.rotation.y)*.34,
                          g.position.y + .34,
                          g.position.z + Math.cos(g.rotation.y)*.34);
        ball.rotation.x -= dt*4;
      }
    }else{
      g.position.set(a.petTo.x, Math.abs(Math.sin((T-3.45)*9))*.3, a.petTo.z);
      g.rotation.y = a.faceY;
      if(ball){
        ball.position.y = Math.max(.085, ball.position.y - dt*2.2);
        ball.scale.setScalar(Math.max(.001, 1 - Math.max(0, (T-3.8)/.4)));
      }
      if(!a.flags.done){
        a.flags.done = true;
        petJingle(); petBubble('❤️');
        petPuff(7, 0xf06292, .7, .4);
        const r = PETCARE ? PETCARE.ballFetched() : null;
        if(typeof playCorrect === 'function') playCorrect();
        charBubble(r && r.gain > 0 ? 'เก่งมากเลย! 🎾' : 'สนุกจังเลย 🎾', true);
      }
    }
    if(u.tail) u.tail.rotation.z = Math.sin(T*15)*.5;
  }else if(a.kind === 'toy' && a.toySpec){
    /* เฟส 12.1 — ท่าเล่นประจำของเล่นแต่ละชิ้น (js/house-pet-toys.js)
       ตัว spec คุมทั้ง prop และตัวน้องเอง ที่นี่แค่ส่ง context ให้ */
    a.toySpec.update(petToyCtx(dt));
  }else if(a.kind === 'trick'){
    /* 0-.85 น้องนั่งตั้งใจฟังคำสั่ง · .85-2.6 ทำท่า · 2.6-3.6 สำเร็จ เด็กปรบมือ น้องกระโดดดีใจ */
    const id = a.arg || 'sit';
    if(T < .85){
      const k = Math.min(1, T/.5), e = k*k*(3-2*k);
      g.position.lerpVectors(a.petFrom, a.petTo, e);
      g.rotation.x = -.34*Math.min(1, T/.6);
      if(!a.flags.cue && T > .3){
        a.flags.cue = true;
        const tk = petTrickInfo(id);
        petBubble('❓');
        charBubble(tk ? tk.cue : 'มาลองกันเถอะ!', true);
      }
    }else if(T < 2.6){
      petTrickAnim(id, (T-.85)/1.75, g, u, a.faceY);
      g.position.x = a.petTo.x; g.position.z = a.petTo.z;
    }else{
      g.position.set(a.petTo.x, Math.abs(Math.sin((T-2.6)*8))*.3, a.petTo.z);
      if(!a.flags.done){ a.flags.done = true; finishTeach(id); }
    }
    if(u.tail) u.tail.rotation.z = Math.sin(T*16)*.5;
  }
  if(T >= a.dur) endPetAct();
}
/* ---------- น้องเหงา (ความสุข < 25%) = ไปนอนพักในบ้านสัตว์ ----------
   ⚠ **ไม่ใช่บทลงโทษ** — เรียกออกมาเดินเล่นไม่ได้ก็จริง แต่ลูบหัว/อาบน้ำได้ตลอด และพอความสุข
     พ้น 25% น้องเดินออกมาเองทันที เด็กจึงมีทางแก้อยู่ในมือเสมอ (กติกาเหล็กข้อ 1 + 2) */
function syncPetMood(){
  if(!PETCARE || !hPet.group || hScene !== 'out' || feedAnim || petAct) return;
  if(petCareHud.sick) return;                       /* ป่วยอยู่ ให้ syncPetSick() คุมแทน */
  const sleepy = PETCARE.isSleepy();
  if(sleepy && !hPet.rest){
    const g = petHouseGroup();
    if(g){ petEnterHouse(g); hPet.restLonely = true; }
  }else if(sleepy && hPet.rest){
    hPet.restLonely = true;
  }else if(!sleepy && hPet.rest && hPet.restLonely){
    hPet.restLonely = false;
    petLeaveHouse();
  }
}
/* ---------- พ่อ-แม่ในบ้าน (เฟส 4A · ข้อ 28) ----------
   ยืนอยู่ในบ้านชั้นใน ไม่ออกไปในเมือง · ตัวสูงกว่าเด็ก 1.25 เท่า (ใช้ buildCharacter ตัวเดียวกัน)
   แตะแล้วคุย/รับงาน — วันนี้พ่อหรือแม่เป็นคนขอ สุ่ม seeded รายวันจาก js/house-quests.js
   ⚠ **สร้างใหม่ทุกครั้งที่เข้าบ้าน** เพราะเด็กแก้ชื่อ/หน้าตาได้ระหว่างเล่น */
const PARENT_SCALE = 1.25;
/* จุดยืน: แม่อยู่ครัว (x≥9, z≤7) · พ่ออยู่ห้องนั่งเล่น (x≤8, z≤7) — ดู roomOf() */
const PARENT_SPOT = {dad:{x:2, z:4, ry:Math.PI*0.25}, mom:{x:11, z:3, ry:-Math.PI*0.25}};
let parentObjs = {};                 /* {dad:{g, who}, mom:{...}} — group ที่อยู่ใน interiorGroup */
function clearParents(){
  Object.keys(parentObjs).forEach(w=>{
    const o = parentObjs[w];
    if(o && o.g){ if(o.g.parent) o.g.parent.remove(o.g); disposeGroup(o.g); }
    if(o && o.mk){ [o.mk.open, o.mk.done].forEach(m=>{ if(m && m.parent) m.parent.remove(m); }); }
  });
  parentObjs = {};
}
function buildParents(){
  if(!FAMILY || !interiorGroup) return;
  clearParents();
  const ps = FAMILY.parents();
  FAMILY.WHO.forEach(w=>{
    const spot = PARENT_SPOT[w];
    /* snap ไปช่องเดินได้ที่ใกล้ที่สุด เผื่อเด็กวางเฟอร์นิเจอร์ทับจุดยืนประจำ */
    const t = nearestWalkable(inGrid, IN_W, IN_D, spot.x, spot.z) || spot;
    const g = buildCharacter(ps[w].char);
    g.scale.setScalar(PARENT_SCALE);
    g.position.set(inWX(t.x), 0, inWZ(t.z));
    g.rotation.order = 'YXZ';
    g.rotation.y = spot.ry;
    g.userData.hParent = w;          /* tag ให้ raycast ตอนแตะเจอ (ancestor walk เหมือน hNpc) */
    interiorGroup.add(g);
    /* ป้ายงาน "!" / "✓" ลอยเหนือหัว — **ใช้ texture/geometry ชุดเดียวกับชาวบ้านในเมือง**
       (npcMarkMat/NPC_MARK_GEO) เด็กจะได้อ่านสัญลักษณ์เดียวกันทั้งเกม ไม่ต้องเรียนรู้ใหม่ */
    let mk = null;
    if(QUESTS){
      if(!NPC_MARK_GEO.g) NPC_MARK_GEO.g = new THREE.PlaneGeometry(.74, .74);
      const open = new THREE.Mesh(NPC_MARK_GEO.g, npcMarkMat('open'));
      const done = new THREE.Mesh(NPC_MARK_GEO.g, npcMarkMat('done'));
      open.renderOrder = done.renderOrder = 5;
      open.visible = done.visible = false;
      interiorGroup.add(open); interiorGroup.add(done);
      mk = {open, done};
    }
    parentObjs[w] = {g, who:w, mk, ph:Math.random()*6.28, sw:Math.random()*6.28, bubbleT:6 + Math.random()*8,
                     path:[], to:null, wait:1 + Math.random()*2, busy:0, actCat:null, actNow:null};
  });
  refreshParentMark();        /* ตั้งสถานะป้ายทันทีตั้งแต่สร้างเสร็จ ไม่ต้องรอเฟรมแรกของลูป */
  if(editMode) setParentsVisible(false);   /* สร้างใหม่ระหว่างตกแต่งอยู่ ต้องเกิดมาซ่อนไว้เลย */
}
/* ---------- กิจกรรมของพ่อแม่ (ผู้ใช้สั่งเพิ่ม 2026-08-09) ----------
   **สุ่มทำกิจกรรม "ตามอุปกรณ์ที่มีอยู่ในบ้านจริง" เท่านั้น** — อ่านจาก data.decor.in ที่เด็กวางเอง
   บ้านไม่มีเตา = ไม่มีทำอาหาร · ไม่มีของเลย = เดินเล่นไปมาเฉยๆ (ไม่แกล้งทำกิจกรรมลอยๆ ให้เด็กงง) */
const PARENT_ACTS = {
  kitchen: {emoji:'🍳', dad:'พ่อทำกับข้าวอยู่นะ',      mom:'แม่ทำกับข้าวอยู่จ้ะ'},
  table:   {emoji:'🍽️', dad:'พ่อจัดโต๊ะให้เรียบร้อยก่อน', mom:'แม่จัดโต๊ะรออยู่นะ'},
  seat:    {emoji:'📖', dad:'พ่อนั่งอ่านหนังสือแป๊บนึง',  mom:'แม่นั่งพักสักครู่นะ'},
  bed:     {emoji:'🛏️', dad:'พ่อเก็บที่นอนให้เรียบร้อย',  mom:'แม่เก็บที่นอนอยู่จ้ะ'},
  bath:    {emoji:'🧼', dad:'พ่อทำความสะอาดอยู่นะ',    mom:'แม่ทำความสะอาดอยู่จ้ะ'},
  decor:   {emoji:'🪴', dad:'พ่อจัดของให้สวยหน่อย',     mom:'แม่จัดของให้สวยๆ นะ'},
};
/* ท่าประจำระหว่างทำกิจกรรมของพ่อแม่ (เฟส 4B) — base = องศาแขนตั้งต้น · amp/spd = แกว่งแรง/เร็ว
   alt:true = แขนสลับข้างกัน (งานที่ใช้มือสลับ) · alt:false = ขยับพร้อมกัน (งานที่ใช้สองมือ) */
const PARENT_POSE = {
  kitchen: {base:-1.05, amp:.30, spd:.010, alt:false},  /* คนหม้อสองมือ */
  table:   {base:-0.70, amp:.32, spd:.008, alt:true},   /* หยิบจานวางทีละใบ */
  seat:    {base:-1.45, amp:.05, spd:.004, alt:false},  /* ถือหนังสืออ่าน เกือบนิ่ง */
  bed:     {base:-0.85, amp:.40, spd:.007, alt:true},   /* สะบัดผ้าห่มเก็บที่นอน */
  bath:    {base:-1.20, amp:.28, spd:.017, alt:false},  /* ถูๆ เร็วๆ */
  decor:   {base:-1.30, amp:.35, spd:.006, alt:true},   /* ยกของสลับมือจัดวาง */
};
const PARENT_SPEED = .62;               /* ช้ากว่าชาวบ้านในเมือง — เดินในบ้านไม่ต้องรีบ */
/* จุดหมายที่ไปทำกิจกรรมได้ = ของในบ้านที่เด็กวางไว้จริง (คืนช่องที่ "ยืนข้างๆ ของ" ได้) */
function parentActSpots(){
  const d = loadHouseData() || {};
  const list = (d.decor && d.decor.in) || [];
  const out = [];
  list.forEach(rec=>{
    const item = FURN.byId[rec.id];
    if(!item || !PARENT_ACTS[item.cat]) return;
    /* ยืนช่องข้างๆ ของ ไม่ใช่ทับตัวของ (ช่องที่ของวางอยู่เดินไม่ได้) */
    const near = nearestWalkable(inGrid, IN_W, IN_D, rec.x, rec.z);
    if(near) out.push({x:near.x, z:near.z, cat:item.cat, name:item.name});
  });
  return out;
}
function parentWalkTiles(){
  const out = [];
  for(let z=0; z<IN_D; z++) for(let x=0; x<IN_W; x++)
    if(isWalk(inGrid, IN_W, IN_D, x, z)) out.push({x, z});
  return out;
}
function parentTile(g){
  return {x: Math.round(g.position.x + (IN_W-1)/2), z: Math.round(g.position.z + (IN_D-1)/2)};
}
/* เลือกงานถัดไป: มีอุปกรณ์ก็ไปทำกิจกรรม ไม่มีก็เดินเล่นไปช่องว่างแทน */
function parentPickTarget(o){
  const spots = parentActSpots();
  const cur = parentTile(o.g);
  let dst = null;
  if(spots.length && Math.random() < .75){
    dst = spots[(Math.random()*spots.length)|0];
    o.actCat = dst.cat;
  }else{
    const tiles = parentWalkTiles();
    if(!tiles.length) return;
    dst = tiles[(Math.random()*tiles.length)|0];
    o.actCat = null;
  }
  o.path = findPath(inGrid, IN_W, IN_D, cur, {x:dst.x, z:dst.z}) || [];
  o.wait = o.path.length ? 0 : 1 + Math.random()*2;
}
/* เดิน + ทำกิจกรรม + หันหน้าหาเด็กเมื่อเข้าใกล้ (ให้บ้านดูมีชีวิต ไม่ใช่หุ่นยืนนิ่ง) */
/* ซ่อน/คืนพ่อแม่ — ระหว่างตกแต่งบ้านต้องหายไปเหมือนตัวเด็กกับสัตว์เลี้ยง (ผู้ใช้สั่ง 2026-08-13)
   ไม่งั้นพ่อแม่เดินไปมาบังของที่กำลังจัด ทั้งที่ตัวเด็ก/สัตว์หายไปแล้ว ดูไม่เข้าพวกกัน */
function setParentsVisible(v){
  Object.keys(parentObjs).forEach(w=>{
    const o = parentObjs[w];
    if(o && o.g) o.g.visible = v;
    if(o && o.mk && !v) o.mk.open.visible = o.mk.done.visible = false;   /* ป้าย ! / ✓ เหนือหัวด้วย */
  });
}

function updateParents(dt, t){
  if(!FAMILY || hScene !== 'in' || hMode !== 'world') return;
  /* ตกแต่งอยู่ = หยุดทั้งการเดินและฟองคำพูด ไม่ใช่แค่ซ่อนตัว
     (ถ้าปล่อยให้เดินต่อ ฟองคำพูดจะลอยขึ้นมากลางจอโดยไม่มีใครอยู่ใต้ฟอง) */
  if(editMode) return;
  Object.keys(parentObjs).forEach(w=>{
    const o = parentObjs[w], g = o.g;
    if(!g) return;
    /* ⚠ `buildCharacter()` เก็บ rig ไว้ที่ **`g.userData` ตรงๆ** (`{rig, legs, arms, head}`)
       ไม่ใช่ `userData.anim` (อันนั้นของเฟอร์นิเจอร์/สัตว์) — เคยอ่านผิดแล้วท่าเดินไม่ทำงานทั้งชุด */
    const rg = g.userData;
    let moving = false;
    /* เด็กยืนใกล้ = หยุดคุยด้วย ไม่เดินหนี (เหมือน n.hold ของชาวบ้านในเมือง) */
    const near = charGroup && Math.hypot(charGroup.position.x - g.position.x,
                                         charGroup.position.z - g.position.z) < 2.2;
    if(near || o.busy > 0){
      if(o.busy > 0) o.busy -= dt;
    }else if(o.to){
      /* ก้าวเข้าหาจุดถัดไปในเส้นทาง */
      const dx = o.to.x - g.position.x, dz = o.to.z - g.position.z, d = Math.hypot(dx, dz);
      if(d < .06){ o.to = null; }
      else{
        const st = Math.min(d, PARENT_SPEED*dt);
        g.position.x += dx/d*st; g.position.z += dz/d*st;
        let want = Math.atan2(dx, dz), cur = g.rotation.y;
        while(want - cur > Math.PI) want -= Math.PI*2;
        while(want - cur < -Math.PI) want += Math.PI*2;
        g.rotation.y += (want-cur) * Math.min(1, dt*5);
        moving = true;
      }
    }else if(o.path && o.path.length){
      const tl = o.path.shift();
      o.to = {x: inWX(tl.x), z: inWZ(tl.z)};
    }else{
      o.wait -= dt;
      if(o.wait <= 0){
        if(o.actCat){                       /* ถึงที่หมายที่มีอุปกรณ์แล้ว → ลงมือทำกิจกรรม */
          const act = PARENT_ACTS[o.actCat];
          o.busy = 4 + Math.random()*4;
          o.actNow = o.actCat; o.actCat = null;
          if(!questPlayOpen()) parentBubble(w, act.emoji + ' ' + act[w]);
        }else{
          o.actNow = null;
          parentPickTarget(o);
          if(!o.path.length) o.wait = 1.5 + Math.random()*2;
        }
      }
    }
    /* ---- ท่าทาง ---- */
    if(rg && rg.legs && rg.arms){
      const k = Math.min(1, dt*8);
      if(moving){
        o.sw += dt * 7.2;
        const sN = Math.sin(o.sw) * .5;
        rg.legs[0].rotation.x = sN;  rg.legs[1].rotation.x = -sN;
        rg.arms[0].rotation.x = -sN*.7; rg.arms[1].rotation.x = sN*.7;
        rg.rig.position.y = Math.abs(Math.sin(o.sw))*.035;
      }else if(o.busy > 0 && o.actNow){
        /* กำลังทำกิจกรรม — **ท่าต่างกันตามชนิดงาน** (เฟส 4B · งานที่เฟส 4A ทิ้งไว้)
           ทำครัวคนไม้พาย · อ่านหนังสือยกมือค้างนิ่งๆ · ถูพื้นถูเร็ว · จัดของยกมือสลับข้าง
           ⚠ ตัวเลขคือ rotation.x ของแขน (ลบ = ยกไปข้างหน้า) ปรับแล้วต้องดูในฉากจริง อย่าเดา */
        const ps = PARENT_POSE[o.actNow] || PARENT_POSE.kitchen;
        const w2 = Math.sin(t * ps.spd + o.ph) * ps.amp;
        rg.legs.forEach(p => p.rotation.x += (0 - p.rotation.x) * k);
        rg.arms[0].rotation.x += ((ps.base + w2) - rg.arms[0].rotation.x) * k;
        rg.arms[1].rotation.x += ((ps.base + (ps.alt ? -w2 : w2)) - rg.arms[1].rotation.x) * k;
        rg.rig.position.y = Math.sin(t*.0045)*.02;
      }else{
        const idle = Math.sin(t*.0022 + o.ph) * .06;
        rg.legs.forEach(p => p.rotation.x += (0 - p.rotation.x) * k);
        rg.arms[0].rotation.x += ( idle - rg.arms[0].rotation.x) * k;
        rg.arms[1].rotation.x += (-idle - rg.arms[1].rotation.x) * k;
        rg.rig.position.y = Math.sin(t*.0021 + o.ph)*.022;
      }
    }
    if(near && charGroup){                   /* เด็กเข้ามาใกล้ → หันหน้าหา */
      const dx = charGroup.position.x - g.position.x, dz = charGroup.position.z - g.position.z;
      let want = Math.atan2(dx, dz), cur = g.rotation.y;
      while(want - cur > Math.PI) want -= Math.PI*2;
      while(want - cur < -Math.PI) want += Math.PI*2;
      g.rotation.y += (want - cur) * Math.min(1, dt*4);
    }
    o.bubbleT -= dt;
    if(o.bubbleT <= 0){
      o.bubbleT = 16 + Math.random()*14;
      if(!questPlayOpen() && !o.actNow) parentBubble(w, FAMILY.idleLine(w));
    }
  });
}
/* สถานะป้ายงานของพ่อแม่ — มีแค่คนที่วันนี้เป็นคนขอ อีกคนไม่มีป้าย (จะได้ไม่สับสนว่าใครมีงาน) */
function refreshParentMark(){
  if(!QUESTS || !FAMILY) return;
  const who = QUESTS.familyWho(), done = QUESTS.familyDone();
  Object.keys(parentObjs).forEach(w=>{
    const mk = parentObjs[w].mk;
    if(!mk) return;
    const mine = (w === who);
    mk.open.visible = mine && !done;
    mk.done.visible = mine && done;
  });
}
/* ป้ายลอยเหนือหัว หันเข้าหากล้องเสมอ + เด้งขึ้นลงเบาๆ (เหมือนป้ายของชาวบ้านในเมืองเป๊ะ) */
function updateParentMarks(t){
  const show = hScene === 'in' && hMode === 'world' && !editMode;
  Object.keys(parentObjs).forEach(w=>{
    const o = parentObjs[w], mk = o.mk;
    if(!mk || !o.g) return;
    if(!show){ mk.open.visible = mk.done.visible = false; return; }
    const y = 2.85 + Math.sin(t*.003 + o.ph)*.1;
    [mk.open, mk.done].forEach(m=>{
      m.position.set(o.g.position.x, y, o.g.position.z);
      m.rotation.copy(camera.rotation);
    });
  });
  if(show) refreshParentMark();
}
/* ฟองคำพูดเหนือหัวพ่อ/แม่ — ใช้ป้ายเดียวกับฟองของ NPC ในเมือง (#house-npc-bubble) */
function parentBubble(w, text){
  const o = parentObjs[w];
  if(!o || !o.g) return;
  const p = FAMILY.one(w);
  const el = $('house-npc-bubble');
  if(!el) return;
  showTalkBubble(el, 'fam-' + w, p.icon, p.name, text);
  parentTalk = {w, until: performance.now() + Math.max(3200, text.length * 120)};
}
let parentTalk = null;
/* ป้ายฟองคำพูดของพ่อแม่ลอยตามตำแหน่ง 3D (คู่กับ updateNpcLabels ของฝั่งเมือง) */
const _parV = new THREE.Vector3();
function updateParentLabels(){
  const el = $('house-npc-bubble');
  if(!el || !parentTalk) return;
  const o = parentObjs[parentTalk.w];
  if(!o || !o.g || hScene !== 'in' || hMode !== 'world' || performance.now() > parentTalk.until){
    parentTalk = null; el.classList.remove('on');
    return;
  }
  _parV.set(o.g.position.x, o.g.position.y + 2.5, o.g.position.z).project(camera);
  el.style.left = ((_parV.x+1)/2*window.innerWidth).toFixed(1) + 'px';
  el.style.top  = ((1-_parV.y)/2*window.innerHeight).toFixed(1) + 'px';
}
/* แตะตัวพ่อ/แม่ = **เดินไปหาก่อนแล้วค่อยคุย** (เหมือนแตะชาวบ้านในเมือง ผู้ใช้สั่ง 2026-08-09)
   ตะโกนคุยข้ามห้องแล้วดูไม่เป็นธรรมชาติ และเด็กไม่รู้ว่าตัวเองต้องเดินไปไหน */
function walkToParent(w){
  const o = parentObjs[w];
  if(!o || !o.g || hMode !== 'world' || editMode) return;
  o.busy = Math.max(o.busy, 14);       /* พ่อแม่ยืนรอให้เด็กเดินมาถึง ไม่เดินหนีระหว่างทาง */
  o.path = []; o.to = null;
  const gx = Math.round(o.g.position.x + (IN_W-1)/2), gz = Math.round(o.g.position.z + (IN_D-1)/2);
  const t = tileBesideTarget(gx, gz);
  if(!t){ tapParent(w); return; }      /* หาช่องยืนไม่ได้ (มุมอับ) → คุยตรงนั้นเลย ดีกว่าไม่มีอะไรเกิดขึ้น */
  walkTo(t.x, t.z, {action:{type:'parent', who:w, pos: tileWorld({x:gx, z:gz})}});
}
/* แตะตัวพ่อ/แม่ — วันนี้เป็นคนขอ = ยื่นงาน · ไม่ใช่ = พูดให้กำลังใจ/บอกใบ้ว่าอีกคนมีงาน */
function tapParent(w){
  if(!FAMILY || hMode !== 'world' || editMode) return;
  if(typeof playClick==='function') playClick();
  const p = FAMILY.one(w);
  const spec = QUESTS ? QUESTS.specForFamily() : null;
  const mine = spec && spec.who === w;
  if(mine && !spec.done){
    parentBubble(w, FAMILY.askLine(w));
    setTimeout(()=>{ if(houseOpen && hMode==='world' && !editMode && !questPlayOpen()) offerFamilyQuest(spec); }, 280);
    return;
  }
  /* ผู้ใช้สั่ง 2026-08-09: **แตะตัว = คุยเพื่อทำเควสต์เท่านั้น** ไม่มีการ์ดแต่งตัวเด้งมาแล้ว
     (การแต่งตัวย้ายไปปุ่มของตัวเองบน HUD) ⇒ ไม่มีงานก็แค่ฟองคำพูด ไม่มีกล่องอะไรมาบัง */
  if(mine && spec.done) parentBubble(w, FAMILY.thankLine(w));
  else parentBubble(w, spec && !spec.done ? FAMILY.hintLine(w) : FAMILY.idleLine(w));
}
/* ยื่นงานครอบครัว — ใช้การ์ด/เส้นทางเล่นชุดเดียวกับเควสต์ NPC ต่างแค่หัวการ์ดเป็นชื่อพ่อแม่ */
function offerFamilyQuest(spec){
  if(!QUESTS || !spec || spec.done) return;
  if(questInFlight(spec)) return;          /* งานครอบครัวที่เดินไปทำค้างอยู่ — ห้ามยื่นใหม่ทับ */
  if(hMode !== 'world' || editMode) return;
  if(window.HouseQB && window.HouseQB.isOpen()) return;
  const p = FAMILY.one(spec.who);
  closeQuestBoard();
  qzNpcId = null;
  qzShow();
  const who = $('hqz-who'); if(who) who.textContent = p.icon + ' ' + p.name;
  const s = $('hqz-sub'); if(s) s.textContent = 'งานของครอบครัววันนี้';
  const st = qzStage(); if(!st) return;
  const line = document.createElement('div');
  line.className = 'hqz-line';
  line.textContent = FAMILY.askLine(spec.who);
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn('ช่วยเลย! 💪', 'hqz-yes', ()=>{ if(typeof playClick==='function') playClick(); startQuest(spec); }));
  /* **ปฏิเสธได้เสมอ ไม่มีใครโกรธ** (กติกาเหล็กข้อ 2 · โทน "ขอความช่วยเหลือ" ไม่ใช่ "สั่ง") */
  row.appendChild(qzBtn('ไว้ก่อน', 'hqz-no', ()=>{
    if(typeof playClick==='function') playClick();
    closeQuestPanel();
    parentBubble(spec.who, 'ไม่เป็นไรเลยลูก ไว้ว่างค่อยมาช่วยนะ 😊');
  }));
  st.appendChild(line); st.appendChild(row);
  if(typeof playClick==='function') playClick();
}

/* ---------- แถบสรุปเควสต์ของวันนี้ (#house-quest-bar · ผู้ใช้สั่งเพิ่ม 2026-08-09) ----------
   บอกด้วยตัวเลขว่าวันนี้ยังเหลืองานกี่ชุด/ทำไปแล้วกี่ชุด · กดแล้วกางรายการว่าเหลืองานของใคร ร้านไหน
   ⚠ ค่าที่โชว์คำนวณจาก QUESTS.daySummary() ซึ่งอ่าน state ทุกครั้ง ⇒ **ห้ามเรียกทุกเฟรม**
     วาดใหม่เฉพาะตอนตัวเลขเปลี่ยนจริง (เทียบ key) เหมือนแถบสัตว์เลี้ยง */
let questBarKey = '';
function refreshQuestBar(){
  const b = $('house-quest-bar');
  if(!b) return;
  const want = !!(QUESTS && houseOpen && hMode === 'world' && !editMode);
  if(b.hidden === want) b.hidden = !want;
  /* ปุ่ม "เล่นในเมือง" (เฟส 11) อยู่แถวเดียวกัน โผล่/หายพร้อมกันเสมอ
     ⚠ โผล่เฉพาะฉากนอกบ้าน — มินิเกมกลุ่ม A ทุกตัวเล่นในเมือง ไม่ใช่ในบ้าน */
  { const pb = $('house-play-btn');
    if(pb){
      const pw = want && hScene === 'out' && !!window.HousePlay;
      if(pb.hidden === pw) pb.hidden = !pw;
      if(!pw && window.HousePlay && window.HousePlay.isOpen()) window.HousePlay.close();
      /* 📔 สมุดสะสมเปิดจากแผงกิจกรรม ⇒ ต้องหายพร้อมกันเมื่อออกจากฉากนอกบ้าน/เข้าโหมดตกแต่ง */
      if(!pw && window.HouseBook && window.HouseBook.isOpen()) window.HouseBook.close();
    } }
  if(!want) return;
  const sum = QUESTS.daySummary();
  const alert = QUESTS.starBonusReady();
  /* 🎯 **ตัวนับ ❗ นับเฉพาะ "งานหลัก" (กระดาน 5 + ครอบครัว 1 = 6 ชุด)** — เฟส 10 · ข้อ 45.6
     งานรอง (NPC 8 คน) เป็นของแถมที่ทำเพิ่มได้ **ไม่ค้างเป็นหนี้** เด็กเล็กจึงจบวันได้ที่ ~20 นาที
     ส่วน ✅ ยังนับรวมทุกชุด เพื่อให้เด็กที่เล่นเยอะเห็นผลงานเต็มของตัวเอง */
  const key = sum.mainLeft + '/' + sum.sideLeft + '/' + sum.done + '/' + alert;
  if(key === questBarKey) return;
  questBarKey = key;
  const l = $('hqbar-left'), sd = $('hqbar-side'), d = $('hqbar-done');
  /* ⚠ ตัวเลขเป็น textContent (ปลอดภัย) แต่ไอคอนต้องเป็น element แยก ⇒ ประกอบเอง */
  const chip = (el, ico, emoji, n)=>{
    if(!el) return;
    el.innerHTML = '';
    const ic = document.createElement('span');
    ic.className = 'hqb-chipic';
    ic.innerHTML = hIcon(ico, emoji, 15);
    el.appendChild(ic);
    el.appendChild(document.createTextNode(' ' + n));
  };
  chip(l,  'ui-alert', '❗', sum.mainLeft);
  chip(sd, 'ui-star',  '⭐', sum.sideLeft);
  if(sd) sd.hidden = !sum.sideLeft;
  chip(d,  'ui-check', '✅', sum.done);
  if(l) l.title = 'งานสำคัญของวันนี้ที่ยังไม่ได้ทำ';
  if(sd) sd.title = 'งานช่วยเพื่อนบ้าน ทำเพิ่มได้ ไม่ทำก็ได้';
  if(d) d.title = 'ทำเสร็จแล้ววันนี้';
  /* มีโบนัสดาวรอรับ → ขึ้นไอคอนของขวัญ + แถบเด้งเรียกให้เด็กกดเข้ามารับ */
  const al = $('hqbar-alert');
  if(al){
    if(!al.querySelector('svg')) al.innerHTML = hIcon('ui-gift', '🎁', 16);
    al.hidden = !alert;
  }
  b.classList.toggle('hqbar-gift', !!alert);
  /* ทำ**งานหลัก**ครบแล้ว = เปลี่ยนโทนเป็นเขียว ให้เด็กภูมิใจว่า "วันนี้ครบแล้ว" */
  b.classList.toggle('hqbar-clear', sum.mainLeft === 0);
}
/* แปลงรายการดิบจาก engine → ชื่อคน/ชื่อร้านที่เด็กอ่านรู้เรื่อง */
function questItemInfo(it){
  if(it.src === 'board'){
    /* 🧑 งานบนกระดานก็มี "คนฝากงาน" จริงเสมอ — โชว์ตัวเขาเหมือนหน้าอื่นๆ (ผู้ใช้สั่ง 2026-08-22)
       ของเดิมขึ้นไอคอนกระดานเหมือนกันหมดทั้ง 5 แถว เด็กแยกไม่ออกว่าแถวไหนเป็นงานของใคร */
    const bd = it.npc ? npcDefById(it.npc) : null;
    if(bd) return {icon: bd.icon || '🙂', ico: bd.id || '', name: bd.name || 'ชาวบ้าน',
                   place:'📋 ฝากไว้ที่กระดานเควสต์'};
    return {icon:'📋', ico:'ui-board', name:'กระดานเควสต์', place:'ข้างน้ำพุกลางหมู่บ้าน'};
  }
  if(it.src === 'family'){
    const p = FAMILY ? FAMILY.one(it.who) : null;
    return {icon: p ? p.icon : '👪', ico: 'fam-' + (it.who || 'mom'),
            name: p ? p.name : 'ครอบครัว', place:'ที่บ้านของหนู'};
  }
  const d = npcDefById(it.id) || {};
  /* หาชื่อสถานที่ตามลำดับ: ล็อตที่ผูกไว้ในผัง → ล็อตที่ยืนอยู่/ใกล้ที่สุดจากพิกัดจริง → ย่านจากพิกัด
     ⚠ **NPC ส่วนใหญ่ไม่มีฟิลด์ `lot`** (แม่ค้ารถเข็น/นักวิทย์/ชาวนา ฯลฯ) ถ้าดูแค่ `d.lot`
       รายการจะขึ้นว่า "ในหมู่บ้าน" เกือบทั้งหน้า = ไม่ตอบโจทย์ "ร้านอะไร" ที่ผู้ใช้ขอ */
  let lot = d.lot ? LOT_BY_ID[d.lot] : null;
  if(!lot && d.x != null){
    lot = lotAt(d.x, d.z, 0) || lotAt(d.x, d.z, 3);   /* ยืนในล็อต หรือยืนหน้าร้านในระยะ 3 ช่อง */
  }
  return {icon: d.icon || '🙂', ico: d.id || '', name: d.name || 'ชาวบ้าน',
          place: lot ? ((lot.icon ? lot.icon + ' ' : '') + lot.name) : zoneNameAt(d.x, d.z)};
}
/* ย่านของคนที่ไม่ได้ยืนติดล็อตไหนเลย
   ⚠ **ห้ามเดากล่องพิกัดเอง** (กติกาเดียวกับตอนแก้ผังเมือง) — รอบแรกผมเดาเองแล้วแม่ค้าตลาด
     ขึ้นว่า "ริมหาด" เพราะตลาดจริงอยู่ x11-17/z56-62 ไม่ใช่ที่เดาไว้
   ⇒ ใช้ของที่ผังประกาศไว้จริงเท่านั้น: MARKET (ลานตลาดรถเข็น) กับ FARM_PLOTS (แปลงนา) */
function zoneNameAt(x, z){
  if(x == null || z == null) return 'ในหมู่บ้าน';
  if(typeof MARKET !== 'undefined' && MARKET && inBox(MARKET, x, z, 2)) return '🛒 ตลาดรถเข็น';
  if(FARM_PLOTS.some(p => inBox(p, x, z, 4))) return '🌾 ไร่นา';
  return 'ในหมู่บ้าน';
}
function questSummaryOpen(){ const e = $('house-qsum'); return !!e && !e.hidden; }
function closeQuestSummary(){ const e = $('house-qsum'); if(e) e.hidden = true; }
function openQuestSummary(){
  if(!QUESTS || hMode !== 'world' || editMode) return;
  if(SHOP) SHOP.close();
  closeQuestPanel(); closeQuestBoard();
  if(window.HouseQB) window.HouseQB.close();
  if(window.HouseDev) window.HouseDev.close();
  const e = $('house-qsum'); if(e) e.hidden = false;
  renderQuestSummary();
}
/* หมุดโบนัสบนหลอดดาว — บอกว่าทำถึงตรงไหนได้เงินเพิ่ม และกดรับได้เมื่อถึงเกณฑ์
   (ผู้ใช้สั่งย้ายจากบล็อกปุ่มแยกมาไว้บนหลอดเลย 2026-08-09 · เงินจ่ายผ่าน awardCoins() จุดเดียว) */
function renderStarBonus(){
  if(!QUESTS) return;
  const b = QUESTS.starBonus();
  [['half', 'hqsum-pin-half'], ['full', 'hqsum-pin-full']].forEach(([k, id])=>{
    const el = $(id);
    if(!el) return;
    const it = b[k];
    /* ตำแหน่งหมุด = สัดส่วนดาวที่ต้องได้ (ครึ่งทาง ~50% · เต็ม 100%) */
    el.style.left = (b.starsMax ? Math.round(it.need / b.starsMax * 100) : 0) + '%';
    el.className = 'hqsum-pin' + (it.claimed ? ' taken' : (it.ready ? ' ready' : ''));
    /* หมุด = **เหรียญ + จำนวนเงิน** (บอกว่าถึงตรงนี้แล้วได้เงิน) และ **จำนวนดาวที่ต้องได้อยู่ใต้เหรียญ**
       เหรียญวาดด้วย CSS (.hs-coin) ไม่ใช้ emoji 🪙 — บางเครื่องไม่มี glyph ตัวนั้น (กับดักเดิม) */
    el.innerHTML = '<span class="hqsum-pincoin">'
                 + (it.claimed ? '✓' : '<i class="hs-coin"></i>' + it.coins) + '</span>'
                 + '<span class="hqsum-pinneed">' + it.need
                 + '<span class="hqs-ic">' + hIcon('ui-star', '⭐', 13) + '</span></span>';
    el.disabled = !it.ready;
    el.title = it.claimed ? ('รับโบนัส ' + it.coins + ' บาทไปแล้ว')
             : it.ready ? ('กดรับโบนัส ' + it.coins + ' บาท')
                        : ('ได้ ' + it.need + ' ดาว รับโบนัส ' + it.coins + ' บาท');
    el.onclick = it.ready ? ()=>{
      if(typeof playClick==='function') playClick();
      const got = QUESTS.claimStarBonus(k);
      if(!got) return;
      awardCoins(got);
      if(typeof playCongrats==='function') playCongrats();
      if(typeof showToast==='function') showToast('🎁', 'ได้โบนัสดาว ' + got + ' บาท! เก่งมากเลย');
      questBarKey = '';
      renderQuestSummary();
    } : null;
  });
}
/* ดาว 1 ดวง — tone 0 = ยังไม่ได้ (จาง) · 1-3 = สีตามจำนวนดาวที่ทำได้ทั้งชุด */
function starSvg(tone){
  return '<svg class="hqsum-star ' + (tone ? 'on tone' + tone : 'off') + '" viewBox="0 0 24 24" aria-hidden="true">'
       + '<path d="M12 3.1 14.75 8.9 21.1 9.8 16.5 14.25 17.6 20.55 12 17.55 6.4 20.55 7.5 14.25 2.9 9.8 9.25 8.9z"/></svg>';
}
function renderQuestSummary(){
  const e = $('house-qsum');
  if(!e || e.hidden || !QUESTS) return;
  /* หัวข้อหน้า + ป้ายหลอดดาวเขียนไว้ใน index.html เป็น emoji (ตอนโหลดหน้ายังไม่มี HouseIcons)
     ⇒ พอเปิดหน้านี้จริงค่อยเปลี่ยนเป็นไอคอน SVG ทับ */
  {
    const hd = e.querySelector('.hqz-who');
    if(hd && !hd.querySelector('svg'))
      hd.innerHTML = '<span class="hqs-ic">' + hIcon('ui-board', '📋', 22) + '</span><span>เควสต์วันนี้</span>';
    const lb = e.querySelector('.hqsum-starlab');
    if(lb && !lb.querySelector('svg'))
      lb.innerHTML = '<span class="hqs-ic">' + hIcon('ui-star', '⭐', 20) + '</span><span>ดาววันนี้</span>';
  }
  const sum = QUESTS.daySummary();
  const cnt = $('hqsum-count');
  /* นับ "เหลือ" จากงานหลักเท่านั้น (เฟส 10 · ข้อ 45.6) — งานรองไม่ใช่หนี้ */
  if(cnt) cnt.textContent = 'เหลือ ' + sum.mainLeft + ' · เสร็จ ' + sum.done;
  /* แถบดาวของวันนี้ด้านบน — บอกว่าได้ไปแล้วกี่ดาวจากเต็มเท่าไหร่ + หลอดความคืบหน้า
     (ดาวสะสมทั้งชีวิตอยู่ที่กระดานเควสต์ ไม่ใช่ตรงนี้ — ตรงนี้คือ "วันนี้" เท่านั้น) */
  const stTxt = $('hqsum-startxt'), stFill = $('hqsum-starfill');
  if(stTxt) stTxt.textContent = sum.stars + ' / ' + sum.starsMax;
  if(stFill) stFill.style.width = (sum.starsMax ? Math.round(sum.stars / sum.starsMax * 100) : 0) + '%';
  const sub = $('hqsum-sub');
  /* ข้อความเชียร์ 3 ระดับ (เฟส 10 · ข้อ 45.6) — **เป็นคำแนะนำเท่านั้น ไม่ได้กั้นสิทธิ์ใคร**
     งานหลักยังไม่ครบ → ชวนไปทำต่อ · ครบแล้วแต่ยังมีงานรอง → ชมก่อน แล้วบอกว่ามีของแถมให้เล่นต่อ
     ครบหมดจริงๆ → ชมเต็มที่ */
  if(sub) sub.textContent = sum.mainLeft
    ? 'วันนี้ยังมีคนรอให้หนูไปช่วยอยู่นะ'
    : (sum.sideLeft
        ? 'เก่งมาก! งานสำคัญของวันนี้ครบแล้ว 🎉 ถ้ายังอยากเล่นต่อ ในเมืองมีคนรออีก ' + sum.sideLeft + ' คนนะ'
        : 'เก่งมาก! วันนี้ช่วยครบทุกคนแล้ว พรุ่งนี้มีงานใหม่มาอีกนะ');
  renderStarBonus();
  const list = $('hqsum-list');
  if(!list) return;
  list.innerHTML = '';
  /* 2 กลุ่ม: ยังไม่ได้ทำ (❗) มาก่อนเสมอ แล้วต่อด้วยที่ทำเสร็จแล้ว (✅) ให้เด็กเห็นความคืบหน้าของตัวเอง */
  const sec = (label, arr, done)=>{
    if(!arr.length) return;
    const h = document.createElement('div');
    h.className = 'hqsum-sec';
    /* ⚠ ป้ายหัวข้อรับ "id ไอคอน + ข้อความ" แยกกัน — ห้ามต่อ emoji เข้ากับข้อความเหมือนเดิม */
    h.innerHTML = '<span class="hqs-ic">' + hIcon(label[0], label[1], 20) + '</span>'
                + '<span>' + label[2] + ' (' + arr.length + ')</span>';
    list.appendChild(h);
    arr.forEach(it=>{
      const info = questItemInfo(it);
      const row = document.createElement('div');
      row.className = 'hqsum-row' + (done ? ' hqsum-ok' : '');
      /* ดาวรายเควสต์: ทำแล้วโชว์ที่ได้จริง (⭐ เต็ม + ☆ ที่ยังไม่ได้) · ยังไม่ทำโชว์ ☆☆☆ จางๆ
         ⇒ เด็กเห็นว่าชุดไหนยังทำได้ดีกว่านี้ โดยไม่ต้องอ่านตัวเลข */
      const n = done ? Math.max(0, Math.min(3, it.stars | 0)) : 0;
      /* ดาววาดเป็น SVG **เปลี่ยนสีตามจำนวนที่ทำได้** (ผู้ใช้สั่ง 2026-08-09 · ไม่มีตัวเลขกำกับแล้ว)
         1 ดาว = ทองแดง · 2 ดาว = ส้ม · 3 ดาว = ทอง ⇒ เด็กแยกออกด้วยสีตั้งแต่เหลือบเห็น ไม่ต้องนับ
         ⚠ ใช้ emoji ⭐ ไม่ได้เพราะสีตายตัวเปลี่ยนไม่ได้ (และบางเครื่องไม่มี glyph ☆) */
      const star = '<span class="hqsum-stars' + (done ? '' : ' hqsum-stars-todo') + '">'
                 + [0,1,2].map(i => starSvg(i < n ? n : 0)).join('') + '</span>';
      row.innerHTML = '<span class="hqsum-mark">'
                    + hIcon(done ? 'ui-check' : 'ui-alert', done ? '✅' : '❗', 20) + '</span>'
                    + '<span class="hqsum-ic">' + hIcon(info.ico, info.icon, 22) + '</span>'
                    + '<span class="hqsum-name">' + info.name + '</span>'
                    + star
                    + '<span class="hqsum-place">' + info.place + '</span>';
      list.appendChild(row);
    });
  };
  /* เฟส 10 (ข้อ 45.6) — แยก **งานสำคัญของวันนี้** (กระดาน + ครอบครัว) ออกจาก **งานช่วยเพื่อนบ้าน**
     งานหลักที่ยังไม่ทำมาก่อนเสมอ แล้วค่อยงานรอง แล้วปิดท้ายด้วยที่ทำเสร็จแล้ว (ขีดฆ่า ไม่ซ่อนทิ้ง)
     ⚠ ห้ามซ่อนงานรองที่ยังไม่ทำ — เด็กที่อยากเล่นต่อต้องหาเจอว่าเหลือใครบ้าง (ห้ามกั้นสิทธิ์) */
  sec(['ui-alert', '❗', 'งานสำคัญของวันนี้'],  sum.items.filter(x => !x.done &&  x.main), false);
  sec(['ui-star', '⭐', 'ช่วยเพื่อนบ้าน (ทำเพิ่มได้)'], sum.items.filter(x => !x.done && !x.main), false);
  sec(['ui-check', '✅', 'ทำเสร็จแล้ว'], sum.items.filter(x => x.done), true);
}
/* ---------- แถบสถานะเพื่อนตัวน้อย ใต้ชื่อเด็ก (#house-pet-bar) ----------
   ชื่อสัตว์ · ไอคอนอาหารที่น้องกิน · หลอดความอิ่ม · ปุ่มให้อาหาร — โผล่เฉพาะตอนมีสัตว์เลี้ยงจริง
   ⚠ **เช็คจาก hPet.group ไม่ใช่ loadHouseData()** เพราะถูกเรียกทุกเฟรม (JSON.parse ทุกเฟรม = กินเฟรมเรต)
     ส่วนเนื้อในแถบ (ชื่อ/อาหาร/หลอด) วาดใหม่แค่ตอนค่าเปลี่ยนจริง ผ่าน petBarPaint() */
/* ปุ่ม ← ในโหมดบ้าน: **โผล่แค่ 3 หน้าเท่านั้น — แต่งตัว · สัตว์เลี้ยง · แต่งบ้าน** (ผู้ใช้สั่ง 2026-08-09)
   ที่เหลือซ่อนหมด รวมถึงตอนเปิดร้าน/การ์ดเควสต์/กระดาน/หน้าเทส เพราะกล่องพวกนั้น **มีปุ่มปิดของตัวเอง
   อยู่ในกล่องแล้วทุกอัน** (ออกจากร้าน / ปิด / ปิดกระดาน) การมีปุ่มซ้อนอีกปุ่มมุมจอทำให้เด็กสับสน
   ส่วนทางออกจากโหมดบ้านย้ายไปปุ่ม "ออกจากบ้าน" ในเมนูเฟือง
   ⚠ **ห้ามลบ element `#house-back` และห้ามลบ logic ปิดแผงใน handler ของมัน** — ชุดเทสยิง
     dispatchEvent ใส่ id นี้อยู่ และปุ่มยังทำหน้าที่ "ยกเลิก" จริงในโหมดแต่งตัว/แต่งบ้าน */
/* ปุ่ม "แต่งตัวพ่อแม่" — โผล่เฉพาะตอนอยู่ในบ้าน (พ่อแม่อยู่แต่ชั้นใน ไม่ออกไปในเมือง)
   ปุ่มเดียวเข้าหน้าแต่งตัว แล้วค่อยเลือกพ่อ/แม่จากแท็บข้างใน (ผู้ใช้สั่ง 2026-08-09) */
function refreshParentBtn(){
  const b = $('house-parent-btn');
  if(!b) return;
  const want = !!(FAMILY && houseOpen && hScene === 'in' && hMode === 'world' && !editMode);
  if(b.hidden !== want) return;
  b.hidden = !want;
}
/* ---------- ปุ่มชุด "ของที่บ้าน" (สัตว์เลี้ยง · แต่งตัว · แต่งบ้าน) ----------
   ผู้ใช้สั่ง 2026-08-14: ย้ายไปอยู่ **ข้างปุ่มกล้องมุมขวาบน** และ **โผล่เฉพาะตอนอยู่ที่บ้าน**
   "ที่บ้าน" = อยู่ในตัวบ้าน (hScene 'in') **หรือ** ยืนอยู่ในกรอบบริเวณบ้าน (inHomeZone)
   ⚠ ที่ตรงนี้เขียนทับค่าที่ฟังก์ชันอื่นตั้งไว้ได้ เพราะถูกเรียกทุกเฟรมจาก updatePetLabels()
     ⇒ จุดที่สั่ง `.hidden = false` ตอนกลับเข้าโหมดเดิน (exitCreator / exitPetMode / startHouseGame)
        ยังต้องมีอยู่ ไม่ต้องลบ แต่ค่าสุดท้ายมาจากที่นี่เสมอ
   ⚠ ปุ่มแต่งตัวพ่อแม่ (#house-parent-btn) มีเงื่อนไขเข้มกว่า (ต้องอยู่ "ในตัวบ้าน") อยู่ที่
     refreshParentBtn() ของมันเอง จึงไม่รวมในลิสต์นี้ */
const HOME_BTN_IDS = ['house-pet-btn', 'house-edit-btn', 'house-decorate-btn'];
function atHomeNow(){
  if(!houseOpen) return false;
  if(hScene === 'in') return true;
  return !!inHomeZone(hChar.tile.x, hChar.tile.z);
}
/* 📷⚙️ ปุ่มกล้อง + ปุ่มเฟืองมุมขวาบน — **ซ่อนตอนเปิดแผงเต็มจอ** (ผู้ใช้สั่ง 2026-08-17)
   หน้าแต่งตัว / หน้าสัตว์เลี้ยงของหนู / โหมดตกแต่งบ้าน มีแผงควบคุมของตัวเองเต็มจออยู่แล้ว
   2 ปุ่มนี้ลอยทับอยู่ข้างบนโดยไม่ได้ช่วยอะไรในหน้านั้นเลย แถมเด็กเผลอกดแล้วหลุดจากงานที่ทำค้างไว้
   ⚠ **ต้องเรียกทุกจุดที่เปิด/ปิดแผง** ไม่งั้นปุ่มหายค้างหลังออกจากหน้า (มี 5 จุดในไฟล์นี้)
   ⚠ ต้องพับลิ้นชักตั้งค่าที่กางค้างอยู่ด้วย ไม่งั้นแถวปุ่มยังลอยอยู่ทั้งที่ปุ่มเฟืองหายไปแล้ว */
const CHROME_BTN_IDS = ['house-photo-btn', 'house-ctrl-gear'];
function panelOpenNow(){
  const c = $('house-creator'), p = $('house-pet-picker');
  return !!((c && !c.hidden) || (p && !p.hidden) || editMode);
}
function refreshChromeBtns(){
  const hide = panelOpenNow();
  CHROME_BTN_IDS.forEach(id=>{ const b = $(id); if(b) b.hidden = hide; });
  if(hide){
    const l = $('house-ctrl-list'); if(l) l.hidden = true;
    const g = $('house-ctrl-gear'); if(g) g.setAttribute('aria-expanded', 'false');
  }
}
function refreshHomeBtns(){
  const want = !!(atHomeNow() && hMode === 'world' && !editMode);
  HOME_BTN_IDS.forEach(id=>{ const b = $(id); if(b && b.hidden === want) b.hidden = !want; });
  /* บอก CSS ว่าตอนนี้แถวปุ่มมุมขวาบนยาวขึ้น ⇒ กันแถวชื่อเด็กไหลไปชน (ดู .house-at-home ใน style.css) */
  document.body.classList.toggle('house-at-home', want);
}
function refreshBackBtn(){
  const b = $('house-back');
  if(!b) return;
  const want = !!(houseOpen && (hMode === 'creator' || hMode === 'pet' || editMode));
  if(b.hidden !== want) return;
  b.hidden = !want;
}
let petBarKey = '';
/* ---------- แถบเพื่อนตัวน้อย ----------
   🔒 **โชว์เสมอตอนเดินเล่น** (ผู้ใช้สั่ง 2026-08-14) — ยังไม่มีสัตว์ก็ต้องเห็นแถบ แต่เป็น
   **สถานะล็อกรูปกุญแจ** เพื่อบอกเด็กว่า "ตรงนี้มีของรออยู่ ไปรับเลี้ยงเพื่อนก่อนนะ"
   (ของเดิมซ่อนทั้งแถบ ⇒ เด็กที่ยังไม่มีสัตว์ไม่มีทางรู้เลยว่ามีระบบนี้อยู่)
   ⚠ แถบล็อกต้อง **กดได้** และบอกทางไปร้านสัตว์เลี้ยง ไม่ใช่กดแล้วเงียบ */
function refreshPetBar(){
  const bar = $('house-pet-bar');
  if(!bar) return;
  const on = !!(houseOpen && hMode === 'world' && !editMode);
  const has = !!(PETCARE && hPet.group && hPet.cfg);
  if(bar.hidden === on) bar.hidden = !on;
  bar.classList.toggle('hpb-locked', on && !has);
  if(!on) return;
  if(has) petBarPaint(); else petBarPaintLocked();
}
/* สถานะล็อก: กุญแจ + ข้อความชวนไปรับเลี้ยง (ซ่อนหลอดความอิ่ม/ไอคอนอาหารที่ยังไม่มีความหมาย) */
function petBarPaintLocked(){
  if(petBarKey === 'locked') return;          /* ค่าเดิม ไม่ต้องแตะ DOM ซ้ำทุกเฟรม */
  petBarKey = 'locked';
  const nm = $('hpb-pet');
  if(nm) nm.textContent = 'ยังไม่มีเพื่อนตัวน้อย';
  const lb = $('hpb-feed-label');
  if(lb) lb.textContent = 'ไปรับเลี้ยง';
  const bar = $('house-pet-bar');
  if(bar) bar.classList.remove('hpb-warn');
  const btn = $('hpb-feed');
  if(btn){ btn.hidden = false; btn.classList.remove('hpb-feed-sick'); }
}
function petBarPaint(){
  if(!hPet.cfg) return;
  if(petBarKey === 'locked') petBarKey = '';   /* เพิ่งรับเลี้ยงมา — บังคับให้วาดใหม่ทั้งแถบ */
  const full = petCareHud.full, sick = petCareHud.sick;
  const fid = PETCARE.foodForPet(hPet.cfg.type);
  const left = PETCARE.meals(fid);
  /* ⚠ เฟส 12: ต้องมี happy/dirty อยู่ในกุญแจแคชด้วย ไม่งั้นหลอดความสุขจะไม่มีวันวาดใหม่เลย */
  const happy = petCareHud.happy, dirty = petCareHud.dirty, nap = !!hPet.restLonely;
  const key = hPet.cfg.type + '|' + hPet.cfg.name + '|' + full + '|' + sick + '|' + left
              + '|' + happy + '|' + dirty + '|' + nap;
  if(key === petBarKey) return;               /* ค่าเดิม ไม่ต้องแตะ DOM ซ้ำทุกเฟรม */
  petBarKey = key;
  const info = petTypeInfo(hPet.cfg.type);
  const nm = $('hpb-pet');
  if(nm) nm.textContent = info.emoji + ' ' + hPet.cfg.name;
  const f = PETCARE.FOOD.filter(x => x.id === fid)[0];
  const ic = $('hpb-food-ic');
  if(ic) ic.innerHTML = f ? hIcon('food-' + f.id, f.emoji, 22) : '';
  const lf = $('hpb-left');
  if(lf) lf.textContent = '×' + left;
  const fd = $('hpb-food');
  if(fd){
    fd.title = f ? ('น้องกิน' + f.name + ' · เหลือ ' + left + ' มื้อ') : '';
    fd.classList.toggle('hpb-food-out', left <= 0);   /* หมดแล้ว = จางลง เตือนให้ไปซื้อเพิ่ม */
  }
  const fill = $('hpb-fill');
  if(fill){
    /* ป่วย = หลอดว่างสีเทา ไม่ใช่สีแดงน่ากลัว (ธีมเด็ก ห้ามดูน่ากลัว) */
    fill.style.width = (sick ? 0 : Math.max(4, full)) + '%';
    fill.className = 'hpb-fill' + (sick ? ' hpb-sick' : full < 25 ? ' hpb-low' : full < PETCARE.LOW_AT ? ' hpb-mid' : '');
  }
  /* หลอดความสุข (เฟส 12) — ต่ำกว่า SLEEP_AT = น้องไปงีบในบ้าน จึงทำสีจืดลงให้เด็กเห็นสาเหตุ */
  const hf = $('hpb-happy');
  if(hf){
    hf.style.width = Math.max(4, happy) + '%';
    hf.className = 'hpb-fill hpb-fill-h'
      + (happy < PETCARE.SLEEP_AT ? ' hpb-low' : happy < 55 ? ' hpb-mid' : '');
  }
  /* ป้ายบอกเหตุ 1 ตัวเท่านั้น เรียงตามความเร่งด่วน: กำลังงีบ > ตัวเลอะ */
  const flag = $('hpb-flag');
  if(flag){
    const f = nap ? '💤' : (dirty ? '🫧' : '');
    flag.textContent = f;
    flag.title = nap ? 'กำลังงีบอยู่ ลูบหัวหรืออาบน้ำให้หน่อยนะ' : (dirty ? 'ตัวเลอะแล้ว อาบน้ำให้หน่อยนะ' : '');
    flag.hidden = !f;
  }
  const bar = $('house-pet-bar');
  if(bar) bar.classList.toggle('hpb-warn', sick || full < PETCARE.LOW_AT);
  /* 🍽️ ปุ่มให้อาหารย้ายไปเมนูฟองแล้ว — แถบนี้เหลือหน้าที่บอกสถานะอย่างเดียว
     ปุ่มในแถบถูกซ่อนเมื่อมีสัตว์แล้ว (เหลือไว้เฉพาะสถานะล็อก = "ไปรับเลี้ยง") */
  const btn = $('hpb-feed');
  if(btn){ btn.hidden = true; btn.classList.remove('hpb-feed-sick'); }
}
/* ---------- คุณหมอ/พยาบาล: การ์ดรักษาสัตว์ป่วย (ข้อ 18.4) ----------
   เงินไม่พอ **ห้ามไล่กลับ** ต้องมีทางไปต่อเสมอ = รับงานช่วยคุณหมอแทนค่ารักษา (กติกาเหล็กข้อ 1) */
function offerCure(npcDef){
  if(!PETCARE || !PETCARE.isSick()) return false;
  if(hMode !== 'world' || editMode) return false;
  const d = loadHouseData() || {};
  if(!d.pet) return false;
  closeQuestBoard();
  qzNpcId = npcDef.id;                        /* คุณหมอต้องยืนอยู่กับเด็กจนกว่าจะรักษาเสร็จ/กดไว้ก่อน */
  qzShow();
  setIconName($('hqz-who'), npcDef.id, npcDef.icon || '🩺', npcDef.name);
  const s = $('hqz-sub'); if(s) s.textContent = 'รักษาเพื่อนตัวน้อย';
  const st = qzStage(); if(!st) return true;
  const line = document.createElement('div');
  line.className = 'hqz-line';
  const enough = (window.OwlCoins ? window.OwlCoins.get() : 0) >= PETCARE.CURE_COST;
  line.textContent = enough
    ? (d.pet.name + 'ไม่สบายนะ เดี๋ยวหมอรักษาให้เอง ค่ารักษา ' + PETCARE.CURE_COST + ' บาทจ้ะ')
    : (d.pet.name + 'ไม่สบายนะ บาทยังไม่พอก็ไม่เป็นไรเลย มาช่วยหมอทำงานแทนค่ารักษาก็ได้จ้ะ');
  const row = document.createElement('div'); row.className = 'hqz-row';
  row.appendChild(qzBtn(enough ? ('รักษาเลย 🩺 ' + PETCARE.CURE_COST) : 'ช่วยคุณหมอทำงาน 💪', 'hqz-yes', ()=>{
    if(typeof playClick==='function') playClick();
    const r = PETCARE.cure();
    if(r === 'cured'){
      curedCelebrate(d.pet.name);
      closeQuestPanel();
    }else if(r === 'quest'){
      /* รับปากช่วยงานแล้ว → เปิดงานของคนนี้ให้เล่นต่อทันที เล่นจบเมื่อไหร่น้องหายป่วยเอง */
      const spec = QUESTS ? QUESTS.specForNpc(npcDef.id) : null;
      if(spec && !spec.done){ startQuest(spec); }
      else{
        closeQuestPanel();
        if(typeof showToast==='function') showToast('💪', 'ทำภารกิจให้จบสัก 1 งาน แล้วน้องจะหายป่วยนะ');
      }
    }
  }));
  row.appendChild(qzBtn('ไว้ก่อน', 'hqz-no', ()=>{ if(typeof playClick==='function') playClick(); closeQuestPanel(); }));
  st.appendChild(line); st.appendChild(row);
  if(typeof playClick==='function') playClick();
  return true;
}
function curedCelebrate(name){
  petCareHud.t = 0;                 /* หายป่วยแล้ว แถบสถานะต้องเปลี่ยนทันที ไม่ใช่ค้างว่า "ไม่สบาย" */
  petCareHud.sick = false;
  if(hPet.rest) petLeaveHouse(true);
  petHappy(1.6, true);
  petBubble('💖');
  if(typeof showToast==='function') showToast('🩺', name + ' หายป่วยแล้ว! กลับมาวิ่งเล่นได้เหมือนเดิม');
  if(typeof playCongrats==='function') playCongrats();
  if(charGroup) for(let i=0; i<10; i++)
    spawnParticle(charGroup.position.x + (Math.random()-.5)*1.2, 1.5 + Math.random()*1.2,
                  charGroup.position.z + (Math.random()-.5)*.9, i%2 ? 0xff8fb3 : 0xfff1a8);
}

/* ---------- แผงเลือกสัตว์เลี้ยง (hMode 'pet') — reuse แท่นกลม/กล้อง/ปุ่มหมุนของ creator ---------- */
let petPreview = null, petPickerType = null, petPickerColor = 0, petNameDirty = false;
function rebuildPetPreview(){
  if(petPreview){ scene.remove(petPreview); disposeGroup(petPreview); }
  /* ⚠ ส่ง collar เข้าไปด้วย — ไม่งั้นพรีวิวจะไม่โชว์ปลอกคอที่เด็กเพิ่งเลือกในแถวข้างล่าง
     (buildPet อ่านจาก PETCARE เองอยู่แล้ว แต่ส่งตรงชัดกว่าและใช้ตอนยังไม่มีน้องได้ด้วย) */
  petPreview = buildPet(petPickerType, petPickerColor,
                        {collar: PETCARE ? PETCARE.collar() : undefined});
  petPreview.scale.setScalar(3);          /* สัตว์ตัวจิ๋ว ขยายให้เต็มเฟรมพรีวิวพอๆ ตัวละคร */
  petPreview.rotation.y = creatorState.rotY;
  scene.add(petPreview);
}
/* ---------- สิทธิ์สัตว์เลี้ยง (เฟส 3A) ----------
   ก่อนเฟส 3 สัตว์ทุกตัวเลือกได้ฟรี ตอนนี้ต้องซื้อจากร้านสัตว์เลี้ยงก่อน
   ⚠ ถ้าไม่มี SHOP (โหลดไม่สำเร็จ) ให้ถือว่า "มีสิทธิ์ทุกตัว" — ห้ามให้เด็กเข้าไม่ถึงเพื่อนตัวน้อยเพราะไฟล์ร้านพัง */
function petOwned(type){ return !SHOP || SHOP.ownsPet(type); }
function petColorOwned(type, i){ return !SHOP || SHOP.ownsPetColor(type, i); }
function petPriceOf(type){ return SHOP ? SHOP.pricePet(type) : 0; }
function anyPetOwned(){ return PET_TYPES.some(p => petOwned(p.id)); }
/* ตัวที่จะให้หน้าเลือกสัตว์เปิดมาชี้ไว้ — ของที่มีอยู่แล้วก่อน ไม่งั้นเอาตัวแรกที่ซื้อไว้ */
function firstOwnedPet(){
  const p = PET_TYPES.filter(x => petOwned(x.id))[0];
  return p ? p.id : 'dog';
}
function toShopForPet(info){
  if(typeof showToast==='function')
    showToast('🐾', 'ยังไม่มี' + info.label + ' ไปซื้อที่ร้านสัตว์เลี้ยง 🐾 กลางเมืองก่อนนะ (' + petPriceOf(info.id) + ' บาท)');
}
function buildPetColorChips(){
  const wrap = $('house-pet-colors');
  wrap.innerHTML = '';
  const info = petTypeInfo(petPickerType);
  info.colors.forEach((col,i)=>{
    const own = petColorOwned(petPickerType, i);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house-chip house-chip-color' + (i===petPickerColor ? ' active' : '') + (own ? '' : ' locked');
    b.style.background = '#'+col.c.toString(16).padStart(6,'0');
    b.setAttribute('aria-label', 'สี'+col.n + (own ? '' : ' (ยังไม่มี)'));
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      if(!own){
        if(typeof showToast==='function')
          showToast('🎨', 'สี' + col.n + 'ซื้อได้ที่ร้านสัตว์เลี้ยงนะ (' + (SHOP ? SHOP.PET_COLOR_PRICE : 100) + ' บาท)');
        return;
      }
      petPickerColor = i;
      wrap.querySelectorAll('.house-chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      rebuildPetPreview();
    });
    wrap.appendChild(b);
  });
}
/* ---------- 🎀 แถวปลอกคอในหน้า "สัตว์เลี้ยงของหนู" (ผู้ใช้สั่ง 2026-08-17) ----------
   ⚠ **โผล่เฉพาะตอนรับเลี้ยงน้องแล้วเท่านั้น** — ยังไม่มีน้องก็ยังไม่มีตัวให้ใส่ปลอกคอ
     (โชว์ไว้เฉยๆ แล้วกดไม่ได้ = หลอกเด็ก ผิดกติกาเหล็กข้อ 1)
   ⚠ แบบที่ยังไม่ได้ซื้อ **ยังโชว์อยู่** พร้อมป้ายราคา เหมือนกติกาของชิปสัตว์/สี (ข้อ 17.4)
   ⚠ เปลี่ยนแล้วต้อง `restylePet()` ด้วย ไม่ใช่แค่พรีวิว — น้องตัวจริงในฉากต้องเปลี่ยนตาม */
function petCollarNow(){ return PETCARE ? PETCARE.collar() : {s:'classic', c:0}; }
function wearCollarFromPicker(sid, ci){
  if(!PETCARE) return;
  PETCARE.setCollar(sid, ci);
  restylePet();                      /* น้องในฉาก (ถ้าออกมาเดินอยู่) */
  rebuildPetPreview();               /* ตัวอย่างในหน้านี้ */
  buildPetCollarChips();
}
function buildPetCollarChips(){
  const rowS = $('house-pet-collar-row'), rowC = $('house-pet-collarcol-row');
  const wrapS = $('house-pet-collars'), wrapC = $('house-pet-collar-colors');
  if(!rowS || !rowC || !wrapS || !wrapC) return;
  const data = loadHouseData() || {};
  const has = !!data.pet;
  rowS.hidden = !has; rowC.hidden = !has;
  if(!has) return;
  const worn = petCollarNow();
  wrapS.innerHTML = ''; wrapC.innerHTML = '';
  const list = (SHOP && SHOP.PET_COLLARS) || [];
  list.forEach(it=>{
    const own = !SHOP || SHOP.ownsCollar(it.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house-chip house-pet-chip' + (worn.s === it.id ? ' active' : '') + (own ? '' : ' locked');
    b.innerHTML = '<span class="house-pet-chip-emoji">' + it.emoji + '</span>'
                + '<span class="house-pet-chip-name">' + it.name + '</span>'
                + (own ? '' : '<span class="house-pet-chip-lock">🔒 ' + it.price + '</span>');
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      if(!own){
        if(typeof showToast==='function')
          showToast('🎀', it.name + 'ซื้อได้ที่ร้านสัตว์เลี้ยง 🐾 นะ (' + it.price + ' บาท)');
        return;
      }
      wearCollarFromPicker(it.id, worn.c | 0);
    });
    wrapS.appendChild(b);
  });
  /* สีปลอกคอแจกฟรีทุกสี ⇒ ไม่มีชิปล็อก แตะเปลี่ยนได้เลย */
  ((SHOP && SHOP.COLLAR_COLORS) || []).forEach((col, i)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house-chip house-chip-color' + ((worn.c | 0) === i ? ' active' : '');
    b.style.background = '#' + col.c.toString(16).padStart(6, '0');
    b.setAttribute('aria-label', 'ปลอกคอสี' + col.n);
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      wearCollarFromPicker(worn.s, i);
    });
    wrapC.appendChild(b);
  });
}
function buildPetChips(){
  const wrap = $('house-pet-chips');
  wrap.innerHTML = '';
  PET_TYPES.forEach(p=>{
    const own = petOwned(p.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house-chip house-pet-chip' + (p.id===petPickerType ? ' active' : '') + (own ? '' : ' locked');
    /* ตัวที่ยังไม่มี **ยังโชว์อยู่** (ไม่ซ่อน) พร้อมราคา — ให้เด็กเห็นเป้าหมายว่าเก็บเงินไว้ซื้ออะไรได้บ้าง
       (กติกาเดียวกับของในร้าน ข้อ 17.4: ของที่ซื้อไม่ไหวขึ้นราคาจางๆ ไม่ใช่หายไป) */
    b.innerHTML = '<span class="house-pet-chip-emoji">'+p.emoji+'</span>'
                + '<span class="house-pet-chip-name">'+p.label+'</span>'
                + (own ? '' : '<span class="house-pet-chip-lock">🔒 '+petPriceOf(p.id)+'</span>');
    b.addEventListener('click', ()=>{
      if(typeof playClick==='function') playClick();
      if(!own){ toShopForPet(p); return; }
      petPickerType = p.id;
      petPickerColor = 0;                 /* เปลี่ยนชนิด = กลับสีดั้งเดิมของชนิดนั้น */
      wrap.querySelectorAll('.house-chip').forEach(c=>c.classList.remove('active'));
      b.classList.add('active');
      if(!petNameDirty) $('house-pet-name-input').value = p.def;
      buildPetColorChips();
      rebuildPetPreview();
      refreshPetPickerFoot();
    });
    wrap.appendChild(b);
  });
}
/* ปุ่ม "รับเลี้ยง" + ข้อความชวน — ต่างกันระหว่าง "ยังไม่มีสัตว์เลย" กับ "มีให้เลือกแล้ว" */
function refreshPetPickerFoot(){
  const done = $('house-pet-done'), sub = $('house-pet-sub');
  const has = anyPetOwned(), data = loadHouseData() || {};
  if(done){
    done.hidden = !has;
    done.textContent = data.pet ? 'บันทึกเลย 💕' : 'รับเลี้ยงเลย 💕';
  }
  if(sub) sub.textContent = has
    ? 'เลือกเพื่อนตัวน้อยมาอยู่ด้วยกัน หมุนดูได้ แล้วตั้งชื่อให้ด้วยนะ'
    : 'ยังไม่มีเพื่อนตัวน้อยเลย — ไปเลือกซื้อที่ร้านสัตว์เลี้ยง 🐾 กลางเมืองก่อนนะ';
}
function openPetPicker(wantType){
  if(editMode) return;   /* กันแผงสัตว์เลี้ยงเด้งทับตอนกำลังตกแต่ง */
  if(SHOP) SHOP.close();
  if(window.HouseQB) window.HouseQB.close();
  if(window.HouseDev) window.HouseDev.close();
  closeQuestPanel(); closeQuestBoard();
  hMode = 'pet';
  clearFloatLabels();
  creatorState.rotY = 0; creatorState.rotTarget = 0;
  const data = loadHouseData() || {};
  /* wantType = เพิ่งซื้อตัวนี้มาจากร้าน ให้เปิดมาชี้ตัวนั้นเลย
     ไม่งั้นใช้ตัวที่เลี้ยงอยู่ · ถ้าตัวที่เลี้ยงอยู่ไม่มีสิทธิ์แล้วก็ถอยไปตัวแรกที่ซื้อไว้ */
  const cur = (data.pet && data.pet.type) || '';
  petPickerType = (wantType && petOwned(wantType)) ? wantType
                : (cur && petOwned(cur)) ? cur : firstOwnedPet();
  petPickerColor = (cur === petPickerType && data.pet) ? (data.pet.color || 0) : 0;
  if(!petColorOwned(petPickerType, petPickerColor)) petPickerColor = 0;
  petNameDirty = !!data.pet;              /* มีชื่อเดิมอยู่ = อย่าเขียนทับตอนสลับชนิด */
  $('house-pet-name-input').value = data.pet ? data.pet.name : petTypeInfo(petPickerType).def;
  $('house-pet-picker').hidden = false;
  $('house-rotate-wrap').hidden = false;
  $('house-edit-btn').hidden = true;
  refreshChromeBtns();
  $('house-pet-btn').hidden = true; $('house-decorate-btn').hidden = true; $('house-child-chip').hidden = true;
  $('house-hint').hidden = true;
  $('house-pet-remove').hidden = !data.pet;
  worldGroup.visible = false; interiorGroup.visible = false;
  creatorGroup.visible = true;
  if(charGroup) charGroup.visible = false;
  buildPetChips();
  buildPetColorChips();
  buildPetCollarChips();
  refreshPetPickerFoot();
  rebuildPetPreview();
  applyCamera();
}
/* ซื้อสัตว์จากร้านสำเร็จ → ปิดร้าน แล้วพาไปตั้งชื่อ/รับเลี้ยงตัวนั้นต่อทันที (ข้อ 18.1) */
function petBoughtFlow(type){
  if(!houseOpen || editMode) return;
  if(SHOP) SHOP.close();
  if(hMode === 'world') fadeSwap(()=>openPetPicker(type));
}
function closePetPicker(kind){
  /* กันรับเลี้ยงตัวที่ยังไม่ได้ซื้อ (เช่นกดปุ่มรัวๆ ตอนหน้ากำลังเปลี่ยน) — ถอยเป็น "แค่ปิดหน้า" */
  if(kind==='adopt' && !petOwned(petPickerType)) kind = null;
  if(kind==='adopt'){
    /* 🐞 **กดบันทึกแล้วปลอกคอ/สีเด้งกลับเป็นค่าเริ่มต้น** (ผู้ใช้แจ้ง 2026-08-17)
       ต้นเหตุ: `onAdopt()` เรียก `blank()` ซึ่งล้าง `care` ทั้งก้อน (รวมปลอกคอ) แล้วเขียนทับ
       แต่ปุ่มนี้ทำ 2 หน้าที่ในตัวเดียว — "รับเลี้ยงตัวใหม่" กับ "บันทึกการแก้ไขน้องตัวเดิม"
       (ดู refreshPetPickerFoot ที่สลับข้อความปุ่มเป็น "บันทึกเลย" เมื่อมีน้องอยู่แล้ว)
       ⇒ เดิมแค่เปลี่ยนสี/เปลี่ยนชื่อน้องตัวเดิม ก็โดนล้างความอิ่ม ความสุข วันอาบน้ำ ท่าที่สอนไว้
         และปลอกคอไปทั้งหมด — ไม่ใช่แค่ปลอกคอ
       ⇒ เรียก `onAdopt()` **เฉพาะตอนเป็นน้องตัวใหม่จริงๆ** (ยังไม่เคยมี หรือเปลี่ยนชนิดสัตว์)
         เปลี่ยนชนิด = คนละตัว เริ่มนับใหม่ถูกแล้ว · เปลี่ยนสี/ชื่อ = ตัวเดิม ต้องเก็บของเดิมไว้ครบ */
    const prevPet = (loadHouseData() || {}).pet || null;
    const freshPet = !prevPet || prevPet.type !== petPickerType;
    const name = ($('house-pet-name-input').value || '').trim().slice(0,14) || petTypeInfo(petPickerType).def;
    saveHouseData({pet:{type:petPickerType, name, color:petPickerColor}});
    syncPetHouse(true);           /* มีสัตว์แล้ว → บ้านสัตว์โผล่ที่ช่องที่จองไว้ (ข้อ 18.1) */
    if(PETCARE && freshPet) PETCARE.onAdopt();/* เฟส 3B: เริ่มนับความอิ่มใหม่ + แถมอาหารถุงแรกของชนิดนั้น */
    /* 🎓 เฟส 15: ได้เพื่อนตัวน้อยตัวแรก → บทเรียนดูแลสัตว์เลี้ยงเด้งเอง (ผู้ใช้สั่ง)
       ⚠ หน่วงไว้ให้อนิเมชันรับเลี้ยง/ตั้งชื่อจบก่อน ไม่งั้นฟองนกฮูกเด้งทับหน้าตั้งชื่อ */
    if(window.HouseTutor) setTimeout(()=>{ if(houseOpen) window.HouseTutor.fire('c5'); }, 2200);
  }else if(kind==='remove'){
    saveHouseData({pet:null});
    syncPetHouse(false);          /* ปล่อยเพื่อนตัวน้อยคืน → บ้านสัตว์หายไปด้วย */
    if(PETCARE) PETCARE.onRelease();
  }
  hMode = 'world';
  $('house-pet-picker').hidden = true;
  $('house-rotate-wrap').hidden = true;
  $('house-edit-btn').hidden = false;
  refreshChromeBtns();
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
  /* ⚠ `hMode !== 'world'` จำเป็น — ในหน้าแต่งตัว charGroup คือ "ตัวพรีวิว" ซึ่งอาจเป็นพ่อ/แม่
     ถ้าไม่กันไว้ **ชื่อเด็กจะลอยอยู่บนหัวพ่อแม่** (ผู้ใช้เจอ 2026-08-09) */
  if(!charGroup || !houseOpen || !charGroup.visible || hMode !== 'world'){ el.hidden = true; return; }
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
/* ================= 🧭 ลูกศรนำทางเควสต์เก็บของ (2026-08-16 · ผู้ใช้สั่ง) =================
   ปัญหา: เควสต์ "เก็บของไปให้" สั่งให้เก็บของประจำวันที่**กระจายอยู่ทั่วเมือง** เด็กไม่รู้ว่าอยู่ทางไหน
   ⇒ ใช้แพทเทิร์นเดียวกับเกม RPG: **เป้าหมายอยู่นอกจอ → ลูกศรไปเกาะขอบจอด้านนั้นแล้วชี้ออก**
      พร้อมบอกระยะเป็นจำนวนช่อง

   ⚠ **ของที่อยู่ในจอไม่ต้องมีลูกศร** — มีป้ายลอยเหนือหัวอยู่แล้ว (colBuild ใน js/house-play.js)
     ใส่ซ้ำจะรกและเด็กสับสนว่าต้องดูอันไหน
   ⚠ ชี้ไป **ชิ้นที่ใกล้ที่สุดที่ยังไม่ได้เก็บ** เสมอ (เก็บชิ้นนี้แล้วลูกศรเด้งไปชิ้นถัดไปเอง)
   ⚠ มุมต้องคิดใน **พิกัดหน้าจอ** ไม่ใช่พิกัดโลก — กล้องเป็นไอโซเมตริกเอียง 45°
     ถ้าใช้มุมในโลกตรงๆ ลูกศรจะชี้เพี้ยนจากที่ตาเห็น (บทเรียนเดียวกับเข็มทิศ) */
/* เขตปลอดภัยของลูกศร — **ต้องพ้น HUD จริงทุกด้าน** ไม่ใช่ระยะเท่ากันรอบจอ
   ⚠ บทเรียน 2026-08-16: ตั้งไว้ 46px เท่ากันทุกด้าน แล้วลูกศรไปโผล่**ใต้ปุ่มกล้อง/เฟืองมุมขวาบน**
     มองไม่เห็นเลย — จับได้จากภาพจริงเท่านั้น (วัดด้วยตัวเลขบอกไม่ได้ว่า "ถูกบัง")
   บน = เข็มทิศ + แถบชื่อ/สัตว์เลี้ยง/เควสต์ + ปุ่มกล้อง/เฟือง · ล่าง = แถบคำใบ้ + ปุ่ม 🎈 */
/* ระยะที่ลูกศรโคจรรอบตัวเด็ก (px) — **ใกล้ตัวเด็กแต่ไม่ชิดจนบังตัว** (ผู้ใช้สั่ง 2026-08-16)
   ⚠ รอบแรกทำเป็น "ลูกศรเกาะขอบจอ" แบบเกม RPG แล้วผู้ใช้บอกว่า **ไม่เห็น** —
     ขอบจอไกลจากจุดที่เด็กจ้องอยู่ (ตัวละคร) มาก และชนกับ HUD ตลอด
   ⇒ ย้ายมาโคจรรอบตัวเด็ก เห็นแน่นอนเพราะเด็กมองตัวเองอยู่แล้ว */
const QARROW_R = 104;
const _qaV = new THREE.Vector3(), _qaV2 = new THREE.Vector3();
/* ของประจำวันชิ้นที่ใกล้ที่สุดที่ยังไม่ได้เก็บ — เก็บครบแล้วดับโหมดนำทางให้เอง */
function colGuideTarget(){
  const P = window.HousePlay;
  const left = (P && P.colLeft) ? P.colLeft() : [];
  if(!left.length){ guideCol = false; return null; }
  const t = hChar.tile;
  let best = null, bd = 1e9;
  left.forEach(it=>{
    const d = Math.abs(it.x - t.x) + Math.abs(it.z - t.z);
    if(d < bd){ bd = d; best = it; }
  });
  return best;
}
function questArrowTarget(){
  /* 🧭 **โชว์เฉพาะตอนทำเควสต์เท่านั้น ไม่โชว์ตอนเล่นกิจกรรมรายวัน** (ผู้ใช้สั่ง 2026-08-16)

     เคยเปิดให้โผล่ตอนเล่นมินิเกมเก็บของ/ซ่อนแอบเองด้วย แต่กิจกรรมรายวัน **เปิดค้างอยู่ทั้งวัน**
     ⇒ ลูกศรโชว์ตลอดเวลาจนรบกวนเด็กที่แค่อยากเดินเล่น
     ⇒ เควสต์เท่านั้น เพราะเควสต์มีจุดเริ่ม-จุดจบชัดเจน และเด็ก "รับงานมา" จริงๆ
     🔒 ห้ามเปิดให้กิจกรรมรายวันใช้อีก เว้นแต่ผู้ใช้สั่งใหม่ */
  const t = hChar.tile;
  const at = tl => tl ? {tile:tl, dist: Math.abs(tl.x - t.x) + Math.abs(tl.z - t.z)} : null;
  /* 🧭 เป้าหมายที่เป็น "จุดหมายให้เดินไป" ต้องซ่อนลูกศรเมื่อถึงแล้ว
     ไม่งั้นเด็กยืนอยู่หน้าร้านแล้วยังมีลูกศรชี้ลงที่เท้าตัวเอง หมุนไปมาน่ารำคาญ
     ⚠ **ไม่ใช้กับงานเก็บของ** — ของชิ้นใกล้สุดมักอยู่ข้างตัวพอดี ซ่อนแล้วเด็กจะไม่เห็นลูกศรเลย
       (กติกาเดิมของ 2026-08-16: โชว์ตลอดตราบใดที่ยังเก็บไม่ครบ) */
  const goTo = tl => { const r = at(tl); return (r && r.dist > 2) ? r : null; };
  /* 🎓 บทเรียนสอนเล่นสั่งเป้าหมายเองได้ และ **มาก่อนเควสต์เสมอ**
     (ระหว่างสอนเล่นต้องไม่มีลูกศร 2 อันชี้คนละทาง) */
  if(guideForce) return goTo(guideForce);
  /* 🍃 โหมดนำทางไปของประจำวัน (เปิดจากปุ่มในแผงกิจกรรม) — ชี้ชิ้นใกล้สุดที่ยังไม่ได้เก็บ
     ⚠ ห้ามซ่อนตอนเข้าใกล้ (ไม่ใช้ `goTo`) — ของมักอยู่ข้างตัวพอดี ซ่อนแล้วเด็กจะไม่เห็นเลย */
  if(guideCol){
    const r = colGuideTarget();
    if(r) return at(r);
  }
  if(!walkQuest) return null;
  /* 🍃 งานเก็บของ — ชี้ไป **ชิ้นที่ใกล้ที่สุดที่ยังไม่ได้เก็บ** (เก็บแล้วเด้งไปชิ้นถัดไปเอง) */
  if(walkQuest.target === 'catch'){
    const row = walkQuest.need.filter(r => r.k === 'leaf')[0];
    if(row && catchGot(row) < row.n){
      const P = window.HousePlay;
      const left = (P && P.colLeft) ? P.colLeft() : [];
      if(!left.length) return null;
      let best = null, bd = 1e9;
      left.forEach(it=>{
        const d = Math.abs(it.x - t.x) + Math.abs(it.z - t.z);
        if(d < bd){ bd = d; best = it; }
      });
      return at(best);
    }
  }
  /* 🚶 เควสต์เดินแบบอื่น (ส่งของ · ไปร้าน · ตกปลาแล้วเอาไปส่ง) — ใช้ลูกศรตัวเดียวกัน */
  return goTo(questGuideTile());
}
function updateQuestArrow(){
  const el = $('house-qarrow');
  if(!el) return;
  const show = houseOpen && hMode === 'world' && hScene === 'out' && !editMode && charGroup;
  const tgt = show ? questArrowTarget() : null;
  /* ⚠ **โชว์ตลอดตราบใดที่ยังเก็บไม่ครบ** ไม่ใช่เฉพาะตอนของอยู่นอกจอ —
     ของ 8 ชิ้นกระจายทั่วเมือง ชิ้นใกล้สุดมักอยู่ในจอพอดี ลูกศรเลยแทบไม่เคยโผล่
     (ผู้ใช้แจ้งว่า "ยังไม่เห็นลูกศร" 2026-08-16) */
  if(!tgt){ el.hidden = true; return; }

  const W2 = window.innerWidth, H2 = window.innerHeight;
  /* มุมบนหน้าจอจริง: project ทั้งตัวเด็กและเป้าหมาย แล้ววัดมุมระหว่าง 2 จุด
     (กล้องไอโซเมตริกเอียง 45° — ใช้มุมในโลกตรงๆ ลูกศรจะชี้เพี้ยนจากที่ตาเห็น
      บทเรียนเดียวกับเข็มทิศ) */
  _qaV.copy(charGroup.position).project(camera);
  _qaV2.set(outWX(tgt.tile.x), .6, outWZ(tgt.tile.z)).project(camera);
  const cx = (_qaV.x * .5 + .5) * W2, cy = (-_qaV.y * .5 + .5) * H2;
  let dx = ((_qaV2.x - _qaV.x) * .5) * W2;
  let dy = (-(_qaV2.y - _qaV.y) * .5) * H2;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len; dy /= len;
  /* วางไว้รอบตัวเด็ก แล้วดันให้อยู่ในจอเสมอ (เผื่อเด็กเดินไปติดขอบแผนที่) */
  const px = Math.max(30, Math.min(W2 - 30, cx + dx * QARROW_R));
  const py = Math.max(30, Math.min(H2 - 30, cy + dy * QARROW_R));
  el.style.left = px + 'px';
  el.style.top  = py + 'px';
  const rot = document.getElementById('hqa-rot');
  /* ลูกศรวาดชี้ขึ้นในไฟล์ ⇒ หมุนตามมุมของทิศทางบนจอ */
  if(rot) rot.setAttribute('transform',
    'rotate(' + (Math.atan2(dx, -dy) * 180 / Math.PI).toFixed(1) + ' 22 22)');
  const d = $('hqa-dist');
  if(d) d.textContent = tgt.dist + ' ช่อง';
  el.hidden = false;
}
/* ============================================================
   🔒 POS_CHIP_ENABLED — สวิตช์ป้ายพิกัดมุมขวาล่าง **จุดเดียวในทั้งโปรเจค**

   `true`  = เห็นป้าย "x21 z37" ตอนเดินในเมือง (ใช้บน branch ระหว่างพัฒนา/เทสแผนที่)
   `false` = ไม่โผล่เลย (**ค่าที่ต้องใช้ทุกครั้งที่ merge ขึ้น `main`/deploy จริง**)

   ⚠️ **ก่อน merge เข้า `main` ทุกครั้งต้องตั้งเป็น `false`** (ผู้ใช้สั่ง 2026-08-20)
      กติกาเดียวกับ QB_ENABLED / DEV_ENABLED / MUSIC_PANEL_ENABLED เป๊ะ:
      เครื่องมือเทส = ปิดตอน deploy เสมอ ไม่ต้องถามผู้ใช้ซ้ำ
   ⚠️ ปิดที่นี่ที่เดียวพอ ไม่ต้องแก้ index.html/CSS
   ============================================================ */
const POS_CHIP_ENABLED = true;
/* ป้ายพิกัดมุมขวาล่าง — บอกช่องที่ตัวละครยืนอยู่ (ไว้ดูตำแหน่งตอนทดสอบแผนที่)
   อัปเดตเฉพาะตอนเปลี่ยนช่องจริงๆ ไม่แตะ DOM ทุกเฟรม */
let posChipKey = '';
function updatePosChip(){
  const el = $('house-pos-chip');
  if(!el) return;
  if(!POS_CHIP_ENABLED){ if(!el.hidden){ el.hidden = true; posChipKey = ''; } return; }
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
/* 🎨 ไอคอน SVG ของโหมดบ้าน (js/house-icons.js) — ไม่มีไอคอนตัวนั้น = ถอยไปใช้ emoji เดิม (ห้ามพัง)
   ⚠ ใช้กับ "ไอคอนของของ/ปุ่ม/สถานะ" เท่านั้น · **อารมณ์/ท่าทางในฟองคำพูดยังเป็น emoji ตามเดิม**
     (ผู้ใช้สั่ง 2026-08-18: emoji แสดงผลไม่เหมือนกันข้าม OS แต่ฟองอารมณ์ยังใช้ได้) */
/* 💬 ฟองคำพูด: รูปตัวละครวงกลมชิดซ้าย + (ชื่อ / บทพูด) ทางขวา (ผู้ใช้เลือกแบบนี้ 2026-08-20)
   ⚠ **ห้ามเอา `name`/`text` ไปต่อกับ innerHTML** — ชื่อ/ข้อความบางส่วนมาจากผู้ใช้ ⇒ ใส่ผ่าน textContent */
function showTalkBubble(el, iconId, emoji, name, text){
  if(!el) return;
  el.innerHTML = '';
  const av = document.createElement('span');
  av.className = 'hnb-av';
  av.innerHTML = hIcon(iconId, emoji, 40);
  const body = document.createElement('span');
  body.className = 'hnb-body';
  const nm = document.createElement('b'); nm.textContent = name || '';
  const tx = document.createElement('span'); tx.textContent = text || '';
  body.appendChild(nm); body.appendChild(tx);
  el.appendChild(av); el.appendChild(body);
  el.classList.add('on');
}
/* 🧑 ตั้งข้อความ "ไอคอน + ชื่อ" ลง element โดยไอคอนเป็น SVG ได้ (เฟส B ของ ICON-PLAN.md)
   ⚠ **ห้ามเอา `name` ไปต่อกับ innerHTML** — ชื่อบางที่มาจากผู้ใช้ (ชื่อเด็ก/ชื่อสัตว์เลี้ยง)
     ⇒ ไอคอนใส่ผ่าน element ของตัวเอง · ชื่อใส่ผ่าน text node เสมอ */
function setIconName(el, iconId, emoji, name){
  if(!el) return;
  el.textContent = '';
  const ic = document.createElement('span');
  ic.className = 'hnpc-ic';
  ic.innerHTML = hIcon(iconId, emoji, 22);
  el.appendChild(ic);
  el.appendChild(document.createTextNode(' ' + (name == null ? '' : name)));
}
function hIcon(id, emoji, size){
  return window.HouseIcons ? window.HouseIcons.htmlOr(id, emoji, size) : String(emoji || '');
}
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
  /* ยกขึ้นถ้าวางบนของอื่น + เลื่อนตามของที่รองอยู่ (โต๊ะติดผนังถูกเลื่อนเข้าหาผนังไปแล้ว) */
  const st = decorStackAt(sc, item, {x:rec.x,z:rec.z}, rec.rot||0, rec);
  g.position.y = st.y;
  g.position.x += st.dx; g.position.z += st.dz;
  g.rotation.y = (rec.rot||0) * Math.PI/2;
  if(item.wall){   /* เลื่อนให้ขอบหลัง (local -z) ไปแนบผิวผนัง (ห่างกึ่งกลางช่องขอบ 0.5) — ชิ้นตื้น/ลึกแนบเท่ากัน */
    const sh = wallSnapShift(item, rec.rot||0, g);
    g.position.x += sh.dx;
    g.position.z += sh.dz;
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
/* แถวรั้วรอบบริเวณบ้าน (คำนวณจาก YARD/GATE_TILES ทุกครั้ง) — ใช้ทั้งตอน seed เด็กใหม่
   และตอน migrate เด็กเก่าให้ได้รั้วแนวใหม่ (ดู migrateHouseMap ข้อ mapV 4) */
function fenceSeedRecs(){
  const out = [];
  /* มุมรั้ว 4 มุม (L หมุนตามมุม: บนซ้าย=0, ล่างซ้าย=1, ล่างขวา=2, บนขวา=3) */
  out.push({id:'fence-corner', x:YARD.x0, z:YARD.z0, rot:0, col:0});
  out.push({id:'fence-corner', x:YARD.x0, z:YARD.z1, rot:1, col:0});
  out.push({id:'fence-corner', x:YARD.x1, z:YARD.z1, rot:2, col:0});
  out.push({id:'fence-corner', x:YARD.x1, z:YARD.z0, rot:3, col:0});
  /* รั้วตรงระหว่างมุม (ข้ามช่องมุม) — แนวนอนบน/ล่าง (rot 0), แนวตั้งซ้าย/ขวา (rot 1) */
  [YARD.z0, YARD.z1].forEach(fz=>{ for(let x=YARD.x0+1; x<=YARD.x1-1; x++){ if(isFenceTile(x,fz)) out.push({id:'fence-seg', x, z:fz, rot:0, col:0}); } });
  [YARD.x0, YARD.x1].forEach(fx=>{ for(let z=YARD.z0+1; z<=YARD.z1-1; z++){ if(isFenceTile(fx,z)) out.push({id:'fence-seg', x:fx, z, rot:1, col:0}); } });
  return out;
}
/* แปลงผัก 4 แปลงหน้าบ้าน (เฟส 11 · ผู้ใช้กำหนดพิกัดเอง 2026-08-13: x14-15 / z33-34)
   ⚠ อยู่ใน HOME_ZONE (x13-25 / z27-38) จึงย้าย/หมุน/ลบได้ในโหมดตกแต่งตามปกติ
   ⚠ **เป็นแค่ "เบาะดิน"** — ต้นพืชกับป้ายบอกสิ่งที่ทำได้เป็นของ js/house-play.js ที่วาดทับตามสถานะ */
const VEG_PLOT_TILES = [[14,33],[15,33],[14,34],[15,34]];
function vegPlotSeedRecs(){
  return VEG_PLOT_TILES.map(([x,z]) => ({id:'veg-plot', x, z, rot:0, col:0}))
    /* ตะกร้าขายของ (ผู้ใช้กำหนดพิกัดเอง x17/z37) — เป็น decor จึงบล็อกช่องเดิน ไม่ถูกยืนทับ */
    .concat([{id:'sell-basket', x:17, z:37, rot:0, col:0}]);
}
/* seed ต้นไม้/รั้ว/บ้านสัตว์เลี้ยงเริ่มต้นเป็น decor ที่ย้าย/ลบได้ (ครั้งเดียวต่อเด็ก, ตำแหน่งเดิมเป๊ะ) */
function seedWorldDecor(data){
  data = data || {};
  const decor = data.decor || {out:[], in:[]};
  const seed = [];
  /* กรองต้นไม้ที่ทับตัวบ้าน/รั้วสนาม/แถบหน้าบ้าน ออกก่อน seed (เด็กย้ายมาวางเองทีหลังได้ตามใจ) */
  /* ⚠ ต้องกรอง inHomeZone ด้วย — กรอบบริเวณบ้านย่อลงเมื่อ 2026-08-09 ต้นไม้ seed บางต้นเลยตกนอกกรอบ
     ถ้าปล่อยไว้ เด็กจะเจอต้นไม้ที่ "ขยับ/ลบไม่ได้" เพราะอยู่นอกกรอบตกแต่ง (ช่องที่ว่างลงเป็นป่าปกติแทน) */
  TREES.filter(([x,z]) => inHomeZone(x, z) && !inBox(HOUSE_VIEW, x, z) && !isFenceTile(x, z) &&
                          !inBox(HOUSE_FOOT, x, z) && !(x===PET_HOUSE_TILE.x && z===PET_HOUSE_TILE.z))
       .forEach(([x,z])=>{ seed.push({id:'tree', x, z, rot:(x*7+z*13)%4, col:(x+z)%4}); });
  fenceSeedRecs().forEach(r=>seed.push(r));
  /* ⚠ **ต้องเช็คว่ายังไม่มีก่อนเสมอ** — เด็กที่ decor ว่างแต่ mapV เก่าจะวิ่งผ่านทั้ง
     migration (mapV 5) และ seedWorldDecor ⇒ ได้แปลงซ้อนกัน 8 แปลง (เจอจริงจากเทส 2026-08-13) */
  if(!(decor.out || []).some(r => r && r.id === 'veg-plot'))
    vegPlotSeedRecs().forEach(r=>seed.push(r));    /* แปลงผัก 4 แปลง (เฟส 11) */
  /* rot:0 = ประตูหันไปทาง +z ทิศเดียวกับประตูบ้านเด็ก (ทางเดินหน้าบ้านก็ทอดไป +z) และเป็นด้านที่
     กล้อง iso มองเห็น (ของเดิม rot:3 ประตูหันหลังให้กล้อง เด็กไม่เห็นทั้งประตูและตัวที่เข้าไปนอนรอ) */
  /* ⚠ เฟส 3A: **ไม่ seed บ้านสัตว์ให้ทุกคนแล้ว** (ข้อ 18.1 — ไม่มีสัตว์ = ไม่มีบ้านสัตว์)
     บ้านจะไปโผล่ตอนรับเลี้ยงตัวแรกผ่าน syncPetHouse() แทน · ช่อง PET_HOUSE_TILE ยังจองไว้เหมือนเดิม
     (ต้นไม้/รั้วไม่ลงช่องนี้) จะได้มีที่ว่างรออยู่จริงตอนสัตว์มา */
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
/* ---------- บ้านสัตว์เลี้ยงตามเงื่อนไข (ข้อ 18.1 ของแผนแม่บท — เฟส 3A) ----------
   มีสัตว์ = มีบ้านสัตว์ · ปล่อยสัตว์คืน = บ้านหายไปด้วย (ย้ายที่ได้ในโหมดตกแต่ง แต่ลบเองไม่ได้)
   ⚠ ตอน "มี" จะวางที่ PET_HOUSE_TILE ก่อน ถ้าช่องนั้นถูกของอื่นยึดไปแล้ว (เด็กย้ายของมาทับ)
     ค่อยหาช่องว่างใกล้ๆ แทน — ห้ามล้มเงียบ ไม่งั้นเด็กซื้อสัตว์แล้วบ้านไม่มา */
function syncPetHouse(want){
  const data = loadHouseData() || {};
  const decor = data.decor || {out:[], in:[]};
  const list = decor.out || [];
  const at = list.findIndex(r => r && r.id === 'pet-house');
  if(want && at < 0){
    const item = FURN.byId['pet-house'];
    if(!item) return;
    let a = PET_HOUSE_TILE;
    if(!decorCanPlace('out', item, a, 0)) a = findFreeAnchor('out', item, 0) || PET_HOUSE_TILE;
    list.push({id:'pet-house', x:a.x, z:a.z, rot:0, col:0});
  }else if(!want && at >= 0){
    list.splice(at, 1);
  }else{
    return;                                  /* ตรงกับที่ต้องการอยู่แล้ว ไม่ต้องเขียน save ซ้ำ */
  }
  decor.out = list;
  saveHouseData({decor});
  if(houseOpen) loadDecorForChild();          /* วาดฉากนอกบ้านใหม่ให้เห็นผลทันที */
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
  closeQuestPanel(); closeQuestBoard();
  editMode = true;
  document.body.classList.add('house-edit');
  refreshChromeBtns();                 /* ซ่อนปุ่มกล้อง/เฟือง ระหว่างตกแต่งบ้าน */
  /* ซ่อนตัวละคร + สัตว์เลี้ยง + พ่อแม่ + ป้ายชื่อ ระหว่างตกแต่ง (ไม่ให้บังของ/สับสน) */
  if(charGroup) charGroup.visible = false;
  if(hPet.group) hPet.group.visible = false;
  setParentsVisible(false);
  clearFloatLabels();             /* ฟองคำพูดที่ค้างอยู่ต้องหายไปพร้อมเจ้าของฟอง */
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
  refreshChromeBtns();                 /* ออกจากโหมดตกแต่ง = คืนปุ่มกล้อง/เฟือง */
  deselectDecor();
  updateHomeZoneFrame();
  document.body.classList.remove('house-edit');
  /* คืนตัวละคร + สัตว์เลี้ยง + พ่อแม่ (ป้ายชื่อ/ป้ายงานโชว์เองผ่าน frame loop) */
  if(charGroup) charGroup.visible = true;
  if(hPet.group) hPet.group.visible = true;
  setParentsVisible(true);
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
/* จำนวนชิ้นของ id นี้ที่ "วางอยู่แล้ว" ทั้งในบ้านและนอกบ้าน (เฟส 11 · นับจำนวนชิ้น) */
function placedFurnCount(id){
  let n = 0;
  ['out','in'].forEach(sc=>{
    (decorGroups[sc] || []).forEach(g=>{
      const d = g.userData && g.userData.deco;
      if(d && d.rec && d.rec.id === id) n++;
    });
  });
  return n;
}
/* ⚠ **แปลงผักวางได้สูงสุด 8 แปลง** (ผู้ใช้สั่ง 2026-08-14 · กันเงินเฟ้อ)
   แปลงเยอะ = ปลูกขายได้ไม่จำกัด ⇒ รายได้แซงเควสต์ ซึ่งผิดเจตนาของกลุ่ม A */
const VEG_PLOT_MAX = 8;
function renderEditItems(){
  const wrap = $('house-edit-items'); if(!wrap) return;
  wrap.innerHTML = '';
  FURN.items.filter(it=>it.scope===hScene && it.cat===editCat).forEach(it=>{
    const b = document.createElement('button');
    /* เฟส 1: ของที่ยังไม่ได้ซื้อ **ยังโชว์อยู่** (สีจาง + ป้ายราคา) ไม่ซ่อน — ให้เด็กเห็นเป้าหมาย
       แตะแล้วบอกว่าไปซื้อได้ที่ไหน ไม่ใช่เงียบเฉยจนนึกว่าแอปเสีย
       ⚠ เฟส 11: **ซื้อ 1 ชิ้นวางได้ 1 อัน** (ผู้ใช้สั่ง 2026-08-13) ⇒ ต้องโชว์ "เหลือกี่ชิ้น"
         และปิดปุ่มเมื่อวางครบแล้ว ไม่งั้นเด็กกดแล้วไม่มีอะไรเกิดขึ้นโดยไม่รู้สาเหตุ */
    const own = it.id === 'veg-plot' ? Math.min(VEG_PLOT_MAX, SHOP ? SHOP.furnCount(it.id) : 1)
              : (SHOP ? SHOP.furnCount(it.id) : 1);
    const used = placedFurnCount(it.id);
    const left = Math.max(0, own - used);
    const locked = own <= 0;
    const empty = !locked && left <= 0;
    b.className = 'he-item' + (locked ? ' he-locked' : '') + (empty ? ' he-used' : '');
    /* 🎨 ไอคอน SVG ของเฟอร์นิเจอร์ (เฟส A ของ ICON-PLAN.md) — ไม่มี = ถอยไปใช้ emoji เดิม */
    b.innerHTML = '<span class="he-item-emoji">'+hIcon('furn-'+it.id, it.emoji, 26)+'</span><span class="he-item-name">'+it.name+'</span>'
                + (locked ? '<span class="he-item-price"><i class="hs-coin"></i>'+SHOP.priceFurn(it.id)+'</span>'
                          : '<span class="he-item-left">'+left+'/'+own+'</span>');
    b.onclick = locked
      ? ()=>{ if(typeof playClick==='function') playClick();
              /* ⚠ **ห้ามฮาร์ดโค้ดว่า "ห้างเฟอร์นิเจอร์"** — ของนอกบ้าน (กองไฟ/รถเข็นสวน/บ่อน้ำ)
                 ขายที่ร้านต้นไม้ · เครื่องเล่นขายที่ร้านของเล่น ⇒ ถามร้านจาก SHOP.shopForFurn()
                 (ผู้ใช้ถาม 2026-08-19 ว่าของตกแต่งนอกบ้านซื้อที่ไหน — ข้อความเดิมชี้ผิดร้าน) */
              const sh = (SHOP && SHOP.shopForFurn) ? SHOP.shopForFurn(it.id) : null;
              if(typeof showToast==='function')
                showToast(sh ? sh.icon : '🛋️',
                          it.name+' ยังไม่มีนะ ไปซื้อได้ที่'+(sh ? sh.title : 'ร้านในเมือง')+'นะ!'); }
      : (empty
          ? ()=>{ if(typeof playClick==='function') playClick();
                  if(typeof showToast==='function') showToast('🛒', 'วาง'+it.name+'ครบทุกชิ้นที่มีแล้ว ถ้าอยากวางอีกต้องไปซื้อเพิ่มนะ'); }
          : ()=>addDecorItem(it.id));
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
/* ของที่ "รองอยู่ข้างใต้" ของชิ้น stack (เช่นโคมไฟตั้งโต๊ะบนโต๊ะข้างเตียง)
   คืนตัวที่ผิวสูงที่สุดที่ทับช่องกัน — ใช้ทั้งความสูงและตำแหน่งจริงของมัน
   🐞 **บั๊กที่ผู้ใช้แจ้ง 2026-08-22: "โต๊ะติดกำแพงแล้วของบนโต๊ะลอย"**
      ของที่ติดธง `wall` (ตู้หัวเตียง · เคาน์เตอร์ครัว · ชั้นวางทีวี · โต๊ะวางของ · ตู้ลิ้นชัก ·
      โต๊ะเครื่องแป้ง · ตู้ถ้วยชาม) ถูก **เลื่อนไปแนบผนังจริง** ใน applyRecToGroup2 แต่ของที่วางทับ
      ยังถูกวางที่ "กลางช่อง" ตามเดิม ⇒ โต๊ะขยับไปแล้ว ของค้างอยู่กลางอากาศข้างโต๊ะ
   ⇒ ของที่วางซ้อนต้องรับ **ระยะเลื่อนของตัวที่รองอยู่** มาด้วยเสมอ */
function decorStackUnder(sc, item, anchor, rot, ignoreRec){
  if(!item.stack) return null;
  let best = null;
  const tiles = footTiles(item, anchor, rot);
  for(const g of decorGroups[sc]){
    const r = g.userData.deco.rec; if(r===ignoreRec) continue;
    const it = g.userData.deco.item; if(it.top==null) continue;
    const oth = footTiles(it, {x:r.x,z:r.z}, r.rot);
    if(!tiles.some(a=>oth.some(bb=>bb.x===a.x && bb.z===a.z))) continue;
    if(!best || it.top > best.item.top) best = {item:it, rec:r, g};
  }
  return best;
}
/* ระยะที่ชิ้นติดผนังถูกเลื่อนเข้าหาผนัง (สูตรเดียวกับ applyRecToGroup2 — แก้ที่นี่ที่เดียวไม่พอ
   ต้องแก้พร้อมกันทั้ง 2 จุดเสมอ) */
function wallSnapShift(item, rot, g){
  if(!item || !item.wall) return {dx:0, dz:0};
  const ang = (rot || 0) * Math.PI/2;
  const sh = -(0.5 + ((g && g.userData.localMinZ) || 0));
  return {dx: sh * Math.sin(ang), dz: sh * Math.cos(ang)};
}
/* ความสูง + ระยะเลื่อนที่ชิ้น stack ต้องใช้เพื่อไปนั่งบนผิวของที่รองอยู่จริง */
function decorStackAt(sc, item, anchor, rot, ignoreRec){
  const sup = decorStackUnder(sc, item, anchor, rot, ignoreRec);
  if(!sup) return {y:0, dx:0, dz:0};
  /* ⚠ ถ้าตัวที่วางทับเป็นของติดผนังเอง มันเลื่อนของมันเองอยู่แล้ว ไม่ต้องเลื่อนซ้ำ */
  const sh = item.wall ? {dx:0, dz:0} : wallSnapShift(sup.item, sup.rec.rot || 0, sup.g);
  return {y: sup.item.top, dx: sh.dx, dz: sh.dz};
}
function decorYOffset(sc, item, anchor, rot, ignoreRec){
  return decorStackAt(sc, item, anchor, rot, ignoreRec).y;
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
  renderEditItems();          /* ⚠ ตัวเลข "เหลือกี่ชิ้น" ในแผงต้องอัปเดตทันที ไม่งั้นค้างค่าเก่า */
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
  /* บ้านสัตว์ผูกกับ "มีสัตว์อยู่ไหม" (ข้อ 18.1) — ย้ายที่ได้ แต่ลบเองไม่ได้
     ไม่งั้นเด็กลบทิ้งแล้วเพื่อนตัวน้อยไม่มีที่นอน และหยิบกลับมาวางเองไม่ได้ */
  if(deco.rec && deco.rec.id === 'pet-house'){
    const d = loadHouseData() || {};
    if(d.pet){
      if(typeof showToast==='function') showToast('🐾', 'บ้านของ' + d.pet.name + 'ลบไม่ได้นะ แต่ลากย้ายที่ได้');
      return;
    }
  }
  const idx = decorGroups[sc].indexOf(editSel);
  editSel.parent.remove(editSel); disposeGroup(editSel);
  if(idx>=0) decorGroups[sc].splice(idx,1);
  deselectDecor(); rebuildDecorGrid(sc); saveDecor();
  renderEditItems();          /* ลบแล้วต้องคืนชิ้นให้เลือกวางใหม่ได้ทันที */
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
  /* พรีวิวตอนลากต้องอยู่ตรงที่ที่มันจะไปอยู่จริง — รวมระยะเลื่อนของโต๊ะที่รองอยู่ด้วย
     ไม่งั้นเด็กเห็นของลอยตอนลาก แล้วปล่อยแล้วกระโดดไปอีกที่ */
  const stp = valid ? decorStackAt(sc, item, anchor, rot, rec) : null;
  editSel.position.y = stp ? stp.y : .12;
  if(stp){ editSel.position.x += stp.dx; editSel.position.z += stp.dz; }
  if(valid && item.wall){
    const sh = wallSnapShift(item, rot, editSel);
    editSel.position.x += sh.dx; editSel.position.z += sh.dz;
  }
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
/* ============================================================
   เฟส 9 — แตะเครื่องดนตรีแล้วมีเสียงจริง (ข้อ 31 ของ QUEST-DESIGN.md)

   ใช้ Web Audio ชุดเดิมทั้งหมด: `playPianoNote()` / `playMusicSequence()` (js/shared/piano.js
   + js/games-art.js) กับความถี่จาก MUSIC_WHITE_KEYS ⇒ **ไม่โหลดไฟล์เสียงเพิ่มเลยแม้แต่ไฟล์เดียว**

   3 ระดับตามฟิลด์ `item.music`:
     1 = เคาะทีเดียวดัง 1 เสียง (ฉิ่ง/แทมบูริน/กรับ/ระฆังลม) — เด็กเล็กสุดเล่นได้
     2 = เล่นทำนองสั้นที่ติดมากับชิ้นนั้น + โน้ตลอยขึ้น (กล่องดนตรี/ระนาด/ขลุ่ย)
     3 = เปิดหน้าเล่นเต็มแบบ "เปียโนของหนู" (เปียโน/คีย์บอร์ด/กีตาร์/อูคูเลเล่)

   ⚠ **ต้องส่ง noFlash = true ให้ playMusicSequence เสมอ** — ฟังก์ชันนั้นจะไปสั่ง flash คีย์ผ่าน
     `$('music-piano')` ซึ่งในโหมดบ้านไม่มีอยู่บนจอ (กับดักเดียวกับเกมทายเสียงของเฟส 5 ที่ตกค้าง)
   ⚠ ระดับ 3 เปิด modal ของหน้าหลักซึ่งอยู่ **นอก** `#house-view` ⇒ ต้องหยุดเพลงพื้นหลังของบ้าน
     ให้เรียบร้อยก่อน ไม่งั้นเสียงซ้อนกัน 2 ชั้น
   ============================================================ */
/* ================= เสียงประจำเครื่องดนตรี (2026-08-16) =================
   เดิมทุกเครื่องออกเสียงเปียโนเหมือนกันหมด (วิ่งผ่าน `playMusicSequence`/`playPianoNote`)
   ⇒ เกม "ทายเสียงเครื่องดนตรี" กลายเป็นเดาสุ่มล้วน (ผู้ใช้แจ้ง 2026-08-16)
   ⚠ **ทางเดียวกันนี้ต้องถูกใช้ทั้งตอนแตะเครื่องที่บ้านและตอนเล่นเกมทายเสียง**
     เด็กจำเสียงได้เพราะเคยเล่นเองที่บ้าน ถ้า 2 ที่เสียงคนละแบบ เกมทายจะไม่ยุติธรรม
   ⚠ ตัวสังเคราะห์เสียงอยู่ที่ `playInstrumentNote()` ใน js/shared/piano.js (ไฟล์นั้นหน้าครูใช้ร่วม
     แต่เพิ่มแบบต่อท้ายล้วน ของเดิมไม่เปลี่ยนพฤติกรรมแม้แต่นิดเดียว) */
const HOUSE_TUNE_GAP = 300;          /* ระยะห่างระหว่างโน้ตในทำนองสั้นของเครื่องดนตรี (มิลลิวินาที) */
let houseTuneTimers = [];
function stopHouseTune(){ houseTuneTimers.forEach(clearTimeout); houseTuneTimers = []; }
/* เล่นทำนองสั้นด้วยเสียงของเครื่องนั้น — คืนความยาวรวม (มิลลิวินาที) ให้คนเรียกรู้ว่าจบเมื่อไร */
function playHouseTune(seq, voice, onStop){
  stopHouseTune();
  if(typeof MUSIC_WHITE_KEYS === 'undefined' || typeof playInstrumentNote !== 'function') return 0;
  const notes = (seq && seq.length) ? seq : [0];
  const one   = notes.length === 1;
  const hit = wi =>{
    const k = MUSIC_WHITE_KEYS[((wi | 0) % MUSIC_WHITE_KEYS.length + MUSIC_WHITE_KEYS.length)
                               % MUSIC_WHITE_KEYS.length];
    if(k) playInstrumentNote(k.freq, one ? .8 : .55, voice);
  };
  notes.forEach((wi, i)=>{
    /* ⚠ โน้ตแรกต้องดัง **ทันทีแบบ synchronous** ไม่ผ่าน setTimeout — แตะเครื่องดนตรีแล้วต้องได้ยิน
       ในเฟรมเดียวกัน ไม่งั้นรู้สึกหน่วง (และชุดเทสที่ดักฟังก์ชันเสียงจะจับไม่ได้เลย) */
    if(i === 0){ hit(wi); return; }
    houseTuneTimers.push(setTimeout(()=> hit(wi), i * HOUSE_TUNE_GAP));
  });
  const total = (notes.length - 1) * HOUSE_TUNE_GAP + 700;
  if(onStop) houseTuneTimers.push(setTimeout(onStop, total));
  return total;
}
function playInstrument(g, item){
  const lv = item.music | 0;
  decorBounce(g);                       /* เด้งเล็กน้อยทุกระดับ ให้รู้ว่าแตะโดนแล้วจริง */
  if(typeof MUSIC_WHITE_KEYS === 'undefined') return;
  if(lv >= 3){
    /* เปิดหน้า "เปียโนของหนู" ของหน้าหลักมาใช้ซ้ำทั้งดุ้น (ไม่ได้เขียนหน้าใหม่) */
    if(typeof openFreePiano === 'function'){ openFreePiano(); return; }
    /* ไม่มีหน้านั้นด้วยเหตุผลใดก็ตาม → ถอยไปเล่นทำนองสั้นแทน ห้ามเงียบไปเฉยๆ */
  }
  if(lv === 2 && item.tune && item.tune.length){
    playHouseTune(item.tune, item.voice);
    spawnMusicNotes(g, item.tune.length);
    gatherCrowd(g);
    questCaught('music', '');
    return;
  }
  /* ระดับ 1 (และตัวสำรองของระดับอื่น) — เคาะทีเดียว 1 เสียง */
  playHouseTune([item.note | 0], item.voice);
  questCaught('music', '');          /* 🎹 เควสต์ "ไปเล่นดนตรีที่บ้าน" นับทุกครั้งที่เล่นจริง */
  spawnMusicNotes(g, 1);
  gatherCrowd(g);
}
/* ================= เฟส 13: 🎺 วงดนตรีข้างถนน (ข้อ 52) =================
   เล่นเครื่องดนตรีที่วางไว้ในเมือง → ชาวบ้านที่อยู่ใกล้หยุดเดินแล้วเต้นตาม
   ยิ่งเล่นนานคนยิ่งมามุงเยอะ (เวลาเต้นสะสมขึ้นเรื่อยๆ) เล่นจนพอใจแล้วเดินจากไปได้เลย

   🔒 **ไม่มีโจทย์ ไม่มีคะแนน ไม่มีเงื่อนไขแพ้/ชนะ ไม่จ่ายเหรียญ** — เป็นของเล่นในโลก ไม่ใช่เควสต์
      ⇒ ไม่มีทางเป็น dead end ต่อให้เด็กยังไม่มีเครื่องดนตรีของตัวเอง (แค่ไม่มีอะไรให้แตะ)
   ⚠ ใช้ `hold` + ท่าโยกทับใน updateNpcs() **ไม่แตะระบบเดินของ NPC เลย**
     ⇒ พอหมดเวลาเต้น ทุกคนเดินต่อเองตามปกติ ไม่ต้องมีตัวคืนสถานะแยก */
const BAND_RANGE = 7;        /* ระยะที่ได้ยิน (ช่อง) — ไกลกว่านี้คนทั้งเมืองเต้นพร้อมกันดูแปลก */
const BAND_MAX   = 9;        /* เวลาเต้นสะสมสูงสุด (วิ) กันเล่นรัวแล้วค้างเต้นเป็นนาที */
function gatherCrowd(g){
  if(!g || hScene !== 'out' || !npcs || !npcs.length) return;
  const p = g.position;
  let joined = 0;
  for(let i = 0; i < npcs.length; i++){
    const n = npcs[i];
    if(!n.g) continue;
    const d = Math.hypot(n.g.position.x - p.x, n.g.position.z - p.z);
    if(d > BAND_RANGE) continue;
    const was = n.dance > 0;
    n.dance = Math.min(BAND_MAX, (n.dance > 0 ? n.dance : 0) + 3.2);
    /* ⚠ ลุงตกปลาไม่หันตาม — เบ็ดจะกวาดขึ้นมาบนฝั่ง (กติกาเดียวกับตอนคุย/ตอนถือเควสต์) */
    if(!n.def.fisher) n.faceT = Math.max(n.faceT || 0, 1.2);   /* หันหน้ามาทางคนเล่นดนตรี */
    if(!was) joined++;
  }
  if(joined > 0 && typeof spawnParticle === 'function'){
    for(let i = 0; i < 5; i++)
      spawnParticle(p.x + (Math.random() - .5) * 1.6, 1.2 + Math.random() * .6,
                    p.z + (Math.random() - .5) * 1.6, i % 2 ? 0xffd54f : 0x7fd4e8);
  }
}
/* ตัวโน้ตลอยขึ้นจากตัวเครื่อง — ใช้ระบบ particle เดิมของโหมดบ้าน ไม่ได้ทำระบบใหม่ */
function spawnMusicNotes(g, n){
  const p = g.position;
  for(let i = 0; i < Math.min(6, n + 1); i++)
    spawnParticle(p.x + (Math.random() - .5) * .6, 1.1 + Math.random() * .5,
                  p.z + (Math.random() - .5) * .4, i % 2 ? 0xffd54f : 0xab47bc);
}
function startSit(g, item, act){
  questEvent('sit', null);
  /* เควสต์ "กินข้าวพร้อมหน้า": นั่งโต๊ะ/เก้าอี้ **ในบ้าน** แล้วถือว่าทำงานเสร็จ */
  if(walkQuest && walkQuest.target === 'table' && hScene === 'in'
     && item && (item.cat === 'table' || item.cat === 'seat')){
    setTimeout(()=> walkQuestArrive('table'), 700);   /* ให้เห็นตัวเองนั่งลงก่อนค่อยเด้งการ์ด */
  }
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
  /* 🛏️ เฟส 17 — นอนบนเตียงตอนกลางคืน = ข้ามไปเช้าวันใหม่ (ข้อ 57.2)
     ⚠ เปลี่ยนแค่ **แสงกลางวัน/กลางคืนของฉาก** เท่านั้น (ธีมเดียวกับปุ่มบนหน้าหลัก)
       **ห้ามข้ามวันของระบบเกม** — เควสต์รายวัน/ผักที่ปลูก/ความหิวสัตว์ ยังผูกกับวันจริง
       ไม่งั้นเด็กนอนรัวๆ = รีเซ็ตเควสต์และเร่งผักได้ไม่จำกัด
     ⚠ ต้องเป็นเตียงจริง (`item.cat === 'bed'`) เก้าอี้ผ้าใบก็ใช้ act 'sleep' เหมือนกันแต่แค่เอนพัก
     ⚠ หน่วงให้เห็นตัวเองนอนลงก่อน แล้วค่อยเปลี่ยนฉาก (จังหวะเดียวกับเควสต์กินข้าวพร้อมหน้า) */
  if(act === 'sleep' && item && item.cat === 'bed' && USABLE)
    setTimeout(()=>{ if(sitState && sitState.group === g) USABLE.sleepWake(); }, 900);
  /* 📖 มุมอ่านหนังสือ: นั่งลงแล้วอ่านนิทานให้ 1 หน้า (ของชิ้นนี้ยังเป็น `action:'sit'` เหมือนเดิม
     เพราะเด็กต้องได้นั่งจริง — ตัวอ่านนิทานอยู่ใน js/house-usable.js ชุดเดียวกับชั้นหนังสือ) */
  if(act === 'sit' && item && USABLE && USABLE.useOf && (USABLE.useOf(item.id) || {}).viaSit)
    setTimeout(()=>{ if(sitState && sitState.group === g) USABLE.readBook(g); }, 700);
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
/* กล้องโหมดมือเปิดอยู่ไหม — hand tracking กินซีพียูมาก ถ้าปล่อยลูป 3D วิ่งเต็มสปีดด้วย
   เฟรมจะตกทั้งคู่ ⇒ หรี่ลงตอนกล้องเปิด (ช่วงนั้นการ์ดเควสต์บังโลกอยู่แล้ว)
   ⚠ **หรี่ด้วยการข้ามเฟรมเว้นเฟรม (ครึ่งหนึ่งพอดี) ห้ามใช้ "เว้นตามเวลา" แบบ `t - lastDrawT < 50`**
     เพราะจังหวะเฟรมจะไม่เท่ากัน (50/66/50/83 ms) แล้ว dt ไปชนเพดาน .05 บ่อยๆ
     ⇒ ของในโลกขยับกระตุกเป็นช่วงๆ (ผู้ใช้แจ้ง 2026-08-12) · เว้นเฟรมได้จังหวะสม่ำเสมอ ~30fps
     และ dt ~33ms ยังไม่ถึงเพดาน ความเร็วจึงตรงกับของจริง */
let houseFrameThrottle = false, frameOdd = false;
const frameLog = [];        /* เวลาที่ "วาดจริง" 120 เฟรมหลังสุด (เทสอ่านผ่าน __houseDbg.frameLog) */
window.HouseFrameHint = function(on){ houseFrameThrottle = !!on; frameOdd = false; };

/* ============ ท่าทางของเด็กตอนทำกิจกรรม (ปลูก · รดน้ำ · เก็บ · เหวี่ยงเบ็ด) ============
   ⚠⚠⚠ **`rig` หมุนรอบ "ฝ่าเท้า" ไม่ใช่รอบเอว** — ชิ้นส่วนทุกชิ้นถูกวางที่ y บวก (ขา .44 · หัว 1.26)
     โดย rig เองอยู่ที่ y=0 ⇒ `rig.rotation.x` = เอียงทั้งตัวเหมือนต้นไม้ล้ม
     ตอนแรกตั้ง .66 rad (38°) แล้วถ่ายภาพจริงมาดู: **เด็กนอนคว่ำหน้าจมพื้น** ขาหายไปใต้ดิน
     ⇒ 🔒 **เพดานมุมเอนคือ ~.26 rad (15°)** ห้ามเกินนี้ · ความรู้สึก "ก้มลงต่ำ" ต้องได้มาจาก
        **ย่อขา (`legX`) + ลดความสูงสะโพก (`drop`)** ไม่ใช่จากการเอนตัว
   📐 สูตรย่อตัวที่ทำให้ **เท้าไม่จมดิน**: ขาเป็นแท่งตรงหมุนรอบสะโพกที่ y = LEG_LEN
      หมุนขาไป θ ⇒ ปลายเท้าลอยขึ้น LEG_LEN·(1−cos θ) ⇒ ต้องลดสะโพกลงเท่ากันพอดี
      (ค่านี้คิดให้แล้วใน `applyCharPose` ไม่ต้องกรอก `drop` เอง เว้นแต่อยากให้ "เขย่ง/กระโดด")
   ⚠ ท่าทั้งหมดต้อง **หมุนตัวหันไปทางเป้าหมายก่อน** (ผู้เรียกยิง `faceTo()` เอง) ไม่งั้นเด็ก
     จะก้มปลูกใส่อากาศด้านหลังแปลง
   📌 ค่ามุมอ่านแบบนี้: แขน `rotation.x` **ลบ = ยกไปข้างหน้า** (-1.57 ≈ ขนานพื้น · -2.7 ≈ เหนือหัว)
      เพราะตัวละครหันหน้าไปทาง +z ในพิกัดของตัวเอง (ชุดเดียวกับท่าเดิน) */
const CH_ARM_Z = [-.16, .16];        /* มุมกางไหล่ตอนยืนเฉยๆ (ตรงกับที่ buildCharacter ตั้งไว้) */
const CH_LEG_LEN = .44;              /* ระยะสะโพก→พื้น (buildCharacter วาง pivot ขาที่ y .44) */
const CH_LEAN_MAX = .26;             /* 🔒 เพดานมุมเอนตัว — เกินนี้เห็นเป็น "ล้ม" ไม่ใช่ "ก้ม" */
/* คืนค่าท่าของเฟรมนั้น: {lean, legX, hop, aL, aR, zL, zR} */
function charPoseAt(kind, pr){
  const p = {lean:0, legX:0, hop:0, aL:0, aR:0, zL:CH_ARM_Z[0], zR:CH_ARM_Z[1]};
  /* เฟส 12.1 — ท่าประจำของเล่นสัตว์เลี้ยงอยู่ใน js/house-pet-toys.js ถามไฟล์นั้นก่อน
     ไม่รู้จักชื่อท่านี้ = ตกมาใช้ตารางข้างล่างตามเดิม (เพดาน lean ยังหนีบให้ท้ายฟังก์ชันเหมือนกัน) */
  let tp = PET_TOYS3D.pose ? PET_TOYS3D.pose(kind, pr, {ARM_Z: CH_ARM_Z}) : null;
  /* 🪑 เฟส 17 — ท่าใหม่ของของตกแต่งที่ใช้งานได้ (อ่านหนังสือ ฯลฯ) อยู่ใน js/house-usable.js */
  if(!tp && USABLE && USABLE.pose) tp = USABLE.pose(kind, pr, {ARM_Z: CH_ARM_Z});
  if(tp){
    Object.assign(p, tp);
  }else if(kind === 'talk'){
    /* 💬 ท่าคุยกัน — ยืนตรง โยกตัวเบาๆ + ยกมือประกอบคำพูดสลับข้าง (ผู้ใช้สั่ง 2026-08-16) */
    const w2 = Math.sin(pr * Math.PI * 6);
    p.lean = .04 * w2;
    p.aL = -.55 + .35 * Math.sin(pr * Math.PI * 5);
    p.aR = -.45 + .35 * Math.sin(pr * Math.PI * 5 + 1.6);
    p.zL = CH_ARM_Z[0] * .55; p.zR = CH_ARM_Z[1] * .55;
  }else if(kind === 'hide'){
    /* 🙈 ท่านับเลขของเกมซ่อนแอบ — **นั่งยองปิดตา** (ผู้ใช้สั่ง 2026-08-16)
       ⚠ `rig` หมุนรอบฝ่าเท้า เอนเกิน .26 rad เห็นเป็นล้มคว่ำ (กติกาเดิมของเฟส 12.1)
         ⇒ ทำ "นั่งยอง" ด้วยการ **ย่อขา (legX)** ไม่ใช่เอนตัวลงไปเยอะ
       ⚠ **ห้ามใส่ `hop` ติดลบ** — `applyCharPose` ลดสะโพกให้พอดีกับขาที่งอ**อยู่แล้ว**
         (`rig.position.y = -CH_LEG_LEN*(1-cos(legX)) + hop`) ใส่ hop ติดลบทับ = **ขาจมพื้น**
         (ผู้ใช้แจ้ง 2026-08-16) · `hop` มีไว้สำหรับท่าที่ตั้งใจให้ "ลอย" เท่านั้น
       ⏱️ จังหวะของท่า (ความยาวรวม 5.9 วิ = นับ 5 + ลุกยืน .9):
            0-1.0 วิ  ย่อลงนั่งยอง   ·  1.0-5.0 วิ  ค้างไว้  ·  5.0-5.9 วิ  **ลุกขึ้นยืน**
       ⚠ **ต้องมีช่วงลุกยืนเสมอ** — ปล่อยให้ท่าหมดอายุเฉยๆ ตัวจะเด้งกลับท่ายืนทันทีแบบแข็งๆ
         (ผู้ใช้แจ้ง 2026-08-16) · ใช้ smoothstep ทั้งขาลงและขาขึ้นให้ดูนุ่ม
       ⚠ **เลขจังหวะผูกกับความยาวท่าที่ js/house-play.js เรียกมา** — แก้ที่หนึ่งต้องแก้อีกที่ */
    const HIDE_DUR = 5.9, HIDE_UP = 1.0 / HIDE_DUR, HIDE_DOWN = 5.0 / HIDE_DUR;
    const sm = v => { const x = Math.max(0, Math.min(1, v)); return x * x * (3 - 2 * x); };
    const ph = pr < HIDE_UP   ? sm(pr / HIDE_UP)
             : pr < HIDE_DOWN ? 1
                              : sm(1 - (pr - HIDE_DOWN) / (1 - HIDE_DOWN));
    p.lean = .20 * ph;
    p.legX = -.95 * ph;                        /* งอเข่าลึก = นั่งยอง (สะโพกลดตามเอง) */
    p.aL = -2.05 * ph; p.aR = -2.05 * ph;      /* ยกแขนขึ้นหน้า */
    p.zL = -.05 * ph;  p.zR = .05 * ph;        /* หุบเข้าหากัน = มือปิดตา */
  }else if(kind === 'plant'){
    /* ย่อเข่าลงไปจิ้มเมล็ดลงดิน — ค้างท่าย่อช่วงกลางให้เห็นชัด แล้วค่อยลุก */
    const c = pr < .3 ? pr/.3 : (pr < .68 ? 1 : 1 - (pr-.68)/.32);
    p.legX = c*.34; p.lean = c*.20; p.hop = -c*.10;
    p.aL = -c*1.5; p.aR = -c*1.5;
    p.zL = CH_ARM_Z[0] + c*.11; p.zR = CH_ARM_Z[1] - c*.11;   /* มือ 2 ข้างชิดเข้ากลางเหมือนกำเมล็ด */
  }else if(kind === 'water'){
    /* ยกบัวรดน้ำด้วย 2 มือแล้วเอียงรด — มีสะบัดข้อมือไปมาให้เห็นว่ากำลังรด ไม่ใช่ยื่นแขนค้าง
       ไม่ย่อขา (ยืนรดน้ำ) แต่ถ่ายน้ำหนักไปข้างหน้านิดหน่อย */
    const c = pr < .18 ? pr/.18 : (pr < .84 ? 1 : 1 - (pr-.84)/.16);
    const wob = Math.sin(pr*Math.PI*6) * .17 * c;
    p.lean = c*.15; p.legX = c*.18;
    p.aL = -c*1.62 + wob; p.aR = -c*1.44 + wob;
    p.zL = CH_ARM_Z[0] - c*.26; p.zR = CH_ARM_Z[1] + c*.10;
  }else if(kind === 'harvest'){
    /* 2 จังหวะ: ย่อลงดึงผักขึ้นจากดิน → ยืดตัวชูของขึ้นเหนือหัวดีใจ (เขย่งขึ้นด้วย) */
    if(pr < .42){
      const c = Math.sin(pr/.42 * Math.PI);
      p.legX = c*.32; p.lean = c*.19; p.hop = -c*.09;
      p.aL = -c*1.55; p.aR = -c*1.55;
    }else{
      const c = Math.sin((pr-.42)/.58 * Math.PI);
      p.lean = -c*.12; p.hop = c*.15;                         /* เขย่งลอยขึ้นตอนชูของ */
      p.aL = -c*2.75; p.aR = -c*2.75;
      p.zL = CH_ARM_Z[0] - c*.20; p.zR = CH_ARM_Z[1] + c*.20;
      p.legX = -c*.14;                                        /* ปลายเท้าชี้ลงเล็กน้อยตอนลอย */
    }
  }else if(kind === 'cast'){
    /* 3 จังหวะ: ยกคันขึ้นข้ามไหล่ (เอนหลัง) → สะบัดไปข้างหน้าเร็วๆ → ค้างท่าถือคันรอปลา
       ⚠ จังหวะสะบัดต้องสั้นกว่าจังหวะยก ไม่งั้นดูเป็น "ยกแขนช้าๆ" ไม่ใช่ "เหวี่ยง" */
    if(pr < .36){
      const c = pr/.36;
      p.lean = -c*.16; p.aR = c*1.15; p.aL = c*.30;
    }else if(pr < .56){
      const c = (pr-.36)/.20;
      p.lean = -.16 + c*.38; p.aR = 1.15 - c*2.95; p.aL = .30 - c*1.25;
    }else{
      const c = Math.min(1, (pr-.56)/.30);
      p.lean = .22 - c*.16; p.aR = -1.80 + c*.72; p.aL = -.95 + c*.30;
      p.legX = c*.12;                                         /* ย่อเข่านิดๆ ท่ายืนถือคันเบ็ด */
    }
    p.zR = CH_ARM_Z[1] - .09;                                 /* มือขวาเข้าใกล้ลำตัวเหมือนกำคันเบ็ด */
  }else if(kind === 'pull'){
    /* ดึงเบ็ด 3 จังหวะ (ผู้ใช้สั่งเพิ่ม 2026-08-14): กระตุกคันขึ้นแรงๆ → เอนหลังออกแรงดึง
       → ยกปลาขึ้นมาดู · เริ่มจากท่า 'cast' ค้าง (แขนขวายื่นหน้า −1.08) จึงต้องต่อจากค่านั้น
       ไม่ใช่เริ่มจาก 0 ไม่งั้นแขนจะกระตุกวาร์ปตอนสลับท่า */
    /* ⚠ **แขนห้ามยกเลย ~2.0 rad** — กล้อง isometric มองลงเกือบจากบนหัว มือที่ยกสูงกว่านั้น
       จะไปหลบอยู่หลังหัวจนมองไม่เห็นเลย (ถ่ายภาพจริงมาดูแล้ว 2026-08-14)
       ท่า "ชูปลาขึ้นดู" จึงใช้วิธี **กางแขนออกข้าง (`z`)** แทนการยกให้สูงขึ้นอีก */
    const A0 = -1.08, B0 = -.65;                              /* ท่าตั้งต้น = ปลายท่า 'cast' */
    if(pr < .18){                                             /* กระตุกขึ้นเร็วมาก (ตกใจว่าปลากิน) */
      const c = pr/.18;
      p.aR = A0 - c*.92; p.aL = B0 - c*.85;
      p.lean = -c*.12; p.legX = .12 + c*.20;
      p.zR = CH_ARM_Z[1] - .09;
    }else if(pr < .55){                                       /* เอนหลังออกแรงดึง + สั่นเป็นจังหวะ */
      const c = (pr-.18)/.37;
      const shake = Math.sin(c*Math.PI*5) * .17;
      p.aR = -2.0 + shake; p.aL = -1.5 + shake;
      p.lean = -.12 - c*.14; p.legX = .32 - c*.10;
      p.zR = CH_ARM_Z[1] - .09;
    }else{                                                    /* ชูปลาขึ้นมาดู — กางแขนออกข้าง + เขย่งดีใจ */
      const c = (pr-.55)/.45;
      const up = Math.sin(c*Math.PI);
      p.aR = -2.0 + up*.55; p.aL = -1.5 + up*.05;
      p.lean = -.26 + c*.26; p.hop = up*.11;
      p.zR = CH_ARM_Z[1] - .09 + up*.52; p.zL = CH_ARM_Z[0] - up*.46;
    }
  }else if(kind === 'pat'){
    /* เฟส 12 · ลูบหัวน้อง: ย่อเข่าลงหาน้อง ยื่นมือขวาไปข้างหน้าแล้วลูบขึ้นลงเบาๆ
       (มือซ้ายยกเล็กน้อยเหมือนประคอง ไม่ปล่อยห้อยข้างตัวจนดูแข็ง) */
    const c = pr < .2 ? pr/.2 : (pr < .82 ? 1 : 1 - (pr-.82)/.18);
    const rub = Math.sin(pr*Math.PI*5) * .22 * c;
    p.legX = c*.24; p.lean = c*.17; p.hop = -c*.06;
    p.aR = -c*1.35 + rub; p.aL = -c*.28;
    p.zR = CH_ARM_Z[1] - c*.15;
  }else if(kind === 'scrub'){
    /* เฟส 12 · อาบน้ำ: ย่อตัวลงถูตัวน้องด้วย 2 มือ — แขนสลับหน้า-หลังคนละเฟส ให้เห็นเป็น "ถู" */
    const c = pr < .15 ? pr/.15 : (pr < .88 ? 1 : 1 - (pr-.88)/.12);
    const w = Math.sin(pr*Math.PI*8) * .3 * c;
    p.legX = c*.3; p.lean = c*.2; p.hop = -c*.09;
    p.aL = -c*1.5 + w; p.aR = -c*1.5 - w;
    p.zL = CH_ARM_Z[0] - c*.2; p.zR = CH_ARM_Z[1] + c*.2;
  }else if(kind === 'throw'){
    /* เฟส 12 · โยนบอล: เอนหลังยกแขนข้ามไหล่ → สะบัดไปหน้าเร็วๆ → ค้างท่าชี้ตามบอล
       ⚠ ช่วงสะบัดต้องสั้นกว่าช่วงยก (เหมือน 'cast') ไม่งั้นดูเป็นยกแขนช้าๆ ไม่ใช่ขว้าง */
    if(pr < .34){ const c = pr/.34;        p.lean = -c*.15;      p.aR = c*1.25;       p.aL = c*.2; }
    else if(pr < .52){ const c = (pr-.34)/.18; p.lean = -.15+c*.33; p.aR = 1.25-c*3.05; p.aL = .2-c*.9; }
    else{ const c = Math.min(1,(pr-.52)/.4); p.lean = .18-c*.16; p.aR = -1.8+c*1.1; p.aL = -.7+c*.5; p.legX = c*.1; }
  }else if(kind === 'cue'){
    /* เฟส 12 · สอนท่า: ยกมือขวาขึ้นเหนือหัวเป็นสัญญาณให้น้องดู แล้วปรบมือชมตอนน้องทำได้ */
    if(pr < .62){
      const c = Math.min(1, pr/.18);
      p.aR = -c*2.5 + Math.sin(pr*Math.PI*7)*.18*c;
      p.zR = CH_ARM_Z[1] + c*.22; p.lean = -c*.06;
    }else{
      const c = Math.sin((pr-.62)/.38*Math.PI), cl = Math.sin(pr*Math.PI*16);
      p.aL = -c*1.5; p.aR = -c*1.5;
      p.zL = CH_ARM_Z[0] + c*(.26 + cl*.13);   /* มือ 2 ข้างชิดเข้ากลาง = ปรบมือ (ทิศเดียวกับท่า 'plant') */
      p.zR = CH_ARM_Z[1] - c*(.26 + cl*.13);
      p.hop = c*.05;
    }
  }
  p.lean = Math.max(-CH_LEAN_MAX, Math.min(CH_LEAN_MAX, p.lean));
  return p;
}
function applyCharPose(u, kind, pr){
  const p = charPoseAt(kind, pr);
  u.rig.rotation.x = p.lean;
  /* สะโพกลดลงพอดีกับที่ปลายเท้าลอยขึ้นจากการหมุนขา ⇒ เท้าอยู่ระดับพื้นเสมอ ไม่จมไม่ลอย
     (`hop` คือส่วนที่ "ตั้งใจให้ลอย" เช่นตอนกระโดดดีใจ — บวกทับทีหลัง) */
  u.rig.position.y = -CH_LEG_LEN * (1 - Math.cos(p.legX)) + p.hop;
  /* ⚠ ขาเป็นลูกของ rig ⇒ มุมจริงบนโลก = lean + rotation.x ⇒ ต้องหักลบ lean ออกก่อน */
  u.legs[0].rotation.x = p.legX - p.lean; u.legs[1].rotation.x = p.legX - p.lean;
  u.arms[0].rotation.x = p.aL; u.arms[0].rotation.z = p.zL;
  u.arms[1].rotation.x = p.aR; u.arms[1].rotation.z = p.zR;
}
/* คืนทุกข้อต่อกลับท่ายืน — ต้องเรียกทุกครั้งที่เลิกท่า ไม่งั้นตัวเอียงค้าง
   (สาขา "เดิน" กับ "ยืนเฉยๆ" เขียนทับแค่ `rotation.x` ของแขน/ขา ไม่ได้แตะ rig/rotation.z) */
function clearCharPose(u){
  if(!u) return;
  u.rig.rotation.x = 0; u.rig.position.y = 0;
  u.legs[0].rotation.x = 0; u.legs[1].rotation.x = 0;
  u.arms[0].rotation.set(0, 0, CH_ARM_Z[0]);
  u.arms[1].rotation.set(0, 0, CH_ARM_Z[1]);
}
function frame(t){
  if(!houseOpen) return;
  rafId = requestAnimationFrame(frame);
  if(houseFrameThrottle){
    frameOdd = !frameOdd;
    if(frameOdd) return;                /* วาดเว้นเฟรม = ~30fps จังหวะเท่ากันทุกเฟรม */
  }
  const dt = Math.min(.05, (t - lastT)/1000 || 0);
  const _fpsDt = t - lastT, _fps0 = FPS_PANEL ? performance.now() : 0;
  lastT = t;
  frameLog.push(t); if(frameLog.length > 120) frameLog.shift();
  updateLightLerp(dt);
  /* เควสต์ "ไปตลาด": เช็คทุกเฟรม (ราคาถูกมาก — เทียบพิกัด 4 ครั้งเมื่อมีงานค้างเท่านั้น)
     ⚠ เช็คแค่ตอนก้าวถึงช่องใหม่ไม่พอ — เด็กอาจถูกวาร์ป/เริ่มเกมมาทั้งที่ยืนอยู่ในตลาดแล้ว */
  if(walkQuest) walkQuestTileCheck();
  updateWalkMark(t);              /* รอยเท้าปลายทาง — ซ่อน/โชว์ตามสถานะเดินจริงทุกเฟรม */
  if(window.HousePlay) window.HousePlay.tick(dt, t);   /* มินิเกมกลุ่ม A (เฟส 11) */
  if(window.HouseTutor) window.HouseTutor.tick(dt);    /* 🎓 ระบบสอนเล่น (เฟส 15) */
  updateFishZoom(dt);             /* 🎣 ซูมเข้า/ออกนุ่มๆ ตอนยืนจุดตกปลา */
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
    if(feedAnim){ updateFeedAnim(dt, u); }      /* ป้อนอาหาร: คุมทั้งท่าเด็กและตัวน้องพร้อมกัน */
    else if(slideRide){ updateSlideRide(dt, t, u); }
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
      /* เดินอยู่ = ยกเลิกท่ากิจกรรมที่ค้าง ⚠ ต้องล้างข้อต่อด้วย ไม่ใช่แค่ทิ้ง charAct
         (สาขาเดินเขียนทับแค่ rotation.x ของแขน/ขา ตัวจะเอียงค้างตามท่าเดิม)
         ⚠ **ต้องอยู่ก่อน `finishArrive()` ของบล็อกข้างล่าง** — ของเดิมอยู่ท้ายสาขา ⇒ ท่าที่
           `finishArrive()` เพิ่งตั้ง (อ่านหนังสือ/ล้างหน้า ฯลฯ) ถูกล้างทิ้งในเฟรมเดียวกันแบบเงียบๆ
           (บั๊กจริงที่เจอตอนทำเฟส 17 · ท่าของเฟส 11 ไม่โดนเพราะตั้งท่าแบบหน่วงเวลาไว้) */
      if(charAct){ charAct = null; clearCharPose(u); }
      const a = tileWorld(from), b = tileWorld(to);
      const k = Math.min(1, hChar.segT);
      charGroup.position.lerpVectors(a, b, k);
      if(from.x!==to.x || from.z!==to.z) hChar.targetRotY = Math.atan2(b.x-a.x, b.z-a.z);
      if(k>=1){
        hChar.segT = 0; hChar.tile = to; hChar.segFrom = to; hChar.seg++;
        walkQuestTileCheck();          /* เควสต์ไปตลาด: เช็คทุกช่องที่ก้าวถึง ไม่ต้องเดินจนสุดทาง */
        if(hChar.seg >= hChar.path.length){
          hChar.path = []; hChar.walking = false;
          finishArrive();
          saveCharSpot();          /* 📍 เดินถึงที่แล้วจดตำแหน่งไว้ (หน่วง 1.5 วิในตัว) */
        }
      }
      if(u){
        const sw = Math.sin(t*.014)*.55;
        u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw;
        u.arms[0].rotation.x = -sw*.8; u.arms[1].rotation.x = sw*.8;
        u.rig.position.y = Math.abs(Math.sin(t*.014))*.05;
      }
    }else if(u && charAct){
      /* ---------- ท่าทางตอนทำกิจกรรม (เฟส 11) ----------
         ⚠ ต้องอยู่ **ก่อน** สาขา sitState/ยืนเฉยๆ ไม่งั้นท่ายืนจะเขียนทับทุกเฟรมจนไม่เห็นอะไร */
      const pr = Math.min(1, (performance.now() - charAct.t0) / charAct.dur);
      applyCharPose(u, charAct.kind, pr);
      /* `hold` = ค้างท่าสุดท้ายไว้จนกว่าจะสั่งเลิก (ใช้กับ 'cast' — เหวี่ยงแล้วต้องถือคันรอปลาอยู่
         ถ้าปล่อยกลับท่ายืนทันที เด็กจะเห็นทุ่นลอยอยู่ในน้ำแต่ตัวเองยืนเฉยๆ เหมือนไม่ได้ตกปลา) */
      if(pr >= 1 && !charAct.hold){ charAct = null; clearCharPose(u); }
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
    updateNpcMarks(t);
    updateFx(t, dt);
    if(petAct) updatePetAct(dt); else updatePet(dt);   /* กำลังทำกิจกรรมอยู่ = ยึดการควบคุมน้องไว้ทั้งตัว */
    updatePetDirt(dt);            /* ไอเหม็นลอยขึ้น — ต้องขยับแม้ตอนน้องกำลังเล่นของเล่น */
    updatePetCare(dt);
    syncPetSick();
    syncPetMood();
    updateParents(dt, t);
    updateParentMarks(t);
  }
  updateNameLabel();
  updatePetLabels();
  updateNpcLabels();
  updateParentLabels();
  updateCompass();
  updateQuestArrow();
  updateCoinBadge();
  updatePosChip();
  updateLamps(t, dt);
  updateStreetLamps(dt);
  const _fps1 = FPS_PANEL ? performance.now() : 0;
  renderer.render(scene, camera);
  if(FPS_PANEL) fpsPanelTick(_fpsDt, _fps1 - _fps0, performance.now() - _fps1);
  /* กรอบพรีวิวสินค้าลอยข้างกล่องร้าน — วาดทับเป็นรอบที่ 2 หลังฉากเมือง (ดู renderPreviewInset) */
  if(prevModel){
    if(prevSpin) prevRotY += dt*.7;
    prevHolder.rotation.y = prevRotY;
    prevHolder.position.y = Math.sin(t*.0022)*.03;   /* ลอยขึ้นลงเบาๆ ให้ดูมีชีวิต */
    renderPreviewInset();
  }
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
  /* 🎵 เฟส 14 — สลับมาใช้เพลงธีมฟาร์มของโหมดบ้าน (ปล่อยคืนที่ stopHouseGame)
     ⚠ ตัวสลับ idempotent อยู่แล้ว (setMusicPlaylist เช็คว่าเป็นชุดเดิมไหม) ⇒ เรียกซ้ำได้
     ⚠ **ห้ามย้ายไปผูกกับ switchScene()** — ตัวนั้นถูกเรียกทุกครั้งที่เดินเข้าประตู เพลงจะเริ่มใหม่รัวๆ */
  if(window.HouseMusic) HouseMusic.use();
  $('house-char-name').textContent = activeChild.name;
  syncHouseCtrls();
  setHouseCtrlOpen(false);        /* เข้าบ้านใหม่ทุกครั้ง เริ่มที่เฟืองพับไว้เสมอ */
  houseSyncChild();
  fadeIn();
  if(!critters.length) critterSpawnT = Math.min(critterSpawnT, 2.5);

  /* บ้านผูกกับเด็กที่เลือกเสมอ — สลับเด็กแล้วต้องโหลดตัวละคร/ตำแหน่งของคนใหม่ */
  const childChanged = loadedChildId !== activeChild.id;
  loadedChildId = activeChild.id;
  initQuest();
  /* เควสต์วันนี้ของเด็กคนนี้ (สุ่มใหม่ทุกวัน) — โหลดใหม่ทุกครั้งที่เข้าบ้าน เผื่อข้ามเที่ยงคืนระหว่างเล่น */
  if(QUESTS){ QUESTS.reset(); buildNpcMarks(); }
  refreshQuestMark(); renderQuestList();
  closeQuestPanel();
  if(childChanged){
    hScene = 'out';
    worldGroup.visible = true; interiorGroup.visible = false;
    hChar.tile = {x:SPAWN_TILE.x, z:SPAWN_TILE.z};
    hChar.path = []; hChar.walking = false; hChar.pendingEnter = false; hChar.pendingExit = false;
    hChar.targetRotY = Math.PI/4;
    /* 📍 เด็กคนนี้เคยเล่นแล้ว → กลับไปยืนจุดเดิมที่ออกไป (ผู้ใช้สั่ง 2026-08-16)
       ⚠ ต้องอยู่ **หลัง** ตั้งค่าเริ่มต้น เพื่อให้มีค่าตั้งต้นรออยู่แล้วถ้ากู้ไม่สำเร็จ */
    restoreCharSpot();
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
    refreshChromeBtns();
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
  /* 👪 **กลับเข้าเมืองตอนที่ออกไปขณะอยู่ในบ้าน — ต้องสร้างพ่อแม่ให้ด้วย**
     (บั๊กที่ผู้ใช้แจ้ง 2026-08-22: ออกจากเกมตอนอยู่ในบ้าน กลับมาแล้วพ่อแม่หายไปทั้งคู่)
     ปกติพ่อแม่ถูกสร้างตอน `switchScene('in')` = จังหวะ "เดินเข้าประตูบ้าน" เท่านั้น
     แต่ `restoreCharSpot()` ตั้ง `hScene='in'` ตรงๆ โดยไม่ผ่าน switchScene ⇒ ไม่มีใครสร้างให้เลย
     ⚠ ต้องอยู่ **ท้ายสุด หลัง `loadDecorForChild()`** — `buildParents()` snap จุดยืนด้วย `inGrid`
       ซึ่งจะเป็นกริดของเด็กคนก่อนถ้าเรียกก่อนโหลดเฟอร์นิเจอร์
     ⚠ ข้ามตอนอยู่หน้าสร้างตัวละคร (openCreator) — จบ creator แล้วมีทางสร้างของตัวเองอยู่แล้ว */
  if(hScene === 'in' && hMode === 'world') buildParents();
  lastT = performance.now();
  /* เฟส 11 — มินิเกมกลุ่ม A ที่เล่นในโลก 3D (js/house-play.js) · ไฟล์นั้นอาจยังไม่โหลดก็ไม่พัง */
  if(window.HousePlay) window.HousePlay.start();
  if(window.HouseTutor) window.HouseTutor.start();     /* 🎓 บทเรียนเริ่มเองถ้ายังเรียนไม่จบ */
  houseStarted = true;          /* ✅ เข้าบ้านเสร็จสมบูรณ์แล้ว (ชุดเทสรอสัญญาณนี้ ดู __houseDbg.ready) */
  rafId = requestAnimationFrame(frame);
}
/* ⚠ **ห้ามใช้ `__houseDbg.mode() === 'world'` เป็นสัญญาณว่า "เข้าบ้านเสร็จแล้ว"** —
   `hMode` มีค่าเริ่มต้นเป็น 'world' ตั้งแต่ house.js โหลดเสร็จ (บรรทัด ~136) ทั้งที่ startHouseGame()
   ยังไม่ทำงาน ⇒ เทสที่รอแค่ค่านี้จะแอบเปิดการ์ด/แผงก่อนบ้านพร้อม แล้ว startHouseGame() ที่ตามมา
   ทีหลังจะ closeQuestPanel() ปิดทิ้งให้เงียบๆ (เทสแดงแบบสุ่มๆ หาสาเหตุยากมาก — เจอ 2026-08-10)
   ⇒ ให้รอ `__houseDbg.ready()` แทนเสมอ */
let houseStarted = false;

/* ================= 📍 จำที่ที่เด็กยืนล่าสุด (2026-08-16 · ผู้ใช้สั่ง) =================
   ออกจากเมืองแล้วกลับเข้ามาใหม่ ต้องอยู่จุดเดิม ไม่ใช่เด้งกลับหน้าบ้านทุกครั้ง
   ⚠ เก็บ **ฉากด้วย** (ในบ้าน/นอกบ้าน) ไม่งั้นออกตอนอยู่ในบ้านแล้วกลับมาโผล่นอกบ้าน
   ⚠ ต้องเช็คว่าช่องนั้น **ยังเดินได้อยู่** ตอนโหลด — ผังเมืองอาจเปลี่ยน (mapV) หรือเด็กย้ายของ
     ทับช่องนั้นไปแล้ว ⇒ ถอยไปจุดตั้งต้นแทน ดีกว่าเด็กติดอยู่ในกำแพง */
let lastSpotSave = 0;
function saveCharSpot(force){
  if(!hChar || !hChar.tile || !activeChild || !houseOpen) return;
  /* หน่วงไว้ 1.5 วิ — เด็กเดินยาวๆ จะได้ไม่เขียน localStorage รัวทุกช่อง
     (`force` ใช้ตอนออกจากเกม/ปิดแอป ซึ่งต้องเซฟให้ได้แน่ๆ) */
  const now = Date.now();
  if(!force && now - lastSpotSave < 1500) return;
  lastSpotSave = now;
  saveHouseData({spot:{x: hChar.tile.x, z: hChar.tile.z, scene: hScene}});
}
/* ⚠ **ต้องเซฟตอน "ปิดแอป" ด้วย ไม่ใช่แค่ตอนกดออกจากเมือง** (ผู้ใช้แจ้ง 2026-08-16)
   เด็กปิดแท็บ/สลับแอปบนแท็บเล็ต ⇒ `stopHouseGame()` ไม่ถูกเรียกเลย ตำแหน่งจึงไม่เคยถูกบันทึก
   ⚠ บนมือถือ **`beforeunload` ไม่ทำงานเชื่อถือได้** — ต้องใช้ `visibilitychange` (สลับแอป/ล็อกจอ)
     กับ `pagehide` (ปิดแท็บ) ⇒ ใส่ทั้งคู่ ไม่ใช่อย่างใดอย่างหนึ่ง */
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState === 'hidden') saveCharSpot(true);
});
window.addEventListener('pagehide', ()=> saveCharSpot(true));
function restoreCharSpot(){
  const d = loadHouseData() || {};
  const sp = d.spot;
  if(!sp || typeof sp.x !== 'number') return false;
  /* ⚠ **ตอนเข้าเมืองใหม่ กริดผังเมืองอาจยังไม่ถูกสร้าง** — ถ้าเช็ค `isWalk` ตอนนั้นจะได้ false
       ทุกครั้งแล้วเด้งกลับจุดตั้งต้นเสมอ (เจอจากเทสจริง 2026-08-16: บันทึก 26,30 แต่กลับมาที่ 21,37)
     ⇒ กริดยังไม่พร้อม = เชื่อค่าที่บันทึกไว้ไปก่อน (ตอนบันทึกมันเดินได้อยู่แล้ว)
       กริดพร้อมแล้วค่อยตรวจจริง เผื่อผังเมืองเปลี่ยนหรือเด็กวางของทับช่องนั้น */
  const okTile = (grid, W2, D2, x, z) =>
    (!grid || !grid.length) ? true : isWalk(grid, W2, D2, x, z);
  if(sp.scene === 'in'){
    hScene = 'in';
    worldGroup.visible = false; interiorGroup.visible = true;
    hChar.tile = okTile(inGrid, IN_W, IN_D, sp.x, sp.z)
      ? {x:sp.x, z:sp.z} : {x:IN_DOOR_TILE.x, z:IN_DOOR_TILE.z + 1};
  }else{
    hScene = 'out';
    worldGroup.visible = true; interiorGroup.visible = false;
    hChar.tile = okTile(outGrid, OUT_W, OUT_D, sp.x, sp.z)
      ? {x:sp.x, z:sp.z} : {x:SPAWN_TILE.x, z:SPAWN_TILE.z};
  }
  hChar.path = []; hChar.walking = false; hChar.pendingEnter = false; hChar.pendingExit = false;
  hChar.targetRotY = Math.PI / 4;
  return true;
}
function stopHouseGame(){
  saveCharSpot(true);    /* 📍 จำที่ที่เด็กยืนไว้ กลับเข้ามาใหม่จะได้อยู่จุดเดิม */
  walkQuest = null;      /* งานเดินที่ค้างอยู่ไม่ถือว่าทำเสร็จ — กลับมาคุยกับพ่อแม่รับใหม่ได้ */
  guideCol = false;      /* 🍃 โหมดนำทางไปของประจำวันไม่ค้างข้ามรอบ */
  if(window.HouseMusic) HouseMusic.release();   /* 🎵 คืน playlist ให้หน้าหลัก */
  if(editMode) exitEditMode();
  if(sitState) endSit();
  endFeedAnim();                 /* ออกจากบ้านกลางอนิเมชันป้อนอาหาร → เก็บชามทิ้ง ไม่ให้ค้างในฉาก */
  { const cv = $('house-canvas'); if(cv) cv.classList.remove('house-talk-hover'); }   /* กันเคอร์เซอร์ฟองคำพูดค้าง */
  houseOpen = false;
  if(window.HousePlay) window.HousePlay.stop();
  if(window.HouseTutor) window.HouseTutor.stop();
  clearPlayObjs();               /* ของของมินิเกมกลุ่ม A ต้องไม่ค้างในฉากข้ามรอบการเล่น */
  qzOnClose = null;              /* ออกจากบ้านแล้ว ห้ามให้หน้าคลังคำถามเด้งกลับมาทับหน้าหลัก */
  closeQuestBoard();
  closeQuestPanel();
  if(window.HouseQB) window.HouseQB.close();
  if(window.HouseDev) window.HouseDev.close();
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
      /* ยกแขนขึ้น-ลงด้วย ease (เดิมเป็นเส้นตรง หัว-ท้ายจะสะดุด) แล้วค่อยสะบัดมือ
         🖐️ **ต้องเป็นแขนข้าง `arms[0]` เท่านั้น** (ผู้ใช้สั่ง 2026-08-20)
            อีกข้าง (`arms[1]`) คือแขนที่ `addHoldItem()` เอาของไปแขวนไว้ในหน้าแต่งตัว
            โบกข้างนั้นแล้วของที่ถือจะเหวี่ยงตามขึ้นไปด้วย
         ⚠ ทิศหมุนของ 2 ข้างกลับด้านกัน (สร้างจาก `[-1,1].map`) ⇒ เป้าหมายต้องติดลบ */
      const k = hbEase(Math.min((HB_WAVE_DUR-hbWaveK)*2.6, hbWaveK*2.6));
      armLT = (1-k)*armLT + k*(-(2.35 + Math.sin(t*13)*.38));
      headT -= k*.07;                                             /* เอียงหัวเข้าหามือที่โบก */
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

/* ---------- 👤 ตัวละครเต็มตัวบนหน้าเลือกเด็ก (หน้าแรกรวมร่าง · js/app-home2.js) ----------
   ต่างจาก "เพื่อนซี้หน้าหลัก" (hb* ด้านบน) ตรงที่:
     • อ่านข้อมูลจาก childId ที่ส่งเข้ามา ไม่ใช่ activeChild (ตอนนั้นยังไม่ได้เลือกเด็ก)
     • กล้องเฟรมเต็มตัว (hb เฟรมครึ่งบนเพราะกล่องเตี้ย)
   🔒 renderer/canvas ตัวเดียวใช้ซ้ำทุกคน — แตะเด็กคนใหม่ = สลับเฉพาะโมเดล
      **ห้ามสร้าง renderer ต่อแถว** แท็บเล็ตเด็กเปิด WebGL context พร้อมกันได้ไม่กี่ตัว */
let cvR=null, cvS=null, cvCam=null, cvChar=null, cvPet=null, cvShadC=null, cvShadP=null;
let cvRaf=null, cvLast=0, cvT=0, cvKey='', cvCanvas=null;
let cvArmL=0, cvArmR=0, cvHeadZ=0, cvWaveT=1.2, cvWaveK=0, cvHopT=1.4, cvHopK=0, cvJumpK=0;
const CV_IDLE_MS = 1000/30;
let CV_HALF = 1.72;
let CV_AIM  = 1.50;   /* จุดเล็งกล้อง — ยกสูงเพื่อดันตัวละครลงมาอยู่ล่างเฟรม เหลือที่ว่างด้านบนให้ฉาก */   /* ครึ่งความสูงกรอบกล้อง (world unit) — เล็กลง = ซูมเข้า */
/* ฉากจำลองรอบตัวละคร — สนามหญ้าลายตาราง + รั้วขาว + ต้นไม้ + พุ่ม (สี/ทรงชุดเดียวกับเมืองจริง)
   🎥 กล้องใช้มุมเดียวกับในเมือง (CAM_DIR) ⇒ แกนบนจอไม่ตรงกับแกนโลก:
      "ขวาบนจอ" = (1,0,-1)/√2 · "บนของจอ" = (-1,1.73,-1)/2
   ⇒ ของประกอบฉากอยู่ใน group ที่หมุน 45° ให้แกน local ตรงกับแกนจอ **จัดตำแหน่งง่ายกว่ามาก**
      (รั้วในเมืองมีทั้ง 2 แนวอยู่แล้ว แนวนี้จึงยังดูเป็นเมืองเหมือนเดิม)
   ⚠ พื้นหญ้า **ไม่หมุน** — ลายตารางต้องเอียงเป็นข้าวหลามตัดเหมือนบล็อกพื้นในเมือง
   ⚠ สร้างครั้งเดียวตอน init สลับเด็กเปลี่ยนเฉพาะตัวละคร/สัตว์เลี้ยง */
function cvDiorama(){
  const g = new THREE.Group();
  const tileGeo = new THREE.BoxGeometry(1, .2, 1);
  for(let x=-6; x<=6; x++) for(let z=-6; z<=6; z++){
    const t = new THREE.Mesh(tileGeo, toonMat((x+z)%2 ? 0x7cc25a : 0x8fd06c));
    t.position.set(x, -.1, z);
    g.add(t);
  }
  const P = new THREE.Group();
  P.rotation.y = Math.PI/4;          /* แกน local = แกนบนจอ (ดูหมายเหตุด้านบน) */
  g.add(P);
  /* รั้วไม้ขาวพาดหลังตัวละคร */
  const FZ = -2.4;
  for(let x=-5; x<=5; x++){
    const post = box(.13, .66, .13, 0xfdfaf2, .04);
    post.position.set(x, .33, FZ); P.add(post);
  }
  [.14, .46].forEach(y=>{
    const rail = box(10.3, .11, .1, 0xfdfaf2, .03);
    rail.position.set(0, y, FZ); P.add(rail);
  });
  /* ต้นไม้ทรงเดียวกับในเมือง (ลำต้น + พุ่ม 2 ก้อน) */
  const tree = (x, z, sc, leaf, leaf2)=>{
    const t = new THREE.Group();
    const tr = cyl(.17, .22, 1.15, 0x9c6b45, 8); tr.position.y = .57; t.add(tr);
    const a = sphere(.72, leaf, 12); a.position.y = 1.5; a.scale.y = .88; t.add(a);
    const b = sphere(.5, leaf2, 10); b.position.set(.34, 1.98, .12); t.add(b);
    t.position.set(x, 0, z); t.scale.setScalar(sc);
    P.add(t);
  };
  tree(-2.1, -3.3, 1.0, 0x66bb6a, 0x81c784);
  tree( 2.0, -3.7,  .9, 0x81c784, 0x66bb6a);
  /* พุ่มเตี้ย + ดอกไม้แซมริมรั้ว ให้ฉากไม่โล่ง */
  [[-1.0,-2.8,.34],[.9,-2.9,.3],[3.0,-2.7,.26],[-3.3,-2.8,.28]].forEach(([x,z,r])=>{
    const bu = sphere(r, 0x7cc25a, 9); bu.position.set(x, r*.6, z); bu.scale.y = .8; P.add(bu);
  });
  [[-1.6,-2.0,0xff8fb3],[1.5,-2.1,0xffd54f],[2.4,-1.9,0xb388ff],[-2.7,-2.05,0xff8a65]].forEach(([x,z,c])=>{
    const st = cyl(.03,.03,.22,0x7cc25a,6); st.position.set(x,.11,z); P.add(st);
    const fl = sphere(.11, c, 8); fl.position.set(x,.25,z); fl.scale.y = .7; P.add(fl);
  });
  return g;
}
function cvInit(canvas){
  if(cvR && cvCanvas === canvas) return true;
  if(cvR){                       /* ย้ายไป canvas ใหม่ = ต้องสร้าง renderer ใหม่ (context ผูกกับ canvas) */
    cvR.dispose();
    cvR = null;
  }
  try{ cvR = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true}); }
  catch(e){ return false; }
  cvCanvas = canvas;
  cvR.setClearColor(0x000000, 0);
  cvR.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  if(!cvS){
    cvS = new THREE.Scene();
    /* เฟรมเต็มตัว: กล้องเล็งกลางลำตัว (y .95) กรอบสูง ±1.25 ⇒ เห็นตั้งแต่ปลายเท้าถึงเหนือหัว */
    /* 🎥 มุมกล้องเดียวกับในเมืองเป๊ะ (CAM_DIR) — ฉากหลังจะได้ดูเป็น "เมืองจริง" ไม่ใช่สตูดิโอถ่ายรูป */
    cvCam = new THREE.OrthographicCamera(-CV_HALF, CV_HALF, CV_HALF, -CV_HALF, .1, 40);
    cvCam.position.copy(CAM_DIR).multiplyScalar(14);
    cvCam.lookAt(0, CV_AIM, 0);
    cvS.add(new THREE.HemisphereLight(0xfff6e0, 0xcde8b0, .72));
    const dl = new THREE.DirectionalLight(0xffffff, .68);
    dl.position.copy(LIGHT_DIR).multiplyScalar(10);
    cvS.add(dl);
    cvS.add(cvDiorama());
    const shadMat = new THREE.MeshBasicMaterial({color:0x1d3a1d, transparent:true, opacity:.14, depthWrite:false});
    cvShadC = new THREE.Mesh(new THREE.CircleGeometry(.46, 24), shadMat);
    cvShadC.rotation.x = -Math.PI/2; cvShadC.scale.set(1.15,1,.7); cvShadC.position.y = .01;
    cvS.add(cvShadC);
    cvShadP = new THREE.Mesh(new THREE.CircleGeometry(.34, 24), shadMat);
    cvShadP.rotation.x = -Math.PI/2; cvShadP.scale.set(1.1,1,.7); cvShadP.position.y = .01;
    cvS.add(cvShadP);
  }
  return true;
}
function cvSize(){
  if(!cvR || !cvCanvas) return;
  const w = cvCanvas.clientWidth || 260, h = cvCanvas.clientHeight || 300;
  cvR.setSize(w, h, false);
  const half = CV_HALF, halfW = half * (w/h);          /* คงสัดส่วนไว้เสมอ ไม่ให้ตัวละครแบน */
  cvCam.left = -halfW; cvCam.right = halfW;
  cvCam.updateProjectionMatrix();
}
function cvLoop(now){
  if(!cvR || !cvCanvas || !cvCanvas.isConnected || document.hidden){ cvRaf = null; return; }
  cvRaf = requestAnimationFrame(cvLoop);
  const busy = cvWaveK>0 || cvJumpK>0 || cvHopK>0;
  if(!busy && now - cvLast < CV_IDLE_MS) return;
  const dt = Math.min(.05, (now - cvLast)/1000 || .016);
  cvLast = now; cvT += dt;
  const t = cvT;
  if(cvChar){
    const u = cvChar.userData;
    u.rig.position.y = Math.sin(t*2.4)*.03;
    u.rig.rotation.z = Math.sin(t*.75)*.018;
    cvWaveT -= dt;
    if(cvWaveT<=0 && cvWaveK<=0){ cvWaveK = HB_WAVE_DUR; cvWaveT = 4 + Math.random()*4; }
    const swing = Math.sin(t*2.4)*.03;
    let armLT = -.16 - swing, armRT = .16 + swing, headT = Math.sin(t*1.1)*.05;
    if(cvWaveK>0){
      /* 🖐️ โบกด้วยแขน `arms[0]` เหมือน home buddy — อีกข้างเป็นแขนที่ถือของ (ดูหมายเหตุที่ hbLoop) */
      cvWaveK = Math.max(0, cvWaveK - dt);
      const k = hbEase(Math.min((HB_WAVE_DUR-cvWaveK)*2.6, cvWaveK*2.6));
      armLT = (1-k)*armLT + k*(-(2.35 + Math.sin(t*13)*.38));
      headT -= k*.07;
    }
    cvArmL  = hbDamp(cvArmL,  armLT, 16, dt);
    cvArmR  = hbDamp(cvArmR,  armRT, 16, dt);
    cvHeadZ = hbDamp(cvHeadZ, headT, 10, dt);
    u.arms[0].rotation.z = cvArmL;
    u.arms[1].rotation.z = cvArmR;
    u.head.rotation.z = cvHeadZ;
    if(cvJumpK>0){
      cvJumpK = Math.max(0, cvJumpK - dt*2.4);
      const p = 1 - cvJumpK;
      cvChar.position.y = Math.sin(p*Math.PI)*.32;
      const sq = Math.sin(p*Math.PI*2)*.07;
      cvChar.scale.set(1-sq, 1+sq, 1-sq);
      if(cvJumpK===0){ cvChar.position.y = 0; cvChar.scale.set(1,1,1); }
    }
  }
  if(cvPet){
    const u = cvPet.userData.anim || {};
    cvHopT -= dt;
    if(cvHopT<=0 && cvHopK<=0){ cvHopT = 1.8 + Math.random()*2.4; cvHopK = HB_HOP_DUR; }
    if(cvHopK>0){
      cvHopK = Math.max(0, cvHopK - dt);
      const p = 1 - cvHopK/HB_HOP_DUR;
      cvPet.position.y = Math.sin(p*Math.PI)*.16;
      const sq = Math.sin(p*Math.PI*2)*.09;
      cvPet.scale.set(1-sq, 1+sq, 1-sq);
      cvPet.rotation.x = -Math.sin(p*Math.PI)*.12;
      if(cvHopK===0){ cvPet.position.y = 0; cvPet.scale.set(1,1,1); cvPet.rotation.x = 0; }
    }
    if(u.tail) u.tail.rotation.z = Math.sin(t*7)*.3 + Math.sin(t*11.3)*.06;
    if(u.wings) u.wings.forEach(w=>{
      const flap = cvHopK>0 ? Math.sin(t*22)*.6 : Math.sin(t*3)*.1;
      w.rotation.z = hbDamp(w.rotation.z, flap*w.userData.side, 24, dt);
    });
    if(u.head) u.head.rotation.z = Math.sin(t*1.4)*.06;
  }
  cvR.render(cvS, cvCam);
}
window.HouseCharView = {
  /* วาดตัวละครของเด็กคนนี้ลง canvas — คืน false ถ้าเด็กยังไม่มีตัวละคร (ผู้เรียกไปโชว์ปุ่มสร้างแทน) */
  mount(canvas, childId){
    if(!canvas || !childId) return false;
    let data = null;
    try{ data = JSON.parse(localStorage.getItem(HOUSE_KEY(childId)) || 'null'); }catch(e){}
    if(!data || !data.char) return false;
    if(!cvInit(canvas)) return false;
    cvSize();
    const key = childId + '|' + JSON.stringify(data.char) + '|' + JSON.stringify(data.pet||null);
    if(key !== cvKey){
      cvKey = key;
      if(cvChar){ cvS.remove(cvChar); disposeGroup(cvChar); cvChar = null; }
      if(cvPet){ cvS.remove(cvPet); disposeGroup(cvPet); cvPet = null; }
      cvChar = buildCharacter(data.char);
      cvChar.position.set(data.pet ? -.42 : 0, 0, 0);
      cvChar.rotation.y = data.pet ? .3 : .1;
      cvS.add(cvChar);
      cvShadC.position.x = cvChar.position.x;
      if(data.pet){
        cvPet = buildPet(data.pet.type, data.pet.color||0);
        cvPet.position.set(.62, 0, -.02);
        cvPet.rotation.y = -.4;
        cvS.add(cvPet);
      }
      cvShadP.visible = !!cvPet;
      if(cvPet) cvShadP.position.set(cvPet.position.x, .01, cvPet.position.z);
      cvArmL = cvArmR = cvHeadZ = 0;
      cvWaveK = cvJumpK = cvHopK = 0;
      cvWaveT = .8;                    /* ทักทายไวๆ ทันทีที่เด็กถูกเลือก */
    }
    if(!cvRaf){ cvLast = performance.now(); cvRaf = requestAnimationFrame(cvLoop); }
    return true;
  },
  /* ชื่อสัตว์เลี้ยงของเด็กคนนี้ (ถ้ามี) — ใช้ทำข้อความใต้ตัวละคร */
  petName(childId){
    try{
      const d = JSON.parse(localStorage.getItem(HOUSE_KEY(childId)) || 'null');
      return (d && d.pet && d.pet.name) || '';
    }catch(e){ return ''; }
  },
  hasChar(childId){
    try{
      const d = JSON.parse(localStorage.getItem(HOUSE_KEY(childId)) || 'null');
      return !!(d && d.char);
    }catch(e){ return false; }
  },
  cheer(){ cvJumpK = 1; cvWaveK = HB_WAVE_DUR; cvHopK = HB_HOP_DUR; },
  resize(){ cvSize(); },
  /* หยุดลูป (ยุบแถว/ออกจากหน้า) — เก็บ renderer ไว้ใช้ซ้ำ ไม่ dispose ทิ้ง */
  unmount(){ if(cvRaf){ cancelAnimationFrame(cvRaf); cvRaf = null; } },
};
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
  if(open && typeof refreshTutBtn === 'function') refreshTutBtn();   /* 🎓 ป้ายข้าม/เรียนใหม่ */
}
$('house-ctrl-gear').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  setHouseCtrlOpen($('house-ctrl-list').hidden);
});
/* ปุ่ม "คลังคำถาม" ในเมนูเฟือง — หน้าเทสรวมโจทย์ทั้งหมดของโหมดบ้าน (js/house-qbrowse.js) */
{ const qb = $('house-qb-btn');
  if(qb) qb.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    setHouseCtrlOpen(false);
    if(window.HouseQB) window.HouseQB.open();
    else if(typeof showToast==='function') showToast('📚', 'คลังคำถามยังโหลดไม่เสร็จ ลองอีกครั้งนะ');
  });
}
/* ปุ่ม "ปรับค่าต่างๆ" ในเมนูเฟือง — เครื่องมือเทสระบบ (js/house-devtools.js) */
/* ปุ่มแต่งตัวพ่อแม่ — เข้าหน้าแต่งตัวเลย เริ่มที่คนที่มีงานวันนี้ (แท็บสลับได้ในหน้านั้น) */
{ const qb = $('house-quest-bar');
  if(qb) qb.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); openQuestSummary(); });
  const qc = $('hqsum-close');
  if(qc) qc.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); closeQuestSummary(); });
}
{ const pb = $('house-parent-btn');
  if(pb) pb.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    if(hMode !== 'world' || editMode) return;
    const who = (QUESTS && QUESTS.familyWho()) || 'mom';
    fadeSwap(()=>openCreator(true, who));
  });
}
{ const dv = $('house-dev-btn');
  if(dv) dv.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    setHouseCtrlOpen(false);
    if(window.HouseDev) window.HouseDev.open();
    else if(typeof showToast==='function') showToast('🛠️', 'หน้าปรับค่ายังโหลดไม่เสร็จ ลองอีกครั้งนะ');
  });
}
/* 🎶 หน้าฟังเพลงธีม (เฟส 14 · เครื่องมือเทส) — แพทเทิร์นเดียวกับปุ่มคลังคำถาม/ปรับค่า */
{ const mb = $('house-music-btn');
  if(mb) mb.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    setHouseCtrlOpen(false);
    if(window.HouseMusicUI) window.HouseMusicUI.open();
    else if(typeof showToast==='function') showToast('🎶', 'หน้าเพลงยังโหลดไม่เสร็จ ลองอีกครั้งนะ');
  });
}
/* 🗂️ จัดการข้อมูล (ย้ายเครื่อง/รีเซ็ต/ลบ) — เปิดกล่องเดียวกับหน้าเลือกเด็ก (ผู้ใช้สั่ง 2026-08-17)
   ⚠ **ห้ามทำกล่องใหม่ซ้ำใน house.js** — ระบบย้ายข้อมูลต้องมีทางเดียวจุดเดียวเสมอ
   ⚠ กล่องเป็น z-index 200 อยู่เหนือ `#house-view` (70) ⇒ เปิดทับเมืองได้เลยไม่ต้องออกจากเมืองก่อน
     และปุ่มรีเซ็ต/ลบ จบด้วย `location.reload()` อยู่แล้ว ⇒ เมืองถูกปิดให้เองโดยปริยาย */
{ const db = $('house-data-btn');
  if(db) db.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    setHouseCtrlOpen(false);
    if(typeof showClearModal === 'function') showClearModal();
    else if(typeof showToast === 'function') showToast('🗂️', 'เปิดหน้าจัดการข้อมูลไม่ได้ ลองออกไปที่หน้าเลือกเด็กนะ');
  });
}
/* 🎓 บทเรียนสอนเล่น (เฟส 15) — **ปุ่มนี้อยู่ในเมนูเฟืองเท่านั้น เด็กข้ามเองไม่ได้** (ผู้ใช้สั่ง)
   ยังเรียนไม่จบ = ปุ่มนี้คือ "ข้ามบทเรียน" · เรียนจบ/ข้ามไปแล้ว = "เรียนใหม่อีกครั้ง"
   ⚠ ป้ายต้องอัปเดตทุกครั้งที่เปิดเมนู ไม่งั้นพ่อแม่กดแล้วได้ผลตรงข้ามกับที่ป้ายเขียน */
function refreshTutBtn(){
  const b = $('house-tut-btn');
  if(!b) return;
  const T = window.HouseTutor;
  const lab = b.querySelector('.hc-label');
  const done = !!(T && (T.skipped() || (T.saved() && (T.saved().done || []).length >= 4)));
  if(lab) lab.textContent = done ? 'เรียนใหม่อีกครั้ง' : 'ข้ามบทเรียน';
}
{ const tb = $('house-tut-btn');
  if(tb) tb.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    setHouseCtrlOpen(false);
    const T = window.HouseTutor;
    if(!T){ if(typeof showToast==='function') showToast('🎓', 'บทเรียนยังโหลดไม่เสร็จ ลองอีกครั้งนะ'); return; }
    const done = T.skipped() || ((T.saved() && (T.saved().done || []).length) >= 4);
    if(done) T.restart(); else T.skipAll();
    refreshTutBtn();
  });
}
/* จุดต่อให้หน้าเทสสั่งวาด HUD ใหม่หลังยัดค่า (ไม่งั้นหลอด/จำนวนมื้อในแถบค้างค่าเก่าจนกว่าจะครบวินาที) */
window.HouseDevHooks = {
  petChanged: ()=>{ petCareHud.t = 0; petBarKey = '';
                    if(hPet.group) restylePet();   /* เฟส 12: รอยเปื้อน/ปลอกคออยู่ในโมเดล ต้องประกอบใหม่ */
                    syncPetMood(); },
};

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
  /* ชื่อ + อายุในวงเล็บ (เช่น "มะลิ (6 ขวบ)") — อายุปัดลงเป็นปีเต็มจาก childAgeYears() ใน js/app-core.js
     ⚠ แยกอายุเป็น <span> ของตัวเอง **โดยตั้งใจ**: บนจอแคบแถวบนของเต็มจนต้องตัดข้อความ
       ถ้ารวมเป็นก้อนเดียวจะโดนตัดท้ายจนเหลือ "มะ…" (อายุหายไปทั้งดุ้น) แยกแล้วชื่อตัดได้แต่อายุอยู่ครบเสมอ
     ป้ายเหนือหัวตัวละครในฉากยังใช้ชื่อเปล่าเหมือนเดิม (สั้นๆ ไม่บังฉาก) */
  const age = (typeof childAgeYears === 'function' && activeChild) ? childAgeYears(activeChild) : null;
  const base = nm ? nm.textContent : '';
  $('house-child-name').textContent = base;
  /* คำว่า "ขวบ" อยู่ใน <span> ย่อยเพราะบนจอมือถือแคบจะถูกซ่อนด้วย CSS เหลือแค่ "(7)"
     — แถวบนที่นั่นแน่นจนถ้าเก็บคำเต็มไว้ ชื่อเด็กจะถูกตัดจนเหลือตัวเดียว (วัดจริงแล้ว) */
  $('house-child-age').innerHTML = (age != null && age >= 1)
    ? ' (' + Math.floor(age) + '<span class="hc-age-unit"> ขวบ</span>)' : '';
  if(nm) $('house-char-name').textContent = base;
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
window.HouseQuests = QUESTS;      /* ให้ชุดเทส/เฟสถัดไปเรียกดูสถานะเควสต์ได้ตรงๆ */
window.HousePetCare = PETCARE;    /* เฟส 3B — ความหิว/อาหาร/ป่วย/ค่ารักษา (ชุดเทสเรียกตรวจตรงนี้) */
window.HouseFamily = FAMILY;      /* เฟส 4A — พ่อ-แม่ในบ้าน (ชื่อ/หน้าตา/บทพูด) */
/* จุดต่อสำหรับชุดเทส Playwright — เรียกหน้าจอเควสต์ได้โดยไม่ต้องคลิกตัว NPC ในฉาก 3D
   (คลิกจริงต้องเดินเข้าไปหาให้ถึงก่อน ทำในเทสไม่ไหว) โค้ดเกมจริงไม่ได้ใช้ตัวนี้เลย */
window.HouseQuestUI = {
  talk:  id => { const n = npcs.find(k => k.def.id === id); if(n) talkToNpc(n); },
  offer: id => { const s = QUESTS && QUESTS.specForNpc(id); if(s) offerQuest(s); },
  board: () => openQuestBoard(),
  run:   () => qRun,
  setRun:r => { qRun = r; qLock = false; qzShow(); renderQuestStep(); },
  marks: () => npcMarks.map(m => ({id:m.n.def.id, open:m.open.visible, done:m.done.visible})),
  close: () => { closeQuestPanel(); closeQuestBoard(); },
  /* หน้าคลังคำถาม (js/house-qbrowse.js) เรียกตัวนี้เพื่อเล่นโจทย์แบบทดสอบด้วยเส้นทางวาดจริง */
  playTest: (opt, onClose) => playTestRun(opt, onClose),

  /* ---------- จุดต่อสำหรับ js/house-games.js (เฟส 5: เกมที่ mount engine ของหน้าหลักเข้ามา) ----------
     house.js ห่อด้วย IIFE ⇒ ไฟล์อื่นแตะภายในไม่ได้ นี่คือ "ประตูเดียว" ที่เปิดให้
     ⚠ เพิ่มอะไรตรงนี้ให้เพิ่มเท่าที่จำเป็นจริงๆ อย่าเปิดภายในทั้งก้อน ไม่งั้นการแยกไฟล์จะไร้ความหมาย */
  openCard: (title, sub) => {          /* เปิดการ์ดเปล่าแล้วคืนกล่องให้ไปวาดต่อ */
    qzNpcId = null; qRun = null; qLock = false;
    qzShow();
    const who = $('hqz-who'); if(who) who.textContent = title || '🎮 มาเล่นเกมกัน';
    const sb  = $('hqz-sub'); if(sb)  sb.textContent  = sub || '';
    const dots = $('hqz-dots'); if(dots) dots.innerHTML = '';
    return qzStage();
  },
  closeCard: () => closeQuestPanel(),
  isCardOpen: () => questPlayOpen(),
  makeBtn: (label, cls, fn) => qzBtn(label, cls, fn),
  award: n => awardCoins(n),
};

/* ---------- ประตูสำหรับ js/house-play.js (เฟส 11: มินิเกมกลุ่ม A ที่เล่นในโลก 3D จริง) ----------
   กลุ่ม A ไม่ได้เปิดการ์ดถาม-ตอบ แต่ไปวางของจริงในเมืองแล้วให้เด็กเดินไปแตะ ⇒ ต้องการของ
   ที่ `HouseQuestUI` (ประตูของการ์ดเควสต์) ไม่มีให้: กริดเดินได้ · พิกัดโลก · การวางของในฉาก
   ⚠ **เปิดเท่าที่จำเป็นจริงๆ เท่านั้น** อย่าเปิด worldGroup/scene ดิบๆ ออกไป ไม่งั้นการแยกไฟล์ไร้ความหมาย
   ⚠ ของที่วางผ่าน `spawn()` จะถูกเก็บกวาดให้เองตอนออกจากบ้าน/สลับฉาก (ดู clearPlayObjs) */
const playObjs = new Set();
function clearPlayObjs(){
  playObjs.forEach(g=>{ if(g.parent) g.parent.remove(g); disposeGroup(g); });
  playObjs.clear();
}
/* วาดฉากเดี๋ยวนี้ 1 เฟรมแบบ synchronous — ใช้ตอนกดชัตเตอร์ในเกมช่างภาพ (เฟส 11)
   ⚠ **ห้ามเปิด `preserveDrawingBuffer` เพื่อถ่ายภาพ** มันกินเฟรมเรตตลอดเวลาที่เล่น
     วิธีนี้ถูกกว่ามาก: สั่งวาดแล้วอ่าน canvas ต่อทันทีในจังหวะเดียวกัน ก่อนเบราว์เซอร์เคลียร์บัฟเฟอร์ */
window.__housePaint = function(){
  if(renderer && scene && camera) renderer.render(scene, camera);
};
window.HouseWorld = {
  /* --- ผัง/กริด (อ่านอย่างเดียว) --- */
  OUT_W: () => OUT_W, OUT_D: () => OUT_D,
  grid:  () => outGrid,
  walkable: (x, z) => isWalk(outGrid, OUT_W, OUT_D, x, z),
  /* 🌉 ช่องนี้เป็นสะพานไหม — ของที่วางที่ y=0 จะจมใต้แผ่นสะพาน ⇒ มินิเกมต้องเลี่ยง */
  isBridge: (x, z) => !!(outGrid[z] && outGrid[z][x] === 2),
  nearWalkable: (x, z) => nearestWalkable(outGrid, OUT_W, OUT_D, x, z),
  /* ⚠ **ระยะเดินต้องวัดด้วยตัวนี้เท่านั้น ห้ามใช้เส้นตรง** — แม่น้ำ/สะพานทำให้ 10 ช่องเส้นตรง
     กลายเป็นเดินอ้อม 40 ช่อง (สูตรจำนวนข้อของเฟส 10 พังทันทีถ้าใช้เส้นตรง) */
  /* 🚶 เส้นทางเดินจริง (รายช่อง) — มินิเกมใช้ให้ตัวละครเดินตามทาง **ไม่ทะลุตึก/รั้ว/น้ำ**
     คืน [] ถ้าไปไม่ถึง · ตัวเดียวกับที่ระบบเดินของเด็กใช้ ⇒ เดินได้เหมือนกันเป๊ะ */
  path: (from, to) => {
    if(!from || !to) return [];
    const p = findPath(outGrid, OUT_W, OUT_D, from, to);
    return p ? p.map(t => ({x:t.x, z:t.z})) : [];
  },
  pathLen: (from, to) => {
    if(!from || !to) return -1;
    const p = findPath(outGrid, OUT_W, OUT_D, from, to);
    return p ? p.length : -1;
  },
  inHomeZone: (x, z) => inHomeZone(x, z),
  lotAt: (x, z, m) => lotAt(x, z, m),
  zoneName: (x, z) => zoneNameAt(x, z),
  wx: gx => outWX(gx), wz: gz => outWZ(gz),
  /* --- ตัวเด็ก --- */
  tile: () => ({x: hChar.tile.x, z: hChar.tile.z}),
  walkTo: (x, z, act) => walkTo(x, z, act ? {action: act} : {}),
  scene:  () => hScene,
  mode:   () => hMode,
  editing:() => !!editMode,
  /* --- วางของในฉากนอกบ้าน --- */
  spawn: g => { if(!g || !worldGroup) return null; worldGroup.add(g); playObjs.add(g); return g; },
  despawn: g => { if(!g) return; playObjs.delete(g); if(g.parent) g.parent.remove(g); disposeGroup(g); },
  /* ชิ้นส่วนพื้นฐาน (ใช้วัสดุ toon ชุดเดียวกับทั้งเมือง ⇒ ของใหม่กลืนกับฉากเดิมเสมอ) */
  kit: () => ({box, sphere, cyl, cone, torus, toonMat, merge: mergeDecorGroup, shadows: () => hShadows}),
  /* ของกลุ่ม A ที่ต้องอยู่ "เหนือทุกอย่าง" ชั่วคราว (อนุภาคอนิเมชัน) — วางใน scene ไม่ใช่ worldGroup
     ⇒ ไม่ถูก merge/ถูกบังโดยของฉาก และหายพร้อมกันตอนออกจากบ้าน */
  spawnFx: g => { if(!g || !scene) return null; scene.add(g); playObjs.add(g); return g; },
  /* --- ข้อมูล/เงิน/HUD --- */
  load: () => loadHouseData(), save: p => saveHouseData(p),
  award: n => awardCoins(n),               /* ⚠ เงินในโหมดบ้านจ่ายผ่านตัวนี้จุดเดียวเท่านั้น (ข้อ 5) */
  toast: (ic, msg) => { if(typeof showToast === 'function') showToast(ic, msg); },
  npcDefs: () => NPC_DEFS,
  /* 🙈 เลขนับถอยหลังกลางจอ (เกมซ่อนแอบ) — ส่ง null = ซ่อน */
  bigCount: n =>{
    const el = $('house-bigcount'), sp = $('hbc-n');
    if(!el) return;
    if(n == null){ el.hidden = true; return; }
    if(sp) sp.textContent = String(n);
    el.hidden = false;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
  },
  refreshHud: () => { questBarKey = ''; refreshQuestBar(); },
  /* 🎣 มินิเกมในโลก 3D บอกว่า "ทำสำเร็จ 1 ครั้ง" เพื่อให้เควสต์แบบ "ทำจริงแล้วเอาไปส่ง" นับได้
     คืน true ถ้ามีเควสต์กำลังนับอยู่จริง (ตัวเรียกจะได้รู้ว่าควรบอกความคืบหน้าเพิ่มไหม)
     ⚠ ตัวนี้เป็นประตูเดียวของกลไกนี้ — กลไกใหม่ที่ทำแบบเดียวกันให้ส่ง kind ใหม่เข้ามา
       ('crop' ผัก · 'photo' รูป · 'leaf' ของที่เก็บได้) **ห้ามเปิดประตูใหม่รายเกม** */
  questCaught: (kind, id) => questCaught(kind, id),
  /* 🎣 กำลังทำเควสต์ "ตกปลาไปส่ง" อยู่ไหม — เกมตกปลาใช้เช็คก่อนหรี่โอกาสได้ปลาหายาก
     ⚠ **ห้ามหรี่ระหว่างทำเควสต์เด็ดขาด** ปลาที่เควสต์สั่งมีชนิดเจาะจง หรี่แล้ว = เควสต์ไม่มีวันจบ */
  questFishing: () => !!(walkQuest && walkQuest.target === 'catch'),
  /* 💸 ร้านค้าแจ้งว่าเด็กเพิ่งจ่ายเงินไปเท่าไร — คืนให้ตอนจบถ้ากำลังทำเควสต์ที่ต้องซื้อของ */
  questSpend: n => questSpend(n),

  /* ---------- เพิ่มให้เฟส 11 รอบแก้ (2026-08-13) ---------- */
  /* ความสูงพื้นจริงของช่องนั้น — **สะพานไม้ผิวบนอยู่ที่ .12 ไม่ใช่ 0**
     ของที่วางที่ y=0 บนสะพานจะจมหายใต้แผ่นไม้ (บั๊กเดียวกับรอยเท้าบอกจุดหมาย) */
  /* ⚠ ท่าไม้เป็นพื้นระดับเดียวกับพื้นดินแล้ว (2026-08-14) เหลือแค่สะพานที่ยังยกสูง */
  groundY: (x, z) => (!isPierTile(x, z) && outGrid && outGrid[z] && outGrid[z][x] === 2) ? .12 : 0,
  /* ช่องนี้ "มองเห็นจากกล้อง" ไหม — กล้องมองจากทิศ +x,+z ลงมา (CAM_DIR)
     ⇒ ตึกที่อยู่ในแนวทแยง (x+k, z+k) จะบังของที่วางตรงนี้จนเด็กหาไม่เจอ
     อาคารสูง ~3 หน่วย ÷ ความชันกล้อง (1.15/√2 ≈ .81 ต่อ 1 ช่องทแยง) ⇒ บังได้ ~4 ช่อง
     ⚠ ใช้กับของทุกชิ้นที่ "เด็กต้องมองหาให้เจอ" (คนซ่อน/ของสะสม) ไม่งั้นเกมกลายเป็นหาไม่เจอจริงๆ */
  visibleSpot: (x, z) => {
    if(lotAt(x, z, 1)) return false;            /* ยืนติดตัวอาคารเอง = โดนชายคาบัง */
    for(let k = 1; k <= 4; k++) if(lotAt(x + k, z + k, 0)) return false;
    return true;
  },
  camRot: () => camera ? camera.rotation : null,      /* ป้ายลอยหันเข้าหากล้อง (ชุดเดียวกับป้าย "!") */
  /* หันหน้าตัวเด็กไปทางช่องนี้ (ใช้ตอนเหวี่ยงเบ็ด — เห็นแล้วรู้ว่ากำลังตกปลาอยู่) */
  faceTo: (x, z) => {
    if(!charGroup) return;
    hChar.targetRotY = Math.atan2(outWX(x) - charGroup.position.x, outWZ(z) - charGroup.position.z);
  },
  /* ⚠ **ทุก action ต้องมีท่าทางของตัวเด็กด้วย** ไม่ใช่แค่อนุภาคลอยขึ้น (ผู้ใช้สั่ง 2026-08-14)
     เด็กจะได้เห็นว่า "ตัวเราเป็นคนทำ" ไม่ใช่ของขยับเองลอยๆ
     kind: 'plant' ย่อตัวปลูก · 'water' ยกบัวรดน้ำ · 'harvest' ก้มเก็บแล้วชูขึ้น · 'cast' เหวี่ยงเบ็ด
     ms = 0 ⇒ **ค้างท่าสุดท้ายไว้** จนกว่าจะเรียก `pose(null)` (ใช้กับตกปลา: เหวี่ยงแล้วถือคันรออยู่)
     ⚠ ผู้เรียกควรยิง `faceTo()` ให้เด็กหันไปทางเป้าหมายก่อนเสมอ */
  pose: (kind, ms) => {
    const u = charGroup && charGroup.userData;
    if(!kind){ if(charAct){ charAct = null; clearCharPose(u); } return; }
    const hold = ms === 0;
    charAct = {kind, t0: performance.now(), dur: hold ? 760 : (ms || 900), hold};
  },
  /* จุดตกปลาที่ผังประกาศไว้จริง — ⚠ **ห้ามเดาพิกัดเอง** (กติกาเดียวกับตอนแก้ผังเมือง) */
  pondPier: () => ({x: POND_PIER.x, z: POND_PIER.z, len: POND_PIER.len, rot: POND_PIER.rot}),
  pondFishSpots: () => POND_FISH_SPOTS.concat(seaFishSpots())
    .map(s => ({stand:{x:s.stand.x, z:s.stand.z}, water:{x:s.water.x, z:s.water.z},
                /* ⚠ ธงนี้ตัดสินว่าจะได้ปลาน้ำจืดหรือปลาทะเล — ดูจากผืนน้ำจริงในกริด ไม่ใช่เดาจากชื่อ */
                name:s.name, sea: isSeaTile(s.water.x, s.water.z)})),
  isWater: (x, z) => !!(outGrid && outGrid[z] && outGrid[z][x] === 1),
  /* ช่องที่ปูแผ่นไม้บนน้ำ (ท่าในบ่อ + ท่าน้ำทะเล) — ชุดเทสใช้ยืนยันว่าไม้ทุกแผ่นอยู่บนน้ำจริง */
  isWaterDeck: (x, z) => isWaterDeckTile(x, z),
  isSea:  (x, z) => isSeaTile(x, z),
  isSand: (x, z) => isSandTile(x, z),
  isPond: (x, z) => isPondTile(x, z),
  homeZone: () => ({x0:HOME_ZONE.x0, x1:HOME_ZONE.x1, z0:HOME_ZONE.z0, z1:HOME_ZONE.z1}),
  /* ตำแหน่งแปลงผัก = อ่านจาก decor ที่วางจริง ⇒ **เด็กย้ายแปลงในโหมดตกแต่งแล้วเกมตามไปเอง**
     (ไม่ได้เก็บพิกัดซ้ำใน play state — ถ้าเก็บซ้ำจะเพี้ยนทันทีที่ย้าย) */
  vegPlots: () => (decorGroups.out || [])
    .map(g => (g.userData.deco || {}).rec)
    .filter(r => r && r.id === 'veg-plot')
    .map(r => ({x:r.x, z:r.z})),
  /* ---------- เพิ่มให้เฟส 15 (ระบบสอนเล่น) ----------
     บทเรียนต้องพาเด็ก "ไปที่ร้าน/กระดาน/บ้านคนนั้น" ⇒ ต้องถามพิกัดจริงจากผังได้
     ⚠ **ห้ามให้ไฟล์บทเรียนฮาร์ดโค้ดพิกัดเอง** — ผังเมืองย้ายร้านมาแล้วหลายรอบ
       (ร้านต้นไม้/แฟชั่นมอลล์/ร้านของเล่นย้ายกันคนละที่เมื่อ 2026-08-08..09)
       ถ้าจดพิกัดไว้ในบทเรียน วันหนึ่งบทเรียนจะพาเด็กไปยืนกลางทุ่งโดยไม่มี error ให้จับ */
  lotDoor: id => {
    const l = LOT_BY_ID[id]; if(!l) return null;
    const d = lotDoorTile(l);
    const w = isWalk(outGrid, OUT_W, OUT_D, d.x, d.z) ? d : nearestWalkable(outGrid, OUT_W, OUT_D, d.x, d.z);
    return w ? {x:w.x, z:w.z} : null;
  },
  /* ช่องยืนหน้ากระดานภารกิจ (ตัวกระดานบล็อกช่องตัวเอง ⇒ ต้องหาช่องข้างๆ ที่เดินได้) */
  boardTile: () => {
    const w = nearestWalkable(outGrid, OUT_W, OUT_D, QUEST_BOARD.x, QUEST_BOARD.z + 1);
    return w ? {x:w.x, z:w.z} : null;
  },
  npcTile: id => { const n = NPCS.find(v => v.id === id); return n ? {x:n.x, z:n.z} : null; },
  /* 🧭 สั่งลูกศรบอกทางให้ชี้ไปช่องนี้ (null = เลิกสั่ง แล้วปล่อยให้เควสต์เป็นคนกำหนดเอง)
     ⚠ ของบทเรียนมาก่อนเควสต์เสมอ — ระหว่างสอนเล่นต้องไม่มีลูกศร 2 อันชี้คนละทาง */
  guideTo: t => { guideForce = t ? {x:t.x, z:t.z} : null; },
  /* 🍃 สวิตช์นำทางไปของประจำวัน (ปุ่มในแผงกิจกรรมเป็นคนกด) */
  guideCollect: on => { guideCol = !!on; },
  guidingCollect: () => guideCol,
  /* 🚪 เดินออกจากตัวบ้านไปฉากนอกบ้าน — **จุดหมายของบทเรียนอยู่นอกบ้านเกือบทั้งหมด**
     ⚠ `walkTo()` ของฉากในบ้านใช้กริดคนละใบกับฉากนอก ⇒ สั่งเดินไปพิกัดนอกบ้านตอนอยู่ในบ้าน
       จะไม่เกิดอะไรขึ้นเลย (ผู้ใช้แจ้ง 2026-08-17: อยู่ในบ้านแล้วกด "พาไปเลย" ไปตกปลาไม่ได้)
     คืน false ถ้าอยู่นอกบ้านอยู่แล้ว */
  goOutside: () => {
    if(hScene !== 'in') return false;
    walkTo(IN_DOOR_TILE.x, IN_DOOR_TILE.z, {exit:true});
    return true;
  },
  /* ตำแหน่งตะกร้า = อ่านจาก decor จริง (ย้ายในโหมดตกแต่งแล้วป้ายตามไปเอง) */
  basketTile: () => {
    const r = (decorGroups.out || []).map(g => (g.userData.deco || {}).rec)
      .filter(x => x && x.id === 'sell-basket')[0];
    return r ? {x:r.x, z:r.z} : null;
  },
};
/* จุดต่อชุดเทสของเฟส 3B — แผงให้อาหาร/การ์ดคุณหมอ (เดินไปหาหมอในฉาก 3D ทำในเทสไม่ไหวเหมือนกัน) */
/* จุดต่อชุดเทสของเฟส 4A — แตะตัวพ่อแม่/เปิดหน้าแต่งตัวให้ตรงตัวใน 3D ทำในเทสไม่ไหว */
window.HouseFamilyUI = {
  tap:   w => tapParent(w),
  tapScene: w => walkToParent(w),     /* เส้นทางจริงของเกม: เดินไปหาก่อนแล้วค่อยคุย */
  dress: w => openCreator(true, w),
  built: () => Object.keys(parentObjs),
  /* ป้ายงานเหนือหัวพ่อแม่ (ชุดเทส) — {who, open, done} */
  marks: () => Object.keys(parentObjs).map(w => ({
    who: w,
    open: !!(parentObjs[w].mk && parentObjs[w].mk.open.visible),
    done: !!(parentObjs[w].mk && parentObjs[w].mk.done.visible),
  })),
  /* rig ของพ่อแม่ (ชุดเทสตรวจว่าขาแกว่งจริงตอนเดิน) */
  rig: w => { const o = parentObjs[w]; if(!o || !o.g) return null;
    const r = o.g.userData;
    return (r && r.legs) ? {legs: r.legs.map(p=>p.rotation.x), arms: r.arms.map(p=>p.rotation.x)} : null; },
  screen:w=>{
    const o = parentObjs[w]; if(!o || !o.g) return null;
    const v = new THREE.Vector3(o.g.position.x, o.g.position.y + 1.4, o.g.position.z).project(camera);
    if(v.z >= 1) return null;
    const x = (v.x+1)/2*window.innerWidth, y = (1-v.y)/2*window.innerHeight;
    return (x > 40 && y > 40 && x < window.innerWidth-40 && y < window.innerHeight-40) ? {x, y} : null;
  },
  pos:   w => { const o = parentObjs[w]; return o && o.g ? {x:o.g.position.x, z:o.g.position.z} : null; },
  /* โชว์อยู่ไหม — ชุดเทสตรวจว่าเข้าโหมดตกแต่งแล้วพ่อแม่หายจริง (ผู้ใช้สั่ง 2026-08-13) */
  visible: w => { const o = parentObjs[w]; return o && o.g ? !!o.g.visible : null; },
};
window.HousePetUI = {
  feed:  () => feedNow(),
  cure:  id => { const d = npcDefById(id); return d ? offerCure(d) : false; },
  hearts:() => petCareHud.hearts,
};
$('house-entry-btn').addEventListener('click', startHouseGame);
$('hq-claim').addEventListener('click', claimQuestReward);
$('hq-close').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); closeQuestBoard(); });
{ const qc = $('hqz-close');
  if(qc) qc.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); closeQuestPanel(); }); }
/* เฟส 3B — ปุ่มให้อาหาร + ปิดแผง */
{ const fb = $('hpb-feed');
  /* ⚠ ตอนแถบอยู่สถานะล็อก (ยังไม่มีสัตว์) ปุ่มนี้เป็น "ไปรับเลี้ยง" ไม่ใช่ "ให้อาหาร"
     ⇒ ต้องบอกทางไปร้านสัตว์เลี้ยง ห้ามกดแล้วเงียบ (กติกาเหล็ก: ทุกปุ่มต้องมีทางไปต่อ) */
  if(fb) fb.addEventListener('click', ()=>{
    const bar = $('house-pet-bar');
    if(bar && bar.classList.contains('hpb-locked')){
      if(typeof playClick === 'function') playClick();
      showToast('🐾', 'ยังไม่มีเพื่อนตัวน้อยเลย — ไปที่ร้านสัตว์เลี้ยงในหมู่บ้านแล้วเลือกรับเลี้ยงได้เลยนะ');
      return;
    }
    feedNow();
  }); }
/* เฟส 12 — ปุ่มปิดเมนูฟองของสัตว์เลี้ยง */
{ const pmc = $('hpm-close');
  if(pmc) pmc.addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); closePetMenu(); }); }
/* ปุ่มกลับ (←): ถ้าเปิดแผงอะไรค้างอยู่ = "ยกเลิก" กลับไปหน้าเกมก่อน ยังไม่ออกจากบ้าน
   ยกเว้นตอนสร้างตัวละครครั้งแรก (ยังไม่มีตัวละคร/โลกให้กลับไป) ให้ออกจากบ้านเหมือนเดิม */
$('house-back').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  /* อยู่ในร้าน (รวมตอนดูตัวอย่างสินค้า) → ปุ่มย้อนกลับ = ออกจากร้านก่อน ยังไม่ออกจากบ้าน
     กดซ้ำอีกครั้งถึงจะออกจากโหมดบ้านจริงๆ (เด็กจะได้ไม่หลุดออกจากบ้านทั้งที่ตั้งใจแค่ปิดร้าน) */
  if(SHOP && SHOP.isOpen()){ SHOP.close(); return; }
  if(questSummaryOpen()){ closeQuestSummary(); return; }
  if(questPlayOpen()){ closeQuestPanel(); return; }    /* กำลังเล่นเควสต์ → ปุ่มย้อนกลับ = เลิกเล่นรอบนี้ (ทำใหม่ได้ ไม่เสียอะไร) */
  if(window.HouseDev && window.HouseDev.isOpen()){ window.HouseDev.close(); return; }
  if(window.HouseQB && window.HouseQB.isOpen()){ window.HouseQB.close(); return; }
  if(questPanelOpen()){ closeQuestBoard(); return; }
  if(editMode){ exitEditMode(); return; }
  if(hMode==='pet'){ fadeSwap(()=>closePetPicker(null)); return; }
  if(hMode==='creator' && creatorState.fromWorld){ fadeSwap(()=>cancelCreator()); return; }
  /* 🚪 หน้าสร้างตัวละคร "ครั้งแรก" (เด็กยังไม่มีตัวละคร · ไม่ได้เข้ามาจากในเมือง)
     ⇒ กดย้อนกลับต้องไป **หน้าเลือกเด็ก** ไม่ใช่หน้าทำโจทย์ (ผู้ใช้สั่ง 2026-08-20)
     เพราะเด็กเข้ามาทางปุ่ม "สร้างตัวละครของหนู" บนหน้าแรก ⇒ ที่ที่ควรกลับไปคือหน้าแรกนั้น
     ⚠ ใช้ทางเดียวกับปุ่ม "ออกจากบ้าน" ในเมนูเฟือง (stopHouseGame แล้วกด #switch-child-btn)
       **ห้ามเรียก renderChildSelect() ตรงๆ** — ปุ่มนั้นทำงานอย่างอื่นให้ด้วย (ล้าง state/หยุดเพลง) */
  if(hMode==='creator' && !creatorState.fromWorld){
    stopHouseGame();
    const sw = $('switch-child-btn');
    if(sw) sw.click();
    return;
  }
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
/* ป้ายชื่อเด็กในโหมดบ้าน **ไม่ใช่ปุ่มอีกต่อไป** (ผู้ใช้สั่ง 2026-08-09) — เมื่อก่อนกดแล้วเด้งออกไป
   หน้าเลือกเด็กทันที ซึ่งเด็กเผลอกดโดนบ่อยแล้วหลุดออกจากบ้านทั้งที่แค่อยากดูชื่อตัวเอง
   ⇒ ทางออกไปหน้าเลือกเด็กย้ายไปอยู่ปุ่ม "ออกจากบ้าน" ในเมนูเฟืองที่เดียว (#house-exit-btn)
   กดดินสอ = เปิด modal แก้ชื่อ/emoji ตัวเดิม (z-index สูงกว่าโหมดบ้าน ใช้ทับได้เลย) */
$('house-child-edit-btn').addEventListener('click', ()=> $('header-edit-emoji-btn').click());
/* ออกจากบ้าน → หน้าเลือกเด็ก (ต้อง stopHouseGame ก่อน ไม่งั้นฉาก 3D ยังวน rAF อยู่เบื้องหลัง
   ทั้งที่ view ถูกซ่อนไปแล้ว = กินแบตกับ CPU ฟรีๆ) */
{ const ex = $('house-exit-btn');
  if(ex) ex.addEventListener('click', ()=>{
    if(typeof playClick==='function') playClick();
    stopHouseGame();
    $('switch-child-btn').click();
  }); }
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
/* DEBUG-TEMP */ window.__houseDbg = {
  /* ออกจากโหมดบ้านผ่านทางเดินโค้ดจริง (ชุดเทสเฟส 14 ใช้ดูว่า playlist ถูกคืนให้หน้าหลักไหม) */
  exit: ()=> stopHouseGame(),
  tp:(x,z)=>{ charGroup.position.set(outWX(x),0,outWZ(z));
              hChar.tile.x = x; hChar.tile.z = z; hChar.path = []; hChar.walking = false; },
  grid:()=>outGrid,
  /* 📔 เฟส 16 — ชุดเทสสมุดสะสม (ชื่อคีย์ grep แล้วว่าไม่ซ้ำของเดิม)
     critters = ชนิดสัตว์ป่าที่อยู่ในฉากตอนนี้ · startleAt = แตะตัวที่ i ผ่านทางเดินโค้ดจริง
     farmTagged = สัตว์ในคอกที่ติด tag ให้จดสมุดได้ (ต้องเป็น 4 ชนิดของฟาร์มเท่านั้น) */
  critters:()=>critters.map(c=>c.type),
  startleAt:(i)=>{ const c = critters[i]; if(c) startleCritter(c.group); return !!c; },
  farmTagged:()=>penAnimals.filter(a=>(a.g.children||[]).some(m=>m.userData && m.userData.hFarm))
                           .map(a=>a.kind),
  npcTiles:()=>npcs.filter(n=>(n.tiles||[]).some(t=>inHomeZone(t.x,t.z))).map(n=>n.def.id),
  /* จำลอง "แตะฉากตรงช่องนี้" ผ่านทางเดินโค้ดจริงทั้งเส้น (ใช้เทสว่าม้านั่งในเมืองนั่งได้จริงไหม) */
  tapScene:(x,z)=>tapStaticScene(new THREE.Vector3(outWX(x),0,outWZ(z))),
  /* โหมดปัจจุบัน — ชุดเทสต้องรอให้เป็น 'world' ก่อนสั่งเปิดการ์ดเควสต์/หน้าร้าน
     เพราะ offerQuest()/SHOP.open() ออกเงียบๆ ถ้ายังอยู่โหมด creator/pet หรือกำลังตกแต่งอยู่
     (เดาเวลาด้วย waitForTimeout แล้วเครื่องช้าตอนรันทั้งชุด = เทสแดงแบบไม่มีร่องรอย) */
  mode:()=>hMode, editing:()=>!!editMode,
  scene:()=>hScene, creatorWho:()=>creatorWho, charLook:()=>charCfgNow,
  /* 🧪 ชุดเทส: พ่อแม่ที่มีตัวอยู่ในฉากจริงตอนนี้ (ไม่ใช่ข้อมูลใน save) */
  parentsInScene: ()=> Object.keys(parentObjs).filter(w => parentObjs[w] && parentObjs[w].g),
  /* พาเด็กเข้าไปในบ้านทันที (ชุดเทสของเฟส 4A — เดินไปหน้าประตูเองในเทสช้ามาก) */
  enterHouse:()=>{ if(hScene!=='in') switchScene('in'); },
  leaveHouse:()=>{ if(hScene!=='out') switchScene('out'); },
  /* รอบเล่นเควสต์ที่กำลังเปิดอยู่ (ชุดเทสมินิเกมเฟส 4B ต้องรู้ว่าของชิ้นไหนควรลงถังไหน) */
  qRun: ()=> qRun,
  /* ---- จุดต่อชุดเทสเฟส 12 (กิจกรรมกับสัตว์เลี้ยง) ---- */
  petMenu: ()=> petMenuOn,
  petAct: ()=> petAct && petAct.kind,
  /* ⚠ เวลาในเกมเดินตาม "เฟรมที่วาดจริง" และ dt ถูกจำกัดไว้ที่ .05 ⇒ บนเครื่องเทสที่วาดได้ ~10 fps
     ท่ายาว 1.9 วิ จะกินเวลานาฬิกาจริง ~6 วิ **ชุดเทสต้องรอเงื่อนไข ห้ามนอนรอเป็นวินาที** */
  petActT: ()=> petAct ? petAct.t : -1,
  petRest: ()=> ({rest: !!hPet.rest, lonely: !!hPet.restLonely}),
  petTap: ()=> playWithPet(),
  petGear: ()=>{ const u = hPet.group && hPet.group.userData.anim;
                 return {collar: !!(u && u.collar), style: u && u.collar ? u.collar.style : null,
                         dirty: !!(u && u.dirt)}; },
  restylePet: ()=> restylePet(),
  /* ตำแหน่งไอเหม็นเส้นแรก — ชุดเทสใช้ยืนยันว่ามันขยับจริง ไม่ใช่ภาพนิ่ง */
  petStink: ()=>{
    const u = hPet.group && hPet.group.userData.anim;
    const w = u && u.dirt && u.dirt.stink && u.dirt.stink.children[0];
    return w ? +w.position.y.toFixed(4) : null;
  },
  buildPetAt: (type, col, opt)=> buildPet(type, col, opt),
  /* ---- จุดต่อชุดเทสเฟส 12.1 (ของเล่นสัตว์เลี้ยง) ----
     เดินไปซื้อ+เปิดเมนู+กดเล่นทีละชิ้นในฉาก 3D ทำในเทสไม่ไหว ⇒ เรียกผ่านทางเดินโค้ดจริงแทน */
  petToySpecs: ()=> Object.keys(PET_TOYS3D.SPECS || {}),
  petActArg:  ()=> petAct ? petAct.arg : null,
  petActProps:()=> petAct ? petAct.props.length : -1,
  /* เริ่มเล่นของเล่นชิ้นนั้นผ่าน startPetAct เส้นเดียวกับที่ปุ่มในเมนูฟองเรียก */
  petPlayToy: id => startPetAct(id === 'ball' ? 'ball' : 'toy', id),
  /* กรอเวลาในท่าไปข้างหน้า — **จำเป็นจริงสำหรับชุดเทส ไม่ใช่ของอำนวยความสะดวก**
     เครื่องเทสวาดได้ ~3 fps (WebGL ซอฟต์แวร์) และ engine clamp dt ที่ 50ms/เฟรม
     ⇒ ท่ายาว 4.5 วิในเกม กินนาฬิกาจริง ~30 วิ · เล่นครบ 8 ชิ้น = 4 นาที ต่อ 1 เทส
     กรอไปใกล้จบแล้วปล่อยให้เดินเองต่อ ⇒ ยังได้รันทั้งช่วงต้น (สร้างของ) และช่วงจบ
     (จ่ายความสุข + เก็บกวาดของ) ครบทุกบรรทัดที่สำคัญ */
  petActSeek: sec => { if(petAct) petAct.t = sec; return petAct ? petAct.dur : -1; },
  petActDur:  ()=> petAct ? petAct.dur : -1,
  /* สร้างโมเดลของเล่นล้วนๆ (ไม่เริ่มท่า) — ใช้จับชิ้นที่วาดแล้วพัง แบบเดียวกับ buildFurn ของเฟส 8 */
  buildPetToy: id => {
    const sp = petToySpec(id);
    if(!sp) throw new Error('ไม่พบ spec ของเล่น ' + id);
    const g = new THREE.Group();
    const fake = {t:0, dur:sp.dur, arg:id, dx:0, dz:1, faceY:Math.PI,
                  petFrom:new THREE.Vector3(), petTo:new THREE.Vector3(0,0,1),
                  props:[], flags:{}};
    sp.build({a:fake, g:null, u:{}, T:0, dt:0, cp:new THREE.Vector3(),
              add:o=>{ g.add(o); fake.props.push(o); },
              bubble:()=>{}, puff:()=>{}, jingle:()=>{}, ok:()=>{}});
    return g;
  },
  /* ค่ามุมข้อต่อของท่าเด็ก ณ ช่วงเวลา pr (0..1) — เทสใช้ตรวจว่าท่าต่างกันจริงและไม่ล้ำเพดาน
     ⚠ **ห้ามตั้งชื่อว่า `charPose`** — คีย์นั้นถูกจองไว้แล้วท้ายอ็อบเจกต์นี้ (อ่านท่าที่กำลังเล่นอยู่จริง)
       key ซ้ำใน object literal ตัวหลังชนะเสมอ ⇒ ตัวนี้จะเงียบหายโดยไม่มี error ให้จับ
       (กับดักเดียวกับ `action` ของเปียโนในเฟส 9 — เจอซ้ำอีกรอบตอนทำเฟส 12.1) */
  charActKind: ()=> charAct ? charAct.kind : null,
  /* ⚠ เครื่องเทสวาดได้ ~3 fps ⇒ "นิ่งไป 1 วิ" ไม่ได้แปลว่าหยุดเดินแล้ว (ก้าวละ ~2 วิจริง)
     เทสที่ต้องรอให้เด็กเดินถึงที่ ให้ดูธงนี้ **ห้ามเดาจากเวลา** */
  walking: ()=> !!hChar.walking,
  poseAt: (kind, pr)=> charPoseAt(kind, pr),
  poseKinds: ()=> (PET_TOYS3D.POSE_KINDS || []).slice(),
  /* ---- จุดต่อชุดเทสเฟส 8 (คลังเฟอร์นิเจอร์ 180 ชิ้น + ของแต่งตัว 114 แบบ) ----
     สร้างของ/ตัวละครจริงผ่านทางเดินโค้ดเดียวกับในเกม เพื่อจับชิ้นที่วาดแล้วพัง
     (เดินไปซื้อ+วางทีละชิ้นในฉาก 3D ทำในเทสไม่ไหว) */
  furn: ()=> FURN,
  rows: ()=> H_ROWS,
  defaultChar: ()=> Object.assign({}, H_DEFAULT_CHAR),
  buildFurn: id => { const it = FURN.byId[id]; if(!it) throw new Error('ไม่พบ '+id);
    const g = new THREE.Group(); it.build(g, (it.colors && it.colors[0]) || 0xffffff, decorKit()); return g; },
  buildChar: cfg => buildCharacter(cfg),
  openCreator: ()=> openCreator(true),
  /* ตั้งค่าตัวละครในหน้าแต่งตัวตรงๆ แล้ววาดใหม่ — ใช้ถ่ายรูปเทียบทรงผม/หมวกทีละแบบ
     (`creatorCfg` เป็น `let` ระดับโมดูล จึงไม่ได้อยู่บน window ให้เทสแตะเองได้) */
  setCreatorCfg: patch => { if(!creatorCfg) return null;
                            Object.assign(creatorCfg, patch || {});
                            rebuildChar(creatorCfg); buildCreatorRows(creatorCfg);
                            return Object.assign({}, creatorCfg); },
  /* ผัง NPC ทั้งเมือง + ปิดการ์ดเควสต์ (ชุดเทสเฟส 6-7 สร้าง engine เควสต์ตัวที่ 2 มาไล่ทุกระดับชั้น
     ⚠ ถ้าไม่ส่ง npcDefs เข้าไป งาน "ส่งของถึงมือ" จะหาปลายทางไม่ได้แล้วถอยไปใช้ count เงียบๆ
       ⇒ เทสผ่านโดยไม่เคยรันโค้ดของกลไกนั้นเลยสักบรรทัด) */
  npcDefs: ()=> NPC_DEFS,
  closeQuest: ()=> closeQuestPanel(),
  /* เฟส 9 — เครื่องดนตรี (ชุดเทสเรียกเล่นเสียงผ่านทางเดินโค้ดจริง แทนการเดินไปแตะในฉาก 3D) */
  hasInstrument: ()=> hasInstrument(),
  playInstrument: (g, it)=> playInstrument(g, it),
  /* ---- จุดต่อชุดเทส 2026-08-16 ----
     ⚠ ชื่อ hook ใหม่ต้อง grep ก่อนเสมอ — คีย์ซ้ำใน object literal ตัวหลังชนะเงียบๆ ไม่มี error
       (กับดักเดิมของ `charPose` เฟส 12.1 และ `action` ของเปียโนเฟส 9) */
  musicItems: ()=> FURN.items.filter(it => it.cat === 'music')
                    .map(it => ({id:it.id, voice:it.voice || 'piano',
                                 note:it.note | 0, tune:it.tune || null})),
  /* ชุดเทส: ตำแหน่งช่องของเพื่อนที่กำลังแอบ (ดูว่าล้อมวงไม่ทับกันจริงไหม) */
  seekPos: ()=>{
    const P = window.HousePlay;
    if(!P || !P.state || !P.state().seek) return [];
    return (window.__seekObjPos || []).slice();
  },
  /* 🎣 สถานะเควสต์ "ตกปลาไปส่ง" — ตัวนับของจริงที่หน้าจอถืออยู่ */
  /* 🏪 ชุด B: สั่งให้ "ถึงร้านแล้ว" ผ่านทางเดินโค้ดจริง (ชุดเทสไม่ต้องเดินข้ามเมือง) */
  routineCats: ()=> routineCats(),
  /* ชุดเทส: ล้าง/ยัดของในบ้านเพื่อทดสอบด่านกันงานตันของเควสต์กิจวัตร */
  setDecor: d => { saveHouseData({decor: d}); },
  decorKit: () => decorKit(),   /* เครื่องมือไล่ตรวจว่าเฟอร์นิเจอร์ทุกชิ้นสร้างโมเดลออกมาถูกจริง */
  martArrive: ()=>{ if(walkQuest && walkQuest.target === 'mart' && walkQuest.leg === 1) openMartBoard(); },
  walkLeg: ()=> walkQuest ? {target:walkQuest.target, leg:walkQuest.leg | 0, spent:walkQuest.spent | 0,
                             buy:!!walkQuest.buy, done:catchDone(), toNpc:walkQuest.toNpc} : null,
  /* ชุดเทส: สถานะลูกศรนำทาง (เป้าที่ชี้อยู่ + อยู่นอกจอไหม) */
  qArrow: ()=>{ const t = questArrowTarget(); const el = $('house-qarrow');
                return {target:t, shown: !!(el && !el.hidden),
                        left: el ? el.style.left : '', top: el ? el.style.top : ''}; },
  walkCatch: ()=> (walkQuest && (walkQuest.target === 'catch' || walkQuest.target === 'mart'))
                    ? {where: walkQuest.where, need: walkQuest.need, got: walkQuest.got,
                       toNpc: walkQuest.toNpc, done: catchDone()} : null,
  /* ---- จุดต่อชุดเทสเฟส 13 ----
     🎺 วงดนตรี: จำนวนคนที่กำลังเต้น + สั่งเรียกคนมามุงจากพิกัดหนึ่ง (แทนการเดินไปแตะเครื่องจริง)
     🕵️ ทายว่าใคร: ขอเงาของคนคนนั้นมาเทียบว่าแยกออกจากคนอื่นจริงไหม */
  dancers: ()=> npcs.filter(n => n.dance > 0).length,
  bandAt: (x, z)=> gatherCrowd({position:{x: outWX(x), y:0, z: outWZ(z)}}),
  npcShadow: id => buildNpcShadow(id),
  petTrick: id => startPetAct('trick', id),
  petY: ()=> hPet.group ? hPet.group.position.y : -1,
  /* จังหวะเฟรมของลูปวาด — ใช้วัดว่า "หรี่เฟรมตอนเปิดกล้อง" แล้วยังเดินสม่ำเสมอไหม
     (ผู้ใช้แจ้ง 2026-08-12 ว่าโลกกระตุกตอนเปิดกล้อง — ต้นเหตุคือหรี่แบบเว้นตามเวลา) */
  frameLog: ()=> frameLog.slice(),
  /* ชุดเทส: สั่งให้เด็กเดินไปนั่งเก้าอี้/โต๊ะตัวแรกในบ้าน (เส้นทางเดียวกับตอนแตะของจริง) */
  sitIndoor: ()=>{
    const g = (decorGroups.in || []).filter(x=>{
      const d = x.userData && x.userData.deco;
      return d && d.item && (d.item.cat === 'seat' || d.item.cat === 'table') && d.item.sit;
    })[0];
    if(!g) return false;
    decorInteract(g);
    return true;
  },
  /* 🪑 เฟส 17 — ชุดเทสของตกแต่งที่ใช้งานได้: แตะของชิ้นที่ id นี้ในบ้านผ่านทางเดินโค้ดจริง
     (ชื่อคีย์ grep แล้วว่าไม่ซ้ำของเดิม) · useState = สถานะที่มองเห็นได้ของชิ้นนั้น */
  useIndoor: (id)=>{
    const g = (decorGroups.in || []).filter(x=>{
      const d = x.userData && x.userData.deco;
      return d && d.item && d.item.id === id;
    })[0];
    if(!g) return false;
    decorInteract(g);
    return true;
  },
  /* 👋 เฟส 18 — ความจำของเพื่อนบ้าน (ชุดเทส) */
  neigh: ()=> NEIGH,
  /* action ที่ผูกกับของชิ้นนั้นในคลังเฟอร์นิเจอร์ (ชุดเทสเฟส 17) */
  furnAct: (id)=>{ const it = FURN.byId[id]; return it ? (it.action || '') : null; },
  /* คลังนิทาน/ตารางของที่ใช้งานได้ของเฟส 17 (ชุดเทสไล่ตรวจ) */
  usable: ()=> USABLE ? {tales: (USABLE.TALES || []).length, use: Object.keys(USABLE.USE || {})} : null,
  useState: (id)=>{
    const g = (decorGroups.in || []).filter(x=>{
      const d = x.userData && x.userData.deco;
      return d && d.item && d.item.id === id;
    })[0];
    if(!g) return null;
    return {tvOn: !!g.userData.tvOn, bars: (g.userData.tvBars || []).length,
            boost: g.userData.tankBoost || 0, shift: g.userData.animShift || 0};
  },
  /* งานเดินที่กำลังค้างอยู่ (ชุดเทสเควสต์ family-time / shopping-list) */
  walkQuest: ()=> walkQuest ? {target: walkQuest.target, idx: walkQuest.run.idx} : null,
  /* รอยเท้าบอกจุดหมาย — ชุดเทสตรวจว่าปักตรงช่องปลายทางจริงและหายเมื่อเดินถึง */
  walkMark: ()=> walkMark ? {on:walkMark.visible, x:walkMark.position.x, z:walkMark.position.z,
                             ry:walkMark.rotation.y} : null,
  /* ตารางท่าประจำของพ่อแม่ (ชุดเทสตรวจว่าแต่ละกิจกรรมมีท่าของตัวเอง ไม่ใช่ท่าเดียวกันหมด) */
  pose: ()=> PARENT_POSE,
  /* ท่าทางของ "ตัวเด็ก" ที่กำลังเล่นอยู่ (เฟส 11 — ปลูก/รดน้ำ/เก็บ/เหวี่ยงเบ็ด)
     ⚠ ดูค่ามุมจริงบนโมเดล ไม่ใช่ดูแค่ว่า charAct ถูกตั้ง — เคยตั้งค่าแล้วแต่ไม่มีผลบนตัวโมเดล */
  charPose: ()=>{
    const u = charGroup && charGroup.userData;
    if(!u || !u.rig) return null;
    return {act: charAct ? charAct.kind : null, hold: !!(charAct && charAct.hold),
            rigX: u.rig.rotation.x, rigY: u.rig.position.y,
            legX: u.legs[0].rotation.x,
            armL: u.arms[0].rotation.x, armR: u.arms[1].rotation.x};
  },
  /* กระโดดไปที่ p (0-1) ของท่าที่กำลังเล่น — ใช้ตรวจ "ท่าที่จังหวะนั้นหน้าตาเป็นยังไง" ด้วยภาพจริง
     (ถ่าย screenshot กินเวลาเองหลายร้อย ms จับจังหวะของอนิเมชันสั้นๆ ตรงๆ ไม่ได้) */
  poseSeek: p => { if(charAct) charAct.t0 = performance.now() - charAct.dur * p; },
  /* เข้าบ้านเสร็จสมบูรณ์หรือยัง — **ชุดเทสต้องรอค่านี้ก่อนสั่งอะไรเสมอ** ไม่ใช่รอแค่ mode()==='world' */
  ready: ()=> houseStarted,
  npcPos:id=>{ const n = npcs.find(k=>k.def.id===id); return n ? {x:n.g.position.x, z:n.g.position.z} : null; },
  /* พิกัดบนจอของชาวบ้าน (สำหรับชุดเทสเลื่อนเมาส์ไปวางให้ตรงตัว) — ยิงที่กลางลำตัว ไม่ใช่ที่เท้า */
  npcScreen:id=>{
    const n = npcs.find(k=>k.def.id===id); if(!n) return null;
    const v = new THREE.Vector3(n.g.position.x, n.g.position.y + 1.1, n.g.position.z).project(camera);
    return {x:(v.x+1)/2*window.innerWidth, y:(1-v.y)/2*window.innerHeight, z:v.z};
  },
  /* ชาวบ้านคนแรกที่ "อยู่ในเฟรมจริง" ตอนนี้ — ชุดเทสต้องใช้ตัวนี้ ไม่ใช่หยิบจากรายชื่อเควสต์
     (คนที่มีงานวันนี้กระจายอยู่ทั่วเมือง ส่วนใหญ่ไม่ได้อยู่ในจอตอนเด็กยืนอยู่หน้าบ้าน) */
  /* ยิง ray ใส่ตัวชาวบ้านที่พิกัดจอนี้ คืน id ที่โดน (ชุดเทส/ดีบักเคอร์เซอร์ฟองคำพูด) */
  hitNpc:(cx, cy)=>{
    raycaster.setFromCamera(ndcFromClient(cx, cy), camera);
    const h = raycaster.intersectObjects(npcs.map(n=>n.g), true);
    if(!h.length) return null;
    let o = h[0].object;
    /* ⚠ `userData.hNpc` เก็บ **def** (`d`) ไม่ใช่ record `n` — ดูตอนสร้างใน buildNpcs() */
    while(o){ if(o.userData && o.userData.hNpc) return o.userData.hNpc.id; o = o.parent; }
    return 'hit-but-untagged';
  },
  /* ⚠ **เลือกคนที่ยืนประจำที่ก่อนเสมอ** — ชาวบ้านที่เดินไปมาจะขยับทุกเฟรม พอเทสวัดพิกัดแล้วค่อย
     เลื่อนเมาส์ไป เขาเดินหนีไปแล้ว (เจอตอนเขียนเทสเคอร์เซอร์ 2026-08-09) */
  npcOnScreen:()=>{
    const W = window.innerWidth, H = window.innerHeight, m = 60;
    const seen = (n)=>{
      const v = new THREE.Vector3(n.g.position.x, n.g.position.y + 1.1, n.g.position.z).project(camera);
      if(v.z >= 1) return null;                    /* อยู่หลังกล้อง */
      const x = (v.x+1)/2*W, y = (1-v.y)/2*H;
      return (x > m && y > m && x < W-m && y < H-m) ? {id:n.def.id, x, y} : null;
    };
    const still = npcs.filter(n => !n.route && !(n.tiles && n.tiles.length));
    for(let i=0; i<still.length; i++){ const r = seen(still[i]); if(r) return r; }
    for(let i=0; i<npcs.length; i++){ const r = seen(npcs[i]); if(r) return r; }
    return null;
  },
  questNpc:()=>qzNpcId,
  /* อนิเมชันป้อนอาหาร — ชุดเทสใช้ยืนยันว่ามีชามโผล่ในฉากจริงและน้องเดินเข้ามาหาเด็ก */
  feeding:()=>!!feedAnim,
  petPos:()=>hPet.group ? {x:hPet.group.position.x, z:hPet.group.position.z} : null,
  charPos:()=>charGroup ? {x:charGroup.position.x, z:charGroup.position.z} : null,
  sitting:()=>!!sitState, tile:()=>({x:hChar.tile.x, z:hChar.tile.z}),
  /* แผ่น atlas ของป้ายร้าน — ชุดเทสใช้ดูว่าป้ายในเมืองวาดด้วยไอคอน SVG จริงไหม */
  signAtlas:()=> (signMat && signMat.map ? signMat.map.image : null),
  /* ป้ายร้านทุกอันในเมือง + ไอคอน SVG ที่ผูกไว้ (null = ยังไม่มี ⇒ ป้ายนั้นยังเป็น emoji) */
  signIcons:()=> SIGN_ICONS.map(e => ({e, id: SIGN_SVG[e] || null})),
  /* ชาวบ้านทั้งหมด (id ใช้เป็น id ไอคอนตรงๆ) — ชุดเทสใช้ตรวจว่ามีไอคอนครบ */
  npcDefs:()=> NPC_DEFS.map(d => ({id:d.id, name:d.name})),
  posChipEnabled:()=> POS_CHIP_ENABLED,
  /* ทำให้น้องเลอะ/สะอาดทันที (ชุดเทส + ดูรอยเปื้อนด้วยตา) — เขียนผ่าน save แล้วประกอบโมเดลใหม่ */
  setPetDirty:(v)=>{
    const d = loadHouseData() || {};
    const c = Object.assign({}, d.care || {});
    /* ⚠ `dayKey()` เป็นของ js/house-pet-care.js (คนละไฟล์) ⇒ เรียกจากที่นี่ไม่ได้
       ใช้ค่าที่ทำให้ระบบตีความว่า "เพิ่งอาบ" แทน: noBath 0 + dirty false ก็พอ */
    c.dirty = !!v; c.noBath = v ? 9 : 0;
    saveHouseData({care: c});
    petCareHud.t = 0;
    restylePet();
    const u = hPet.group && hPet.group.userData.anim;   /* ⚠ dirt เก็บใน userData.anim ไม่ใช่ userData ตรงๆ */
    return !!(u && u.dirt);
  },
  /* กรอบพรีวิวสินค้า — ชุดเทสใช้ยืนยันว่า "หมุนรอบตัวเอง" ไม่ใช่ "โคจรรอบจุดข้างตัว" */
  previewOpen:(spec)=>openShopPreview(spec),
  /* ตำแหน่งโมเดลในกรอบพรีวิว — ตัวละครต้องอยู่ที่ x=0,z=0 เป๊ะ (หมุนรอบแกนลำตัว) */
  previewPos:()=> prevModel ? {x:+prevModel.position.x.toFixed(4),
                               z:+prevModel.position.z.toFixed(4)} : null,
  previewRot:(r)=>{ prevSpin = false; prevRotY = r; if(prevHolder) prevHolder.rotation.y = r; },
  previewCenter:()=>{
    if(!prevModel || !prevCam) return null;
    const bb = new THREE.Box3().setFromObject(prevModel);
    const c = new THREE.Vector3(); bb.getCenter(c);
    c.project(prevCam);
    return {x:+c.x.toFixed(3), y:+c.y.toFixed(3)};
  },
  zoom:()=> hZoom,
  /* 🧭 ลูกศรนำทาง (ตัวโคจรรอบตัวเด็ก) — null = ตอนนี้ไม่มีลูกศร */
  guide:()=>{ const e = $('house-qarrow');
              return (e && !e.hidden) ? {left:e.style.left, top:e.style.top} : null; },
  guideGoal:()=> guideForce || questGuideTile(),
  fishZoom:()=> ({base:fishZoomBase, want:fishZoomWant, off:fishZoomOff, near:nearFishStand()}),
  /* ชุดเทส: วาดฟองคำพูดผ่านทางเดินโค้ดจริง */
  talkBubble:(ico, emoji, name, text)=> showTalkBubble($('house-npc-bubble'), ico, emoji, name, text),
  openBoard:()=> openQuestBoard(),
  /* จำนวนชิ้นในฉากตัวละครหน้าเลือกเด็ก — ชุดเทสใช้ยืนยันว่าฉากจำลองเมืองถูกสร้างจริง */
  cvSceneSize:()=> cvS ? cvS.children.length : 0,
  /* จูนกรอบกล้องของตัวละครหน้าเลือกเด็ก (เครื่องมือ: เรียกแล้วถ่ายภาพเทียบ) */
  cvZoom:(h,a)=>{ CV_HALF = h; if(a!=null) CV_AIM = a;
    if(cvCam){ cvCam.top=h; cvCam.bottom=-h; cvCam.lookAt(0, CV_AIM, 0); }
    if(window.HouseCharView) HouseCharView.resize(); }};
})();
