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
const H_SHIRT_COLORS  = [0xef5350,0xffa726,0xffd54f,0x9ccc65,0x4db6ac,0x42a5f5,0x7986cb,0xba68c8,0xf06292,0x8d6e63];
const H_BOTTOM_COLORS = [0x3f5aa8,0x6d4c41,0x455a64,0x00897b,0xc62828,0xf48fb1,0x9575cd,0x558b2f,0xffb74d,0x263238];
const H_SHOE_COLORS   = [0xffffff,0x333333,0xef5350,0x42a5f5,0xffca28,0x66bb6a,0xab47bc,0x8d6e63];
const H_HAIR_N = 10, H_EYE_N = 8;

const H_DEFAULT_CHAR = {gender:0, hair:0, hairC:0, eyes:1, eyeC:0, shirt:5, bottom:0, shoes:0};

const H_ROWS = [
  {key:'gender', label:'🧒 หนูเป็น...', type:'text', options:['👦 เด็กชาย','👧 เด็กหญิง']},
  {key:'hair',   label:'💇 ทรงผม',      type:'num',  n:H_HAIR_N},
  {key:'hairC',  label:'🖌️ สีผม',       type:'color', colors:H_HAIR_COLORS},
  {key:'eyes',   label:'👀 ดวงตา',      type:'num',  n:H_EYE_N},
  {key:'eyeC',   label:'🔮 สีตา',       type:'color', colors:H_EYE_COLORS},
  {key:'shirt',  label:'👕 สีเสื้อ',     type:'color', colors:H_SHIRT_COLORS},
  {key:'bottom', label:'👖 สีกางเกง/กระโปรง', type:'color', colors:H_BOTTOM_COLORS},
  {key:'shoes',  label:'👟 สีรองเท้า',   type:'color', colors:H_SHOE_COLORS},
];

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
const creatorState = {dragging:false, lastX:0, autoRot:true, rotY:0, fromWorld:false};

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
function box(w,h,d,hex){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), toonMat(hex));
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

