import {Request, Response} from 'express';
import * as qs from 'querystring';
import * as request from 'request';
import {ApiStatusCodes} from '../../../../configs/api-status-codes';

import variables from '../../../../configs/variables';
import {RouterClass} from '../../../../core/router.class';
import {LoggerService} from '../../../../services/logger.service';
import eventAdapter from '../../event-subscriptions/event-adapter';
import {IEventChalangeBody, ISlackEventRequestBody} from '../../models/slack-event.model';
import {ISlackAuthSuccessBody, SlackService} from '../../slack.service';

const logger = new LoggerService('SlackEventRouter');

export class SlackEventRouter extends RouterClass {

  public handleEventRequest(req: Request, res: Response) {
    const body: ISlackEventRequestBody | IEventChalangeBody = req.body;
    if (body.hasOwnProperty('challenge')) {
      res.setHeader('Content-type', 'text/plain');
      res.end((body as IEventChalangeBody).challenge);

      return;
    }

    logger.info(body);
    eventAdapter.receive(body as ISlackEventRequestBody);

    res.sendStatus(ApiStatusCodes.NoContent);
  }

  public handleAuthoriseRequest(req: Request, res: Response) {
    const {code} = req.query;

    variables.SLACK.authorization_code = code;

    request({
      method: 'POST',
      url: 'https://slack.com/api/oauth.access',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({
        client_id: variables.SLACK.CLIENT_ID,
        client_secret: variables.SLACK.CLIENT_SECRET,
        code: code,
        redirect_uri: `http://${variables.APP.DOMAIN_URL}/api/v1/events/oauth-callback`,
        single_channel: true
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
            return SlackService.registerNewChanel(body, code);
          }
        })
        .then(() => {
          res.send('OK');
        });
    });

  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/', this.handleEventRequest);
    this.router.get('/oauth-callback', this.handleAuthoriseRequest);
  }

}

// Create the SlackRouter, and export its configured Express.Router
const slackEventRouter = new SlackEventRouter();

export default slackEventRouter;
