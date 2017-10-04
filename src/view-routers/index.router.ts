import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../classes/router.class';
import {InstagramHelper} from '../helpers/instagram.helper';
import variables from '../configs/variables';

class IndexRouter extends RouterClass {

    index(req: Request, res: Response, next: NextFunction) {
        res.render('index', {
            apisData: {
                instaGramToken: !!variables.social.instagram.accessToken,
                twitterToken: false
            },
            instagramUrl: InstagramHelper.authUrl
        });
    }

    init() {
        this.router.get('/', this.index);
    }
}

const indexRouter = new IndexRouter();

export default indexRouter.router;