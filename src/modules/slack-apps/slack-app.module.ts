import {BaseModuleClass} from '../core/base-module.class';
import {ModuleTypes} from '../core/enums';

import helpCommand from './commands/help.command';
import commandInProgress from './commands/in-progress';
import slackBotRegistrationCommand from './commands/registration.command';

class SlackAppModule extends BaseModuleClass {
  moduleType = ModuleTypes.SlackApp;

  moduleName = 'SlackAppModule';

  routerClass: any;

  registerCommand = slackBotRegistrationCommand;

  removeCommand = commandInProgress;

  helpCommand = helpCommand;

  commands = {};

  init() {
  }

  collectData() {
    return Promise.resolve();
  }

  preloadActiveModules(): Promise<any> {
    return Promise.resolve();
  }
}

const slackAppModule = new SlackAppModule();

export default slackAppModule;
