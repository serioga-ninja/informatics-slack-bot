import RssService = require('./service');
import appList = require('../../app-list');
import {Interfaces} from "../../core";
import Promise = require('bluebird');

export = class RssController {
    private method: Function;
    private args: Array<string>;

    constructor(private body: Interfaces.SlackRequestBody) {
        let attrs = body.text.split(' ');
        let method = this.methods[attrs[0]];
        if (!method) {
            throw new Error('Unknown command!');
        }
        this.method = method;
        this.args = attrs.slice(1);
    }

    private methods = {
        readrss: Promise.method(() => {
            let appName = this.args[0];
            let app: Interfaces.App = appList[appName];
            if (!app) {
                throw new Error('Unknown app');
            }
            return new RssService(appName, app, this.body).parse().then((data) => {
                if (data.length == 0) {
                    throw new Error('That`s is all for today :(');
                }
                return data[0];
            });
        })
    };

    public run() {
        return this.method.apply(this);
    }

}