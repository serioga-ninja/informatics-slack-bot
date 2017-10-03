import {Request, Response, NextFunction} from 'express';
import {ISlackEventRequestBody} from '../../interfaces/i-slack-event-request-body';
import {RouterClass} from '../../classes/router.class';

export class SlackBoobsRouter extends RouterClass {

    public getSomeBoobs(req: Request, res: Response, next: NextFunction) {
        let body: ISlackEventRequestBody = req.body;

        let data = {
            response_type: 'in_channel', // public to the channel
            text: '302: Found',
            attachments: [{
                image_url: 'https://http.cat/302.jpg'
            }]
        };

        // TODO:  return BOOOBS!

        res.json(data);
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/', this.getSomeBoobs);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackBoobsRouter = new SlackBoobsRouter();

export default slackBoobsRouter.router;