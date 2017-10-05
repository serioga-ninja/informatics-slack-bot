import * as request from 'request';
import {Observable} from 'rxjs/Rx';
import ImageModel, {IImageModel, IImageModelDocument} from '../models/image.model';
import variables from '../configs/variables';

const HOUR = 1000 * 60 * 60;
const POST_DATA_INTERVAL = 1000 * 60 * 10; // 10 minutes

function getMatches(string, regex, index): string[] {
    index || (index = 1); // default to the first capturing group
    let matches = [];
    let match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}


interface IPhotoParser {
    urls: string[];
    thumbnailReg: RegExp;

    grabTheData(): Promise<string[]>;
    saveToDB(data: string[]): Promise<any>;
}

abstract class PhotoParser implements IPhotoParser {
    urls: string[];
    thumbnailReg: RegExp;

    grabTheData(filter: boolean = true): Promise<any> {
        return Promise.all(this.urls.map(url => {
            return new Promise(resolve => {
                request.get(url, (err, result) => {
                    let results: string[] = getMatches((<any>result).body, this.thumbnailReg, 1);

                    resolve(results);
                });
            });
        })).then((data: string[][]) => {
            return data
                .reduce((result: string[], current: string[]) => {
                    result = result.concat(current);
                    return result;
                }, []);
        }).then((data: string[]) => {
            if (!filter) {
                return data;
            }

            return new Promise(resolve => {
                return ImageModel
                    .aggregate({$match: {link: {$in: data}}})
                    .exec((err, objects: IImageModelDocument[]) => {
                        resolve(data
                            .filter(link => {
                                return !objects.find((obj) => {
                                    return obj.link === link;
                                });
                            }));
                    });
            });
        });
    }

    saveToDB(data: string[]) {
        return Promise.all(data.map(link => {
            return new ImageModel().set(<IImageModel>{
                link: link
            }).save();
        }))
    }

}

export class InstagramPhotoParser extends PhotoParser {

    public urls: string[] = [
        'http://instagram.com/art_of_ck',
        'http://instagram.com/sensual_models',
        'http://instagram.com/sensuality_bnw',
        'http://instagram.com/classybabesxo'
    ];
    public thumbnailReg: RegExp = new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g);
}

export class BoobsService {

    static grabAllData() {
        let instagramPhotoParser = new InstagramPhotoParser();

        return instagramPhotoParser
            .grabTheData()
            .then(data => instagramPhotoParser.saveToDB(data));
    }

    static postDataToSlack() {
        ImageModel
            .findOne({isPosted: false})
            .select('link')
            .exec((err, imageModelDocument: IImageModelDocument) => {
                if (!imageModelDocument) {
                    // there is no more boobs in the database! we need more!
                    return;
                }

                request({
                    method: 'POST',
                    url: variables.slack.XXX_CHANEL_URL,
                    json: true,
                    body: {
                        text: imageModelDocument.link
                    }
                }, (error, result: any) => {
                    return imageModelDocument.set({
                        isPosted: true
                    }).save();
                })
            });
    }

    init() {
        Observable
            .interval(HOUR)
            .subscribe(data => {
                BoobsService.grabAllData();
            });

        Observable
            .interval(POST_DATA_INTERVAL)
            .subscribe(data => {
                BoobsService.postDataToSlack();
            });
    }

}

let boobsService = new BoobsService();

export default boobsService;