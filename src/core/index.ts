import express = require('express');

export module Interfaces {
    export interface App {
        appName: string
        rssUrl: string
        slackUrl: string
        updateIn: number
    }

    export interface RssItem {
        title: string
        description: Text
        link: string
        pubDate: Date
    }

    export interface PostItem extends RssItem {
        appName: string
        id?: Number
    }

    export interface MiddlewareController {
        configureMiddleware(app: express.Express): void
        configureRoutes(app: express.Express): void
    }
}

export module Controlles {
    export abstract class MiddlewareController {
        abstract path: string;
        abstract router: express.Router;

        register(app: express.Express){
            console.info(`Registering app ${this.path}`);
            app.use(this.path, this.router);
        };
    }
}