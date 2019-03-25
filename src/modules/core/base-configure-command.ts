import variables from '../../configs/variables';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../db/models/registered-module.model';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../interfaces/i-slack-web-hook-request-body-attachment';
import {LoggerService} from '../../services/logger.service';
import MODULES_CONFIG from '../modules.config';
import {CONFIG_HAS_CHANGED} from './commands';

import {BaseCommand, IBaseCommand} from './commands/base-command.class';
import {IBaseConfigurationStatic} from './configurations/base-configuration';
import {ModuleTypes} from './enums';
import {UnknownConfigError} from './errors';
import {IBaseModuleConfiguration} from './interfaces';
import {simpleSuccessAttachment} from './utils';
import EventEmitter = NodeJS.EventEmitter;

export interface IBaseConfigureCommand<T> extends IBaseCommand {
  moduleName: string;
  emitter: EventEmitter;
  configList: IBaseConfigurationStatic[];
}

export abstract class BaseConfigureCommand<T> extends BaseCommand implements IBaseConfigureCommand<T> {

  abstract moduleName: string;
  abstract emitter: EventEmitter;
  abstract configList: IBaseConfigurationStatic[];
  abstract moduleType: ModuleTypes;

  protected logService = new LoggerService('BaseConfigureCommand');

  async execute(requestBody: ISlackRequestBody, configs: T): Promise<ISlackWebHookRequestBody> {
    let attachments: ISlackWebHookRequestBodyAttachment[] = [];

    const moduleModel: IRegisteredModuleModelDocument<any> = await RegisteredModuleModel
      .findOne({chanelId: requestBody.channel_id, moduleType: this.moduleType});

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

    return <ISlackWebHookRequestBody>{attachments};
  }

  help() {
    return Promise.resolve(<ISlackWebHookRequestBody>{
      response_type: 'in_channel',
      text: '',
      attachments: [
        {
          title: 'Usage',
          text: `/${variables.slack.COMMAND} ${this.moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} [key1=value1 key2=key2value1,key2value1 ...]`
        },
        {
          title: 'Config list',
          text: this.configList
            .map((Config) => Config.commandName)
            .join('|')
        },
        ...this.configList.map((Config) => Config.help(this.moduleName))
      ]
    });
  }

}
