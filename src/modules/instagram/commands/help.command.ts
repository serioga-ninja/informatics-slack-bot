import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {BaseCommand} from '../../core/commands/base-command.class';
import {baseModuleCommands} from '../../core/help-command.factories';


class HelpCommand extends BaseCommand {

    execute() {
      return Promise.resolve(<ISlackWebHookRequestBody>{
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
