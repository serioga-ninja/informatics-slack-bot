import 'rxjs/add/observable/interval';

import RegisteredModuleModel from '../../db/models/registered-module.model';
import {BaseModuleClass} from '../core/base-module.class';
import {ModuleTypes} from '../core/enums';
import {RegisteredModulesService} from '../core/modules.service';

import poltavaNewsConfigureCommand from './commands/configure.command';
import helpCommand from './commands/help.command';
import latestCommand from './commands/latest.command';
import poltavaNewsRegistrationCommand from './commands/registration.command';
import poltavaNewsRemoveCommand from './commands/remove.command';
import poltavaNewsInstanceFactory from './poltava-news-instanace.factory';
import poltavaNewsEmitter from './poltava-news.emitter';
import {PoltavaNewsService} from './poltava-news.service';

const URLS = [
  'https://poltava.to/rss/news.xml'
];

class PoltavaNewsModule extends BaseModuleClass {
  moduleType = ModuleTypes.PoltavaNews;

  moduleName = 'PoltavaNewsModule';

  registerCommand = poltavaNewsRegistrationCommand;

  removeCommand = poltavaNewsRemoveCommand;

  helpCommand = helpCommand;

  configureCommand = poltavaNewsConfigureCommand;

  commands = {};

  emitter = poltavaNewsEmitter;

  constructor() {
    super();

    this.commands = {
      latest: latestCommand
    };
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
          RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(module));
        });
      });

  }
}

const poltavaNewsModule = new PoltavaNewsModule();
poltavaNewsModule.init();

export default poltavaNewsModule;
