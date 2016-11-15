import express = require('express');
import _ = require('lodash');
import path = require('path');
import fs = require('fs');
import requestLogger = require('./libs/logger');
import bodyParser = require('body-parser');

let apps = [
    './apps/slack/controller'
];

export = function () {
    let port = process.env.PORT || 4390;
    let router = express();
    router.use(requestLogger);
    // parse application/x-www-form-urlencoded
    router.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    router.use(bodyParser.json())

    apps.forEach((app) => {
        let Controller = require(app);
        return new Controller().register(router);
    });

    router.listen(port, function () {
        console.info(`Listening port ${port}`);
    });
}