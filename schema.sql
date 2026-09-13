-- ==========================================================
-- Employee Management System - Database Schema & Seed Data
-- ==========================================================

CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

-- ----------------------------------------------------------
-- Table: employees
-- ----------------------------------------------------------
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100)  NOT NULL,
    last_name   VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    department  VARCHAR(100),
    role        VARCHAR(100),
    salary      DECIMAL(12,2),
    hire_date   DATE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- Seed data: 15 realistic employees across departments
-- ----------------------------------------------------------
INSERT INTO employees (first_name, last_name, email, department, role, salary, hire_date) VALUES
('Amara',   'Wickramasinghe', 'amara.wickramasinghe@example.com', 'Engineering', 'Senior Software Engineer', 125000.00, '2018-03-14'),
('Kasun',   'Perera',         'kasun.perera@example.com',         'Engineering', 'Backend Developer',        95000.00,  '2020-07-01'),
('Nadia',   'Fernando',       'nadia.fernando@example.com',       'Engineering', 'DevOps Engineer',          110000.00, '2019-11-20'),
('Ravi',    'Jayasuriya',     'ravi.jayasuriya@example.com',      'Engineering', 'Frontend Developer',       88000.00,  '2021-05-10'),
('Tharushi','Silva',          'tharushi.silva@example.com',       'HR',          'HR Manager',               78000.00,  '2016-01-25'),
('Dinesh',  'Gunawardena',    'dinesh.gunawardena@example.com',   'HR',          'HR Coordinator',           52000.00,  '2022-09-05'),
('Priya',   'Raj',            'priya.raj@example.com',            'Sales',       'Sales Director',           135000.00, '2015-06-18'),
('Chamara', 'Ratnayake',      'chamara.ratnayake@example.com',    'Sales',       'Account Executive',        67000.00,  '2023-02-12'),
('Ishara',  'Bandara',        'ishara.bandara@example.com',       'Sales',       'Sales Representative',     54000.00,  '2024-01-08'),
('Malik',   'Hassan',         'malik.hassan@example.com',         'Marketing',   'Marketing Manager',        89000.00,  '2017-10-30'),
('Sanduni', 'Wijesekara',     'sanduni.wijesekara@example.com',   'Marketing',   'Content Strategist',       61000.00,  '2022-04-18'),
('Ashan',   'Kumara',         'ashan.kumara@example.com',         'Marketing',   'SEO Specialist',           58000.00,  '2023-08-22'),
('Fathima', 'Rizvi',          'fathima.rizvi@example.com',        'Finance',     'Finance Manager',          115000.00, '2016-12-02'),
('Nuwan',   'Abeysekara',     'nuwan.abeysekara@example.com',     'Finance',     'Financial Analyst',        72000.00,  '2019-03-29'),
('Yasodha', 'Peiris',         'yasodha.peiris@example.com',       'Finance',     'Accountant',               60000.00,  '2021-11-15');
