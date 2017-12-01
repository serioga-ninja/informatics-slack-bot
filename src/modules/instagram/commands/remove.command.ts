import {BaseCommand, ICommandSuccess} from '../../core/BaseCommand.class';
import RegisteredAppModel from '../../slack-apps/models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {
    ChanelNotRegisteredError, InformaticsSlackBotBaseError,
    ModuleNotExistsError
} from '../../core/Errors';
import {ModuleTypes} from '../../../enums/module-types';
import {RegisteredModulesService} from '../../core/Modules.service';

 class PoltavaNewsRemoveCommand extends BaseCommand {

    validate(requestBody: ISlackRequestBody) {
        return RegisteredAppModel
            .find({'incoming_webhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length === 0) {
                    throw new ChanelNotRegisteredError();
                }

                return RegisteredModulesService
                    .moduleIsExists(ModuleTypes.poltavaNews, requestBody.channel_id)
                    .then(exists => {
                        if (!exists) {
                            throw new ModuleNotExistsError();
                        }
                    })
            })
    }

    execute(requestBody: ISlackRequestBody): Promise<ICommandSuccess> {
        return this
            .validate(requestBody)
            .then(() => {
                return RegisteredModulesService
                    .deactivateModuleByChannelId(requestBody.channel_id)
                    .then((model) => RegisteredModulesService.stopModuleInstance(model._id));
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

let poltavaNewsRemoveCommand = new PoltavaNewsRemoveCommand();

export default poltavaNewsRemoveCommand;