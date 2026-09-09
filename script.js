// DATABASE - LocalStorage
let users = JSON.parse(localStorage.getItem('school_users')) || [
  {username:'owner', password:'owner123', role:'owner', name:'Main Owner', class:'All', emis:'0001'}
];
let assignments = JSON.parse(localStorage.getItem('school_assign')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function save(){ localStorage.setItem('school_users', JSON.stringify(users)); localStorage.setItem('school_assign', JSON.stringify(assignments)); }

function login(){
  let u=document.getElementById('uid').value.trim();
  let p=document.getElementById('upass').value.trim();
  let found = users.find(x => (x.username==u || x.emis==u) && x.password==p);
  if(found){ localStorage.setItem('currentUser', JSON.stringify(found)); location.reload(); }
  else document.getElementById('err').innerText="ID / EMIS / Password Thappu da!";
}
function logout(){ localStorage.removeItem('currentUser'); location.reload(); }

function createUser(by){
  let name, id, pass, role, cls, emis;
  if(by=='owner'){ name=o_name.value; id=o_id.value; pass=o_pass.value; role=o_role.value; cls=o_class.value; emis=o_emis.value;
    if(role=='') return alert("Role select pannu da!");
  } else {
    name=t_name.value; id=t_id.value; pass=t_pass.value; role='student'; cls=t_class.value; emis=t_emis.value;
  }
  if(!name || !id || !pass) return alert("Full details fill pannu da!");
  if(users.find(x=>x.username==id || (emis && x.emis==emis))) return alert("ID / EMIS already irukku da!");
  users.push({username:id, password:pass, role:role, name:name, class:cls, emis:emis});
  save(); alert("ID Create aayiduchu da! "+name); location.reload();
}

function addAssignment(){
  let cl=a_class.value, sub=a_sub.value, title=a_title.value;
  if(!cl || !sub || !title) return alert("Full fill pannu da!");
  assignments.push({class:cl, subject:sub, title:title, by:currentUser.username, date:new Date().toLocaleDateString()});
  save(); alert("Assignment Posted for "+cl+" !"); render();
}

// NEW DELETE FUNCTION DA!
function deleteAssignment(index){
  if(confirm("Nijama delete pannanuma da?")){
    assignments.splice(index,1);
    save();
    render();
  }
}
function deleteAllAssignment(){
  if(confirm("Ellam assignment ah delete pannanuma?")){
    assignments=[];
    save();
    render();
  }
}

function roleChange(v){ o_class.style.display = (v=='teacher')?'none':'block'; }

function render(){
  if(!currentUser) return;
  document.getElementById('loginPage').style.display='none';
  document.getElementById('mainPage').style.display='block';
  myName.innerText=currentUser.name; myRole.innerText=currentUser.role; myRole.className='badge '+currentUser.role;
  myClass.innerText=currentUser.class+' | EMIS: '+currentUser.emis;

  if(currentUser.role=='owner'){
    ownerPanel.style.display='block'; assignPanel.style.display='block'; listPanel.style.display='block';
  }
  if(currentUser.role=='teacher'){
    teacherPanel.style.display='block'; assignPanel.style.display='block'; listPanel.style.display='block';
  }
  if(currentUser.role=='student'){
    studentPanel.style.display='block'; sClass.innerText=currentUser.class;
    let html=""; 
    let list=assignments.filter(a=> currentUser.class.includes(a.class) || a.class.includes(currentUser.class) || a.class=='All' );
    if(list.length==0) html="Innum Assignment illa da!";
    else list.forEach((a, i)=>{
      // Student ku delete varathu
      html+=`<div style='padding:10px;border-bottom:1px solid #eee'><b>${a.subject} [${a.class}]</b>: ${a.title}<br><small>By ${a.by} | ${a.date}</small></div>`;
    });
    myAssignments.innerHTML=html;
    return;
  }
  // Owner/Teacher ku Assignment List + Delete Button
  let t="<tr><th>Name</th><th>Role</th><th>Class</th><th>EMIS</th><th>ID</th></tr>";
  users.forEach(u=>{ t+=`<tr><td>${u.name}</td><td><span class='badge ${u.role}'>${u.role}</span></td><td>${u.class}</td><td>${u.emis}</td><td>${u.username}</td></tr>`; });
  userTable.innerHTML=t;

  // Assignment list with delete for owner/teacher
  let assignHtml = `<h3>Posted Assignments <button onclick="deleteAllAssignment()" style="width:auto;padding:5px 10px;background:#ef4444;float:right">Delete All</button></h3>`;
  if(assignments.length==0) assignHtml+="<p>Assignment illa da</p>";
  else assignments.forEach((a,i)=>{
    assignHtml+=`<div style='padding:10px;border:1px solid #eee;border-radius:8px;margin:6px 0'> <b>${a.class} - ${a.subject}</b>: ${a.title} <br><small>${a.by} | ${a.date}</small> <button onclick="deleteAssignment(${i})" style="width:auto;padding:4px 8px;background:#ef4444;float:right">Delete</button></div>`;
  });
  // assignment list ah user table ku keela kaatu
  if(!document.getElementById('assignList')) {
    let div=document.createElement('div'); div.id='assignList'; div.className='card'; listPanel.after(div);
  }
  document.getElementById('assignList').innerHTML=assignHtml;
}

currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(currentUser) render();
