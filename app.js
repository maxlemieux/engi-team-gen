const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');
const render = require('./lib/htmlRenderer');

const displayBrand = () => {
  console.log(chalk.yellow(figlet.textSync('engi-team-gen', { horizontalLayout: 'full' })))
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

const employees = [];

const employeeQuestions = [
  { message: `Enter this employee's name:`,
    name: 'name',
  },
  { message: `Enter the ID number for this employee:`,
    name: 'id',
  },
  { message: `Enter email address for this employee:`,
    name: 'email',
  }
];

const addTeamMember = () => {
  inquirer
  .prompt([{ type: 'list',
    message: `What type of employee would you like to add?`,
    name: 'employeeType',
    choices: [`Engineer`, `Intern`, `I don't want to add any more team members`]
  }])
  .then(addEmployee => {
    switch(addEmployee.employeeType) {
      case "Engineer":
        addEngineer();
        break;
      case "Intern":
        addIntern();
        break;
      default:  /* don't add any more employees, just render */
        render(employees);
        break;
    }
  });
};

const addManager = () => {
  inquirer
  .prompt([ ...employeeQuestions,
    { 
      message: `Enter the office number for this manager:`,
      name: 'officeNumber'
    }
  ])
  .then(data => {
    manager = new Manager();
    manager.name = data.name;
    manager.id = data.id;
    manager.email = data.email;
    manager.officeNumber = data.officeNumber;
    employees.push(manager);
  })
  .then( () => {
    addTeamMember();
  });
}

const addEngineer = () => {
  inquirer
  .prompt([ ...employeeQuestions,
    { 
      message: `Enter the github username for this engineer:`,
      name: 'github'
    }
  ])
  .then(data => {
    engineer = new Engineer();
    engineer.name = data.name;
    engineer.id = data.id;
    engineer.email = data.email;
    engineer.github = data.github;
    employees.push(engineer);
  })  
  .then( () => {
    addTeamMember();
  });
}

const addIntern = () => {
  inquirer
  .prompt([ ...employeeQuestions,
    { 
      message: `Enter the school for this intern:`,
      name: 'school'
    }
  ])
  .then(data => {
    intern = new Intern();
    intern.name = data.name;
    intern.id = data.id;
    intern.email = data.email;
    intern.school = data.school;
    employees.push(intern);
  })
  .then( () => {
    addTeamMember();
  });
}

//prompt the user for information

const buildTeamPage = () => {
  addManager();
}

function init() {
  displayBrand();
  buildTeamPage();
};

init();
