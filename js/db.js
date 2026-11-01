const CLASSES=["6","7","8","9","10","11th A","11th B","11th B1","11th C","12th A","12th B","12th B1","12th C"];
const SUBJECTS_JUNIOR=["Tamil","English","Maths","Science","Social Science"];
const SUBJECTS_SENIOR=["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"];
function getSubjects(cls){
  if(!cls || cls==="All") return [...new Set([...SUBJECTS_JUNIOR,...SUBJECTS_SENIOR])];
  if(["6","7","8","9","10"].includes(cls)) return SUBJECTS_JUNIOR;
  return SUBJECTS_SENIOR;
}
let users=JSON.parse(localStorage.getItem('ghss_users')||'null')||[{name:"Owner",username:"owner",emis:"OWNER001",password:"Owner@123",role:"owner",class:"All"}];
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
// TAMIL + ENGLISH QUIZ - 4 UNIQUE OPTIONS, ANSWER INSIDE OPTIONS, NO REPEAT QUESTION
function generateTamilQuiz(topic, subject, cls, count){
  let key = cls+"_"+subject;
  let bookText = books[key] || "";
  if(!bookText){
    // Search any book of same subject
    Object.keys(books).forEach(k=>{
      if(k.includes(subject) || subject.includes(k.split('_')[1]||'')){
        bookText += books[k] + " ";
      }
    });
  }
  let isTamil = /[\u0B80-\u0BFF]/.test(topic) || /[\u0B80-\u0BFF]/.test(bookText);
  let sentences = bookText ? bookText.split(/[.!?।|]/).map(s=>s.trim()).filter(s=>s.length>15) : [];
  let topicSentences = sentences.filter(s=>s.toLowerCase().includes(topic.toLowerCase()));
  let pool = topicSentences.length>=count ? topicSentences : (sentences.length>=count ? sentences : []);
  // Shuffle and take unique
  pool = [...new Set(pool)].sort(()=>Math.random()-0.5).slice(0,count);
  let questions=[];
  let usedQuestions=new Set();
  for(let i=0;i<count;i++){
    let srcSentence = pool[i] || (isTamil ? `${topic} பற்றிய முக்கிய கருத்து ${i+1}` : `${topic} important concept ${i+1}`);
    if(usedQuestions.has(srcSentence)) continue;
    usedQuestions.add(srcSentence);
    let correctAnswer = srcSentence.substring(0,100).trim();
    // Generate 3 different distractors - Tamil if Tamil book
    let distractors=[];
    let otherSentences = sentences.filter(s=>s!==srcSentence).sort(()=>Math.random()-0.5);
    for(let j=0;j<3;j++){
      if(otherSentences[j]){
        distractors.push(otherSentences[j].substring(0,100).trim());
      } else {
        if(isTamil){
          distractors.push(`${topic} பற்றிய தவறான கூற்று ${j+1}`);
        } else {
          distractors.push(`${topic} - incorrect statement ${j+1}`);
        }
      }
    }
    // Ensure all 4 options are different
    let allOptions = [correctAnswer, ...distractors];
    allOptions = [...new Set(allOptions)];
    while(allOptions.length<4){
      allOptions.push(isTamil ? `கூடுதல் தவறான விருப்பம் ${allOptions.length}` : `Extra wrong option ${allOptions.length}`);
    }
    allOptions = allOptions.sort(()=>Math.random()-0.5);
    let qText = isTamil ? `கேள்வி ${i+1}: "${topic}" பற்றி புத்தகத்தில் என்ன கூறப்பட்டுள்ளது?` : `Q${i+1}: What does the book say about "${topic}"? - ${srcSentence.substring(0,60)}?`;
    if(isTamil && srcSentence.length>10){
      qText = `கேள்வி ${i+1}: ${srcSentence.substring(0,120)}?`;
    }
    questions.push({q:qText, options:allOptions, answer:correctAnswer});
  }
  return questions;
}
