import {BaseModuleClass} from '../core/base-module.class';
import {IBaseCommandStatic} from '../core/commands/base-command.class';
import {HelpCommand} from '../core/commands/help.command';
import {ModuleTypes} from '../core/enums';
import {UsdCommand} from './commands/usd.command';

class CurrencyModule extends BaseModuleClass {
  moduleType = ModuleTypes.Currency;

  moduleName = 'currency';

  commands: IBaseCommandStatic[];

  constructor() {
    super();

    this.commands = [
      HelpCommand,
      UsdCommand
    ];
  }
}

const currencyModule = new CurrencyModule();

export default currencyModule;
