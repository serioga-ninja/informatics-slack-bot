import variables from '../../../configs/variables';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {BaseCommand} from '../../core/base-command.class';
import {ChannelNotRegistered} from '../../core/command-decorators';
import {baseModuleCommands} from '../../core/help-command.factories';


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
