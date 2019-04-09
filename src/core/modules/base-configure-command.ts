import variables from '../../configs/variables';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../db/models/registered-module.model';
import {IInfo} from '../../interfaces/i-info';
import {ISlackRequestBody} from '../../messengers/slack/interfaces/i-slack-request-body';
import {Validation} from '../../messengers/slack/validation';
import {LoggerService} from '../../services/logger.service';
import {UnknownConfigError} from '../errors';
import {IBaseModuleConfiguration} from '../interfaces';
import {simpleSuccessAttachment} from '../utils';

import {CONFIG_HAS_CHANGED} from './commands';
import {BaseCommand, IBaseCommand} from './commands/base-command.class';
import {ICommandAttachment, ICommandResult} from './commands/models';
import {IBaseConfigurationStatic} from './configurations/base-configuration';
import EventEmitter = NodeJS.EventEmitter;

export interface IBaseConfigureCommand<T> extends IBaseCommand {
  emitter: EventEmitter;
  configList: IBaseConfigurationStatic[];
}

export abstract class BaseConfigureCommand<T> extends BaseCommand implements IBaseConfigureCommand<T> {
  public static readonly requireArgs: boolean = true;
  public static readonly commandName: string = 'config';

  abstract emitter: EventEmitter;
  abstract configList: IBaseConfigurationStatic[];

  protected logService = new LoggerService('BaseConfigureCommand');

  public static info(moduleName: string): IInfo[] {
    return [{
      title: 'Configure module',
      text: `/${variables.slack.COMMAND} ${moduleName} ${BaseConfigureCommand.commandName} [key1=value1,value2,value3 key2=value2...]`
    }];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    await Validation.channelRegistered(requestBody.channel_id);
    await Validation.moduleRegistered(requestBody.channel_id, this.module.moduleType);
  }

  async execute(requestBody: ISlackRequestBody, configs: T): Promise<ICommandResult> {
    let attachments: ICommandAttachment[] = [];

    const moduleModel: IRegisteredModuleModelDocument<any> = await RegisteredModuleModel
      .findOne({chanelId: requestBody.channel_id, moduleType: this.module.moduleType});

    for (const key of Object.keys(configs)) {
      const ConfigStatic = this.configList.find((ConfigStatic: IBaseConfigurationStatic) => ConfigStatic.commandName === key);

      if (!ConfigStatic) {
        throw new UnknownConfigError(key);
      }

      const config = new ConfigStatic(configs[key]);
      config.parse();
      config.validate();
      const configuration: IBaseModuleConfiguration = await config.execute(moduleModel);

      moduleModel.set({
        ...moduleModel.configuration,
        configuration
      });

      attachments = attachments.concat(simpleSuccessAttachment());
      await moduleModel.save();
    }

    this.logService.info('Config is done');
    this.emitter.emit(CONFIG_HAS_CHANGED, requestBody.channel_id);

    return <ICommandResult>{attachments};
  }

  help() {
    return Promise.resolve(<ICommandResult>{
      response_type: 'in_channel',
      text: '',
      attachments: [
        {
          title: 'Usage',
          text: `/${variables.slack.COMMAND} ${this.module.moduleName} ${BaseConfigureCommand.commandName} [key1=value1 key2=key2value1,key2value1 ...]`
        },
        {
          title: 'Config list',
          text: this.configList
            .map((Config) => Config.commandName)
            .join('|')
        },
        ...this.configList.map((Config) => Config.help(this.module.moduleName, BaseConfigureCommand.commandName))
      ]
    });
  }

}
