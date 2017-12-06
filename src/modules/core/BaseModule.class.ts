import {LogService} from '../../services/log.service';
import {BaseCommand, ICommandSuccess} from './BaseCommand.class';
import {Router} from 'express';
import {RouterClass} from '../../classes/router.class';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import commandInProgress from '../slack-apps/commands/in-progress';
import * as Bluebird from 'bluebird';

const PRELOAD_DATA_FREQUENCY = 1000 * 60 * 10;

export abstract class BaseModuleClass {

    public router: Router;

    protected logService: LogService;

    abstract moduleName: string;

    abstract routerClass: RouterClass;

    // informatics-slack-bot [:moduleName] register
    abstract registerCommand: BaseCommand;

    // informatics-slack-bot [:moduleName] remove
    abstract removeCommand: BaseCommand;

    // informatics-slack-bot [:moduleName] [:help]
    abstract helpCommand: BaseCommand;

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

    execute(requestBody: ISlackRequestBody, command: string, args?: object): Promise<ICommandSuccess> | Bluebird<any> {
        let executableCommand: BaseCommand;

        switch (command) {
            case 'register':
                executableCommand = this.registerCommand;
                break;
            case 'remove':
                executableCommand = this.removeCommand;
                break;
            case 'config':
                executableCommand = this.configureCommand;
                break;
            case 'help':
                executableCommand = this.helpCommand;
                break;
            default:
                executableCommand = this.commands[command];
        }

        return executableCommand
            .execute(requestBody, args);
    }

}