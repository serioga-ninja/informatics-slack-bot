import {RouterClass} from '../../../core/router.class';

import slackCommandsRouter from './v1/slack-commands-router';
import slackEventRouter from './v1/slack-event-router';

export class SlackRouter extends RouterClass {

  init(): void {
    this.router.use('/events', slackEventRouter.router);
    this.router.use('/commands', slackCommandsRouter.router);
  }
}

const slackRouter = new SlackRouter();

export default slackRouter;
