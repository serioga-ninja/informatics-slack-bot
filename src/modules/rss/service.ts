import _ = require('lodash');
import Promise = require('bluebird');
import request = require('request');
import Posts from '../../models/post';
import https = require('https');
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {IRssItem} from '../../interfaces/i-rss-item';
import {App} from '../../interfaces/i-app';

let FeedParser = require('feedparser');

export = class RssService {
    worker

    constructor(private appName: string, private app: App, private body: ISlackRequestBody) {
    }

    private filters = {
        onlyNew: (function (row: IRssItem): Promise<boolean> {
            return Posts.findOne({
                where: {
                    app_name: this.appName,
                    title: row.title,
                    user_id: this.body.user_id
                }
            }).then(post => !post)
        }).bind(this)
    };

    public parse() {
        return Promise.bind(this)
            .then(() => this.getRssData(this.app.rssUrl))
            .then(data => this.filterData(data, this.filters.onlyNew))
            .then(this.saveToDB);
    }

    private saveToDB(data: IRssItem[]): Promise<IRssItem[]> {
        return Promise.all(_.map(data, (row) => {
            return Posts.create(_.extend({
                appName: this.appName,
                user_id: this.body.user_id
            }, row));
        })).then(() => data)
    }

    private getRssData(url: string): Promise<any> {
        return new Promise((resolve) => {
            let req = request(url);
            let feedparser = new FeedParser({});
            let items: Array<IRssItem> = [];

            req.on('response', function (res) {
                var stream = this;

                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

                stream.pipe(feedparser);
            });


            feedparser.on('readable', function () {
                var stream = this
                    , item: IRssItem;

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