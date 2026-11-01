const CLASSES=["6","7","8","9","10","11th A","11th B","11th B1","11th C","12th A","12th B","12th B1","12th C"];
const SUBJECTS_JUNIOR=["Tamil","English","Maths","Science","Social Science"];
const SUBJECTS_SENIOR=["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"];
function getSubjects(cls){
  if(!cls || cls==="All") return [...new Set([...SUBJECTS_JUNIOR,...SUBJECTS_SENIOR])];
  if(["6","7","8","9","10"].includes(cls)) return SUBJECTS_JUNIOR;
  return SUBJECTS_SENIOR;
}
let users=JSON.parse(localStorage.getItem('ghss_users')||'null')||[{name:"Main Owner",username:"owner",emis:"OWNER001",password:"Owner@123",role:"owner",class:"All"}];
let assignments=JSON.parse(localStorage.getItem('ghss_assign')||'[]');
let quizzes=JSON.parse(localStorage.getItem('ghss_quiz')||'[]');
let attempts=JSON.parse(localStorage.getItem('ghss_attempts')||'[]');
let books=JSON.parse(localStorage.getItem('ghss_books')||'{}');
function saveAll(){
  localStorage.setItem('ghss_users',JSON.stringify(users));
  localStorage.setItem('ghss_assign',JSON.stringify(assignments));
  localStorage.setItem('ghss_quiz',JSON.stringify(quizzes));
  localStorage.setItem('ghss_attempts',JSON.stringify(attempts));
  localStorage.setItem('ghss_books',JSON.stringify(books));
}

// --- NEW CLEAN TAMIL QUIZ GENERATOR ---
// PDF encoding odaindhaalum clean Tamil varum
function generateTamilQuiz(topic, subject, cls, count){
  let bookKey = cls+"_"+subject;
  let hasBook = books[bookKey] || Object.keys(books).some(k=>k.includes(subject));
  let isTamil = /[\u0B80-\u0BFF]/.test(topic) || hasBook;

  // Clean Tamil Question Bank based on Topic - TN Book 12th CS
  const tamilBank = {
    "tuple": [
      {q:"Tuple என்றால் என்ன?", correct:"ஒரு வரிசையை tuple என்று அழைக்கப்படுகிறது", wrong:["மாற்றக்கூடிய தரவு அமைப்பு","tuple என்பது செயல்பாடு","tuple என்பது loop"]},
      {q:"Tuple பண்பு என்ன?", correct:"Tuple மாற்ற முடியாதது (Immutable)", wrong:["Tuple மாற்றக்கூடியது","Tuple key இருக்கும்","Tuple வெறும் எண்களை மட்டும் கொண்டது"]},
      {q:"Tuple எவ்வாறு உருவாக்குவோம்?", correct:"() அடைப்புக்குறிகளை பயன்படுத்தி", wrong:["[] பயன்படுத்தி","{} பயன்படுத்தி","<> பயன்படுத்தி"]}
    ],
    "list": [
      {q:"பட்டியல் (List) என்றால் என்ன?", correct:"பல மதிப்புகளை சேமிக்கும் மாறக்கூடிய தொகுப்பு", wrong:["ஒரு மதிப்பை மட்டும் சேமிக்கும்","மாற்ற முடியாத தொகுப்பு","செயல்பாட்டின் பெயர்"]},
    ],
    "string": [
      {q:"சரம் (String) என்றால் என்ன?", correct:"எழுத்துக்களின் தொகுப்பு", wrong:["எண்களின் தொகுப்பு மட்டும்","பூலியன் மதிப்பு","சரம் என்பது எண் வகை"]}
    ],
    "python": [
      {q:"பைத்தானில் print() செயல்பாடு என்ன செய்யும்?", correct:"திரையில் வெளியீட்டை அச்சிடும்", wrong:["உள்ளீடு பெறும்","கோப்பை மூடும்","பிழையை நீக்கும்"]}
    ]
  };

  let topicLower = topic.toLowerCase();
  let pool = [];
  // Find matching bank
  Object.keys(tamilBank).forEach(k=>{
    if(topicLower.includes(k) || k.includes(topicLower)){
      pool = pool.concat(tamilBank[k]);
    }
  });
  // If no specific bank, create generic clean Tamil questions
  if(pool.length===0){
    for(let i=0;i<count+5;i++){
      if(isTamil){
        pool.push({
          q:`${topic} பற்றி கீழ்க்கண்டவற்றில் சரியான கூற்று எது?`,
          correct:`${topic} என்பது பாடத்தின் முக்கிய கருத்தாகும்`,
          wrong:[`${topic} என்பது பாடத்துடன் தொடர்பில்லாதது`,`${topic} என்பது தவறான விளக்கம்`,`${topic} என்பது கணக்கு மட்டுமே`]
        });
      } else {
        pool.push({
          q:`What is correct about ${topic}?`,
          correct:`${topic} is an important concept from the book`,
          wrong:[`${topic} is not related to chapter`,`${topic} is wrong concept`,`${topic} is only a number`]
        });
      }
    }
  }

  // Shuffle and take unique, 4 options each
  pool = pool.sort(()=>Math.random()-0.5);
  let finalQuestions=[];
  let usedSet=new Set();
  for(let item of pool){
    if(finalQuestions.length>=count) break;
    if(usedSet.has(item.q)) continue;
    usedSet.add(item.q);
    let allOptions=[item.correct, ...item.wrong];
    allOptions=[...new Set(allOptions)].sort(()=>Math.random()-0.5);
    finalQuestions.push({q:item.q, options:allOptions, answer:item.correct});
  }
  return finalQuestions;
}
