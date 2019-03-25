import {IRegisteredModuleModelDocument} from '../../db/models/registered-module.model';

import {PostStrategies} from './enums';

export interface IBaseModuleConfiguration {
  frequency: number;
  postStrategy: PostStrategies;
  limit: number;
}

export interface IConfigurationList<T, K> {

  [key: string]: (moduleModel: IRegisteredModuleModelDocument<any>, data?: T) => Promise<K>;

}
