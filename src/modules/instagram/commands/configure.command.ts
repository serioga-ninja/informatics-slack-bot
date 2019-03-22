import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/base-configure-command';
import {baseConfigureCommandsFactory} from '../../core/base-configure-commands.factory';
import {ChannelIsRegistered, ModuleIsRegistered, SimpleCommandResponse} from '../../core/command-decorators';
import {IBaseConfigurationStatic} from '../../core/configurations/base-configuration';
import {ModuleTypes} from '../../core/enums';
import MODULES_CONFIG from '../../modules.config';
import {AddLinkConfiguration} from '../configs/add-link.configuration';
import {RemoveLinkConfiguration} from '../configs/remove-link.configuration';
import instagramEmitter from '../instagram.emitter';

interface IInstagramLinksConfig {
  addLinks?: string[];
  removeLinks?: string[];
  showLinks?: string[];
  frequency?: string[];
}

class InstagramLinksConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

  moduleName = MODULES_CONFIG.MODULES.INSTAGRAM_LINKS;

  emitter = instagramEmitter;

  configList: IBaseConfigurationStatic[] = [
    ...baseConfigureCommandsFactory,
    AddLinkConfiguration,
    RemoveLinkConfiguration
  ];

  moduleType = ModuleTypes.InstagramLinks;

  @ChannelIsRegistered
  @ModuleIsRegistered(ModuleTypes.InstagramLinks)
  @SimpleCommandResponse
  execute(...args) {
    return super.execute.apply(instagramLinksConfigureCommand, args);
  }
}

const instagramLinksConfigureCommand = new InstagramLinksConfigureCommand();

export default instagramLinksConfigureCommand;
