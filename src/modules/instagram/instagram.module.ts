import * as _ from 'lodash';
import 'rxjs/add/observable/interval';
import RegisteredModuleModel from '../../db/models/registered-module.model';

import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import {BaseModuleClass} from '../core/base-module.class';
import {ModuleTypes} from '../core/enums';
import {RegisteredModulesService} from '../core/modules.service';

import instagramLinksConfigureCommand from './commands/configure.command';
import helpCommand from './commands/help.command';
import instagramLinksRegistrationCommand from './commands/registration.command';
import instagramLinksRemoveCommand from './commands/remove.command';
import instagramInstanceFactory from './instagram-instanace.factory';
import instagramEmitter from './instagram.emitter';
import {InstagramLogic, IParseDataResults} from './instagram.logic';

class InstagramModule extends BaseModuleClass {
  moduleType = ModuleTypes.InstagramLinks;

  moduleName = 'InstagramModule';

  registerCommand = instagramLinksRegistrationCommand;

  removeCommand = instagramLinksRemoveCommand;

  configureCommand = instagramLinksConfigureCommand;

  helpCommand = helpCommand;

  commands = {};

  emitter = instagramEmitter;

  async collectData() {
    this.logService.info(`Collecting data`);

    const modulesCollection = await RegisteredModuleModel
      .find(<IRegisteredModule<IInstagramConfiguration>>{
        moduleType: ModuleTypes.InstagramLinks,
        isActive: true
      })
      .select('configuration.links');

    const publicList: string[] = _.uniq(
      modulesCollection
        .map((module) => module.configuration.links)
        .reduce((all: string[], current: string[]) => {
          return all.concat(current);
        }, [])
    );

    this.logService.info(`Collecting data for public`, publicList);

    const instagramPhotoParser = new InstagramLogic(publicList);

    const data: IParseDataResults[] = await instagramPhotoParser.collectData();
    const filteredData: IParseDataResults[] = await InstagramLogic.filterLinks(data);
    await InstagramLogic.saveToDB(filteredData);
  }

  preloadActiveModules() {
    return RegisteredModuleModel
      .find({
        moduleType: ModuleTypes.InstagramLinks,
        isActive: true
      })
      .then((collection) => {
        this.logService.info(`Registering ${collection.length} modules`);
        collection.forEach((module) => {
          RegisteredModulesService.startModuleInstance(instagramInstanceFactory(module));
        });
      });

  }
}

const instagramModule = new InstagramModule();
instagramModule.init();

export default instagramModule;
