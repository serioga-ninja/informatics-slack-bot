import * as qs from 'querystring';

import variables from '../../../configs/variables';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/base-command.class';
import {ChannelNotRegistered} from '../../core/command-decorators';

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
                    title_link: `https://slack.com/oauth/authorize?${qs.stringify({
                        scope: 'incoming-webhook,commands',
                        client_id: variables.slack.CLIENT_ID,
                        redirect_uri: `http://${variables.domainUrl}/api/v1/events/oauth-callback`,
                        team: requestBody.team_id
                    })}`,
                    title: 'Click to init',
                    image_url: 'https://platform.slack-edge.com/img/add_to_slack.png'
                }
            ]
        });
    }


}

const slackBotRegistrationCommand = new RegistrationCommand();

export default slackBotRegistrationCommand;
