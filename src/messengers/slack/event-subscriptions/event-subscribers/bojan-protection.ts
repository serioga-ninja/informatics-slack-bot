import {IInitializable} from '../../../../core/interfaces';
import {ISlackEventRequestModel} from '../../models/slack-event.model';
import slackWebClient from '../../slack-web-client';
import eventAdapter from '../event-adapter';
import {reactionOneOf, seriogasItem} from '../filters';

export class BojanProtection implements IInitializable {
  init(): void {
// kek
    eventAdapter
      .onReaction
      .pipe(
        seriogasItem,
        reactionOneOf([
          'bojan', 'slowpoke'
        ])
      )
      .subscribe(async (message: ISlackEventRequestModel) => {
        await slackWebClient.reactions.remove({
          channel: message.event.item.channel,
          name: message.event.reaction,
          timestamp: message.event.item.ts
        });

        await slackWebClient.reactions.add({
          channel: message.event.item.channel,
          name: 'trollface',
          timestamp: message.event.item.ts
        });
      });
  }
}
