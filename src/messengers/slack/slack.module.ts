import {IInitializable} from '../../core/interfaces';

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
    for (const event of this.eventSubscriptions) {
      event.init();
    }

  }
}
