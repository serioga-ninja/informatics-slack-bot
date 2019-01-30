import LinksToPostModel, {ILinksToPostModelDocument} from '../../models/links-to-post.model';
import {ModuleTypes, PostStrategies} from '../core/Enums';
import {RegisteredModuleInstance} from '../core/RegisteredModuleInstance';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
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

function instagramInstanceFactory(moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>): RegisteredModuleInstance {

    return new RegisteredModuleInstance(
        moduleModel._id,
        function (model: IRegisteredModule<IInstagramConfiguration>) {

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
                            contentType: ModuleTypes.instagramLinks
                        }
                    }]).sample(1).then((items) => {
                        let collection: ILinksToPostModelDocument[] = items.map(item => {
                            return new LinksToPostModel(item)
                        });

                        return {
                            data: aggregationFn(collection),
                            items: collection
                        }
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
                        contentType: ModuleTypes.instagramLinks
                    }).then(items => ({
                        data: aggregationFn(items),
                        items
                    }))
            }
        }
    )
}

export default instagramInstanceFactory;
