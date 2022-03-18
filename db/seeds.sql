
INSERT INTO department(name)
VALUES ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES 
        ("Sales Lead",100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 250000, 3),
        ("Legal Team Lead", 25000, 4),
        ("Lawyer", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
        ("Naomi", "Toselli", 1, null),
        ("Shiori", "Abbatelli", 2, 1),
        ("Loreto", "Provenza", 3, null),
        ("Masami", "Sakamoto", 4, 3),
        ("Hikaru", "Montanari", 5, null),
        ("Tsubasa", "Alagona", 6, 4),
        ("Hifumi", "Campo", 6, 4),
        ("Odalis", "Villar", 7, null),
        ("Minoru", "Accursio", 8, 8),
        ("Tomomi", "Marconil", 4, 3)
