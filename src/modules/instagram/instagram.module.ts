import * as _ from 'lodash';
import 'rxjs/add/observable/interval';

import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import RegisteredModuleModel, {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../interfaces/i-slack-web-hook-request-body-attachment';
import {BaseModuleSubscribe, IBaseModuleSubscribe} from '../core/base-module-subscribe';
import {IBaseCommandStatic} from '../core/commands/base-command.class';
import {HelpCommand} from '../core/commands/help.command';
import {RegistrationCommand} from '../core/commands/registration.command';
import {RemoveCommand} from '../core/commands/remove.command';
import {ModuleTypes, PostStrategies} from '../core/enums';
import {RegisteredModulesService} from '../core/modules.service';
import {RegisteredModuleInstance} from '../core/registered-moduleInstance';

import {InstagramLinksConfigureCommand} from './commands/configure.command';
import instagramEmitter from './instagram.emitter';
import {InstagramLogic, IParseDataResults} from './instagram.logic';


const aggregationFn = (collection: ILinksToPostModelDocument[]): ISlackWebHookRequestBody => <ISlackWebHookRequestBody>{
  text: '',
  attachments: collection.map((model) => (<ISlackWebHookRequestBodyAttachment>{
    title_link: model.title,
    image_url: model.contentUrl,
    title: model.title
  }))
};

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
      RegistrationCommand,
      InstagramLinksConfigureCommand
    ];
  }

  public toAttachmentFactory(module: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance {
    return new RegisteredModuleInstance(
      module._id,
      (model: IRegisteredModule<IInstagramConfiguration>) => {

        switch (model.configuration.postStrategy) {
          case PostStrategies.RandomSingle:
            return LinksToPostModel.aggregate([{
              $match: {
                postedChannels: {
                  $nin: [model.chanelId]
                },
                category: {
                  $in: model.configuration.links
                },
                contentType: ModuleTypes.InstagramLinks
              }
            }]).sample(model.configuration.limit || 1).then((items) => {
              const collection: ILinksToPostModelDocument[] = items.map((item) => {
                return new LinksToPostModel(item);
              });

              return {
                data: aggregationFn(collection),
                items: collection
              };
            });
          case PostStrategies.AsSoonAsPossible:
          default:
            return LinksToPostModel.find({
              postedChannels: {
                $nin: [model.chanelId]
              },
              category: {
                $in: model.configuration.links
              },
              contentType: ModuleTypes.InstagramLinks
            }).limit(model.configuration.limit || 1).then((items) => ({
              data: aggregationFn(items),
              items
            }));
        }
      }
    );
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
          RegisteredModulesService.startModuleInstance(this.toAttachmentFactory(module));
        });
      });

  }
}

const instagramModule = new InstagramModule();
instagramModule.init();

export default instagramModule;
