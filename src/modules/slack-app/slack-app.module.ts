import {BaseModuleClass} from '../core/base-module.class';
import {IBaseCommandStatic} from '../core/commands/base-command.class';
import {HelpCommand} from '../core/commands/help.command';
import {ModuleTypes} from '../core/enums';
import {ModulesListCommand} from './commands/modules-list.command';
import {SlackRegistrationCommand} from './commands/slack-registration-command';

class SlackAppModule extends BaseModuleClass {
  moduleType = ModuleTypes.SlackApp;

  moduleName = 'app';

  commands: IBaseCommandStatic[];

  constructor() {
    super();

    this.commands = [
      HelpCommand,
      SlackRegistrationCommand,
      ModulesListCommand
    ];
  }
}

const slackAppModule = new SlackAppModule();

export default slackAppModule;
