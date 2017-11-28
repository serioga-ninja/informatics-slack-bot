import {BaseCommand, ICommandSuccess} from '../../BaseCommand.class';
import RegisteredAppModel from '../../../models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChanelNotRegisteredError, InformaticsSlackBotBaseError, ModuleAlreadyRegisteredError} from '../../Errors';
import {ModuleTypes} from '../../../enums/module-types';
import {RegisteredModuleModel} from '../../../models/registered-module.model';
import {PoltavaNewsService} from '../poltava-news.service';

export class PoltavaNewsRegistrationCommand extends BaseCommand {

    validate(requestBody: ISlackRequestBody) {
        return RegisteredAppModel
            .find({'incoming_webhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length === 0) {
                    throw new ChanelNotRegisteredError();
                }

                return RegisteredModuleModel
                    .findOne({module_type: ModuleTypes.poltavaNews, chanel_id: requestBody.channel_id})
                    .then(model => {
                        if (model) {
                            throw new ModuleAlreadyRegisteredError();
                        }
                    })
            })
    }

    execute(requestBody: ISlackRequestBody): Promise<ICommandSuccess> {
        return this
            .validate(requestBody)
            .then(() => {
                return RegisteredAppModel
                    .find({'incoming_webhook.channel_id': requestBody.channel_id})
                    .then(collection => {
                        let registeredAppModelDocument = collection[0];

                        return PoltavaNewsService
                            .registerNewChannel(requestBody.channel_id, registeredAppModelDocument.incoming_webhook.url)
                            .then(moduleModel => {
                                registeredAppModelDocument.modules.push(moduleModel._id);

                                return registeredAppModelDocument.save();
                            });
                    })
            })
            .then((data) => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: 'Success!'
                }
            })
            .catch((error: InformaticsSlackBotBaseError) => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: error.name
                }
            });
    }
}