import * as request from 'request';
import * as FeedParser from 'feedparser';
import {Observable} from 'rxjs/Rx';

export class RssService<T> {

    constructor(private url: string) {
    }

    loadRss(): Observable<T[]> {

        return Observable.create(observer => {
            let req = request(this.url);
            let feedparser = new FeedParser({});
            let items: T[] = [];

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
                observer.next(items);
            });
        });
    }

    onlyUnique(items: T[]) {
        return Observable.of(items);
    }
}