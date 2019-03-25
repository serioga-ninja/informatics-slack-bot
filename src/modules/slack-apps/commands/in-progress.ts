import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {BaseCommand} from '../../core/base-command.class';

class CommandInProgress extends BaseCommand {

    execute(requestBody: ISlackRequestBody, args: string[]) {
      return Promise.resolve(<ISlackWebHookRequestBody>{
            response_type: 'in_channel',
            text: 'This command is in progress.',
            attachments: []
        });
    }
}

const commandInProgress = new CommandInProgress();

export default commandInProgress;
