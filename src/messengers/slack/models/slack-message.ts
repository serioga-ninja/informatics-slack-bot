import {ISlackReaction} from './slack-reaction';

export interface ISlackMessage {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  reactions: ISlackReaction[];
}
