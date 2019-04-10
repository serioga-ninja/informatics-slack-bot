import * as fs from 'fs';
import * as path from 'path';
import {Observable} from 'rxjs/Observable';
import {DEFAULT_RADIX} from '../../configs/consts';
import {DateTimeHelper} from '../../core/date-time.helper';
import {ModuleTypes} from '../../core/enums';
import {BaseModuleClass} from '../../core/modules/base-module.class';
import {IBaseCommandStatic} from '../../core/modules/commands/base-command.class';
import {HelpCommand} from '../../core/modules/commands/help.command';
import {UsdCommand} from './commands/usd.command';

const IMAGE_MAX_DAYS = 2;
const DAY = 86400000;

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

  init(): void {
    super.init();

    // remove old images every day
    Observable
      .interval(DAY)
      .subscribe(() => {
        fs.readdir(path.join(process.cwd(), 'public', 'images'), (err, files: string[]) => {
          for (const fileName of files) {
            const [dateCreated] = fileName.split('.');
            console.log(new DateTimeHelper(new Date()).diffDays(parseInt(dateCreated, DEFAULT_RADIX)));
            if (new DateTimeHelper(new Date()).diffDays(parseInt(dateCreated, DEFAULT_RADIX)) < IMAGE_MAX_DAYS) {
              continue;
            }

            fs.unlinkSync(path.join(process.cwd(), 'public', 'images', fileName));
            this.logService.info(`${fileName} removed`);
          }
        });
      });
  }
}

const currencyModule = new CurrencyModule();
currencyModule.init();

export default currencyModule;
