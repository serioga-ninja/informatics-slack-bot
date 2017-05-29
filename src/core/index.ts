import express = require('express');
import {IRssItem} from '../interfaces/i-rss-item';

export module Interfaces {



    export interface MiddlewareController {
        configureMiddleware(app: express.Express): void
        configureRoutes(app: express.Express): void
    }
}

export module Controllers {
    export abstract class MiddlewareController {
        abstract path: string;
        abstract router: express.Router;

        register(app: express.Express) {
            console.info(`Registering app ${this.path}`);
            app.use(this.path, this.router);
        };
    }
}

export module Helpers {

    export function successResponse(item: IRssItem) {
        return {
            text: item.title,
            "attachments": [
                {
                    "html": item.description
                }
            ]
        };
    }
}