function addHair(head, style, hex){
  const c = hex;
  const cap = () => { const m = box(.68,.15,.68,c); m.position.y = .3; head.add(m);
                      const back = box(.68,.42,.1,c); back.position.set(0,.05,-.3); head.add(back); };
  switch(style){
    case 0: cap(); break;                                             /* สั้นเรียบ */
    case 1: { const m = box(.8,.2,.8,c); m.position.y = .3; head.add(m); /* ทรงเห็ด */
              const b = box(.8,.34,.12,c); b.position.set(0,.1,-.35); head.add(b); break; }
    case 2: { cap(); const f = box(.62,.16,.08,c); f.position.set(0,.2,.32); head.add(f); break; } /* หน้าม้า */
    case 3: { cap(); const b = sphere(.15,c); b.position.set(0,.46,0); head.add(b); break; }       /* จุก */
    case 4: { cap(); [-1,1].forEach(s=>{ const b = sphere(.12,c); b.position.set(.38*s,.34,0); head.add(b); }); break; } /* สองแกละ */
    case 5: { cap(); const t = box(.16,.5,.14,c); t.position.set(0,-.05,-.4); t.rotation.x = .18; head.add(t); break; }  /* หางม้า */
    case 6: { cap(); const f = box(.62,.16,.08,c); f.position.set(0,.2,.32); head.add(f);          /* เปียคู่ */
              [-1,1].forEach(s=>{ const p = box(.13,.55,.13,c); p.position.set(.34*s,-.12,-.18); head.add(p); }); break; }
    case 7: { [[0,.36,0,.2],[.2,.3,.12,.16],[-.2,.3,.12,.16],[.12,.32,-.16,.16],[-.12,.32,-.16,.16],[0,.26,-.26,.15]]
              .forEach(p=>{ const b = sphere(p[3],c); b.position.set(p[0],p[1],p[2]); head.add(b); }); break; }          /* หยิกฟู */
    case 8: { cap(); [[-.16,.1],[0,0],[.16,.1]].forEach((p,i)=>{                                    /* ตั้งชี้ */
              const s = new THREE.Mesh(new THREE.ConeGeometry(.08,.22,6), toonMat(c));
              s.castShadow = hShadows; s.position.set(p[0],.46,p[1]); head.add(s); }); break; }
    case 9: { cap(); const f = box(.62,.16,.08,c); f.position.set(0,.2,.32); head.add(f);           /* ยาวตรง */
              [-1,1].forEach(s=>{ const p = box(.12,.62,.5,c); p.position.set(.4*s,-.14,-.06); head.add(p); });
              const bk = box(.66,.62,.12,c); bk.position.set(0,-.14,-.36); head.add(bk); break; }
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
  const shirtC = H_SHIRT_COLORS[cfg.shirt] ?? H_SHIRT_COLORS[0];
  const botC = H_BOTTOM_COLORS[cfg.bottom] ?? H_BOTTOM_COLORS[0];
  const shoeC = H_SHOE_COLORS[cfg.shoes] ?? H_SHOE_COLORS[0];

  /* ขา (pivot ที่สะโพก y .42 ให้แกว่งได้) — เด็กชายขากางเกงยาวถึงเท้า เด็กหญิงใส่กระโปรง+ขาสีผิว */
  const legs = [-1,1].map(s=>{
    const piv = new THREE.Group(); piv.position.set(.12*s,.42,0);
    const leg = box(.17,.32,.17, girl ? H_SKIN : botC); leg.position.y = -.16; piv.add(leg);
    const shoe = box(.19,.11,.24, shoeC); shoe.position.set(0,-.33,.03); piv.add(shoe);
    rig.add(piv); return piv;
  });
  if(girl){
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.24,.4,.24,10), toonMat(botC));
    skirt.castShadow = hShadows; skirt.position.y = .42; rig.add(skirt);
  }
  /* ตัว */
  const body = box(.52,.5,.32, shirtC); body.position.y = .68; rig.add(body);
  /* แขน (pivot ที่ไหล่) */
  const arms = [-1,1].map(s=>{
    const piv = new THREE.Group(); piv.position.set(.33*s,.88,0);
    const arm = box(.13,.38,.15, shirtC); arm.position.y = -.13; piv.add(arm);
    const hand = box(.11,.09,.13, H_SKIN); hand.position.y = -.35; piv.add(hand);
    rig.add(piv); return piv;
  });
  /* หัว + หน้า */
  const head = new THREE.Group(); head.position.y = 1.26; rig.add(head);
  const skull = box(.64,.6,.66, H_SKIN); head.add(skull);
  addHair(head, cfg.hair|0, H_HAIR_COLORS[cfg.hairC] ?? H_HAIR_COLORS[0]);
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

  /* พื้น: บล็อกหญ้า 2 เฉดสลับ checker + น้ำ (InstancedMesh ลด draw call) */
  const tileGeo = new THREE.BoxGeometry(1,.3,1);
  const counts = {g1:0,g2:0,w:0};
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    const t = outGrid[z][x];
    if(t===1) counts.w++; else ((x+z)%2 ? counts.g2++ : counts.g1++);
  }
  const inst = {
    g1: new THREE.InstancedMesh(tileGeo, toonMat(0x8fd06c), counts.g1),
    g2: new THREE.InstancedMesh(tileGeo, toonMat(0x7cc25a), counts.g2),
    w:  new THREE.InstancedMesh(tileGeo, toonMat(0x6cc6e8), counts.w),
  };
  const idx = {g1:0,g2:0,w:0};
  const m4 = new THREE.Matrix4();
  for(let z=0; z<OUT_D; z++) for(let x=0; x<OUT_W; x++){
    const t = outGrid[z][x];
    const key = (t===1) ? 'w' : ((x+z)%2 ? 'g2' : 'g1');
    m4.makeTranslation(outWX(x), t===1 ? -.23 : -.15, outWZ(z));
    inst[key].setMatrixAt(idx[key]++, m4);
  }
  Object.values(inst).forEach(im=>{ im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows; worldGroup.add(im); });

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
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6,1.3,4), toonMat(0xef8354));
  roof.castShadow = hShadows; roof.rotation.y = Math.PI/4; roof.position.y = 2.25; house.add(roof);
  const door = box(.76,1.14,.1,0x9c6238); door.position.set(.5,.57,1.32); house.add(door);
  const knob = sphere(.05,0xffd54f,8); knob.position.set(.78,.55,1.4); house.add(knob);
  const win1 = box(.62,.62,.1,0xaadcf5); win1.position.set(-.8,.95,1.32); house.add(win1);
  const winf = box(.74,.74,.06,0xffffff); winf.position.set(-.8,.95,1.3); house.add(winf);
  const win2 = box(.1,.62,.62,0xaadcf5); win2.position.set(1.72,.95,0); house.add(win2);
  house.position.set(outWX(3.5), 0, outWZ(3));
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
    tr.position.set(outWX(x), 0, outWZ(z));
    tr.rotation.y = (x*7+z*13)%6;
    worldGroup.add(tr);
  });

  /* ดอกไม้เล็กๆ (ไม่บล็อกทางเดิน) */
  FLOWERS.forEach(([x,z],i)=>{
    const fl = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.18,6), toonMat(0x4caf50));
    stem.position.y = .09; fl.add(stem);
    const bl = sphere(.07,[0xff8fb3,0xffd54f,0xb388ff,0xff8a65][i%4],8); bl.position.y = .2; fl.add(bl);
    fl.position.set(outWX(x)+.22, 0, outWZ(z)-.18);
    worldGroup.add(fl);
  });

  scene.add(worldGroup);
}

