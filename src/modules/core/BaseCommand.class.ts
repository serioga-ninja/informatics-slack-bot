import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import * as Bluebird from 'bluebird';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';

export abstract class BaseCommand {

    abstract execute(requestBody: ISlackRequestBody, args?: object): Promise<ISlackWebhookRequestBody>;

    help(): Promise<ISlackWebhookRequestBody> {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            text: 'Not Implemented',
            attachments: []
        })
    };

}