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

// --- TAMIL FIX - odanja eluthu serthu ---
function fixTamilText(text){
  if(!text) return "";
  // Remove English book junk
  let t = text.replace(/12th Computer Science.*?indd.*?\d+/gi,' ')
              .replace(/12 - ஆம் வகுப்பு கணினி அறிவியல்.*?\d+/g,' ')
              .replace(/\d+\s*-\s*ஆம் வகுப்பு.*?\n/g,' ');
  // Tamil letter ku naduvula space vantha remove pannu - பு த் -> புத்
  t = t.replace(/([\u0B80-\u0BFF])\s+([\u0B80-\u0BFF])/g,'$1$2');
  t = t.replace(/([\u0B80-\u0BFF])\s+([\u0B80-\u0BFF])/g,'$1$2'); // 2 times for double split
  // Multiple spaces -> single
  t = t.replace(/\s{2,}/g,' ').trim();
  return t;
}

function cleanBookSentences(text){
  if(!text) return [];
  let fixed = fixTamilText(text);
  let sentences = fixed.split(/[.!?\n]/).map(s=>s.trim()).filter(s=>{
    return s.length>15 && s.length<200 && !s.includes('>>>') && !s.toLowerCase().includes('indd');
  });
  return [...new Set(sentences)];
}

function generateTamilQuiz(topic, subject, cls, count){
  let key = cls+"_"+subject;
  let bookText = books[key] || "";
  if(!bookText){
    for(let k in books){ if(k.includes(subject)) bookText += " " + books[k]; }
  }
  if(!bookText || bookText.startsWith("BOOK_UPLOADED")){
    return [{q:`Book upload pannala da! ${key} ku book upload pannu`, options:["Book illa","Book illa","Book illa","Book illa"], answer:"Book illa"}];
  }

  let allSentences = cleanBookSentences(bookText);
  if(allSentences.length<4) allSentences = bookText.split(/[.!?]/).map(s=>fixTamilText(s.trim())).filter(s=>s.length>15);

  let topicLower = topic.toLowerCase();
  let topicSentences = allSentences.filter(s=>s.toLowerCase().includes(topicLower) || s.includes("டப்பிள்") || s.includes("வரிசை") || s.includes("பட்டியல்"));
  let pool = topicSentences.length>=2 ? topicSentences : allSentences;
  pool = [...new Set(pool)].sort(()=>Math.random()-0.5);

  let finalQuestions=[];
  let used=new Set();
  for(let i=0;i<pool.length && finalQuestions.length<count;i++){
    let correct = fixTamilText(pool[i].trim());
    if(used.has(correct) || correct.length<10) continue;
    used.add(correct);
    let others = allSentences.filter(s=>s!==pool[i]).sort(()=>Math.random()-0.5).slice(0,3).map(s=>fixTamilText(s));
    let options=[correct, ...others];
    options=[...new Set(options)];
    while(options.length<4) options.push(allSentences[Math.floor(Math.random()*allSentences.length)]);
    options=options.map(o=>fixTamilText(o)).slice(0,4).sort(()=>Math.random()-0.5);
    if(!options.includes(correct)){ options[3]=correct; options=options.sort(()=>Math.random()-0.5); }
    let qTitle = /[\u0B80-\u0BFF]/.test(topic) || /[\u0B80-\u0BFF]/.test(correct) ? `கேள்வி ${finalQuestions.length+1}: "${topic}" பற்றி புத்தகத்தில் உள்ளது எது?` : `Q${finalQuestions.length+1}: What is correct about "${topic}" from book?`;
    finalQuestions.push({q:qTitle, options:options, answer:correct});
  }
  return finalQuestions;
      }
