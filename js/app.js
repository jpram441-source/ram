let currentUser = JSON.parse(localStorage.getItem('ghss_current'));
let tempQuiz = [];

window.onload = function(){
  initDropdowns();
  if(currentUser) showDashboard();
}

function initDropdowns(){
  let classOpts = CLASSES.map(c=>`<option value="${c}">${c}</option>`).join('');
  if(document.getElementById('u_class')) document.getElementById('u_class').innerHTML = classOpts;
  if(document.getElementById('a_class')) document.getElementById('a_class').innerHTML = '<option value="">Select Class</option>'+classOpts+'<option value="All">All</option>';
  if(document.getElementById('q_class')) document.getElementById('q_class').innerHTML = '<option value="">Select Class</option>'+classOpts;
  updateSubjects('a_class','a_subject');
  updateSubjects('q_class','q_subject');
  if(document.getElementById('a_class')) document.getElementById('a_class').addEventListener('change',()=>updateSubjects('a_class','a_subject'));
  if(document.getElementById('q_class')) document.getElementById('q_class').addEventListener('change',()=>updateSubjects('q_class','q_subject'));
  updateRoleOptions();
}

function updateRoleOptions(){
  const roleEl = document.getElementById('u_role');
  if(!roleEl) return;
  if(!currentUser || currentUser.role==='owner'){
    roleEl.innerHTML = '<option value="">Select Role</option><option value="owner">Owner</option><option value="teacher">Teacher</option><option value="student">Student</option>';
  } else if(currentUser.role==='teacher'){
    roleEl.innerHTML = '<option value="student">Student</option>';
  }
}

function updateSubjects(classId, subjectId){
  let classEl = document.getElementById(classId);
  let subEl = document.getElementById(subjectId);
  if(!classEl ||!subEl) return;
  let cls = classEl.value;
  let subs = getSubjects(cls);
  subEl.innerHTML = subs.map(s=>`<option value="${s}">${s}</option>`).join('');
}

function toggleLoginPass(){
  let el = document.getElementById('upass');
  el.type = el.type==='password'?'text':'password';
}

function login(){
  let u = document.getElementById('uid').value.trim();
  let p = document.getElementById('upass').value.trim();
  let found = users.find(x=> (x.username===u || x.emis===u) && x.password===p);
  if(found){
    localStorage.setItem('ghss_current', JSON.stringify(found));
    location.reload();
  } else {
    document.getElementById('err').innerText = 'Invalid ID / EMIS / Password';
  }
}
function logout(){ localStorage.removeItem('ghss_current'); location.reload(); }

function showDashboard(){
  document.getElementById('loginPage').style.display='none';
  document.getElementById('dashboard').style.display='block';
  document.getElementById('myName').innerText = currentUser.name;
  document.getElementById('myRole').innerText = currentUser.role;
  document.getElementById('myRole').className = 'badge '+currentUser.role;
  document.getElementById('myClassInfo').innerText = currentUser.class + ' | EMIS: '+currentUser.emis;
  updateRoleOptions();

  if(currentUser.role==='student'){
    document.getElementById('userCreatePanel').style.display='none';
    document.getElementById('assignCreatePanel').style.display='none';
    document.getElementById('quizCreatePanel').style.display='none';
    document.getElementById('userListPanel').style.display='none';
    document.getElementById('assignListPanel').style.display='none';
    document.getElementById('quizListPanel').style.display='none';
    document.getElementById('studentView').style.display='block';
    document.getElementById('sClass').innerText = currentUser.class;
    renderStudent();
  } else {
    renderUsers(); renderAssignments(); renderQuizList();
  }
}

