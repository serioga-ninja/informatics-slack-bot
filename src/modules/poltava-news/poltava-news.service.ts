import {ILinksToPostModel} from '../../interfaces/i-links-to-post.model';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../models/links-to-post.model';
import {ModuleTypes} from '../core/Enums';
import {RssParserService} from '../core/RssParser.service';

interface IPoltavaNewsRssItem {
    content: string;
    contentSnippet: string;
    isoDate: Date;
    link: string;
    pubDate: Date;
    title: string;
}

export class PoltavaNewsService extends RssParserService<IPoltavaNewsRssItem, ILinksToPostModel> {
    public urls: string[];

    public static filterData(data: ILinksToPostModel[]): Promise<ILinksToPostModel[]> {
        return LinksToPostModel
            .aggregate([{$match: {link: {$in: data.map((row) => row.contentType)}}}])
            .then((objects: ILinksToPostModelDocument[]) => {
                return data
                    .filter((row) => {
                        return !objects.find((obj) => {
                            return obj.contentUrl === row.contentUrl;
                        });
                    });
            });
    }

    public static saveToDB(data: ILinksToPostModel[]): Promise<ILinksToPostModelDocument[]> {
        return Promise.all(data.map((row) => {
            return new LinksToPostModel().set(<ILinksToPostModel>{
                contentUrl: row.contentUrl,
                postedChannels: [],
                title: row.title,
                contentType: ModuleTypes.poltavaNews,
                category: 'poltava-news'
            }).save();
        }));
    }


    constructor(urls: string[]) {
        super();

        this.urls = urls;
    }

    grabTheData(): Promise<ILinksToPostModel[]> {
        return this.getTheData(this.urls[0]);
    }

    public mapFn(item: IPoltavaNewsRssItem) {

        return <ILinksToPostModel>{
            title: item.title,
            contentUrl: item.link,
            postedChannels: []
        };
    }
}
