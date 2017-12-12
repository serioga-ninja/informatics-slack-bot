import {ILinksToPostModel} from '../../interfaces/i-links-to-post.model';
import {ModuleTypes} from '../core/Enums';
import {RssParserService} from '../core/RssParser.service';
import {ILinksToPostModelDocument, LinksToPostModel} from '../../models/links-to-post.model';

interface IRssInstagramItem {
    link: string;
    enclosure: {
        length: string;
        type: string;
        url: string;
    };
}

interface IParseDataResults {
    chanelId: string;
    results: ILinksToPostModel[];
}

const DOMAIN_URL = 'https://queryfeed.net/instagram?q';

export class InstagramService extends RssParserService<IRssInstagramItem, ILinksToPostModel> {

    public mapFn(item: IRssInstagramItem) {

        return <ILinksToPostModel>{
            contentType: ModuleTypes.instagramLinks,
            contentUrl: item.enclosure.url,
            title: item.link
        }
    }

    public static filterLinks(parseDataResults: IParseDataResults[]): Promise<IParseDataResults[]> {
        let allLinks: ILinksToPostModel[] = parseDataResults
            .map(row => {
                return row.results;
            })
            .reduce((all: ILinksToPostModel[], current: ILinksToPostModel[]) => {
                return all.concat(current);
            }, []);

        return LinksToPostModel
            .find({contentUrl: {$in: allLinks.map(linkObj => linkObj.contentUrl)}})
            .then((objects: ILinksToPostModelDocument[]) => {
                let existingLinks = objects.map(model => model.contentUrl);

                parseDataResults.forEach(parseRowResult => {
                    parseRowResult.results = parseRowResult.results.filter(link => existingLinks.indexOf(link.contentUrl) === -1);
                });

                return parseDataResults;
            });
    }

    public static saveToDB(parseDataResults: IParseDataResults[]) {
        return Promise.all(parseDataResults.map(row => {
            return Promise.all(row.results.map(linkObj => {
                return new LinksToPostModel().set(<ILinksToPostModel>{
                    contentUrl: linkObj.contentUrl,
                    title: linkObj.title,
                    category: row.chanelId,
                    contentType: ModuleTypes.instagramLinks
                }).save();
            }));
        }));
    }

    public urls: string[];

    constructor(instagramPublicIds: string[]) {
        super();

        this.urls = instagramPublicIds.map(id => `${DOMAIN_URL}=${id}`);
    }

    public async collectData(): Promise<IParseDataResults[]> {
        let results: IParseDataResults[] = [];

        for (let url of this.urls) {
            try {
                let result = await this.getTheData(url);
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