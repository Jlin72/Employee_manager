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
        choices:['View all employees', 'View all employees by department', 'View all employees by role', 'Add department', 'Add employee', 'Add roles', 'Update employee role', 'Upadate an employee manager', 'EXIT']
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

// const updateManager = () => {
//     connection.query(
//         'SELECT * FROM employee;',
//         (err,res) => {
//             if(err) throw err;
//             let employeeArr = [];
//             for(i=0;i<res.length;i++) {
//                 employeeArr.push(res[i].last_name);
//             };
            
//             let question1 = {
//                 type: 'rawlist',
//                 name: 'employee_choice',
//                 message: 'Choose for which employee you want to update their manager',
//                 choices: employeeArr
//             };


//         }
//     );
// };