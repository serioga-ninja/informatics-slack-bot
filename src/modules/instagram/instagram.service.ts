import {RssParserService} from '../core/RssParser.service';
import InstagramLinkModel, {IInstagramLinkModelDocument} from './models/instagram-link.model';
import {IInstagramLinkModel} from './interfaces/i-instagram-link-model';

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
    results: IInstagramLinkModel[];
}

const DOMAIN_URL = 'https://queryfeed.net/instagram?q';

export class InstagramService extends RssParserService<IRssInstagramItem, IInstagramLinkModel> {

    public mapFn(item: IRssInstagramItem) {

        return <IInstagramLinkModel>{
            imageUrl: item.enclosure.url,
            imagePageUrl: item.link
        }
    }

    public static filterLinks(parseDataResults: IParseDataResults[]): Promise<IParseDataResults[]> {
        let allLinks: IInstagramLinkModel[] = parseDataResults
            .map(row => {
                return row.results;
            })
            .reduce((all: IInstagramLinkModel[], current: IInstagramLinkModel[]) => {
                return all.concat(current);
            }, []);

        return InstagramLinkModel
            .find({imageUrl: {$in: allLinks.map(linkObj => linkObj.imageUrl)}})
            .then((objects: IInstagramLinkModelDocument[]) => {
                let existingLinks = objects.map(model => model.imageUrl);

                parseDataResults.forEach(parseRowResult => {
                    parseRowResult.results = parseRowResult.results.filter(link => existingLinks.indexOf(link.imageUrl) === -1);
                });

                return parseDataResults;
            });
    }

    public static saveToDB(parseDataResults: IParseDataResults[]) {
        return Promise.all(parseDataResults.map(row => {
            return Promise.all(row.results.map(linkObj => {
                return new InstagramLinkModel().set(<IInstagramLinkModel>{
                    imageUrl: linkObj.imageUrl,
                    imagePageUrl: linkObj.imagePageUrl,
                    instChanelId: row.chanelId
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