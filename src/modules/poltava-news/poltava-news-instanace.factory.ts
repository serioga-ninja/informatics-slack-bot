import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../interfaces/i-slack-web-hook-request-body-attachment';
import {ModuleTypes} from '../core/enums';
import {IBaseModuleConfiguration} from '../core/interfaces';
import {RegisteredModuleInstance} from '../core/registered-moduleInstance';

const aggregationFn = (collection: ILinksToPostModelDocument[]): ISlackWebHookRequestBody => <ISlackWebHookRequestBody>{
  text: '',
  attachments: collection.map((model) => (<ISlackWebHookRequestBodyAttachment>{
    title_link: model.contentUrl,
    image_url: model.contentUrl,
    title: model.title
  }))
};

const poltavaNewsInstanceFactory = (moduleModel: IRegisteredModuleModelDocument<IBaseModuleConfiguration>): RegisteredModuleInstance => new RegisteredModuleInstance(
  moduleModel._id,
  (model: IRegisteredModule<any>) => LinksToPostModel.find({
    postedChannels: {$nin: [model.chanelId]},
    contentType: ModuleTypes.PoltavaNews
  }).limit(moduleModel.configuration.limit).then((items) => ({
    data: aggregationFn(items),
    items
  }))
);

export default poltavaNewsInstanceFactory;
