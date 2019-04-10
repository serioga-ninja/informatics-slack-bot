import {filter} from 'rxjs/operators';
import {ISlackEventRequestModel} from '../models/slack-event.model';

export const SERIOGA_ID = 'U5F3EEK9A';
export const VLADIC_ID = 'U5FTLB6F8';

export const TRAVEL_CHANNEL = 'C6HJ95HMM';

export const isMessage = filter((request: ISlackEventRequestModel) => request.event.type === 'message');
export const vladicsMessages = filter((request: ISlackEventRequestModel) => request.event.user === VLADIC_ID);
export const seriogasMessages = filter((request: ISlackEventRequestModel) => request.event.user === SERIOGA_ID);
export const travelChannel = filter((request: ISlackEventRequestModel) => request.event.channel === TRAVEL_CHANNEL);
export const contains = (phrases: string[]) => filter((request: ISlackEventRequestModel) => {
  const text = request.event.text.toLowerCase();

  for (const phrase of phrases) {
    if (text.indexOf(phrase.toLowerCase()) !== -1) {
      return true;
    }
  }

  return false;
});
