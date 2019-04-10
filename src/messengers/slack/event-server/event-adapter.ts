import 'rxjs/add/operator/filter';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import web, {IChatPostMessageResult} from '../../../configs/slack';
import {LoggerService} from '../../../services/logger.service';
import {ISlackEventRequestBody, ISlackEventRequestModel, SlackEventRequestModel} from '../models/slack-event.model';
import {contains, isMessage, travelChannel, vladicsMessages} from './filters';

/**
 * Legend
 *
 * Users:
 * U5F3EEK9A - serioga
 * U5FTLB6F8 - vladic
 *
 * Channels:
 * C6HJ95HMM - travel
 *
 */

export class EventAdapter {

  public loggerService: LoggerService;
  private lastRequest: ISlackEventRequestModel;
  private _slackEvent$: Subject<ISlackEventRequestModel>;

  constructor() {
    this._slackEvent$ = new Subject();
    this.loggerService = new LoggerService('EventAdapter');
  }

  get onMessage(): Observable<ISlackEventRequestModel> {
    return this
      ._slackEvent$
      .filter((request: ISlackEventRequestModel) => request.event.type === 'message');
  }

  receive(requestBody: ISlackEventRequestBody) {
    const eventModel = new SlackEventRequestModel(requestBody);
    if (!eventModel.valid) {
      return;
    }

    this.lastRequest = eventModel;
    this._slackEvent$.next(eventModel);
  }

}

const eventAdapter = new EventAdapter();

export default eventAdapter;

// kek
eventAdapter
  .onMessage
  .pipe(
    isMessage,
    vladicsMessages,
    travelChannel,
    contains([
      'сиди дома',
      'дома сиди',
      'сиди вдома',
      'вдома сиди',
    ])
  )
  .subscribe(async (message: ISlackEventRequestModel) => {
    const res = await web.chat.postMessage({
      text: 'Сам сиди!',
      channel: message.event.channel
    }) as IChatPostMessageResult;

    eventAdapter.loggerService.info(`A message was posed to conversation ${res.channel} with id ${res.ts} which contains the message ${res.message}`);
  });
