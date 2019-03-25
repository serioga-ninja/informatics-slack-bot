import {DEFAULT_RADIX} from '../../../configs/consts';
import variables from '../../../configs/variables';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {IBaseModuleConfiguration} from '../interfaces';

import {BaseConfiguration, IBaseConfiguration, IConfigHelpItem} from './base-configuration';

export class FrequencyConfiguration extends BaseConfiguration implements IBaseConfiguration {
  public static commandName: string = 'frequency';

  public static help(moduleName: string, configName: string): IConfigHelpItem {
    return {
      title: 'Example set post frequency (minutes)',
      text: `/${variables.slack.COMMAND} ${moduleName} ${configName} ${FrequencyConfiguration.commandName}=20`
    };
  }

  execute(moduleModel: IRegisteredModuleModelDocument<IBaseModuleConfiguration>): Promise<IBaseModuleConfiguration> {
    return Promise.resolve({
      frequency: parseInt(this.configValue[0], DEFAULT_RADIX)
    } as IBaseModuleConfiguration);
  }
}
