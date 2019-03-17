import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../models/links-to-post.model';
import {IRegisteredModuleModelDocument} from '../../models/registered-module.model';
import {ModuleTypes} from '../core/Enums';
import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';

const aggregationFn = (collection: ILinksToPostModelDocument[]): ISlackWebhookRequestBody => <ISlackWebhookRequestBody>{
    text: '',
    attachments: collection.map((model) => (<ISlackWebhookRequestBodyAttachment>{
        title_link: model.contentUrl,
        image_url: model.contentUrl,
        title: model.title
    }))
};

const poltavaNewsInstanceFactory = (moduleModel: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance => new RegisteredModuleInstance(
    moduleModel._id,
    (model: IRegisteredModule<any>) => LinksToPostModel.find({
        postedChannels: {$nin: [model.chanelId]},
        contentType: ModuleTypes.PoltavaNews
    }).then((items) => ({
        data: aggregationFn(items),
        items
    }))
);

export default poltavaNewsInstanceFactory;
