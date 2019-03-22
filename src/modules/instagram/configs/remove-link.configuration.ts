import * as _ from 'lodash';

import variables from '../../../configs/variables';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {IInstagramConfiguration} from '../../../interfaces/i-registered-module';
import {IBaseConfiguration, IConfigHelpItem} from '../../core/configurations/base-configuration';
import MODULES_CONFIG from '../../modules.config';

import {AddLinkConfiguration} from './add-link.configuration';

export class RemoveLinkConfiguration extends AddLinkConfiguration implements IBaseConfiguration<IInstagramConfiguration> {
  public static commandName: string = 'remove-links';

  public static help(moduleName: string): IConfigHelpItem {
    return {
      title: 'Example remove instagram public',
      text: `/${variables.slack.COMMAND} ${moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${RemoveLinkConfiguration.commandName}=inst_cat_public1,inst_cat_public2`
    };
  }

  execute(moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>): Promise<IInstagramConfiguration> {
    const configuration: IInstagramConfiguration = moduleModel.configuration;
    const linksToRemove = this.instagramChannels.map((link) => link.split('/').slice(-1)[0]);

    const differences = _.difference(configuration.links || [], linksToRemove);
    const links = configuration.links.filter((link) => differences.indexOf(link) !== -1);

    return Promise.resolve({
      links
    } as IInstagramConfiguration);
  }
}
