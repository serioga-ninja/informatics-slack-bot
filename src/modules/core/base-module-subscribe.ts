import {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';
import {BaseModuleClass, IBaseModuleClass} from './base-module.class';
import {RegisteredModuleInstance} from './registered-moduleInstance';

export interface IBaseModuleSubscribe extends IBaseModuleClass {

  toAttachmentFactory(module: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance;
}

export abstract class BaseModuleSubscribe extends BaseModuleClass {
  abstract toAttachmentFactory(module: IRegisteredModuleModelDocument<any>): RegisteredModuleInstance;
}
