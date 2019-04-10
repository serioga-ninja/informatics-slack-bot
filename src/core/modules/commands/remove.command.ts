import variables from '../../../configs/variables';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../messengers/slack/models/i-slack-request-body';
import {ModuleQueries} from '../module-queries';
import {RecurringModulesService} from '../modules.service';

import {BaseCommand} from './base-command.class';

export class RemoveCommand extends BaseCommand {
  public static readonly commandName: string = 'remove';

  public static info(moduleName: string): IInfo[] {
    return [{
      title: 'Remove module',
      text: `/${variables.slack.COMMAND} ${moduleName} ${RemoveCommand.commandName}`
    }];
  }

  async execute(requestBody: ISlackRequestBody): Promise<any> {
    const model = await ModuleQueries.deactivateModuleByChannelId(this.module.moduleType, requestBody.channel_id);

    RecurringModulesService.stopModuleInstance(model._id);
  }
}
