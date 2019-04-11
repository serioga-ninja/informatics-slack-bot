import {filter} from 'rxjs/operators';
import variables from '../../../configs/variables';
import {ISlackEventRequestModel} from '../models/slack-event.model';

export const SERIOGA_ID = 'U5F3EEK9A';
export const VLADIC_ID = 'U5FTLB6F8';

export const TRAVEL_CHANNEL = 'C6HJ95HMM';

export const isMessage = filter((request: ISlackEventRequestModel) => request.event.type === 'message');
export const isReaction = filter((request: ISlackEventRequestModel) => request.event.type === 'reaction_added');
export const vladicsMessages = filter((request: ISlackEventRequestModel) => request.event.user === VLADIC_ID);
export const seriogasMessages = filter((request: ISlackEventRequestModel) => request.event.user === SERIOGA_ID);
export const seriogasItem = filter((request: ISlackEventRequestModel) => request.event.item_user === SERIOGA_ID);
export const travelChannel = filter((request: ISlackEventRequestModel) => request.event.channel === TRAVEL_CHANNEL);
export const textContains = (phrases: string[]) => filter((request: ISlackEventRequestModel) => {
  const text = request.event.text.toLowerCase();

  for (const phrase of phrases) {
    if (text.indexOf(phrase.toLowerCase()) !== -1) {
      return true;
    }
  }

  return false;
});
export const reactionOneOf = (reactions: string[]) => filter((request: ISlackEventRequestModel) => reactions.indexOf(request.event.reaction) !== -1);
export const prodEnvironment = filter(() => variables.APP.ENVIRONMENT === 'production');
