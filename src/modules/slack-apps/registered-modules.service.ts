import {RegisteredModuleInstance} from '../RegisteredModuleInstance';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ModuleTypes} from '../../enums/module-types';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../models/registered-module.model';
import {ObjectId} from 'mongodb';
import {ModuleAlreadeyStoppedError} from '../Errors';
import {LogService} from '../../services/log.service';

let logService = new LogService('RegisteredModulesService');

export class RegisteredModulesService {

    public static startedInstances: RegisteredModuleInstance[] = [];

    public static stopModuleInstance(id: ObjectId) {
        logService.info(`Trying to stop module ${id}`);
        let inst = RegisteredModulesService.startedInstances.filter(module => {
            return id.equals(module.model._id)
        })[0];

        if (!inst) {
            logService.info(`Module ${id} is not active`);
            throw new ModuleAlreadeyStoppedError();
        }

        inst.destroy();
        RegisteredModulesService.startedInstances = RegisteredModulesService
            .startedInstances.filter(module => !id.equals(module.model._id));

        logService.info('Started instances count: ', RegisteredModulesService.startedInstances.length);
    }

    public static startModuleInstance(inst: RegisteredModuleInstance): void {
        logService.info(`Starting new instance ${inst.model._id}`);
        RegisteredModulesService.startedInstances.push(inst);
    }

    public static saveNewModule(channelId: string, chanelLink: string): Promise<IRegisteredModule> {
        return new RegisteredModuleModel().set(<IRegisteredModule>{
            module_type: ModuleTypes.poltavaNews,
            configuration: {
                frequency: 10
            },
            chanel_id: channelId,
            chanel_link: chanelLink,
        }).save();
    }

    public static activateModuleByModel(model: IRegisteredModuleModelDocument): Promise<IRegisteredModuleModelDocument> {
        return model.set({
            is_active: true
        }).save();
    }

    public static activateModuleByChannelId(moduleType: ModuleTypes, channelId: string): Promise<IRegisteredModuleModelDocument> {
        return RegisteredModuleModel
            .findOne({module_type: moduleType, chanel_id: channelId})
            .then(model => RegisteredModulesService.activateModuleByModel(model));
    }

    public static deactivateModuleByModel(model: IRegisteredModuleModelDocument): Promise<IRegisteredModuleModelDocument> {
        return model.set({
            is_active: false
        }).save();
    }

    public static deactivateModuleByChannelId(channelId: string): Promise<IRegisteredModuleModelDocument> {
        return RegisteredModuleModel
            .findOne({chanel_id: channelId})
            .then(model => RegisteredModulesService.deactivateModuleByModel(model));
    }

    public static moduleIsExists(moduleType: ModuleTypes, chanelId: string): Promise<boolean> {
        return RegisteredModuleModel
            .findOne({module_type: moduleType, chanel_id: chanelId})
            .then(model => {
                return !!model;
            })
    }

}