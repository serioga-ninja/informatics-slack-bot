import * as qs from 'querystring';
import variables from '../../configs/variables';
import {ISlackRequestBody} from './models/i-slack-request-body';

export class SlackHelper {
  public static authorizeUrl(requestBody: ISlackRequestBody): string {
    return `https://slack.com/oauth/authorize?${qs.stringify({
      scope: 'incoming-webhook,commands,chat:write:bot',
      client_id: variables.SLACK.CLIENT_ID,
      redirect_uri: `http://${variables.APP.DOMAIN_URL}/api/v1/events/oauth-callback`,
      team: requestBody.team_id,
      channel_id: requestBody.channel_id
    })}`;
  }
}
