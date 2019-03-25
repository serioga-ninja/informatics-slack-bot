import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {LoggerService} from '../../services/logger.service';

export interface IBaseCommand {
  execute(...args: any[]): Promise<ISlackWebHookRequestBody>;
  execute(requestBody: ISlackRequestBody, args?: any): Promise<ISlackWebHookRequestBody>;

  help(): Promise<ISlackWebHookRequestBody>;
}

export abstract class BaseCommand implements IBaseCommand {

    protected logService = new LoggerService('BaseCommand');

  abstract execute(requestBody: ISlackRequestBody, args?: any): Promise<ISlackWebHookRequestBody>;

  help(): Promise<ISlackWebHookRequestBody> {
    return Promise.resolve(<ISlackWebHookRequestBody>{
            text: 'Not Implemented',
            attachments: []
        });
    }

}
