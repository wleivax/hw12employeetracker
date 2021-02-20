const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require('figlet');

// Connection to MySQL DB
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sqlpass1!",
  database: "emptrackdb"
});

connection.connect(function(err) {
  if (err) throw err;
  init();
});

//Title
function init(){
  figlet("HW12 Employee Tracker", function(err, data){
    if (err) throw err;
    console.log(data);
    start();
  });
}

//Initial options menu 
function start(){
  inquirer
    .prompt({
      name: "startPrompt",
      type: "list",
      message: "Welcome! Choose from the following options",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "Add Role",
        "Add Department",
        "Finish"
      ]
    })
  .then(function(answer){
    switch(answer.startPrompt) {
      case "View All Employees":
        viewAllEmpl();
        break;
      case "Add Employee":
        addEmpl();
        break;
      case "Update Employee Role":
        updateEmplRole();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Department":
        addDept();
        break;
      case "I'm done.":
        console.log("Thank you");
        return
    }
  });
}

//View employee table
function viewAllEmpl(){
  connection.query("SELECT employee.`id`, employee.`first_name`, employee.`last_name`, employee.`manager_id`, role.`title`, role.`salary`, department.`dept_name`  FROM `employee` LEFT JOIN `role` ON employee.`role_id` = role.`id` LEFT JOIN `department` on role.`department_id` = department.`id`", //rather than backtics would use question mark syntax for dynamic replacement
    function (err, res){
      let employees = [];
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        employees.push({
            "Employee ID": res[i].id,
            "First Name": res[i].first_name,
            "Last Name": res[i].last_name,
            "Title": res[i].title,
            "Salary": res[i].salary,
            "Department": res[i].dept_name,
            "Manager ID": res[i].manager_id  
        });
      }
      console.table(employees);
      start();
    });
}

//Add Employee
function addEmpl(){
  connection.query("SELECT * FROM role", function(err,res){
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?"
        },
        {
          type: "rawlist",
          name: "role",
          message: "What is this employee's role?",
          choices: function() {
            let choiceArray = [];
              for(let i = 0; i < res.length; i++){
                choiceArray.push(res[i].title);
              }
              return choiceArray;
          }
        }
      ]).then(function(answer){
        connection.query("SELECT * FROM role", function(err,res){
          let roleid = 0;
          if (err) throw err;
          for (let i = 0; i < res.length; i++) {
            if(answer.role === res[i].title){
              roleid = res[i].id;
            }
          }
          connection.query("INSERT INTO employee SET?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleid,
          },
          function(err,res){
            console.log(answer.firstName + " " + answer.lastName + " has been added.");
            start();
          }); 
        });
        
      }) 
  }); 
}
        
//Modify employee role
function updateEmplRole(){
  connection.query("SELECT * FROM employee", function(err,res){
    if (err) throw err;
    let choiceArray = [];
    for(let i = 0; i < res.length; i++){
      choiceArray.push(res[i].first_name + " " + res[i].last_name);
    }
    inquirer
      .prompt([
        {
          type: "list",
          name: "emplyUpd",
          message: "Which employee would you like to update?",
          choices: choiceArray
        },
        {
          type: "input",
          name: "emplyRole",
          message: "What is the employee's new role?"
        }
      ]).then(function(answer){
        connection.query("SELECT * FROM role", function(err,res){
          if (err) throw err;
          let roleid;
          for(let i = 0; i < res.length; i++){
            if(answer.emplyRole === res[i].title){
              roleid = res[i].id;
            }
          }
          let split = answer.emplyUpd.split(" ");
          let firstName = split[0];
          let lastName = split[1];
              connection.query("UPDATE employee SET ? WHERE ? AND ?",
              [ 
                {
                  role_id: roleid
                },
                {
                  first_name: firstName
                },
                {
                  last_name: lastName
                }
              ],
              function(err, res) {
                if (err) throw err;
              }); 
            }); 
        console.log(answer.emplyUpd + "'s role has been updated.");
        start();
      }); 
    });       
}

//Add role
function addRole(){
  connection.query("SELECT * FROM department", function(err,res){
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the role title?"
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?"
        },
        {
          type: "rawlist",
          name: "dept",
          message: "What idepartment does this role fall in?",
          choices: function() {
            let choiceArray = [];
              for(let i = 0; i < res.length; i++){
                choiceArray.push(res[i].dept_name);
              }
              return choiceArray;
          }
        }
      ]).then(function(answer){
          let deptid = 0;
          for (let i = 0; i < res.length; i++) {
            if(answer.dept === res[i].dept_name){
              deptid = res[i].id;
            }
          }
          connection.query("INSERT INTO role SET?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: deptid,
          },
          function(err,res){
            console.log(answer.title + " has been added.");
            start();
          }); 
      }) 
  }); 
}

//Add department
function addDept(){
    inquirer
      .prompt([
        {
          type: "input",
          name: "deptName",
          message: "What is the name of the Department?"
        },
      ]).then(function(answer){
          connection.query("INSERT INTO department SET?",
          {
            dept_name: answer.deptName
          },
          function(err,res){
            console.log(answer.deptName + " has been added.");
            start();
          });   
      }) 
}
