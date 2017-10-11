import * as request from 'request';
import * as qs from 'querystring';

export class SlackService {

    static generateOauthAccessToken(): Promise<any> {
        return new Promise(resolve => {

            request({
                method: 'POST',
                url: 'https://slack.com/api/oauth.access',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                body: qs.stringify({
                    grant_type: 'client_credentials'
                })
            })
        });
    }
}

