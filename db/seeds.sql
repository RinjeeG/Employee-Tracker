-- Populate departments
INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Sales');

-- Populate roles
INSERT INTO role (title, salary, department)
VALUES
('Software Engineer', 75000, 1),
('Senior Software Engineer', 95000, 1),
('Accountant', 65000, 2),
('HR Manager', 80000, 3),
('Sales Representative', 55000, 4);

-- Populate employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Emily', 'Davis', 3, NULL),
('Michael', 'Brown', 4, NULL),
('Sarah', 'Wilson', 5, 4);
