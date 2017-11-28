import {BaseCommand, ICommandSuccess} from './BaseCommand.class';
import {Router} from 'express';
import {RouterClass} from '../classes/router.class';
import {ISlackRequestBody} from '../interfaces/i-slack-request-body';

export abstract class BaseModuleClass {

    public router: Router;

    abstract routerClass: RouterClass;

    abstract registerCommand: BaseCommand;

    abstract commands: { [key: string]: BaseCommand };

    constructor() {
        this.router = Router();
        this.init();
    }

    abstract init(): void;

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