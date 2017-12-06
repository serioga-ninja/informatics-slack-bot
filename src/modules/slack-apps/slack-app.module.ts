import {BaseModuleClass} from '../core/BaseModule.class';
import slackBotRegistrationCommand from './commands/registration.command';
import commandInProgress from './commands/in-progress';
import helpCommand from './commands/help.command';

class SlackAppModule extends BaseModuleClass {

    moduleName = 'SlackAppModule';

    routerClass: any;

    registerCommand = slackBotRegistrationCommand;

    removeCommand = commandInProgress;

    helpCommand = helpCommand;

    commands = {};

    init() {
    }

    collectData() {
        return Promise.resolve();
    }

    preloadActiveModules(): Promise<any> {
        return Promise.resolve();
    }
}

let slackAppModule = new SlackAppModule();

export default slackAppModule;