function getCurrentUser(){return JSON.parse(localStorage.getItem('ghss_current')||'null');}
function requireLogin(){let u=getCurrentUser();if(!u){location.href='index.html';return null;}return u;}
function requireRole(allowed){let u=requireLogin();if(!u)return null;if(!allowed.includes(u.role)){alert('Access denied');location.href='dashboard.html';return null;}return u;}
function logout(){localStorage.removeItem('ghss_current');location.href='index.html';}
function togglePass(id){let el=document.getElementById(id);if(el)el.type=el.type==='password'?'text':'password';}
