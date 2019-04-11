import RegisteredAppModel from '../db/models/registered-app.model';
import RegisteredModuleModel from '../db/models/registered-module.model';
import {ModuleTypes} from './enums';
import {ChanelAlreadyRegisteredError, ChanelNotRegisteredError, ModuleNotExistsError} from './errors';

export class Validation {
  public static async channelRegistered(channelId: string): Promise<void> {
    const count: number = await RegisteredAppModel
      .find({'incomingWebhook.channel_id': channelId})
      .count();

    if (count === 0) {
      throw new ChanelNotRegisteredError();
    }
  }

  public static async channelNotRegistered(channelId: string): Promise<void> {
    const count: number = await RegisteredAppModel
      .find({'incomingWebhook.channel_id': channelId})
      .count();

    if (count > 0) {
      throw new ChanelAlreadyRegisteredError();
    }
  }

  public static async moduleRegistered(channelId: string, moduleType: ModuleTypes): Promise<void> {
    const count: number = await RegisteredModuleModel
      .find({chanelId: channelId, moduleType})
      .count();

    if (count === 0) {
      throw new ModuleNotExistsError(channelId);
    }
  }
}
