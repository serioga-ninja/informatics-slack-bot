import {IInitializable} from '../../../../core/interfaces';
import {ISlackEventRequestModel} from '../../models/slack-event.model';
import slackWebClient, {IChatPostMessageResult} from '../../slack-web-client';
import eventAdapter from '../event-adapter';
import {textContains, travelChannel, vladicsMessages} from '../filters';

export class SuduDomaEvent implements IInitializable {

  init(): void {
    eventAdapter
      .onMessage
      .pipe(
        vladicsMessages,
        travelChannel,
        textContains([
          'сиди дома',
          'дома сиди',
          'сиди вдома',
          'вдома сиди',
        ])
      )
      .subscribe(async (message: ISlackEventRequestModel) => {
        const res = await slackWebClient.chat.postMessage({
          text: 'Сам сиди!',
          channel: message.event.channel
        }) as IChatPostMessageResult;

        eventAdapter.loggerService.info(`A message was posed to conversation ${res.channel} with id ${res.ts} which contains the message ${res.message}`);
      });
  }
}
