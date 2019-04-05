import {BaseConfigureCommand, IBaseConfigureCommand} from '../../../core/modules/base-configure-command';
import {baseConfigureCommandsFactory} from '../../../core/modules/base-configure-commands.factory';
import {IBaseConfigurationStatic} from '../../../core/modules/configurations/base-configuration';
import {AddLinkConfiguration} from '../configs/add-link.configuration';
import {RemoveLinkConfiguration} from '../configs/remove-link.configuration';
import instagramEmitter from '../instagram.emitter';

interface IInstagramLinksConfig {
  addLinks?: string[];
  removeLinks?: string[];
  showLinks?: string[];
  frequency?: string[];
}

export class InstagramLinksConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

  emitter = instagramEmitter;

  configList: IBaseConfigurationStatic[] = [
    ...baseConfigureCommandsFactory,
    AddLinkConfiguration,
    RemoveLinkConfiguration
  ];
}
