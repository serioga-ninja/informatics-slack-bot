import {Observable} from 'rxjs/Observable';

import RegisteredModuleModel, {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';

import {BaseModuleClass, IBaseModuleClass} from './base-module.class';
import {CONFIG_HAS_CHANGED} from './commands';
import {RegisteredModulesService} from './modules.service';
import {RegisteredModuleInstance} from './registered-moduleInstance';

const PRELOAD_DATA_FREQUENCY = 600000;

export interface IBaseModuleSubscribe extends IBaseModuleClass {
  collectData(): Promise<any>;
  preloadActiveModules(): Promise<any>;
  toAttachmentFactory(module: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance;
}

export abstract class BaseModuleSubscribe extends BaseModuleClass {
  abstract toAttachmentFactory(module: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance;

  // method used to collect all the necessary data
  abstract collectData(): Promise<any>;

  abstract preloadActiveModules(): Promise<any>;

  init(): void {
    super.init();

    Observable
      .interval(PRELOAD_DATA_FREQUENCY)
      .subscribe(() => {
        this.collectData();
      });

    if (this.emitter) {
      this.emitter.on(CONFIG_HAS_CHANGED, async (chanelId: string) => {
        this.logService.info(`Update configure for module ${this.moduleName} chanelId ${chanelId}`);

        const moduleModel = await RegisteredModuleModel.findOne({moduleType: this.moduleType, chanelId: chanelId});

        await this.collectData();

        try {
          await RegisteredModulesService
            .startedInstances
            .find((inst) => moduleModel._id.equals(inst.modelId))
            .init();
        } catch (e) {
          this.logService.error(e);
        }
      });
    }

    this.collectData()
      .then(() => this.preloadActiveModules());

  }
}
