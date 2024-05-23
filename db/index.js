const pool = require('./connection');

// Function to get all departments
const getAllDepartments = async () => {
    try {
        const result = await pool.query('SELECT * FROM department');
        return result.rows;
    } catch (err) {
        console.error('Error retrieving departments:', err);
        throw err;
    }
};

// Function to get all roles with department information
const getAllRoles = async () => {
    try {
        const result = await pool.query(`
            SELECT role.id, title, salary, department.name AS department
            FROM role
            JOIN department ON role.department = department.id
        `);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving roles:', err);
        throw err;
    }
};

// Function to get all employees with role and manager information
const getAllEmployees = async () => {
    try {
        const result = await pool.query(`
            SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary,
                (SELECT CONCAT(m.first_name, ' ', m.last_name) FROM employee m WHERE m.id = e.manager_id) AS manager
            FROM employee e
            JOIN role ON e.role_id = role.id
            JOIN department ON role.department = department.id
        `);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving employees:', err);
        throw err;
    }
};

// Function to add a new department
const addDepartment = async (name) => {
    try {
        const result = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
    } catch (err) {
        console.error('Error adding department:', err);
        throw err;
    }
};

// Function to add a new role
const addRole = async (title, salary, department) => {
    try {
        const result = await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING *', [title, salary, department]);
        return result.rows[0];
    } catch (err) {
        console.error('Error adding role:', err);
        throw err;
    }
};

// Function to add a new employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
    try {
        const result = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, roleId, managerId]);
        return result.rows[0];
    } catch (err) {
        console.error('Error adding employee:', err);
        throw err;
    }
};

// Function to update an employee's role
const updateEmployeeRole = async (employeeId, roleId) => {
    try {
        const result = await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [roleId, employeeId]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating employee role:', err);
        throw err;
    }
};

module.exports = {
    getAllDepartments,
    getAllRoles,
    getAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
};
