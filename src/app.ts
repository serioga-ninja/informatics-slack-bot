import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as path from 'path';

import './configs/database';

import SlackRouter from './api/v1/SlackRouter';
import SlackEventRouter from './api/v1/SlackEventRouter';
import SlackCommandsRouter from './api/v1/SlackCommandsRouter';
import IndexRouter from './view-routers/index.router';
import TwitterRouter from './api/v1/TwitterRouter';
import LinkRouter from './api/v1/LinksRouter';

import variables from './configs/variables';
import {NextFunction, Request, Response} from 'express';

import 'rxjs/add/observable/interval';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.configure();
        this.routes();
    }

    private configure() {
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
        this.express.use(express.static('public'));
        this.express.set('views', path.join(__dirname, 'views/'));
        this.express.use(express.static(__dirname + './views'));
        this.express.set('view engine', 'ejs');

        this.express.use(function (req: Request, res: Response, next: NextFunction) {
            let render = res.render;
            res.render = function (...args) {

                args[1] = Object.assign(args[1] || {}, {
                    variables: {
                        version: variables.VERSION,
                        domainUrl: variables.domainUrl
                    }
                });

                render.apply(res, args);
            };
            next();
        });
    }

    // Configure API endpoints.
    private routes(): void {

        // placeholder route handler
        this.express.use('/api/v1/slack', SlackRouter);
        this.express.use('/api/v1/events', SlackEventRouter);
        this.express.use('/api/v1/commands', SlackCommandsRouter);
        this.express.use('/api/v1/social/twitter', TwitterRouter);
        this.express.use('/api/v1/social/links', LinkRouter);

        this.express.use('/', IndexRouter);
    }
}

export default new App().express;