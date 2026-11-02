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

// --- FINAL TAMIL FIX - ODAINJA ELUTHU SERTHU ---
function fixTamilBroken(text){
  if(!text) return "";
  let t = text;
  // Remove book header junk
  t = t.replace(/12th Computer Science.*?indd.*?\d+/gi,' ');
  t = t.replace(/12 - ஆம் வகுப்பு.*?\d+/g,' ');
  t = t.replace(/XII Std.*?\n/g,' ');
  // MAIN FIX: Tamil letter ku naduvula space vantha remove - loop panni fulla serthu
  // பு துப்பித ஃல் -> புதுப்பித்தல்
  let prev="";
  let count=0;
  while(prev!==t && count<10){
    prev=t;
    t=t.replace(/([\u0B80-\u0BFF])\s+([\u0B80-\u0BFF])/g,'$1$2');
    count++;
  }
  // Pulli, vowel signs ku mun space remove
  t=t.replace(/([\u0B80-\u0BFF])\s+([்ாிீுூெேைொோௌ])/g,'$1$2');
  t=t.replace(/\s{2,}/g,' ').trim();
  return t;
}

function cleanBookSentences(text){
  let fixed = fixTamilBroken(text);
  let sentences = fixed.split(/[.!?\n]+/).map(s=>s.trim()).filter(s=>s.length>20 && s.length<250 && !s.toLowerCase().includes('indd'));
  return [...new Set(sentences)];
}

function generateTamilQuiz(topic, subject, cls, count){
  let key=cls+"_"+subject;
  let bookText=books[key] || "";
  if(!bookText){
    // Search any subject book
    for(let k in books){ if(k.includes(subject) || k.split('_')[1]===subject) bookText+=" "+books[k]; }
  }
  if(!bookText){
    alert("Book illa da! "+key+" ku book upload pannu first");
    return [];
  }
  let allSentences=cleanBookSentences(bookText);
  if(allSentences.length<10){
    // Fallback if still less, use raw split
    allSentences=bookText.split(/[.!?\n]/).map(s=>fixTamilBroken(s.trim())).filter(s=>s.length>15);
    allSentences=[...new Set(allSentences)];
  }

  // Topic related - but if not found, use all (so same question repeat agathu)
  let topicLower=topic.toLowerCase();
  let topicSentences=allSentences.filter(s=>s.toLowerCase().includes(topicLower));
  let pool=topicSentences.length>=count ? topicSentences : allSentences;

  // Shuffle well
  pool=[...new Set(pool)].sort(()=>Math.random()-0.5);

  let finalQuestions=[];
  let used=new Set();
  let index=0;
  let tries=0;

  while(finalQuestions.length<count && tries<100){
    tries++;
    if(index>=pool.length) index=0;
    let raw=pool[index++];
    let correct=fixTamilBroken(raw.trim());
    if(!correct || used.has(correct) || correct.length<15) continue;
    used.add(correct);

    // 3 different sentences from same book as distractors - book la irunthu tha!
    let others=allSentences.filter(s=>fixTamilBroken(s)!==correct).sort(()=>Math.random()-0.5).slice(0,3).map(s=>fixTamilBroken(s));
    let options=[correct, ...others];
    options=[...new Set(options)];
    // Fill if less than 4
    let j=0;
    while(options.length<4 && j<allSentences.length){
      let cand=fixTamilBroken(allSentences[j++]);
      if(!options.includes(cand)) options.push(cand);
    }
    options=options.slice(0,4).sort(()=>Math.random()-0.5);
    if(!options.includes(correct)){ options[3]=correct; options=options.sort(()=>Math.random()-0.5); }

    let isTamil=/[\u0B80-\u0BFF]/.test(topic) || /[\u0B80-\u0BFF]/.test(correct);
    let qTitle=isTamil ? `கேள்வி ${finalQuestions.length+1}: "${topic}" பற்றி புத்தகத்தில் உள்ள சரியான கூற்று எது?` : `Q${finalQuestions.length+1}: From book, what is correct about "${topic}"?`;

    finalQuestions.push({q:qTitle, options:options, answer:correct});
  }
  return finalQuestions;
}