// CREATE / UPDATE USER - SUBMIT BUTTON
function createUser(){
  let idx = document.getElementById('editIndex').value;
  let name = document.getElementById('u_name').value.trim();
  let username = document.getElementById('u_username').value.trim();
  let emis = document.getElementById('u_emis').value.trim();
  let pass = document.getElementById('u_pass').value.trim();
  let role = document.getElementById('u_role').value;
  let cls = document.getElementById('u_class').value;
  if(!name ||!username ||!pass ||!role) return alert('Fill all fields');
  if(currentUser.role==='teacher' && role!=='student') return alert('Teacher can create only Student');

  if(idx!==''){
    users[idx] = {name, username, emis, password:pass, role, class:cls};
  } else {
    if(users.find(u=>u.username===username)) return alert('Username already exists');
    users.push({name, username, emis, password:pass, role, class:cls});
  }
  saveDB(); cancelEdit(); renderUsers(); alert('Saved Successfully');
}

function editUser(i){
  let u = users[i];
  if(currentUser.role==='teacher' && u.role!=='student') return alert('Not allowed');
  document.getElementById('editIndex').value = i;
  document.getElementById('u_name').value = u.name;
  document.getElementById('u_username').value = u.username;
  document.getElementById('u_emis').value = u.emis;
  document.getElementById('u_pass').value = u.password;
  document.getElementById('u_role').value = u.role;
  document.getElementById('u_class').value = u.class;
  document.getElementById('formTitle').innerText = 'Edit User - '+u.name;
  document.getElementById('submitBtn').innerText = 'Submit';
  document.getElementById('cancelBtn').style.display='block';
  window.scrollTo(0,0);
}
function cancelEdit(){
  document.getElementById('editIndex').value='';
  document.getElementById('u_name').value=''; document.getElementById('u_username').value='';
  document.getElementById('u_emis').value=''; document.getElementById('u_pass').value='';
  document.getElementById('formTitle').innerText='Create User';
  document.getElementById('submitBtn').innerText='Submit';
  document.getElementById('cancelBtn').style.display='none';
}
function deleteUser(i){
  if(users[i].username==='owner' && users.filter(u=>u.role==='owner').length===1) return alert('Cannot delete last owner');
  if(confirm('Delete '+users[i].name+'?')){ users.splice(i,1); saveDB(); renderUsers(); }
}
function renderUsers(){
  let html='<tr><th>Name</th><th>Role</th><th>Class</th><th>ID/EMIS</th><th>Action</th></tr>';
  users.forEach((u,i)=>{
    if(currentUser.role==='teacher' && u.role!=='student') return;
    html+=`<tr><td>${u.name}<br><small>${u.emis}</small></td><td><span class="badge ${u.role}">${u.role}</span></td><td>${u.class}</td><td>${u.username}</td><td><button onclick="editUser(${i})" style="padding:4px 8px;background:#3b82f6;color:#fff;border:none;border-radius:6px;margin:2px;">Edit</button><button onclick="deleteUser(${i})" style="padding:4px 8px;background:#ef4444;color:#fff;border:none;border-radius:6px;margin:2px;">Delete</button></td></tr>`;
  });
  document.getElementById('userTable').innerHTML=html;
}

// ASSIGNMENTS
function postAssignment(){
  let cls=document.getElementById('a_class').value, sub=document.getElementById('a_subject').value, title=document.getElementById('a_title').value, date=document.getElementById('a_date').value;
  let idx=document.getElementById('a_editIndex').value;
  if(!cls||!title) return alert('Fill details');
  let obj={class:cls, subject:sub, title, date: date || new Date().toLocaleDateString(), by: currentUser.name};
  if(idx!=='') assignments[idx]=obj; else assignments.push(obj);
  saveDB(); cancelAssignEdit(); renderAssignments();
}
function editAssign(i){
  let a=assignments[i];
  document.getElementById('a_class').value=a.class; updateSubjects('a_class','a_subject');
  document.getElementById('a_subject').value=a.subject; document.getElementById('a_title').value=a.title; document.getElementById('a_editIndex').value=i;
  document.getElementById('a_cancelBtn').style.display='block';
}
function cancelAssignEdit(){ document.getElementById('a_editIndex').value=''; document.getElementById('a_title').value=''; document.getElementById('a_cancelBtn').style.display='none'; }
function deleteAssign(i){ if(confirm('Delete assignment?')){ assignments.splice(i,1); saveDB(); renderAssignments(); } }
function renderAssignments(){
  document.getElementById('assignList').innerHTML = assignments.map((a,i)=>`<div class="quiz-q"><b>${a.class} - ${a.subject}</b>: ${a.title}<br><small>${a.by} | ${a.date}</small><br><button onclick="editAssign(${i})" style="margin-top:6px;padding:4px 8px;background:#3b82f6;color:#fff;border:none;border-radius:6px;">Edit</button><button onclick="deleteAssign(${i})" style="margin-top:6px;margin-left:4px;padding:4px 8px;background:#ef4444;color:#fff;border:none;border-radius:6px;">Delete</button></div>`).join('') || 'No assignments';
}

