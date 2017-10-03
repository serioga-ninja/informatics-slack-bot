import {Request, Response, NextFunction} from 'express';
import {ISlackEventRequestBody} from '../../interfaces/i-slack-event-request-body';
import {RouterClass} from '../../classes/router.class';

export class SlackEventRouter extends RouterClass {

    public handleEventRequest(req: Request, res: Response, next: NextFunction) {
        let body: ISlackEventRequestBody = req.body;
        res.setHeader('Content-type', 'text/plain');
        res.end(req.body.challenge);
        console.log(req.body);
        // TODO: https://api.slack.com/methods/chat.postMessage
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/oauth', this.handleEventRequest);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackEventRouter = new SlackEventRouter();

export default slackEventRouter.router;