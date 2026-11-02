const CLASSES=["6","7","8","9","10","11th A","11th B","11th B1","11th C","12th A","12th B","12th B1","12th C"];
const SUBJECTS_JUNIOR=["Tamil","English","Maths","Science","Social Science"];
const SUBJECTS_SENIOR=["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"];
function getSubjects(cls){if(!cls||cls==="All")return[...new Set([...SUBJECTS_JUNIOR,...SUBJECTS_SENIOR])];if(["6","7","8","9","10"].includes(cls))return SUBJECTS_JUNIOR;return SUBJECTS_SENIOR;}
let users=JSON.parse(localStorage.getItem('ghss_users')||'null')||[{name:"Main Owner",username:"owner",emis:"OWNER001",password:"Owner@123",role:"owner",class:"All"}];
let assignments=JSON.parse(localStorage.getItem('ghss_assign')||'[]');
let quizzes=JSON.parse(localStorage.getItem('ghss_quiz')||'[]');
let attempts=JSON.parse(localStorage.getItem('ghss_attempts')||'[]');
let books=JSON.parse(localStorage.getItem('ghss_books')||'{}');
function saveAll(){localStorage.setItem('ghss_users',JSON.stringify(users));localStorage.setItem('ghss_assign',JSON.stringify(assignments));localStorage.setItem('ghss_quiz',JSON.stringify(quizzes));localStorage.setItem('ghss_attempts',JSON.stringify(attempts));localStorage.setItem('ghss_books',JSON.stringify(books));}
const QUESTION_BANK={
  "tuple":[
    {q:"Tuple பற்றி சரியானது எது?",correct:"Tuples-ஐ மாற்ற முடியாது (Immutable)",wrong:["Tuples-ஐ மாற்ற முடியும்","Tuple என்பது loop","Tuple-ல் key இருக்கும்"]},
    {q:"Tuple-ஐ எவ்வாறு உருவாக்குவோம்?",correct:"() அடைப்புக்குறிகளை பயன்படுத்தி",wrong:["[] பயன்படுத்தி","{} பயன்படுத்தி","<> பயன்படுத்தி"]},
    {q:"Tuple என்றால் என்ன?",correct:"ஒரு வரிசையை Tuple என்பர்",wrong:["மாற்றக்கூடிய தொகுப்பு","செயல்பாட்டின் பெயர்","எண் வகை மட்டும்"]},
    {q:"Tuples-ஐ புதுப்பித்தல் முடியுமா?",correct:"முடியாது, மாற்ற முடியாதது என்பதால்",wrong:["எளிதில் மாற்றலாம்","append உண்டு","delete முடியாது"]},
    {q:"Tuple indexing?",correct:"0-வில் இருந்து தொடங்கும்",wrong:["1-ல் இருந்து","-1 ல் இருந்து","100 ல் இருந்து"]}
  ],
  "list":[
    {q:"List பற்றி சரியானது?",correct:"List மாற்றக்கூடியது (Mutable)",wrong:["List மாற்ற முடியாதது","ஒரு மதிப்பு மட்டும்","Function"]},
    {q:"List உருவாக்க?",correct:"[] சதுர அடைப்பு",wrong:["() வட்டம்","{} சுருள்","<> கோணம்"]},
    {q:"List-ல் append என்ன செய்யும்?",correct:"இறுதியில் மதிப்பை சேர்க்கும்",wrong:["முதலில் சேர்க்கும்","நீக்கும்","வரிசைப்படுத்தும்"]},
    {q:"List slicing?",correct:"[start:end] பயன்படுத்தி பிரிக்கலாம்",wrong:["() பயன்படுத்தி","{} பயன்படுத்தி","<> பயன்படுத்தி"]}
  ],
  "computer":[
    {q:"Python input()?",correct:"பயனரிடமிருந்து உள்ளீடு பெறும்",wrong:["வெளியீடு அச்சிடும்","கோப்பை மூடும்","பிழை நீக்கும்"]},
    {q:"CSV dialect?",correct:"பிரிப்பான் மற்றும் மேற்கோளை வரையறுக்கும்",wrong:["CSV மூடும்","புதிய கோப்பு","எண் மட்டும்"]},
    {q:"print()?",correct:"திரையில் அச்சிடும்",wrong:["உள்ளீடு பெறும்","நீக்கும்","படிக்கும்"]},
    {q:"Python file save?",correct:"Ctrl + S அல்லது File -> Save",wrong:["Ctrl + P","Ctrl + D","Alt + F4"]}
  ],
  "default_tamil":[
    {q:"பாட புத்தகத்தின் முக்கிய கருத்து?",correct:"அடிப்படை கருத்தை புரிந்துகொள்வது",wrong:["தொடர்பில்லாதது","தவறான விளக்கம்","எண் மட்டும்"]},
    {q:"கணினி அறிவியல் முக்கியம்?",correct:"தரவு அமைப்புகளை புரிவது",wrong:["தட்டச்சு மட்டும்","விளையாட்டு","பாடல்"]}
  ]
};
function generateTamilQuiz(topic, subject, cls, count){
  let topicLower=topic.toLowerCase().trim();let pool=[];
  Object.keys(QUESTION_BANK).forEach(key=>{if(key==="default_tamil")return;if(topicLower.includes(key)||key.includes(topicLower)||subject.toLowerCase().includes(key)){pool=pool.concat(QUESTION_BANK[key]);}});
  if(pool.length===0){pool=[].concat(QUESTION_BANK["tuple"],QUESTION_BANK["list"],QUESTION_BANK["computer"]);}
  let fullPool=pool.concat(QUESTION_BANK["default_tamil"],QUESTION_BANK["computer"]);
  let uniqueMap=new Map();fullPool.forEach(item=>{if(!uniqueMap.has(item.q))uniqueMap.set(item.q,item);});
  let uniqueList=Array.from(uniqueMap.values()).sort(()=>Math.random()-0.5);
  let finalQuestions=[];let usedQ=new Set();let idx=0;
  while(finalQuestions.length<count){
    let baseItem=uniqueList[idx%uniqueList.length];idx++;
    let questionText=baseItem.q;
    if(usedQ.has(baseItem.q) && finalQuestions.length < uniqueList.length) continue;
    if(usedQ.has(baseItem.q)){questionText=baseItem.q+` (${topic} - ${finalQuestions.length+1})`;}
    usedQ.add(baseItem.q);
    let allOptions=[baseItem.correct,...baseItem.wrong];allOptions=[...new Set(allOptions)].sort(()=>Math.random()-0.5);
    while(allOptions.length<4){allOptions.push(`கூடுதல் விருப்பம் ${allOptions.length+1}`);}
    finalQuestions.push({q:finalQuestions.length+1+". "+questionText,options:allOptions.slice(0,4),answer:baseItem.correct});
  }
  return finalQuestions.slice(0,count);
                                               }
