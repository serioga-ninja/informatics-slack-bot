import {DEFAULT_RADIX} from '../../../configs/consts';
import variables from '../../../configs/variables';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {PostStrategies} from '../../enums';
import {InvalidConfigValueError} from '../../errors';
import {IBaseModuleConfiguration} from '../../interfaces';

import {BaseConfiguration, IBaseConfiguration, IConfigHelpItem} from './base-configuration';

export class PostStrategyConfiguration extends BaseConfiguration implements IBaseConfiguration {
  public static commandName: string = 'postStrategy';

  private postStrategy: number;

  public static help(moduleName: string, configName: string): IConfigHelpItem {
    return {
      title: `Example set post strategy. Available: As soon as possible = 1, Random and single = 2`,
      text: `/${variables.SLACK.COMMAND} ${moduleName} ${configName} ${PostStrategyConfiguration.commandName}=2`
    };
  }

  parse(): void {
    this.postStrategy = parseInt(this.configValue[0], DEFAULT_RADIX);
  }

  validate(): void {
    if ([PostStrategies.AsSoonAsPossible, PostStrategies.RandomSingle].indexOf(this.postStrategy) === -1) {
      throw new InvalidConfigValueError(PostStrategyConfiguration.commandName);
    }
  }

  execute(moduleModel: IRegisteredModuleModelDocument<IBaseModuleConfiguration>): Promise<IBaseModuleConfiguration> {

    return Promise.resolve({
      postStrategy: this.postStrategy
    } as IBaseModuleConfiguration);
  }
}
