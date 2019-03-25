import {ParserOptions} from 'rss-parser';

import {LoggerService} from '../../services/logger.service';

const Parser = require('rss-parser');

const logService = new LoggerService('RssParserService');

export abstract class RssParserService<T, K> {

  abstract mapFn(item: T): K;

  public getTheData(url: string, parserOptions?: ParserOptions): Promise<K[]> {
    const parser = new Parser(parserOptions);

    return new Promise((resolve, reject) => {

      logService.info(`Parsing url ${url}`);

      parser.parseURL(url, (err, feed) => {
        if (err) {
          logService.info(`Error: ${url}`);

          return reject(err);
        }

        const res = feed.items.map(this.mapFn);

        logService.info(`Success: ${url}`);
        resolve(res);
      });
    });
  }
}
