import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/base-configure-command';
import {baseConfigureCommandsFactory} from '../../core/base-configure-commands.factory';
import poltavaNewsEmitter from '../poltava-news.emitter';

interface IInstagramLinksConfig {
  frequency: string[];
  limit: string[];
}

export class PoltavaNewsConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

  get emitter() {
    return poltavaNewsEmitter;
  }

  get configList() {
    return [...baseConfigureCommandsFactory];
  }
}
