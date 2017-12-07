import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {baseModuleCommands} from '../../core/HelpCommand.factories';


class HelpCommand extends BaseCommand {

    execute() {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: '',
            attachments: [
                ...baseModuleCommands('poltava-news')
            ]
        });
    }
}

let helpCommand = new HelpCommand();

export default helpCommand;