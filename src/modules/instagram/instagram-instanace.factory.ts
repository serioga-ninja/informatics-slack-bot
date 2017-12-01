import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import InstagramLinkModel, {IInstagramLinkModelDocument} from './models/instagram-link.model';

function instagramInstanceFactory(moduleModel: IRegisteredModule<IInstagramConfiguration>): RegisteredModuleInstance {
    return new RegisteredModuleInstance(
        moduleModel,
        InstagramLinkModel,
        function (collection: IInstagramLinkModelDocument[]): Promise<ISlackWebhookRequestBody | null> {
            return Promise.resolve(<ISlackWebhookRequestBody>{
                text: '',
                attachments: collection.map(model => (<ISlackWebhookRequestBodyAttachment>{
                    title_link: model.image_url,
                    image_url: model.image_url,
                    title: model.inst_chanel_link
                }))
            });
        }
    )
}

export default instagramInstanceFactory;