import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {BaseCommand} from '../../core/base-command.class';
import {ChannelIsActivated, ChannelIsRegistered, SimpleCommandResponse} from '../../core/command-decorators';
import {ModuleTypes} from '../../core/enums';
import {RegisteredModulesService} from '../../core/modules.service';

class CurrencyRemoveCommand extends BaseCommand {

    @ChannelIsRegistered
    @ChannelIsActivated(ModuleTypes.PoltavaNews)
    @SimpleCommandResponse
    async execute(requestBody: ISlackRequestBody): Promise<any> {
        const model = await RegisteredModulesService
            .deactivateModuleByChannelId(ModuleTypes.Currency, requestBody.channel_id);

        return RegisteredModulesService.stopModuleInstance(model._id);
    }
}

const currencyRemoveCommand = new CurrencyRemoveCommand();

export default currencyRemoveCommand;
