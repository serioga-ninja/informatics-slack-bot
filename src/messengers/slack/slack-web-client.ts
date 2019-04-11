import {WebAPICallResult, WebClient} from '@slack/client';
import variables from '../../configs/variables';
import {LoggerService} from '../../services/logger.service';

export const slackWebClient = new WebClient(variables.SLACK.AUTH_TOKEN, {
  logger: new LoggerService('slack')
});

(async () => {
  try {
    await slackWebClient.auth.test();
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

export default slackWebClient;