// QUIZ AUTO GENERATE - FIXED PRO VERSION
function generateQuiz(){
  let cls=document.getElementById('q_class').value;
  let sub=document.getElementById('q_subject').value;
  let topic=document.getElementById('q_topic').value.trim();
  let count=parseInt(document.getElementById('q_count').value)||5;
  if(!cls||!topic) return alert('Enter class and topic');

  tempQuiz = [];
  let topicLower = topic.toLowerCase();

  let questionTemplates = [];

  if(topicLower.includes('python')){
    questionTemplates = [
      {q:`What is Python in ${sub}?`, opts:[`A high-level programming language`,`A snake species`,`A computer hardware`,`An operating system`], ans:0},
      {q:`Which is correct way to print in Python?`, opts:[`print("Hello")`,`echo "Hello"`,`console.log("Hello")`,`printf("Hello")`], ans:0},
      {q:`What is the extension of Python file?`, opts:[`.py`,`.java`,`.html`,`.css`], ans:0},
      {q:`Which keyword is used to define function in Python?`, opts:[`def`,`function`,`func`,`define`], ans:0},
      {q:`What is Python used for?`, opts:[`Web Development, AI, Data Science`,`Only gaming`,`Only hardware`,`Only networking`], ans:0},
      {q:`Which is a Python data type?`, opts:[`List`,`Table`,`Chair`,`Book`], ans:0}
    ];
  } else {
    questionTemplates = [
      {q:`What is the main definition of "${topic}"?`, opts:[`Core concept of ${topic} in ${sub}`,`Opposite of ${topic}`,`Unrelated to ${sub}`,`History of computers`], ans:0},
      {q:`Which is the best example of "${topic}"?`, opts:[`Practical example of ${topic}`,`Random object`,`Wrong example`,`None of these`], ans:0},
      {q:`Why is "${topic}" important in ${sub}?`, opts:[`It helps in understanding ${sub} concepts`,`It has no use`,`It is outdated`,`It is only for exams`], ans:0},
      {q:`Which statement is TRUE about "${topic}"?`, opts:[`${topic} is fundamental in ${sub}`,`${topic} is not used anymore`,`${topic} is a myth`,`${topic} is hardware only`], ans:0},
      {q:`Application of "${topic}" is:`, opts:[`Used in real-world ${sub} applications`,`Used only in games`,`Never used`,`Used only for drawing`], ans:0},
      {q:`Who introduced / discovered "${topic}"?`, opts:[`Experts in ${sub} field`,`A sports player`,`A movie actor`,`No one`], ans:0}
    ];
  }

  let shuffled = [...questionTemplates].sort(()=>0.5-Math.random());
  for(let i=0;i<count;i++){
    let template = shuffled[i % shuffled.length];
    let opts = [...template.opts].sort(()=>0.5-Math.random());
    let correctAnswer = template.opts[template.ans];
    tempQuiz.push({
      q:`Q${i+1}: ${template.q}`,
      options: opts,
      answer: correctAnswer,
      topic: topic,
      class: cls,
      subject: sub
    });
  }

  let html = tempQuiz.map((qq)=>`
    <div class="quiz-q" style="border-left:4px solid #22c55e">
      <b>${qq.q}</b><br>
      ${qq.options.map(o=>`
        <label style="${o===qq.answer? 'color:green;font-weight:bold;' : ''}">
          <input type="radio" disabled ${o===qq.answer?'checked':''}> ${o} ${o===qq.answer? '✅' : ''}
        </label><br>
      `).join('')}
    </div>
  `).join('');

  document.getElementById('quizPreview').innerHTML = html;
  document.getElementById('saveQuizBtn').style.display='block';
  document.getElementById('saveQuizBtn').innerText = 'Submit Quiz';
}

