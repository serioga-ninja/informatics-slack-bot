import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/base-configure-command';
import {baseConfigureCommandsFactory} from '../../core/base-configure-commands.factory';
import {ChannelIsRegistered, ModuleIsRegistered, SimpleCommandResponse} from '../../core/command-decorators';
import {ModuleTypes} from '../../core/enums';
import MODULES_CONFIG from '../../modules.config';
import poltavaNewsEmitter from '../poltava-news.emitter';

interface IInstagramLinksConfig {
  frequency: string[];
}

class PoltavaNewsConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

  moduleName = MODULES_CONFIG.MODULES.POLTAVA_NEWS;

  emitter = poltavaNewsEmitter;

  configList = [...baseConfigureCommandsFactory];

  moduleType = ModuleTypes.PoltavaNews;

  @ChannelIsRegistered
  @ModuleIsRegistered(ModuleTypes.PoltavaNews)
  @SimpleCommandResponse
  execute(...args) {
    return super.execute.apply(poltavaNewsConfigureCommand, args);
  }
}

const poltavaNewsConfigureCommand = new PoltavaNewsConfigureCommand();

export default poltavaNewsConfigureCommand;
