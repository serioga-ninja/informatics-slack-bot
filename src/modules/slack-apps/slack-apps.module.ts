import {RegistrationCommand} from './commands/registration';
import {BaseCommand} from './commands/base-command.class';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';

export class CommandNotFoundError extends Error {
    constructor() {
        super('Unknown command');

        Object.setPrototypeOf(this, CommandNotFoundError.prototype);
    }

    getSlackJson() {
        return {
            response_type: 'in_channel',
            text: 'Unknown command'
        }
    }
}

const COMMANDS_LIST = {
    register: RegistrationCommand
};

export class SlackAppsModule {

    private commandName: string;
    private commandArguments: string[];
    private command: BaseCommand;

    constructor(private commandString: string) {
    }

    private parse() {
        return new Promise((resolve, reject) => {
            let commandStringArr = this.commandString.split(' ');
            this.commandName = commandStringArr[0];

            if (!COMMANDS_LIST[this.commandName]) {
                reject(new CommandNotFoundError());
            }

            this.commandArguments = commandStringArr.slice(1) || [];
            this.command = new COMMANDS_LIST[this.commandName](this.commandName, this.commandArguments);

            resolve();
        });
    }

    public execute(requestBody: ISlackRequestBody) {
        return this.parse()
            .then(() => this.command.execute(requestBody))
            .catch(error => error.getSlackJson());
    }
}

export default SlackAppsModule;