import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import InstagramLinkModel, {IInstagramLinkModelDocument} from './models/instagram-link.model';
import {IRegisteredModuleModelDocument} from '../slack-apps/models/registered-module.model';

function instagramInstanceFactory(moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>): RegisteredModuleInstance {

    return new RegisteredModuleInstance(
        moduleModel._id,
        InstagramLinkModel,
        function (collection: IInstagramLinkModelDocument[]): Promise<ISlackWebhookRequestBody | null> {
            return Promise.resolve(<ISlackWebhookRequestBody>{
                text: '',
                attachments: collection.map(model => (<ISlackWebhookRequestBodyAttachment>{
                    title_link: model.imageUrl,
                    image_url: model.imageUrl,
                    title: model.instChanelId
                }))
            });
        },
        function (model: IRegisteredModule<IInstagramConfiguration>) {
            return {
                postedChannels: {
                    $nin: [model.chanelId]
                },
                instChanelId: {
                    $in: model.configuration.links
                }
            }
        }
    )
}

export default instagramInstanceFactory;