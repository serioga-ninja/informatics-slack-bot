import variables from '../../../configs/variables';

export type SlackEventTypes =
  | 'message'
  | 'reaction_added'
  | 'team_join'
  ;

export interface IEventChalangeBody {
  token: string;
  challenge: string;
  type: string;
}

export interface IReactionItem {
  type: string;
  channel: string;
  ts: string;
}

export interface ISlackEvent {
  type: SlackEventTypes;
  user: string;
  event_ts: string;

  //#regionReactionItem
  item?: IReactionItem;
  reaction?: string;
  item_user?: string;
  //#endregion

  //#regionMessage
  text?: string;
  client_msg_id?: string;
  ts?: string;
  channel?: string;
  channel_type?: string;
  //#endregion
}

export interface ISlackEventMessage extends ISlackEvent {
  type: 'message';
  text: string;
  client_msg_id: string;
  ts: string;
  channel: string;
  channel_type: string;
}

// https://api.slack.com/events-api#callback_field_overview
export interface ISlackEventRequestBody {
  token: string; // variables.slack.VERIFICATION_TOKEN
  team_id: string;
  api_app_id: string;
  event: ISlackEvent;
  type: string;
  event_id: string;
  event_time: number;
  authed_users: string[];
}

export interface ISlackEventRequestModel extends ISlackEventRequestBody {
  readonly valid: boolean;
}

export class SlackEventRequestModel implements ISlackEventRequestModel {
  token: string; // variables.slack.VERIFICATION_TOKEN
  team_id: string;
  api_app_id: string;
  event: ISlackEvent;
  type: string;
  event_id: string;
  event_time: number;
  authed_users: string[];

  constructor(request: ISlackEventRequestBody) {
    Object.assign(this, request);
  }

  get valid(): boolean {
    return this.token === variables.slack.VERIFICATION_TOKEN;
  }
}
