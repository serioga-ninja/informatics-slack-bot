import {BaseCommand} from '../../core/BaseCommand.class';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ModuleTypes} from '../../../enums/module-types';
import {RegisteredModulesService} from '../../core/Modules.service';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';

class InstagramLinksRemoveCommand extends BaseCommand {

    @ChannelIsRegistered
    @ChannelIsActivated(ModuleTypes.instagramLinks)
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody): Promise<any> {
        return RegisteredModulesService
            .deactivateModuleByChannelId(ModuleTypes.instagramLinks, requestBody.channel_id)
            .then((model) => RegisteredModulesService.stopModuleInstance(model._id));
    }
}

let instagramLinksRemoveCommand = new InstagramLinksRemoveCommand();

export default instagramLinksRemoveCommand;