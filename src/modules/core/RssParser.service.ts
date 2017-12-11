import * as parser from 'rss-parser';
import {LogService} from '../../services/log.service';

let logService = new LogService('RssParserService');

export abstract class RssParserService<T, K> {

    abstract mapFn(item: T): K;

    public getTheData(url: string, mapFn: (item: T) => K = this.mapFn): Promise<K[]> {
        return new Promise((resolve, reject) => {

            logService.info(`Parsing url ${url}`);

            parser.parseURL(url, function (err, parsed) {
                if (err) {
                    logService.info(`Error: ${url}`);
                    return reject(err);
                }

                let res = parsed.feed.entries.map(mapFn);

                logService.info(`Success: ${url}`);
                resolve(res);
            })
        });
    }
}