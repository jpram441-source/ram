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

let users = JSON.parse(localStorage.getItem('ghss_users')) || [
  {name:"Main Owner", username:"owner", emis:"1001", password:"owner123", role:"owner", class:"All"}
];
let assignments = JSON.parse(localStorage.getItem('ghss_assign')) || [];
let quizzes = JSON.parse(localStorage.getItem('ghss_quiz')) || [];

function saveDB(){
  localStorage.setItem('ghss_users', JSON.stringify(users));
  localStorage.setItem('ghss_assign', JSON.stringify(assignments));
  localStorage.setItem('ghss_quiz', JSON.stringify(quizzes));
}
function getUsers(){ return users; }
