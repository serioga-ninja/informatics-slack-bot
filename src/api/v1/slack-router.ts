import {NextFunction, Request, Response} from 'express';
import * as request from 'request';

import {ApiStatusCodes} from '../../configs/api-status-codes';
import configs from '../../configs/variables';
import {RouterClass} from '../router.class';

const clientId = configs.slack.CLIENT_ID;
const clientSecret = configs.slack.CLIENT_SECRET;

export class SlackRouter extends RouterClass {

    public auth(req: Request, res: Response, next: NextFunction) {
        // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
        if (!req.query.code) {
            res.status(ApiStatusCodes.InternalServerError);
            res.send({Error: 'Looks like we\'re not getting code.'});
            console.log('Looks like we\'re not getting code.');
        } else {
            // If it's there...
            // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
            request({
                url: 'https://slack.com/api/oauth.access', // URL to hit
                qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, // Query string data
                method: 'GET', // Specify the method

            }, (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json(body);
                }
            });
        }
    }

    init() {
        this.router.get('/oauth', this.auth);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackRoutes = new SlackRouter();

export default slackRoutes.router;
