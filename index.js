const inquirer = require('inquirer');
const { findSourceMap } = require('module');
const mysql = require('mysql');


const connectionParam = {
    database: 'workDB',
    host: 'localhost',
    password: 'RinaPoyo349!',
    PORT: 3306,
    user: 'root'
};

const connection = mysql.createConnection(connectionParam);

connection.connect((err) => {
    if (err) throw err;
    console.log(`You are connected to ID: ${connection.threadId}`);
    console.log(`
#######                                                 
#       #    # #####  #       ####  #   # ###### ###### 
#       ##  ## #    # #      #    #  # #  #      #      
#####   # ## # #    # #      #    #   #   #####  #####  
#       #    # #####  #      #    #   #   #      #      
#       #    # #      #      #    #   #   #      #      
####### #    # #      ######  ####    #   ###### ###### 
                                                        
#######                                                 
   #    #####    ##    ####  #    # ###### #####        
   #    #    #  #  #  #    # #   #  #      #    #       
   #    #    # #    # #      ####   #####  #    #       
   #    #####  ###### #      #  #   #      #####        
   #    #   #  #    # #    # #   #  #      #   #        
   #    #    # #    #  ####  #    # ###### #    #       
                                                        
`);
    init();
});

const init = () => {
    let question1 = {
        type: 'rawlist',
        name: 'init_choice',
        message: 'Please select what you would like to do today',
        choices:['View all employees', 'View all employees by department', 'View all employees by role', 'View all employees by manager', 'Add department', 'Add employee', 'Add roles', 'Update employee role', 'Upadate an employee manager', 'Delete employee, role or department', 'EXIT']
    };
    inquirer.prompt(question1).then((answer) => {
        console.log('You have selected: ' + answer.init_choice);
        switch (answer.init_choice) {
            case 'View all employees': 
                viewEmployees();
                break;
            case 'View all employees by department': 
                viewEmployeeDepartment();
                break;
            case 'View all employees by role':
                viewEmployeeRole();
                break;
            case 'View all employees by manager':
                viewEmployeebyManager();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add roles':
                addRoles();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Upadate an employee manager':
                updateManager();
                break;
            case 'Delete employee, role or department':
                deleteinfo();
                break;
            case 'EXIT':
                console.log(`BYE, thank you for using the app`);
                connection.end();
                process.exit(0);
        }
    })
};

const viewEmployees = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary
        FROM ((employee
        INNER JOIN role ON employee.role_id = role.id)
        INNER JOIN department ON role.department_id = department.id);`,
        (err, res) => {
            if (err) throw res;
            let resArr = [];
            for (i=0; i<res.length; i++) {
                resArr.push(res[i]);
            }
            console.table(resArr);
            init();
        }
    );
};

const viewEmployeeDepartment = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, department.department
        FROM ((employee
            INNER JOIN role ON employee.role_id = role.id)
            INNER JOIN department ON role.department_id = department.id);`,
        (err, res) => {
            if (err) throw res;
            let resArr = [];
            for (i=0; i<res.length; i++) {
                resArr.push(res[i]);
            }
            console.table(resArr);
            init();
        }
    );
};

const viewEmployeeRole = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary
        FROM employee
        INNER JOIN role ON employee.role_id = role.id;`,
        (err, res) => {
            if (err) throw res;
            let resArr = [];
            for (i=0; i<res.length; i++) {
                resArr.push(res[i]);
            }
            console.table(resArr);
            init();
        }
    );
};

const addEmployee = () => {
    connection.query(
        `SELECT * FROM role;`,
        (err, res) => {
            if(err) throw err;
            let choiceArr = [];
            for(i=0; i<res.length; i++) {
                choiceArr.push(res[i].title);
            };
            let question1 = {
                type: 'input',
                name: 'first_name',
                message: 'Enter the new employee first name',
                validate: answer => {
                    if(answer === '' || /^[a-zA-Z]*$/.test(answer) === false) {
                        return 'Please enter a correct value';
                    } return true;
                }
            };
            let question2 = {
                type: 'input',
                name: 'last_name',
                message: 'Enter the new employee last name',
                validate: answer => {
                    if(answer === '' || /^[a-zA-Z]*$/.test(answer) === false) {
                        return 'Please enter a correct value';
                    } return true;
                }
            };
            let question3 = {
                type: 'rawlist',
                name: 'role',
                message: 'Select the employee role',
                choices: choiceArr
            };
            inquirer.prompt([question1, question2, question3]).then(answer => {
                let idNumber;
                for(i=0;i<res.length;i++) {
                    if(answer.role === res[i].title) {
                        idNumber = res[i].id;
                    }
                };
                connection.query(
                    `INSERT INTO employee SET ?`,
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: idNumber
                    }, 
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Added employee ${answer.last_name} successfully!`);
                        init();
                    }
                );
            });
        }
    );
};

