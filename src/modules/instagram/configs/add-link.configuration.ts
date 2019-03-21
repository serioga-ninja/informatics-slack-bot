import * as _ from 'lodash';
import variables from '../../../configs/variables';
import {IInstagramConfiguration} from '../../../interfaces/i-registered-module';
import {IRegisteredModuleModelDocument} from '../../../models/registered-module.model';
import {BaseConfiguration, IBaseConfiguration, IConfigHelpItem} from '../../core/configurations/BaseConfiguration';
import MODULES_CONFIG from '../../modules.config';

export class AddLinkConfiguration extends BaseConfiguration<IInstagramConfiguration> implements IBaseConfiguration<IInstagramConfiguration> {
  public static commandName: string = 'add-links';

  protected instagramChannels: string[];

  public static help(moduleName: string): IConfigHelpItem {
    return {
      title: 'Example add instagram public',
      text: `/${variables.slack.COMMAND} ${moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${AddLinkConfiguration.commandName}=inst_cat_public1,inst_cat_public2`
    };
  }

  parse(): void {
    this.instagramChannels = this.configValue;
  }

  execute(moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>): Promise<IInstagramConfiguration> {
    const configuration: IInstagramConfiguration = moduleModel.configuration;
    let links = (configuration.links || [])
      .concat(this.instagramChannels)
      .map((link) => link.split('/').slice(-1)[0]);

    links = _.uniq(links);

    return Promise.resolve({
      links
    } as IInstagramConfiguration);
  }
}
