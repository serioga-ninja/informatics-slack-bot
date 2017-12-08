import {ISlackRequestBody} from '../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../interfaces/i-slack-webhook-request-body';
import MODULES_CONFIG from '../modules/modules.config';
import poltavaNewsModule from '../modules/poltava-news/poltava-news.module';
import {BaseModuleClass} from '../modules/core/BaseModule.class';
import slackAppModule from '../modules/slack-apps/slack-app.module';
import instagramModule from '../modules/instagram/instagram.module';
import {InstagramCommand} from '../typings';
import {LogService} from './log.service';

const MODULES_LIST = {
    'app': slackAppModule,
    [MODULES_CONFIG.MODULES.POLTAVA_NEWS]: poltavaNewsModule,
    [MODULES_CONFIG.MODULES.INSTAGRAM_LINKS]: instagramModule
};

let logService = new LogService('CommandsService');

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
        if (commandStringArr[1] !== MODULES_CONFIG.COMMANDS.CONFIGURE
            || (commandStringArr[1] === MODULES_CONFIG.COMMANDS.CONFIGURE && commandStringArr.length <= 2)) {
            return {};
        }
        let [module, command, ...configArgs] = commandStringArr;

        return configArgs.reduce((all: string[], current: string) => {
            let [key, value] = current.split('=');
            key = key
                .split('-')
                .map((keyPart, index) => index === 0 ? keyPart : keyPart[0].toUpperCase() + keyPart.slice(1))
                .join('');

            all[key] = (value || '').split(',').map(link => link.replace(/ /, ''))

            return all;
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

    public execute(commandString: string, requestBody: ISlackRequestBody): Promise<ISlackWebhookRequestBody> {
        return this.parse(commandString)
            .then(({module, command, args}) => module.execute(requestBody, command, args))
            .catch(error => {
                logService.error(error);

                return <ISlackWebhookRequestBody>{
                    text: 'error',
                    attachments: [
                        {
                            title: error.name,
                            text: error.stack,
                            color: '#a60200'
                        }
                    ]
                }
            });
    }
}

let commandsModule = new CommandsService();

export default commandsModule;