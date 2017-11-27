import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';

export interface ICommandErrors {
    text: string;
}

export interface ICommandSuccess {
    response_type: 'in_channel';
    text: string;
    attachments: any[];
}

export abstract class BaseCommand {
    abstract name: string;
    abstract args: string[];

    abstract validate(requestBody: ISlackRequestBody): Promise<void>;

    abstract execute(requestBody: ISlackRequestBody): Promise<ICommandSuccess>;
}