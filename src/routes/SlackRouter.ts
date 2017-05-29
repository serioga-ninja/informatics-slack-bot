import {Router, Request, Response, NextFunction} from 'express';
import * as request from 'request';
import configs from '../configs/variables';

let clientId = configs.slack.CLIENT_ID;
let clientSecret = configs.slack.CLIENT_SECRET;

export class SlackRouter {
    router: Router;

    /**
     * Initialize the SlackRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public auth(req: Request, res: Response, next: NextFunction) {
        // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
        if (!req.query.code) {
            res.status(500);
            res.send({'Error': 'Looks like we\'re not getting code.'});
            console.log('Looks like we\'re not getting code.');
        } else {
            // If it's there...
            // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
            request({
                url: 'https://slack.com/api/oauth.access', //URL to hit
                qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
                method: 'GET', //Specify the method

            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(body);
                }
            })
        }
    }

    public doCommand(req: Request, res: Response, next: NextFunction) {
        res.send({});
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/oauth', this.auth);
        this.router.post('/command', this.doCommand);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackRoutes = new SlackRouter();

export default slackRoutes.router;