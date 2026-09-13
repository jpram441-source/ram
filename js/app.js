// GHSS Silattur - Main Logic
const ALL_CLASSES = ["6th","7th","8th","9th","10th","11th A","11th B","11th B1","11th C","12th A","12th B","12th B1","12th C"];
const SUBJECTS_6_10 = ["Tamil","English","Maths","Science","Social Science"];
const SUBJECTS_11_12 = ["Tamil","English","Maths","Physics","Chemistry","Computer Science","Biology (Botany)","Biology (Zoology)"];
function getSubjectsByClass(cls){if(!cls) return [...new Set([...SUBJECTS_6_10,...SUBJECTS_11_12])]; if(["6th","7th","8th","9th","10th"].includes(cls)) return SUBJECTS_6_10; return SUBJECTS_11_12;}
let currentUser = null;

function togglePassword(id){const el=document.getElementById(id); el.type = el.type==="password"? "text" : "password";}
function fillClassDropdowns(){
["new_class","ass_class","quiz_class","filterUserClass","filterAssClass","filterQuizClass"].forEach(id=>{
const el=document.getElementById(id); if(!el) return;
const isFilter=id.startsWith("filter");
el.innerHTML=(isFilter?`<option value="">All Classes</option>`:`<option value="">Select Class</option>`)+ALL_CLASSES.map(c=>`<option value="${c}">${c}</option>`).join('');
}); fillSubjectDropdowns();
}
function fillSubjectDropdowns(){
const ac=document.getElementById("ass_class")?.value||""; const qc=document.getElementById("quiz_class")?.value||"";
const as=document.getElementById("ass_subject"); if(as) as.innerHTML=`<option value="">Select Subject</option>`+getSubjectsByClass(ac).map(s=>`<option value="${s}">${s}</option>`).join('');
const qs=document.getElementById("quiz_sub"); if(qs) qs.innerHTML=`<option value="">Select Subject</option>`+getSubjectsByClass(qc).map(s=>`<option value="${s}">${s}</option>`).join('');
const all=[...new Set([...SUBJECTS_6_10,...SUBJECTS_11_12])];
const fa=document.getElementById("filterAssSubject"); if(fa) fa.innerHTML=`<option value="">All Subjects</option>`+all.map(s=>`<option value="${s}">${s}</option>`).join('');
const fq=document.getElementById("filterQuizSubject"); if(fq) fq.innerHTML=`<option value="">All Subjects</option>`+all.map(s=>`<option value="${s}">${s}</option>`).join('');
}
function login(){
const role=document.getElementById("role").value; const u=document.getElementById("username").value.trim(); const p=document.getElementById("password").value.trim();
const users=getUsers(); let f=null;
if(role==="student") f=users.find(x=>x.emis===u && x.password===p && x.role==="student");
else f=users.find(x=>x.username===u && x.password===p && x.role===role);
if(!f){document.getElementById("error").innerText="Invalid Username/EMIS or Password"; return;}
localStorage.setItem("currentUser",JSON.stringify(f)); showDashboard();
}
function showDashboard(){
currentUser=JSON.parse(localStorage.getItem("currentUser")); if(!currentUser) return;
document.getElementById("loginPage").style.display="none"; document.getElementById("dashboardPage").style.display="block";
document.getElementById("welcomeText").innerText=`Welcome ${currentUser.name} (${currentUser.role}) ${currentUser.className||''}`;
fillClassDropdowns(); const rs=document.getElementById("new_role");
if(currentUser.role==="owner"){rs.innerHTML=`<option value="owner">Owner</option><option value="teacher">Teacher</option><option value="student">Student</option>`; document.getElementById("studentSection").style.display="none";}
else if(currentUser.role==="teacher"){rs.innerHTML=`<option value="student">Student</option>`; document.getElementById("studentSection").style.display="none";}
else{document.getElementById("createSection").style.display="none"; document.getElementById("studentSection").style.display="block"; const subs=getSubjectsByClass(currentUser.className); document.getElementById("subjectFilter").innerHTML=`<option value="">Select Subject</option>`+subs.map(s=>`<option value="${s}">${s}</option>`).join('');}
document.getElementById("ass_class")?.addEventListener("change",fillSubjectDropdowns); document.getElementById("quiz_class")?.addEventListener("change",fillSubjectDropdowns);
loadUsers(); loadAssignments(); loadQuizBank(); loadHistory();
}
function createUser(){
const eid=document.getElementById("edit_user_id").value; const name=document.getElementById("new_name").value.trim(); const username=document.getElementById("new_username").value.trim(); const emis=document.getElementById("new_emis").value.trim(); const className=document.getElementById("new_class").value; const pass=document.getElementById("new_pass").value.trim(); const role=document.getElementById("new_role").value;
if(currentUser.role==="teacher" && role!=="student"){alert("Teacher can create only Student"); return;}
if(!name||!pass){alert("Name and Password required"); return;} if(role!=="student"&&!username){alert("Username required"); return;} if(role==="student"&&!emis){alert("EMIS required"); return;} if(role==="student"&&!className){alert("Class required"); return;}
let users=getUsers();
if(eid){const i=users.findIndex(u=>u.id==eid); if(i>-1) users[i]={...users[i],name,username:username||emis,emis,className,password:pass,role}; saveUsers(users); alert("User Updated");}
else{users.push({id:Date.now(),name,username:username||emis,emis,className,password:pass,role}); saveUsers(users); alert(role+" created");}
clearUserForm(); loadUsers();
}
function editUser(id){const u=getUsers().find(x=>x.id==id); if(!u) return; document.getElementById("edit_user_id").value=u.id; document.getElementById("new_name").value=u.name; document.getElementById("new_username").value=u.username; document.getElementById("new_emis").value=u.emis; document.getElementById("new_class").value=u.className||""; document.getElementById("new_pass").value=u.password; document.getElementById("new_role").value=u.role; document.getElementById("createUserBtn").innerText="Update User"; document.getElementById("cancelUserBtn").style.display="block"; window.scrollTo({top:0,behavior:'smooth'});}
function deleteUser(id){if(!confirm("Delete this user?")) return; saveUsers(getUsers().filter(u=>u.id!=id)); loadUsers();}
function clearUserForm(){document.getElementById("edit_user_id").value=""; document.getElementById("new_name").value=""; document.getElementById("new_username").value=""; document.getElementById("new_emis").value=""; document.getElementById("new_class").value=""; document.getElementById("new_pass").value=""; document.getElementById("createUserBtn").innerText="Create User"; document.getElementById("cancelUserBtn").style.display="none";}
function cancelEditUser(){clearUserForm();}
function loadUsers(){let users=getUsers(); const fc=document.getElementById("filterUserClass")?.value; const fr=document.getElementById("filterUserRole")?.value; if(currentUser.role==="teacher") users=users.filter(u=>u.role==="student"); if(fc) users=users.filter(u=>u.className===fc); if(fr) users=users.filter(u=>u.role===fr); document.getElementById("userList").innerHTML=users.map(u=>`<div class="list-item"><div><b>${u.name}</b> - ${u.role} ${u.className?'- '+u.className:''}<br><small>${u.emis?'EMIS: '+u.emis:'Username: '+u.username}</small></div><div style="display:flex;gap:6px"><span class="badge ${u.role}">${u.role}</span><button onclick="editUser('${u.id}')" style="width:auto;padding:6px 10px;background:#3b82f6">Edit</button><button onclick="deleteUser('${u.id}')" style="width:auto;padding:6px 10px;background:#ef4444">Delete</button></div></div>`).join('');}
function addAssignment(){const eid=document.getElementById("edit_ass_id").value; const t=document.getElementById("ass_title").value.trim(); const d=document.getElementById("ass_desc").value.trim(); const c=document.getElementById("ass_class").value; const s=document.getElementById("ass_subject").value; if(!t||!c||!s){alert("Title, Class, Subject required"); return;} const list=getAssignments(); if(eid){const i=list.findIndex(a=>a.id==eid); if(i>-1) list[i]={...list[i],title:t,desc:d,className:c,subject:s}; saveAssignments(list); alert("Assignment Updated");}else{list.push({id:Date.now(),title:t,desc:d,className:c,subject:s,by:currentUser.name,date:new Date().toLocaleDateString()}); saveAssignments(list); alert("Assignment Added");} clearAssForm(); loadAssignments();}
function editAssignment(id){const a=getAssignments().find(x=>x.id==id); if(!a) return; document.getElementById("edit_ass_id").value=a.id; document.getElementById("ass_title").value=a.title; document.getElementById("ass_desc").value=a.desc; document.getElementById("ass_class").value=a.className; fillSubjectDropdowns(); document.getElementById("ass_subject").value=a.subject; document.getElementById("assBtn").innerText="Update Assignment"; document.getElementById("cancelAssBtn").style.display="block";}
function deleteAssignment(id){if(!confirm("Delete assignment?")) return; saveAssignments(getAssignments().filter(a=>a.id!=id)); loadAssignments();}
function clearAssForm(){document.getElementById("edit_ass_id").value=""; document.getElementById("ass_title").value=""; document.getElementById("ass_desc").value=""; document.getElementById("ass_class").value=""; document.getElementById("ass_subject").value=""; document.getElementById("assBtn").innerText="Add Assignment"; document.getElementById("cancelAssBtn").style.display="none";}
function cancelEditAss(){clearAssForm();}
function loadAssignments(){let list=getAssignments(); const fc=document.getElementById("filterAssClass")?.value; const fs=document.getElementById("filterAssSubject")?.value; if(currentUser.role==="student"&&currentUser.className) list=list.filter(a=>a.className===currentUser.className); if(fc) list=list.filter(a=>a.className===fc); if(fs) list=list.filter(a=>a.subject===fs); document.getElementById("assList").innerHTML=list.length===0?"<p>No assignments</p>":list.map(a=>`<div class="list-item"><div><b>${a.title}</b> [${a.className} - ${a.subject}]<br><small>${a.desc}</small><br><small>By ${a.by} on ${a.date}</small></div>${currentUser.role!=="student"?`<div style="display:flex;gap:6px"><button onclick="editAssignment('${a.id}')" style="width:auto;padding:6px 10px;background:#3b82f6">Edit</button><button onclick="deleteAssignment('${a.id}')" style="width:auto;padding:6px 10px;background:#ef4444">Delete</button></div>`:''}</div>`).join('');}
function addQuiz(){const eid=document.getElementById("edit_quiz_id").value; const c=document.getElementById("quiz_class").value; const s=document.getElementById("quiz_sub").value; const q=document.getElementById("quiz_q").value.trim(); const opts=document.getElementById("quiz_opt").value.split(',').map(x=>x.trim()).filter(x=>x); const ans=document.getElementById("quiz_ans").value.trim(); if(!c||!s||!q||opts.length<2||!ans){alert("Class, Subject, Question, 2+ Options, Answer required"); return;} const list=getQuizzes(); if(eid){const i=list.findIndex(x=>x.id==eid); if(i>-1) list[i]={...list[i],className:c,subject:s,question:q,options:opts,answer:ans}; saveQuizzes(list); alert("Quiz Updated");}else{list.push({id:Date.now(),className:c,subject:s,question:q,options:opts,answer:ans}); saveQuizzes(list); alert("Quiz Added");} clearQuizForm(); loadQuizBank();}
function editQuiz(id){const q=getQuizzes().find(x=>x.id==id); if(!q) return; document.getElementById("edit_quiz_id").value=q.id; document.getElementById("quiz_class").value=q.className; fillSubjectDropdowns(); document.getElementById("quiz_sub").value=q.subject; document.getElementById("quiz_q").value=q.question; document.getElementById("quiz_opt").value=q.options.join(','); document.getElementById("quiz_ans").value=q.answer; document.getElementById("quizBtn").innerText="Update Quiz"; document.getElementById("cancelQuizBtn").style.display="block";}
function deleteQuiz(id){if(!confirm("Delete quiz?")) return; saveQuizzes(getQuizzes().filter(q=>q.id!=id)); loadQuizBank();}
function clearQuizForm(){document.getElementById("edit_quiz_id").value=""; document.getElementById("quiz_q").value=""; document.getElementById("quiz_opt").value=""; document.getElementById("quiz_ans").value=""; document.getElementById("quizBtn").innerText="Add Quiz Manually"; document.getElementById("cancelQuizBtn").style.display="none";}
function cancelEditQuiz(){clearQuizForm();}
function loadQuizBank(){let list=getQuizzes(); const fc=document.getElementById("filterQuizClass")?.value; const fs=document.getElementById("filterQuizSubject")?.value; if(fc) list=list.filter(q=>q.className===fc); if(fs) list=list.filter(q=>q.subject===fs); if(currentUser.role==="student"&&currentUser.className) list=list.filter(q=>q.className===currentUser.className); document.getElementById("quizBankList").innerHTML=list.length===0?"<p>No quiz</p>":list.map(q=>`<div class="list-item"><div><b>[${q.className} - ${q.subject}] ${q.question}</b><br><small>Options: ${q.options.join(', ')} | Ans: ${q.answer}</small></div>${currentUser.role!=="student"?`<div style="display:flex;gap:6px"><button onclick="editQuiz('${q.id}')" style="width:auto;padding:6px 10px;background:#3b82f6">Edit</button><button onclick="deleteQuiz('${q.id}')" style="width:auto;padding:6px 10px;background:#ef4444">Delete</button></div>`:''}</div>`).join('');}
function autoGenerateQuiz(){
const c=document.getElementById("quiz_class").value; const s=document.getElementById("quiz_sub").value; const topic=document.getElementById("quiz_topic").value.trim(); const cnt=parseInt(document.getElementById("quiz_count").value)||5;
if(!c||!s||!topic){alert("Class, Subject, Topic required"); return;}
const templates=[
(t,sub)=>({q:`What is the definition of ${t} in ${sub}?`,o:[`${t} definition`,`Wrong concept`,`Not related`,`None`],a:`${t} definition`}),
(t,sub)=>({q:`Which is an example of ${t}?`,o:[`Example of ${t}`,`Not example`,`Wrong`,`All wrong`],a:`Example of ${t}`}),
(t,sub)=>({q:`Why is ${t} important in ${sub}?`,o:[`Important for learning`,`Not important`,`For exam only`,`None`],a:`Important for learning`}),
(t,sub)=>({q:`${t} belongs to which topic?`,o:[`Topic of ${t}`,`Other topic`,`No topic`,`Random`],a:`Topic of ${t}`}),
(t,sub)=>({q:`What is the use of ${t}?`,o:[`Use of ${t}`,`No use`,`Wrong use`,`None`],a:`Use of ${t}`})
];
let list=getQuizzes(); for(let i=0;i<cnt;i++){const tpl=templates[i%templates.length](topic,s); list.push({id:Date.now()+i,className:c,subject:s,question:tpl.q,options:tpl.o,answer:tpl.a});}
saveQuizzes(list); alert(cnt+" Questions Auto Generated for "+topic); loadQuizBank(); document.getElementById("quiz_topic").value="";
}
function getWeekId(){const n=new Date(); return `${n.getFullYear()}-${n.getMonth()}-${Math.ceil(n.getDate()/7)}`;}
function loadQuiz(){const sub=document.getElementById("subjectFilter").value; if(!sub) return; const week=getWeekId(); const atts=getAttempts(); const already=atts.find(a=>a.emis===currentUser.emis&&a.subject===sub&&a.week===week); if(already){document.getElementById("quizArea").innerHTML=`<p class="success">Already attended ${sub} this week - Score ${already.score}/${already.total}</p>`; return;} let qs=getQuizzes().filter(q=>q.subject===sub&&q.className===currentUser.className); if(qs.length===0){document.getElementById("quizArea").innerHTML="<p>No quiz for this subject</p>"; return;} qs=qs.slice(0,5); let h=`<form>`; qs.forEach((q,i)=>{h+=`<p><b>Q${i+1}: ${q.question}</b></p>`; q.options.forEach(o=>{h+=`<label><input type="radio" name="q${q.id}" value="${o}"> ${o}</label><br>`;});}); h+=`<button type="button" onclick="submitQuiz()">Submit Quiz</button></form>`; document.getElementById("quizArea").innerHTML=h;}
function submitQuiz(){const sub=document.getElementById("subjectFilter").value; let qs=getQuizzes().filter(q=>q.subject===sub&&q.className===currentUser.className).slice(0,5); let score=0; qs.forEach(q=>{const sel=document.querySelector(`input[name="q${q.id}"]:checked`); if(sel&&sel.value.trim().toLowerCase()===q.answer.trim().toLowerCase()) score++;}); const atts=getAttempts(); atts.push({emis:currentUser.emis,className:currentUser.className,subject:sub,week:getWeekId(),score,total:qs.length,date:new Date().toISOString()}); saveAttempts(atts); document.getElementById("quizResult").innerHTML=`<h3>Your Score: ${score}/${qs.length}</h3>`; document.getElementById("quizArea").innerHTML=""; loadHistory();}
function loadHistory(){if(!currentUser||currentUser.role!=="student") return; const atts=getAttempts().filter(a=>a.emis===currentUser.emis); document.getElementById("quizHistory").innerHTML=atts.map(a=>`<p>${a.className} - ${a.subject} - Week ${a.week} - Score ${a.score}/${a.total}</p>`).join('');}
function logout(){localStorage.removeItem("currentUser"); location.reload();}
if(localStorage.getItem("currentUser")) showDashboard();
