const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create connection to database employee_db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
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