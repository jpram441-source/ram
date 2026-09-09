CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  username VARCHAR(100) UNIQUE, 
  password VARCHAR(100), 
  role ENUM('owner','teacher','student'), 
  name VARCHAR(100), 
  class VARCHAR(20), 
  emis VARCHAR(50)
);
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  class VARCHAR(20), 
  subject VARCHAR(100), 
  title TEXT, 
  created_by VARCHAR(100), 
  date DATE
);
INSERT INTO users (username, password, role, name) VALUES ('owner','owner123','owner','Main Owner');
