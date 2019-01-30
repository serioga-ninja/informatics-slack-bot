import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';

class CommandInProgress extends BaseCommand {

    execute(requestBody: ISlackRequestBody, args: string[]) {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: 'This command is in progress.',
            attachments: []
        });
    }
}

const commandInProgress = new CommandInProgress();

export default commandInProgress;
