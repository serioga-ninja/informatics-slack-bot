import {ISlackWebHookRequestBodyAttachment} from './i-slack-web-hook-request-body-attachment';

export interface ISlackWebHookRequestBody {
  response_type?: 'in_channel';
  text: string;
  attachments?: ISlackWebHookRequestBodyAttachment[];
}
