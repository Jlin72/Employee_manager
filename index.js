const inquirer = require('inquirer');
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
        type: 'list',
        name: 'init_choice',
        message: 'Please select what you would like to do today',
        choices:['View all employees', 'View all employees by department', 'View all employees by role', 'Add department', 'Add employee', 'Add roles', 'Update employee role', 'EXIT']
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
            case 'EXIT':
                console.log(`BYE, thank you for using the app`);
                connection.end();
                process.exit(0);
        }
    })
};

const viewEmployees = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
        FROM ((employee
        INNER JOIN role ON employee.role_id = role.id)
        INNER JOIN department ON role.department_id = department.id);`,
        (err, res) => {
            if (err) throw res;
            res.forEach(({id, first_name, last_name, title, name, salary}) => {
                console.table([
                    {
                        id: id,
                        first_name: first_name,
                        last_name: last_name,
                        title: title,
                        department: name, 
                        salary: salary
                    }
                ]);
            });
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
            console.log(choiceArr);
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
                type: 'list',
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
                        init();
                    }
                );
            });
        }
    );
};

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