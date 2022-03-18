const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// create connection to database employee_db
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "123",
        database: "employee_db",
    },
    console.log(`Connected to employee_db database.`)
);

console.log(
    " ________________________________________________________________"
);
console.log("");
console.log(
    "                Employee Tracker                                 "
);
console.log(
    " ________________________________________________________________"
);
console.log("");
console.log("");

// prompt user for desired action
const employeeSearch = () => {
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                message: "Choose an option:",
                choices: [
                    "View all employees",
                    "View all employees by department",
                    "View all employees by manager",
                    "Add employee",
                    "Remove employee",
                    "Update employee role",
                    "Update employee manager",
                    "View all roles",
                    "Add role",
                    "Remove role",
                    "View all departments",
                    "Add department",
                    "Remove department",
                    "View department budget",
                    "exit",
                ],
            },
        ])
        // pass answer data into switch statement to determine which function to run
        .then((answer) => {
            switch (answer.action) {
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "View all employees by department":
                    viewEmployeesByDept();
                    break;
                case "View all employees by manager":
                    viewEmployeesByManager();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Remove employee":
                    removeEmployee();
                    break;
                case "Update employee role":
                    updateEmployeeRole();
                    break;
                case "Update employee manager":
                    updateEmployeeManager();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Remove role":
                    removeRole();
                    break;
                case "View all departments":
                    viewAllDept();
                    break;
                case "Add department":
                    addDept();
                    break;
                case "Remove department":
                    removeDept();
                    break;
                case "View department budget":
                    viewBudgets();
                    break;
                case "exit":
                    // when user exits, connection to the database ends
                    db.end();
                    break;
            }
        });
};

