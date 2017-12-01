import {RegisteredModuleInstance} from '../RegisteredModuleInstance';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import PoltavaNewsModel, {IPoltavaNewsModelDocument} from './models/poltava-news.model';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';

function poltavaNewsInstanceFactory(moduleModel: IRegisteredModule): RegisteredModuleInstance {
    return new RegisteredModuleInstance(
        moduleModel,
        PoltavaNewsModel,
        function (collection: IPoltavaNewsModelDocument[]): Promise<ISlackWebhookRequestBody | null> {
            return Promise.resolve(<ISlackWebhookRequestBody>{
                text: '',
                attachments: collection.map(model => (<ISlackWebhookRequestBodyAttachment>{
                    title_link: model.link,
                    image_url: model.imageUrl,
                    title: model.title
                }))
            });
        }
    )
}

export default poltavaNewsInstanceFactory;