const addRoles = () => {
    connection.query (
        `SELECT * FROM department`,
        (err, res) => {
            let departmentId;
            let departments = [];
            if (err) throw err;
            for (i=0; i<res.length; i++) {
                departments.push(res[i].department);
            };
            let question1 = {
                type: 'input',
                name: 'role',
                message: 'Enter the name of the role',
                validate: answer => {
                    if(answer === '' || /^[a-zA-Z ]*$/.test(answer) === false) {
                        return 'Please enter a correct value';
                    } return true;
                }
            };
            
            let question2 = {
                type: 'input',
                name: 'salary',
                message: 'Enter the yearly salary for this role',
                validate: answer => {
                    if(answer === '' || /^[0-9]*$/g.test(answer) === false) {
                        return 'Please enter a correct value';
                    } return true;
                }
            };

            let question3 = {
                type: 'list',
                name: 'department_list',
                message: 'Select which department this role belongs to',
                choices: departments
            };

            inquirer.prompt([question1, question2, question3]).then(answers => {
                for (i=0; i<res.length; i++) {
                    if(answers.department_list === res[i].department) {
                        departmentId = res[i].id;
                    }
                };
                connection.query(
                    `INSERT INTO role SET ?`,
                    {
                        title: answers.role,
                        salary: parseInt(answers.salary),
                        department_id: departmentId
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Role ${answers.role} added successfully!`);
                        init();
                    }
                );
            });
        }
    );
};

// The const addDepartment contains all the code required to add a department and connect it to the sql database.
const addDepartment = () => {
    let question1 = {
        type: 'input',
        name: 'department',
        message: 'Please enter the name of the department you wish to create',
        validate: answer => {
            if(answer === '' || /^[a-zA-Z]*$/.test(answer) === false) {
                return 'Please enter a correct value';
            } return true;
        }
    };
    inquirer.prompt(question1).then(answer => {
        connection.query(
            `INSERT INTO department SET ?`,
            {
                name: answer.department,
            },
            (err, res) => {
                if(err) throw err;
                console.log(`Created ${answer.department} department successfully`);
                init();
            }
        );
    });
};

// The const updateRole contains all the code to update an employee role.
const updateRole = () => {
    connection.query (
        'SELECT * FROM employee;',
        (err, res) => {
            if (err) throw err;
            let employeeArr = [];
            for(i=0; i<res.length; i++) {
                employeeArr.push(res[i].last_name);
            };
            console.log(employeeArr);

            let question1 = {
                type: 'rawlist',
                name: 'employees',
                message: 'Please select which employee you want ther roles updated',
                choices: employeeArr
            };

            inquirer.prompt(question1).then(answer => {
                let first_name;
                for(i=0;i<res.length; i++) {
                    if(answer.employees === res[i].last_name) {
                        first_name = res[i].first_name;
                    };
                };
                console.log(`You have selected the following employee: first name: ${first_name}, last name: ${answer.employees}.`);
                nextChoices(answer.employees);
            });
        }
    );

    //This next function is used to ask the user to confirm if the user selected the correct employee. This is in case there are multiple employees with the same last name.
    function nextChoices(employees) {
        let question1 = {
            type: 'list',
            name: 'next',
            message: 'Is that correct?',
            choices: ['Yes', 'No']
        };

        inquirer.prompt(question1).then(answer => {
            switch(answer.next) {
                case 'Yes': 
                    employeeUpdateChoices(employees);
                    break;
                case 'No':
                    updateRole();
                    break;
            };
        });
    };

    // This next function is used to prompt the user if they want to update the employee role based on an existing role or add a new one.
    function employeeUpdateChoices(employees) {
        let question1 = {
            type: 'list',
            name: 'next',
            message: 'Please select what would you like to do?',
            choices: ['Update employee role based on an existing role', 'Add and update role']
        };

        inquirer.prompt(question1).then(answer => {
            switch(answer.next) {
                case 'Update employee role based on an existing role': 
                    employeeRoleUpdate(employees);
                    break;
                case 'Add and update role':
                    addAndUpdate(employees);
                    break;
            };
        });
    };

    // This next function is used to update an employee role based on existing roles.
    function employeeRoleUpdate(employees) {
        connection.query(
            `SELECT * FROM role;`,
            (err, res) => {
                if (err) throw err;
                let question1 = {
                    type: 'rawlist',
                    name: 'role_list',
                    message: 'Select which role you want to update with',
                    choices() {
                        let roleArr = [];
                        for(i=0;i<res.length; i++) {
                            roleArr.push(res[i].title);
                        }
                        return roleArr;
                    }
                };
                inquirer.prompt(question1).then(answer => {
                    let roleId;
                    for(i=0;i<res.length; i++) {
                        if(answer.role_list === res[i].title) {
                            roleId = res[i].id;
                        }
                    };
                    connection.query(
                        'UPDATE employee SET ? WHERE ?',
                        [
                            {
                                role_id: roleId,
                            },
                            {
                                last_name: employees,
                            },
                        ],
                        (err) => {
                            if(err) throw err;
                            console.log(`The current employee with the following last name: ${employees}, had their role successfully updated to: ${answer.role_list}.`);
                            init();
                        }
                    );
                });
            }
        );
    };

    // This following functions are used to update an employee role by adding a new role instead.
    function addAndUpdate(employees) {
        connection.query (
            `SELECT * FROM department`,
            (err, res) => {
                let departmentId;
                let departments = [];
                if (err) throw err;
                for (i=0; i<res.length; i++) {
                    departments.push(res[i].name);
                };
                let question1 = {
                    type: 'input',
                    name: 'role',
                    message: 'Enter the name of the role',
                    validate: answer => {
                        if(answer === '' || /^[a-zA-Z ]*$/.test(answer) === false) {
                            return 'Please enter a correct value';
                        } return true;
                    }
                };
                
                let question2 = {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the yearly salary for this role',
                    validate: answer => {
                        if(answer === '' || /^[0-9]*$/g.test(answer) === false) {
                            return 'Please enter a correct value';
                        } return true;
                    }
                };
    
                let question3 = {
                    type: 'list',
                    name: 'department_list',
                    message: 'Select which department this role belongs to',
                    choices: departments
                };
    
                inquirer.prompt([question1, question2, question3]).then(answers => {
                    for (i=0; i<res.length; i++) {
                        if(answers.department_list === res[i].name) {
                            departmentId = res[i].id;
                        }
                    };
                    connection.query(
                        `INSERT INTO role SET ?`,
                        {
                            title: answers.role,
                            salary: parseInt(answers.salary),
                            department_id: departmentId
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Role ${answers.role} added successfully!`);
                            updateNewCreateRole(employees, answers.role);
                        }
                    );
                });
            }
        );

        function updateNewCreateRole(employees, role) {
            let roleId;
            let roleName;
            connection.query(
                'SELECT * FROM role;',
                (err, res) => {
                    if (err) throw err;
                    for (i=0;i<res.length;i++) {
                        if(role===res[i].title) {
                            roleId = res[i].id;
                            roleName = res[i].title
                        }
                    };
                    createdRoleUpdate(employees);
                }
            );
            
            function createdRoleUpdate(employees) {
                connection.query(
                    'UPDATE employee SET ? WHERE ?',
                    [
                        {
                            role_id: roleId,
                        },
                        {
                            last_name: employees,
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Employee with the last name: ${employees} role has been updated to: ${roleName}`);
                        init();
                }
                );
            }
        };
    };
};

const updateManager = () => {
    let selectedEmployeeId;
    let selectedManagerId;
    connection.query(
        'SELECT * FROM employee;',
        (err,res) => {
            if(err) throw err;
            let employeeArr = [];
            let allEmployee = [];
            for(i=0;i<res.length;i++) {
                employeeArr.push(res[i].last_name);
            }
            let question1 = {
                type: 'rawlist',
                name: 'employee_choice',
                message: 'Choose for which employee you want to update their manager',
                choices: employeeArr
            };
            inquirer.prompt(question1).then(answer => {
                selectFirstName(answer.employee_choice);
            });
        }
    );

    //This next function is added in case there is a person with a similar last name
    function selectFirstName(employee) {
        let firstNameArr = [];
        connection.query(
            'SELECT * FROM employee WHERE last_name=?',
            [employee],
            (err, res) => {
                if (err) throw err;
                res.forEach(({first_name}) => {
                    firstNameArr.push(first_name);
                });
                
                let question1 = {
                    type: 'rawlist',
                    message: 'This is done in case there are several employees with the same last name. Please choose the correct employee based on their first name. If there is only one choice just press enter to continue.',
                    choices: firstNameArr,
                    name:'first_name'
                };

                inquirer.prompt(question1).then(answer => {
                    for (i=0; i<res.length; i++) {
                        if(answer.first_name === res[i].first_name) {
                            selectedEmployeeId = res[i].id;
                        }
                    };
                    selectManager();
                });
            }
        )
    }

    function selectManager () {
        connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title
            FROM employee
            INNER JOIN role ON employee.role_id = role.id;`,
            (err, res) => {
                if (err) throw err;
                let managerArr = [];
                for(i=0;i<res.length;i++) {
                    if(res[i].title.toLowerCase().includes('manager')) {
                        managerArr.push(res[i].last_name)
                    }
                };

                let question1 = {
                     type: 'list',
                     name: 'manager_list',
                     message: 'Please choose the manager you want to update this employee manager with',
                     choices: managerArr,
                };

                inquirer.prompt(question1).then(answer => {
                    for (i=0; i<res.length; i++) {
                        if(answer.manager_list === res[i].last_name) {
                            selectedManagerId = res[i].id
                        }
                    };
                    managerUpdate();
                });
            }
        );
    };

    function managerUpdate() {
        connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
                {
                    manager_id: selectedManagerId,
                },
                {
                    id: selectedEmployeeId,
                },
            ],
            (err) => {
                if(err) throw err;
                console.log('Employee manager updated successfully!');
                init();
            }
        );
    };
};

