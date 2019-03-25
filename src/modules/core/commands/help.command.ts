import variables from '../../../configs/variables';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {BaseCommand} from './base-command.class';


export class HelpCommand extends BaseCommand {
  public static readonly commandName: string = 'help';

  public static info(moduleName: string): IInfo {
    return {
      title: 'Usage',
      text: `/${variables.slack.COMMAND} ${moduleName === 'app' ? '' : moduleName} ${HelpCommand.commandName}`
    };
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    return Promise.resolve();
  }

  execute() {

    return Promise.resolve(<ISlackWebHookRequestBody>{
      response_type: 'in_channel',
      text: '',
      attachments: [
        {
          title: 'Usage',
          text: `/${variables.slack.COMMAND} ${this.module.moduleName === 'app' ? '[:module-name]' : this.module.moduleName} [:command] [:args]`
        },
        ...this.module.commands.map((command) => command.info(this.module.moduleName))
      ]
    });
  }
}
