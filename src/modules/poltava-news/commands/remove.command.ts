import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/command-decorators';
import {BaseCommand} from '../../core/commands/base-command.class';
import {ModuleTypes} from '../../core/enums';
import {RegisteredModulesService} from '../../core/modules.service';

class PoltavaNewsRemoveCommand extends BaseCommand {

    @ChannelIsRegistered
    @ChannelIsActivated(ModuleTypes.PoltavaNews)
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody): Promise<any> {
        return RegisteredModulesService
            .deactivateModuleByChannelId(ModuleTypes.PoltavaNews, requestBody.channel_id)
            .then((model) => RegisteredModulesService.stopModuleInstance(model._id));
    }
}

const poltavaNewsRemoveCommand = new PoltavaNewsRemoveCommand();

export default poltavaNewsRemoveCommand;
