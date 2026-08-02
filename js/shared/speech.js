/* ================================================================================
   การเลือกเสียงอ่าน (speechSynthesis) ที่หน้าเด็กกับโหมดครูใช้เหมือนกัน
   ================================================================================ */

function pickThaiVoice(){
  if(!window.speechSynthesis) return null;
  return speechSynthesis.getVoices().find(v=>v.lang && v.lang.toLowerCase().startsWith('th')) || null;
}

function pickEnglishVoice(){
  if(!window.speechSynthesis) return null;
  const en = speechSynthesis.getVoices().filter(v=>v.lang && v.lang.toLowerCase().startsWith('en'));
  if(!en.length) return null;
  const preferred = ['Google US English','Google UK English Female','Samantha','Microsoft Zira','Microsoft','Daniel','Karen','Moira','Aaron','Allison','Ava','Serena'];
  for(const name of preferred){ const v = en.find(x=>x.name.indexOf(name)>=0); if(v) return v; }
  return en.find(v=>v.lang.toLowerCase()==='en-us' && !EN_NOVELTY_VOICE.test(v.name))
      || en.find(v=>!EN_NOVELTY_VOICE.test(v.name))
      || en.find(v=>v.default) || en[0];
}
