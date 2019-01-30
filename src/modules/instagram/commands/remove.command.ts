import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import {RegisteredModulesService} from '../../core/Modules.service';

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

const instagramLinksRemoveCommand = new InstagramLinksRemoveCommand();

export default instagramLinksRemoveCommand;
