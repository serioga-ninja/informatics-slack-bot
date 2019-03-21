import * as _ from 'lodash';
import 'rxjs/add/observable/interval';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';

import RegisteredModuleModel from '../../models/registered-module.model';
import {BaseModuleClass} from '../core/BaseModule.class';
import {ModuleTypes} from '../core/Enums';
import {RegisteredModulesService} from '../core/Modules.service';
import instagramLinksConfigureCommand from './commands/configure.command';
import helpCommand from './commands/help.command';
import instagramLinksRegistrationCommand from './commands/registration.command';
import instagramLinksRemoveCommand from './commands/remove.command';
import instagramInstanceFactory from './instagram-instanace.factory';
import instagramEmitter from './instagram.emitter';
import {InstagramService, IParseDataResults} from './instagram.service';

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

    const instagramPhotoParser = new InstagramService(publicList);

    const data: IParseDataResults[] = await instagramPhotoParser.collectData();
    const filteredData: IParseDataResults[] = await InstagramService.filterLinks(data);
    await InstagramService.saveToDB(filteredData);
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
