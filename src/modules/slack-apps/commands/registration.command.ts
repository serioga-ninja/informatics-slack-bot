import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {SlackHelper} from '../../../slack/slack.helper';
import {ChannelNotRegistered} from '../../core/command-decorators';
import {BaseCommand} from '../../core/commands/base-command.class';

export class ChanelAlreadyRegisteredError extends Error {
  constructor() {
    super('ChanelAlreadyRegisteredError');

    Object.setPrototypeOf(this, ChanelAlreadyRegisteredError.prototype);
  }
}


class RegistrationCommand extends BaseCommand {

  @ChannelNotRegistered
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

const slackBotRegistrationCommand = new RegistrationCommand();

export default slackBotRegistrationCommand;
