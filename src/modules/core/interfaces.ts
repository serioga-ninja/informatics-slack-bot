import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';

export interface IConfigurationList<T> {

    [key: string]: (requestBody: ISlackRequestBody, data?: T) => Promise<ISlackWebhookRequestBodyAttachment[]>;

}