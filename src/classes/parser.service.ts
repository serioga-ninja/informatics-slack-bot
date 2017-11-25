import * as request from 'request';

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
        return Promise.all(this.urls.map(url => {
            return new Promise(resolve => {
                request.get(url, (err, result) => {
                    let results: T[];
                    if(result) {
                        results = ParserService.getMatches((<any>result).body, this.thumbnailReg, parseFn);
                    } else {
                        console.info(`${url} - undefined`);
                    }

                    resolve(results);
                });
            });
        }));
    }
}