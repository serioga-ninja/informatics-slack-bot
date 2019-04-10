import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../messengers/slack/models/i-slack-request-body';
import {Validation} from '../../../messengers/slack/validation';
import {LoggerService} from '../../../services/logger.service';
import {IBaseModuleSubscribe} from '../base-module-subscribe';
import {IBaseModuleClass} from '../base-module.class';

import {ICommandResult} from './models';

export interface IBaseCommandStatic {
  readonly commandName: string;
  readonly requireArgs: boolean;

  info(moduleName: string): IInfo[];

  new(module: IBaseModuleClass | IBaseModuleSubscribe): IBaseCommand;
}

export interface IBaseCommand {
  execute(...args: any[]): Promise<ICommandResult>;
  execute(requestBody: ISlackRequestBody, args?: any): Promise<ICommandResult>;
  validate(requestBody: ISlackRequestBody): Promise<void>;
  help(): Promise<ICommandResult>;
}

export abstract class BaseCommand implements IBaseCommand {

  public static readonly requireArgs: boolean = false;

  protected logService = new LoggerService('BaseCommand');

  constructor(protected module: IBaseModuleClass | IBaseModuleSubscribe) {
  }

  abstract execute(requestBody: ISlackRequestBody, args?: any): Promise<ICommandResult>;

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    await Validation.channelRegistered(requestBody.channel_id);
    await Validation.moduleRegistered(requestBody.channel_id, this.module.moduleType);
  }

  help(): Promise<ICommandResult> {
    return Promise.resolve(<ICommandResult>{
      text: 'Not Implemented',
      attachments: []
    });
  }
}
