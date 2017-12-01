import {ModuleTypes} from '../enums/module-types';

export interface IBaseModuleConfiguration {
    frequency: number;
}

export interface IInstagramConfiguration extends IBaseModuleConfiguration {
    links: string[];
}

export interface IRegisteredModule<T> {
    _id: any;
    module_type: ModuleTypes;
    is_active: boolean;
    chanel_id: string;
    chanel_link: string;
    configuration: T;
    created_at: Date;
}

export interface IBaseRegisteredModule extends IRegisteredModule<IBaseModuleConfiguration> {
}