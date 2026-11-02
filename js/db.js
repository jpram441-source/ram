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

// CLEAN Tamil text - remove junk like "12th Computer Science_TM Chapter 5.indd"
function cleanBookSentences(text){
  if(!text) return [];
  let t = text.replace(/12th Computer Science.*?\d+/g,' ')
              .replace(/\d+\s*-\s*ஆம் வகுப்பு கணினி அறிவியல்.*?\d+/g,' ')
              .replace(/\s+/g,' ');
  // Split by Tamil and English sentence endings
  let sentences = t.split(/[.?!।\n]/).map(s=>s.trim()).filter(s=>{
    return s.length>20 && s.length<250 && !s.includes('>>') && !s.includes('indd') && !s.match(/^\d+$/);
  });
  // Unique
  return [...new Set(sentences)];
}

function generateTamilQuiz(topic, subject, cls, count){
  let key = cls+"_"+subject;
  let bookText = books[key] || "";
  
  // If no book for this exact class, search any book with same subject
  if(!bookText){
    for(let k in books){
      if(k.includes(subject) || subject.includes(k.split('_')[1]||'')){
        bookText += " " + books[k];
      }
    }
  }

  if(!bookText || bookText.startsWith("BOOK_UPLOADED")){
    alert("Book upload pannala da! "+key+" ku book upload pannu, aprom tha book la irunthu question varum");
    return [];
  }

  let allSentences = cleanBookSentences(bookText);
  if(allSentences.length < 5){
    alert("Book la text romba kammi da, vera PDF upload pannu");
    return [];
  }

  let topicLower = topic.toLowerCase();
  // Topic containing sentences - book la irunthu
  let topicSentences = allSentences.filter(s=>s.toLowerCase().includes(topicLower));
  if(topicSentences.length===0){
    // If topic not found, search partial word - e.g., tuple ku "டப்பிள்" or "வரிசை"
    topicSentences = allSentences.filter(s=> s.includes("டப்பிள்") || s.includes("வரிசை") || s.toLowerCase().includes("tuple") );
  }
  // If still none, use all
  let pool = topicSentences.length>=count ? topicSentences : allSentences;
  
  // Shuffle and unique
  pool = [...new Set(pool)].sort(()=>Math.random()-0.5);
  
  let finalQuestions = [];
  let usedSentences = new Set();
  
  for(let i=0; i<pool.length && finalQuestions.length < count; i++){
    let correctSentence = pool[i].trim();
    if(usedSentences.has(correctSentence) || correctSentence.length<15) continue;
    usedSentences.add(correctSentence);
    
    // Generate 3 distractors from OTHER sentences in SAME BOOK - vera vera option
    let otherSentences = allSentences.filter(s=>s!==correctSentence).sort(()=>Math.random()-0.5).slice(0,3);
    // Ensure all options different
    let options = [correctSentence, ...otherSentences];
    options = [...new Set(options)];
    while(options.length<4){
      options.push(allSentences[Math.floor(Math.random()*allSentences.length)]);
      options=[...new Set(options)];
    }
    options = options.sort(()=>Math.random()-0.5).slice(0,4);
    
    // If correct not in options due to slice, add it
    if(!options.includes(correctSentence)){
      options[3]=correctSentence;
      options=options.sort(()=>Math.random()-0.5);
    }
    
    let qText = "";
    if(/[\u0B80-\u0BFF]/.test(topic) || /[\u0B80-\u0BFF]/.test(correctSentence)){
      qText = `கேள்வி ${finalQuestions.length+1}: "${topic}" பற்றி புத்தகத்தில் உள்ள சரியான கூற்று எது?`;
    } else {
      qText = `Q${finalQuestions.length+1}: From book, what is correct about "${topic}"?`;
    }
    
    finalQuestions.push({
      q: qText + `\n(${correctSentence.substring(0,60)}...)`,
      options: options,
      answer: correctSentence
    });
  }
  
  return finalQuestions;
}
