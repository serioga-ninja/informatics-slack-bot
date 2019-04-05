import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../db/models/registered-module.model';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ModuleTypes} from '../enums';

export class ModuleQueries {


  public static saveNewModule(channelId: string, chanelLink: string, moduleType: ModuleTypes, chanelName: string): Promise<IRegisteredModuleModelDocument<any>> {
    return new RegisteredModuleModel().set(<IRegisteredModule<any>>{
      moduleType: moduleType,
      chanelName: chanelName,
      configuration: {
        frequency: 10
      },
      chanelId: channelId,
      chanelLink: chanelLink,
    }).save();
  }

  public static moduleIsExists(moduleType: ModuleTypes, chanelId: string): Promise<boolean> {
    return RegisteredModuleModel
      .findOne({moduleType: moduleType, chanelId: chanelId})
      .then((model) => {
        return !!model;
      });
  }

  public static activateModuleByModel(model: IRegisteredModuleModelDocument<any>): Promise<IRegisteredModuleModelDocument<any>> {
    return model.set({
      isActive: true
    }).save();
  }

  public static activateModuleByChannelId(moduleType: ModuleTypes, channelId: string): Promise<IRegisteredModuleModelDocument<any>> {
    return RegisteredModuleModel
      .findOne({moduleType: moduleType, chanelId: channelId})
      .then((model) => ModuleQueries.activateModuleByModel(model));
  }

  public static deactivateModuleByModel(model: IRegisteredModuleModelDocument<any>): Promise<IRegisteredModuleModelDocument<any>> {
    return model.set({
      isActive: false
    }).save();
  }

  public static deactivateModuleByChannelId(moduleType: ModuleTypes, channelId: string): Promise<IRegisteredModuleModelDocument<any>> {
    return RegisteredModuleModel
      .findOne(<IRegisteredModule<any>>{moduleType: moduleType, chanelId: channelId})
      .then((model) => ModuleQueries.deactivateModuleByModel(model));
  }

}
