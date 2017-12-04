import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import * as Bluebird from 'bluebird';

export interface ICommandSuccess {
    response_type: 'in_channel';
    text: string;
    attachments: any[];
}

export abstract class BaseCommand {

    abstract execute(requestBody: ISlackRequestBody, args?: object): Promise<ICommandSuccess> | Bluebird<any>;
}