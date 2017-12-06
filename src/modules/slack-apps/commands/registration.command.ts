import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelNotRegistered} from '../../core/CommandDecorators';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import variables from '../../../configs/variables';

export class ChanelAlreadyRegisteredError extends Error {
    constructor() {
        super('ChanelAlreadyRegisteredError');

        Object.setPrototypeOf(this, ChanelAlreadyRegisteredError.prototype);
    }
}


class RegistrationCommand extends BaseCommand {

    @ChannelNotRegistered
    execute(requestBody: ISlackRequestBody, args: string[]) {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: '',
            attachments: [
                {
                    title_link: `https://slack.com/oauth/authorize?scope=incoming-webhook,commands&client_id=${variables.slack.CLIENT_ID}`,
                    title: 'Click to register',
                    image_url: 'https://platform.slack-edge.com/img/add_to_slack.png'
                }
            ]
        });
    }


}

let slackBotRegistrationCommand = new RegistrationCommand();

export default slackBotRegistrationCommand;