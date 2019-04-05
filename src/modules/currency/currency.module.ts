import {ModuleTypes} from '../../core/enums';
import {BaseModuleClass} from '../../core/modules/base-module.class';
import {IBaseCommandStatic} from '../../core/modules/commands/base-command.class';
import {HelpCommand} from '../../core/modules/commands/help.command';
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
