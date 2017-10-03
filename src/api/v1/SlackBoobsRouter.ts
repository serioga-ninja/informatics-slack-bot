import {Request, Response, NextFunction} from 'express';
import {ISlackEventRequestBody} from '../../interfaces/i-slack-event-request-body';
import {RouterClass} from '../../classes/router.class';
import * as request from 'request';

export class SlackBoobsRouter extends RouterClass {

    public getSomeBoobs(req: Request, res: Response, next: NextFunction) {
        let body: ISlackEventRequestBody = req.body;

        request.get('https://www.instagram.com/explore/tags/cats/', (err, result) => {
            let results: string[] = (<any>result).body.match(/(https:\/\/instagram.fiev3-1.fna.fbcdn.net\/[\w\.-]+\/[\w\.-]+\/\w+\.jpg)/g);

            let data = {
                response_type: 'in_channel', // public to the channel
                text: '',
                attachments: [{
                    image_url: results[Math.floor(Math.random() * results.length)]
                }]
            };

            // TODO:  return BOOOBS!

            res.json(data);
        });
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