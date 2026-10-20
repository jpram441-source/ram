const CLASSES = ["6th","7th","8th","9th","10th","11th A","11th B","11th B1","11th C","12th A","12th B","12th B1","12th C"];
const SUBJECTS_MAP = {
  "6th":["Tamil","English","Maths","Science","Social Science"],
  "7th":["Tamil","English","Maths","Science","Social Science"],
  "8th":["Tamil","English","Maths","Science","Social Science"],
  "9th":["Tamil","English","Maths","Science","Social Science"],
  "10th":["Tamil","English","Maths","Science","Social Science"],
  "11th A":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "11th B":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "11th B1":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "11th C":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "12th A":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "12th B":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "12th B1":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"],
  "12th C":["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"]
};
function getSubjects(cls){ return SUBJECTS_MAP[cls] || ["Tamil","English","Maths","Physics","Chemistry"]; }
const QUESTION_BANK = {
  "Science": {"photosynthesis":[{q:"Main site of photosynthesis?",opts:["Chloroplast","Mitochondria","Nucleus","Ribosome"],ans:"Chloroplast"},{q:"Gas released in photosynthesis?",opts:["Oxygen","CO2","Nitrogen","Hydrogen"],ans:"Oxygen"}]},
  "Physics": {"newton":[{q:"F=ma is which law?",opts:["Second Law","First Law","Third Law","Zero"],ans:"Second Law"},{q:"SI unit of force?",opts:["Newton","Joule","Watt","Pascal"],ans:"Newton"}]},
  "Computer": {"python":[{q:"Python developed by?",opts:["Guido van Rossum","James Gosling","Dennis Ritchie","Bjarne"],ans:"Guido van Rossum"},{q:"Define function?",opts:["def func():","function func()","func def()","define func()"],ans:"def func():"},{q:"Extension of Python?",opts:[".py",".java",".c",".js"],ans:".py"}]}
};
function generateBookQuestions(topic, subject, count){
  let tl=topic.toLowerCase(), matched=[];
  let bank=QUESTION_BANK[subject]||{};
  for(let k in bank){ if(tl.includes(k)||k.includes(tl)) matched=matched.concat(bank[k]); }
  if(matched.length==0){ for(let k in bank) matched=matched.concat(bank[k]); }
  if(matched.length==0){ matched=[{q:`Define ${topic} in ${subject}?`,opts:[`Concept of ${topic}`,"Unrelated","Wrong","None"],ans:`Concept of ${topic}`}]; }
  let sh=[...matched].sort(()=>0.5-Math.random()), res=[];
  for(let i=0;i<count;i++){ let b=sh[i%sh.length]; res.push({q:`Q${i+1}: ${b.q}`,options:[...b.opts].sort(()=>0.5-Math.random()),answer:b.ans,topic,subject}); }
  return res;
}
function loadDB(k,f){ try{return JSON.parse(localStorage.getItem(k))||f;}catch{return f;} }
function saveDBGeneric(k,v){localStorage.setItem(k,JSON.stringify(v));}
let users=loadDB('ghss_users',null); if(!users){users=[{name:"Owner Admin",username:"owner",emis:"GHSS1001",password:"Owner@123",role:"owner",class:"All"}];saveDBGeneric('ghss_users',users);}
let assignments=loadDB('ghss_assign',[]); let quizzes=loadDB('ghss_quiz',[]); let attempts=loadDB('ghss_attempts',[]);
function saveAll(){saveDBGeneric('ghss_users',users);saveDBGeneric('ghss_assign',assignments);saveDBGeneric('ghss_quiz',quizzes);saveDBGeneric('ghss_attempts',attempts);}
