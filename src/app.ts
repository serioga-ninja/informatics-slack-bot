import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as path from 'path';

import './configs/database';

import SlackRouter from './api/v1/SlackRouter';
import SlackWebHookRouter from './api/v1/SlackWebHookRouter';
import SlackEventRouter from './api/v1/SlackEventRouter';
import SlackCommandsRouter from './api/v1/SlackCommandsRouter';
import IndexRouter from './view-routers/index.router';
import InstagramRouter from './api/v1/InstagramRouter';
import TwitterRouter from './api/v1/TwitterRouter';

import boobsService from './services/boobs.service';

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

        this.express.set('views', path.join(__dirname, 'views/'));
        this.express.use(express.static(__dirname + './views'));
        this.express.set('view engine', 'ejs');
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */

        // placeholder route handler
        this.express.use('/', IndexRouter);
        this.express.use('/api/v1/slack', SlackRouter);
        this.express.use('/api/v1/slack', SlackWebHookRouter);
        this.express.use('/api/v1/events', SlackEventRouter);
        this.express.use('/api/v1/commands', SlackCommandsRouter);
        this.express.use('/api/v1/social/instagram', InstagramRouter);
        this.express.use('/api/v1/social/twitter', TwitterRouter);

        boobsService.init();
    }
}

export default new App().express;