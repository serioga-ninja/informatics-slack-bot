import {IRegisteredModuleModelDocument} from '../../models/registered-module.model';

export interface IConfigurationList<T, K> {

    [key: string]: (moduleModel: IRegisteredModuleModelDocument<any>, data?: T) => Promise<K>;

}