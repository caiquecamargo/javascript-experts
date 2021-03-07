import Draftlog from 'draftlog';
import chalk from 'chalk';
import chalktable from 'chalk-table';
import readline from 'readline';
import Person from './person.js';

export default class TerminalController {

  constructor() {
    this.print = {};
    this.data = {};
  }

  initializeTerminal(database, language) {
    Draftlog(console).addLineListener(process.stdin);
    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    this.initializeTable(database, language);
  }

  initializeTable(database, language) {
    this.data = database.map(person => new Person(person).formatted(language));
    const table = chalktable(this.getTableOptions(), this.data);
    this.print = console.draft(table);
  }

  closeTerminal() {
    this.terminal.close();
  }

  question(msg = '') {
    return new Promise(resolve => this.terminal.question(msg, resolve));
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: chalk.cyan("ID") },
        { field: "vehicles", name: chalk.magenta("Vehicles") },
        { field: "kmTraveled", name: chalk.red("Km Traveled") },
        { field: "from", name: chalk.greenBright("From") },
        { field: "to", name: chalk.yellow("To") },
      ]
    }
  }
}