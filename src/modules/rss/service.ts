import _ = require('lodash');
import Promise = require('bluebird');
import request = require('request');
import { Posts } from "../../models";
import * as core from "../../core";
import https = require('https');
import { Interfaces } from "../../core";

var FeedParser = require('feedparser');

export = class RssService {
    worker

    constructor(private appName: string, private app: core.Interfaces.App, private body: Interfaces.SlackRequestBody) {
    }

    private filters = {
        oblyNew: (function (row: core.Interfaces.RssItem): Promise<boolean> {
            return Posts.findOne({ where: { app_name: this.appName, title: row.title } }).then(post => {
                return post ? false : true;
            })
        }).bind(this)
    }

    public parse() {
        return Promise.bind(this)
            .then(() => this.getRssData(this.app.rssUrl))
            .then(data => this.filterData(data, this.filters.oblyNew))
            .then(this.saveToDB);
    }

    private saveToDB(data: core.Interfaces.RssItem[]): Promise<core.Interfaces.RssItem[]> {
        return Promise.all(_.map(data, (row) => {
            return Posts.create(_.extend({
                appName: this.appName,
                user_id: this.body.user_id
            }, row));
        })).then(() => data)
    }

    private getRssData(url: string): Promise<any> {
        var self = this;
        return new Promise((resolve) => {
            var req = request(url);
            var feedparser = new FeedParser();
            var items: Array<core.Interfaces.RssItem> = [];

            req.on('response', function (res) {
                var stream = this;

                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

                stream.pipe(feedparser);
            });


            feedparser.on('readable', function () {
                var stream = this
                    , item: core.Interfaces.RssItem;

                while (item = stream.read()) {
                    items.push(item);
                }
            });

            feedparser.on('end', () => {
                resolve(items);
            })
        })
    }

    private filterData<RssItem>(data: Array<RssItem>, filter: Function): Promise<RssItem[]> {
        return Promise.filter(data, (row: RssItem) => {
            return filter(row);
        }).then((data) => {
            return data.slice(0, 1);
        });
    }
}