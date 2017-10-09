import * as request from 'request';

function getMatches(string: string, regex: RegExp, parseFn: (a: any[]) => any): any[] {
    let matches = [];
    let match;
    while (match = regex.exec(string)) {
        matches.push(parseFn(match));
    }
    return matches;
}

export abstract class ParserService<T> {
    urls: string[];
    thumbnailReg: RegExp;

    getTheDom(): Promise<string[]> {
        return <Promise<string[]>>Promise.all(this.urls.map(url => {
            return new Promise(resolve => {
                request.get(url, (err, result) => {
                    resolve((<any>result).body);
                });
            });
        }));
    }

    grabTheData(parseFn: (a: any[]) => T[]): Promise<any> {
        return Promise.all(this.urls.map(url => {
            return new Promise(resolve => {
                request.get(url, (err, result) => {
                    let results: T[] = getMatches((<any>result).body, this.thumbnailReg, parseFn);

                    resolve(results);
                });
            });
        }));
    }
}