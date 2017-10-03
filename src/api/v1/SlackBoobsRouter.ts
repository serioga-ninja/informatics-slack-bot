import {Request, Response, NextFunction} from 'express';
import {ISlackEventRequestBody} from '../../interfaces/i-slack-event-request-body';
import {RouterClass} from '../../classes/router.class';
import * as request from 'request';

const thumbnailReg = new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g);

function getMatches(string, regex, index): string[] {
    index || (index = 1); // default to the first capturing group
    let matches = [];
    let match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

export class SlackBoobsRouter extends RouterClass {

    public getSomeBoobs(req: Request, res: Response, next: NextFunction) {
        let body: ISlackEventRequestBody = req.body;

        request.get('https://www.instagram.com/explore/tags/boobs/', (err, result) => {
            let results: string[] = getMatches((<any>result).body, thumbnailReg, 1);

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