function saveQuiz(){
  let idx=document.getElementById('q_editIndex').value;
  let quizObj={id:Date.now(), class:document.getElementById('q_class').value, subject:document.getElementById('q_subject').value, topic:document.getElementById('q_topic').value, questions:tempQuiz, by:currentUser.name, date:new Date().toLocaleDateString()};
  if(idx!=='') quizzes[idx]=quizObj; else quizzes.push(quizObj);
  saveDB(); renderQuizList(); document.getElementById('quizPreview').innerHTML=''; document.getElementById('saveQuizBtn').style.display='none'; alert('Quiz Saved');
}
function editQuiz(i){
  let q=quizzes[i];
  document.getElementById('q_class').value=q.class; updateSubjects('q_class','q_subject');
  document.getElementById('q_subject').value=q.subject; document.getElementById('q_topic').value=q.topic; tempQuiz=q.questions;
  document.getElementById('q_editIndex').value=i; document.getElementById('quizPreview').innerHTML='Editing - Click Auto Generate to regenerate or Save'; document.getElementById('saveQuizBtn').style.display='block';
}
function deleteQuiz(i){ if(confirm('Delete quiz?')){ quizzes.splice(i,1); saveDB(); renderQuizList(); } }
function renderQuizList(){
  document.getElementById('quizList').innerHTML = quizzes.map((q,i)=>`<div class="quiz-q"><b>${q.class} - ${q.subject} - ${q.topic}</b> (${q.questions.length} Qs)<br><small>${q.by} | ${q.date}</small><br><button onclick="editQuiz(${i})" style="padding:4px 8px;background:#3b82f6;color:#fff;border:none;border-radius:6px;margin-top:5px;">Edit</button><button onclick="deleteQuiz(${i})" style="padding:4px 8px;background:#ef4444;color:#fff;border:none;border-radius:6px;margin-left:4px;">Delete</button></div>`).join('') || 'No quiz';
}
function renderStudent(){
  let myAssign = assignments.filter(a=> a.class===currentUser.class || a.class==='All' || currentUser.class.includes(a.class));
  document.getElementById('myAssignments').innerHTML = myAssign.map(a=>`<div class="quiz-q"><b>${a.subject}</b>: ${a.title}<br><small>${a.date}</small></div>`).join('') || 'No assignments';
  let myQuiz = quizzes.filter(q=> q.class===currentUser.class);
  document.getElementById('myQuiz').innerHTML = myQuiz.map(q=>`<div class="quiz-q"><b>${q.subject} - ${q.topic}</b><button onclick="attendQuiz(${quizzes.indexOf(q)})" style="float:right;padding:4px 8px;background:#22c55e;color:#fff;border:none;border-radius:6px;">Attend</button><br><small>${q.questions.length} Questions</small></div>`).join('') || 'No quiz';
}
function attendQuiz(idx){
  let q=quizzes[idx];
  let html=q.questions.map((qq,i)=>`<div class="quiz-q"><b>${qq.q}</b><br>${qq.options.map(o=>`<label><input type="radio" name="q${i}" value="${o}"> ${o}</label><br>`).join('')}</div>`).join('');
  document.getElementById('myQuiz').innerHTML = html + `<button onclick="submitQuiz(${idx})" class="btn-primary">Submit Quiz</button><div id="quizResult"></div>`;
}
function submitQuiz(idx){
  let q=quizzes[idx]; let score=0;
  q.questions.forEach((qq,i)=>{ let sel=document.querySelector(`input[name="q${i}"]:checked`); if(sel && sel.value===qq.answer) score++; });
  document.getElementById('quizResult').innerHTML = `<h3 style="color:green;margin-top:15px;">Score: ${score}/${q.questions.length}</h3>`;
}
