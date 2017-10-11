import * as qs from 'querystring';
import variables from '../configs/variables';

export class SlackHelper {
    static get authUrl(): string {
        return `https://slack.com/oauth/authorize?${qs.stringify({
            client_id: variables.slack.CLIENT_ID,
            scope: 'incoming-webhook,channels:history,im:history,commands',
            redirect_uri: `${variables.domainUrl}/api/v1/events/oauth-callback`
        })}`;
    }
}