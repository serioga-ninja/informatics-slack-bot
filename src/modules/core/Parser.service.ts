import * as request from 'request';
import {LogService} from '../../services/log.service';

export interface IParseDataResults {
    chanelId: string;
    results: string[];
}

let logService = new LogService('parser');

export abstract class ParserService<T> {

    static getMatches<T>(string: string, regex: RegExp, parseFn: (a: any[]) => T): T[] {
        let matches: T[] = [];
        let match: string[];

        while (match = regex.exec(string)) {
            matches.push(parseFn(match));
        }

        return matches;
    }

    public urls: string[];
    public thumbnailReg: RegExp;

    getTheDom(urls: string[] = this.urls): Promise<string[]> {
        return <Promise<string[]>>Promise.all(urls.map(url => {
            return new Promise(resolve => {
                request.get(url, (err, result) => {
                    resolve((<any>result).body);
                });
            });
        }));
    }

    grabTheData(parseFn: (a: any[]) => any, urls: string[] = this.urls): Promise<any> {
        let data: IParseDataResults[] = [];

        return urls.map(url => {
            return () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        logService.info(`Parsing ${url} start`);
                        request.get(url, (err, result) => {
                            let results: string[] = [];
                            if (result) {
                                results = ParserService.getMatches((<any>result).body, this.thumbnailReg, parseFn);
                            } else {
                                console.info(`${url} - undefined`);
                            }

                            data.push(<IParseDataResults>{
                                chanelId: url.split('/').slice(-1)[0],
                                results
                            });

                            logService.info(`Parsing ${url} done`);

                            resolve(results);
                        });
                    }, 1000);
                });
            }
        }).reduce((prev: Promise<any>, current: any) => {

            return prev.then(current);
        }, Promise.resolve()).then(() => (data));
    }
}