import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as path from 'path';

import 'rxjs/add/observable/interval';
import SlackCommandsRouter from './api/v1/SlackCommandsRouter';
import SlackEventRouter from './api/v1/SlackEventRouter';

import SlackRouter from './api/v1/SlackRouter';
import TwitterRouter from './api/v1/TwitterRouter';
import './configs/database';

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
        let env = process.env.NODE_ENV;

        if (['development', 'test', 'local'].indexOf(env) !== -1) {
            this.express.use(morgan('dev', {immediate: true}));
            this.express.use(errorHandler());
        } else if (env === 'production') {
            this.express.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
                stream: fs.createWriteStream(path.join(process.cwd(), 'log', 'access.log'), {
                    flags: 'a',
                    encoding: 'utf-8'
                })
            }));
            this.express.use(errorHandler());
        }

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
