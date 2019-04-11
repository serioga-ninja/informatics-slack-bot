import 'rxjs/add/operator/filter';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {LoggerService} from '../../../services/logger.service';
import {ISlackEventRequestBody, ISlackEventRequestModel, SlackEventRequestModel} from '../models/slack-event.model';
import {isMessage, isReaction} from './filters';

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
      .pipe(isMessage);
  }

  get onReaction(): Observable<ISlackEventRequestModel> {
    return this
      ._slackEvent$
      .pipe(isReaction);
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



