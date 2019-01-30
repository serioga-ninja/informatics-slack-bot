import {Router} from 'express';
import 'rxjs/add/observable/interval';
import {Observable} from 'rxjs/Observable';
import {RouterClass} from '../../api/Router.class';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {LogService} from '../../services/log.service';
import MODULES_CONFIG from '../modules.config';
import commandInProgress from '../slack-apps/commands/in-progress';
import {BaseCommand} from './BaseCommand.class';

const PRELOAD_DATA_FREQUENCY = 600000;

const CALL_HELP_ON_EMPTY_ARGS_COMMANDS = [
    MODULES_CONFIG.COMMANDS.CONFIGURE
];

export abstract class BaseModuleClass {

    public router: Router;

    protected logService: LogService;

    abstract moduleName: string;

    abstract routerClass: RouterClass;

    // informatics-slack-bot [:moduleName] init
    abstract registerCommand: BaseCommand = commandInProgress;

    // informatics-slack-bot [:moduleName] remove
    abstract removeCommand: BaseCommand = commandInProgress;

    // informatics-slack-bot [:moduleName] [:help]
    abstract helpCommand: BaseCommand = commandInProgress;

    // informatics-slack-bot [:moduleName] config
    public configureCommand: BaseCommand = commandInProgress;

    abstract commands: { [key: string]: BaseCommand };

    constructor() {
        this.router = Router();
    }

    init(): void {
        this.logService = new LogService(this.moduleName);

        Observable
            .interval(PRELOAD_DATA_FREQUENCY)
            .subscribe(() => {
                this.collectData();
            });

        this.collectData()
            .then(() => this.preloadActiveModules());
    }

    abstract collectData(publicList?: string[]): Promise<any>;

    abstract preloadActiveModules(): Promise<any>;

    execute(requestBody: ISlackRequestBody, command: string, args?: object): Promise<ISlackWebhookRequestBody> {
        let executableCommand: BaseCommand;

        switch (command) {
            case MODULES_CONFIG.COMMANDS.INIT:
                executableCommand = this.registerCommand;
                break;
            case MODULES_CONFIG.COMMANDS.REMOVE:
                executableCommand = this.removeCommand;
                break;
            case MODULES_CONFIG.COMMANDS.CONFIGURE:
                executableCommand = this.configureCommand;
                break;
            case MODULES_CONFIG.COMMANDS.HELP:
                executableCommand = this.helpCommand;
                break;
            default:
                executableCommand = this.commands[command];
        }

        if (CALL_HELP_ON_EMPTY_ARGS_COMMANDS.indexOf(command) !== -1 && Object.keys(args).length === 0) {
            return executableCommand
                .help();
        }

        return executableCommand
            .execute(requestBody, args);
    }

}
