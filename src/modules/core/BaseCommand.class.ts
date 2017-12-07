import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';

export interface IBaseCommand {
    execute(...args: any[]): Promise<ISlackWebhookRequestBody>;
    execute(requestBody: ISlackRequestBody, args?: any): Promise<ISlackWebhookRequestBody>;

    help(): Promise<ISlackWebhookRequestBody>;
}

export abstract class BaseCommand implements IBaseCommand {

    abstract execute(requestBody: ISlackRequestBody, args?: any): Promise<ISlackWebhookRequestBody>;

    help(): Promise<ISlackWebhookRequestBody> {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            text: 'Not Implemented',
            attachments: []
        })
    };

}