const viewEmployeebyManager = () => {
    let managerArr= [];
    let managerId;
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title
        FROM employee
        INNER JOIN role ON employee.role_id = role.id;`,
        (err, res) => {
            if(err) throw err;
            for (i=0;i<res.length;i++) {
                if(res[i].title.toLowerCase().includes('manager')) {
                    managerArr.push(res[i].last_name);
                }
            };

            let question1 = {
                type: 'rawlist',
                message: 'Please choose which manager you want to check the employees under',
                name: 'manager_choice',
                choices: managerArr
            };

            inquirer.prompt(question1).then(answer => {
                console.log('You have selected a manager with the following last name: '+ answer.manager_choice);
                managerFirstName(answer.manager_choice);
            })
        }
    );

    function managerFirstName (manager) {
        connection.query(
            'SELECT * FROM employee where last_name=?',
            [manager],
            (err, res) => {
                if(err) throw err;
                
                let question1 = {
                    type: 'rawlist',
                    name: 'manager_first_name_choice',
                    message: 'This next choice is done in case there are managers with similar last names. If there are, please select the correct manager you would like to check based on their first name. If there is only one just press enter to continue',
                    choices () {
                        let managerFirstArr = [];
                        for(i=0;i<res.length;i++) {
                            managerFirstArr.push(res[i].first_name);
                        } return managerFirstArr;
                    },
                };

                inquirer.prompt(question1).then(answer => {
                    console.log(`Here are the employees who are under the supervision of ${answer.manager_first_name_choice} ${manager}.`)
                    for(i=0;i<res.length;i++) {
                        if (answer.manager_first_name_choice === res[i].first_name) {
                            managerId = res[i].id;
                        };
                    };
                    employeeTableCreator();
                });
            }
        );
    };

    const employeeTableCreator = () => {
        connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee
            INNER JOIN role ON employee.role_id = role.id
            WHERE employee.manager_id=?;`,
            [managerId],
            (err, res) => {
                if(err) throw err;
                console.table(res);
                init();
            }
        );
    };
};

