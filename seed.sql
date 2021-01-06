USE workdb;

INSERT INTO department (department) VALUES ('Sales');

INSERT INTO department (department) VALUES ('HR');

INSERT INTO role (title, salary, department_id) VALUES ('Salesperson',60000,1);

INSERT INTO role (title, salary, department_id) VALUES ('Sales manager',70000,1);

INSERT INTO role (title, salary, department_id) VALUES ('HR rep',60000,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Dwight','Schrute', 1,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jim','Halpert', 1,4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ('Toby','Flenderson', 2);

INSERT INTO employee (first_name, last_name, role_id) VALUES ('Michael','Scott', 3);