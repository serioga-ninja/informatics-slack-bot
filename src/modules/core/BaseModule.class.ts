import {BaseCommand, ICommandSuccess} from './BaseCommand.class';
import {Router} from 'express';
import {RouterClass} from '../../classes/router.class';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

const PRELOAD_DATA_FREQUENCY = 1000 * 60 * 10;

export abstract class BaseModuleClass {

    public router: Router;

    abstract routerClass: RouterClass;

    abstract registerCommand: BaseCommand;

    abstract removeCommand: BaseCommand;

    abstract commands: { [key: string]: BaseCommand };

    constructor() {
        this.router = Router();
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

    execute(requestBody: ISlackRequestBody, command: string, args?: object): Promise<{
        response_type: 'in_channel';
        text: string;
        attachments: any[];
    }> {
        let executableCommand: BaseCommand;

        switch (command) {
            case 'register':
                executableCommand = this.registerCommand;
                break;
            case 'remove':
                executableCommand = this.removeCommand;
                break;
            // case 'config':
            //     executableCommand = (...args: any[]) => Promise.resolve(<ICommandSuccess>{});
            //     break;
            default:
                executableCommand = this.commands[command];
        }

        return executableCommand
            .execute(requestBody, args);
    }

}