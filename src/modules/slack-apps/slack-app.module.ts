import {BaseModuleClass} from '../core/BaseModule.class';
import slackBotRegistrationCommand from './commands/registration.command';

class SlackAppModule extends BaseModuleClass {

    routerClass: any;

    registerCommand = slackBotRegistrationCommand;

    removeCommand = slackBotRegistrationCommand;

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