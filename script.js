let users = JSON.parse(localStorage.getItem('school_users')) || [{username:'owner', password:'owner123', role:'owner', name:'Main Owner', class:'All', emis:'0001'}];
let assignments = JSON.parse(localStorage.getItem('school_assign')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
function save(){ localStorage.setItem('school_users', JSON.stringify(users)); localStorage.setItem('school_assign', JSON.stringify(assignments)); }
function login(){ let u=uid.value.trim(), p=upass.value.trim(); let f=users.find(x=>(x.username==u||x.emis==u)&&x.password==p); if(f){ localStorage.setItem('currentUser', JSON.stringify(f)); location.reload(); } else err.innerText="ID / EMIS / Password Thappu da!"; }
function logout(){ localStorage.removeItem('currentUser'); location.reload(); }

function createUser(by){
  let name, id, pass, role, cls, emis, idx;
  if(by=='owner'){
    idx=document.getElementById('editIndex').value;
    name=o_name.value.trim(); id=o_id.value.trim(); pass=o_pass.value.trim(); role=o_role.value; cls=o_class.value.trim(); emis=o_emis.value.trim();
    if(role=='') return alert("Role select pannu da!");
  } else {
    idx=document.getElementById('t_editIndex').value;
    name=t_name.value.trim(); id=t_id.value.trim(); pass=t_pass.value.trim(); role='student'; cls=t_class.value.trim(); emis=t_emis.value.trim();
  }
  if(!name||!id||!pass) return alert("Full details fill pannu da!");
  // Edit mode
  if(idx!==""){
    users[idx].name=name; users[idx].username=id; users[idx].password=pass; users[idx].role=role; users[idx].class=cls; users[idx].emis=emis;
    save(); alert("Update aayiduchu da! "+name); cancelEdit(); location.reload(); return;
  }
  if(users.find(x=>x.username==id)) return alert("ID already irukku da!");
  if(emis && users.find(x=>x.emis==emis)) return alert("EMIS already irukku da!");
  users.push({username:id, password:pass, role:role, name:name, class:cls, emis:emis}); save(); alert("ID Create aayiduchu da! "+name); location.reload();
}

function editUser(i){
  let u=users[i];
  if(currentUser.role=='teacher' && u.role!='student') return alert("Teacher Student ah mattum edit pannalam!");
  if(u.username=='owner' && currentUser.username!='owner') return alert("Main Owner ah edit panna mudiyathu!");
  if(currentUser.role=='owner'){
    editIndex.value=i; o_name.value=u.name; o_id.value=u.username; o_pass.value=u.password; o_role.value=u.role; o_class.value=u.class; o_emis.value=u.emis;
    editTitle.innerText="Edit ID - "+u.name; createBtn.innerText="Update ID"; createBtn.style.background="#f59e0b"; cancelBtn.style.display="block"; window.scrollTo(0,0);
  } else {
    t_editIndex.value=i; t_name.value=u.name; t_id.value=u.username; t_pass.value=u.password; t_class.value=u.class; t_emis.value=u.emis;
    t_createBtn.innerText="Update Student"; t_createBtn.style.background="#f59e0b"; t_cancelBtn.style.display="block"; window.scrollTo(0,0);
  }
}
function cancelEdit(){
  editIndex.value=""; t_editIndex.value=""; o_name.value=""; o_id.value=""; o_pass.value=""; o_class.value=""; o_emis.value=""; t_name.value=""; t_id.value=""; t_pass.value=""; t_class.value=""; t_emis.value="";
  editTitle.innerText="Create ID"; createBtn.innerText="Create ID"; createBtn.style.background="#4f46e5"; cancelBtn.style.display="none";
  t_createBtn.innerText="Add Student"; t_createBtn.style.background="#4f46e5"; t_cancelBtn.style.display="none";
}
function deleteUser(i){
  let u=users[i];
  if(u.username=='owner') return alert("Main owner ah delete panna mudiyathu da!");
  if(currentUser.role=='teacher' && u.role!='student') return alert("Teacher Student ah mattum delete pannalam!");
  if(confirm(u.name+" ah delete pannanuma da?")){ users.splice(i,1); save(); render(); }
}

function addAssignment(){ let cl=a_class.value, sub=a_sub.value, title=a_title.value; if(!cl||!sub||!title) return alert("Full fill pannu da!"); assignments.push({class:cl, subject:sub, title:title, by:currentUser.username, date:new Date().toLocaleDateString()}); save(); render(); }
function deleteAssignment(i){ if(confirm("Delete pannanuma?")){ assignments.splice(i,1); save(); render(); } }
function deleteAllAssignment(){ if(confirm("Ellam delete pannanuma?")){ assignments=[]; save(); render(); } }

function render(){
  if(!currentUser) return;
  loginPage.style.display='none'; mainPage.style.display='block';
  myName.innerText=currentUser.name; myRole.innerText=currentUser.role; myRole.className='badge '+currentUser.role; myClass.innerText=currentUser.class+' | EMIS: '+currentUser.emis;
  if(currentUser.role=='owner'){ ownerPanel.style.display='block'; assignPanel.style.display='block'; listPanel.style.display='block'; assignList.style.display='block'; }
  if(currentUser.role=='teacher'){ teacherPanel.style.display='block'; assignPanel.style.display='block'; listPanel.style.display='block'; assignList.style.display='block'; }
  if(currentUser.role=='student'){
    studentPanel.style.display='block'; sClass.innerText=currentUser.class;
    let list=assignments.filter(a=> currentUser.class.includes(a.class) || a.class.includes(currentUser.class) || a.class=='All');
    myAssignments.innerHTML= list.length==0? "Innum Assignment illa da!" : list.map(a=>`<div style='padding:10px;border-bottom:1px solid #eee'><b>${a.subject} [${a.class}]</b>: ${a.title}<br><small>${a.by} | ${a.date}</small></div>`).join('');
    return;
  }
  let t="<tr><th>Name</th><th>Role</th><th>Class</th><th>ID</th><th>Action</th></tr>";
  users.forEach((u,i)=>{
    if(currentUser.role=='teacher' && u.role!='student') return;
    t+=`<tr><td>${u.name}<br><small>${u.emis}</small></td><td><span class='badge ${u.role}'>${u.role}</span></td><td>${u.class}</td><td>${u.username}</td><td><button onclick="editUser(${i})" style="width:auto;padding:4px 8px;background:#3b82f6;margin:2px">Edit</button><button onclick="deleteUser(${i})" style="width:auto;padding:4px 8px;background:#ef4444;margin:2px">Del</button></td></tr>`;
  });
  userTable.innerHTML=t;
  let h=`<h3>Assignments <button onclick="deleteAllAssignment()" style="width:auto;padding:5px 10px;background:#ef4444;float:right">Delete All</button></h3>`;
  h+= assignments.length==0? "<p>Assignment illa</p>" : assignments.map((a,i)=>`<div style='padding:8px;border:1px solid #eee;border-radius:8px;margin:5px 0'><b>${a.class} - ${a.subject}</b>: ${a.title}<br><small>${a.by}|${a.date}</small><button onclick="deleteAssignment(${i})" style="width:auto;padding:3px 8px;background:#ef4444;float:right">Del</button></div>`).join('');
  assignList.innerHTML=h;
}
currentUser = JSON.parse(localStorage.getItem('currentUser')); if(currentUser) render();
