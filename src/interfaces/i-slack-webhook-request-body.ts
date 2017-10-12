import {ISlackWebhookRequestBodyAttachment} from './i-slack-webhook-request-body-attachment';

export interface ISlackWebhookRequestBody {
    text: string;
    attachments?: ISlackWebhookRequestBodyAttachment[];
}