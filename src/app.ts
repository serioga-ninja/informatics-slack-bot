import express = require('express');
import _ = require('lodash');
import path = require('path');
import fs = require('fs');
import requestLogger = require('./libs/logger');

let apps = [
    './apps/slack/controller'
];

export = function () {
    let port = process.env.PORT || 4390;
    let router = express();
    router.use(requestLogger);

    apps.forEach((app) => {
        let Controller = require(app); 
        return new Controller().register(router);
    });

    router.listen(port, function () {
        console.info(`Listening port ${port}`);
    });
}