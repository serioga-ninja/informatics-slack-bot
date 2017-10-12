import * as request from 'request';
import * as qs from 'querystring';
import * as http from 'http';
import {ISlackWebhookRequestBody} from '../interfaces/i-slack-webhook-request-body';

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

    static postToChanel<T>(url: string, body: ISlackWebhookRequestBody): Promise<T> {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: url,
                json: true,
                body: body
            }, (error: any, response: http.IncomingMessage, body: T) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            })
        });
    }
}

