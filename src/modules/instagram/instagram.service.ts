import {ILinksToPostModel} from '../../interfaces/i-links-to-post.model';
import {ILinksToPostModelDocument, LinksToPostModel} from '../../models/links-to-post.model';
import {ModuleTypes} from '../core/Enums';
import {RssParserService} from '../core/RssParser.service';

interface IRssInstagramItem {
    link: string;
    enclosure: {
        length: string;
        type: string;
        url: string;
    };
}

export interface IParseDataResults {
    chanelId: string;
    results: ILinksToPostModel[];
}

const DOMAIN_URL = 'https://queryfeed.net/instagram?q';

export class InstagramService extends RssParserService<IRssInstagramItem, ILinksToPostModel> {

    public urls: string[];

    public static filterLinks(parseDataResults: IParseDataResults[]): Promise<IParseDataResults[]> {
        const allLinks: ILinksToPostModel[] = parseDataResults
            .map((row) => {
                return row.results;
            })
            .reduce((all: ILinksToPostModel[], current: ILinksToPostModel[]) => {
                return all.concat(current);
            }, []);

        return LinksToPostModel
            .find({contentUrl: {$in: allLinks.map((linkObj) => linkObj.contentUrl)}})
            .then((objects: ILinksToPostModelDocument[]) => {
                const existingLinks = objects.map((model) => model.contentUrl);

                parseDataResults.forEach((parseRowResult) => {
                    parseRowResult.results = parseRowResult.results.filter((link) => existingLinks.indexOf(link.contentUrl) === -1);
                });

                return parseDataResults;
            });
    }

    public static saveToDB(parseDataResults: IParseDataResults[]) {
        return Promise.all(parseDataResults.map((row) => {
            return Promise.all(row.results.map((linkObj) => {
                return new LinksToPostModel().set(<ILinksToPostModel>{
                    contentUrl: linkObj.contentUrl,
                    title: linkObj.title,
                    category: row.chanelId,
                    contentType: ModuleTypes.instagramLinks
                }).save();
            }));
        }));
    }

    constructor(instagramPublicIds: string[]) {
        super();

        this.urls = instagramPublicIds.map((id) => `${DOMAIN_URL}=${id}`);
    }

    public mapFn(item: IRssInstagramItem) {

        return <ILinksToPostModel>{
            contentType: ModuleTypes.instagramLinks,
            contentUrl: item.enclosure.url,
            title: item.link
        };
    }

    public async collectData(): Promise<IParseDataResults[]> {
        const results: IParseDataResults[] = [];

        for (const url of this.urls) {
            try {
                const result = await this.getTheData(url);
                results.push({
                    chanelId: url.split('q=').slice(-1)[0],
                    results: result
                });
            } catch (e) {
            }
        }

        return results;
    }
}
