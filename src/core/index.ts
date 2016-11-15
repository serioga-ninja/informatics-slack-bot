import express = require('express');

export module Interfaces {
    export interface SlackRequestBody {
        token: string
        team_id: string
        team_domain: string
        channel_id: string
        channel_name: string
        user_id: string
        user_name: string
        command: string
        text: string
        response_url: string
    }

    export interface App {
        rssUrl: string
    }

    export interface RssItem {
        title: string
        description: string
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

    export function successResponse(item: Interfaces.RssItem) {
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