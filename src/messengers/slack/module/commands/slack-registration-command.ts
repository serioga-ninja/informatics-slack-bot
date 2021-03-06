import variables from '../../../../configs/variables';
import {BaseCommand} from '../../../../core/modules/commands/base-command.class';
import {Validation} from '../../../../core/validation';
import {IInfo} from '../../../../interfaces/i-info';
import {ISlackRequestBody} from '../../models/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../models/i-slack-web-hook-request-body';
import {SlackHelper} from '../../slack.helper';

export class ChanelAlreadyRegisteredError extends Error {
  constructor() {
    super('ChanelAlreadyRegisteredError');

    Object.setPrototypeOf(this, ChanelAlreadyRegisteredError.prototype);
  }
}

export class SlackRegistrationCommand extends BaseCommand {
  public static readonly commandName: string = 'init';

  public static info(): IInfo[] {
    return [{
      title: 'Init app in the chanel',
      text: `/${variables.SLACK.COMMAND} ${SlackRegistrationCommand.commandName}`
    }];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    await Validation.channelNotRegistered(requestBody.channel_id);
  }

  execute(requestBody: ISlackRequestBody, args: string[]) {
    return Promise.resolve(<ISlackWebHookRequestBody>{
      response_type: 'in_channel',
      text: '',
      attachments: [
        {
          title_link: SlackHelper.authorizeUrl(requestBody),
          title: 'Click to init',
          image_url: 'https://platform.slack-edge.com/img/add_to_slack.png'
        }
      ]
    });
  }
}

