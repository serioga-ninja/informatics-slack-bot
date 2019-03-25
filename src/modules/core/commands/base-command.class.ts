import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {LoggerService} from '../../../services/logger.service';
import {Validation} from '../../../slack/validation';
import {IBaseModuleSubscribe} from '../base-module-subscribe';
import {IBaseModuleClass} from '../base-module.class';

export interface IBaseCommandStatic {
  readonly commandName: string;
  readonly requireArgs: boolean;

  info(moduleName: string): IInfo;

  new(module: IBaseModuleClass | IBaseModuleSubscribe): IBaseCommand;
}

export interface IBaseCommand {
  execute(...args: any[]): Promise<ISlackWebHookRequestBody>;
  execute(requestBody: ISlackRequestBody, args?: any): Promise<ISlackWebHookRequestBody>;
  validate(requestBody: ISlackRequestBody): Promise<void>;
  help(): Promise<ISlackWebHookRequestBody>;
}

export abstract class BaseCommand implements IBaseCommand {

  public static readonly requireArgs: boolean = false;

  protected logService = new LoggerService('BaseCommand');

  constructor(protected module: IBaseModuleClass | IBaseModuleSubscribe) {
  }

  abstract execute(requestBody: ISlackRequestBody, args?: any): Promise<ISlackWebHookRequestBody>;

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    await Validation.channelRegistered(requestBody.channel_id);
    await Validation.moduleRegistered(requestBody.channel_id, this.module.moduleType);
  }

  help(): Promise<ISlackWebHookRequestBody> {
    return Promise.resolve(<ISlackWebHookRequestBody>{
      text: 'Not Implemented',
      attachments: []
    });
  }
}
