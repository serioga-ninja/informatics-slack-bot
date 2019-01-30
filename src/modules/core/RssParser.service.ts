import * as parser from 'rss-parser';
import {LoggerService} from '../../services/logger.service';

const logService = new LoggerService('RssParserService');

export abstract class RssParserService<T, K> {

    abstract mapFn(item: T): K;

    public getTheData(url: string, mapFn: (item: T) => K = this.mapFn): Promise<K[]> {
        return new Promise((resolve, reject) => {

            logService.info(`Parsing url ${url}`);

            parser.parseURL(url, (err, parsed) => {
                if (err) {
                    logService.info(`Error: ${url}`);

                    return reject(err);
                }

                const res = parsed.feed.entries.map(mapFn);

                logService.info(`Success: ${url}`);
                resolve(res);
            });
        });
    }
}
