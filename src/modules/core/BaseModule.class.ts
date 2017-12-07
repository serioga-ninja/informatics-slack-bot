import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {LogService} from '../../services/log.service';
import MODULES_CONFIG from '../modules.config';
import {BaseCommand} from './BaseCommand.class';
import {Router} from 'express';
import {RouterClass} from '../../api/Router.class';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import commandInProgress from '../slack-apps/commands/in-progress';

const PRELOAD_DATA_FREQUENCY = 1000 * 60 * 10;

const CALL_HELP_ON_EMPRY_ARGS_COMMANDS = [
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

        this.logService = new LogService(this.moduleName);
    }

    init(): void {

        Observable
            .interval(PRELOAD_DATA_FREQUENCY)
            .subscribe(() => {
                this.collectData();
            });

        this.collectData()
            .then(() => this.preloadActiveModules());
    }

    abstract collectData(): Promise<any>;

    abstract preloadActiveModules(): Promise<any>

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

        if (CALL_HELP_ON_EMPRY_ARGS_COMMANDS.indexOf(command) !== -1 && Object.keys(args).length === 0) {
            return executableCommand
                .help();
        }

        return executableCommand
            .execute(requestBody, args);
    }

}