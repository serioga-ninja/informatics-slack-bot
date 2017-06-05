import {Router} from 'express';
import {IBreakingMadRssItem} from '../../interfaces/i-breaking-mad-rss-item';
import {RssService} from '../../services/rss-service';
import {IPost, PostModel} from '../../models/post';
import {Observable} from 'rxjs/Rx';

const HOUR = 1000 * 2;
// const HOUR = 1000 * 60 * 60;

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
        let rssService: RssService<IBreakingMadRssItem> = new RssService('http://breakingmad.me/ru/rss');

        // Observable
        //     .interval(HOUR)
        //     .flatMap(() => rssService.loadRss())
        //     .flatMap(items => rssService.onlyUnique(items))
        //     .subscribe(data => {
        //         console.log(`interval`, data);
        //     });

        // return rssService
        //     .getRssData('http://breakingmad.me/ru/rss')
        //     .then(items => {
        //         return new PostModel().set(<IPost>{
        //             title: items[1].title,
        //             description: items[1].description,
        //             link: items[1].link,
        //             pubDate: items[1].pubDate
        //         }).save().then(post => {
        //             console.log(post.title);
        //         });
        //     });
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackWebHookRouter = new SlackWebHookRouter();
slackWebHookRouter.init();

export default slackWebHookRouter.router;