import variables from '../../../configs/variables';
import RegisteredAppModel from '../../../db/models/registered-app.model';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {Validation} from '../../../slack/validation';
import {IBaseModuleSubscribe} from '../base-module-subscribe';
import {RegisteredModulesService} from '../modules.service';

import {BaseCommand} from './base-command.class';

export class RegistrationCommand extends BaseCommand {
  public static readonly commandName: string = 'init';

  public static info(moduleName: string): IInfo {
    return {
      title: 'Init module in the chanel',
      text: `/${variables.slack.COMMAND} ${moduleName} ${RegistrationCommand.commandName}`
    };
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    await Validation.channelRegistered(requestBody.channel_id);
  }

  async execute(requestBody: ISlackRequestBody): Promise<any> {
    const exists: boolean = await RegisteredModulesService
      .moduleIsExists(this.module.moduleType, requestBody.channel_id);
    if (exists) {
      const moduleModel: IRegisteredModuleModelDocument<any> = await RegisteredModulesService
        .activateModuleByChannelId(this.module.moduleType, requestBody.channel_id);

      RegisteredModulesService.startModuleInstance((<IBaseModuleSubscribe>this.module).toAttachmentFactory(moduleModel));
    }

    const collection = await RegisteredAppModel
      .find({'incomingWebhook.channel_id': requestBody.channel_id});
    const registeredAppModelDocument = collection[0];

    const moduleModel = await RegisteredModulesService
      .saveNewModule(requestBody.channel_id, registeredAppModelDocument.incomingWebhook.url, this.module.moduleType, requestBody.channel_name);

    registeredAppModelDocument.modules.push(moduleModel._id);

    await registeredAppModelDocument.save();

    return RegisteredModulesService
      .startModuleInstance((<IBaseModuleSubscribe>this.module).toAttachmentFactory(moduleModel));
  }
}

