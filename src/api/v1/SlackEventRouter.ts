import {NextFunction, Request, Response} from 'express';
import * as qs from 'querystring';
import * as request from 'request';
import variables from '../../configs/variables';
import {ISlackEventRequestBody} from '../../interfaces/i-slack-event-request-body';
import {ISlackAuthSuccessBody, SlackService} from '../../services/slack.service';
import {RouterClass} from '../Router.class';

export class SlackEventRouter extends RouterClass {

    public handleEventRequest(req: Request, res: Response, next: NextFunction) {
        const body: ISlackEventRequestBody = req.body;
        res.setHeader('Content-type', 'text/plain');
        res.end(req.body.challenge);
        console.log(req.body);
    }

    public handleAuthoriseRequest(req: Request, res: Response) {
        const {code} = req.query;

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
                code: code,
                redirect_uri: `http://${variables.domainUrl}/api/v1/events/oauth-callback`
            })
        }, (err, result: any) => {

            if (err) {
                return res.send('Error');
            }
            const body: ISlackAuthSuccessBody = JSON.parse(result.body);
            if (!body.ok) {
                return res.send(body.error);
            }

            return SlackService
                .chanelAlreadyRegistered(body.incoming_webhook.channel_id)
                .then((isRegistered) => {
                    if (isRegistered) {
                        res.send('Chanel already registered.');
                    } else {
                        return SlackService.registerNewChanel(body);
                    }
                })
                .then(() => {
                    res.send('OK');
                });

            // request({
            //     method: 'POST',
            //     url: 'https://slack.com/api/rtm.connect',
            //     headers: {
            //         'Content-type': 'application/x-www-form-urlencoded'
            //     },
            //     body: qs.stringify({
            //         token: variables.slack.access_token
            //     })
            // }, (err, result: any) => {
            //     // TODO: implement this example https://github.com/theturtle32/WebSocket-Node#client-example
            //     res.send('OK');
            // });
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
