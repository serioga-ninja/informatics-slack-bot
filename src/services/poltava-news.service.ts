import * as request from 'request';
import {ParserService} from '../classes/parser.service';
import {JSDOM} from 'jsdom';
import PoltavaNewsModel, {IPoltavaNewsModel, IPoltavaNewsModelDocument} from '../models/poltava-news.model';
import {IParserService} from '../interfaces/i-parser-service';
import variables from '../configs/variables';
import {Observable} from 'rxjs/Rx';

const POST_FREQUENCY = 1000 * 60 * 10;
const NEWS_URL = 'https://poltava.to/news/';

class PoltavaNewsService extends ParserService<IPoltavaNewsModel> implements IParserService<IPoltavaNewsModel, IPoltavaNewsModelDocument> {

    urls: string[] = [
        NEWS_URL
    ];

    init() {
        Observable
            .interval(POST_FREQUENCY)
            .subscribe(() => {
                this
                    .grabTheData()
                    .then(data => this.filterData(data))
                    .then(data => this.saveToDB(data))
                    .then(data => this.postToSlack(data));
            });

        this
            .grabTheData()
            .then(data => this.filterData(data))
            .then(data => this.saveToDB(data))
            .then(data => this.postToSlack(data));
    }

    grabTheData(): Promise<IPoltavaNewsModel[]> {
        return this
            .getTheDom()
            .then(bodies => {
                return <IPoltavaNewsModel[][]>bodies.map(body => {
                    let dom = new JSDOM(body);
                    let blocks: Array<Element> = Array.prototype.slice.call(
                        dom.window.document
                            .getElementsByClassName('stream-block')
                    );

                    return blocks
                        .map((h1Elem: Element) => {
                            return <IPoltavaNewsModel>{
                                title: h1Elem.getElementsByClassName('stream-block-title')[0].childNodes[0].textContent,
                                link: 'https:' + (
                                    <any>h1Elem
                                        .getElementsByClassName('stream-block-title')[0].childNodes[0]
                                ).getAttribute('href'),
                                imageUrl: 'https:' + (
                                    <any>h1Elem
                                        .getElementsByClassName('stream-block-left')[0].getElementsByTagName('img')[0]
                                ).getAttribute('src')
                            }
                        });
                })
            })
            .then((res: IPoltavaNewsModel[][]) => {
                return res.reduce((res: IPoltavaNewsModel[], current: IPoltavaNewsModel[]) => {
                    res = res.concat(current);
                    return res;
                }, [])
            });
    }

    filterData(data: IPoltavaNewsModel[]): Promise<IPoltavaNewsModel[]> {
        return PoltavaNewsModel
            .aggregate({$match: {link: {$in: data.map(row => row.link)}}})
            .then((objects: IPoltavaNewsModelDocument[]) => {
                return data
                    .filter(row => {
                        return !objects.find((obj) => {
                            return obj.link === row.link;
                        });
                    })
            });
    }

    saveToDB(data: IPoltavaNewsModel[]): Promise<IPoltavaNewsModelDocument[]> {
        return Promise.all(data.map(row => {
            return new PoltavaNewsModel().set(<IPoltavaNewsModel>{
                link: row.link,
                isPosted: true,
                title: row.title,
                imageUrl: row.imageUrl
            }).save();
        }))
    }

    postToSlack(data: IPoltavaNewsModelDocument[] = []): Promise<void> {
        return new Promise(resolve => {
            if (data.length === 0) {
                return resolve();
            }

            request({
                method: 'POST',
                url: variables.slack.SLACK_NEWS_CHANEL_LINK,
                json: true,
                body: {
                    text: '',
                    attachments: data.map(row => {
                        return {
                            title: row.title,
                            text: row.link,
                            image_url: row.imageUrl
                        }
                    })
                }
            }, (error, result: any) => {
                resolve();
            });
        })
    }

}

let poltavaNewsService = new PoltavaNewsService();

export default poltavaNewsService;