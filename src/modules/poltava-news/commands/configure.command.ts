import {IBaseModuleConfiguration} from '../../../interfaces/i-registered-module';
import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/BaseConfigureCommand';
import {baseConfigureCommandsFactory} from '../../core/BaseConfigureCommands.factory';
import {ChannelIsRegistered, SimpleCommandResponse, ValidateConfigs} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import {IConfigurationList} from '../../core/Interfaces';
import MODULES_CONFIG from '../../modules.config';
import poltavaNewsEmitter from '../poltava-news.emitter';

interface IInstagramLinksConfig {
    frequency: string[];
}

const configActions: IConfigurationList<string[], IBaseModuleConfiguration> = {
    ...baseConfigureCommandsFactory()
};


class PoltavaNewsConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

    moduleName = MODULES_CONFIG.MODULES.POLTAVA_NEWS;

    emitter = poltavaNewsEmitter;

    configList = configActions;

    moduleType = ModuleTypes.PoltavaNews;

    @ChannelIsRegistered
    @ValidateConfigs(configActions)
    @SimpleCommandResponse
    execute(...args) {
        return super.execute.apply(poltavaNewsConfigureCommand, args);
    }
}

const poltavaNewsConfigureCommand = new PoltavaNewsConfigureCommand();

export default poltavaNewsConfigureCommand;
