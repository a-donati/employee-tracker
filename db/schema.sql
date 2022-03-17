DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    department_id INT,
    salary DECIMAL,
    PRIMARY KEY (id)
    -- FOREIGN KEY(department_id)
    -- REFERENCES department.id 
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL,
    PRIMARY KEY (id)
    -- FOREIGN KEY(role_id)
    -- REFERENCES roles.id
    -- FOREIGN KEY (manager_id)
    -- REFERENCES employees.id
);
