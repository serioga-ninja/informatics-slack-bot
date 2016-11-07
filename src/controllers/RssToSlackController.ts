import _ = require('lodash');
import Promise = require('bluebird');
import request = require('request');
import { Posts } from "../models";
import {RssItem, App} from "../interfaces";

var FeedParser = require('feedparser');

var filters = {
    oblyNew: function (row: RssItem): Promise<boolean> {
        return Posts.findOne({ where: { title: row.title } }).then(post => {
            return post ? false : true;
        })
    }
}

export = class RssToSlackController {
    worker

    constructor(public app:App) {
    }

    private parse() {
        return this.getRssData(this.app.rssUrl).then((data) => {
                return this.filterData(data, filters.oblyNew);
            }).then((data) => {
                console.log(data);
            });
    }

    private getRssData(url: string): Promise<any> {
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
                    , item;

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
        // TODO: send to slack
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