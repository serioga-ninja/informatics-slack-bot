import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import 'rxjs/add/observable/interval';

import SlackCommandsRouter from './api/v1/slack-commands-router';
import SlackEventRouter from './api/v1/slack-event-router';
import SlackRouter from './api/v1/slack-router';
import TwitterRouter from './api/v1/twitter-router';
import './configs/database';
import {expressLogger} from './services/logger.service';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    // Run configuration methods on the Express instance.
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
        this.express.use(expressLogger);
        this.express.use(errorHandler());

        if (process.env.NODE_ENV === 'development') {
            // only use in development
            this.express.use(errorHandler());
        }

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
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