/* ---------- ฉากในบ้าน ---------- */
function inWX(gx){ return gx - (IN_W-1)/2; }
function inWZ(gz){ return gz - (IN_D-1)/2; }

function buildInterior(){
  interiorGroup = new THREE.Group();
  inGrid = [];
  for(let z=0; z<IN_D; z++){ inGrid.push(new Array(IN_W).fill(0)); }

  const tileGeo = new THREE.BoxGeometry(1,.3,1);
  const im1 = new THREE.InstancedMesh(tileGeo, toonMat(0xe6bc7f), Math.ceil(IN_W*IN_D/2));
  const im2 = new THREE.InstancedMesh(tileGeo, toonMat(0xd9a967), Math.floor(IN_W*IN_D/2));
  const idx = [0,0]; const m4 = new THREE.Matrix4();
  for(let z=0; z<IN_D; z++) for(let x=0; x<IN_W; x++){
    m4.makeTranslation(inWX(x), -.15, inWZ(z));
    if((x+z)%2){ im2.setMatrixAt(idx[1]++, m4); } else { im1.setMatrixAt(idx[0]++, m4); }
  }
  [im1,im2].forEach(im=>{ im.instanceMatrix.needsUpdate = true; im.receiveShadow = hShadows; interiorGroup.add(im); });

  /* ผนัง 2 ด้านไกลกล้อง (กล้องมองจาก +x,+z) คือด้าน x ต่ำ และ z ต่ำ */
  const wallC = 0xfbe3c0;
  const wallBack = box(IN_W,2.1,.2,wallC); wallBack.position.set(0,1.05,inWZ(0)-.6); interiorGroup.add(wallBack);
  const wallLeft = box(.2,2.1,IN_D,wallC); wallLeft.position.set(inWX(0)-.6,1.05,0); interiorGroup.add(wallLeft);
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
      /* มือถือ: แผงเป็น bottom sheet — เลื่อนเฟรมให้ตัวละคร "เต็มตัวรวมรองเท้า"
         อยู่ในพื้นที่ว่างเหนือแผง (แผงสูง ~56-60vh — เผื่อเฟรมถึง y -0.35 ที่ ~42% บนจอ) */
      const H = 5.0;
      camera.top = 1.0; camera.bottom = camera.top - H;
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
function updateLights(){
  const night = (typeof isNightMode==='function') && isNightMode();
  if(night){
    hemiLight.color.set(0x8fa3d9); hemiLight.groundColor.set(0x39406b); hemiLight.intensity = .55;
    dirLight.color.set(0xbcd0ff); dirLight.intensity = .5;
  }else{
    hemiLight.color.set(0xfff6e0); hemiLight.groundColor.set(0xcde8b0); hemiLight.intensity = .62;
    dirLight.color.set(0xffffff); dirLight.intensity = .68;
  }
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
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.45,.22,24), toonMat(0xa5d6a7));
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
    if(hMode==='creator'){ creatorState.dragging = true; creatorState.lastX = e.clientX; creatorState.autoRot = false; }
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e=>{
    if(!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(Math.hypot(e.clientX-downX, e.clientY-downY) > 10) moved = true;
    if(hMode==='creator' && creatorState.dragging && pointers.size===1){
      creatorState.rotY += (e.clientX - creatorState.lastX) * .012;
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
    const hitHouse = raycaster.intersectObjects(houseClickables, false);
    if(hitHouse.length){ walkTo(DOOR_TILE.x, DOOR_TILE.z, {enter:true}); return; }
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
  if(!hChar.walking){ finishArrive(); }
}

function finishArrive(){
  if(hChar.pendingEnter){ hChar.pendingEnter = false; switchScene('in'); }
  else if(hChar.pendingExit){ hChar.pendingExit = false; switchScene('out'); }
}

function tileWorld(t){
  return hScene==='out'
    ? new THREE.Vector3(outWX(t.x), 0, outWZ(t.z))
    : new THREE.Vector3(inWX(t.x), 0, inWZ(t.z));
}

function switchScene(to){
  const fade = $('house-fade');
  fade.classList.add('on');
  setTimeout(()=>{
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
    setTimeout(()=>fade.classList.remove('on'), 60);
  }, 300);
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
    lab.className = 'house-row-label'; lab.textContent = row.label;
    div.appendChild(lab);
    const chips = document.createElement('div');
    chips.className = 'house-chip-wrap';
    const n = row.type==='color' ? row.colors.length : (row.type==='num' ? row.n : row.options.length);
    for(let i=0;i<n;i++){
      const b = document.createElement('button');
      b.className = 'house-chip' + (row.type==='color' ? ' house-chip-color' : '');
      b.type = 'button';
      if(row.type==='color'){
        b.style.background = '#'+row.colors[i].toString(16).padStart(6,'0');
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
  creatorState.autoRot = true; creatorState.rotY = 0;
  const saved = loadHouseData();
  creatorCfg = Object.assign({}, H_DEFAULT_CHAR, (saved && saved.char) || {});
  $('house-creator').hidden = false;
  $('house-edit-btn').hidden = true;
  $('house-hint').hidden = true;
  $('house-creator-title').textContent = fromWorld ? '✏️ แก้ไขตัวละครของหนู' : '🧒 สร้างตัวละครของหนู';
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

/* ---------- loop ---------- */
const WALK_SPEED = 3;      /* ช่อง/วินาที */
function frame(t){
  if(!houseOpen) return;
  rafId = requestAnimationFrame(frame);
  const dt = Math.min(.05, (t - lastT)/1000 || 0);
  lastT = t;
  const u = charGroup && charGroup.userData;

  if(hMode==='creator'){
    if(creatorState.autoRot) creatorState.rotY += dt*.7;
    if(charGroup){
      charGroup.rotation.y = creatorState.rotY;
      /* ท่ายืนหายใจเบาๆ ให้ดูมีชีวิต */
      if(u){ u.rig.position.y = Math.sin(t*.0022)*.02; u.arms[0].rotation.z = .06+Math.sin(t*.0022)*.03; u.arms[1].rotation.z = -.06-Math.sin(t*.0022)*.03; }
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
      u.arms[0].rotation.z = .06+Math.sin(t*.0022)*.03;
      u.arms[1].rotation.z = -.06-Math.sin(t*.0022)*.03;
    }
    /* หมุนตัวนุ่มๆ เข้าหาทิศเดิน */
    let dr = hChar.targetRotY - charGroup.rotation.y;
    while(dr > Math.PI) dr -= Math.PI*2;
    while(dr < -Math.PI) dr += Math.PI*2;
    charGroup.rotation.y += dr * Math.min(1, dt*10);
    /* กล้องตามตัวละคร */
    camTarget.lerp(charGroup.position, Math.min(1, dt*4));
    applyCamera();
  }
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
  memoryView.hidden = true; listenView.hidden = true; shadowView.hidden = true; mixView.hidden = true;
  houseView.hidden = false;
  document.body.classList.add('house-open');
  houseOpen = true;

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
  updateLights();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const data = loadHouseData();
  if(!data || !data.char){
    openCreator(false);
  }else{
    hMode = 'world';
    $('house-creator').hidden = true;
    $('house-edit-btn').hidden = false;
    creatorGroup.visible = false;
    if(childChanged || !charGroup) rebuildChar(data.char);
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
  homeView.hidden = false;
}

/* ---------- bind ปุ่ม ---------- */
$('house-entry-btn').addEventListener('click', startHouseGame);
$('house-back').addEventListener('click', ()=>{ if(typeof playClick==='function') playClick(); stopHouseGame(); });
$('house-edit-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  if(hMode!=='creator') openCreator(true);
});
$('house-done-btn').addEventListener('click', ()=>{
  if(typeof playClick==='function') playClick();
  closeCreator();
});
})();
