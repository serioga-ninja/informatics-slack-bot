import variables from '../../../configs/variables';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../messengers/slack/interfaces/i-slack-request-body';

import {BaseCommand} from './base-command.class';
import {ICommandResult} from './models';


export class HelpCommand extends BaseCommand {
  public static readonly commandName: string = 'help';

  public static info(moduleName: string): IInfo[] {
    return [
      {
        title: 'Usage',
        text: `/${variables.slack.COMMAND} ${moduleName === 'app' ? '' : moduleName} ${HelpCommand.commandName}`
      }
    ];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    return Promise.resolve();
  }

  execute() {

    return Promise.resolve(<ICommandResult>{
      response_type: 'in_channel',
      text: '',
      attachments: [
        {
          title: 'Usage',
          text: `/${variables.slack.COMMAND} ${this.module.moduleName === 'app' ? '[:module-name]' : this.module.moduleName} [:command] [:args]`
        },
        ...this.module.commands.reduce((all, command) => all.concat(command.info(this.module.moduleName)), [])
      ]
    });
  }
}
