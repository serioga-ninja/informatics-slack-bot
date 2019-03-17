import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import {RegisteredModulesService} from '../../core/Modules.service';

class CurrencyRemoveCommand extends BaseCommand {

    @ChannelIsRegistered
    @ChannelIsActivated(ModuleTypes.PoltavaNews)
    @SimpleCommandResponse
    async execute(requestBody: ISlackRequestBody): Promise<any> {
        const model = await RegisteredModulesService
            .deactivateModuleByChannelId(ModuleTypes.minFin, requestBody.channel_id);

        return RegisteredModulesService.stopModuleInstance(model._id);
    }
}

const currencyRemoveCommand = new CurrencyRemoveCommand();

export default currencyRemoveCommand;
