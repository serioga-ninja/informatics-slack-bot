import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/BaseConfigureCommand';
import {baseConfigureCommandsFactory} from '../../core/BaseConfigureCommands.factory';
import {ChannelIsRegistered, SimpleCommandResponse, ValidateConfigs} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import MODULES_CONFIG from '../../modules.config';
import {IConfigurationList} from '../../core/Interfaces';
import poltavaNewsEmitter from '../poltava-news.emitter';

interface IInstagramLinksConfig {
    frequency: string[];
}

const configActions: IConfigurationList<string[]> = {
    ...baseConfigureCommandsFactory(ModuleTypes.poltavaNews)
};


class PoltavaNewsConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

    moduleName = MODULES_CONFIG.MODULES.POLTAVA_NEWS;

    emitter = poltavaNewsEmitter;

    configList = configActions;

    @ChannelIsRegistered
    @ValidateConfigs(configActions)
    @SimpleCommandResponse
    execute(...args) {
        return super.execute.apply(poltavaNewsConfigureCommand, args);
    }
}

let poltavaNewsConfigureCommand = new PoltavaNewsConfigureCommand();

export default poltavaNewsConfigureCommand;