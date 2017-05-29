import * as request from 'request';
import * as FeedParser from 'feedparser';

export class RssService<T> {

    getRssData(url: string): Promise<any> {
        return new Promise((resolve) => {
            let req = request(url);
            let feedparser = new FeedParser({});
            let items: Array<T> = [];

            req.on('response', function (res) {
                let stream = this;

                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

                stream.pipe(feedparser);
            });


            feedparser.on('readable', function () {
                let stream = this, item: T;

                while (item = stream.read()) {
                    items.push(item);
                }
            });

            feedparser.on('end', () => {
                resolve(items);
            })
        })
    }
}