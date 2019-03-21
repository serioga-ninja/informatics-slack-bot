import {Request, Response} from 'express';

import slackAppModule from '../../services/commands.service';
import {RouterClass} from '../Router.class';

export class SlackCommandsRouter extends RouterClass {

  public informaticsBot(req: Request, res: Response) {
    return slackAppModule
      .execute(req.body.text, req.body)
      .then((result) => {
        res.json(result);
      });
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
const slackCommandsRouter = new SlackCommandsRouter();

export default slackCommandsRouter.router;
