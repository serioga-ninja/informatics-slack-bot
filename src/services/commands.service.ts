import {ISlackRequestBody} from '../interfaces/i-slack-request-body';
import poltavaNewsModule from '../modules/poltava-news/poltava-news.module';
import {BaseModuleClass} from '../modules/core/BaseModule.class';
import slackAppModule from '../modules/slack-apps/slack-app.module';
import instagramModule from '../modules/instagram/instagram.module';
import {InstagramCommand} from '../typings';

const MODULES_LIST = {
    'app': slackAppModule,
    'poltava-news': poltavaNewsModule,
    'instagram-links': instagramModule
};

export class CommandsService {

    static getModule(commandStringArr: string[]): BaseModuleClass {
        let [moduleName] = commandStringArr;

        return MODULES_LIST[moduleName];
    }

    static getCommand(commandStringArr: string[]): InstagramCommand {
        let command = commandStringArr[1];

        return <InstagramCommand>command || 'help';
    }

    static collectArguments(commandStringArr: string[]): object {
        if (commandStringArr[1] !== 'config' || (commandStringArr[1] === 'config' && commandStringArr.length <= 2)) {
            return {};
        }
        let [module, command, ...configArgs] = commandStringArr;

        return configArgs.reduce((all: string[], current: string) => {
            let [key, value] = current.split('=');
            key = key
                .split('-')
                .map((keyPart, index) => index === 0 ? keyPart : keyPart[0].toUpperCase() + keyPart.slice(1))
                .join('');

            return {
                [key]: value.split(',').map(link => link.replace(/ /, ''))
            }
        }, {});
    }

    private parse(commandString: string): Promise<{ module: BaseModuleClass, command: string; args: object }> {
        return new Promise((resolve, reject) => {
            let commandStringArr = commandString.split(' ');

            // if module has not been set we set it to the default one
            if (MODULES_LIST[commandStringArr[0]] === undefined) {
                commandStringArr = ['app'].concat(commandStringArr);
            }

            let module = CommandsService.getModule(commandStringArr);
            let command = CommandsService.getCommand(commandStringArr);
            let args = CommandsService.collectArguments(commandStringArr);

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

let commandsModule = new CommandsService();

export default commandsModule;