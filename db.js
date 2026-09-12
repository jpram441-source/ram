// Database using localStorage for GitHub Pages compatibility
if(!localStorage.getItem("users")){
  const defaultUsers = [
    { id: "owner1", name: "Main Owner", username: "owner", emis: "", password: "owner123", role: "owner" }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}
if(!localStorage.getItem("assignments")) localStorage.setItem("assignments", JSON.stringify([]));
if(!localStorage.getItem("quizzes")) localStorage.setItem("quizzes", JSON.stringify([]));
if(!localStorage.getItem("quizAttempts")) localStorage.setItem("quizAttempts", JSON.stringify([]));

function getUsers(){ return JSON.parse(localStorage.getItem("users") || "[]"); }
function saveUsers(data){ localStorage.setItem("users", JSON.stringify(data)); }
function getAssignments(){ return JSON.parse(localStorage.getItem("assignments") || "[]"); }
function saveAssignments(data){ localStorage.setItem("assignments", JSON.stringify(data)); }
function getQuizzes(){ return JSON.parse(localStorage.getItem("quizzes") || "[]"); }
function saveQuizzes(data){ localStorage.setItem("quizzes", JSON.stringify(data)); }
function getAttempts(){ return JSON.parse(localStorage.getItem("quizAttempts") || "[]"); }
function saveAttempts(data){ localStorage.setItem("quizAttempts", JSON.stringify(data)); }
