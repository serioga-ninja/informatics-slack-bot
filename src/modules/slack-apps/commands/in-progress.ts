import {BaseCommand, ICommandSuccess} from '../../core/BaseCommand.class';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';

class CommandInProgress extends BaseCommand {

    validate(requestBody: ISlackRequestBody) {
        return Promise.resolve();
    }

    execute(requestBody: ISlackRequestBody, args: string[]) {
        return Promise.resolve(<ICommandSuccess>{
            response_type: 'in_channel',
            text: 'This command is in progress.',
            attachments: []
        });
    }
}

let commandInProgress = new CommandInProgress();

export default commandInProgress;