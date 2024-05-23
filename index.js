const inquirer = require('inquirer');
const pool = require('./db');

async function mainMenu() {
    const choices = [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
    ];

    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: choices,
    });

    switch (action) {
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case 'View all employees':
            viewAllEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Exit':
            pool.end();
            process.exit();
    }
}

async function viewAllDepartments() {
    const res = await pool.query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
}

async function viewAllRoles() {
    const res = await pool.query('SELECT role.id, title, salary, department.name AS department FROM role JOIN department ON role.department = department.id');
    console.table(res.rows);
    mainMenu();
}

async function viewAllEmployees() {
    const res = await pool.query(
        `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
        (SELECT CONCAT(m.first_name, ' ', m.last_name) FROM employee m WHERE m.id = e.manager_id) AS manager 
        FROM employee e 
        JOIN role ON e.role_id = role.id 
        JOIN department ON role.department = department.id`
    );
    console.table(res.rows);
    mainMenu();
}

async function addDepartment() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    });

    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department: ${name}`);
    mainMenu();
}

async function addRole() {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const { title, salary, department } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the name of the role:' },
        { type: 'input', name: 'salary', message: 'Enter the salary for the role:' },
        { type: 'list', name: 'department', message: 'Select the department:', choices: departmentChoices }
    ]);

    await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)', [title, salary, department]);
    console.log(`Added role: ${title}`);
    mainMenu();
}

async function addEmployee() {
    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const managerChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));
    managerChoices.push({ name: 'None', value: null });

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: 'Enter the first name of the employee:' },
        { type: 'input', name: 'lastName', message: 'Enter the last name of the employee:' },
        { type: 'list', name: 'roleId', message: 'Select the role:', choices: roleChoices },
        { type: 'list', name: 'managerId', message: 'Select the manager:', choices: managerChoices }
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    console.log(`Added employee: ${firstName} ${lastName}`);
    mainMenu();
}

async function updateEmployeeRole() {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));

    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const { employeeId, roleId } = await inquirer.prompt([
        { type: 'list', name: 'employeeId', message: 'Select the employee to update:', choices: employeeChoices },
        { type: 'list', name: 'roleId', message: 'Select the new role:', choices: roleChoices }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    console.log(`Updated employee's role`);
    mainMenu();
}

// Start the application
mainMenu();
