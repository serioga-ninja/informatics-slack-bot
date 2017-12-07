import {Request, Response} from 'express';
import {RouterClass} from '../Router.class';
import slackAppModule from '../../services/commands.service';

export class SlackCommandsRouter extends RouterClass {

    public informaticsBot(req: Request, res: Response) {
        return slackAppModule
            .execute(req.body.text, req.body)
            .then(result => {
                res.json(result);
            })
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/informatics-bot', this.informaticsBot);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackBoobsRouter = new SlackCommandsRouter();

export default slackBoobsRouter.router;