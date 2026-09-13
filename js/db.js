if(!localStorage.getItem("users")){localStorage.setItem("users",JSON.stringify([{id:"owner1",name:"Main Owner",username:"owner",emis:"",className:"",password:"owner123",role:"owner"}]));}
if(!localStorage.getItem("assignments"))localStorage.setItem("assignments",JSON.stringify([]));
if(!localStorage.getItem("quizzes"))localStorage.setItem("quizzes",JSON.stringify([]));
if(!localStorage.getItem("quizAttempts"))localStorage.setItem("quizAttempts",JSON.stringify([]));
function getUsers(){return JSON.parse(localStorage.getItem("users")||"[]");}
function saveUsers(d){localStorage.setItem("users",JSON.stringify(d));}
function getAssignments(){return JSON.parse(localStorage.getItem("assignments")||"[]");}
function saveAssignments(d){localStorage.setItem("assignments",JSON.stringify(d));}
function getQuizzes(){return JSON.parse(localStorage.getItem("quizzes")||"[]");}
function saveQuizzes(d){localStorage.setItem("quizzes",JSON.stringify(d));}
function getAttempts(){return JSON.parse(localStorage.getItem("quizAttempts")||"[]");}
function saveAttempts(d){localStorage.setItem("quizAttempts",JSON.stringify(d));}
