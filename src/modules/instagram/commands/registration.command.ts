import {BaseCommand, ICommandSuccess} from '../../core/BaseCommand.class';
import RegisteredAppModel from '../../slack-apps/models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChanelNotRegisteredError, InformaticsSlackBotBaseError} from '../../core/Errors';
import {ModuleTypes} from '../../../enums/module-types';
import {RegisteredModulesService} from '../../core/Modules.service';
import instagramInstanceFactory from '../instagram-instanace.factory';

class PoltavaNewsRegistrationCommand extends BaseCommand {

    validate(requestBody: ISlackRequestBody) {
        return RegisteredAppModel
            .find({'incoming_webhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length === 0) {
                    throw new ChanelNotRegisteredError();
                }
            })
    }

    execute(requestBody: ISlackRequestBody): Promise<ICommandSuccess> {
        return this
            .validate(requestBody)
            .then(() => {
                return RegisteredModulesService
                    .moduleIsExists(ModuleTypes.poltavaNews, requestBody.channel_id)
                    .then(exists => {
                        if (exists) {
                            return RegisteredModulesService
                                .activateModuleByChannelId(ModuleTypes.poltavaNews, requestBody.channel_id)
                                .then(moduleModel => RegisteredModulesService.startModuleInstance(instagramInstanceFactory(moduleModel)))
                        }

                        return RegisteredAppModel
                            .find({'incoming_webhook.channel_id': requestBody.channel_id})
                            .then(collection => {
                                let registeredAppModelDocument = collection[0];

                                return RegisteredModulesService
                                    .saveNewModule(requestBody.channel_id, registeredAppModelDocument.incoming_webhook.url)
                                    .then(moduleModel => {
                                        registeredAppModelDocument.modules.push(moduleModel._id);

                                        registeredAppModelDocument.save();
                                        return RegisteredModulesService
                                            .startModuleInstance(instagramInstanceFactory(moduleModel))
                                    });
                            })
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
                    text: error.message
                }
            });
    }
}

let poltavaNewsRegistrationCommand = new PoltavaNewsRegistrationCommand();

export default poltavaNewsRegistrationCommand;