import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../classes/router.class';
import {InstagramHelper} from '../helpers/instagram.helper';
import variables from '../configs/variables';
import {TwitterHelper} from '../helpers/twitter.helper';
import {SlackHelper} from '../helpers/slack.helper';


class IndexRouter extends RouterClass {

    index(req: Request, res: Response, next: NextFunction) {
        res.render('index', {
            apisData: {
                instaGramToken: !!variables.social.instagram.accessToken,
                twitterToken: !!variables.social.twitter.accessToken,
                slackToken: !!variables.slack.access_token,
            },
            instagramUrl: InstagramHelper.authUrl,
            slackUrl: SlackHelper.authUrl
        });
    }

    init() {
        this.router.get('/', this.index);
    }
}

const indexRouter = new IndexRouter();

export default indexRouter.router;