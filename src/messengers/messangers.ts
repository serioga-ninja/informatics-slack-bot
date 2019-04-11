import {IInitializable} from '../core/interfaces';
import {SlackModule} from './slack/slack.module';

export class Messangers implements IInitializable {

  activeModules: IInitializable[];

  constructor() {
    this.activeModules = [
      new SlackModule()
    ];
  }

  init() {
    for (const messanger of this.activeModules) {
      messanger.init();
    }

  }
}
