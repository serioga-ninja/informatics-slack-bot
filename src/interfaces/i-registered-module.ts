import {ModuleTypes} from '../core/enums';
import {IBaseModuleConfiguration} from '../core/interfaces';

import {ITimestamps} from './i-timestamps';

export interface IInstagramConfiguration extends IBaseModuleConfiguration {
  links: string[];
}

export interface IRegisteredModule<T> extends ITimestamps {
  _id: any;
  moduleType: ModuleTypes;
  isActive: boolean;
  chanelId: string;
  chanelLink: string;
  chanelName: string;
  configuration: T;
}

export interface IBaseRegisteredModule extends IRegisteredModule<IBaseModuleConfiguration> {
}
