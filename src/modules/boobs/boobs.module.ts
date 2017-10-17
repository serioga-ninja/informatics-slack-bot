import {InstagramService} from '../../services/instagram.service';
import {HandleErrorsDecorator} from '../../decorators/handle-errors.decorator';
import {IImageModelDocument, default as ImageModel} from '../../models/image.model';
import * as request from 'request';
import variables from '../../configs/variables';
import {Observable} from 'rxjs/Observable';


const HOUR = 1000 * 60 * 60 * 2; // 2 hours
const POST_DATA_INTERVAL = 1000 * 60 * 60; // 60 minutes

const URLS = [
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

class BoobsModule {

    @HandleErrorsDecorator
    static grabAllData(): Promise<any> {
        let instagramPhotoParser = new InstagramService(URLS, new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g));

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