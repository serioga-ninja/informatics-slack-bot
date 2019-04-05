import 'rxjs/add/observable/interval';
import {ModuleTypes} from '../../core/enums';
import {BaseModuleSubscribe, IBaseModuleSubscribe} from '../../core/modules/base-module-subscribe';
import {IBaseCommandStatic} from '../../core/modules/commands/base-command.class';
import {HelpCommand} from '../../core/modules/commands/help.command';
import {RemoveCommand} from '../../core/modules/commands/remove.command';
import {RecurringModulesService} from '../../core/modules/modules.service';

import RegisteredModuleModel from '../../db/models/registered-module.model';

import {PoltavaNewsConfigureCommand} from './commands/configure.command';
import {LatestCommand} from './commands/latest.command';
import {PoltavaNewsRegistrationCommand} from './commands/poltava-news-registration-command';
import poltavaNewsEmitter from './poltava-news.emitter';
import {PoltavaNewsService} from './poltava-news.service';
import {PoltavaNewsSlackRecurringModule} from './recurring-modules/slack.recurring-module';

const URLS = [
  'https://poltava.to/rss/news.xml'
];

class PoltavaNewsModule extends BaseModuleSubscribe implements IBaseModuleSubscribe {
  moduleType = ModuleTypes.PoltavaNews;

  moduleName = 'poltava-news';

  commands: IBaseCommandStatic[];

  emitter = poltavaNewsEmitter;

  constructor() {
    super();

    this.commands = [
      LatestCommand,
      HelpCommand,
      PoltavaNewsRegistrationCommand,
      RemoveCommand,
      PoltavaNewsConfigureCommand
    ];
  }

  collectData() {
    const poltavaNewsService = new PoltavaNewsService(URLS);

    return poltavaNewsService
      .grabTheData()
      .then((data) => PoltavaNewsService.filterData(data))
      .then((data) => PoltavaNewsService.saveToDB(data));
  }

  preloadActiveModules() {
    return RegisteredModuleModel
      .find({
        moduleType: ModuleTypes.PoltavaNews,
        isActive: true
      })
      .then((collection) => {
        this.logService.info(`Registering ${collection.length} modules`);
        collection.forEach((module) => {
          // TODO: change this by switching between different recurring modules
          RecurringModulesService.startModuleInstance(new PoltavaNewsSlackRecurringModule(module.id));
        });
      });

  }
}

const poltavaNewsModule = new PoltavaNewsModule();
poltavaNewsModule.init();

export default poltavaNewsModule;
