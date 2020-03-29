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

const clearOutput = () => {
  /* https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console
     Escape sequence to clear the screen on the console. 
     Strict mode complains about this octal literal. */
  process.stdout.write('\033c');
}

/* Show a header when the app is launched */
const displayBrand = () => {
  console.log(chalk.yellow(figlet.textSync('engi-team-gen', { horizontalLayout: 'full' })));
}

/* Empty placeholder for employee objects */
const employees = [];

/* Questions which are common to all employee entries */
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

/* Add employees to team, or write output if finished adding employees */
const addTeamMember = () => {
  clearOutput();
  console.log(chalk.white(figlet.textSync('Add another team member:', { font: 'Small Slant', horizontalLayout: 'full' })));

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
      default:  /* don't add any more employees, just render output */
        const renderedHtml = render(employees);
        fs.writeFile(outputPath, renderedHtml, function (err) {
          if (err) throw err;
          clearOutput();
          console.log(chalk.white(figlet.textSync('All done!', { font: 'Small Slant', horizontalLayout: 'full' })));
          console.log(`Saved team page to ${outputPath}. Thanks for using engi-team-gen!`);
        });
        break;
    }
  });
};

/* Add manager to team */
const addManager = () => {
  console.log(chalk.magenta(figlet.textSync('Add a Manager:', { font: 'Small Slant', horizontalLayout: 'full' })));
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

/* Add engineer to team */
const addEngineer = () => {
  clearOutput();
  console.log(chalk.blue(figlet.textSync('Add an Engineer:', { font: 'Small Slant', horizontalLayout: 'full' })));

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

/* Add intern to team */
const addIntern = () => {
  clearOutput();
  console.log(chalk.green(figlet.textSync('Add an Intern:', { font: 'Small Slant', horizontalLayout: 'full' })));
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

/* Build the team. Simple wrapper on addManager which calls addTeamMember on completion. */
const buildTeamPage = () => {
  addManager();
}

/* Show the branding and launch interactive prompts. */
function init() {
  clearOutput();
  displayBrand();
  buildTeamPage();
};

/* Run the app! */
init();
