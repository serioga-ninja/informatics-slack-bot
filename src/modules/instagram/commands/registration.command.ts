import {BaseCommand} from '../../core/BaseCommand.class';
import {ModuleTypes} from '../../core/Enums';
import RegisteredAppModel from '../../../models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {RegisteredModulesService} from '../../core/Modules.service';
import instagramInstanceFactory from '../instagram-instanace.factory';
import {ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';

class InstagramLinksRegistrationCommand extends BaseCommand {

    @ChannelIsRegistered
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody): Promise<any> {
        return RegisteredModulesService
            .moduleIsExists(ModuleTypes.instagramLinks, requestBody.channel_id)
            .then(exists => {
                if (exists) {
                    return RegisteredModulesService
                        .activateModuleByChannelId(ModuleTypes.instagramLinks, requestBody.channel_id)
                        .then(moduleModel => RegisteredModulesService.startModuleInstance(instagramInstanceFactory(moduleModel)))
                }

                return RegisteredAppModel
                    .find({'incomingWebhook.channel_id': requestBody.channel_id})
                    .then(collection => {
                        let registeredAppModelDocument = collection[0];

                        return RegisteredModulesService
                            .saveNewModule(requestBody.channel_id, registeredAppModelDocument.incomingWebhook.url, ModuleTypes.instagramLinks)
                            .then(moduleModel => {
                                registeredAppModelDocument.modules.push(moduleModel._id);

                                registeredAppModelDocument.save();
                                return RegisteredModulesService
                                    .startModuleInstance(instagramInstanceFactory(moduleModel))
                            });
                    })
            })
    }
}

let instagramLinksRegistrationCommand = new InstagramLinksRegistrationCommand();

export default instagramLinksRegistrationCommand;