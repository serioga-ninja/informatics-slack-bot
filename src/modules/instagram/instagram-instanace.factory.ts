import {PostStrategies} from '../core/Enums';
import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import InstagramLinkModel, {IInstagramLinkModelDocument} from './models/instagram-link.model';
import {IRegisteredModuleModelDocument} from '../slack-apps/models/registered-module.model';

function aggregationFn(collection: IInstagramLinkModelDocument[]): ISlackWebhookRequestBody {
    return <ISlackWebhookRequestBody>{
        text: '',
        attachments: collection.map(model => (<ISlackWebhookRequestBodyAttachment>{
            title_link: model.imagePageUrl,
            image_url: model.imageUrl,
            title: model.imagePageUrl
        }))
    };
}

function instagramInstanceFactory(moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>): RegisteredModuleInstance {

    return new RegisteredModuleInstance(
        moduleModel._id,
        function (model: IRegisteredModule<IInstagramConfiguration>) {

            switch (model.configuration.postStrategy) {
                case PostStrategies.RandomSingle:
                    return InstagramLinkModel.aggregate({
                        $match: {
                            postedChannels: {
                                $nin: [model.chanelId]
                            },
                            instChanelId: {
                                $in: model.configuration.links
                            }
                        }
                    }).sample(1).then((items) => {
                        let collection: IInstagramLinkModelDocument[] = items.map(item => {
                            return new InstagramLinkModel(item)
                        });

                        return {
                            data: aggregationFn(collection),
                            items: collection
                        }
                    });
                case PostStrategies.AsSoonAsPossible:
                default:
                    return InstagramLinkModel.find({
                        postedChannels: {
                            $nin: [model.chanelId]
                        },
                        instChanelId: {
                            $in: model.configuration.links
                        }
                    }).then(items => ({
                        data: aggregationFn(items),
                        items
                    }))
            }
        }
    )
}

export default instagramInstanceFactory;