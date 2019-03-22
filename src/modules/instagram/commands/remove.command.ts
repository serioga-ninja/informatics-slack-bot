import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {BaseCommand} from '../../core/base-command.class';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/command-decorators';
import {ModuleTypes} from '../../core/enums';
import {RegisteredModulesService} from '../../core/modules.service';

class InstagramLinksRemoveCommand extends BaseCommand {

    @ChannelIsRegistered
    @ChannelIsActivated(ModuleTypes.InstagramLinks)
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody): Promise<any> {
        return RegisteredModulesService
            .deactivateModuleByChannelId(ModuleTypes.InstagramLinks, requestBody.channel_id)
            .then((model) => RegisteredModulesService.stopModuleInstance(model._id));
    }
}

const instagramLinksRemoveCommand = new InstagramLinksRemoveCommand();

export default instagramLinksRemoveCommand;
