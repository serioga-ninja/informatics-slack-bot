import {RssParserService} from '../core/RssParser.service';
import PoltavaNewsModel, {IPoltavaNewsModelDocument} from './models/poltava-news.model';
import {IPoltavaNewsModel} from './interfaces/i-poltava-news-model';

interface IPoltavaNewsRssItem {
    content: string;
    contentSnippet: string;
    isoDate: Date;
    link: string;
    pubDate: Date;
    title: string;
}

export class PoltavaNewsService extends RssParserService<IPoltavaNewsRssItem, IPoltavaNewsModel> {

    public mapFn(item: IPoltavaNewsRssItem) {

        return {
            link: item.link,
            title: item.title,
            imageUrl: '',
            postedChannels: []
        }
    }

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
        return this.getTheData(this.urls[0]);
    }
}