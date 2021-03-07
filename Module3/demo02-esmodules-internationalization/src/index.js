import database from './../database.json';
import Person from './person.js';
import TerminalController from './terminalController.js';

const DEFAULT_LANGUAGE = 'pt-BR';
const STOP_TERM = ':q';

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANGUAGE);

async function mainLoop() {
  try {
    const answer = await terminalController.question();

    if (answer === STOP_TERM) {
      terminalController.closeTerminal();
      console.log("Process finished!");
    }

    const person = Person.generateInstance(answer);
    console.log(person.formatted(DEFAULT_LANGUAGE))

    return mainLoop();
  } catch (error) {
    console.log("DEU RUIM!!!", error);
    return mainLoop();
  }
}

await mainLoop();

