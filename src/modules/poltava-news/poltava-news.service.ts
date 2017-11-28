import * as request from 'request';
import {ParserService} from '../../classes/parser.service';
import {JSDOM} from 'jsdom';
import PoltavaNewsModel, {IPoltavaNewsModel, IPoltavaNewsModelDocument} from '../../models/poltava-news.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IRegisteredModule} from '../../interfaces/i-registered-module';
import {ModuleTypes} from '../../enums/module-types';
import {RegisteredModuleModel} from '../../models/registered-module.model';

export class PoltavaNewsService extends ParserService<IPoltavaNewsModel> {

    public static activeModules: BehaviorSubject<IRegisteredModule[]> = new BehaviorSubject([]);

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

    public static postToSlack(data: IPoltavaNewsModelDocument[] = [], chanelLink: string): Promise<void> {
        return new Promise(resolve => {
            if (data.length === 0) {
                return resolve();
            }

            request({
                method: 'POST',
                url: chanelLink,
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

    public static registerNewChannel(chanelId: string, chanelLink: string) {
        return new RegisteredModuleModel().set(<IRegisteredModule>{
            module_type: ModuleTypes.poltavaNews,
            configuration: {
                frequency: 10
            },
            chanel_id: chanelId,
            chanel_link: chanelLink,
        }).save().then((model) => {
            let allCollection = PoltavaNewsService.activeModules.getValue();
            allCollection.push(model);
            PoltavaNewsService.activeModules.next(allCollection);
            return model;
        })
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