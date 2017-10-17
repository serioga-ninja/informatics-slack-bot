import {Observable} from 'rxjs/Observable';
import {PoltavaNewsService} from '../../services/poltava-news.service';

const POST_FREQUENCY = 1000 * 60 * 10;

const URLS = [
    'https://poltava.to/news/'
];

class NewsModule {

    init() {
        let poltavaNewsService = new PoltavaNewsService(URLS);

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