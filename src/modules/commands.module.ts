import {ISlackRequestBody} from '../interfaces/i-slack-request-body';
import poltavaNewsModule from './poltava-news/poltava-news.module';
import {BaseModuleClass} from './BaseModule.class';
import slackAppModule from './slack-apps/slack-app.module';

const MODULES_LIST = {
    'slack-app': slackAppModule,
    'poltava-news': poltavaNewsModule
};

export class CommandsModule {

    static getModule(commandStringArr: string[]): BaseModuleClass {
        let [command, moduleName] = commandStringArr;

        return MODULES_LIST[moduleName] === undefined ? MODULES_LIST['slack-app'] : MODULES_LIST[moduleName];
    }

    static getCommand(commandStringArr: string[]): string {

        return commandStringArr.length === 1 ? commandStringArr[0] : commandStringArr[2] || 'register';
    }

    static collectArguments(commandStringArr: string[]): object {
        return {};
    }

    private parse(commandString: string): Promise<{ module: BaseModuleClass, command: string; args: object }> {
        return new Promise((resolve, reject) => {
            let commandStringArr = commandString.split(' ');

            let module = CommandsModule.getModule(commandStringArr);
            let command = CommandsModule.getCommand(commandStringArr);
            let args = CommandsModule.collectArguments(commandStringArr);

            resolve({module, command, args});
        });
    }

    public execute(commandString: string, requestBody: ISlackRequestBody) {
        return this.parse(commandString)
            .then(({module, command, args}) => module.execute(requestBody, command, args))
            .catch(error => {
                return error.getSlackJson();
            });
    }
}

let commandsModule = new CommandsModule();

export default commandsModule;