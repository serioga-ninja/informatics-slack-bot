import {RegisteredModuleInstance} from './RegisteredModuleInstance';
import {IBaseRegisteredModule, IRegisteredModule} from '../../interfaces/i-registered-module';
import {ModuleTypes} from '../../enums/module-types';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../slack-apps/models/registered-module.model';
import {ObjectId} from 'mongodb';
import {ModuleAlreadeyStoppedError} from './Errors';
import {LogService} from '../../services/log.service';

let logService = new LogService('RegisteredModulesService');

export class RegisteredModulesService {

    public static startedInstances: RegisteredModuleInstance[] = [];

    public static stopModuleInstance(id: ObjectId) {
        logService.info(`Trying to stop module ${id}`);
        let inst = RegisteredModulesService.startedInstances.filter(module => {
            return id.equals(module.modelId)
        })[0];

        if (!inst) {
            logService.info(`Module ${id} is not active`);
            throw new ModuleAlreadeyStoppedError();
        }

        inst.destroy();
        RegisteredModulesService.startedInstances = RegisteredModulesService
            .startedInstances.filter(module => !id.equals(module.modelId));

        logService.info('Started instances count: ', RegisteredModulesService.startedInstances.length);
    }

    public static startModuleInstance(inst: RegisteredModuleInstance): void {
        logService.info(`Starting new instance ${inst.modelId}`);
        RegisteredModulesService.startedInstances.push(inst);
    }

    public static saveNewModule(channelId: string, chanelLink: string, moduleType: ModuleTypes): Promise<IRegisteredModuleModelDocument<any>> {
        return new RegisteredModuleModel().set(<IRegisteredModule<any>>{
            moduleType: moduleType,
            configuration: {
                frequency: 10
            },
            chanelId: channelId,
            chanelLink: chanelLink,
        }).save();
    }

    public static activateModuleByModel(model: IRegisteredModuleModelDocument<any>): Promise<IRegisteredModuleModelDocument<any>> {
        return model.set({
            isActive: true
        }).save();
    }

    public static activateModuleByChannelId(moduleType: ModuleTypes, channelId: string): Promise<IRegisteredModuleModelDocument<any>> {
        return RegisteredModuleModel
            .findOne({moduleType: moduleType, chanelId: channelId})
            .then(model => RegisteredModulesService.activateModuleByModel(model));
    }

    public static deactivateModuleByModel(model: IRegisteredModuleModelDocument<any>): Promise<IRegisteredModuleModelDocument<any>> {
        return model.set({
            isActive: false
        }).save();
    }

    public static deactivateModuleByChannelId(moduleType: ModuleTypes, channelId: string): Promise<IRegisteredModuleModelDocument<any>> {
        return RegisteredModuleModel
            .findOne(<IRegisteredModule<any>>{moduleType: moduleType, chanelId: channelId})
            .then(model => RegisteredModulesService.deactivateModuleByModel(model));
    }

    public static moduleIsExists(moduleType: ModuleTypes, chanelId: string): Promise<boolean> {
        return RegisteredModuleModel
            .findOne({moduleType: moduleType, chanelId: chanelId})
            .then(model => {
                return !!model;
            })
    }

}