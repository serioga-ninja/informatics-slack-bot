import variables from '../../../configs/variables';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import MODULES_LIST from '../../../slack/available-modules.list';
import {BaseCommand} from '../../core/commands/base-command.class';

export class ModulesListCommand extends BaseCommand {
  public static readonly commandName: string = 'list';

  public static info(): IInfo[] {
    return [{
      title: 'List the available modules',
      text: `/${variables.slack.COMMAND} ${ModulesListCommand.commandName}`
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

