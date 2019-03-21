import {IRegisteredModuleModelDocument} from '../../models/registered-module.model';

import {PostStrategies} from './Enums';

export interface IBaseModuleConfiguration {
  frequency: number;
  postStrategy: PostStrategies;
}

export interface IConfigurationList<T, K> {

    [key: string]: (moduleModel: IRegisteredModuleModelDocument<any>, data?: T) => Promise<K>;

}
