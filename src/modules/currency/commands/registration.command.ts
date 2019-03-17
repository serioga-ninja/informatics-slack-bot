import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import RegisteredAppModel from '../../../models/registered-app.model';
import {IRegisteredModuleModelDocument} from '../../../models/registered-module.model';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ChannelIsRegistered, SimpleCommandResponse} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import {RegisteredModulesService} from '../../core/Modules.service';
import poltavaNewsInstanceFactory from '../../poltava-news/poltava-news-instanace.factory';

class CurrencyRegistrationCommand extends BaseCommand {

  @ChannelIsRegistered
  @SimpleCommandResponse
  async execute(requestBody: ISlackRequestBody): Promise<any> {
    const exists: boolean = await RegisteredModulesService
      .moduleIsExists(ModuleTypes.minFin, requestBody.channel_id);

    if (exists) {
      const moduleModel: IRegisteredModuleModelDocument<any> = await RegisteredModulesService
        .activateModuleByChannelId(ModuleTypes.PoltavaNews, requestBody.channel_id);
      // TODO: use minfin mactory
      // await RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(moduleModel));
    }

    const collection = await RegisteredAppModel
      .find({'incomingWebhook.channel_id': requestBody.channel_id});

    const registeredAppModelDocument = collection[0];

    const moduleModel = await RegisteredModulesService
      .saveNewModule(requestBody.channel_id, registeredAppModelDocument.incomingWebhook.url, ModuleTypes.minFin, requestBody.channel_name);

    registeredAppModelDocument.modules.push(moduleModel._id);

    registeredAppModelDocument.save();

    // TODO
    return RegisteredModulesService
      .startModuleInstance(poltavaNewsInstanceFactory(moduleModel));
  }
}

const currencyRegistrationCommand = new CurrencyRegistrationCommand();

export default currencyRegistrationCommand;
