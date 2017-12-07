import {ModuleTypes} from '../modules/core/Enums';
import {ITimestamps} from './i-timestamps';

export interface IBaseModuleConfiguration {
    frequency: number;
}

export interface IInstagramConfiguration extends IBaseModuleConfiguration {
    links: string[];
}

export interface IRegisteredModule<T> extends ITimestamps {
    _id: any;
    moduleType: ModuleTypes;
    isActive: boolean;
    chanelId: string;
    chanelLink: string;
    configuration: T;
}

export interface IBaseRegisteredModule extends IRegisteredModule<IBaseModuleConfiguration> {
}