import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/BaseConfigureCommand';
import {ModuleTypes} from '../../../enums/module-types';
import {baseConfigureCommandsFactory} from '../../core/BaseConfigureCommands.factory';
import {ChannelIsRegistered, SimpleCommandResponse, ValidateConfigs} from '../../core/CommandDecorators';
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
        return super.execute.apply(this, args);
    }
}

let poltavaNewsConfigureCommand = new PoltavaNewsConfigureCommand();

export default poltavaNewsConfigureCommand;