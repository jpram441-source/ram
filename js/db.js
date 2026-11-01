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
function cleanText(s){
  return s.replace(/>>>\s*str1.*?\n/g,'').replace(/>>>\s*print.*?\n/g,'').replace(/\s+/g,' ').trim();
}
function generateTamilQuiz(topic, subject, cls, count){
  let key = cls+"_"+subject;
  let bookText = books[key] || "";
  if(!bookText){
    Object.keys(books).forEach(k=>{ if(k.includes(subject)) bookText+=books[k]+" "; });
  }
  let isTamil = /[\u0B80-\u0BFF]/.test(topic) || /[\u0B80-\u0BFF]/.test(bookText);
  // Clean book text - remove >>> code junk
  bookText = bookText.replace(/>>>\s*str1="How are you".*?print.*?/g,' ').replace(/1\s*12th Computer Science.*?Chapter.*?\d+/g,' ');
  let sentences = bookText.split(/[.!?।\n]/).map(s=>s.trim()).filter(s=>s.length>20 && !s.includes('>>>') && !s.includes('print (str1'));
  let topicSentences = sentences.filter(s=>s.toLowerCase().includes(topic.toLowerCase()));
  let pool = topicSentences.length>=count ? topicSentences : sentences;
  pool = [...new Set(pool)].sort(()=>Math.random()-0.5).slice(0,count*2);
  let questions=[];
  let used=new Set();
  for(let i=0;i<count && pool.length>0;i++){
    let src = pool[i % pool.length];
    if(!src || used.has(src)) continue;
    used.add(src);
    let correct = cleanText(src).substring(0,120);
    if(correct.length<10) continue;
    let others = sentences.filter(s=>s!==src).sort(()=>Math.random()-0.5).slice(0,3).map(s=>cleanText(s).substring(0,120));
    while(others.length<3){
      others.push(isTamil ? `தவறான விருப்பம் ${others.length+1}` : `Wrong option ${others.length+1}`);
    }
    let all = [correct, ...others];
    all=[...new Set(all)];
    while(all.length<4) all.push(isTamil ? `கூடுதல் விருப்பம் ${all.length}` : `Extra ${all.length}`);
    all=all.sort(()=>Math.random()-0.5);
    let qText = isTamil ? `கேள்வி ${i+1}: ${correct.substring(0,80)}?` : `Q${i+1}: ${topic} - ${correct.substring(0,80)}?`;
    // If topic itself is Tamil, keep Tamil question
    if(isTamil && topic.length>2){
      qText = `கேள்வி ${i+1}: ${topic} பற்றி கீழ்க்கண்டவற்றில் சரியானது எது?`;
    }
    questions.push({q:qText, options:all, answer:correct});
  }
  // Fallback if no good sentences
  if(questions.length===0){
    for(let i=0;i<count;i++){
      let correct = isTamil ? `${topic} பற்றிய சரியான விளக்கம் ${i+1}` : `${topic} correct explanation ${i+1}`;
      let opts=[correct, isTamil?`${topic} தவறானது A`: `${topic} wrong A`, isTamil?`${topic} தவறானது B`: `${topic} wrong B`, isTamil?`${topic} தவறானது C`: `${topic} wrong C`].sort(()=>Math.random()-0.5);
      questions.push({q:isTamil?`கேள்வி ${i+1}: ${topic} பற்றி சரியானது?`:`Q${i+1}: ${topic}?`, options:opts, answer:correct});
    }
  }
  return questions;
}
