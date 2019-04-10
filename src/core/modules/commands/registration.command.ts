import variables from '../../../configs/variables';
import RegisteredAppModel from '../../../db/models/registered-app.model';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../messengers/slack/models/i-slack-request-body';
import {Validation} from '../../../messengers/slack/validation';
import {ModuleQueries} from '../module-queries';
import {RecurringModulesService} from '../modules.service';
import {RecurringModuleInstance} from '../recurring-moduleInstance';

import {BaseCommand} from './base-command.class';

export abstract class RegistrationCommand extends BaseCommand {
  public static readonly commandName: string = 'init';

  public static info(moduleName: string): IInfo[] {
    return [{
      title: 'Init module in the chanel',
      text: `/${variables.slack.COMMAND} ${moduleName} ${RegistrationCommand.commandName}`
    }];
  }

  abstract getRecurringClass(module: IRegisteredModuleModelDocument<any>): RecurringModuleInstance;

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    await Validation.channelRegistered(requestBody.channel_id);
  }

  async execute(requestBody: ISlackRequestBody): Promise<any> {
    const exists: boolean = await ModuleQueries.moduleIsExists(this.module.moduleType, requestBody.channel_id);
    let moduleModel: IRegisteredModuleModelDocument<any>;

    if (!exists) {
      const registeredAppModelDocument = await RegisteredAppModel
        .findOne({'incomingWebhook.channel_id': requestBody.channel_id});

      moduleModel = await ModuleQueries.saveNewModule(
        requestBody.channel_id,
        registeredAppModelDocument.incomingWebhook.url,
        this.module.moduleType,
        requestBody.channel_name
      );

      registeredAppModelDocument.modules.push(moduleModel._id);

      await registeredAppModelDocument.save();
    } else {
      moduleModel = await ModuleQueries
        .activateModuleByChannelId(this.module.moduleType, requestBody.channel_id);
    }

    RecurringModulesService.startModuleInstance(this.getRecurringClass(moduleModel));
  }
}

