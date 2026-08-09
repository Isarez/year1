/* ============================================================
   บ้านของหนู — เฟส 4A: พ่อ-แม่ในบ้าน (ข้อ 28 ของ QUEST-DESIGN.md)

   ไฟล์นี้เป็น **ตรรกะล้วน ไม่แตะ DOM/WebGL เลย** เหมือน house-quests.js / house-pet-care.js
   ตัวละคร 3D · ฟองคำพูด · การ์ดคุยอยู่ใน js/house.js · เปิดออกมาที่ window.HouseFamily

   กติกาที่ผู้ใช้ล็อกไว้แล้ว (ข้อ 28):
     - **มี default มาให้ทั้งชื่อและหน้าตา** เด็กเปิดบ้านครั้งแรกเจอพ่อแม่ยืนอยู่เลย
       ไม่มีหน้าจอบังคับสร้างตัวละครก่อน (ต่างจากตัวเด็กเองที่ต้องสร้างก่อนเข้าเมือง)
     - **แก้ได้ทั้งชื่อและทุกแถวของ H_ROWS** เมื่อไหร่ก็ได้
     - ไม่มี `data.parents` = ใช้ค่า default ⇒ เด็กที่เล่นอยู่ก่อนเฟส 4 ไม่พังและไม่ต้อง migrate
     - **โทนต้องเป็น "ขอความช่วยเหลือ" ไม่ใช่ "สั่งให้ทำ"** ทำไม่ได้ไม่มีใครโกรธ ไม่มีบ่น ไม่มีดุ
       (กติกาเหล็กข้อ 2 — ห้ามลงโทษเด็ก)
   ============================================================ */
(function(){
  'use strict';

  const WHO = ['dad', 'mom'];
  const DEF_NAME = {dad:'คุณพ่อ', mom:'คุณแม่'};
  const ICON     = {dad:'👨', mom:'👩'};

  /* บทพูดตอนไม่มีงานให้ทำ — **ให้กำลังใจอย่างเดียว ห้ามมีประโยคทวงงาน/ตำหนิ** */
  const IDLE_LINES = {
    dad: ['วันนี้หนูเก่งมากเลยนะ', 'เหนื่อยไหมลูก พักได้นะ ไม่ต้องรีบ',
          'พ่ออยู่ตรงนี้เสมอนะ', 'อยากคุยอะไรมาบอกพ่อได้เลย'],
    mom: ['หนูของแม่เก่งที่สุดเลย', 'หิวไหมจ๊ะ เดี๋ยวแม่ทำอะไรอร่อยๆ ให้',
          'ค่อยๆ ทำก็ได้นะลูก ไม่ต้องรีบเลย', 'แม่ภูมิใจในตัวหนูมากนะ'],
  };
  /* บทของคนที่ "ไม่ได้เป็นคนขอ" วันนี้ — บอกใบ้ว่าอีกคนมีงาน (ข้อ 28: อีกคนพูดให้กำลังใจ/บอกใบ้) */
  const HINT_LINES = {
    dad: 'วันนี้แม่มีอะไรอยากให้หนูช่วยอยู่นะ ลองไปถามแม่ดูสิ',
    mom: 'วันนี้พ่อมีอะไรอยากให้หนูช่วยอยู่นะ ลองไปถามพ่อดูสิ',
  };
  /* คำขอ (ตอนยื่นงาน) และคำขอบคุณ (ตอนทำเสร็จ) */
  const ASK_LINES = {
    dad: 'มาช่วยพ่อหน่อยได้ไหมลูก',
    mom: 'มาช่วยแม่หน่อยได้ไหมจ๊ะ',
  };
  const THANK_LINES = {
    dad: ['ขอบใจมากนะลูก พ่อดีใจมากเลย 🤗', 'เก่งมากลูก! กอดหน่อย 🤗'],
    mom: ['ขอบใจนะจ๊ะ แม่รักหนูที่สุด 🤗', 'เก่งมากเลยลูก! มากอดแม่หน่อย 🤗'],
  };

  window.HOUSE_FAMILY = function(kit){
    kit = kit || {};
    const load = kit.load || function(){ return {}; };
    const save = kit.save || function(){};
    const defLook = kit.defaults || {dad:{}, mom:{}};

    function isWho(w){ return WHO.indexOf(w) >= 0; }

    /* ข้อมูลพ่อแม่ที่ใช้จริง = ค่าที่เด็กแก้ไว้ ทับลงบนค่า default (ไม่มีข้อมูล = default ล้วน) */
    function one(w){
      const d = load() || {};
      const saved = (d.parents && d.parents[w]) || {};
      return {
        who: w,
        icon: ICON[w],
        name: (saved.name || '').trim() || DEF_NAME[w],
        char: Object.assign({}, defLook[w] || {}, saved.char || {}),
      };
    }
    function parents(){ return {dad: one('dad'), mom: one('mom')}; }

    /* บันทึกชื่อ/หน้าตาที่เด็กแก้ — เขียนเฉพาะคนที่แก้ ไม่ไปแตะอีกคน */
    function setParent(w, patch){
      if(!isWho(w) || !patch) return false;
      const d = load() || {};
      const cur = Object.assign({}, (d.parents || {})[w] || {});
      if(patch.name != null) cur.name = String(patch.name).trim().slice(0, 14);
      if(patch.char) cur.char = Object.assign({}, cur.char || {}, patch.char);
      const next = Object.assign({}, d.parents || {});
      next[w] = cur;
      save({parents: next});
      return true;
    }
    /* คืนค่าเป็น default (ปุ่ม "เอาแบบเดิม" ในหน้าแต่งตัว) */
    function resetParent(w){
      if(!isWho(w)) return false;
      const d = load() || {};
      const next = Object.assign({}, d.parents || {});
      delete next[w];
      save({parents: next});
      return true;
    }

    function idleLine(w, rnd){
      const a = IDLE_LINES[w] || IDLE_LINES.dad;
      return a[Math.floor((rnd == null ? Math.random() : rnd) * a.length) % a.length];
    }
    function hintLine(w){ return HINT_LINES[w] || ''; }
    function askLine(w){ return ASK_LINES[w] || ASK_LINES.dad; }
    function thankLine(w, rnd){
      const a = THANK_LINES[w] || THANK_LINES.dad;
      return a[Math.floor((rnd == null ? Math.random() : rnd) * a.length) % a.length];
    }

    return {
      WHO, DEF_NAME, ICON,
      parents, one, setParent, resetParent,
      idleLine, hintLine, askLine, thankLine,
    };
  };
})();
