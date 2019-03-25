import RegisteredAppModel from '../../../db/models/registered-app.model';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChannelIsRegistered, SimpleCommandResponse} from '../../core/command-decorators';
import {BaseCommand} from '../../core/commands/base-command.class';
import {ModuleTypes} from '../../core/enums';
import {RegisteredModulesService} from '../../core/modules.service';
import poltavaNewsInstanceFactory from '../poltava-news-instanace.factory';

class PoltavaNewsRegistrationCommand extends BaseCommand {

  @ChannelIsRegistered
  @SimpleCommandResponse
  execute(requestBody: ISlackRequestBody): Promise<any> {
    return RegisteredModulesService
      .moduleIsExists(ModuleTypes.PoltavaNews, requestBody.channel_id)
      .then((exists) => {
        if (exists) {
          return RegisteredModulesService
            .activateModuleByChannelId(ModuleTypes.PoltavaNews, requestBody.channel_id)
            .then((moduleModel) => RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(moduleModel)));
        }

        return RegisteredAppModel
          .find({'incomingWebhook.channel_id': requestBody.channel_id})
          .then((collection) => {
            const registeredAppModelDocument = collection[0];

            return RegisteredModulesService
              .saveNewModule(requestBody.channel_id, registeredAppModelDocument.incomingWebhook.url, ModuleTypes.PoltavaNews, requestBody.channel_name)
              .then((moduleModel) => {
                registeredAppModelDocument.modules.push(moduleModel._id);

                registeredAppModelDocument.save();

                return RegisteredModulesService
                  .startModuleInstance(poltavaNewsInstanceFactory(moduleModel));
              });
          });
      });
  }
}

const poltavaNewsRegistrationCommand = new PoltavaNewsRegistrationCommand();

export default poltavaNewsRegistrationCommand;
