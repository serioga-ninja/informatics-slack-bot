import {ISlackWebhookRequestBodyAttachment} from './i-slack-webhook-request-body-attachment';

export interface ISlackWebhookRequestBody {
    response_type?: 'in_channel';
    text?: string;
    attachments?: ISlackWebhookRequestBodyAttachment[];
}
