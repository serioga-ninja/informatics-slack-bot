import {ISlackWebHookRequestBodyAttachment} from './i-slack-web-hook-request-body-attachment';

export interface ISlackWebHookRequestBody {
  response_type?: 'in_channel' | 'ephemeral';
  text: string;
  attachments?: ISlackWebHookRequestBodyAttachment[];
}
