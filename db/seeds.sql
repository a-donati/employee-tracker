
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
("Loreto", "Provenza", 2, 1),
("Masami", "Sakamoto", 3, 1),
("Hikaru", "Montanari", 3, 1),
("Tsubasa", "Alagona", 4, null),
("Hifumi", "Campo", 4, 4),
("Odalis", "Villar", 4, 1),
("Minoru", "Accursio", 3, null),
("Tomomi", "Marconil", 2, null)
