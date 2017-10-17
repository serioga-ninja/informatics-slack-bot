import * as data from './data.json';
import {InstagramService} from '../../services/instagram.service';
import {HandleErrorsDecorator} from '../../decorators/handle-errors.decorator';
import {IImageModelDocument, default as ImageModel} from '../../models/image.model';
import * as request from 'request';
import variables from '../../configs/variables';
import {Observable} from 'rxjs/Observable';


const HOUR = 1000 * 60 * 60 * 2; // 2 hours
const POST_DATA_INTERVAL = 1000 * 60 * 60; // 60 minutes

interface IData {
    urls: {
        instagram: string[]
    };
}

class BoobsModule {

    @HandleErrorsDecorator
    static grabAllData(): Promise<any> {
        let instagramPhotoParser = new InstagramService((<any>data).urls.instagram, new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g));

        return instagramPhotoParser
            .collectData()
            .then(data => InstagramService.filterLinks(data))
            .then(data => InstagramService.saveToDB(data));
    }

    @HandleErrorsDecorator
    static postDataToSlack(): Promise<any> {
        return ImageModel
            .aggregate({$match: {isPosted: false}})
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
                    }, () => {
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

    init() {

        Observable
            .interval(HOUR)
            .subscribe(data => {
                BoobsModule.grabAllData();
            });

        Observable
            .interval(POST_DATA_INTERVAL)
            .subscribe(data => {
                BoobsModule.postDataToSlack();
            });

        BoobsModule.grabAllData();
    }
}

let boobsModule = new BoobsModule();

export default boobsModule;