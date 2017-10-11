import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../classes/router.class';
import {InstagramHelper} from '../helpers/instagram.helper';
import variables from '../configs/variables';
import {TwitterHelper} from '../helpers/twitter.helper';
import {SlackHelper} from '../helpers/slack.helper';


class IndexRouter extends RouterClass {

    index(req: Request, res: Response, next: NextFunction) {
        res.render('index');
    }

    init() {
        this.router.get('/', this.index);
    }
}

const indexRouter = new IndexRouter();

export default indexRouter.router;