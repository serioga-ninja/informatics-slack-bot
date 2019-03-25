import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/base-configure-command';
import {baseConfigureCommandsFactory} from '../../core/base-configure-commands.factory';
import {IBaseConfigurationStatic} from '../../core/configurations/base-configuration';
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
