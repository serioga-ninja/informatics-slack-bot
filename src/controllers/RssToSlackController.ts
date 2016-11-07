import _ = require('lodash');
import Promise = require('bluebird');
import request = require('request');
import { Posts } from "../models";
import { RssItem, App, PostItem } from "../interfaces";
import https = require('https');

var FeedParser = require('feedparser');

export = class RssToSlackController {
    worker

    constructor(public app: App) {
    }

    private filters = {
        oblyNew: (function (row: RssItem): Promise<boolean> {
            return Posts.findOne({ where: { app_name: this.app.appName, title: row.title } }).then(post => {
                return post ? false : true;
            })
        }).bind(this)
    }

    private parse() {
        return Promise.bind(this)
            .then(() => this.getRssData(this.app.rssUrl))
            .then(data => this.filterData(data, this.filters.oblyNew))
            .then(this.saveToDB)
            .then(this.sendToSlack);
    }

    private saveToDB(data: RssItem[]): Promise<RssItem[]> {
        return Promise.all(_.map(data, (row) => {
            return Posts.create(_.extend({
                appName: this.app.appName
            }, row));
        })).then(() => {
            return data;
        })
    }

    private getRssData(url: string): Promise<any> {
        var self = this;
        return new Promise((resolve) => {
            var req = request(url);
            var feedparser = new FeedParser();
            var items: Array<RssItem> = [];

            req.on('response', function (res) {
                var stream = this;

                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

                stream.pipe(feedparser);
            });


            feedparser.on('readable', function () {
                var stream = this
                    , item: RssItem;

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
        });
    }

    private sendToSlack(data: Array<RssItem>) {
        data.forEach((row) => {
            var http_options = {
                host: 'hooks.slack.com',
                method: 'post',
                path: this.app.slackUrl,
                headers: {}
            };
            var request_data = {
                text: row.title,
                attachments: [
                    {
                        text: row.link
                    }
                ]
            };

            http_options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(request_data), 'utf-8');
            http_options.headers['Content-type'] = 'application/json';

            var req = https.request(http_options);
            req.write(JSON.stringify(request_data));
            req.end();
        });
    }

    public start() {
        this.worker = setInterval(() => {
            this.parse();
        }, this.app.updateIn);
    }

    public stop() {
        clearInterval(this.worker);
    }
}