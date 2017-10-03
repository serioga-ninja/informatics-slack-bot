import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import fs = require('fs');
import './configs/database';

import SlackRouter from './api/v1/SlackRouter';
import SlackWebHookRouter from './api/v1/SlackWebHookRouter';
import SlackEventRouter from './api/v1/SlackEventRouter';
import SlackBoobsRouter from './api/v1/SlackBoobsRouter';

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
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/slack', SlackRouter);
        this.express.use('/api/v1/slack', SlackWebHookRouter);
        this.express.use('/api/v1/events', SlackEventRouter);
        this.express.use('/api/v1/boobs', SlackBoobsRouter);
    }

}

export default new App().express;