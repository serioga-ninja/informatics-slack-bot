import 'rxjs/add/observable/interval';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';

import RegisteredModuleModel, {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../interfaces/i-slack-web-hook-request-body-attachment';
import {BaseModuleSubscribe, IBaseModuleSubscribe} from '../core/base-module-subscribe';
import {IBaseCommandStatic} from '../core/commands/base-command.class';
import {HelpCommand} from '../core/commands/help.command';
import {RegistrationCommand} from '../core/commands/registration.command';
import {RemoveCommand} from '../core/commands/remove.command';
import {ModuleTypes} from '../core/enums';
import {RegisteredModulesService} from '../core/modules.service';
import {RegisteredModuleInstance} from '../core/registered-moduleInstance';

import {PoltavaNewsConfigureCommand} from './commands/configure.command';
import {LatestCommand} from './commands/latest.command';
import poltavaNewsEmitter from './poltava-news.emitter';
import {PoltavaNewsService} from './poltava-news.service';

const URLS = [
  'https://poltava.to/rss/news.xml'
];

const aggregationFn = (collection: ILinksToPostModelDocument[]): ISlackWebHookRequestBody => <ISlackWebHookRequestBody>{
  text: '',
  attachments: collection.map((model) => (<ISlackWebHookRequestBodyAttachment>{
    title_link: model.contentUrl,
    image_url: model.contentUrl,
    title: model.title
  }))
};

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
      RegistrationCommand,
      RemoveCommand,
      PoltavaNewsConfigureCommand
    ];
  }

  toAttachmentFactory(module: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance {
    return new RegisteredModuleInstance(
      module._id,
      (model: IRegisteredModule<any>) => LinksToPostModel.find({
        postedChannels: {$nin: [model.chanelId]},
        contentType: ModuleTypes.PoltavaNews
      }).limit(module.configuration.limit).then((items) => ({
        data: aggregationFn(items),
        items
      }))
    );
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
          RegisteredModulesService.startModuleInstance(this.toAttachmentFactory(module));
        });
      });

  }
}

const poltavaNewsModule = new PoltavaNewsModule();
poltavaNewsModule.init();

export default poltavaNewsModule;
