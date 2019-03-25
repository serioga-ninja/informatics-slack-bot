import {WebAPICallResult, WebClient} from '@slack/client';
import {LoggerService} from '../services/logger.service';
import variables from './variables';

export const web = new WebClient(variables.slack.AUTH_TOKEN, {
  logger: new LoggerService('slack')
});

(async () => {
  try {
    await web.auth.test();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

export interface IChatPostMessageResult extends WebAPICallResult {
  channel: string;
  ts: string;
  message: {
    text: string;
  };
}

export default web;
