import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelNotRegistered} from '../../core/CommandDecorators';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import variables from '../../../configs/variables';
import {baseModuleCommands} from '../../core/HelpCommand.factories';


class HelpCommand extends BaseCommand {

    execute() {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: '',
            attachments: [
                ...baseModuleCommands('instagram-links')
            ]
        });
    }
}

let helpCommand = new HelpCommand();

export default helpCommand;