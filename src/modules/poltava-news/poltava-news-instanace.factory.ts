import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';
import PoltavaNewsModel, {IPoltavaNewsModelDocument} from './models/poltava-news.model';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import {IRegisteredModuleModelDocument} from '../slack-apps/models/registered-module.model';

function aggregationFn(collection: IPoltavaNewsModelDocument[]): ISlackWebhookRequestBody {
    return <ISlackWebhookRequestBody>{
        text: '',
        attachments: collection.map(model => (<ISlackWebhookRequestBodyAttachment>{
            title_link: model.link,
            image_url: model.imageUrl,
            title: model.title
        }))
    };
}

function poltavaNewsInstanceFactory(moduleModel: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance {
    return new RegisteredModuleInstance(
        moduleModel._id,
        function (model: IRegisteredModule<any>) {
            return PoltavaNewsModel.find({
                postedChannels: {$nin: [model.chanelId]}
            }).then(items => ({
                data: aggregationFn(items),
                items
            }))
        }
    )
}

export default poltavaNewsInstanceFactory;