const CLASSES=["6","7","8","9","10","11th A","11th B","11th B1","11th C","12th A","12th B","12th B1","12th C"];
const SUBJECTS_JUNIOR=["Tamil","English","Maths","Science","Social Science"];
const SUBJECTS_SENIOR=["Tamil","English","Maths","Physics","Chemistry","Computer","Biology (Botany)","Biology (Zoology)"];
function getSubjects(cls){
  if(!cls || cls==="All") return [...new Set([...SUBJECTS_JUNIOR,...SUBJECTS_SENIOR])];
  if(["6","7","8","9","10"].includes(cls)) return SUBJECTS_JUNIOR;
  return SUBJECTS_SENIOR;
}
let users=JSON.parse(localStorage.getItem('ghss_users')||'null')||[
  {name:"Owner",username:"owner",emis:"OWNER001",password:"Owner@123",role:"owner",class:"All"}
];
let assignments=JSON.parse(localStorage.getItem('ghss_assign')||'[]');
let quizzes=JSON.parse(localStorage.getItem('ghss_quiz')||'[]');
let attempts=JSON.parse(localStorage.getItem('ghss_attempts')||'[]');
let books=JSON.parse(localStorage.getItem('ghss_books')||'{}'); // class_subject -> book text

function saveAll(){
  localStorage.setItem('ghss_users',JSON.stringify(users));
  localStorage.setItem('ghss_assign',JSON.stringify(assignments));
  localStorage.setItem('ghss_quiz',JSON.stringify(quizzes));
  localStorage.setItem('ghss_attempts',JSON.stringify(attempts));
  localStorage.setItem('ghss_books',JSON.stringify(books));
}

// AUTO QUIZ FROM BOOK TOPIC - vera vera topic kudutha vera vera question
function generateBookQuestions(topic, subject, count){
  let keyTopic = topic.toLowerCase();
  // Try to get book text if uploaded
  let bookText = "";
  Object.keys(books).forEach(k=>{
    if(k.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(k.toLowerCase())){
      bookText += books[k] + " ";
    }
  });
  // If no book, use topic based generation
  let baseQuestions = [];
  if(bookText){
    let sentences = bookText.split(/[.!?]/).filter(s=>s.toLowerCase().includes(keyTopic)).slice(0,count);
    if(sentences.length < count){
      sentences = sentences.concat(bookText.split(/[.!?]/).slice(0,count-sentences.length));
    }
    baseQuestions = sentences.map((s,i)=>{
      let correct = s.trim().substring(0,90);
      let options = [correct, `Not related to ${topic} - A`, `Incorrect statement about ${topic} - B`, `Wrong option about ${topic} - C`];
      options = options.sort(()=>Math.random()-0.5);
      return {q:`Q${i+1} [From Book - ${topic}]: ${s.trim().substring(0,120)}?`, options: options, answer: correct};
    });
  } else {
    for(let i=0;i<count;i++){
      let correct = `${topic} - Correct point ${i+1} from book`;
      let options = [correct, `${topic} - Wrong A`, `${topic} - Wrong B`, `${topic} - Wrong C`];
      options = options.sort(()=>Math.random()-0.5);
      baseQuestions.push({q:`Q${i+1}: What is correct about ${topic} in ${subject}?`, options: options, answer: correct});
    }
  }
  return baseQuestions;
}
