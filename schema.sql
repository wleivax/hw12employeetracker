DROP DATABASE IF EXISTS emptrackdb;
CREATE DATABASE emptrackdb;

USE emptrackdb;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(15) NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Javier", "Zanetti", 1, NULL), 
("Marcelo", "Vieira", 1, NULL), 
("Samir", "Handanovic", 2, NULL), 
("Cristiano", "Ronaldo", 3, NULL);

INSERT INTO role (title, salary, department_id)
VALUES ("Left Back", 3000000, 2), 
("Goalkeeper", 50000000, 4), 
("Left Wing", 30000000, 1), 
("Center Mid", 45000000, 1), 
("Striker", 9000000, 3);

INSERT INTO department (dept_name)
VALUES ("Forwards"),
("Defensive"),
("Goal");