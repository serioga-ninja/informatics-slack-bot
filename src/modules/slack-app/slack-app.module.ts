import {ModuleTypes} from '../../core/enums';
import {BaseModuleClass} from '../../core/modules/base-module.class';
import {IBaseCommandStatic} from '../../core/modules/commands/base-command.class';
import {HelpCommand} from '../../core/modules/commands/help.command';
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
