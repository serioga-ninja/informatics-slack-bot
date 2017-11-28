import {ModuleTypes} from '../enums/module-types';

export interface IRegisteredModule {
    _id?: any;
    module_type: ModuleTypes;
    chanel_id: string;
    chanel_link: string;
    configuration: {
        frequency: number;
    };
    created_at: Date;
}