employeeSearch();
// view all employees in the db
const viewAllEmployees = () => {
    //  send query to database to select desired column names from tables and join on common IDs
    const query = `SELECT employees.id AS "employee id", employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT (m.first_name, " ", m.last_name) AS manager 
     FROM employees 
     LEFT JOIN roles ON employees.roles_id = roles.id 
     LEFT JOIN department ON roles.department_id = department.id 
     LEFT JOIN employees m ON employees.manager_id = m.id`;
    db.query(query, (err, data) => {
        if (err) throw err;
        console.log("\n");
        console.table(data);
        employeeSearch();
    });
};
// view employees by department
const viewEmployeesByDept = () => {
    // set departments to an empty array
    let departments = [];
    const query = "SELECT name FROM department";
    db.query(query, (err, res) => {
        if (err) throw err;
        // for each department name, push name to departments array
        res.forEach((name) => {
            departments.push(name.name);
        });
        // use departments array as choice selections list
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "list",
                    message: "Choose a department:",
                    choices: departments,
                },
            ])
            .then((answer) => {
                // pass in user selected answer.department into the query as WHERE clause
                const sql =
                    `SELECT employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Role, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS "Manager", department.name AS Department 
                    FROM employees 
                    LEFT JOIN roles ON employees.roles_id = roles.id 
                    LEFT JOIN department ON roles.department_id = department.id 
                    LEFT JOIN employees m ON employees.manager_id = m.id 
                    WHERE department.name = ` + db.escape(answer.department);
                db.query(sql, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    employeeSearch();
                });
            });
    });
};
// view all employees by manager
const viewEmployeesByManager = () => {
    // query table to display employee, title, department and manager / if null for employees.manager_id - person is manager
    const queryString = `SELECT CONCAT(employees.first_name," ", employees.last_name) as 'Employee', roles.title as 'Title', department.name as 'Department', IFNULL(CONCAT(m.first_name," ", m.last_name),'Is Manager') as 'Manager' 
        FROM employees
        LEFT JOIN employees m on m.id = employees.manager_id
        INNER JOIN roles on employees.roles_id = roles.id
        INNER JOIN department on roles.department_id = department.id;
    `;
    db.query(queryString, (err, data) => {
        if (err) throw err;
        console.table(data);
        employeeSearch();
    });
};
// add employee
const addEmployee = () => {
    // select all roles from roles table
    const query = `SELECT * FROM roles`;
    db.query(query, (err, data) => {
        if (err) throw err;
        const rolesArray = data.map((role) => {
            return { name: role.title, value: role.id };
            // returns array of objects containing role title and role id
        });
        // console.log(rolesArray);
        const query = `SELECT * FROM employees;`;
        db.query(query, (err, data) => {
            if (err) throw err;
            const employeeArray = data.map((employee) => {
                // returns array of objects containing employee first and last name, and employee id
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                };
            });
            // add 'None' option into array of options which will add null value as in "No manager"
            const noneOption = { name: "None", value: null };
            employeeArray.unshift(noneOption);

            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "Enter employee's first name:",
                        name: "firstName",
                    },
                    {
                        type: "input",
                        message: "Enter employee's last name:",
                        name: "lastName",
                    },
                    {
                        // prompt user and use rolesArray as role options
                        type: "list",
                        message: "Select the employee's role:",
                        choices: rolesArray,
                        name: "role",
                    },
                    {
                        // use employeeArray to choose manager name
                        type: "list",
                        message: "Select the employee's manager:",
                        choices: employeeArray,
                        name: "manager",
                    },
                ])
                // destructure user response
                .then(({ firstName, lastName, role, manager }) => {
                    const query = `INSERT INTO employees
            (first_name, last_name, roles_id, manager_id)
            VALUE (?, ?, ?, ?);`;
                    db.query(query, [firstName, lastName, role, manager], (err, data) => {
                        if (err) throw err;
                        console.log("Employee added.");
                        employeeSearch();
                    });
                });
        });
    });
};
// remove an employee
const removeEmployee = () => {
    const query = `SELECT * FROM employees`;
    db.query(query, (err, data) => {
        if (err) throw err;
        // pass in employees, map to employeeArray
        const employeeArray = data.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        // use employeeArray for user choices
        inquirer
            .prompt([
                {
                    type: "list",
                    message: `Select employee to be deleted:`,
                    choices: employeeArray,
                    name: "employee",
                },
            ])
            .then(({ employee }) => {
                // where id matches employee, employee will be deleted
                const query = `DELETE FROM employees
        WHERE id = ?`;
                db.query(query, [employee], (err, data) => {
                    if (err) throw err;
                    console.log("Employee has been deleted");
                    employeeSearch();
                });
            });
    });
};
// update an employees role
const updateEmployeeRole = () => {
    const query = `SELECT * FROM roles`;
    db.query(query, (err, data) => {
        if (err) throw err;
        // map roles to new array with role.title and role.id data
        const rolesArray = data.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });
        const query = `SELECT * FROM employees`;
        db.query(query, (err, data) => {
            if (err) throw err;
            const employeeArray = data.map((employee) => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                };
            });
            inquirer
                .prompt([
                    {
                        // use mapped employeeArray and rolesArray for userchoices
                        type: "list",
                        message: "Choose employee to update:",
                        name: "employee",
                        choices: employeeArray,
                    },
                    {
                        type: "list",
                        message: "Choose role to assign:",
                        name: "role",
                        choices: rolesArray,
                    },
                ])
                // destructure data, pass in parameters to the query string
                .then(({ employee, role }) => {
                    const query = `UPDATE employees
            SET roles_id = ?
            WHERE id = ?`;
                    db.query(query, [role, employee], (err, data) => {
                        if (err) throw err;
                        console.log(`Employee role has been updated`);
                        employeeSearch();
                    });
                });
        });
    });
};
// update an employee's manager
const updateEmployeeManager = () => {
    const query = `SELECT * FROM employees`;
    db.query(query, (err, data) => {
        if (err) throw err;
        // map employee data to employeeArray
        const employeeArray = data.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        inquirer
            .prompt([
                {
                    // use employeeArray for user choices
                    type: "list",
                    choices: employeeArray,
                    message: "Choose employee to update",
                    name: "employee",
                },
                {
                    type: "list",
                    choices: employeeArray,
                    message: `Select the employee's new manager:`,
                    name: "manager",
                },
            ])
            .then(({ employee, manager }) => {
                const query = `UPDATE employee
            SET manager_id = ?
            WHERE id = ?`;
                db.query(query, [manager, employee], (err, data) => {
                    if (err) throw err;
                    console.log(`Employee has been updated`);
                });
            });
    });
};
// view all roles
const viewAllRoles = () => {
    const query = `SELECT roles.id, title, salary, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`;
    db.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        employeeSearch();
    });
};
// add a role
const addRole = () => {
    const query = `SELECT * FROM department`;
    db.query(query, (err, data) => {
        if (err) throw err;
        const departmentsArray = data.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Please enter the role title",
                    name: "title",
                },
                {
                    type: "input",
                    message: "Please enter the role salary:",
                    name: "salary",
                },
                {
                    type: "list",
                    choices: departmentsArray,
                    message: "Please select a department:",
                    name: "department_id",
                },
            ])
            .then(({ title, salary, department_id }) => {
                const query = `INSERT INTO roles (title, salary, department_id)
            VALUE (?, ?, ?)`;
                db.query(query, [title, salary, department_id], (err, data) => {
                    if (err) throw err;
                    console.log("Your department has been created");
                    employeeSearch();
                });
            });
    });
};
// remove role
const removeRole = () => {
    const query = `SELECT * FROM roles`;
    db.query(query, (err, data) => {
        if (err) throw err;
        const roleArray = data.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });
        inquirer
            .prompt([
                {
                    type: "list",
                    choices: roleArray,
                    message: "Select role to remove",
                    name: "role",
                },
            ])
            .then(({ role }) => {
                const query = `DELETE FROM roles 
            WHERE roles.id = ?`;
                db.query(query, [role], (err, data) => {
                    if (err) throw err;
                    console.log("Role removed");
                    employeeSearch();
                });
            });
    });
};
// view all departments
const viewAllDept = () => {
    const query = `SELECT * FROM department`;
    db.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        employeeSearch();
    });
};
// add a new department
const addDept = () => {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Enter department name:",
            },
        ])
        .then((answer) => {
            const query = `INSERT INTO department(name)
        VALUES (?)`;
            // use employee entered data to insert new department name
            db.query(query, [answer.name], (err, data) => {
                if (err) throw err;
                console.log(`Department has been created`);
                employeeSearch();
            });
        });
};
// remove department
const removeDept = () => {
    const query = `SELECT * FROM department`;
    db.query(query, (err, data) => {
        if (err) throw err;
        const departmentsArray = data.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer
            .prompt([
                {
                    // use departmentsArray for user choices
                    type: "list",
                    choices: departmentsArray,
                    message: "Please select a department to delete:",
                    name: "department",
                },
            ])
            .then(({ department }) => {
                // pass in user selection to the query
                const query = `DELETE FROM department 
            WHERE department.id = ?`;
                db.query(query, [department], (err, data) => {
                    if (err) throw err;
                    console.log("Department has been deleted");
                    employeeSearch();
                });
            });
    });
};

// viewBudget;
