import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../classes/router.class';


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