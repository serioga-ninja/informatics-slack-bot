import {Router} from 'express';
import {IRssItem} from '../interfaces/i-rss-item';
import {RssService} from '../services/rss-service';

export class SlackWebHookRouter {
    router: Router;

    /**
     * Initialize the SlackWebHookRouter
     */
    constructor() {
        this.router = Router();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        let rssService: RssService<IRssItem> = new RssService();

        return rssService.getRssData('http://breakingmad.me/ru/rss').then(items => {
            console.log(items);
        });
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackRoutes = new SlackWebHookRouter();
slackRoutes.init();

export default slackRoutes.router;