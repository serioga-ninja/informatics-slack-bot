import {BaseCommand, ICommandSuccess} from '../../core/BaseCommand.class';
import RegisteredAppModel from '../../slack-apps/models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChanelNotRegisteredError, InformaticsSlackBotBaseError, ModuleAlreadyRegisteredError} from '../../core/Errors';
import {ModuleTypes} from '../../../enums/module-types';
import {RegisteredModulesService} from '../../core/Modules.service';
import poltavaNewsInstanceFactory from '../poltava-news-instanace.factory';
import {ChannelIsRegistered} from '../../core/CommandDecorators';

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

    @ChannelIsRegistered
    execute(requestBody: ISlackRequestBody): Promise<ICommandSuccess> {
        return RegisteredModulesService
            .moduleIsExists(ModuleTypes.poltavaNews, requestBody.channel_id)
            .then(exists => {
                if (exists) {
                    return RegisteredModulesService
                        .activateModuleByChannelId(ModuleTypes.poltavaNews, requestBody.channel_id)
                        .then(moduleModel => RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(moduleModel)))
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
                                    .startModuleInstance(poltavaNewsInstanceFactory(moduleModel))
                            });
                    })
            })
            .then((data) => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: 'Success!'
                }
            });
    }
}

let poltavaNewsRegistrationCommand = new PoltavaNewsRegistrationCommand();

export default poltavaNewsRegistrationCommand;