
INSERT INTO department(name)
VALUES ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (title, department_id, salary)
VALUES 
        ("Sales Lead", 1, 100000),
        ("Salesperson", 1, 80000),
        ("Lead Engineer", 2, 150000),
        ("Software Engineer", 2, 120000),
        ("Account Manager", 3, 160000),
        ("Accountant", 3, 250000),
        ("Legal Team Lead", 4, 25000),
        ("Lawyer", 4, 190000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Naomi", "Toselli", 1, null),
("Shiori", "Abbatelli", 1, 1),
("Loreto", "Provenza", 2, null),
("Masami", "Sakamoto", 2, 3),
("Hikaru", "Montanari", 3, null),
("Tsubasa", "Alagona", 3, 4),
("Hifumi", "Campo", 3, 4),
("Odalis", "Villar", 4, null),
("Minoru", "Accursio", 4, 8),
("Tomomi", "Marconil", 2, 3)
