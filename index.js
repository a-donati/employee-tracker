const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create connection to database employee_db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password:'123',
        database: 'employee_db'
    },
    console.log(`Connected to employee_db database.`)
);

console.log(' ________________________________________________________________')
console.log('')
console.log('                Employee Tracker                                 ')
console.log(' ________________________________________________________________')
console.log('')
console.log('')

// prompt user for desired action
const employeeSearch = () => {
    inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            message: 'Choose an option:',
            choices: [
                'View all employees',
                'View all employees by department',
                'View all employees by manager',
                'Add employee',
                'Remove employee',
                'Update employee role',
                'Update employee manager',
                'View all roles',
                'Add role',
                'Remove role',
                'View all departments',
                'Add department',
                'Remove department',
                'View department budget',
                'exit',
            ],
        }
    ])
    // pass answer data into switch statement to determine which function to run
    .then((answer)=> {
        switch(answer.action){
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all employees by department':
                viewEmployeesByDept();
                break;
            case 'View all employees by manager':
                viewEmployeesByManager();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Remove employee':
                removeEmployee();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Remove role':
                removeRole();
                break;
            case 'View all departments':
                viewAllDept();
                break;
            case 'Add department':
                addDept();
                break;
            case 'Remove department':
                removeDept();
                break;
            case 'View department budget':
                viewBudgets();
                break;
            case 'exit':
                // when user exits, connection to the database ends
                db.end();
                break;
        }
    })
}

employeeSearch();
// view all employees in the db
 const viewAllEmployees = () => {
    //  send query to database to select desired column names from tables and join on common IDs
     const sql = `SELECT employees.id AS "employee id", employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT (m.first_name, " ", m.last_name) AS manager 
     FROM employees 
     LEFT JOIN roles ON employees.role_id = roles.id 
     LEFT JOIN department ON roles.department_id = department.id 
     LEFT JOIN employees m ON employees.manager_id = m.id`
    db.query(sql, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.table(res);
        employeeSearch();

    })
 }
// view employees by department
const viewEmployeesByDept = () => {
    // set departments to an empty array
    let departments = [];
    const sql = 'SELECT name FROM department';
    db.query(sql, (err, res) => {
        if(err) throw err;
        // for each department name, push name to departments array
        res.forEach((name) => {
            departments.push(name.name);
        })
        // use departments array as choice selections list
        inquirer.prompt([{
            name: 'department',
            type: 'list',
            message: 'Choose a department:',
            choices: departments
        },

    ])
    .then((answer) =>{
        // pass in user selected answer.department into the query as WHERE clause
        const sql = `SELECT employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Role, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS "Manager", department.name AS Department 
        FROM employees 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN department ON roles.department_id = department.id 
        LEFT JOIN employees m ON employees.manager_id = m.id 
        WHERE department.name = ` + db.escape(answer.department)
        db.query(sql, (err, res) => {
            if(err) throw err;
            console.table(res);
            employeeSearch();
        })
    })
    })
}