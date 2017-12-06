import {BaseCommand} from '../../core/BaseCommand.class';
import RegisteredAppModel from '../../slack-apps/models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ModuleTypes} from '../../../enums/module-types';
import {RegisteredModulesService} from '../../core/Modules.service';
import poltavaNewsInstanceFactory from '../poltava-news-instanace.factory';
import {ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';

class PoltavaNewsRegistrationCommand extends BaseCommand {

    @ChannelIsRegistered
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody): Promise<any> {
        return RegisteredModulesService
            .moduleIsExists(ModuleTypes.poltavaNews, requestBody.channel_id)
            .then(exists => {
                if (exists) {
                    return RegisteredModulesService
                        .activateModuleByChannelId(ModuleTypes.poltavaNews, requestBody.channel_id)
                        .then(moduleModel => RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(moduleModel)))
                }

                return RegisteredAppModel
                    .find({'incomingWebhook.channel_id': requestBody.channel_id})
                    .then(collection => {
                        let registeredAppModelDocument = collection[0];

                        return RegisteredModulesService
                            .saveNewModule(requestBody.channel_id, registeredAppModelDocument.incomingWebhook.url, ModuleTypes.poltavaNews)
                            .then(moduleModel => {
                                registeredAppModelDocument.modules.push(moduleModel._id);

                                registeredAppModelDocument.save();
                                return RegisteredModulesService
                                    .startModuleInstance(poltavaNewsInstanceFactory(moduleModel))
                            });
                    })
            });
    }
}

let poltavaNewsRegistrationCommand = new PoltavaNewsRegistrationCommand();

export default poltavaNewsRegistrationCommand;