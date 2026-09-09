<?php
$host="localhost"; 
$user="root"; 
$pass=""; 
$db="school_erp";
$conn = new mysqli($host, $user, $pass, $db);
if($conn->connect_error){ die("DB Connection Failed"); }
session_start();
?>
