import variables from '../../../configs/variables';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {RegisteredModulesService} from '../modules.service';

import {BaseCommand} from './base-command.class';

export class RemoveCommand extends BaseCommand {
  public static readonly commandName: string = 'remove';

  public static info(moduleName: string): IInfo {
    return {
      title: 'Remove module',
      text: `/${variables.slack.COMMAND} ${moduleName} ${RemoveCommand.commandName}`
    };
  }

  async execute(requestBody: ISlackRequestBody): Promise<any> {
    const model = await RegisteredModulesService.deactivateModuleByChannelId(this.module.moduleType, requestBody.channel_id);

    RegisteredModulesService.stopModuleInstance(model._id);
  }
}
