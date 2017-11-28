import {ISlackRequestBody} from '../interfaces/i-slack-request-body';

export interface ICommandSuccess {
    response_type: 'in_channel';
    text: string;
    attachments: any[];
}

export abstract class BaseCommand {

    abstract validate(requestBody: ISlackRequestBody): Promise<void>;

    abstract execute(requestBody: ISlackRequestBody, args?: object): Promise<ICommandSuccess>;
}