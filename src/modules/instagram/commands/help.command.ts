import variables from '../../../configs/variables';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelNotRegistered} from '../../core/CommandDecorators';
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

const helpCommand = new HelpCommand();

export default helpCommand;
