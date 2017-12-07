import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import './configs/database';

import SlackRouter from './api/v1/SlackRouter';
import SlackEventRouter from './api/v1/SlackEventRouter';
import SlackCommandsRouter from './api/v1/SlackCommandsRouter';
import TwitterRouter from './api/v1/TwitterRouter';

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
    }

    // Configure API endpoints.
    private routes(): void {

        // placeholder route handler
        this.express.use('/api/v1/slack', SlackRouter);
        this.express.use('/api/v1/events', SlackEventRouter);
        this.express.use('/api/v1/commands', SlackCommandsRouter);
        this.express.use('/api/v1/social/twitter', TwitterRouter);
    }
}

export default new App().express;