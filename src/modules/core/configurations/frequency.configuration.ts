import {DEFAULT_RADIX} from '../../../configs/consts';
import variables from '../../../configs/variables';
import {IRegisteredModuleModelDocument} from '../../../models/registered-module.model';
import MODULES_CONFIG from '../../modules.config';
import {IBaseModuleConfiguration} from '../Interfaces';
import {BaseConfiguration, IBaseConfiguration, IConfigHelpItem} from './BaseConfiguration';

export class FrequencyConfiguration extends BaseConfiguration implements IBaseConfiguration {
  public static commandName: string = 'frequency';

  public static help(moduleName: string): IConfigHelpItem {
    return {
      title: 'Example set post frequency (minutes)',
      text: `/${variables.slack.COMMAND} ${moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${FrequencyConfiguration.commandName}=20`
    };
  }

  execute(moduleModel: IRegisteredModuleModelDocument<IBaseModuleConfiguration>): Promise<IBaseModuleConfiguration> {
    return Promise.resolve({
      frequency: parseInt(this.configValue[0], DEFAULT_RADIX)
    } as IBaseModuleConfiguration);
  }
}
