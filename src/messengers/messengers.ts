import {IInitializable} from '../core/interfaces';
import globalLogger from '../services/logger.service';
import {SlackModule} from './slack/slack.module';

export class Messengers implements IInitializable {

  activeModules: IInitializable[];

  constructor() {
    this.activeModules = [
      new SlackModule()
    ];
  }

  init() {
    globalLogger.info(`Messengers init`);

    for (const messanger of this.activeModules) {
      globalLogger.info(`${messanger.constructor.name} init`);
      messanger.init();
    }

  }
}
