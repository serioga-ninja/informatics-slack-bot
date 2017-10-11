import {Request, Response, NextFunction} from 'express';
import {ISlackEventRequestBody} from '../../interfaces/i-slack-event-request-body';
import {RouterClass} from '../../classes/router.class';
import variables from '../../configs/variables';
import * as request from 'request';
import * as qs from 'querystring';

export class SlackEventRouter extends RouterClass {

    public handleEventRequest(req: Request, res: Response, next: NextFunction) {
        let body: ISlackEventRequestBody = req.body;
        res.setHeader('Content-type', 'text/plain');
        res.end(req.body.challenge);
        console.log(req.body);
    }

    public handleAuthoriseRequest(req: Request, res: Response) {
        let {code} = req.query;

        variables.slack.authorization_code = code;

        request({
            method: 'POST',
            url: 'https://slack.com/api/oauth.access',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({
                client_id: variables.slack.CLIENT_ID,
                client_secret: variables.slack.CLIENT_SECRET,
                code: code
            })
        }, (err, result: any) => {
            console.log(result.body);
            variables.slack.access_token = result.body.access_token;
//{"ok":true,"access_token":"xoxp-184994293155-185116495316-189516933925-c048325d377ebd0dd553ac4f93da1011","scope":"identify,commands,incoming-webhook,channels:history,groups:history,im:history","user_id":"U5F3EEK9A","team_name":"Informatics","team_id":"T5EV88M4K","incoming_webhook":{"channel":"@serioga","channel_id":"D5EEQ0SC9","configuration_url":"https:\/\/informatics-2.slack.com\/services\/B7GQC2L2Z","url":"https:\/\/hooks.slack.com\/services\/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"}}

            request({
                method: 'POST',
                url: 'https://slack.com/api/rtm.connect',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                body: qs.stringify({
                    token: variables.slack.access_token
                })
            }, (err, result: any) => {
                // TODO: implement this example https://github.com/theturtle32/WebSocket-Node#client-example
                res.send('OK');
            });
        });

    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/oauth', this.handleEventRequest);
        this.router.get('/oauth-callback', this.handleAuthoriseRequest);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackEventRouter = new SlackEventRouter();

export default slackEventRouter.router;