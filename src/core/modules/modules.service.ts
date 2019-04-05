import {ObjectId} from 'mongodb';
import {LoggerService} from '../../services/logger.service';
import {ModuleAlreadeyStoppedError} from '../errors';
import {RecurringModuleInstance} from './recurring-moduleInstance';

const logService = new LoggerService('RecurringModulesService');

export class RecurringModulesService {

  public static startedInstances: RecurringModuleInstance[] = [];

  public static stopModuleInstance(id: ObjectId) {
    logService.info(`Trying to stop module ${id}`);
    const inst = RecurringModulesService.startedInstances.filter((module) => {
      return id.equals(module.modelId);
    })[0];

    if (!inst) {
      logService.info(`Module ${id} is not active`);
      throw new ModuleAlreadeyStoppedError();
    }

    inst.destroy();
    RecurringModulesService.startedInstances = RecurringModulesService
      .startedInstances.filter((module) => !id.equals(module.modelId));

    logService.info('Started instances count: ', RecurringModulesService.startedInstances.length);
  }

  public static startModuleInstance(inst: RecurringModuleInstance): void {
    logService.info(`Starting new instance ${inst.modelId}`);
    RecurringModulesService.startedInstances.push(inst);
  }

}