const deleteinfo = () => {
    let question1 = {
        type: 'rawlist',
        name: 'delete_choice',
        message: 'Please select what you would like to delete',
        choices: ['Delete an employee', 'Delete a role', 'Delete a department', 'Return to previous menu']
    };

    inquirer.prompt(question1).then(answer => {
        switch(answer.delete_choice) {
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Return to previous menu':
                init();
                break;
        };
    });

    const deleteEmployee = () => {
        let employeeId;
        connection.query(
            'SELECT * FROM employee;',
            (err, res) => {
                if (err) throw err;

                let question1 = {
                    type: 'rawlist',
                    name: 'employee_choice',
                    message: 'Select the which employee you want to delete, these are all the last names of the current employees',
                    choices () {
                        const employeeArr = [];
                        for(i=0;i<res.length;i++) {
                            employeeArr.push(res[i].last_name);
                        } return employeeArr;
                    }
                };
                
                inquirer.prompt(question1).then(answer => {
                    employeeFirstName(answer.employee_choice);
                });
            }
        );

        const employeeFirstName = (employee) => {
            connection.query(
                'SELECT * FROM employee WHERE last_name=?',
                [employee],
                (err, res) => {
                    if(err) throw err;

                    let question1 = {
                        type: 'rawlist',
                        name: 'first_name',
                        message: 'This is in case there are employees with similar last name, please choose the employee you wish to delete based on their first name. If there is only one name press enter to continue',
                        choices() {
                            let employeeArr = [];
                            for(i=0;i<res.length;i++) {
                                employeeArr.push(res[i].first_name);
                            } return employeeArr;
                        }
                    };

                    inquirer.prompt(question1).then(answer => {
                        console.log(`You have selected to delete the following employee: first name: ${answer.first_name} | last name: ${employee}`);
                        for(i=0;i<res.length;i++) {
                            if(res[i].first_name === answer.first_name) {
                                employeeId = res[i].id;
                            };
                        };
                        deleteConfirmation(answer.first_name, employee);
                    });
                }
            );
        };

        const deleteConfirmation = (first_name, last_name) => {
            let question1 = {
                type: 'list',
                name: 'delete_confirmation',
                message: 'Are you sure you want to delete this employee? Once done, the selected employee will be deleted for ever.',
                choices: ['YES', 'NO']
            };

            inquirer.prompt(question1).then(answer => {
                switch (answer.delete_confirmation) {
                    case 'YES':
                        connection.query(
                            'DELETE FROM employee WHERE id=?',
                            [employeeId],
                            (err) => {
                                if(err) throw err;
                                console.log(`Employee ${first_name} ${last_name} has been successfully deleted!`);
                                init();
                            }
                        );
                        break;
                    case 'NO':
                        init();
                        break;
                }
            });
        };
    };

    const deleteRole = () => {
        let roleId;
        connection.query(
            'SELECT * FROM role;',
            (err, res) => {
                if(err) throw err;

                let question1 = {
                    type: 'rawlist',
                    name: 'role_list',
                    message: 'Please select which role you would like to delete',
                    choices() {
                        let roleArr = [];
                        for(i=0;i<res.length;i++) {
                            roleArr.push(res[i].title);
                        } return roleArr;
                    }
                };

                inquirer.prompt(question1).then(answer => {
                    for (i=0;i<res.length;i++) {
                        if(res[i].title === answer.role_list) {
                            roleId = res[i].id;
                        };
                    };
                    console.log(`You have selected: ${answer.role_list}`);
                    confirmRoleDelete(answer.role_list);
                });
            }
        );

        const confirmRoleDelete = (role) => {
            let question1 = {
                type: 'list',
                name: 'confirm',
                message: 'Are you sure you want to delete the selected role? Once deleted there is no way to undo the deletion',
                choices: ['YES', 'NO']
            };

            inquirer.prompt(question1).then(answer => {
                switch(answer.confirm) {
                    case 'YES':
                        connection.query(
                            `DELETE FROM role WHERE id=?`,
                            [roleId],
                            (err) => {
                                if (err) throw err;
                                console.log(`The following role: ${role} has been successfully deleted!`);
                                init();
                            }
                        );
                        break;
                    case 'NO':
                        init();
                        break;
                }
            });
        };
    };

    const deleteDepartment = () => {
        console.log('Hello');
    };
};