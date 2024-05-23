const inquirer = require('inquirer');
const db = require('./db');

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
            db.pool.end();
            process.exit();
    }
}

async function viewAllDepartments() {
    const departments = await db.getAllDepartments();
    console.table(departments);
    mainMenu();
}

async function viewAllRoles() {
    const roles = await db.getAllRoles();
    console.table(roles);
    mainMenu();
}

async function viewAllEmployees() {
    const employees = await db.getAllEmployees();
    console.table(employees);
    mainMenu();
}

async function addDepartment() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    });

    await db.addDepartment(name);
    console.log(`Added department: ${name}`);
    mainMenu();
}

async function addRole() {
    const departments = await db.getAllDepartments();
    const departmentChoices = departments.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const { title, salary, department } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the name of the role:' },
        { type: 'input', name: 'salary', message: 'Enter the salary for the role:' },
        { type: 'list', name: 'department', message: 'Select the department:', choices: departmentChoices }
    ]);

    await db.addRole(title, salary, department);
    console.log(`Added role: ${title}`);
    mainMenu();
}

async function addEmployee() {
    const roles = await db.getAllRoles();
    const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
    }));

    const employees = await db.getAllEmployees();
    const managerChoices = employees.map(emp => ({
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

    await db.addEmployee(firstName, lastName, roleId, managerId);
    console.log(`Added employee: ${firstName} ${lastName}`);
    mainMenu();
}

async function updateEmployeeRole() {
    const employees = await db.getAllEmployees();
    const employeeChoices = employees.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));

    const roles = await db.getAllRoles();
    const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
    }));

    const { employeeId, roleId } = await inquirer.prompt([
        { type: 'list', name: 'employeeId', message: 'Select the employee to update:', choices: employeeChoices },
        { type: 'list', name: 'roleId', message: 'Select the new role:', choices: roleChoices }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);
    console.log(`Updated employee's role`);
    mainMenu();
}

// Start the application
mainMenu();
