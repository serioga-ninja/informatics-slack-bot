import {IRegisteredModule} from '../../interfaces/i-registered-module';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../models/links-to-post.model';
import {ModuleTypes} from '../core/Enums';
import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import {IRegisteredModuleModelDocument} from '../../models/registered-module.model';

function aggregationFn(collection: ILinksToPostModelDocument[]): ISlackWebhookRequestBody {
    return <ISlackWebhookRequestBody>{
        text: '',
        attachments: collection.map(model => (<ISlackWebhookRequestBodyAttachment>{
            title_link: model.title,
            image_url: model.contentUrl,
            title: model.title
        }))
    };
}

function poltavaNewsInstanceFactory(moduleModel: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance {
    return new RegisteredModuleInstance(
        moduleModel._id,
        function (model: IRegisteredModule<any>) {
            return LinksToPostModel.find({
                postedChannels: {$nin: [model.chanelId]},
                contentType: ModuleTypes.poltavaNews
            }).then(items => ({
                data: aggregationFn(items),
                items
            }))
        }
    )
}

export default poltavaNewsInstanceFactory;