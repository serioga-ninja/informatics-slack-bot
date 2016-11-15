import RssService = require('./service');
import appList = require('../../app-list');
import { Interfaces } from "../../core";
import Promise = require('bluebird');

export = class RssController {

    constructor(private body: Interfaces.SlackRequestBody) {

    }

    public getFeed = Promise.method((appName) => {
        var app: Interfaces.App = appList[appName];
        if (!app) {
            throw new Error('Unknown app');
        }
        return new RssService(appName, app, this.body).parse().then((data) => {
            if (data.length == 0) {
                throw new Error('Thas is all for today :(');
            }
            return data[0];
        });
    })

}