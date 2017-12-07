import {ParserService} from '../core/Parser.service';
import {JSDOM} from 'jsdom';
import PoltavaNewsModel, {IPoltavaNewsModelDocument} from './models/poltava-news.model';
import {IPoltavaNewsModel} from './interfaces/i-poltava-news-model';

export class PoltavaNewsService extends ParserService<IPoltavaNewsModel> {

    public static filterData(data: IPoltavaNewsModel[]): Promise<IPoltavaNewsModel[]> {
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

    public static saveToDB(data: IPoltavaNewsModel[]): Promise<IPoltavaNewsModelDocument[]> {
        return Promise.all(data.map(row => {
            return new PoltavaNewsModel().set(<IPoltavaNewsModel>{
                link: row.link,
                postedChannels: [],
                title: row.title,
                imageUrl: row.imageUrl
            }).save();
        }))
    }

    public urls: string[];

    constructor(urls: string[]) {
        super();

        this.urls = urls;
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
}