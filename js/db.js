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

// --- 100% CLEAN TAMIL QUESTION BANK - PDF ah thodave koodathu ---
const QUESTION_BANK = {
  "tuple": [
    {q:"Tuple பற்றி கீழ்க்கண்டவற்றில் சரியானது எது?", correct:"Tuples-ஐ மாற்ற முடியாது (Immutable)", wrong:["Tuples-ஐ மாற்ற முடியும்","Tuple என்பது loop ஆகும்","Tuple-ல் key இருக்கும்"]},
    {q:"Tuple-ஐ எவ்வாறு உருவாக்குவோம்?", correct:"() அடைப்புக்குறிகளை பயன்படுத்தி", wrong:["[] பயன்படுத்தி","{} பயன்படுத்தி","<> பயன்படுத்தி"]},
    {q:"Tuple என்றால் என்ன?", correct:"ஒரு வரிசையை Tuple என்று அழைக்கப்படுகிறது", wrong:["மாற்றக்கூடிய தொகுப்பு","செயல்பாட்டின் பெயர்","எண் வகை மட்டும்"]},
    {q:"4 Tuples-ஐ புதுப்பித்தல் மற்றும் நீக்குதல்?", correct:"Tuples-ஐ மாற்ற முடியாது என முன்பே அறிவோம்", wrong:["Tuples-ஐ எளிதில் மாற்றலாம்","Tuples-க்கு append உண்டு","Tuples-ஐ delete செய்ய முடியாது"]},
  ],
  "list": [
    {q:"List பற்றி சரியானது எது?", correct:"List மாற்றக்கூடியது (Mutable)", wrong:["List மாற்ற முடியாதது","List-ல் ஒரு மதிப்பு மட்டும்","List என்பது function"]},
    {q:"List-ஐ உருவாக்குவது?", correct:"[] சதுர அடைப்புக்குறி", wrong:["() வட்ட அடைப்பு","{} சுருள் அடைப்பு","<> கோண அடைப்பு"]},
  ],
  "computer": [
    {q:"Python-ல் input() என்ன செய்யும்?", correct:"பயனரிடமிருந்து உள்ளீடு பெறும்", wrong:["வெளியீடு அச்சிடும்","கோப்பை மூடும்","பிழையை நீக்கும்"]},
    {q:"CSV கோப்பில் dialect என்றால் என்ன?", correct:"பிரிப்பான் மற்றும் மேற்கோள் குறியை வரையறுக்கும்", wrong:["CSV-ஐ மூடும் கட்டளை","புதிய கோப்பு உருவாக்கும்","எண்களை மட்டும் சேமிக்கும்"]},
    {q:"print() செயல்பாடு?", correct:"திரையில் வெளியீட்டை அச்சிடும்", wrong:["உள்ளீடு பெறும்","கோப்பை நீக்கும்","வரியை மட்டும் படிக்கும்"]},
  ],
  "default_tamil": [
    {q:"பாட புத்தகத்தின் முக்கிய கருத்து எது?", correct:"பாடத்தின் அடிப்படை கருத்தை புரிந்துகொள்வது", wrong:["பாடத்துடன் தொடர்பில்லாதது","தவறான விளக்கம்","எண் மட்டுமே"]},
    {q:"கணினி அறிவியல் பாடத்தில் முக்கியம்?", correct:"தரவு அமைப்புகளை புரிந்துகொள்வது", wrong:["வெறும் தட்டச்சு மட்டும்","விளையாட்டு மட்டும்","பாடல் கேட்பது"]},
  ]
};

function generateTamilQuiz(topic, subject, cls, count){
  let topicLower = topic.toLowerCase().trim();
  let pool = [];
  
  // Find relevant questions from bank
  Object.keys(QUESTION_BANK).forEach(key=>{
    if(key==="default_tamil") return;
    if(topicLower.includes(key) || key.includes(topicLower) || subject.toLowerCase().includes(key)){
      pool = pool.concat(QUESTION_BANK[key]);
    }
  });
  
  // If no match, use default + computer bank
  if(pool.length < count){
    pool = pool.concat(QUESTION_BANK["computer"], QUESTION_BANK["default_tamil"]);
  }
  
  // Unique shuffle, no repeat question
  pool = [...new Map(pool.map(item=>[item.q, item])).values()];
  pool = pool.sort(()=>Math.random()-0.5).slice(0, count);
  
  let finalQuestions = pool.map(item=>{
    let allOptions = [item.correct, ...item.wrong];
    allOptions = [...new Set(allOptions)].sort(()=>Math.random()-0.5);
    return {q:item.q, options:allOptions, answer:item.correct};
  });
  
  // Ensure count
  while(finalQuestions.length < count){
    let extra = QUESTION_BANK["default_tamil"][finalQuestions.length % QUESTION_BANK["default_tamil"].length];
    let allOptions = [extra.correct, ...extra.wrong].sort(()=>Math.random()-0.5);
    finalQuestions.push({q:extra.q + ` (${topic})`, options:allOptions, answer:extra.correct});
  }
  
  return finalQuestions.slice(0, count);
}
