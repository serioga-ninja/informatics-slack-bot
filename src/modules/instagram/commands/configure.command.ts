import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/BaseConfigureCommand';
import {baseConfigureCommandsFactory} from '../../core/BaseConfigureCommands.factory';
import {ChannelIsRegistered, ModuleIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';
import {IBaseConfigurationStatic} from '../../core/configurations/BaseConfiguration';
import {ModuleTypes} from '../../core/Enums';
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
