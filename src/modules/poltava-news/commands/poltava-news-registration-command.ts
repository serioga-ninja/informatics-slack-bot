import {RegistrationCommand} from '../../../core/modules/commands/registration.command';
import {RecurringModuleInstance} from '../../../core/modules/recurring-moduleInstance';
import {IRegisteredModuleModelDocument} from '../../../db/models/registered-module.model';
import {PoltavaNewsSlackRecurringModule} from '../recurring-modules/slack.recurring-module';

export class PoltavaNewsRegistrationCommand extends RegistrationCommand {
  getRecurringClass(module: IRegisteredModuleModelDocument<any>): RecurringModuleInstance {
    // TODO: change this by switching between different recurring modules
    return new PoltavaNewsSlackRecurringModule(module.id);
  }
}
