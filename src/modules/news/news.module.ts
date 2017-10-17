import {Observable} from 'rxjs/Observable';
import {PoltavaNewsService} from '../../services/poltava-news.service';
import * as data from './data.json';

const POST_FREQUENCY = 1000 * 60 * 10;

class NewsModule {

    init() {
        let poltavaNewsService = new PoltavaNewsService((<any>data).urls.poltava);

        Observable
            .interval(POST_FREQUENCY)
            .subscribe(() => {
                poltavaNewsService
                    .grabTheData()
                    .then(data => PoltavaNewsService.filterData(data))
                    .then(data => PoltavaNewsService.saveToDB(data))
                    .then(data => PoltavaNewsService.postToSlack(data));
            });

        poltavaNewsService
            .grabTheData()
            .then(data => PoltavaNewsService.filterData(data))
            .then(data => PoltavaNewsService.saveToDB(data))
            .then(data => PoltavaNewsService.postToSlack(data));
    }
}

let newsModule = new NewsModule();

export default newsModule;