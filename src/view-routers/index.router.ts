import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../classes/router.class';
import serverHtml from '../client-app/Server';
import LinkModel from '../models/link.model';
import {LinkTypes} from '../enums/link-types';
import botApp from '../client-app/reducers/index';
import {createStore} from 'redux';

class IndexRouter extends RouterClass {

    index(req: Request, res: Response, next: NextFunction) {
        res.render('index', {
            // content: serverHtml(req.url, {}),
            // preloadedState: {}
        });
    }

    renderLinks(req: Request, res: Response) {

        return LinkModel
            .aggregate({$match: {type: LinkTypes.InstagramLink}})
            .then(data => {

                let store = createStore(botApp, {
                    links: data
                });

                res.render('index', {
                    content: serverHtml(req.url, store),
                    preloadedState: store.getState()
                });
            });
    }

    init() {
        this.router.get('/links', this.renderLinks);
        // this.router.get('*', this.index);
    }
}

const indexRouter = new IndexRouter();

export default indexRouter.router;