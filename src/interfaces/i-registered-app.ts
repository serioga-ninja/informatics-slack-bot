import {ModuleTypes} from '../enums/module-types';

export interface IRegisteredAppModuleConfiguration {
    frequency: number;
}

export interface IRegisteredApp {
    _id: any;
    incoming_webhook: {
        url: string;
        channel: string;
        channel_id: string;
        configuration_url: string
    };
    modules: {
        module_type: ModuleTypes;
        configuration: IRegisteredAppModuleConfiguration;
    }[];
    createdAt?: Date;
}