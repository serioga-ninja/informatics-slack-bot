import {BaseModuleClass} from '../BaseModule.class';
import slackBotRegistrationCommand from './commands/registration.command';

const POST_FREQUENCY = 1000 * 60 * 10;

const URLS = [
    'https://poltava.to/news/'
];

class SlackAppModule extends BaseModuleClass {

    routerClass: any;

    registerCommand = slackBotRegistrationCommand;

    commands = {};

    init() {
    }
}

let slackAppModule = new SlackAppModule();

export default slackAppModule;