import {IInitializable} from '../../core/interfaces';
import globalLogger from '../../services/logger.service';

import {BojanProtection} from './event-subscriptions/event-subscribers/bojan-protection';
import {SuduDomaEvent} from './event-subscriptions/event-subscribers/sudu-doma';


export class SlackModule implements IInitializable {

  eventSubscriptions: IInitializable[];

  constructor() {
    this.eventSubscriptions = [
      new SuduDomaEvent(),
      new BojanProtection()
    ];

  }

  init() {
    globalLogger.info(`SlackModule init`);

    for (const event of this.eventSubscriptions) {
      globalLogger.info(`${event.constructor.name} init`);

      event.init();
    }

  }
}
