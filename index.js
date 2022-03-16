const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create connection to database employee_db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password:'',
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
                db.end();
                break;
        }
    })
}

employeeSearch();