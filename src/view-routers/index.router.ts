import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../classes/router.class';
import {InstagramHelper} from '../helpers/instagram.helper';
import variables from '../configs/variables';
import {TwitterHelper} from '../helpers/twitter.helper';


class IndexRouter extends RouterClass {

    index(req: Request, res: Response, next: NextFunction) {
        res.render('index', {
            apisData: {
                instaGramToken: !!variables.social.instagram.accessToken,
                twitterToken: !!variables.social.twitter.accessToken
            },
            instagramUrl: InstagramHelper.authUrl,
            someRow: new Buffer(Math.random().toString()).toString('hex')
        });
    }

    init() {
        this.router.get('/', this.index);
    }
}

const indexRouter = new IndexRouter();

export default indexRouter.router;