import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import {ModuleTypes} from '../core/enums';
import {IBaseModuleConfiguration} from '../core/interfaces';
import {RegisteredModuleInstance} from '../core/registered-moduleInstance';

const aggregationFn = (collection: ILinksToPostModelDocument[]): ISlackWebhookRequestBody => <ISlackWebhookRequestBody>{
  text: '',
  attachments: collection.map((model) => (<ISlackWebhookRequestBodyAttachment>{
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
