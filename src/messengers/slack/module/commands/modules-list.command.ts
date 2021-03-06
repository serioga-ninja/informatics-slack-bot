import variables from '../../../../configs/variables';
import {BaseCommand} from '../../../../core/modules/commands/base-command.class';
import {IInfo} from '../../../../interfaces/i-info';
import MODULES_LIST from '../../../../modules/modules.list';
import {ISlackRequestBody} from '../../models/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../models/i-slack-web-hook-request-body';

export class ModulesListCommand extends BaseCommand {
  public static readonly commandName: string = 'list';

  public static info(): IInfo[] {
    return [{
      title: 'List the available modules',
      text: `/${variables.SLACK.COMMAND} ${ModulesListCommand.commandName}`
    }];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
  }

  execute(requestBody: ISlackRequestBody, args: string[]) {
    return Promise.resolve(<ISlackWebHookRequestBody>{
      response_type: 'in_channel',
      text: '',
      attachments: [
        {
          title: 'Available modules',
          text: MODULES_LIST
            .map((module) => module.moduleName)
            .join(' | ')
        }
      ]
    });
  }
}

