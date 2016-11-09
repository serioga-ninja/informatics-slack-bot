import express = require('express');
import * as core from '../../core';
import requestLogger = require('../../libs/logger');

export class SlackController extends core.Controlles.MiddlewareController {

    configureMiddleware(app: express.Express) {
        app.use(requestLogger);
    }

    configureRoutes(app: express.Express) {

    }
}