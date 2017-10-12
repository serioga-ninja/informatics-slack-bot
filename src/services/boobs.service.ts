import * as request from 'request';
import {Observable} from 'rxjs/Rx';
import ImageModel, {IImageModel, IImageModelDocument} from '../models/image.model';
import variables from '../configs/variables';
import {HandleErrorsDecorator} from '../decorators/handle-errors.decorator';

const HOUR = 1000 * 60 * 60;
const POST_DATA_INTERVAL = 1000 * 60 * 30; // 30 minutes

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
        'http://instagram.com/man_talk_about_this',
        'http://instagram.com/mens_top_girls',
        'http://instagram.com/beautiful_shapes777',
        'http://instagram.com/top_girl_russia_',
        'http://instagram.com/playboy_moscow',
        'http://instagram.com/exclusive_grls',
        'http://instagram.com/top_hotestgirls_',
        'http://instagram.com/prideallamen',
        'http://instagram.com/classybabesxo'
    ];
    public thumbnailReg: RegExp = new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g);
}

export class BoobsService {

    @HandleErrorsDecorator
    static grabAllData(): Promise<any> {
        let instagramPhotoParser = new InstagramPhotoParser();

        return instagramPhotoParser
            .grabTheData()
            .then(data => instagramPhotoParser.saveToDB(data));
    }

    @HandleErrorsDecorator
    static postDataToSlack(): Promise<any> {
        return ImageModel
            .aggregate(
                {
                    $match: {isPosted: false}
                }
            )
            .sample(1)
            .then((imageModelDocuments: IImageModelDocument[]) => {
                let link = imageModelDocuments.length > 0 ? imageModelDocuments[0].link : 'No more boobs for today!';
                return new Promise(resolve => {
                    request({
                        method: 'POST',
                        url: variables.slack.XXX_CHANEL_URL,
                        json: true,
                        body: {
                            text: link
                        }
                    }, (error, result: any) => {
                        if (imageModelDocuments.length > 0) {

                            return ImageModel.findOneAndUpdate({_id: imageModelDocuments[0]._id}, {
                                isPosted: true
                            }).then(() => resolve());
                        } else {
                            resolve();
                        }
                    })
                });
            });
    }

    constructor() {
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

        BoobsService.grabAllData();
    }

    public getAllImageDocuments(): Promise<IImageModelDocument[]> {
        return ImageModel
            .find({link: /^http/})
            .then((data: IImageModelDocument[]) => data);
    }

    public getAllImages(): Promise<string[]> {
        return this
            .getAllImageDocuments()
            .then(data => {
                return data.map((row: IImageModelDocument) => row.link)
            });
    }

}

let boobsService = new BoobsService();

export default boobsService;