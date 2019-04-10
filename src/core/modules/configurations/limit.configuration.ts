import {DEFAULT_RADIX} from '../../../configs/consts';
import variables from '../../../configs/variables';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {IBaseModuleConfiguration} from '../../interfaces';

import {BaseConfiguration, IBaseConfiguration, IConfigHelpItem} from './base-configuration';

export class LimitConfiguration extends BaseConfiguration implements IBaseConfiguration {
  public static commandName: string = 'limit';

  public static help(moduleName: string, configName: string): IConfigHelpItem {
    return {
      title: 'Example set post limit (number)',
      text: `/${variables.SLACK.COMMAND} ${moduleName} ${configName} ${LimitConfiguration.commandName}=1`
    };
  }

  execute(moduleModel: IRegisteredModuleModelDocument<IBaseModuleConfiguration>): Promise<IBaseModuleConfiguration> {
    return Promise.resolve({
      limit: parseInt(this.configValue[0], DEFAULT_RADIX)
    } as IBaseModuleConfiguration);
  }
}
