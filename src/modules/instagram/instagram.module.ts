import * as _ from 'lodash';
import 'rxjs/add/observable/interval';
import {ModuleTypes} from '../../core/enums';
import {BaseModuleSubscribe, IBaseModuleSubscribe} from '../../core/modules/base-module-subscribe';
import {IBaseCommandStatic} from '../../core/modules/commands/base-command.class';
import {HelpCommand} from '../../core/modules/commands/help.command';
import {RemoveCommand} from '../../core/modules/commands/remove.command';
import {RecurringModulesService} from '../../core/modules/modules.service';
import RegisteredModuleModel from '../../db/models/registered-module.model';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';

import {InstagramLinksConfigureCommand} from './commands/configure.command';
import {InstagramRegistrationCommand} from './commands/instagram-registration-command';
import instagramEmitter from './instagram.emitter';
import {InstagramLogic, IParseDataResults} from './instagram.logic';
import {InstagramSlackRecurringModule} from './recurring-modules/slack.recurring-module';

class InstagramModule extends BaseModuleSubscribe implements IBaseModuleSubscribe {
  moduleType = ModuleTypes.InstagramLinks;

  moduleName = 'instagram';

  commands: IBaseCommandStatic[];

  emitter = instagramEmitter;

  constructor() {
    super();

    this.commands = [
      HelpCommand,
      RemoveCommand,
      InstagramRegistrationCommand,
      InstagramLinksConfigureCommand
    ];
  }

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
          // TODO: change this by switching between different recurring modules
          RecurringModulesService.startModuleInstance(new InstagramSlackRecurringModule(module._id));
        });
      });

  }
}

const instagramModule = new InstagramModule();
instagramModule.init();

export default instagramModule;
