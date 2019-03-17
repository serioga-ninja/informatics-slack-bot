import {BaseCommand} from '../core/BaseCommand.class';
import {BaseModuleClass} from '../core/BaseModule.class';
import commandInProgress from '../slack-apps/commands/in-progress';
import currencyHelpCommand from './commands/help.command';

class CurrencyModule extends BaseModuleClass {

  moduleName = 'CurrencyModule';

  // informatics-slack-bot [:moduleName] [:help]
  helpCommand: BaseCommand = currencyHelpCommand;

  // informatics-slack-bot [:moduleName] init
  registerCommand: BaseCommand = commandInProgress;

  // informatics-slack-bot [:moduleName] remove
  removeCommand: BaseCommand = commandInProgress;

  commands: { [key: string]: BaseCommand };

  async collectData(): Promise<any> {
  }

  async preloadActiveModules(): Promise<any> {
  }
}

const currencyModule = new CurrencyModule();

export default currencyModule;
