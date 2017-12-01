import * as request from 'request';
import * as qs from 'querystring';
import * as http from 'http';
import {ISlackWebhookRequestBody} from '../interfaces/i-slack-webhook-request-body';
import variables from '../configs/variables';
import RegisteredAppModel from '../modules/slack-apps/models/registered-app.model';

interface ISlackAuthSuccessBody {
    ok: boolean;
    access_token: string;
    scope: string;
    user_id: string;
    team_name: string;
    team_id: string;
    incoming_webhook: {
        url: string;
        channel: string;
        channel_id: string;
        configuration_url: string;
    }
}

export class SlackService {

    static get authUrl(): string {
        return `https://slack.com/oauth/authorize?${qs.stringify({
            client_id: variables.slack.CLIENT_ID,
            scope: 'incoming-webhook,channels:history,im:history,commands',
            redirect_uri: `${variables.domainUrl}/api/v1/events/oauth-callback`
        })}`;
    }

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

    static registerNewChanel(responseBody: ISlackAuthSuccessBody) {
        return new RegisteredAppModel().set({
            incoming_webhook: responseBody.incoming_webhook,
            modules: []
        }).save();
    }

    static chanelAlreadyRegistered(chanelId: string): Promise<boolean> {
        return RegisteredAppModel
            .find({'incoming_webhook.channel_id': chanelId})
            .then(collection => {
                return collection.length > 0;
            })
    }
}

