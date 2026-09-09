<?php include 'config.php';
if(isset($_POST['login'])){ $u=$_POST['uid']; $p=$_POST['upass']; $q=$conn->query("SELECT * FROM users WHERE username='$u' AND password='$p'"); if($q->num_rows>0){ $_SESSION['user']=$q->fetch_assoc(); header("Location:index.php"); exit; } else $err="ID/Password thappu da!"; }
if(isset($_GET['logout'])){ session_destroy(); header("Location:index.php"); exit; }
if(isset($_POST['create_user']) && $_SESSION['user']){ $role=$_POST['role']; $cur=$_SESSION['user']['role']; if($role=='teacher' && $cur!='owner') die("Teacher ID ah Owner mattum thaan create panna mudiyum"); if($role=='owner' && $cur!='owner') die("Owner ah Owner mattum create pannalam"); $conn->query("INSERT INTO users (username,password,role,name,class,emis) VALUES ('$_POST[nid]','$_POST[npass]','$role','$_POST[nname]','$_POST[nclass]','$_POST[nemis]')"); header("Location:index.php"); exit; }
if(isset($_POST['add_assign'])){ $conn->query("INSERT INTO assignments (class,subject,title,created_by,date) VALUES ('$_POST[aclass]','$_POST[sub]','$_POST[title]','".$_SESSION['user']['username']."',NOW())"); header("Location:index.php"); exit; }
?>
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>GHSS Silattur ERP</title>
<style>body{font-family:Arial;background:#eef2ff;padding:10px}.card{background:#fff;padding:15px;border-radius:12px;margin-bottom:10px;box-shadow:0 2px 8px #0001}input,select{width:100%;padding:10px;margin:5px 0;border:1px solid #ccc;border-radius:8px}button{width:100%;padding:11px;background:#2563eb;color:#fff;border:0;border-radius:8px;font-weight:bold}h2{color:#2563eb}</style>
</head><body>
<?php if(!isset($_SESSION['user'])):?>
<div class="card"><h2>GHSS Silattur - Login</h2><?php if(isset($err)) echo "<p style=color:red>$err</p>";?>
<form method="POST"><input name="uid" placeholder="ID / EMIS No" required><input name="upass" type="password" placeholder="Password" required><button name="login" value="1">Login</button></form><small>First Login: owner / owner123</small></div>
<?php else: $me=$_SESSION['user']; echo "<div class=card>Hi <b>$me[name]</b> ($me[role]) - $me[class] <a href='?logout=1' style='float:right'>Logout</a></div>";
if($me['role']=='owner'):?><div class="card" style="border:2px solid #2563eb"><h3>OWNER PANEL - Full Control</h3>
<p>Owner can create ANY ID as he wants!</p>
<form method="POST"><input name="nname" placeholder="Full Name" required><input name="nid" placeholder="New ID - Un Virupam" required><input name="npass" placeholder="Password" required>
<select name="role" required><option value="">Select Role</option><option value="owner">Owner</option><option value="teacher">Teacher</option><option value="student">Student</option></select>
<input name="nclass" placeholder="Class (for student)"><input name="nemis" placeholder="EMIS No"><button name="create_user" value="1">Create ID</button></form></div>
<?php endif; if($me['role']=='teacher'):?><div class="card" style="border:2px solid green"><h3>TEACHER PANEL - Student Add Only</h3>
<form method="POST"><input name="nname" placeholder="Student Name" required><input name="nid" placeholder="Student ID / EMIS" required><input name="npass" placeholder="Password" required><input name="nclass" placeholder="Class (ex: 10th A)" required><input name="nemis" placeholder="EMIS No" required><input type="hidden" name="role" value="student"><button name="create_user" value="1">Add Student</button></form></div>
<?php endif; if(in_array($me['role'],['owner','teacher'])):?><div class="card"><h3>Add Assignment (Owner + Teacher)</h3><form method="POST"><select name="aclass" required><option value="">Class Select</option><option>6th</option><option>7th</option><option>8th</option><option>9th</option><option>10th</option><option>11th</option><option>12th</option></select><input name="sub" placeholder="Subject" required><input name="title" placeholder="Assignment / Homework" required><button name="add_assign" value="1">Post Assignment</button></form></div>
<?php $u=$conn->query("SELECT * FROM users ORDER BY id DESC"); echo "<div class=card><h3>All Created IDs</h3>"; while($r=$u->fetch_assoc()) echo "$r[username] - $r[name] - $r[role] - $r[class] - EMIS:$r[emis]<br>"; echo "</div>"; endif;
if($me['role']=='student'){ echo "<div class=card><h3>My Class Assignment - $me[class]</h3>"; $a=$conn->query("SELECT * FROM assignments WHERE class='$me[class]' ORDER BY id DESC"); if($a->num_rows==0) echo "No assignment yet"; while($row=$a->fetch_assoc()) echo "<b>$row[subject]</b>: $row[title] <br><small>by $row[created_by] on $row[date]</small><hr>"; echo "</div>"; } endif;?>
</body></html>
